import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
// инжектируем Router чтобы использовать его в методе logout():
  constructor(
    private router: Router,
    public auth: AuthService) { }

  ngOnInit(): void {
  }

  logout(event: Event) {
    // используем preventDefault() чтобы отменить дефолтное поведение ссылки:
    event.preventDefault();
    this.auth.logout();
    // cliccando sul Logout saremo reindirizzati nella pagina Login:
    this.router.navigate(['/admin', 'login']);
  }
}
