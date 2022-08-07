import {ERTYPE} from "../DrawBoardModel/ErType";
import {connectionSamePath, getConnectorsOfObject, getOtherElementsOfConnectors} from "./ErRulesUtil";


/**
 * Checks that a connection from weak relation to an entity will result only in a degree of 2 for the weak relation (attributes not counted)
 */
const checkWeakRelationHasOnly2Entities = (element, connections, selectedObject, drawBoardElements) => {

    //Rule applies only if element to connect is of type StrongEntity or WeakEntity
    if( element.erType !== ERTYPE.StrongEntity.name && element.erType !== ERTYPE.WeakEntity.name) return true;

    const connectionsToElement = getConnectorsOfObject(selectedObject, connections);
    const connectedElements = getOtherElementsOfConnectors(selectedObject, connectionsToElement, drawBoardElements)
    const entities = connectedElements.filter(connectedElement => connectedElement.erType === ERTYPE.StrongEntity.name || connectedElement.erType === ERTYPE.WeakEntity.name)

    return entities.length < 2;

}

/**
 * Checks that a connection to a weak relation will result only in degree of 2 (attributes not counted)
 */
const checkIfToWeakRelationItOnlyHasDeg2 = (element, connections, selectedObject, drawBoardElements) => {

    //Rule applies only if element to connect is of type Weak relation and
    // the selected Objects is of type StrongEntity or WeakEntity
    if( selectedObject.erType !== ERTYPE.StrongEntity.name && selectedObject.erType !== ERTYPE.WeakEntity.name) return true;
    if( element.erType !== ERTYPE.WeakRelation.name) return true;

    const connectionsToElement = getConnectorsOfObject(element, connections);
    const connectedElements = getOtherElementsOfConnectors(element, connectionsToElement, drawBoardElements)
    const entities = connectedElements.filter(connectedElement => connectedElement.erType === ERTYPE.StrongEntity.name || connectedElement.erType === ERTYPE.WeakEntity.name)
    return entities.length < 2;

}


const pathWeakRelToWeakEntityDoesMax1TimesExist = (element, connections, selectedObject) => {

    //Check if path of type Element --> SelectedObject or SelectedObject <-- Element exist

    const samePathConnections  =
        connections.filter(connection => connectionSamePath(connection, element, selectedObject));

    if(element.erType === ERTYPE.WeakEntity.name)
        return samePathConnections.length < 1;

    return samePathConnections.length < 2;
}

const WeakTypeRules = {
    checkIfToWeakRelationItOnlyHasDeg2: checkIfToWeakRelationItOnlyHasDeg2,
    checkWeakRelationHasOnly2Entities: checkWeakRelationHasOnly2Entities,
    pathWeakRelToWeakEntityDoesMax1TimesExist:pathWeakRelToWeakEntityDoesMax1TimesExist
}

export default WeakTypeRules;