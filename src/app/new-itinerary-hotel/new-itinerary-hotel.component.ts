import {Router, ActivatedRoute, Params, NavigationStart, NavigationEnd, NavigationError} from '@angular/router';
import {Component, OnInit, ChangeDetectorRef, ViewChild, Input,ElementRef} from '@angular/core';
import {NewItineraryService} from '../new-itinerary.service';

import {MatPaginator, MatSort, MatTableDataSource, MatDialog} from '@angular/material';
import {AlertBoxComponent} from '../alert-box/alert-box.component';
import {MessageService} from '../message.service';
import {Itinerary} from './itinerary';
import {Inclusion,Flights} from './itinerary';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import {base64ToFile} from 'ngx-image-cropper';
import { FormService } from '../service/form.service';
import { ExtraService } from '../service/extra.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-new-itinerary-hotel',
  templateUrl: './new-itinerary-hotel.component.html',
  styleUrls: ['./new-itinerary-hotel.component.css']
})
export class NewItineraryHotelComponent implements OnInit {
    showdivtitle = false;
    id: any;
    itineraryData: any;
    itinerary_days:any;
    all_poi: any;
    newActivity: Itinerary = new Itinerary();
    poiImageShow=0;

    constructor(private route: ActivatedRoute, private itineraryService: NewItineraryService,
                public dialog: MatDialog,private sanitizer: DomSanitizer, private msg: MessageService, private fService:FormService,private router: Router,private extraService:ExtraService) {

        this.id = this.route.snapshot.queryParams['id'];
        

         this.setdefaultAmenities();
        if(this.id>0){ 
		         this.msg.sendMessage('itinerary');
		       this.renderData();
		       this.newActivity=new Itinerary();
		       this.get_clock();
		       
        }else{
            this.popUpMsg = JSON.stringify('Create itinerary first!');
            this.openDialog();
            this.router.navigate(['/itineraryMain', { outlets: { itinerarySection: ['itineraries'] } }]);

        }
        var editable_id = this.route.snapshot.queryParams['edit'];
        if(editable_id){ 
           setTimeout(() => {
              this.openHtelEdit(editable_id)
                     }, 3000);
        }

    }

    destinationsList=[];
    allVehMode=[];
    more_Inclusion=[];
    accom_types=["Hotel", "Resort", "Homestay", "Farmstay", "Apartment", "Bed & Breakfast",
     "Campground", "Luxury Lodge", "Cruise", "Boat", "Motel", "Hostel", "Guesthouse"];
    add_more_inc(){
       console.log(this.itinerary_inclusions);

       this.more_Inclusion.push({
      id: this.more_Inclusion.length + 1,
      name: '',
      description:''
    });
    }
    format_rating(rate){ 
       var max_val= Math.ceil(rate);
       var rate_array=[];
       for(let i=0; i<max_val;i++){
        rate_array[i]=i;
       } 
       return rate_array;
    }
    setdefaultAmenities(){
    	 setTimeout(() => {
        this.newActivity.rating=0;
        this.newActivity.type="";
				    $(".angular-editor-textarea").css('height','200px');  
				    this.newActivity.amenities=[{
				        'checked':true,
				        'name' :'AC',
				        'icon': 'ac.png'},
				    {
				        'checked':true,
				        'name' :'Free parking',
				        'icon': 'parking.png'
				    },
				    {
				        'checked':true,
				        'name' :'Spa',
				        'icon': 'spa.png'
				    },
				    {
				        'checked':true,
				        'name' :'TV',
				        'icon': 'tv.png'
				    },
				    {                                 
				        'checked':true,
				         'name' :'Pool',
				         'icon': 'pool.png'
				     },
				    {
				        'checked':true,
				        'name' :'Conference hall',
				        'icon': 'conference.png'
				    },
				    {
				        'checked':true,
				        'name' :'Free WiFi',
				        'icon': 'wifi.png'
				    },
				    {
				        'checked':true,
				        'name' :'Gym',
				        'icon': 'gym.png'
				    },
				    {
				        'checked':true,
				        'name' :'Laundry service',
				        'icon': 'laundry.png'
				    },
				    {
				        'checked':true,
				        'name' :'Geyser',
				        'icon': 'geyser.png'
				    },
				    {
				        'checked':true,
				        'name' :'Bar / lounge',
				        'icon': 'bar.png'
				    }];
				    console.log(this.newActivity);
				    this.setAmenities();
        }, 300);  
    }
     setEditAmenities(){
       setTimeout(() => {
            $(".angular-editor-textarea").css('height','200px');  
            this.newActivity.amenities=[{
                'checked':false,
                'name' :'AC',
                'icon': 'ac.png'},
            {
                'checked':false,
                'name' :'Free parking',
                'icon': 'parking.png'
            },
            {
                'checked':false,
                'name' :'Spa',
                'icon': 'spa.png'
            },
            {
                'checked':false,
                'name' :'TV',
                'icon': 'tv.png'
            },
            {                                 
                'checked':false,
                 'name' :'Pool',
                 'icon': 'pool.png'
             },
            {
                'checked':false,
                'name' :'Conference hall',
                'icon': 'conference.png'
            },
            {
                'checked':false,
                'name' :'Free WiFi',
                'icon': 'wifi.png'
            },
            {
                'checked':false,
                'name' :'Gym',
                'icon': 'gym.png'
            },
            {
                'checked':false,
                'name' :'Laundry service',
                'icon': 'laundry.png'
            },
            {
                'checked':false,
                'name' :'Geyser',
                'icon': 'geyser.png'
            },
            {
                'checked':false,
                'name' :'Bar / lounge',
                'icon': 'bar.png'
            }];  
            this.setAmenities();
        }, 300);  
    }
    remove_more_inc(i: number){
         this.more_Inclusion.splice(i, 1);
    }
    download_itin(id){

         const elementToPrint = document.getElementById('it_prev');
        const pdf = new jsPDF('p', 'pt', 'a4');
        //const pdf = new jsPDF();
        pdf.internal.scaleFactor = 1.5;
        pdf.addHTML(elementToPrint, () => {
        pdf.save('Itinerary_'+this.itineraryData.name+'.pdf');
       });
     
       

}
droppedData: string;
drag_poi_id:any;
 
