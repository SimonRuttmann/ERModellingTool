import {OBJECTTYPE} from "./Model/ActionState";
import {resolveObjectById} from "./Components/Util/ObjectUtil";
import {ERTYPECATEGORY} from "./Model/ErType";
import {AssociationType} from "./Model/Diagram";


export const createConnection = (drawBoardElements, idStart, idEnd, connectionInformation) => {

    let startId = idStart;
    let endId = idEnd;

    let startElement = resolveObjectById(idStart, drawBoardElements);
    let endElement = resolveObjectById(idEnd, drawBoardElements);

    let withLabel = true;
    let associationType;
    let withArrow = false;

    //Connections to attributes do not have cardinality
    if(isPartOfAttribute(startElement, endElement)) {
        withLabel = false;
        associationType = AssociationType.attributeConnector;
    }

    //Connections to/from IsA-Structures do not have cardinality
    //Connections to/from IsA-Structures have an arrow on the end side
    //Connections to/from IsA-Structures are directed based on their association type
    if(isPartOfIsA(startElement, endElement)) {

        withLabel = false;
        withArrow = true;

        switch (connectionInformation){
            case AssociationType.parent:

                associationType = AssociationType.parent;

                //Ensure (start) IsA -- Parent --> Entity (end)
                if(endElement.type === ERTYPECATEGORY.IsAStructure){

                    let temp = startId;
                    startId = endId;
                    endId = temp;
                }
                break;

            case AssociationType.association:
            case AssociationType.inheritor:

                associationType = AssociationType.inheritor;

                //Ensure (start) Parent -- Inheritor --> IsA (end)
                if(startElement.type === ERTYPECATEGORY.IsAStructure){

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
        associationType: associationType
    };

}

const isPartOfAttribute = (startElement, endElement) => {
    return startElement.type === ERTYPECATEGORY.Attribute || endElement === ERTYPECATEGORY.Attribute;
}
const isPartOfIsA = (startElement, endElement) => {
    return startElement.type === ERTYPECATEGORY.IsAStructure || endElement === ERTYPECATEGORY.IsAStructure;
}





