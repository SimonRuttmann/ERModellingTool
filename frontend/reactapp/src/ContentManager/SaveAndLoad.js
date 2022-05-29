import React, {useEffect, useRef, useState} from "react";
import Download from "./Download";
import Upload from "./Upload";
import {DiagramTypes} from "../ERModell/Model/Diagram";
import axios from "axios";
import PrivacyPolicy from "./PrivacyPolicy";

export function SaveAndLoad({children, metaInformation, diagramType, changeToErDiagram, changeToRelationalDiagram}){

    const [currentDiagram, updateDiagram] = useState(DiagramTypes.erDiagram)
    const [loadProcessIsActive, setLoadProcessStatus] = useState(false)

    if(currentDiagram !== diagramType) {
        updateDiagram(diagramType)
        setLoadProcessStatus(true)
    }

    //We use useRef as "instance variable" (normally used for DOM Refs) https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables
    // avoid setting refs during rendering
    const erContent = useRef({...metaInformation, projectType: DiagramTypes.erDiagram, elements: [], connections: []})
    const relationalContent = useRef({...metaInformation, projectType: DiagramTypes.relationalDiagram, tables: []})


    function syncErContent(drawBoardElements, connections){

        if(loadProcessIsActive) return;

        erContent.current = {
            ...metaInformation,
            projectType: DiagramTypes.erDiagram,
            drawBoardContent: {elements: drawBoardElements, connections: connections}
        }
    }


    function syncRelContent(tables){

      //  if(loadProcessIsActive) return;

      //  relationalContent.current = {
      //      ...metaInformation,
      //      projectType: DiagramTypes.relationalDiagram,
      //      drawBoardContent: {tables: tables}
      //  }
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
        setLoadProcessStatus(false)
    }


    const url = "http://localhost:8080/convert/relational"
    const [serverResult, setServerResult] = useState(null)
    const [error, setError] = useState(false)


    function transformToRel(){
        let content = JSON.stringify(erContent.current);


        axios.post(url, erContent.current).
        then((response) => {

            setServerResult(response.data);
            console.log("Received")

        }).
        catch(error => setError(true));
    }

    useEffect( () => {

        console.log("Use effect of server result")
        console.log(serverResult)
        if(serverResult == null) return;

        changeToRelationalDiagram();

        setImportedContent(serverResult);
        relationalContent.current = serverResult;

        setServerResult(null);

    },[serverResult])


    const SaveAndLoadProps = {
        syncErContent: syncErContent,
        syncRelContent: syncRelContent,
        importedContent: importedContent,
        triggerImportComplete: triggerImportComplete,
        transformToRel: transformToRel
    }


    useEffect( () => {

        if(diagramType === DiagramTypes.erDiagram)  setImportedContent(erContent.current)
        if(diagramType === DiagramTypes.relationalDiagram) setImportedContent(relationalContent.current)

        setLoadProcessStatus(false)

    },[diagramType])


    const erTabActive = diagramType === DiagramTypes.erDiagram ? "TabsButtonActive" : "TabsButtonNotActive";
    const relationalTabActive = diagramType === DiagramTypes.relationalDiagram ? "TabsButtonActive" : "TabsButtonNotActive";

    let erTabStyle = `TabsButton ${erTabActive}`;
    let relationalTabStyle = `TabsButton ${relationalTabActive}`;

    return (
        <React.Fragment>

            <div className="Head">
                <button className={erTabStyle} onClick={changeToErDiagram}>Er Diagram</button>
                <button className={relationalTabStyle} onClick={changeToRelationalDiagram}>Relational Diagram</button>
                <PrivacyPolicy/>
                <Download erContent={erContent}/>
                <Upload importDrawBoardData={importDrawBoardData}/>
            </div>
            {React.cloneElement(children, { ...SaveAndLoadProps  })}
        </React.Fragment>
    )
}
export default SaveAndLoad;