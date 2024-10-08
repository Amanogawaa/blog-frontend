import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private http: HttpClient, private helper: JwtHelperService) {}

  private API_URL = 'http://localhost/NeonInsights/backend/api/';

  // ?  auth
  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}register`, data, {
      observe: 'response',
    });
  }

  loginUser(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}login`, data, {
      observe: 'response',
    });
  }

  // get ?
  getAllBlogs(): Observable<any> {
    return this.http.get(`${this.API_URL}blogs/all`);
  }

  getAllComments(id: any): Observable<any> {
    const params = new HttpParams().set('post_id', id.toString());
    return this.http.get(`${this.API_URL}comments`, { params });
  }

  getBlogById(id: number): Observable<any> {
    const params = new HttpParams().set('blog_id', id.toString());
    return this.http.get(`${this.API_URL}blogs`, { params });
  }

  // Search Blogs by Tags
  searchBlogsByTags(tags: any): Observable<any> {
    const params = new HttpParams().set('tags', tags.join(','));
    return this.http.get(`${this.API_URL}blogs/search`, { params });
  }

  // post ?
  createBlogPost(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}blog/create`, data, {
      observe: 'response',
    });
  }

  createComment(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}comment/create`, data, {
      observe: 'response',
    });
  }

  updateBlogPost(data: any): Observable<any> {
    return this.http.put(`${this.API_URL}blog/update`, data, {
      observe: 'response',
    });
  }

  updateComment(data: any): Observable<any> {
    return this.http.patch(`${this.API_URL}comment/update`, data, {
      observe: 'response',
    });
  }

  deleteBlogPost(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}blog/delete`, data, {
      observe: 'response',
    });
  }

  deleteComment(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}comment/delete`, data, {
      observe: 'response',
    });
  }
}
