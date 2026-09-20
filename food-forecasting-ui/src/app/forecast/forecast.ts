import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  ForecastService,
  Forecast as ForecastModel,
  ForecastResult
} from '../services/forecast';

@Component({
  selector: 'app-forecast',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './forecast.html',
  styleUrl: './forecast.css'
})
export class Forecast implements OnInit {

  forecastDate = '';
  mealType = 'Breakfast';
  expectedPeople = 0;

  forecasts: ForecastModel[] = [];

  averageDemand = 0;
  predictedDemand = 0;
  recommendedProduction = 0;

  loading = false;
  generating = false;
  errorMessage = '';

  constructor(
    private forecastService: ForecastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Forecast page loaded');

    this.forecastDate =
      new Date().toISOString().split('T')[0];

    this.loadForecasts();
  }

  loadForecasts(): void {

    console.log('Loading forecast data...');

    this.loading = true;
    this.errorMessage = '';

    this.forecastService.getForecasts().subscribe({

      next: (data: ForecastModel[]) => {

        console.log('Forecast data received:', data);

        this.forecasts = data;
        this.loading = false;

        this.calculateForecast();

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'Error loading forecasts:',
          error
        );

        this.forecasts = [];
        this.loading = false;

        this.calculateForecast();

        this.cdr.detectChanges();
      }

    });
  }

  calculateForecast(): void {

    const selectedMealDemands =
      this.forecasts.filter(
        forecast =>
          forecast.mealType === this.mealType
      );

    if (selectedMealDemands.length === 0) {

      this.averageDemand = 0;
      this.predictedDemand = 0;
      this.recommendedProduction = 0;

      return;
    }

    const totalDemand =
      selectedMealDemands.reduce(
        (sum, forecast) =>
          sum + Number(forecast.expectedPeople || 0),
        0
      );

    this.averageDemand = Math.round(
      totalDemand / selectedMealDemands.length
    );

    this.predictedDemand = this.averageDemand;

    this.recommendedProduction = Math.ceil(
      this.predictedDemand * 1.10
    );
  }

  onMealTypeChange(): void {
    this.calculateForecast();
  }

  addForecast(): void {

    if (!this.forecastDate) {
      alert('Please select forecast date.');
      return;
    }

    if (!this.mealType) {
      alert('Please select meal type.');
      return;
    }

    if (this.expectedPeople <= 0) {
      alert('Expected people must be greater than 0.');
      return;
    }

    const forecast: ForecastModel = {

      demandDate: this.forecastDate,

      mealType: this.mealType,

      expectedPeople: Number(
        this.expectedPeople
      )

    };

    this.forecastService.addForecast(forecast).subscribe({

      next: () => {

        alert('Forecast added successfully.');

        this.forecastDate =
          new Date().toISOString().split('T')[0];

        this.mealType = 'Breakfast';
        this.expectedPeople = 0;

        this.loadForecasts();
      },

      error: (error) => {

        console.error(
          'Error adding forecast:',
          error
        );

        alert('Failed to add forecast.');
      }

    });
  }

  generateForecast(): void {

    if (!this.mealType) {
      alert('Please select meal type.');
      return;
    }

    this.generating = true;
    this.errorMessage = '';

    this.forecastService
      .generateForecast(this.mealType)
      .subscribe({

        next: (result: ForecastResult) => {

          this.averageDemand =
            result.averageDemand;

          this.predictedDemand =
            result.forecastedPeople;

          this.recommendedProduction =
            result.recommendedProduction;

          this.generating = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error generating forecast:',
            error
          );

          this.generating = false;

          if (error.status === 404) {

            this.errorMessage =
              `No previous demand data found for ${this.mealType}.`;

          } else {

            this.errorMessage =
              'Unable to generate forecast.';

          }

          this.cdr.detectChanges();
        }

      });
  }

  deleteForecast(id: number): void {

    if (
      !confirm(
        'Are you sure you want to delete this forecast?'
      )
    ) {
      return;
    }

    this.forecastService.deleteForecast(id).subscribe({

      next: () => {

        alert('Forecast deleted successfully.');

        this.loadForecasts();
      },

      error: (error) => {

        console.error(
          'Error deleting forecast:',
          error
        );

        alert('Failed to delete forecast.');
      }

    });
  }

}