import { Component, OnInit } from '@angular/core';
import { FormService } from '../service/form.service';
import { ActivatedRoute, Router } from '@angular/router'; 
import { MatDialog } from '@angular/material'; 
import { AlertBoxComponent } from '../alert-box/alert-box.component'; 

@Component({
  selector: 'app-lead-capture',
  templateUrl: './lead-capture.component.html',
  styleUrls: ['./lead-capture.component.css']
})
export class LeadCaptureComponent implements OnInit {

  
	popUpMsg: any = "";
	cuurent_category = "Leads"; 
    current_url=window.location.protocol+'//'+window.location.host;
	sample_code={
		"token":"",
		"lead":{
				"first_name":"Envato",
				"last_name":"Marshall (sample)",
				"email":"emavato.mar@yahoomail.com (sample)",
				"mobile":"+19908989809",
				"phone":"1-999-098-4288",
				"company":  "Travelos Co (sample)",
				"website":  "travelosyy.io (sample)",
				"country":  "Spain",
				"campaign_name":"Web/Form Name",
				"custom_fields": [] 
			    }
		};
	//sample_code='curl -H "Authorization: Token token=sfg999666t673t7t82" -H "Content-Type: application/json" -d '{"lead":{"first_name":"Eric", "last_name":"Sampleton (sample)", "mobile_number":"1-926-652-9503", "company": {"name":"Widgetz.io (sample)"} }}' -X POST "https://domain.freshsales.io/api/leads"';
	 
	 todaysDate=new Date();
	allFieldList: any; 
	user_token=""; 
	constructor(private router: Router,
		private route: ActivatedRoute,
		private formService: FormService,
		public dialog: MatDialog, ) { }

	ngOnInit() { 
		if(location.hostname.search("localhost")>=0){ 
         this.current_url="https://tnt1.tutterflycrm.com";   
    } 
		this.select_category(this.cuurent_category);
		this.user_token=localStorage.getItem('userTenant');
		this.sample_code.token=this.user_token;
	}
  
 
	 custom_field_set=[];
	 isExpand=true;
	 expand_code(){
	 	$('.snip_code').removeClass('snip_space').addClass('snip_space_expand');
	 	this.isExpand=false;
	 }

	 shrink_code(){
	 	$('.snip_code').removeClass('snip_space_expand').addClass('snip_space');
	 	this.isExpand=true;
	 } 
	select_category(cat) { 
		this.custom_field_set=[];
		this.cuurent_category = cat;
		this.formService.getAllfields_admin(this.cuurent_category).subscribe((data: any) => {
			console.log(data);
			this.allFieldList = data.additional_fields; 
			if(this.allFieldList && this.allFieldList.length>0){
				for(let fld of this.allFieldList){
 
					if(fld.status!=1){
						if(fld.type=='multiselect' || fld.type=='checkbox'){
							var d_data='"sample1","sample2","sample2"';
							var fld_data ={
							         [fld.name]:d_data
					   	}
						}
						else if(fld.type=='calender'){
							var d_data='"sample1","sample2","sample2"';
							var fld_data ={
							         [fld.name]:"6/15/1992"
					   	}
						}else{
							var fld_data ={
							[fld.name]:fld.name+' Value(sample)'
						}
						}
						
						this.custom_field_set.push(fld_data);

					}
				}
			} 
			this.sample_code.lead.custom_fields=this.custom_field_set;
		});
	}
	openDialog(): void {
		let dialogRef = this.dialog.open(AlertBoxComponent, {
			width: '250px',
			data: JSON.stringify(this.popUpMsg)
		});
		dialogRef.afterClosed().subscribe(result => {
			console.log('The dialog was closed');
		});
	}
	cusFormModel = false;
	 
	 
	 


}
