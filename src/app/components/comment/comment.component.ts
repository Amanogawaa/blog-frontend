import { Component } from '@angular/core';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css',
})
export class CommentComponent {
  // user need to be authorized to comment otherwise message will be displayed
  // check if the user is authorized to comment

  //example
  isAuthorize = false;
}
