import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  RedistributionService,
  Redistribution as RedistributionModel
} from '../services/redistribution';

@Component({
  selector: 'app-redistribution',
  imports: [CommonModule, FormsModule],
  templateUrl: './redistribution.html',
  styleUrl: './redistribution.css'
})
export class Redistribution implements OnInit {

  redistributionDate = '';

  mealName = '';

  quantity = 0;

  destination = '';

  receiverName = '';

  status = 'Distributed';

  redistributions: RedistributionModel[] = [];

  constructor(
    private redistributionService: RedistributionService
  ) {}

  ngOnInit(): void {
    this.loadRedistributions();
  }

  loadRedistributions(): void {

    this.redistributionService
      .getRedistributions()
      .subscribe({

        next: (data) => {
          this.redistributions = data;
        },

        error: (error) => {
          console.error(
            'Error loading redistributions:',
            error
          );
        }

      });
  }

  addRedistribution(): void {

    if (
      !this.redistributionDate ||
      !this.mealName ||
      this.quantity <= 0 ||
      !this.destination ||
      !this.receiverName
    ) {

      alert(
        'Please enter all redistribution details'
      );

      return;
    }

    const redistribution: RedistributionModel = {

      redistributionDate:
        this.redistributionDate,

      mealName:
        this.mealName,

      quantity:
        this.quantity,

      destination:
        this.destination,

      receiverName:
        this.receiverName,

      status:
        this.status
    };

    this.redistributionService
      .addRedistribution(redistribution)
      .subscribe({

        next: () => {

          alert(
            'Redistribution added successfully'
          );

          this.redistributionDate = '';

          this.mealName = '';

          this.quantity = 0;

          this.destination = '';

          this.receiverName = '';

          this.status = 'Distributed';

          this.loadRedistributions();
        },

        error: (error) => {

          console.error(
            'Error adding redistribution:',
            error
          );

          alert(
            'Failed to add redistribution'
          );
        }

      });
  }

  deleteRedistribution(id: number): void {

    if (
      !confirm(
        'Are you sure you want to delete this redistribution?'
      )
    ) {
      return;
    }

    this.redistributionService
      .deleteRedistribution(id)
      .subscribe({

        next: () => {

          alert(
            'Redistribution deleted successfully'
          );

          this.loadRedistributions();
        },

        error: (error) => {

          console.error(
            'Error deleting redistribution:',
            error
          );

          alert(
            'Failed to delete redistribution'
          );
        }

      });
  }
}