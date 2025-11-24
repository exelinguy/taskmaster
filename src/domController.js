import appLogic from './appLogic'
import uiRender from './ui/uiRenderer'
import eventHandler from './ui/eventHandler'

const DOMController = (() => {
    /*
     ** Render & Initialization Function
     */
    function initializeInterface() {
        appLogic.initializeAppData() // Ensures default project exists

        const projects = appLogic.getProjects()
        const defaultProject = projects[0]

        uiRender.renderProjectsSidebar()
        uiRender.renderActiveProject(defaultProject)

        // Bind dynamic listeners (forms, project links) every time the content changes
        eventHandler.bindDynamicListeners()
    }
    return {
        initializeInterface,
    }
})()

export default DOMController
