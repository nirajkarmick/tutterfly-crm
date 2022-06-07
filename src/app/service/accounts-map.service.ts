import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpResponse} from '@angular/common/http';
import {RequestOptions, Request, Headers } from '@angular/http';


@Injectable()
export class AccountsMapService {
  accTypeMapData:any;
  accParentMapData:any;
  ratingsMapData:any;
  industriesMapData:any;
  constructor() { }

  public setUpMaps(data:any){
    this.accTypeMapData=data.accounts_types;
    this.accParentMapData=data.accounts_parents;
    this.ratingsMapData=data.ratings;
    this.industriesMapData=data.industries;
  }

}
