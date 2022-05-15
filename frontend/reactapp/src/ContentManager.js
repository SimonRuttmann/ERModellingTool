
import './App.css';
import PlayGround from './ERModell/Playground';
import {useRef, useState} from "react";
import downloadIcon from './Resources/cloud-download.svg'
import uploadIcon from './Resources/cloud-upload.svg'
import React from "react";

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

export function Download({erContent}){

    function createDownloadPackage(){
        console.log(erContent.current)
        console.log("create download package based on : " + erContent.current)
        return JSON.stringify(erContent.current, null, 2);
    }

    function download(){
        //Receive and transform current sate
        const json = createDownloadPackage();
        const blob = new Blob([json],{type:'application/json'});
        const objectUrl = URL.createObjectURL(blob);

        //Create temporary link, append download flag and trigger click event
        const link = document.createElement("a");

        link.href = objectUrl;
        link.download = "erDiagram.json";
        document.body.appendChild(link);

        //Execute download
        link.click();

        document.body.removeChild(link);

    }
//     <button onClick={download} className="downloadButton">Download</button>
    return (
        <React.Fragment>
            <img src={downloadIcon} className="downloadButton" onClick={download}  alt="Download"/>
        </React.Fragment>
    );
}

export function Upload({ importDrawBoardData }) {

    const handleChange = e => {
        console.log("reading")
        const fileReader = new FileReader();
        fileReader.readAsText(e.target.files[0], "UTF-8");
        fileReader.onload = e => {
            console.log("e.target.result dddd" + e.target.result);
            importDrawBoardData(e.target.result);
            //setFiles(e.target.result);
        };

    };

    const resetValue = (event) => {
        event.target.value = ''
    }


    return (
        <React.Fragment>
            <label htmlFor="file-upload">
                <img src={uploadIcon} className="uploadButton" alt="Upload"/>
            </label>
            <input id="file-upload" type="file" onChange={handleChange} onClick={resetValue} className="uploadButton"/>
        </React.Fragment>
    );
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

