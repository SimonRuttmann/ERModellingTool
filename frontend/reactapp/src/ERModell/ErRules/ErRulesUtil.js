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
 * @returns {boolean} True, if rules succeeds
 */
export const onlyAllowConnectToRelationOrEntityIfNoCurrentEntityOrRelationConnection = (element, connections, selectedObject) => {

    //Rule only applies, when the other element is of type entity or relation
    if(! isElementOfCategoryEntityOrRelation(element)) return true;


    const possibleRoot = resolveRootElementOfAttribute(selectedObject, connections)

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
    currentlyPassedElements.push(...elements)

    for (let rule of rules){

        //Filter elements based on rule
        currentlyPassedElements = currentlyPassedElements.filter(
            element => {
                return rule(element, connections, selectedObject);
            })

    }

    //All elements which passed all rules
    return currentlyPassedElements;
}

const getConnectorsOfObject = (element, connections) => {
    return connections.filter(connection => connection.end === element.id || connection.start === element.id)
}


const getOtherElementsOfConnectors = (element, connections) => {
    let otherElements = [];
    for (let connection of connections){
        if(connections.start === element.start) otherElements.push(resolveObjectById(connections.end))
        else otherElements.push(resolveObjectById(connections.start))
    }
    return otherElements;
}

//null oder element des roots
const resolveRootElementOfAttribute = (element, connections) => {
    return resolveRootElementOfAttributeRecursive(element, connections)
}

//TODO while testing check if any circles are possible
//TODO THIS IS IMPORTANT to prevent infinite loops
const resolveRootElementOfAttributeRecursive = (element, connections) => {

    //If element is already entity or relation terminate
    if(isElementOfCategoryEntityOrRelation(element)) return element;

    const connectorsOfElement = getConnectorsOfObject(element, connections);
    const connectedElements = getOtherElementsOfConnectors(element, connectorsOfElement);

    //Search through all neighbours
    for(let connectedElement of connectedElements){

        const returnValue = resolveRootElementOfAttributeRecursive(connectedElement, connections)
        if(returnValue != null) return returnValue;

    }

}

const getAllElementsOfSubGraph = (element, connections) => {
    let subGraphElements = [];
    getAllElementsOfSubGraphRecursive(element, connections, subGraphElements )

    return subGraphElements;
}

const getAllElementsOfSubGraphRecursive = (element, connections, subGraphElements) => {

    //Check element is not already traversed
    if(subGraphElements.indexOf(element) !== -1) return;

    subGraphElements.push(element)

    const connectorsOfElement = getConnectorsOfObject(element, connections);
    const connectedElements = getOtherElementsOfConnectors(element, connectorsOfElement);

    //Search through all neighbours
    for(let connectedElement of connectedElements){
        getAllElementsOfSubGraphRecursive(connectedElement, connections, subGraphElements)
    }

}




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


