export default class Project {
    constructor(name, description) {
        this.id = crypto.randomUUID()
        this.name = name
        this.description = description
        this.todos = []
    }

    /**
     Adding Todos
     */
    addTodo(todoObject) {
        this.todos.push(todoObject)
    }

    /**
     Deleting Todos 
     */
    deleteTodo(todoId) {
        this.todos = this.todos.filter((todo) => todo.id !== todoId)
    }

    /**
     *
     */
    getTodos() {
        return this.todos
    }
}
