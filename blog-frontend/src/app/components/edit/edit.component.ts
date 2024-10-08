import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import {
  FormBuilder,
  Validators,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { BlogService } from '../../service/blog.service';
import { identifierName } from '@angular/compiler';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [NavbarComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class EditComponent implements OnInit {
  blogForm: any;
  postCreated: boolean = false;
  userId: number | null = null;
  blogId: number | null = null;

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService,
    private arouter: ActivatedRoute
  ) {
    const token = this.authService.getToken();
    if (token) {
      const decoded = this.authService.tokenDecoder(token);
      this.userId = decoded?.data?.id ?? null;
    }

    this.blogForm = this.fb.group({
      id: [this.blogId],
      title: ['', Validators.required],
      description: ['', Validators.required],
      user_id: [this.userId, Validators.required],
      tags: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.arouter.params.subscribe((params) => {
      this.blogId = +params['id'];
      this.blogService.getBlogById(this.blogId).subscribe((blog: any) => {
        const tagsArray = blog.data.tags
          ? blog.data.tags.split(',').map((tag: string) => tag.trim())
          : [];

        this.blogForm.patchValue({
          id: blog.data.id,
          title: blog.data.title,
          description: blog.data.description,
          user_id: this.userId,
        });

        this.tags.clear();

        tagsArray.forEach((tag: string) => this.addTag(tag));
      });
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

  updateBlog() {
    if (this.blogForm.valid) {
      const formValue = this.blogForm.value;

      const tagsString = this.tags.value.join(',');

      const updatedBlogData = {
        ...formValue,
        tags: tagsString,
      };

      this.blogService.updateBlogPost(updatedBlogData).subscribe((response) => {
        if (response.status === 200) {
          Swal.fire('', 'Blog successfully updated', 'success');
          this.location.back();
        }
      });
    }
  }

  // go back to past page
  goBack() {
    this.location.back();
  }
}
