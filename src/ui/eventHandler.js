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

        // 7. Toggle theme button
        const themeToggles = document.querySelectorAll('.theme-switch-input')

        const handleThemeChange = (isChecked) => {
            if (isChecked) {
                document.body.classList.add('dark-mode')
                localStorage.setItem('theme', 'dark')
            } else {
                document.body.classList.remove('dark-mode')
                localStorage.setItem('theme', 'light')
            }

            themeToggles.forEach((toggle) => {
                toggle.checked = isChecked
            })
        }

        themeToggles.forEach((toggle) => {
            toggle.addEventListener('change', (e) => {
                handleThemeChange(e.target.checked)
            })
        })
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

        if (!todoListContainer) return

        todoListContainer.addEventListener('click', (e) => {
            const projectId = mainContent.dataset.activeProjectId
            const card = e.target.closest('.todo-card')
            if (!card) return
            const todoId = card.dataset.todoId

            // A. Checkbox (Quick Action - Keep on Card)
            if (e.target.type === 'checkbox') {
                const newCompletionState = e.target.checked
                appLogic.updateTodoDetails(todoId, projectId, {
                    isComplete: newCompletionState,
                })
                const activeProject = appLogic.findProject(projectId)
                uiRender.renderActiveProject(activeProject)
                return
            }

            // B. Delete Button (Quick Action - Keep on Card)
            if (e.target.closest('.btn-delete')) {
                if (confirm('Delete this task?')) {
                    appLogic.removeTodo(todoId, projectId)
                    const activeProject = appLogic.findProject(projectId)
                    uiRender.renderActiveProject(activeProject)
                }
                return
            }

            // C. Click on Content -> OPEN MODAL 🔍
            // If we clicked the info group (text/tags) but NOT the checkbox/delete actions
            if (e.target.closest('.todo-info-group')) {
                const activeProject = appLogic.findProject(projectId)
                const todo = activeProject.todos.find((t) => t.id === todoId)
                if (todo) {
                    modalManager.showTodoDetails(todo)
                }
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

    function bindProjectHeaderEvents(projectId) {
        const header = document.getElementById('content-header')
        if (!header) return

        // --- 1. EDIT FUNCTIONALITY ---
        const editBtn = header.querySelector('.edit-project-btn')

        if (editBtn) {
            editBtn.addEventListener('click', () => {
                const nameEl = header.querySelector('.project-name')
                const descEl = header.querySelector('.project-description')

                // Prevent multiple clicks
                if (nameEl.querySelector('input')) return

                // Convert Name to Input
                const currentName = nameEl.innerText
                const nameInput = document.createElement('input')
                nameInput.type = 'text'
                nameInput.value = currentName
                nameInput.classList.add('edit-input')
                nameInput.style.fontSize = 'var(--font-h1)' // Match H1 size
                nameEl.innerHTML = ''
                nameEl.appendChild(nameInput)

                // Convert Description to Textarea
                const currentDesc =
                    descEl.innerText === 'No description provided.'
                        ? ''
                        : descEl.innerText
                const descInput = document.createElement('textarea')
                descInput.value = currentDesc
                descInput.classList.add('edit-input')
                descEl.innerHTML = ''
                descEl.appendChild(descInput)

                nameInput.focus()

                // Save Function
                const saveChanges = () => {
                    const newName = nameInput.value.trim()
                    const newDesc = descInput.value.trim()

                    if (newName && newName.length >= 3) {
                        appLogic.updateProjectDetails(projectId, {
                            name: newName,
                            description: newDesc,
                        })

                        // Re-render to show changes (and exit edit mode)
                        const updatedProject = appLogic.findProject(projectId)
                        uiRender.renderProjectsSidebar() // Update sidebar name
                        uiRender.renderActiveProject(updatedProject)
                    } else {
                        alert(
                            'Project name must be at least 3 characters long.'
                        )
                        nameInput.focus()
                    }
                }

                const handleBlur = (e) => {
                    // Only save if we are clicking OUTSIDE of our two inputs
                    if (
                        e.relatedTarget === nameInput ||
                        e.relatedTarget === descInput
                    ) {
                        return
                    }
                    saveChanges()
                }

                nameInput.addEventListener('blur', handleBlur)
                descInput.addEventListener('blur', handleBlur)

                // Allow saving with Enter on the name field
                nameInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        // Blur triggers the save, so we just blur manually
                        nameInput.blur()
                    }
                })
            })
        }

        // --- 2. DELETE FUNCTIONALITY ---
        const deleteBtn = header.querySelector('.delete-project-btn')

        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                const project = appLogic.findProject(projectId)
                const taskCount = project.todos.length

                // Prevent deleting the very last project
                if (appLogic.getProjects().length === 1) {
                    alert('You cannot delete the only project!')
                    return
                }

                let confirmed = false
                if (taskCount > 0) {
                    confirmed = confirm(
                        `This project has ${taskCount} task(s). Are you sure you want to delete it?`
                    )
                } else {
                    confirmed = confirm('Delete this project?')
                }

                if (confirmed) {
                    appLogic.removeProject(projectId)
                    uiRender.renderProjectsSidebar()

                    // Switch to the first available project
                    const remainingProjects = appLogic.getProjects()
                    if (remainingProjects.length > 0) {
                        uiRender.renderActiveProject(remainingProjects[0])
                    }
                }
            })
        }
    }

    function bindModalDetailListeners(todoId) {
        const modalCard = document.getElementById('modal-card')
        const mainContent = document.getElementById('main-content')
        const projectId = mainContent.dataset.activeProjectId

        // Close button logic
        const closeBtn = modalCard.querySelector('.close-modal-btn')
        if (closeBtn) {
            closeBtn.addEventListener('click', () =>
                modalManager.closeAllModals()
            )
        }

        // Generic function to refresh UI after an update
        const refreshUI = () => {
            const activeProject = appLogic.findProject(projectId)
            // 1. Refresh background list
            uiRender.renderActiveProject(activeProject)
            // 2. Refresh current modal (to show updated state/formatting)
            const updatedTodo = activeProject.todos.find((t) => t.id === todoId)
            if (updatedTodo) {
                modalManager.showTodoDetails(updatedTodo)
            } else {
                modalManager.closeAllModals() // Todo was deleted
            }
        }

        // --- Edit Logic (Delegation on Modal) ---
        modalCard.click((e) => {
            // 1. Priority Cycle
            if (e.target.classList.contains('priority-tag')) {
                const currentPriority = e.target.textContent.trim()
                const priorityMap = {
                    low: 'medium',
                    medium: 'high',
                    high: 'low',
                }
                appLogic.updateTodoDetails(todoId, projectId, {
                    priority: priorityMap[currentPriority],
                })
                refreshUI()
            }

            // 2. Checkbox in Modal
            if (e.target.type === 'checkbox') {
                appLogic.updateTodoDetails(todoId, projectId, {
                    isComplete: e.target.checked,
                })
                refreshUI()
            }

            // 3. Delete in Modal
            if (e.target.closest('.btn-delete')) {
                if (confirm('Delete this task?')) {
                    appLogic.removeTodo(todoId, projectId)
                    refreshUI()
                }
            }

            // 4. Date Edit
            if (e.target.classList.contains('due-date')) {
                const currentRawDate = e.target.dataset.rawDate
                const dateValue = currentRawDate
                    ? currentRawDate.split('T')[0]
                    : ''

                const dateInput = document.createElement('input')
                dateInput.type = 'date'
                dateInput.value = dateValue
                dateInput.classList.add('edit-input')

                e.target.replaceWith(dateInput)
                dateInput.focus()

                dateInput.addEventListener('blur', () => {
                    if (dateInput.value) {
                        appLogic.updateTodoDetails(todoId, projectId, {
                            dueDate: dateInput.value,
                        })
                        refreshUI()
                    } else {
                        refreshUI() // Revert if empty/cancelled
                    }
                })
            }

            // 5. Title / Description Edit
            if (
                e.target.classList.contains('todo-title-text') ||
                e.target.classList.contains('todo-description-text')
            ) {
                const field = e.target.dataset.key
                const currentText = e.target.innerText

                const input =
                    field === 'description'
                        ? document.createElement('textarea')
                        : document.createElement('input')
                if (field !== 'description') input.type = 'text'

                input.value =
                    currentText === 'Add a description...' ? '' : currentText
                input.classList.add('edit-input')
                if (field === 'title') input.style.fontSize = '1.5rem' // Match header size

                e.target.replaceWith(input)
                input.focus()

                const save = () => {
                    const newValue = input.value.trim()
                    if (newValue && newValue !== currentText) {
                        appLogic.updateTodoDetails(todoId, projectId, {
                            [field]: newValue,
                        })
                    }
                    refreshUI()
                }

                input.addEventListener('blur', save)
                input.addEventListener('keydown', (k) => {
                    if (k.key === 'Enter' && field !== 'description')
                        input.blur()
                })
            }
        })
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
        bindProjectHeaderEvents,
        bindModalDetailListeners,
    }
})()

export default eventHandler
