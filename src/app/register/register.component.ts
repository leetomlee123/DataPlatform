import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UploadFile } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  validateForm: FormGroup;
  captchaUrl: string;
  previewImage = '';
  previewVisible = false;
  content: any;
 

  public fileList: UploadFile[] = [];
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    let input = new FormData();
    input.append('loginName', this.validateForm.value.loginName);
    input.append('password', this.validateForm.value.password);
    // input.append('mobile', this.validateForm.value.mobile);
    input.append('email', this.validateForm.value.email);
    // input.append('headUrl', this.validateForm.value.headUrl);
    // input.append('birthday', this.validateForm.value.birthday);
    // input.append('captcha', this.validateForm.value.captcha);
    let local = "http://127.0.0.1:8988/users/web/register";
    let remote = "http://192.168.81.129:17080/user/users/web/register";
    this.http.post(remote, input).subscribe(data => {
      this.routers.navigate(['login']);
    }, error => {
      this.routers.navigate(['register']);
    })
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
  }

  getCaptcha(e: MouseEvent): void {

    console.log(e.preventDefault());

  }

  constructor(private fb: FormBuilder, private http: HttpClient, private routers: Router) {
  }
  updateCaptchaUrl() {
    this.content = 'http://127.0.0.1:8988/users/kaptcha?' + new Date().getMilliseconds();

  }
  ngOnInit(): void {
    this.content = 'http://127.0.0.1:8988/users/kaptcha';
    this.validateForm = this.fb.group({
      formLayout: ['inline'],
      email: [null, [Validators.email]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      loginName: [null, [Validators.required]],
      // mobilePrefix: ['+86'],
      // mobile: [null, [Validators.required]],
      // headUrl: [null, [Validators.required]],
      // birthday: [null, [Validators.required]],
      // website: [null, [Validators.required]],
      // captcha: [null, [Validators.required]],
      agree: [false]
    });
  }
  beforeUpload = (file: UploadFile): boolean => {
    this.fileList.push(file);
    this.fileList.forEach((file: any) => {
      this.handlePreview(file);
      // let reader = new FileReader()
      // reader.readAsDataURL(file)
      // reader.onload = function (result) {
      //   document.getElementById("x").setAttribute("src", result.target['result']);
      // }
    });
    return false;
  }
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }
}
