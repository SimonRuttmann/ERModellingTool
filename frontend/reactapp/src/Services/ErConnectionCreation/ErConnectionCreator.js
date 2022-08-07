import {OBJECTTYPE} from "../DrawBoardModel/ActionState";
import {resolveObjectById} from "../Common/ObjectUtil";
import {ERTYPE, ERTYPECATEGORY} from "../DrawBoardModel/ErType";
import {ConnectionType} from "../DrawBoardModel/Diagram";
import {isElementOfCategoryAttribute} from "../ErRules/ErRulesUtil";

/**
 * Handles the creation of connections based on the provided start and end ids
 * and the additional information provided in connectionInformation
 *
 * @param drawBoardElements The elements on the DrawBoard
 * @param idStart The id of the element to start from
 * @param idEnd The id of the element to end at
 * @param connectionInformation Additional connection information (e.g. parent connection, inheritor connection...)
 *
 * The data structure of connections are documented at
 * @see ErContentSlice
 */
const createConnection = (drawBoardElements, idStart, idEnd, connectionInformation) => {

    let startId = idStart;
    let endId = idEnd;

    let startElement = resolveObjectById(idStart, drawBoardElements);
    let endElement = resolveObjectById(idEnd, drawBoardElements);

    let withLabel = true;
    let connectionType = ConnectionType.association;
    let withArrow = false;

    //Connections to attributes do not have cardinality
    if(isPartOfAttribute(startElement, endElement)) {
        withLabel = false;
        connectionType = ConnectionType.attributeConnector;
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
        min: "1",
        max: "1",
        objectType: OBJECTTYPE.Connection,
        isSelected: false,
        withArrow: withArrow,
        withLabel: withLabel,
        connectionType: connectionType
    };

}

const isPartOfAttribute = (startElement, endElement) => {
    return isElementOfCategoryAttribute(startElement) || isElementOfCategoryAttribute(endElement);
}
const isPartOfIsA = (startElement, endElement) => {
    return startElement.erType === ERTYPE.IsAStructure.name || endElement.erType === ERTYPE.IsAStructure.name;
}

const ErConnectionCreator = {
    createConnection: createConnection
}

export default ErConnectionCreator;





