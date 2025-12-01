import eventHandler from './eventHandler'
import { format } from 'date-fns'

const modalManager = (() => {
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
                        <input type="radio" id="priority-low" name="priority" value="low" checked>
                        <label for="priority-low" class="priority-label">Low</label>
                        
                        <input type="radio" id="priority-medium" name="priority" value="medium">
                        <label for="priority-medium" class="priority-label">Normal</label>
                        
                        <input type="radio" id="priority-high" name="priority" value="high">
                        <label for="priority-high" class="priority-label">High</label>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-cancel">Cancel</button>
                    <button type="submit" class="btn-primary">Save Task</button>
                </div>
            </form>
        `
        overlay.classList.remove('hidden')
        eventHandler.bindFormSubmissions()
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
        eventHandler.bindFormSubmissions()
    }

    function showTodoDetails(todo) {
        const overlay = document.getElementById('modal-overlay')
        const card = document.getElementById('modal-card')

        // Reuse the same structure/classes so our Edit Logic works easily
        // But layout is vertical and spacious for the modal view
        card.innerHTML = `
            <div class="todo-detail-view" data-todo-id="${todo.id}">
                <div class="detail-header" style="display:flex; justify-content:space-between; align-items:start; margin-bottom:1rem;">
                    <div class="todo-checkbox-group">
                        <label for="modal-check-${todo.id}" class="checkbox-label" style="font-size:0.8rem;">Mark Complete</label>
                        <input type="checkbox" id="modal-check-${todo.id}" class="todo-checkbox" ${todo._isComplete ? 'checked' : ''}>
                    </div>
                    <button class="btn-icon close-modal-btn" style="font-size:1.5rem;">&times;</button>
                </div>

                <div class="todo-text" style="margin-bottom: 1.5rem;">
                    <h2 class="todo-title-text" data-key="title" style="margin-bottom:0.5rem; font-size:1.5rem;">${todo.title}</h2>
                    <p class="text-secondary todo-description-text" data-key="description" style="white-space: pre-wrap;">${todo.description || 'Add a description...'}</p>
                </div>

                <div class="todo-meta" style="border-top:1px solid var(--color-border); padding-top:1rem; display:flex; gap:3rem; align-items:flex-start;">
                    <div style="display:flex; flex-direction:column; gap:0.45rem;">
                        <span class="text-secondary" style="font-size:0.8rem; font-weight:600;">PRIORITY</span>
                        <span class="priority-tag priority-${todo._priority}" style="width:70px;">${todo._priority}</span>
                    </div>
                    
                    <div style="display:flex; flex-direction:column; gap:0.25rem;">
                        <span class="text-secondary" style="font-size:0.8rem; font-weight:600;">DUE DATE</span>
                        <span class="due-date" data-raw-date="${todo.dueDate}">${format(new Date(todo.dueDate), 'MMM dd, yyyy')}</span>
                    </div>
                </div>

                <div style="margin-top: 2rem; text-align:right;">
                    <button class="btn-delete" style="color:#ef4444; opacity:1;">🗑️ Delete Task</button>
                </div>
            </div>
        `

        overlay.classList.remove('hidden')

        // Bind the specific edit events for this modal
        eventHandler.bindModalDetailListeners(todo.id)
    }

    function closeAllModals() {
        document.getElementById('modal-overlay').classList.add('hidden')
        document.getElementById('modal-card').innerHTML = ''
    }

    return { showTodoForm, showProjectForm, closeAllModals, showTodoDetails }
})()

export default modalManager
