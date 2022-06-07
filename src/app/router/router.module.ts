import {NgModule} from '@angular/core';

import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from '../login/login.component';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {AccountsGridComponent} from '../accounts-grid/accounts-grid.component';
import {SupplierComponent} from '../supplier/supplier.component';
import {SupplierDetailsComponent} from '../supplier-details/supplier-details.component';
import {MainPageComponent} from '../main-page/main-page.component';
import {ClientDetailsComponent} from '../client-details/client-details.component';
import {ContactGridComponent} from '../contact-grid/contact-grid.component';
import {ContactDetailsComponent} from '../contact-details/contact-details.component';
import {OppurtunityGridComponent} from '../oppurtunity-grid/opportunity-grid.component';
import {OppoDetailsComponent} from '../oppo-details/oppo-details.component';
import {LeaderGridComponent} from '../leader-grid/leader-grid.component';
import {LeaderDetailsComponent} from '../leader-details/leader-details.component';
import {PersonelGridComponent} from '../personel-grid/personel-grid.component';
import {PersonelDetailsComponent} from '../personel-details/personel-details.component';
import {TasksComponent} from '../tasks/tasks.component';
import {FileComponent} from '../file/file.component';
import {TaskDetailsComponent} from '../task-details/task-details.component';
import {FileDetailsComponent} from '../file-details/file-details.component';
import {SearchResultComponent} from '../search-result/search-result.component';
import {ReportsComponent} from '../reports/reports.component';
import {AddEditReportComponent} from '../add-edit-report/add-edit-report.component';
import {AdminmainComponentComponent} from '../adminmain-component/adminmain-component.component';
import {AdminDashboardComponent} from '../admin-dashboard/admin-dashboard.component';
import {IndustriesComponent} from '../industries/industries.component';
import {SalesStagesComponent} from '../sales-stages/sales-stages.component';
import {UsersComponent} from '../users/users.component';
import {EmailTemplateComponent} from '../email-template/email-template.component';
import {EmailFooterComponent} from '../email-footer/email-footer.component';
import {CompanySettingComponent} from '../company-setting/company-setting.component';
// import {SnapSupplierComponent} from '../snap-supplier/snap-supplier.component';
import {SalutationsComponent} from '../salutations/salutations.component';
import {LeadRatingComponent} from '../lead-rating/lead-rating.component';
import {LeadStaComponent} from '../lead-sta/lead-sta.component';
import {TaskStatusComponent} from '../task-status/task-status.component';
import {OppoInclusionsComponent} from '../oppo-inclusions/oppo-inclusions.component';
import {TaskPrioritiesComponent} from '../task-priorities/task-priorities.component';
import {OppoExperienceComponent} from '../oppo-experience/oppo-experience.component';
import {OppoDestinationComponent} from '../oppo-destination/oppo-destination.component';
import {SharingSettingComponent} from '../sharing-setting/sharing-setting.component';
import {AdminProfileComponent} from '../admin-profile/admin-profile.component';
import {AdminRoleComponent} from '../admin-role/admin-role.component';
import {UserProfileComponent} from '../user-profile/user-profile.component';
import {TfcMainComponent} from '../tfc-main/tfc-main.component';
import {HomeComponent} from '../home/home.component';
import {TfcLoginComponent} from '../tfc-login/tfc-login.component';
import {ThankyouComponent} from '../thankyou/thankyou.component';
import {UserDetailsComponent} from '../user-details/user-details.component';
import {NotFoundComponent} from '../not-found/not-found.component';
import {AccountMergeComponent} from '../account-merge/account-merge.component';
import {AccountMergeListComponent} from '../account-merge-list/account-merge-list.component';
import {AccessAccountComponent} from '../access-account/access-account.component';

import {MailboxComponent} from '../mailbox/mailbox.component';
import {ImportComponent} from '../import/import.component';
import {GmailComponent} from '../gmail/gmail.component';
import {CustomFormComponent} from '../custom-form/custom-form.component';
import {FormManagementComponent} from '../form-management/form-management.component';

import {ItineraryMainComponent} from '../itinerary-main/itinerary-main.component';

// import {ItineraryBuilderComponent} from '../itinerary-builder/itinerary-builder.component';
// import {ItineraryListComponent} from '../itinerary-list/itinerary-list.component';
// import {ItineraryCreateComponent} from '../itinerary-create/itinerary-create.component';

