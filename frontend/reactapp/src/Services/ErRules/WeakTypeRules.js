import {ERTYPE} from "../DrawBoardModel/ErType";
import {
    collectElementsOfSubgraph, collectionContains,
    collectionContainsStrongEntity,
    connectionSamePath,
    getConnectorsOfObject,
    getOtherElementsOfConnectors
} from "./ErRulesUtil";


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

/**
 * Checks if a path between a weak relation and a weak entity does maximum 1 time exist (no reflexive relations for weak types allowed)
 */
const pathRelToWeakEntityDoesMax1TimesExist = (element, connections, selectedObject) => {

    //Check if path of type Element --> SelectedObject or SelectedObject <-- Element exist

    const samePathConnections  =
        connections.filter(connection => connectionSamePath(connection, element, selectedObject));

    if(element.erType === ERTYPE.WeakEntity.name)
        return samePathConnections.length < 1;

    return samePathConnections.length < 2;
}

/**
 * Checks that every weak type can exactly one time identified
 * Therefore it searches through a weak type subgraph (a subgraph only containing weak entiteis, weak relations and strong entities)
 * If there is already a strong entity in the subgraph no connection to another strong entity is allowed
 */
const checkWeakTypesConsistency = (element, connections, selectedObject, drawBoardElements) => {

    //Rule only applied to weak types and strong entities
    if( !isElementOfWeakType(element) && !isElementStrongEntityType(element) ) return true;

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

/**
 * Checks that weak type subgraph are circle free
 * When a weak type is selected (entity or relation) applies to another weak type (entity or relation)
 */
const checkWeakTypesCircleFree = (element, connections, selectedObject, drawBoardElements) => {

    //Rule only applied to weak types
    if( !isElementOfWeakType(element)) return true;

    const elementSubGraph = collectWeakTypesSubgraph(element, connections, drawBoardElements);

    return !collectionContains(elementSubGraph, selectedObject);
}

/**
 * Utils
 */

const collectWeakTypesSubgraph = (element, connections, drawBoardElements) => {
    return collectElementsOfSubgraph(element, connections, weakTypesSubgraphBounds, drawBoardElements)
}


const isElementOfWeakType = (element) => {
    return element.erType === ERTYPE.WeakRelation.name || element.erType === ERTYPE.WeakEntity.name;
}

const isElementStrongEntityType = (element) => {
    return element.erType === ERTYPE.StrongEntity.name;
}


const exclusiveOr = (fistExpression, secondExpression) => {
    return (fistExpression && !secondExpression) || (!fistExpression && secondExpression);
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


const WeakTypeRules = {
    checkIfToWeakRelationItOnlyHasDeg2: checkIfToWeakRelationItOnlyHasDeg2,
    checkWeakRelationHasOnly2Entities: checkWeakRelationHasOnly2Entities,
    pathRelToWeakEntityDoesMax1TimesExist:pathRelToWeakEntityDoesMax1TimesExist,
    checkWeakTypesConsistency:checkWeakTypesConsistency,
    collectWeakTypesSubgraph:collectWeakTypesSubgraph,
    checkWeakTypesCircleFree:checkWeakTypesCircleFree
}

export default WeakTypeRules;