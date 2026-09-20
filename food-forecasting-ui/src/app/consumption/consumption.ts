import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  ConsumptionService,
  Consumption as ConsumptionModel
} from '../services/consumption';

@Component({
  selector: 'app-consumption',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './consumption.html',
  styleUrl: './consumption.css'
})
export class Consumption implements OnInit {

  consumptionDate = '';

  mealType = 'Breakfast';

  mealName = '';

  quantityConsumed = 0;

  status = 'Consumed';

  consumptions: ConsumptionModel[] = [];

  loading = false;

  constructor(
    private consumptionService: ConsumptionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    console.log('Consumption page loaded');

    this.consumptionDate =
      new Date().toISOString().split('T')[0];

    this.loadConsumptions();
  }

  loadConsumptions(): void {

    this.loading = true;

    this.consumptionService
      .getConsumptions()
      .subscribe({

        next: (data) => {

          this.consumptions = data;

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error loading consumption:',
            error
          );

          this.consumptions = [];

          this.loading = false;

          this.cdr.detectChanges();

          alert(
            'Unable to load consumption data.'
          );
        }

      });
  }

  addConsumption(): void {

    if (!this.consumptionDate) {

      alert(
        'Please select consumption date.'
      );

      return;
    }

    if (!this.mealType) {

      alert(
        'Please select meal type.'
      );

      return;
    }

    if (!this.mealName.trim()) {

      alert(
        'Please enter meal name.'
      );

      return;
    }

    if (this.quantityConsumed <= 0) {

      alert(
        'Quantity consumed must be greater than 0.'
      );

      return;
    }

    const consumption: ConsumptionModel = {

      consumptionDate:
        this.consumptionDate,

      mealType:
        this.mealType,

      mealName:
        this.mealName,

      quantityConsumed:
        Number(this.quantityConsumed),

      status:
        this.status

    };

    this.consumptionService
      .addConsumption(consumption)
      .subscribe({

        next: () => {

          alert(
            'Consumption added successfully.'
          );

          this.consumptionDate =
            new Date().toISOString().split('T')[0];

          this.mealType = 'Breakfast';

          this.mealName = '';

          this.quantityConsumed = 0;

          this.status = 'Consumed';

          this.loadConsumptions();
        },

        error: (error) => {

          console.error(
            'Error adding consumption:',
            error
          );

          const message =
            typeof error?.error === 'string'
              ? error.error
              : 'Failed to add consumption.';

          alert(message);
        }

      });
  }

  deleteConsumption(id: number): void {

    if (
      !confirm(
        'Are you sure you want to delete this consumption?'
      )
    ) {
      return;
    }

    this.consumptionService
      .deleteConsumption(id)
      .subscribe({

        next: () => {

          alert(
            'Consumption deleted successfully.'
          );

          this.loadConsumptions();
        },

        error: (error) => {

          console.error(
            'Error deleting consumption:',
            error
          );

          alert(
            'Failed to delete consumption.'
          );
        }

      });
  }

}