import { Injectable } from '@angular/core';
import { ProjectComponent } from '../components/project/project.component';
import { Task } from '../interfaces/task';
import { TaskList } from '../interfaces/task-list';
import { Project } from '../interfaces/project';

@Injectable({
  providedIn: 'root'
})
export class FileLogicService {

  constructor() { }

  public downLoadProyect(project: ProjectComponent){
    const data: Project = { 
      title: project.projectTitle,
      listColor: project.defaultListData.listColor,
      listFontColor: project.defaultListData.listFontColor,
      defaultTaskColor: project.defaultListData.defaultTaskColor,
      defaultTaskFontColor: project.defaultListData.defaultTaskFontColor,
      defaultCheck: project.defaultListData.defaultCheck,
      taskLists: [],
      defaultInsertInTop: project.defaultListData.defaultInsertInTop,
      defaultHiddenCompleted: project.defaultListData.defaultHiddenCompleted
    };

    project.tasksList.forEach(taskList => {
      let taskListData: TaskList = {
        id: taskList.instance.ID,
        title: taskList.instance.title,
        tasks: [],
        insertInTop: taskList.instance.insertInTop,
        hiddenCompleted: taskList.instance.hiddenCompleted
      };
      if(taskList.instance.listColor != data.listColor){
        taskListData.listColor = taskList.instance.listColor;
      }
      if(taskList.instance.listFontColor != data.listFontColor){
        taskListData.listFontColor = taskList.instance.listFontColor;
      }
      if(taskList.instance.defaultTaskColor != data.defaultTaskColor){
        taskListData.defaultTaskColor = taskList.instance.defaultTaskColor;
      }
      if(taskList.instance.defaultTaskFontColor != data.defaultTaskFontColor){
        taskListData.defaultTaskFontColor = taskList.instance.defaultTaskFontColor;
      }
      if(taskList.instance.insertInTop == true){
        taskListData.insertInTop = true;
      }
      if(taskList.instance.hiddenCompleted == true){
        taskListData.hiddenCompleted = true;
      }

      taskList.instance.tasks.forEach(task => {
        let taskData: Task = task;
        taskListData.tasks.push(taskData);
      });

      data.taskLists.push(taskListData);
    });

    this.downloadJSONFile(data, project.projectTitle);
  }

  private downloadJSONFile(jsonData: any, fileName: string) {
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonData));
    let downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", fileName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

}
