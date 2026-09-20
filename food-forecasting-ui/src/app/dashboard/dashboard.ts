import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Meal {
  id?: number;
  mealName: string;
  mealType: string;
  quantity: number;
  status: string;
}

interface Demand {
  id?: number;
  demandDate: string;
  mealType: string;
  expectedPeople: number;
}

interface Production {
  id?: number;
  productionDate: string;
  mealType: string;
  mealName: string;
  quantityProduced: number;
  status: string;
}

interface Consumption {
  id?: number;
  consumptionDate: string;
  mealType: string;
  mealName: string;
  quantityConsumed: number;
  status: string;
}

interface SurplusFood {
  id?: number;
  surplusDate: string;
  mealType: string;
  mealName: string;
  producedQuantity: number;
  consumedQuantity: number;
  surplusQuantity: number;
  status: string;
}

interface Redistribution {
  id?: number;
  redistributionDate: string;
  mealName: string;
  quantity: number;
  destination: string;
  receiverName: string;
  status: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  private apiUrl = 'http://localhost:5003/api';

  // Dashboard counts
  totalMeals = 0;
  todayDemand = 0;
  totalProduction = 0;
  totalConsumption = 0;
  totalSurplus = 0;
  totalRedistributed = 0;

  // Extra dashboard information
  surplusPercentage = 0;
  productionUtilization = 0;

  // Recent data
  recentDemands: Demand[] = [];
  recentProductions: Production[] = [];

  loading = true;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Dashboard loaded');
    this.loadDashboardData();
  }

  loadDashboardData(): void {

    this.loading = true;

    this.http.get<Meal[]>(`${this.apiUrl}/Meals`).subscribe({
      next: (data) => {
        this.totalMeals = data.length;

        console.log('Meals:', data);

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading meals:', error);
      }
    });

    this.http.get<Demand[]>(`${this.apiUrl}/Demands`).subscribe({
      next: (data) => {

        const today = new Date();

        this.todayDemand = data
          .filter(demand => this.isSameDate(demand.demandDate, today))
          .reduce(
            (total, demand) => total + Number(demand.expectedPeople || 0),
            0
          );

        this.recentDemands = [...data]
          .sort(
            (a, b) =>
              new Date(b.demandDate).getTime() -
              new Date(a.demandDate).getTime()
          )
          .slice(0, 5);

        console.log('Demand:', data);

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading demand:', error);
      }
    });

    this.http.get<Production[]>(`${this.apiUrl}/Productions`).subscribe({
      next: (data) => {

        this.totalProduction = data.reduce(
          (total, production) =>
            total + Number(production.quantityProduced || 0),
          0
        );

        this.recentProductions = [...data]
          .sort(
            (a, b) =>
              new Date(b.productionDate).getTime() -
              new Date(a.productionDate).getTime()
          )
          .slice(0, 5);

        console.log('Production:', data);

        this.calculateProductionUtilization();

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading production:', error);
      }
    });

    this.http.get<Consumption[]>(`${this.apiUrl}/Consumptions`).subscribe({
      next: (data) => {

        this.totalConsumption = data.reduce(
          (total, consumption) =>
            total + Number(consumption.quantityConsumed || 0),
          0
        );

        console.log('Consumption:', data);

        this.calculateProductionUtilization();

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading consumption:', error);
      }
    });

    this.http.get<SurplusFood[]>(`${this.apiUrl}/SurplusFoods`).subscribe({
      next: (data) => {

        this.totalSurplus = data.reduce(
          (total, surplus) =>
            total + Number(surplus.surplusQuantity || 0),
          0
        );

        console.log('Surplus:', data);

        this.calculateSurplusPercentage();

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading surplus:', error);
      }
    });

    this.http.get<Redistribution[]>(`${this.apiUrl}/Redistributions`).subscribe({
      next: (data) => {

        this.totalRedistributed = data.reduce(
          (total, redistribution) =>
            total + Number(redistribution.quantity || 0),
          0
        );

        console.log('Redistribution:', data);

        this.loading = false;

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading redistribution:', error);

        this.loading = false;

        this.cdr.detectChanges();
      }
    });
  }

  calculateSurplusPercentage(): void {

    if (this.totalProduction > 0) {

      this.surplusPercentage =
        (this.totalSurplus / this.totalProduction) * 100;

    } else {

      this.surplusPercentage = 0;

    }
  }

  calculateProductionUtilization(): void {

    if (this.totalProduction > 0) {

      this.productionUtilization =
        (this.totalConsumption / this.totalProduction) * 100;

    } else {

      this.productionUtilization = 0;

    }
  }

  isSameDate(dateValue: string, compareDate: Date): boolean {

    const date = new Date(dateValue);

    return (
      date.getFullYear() === compareDate.getFullYear() &&
      date.getMonth() === compareDate.getMonth() &&
      date.getDate() === compareDate.getDate()
    );
  }

}