import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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

const PRIMEMG_MODULES = [
  ToastModule,
  ButtonModule,
  InputTextModule,
  PasswordModule,
  DividerModule,
];

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [PRIMEMG_MODULES, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService],
})
export default class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  private srvAuth = inject(AuthService);
  private srvMensajes = inject(MessageService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

getLogin() {
    this.loading = true;

    if (this.loginForm.valid) {
      const dataLogin = this.loginForm.value;

      this.srvAuth.login(dataLogin).subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res.usuario) {
            this.srvMensajes.add({
              severity: 'success',
              summary: 'Login',
              detail: res.message,
            });
            // Redirigir al usuario a la página de inicio
            this.router.navigate(['home']);
          } 
        },
        error: (err) => {
          this.loading = false;
          this.srvMensajes.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message,
          });
          console.log(err.error.message);
          
        },
      });
    } else {
      this.loading = false;
      this.srvMensajes.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Usuario o clave no introducido',
      });
    }
  }
}
