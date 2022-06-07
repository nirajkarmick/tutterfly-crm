
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core'; 
import { HttpClient,HttpBackend,HttpHeaders} from '@angular/common/http';
import { environment } from "../../environments/environment";
import { MatDialog } from '@angular/material'; 
@Injectable()
export class LoginServiceService {
private customHttpClient: HttpClient;
  constructor(private http: HttpClient, private dialog: MatDialog,private backend: HttpBackend) {
        this.customHttpClient = new HttpClient(backend); 
    }

  public login(credentials: any) {
    let data: any;
    return this.http.post(environment.ip + '/login', credentials);
  }
  public check_domain(credentials: any) {
    let data: any;
    var cors = "";
    if (location.hostname.search("192.168") >= 0 || location.hostname.search("tnt") >= 0 || location.hostname.search("localh") >= 0) {
      cors = "https://cors-anywhere.herokuapp.com/";
    }
    return this.http.get(cors + environment.ip + '/check_domain/' + credentials);;
  }

  public accessAccount(credentials: any) {
    let data: any;
    return this.http.post(environment.ip + '/access_login', credentials);;
  }
  public adressToLatLong(address: String) {
    let data: any;
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '+&key=' + environment.coordinateKey);
  }
  public defaultData() {
    return this.http.get(environment.ip + '/register');
  }
  public fetchState(country: string) {
    return this.http.post(environment.ip + '/states', { country_id: country });
  }
  public register(register: any) {
    // register.timezone=new Date().getTimezoneOffset();
    return this.http.post(environment.ip + '/register', register);
  }
  public resend(email: any) {
    return this.http.post(environment.ip + '/verify/email/resend', email);
  }
  public verifyEmail(email: any) {
    return this.http.post(environment.ip + '/verify/normal_email/resend', email);
  }
  public forgotPassword(email: string) {
    // return this.http.post(environment.ip+'/UserPasswordReset',{"email":email});
    return this.http.post('https://www.tutterflycrm.com/tfc/api/UserPasswordReset', { "email": email });
  }
  public logout() {
    let data: any;
    return this.http.post(environment.ip + '/logout', null);;
  }
  public searchOptions() {
    return this.http.get(environment.ip + '/rest_search_modules');
  }
  public getSubscriptionList(tenant_id: any) {
    var data = { "tenant_id": tenant_id };
    return this.http.post('https://www.tutterflycrm.com/tfc/api/get-product', data);
  }

  public getProductDetails(product_id: any, tenant_id: any) {
    var data = { 'product_id': product_id, 'tenant_id': tenant_id };
    return this.http.post('https://www.tutterflycrm.com/tfc/api/get-plans', data);
  }
  public getSubscriptionDetails(plan_id: any, tenant_id: any) {
    var data = { 'plan_id': plan_id, 'tenant_id': tenant_id };
    return this.http.post('https://www.tutterflycrm.com/tfc/api/get-single-plan', data);
  }

  public subscription_update(plan_id: any, tenant_id: any) {
    var data = { 'plan_id': plan_id, "tenant_id": tenant_id };
    return this.http.get(environment.ip + '/subscription_update?hostedpage=' + plan_id);
  }


  public searchResults(squery: any) {
    return this.http.post(environment.ip + '/rest_search_modules', squery);
  }
  public check_tfc_update(code: any) {
    // var datas={'message':'Y'};
    //return datas;
    return this.http.get('https://www.tutterflycrm.com/tfc/api/check_tfc_update?code=' + code);
  }
  public check_user_exception(user_token: any) {
    return this.http.get('https://www.tutterflycrm.com/tfc/api/check_user_exception/' + user_token);
  }
  public check_users_subscription() {
    return this.http.get(environment.ip + '/check_tenant_subscription');
  }
  public setUpEmailTenant() {
    //let result  = this.http.get('http://www.tutterflycrm.com/core-tfc/email.php').map((response: Response) => response);
    let result = this.http.post(environment.ip + '/rest_setup_mail', {}).pipe(map((response: Response) => response));

    return result;
  }
  public sendMail(mail: any) {
    let result = this.http.post(environment.ip + '/rest_emails', mail).pipe(map((response: Response) => response));
    return result;
  }
  public getTemplates() {
    return this.http.get(environment.ip + '/rest_email_templates');
  }
  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'Bearer ' +
      localStorage.getItem('token')); 
  }

  public addNotes(data: any) { 
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization: 'Bearer ' +
            localStorage.getItem('token')
        })
    };
    let result = this.customHttpClient.post(environment.ip + '/rest_notes_add', data ,httpOptions).pipe(map((response: Response) => response));
    return result;
  }

  public getNotes(data: any) {
    let result = this.http.post(environment.ip + '/rest_notes_get', data).pipe(map((response: Response) => response));
    return result;
  }
  public getS3Url() {
    return this.http.get(environment.ip + '/get_s3_url');
    // let result = this.http.post(environment.ip + '/rest_notes_get', data).pipe(map((response: Response) => response));
    // return result;
  }
}
