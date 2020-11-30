import { Component, OnInit } from '@angular/core';
import {faClipboard} from '@fortawesome/free-solid-svg-icons';
import {RoadmapItem} from '../roadmapitem.model';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-roadmap-item-detail',
  templateUrl: './roadmap-item-detail.component.html',
  styleUrls: ['./roadmap-item-detail.component.css']
})
export class RoadmapItemDetailComponent implements OnInit {
  public roadmapItem: RoadmapItem;
  faClip = faClipboard;
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.data.subscribe(item => this.roadmapItem = item.roadmapItem);
    console.log(this.roadmapItem);
  }

}