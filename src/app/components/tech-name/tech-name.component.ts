import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ItechName } from 'src/app/Model/ItechName';
import { TechNameService } from 'src/app/Services/tech-name.service';
import { DeleteServiceService } from 'src/app/shared/services/delete-service.service';
import { NotificationMsgService } from 'src/app/shared/services/notification-msg.service';

@Component({
  selector: 'app-tech-name',
  templateUrl: './tech-name.component.html',
  styleUrls: ['./tech-name.component.css']
})
export class TechNameComponent implements OnInit {

  searchKey: string = '';
  editUsr: any;
  oldUsr: any;
  editdisabled: boolean = false;
  show: boolean = false;
  loader:boolean=false;
  showNewRow: boolean = false;
  techNameModel: ItechName[] = [];
  techName: string = '';
  techNameId: number = 0;
  isNameRepeated : boolean =false;
  isNameUpdatedRepeated : boolean =false;
  isDisabled = false;
  pageNumber = 1;
  pageSize =25;
  sortColumnDef: string = "Id";
  SortDirDef: string = 'asc';
  public colname: string = 'Id';
  public coldir: string = 'asc';

  constructor(private dialog: MatDialog,
    public service: TechNameService,
    private titleService: Title,
    private dialogService: DeleteServiceService,
    private notificationService: NotificationMsgService) {
    this.titleService.setTitle("TechName");
  }

  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  displayedColumns: string[] = ['id', 'name','action'];
  dataSource = new MatTableDataSource(this.techNameModel);

  LoadTechName() {
    this.service.getTechName(this.pageNumber, this.pageSize, '', this.colname, this.coldir).subscribe(response => {
      this.techNameModel.push(...response?.data);
      this.techNameModel.length = response?.pagination.totalCount;
      this.dataSource = new MatTableDataSource<any>(this.techNameModel);
     // this.dataSource._updateChangeSubscription();
      this.dataSource.paginator = this.paginator as MatPaginator;

    })
}

getRequestdata(pageNum: number, pageSize: number, search: string, sortColumn: string, sortDir: string) {
  this.loader = true;
  this.service.getTechName(pageNum, pageSize, search, sortColumn, sortDir).subscribe(response => {
    this.techNameModel = response?.data;
    this.techNameModel.length = response?.pagination.totalCount;
    this.dataSource = new MatTableDataSource<any>(this.techNameModel);
    this.dataSource._updateChangeSubscription();
    this.dataSource.paginator = this.paginator as MatPaginator;
  })
  setTimeout(()=> this.loader = false,2000) ;
}



  ngOnInit(): void {
    this.editUsr = 0;
    this.getRequestdata(1, 25, '', this.sortColumnDef, this.SortDirDef);
  }

  ngAfterViewInit() {

    this.dataSource.sort = this.sort as MatSort;
    this.dataSource.paginator = this.paginator as MatPaginator;
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
    let techNameModel: ItechName =
    {
      id: this.techNameId,
      name: this.techName,
    }
    if (this.techNameId == 0) {
      this.service.insertTechName(techNameModel).subscribe(
        res => {
          setTimeout(()=>{
            this.loader=false;
          },1500)
          this.notificationService.success(':: Successfully Added');
          this.LoadTechName();
          this.techName = '';
          this.techNameId = 0;
        }
        , error => {
          setTimeout(()=>{
            this.loader=false;
          },0)
          this.notificationService.warn(':: An Error Occured ')
        }
      );

    }
    else {
      this.service.updateTechName(techNameModel).subscribe(
        res => {
          setTimeout(()=>{
            this.loader=false;
          },1500)
          this.notificationService.success(':: Successfully Updated');
          this.LoadTechName();
          this.techName = '';
          this.techNameId = 0;
        },
        error => { 
          setTimeout(()=>{
            this.loader=false;
          },0)
          this.notificationService.warn(':: An Error Occured') }
      );


    }
this.show= false;
  }
  onDelete(row:any) {
    this.dialogService.openConfirmDialog().afterClosed().subscribe(res =>{
    if(res) {
      this.service.deleteTechName(row.id).subscribe(
        rs =>{
          this.notificationService.success(':: Successfully Deleted');
          this.LoadTechName();
        },
        error=>{
         
          this.notificationService.warn(':: An Error Occured')}
        );
    } 
  });
  }

  editROw(r: any) {

    this.editUsr = r.id;
    this.editdisabled = true;

  }
  updateEdit(row : any) {
    this.loader=true;
    let techNameEdit: ItechName=
    {
      id: row.id,
      name: row.name,
    }
    this.service.updateTechName(techNameEdit).subscribe(
      res => {
        setTimeout(()=>{
          this.loader=false;
        },1500)
        this.notificationService.success(':: Successfully Updated');
        this.LoadTechName();
        this.techName = '';
        this.techNameId = 0;
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
    this.isNameUpdatedRepeated=false;
  }
  addNew(){
    this.show=true
  }
  onChecknameIsalreadysign()
  {
    this.service.nameIsalreadysign(this.techName , this.techNameId).subscribe(
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

  onChecknameIsalreadysignWhenUpdate(row : any)
  {
   let _techName = row.name;
   let _techNameId = row.id;
    this.service.nameIsalreadysign(_techName , _techNameId).subscribe(
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
  
      this.service.getTechName(pageNum, pageSize, search, sortColumn, sortDir).subscribe(res => {
        if (res.status == true) {
         
          this.techNameModel.length = cursize;
          this.techNameModel.push(...res?.data);
          this.techNameModel.length = res?.pagination.totalCount;
          this.dataSource = new MatTableDataSource<any>(this.techNameModel);
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
