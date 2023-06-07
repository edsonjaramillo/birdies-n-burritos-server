import type { AnyObj } from '@/types';

type APIResponseStatus = 'success' | 'error' | 'warning' | 'info';

export class API {
  static res(authorized: boolean, status: APIResponseStatus, data: AnyObj, message: string) {
    return { authorized, status, data, message };
  }
}
