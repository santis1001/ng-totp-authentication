import {HttpClient} from "@angular/common/http";
import {inject, Injectable} from '@angular/core';
import {apiConfig} from "@AppConstants/api.config";
import {ImageScannedStatus} from "@AppPages/generate-code/core/generate-code.types";
import {ApiResponse, getData} from "app/types/api.response";
import {filter, interval, map, switchMap, take} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly http = inject(HttpClient);

  private readonly API_CONFIG = apiConfig;

  registerUser(email: string) {
    return this.http.post<ApiResponse<string>>(this.API_CONFIG.register, {
      email
    }).pipe(getData<string>())
  }

  checkScannedStatus(token: string) {
    return interval(3000)
      .pipe(
        switchMap(_ => this.ping(token)),
        filter(status => status === ImageScannedStatus.SCANNED),
        take(1)
      );
  }

  ping(token: string) {
    return this.http.get<ApiResponse<{ valid: boolean, message: string }>>(this.API_CONFIG.ping(token))
      .pipe(
        getData<{ valid: boolean, message: string }>(),
        map(data => data.valid ? ImageScannedStatus.SCANNED : ImageScannedStatus.NOT_SCANNED)
      )
  }

  validateCode(code: number, email: string) {
    return this.http.post<ApiResponse<{ valid: boolean, message: string }>>(this.API_CONFIG.validate, {
      code, email
    }).pipe(getData<{ valid: boolean, message: string }>())
  }
}
