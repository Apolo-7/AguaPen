import { Component, inject } from '@angular/core';

import { LayoutService } from '../../services/layout.service';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { MenuitemComponent } from '../menuitem/menuitem.component';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MenuComponent, FormsModule, MenuModule, MenuitemComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  providers: [MessageService],
})
export class MenuComponent {
  private srvAuth = inject(AuthService);
  private messageService = inject(MessageService);
  public userSubscription: Subscription = new Subscription();
  rol_id: string = '';
  model: any[] = [];

  constructor(public layoutService: LayoutService) {}

  ngOnInit() {
    this.datesUser();
    this.model = [
      {
        label: 'Home',
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-home',
            routerLink: '/home/dashboard',
          },
        ],
      },
      {
        label: 'Opciones',
        items: [
          {
            label: 'Usuarios',
            icon: 'pi pi-user',
            routerLink: '/home/roles',
          },
          {
            label: 'Areas',
            icon: 'pi pi-map-marker',
            routerLink: '/home/areas',
          },
          {
            label: 'Productos',
            icon: 'pi pi-shop',
            routerLink: '/home/productos',
          },
          {
            label: 'Vehiculos',
            icon: 'pi pi-car',
            routerLink: '/home/vehiculos',
          },
          {
            label: 'Trabajadores',
            icon: 'pi pi-users',
            routerLink: '/home/trabajadores',
          },
        ],
      },
      {
        label: 'Asignaciones',
        items: [
          {
            label: 'A. Productos',
            icon: 'pi pi-list-check',
            routerLink: '/home/registros',
          },
          {
            label: 'A. Areas ',
            icon: 'pi pi-list-check',
            routerLink: '/home/registros-areas',
          },
          {
            label: 'A. Vehiculos',
            icon: 'pi pi-list-check',
            routerLink: '/home/registros-vehiculos',
          },
        ],
      },
      {
        label: 'Reportes',
        items: [
          {
            label: 'Areas',
            icon: 'pi pi-map-marker',
            routerLink: '/home/reportes-areas',
          },
          {
            label: 'Vehiculos',
            icon: 'pi pi-car',
            routerLink: '/home/reportes-vehiculos',
          },
          {
            label: 'General',
            icon: 'pi pi-th-large',
            routerLink: '/home/reportes',
          },
          {
            label: 'Detalles',
            icon: 'pi pi-id-card',
            routerLink: '/home/reportes-usuarios',
          },
        ],
      },
    ];
  }

  datesUser() {
    this.userSubscription = this.srvAuth.user$.subscribe((user) => {
      if (user) {
        this.rol_id = user.rol_id;
        console.log(this.rol_id);
      }
    });
  }
}
