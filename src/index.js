import appLogic from './appLogic'
import DOMController from './domController' // Renamed for clarity, assuming DOMController is the export name
import './style.css'

function init() {
    // ⚠️ TEMPORARY: Expose core modules for console testing
    window.App = appLogic
    window.DOM = DOMController

    // 1. Initialize data (ensures default project is created)
    appLogic.initializeAppData()

    // 2. Start the Interface rendering sequence
    DOMController.initializeInterface()

    console.log(
        'App initialized. Check window.App (Logic) and window.DOM (Rendering) in the console for testing.'
    )
}

init()
