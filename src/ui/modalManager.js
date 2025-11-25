import eventHandler from './eventHandler'

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

    function closeAllModals() {
        document.getElementById('modal-overlay').classList.add('hidden')
        document.getElementById('modal-card').innerHTML = ''
    }

    return { showTodoForm, showProjectForm, closeAllModals }
})()

export default modalManager
