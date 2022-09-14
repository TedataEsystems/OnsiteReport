import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteComponent } from '../msg/delete/delete.component';

@Injectable({
  providedIn: 'root'
})
export class DeleteServiceService {

  constructor(private dialog:MatDialog) { }

  openConfirmDialog(){
   return this.dialog.open(DeleteComponent,{
      width : '390px',
      panelClass:'confirm-dialog-container',
      disableClose : true,
      position:{top:"10px"}
    })
    
  }
}
