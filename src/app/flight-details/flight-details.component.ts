import { Router,  ActivatedRoute,  Params,  NavigationStart,  NavigationEnd,  NavigationError,} from "@angular/router";
import {  Component,  OnInit,  ChangeDetectorRef,  ViewChild,  Input,  ElementRef,} from "@angular/core";
import { NewItineraryService } from "../new-itinerary.service";

import {  MatPaginator,  MatSort,  MatTableDataSource,  MatDialog,} from "@angular/material";
import { AlertBoxComponent } from "../alert-box/alert-box.component";
import { MessageService } from "../message.service";
import { Flight, PstFlightData } from "./flight";
import * as moment from "moment";
import {  Dimensions,ImageCroppedEvent,ImageTransform,} from "ngx-image-cropper";
import { base64ToFile } from "ngx-image-cropper";
import { FileService } from "../file.service";

@Component({
  selector: "app-flight-details",
  templateUrl: "./flight-details.component.html",
  styleUrls: ["./flight-details.component.css"],
})
export class FlightDetailsComponent implements OnInit {
  addflightmanully = true;
  showFlighDetail = false;
  originatFormNo = [0];
  originFNo = 1;
  returnFormNo = [0];
  returnFNo = 1;
  flight_type = "O";
  itinerary_id: any;

  constructor(
    private route: ActivatedRoute,
    private itineraryService: NewItineraryService,
    public dialog: MatDialog,
    private msg: MessageService,
    private router: Router,
    private fileService: FileService
  ) {
    this.msg.sendMessage("itinerary");
    this.itinerary_id = this.route.snapshot.queryParams["id"];
    if (this.itinerary_id > 0) {
      //this.isLoading=false;
      this.renderData();

      this.originateFlightData.push(this.postFlightData);
      this.returnFlightData.push(this.postFlightData);
      console.log(this.originateFlightData);
    } else {
      this.popUpMsg = JSON.stringify("Create itinerary first!");
      this.openDialog();
      this.router.navigate([
        "/itineraryMain",
        { outlets: { itinerarySection: ["itineraries"] } },
      ]);
    }
  }
  popUpMsg = "";
  destinationsList = [];
  itinerariesDetails: any;
  itineraryOrgFlight: any;
  itineraryRetFlight: any;

  public todayDate: any = new Date();
  renderData() {
    this.isLoading = true;
    this.itineraryOrgFlight = [];
    this.itineraryRetFlight = [];
    this.itineraryService.getFlightDetails(this.itinerary_id).subscribe(
      (data: any) => {
        this.isLoading = false;
        console.log(data, "DATATAAAA");
        if (data) {
          this.destinationsList = data.destinations;
          this.itinerariesDetails = data;
          this.itineraryOrgFlight = data.originating_flights;
          this.itineraryRetFlight = data.returning_flights;
        }
      },
      (error) => {
        this.isLoading = false;
        this.popUpMsg = JSON.stringify("itinerary not found!");
        this.openDialog();
        this.router.navigate([
          "/itineraryMain",
          { outlets: { itinerarySection: ["itineraries"] } },
        ]);
      }
    );
  }
  ngOnInit() { 
  }
  
  originateFlightData = [];  

