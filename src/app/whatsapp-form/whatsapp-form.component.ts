import { Component, OnInit ,Input,EventEmitter,Output} from '@angular/core';
import { FormService } from '../service/form.service';
import { AlertBoxComponent } from '../alert-box/alert-box.component';
import { MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({ 
  selector: 'app-whatsapp-form', 
  templateUrl: './whatsapp-form.component.html',
  styleUrls: ['./whatsapp-form.component.css']
}) 
export class WhatsappFormComponent implements OnInit {

  constructor(private formService: FormService,
    public dialog: MatDialog, private sanitizer: DomSanitizer) { 
    this.getAllCountry();
  } 
@Input() watsapp:any;
@Input() clientData:any;
@Input() whatsapp_thread_exist:any;
form_body=true;
@Output("renderData") renderData: EventEmitter<any> = new EventEmitter();
  ngOnInit() {
  }

  popUpMsg: string = "";
allCountry=[];
countryLoaded=false;
countryData:any=[];
public countryOptions: Select2Options;
selectedPhoneCode="";
country_error="";
select_country="";
getAllCountry(){ 
  if($("#wats_bdy").length>0){
      setTimeout(() => {
            this.scroll_watsapp();
    }, 400);
      
  }
  this.country_error=''; 
  if(this.countryLoaded==false){
  //  this.watsapp.recipient_no=this.clientDetails.whatsapp_no;
  this.formService.getAllCountry().subscribe((data: any) => { 

     if (data.countries != undefined) {          
        let i=0; 
        this.countryData.push({ 
          "id": '',
          "text": 'Select Country'});
        for (let e of data.countries) {
        var cnt_name=e.phonecode?e.name+ ' ( +'+ e.phonecode +')' :''; 
         if(cnt_name!=''){
              this.countryData.push({ 
                "id": e.name,
                "text": cnt_name});
              i++;
         }
       }

    this.allCountry=data.countries;
    this.countryLoaded=true;
     this.select_country='India'; 
     if(this.select_country){
       this.getPhoneCode(this.select_country);
     }
    
     
      setTimeout(() => {
            this.scroll_watsapp();
    }, 500);
    } 
    console.log(this.countryData);
    console.log(this.select_country);

       
    });

  }
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

  scroll_watsapp(){
    var objDiv = document.getElementById("wats_bdy");
    objDiv.scrollTop = objDiv.scrollHeight;
    //$( "#wats_bdy" ).scrollTop( 0 );
  }
getPhoneCode(event) {
        console.log(event)
        if(event){
              for(let count of this.allCountry){               
                if(count.name==event){
                     console.log(count.phonecode); 
                     this.selectedPhoneCode = '+' + count.phonecode; 
                 }
            }  
        }else{
             this.selectedPhoneCode = ''; 
             this.country_error='Country Required'; 
        }
         
  }

reset_whatsappForm(){
 
  this.watsapp.message="";    
  this.whatsapp_documentData={};

    this.reply_to_span=false;
    this.reply_d_msg="";
}
sendWhatsappTemplate(){
   
     if (this.watsapp.recipient_no == '') {
      this.popUpMsg = 'Please fill recipient number!';
      this.openDialog();
      return false; 
    }
    this.watsapp.recipient=this.selectedPhoneCode+this.watsapp.recipient_no;  
     this.formService.sendWhatsappTemplate(this.watsapp).subscribe((data:any) => { 
      console.log(data);
      if(data && data.error){
       console.log('err');
      }else{

        this.renderChange(); 
        this.reset_whatsappForm();
      }
      this.popUpMsg = data;
      this.openDialog(); 
      }, error => {
       console.log(error, 'error report');
       //this.reset_whatsappForm();
    });
}
//  watsapp:any={'recipient_no':'','recipient':'','message':'','whatsapp_type':'','whatsapp_id':''};
  sendWatsapp(){

     if (this.watsapp.recipient_no == '' ) {
      this.popUpMsg = 'Please fill recipient number!';
      this.openDialog();
      return false; 
    }
     if (this.watsapp.message == '') {
      this.popUpMsg = 'Please fill messages!';
      this.openDialog();
      return false; 
    }
    this.watsapp.recipient=this.selectedPhoneCode+this.watsapp.recipient_no; 
     this.formService.sendWatapp(this.watsapp).subscribe((data:any) => {
      console.log(data);
      if(data && data.error){
       console.log('err');
      }else{
        if(data.template_send){
          //alert(data.template_send+'t');   
        this.renderChange();
        this.reset_whatsappForm();
        }else{
          this.whatsapp_thread_exist=false;
          this.clientData.whatsapp_activites=[];
          //alert(data.template_send+'f');          
        }
        setTimeout(() => {
          this.scroll_watsapp();
        }, 2400);
      }
      this.popUpMsg = data;
      this.openDialog(); 
      
    }, error => {
      console.log(error, 'error report');
      //this.reset_whatsappForm(); 
    });

  }
  reply_to_span=false;
  reply_d_msg="";
  reply_d_no="";

  reply_to_msg(wp){
    this.reply_to_span=true;
    console.log(wp)
    this.watsapp.reply_id=wp.id;
    this.reply_d_msg=wp.message;
    this.reply_d_no=wp.from_no;
    console.log(this.watsapp);
  }
  remove_reply_msg(){    
      this.reply_to_span=false;
      this.reply_d_msg="";
      this.reply_d_no="";
  }
renderChange(){
   this.renderData.emit();
}
  w_attachModalOpen=false;
  whatsapp_attachment: any = []; 
  whatsapp_documentData: any=[];
  openAttachModeal(){
    this.form_body=true;
    this.w_attachModalOpen=true;
    this.whatsapp_documentData=[];

  }

  sendAttach(){ 
   // alert('f');
    console.log(this.whatsapp_attachment);
    console.log(this.whatsapp_documentData);
    //return;

    var recipient=this.selectedPhoneCode+this.watsapp.recipient_no; 
    var data={'recipient':recipient,'media':this.whatsapp_documentData[0]};
     this.formService.sendWatappMedia(data).subscribe((data:any) => {
      console.log(data);
      if(data && data.error){
       console.log('err');
      }else{
        
            this.renderChange();
            this.reset_whatsappForm();
        if(data.template_send){ 
          this.reset_whatsappForm();
        }else{

          // this.whatsapp_thread_exist=false;
          // this.clientData.whatsapp_activites=[];        
        }
        setTimeout(() => {
          this.scroll_watsapp();
        }, 2400);
      }
      this.popUpMsg = data;
      this.openDialog(); 
      
    }, error => {
      console.log(error, 'error report'); 
    });
  }

  dataUrl: any;

  file_type_array=['txt','csv','xls','xlsx','ppt','docx','doc','vnd.openxmlformats-officedocument.wordprocessingml.document']
  getwhatsappMedia(id:any){
   // alert(id);
     var url: "https://s3.ap-south-1.amazonaws.com/tutterflycrm-bucket/pdf/1649661609.pdf"; 
     this.dataUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
     this.dataUrl = url;
     this.formService.getWatappMedia(id).subscribe((response:any) => {
         console.log(response);
        if(response.data){
          this.dataUrl=this.sanitizer.bypassSecurityTrustResourceUrl(response.data); 
              setTimeout(() => {
               this.media_modal_open();
              }, 200); 
              if(this.file_type_array.indexOf(response.type)>-1){
                 setTimeout(() => {
                  var a = document.createElement("a"); //Create <a>
                    a.href = response.data; //Image Base64 Goes here
                    a.download = "Whatsapp_doc_"+Math.random()+'.'+response.type; //File name Here
                    a.click(); //Downloaded file
                    a.remove();
               this.media_modal_close();
              }, 300); 
              }
              
         }
         

     });
  }
media_modal=false;
  media_modal_open(){
      this.media_modal=true;
      $("#media_modal").css('display','block');
      $("#media_modal").addClass('show');
    
  }
  media_modal_close(){
      this.media_modal=false;
      $("#media_modal").css('display','none');
      $("#media_modal").removeClass('show');
  }
}
