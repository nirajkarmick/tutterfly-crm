
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http:HttpClient) {}
  graphData(){
    let result  = this.http.get(environment.ip+'/rest_dashboard').pipe(map((response: Response) => response));
   return result;
  }
  getBlade_v(){
    let result  = this.http.get(environment.ip+'/test_v_blade').pipe(map((response: Response) => response));
   return result;
  }
  setTarget(target:any){
    let result  = this.http.post(environment.ip+'/rest_monthly_performance',{"target_amount" :target}).pipe(map((response: Response) => response));
   return result;
  }
  getUserFeed(){
    let result  = this.http.get(environment.ip+'/rest_user_activities').pipe(map((response: Response) => response));
    return result;
  }
  getProfile(userId){
    let result  = this.http.get(environment.ip+'/rest_profiles/'+userId).pipe(map((response: Response) => response));
    return result;
  }
  updateProfile(id:number,profile:any){
    let result = this.http.patch(environment.ip+'/rest_profiles/'+id,profile).pipe(map((response: Response) => response));
    return result;
  }

  updateUserFooter(footer:any){
    let result = this.http.post(environment.ip+'/rest_email_footer_user',footer).pipe(map((response: Response) => response));
    return result;
  }
  updatePasswd(password:any){
    let result = this.http.post(environment.ip+'/rest_profiles_update_password',password).pipe(map((response: Response) => response));
    return result;
  }
  updateAvatar(profile:FormData){
    let result = this.http.post(environment.ip+'/rest_avatars/upload',profile).pipe(map((response: Response) => response));
    return result;
  }
  updateBanner(profile:FormData){
    let result = this.http.post(environment.ip+'/rest_banners/upload',profile
    ).pipe(map((response: Response) => response));
    return result;
  }
  // getUpdate(url:string){
  //   let result  = this.http.get(url).map((response: Response) => response);
  //   return result;
  // }
   getUpdate(page_no:any){
    var page= parseInt(page_no) + 1;
    let result  = this.http.get(environment.ip+'/rest_user_activities?page='+page).pipe(map((response: Response) => response));
   // let result  = this.http.get('https://tnt1.tutterflycrm.com/tfc/api/rest_user_activities?page=2').map((response: Response) => response);
    return result;
  }
}