  searchFlight(type, cnt) {
    this.isLoading = true;
    var f_airline = $("#airlinecode_serch_" + type + "_" + cnt).val();
    var f_no = $("#flightno_serch_" + type + "_" + cnt).val();
    var f_date = $("#firstDate_serch_" + type + "_" + cnt).val();

    if ((f_airline == "" && f_no == "") || f_date == "") {
      //alert("Please check the form");
      this.popUpMsg=JSON.stringify("Please check the form");
      this.openDialog();
      this.isLoading = false;
      return;
    }

    this.itineraryService.searchFlightApi(f_airline, f_no, f_date).subscribe(
      (res: any) => {
       var data=res.data;
        console.log(data);
        this.isLoading = false;
        if(data && data.error){
          this.reset_flight_form(type,cnt);
        }else{
          var ff_airline = data.appendix.airlines!=undefined?data.appendix.airlines:[];
          var ff_airports = data.appendix.airports?data.appendix.airports:[];
          var flightStatuses = data.scheduledFlights?data.scheduledFlights:[];
          if (flightStatuses && flightStatuses.length > 0) {
            //alert('d');
            $("#"+type+"_row_"+ cnt).css('display','block');
            $("#flightnumber_" + type + "_" + cnt).val(
              flightStatuses[0].flightNumber
            );
            var airCodeFl = flightStatuses[0].carrierFsCode.replace(/\*/g, "");
            $("#airlinecode_" + type + "_" + cnt).val(airCodeFl);
            var depdate = flightStatuses[0].departureTime;
            var arrdate = flightStatuses[0].arrivalTime;
            var arrivalAirportFsCode=flightStatuses[0].arrivalAirportFsCode;
            var departureAirportFsCode=flightStatuses[0].departureAirportFsCode;
            //alert(new Date(depdate));   
            $("#"+type+"_date_"+ cnt).val(f_date);   
            $("#departuredate_" + type + "_" + cnt).val(
              this.dateTimeForm(depdate)
            );
            $("#arrialedate_" + type + "_" + cnt).val(
              this.dateTimeForm(arrdate)

              );

            if (ff_airline && ff_airline.length > 0) {
              var i = 0;
              $("#airlinename_" + type + "_" + cnt).val(ff_airline[0].name);
            }

            if (ff_airports && ff_airports.length > 0) {
              var i = 0;
              for (let air of ff_airports) {
                console.log(air);
                if(air.iata==arrivalAirportFsCode){
                  $("#airportnameto_" + type + "_" + cnt).val(air.name);

                  this.setArrivalAirport(air, type, cnt, "arr");

                }
                if(air.iata==departureAirportFsCode){
                  $("#airport_" + type + "_frm_" + cnt).val(air.name);
                  this.setArrivalAirport(air, type, cnt, "dep");

                }

                i++;
              }
            } 
          }else{
            this.reset_flight_form(type,cnt);
          }
      }

      
      },
      (err) => { 

        this.isLoading = false;
      }
    );
  }
  searchFlight2(type, cnt) {
    this.isLoading = true;
    var f_airline = $("#airlinecode_serch_" + type + "_" + cnt).val();
    var f_no = $("#flightno_serch_" + type + "_" + cnt).val();
    var f_date = $("#firstDate_serch_" + type + "_" + cnt).val();

    if ((f_airline == "" && f_no == "") || f_date == "") {
      //alert("Please check the form");
      this.popUpMsg=JSON.stringify("Please check the form");
      this.openDialog();
      this.isLoading = false;
      return;
    }

    this.itineraryService.searchFlightApi(f_airline, f_no, f_date).subscribe(
      (res: any) => {
        console.log(data);
       var data=res.data;
        this.isLoading = false;
        if(data && data.error){
          this.reset_flight_form(type,cnt);
        }else{
          var ff_airline = data.appendix.airlines!=undefined?data.appendix.airlines:[];
          var ff_airports = data.appendix.airports?data.appendix.airports:[];;
          var flightStatuses = data.flightStatuses?data.flightStatuses:[];;
          if (flightStatuses && flightStatuses.length > 0) {
            $("#"+type+"_row_"+ cnt).css('display','block');
            $("#flightnumber_" + type + "_" + cnt).val(
              flightStatuses[0].flightNumber
            );
            var airCodeFl = flightStatuses[0].carrierFsCode.replace(/\*/g, "");
            $("#airlinecode_" + type + "_" + cnt).val(airCodeFl);
            var depdate = flightStatuses[0].departureDate.dateLocal;
            var arrdate = flightStatuses[0].arrivalDate.dateLocal;
            //alert(new Date(depdate));   
            $("#"+type+"_date_"+ cnt).val(f_date);   
            $("#departuredate_" + type + "_" + cnt).val(
              this.dateTimeForm(depdate)
            );
            $("#arrialedate_" + type + "_" + cnt).val(this.dateTimeForm(arrdate));
            if (ff_airline && ff_airline.length > 0) {
              var i = 0;
              $("#airlinename_" + type + "_" + cnt).val(ff_airline[0].name);
            }
            if (ff_airports && ff_airports.length > 0) {
              var i = 0;
              for (let air of ff_airports) {
                console.log(air);
                if (i == 0) {
                  $("#airportnameto_" + type + "_" + cnt).val(air.name);

                  this.setArrivalAirport(air, type, cnt, "arr");
                }
                if (i == 1) {
                  $("#airport_" + type + "_frm_" + cnt).val(air.name);
                  this.setArrivalAirport(air, type, cnt, "dep");
                }
                i++;
              }
            } 
          }else{
            this.reset_flight_form(type,cnt);
          }
      }

      
      },
      (err) => {
        //this.popUpMsg = JSON.stringify(err);
        // this.openDialog();

        this.isLoading = false;
      }
    );
  }
reset_flight_form(type,cnt){

      $("#flightnumber_" + type + "_" + cnt).val('');
      $("#airlinecode_" + type + "_" + cnt).val('');
      $("#departuredate_" + type + "_" + cnt).val('');
      $("#arrialedate_" + type + "_" + cnt).val('');
      $("#airlinename_" + type + "_" + cnt).val('');
      $("#airportnameto_" + type + "_" + cnt).val('');
      $("#airport_" + type + "_frm_" + cnt).val('');
      $("#"+type+"_date_"+ cnt).val(''); 
}
  dateTimeForm(dateVal) {
    var newDate = new Date(dateVal);

    var sMonth = newDate.getMonth() + 1;
    var sDay = newDate.getDate();
    var sYear = newDate.getFullYear();
    var sHour = newDate.getHours();
    var sMinute = this.padValue(newDate.getMinutes());
    var sAMPM = "AM";

    var iHourCheck = sHour;

    if (iHourCheck > 12) {
      sAMPM = "PM";
      sHour = iHourCheck - 12;
    } else if (iHourCheck === 0) {
      sHour = 12;
    }

    sHour = this.padValue(sHour);
    return sHour + ":" + sMinute + " " + sAMPM;
    //4/28/2021, 11:28 PM
    // return sMonth + "/" + sDay + "/" + sYear + ", " + sHour + ":" + sMinute + " " + sAMPM;
  }

