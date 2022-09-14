import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ILogs } from 'src/app/Model/ILogs';
import { LogsService } from 'src/app/Services/logs.service';
import { DeleteServiceService } from 'src/app/shared/services/delete-service.service';
import { NotificationMsgService } from 'src/app/shared/services/notification-msg.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {

  pageNumber = 1;
  pageSize = 25;
  sortColumnDef: string = "Id";
  SortDirDef: string = 'desc';
  public colname: string = 'Id';
  public coldir: string = 'desc';
  searchKey:string ='' ;
  Logs :ILogs []=[];
  @ViewChild(MatSort) sort?:MatSort ;
  @ViewChild(MatPaginator) paginator?:MatPaginator ;
  displayedColumns: string[] = ['id','elementId','descirption' ,'creationDate','parentType','userName','groupName','actionType'];
  dataSource=new MatTableDataSource(this.Logs);

  constructor(private logsService : LogsService ,
    private dialog: MatDialog,
    private dialogService:DeleteServiceService,
   private router: Router,private _activatedRoute: ActivatedRoute, private titleService:Title,
   public notificationService: NotificationMsgService) { 
    this.titleService.setTitle("Field Opertion Report | Logs"); 
   }

getRequestdata(pageNum: number, pageSize: number, search: string, sortColumn: string, sortDir: string) {

  this.logsService.getLogs(pageNum, pageSize, search, sortColumn, sortDir).subscribe(response => {
    this.Logs = response?.data;
    this.Logs.length = response?.pagination.totalCount;
    this.dataSource = new MatTableDataSource<any>(this.Logs);
    this.dataSource._updateChangeSubscription();
    this.dataSource.paginator = this.paginator as MatPaginator;
  })

}

  ngOnInit(): void {
    this.getRequestdata(1, 25, '', this.sortColumnDef, this.SortDirDef);
  }

    onSearchClear(){
      this.searchKey ='';
      this.applyFilter();
    }
    applyFilter(){let searchData = this.searchKey.trim().toLowerCase();
      this.getRequestdata(1, 25, searchData, this.sortColumnDef, "asc");
    }

  //this section for pagination 
  pageIn = 0;
  previousSizedef = 25;
  pagesizedef: number = 25;
  public pIn: number = 0;
  pageChanged(event: any) {
    this.pIn = event.pageIndex;
    this.pageIn = event.pageIndex;
    this.pagesizedef = event.pageSize;
    let pageIndex = event.pageIndex;
    let pageSize = event.pageSize;
    let previousSize = pageSize * pageIndex;
    this.previousSizedef = previousSize;
    this.getRequestdataNext(previousSize,  pageIndex + 1, pageSize, '', this.sortColumnDef, this.SortDirDef);
  }
  getRequestdataNext( cursize: number, pageNum: number, pageSize: number, search: string, sortColumn: string, sortDir: string) {
      this.logsService.getLogs(pageNum, pageSize, search, sortColumn, sortDir).subscribe(res => {
        if (res.status == true) {
          this.Logs.length = cursize;
          this.Logs.push(...res?.data);
          this.Logs.length = res?.pagination.totalCount;
          this.dataSource = new MatTableDataSource(this.Logs);
          this.dataSource._updateChangeSubscription();
          this.dataSource.paginator = this.paginator as MatPaginator;
        }
        else this.notificationService.warn(res.error)
      }, err => {
        this.notificationService.warn("! Fail");

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
