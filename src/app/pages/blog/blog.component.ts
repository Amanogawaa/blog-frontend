import { Component } from '@angular/core';
import { CommentComponent } from '../../components/comment/comment.component';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommentComponent],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
})
export class BlogComponent {}
