
import '../App.css';
import PlayGround from '../ERModell/Playground';
import {useRef, useState} from "react";
import React from "react";
import Download from "./Download";
import Upload from "./Upload";

function ContentManager() {

    //We use useRef as "instance variable" (normally used for DOM Refs) https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables
    // avoid setting refs during rendering

    const projectType = "erDiagram";
    const projectVersion = 1.0;
    const projectName = "notNamed";

    const metaInformation = {
        projectVersion: projectVersion,
        projectName: projectName,
        projectType: projectType
    }

    return (
        <div className="App">
            <SaveAndLoad metaInforamtion={metaInformation}>
                <PlayGround/>
            </SaveAndLoad>
        </div>
    )
}

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

    return (
        <React.Fragment>

        <div className="Head">
            <Download erContent={erContent}/>
            <Upload importDrawBoardData={importDrawBoardData}/>
        </div>
            {React.cloneElement(children, { ...SaveAndLoadProps  })}
        </React.Fragment>
    )
}


export default ContentManager;

/*
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

