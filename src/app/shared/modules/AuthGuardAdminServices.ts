import { Injectable } from "@angular/core";
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
    Route
} from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class AuthGuardAdminServices implements CanActivate {
    constructor(private _router: Router) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    
     let token = localStorage.getItem("token");
     let role=localStorage.getItem("userGroup");
     if (token == "undefined" || token == null || token == ""||role!="admin") {
         this._router.navigateByUrl('/login')
       return false;
     }  
      return true;
   }
}