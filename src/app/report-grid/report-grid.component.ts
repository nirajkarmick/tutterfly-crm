import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ReportService } from '../service/report.service';

@Component({
  selector: 'app-report-grid',
  templateUrl: './report-grid.component.html',
  styleUrls: ['./report-grid.component.css']
})
export class ReportGridComponent implements OnInit,AfterViewInit {
  constructor(private chref :ChangeDetectorRef,private service:ReportService) { }
  userMap:Map<number,any>= new Map();
  keys=[];
  displayColumns=[];
  _source=new  MatTableDataSource([]);
  breadCrumbs=[];
  gridData: any[];
  mainReport=false;
  @Input() type:String;
  isFolder=false;
  @Input('isFolder')  set verifyFolder(bool:boolean){
    // alert(bool);
    this.isFolder=bool;
    this.mainReport=true;
  } 
  @Input('grid') set source(data: any) {
    if (data && data.length!=0) {
      this.gridChange(data);
      this.breadCrumbs=JSON.parse(localStorage.getItem("bc"));
    }
  }
  @Output() changeBread=new EventEmitter<boolean>();
  gridChange(val:any) {
    this._source = new MatTableDataSource(val);
    this._source.paginator = this.paginator;
    this._source.sort = this.sort;
    if(this._source.paginator)
    this._source.paginator.firstPage();
  }
  @Input("colSetting")  set setDisplayColumns(data: any[]){
    this.displayColumns=data;
    this.keys=[];
    if(data){
      for(let obj of data){
        this.keys.push(obj.name);
      }
    }
 
  }
  @Input() set users(data:any[]){
    if(data)
    for(let obj of data){
      this.userMap.set(obj.id,obj.name);
    }
  }
  navigate(fieldName:string,id:number){
    if(fieldName=='name'){
     
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
  }
  ngAfterViewInit(){
    
    this.chref.detectChanges();
  }
  getNextFolderListTable(id:number,name:string,breadIndex:number){
    
    this.mainReport=false;
   if(id==-1){
     this.outputCall();
   } else{
    if(!breadIndex){
      this.breadCrumbs.push({"id":id,"Name":name});
    localStorage.setItem("bc",JSON.stringify(this.breadCrumbs));
    }else{
      this.breadCrumbs.splice(breadIndex+1);
      localStorage.setItem('bc',JSON.stringify(this.breadCrumbs))
    }
    this.service.getNextFolderListTable(id).subscribe((data:any)=>{
      this.gridData=[];
      let that=this;
      if(data.reports && data.reports.length > 0){
        Object.keys(data.reports).map(function(key) {
                 that.gridData.push(data.reports[key]);
        });       
             
      }
      if(data.sub_folders && data.sub_folders.length > 0){
        Object.keys(data.sub_folders).map(function(key) {
                 that.gridData.push(data.sub_folders[key]);
        }); 
     // this.gridData.push(data.sub_folders);         
      }
      console.log(this.gridData);
      //this.gridChange(data.sub_folders);
      this.gridChange(this.gridData);
    })
   }
   
  }

  outputCall(){
    this.changeBread.emit(true);
  }
}


