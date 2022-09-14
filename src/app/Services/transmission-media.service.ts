import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ItransmissionMedia } from '../Model/ItransmissionMedia';

@Injectable({
  providedIn: 'root'
})
export class TransmissionMediaService {
  url =  "http://172.29.29.8:2021/api/TransmissionMedia";
  url2="https://localhost:44375/api/TransmissionMedia" ;
  constructor(private http: HttpClient) { }


  getTransmissionMedia(PageNumber :number , PageSize :number , searchValue:string ,sortcolumn:string,sortcolumndir:string){
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
  // getRequests(): Observable<ItransmissionMedia[]>{
  //   return this.http.get<ItransmissionMedia[]>(`${this.url}`);
  // }
  
  insertTransmissionMedia(data:ItransmissionMedia ):Observable<any>
  {
   return this.http.post<any>(`${this.url}/AddTransmissionMedia`,data);  
  }
  updateTransmissionMedia(data:ItransmissionMedia ):Observable<any>
  {
   return this.http.post<any>(`${this.url}/UpdateTransmissionMedia`,data);  
  }

  deleteTransmissionMedia(id:number):Observable<any>
  {
   return this.http.post<any>(`${this.url}/DeleteTransmissionMedia`,id) ; 
  }
  nameIsalreadysign(name:string,id:number ):Observable<any>
  {
   return this.http.get<any>(`${this.url}/NameIsAlreadySigned/`+name+`/`+id);  
  }
}
