import {ERTYPE} from "../DrawBoardModel/ErType";
import {
    ifDestinationAttributePathDoesNotExist,
    ifDestinationIsaPathDoesNotExist,
    isAssociationConnectionType,
    isInheritorConnectionType,
    isParentConnectionType,
    pathDoesMax2TimesExist,
    pathDoesNotAlreadyExist,
} from "./ErRulesUtil";
import ErRulePipeline from "./ErRulePipeline";
import IsAEntityRules from "./EntityIsARules";
import WeakTypeRules from "./WeakTypeRules";
import AttributeRules from "./AttributeRules";

/**
 * Here all transition functions are defined.
 * In addition, all Er element specific rules are defined here.
 * All other rules are defined in the ...
 *
 * Each rule will be executed with
 * - the selectedObject
 * - the connectionType
 * - all drawBoardElements
 * - all connections
 */


const handleSelectIdentifyingAttribute = (selectedObject, connectionType, drawBoardElements, connections) => {

    if(! isAssociationConnectionType(connectionType)) return;

    return ErRulePipeline.applyRules(drawBoardElements, connections, selectedObject,
        identifyingAttributeRule,
        pathDoesNotAlreadyExist,
        AttributeRules.onlyAllowConnectToRelationOrEntityIfNoCurrentEntityOrRelationConnection,
        AttributeRules.checkIfConnectionBetweenAttributesKeepsConsistencyOfAttributeStructure)
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


const handleSelectNormalAttribute = (selectedObject, connectionType, drawBoardElements, connections) => {

    if(! isAssociationConnectionType(connectionType)) return;

    return ErRulePipeline.applyRules(drawBoardElements, connections, selectedObject,
        normalAttributeRule,
        pathDoesNotAlreadyExist,
        AttributeRules.onlyAllowConnectToRelationOrEntityIfNoCurrentEntityOrRelationConnection,
        AttributeRules.checkIfConnectionBetweenAttributesKeepsConsistencyOfAttributeStructure)
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


const handleSelectMultivaluedAttribute = (selectedObject, connectionType, drawBoardElements, connections) => {

    if(! isAssociationConnectionType(connectionType)) return;

    return ErRulePipeline.applyRules(drawBoardElements, connections, selectedObject,
        multivaluedAttributeRule,
        pathDoesNotAlreadyExist,
        AttributeRules.onlyAllowConnectToRelationOrEntityIfNoCurrentEntityOrRelationConnection,
        AttributeRules.checkIfConnectionBetweenAttributesKeepsConsistencyOfAttributeStructure)
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


const handleSelectWeakIdentifyingAttribute = (selectedObject, connectionType, drawBoardElements, connections) => {

    if(! isAssociationConnectionType(connectionType)) return;

    return ErRulePipeline.applyRules(drawBoardElements, connections, selectedObject,
        weakIdentifyingAttributeRule,
        pathDoesNotAlreadyExist,
        AttributeRules.onlyAllowConnectToRelationOrEntityIfNoCurrentEntityOrRelationConnection,
        AttributeRules.checkIfConnectionBetweenAttributesKeepsConsistencyOfAttributeStructure)
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


const handleSelectStrongEntity = (selectedObject, connectionType, drawBoardElements, connections) => {

    if( !(isAssociationConnectionType(connectionType) || isInheritorConnectionType(connectionType))) return;

    return ErRulePipeline.applyRules(drawBoardElements, connections, selectedObject,
        strongEntityRule,
        ifDestinationAttributePathDoesNotExist,
        ifDestinationIsaPathDoesNotExist,
        AttributeRules.relationOrEntityToAttributeIfAttributeHasNoRoot,
        WeakTypeRules.checkWeakTypesConsistency,
        WeakTypeRules.checkIfToWeakRelationItOnlyHasDeg2,
        WeakTypeRules.checkWeakTypesCircleFree,
        IsAEntityRules.ensureEntityAsSubTypeToIsANoMultipleInheritance,
        pathDoesMax2TimesExist)
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

const handleSelectWeakEntity = (selectedObject, connectionType, drawBoardElements, connections) => {

    if( !(isAssociationConnectionType(connectionType) || isInheritorConnectionType(connectionType))) return;

    return ErRulePipeline.applyRules(drawBoardElements, connections, selectedObject,
        weakEntityRule,
        ifDestinationAttributePathDoesNotExist,
        ifDestinationIsaPathDoesNotExist,
        AttributeRules.relationOrEntityToAttributeIfAttributeHasNoRoot,
        WeakTypeRules.checkWeakTypesConsistency,
        WeakTypeRules.checkIfToWeakRelationItOnlyHasDeg2,
        WeakTypeRules.checkWeakTypesCircleFree,
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

const handleSelectStrongRelation = (selectedObject, connectionType, drawBoardElements, connections) => {

    if(! isAssociationConnectionType(connectionType)) return;

    return ErRulePipeline.applyRules(drawBoardElements, connections, selectedObject,
        strongRelationRule,
        ifDestinationAttributePathDoesNotExist,
        AttributeRules.relationOrEntityToAttributeIfAttributeHasNoRoot,
        pathDoesMax2TimesExist,
        WeakTypeRules.pathRelToWeakEntityDoesMax1TimesExist)
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

const handleSelectWeakRelation = (selectedObject, connectionType, drawBoardElements, connections) => {

    if(! isAssociationConnectionType(connectionType)) return;

    return ErRulePipeline.applyRules(drawBoardElements, connections, selectedObject,
        weakRelationRule,
        ifDestinationAttributePathDoesNotExist,
        AttributeRules.relationOrEntityToAttributeIfAttributeHasNoRoot,
        WeakTypeRules.checkWeakTypesConsistency,
        WeakTypeRules.checkWeakRelationHasOnly2Entities,
        WeakTypeRules.checkWeakTypesCircleFree,
        pathDoesNotAlreadyExist)
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

const handleSelectIsAStructure = (selectedObject, connectionType, drawBoardElements, connections) => {

    if( !(isParentConnectionType(connectionType) || isInheritorConnectionType(connectionType))) return;

    if( isParentConnectionType(connectionType))
        return ErRulePipeline.applyRules(drawBoardElements, connections, selectedObject,
            isAStructureRule,
            pathDoesNotAlreadyExist,
            IsAEntityRules.onlyOneParentAllowed,
            IsAEntityRules.ensureEntityAsSuperTypeToIsANoMultipleInheritance)

    return ErRulePipeline.applyRules(drawBoardElements, connections, selectedObject,
        isAStructureRule,
        pathDoesNotAlreadyExist,
        IsAEntityRules.ensureEntityAsSubTypeToIsANoMultipleInheritance)
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

const TransitionFunction = {
    handleSelectIdentifyingAttribute: handleSelectIdentifyingAttribute,
    handleSelectNormalAttribute:handleSelectNormalAttribute,
    handleSelectMultivaluedAttribute:handleSelectMultivaluedAttribute,
    handleSelectWeakIdentifyingAttribute:handleSelectWeakIdentifyingAttribute,
    handleSelectStrongEntity:handleSelectStrongEntity,
    handleSelectWeakEntity:handleSelectWeakEntity,
    handleSelectStrongRelation:handleSelectStrongRelation,
    handleSelectWeakRelation:handleSelectWeakRelation,
    handleSelectIsAStructure:handleSelectIsAStructure
}

export default TransitionFunction;