import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { BlogComponent } from './pages/blog/blog.component';
import { CreateComponent } from './components/create/create.component';
import { EditComponent } from './components/edit/edit.component';
import { AccountComponent } from './pages/account/account.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: 'home',
    component: HomeComponent,
  },

  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'register',
    component: RegisterComponent,
  },

  {
    // path: 'blog/:id',
    path: 'blog',
    component: BlogComponent,
  },

  {
    path: 'account',
    component: AccountComponent,
  },

  {
    path: 'blog/create',
    component: CreateComponent,
  },

  {
    // path: 'blog/edit/:id',
    path: 'blog/edit',
    component: EditComponent,
  },
];
