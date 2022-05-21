import {ConnectionType} from "../Model/Diagram";


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

