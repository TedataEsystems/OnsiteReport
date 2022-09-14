import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPopNameAbbreviations } from '../Model/IPopNameAbbreviations';

@Injectable({
  providedIn: 'root'
})
export class PopNameAbbreviationsService {
  url =  "http://172.29.29.8:2021/api/PopNameAbbreviations";
  url2 ="https://localhost:44375/api/PopNameAbbreviations" ;
  constructor(private http: HttpClient) { }

  getPopNameAbbreviations(page :number , itemPerPage :number){
    let params = new HttpParams();
    if(page !== null && itemPerPage !== null){
      params = params.append('pageNumber' , page.toString());
      params = params.append('pageSize' , itemPerPage.toString());
    }
    return this.http.get<any>(`${this.url}`  , {observe:'response' , params}).pipe(
      map(response => {
         return response.body ;
      })
    )
  }
  getRequests(): Observable<IPopNameAbbreviations[]>{
    return this.http.get<IPopNameAbbreviations[]>(`${this.url}`);
  }
}
