
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient,HttpBackend } from '@angular/common/http';
import { environment } from '../environments/environment';
// import { Itinerary } from './itinerary-create/itinerary';
import { isDate } from 'rxjs/internal/util/isDate';

@Injectable({
  providedIn: 'root'
})
export class NewItineraryService {

private customHttpClient: HttpClient;
  constructor(private http:HttpClient,private backend: HttpBackend) {
        this.customHttpClient = new HttpClient(backend);
     }
 public getPdfTemplates(){
  var cors=""; 
    if (location.hostname.search("192.168")>=0  ||  location.hostname.search("localh")>=0){ 
         //cors="https://cors-anywhere.herokuapp.com/";   
    } 
     //let result  = this.http.get(environment.ip+'/templates').pipe(map((response: Response) => response));
     let result  = this.http.get(cors+'https://www.tutterflycrm.com/tfc/api/templates').pipe(map((response: Response) => response));
    return result;
  } 

  public getAllItinerary(page=1){
     let result  = this.http.get(environment.ip+'/rest_itineraries_new?page='+page).pipe(map((response: Response) => response));
    return result;
  }
   public getFlightDetails(id){
     let result  = this.http.get(environment.ip+'/itinerary_flights_details/'+id).pipe(map((response: Response) => response));
    return result;
  }
 public delete_shed_items(id){
     let result  = this.http.delete(environment.ip+'/rest_itinerary_schedule_new/'+id).pipe(map((response: Response) => response));
    return result;
  }

 public delete_hotel(id){
     let result  = this.http.delete(environment.ip+'/rest_itinerary_hotels/'+id).pipe(map((response: Response) => response));
    return result;
  }

public deleteFlight(id){
     let result  = this.http.delete(environment.ip+'/rest_itinerary_flights_new/'+id).pipe(map((response: Response) => response));
    return result;
  }

  public getAllCategories(){
        let result  = this.http.get(environment.ip+'/rest_itinerary_categories').pipe(map((response: Response) => response));
        return result;
       
  }
  public generate_pdf(id:any){
  var cors=""; 
    if (location.hostname.search("192.168")>=0  ||  location.hostname.search("localh")>=0){ 
         //cors="https://cors-anywhere.herokuapp.com/";   
    } 
        let result  = this.http.get(cors+environment.ip+'/itinerary_pdf_new/'+id).pipe(map((response: Response) => response));
        return result;

  } 

  public generate_itin_pdf(id:any,temp_id:any,type_id:any){
  var cors=""; 
    if (location.hostname.search("192.168")>=0  ||  location.hostname.search("localh")>=0){ 
         cors="https://cors-anywhere.herokuapp.com/";   
    }  
        let result  = this.http.get(cors+environment.ip+'/itinerary_pdf_new/'+id+'/'+temp_id+'/'+type_id).pipe(map((response: Response) => response));
        return result;

  } 
 public publish_itin_html(id:any,temp_id:any,type_id:any){
  var cors=""; 
    if (location.hostname.search("192.168")>=0  ||  location.hostname.search("localh")>=0){ 
         cors="https://cors-anywhere.herokuapp.com/";   
    }  
        let result  = this.http.get(cors+environment.ip+'/itinerary_publish_html/'+id+'/'+temp_id+'/'+type_id).pipe(map((response: Response) => response));
        return result;

  } 
  public response_pdf(user_code:any){
  var cors=""; 
    if (location.hostname.search("192.168")>=0  ||  location.hostname.search("localh")>=0){ 
         cors="https://cors-anywhere.herokuapp.com/";   
    }  
        let result  = this.http.get(cors+environment.ip+'/pdf_response_app?usercode='+user_code).pipe(map((response: Response) => response));
        return result;

  } 

  public call_pdf(usercode:any,filename:any){
   // var data: { 'fileName': filename, 'userCodes': usercode};
  var cors=""; 
    if (location.hostname.search("192.168")>=0  ||  location.hostname.search("localh")>=0){ 
         //cors="https://cors-anywhere.herokuapp.com/";   
    } 
        let result  = this.http.get(cors+environment.ip+'/call_pdf?fileName='+filename+'&userCodes='+usercode).pipe(map((response: Response) => response));
        return result;

  }

