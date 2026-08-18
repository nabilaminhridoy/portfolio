import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Hash a plaintext password using bcrypt.
 * Used during: user creation, password reset, password change.
 */
export async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, SALT_ROUNDS);
}

/**
 * Verify a plaintext password against the stored bcrypt hash.
 * Used during: NextAuth credentials authorize callback.
 * Returns true if the password matches, false otherwise.
 * Constant-time comparison is built into bcrypt.
 */
export async function verifyPassword(
  plaintext: string,
  hash: string
): Promise<boolean> {
  // Defensive: if hash is empty/invalid, never throw — return false
  if (!hash || typeof hash !== 'string' || !hash.startsWith('$')) {
    return false;
  }
  try {
    return await bcrypt.compare(plaintext, hash);
  } catch {
    return false;
  }
}

/**
 * Generate a cryptographically secure random token for password resets.
 * Returns a URL-safe base64 string (32 bytes of entropy).
 */
export function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes).toString('base64url');
}
