import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DocumentClickService } from 'src/app/services/document-click.service';

@Component({
  selector: 'app-project-properties',
  templateUrl: './project-properties.component.html',
  styleUrls: ['./project-properties.component.css']
})
export class ProjectPropertiesComponent implements OnInit{
  @Input() title: string = "";
  @Input() taskListColor: string = "#161a1d";
  @Input() listFontColor: string = "#e6edf3";
  @Input() defaultTaskColor: string = "#3d474d";
  @Input() defaultTaskFontColor: string = "#e6edf3";
  @Input() defaultCheck: boolean = true;
  @Input() newProyect: boolean = false;
  @Input() insertInTop: boolean = false;
  @Input() hiddenCompleted: boolean = false;
  @Output() propertiesEmit = new EventEmitter<{
    title: string,  
    listColor: string,
    listFontColor: string,
    defaultTaskColor: string,
    defaultTaskFontColor: string,
    defaultCheck: boolean,
    defaultInsertInTop: boolean,
    defaultHiddenCompleted: boolean
  }>();
  @Output() focusOut = new EventEmitter();

  form: string = "projectPropertiesForm";

  protected clickEventListener: EventListener | undefined;

  constructor(private clickService: DocumentClickService){
    this.clickEventListener = undefined;
  }

  ngOnInit(): void {
    const focusOutFunction = this.clickService.formFocusOut("projectPropertiesForm", ()=>{
      if(!this.newProyect){
        this.buttonEmit();
      }
      this.focusOut.emit();
      if(this.clickEventListener) {
        document.removeEventListener('mousedown', this.clickEventListener);
      }
    });
    this.clickEventListener = (e) => focusOutFunction(e);
    document.addEventListener('mousedown', this.clickEventListener);
  }

  buttonEmit(){
    const taskListColor = (<HTMLInputElement>document.getElementById("taskListColor")).value;
    const listFontColor = (<HTMLInputElement>document.getElementById("listFontColor")).value;
    const taskColor = (<HTMLInputElement>document.getElementById("taskColor")).value;
    const taskFontColor = (<HTMLInputElement>document.getElementById("taskFontColor")).value;
    const defaultCheck = (<HTMLInputElement>document.getElementById("checksCheck")).checked;
    const insertIntop = (<HTMLInputElement>document.getElementById("defaultTaskPos")).checked;
    const hiddenCompleted = (<HTMLInputElement>document.getElementById("defaulthiddenTask")).checked;

    let title = (<HTMLInputElement>document.getElementById("projectNameInput")).value;
    if(title == ""){
      title = "NEW PROYECT";
    }
    const data = {
      title: title,
      listColor: taskListColor,
      listFontColor: listFontColor,
      defaultTaskColor: taskColor,
      defaultTaskFontColor: taskFontColor,
      defaultCheck: defaultCheck,
      defaultInsertInTop: insertIntop,
      defaultHiddenCompleted: hiddenCompleted
    }
    this.propertiesEmit.emit(data);
  }

  backgroundListChange(){
    const taskList:HTMLElement = document.getElementById("taskListExample") as HTMLElement;
    taskList.style.backgroundColor = this.taskListColor;
  }

  fontListChange(){
    const taskList:HTMLElement = document.getElementById("taskListExample") as HTMLElement;
    taskList.style.color = this.listFontColor;
  }

  backgroundTaskChange(){
    const task:HTMLElement = document.getElementById("taskExample") as HTMLElement;
    task.style.backgroundColor = this.defaultTaskColor;
  }

  fontTaskChange(){
    const task:HTMLElement = document.getElementById("taskExample") as HTMLElement;
    task.style.color = this.defaultTaskFontColor;
  }

  showInputEmoji(input :HTMLInputElement){
    console.log("button click");
    this.clickService.openEmojiForm(input);
  }
}
