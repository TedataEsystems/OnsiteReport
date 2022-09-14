import { EventEmitter } from '@angular/core';
import { Component, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Iloginview } from 'src/app/Model/Iloginview';
import { Iuser } from 'src/app/Model/Iuser';
import { AccountService } from 'src/app/Services/account.service';
import { NotificationMsgService } from 'src/app/shared/services/notification-msg.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)

  });


  constructor(private route: ActivatedRoute, private router: Router,
    private titleService: Title, public accountService: AccountService, public notificationService: NotificationMsgService

  ) {
    this.titleService.setTitle("Field Operation Report | Login");
    let token = localStorage.getItem("token");
    if (token != "undefined" || token != null || token != "") {
      this.router.navigateByUrl('')

    }

  }
  user = <Iuser>{};
  error: any;
  ngOnInit() {

  }

  onSubmit() {
   
    let loginview: Iloginview =
    {
      userName: this.form.controls.username.value.trim(),
      password: this.form.controls.password.value,
    }

    this.accountService.login(loginview).subscribe(res => {
      this.user = res;
      if ((this.user.token != "undefined" || this.user.token != null || this.user.token != "") && this.user.status != false) {
        localStorage.setItem('token', this.user.token);
        localStorage.setItem('userName', this.user.userName);
        localStorage.setItem('userGroup', this.user.userGroup);
        this.router.navigateByUrl('home');
      }
      if (this.user.token == "undefined" || this.user.userName == "undefined" || this.user.token == null) {
        this.notificationService.warn('Invalid UserName or Password');

      }
      else if (this.user.status == false) {
        this.notificationService.warn('Invalid UserName or Password')
      }

    }
      , error => { this.notificationService.warn('Invalid UserName or Password') }
    );



  }

}
