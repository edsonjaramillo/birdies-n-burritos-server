import { env } from '@/env';

type CookieOptions = {
  HttpOnly?: boolean;
  SameSite?: 'strict' | 'lax' | 'none';
  'Max-Age'?: number;
  domain?: string;
  path?: string;
};

export class Cookies {
  static httpCookie(cookieName: string, cookieValue: string, expiration: number): string {
    const { NODE_ENV } = env;
    const domain = NODE_ENV === 'production' ? 'https://www.example.com' : 'localhost';

    const cookieOpts: CookieOptions = {
      HttpOnly: true,
      SameSite: 'strict',
      domain,
      path: '/',
      'Max-Age': expiration,
    };

    let cookieString = `${cookieName}=${cookieValue}`;
    Object.entries(cookieOpts).forEach(([key, value]) => {
      cookieString += `; ${key}=${value}`;
    });

    return cookieString;
  }
}
