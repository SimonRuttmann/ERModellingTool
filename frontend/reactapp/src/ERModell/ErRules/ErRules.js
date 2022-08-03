import {ERTYPE} from "../Model/ErType";
import {
    isAssociationConnectionType,
    isInheritorConnectionType,
    isParentConnectionType,
    pathDoesNotAlreadyExist,
    applyRules,
    ifDestinationIsaPathDoesNotExist,
    ifDestinationAttributePathDoesNotExist,
    onlyAllowConnectToRelationOrEntityIfNoCurrentEntityOrRelationConnection,
    checkIfConnectionBetweenAttributesKeepsConsistencyOfAttributeStructure,
    relationOrEntityToAttributeIfAttributeHasNoRoot,
    checkWeakTypesConsistency,
    getConnectorsOfObject,
    getOtherElementsOfConnectors,
    ensureIsACircleFree,
    pathDoesMax2TimesExist, pathWeakRelToWeakEntityDoesMax1TimesExist, addIfNotExists, addAllIfNotExists
} from "./ErRulesUtil";
import {ConnectionType} from "../Model/Diagram";


export const handleSelectIdentifyingAttribute = (selectedObject, connectionType, drawBoardElements, connections) => {

    if(! isAssociationConnectionType(connectionType)) return;

    return applyRules(drawBoardElements, connections, selectedObject,
        identifyingAttributeRule,
        pathDoesNotAlreadyExist,
        onlyAllowConnectToRelationOrEntityIfNoCurrentEntityOrRelationConnection,
        checkIfConnectionBetweenAttributesKeepsConsistencyOfAttributeStructure)
}


const identifyingAttributeRule = (element) => {

    switch (element.erType) {

        case ERTYPE.IdentifyingAttribute.name:       return false;
        case ERTYPE.NormalAttribute.name:            return false;
        case ERTYPE.MultivaluedAttribute.name:       return false;
        case ERTYPE.WeakIdentifyingAttribute.name:   return false;

        case ERTYPE.StrongEntity.name:               return true;
        case ERTYPE.WeakEntity.name:                 return false;

        case ERTYPE.StrongRelation.name:             return false;
        case ERTYPE.WeakRelation.name:               return false;

        case ERTYPE.IsAStructure.name:               return false;
    }

}


export const handleSelectNormalAttribute = (selectedObject, connectionType, drawBoardElements, connections) => {

    if(! isAssociationConnectionType(connectionType)) return;

    return applyRules(drawBoardElements, connections, selectedObject,
        normalAttributeRule,
        pathDoesNotAlreadyExist,
        onlyAllowConnectToRelationOrEntityIfNoCurrentEntityOrRelationConnection,
        checkIfConnectionBetweenAttributesKeepsConsistencyOfAttributeStructure)
}


const normalAttributeRule = (element) => {

    switch (element.erType) {

        case ERTYPE.IdentifyingAttribute.name:       return false;
        case ERTYPE.NormalAttribute.name:            return true;
        case ERTYPE.MultivaluedAttribute.name:       return true;
        case ERTYPE.WeakIdentifyingAttribute.name:   return false;

        case ERTYPE.StrongEntity.name:               return true;
        case ERTYPE.WeakEntity.name:                 return true;

        case ERTYPE.StrongRelation.name:             return true;
        case ERTYPE.WeakRelation.name:               return true;

        case ERTYPE.IsAStructure.name:               return false;
    }

}


export const handleSelectMultivaluedAttribute = (selectedObject, connectionType, drawBoardElements, connections) => {

    if(! isAssociationConnectionType(connectionType)) return;

    return applyRules(drawBoardElements, connections, selectedObject,
        multivaluedAttributeRule,
        pathDoesNotAlreadyExist,
        onlyAllowConnectToRelationOrEntityIfNoCurrentEntityOrRelationConnection,
        checkIfConnectionBetweenAttributesKeepsConsistencyOfAttributeStructure)
}


