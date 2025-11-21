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
    // Handling priority
    set priority(newPriority) {
        if (['low', 'medium', 'high'].includes(newPriority)) {
            this._priority = newPriority
            return
        }
        this._priority = 'medium'
    }

    /**
     Toggle completion for todos
     */
    toggleCompletion() {
        this.isComplete = !this.isComplete
    }

    /**
     Editing todos
     */
    updateDetails(newDetails) {
        const keys = Object.keys(newDetails)
        keys.forEach((key) => (this[key] = newDetails[key]))
    }

    /**
     Checklist Methods 
     */
    /**
     Add subtask 
     */
    addSubtask(subtask) {
        this.checklist.push(subtask)
    }

    /**
     Delete subtask 
     */
    deleteSubtask(subtask) {
        this.checklist = this.checklist.filter((task) => task !== subtask)
    }

    /**
     Toggle Completion of subtask 
     */
    toggleSubtaskCompletion(subtaskName) {
        const subtask = this.checklist.find((task) => task.name === subtaskName)
        if (subtask) {
            subtask.isComplete = !subtask.isComplete
            return true
        }
        return false
    }
}
