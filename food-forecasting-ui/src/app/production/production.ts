import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  ProductionService,
  Production as ProductionModel
} from '../services/production';

import {
  ForecastService,
  ForecastResult
} from '../services/forecast';

@Component({
  selector: 'app-production',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './production.html',
  styleUrl: './production.css'
})
export class Production implements OnInit {

  productionDate = '';
  mealType = 'Breakfast';
  mealName = '';
  quantityProduced = 0;
  status = 'Produced';

  productions: ProductionModel[] = [];

  loading = false;
  generatingForecast = false;

  forecastResult: ForecastResult | null = null;
  forecastError = '';

  constructor(
    private productionService: ProductionService,
    private forecastService: ForecastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    console.log('Production page loaded');

    this.productionDate =
      new Date().toISOString().split('T')[0];

    this.loadProductions();
  }

  loadProductions(): void {

    this.loading = true;

    this.productionService.getProductions().subscribe({

      next: (data: ProductionModel[]) => {

        this.productions = data;
        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'Error loading productions:',
          error
        );

        this.productions = [];
        this.loading = false;

        this.cdr.detectChanges();

        alert('Unable to load production data.');
      }

    });
  }

  generateRecommendedProduction(): void {

    if (!this.mealType) {

      alert('Please select meal type.');
      return;
    }

    this.generatingForecast = true;
    this.forecastError = '';
    this.forecastResult = null;

    this.forecastService
      .generateForecast(this.mealType)
      .subscribe({

        next: (result: ForecastResult) => {

          this.forecastResult = result;

          this.quantityProduced =
            result.recommendedProduction;

          this.generatingForecast = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error generating recommended production:',
            error
          );

          this.generatingForecast = false;

          if (error.status === 404) {

            this.forecastError =
              `No previous demand data found for ${this.mealType}.`;

          } else {

            this.forecastError =
              'Unable to generate recommended production.';
          }

          this.cdr.detectChanges();
        }

      });
  }

  addProduction(): void {

    if (!this.productionDate) {

      alert('Please select production date.');
      return;
    }

    if (!this.mealType) {

      alert('Please select meal type.');
      return;
    }

    if (!this.mealName.trim()) {

      alert('Please enter meal name.');
      return;
    }

    if (this.quantityProduced <= 0) {

      alert(
        'Quantity produced must be greater than 0.'
      );

      return;
    }

    const production: ProductionModel = {

      productionDate: this.productionDate,

      mealType: this.mealType,

      mealName: this.mealName,

      quantityProduced:
        Number(this.quantityProduced),

      status: this.status
    };

    this.productionService
      .addProduction(production)
      .subscribe({

        next: () => {

          alert(
            'Production added successfully.'
          );

          this.productionDate =
            new Date().toISOString().split('T')[0];

          this.mealType = 'Breakfast';
          this.mealName = '';
          this.quantityProduced = 0;
          this.status = 'Produced';

          this.forecastResult = null;
          this.forecastError = '';

          this.loadProductions();
        },

        error: (error) => {

          console.error(
            'Error adding production:',
            error
          );

          alert(
            error?.error ||
            'Failed to add production.'
          );
        }

      });
  }

  deleteProduction(id: number): void {

    if (
      !confirm(
        'Are you sure you want to delete this production?'
      )
    ) {
      return;
    }

    this.productionService
      .deleteProduction(id)
      .subscribe({

        next: () => {

          alert(
            'Production deleted successfully.'
          );

          this.loadProductions();
        },

        error: (error) => {

          console.error(
            'Error deleting production:',
            error
          );

          alert(
            'Failed to delete production.'
          );
        }

      });
  }

}