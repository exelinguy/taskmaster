# 🏗️ Todo List Application: Development Map

## Phase 1: Setup & Environment ⚙️

**Goal:** Get the tools ready and the file structure in place.

1. [x] **Initialize Project:** Run `npm init` to create `package.json`.
2. [x] **Install Webpack:** Install `webpack` and `webpack-cli` as dev dependencies.
3. [x] **Install Dependencies:** Install `date-fns` for date manipulation.
4. [x] **File Structure:** Create `src` and `dist` directories.
    - Create `src/index.html` (Skeleton HTML).
    - Create `src/index.js` (Entry point).
    - Create `src/style.css` (Basic styling).

## Phase 2: The Logic Layer (The "Model") 🧠

**Goal:** Build the engine. This code is independent of the DOM.

1. [x] **`todo.js`:** Create the `Todo` class (with `id`, `title`, `description`, `dueDate`, `priority`, etc.).
2. [x] **`project.js`:** Create the `Project` class (with `id`, `name`, and an array of `todos`).
3. [x] **`appLogic.js` (The Manager):**
    - Manage the master array of Projects.
    * **Project Management** 📁
        - `addProject(name, description)`
        - `getProjects()`
        - `removeProject(projectId)`
        - `updateProjectDetails(projectId, newDetails)`
    * **Todo Coordination** 📝
        - `addTodo(projectId, title, description, dueDate, priority)`
        - `removeTodo(todoId, projectId)`
        - `updateTodoDetails(todoId, projectId, newDetails)`
    * **Data Persistence** 💾
        - `initializeAppData()`
        - `saveAppData()`
    - **Test:** Use `console.log` in `index.js` to verify data structure before building the UI.

## Phase 3: The Interface Layer (The "View") 🖼️

**Goal:** Create visual elements. This code only handles HTML/CSS.

1. [ ] **`domController.js`:**
    - **Render Methods:** Functions to display the projects sidebar and the list of todos for the selected project.
    - **Forms:** Functions to generate and handle the HTML structure for forms (Add/Edit).

## Phase 4: Wiring & Interaction (The "Controller") 🔌

**Goal:** Connect the Logic to the Interface.

1. [ ] **Event Listeners:** Set up event handlers on dynamically generated buttons (Add, Delete, Edit, Select Project).
2. [ ] **Orchestration:** Event handlers call Logic methods and then call DOM rendering methods to refresh the UI.

## Phase 5: Persistence & Polish ✨

**Goal:** Save data and refine the UI.

1. [ ] **`storage.js`:**
    - `saveToLocal(data)`: Serializes the Logic data to JSON.
    - `loadFromLocal()`: Parses JSON and **rehydrates** the data back into class instances.
2. [ ] **Date Integration:** Use `date-fns` to format due dates nicely.
3. [ ] **UI Polish:** CSS styling and final accessibility checks.
