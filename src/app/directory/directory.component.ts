import {Component, OnInit, NgModule} from '@angular/core';
import {FileService} from '../file.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.css']
})
export class DirectoryComponent implements OnInit {

  constructor(
    private fileService: FileService,
  ) {
    this.DirectoryData();
    this.Directorystatus();
  }

  status: any;
  directory_data: any;
  directory_dataType: any;
  firstLogin: any;

  DirectoryData() {
    this.fileService.getDirectory().subscribe((res: any) => {
      this.directory_data = res.data;
      console.log(this.directory_data, 'sdfasdf');
      const login_id = localStorage.getItem('userId');
      if (this.directory_data.length > 0) {
        for (const user of this.directory_data) {
          this.firstLogin = user.first_login;
          console.log(user, 'asdfasdfadsfasdfasdfasdfasdfasdf');
          if (user.id == login_id) {
            this.status = user.status_id;
          }
        }
      }
    });
  }

  Directorystatus() {
    this.fileService.getDirectorytype().subscribe((res: any) => {
      this.directory_dataType = res.all_status;
      console.log(this.directory_dataType, 'Type');
    });
  }

  statusSend() {
    const data = {
      'status_id': this.status
    };
    console.log(this.status);
    this.fileService.userDirectoryStatus(data).subscribe((res: any) => {
      console.log(res, 'status');
      this.DirectoryData();
    });
  }

  /*time() {
    start = start.split(":");
    end = end.split(":");
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);

    return (hours < 9 ? "0" : "") + hours + ":" + (minutes < 9 ? "0" : "") + minutes;
  }*/

  dtOptions: DataTables.Settings = {};
  ngOnInit() {
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 25,
            processing: true, 
          }; 
  }
}
