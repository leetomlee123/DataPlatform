import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserauthService } from '../service/userauth.service';
import { toBase64String } from '@angular/compiler/src/output/source_map';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  validateForm: FormGroup;

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    this.auth.auth(this.validateForm.value.userName, this.validateForm.value.password, this.validateForm.value.remember)
  }

  constructor(private fb: FormBuilder, private http: HttpClient, private auth: UserauthService) {
  }

  ngOnInit(): void {
    

    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
    this.auth.auth(localStorage.getItem('username'), localStorage.getItem('password'), true);
  }
}
