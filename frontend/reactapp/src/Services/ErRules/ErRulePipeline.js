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

    let currentlyPassedElements = [];
    currentlyPassedElements.push(...elements);
    currentlyPassedElements = currentlyPassedElements.filter(element => element.id !== selectedObject.id);

    for (let rule of rules){

        //Filter elements based on rule
        currentlyPassedElements = currentlyPassedElements.filter(
            element => {
                return rule(element, connections, selectedObject, elements);
            })

    }

    //All elements which passed all rules
    return currentlyPassedElements;
}

const ErRulePipeline = {
    applyRules: applyRules
}

export default ErRulePipeline;