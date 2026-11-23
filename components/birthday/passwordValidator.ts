import { BIRTHDAY_CONFIG } from './config';

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Validates the entered password against configured romantic keys.
 * Case-insensitive, trims whitespace.
 */
export function validateRomanticPassword(input: string): ValidationResult {
  const normalized = input.trim().toLowerCase();

  if (!normalized) {
    return {
      isValid: false,
      message: 'Please whisper the secret passcode to unlock ❤️',
    };
  }

  const isMatch = BIRTHDAY_CONFIG.passwords.some(
    (pwd) => pwd.toLowerCase() === normalized
  );

  if (isMatch) {
    return {
      isValid: true,
    };
  }

  return {
    isValid: false,
    message: 'That’s not the secret key to our story... Try again, my love! ❤️',
  };
}
