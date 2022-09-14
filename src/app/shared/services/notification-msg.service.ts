import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar,MatSnackBarConfig,MatSnackBarHorizontalPosition,MatSnackBarVerticalPosition  } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class NotificationMsgService {
  horizontalPosition:MatSnackBarHorizontalPosition ='right';
  verticalPosition:MatSnackBarVerticalPosition='top';
  constructor(public snackBar: MatSnackBar) { }

 
  config: MatSnackBarConfig = {
    duration:2000,
    horizontalPosition:this.horizontalPosition,
    verticalPosition:this.verticalPosition
  }

  success(msg:string) {
    this.config['panelClass'] = ['notification', 'success'];
    this.snackBar.open(msg,'',this.config);
  }

  warn(msg:string) {
    this.config['panelClass'] = ['notification', 'warn'];
    this.snackBar.open(msg, '', this.config);
  }


  
}

 
 

 



