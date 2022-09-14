import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Ioperator } from '../Model/Ioperator';
import { PaginationService } from './pagination.service';

@Injectable({
  providedIn: 'root'
})
export class OperatorService {
  private headers = new HttpHeaders();
  url =  "http://172.29.29.8:2021/api/Operator";
  url2="https://localhost:44375/api/Operator" ;
  constructor(private http: HttpClient , private paginationService: PaginationService
    ) {
      this.headers = this.headers.set('content-type', 'application/json');
      this.headers = this.headers.set('Accept', 'application/json');
    }
    getOperator(PageNumber :number , PageSize :number , searchValue:string ,sortcolumn:string,sortcolumndir:string){
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

  // getRequests(): Observable<Ioperator[]>{
  //   return this.http.get<Ioperator[]>(`${this.url}`);
  // }
  
  insertOperator(data:Ioperator ):Observable<any>
  {
   return this.http.post<any>(`${this.url}/AddOperator`,data);  
  }
  updateOperator(data:Ioperator ):Observable<any>
  {
   return this.http.post<any>(`${this.url}/UpdateOperator`,data);  
  }

  deleteOperator(id:number):Observable<any>
  {
   return this.http.post<any>(`${this.url}/DeleteOperator`,id) ; 
  }
  nameIsalreadysign(name:string,id:number ):Observable<any>
  {
   return this.http.get<any>(`${this.url}/NameIsAlreadySigned/`+name+`/`+id);  
  }
}
