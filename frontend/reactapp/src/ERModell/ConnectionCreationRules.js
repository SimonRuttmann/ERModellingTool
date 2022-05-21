import {OBJECTTYPE} from "./Model/ActionState";
import {resolveObjectById} from "./Components/Util/ObjectUtil";
import {ERTYPECATEGORY} from "./Model/ErType";
import {AssociationTypeDetails, ConnectionType} from "./Model/Diagram";


export const createConnection = (drawBoardElements, idStart, idEnd, connectionInformation) => {

    let startId = idStart;
    let endId = idEnd;

    let startElement = resolveObjectById(idStart, drawBoardElements);
    let endElement = resolveObjectById(idEnd, drawBoardElements);

    let withLabel = true;
    let connectionType;
    let withArrow = false;
    let associationTypeDetails = AssociationTypeDetails.association;

    //Connections to attributes do not have cardinality
    if(isPartOfAttribute(startElement, endElement)) {
        withLabel = false;
        connectionType = ConnectionType.association;
        associationTypeDetails = AssociationTypeDetails.attributeConnector;
    }

    //Connections to/from IsA-Structures do not have cardinality
    //Connections to/from IsA-Structures have an arrow on the end side
    //Connections to/from IsA-Structures are directed based on their association type
    if(isPartOfIsA(startElement, endElement)) {

        withLabel = false;
        withArrow = true;

        switch (connectionInformation){
            case ConnectionType.parent:

                connectionType = ConnectionType.parent;

                //Ensure (start) IsA -- Parent --> Entity (end)
                if(endElement.erType === ERTYPECATEGORY.IsAStructure){

                    let temp = startId;
                    startId = endId;
                    endId = temp;
                }
                break;

            case ConnectionType.association:
            case ConnectionType.inheritor:

                connectionType = ConnectionType.inheritor;

                //Ensure (start) Parent -- Inheritor --> IsA (end)
                if(startElement.erType === ERTYPECATEGORY.IsAStructure){

                    let temp = startId;
                    startId = endId;
                    endId = temp;
                }
                break;
        }
    }


    return {
        id: `${startId} --> ${endId} - ${Date.now()}`,
        start: startId,
        end: endId,
        min: 1,
        max: 1,
        objectType: OBJECTTYPE.Connection,
        isSelected: false,
        withArrow: withArrow,
        withLabel: withLabel,
        connectionType: connectionType,
        associationTypeDetails: associationTypeDetails
    };

}

const isPartOfAttribute = (startElement, endElement) => {
    return startElement.erType === ERTYPECATEGORY.Attribute || endElement.erType === ERTYPECATEGORY.Attribute;
}
const isPartOfIsA = (startElement, endElement) => {
    return startElement.erType === ERTYPECATEGORY.IsAStructure || endElement.erType === ERTYPECATEGORY.IsAStructure;
}





