import { Routes } from '@angular/router';

import { Login } from './login/login';
import { Layout } from './layout/layout';
import { Dashboard } from './dashboard/dashboard';
import { Meals } from './meals/meals';
import { DemandComponent } from './demand/demand';
import { Forecast } from './forecast/forecast';
import { Production } from './production/production';
import { Consumption } from './consumption/consumption';
import { SurplusFood } from './surplus-food/surplus-food';
import { Redistribution } from './redistribution/redistribution';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: '',
    component: Layout,
    children: [

      {
        path: 'dashboard',
        component: Dashboard,
        title: 'Dashboard'
      },

      {
        path: 'meals',
        component: Meals,
        title: 'Meals'
      },

      {
        path: 'demand',
        component: DemandComponent,
        title: 'Demand'
      },

      {
        path: 'forecast',
        component: Forecast,
        title: 'Forecast'
      },

      {
        path: 'production',
        component: Production,
        title: 'Production'
      },

      {
        path: 'consumption',
        component: Consumption,
        title: 'Consumption'
      },

      {
        path: 'surplus-food',
        component: SurplusFood,
        title: 'Surplus Food'
      },

      {
        path: 'redistribution',
        component: Redistribution,
        title: 'Redistribution'
      }

    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];