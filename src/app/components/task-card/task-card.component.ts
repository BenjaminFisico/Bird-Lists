import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DocumentClickService } from 'src/app/services/document-click.service';
import { Task } from 'src/app/interfaces/task';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent {
  @Input() task: Task = {id:0, title:"", color:"", checkList: true, completed: false , fontColor: "",startTime: new Date()};
  @Output() deleteTask = new EventEmitter<Task>();
  @Output() taskCompletion = new EventEmitter<boolean>();
  
  editingTask: boolean = false;
  openMenu: number = 0;
  protected clickEventListener: EventListener|undefined;

  constructor( private documentClickEvents: DocumentClickService) {
    this.clickEventListener = undefined;
   }

  editTask(input: HTMLTextAreaElement, taskText: HTMLElement): void{
    if(this.editingTask) {return;}
    input.value = this.task.title;
    input.removeAttribute("style");
    input.style.height = `${taskText.clientHeight/2}px`;
    input.style.color = this.task.fontColor;
    taskText.parentElement?.classList.add("focused");
    taskText.setAttribute("style","display:none;");
    input.focus();
    this.editingTask = true;
    this.clickEventConfiguration(input,taskText);
  }

  clickEventConfiguration(input: HTMLTextAreaElement, taskText: HTMLElement): void{
    const focusOut = this.documentClickEvents.formFocusOut("taskForm", ()=>{
      this.finishEditing(input, taskText);
    });

    this.clickEventListener = (e) => focusOut(e);
    document.addEventListener('mousedown', this.clickEventListener);
  }

  finishEditing(input: HTMLTextAreaElement, taskText: HTMLElement): void{
    input.setAttribute("style","display:none;");
    taskText.removeAttribute("style");
    taskText.parentElement?.classList.remove("focused");
    taskText.style.color = this.task.fontColor;
    this.editingTask = false;
    this.openMenu = 0;
    if(input.value){
      this.task.title = input.value;
    }
    if(this.clickEventListener){
      document.removeEventListener('mousedown', this.clickEventListener);
    }
  }

  changeTaskColor(value: string): void{
    this.task.color = value;
  }

  changeFontColor(value: string, elementBinding: HTMLElement): void{
    this.task.fontColor = value;
    elementBinding.style.color = value;
  }

  toogleCheckList(): void{
    this.task.checkList = !this.task.checkList;
  }

  openMenuColor(): void{
    this.openMenu = 1;
  }

  taskCompleted(event:any): void{
    this.task.completed = event.target.checked;
    this.taskCompletion.emit(this.task.completed);
  }

  
  deleteTaskEmit(): void{
    this.deleteTask.emit(this.task);
  }

  stopMousePropagation(event: any){
    console.log(event);
    event.stopPropagation();
  }
  
}
