import {ERTYPE} from "../DrawBoardModel/ErType";
import {addAllIfNotExists, addIfNotExists, getConnectorsOfObject, getOtherElementsOfConnectors} from "./ErRulesUtil";
import {ConnectionType} from "../DrawBoardModel/Diagram";

/**
 * This function ensures that the connection will not result into a multiple inheritance of attributes
 */
const ensureEntityAsSubTypeToIsANoMultipleInheritance = (element, connections, selectedObject, drawBoardElements) => {

    //We use copies here to be able to add a fake super type to isAs

    let elementsCopy = JSON.parse(JSON.stringify(drawBoardElements));
    let copySelectedObject = elementsCopy.find(copy => copy.id === selectedObject.id)
    let copyElement = elementsCopy.find(copy => copy.id === element.id)

    //Rule only applies to isa and entity
    if( (copyElement.erType        === ERTYPE.IsAStructure.name && copySelectedObject.erType === ERTYPE.StrongEntity.name) ||
        (copySelectedObject.erType === ERTYPE.IsAStructure.name && copyElement.erType        === ERTYPE.StrongEntity.name) ) {

        const {isa, entity} = resolveEntityIsA(copyElement, copySelectedObject)

        let superType = getSuperTypeOfIsA(isa, connections, elementsCopy)

        addFakeMissingSuperTypes(elementsCopy, connections);
        if (superType == null) superType = isa.fakeSuperType;

        const impactedSet = collectImpactedEntitySet(entity, connections, elementsCopy)
        const superTypeSet = collectSuperTypeSetOfEntity(superType, connections, elementsCopy)

        removeFakeMissingSuperTypes(elementsCopy, connections);

        return areCollectionsDisjoint(superTypeSet, impactedSet);

    }

    return true;
}

const removeFakeMissingSuperTypes = (drawBoardElements) => {
    let isAStructures = drawBoardElements.filter(element => element.erType === ERTYPE.IsAStructure.name);

    for (let isA of isAStructures){
        isA.fakeSuperType = undefined;
    }
}

const addFakeMissingSuperTypes = (drawBoardElements, connections) => {
    let isAStructures = drawBoardElements.filter(element => element.erType === ERTYPE.IsAStructure.name);

    for (let isA of isAStructures){
        let superType = getSuperTypeOfIsA(isA, drawBoardElements, connections)
        if(superType == null) isA.fakeSuperType = {id: Date.now() + " -- fake"}
    }
}


/**
 * This function ensures that the connection will not result into a multiple inheritance of attributes
 */
const ensureEntityAsSuperTypeToIsANoMultipleInheritance = (element, connections, selectedObject, drawBoardElements) => {

    //Rule only applies to isa and entity
    if((element.erType        === ERTYPE.IsAStructure.name && selectedObject.erType === ERTYPE.StrongEntity.name) ||
        (selectedObject.erType === ERTYPE.IsAStructure.name && element.erType        === ERTYPE.StrongEntity.name) ) {

        const impactedSet = [];
        const {isa, entity} = resolveEntityIsA(element, selectedObject);

        const subTypesOfIsA = getSubTypesOfIsA(isa, connections, drawBoardElements)
        for (let subType of subTypesOfIsA) {
            let impactedEntities = collectImpactedEntitySet(subType, connections, drawBoardElements)
            addAllIfNotExists(impactedEntities, impactedSet)
        }

        const superTypeSet = collectSuperTypeSetOfEntity(entity, connections, drawBoardElements)

        return areCollectionsDisjoint(superTypeSet, impactedSet)
    }

    return true;
}

const areCollectionsDisjoint = (firstCollection, secondCollection) => {

    for(let element of firstCollection){
        let foundElement = secondCollection.find(secondElement => secondElement.id === element.id);
        if(foundElement != null) return false;
    }
    return true;
}

const resolveEntityIsA = (firstElement, secondElement) => {
    let isa;
    let entity;

    if(firstElement.erType === ERTYPE.IsAStructure.name && secondElement.erType === ERTYPE.StrongEntity.name){
        isa = firstElement;
        entity = secondElement;
    }
    else {
        isa = secondElement;
        entity = firstElement;
    }

    return {isa, entity}
}