  public check_pdf_status(usercode:any,filename:any){  
  var cors=""; 
    if (location.hostname.search("192.168")>=0  ||  location.hostname.search("localh")>=0){ 
         //cors="https://cors-anywhere.herokuapp.com/";   
    } 
        let result  = this.http.get(cors+environment.ip+'/check_pdf_status?fileName='+filename+'&userCodes='+usercode).pipe(map((response: Response) => response));
        return result;

  } 


    public searchFlightApi(airline_code:any,flight_no:any,f_date:any){ 
     if ( f_date ) {
        var dd_d=f_date.split('/');
            var day = dd_d[1];
            var month = dd_d[0];
            var year =dd_d[2] ;
          }
     var cors=""; 
    if (location.hostname.search("192.168")>=0 || location.hostname.search("tnt")>=0  ||  location.hostname.search("localh")>=0){ 
         //cors="https://cors-anywhere.herokuapp.com/";   
    } 
     var date_format=year+"/"+month+"/"+day;
    var data={
      "date_format":date_format,
      "airline":airline_code,
      "flight_no":flight_no
    };

    //var flight_url="https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/"+airline_code+"/"+flight_no+"/dep/"+date_format+"?appId=ee26e160&appKey=1207fce2236ca2f155959cdf16009bab&utc=false";
   var flight_url="https://api.flightstats.com/flex/schedules/rest/v2/json/flight/status/"+airline_code+"/"+flight_no+"/dep/"+date_format+"?appId=ee26e160&appKey=1207fce2236ca2f155959cdf16009bab&utc=false";
   
     var flight_url="https://api.flightstats.com/flex/schedules/rest/v1/json/flight/"+airline_code+"/"+flight_no+"/departing/"+date_format+"?appId=ee26e160&appKey=1207fce2236ca2f155959cdf16009bab&utc=false";
   

    let result  = this.http.post(environment.ip+'/search_flight',data).pipe(map((response: Response) => response));
        return result; 
  }

  public image_base64(url:any){ 
    var data={
      "image_url":url, 
    }; 
    let result  = this.http.post(environment.ip+'/image_to_b64',data).pipe(map((response: Response) => response));
        return result; 
  }
  public searchFlightApi2(airline_code:any,flight_no:any,f_date:any){ 
     if ( f_date ) {
        var dd_d=f_date.split('/');
            var day = dd_d[1];
            var month = dd_d[0];
            var year =dd_d[2] ;
          }
     var cors=""; 
    if (location.hostname.search("192.168")>=0 || location.hostname.search("tnt")>=0  ||  location.hostname.search("localh")>=0){ 
         //cors="https://cors-anywhere.herokuapp.com/";   
    } 
     var date_format=year+"/"+month+"/"+day;
    var flight_url="https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/"+airline_code+"/"+flight_no+"/dep/"+date_format+"?appId=ee26e160&appKey=1207fce2236ca2f155959cdf16009bab&utc=false";
   
    

    let result  = this.http.get(cors+flight_url
      // ,{
      //   headers: 
      //      {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'  }
      //  }
      ).pipe(map((response: Response) => response));
        return result; 
  }
  public search_hotels(key:any){
     var cors=""; 
    if (location.hostname.search("192.168")>=0 || location.hostname.search("tnt")>=0 ||  location.hostname.search("localh")>=0 ){ 
        // cors="https://cors-anywhere.herokuapp.com/";   
    } 
    
    let result  = this.customHttpClient.get(cors+'https://engine.hotellook.com/api/v2/lookup.json?query='+key+'&lang=en&lookFor=hotel&limit=10&token=3ab817b8117c83d3ab36b9f6015c988d').pipe(map((response: Response) => response));
        return result; 
  }
  public fetch_hotels(key:any){
    var cors=""; 
        if (location.hostname.search("192.168")>=0 || location.hostname.search("tnt")>=0  ||  location.hostname.search("localh")>=0){ 
             //cors="https://cors-anywhere.herokuapp.com/";   
        } 
    let result  = this.customHttpClient.get(cors+'https://engine.hotellook.com/api/v2/lookup.json?query='+key+'&lang=en&lookFor=hotel&limit=10&token=3ab817b8117c83d3ab36b9f6015c988d').pipe(map((response: Response) => response));
        return result; 
  }
  public getHeaderFooter(type){
        var data={"type":type}
        let result  = this.http.post(environment.ip+'/header_footer_type',data).pipe(map((response: Response) => response));
        return result;
       
  }
  public getItineraryEdit(id){
     let result  = this.http.get(environment.ip+'/rest_itineraries_new/'+id).pipe(map((response: Response) => response));
    return result;
  } 
  public getOpp(id){
     let result  = this.http.get(environment.ip+'/rest_opp_itinerary_create?opportunity_id='+id).pipe(map((response: Response) => response));
    return result;
  }
  public getItineraryDetails(id){
     let result  = this.http.get(environment.ip+'/rest_itineraries_new/'+id).pipe(map((response: Response) => response));
    return result;
  }
public getHotelList(id){
     let result  = this.http.get(environment.ip+'/hotel_list/'+id).pipe(map((response: Response) => response));
    return result;
  }
  
