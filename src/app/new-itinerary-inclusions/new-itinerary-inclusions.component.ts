import {ActivatedRoute, Router ,NavigationStart, NavigationEnd, NavigationError} from "@angular/router";
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {NewItineraryService} from "../new-itinerary.service";

import {MatDialog} from "@angular/material";
import {AlertBoxComponent} from "../alert-box/alert-box.component";
import {MessageService} from "../message.service";
import {Flights, Inclusion, Itinerary} from "./itinerary";

@Component({
  selector: 'app-new-itinerary-inclusions',
  templateUrl: './new-itinerary-inclusions.component.html',
  styleUrls: ['./new-itinerary-inclusions.component.css']
})
export class NewItineraryInclusionsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private itineraryService: NewItineraryService,
                public dialog: MatDialog, private msg: MessageService, private router: Router) { 
                  
                this.id = this.route.snapshot.queryParams['id'];
                this.msg.sendMessage('itinerary');
                this.renderData(); 
  }
  id:any;
  more_Inclusion = [];
  isInclusion = 0;
  itinerary_inclusions = [];

	    add_more_inc() {
	        console.log(this.itinerary_inclusions);

	        this.more_Inclusion.push({
	            id: this.more_Inclusion.length + 1,
	            name: '',
	            description: ''
	        });
   }
    remove_more_inc(i: number) {
        this.more_Inclusion.splice(i, 1);
    }
  ngOnInit() {
  }

    inclusion = new Inclusion();

    pick_inclusion(ev, id) {
        //var id=ev.target.value;
        if (ev.target.checked) {
            this.inclusion.itinerary_inclusions_id.push(id);
        } else {
            var index = this.inclusion.itinerary_inclusions_id.indexOf(id);
            this.inclusion.itinerary_inclusions_id.splice(index, 1);
        }
        console.log(this.inclusion.itinerary_inclusions_id);
    }
    set_inclusion(id) {
        if (this.inclusion.itinerary_inclusions_id.indexOf(id) > -1) {
            return true;
        } else {
            return false;
        }
    }
    isLoading=false;
    renderData() {         
        this.isLoading=true; 
        //this.form = new FormData();
        this.more_Inclusion = [];
        if (this.id) {
            this.itineraryService.getItineraryDetails(this.id).subscribe((data: any) => {

             
             setTimeout(() => {
                this.isLoading=false;
                     }, 5000);
                console.log(data);
                if (data) {   
                    this.inclusion.itinerary_inclusions_id = [];
                    if (data && data.itinerary_inclusions) {
                        this.itinerary_inclusions = data.itinerary_inclusions;
                    }
                    this.isInclusion = data.user_inclusion_list_flag;

                    if (data && data.user_itinerary_inclusion) {
                        this.user_itinerary_inclusion=data.user_itinerary_inclusion;
                        this.set_inc_exc(data)
                    } 
                    

                }
            });
        }
     //this.isLoading=false;
       setTimeout(() => {
                this.isLoading=false;
        }, 3000);
    }

        inclErr = '';
user_itinerary_inclusion="";
    set_inc_exc(data) {
        this.inclusion.id = data.user_itinerary_inclusion.id;
        this.inclusion.exclusion_description = data.user_itinerary_inclusion.exclusion_description;

        var inclusion_picklist = [];
        for (let incl of data.itinerary_inclusions) {
            inclusion_picklist.push(incl.name);
        }
        if (data.user_itinerary_inclusion) {
            console.log(data.user_itinerary_inclusion.user_inclusion_lists);
            for (let usr of data.user_itinerary_inclusion.user_inclusion_lists) {
                var i = 0;
                console.log(data.itinerary_inclusions);

                for (let inc of data.itinerary_inclusions) {
                    if (inc.name == usr.name) {
                        //alert(inc.name);
                        this.inclusion.itinerary_inclusions_id.push(inc.id);
                        this.itinerary_inclusions[i].description = usr.description;
                    }
                    i++;
                }
                if (inclusion_picklist.indexOf(usr.name) > -1) {

                } else {
                    this.more_Inclusion.push({
                        id: this.more_Inclusion.length + 1,
                        name: usr.name,
                        description: usr.description
                    });
                }
            }

        }
    }

    add_inclusions() {
        this.inclusion.itinerary_id = this.id;
        this.inclErr = '';
        // if (this.inclusion.itinerary_inclusions_id.length == 0) {
        //     this.inclErr = 'Please select inclusion item(s)!';
        //     this.popUpMsg = JSON.stringify('Please select inclusion item(s)!');
        //     this.openDialog();
        //     var myDiv = document.getElementById('newCreateinclusion');
        //     myDiv.scrollTop = 0;
        //     return false;
     //   } else {
            this.inclusion.user_inclusions_lists = [];
            for (let inc of this.inclusion.itinerary_inclusions_id) {
                //alert(inc);
                var selected = [];
                //var chked=$('#inclus_'+inc+' .inc_chk').attr('checked');
                var inc_name = $('#inclus_' + inc + ' .chk_lbl').html();
                var inc_desc = $('#inclus_desc_' + inc).val();
                //alert(inc_desc);
                var inc_data = {
                    "name": inc_name,
                    "description": inc_desc
                }
                this.inclusion.user_inclusions_lists.push(inc_data);

            }
            if (this.more_Inclusion.length > 0) {
                console.log(this.more_Inclusion);
                for (let list of this.more_Inclusion) {
                    var usr_data = {
                        "name": list.name,
                        "description": list.description
                    }
                    if (list.name) {
                        this.inclusion.user_inclusions_lists.push(usr_data);
                    }


                }
            }

       // }
        console.log(this.inclusion); 
        this.itineraryService.addInclusion(this.inclusion, this.isInclusion, this.id).subscribe((data: any) => {
            console.log(data);

            this.popUpMsg = JSON.stringify(data.message);
            this.openDialog(); 
            this.renderData();
            this.router.navigate(['/itineraryMain', {outlets: {itinerarySection: ['itinerary-flights']}}], {queryParams: {'id': this.id}});

        }, (err) => {
            // this.popUpMsg = JSON.stringify(err);
            // this.openDialog();
        });

    }
    popUpMsg: any;

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

}