/**
 * Collects the subtype set for a given entity
 * @param element The entity to collect the subtype set from
 * @param connections The connections in the Er diagram
 * @param drawBoardElements The elements in the Er diagram
 * @returns {*[]} A collection of entities.
 * Those entities inherit directly or indirectly the given entity through isA structures
 */
const collectSubTypeSetOfEntity = (element, connections, drawBoardElements) => {
    let collectedElements = [];

    addIfNotExists(element, collectedElements);
    collectSubTypeSetOfEntityRecursive(element, connections, drawBoardElements, collectedElements)
    return collectedElements;
}


/**
 * Populates a given collection with entities, which inherit from the given entity
 * @param element The entity to collect the subtype set recursively
 * @param connections The connections in the Er diagram
 * @param drawBoardElements The elements in the Er diagram
 * @param collectedElements The collection to populate
 * @example
 *
 *                  Entity 1                     <- Given entity
 *          |                  |                   (parent connection)
 *         Isa 1             IsA 2
 *     |        |          |        |              (inheritor connection)
 *  ---------------------------------------
 *  |Entity 2  Entity 3  Entity 3 Entity 5|     <- add and execute recursion on these elements
 *  ---------------------------------------
 */
const collectSubTypeSetOfEntityRecursive = (element, connections, drawBoardElements, collectedElements) => {
    let allSubTypesOneLayerBelow = []
    const isAs = getIsAsWhichParentIsTheEntity(element, connections, drawBoardElements);    // IsA 1, IsA 2

    for (let isA of isAs){
        let subTypes = getSubTypesOfIsA(isA, connections, drawBoardElements)
        addAllIfNotExists(subTypes, allSubTypesOneLayerBelow)
        addAllIfNotExists(subTypes, collectedElements)                               // Entity 2, 3, 4, 5
    }

    for (let subType of allSubTypesOneLayerBelow){                                          // Execute recursion
        collectSubTypeSetOfEntityRecursive(subType, connections, drawBoardElements, collectedElements)
    }
}

/**
 * Collects the super type set for a given entity
 * @param element The entity to collect the super type set from
 * @param connections The connections in the Er diagram
 * @param drawBoardElements The elements in the Er diagram
 * @returns {*[]} A collection of entities.
 * Those entities are inherited directly or indirectly through isA structures
 */
const collectSuperTypeSetOfEntity = (element, connections, drawBoardElements) => {
    let collectedElements = [];
    addIfNotExists(element, collectedElements);
    collectSuperTypeSetOfEntityRecursive(element, connections, drawBoardElements, collectedElements)
    return collectedElements;
}

/**
 * Collects the impacted entity set for a given entity
 * @param element The entity to collect the impacted entity set from
 * @param connections The connections in the Er diagram
 * @param drawBoardElements The elements in the Er diagram
 * @returns {*[]} A collection of entities.
 * Defined as the supertype set for each entity in the subtype set for a given entity
 * All those entities are influenced at allowing
 * a connection of an entity to an isa as inheritor or parent
 */
const collectImpactedEntitySet = (element, connections, drawBoardElements) => {
    const impactedEntitySet = [];

    const subTypeSet = collectSubTypeSetOfEntity(element, connections, drawBoardElements)
    addAllIfNotExists(subTypeSet, impactedEntitySet)

    for (let subType of subTypeSet){
        const superTypesOfSubType = collectSuperTypeSetOfEntity(subType, connections, drawBoardElements)
        addAllIfNotExists(superTypesOfSubType, impactedEntitySet)
    }
    return impactedEntitySet;
}


/**
 * Populates a given collection with entities, which are inherited by the given entity
 * @param element The entity to collect the super set recursively
 * @param connections The connections in the Er diagram
 * @param drawBoardElements The elements in the Er diagram
 * @param collectedElements The collection to populate
 * @example
 *
 *  ------------------------------
 *  |Entity 2            Entity 3|        <- add and execute recursion on these elements
 *  ------------------------------
 *     |                  |                   (parent connection)
 *    Isa 1             IsA 2
 *     |                  |                   (inheritor connection)
 *           Entity 1                     <- Given entity
 */
