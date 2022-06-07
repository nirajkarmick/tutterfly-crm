import {Router, ActivatedRoute, Params, NavigationStart, NavigationEnd, NavigationError} from '@angular/router';
import {Component, OnInit, ChangeDetectorRef, ViewChild, Input,ElementRef} from '@angular/core';
import {NewItineraryService} from '../new-itinerary.service';

import {MatPaginator, MatSort, MatTableDataSource, MatDialog} from '@angular/material';
import {AlertBoxComponent} from '../alert-box/alert-box.component';
import {MessageService} from '../message.service';
import {Itinerary,CopyItinerary} from './itinerary';
import * as moment from 'moment';
import { Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import {base64ToFile} from 'ngx-image-cropper';

@Component({
  selector: 'app-new-itinerary-list',
  templateUrl: './new-itinerary-list.component.html',
  styleUrls: ['./new-itinerary-list.component.css']
})
export class NewItineraryListComponent implements OnInit {

    activeUrl: any;
    allItinerary: any;
    newtinerary: Itinerary = new Itinerary();
    copyitinery: CopyItinerary = new CopyItinerary();
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
    public term = '';
    // date_or_days=true;
    opp_id:any

    constructor(private route: ActivatedRoute, private itineraryService: NewItineraryService,
                public dialog: MatDialog, private msg: MessageService, private router: Router) {
        this.msg.sendMessage('itinerary');
        this.opp_id = this.route.snapshot.queryParams['opp_id'];
        router.events.subscribe((event) => {

            if (event instanceof NavigationEnd) {
                console.log(this.router.url);
                var routes = this.router.url.split(':');
                this.activeUrl = routes[1].split(')')[0];
                console.log(this.activeUrl);
                if(window.location.hash) {
                  this.isPreview=false;
                  //this.open_preview(window.location.hash.substring(1));
                  // Fragment exists
                } else {
                   $('#previewModal').css('display', 'none');
                  // Fragment doesn't exist
                }
            }
        }); 
        this.destinationOptions = { 
            multiple: true,
            tags: true
        };
       this.renderData();
    }

    oppData:any; 
    curr_page = 2;
    totalData=0;
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
search_itin(evnt) { 
    var val = evnt.target.value;

    console.log(val.length);
    if(val.length>1){
      this.itineraryService.search_itin(val).subscribe((data: any) => {
      console.log(data);
      if (data && data.itineraries) {
        this.allItinerary = data.itineraries;
        this.totalCurrent=this.allItinerary.length;
        this.totalData=0;
      } else {
        this.allItinerary = [];
       this.totalCurrent=0;
        this.totalData=0;
      }


    });
    }else{
       this.renderData();
    }
    

}
show_content_msg=false;
renderData(){

this.deleted_name="";
this.deleted_id="";
         this.itineraryService.getAllItinerary().subscribe((data: any) => {
            this.curr_page=2;  
            if (data) {
                this.totalData=data.total;
               // alert(this.totalCurrent);
                this.totalCurrent=10;
                this.destination_list = data.destinations;
                this.timezoneList = data.timezones;
                this.allItinerary = data.itineraries; 
                if(this.allItinerary.length==0){
                    this.show_content_msg=true;
                }                  
                if(this.opp_id && this.opp_id>0){
                    this.itineraryService.getOpp(this.opp_id).subscribe((res: any) => {
                    console.log(res);
                    if (res) {
                        this.oppData=res.opportunity;
                        this.open_new_trip_opp(this.oppData);
                    }
                   });
                }
            }else{

            }
        });
        
    }
    open_new_trip_opp(oppData){
        this.opp_id=0; 
        this.newtinerary=new Itinerary();
        var x=0; 
        var sel_dest=[];
        setTimeout(() => {    
            console.log(oppData);
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
            this.newtinerary.number_of_days=parseInt(oppData.no_of_nights);
         }, 1000);
        this.editable_id=0;
        this.photo_name='';
        this.newtinerary.date_or_days=0; 

    
    }
    timezoneList:any;
    open_new_trip() {
        
        $('#newCreateitinerarymodal').css('display', 'block');
        this.destinationData=[];
        if (this.destination_list != undefined) {
            let i = 0;
            for (let e of this.destination_list) {
                this.destinationData.push({'id': e.id, 'text': e.name.trim()});
                i++;
            }
            this.editable_id=0;
            this.photo_name='';
            this.newtinerary=new Itinerary();
            this.newtinerary.date_or_days=0;

            this.ngOnInit();

         }
    }
    editable_id=0;
    EditItinerary(){
        //alert(this.editable_id);
    }
    itineraryData=[];
    itinerary_days:any;
    flights:any;
    user_itinerary_inclusion="";
    s3_url="";
    isPreview=false;
    open_preview(id){ 
        window.location.hash = id; 
       this.isPreview=false;
       this.itinerary_days=[];
        this.itineraryService.getItineraryDetails(id).subscribe((data: any) => {
                console.log(data);
                if (data) {                   
                    this.itineraryData = data.itinerary;
                    this.s3_url=data.s3_url;
                    this.itinerary_days=data.itinerary_days;
                    //return;
                    this.set_days_items();
                    if(data.itinerary_flight){
                       this.flights=data.itinerary_flight;
                    }
                    if (data && data.user_itinerary_inclusion) {
                        this.user_itinerary_inclusion=data.user_itinerary_inclusion;
                    }      
                        this.isPreview=true;               
                    setTimeout(() => { //alert('f');  
                         console.log(this.itineraryData);
                         $('#previewModal').css('display', 'block');
                    }, 500);
                }
        });
    }
set_days_items(){ 
    var poi_items=[];
    var trans_items=[];
    var no_activity_items=[];
    if(this.itinerary_days && this.itinerary_days.length>0){
        for(let i=0;i<this.itinerary_days.length;i++){
            this.itinerary_days[i].poi_items=[];
            this.itinerary_days[i].trans_items=[];
            this.itinerary_days[i].no_activity_items=[];
            console.log(this.itinerary_days[i]);
            for(let j=0;j<this.itinerary_days[i].schedule_items.length;j++){
               if(this.itinerary_days[i].schedule_items[j].category_id==1){ 
                this.itinerary_days[i].poi_items.push(this.itinerary_days[i].schedule_items[j]);  
               }
               if(this.itinerary_days[i].schedule_items[j].category_id==2){ 
                this.itinerary_days[i].trans_items.push(this.itinerary_days[i].schedule_items[j]); 
               }
               if(this.itinerary_days[i].schedule_items[j].category_id==6){ 
                this.itinerary_days[i].no_activity_items.push(this.itinerary_days[i].schedule_items[j]); 
               }
           } 
        }
    } 
    console.log(this.itinerary_days);
}
    close_pre_modal(){

        window.location.hash = '';
        $('#previewModal').css('display', 'none');
    }
    dest_selected=[];
    time_selected=[];
    editbanner_image:any
    open_edit(id) {  
        this.opp_id=0;  
        $('#itinerarydatepiker .mat-form-field-underline').css('display', 'none');
        this.editable_id=id;

        $('#newCreateitinerarymodal').css('display', 'block');
        this.destinationData=[];
        this.newtinerary.destination_id=[]; 
            if (this.destination_list != undefined) {
                let i = 0;
                 for (let e of this.destination_list) {
                    this.destinationData.push({'id': e.id, 'text': e.name});
                    i++;
                }
            } 
        
        this.itineraryService.getItineraryEdit(id).subscribe((data: any) => {
            if (data) { 
                var intDet=data.itinerary;
                this.newtinerary.name=intDet.name;
                this.newtinerary.amount=intDet.amount;
                this.editbanner_image=intDet.banner_image;
                this.newtinerary.timezone="" +intDet.timezone;
                this.newtinerary.date_or_days=intDet.date_or_days;
                this.newtinerary.description=intDet.description;
                var x=0;
                var sel_dest=[];
                var sel_dest2=[];
                for(let dd of intDet.destinations){ 
                    sel_dest.push("" +dd); 
                    sel_dest2.push({'id':dd.id,'text':dd.name});
                 console.log(dd);
                    x++;
                } 
                 console.log(sel_dest2);

                 setTimeout(() => {
                     this.dest_selected=sel_dest2;
                     this.newtinerary.destination_id=this.dest_selected;
                 }, 500);
                 //this.newtinerary.destination_id=[{'id':69,'text':'Agra'}];
                 console.log(this.newtinerary.destination_id); 
                this.newtinerary.end_date=intDet.end_date;
                this.newtinerary.number_of_adults=intDet.number_of_adults;
                this.newtinerary.number_of_childrens=intDet.number_of_childrens;
                this.newtinerary.number_of_days=intDet.number_of_days;
                this.newtinerary.number_of_travellers=intDet.number_of_travellers;
                this.newtinerary.start_date=intDet.start_date; 
                this.set_date_range(this.newtinerary.date_or_days);
                this.newtinerary.day_destinations=[];

            }
        });

        if (this.destination_list != undefined) { 
            let j = 0;
            for (let e of this.timezoneList) {
                this.timezoneData.push({'id': e, 'text': e});
                j++;
            } 
        }
        $('#newCreateitinerarymodal').css('display', 'block');

    }

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
        this.close_itinerarydatepiker();
        this.resetForm();
    }
resetForm(){    
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
            endDate: moment(),
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
    
    renderNewView(value) {        
        this.newtinerary.destination_id=value;
        console.log(this.newtinerary.destination_id);
    }
    renderNewViewDest(value) {        
        this.newtinerary.destination_id=value;
        if(value && value.length>0){
            for(let des_id of value){
                //this.newtinerary.destination_id.push({dest_id:des_id.id});
                 //this.newtinerary.destination_id.push(des_id.id);              

            }
        } 
        console.log(this.newtinerary.destination_id);
    }
    errTime:any;
    errDest:any;
    errDesc:any;
    errDays:any;
    createnewItinerary() {
        console.log(this.newtinerary);

        if (!this.newtinerary.name) {
            this.errName = 'Please add Name!';
        } else {
            this.errName = '';
        }
        if(this.photo_name=='' && this.editable_id==0){
            this.errImage = 'Please select Image!';
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
       if (!this.newtinerary.destination_id) {
            this.errDest = 'Please add Destination!';
        } else {
            this.errDest = '';
        }
       if (!this.newtinerary.description) {
            this.errDesc = 'Please add Desription!';
        } else {
            this.errDesc = '';
        }
        if(this.newtinerary.date_or_days==0 && this.newtinerary.number_of_days==0){
              this.errDays = 'Please add Number of Days!';
        }else{
             this.errDays = '';
        }
        
        if (this.errName  || this.errStart || this.errEnd ||this.errDays || this.errDesc || this.errDest || this.errImage) {
          var myDiv = document.getElementById('newCreateitinerarymodal');
          myDiv.scrollTop = 0;
            return false;
        }
        for(var key in this.newtinerary) {
            console.log(this.newtinerary[key]); 
            this.form.set(key, this.newtinerary[key]);
        } 


        this.itineraryService.CreateBasicItinerary(this.form,this.editable_id,this.newtinerary).subscribe((data: any) => {
           // console.log(data);
            if (data && data.itinerary) {
                this.router.navigate(['/itineraryMain', {outlets: {itinerarySection: ['itinerary-builder']}}], {queryParams: {'id': data.itinerary.id}});
            }
            this.popUpMsg = JSON.stringify(data.message);
            this.openDialog();
            this.close_ite_modal();
            this.renderData();

        }, (err) => {
            this.popUpMsg = JSON.stringify(err.message);
            this.openDialog();
        });
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
        endDate: moment(),
    };
    chosenDate(val: { chosenLabel: string;}){
            console.log(val);
    }
    ngModelChange(e) {
        console.log(this.selected);
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

    }  

    change(e): void {
      //  console.log(this);
        console.log(moment(e.startDate));
    }
    setRange(){
            $(".md-drppicker.double").css('width','500px');
    }

    down_days(val){
            if(this.newtinerary.number_of_days!=0){
                this.newtinerary.number_of_days=this.newtinerary.number_of_days-1;
            }
            
    }
    up_days(val){
        this.newtinerary.number_of_days=this.newtinerary.number_of_days+1;
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

  done_cropping(){

     if(this.editable_id){
         this.photoForm.set("banner_image", base64ToFile(this.croppedImage));
         this.photoForm.set("itinerary_id", ""+this.editable_id);
         console.log(this.photoForm);

        this.itineraryService.updateImage(this.photoForm).subscribe((data: any) => {
            console.log(data.banner_image);
            $('#edit_it_img').attr('src', data.banner_image);            
            this.popUpMsg = JSON.stringify(data.message);
            this.openDialog();
            this.renderData();

        }, (err) => {
            this.popUpMsg = JSON.stringify(err.message);
            this.openDialog();
        });
    }else{

    this.form.set("banner_image", base64ToFile(this.croppedImage)); 

        this.photo_name=this.imgName;  

    }
    this.close_crop();

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
    send_itin_id='';
    itineraryEmailId="";
    open_sendEmail=false;
    open_send_itin(id){
        this.send_itin_id=id;
        this.open_sendEmail=true;
        this.send_itin_msg="";
    }
    send_itin_msg="";
    send_itin_email(form: any){ 
        this.send_itin_msg="";
        if(this.itineraryEmailId==""){
         this.popUpMsg=JSON.stringify("Please add email id");
         this.openDialog();
        }else{
         //'niraj.gupta@watconsultingservices.com'
         this.itineraryService.send_itin_email(this.itineraryEmailId,this.send_itin_id).subscribe((data: any) => {
            console.log(data);
            this.open_sendEmail=false;
            this.popUpMsg=JSON.stringify(data.message); 
            this.openDialog();
            this.close_em_mail();
            this.send_itin_msg="";
            

        }, (err) => {
            console.log(err);
            this.send_itin_msg=err.error.message;

        });
      }
    }
    save_to_drive(id){ 
       
    }
    close_em_mail(){ 
        this.send_itin_id='';
        this.itineraryEmailId="";
        this.open_sendEmail=false; 
        $('body').removeClass('modal-open');
        $('body').css('padding-right',0);
        $('.modal-backdrop').remove(); 
    }

    open_copyitin=false;
    copybanner_image:any;
    copy_id=0;
    copy_dest_selected=[];
    copy_day_ids=[];
    open_copy_itin(id){
            this.resetForm();
            this.destinationData=[];
            this.copy_day_ids=[];
            this.newtinerary.destination_id=[]; 
                if (this.destination_list != undefined) {
                    let i = 0;
                     for (let e of this.destination_list) {
                        this.destinationData.push({'id': e.id, 'text': e.name});
                        i++;
                    }
                } 
            this.open_copyitin=true;
            this.copy_id=id;
                this.itineraryService.getItineraryEdit(id).subscribe((data: any) => {
                    if (data) { 
                        var intDet=data.itinerary;
                        this.copyitinery.name=intDet.name; 
                        this.copyitinery.itinerary_id=id; 
                        this.copybanner_image=intDet.banner_image; 
                        this.copyitinery.description=intDet.description;
                        this.copyitinery.itinerary_days=data.itinerary_days;
                         console.log(this.copyitinery.itinerary_days);
                         let jj=1;
                        for(let dys of this.copyitinery.itinerary_days){
                            var d_data={'id':dys.id,'checked':true,
                            'day_name':dys.day_name,'day_number':jj,'type':'old'};
                            this.copy_day_ids.push(d_data);
                            jj++;
                        }  
                        var x=0;
                        var sel_dest=[];
                        var sel_dest2=[];
                        for(let dd of intDet.destinations){ 
                            sel_dest.push("" +dd); 
                            sel_dest2.push({'id':dd.id,'text':dd.name});
                         console.log(dd);
                            x++;
                        } 
                         console.log(sel_dest2);

                         setTimeout(() => {
                             this.copy_dest_selected=sel_dest2;
                             this.copyitinery.destination_id=this.copy_dest_selected;
                         }, 500);  

                    }
                });

                if (this.destination_list != undefined) { 
                    let j = 0;
                    for (let e of this.timezoneList) {
                        this.timezoneData.push({'id': e, 'text': e});
                        j++;
                    } 
                }
        
    }
set_days(evnt){

}
add_copy_days(){
    let d_no=1;
    let kk=1;
    for(let dys of this.copy_day_ids){
       if(kk==this.copy_day_ids.length){
          d_no=kk+1;
       }
       kk++;
    } 
    var d_data={'id':0,'checked':true,'day_name':'Day '+d_no,'day_number':d_no,'type':'new'};
    this.copy_day_ids.push(d_data);
}
checkDays(){

    let d_avail=false;
    let kk=1;
    for(let dys of this.copy_day_ids){
       if(dys.checked==true){
          d_avail=true;
       }
       kk++;
    } 
    return d_avail;
}
    copy_form = new FormData();
    copyitineryDetails() {
        console.log(this.copyitinery);

        if (!this.copyitinery.name) {
            this.errName = 'Please add Name!';
        } else {
            this.errName = '';
        }
         
       if (!this.copyitinery.description) {
            this.errDesc = 'Please add Desription!';
        } else {
            this.errDesc = '';
        }
        if(this.checkDays()){            
            this.errDays = '';
        }else{
            this.errDays = 'Please Select days';
        }
        if (this.errName    || this.errDesc || this.errDays) { 
            return false;
        }
        this.copyitinery.day_ids=this.copy_day_ids;
        for(var key in this.copyitinery) {
            console.log(this.copyitinery[key]); 
            this.copy_form.set(key, this.copyitinery[key]);
        }   
        console.log(this.copy_form);
        console.log(this.copyitinery); 
        this.itineraryService.CopyItinerary(this.copyitinery).subscribe((data: any) => {
           // console.log(data);
            if (data && data.itinerary) {
                this.router.navigate(['/itineraryMain', {outlets: {itinerarySection: ['itinerary-details']}}], {queryParams: {'id': data.itinerary.id}});
            }
            this.popUpMsg = JSON.stringify(data.message);
            this.openDialog();
            this.close_ite_modal();
            this.renderData();
            this.resetForm();

        }, (err) => {
            this.popUpMsg = JSON.stringify(err.message);
            this.openDialog();
        });
    }


    renderCopyDest(value) {        
        this.copyitinery.destination_id=value;
        
        console.log(this.copyitinery.destination_id);   
    }
deleted_name="";
deleted_id="";
open_delete(id,name){
  this.deleted_id=id;
  this.deleted_name=name;
}
deleteItin(){
   
        this.itineraryService.DeleteItinerary(this.deleted_id).subscribe((data: any) => {
          
            this.popUpMsg = JSON.stringify(data.message);
            this.openDialog();
            this.renderData();
 
        });
}
}
