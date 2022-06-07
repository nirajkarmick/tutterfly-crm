import { Component, OnInit } from '@angular/core';
import { FormService } from '../service/form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { Alert } from 'selenium-webdriver';
import { MessageService } from '../message.service';
import { AlertBoxComponent } from '../alert-box/alert-box.component';
import { Form ,StForm} from './form';
@Component({
	selector: 'app-custom-form',
	templateUrl: './custom-form.component.html',
	styleUrls: ['./custom-form.component.css']
})
export class CustomFormComponent implements OnInit {
	popUpMsg: any = "";
	cuurent_category = "Account";
	//cuurent_category = "Opportunity";
	label_name: any;
	name_error = false;
	field_type: any;
	req_field = false;
	fieldTypeArray = [
		['checkbox', 'assets/img/field_icons/checkbox.png'],
		['calender', 'assets/img/field_icons/Date-Picker.png'],
		['selectbox', 'assets/img/field_icons/dropdown.png'],
		['multiselect', 'assets/img/field_icons/Multiselect.png'],
		['number', 'assets/img/field_icons/Number.png'],
		['radio', 'assets/img/field_icons/radio-button.png'],
		['textarea', 'assets/img/field_icons/Text-Area.png'],
		['textbox', 'assets/img/field_icons/Text-Field.png'],
		['picklist', 'assets/img/field_icons/pick_list.png']

	];
	pickListData=[
					{'label':'Industries','name':'industries','status':true},
					{'label':'Salutation','name':'salutations','status':true},
					{'label':'Ratings','name':'ratings','status':true},
					{'label':'Lead Status','name':'lead_statuses','status':true},
					{'label':'Task Priorities','name':'task_priorities','status':true},
					{'label':'Sales Stage','name':'sales_stages','status':true},
					{'label':'Inclusions','name':'inclusions','status':true},
					{'label':'Experiences','name':'experiences','status':true},
					{'label':'Destinations','name':'destinations','status':true},
					{'label':'Itinerary Inclusions','name':'inclusions','status':true},
					{'label':'Tags','name':'opportunity_tags','status':true}

				];
	allFieldList: any;
	formData: Form = new Form();
	stFormData: Form = new StForm();
  listStyle = {
            width:'100%', //width of the list defaults to 300,
            height: '100%', //height of the list defaults to 250,
            dropZoneHeight: '50px' // height of the dropzone indicator defaults to 50
            }
	public fr_options: any[] = [{
		id: 1,
		value: ''

	}];
	constructor(private router: Router,
		private route: ActivatedRoute,
		private formService: FormService,
		public dialog: MatDialog,
		private msg: MessageService) {

         if (location.hostname.search("192.168")>=0  ||  location.hostname.search("localh")>=0 ||  location.hostname.search("tnt1")>=0 ||  location.hostname.search("tfc8")>=0){ 
		        this.isStandard=true;
          } 
		 }

