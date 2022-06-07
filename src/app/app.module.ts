import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MyRouterModule } from './router/router.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginServiceService } from './service/login-service.service';
import { AccountsGridComponent } from './accounts-grid/accounts-grid.component';
import { AccountServiceService } from './service/account-service.service';
import { SupplierService } from './service/supplier.service';
import { AccountsMapService } from './service/accounts-map.service';
import { ExtraService } from './service/extra.service';
import { CustomInterceptor } from './custom-interceptor';
import { NoLoaderInterceptor } from './no-loader-interceptor';
import { MainPageComponent } from './main-page/main-page.component';
import { Select2Module } from 'ng2-select2';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import {MatSliderModule} from '@angular/material/slider';
//import {NgcCookieConsentModule} from 'ngx-cookieconsent';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {
    MatMenuModule, MatDatepickerModule
    , MatNativeDateModule, MatAutocompleteModule
    , MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule,
    MatDialogModule, MatSelectModule, MatProgressSpinnerModule,MatRadioModule,MatChipsModule, MatIconModule 
} from '@angular/material';

import { AmChartsModule } from '@amcharts/amcharts3-angular';

import { AlertBoxComponent } from './alert-box/alert-box.component';
import { TaskBoxComponent } from './task-box/task-box.component';

import { NgHttpLoaderModule } from 'ng-http-loader';
import { ContactGridComponent } from './contact-grid/contact-grid.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { OppurtunityGridComponent } from './oppurtunity-grid/opportunity-grid.component';
import { OppoDetailsComponent } from './oppo-details/oppo-details.component';
import { LeaderGridComponent } from './leader-grid/leader-grid.component';
import { LeaderDetailsComponent } from './leader-details/leader-details.component';
import { PersonelDetailsComponent } from './personel-details/personel-details.component';
import { PersonelGridComponent } from './personel-grid/personel-grid.component';
import { ViewAllComponent } from './view-all/view-all.component';
// import {DayPilotModule} from 'daypilot-pro-angular';
import { KanbanViewComponent } from './kanban-view/kanban-view.component';
import { OppoStagesComponent } from './oppo-stages/oppo-stages.component';
import { MapComponent } from './map/map.component';
import { AgmCoreModule } from '@agm/core';
import { FunnelComponent } from './funnel/funnel.component';
import { TasksComponent } from './tasks/tasks.component';
import { TaskGridViewComponent } from './task-grid-view/task-grid-view.component';
import { TaskSplitViewComponent } from './task-split-view/task-split-view.component';
import { NewTaskComponent } from './new-task/new-task.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { FileComponent } from './file/file.component';
import { FileGridComponent } from './file-grid/file-grid.component';
import { FileDetailsComponent } from './file-details/file-details.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { ReportsComponent } from './reports/reports.component';
import { AddEditReportComponent } from './add-edit-report/add-edit-report.component';
import { ReportGridComponent } from './report-grid/report-grid.component';
import { CreateNewReportComponent } from './create-new-report/create-new-report.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { AdminfooterComponent } from './adminfooter/adminfooter.component';
import { AdminmainComponentComponent } from './adminmain-component/adminmain-component.component';
import { AdminLeftMenuComponent } from './admin-left-menu/admin-left-menu.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminEmailComponent } from './admin-email/admin-email.component';
import { IndustriesComponent } from './industries/industries.component';
import { SalesStagesComponent } from './sales-stages/sales-stages.component';
import { UsersComponent } from './users/users.component';
import { EmailTemplateComponent } from './email-template/email-template.component';
import { CompanySettingComponent } from './company-setting/company-setting.component';
// import { SnapSupplierComponent } from './snap-supplier/snap-supplier.component';
import { SalutationsComponent } from './salutations/salutations.component';
import { LeadRatingComponent } from './lead-rating/lead-rating.component';
import { LeadStaComponent } from './lead-sta/lead-sta.component';
import { TaskStatusComponent } from './task-status/task-status.component';
import { OppoInclusionsComponent } from './oppo-inclusions/oppo-inclusions.component';
import { TaskPrioritiesComponent } from './task-priorities/task-priorities.component';
import { OppoExperienceComponent } from './oppo-experience/oppo-experience.component';
import { OppoDestinationComponent } from './oppo-destination/oppo-destination.component';
import { EmailFooterComponent } from './email-footer/email-footer.component';
import { SharingSettingComponent } from './sharing-setting/sharing-setting.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { environment } from '../environments/environment';
import { AdminRoleComponent } from './admin-role/admin-role.component';
import { AppPasswordDirective } from './app-password.directive';
import { TfcMainComponent } from './tfc-main/tfc-main.component';
import { HomeComponent } from './home/home.component';
import { TfcLoginComponent } from './tfc-login/tfc-login.component';

