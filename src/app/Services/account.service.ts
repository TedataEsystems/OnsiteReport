import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Iloginview } from '../Model/Iloginview';
import { Iuser } from '../Model/Iuser';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  url =  "http://172.29.29.8:2021/api/account";
  url2 =  "https://localhost:44375/api/account";

constructor(private http: HttpClient ) { }

login(data:Iloginview ):Observable<Iuser>
{
  
  
  return this.http.post<Iuser>(`${this.url}/login`,data);
  
}


logout(): Observable<any> {
  return this.http.get<any>(`${this.url}/Logout`);
}


}
