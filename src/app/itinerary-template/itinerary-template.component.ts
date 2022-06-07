import {ActivatedRoute, Router, NavigationStart, NavigationEnd, NavigationError} from "@angular/router";
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {NewItineraryService} from "../new-itinerary.service";

import {MatDialog} from "@angular/material";
import {AlertBoxComponent} from "../alert-box/alert-box.component";
import {MessageService} from "../message.service";
import {Flights, Inclusion, Itinerary} from "../new-itinerary-details/itinerary";
import * as jsPDF from "jspdf";
import {base64ToFile, Dimensions, ImageCroppedEvent, ImageTransform} from "ngx-image-cropper";

@Component({
  selector: 'app-itinerary-template',
  templateUrl: './itinerary-template.component.html',
  styleUrls: ['./itinerary-template.component.css']
})
export class ItineraryTemplateComponent implements OnInit {
  showdivtitle = false;
  id: any;
  itineraryData: any;
  itinerary_days: any;
  all_poi: any;
  newActivity: Itinerary = new Itinerary();
  poiImageShow = 0;
  public destOptions: Select2Options;
  isInclusion = 0;
  itinerary_inclusions = [];
  s3_url = "";
  s3_html_url="";
  pdf_file = "";
  allDestinations = [];
  destinations_list = [];
  templates_ = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  templates = [];
  inclusion = new Inclusion();

  first_temp_type = [1, 2, 3, 4, 5];
  second_temp_type = [6, 7, 8, 9, 10];
  third_temp_type = [11, 12, 13, 14, 15];
  fourth_temp_type = [16, 17, 18, 19, 20];
  fifth_temp_type = [21, 22, 23, 24, 25];

  destinationsList = [];
  allVehMode = [];
  more_Inclusion = [];
  isLoading = true;
  s3_pdf = "https://watcons.blob.core.windows.net/tfclive/";
  user_itinerary_inclusion: any;
  itn_header = '';
  itn_footer = '';
  allCategories = [{
    "id": 1,
    "name": "Point Of Interest",
    "icon": "mdi-map-marker-outline"
  }, {
    "id": 2,
    "name": "Transport",
    "icon": "mdi mdi-rv-truck"
  }, {
    "id": 6,
    "name": "No Activity",
    "icon": "mdi mdi-bolnisi-cross"
  }];
  pdf_loader = false;

  flights: any;
  form = new FormData();
  photo: File;
  photo_name: any;
  company_name = "";
  company_logo = "";
  pdf_list = [];
  html_list = [];
// pdf_list=[
// {'file_name':'gatewaytomaldives-54391.pdf'},
// {'file_name':'valentinespecial-71670.pdf'},
// {'file_name':'gatewaytomaldives-71670.pdf'},
// {'file_name':'gatewaytomaldives-54391.pdf'},
// {'file_name':'gatewaytomaldives-71670.pdf'},
// {'file_name':'gatewaytomaldives-54391.pdf'},
// {'file_name':'gatewaytomaldives-71670.pdf'},
// {'file_name':'gatewaytomaldives-54391.pdf'},
// {'file_name':'gatewaytomaldives-71670.pdf'}, ];

  constructor(private route: ActivatedRoute, private itineraryService: NewItineraryService,
              public dialog: MatDialog, private msg: MessageService, private router: Router) {

    this.id = this.route.snapshot.queryParams['id'];
    this.msg.sendMessage('itinerary');
    this.renderData();
    this.newActivity = new Itinerary();


  }

  ngOnInit() {
    this.company_name = localStorage.getItem("company_name");
    this.company_logo = localStorage.getItem("company_logo");
  }

