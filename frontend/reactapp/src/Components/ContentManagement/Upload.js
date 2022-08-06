import React from "react";
import uploadIcon from "../../Resources/Icons/cloud-upload.svg";

/**
 * Renders the upload icon and handles the input and parsing of a json file
 * @param importDrawBoardData A function to call, when the file is selected and the content is parsed
 */
export function Upload({ importDrawBoardData }) {

    const handleChange = e => {
        const fileReader = new FileReader();
        fileReader.readAsText(e.target.files[0], "UTF-8");
        fileReader.onload = e => {
            importDrawBoardData(e.target.result);
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