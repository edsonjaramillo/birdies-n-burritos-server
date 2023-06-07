import { Request, Response, NextFunction } from 'express';

type ParsedCookies = {
  [key: string]: string;
};

export default function cookieParser(req: Request, res: Response, next: NextFunction) {
  if (req.headers.cookie) {
    // Split the raw cookies by ';'
    const rawCookies: string[] = req.headers.cookie.split(';');
    const parsedCookies: ParsedCookies = {};

    rawCookies.forEach((rawCookie) => {
      // Split each raw cookie by '=' to separate the key and value
      const [key, value] = rawCookie.split('=');

      // Trim the key and decode the value
      parsedCookies[key.trim()] = decodeURIComponent(value);
    });

    // Attach the parsed cookies to the request object
    req.cookies = parsedCookies;
  } else {
    // If no cookies are present, assign an empty object
    req.cookies = {};
  }

  // Move to the next middleware/route handler
  next();
}
