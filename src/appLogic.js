import Project from './project'
import storageManager from './storage'
import Todo from './todo'
const appLogic = (() => {
    let projects = []

    //Project methods

    //Helper fuction to find projects
    function findProject(projectId) {
        return projects.find((p) => p.id === projectId)
    }

    function getProjects() {
        return projects
    }

    function addProject(name, description) {
        try {
            const project = new Project(name, description)
            projects.push(project)
            saveAppData()
            return project
        } catch (error) {
            console.error('Failed to add project:', error.message)
            return false
        }
    }

    function removeProject(projectId) {
        projects = projects.filter((project) => project.id !== projectId)
        saveAppData()
        return true
    }

    function updateProjectDetails(projectId, newDetails) {
        const project = findProject(projectId)
        if (!project) {
            console.error(`Project with ID ${projectId} not found.`)
            return false
        }
        try {
            project.updateDetails(newDetails)
            saveAppData()
            return true
        } catch (error) {
            console.error('Failed to update project:', error.message)
            return false
        }
    }

    //Todo methods
    function addTodo(projectId, title, description, dueDate, priority) {
        const project = findProject(projectId)
        if (!project) {
            console.error(
                `Project with ID ${projectId} not found. Cannot add todo.`
            )
            return false
        }
        const todo = new Todo(title, description, dueDate, priority)
        project.addTodo(todo)
        saveAppData()
        return true
    }

    function removeTodo(todoId, projectId) {
        const project = findProject(projectId)
        if (!project) {
            console.error(
                `Project with ID ${projectId} not found. Cannot remove todo.`
            )
            return false
        }
        project.deleteTodo(todoId)
        saveAppData()
        return true
    }

    function updateTodoDetails(todoId, projectId, newDetails) {
        const project = findProject(projectId)
        if (!project) {
            console.error(`Project with ID ${projectId} not found.`)
            return false
        }
        const todo = project.todos.find((t) => t.id === todoId)
        if (!todo) {
            console.error(
                `Todo with ID ${todoId} not found in project with ID ${projectId}.`
            )
            return false
        }
        try {
            todo.updateDetails(newDetails)
            saveAppData()
            return true
        } catch (error) {
            console.error('Failed to update todo:', error.message)
            return false
        }
    }

    //Data Persistence methods (placeholders for now)
    function initializeAppData() {
        const loadProjects = storageManager.loadFromLocal()
        if (loadProjects.length > 0)
            try {
                projects = loadProjects
                console.log('AppLogic: Loaded saved data.')
            } catch (error) {
                console.error('Failed to load stored data:', error.message)
            }
        else {
            const project = new Project(
                'Default Project',
                'Enter description...'
            )
            projects.push(project)
            console.log('AppLogic: Initializing default project.')
            saveAppData()
        }
    }

    function saveAppData() {
        storageManager.saveToLocal(projects)
        return true
    }

    //Export the public interface for other modules to use.
    return {
        getProjects,
        findProject,
        addProject,
        removeProject,
        updateProjectDetails,
        addTodo,
        removeTodo,
        updateTodoDetails,
        saveAppData,
        initializeAppData,
    }
})()

export default appLogic