const multivaluedAttributeRule = (element) => {

    switch (element.erType) {

        case ERTYPE.IdentifyingAttribute.name:       return false;
        case ERTYPE.NormalAttribute.name:            return true;
        case ERTYPE.MultivaluedAttribute.name:       return true;
        case ERTYPE.WeakIdentifyingAttribute.name:   return false;

        case ERTYPE.StrongEntity.name:               return true;
        case ERTYPE.WeakEntity.name:                 return true;

        case ERTYPE.StrongRelation.name:             return true;
        case ERTYPE.WeakRelation.name:               return true;

        case ERTYPE.IsAStructure.name:               return false;
    }

}


export const handleSelectWeakIdentifyingAttribute = (selectedObject, connectionType, drawBoardElements, connections) => {

    if(! isAssociationConnectionType(connectionType)) return;

    return applyRules(drawBoardElements, connections, selectedObject,
        weakIdentifyingAttributeRule,
        pathDoesNotAlreadyExist,
        onlyAllowConnectToRelationOrEntityIfNoCurrentEntityOrRelationConnection,
        checkIfConnectionBetweenAttributesKeepsConsistencyOfAttributeStructure)
}


const weakIdentifyingAttributeRule = (element) => {

    switch (element.erType) {

        case ERTYPE.IdentifyingAttribute.name:       return false;
        case ERTYPE.NormalAttribute.name:            return false;
        case ERTYPE.MultivaluedAttribute.name:       return false;
        case ERTYPE.WeakIdentifyingAttribute.name:   return false;

        case ERTYPE.StrongEntity.name:               return false;
        case ERTYPE.WeakEntity.name:                 return true;

        case ERTYPE.StrongRelation.name:             return false;
        case ERTYPE.WeakRelation.name:               return false;

        case ERTYPE.IsAStructure.name:               return false;
    }

}


export const handleSelectStrongEntity = (selectedObject, connectionType, drawBoardElements, connections) => {

    if( !(isAssociationConnectionType(connectionType) || isInheritorConnectionType(connectionType))) return;

    return applyRules(drawBoardElements, connections, selectedObject,
        strongEntityRule,
        ifDestinationAttributePathDoesNotExist, //TODO Redundant mit relationOrEntityToAttributeIfAttributeHasNoRoot
        ifDestinationIsaPathDoesNotExist,
        relationOrEntityToAttributeIfAttributeHasNoRoot,
        checkWeakTypesConsistency,
        checkIfToWeakRelationItOnlyHasDeg2,
        ensureEntityAsSubTypeToIsANoMultipleInheritance,
        pathDoesMax2TimesExist) //TODO pathDoesMax2TimesExist, checkt ob ein pfad bereits existiert ?
}


const strongEntityRule = (element) => {

    switch (element.erType) {

        case ERTYPE.IdentifyingAttribute.name:       return true;
        case ERTYPE.NormalAttribute.name:            return true;
        case ERTYPE.MultivaluedAttribute.name:       return true;
        case ERTYPE.WeakIdentifyingAttribute.name:   return false;

        case ERTYPE.StrongEntity.name:               return false;
        case ERTYPE.WeakEntity.name:                 return false;

        case ERTYPE.StrongRelation.name:             return true;
        case ERTYPE.WeakRelation.name:               return true;

        case ERTYPE.IsAStructure.name:               return true;
    }

}

export const handleSelectWeakEntity = (selectedObject, connectionType, drawBoardElements, connections) => {

    if( !(isAssociationConnectionType(connectionType) || isInheritorConnectionType(connectionType))) return;

    return applyRules(drawBoardElements, connections, selectedObject,
        weakEntityRule,
        ifDestinationAttributePathDoesNotExist,
        ifDestinationIsaPathDoesNotExist,
        relationOrEntityToAttributeIfAttributeHasNoRoot,
        checkWeakTypesConsistency,
        checkIfToWeakRelationItOnlyHasDeg2,
        pathDoesNotAlreadyExist)

}