import { ThankyouComponent } from './thankyou/thankyou.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AccountMergeComponent } from './account-merge/account-merge.component';
import { AccountMergeListComponent } from './account-merge-list/account-merge-list.component';

import { QuillModule } from 'ngx-quill';
import { AccessAccountComponent } from './access-account/access-account.component';
import { QuilEditorComponent } from './quil-editor/quil-editor.component';
import { PullitComponent } from './pullit/pullit.component';

import { OwlModule } from 'ngx-owl-carousel';
import { MailboxComponent } from './mailbox/mailbox.component';
import { ImportComponent } from './import/import.component';
import { NgxSortableModule } from 'ngx-sortable';
import { GmailComponent } from './gmail/gmail.component';
import { CustomFormComponent } from './custom-form/custom-form.component';
import { ItineraryMainComponent } from './itinerary-main/itinerary-main.component';
 
import { AlertMsgComponent } from './alert-msg/alert-msg.component';
import { AddformComponent } from './addform/addform.component';
import { DocHeaderFooterComponent } from './doc-header-footer/doc-header-footer.component';

import { DragAndDropModule } from 'angular-draggable-droppable';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ItineraryInclusionComponent } from './itinerary-inclusion/itinerary-inclusion.component';
import { HtmlEditorComponent } from './html-editor/html-editor.component';

import { AngularEditorModule } from '@kolkov/angular-editor';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { EditformComponent } from './editform/editform.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReportMainComponent } from './report-main/report-main.component';
import { ReportStandardComponent } from './report-standard/report-standard.component';
import {ReportsStandardListComponent} from './reports-standard-list/reports-standard-list.component';
import { PreviewComponent } from './preview/preview.component';
import { NewItineraryListComponent } from './new-itinerary-list/new-itinerary-list.component';
import { NewItineraryBuilderComponent } from './new-itinerary-builder/new-itinerary-builder.component';
import { NewItineraryDetailsComponent } from './new-itinerary-details/new-itinerary-details.component';
import { FlightDetailsComponent } from './flight-details/flight-details.component';
import { NewItineraryHotelComponent } from './new-itinerary-hotel/new-itinerary-hotel.component';
import { AddressFormComponent } from './address-form/address-form.component';
import { WebformComponent } from './webform/webform.component';
import { LeadCaptureComponent } from './lead-capture/lead-capture.component';
import { NewItineraryInclusionsComponent } from './new-itinerary-inclusions/new-itinerary-inclusions.component';
import { ShortEditorComponent } from './short-editor/short-editor.component';
import { SubscriptionListComponent } from './subscription-list/subscription-list.component';
import { SubscriptionDetailsComponent } from './subscription-details/subscription-details.component';
import { OppTagsComponent } from './opp-tags/opp-tags.component';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import { BillingsComponent } from './billings/billings.component';
import { BillingDetailsComponent } from './billing-details/billing-details.component';
import { BillingHistoryComponent } from './billing-history/billing-history.component';
import { BillingEstimateComponent } from './billing-estimate/billing-estimate.component';
import { AddStandardComponent } from './add-standard/add-standard.component';
import { FormManagementComponent } from './form-management/form-management.component';

