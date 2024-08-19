import { Component } from '@angular/core';
import { CommentComponent } from '../../components/comment/comment.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommentComponent, NavbarComponent],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
})
export class BlogComponent {
  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('BlogComponent initialized');
  }

  editPost() {
    this.router.navigate(['blog/edit']);
  }

  deletePost() {
    console.log('Post deleted');
  }
}
