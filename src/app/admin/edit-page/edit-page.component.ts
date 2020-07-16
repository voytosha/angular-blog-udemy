import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {PostService} from '../../shared/post.service';
import {switchMap} from 'rxjs/operators';
import {Post} from '../../shared/interfaces';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AlertService} from '../shared/services/alert.service';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {

  form: FormGroup;
  post: Post;
  submitted = false;

  updSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private alert: AlertService
  ) { }

  ngOnInit() {
    this.route.params.pipe(
      switchMap((params: Params) => {
        return this.postService.getById(params.id)
      })
    ).subscribe((post: Post) => {
      this.post = post;
      this.form = new FormGroup({
        title: new FormControl(post.title, Validators.required),
        text: new FormControl(post.text, Validators.required)
      });
    });
  }

  submit() {
    if (this.form.invalid) {
      return
    }
    this.submitted = true;
    this.updSub = this.postService.update({
      ...this.post,
      title: this.form.value.title,
      text: this.form.value.text,
    }).subscribe( () => {
      this.submitted = false;
      this.alert.success('Your post has been updated');
    });

  }

  ngOnDestroy() {
    if (this.updSub) {
      this.updSub.unsubscribe();
    }
  }
}
