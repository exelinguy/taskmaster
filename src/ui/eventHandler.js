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
                            uiRender.renderActiveProject(activeProject)
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