	ngOnInit() {
		console.log(this.formData);
		this.select_category(this.cuurent_category);

		setTimeout(() => {			
		     $(".sortable-container .sortable-list .active .table tr td").css('color','#fff');
		     $(".sortable-container .sortable-header.sortable-name").css('font-size','20px');
		 }, 1400); 
	}
colSortedAdd(evnt){  
   this.allFieldList=evnt;
		this.sortedFields=[]; 
		  console.log(this.allFieldList);
		  for(let fld of this.allFieldList){		  	
		  	this.sortedFields.push(fld.id);
		  }
		  console.log(this.sortedFields); 

	    var p_data={"sort_f":this.sortedFields};
		this.formService.sort_all_fileds(p_data,this.cuurent_category).subscribe((data: any) => {
				console.log(data); 
		});	

} 
colSorted(evnt){   
   this.standardFields=evnt;
		this.sortedStFields=[]; 
		  console.log(this.standardFields);
		  for(let fld of this.standardFields){		  	
		  	this.sortedStFields.push(fld.id);
		  }
		  console.log(this.sortedStFields);

	    var p_data={"sort_f":this.sortedStFields};
		this.formService.sort_st_fileds(p_data,this.cuurent_category).subscribe((data: any) => {
				console.log(data); 
		});	 
}
	sortingData=true;
	sortData(type,cnt,f_type){
		    console.log(type+cnt+f_type);
		    console.log(this.allFieldList); 
		    if(type=='u'){
		    	this.moveItem(cnt,cnt-1);
		    }
		    if(type=='d'){
		    	this.moveItem(cnt,cnt+1);
		    }
	}
	sortedFields=[];
	moveItem(from, to) { 
		this.sortedFields=[];
		  var f = this.allFieldList.splice(from, 1)[0]; 
		  this.allFieldList.splice(to, 0, f);
		  console.log(this.allFieldList);
		  for(let fld of this.allFieldList){
		  	
		  	this.sortedFields.push(fld.id);
		  }
		  console.log(this.sortedFields);

	    var p_data={"sort_f":this.sortedFields};
		this.formService.sort_all_fileds(p_data,this.cuurent_category).subscribe((data: any) => {
				console.log(data); 
		});	  

	} 
	sortStData(type,cnt,f_type){
		    console.log(type+cnt+f_type);
		    console.log(this.standardFields); 
		    if(type=='u'){
		    	this.moveStItem(cnt,cnt-1);
		    }
		    if(type=='d'){
		    	this.moveStItem(cnt,cnt+1);
		    }
	}
	sortedStFields=[];
	moveStItem(from, to) { 
		this.sortedStFields=[];
		  var f = this.standardFields.splice(from, 1)[0]; 
		  this.standardFields.splice(to, 0, f);
		  console.log(this.standardFields);
		  for(let fld of this.standardFields){
		  	
		  	this.sortedStFields.push(fld.id);
		  }
		  console.log(this.sortedStFields);

	    var p_data={"sort_f":this.sortedStFields};
		this.formService.sort_st_fileds(p_data,this.cuurent_category).subscribe((data: any) => {
				console.log(data); 
		});	  

	}           
	editable_id: any;
	st_editable_id:any;
	frm_type = false;
	showeditPop(id) {
		this.resetOptionFields();
		this.cusFormModel = true;
		this.editable_id = id;
		this.formService.getForm(id, this.cuurent_category).subscribe((data: any) => {
			console.log(data);
			this.formData.label = data.additional_field.label;
			this.formData.type = data.additional_field.type;
            this.formData.status=data.additional_field.status==1?1:0;
			this.frm_type = data.additional_field.type;
			this.formData.mandatory = data.additional_field.mandatory;
			if(this.formData.type=='picklist'){
				this.picklist_field=true;
				this.picklist_selected=data.additional_field.name;
				this.formData.default_value = data.additional_field.default_value;
				if(this.picklist_selected){
					this.choose_picklist();
				}
				if(this.formData.default_value){
					this.picklist_d=true;
					setTimeout(() => {
					  this.picklist_default_value=data.additional_field.default_value;
			        }, 1400); 

				}
			}else{
        this.picklist_field=false;
      }
			if (data.additional_field.type_value && this.formData.type!='picklist') {
				this.picklist_field=false;
				this.option_field = true;
				this.fr_options = [];
				for (var i = 0; i <= data.additional_field.type_value.length - 1; i++) {
					console.log(data.additional_field.type_value[i]);

					this.fr_options.push({
						id: i + 1,
						value: data.additional_field.type_value[i]
					});
				}

			}
		});
	}
	stFormModel=false;
	showstandardPop(id){ 
		this.stFormModel = true;
		this.editable_id = id;
		this.formService.getStForm(id, this.cuurent_category).subscribe((data: any) => {
			console.log(data);
			this.stFormData.label = data.standard_field.label; 
            this.stFormData.status=data.standard_field.status==1?1:0;
			this.frm_type = data.standard_field.type;
			this.stFormData.mandatory = data.standard_field.mandatory;
			if(this.stFormData.type=='picklist'){
				this.picklist_field=true;
				this.picklist_selected=data.standard_field.name;
				this.stFormData.default_value = data.standard_field.default_value; 
			} 
		});

	}
	createNew() {
		if(this.formData.type=='picklist' && this.picklist_selected==""){
           this.popUpMsg="Please select picklist";
           this.openDialog();
           return false;
		} 
		if(this.formData.type && this.formData.type!='picklist'){
		    this.formData.name = this.formData.label;
		}
		this.formData.type_value = [];
		if (this.form_validation()) {
			console.log('error');
			return false;
		}

		this.set_options();
		this.formService.createform(this.formData, this.cuurent_category).subscribe((data: any) => {
			console.log(data);
			this.select_category(this.cuurent_category);
			this.reset_form();
			this.popUpMsg = data.message;
            this.openDialog();
		});

	}
	updateForm() {
		if(this.formData.type && this.formData.type!='picklist'){
		    this.formData.name = this.formData.label;
		}
		this.formData.type_value = [];
		if (this.form_validation()) {
			console.log('error');
			return false;
		}
		this.set_options();
		this.formService.updateform(this.formData, this.editable_id, this.cuurent_category).subscribe((data: any) => {
			console.log(data);
			this.select_category(this.cuurent_category);
			this.reset_form();
			this.resetOptionFields();
			this.popUpMsg = data.message;
            this.openDialog();
		});

	}


