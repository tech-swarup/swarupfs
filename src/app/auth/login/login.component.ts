import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {

  userIsValid = false;
  isLoading = false;
  msg!: String;
  form!: NgForm

  constructor(private authService: AuthService) { }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(form.value);
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
    form.resetForm();
  }

  ngOnInit(): void {
    this.authService.getUserNotValidListener()
    .subscribe(isPost => {
      this.userIsValid = true;
      this.msg = "User Login Failed";
      //this.form.resetForm();
      this.isLoading = false;
    });
  }

}
