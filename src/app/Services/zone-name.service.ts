import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IzoneName } from '../Model/IzoneName';

@Injectable({
  providedIn: 'root'
})
export class ZoneNameService {
  url =  "http://172.29.29.8:2021/api/ZoneName";
  url2="https://localhost:44375/api/ZoneName" ;
  constructor(private http: HttpClient) { }

  getZoneName(PageNumber :number , PageSize :number , searchValue:string ,sortcolumn:string,sortcolumndir:string){
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

  getRequests(): Observable<IzoneName[]>{
    return this.http.get<IzoneName[]>(`${this.url}/GetZoneName`);
  }
  
  insertZoneName(data:IzoneName ):Observable<any>
  {
   return this.http.post<any>(`${this.url}/AddZoneName`,data);  
  }
  
  updateZoneName(data:IzoneName ):Observable<any>
  {
   return this.http.post<any>(`${this.url}/UpdateZoneName`,data);  
  }

  deleteZoneName(id:number):Observable<any>
  {
   return this.http.post<any>(`${this.url}/DeleteZoneName`,id) ; 
  }
  nameIsalreadysign(name:string,id:number ):Observable<any>
  {
   return this.http.get<any>(`${this.url}/NameIsAlreadySigned/`+name+`/`+id);  
  }
}
