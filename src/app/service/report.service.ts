
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {environment} from "../../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http:HttpClient) { }
  public getIndexCall(report_type_id){
    let result = this.http.get(environment.ip+'/rest_reports?reportable_type_id='+report_type_id).pipe(map((response: Response) => response));
    return result;
  }
  public getPrivateReport(report_type_id){
    let result = this.http.get(environment.ip+'/rest_private_reports?reportable_type_id='+report_type_id).pipe(map((response: Response) => response));
    return result;
  }
  public getPublicReport(report_type_id){
    let result = this.http.get(environment.ip+'/rest_public_reports?reportable_type_id='+report_type_id).pipe(map((response: Response) => response));
    return result;
  }
     public get_standard_report_list(report_type_id){
      let result = this.http.post('https://www.tutterflycrm.com/tfc/api/standard_report_list',{"reportable_type_id": report_type_id}).pipe(map((response: Response) => response));
      return result;
        
     }
  public getCreatedByMeReport(report_type_id){
    let result = this.http.get(environment.ip+'/rest_reports_created_by_me?reportable_type_id='+report_type_id).pipe(map((response: Response) => response));
    return result;
  }
  public getFolderCreatedByMe(report_type_id){
    let result = this.http.get(environment.ip+'/rest_folders_created_by_me?reportable_type_id='+report_type_id).pipe(map((response: Response) => response));
    return result;
  }
  public getSharedWithMe(report_type_id){
    let result = this.http.get(environment.ip+'/rest_shared_with_me_folders?reportable_type_id='+report_type_id).pipe(map((response: Response) => response));
    return result;
  }
  public getAllFolder(){
    let result = this.http.get(environment.ip+'/rest_folders').pipe(map((response: Response) => response));
    return result;
  }
  public getOperators(){
    let result = this.http.get(environment.ip+'/operators').pipe(map((response: Response) => response));
    return result;
  }
  public getMetaData(){
    let result = this.http.get(environment.ip+'/rest_reports/create').pipe(map((response: Response) => response));
    return result;
  }
  public getCreateReportMetadata(repostType:number){
    let result = this.http.post(environment.ip+'/rest_reports/reportable_type',{"reportable_type_id": repostType}).pipe(map((response: Response) => response));
    return result;
  }
  public getReport(id:number){
    let result = this.http.get(environment.ip+'/rest_reports/'+id+"/edit").pipe(map((response: Response) => response));
    return result;
  }
  public createdPreview(previewObject:any){
    let result = this.http.post(environment.ip+'/rest_report_previews',previewObject).pipe(map((response: Response) => response));
    return result;
  }
  public save(previewObject:any){
    let result = this.http.post(environment.ip+'/rest_reports',previewObject).pipe(map((response: Response) => response));
    return result;
  }
  public updateReport(reportId:number,previewObject:any){
    let result = this.http.patch(environment.ip+'/rest_reports/'+reportId,previewObject).pipe(map((response: Response) => response));
    return result;
  }
  public getFolderList(){
    let result = this.http.get(environment.ip+'/rest_folders_list').pipe(map((response: Response) => response));
    return result;
  }
  public getNextFolderList(id:number){
    let result = this.http.get(environment.ip+'/rest_folders_list/'+id).pipe(map((response: Response) => response));
    return result;
  }
  public showReportData(id:number,page=0){
    if(page>0){
    let result = this.http.get(environment.ip+'/rest_reports/'+id+'?page='+page+'&no_p=0').pipe(map((response: Response) => response));
    return result;

    }else{
    let result = this.http.get(environment.ip+'/rest_reports/'+id).pipe(map((response: Response) => response));
    return result;

    }
  }
 public ExportReportData(id:number){
    let result = this.http.get(environment.ip+'/rest_reports/'+id+'?no_p=true').pipe(map((response: Response) => response));
    return result;


  }
 public FormatReportData(reportData:any,type:any){ 
    var data={"data":reportData,"type":type};
    //var cors='https://cors-anywhere.herokuapp.com/';
   var cors ="";
    let result = this.http.post(cors+environment.ip+'/format_data_export',data).pipe(map((response: Response) => response));
    return result;
  }
 public showStandardReportData(id:number,page=0,date_range_type='week',no_pagination=false){ 
    
    let result = this.http.post(environment.ip+'/rest_st_report',{"page":page,"reportable_type_id":id,"date_range_type":date_range_type,"no_pagination":no_pagination}).pipe(map((response: Response) => response));
    return result;
  }
  public getNextFolderListTable(id:number){
    let result = this.http.get(environment.ip+'/rest_folders/'+id).pipe(map((response: Response) => response));
    return result;
  }

  public createFolder(parentId:number,name:string){
    let result = this.http.post(environment.ip+'/rest_folders',{"name":name,"parent_id":parentId}).pipe(map((response: Response) => response));
    return result;
  }
   public getLeadPicklist(){
     let result = this.http.get(environment.ip+'/rest_leads/create').pipe(map((response: Response) => response));
     return result;
   }

    public getAccPicklist(){
      let result = this.http.get(environment.ip+'/rest_accounts/create').pipe(map((response: Response) => response));
      return result;
    }



}
