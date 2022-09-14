import { ElementRef } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Ioperator } from 'src/app/Model/Ioperator';
import { OperatorService } from 'src/app/Services/operator.service';
import { PaginationService } from 'src/app/Services/pagination.service';
import { DeleteServiceService } from 'src/app/shared/services/delete-service.service';
import { NotificationMsgService } from 'src/app/shared/services/notification-msg.service';


@Component({
  selector: 'app-operator',
  templateUrl: './operator.component.html',
  styleUrls: ['./operator.component.css']
})
export class OperatorComponent implements OnInit {
  
  searchKey: string = '';
  editUsr: any;
  oldUsr: any;
  editdisabled: boolean = false;
  show: boolean = false;
  loader:boolean=false;
  showNewRow: boolean = false;
  operator: Ioperator[] = [];
  operatorName: string = '';
  operatorId: number = 0;
  totalCount: number = 0;
  isNameRepeated : boolean =false;
  isNameUpdatedRepeated : boolean =false;
  isDisabled = false;
  pageNumber = 1;
  pageSize = 25;
  public colname: string = 'Id';
  public coldir: string = 'asc';
  sortColumnDef: string = "Id";
  SortDirDef: string = 'asc';
  constructor(private dialog: MatDialog,
    public service: OperatorService,
    private titleService: Title,
    private dialogService: DeleteServiceService,
    private notificationService: NotificationMsgService,
    private paginationService: PaginationService) {
    this.titleService.setTitle("Operator");
  }

  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  displayedColumns: string[] = ['id', 'name','action'];
  dataSource = new MatTableDataSource(this.operator);
  LoadOperator() {
    this.service.getOperator(this.pageNumber, this.pageSize, '', this.colname, this.coldir).subscribe(response => {
      this.operator.push(...response?.data);
      this.operator.length = response?.pagination.totalCount;
      this.dataSource = new MatTableDataSource<any>(this.operator);
      this.dataSource._updateChangeSubscription();
      this.dataSource.paginator = this.paginator as MatPaginator;
      this.dataSource.sort = this.sort as MatSort;

    })
}

getRequestdata(pageNum: number, pageSize: number, search: string, sortColumn: string, sortDir: string) {
  this.loader = true;
  this.service.getOperator(pageNum, pageSize, search, sortColumn, sortDir).subscribe(response => {
    this.operator = response?.data;
    this.operator.length = response?.pagination.totalCount;
    this.dataSource = new MatTableDataSource<any>(this.operator);
    this.dataSource._updateChangeSubscription();
    this.dataSource.paginator = this.paginator as MatPaginator;
  })
  setTimeout(()=>this.loader = false,2000) ;
}

