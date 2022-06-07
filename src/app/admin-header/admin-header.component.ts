import { Component, OnInit,Input } from '@angular/core';
import { LoginServiceService } from '../service/login-service.service';
import { Router, ParamMap ,ActivatedRoute} from '@angular/router';
import { Title ,Meta} from '@angular/platform-browser'; 

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {

  constructor(private meta:Meta,private titleService:Title,private service:LoginServiceService,private router: Router) {
    
        this.meta.addTags([
          {name: 'description', content: 'Close more deals, sell more, and grow your travel & hospitality business faster with TutterflyCRM. Sign up now for FREE CRM Trial and Demo!'},
          {name: 'author', content: 'TutterflyCRM Admin'},
          {name: 'keywords', content: 'TutterflyCRM Signup, CRM Trail, TutterflyCRM Free Trail, TutterflyCRM Registration'}
        ]);
       this.titleService.setTitle('TutterflyCRM Admin');
   }
  userName:string;
  userImage:string;
  @Input() users:any;
  ngOnInit() {
    this.userName=localStorage.getItem('user');
    this.userImage=localStorage.getItem('userImage');
    this.users=this.userName; 
  }
   logout(){
    this.service.logout().subscribe();
    var last_login_id=localStorage.getItem("userId");
    localStorage.clear();
    localStorage.setItem('last_login_id', last_login_id);
    localStorage.setItem('url', '');
    //window.location.href='https://Tutterflycrm.com/app/';
    this.router.navigate(['/']);
   }

}
