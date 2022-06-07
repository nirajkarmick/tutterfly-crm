import {Router, ActivatedRoute, Params, NavigationStart, NavigationEnd, NavigationError} from '@angular/router';
import {Component, OnInit, ChangeDetectorRef, ViewChild, Input,ElementRef} from '@angular/core';
import {NewItineraryService} from '../new-itinerary.service';

import {MatPaginator, MatSort, MatTableDataSource, MatDialog} from '@angular/material';
import {AlertBoxComponent} from '../alert-box/alert-box.component';
import {MessageService} from '../message.service';
import {Itinerary} from './itinerary';
import * as moment from 'moment';
import { Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import {base64ToFile} from 'ngx-image-cropper';
import { FileService } from '../file.service';
import { OppurtunityService } from '../service/opportunity.service';



import { MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';

import { ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
const COMMA = 188;
@Component({
  selector: 'app-new-itinerary-builder',
  templateUrl: './new-itinerary-builder.component.html',
  styleUrls: ['./new-itinerary-builder.component.css']
})
export class NewItineraryBuilderComponent implements OnInit {
    //mat chip 
    visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = false;
  isLoading=true; 
config = {
    displayFn:(item: any) => { return item.text; } , 
        displayKey:"text",  
        search:true,  
        height: 'auto' , 
        placeholder:'Destinations',  
        customComparator: ()=>{}, 
        limitTo: 10,  
        moreText: 'more destinations', 
        noResultsFound: 'No destination found!' , 
        searchPlaceholder:'Search Destination', 
        searchOnKey: 'text',  
        clearOnSelection: true,  
        inputDirection: 'ltr' , 
     // bindKey: "id",
  };
  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];

  desttinCtrl = new FormControl();

  filteredDestins: Observable<any[]>;

  desttins = [
    //{ name: 'Lemon' },
  ];

  allDestins = [
    // {id:'Orange',text:'OOOOORRR'},
    // {id:'Strawberry',text:'Strawberry'}, 
  ];

  @ViewChild('desttinInput') desttinInput;
  ///////////////////////////
    activeUrl: any;
    allItinerary: any;
    newtinerary: Itinerary = new Itinerary();
    destination_list: any;
    destinationData: any;// = [];
    public destinationOptions: Select2Options;
    timezoneData: any = [];
    public timezoneOptions: Select2Options;
    popUpMsg: string;
    start_date: any;
    end_date: any;
    st_date: any;
    e_date: any;
    errName: any;
    errDestination: any;
    errTraveller: any;
    errStart: any;
    errEnd: any;
    
    public term = '';
    // date_or_days=true;
    opp_id:any
    edit_id=0;
get_all_destinations(){console.log('des');
    this.filteredDestins = this.desttinCtrl.valueChanges
      .startWith(null)
      .map(contact => contact ? this.filter(contact) : this.allDestins); 
}

    constructor(private route: ActivatedRoute, private itineraryService: NewItineraryService,
                public dialog: MatDialog,public opportunitieservice:OppurtunityService, private msg: MessageService, private router: Router,private fileService: FileService) {
        this.msg.sendMessage('itinerary');
        this.opp_id = this.route.snapshot.queryParams['opp_id'];
       this.editable_id = this.route.snapshot.queryParams['edit'];
       if(this.editable_id){alert(this.editable_id);
         setTimeout(() => {
          this.renderEditData();
         }, 300);
       }else{
          this.editable_id=0;
       } 
          this.renderData();
        

         this.filteredDestins = this.desttinCtrl.valueChanges
      .startWith(null)
      .map(contact => contact ? this.filter(contact) : this.allDestins); 
       

        router.events.subscribe((event) => {

            if (event instanceof NavigationEnd) { 
                var routes = this.router.url.split(':');
                this.activeUrl = routes[1].split(')')[0]; 
            }
        }); 
        this.destinationOptions = { 
            multiple: true,
            //tags: true
        };
    }



  //add(event: MatChipInputEvent): void {
set_destinations(event) {
    let value = event.value;
    let name = event.text;
    let dest_id = value.id; 

    this.errDest="";     
    if(this.newtinerary.destination_id && this.newtinerary.destination_id.length>0){
        console.log('1');
        let index = this.newtinerary.destination_id.indexOf(dest_id);

        if (index >= 0) {console.log('3');
          this.remove(dest_id);
        }else{
           this.newtinerary.destination_id.push(dest_id); 
        } 
    }else{ 
        this.newtinerary.destination_id.push(dest_id);
    }  
     
  }

  remove(dest_id: any): void { 
console.log('remove');
  let k=0;
    for(let mt of this.desttins){          

            if (mt.id == dest_id) {
              this.desttins.splice(k, 1); 
            }
            k++;
    }
     let index = this.newtinerary.destination_id.indexOf(dest_id);
     this.newtinerary.destination_id.splice(index, 1);
     console.log(this.newtinerary.destination_id,'after remove')
   
  }

  filter(name: string) {
    console.log(name); 
    if(name){        
    return this.allDestins.filter(desttin => 
      desttin.text.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }
  }

  selected_chip(event: MatAutocompleteSelectedEvent): void {
    console.log(event);
   // this.desttins.push({ name: event.option.viewValue });
    this.desttins.push(event.option.value);
    this.desttinInput.nativeElement.value = '';
    this.set_destinations(event.option);
  } 
    oppData:any;  
    curr_page = 2;
    totalData: any;
    totalCurrent = 10; 
    loadMoreData(){
         this.itineraryService.getAllItinerary(this.curr_page).subscribe((data: any) => {
            this.curr_page=this.curr_page +1;
            let it_count=data.itineraries.length;
            this.totalCurrent=this.totalCurrent + it_count;
            if(it_count  > 0){
            for(let index in data.itineraries){
              this.allItinerary.push(data.itineraries[index]);
            }
            
         }
            });
    }  
    s3_url="";
    destinationsList = [];
    renderEditData() {          
        if (this.editable_id) {
           // this.isLoading=true;
            this.itineraryService.getItineraryDetails(this.editable_id).subscribe((data: any) => {
             
             setTimeout(() => {
                //this.isLoading=false;
                     }, 1000);
                console.log(data);
                if (data) {
                    this.itineraryData = data.itinerary;
                    this.itinerary_days = data.itinerary_days;
                    //this.set_days_items();  
                    this.s3_url=data.s3_url;
                    this.destinationsList = this.itineraryData.destinations; 
                    this.newtinerary.destination_id=[];
                    console.log(this.destinationsList);
                    var x=0; 
                    var sel_dest=[];
                    setTimeout(() => {     
                        //this.destinationData=[];
                        $('#newCreateitinerarymodal').css('display', 'block');
                        if (this.destinationsList != undefined) {
                            let i = 0; 
                            for(let dd of this.destinationsList){ 
                                sel_dest.push("" +dd.id);
                                x++; 
                            }  
                            this.dest_selected=sel_dest;
                            this.newtinerary.destination_id=this.dest_selected;
                        }  
                         this.open_new_trip_edit(); 
                         //this.setEditDestinationDayWise();

                 
                     }, 1000);
                     

                }

                this.get_all_destinations();
            });
        } 
    }
  selectt_dest=[];
    renderData(){
        this.isLoading=true;
         this.itineraryService.getAllItinerary().subscribe((data: any) => {
        this.isLoading=false;
            this.curr_page=2;  console.log(data,'DATATAAAA');
            if (data) { 
                this.totalData=data.total;
               // alert(this.totalCurrent);
                this.totalCurrent=10;
                this.destination_list = data.destinations;
                this.timezoneList = data.timezones;
                this.allItinerary = data.itineraries;
                if(this.editable_id==0){
                    this.open_new_trip();                  
                    if(this.opp_id && this.opp_id>0){
                        this.itineraryService.getOpp(this.opp_id).subscribe((res: any) => {
                        if (res) {
                            this.oppData=res.opportunity;
                            this.open_new_trip_opp(this.oppData);
                        }
                       });
                    }
                    this.get_all_destinations();
                }
            }
        }, (err) => { 
            this.isLoading=false;
                }); 
        
    }
    open_new_trip_opp(oppData){
        this.opp_id=0; 
        this.newtinerary=new Itinerary();
        var x=0; 
        var sel_dest=[];
        setTimeout(() => {     
            this.destinationData=[];
            $('#newCreateitinerarymodal').css('display', 'block');
            if (this.destination_list != undefined) {
                let i = 0;
                for (let e of this.destination_list) {
                    this.destinationData.push({'id': e.id, 'text': e.name});
                    i++;
                }
                for(let dd of oppData.destination_id){ 
                    sel_dest.push("" +dd.id);
                    x++; 
                }  
                this.dest_selected=sel_dest;
                this.newtinerary.destination_id=this.dest_selected;
            }
            this.newtinerary.number_of_days=parseInt(oppData.no_of_nights)+1;
            if(this.newtinerary.number_of_days>0){
                this.set_days_array();
            }
         }, 1000);
        this.editable_id=0;
        this.photo_name='';
        this.newtinerary.date_or_days=0; 

    
    }
    timezoneList:any;
    open_new_trip() {
        
        $('#newCreateitinerarymodal').css('display', 'block');
        this.newtinerary.destination_id=[];
        this.destinationData=[];
        if (this.destination_list != undefined) {
            let i = 0;
            for (let e of this.destination_list) {
                this.destinationData.push({'id': e.id, 'text': e.name.trim()});
                i++;
            }
            this.allDestins=this.destinationData
            this.editable_id=0;
            this.photo_name='';
            this.newtinerary=new Itinerary();
            this.newtinerary.date_or_days=0;

            this.ngOnInit();
            this.newtinerary.destination_id=[];
         } 
         //$("#day_dt_set").trigger('click');
    }

    open_new_trip_edit() {  
        this.destinationData=[];
        if (this.destination_list != undefined) {
            let i = 0;
            for (let e of this.destination_list) {
                this.destinationData.push({'id': e.id, 'text': e.name.trim()});
                i++;
            }
            this.allDestins=this.destinationData;
         } 
         setTimeout(() => {

         this.newtinerary.name=this.itineraryData.name;
         this.newtinerary.description=this.itineraryData.description;
         this.selectedBanner=this.itineraryData.banner_image;
         this.photo_name=this.selectedBanner;
         //alert(this.itinerary_days.length);
         var night_length=this.itinerary_days.length;
         this.edit_validate_days(night_length,'n');
         }, 300);

         //$("#day_dt_set").trigger('click');
    }
    editable_id=0;
    EditItinerary(){
        //alert(this.editable_id);
    }
    itineraryData:any;
    itinerary_days:any;
    flights:any;
    
    dest_selected=[];
    time_selected=[];
    editbanner_image:any
     

    close_ite_modal() {
        $('#newCreateitinerarymodal').css('display', 'none');
    }
    close_itinerarydatepiker() {
        this.newtinerary.date_or_days=0;
        $('#itinerarydatepiker').css('display', 'none');
        $('#itinerarydayselector').css('display', 'block');
    }
    close_itinerarydayselector() {
            this.newtinerary.date_or_days=1;
            this.newtinerary.number_of_days=0;
            this.set_days_array();
            $('#itinerarydayselector').css('display', 'none');

            $('#itinerarydatepiker .mat-form-field-underline').css('display', 'none');
            $('#itinerarydatepiker').css('display', 'block');
    }
    set_date_range(day_date){
        if(day_date==1){
            $('#itinerarydayselector').css('display', 'none');
            $('#itinerarydatepiker').css('display', 'block'); 
            this.selected= {
                 startDate: moment(new Date(this.newtinerary.start_date)),
                 endDate: moment(new Date(this.newtinerary.end_date)),
            }; 
            this.ngModelChange('e'); 

        }else{
            $('#itinerarydatepiker').css('display', 'none');
            $('#itinerarydayselector').css('display', 'block');
        }
    }
    ngOnInit() {
        this.set_form_styling();
        this.close_itinerarydatepiker();
        this.newtinerary.number_of_days=0;
        this.newtinerary.number_of_adults=0;
        this.newtinerary.number_of_childrens=0;
        this.newtinerary.number_of_travellers=0;
        this.newtinerary.date_or_days=0;
        this.newtinerary.status=0;
        this.errName='';
        this.errDest='';
        this.errStart='';
        this.errEnd='';
        this.errDesc='';
        this.errDays='';
        this.errImage='';
        this.selected = {
            startDate: moment(),
            endDate: moment().add('days', 1),
        };
        this.ngModelChange('e');
        $('#itinerarydatepiker .mat-form-field-underline').css('display', 'none'); 
         
    }

    selectBox() {
            $('.select2-container').css('z-index', 5000);
    }
    renderNewViewTime(value) {
            console.log(value);
            this.newtinerary.timezone = value;
    }
    getDestName(city_id){
        for(let dest of this.destination_list){
                if(city_id==dest.city_id){
                  return dest.name;
                        }}
    }
    daysDestinations:any[];
    dayWiseDesination:0; 
    destinationToPullit=[];
    renderNewView(value) { 
        console.log(value);
        this.destinationToPullit=[];
        this.errDest="";       
        this.newtinerary.destination_id=value;
        this.daysDestinations=[];
        let i=0;
        console.log(this.destination_list);
        for(let dest of this.destination_list){
             for(let des_id of value){
                if(des_id==dest.id){
                   console.log(dest);
                   this.destinationToPullit.push(dest.city_id);
                    this.daysDestinations.push(
                        {
                            'id':dest.id,
                            'name':dest.name,
                            'checked':false,
                            //'checked':i==0?true:false,
                            // 'chm':"def"
                        }
                    );
                    i++;
                }

             }
        }
       if(this.newtinerary.number_of_days > 1){
           this.set_days_array();
        }
        if(this.destinationToPullit.length>0){
            this.pullDestinationImages();
        }else{
            this.allDestPullImages=[];
            this.loadDestImage=[];
        }
    }
    itin_destinations=[];
    renderNewViewDest(value) { 
        console.log(value);
        this.destinationToPullit=[];
        this.errDest="";       
        this.newtinerary.destination_id=value;
        this.daysDestinations=[];
        let i=0; 
        for(let dest of this.destination_list){
            var k=0;
             for(let des_id of value){
                if(des_id.id==dest.id){
                   this.destinationToPullit.push(dest.city_id);
                    this.daysDestinations.push(
                        {
                            'id':dest.id,
                            'name':dest.name,
                            'checked':false, 
                        }
                    );
                    i++;
                    k++;
                }

             }
        }
        console.log(this.newtinerary.destination_id); 
        this.newtinerary.destination_id=JSON.stringify(this.newtinerary.destination_id); 
       if(this.newtinerary.number_of_days > 1){
           this.set_days_array();
        }
        if(this.destinationToPullit.length>0){
            this.pullDestinationImages();
        }else{
            this.allDestPullImages=[];
            this.loadDestImage=[];
        }
    }
    allDestPullImages=[]; 
    loadDestImage=[];
    pullDestinationImages(){
        this.loadDestImage=[];
        this.isLoading=true;
         this.itineraryService.imagesFromPullit(this.destinationToPullit).subscribe((data: any) => {
           //this.allDestPullImages=data.destination_data;
           var pullImages=data.destination_data;
        this.isLoading=false;
            console.log(pullImages); 
            var e=0;
           for(let dest_id in pullImages){
              this.allDestPullImages[dest_id]=[];
               console.log(this.allDestPullImages); 
             
               for(let d_img of pullImages[dest_id]){ 
                console.log(e);
                 var dd_img=d_img.images_url; 

                if(dd_img && dd_img.search('http')==0){ 
                this.itineraryService.checkUrl(dd_img).subscribe((data: any) => {
                  console.log('yes');
                 }, (err) => {console.log(err.status);
                    if(err.status==200){
                        this.allDestPullImages[dest_id].push(d_img);
                        this.loadDestImage.push(d_img);
                        
                    } 
                }); 
                } 
               }
                e++;

           }
           console.log(this.allDestPullImages); 
           if(this.allDestPullImages && this.allDestPullImages.length>0){
              for(let pdes in this.allDestPullImages){
                 setTimeout(() => {
                    console.log(this.allDestPullImages[pdes]); 
                    var d_Array=this.allDestPullImages[pdes];
                    this.allDestPullImages[pdes]=this.removeDups(d_Array,'id');
                }, 2600);
              }
           } 
           //this.allDestPullImages=[];

        }, (err) => {
            this.allDestPullImages=[];
        this.isLoading=false;
        }); 
    }

removeDups(arr, prop) {

  // Object to store title of visited members
  var obj = {};
  var val;

  for (var i=0, iLen=arr.length; i<iLen; i++) {

    // Store a reference to the current member
    val = arr[i][prop];

    // If have a match
    if (obj.hasOwnProperty(val)) {

      // Add the DIFF property to the previous instance
      arr[obj[val]].DIFF += arr[i].DIFF;

      // Remove from array
      arr.splice(i, 1);

      // Decrement counter and limit to account for removed member
      --i;
      --iLen;

    // Otherwise, remember the property value and index of the member
    } else {
      obj[val] = i;
    }
  }
  return arr;
}    
doesFileExist(urlToFile) {
    var cors=""; 
    if (location.hostname.search("192.168")>=0  ||  location.hostname.search("localh")>=0){ 
         cors="https://cors-anywhere.herokuapp.com/";   
    } 

    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', cors+urlToFile, false);
    xhr.send();
     
    if (xhr.status == 404) {
        return false;
    } else {
        return true;
    }
}

imageExists(image_url){
  var cors=""; 
    if (location.hostname.search("192.168")>=0  ||  location.hostname.search("localh")>=0){ 
         cors="https://cors-anywhere.herokuapp.com/";   
    } 

    var http = new XMLHttpRequest();

    http.open('HEAD', cors+image_url, false);
    http.send();
    console.log(http.status != 404);
    return http.status != 404;

}

  
  public dayWiseDestinationData: any = [];

    setDestinationDayWise(evnt,k,i,des_id){ 
        console.log(evnt.target.checked);
        var chkd=evnt.target.checked;
        var indexx=this.dayWiseDestinationData[k].indexOf(des_id);
        if(chkd==false){
            if(indexx >-1){
              this.dayWiseDestinationData[k].splice(indexx, 1);

            }else{
                this.dayWiseDestinationData[k].push(des_id); 
            }
        }else{
            this.dayWiseDestinationData[k].push(des_id); 
        }
        
        console.log(this.dayWiseDestinationData);  

    }
    push_error_message(){
        this.error_messages.push(this.errName);
        this.error_messages.push(this.errStart);
        this.error_messages.push(this.errEnd);
        this.error_messages.push(this.errDays);
        this.error_messages.push(this.errDesc);
        this.error_messages.push(this.errDest);
        this.error_messages.push(this.errImage);
    }
    errTime:any;
    errDest:any;
    errDesc:any;
    errDay:any;
    errDays:any;
    error_messages:any[];
    createnewItinerary() {
        this.isLoading=true;
        console.log(this.newtinerary); //return;
        this.errDay ="";
        this.error_messages=[];

        if (!this.newtinerary.name) {
            this.errName = 'Please add Name!';
        } else {
            this.errName = '';
        }
        if(this.photo_name==''){
            this.errImage = 'Please select Banner Image!';
        }else{
            this.errImage = '';
        }
        if (this.newtinerary.date_or_days==1) {            
                this.newtinerary.start_date =this.st_date;
                this.newtinerary.end_date =this.e_date;                
        }else{
            this.newtinerary.start_date ='';
            this.newtinerary.end_date ='';
        } 
       if (this.newtinerary.destination_id.length==0) {
            this.errDest = 'Please add destination!';
        } else {
            this.errDest = '';
            for(let d_day of this.dayWiseDestinationData){
                   console.log(d_day,'cc');
                if(d_day.length==0){
                   console.log(d_day,'ss');
                   this.errDay = 'Please add daywise destinations!';
                }
            }
        }
       if (!this.newtinerary.description) {
            this.errDesc = 'Please add desription!';
        } else {
            this.errDesc = '';
        }
        if(this.newtinerary.date_or_days==0 && this.newtinerary.number_of_days==0){
              this.errDays = 'Please add number of days!';
        }else{
             this.errDays = '';
        }
        if(this.dayWiseDestinationData.length==0){
            this.errDest = 'Please add destination!';
        }
        if(this.errDay ){
             $('#st_destinations').trigger('click');
        }
       // console.log(this.errName ,this.errStart , this.errEnd ,this.errDays , this.errDesc , this.errDest , this.errImage);
        if (this.errName  || this.errDay  ||  this.errStart || this.errEnd ||this.errDays || this.errDesc || this.errDest || this.errImage) {
          var myDiv = document.getElementById('newCreateitinerarymodal');
          myDiv.scrollTop = 0;
          this.push_error_message();
          this.isLoading=false;
          return false;
        }else{
            this.error_messages=[];
        }
        this.newtinerary.dayWiseDestinationData=JSON.stringify(this.dayWiseDestinationData); 
        for(var key in this.newtinerary) {
            console.log(this.newtinerary[key]); 
            this.form.set(key, this.newtinerary[key]);
        } 

console.log(this.form); 
        this.itineraryService.CreateBasicItinerary(this.form,this.editable_id,this.newtinerary).subscribe((data: any) => {
           // console.log(data);
           this.isLoading=false;
            if (data && data.itinerary) {
                this.router.navigate(['/itineraryMain', {outlets: {itinerarySection: ['itinerary-inclusions']}}], {queryParams: {'id': data.itinerary.id}});
            }
            this.popUpMsg = JSON.stringify(data.message);
            this.openDialog();
            this.close_ite_modal();
            this.renderData();

        }, (err) => {
            // this.popUpMsg = JSON.stringify(err.message);
            // this.openDialog();
            this.isLoading=false;
        });
    }
    updateItinerary(){
        console.log(this.newtinerary);
        console.log(this.itinerary_days);
        console.log(this.daysDestinations);
        var i=0;
        var ch_value="";  
  for(let h=0;h<this.days_array.length;h++){
              var j=0;
              var that=this;
             this.days_array[h].destinations.map(function(a) {
              ch_value=that.itinerary_days[h].all_destinations[j].checked;
                that.days_array[h].destinations[j].checked = ch_value; 
                j++;
            }); 
  }
        for(let dd of this.days_array){
            //  var k=0;
            //  var j=0;
            //  var that=this;
            //  this.days_array[i].destinations.map(function(a) {
            //    ch_value="";
            //   console.log(that.itinerary_days[i].all_destinations[j].checked+'-'+i+'-'+that.itinerary_days[i].all_destinations[j].name+'-'+j);
            //   ch_value=that.itinerary_days[i].all_destinations[j].checked+'-'+i+'-'+that.itinerary_days[i].all_destinations[j].name+'-'+j;
            //     that.days_array[i].destinations[j].checked2 = ch_value; 
            //     j++;
            // }); 
            //  console.log(this.days_array[i]);
            //  if(i>3){
            //  return;

            //  }
             // for(let dy of dd.destinations){
             //      this.days_array[i].destinations[k].checked=this.itinerary_days[i].all_destinations[k].checked; 
                  
             //      console.log(this.days_array[i].destinations[k].checked+'--'+this.days_array[i].destinations[k].name);
             //      console.log(this.itinerary_days[i].all_destinations[k].checked+'--'+this.itinerary_days[i].all_destinations[k].name);
             //      k++;
             //   }


            // for(let des of dd.destinations){
            //    this.dayWiseDestinationData[i].push(des.destination_id);
            //    console.log(this.days_array[i]);
            //    var k=0;
            //    console.log(this.days_array[i].destinations,i);
            //    for(let dy of this.days_array[i].destinations){
            //       if(dy.id==des.destination_id){
            //         this.days_array[i].destinations[k].checked=true; 
            //       }
            //       k++;
            //    }
            // }
            i++;
        }

         setTimeout(() => {
        console.log(this.days_array);
        $('#st_destinations').trigger('click');
         }, 3600);
    }
      setEditDestinationDayWise(){
        console.log(this.newtinerary);
        console.log(this.itinerary_days);
        console.log(this.daysDestinations);
        var i=0;
        for(let dd of this.itinerary_days){
            for(let des of dd.destinations){
               this.dayWiseDestinationData[i].push(des.destination_id);
              // this.daysDestinations[i].checked=true;
            }
            i++;
        }

        $('#st_destinations').trigger('click');
        console.log(this.dayWiseDestinationData);
    }
    errDayDest="";
checkDayWiseDest(){

}
    orgValueChange() {
            this.errEnd = '';
            if (this.start_date) { 
                if (this.start_date > this.end_date) { 
                    this.errEnd = 'Please select correct date';
                    this.end_date = '';
                } else { 
                } 
            } else {
                this.errStart = 'Please select start date first';
                this.end_date = '';
            }

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
    isNumber(evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
    selected = {
        startDate: moment(),
        endDate: moment().add('days', 1),
    };
    chosenDate(val: { chosenLabel: string;}){
            console.log(val);
    }
    ngModelChange(e) {
        console.log(this.selected);
        console.log(moment(e.startDate));  
        this.start_date=this.selected.startDate.toDate();
        this.end_date=this.selected.endDate.toDate(); 
        if (this.start_date instanceof Date) {
                var dd = (this.start_date.getDate() < 10 ? '0' : '') + this.start_date.getDate();
                var MM = ((this.start_date.getMonth() + 1) < 10 ? '0' : '') + (this.start_date.getMonth() + 1);
                var yyyy = this.start_date.getFullYear();
                this.st_date = dd + '-' + MM + '-' + yyyy;
                this.errStart = '';
        }
        if (this.end_date instanceof Date) {
                var dd = (this.end_date.getDate() < 10 ? '0' : '') + this.end_date.getDate();
                var MM = ((this.end_date.getMonth() + 1) < 10 ? '0' : '') + (this.end_date.getMonth() + 1);
                var yyyy = this.end_date.getFullYear();
                this.e_date = dd + '-' + MM + '-' + yyyy;
                this.errEnd = '';
        } 
        var start = moment(e.startDate);
        var end = moment(e.endDate);
        var no_of_days=end.diff(start, "days")+1;
        //alert(no_of_days);
        if(no_of_days>1){
            this.set_days(no_of_days);

        }

    }  

    change(e): void {
      //  console.log(this);
        console.log(moment(e.startDate));
    }
    setRange(){
            $(".md-drppicker.double").css('width','500px');
    }

   
    set_days(val){
        this.errDest = '';
        if(this.newtinerary.destination_id && this.newtinerary.destination_id.length==0){
            this.errDest = 'Please add Destination(s)!';  
            return false;
        }
        this.newtinerary.number_of_days=val;
        if(this.newtinerary.number_of_days > 0){
           this.set_days_array();
        }
    }
    days_array:any[]; 
    days_selected_destination: any =[{
         day : undefined,
         destinations : [],
     }];
    //days_selected_destination:DestinData[];
   showDaysDest(val,day){
    console.log(val);
    if(day>0){
        this.days_array[day-1].dd=day;
        this.days_array[day-1].destinations=val;
    }
    console.log(this.days_array);
   }
    set_days_array(){
        this.days_array=[];
        this.dayWiseDestinationData=[]; 
        let day_val=this.newtinerary.number_of_days;
        if(this.newtinerary.destination_id && this.newtinerary.destination_id.length>0){

                for(let i=1;i<=day_val;i++){ 
                    var d_dest=this.daysDestinations.length > 0 ?this.daysDestinations:[];
                    var d_data={"dd":i,"destinations":d_dest};
                     this.days_array.push(d_data); 
                     var dd_des={"destinations":[]}; 
                     this.dayWiseDestinationData[i-1]=[]; 
                } 
               // $('#st_destinations').trigger('click');
        }
        console.log(this.days_array); 
    }
    down_adult(val){
            if(this.newtinerary.number_of_adults!=0){
                this.newtinerary.number_of_adults=this.newtinerary.number_of_adults-1;
            }
            this.update_travellers();        
    }
    up_adult(val){
            this.newtinerary.number_of_adults=this.newtinerary.number_of_adults+1;
            this.update_travellers();
    }

    down_child(val){
        if(this.newtinerary.number_of_childrens!=0){
            this.newtinerary.number_of_childrens=this.newtinerary.number_of_childrens-1;
        }
        this.update_travellers();            
    }
    up_child(val){
            this.newtinerary.number_of_childrens=this.newtinerary.number_of_childrens+1;
            this.update_travellers();
    }
    update_travellers(){
            this.newtinerary.number_of_travellers=this.newtinerary.number_of_childrens + this.newtinerary.number_of_adults;
    } 


    get_destinations(dest_id){
    console.log(dest_id);

    }

    imageChangedEvent: any = '';
    croppedImage: any = '';
    canvasRotation = 0;
    rotation = 0;
    scale = 1;
    showCropper = false;
    containWithinAspectRatio = false;
    transform: ImageTransform = {};
    form = new FormData();
    photo:File;
    photo_name:any;
    errImage='';
    imgName='';
    addFIle(event: any) {
        this.imgName='';
        this.errImage='';
        this.photo_name=''
        var validExtensions = ['jpg','png','jpeg']; //array of valid extensions
        var fileName = event.target.files[0].name;
        var fileNameExt = fileName.substr(fileName.lastIndexOf('.') + 1);
        if ($.inArray(fileNameExt, validExtensions) == -1) {
                this.errImage="Only these file types are accepted : "+validExtensions.join(', ');
                alert("Only these file types are accepted : "+validExtensions.join(', '));
                return false;
        }
        const URL = window.URL || (window as any).webkitURL;
        const Img = new Image();

        const filesToUpload = (event.target.files);
        Img.src = URL.createObjectURL(filesToUpload[0]);

        Img.onload = (e: any) => {
              var height = e.path[0].height;
              var width = e.path[0].width;
              console.log(height,width);
              if(width < 800 && height < 500){
                this.errImage='Please select image of size greater than  800 X 500 Dimensions';
                this.popUpMsg = JSON.stringify('Please select image of size greater than 800 X 500 Dimensions');
                this.openDialog();
                 //alert('Please select image of size greater than 800 X 500');
              }else{ 
                 this.imageChangedEvent = event;
                 console.log(this.imageChangedEvent); 
                 this.imgName=event.target.files[0].name;
                 console.log((this.banner.nativeElement as HTMLImageElement).width);
                 this.open_crop_modal();
              }
      }

    }

    changeImage(event: any) { 

        this.photo = event.target.files[0];
        this.photo_name=this.photo.name;
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader(); 
            reader.readAsDataURL(event.target.files[0]);
        reader.onload = function(e:any) {
          $('#edit_it_img').attr('src', e.target.result);
        }
         this.open_crop_modal();
        console.log(this.editable_id); 
        
         }
           
         this.imageChangedEvent = event;
         console.log(this.imageChangedEvent);
         $("#newCreateitinerarymodal .overlay").css('background','none');  
    }
    open_crop_modal(){

         $("#crop_model .overlay").css('background','none'); 
         $("#crop_model").css('display','block'); 
         $("#crop_model").addClass('show'); 
         $("#crop_model").css('z-index','9999;'); 
    }
    close_crop(){
         $("#crop_model").removeClass('show'); 
         $("#crop_model").css('display','none');
          //this.croppedImage =''; 
    }

  photoForm = new FormData();
  normalImgCropping=true;
  selectedBanner="";
  done_cropping(){
this.selectedBanner=this.croppedImage;
     if(this.editable_id){
         this.photoForm.set("banner_image", base64ToFile(this.croppedImage));
         this.photoForm.set("itinerary_id", ""+this.editable_id);
         console.log(this.photoForm);

        this.itineraryService.updateImage(this.photoForm).subscribe((data: any) => {
            console.log(data.banner_image);
            $('#edit_it_img').attr('src', data.banner_image);            
            this.popUpMsg = JSON.stringify(data.message);
            this.openDialog();
            this.renderEditData();

        }, (err) => {
            // this.popUpMsg = JSON.stringify(err.message);
            // this.openDialog();
        });
    }else{

    this.form.set("banner_image", base64ToFile(this.croppedImage)); 
    console.log(base64ToFile(this.croppedImage));
        this.photo_name=this.imgName;  

    }
    this.close_crop();
    this.normalImgCropping=true;
  }


    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
        console.log(event, base64ToFile(event.base64));
    
     }
   @ViewChild('banner') banner: ElementRef;     

    imageLoaded() {
        this.showCropper = true;
        console.log('Image loaded');
    }

    cropperReady(sourceImageDimensions: Dimensions) {
        console.log('Cropper ready', sourceImageDimensions);
    }

    loadImageFailed() {
        console.log('Load failed');
    }

    rotateLeft() {
        this.canvasRotation--;
        this.flipAfterRotate();
    }

    rotateRight() {
        this.canvasRotation++;
        this.flipAfterRotate();
    }

    private flipAfterRotate() {
        const flippedH = this.transform.flipH;
        const flippedV = this.transform.flipV;
        this.transform = {
            ...this.transform,
            flipH: flippedV,
            flipV: flippedH
        };
    }


    flipHorizontal() {
        this.transform = {
            ...this.transform,
            flipH: !this.transform.flipH
        };
    }

    flipVertical() {
        this.transform = {
            ...this.transform,
            flipV: !this.transform.flipV
        };
    }

    resetImage() {
        this.scale = 1;
        this.rotation = 0;
        this.canvasRotation = 0;
        this.transform = {};
    }

    zoomOut() {
        this.scale -= .1;
        this.transform = {
            ...this.transform,
            scale: this.scale
        };
    }

    zoomIn() {
        this.scale += .1;
        this.transform = {
            ...this.transform,
            scale: this.scale
        };
    }

    toggleContainWithinAspectRatio() {
        this.containWithinAspectRatio = !this.containWithinAspectRatio;
    }

    updateRotation() {
        this.transform = {
            ...this.transform,
            rotate: this.rotation
        };
    }
no_of_dd:any;
    set_form_styling(){
        this.no_of_dd=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
      setTimeout(() => { 
        $(".mat-form-field-appearance-fill .mat-form-field-flex").css('background','#fff');
        $(".select2-container .select2-selection--multiple").addClass('select2-container-important-rule');
        $(".select2-container .select2-selection--multiple").attr('style',
            'border-top: none !important;');
        //$(".select2-container .select2-selection--multiple").attr('style',
            //'border-radius: none !important;');
            // $(".select2-container .select2-selection--multiple").attr('style',
            // 'border-right:none !important;');
            // $(".select2-container .select2-selection--multiple").attr('style',
            // 'border-radius:none !important;'); 
            //border-left: none !important;border-radius: none !important;');
       }, 500);
    }
 imageUrl="";
 base64Image:any;
callImageBase(){
       var cors=""; 
    if (location.hostname.search("192.168")>=0 || location.hostname.search("tnt1")>=0){ 
         //cors="https://cors-anywhere.herokuapp.com/";  
    } 
    //this.imageUrl=cors+"https://s3-pullit-bucket.s3.us-west-2.amazonaws.com/dook/images/homeslider/rRvSc1611206659.jpg";

  
}

async callImageBase64 (url: string) {
    const result: any = await fetch (url);
    const blob = await result.blob (); 
    let reader = new FileReader ();
    reader.readAsDataURL (blob);
    reader.onload = () => {
        let r = Math.random().toString(36).substring(7);
    console.log (reader); 
    this.base64Image = reader.result;
    }
}

default_destImg=["https://cdn.getyourguide.com/img/tour/53343512e895d.jpeg/146.jpg",
"https://www.fabhotels.com/blog/wp-content/uploads/2018/09/places-vist-in-mumbai-600-1280x720.jpg",
"https://www.target-tours.com/heigh_lights/mumbai_day_banner.jpg",
"https://www.target-tours.com/heigh_lights/mumbai_day_banner.jpg",
"https://www.target-tours.com/heigh_lights/mumbai_day_banner.jpg",
"https://www.target-tours.com/heigh_lights/mumbai_day_banner.jpg",]
selectDestImg(url){
    this.normalImgCropping=false;
    this.imgName="img.jpeg";
     var cors=""; 
    if (location.hostname.search("192.168")>=0){ 
         cors="https://cors-anywhere.herokuapp.com/";  
    } 
    url=cors+url;
    this.callImageBase64(url);
                 this.open_crop_modal();
    return;
        const file = this.DataURIToBlob(this.base64Image);
        console.log(file);
        const formData = new FormData();
        formData.append('email_image', file ,'image.jpg')  //other param
        formData.append('path', 'temp/') //other param

        console.log(formData);
        const URL = window.URL || (window as any).webkitURL;
        const Img = new Image();
        Img.src = URL.createObjectURL(file);

        Img.onload = (e: any) => { 
              var height = e.path[0].height;
              var width = e.path[0].width;
              console.log(height,width);
              if(width < 800 && height < 500){
                this.errImage='Please select image of size greater than  800 X 500 Dimensions';
                this.popUpMsg = JSON.stringify('Please select image of size greater than 800 X 500 Dimensions');
                this.openDialog();
                 //alert('Please select image of size greater than 800 X 500');
              }else{ 
                console.log(file)
                 this.imageChangedEvent = event;
                 console.log(this.imageChangedEvent); 
                 this.imgName='event.target.files[0].name'; 
                 this.open_crop_modal();
              }
      }
    //     this.fileService.uploadFileTos3(formData).subscribe((data:any) => {
    //       if(data.image_url){ 
    //       console.log(data.image_url);             
    //       }          
    //       console.log(data);     
             
    // },(error)=>{
    //    this.popUpMsg=JSON.stringify('File unable to upload!');
    //         this.openDialog(); 
    // });  
}

 DataURIToBlob(dataURI: string) {
        const splitDataURI = dataURI.split(',')
        const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
        const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

        const ia = new Uint8Array(byteString.length)
        for (let i = 0; i < byteString.length; i++)
            ia[i] = byteString.charCodeAt(i)

        return new Blob([ia], { type: mimeString })
      }
itin_day:any;
itin_night:any;
 validate_days(evnt,day_type) {
    evnt.target.value = evnt.target.value.replace(/[^0-9-]/g, '');
    evnt.target.value = evnt.target.value.replace(/(\..*)\./g, '$1');
    var val=evnt.target.value ;
    if(day_type=='n' && val && val!=0){
        this.itin_day=parseInt(val)+1;        
    }else if(day_type=='d' && val && val!=0){
        this.itin_night=parseInt(val)-1;
    }else{
        this.itin_day=''; 
        this.itin_night='';
    }
    this.newtinerary.number_of_days=parseInt(this.itin_night)+1;
    
    this.set_days_array();
    return evnt.target.value;
  }  

 edit_validate_days(val,day_type) { 
    this.itin_night=val;
    if(day_type=='n' && val && val!=0){
        this.itin_day=parseInt(val)+1;        
    }else if(day_type=='d' && val && val!=0){
        this.itin_night=parseInt(val)-1;
    }else{
        this.itin_day=''; 
        this.itin_night='';
    }
    this.newtinerary.number_of_days=this.itin_night+1;
    this.set_days_array();
    //return evnt.target.value;
  }  


  autoDestList=[];
  destination_nameSearch="";
  selectedDestinationArray=[];
  selectedDestinationArrayData=[];
search_dest() {
    this.autoDestList = [];
    var val = this.destination_nameSearch; 
    if(val && val.length>2){
        this.opportunitieservice.SearchDestinations(val).subscribe((data: any) => {
          console.log(data);
          if (data && data.destination) {
            this.autoDestList = data.destination;
          } else {
            this.autoDestList = [];
          }
        });
    }else{
        this.autoDestList = [];
    }

  }

  selectDestId(dest_id){
     var d_avail=false;
    for(let des of this.autoDestList){
      console.log(des);
      if(des.id==dest_id){        
          if(this.selectedDestinationArray.length>0){
            console.log('1');

              for(let avail of this.selectedDestinationArray){
                if(avail.id==dest_id){ 
                  d_avail=true;
                }
                  
              }
           if(d_avail==false){

             this.selectedDestinationArray.push(des);
           }
          }else{
            console.log('0');
             this.selectedDestinationArray.push(des);
          }
      }
    }
   this.autoDestList=[];
   this.destination_nameSearch="";
    console.log(this.selectedDestinationArray);  
    this.renderDest(this.selectedDestinationArray);
    
  }
  removeDestin(dest_id){
    var i=-1;
    var index=i;

      for(let avail of this.selectedDestinationArray){
        i++;  
        if(avail.id==dest_id){ 
          index=i;
        } 
      }
      if(index>-1){
           this.selectedDestinationArray.splice(index, 1);

      }
      this.renderDest(this.selectedDestinationArray); 
  }


    renderDest(value) { 
        console.log(value);
        this.destinationToPullit=[];
        this.errDest="";       
        this.newtinerary.destination_id=[];
        this.newtinerary.destinations=value;
        this.daysDestinations=[];
        let i=0;  
         for(let dest of value){ 
           this.destinationToPullit.push(dest.geonameid);
            this.daysDestinations.push(
                {
                    'id':dest.id,
                    'name':dest.name,
                    'checked':false, 
                }
            );
            i++; 
           this.newtinerary.destination_id.push(dest.id);
         } 
        console.log(this.newtinerary.destination_id); 
        console.log(this.newtinerary.destinations); 
        this.newtinerary.destination_id=JSON.stringify(this.newtinerary.destination_id); 
       if(this.newtinerary.number_of_days > 1){
           this.set_days_array();
        }
        if(this.destinationToPullit.length>0){
            this.pullDestinationImages();
        }else{
            this.allDestPullImages=[];
            this.loadDestImage=[];
        }
    }
}
