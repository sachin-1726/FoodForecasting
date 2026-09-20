import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Consumption {
  id?: number;
  consumptionDate: string;
  mealType: string;
  mealName: string;
  quantityConsumed: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConsumptionService {

  private apiUrl = 'http://localhost:5003/api/Consumptions';

  constructor(private http: HttpClient) {}

  getConsumptions(): Observable<Consumption[]> {
    return this.http.get<Consumption[]>(this.apiUrl);
  }

  addConsumption(consumption: Consumption): Observable<Consumption> {
    return this.http.post<Consumption>(this.apiUrl, consumption);
  }

  deleteConsumption(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}