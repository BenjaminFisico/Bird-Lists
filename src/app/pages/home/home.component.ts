import { Component, ViewChild } from '@angular/core';
import { TaskList } from 'src/app/interfaces/task-list';
import { PageHeaderComponent } from '../page-header/page-header.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @ViewChild('pageHeader') pageHeader!: PageHeaderComponent;

  title :string = 'TrelloClon';
  projectCharged :boolean = false;
  showMenu :boolean = true;
  creatingNewProyect :boolean = false;
  projectTitle :string = "";
  projectTasksLists: TaskList[] = []
  taskListDefaultData :{listColor: string, 
                        listFontColor: string, 
                        defaultTaskColor: string, 
                        defaultTaskFontColor: string, 
                        defaultCheck: boolean,
                        defaultInsertInTop: boolean,
                        defaultHiddenCompleted: boolean} = {
    listColor: "",
    listFontColor: "",
    defaultTaskColor: "",
    defaultTaskFontColor: "",
    defaultCheck: true,
    defaultInsertInTop: false,
    defaultHiddenCompleted: false
  }

  constructor() { }

  newProyectPressed(){
    if(this.projectCharged == false){
      this.creatingNewProyect = true;
    }
  }

  createNewProject(data: any){
    this.projectTitle = data.title;
    this.taskListDefaultData = {
      listColor: data.listColor,
      listFontColor: data.listFontColor,
      defaultTaskColor: data.defaultTaskColor,
      defaultTaskFontColor: data.defaultTaskFontColor,
      defaultCheck: data.defaultCheck,
      defaultInsertInTop: data.defaultInsertInTop,
      defaultHiddenCompleted: data.defaultHiddenCompleted
    }
    this.projectTasksLists = [];
    this.projectCharged = true;
    this.pageHeader.closeMainMenu();
    this.creatingNewProyect = false;
  }

  createNewProyectFocusOut(){
    this.creatingNewProyect = false;
  }

  chargeProject(event: any){
    if(event.title == ""){
      this.creatingNewProyect = true;
      return;
    }
    this.projectTitle = event.title;
    this.taskListDefaultData = {
      listColor: event.listColor,
      listFontColor: event.listFontColor,
      defaultTaskColor: event.defaultTaskColor,
      defaultTaskFontColor: event.defaultTaskFontColor,
      defaultCheck: event.defaultCheck,
      defaultInsertInTop: event.defaultInsertInTop,
      defaultHiddenCompleted: event.defaultHiddenCompleted
    }
    this.projectTasksLists = event.taskLists;
    this.pageHeader.closeMainMenu();
    this.projectCharged = true;
  }
}
