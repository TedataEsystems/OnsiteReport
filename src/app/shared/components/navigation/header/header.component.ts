import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/Services/account.service';
import { NotificationMsgService } from 'src/app/shared/services/notification-msg.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
@Output() public sidenavToggle = new EventEmitter();
constructor( private router :Router,private accountService : AccountService,private notificationService:NotificationMsgService) { }

ngOnInit(): void {

}

logOut(){
  localStorage.clear();
  this.accountService.logout().subscribe(res=>{
    this.router.navigateByUrl('/login');
    
  } 
  
  ,error=>{this.notificationService.warn('occured an error ')}
  );

}
public onToggleSidenav=()=> {
this.sidenavToggle.emit();
}

}
