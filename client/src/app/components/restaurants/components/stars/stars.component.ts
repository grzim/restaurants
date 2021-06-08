import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

// ToDo on destroy
@Component({
  selector: 'rr-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.css']
})
export class StarsComponent implements OnInit {

  @Output() starSelected = new EventEmitter<number>();
  @Output() overStar = new EventEmitter<number>();
  @Input() rating: number;
  starsCoverage: number;
  range: (x: number) => number[];
  numberOfStars: number;

  constructor() {
    this.range = length => Array.from({length}).map((_, i) => i + 1);
    this.numberOfStars = 5;
  }

  ngOnInit(): void {
  }

}
