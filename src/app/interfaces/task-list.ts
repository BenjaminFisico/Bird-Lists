import { Task } from "./task"

export interface TaskList {
    id: number,
    title: string,
    listColor?: string,
    listFontColor?: string,
    defaultTaskColor?: string,
    defaultTaskFontColor?: string,
    defaultCheck?: boolean,
    tasks: Task[]
}
