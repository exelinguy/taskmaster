import appLogic from './appLogic'

const domController = (() => {
    //Starting view
    function initializeInterface() {
        appLogic.initializeAppData()

        const projects = appLogic.getProjects()

        const defaultProject = projects[0]

        renderProjectsSidebar()
        renderActiveProject(defaultProject)
    }

    //Render sidebar
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

    //Populate active project
    function renderActiveProject(project) {
        const contentHeader = document.getElementById('content-header')
        const todoListContainer = document.getElementById('todo-list-container')
        contentHeader.innerHTML = ''
        todoListContainer.innerHTML = ''
        contentHeader.innerHTML = `<h1>${project.name}</h1> <button class="btn-primary">Add Task</button>`
        renderTodos(project.todos)
    }

    //Getting and populating todos
    function renderTodos(todos) {
        const todoListContainer = document.getElementById('todo-list-container')
        todoListContainer.innerHTML = ''
        todos.forEach((todo) => {
            const completionClass = todo._isComplete ? 'completed' : ''
            const cardHTML = `
            <div class='todo-card ${completionClass}' data-todo-id='${todo.id}'>
                
                <div class='todo-main-content'>
                    <input type='checkbox' class='todo-checkbox' data-id='${todo.id}' ${todo._isComplete ? 'checked' : ''}>
                    
                    <div class='todo-text'>
                        <h4>${todo.title}</h4>
                        <p class='text-secondary'>${todo.description}</p>
                    </div>
                </div>

                <div class='todo-meta'>
                    <span class='priority-tag priority-${todo.priority}'>${todo.priority}</span>
                    <span class='due-date'>${todo.dueDate}</span>
                </div>

            </div>
        `
            todoListContainer.innerHTML += cardHTML
        })
    }

    // NOTE: This assumes the full TodoForm will be displayed in the modal
    function showTodoForm(projectId) {
        const overlay = document.getElementById('modal-overlay')
        const card = document.getElementById('modal-card')

        // Get today's date for a default value for the date picker
        const today = new Date().toISOString().split('T')[0]

        card.innerHTML = `
        <h2>Add New Task</h2>
        <form id="new-todo-form" data-project-id="${projectId}">
            <input type="text" id="todo-title" class="input-field" 
                placeholder="Task Title" required>
            
            <textarea id="todo-description" class="input-field" 
                placeholder="Notes/Description (Optional)"></textarea>
            
            <div class="form-group">
                <label for="todo-date">Due Date:</label>
                <input type="date" id="todo-date" class="input-field" value="${today}" required>
            </div>
            
            <div class="form-group priority-group">
                <label>Priority:</label>
                <div class="priority-options">
                    <label class="priority-label"><input type="radio" name="priority" value="low" checked> Low</label>
                    <label class="priority-label"><input type="radio" name="priority" value="medium"> Normal</label>
                    <label class="priority-label"><input type="radio" name="priority" value="high"> High</label>
                </div>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn-cancel">Cancel</button>
                <button type="submit" class="btn-primary">Save Task</button>
            </div>
        </form>
    `
        // Display the modal
        overlay.classList.remove('hidden')
    }

    function showProjectForm() {
        const overlay = document.getElementById('modal-overlay')
        const card = document.getElementById('modal-card')

        card.innerHTML = `
        <h2>Add New Project</h2>
        <form id="new-project-form">
            <input type="text" id="project-name" class="input-field" 
                placeholder="Project Name" required minlength="3">
            
            <textarea id="project-description" class="input-field" 
                placeholder="Description (Optional)"></textarea>
            
            <div class="form-actions">
                <button type="button" class="btn-cancel">Cancel</button>
                <button type="submit" class="btn-primary">Save Project</button>
            </div>
        </form>
    `
        // Display the modal
        overlay.classList.remove('hidden')
    }

    return {
        initializeInterface,
        renderProjectsSidebar,
        renderActiveProject,
        renderTodos,
        showTodoForm,
        showProjectForm,
    }
})()

export default domController
