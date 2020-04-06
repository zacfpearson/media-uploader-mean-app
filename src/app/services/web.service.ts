import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Post} from '../home/post.model';

@Injectable()
export class DatasService {
  private posts: Post[] = [];

  constructor(private http: HttpClient){

  }

  addPost(post: FormData){
    return this.http.post<{message: String, obj: Post}>('/api/posts', post)
        .pipe(map(response => response.obj));
  }

  getAllPosts(){
    return this.http.get<{message: String, obj: Post[]}>('/api/posts')
        .pipe(map(response => {
          const posts = response.obj;
          let transformedPosts: Post[] = [];
          for( let post of posts ) {
            transformedPosts.push(new Post(post.text, post.media, post._id));
          }
          this.posts = transformedPosts;
          return transformedPosts;
        }))
  }

  deletePost(post: Post){
    return this.http.delete<{message: String, obj: Post}>('/api/posts/'+post._id)
        .pipe(map(response => response.obj))
  }
}