  public addInclusion(datas:any,inc_flag,id){
    if(inc_flag==1){
        let result = this.http.patch(environment.ip+'/rest_user_itinerary_inclusions/'+datas.id,datas).pipe(map((response: Response) => response));
         return result;
    }else{
       let result = this.http.post(environment.ip+'/rest_user_itinerary_inclusions',datas).pipe(map((response: Response) => response));
       return result;

    }

 }
 public addNewFlight(datas:any){
    var flights={"flight_data":datas};
  let result = this.http.post(environment.ip+'/rest_itinerary_flights_new',flights).pipe(map((response: Response) => response));
  return result;
 
 }

  public imagesFromPullit(datas:any){
    var dest={"destinations":datas};
  let result = this.customHttpClient.post(environment.pullit+'/api/det_top_des_img',dest).pipe(map((response: Response) => response));
  return result;
 
 }
public addFlight(datas:any){ 
    
  let result = this.http.post(environment.ip+'/rest_itinerary_flights',datas).pipe(map((response: Response) => response));
  return result;
 
 }
 public UpdateFlight(datas:any,id:any){
    
  let result = this.http.patch(environment.ip+'/rest_itinerary_flights_new/'+id,datas).pipe(map((response: Response) => response));
  return result;

 }

 public UpdateDayLocations(itin_id:any,day_id:any,destinations:any,){

    var datas={"itinerary_id":itin_id,"day_id":day_id,"destinations":destinations}; 
    
  let result = this.http.post(environment.ip+'/update_day_destinations',datas).pipe(map((response: Response) => response));
  return result;

 }


 public UpdateDayDescriptions(itin_id:any,day_id:any,descriptions:any,){
    var cors=""; 
    if (location.hostname.search("192.168")>=0 || location.hostname.search("tnt")>=0 ||  location.hostname.search("localh")>=0 ){ 
        // cors="https://cors-anywhere.herokuapp.com/";   
    } 

    var datas={"itinerary_id":itin_id,"day_id":day_id,"descriptions":descriptions}; 
    
  let result = this.http.post(cors+environment.ip+'/update_day_descriptions',datas).pipe(map((response: Response) => response));
  return result;

 }


public attachItinerary(datas:any){
    
  let result = this.http.post(environment.ip+'/rest_opp_itinerary_attach',datas).pipe(map((response: Response) => response));
  return result;

 }
 
  public CreateBasicItinerary(datas:any,id:any,pData:any){
    var cors=""; 
    if (location.hostname.search("192.168")>=0   ||  location.hostname.search("localh")>=0){ 
        // cors="https://cors-anywhere.herokuapp.com/";   
    } 
    if(id>0){
  let result = this.http.patch(cors+environment.ip+'/rest_itineraries_new/'+id,pData).pipe(map((response: Response) => response));
  return result;

    }else{
  let result = this.http.post(cors+environment.ip+'/rest_itineraries_new',datas).pipe(map((response: Response) => response));
  return result;

    }
 }
 
