
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpResponse} from '@angular/common/http';
import {RequestOptions, Request, Headers } from '@angular/http';
import {environment} from "../../environments/environment";
import { isDate } from 'rxjs/internal/util/isDate';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(private http:HttpClient) {}
  public getAllMail(keyword,page_no=1){ 
var query="?page="+page_no;
if(keyword){
   query="?keyword="+keyword;
} 
    let result  = this.http.get(environment.ip+'/email_client/emails'+query).pipe(map((response: Response) => response));
    return result;
  }
  public mailSeen(msgId){
    // let result = this.http.get(environment.ip+'/rest_accounts/create'').map((response: Response) => response);
    //let result  = this.http.get(environment.ip+'/email_client/emails').map((response: Response) => response);
     let result  = this.http.get(environment.ip+'/email_client_seen?messageId='+msgId).pipe(map((response: Response) => response));
    return result;
  }
   public getGmail(call:any){
    console.log(call);
     let result = this.http.post('https://www.googleapis.com/oauth2/v4/token',call).pipe(map((response: Response) => response));
     return result;
   }
   public getGmailMessage(call:any){
    console.log(call);
    let result = this.http.post('https://tnt1.tutterflycrm.com/mail_test/gmail_api.php',call).pipe(map((response: Response) => response));
     
    // let result = this.http.post(environment.ip+'/get_mail',call).map((response: Response) => response);
     return result;
   }
   public fetch_mail(code){
    let result  = this.http.get(environment.ip+'/fetch_mail?code='+code).pipe(map((response: Response) => response));
    return result;
  }

   public setup_gmail(call:any){
    console.log(call);
    let result = this.http.post(environment.ip+'/setup_gmail',call).pipe(map((response: Response) => response));
    return result;
   }

   public send_mail(call:any){
    console.log(call);
    let result = this.http.post(environment.ip+'/send_mail_gmail',call).pipe(map((response: Response) => response));
    return result;
   }
    public send_mail2(call:any){
    console.log(call);
    let result = this.http.post('https://tnt1.tutterflycrm.com/mail_test/sent_mail_api.php',call).pipe(map((response: Response) => response));
    return result;
   }
   public remove_gmail(){   
    let result = this.http.post(environment.ip+'/remove_gmail',{}).pipe(map((response: Response) => response));
    return result;
   }
   public get_gmail_token(){   
    let result = this.http.post(environment.ip+'/get_gmail_token',{}).pipe(map((response: Response) => response));
    return result;
   }
   public getMessageBody(call:any){
    console.log(call);
    let result = this.http.post('https://tnt1.tutterflycrm.com/mail_test/get_mail_api.php',call).pipe(map((response: Response) => response));
     return result;
   }
   public getGmailMessageBody(call:any){
    console.log(call);
    let result = this.http.post(environment.ip+'/get_mail',call).pipe(map((response: Response) => response));
     return result;
   }

   public get_gmail_message(call:any){   
    let result = this.http.post(environment.ip+'/fetch_mail',call).pipe(map((response: Response) => response));
    return result;
   }
 public searchGmail(call:any){   
    let result = this.http.post(environment.ip+'/search_gmail',call).pipe(map((response: Response) => response));
    return result;
   }
   public get_attachment(call:any){
    console.log(call);
    let result = this.http.post(environment.ip+'/get_attachment',call).pipe(map((response: Response) => response));
     return result;
   }

 
}
