import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';
import { MailService } from '../service/mail.service';
@Component({
    selector: 'app-mailbox',
    templateUrl: './mailbox.component.html',
    styleUrls: ['./mailbox.component.css'],
    //providers:MailService
})
export class MailboxComponent implements OnInit {

    constructor(private msg: MessageService, private mailService: MailService) {
        this.msg.sendMessage("mail");

    if (location.hostname.search("192.168") >= 0 || location.hostname.search("localh") >= 0
      || location.hostname.search("tnt1") >= 0 || location.hostname.search("tfc8") >= 0 || 
      location.hostname.search("adrenotravel.") >= 0) { 
         this.isLocal=true;
        }
    }
isLocal=false;
    userName: any;
    userImage: any;
    userEmail: any;
    allMail: any;
    allInbox: any;
    allSent: any;
    inboxDiv = true;
    bodyDiv = false;
    inboxBody: any;
    unread_msg = 0;
    inbox_active = true;
    tittle = 'Inbox';
    box_msg = "";
    keywords="";
    composemail(){
        document.getElementById('comp_mail_header').click();
    } 
    search_inbox(){
      console.log(this.keywords,'key');
      this.getMails();
    }
    ngOnInit() {
        console.log('v');
        this.page_no=1;
        this.keywords="";
        this.tittle = 'Inbox';
        this.box_msg = "";
        this.inbox_active = true; 
        this.inboxDiv = true;
        this.bodyDiv = false;
        this.userName = localStorage.getItem('user');
        this.userImage = localStorage.getItem('userImage');
        this.userEmail = localStorage.getItem('fromMail');
        this.getMails();
    }
page_no=1;
previous_page=2;
total_mail=0;
start_email=1;
end_email=50;
next_email(){
    this.getMails()
}
previous_email(){
    this.page_no=this.previous_page;
    this.getMails();
}
total_pages=1;
getMails(){

        this.mailService.getAllMail(this.keywords,this.page_no).subscribe((data: any) => {
            console.log(data);
            this.allMail = data;
            this.allInbox = data.inbox;
            this.total_mail = data.total?data.total:0;  
            this.total_pages=this.total_mail/50<1?1:Math.ceil(this.total_mail/50);        

            if(this.page_no>1){
                 this.start_email=( this.page_no-1)*50+1;                 
                 this.end_email= this.page_no *50;
                    if(this.page_no==this.total_pages){
                        this.end_email=this.total_mail;
                    }
            }else{
                this.start_email=1;
                 this.end_email=50;
                if(this.total_mail<50){
                    this.end_email=this.total_mail;
                }
            }
            this.page_no = data.next_page?data.next_page:2;
            this.previous_page = data.previous_page?data.previous_page:0;
           // alert(this.total_pages);
            var unread_count = 0;
            let that = this;
            console.log(this.allInbox);
            if (this.allInbox && this.allInbox.length>0) {
                this.allInbox.forEach(function (inbox) {
                    //console.log(inbox);

                    if (inbox.seen == 0) {
                        unread_count++;
                        that.unread_msg = unread_count;
                    }
                });

                this.allSent = data.sent;
                this.allInbox.sort(function (a, b) {
                    if (b.date != null || a.date != null) {
                        return <any>new Date(b.date) - <any>new Date(a.date);
                    }
                });
                this.allSent.sort(function (a, b) {
                    if (b.date != null || a.date != null) {
                        return <any>new Date(b.date) - <any>new Date(a.date);
                    }
                });
                this.box_msg = "";
            } else {
            console.log(this.allInbox,'ghgh');
                this.box_msg = "Inbox is empty!"
            }


        }, error => {
            this.box_msg = "Something went wrong!";
        });
}
    getSent() {
        this.inbox_active = false;
        this.inboxDiv = true;
        this.bodyDiv = false;
        this.tittle = 'Sent';
        if (this.allMail && this.allMail.sent.length > 0) {
            this.allInbox = this.allMail.sent;
            this.box_msg = "";
        } else {
            this.box_msg = "Sent is empty!"
        }

    }
    checked: any;
    makeAsRead() {

        $(".mail_check").each(function () {
            let that = this;
            var checked = false;
            if ($(this).prop("checked")) {
                checked = true;
                console.log($(this).val());
            }
        });
    }
    markEmail() {
        var checked = [];
        $(".mail_check").each(function () {
            let that = this;
            if ($(this).prop("checked")) {
                // if(that.checked){
                checked.push(true);
            }
        });
        console.log(checked);
        if (checked && checked.length > 0) {
            $("#btnGroupDel").show();
            $("#mailboxRefresh").hide();
        } else {
            $("#btnGroupDel").hide();
            $("#mailboxRefresh").show();
        }
    }
    valueChanged() {
        if ($('#checkallMail').is(":checked")) {
            $(".mail_check").each(function () {
                $(this).prop("checked", true);
            });
            $("#btnGroupDel").show();
            $("#mailboxRefresh").hide();
        }
        else {
            $(".mail_check").each(function () {
                $(this).prop("checked", false);
            });
            $("#btnGroupDel").hide();
            $("#mailboxRefresh").show();
        }
    }

    inBetween(dat1: any) {
        //console.log(date1);
        var date1 = new Date(dat1);
        var date2 = new Date();
        //Get 1 day in milliseconds
        var one_day = 1000 * 60 * 60 * 24;
        var one_hour = 1000 * 60 * 60;
        var one_min = 1000 * 60;

        // Convert both dates to milliseconds
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();

        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;
        var diff_in_hour = Math.round(difference_ms / one_hour);
        if (diff_in_hour > 24) {
            var dd = (date1.getDate() < 10 ? '0' : '') + date1.getDate();
            var MM = ((date1.getMonth() + 1) < 10 ? '0' : '') + (date1.getMonth() + 1);
            var yyyy = date1.getFullYear();
            var s_yyyy=date2.getFullYear();
            var time= this.formatAMPM(date1);
            var year=''+yyyy+' ';
            if(s_yyyy==yyyy){
              year="";
            }
            const full_date  = date1.getDate()+' '+date1.toLocaleString('default', { month: 'short' })+' '+year+time;
           
            var dayss = full_date;
           // var dayss = Math.round(difference_ms / one_day) + ' days ago';
        } else if (diff_in_hour < 1) {
           // var dayss = Math.round(difference_ms / one_min) + ' min ago';
            var dayss= this.formatAMPM(date1);
        }
        else {
           // var dayss = diff_in_hour + ' hours ago';
            var dayss= this.formatAMPM(date1);
        }
        // Convert back to days and return
        //console.log(diff_in_hour);
        //console.log(difference_ms);
        //console.log(Math.round(difference_ms / one_day));
        //var dayss=Math.round(difference_ms/one_day);


        return dayss;

    }
formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}
    getMail(msgId, folder_name) {

    let rand_char = Math.random().toString(36).substring(7);
    window.location.hash=rand_char;
        if (folder_name == 'INBOX') {
            this.mailService.mailSeen(msgId).subscribe((data: any) => {

                let that = this;
                this.allInbox.forEach(function (inbox) {
                    console.log(inbox);
                    if (inbox.message_id == msgId) {
                        that.inboxBody = inbox;
                        that.inboxDiv = false;
                        that.bodyDiv = true;
                    }
                });
            });
        } else {
            let that = this;
            this.allInbox.forEach(function (inbox) {
                console.log(inbox);
                if (inbox.message_id == msgId) {
                    that.inboxBody = inbox;
                    that.inboxDiv = false;
                    that.bodyDiv = true;
                }
            });
        }
    }

}
