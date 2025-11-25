import Project from './project'
import Todo from './todo'

const storageManager = (() => {
    function saveToLocal(data) {
        localStorage.setItem('projects', JSON.stringify(data))
    }

    function loadFromLocal() {
        try {
            const data = localStorage.getItem('projects')
            if (!data) {
                return []
            }

            const projects = JSON.parse(data)

            const rehydratedProjects = projects.map((project) => {
                const nameFromStorage = project._name

                const safeName =
                    nameFromStorage && nameFromStorage.trim().length >= 3
                        ? nameFromStorage
                        : 'Restored Project' // Fallback must be >= 3 chars to pass validation

                const newProject = new Project(
                    safeName,
                    project._description || ''
                )

                newProject.id = project.id

                newProject._todos = project._todos.map((todo) => {
                    const newTodo = new Todo(
                        todo.title || 'Untitled Task',
                        todo.description || '',
                        todo.dueDate,
                        todo._priority || 'medium'
                    )

                    newTodo.id = todo.id
                    newTodo.isComplete = todo._isComplete
                    newTodo.checklist = todo._checklist
                    return newTodo
                })

                return newProject
            })

            return rehydratedProjects
        } catch (error) {
            console.error('Failed to load storage data:', error)
            return []
        }
    }

    return { saveToLocal, loadFromLocal }
})()
export default storageManager
