import {resolveObjectById} from "../Common/ObjectUtil";
import {ERTYPE} from "../DrawBoardModel/ErType";
import TransitionFunction from "./ErRules";

/**
 * Determines which elements from the current element can be connected to
 * @param id The id of the currently selected element
 * @param connectionType The connectionType providing additional information (e.g. parent, inheritor, association ...)
 * @param drawBoardElements The elements on the DrawBoard
 * @param connections The connection on the DrawBoard
 * @returns {*[]|*} An collection of id's. Each element with one of those id's is valid to connect to
 */
const createSelection = (id, connectionType, drawBoardElements, connections) => {
    let selectedObject = resolveObjectById(id, drawBoardElements, connections)


    const type = selectedObject.erType;
    let appliedRule;

    switch (type) {

        case ERTYPE.IdentifyingAttribute.name:       appliedRule = TransitionFunction.handleSelectIdentifyingAttribute;    break;
        case ERTYPE.NormalAttribute.name:            appliedRule = TransitionFunction.handleSelectNormalAttribute;         break;
        case ERTYPE.MultivaluedAttribute.name:       appliedRule = TransitionFunction.handleSelectMultivaluedAttribute;    break;
        case ERTYPE.WeakIdentifyingAttribute.name:   appliedRule = TransitionFunction.handleSelectWeakIdentifyingAttribute;break;

        case ERTYPE.StrongEntity.name:               appliedRule = TransitionFunction.handleSelectStrongEntity;            break;
        case ERTYPE.WeakEntity.name:                 appliedRule = TransitionFunction.handleSelectWeakEntity;              break;

        case ERTYPE.StrongRelation.name:             appliedRule = TransitionFunction.handleSelectStrongRelation;          break;
        case ERTYPE.WeakRelation.name:               appliedRule = TransitionFunction.handleSelectWeakRelation;            break;

        case ERTYPE.IsAStructure.name:               appliedRule = TransitionFunction.handleSelectIsAStructure;            break;
    }

    let copiedDrawBoardElements = [...drawBoardElements]
    const selectableDrawBoardElements = appliedRule(selectedObject, connectionType, copiedDrawBoardElements, connections)

    //Nothing did pass the tests, therefore return no element ids
    if (selectableDrawBoardElements == null) return [];

    return selectableDrawBoardElements.map(element => element.id);
}

const ErPartialConsistencyValidation = {
    createSelection: createSelection
}

export default ErPartialConsistencyValidation;


