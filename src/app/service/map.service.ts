import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../../environments/environment";
import { MatDialog } from '@angular/material';

import { MapsAPILoader } from '@agm/core';
import { Observable ,  Subject ,  of ,  from as fromPromise } from 'rxjs';
import { filter, catchError, tap, map, switchMap } from 'rxjs/operators';

declare var google: any;

@Injectable() 

export class MapService {
private geocoder: any;
  constructor(private http:HttpClient,private dialog:MatDialog,private mapLoader: MapsAPILoader) { }

  
     private initGeocoder() {console.log('Geocoding init!');
    this.geocoder = new google.maps.Geocoder();
  }

  private waitForMapsToLoad(): Observable<boolean> {
    if(!this.geocoder) {
      return fromPromise(this.mapLoader.load())
      .pipe(
        tap(() => this.initGeocoder()),
        map(() => true)
      );
    }
    return of(true);
  }


    geocodeAddress(address:any){ 
         var data={'address':address};
        let result = this.http.post(environment.ip+'/get_lat_long',data).pipe(map((response: Response) => response));
        return result; 
  
 }
     geocodeAddress2(location: string): Observable<Location> {
    return this.waitForMapsToLoad().pipe(
      // filter(loaded => loaded),
      switchMap(() => {
        return new Observable((observer:any) => { console.log('Geocoding start!');
          this.geocoder.geocode({'address': location}, (results, status) => {
            console.log(results);
            if (status == google.maps.GeocoderStatus.OK) {
              console.log('Geocoding complete!');              
              observer.next({
                lat: results[0].geometry.location.lat(), 
                lng: results[0].geometry.location.lng()
              });
            } else {
                //console.log('Error - ', results, ' & Status - ', status);
                observer.next({ lat: 0, lng: 0 });
            }
            observer.complete();
          });
        })        
      })
    )
  }
 
}
export interface Location {
  lat?: number; 
  lng?: number;
}