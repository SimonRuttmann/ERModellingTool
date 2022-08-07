import {
    collectionContainsStrongEntity,
    getConnectorsOfObject,
    getOtherElementsOfConnectors,
    isElementOfCategoryAttribute,
} from "./ErRulesUtil";
import {ERTYPE} from "../DrawBoardModel/ErType";
import {ConnectionType} from "../DrawBoardModel/Diagram";
import {resolveObjectById} from "../Common/ObjectUtil";
import AttributeRules from "./AttributeRules";
import WeakTypeRules from "./WeakTypeRules";

/**
 * The ErFeedbackSystem currently consists only of the validateErDiagram method
 * and is exported at the end of the file
 */


/**
 * This method validates an Er diagram composed by the given connections and drawBoardElements
 * it generates an error message for each vulnerability found
 * @param connections The connections of the Er diagram
 * @param drawBoardElements The drawBoardElements, e.g. Er elements of the Er diagram
 * @returns {*[]} A collection of strings, containing the error messages
 */
const validateErDiagram = (connections, drawBoardElements) => {

    let invalidMessages = [];

    //1. Check if all elements (except isa) have a name

    const nonIsa = drawBoardElements.filter(element => element.erType !== ERTYPE.IsAStructure.name);
    for (let namedElement of nonIsa){
        if(namedElement.displayName == null || namedElement.displayName === "" || namedElement.displayName.trim().length === 0)
            invalidMessages.push(`The element of type "${namedElement.erType}" has no name!`)
    }

    if(connections.length === 0 && drawBoardElements.length === 0)
        invalidMessages.push("Diagram is empty!")

    //2. For every attribute, the Root (Entity or Relation) != null

    let attributes = drawBoardElements.filter(element => isElementOfCategoryAttribute(element))
    for(let attribute of attributes){

        const root = AttributeRules.resolveRootElementOfAttribute(attribute, connections, drawBoardElements);

        if(root == null)
            invalidMessages.push(`The attribute "${attribute.displayName}" is not connected to a entity or relation!`)
    }

    //3. For every Entity a key is present (top level key), or it is an inheritor of an isa structure

    let entities = drawBoardElements.filter(element => element.erType === ERTYPE.StrongEntity.name ||
                                                       element.erType === ERTYPE.WeakEntity.name);

    for (let entity of entities){

        let connectors = getConnectorsOfObject(entity, connections);
        let connectedElements = getOtherElementsOfConnectors(entity, connectors, drawBoardElements);

        if(entity.erType === ERTYPE.StrongEntity.name){

            let identifier = connectedElements.filter(element => element.erType === ERTYPE.IdentifyingAttribute.name);
            let inheritorConnections = connectors.filter(connection => connection.connectionType === ConnectionType.inheritor)

            if(identifier.length === 0 && inheritorConnections.length === 0)
                invalidMessages.push(`The strong entity "${entity.displayName}" does not have an identifier!`) ;
        }

        else{

            let identifier = connectedElements.filter(element => element.erType === ERTYPE.WeakIdentifyingAttribute.name);

            if(identifier.length === 0)
                invalidMessages.push(`The weak entity "${entity.displayName}" does not have an partial identifier!`);
        }

    }

    //4. For every Relation >= 2 connections to entity category

    let relations = drawBoardElements.filter(element => element.erType === ERTYPE.StrongRelation.name ||
                                                        element.erType === ERTYPE.WeakRelation.name);

    for (let relation of relations){

        let connectors = getConnectorsOfObject(relation, connections);
        let connectedElements = getOtherElementsOfConnectors(relation, connectors, drawBoardElements);
        let connectedEntities = connectedElements.filter(element => element.erType === ERTYPE.StrongEntity.name ||
                                                         element.erType === ERTYPE.WeakEntity.name)

        if(connectedEntities.length < 2){

            if(relation.erType === ERTYPE.StrongRelation.name)
                invalidMessages.push(`The strong relation "${relation.displayName}" must at least connect 2 entities!`);
            else
                invalidMessages.push(`The weak relation "${relation.displayName}" must at least connect 2 entities!`);
        }

    }

    //5. For every IsA Parent + Inheritor is present

    let isAStructures = drawBoardElements.filter(element => element.erType === ERTYPE.IsAStructure.name);

    for (let isA of isAStructures){
        let connectors = getConnectorsOfObject(isA, connections);

        const parents = connectors.filter(connection => connection.connectionType === ConnectionType.parent)
        const inheritors = connectors.filter(connection => connection.connectionType === ConnectionType.inheritor ||
                                                           connection.connectionType === ConnectionType.association)

        if(parents.length === 0)
            invalidMessages.push(`IsA Structure has no parent`);

        if(inheritors.length === 0)
            invalidMessages.push(`IsA Structure has no inheritors`);
    }

    //6. Every weak entity identified

    let weakEntities = drawBoardElements.filter(element => element.erType === ERTYPE.WeakEntity.name);

    for(let weakEntity of weakEntities){

        const elementSubGraph = WeakTypeRules.collectWeakTypesSubgraph(weakEntity, connections, drawBoardElements);
        const isElementIdentified = collectionContainsStrongEntity(elementSubGraph);

        if(!isElementIdentified)
            invalidMessages.push(`The weak entity "${weakEntity.displayName}" is not identified by a strong type!`);

    }

    //7. Every association has valid cardinalities

    for (let relation of relations){

        let connectors = getConnectorsOfObject(relation, connections);
        let associations = connectors.filter(connection => connection.connectionType === ConnectionType.association);

        for (let association of associations){
            let {valid, message} = validateConnectionsCardinality(association.min, association.max)
            if(valid) continue;

            let start = resolveObjectById(association.start, drawBoardElements);
            let end = resolveObjectById(association.end, drawBoardElements);

            invalidMessages.push(`The cardinality of the association between "${start.displayName}" and "${end.displayName}" is not valid because ` + message)
        }
    }
    return invalidMessages;
}

