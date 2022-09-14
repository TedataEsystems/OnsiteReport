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
  selector: 'app-zone-name',
  templateUrl: './zone-name.component.html',
  styleUrls: ['./zone-name.component.css']
})
export class ZoneNameComponent implements OnInit {
  searchKey: string = '';
  editUsr: any;
  oldUsr: any;
  editdisabled: boolean = false;
  show: boolean = false;
  loader : boolean= false;
  showNewRow: boolean = false;
  zoneNameModel: IzoneName[] = [];
  zoneName: string = '';
  zoneNameId: number = 0;
  isNameRepeated: boolean = false;
  isNameUpdatedRepeated: boolean = false;
  isDisabled = false;
  pageNumber = 1;
  pageSize = 25;
  public colname: string = 'Id';
  public coldir: string = 'asc';

  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  displayedColumns: string[] = ['Id', 'name', 'action'];
  dataSource = new MatTableDataSource(this.zoneNameModel);

  constructor(private dialog: MatDialog,
    public service: ZoneNameService,
    public popNameService: PopNameService,
    private titleService: Title,
    private dialogService: DeleteServiceService,
    private notificationService: NotificationMsgService) { this.titleService.setTitle("ZoneName"); }

  LoadZoneName() {
    this.service.getZoneName(this.pageNumber, this.pageSize, '', this.colname, this.coldir).subscribe(response => {
      this.zoneNameModel.push(...response?.data);
      this.zoneNameModel.length = response?.pagination.totalCount;
      this.dataSource = new MatTableDataSource<any>(this.zoneNameModel);
      this.dataSource._updateChangeSubscription();
      this.dataSource.paginator = this.paginator as MatPaginator;
      this.dataSource.sort = this.sort as MatSort;

    })
  }
  getRequestdata(pageNum: number, pageSize: number, search: string, sortColumn: string, sortDir: string) {
    this.loader = true;
    this.service.getZoneName(pageNum, pageSize, search, sortColumn, sortDir).subscribe(response => {
      this.zoneNameModel = response?.data;
      this.zoneNameModel.length = response?.pagination.totalCount;
      this.dataSource = new MatTableDataSource<any>(this.zoneNameModel);
      this.dataSource._updateChangeSubscription();
      this.dataSource.paginator = this.paginator as MatPaginator;
    })
    setTimeout(()=>this.loader = false,2000);
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
    // this.dataSource.filter = this.searchKey.trim().toLowerCase();
    let searchData = this.searchKey.trim().toLowerCase();
    this.getRequestdata(1, 25, searchData, this.sortColumnDef, "asc");
  }

  editROw(r: any) {

    this.editUsr = r.id;
    this.editdisabled = true;

  }
  updateEdit(row: any) {
    this.loader = true;
    let zoneNameEdit: IzoneName =
    {
      id: row.id,
      name: row.name,
    }
    this.service.updateZoneName(zoneNameEdit).subscribe(
      res => {
        setTimeout(() => {
          this.loader = false;
        }, 1500)
        this.notificationService.success(':: Successfully Updated');

        this.LoadZoneName();
        this.zoneName = '';
        this.zoneNameId = 0;
      },
      error => {
        setTimeout(() => {
          this.loader = false;
        }, 0)
        this.notificationService.warn(':: An Error Occured')
      }

    );
    this.cancelEdit();
  }
  cancelEdit() {
    this.editdisabled = false;
    this.isNameUpdatedRepeated = false;
  }

  onCreateUpdate() {

    this.loader = true;

    let zoneNameModel: IzoneName =
    {
      id: this.zoneNameId,
      name: this.zoneName,
    }
    if (this.zoneNameId == 0) {
      this.service.insertZoneName(zoneNameModel).subscribe(
        res => {
          setTimeout(() => {
            this.loader = false;
          }, 1500)
          this.notificationService.success(':: Successfully Added');
          this.LoadZoneName();
          this.zoneName = '';
          this.zoneNameId = 0;
        }
        , error => {
          setTimeout(() => {
            this.loader = false;
          }, 0)
          this.notificationService.warn(':: An Error Occured ')
        });

    }
    else {
      this.service.updateZoneName(zoneNameModel).subscribe(
        res => {
          this.notificationService.success(':: Successfully Updated');
          this.LoadZoneName();
          this.zoneName = '';
          this.zoneNameId = 0;
        },
        error => { this.notificationService.warn(':: An Error Occured') }
      );


    }
    this.show = false
  }

  onDelete(row: any) {
    this.dialogService.openConfirmDialog().afterClosed().subscribe(res => {
      if (res) {
        this.service.deleteZoneName(row.id).subscribe(
          rs => {
            this.notificationService.success(':: Successfully Deleted');
            this.LoadZoneName();

          },
          error => { this.notificationService.warn(':: An Error Occured') }
        );
      }
    });
  }

  addNew() {
    this.show = true;
  }
  onChecknameIsalreadysign() {
    this.service.nameIsalreadysign(this.zoneName, this.zoneNameId).subscribe(
      res => {
        if (res.status == true) {
          this.isDisabled = false;
          this.isNameRepeated = false;
        } else {
          this.isDisabled = true;
          this.isNameRepeated = true;
        }
      });
  }
  onChecknameIsalreadysignWhenUpdate(row: any) {
    let _zoneName = row.name;
    let _zoneNameId = row.id;
    this.service.nameIsalreadysign(_zoneName, _zoneNameId).subscribe(
      res => {
        if (res.status == true) {
          this.isDisabled = false;
          this.isNameUpdatedRepeated = false;
        } else {
          this.isDisabled = true;
          this.isNameUpdatedRepeated = true;
        }
      });
  }

  //this section for pagination 
  sortColumnDef: string = "Id";
  SortDirDef: string = 'asc';
  pagesizedef: number = 25;
  pageIn = 0;
  previousSizedef = 25;
  simflag = true;
  adminflag = true;
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
    
    this.service.getZoneName(pageNum, pageSize, search, sortColumn, sortDir).subscribe(res => {
      if (res.status == true) {
        this.loader = false;
        this.zoneNameModel.length = cursize;
        this.zoneNameModel.push(...res?.data);
        this.zoneNameModel.length = res?.pagination.totalCount;
        this.dataSource = new MatTableDataSource<any>(this.zoneNameModel);
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
