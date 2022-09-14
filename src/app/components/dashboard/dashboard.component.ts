import { Component, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Color, Label, MultiDataSet } from 'ng2-charts';
import { ChartType } from 'chart.js';
import { Ichart } from 'src/app/Model/Ichart';
import { DailyOperationsService } from 'src/app/Services/daily-operations.service';
import { NotificationMsgService } from 'src/app/shared/services/notification-msg.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  searchKey:string ='' ;
  chartData=<Ichart>{};
  count:number=0;
  userRole=localStorage.getItem('userGroup');
  constructor(private dialog: MatDialog, private dailyOperationsService : DailyOperationsService,
    private _bottomSheet: MatBottomSheet,public notificationService: NotificationMsgService ,private titleService:Title ){

    this.titleService.setTitle("Daily Operations | Home"); 
    
  }
  doughnutChartLabelsp: Label[] =[];
  doughnutChartDatap: MultiDataSet = [
    []
  ];

  doughnutChartType: ChartType = 'doughnut';
  colors: Color[] = [
    {
      backgroundColor: [
        '#6bb332',
        '#012535',
        'lightgray',
        '#b90627','blue','orange','purple','brown','DeepPink', 'Salmon','DarkOrange'
      ]
    }
  ];
  
  
  getChartData():void{
      this.dailyOperationsService.chartData().subscribe(res=>{
      this.chartData= res.data as Ichart;
      this.count = this.chartData.totalCount ;
       this.doughnutChartLabelsp = this.chartData.statusNameList ;
       this.doughnutChartDatap = [this.chartData.statusNameCountList] ;
      }
      ,err=>{this.notificationService.warn("occure an error")}
      );
  
  
  }
     ngOnInit(){
  
     this.getChartData();
     }
  
}
