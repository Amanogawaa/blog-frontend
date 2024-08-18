import { Component } from '@angular/core';
import { BlogComponent } from '../blog/blog.component';
import { BlogCardComponent } from '../blog-card/blog-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BlogComponent, BlogCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