  isInclusion=0;
  itinerary_inclusions=[];
  hotelList=[];
  s3_url="";
  renderData(){

        this.scrollToTop();
        this.photo_name='';
        this.more_Inclusion=[];
        this.all_images=[]; 
         if(this.id) {
            this.itineraryService.getItineraryDetails(this.id).subscribe((data: any) => {
                console.log(data);
                if (data) {
                    this.itineraryData = data.itinerary;
                    this.itinerary_days=data.itinerary_days;
                    if(data.itinerary_flight){
                       this.flights=data.itinerary_flight;
                    }
                    this.allVehMode=data.vehicle_mode
                    this.destinationsList=this.itineraryData.destinations;  

                }
            });

            this.itineraryService.getHotelList(this.id).subscribe((data: any) => {
                console.log(data);
                if (data) {
                     this.hotelList=data.hotel_list;
                     this.s3_url=data.s3_url;
                     //alert(this.s3_url);
                }
            });
        }

         
    }
amenities_selected=[];
    setAmenities(){
    	this.amenities_selected=[];
    	console.log(this.newActivity.amenities);
    	for(let am of this.newActivity.amenities){
    		console.log(am);
    		if(am.checked==true){
    			this.amenities_selected.push(am.name);
    		}

    	}
    	console.log(this.amenities_selected);
    }
    editable_id=0;
    openHtelEdit(id){
    	this.editable_id=id;
      this.isLoading=true;
    	console.log(this.hotelList);
    	for(let ht of this.hotelList){
    		if(ht.id==id){
             this.newActivity.name=ht.name;
             this.newActivity.address=ht.name;
             this.newActivity.country=ht.country;
             this.newActivity.region=ht.state;
             this.newActivity.type=ht.type?ht.type:"";
             this.newActivity.rating=ht.rating?ht.rating:0;
             this.newActivity.description=ht.description;
             this.newActivity.destination=ht.destination_id;
              this.newActivity.itinerary_day_id=ht.itinerary_day_id;
              this.newActivity.itinerary_id=ht.id;
              this.hotel_image=this.s3_url+ht.image;
              this.img_nxt=false;
              this.img_bck=false;
             console.log(ht.amenities);
              if(ht.amenities){
                 this.newActivity.amenities=JSON.parse(ht.amenities);
              }else{
                // console.log('ht');
                // this.setEditAmenities();
              }
             console.log(this.newActivity.amenities);

    		}
    	}
      setTimeout(() => {
            this.isLoading=false;        
        }, 1600); 

    }
    enableAddForm(){
    	this.editable_id=0;
    	this.newActivity=new Itinerary();
    	this.setdefaultAmenities();
    	this.hotel_image="";
      this.photo_name="";
      $("#chooseFile").val("");
      this.img_nxt=true;
      this.img_bck=true;
    }
    edit_hotel(){ 
        this.newActivity.all_amenities=JSON.stringify(this.newActivity.amenities);
        for(var key in this.newActivity) {
            console.log(this.newActivity[key]); 
            this.form.set(key, this.newActivity[key]);
          } 
         console.log(this.form);  
        //  console.log(this.form.getAll()); 
        // for (let [key, value] of this.form) {
        //     console.log(`${key}: ${value}`)
        //   }
        //  return false;
    this.itineraryService.updateHotelItinerary(this.editable_id,this.form).subscribe((data: any) => {
                 this.renderData();
                  this.popUpMsg = JSON.stringify(data.message);
                  this.form=new FormData;
                  this.openDialog(); 
                 this.enableAddForm();
    });
    }
    itn_header:any;
    itn_footer:any;
allCategories=[];
    
