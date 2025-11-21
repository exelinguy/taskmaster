import { formatISO } from 'date-fns'

export default class Todo {
    checklist = []
    isComplete = false

    constructor(title, description, dueDate, priority) {
        this.id = crypto.randomUUID()
        this.title = title
        this.description = description
        this.dueDate = formatISO(new Date(dueDate))
        this.priority = priority
    }
}
