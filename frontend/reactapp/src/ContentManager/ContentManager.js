
import '../App.css';
import PlayGround from '../ERModell/Playground';
import React, {useState} from "react";
import SaveAndLoad from "./SaveAndLoad";
import {DiagramTypes} from "../ERModell/Model/Diagram";
import RelationalManager from "../ERModell/RelationalManager";

//das hier ist ne tab bar component?
function ContentManager() {

    const [diagramType, setDiagramType] = useState(DiagramTypes.erDiagram)

    function changeToErDiagram(){
        if(diagramType === DiagramTypes.erDiagram) return;
        setDiagramType(DiagramTypes.erDiagram);
    }

    function changeToRelationalDiagram(){
        console.log("change to rel?")
        console.log(diagramType)
        if(diagramType === DiagramTypes.relationalDiagram) return;
        setDiagramType(DiagramTypes.relationalDiagram);
    }

    const projectVersion = 1.0;
    const projectName = "notNamed";

    const metaInformation = {
        projectVersion: projectVersion,
        projectName: projectName,
    }

    return (
        <React.StrictMode>
        <div className="App">
            <SaveAndLoad metaInformation={metaInformation}
                         diagramType={diagramType}
                         changeToErDiagram={changeToErDiagram}
                         changeToRelationalDiagram={changeToRelationalDiagram}>

                {diagramType === DiagramTypes.erDiagram ? <PlayGround/> : <RelationalManager/>}

            </SaveAndLoad>
        </div>
        </React.StrictMode>
    )
}




export default ContentManager;

/*export function SaveAndLoad({children, metaInformation, diagramType, changeToErDiagram, changeToRelationalDiagram}){
useEffect(() => {
    window.addEventListener('mousemove', () => {});

    // returned function will be called on component unmount
    return () => {
        window.removeEventListener('mousemove', () => {})
    }
}, [])
var myevent = new CustomEvent("myEvent"< {someData: {}})
document.dispatchEvent(myevent)


//wo anderst in use effect
document.addEventListener("myEvent", (e) => doSthm(e.someData))
//By did unmount -> document.removeEventListener("myEvent");
*/

