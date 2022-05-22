import {ConnectionType} from "../Model/Diagram";
import {ERTYPE, ERTYPECATEGORY, returnNamesOfCategory} from "../Model/ErType";
import {resolveObjectById} from "../Components/Util/ObjectUtil";


export const isAssociationConnectionType = (connectionType) => {
    return connectionType === ConnectionType.association;
}

export const isParentConnectionType = (connectionType) => {
    return connectionType === ConnectionType.parent;
}

export const isInheritorConnectionType = (connectionType) => {
    return connectionType === ConnectionType.inheritor;
}
//Tested from iden -> rest
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

const connectionSamePath = (connection, elementOne, elementTwo) => {

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
 * An attribute is only allowed to connect to another relation or entity
 * if it has no current connection to an entity or relation
 *
 * This method returns false, if the given element is of type relation or entity and
 * the selectedObject (type attribute) has a direct connection to an entity or relation
 *
 * @param element The element to apply the rule to
 * @param connections All connections on the draw board
 * @param selectedObject The selected Object
 * @param drawBoardElements All elements on the draw board
 * @returns {boolean} True, if rules succeeds
 */
export const onlyAllowConnectToRelationOrEntityIfNoCurrentEntityOrRelationConnection = (element, connections, selectedObject, drawBoardElements) => {

    //Rule only applies, when the other element is of type entity or relation
    if(! isElementOfCategoryEntityOrRelation(element)) return true;

    console.log("element is fo type entity or relation")
    console.log(element)
    const possibleRoot = resolveRootElementOfAttribute(selectedObject, connections, drawBoardElements)

    if(possibleRoot == null) return true;

    //The selected object (as attribute) has already a root
    //If it is another, the attribute would connect two roots, if it is the same, then we would create a duplicate connection
    //in any case, we are not allowed to connect these attributes
    return false;

    /*
    //Destination is of type Entity or Relation
    const connectorsOfSelectedObject =
        connections.filter(connection => connection.end === selectedObject.id || connection.start === selectedObject.id)

    if(connectorsOfSelectedObject.length === 0) return true;

    connectorsOfSelectedObject.forEach( connection => {
        let otherObject;

        if(connection.start === selectedObject.id) otherObject = resolveObjectById(connection.end)
        else otherObject = resolveObjectById(connection.start)

        if(isElementOfCategoryEntityOrRelation(otherObject)) return false;
    })

    return true;
    */

}
//TESTED
/**
 * Checks if a given elements erType is any kind of entity or relation
 * @param element The element to test
 * @returns {boolean} True if the element is of category entity or relation
 */
const isElementOfCategoryEntityOrRelation = (element) => {
    const entityTypes = returnNamesOfCategory(ERTYPECATEGORY.Entity);
    const relationTypes = returnNamesOfCategory(ERTYPECATEGORY.Relation);

    const isEntityCategory = entityTypes.indexOf(element.erType) !== -1
    const isRelationCategory = relationTypes.indexOf(element.erType) !== -1

    return isEntityCategory || isRelationCategory;
}

const isElementOfCategoryAttribute = (element) => {
    const attributeTypes = returnNamesOfCategory(ERTYPECATEGORY.Attribute);
    const isNoAttribute = attributeTypes.indexOf(element.erType) === -1;
    return !isNoAttribute;
}

/**
 * Filters all elements based on the given rules as callback functions
 * @param elements The elements to apply the rule to
 * @param connections All connections which already persist
 * @param selectedObject The origin object
 * @param rules Callback functions which define specific rules every element has to pass
 *              Those callback functions will be executed with each element, the provided connections and the selectedObject
 * @returns {*} All elements, which pass all rules
 */
export const applyRules = (elements, connections, selectedObject, ...rules) => {

    let currentlyPassedElements = [];
    currentlyPassedElements.push(...elements);
    currentlyPassedElements = currentlyPassedElements.filter(element => element.id !== selectedObject.id);

    for (let rule of rules){

        //Filter elements based on rule
        currentlyPassedElements = currentlyPassedElements.filter(
            element => {
                return rule(element, connections, selectedObject, elements);
            })

    }

    //All elements which passed all rules
    return currentlyPassedElements;
}

//Tested
const getConnectorsOfObject = (element, connections) => {
    return connections.filter(connection => connection.end === element.id || connection.start === element.id)
}

//TEsted
/**
 * Returns all elements the connections are connected two,
 * except the one which is given
 * @param element The element to exclude from the result set
 * @param connections The connections to query for
 * @param drawBoardElements All elements on the draw board
 * @returns {*[]} A list of elements
 */
const getOtherElementsOfConnectors = (element, connections, drawBoardElements) => {
    let otherElements = [];
    for (let connection of connections){
        if(connection.start === element.id) otherElements.push(resolveObjectById(connection.end, drawBoardElements))
        else otherElements.push(resolveObjectById(connection.start, drawBoardElements))
    }
    return otherElements;
}

//null oder element des roots
//Tested
/**
 * Resolves the root element
 * @param element
 * @param connections
 * @param drawBoardElements
 * @returns {*}
 */
const resolveRootElementOfAttribute = (element, connections, drawBoardElements) => {
    console.log("resolve root element of attribute")
    let checkedElements = []
    return resolveRootElementOfAttributeRecursive(element, connections, drawBoardElements, checkedElements)
}

//TODO while testing check if any circles are possible
//TODO THIS IS IMPORTANT to prevent infinite loops
const resolveRootElementOfAttributeRecursive = (element, connections, drawBoardElements, checkedElements) => {

    //if element is already checked, terminate
    if(!addIfNotExists(element, checkedElements)) return;

    //If element is already entity or relation terminate
    if(isElementOfCategoryEntityOrRelation(element)) return element;

    const connectorsOfElement = getConnectorsOfObject(element, connections);
    const connectedElements = getOtherElementsOfConnectors(element, connectorsOfElement, drawBoardElements);

    //Search through all neighbours
    for(let connectedElement of connectedElements){

        const returnValue = resolveRootElementOfAttributeRecursive(connectedElement, connections, drawBoardElements, checkedElements)
        if(returnValue != null) return returnValue;

    }

}
/*
const getAllElementsOfSubGraph = (element, connections, drawBoardElements) => {
    let subGraphElements = [];
    getAllElementsOfSubGraphRecursive(element, connections, subGraphElements, drawBoardElements)

    return subGraphElements;
}
//das ist nicht gut, wir holen uns hier alle elements
const getAllElementsOfSubGraphRecursive = (element, connections, subGraphElements, drawBoardElements) => {

    //Check element is not already traversed
    if(subGraphElements.indexOf(element) !== -1) return;

    subGraphElements.push(element)

    const connectorsOfElement = getConnectorsOfObject(element, connections);
    const connectedElements = getOtherElementsOfConnectors(element, connectorsOfElement, drawBoardElements);

    //Search through all neighbours
    for(let connectedElement of connectedElements){
        getAllElementsOfSubGraphRecursive(connectedElement, connections, subGraphElements, drawBoardElements)
    }

}
*/



//Only allow a connection to another element if
// 1. The element to connect is a attribute then do the following
//      1. Determine the own root
//              If there is no root, than you can connect to anything   BACHTE SPECIAL CASE
//              If there is a root, go to step 2
//      2. Determine the root of the attribute to connect to
//              If there is no root, than you can connct to it          BEACHTE SPECIAL CASE
//              If there is a root, than you can NOT connect to it, REGARDLESS it is is the same or not

//Spezialfall, wenn beide attribute keine root haben, dann
// Ermittle ob es bereits irgendeine verbindung zwsichen diesen gibt


//kann eine Entity oder Relation zu einem Attribute connecten
// Nur wenn das attribut keinen root hat


export const checkIfConnectionBetweenAttributesKeepsConsistencyOfAttributeStructure = (element, connections, selectedObject, drawBoardElements) => {

    //Rule is only applied if both elements are attributes
    if( ! (isElementOfCategoryAttribute(element) && isElementOfCategoryAttribute(selectedObject) ) ) return true;

    const possibleOwnRoot = resolveRootElementOfAttribute(selectedObject, connections, drawBoardElements);
    const possibleToConnectRoot = resolveRootElementOfAttribute(element, connections, drawBoardElements);

    //Regardless if the own root is the same as the other, there can no connection established
    //as both have already a chain to a root and a connection would lead to a circle
    //if the root would be the same or otherwise two roots would be connected

    if(possibleOwnRoot != null && possibleToConnectRoot != null) return false;

    //When the selected attribute is part of a tree with an entity or relation as root and the other element has no root
    //then we can allow the connection, as they can not create a circle
    //Reason: To create a circle the other element had to be in the same subgraph, if so it would have a root
    //The same logic can be reversed

    if(possibleOwnRoot != null && possibleToConnectRoot == null) return true;

    if(possibleOwnRoot == null && possibleToConnectRoot != null) return true;

    //If both attributes have no entity or relation root,
    //it needs to be checked if one element is part of the subgraph of the other element
    if(possibleOwnRoot == null && possibleToConnectRoot == null){
        const elementsOfSubgraph = collectAttributesSubgraph(selectedObject, connections, drawBoardElements)
        if(elementsOfSubgraph.indexOf(element) === -1) {
            //The element is not in the subgraph, it can be added
            return true;
        }
        else {
            //The element is in the subgraph, connection would cause a circle
            return false;
        }
    }

    return false;

}


export const relationOrEntityToAttributeIfAttributeHasNoRoot = (element, connections, selectedObject, drawBoardElements) => {

    //Rule only applies, if element to connect is of type attribute
    if(!isElementOfCategoryAttribute(element)) return true;

    const possibleRoot = resolveRootElementOfAttribute(element, connections, drawBoardElements);

    return possibleRoot == null;
}


export const checkWeakTypesConsistency = (element, connections, selectedObject, drawBoardElements) => {

    let isElementIdentified;
    let isSelectedObjectIdentified;

    if(element.erType === ERTYPE.StrongEntity.name ){
        isElementIdentified = true;
    }
    else{
        const elementSubGraph = collectWeakTypesSubgraph(element, connections, drawBoardElements);
        isElementIdentified = collectionContainsStrongEntity(elementSubGraph);
    }

    if(selectedObject.erType === ERTYPE.StrongEntity.name){
        isSelectedObjectIdentified = true;
    }
    else{
        const selectedObjectSubGraph = collectWeakTypesSubgraph(selectedObject, connections, drawBoardElements);
        isSelectedObjectIdentified = collectionContainsStrongEntity(selectedObjectSubGraph);
    }

    if(exclusiveOr(isElementIdentified, isSelectedObjectIdentified)) return true;

    if(isElementIdentified && isSelectedObjectIdentified) return false;

    if(!isElementIdentified && !isSelectedObjectIdentified) return true;

}

const exclusiveOr = (fistExpression, secondExpression) => {
    return (fistExpression && !secondExpression) || (!fistExpression && secondExpression);
}

const collectionContainsStrongEntity = (collection) => {
    collection.filter(element => element.erType === ERTYPE.StrongEntity.name);
    return collection.length > 0;
}

const collectWeakTypesSubgraph = (element, connections, drawBoardElements) => {
    return collectElementsOfSubgraph(element, connections, weakTypesSubgraphBounds, drawBoardElements)
}

const collectAttributesSubgraph = (element, connections, drawBoardElements) => {
    return collectElementsOfSubgraph(element, connections, attributeTypesSubgraphBounds, drawBoardElements)
}

const collectElementsOfSubgraph = (element, connections, subgraphBounds, drawBoardElements) => {
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

const addIfNotExists = (element, collection) => {
    if(collection.indexOf(element) !== -1) return false;
    collection.push(element)
    return true;
}

const weakTypesSubgraphBounds = (element) => {

    switch (element.erType) {

        case ERTYPE.IdentifyingAttribute.name:       return false;
        case ERTYPE.NormalAttribute.name:            return false;
        case ERTYPE.MultivaluedAttribute.name:       return false;
        case ERTYPE.WeakIdentifyingAttribute.name:   return false;

        case ERTYPE.StrongEntity.name:               return true;
        case ERTYPE.WeakEntity.name:                 return true;

        case ERTYPE.StrongRelation.name:             return false;
        case ERTYPE.WeakRelation.name:               return true;

        case ERTYPE.IsAStructure.name:               return false;
    }

}


const attributeTypesSubgraphBounds = (element) => {

    switch (element.erType) {

        case ERTYPE.IdentifyingAttribute.name:       return true;
        case ERTYPE.NormalAttribute.name:            return true;
        case ERTYPE.MultivaluedAttribute.name:       return true;
        case ERTYPE.WeakIdentifyingAttribute.name:   return true;

        case ERTYPE.StrongEntity.name:               return false;
        case ERTYPE.WeakEntity.name:                 return false;

        case ERTYPE.StrongRelation.name:             return false;
        case ERTYPE.WeakRelation.name:               return false;

        case ERTYPE.IsAStructure.name:               return false;
    }

}