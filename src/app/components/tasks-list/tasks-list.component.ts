import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Task } from 'src/app/interfaces/task';
import { TaskCommunicationService } from 'src/app/services/task-communication.service';
import { DocumentClickService } from 'src/app/services/document-click.service';
import { CdkDragDrop, DropListRef, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements AfterViewInit {
  @Input() ID: number = 1;
  @Input() title: string = "";
  @Input() listColor: string = "";
  @Input() listFontColor: string = "";
  @Input() defaultTaskColor: string = "";
  @Input() defaultTaskFontColor: string = "";
  @Input() defaultCheck: boolean = true;
  @Input() tasks: Task[] = [];
  @ViewChild('principalContainer') principalContainer!: ElementRef;

  showOptions :number = 0;
  addingNewTask:boolean = false;
  private stopShowingInput: HTMLElement|null = null;

  protected clickEventListener: EventListener | undefined;

  constructor(private parentComunnication :TaskCommunicationService,
              private documentClickEvents: DocumentClickService ) {
    this.clickEventListener = undefined;
  }

  ngAfterViewInit(): void {
    this.principalContainer.nativeElement.style.setProperty('--background-color', this.listColor);
    this.principalContainer.nativeElement.style.setProperty('--font-color', this.listFontColor);
    console.log(this.defaultCheck);
  }

  changingTitle(titleInput :HTMLInputElement, titleElem :HTMLElement): void {
    titleInput.value = this.title;
    titleInput.removeAttribute("style");
    titleElem.setAttribute("style","display:none;");
    titleInput.focus();
  }

  changeTitle(titleInput :HTMLInputElement, titleElem :HTMLElement){
    titleInput.value = titleInput.value.trim();
    if(titleInput.value){
    this.title = titleInput.value;
    }
    titleElem.removeAttribute("style");
    titleInput.setAttribute("style","display:none;");
  }

  cancelAddNewTask(newTaskInput: HTMLTextAreaElement){
    newTaskInput.removeAttribute("style");
    this.addingNewTask = false;
    newTaskInput.value = "";
    if(this.clickEventListener){
      document.removeEventListener('mousedown', this.clickEventListener);
    }
  }

  showAddNewTask(newTaskInput: HTMLTextAreaElement){
    newTaskInput?.setAttribute("style", "display:inline-block;");
    newTaskInput?.focus();
    this.stopShowingInput = newTaskInput;
    this.addingNewTask = true;
    this.clickEventConfiguration();
  }

  showOptionsMenu(){
    this.showOptions = 1;
    setTimeout(() => {
      this.stopShowingInput = document.getElementById("opsMenu");
      this.clickEventConfiguration();
    },100);
  }

  clickEventConfiguration(){
    if(this.stopShowingInput == null){ return; }
    const formId = this.stopShowingInput.getAttribute('form');
    if(formId == null){ return; }
    const focusOutFunction = this.documentClickEvents.formFocusOut(formId, ()=>{
      if(this.stopShowingInput){
        this.stopShowingInput.removeAttribute("style");
        this.addingNewTask = false;
        this.showOptions = 0;
      }    
      if(this.clickEventListener){
        document.removeEventListener('mousedown', this.clickEventListener);
      }
    });

    this.clickEventListener = (e) => focusOutFunction(e);
    document.addEventListener('mousedown', this.clickEventListener);
  }

  addNewTask(newTaskInput :HTMLTextAreaElement){
    if(newTaskInput.value.trim() != ""){
      let newTask: Task = {
        id: this.tasks.length+1,
        title: newTaskInput.value.trim(),
        checkList: this.defaultCheck,
        color: this.defaultTaskColor,
        completed: false,
        fontColor: this.defaultTaskFontColor,
        startTime: new Date()
      }
      this.tasks.push(newTask);
    }
    newTaskInput.value = "";
    newTaskInput.removeAttribute("style");
    this.addingNewTask = false;
  }

  deleteTask(task :Task){
    const index = this.tasks.indexOf(task);
    if(index > -1){
      this.tasks.splice(index, 1);
    }
  }

  deleteSelf(){
    this.parentComunnication.deleteTaskList(this.ID);
  }

  duplicateSelf(newTaskListTitle :string): void {
    this.parentComunnication.duplicateTaskList(this, newTaskListTitle);
    this.showOptions = 0;
  }

  openProperties(){
    this.parentComunnication.openTaskListProperties(this.ID);
    this.showOptions = 0;
  }

  changeProperties(data: {title: string, listColor: string, listFontColor: string, defaultTaskColor: string, defaultTaskFontColor: string, defaultCheck: boolean}){
    this.title = data.title;
    this.listColor = data.listColor;
    this.listFontColor = data.listFontColor;
    this.defaultTaskColor = data.defaultTaskColor;
    this.defaultTaskFontColor = data.defaultTaskFontColor;
    this.defaultCheck = data.defaultCheck;
    this.principalContainer.nativeElement.style.setProperty('--background-color', this.listColor);
    this.principalContainer.nativeElement.style.setProperty('--font-color', this.listFontColor);
  }

  changeTasksOrder(event: any): void {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
  }

}