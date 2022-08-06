import '../../App.css';
import React, {useState} from "react";
import {DiagramTypes} from "../../Services/DrawBoardModel/Diagram";
import ErManager from '../ErModel/ErManager';
import ContentManager from "./ContentManager";
import RelationalManager from "../RelationalModel/RelationalManager";

/**
 * Effective root of the database modelling application, renders the content manager
 * Here additional meta information and hooks can be provided to the Er and relational diagrams
 */
function DatabaseModellingTool() {

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
            <ContentManager metaInformation={metaInformation}
                            diagramType={diagramType}
                            changeToErDiagram={changeToErDiagram}
                            changeToRelationalDiagram={changeToRelationalDiagram}>

                {diagramType === DiagramTypes.erDiagram ? <ErManager/> : <RelationalManager/>}

            </ContentManager>
        </div>
        </React.StrictMode>
    )
}

export default DatabaseModellingTool;
