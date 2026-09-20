import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import { Observable } from 'rxjs';

export interface Forecast {

  id?: number;

  demandDate: string;

  mealType: string;

  expectedPeople: number;

}

export interface ForecastResult {

  mealType: string;

  forecastDate: string;

  previousRecordCount: number;

  averageDemand: number;

  forecastedPeople: number;

  recommendedProduction: number;

  message: string;

}

@Injectable({
  providedIn: 'root'
})
export class ForecastService {

  private apiUrl =
    'http://localhost:5003/api/Forecasts';

  constructor(
    private http: HttpClient
  ) {}

  getForecasts(): Observable<Forecast[]> {

    return this.http.get<Forecast[]>(
      this.apiUrl
    );

  }

  addForecast(
    forecast: Forecast
  ): Observable<Forecast> {

    return this.http.post<Forecast>(
      this.apiUrl,
      forecast
    );

  }

  deleteForecast(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );

  }

  generateForecast(
    mealType: string
  ): Observable<ForecastResult> {

    const params = new HttpParams()
      .set('mealType', mealType);

    return this.http.get<ForecastResult>(
      `${this.apiUrl}/generate`,
      {
        params: params
      }
    );

  }

}