const weakEntityRule = (element) => {

    switch (element.erType) {

        case ERTYPE.IdentifyingAttribute.name:       return false;
        case ERTYPE.NormalAttribute.name:            return true;
        case ERTYPE.MultivaluedAttribute.name:       return true;
        case ERTYPE.WeakIdentifyingAttribute.name:   return true;

        case ERTYPE.StrongEntity.name:               return false;
        case ERTYPE.WeakEntity.name:                 return false;

        case ERTYPE.StrongRelation.name:             return true;
        case ERTYPE.WeakRelation.name:               return true;

        case ERTYPE.IsAStructure.name:               return false;
    }

}

export const handleSelectStrongRelation = (selectedObject, connectionType, drawBoardElements, connections) => {

    if(! isAssociationConnectionType(connectionType)) return;

    return applyRules(drawBoardElements, connections, selectedObject,
        strongRelationRule,
        ifDestinationAttributePathDoesNotExist,
        relationOrEntityToAttributeIfAttributeHasNoRoot,
        pathDoesMax2TimesExist,
        pathWeakRelToWeakEntityDoesMax1TimesExist)
}

const strongRelationRule = (element) => {

    switch (element.erType) {

        case ERTYPE.IdentifyingAttribute.name:       return false;
        case ERTYPE.NormalAttribute.name:            return true;
        case ERTYPE.MultivaluedAttribute.name:       return true;
        case ERTYPE.WeakIdentifyingAttribute.name:   return false;

        case ERTYPE.StrongEntity.name:               return true;
        case ERTYPE.WeakEntity.name:                 return true;

        case ERTYPE.StrongRelation.name:             return false;
        case ERTYPE.WeakRelation.name:               return false;

        case ERTYPE.IsAStructure.name:               return false;
    }

}

export const handleSelectWeakRelation = (selectedObject, connectionType, drawBoardElements, connections) => {

    if(! isAssociationConnectionType(connectionType)) return;

    return applyRules(drawBoardElements, connections, selectedObject,
        weakRelationRule,
        ifDestinationAttributePathDoesNotExist,
        relationOrEntityToAttributeIfAttributeHasNoRoot,
        checkWeakTypesConsistency,
        checkWeakRelationHasOnly2Entities,
        pathDoesNotAlreadyExist)
}

const checkWeakRelationHasOnly2Entities = (element, connections, selectedObject, drawBoardElements) => {

    //Rule applies only if element to connect is of type StrongEntity or WeakEntity
    if( element.erType !== ERTYPE.StrongEntity.name && element.erType !== ERTYPE.WeakEntity.name) return true;

    const connectionsToElement = getConnectorsOfObject(selectedObject, connections);
    const connectedElements = getOtherElementsOfConnectors(selectedObject, connectionsToElement, drawBoardElements)
    const entities = connectedElements.filter(connectedElement => connectedElement.erType === ERTYPE.StrongEntity.name || connectedElement.erType === ERTYPE.WeakEntity.name)

    return entities.length < 2;

}

//Rule for weak and storn gentity
//Rule applied from weak and strong entity
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

