# 🏗️ TaskMaster: A Comprehensive Todo List Application

TaskMaster is a dynamic, responsive, and persistent Todo List application built with vanilla JavaScript, Webpack, and modern CSS. It features a modular architecture, robust data handling, and a polished user interface with dark mode support.

## 🌟 Features

### Core Functionality

- **Project Management:** Create, read, update, and delete (CRUD) projects.
- **Task Management:** Add tasks with titles, descriptions, due dates, and priority levels.
- **Data Persistence:** All data is saved to the browser's `localStorage`, ensuring your tasks survive page reloads.
- **Smart Rehydration:** Automatically restores complex Class objects (Projects and Todos) from JSON data.

### User Interface & Experience

- **Responsive Design:** A mobile-first layout with a collapsible sidebar on mobile and a permanent sidebar on desktop.
- **Dark/Light Mode:** A fully persistent theme toggle that remembers your preference and prevents flashing on load.
- **In-Place Editing:** Click directly on task titles, descriptions, or dates to edit them instantly without opening a form.
- **Rich Modals:** Detailed views for tasks with expanded information and edit capabilities.
- **Interactive Elements:**
    - Priority cycling (Low -> Medium -> High) by clicking the tag.
    - Checkbox completion with strikethrough effects.
    - Safe deletion prompts for projects with active tasks.

---

## 🗺️ Development Map

### Phase 1: Setup & Environment ⚙️

- [x] **Initialize Project:** Run `npm init` to create `package.json`.
- [x] **Install Webpack:** Install `webpack` and `webpack-cli` as dev dependencies.
- [x] **Install Dependencies:** Install `date-fns` for date manipulation.
- [x] **File Structure:** Set up `src` and `dist` directories with entry points.

### Phase 2: The Logic Layer (The "Model") 🧠

- [x] **Core Classes:** Created `Todo` and `Project` classes.
- [x] **AppLogic:** Implemented the "Manager" module to handle data operations (add, remove, update).
- [x] **Persistence:** Built a robust `storage.js` module to handle JSON serialization and class rehydration.

### Phase 3: The Interface Layer (The "View") 🖼️

- [x] **DOM Structure:** Established a clean `index.html` skeleton.
- [x] **UI Renderer:** Created a dedicated module to render the Sidebar, Project Header, and Todo Cards.
- [x] **Modal Manager:** Built dynamic forms for adding projects and tasks.

### Phase 4: Wiring & Interaction (The "Controller") 🔌

- [x] **Event Handling:** Centralized event listeners in `eventHandler.js` to bridge the UI and Logic.
- [x] **Dynamic Binding:** Implemented logic to bind events to dynamically created elements (like new cards).
- [x] **In-Place Editing:** Added "click-to-edit" functionality for seamless updates.

### Phase 5: Persistence & Polish ✨

- [x] **Storage Module:** Implemented `saveToLocal` and `loadFromLocal` with error handling.
- [x] **Date Integration:** Used `date-fns` to format ISO dates into human-readable strings.
- [x] **Styling:** Applied CSS variables, responsiveness, and a polished color palette.
- [x] **Dark Mode:** Implemented a toggle with persistent storage and flash-prevention logic.

---

## 🎓 Learnings

This project was a deep dive into modern JavaScript architecture, tooling, and workflow automation.

### 1. Modular Architecture (Splitting Modules)

We learned to avoid monolithic code files by splitting responsibilities to adhere to the **Single Responsibility Principle**:

- **`uiRenderer.js`**: Handles HTML generation and DOM updates.
- **`modalManager.js`**: Manages pop-up forms and details views.
- **`eventHandler.js`**: Centralizes user interaction logic, bridging the "View" and "Model."

### 2. Advanced Webpack Configuration

We moved beyond a basic setup to a professional, environment-specific configuration:

- **Config Splitting:** Separated configuration into `webpack.common.js` (shared rules/plugins), `webpack.dev.js` (devServer, source maps), and `webpack.prod.js` (optimization). Used `webpack-merge` to combine them.
- **CSS Extraction:** Switched from `style-loader` to **`MiniCssExtractPlugin`** to extract CSS into a separate file. This loads styles in parallel with HTML, preventing the "Flash of Unstyled Content" (FOUC).

### 3. Code Quality & Workflow Automation

We enforced code quality and standardized commits using a robust toolchain:

- **ESLint & Prettier:** Configured to catch errors and enforce consistent formatting automatically.
- **Husky & Lint-Staged:** Set up git hooks to run linters only on changed files (`pre-commit`) before allowing a commit.
- **Commitlint & Gitmoji:** Enforced conventional commit messages (e.g., "feat: ...", "fix: ...") using the `gitmoji` preset for semantic and expressive history.

### 4. Deployment Strategy

We automated the deployment process using the **`gh-pages`** package:

- Created a `deploy` script in `package.json` to push the contents of the `dist` folder directly to a `gh-pages` branch.
- This allows for one-command updates to the live site hosted on GitHub Pages.

### 5. User Interface Patterns

- **In-Place Editing:** Implemented seamless editing by swapping text elements with input fields on click, saving automatically on `blur` (clicking away).
- **Dark Mode:** Created a persistent theme toggle that synchronizes across multiple buttons (mobile/desktop) and uses a blocking script in `index.html` to apply the theme before the first paint.

### 6. External Libraries

- **`date-fns`:** Integrated a lightweight library to parse and format dates (`format(new Date(isoString), 'MMM dd')`), avoiding the overhead of larger libraries while simplifying date logic.
