import appLogic from '../appLogic'
import eventHandler from './eventHandler'
import { format } from 'date-fns'

const uiRender = (() => {
    function renderProjectsSidebar() {
        const projects = appLogic.getProjects()
        const projectsListContainer = document.getElementById('projects-list')

        projectsListContainer.innerHTML = ''

        projects.forEach((project) => {
            const projectItem = document.createElement('li')
            projectItem.classList.add('nav-item')
            projectItem.textContent = project.name
            projectItem.dataset.projectId = project.id
            projectsListContainer.appendChild(projectItem)
        })
    }

    function renderActiveProject(project) {
        const contentHeader = document.getElementById('content-header')
        const todoListContainer = document.getElementById('todo-list-container')
        const mainContent = document.getElementById('main-content')
        if (mainContent) {
            mainContent.dataset.activeProjectId = project.id
        }

        contentHeader.innerHTML = ''
        todoListContainer.innerHTML = ''

        const taskCount = project.todos.filter((t) => !t._isComplete).length

        contentHeader.innerHTML = `
            <div class="project-header-top">
                <div class="project-title-group">
                    <h1 class="project-name" data-key="name">${project.name}</h1>
                    <div class="project-actions">
                        <button class="btn-icon edit-project-btn" aria-label="Edit Project">✏️</button>
                        <button class="btn-icon delete-project-btn" aria-label="Delete Project">🗑️</button>
                    </div>
                </div>
                <button class="btn-primary" id="add-task-desktop">+ Add Task</button>
            </div>
            
            <p class="project-description text-secondary" data-key="description">
                ${project.description || 'No description provided.'}
            </p>
            <p class="task-count text-secondary">${taskCount} tasks remaining</p>
        `
        renderTodos(project.todos)
        // Bind dynamic button immediately after rendering
        eventHandler.bindAddTaskDesktopButton(project.id)
        eventHandler.bindProjectHeaderEvents(project.id)
    }

    function renderTodos(todos) {
        const todoListContainer = document.getElementById('todo-list-container')
        todoListContainer.innerHTML = '' // Clear content

        todos.forEach((todo) => {
            const completionClass = todo._isComplete ? 'completed' : ''
            const cardHTML = `
    <div class='todo-card ${completionClass}' data-todo-id='${todo.id}'>
        <div class='todo-info-group'>
            <div class='todo-text'>
                <h4 class='todo-title-text' data-key='title'>${todo.title}</h4>
                <p class='text-secondary todo-description-text' data-key='description'>${todo.description || 'No description'}</p>
            </div>
            <div class='todo-meta'>
                <span class='priority-tag priority-${todo._priority}' data-priority='${todo._priority}'>${todo._priority}</span>
                <span class='due-date' data-raw-date='${todo.dueDate}'>${format(new Date(todo.dueDate), 'MMM dd')}</span>
            </div>
        </div>
        
        <div class='todo-actions-group'>
            <div class='todo-checkbox-group'>
                <label for='todo-checkbox-${todo.id}' class='checkbox-label'>Done</label>
                <input type='checkbox' id='todo-checkbox-${todo.id}' class='todo-checkbox' data-id='${todo.id}' ${todo._isComplete ? 'checked' : ''}>
            </div>
            <button class='btn-delete' data-id='${todo.id}' aria-label='Delete Task'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="20px" width="20px">
                <title>Delete</title><path fill="#94a3b8" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>
            </button>
        </div>
    </div>
`
            todoListContainer.innerHTML += cardHTML
        })
    }
    return { renderProjectsSidebar, renderTodos, renderActiveProject }
})()

export default uiRender
