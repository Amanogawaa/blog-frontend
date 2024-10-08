import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BlogService } from '../../service/blog.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ActivationEnd } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css',
})
export class CommentComponent implements OnInit {
  // user need to be authorized to comment otherwise message will be displayed
  // check if the user is authorized to comment

  //example
  isAuthorize = false;
  commentForm: any;
  userId: any;
  blogId: any;
  comments: any[] = [];
  isDropdownOpen: boolean[] = [];
  isEditing: boolean = false;
  isAuthor: boolean = false;
  editingCommentId: number | null = null;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private blogService: BlogService,
    private aRoute: ActivatedRoute
  ) {
    const token = this.authService.getToken();
    if (token) {
      const decoded = this.authService.tokenDecoder(token);
      this.userId = decoded?.data?.id ?? null;
    }

    this.aRoute.params.subscribe((params) => {
      this.blogId = +params['id'];
    });

    this.isAuthorize = this.authService.isAuthorized();

    this.commentForm = this.fb.group({
      content: [''],
      user_id: [this.userId],
      post_id: [this.blogId],
    });
  }

  ngOnInit(): void {
    this.getComments(this.blogId);

    const token = this.authService.getToken();
    if (token) {
      const decodedToken = this.authService.tokenDecoder(token);
      if (decodedToken) {
        if (decodedToken.data.id === this.userId) {
          this.isAuthor = true;
        }
      }
    } else {
      console.error('Token is null');
    }
  }

  getComments(id: any) {
    this.blogService.getAllComments(id).subscribe((res: any) => {
      this.comments = res;
      this.isDropdownOpen = new Array(this.comments.length).fill(false);
    });
  }

  toggleDropdown(index: number) {
    this.isDropdownOpen[index] = !this.isDropdownOpen[index];
  }

  submitComment() {
    if (this.isEditing && this.isAuthor) {
      const updateData = {
        id: this.editingCommentId,
        user_id: this.userId,
        post_id: this.blogId,
        content: this.commentForm.value.content,
      };
      this.blogService.updateComment(updateData).subscribe((res: any) => {
        if (res.status === 200) {
          Swal.fire('Updated!', 'Your comment was updated.', 'success');
          this.isEditing = false;
          this.commentForm.reset();
          this.getComments(this.blogId);
        }
      });
    } else {
      this.blogService
        .createComment(this.commentForm.value)
        .subscribe((res: any) => {
          if (res.status === 200) {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 100,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              },
            });
            Toast.fire({
              icon: 'success',
              title: 'Comment was created.',
            });
            this.commentForm.reset();
            this.getComments(this.blogId);
          }
        });
    }
  }

  editComment(comment: any) {
    this.commentForm.patchValue({
      content: comment.content,
    });
    this.isEditing = true;
    this.editingCommentId = comment.id;
  }

  cancelEdit() {
    this.isEditing = false;
    this.editingCommentId = null;
    this.commentForm.reset();
  }

  deleteComment(id: number) {
    console.log(id);
    let data: any = {
      id: id,
      user_id: this.userId,
    };

    Swal.fire({
      title: 'Delete comment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        this.blogService.deleteComment(data).subscribe((res: any) => {
          Toast.fire({
            icon: 'success',
            title: 'Comment deleted successfully',
          });
          this.getComments(this.blogId);
        });
      }
    });
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    this.comments.forEach((comment, index) => {
      const dropdownButton = document.getElementById(
        `dropdown-button-${index}`
      );
      const dropdownMenu = document.getElementById(`dropdown-menu-${index}`);

      if (dropdownButton && dropdownMenu) {
        const clickedOutside =
          !dropdownButton.contains(event.target as Node) &&
          !dropdownMenu.contains(event.target as Node);
        if (clickedOutside) {
          this.isDropdownOpen[index] = false;
        }
      }
    });
  }

  removeDocumentClickListener() {
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }
}