import {NewItineraryListComponent} from '../new-itinerary-list/new-itinerary-list.component';
import {NewItineraryBuilderComponent} from '../new-itinerary-builder/new-itinerary-builder.component';
import {NewItineraryDetailsComponent} from '../new-itinerary-details/new-itinerary-details.component';
import {FlightDetailsComponent} from '../flight-details/flight-details.component';
import {NewItineraryHotelComponent} from '../new-itinerary-hotel/new-itinerary-hotel.component';
import {NewItineraryInclusionsComponent} from '../new-itinerary-inclusions/new-itinerary-inclusions.component';

import {DocHeaderFooterComponent} from '../doc-header-footer/doc-header-footer.component';
import {ItineraryInclusionComponent} from '../itinerary-inclusion/itinerary-inclusion.component';

import {ReportMainComponent} from '../report-main/report-main.component';
import {ReportsStandardListComponent} from '../reports-standard-list/reports-standard-list.component';
import {ReportStandardComponent} from '../report-standard/report-standard.component';
import {LeadCaptureComponent} from '../lead-capture/lead-capture.component';
import {SubscriptionListComponent} from '../subscription-list/subscription-list.component';
import {SubscriptionDetailsComponent} from '../subscription-details/subscription-details.component';

import {PaymentDetailsComponent} from '../payment-details/payment-details.component';

import {OppTagsComponent} from '../opp-tags/opp-tags.component';
import {WebformComponent} from '../webform/webform.component';
import {BillingsComponent} from '../billings/billings.component';
import {BillingDetailsComponent} from '../billing-details/billing-details.component';
import {BillingHistoryComponent} from '../billing-history/billing-history.component';
import {BillingEstimateComponent} from '../billing-estimate/billing-estimate.component';
import {FacebookConnectComponent} from '../facebook-connect/facebook-connect.component';
import {ItineraryTemplateComponent} from '../itinerary-template/itinerary-template.component';
import {SupplierPicklistComponent} from '../supplier-picklist/supplier-picklist.component';

import {SupplierTemplateComponent} from '../supplier-template/supplier-template.component';
import {DirectoryComponent} from '../directory/directory.component';

