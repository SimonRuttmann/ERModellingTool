import {resolveObjectById} from "../Util/ObjectUtil";
import {ERTYPE} from "../../Model/ErType";
import {getOtherElementsOfConnectors} from "../../ErRules/ErRulesUtil";
import React, {useEffect, useRef} from "react";

const EnhancedSettings = ({selectedObject, drawBoardElements, connections, setMergeProperty, setOwningSideProperty}) => {

    /**
     * Warning: Cannot update a component (`PlayGround`) while rendering a different component (`EnhancedSettings`). To locate the bad setState() call inside `EnhancedSettings`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render
     *     at EnhancedSettings (http://localhost:3000/main.44775bf3e35a23b96498.hot-update.js:35:5)
     *     at div
     *     at RightBar (http://localhost:3000/static/js/bundle.js:6417:5)
     *     at div
     *     at div
     *     at PlayGround (http://localhost:3000/static/js/bundle.js:9105:5)
     *     at SaveAndLoad (http://localhost:3000/static/js/bundle.js:2754:5)
     *     at div
     *     at ContentManager (http://localhost:3000/static/js/bundle.js:1560:88)
     *     at div
     *     at App
     *
     *
     *
     * overrideMethod    @    react_devtools_backend.js:4026
     * printWarning    @    react-dom.development.js:67
     * error    @    react-dom.development.js:43
     * warnAboutRenderPhaseUpdatesInDEV    @    react-dom.development.js:24002
     * scheduleUpdateOnFiber    @    react-dom.development.js:21836
     * dispatchAction    @    react-dom.development.js:16139
     * setOwningSideProperty    @    Playground.js:477
     * setDefaultOwningSide    @    EnhancedSettings.js:19
     * EnhancedSettings    @    EnhancedSettings.js:120
     * renderWithHooks    @    react-dom.development.js:14985
     * mountIndeterminateComponent    @    react-dom.development.js:17811
     */

    const mergeBoxRef = useRef(null);


    const setMerge = () => {
        setMergeProperty(selectedObject.id, mergeBoxRef.current.checked)
    }

    const setDefaultOwningSide = (defaultOwningSideId) => {

        if(selectedObject.owningSide === defaultOwningSideId) return;

        setOwningSideProperty(selectedObject.id, defaultOwningSideId)
    }

    const setOwningSide = (e) => {
        setOwningSideProperty(selectedObject.id, e.target.value)
    }

    //TODO Duplicate
    function filterAndSortConnections(){
        return connections.filter(connection =>
            connection.end === selectedObject.id ||
            connection.start === selectedObject.id)
            .sort((a,b) => {
                return a.id<b.id?-1:1
            });

    }

    const isOneToOne = (connection) => {

        const firstIsOne =  String(connection.min).trim().toUpperCase().valueOf() === "1"
        const secondIsOne = String(connection.max).trim().toUpperCase().valueOf() === "1"
        return firstIsOne && secondIsOne;
    }

    const isZeroOneToZeroOne = (connection) => {
        const firstIsZero =  String(connection.min).trim().toUpperCase().valueOf() === "0"
        const secondIsOne = String(connection.max).trim().toUpperCase().valueOf() === "1"
        return firstIsZero && secondIsOne;
    }

    const isConnectedToStrongEntity = (connection) => {
        let otherElement;

        if(connection.start === selectedObject.id) otherElement = resolveObjectById(connection.end, drawBoardElements)
        else otherElement = resolveObjectById(connection.start, drawBoardElements)

        return otherElement.erType === ERTYPE.StrongEntity.name;
    }


    const cons = filterAndSortConnections();
    const connectionsToStrongEntities = cons.filter(connection => isConnectedToStrongEntity(connection));
    const connectedStrongEntities = getOtherElementsOfConnectors(selectedObject, connectionsToStrongEntities, drawBoardElements);

    const connectedElements = getOtherElementsOfConnectors(selectedObject, cons, drawBoardElements);
    const connectedWeakEntities = connectedElements.filter(element => element.erType === ERTYPE.WeakEntity.name)


    let showOwningSide = false;
    let owningSideDisplay = null;

    let showMerge = false;
    let mergeDisplay = null;

    if(connectedStrongEntities.length !== 2 || connectedWeakEntities.length !== 0) return null


    if(connectionsToStrongEntities.every(connection => isOneToOne(connection))){
        showOwningSide = true;
        showMerge = true;
    }
    else if(connectionsToStrongEntities.every(connection => isZeroOneToZeroOne(connection))){

        showOwningSide = true;
    }
    else return null;


    let firstEntityDisplayName = connectedStrongEntities[0].displayName;
    let firstEntityId = connectedStrongEntities[0].id;

    let secondEntityDisplayName = connectedStrongEntities[1].displayName;
    let secondEntityId = connectedStrongEntities[1].id;

    //If both entities are the same, we have a reflexive relation and can not merge or set an owning side
    if(firstEntityId === secondEntityId) return null;

    if(showOwningSide){

        let selectFirst = selectedObject.owningSide === firstEntityId;
        let selectSecond = selectedObject.owningSide === secondEntityId;
        let selectNone = "Not specified";

        let defaultValue;

        if(selectFirst)       defaultValue = firstEntityId;
        else if(selectSecond) defaultValue = secondEntityId;
        else                  defaultValue = selectNone;


        owningSideDisplay =

            <React.Fragment>

                <div>Owning side: </div>
                <div className="spacerSmall"/>

                <select className="select" defaultValue={defaultValue} onChange={setOwningSide}>
                    <option className="select-items" value={selectNone}     disabled={true} >Not specified</option>
                    <option className="select-items" value={firstEntityId}                  >{firstEntityDisplayName}</option>
                    <option className="select-items" value={secondEntityId}                 >{secondEntityDisplayName}</option>
                </select>

                <div className="spacerSmall"/>

            </React.Fragment>
    }

    if(showMerge){

        mergeDisplay =

            <React.Fragment>

                <div>Merge Entities: </div>

                <div className="spacerSmall"/>

                <label className="mergeCheckBoxSwitch">
                    <input type="checkbox" ref={mergeBoxRef} onClick={setMerge} defaultChecked={selectedObject.isMerging}/>
                    <span className="mergeCheckBoxSlider mergeCheckBoxSliderContent"></span>
                </label>

                <div className="spacerSmall"/>

            </React.Fragment>

    }



    return (
        <React.Fragment>
            {mergeDisplay}
            {owningSideDisplay}
        </React.Fragment>
    )

}

export default EnhancedSettings;