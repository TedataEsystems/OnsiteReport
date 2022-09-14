import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ItransmissionMedia } from 'src/app/Model/ItransmissionMedia';
import { TransmissionMediaService } from 'src/app/Services/transmission-media.service';
import { DeleteServiceService } from 'src/app/shared/services/delete-service.service';
import { NotificationMsgService } from 'src/app/shared/services/notification-msg.service';

@Component({
  selector: 'app-transmission-media',
  templateUrl: './transmission-media.component.html',
  styleUrls: ['./transmission-media.component.css']
})
export class TransmissionMediaComponent implements OnInit {

loader:boolean=false;
  searchKey: string = '';
  editUsr: any;
  oldUsr: any;
  editdisabled: boolean = false;
  show: boolean = false;
  showNewRow: boolean = false;
  transmssionMedia: ItransmissionMedia[] = [];
  transmssionMediaName: string = '';
  transmssionMediaId: number = 0;
  isNameRepeated : boolean =false;
  isNameUpdatedRepeated : boolean =false;
  isDisabled = false;
  pageNumber = 1;
  pageSize =25;
  public colname: string = 'Id';
  public coldir: string = 'asc';

  constructor(private dialog: MatDialog,
    public service: TransmissionMediaService,
    private titleService: Title,
    private dialogService: DeleteServiceService,
    private notificationService: NotificationMsgService) {
    this.titleService.setTitle("TransmissionMedia");
  }

  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  displayedColumns: string[] = ['id', 'name','action'];
  dataSource = new MatTableDataSource(this.transmssionMedia);

  LoadTransmissionMedia() {
    this.service.getTransmissionMedia(this.pageNumber, this.pageSize, '', this.colname, this.coldir).subscribe(response => {
      this.transmssionMedia.push(...response?.data);
      this.transmssionMedia.length = response?.pagination.totalCount;
      this.dataSource = new MatTableDataSource<any>(this.transmssionMedia);
      this.dataSource._updateChangeSubscription();
      this.dataSource.paginator = this.paginator as MatPaginator;
      this.dataSource.sort = this.sort as MatSort;

    })
}

getRequestdata(pageNum: number, pageSize: number, search: string, sortColumn: string, sortDir: string) {
  this.loader = true;
  this.service.getTransmissionMedia(pageNum, pageSize, search, sortColumn, sortDir).subscribe(response => {
    setTimeout(()=>this.loader = false,2000);
    this.transmssionMedia = response?.data;
    this.transmssionMedia.length = response?.pagination.totalCount;
    this.dataSource = new MatTableDataSource<any>(this.transmssionMedia);
    this.dataSource._updateChangeSubscription();
    this.dataSource.paginator = this.paginator as MatPaginator;
  })
 
}



  // datatableRefresh(): void {
  //   this.dataSource.sort = this.sort as MatSort;
  //   this.service.getRequests().subscribe(res => {
  //     this.transmssionMedia = res as ItransmissionMedia[];
  //     this.dataSource = new MatTableDataSource(this.transmssionMedia);
  //     this.dataSource.paginator = this.paginator as MatPaginator;
  //     this.dataSource.sort = this.sort as MatSort;

  //   });
  // }
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
    let transmssionMedia: ItransmissionMedia =
    {
      id: this.transmssionMediaId,
      name: this.transmssionMediaName,
    }
    if (this.transmssionMediaId == 0) {
      this.service.insertTransmissionMedia(transmssionMedia).subscribe(
        res => {
          setTimeout(()=>{
            this.loader=false;
          },1500)
          this.notificationService.success(':: Successfully Added');
          this.LoadTransmissionMedia();
          this.transmssionMediaName = '';
          this.transmssionMediaId = 0;
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
      this.service.updateTransmissionMedia(transmssionMedia).subscribe(
        res => {
          setTimeout(()=>{
            this.loader=false;
          },1500)
          this.notificationService.success(':: Successfully Updated');
          this.LoadTransmissionMedia();
          this.transmssionMediaName = '';
          this.transmssionMediaId = 0;
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
      this.service.deleteTransmissionMedia(row.id).subscribe(
        rs =>{
          this.notificationService.success(':: Successfully Deleted');
          this.LoadTransmissionMedia();
         
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
    let transmssionMediaEdit: ItransmissionMedia =
    {
      id: row.id,
      name: row.name,
    }
    this.service.updateTransmissionMedia(transmssionMediaEdit).subscribe(
      res => {
        setTimeout(()=>{
          this.loader=false;
        },1500)
        this.notificationService.success(':: Successfully Updated');
        this.LoadTransmissionMedia();
        this.transmssionMediaName = '';
        this.transmssionMediaId = 0;
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
  }
addNew(){
  this.show=true;
}
onChecknameIsalreadysign()
{
  this.service.nameIsalreadysign(this.transmssionMediaName , this.transmssionMediaId).subscribe(
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
 let _transmssionMediaName = row.name;
 let _transmssionMediaId = row.id;
  this.service.nameIsalreadysign(_transmssionMediaName , _transmssionMediaId).subscribe(
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
  sortColumnDef: string = "Id";
  SortDirDef: string = 'asc';
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
   
      this.service.getTransmissionMedia(pageNum, pageSize, search, sortColumn, sortDir).subscribe(res => {
        if (res.status == true) {
          this.loader = false;
          this.transmssionMedia.length = cursize;
          this.transmssionMedia.push(...res?.data);
          this.transmssionMedia.length = res?.pagination.totalCount;
          this.dataSource = new MatTableDataSource<any>(this.transmssionMedia);
          this.dataSource._updateChangeSubscription();
          this.dataSource.paginator = this.paginator as MatPaginator;
          this.dataSource.sort = this.sort as MatSort;
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
