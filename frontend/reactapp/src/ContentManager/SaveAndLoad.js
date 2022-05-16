import React, {useRef, useState} from "react";
import Download from "./Download";
import Upload from "./Upload";

export function SaveAndLoad({children, metaInformation}){

    const erContent = useRef({...metaInformation, elements: [], connections: []})

    function syncContent(drawBoardElements, connections){
        erContent.current = {
            ...metaInformation,
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
        syncContent: syncContent,
        importedContent: importedContent,
        triggerImportComplete: triggerImportComplete
    }
//TODO! buttons gehören hier nicht hin! Injezieren oder Komponente refactorn
    return (
        <React.Fragment>

            <div className="Head">
                <button className="TabsButton TabsButtonActive">Er Diagram</button>
                <button className="TabsButton TabsButtonNotActive">Relational Diagram</button>

                <Download erContent={erContent}/>
                <Upload importDrawBoardData={importDrawBoardData}/>
            </div>
            {React.cloneElement(children, { ...SaveAndLoadProps  })}
        </React.Fragment>
    )
}
export default SaveAndLoad;