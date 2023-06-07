export class Expiration {
  static getSeconds(seconds: number) {
    return seconds;
  }
  static getMinutes(minutes: number) {
    return minutes * 60;
  }
  static getHours(hours: number) {
    // 60 * 60 = 3600
    return hours * 3600;
  }
  static getDays(days: number) {
    // 60 * 60 * 24 = 86400
    return days * 86400;
  }
  static getStdEX() {
    return this.getHours(2);
  }

  static accessTokenEX() {
    return this.getMinutes(15);
  }

  static refreshTokenEX() {
    return this.getDays(14);
  }
}
