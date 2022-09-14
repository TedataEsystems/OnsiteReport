import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import 'moment-timezone';
import { IdailyOperations } from 'src/app/Model/IdailyOperations';
import { Ioperator } from 'src/app/Model/Ioperator';
import { IpopName } from 'src/app/Model/IpopName';
import { IremedyAction } from 'src/app/Model/IremedyAction';
import { Istatus } from 'src/app/Model/Istatus';
import { ItechName } from 'src/app/Model/ItechName';
import { ItransmissionMedia } from 'src/app/Model/ItransmissionMedia';
import { IzoneName } from 'src/app/Model/IzoneName';
import { DailyOperationsService } from 'src/app/Services/daily-operations.service';
import { NotificationMsgService } from 'src/app/shared/services/notification-msg.service';
@Component({
  selector: 'app-edit-daily-opertion',
  templateUrl: './edit-daily-opertion.component.html',
  styleUrls: ['./edit-daily-opertion.component.css']
})
export class EditDailyOpertionComponent implements OnInit {
  
  @ViewChild('popNameSearch') popNameSearch!: ElementRef;
  @ViewChild('operatorSearch') operatorSearch!: ElementRef;
  @ViewChild('techNameSearch') techNameSearch!: ElementRef;
  @ViewChild('statusNameSearch') statusNameSearch!: ElementRef;
  @ViewChild('transmissionMediaSearch') transmissionMediaSearch!: ElementRef;
  @ViewChild('remedyActionsSearch') remedyActionsSearch!: ElementRef;
 loading:boolean=false;
  id: number = 0;
  dailyOperation: IdailyOperations = <IdailyOperations>{};
  operators: Ioperator[] = [];
  _operators: Ioperator[] = [];
  popNames: IpopName[] = [];
  _popNames :any[]=[];
  status: Istatus[] = [];
  _status: Istatus[] = [];
  techNames: ItechName[] = [];
  _techNames: ItechName[] = [];
  transmissionMedia: ItransmissionMedia[] = [];
  _transmissionMedia: ItransmissionMedia[] = [];
  remedyActions: IremedyAction[] = [];
  _remedyActions: IremedyAction[] = [];

  constructor(public service: DailyOperationsService, public dialogRef: MatDialogRef<EditDailyOpertionComponent>, public notificationService: NotificationMsgService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.id = data.id; 
  }

