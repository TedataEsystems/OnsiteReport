import { Time } from "@angular/common";
import { identifierModuleUrl } from "@angular/compiler";
import { Timestamp } from "rxjs";
import { Itime } from "./Itime";

export interface IdailyOperationsSearch{
     complaintNumber:number;
     psdid:number;
     circuitID :number;
     customerName :string;
     popNameId :number;
     zoneName :string;
     operatorId :number;
     assignedTo:string;
     techNameId: number;
     remedyActionId: number;
     notes:string;
     transmissionMediaId:number;
     statusId:number;
     SLA:string;
     createdDateFrom:Date;
     createdDateTo:Date;
     closedDateFrom : Date;
     closedDateTo : Date;

     
}