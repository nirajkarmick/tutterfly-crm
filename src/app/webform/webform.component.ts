import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,AbstractControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-webform',
  templateUrl: './webform.component.html',
  styleUrls: ['./webform.component.css']
})
export class WebformComponent implements OnInit {
  user_token="123456879"; 
  form_id=Math.random();
  back_color="red";
  public titlediv:any="";
  public titlediv2:any="";
  public taskboard:any="";
  public formdata1:any="";
  public codeview:any="";
  public formdata:any=[];
  public formdata2:any=[];
  public formdata3:any=[];
  public formdata5:any=[];
  isShowDiv = false;
  isShowDiv3 = false;
  isShowDiv1 = true;
  isShowDiv4 = true;
  divcodenone=true;

  constructor(private http:HttpClient) {  }
 
  ngOnInit(): void {
    this.http.get(environment.ip+'/getform').subscribe((result)=>{
     this.formdata=result;
    
    });
   
  }
  
  processnext()
  {
    
    this.isShowDiv = true;
    this.isShowDiv1 = false;
    this.isShowDiv3 = false;
    this.divcodenone=true;
    var titlediv1 = (<HTMLInputElement>document.getElementById("titlediv")).innerHTML; 
    var taskboard1 = (<HTMLInputElement>document.getElementById("drag-in-progress")).innerHTML; 
  this.taskboard=taskboard1;
    
  }
  back1()
  {
    
    this.isShowDiv = true;
    this.isShowDiv1 = false;
    this.isShowDiv3 = true;
    this.isShowDiv4 = true;
    this.divcodenone=true;
    
  }
  viewcode()
  {
    console.log(this.formdata5.script);
    this.divcodenone=false;
    this.codeview="<script src='"+this.formdata5.script+"' id='"+this.formdata5.id+"'></script>";
  }
  back2()
  {
    
    this.isShowDiv = false;
    this.isShowDiv1 = true;
    this.isShowDiv3 = false;
    this.isShowDiv4 = true;
    this.divcodenone=true;
    
  }
  // getting the form control elements
  
  onSubmit(data:any){
    this.isShowDiv = true;
      this.isShowDiv1 = true;
      this.isShowDiv3 = true;
      this.isShowDiv4 = false;
      this.divcodenone=true;
    this.http.post(environment.ip+'/savedata',
    	{
    		font:data.font,
    		back_color:data.back_color,
    		form_title_color:data.form_title_color,
    		form_back_color:data.form_back_color,
    		submit_btn_color:data.submit_btn_color,
    		field_color:data.field_color,
    		user_token:data.user_token,
    		ftitle:data.ftitle,
    		notifyemail:data.notifyemail,
    		optchk:data.optchk,
    		messagetype:data.messagetype,
    		messagetxt:data.messagetxt,
    		opttxt:data.opttxt,
    		form_id:data.form_id}).subscribe((result)=>{
    			  console.warn('result ',result)
    });
   this.http.post(environment.ip+'/savedata1',{salutation:data.salutation,lead_owner:data.lead_owner,first_name:data.first_name,last_name:data.last_name,title:data.title,company:data.company,email:data.email,industry:data.industry,website:data.website,no_of_employees:data.no_of_employees,phone:data.phone,mobile:data.mobile,country:data.country,state:data.state,city:data.city,zip:data.zip,user_token:data.user_token,form_id:data.form_id}).subscribe((result)=>{
    this.formdata5=result;

     this.http.get(environment.ip+'/gethtmldatademo/'+data.user_token).subscribe((result)=>{
      this.formdata2=result;
     });
     this.http.get(environment.ip+'/gethtmldatademo1/'+data.user_token).subscribe((result)=>{
     this.formdata3=result;
     });
     
    });
    
  }


}
