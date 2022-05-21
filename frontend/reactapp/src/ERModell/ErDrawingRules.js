import {resolveObjectById} from "./Components/Util/ObjectUtil";
import {ERTYPE} from "./Model/ErType";


export const createSelection = (id, associationType, drawBoardElements, connections) => {
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
    const selectableDrawBoardElements = appliedRule(selectedObject, associationType, copiedDrawBoardElements, connections)

    console.log(selectableDrawBoardElements)
    return selectableDrawBoardElements;

}


const handleSelectIdentifyingAttribute = (selectedObject, associationType, drawBoardElements, connections) => {

}

const handleSelectNormalAttribute = (selectedObject, associationType, drawBoardElements, connections) => {

}

const handleSelectMultivaluedAttribute = (selectedObject, associationType, drawBoardElements, connections) => {

}

const handleSelectWeakIdentifyingAttribute = (selectedObject, associationType, drawBoardElements, connections) => {

}

const handleSelectStrongEntity = (selectedObject, associationType, drawBoardElements, connections) => {

}

const handleSelectWeakEntity = (selectedObject, associationType, drawBoardElements, connections) => {

}

const handleSelectStrongRelation = (selectedObject, associationType, drawBoardElements, connections) => {

}

const handleSelectWeakRelation = (selectedObject, associationType, drawBoardElements, connections) => {

}

const handleSelectIsAStructure = (selectedObject, associationType, drawBoardElements, connections) => {

}









//Todo Ein to do ist noch offen, es muss noch die breite / höhe abhängig von der anzahl der zeichen ermittellt werden