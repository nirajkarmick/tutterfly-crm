import {ActivatedRoute, Router ,NavigationStart, NavigationEnd, NavigationError} from "@angular/router";
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {NewItineraryService} from "../new-itinerary.service";

import {MatDialog} from "@angular/material";
import {AlertBoxComponent} from "../alert-box/alert-box.component";
import {MessageService} from "../message.service";
import {Flights, Inclusion, Itinerary} from "./itinerary";
import * as jsPDF from "jspdf";
import {base64ToFile, Dimensions, ImageCroppedEvent, ImageTransform} from "ngx-image-cropper";

@Component({
    selector: 'app-new-itinerary-details',
    templateUrl: './new-itinerary-details.component.html',
    styleUrls: ['./new-itinerary-details.component.css']
})
export class NewItineraryDetailsComponent implements OnInit {
    showdivtitle = false;
    id: any;
    itineraryData: any;
    itinerary_days: any;
    all_poi: any;
    newActivity: Itinerary = new Itinerary();
    poiImageShow = 0;
  public destOptions: Select2Options;

isLoading=true;

    constructor(private route: ActivatedRoute, private itineraryService: NewItineraryService,
                public dialog: MatDialog, private msg: MessageService, private router: Router) {

                router.events.subscribe((event) => {
                    if (event instanceof NavigationStart) {
                        console.log('st');
                    }
                    if (event instanceof NavigationEnd) {
                        console.log(window.location.hash);
                        if(window.location.hash && window.location.hash=='#preview') {
                           $('#previewModal').css('display', 'block');
                          // Fragment exists
                        } else {
                           $('#previewModal').css('display', 'none');
                          // Fragment doesn't exist
                        }
                    }
                });
        this.destOptions = { 
            multiple: true,
            tags: false
        };
                this.id = this.route.snapshot.queryParams['id'];
                this.msg.sendMessage('itinerary');
                this.renderData();
                this.newActivity = new Itinerary();
                this.get_clock();

            }

    destinationsList = [];
    allVehMode = [];
    more_Inclusion = [];

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

    download_itin(id) {

        const elementToPrint = document.getElementById('it_prev');
        const pdf = new jsPDF('p', 'pt', 'a4');
        //const pdf = new jsPDF();
        pdf.internal.scaleFactor = 1.5;
        pdf.addHTML(elementToPrint, () => {
            pdf.save('Itinerary_' + this.itineraryData.name + '.pdf');
        });


    }

    droppedData: string;
    drag_poi_id: any;

    dragEnd(event, poi_id) {
        //alert(poi_id);
        console.log('Element was dragged', poi_id);
        this.drag_poi_id = poi_id;
    }

    drop_on_days(id) {
        //alert(id);
        this.add_poi(this.drag_poi_id, id);
    }