  renderData() {
    $('body').removeClass('modal-open');
    $('body').css('padding-right', 0);
    $('.modal-backdrop').remove();

    this.isLoading = true;
    this.pdf_loader = false;
    this.form = new FormData();
    this.more_Inclusion = [];
    if (this.id) {

      this.itineraryService.getPdfTemplates().subscribe((data: any) => {

        console.log(data);
        this.templates = data.templates;
        if (this.templates && this.templates.length > 0) {
          // this.templates.splice(2,3);
          this.templates.splice(3, 2);
        }

      });
      this.itineraryService.getItineraryDetails(this.id).subscribe((data: any) => {


        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
        console.log(data);
        if (data) {
          this.itineraryData = data.itinerary;
          this.itinerary_days = data.itinerary_days;
          this.destinations_list = data.destinations_db;
          this.allDestinations = [];
          if (data.destinations_db && data.destinations_db) {
            for (let destin of data.destinations_db) {
              //console.log(destin);
              this.allDestinations.push({"id": destin.id, "text": destin.name});
            }
          }
          this.set_days_items();
          console.log(this.allDestinations);
          this.pdf_file = data.pdf_file;
          this.pdf_list = data.pdf_list;
          this.html_list=data.html_list;
          //alert(this.pdf_file);
          if (data.itinerary_flight) {
            this.flights = data.itinerary_flight;
          }
          this.allVehMode = data.vehicle_mode;
          this.s3_url = data.s3_url;
          this.s3_html_url = data.html_s3_url;
          this.destinationsList = this.itineraryData.destinations;
          this.inclusion.itinerary_inclusions_id = [];
          if (data && data.itinerary_inclusions) {
            this.itinerary_inclusions = data.itinerary_inclusions;
          }
          this.isInclusion = data.user_inclusion_list_flag;

          if (data && data.user_itinerary_inclusion) {
            this.user_itinerary_inclusion = data.user_itinerary_inclusion;
            //this.set_inc_exc(data)
          }
          // this.get_no_of_days();
          this.all_poi = [];


        }
      });
    }
    //this.isLoading=false;
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  set_days_items() {
    var poi_items = [];
    var trans_items = [];
    var no_activity_items = [];
    if (this.itinerary_days && this.itinerary_days.length > 0) {
      for (let i = 0; i < this.itinerary_days.length; i++) {
        this.itinerary_days[i].poi_items = [];
        this.itinerary_days[i].trans_items = [];
        this.itinerary_days[i].no_activity_items = [];
        console.log(this.itinerary_days[i]);
        for (let j = 0; j < this.itinerary_days[i].schedule_items.length; j++) {
          if (this.itinerary_days[i].schedule_items[j].category_id == 1) {
            this.itinerary_days[i].poi_items.push(this.itinerary_days[i].schedule_items[j]);
          }
          if (this.itinerary_days[i].schedule_items[j].category_id == 2) {
            this.itinerary_days[i].trans_items.push(this.itinerary_days[i].schedule_items[j]);
          }
          if (this.itinerary_days[i].schedule_items[j].category_id == 6) {
            this.itinerary_days[i].no_activity_items.push(this.itinerary_days[i].schedule_items[j]);
          }
        }
      }
    }
    console.log(this.itinerary_days);
  }

  slected_template = '';
  selected_type = '';
  selected_temp_id = '';
  selected_type_id = '';

  open_preview(temp_id, type_cnt, type_id, temp_name, type_name) {
    this.slected_template = temp_name;
    this.selected_type = type_name;
    this.selected_temp_id = temp_id;
    this.selected_type_id = type_id;
    $('#previewModal_' + temp_id + '_' + type_id).css('display', 'block');
  }

  open_html_preview(temp_id, type_cnt, type_id, temp_name, type_name) {
    this.slected_template = temp_name;
    this.selected_type = type_name;
    this.selected_temp_id = temp_id;
    this.selected_type_id = type_id;
    $('#previewModal_html_' + temp_id + '_' + type_id).css('display', 'block');
  }

  select_preview(temp_id, type_cnt, type_id, temp_name, type_name, temp_count, color_count) {
    this.slected_template = temp_name;
    this.selected_type = type_name;
    this.selected_temp_id = temp_id;
    this.selected_type_id = type_id;

    $('.color_dt_' + temp_count).removeClass('active');
    $('.temp_set_' + temp_count + '_' + color_count).addClass('active');
    // assets/img/pdf_templates/screen/{{i+1}}_1.png
    $('.temp-sett_' + temp_count + ' img').attr('src', 'assets/img/pdf_templates/screen/' + this.selected_temp_id + '_' + type_cnt + '.png');

  }

  showPreview(cnt) {
    if (this.selected_type_id == '') {
      this.popUpMsg = JSON.stringify('Please choose template color');
      this.openDialog();
      return;
    } else {
      $('#previewModal_' + this.selected_temp_id + '_' + this.selected_type_id).css('display', 'block');
      $('.color_dt_' + this.selected_temp_id).removeClass('active');
      this.selected_temp_id = '';
      this.selected_type_id = '';
    }
  }

  showhtmlPreview(cnt) {
    if (this.selected_type_id == '') {
      this.popUpMsg = JSON.stringify('Please choose template color');
      this.openDialog();
      return;
    } else {
      $('#previewModal_html_' + this.selected_temp_id + '_' + this.selected_type_id).css('display', 'block');
      $('.color_dt_' + this.selected_temp_id).removeClass('active');
      this.selected_temp_id = '';
      this.selected_type_id = '';
    }
  }

  close_pre_modal(temp_id, type_id) {
    $('#previewModal_' + temp_id + '_' + type_id).css('display', 'none');
    this.slected_template = '';
    this.selected_type = '';
  }

  close_pre_modal_html(temp_id, type_id) {
    $('#previewModal_html_' + temp_id + '_' + type_id).css('display', 'none');
    this.slected_template = '';
    this.selected_type = '';
  }

  pdf_check_count = 0;

  generate_pdf(temp_id, type_id) {
    // if(type_id > 10){
    //   this.popUpMsg=JSON.stringify("Templates not available!");
    //   this.openDialog();
    //   return;
    // }
    this.pdf_loader = true;
    this.close_pre_modal(temp_id, type_id);

    if (location.hostname.search("localhost") >= 0 || location.hostname.search("adrenotravel") >= 0 || location.hostname.search("democrm.") >= 0 || location.hostname.search("conquertravel___") >= 0) {
      this.generate_conq_pdf(temp_id, type_id);
    } else {
      this.itineraryService.generate_itin_pdf(this.id, temp_id, type_id).subscribe((data: any) => {
        console.log(data, 'ff');
        if (data) {
          var pdf_data = data;
          this.itineraryService.call_pdf(pdf_data.user_code, pdf_data.file_name).subscribe((cdata: any) => {
            console.log(cdata);

          }, (error) => {
            //on error  check pdf status
            this.itineraryService.check_pdf_status(pdf_data.user_code, pdf_data.file_name).subscribe((pdata: any) => {
              console.log(pdata);
              this.pdf_check_count++;
              if (pdata.status == 'true') {
                console.log('1 true');
              } else {
                setTimeout(() => {
                  this.check_pdf_status(pdf_data.user_code, pdf_data.file_name);
                }, 5000);
              }

            });
          });
        }


      }, (error) => {
        this.pdf_loader = false;
        this.popUpMsg = JSON.stringify('Something went wrong! Try again');
        this.openDialog();
      });
    }

  }

  publish_Html(temp_id, type_id) {
this.itineraryService.publish_itin_html(this.id, temp_id, type_id).subscribe((data: any) => {

        this.pdf_loader = false;
        this.popUpMsg = JSON.stringify("HTML published successfully!");
        this.close_pre_modal_html(temp_id, type_id);
       // this.router.navigate(['/itineraryMain', {outlets: {itinerarySection: ['itinerary-details']}}], {queryParams: {'id': this.id}});
        this.openDialog();
        this.renderData();
});
  }

  generate_conq_pdf(temp_id, type_id) {
    this.itineraryService.generate_itin_pdf(this.id, temp_id, type_id).subscribe((data: any) => {
      console.log(data, 'ff');
      if (data) {
        var pdf_data = data;
        this.itineraryService.call_pdf(pdf_data.user_code, pdf_data.file_name).subscribe((cdata: any) => {
          console.log(cdata);
          setTimeout(() => {
            this.pdf_loader = false;
            this.itineraryService.response_pdf(pdf_data.user_code).subscribe((cdata: any) => {

              this.check_pdf_status(pdf_data.user_code, pdf_data.file_name);

            });
          }, 25000);
        });
      }

    }, (error) => {
      this.pdf_loader = false;
      this.popUpMsg = JSON.stringify('Something went wrong! Try again');
      this.openDialog();
    });
  }

  check_pdf_status(user_code, file_name) {
    this.pdf_check_count++;
    this.itineraryService.check_pdf_status(user_code, file_name).subscribe((pdata: any) => {
      console.log(pdata);
      if (pdata.status == 'true') {
        //alert('trruuee');
        console.log('4 true');
        this.pdf_loader = false;
        this.popUpMsg = JSON.stringify("Pdf generated successfully!");
        this.router.navigate(['/itineraryMain', {outlets: {itinerarySection: ['itinerary-details']}}], {queryParams: {'id': this.id}});
        this.openDialog();
        this.renderData();
      } else {
        console.log('false');
        this.pdf_loader = true;

        setTimeout(() => {
          // console.log(this.pdf_check_count+"---counttt");
          this.check_pdf_status(user_code, file_name);
        }, 5000);
      }

    });
  }

  popUpMsg: any;

  openDialog(): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '250px',
      data: this.popUpMsg
      // data: { name: "this.name", animal: "this.animal" }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
}
