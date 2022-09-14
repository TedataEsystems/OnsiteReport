import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ItechName } from '../Model/ItechName';

@Injectable({
  providedIn: 'root'
})
export class TechNameService {
  url =  "http://172.29.29.8:2021/api/TechName";
  url2="https://localhost:44375/api/TechName" ;
  constructor(private http: HttpClient) { }


  getTechName(PageNumber :number , PageSize :number , searchValue:string ,sortcolumn:string,sortcolumndir:string){
    let params = new HttpParams();
    if(PageNumber !== null && PageSize !== null){
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
  getRequests(): Observable<ItechName[]>{
    return this.http.get<ItechName[]>(`${this.url}`);
  }
  
  insertTechName(data:ItechName ):Observable<any>
  {
   return this.http.post<any>(`${this.url}/AddTechName`,data);  
  }
  updateTechName(data:ItechName ):Observable<any>
  {
   return this.http.post<any>(`${this.url}/UpdateTechName`,data);  
  }

  deleteTechName(id:number):Observable<any>
  {
   return this.http.post<any>(`${this.url}/DeleteTechName`,id) ; 
  }

  nameIsalreadysign(name:string,id:number ):Observable<any>
  {
   return this.http.get<any>(`${this.url}/NameIsAlreadySigned/`+name+`/`+id);  
  }
}
