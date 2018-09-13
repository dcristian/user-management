import { Component, Input } from '@angular/core';

@Component({
  selector: 'sortable-column',
  templateUrl: './sortable-column.component.html',
  styleUrls: ['./sortable-column.component.css']
})
export class SortableColumnComponent {
  @Input() columnName: string;
  @Input() sortDetails: any;
}
