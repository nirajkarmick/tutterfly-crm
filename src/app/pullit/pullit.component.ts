import {Component, OnInit, ViewChild, Input, Inject, PLATFORM_ID,ElementRef} from '@angular/core';
import {MessageService} from '../message.service';
import {PullitServiceService} from '../service/pullit-service.service';

import {Router} from '@angular/router';
import {Title, Meta} from '@angular/platform-browser';
import {GoogleMapsAPIWrapper, MapsAPILoader} from '@agm/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {isPlatformBrowser} from '@angular/common';
import {FormService} from '../service/form.service';
import * as moment from 'moment';
import { of } from "rxjs";
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter
} from "rxjs/operators";
import { fromEvent } from 'rxjs';
declare var google;

@Component({
  selector: 'app-pullit',
  templateUrl: './pullit.component.html',
  styleUrls: ['./pullit.component.css']
})
export class PullitComponent implements OnInit {

  constructor(private pullit_service: PullitServiceService,
              private formService: FormService,
              private router: Router, private http: HttpClient,
              @Inject(PLATFORM_ID) private platformId: Object,
              private mapsAPILoader: MapsAPILoader) {
  }

  pullit_country = false;
  pullit_keyword = '';
  pullit_search_drop = false;
  pullit_destination = false;
  pullit_poi = false;

  pullit_countryData = [];
  pullit_destData = [];
  pullit_poiData = [];
  showPullIt = false;
  countryData = new CountryData();
  graph_loader = false;
  @Input() oppo: any;
  d_View_set=false;
  destinationData = new DestinationData();
  weatherData:any;
  weatherLoad=false;
  weatherPlace="";

  poiData = new PoiData();
  countryLat: any;
  countryLong: any;
  destinationLat: any;
  destinationLong: any;
  poiLat: any;
  poiLong: any;
  // image_path=environment.pullit+'/images/uploads/';
  image_path = 'https://pullit-bucket.s3.us-west-2.amazonaws.com/';
  more_basic = false;
  todaysDay = 'friday';
  opp_dest = '';
  // @Input() showPullIt:any;
  poi_ref_type: any;
  poi_ref_id: any;
  poi_ref_key: any;

  @ViewChild('streetviewMap') streetviewMap: any;
  @ViewChild('streetviewPano') streetviewPano: any;
  latitude = 28.6126823;
  longitude = 77.2295771;
  zoom = 11;
  heading = 34;
  pitch = 10;
  scrollwheel = false;
  country_poi = 15;
  dest_ref_type: any;
  dest_ref_id: any;
  dest_ref_key: any;
  from_countries=[];
  to_countries=[];
  selected_from_country="IND";
  selected_to_country="";
  public countryOptions: Select2Options;
  ngOnInit() {
    const address = this.getlatlng('Landon');
    this.getAllCountry();

    // console.log(address);
var date = this.convertUTCDateToLocalDate(new Date(1653610578));
console.log(date,'dateeeeeeeee');
  }

  convertUTCDateToLocalDate(date) {
var sunrise1 = 1633585192;
var timezoneOffset = 7200;  //Seconds
    const sunrise = new Date((1653610578 + (-14400)) * 1000);
    return sunrise;
    var newDate = new Date(date.getTime()+(-14400)*60*1000);

    var offset = -14400 / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;   
}
getTime2(timestamp){
   
}
  scroll_to_visa(id) {
    console.log(`scrolling to ${id}`);
  let el = document.getElementById(id);
  el.scrollIntoView();
}
setFromCountry(val){
  this.selected_from_country=val;
}
setToCountry(val){
  this.selected_to_country=val;
}
getAllCountry() {  
  this.from_countries=[];
  this.to_countries=[];
      this.formService.getAllCountry().subscribe((data: any) => {

             console.log(data);
         if (data.countries != undefined) {
            for (let count of data.countries) {
            this.from_countries.push({"id": count.country_code, "text": count.name});
            this.to_countries.push({"id": count.country_code, "text": count.name});
          }
        }

      });
         
    }
getVisaDetails(type){ 
 this.graph_loader = true;
  this.pullit_service.getVisaDetails(this.selected_from_country,this.selected_to_country).subscribe((data: any) => {
        
          this.graph_loader = false;
        if(data && data.visa){
          if(type=="countryData"){
            this.countryData.visa_info=data.visa;
          }
          if(type=="destinationData"){
            this.destinationData.visa_info=data.visa;
          }
          if(type=="poiData"){
            this.poiData.visa_info=data.visa;
          }
        }else{
          this.countryData.visa_info=null;
            this.destinationData.visa_info=null;
            this.poiData.visa_info=null;
        }
      }, error => {
         
      });
}    
view_d(){
  if(this.poiLat>0){
    setTimeout(() => {
        if (this.poiLat && this.poiLong) {
      console.log('d3')
          $("#streetview-containerd_View_set").fadeIn('slow');
          this.renderStreetView(this.poiLat, this.poiLong);
        }
        
      }, 200);
  }
}
  showMoreBasic() {
    this.more_basic = true;
  }

