import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-kanban-view',
  templateUrl: './kanban-view.component.html',
  styleUrls: ['./kanban-view.component.css']
})
export class KanbanViewComponent implements OnInit {
  @Input() kanban:any ;
  constructor() { }

  ngOnInit() {
  console.log(this.kanban);
  }

}
