
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpResponse,HttpBackend} from '@angular/common/http';
import {RequestOptions, Request, Headers } from '@angular/http';

import {environment} from "../../environments/environment";
import { isDate } from 'rxjs/internal/util/isDate';

@Injectable()
export class PullitServiceService {
private customHttpClient: HttpClient;
constructor(private http:HttpClient,private backend: HttpBackend) {
       this.customHttpClient = new HttpClient(backend);
}
   public pullSearch(){
    let result  = this.http.get(environment.pullit+'search-pullit').pipe(map((response: Response) => response));
      return result;
    }
    public pullSearchByKey(keyword:any){
      let result = this.http.get(environment.pullit+'search-pullit?keyword='+keyword).pipe(map((response: Response) => response));
      return result; 
    }
    public pullSearchByGeoname(id:any){
      let result = this.http.get(environment.pullit+'pulldestinationGeonameId?id='+id).pipe(map((response: Response) => response));
      return result; 
    }
    public pullSearchByCountry(country_id:any){
      let result = this.http.get(environment.pullit+'pullcountry?country_id='+country_id).pipe(map((response: Response) => response));
      return result; 
    }
    public pullSearchByDestination(dest_id:any){
      let result = this.http.get(environment.pullit+'pulldestination?dest_id='+dest_id).pipe(map((response: Response) => response));
      return result; 
    }
    public pullSearchByPoi(poi_id:any){
      let result = this.http.get(environment.pullit+'pullpoi?poi_id='+poi_id).pipe(map((response: Response) => response));
      return result; 
    }
    public getPlaceDescription(name){
    // let result='dsasasfsafasf dfdsfdsfs';
      let result = this.http.get('http://cors-anywhere.herokuapp.com/'+'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&titles=Vantaa').pipe(map((response: Response) => response));
      return result; 
    }
    public getVisaDetails(from,to){ 
      var data={"from":from,"to":to};
      let result = this.http.get(environment.pullit+'pullcountryvisa/'+from+'/'+to).pipe(map((response: Response) => response));
      return result;
    }

    public getWeatherReport(lat,long){
    var cors=""; 
    if (location.hostname.search("192.168")>=0  ||  location.hostname.search("localh")>=0){ 
         cors="https://cors-anywhere.herokuapp.com/";   
    } 

      let result = this.customHttpClient.get(cors+'https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+long+'&appid=91d2036228528ad1c20721eac266aa6e').pipe(map((response: Response) => response));
      return result; 

    }
    
}
