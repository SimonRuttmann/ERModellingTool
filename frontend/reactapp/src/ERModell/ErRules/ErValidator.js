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

export const validateErDiagram = (connections, drawBoardElements) => {

    let invalidMessages = [];

    //Check if all elements (except isa) have a name
    const nonIsa = drawBoardElements.filter(element => element.erType !== ERTYPE.IsAStructure.name);
    for (let namedElement of nonIsa){
        if(namedElement.displayName == null || namedElement.displayName === "" || namedElement.displayName.trim().length === 0)
            invalidMessages.push(`The element of type "${namedElement.erType}" has no name!`)
    }

    if(connections.length === 0 && drawBoardElements.length === 0)
        invalidMessages.push("Diagram is empty!")

    //For every attribute, the Root (Entity or Relation) != null

    let attributes = drawBoardElements.filter(element => isElementOfCategoryAttribute(element))
    for(let attribute of attributes){

        const root = resolveRootElementOfAttribute(attribute, connections, drawBoardElements);

        if(root == null)
            invalidMessages.push(`The attribute "${attribute.displayName}" is not connected to a entity or relation!`)
    }

    //For every Entity a key is present (top level key)

    let entities = drawBoardElements.filter(element => element.erType === ERTYPE.StrongEntity.name ||
                                                       element.erType === ERTYPE.WeakEntity.name);

    for (let entity of entities){

        let connectors = getConnectorsOfObject(entity, connections);
        let connectedElements = getOtherElementsOfConnectors(entity, connectors, drawBoardElements);

        if(entity.erType === ERTYPE.StrongEntity.name){

            let identifier = connectedElements.filter(element => element.erType === ERTYPE.IdentifyingAttribute.name);

            if(identifier.length === 0)
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

    //For every ISa Parent + Inheritor is present

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
    return invalidMessages;
}
