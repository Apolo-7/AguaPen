import { environment } from './../../environments/environment.development';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from './general.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private environment = environment.aguapenApi;

  constructor(private http: HttpClient, private srvG: GeneralService) {}

  login(objLogin: any) {
    let url = 'login';
    return this.http.post(
      this.environment + url,
      this.srvG.objectToFormData(objLogin)
    );
  }



  private nombresSubject = new BehaviorSubject<string | null>(this.getStoredNombres());
  private usuarioIdSubject = new BehaviorSubject<string | null>(this.getStoredUsuarioId());

  nombres$ = this.nombresSubject.asObservable();
  usuarioId$ = this.usuarioIdSubject.asObservable();

  private getStoredNombres(): string | null {
    return localStorage.getItem('nombres');
  }

  private getStoredUsuarioId(): string | null {
    return localStorage.getItem('usuario_id');
  }

  setNombres(nombres: string) {
    this.nombresSubject.next(nombres);
    localStorage.setItem('nombres', nombres);
  }

  setUsuarioId(usuario_id: string) {
    this.usuarioIdSubject.next(usuario_id);
    localStorage.setItem('usuario_id', usuario_id);
  }

  clearAuthData() {
    this.nombresSubject.next(null);
    this.usuarioIdSubject.next(null);
    localStorage.removeItem('nombres');
    localStorage.removeItem('usuario_id');
  }
 
}
