import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Istatus } from '../Model/Istatus';

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  url =  "http://172.29.29.8:2021/api/Status";
  url2="https://localhost:44375/api/Status" ;
  constructor(private http: HttpClient) { }

  getStatus(PageNumber :number , PageSize :number , searchValue:string ,sortcolumn:string,sortcolumndir:string){
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
  getRequests(): Observable<Istatus[]>{
    return this.http.get<Istatus[]>(`${this.url}`);
  }
  
  insertStatus(data:Istatus ):Observable<any>
  {
   return this.http.post<any>(`${this.url}/AddStatus`,data);  
  }
  updateStatus(data:Istatus ):Observable<any>
  {
   return this.http.post<any>(`${this.url}/UpdateStatus`,data);  
  }

  deleteStatus(id:number):Observable<any>
  {
   return this.http.post<any>(`${this.url}/DeleteStatus`,id) ; 
  }

  nameIsalreadysign(name:string,id:number ):Observable<any>
  {
   return this.http.get<any>(`${this.url}/NameIsAlreadySigned/`+name+`/`+id);  
  }
}
