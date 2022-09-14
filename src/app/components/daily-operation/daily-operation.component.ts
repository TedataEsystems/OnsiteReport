import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IdailyOperations } from 'src/app/Model/IdailyOperations';
import { Ioperator } from 'src/app/Model/Ioperator';
import { IpopName } from 'src/app/Model/IpopName';
import { IremedyAction } from 'src/app/Model/IremedyAction';
import { Istatus } from 'src/app/Model/Istatus';
import { ItechName } from 'src/app/Model/ItechName';
import { ItransmissionMedia } from 'src/app/Model/ItransmissionMedia';
import { DailyOperationsService } from 'src/app/Services/daily-operations.service';
import { DeleteServiceService } from 'src/app/shared/services/delete-service.service';
import { NotificationMsgService } from 'src/app/shared/services/notification-msg.service';
import { AddDailyOperationComponent } from '../add-daily-operation/add-daily-operation.component';
import { EditDailyOpertionComponent } from '../edit-daily-opertion/edit-daily-opertion.component';
import { saveAs } from 'file-saver';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { FormControl, FormGroup } from '@angular/forms';
import { IdailyOperationsSearch } from 'src/app/Model/IdailyOperationsSearch';
import { IzoneName } from 'src/app/Model/IzoneName';
import { Pagination } from 'src/app/Model/pagination';
@Component({
  selector: 'app-daily-operation',
  templateUrl: './daily-operation.component.html',
  styleUrls: ['./daily-operation.component.css']
})
export class DailyOperationComponent implements OnInit {
  @ViewChild('popNameSearch') popNameSearch!: ElementRef;
  @ViewChild('operatorSearch') operatorSearch!: ElementRef;
  @ViewChild('techNameSearch') techNameSearch!: ElementRef;
  @ViewChild('statusNameSearch') statusNameSearch!: ElementRef;
  @ViewChild('transmissionMediaSearch') transmissionMediaSearch!: ElementRef;
  @ViewChild('remedyActionsSearch') remedyActionsSearch!: ElementRef;
  searchKey: string = '';
  editUsr: any;
  oldUsr: any;
  loader: boolean=false;
  editdisabled: boolean = false;
  show: boolean = false;
  showNewRow: boolean = false;
  dailyOperations: any[] = [];
  dailyOperation: IdailyOperations = <IdailyOperations>{};
  dailyOperationSearch: IdailyOperationsSearch = <IdailyOperationsSearch>{};
  popNames: IpopName[] = [];
  _popNames: IpopName[] = [];
  status: Istatus[] = [];
  _status: Istatus[] = [];
  techNames: ItechName[] = [];
  _techNames: ItechName[] = [];
  transmissionMedia: ItransmissionMedia[] = [];
  _transmissionMedia: ItransmissionMedia[] = [];
  remedyActions: IremedyAction[] = [];
  _remedyActions: IremedyAction[] = [];
  operators: Ioperator[] = [];
  _operators: Ioperator[] = [];
  selected: string = "";
  loading: boolean = false;
  panelOpenState = false;
  displayAll: Boolean = false;
  isFilterationData: Boolean = false;
  pageNumber = 1;
  pageSize = 25;
  pagination?: Pagination;
  public colname: string = 'Id';
  public coldir: string = 'asc';
  sortColumnDef: string = "Id";
  SortDirDef: string = 'asc';
  searchData : string = '';
  form: FormGroup = new FormGroup({
    complaintNumber: new FormControl(''),
    PSDID: new FormControl(''),
    circuitID: new FormControl(''),
    customerName: new FormControl(''),
    popNameIds: new FormControl(''),
    zoneName: new FormControl(''),
    operatorIds: new FormControl(''),
    assignedTo: new FormControl(''),
    techNameIds: new FormControl(''),
    remedyActionIds: new FormControl(''),
    transmissionMediaIds: new FormControl(''),
    statusIds: new FormControl(''),
    createdDateFrom: new FormControl(''),
    createdDateTo: new FormControl(''),
    closedDateFrom: new FormControl(''),
    closedDateTo: new FormControl(''),

  });
 

