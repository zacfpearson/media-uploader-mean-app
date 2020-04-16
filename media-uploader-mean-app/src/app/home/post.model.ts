export class Post {
    text: string;
    media: string[];
    _id?: string;
  
    constructor(name: string, media: string[], postID?:string)
    {
      this.text = name;
      this.media = media;
      this._id = postID;
    }
  }