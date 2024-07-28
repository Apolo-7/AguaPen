import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private environment = environment.aguapenApi;

  //injector
  private http = inject(HttpClient);

  constructor() {}

  //Listado de Productos
  getlistProducts() {
    const url = `${this.environment}allproducts`;
    return this.http.get<any>(url);
  }

  //Listado de Usuarios-Trabajadores
  getListUsuarios() {
    const url = `${this.environment}allusersworkers`;
    return this.http.get<any>(url);
  }

  getviewRegistroAll() {
    const url = `${this.environment}obtenerRegistrosConDetalles`;
    return this.http.get<any>(url);
  }

  getviewAreas() {
    const url = `${this.environment}allareas`;
    return this.http.get<any>(url);
  }

  getListRegistros() {
    const url = `${this.environment}registros/search`;
    return this.http.post<any>(url, {});
  }

  getReportsAreas() {
    const url = `${this.environment}obtenerRegistrosConDetallesArea`;
    return this.http.get<any>(url);
  }

  
}
