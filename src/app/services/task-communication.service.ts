import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TasksListComponent } from '../components/tasks-list/tasks-list.component';
import { DocumentClickService } from './document-click.service';
import { Task } from '../interfaces/task';

@Injectable({
  providedIn: 'root'
})
export class TaskCommunicationService {
  taskListEmitScope = new Subject<{tasklist: TasksListComponent, action: string}>();

  deleteTaskList(taskList :TasksListComponent){
    this.taskListEmitScope.next({tasklist: taskList, action: "delete"});
  }

  duplicateTaskList(taskList :TasksListComponent, newTaskListTitle :string){
    let newTaskList = new TasksListComponent(this, new DocumentClickService());
    newTaskList.title = newTaskListTitle;
    taskList.tasks.forEach(element => {
      let task: Task = {
        id: element.id,
        title: element.title,
        checkList: element.checkList,
        color: element.color,
        completed: element.completed,
        fontColor: element.fontColor,
        startTime: element.startTime
      }
      newTaskList.tasks.push(task);
    });
    this.taskListEmitScope.next({tasklist: newTaskList, action: "duplicate"});
  }

  openTaskListProperties(taskList: TasksListComponent){
    this.taskListEmitScope.next({tasklist: taskList, action: "open"});
  }

}
