import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { IpopName } from 'src/app/Model/IpopName';
import { IzoneName } from 'src/app/Model/IzoneName';
import { PopNameService } from 'src/app/Services/pop-name.service';
import { ZoneNameService } from 'src/app/Services/zone-name.service';
import { DeleteServiceService } from 'src/app/shared/services/delete-service.service';
import { NotificationMsgService } from 'src/app/shared/services/notification-msg.service';

@Component({
  selector: 'app-pop-name',
  templateUrl: './pop-name.component.html',
  styleUrls: ['./pop-name.component.css']
})
export class PopNameComponent implements OnInit {
  searchKey: string = '';
  editUsr: any;
  oldUsr: any;
  editdisabled: boolean = false;
  show: boolean = false;
  loader:boolean=false;
  showNewRow: boolean = false;
  popNameModel: IpopName[] = [];
  popName: string = '';
  popNameId: number = 0;
 zoneNames: IzoneName[] = [];
 zoneNameId: number = 0;
 isNameRepeated : boolean =false;
 pageNumber = 1;
 pageSize = 25;
  isNameUpdatedRepeated : boolean =false;
  isDisabled = false;
  public colname: string = 'Id';
  public coldir: string = 'asc';
  sortColumnDef: string = "Id";
  SortDirDef: string = 'asc';
  constructor(private dialog: MatDialog,
    public service: PopNameService,
    private titleService: Title,
    private dialogService: DeleteServiceService,
    public zoneNameService: ZoneNameService,
    private notificationService: NotificationMsgService) 
    { this.titleService.setTitle("PopName"); }

    @ViewChild(MatSort) sort?: MatSort;
    @ViewChild(MatPaginator) paginator?: MatPaginator;
    displayedColumns: string[] = ['id', 'name', 'zoneName','action'];
    dataSource = new MatTableDataSource(this.popNameModel);

    
  LoadPopName() {
    this.service.getPopName(this.pageNumber, this.pageSize ,'',this.colname,this.coldir).subscribe(response => {
      this.popNameModel.push(...response?.data);
      this.popNameModel.length = response?.pagination.totalCount;
      this.dataSource = new MatTableDataSource<any>(this.popNameModel);
      this.dataSource._updateChangeSubscription();
      this.dataSource.paginator = this.paginator as MatPaginator;
      this.dataSource.sort = this.sort as MatSort;

      this.zoneNameService.getRequests().subscribe(res => {
        this.zoneNames = res  as IzoneName[];

      });

    })
}

getRequestdata(pageNum: number, pageSize: number, search: string, sortColumn: string, sortDir: string) {
  this.loader = true;
  this.service.getPopName(pageNum, pageSize, search, sortColumn, sortDir).subscribe(response => {
    this.popNameModel = response?.data;
    this.popNameModel.length = response?.pagination.totalCount;
    this.dataSource = new MatTableDataSource<any>(this.popNameModel);
    this.dataSource._updateChangeSubscription();
    this.dataSource.paginator = this.paginator as MatPaginator;
  })
  this.zoneNameService.getRequests().subscribe(res => {
    this.zoneNames = res  as IzoneName[];
  });
  setTimeout(()=> this.loader =false,2000)
}



    // datatableRefresh(): void {
    //   this.dataSource.sort = this.sort as MatSort;
    //   this.service.getRequests().subscribe(res => {
    //     this.popNameModel = res as IpopName[];
    //     this.dataSource = new MatTableDataSource(this.popNameModel);
    //     this.dataSource.paginator = this.paginator as MatPaginator;
    //     this.dataSource.sort = this.sort as MatSort;
  
    //   });

    //   this.zoneNameService.getRequests().subscribe(res => {
    //     this.zoneNames = res  as IzoneName[];
    //   });
    // }
  ngOnInit(): void 
  {
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
    let popNameModel: IpopName =
    {
      id: this.popNameId,
      name: this.popName,
      zoneNameId:Number(this.zoneNameId) ,
    }
    if (this.popNameId == 0) {
      this.service.insertPopName(popNameModel).subscribe(
        res => {
          setTimeout(()=>{
            this.loader=false;
          },1500)
          this.notificationService.success(':: Successfully Added');
          this.LoadPopName();
          this.popName = '';
          this.popNameId = 0;
          this.zoneNameId =0;
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
      this.service.updatePopName(popNameModel).subscribe(
        res => {
          setTimeout(()=>{
            this.loader=false;
          },1500)
          this.notificationService.success(':: Successfully Updated');
          this.LoadPopName();
          this.popName = '';
          this.popNameId = 0;
          this.zoneNameId =0;
        },
        error => { 
          setTimeout(()=>{
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
      this.service.deletePopName(row.id).subscribe(
        rs =>{
          this.notificationService.success(':: Successfully Deleted');
          window.location.reload();

      
         
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
  updateEdit(row : any) {
    this.loader=true;
    let popNameEdit: IpopName =
    {
      id: row.id,
      name: row.name,
      zoneNameId: Number(row.zoneNameId),
    }
    this.service.updatePopName(popNameEdit).subscribe(
      res => {
        setTimeout(()=>{
          this.loader=false;
        },1500)
        this.notificationService.success(':: Successfully Updated');
        this.LoadPopName();
        this.popName = '';
        this.popNameId = 0;
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
    this.service.nameIsalreadysign(this.popName , this.popNameId).subscribe(
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
   let _popName = row.name;
   let _popNameId = row.id;
    this.service.nameIsalreadysign(_popName , _popNameId).subscribe(
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
    
       this.service.getPopName(pageNum, pageSize,search,sortColumn,sortDir).subscribe(res => {
         if (res.status == true) {
          
           this.popNameModel.length = cursize;
           this.popNameModel.push(...res?.data);
           this.popNameModel.length = res?.pagination.totalCount;
           this.dataSource = new MatTableDataSource<any>(this.popNameModel);
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
