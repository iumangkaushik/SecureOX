import CryptoJS from 'crypto-js';

// Text Encryption Tools
export const encryptText = (text: string, passphrase: string): { data?: string; error?: string } => {
  try {
    if (!text.trim()) return { error: 'Input text is empty' };
    if (!passphrase.trim()) return { error: 'Passphrase is empty' };
    const encrypted = CryptoJS.AES.encrypt(text, passphrase).toString();
    return { data: encrypted };
  } catch (error) {
    console.error('Encryption failed:', error);
    return { error: 'Encryption process failed' };
  }
};

export const decryptText = (ciphertext: string, passphrase: string): { data?: string; error?: string } => {
  try {
    const trimmedCipher = ciphertext.trim();
    if (!trimmedCipher) return { error: 'Ciphertext is empty' };
    if (!passphrase.trim()) return { error: 'Passphrase is empty' };

    const bytes = CryptoJS.AES.decrypt(trimmedCipher, passphrase);
    
    // Check if decryption succeeded (result is valid UTF-8 and contains data)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decrypted && bytes.sigBytes > 0) {
      // Decryption happened but decoding failed (usually wrong key/passphrase)
      return { error: 'Incorrect passphrase' };
    }
    
    if (!decrypted) {
      return { error: 'Incorrect passphrase or corrupted data' };
    }
    
    return { data: decrypted };
  } catch (error) {
    console.error('Decryption failed:', error);
    return { error: 'Invalid ciphertext format' };
  }
};

// Steganography Tools (LSB Algorithm)
export const embedMessage = (image: HTMLImageElement, message: string): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  // Append a termination null character to the message
  const binaryMessage = (message + '\0').split('').map(char => {
    return char.charCodeAt(0).toString(2).padStart(8, '0');
  }).join('');

  if (binaryMessage.length > data.length * 0.75) {
    throw new Error('Message too long for this image');
  }

  for (let i = 0; i < binaryMessage.length; i++) {
    // Only use RGB channels (skip Alpha)
    const channelIndex = i + Math.floor(i / 3); 
    if (channelIndex >= data.length) break;

    // Set the LSB (Least Significant Bit)
    if (binaryMessage[i] === '1') {
      data[channelIndex] |= 1;
    } else {
      data[channelIndex] &= ~1;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL('image/png');
};

export const extractMessage = (image: HTMLImageElement): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  let binaryMessage = '';
  let extractedMessage = '';

  for (let i = 0; i < data.length; i++) {
    // Skip Alpha channel
    if ((i + 1) % 4 === 0) continue;

    binaryMessage += (data[i] & 1).toString();

    if (binaryMessage.length === 8) {
      const charCode = parseInt(binaryMessage, 2);
      if (charCode === 0) break; // Termination character
      extractedMessage += String.fromCharCode(charCode);
      binaryMessage = '';
    }
  }

  return extractedMessage;
};
