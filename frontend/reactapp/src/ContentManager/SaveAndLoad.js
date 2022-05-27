import React, {useEffect, useRef, useState} from "react";
import Download from "./Download";
import Upload from "./Upload";
import {diagramTypes} from "../ERModell/Model/Diagram";
import axios from "axios";
import privacyPolicyIcon from "../Resources/Datenschutzerklärung/shield-exclamation.svg";
import downloadIcon from "../Resources/cloud-download.svg";
import PrivacyPolicy from "./PrivacyPolicy";

export function SaveAndLoad({children, metaInformation, diagramType, changeToErDiagram, changeToRelationalDiagram}){

    const [currentDiagram, updateDiagram] = useState(diagramTypes.erDiagram)
    const [loadProcessIsActive, setLoadProcessStatus] = useState(false)

    if(currentDiagram !== diagramType) {
        updateDiagram(diagramType)
        setLoadProcessStatus(true)
    }

    //We use useRef as "instance variable" (normally used for DOM Refs) https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables
    // avoid setting refs during rendering
    const erContent = useRef({...metaInformation, projectType: diagramTypes.erDiagram, elements: [], connections: []})
    const relationalContent = useRef({...metaInformation, projectType: diagramTypes.relationalDiagram, elements: [], connections: []})


    function syncErContent(drawBoardElements, connections){

        if(loadProcessIsActive) return;

        erContent.current = {
            ...metaInformation,
            projectType: diagramTypes.erDiagram,
            drawBoardContent: {elements: drawBoardElements, connections: connections}
        }
    }


    function syncRelContent(drawBoardElements, connections){

        if(loadProcessIsActive) return;

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
        setLoadProcessStatus(false)
    }

    const url = "http://localhost:8080/convert/relational"
    const [serverResult, setServerResult] = useState({})
    const [error, setError] = useState(false)

    function transformToRel(){
        let content = JSON.stringify(erContent.current);
        console.log("Call to backend")
        console.log(url)
        console.log(content)
      //  axios.get("http://localhost:8080/test").then((response) => console.log(response));
       // axios.get("https://jsonplaceholder.typicode.com/users").then((response) => console.log(response));

        axios.post(url, erContent.current).
        then((response) => {setServerResult(response.data);}).
        catch(error => setError(true));
    }

    const SaveAndLoadProps = {
        syncErContent: syncErContent,
        syncRelContent: syncRelContent,
        importedContent: importedContent,
        triggerImportComplete: triggerImportComplete,
        transformToRel: transformToRel
    }


    useEffect( () => {

        if(diagramType === diagramTypes.erDiagram)  setImportedContent(erContent.current)
        if(diagramType === diagramTypes.relationalDiagram) setImportedContent(relationalContent.current)

        setLoadProcessStatus(false)

    },[diagramType])


    const erTabActive = diagramType === diagramTypes.erDiagram ? "TabsButtonActive" : "TabsButtonNotActive";
    const relationalTabActive = diagramType === diagramTypes.relationalDiagram ? "TabsButtonActive" : "TabsButtonNotActive";

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