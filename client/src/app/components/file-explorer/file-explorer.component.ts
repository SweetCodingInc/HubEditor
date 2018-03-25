import { Component, OnInit, HostBinding } from '@angular/core';
import { Store } from '@ngrx/store';
import { getRepoContentState } from '../../store';
import { IRepoContentState } from '../../store/models/repo-files.model'
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.styl']
})
export class FileExplorerComponent implements OnInit {
  @HostBinding('class')
  className = 'sidebar';

  repoState$: Observable<IRepoContentState>;

  constructor(
    private store: Store<IRepoContentState>
  ) {
    this.repoState$ = store.select(getRepoContentState);
  }

  ngOnInit() {
  }

}