    no_of_days = 0;

    get_no_of_days() {
        var date1 = this.itineraryData.start_date;
        var date2 = this.itineraryData.end_date;
        var diff = Math.abs(new Date(date1).getTime() - new Date(date2).getTime());
        var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
        this.no_of_days = diffDays;
        console.log(diffDays);
        this.daysDiv = [];

        if (diffDays > 0) {
            this.daysDiv = [];
            for (var i = 0; i <= diffDays; i++) {
                this.daysDiv.push(i + 1);
            }
        } else {
            this.daysDiv = [1, 2, 3];
        }
        console.log(this.daysDiv);

    }
    
    
    daysDiv: any;

    description_html='';
    itn_description='';
    ngOnInit() {

    }

    add_new_day() {
        this.daysDiv.push(6);
    }
get_format_date(myDate){
        var yy=myDate.getFullYear();
        var mon=myDate.getMonth()>9? myDate.getMonth():'0'+myDate.getMonth();
        var day=myDate.getDay()>9? myDate.getDay():'0'+myDate.getDay();
        var hr=myDate.getHours()>9? myDate.getHours():'0'+myDate.getHours();
        var min=myDate.getMinutes()>9? myDate.getMinutes():'0'+myDate.getMinutes();
        var r_date=yy+'-'+mon+'-'+day+' '+hr+':'+min;
       return r_date;

}
errName='';
errDesc='';
errpoi='';
errend='';
errst='';
errPhoto='';
fontawsome=[{
    'id':1,
    'name':'fa-map-marker',
},{
    'id':2,
    'name':'fa-tasks',
},{
    'id':3,
    'name':'fa-truck',
},{
    'id':4,
    'name':'fa-hotel',
},{
    'id':5,
    'name':'fa-plane',
}
    
];
hotelErr=[];
validateField(){
	this.hotelErr=[];
     if (!this.newActivity.name) {
            this.errName = 'Please add Hotel Name!';
            this.hotelErr.push(this.errName);
        } else {
            this.errName = '';
        }
     // if (!this.newActivity.description) {
     //        this.errDesc = 'Please add description!';
     //        this.hotelErr.push(this.errDesc);
     //    } else {
     //        this.errDesc = '';
     //    }
     if (!this.newActivity.destination || this.newActivity.destination=="") {
            this.errpoi = 'Please add destination!';
            this.hotelErr.push(this.errpoi);
        } else {
            this.errpoi = '';
        }
         if (!this.newActivity.country) {
            this.hotelErr.push('Please add country!');
        } 
         if (!this.newActivity.address) {
            this.hotelErr.push('Please add address!');
        } 
         if (!this.newActivity.type) {
            this.hotelErr.push('Please select accommodation type!');
        } 
     
     if (this.photo_name=='') {
            this.errPhoto = 'Please add  image!';
            this.hotelErr.push(this.errPhoto);
        } else {
            this.errPhoto = '';
        }

        if (this.hotelErr && this.hotelErr.length>0 ) {
          var myDiv = document.getElementById('newCreateitinerarymodal');
          myDiv.scrollTop = 0;
            return false;
        }

}
isTransport=0;


