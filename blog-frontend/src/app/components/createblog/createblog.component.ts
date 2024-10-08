import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule, Location } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BlogService } from '../../service/blog.service';
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-createblog',
  standalone: true,
  imports: [NavbarComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './createblog.component.html',
  styleUrl: './createblog.component.css',
})
export class CreateblogComponent {
  blogForm: any;
  postCreated: boolean = false;

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private blogService: BlogService,
    private authService: AuthService
  ) {
    const token = this.authService.getToken();
    if (token === null) {
      return;
    }

    const decoded = this.authService.tokenDecoder(token);

    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      user_id: [decoded.data.id, Validators.required],
      tags: this.fb.array([]),
    });
  }

  get tags(): FormArray {
    return this.blogForm.get('tags') as FormArray;
  }

  addTag(tag: string) {
    if (tag) {
      this.tags.push(this.fb.control(tag));
    }
  }

  removeTag(index: number) {
    this.tags.removeAt(index);
  }

  createBlog() {
    if (this.blogForm.valid) {
      this.blogService.createBlogPost(this.blogForm.value).subscribe(
        (response) => {
          if (response.status === 200) {
            Swal.fire('', 'Blog successfully created', 'success');
            this.blogForm.reset();
            this.postCreated = true;
          }
        },
        (error) => {
          alert('Error creating blog post.');
          console.error(error);
        }
      );
    }
  }

  cancelPost = () => {
    this.location.back();
  };
}
