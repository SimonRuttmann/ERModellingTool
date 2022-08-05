import React, {useEffect, useState} from "react";
import Download from "./Download";
import Upload from "./Upload";
import {DiagramTypes} from "../ERModell/Model/Diagram";
import axios from "axios";
import PrivacyPolicy from "./PrivacyPolicy";
import {useDispatch, useSelector} from "react-redux";
import {ImportErContent, selectErContentSlice} from "../store/ErContentSlice";
import {ImportRelContent, selectRelationalContentSlice} from "../store/RelationalContentSlice";

export function SaveAndLoad({children, metaInformation, diagramType, changeToErDiagram, changeToRelationalDiagram}){

    const erContentStore = useSelector(selectErContentSlice);
    const erContentStoreAccess = useDispatch();

    const relationalContentStore = useSelector(selectRelationalContentSlice);
    const relationalContentStoreAccess = useDispatch();

    const [currentDiagram, updateDiagram] = useState(DiagramTypes.erDiagram)


    useEffect( () => {
        if(currentDiagram !== diagramType) updateDiagram(diagramType)
    },[diagramType])


    //Download
    function createDownloadPackage(){

        let downloadPackage = {erContent: erContentStore, relContent: relationalContentStore}

        return JSON.stringify(downloadPackage, null, 2);
    }


    //Upload
    function importDrawBoardData(importedContent){

        let importedJson = JSON.parse(importedContent)

        relationalContentStoreAccess(ImportRelContent(importedJson.relationalContent))
        erContentStoreAccess(ImportErContent(importedJson.erContent))
    }


    const url = "http://localhost:8080/convert/relational"
    const [relationalEndpointError, setRelationalEndpointError] = useState(false)

    function transformToRel(){
        let contentToSend = {...erContentStore, ...metaInformation};

        axios.post(url, contentToSend).
        then((response) => {
            erContentStoreAccess(ImportRelContent(response.data))
        }).
        catch(error => setRelationalEndpointError(error));
    }



    const urlSql = "http://localhost:8080/convert/sql"
    const [sqlServerResult, setSqlSeverResult] = useState(null)
    const [sqlEndpointError, setSqlEndpointError] = useState(null)

    function generateSql(dto){

        axios.post(urlSql, dto).
            then((response) => {
                setSqlSeverResult(response.data);
            }).
            catch(error => setSqlEndpointError(error));
    }

    //Those properties are used, it is an ide fault
    const SaveAndLoadProps = {
        transformToRel: transformToRel,
        generateSql:generateSql,
        sqlServerResult: sqlServerResult
    }

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
                <Download createDownloadPackage={createDownloadPackage}/>
                <Upload importDrawBoardData={importDrawBoardData}/>
            </div>
            {React.cloneElement(children, { ...SaveAndLoadProps  })}
        </React.Fragment>
    )
}
export default SaveAndLoad;