    showdaytitleform() {
        this.showdivtitle = true;
    }
    poiData=[];
    fetch_poi(id){
        for(let poi of this.poiData){
            //console.log(poi);
            if(poi.id==id){
                this.newActivity.poi_details=poi.point_name+','+poi.dest_name+','+poi.country_name;
                this.newActivity.poi_name=poi.point_name;
                this.newActivity.country=poi.country_name;
                this.newActivity.place_id=poi.place_id;
                this.newActivity.latitude=poi.latitude;
                this.newActivity.longitude=poi.longitude;
                this.newActivity.address=poi.address;
                this.newActivity.city=poi.dest_name;
                //console.log(poi.point_name);
                console.log(this.newActivity);
            }
        }
        this.poiData=[];
    }
searchPoi(ev){
     var loc_keywords=ev.target.value;
     if(ev.target.value.length >4){
        var data={'keyword':loc_keywords,'destinations':this.destinationsList};
              this.itineraryService.searchPoi(data).subscribe((data: any) => {
                    console.log(data);
                    if(data && data.poi){
                        this.poiData=data.poi;
                    }else{
                        this.poiData=[];
                    }
                  

                }, (err) => {
                    // this.popUpMsg = JSON.stringify(err);
                    // this.openDialog();
                });
    }else{
        this.poiData=[];
    }

}
toPoiData=[];
 

   
open_preview(){
$('#previewModal').css('display', 'block');

}
close_pre_modal(){
$('#previewModal').css('display', 'none');
}
popUpMsg:any;
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

      form = new FormData();
     photo:File;
  photo_name:any;
   addFIle2(files: FileList,isAvatar:boolean) {
    this.photo =files[0];
    console.log(this.photo.name);
    this.photo_name=this.photo.name;
   
    this.form.set("banner_image", this.photo);
    //this.newtinerary.banner_image=this.form;

    console.log(this.newActivity); 
    
    
  }  
    imageChangedEvent: any = '';
    croppedImage: any = '';
    canvasRotation = 0;
    rotation = 0;
    scale = 1;
    showCropper = false;
    containWithinAspectRatio = false;
    transform: ImageTransform = {};
;
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
      if(width < 400 && height < 250){
        this.errImage='Please select image of size greater than  400 X 400 Dimensions';
        this.popUpMsg = JSON.stringify('Please select image of size greater than 400 X 400 Dimensions');
        this.openDialog(); 
      }else{ 
         this.imageChangedEvent = event;
         console.log(this.imageChangedEvent); 
         this.imgName=event.target.files[0].name;
         console.log((this.banner.nativeElement as HTMLImageElement).width);
         this.open_crop_modal();
      }
  }

}

open_crop_modal(){

     $("#crop_model .overlay").css('background','none'); 

     $("#crop_model").css('display','block'); 
     $("#crop_model").addClass('show'); 
     $("#crop_model").css('z-index','99999'); 
}
close_crop(){
     $("#crop_model").removeClass('show'); 
     $("#crop_model").css('display','none');
      //this.croppedImage =''; 
}

  photoForm = new FormData();

  done_cropping(){

    //  if(this.editable_id){
    //      this.photoForm.set("banner_image", base64ToFile(this.croppedImage));
    //      this.photoForm.set("itinerary_id", ""+this.editable_id);
    //      console.log(this.photoForm);

    //     this.itineraryService.updateImage(this.photoForm).subscribe((data: any) => {
    //         console.log(data.banner_image);
    //         $('#edit_it_img').attr('src', data.banner_image);            
    //         this.popUpMsg = JSON.stringify(data.message);
    //         this.openDialog();
    //         this.renderData();

    //     }, (err) => {
    //         this.popUpMsg = JSON.stringify(err.message);
    //         this.openDialog();
    //     });
    // }
    // else{

    this.form.set("banner_image", base64ToFile(this.croppedImage)); 

        this.photo_name=this.imgName;   

    //}
    this.close_crop();

  }


    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
        console.log(event, base64ToFile(event.base64));
        this.hotel_image=this.croppedImage;
        this.img_nxt=false;
        this.img_bck=false;
    
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

  multiple_images=[];
   addMultiFIle(e) {
   
    //this.multiple_images.push(files[0]); 

    for (var i = 0; i < e.target.files.length; i++) { 
        console.log(e.target.files[i]);
      this.multiple_images.push(e.target.files[i]);
     // this.form.set("schedule_item_images[]", e.target.files[i]);
    }  
    //this.form.set("schedule_item_images", this.multiple_images);
    //this.newtinerary.banner_image=this.form;
    for (var i = 0; i < this.multiple_images.length; i++) { 
      // this.form.append("schedule_item_images", []);
    }
    console.log(this.form);    
    
  }
  get_category(id){
    for(let cat of this.allCategories ){
        if(cat.id==id){
            return cat.name; 
        }
    }
  }
  get_hours(s_date:any,e_date:any){ 
   // console.log(s_date,e_date);
    //this.get_clock();
    var date1=new Date(s_date);
    var date2=new Date(e_date);
    var hours = Math.abs(date2.valueOf() - date1.valueOf()) / 36e5;
    if(hours>0){
     if(hours>1){
          return hours+' hours';
     }else{        
         return hours+' hour';
     }
    }else{
        return '2 hours'; 
    }

  }
