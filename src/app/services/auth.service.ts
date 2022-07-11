import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

constructor() { }


  getCurrentUser() {
    const userString = localStorage.getItem('currentUser');
    if (!!userString) {
      const user = JSON.parse(userString);
      return user;
    }
    return null;
  }

}
