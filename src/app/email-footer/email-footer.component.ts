import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatProgressSpinnerModule, MatSortModule, MatSort, MatTableModule, MatInputModule, MatAutocompleteModule, MatButtonModule, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { AdminServiceService } from '../service/admin-service.service';
import { AlertBoxComponent } from '../alert-box/alert-box.component';

@Component({
  selector: 'app-email-footer',
  templateUrl: './email-footer.component.html',
  styleUrls: ['./email-footer.component.css']
})
export class EmailFooterComponent implements OnInit {
  serviceRef: Subscription;
  DATA_LinkInfo: any[];
  roles: any[];
  displayTable: boolean;
  @ViewChild(MatPaginator) paginatorLinkInfo: MatPaginator;
  @ViewChild(MatSort) sortLinkInfo: MatSort;
  displayedColumnsLinkInfo: string[];
  dataSourceLinkInfo = new MatTableDataSource<any>(this.DATA_LinkInfo);
  newElement: any;
  active_checked = true;
  constructor(private service: AdminServiceService, public dialog: MatDialog) {
    this.fetchAllData();
  }
  dtOptions: DataTables.Settings = {};
  ngOnInit() {
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 25,
            processing: true, 
          }; 
  }
  active() {
    if (this.newElement.single_active == 1) {
      this.newElement.single_active == 0;
      this.active_checked = false;
    } else {
      this.newElement.single_active == 1;
      this.active_checked = true;
    }
  }
  emailFooter: any;
  fetchAllData() {
    this.serviceRef = this.service.getFooters().subscribe((data: any) => {
      this.DATA_LinkInfo = data.email_footers;
      this.emailFooter = data.email_footers;
      this.displayedColumnsLinkInfo = ['sno', 'name', 'footer_content_html', 'single_active', 'created_at', 'updated_at', 'action'];
      this.dataSourceLinkInfo = new MatTableDataSource<any>(this.DATA_LinkInfo);
      this.displayTable = true;
    });
  }
  modalAdd: boolean = false;
  AddNewShow(element: any) {
    if (element) {
      this.newElement = element;
      this.idUpdate = element.id;
      this.buttonLable = 'Save';
      this.titleLable = 'Edit';
    } else {
      this.newElement = new Object;
      this.newElement.footer_content_html = '';
      this.newElement.single_active = 0;
      this.active_checked = false;
      this.buttonLable = 'Add';
      this.titleLable = 'Add';
    }
    this.modalAdd = true;
  }
  AddNewHide() {
    this.modalAdd = false;
  }
  onHtmlChange(html) {
    this.newElement.footer_content_html = html;
    console.log(this.newElement.footer_content_html);
  }
  modalEdit: boolean = false;
  modalEditShow() {
    this.modalEdit = true;
  }
  modalEditHide() {
    this.modalEdit = false;
  }

  create() {
    if (this.buttonLable == 'Add') {
      console.log(this.newElement);
      this.service.saveFooter(this.newElement).subscribe((data: any) => {
        console.log(data)
        this.AddNewHide();
        this.fetchAllData();
        this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
      });
    } else {
      this.service.updateFooter(this.idUpdate, this.newElement).subscribe((data: any) => {
        console.log(data)
        this.AddNewHide();
        this.fetchAllData();
        this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
      });
    }
  }

  deleteEmailFooter(id) {
    var conf = confirm('Are you sure to delete email footer ?');
    if (conf) {
      this.service.deleteEmailFooter(id).subscribe((data: any) => {
        this.fetchAllData();
        this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
      });
    }
  }
  popUpMsg: string;
  openDialog(): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '250px',
      data: this.popUpMsg
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  buttonLable = 'Add';
  titleLable = 'Add';
  idUpdate: number;
  ngOnDestroy() {
    this.serviceRef.unsubscribe();
  }
}