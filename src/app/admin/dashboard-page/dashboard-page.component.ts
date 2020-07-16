import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostService} from '../../shared/post.service';
import {Post} from '../../shared/interfaces';
import {Subscription} from 'rxjs';
import {AlertService} from '../shared/services/alert.service';


@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  pSub: Subscription; // переменная для очистки подписки на стрим
  delSub: Subscription; // переменная для очистки подписки на стрим
  searchStr = '';

  constructor(private postService: PostService,
              private alert: AlertService) {
  }

  ngOnInit() {
    this.pSub = this.postService.getAll().subscribe(posts => {
      this.posts = posts;
    });
  }

  remove(id: string) {
    this.delSub = this.postService.remove(id).subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== id);
      this.alert.warning('Your post has been deleted');
    });
  }

  // Metodo implementato dall'interfaccia OnDestroy per ottimizzare la memoria:
  // se una Subscription (pSub) esiste, la cancelliamo
  ngOnDestroy() {
    if (this.pSub) {
      this.pSub.unsubscribe();
    }
    if (this.delSub) {
      this.delSub.unsubscribe();
    }
  }

}
