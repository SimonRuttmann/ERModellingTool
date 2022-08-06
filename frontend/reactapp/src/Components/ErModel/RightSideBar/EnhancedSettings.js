import {resolveObjectById} from "../../../Services/Common/ObjectUtil";
import {ERTYPE} from "../../../Services/DrawBoardModel/ErType";
import {getOtherElementsOfConnectors} from "../../../Services/ErRules/ErRulesUtil";
import React from "react";

/**
 * Component which extends the relational with the owning side element if certain conditions are met
 * @param selectedObject The selected object
 * @param drawBoardElements The element in the drawBoard
 * @param connections The connection in the drawBoard
 * @param setOwningSideProperty A function to set the owning side property for a relation
 */
const EnhancedSettings = ({selectedObject, drawBoardElements, connections, setOwningSideProperty}) => {

    const setOwningSide = (e) => {
        setOwningSideProperty(selectedObject.id, e.target.value)
    }

    /**
     * Sorting of connections, so they will always be displayed in the same order
     */

    function filterAndSortConnections(){
        return connections.filter(connection =>
            connection.end === selectedObject.id ||
            connection.start === selectedObject.id)
            .sort((a,b) => {
                return a.id<b.id?-1:1
            });

    }

    /**
     * Utils to check a connection for a specific condition
     */

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

    /**
     * Check if the connection is from a strong relation to two different strong entities,
     * where both cardinalities are (0,1):(0,1) or (1,1):(1,1)
     */


    const cons = filterAndSortConnections();
    const connectionsToStrongEntities = cons.filter(connection => isConnectedToStrongEntity(connection));
    const connectedStrongEntities = getOtherElementsOfConnectors(selectedObject, connectionsToStrongEntities, drawBoardElements);

    const connectedElements = getOtherElementsOfConnectors(selectedObject, cons, drawBoardElements);
    const connectedWeakEntities = connectedElements.filter(element => element.erType === ERTYPE.WeakEntity.name)


    let showOwningSide = false;
    let owningSideDisplay = null;

    if(connectedStrongEntities.length !== 2 || connectedWeakEntities.length !== 0) return null

    if(connectionsToStrongEntities.every(connection => isOneToOne(connection))){
        showOwningSide = true;
    }
    else if(connectionsToStrongEntities.every(connection => isZeroOneToZeroOne(connection))){
        showOwningSide = true;
    }
    else return null;


    let firstEntityDisplayName = connectedStrongEntities[0].displayName;
    let firstEntityId = connectedStrongEntities[0].id;

    let secondEntityDisplayName = connectedStrongEntities[1].displayName;
    let secondEntityId = connectedStrongEntities[1].id;

    //If both entities are the same, we have a reflexive relation and can not set an owning side
    if(firstEntityId === secondEntityId) return null;

    /**
     * Check if owning Side conditions are met, if so render a selector
     */

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

    return (
        <React.Fragment>
            {owningSideDisplay}
        </React.Fragment>
    )

}

export default EnhancedSettings;