import React, {useRef, useState} from "react";
import Download from "./Download";
import Upload from "./Upload";
import {diagramTypes} from "../ERModell/Model/Diagram";

export function SaveAndLoad({children, metaInformation, diagramType, changeToErDiagram, changeToRelationalDiagram}){

    //We use useRef as "instance variable" (normally used for DOM Refs) https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables
    // avoid setting refs during rendering
    const erContent = useRef({...metaInformation, projectType: diagramTypes.erDiagram, elements: [], connections: []})
    const relationalContent = useRef({...metaInformation, projectType: diagramTypes.relationalDiagram, elements: [], connections: []})

    function syncErContent(drawBoardElements, connections){
        erContent.current = {
            ...metaInformation,
            projectType: diagramTypes.erDiagram,
            drawBoardContent: {elements: drawBoardElements, connections: connections}
        }
    }

    function syncRelContent(drawBoardElements, connections){
        relationalContent.current = {
            ...metaInformation,
            projectType: diagramTypes.relationalDiagram,
            drawBoardContent: {elements: drawBoardElements, connections: connections}
        }
    }

    /**
     * Upload logic
     */

        //Import project
    const [importedContent, setImportedContent] = useState({})

    function importDrawBoardData(importedContent){
        console.log("parsing...")
        let importedJson = JSON.parse(importedContent)
        console.log("parsed")
        console.log(importedJson)
        setImportedContent(importedJson)
    }

    function triggerImportComplete(){
        setImportedContent(null);
    }


    const SaveAndLoadProps = {
        syncErContent: syncErContent,
        syncRelContent: syncRelContent,
        importedContent: importedContent,
        triggerImportComplete: triggerImportComplete
    }

    const erTabActive = diagramType === diagramTypes.erDiagram ? "TabsButtonActive" : "TabsButtonNotActive";
    const relationalTabActive = diagramType === diagramTypes.relationalDiagram ? "TabsButtonActive" : "TabsButtonNotActive";

    let erTabStyle = `TabsButton ${erTabActive}`;
    let relationalTabStyle = `TabsButton ${relationalTabActive}`;

    return (
        <React.Fragment>

            <div className="Head">
                <button className={erTabStyle} onClick={changeToErDiagram}>Er Diagram</button>
                <button className={relationalTabStyle} onClick={changeToRelationalDiagram}>Relational Diagram</button>

                <Download erContent={erContent}/>
                <Upload importDrawBoardData={importDrawBoardData}/>
            </div>
            {React.cloneElement(children, { ...SaveAndLoadProps  })}
        </React.Fragment>
    )
}
export default SaveAndLoad;