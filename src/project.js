export default class Project {
    constructor(name, description) {
        this.id = crypto.randomUUID()
        this._name = name
        this._description = description
        this._todos = []
    }

    /**
     Setter methods for setting project name and description
     */
    set name(newName) {
        if (newName.trim().length >= 3) {
            this._name = newName
        } else {
            throw new Error('Name has to be greater than 2 characters.')
        }
    }

    set description(newDescription) {
        if (typeof newDescription === 'string') {
            this._description = newDescription
        } else {
            this._description = ''
        }
    }

    /**
     Getter methods for getting project name and description
     */
    get name() {
        return this._name
    }

    get description() {
        return this._description
    }

    /**
     Adding Todos
     */
    addTodo(todoObject) {
        this._todos.push(todoObject)
    }

    /**
     Deleting Todos 
     */
    deleteTodo(todoId) {
        this._todos = this._todos.filter((todo) => todo.id !== todoId)
    }

    /**
     Getter method for todos
     */
    get todos() {
        return this._todos
    }

    //Update function for changing project details
    updateDetails(newDetails) {
        const keys = Object.keys(newDetails)
        keys.forEach((key) => (this[key] = newDetails[key]))
    }
}
