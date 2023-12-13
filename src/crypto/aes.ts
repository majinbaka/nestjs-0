import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const algorithm = process.env.CRYPTO_ALGORITHM || 'aes-256-cbc';
const key = process.env.CRYPTO_KEY || randomBytes(32);
const iv = process.env.CRYPTO_IV || randomBytes(16);

export function encrypt(text: string): string {
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function decrypt(encryptedText: string): string {
  const decipher = createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
