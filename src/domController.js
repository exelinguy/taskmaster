import appLogic from './appLogic'

const DOMController = (() => {
    /*
     ** Render & Initialization Functions
     */
    function initializeInterface() {
        appLogic.initializeAppData() // Ensures default project exists

        const projects = appLogic.getProjects()
        const defaultProject = projects[0]

        renderProjectsSidebar()
        renderActiveProject(defaultProject)

        // Bind dynamic listeners (forms, project links) every time the content changes
        bindDynamicListeners()
    }

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

        // CRITICAL FIX: Set the active project ID for event handlers to use
        if (mainContent) {
            mainContent.dataset.activeProjectId = project.id
        }

        contentHeader.innerHTML = ''
        todoListContainer.innerHTML = ''

        const taskCount = project.todos.filter((t) => !t._isComplete).length

        contentHeader.innerHTML = `
            <div class="content-header-text">
                <h1>${project.name}</h1> 
                <p class="text-secondary">${taskCount} tasks remaining</p>
            </div>
            <button class="btn-primary" id="add-task-desktop">
                + Add Task
            </button>
        `
        renderTodos(project.todos)
        // Bind dynamic button immediately after rendering
        bindAddTaskDesktopButton(project.id)
    }

    function renderTodos(todos) {
        const todoListContainer = document.getElementById('todo-list-container')
        todoListContainer.innerHTML = '' // Clear content

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
                        <span class='priority-tag priority-${todo._priority}'>${todo._priority}</span>
                        <span class='due-date'>${todo._dueDate}</span>
                    </div>
                </div>
            `
            todoListContainer.innerHTML += cardHTML
        })
    }

    /*
     ** Forms/Modal Rendering Functions
     */
    function showTodoForm(projectId) {
        const overlay = document.getElementById('modal-overlay')
        const card = document.getElementById('modal-card')
        const today = new Date().toISOString().split('T')[0]

        card.innerHTML = `
            <h2>Add New Task</h2>
            <form id="new-todo-form" data-project-id="${projectId}">
                <input type="text" id="todo-title" class="input-field" placeholder="Task Title" required>
                <textarea id="todo-description" class="input-field" placeholder="Notes/Description (Optional)"></textarea>
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
        overlay.classList.remove('hidden')
        bindFormSubmissions()
    }

    function showProjectForm() {
        const overlay = document.getElementById('modal-overlay')
        const card = document.getElementById('modal-card')

        card.innerHTML = `
            <h2>Add New Project</h2>
            <form id="new-project-form">
                <input type="text" id="project-name" class="input-field" placeholder="Project Name" required minlength="3">
                <textarea id="project-description" class="input-field" placeholder="Description (Optional)"></textarea>
                <div class="form-actions">
                    <button type="button" class="btn-cancel">Cancel</button>
                    <button type="submit" class="btn-primary">Save Project</button>
                </div>
            </form>
        `
        overlay.classList.remove('hidden')
        bindFormSubmissions()
    }

    /*
     ** Private/Helper Functions
     */
    function closeAllModals() {
        document.getElementById('modal-overlay').classList.add('hidden')
        document.getElementById('modal-card').innerHTML = ''
    }

    /*
     ** Dynamic Binding Helper Functions (Called after every render/modal open)
     */

    // Helper for Desktop Add Task Button (Called from renderActiveProject)
    function bindAddTaskDesktopButton(projectId) {
        const addTaskDesktopBtn = document.getElementById('add-task-desktop')
        if (addTaskDesktopBtn) {
            addTaskDesktopBtn.addEventListener('click', () => {
                showTodoForm(projectId)
            })
        }
    }

    // CRITICAL FIX: The previously missing function definitions
    function bindFormSubmissions() {
        // --- 1. Project Form Submission ---
        const projectForm = document.getElementById('new-project-form')
        if (projectForm) {
            projectForm.addEventListener('submit', (e) => {
                e.preventDefault()

                const name = document.getElementById('project-name').value
                const description = document.getElementById(
                    'project-description'
                ).value

                const success = appLogic.addProject(name, description)

                if (success) {
                    closeAllModals()
                    initializeInterface()
                }
            })
        }
        // --- 2. Todo Form Submission ---
        const todoForm = document.getElementById('new-todo-form')
        if (todoForm) {
            todoForm.addEventListener('submit', (e) => {
                e.preventDefault()

                const projectId = todoForm.dataset.projectId
                const title = document.getElementById('todo-title').value
                const description =
                    document.getElementById('todo-description').value
                const dueDate = document.getElementById('todo-date').value
                const priority = document.querySelector(
                    'input[name="priority"]:checked'
                ).value

                const success = appLogic.addTodo(
                    projectId,
                    title,
                    description,
                    dueDate,
                    priority
                )

                if (success) {
                    closeAllModals()
                    const activeProject = appLogic.findProject(projectId)
                    if (activeProject) {
                        renderActiveProject(activeProject)
                    }
                }
            })
        }
    }

    function bindTodoCardEvents() {
        const todoListContainer = document.getElementById('todo-list-container')
        const mainContentArea = document.getElementById('main-content')
        if (todoListContainer && mainContentArea) {
            todoListContainer.addEventListener('click', (e) => {
                if (e.target.type === 'checkbox') {
                    const todoId = e.target.dataset.id
                    const projectId = mainContentArea.dataset.activeProjectId
                    const newCompletionState = e.target.checked

                    const success = appLogic.updateTodoDetails(
                        todoId,
                        projectId,
                        { isComplete: newCompletionState }
                    )

                    if (success) {
                        const activeProject = appLogic.findProject(projectId)
                        if (activeProject) {
                            renderActiveProject(activeProject)
                        }
                    }
                }
            })
        }
    }

    function bindSidebarEvents() {
        const projectsListContainer = document.getElementById('projects-list')

        if (projectsListContainer) {
            projectsListContainer.addEventListener('click', (e) => {
                const projectItem = e.target.closest('[data-project-id]')

                if (projectItem) {
                    const projectId = projectItem.dataset.projectId
                    // FIX: Use the new public findProject method
                    const project = appLogic.findProject(projectId)

                    if (project) {
                        renderActiveProject(project)
                    }
                }
            })
        }
    }

    // Master function for dynamic events (called on refresh)
    function bindDynamicListeners() {
        bindFormSubmissions()
        bindTodoCardEvents()
        bindSidebarEvents()
    }

    /*
     ** Static Binding Helper Functions (Called ONCE by index.js)
     */

    function bindStaticAppListeners() {
        // 1. Mobile Menu Toggle
        const menuToggleBtn = document.getElementById('menu-toggle')
        const sidebar = document.getElementById('sidebar')
        if (menuToggleBtn && sidebar) {
            menuToggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open')
            })
        }

        // 2. Modal Close Controls
        const overlay = document.getElementById('modal-overlay')
        overlay.addEventListener('click', (e) => {
            if (
                e.target.id === 'modal-overlay' ||
                e.target.classList.contains('btn-cancel')
            ) {
                closeAllModals()
            }
        })

        // 3. System Navigation
        const systemLists = document.getElementById('system-lists')
        if (systemLists) {
            systemLists.addEventListener('click', (e) => {
                const systemItem = e.target.closest('li[data-id]')
                if (systemItem) {
                    systemLists.querySelectorAll('.active').forEach((item) => {
                        item.classList.remove('active')
                    })
                    systemItem.classList.add('active')

                    if (systemItem.dataset.id === 'inbox') {
                        const defaultProject = appLogic.getProjects()[0]
                        renderActiveProject(defaultProject)
                    }
                }
            })
        }

        // 4. Mobile Add Task Button
        const addTaskMobileBtn = document.getElementById('mobile-add-btn')
        const mainContent = document.getElementById('main-content')
        const handleAddTask = () => {
            const activeProjectId = mainContent.dataset.activeProjectId
            if (activeProjectId) {
                showTodoForm(activeProjectId)
            } else {
                console.error('Cannot open form: No active project ID found.')
            }
        }
        if (addTaskMobileBtn) {
            addTaskMobileBtn.addEventListener('click', handleAddTask)
        }

        // 5. Add Project Static Button
        const addProjectBtn = document.getElementById('add-project-btn')
        if (addProjectBtn) {
            addProjectBtn.addEventListener('click', showProjectForm)
        }
    }

    // The final returned object now uses the separated binders
    return {
        initializeInterface,
        renderProjectsSidebar,
        renderActiveProject,
        renderTodos,
        showTodoForm,
        showProjectForm,
        bindStaticAppListeners, // NEW: Run once in index.js
    }
})()

export default DOMController
