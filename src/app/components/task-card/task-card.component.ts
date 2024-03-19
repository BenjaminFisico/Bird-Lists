import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DocumentClickService } from 'src/app/services/document-click.service';
import { Task } from 'src/app/interfaces/task';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent implements OnInit{
  @Input() task: Task = {id:0, title:"", color:"", checkList: true, completed: false , fontColor: "",startTime: new Date()};
  @Output() deleteTask = new EventEmitter<Task>();
  @Output() taskCompletion = new EventEmitter<boolean>();
  @Output() checkListChange = new EventEmitter<boolean>();


  temporalCompletion: boolean = false;
  editingTask: boolean = false;
  openMenu: number = 0;
  protected clickEventListener: EventListener|undefined;

  constructor( private documentClickEvents: DocumentClickService) {
    this.clickEventListener = undefined;
  }

  ngOnInit(): void {
    this.temporalCompletion = this.task.completed;
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
    this.documentClickEvents.closeEmojiForm();
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
    this.checkListChange.emit(this.task.checkList);
  }

  openMenuColor(): void{
    this.openMenu = 1;
  }

  taskCompleted(event:any): void{
    this.temporalCompletion = event.target.checked;
    this.emitCompletion(event.target.checked);
  }

  emitCompletion(checkValue: boolean){
    setTimeout(() => {
      if(this.temporalCompletion == checkValue && this.task.completed != checkValue){
        this.task.completed = checkValue;
        this.taskCompletion.emit(checkValue);
      }
    }, 1000);
  }

  deleteTaskEmit(): void{
    this.deleteTask.emit(this.task);
  }

  showInputEmoji(textArea: HTMLTextAreaElement){
    this.documentClickEvents.openEmojiForm(textArea);
  }

}
