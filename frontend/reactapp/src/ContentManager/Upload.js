import React from "react";
import uploadIcon from "../Resources/cloud-upload.svg";

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

export default Upload;