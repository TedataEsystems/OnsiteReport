import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { IPopNameAbbreviations } from 'src/app/Model/IPopNameAbbreviations';
import { PopNameAbbreviationsService } from 'src/app/Services/pop-name-abbreviations.service';
import { DeleteServiceService } from 'src/app/shared/services/delete-service.service';
import { NotificationMsgService } from 'src/app/shared/services/notification-msg.service';

@Component({
  selector: 'app-pop-name-abbreviations',
  templateUrl: './pop-name-abbreviations.component.html',
  styleUrls: ['./pop-name-abbreviations.component.css']
})
export class PopNameAbbreviationsComponent implements OnInit {
loader=false;
  pageNumber = 1;
  pageSize = 25;
  searchKey: string = '';
  PopNameAbbreviations: IPopNameAbbreviations[] = [];
  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  displayedColumns: string[] = ['environment', 'zoneName', 'popName', 'exchCode'];
  dataSource = new MatTableDataSource(this.PopNameAbbreviations);

  constructor(private popNameAbbreviationservice: PopNameAbbreviationsService,
    private dialog: MatDialog,
    private dialogService: DeleteServiceService,
    private router: Router, private _activatedRoute: ActivatedRoute, private titleService: Title,
    public notificationService: NotificationMsgService) {
    this.titleService.setTitle("Field Opertion Report | Pop Name Abbreviations");
  }


  ngOnInit(): void {
    this.popNameAbbreviationservice.getRequests().subscribe(response => {
      this.PopNameAbbreviations = response;
      this.dataSource = new MatTableDataSource<any>(this.PopNameAbbreviations);
      this.dataSource.paginator = this.paginator as MatPaginator;
      this.dataSource.sort = this.sort as MatSort;
    })
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
    this.loader=true;
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
    setTimeout(()=>  this.loader=false ,2000)
   
  }

  //this section for pagination 
  pageIn = 0;
  previousSizedef = 25;
  pagesizedef: number = 25;
  public pIn: number = 0;
  pageChanged(event: any) {
    this.loader=true;
    this.pIn = event.pageIndex;
    this.pageIn = event.pageIndex;
    this.pagesizedef = event.pageSize;
    let pageIndex = event.pageIndex;
    let pageSize = event.pageSize;
    let previousSize = pageSize * pageIndex;
    this.previousSizedef = previousSize;
    this.getRequestdataNext(previousSize, pageSize, pageIndex + 1);
  }
  getRequestdataNext(cursize: number, pageSize: number, pageNum: number) {
    this.popNameAbbreviationservice.getPopNameAbbreviations(pageNum, pageSize).subscribe(res => {
      if (res.status == true) {
        this.PopNameAbbreviations.length = cursize;
        this.PopNameAbbreviations.push(...res?.data);
        this.PopNameAbbreviations.length = res?.pagination.totalCount;
        this.dataSource = new MatTableDataSource(this.PopNameAbbreviations);
        this.dataSource._updateChangeSubscription();
        this.dataSource.paginator = this.paginator as MatPaginator;
        this.dataSource.sort = this.sort as MatSort;
        this.loader=false;
      }
      else this.notificationService.warn(res.error)
    }, err => {
      this.notificationService.warn("! Fail");
      this.loader=false;

    })


  }

}
