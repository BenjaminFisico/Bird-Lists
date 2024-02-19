import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Project } from 'src/app/interfaces/project';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent {
  @Output() data = new EventEmitter<Project>();
  @Input() projectCharged: boolean = false;
  @Input() showMenu: boolean = true;

  newProjectPressed(){
    // Emit empty project
    let newProject: Project = {
      title: "", 
      listColor: "",
      listFontColor: "",
      defaultTaskColor: "",
      defaultTaskFontColor: "",
      defaultCheck: true,
      taskLists: []};

    this.data.emit(newProject);
  }

  loadProject(event: any){
    if(event.target.files[0].type == "application/json"){
      const reader = new FileReader();
      reader.readAsText(event.target.files[0]);
      reader.onload = () => {
        const project = JSON.parse(reader.result as string);
        this.data.emit(project);
      }
    }
  }

  showMainMenu(){
    this.showMenu = true;
  }

  closeMainMenu(){
    this.showMenu = false;
    this.projectCharged = true;
  }

}