  getlatlng(address) {
    // return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address).map((response: Response) => response);
    // return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address)
    //  .catch();
  }

  /*pullItExpendWidth() {
    const pullitbigwidth = $(window).width();
    const setpullitbigwidth = pullitbigwidth * 70 / 100;
    $('.pullit-container').css({'width': setpullitbigwidth});
    $('#pullit .card-footer ul').find('.li-hide').show();
    $('#travelexperience figure').removeClass('col-4').addClass('col-2');
    $('#pointofinterest .figure').removeClass('col-4').addClass('col-2');
    $('#topdestinations .figure').removeClass('col-3').addClass('col-2');
    $('#airport figure').removeClass('col-4').addClass('col-2');
    $('.toplocationforexperience figure').removeClass('col-3').addClass('col-2');
    $('.basic-info-itinerary').removeClass('col-6').addClass('col-4');
    $('#experience-category-list ul').removeClass('columns2').addClass('columns3');
    $('#pointofinterst-images figure').removeClass('col-3').addClass('col-2');
    $('#experience-activity .row').find('.col-3').removeClass('col-3').addClass('col-2');
    $('#other-activity-list .row').find('.col-2').removeClass('col-2').addClass('col-1');
    $('.activity-points-list').css('width', '49%');
    $('.activity-points-list:even').css('margin-right', '15px');
    $('.experience-details-box').css('width', '48%');
    $('.unexpend-button').show();
    $('#triangle-left').show();
    $('#limore').hide();
  }

  pullItCollapseWidth() {
    const pullitbigwidth = $(window).width();
    const setpullitsmallwidth = pullitbigwidth * 30 / 100;
    $('.pullit-container').css({'width': setpullitsmallwidth});
    $('#pullit .card-footer ul').find('.li-hide').hide();
    $('#experience-category-list ul').removeClass('columns3').addClass('columns2');
    $('#pointofinterst-images figure').removeClass('col-2').addClass('col-3');
    $('#pointofinterest .figure').removeClass('col-2').addClass('col-4');
    $('#topdestinations .figure').removeClass('col-2').addClass('col-3');
    $('#airport figure').removeClass('col-2').addClass('col-3');
    $('.experience-details-box').css('width', '100%');
    $('#experience-activity .row').find('.col-2').removeClass('col-2').addClass('col-3');
    $('#other-activity-list .row').find('.col-1').removeClass('col-1').addClass('col-2');
    $('.toplocationforexperience figure').removeClass('col-2').addClass('col-3');
    $('.activity-points-list').css('width', '100%');
    $('.activity-points-list').css('margin-right', '0');
    $('.basic-info-itinerary').removeClass('col-4').addClass('col-6');
    $('#limore').show();
    $('#triangle-left').hide();
  }*/


 

  /*minimize() {
    $('#pullit-expend').addClass('minimized');
  }

  maximize() {
    $('#pullit-expend').removeClass('minimized');
  }*/

  scrollTodiv(id) {
    document.getElementById(id).scrollIntoView({block: 'start', behavior: 'smooth'});
  } 
@ViewChild('SearchInput')
SearchInput: ElementRef;
  search_pullit() {
    if (this.pullit_keyword && this.pullit_keyword.length > 2) {
      this.graph_loader = true;
      this.pullit_search_drop = true;
      this.pullit_countryData = [];
      this.pullit_destData = [];
      this.pullit_poiData = [];
      // api call

      this.pullit_service.pullSearchByKey(this.pullit_keyword).subscribe((data: any) => {
        this.country_poi = 15;
        // console.log(data);
        this.pullit_countryData = data.country;
        this.pullit_destData = data.destination;
        this.pullit_poiData = data.poi;
        this.graph_loader = false;
      }, error => {
        this.graph_loader = false;
      });

    } else {
      this.pullit_search_drop = false;
      this.graph_loader = false;
    }

  }

  renderStreetView(lat, long) {
    if (isPlatformBrowser(this.platformId)) {
      this.mapsAPILoader.load().then(() => {
        const center = {lat: lat, lng: long};
        const map = new window['google'].maps.Map(this.streetviewMap.nativeElement, {
          center: center,
          zoom: this.zoom,
          scrollwheel: this.scrollwheel
        });
        const panorama = new window['google'].maps.StreetViewPanorama(
          this.streetviewPano.nativeElement, {
            position: center,
            pov: {heading: this.heading, pitch: this.pitch},
            scrollwheel: this.scrollwheel
          });
        map.setStreetView(panorama);
      });
    }
  }


