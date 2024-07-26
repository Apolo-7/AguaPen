import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { Router } from '@angular/router';

const PRIMENG_MODULES = [
  ToastModule,
  ButtonModule,
  InputTextModule,
  PasswordModule,
  DividerModule,
];

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [PRIMENG_MODULES, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [MessageService],
})
export default class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  loading: boolean = false;
  loadingCheck: boolean = false;
  cedulaVerificada: boolean = false;

  private srvAuth = inject(AuthService);
  private srvMensajes = inject(MessageService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.forgotPasswordForm = this.fb.group(
      {
        cedula: ['', Validators.required],
        nueva_clave: ['', Validators.required],
        confirmar_clave: ['', Validators.required],
      },
    
    );
  }



  verifyCedula() {
    this.loadingCheck = true;
    const cedula = this.forgotPasswordForm.get('cedula')!.value;

    if (cedula) {
      this.srvAuth.verifyCedula(cedula).subscribe((res: any) => {

        if (res.status === "1") {
          this.cedulaVerificada = true;
          this.loadingCheck = false;
          this.srvMensajes.add({
            severity: 'success',
            summary: 'Verificación de Cédula',
            detail: res.message,
          });
        } else {
          this.loadingCheck = false;
          this.cedulaVerificada = false;
          this.srvMensajes.add({
            severity: 'error',
            summary: 'Error',
            detail: res.message,
          });
        }
       
      });
    }
  }

  resetPassword() {
    this.loading = true;

    //Verificar si las claves son iguales
    if (this.forgotPasswordForm.get('nueva_clave')!.value !== this.forgotPasswordForm.get('confirmar_clave')!.value) {
      this.srvMensajes.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Las claves no coinciden',
      });

      this.loading = false;
      return;
    }

    if (this.forgotPasswordForm.valid && this.cedulaVerificada) {
      const { cedula, nueva_clave, confirmar_clave } =
        this.forgotPasswordForm.value;

      this.srvAuth
        .resetPasswordByCedula(cedula, nueva_clave, confirmar_clave)
        .subscribe((res: any) => {
          if (res.status == "1") {
            this.srvMensajes.add({
              severity: 'success',
              summary: 'Recuperar Clave',
              detail: res.message,
            });
            this.loading = false;
            // Redirigir al usuario a la página de inicio
            this.router.navigate(['auth']);

          } else {
            this.srvMensajes.add({
              severity: 'error',
              summary: 'Error',
              detail: res.message,
            });
          }
        });
    }
  }

}
