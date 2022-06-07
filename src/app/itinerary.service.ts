
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
// import { Itinerary } from './itinerary-create/itinerary';
import { isDate } from 'rxjs/internal/util/isDate';

@Injectable({
  providedIn: 'root'
})
export class ItineraryService {

  constructor(private http:HttpClient) { }


  public getAllItinerary(page=1){
     let result  = this.http.get(environment.ip+'/rest_itineraries?page='+page).pipe(map((response: Response) => response));
    return result;
  }
 public delete_shed_items(id){
     let result  = this.http.delete(environment.ip+'/rest_itinerary_schedule_items/'+id).pipe(map((response: Response) => response));
    return result;
  }


  public getAllCategories(){
        let result  = this.http.get(environment.ip+'/rest_itinerary_categories').pipe(map((response: Response) => response));
        return result;
       
  }
  public search_hotels(key:any){
    let result  = this.http.get('https://cors-anywhere.herokuapp.com/https://engine.hotellook.com/api/v2/lookup.json?query='+key+'&lang=en&lookFor=hotel&limit=10&token=3ab817b8117c83d3ab36b9f6015c988d').pipe(map((response: Response) => response));
        return result;
      //return key;
  }
  public getHeaderFooter(type){
        var data={"type":type}
        let result  = this.http.post(environment.ip+'/header_footer_type',data).pipe(map((response: Response) => response));
        return result;
       
  }
  public getItineraryEdit(id){
     let result  = this.http.get(environment.ip+'/rest_itineraries/'+id).pipe(map((response: Response) => response));
    return result;
  } 
  public getOpp(id){
     let result  = this.http.get(environment.ip+'/rest_opp_itinerary_create?opportunity_id='+id).pipe(map((response: Response) => response));
    return result;
  }
  public getItineraryDetails(id){
     let result  = this.http.get(environment.ip+'/rest_itineraries/'+id).pipe(map((response: Response) => response));
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
public addFlight(datas:any){
    
  let result = this.http.post(environment.ip+'/rest_itinerary_flights',datas).pipe(map((response: Response) => response));
  return result;
 
 }
 public UpdateFlight(datas:any,id:any){
    
  let result = this.http.patch(environment.ip+'/rest_itinerary_flights/'+id,datas).pipe(map((response: Response) => response));
  return result;

 }
public attachItinerary(datas:any){
    
  let result = this.http.post(environment.ip+'/rest_opp_itinerary_attach',datas).pipe(map((response: Response) => response));
  return result;

 }
 
  public CreateBasicItinerary(datas:any,id:any,pData:any){
    if(id>0){
  let result = this.http.patch(environment.ip+'/rest_itineraries/'+id,pData).pipe(map((response: Response) => response));
  return result;

    }else{
  let result = this.http.post(environment.ip+'/rest_itineraries',datas).pipe(map((response: Response) => response));
  return result;

    }
 }
  public updateImage(datas:any){
  let result = this.http.post(environment.ip+'/itinerary_banner_image',datas).pipe(map((response: Response) => response));
  return result;
 }
  public addItemItinerary(datas:any){
  let result = this.http.post(environment.ip+'/rest_itinerary_schedule_items',datas).pipe(map((response: Response) => response));
  return result;
 }

  public searchPoi(datas:any){
  let result = this.http.post(environment.pullit+'api/searchPoi',datas).pipe(map((response: Response) => response));
  return result; 
 }
 public searchAirport(datas:any){
  let result = this.http.post(environment.pullit+'api/get_airports',datas).pipe(map((response: Response) => response));
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
}
