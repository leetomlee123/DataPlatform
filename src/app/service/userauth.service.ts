import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppRoutingModule } from '../app-routing.module';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserauthService {

  constructor(private fb: FormBuilder, private http: HttpClient, private routers: Router) {
  }
  auth(username: string, password: string, remember: boolean) {


    if (username == null || password == null) {
      return;
    } else {
      let input = new FormData();
      input.append('username', username);
      input.append('password', password);
      let remote = "http://192.168.81.129:17080/user/users/auth";
      let local = "http://127.0.0.1:8988/users/auth";
      this.http.post(remote, input).subscribe(data => {
        sessionStorage.setItem('token', data['accessToken']);
        if (remember == true) {
          localStorage.setItem('username', username);
          // localStorage.setItem('password', password);
        }
        this.routers.navigate(['index']);
      }, error => {
        this.routers.navigate(['login']);
      })
    }
  }
}