  padValue(value) {
    return value < 10 ? "0" + value : value;
  }
  isLoading = true;
  save_origination() {
    this.isLoading = true;
    //this.originateFlightData=[];
    var originateData = [];
    if (
      this.originatFormNo &&
      this.originatFormNo.length > 0 &&
      this.flight_type == "O"
    ) {
      var or = 0;
      for (let og in this.originatFormNo) {
        console.log(or);
        console.log(this.originateFlightData, or);
        //return;
        console.log($("#airport_org_frm_" + or).val());

        var org_airportFrom = $("#airport_org_frm_" + or).val();
        var org_airportTo = $("#airportnameto_org_" + or).val();
        var org_airline = $("#airlinename_org_" + or).val();
        var org_airlineCode = $("#airlinecode_org_" + or).val();
        var org_flightNo = $("#flightnumber_org_" + or).val();
        var org_depDateTime = $("#departuredate_org_" + or).val();
        var org_arrDateTime = $("#arrialedate_org_" + or).val();
        var org_dep_date = $("#org_date_" + or).val();
        //5/16/2021, 4:12 PM
        //console.log(org_depDateTime+"---",org_arrDateTime);return;
        if (
          org_airportFrom == "" ||
          org_airportFrom == undefined ||
          org_airportTo == "" ||
          org_airportTo == undefined
        ) {
          alert("Please add airports");
          this.isLoading = false;
          return false;
        }
        // return;
        this.originateFlightData[or].itinerary_id = this.itinerary_id;
        this.originateFlightData[or].type = this.flight_type;
        this.originateFlightData[or].airline = org_airline;
        this.originateFlightData[or].airline_code = org_airlineCode;
        this.originateFlightData[or].flight_number = org_flightNo;
        this.originateFlightData[or].dep_airport = org_airportFrom;
        this.originateFlightData[or].arr_airport = org_airportTo;
        this.originateFlightData[or].arr_date_time = org_arrDateTime;
        this.originateFlightData[or].dep_date_time = org_depDateTime;
        this.originateFlightData[or].dep_date = org_dep_date;
        console.log(org_airline, or);
        originateData.push(this.originateFlightData[or]);
        console.log(originateData[or]);
        or++;
        //return;
      }
      //setTimeout(() => {
      console.log(originateData);
      // }, 300);
      //  return;
      this.itineraryService.addNewFlight(originateData).subscribe(
        (data: any) => {
          console.log(data);
          this.originatFormNo = [0];
          this.originateFlightData.push(this.postFlightData);
          this.returnFlightData = [];
          this.returnFlightData.push(this.postFlightData);
          this.popUpMsg = JSON.stringify(data.message);
          this.openDialog();
          this.renderData();
          this.reset_all_form();
        },
        (err) => {
          this.isLoading = false;
          //this.popUpMsg = JSON.stringify(err);
          //this.openDialog();
        }
      );
    } else {
      return;
    }
  }
  reset_all_form() {
    $(".form-group").find(".form-control").val("");

    this.isLoading = false;
  }
  checkForValidations(
    org_airportFrom,
    org_airportTo,
    org_airline,
    org_airlineCode,
    org_flightNo,
    org_depDate,
    org_arrDate
  ) {}
  returnFlightData = [];
  save_returnFlights() {
    if (this.returnFormNo && this.returnFormNo.length > 0) {
      for (let ret in this.returnFormNo) {
        console.log(ret);

        var ret_airportFrom = $("#airport_ret_frm_" + ret).val();
        var ret_airportTo = $("#airportnameto_ret_" + ret).val();
        var ret_airline = $("#airlinename_ret_" + ret).val();
        var ret_airlineCode = $("#airlinecode_ret_" + ret).val();
        var ret_flightNo = $("#flightnumber_ret_" + ret).val();
        var ret_depDateTime = $("#departuredate_ret_" + ret).val();
        var ret_arrDateTime = $("#arrialedate_ret_" + ret).val();
        var ret_dep_date = $("#ret_date_" + ret).val();

        if (
          ret_airportFrom == "" ||
          ret_airportFrom == undefined ||
          ret_airportTo == "" ||
          ret_airportTo == undefined
        ) {
          alert("Please add airports");
          return false;
        }
        // return;
        this.returnFlightData[ret].itinerary_id = this.itinerary_id;
        this.returnFlightData[ret].type = this.flight_type;
        this.returnFlightData[ret].airline = ret_airline;
        this.returnFlightData[ret].airline_code = ret_airlineCode;
        this.returnFlightData[ret].flight_number = ret_flightNo;
        this.returnFlightData[ret].dep_airport = ret_airportFrom;
        this.returnFlightData[ret].arr_airport = ret_airportTo;
        this.returnFlightData[ret].arr_date_time = ret_arrDateTime;
        this.returnFlightData[ret].dep_date_time = ret_depDateTime;
        this.returnFlightData[ret].dep_date = ret_dep_date;
        console.log(this.returnFlightData[ret], ret);
      }
    }
    console.log(this.returnFlightData);
    //return;
    this.itineraryService.addNewFlight(this.returnFlightData).subscribe(
      (data: any) => {
        console.log(data);
        this.returnFormNo = [0];
        this.originateFlightData = [];
        this.originateFlightData.push(this.postFlightData);
        this.returnFlightData = [];
        this.returnFlightData.push(this.postFlightData);

        this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
        this.renderData();
        this.reset_all_form();
      },
      (err) => {
        this.popUpMsg = JSON.stringify(err);
        this.openDialog();
      }
    );
  }
  OriginatType() {
    this.flight_type = "O";
  }
  returnType() {
    this.flight_type = "R";
  }
  addflightmanullybtn() {
    this.addflightmanully = !this.addflightmanully;
  }

