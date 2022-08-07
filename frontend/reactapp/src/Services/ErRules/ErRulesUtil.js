import {ConnectionType} from "../DrawBoardModel/Diagram";
import {ERTYPE, ERTYPECATEGORY, returnNamesOfCategory} from "../DrawBoardModel/ErType";
import {resolveObjectById} from "../Common/ObjectUtil";


export const isAssociationConnectionType = (connectionType) => {
    return connectionType === ConnectionType.association;
}

export const isParentConnectionType = (connectionType) => {
    return connectionType === ConnectionType.parent;
}

export const isInheritorConnectionType = (connectionType) => {
    return connectionType === ConnectionType.inheritor;
}


/**
 * This method checks if there is already a connection between the two elements
 * @param element The element to check, if it is possible to be connected to
 * @param connections The connections on the draw board
 * @param selectedObject The selected object
 * @returns {boolean} True, if there is no line between selectedObject <-> element
 */
export const pathDoesNotAlreadyExist = (element, connections, selectedObject) => {

    //Check if path of type Element --> SelectedObject or SelectedObject <-- Element exist

    const samePathConnections  =
        connections.filter(connection => connectionSamePath(connection, element, selectedObject));

    return samePathConnections.length === 0
}

export const pathDoesMax2TimesExist = (element, connections, selectedObject) => {

    //Check if path of type Element --> SelectedObject or SelectedObject <-- Element exist

    const samePathConnections  =
        connections.filter(connection => connectionSamePath(connection, element, selectedObject));

    return samePathConnections.length < 2;
}


export const connectionSamePath = (connection, elementOne, elementTwo) => {

    const isSamePath =          (connection.start === elementOne.id && connection.end === elementTwo.id)
    const isSamePathReversed =  (connection.start === elementTwo.id && connection.end === elementOne.id)

    return isSamePath || isSamePathReversed;
}

export const ifDestinationAttributePathDoesNotExist = (element, connections, selectedObject) => {
    if(isElementOfCategoryAttribute(element))
        return pathDoesNotAlreadyExist(element, connections, selectedObject);

    return true;
}

export const ifDestinationIsaPathDoesNotExist = (element, connections, selectedObject) => {

    if(element.erType === ERTYPE.IsAStructure.name)
        return pathDoesNotAlreadyExist(element, connections, selectedObject);

    return true;
}


/**
 * Checks if a given elements erType is any kind of entity or relation
 * @param element The element to test
 * @returns {boolean} True if the element is of category entity or relation
 */
export const isElementOfCategoryEntityOrRelation = (element) => {
    const entityTypes = returnNamesOfCategory(ERTYPECATEGORY.Entity);
    const relationTypes = returnNamesOfCategory(ERTYPECATEGORY.Relation);

    const isEntityCategory = entityTypes.indexOf(element.erType) !== -1
    const isRelationCategory = relationTypes.indexOf(element.erType) !== -1

    return isEntityCategory || isRelationCategory;
}

export const isElementOfCategoryAttribute = (element) => {
    const attributeTypes = returnNamesOfCategory(ERTYPECATEGORY.Attribute);
    const isNoAttribute = attributeTypes.indexOf(element.erType) === -1;
    return !isNoAttribute;
}

export const getConnectorsOfObject = (element, connections) => {
    return connections.filter(connection => connection.end === element.id || connection.start === element.id)
}

/**
 * Returns all elements the connections are connected two,
 * except the one which is given
 * @param element The element to exclude from the result set
 * @param connections The connections to query for
 * @param drawBoardElements All elements on the draw board
 * @returns {*[]} A list of elements
 */
export const getOtherElementsOfConnectors = (element, connections, drawBoardElements) => {
    let otherElements = [];
    for (let connection of connections){
        if(connection.start === element.id) otherElements.push(resolveObjectById(connection.end, drawBoardElements))
        else otherElements.push(resolveObjectById(connection.start, drawBoardElements))
    }
    return otherElements;
}


export const collectionContainsStrongEntity = (collection) => {
    const entities = collection.filter(element => element.erType === ERTYPE.StrongEntity.name);
    return entities.length > 0;
}


export const collectElementsOfSubgraph = (element, connections, subgraphBounds, drawBoardElements) => {
    let collectedElements = [];
    collectElementsOfSubgraphRecursive(element, connections, collectedElements, subgraphBounds, drawBoardElements)
    return collectedElements;
}

const collectElementsOfSubgraphRecursive = (element, connections, collectedElements, subgraphBounds, drawBoardElements) => {

    //if already added stop execution
    if(! addIfNotExists(element, collectedElements)) return;

    const connectorsOfElement = getConnectorsOfObject(element, connections);
    const connectedElements = getOtherElementsOfConnectors(element, connectorsOfElement, drawBoardElements);

    const elementsInGraph = connectedElements.filter(connectedElement => subgraphBounds(connectedElement))

    for (let elementInGraph of elementsInGraph){
        collectElementsOfSubgraphRecursive(elementInGraph, connections, collectedElements, subgraphBounds, drawBoardElements)
    }

}

export const addIfNotExists = (element, collection) => {
    if(collection.indexOf(element) !== -1) return false;
    collection.push(element)
    return true;
}



export const addAllIfNotExists = (elements, collection) => {
    for (let element of elements){
        if(collection.indexOf(element) === -1)
        collection.push(element)
    }
}

export const collectionContains = (collection, element) => {
    return collection.indexOf(element) !== -1;
}


