import {Component, OnInit, ViewChild, ElementRef, NgZone} from '@angular/core';
import {MatTableDataSource, MatPaginator, MatSort, MatDialog} from '@angular/material';
import {AdminServiceService} from '../service/admin-service.service';
import {MapService} from '../service/map.service';
import {AlertBoxComponent} from '../alert-box/alert-box.component';
import {MessageService} from '../message.service';
import {MapsAPILoader} from '@agm/core';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';

declare var google;

@Component({
  selector: 'app-company-setting',
  templateUrl: './company-setting.component.html',
  styleUrls: ['./company-setting.component.css'],
  providers: [MapService, AdminServiceService]
})
export class CompanySettingComponent implements OnInit {
  /* Start*/
  DATA_LinkInfo: any[];
  displayedColumnsLinkInfo: string[] = ['sno', 'name', 'email', 'role', 'tenant', 'action'];
  dataSourceLinkInfo = new MatTableDataSource<any>(this.DATA_LinkInfo);
  @ViewChild(MatPaginator) paginatorLinkInfo: MatPaginator;
  @ViewChild(MatSort) sortLinkInfo: MatSort;
  /* End*/
  tenant: any;
  metaData: any;
  address: string;
  lat: undefined;
  lng: undefined;
  month_number: any;
  name_error = false;
  employee_error = false;
  fiscal_error = false;
  street_error = false;
  city_error = false;
  state_error = false;
  zip_error = false;
  country_error = false;
  popUpMsg: string;
  countryList: any[];
  timeZoneData: any = [];
  countryData: any = [];
  public timeZonesOptions: Select2Options;
  @ViewChild("search")
  public searchElementRef: ElementRef;
  public searchControl: FormControl;
  public zoom: number;
  public latitude: number;
  public longitude: number;
  public fulladdr: string;
  public country_code: string;
  public state_name: string;
  public city = '';
  public zip_code: string;
  public country_name: string;

  constructor(private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone, private service: AdminServiceService, private mapService: MapService, public dialog: MatDialog, private msg: MessageService) {
    this.fetchData();
  }

  fetchData() {
    this.photo_name = "";
    this.service.getCountryList().subscribe((data: any) => {
      this.countryList = data.countries;
      if (data.countries != undefined) {
        let i = 0;
        for (let e of data.countries) {
          this.countryData.push({"id": e.name, "text": e.name});
          i++;
        }
      }
    });
    this.service.getCompany().subscribe((data: any) => {
      this.tenant = data.tenant;
      this.address = this.tenant.address_street + ',' + this.tenant.address_city + ',' + this.tenant.address_country;

      this.service.getCompanyEdit(this.tenant.id).subscribe((data: any) => {
        // this.getMap(this.address);
        this.metaData = data;
        this.tenant.fiscal_year_start_new = data.month_number;
        this.tenant.timezone = data.tenant.timezone;
        this.fulladdr = data.tenant.address_street;
        //this.tenant.address_country=data.tenant.address_country;
        if (data.timezones != undefined) {
          let i = 0;
          for (let e of data.timezones) {
            this.timeZoneData.push({"id": e, "text": e});
            i++;
          }
        }
      });
    });
  }

  renderNewView(value) {
    this.tenant.timezone = value;
  }

  renderCountry(value) {
    this.tenant.address_country = value;
  }

  getCurName(id: number) {
    if(this.metaData){
        for (let m of this.metaData.currencies) {
          if (m.id == id) {
            return m.name + ' (' + m.code + ')';
          }
        }      
    }
  }

  selectBox() {
    $('.select2-container').css('z-index', 9999);
  }

  ngOnInit() {
    $('.pac-container').css('z-index', 9999);
  }

  getMap(address) {
    try {
      this.mapService.geocodeAddress(address).subscribe((data: any) => {
        // console.log(data);
        this.lat = data.lat;
        this.lng = data.lng;
      });
    } catch (error) {
      console.log(JSON.stringify(error));
    }

  }

  modalAdd: boolean = false;

  AddNewShow() {

    this.modalAdd = true;
    this.searchControl = new FormControl();
    setTimeout(() => {
      this.loadAddressAutocomplete();
    }, 500);
    setTimeout(() => {
      $('#street_add').val(this.fulladdr);
      $('.pac-container').css('z-index', 9999);
    }, 1000);
  }

  AddNewHide() {
    this.modalAdd = false;
  }

