import { Component, OnInit } from '@angular/core';
import {ChangeInitiative} from '../../models/change.model';
import {ActivatedRoute, Router} from '@angular/router';
import { faBars, faRoute, faUsers} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  public change: ChangeInitiative;
  faBars = faBars;
  faRoad = faRoute;
  faGroup = faUsers;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.data.subscribe(item => this.change = item.change);
  }

  toRoadMap(): void {
    this.router.navigate(['roadmap/', this.change.id]);
  }
}
