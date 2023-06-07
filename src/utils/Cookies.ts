import { env } from '@/env';
import { CookieOptions } from 'express';

export class Cookies {
  static httpCookie(cookieName: string, cookieValue: string, expiration: number): string {
    const { NODE_ENV } = env;
    const domain = NODE_ENV === 'production' ? 'https://www.example.com' : 'localhost';

    const cookieOpts: CookieOptions = {
      httpOnly: true,
      sameSite: 'strict',
      domain,
      path: '/',
      maxAge: expiration,
    };

    let cookieString = `${encodeURIComponent(cookieName)}=${encodeURIComponent(cookieValue)}`;
    Object.entries(cookieOpts).forEach(([key, value]) => {
      switch (key) {
        case 'httpOnly':
          key = 'HttpOnly';
          break;
        case 'sameSite':
          key = 'SameSite';
          break;
        case 'maxAge':
          key = 'Max-Age';
          break;
        default:
          break;
      }
      cookieString += `; ${key}=${value}`;
    });

    return cookieString;
  }
}