get_start(sta_date){ 
    var hh=new Date(sta_date).getHours();
    var mm=new Date(sta_date).getMinutes();
   var sTime= this.pad(hh) + ":" + this.pad(mm);
    return sTime;
}
pad(value) {
    if(value < 10) {
        return '0' + value;
    } else {
        return value;
    }
}
timesSet=[];
  get_clock(){
    var x = 30; //minutes interval
var times = []; // time array
var tt = 0; // start time
var ap = ['AM', 'PM']; // AM-PM

//loop to increment the time and push results in array
for (var i=0;tt<24*60; i++) {
  var hh = Math.floor(tt/60); // getting hours of day in 0-24 format
  var mm = (tt%60); // getting minutes of the hour in 0-55 format
  times[i] = ("0" + (hh % 24)).slice(-2) + '.' + ("0" + mm).slice(-2);// + ap[Math.floor(hh/12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]
  tt = tt + x;
}

this.timesSet=times;

console.log(times);   
  }
timesEnd=[];
  get_end_time(e){
//this.timesEnd=[];;
    
    var st=e.target.value;
    var h=parseInt(st.split('.')[0]);    
    var m=parseInt(st.split('.')[1]);  
    if(m==30){
        m=50;
    }
    var hm=parseFloat(h+'.'+m); 

    var min=hm*60;
    var x = 30; //minutes interval
    var times = []; // time array
    var tt = min+30; // start time
    var ap = ['AM', 'PM']; // AM-PM
    for (var i=0;tt<24*60; i++) {
      var hh = Math.floor(tt/60); // getting hours of day in 0-24 format
      var mm = (tt%60); // getting minutes of the hour in 0-55 format
      times[i] = ("0" + (hh % 24)).slice(-2) + '.' + ("0" + mm).slice(-2);// + ap[Math.floor(hh/12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]
      tt = tt + x;
   } 
console.log(times); 
this.timesEnd=times;
}
isHotel=0;
open_hotel_item(){
  this.create_new_activity_item(1);
   this.newActivity.category_id=4;
   this.isHotel=1;

}
open_flight_item(){   
        $('#newCreateflight').css('display', 'block');
}
close_flight_item(){   
        $('#newCreateflight').css('display', 'none');
}
open_inc_item(){
    $('#newCreateinclusion').css('display', 'block');
}
close_inc_item(){
    $('#newCreateinclusion').css('display', 'none');
}
open_inc_ex_item(){

}


inclusion=new Inclusion();
pick_inclusion(ev,id){
    //var id=ev.target.value;
    if(ev.target.checked){
      this.inclusion.itinerary_inclusions_id.push(id);
    }else{
        var index = this.inclusion.itinerary_inclusions_id.indexOf(id);
         this.inclusion.itinerary_inclusions_id.splice(index, 1);
    }
   console.log(this.inclusion.itinerary_inclusions_id);
}



accDays=[];
set_days(ev){
    var id=ev.target.value;
    if(ev.target.checked){
      this.accDays.push(id);
    }else{
        var index = this.accDays.indexOf(id);
         this.accDays.splice(index, 1);
    }
    console.log(this.accDays);
}
scrollToTop(){
		document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0;
}
set_rating(val){
       this.newActivity.rating=val;
       console.log(this.newActivity);
    }
