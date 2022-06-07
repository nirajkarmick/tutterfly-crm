import { Component, OnInit,  ViewChild ,ElementRef,NgZone  } from '@angular/core';
import { DashboardService } from '../service/dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';
import {MatDialog} from '@angular/material';
import {AlertBoxComponent} from '../alert-box/alert-box.component';
import { MapsAPILoader } from '@agm/core';
import { FormControl ,FormGroup,FormBuilder,Validators} from '@angular/forms';
declare var google;
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  profile:any;
  profile_banner:any;
  profile_avatar:any;
  editProPop:boolean=false;

  editPass:boolean=false;

  profileCopy:any;
  profilePass=new Passwrd();
  pass_error:any;
  photo:File;
  userId:any;
  photo_name:any;
  profileId:any;
  notfound='';
  show_pass=true;
  timeZoneData:any=[];
  profile_email="";
  public timeZonesOptions: Select2Options;
    @ViewChild("search")
    public searchElementRef: ElementRef;  
    public searchControl: FormControl;  
    public zoom: number;
  public latitude: number;
  public longitude: number;
  public fulladdr: string;
  public country_code: string;
  public state_name: string;
  public city='';
  public zip_code: string;
  public country_name: string;
  show_role=false;
  constructor(private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,private service:DashboardService,private dialog: MatDialog,private route: ActivatedRoute,private router: Router) {
    if (localStorage.getItem("userId") !== null) {  
                    this.userId=localStorage.getItem('userId');
      }

    this.profileId = this.route.snapshot.queryParams['id'] ? this.route.snapshot.queryParams['id'] : 0;
    if(this.profileId > 0 && this.profileId!=this.userId){
      this.show_pass=false;
    }
    if(this.profileId){
       this.userId=this.profileId 
    }

    this.fetchData();
   }

  ngOnInit() {
  }

  fetchData(){
  $('body').removeClass('modal-open');
$('body').css('padding-right',0);
  $('.modal-backdrop').remove();
  this.photo_name="";
    try {
    this.service.getProfile(this.userId).subscribe((data:any)=>{
      console.log(data)
      if(data.error){
        this.notfound='User Not Found!!!';
        
      }else{
      console.log(data.profile);
      this.profile=data.profile;
      if(data.email_footer){
        this.user_footer.footer_content_html=data.email_footer.footer_content_html;
        this.user_footer.active=data.email_footer.active;
        if(this.user_footer.active==1){
          this.active_checked=true;
        }else{
          this.active_checked=false;
        }
      }else{ 
        this.user_footer.footer_content_html="";
        this.user_footer.active=0;
      }
      //this.profileCopy.timezone=data.timezones;
      this.profileCopy=data.profile;
      this.profileCopy.timezone=this.profile.timezone;
      this.profile_banner=this.profile.banner_url;
      this.profile_avatar=this.profile.avatar_url;
      this.fulladdr=this.profile.address_street; 
      //this.profile_email=this.profile.mail_email; 
      if (data.timezones != undefined) {                       
          let i=0;
          for (let e of data.timezones) {
            this.timeZoneData.push({ "id": e, "text": e });
            i++;
          }
      } 
      //localStorage.setItem('userImage',this.profile_avatar);
      if(!this.profile){
         this.notfound='User Not Found...!!!';
      }

      }
    }, error => {
        
      this.notfound='User Not Found!!!'; 
      
    });
  }catch (error) { 
      console.log(JSON.stringify(error));
      this.notfound='User Not Found!!!';
    }
    
  }
    loadAddressAutocomplete(){
       
        this.zoom = 4;
        this.latitude = 39.8282;
        this.longitude = -98.5795;
        this.mapsAPILoader.load().then(() => {  
          let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
            types: ["address"]
          }); 
          autocomplete.addListener("place_changed", () => {
            this.country_name ='';
                this.state_name ='';
                this.city = '';
                this.zip_code = ''; 
            this.ngZone.run(() => {
               let place = autocomplete.getPlace();
               let that=this;
              if (place.geometry === undefined || place.geometry === null) {
                return;
              }else{            

                        that.latitude = place.geometry.location.lat();
                        that.longitude = place.geometry.location.lng();
                        that.zoom = 12;
                        that.fulladdr = place.formatted_address;
                        var street_address="";
                        var street_number="";
                        var street_route=""; 
                        for (var i = 0; i < (place.address_components).length; i++) {
                          if (place.address_components[i].types[0] == 'street_number') {
                            street_number  = place.address_components[i].long_name; 
                          }
                          if (place.address_components[i].types[0] == 'route') { 
                            street_route  = place.address_components[i].long_name; 
                          }
                          if (place.address_components[i].types[0] == 'country') {
                            that.country_name = place.address_components[i].long_name;
                            that.country_code = place.address_components[i].short_name;
                          }
                          if (place.address_components[i].types[0] == "administrative_area_level_1") {
                            that.state_name = place.address_components[i].long_name;
                          }
                          if (place.address_components[i].types[0] == "locality") {
                            that.city = place.address_components[i].long_name;
                          }
                          if (place.address_components[i].types[0] == "postal_code") {
                            that.zip_code = place.address_components[i].long_name;
                          }
                        }
              }
          var street_add=street_number?street_number+' ':'';
          street_address=street_add+street_route; 
                this.profileCopy.address_country =this.country_name;
                this.profileCopy.address_state =this.state_name;
                this.profileCopy.address_city = this.city;
                this.profileCopy.address_zip = this.zip_code;
                this.profileCopy.address_street = street_address;
            });
          });
        });
    }
  selectBox(){    
    $('.select2-container').css('z-index',5000);
  }
  renderNewView(value){
  this.profileCopy.timezone=value;
}
  editProPopShow(){
    this.editProPop=true;
      this.searchControl = new FormControl();
       setTimeout(()=>{
            this.loadAddressAutocomplete();
         },500);
       setTimeout(()=>{      
        $('#street_add').val(this.fulladdr);
     $('.pac-container').css('z-index', 9999);
      },1000);
  }
  editProPopHide(){
    this.editProPop=false;
  }


  active_checked = true;
  editPassShow(){
    this.editPass=true;
  }
  editPassHide(){
    this.editPass=false;
  }
  editFooterShow(){
    this.editFooter=true;
  }
  editFooterHide(){
    this.editFooter=false;
  }
   active() {
    if (this.user_footer.active == 1) {
      //this.user_footer.active == 0;
     // this.active_checked = false;
    } else {
     // this.user_footer.active == 1;
     // this.active_checked = true;
    }
  }
  editFooter=false;
  user_footer={'footer_content_html':undefined,'active':1};
  updateUserFooter(){
      this.service.updateUserFooter(this.user_footer).subscribe((data:any)=>{
         console.log(data);
        this.popUpMsg = data.message;
        this.openDialog();
        this.editFooterHide();
        this.fetchData();
      });
    
  }
  updateProfile(){
   // profileCopy.first_name
   let rand_char = Math.random().toString(36).substring(7);
   localStorage.setItem('user',this.profileCopy.first_name+' '+this.profileCopy.last_name);
   localStorage.setItem('userImage',this.profile_avatar);
   window.location.hash=rand_char;
   this.service.updateProfile(this.profileCopy.id,this.profileCopy).subscribe((data:any)=>{
    if(data.error==false){
        this.editProPop=false;
        this.popUpMsg = data.message;
        this.openDialog();
    }
    this.fetchData();
  })
  }
 updatePassword(){
this.pass_error='';
   let rand_char = Math.random().toString(36).substring(7);
   if(this.profilePass.new_password!=this.profilePass.new_conf_pass){
      this.pass_error='Confirm Password does not match!';
      return false;
   }
   //window.location.hash=rand_char;
   this.service.updatePasswd(this.profilePass).subscribe((data:any)=>{
    this.editPassHide();
    this.profilePass=new Passwrd();
    this.popUpMsg = data.message;
    this.openDialog();
    this.fetchData();
  })
  }
 popUpMsg: any;
  openDialog(): void {
        let dialogRef = this.dialog.open(AlertBoxComponent, {
            width: '250px',
            data: JSON.stringify(this.popUpMsg)
        });

        dialogRef.afterClosed().subscribe(result => {
        });
    }
  openUp(){
    alert('openUp');
  }
  updateAvatar(){
    console.log(this.form)
    this.service.updateAvatar(this.form).subscribe((data:any)=>{
      console.log(data);
     this.fetchData();
     localStorage.setItem('userImage',data.profile.avatar_url);
     let rand_char = Math.random().toString(36).substring(7);
     window.location.hash=rand_char; 
   })
   }
   updateBanner(){
    this.service.updateBanner(this.form).subscribe((data:any)=>{
     this.fetchData();
   })
   }
   form = new FormData();
   addFIle(files: FileList,isAvatar:boolean) {
    this.photo =files[0];
    console.log(this.photo.name);
    this.photo_name=this.photo.name;
    if(isAvatar){
      this.form.set("avatar", this.photo);
    }else{
      this.form.set("banner", this.photo);
    }
    
  }

  closeRightpanel() {
    $('body').removeClass('right-bar-enabled');
  }
  copyMessage(text) {
    var val = text;
   // this.copysuccess = '';
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    //this.copysuccess = 'Copied Successfuly';
  }

}
class Passwrd {
    current_password: string;
    new_password: string;
    new_conf_pass: string;
}