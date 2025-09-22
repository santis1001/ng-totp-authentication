import {map} from "rxjs";

export interface IApiError {
  code: string,
  message: string
}

export interface IApiResponse<T> {
  success: boolean;
  data: T;
  error: null | IApiError;
}

export type ApiResponse<T> = IApiResponse<T>;

export const getData = <T>() => map((response: ApiResponse<T>) => response.data);
