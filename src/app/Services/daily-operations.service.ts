import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IdailyOperations } from '../Model/IdailyOperations';
import { IdailyOperationsSearch } from '../Model/IdailyOperationsSearch';
import { PaginatedResult, Pagination } from '../Model/pagination';

@Injectable({
  providedIn: 'root'
})
export class DailyOperationsService {
  url =  "http://172.29.29.8:2021/api/DailyOperation";
  url2 = "https://localhost:44375/api/DailyOperation";
  paginatedResult : PaginatedResult<IdailyOperations[]> =new PaginatedResult<IdailyOperations[]>();
  
  headers = new HttpHeaders({
    'Accept': 'application/json',
    'zumo-api-version': '2.0.0',
    
});
  constructor(private http: HttpClient) { }

  getDaily(PageNumber :number , PageSize :number , searchValue:string ,sortcolumn:string,sortcolumndir:string){
    let params = new HttpParams();
    if(PageNumber !== null && PageSize !== null ){
      params = params.append('pageNumber' , PageNumber.toString());
      params = params.append('pageSize' , PageSize.toString());
      params = params.append('searchValue' , searchValue.toString());
      params = params.append('sortcolumn' , sortcolumn.toString());
      params = params.append('sortcolumndir' , sortcolumndir.toString());
    }
    return this.http.get<any>(`${this.url}` + '/GetDailyOpertion' , {observe:'response' , params}).pipe(
      map(response => {
         return response.body ;
      })
    )
  }
  getAllDaily(PageNumber :number , PageSize :number , searchValue:string ,sortcolumn:string,sortcolumndir:string){
    let params = new HttpParams();
    if(PageNumber !== null && PageSize !== null ){
      params = params.append('pageNumber' , PageNumber.toString());
      params = params.append('pageSize' , PageSize.toString());
      params = params.append('searchValue' , searchValue.toString());
      params = params.append('sortcolumn' , sortcolumn.toString());
      params = params.append('sortcolumndir' , sortcolumndir.toString());
    }
    return this.http.get<any>(`${this.url}` + '/GetAll' , {observe:'response' , params}).pipe(
      map(response => {
         return response.body ;
      })
    )
  }
  getDailyOperationById(id: number): Observable<any> {
    return this.http.post<any>(`${this.url}/GetDailyOperationsById`, id);
  }
  insertDailyOperation(data: IdailyOperations): Observable<any> {
    return this.http.post<any>(`${this.url}/AddDailyOperations`, data);
  }
  updateDailyOperation(data: IdailyOperations): Observable<any> {
    return this.http.post<any>(`${this.url}/UpdateDailyOperations`, data);
  }

  deleteDailyOperation(id: number): Observable<any> {
    return this.http.post<any>(`${this.url}/DeleteDailyOperations`, id);
  }

  getListsForCreate(): Observable<any> {

    return this.http.get<any>(`${this.url}` + `/getListForCreate`);
  }

  ExportEmptyExcel():Observable<Blob>{
    return this.http.get(`${this.url}/DownloadEmptyExcel`,{responseType: 'blob',headers: this.headers});
    
  }
  
public addFromFile(file : any)
{
  return this.http.post<any>(this.url + '/AddExcelFile' , file , {headers : this.headers});
}

ExportExcelWithData():Observable<Blob>{
  return this.http.get(`${this.url}/DownloadAllDataOfExcel`,{responseType: 'blob',headers: this.headers}); 
}

DownloadAllDisplayDataOfExcel():Observable<Blob>{
  return this.http.get(`${this.url}/DownloadAllDisplayDataOfExcel`,{responseType: 'blob',headers: this.headers}); 
}

ExportExcelWithselectData(ids:string[]):Observable<Blob>{

  return this.http.post(`${this.url}/DownloadSelectDataOfExcel`,ids,{responseType: 'blob',headers: this.headers});
}

GetZoneName (popNameId : number): Observable<any> {
  return this.http.post<any>(`${this.url}/GetZoneNameByPopNameId`, popNameId );
}

GetPopNameByZoneId (zoneId : number): Observable<any> {
  return this.http.post<any>(`${this.url}/GetPopNameByZoneId`, zoneId );
}

chartData():Observable<any>
{
 return this.http.get<any>(`${this.url}/GetflowChartData`) ; 
}

AdvancedSearch(data: IdailyOperationsSearch): Observable<any> {
  return this.http.post<any>(`${this.url}/AdvancedSearch`, data);
}
}
