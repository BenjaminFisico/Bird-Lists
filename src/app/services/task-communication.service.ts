import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TasksListComponent } from '../components/tasks-list/tasks-list.component';
import { DocumentClickService } from './document-click.service';
import { Task } from '../interfaces/task';

@Injectable({
  providedIn: 'root'
})
export class TaskCommunicationService {
  deletedTaskList$ = new Subject<number>();
  duplicateTaskList$ = new Subject<TasksListComponent>();
  openTaskListProperties$ = new Subject<number>();

  deleteTaskList(taskListId :number){
    this.deletedTaskList$.next(taskListId);
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
    this.duplicateTaskList$.next(newTaskList);
  }

  openTaskListProperties(taskListId :number){
    this.openTaskListProperties$.next(taskListId);
  }

}
