// src/model/web.model.ts
export class WebResponseFtv<T> {
    success: boolean;
    message: string;
    data: T;
    statusCode: number;
    page?: number;
    totalPage?: number;
  
    constructor(
      success: boolean,
      message: string,
      data: T,
      statusCode: number,
      page?: number,
      totalPage?: number
    ) {
      this.success = success;
      this.message = message;
      this.data = data;
      this.statusCode = statusCode;
      this.page = page;
      this.totalPage = totalPage
    }
}