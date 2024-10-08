import { Component, HostListener } from '@angular/core';
import { CommentComponent } from '../../components/comment/comment.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../service/blog.service';
import { CommonModule, Location } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommentComponent, NavbarComponent, CommonModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
})
export class BlogComponent {
  blogId: any;
  blog: any = {};
  isAuthor: boolean = false;
  isDropdownOpen: boolean = false;

  constructor(
    private router: Router,
    private arouter: ActivatedRoute,
    private service: BlogService,
    private authService: AuthService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.arouter.params.subscribe((params) => {
      this.blogId = +params['id'];
      this.loadBlog(this.blogId);
    });
  }

  loadBlog(id: number) {
    this.service.getBlogById(id).subscribe((blog: any) => {
      this.blog = blog.data;

      const token = this.authService.getToken();
      if (token) {
        const decodedToken = this.authService.tokenDecoder(token);
        if (decodedToken) {
          if (decodedToken.data.id === this.blog.user_id) {
            this.isAuthor = true;
          }
        }
      } else {
        console.error('Token is null');
      }
    });
  }

  editPost(id: any) {
    this.router.navigate(['edit/', id]);
  }

  deletePost(id: any) {
    let blogDetails = {
      id: this.blogId,
      user_id: this.blog.user_id,
    };

    Swal.fire({
      title: 'Delete Post?',
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
        this.service.deleteBlogPost(blogDetails).subscribe((res: any) => {
          Toast.fire({
            icon: 'success',
            title: 'Deleted successfully',
          });
          this.location.back();
        });
      }
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
