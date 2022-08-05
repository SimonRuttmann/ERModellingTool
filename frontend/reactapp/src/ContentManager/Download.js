import React from "react";
import downloadIcon from "../Resources/cloud-download.svg";

export function Download({createDownloadPackage}){

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

    return (
        <React.Fragment>
            <img src={downloadIcon} className="downloadButton" onClick={download}  alt="Download"/>
        </React.Fragment>
    );
}

export default Download;