  public CopyItinerary(datas:any){
     
  let result = this.http.post(environment.ip+'/rest_itineraries_copy',datas).pipe(map((response: Response) => response));
  return result;
 
 }
  public updateImage(datas:any){
  let result = this.http.post(environment.ip+'/itinerary_banner_image',datas).pipe(map((response: Response) => response));
  return result;
 }
  public addItemItinerary(datas:any){
  let result = this.http.post(environment.ip+'/rest_itinerary_schedule_new',datas).pipe(map((response: Response) => response));
  return result;
 }

  public updateItemItinerary(datas:any,id:any){
    var cors=""; 
    if (location.hostname.search("192.168")>=0   ||  location.hostname.search("localh")>=0){ 
         cors="https://cors-anywhere.herokuapp.com/";   
    } 
  let result = this.http.post(cors+environment.ip+'/rest_itinerary_schedule_new/'+id+'?_method=PATCH',datas).pipe(map((response: Response) => response));
  return result;
 }

public search_itin(key:any){
    let result = this.http.get(environment.ip+'/search_itinerary?search='+key).pipe(map((response: Response) => response));
    return result;
  }   
  public addHotelItinerary(datas:any){
     var cors=""; 
    if (location.hostname.search("192.168")>=0  ||  location.hostname.search("localh")>=0){ 
       //  cors="https://cors-anywhere.herokuapp.com/";   
    } 
  let result = this.http.post(cors+environment.ip+'/rest_itinerary_hotels',datas).pipe(map((response: Response) => response));
  return result;
 }
  public updateHotelItinerary(id:any,datas:any){
     var cors=""; 
    if (location.hostname.search("192.168")>=0  ||  location.hostname.search("localh")>=0){ 
         cors="https://cors-anywhere.herokuapp.com/";   
    } 
  //let result = this.http.patch(cors+environment.ip+'/rest_itinerary_hotels/'+id,datas).pipe(map((response: Response) => response));
  
let result = this.http.post(cors+environment.ip+'/rest_itinerary_hotels/'+id+'?_method=PATCH',datas).pipe(map((response: Response) => response));
  
  return result;
 }

  public searchPoi(datas:any){
  let result = this.customHttpClient.post(environment.pullit+'api/searchPoi',datas).pipe(map((response: Response) => response));
  return result; 
 }

 public send_itin_email(emailId,id){
  var datas={"email_id":emailId,'itinerary_id':id};
   var cors=""; 
    if (location.hostname.search("192.168")>=0  ||  location.hostname.search("localh")>=0){ 
         cors="https://cors-anywhere.herokuapp.com/";   
    } 
  let result = this.http.post(cors+environment.ip+'/send_itinerary_email',datas).pipe(map((response: Response) => response));
  return result;
 }
 public searchAirport(datas:any){
  let result = this.customHttpClient.post(environment.pullit+'api/get_airports',datas).pipe(map((response: Response) => response));
  return result;
 }
 public getPoi(dest_name,country_id){
    let result  = this.http.get(environment.pullit+'get_all_poi/'+dest_name+'/'+country_id).pipe(map((response: Response) => response));
      return result;
    }
    public getPoidetails(poi_id){
    let result  = this.http.get(environment.pullit+'get_all_poi_details/'+poi_id).pipe(map((response: Response) => response));
      return result;
    }

    public checkUrl(url:any){
    var cors=""; 
        if (location.hostname.search("192.168")>=0   ||  location.hostname.search("localh")>=0){ 
             cors="https://cors-anywhere.herokuapp.com/";   
        } 
    let result  = this.customHttpClient.get(cors+url).pipe(map((response: Response) => response));
        return result; 
  }

   public DeleteItinerary(id){
     var data={'id':id};
     let result  = this.http.post(environment.ip+'/delete_itinerary',data).pipe(map((response: Response) => response));
    
     return result;
  }
}
