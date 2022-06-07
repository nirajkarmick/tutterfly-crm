import { Component, OnInit, Output, EventEmitter , Input } from '@angular/core';
import { OppurtunityService } from '../service/opportunity.service';
import { MatDialog } from '@angular/material';
import { AlertBoxComponent } from '../alert-box/alert-box.component';

@Component({
  selector: 'app-oppo-stages',
  templateUrl: './oppo-stages.component.html',
  styleUrls: ['./oppo-stages.component.css']
})
export class OppoStagesComponent implements OnInit {
@Input() stage_data;
@Input() opInfo;

@Input() current_pos;
@Output() updateEvent = new EventEmitter<string>();

current_stage:number;
popUpMsg:any;
current_selection:number;
//update_stage_flag=true;
  constructor( public dialog: MatDialog,private oppoService: OppurtunityService) { }
  
  ngOnInit() {    
   // this.current_stage=this.opInfo.sales_stage_id.position;
    //console.log(this.current_stage);
  }
  openDialog(): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '250px',
      data: JSON.stringify(this.popUpMsg)
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  currentSelection(id:number,pos:number){
    this.current_selection=id;
    //this.current_stage=pos;
    this.current_pos=pos;
  }
  updateCurrentStage(){
    let stage=new Stage;    
    stage.sales_stage_id=this.current_selection;
    stage.opportunity_id=this.opInfo.id;
    stage.last_modified_by_id=this.opInfo.last_modified_by_id;
    this.oppoService.updateStage(stage).subscribe(data=>{
      this.popUpMsg=data;
      this.openDialog();
      this.current_selection=undefined;
      this.updateEvent.emit();
      //window.location.reload();
    });

  }
}
class Stage{
    "sales_stage_id": number;
   "opportunity_id": number;
   "last_modified_by_id": number;    
}