export const checkIfConnectionBetweenAttributesKeepsConsistencyOfAttributeStructure = (element, connections, selectedObject) => {

    //Rule is only applied if both elements are attributes
    if( ! (isElementOfCategoryAttribute(element) && isElementOfCategoryAttribute(selectedObject) ) ) return true;

    const possibleOwnRoot = resolveRootElementOfAttribute(selectedObject, connections);
    const possibleToConnectRoot = resolveRootElementOfAttribute(element, connections);

    //Regardless if the own root is the same as the other, there can no connection established
    //as both have already a chain to a root and a connection would lead to a circle
    //if the root would be the same or otherwise two roots would be connected

    if(possibleOwnRoot != null && possibleToConnectRoot == null) return false;

    //When the selected attribute is part of a tree with an entity or relation as root and the other element has no root
    //then we can allow the connection, as they can not create a circle
    //Reason: To create a circle the other element had to be in the same subgraph, if so it would have a root
    //The same logic can be reversed

    if(possibleOwnRoot != null && possibleToConnectRoot == null) return true;

    if(possibleOwnRoot == null && possibleToConnectRoot != null) return true;

    if(possibleOwnRoot == null && possibleToConnectRoot == null){
        const elementsOfSubgraph = getAllElementsOfSubGraph(possibleOwnRoot, connections)
        if(elementsOfSubgraph.indexOf(possibleToConnectRoot) === -1) {
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


export const relationOrEntityToAttributeIfAttributeHasNoRoot = (element, connections, selectedObject) => {

    //Rule only applies, if element to connect is of type attribute
    if(!isElementOfCategoryAttribute(element)) return true;

    const possibleRoot = resolveRootElementOfAttribute(element, connections);

    return possibleRoot == null;
}


export const checkWeakTypesConsistency = (element, connections, selectedObject) => {

    let isElementIdentified;
    let isSelectedObjectIdentified;

    if(element.erType === ERTYPE.StrongEntity.name ){
        isElementIdentified = true;
    }
    else{
        const elementSubGraph = collectWeakTypesSubgraph(element, connections);
        isElementIdentified = collectionContainsStrongEntity(elementSubGraph);
    }

    if(selectedObject.erType === ERTYPE.StrongEntity.name){
        isSelectedObjectIdentified = true;
    }
    else{
        const selectedObjectSubGraph = collectWeakTypesSubgraph(selectedObject, connections);
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

const collectWeakTypesSubgraph = (element, connections) => {
    return collectElementsOfSubgraph(element, connections, weakTypesSubgraphBounds)
}

const collectElementsOfSubgraph = (element, connections, subgraphBounds) => {
    let collectedElements = [];
    collectElementsOfSubgraphRecursive(element, connections, collectedElements, subgraphBounds)
    return collectedElements;
}

const collectElementsOfSubgraphRecursive = (element, connections, collectedElements, subgraphBounds) => {

    //if already added stop execution
    if(! addIfNotExists(element, collectedElements)) return;

    const connectorsOfElement = getConnectorsOfObject(element, connections);
    const connectedElements = getOtherElementsOfConnectors(element, connectorsOfElement);

    const elementsInGraph = connectedElements.filter(connectedElement => subgraphBounds(connectedElement))

    for (let elementInGraph of elementsInGraph){
        collectElementsOfSubgraphRecursive(elementInGraph)
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
/*
//TODO This is too complex, there must be an easier way

//WEnn schwache entität auf schwache relation --> Prüfen ob doppelte identifiziert
//Wenn starke entität auf schwache relation -> prüfen ob doppelt identifiziert

// | STRONG A --> WeakRelationAB -> WEAK B <- WeakRelationBC <-- STRONG C


//Selected object == weakEntity|strongEntity TODO momentan nur logik für strong entity
//Element is weakRelation
export const weakEntityReferencingWeakRelationKeepsUnambiguousIdentification = (element, connections, selectedObject) => {
    if(element.erType !== ERTYPE.WeakRelation.name) return true;

    const resultToConnect = resolveIdentifyingElementOfWeakEntityRecursive(element, connections, []);

    //weak Relation is not defined yet
    if(resultToConnect == null) return true;

    return false;
}


const resolveIdentifyingElementOfWeakEntityRecursive = (element, connections, checkedElements) => {

    //element here is of type weak relation

    const connectorsOfElement = getConnectorsOfObject(element, connections);
    const connectedElements = getOtherElementsOfConnectors(element, connectorsOfElement);


    //if weak relation has a connection to a strong entity, return it
    const strongEntities = connectedElements.filter(connectedElement => connectedElement.erType === ERTYPE.StrongEntity);
    if(strongEntities.length > 0) return strongEntities[0];

    //resolve connection to other weak entities
    const weakEntities = connectedElements.filter(connectedElement => connectedElement.erType === ERTYPE.WeakEntity);

    if(weakEntities.length === 0) return;

    //If all weak entities are already checked we return
    let notCheckedElements = []
    for(let entities of weakEntities){
        if(checkedElements.indexOf(entities) === -1) {
            notCheckedElements.push(entities)
        }
    }

    if(notCheckedElements.length === 0) return;

    //Add not checked elements to the checked Array, as they will be checked in the below for
    for (let willBeCheckedElements of notCheckedElements) {
        checkedElements.push(willBeCheckedElements)
    }


    for(let weakEntity of notCheckedElements){

        //For each weak entity get their weak relations
        const connectorsOfWeakEntity = getConnectorsOfObject(weakEntity, connections);
        const connectedElementsOfWeekEntity = getOtherElementsOfConnectors(weakEntity, connectorsOfWeakEntity);

        const weakRelations = connectedElementsOfWeekEntity.
                              filter(connectedElement => connectedElement.erType === ERTYPE.WeakRelation);

        if(weakRelations.length === 0) continue;

        //For each weak relation try to find the strong entity
        for(let weakRelation of weakRelations){
            const returnValue = resolveIdentifyingElementOfWeakEntityRecursive(weakRelation, connections)
            if(returnValue != null) return returnValue;
        }

    }

}

*/