  form: FormGroup = new FormGroup({
    id: new FormControl(this.id),
    complaintNumber: new FormControl('' , [ Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
    PSDID: new FormControl('' , [ Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
    circuitID: new FormControl('' ,[ Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
    customerName: new FormControl('',Validators.required),
    popNameIds: new FormControl('',Validators.required),
    zoneName: new FormControl('',Validators.required),
    operatorIds: new FormControl('',Validators.required),
    techNameIds: new FormControl('',Validators.required),
    remedyActionIds: new FormControl('',Validators.required),
    notes: new FormControl(''),
    transmissionMediaIds: new FormControl('',Validators.required),
    statusIds: new FormControl('',Validators.required),
    assignedTo : new FormControl('',Validators.required),
    createdDate: new FormControl('',Validators.required),
    closedDate: new FormControl(''),
  });


  getformLists() {
    this.service.getListsForCreate().subscribe(res => {
      this.operators = res.operators as Ioperator[];
      this._operators = res.operators as Ioperator[];
      this.popNames = res.popNames as IpopName[];
      this._popNames = res.popNames as IpopName[];
      this.remedyActions = res.remedyActions as IremedyAction[];
      this._remedyActions = res.remedyActions as IremedyAction[];
      this.status = res._status as Istatus[];
      this._status = res._status as Istatus[];
      this.techNames = res.techNames as ItechName[];
      this._techNames = res.techNames as ItechName[];
      this.transmissionMedia = res.transmissionMedia as ItransmissionMedia[];
      this._transmissionMedia = res.transmissionMedia as ItransmissionMedia[];
    });
      this.service.getDailyOperationById(this.id).subscribe(res => {
        this.dailyOperation = res.data as IdailyOperations ;
        this.form.patchValue({
          complaintNumber: this.dailyOperation.complaintNumber,
          PSDID: this.dailyOperation.psdid,
          circuitID: this.dailyOperation.circuitID,
          customerName: this.dailyOperation.customerName,
          popNameIds: this.dailyOperation.popNameId.toString(),
          zoneName : this.dailyOperation.zoneName.toString(),
          operatorIds: this.dailyOperation.operatorId.toString(),
          techNameIds: this.dailyOperation.techNameId.toString(),
          remedyActionIds: this.dailyOperation.remedyActionId.toString(),
          notes: this.dailyOperation.notes,
          transmissionMediaIds: this.dailyOperation.transmissionMediaId.toString(),
          statusIds: this.dailyOperation.statusId.toString(),
          assignedTo : this.dailyOperation.assignedTo ,
          createdDate: this.dailyOperation.createdDate,
          closedDate: this.dailyOperation.closedDate,
        })
      });

  }


  ngOnInit() {
    this.getformLists();
  }

  
  onOperatorsInputChange(){
    const searchInput = this.operatorSearch.nativeElement.value ?
    this.operatorSearch.nativeElement.value.toLowerCase() : '' ;
    this.operators = this._operators.filter(u=> {
      const name : string= u.name.toLowerCase();
      return name.indexOf(searchInput) > -1 ;
    });
  }
  onPopNameInputChange(){
    const searchInput = this.popNameSearch.nativeElement.value ?
    this.popNameSearch.nativeElement.value.toLowerCase() : '' ;
    this.popNames = this._popNames.filter(u=> {
      const name : string= u.name.toLowerCase();
      return name.indexOf(searchInput) > -1 ;
    });
  }

  onTechNameInputChange(){
    const searchInput = this.techNameSearch.nativeElement.value ?
    this.techNameSearch.nativeElement.value.toLowerCase() : '' ;
    this.techNames = this._techNames.filter(u=> {
      const name : string= u.name.toLowerCase();
      return name.indexOf(searchInput) > -1 ;
    });
  }
  onTransmissionMediaInputChange(){
    const searchInput = this.transmissionMediaSearch.nativeElement.value ?
    this.transmissionMediaSearch.nativeElement.value.toLowerCase() : '' ;
    this.transmissionMedia = this._transmissionMedia.filter(u=> {
      const name : string= u.name.toLowerCase();
      return name.indexOf(searchInput) > -1 ;
    });
  }
  
  onRemedyActionInputChange(){
    const searchInput = this.remedyActionsSearch.nativeElement.value ?
    this.remedyActionsSearch.nativeElement.value.toLowerCase() : '' ;
    this.remedyActions = this._remedyActions.filter(u=> {
      const name : string= u.name.toLowerCase();
      return name.indexOf(searchInput) > -1 ;
    });
  }
  onStatusInputChange(){
    const searchInput = this.statusNameSearch.nativeElement.value ?
    this.statusNameSearch.nativeElement.value.toLowerCase() : '' ;
    this.status = this._status.filter(u=> {
      const name : string= u.name.toLowerCase();
      return name.indexOf(searchInput) > -1 ;
    });
  }
  onClear() {
    this.form.reset();
    this.notificationService.success(':: Successfully Submitted');
  }
  onSubmit() {
    if (this.form.valid) {
      this.loading=true;
      this.dailyOperation.complaintNumber = Number(this.form.value.complaintNumber);
      this.dailyOperation.psdid = Number(this.form.value.PSDID);
      this.dailyOperation.circuitID = Number(this.form.value.circuitID);
      this.dailyOperation.customerName = this.form.value.customerName;
      this.dailyOperation.popNameId = Number(this.form.value.popNameIds);
      this.dailyOperation.zoneName =  this.form.value.zoneName;
      this.dailyOperation.operatorId = Number(this.form.value.operatorIds);
      this.dailyOperation.techNameId = Number(this.form.value.techNameIds);
      this.dailyOperation.remedyActionId = Number(this.form.value.remedyActionIds);
      this.dailyOperation.notes = this.form.value.notes;
      this.dailyOperation.transmissionMediaId = Number(this.form.value.transmissionMediaIds);
      this.dailyOperation.statusId = Number(this.form.value.statusIds);
      this.dailyOperation.assignedTo = this.form.value.assignedTo;
      this.dailyOperation.createdDate = this.form.value.createdDate;
      this.dailyOperation.closedDate = this.form.value.closedDate;
      this.dailyOperation.updatedBy = localStorage.getItem('userName') + " ";
      this.dailyOperation.updateDate = new Date();
      this.service.updateDailyOperation(this.dailyOperation).subscribe(res => {
        this.onClose();
        setTimeout(()=>{
          this.loading=false;
        },1500)
        this.notificationService.success(':: Successfully Updated');
      }, error => {
        setTimeout(()=>{
          this.loading=false;
        },0)
        this.notificationService.warn(':: An Error Occured')
      }
      );

    }
  }
  onClose() {
    this.form.reset();
    this.dialogRef.close();

  }

  OnChangeZoneName(event: any) {
    let zoneId = Number(event.value);
    this.service.GetPopNameByZoneId(zoneId).subscribe(res => {
      this.popNames = res.data as IpopName[];
    });
  }

  OnChangePopName(event: any) {
    let popNameId = Number(event.value);
    this.service.GetZoneName(popNameId).subscribe(res => {
      let zoneName = res.data as IzoneName;
      this.form.patchValue({
        zoneName: zoneName.name.toString()
      })
    });
  }

  IsBiger : boolean = false;
  handleclosedDateChange(event : any){
    // let createdDate = moment.tz(this.form.value.createdDate, 'Etc/UTC');
    let closedDate =  moment(this.form.value.closedDate._d);
    let createdDate =  moment(this.form.value.createdDate);
  
    if(createdDate > closedDate){
      this.IsBiger = true;
    }
    else  if(this.form.value.createdDate._d > this.form.value.closedDate._d){
      this.IsBiger = true;
    }
    else{
      this.IsBiger = false;
    }
  }


}