  showMoreCountryPoi() {
    this.country_poi = this.country_poi + 15;
  }

  showLessCountryPoi() {
    this.country_poi = 15;
  }

  pullit_country_result(country_id, keyword) {
    this.country_poi = 15;
    this.resetCountryData();
    this.graph_loader = true;
    this.pullit_keyword = keyword;
    this.pullit_service.pullSearchByCountry(country_id).subscribe((data: any) => {
      this.graph_loader = false;
      console.log(data.country.poi);
      this.countryData = data.country;
      this.selected_to_country=data.country.iso_3;
      this.pullit_country = true;
      if (data.country.destinations.length > 0) {
        // alert(this.countryData.destinations.length);
        this.countryLat = parseFloat(data.country.destinations[0].latitude);
        this.countryLong = parseFloat(data.country.destinations[0].longitude);
      }
      setTimeout(() => {
        document.getElementById('flag').scrollIntoView({block: 'start', behavior: 'smooth'});
      }, 200);
    }, error => {
      this.graph_loader = false;
    });
  }

  resetCountryData() {
    this.country_poi = 15;
    this.pullit_keyword = '';
    this.pullit_country = false;
    this.pullit_search_drop = false;
    this.pullit_poi = false;
    this.countryData = new CountryData();
    this.destinationData = new DestinationData();
    this.countryLat = 0.0;
    this.countryLong = 0.0;
    this.more_basic = false;
    this.pullit_destination = false;
  }


  search_poi(id, keyword, ref_type, ref_id, ref_key) {
    this.country_poi = 15;
    this.poi_ref_type = ref_type;
    this.poi_ref_id = ref_id;
    this.poi_ref_key = ref_key;
    this.pullit_country = false;
    this.pullit_destination = false;
    this.pullit_search_drop = false;
    this.pullit_poi = false;
    this.graph_loader = true;
    this.poiData = new PoiData();
    this.pullit_keyword = keyword;
    console.log(this.poiData);
    this.pullit_service.pullSearchByPoi(id).subscribe((data: any) => {
      console.log(data);
      this.pullit_poi = true;
      this.poiData = data.poi;
      this.poiLat = parseFloat(data.poi.attraction_latitude);
      this.poiLong = parseFloat(data.poi.attraction_longitude);
      
      if(this.poiLat && this.poiLong){
        this.get_weather_details(this.poiLat,this.poiLong,this.poiData.attraction_name);
      }
      this.graph_loader = false;

      setTimeout(() => { 
        if (this.poiLat && this.poiLong) {
         this.renderStreetView(this.poiLat, this.poiLong);
        }
        document.getElementById('flag').scrollIntoView({block: 'start', behavior: 'smooth'});
      }, 200);
    }, error => {
      this.graph_loader = false;
    });

  }

  getPlaceDescrip(name) {
    this.pullit_service.getPlaceDescription(name).subscribe((data: any) => {
      console.log(data);


    }, error => {
      this.graph_loader = false;
    });
    return 'descriptions';
  }

  back_to_history_frm_des(ref_type, ref_id) {

    this.country_poi = 15;
    console.log(ref_type, ref_id);
    if (ref_type === 'country') {
      this.pullit_country_result(ref_id, this.dest_ref_key);
    }
    if (ref_type === 'destination') {
      this.search_destination(ref_id, this.dest_ref_key, this.dest_ref_type, this.dest_ref_id, this.dest_ref_key);
    }
    if (ref_type === 'poi') {
      this.search_poi(ref_id, this.dest_ref_key, this.poi_ref_type, this.poi_ref_id, this.poi_ref_key);
    }
  }

  back_to_history_frm_poi(ref_type, ref_id) {
    if (ref_type === 'country') {
      this.pullit_country_result(ref_id, this.poi_ref_key);
    }
    if (ref_type === 'destination') {
      this.search_destination(ref_id, this.poi_ref_key, this.dest_ref_type, this.dest_ref_id, this.dest_ref_key);
    }
    if (ref_type === 'poi') {
      this.search_poi(ref_id, this.poi_ref_key, this.poi_ref_type, this.poi_ref_id, this.poi_ref_key);
    }
  }