  showFlighDetailbtn() {
    this.showFlighDetail = !this.showFlighDetail;
  }
  postFlightData = {
    itinerary_id: this.itinerary_id,
    type: this.flight_type,
    airline: "",
    airline_code: "",
    flight_number: "",
    dep_airport: "",
    dep_city: "",
    dep_city_code: "",
    dep_country: "",
    dep_latitude: "",
    dep_longitude: "",
    dep_terminal: "",
    dep_iata: "",
    dep_region_name: "",
    dep_time_zone: "",
    dep_date: "",
    dep_time: "",
    arr_airport: "",
    arr_city: "",
    arr_city_code: "",
    arr_country: "",
    arr_latitude: "",
    arr_longitude: "",
    arr_terminal: "",
    arr_iata: "",
    arr_region_name: "",
    arr_date: "",
    arr_time: "",
    dep_date_time: "",
    arr_date_time: "",
  };
  pstData: PstFlightData = new PstFlightData();
  addMoreoriginatingForm() {
    console.log(this.postFlightData);
    this.originFNo = this.originFNo + 1;
    this.originatFormNo.push(this.originFNo);
    //var pstData=PstFlightData new PstFlightData();
    this.originateFlightData.push(this.pstData);
    console.log(this.originatFormNo.length);
    var ser_length=this.originatFormNo.length-1; 
    setTimeout(() => {        
      if(this.org_search_btn==false){  
        $("#search_flght_org_"+ser_length).css('display','none');
        $("#org_row_"+ ser_length).css('display','block'); 
      }
      }, 200);
    
  }