const collectSuperTypeSetOfEntityRecursive = (element, connections, drawBoardElements, collectedElements) => {

    let superTypesOneLayerAbove = []
    const isAs = getIsAsWhichInheritorIsTheEntity(element, connections, drawBoardElements);    // IsA 1, IsA 2

    for (let isA of isAs){
        let superType = getSuperTypeOfIsA(isA, connections, drawBoardElements)
        if(superType == null && isA.fakeSuperType != null){
            addIfNotExists(isA.fakeSuperType, collectedElements)
        }
        else if(superType != null) {
            addIfNotExists(superType, collectedElements)
            addIfNotExists(superType, superTypesOneLayerAbove)
        }// Entity 2, 3
    }

    for (let superType of superTypesOneLayerAbove){                                             // Execute recursion
        collectSuperTypeSetOfEntityRecursive(superType, connections, drawBoardElements, collectedElements)
    }
}


/**
 * Checks if an isA has only one parent
 */
const onlyOneParentAllowed = (element, connections, selectedObject) => {

    const connectionsToElement = getConnectorsOfObject(selectedObject, connections);
    const parents = connectionsToElement.filter(connection => connection.connectionType === ConnectionType.parent)

    return parents.length < 1;
}



/**
 *
 *
 *
 *        Entity 1
 *          |      (parent connection)
 *         Isa
 *     |        |  (inheritor connection)
 *  Entity 2  Entity 3
 *
 * Returns Entity 2, Entity 3
 */
const getSubTypesOfIsA = (element, connections, drawBoardElements) => {
    const inheritorConnections =  getConnectorsOfObject(element, connections).filter(connection => connection.connectionType === ConnectionType.inheritor);
    return getOtherElementsOfConnectors(element, inheritorConnections, drawBoardElements);
}

/**
 *
 *
 *        Entity 1
 *          |      (parent connection)
 *         Isa
 *     |        |  (inheritor connection)
 *  Entity 2  Entity 3
 *
 * Returns Entity 1
 */
const getSuperTypeOfIsA = (element, connections, drawBoardElements) => {
    const parentConnections =  getConnectorsOfObject(element, connections).filter(connection => connection.connectionType === ConnectionType.parent);
    return getOtherElementsOfConnectors(element, parentConnections, drawBoardElements)[0];
}


/**
 *
 *
 *  IsA 1     IsA 2
 *     |      |  (inheritor connection)
 *      Entity
 *     |      |  (parent connection)
 *  IsA 3     IsA 4
 *
 * Returns IsA 3, IsA 4
 */
const getIsAsWhichParentIsTheEntity = (element, connections, drawBoardElements) => {
    const inheritorConnections =  getConnectorsOfObject(element, connections).filter(connection => connection.connectionType === ConnectionType.parent);
    return getOtherElementsOfConnectors(element, inheritorConnections, drawBoardElements);
}

/**
 *
 *
 *  IsA 1     IsA 2
 *     |      |  (inheritor connection)
 *      Entity
 *     |      |  (parent connection)
 *  IsA 3     IsA 4
 *
 * Returns IsA 1, IsA 2
 */
const getIsAsWhichInheritorIsTheEntity = (element, connections, drawBoardElements) => {
    const parentConnections =  getConnectorsOfObject(element, connections).filter(connection => connection.connectionType === ConnectionType.inheritor);
    return getOtherElementsOfConnectors(element, parentConnections, drawBoardElements);
}

const IsAEntityRules = {
    onlyOneParentAllowed: onlyOneParentAllowed,
    ensureEntityAsSubTypeToIsANoMultipleInheritance: ensureEntityAsSubTypeToIsANoMultipleInheritance,
    ensureEntityAsSuperTypeToIsANoMultipleInheritance:ensureEntityAsSuperTypeToIsANoMultipleInheritance
}

export default IsAEntityRules;