import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EmpService } from 'src/app/shared/services/emp.service';
import { NotificationMsgService } from 'src/app/shared/services/notification-msg.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(public service :EmpService, public dialogRef: MatDialogRef<TestComponent>,public notificationService: NotificationMsgService) { }

  ngOnInit(){
  }
  departments =[
    {id:3 ,value:"Dep-1"},
    {id:2 ,value:"Dep-2"},
    {id:3 ,value:"Dep-3"}

  ]
  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    fullName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    mobile: new FormControl('', [Validators.required, Validators.minLength(11)]),
    city: new FormControl(''),
    gender: new FormControl('1'),
    department: new FormControl(0),
    hireDate: new FormControl(''),
    isPermanent: new FormControl(false)
  });
 

 
 
  onClear(){
    this.service.form.reset();
    this.service.initializeFormGroup();
    this.notificationService.success(':: Submitted successfully');
  }
  onSubmit(){
    if(this.service.form.valid){
      //this.service.insertEmployee(this.service.form.value)
      this.service.form.reset();
    this.service.initializeFormGroup();
    this.notificationService.success(':: Submitted successfully');
    this.onClose();

    }
  }
  onClose(){
    this.service.form.reset();
    this.service.initializeFormGroup();
    this.dialogRef.close();

  }


}
