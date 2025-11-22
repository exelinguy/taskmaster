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

## 🖼️ Phase 3: The Interface Layer (The "View")

**Goal:** Create a visual layout, define rendering functions, and establish a clear separation of concerns between the DOM and the `AppLogic` Module. All rendering and event binding happens here; all data mutation must be delegated to `appLogic`.

### [ ] 1. HTML Structure Update (`src/index.html`) 🏗️

We need to create the main containers that Webpack will load and where `domController.js` will inject all the dynamic content.

| Component              | Element ID       | Purpose                                                                                         |
| :--------------------- | :--------------- | :---------------------------------------------------------------------------------------------- |
| **Main App Container** | `#app-container` | The primary container for the entire application (used for layout, e.g., Flexbox).              |
| **Projects Sidebar**   | `#sidebar`       | Container for the list of projects, default views (like "Today"), and the "Add Project" button. |
| **Main Content**       | `#main-content`  | Container for the header of the active project and the list of its todo tasks.                  |
| **Modal Overlay**      | `#modal-overlay` | A separate, hidden container that will display forms (Add/Edit Todo) over the main content.     |

### [ ] 2. DOM Controller Functions (`src/domController.js`) 🧠

This module exports functions that handle every aspect of the UI. It relies entirely on the `appLogic` module for data.

| Category           | Function Name                  | Responsibility                                                                                                                                              |
| :----------------- | :----------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Initialization** | `initializeInterface()`        | A single entry point that: 1) Gets projects from `appLogic`, 2) Calls `renderProjectsSidebar()`, and 3) Calls `renderActiveProject()` for the default view. |
| **Rendering**      | `renderProjectsSidebar()`      | Fetches the full project list from `appLogic.getProjects()` and generates clickable HTML elements for each project in `#sidebar`.                           |
|                    | `renderActiveProject(project)` | Takes a specific project object, clears `#main-content`, renders the project's header, and calls `renderTodos()` for its tasks.                             |
|                    | `renderTodos(todos)`           | Iterates through a list of tasks and generates the HTML card/markup for each task in the `#main-content` area.                                              |
| **Forms/Modals**   | `showTodoForm(projectId)`      | Clears and displays the form HTML in the `#modal-overlay` for adding a new task to the specified project.                                                   |
|                    | `showProjectForm()`            | Clears and displays the form HTML for adding/editing a project in the `#modal-overlay`.                                                                     |

## Phase 4: Wiring & Interaction (The "Controller") 🔌

**Goal:** Connect the Logic to the Interface.

1. [ ] **Event Listeners:** Set up event handlers on dynamically generated buttons (Add, Delete, Edit, Select Project).
2. [ ] **Orchestration:** Event handlers call Logic methods and then call DOM rendering methods to refresh the UI.

    ### [ ] Event Handling and Orchestration 🔌

    All events attached to the DOM must call the Manager methods to change the underlying data, ensuring the view never modifies the Model directly.

    | User Action            | DOM Controller Task                                                       | AppLogic Call                            |
    | :--------------------- | :------------------------------------------------------------------------ | :--------------------------------------- |
    | **Click Project Name** | Call `initializeInterface()` to refresh the UI with the selected project. | (Implicit in update)                     |
    | **Submit New Todo**    | Read form data, close modal.                                              | `appLogic.addTodo(...)`                  |
    | **Click Delete Todo**  | Identify `todoId` and `projectId`.                                        | `appLogic.removeTodo(todoId, projectId)` |
    | **Submit Edit Todo**   | Read form data, close modal.                                              | `appLogic.updateTodoDetails(...)`        |

## Phase 5: Persistence & Polish ✨

**Goal:** Save data and refine the UI.

1. [ ] **`storage.js`:**
    - `saveToLocal(data)`: Serializes the Logic data to JSON.
    - `loadFromLocal()`: Parses JSON and **rehydrates** the data back into class instances.
2. [ ] **Date Integration:** Use `date-fns` to format due dates nicely.
3. [ ] **UI Polish:** CSS styling and final accessibility checks.
