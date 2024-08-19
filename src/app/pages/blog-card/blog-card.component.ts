import { Component } from '@angular/core';
import { CommentComponent } from '../../components/comment/comment.component';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [CommentComponent, CommonModule, NavbarComponent],
  templateUrl: './blog-card.component.html',
  styleUrl: './blog-card.component.css',
})
export class BlogCardComponent {
  message = '';

  constructor(private router: Router, private aRoute: ActivatedRoute) {}

  ngOnInit(): void {
    //for dynamic message if the user is on account page or home page
    this.aRoute.url.subscribe((urlSegments) => {
      const path = urlSegments.map((segment) => segment.path).join('/');
      if (path.includes('account')) {
        this.message = 'Your blogs';
      } else if (path.includes('home')) {
        this.message = 'Explore Blogs';
      }
    });
  }

  goToBlog() {
    this.router.navigate(['/blog']);
  }
}
