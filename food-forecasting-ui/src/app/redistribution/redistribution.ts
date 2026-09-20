import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  RedistributionService,
  Redistribution as RedistributionModel
} from '../services/redistribution';

@Component({
  selector: 'app-redistribution',
  imports: [
    CommonModule,
    FormsModule
  ],
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

  loading = false;

  constructor(
    private redistributionService:
      RedistributionService,

    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    console.log(
      'Redistribution page loaded'
    );

    this.redistributionDate =
      new Date().toISOString().split('T')[0];

    this.loadRedistributions();
  }

  loadRedistributions(): void {

    this.loading = true;

    this.redistributionService
      .getRedistributions()
      .subscribe({

        next: (data) => {

          this.redistributions = data;

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error loading redistributions:',
            error
          );

          this.redistributions = [];

          this.loading = false;

          this.cdr.detectChanges();

          alert(
            'Unable to load redistribution data.'
          );
        }

      });
  }

  addRedistribution(): void {

    if (!this.redistributionDate) {

      alert(
        'Please select redistribution date.'
      );

      return;
    }

    if (!this.mealName.trim()) {

      alert(
        'Please enter meal name.'
      );

      return;
    }

    if (this.quantity <= 0) {

      alert(
        'Quantity must be greater than 0.'
      );

      return;
    }

    if (!this.destination) {

      alert(
        'Please select destination.'
      );

      return;
    }

    if (!this.receiverName.trim()) {

      alert(
        'Please enter receiver name.'
      );

      return;
    }

    const redistribution:
      RedistributionModel = {

      redistributionDate:
        this.redistributionDate,

      mealName:
        this.mealName,

      quantity:
        Number(this.quantity),

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
            'Redistribution added successfully.'
          );

          this.redistributionDate =
            new Date().toISOString().split('T')[0];

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
            error?.error ||
            'Failed to add redistribution.'
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
            'Redistribution deleted successfully.'
          );

          this.loadRedistributions();
        },

        error: (error) => {

          console.error(
            'Error deleting redistribution:',
            error
          );

          alert(
            'Failed to delete redistribution.'
          );
        }

      });
  }

}