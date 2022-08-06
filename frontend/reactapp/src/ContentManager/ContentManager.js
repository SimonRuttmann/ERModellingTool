import '../App.css';
import React, {useState} from "react";
import {DiagramTypes} from "../ERModell/Model/Diagram";
import PlayGround from '../ERModell/Playground';
import SaveAndLoad from "./SaveAndLoad";
import RelationalManager from "../ERModell/RelationalManager";

/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
function ContentManager() {

    const [diagramType, setDiagramType] = useState(DiagramTypes.erDiagram)

    function changeToErDiagram(){
        if(diagramType === DiagramTypes.erDiagram) return;
        setDiagramType(DiagramTypes.erDiagram);
    }

    function changeToRelationalDiagram(){
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