errDays='';
add_hotel_to_itin(){


	this.hotelErr=[];
  if(this.accDays.length ==0){
		 // this.errDays="Please select day(s)!";
		 this.hotelErr.push("Please select day(s)!");
     this.isLoading=false;
         this.scrollToTop();
            return false;
  }else{
    this.errDays='';
    if(this.validateField()==false){
         this.scrollToTop();
         this.isLoading=false;
         return false;
    }
    var j=0;
    for(let dd of this.accDays){
      this.isLoading=true;
        j++;
        this.newActivity.itinerary_day_id=dd;
        this.newActivity.itinerary_id=this.id;

        this.newActivity.all_amenities=JSON.stringify(this.newActivity.amenities);
        for(var key in this.newActivity) {
           // console.log(this.newActivity[key]); 
            this.form.set(key, this.newActivity[key]);
          } 
         //console.log(this.newActivity); 

         // return;
        this.itineraryService.addHotelItinerary(this.form).subscribe((data: any) => {
          this.isLoading=false;
            console.log(data);
            this.newActivity=new Itinerary();
             this.form=new FormData;
            this.setdefaultAmenities();
            this.renderData();
            this.popUpMsg = JSON.stringify(data.message);
            this.openDialog(); 
            this.scrollToTop();
            this.hotel_image='';
            this.enableAddForm();
 
        }, (err) => {
            // this.popUpMsg = JSON.stringify(err);
            // this.openDialog();
        });
        

        if(this.accDays.length==j){
              this.accDays=[];
        }
        console.log(this.accDays,j+'--'+this.accDays.length);
    }
           

    }
  
}
hotel_list=[];
search_hotels(){
    this.hotel_list=[]; 
    if(this.newActivity.name  && this.newActivity.name.length >4){
       this.isLoading=true;
       this.itineraryService.search_hotels(this.newActivity.name).subscribe((data: any) => {
         console.log(data.results);
         this.isLoading=false;
        if(data && data.results){
            console.log(data.results.hotels);
            this.hotel_list=data.results.hotels;
        }
            
        }, (err) => { 
            this.isLoading=false; 
        });
   }else{

    this.hotel_list=[];
   }
}
delete_id=0;
open_delete_modal(id){
  this.delete_id=id;
}
delete_hotel(){ 
       this.itineraryService.delete_hotel(this.delete_id).subscribe((data: any) => {
         console.log(data);
         this.popUpMsg = JSON.stringify(data.message);
         this.openDialog();
         this.renderData();
            
        }, (err) => { 
        }); 
  
}
getGeoAddress(lat,lon){
    this.fService.getGeoAddress(lat,lon).subscribe((data:any)=>{
    	console.log(data.results); 
    	var results=data.results;
    	if(results && results.length >0){

        var indice=0;
        for (var j=0; j<results.length; j++)
        {
            if (results[j].types[0]=='locality')
                {
                    indice=j;
                    break;
                }
            }
       // alert('The good number is: '+j);
        console.log(results[j]);
      // var j=0;
        for (var i=0; i<results[j].address_components.length; i++)
            {
            	console.log(results[j].address_components[i]);
            	this.newActivity.address=results[j].formatted_address;
                if (results[j].address_components[i].types[0] == "locality") {
                        //this is the object you are looking for City
                        var city = results[j].address_components[i];
                        this.newActivity.city=city.long_name;
                        this.set_destination(this.newActivity.city);
                    }
                if (results[j].address_components[i].types[0] == "administrative_area_level_1") {
                        //this is the ob0ect you are looking for State
                        var region = results[j].address_components[i];
                        this.newActivity.region=region.long_name;
                    }
                if (results[j].address_components[i].types[0] == "country") {
                        //this is the ob0ect you are looking for
                       var country = results[j].address_components[i];
                        this.newActivity.country=country.long_name;
                    }
            }

            //city data
            //alert(city.long_name + " || " + region.long_name + " || " + country.long_name)


            } else {
            	this.newActivity.country='';
            	this.newActivity.address='';
            	this.newActivity.region='';
            	this.newActivity.city='';
              
            }
       
    },
    error =>{
      console.log("ERROR " + JSON.stringify(error));
    } );
}

