import { Injectable } from '@angular/core';
import {HttpInterceptor,HttpRequest,HttpHandler,HttpEvent, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import { Observable ,  of } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AlertBoxComponent } from './alert-box/alert-box.component';
@Injectable()
export class CustomInterceptor implements HttpInterceptor {
  popUpMsg:any="";
    constructor(private router: Router,public dialog: MatDialog) {
    }
    openDialog(): void {
      let dialogRef = this.dialog.open(AlertBoxComponent, {
        width: '250px',
        data: this.popUpMsg
        // data: { name: "this.name", animal: "this.animal" }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        // this.animal = result;
      });
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
            withCredentials: false
        });
        request = request.clone({
            setHeaders: {
              Authorization: "Bearer "+ localStorage.getItem('token')
            }
          });
        return next.handle(request).pipe(catchError((error, caught) => {
          console.log('cust load');
            if(error.status==401){
              console.log('401 status')
                localStorage.clear();
                localStorage.setItem("url",location.href);
                location.href='/';
                //location.href='https://Tutterflycrm.com/app/';
                return of(error);
            }else if(error.status==400){
              this.popUpMsg=JSON.stringify(error.error);
              this.openDialog();
            }else{
              console.log('status true');
              console.log(error);
            }  
            throw error;                      
          }) as any);
      


    }
}
