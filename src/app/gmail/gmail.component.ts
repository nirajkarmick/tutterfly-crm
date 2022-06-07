// import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Component, OnInit, ChangeDetectorRef, ViewChild ,ElementRef,NgZone} from '@angular/core';
import { MailService } from '../service/mail.service';
import { AccountsMapService } from '../service/accounts-map.service';
import {  ParamMap } from '@angular/router';
import * as $ from 'jquery';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { AlertBoxComponent } from '../alert-box/alert-box.component';
import { MessageService } from '../message.service';
import {environment} from "../../environments/environment";
import { MapsAPILoader } from '@agm/core';
import { FormControl ,FormGroup,FormBuilder,Validators} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
 declare var gapi: any;
@Component({
  selector: 'app-gmail',
  templateUrl: './gmail.component.html',
  styleUrls: ['./gmail.component.css']
})

export class GmailComponent implements OnInit {
 
  public code:any;
  public current_url;
   popUpMsg:any="";
  constructor(
    private route: ActivatedRoute,
    private service: MailService,public router:Router,
    private msg :MessageService,
    public dialog: MatDialog,
    private _sanitizer: DomSanitizer) {
    this.code = this.route.snapshot.queryParams['code'];
      this.msg.sendMessage("mail");
    this.current_url=window.location.href.split('?')[0];
    console.log(this.current_url);
   }
  public post_data={};
  public auth_data:any;  
  gToken_url='';
  redirect_uri='https://www.tutterflycrm.com/fetch_mail/' 
  ngOnInit() { 
   this.auth_data=[];
  	if(this.code){
  		this.post_data={'code':this.code,
  		'client_id':'1056901766068-d4jaedcts347peo44n6gc458i7ppm0br.apps.googleusercontent.com',
  		'client_secret':'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',
  		'grant_type':'authorization_code', 		
  		'redirect_uri':this.redirect_uri
  	}
  	    this.service.getGmail(this.post_data).subscribe(data => {
        console.log(data);
        this.auth_data=data;
        this.auth_data['type']='INBOX';
        this.service.setup_gmail(this.auth_data).subscribe((res:any) => {
            console.log(res);    
             this.popUpMsg=res.message;
             this.openDialog(); 
             this.getGmailmsg(); 
        });
    });
  	    this.router.navigate(['.'],{ relativeTo: this.route, queryParams: {} });  //remove url parameter...
  	   this.code='';
    }else{
      this.service.get_gmail_token().subscribe((res:any) => {
        console.log(res);
        if(res.result.gmail_setup==1){
           this.auth_data={
              "access_token":res.result.access_token,
              "expires_in":3599,
              "refresh_token":res.result.refresh_token,
              "scope":"https://mail.google.com/",
              "token_type":"Bearer",
              "type":'INBOX',
              "pageToken":''
         };
          //this.getMailmsg();
          this.getGmailmsg();
        }else{
         // alert('no gmail');
          this.auth_data=[];
          this.gmailLoad=0;
        }
        
    });
    }

  	 this.gToken_url='https://accounts.google.com/o/oauth2/auth?redirect_uri='+this.redirect_uri+'&state='+this.current_url+'&response_type=code&client_id=1056901766068-d4jaedcts347peo44n6gc458i7ppm0br.apps.googleusercontent.com&scope=https://mail.google.com&approval_prompt=force&access_type=offline'
  
  	
  	//console.log(this.auth2.grantOfflineAccess());
  }
  openDialog(): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '250px',
      data: JSON.stringify(this.popUpMsg)
      // data: { name: "this.name", animal: "this.animal" }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
  removeGmail(){
    var conf=confirm('Are you sure to remove gmail account ?');

    if(conf){
    this.service.remove_gmail().subscribe((res:any) => {
        console.log(res);
        this.ngOnInit();
        
    });
      
    }
  }
 sendMail(){
    
    this.service.send_mail(this.auth_data).subscribe((res:any) => {
        console.log(res);       
          
    });
      
    
  }

sendMail2(){
    
    this.service.send_mail2(this.auth_data).subscribe((res:any) => {
        console.log(res);       
          
    });
      
    
  }
  allLabels=[];
  allInbox=[];
  googleAuth(){
    this.service.fetch_mail(this.code).subscribe((res:any) => {
        console.log(res);
        
    });
  } 
  public auth2= {};
  public userContacts = {};
  public transformToMailListModel = {}; 
  public onFailure;
  box_msg="Inbox is empty!";
  bodyDiv = false;
  unread_msg='';
  connectToGmail(){

  var win =	window.open('https://accounts.google.com/o/oauth2/auth?redirect_uri=https://www.samar.tutterflycrm.com/&response_type=code&client_id=429520034695-pamvfnuhci0e415sfjdren8qvj76kgt5.apps.googleusercontent.com&scope=https://www.googleapis.com/auth/gmail.send&approval_prompt=force&access_type=offline','popup','width=1200,height=800,');
     alert(win.location.pathname);
  }
gmailLoad=2;
current_label='INBOX';
get_msg_Label(label){
    this.bodyDiv=false;
 this.auth_data['type']=label;
 this.current_label=label;
 console.log(this.auth_data);
 this.getGmailmsg();
}
attachments=[];
getMailmsg(){
  console.log(this.auth_data);
  this.scroll_to_top();
 this.service.getGmailMessage(this.auth_data).subscribe((res:any) => {
        console.log(res);
        this.gmailLoad=1;
        this.allLabels=res.labels;
        this.allInbox=res.message;
        
    });
}
search_email(evnt){
    console.log(evnt.target.value);
    var key=evnt.target.value;
 this.service.searchGmail({'keyword':key}).subscribe((res:any) => {
        console.log(res); 
        this.allInbox=res.results.message;
        this.current_pageToken=res.results.pageToken;
        this.gmailLoad=1;
        if(this.pageNumber==1){

        }else{
          this.paginationLength=((this.pageNumber-1)*50 +1)+' - '+(this.pageNumber*50);
        }
        
    });
}
scroll_to_top(){

    $('html, body').animate({
        scrollTop: 0
    }, 2000);

 // var myDiv = document.getElementById('gmail_container');
 // myDiv.scrollTop = 0;
}
composemail(){ 
    document.getElementById('comp_mail_header').click();
} 
current_pageToken=''; 
previous_pageToken='';
pageNumber=1;
paginationLength='1 to 50';
getGmailmsg(){ 
 
  console.log(this.auth_data);
  if(this.pageNumber==2 || this.pageNumber==1){
  this.previous_pageToken="";

  }else{
  this.previous_pageToken=this.current_pageToken;
  }
  //this.auth_data['pageToken']=this.current_pageToken;
 this.service.get_gmail_message(this.auth_data).subscribe((res:any) => {
         console.log(res);
        this.allLabels=res.results.labels;
        this.allInbox=res.results.message;
        this.current_pageToken=res.results.pageToken;
        this.gmailLoad=1;
        if(this.pageNumber==1){

        }else{
          this.paginationLength=((this.pageNumber-1)*50 +1)+' - '+(this.pageNumber*50);
        }

         
    });
}
get_next_page(){
  this.pageNumber=this.pageNumber + 1;
  this.auth_data['pageToken']=this.current_pageToken;
  this.getGmailmsg(); 
}
get_previous_page(){
  if(this.pageNumber==1){
    this.previous_pageToken="";
     return false;
  }
  if(this.pageNumber==2){    
   this.auth_data['pageToken']='';
  }else{
   this.auth_data['pageToken']=this.previous_pageToken;

  }
  this.pageNumber=this.pageNumber - 1;
  this.getGmailmsg(); 
}
markEmail(){

}
mail_body:SafeHtml;
bodyData:any;
msg_id:any;
getMailBody(msg_id){
  this.scroll_to_top();
  this.auth_data['msg_id']=msg_id;
  this.msg_id=msg_id;
    this.service.getGmailMessageBody(this.auth_data).subscribe((res:any) => {
        console.log(res);
        this.bodyDiv=true;
        this.mail_body=res.results.content_body_html;
        this.mail_body=this._sanitizer.bypassSecurityTrustHtml(res.results.content_body_html);

        this.bodyData=res.results;
        console.log(this.bodyData);
        
    });
}
get_attachment(filename,attach,msg_id,cnt){
  this.auth_data['msg_id']=msg_id;
  this.auth_data['attach_id']=attach.id;
 // this.auth_data['attach_id']=attach.body.attachmentId;

console.log(this.bodyData.getAttachmentsWithData[cnt]);

let dataBase64Rep = this.bodyData.getAttachmentsWithData[cnt].replace(/-/g, '+').replace(/_/g, '/')

        let urlBlob = this.b64toBlob(dataBase64Rep, attach.mimeType, this.bodyData.size);

        let dlnk = document.getElementById('download-attach') as HTMLInputElement; 
        $('#download-attach').attr('href',urlBlob);
        $('#download-attach').attr('download',filename); 
        $('#download-attach').trigger('click');
        (document.getElementById('download-attach')).click();
        URL.revokeObjectURL(urlBlob);
  
 
  // this.service.get_attachment(this.auth_data).subscribe((res:any) => {
  //       console.log(res);
  //       let dataBase64Rep = res.results.data.replace(/-/g, '+').replace(/_/g, '/')

  //       let urlBlob = this.b64toBlob(dataBase64Rep, attach.mimeType, res.results.size);

  //       let dlnk = document.getElementById('download-attach') as HTMLInputElement; 
  //       $('#download-attach').attr('href',urlBlob);
  //       $('#download-attach').attr('download',filename); 
  //       $('#download-attach').trigger('click');
  //       (document.getElementById('download-attach')).click();
  //       URL.revokeObjectURL(urlBlob);
  //     });
} 
backToInbox(){
  this.bodyDiv=false;
}
 inBetween(dat1:any) {
        //console.log(date1);
        var date1 = new Date(dat1);
        var date2 = new Date();
        //Get 1 day in milliseconds
        var one_day = 1000 * 60 * 60 * 24;
        var one_hour = 1000 * 60 * 60;
        var one_min = 1000 * 60;

        // Convert both dates to milliseconds
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();

        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;
        var diff_in_hour = Math.round(difference_ms / one_hour);
        if (diff_in_hour > 24) {
            var dayss = Math.round(difference_ms / one_day) + ' days ago';
        } else if (diff_in_hour < 1) {
            var dayss = Math.round(difference_ms / one_min) + ' min ago';
        }
        else {
            var dayss = diff_in_hour + ' hours ago';
        }


        return dayss;

    }

     

// if (att.length > 0) {
//     for (var i in att) {
//        getAttachments(response.id, att[i], function (filename, mimeType, attachment) {

//        let dataBase64Rep = attachment.data.replace(/-/g, '+').replace(/_/g, '/')

//        let urlBlob = b64toBlob(dataBase64Rep, mimeType, attachment.size);

//        let dlnk = document.getElementById('download-attach');
//        dlnk.href = urlBlob;
//        dlnk.download = filename;
//        dlnk.click();
//        URL.revokeObjectURL(urlBlob);
//    }
// }

 b64toBlob (b64Data, contentType, sliceSize) {
  contentType = contentType || ''
  sliceSize = sliceSize || 512

  var byteCharacters = atob(b64Data)
  var byteArrays = []

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize)

    var byteNumbers = new Array(slice.length)
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    var byteArray = new Uint8Array(byteNumbers)

    byteArrays.push(byteArray)
  }

  var blob = new Blob(byteArrays, {type: contentType})
  let urlBlob = URL.createObjectURL(blob)
  return urlBlob
}
}

