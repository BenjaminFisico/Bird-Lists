import { TaskList } from "./task-list";

export interface Project {
    title: string,
    listColor: string,
    listFontColor: string,
    defaultTaskColor: string,
    defaultTaskFontColor: string,
    defaultCheck: boolean,
    taskLists: TaskList[],
    defaultInsertInTop: boolean,
    defaultHiddenCompleted: boolean
}