    isInclusion = 0;
    itinerary_inclusions = [];
    s3_url="";
    pdf_file="";
pdf_list=[];
    allDestinations=[];
    destinations_list=[];
    renderData() {        
        $('body').removeClass('modal-open');
$('body').css('padding-right',0);
        $('.modal-backdrop').remove();

        this.isLoading=true;
        this.pdf_loader=false; 
        this.form = new FormData();
        this.more_Inclusion = [];
        if (this.id) {
            this.itineraryService.getItineraryDetails(this.id).subscribe((data: any) => {

             
             setTimeout(() => {
                this.isLoading=false;
                     }, 1000);
                console.log(data);
                if (data) {
                    this.itineraryData = data.itinerary;
                    this.itinerary_days = data.itinerary_days; 
                    this.destinations_list=data.destinations_db;
                    this.allDestinations=[];
                    if(data.destinations_db && data.destinations_db){
                      for(let destin of data.destinations_db){
                        //console.log(destin);
                        this.allDestinations.push({ "id": destin.id, "text": destin.name });
                      }
                    }
                        console.log(this.allDestinations);
                    this.set_days_items();
                    this.pdf_file=data.pdf_file;
                    this.pdf_list=data.pdf_list;
                    //alert(this.pdf_file); 
                    if (data.itinerary_flight) {
                        this.flights = data.itinerary_flight;
                    }
                    this.allVehMode = data.vehicle_mode;
                    this.s3_url=data.s3_url;
                    this.destinationsList = this.itineraryData.destinations;
                    this.inclusion.itinerary_inclusions_id = [];
                    if (data && data.itinerary_inclusions) {
                        this.itinerary_inclusions = data.itinerary_inclusions;
                    }
                    this.isInclusion = data.user_inclusion_list_flag;

                    if (data && data.user_itinerary_inclusion) {
                        this.user_itinerary_inclusion=data.user_itinerary_inclusion;
                        this.set_inc_exc(data)
                    }
                    this.get_no_of_days();
                    this.all_poi = []; setTimeout(() => {
                        this.scroll_check();
                     }, 500);


                    

                }
            });
        }
     //this.isLoading=false;
       setTimeout(() => {
                this.isLoading=false;
        }, 2000);
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
    s3_pdf="https://watcons.blob.core.windows.net/tfclive/";
    user_itinerary_inclusion="";
    itn_header = '';
    itn_footer = '';
    allCategories = [{
        "id":1,
        "name":"Point Of Interest",
        "icon":"mdi-map-marker-outline"
    },{
        "id":2,
        "name":"Transport",
        "icon":"mdi mdi-rv-truck"
    },{
        "id":6,
        "name":"No Activity",
        "icon":"mdi mdi-bolnisi-cross" 
    }];
    pdf_loader=false;
generate_pdf2(){
    this.pdf_loader=true;
        this.itineraryService.generate_pdf(this.id).subscribe((data: any) => {
            console.log(data);
            if(data){
                var pdf_data=data;
                this.itineraryService.call_pdf(pdf_data.user_code,pdf_data.file_name).subscribe((cdata: any) => {
                   console.log(cdata);
            
                },(error)=>{
                    //on error  check pdf status
                    this.itineraryService.check_pdf_status(pdf_data.user_code,pdf_data.file_name).subscribe((pdata: any) => {
                    console.log(pdata);
                    if(pdata.status==true){
                        console.log('1 true');
                    }else{
                        setTimeout(() => {
    
                        console.log('1 false');
                        this.itineraryService.check_pdf_status(pdf_data.user_code,pdf_data.file_name).subscribe((pdata: any) => {
                            console.log(pdata);
                            if(pdata.status==true){
                                console.log('2 true');
                            }else{

                        setTimeout(() => {
                                    console.log('2 false');
                                    this.itineraryService.check_pdf_status(pdf_data.user_code,pdf_data.file_name).subscribe((pdata: any) => {
                                        console.log(pdata);
                                        if(pdata.status==true){
                                            console.log('3 true');
                                        }else{
                        setTimeout(() => {
                                                console.log('3 false');
                                                this.itineraryService.check_pdf_status(pdf_data.user_code,pdf_data.file_name).subscribe((pdata: any) => {
                                                    console.log(pdata);
                                                    if(pdata.status==true){
                                                        console.log('4 true');
                                                        this.renderData();

                                                   this.pdf_loader=false;
                                                    }else{
                                                        console.log('4 false');
                                                        this.pdf_loader=false;
                                                        this.renderData();
                                                    }
            
                                                }); 

                       }, 25000);
                            }
            
                                   }); 

                      }, 32000);
                            }
            
                       });   
                      }, 35000);
                    }
            
                }); 
            });  
            }
            
            

        },(error)=>{
               this.popUpMsg=JSON.stringify('Something went wrong! Try again');
            this.openDialog(); 
    }); 

}
generate_pdf(){
    this.pdf_loader=true;
        this.itineraryService.generate_pdf(this.id).subscribe((data: any) => {
            console.log(data,'ff');
            if(data){
                var pdf_data=data;
                this.itineraryService.call_pdf(pdf_data.user_code,pdf_data.file_name).subscribe((cdata: any) => {
                   console.log(cdata);
            
                },(error)=>{
                    //on error  check pdf status
                    this.itineraryService.check_pdf_status(pdf_data.user_code,pdf_data.file_name).subscribe((pdata: any) => {
                    console.log(pdata);
                    this.pdf_check_count++;
                    if(pdata.status=='true'){
                        console.log('1 true');
                    }else{ 
                        setTimeout(() => { 
                        this.check_pdf_status(pdf_data.user_code,pdf_data.file_name);  
                      }, 5000);
                    }
            
                }); 
            });  
            }
            
            

        },(error)=>{
                this.pdf_loader=false;
                this.popUpMsg=JSON.stringify('Something went wrong! Try again');
                this.openDialog(); 
    }); 

}
pdf_check_count=0;
check_pdf_status(user_code,file_name){
    this.pdf_check_count++;
    this.itineraryService.check_pdf_status(user_code,file_name).subscribe((pdata: any) => {
                console.log(pdata);
                if(pdata.status=='true'){
                    //alert('trruuee');
                    console.log('4 true');
                    this.pdf_loader=false; 
                    this.popUpMsg=JSON.stringify("Pdf generated successfully!");
                    this.openDialog();
                    this.renderData();
                }else{
                    console.log('false');
                    this.pdf_loader=true;

                    setTimeout(() => {
                       // console.log(this.pdf_check_count+"---counttt");
                        this.check_pdf_status(user_code,file_name);
                     }, 5000);    
                }

    }); 
}
    add_poi(poi_id, day_id) {
        $('#poi_img_' + poi_id).css('border', '2px solid red');
        this.itineraryService.getPoidetails(poi_id).subscribe((data: any) => {
            if (data && data.poi) {
                console.log(data);
                var poi = data.poi;
                this.newActivity.poi_details = poi.point_name;  //+','+poi.dest_name+','+poi.country_name;
                this.newActivity.poi_name = poi.point_name;
                this.newActivity.country = poi.country_name;
                this.newActivity.place_id = poi.place_id;
                this.newActivity.latitude = poi.latitude;
                this.newActivity.longitude = poi.longitude;
                this.newActivity.address = poi.address;
                this.newActivity.city = poi.dest_name;

                this.poiData = [];
                this.newActivity.itinerary_day_id = day_id;
                this.newActivity.category_id = 1;
                this.newActivity.category_name = 'Point Of Interest';
                this.photo_name = '';
                //$('#newCreateitinerarymodal').css('display', 'block');

             //$('#day_add_'+day_id).trigger('click');
            }


        });
    }

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

    close_ite_modal() {
        $('#newCreateitinerarymodal').css('display', 'none');
        this.isTransport = 0;
        this.isHotel = 0;
    }

    daysDiv: any;

    description_html = '';
    itn_description = '';

    ngOnInit() {

    }

    add_new_day() {
        this.daysDiv.push(6);
    }

    get_format_date(myDate) {
        var yy = myDate.getFullYear();
        var mon = myDate.getMonth() > 9 ? myDate.getMonth() : '0' + myDate.getMonth();
        var day = myDate.getDay() > 9 ? myDate.getDay() : '0' + myDate.getDay();
        var hr = myDate.getHours() > 9 ? myDate.getHours() : '0' + myDate.getHours();
        var min = myDate.getMinutes() > 9 ? myDate.getMinutes() : '0' + myDate.getMinutes();
        var r_date = yy + '-' + mon + '-' + day + ' ' + hr + ':' + min;
        return r_date;

    }

    errName = '';
    errDesc = '';
    errpoi = '';
    errend = '';
    errst = '';
    errPhoto = '';
    fontawsome = [{
        'id': 1,
        'name': 'mdi-map-marker-outline',
    }, {
        'id': 2,
        'name': 'mdi mdi-rv-truck',
    }, {
        'id': 3,
        'name': 'fa-truck',
    }, {
        'id': 4,
        'name': 'fa-hotel',
    }, {
        'id': 5,
        'name': 'fa-plane',
    },{
        'id':6,
        'name':'mdi mdi-bolnisi-cross'
    }

    ];

    validateField() {
        if (!this.newActivity.name) {
            this.errName = 'Please add Name!';
        } else {
            this.errName = '';
        }
        if (!this.newActivity.description && this.newActivity.category_id==1) {
            this.errDesc = 'Please add description!';
        } else {
            this.errDesc = '';
        }
        if (!this.newActivity.poi_details) {
            this.errpoi = 'Please add location!';
        } else {
            this.errpoi = '';
        }
        if (!this.newActivity.start_time) {
            this.errst = 'Please add start time!';
        } else {
            this.errst = '';
        }
        if (!this.newActivity.end_time) {
            this.errend = 'Please add end time!';
        } else {
            this.errend = '';
        }
        if (this.photo_name == '' && this.newActivity.category_id==1) {
            this.errPhoto = 'Please add image!';
        } else {
            this.errPhoto = '';
        }
        if (this.photo_name == '' && this.newActivity.category_id==6) {
            this.errPhoto = 'Please add image!';
        } else {
            this.errPhoto = '';
        }

        if (this.errName || this.errDesc || this.errpoi || this.errst || this.errend || this.errPhoto) {
            var myDiv = document.getElementById('newCreateitinerarymodal');
            myDiv.scrollTop = 0;
            return false;
        }
        if (this.newActivity.start_time) {
            var start_t = this.newActivity.start_time.split('.');
            var myDate = new Date();
            var hh = parseInt(start_t[0]);
            var mm = parseInt(start_t[1]);
            myDate.setHours(hh, mm, 0, 0);
            var format_date = this.get_format_date(myDate);
            console.log(format_date);
            this.newActivity.start_date = format_date;
        } else {
            var dd_it = this.get_format_date(new Date().setHours(0, 0, 0, 0));
            this.newActivity.start_date = dd_it;
            ;
        }
        if (this.newActivity.end_time) {
            var start_t = this.newActivity.end_time.split('.');
            var myDate = new Date();
            var hh = parseInt(start_t[0]);
            var mm = parseInt(start_t[1]);
            myDate.setHours(hh, mm, 0, 0);
            var format_date = this.get_format_date(myDate);
            console.log(format_date);
            this.newActivity.end_date = format_date;
            // return false;
        } else {
            var dd_it = this.get_format_date(new Date().setHours(0, 0, 0, 0));
            this.newActivity.end_date = dd_it;
        }
    }
upadateItineraryItem(){
        this.newActivity.poi_name=this.newActivity.poi_details;
        this.newActivity.from_poi_name = this.newActivity.poi_details;
        if(this.isTransport==1){
           this.newActivity.to_poi_name = this.newActivity.poi_details_to;

        }
        if (this.validateField() == false) {
            return false;
        }


        console.log(this.newActivity);
        //return false;
        for (var key in this.newActivity) {
            console.log(this.newActivity[key]);
            this.form.set(key, this.newActivity[key]);
        }
        this.isLoading=true;
        this.itineraryService.updateItemItinerary(this.form,this.item_edit_id).subscribe((data: any) => {
            console.log(data);
            this.isLoading=false;
            this.item_edit_id=0;
            this.popUpMsg = JSON.stringify(data.message);
            this.openDialog();
            this.close_ite_modal();
            this.renderData();

        }, (err) => {
            // this.popUpMsg = JSON.stringify(err);
            // this.openDialog();
            this.isLoading=false;
        });

}

    isTransport = 0;
    isNoActivity=0;
    createnewItinerary() {
        this.newActivity.poi_name=this.newActivity.poi_details;
        this.newActivity.from_poi_name = this.newActivity.poi_details;
        if(this.isTransport==1){
           this.newActivity.to_poi_name = this.newActivity.poi_details_to;

        }
        if (this.validateField() == false) {
            return false;
        }


        console.log(this.newActivity);
        //return false;
        for (var key in this.newActivity) {
            console.log(this.newActivity[key]);
            this.form.set(key, this.newActivity[key]);
        }
        this.isLoading=true;
        this.itineraryService.addItemItinerary(this.form).subscribe((data: any) => {
            console.log(data);
            this.isLoading=false;
            this.popUpMsg = JSON.stringify(data.message);
            this.openDialog();
            this.close_ite_modal();
            this.renderData();

        }, (err) => {
            // this.popUpMsg = JSON.stringify(err);
            // this.openDialog();
            this.isLoading=false;
        });
    }


    showdaytitleform() {
        this.showdivtitle = true;
    }

    poiData = [];

all_images=[];
    fetch_poi(id) {
        this.all_images=[];
        for (let poi of this.poiData) {
            //console.log(poi);
            if (poi.id == id) { 
                this.newActivity.poi_name = poi.point_name;
                this.newActivity.country = poi.country_name;
                this.newActivity.place_id = poi.place_id;
                this.newActivity.latitude = poi.latitude;
                this.newActivity.longitude = poi.longitude;
                this.newActivity.address = poi.address;
                this.newActivity.city = poi.dest_name;
                this.newActivity.from_poi_name = poi.point_name;
                this.newActivity.from_country = poi.country_name;
                this.newActivity.from_place_id = poi.place_id;
                this.newActivity.from_latitude = poi.latitude;
                this.newActivity.from_longitude = poi.longitude;
                this.newActivity.from_address = poi.address;
                var poi_des=poi.dest_name?','+poi.dest_name:'';
                this.newActivity.poi_details = poi.point_name  + poi_des + ',' + poi.country_name;
                
                //console.log(poi.point_name);
                console.log(this.newActivity);
                if(this.newActivity.category_id==1){
                    this.newActivity.description=poi.description?poi.description:'';

                    if(poi.images && poi.images.length>0){
                        this.check_poi_images(poi.images)
                       
                    }else{
                        this.photo_name="";
                        this.show_banner_image="";
                        this.all_images=[];
                        this.form.set("banner_image", ''); 
                    }
                }
            }
        }
        this.poiData = [];
    }
check_poi_images(images){

    for(let j=0;j<images.length;j++){
     if(images[j].image_path && images[j].image_path.search('http')==0){  
        this.itineraryService.checkUrl(images[j].image_path).subscribe((data: any) => {
          console.log('yes');
         }, (err) => {console.log(err.status);
            if(err.status==200){ 
                 this.all_images.push(images[j].image_path);
                 if(j==0){                    
                         setTimeout(() => { 
                          this.set_poi_img(images[0].image_path,0);
                         }, 200);
                  }
                 
            } 
        }); 
      } 
    } 
  }

set_poi_img(img_url,i){
  $(".selectHotelimgCheckbox").removeClass('htl-brder');
   $("#htl_chk_"+i).parent().addClass('htl-brder');
   this.callImageBase64(img_url);
}
base64Image:any; 
async callImageBase64 (url: string) { 
     var cors=""; 
    if (location.hostname.search("localh")>=0){ 
         cors="https://cors-anywhere.herokuapp.com/";  
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
    this.show_banner_image=this.croppedImage;

    this.form.set("banner_image", base64ToFile(this.croppedImage)); 
    console.log(this.form);
    var imgName = this.itineraryData.name.replace(/\s+/g, '-').toLowerCase();
    this.photo_name=imgName+'.jpg'; 
    console.log(this.base64Image.substring("data:image/".length, this.base64Image.indexOf(";base64")))

    }
}
    searchPoi(ev) {
        var loc_keywords = ev.target.value;
        if (ev.target.value.length > 4) {
            var data = {'keyword': loc_keywords, 'destinations': this.destinationsList};
            this.itineraryService.searchPoi(data).subscribe((data: any) => {
                console.log(data);
                if (data && data.poi) {
                    this.poiData = data.poi;
                } else {
                    this.poiData = [];
                }


            }, (err) => {
                // this.popUpMsg = JSON.stringify(err);
                // this.openDialog();
            });
        } else {
            this.poiData = [];
        }

    }

    toPoiData = [];

    searchPoiTo(ev) {
        var loc_keywords = ev.target.value;
        if (ev.target.value.length > 3) {
            var data = {'keyword': loc_keywords, 'destinations': this.destinationsList};
            this.itineraryService.searchPoi(data).subscribe((data: any) => {
                console.log(data);
                if (data && data.poi) {
                    this.toPoiData = data.poi;
                } else {
                    this.toPoiData = [];
                }


            }, (err) => {
                // this.popUpMsg = JSON.stringify(err);
                // this.openDialog();
            });
        } else {
            this.toPoiData = [];
        }

    }

    fetch_poi_to(id) {
        for (let poi of this.toPoiData) {
            //console.log(poi);
            if (poi.id == id) {
                
                this.newActivity.to_poi_name = poi.point_name;
                this.newActivity.to_country = poi.country_name;
                this.newActivity.to_place_id = poi.place_id;
                this.newActivity.to_latitude = poi.latitude;
                this.newActivity.to_longitude = poi.longitude;
                this.newActivity.to_address = poi.address;
                var poi_des=poi.dest_name?','+poi.dest_name:'';
                this.newActivity.poi_details_to = poi.point_name  + poi_des + ',' + poi.country_name;
                console.log(poi);
                console.log(this.newActivity);
            }
        }
        this.toPoiData = [];
    }

    open_preview() {
        window.location.hash = 'preview';
        $('#previewModal').css('display', 'block');

    }

    close_pre_modal() {
        window.location.hash = '';
        $('#previewModal').css('display', 'none');
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

    form = new FormData();
    photo: File;
    photo_name: any;

    addFIle2(files: FileList, isAvatar: boolean) {
        this.photo = files[0];
        console.log(this.photo.name);
        this.photo_name = this.photo.name;

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
    errImage = '';
    imgName = '';

    addFIle(event: any) {
        this.imgName = '';
        this.errImage = '';
        this.photo_name = ''        
        this.show_banner_image='';
        var validExtensions = ['jpg', 'png', 'jpeg']; //array of valid extensions
        var fileName = event.target.files[0].name;
        var fileNameExt = fileName.substr(fileName.lastIndexOf('.') + 1);
        if ($.inArray(fileNameExt, validExtensions) == -1) {
            this.errImage = "Only these file types are accepted : " + validExtensions.join(', ');
            alert("Only these file types are accepted : " + validExtensions.join(', '));
            return false;
        }
        const URL = window.URL || (window as any).webkitURL;
        const Img = new Image();

        const filesToUpload = (event.target.files);
        Img.src = URL.createObjectURL(filesToUpload[0]);

        Img.onload = (e: any) => {
            var height = e.path[0].height;
            var width = e.path[0].width;
            console.log(height, width);
            if (width < 800 && height < 500) {
                this.errImage = 'Please select image of size greater than  800 X 500 Dimensions';
                this.popUpMsg = JSON.stringify('Please select image of size greater than 800 X 500 Dimensions');
                this.openDialog();
                //alert('Please select image of size greater than 800 X 500');
            } else {
                this.imageChangedEvent = event;
                console.log(this.imageChangedEvent);
                this.imgName = event.target.files[0].name;
                console.log((this.banner.nativeElement as HTMLImageElement).width);
                this.open_crop_modal();
            }
        }

    }
triggerFile(){
    $("#chooseFile").trigger('click');  
}
    open_crop_modal() {

        $("#crop_model .overlay").css('background', 'none');

        $("#crop_model").css('display', 'block');
        $("#crop_model").addClass('show');
        $("#crop_model").css('z-index', '99999');
    }

    close_crop() {
        $("#crop_model").removeClass('show');
        $("#crop_model").css('display', 'none');
        //this.croppedImage ='';
    }

    photoForm = new FormData();

    done_cropping() {

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
        this.errPhoto="";
        this.form.set("banner_image", base64ToFile(this.croppedImage));

        this.photo_name = this.imgName;
        this.show_banner_image=this.croppedImage;

        //}    
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

    multiple_images = [];

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

    get_category(id) {
        for (let cat of this.allCategories) {
            if (cat.id == id) {
                return cat.name;
            }
        }
    }

    get_hours(s_date: any, e_date: any) {
        // console.log(s_date,e_date);
        //this.get_clock();
        var date1 = new Date(s_date);
        var date2 = new Date(e_date);
        var hours = Math.abs(date2.valueOf() - date1.valueOf()) / 36e5;
        if (hours > 0) {
            if (hours > 1) {
                return hours + ' hours';
            } else {
                return hours + ' hour';
            }
        } else {
            return '2 hours';
        }

    }

    get_start(sta_date) {
        var hh = new Date(sta_date).getHours();
        var mm = new Date(sta_date).getMinutes();
        var sTime = this.pad(hh) + ":" + this.pad(mm);
        return sTime;
    }

    pad(value) {
        if (value < 10) {
            return '0' + value;
        } else {
            return value;
        }
    }

    timesSet = [];

    get_clock() {
        var x = 30; //minutes interval
        var times = []; // time array
        var tt = 0; // start time
        var ap = ['AM', 'PM']; // AM-PM

//loop to increment the time and push results in array
        for (var i = 0; tt < 24 * 60; i++) {
            var hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
            var mm = (tt % 60); // getting minutes of the hour in 0-55 format
            times[i] = ("0" + (hh % 24)).slice(-2) + '.' + ("0" + mm).slice(-2);// + ap[Math.floor(hh/12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]
            tt = tt + x;
        }

        this.timesSet = times;

        console.log(times);
    }

    timesEnd = [];

    get_end_time(e) {

        var st = e.target.value;
        var h = parseInt(st.split('.')[0]);
        var m = parseInt(st.split('.')[1]);
        if (m == 30) {
            m = 50;
        }
        var hm = parseFloat(h + '.' + m);

        var min = hm * 60;
        var x = 30; //minutes interval
        var times = []; // time array
        var tt = min + 30; // start time
        var ap = ['AM', 'PM']; // AM-PM
        for (var i = 0; tt < 24 * 60; i++) {
            var hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
            var mm = (tt % 60); // getting minutes of the hour in 0-55 format
            times[i] = ("0" + (hh % 24)).slice(-2) + '.' + ("0" + mm).slice(-2);// + ap[Math.floor(hh/12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]
            tt = tt + x;
        }
        console.log(times);
        this.timesEnd = times;
    }
    get_edit_end_time(st) {
 
        var h = parseInt(st.split('.')[0]);
        var m = parseInt(st.split('.')[1]);
        if (m == 30) {
            m = 50;
        }
        var hm = parseFloat(h + '.' + m);

        var min = hm * 60;
        var x = 30; //minutes interval
        var times = []; // time array
        var tt = min + 30; // start time
        var ap = ['AM', 'PM']; // AM-PM
        for (var i = 0; tt < 24 * 60; i++) {
            var hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
            var mm = (tt % 60); // getting minutes of the hour in 0-55 format
            times[i] = ("0" + (hh % 24)).slice(-2) + '.' + ("0" + mm).slice(-2);// + ap[Math.floor(hh/12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]
            tt = tt + x;
        }
        console.log(times);
        this.timesEnd = times;
    }    

    isHotel = 0;

    open_hotel_item() {
        this.create_new_activity_item(1);
        this.newActivity.category_id = 4;
        this.isHotel = 1;

    }

    open_flight_item() {
        $('#newCreateflight').css('display', 'block');
    }

    close_flight_item() {
        $('#newCreateflight').css('display', 'none');
    }

    open_inc_item() {
        $('#newCreateinclusion').css('display', 'block');
    }

    close_inc_item() {
        $('#newCreateinclusion').css('display', 'none');
    }

    open_inc_ex_item() {

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

    inclErr = '';

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
        if (this.inclusion.itinerary_inclusions_id.length == 0) {
            this.inclErr = 'Please select inclusion item(s)!';
            this.popUpMsg = JSON.stringify('Please select inclusion item(s)!');
            this.openDialog();
            var myDiv = document.getElementById('newCreateinclusion');
            myDiv.scrollTop = 0;
            return false;
        } else {
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

        }
        console.log(this.inclusion); 
        this.itineraryService.addInclusion(this.inclusion, this.isInclusion, this.id).subscribe((data: any) => {
            console.log(data);

            this.popUpMsg = JSON.stringify(data.message);
            this.openDialog();
            this.close_inc_item();
            this.renderData();

        }, (err) => {
            // this.popUpMsg = JSON.stringify(err);
            // this.openDialog();
        });

    }

    accDays = [];

    set_days(ev) {
        var id = ev.target.value;
        if (ev.target.checked) {
            this.accDays.push(id);
        } else {
            var index = this.accDays.indexOf(id);
            this.accDays.splice(index, 1);
        }
        console.log(this.accDays);
    }

    errDays = '';

    add_hotel_to_itin() {
        if (this.accDays.length == 0) {
            this.errDays = "Please select day(s)!";
            var myDiv = document.getElementById('newCreateitinerarymodal');
            myDiv.scrollTop = 0;
            return false;
        } else {
            this.errDays = '';
            if (this.validateField() == false) {
                return false;
            }
            var j = 0;
            for (let dd of this.accDays) {
                j++;
                this.newActivity.itinerary_day_id = dd;
                for (var key in this.newActivity) {
                    console.log(this.newActivity[key]);
                    this.form.set(key, this.newActivity[key]);
                }
                this.itineraryService.addItemItinerary(this.form).subscribe((data: any) => {
                    console.log(data);


                }, (err) => {
                    // this.popUpMsg = JSON.stringify(err);
                    // this.openDialog();
                });
            }
            if (j == this.accDays.length) {
                // alert('close');
                this.close_ite_modal();
                this.renderData();
            }

        }

    }
    item_edit_id=0;
open_item_edit_form(item){
    this.daySecError="";
    console.log(item);
    this.item_edit_id=item.id;
    this.newActivity.category_id=item.category_id;
    if(this.newActivity.category_id==2){
        this.isTransport=1;
    }else{
        this.isTransport=0;
    }
    this.newActivity.name=item.name;
    this.newActivity.itinerary_day_id=item.itinerary_day_id;
    this.newActivity.vehicle_mode=item.vehicle_mode;
    this.newActivity.description=item.description;
    this.newActivity.poi_details=item.poi_name;  
    this.newActivity.poi_name = item.poi_name;
    this.newActivity.country = item.country;
    this.newActivity.place_id = item.place_id;
    this.newActivity.latitude = item.latitude;
    this.newActivity.longitude = item.longitude;
    this.newActivity.address = item.address;
    this.newActivity.city = item.city;
    this.newActivity.poi_details_to = item.to_poi_name; 
    this.newActivity.to_poi_name = item.to_poi_name;
    this.newActivity.to_country = item.to_country;
    this.newActivity.to_place_id = item.to_place_id;
    this.newActivity.to_latitude = item.to_latitude;
    this.newActivity.to_longitude = item.to_longitude;
    this.newActivity.to_address = item.to_address;
    this.newActivity.to_city = item.to_city;
    this.newActivity.from_poi_name = item.from_poi_name;
    this.newActivity.from_country = item.from_country;
    this.newActivity.from_place_id = item.from_place_id;
    this.newActivity.from_latitude = item.from_latitude;
    this.newActivity.from_longitude = item.from_longitude;
    this.newActivity.from_address = item.from_address;
    this.newActivity.start_time = item.start_time;
    this.newActivity.end_time = item.end_time;
    this.show_banner_image=item.banner_image;
    var imgName = item.name.replace(/\s+/g, '-').toLowerCase();
    this.photo_name=imgName+'.jpg';   
    this.get_edit_end_time(this.newActivity.start_time);

    //console.log()

}    
hotel_delete_id=0;
open_hotel_delete_modal(id){
  this.hotel_delete_id=id;
}
delete_hotel(){ 
       this.itineraryService.delete_hotel(this.hotel_delete_id).subscribe((data: any) => {
         console.log(data);
         this.popUpMsg = JSON.stringify(data.message);
         this.openDialog();
         this.renderData();
            
        }, (err) => { 
        }); 
  
}
    delete_id = 0;

    open_delete_modal(id) {
        this.delete_id = id;
    }

    delete_items() {
        var conf = confirm("Are you sure to delete this item?");
        //if(conf){
        this.itineraryService.delete_shed_items(this.delete_id).subscribe((data: any) => {
            console.log(data);
            this.popUpMsg = JSON.stringify(data.message);
            this.openDialog();
            this.renderData();

        }, (err) => {
            // this.popUpMsg = JSON.stringify(err);
            // this.openDialog();
        });
        // }
        // else{
        //  return false;
        // }

    }

    hotel_list = [];

    search_hotels() {
        this.hotel_list = [];
        console.log(this.newActivity.name);
        if (this.newActivity.name) {
            this.itineraryService.search_hotels(this.newActivity.name).subscribe((data: any) => {
                console.log(data.results);
                if (data && data.results) {
                    console.log(data.results.hotels);
                    this.hotel_list = data.results.hotels;
                }

            }, (err) => {
                // this.popUpMsg = JSON.stringify(err);
                // this.openDialog();
            });
        }
    }

    fetch_hotel_details(hotel_data) {
        console.log(hotel_data);
        this.hotel_list = [];

        this.newActivity.poi_name = hotel_data.fullName;
        this.newActivity.name = hotel_data.fullName;
        //this.newActivity.country=hotel_data.country_name;
        this.newActivity.place_id = hotel_data.locationId;
        this.newActivity.latitude = hotel_data.location.lat;
        this.newActivity.longitude = hotel_data.location.lon;
        this.newActivity.address = hotel_data.fullName;
        this.newActivity.poi_details = hotel_data.locationName;
        var hotel_img = "https://photo.hotellook.com/image_v2/limit/h" + hotel_data.id + "_1/800/360.auto";
        console.log(hotel_img);
        // this.newActivity.city=hotel_data.dest_name;
    }
show_banner_image="";
    create_new_activity_item(id) {
        this.daySecError="";
        this.isLoading=true;
        this.newActivity = new Itinerary();
        this.poiData = [];
        this.newActivity.itinerary_day_id = id;
        this.isTransport=0;
        this.newActivity.category_id = 1;
        this.newActivity.category_name = 1;
        this.photo_name = '';
        this.show_banner_image="";
        this.isLoading=false;
        this.all_images=[];
        this.tab_form(1,'Point Of Interest');
       // $('#newCreateitinerarymodal').css('display', 'block');
    }
    daySecError="";
    tab_form(id, name) {

        this.daySecError=""; 
        this.all_images=[]; 
        if (id == 2 ) {
            this.isTransport = 1;
            this.newActivity.description='';
            this.newActivity.poi_details='';
            this.newActivity.name='';
            this.photo_name="";
            this.show_banner_image="";
        } else {
            this.isTransport = 0;
        }
         this.newActivity.category_id = id; 
         var schedule_type =this.checkForDaysPoi(id);
         console.log(schedule_type);

        if(id==1 && schedule_type=='n'){  
            this.newActivity.category_id = 6;  
         console.log(this.newActivity.category_id);           
            this.daySecError="You have already selected 'No Activity' for the whole day. To add new POIs, remove the 'No Activity'.";
            return;
        } 
        if(id==6){              
            this.daySecError="In 'No Activity' you cannot add any POIs for the whole day"; 
        } 
        if(id==6 && schedule_type=='p'){  
            this.newActivity.category_id = 1;  
         console.log(this.newActivity.category_id);           
            this.daySecError="You have already added POI for the day. To add 'No Activity', remove the existing POIs";
            return;
        } 
    
         
    }
checkForDaysPoi(cat_id){ 
    var schedule_type="";
    for(let dd of this.itinerary_days){ 
        if(this.newActivity.itinerary_day_id==dd.id){
        for(let d of dd.schedule_items){
            console.log(d);
          if(d.category_id==6){ 
            schedule_type="n";
          }
          if(d.category_id==1){ 
            schedule_type="p";
          }
        }
      }
    }
    return schedule_type;
}
    get_city(schedule) {
        var city = [];
        for (let sched of schedule) {
            if (sched.city != "undefined") {
                if (city.indexOf(sched.city) > -1) {

                } else {
                    city.push(sched.city);
                }

            }
        }
        // console.log(city.join());
        return city.join();
    }

    flights = new Flights();

    add_flight() {

        this.flights.itinerary_id = this.id;
        if (this.flights.id != undefined && this.flights.id > 0) {
            //alert('edit');
            this.itineraryService.UpdateFlight(this.flights, this.flights.id).subscribe((data: any) => {
                console.log(data);

                this.popUpMsg = JSON.stringify(data.message);
                this.openDialog();
                this.close_flight_item();
                this.renderData();

            }, (err) => {
                // this.popUpMsg = JSON.stringify(err);
                // this.openDialog();
            });
        } else {
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

    depTitleErr = '';
    depfrmAirErr = '';
    deptoAirErr = '';
    arrTitleErr = '';
    arrfrmAirErr = '';
    arrtoAirErr = '';

    validate_flight() {
        this.depTitleErr = '';
        this.depfrmAirErr = '';
        this.deptoAirErr = '';
        this.arrTitleErr = '';
        this.arrfrmAirErr = '';
        this.arrtoAirErr = '';
        if (this.flights.departure_title == '' || this.flights.departure_title == undefined) {
            this.depTitleErr = 'Please add tittle!';
        } else {
            this.depTitleErr = '';
        }

        if (this.flights.from_airport_name == '' || this.flights.from_airport_name == undefined) {
            this.depfrmAirErr = 'Please add airport!';
        } else {
            this.depfrmAirErr = '';
        }
        if (this.flights.to_airport_name == '' || this.flights.to_airport_name == undefined) {
            this.deptoAirErr = 'Please add airport!';
        } else {
            this.deptoAirErr = '';
        }
        if (this.flights.arrival_title == '' || this.flights.arrival_title == undefined) {
            this.arrTitleErr = 'Please add tittle!';
        } else {
            this.arrTitleErr = '';
        }

        if (this.flights.arr_from_airport_name == '' || this.flights.arr_from_airport_name == undefined) {
            this.arrfrmAirErr = 'Please add airport!';
        } else {
            this.arrfrmAirErr = '';
        }
        if (this.flights.arr_to_airport_name == '' || this.flights.arr_to_airport_name == undefined) {
            this.arrtoAirErr = 'Please add airport!';
        } else {
            this.arrtoAirErr = '';
        }
        console.log(this.flights);
        if (this.arrtoAirErr || this.arrfrmAirErr || this.arrTitleErr || this.deptoAirErr
            || this.depfrmAirErr || this.depTitleErr) {
            var myDiv = document.getElementById('newCreateflight');
            myDiv.scrollTop = 0;
            return false;
        } else {
            this.add_flight();
        }
    }

    airportData = [];
    airportDataDepFrom = [];
    airportDataDepTo = [];
    airportDataRetFrom = [];
    airportDataRetTo = [];

    searchAirport(ev, f_type) {
        var loc_keywords = ev.target.value;
        if (ev.target.value.length > 4) {
            var data = {'keyword': loc_keywords, 'destinations': this.destinationsList};
            this.itineraryService.searchAirport(data).subscribe((data: any) => {
                console.log(data);
                if (data && data.airport) {
                    if (f_type == 'dep_from') {
                        this.airportDataDepFrom = data.airport;
                    }
                    if (f_type == 'dep_to') {
                        this.airportDataDepTo = data.airport;
                    }
                    if (f_type == 'ret_from') {
                        this.airportDataRetFrom = data.airport;
                    }
                    if (f_type == 'ret_to') {
                        this.airportDataRetTo = data.airport;
                    }
                    this.airportData = data.airport;
                } else {
                    this.airportData = [];
                    this.airportDataDepFrom = [];
                    this.airportDataDepTo = [];
                    this.airportDataRetFrom = [];
                    this.airportDataRetTo = [];
                }


            }, (err) => {
                // this.popUpMsg = JSON.stringify(err);
                // this.openDialog();
            });
        } else {
            this.airportData = [];
        }

    }

    fetch_airp(id, f_type) {
        if (f_type == 'dep_from') {
            for (let air of this.airportDataDepFrom) {
                if (air.id == id) {
                    this.flights.from_airport_name = air.dest_name;
                    this.flights.from_poi_name = air.dest_name;
                    this.flights.from_city_id = '';
                    this.flights.from_state_id = '';
                    this.flights.from_country = air.country_name;
                    this.flights.from_place_id = '';
                    this.flights.from_latitude = air.latitude;
                    this.flights.from_longitude = air.longitude;
                    this.flights.from_address = '';
                    console.log(air);
                    console.log(this.flights);
                }
            }
            this.airportDataDepFrom = [];
        }
        if (f_type == 'dep_to') {
            //this.airportDataDepTo=data.airport;
            for (let air of this.airportDataDepTo) {
                if (air.id == id) {
                    this.flights.to_airport_name = air.dest_name;
                    this.flights.to_poi_name = air.dest_name;
                    this.flights.to_city_id = '';
                    this.flights.to_state_id = '';
                    this.flights.to_country = air.country_name;
                    this.flights.to_place_id = '';
                    this.flights.to_latitude = air.latitude;
                    this.flights.to_longitude = air.longitude;
                    this.flights.to_address = '';
                    console.log(air);
                    console.log(this.flights);
                }
            }
            this.airportDataDepTo = [];
        }
        if (f_type == 'ret_from') {
            //this.airportDataRetFrom=data.airport;
            for (let air of this.airportDataRetFrom) {
                if (air.id == id) {
                    this.flights.arr_from_airport_name = air.dest_name;
                    this.flights.arr_from_poi_name = air.dest_name;
                    this.flights.arr_from_city_id = '';
                    this.flights.arr_from_state_id = '';
                    this.flights.arr_from_country = air.country_name;
                    this.flights.arr_from_place_id = '';
                    this.flights.arr_from_latitude = air.latitude;
                    this.flights.arr_from_longitude = air.longitude;
                    this.flights.arr_from_address = '';
                    console.log(air);
                    console.log(this.flights);
                }
            }
            this.airportDataRetFrom = [];
        }
        if (f_type == 'ret_to') {
            // this.airportDataRetTo=data.airport;
            for (let air of this.airportDataRetTo) {
                if (air.id == id) {
                    this.flights.arr_to_airport_name = air.dest_name;
                    this.flights.arr_to_poi_name = air.dest_name;
                    this.flights.arr_to_city_id = '';
                    this.flights.arr_to_state_id = '';
                    this.flights.arr_to_country = air.country_name;
                    this.flights.arr_to_place_id = '';
                    this.flights.arr_to_latitude = air.latitude;
                    this.flights.arr_to_longitude = air.longitude;
                    this.flights.arr_to_address = '';
                    console.log(air);
                    console.log(this.flights);
                }
            }
            this.airportDataRetTo = [];
        }


    }
scroll_left(){
    const content = document.querySelector(".scheduleDaylist");
    var scrollStep = 260;
    let sl = content.scrollLeft;
    if ((sl - scrollStep) <= 0) {
        content.scrollTo(0, 0);
    } else {
        content.scrollTo((sl - scrollStep), 0);
    }  
}
scroll_right(){ 
    const content = document.querySelector(".scheduleDaylist");
    var scrollStep = 260;
    let sl = content.scrollLeft;
    var cw = content.scrollWidth; 
    if ((sl + scrollStep) >= cw) { 
        content.scrollTo(cw, 0);
    } else { 
        content.scrollTo((sl + scrollStep), 0);
    }
}
show_hide_scroll=false;
scroll_check(){


    const content = document.querySelector(".scheduleDaylist");
    const content2=document.querySelector<HTMLElement>(".scheduleDaylist"); 

    var scrollStep = 260;
    let sl = content.scrollLeft;
    var cw = content.scrollWidth; 
    var c_width = content2.offsetWidth; 
    console.log(c_width,cw+'ffcc');
    if (c_width < cw) { 
        console.log(sl + scrollStep,cw+'ff');
        this.show_hide_scroll=true;
    } else { 
        this.show_hide_scroll=false;
        console.log(sl + scrollStep,cw+'tt');
    } 
 
}
  
lc_destin=false;
  selectt_dest:any;
  location_day_name="";
  location_day_id:any;
  location_day_destination:any;
  openLocationEdit(days_det){
    this.lc_destin=true;
    this.location_day_id=days_det.id;
    this.location_day_name=days_det.day_name;
 console.log(days_det);
    this.allDestinations=[];
    this.selectt_dest="";
    if(this.destinations_list && this.destinations_list){
      for(let destin of this.destinations_list){
        //console.log(destin);
        this.allDestinations.push({ "id": destin.id, "text": destin.name });
      }
    }  
   setTimeout(() => { 
    $(".select2-container .select2-selection--multiple").css('background-color','inherit');
      if(days_det.destinations.length!=0){ 
        let i=0;
        var sel_dest=[];
        for(let a of days_det.destinations){ 
          sel_dest.push("" +a.destination_id); 
        }
        
                
         setTimeout(() => {
             this.selectt_dest=sel_dest;
             console.log(this.selectt_dest);
         }, 500); 
         

      } 
      }, 200);
  }  
  updateDestination(){
        console.log(this.location_day_destination);
        if(this.location_day_destination==undefined || this.location_day_destination.length==0){
          
            this.popUpMsg = JSON.stringify('Please Select Destination!');
            this.openDialog(); 
            return;
        }
       // alert('d');return;
        this.itineraryService.UpdateDayLocations(this.id,this.location_day_id, this.location_day_destination).subscribe((data: any) => {
            console.log(data);

            this.popUpMsg = JSON.stringify(data.message);
            this.openDialog(); 
             this.renderData();
           this.lc_destin=false;

        }, (err) => { 
        });

  } 
  selectedDestin(value){ 

        this.location_day_destination=value;
        console.log(this.location_day_destination);
  }

  day_details=false;
  days_descriptions="";
  day_desc_id:any;
  day_desc_name="";

  open_day_desc(dd){
    this.day_details=true;
    this.day_desc_id=dd.id;
    this.day_desc_name=dd.day_name;
    this.days_descriptions=dd.description;

  }
  updateDecriptions(){ 
        this.itineraryService.UpdateDayDescriptions(this.id,this.day_desc_id, this.days_descriptions).subscribe((data: any) => {
            console.log(data);
            this.day_details=false;
             this.renderData();

            this.popUpMsg = JSON.stringify(data.message);
            this.openDialog(); 

        }, (err) => { 
        });

  }
}