  constructor(private router: Router, private dialog: MatDialog, public service: DailyOperationsService, private titleService: Title, private dialogService: DeleteServiceService, public notificationService: NotificationMsgService, private _bottomSheet: MatBottomSheet) {
    this.titleService.setTitle("DailyOperations");
  }


  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  displayedColumns: string[] = [ 'id','all',  'complaintNumber', 'psdid', 'circuitID', 'customerName', '_PopName',
    'zoneName', 'createdDate', 'createdTime', 'closedDate', 'closedTime','sla','_OperatorName', 'assignedTo', '_TechName', '_RemedyActionName', 'notes', '_TransmissionMediaName',
    '_StatusName',   'updateDate', 'createdBy','updatedBy', 'isToLate','flag','action'];
  dataSource = new MatTableDataSource<any>();
  getRequestdata(pageNum: number, pageSize: number, search: string, sortColumn: string, sortDir: string) {
    this.loader = true;
    if (this.displayAll) {
      this.service.getAllDaily(pageNum, pageSize, search, sortColumn, sortDir).subscribe(response => {
        this.dailyOperations = response?.data as IdailyOperations[];
        this.dailyOperations.length = response?.pagination.totalCount;
        this.dataSource = new MatTableDataSource<any>(this.dailyOperations);
      this.dataSource._updateChangeSubscription();
        this.dataSource.paginator = this.paginator as MatPaginator;
        
      })
    } else {     
      this.service.getDaily(pageNum, pageSize, search, sortColumn, sortDir).subscribe(response => {
        this.dailyOperations = response?.data as IdailyOperations[];
        this.dailyOperations.length = response?.pagination.totalCount;
        this.dataSource = new MatTableDataSource<any>(this.dailyOperations);
        this.dataSource._updateChangeSubscription();
        this.dataSource.paginator = this.paginator as MatPaginator;
      })
    }
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
    //this.loading = false;
   setTimeout(()=> this.loader = false,2000);
  }
  ngOnInit() {
    this.editUsr = 0;
    this.getRequestdata(1, 25, this.searchData ,  this.sortColumnDef, this.SortDirDef);
  }


  onOperatorsInputChange() {
    const searchInput = this.operatorSearch.nativeElement.value ?
      this.operatorSearch.nativeElement.value.toLowerCase() : '';
    this.operators = this._operators.filter(u => {
      const name: string = u.name.toLowerCase();
      return name.indexOf(searchInput) > -1;
    });
  }
  onPopNameInputChange() {
    const searchInput = this.popNameSearch.nativeElement.value ?
      this.popNameSearch.nativeElement.value.toLowerCase() : '';
    this.popNames = this._popNames.filter(u => {
      const name: string = u.name.toLowerCase();
      return name.indexOf(searchInput) > -1;
    });
  }

  onTechNameInputChange() {
    const searchInput = this.techNameSearch.nativeElement.value ?
      this.techNameSearch.nativeElement.value.toLowerCase() : '';
    this.techNames = this._techNames.filter(u => {
      const name: string = u.name.toLowerCase();
      return name.indexOf(searchInput) > -1;
    });
  }
  onTransmissionMediaInputChange() {
    const searchInput = this.transmissionMediaSearch.nativeElement.value ?
      this.transmissionMediaSearch.nativeElement.value.toLowerCase() : '';
    this.transmissionMedia = this._transmissionMedia.filter(u => {
      const name: string = u.name.toLowerCase();
      return name.indexOf(searchInput) > -1;
    });
  }

