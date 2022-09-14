import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IremedyAction } from '../Model/IremedyAction';

@Injectable({
  providedIn: 'root'
})
export class RemedyActionService {
  url =  "http://172.29.29.8:2021/api/RemedyAction";
  url2="https://localhost:44375/api/RemedyAction" ;
  constructor(private http: HttpClient) { }

  getRemedyAction(PageNumber :number , PageSize :number , searchValue:string ,sortcolumn:string,sortcolumndir:string){
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
  getRequests(): Observable<IremedyAction[]>{
    return this.http.get<IremedyAction[]>(`${this.url}`);
  }
  
  insertRemedyAction(data:IremedyAction ):Observable<any>
  {
   return this.http.post<any>(`${this.url}/AddRemedyAction`,data);  
  }
  updateRemedyAction(data:IremedyAction ):Observable<any>
  {
   return this.http.post<any>(`${this.url}/UpdateRemedyAction`,data);  
  }

  deleteRemedyAction(id:number):Observable<any>
  {
   return this.http.post<any>(`${this.url}/DeleteRemedyAction`,id) ; 
  }
  nameIsalreadysign(name:string,id:number ):Observable<any>
  {
   return this.http.get<any>(`${this.url}/NameIsAlreadySigned/`+name+`/`+id);  
  }
}
