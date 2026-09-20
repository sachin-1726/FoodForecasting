import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Production {
  id?: number;
  productionDate: string;
  mealType: string;
  mealName: string;
  quantityProduced: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductionService {

  private apiUrl = 'http://localhost:5003/api/Productions';

  constructor(private http: HttpClient) {}

  getProductions(): Observable<Production[]> {
    return this.http.get<Production[]>(this.apiUrl);
  }

  addProduction(production: Production): Observable<Production> {
    return this.http.post<Production>(this.apiUrl, production);
  }

  deleteProduction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}