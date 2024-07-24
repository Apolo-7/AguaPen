import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ListService } from '../../services/list.service';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from './../../interfaces/register.interfaces';
import { DialogModule, Dialog } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { RegisterService } from '../../services/register.service';
import { CheckboxModule } from 'primeng/checkbox';
const PRIMENG_MODULES = [
  FieldsetModule,

  TableModule,
  ProgressSpinnerModule,
  InputTextModule,
  IconFieldModule,
  InputIconModule,
  DropdownModule,
  ButtonModule,
  ConfirmDialogModule,
  ToastModule,
  DialogModule,

  CheckboxModule,
];

@Component({
  selector: 'app-usuarios-trabajadores',
  standalone: true,
  imports: [PRIMENG_MODULES, FormsModule],
  templateUrl: './usuarios-trabajadores.component.html',
  styleUrls: ['./usuarios-trabajadores.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export default class UsuariosTrabajadoresComponent implements OnInit {
  loadingSave: boolean = false;
  dialogVisible: boolean = false;
  checked: boolean = false;
  @ViewChild('userDialog') userDialog!: Dialog;

  ListUsersWorkers: User[] = [];
  searchTerm: string = '';
  selectedArea: string = '';
  selectedCargo: string = '';
  loading: boolean = true;

  areaOptions: any[] = [];
  cargoOptions: any[] = [];
  filteredCargoOptions: any[] = [];

  currentUser: User = this.createEmptyUser();

  private srvList = inject(ListService);
  private srvMensajes = inject(MessageService);
  private srvConfirm = inject(ConfirmationService);
  private srvReg = inject(RegisterService);

  ngOnInit(): void {
    this.getListUsuarios();
  }

  createEmptyUser(): User {
    return {
      id_usuario: 0,
      tx_nombre: '',
      tx_cedula: '',
      tx_area: '',
      tx_cargo: '',
      tx_vehiculo: '',
      tx_vehiculo_descripcion: '',
    };
  }

  async getListUsuarios() {
    this.loading = true;
    try {
      const res = await this.srvList.getListUsuarios().toPromise();
      this.ListUsersWorkers = res.data;
      this.areaOptions = this.getUniqueOptions(res.data, 'tx_area');
      this.cargoOptions = this.getUniqueOptions(res.data, 'tx_cargo');
      this.filteredCargoOptions = this.cargoOptions;
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      this.srvMensajes.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al cargar los usuarios.' });
    } finally {
      this.loading = false;
    }
  }

  filterUsers(query: string, area: string, cargo: string): User[] {
    const lowerQuery = query.toLowerCase();
    return this.ListUsersWorkers.filter((user) => {
      const matchName = user.tx_nombre?.toLowerCase().includes(lowerQuery);
      const matchCedula = user.tx_cedula?.toLowerCase().includes(lowerQuery);
      const matchArea = !area || user.tx_area === area;
      const matchCargo = !cargo || user.tx_cargo === cargo;
      return (matchName || matchCedula) && matchArea && matchCargo;
    });
  }

  getUniqueOptions(data: any[], field: string): any[] {
    return [...new Set(data.map(item => item[field]))]
      .filter(value => value != null)
      .map(value => ({ label: value, value }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  clearSearchTerm() {
    this.searchTerm = '';
  }

  clearSelectedArea() {
    this.selectedArea = '';
    this.filteredCargoOptions = this.cargoOptions;
  }

  clearSelectedCargo() {
    this.selectedCargo = '';
  }

  showDialog(user: User | null) {
    this.loadingSave = false; // Reiniciar el estado de loadingSave
    if (user) {
      this.currentUser = { ...user };
    } else {
      this.currentUser = this.createEmptyUser();
    }
    this.dialogVisible = true;
  }

  async saveUser() {
    if (this.validateUser(this.currentUser)) {
      this.loadingSave = true;
      try {
        if (this.currentUser.id_usuario > 0) {
          await this.updateUser(this.currentUser);
        } else {
          await this.createUser(this.currentUser);
        }
        this.dialogVisible = false;
        this.getListUsuarios();
      } catch (error) {
        console.error('Error guardando usuario:', error);
        this.srvMensajes.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al guardar el usuario.' });
      } finally {
        this.loadingSave = false;
      }
    }
  }

  validateUser(user: User): boolean {
    const requiredFields = ['tx_nombre', 'tx_cedula', 'tx_area', 'tx_cargo'];
    for (const field of requiredFields) {
      if (!user[field as keyof User]) {
        this.srvMensajes.add({
          severity: 'error',
          summary: 'Error',
          detail: `${field.replace('tx_', '')} es obligatorio.`,
        });
        return false;
      }
    }
    return true;
  }

  async createUser(user: User) {
    await this.srvReg.postRegisterUsers(user).toPromise();
    this.srvMensajes.add({ severity: 'success', summary: 'Creación exitosa', detail: 'El nuevo usuario fue creado correctamente.' });
  }

  async updateUser(user: User) {
    await this.srvReg.postEditUsers(user).toPromise();
    this.srvMensajes.add({ severity: 'success', summary: 'Actualización exitosa', detail: 'El usuario fue actualizado correctamente.' });
  }

  onAreaChange() {
    if (this.selectedArea) {
      this.filteredCargoOptions = this.ListUsersWorkers.filter(
        user => user.tx_area === this.selectedArea
      ).map(user => ({
        label: user.tx_cargo,
        value: user.tx_cargo
      }));
      this.filteredCargoOptions = this.getUniqueOptions(this.filteredCargoOptions, 'label');
    } else {
      this.filteredCargoOptions = this.cargoOptions;
    }
    this.selectedCargo = '';
  }

}
