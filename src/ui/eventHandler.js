import appLogic from '../appLogic'
import uiRender from './uiRenderer'
import modalManager from './modalManager'

const eventHandler = (() => {
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
                modalManager.closeAllModals()
            }
        })

        // // 3. System Navigation
        // const systemLists = document.getElementById('system-lists')
        // if (systemLists) {
        //     systemLists.addEventListener('click', (e) => {
        //         const systemItem = e.target.closest('li[data-id]')
        //         if (systemItem) {
        //             systemLists.querySelectorAll('.active').forEach((item) => {
        //                 item.classList.remove('active')
        //             })
        //             systemItem.classList.add('active')

        //             if (systemItem.dataset.id === 'inbox') {
        //                 const defaultProject = appLogic.getProjects()[0]
        //                 uiRender.renderActiveProject(defaultProject)
        //             }
        //         }
        //     })
        // }

        // 4. Mobile Add Task Button
        const addTaskMobileBtn = document.getElementById('mobile-add-btn')
        const mainContent = document.getElementById('main-content')
        const handleAddTask = () => {
            const activeProjectId = mainContent.dataset.activeProjectId
            if (activeProjectId) {
                modalManager.showTodoForm(activeProjectId)
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
            addProjectBtn.addEventListener(
                'click',
                modalManager.showProjectForm
            )
        }

        // 6. Close Sidebar on Main Content Click (Mobile)
        if (mainContent && sidebar) {
            mainContent.addEventListener('click', () => {
                // If the sidebar is currently open (on mobile), close it.
                if (sidebar.classList.contains('open')) {
                    sidebar.classList.remove('open')
                }
            })
        }
    }

    /*
     ** Dynamic Binding Helper Functions (Called after every render/modal open)
     */
    function bindAddTaskDesktopButton(projectId) {
        const addTaskDesktopBtn = document.getElementById('add-task-desktop')
        if (addTaskDesktopBtn) {
            addTaskDesktopBtn.addEventListener('click', () => {
                modalManager.showTodoForm(projectId)
            })
        }
    }

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

                const newProject = appLogic.addProject(name, description)

                if (newProject) {
                    modalManager.closeAllModals()

                    uiRender.renderProjectsSidebar() // Refresh sidebar
                    uiRender.renderActiveProject(newProject) // Switch to new project
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

                const newTodo = appLogic.addTodo(
                    projectId,
                    title,
                    description,
                    dueDate,
                    priority
                )

                if (newTodo) {
                    modalManager.closeAllModals()
                    const activeProject = appLogic.findProject(projectId)
                    if (activeProject) {
                        uiRender.renderActiveProject(activeProject)
                    }
                }
            })
        }
    }

    function bindTodoCardEvents() {
        const todoListContainer = document.getElementById('todo-list-container')
        const mainContent = document.getElementById('main-content')

        if (!todoListContainer || !mainContent) return

        todoListContainer.addEventListener('click', (e) => {
            const projectId = mainContent.dataset.activeProjectId
            const card = e.target.closest('.todo-card')
            if (!card) return
            const todoId = card.dataset.todoId

            // 1. Handle Checkbox (Existing Logic)
            if (e.target.type === 'checkbox') {
                const newCompletionState = e.target.checked
                appLogic.updateTodoDetails(todoId, projectId, {
                    isComplete: newCompletionState,
                })
                const activeProject = appLogic.findProject(projectId)
                uiRender.renderActiveProject(activeProject)
                return
            }

            // 2. Handle Delete Button 🗑️
            if (e.target.closest('.btn-delete')) {
                if (confirm('Are you sure you want to delete this task?')) {
                    appLogic.removeTodo(todoId, projectId)
                    const activeProject = appLogic.findProject(projectId)
                    uiRender.renderActiveProject(activeProject)
                }
                return
            }

            // 3. Handle Priority Cycle 🔄
            if (e.target.classList.contains('priority-tag')) {
                const currentPriority = e.target.textContent.trim()
                const priorityMap = {
                    low: 'medium',
                    medium: 'high',
                    high: 'low',
                }
                const newPriority = priorityMap[currentPriority] || 'low'

                appLogic.updateTodoDetails(todoId, projectId, {
                    priority: newPriority,
                })
                const activeProject = appLogic.findProject(projectId)
                uiRender.renderActiveProject(activeProject)
                return
            }

            // 4. Handle Date Edit 📅
            if (e.target.classList.contains('due-date')) {
                const currentRawDate = e.target.dataset.rawDate // 2025-11-26T...
                const dateValue = currentRawDate
                    ? currentRawDate.split('T')[0]
                    : ''

                const dateInput = document.createElement('input')
                dateInput.type = 'date'
                dateInput.value = dateValue
                dateInput.classList.add('edit-input')

                // Replace span with input
                e.target.replaceWith(dateInput)
                dateInput.focus()

                // Save on blur
                dateInput.addEventListener('blur', () => {
                    if (dateInput.value) {
                        appLogic.updateTodoDetails(todoId, projectId, {
                            dueDate: dateInput.value,
                        })
                    }
                    const activeProject = appLogic.findProject(projectId)
                    uiRender.renderActiveProject(activeProject)
                })
                return
            }

            // 5. Handle Title/Description Edit (In-Place) 📝
            if (
                e.target.classList.contains('todo-title-text') ||
                e.target.classList.contains('todo-description-text')
            ) {
                const field = e.target.dataset.key // 'title' or 'description'
                const currentText = e.target.innerText

                // Create Input Element
                const input =
                    field === 'description'
                        ? document.createElement('textarea')
                        : document.createElement('input')

                if (field !== 'description') input.type = 'text'

                input.value = currentText
                input.classList.add('edit-input')

                // Replace text with input
                e.target.replaceWith(input)
                input.focus()

                // Define save logic
                const save = () => {
                    const newValue = input.value.trim()
                    if (newValue && newValue !== currentText) {
                        appLogic.updateTodoDetails(todoId, projectId, {
                            [field]: newValue, // Dynamic key: title or description
                        })
                    }
                    const activeProject = appLogic.findProject(projectId)
                    uiRender.renderActiveProject(activeProject)
                }

                // Save on blur (clicking away)
                input.addEventListener('blur', save)

                // Save on Enter (only for title inputs, allow newlines in description)
                input.addEventListener('keydown', (k) => {
                    if (k.key === 'Enter' && field !== 'description') {
                        input.blur() // Triggers the blur event above
                    }
                })
            }
        })
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
                        uiRender.renderActiveProject(project)
                    }
                }
            })
        }
    }
    function bindDynamicListeners() {
        bindFormSubmissions()
        bindTodoCardEvents()
        bindSidebarEvents()
    }

    return {
        bindStaticAppListeners,
        bindDynamicListeners,
        bindAddTaskDesktopButton,
        bindFormSubmissions,
    }
})()

export default eventHandler
