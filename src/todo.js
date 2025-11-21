import { formatISO } from 'date-fns'

export default class Todo {
    _checklist = []
    _isComplete = false

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
     Setter & Toggle completion for todos
     */
    set isComplete(value = false) {
        if (typeof value === 'boolean') {
            this._isComplete = value
        } else {
            this._isComplete = false
        }
    }
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
     Create and Add subtask 
     */
    addSubtask(name, isComplete = false) {
        const subtask = { name, isComplete }
        this._checklist.push(subtask)
    }

    /**
     Delete subtask 
     */
    deleteSubtask(subtask) {
        this._checklist = this._checklist.filter((task) => task !== subtask)
    }

    /**
     Toggle Completion of subtask 
     */
    toggleSubtaskCompletion(subtaskName) {
        const subtask = this._checklist.find(
            (task) => task.name === subtaskName
        )
        if (subtask) {
            subtask.isComplete = !subtask.isComplete
            return true
        }
        return false
    }

    //Getter (for DOM controller) and setter (for rehydration) methods for checklist
    get checklist() {
        return this._checklist
    }

    set checklist(newArray) {
        if (Array.isArray(newArray)) {
            this._checklist = newArray
        } else {
            this._checklist = []
        }
    }
}