set_destination(city){
	console.log(city);
	for(let des of this.destinationsList){
		console.log(des.name);
		if(des.name==city){
			this.newActivity.destination=des.id;
		}
	}

}
img_start=1;
img_nxt=true;
img_bck=true;
change_hotel_image(){
	console.log(this.img_start);
	this.img_start=this.img_start+1;
	if(this.img_start <5){
		this.hotel_image="https://photo.hotellook.com/image_v2/limit/h"+this.h_id+"_"+this.img_start+"/800/360.auto";
        this.callImageBase64(this.hotel_image);
	}
    
	console.log(this.hotel_image)            
}
back_image(){
	if(this.img_start >1){
	  this.img_start=this.img_start-1;
      this.hotel_image="https://photo.hotellook.com/image_v2/limit/h"+this.h_id+"_"+this.img_start+"/800/360.auto";
      this.callImageBase64(this.hotel_image);
	}
	console.log(this.hotel_image)
}
h_id="";
hotel_image="";
all_images=[];
img_count=[1,2,3,4,5];
fetch_hotel_details(hotel_data){
    console.log(hotel_data);
    this.hotel_list=[];

                this.newActivity.poi_name=hotel_data.label;
                this.newActivity.name=hotel_data.label;
                //this.newActivity.country=hotel_data.country_name;
                this.newActivity.place_id=hotel_data.locationId;
                this.newActivity.latitude=hotel_data.location.lat;
                this.newActivity.longitude=hotel_data.location.lon;
                this.newActivity.address="";
                this.newActivity.poi_details=hotel_data.locationName; 
                if(this.newActivity.latitude && this.newActivity.longitude){
                	this.getGeoAddress(this.newActivity.latitude,this.newActivity.longitude);
                }
                this.h_id=hotel_data.id;
                var cc=0;
                this.all_images=[];
                for(let cnt of this.img_count){
 
                  var img_url=this.hotel_image="https://photo.hotellook.com/image_v2/limit/h"+hotel_data.id+"_"+cnt+"/800/360.auto";
                   this.all_images.push(img_url);
                   if(cc==0){
                    this.hotel_image="https://photo.hotellook.com/image_v2/limit/h"+hotel_data.id+"_1/800/360.auto";
                    this.callImageBase64(this.hotel_image);
                  }
                   cc++;
                }
               setTimeout(() => {
                     $("#htl_chk_0").attr('checked','true');
                     $("#htl_chk_0").parent().addClass('htl-brder');
                }, 200);

        this.img_nxt=true;
        this.img_bck=true;
               // this.newActivity.city=hotel_data.dest_name;
}
set_hotel_img(img_url,i){
  $(".selectHotelimgCheckbox").removeClass('htl-brder');
   $("#htl_chk_"+i).parent().addClass('htl-brder');
   this.callImageBase64(img_url);
}
base64Image:any;
isLoading=false;
callImageBase64(url){
      
       this.itineraryService.image_base64(url).subscribe((data: any) => {
         console.log(data); 

         if(data && data.base64){
          this.base64Image = data.base64;
          this.croppedImage=this.base64Image;

          this.form.set("banner_image", base64ToFile(this.croppedImage)); 
          console.log(this.form);
          var imgName = this.newActivity.name.replace(/\s+/g, '-').toLowerCase();
          this.photo_name=imgName+'.jpg'; 
          console.log(this.base64Image.substring("data:image/".length, this.base64Image.indexOf(";base64")))

         }

          
            
        }, (err) => { 
        }); 
}
async callImageBase642 (url: string) { 
  console.log(url);
	 var cors=""; 
    if (location.hostname.search("localh")>=0){ 
        // cors="https://cors-anywhere.herokuapp.com/";  
    } 
    url=cors+url;
    const result: any = await fetch (url);
    const blob = await result.blob (); 
    let reader = new FileReader ();
    reader.readAsDataURL (blob);
    reader.onload = () => {
        let r = Math.random().toString(36).substring(7);
    console.log (reader); 
    this.base64Image = reader.result;
    this.croppedImage=this.base64Image;

    this.form.set("banner_image", base64ToFile(this.croppedImage)); 
    console.log(this.form);
    var imgName = this.newActivity.name.replace(/\s+/g, '-').toLowerCase();
    this.photo_name=imgName+'.jpg'; 
    console.log(this.base64Image.substring("data:image/".length, this.base64Image.indexOf(";base64")))

    }
}
create_new_activity_item(id) {
        this.newActivity=new Itinerary();
        this.poiData=[];
        this.newActivity.itinerary_day_id=id;
        this.newActivity.category_id=1;
        this.photo_name='';
        $('#newCreateitinerarymodal').css('display', 'block');
    }
tab_form(id,name){
    console.log(id,name);
    this.newActivity.category_id=id;
    if(id==3){
        this.isTransport=1;
    }else{
        this.isTransport=0;
    }
    if(id==4){
        //this.isHotel=1;
    }else{
       // this.isHotel=0;
    }
}
get_city(schedule){
    var city=[];
    for(let sched of schedule){
            if(sched.city!="undefined"){
                if(city.indexOf(sched.city)>-1){

                }else{
                    city.push(sched.city);
                }

            }
    }
   // console.log(city.join());
    return city.join();
}