  removeMoreoriginatingForm(indd) {
    this.originFNo = this.originFNo - 1;
    this.originatFormNo.splice(indd, 1);
    this.originateFlightData.splice(indd, 1);
    console.log(this.originatFormNo);
  }
  addMorereturningForm() {
    this.returnFNo = this.returnFNo + 1;
    this.returnFormNo.push(this.returnFNo);
    this.returnFlightData.push(this.pstData);
    console.log(this.returnFlightData);
    var ser_length=this.returnFlightData.length-1; 
    setTimeout(() => {        
      if(this.ret_search_btn==false){  
        $("#search_flght_ret_"+ser_length).css('display','none');
        $("#ret_row_"+ ser_length).css('display','block'); 
      }
      }, 200);
  }

  removeMorereturningForm(indd) {
    this.returnFNo = this.returnFNo - 1;
    this.returnFormNo.splice(indd, 1);
    this.returnFlightData.splice(indd, 1);
    console.log(this.returnFlightData);
  }
  originEditable = false;
  inboundEditable = false;
  editableFlight = {
    id: undefined,
    itinerary_id: this.itinerary_id,
    type: this.flight_type,
    airline: "",
    airline_code: "",
    flight_number: "",
    dep_airport: "",
    dep_city: "",
    dep_city_code: "",
    dep_country: "",
    dep_latitude: "",
    dep_longitude: "",
    dep_terminal: "",
    dep_iata: "",
    dep_region_name: "",
    dep_time_zone: "",
    dep_date: "",
    dep_time: "",
    arr_airport: "",
    arr_city: "",
    arr_city_code: "",
    arr_country: "",
    arr_latitude: "",
    arr_longitude: "",
    arr_terminal: "",
    arr_iata: "",
    arr_region_name: "",
    arr_date: "",
    arr_time: "",
    dep_date_time: new Date(),
    arr_date_time: new Date(),
  };
  toDateForm(dStr, format) {
    var now = new Date();
    if (format == "h:m") {
      console.log(dStr);
      // var time_s=dStr.split(':');
      // now.setHours(time_s[0]?time_s[0]:0);
      // now.setMinutes(time_s[1]:?time_s[1]:0);
      now.setHours(dStr.toString().substr(0, dStr.toString().indexOf(":")));
      now.setMinutes(dStr.toString().substr(dStr.toString().indexOf(":") + 1));
      now.setSeconds(0);
      return now;
    } else return now;
  }
  editableIId: any;
  openFlightEdit(id, type, flightData) {
    this.isLoading=true;
    this.editableIId = id;
    this.editableFlight = flightData;

    $("#edit_airport_from").val(flightData.dep_airport);
    $("#edit_airport_to").val(flightData.arr_airport);
    //this.editableFlight.dep_date = new Date(flightData.dep_date).toString();
    var dep_time = flightData.dep_time;
    // this.editableFlight.dep_time=this.toDateForm(dep_time,"h:m");
    //this.editableFlight.arr_time=this.toDateForm(flightData.arr_time,"h:m");

    console.log(this.editableFlight);
    console.log(this.itineraryOrgFlight);
    console.log(flightData); 

    // $("body").addClass("right-bar-enabled");
    // $("body").addClass("modal-open");
    setTimeout(() => {        
         this.isLoading=false;
      }, 800);
  } 
  update_flight() {
    console.log(this.editableFlight);
    //return;
   // var depp_date=$("#edit_date").val()
    //this.editableFlight.dep_date = new Date(depp_date);
    var airportFrom = $("#edit_airport_from").val();
    var airportTo = $("#edit_airport_to").val();
    this.editableFlight.dep_airport = airportFrom.toString();
    this.editableFlight.arr_airport = airportTo.toString();
    //this.editableFlight.arr_date_time=this.editableFlight.arr_time;
    //this.editableFlight.dep_date_time=this.editableFlight.dep_time;
    console.log(this.editableFlight);
    if (
      this.editableFlight.dep_airport == "" ||
      this.editableFlight.arr_airport == "" ||
      this.editableFlight.arr_time == "" ||
      this.editableFlight.dep_time == "" ||
      this.editableFlight.airline == "" ||
      this.editableFlight.airline_code == "" ||
      this.editableFlight.flight_number == ""
    ) {
      this.popUpMsg = JSON.stringify("Please check the form");
      this.openDialog();
      return false;
    }
    this.itineraryService
      .UpdateFlight(this.editableFlight, this.editableIId)
      .subscribe(
        (data: any) => {
          this.popUpMsg = JSON.stringify(data.message);
          $("#editFlt").css("display", "none");
          this.closeRightpanel();
          this.openDialog();
          this.renderData();
        },
        (err) => {
          this.isLoading = false;
          //this.popUpMsg = JSON.stringify(err);
          //this.openDialog();
        }
      );
  }

