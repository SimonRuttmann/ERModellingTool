import {resolveObjectById} from "./Components/Util/ObjectUtil";
import {ERTYPE} from "./Model/ErType";
import {ConnectionType} from "./Model/Diagram";


export const createSelection = (id, connectionType, drawBoardElements, connections) => {
    let selectedObject = resolveObjectById(id, drawBoardElements, connections)


    const type = selectedObject.erType;
    let appliedRule;

    switch (type) {

        case ERTYPE.IdentifyingAttribute.name:       appliedRule = handleSelectIdentifyingAttribute;    break;
        case ERTYPE.NormalAttribute.name:            appliedRule = handleSelectNormalAttribute;         break;
        case ERTYPE.MultivaluedAttribute.name:       appliedRule = handleSelectMultivaluedAttribute;    break;
        case ERTYPE.WeakIdentifyingAttribute.name:   appliedRule = handleSelectWeakIdentifyingAttribute;break;

        case ERTYPE.StrongEntity.name:               appliedRule = handleSelectStrongEntity;            break;
        case ERTYPE.WeakEntity.name:                 appliedRule = handleSelectWeakEntity;              break;

        case ERTYPE.StrongRelation.name:             appliedRule = handleSelectStrongRelation;          break;
        case ERTYPE.WeakRelation.name:               appliedRule = handleSelectWeakRelation;            break;

        case ERTYPE.IsAStructure.name:               appliedRule = handleSelectIsAStructure;            break;
    }

    const copiedDrawBoardElements = [...drawBoardElements]
    const selectableDrawBoardElements = appliedRule(selectedObject, connectionType, copiedDrawBoardElements, connections)

    //MARK ELEMENTS!
    console.log(selectableDrawBoardElements)
    return selectableDrawBoardElements;

}
/*
switch (connectionType){
    case ConnectionType.inheritor:
    case ConnectionType.parent:
    case ConnectionType.association:
}

 */

const isAssociationConnectionType = (connectionType) => {
    return connectionType === ConnectionType.association;
}

const isParentConnectionType = (connectionType) => {
    return connectionType === ConnectionType.parent;
}

const isInheritorConnectionType = (connectionType) => {
    return connectionType === ConnectionType.inheritor;
}


