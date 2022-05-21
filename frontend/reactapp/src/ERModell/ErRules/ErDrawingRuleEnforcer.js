import {resolveObjectById} from "../Components/Util/ObjectUtil";
import {ERTYPE} from "../Model/ErType";
import {
    handleSelectIdentifyingAttribute,
    handleSelectIsAStructure,
    handleSelectMultivaluedAttribute,
    handleSelectNormalAttribute,
    handleSelectStrongEntity,
    handleSelectStrongRelation,
    handleSelectWeakEntity,
    handleSelectWeakIdentifyingAttribute,
    handleSelectWeakRelation
} from "./ErRules";


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

    let copiedDrawBoardElements = [...drawBoardElements]
    const selectableDrawBoardElements = appliedRule(selectedObject, connectionType, copiedDrawBoardElements, connections)


    //MARK ELEMENTS!
    console.log(selectableDrawBoardElements)
    return selectableDrawBoardElements;

}






//Todo Ein to do ist noch offen, es muss noch die breite / höhe abhängig von der anzahl der zeichen ermittellt werden