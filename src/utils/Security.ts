import argon2 from 'argon2';

export class Security {
  static async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, { type: argon2.argon2id });
  }

  static async verifyPassword(hash: string, plain: string): Promise<boolean> {
    return argon2.verify(hash, plain, { type: argon2.argon2id });
  }
}
