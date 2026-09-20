import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Redistribution {
  id?: number;
  redistributionDate: string;
  mealName: string;
  quantity: number;
  destination: string;
  receiverName: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class RedistributionService {

  private apiUrl =
    'http://localhost:5003/api/Redistributions';

  constructor(private http: HttpClient) {}

  getRedistributions(): Observable<Redistribution[]> {
    return this.http.get<Redistribution[]>(this.apiUrl);
  }

  addRedistribution(
    redistribution: Redistribution
  ): Observable<Redistribution> {
    return this.http.post<Redistribution>(
      this.apiUrl,
      redistribution
    );
  }

  deleteRedistribution(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}