  ngOnInit(): void {
    this.editUsr = 0;
    this.getRequestdata(1, 25, '', this.sortColumnDef, this.SortDirDef);
  }



  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }
  applyFilter() {
    let searchData = this.searchKey.trim().toLowerCase();
    this.getRequestdata(1, 25, searchData, this.sortColumnDef, "asc");
  }

  onCreateUpdate() {
    this.loader=true;
    let operator: Ioperator =
    {
      id: this.operatorId,
      name: this.operatorName
    }
    if (this.operatorId == 0) {
      this.service.insertOperator(operator).subscribe(
        res => {
          setTimeout(()=>{
            this.loader=false;
          },1500)
          this.notificationService.success(':: successfully Added');
          this.LoadOperator();
          this.operatorName = '';
          this.operatorId = 0;
        }
        , error => {
          setTimeout(()=>{
            this.loader=false;
          },0)
          this.notificationService.warn(':: An Error Occured')
        }
      );

    }
    else {
      this.service.updateOperator(operator).subscribe(
        res => {
          setTimeout(()=>{
            this.loader=false;
          },1500)
          this.notificationService.success(':: Successfully Updated');
          this.LoadOperator();
          this.operatorName = '';
          this.operatorId = 0;
        },
        error => {   setTimeout(()=>{
          this.loader=false;
        },0)
          this.notificationService.warn(':: An Error Occured') }
      );


    }
    this.show=false;

  }
  onDelete(row:any) {
    this.dialogService.openConfirmDialog().afterClosed().subscribe(res =>{
    if(res) {
      this.service.deleteOperator(row.id).subscribe(
        rs =>{
          this.notificationService.success(':: Successfully Deleted');
          this.LoadOperator();
         
        },
        error=>{this.notificationService.warn(':: An Error Occured')}
        );
    } 
  });
  }

  editROw(r: any) {

    this.editUsr = r.id;
    this.editdisabled = true;

  }
  onChecknameIsalreadysignWhenUpdate(row : any)
  {
   let _operatorName = row.name;
   let _operatorId = row.id;
    this.service.nameIsalreadysign(_operatorName , _operatorId).subscribe(
      res =>{
    if(res.status == true )
    {
      this.isDisabled = false;
      this.isNameUpdatedRepeated=false;
    }else
    {
      this.isDisabled  = true;
      this.isNameUpdatedRepeated=true;
    }
    });
  }
  updateEdit(row : any) {
    this.loader=true;
    let operatorEdit: Ioperator =
    {
      id: row.id,
      name: row.name
    }
    this.service.updateOperator(operatorEdit).subscribe(
      res => {
        setTimeout(()=>{
          this.loader=false;
        },1500)
        this.notificationService.success(' :: Successfully Updated');
        this.LoadOperator();
        this.operatorName = '';
        this.operatorId = 0;
      },
      error => { 
        setTimeout(()=>{
          this.loader=false;
        },0)
        this.notificationService.warn(':: An Error Occured') }
    );
    this.cancelEdit();
  }
  cancelEdit() {
    this.editdisabled = false;
    this.isNameUpdatedRepeated=false;  }
  addNew(){
    this.show=true;
  }

  onChecknameIsalreadysign()
  {
    this.service.nameIsalreadysign(this.operatorName , this.operatorId).subscribe(
      res =>{
    if(res.status == true )
    {
      this.isDisabled = false;
      this.isNameRepeated=false;
    }else
    {
      this.isDisabled  = true;
      this.isNameRepeated=true;
    }
    });
  }

    //this section for pagination 
    pageIn = 0;
    previousSizedef = 25;
    pagesizedef: number = 25;
    public pIn: number = 0;
    pageChanged(event: any) {
      this.loader = true;
      this.pIn = event.pageIndex;
      this.pageIn = event.pageIndex;
      this.pagesizedef = event.pageSize;
      let pageIndex = event.pageIndex;
      let pageSize = event.pageSize;
      let previousSize = pageSize * pageIndex;
      this.previousSizedef = previousSize;
      this.getRequestdataNext(previousSize,  pageIndex + 1, pageSize, '', this.sortColumnDef, this.SortDirDef);
    }
    getRequestdataNext(cursize: number, pageNum: number, pageSize: number, search: string, sortColumn: string, sortDir: string) {
      
        this.service.getOperator(pageNum, pageSize, search, sortColumn, sortDir).subscribe(res => {
          if (res.status == true) {
            this.loader = false;
            this.operator.length = cursize;
            this.operator.push(...res?.data);
            this.operator.length = res?.pagination.totalCount;
            this.dataSource = new MatTableDataSource<any>(this.operator);
            this.dataSource._updateChangeSubscription();
            this.dataSource.paginator = this.paginator as MatPaginator;
            this.loader = false;
          }
          else this.notificationService.warn(res.error)
        }, err => {
          this.notificationService.warn("! Fail");
          this.loader = false;
  
        })
      
  
    }
  
    lastcol: string = 'Id';
    lastdir: string = 'asc';
  
    sortData(sort: any) {
      if (this.pIn != 0)
        window.location.reload();
      if (this.lastcol == sort.active && this.lastdir == sort.direction) {
        if (this.lastdir == 'asc')
          sort.direction = 'desc';
        else
          sort.direction = 'asc';
      }
      this.lastcol = sort.active; this.lastdir = sort.direction;
      var c = this.pageIn;
      this.getRequestdata(1, 25, '', sort.active, this.lastdir);
    }
}
