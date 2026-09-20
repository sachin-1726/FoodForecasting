import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Demand {
  id?: number;
  demandDate: string;
  mealType: string;
  expectedPeople: number;
}

@Injectable({
  providedIn: 'root'
})
export class DemandService {

  private apiUrl = 'http://localhost:5003/api/Demands';

  constructor(private http: HttpClient) {}

  getDemands(): Observable<Demand[]> {
    return this.http.get<Demand[]>(this.apiUrl);
  }

  addDemand(demand: Demand): Observable<Demand> {
    return this.http.post<Demand>(this.apiUrl, demand);
  }

  deleteDemand(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}