const appRoutes: Routes = [
  {path: 'old-tfc', pathMatch: 'full', component: LoginComponent},
  {
    path: 'itineraryMain', component: ItineraryMainComponent,
    children: [
      {path: 'itineraries', component: NewItineraryListComponent, outlet: 'itinerarySection'},
      {path: 'itinerary-basic', component: NewItineraryBuilderComponent, data: {id: ''}, outlet: 'itinerarySection'},
      {path: 'itinerary-details', component: NewItineraryDetailsComponent, data: {id: ''}, outlet: 'itinerarySection'},
      {path: 'itinerary-flights', component: FlightDetailsComponent, data: {id: ''}, outlet: 'itinerarySection'},
      {path: 'itinerary-accommodations', component: NewItineraryHotelComponent, data: {id: ''}, outlet: 'itinerarySection'},

      {path: 'itinerary-inclusions', component: NewItineraryInclusionsComponent, data: {id: ''}, outlet: 'itinerarySection'},
      {path: 'generate-pdf', component: ItineraryTemplateComponent, data: {id: ''}, outlet: 'itinerarySection'}

    ]
  },
  {
    path: 'adminMain', component: AdminmainComponentComponent,
    children: [
      {path: '', component: AdminDashboardComponent, outlet: 'adminSection'},
      {path: 'dashboard', component: AdminDashboardComponent, outlet: 'adminSection'},
      /*Picklist*/
      {path: 'industries', component: IndustriesComponent, outlet: 'adminSection'},
      {path: 'salutation', component: SalutationsComponent, outlet: 'adminSection'},
      {path: 'leadRating', component: LeadRatingComponent, outlet: 'adminSection'},
      {path: 'leadStatus', component: LeadStaComponent, outlet: 'adminSection'},
      {path: 'taskStatus', component: TaskStatusComponent, outlet: 'adminSection'},
      {path: 'oppoInclusion', component: OppoInclusionsComponent, outlet: 'adminSection'},
      {path: 'taskPriority', component: TaskPrioritiesComponent, outlet: 'adminSection'},
      {path: 'oppoExperience', component: OppoExperienceComponent, outlet: 'adminSection'},
      {path: 'oppoDesti', component: OppoDestinationComponent, outlet: 'adminSection'},
      /*Sales Process*/
      {path: 'salesProcess', component: SalesStagesComponent, outlet: 'adminSection'},
      /*User mgt*/
      {path: 'users', component: UsersComponent, outlet: 'adminSection'},
      {path: 'adminProfile', component: AdminProfileComponent, outlet: 'adminSection'},
      {path: 'adminProfileDetails', component: AdminProfileComponent, outlet: 'adminSection'},
      {path: 'adminRole', component: AdminRoleComponent, data: {id: ''}, outlet: 'adminSection'},
      {path: 'adminRoleDetails', component: AdminRoleComponent, data: {id: ''}, outlet: 'adminSection'},
      /*Email*/
      {path: 'emailTemplate', component: EmailTemplateComponent, outlet: 'adminSection'},
      {path: 'emailFooter', component: EmailFooterComponent, outlet: 'adminSection'},
      /*DOC header footer*/
      /*Company*/
      {path: 'doc-header-footer', component: DocHeaderFooterComponent, outlet: 'adminSection'},

      {path: 'itinerary-inclusion', component: ItineraryInclusionComponent, outlet: 'adminSection'},

      {path: 'compSetting', component: CompanySettingComponent, outlet: 'adminSection'},
      {path: 'sharingSetting', component: SharingSettingComponent, outlet: 'adminSection'},
      /*SnapShot Setting*/
      // {path: 'snapSupplier', component: SnapSupplierComponent, outlet: 'adminSection'},
      {path: 'user-details', component: UserDetailsComponent, data: {id: ''}, outlet: 'adminSection'},
      {path: 'custom', component: CustomFormComponent, data: {id: ''}, outlet: 'adminSection'},
      {path: 'webform', component: WebformComponent, data: {id: ''}, outlet: 'adminSection'},
      {path: 'lead-capture', component: LeadCaptureComponent, data: {id: ''}, outlet: 'adminSection'},
      {path: 'oppTags', component: OppTagsComponent, data: {id: ''}, outlet: 'adminSection'},
      {path: 'billings', component: BillingsComponent, data: {id: ''}, outlet: 'adminSection'},
      {path: 'billing-details', component: BillingDetailsComponent, data: {id: ''}, outlet: 'adminSection'},
      {path: 'billing-history', component: BillingHistoryComponent, data: {id: ''}, outlet: 'adminSection'},
      {path: 'billing-estimate', component: BillingEstimateComponent, data: {id: ''}, outlet: 'adminSection'},
      {path: 'form-management-a', component: FormManagementComponent, data: {type: ''}, outlet: 'adminSection'},
      {path: 'form-management-c', component: FormManagementComponent, data: {type: ''}, outlet: 'adminSection'},
      {path: 'form-management-p', component: FormManagementComponent, data: {type: ''}, outlet: 'adminSection'},
      {path: 'form-management-l', component: FormManagementComponent, data: {type: ''}, outlet: 'adminSection'},
      {path: 'form-management-o', component: FormManagementComponent, data: {type: ''}, outlet: 'adminSection'},
      {path: 'form-management-s', component: FormManagementComponent, data: {type: ''}, outlet: 'adminSection'},
      {path: 'facebook-connect', component: FacebookConnectComponent, data: {type: ''}, outlet: 'adminSection'},
      {path: 'supplier-picklist-r', component: SupplierPicklistComponent, data: {type: 'ratings'}, outlet: 'adminSection'},
      {path: 'supplier-picklist-t', component: SupplierPicklistComponent, data: {type: 'types'}, outlet: 'adminSection'},
      {path: 'supplier-picklist-s', component: SupplierPicklistComponent, data: {type: 'services'}, outlet: 'adminSection'},
      {path: 'supplier-template', component: SupplierTemplateComponent, outlet: 'adminSection'},

    ]
  },
  {
    path: 'maindashboard', component: MainPageComponent,
    children: [
      {path: '', component: DashboardComponent, outlet: 'bodySection'},
      {path: 'Dashboard', component: DashboardComponent, outlet: 'bodySection'},
      {path: 'SearchResult', component: SearchResultComponent, data: {query: ''}, outlet: 'bodySection'},
      {path: 'accountIndex', component: AccountsGridComponent, outlet: 'bodySection'},
      {path: 'supplier', component: SupplierComponent, outlet: 'bodySection'},
      {path: 'supplier-details', component: SupplierDetailsComponent, outlet: 'bodySection'},
      {path: 'contactGrid', component: ContactGridComponent, data: {open: undefined}, outlet: 'bodySection'},
      {path: 'OpportunityGrid', component: OppurtunityGridComponent, data: {open: undefined}, outlet: 'bodySection'},
      {path: 'clientDetails', component: ClientDetailsComponent, data: {id: ''}, outlet: 'bodySection'},
      {path: 'contactDetails', component: ContactDetailsComponent, data: {id: ''}, outlet: 'bodySection'},
      {path: 'oppoDetails', component: OppoDetailsComponent, data: {id: ''}, outlet: 'bodySection'},
      {path: 'leaderGrid', component: LeaderGridComponent, outlet: 'bodySection'},
      {path: 'leaderDetails', component: LeaderDetailsComponent, data: {id: ''}, outlet: 'bodySection'},
      {path: 'personalGrid', component: PersonelGridComponent, outlet: 'bodySection'},
      {path: 'personelDetails', component: PersonelDetailsComponent, data: {id: ''}, outlet: 'bodySection'},
      {path: 'tasks', component: TasksComponent, data: {id: ''}, outlet: 'bodySection'},
      {path: 'files', component: FileComponent, data: {id: ''}, outlet: 'bodySection'},
      {path: 'fileDetails', component: FileDetailsComponent, data: {id: ''}, outlet: 'bodySection'},
      {path: 'taskDetails', component: TaskDetailsComponent, data: {id: ''}, outlet: 'bodySection'},
      {path: 'report-main', component: ReportMainComponent, data: {id: ''}, outlet: 'bodySection'},
      {path: 'reports-standard-list', component: ReportsStandardListComponent, data: {type: '', range_type: ''}, outlet: 'bodySection'},
      {path: 'reports-standard', component: ReportStandardComponent, data: {type: ''}, outlet: 'bodySection'},
      {path: 'reports', component: ReportsComponent, data: {id: ''}, outlet: 'bodySection'},
      {path: 'reportDisplay', component: SearchResultComponent, data: {id: ''}, outlet: 'bodySection'},
      {path: 'addReports', component: AddEditReportComponent, data: {metaData: {}}, outlet: 'bodySection'},
      {path: 'editReport', component: AddEditReportComponent, data: {id: undefined}, outlet: 'bodySection'},
      {path: 'userProfile', component: UserProfileComponent, outlet: 'bodySection'},
      {path: 'directory', component: DirectoryComponent, outlet: 'bodySection'},
      {path: 'userMerge', component: AccountMergeComponent, outlet: 'bodySection'},
      {path: 'userMergeList', component: AccountMergeListComponent, outlet: 'bodySection'},
      {path: 'import-data', component: ImportComponent, data: {type: ''}, outlet: 'bodySection'},
      {path: 'gmail', component: GmailComponent, outlet: 'bodySection'},
      {path: 'mail', component: MailboxComponent, outlet: 'bodySection'},
      {path: 'notfound', component: NotFoundComponent, outlet: 'bodySection'},
      {path: '**', component: NotFoundComponent, outlet: 'bodySection'},
    ]
  },

  {
    path: '', component: TfcMainComponent,
    children: [
      {path: '', component: HomeComponent},
    ]},

  {path: 'login', component: TfcLoginComponent},
  {path: 'thank-you/:email', component: ThankyouComponent},
  {path: 'access-account/:email/:psw', component: AccessAccountComponent},
  {path: 'subscription-list', component: SubscriptionListComponent},
  {path: 'proceed-payment', component: SubscriptionDetailsComponent},
  {path: 'payment-response', component: PaymentDetailsComponent},
  {path: '**', component: NotFoundComponent},
// { path: 'tfc-home', component: TfcMainComponent,
// children: [
//       { path: '', component: HomeComponent}
// ]},
// { path: 'tfc-home/login', component: TfcLoginComponent},
// { path: 'tfc-home/register', component: RegisterComponent}
];

@NgModule({
  imports: [

    RouterModule.forRoot(
      appRoutes,
      {useHash: false},
    )
  ],
  exports: [RouterModule],
  declarations: []
})
export class MyRouterModule {
}
