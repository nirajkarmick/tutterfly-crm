
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpResponse,HttpBackend} from '@angular/common/http';
import {RequestOptions, Request, Headers } from '@angular/http';
import {environment} from "../../environments/environment"; 

@Injectable()
export class ExtraService { 
private customHttpClient: HttpClient;
  constructor(private http:HttpClient,backend: HttpBackend) {
    this.customHttpClient = new HttpClient(backend);

  }
  
 public search_hotels(key:any){
     var cors=""; 
    if (location.hostname.search("192.168")>=0  ||  location.hostname.search("localh")>=0 ){ 
        // cors="https://cors-anywhere.herokuapp.com/";   
    } 
    
    let result  = this.customHttpClient.get(cors+'https://engine.hotellook.com/api/v2/lookup.json?query='+key+'&lang=en&lookFor=hotel&limit=10&token=3ab817b8117c83d3ab36b9f6015c988d' 
      // ,{
      //   headers: 
      //      {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*','Sec-Fetch-Mode':'no-cors' }
      //  }
      ).pipe(map((response: Response) => response)); 
        return result;      
  }
  
  
  
}
