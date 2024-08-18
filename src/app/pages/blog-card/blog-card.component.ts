import { Component } from '@angular/core';
import { CommentComponent } from '../../components/comment/comment.component';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [CommentComponent],
  templateUrl: './blog-card.component.html',
  styleUrl: './blog-card.component.css',
})
export class BlogCardComponent {}
