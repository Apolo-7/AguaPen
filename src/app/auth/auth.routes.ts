import { Routes } from "@angular/router";

export const routes : Routes = [
    {
        path: '',
        loadComponent: () => import('./login/login.component')
    },
    {
        path: 'register',
        loadComponent: () => import('./register/register.component')
    },
    {
        path: 'forgot-password',
        loadComponent: () => import('./forgot-password/forgot-password.component')
    }
]

export default routes;