import { Component, OnInit, ViewChild } from '@angular/core';
import { BlogEditComponent } from '../blog-edit/blog-edit.component';

@Component({
  selector: 'app-blog-form',
  standalone: true,
  imports: [BlogEditComponent],
  templateUrl: './blog-form.component.html',
  styleUrl: './blog-form.component.css',
})
export class BlogFormComponent implements OnInit {
  @ViewChild(BlogEditComponent) blogEditor!: BlogEditComponent;

  blogData: any = {
    title: '',
    description: '',
    user_id: null,
  };

  blog_id: any | null = null;
  is_editing: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
