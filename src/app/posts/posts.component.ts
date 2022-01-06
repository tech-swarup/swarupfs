import { PostService } from './../post.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Post } from '../interface/post';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})

export class PostsComponent implements OnInit {
  isLoading = false;
  form!: FormGroup;

  imagePreview!: string;
  private posts!: Post;
  private mode = 'create';
  private postId!: string;

  post: Post = { id: "", title: "", content: "", imagePath: ""};
  //post!: Post;

  constructor(private postService: PostService, public route: ActivatedRoute) { }

ngOnInit(): void {

  this.form = new FormGroup({
    title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
    content: new FormControl(null, {validators: [Validators.required] }),
    image: new FormControl(null, {validators: [Validators.required] })
  });


  this.route.paramMap.subscribe((paramMap: ParamMap) => {
    if (paramMap.has('postId')) {
      this.mode = 'edit';
      this.postId = paramMap.get('postId') as string;
      this.isLoading = true;
      this.postService.getPost(this.postId).subscribe(postData => {
        this.isLoading = false;
        // console.log(postData);
        this.post = {
          id: postData._id,
          title: postData.title,
          content: postData.content,
          imagePath: postData.imagePath
        };

        this.imagePreview = this.post.imagePath;

        this.form.setValue({
          title: this.post.title,
          content: this.post.content,
          image: this.post.imagePath
        });
      });
    } else {
      this.mode = 'create';
      this.postId = "";
      // this.isLoading = false;
    }
  });
}

onImagePicked(event: Event) {
  const file = (event.target as HTMLInputElement).files![0];
  // This will provide me the File object
  this.form.patchValue({ image: file });

  // This will call the Validator
  this.form.get("image")!.updateValueAndValidity();
  // console.log(file);
  // console.log(this.form);

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    this.imagePreview = reader.result as string;
  };

}

  onAddPost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if(this.mode==='create'){
      // this.postService.addPost(form.value.title, form.value.content);
    this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    }else{
      this.postService.updatedPost(this.postId, this.form.value.title,this.form.value.content, this.form.value.image);
    }
    this.form.reset();
    }
  }
