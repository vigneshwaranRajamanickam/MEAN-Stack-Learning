import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ItemListComponent } from './components/item-list/item-list.component';
import { ItemAddComponent } from './components/item-add/item-add.component';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ItemListComponent, ItemAddComponent, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('MEAN Stack Learning App');
  selectedServer: 'REST' | 'GRAPHQL' = 'REST';

  constructor(private apiService: ApiService) { }

  onServerChange() {
    this.apiService.setMode(this.selectedServer);
    // Ideally trigger a refresh here, but components will fetch on their own actions or we can use a subject.
    // For simplicity, we can rely on the user refreshing or interacting.
    // Better: let's access the ItemListComponent to refresh.
  }
}
