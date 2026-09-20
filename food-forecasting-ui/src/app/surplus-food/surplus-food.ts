import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  SurplusFoodService,
  SurplusFood as SurplusFoodModel
} from '../services/surplus-food';

@Component({
  selector: 'app-surplus-food',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './surplus-food.html',
  styleUrl: './surplus-food.css'
})
export class SurplusFood implements OnInit {

  surplusDate = '';

  mealType = 'Breakfast';

  mealName = '';

  producedQuantity = 0;

  consumedQuantity = 0;

  surplusQuantity = 0;

  status = 'Available';

  surplusFoods: SurplusFoodModel[] = [];

  loading = false;

  constructor(
    private surplusFoodService: SurplusFoodService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    console.log(
      'Surplus Food page loaded'
    );

    this.surplusDate =
      new Date().toISOString().split('T')[0];

    this.loadSurplusFoods();
  }

  calculateSurplus(): void {

    this.surplusQuantity =
      Number(this.producedQuantity || 0) -
      Number(this.consumedQuantity || 0);

    if (this.surplusQuantity < 0) {

      this.surplusQuantity = 0;
    }

    this.status =
      this.surplusQuantity > 0
        ? 'Available'
        : 'No Surplus';
  }

  loadSurplusFoods(): void {

    this.loading = true;

    this.surplusFoodService
      .getSurplusFoods()
      .subscribe({

        next: (data) => {

          this.surplusFoods = data;

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error loading surplus foods:',
            error
          );

          this.surplusFoods = [];

          this.loading = false;

          this.cdr.detectChanges();

          alert(
            'Unable to load surplus food data.'
          );
        }

      });
  }

  addSurplusFood(): void {

    if (!this.surplusDate) {

      alert(
        'Please select surplus date.'
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

    if (this.producedQuantity <= 0) {

      alert(
        'Produced quantity must be greater than 0.'
      );

      return;
    }

    if (this.consumedQuantity < 0) {

      alert(
        'Consumed quantity cannot be negative.'
      );

      return;
    }

    if (
      this.consumedQuantity >
      this.producedQuantity
    ) {

      alert(
        'Consumed quantity cannot be greater than produced quantity.'
      );

      return;
    }

    this.calculateSurplus();

    if (this.surplusQuantity <= 0) {

      alert(
        'No surplus food is available.'
      );

      return;
    }

    const surplusFood: SurplusFoodModel = {

      surplusDate:
        this.surplusDate,

      mealType:
        this.mealType,

      mealName:
        this.mealName,

      producedQuantity:
        Number(this.producedQuantity),

      consumedQuantity:
        Number(this.consumedQuantity),

      surplusQuantity:
        Number(this.surplusQuantity),

      status:
        this.status
    };

    this.surplusFoodService
      .addSurplusFood(surplusFood)
      .subscribe({

        next: () => {

          alert(
            'Surplus food added successfully.'
          );

          this.surplusDate =
            new Date().toISOString().split('T')[0];

          this.mealType = 'Breakfast';

          this.mealName = '';

          this.producedQuantity = 0;

          this.consumedQuantity = 0;

          this.surplusQuantity = 0;

          this.status = 'Available';

          this.loadSurplusFoods();
        },

        error: (error) => {

          console.error(
            'Error adding surplus food:',
            error
          );

          alert(
            error?.error ||
            'Failed to add surplus food.'
          );
        }

      });
  }

  deleteSurplusFood(id: number): void {

    if (
      !confirm(
        'Are you sure you want to delete this surplus food?'
      )
    ) {
      return;
    }

    this.surplusFoodService
      .deleteSurplusFood(id)
      .subscribe({

        next: () => {

          alert(
            'Surplus food deleted successfully.'
          );

          this.loadSurplusFoods();
        },

        error: (error) => {

          console.error(
            'Error deleting surplus food:',
            error
          );

          alert(
            'Failed to delete surplus food.'
          );
        }

      });
  }

}