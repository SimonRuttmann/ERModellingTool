import {
    collectionContainsStrongEntity,
    collectWeakTypesSubgraph,
    getConnectorsOfObject,
    getOtherElementsOfConnectors,
    isElementOfCategoryAttribute,
    resolveRootElementOfAttribute
} from "./ErRulesUtil";
import {ERTYPE} from "../Model/ErType";
import {ConnectionType} from "../Model/Diagram";
import {resolveObjectById} from "../Components/Util/ObjectUtil";

export const validateErDiagram = (connections, drawBoardElements) => {

    let invalidMessages = [];

    //Check if all elements (except isa) have a name
    const nonIsa = drawBoardElements.filter(element => element.erType !== ERTYPE.IsAStructure.name);
    for (let namedElement of nonIsa){
        if(namedElement.displayName == null || namedElement.displayName === "" || namedElement.displayName.trim().length === 0)
            invalidMessages.push(`The element of type "${namedElement.erType}" has no name!`)
    }

    //TODO THIS IS OPTIONAL!
   // let alreadyUsedNames = [];

  //  drawBoardElements.forEach(element => {
  //      if (alreadyUsedNames[element.displayName.trim()])
  //          invalidMessages.push(`The name "${element.displayName}" is used multiple times!`)
  //      else
  //          alreadyUsedNames[element.displayName.trim()] = true;
  //  });

    if(connections.length === 0 && drawBoardElements.length === 0)
        invalidMessages.push("Diagram is empty!")

    //For every attribute, the Root (Entity or Relation) != null

    let attributes = drawBoardElements.filter(element => isElementOfCategoryAttribute(element))
    for(let attribute of attributes){

        const root = resolveRootElementOfAttribute(attribute, connections, drawBoardElements);

        if(root == null)
            invalidMessages.push(`The attribute "${attribute.displayName}" is not connected to a entity or relation!`)
    }

    //For every Entity a key is present (top level key), or it is an inheritor of an isa structure

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

    //For every Relation >= 2 connections to entity category

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

    //For every IsA Parent + Inheritor is present

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

    //Every weak entity identified

    let weakEntities = drawBoardElements.filter(element => element.erType === ERTYPE.WeakEntity.name);

    for(let weakEntity of weakEntities){

        const elementSubGraph = collectWeakTypesSubgraph(weakEntity, connections, drawBoardElements);
        const isElementIdentified = collectionContainsStrongEntity(elementSubGraph);

        if(!isElementIdentified)
            invalidMessages.push(`The weak entity "${weakEntity.displayName}" is not identified by a strong type!`);

    }


    //Every association has valid cardinalities

    //1. Für jede relation connection 1 < connection 2 und connection 1 und 2 sind 0,1 oder ABCDEFGHIJKLMNOPQRSTUVWXYZ (groß, klein)
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

const validateConnectionsCardinality = (min, max) => {
    let minCardinality = resolveCardinality(min);
    let maxCardinality = resolveCardinality(max);

    if(!(minCardinality.isValid && maxCardinality.isValid))
        return {valid: false, message:"it values can only be a number or an alphabetic value"}

    //both are alphabetic
    if(!minCardinality.isNumber && !maxCardinality.isNumber)
        return {valid: true}

    //fist is alphabetic but second is number
    if( (!minCardinality.isNumber && maxCardinality.isNumber) )
        return {valid: false, message: "the min cardinality is a variable and therefore higher than the max cardinality "}

    //min number and max alphabetic
    if(minCardinality.isNumber && !maxCardinality.isNumber)
        return {valid: true}

    let areNumbers = minCardinality.isNumber && maxCardinality.isNumber;

    //both are numbers but the min is greater than the max
    if ( areNumbers && minCardinality.number > maxCardinality.number)
        return {valid: false, message: "the min cardinality is higher than the max cardinality"}

    //both are numbers but the max is 0
    if ( areNumbers && maxCardinality.number === 0 )
        return {valid: false, message: "the max cardinality can not be 0"}

    //max greater equals min and max not 0
    if(areNumbers && maxCardinality.number >= minCardinality.number && maxCardinality.number !== 0)
        return {valid: true}

    console.log("FUUUUUCK")
    return {valid: false, message: "the cardinality could not be resolved"}
}

