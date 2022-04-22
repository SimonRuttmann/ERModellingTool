
import './App.css';
import PlayGround from './ERModell/Playground';
import {useState} from "react";
import React from "react";

function App() {

    function sendDrawBoardData(jsonDrawBoardElements, jsonConnections){
        setJson(() => ({

                projectversion: 1.0,
                projectname: "notNamed",
                type: "erDiagram",
                drawBoardContent: {elements: jsonDrawBoardElements, connections: jsonConnections}

        }))
    }

    function importDrawBoardData(importedContent){
        console.log("parsing...")
        let importedJson = JSON.parse(importedContent)
        console.log("parsed")
        setImportedContent(importedJson)
    }

    const [importedContent, setImportedContent] = useState({})


    const [json, setJson] = useState({projectversion: 1.0, projectname: "notNamed"});

  return (
    <div className="App">
        <a href={`data:text/json;charset=utf8,${encodeURIComponent(JSON.stringify(json, null, 2))}`} download="filename.json">Download Json</a>
        <Upload importDrawBoardData={importDrawBoardData}/>
      <PlayGround sendDrawBoardData={sendDrawBoardData} importedContent = {importedContent}/>
    </div>
  )
}


export function Upload({ children, importDrawBoardData }) {
    const [files, setFiles] = useState("");

    const handleChange = e => {
        const fileReader = new FileReader();
        fileReader.readAsText(e.target.files[0], "UTF-8");
        fileReader.onload = e => {
            console.log("e.target.result dddd" + e.target.result);
            setFiles(e.target.result);
        };

    };
    return (
        <React.Fragment>
            <h1>Upload Json file - Example</h1>

            <input type="file" onChange={handleChange} />
            <br />
            {"uploaded file content -- " + files}
            <button onClick={e => importDrawBoardData(files) }>click after upload</button>
        </React.Fragment>
    );
}
export default App;
