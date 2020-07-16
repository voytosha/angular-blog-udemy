import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {FbAuthResponse, User} from '../../../shared/interfaces';
import {Observable, Subject, throwError} from 'rxjs';

import {catchError, tap} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';

@Injectable({providedIn: 'root'})
export class AuthService{

    // creo variabile error$ (funziona come stream) per gestire i messaggi degli errori:
  public error$: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) {}

  get token(): string {
    const expDate = new Date(localStorage.getItem('fb-token-exp'))
    if (new Date() > expDate){
      this.logout()
    }
    return localStorage.getItem('fb-token')
  }

  login(user: User): Observable<any> {
    user.returnSecureToken = true
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken),
        catchError(this.handError.bind(this))
    )
  }

  logout() {
    this.setToken(null)
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  private handError(error: HttpErrorResponse){
    const {message} = error.error.error;
    switch (message){
      case 'INVALID_EMAIL':
        this.error$.next('Please control your email!');
        break;
      case 'INVALID_PASSWORD':
        this.error$.next('Please control your password!');
        break;
      case 'EMAIL_NOT_FOUND':
        this.error$.next('This email does not exist');
        break;
    }
    return throwError(error)
  }

  private setToken(response: FbAuthResponse | null) {
    if(response) {
      // new Date().getTime() => nella data corrente prendo l'ora corrente e la sommo con
      // +response.expiresIn * 1000 => la stringa expiresIn (in secondi) convertita nel numero e la multiplico
      // *1000 per ottenere i milisecondi:
      const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000)
      localStorage.setItem('fb-token', response.idToken)
      localStorage.setItem('fb-token-exp', expDate.toString()) // localStorage contiene solo le string
    } else {
      localStorage.clear()
    }
  }
}
