import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IpopName } from '../Model/IpopName';

@Injectable({
  providedIn: 'root'
})
export class PopNameService {
  url =  "http://172.29.29.8:2021/api/PopName";
  url2 ="https://localhost:44375/api/PopName" ;
  constructor(private http: HttpClient) { }

  getPopName(PageNumber :number , PageSize :number , searchValue:string ,sortcolumn:string,sortcolumndir:string){
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

  getRequests(): Observable<IpopName[]>{
    return this.http.get<IpopName[]>(`${this.url}`);
  }

  GePopNameById(id: number): Observable<any> {
    return this.http.post<any>(`${this.url}/GePopNameById`, id);
  }
  
  insertPopName(data:IpopName ):Observable<any>
  {
   return this.http.post<any>(`${this.url}/AddPopName`,data);  
  }
  updatePopName(data:IpopName ):Observable<any>
  {
   return this.http.post<any>(`${this.url}/UpdatePopName`,data);  
  }

  deletePopName(id:number):Observable<any>
  {
   return this.http.post<any>(`${this.url}/DeletePopName`,id) ; 
  }

  nameIsalreadysign(name:string,id:number ):Observable<any>
  {
   return this.http.get<any>(`${this.url}/NameIsAlreadySigned/`+name+`/`+id);  
  }
}