/**
 * Resolved a cardinality for any given value
 * @param value A nullable string to check
 * @returns {{number: number, isNumber: boolean, isValid: boolean}}
 * An isValid flag, indicating if a number or alphabetic value could be resolved
 * A isNumber flag if the given value is valid and a number got resolved
 * The number if the given value is valid and a number
 */
const resolveCardinality = (value) => {

    if(value == null) value = "---";

    const cardinalityResolverRegex = /^\s*((?<AlphabeticValue>[A-Za-z]+)|(?<NumericValue>\d+))\s*$/;
    let match = cardinalityResolverRegex.exec(value);
    let alphabeticValue = match?.groups?.AlphabeticValue;
    let numericValue = match?.groups?.NumericValue;

    let isValid = false;
    let isNumber = false;
    let number = 0;

    if(numericValue != null) {
        isValid = true;
        isNumber = true;
        number = parseInt(numericValue);
    }
    else if(alphabeticValue != null) {
        isValid = true;
        isNumber = false;
    }

    return {isValid: isValid, isNumber: isNumber, number: number }
}

/**
 * Method to check, whether the cardinalities of a connection are valid
 * @param min The min value of the connection
 * @param max The max value of the connection
 * @returns {{valid: boolean}|{valid: boolean, message: string}}
 * A valid flag indicating if the cardinality is valid
 * If it is not valid a message containing explanation is appended
 */
const validateConnectionsCardinality = (min, max) => {

    let minCardinality = resolveCardinality(min);
    let maxCardinality = resolveCardinality(max);

    //One or both cardinalities are invalid e.g. empty, special chars...
    if(!(minCardinality.isValid && maxCardinality.isValid))
        return {valid: false, message:"it values can only be a number or an alphabetic value"}

    //Both are alphabetic
    if(!minCardinality.isNumber && !maxCardinality.isNumber)
        return {valid: true}

    //Fist is alphabetic but second is number
    if( (!minCardinality.isNumber && maxCardinality.isNumber) )
        return {valid: false, message: "the min cardinality is a variable and therefore higher than the max cardinality "}

    //Min number and max alphabetic
    if(minCardinality.isNumber && !maxCardinality.isNumber)
        return {valid: true}

    let areNumbers = minCardinality.isNumber && maxCardinality.isNumber;

    //Both are numbers but the min is greater than the max
    if ( areNumbers && minCardinality.number > maxCardinality.number)
        return {valid: false, message: "the min cardinality is higher than the max cardinality"}

    //Both are numbers but the max is 0
    if ( areNumbers && maxCardinality.number === 0 )
        return {valid: false, message: "the max cardinality can not be 0"}

    //Max greater or equal min and max not 0
    if(areNumbers && maxCardinality.number >= minCardinality.number && maxCardinality.number !== 0)
        return {valid: true}

    //This case can not happen and should only be used as a fallback for production build
    return {valid: false, message: "the cardinality could not be resolved"}
}

const ErFeedbackSystem = {
    validateErDiagram: validateErDiagram
}

export default ErFeedbackSystem;

