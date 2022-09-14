import { Time } from "@angular/common";
import { identifierModuleUrl } from "@angular/compiler";
import { Timestamp } from "rxjs";
import { Itime } from "./Itime";

export interface IdailyOperations{
     id:number;
     complaintNumber:number;
     psdid:number;
     circuitID :number;
     customerName :string;
     popNameId :number;
     _popName : string;
     zoneName :string;
     operatorId :number;
     _operatorName :string;
     assignedTo:string;
     techNameId: number;
     _techName: string;
     remedyActionId: number;
     _remedyActionName : string;
     notes:string;
     transmissionMediaId:number;
     _transmissionMediaName : string ;
     statusId:number;
     _statusName: string ;
     SLA:Itime;
     creationDate:Date;
     closedTime:string;
     createdTime:string;
     createdDate:Date;
     closedDate : Date;
     updateDate:Date;
     createdBy:string;
     updatedBy:string;
     days: number;
     hours: number;
     isToLate : boolean;

     
}