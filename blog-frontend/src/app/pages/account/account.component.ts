import { Component } from '@angular/core';
import { BlogComponent } from '../blog/blog.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { BlogCardComponent } from '../blog-card/blog-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [BlogComponent, NavbarComponent, BlogCardComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent {
  //for displaying the user's posts

  constructor(private router: Router) {}
}
