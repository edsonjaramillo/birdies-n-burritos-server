export class CacheKeys {
  static accountKey(email: string) {
    return `account:${email}`;
  }
}