const weakRelationRule = (element) => {

    switch (element.erType) {

        case ERTYPE.IdentifyingAttribute.name:       return false;
        case ERTYPE.NormalAttribute.name:            return true;
        case ERTYPE.MultivaluedAttribute.name:       return true;
        case ERTYPE.WeakIdentifyingAttribute.name:   return false;

        case ERTYPE.StrongEntity.name:               return true;
        case ERTYPE.WeakEntity.name:                 return true;

        case ERTYPE.StrongRelation.name:             return false;
        case ERTYPE.WeakRelation.name:               return false;

        case ERTYPE.IsAStructure.name:               return false;
    }

}
/*TODO

Funktionen:
GetSuperTypes

GetSubTypes


GetCompleteSuperTypes
    var a = new List
    var subTypes = getSubTypes(entity)
    for each subType of subTypes
        a.Add(subType)
        a.AddAll(subtype.getSuperTypes)


GetCompleteSuperTypesOfIsA
    var a = new list.
    Foreach subtype of isa
        a.AddAll(GetReferencedSuperTypes(subtype))

Algo as Child / Subtype
    var a = GetCompleteSuperTypes(Entity)
    var b = isa.getParent.getSupertypes()

    return a disjunkt b

Alsog as parent / supertype
    var a = GetCompleteSuperTypesOfIsA(isa)
    var b = entity.getSupertypes()


var untertypen = funct1(me)
foreach untertypen : funct2(untertyp)

Für eine Entität alle obertypen heraufinden



   Algo:
   1. Als Untertyp
      var vererbt = Funct1(Me)



   2. Obertypen
   var meineTypen = funct1(Me)

   var untertypenIsa = isa.getUntertypen
   var UntertypenMengeIsa = forEach(UntertypenIsa) funct1(untertyp)

   var Untertypen = funct2(ME)
   var UntertypenMenge = forEach(Untertypen + ME) funct1(untertyp)



1. Untertypen

Erst schauen, von was erbt mein Typ akutell

Dann schauen, von was erben meine Untertypen akutell
Diese mengen vereineigen


Dann schauen, von was erbt der Obertyp der ISa

diese menge muss disjunkt sein.


2. Obertyp
Erst schauen, von was erbt mein Typ aktuell
Menge 1

Dann schauen, von was erben die Untertypen der isa
Menge 2

1 und 2 muss disjunkt sien
*/


/**
 *
 * @param element The element to check
 * @param connections
 * @param selectedObject The selected isA structure
 * @param drawBoardElements
 */
export const ensureEntityAsSubTypeToIsANoMultipleInheritance = (element, connections, selectedObject, drawBoardElements) => {

    //Rule only applies to isa and entity
    if( (element.erType        === ERTYPE.IsAStructure.name && selectedObject.erType === ERTYPE.StrongEntity.name) ||
        (selectedObject.erType === ERTYPE.IsAStructure.name && element.erType        === ERTYPE.StrongEntity.name) ) {


        const {isa, entity} = resolveEntityIsA(element, selectedObject)

        let superType = getSuperTypeOfIsA(isa, connections, drawBoardElements)

        addFakeMissingSuperTypes(drawBoardElements, connections);
        //ensure circle free //E1 -> A1       A1->  E3   E3 -> A3
        //E1 -> A2       A2 -> E4   E4 -> A3   //collision!
        //if(superType == null){
        //return ensureEntityAsSubTypeToIsANoMultipleInheritance_handleNoSupertype(element, connections, selectedObject, drawBoardElements)
        // }

        if (superType == null) superType = isa.fakeSuperType;

        const impactedSet = collectImpactedEntitySet(entity, connections, drawBoardElements)

        const superTypeSet = collectSuperTypeSetOfEntity(superType, connections, drawBoardElements)

        removeFakeMissingSuperTypes(drawBoardElements, connections);


        return areCollectionsDisjoint(superTypeSet, impactedSet);
        //if( ! areCollectionsDisjoint(superTypeSet, impactedSet) ) return false;

        //return ensureEntityAsSubTypeToIsANoMultipleInheritance_handleNoSupertype(element, connections, selectedObject, drawBoardElements)
    }

    return true;
}