flights=new Flights();
add_flight(){

    this.flights.itinerary_id=this.id;
    if(this.flights.id!=undefined && this.flights.id>0){
        //alert('edit');
        this.itineraryService.UpdateFlight(this.flights,this.flights.id).subscribe((data: any) => {
            console.log(data);
            
            this.popUpMsg = JSON.stringify(data.message);
            this.openDialog();
            this.close_flight_item();
             this.renderData();
 
        }, (err) => {
            // this.popUpMsg = JSON.stringify(err);
            // this.openDialog();
        });
    }else{
        this.itineraryService.addFlight(this.flights).subscribe((data: any) => {
            console.log(data);
            
            this.popUpMsg = JSON.stringify(data.message);
            this.openDialog();
            this.close_flight_item();
             this.renderData();
 
        }, (err) => {
            // this.popUpMsg = JSON.stringify(err);
            // this.openDialog();
        });
    }

    //return false;   
      

}
depTitleErr='';
depfrmAirErr='';
deptoAirErr='';
arrTitleErr='';
arrfrmAirErr='';
arrtoAirErr='';
validate_flight(){
    this.depTitleErr='';
    this.depfrmAirErr='';
    this.deptoAirErr='';
    this.arrTitleErr='';
    this.arrfrmAirErr='';
    this.arrtoAirErr='';
    if(this.flights.departure_title=='' || this.flights.departure_title==undefined){
        this.depTitleErr='Please add tittle!';
    }else{
        this.depTitleErr='';
    }

    if(this.flights.from_airport_name=='' || this.flights.from_airport_name==undefined){
        this.depfrmAirErr='Please add airport!';
    }else{
        this.depfrmAirErr='';
    }
    if(this.flights.to_airport_name=='' || this.flights.to_airport_name==undefined){
        this.deptoAirErr='Please add airport!';
    }else{
        this.deptoAirErr='';
    }
    if(this.flights.arrival_title=='' || this.flights.arrival_title==undefined){
        this.arrTitleErr='Please add tittle!';
    }else{
        this.arrTitleErr='';
    }

    if(this.flights.arr_from_airport_name=='' || this.flights.arr_from_airport_name==undefined){
        this.arrfrmAirErr='Please add airport!';
    }else{
        this.arrfrmAirErr='';
    }
    if(this.flights.arr_to_airport_name=='' || this.flights.arr_to_airport_name==undefined){
        this.arrtoAirErr='Please add airport!';
    }else{
        this.arrtoAirErr='';
    }
   console.log(this.flights);
    if (this.arrtoAirErr || this.arrfrmAirErr || this.arrTitleErr || this.deptoAirErr 
        || this.depfrmAirErr || this.depTitleErr ) {
          var myDiv = document.getElementById('newCreateflight');
          myDiv.scrollTop = 0;
            return false;
        }else{
           this.add_flight();
        }
}
 airportData=[];
    airportDataDepFrom=[];
    airportDataDepTo=[];
    airportDataRetFrom=[];
    airportDataRetTo=[];
    searchAirport(ev,f_type){
     var loc_keywords=ev.target.value;
     if(ev.target.value.length >4){
        var data={'keyword':loc_keywords,'destinations':this.destinationsList};
              this.itineraryService.searchAirport(data).subscribe((data: any) => {
                    console.log(data);
                    if(data && data.airport){
                        if(f_type=='dep_from'){
                            this.airportDataDepFrom=data.airport;
                        }
                        if(f_type=='dep_to'){
                            this.airportDataDepTo=data.airport;
                        }
                        if(f_type=='ret_from'){
                            this.airportDataRetFrom=data.airport;
                        }
                        if(f_type=='ret_to'){
                            this.airportDataRetTo=data.airport;
                        }
                        this.airportData=data.airport;
                    }else{
                        this.airportData=[];
                        this.airportDataDepFrom=[];
                        this.airportDataDepTo=[];
                        this.airportDataRetFrom=[];
                        this.airportDataRetTo=[];
                    }
                  

                }, (err) => {
                    // this.popUpMsg = JSON.stringify(err);
                    // this.openDialog();
                });
    }else{
        this.airportData=[];
    }

}

}
