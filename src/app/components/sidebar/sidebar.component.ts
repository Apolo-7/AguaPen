import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClassModule } from 'primeng/styleclass';
import { Sidebar } from 'primeng/sidebar';
import { Router } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { AuthService } from '../../services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
const PRIME_MODULES = [
  SidebarModule,
  ButtonModule,
  RippleModule,
  AvatarModule,
  StyleClassModule,
  ImageModule,
  ConfirmPopupModule,
  ToastModule,
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [PRIME_MODULES, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class SidebarComponent implements OnInit {
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  private router = inject(Router);

  sidebarVisible: boolean = false;
  nombres: string | null = '';
  usuario_id: string | null = '';
  apellidos: string | null = '';

  //injector
  private srvAuth = inject(AuthService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.sidebarService.sidebarVisible$.subscribe(
      (visible) => (this.sidebarVisible = visible)
    );

    this.srvAuth.nombres$.subscribe((nombres) => {
      this.nombres = nombres;
    });

    this.srvAuth.usuarioId$.subscribe((usuario_id) => {
      this.usuario_id = usuario_id;
    });

    this.srvAuth.apellidos$.subscribe((apellidos) => {
      this.apellidos = apellidos;
    });

    console.log('Nombre del usuario:', this.nombres);
    console.log('ID del usuario:', this.usuario_id);
    console.log('Apellidos del usuario:', this.apellidos);
  }

  closeCallback(e: any): void {
    this.sidebarService.toggleSidebar();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  menuItems = [
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
          label: 'Productos',
          icon: 'pi pi-shop',
          routerLink: '/home/productos',
          routerActive: 'active',
        },
        {
          label: 'Trabajadores',
          icon: 'pi pi-users',
          routerLink: '/home/usuarios-trabajadores',
        },
        {
          label: 'Registrar',
          icon: 'pi pi-table',
          routerLink: '/home/registros',
        },
      ],
    },
    {
      label: 'Reportes',
      items: [
        {
          label: 'Estaciones',
          icon: 'pi pi-map-marker',
          routerLink: '/home/estaciones',
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

  logout(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estás seguro que deseas cerrar sesión?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Salir',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmado',
          detail: 'Se ha cerrado la sesión',
          life: 3000,
        });

        this.signOut();
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Denegado',
          detail: 'Cancelado',
          life: 3000,
        });
      },
    });
  }

  signOut() {
    this.srvAuth.clearAuthData();
    this.router.navigate(['/auth']);
  }
}
