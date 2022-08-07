import {
    addIfNotExists, collectElementsOfSubgraph,
    getConnectorsOfObject,
    getOtherElementsOfConnectors, isElementOfCategoryAttribute,
    isElementOfCategoryEntityOrRelation
} from "./ErRulesUtil";
import {ERTYPE} from "../DrawBoardModel/ErType";



/**
 * Checks if the current element is an attribute and has no root
 */
const relationOrEntityToAttributeIfAttributeHasNoRoot = (element, connections, selectedObject, drawBoardElements) => {

    //Rule only applies, if element to connect is of type attribute
    if(!isElementOfCategoryAttribute(element)) return true;

    const possibleRoot = resolveRootElementOfAttribute(element, connections, drawBoardElements);

    return possibleRoot == null;
}



/**
 * An attribute is only allowed to connect to another relation or entity
 * if it has no current connection to an entity or relation
 *
 * This method returns false, if the given element is of type relation or entity and
 * the selectedObject (type attribute) has a direct connection to an entity or relation
 *
 */
const onlyAllowConnectToRelationOrEntityIfNoCurrentEntityOrRelationConnection = (element, connections, selectedObject, drawBoardElements) => {

    //Rule only applies, when the other element is of type entity or relation
    if(! isElementOfCategoryEntityOrRelation(element)) return true;

    const possibleRoot = resolveRootElementOfAttribute(selectedObject, connections, drawBoardElements)

    if(possibleRoot == null) return true;

    //The selected object (as attribute) has already a root
    //If it is another, the attribute would connect two roots, if it is the same, then we would create a duplicate connection
    //in any case, we are not allowed to connect these attributes
    return false;
}



/**
 *
 * Only allow a connection to another element if
 *  1. The element to connect is a attribute then do the following
 *       1. Determine the own root
 *               If there is no root, then you can connect to anything
 *               If there is a root, go to step 2
 *       2. Determine the root of the attribute to connect to
 *               If there is no root, then you can connect to it
 *               If there is a root, than you can NOT connect to it, REGARDLESS if it is the same or not
 */
const checkIfConnectionBetweenAttributesKeepsConsistencyOfAttributeStructure = (element, connections, selectedObject, drawBoardElements) => {

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


/**
 * Util to collect a subgraph containing only attributes
 */
const collectAttributesSubgraph = (element, connections, drawBoardElements) => {
    return collectElementsOfSubgraph(element, connections, attributeTypesSubgraphBounds, drawBoardElements)
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


/**
 * Util to resolve the root element of an attribute (entity, relation or null)
 */
const resolveRootElementOfAttribute = (element, connections, drawBoardElements) => {

    let checkedElements = []
    return resolveRootElementOfAttributeRecursive(element, connections, drawBoardElements, checkedElements)
}

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

const AttributeRules = {
    checkIfConnectionBetweenAttributesKeepsConsistencyOfAttributeStructure: checkIfConnectionBetweenAttributesKeepsConsistencyOfAttributeStructure,
    relationOrEntityToAttributeIfAttributeHasNoRoot:relationOrEntityToAttributeIfAttributeHasNoRoot,
    onlyAllowConnectToRelationOrEntityIfNoCurrentEntityOrRelationConnection:onlyAllowConnectToRelationOrEntityIfNoCurrentEntityOrRelationConnection,
    resolveRootElementOfAttribute:resolveRootElementOfAttribute
}

export default AttributeRules;