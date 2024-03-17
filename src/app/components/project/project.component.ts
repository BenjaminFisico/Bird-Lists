import { Component, Input, ApplicationRef, EnvironmentInjector, createComponent, AfterViewInit, ComponentRef, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import { DragDrop, DragRef, DropListRef, moveItemInArray } from '@angular/cdk/drag-drop';
import { TasksListComponent } from 'src/app/components/tasks-list/tasks-list.component';
import { Task } from 'src/app/interfaces/task';
import { DocumentClickService } from 'src/app/services/document-click.service';
import { TaskCommunicationService } from 'src/app/services/task-communication.service';
import { FileLogicService } from 'src/app/services/file-logic.service';
import { TaskList } from 'src/app/interfaces/task-list';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnDestroy, AfterViewInit{
  @Input() projectTitle: string = 'Project1';
  @Input() set setTaskLists(TaskLists: TaskList[]){
    this.tasksList.forEach(taskList => {
      taskList.destroy();
      this.appRef.detachView(taskList.hostView);
    });
    this.tasksList = [];
    TaskLists.forEach(taskList => {
      this.addTaskLists(taskList.title, taskList.tasks, taskList.listColor, taskList.listFontColor, taskList.defaultTaskColor, taskList.defaultTaskFontColor);
    });
  }
  @Input() defaultListData: {listColor: string, listFontColor: string, defaultTaskColor: string, defaultTaskFontColor: string, defaultCheck: boolean} = {
    listColor: "",
    listFontColor: "",
    defaultTaskColor: "",
    defaultTaskFontColor: "",
    defaultCheck: true
  }
  @ViewChild('dropListArea', { static: false })
  dropListArea!: ElementRef;
  listPropertiesOpen: boolean = false;
  
  tasksList: ComponentRef<TasksListComponent>[] = [];
  TaskListOpenProperties: TasksListComponent | undefined = undefined;
  taskListOpenTitle: string = "";
  private dropListRef: DropListRef<TasksListComponent> | undefined;
  private dragListRef: DragRef<any>[] = [];
  protected clickEventListener: EventListener | undefined;
  
  addingNewTaskList: boolean = false;

  constructor(
    private appRef: ApplicationRef,
    private environmentInjector: EnvironmentInjector,
    private taskcommunication: TaskCommunicationService,
    private documentClickEvents: DocumentClickService,
    private fileLogicService: FileLogicService,
    private dragDropService: DragDrop,
    ) { 
    this.initCommunicationSubscribeService();
    this.clickEventListener = undefined;
  }

  initCommunicationSubscribeService(){
    this.taskcommunication.taskListEmitScope.subscribe(
      (data) => {
        switch(data.action){
          case "delete": this.deleteTaskList(data.tasklist.ID); break;
          case "duplicate": this.addTaskLists(data.tasklist.title, data.tasklist.tasks); break;
          case "open": this.openTaskListProperties(data.tasklist.ID);
        }
      }
    );
  }

  deleteTaskList(taskListId :number): void{
    for(let i = 0; i < this.tasksList.length; i++){
      if(this.tasksList[i].instance.ID == taskListId){
        this.appRef.detachView(this.tasksList[i].hostView);
        this.tasksList.splice(i, 1);
        this.dragListRef.splice(i, 1);
        this.dropListRef?.withItems(this.dragListRef);
        break;
      }
    }
  }

  openTaskListProperties(TaskListId: number){
    for(let i = 0; i < this.tasksList.length; i++){
      if(this.tasksList[i].instance.ID == TaskListId){
        this.TaskListOpenProperties = this.tasksList[i].instance;
        this.taskListOpenTitle = this.TaskListOpenProperties.title;
        break;
      }
    }
    this.listPropertiesOpen = true;
  }

  changeTaskProperties(data: {title: string, listColor: string, listFontColor: string, defaultTaskColor: string, defaultTaskFontColor: string, defaultCheck: boolean}){
    this.listPropertiesOpen = false;
    this.TaskListOpenProperties?.changeProperties(data);
  }

  closeTaskListProperties(){
    this.listPropertiesOpen = false;
  }

  showAddNewList(button: HTMLElement){
    const parentElement = button.parentElement;
    this.addingNewTaskList = true;
    parentElement?.classList.add('newTaskPressed');
    setTimeout(() => {
      this.clickEventConfiguration(parentElement as HTMLElement);
      document.getElementById("listInput")?.focus();
    }, 100);
  }

  ngAfterViewInit(): void {
    this.dropListRef = this.dragDropService.createDropList(this.dropListArea);
    this.dropListRef.withOrientation('horizontal');
    this.dropListRef.dropped.subscribe((event) => {
      this.drop(event);
    });
  }

  clickEventConfiguration(deleteClassElement: HTMLElement){
    const focusOutFunction = this.documentClickEvents.formFocusOut("newTaskListForm", ()=>{
      this.cancelAddNewTaskList();
      deleteClassElement.classList.remove('newTaskPressed');
    });
    
    this.clickEventListener = (e) => focusOutFunction(e);
    document.addEventListener('mousedown', this.clickEventListener);
  }

  addNewTaskList(taskListInput :HTMLTextAreaElement){
    const taskListTitle = taskListInput.value.trim();
    if(taskListTitle!= ""){
      this.addTaskLists(taskListTitle);
      this.cancelAddNewTaskList();
      taskListInput.blur();
    }
    taskListInput.value = '';
    taskListInput.value = taskListInput.value.trim();
    this.adjustInputHeight(taskListInput);
    this.documentClickEvents.closeEmojiForm();
  }

  cancelAddNewTaskList(){
    this.addingNewTaskList = false;
    if(this.clickEventListener){
      document.removeEventListener('mousedown', this.clickEventListener);
    }
  }

  addTaskLists(taskListTitle:string,
                taskList: Task[] = [],
                listColor: string = "",
                listFontColor: string = "",
                defaultTaskColor: string = "",
                defaultTaskFontColor: string = "",
                defaultCheck: boolean = this.defaultListData.defaultCheck
              ): void{
    const hostElement = document.getElementById('taskListContainer');
    if(hostElement == null){ return; }
    const taskRef = this.createTaskComponent(taskListTitle, taskList, listColor, listFontColor, defaultTaskColor, defaultTaskFontColor, defaultCheck);
    hostElement.appendChild(taskRef.location.nativeElement);
    this.appRef.attachView(taskRef.hostView);
    this.tasksList.push(taskRef);
    this.addTaskListToDragRef(taskRef);
  }

  private createTaskComponent(taskListTitle: string, 
                              taskList: Task[] = [],
                              listColor: string = "",
                              listFontColor: string = "",
                              defaultTaskColor: string = "",
                              defaultTaskFontColor: string = "",
                              defaultCheck: boolean,
                            ): ComponentRef<any>{
    const taskRef = createComponent(TasksListComponent, {
      environmentInjector: this.environmentInjector,
    });
    taskRef.setInput('title', taskListTitle);
    if(taskList){
      taskRef.setInput('tasks', taskList);
    }
    if(this.tasksList.length == 0){
      taskRef.setInput('ID', 1);
    } else {
      taskRef.setInput('ID', this.tasksList[this.tasksList.length - 1].instance.ID + 1);
    }
    if(listColor != ""){
      taskRef.setInput('listColor', listColor);
    } else {
      taskRef.setInput('listColor', this.defaultListData.listColor);
    }
    if(listFontColor != ""){
      taskRef.setInput('listFontColor', listFontColor);
    } else {
      taskRef.setInput('listFontColor', this.defaultListData.listFontColor);
    }
    if(defaultTaskColor != ""){
      taskRef.setInput('defaultTaskColor', defaultTaskColor);
    } else {
      taskRef.setInput('defaultTaskColor', this.defaultListData.defaultTaskColor);
    }
    if(defaultTaskFontColor){
      taskRef.setInput('defaultTaskFontColor', defaultTaskFontColor);
    } else {
      taskRef.setInput('defaultTaskFontColor', this.defaultListData.defaultTaskFontColor);
    }
    taskRef.setInput('defaultCheck', defaultCheck);
    return taskRef;
  }

  private addTaskListToDragRef(taskRef: ComponentRef<any>): void{
    const dragRef = this.dragDropService.createDrag(taskRef.location.nativeElement);
    dragRef.withHandles([taskRef.location.nativeElement.children[0].children[0].children[0]]);
    this.dragListRef.push(dragRef);
    this.dropListRef?.withItems(this.dragListRef);
  }

  editProjectTitle(){
    const titleButton = document.getElementById("titleButton");
    titleButton?.setAttribute("style", "visibility:hidden; position: absolute;");
    this.adaptInput("titleInput");
  }

  adaptInput(idInput: string){
    const titleInput = document.getElementById(idInput) as HTMLInputElement | null;
    const emojiInput = titleInput?.nextElementSibling as HTMLElement;
    let newTitle = titleInput?.value;
    if(newTitle){
      this.projectTitle = newTitle;
    }
    if(titleInput){
      titleInput.setAttribute("style", `visibility:visible;`);
      emojiInput.setAttribute("style", 'display: block;')
      this.adjustInputWidth(titleInput);
      titleInput.focus();
      this.clickEventTitleConfiguration(titleInput);
    }
  }

  clickEventTitleConfiguration(titleInput :HTMLInputElement){
    const focusOutFunction = this.documentClickEvents.formFocusOut("proyectForm", () => {
      this.titleChange();
    });

    this.clickEventListener = (e) => focusOutFunction(e);
    document.addEventListener('mousedown', this.clickEventListener);
  }

  adjustInputWidth(elemInput :HTMLElement){
    elemInput.style.width = '0';
    if(elemInput.scrollWidth < window.innerWidth- 300){
      elemInput.style.width = (elemInput.scrollWidth -4) + "px";
    } else {
      elemInput.style.width =  `${window.innerWidth - 300}px`;
    }
  }

  titleChange(){
    const titleInput = document.getElementById("titleInput") as HTMLInputElement | null;
    const emojiInput = titleInput?.nextElementSibling as HTMLElement;
    const titleButton = document.getElementById("titleButton");
    let newTitle = titleInput?.value;

    if(newTitle){
      this.projectTitle = newTitle;
    } else {
      if(titleInput){
        titleInput.value = this.projectTitle;
      }
    }

    titleInput?.setAttribute("style", "visibility:hidden;");
    titleButton?.setAttribute("style", "display:inline-flex;");
    emojiInput?.setAttribute("style", "display:none;");

    if(this.clickEventListener){
      document.removeEventListener('mousedown', this.clickEventListener);
    }
  }

  adjustInputHeight(elemInput: HTMLElement){
    elemInput.style.height = '0';
    const newHeight = Math.min(elemInput.scrollHeight, 137);
    elemInput.style.height = `${newHeight}px`;
    let parentElement = elemInput.parentElement?.parentElement?.parentElement;
    if(parentElement){
      parentElement.style.height = `${newHeight + 75}px`;
    }
  }

  ngOnDestroy(): void {
    this.taskcommunication.taskListEmitScope.unsubscribe();
    this.dropListRef?.dropped.unsubscribe();
  }

  drop(event: any) {
    if(event.previousIndex == event.currentIndex){ return; }
    const hostElement = document.getElementById('taskListContainer');
    if(hostElement){
      let movedElement = hostElement.children[event.previousIndex];
      hostElement?.removeChild(movedElement);
      hostElement?.insertBefore(movedElement, hostElement.children[event.currentIndex]);
      moveItemInArray(this.tasksList, event.previousIndex, event.currentIndex);
      moveItemInArray(this.dragListRef, event.previousIndex, event.currentIndex);
    }
  }

  showInputEmoji(textArea: HTMLTextAreaElement | HTMLInputElement){
    this.documentClickEvents.openEmojiForm(textArea);
  }

  downloadJSONproject(){
    this.fileLogicService.downLoadProyect(this);
  }
}

