import { Component, OnInit } from '@angular/core';
import {DatasService} from '../services/web.service';
import {Post} from '../home/post.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [DatasService]
})
export class HomeComponent implements OnInit {
  posts: Post[];
  selectedFiles: File [] = null;
  text: string; 
  url: string = "assets/images/camera.jpg";
  showAddBlock: Boolean = false;
  tooManyFiles: Boolean = false;
  submitted: Boolean = false;

  constructor(private webService: DatasService) {
    this.posts = [];
   }

  switchShowAddBlock(){
    this.showAddBlock = !this.showAddBlock;
  }

  onSubmit(){
    console.log(this.text);
    const fd = new FormData();
    fd.append('text' ,this.text );
    for (var x = 0; x < this.selectedFiles.length; x++) {
      fd.append('media',this.selectedFiles[x], this.selectedFiles[x].name );
    }
    this.submitted = true;
    this.webService.addPost(fd)
        .subscribe(data => {
          this.selectedFiles = null;
          this.text = null;
          this.url = "assets/images/camera.jpg";
          this.switchShowAddBlock();
          this.webService.getAllPosts().subscribe((postDatas: Post[])=> {
            this.submitted = false;
            this.posts = [];
            for(var i = 0; i < postDatas.length; i++){
              this.posts.unshift(postDatas[i]);
            }
          })
        });
  }

  onFileChange(event) {
    if( event.target.files.length <= 4 )
    {
      this.tooManyFiles = false;
      this.selectedFiles = <File []> event.target.files;
      for (var x = 0; x < this.selectedFiles.length; x++) {
        console.log(this.selectedFiles[x].type);
      }
    } else {
      this.tooManyFiles = true;
    }
  }

  onPlayVideo(event) {
    console.log(event);
    event.target.play();
  }

  onPauseVideo(event) {
    console.log(event);
    event.target.pause();
  }

  onDelete(object){
    let index: number = this.posts.indexOf(object);
    if( index !== -1 ){
      this.posts.splice(index, 1);
    }
    this.webService.deletePost(object)
        .subscribe(data => console.log(data));
  }

  isAdmin(){
    return true;
  }

  isVideo(filename){
    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(filename)[1];
    console.log(ext);
    if( ext == "mp4" || ext == "webm" || ext == "ogv" )
    {
      console.log("True");
      return true;
    } else {
      console.log("False");
      return false;
    }
  }

  ngOnInit() {
    this.webService.getAllPosts().subscribe((postDatas: Post[])=> {
      for(var i = 0; i < postDatas.length; i++){
        this.posts.unshift(postDatas[i]);
      }
    })
  }

}

