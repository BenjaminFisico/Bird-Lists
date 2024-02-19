import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageHeaderComponent } from './pages/page-header/page-header.component';
import { ProjectComponent } from './components/project/project.component';
import { TaskCardComponent } from './components/task-card/task-card.component';
import { TasksListComponent } from './components/tasks-list/tasks-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ProjectPropertiesComponent } from './components/project-properties/project-properties.component';
import { HomeComponent } from './pages/home/home.component';
import { HelpComponent } from './pages/help/help.component';

@NgModule({
  declarations: [
    AppComponent,
    PageHeaderComponent,
    ProjectComponent,
    TaskCardComponent,
    TasksListComponent,
    ProjectPropertiesComponent,
    HomeComponent,
    HelpComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