  onRemedyActionInputChange() {
    const searchInput = this.remedyActionsSearch.nativeElement.value ?
      this.remedyActionsSearch.nativeElement.value.toLowerCase() : '';
    this.remedyActions = this._remedyActions.filter(u => {
      const name: string = u.name.toLowerCase();
      return name.indexOf(searchInput) > -1;
    });
  }
  onStatusInputChange() {
    const searchInput = this.statusNameSearch.nativeElement.value ?
      this.statusNameSearch.nativeElement.value.toLowerCase() : '';
    this.status = this._status.filter(u => {
      const name: string = u.name.toLowerCase();
      return name.indexOf(searchInput) > -1;
    });
  }


  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }
  onAdvancedSearchClear() {
    this.applyFilter();
  }
  applyFilter() {
    this.isFilterationData = true;
    this.searchData = this.searchKey.trim().toLowerCase();
    this.getRequestdata(this.pageNumber, this.pageSize, this.searchData, this.sortColumnDef, "asc");
  }
  AdvancedSearch() {
   this.isFilterationData = true;
   this.loader=true;
   //setTimeout(()=>this.loader=true ,10000 )
  //  this.loading=true;
    this.togglePanel();
    this.dailyOperationSearch.complaintNumber = Number(this.form.value.complaintNumber);
    this.dailyOperationSearch.psdid = Number(this.form.value.PSDID);
    this.dailyOperationSearch.circuitID = Number(this.form.value.circuitID);
    this.dailyOperationSearch.customerName = this.form.value.customerName;
    this.dailyOperationSearch.popNameId = Number(this.form.value.popNameIds);
    this.dailyOperationSearch.zoneName = this.form.value.zoneName;
    this.dailyOperationSearch.assignedTo = this.form.value.assignedTo;
    this.dailyOperationSearch.operatorId = Number(this.form.value.operatorIds);
    this.dailyOperationSearch.techNameId = Number(this.form.value.techNameIds);
    this.dailyOperationSearch.remedyActionId = Number(this.form.value.remedyActionIds);
    this.dailyOperationSearch.notes = this.form.value.notes;
    this.dailyOperationSearch.transmissionMediaId = Number(this.form.value.transmissionMediaIds);
    this.dailyOperationSearch.statusId = Number(this.form.value.statusIds);
    this.dailyOperationSearch.createdDateFrom = this.form.value.createdDateFrom == "" ? null : this.form.value.createdDateFrom;
    this.dailyOperationSearch.createdDateTo = this.form.value.createdDateTo == "" ? null : this.form.value.createdDateTo;
    this.dailyOperationSearch.closedDateFrom = this.form.value.closedDateFrom == "" ? null : this.form.value.closedDateFrom;
    this.dailyOperationSearch.closedDateTo = this.form.value.closedDateTo == "" ? null : this.form.value.closedDateTo;
    this.service.AdvancedSearch(this.dailyOperationSearch).subscribe(res => {
      this.dailyOperations = res as IdailyOperations[];
      this.dataSource = new MatTableDataSource(this.dailyOperations);
      this.dataSource.paginator = this.paginator as MatPaginator;
      this.dataSource.sort = this.sort as MatSort;
      //this.loader=false;
      setTimeout(()=>this.loader=false ,3000 )
    });

  }
  //////////////import file
  @Input() param = 'file';
  @ViewChild('LIST') template!: TemplateRef<any>;
  @ViewChild('LISTF') templateF!: TemplateRef<any>;
  @ViewChild('fileInput') fileInput?: ElementRef;
  @ViewChild('Msg') Msg!: TemplateRef<any>;
  @ViewChild('data') data?: ElementRef;
  fileAttr = 'Choose File';
  fileAttrF = 'Choose File';
  htmlToAdd: string = "";
  fileuploaded: any;

  /*******************************file **************************************** */
  ////////////////Export excel/////////////////////////////////////////
  @ViewChild('TABLE') table?: ElementRef;
  Ids: string[] = [];
  // select all
  isall: boolean = false;
  onselectcheckall(event: any) {
    if (event.checked) {

      this.isall = true;
    }
    else {
      this.isall = false;

    }
  }

  onselectcheck(event: any, r: any) {
    if (event.checked) {
      this.Ids.push(r.id.toString());
    }
    else {
      const index: number = this.Ids.indexOf(r.id.toString());
      if (index !== -1) {
        this.Ids.splice(index, 1);
      }

    }



  }

  ExportTOExcel() {
    if (this.isall && this.displayAll == false && this.isFilterationData==false) {
      this.service.ExportExcelWithData().subscribe(res => {

        const blob = new Blob([res], { type: 'application/vnd.ms.excel' });
        const file = new File([blob], 'DailyFieldOperationsReport' + Date.now() + '.xlsx', { type: 'application/vnd.ms.excel' });

        saveAs(file, 'DailyFieldOperationsReport' + Date.now() + '.xlsx')

      }, err => {

        this.notificationService.warn("! Fail")

      });
    }
    else if (this.isall && this.displayAll && this.isFilterationData==false) {
      this.service.DownloadAllDisplayDataOfExcel().subscribe(res => {

        const blob = new Blob([res], { type: 'application/vnd.ms.excel' });
        const file = new File([blob], 'DailyFieldOperationsReport' + Date.now() + '.xlsx', { type: 'application/vnd.ms.excel' });

        saveAs(file, 'DailyFieldOperationsReport' + Date.now() + '.xlsx')

      }, err => {

        this.notificationService.warn("! Fail")

      });
    }
    else if ((this.isall && this.isFilterationData) || (this.isall && this.displayAll && this.isFilterationData)){
      this.service.ExportExcelWithselectData(this.dailyOperations.map(({ id }) => id)).subscribe(res => {
        console.log(this.dailyOperations.map(({ id }) => id));
        const blob = new Blob([res], { type: 'application/vnd.ms.excel' });
        const file = new File([blob], 'Supportrequestedit' + '.xlsx', { type: 'application/vnd.ms.excel' });
        saveAs(file, 'DailyFieldOperationsReport' + Date.now() + '.xlsx')

      },
        err => {
          this.notificationService.warn("! Fail")
        });
    }
    else {
      if (this.Ids.length == 0) {
        this.notificationService.warn('select rows !')
        return;
      }

      this.service.ExportExcelWithselectData(this.Ids).subscribe(res => {

        const blob = new Blob([res], { type: 'application/vnd.ms.excel' });
        const file = new File([blob], 'Supportrequestedit' + '.xlsx', { type: 'application/vnd.ms.excel' });
        saveAs(file, 'DailyFieldOperationsReport' + Date.now() + '.xlsx')

      },
        err => {
          this.notificationService.warn("! Fail")
        });

    }

  }


  uploadFileEvtF(imgFile: any) {
    this.fileuploaded = imgFile.target.files[0];
    if (imgFile.target.files && imgFile.target.files[0]) {
      this.fileAttr = '';
      Array.prototype.forEach.call(imgFile.target.files, (file) => {
        this.fileAttr += file.name + ' - ';
      });
      let reader = new FileReader();
      reader.onload = (e: any) => {
        let image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          let imgBase64Path = e.target.result;
        };
      };
      reader.readAsDataURL(imgFile.target.files[0]);

      // Reset if duplicate image uploaded again
      (this.fileInput as ElementRef).nativeElement.value = "";
    } else {
      this.fileAttr = 'Choose File';
    }
  }
  addNew() {
    const dialogGonfig = new MatDialogConfig();
    dialogGonfig.disableClose = true;
    dialogGonfig.autoFocus = true;
    dialogGonfig.height = "90%";
    dialogGonfig.width = "85%";
    dialogGonfig.panelClass = 'modals-dialog';
    this.dialog.open(AddDailyOperationComponent, dialogGonfig).afterClosed().subscribe(result => {
      this.getRequestdata(1, 25, '', this.sortColumnDef, this.SortDirDef);

    });
  }

  close() {
    this.resetfile();
    this._bottomSheet.dismiss();
  }
  resetfile() {
    this.fileAttr = 'Choose File';
  }
  openBottomSheetMsg() {
    this._bottomSheet.open(this.Msg, {
      panelClass: 'msg-dialog-container',
      disableClose: true
    });
  }
  openBottomSheet() {
    this._bottomSheet.open(this.template, {
      panelClass: 'botttom-dialog-container',
      disableClose: true
    });
  }
  openBottomSheetedit() {
    this._bottomSheet.open(this.templateF, {
      panelClass: 'botttom-dialog-container',
      disableClose: true


    });

  }

  upLoadF() {
    const fd = new FormData();
    fd.append(this.param, this.fileuploaded);
    this.service.addFromFile(fd).subscribe(res => {
      if (res.status == true) {
        this.getRequestdata(1, 25, '', this.sortColumnDef, this.SortDirDef);
        this.fileAttr = 'Choose File';
        this.resetfile();
        this._bottomSheet.dismiss();
        this.openBottomSheetMsg();
        this.htmlToAdd = res.data
      }
      else {
        this.openBottomSheetMsg();
        this.htmlToAdd = res.error;
      }
    }
      , error => {
        this.notificationService.warn("!! Fail")
        this.resetfile();
      }
    );


  }

  onDelete(r: any) {
    this.dialogService.openConfirmDialog().afterClosed().subscribe(res => {
      if (res) {
        this.service.deleteDailyOperation(r.id).subscribe(
          rs => {
            this.notificationService.success(':: successfully Deleted');
            this.getRequestdata(1, 25, '', this.sortColumnDef, this.SortDirDef);
          },
          error => { this.notificationService.warn(':: An Error Occured') }
        );
      }
    });
  }

  editROw(id: any) {
    const dialogGonfig = new MatDialogConfig();
    dialogGonfig.disableClose = true;
    dialogGonfig.autoFocus = true;
    dialogGonfig.width = "85%";
    dialogGonfig.height = "90%";

    dialogGonfig.panelClass = 'modals-dialog';
    dialogGonfig.data = { id }
    this.dialog.open(EditDailyOpertionComponent, dialogGonfig).afterClosed().subscribe(result => {
      this.getRequestdata(1, 25, '', this.sortColumnDef, this.SortDirDef);

    });

  }
  updateEdit(r: any) {
    this.cancelEdit();
  }
  cancelEdit() {
    this.editdisabled = false;
  }

  ExportTOEmptyExcel() {

    this.service.ExportEmptyExcel().subscribe(res => {

      const blob = new Blob([res], { type: 'application/vnd.ms.excel' });
      const file = new File([blob], 'DailyFieldOperationsReport' + Date.now() + '.xlsx', { type: 'application/vnd.ms.excel' });
      saveAs(file, 'DailyFieldOperationsEmpty' + Date.now() + '.xlsx')

    }, err => {
      this.notificationService.warn("! Fail")
    });



  }

  closeMsg() {
    this._bottomSheet.dismiss();
  }
  onSubmit() {
    this.loading = true;
    if (this.form.valid) {
      this.dailyOperation.id = this.form.value.id;
      this.dailyOperation.complaintNumber = Number(this.form.value.complaintNumber);
      this.dailyOperation.psdid = Number(this.form.value.PSDID);
      this.dailyOperation.circuitID = Number(this.form.value.circuitID);
      this.dailyOperation.customerName = this.form.value.customerName;
      this.dailyOperation.popNameId = Number(this.form.value.popNameIds);
      this.dailyOperation.zoneName = this.form.value.zoneName;
      this.dailyOperation.operatorId = Number(this.form.value.operatorIds);
      this.dailyOperation.techNameId = Number(this.form.value.techNameIds);
      this.dailyOperation.remedyActionId = Number(this.form.value.remedyActionIds);
      this.dailyOperation.notes = this.form.value.notes;
      this.dailyOperation.transmissionMediaId = Number(this.form.value.transmissionMediaIds);
      this.dailyOperation.statusId = Number(this.form.value.statusIds);
      this.dailyOperation.creationDate = new Date();
      this.dailyOperation.createdDate = this.form.value.createdDate;
      this.dailyOperation.closedDate = this.form.value.closedDate == "" ? null : this.form.value.closedDate;
      this.dailyOperation.createdBy = localStorage.getItem('userName') + " ";
      this.dailyOperation.assignedTo = localStorage.getItem('userName') + " ";

      this.service.insertDailyOperation(this.dailyOperation).subscribe(res => {

        setTimeout(() => {
          this.loading = false;
        }, 1500)
        this.clearFields();
        //this.notificationService.success(':: Saved Successfully');
      }, error => {
        setTimeout(() => {
          this.loading = false;
        }, 0)

        //this.notificationService.warn(':: An Error Occured')
      }
      );

    }
  }
  // OnChangeZoneName(event: any) {
  //   let zoneId = Number(event.value);
  //   this.service.GetPopNameByZoneId(zoneId).subscribe(res => {
  //     this.popNames = res.data as IpopName[];
  //   });
  // }

  OnChangePopName(event: any) {
    let popNameId = Number(event.value);
    this.service.GetZoneName(popNameId).subscribe(res => {
      let zoneName = res.data as IzoneName;
      this.form.patchValue({
        zoneName: zoneName.name.toString()
      })
    });
  }
  clearFields() {
    this.togglePanel() ;
    this.form.reset();
    this.getRequestdata(1, 25, '', this.sortColumnDef, this.SortDirDef);
  }
  DisplayAll(checked: any) {
    if (checked.checked) {
      this.isFilterationData==false;
      this.displayAll = checked.checked;
      if(this.isFilterationData){  
          this.getRequestdata(1, 25, '', this.sortColumnDef, this.SortDirDef);
             }
      this.service.getAllDaily(this.pageNumber, this.pageSize, '', this.colname, this.coldir).subscribe(response => {
        this.dailyOperations = response?.data as IdailyOperations[];
        this.dailyOperations.length = response?.pagination.totalCount;
        this.dataSource = new MatTableDataSource<any>(this.dailyOperations);
        this.dataSource.paginator = this.paginator as MatPaginator;
      })

    } else {
      this.displayAll = checked.checked;
    this.getRequestdata(1, 25, '', this.sortColumnDef, this.SortDirDef);
    }
  }
  //this section for pagination 
  pageIn = 0;
  previousSizedef = 25;
  pagesizedef: number = 25;
  public pIn: number = 0;
  pageChanged(event: any) {
    //this.loading = true;
    this.loader=true;
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
    this.loading = false;
    this.pageSize = pageSize;
    this.pageNumber = pageNum;
    if (this.displayAll) {
      this.service.getAllDaily(pageNum, pageSize, search, sortColumn, sortDir).subscribe(res => {
        if (res.status == true) {
          this.dailyOperations.length = cursize;
          this.dailyOperations.push(...res?.data);
          this.dailyOperations.length = res?.pagination.totalCount;
          this.dataSource = new MatTableDataSource<any>(this.dailyOperations);
          this.dataSource._updateChangeSubscription();
          this.dataSource.paginator = this.paginator as MatPaginator;
          this.loader = false;
        }
        else this.notificationService.warn(res.error)
      }, err => {
        this.notificationService.warn("! Fail");
        this.loader = false;

      })
    } else {
      this.service.getDaily(this.pageNumber, this.pageSize, search, this.colname, this.coldir).subscribe(res => {
        if (res.status == true) {
          this.dailyOperations.length = cursize;
          this.dailyOperations.push(...res?.data);
          this.dailyOperations.length = res?.pagination.totalCount;
          this.dataSource = new MatTableDataSource<any>(this.dailyOperations);
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

  }
  togglePanel() {

    this.panelOpenState = !this.panelOpenState
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
