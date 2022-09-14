import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ILogs } from '../Model/ILogs';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  url =  "http://172.29.29.8:2021/api/Logs";
  url2 ="https://localhost:44375/api/Logs" ;
  constructor(private http: HttpClient) { }

  getLogs(PageNumber :number , PageSize :number , searchValue:string ,sortcolumn:string,sortcolumndir:string){
    let params = new HttpParams();
    if(PageNumber !== null && PageSize !== null ){
      params = params.append('pageNumber' , PageNumber.toString());
      params = params.append('pageSize' , PageSize.toString());
      params = params.append('searchValue' , searchValue.toString());
      params = params.append('sortcolumn' , sortcolumn.toString());
      params = params.append('sortcolumndir' , sortcolumndir.toString());
    }
    return this.http.get<any>(`${this.url}`  , {observe:'response' , params}).pipe(
      map(response => {
         return response.body ;
      })
    )
  }
  getRequests(): Observable<ILogs[]>{
    return this.http.get<ILogs[]>(`${this.url}`);
  }
}