const pathDoesNotAlreadyExist = (element, connections, selectedObject) => {

    //Check if path of type Element --> SelectedObject or SelectedObject <-- Element exist

    const samePathConnections  =
        connections.filter(connection => connection.start === element.id        && connection.end === selectedObject.id)
            .filter(connection => connection.start === selectedObject.id && connection.end === element.id)

    return samePathConnections.length === 0
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
const applyRules = (elements, connections, selectedObject, ...rules) => {

    return elements.filter(element => {

        for (let rule of rules){

            if(! rule(element, connections, selectedObject)) {
                //Element did not pass a rule
                return false;
            }

        }

        //Element did pass all rules
        return true;
    })
}


const handleSelectIdentifyingAttribute = (selectedObject, connectionType, drawBoardElements, connections) => {

    if(! isAssociationConnectionType(connectionType)) return;

    return applyRules(drawBoardElements, connections, selectedObject, identifyingAttributeRule, pathDoesNotAlreadyExist)
    //TODO keine zyklischen verbindungen!
}


const identifyingAttributeRule = (element) => {

    switch (element.erType.name) {

        case ERTYPE.IdentifyingAttribute.name:       return true;
        case ERTYPE.NormalAttribute.name:            return true;
        case ERTYPE.MultivaluedAttribute.name:       return true;
        case ERTYPE.WeakIdentifyingAttribute.name:   return false;

        case ERTYPE.StrongEntity.name:               return true;
        case ERTYPE.WeakEntity.name:                 return false;

        case ERTYPE.StrongRelation.name:             return true;
        case ERTYPE.WeakRelation.name:               return false;

        case ERTYPE.IsAStructure.name:               return false;
    }

}


const handleSelectNormalAttribute = (selectedObject, connectionType, drawBoardElements, connections) => {

    if(! isAssociationConnectionType(connectionType)) return;

    return applyRules(drawBoardElements, connections, selectedObject, normalAttributeRule, pathDoesNotAlreadyExist)
}


const normalAttributeRule = (element) => {

    switch (element.erType.name) {

        case ERTYPE.IdentifyingAttribute.name:       return true;
        case ERTYPE.NormalAttribute.name:            return true;
        case ERTYPE.MultivaluedAttribute.name:       return true;
        case ERTYPE.WeakIdentifyingAttribute.name:   return true;

        case ERTYPE.StrongEntity.name:               return true;
        case ERTYPE.WeakEntity.name:                 return true;

        case ERTYPE.StrongRelation.name:             return true;
        case ERTYPE.WeakRelation.name:               return true;

        case ERTYPE.IsAStructure.name:               return false;
    }

}


const handleSelectMultivaluedAttribute = (selectedObject, connectionType, drawBoardElements, connections) => {

    if(! isAssociationConnectionType(connectionType)) return;

    return applyRules(drawBoardElements, connections, selectedObject, multivaluedAttributeRule, pathDoesNotAlreadyExist)
}


const multivaluedAttributeRule = (element) => {

    switch (element.erType.name) {

        case ERTYPE.IdentifyingAttribute.name:       return true;
        case ERTYPE.NormalAttribute.name:            return true;
        case ERTYPE.MultivaluedAttribute.name:       return true;
        case ERTYPE.WeakIdentifyingAttribute.name:   return true;

        case ERTYPE.StrongEntity.name:               return true;
        case ERTYPE.WeakEntity.name:                 return true;

        case ERTYPE.StrongRelation.name:             return true;
        case ERTYPE.WeakRelation.name:               return true;

        case ERTYPE.IsAStructure.name:               return false;
    }

}


const handleSelectWeakIdentifyingAttribute = (selectedObject, connectionType, drawBoardElements, connections) => {

    if(! isAssociationConnectionType(connectionType)) return;

    return applyRules(drawBoardElements, connections, selectedObject, weakIdentifyingAttributeRule, pathDoesNotAlreadyExist)
}


const weakIdentifyingAttributeRule = (element) => {

    switch (element.erType.name) {

        case ERTYPE.IdentifyingAttribute.name:       return false;
        case ERTYPE.NormalAttribute.name:            return true;
        case ERTYPE.MultivaluedAttribute.name:       return true;
        case ERTYPE.WeakIdentifyingAttribute.name:   return true;

        case ERTYPE.StrongEntity.name:               return false;
        case ERTYPE.WeakEntity.name:                 return true;

        case ERTYPE.StrongRelation.name:             return false;
        case ERTYPE.WeakRelation.name:               return true;

        case ERTYPE.IsAStructure.name:               return false;
    }

}


const handleSelectStrongEntity = (selectedObject, connectionType, drawBoardElements, connections) => {

    if( !(isAssociationConnectionType(connectionType) || isInheritorConnectionType(connectionType))) return;

    return applyRules(drawBoardElements, connections, selectedObject, strongEntityRule)
    //TODO path to isa does not already exist or attribute
}


const strongEntityRule = (element) => {

    switch (element.erType.name) {

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

    return applyRules(drawBoardElements, connections, selectedObject, weakEntityRule)

}

const weakEntityRule = (element) => {

    switch (element.erType.name) {

        case ERTYPE.IdentifyingAttribute.name:       return false;
        case ERTYPE.NormalAttribute.name:            return true;
        case ERTYPE.MultivaluedAttribute.name:       return true;
        case ERTYPE.WeakIdentifyingAttribute.name:   return true;

        case ERTYPE.StrongEntity.name:               return false;
        case ERTYPE.WeakEntity.name:                 return false;

        case ERTYPE.StrongRelation.name:             return true;
        case ERTYPE.WeakRelation.name:               return true;

        case ERTYPE.IsAStructure.name:               return true;
    }

}

const handleSelectStrongRelation = (selectedObject, connectionType, drawBoardElements, connections) => {

    if(! isAssociationConnectionType(connectionType)) return;

    return applyRules(drawBoardElements, connections, selectedObject, strongRelationRule)
}

const strongRelationRule = (element) => {

    switch (element.erType.name) {

        case ERTYPE.IdentifyingAttribute.name:       return true;
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

    return applyRules(drawBoardElements, connections, selectedObject, weakRelationRule)
}

const weakRelationRule = (element) => {

    switch (element.erType.name) {

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

    return applyRules(drawBoardElements, connections, selectedObject, isAStructureRule, pathDoesNotAlreadyExist)
}

const isAStructureRule = (element) => {

    switch (element.erType.name) {

        case ERTYPE.IdentifyingAttribute.name:       return false;
        case ERTYPE.NormalAttribute.name:            return false;
        case ERTYPE.MultivaluedAttribute.name:       return false;
        case ERTYPE.WeakIdentifyingAttribute.name:   return false;

        case ERTYPE.StrongEntity.name:               return true;
        case ERTYPE.WeakEntity.name:                 return true;

        case ERTYPE.StrongRelation.name:             return false;
        case ERTYPE.WeakRelation.name:               return false;

        case ERTYPE.IsAStructure.name:               return true;
    }

}








//Todo Ein to do ist noch offen, es muss noch die breite / höhe abhängig von der anzahl der zeichen ermittellt werden