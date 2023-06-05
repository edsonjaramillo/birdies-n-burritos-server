type APIResponseStatus = 'success' | 'error' | 'warning' | 'info';

export class API {
  static res(authorized: boolean, status: APIResponseStatus, data: any, message: string) {
    return { authorized, status, data, message };
  }
}
