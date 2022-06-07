import { Component, OnInit, Input } from '@angular/core';
import { MapService } from '../service/map.service';
import { FormService } from '../service/form.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html', 
  styleUrls: ['./map.component.css'],
  providers: [MapService]
})
export class MapComponent implements OnInit {
  lat: any;
  lng: any;
  @Input() address:string;
  constructor(private service:MapService,private fService:FormService) {
  }

  ngOnInit() {
  

     this.service.geocodeAddress(this.address).subscribe((data:any)=>{
      console.log(data) 
          if(data.data && data.data.status=='OK'){ 
            this.lat=data.data.results[0].geometry.location.lat; 
            this.lng=data.data.results[0].geometry.location.lng;  
          }else{      
            this.lat=0; 
            this.lng=0; 
          }
    },
    error =>{
      console.log("ERROR " + JSON.stringify(error));
    } );
 
    // try {
    //  setTimeout(() => {        
    //           this.service.geocodeAddress(this.address).subscribe((data:any)=>{
    //             this.lat=data.lat;
    //             this.lng=data.lng;
    //           },
    //           error =>{
    //             console.log("ERROR " + JSON.stringify(error));
                
    //           } );
        
      
    // } catch (error) {
    //   console.log(JSON.stringify(error));
    // }
   
  }

}
