import {ConnectionType} from "../Model/Diagram";
import {ERTYPE, ERTYPECATEGORY, returnNamesOfCategory} from "../Model/ErType";
import {resolveObjectById} from "../Components/Util/ObjectUtil";


export const isAssociationConnectionType = (connectionType) => {
    return connectionType === ConnectionType.association;
}

export const isParentConnectionType = (connectionType) => {
    return connectionType === ConnectionType.parent;
}

export const isInheritorConnectionType = (connectionType) => {
    return connectionType === ConnectionType.inheritor;
}


export const pathDoesNotAlreadyExist = (element, connections, selectedObject) => {

    //Check if path of type Element --> SelectedObject or SelectedObject <-- Element exist

    const samePathConnections  =
        connections.filter(connection => connection.start === element.id        && connection.end === selectedObject.id)
            .filter(connection => connection.start === selectedObject.id && connection.end === element.id)

    return samePathConnections.length === 0
}

export const ifDestinationAttributePathDoesNotExist = (element, connections, selectedObject) => {
    const attributeTypes = returnNamesOfCategory(ERTYPECATEGORY.Attribute);
    const isAttributeType = (attributeTypes.find(element.erType) !== -1);

    if(isAttributeType)
        return pathDoesNotAlreadyExist(element, connections, selectedObject);

    return true;
}

export const ifDestinationIsaPathDoesNotExist = (element, connections, selectedObject) => {

    if(element.erType === ERTYPE.IsAStructure.name)
        return pathDoesNotAlreadyExist(element, connections, selectedObject);

    return true;
}

/**
 * An attribute is only allowed to connect to another relation or entity
 * if it has no current connection to an entity or relation
 *
 * This method returns false, if the given element is of type relation or entity and
 * the selectedObject (type attribute) has a direct connection to an entity or relation
 *
 * @param element The element to apply the rule to
 * @param connections All connections on the draw board
 * @param selectedObject The selected Object
 * @returns {boolean} True, if rules succeeds
 */
export const onlyAllowConnectToRelationOrEntityIfNoCurrentEntityOrRelationConnection = (element, connections, selectedObject) => {

    if(! isElementOfCategoryEntityOrRelation()) return true;

    //Destination is of type Entity or Relation
    const connectorsOfSelectedObject =
        connections.filter(connection => connection.end === selectedObject.id || connection.start === selectedObject.id)

    if(connectorsOfSelectedObject.length === 0) return true;

    connectorsOfSelectedObject.forEach( connection => {
        let otherObject;

        if(connection.start === selectedObject.id) otherObject = resolveObjectById(connection.end)
        else otherObject = resolveObjectById(connection.start)

        if(isElementOfCategoryEntityOrRelation(otherObject)) return false;
    })

    return true;
}

const isElementOfCategoryEntityOrRelation = (element) => {
    const entityTypes = returnNamesOfCategory(ERTYPECATEGORY.Entity);
    const relationTypes = returnNamesOfCategory(ERTYPECATEGORY.Relation);

    const isEntityCategory = entityTypes.find(element.erType) !== -1
    const isRelationCategory = relationTypes.find(element.erType) !== -1

    return isEntityCategory || isRelationCategory;
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
export const applyRules = (elements, connections, selectedObject, ...rules) => {

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

