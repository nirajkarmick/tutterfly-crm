import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ContactService } from '../service/contact.service';
import { AccountsMapService } from '../service/accounts-map.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import * as $ from 'jquery';
import { Column } from './../accounts-grid/column';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { AlertBoxComponent } from '../alert-box/alert-box.component';
import { AlertMsgComponent } from '../alert-msg/alert-msg.component';
import { Contact } from '../contact-grid/contact';
import { LeadService } from '../service/lead.service';
import { ImportService } from '../service/import.service';
import { MessageService } from '../message.service';
import { AdminServiceService } from '../service/admin-service.service';
import { MapsAPILoader } from '@agm/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent implements OnInit {

  constructor(private importService: ImportService, public dialog: MatDialog, public dialog2: MatDialog,
    private route: ActivatedRoute, private msg: MessageService) { }
  //import data variables
  public importPop = false;
  public csvContent: string;
  public parsedCsv: any;
  public importArray: any = [];
  public csv_header: any = [];
  public errorImportArray: any = [];
  public extData: any;
  public upload_body = true;
  public preview_body: any;
  public preview_loader = false;
  public dataImport: any;
  public importColumn: any;
  public column_name: any;
  public export_types: any;
  public validate_fields: any;
  public valid_column: any;
  public email_valid = false;
  public preview_next = false;
  type: any;
  popUpMsg: any;
  popUpMsg2: any;
  @ViewChild('inputFile') myInputVariable: ElementRef;
  openDialog(): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '250px',
      data: this.popUpMsg
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
  openDialog2(): void {
    let dialogRef2 = this.dialog2.open(AlertMsgComponent, {
      width: '250px',
      data: this.popUpMsg2
    });

    // dialogRef2.afterClosed().subscribe(result => { 
    //   console.log('The dialog2 was closed');
    //   // this.animal = result;
    // });
  }
  allAccounts = [];
  //public accOptions: Select2Options;
  accData: any = [];
  import_acc_id: any;
  selectBox() {
    $('.select2-container').css('z-index', 5000);
  }
  renderNewView(value) {
    this.import_acc_id = value;
  }
  ngOnInit() {
    this.choose_file = '';
    this.account_valid = [];
    this.type = this.route.snapshot.queryParams['type'];
    this.importService.getAllColumn().subscribe((data: any) => {
      if (this.type == 'leads') {
        this.importColumn = data.lead_import_columns;
        this.msg.sendMessage("lead");
      }
      if (this.type == 'accounts') {
        this.importColumn = data.account_import_columns;
        this.msg.sendMessage("acc");
      }
      if (this.type == 'contacts') {
        this.msg.sendMessage("contact");
        this.importColumn = data.contact_import_columns;

      }
      if (this.type == 'person_accounts') {
        this.msg.sendMessage("person");
        this.importColumn = data.personal_account_import_columns;
      }
      if (this.type == 'opportunities') {
        this.msg.sendMessage("oppo");
        this.importColumn = data.opportunity_import_columns;
      }
      if (this.type == 'opportunity_histories') {
        this.msg.sendMessage("oppo");
        this.importColumn = data.opportunity_histories_import_columns;
      }
      console.log(this.importColumn);
      if (this.importColumn) {
        this.column_name = [];
        for (var i in this.importColumn) {
          this.column_name.push(i);
        }
        console.log(this.column_name);
      }

    });

  }
  downloadSample() {

    this.importService.downloadSample(this.type).subscribe((res: any) => {
      console.log(res);
      this.downloadFile(res, this.type);

    }, error => {
      console.log(error);
    });

  }
  downloadstageSample() {
    this.importService.downloadstageSample('opportunity_histories').subscribe((res: any) => {
      console.log(res);
      this.downloadFile(res, 'opportunity_histories');

    }, error => {
      console.log(error);
    });
  }

  downloadFile(data: any, type) {
    const blob = new Blob([data], { type: 'text/csv' });
    saveAs(blob, type + ".csv");
  }
  //import leads:

  import_data() {
      this.choose_file = '';
      this.account_valid = [];
      this.importPop = true;
      this.upload_body = true;
      this.preview_body = false;
      this.preview_next = false;
      this.importArray = [];
      this.preview_loader = false;
      this.myInputVariable.nativeElement.value = '';
  }
  backToNext() {
    this.account_valid = [];
    this.upload_body = false;
    this.preview_body = false;
    this.preview_next = true;
    this.preview_loader = false;
    for (var cl in this.importColumn) {
      this.mapping_header[cl] = cl;
    }
    this.importArray = this.logImportRaw;
  }
  sample_data = [];
  mapping_header = [];
  acc_err = false;
  nextImport() {
    this.acc_err = false;
    this.sample_data = [];
    if (this.importArray.length == 0) {
      //	alert('Please select CSV file to import');
      this.popUpMsg = JSON.stringify('Please select CSV file to import');
      this.openDialog();
      return false;
    }


    let i = 0;
    var result = [];
    console.log(this.csv_header);
    console.log(this.importColumn);
    for (var cl in this.importColumn) {
      this.mapping_header[cl] = cl;
    }

    console.log(this.mapping_header);
    for (let cpp of this.importArray) {

      if (i <= 2) {
        this.sample_data[i] = [];
        for (var j in cpp) {
          // alert([cpp [j]]);
          this.sample_data[i].push(([cpp[j]]).toString());
        }

      }
      i++
    }

    this.preview_loader = true;
    this.preview_next = true;
    this.upload_body = false;
    this.preview_body = false;
    console.log(this.sample_data);


  }
  set_account_id() {
    console.log(this.import_acc_id);
    console.log(this.importArray);
    let j = 0;
    for (let data of this.importArray) {
      this.importArray[j]['account_id'] = this.import_acc_id;
      j++;
    }
    console.log(this.importArray);
  }
  mapHeader(col, evnt) {

    var selected_col = evnt.target.value;

    for (var cl in this.mapping_header) {
      if (cl == col) {
        this.mapping_header[cl] = selected_col;
      }
    }
    console.log(this.mapping_header);
  }
  checkMapping() {
    var object = {};
    var result = [];
    var pp = [];
    // console.log(this.mapping_header.length);
    for (var key in this.mapping_header) {
      pp.push(this.mapping_header[key]);
    }
    if (pp && pp.length > 0) {
      pp.forEach(function (item) {
        if (!object[item])
          object[item] = 0;
        object[item] += 1;
      })

      for (var prop in object) {
        if (object[prop] >= 2) {
          result.push(prop);
        }
      }
      console.log(result);

    }

    return result;
  }
  logImportRaw = [];
  mapHeaderWithArray() {
    //  console.log(this.mapping_header);
    //console.log(this.importArray);
    var dataImportRaw = this.importArray;
    this.logImportRaw = this.importArray;
    var importArrData = [{}];
    for (let i = 0; i < dataImportRaw.length; i++) {
      importArrData[i] = {};
      var objj = {};
      for (const [k, value] of Object.entries(dataImportRaw[i])) {
        for (var key in this.mapping_header) {
          var map_val = this.mapping_header[key];
          if (k == key) {
            //  console.log(k, value);
            importArrData[i][map_val] = value;
          }
        }
      }
    }
    console.log(importArrData);
    this.importArray = importArrData;

  }

  public err_in_col = [[]];
  public err_in_columns = [];
  previewImport() {
    var mapRes = this.checkMapping();
    var head_string = '';
    if (mapRes && mapRes.length > 0) {
      for (let head of mapRes) {
        console.log(head);
        head_string += head + ' ';

      }
      this.popUpMsg = JSON.stringify('Please Map ' + head_string);
      this.openDialog();
      console.log(head_string);
      return false;
    } else {
      this.mapHeaderWithArray();
      //return false;
    }

    this.preview_loader = true;
    this.validate_fields = [];
    this.valid_column = [];
    this.email_valid = false;
    var errors_contain_lines = [];
    this.errorImportArray = [];


    if (this.importArray.length > 0) {
      let h = 0;
      for (let cpp of this.importArray) {
        this.err_in_col[h] = [];
        for (const [key, value] of Object.entries(this.importColumn)) {
          if (cpp[key] == undefined) {
            this.valid_column.push(key);
          }
          if (value == true) {
            if (cpp[key] == '') {
              console.log(key, '****' + cpp[key] + '******');
              this.validate_fields.push(key);
              errors_contain_lines.push(h);
              this.err_in_col[h].push(key);
            }
          }
          if (key == 'email') {
            // var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

            //   if (cpp[key] && reg.test(cpp[key]) == false) 
            //   {  
            //       this.email_valid=true;
            //       errors_contain_lines.push(h);
            //       this.err_in_col[h].push(key);
            //       console.log('Invalid Email Address'+cpp[key]);     
            //   }
          }
        }
        h++;
      }
      if (this.validate_fields.length > 0) {
        console.log('Error in lines', errors_contain_lines);
        var uniqueErrItems = Array.from(new Set(errors_contain_lines));
        let l = 0;
        for (let kk of uniqueErrItems) {
          this.errorImportArray.push(this.importArray[kk]);
          this.err_in_columns.push(this.err_in_col[kk]);
          console.log(this.errorImportArray);
          console.log(this.err_in_columns);
          l++;
        }
        setTimeout(() => {
          $(".err_col_imp").closest('td').css({ "border": "1px solid red", "border-bottom": "1px solid red", "border-top": "1px solid red" });

        }, 1200);

      }

      console.log(this.email_valid);
      if (this.validate_fields.length > 0) {
        var uniqueItems = Array.from(new Set(this.validate_fields));
        this.validate_fields = [];
        for (let valid of uniqueItems) {
          this.validate_fields.push(valid);
          //console.log(valid);
        }

      }
      if (this.valid_column.length > 0) {
        var uniqueItems = Array.from(new Set(this.valid_column));
        this.valid_column = [];
        for (let valid of uniqueItems) {
          this.valid_column.push(valid);
        }

      }

      console.log(this.validate_fields);
      console.log(this.valid_column);
      console.log(this.err_in_col);
      this.upload_body = false;
      this.preview_body = true;
      this.preview_next = false;
    } else {
      this.popUpMsg = JSON.stringify('Please choose file to upload');
      this.openDialog();
    }
    setTimeout(() => {
      this.preview_loader = false;
    }, 1000);
    setTimeout(() => {
      this.preview_loader = true;
    }, 1000);
    var bb = 0;
    for (let cpp of this.importArray) {
      for (const [key, value] of Object.entries(this.importColumn)) {
        if (key == 'created_date' || key == 'last_modified_date' || key == 'dob'
         || key=='close_date' || key=="travel_date" ) {          
          console.log(cpp[key], 'dateeee createddddddddd');
          if (cpp[key]) {
            var c_date = cpp[key];
            var from = c_date.split("-");
            var months = {jan:0,feb:1,mar:2,apr:3,may:4,jun:5,
                jul:6,aug:7,sep:8,oct:9,nov:10,dec:11};
              var cc_date=c_date.replace(/\//g, "-");
            var p = cc_date.split('-'); 
            
            if(p && p[2].length==2){
                    p[2]='20'+p[2];
            } var created_date= new Date(parseInt(p[2]),  parseInt(p[1].toLowerCase())-1, parseInt(p[0]));
            //var created_date = new Date(from[2], from[1] - 1, from[0]);
            console.log(created_date, p[1]+'**'+key+ parseInt(p[1].toLowerCase())+'format dateeee createddddddddd');
            
             if(this.isValidDate(created_date)){
                var dd = (created_date.getDate() < 10 ? '0' : '') + created_date.getDate();
                var MM = ((created_date.getMonth() + 1) < 10 ? '0' : '') + (created_date.getMonth() + 1);
                var yyyy = created_date.getFullYear();
                var created_dt = yyyy + '-' + MM + '-' + dd + ' 00:00:00';
                this.importArray[bb][key] = created_dt;
             }else{
               // this.popUpMsg = JSON.stringify('Please check Date Formates(eg 12-Feb-2020)');
               // this.openDialog();
               // this.backToImport();
               var created_dt=this.formatDateImp(new Date());
               this.importArray[bb][key] = created_dt + ' 00:00:00';
                 
            }
            console.log(created_dt,key,cpp[key])

            
          }
        }
      }
      bb++;
    }
    if (this.type == 'opportunities') {
      var m = 0;
      for (let cpp of this.importArray) {
        for (const [key, value] of Object.entries(this.importColumn)) {
          if (key == 'destinations') {
            console.log(cpp[key]);
            var array = cpp[key].split(',');
            this.importArray[m][key] = array;
          }
          if (key == 'inclusions') {
            console.log(cpp[key]);
            var array = cpp[key].split(',');
            this.importArray[m][key] = array;
          }
        } console.log(this.importArray);
        //console.log(cpp);
        m++;
        //return false;
      }
    }
  }


  backToImport() {
    this.import_data();
  }

  checkfile(sender) {
    // console.log(sender,'chkfile');
    var validExts = new Array(".csv");
    var fileExt = sender;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      this.popUpMsg = JSON.stringify("Invalid file selected, valid files are of " +
        validExts.toString() + " types.");
      $(".inputfile").val(null);
      this.import_data();
      this.openDialog();
      return false;
    }
    else {
      return true;
    }
  }
  choose_file = '';
  onFileSelect(input: HTMLInputElement) {
    this.preview_loader = true;
    const files = input.files;
    // var content = this.csvContent;
    var filecheck = false;
    if (files && files[0]) {
      filecheck = this.checkfile(files[0].name);
      this.choose_file = files[0].name;
    }

    if (files && files.length && filecheck) {
      const fileToRead = files[0];
      const fileReader = new FileReader();
      fileReader.readAsText(fileToRead, "UTF-8");
      setTimeout(() => {
        // console.log(fileReader.result);
        if (this.hasUnicode(fileReader.result)) {
          this.popUpMsg = JSON.stringify('CSV may be currupted.Please check CSV file.');
          this.openDialog();
          this.import_data();
          return false;
        }

        this.importArray = this.csvJSON(fileReader.result);
        var csv_limit = 2000;
        if (this.type == 'opportunities' || this.type == 'opportunity_histories') {
          csv_limit = 1000;
        }
        if (this.importArray.length > csv_limit) {
          this.popUpMsg = JSON.stringify('CSV data must be less than ' + csv_limit + ' rows');
          this.openDialog();
          this.import_data();
          return false;
        }
        console.log(this.importArray);
        this.preview_loader = false;
        $(".inputfile").val(null);
      }, 1000);
    } else {
      this.preview_loader = false;
    }

  }
  hasUnicode(str) {
    for (var i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 127 && str.charCodeAt(i) != 65533) {

        // setTimeout(()=>{
        this.popUpMsg2 = JSON.stringify('Please check special unicodes near : ' + str.substring(i, i + 100));
        this.openDialog2();
        // alert('Please check special unicodes near : \n\n'+str.substring(i, i+50)); 
        return true;
        //   },1600);

      }
    }
    return false;
  }


  csvJSON(csvText) {
    let lines = [];
    const linesArray = csvText.split('\n');
    // for trimming and deleting extra space 
    linesArray.forEach((e: any) => {
      //const row = e.replace(/[\s]+[,]+|[,]+[\s]+/g, ' ').trim();
      const row = e.replace(/\s*,\s*/g, ",").trim();
      lines.push(row);
    });
    console.log(lines);
    // for removing empty record
    lines.splice(lines.length - 1, 1);
    const result = [];
    const headers = lines[0].split(",");
    console.log(lines);
    this.csv_header = headers;
    //alert(this.csv_header.length);
    if (headers.length > 0) {
      //delete this.csv_header[headers.length-1];
      //this.csv_header.splice(-1,1);
    }

    //alert(this.csv_header.length);
    console.log(this.csv_header);
    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentline = this.CSVtoArray(lines[i]);
      if (currentline == null) {
        // alert(i+1);
        this.popUpMsg2 = JSON.stringify('Please check Line No- : ' + (i + 1) + ' [eg:Remove double quotes]');
        this.openDialog2();
        return false;
      }
      console.log(currentline);
      if (currentline && currentline.every(element => element === '')) {
        console.log('not valid lines');
      } else {
        for (let j = 0; j < headers.length; j++) {
          if (currentline[j]) {
            //obj[headers[j]] = currentline[j];
            obj[headers[j]] = currentline[j].replace('�', '');

            obj[headers[j]] = obj[headers[j]].replace('�', '');
          } else {
            obj[headers[j]] = '';
          }

        }
      }


      result.push(obj);
    }
    console.log(result);
    return result;
  }
  CSVtoArray(text) {
    // console.log(text);
    //text = text.replace("'", "");
    text = text.replace(/'/g, ' ');
    //text = text.replace(/"/g, ''); 
    // text=text.replace(/\//g, " "); 
    //text = text.replace('/', ' ');
    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    // var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;

    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    //text=text.toString().replace(/["']/g, "");
    // Return NULL if input string is not well formed CSV string.
    if (!re_valid.test(text)) {
      console.log(text);
      this.popUpMsg = JSON.stringify('CSV may be currupted.Please check CSV file.[eg:Remove quotes(")]');
      this.openDialog();
      this.preview_loader = false;
      this.import_data();
      return null;
    }
    var a = [];                     // Initialize array to receive values.
    text.replace(re_value, // "Walk" the string using replace with callback.
      function (m0, m1, m2, m3) {
        // Remove backslash from \' in single quoted values.
        if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
        // Remove backslash from \" in double quoted values.
        else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
        else if (m3 !== undefined) a.push(m3);
        return ''; // Return empty string.
      });
    // Handle special case of empty last value.
    if (/,\s*$/.test(text)) a.push('');
    return a;
  };
  CSVtoArray2(text) {

    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    // Return NULL if input string is not well formed CSV string.
    text = text.toString().replace(/["']/g, "");
    console.log(text);
    if (!re_valid.test(text)) return null;
    var a = [];                     // Initialize array to receive values.
    text.replace(re_value, // "Walk" the string using replace with callback.
      function (m0, m1, m2, m3) {
        // Remove backslash from \' in single quoted values.
        if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
        // Remove backslash from \" in double quoted values.
        else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
        else if (m3 !== undefined) a.push(m3);
        return ''; // Return empty string.
      });
    // Handle special case of empty last value.
    if (/,\s*$/.test(text)) a.push('');
    console.log(a);
    return a;
  };
  account_valid = [];
  importData() {
    this.account_valid = [];
    this.dataImport = this.importArray;
    //var data={};

    var data = { "results": this.importArray };
    this.importService.importData(data, this.type).subscribe((res: any) => {
      console.log(res, 'import result');
      this.popUpMsg = JSON.stringify(res.message);
      this.openDialog();
      if (res.errors.length > 0) {
        this.errorImportArray = res.errors;
        this.importArray = [];
        this.account_valid.push('account_name');
        setTimeout(() => {
          $(".err_col_imp").closest('td').css({ "border": "1px solid red", "border-bottom": "1px solid red", "border-top": "1px solid red" });

        }, 1600);
      } else {
        this.importPop = false;
        this.upload_body = false;
        this.preview_body = false;
        this.import_data();
      }
      console.log(this.errorImportArray);
    }, error => {
      console.log(error, 'error report');
    });
  }
get_resp_details(){
   //this.invoiceDet=true;   
  
 setTimeout(()=>{        
      $('#all_response').css('display','block');
      var invHTML=$('#response_data').html();
      $('#all_response_body').html(invHTML);
      //$(".response_modal .modal-dialog-aside").css('width','75%');
     
  },300);
     
  }
  isValidDate(dateObject){
    return new Date(dateObject).toString() !== 'Invalid Date';
}
  formatDateImp(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}
}
