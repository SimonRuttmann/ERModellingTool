import React, {useEffect, useState} from "react";
import {DiagramTypes} from "../../Services/DrawBoardModel/Diagram";
import axios from "axios";
import Download from "./Download";
import Upload from "./Upload";
import PrivacyPolicy from "./PrivacyPolicy";
import {useDispatch, useSelector} from "react-redux";
import {ImportErContent, selectErContentSlice} from "../../ReduxStore/ErContentSlice";
import {ImportRelContent, selectRelationalContentSlice} from "../../ReduxStore/RelationalContentSlice";

/**
 * Renders the tab bar within its children.
 * Handles all server calls and file uploads /downloads
 *
 * @param children                      An arbitrary number of children, representing diagrams, to render
 * @param metaInformation               Additional meta information added to each request and file download
 * @param diagramType                   The currently displayed diagram type
 * @param changeToErDiagram             Function to execute when changing to the Er diagram tab
 * @param changeToRelationalDiagram     Function to execute when changing to the relational diagram tab
 */
export function ContentManager({children, metaInformation, diagramType, changeToErDiagram, changeToRelationalDiagram}){

    let baseUrl;
    if(process.env.NODE_ENV !== "development") baseUrl = process.env.REACT_APP_BACKEND_BASEURL_PRODUCTION;
    else baseUrl = process.env.REACT_APP_BACKEND_BASEURL_DEVELOPMENT;

    const erContentStore = useSelector(selectErContentSlice);
    const erContentStoreAccess = useDispatch();

    const relationalContentStore = useSelector(selectRelationalContentSlice);
    const relationalContentStoreAccess = useDispatch();

    const [currentDiagram, updateDiagram] = useState(DiagramTypes.erDiagram)

    const [importExecuted, setImportExecuted] = useState(false);
    const triggerImportComplete = () => {setImportExecuted(false)}

    useEffect( () => {
        if(currentDiagram !== diagramType) updateDiagram(diagramType)
    },[diagramType])


    // ----------------------------------------- Upload and Download of Json-Files -----------------------------------//
    /**
     * Creates a download package containing meta-information,
     * Er model information and relational model information
     *
     * When the user downloads the diagram he receives this package
     * Therefore any change must ensure that old files can still be imported
     *
     * To handle multiple versions the meta-information property "projectVersion" can be used
     * @returns {string}
     */
    function createDownloadPackage(){

        let downloadPackage = {
            ...metaInformation,
            erContent:  {
                drawBoardContent: {drawBoardElements: erContentStore.drawBoardElements, connections: erContentStore.connections}},
            relContent: {
                drawBoardContent: {tables: relationalContentStore.drawBoardElements, connections: relationalContentStore.connections}}
        }

        return JSON.stringify(downloadPackage, null, 2);
    }


    //Upload
    function importDrawBoardData(importedContent){

        let importedJson = JSON.parse(importedContent)

        relationalContentStoreAccess(ImportRelContent(importedJson.relContent))
        erContentStoreAccess(ImportErContent(importedJson.erContent))
        setImportExecuted(true)
    }

    // ----------------------------------------- Relational and Sql endpoint calls -----------------------------------//


    const url = baseUrl + "/convert/relational"
    // noinspection JSUnusedLocalSymbols, Justification, no enhanced error handling implemented
    const [relationalEndpointError, setRelationalEndpointError] = useState(false)

    function transformToRel(){

        let contentToSend = {
            ...metaInformation,
            drawBoardContent: {
                elements: erContentStore.drawBoardElements,
                connections: erContentStore.connections
            }};

        axios.post(url, contentToSend).
        then((response) => {
            relationalContentStoreAccess(ImportRelContent(response.data));
            changeToRelationalDiagram();
        }).
        catch(error => setRelationalEndpointError(error));
    }


    const urlSql = baseUrl + "/convert/sql"
    const [sqlServerResult, setSqlSeverResult] = useState(null)
    // noinspection JSUnusedLocalSymbols, Justification, no enhanced error handling implemented
    const [sqlEndpointError, setSqlEndpointError] = useState(null)

    function generateSql(dto){

        axios.post(urlSql, dto).
            then((response) => {
                setSqlSeverResult(response.data);
            }).
            catch(error => setSqlEndpointError(error));
    }

    //noinspection JSUnusedGlobalSymbols, Justification properties are used in Er and relational manager
    const SaveAndLoadProps = {
        transformToRel: transformToRel,
        generateSql:generateSql,
        sqlServerResult: sqlServerResult,
        importExecuted: importExecuted,
        triggerImportComplete: triggerImportComplete
    }

    // --------------------------------------------------- TabBar ----------------------------------------------------//

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
export default ContentManager;