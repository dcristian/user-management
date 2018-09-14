import { Component, Input } from '@angular/core';
import { SortDetails } from '../../models/sort-details';

@Component({
  selector: 'sortable-column',
  templateUrl: './sortable-column.component.html',
  styleUrls: ['./sortable-column.component.css']
})
export class SortableColumnComponent {
  @Input() columnName: string;
  @Input() sortDetails: SortDetails;
}