const removeFakeMissingSuperTypes = (drawBoardElements, connections) => {
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
/*
//normal mache ich folgendes. ich nehm mir die obertypenmenge der isa und vergleich sie mit der gesammtmege der 7ner entitty. Jetzt hab ich die 0 ner nicht.
// Deswegen muss schauen, dass ich die  "quasi" nachbau
export const ensureEntityAsSubTypeToIsANoMultipleInheritance_handleNoSupertype = (element, connections, selectedObject, drawBoardElements) => {
    const {isa, entity} = resolveEntityIsA(element, selectedObject)

    console.log("CONNECTIONS IN ENSURE HANDLE SPECIAL CASE")
    console.log(connections)
    const inheritedIsAsOfEntity = [];
    getAllInheritedIsAs(entity, connections, drawBoardElements, inheritedIsAsOfEntity)

    //If the currently selected isa has no supertype but is in the list of the already inherited isAs then there is no connection allowed
    if(collectionContains(isa, inheritedIsAsOfEntity)) return false;

    const inheritedIsAsOfIsA = [];
    const superType = getSuperTypeOfIsA(isa, connections, drawBoardElements);
    if(superType == null) return true;
    //Why? This is because the isa is not connected to any of the inherited isAs


    getAllInheritedIsAs(superType, connections, drawBoardElements, inheritedIsAsOfIsA)

    return areCollectionsDisjoint(inheritedIsAsOfEntity, inheritedIsAsOfIsA);

    //nein sie sind nicht disjunkt -> false
    //ja sie sind disjunkt -> true


    //getAllInheritedIsAs
    //1. getAllInheritedIsAsOfStrongEntity7
    //2. isCurrentIsAConnectedToInheritedIsAs
    //    When true return false

    //const subTypes = getSubTypesOfIsA(isa, connections, drawBoardElements)
    //const isAs = [];

    //for(let subType of subTypes) {
    //    let upperLayerIsAsOfEntity = getAllInheritedIsAs(subType, connections, drawBoardElements);
    //    addAllIfNotExists(upperLayerIsAsOfEntity, isAs)
    //}
    //if(collectionContains(entity, isAs) ) return false;
    //return true;
}

const getAllInheritedIsAs = (subType, connections, drawBoardElements, inheritedIsAs) => {
    if(subType == null) return; //no need to check more, all above isa s for this isa are already resolved (must be as there is no supertype of the previous isa

    const parentIsAs = getIsAsWhichInheritorIsTheEntity(subType, connections, drawBoardElements)
    addAllIfNotExists(parentIsAs, inheritedIsAs)
    for(let isA of parentIsAs){
        const superType = getSuperTypeOfIsA(isA, connections, drawBoardElements);
        getAllInheritedIsAs(superType, connections, drawBoardElements, inheritedIsAs)
    }
}
*/
/*
export const ensureEntityAsSubTypeToIsANoMultipleInheritance_handleSpecialCase = (element, connections, selectedObject, drawBoardElements) => {
    const {isa, entity} = resolveEntityIsA(element, selectedObject)

    const superType = getSuperTypeOfIsA(isa, connections, drawBoardElements)

    const impactedEntities = collectImpactedEntitySet(entity, connections, drawBoardElements);

    const upperLayerIsAsOfImpactedEntities = [];
    for(let entity of impactedEntities) {
        let upperLayerIsAsOfEntity = getIsAsWhichInheritorIsTheEntity(entity, connections, drawBoardElements);
        addAllIfNotExists(upperLayerIsAsOfEntity, upperLayerIsAsOfImpactedEntities)
    }
    //TODO das reicht nicht...
    //ERste idee.. hole von den den subtypen der isa die impacted entity set, prüfe sodann ob das element darin vorkommt
    //ich brauh auf jeden fall erstmal alle elemente die von der isa erben

    const impactedSet2 = []
    const subTypesOfIsA = getSubTypesOfIsA(isa, connections, drawBoardElements)
    for (let subType of subTypesOfIsA){
        let impactedEntities = collectImpactedEntitySet(subType, connections, drawBoardElements)
        addAllIfNotExists(impactedEntities, impactedSet2)
    }

    //Bei all den elementen, darf ich mich nicht zu einer verbinden, welche


    if(collectionContains(isa, upperLayerIsAsOfImpactedEntities) ) return false;
    return true;

}
 */

const collectionContains = (element, collection) => {
    return collection.indexOf(element) !== -1;
}

export const ensureEntityAsSuperTypeToIsANoMultipleInheritance = (element, connections, selectedObject, drawBoardElements) => {

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

export const areCollectionsDisjoint = (firstCollection, secondCollection) => {

    for(let element of firstCollection){
        if(secondCollection.indexOf(element) !== -1) return false;
    }
    return true;
}

export const resolveEntityIsA = (firstElement, secondElement) => {
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
    console.log("A")
    console.log(element)
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



export const handleSelectIsAStructure = (selectedObject, connectionType, drawBoardElements, connections) => {

    if( !(isParentConnectionType(connectionType) || isInheritorConnectionType(connectionType))) return;

    if( isParentConnectionType(connectionType))
        return applyRules(drawBoardElements, connections, selectedObject, isAStructureRule, pathDoesNotAlreadyExist, onlyOneParentAllowed, ensureEntityAsSuperTypeToIsANoMultipleInheritance)

    return applyRules(drawBoardElements, connections, selectedObject, isAStructureRule, pathDoesNotAlreadyExist, ensureEntityAsSubTypeToIsANoMultipleInheritance)
}

const onlyOneParentAllowed = (element, connections, selectedObject, drawBoardElements) => {

    const connectionsToElement = getConnectorsOfObject(selectedObject, connections);
    const parents = connectionsToElement.filter(connection => connection.connectionType === ConnectionType.parent)

    return parents.length < 1;
}

const isAStructureRule = (element) => {

    switch (element.erType) {

        case ERTYPE.IdentifyingAttribute.name:       return false;
        case ERTYPE.NormalAttribute.name:            return false;
        case ERTYPE.MultivaluedAttribute.name:       return false;
        case ERTYPE.WeakIdentifyingAttribute.name:   return false;

        case ERTYPE.StrongEntity.name:               return true;
        case ERTYPE.WeakEntity.name:                 return false;

        case ERTYPE.StrongRelation.name:             return false;
        case ERTYPE.WeakRelation.name:               return false;

        case ERTYPE.IsAStructure.name:               return false;
    }

}


/**
 *
 * @param element
 * @param connections
 * @param drawBoardElements
 * @returns {*}
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
export const getSubTypesOfIsA = (element, connections, drawBoardElements) => {
    const inheritorConnections =  getConnectorsOfObject(element, connections).filter(connection => connection.connectionType === ConnectionType.inheritor);
    const subTypes = getOtherElementsOfConnectors(element, inheritorConnections, drawBoardElements);

    return subTypes;
}

/**
 *
 * @param element
 * @param connections
 * @param drawBoardElements
 * @returns {*}
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
export const getSuperTypeOfIsA = (element, connections, drawBoardElements) => {
    const parentConnections =  getConnectorsOfObject(element, connections).filter(connection => connection.connectionType === ConnectionType.parent);
    const superType = getOtherElementsOfConnectors(element, parentConnections, drawBoardElements)[0];

    return superType;
}


/**
 *
 * @param element
 * @param connections
 * @param drawBoardElements
 * @returns {*}
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
export const getIsAsWhichParentIsTheEntity = (element, connections, drawBoardElements) => {
    const inheritorConnections =  getConnectorsOfObject(element, connections).filter(connection => connection.connectionType === ConnectionType.parent);
    const subTypes = getOtherElementsOfConnectors(element, inheritorConnections, drawBoardElements);

    return subTypes;
}

/**
 *
 * @param element
 * @param connections
 * @param drawBoardElements
 * @returns {*}
 *
 *  IsA 1     IsA 2
 *     |      |  (inheritor connection)
 *      Entity
 *     |      |  (parent connection)
 *  IsA 3     IsA 4
 *
 * Returns IsA 1, IsA 2
 */
export const getIsAsWhichInheritorIsTheEntity = (element, connections, drawBoardElements) => {
    const parentConnections =  getConnectorsOfObject(element, connections).filter(connection => connection.connectionType === ConnectionType.inheritor);
    const superType = getOtherElementsOfConnectors(element, parentConnections, drawBoardElements);

    return superType;
}

