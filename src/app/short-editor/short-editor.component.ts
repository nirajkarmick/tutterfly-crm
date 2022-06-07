import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource ,MatDialog} from '@angular/material';
import { AlertBoxComponent } from '../alert-box/alert-box.component';
import * as Quill from 'quill';
import { FileService } from '../file.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-short-editor',
  templateUrl: './short-editor.component.html',
  styleUrls: ['./short-editor.component.css']
})
export class ShortEditorComponent implements OnInit {

  constructor(private service: FileService,public dialog: MatDialog) { }

  @Input() description_html:String;
  @Output() description_htmlChange = new EventEmitter<any>(); 
  quill:any;
  editor_selected:any;
  loadQuil:false;
  popUpMsg:any; 

  editorConfig: AngularEditorConfig = {    
    editable: true,
    height: "15rem",
    minHeight: "5rem",
    placeholder: "Enter text here...",
    uploadUrl:environment.ip+"/rest_email_image_editor",
    translate: "no",
    defaultParagraphSeparator: "p",
    defaultFontName: "Arial",
    sanitize: false,
  };

    openDialog(): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '250px',
      data: this.popUpMsg
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  ngOnInit() {
    setTimeout(()=>{
            if(this.loadQuil){
                   this.loadEditor();

            }
         },100);
    setTimeout(()=>{
          $("#myEditor .angular-editor-button[title='Insert Image']").css('display','none'); 
          $("#myEditor .angular-editor-button[title='Strikethrough']").css('display','none'); 
          $("#myEditor .angular-editor-button[title='Subscript']").css('display','none'); 
          $("#myEditor .angular-editor-button[title='Superscript']").css('display','none'); 
          $("#myEditor .angular-editor-button[title='Justify Left']").css('display','none'); 
          $("#myEditor .angular-editor-button[title='Justify Right']").css('display','none'); 
          $("#myEditor .angular-editor-button[title='Justify Center']").css('display','none'); 
          $("#myEditor .angular-editor-button[title='Justify Full']").css('display','none'); 
          $("#myEditor .angular-editor-button[title='Indent']").css('display','none'); 
          $("#myEditor .angular-editor-button[title='Outdent']").css('display','none'); 
          $("#myEditor .angular-editor-button[title='Unordered List']").css('display','none'); 
          $("#myEditor .angular-editor-button[title='Ordered List']").css('display','none'); 
          $("#myEditor .angular-editor-button[title='Text Color']").css('display','none'); 
          $("#myEditor .angular-editor-button[title='Background Color']").css('display','none'); 
          $("#myEditor .angular-editor-button[title='Insert Link']").css('display','none'); 
          $("#myEditor .angular-editor-button[title='Unlink']").css('display','none'); 
          $("#myEditor .angular-editor-button[title='Insert Video']").css('display','none'); 
          $("#myEditor .angular-editor-button[title='Horizontal Line']").css('display','none'); 
          $("#myEditor .angular-editor-button[title='Clear Formatting']").css('display','none'); 
          $("#myEditor .angular-editor-button[title='HTML Code']").css('display','none'); 
          $("#myEditor .angular-editor-button[title='Undo']").css('display','none'); 
          $("#myEditor .angular-editor-button[title='Redo']").css('display','none'); 
   		  $("#myEditor .angular-editor-toolbar-set ae-select").css('display','none'); 
        $("#myEditor .angular-editor-toolbar-set img").css('display','none'); 
    }	
    ,800);
 

  }
loadEditor(){  
         let Font = Quill.import('formats/font');
        Quill.register(Font, true); 

        var DirectionAttribute = Quill.import('attributors/attribute/direction');
        Quill.register(DirectionAttribute,true);

        var AlignClass = Quill.import('attributors/class/align');
        Quill.register(AlignClass,true);

        var BackgroundClass = Quill.import('attributors/class/background');
        Quill.register(BackgroundClass,true);

        var ColorClass = Quill.import('attributors/class/color');
        Quill.register(ColorClass,true);

        var DirectionClass = Quill.import('attributors/class/direction');
        Quill.register(DirectionClass,true);        

        var SizeClass = Quill.import('attributors/class/size');
        Quill.register(SizeClass,true);

        var AlignStyle = Quill.import('attributors/style/align');
        Quill.register(AlignStyle,true);

        var BackgroundStyle = Quill.import('attributors/style/background');
        Quill.register(BackgroundStyle,true);

        var ColorStyle = Quill.import('attributors/style/color');
        Quill.register(ColorStyle,true);

        var DirectionStyle = Quill.import('attributors/style/direction');
        Quill.register(DirectionStyle,true);
 
        var FontClass = Quill.import('attributors/class/font');
        FontClass.whitelist =  ['sans-serif','serif','monospace','comic-sans-ms','arial',
        'times-new-roman','georgia','tahoma','trebuchet-ms','garamond','verdana'];
        Quill.register(FontClass,true);

        var FontStyle = Quill.import('attributors/style/font');
        FontStyle.whitelist =  ['sans serif','serif','monospace','comic sans ms','arial',
        'times new roman','georgia','tahoma','trebuchet ms','garamond','verdana'];
        Quill.register(FontStyle,true);


        var SizeStyle = Quill.import('attributors/style/size');
        Quill.register(SizeStyle,true);

       
          // let IndentStyle = new IndentAttributor('indent', 'text-indent', {  
          //   scope: Parchment.Scope.BLOCK,
          //   whitelist: ['1em', '2em', '3em', '4em', '5em', '6em', '7em', '8em', '9em']
          // })
          // Quill.register(IndentStyle, true); 

          let toolbarOptions = [
           
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],

          [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
          [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
          [{ 'direction': 'rtl' }],                         // text direction

          [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

          [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          // [{ 'font': [] }],
          [{ 'align': [] }],

          ['clean']                                         // remove formatting button
       ];
        let that=this;
        // this.quill = new Quill('#editor-container', {
        //     modules: {
        //       toolbar: '#toolbar-container',
        //     },
        //     theme: 'snow'
        //   });
    


  }
 
 editor:any;

 pushImageToEditor() {
  const range = this.editor.getSelection(true);
  const index = range.index + range.length;
  this.editor.insertEmbed(range.index, 'image', '/assets/index/');
}
onEditorChange(val){ 
   
   this.description_html=val.html;  
 if(this.description_html==undefined){     
      this.description_htmlChange.emit(val.html);    
 }else{  
     this.description_htmlChange.emit(this.description_html); 
 }
    
}
 onChangeHtml(val){ 
   console.log(val);  
   this.description_html=val;  
 if(this.description_html==undefined){     
      this.description_htmlChange.emit('');    
 }else{  
     this.description_htmlChange.emit(this.description_html); 
 }
    
}
addVideo(){
  var value = prompt('Add Video URL');
  var index:number;
            if(value){
                const range = this.editor_selected.getSelection();
                if(range==null){
                  var index=0;
                }else{
                 var index = parseInt(range.index);
                }
                this.editor_selected.insertText(index, 'Watch this video - '+value , '', true);
            }
} 

 
addImage(){
            var value = prompt('Add Image URL');
             var index:number;
            if(value){
                const range = this.editor_selected.getSelection();
                if(range==null){ 
                  var index=0;
                }else{
                 var index = parseInt(range.index);
                }
                this.editor_selected.insertEmbed(index, 'image', value, Quill.sources.USER);
            }
}


EditorCreated(editor){

  let that=this;
  that.editor_selected=editor;
        function selectLocalImage() {
          
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/x-icon');
          input.click();

          // Listen upload local image and save to server
          //let that=this;
          input.onchange = () => {
            const file = input.files[0];             
            // file type is only image.
            if (/^image\//.test(file.type)) {
              //saveToServer(file);
                  let form = new FormData();
                 form.set("email_image",file);
                 let that1=this;  
                 that.service.uploadFileTos3(form).subscribe((data:any) => {
                          console.log(data.image_url);
                          insertToEditor(data.image_url);    
                    },(error)=>{
                    that.popUpMsg=JSON.stringify('Something went wrong!');
                    that.openDialog();
                    
                });
            } else {
              showError();
              console.warn('You could only upload images.');
            }
          };

        }
        function showError(){
           let that=this;
           alert('You could only upload images.');
         // that.popUpMsg=JSON.stringify('You could only upload images.');
          //that.openDialog();
        }
        function saveToServer(files: File) {   
             
             let form = new FormData();
             form.set("email_image",files);
             let that1=this; 
             that1.service.uploadFileTos3(form).subscribe((data) => {
                      console.log(data.image_url);
                      insertToEditor(data.image_url);    
                },(error)=>{
                that.popUpMsg=JSON.stringify('Something went wrong!');
                that.openDialog();
                
            });
        }
        // readFile(files) {
  
        //       if (files) {
                
        //         var FR= new FileReader();
                
        //         FR.addEventListener("load", function(e) {
        //           console.log(e.target.result);
        //          // document.getElementById("img").src       = e.target.result;
        //           //document.getElementById("b64").innerHTML = e.target.result;
        //         }); 
                
        //         FR.readAsDataURL( files );
        //       }
  
        //    }
        function selectExternalImage(){
            var value = prompt('Add Image URL');
            if(value){
                const range = editor.getSelection();
                editor.insertEmbed(range.index, 'image', value, Quill.sources.USER);
            }

        }
        function insertToEditor(url: string) {
          const range = editor.getSelection();
          editor.insertEmbed(range.index, 'image', url);
        }

        function insertVideoToEditor(url: string) {
          alert('video');
          const range = editor.getSelection();
          editor.insertEmbed(range.index, 'video', url);
        }

        editor.getModule('toolbar').addHandler('image', () => {
          selectLocalImage();          
        });

        // editor.getModule('toolbar').addHandler('video', () => {
        //   //insertVideoToEditor('https://vimeo.com/70591644');
        // });
    }




}   
 

const Parchment = Quill.import('parchment')

class IndentAttributor extends Parchment.Attributor.Style {
  add (node, value) {
    if (value === 0) {
      //this.remove(node)
      return true
    } else {
      return super.add(node, `${value}em`)
    }
  }
}
 