import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MealService,
  Meal
} from '../services/meal';

@Component({
  selector: 'app-meals',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './meals.html',
  styleUrl: './meals.css'
})
export class Meals implements OnInit {

  mealName = '';
  mealType = 'Breakfast';
  quantity = 0;

  meals: Meal[] = [];

  loading = false;

  constructor(
    private mealService: MealService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Meals page loaded');
    this.loadMeals();
  }

  loadMeals(): void {

    console.log('Loading meal data...');

    this.loading = true;

    this.mealService.getMeals().subscribe({

      next: (data) => {

        console.log('Meal data received:', data);

        this.meals = data;
        this.loading = false;

        console.log('Meal records:', this.meals);
        console.log('Meal count:', this.meals.length);

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('Error loading meals:', error);

        this.meals = [];
        this.loading = false;

        this.cdr.detectChanges();

        alert('Unable to load meal data');
      }

    });
  }

  addMeal(): void {

    if (
      !this.mealName ||
      this.quantity <= 0
    ) {
      alert('Please enter meal name and quantity');
      return;
    }

    const meal: Meal = {

      mealName: this.mealName,
      mealType: this.mealType,
      quantity: this.quantity,
      status: 'Available'

    };

    this.mealService.addMeal(meal).subscribe({

      next: () => {

        alert('Meal added successfully');

        this.mealName = '';
        this.mealType = 'Breakfast';
        this.quantity = 0;

        this.loadMeals();
      },

      error: (error) => {

        console.error('Error adding meal:', error);

        alert('Failed to add meal');
      }

    });
  }

  deleteMeal(id: number): void {

    if (
      !confirm('Are you sure you want to delete this meal?')
    ) {
      return;
    }

    this.mealService.deleteMeal(id).subscribe({

      next: () => {

        alert('Meal deleted successfully');

        this.loadMeals();
      },

      error: (error) => {

        console.error('Error deleting meal:', error);

        alert('Failed to delete meal');
      }

    });
  }

}