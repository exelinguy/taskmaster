import appLogic from './appLogic'
// import domController from './domController'
import './style.css'
function init() {
    // 1. ⚠️ TEMPORARY: Expose AppLogic for console testing
    window.App = appLogic
    appLogic.initializeAppData()
    const projects = appLogic.getProjects()
    console.log({ projects })
    console.log('App initialised.')
}
init()
