import { Component, OnInit } from '@angular/core';
import {faPlus, faSyncAlt, faTachometerAlt} from '@fortawesome/free-solid-svg-icons';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {empty, Observable} from 'rxjs';
import {ChangeInitiative} from '../change.model';
import {ChangeDataService} from '../change-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  faTachometer = faTachometerAlt;
  faSync = faSyncAlt;
  faPlus = faPlus;
  // tslint:disable-next-line:variable-name
  private _fetchChanges$: Observable<ChangeInitiative[]>;
  public errorMessage = '';


  constructor(private _router: Router, private changeDataService: ChangeDataService) { }

  ngOnInit(): void {
    this._fetchChanges$ = this.changeDataService.changes$.pipe(catchError(err => { this.errorMessage = err;  return empty; }));
  }

  routeDashboard(): void {
    this._router.navigate(['dashboard/home']);
  }

  addChangeEvent(): void {
    this._router.navigate(['add']);
  }

  get changes$(): Observable<ChangeInitiative[]>
  {
    return this._fetchChanges$;
  }
}
