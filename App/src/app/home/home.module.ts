import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { ChartModule } from 'angular-highcharts';

import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [{ path: '', component: HomePage }];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ChartModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
