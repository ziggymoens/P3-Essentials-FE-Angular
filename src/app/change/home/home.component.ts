import { Component, OnInit } from '@angular/core';
import {faEdit, faPlus, faSyncAlt, faTachometerAlt, faTrash} from '@fortawesome/free-solid-svg-icons';
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
  faTrash = faTrash;
  faEdit = faEdit;
  // tslint:disable-next-line:variable-name
  private _fetchChanges$: Observable<ChangeInitiative[]>;
  public errorMessage = '';

  constructor(private router: Router, private changeDataService: ChangeDataService) { }

  ngOnInit(): void {
    this._fetchChanges$ = this.changeDataService.changes$.pipe(catchError(err => { this.errorMessage = err;  return empty; }));
  }

  routeDashboard(): void {
    this.router.navigate(['dashboard']);
  }

  addChangeEvent(): void {
    this.router.navigate(['Add']);
  }

  get changes$(): Observable<ChangeInitiative[]>
  {
    return this._fetchChanges$;
  }

}
