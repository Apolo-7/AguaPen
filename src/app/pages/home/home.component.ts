import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';

import { CommonModule } from '@angular/common';
import { SplitterModule } from 'primeng/splitter';

import { SidebarComponent } from '../../components/sidebar/sidebar.component';

const PRIMEMG_MODULES = [SplitterModule];
const COMPONENTS = [ToolbarComponent, SidebarComponent];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PRIMEMG_MODULES, COMPONENTS, RouterOutlet, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export default class HomeComponent {}