	updateStForm() {  
		if (this.form_validation_st()) {
			console.log('error');
			return false;
		}
		this.set_options();
		this.formService.updatestform(this.stFormData, this.editable_id, this.cuurent_category).subscribe((data: any) => {
			console.log(data);
			this.select_category(this.cuurent_category); 
			this.popUpMsg = data.message;
            this.openDialog();
			this.stFormModel=false;
		});

	}

	add_option(count) {
		this.fr_options.push({
			id: this.fr_options.length + 1,
			value: ''
		});
	}
	remove_option(i: number) {
		this.fr_options.splice(i, 1);
	}

	get_field_image(f_type) {
		for (var i = 0; i <= this.fieldTypeArray.length - 1; i++) {

			if (this.fieldTypeArray[i][0] == f_type) {
				return this.fieldTypeArray[i][1];
			}
		}

	}
	option_field = false;
	picklist_field=false;
	picklist_selected="";
	picklist_d=false;
	picklist_default_value='';
	picklistAllValue=[];
	reset_pick_values(){
		this.picklist_field=false;
		this.picklist_selected="";
		this.picklist_d=false;
		this.picklist_default_value='';
		this.picklistAllValue=[];
	}
	choose_picklist(){
		this.picklistAllValue=[];
		for(let fld of this.allFieldList){
			if(fld.name==this.picklist_selected && this.editable_id!=fld.id){
				this.popUpMsg=this.picklist_selected+" alredy added";
				this.openDialog();
				this.picklist_selected="";
				return false;
			}
		}
		if(this.editable_id==0){			
			this.picklist_default_value="";  
		}  
		//this.formData.label=this.picklist_selected;
		this.formData.name=this.picklist_selected;
		if(this.picklist_selected){
			this.picklist_d=true;
			this.formService.load_picklist(this.picklist_selected).subscribe((data: any) => {
			    console.log(data); 
			    this.setPickDropdown(data);

	        });	
		}else{
			this.picklist_d=false;
		}
	}
	setPickDropdown(data){
       if(this.picklist_selected=='industries'){
       	this.picklistAllValue=data.industries;
       }
       if(this.picklist_selected=='salutations'){
       	this.picklistAllValue=data.salutations;
       }
       if(this.picklist_selected=='ratings'){
       	this.picklistAllValue=data.ratings;
       }
       if(this.picklist_selected=='lead_statuses'){
       	this.picklistAllValue=data.lead_statuses;
       }
       if(this.picklist_selected=='inclusions'){
       	this.picklistAllValue=data.inclusions;
       }
       if(this.picklist_selected=='task_priorities'){
       	this.picklistAllValue=data.task_priorities;
       }
       if(this.picklist_selected=='experiences'){
       	this.picklistAllValue=data.experiences;
       }
       if(this.picklist_selected=='destinations'){
       	this.picklistAllValue=data.destinations;
       }
       if(this.picklist_selected=='itinerary_inclusions'){
       	this.picklistAllValue=data.itinerary_inclusions;
       }
       if(this.picklist_selected=='sales_stages'){
       	this.picklistAllValue=data.sales_stages;
       } 
       if(this.picklist_selected=='opportunity_tags'){
        this.picklistAllValue=data.opportunity_tags;
       } 

	}
	set_default_val(){
		//alert(this.picklist_default_value);

		this.formData.default_value=this.picklist_default_value;
	}
	select_field_type(type) {
		this.formData.type = type;
		this.reset_pick_values();
		this.resetOptionFields();
		if (type == 'selectbox' || type == 'multiselect' || type == 'checkbox' || type == 'radio') {
			this.option_field = true;
		} else {
			this.option_field = false;
		}
		if(type=='picklist'){
			this.picklist_field=true;

		}else{
			this.picklist_field=false;
		}
	}
    isStandard=false;
	standardFields=[];
	select_category(cat) {
		this.standardFields=[];
        $('body').removeClass('modal-open');
$('body').css('padding-right',0);
        $('.modal-backdrop').remove();
        this.reset_pick_values();
		this.cuurent_category = cat;
		this.formService.getAllfields_admin(this.cuurent_category).subscribe((data: any) => {
			console.log(data);
			this.allFieldList = data.additional_fields;
		});
		if(this.isStandard){
			this.formService.getAllstandard_admin(this.cuurent_category).subscribe((data: any) => {
				console.log(data);
				if(data && data.standard_fields!=undefined){
				     this.standardFields = data.standard_fields;
				}
				console.log(this.standardFields);
			});

		}
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
	openNewForm() {
		console.log('open');
		this.editable_id = 0;
		this.resetOptionFields();
		this.reset_pick_values();
		this.reset_form();
		this.cusFormModel = true;
		this.formData.status = 0;		
		this.formData.type = undefined;
	}
	resetOptionFields() {
		this.name_error = false;
		this.option_field = false;
		this.fr_options = [{
			id: 1,
			value: ''
		}];
	}
	valid_error = false;
	form_validation() {
		this.valid_error = false;
		if (this.formData.label) {
			this.name_error = false;
		} else {
			this.popUpMsg = "Please fill label name";
			this.openDialog();
			this.name_error = true;
			this.valid_error = true;
		}
		if (this.formData.type) {
			this.name_error = false;
		} else {
			this.popUpMsg = "Please select label type";
			this.openDialog();
			this.valid_error = true;
		}
		if (this.option_field && this.fr_options.length) {
		}
		if (this.valid_error) {
			return true;
		} else {
			return false;
		}
	}
	st_name_error=false;
	st_valid_error=false;
	form_validation_st() {
		this.st_valid_error = false;
		if (this.stFormData.label) {
			this.st_name_error = false;
		} else {
			this.popUpMsg = "Please fill label name";
			this.openDialog();
			this.name_error = true;
			this.st_valid_error = true;
		}  
		if (this.st_valid_error) {
			return true;
		} else {
			return false;
		}
	}
	set_options() {
		if (this.option_field) {
			console.log(this.fr_options);
			for (let op of this.fr_options) {
				console.log(op);
				if (op.value) {
					this.formData.type_value.push(op.value);
				}
				console.log(this.formData);

			}
		}
	}
	reset_form() {
		this.formData = new Form();
		this.resetOptionFields();
		this.cusFormModel = false;
		this.name_error = false;
		this.frm_type = false;
	}
	active_inactive_st_field(id,val){
		this.formService.update_standard_fields_status(id,val,this.cuurent_category).subscribe((data: any) => {
			
			console.log(data);
           this.popUpMsg=data.message;
           this.openDialog();
           this.select_category(this.cuurent_category);
			
		});

	}
	set_mandatory_st_field(id,val){
		this.formService.update_standard_fields_mandatory(id,val,this.cuurent_category).subscribe((data: any) => {
			
			console.log(data);
           this.popUpMsg=data.message;
           this.openDialog();
           this.select_category(this.cuurent_category);
			
		});

	}
}
