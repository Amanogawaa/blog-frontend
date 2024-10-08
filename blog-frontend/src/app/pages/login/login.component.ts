import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BlogService } from '../../service/blog.service';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AuthService } from '../../service/auth.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private loginService: BlogService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  loginUser() {
    if (!this.loginForm.valid) {
      return;
    }

    this.loginService
      .loginUser(this.loginForm.value)
      .subscribe((res: HttpResponse<any>) => {
        if (res.status === 200) {
          this.authService.login(res.body.token);
          console.log(res.body.token);
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
          });
          Toast.fire({
            icon: 'success',
            title: 'Loggedin successfully',
          }).then(() => {
            this.router.navigate(['home']);
          });
        }
      });
  }
}
