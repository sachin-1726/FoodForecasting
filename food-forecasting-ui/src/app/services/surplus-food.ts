import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SurplusFood {
  id?: number;
  surplusDate: string;
  mealType: string;
  mealName: string;
  producedQuantity: number;
  consumedQuantity: number;
  surplusQuantity: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class SurplusFoodService {

  private apiUrl = 'http://localhost:5003/api/SurplusFoods';

  constructor(private http: HttpClient) {}

  getSurplusFoods(): Observable<SurplusFood[]> {
    return this.http.get<SurplusFood[]>(this.apiUrl);
  }

  addSurplusFood(surplusFood: SurplusFood): Observable<SurplusFood> {
    return this.http.post<SurplusFood>(
      this.apiUrl,
      surplusFood
    );
  }

  deleteSurplusFood(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}