  search_destination(id, keyword, ref_type = '', ref_id = '', ref_key = '') {
    this.country_poi = 15;
    this.dest_ref_type = ref_type;
    this.dest_ref_id = ref_id;
    this.dest_ref_key = ref_key;
    this.pullit_country = false;
    this.pullit_destination = false;
    this.pullit_search_drop = false;
    this.pullit_poi = false;
    this.destinationData = new DestinationData();
    this.pullit_keyword = keyword;
    this.graph_loader = true;

    this.pullit_service.pullSearchByDestination(id).subscribe((data: any) => {
      console.log(data);
      this.destinationData = data.destination;
      this.selected_to_country = data.destination.country_iso_3;
      this.destinationLat = parseFloat(data.destination.latitude);
      this.destinationLong = parseFloat(data.destination.longitude);
      if(this.destinationLat && this.destinationLong){
        this.get_weather_details(this.destinationLat,this.destinationLong,this.destinationData.dest_name);
      }
      this.pullit_destination = true;
      this.graph_loader = false;
      setTimeout(() => {
        document.getElementById('flag').scrollIntoView({block: 'start', behavior: 'smooth'});
      }, 200);
    }, error => {
      this.graph_loader = false;
    });

  }
get_weather_details(lat,long,place){
  this.pullit_service.getWeatherReport(lat,long).subscribe((data: any) => {
        console.log(data);
        this.weatherData=data;
        if(this.weatherData){
          this.weatherLoad=true;
          this.weatherPlace=place;
        }
        
      }, error => {
      });
}
getTemp(temp:any){
  var tempr= Math.floor(temp - 273.15);
  return tempr;
}
getTime(timestamp){ 

  let dt = new Date((timestamp) * 1000)
    let h = dt.getHours();
    let m = "0" + dt.getMinutes();
    let t = h + ":" + m.substr(-2);
  //  alert(t);
    console.log(t,'setttttttttttttttt');
    return dt
  const sunrise = new Date((timestamp + this.weatherData.timezone) * 1000)
  var dateTimeString1 = moment(timestamp).format("HH:mm");

  let dateTimeString = new Date(timestamp*1000);
  return dateTimeString;
}
  pullIt() {
    this.showPullIt = true;
    $('body').css('overflow', 'hidden');
    setTimeout(() => {
      $('.modal-background').addClass('show').removeClass('hide');
      $('#modal-skew-from-left').addClass('show').removeClass('hide');
    }, 50);
    /*if ($('#pullit-expend').hasClass('minimized')) {
      this.maximize();
    }*/
    this.resizePullIt();
    if (localStorage.getItem('opp_dest')) {
      this.opp_dest = localStorage.getItem('opp_dest') ? localStorage.getItem('opp_dest') : '';
      this.pullit_keyword = this.opp_dest;
      const dest_id = localStorage.getItem('opp_dest_id');
      this.pullit_service.pullSearchByGeoname(dest_id).subscribe((data: any) => {
        console.log(data.destination);
        if (data.destination && data.destination.id) {
          this.search_destination(data.destination.id, this.opp_dest);
        }
      }, error => {
      });
      // this.search_pullit();
    }
  }
 closePullIt() {
    this.pullit_country = false;
    $('body').css('overflow', 'auto');
    setTimeout(() => {
      $('.modal-background').removeClass('show').addClass('hide');
      $('#modal-skew-from-left').removeClass('show').addClass('hide');
      this.showPullIt = false;
    }, 50);
  }
  resizePullIt() {
    setTimeout(() => {
      const pullitwidth = $(window).width();
      const setpullitwidth = pullitwidth * 30 / 100;
      const setpullitbodywidth = pullitwidth * 50 / 100;
      const pullitheight = $('#pullit').innerHeight();
      if ($(window).width() > 1024) {
        $('.pullit-container .card-header-sticky').css({'width': (setpullitwidth) + 'px'});
        $('.pullit-body').css({'height': (pullitheight) + 'px', 'width': (setpullitbodywidth) + 'px'});
        /*$('.pullit-body').css({});*/
      } else {
        $('.pullit-container .card-header-sticky').css({'width': (pullitwidth - 20) + 'px'});
      }


      /*$('#pullit-expend').css({'min-height': (pullitheight) + 'px'});*/
    }, 20);
  }
}

class CountryData {
  destinations: any;
  currency: any;
  time_zone: any;
  climate_types: any;
  demonyms: any;
  electrical_sockets: any;
  religions: any;
  ethnicities: any;
  time_zones: any;
  best_time_to_visits: any;
  languages: any;
  airport: any;
  visa_info:any;
}

class DestinationData {
  poi: any;
  country: any;
  airports: any;
  visa_info:any;
  dest_name:any;
}

class PoiData {
  images: any;
  destination: any;
  visa_info:any;
  name:any;
  attraction_name:any;
}