  loadAddressAutocomplete() {

    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.country_name = '';
        this.state_name = '';
        this.city = '';
        this.zip_code = '';
        this.ngZone.run(() => {
          let place = autocomplete.getPlace();
          let that = this;
          if (place.geometry === undefined || place.geometry === null) {
            return;
          } else {

            that.latitude = place.geometry.location.lat();
            that.longitude = place.geometry.location.lng();
            that.zoom = 12;
            that.fulladdr = place.formatted_address;
            var street_address = "";
            var street_number = "";
            var street_route = "";
            for (var i = 0; i < (place.address_components).length; i++) {
              if (place.address_components[i].types[0] == 'street_number') {
                street_number = place.address_components[i].long_name;
              }
              if (place.address_components[i].types[0] == 'route') {
                street_route = place.address_components[i].long_name;
              }
              if (place.address_components[i].types[0] == 'country') {
                that.country_name = place.address_components[i].long_name;
                that.country_code = place.address_components[i].short_name;
              }
              if (place.address_components[i].types[0] == "administrative_area_level_1") {
                that.state_name = place.address_components[i].long_name;
              }
              if (place.address_components[i].types[0] == "locality") {
                that.city = place.address_components[i].long_name;
              }
              if (place.address_components[i].types[0] == "postal_code") {
                that.zip_code = place.address_components[i].long_name;
              }
            }
          }
          var street_add = street_number ? street_number + ' ' : '';
          street_address = street_add + street_route;
          this.tenant.address_country = this.country_name;
          this.tenant.address_state = this.state_name;
          this.tenant.address_city = this.city;
          this.tenant.address_zip = this.zip_code;
          this.tenant.address_street = street_address;
        });
      });
    });
  }

  update() {
    this.tenant.fiscal_year_start = this.tenant.fiscal_year_start_new;
    if (this.tenant.name == '' || this.tenant.fiscal_year_start_new == '' || this.tenant.employees == '' || this.tenant.address_street == '' || this.tenant.address_city == '' || this.tenant.address_state == '' || this.tenant.address_zip == '' || this.tenant.address_country == '') {


      if (this.tenant.fiscal_year_start_new == '') {
        this.fiscal_error = true;
      } else {
        this.fiscal_error = false;
      }
      if (this.tenant.name == '') {
        this.name_error = true;

      } else {
        this.name_error = false;
      }

      if (this.tenant.employees == '') {
        this.employee_error = true;

      } else {
        this.employee_error = false;
      }
      if (this.tenant.address_street == '') {
        this.street_error = true;

      } else {
        this.street_error = false;
      }
      if (this.tenant.address_city == '') {
        this.city_error = true;
      } else {
        this.city_error = false;
      }
      if (this.tenant.address_state == '') {
        this.state_error = true;
      } else {
        this.state_error = false;
      }
      if (this.tenant.address_zip == '') {
        this.zip_error = true;
      } else {
        this.zip_error = false;
      }
      if (this.tenant.address_country == '') {
        this.country_error = true;
      } else {
        this.country_error = false;
      }
      this.popUpMsg = JSON.stringify('Please fill all mandatory fields');
      this.openDialog();
      return;
    } else {
      this.service.updateCompany(this.tenant.id, this.tenant).subscribe(
        data => {
          this.name_error = false;
          this.employee_error = false;
          this.fiscal_error = false;
          this.street_error = false;
          this.city_error = false;
          this.state_error = false;
          this.zip_error = false;
          this.country_error = false;
          this.modalAdd = false;
          this.popUpMsg = JSON.stringify('Company Updated Successfully!');
          this.openDialog();
          this.fetchData();
          // $(window).trigger('resize');
          // this.AddNewShow();
        }
      );
    }

  }

  openDialog(): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '250px',
      data: this.popUpMsg
      // data: { name: 'this.name', animal: 'this.animal' }
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.animal = result;
    });
  }

  closeRightpanel() {
    $('body').removeClass('right-bar-enabled');
  }

  photo: File;
  photo_name: any;
  form = new FormData();

  addFIle(files: FileList, isAvatar: boolean) {
    this.photo = files[0];
    console.log(this.photo.name);
    this.photo_name = this.photo.name;

    this.form.set("company_logo", this.photo);


  }

  updateAvatar() {
    console.log(this.form)
    this.service.updateLogo(this.form).subscribe((data: any) => {
      console.log(data);
      this.fetchData();
    })
  }

  updateBankInfo() {
    this.service.updateCompanyBank(this.tenant.id, this.tenant).subscribe(
      data => {

        this.popUpMsg = JSON.stringify('Bank Info Updated Successfully!');
        this.openDialog();
        this.fetchData();
        $(window).trigger('resize');
        this.modalBank = false;
      }
    );
  }

  updateBank() {
    this.modalBank = true;
  }

  bankHide() {
    this.modalBank = false;
  }

  modalBank = false;
}
