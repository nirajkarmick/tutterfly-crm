import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { FormService } from '../service/form.service';

@Component({
	selector: 'app-editform',
	templateUrl: './editform.component.html',
	styleUrls: ['./editform.component.css']
})
export class EditformComponent implements OnInit { 

	constructor(public dialog: MatDialog,
		private formService: FormService) { }
	@Input() extraFields: any;
	@Output() description_htmlChange = new EventEmitter<any>();
	calender_data = [];
	ngOnInit() {
	//	console.log(this.extraFields);
		if (this.extraFields.length > 0) {
			var i = 0;
			for (let fld of this.extraFields) { 
				if (fld.type == 'calender') { 
					this.calender_data.push(fld);
					if (fld.value) {
						this.calender_data[i].date_val = new Date(fld.value);
					} else {
						this.calender_data[i].date_val = '';
					}
					i++;
				}
			}
			for (let k=0; k < this.extraFields.length;k++) {  
				if(this.extraFields[k].type=='picklist'){      
					let that=this;
					this.formService.load_picklist(this.extraFields[k].name).subscribe((data: any) => {
						console.log(k);  
					    this.extraFields[k].type_value=this.setPickDropdown(data,this.extraFields[k].name); 
 					   
			        });	
				}
			} 


		}
		console.log(this.calender_data);
	}


	setPickDropdown(data,picklist_selected){ 
		var picklistAllValue=[];
		 
       if(picklist_selected=='industries'){
       	picklistAllValue=data.industries;
       }
       if(picklist_selected=='salutations'){
       	picklistAllValue=data.salutations;
       }
       if(picklist_selected=='ratings'){
       	picklistAllValue=data.ratings;
       }
       if(picklist_selected=='lead_statuses'){
       	picklistAllValue=data.lead_statuses;
       }
       if(picklist_selected=='inclusions'){
       	picklistAllValue=data.inclusions;
       }
       if(picklist_selected=='task_priorities'){
       	picklistAllValue=data.task_priorities;
       }
       if(picklist_selected=='experiences'){
       	picklistAllValue=data.experiences;
       }
       if(picklist_selected=='destinations'){
       	picklistAllValue=data.destinations;
       }
       if(picklist_selected=='itinerary_inclusions'){
       	picklistAllValue=data.inclusions;
       }
       if(picklist_selected=='sales_stages'){
       	picklistAllValue=data.sales_stages;
       }
       if(picklist_selected=='opportunity_tags'){
       	picklistAllValue=data.opportunity_tags;
       }
     return picklistAllValue;

	}
	get_date_form(dt) {
		console.log(dt);
		return new Date(dt);
	}
	validate_date(evnt){
		evnt.target.value='';
		return '';
	}
}
