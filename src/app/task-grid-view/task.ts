export class Task {
description:string;
due_date:any;
id: number;
name: string;
taskable_id:number;
taskable_type :string;;
priority:string;
status:string;;
contact_id:string;;
assigned_user_id:string;;
created_by:string;;
deleted_at:string;;
updated_at:string;;
created_at:string;;
last_modified_by_id:string;;
constructor(){
    this.due_date=undefined;
    this.id=undefined;
    this.description=undefined;
    this.name=undefined;
    this.taskable_id=undefined;;
    this.taskable_type =undefined;;;
this.priority=undefined;;;
   this.status=undefined;;;
this.contact_id=undefined;;;
this.assigned_user_id=undefined;;;
this.created_by=undefined;;;
this.deleted_at=undefined;;;
this.updated_at=undefined;;;
this.created_at=undefined;;;
this.last_modified_by_id=undefined;;;
}
toString(){
      return this.description;  
}
}