  closeRightpanel() {
    $("body").removeClass("right-bar-enabled");
    $("body").removeClass("modal-open");
    $(".modal-backdrop").remove();
  }
  delete_id: any;
  open_delete_modal(id) {
    this.delete_id = id;
  }
  delete_flight() {
    this.itineraryService.deleteFlight(this.delete_id).subscribe(
      (data: any) => {
        console.log(data);

        this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
        this.renderData();
      },
      (err) => {
        this.popUpMsg = JSON.stringify(err);
        this.openDialog();
      }
    );
  }
  airportData = [];
  airportDataDepFrom = [];
  airportDataDepTo = [];
  airportDataRetFrom = [];
  airportDataRetTo = [];
  searchAirport(ev, f_type, cnt) {
    this.isLoading = true;
    var loc_keywords = ev.target.value;
    $("#airport_org_from_" + cnt).css("display", "none");
    $("#airport_org_to_" + cnt).css("display", "none");
    if (ev.target.value.length > 4) {
      var data = { keyword: loc_keywords, destinations: this.destinationsList };
      this.itineraryService.searchAirport(data).subscribe(
        (data: any) => {
          this.isLoading = false;
          console.log(data);
          if (data && data.airport) {
            if (f_type == "org_from") {
              this.airportDataDepFrom = data.airport;
              $("#airport_org_from_" + cnt).css("display", "block");
            }
            if (f_type == "org_to") {
              this.airportDataDepTo = data.airport;
              $("#airport_org_to_" + cnt).css("display", "block");
            }
            if (f_type == "ret_from") {
              this.airportDataRetFrom = data.airport;
              $("#airport_ret_from_" + cnt).css("display", "block");
            }
            if (f_type == "ret_to") {
              this.airportDataRetTo = data.airport;
              $("#airport_ret_to_" + cnt).css("display", "block");
            }
            this.airportData = data.airport;
          } else {
            this.airportData = [];
            this.airportDataDepFrom = [];
            this.airportDataDepTo = [];
            this.airportDataRetFrom = [];
            this.airportDataRetTo = [];
          }
        },
        (err) => {
          this.isLoading = false;
          this.popUpMsg = JSON.stringify(err);
          this.openDialog();
        }
      );
    } else {
      this.airportData = [];
      this.isLoading = false;
    }
  }
  setArrivalAirport(air, f_type, cnt, c_type) {
    if (f_type == "org" && c_type == "arr") {
      this.originateFlightData[cnt].arr_airport = air.name;
      this.originateFlightData[cnt].arr_country = air.countryName;
      this.originateFlightData[cnt].arr_latitude = air.latitude;
      this.originateFlightData[cnt].arr_longitude = air.longitude;
      this.originateFlightData[cnt].arr_iata = air.iata;
      this.originateFlightData[cnt].arr_city_code = air.city;
    }
    if (f_type == "org" && c_type == "dep") {
      this.originateFlightData[cnt].dep_airport = air.name;
      this.originateFlightData[cnt].dep_country = air.countryName;
      this.originateFlightData[cnt].dep_latitude = air.latitude;
      this.originateFlightData[cnt].dep_longitude = air.longitude;
      this.originateFlightData[cnt].dep_iata = air.iata;
      this.originateFlightData[cnt].dep_city_code = air.city;
      this.originateFlightData[cnt].dep_city = air.city;
    }
    if (f_type == "ret" && c_type == "arr") {
      this.returnFlightData[cnt].arr_airport = air.name;
      this.returnFlightData[cnt].arr_country = air.countryName;
      this.returnFlightData[cnt].arr_latitude = air.latitude;
      this.returnFlightData[cnt].arr_longitude = air.longitude;
      this.returnFlightData[cnt].arr_iata = air.iata;
      this.returnFlightData[cnt].arr_city_code = air.city;
      this.returnFlightData[cnt].arr_city = air.city;
    }
    if (f_type == "ret" && c_type == "dep") {
      this.returnFlightData[cnt].dep_airport = air.name;
      this.returnFlightData[cnt].dep_country = air.countryName;
      this.returnFlightData[cnt].dep_latitude = air.latitude;
      this.returnFlightData[cnt].dep_longitude = air.longitude;
      this.returnFlightData[cnt].dep_iata = air.iata;
      this.returnFlightData[cnt].dep_city_code = air.city;
      this.returnFlightData[cnt].dep_city = air.city;
    }

    console.log(this.originateFlightData);
    console.log(this.returnFlightData);
  }
  flights = new Flight();
  fetch_airp(id, f_type, cnt) {
    if (f_type == "org_from") {
      for (let air of this.airportDataDepFrom) {
        if (air.id == id) {
          $("#airport_org_frm_" + cnt).val(air.dest_name);
          this.originateFlightData[cnt].dep_airport = air.dest_name;
          this.originateFlightData[cnt].dep_country = air.country_name;
          this.originateFlightData[cnt].dep_latitude = air.latitude;
          this.originateFlightData[cnt].dep_longitude = air.longitude;
          this.originateFlightData[cnt].dep_iata = air.iata_code;
          this.originateFlightData[cnt].dep_city_code = air.geonameid;
          this.originateFlightData[cnt].dep_city = air.geonameid;
          console.log(air);
          console.log(this.originateFlightData);
        }
      }
      this.airportDataDepFrom = [];
    }
    if (f_type == "org_to") {
      //this.airportDataDepTo=data.airport;
      for (let air of this.airportDataDepTo) {
        if (air.id == id) {
          $("#airportnameto_org_" + cnt).val(air.dest_name);
          this.originateFlightData[cnt].arr_airport = air.dest_name;
          this.originateFlightData[cnt].arr_country = air.country_name;
          this.originateFlightData[cnt].arr_latitude = air.latitude;
          this.originateFlightData[cnt].arr_longitude = air.longitude;
          this.originateFlightData[cnt].arr_iata = air.iata_code;
          this.originateFlightData[cnt].arr_city_code = air.geonameid;
          this.originateFlightData[cnt].arr_city = air.geonameid;
        }
      }
      this.airportDataDepTo = [];
    }

    if (f_type == "ret_from") {
      //this.airportDataRetFrom=data.airport;
      for (let air of this.airportDataRetFrom) {
        if (air.id == id) {
          $("#airport_ret_frm_" + cnt).val(air.dest_name);
          this.returnFlightData[cnt].dep_airport = air.dest_name;
          this.returnFlightData[cnt].dep_country = air.country_name;
          this.returnFlightData[cnt].dep_latitude = air.latitude;
          this.returnFlightData[cnt].dep_longitude = air.longitude;
          this.returnFlightData[cnt].dep_iata = air.iata_code;
          this.returnFlightData[cnt].dep_city_code = air.geonameid;
        }
      }
      this.airportDataRetFrom = [];
    }
    if (f_type == "ret_to") {
      // this.airportDataRetTo=data.airport;
      for (let air of this.airportDataRetTo) {
        if (air.id == id) {
          $("#airportnameto_ret_" + cnt).val(air.dest_name);
          this.returnFlightData[cnt].arr_airport = air.dest_name;
          this.returnFlightData[cnt].arr_country = air.country_name;
          this.returnFlightData[cnt].arr_latitude = air.latitude;
          this.returnFlightData[cnt].arr_longitude = air.longitude;
          this.returnFlightData[cnt].arr_iata = air.iata_code;
          this.returnFlightData[cnt].arr_city_code = air.geonameid;
          this.returnFlightData[cnt].arr_city = air.geonameid;
        }
      }
      this.airportDataRetTo = [];
    }
  }
  editFromAirport = [];
  editToAirport = [];
  searchEditAirport(ev, f_type) {
    this.isLoading = true;
    var loc_keywords = ev.target.value;
    if (f_type == "from") {
      this.editableFlight.dep_airport = loc_keywords;
      this.editableFlight.dep_country = "";
      this.editableFlight.dep_latitude = "";
      this.editableFlight.dep_longitude = "";
      this.editableFlight.dep_iata = "";
      this.editableFlight.dep_city_code = "";
      this.editableFlight.dep_city = "";
    }
    if (f_type == "to") {
      this.editableFlight.arr_airport = loc_keywords;
      this.editableFlight.arr_country = "";
      this.editableFlight.arr_latitude = "";
      this.editableFlight.arr_longitude = "";
      this.editableFlight.arr_iata = "";
      this.editableFlight.arr_city_code = "";
      this.editableFlight.arr_city = "";
    }
    if (ev.target.value.length > 4) {
      var data = { keyword: loc_keywords, destinations: this.destinationsList };
      this.itineraryService.searchAirport(data).subscribe(
        (data: any) => {
          this.isLoading = false;
          console.log(data);
          if (data && data.airport) {
            if (f_type == "from") {
              this.editFromAirport = data.airport;
            }
            if (f_type == "to") {
              this.editToAirport = data.airport;
            }
          } else {
            this.editFromAirport = [];
            this.editToAirport = [];
          }
        },
        (err) => {
          this.isLoading = false;
          // this.popUpMsg = JSON.stringify(err);
          // this.openDialog();
        }
      );
    } else {
      this.editFromAirport = [];
      this.editToAirport = [];
      this.isLoading = false;
    }
  }
  fetch_edit_airp(airport, type) {
    if (type == "from") {
      console.log(airport);
      $("#edit_airport_from").val(airport.dest_name);
      $("#airport_r_edit").css("display", "none");
      this.editableFlight.dep_airport = airport.dest_name;
      this.editableFlight.dep_country = airport.country_name;
      this.editableFlight.dep_latitude = airport.latitude;
      this.editableFlight.dep_longitude = airport.longitude;
      this.editableFlight.dep_iata = airport.iata_code;
      this.editableFlight.dep_city_code = airport.geonameid;
      this.editableFlight.dep_city = airport.geonameid;
    }
    if (type == "to") {
      console.log(airport);
      $("#edit_airport_to").val(airport.dest_name);
      $("#airport_re_edit").css("display", "none");
      this.editableFlight.arr_airport = airport.arr_airport;
      this.editableFlight.arr_country = airport.country_name;
      this.editableFlight.arr_latitude = airport.latitude;
      this.editableFlight.arr_longitude = airport.longitude;
      this.editableFlight.arr_iata = airport.iata_code;
      this.editableFlight.arr_city_code = airport.geonameid;
      this.editableFlight.arr_city = airport.geonameid;
    }
  }
  org_search_btn=true;
  ret_search_btn=true;
  origin_add_manually=false;
  ret_add_manually=false;
  org_search=true;
  ret_search=true;
  toggleFltSearch(type, cnt) {
    if ($("#search_flght_" + type + "_" + cnt).is(":visible")) {
      $(".flt_exp_" + type + "_" + cnt).css("display", "none");
      setTimeout(() => {
        $("#search_flght_" + type + "_" + cnt).animate({ width: "hide" });
        $("#"+type+"_row_"+ cnt).css('display','block');
        if(type=='org'){
            this.org_search_btn=false;
            this.origin_add_manually=true;
            this.org_search=false;          
        }
        if(type=='ret'){
            this.ret_search_btn=false;
            this.ret_add_manually=true;
            this.ret_search=false;          
        }
        // $("#srch_" + type)
        //   .removeClass("btn-danger")
        //   .addClass("btn-warning"); 

        // $("#srch_" + type + " i")
        //   .removeClass("fa-close")
        //   .addClass("fa-search");

           //$("#srch_" + type + " span").html("<i class='fa fa-search'></i>");

        
      }, 300);
    } else {
      $("#search_flght_" + type + "_" + cnt).animate({ width: "show" });
      setTimeout(() => {
        $(".flt_exp_" + type + "_" + cnt).css("display", "block");
         $("#"+type+"_row_"+ cnt).css('display','none');
        if(type=='org'){
            this.org_search_btn=true;
            this.origin_add_manually=false;
            this.org_search=true;          
        }
        if(type=='ret'){
            this.ret_search_btn=true;
            this.ret_add_manually=false;
           
        // $("#srch_" + type)
        //   .removeClass("btn-warning")
        //   .addClass("btn-danger");
        // $("#srch_" + type + " i")
        //   .removeClass("fa-search")
        //   .addClass("fa-close");

          // $("#srch_" + type + " span").html("Add Manually");
 this.ret_search=true;          
        }
      }, 400);
    }
    // if(type=='org'){
    //   var x = document.getElementById("search_flght_or_"+cnt);
    // if (x.style.display === "none") {
    //   x.style.display = "block";
    // } else {
    //   x.style.display = "none";
    // }
    // }
  }
  openDialog(): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: "250px",
      data: this.popUpMsg,
      // data: { name: "this.name", animal: "this.animal" }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      // this.animal = result;
    });
  }
}
