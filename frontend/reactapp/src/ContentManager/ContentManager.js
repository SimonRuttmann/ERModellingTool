
import '../App.css';
import PlayGround from '../ERModell/Playground';
import React, {useState} from "react";
import SaveAndLoad from "./SaveAndLoad";
import {diagramTypes} from "../ERModell/Model/Diagram";
import RelationalManager from "../ERModell/RelationalManager";

function ContentManager() {

    const [diagramType, setDiagramType] = useState(diagramTypes.erDiagram)

    function changeToErDiagram(){
        if(diagramType === diagramTypes.erDiagram) return;
        setDiagramType(diagramTypes.erDiagram);
    }

    function changeToRelationalDiagram(){
        if(diagramType === diagramTypes.relationalDiagram) return;
        setDiagramType(diagramTypes.relationalDiagram);
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
            <SaveAndLoad metaInforamtion={metaInformation}
                         diagramType={diagramType}
                         changeToErDiagram={changeToErDiagram}
                         changeToRelationalDiagram={changeToRelationalDiagram}>

                {diagramType === diagramTypes.erDiagram ? <PlayGround/> : <RelationalManager/>}

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

