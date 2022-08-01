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
                        ensureIsACircleFree,
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
    const {isa, entity} = resolveEntityIsA(element, selectedObject)

    const impactedSet = collectImpactedIsAEntitySet(selectedObject, connections, entity)
    const superTypes = collectAllIsASuperTypes(selectedObject, connections, isa)

}

export const ensureEntityAsSuperTypeToIsANoMultipleInheritance = (element, connections, selectedObject, drawBoardElements) => {

    const {isa, entity} = resolveEntityIsA(element, selectedObject);

    const subTypes = collectAllIsASubTypes(isa, connections, drawBoardElements);
    const impactedSet = [];

    for (let subType of subTypes){
        addAllIfNotExists(collectImpactedIsAEntitySet(element, connections, drawBoardElements), impactedSet)
    }

    const superTypes = collectAllIsASuperTypes(selectedObject, connections, drawBoardElements)
    return areCollectionsDisjoint(impactedSet, superTypes)
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


export const getSubTypesOfIsA = (element, connections, drawBoardElements) => {
    const inheritorConnections =  getConnectorsOfObject(element, connections).filter(connection => connection.type === ConnectionType.inheritor);
    const subTypes = getOtherElementsOfConnectors(element, inheritorConnections, drawBoardElements)[0];
    console.log(subTypes)
    return subTypes;
}

export const getSuperTypeOfIsA = (element, connections, drawBoardElements) => {
    const parentConnections =  getConnectorsOfObject(element, connections).filter(connection => connection.type === ConnectionType.parent);
    const superType = getOtherElementsOfConnectors(element, parentConnections, drawBoardElements)[0];
    console.log(superType)
    return superType;
}

// -- super types
const collectAllIsASuperTypes = (element, connections, drawBoardElements) => {
    let collectedElements = [];
    collectIsASuperTypesRecursive(element, connections, drawBoardElements, collectedElements)
    return collectedElements;
}

const collectIsASuperTypesRecursive = (element, connections, drawBoardElements, collectedElements) => {
    let superType = getSuperTypeOfIsA(element, connections, drawBoardElements);
    addIfNotExists(superType, collectedElements)

    collectIsASuperTypesRecursive(element, connections, drawBoardElements, collectedElements)

}

//-- sub types
const collectAllIsASubTypes = (element, connections, drawBoardElements) => {
    let collectedElements = [];
    collectIsASuperTypesRecursive(element, connections, drawBoardElements, collectedElements)
    return collectedElements;
}

const collectIsASubTypesRecursive = (element, connections, drawBoardElements, collectedElements) => {
    let subTypes = getSubTypesOfIsA(element, connections, drawBoardElements);
    addAllIfNotExists(subTypes, collectedElements)

    for (let subType of subTypes){
        collectIsASubTypesRecursive(element, connections, drawBoardElements, collectedElements)
    }
}



const collectImpactedIsAEntitySet = (element, connections, drawBoardElements) => {
    const impactedEntitySet = [];

    const allSubTypes = collectAllIsASubTypes(element, connections, drawBoardElements);
    addAllIfNotExists(impactedEntitySet)

    for (let subType of allSubTypes){
        const superTypesOfSubType = collectAllIsASuperTypes(element, connections, drawBoardElements)
        addAllIfNotExists(superTypesOfSubType)
    }
    return impactedEntitySet;
}



export const handleSelectIsAStructure = (selectedObject, connectionType, drawBoardElements, connections) => {

    if( !(isParentConnectionType(connectionType) || isInheritorConnectionType(connectionType))) return;

    if( isParentConnectionType(connectionType))
    return applyRules(drawBoardElements, connections, selectedObject, isAStructureRule, pathDoesNotAlreadyExist, onlyOneParentAllowed, ensureIsACircleFree)

    return applyRules(drawBoardElements, connections, selectedObject, isAStructureRule, pathDoesNotAlreadyExist, ensureIsACircleFree)
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


