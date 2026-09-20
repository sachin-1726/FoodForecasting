import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  DemandService,
  Demand
} from '../services/demand';

@Component({
  selector: 'app-demand',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './demand.html',
  styleUrl: './demand.css'
})
export class DemandComponent implements OnInit {

  demandDate = '';
  mealType = 'Breakfast';
  expectedPeople = 0;

  demands: Demand[] = [];

  loading = false;

  constructor(
    private demandService: DemandService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('Demand page loaded');
    this.loadDemands();
  }

  loadDemands(): void {

    console.log('Loading demand data...');

    this.loading = true;

    this.demandService.getDemands().subscribe({

      next: (data) => {

        console.log('Demand data received:', data);

        this.demands = data;
        this.loading = false;

        console.log('Demand records:', this.demands);
        console.log('Demand count:', this.demands.length);

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'Error loading demands:',
          error
        );

        this.demands = [];
        this.loading = false;

        this.cdr.detectChanges();

        alert('Unable to load demand data');
      }

    });
  }

  addDemand(): void {

    if (
      !this.demandDate ||
      this.expectedPeople <= 0
    ) {
      alert('Please enter date and expected people');
      return;
    }

    const demand: Demand = {

      demandDate: this.demandDate,
      mealType: this.mealType,
      expectedPeople: this.expectedPeople

    };

    console.log('Demand being sent:', demand);

    this.demandService.addDemand(demand).subscribe({

      next: (response) => {

        console.log('Demand added:', response);

        alert('Demand added successfully');

        this.demandDate = '';
        this.mealType = 'Breakfast';
        this.expectedPeople = 0;

        this.loadDemands();
      },

      error: (error) => {

        console.error(
          'Error adding demand:',
          error
        );

        alert('Failed to add demand');
      }

    });
  }

  deleteDemand(id: number): void {

    if (
      !confirm(
        'Are you sure you want to delete this demand?'
      )
    ) {
      return;
    }

    this.demandService.deleteDemand(id).subscribe({

      next: () => {

        alert('Demand deleted successfully');

        this.loadDemands();
      },

      error: (error) => {

        console.error(
          'Error deleting demand:',
          error
        );

        alert('Failed to delete demand');
      }

    });
  }

}