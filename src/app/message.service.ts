import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { SubscribeOnObservable } from 'rxjs/internal-compatibility';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

   importArray: any = [];
   extData:any; 
  constructor() { }
  private subject = new Subject<any>();
 
  sendMessage(message: string) {
      this.subject.next({ text: message });
  }

  clearMessage() {
      this.subject.next();
  }

  getMessage(): Observable<any> {
      return this.subject.asObservable();
  }
  private id = new Subject<any>();
 
  sendId(id: number) {
      this.subject.next(id);
  }
  sendQuery(id: any) {
    this.subject.next(id);
}
  clearId() {
      this.subject.next();
  }

  getId(): Observable<any> {
      return this.subject.asObservable();
  }
 

   onFileLoad(textFromFileLoaded) {
      // console.log(fileLoadedEvent);
      //        const csvSeparator = ';';
      // const textFromFileLoaded = fileLoadedEvent.target.result;
    // console.log(textFromFileLoaded);
     let data=textFromFileLoaded;
    
      // Retrieve the delimeter
         const delimeter = ',';

      // initialize variables
      var newline = '\n';
      var eof = '';
      var i = 0;
      var c = data.charAt(i);
      var row = 0;
      var col = 0;
      var array = new Array();

  while (c != eof) {
    // skip whitespaces
    while (c == ' ' || c == '\t' || c == '\r') {
      c = data.charAt(++i); // read next char
    }
    
    // get value
    var value = "";
    if (c == '\"') {
      // value enclosed by double-quotes
      c = data.charAt(++i);
      
      do {
        if (c != '\"') {
          // read a regular character and go to the next character
          value += c;
          c = data.charAt(++i);
        }
        
        if (c == '\"') {
          // check for escaped double-quote
          var cnext = data.charAt(i+1);
          if (cnext == '\"') {
            // this is an escaped double-quote. 
            // Add a double-quote to the value, and move two characters ahead.
            value += '\"';
            i += 2;
            c = data.charAt(i);
          }
        }
      }
      while (c != eof && c != '\"');
      
      if (c == eof) {
        throw "Unexpected end of data, double-quote expected";
      }

      c = data.charAt(++i);
    }
    else {
      // value without quotes
      while (c != eof && c != delimeter && c!= newline && c != ' ' && c != '\t' && c != '\r') {
        value += c;
        c = data.charAt(++i);
      }
    }

    // add the value to the array
    if (array.length <= row) 
      array.push(new Array());
      array[row].push(value);    
    
    // skip whitespaces
    while (c == ' ' || c == '\t' || c == '\r') {
      c = data.charAt(++i);
    }

    // go to the next row or column
    if (c == delimeter) {
      // to the next column
      col++;
    }
    else if (c == newline) {
      // to the next row
      col = 0;
      row++;
    }
    else if (c != eof) {
      // unexpected character
      throw "Delimiter expected after character " + i;
    }
    
    // go to the next character
    c = data.charAt(++i);
  }  
  
  console.log(array);
  let ct=0;
  for(let arr of array){
        if(ct > 0){
          let pt=0;
          for(let cpp of arr){
            // this.importArray[ct][array[0][pt]]=cpp;
             //array[ct]['"'+array[0][pt]+'"']=cpp;  
             array[ct][array[0][pt]]=cpp;             
             delete array[ct][pt];
             pt++
          } 
        }
        ct++;
  }
  let that=this;
      //setTimeout(()=>{           
          //  this.importArray=array; 
          //console.log(array);
           return array;
        // },1000); 

}
  
}