import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';
import { SupplierComponent } from './supplier/supplier.component';
import { SupplierDetailsComponent } from './supplier-details/supplier-details.component';
import { FacebookConnectComponent } from './facebook-connect/facebook-connect.component';

import { SelectDropDownModule } from 'ngx-select-dropdown';
import { ItineraryTemplateComponent } from './itinerary-template/itinerary-template.component';
import { ItineraryPdfComponent } from './itinerary-pdf/itinerary-pdf.component';
import { SupplierPicklistComponent } from './supplier-picklist/supplier-picklist.component';
import { DynamicTemplateComponent } from './dynamic-template/dynamic-template.component';
import { SupplierTemplateComponent } from './supplier-template/supplier-template.component'
import { EmailEditorModule } from 'angular-email-editor';
import { AttachmentUploadComponent } from './attachment-upload/attachment-upload.component';
import { DirectoryComponent } from './directory/directory.component';
import { WhatsappFormComponent } from './whatsapp-form/whatsapp-form.component';
import { WhatsappAttachmentComponent } from './whatsapp-attachment/whatsapp-attachment.component';
import { EmailAttachmentComponent } from './email-attachment/email-attachment.component';
 

 import {DataTablesModule} from 'angular-datatables';
import { ItineraryHtmlComponent } from './itinerary-html/itinerary-html.component';
// const cookieConfig:NgcCookieConsentConfig = {
//   cookie: {
//     domain: environment.cookieDomain // or 'your.domain.com' // it is mandatory to set a domain, for cookies to work properly (see https://goo.gl/S2Hy2A)
//   },
//   position: "bottom-right",
//   palette: {
//     popup: {
//       background: '#006dcc' 
//     },
//     button: {
//       background: '#f16a25',
//        text: "#fff",
//        link:"#fff",
//        border: "transparent"
//     }
//   },
//   theme: 'classic',
//   type: 'opt-out',
//    content: {
//     "message": "This website uses cookies to ensure you get the best experience on our website.",
//     "dismiss": "Got it!",
//     //"deny": "Refuse cookies!!",  
//     "link": "Learn more",
//     "href": "https://cookiesandyou.com",
//     "policy": "Cookie Policy",    
//     "allow": "Got it!",
//   }
// };

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        HeaderComponent,
        FooterComponent,
        DashboardComponent,
        AccountsGridComponent,
        MainPageComponent,
        ClientDetailsComponent,
        AlertBoxComponent,
        TaskBoxComponent,
        ContactGridComponent,
        ContactDetailsComponent,
        OppurtunityGridComponent,
        OppoDetailsComponent,
        LeaderGridComponent,
        LeaderDetailsComponent,
        PersonelDetailsComponent,
        PersonelGridComponent,
        ViewAllComponent,
        KanbanViewComponent,
        OppoStagesComponent,
        MapComponent,
        FunnelComponent,
        TasksComponent,
        TaskGridViewComponent,
        TaskSplitViewComponent,
        NewTaskComponent,
        TaskDetailsComponent,
        FileComponent,
        FileGridComponent,
        FileDetailsComponent,
        SearchResultComponent,
        ReportsComponent,
        AddEditReportComponent,
        ReportGridComponent,
        CreateNewReportComponent,
        AdminHeaderComponent,
        AdminfooterComponent,
        AdminmainComponentComponent,
        AddEditReportComponent,
        AdminLeftMenuComponent,
        AdminDashboardComponent,
        AdminEmailComponent,
        IndustriesComponent,
        SalesStagesComponent,
        UsersComponent,
        EmailTemplateComponent,
        CompanySettingComponent,
        // SnapSupplierComponent,
        SalutationsComponent,
        LeadRatingComponent,
        LeadStaComponent,
        TaskStatusComponent,
        OppoInclusionsComponent,
        TaskPrioritiesComponent,
        OppoExperienceComponent,
        OppoDestinationComponent,
        EmailFooterComponent,
        SharingSettingComponent,
        AdminProfileComponent,
        UserProfileComponent,
        AdminRoleComponent,
        AppPasswordDirective,
        TfcMainComponent,
        HomeComponent,
        TfcLoginComponent, 
        ThankyouComponent,
        UserDetailsComponent,
        NotFoundComponent,
        AccountMergeComponent,
        AccountMergeListComponent,
        AccessAccountComponent,
        QuilEditorComponent,
        PullitComponent,
        MailboxComponent,
        ImportComponent,
        GmailComponent,
        CustomFormComponent,
        ItineraryMainComponent, 
        AlertMsgComponent,
        AddformComponent,
        DocHeaderFooterComponent,
        ItineraryInclusionComponent,
        HtmlEditorComponent,
        EditformComponent,
        ReportMainComponent,
        ReportStandardComponent,
        ReportsStandardListComponent,
        PreviewComponent,
        NewItineraryListComponent,
        NewItineraryBuilderComponent,
        NewItineraryDetailsComponent,
        FlightDetailsComponent,
        NewItineraryHotelComponent,
        AddressFormComponent,
        WebformComponent,
        LeadCaptureComponent,
        NewItineraryInclusionsComponent,
        ShortEditorComponent,
        SubscriptionListComponent,
        SubscriptionDetailsComponent,
        OppTagsComponent,
        PaymentDetailsComponent,
        BillingsComponent,
        BillingDetailsComponent,
        BillingHistoryComponent,
        BillingEstimateComponent,
        AddStandardComponent,
        FormManagementComponent,
        SupplierComponent,
        SupplierDetailsComponent,
        FacebookConnectComponent,
        ItineraryTemplateComponent,
        ItineraryPdfComponent,
        SupplierPicklistComponent,
        DynamicTemplateComponent,
        SupplierTemplateComponent,
        AttachmentUploadComponent,
        DirectoryComponent,
        WhatsappFormComponent,
        WhatsappAttachmentComponent,
        EmailAttachmentComponent,
        ItineraryHtmlComponent
    ],
    imports: [MatSortModule,
        MatSelectModule,
        BrowserModule,
        MyRouterModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatTableModule,
        Select2Module,
        FormsModule,
        BrowserAnimationsModule,
        MatMenuModule,
        MatDatepickerModule,
        MatNativeDateModule,
        AmChartsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        QuillModule.forRoot(),
        NgxDaterangepickerMd.forRoot(),
        MatPaginatorModule,
        MatDialogModule,
        HttpClientModule,
        NgHttpLoaderModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatChipsModule, 
        MatIconModule,
        // DayPilotModule,
        AgmCoreModule.forRoot({
            apiKey: environment.coordinateKey,
            libraries: ["places"]
        }),
        OwlModule,
        NgxSortableModule,
        DragAndDropModule,
        ImageCropperModule,
        Ng2SearchPipeModule,
        //NgcCookieConsentModule.forRoot(cookieConfig),
        AngularEditorModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        MatTooltipModule,
        MatSliderModule,
        NgxSmoothDnDModule,
        SelectDropDownModule,
        EmailEditorModule,
        MatCheckboxModule,
        DataTablesModule
    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: CustomInterceptor,
       // useClass: NoLoaderInterceptor,
        multi: true
    },
    // {
    //     provide: HTTP_INTERCEPTORS, 
    //    useClass: NoLoaderInterceptor,
    //     multi: true
    // },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
        LoginServiceService, AccountServiceService, SupplierService,AccountsMapService,ExtraService],
    entryComponents: [AlertBoxComponent, AlertMsgComponent,TaskBoxComponent,
        ViewAllComponent,
        NewTaskComponent,
        SearchResultComponent,
        CreateNewReportComponent,
        AddEditReportComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}
