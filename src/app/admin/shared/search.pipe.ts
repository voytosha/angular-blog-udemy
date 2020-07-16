import {Pipe, PipeTransform} from '@angular/core';
import {Post} from '../../shared/interfaces';

@Pipe({
  name: 'searchPosts'
})
export class SearchPipe implements PipeTransform {
  transform(posts: Post[], search = ''): Post[] {
    if (!search.trim()) { // trim() cancella gli spazzi, => if(!) = se la stringa è vuota, return posts
      return posts
    }
    return posts.filter(post => {
      return post.title.toLowerCase().includes(search.toLowerCase());
    });
  }

}
