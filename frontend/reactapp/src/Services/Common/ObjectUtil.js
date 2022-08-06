/**
 * Method to search through multiple arrays for an object with an id
 * @param id The id to search for
 * @param arrays The arrays which should be searched in
 */
export const resolveObjectById = (id, ...arrays) => {

    for(let array of arrays){
        let item = array.find(element => element.id === id)
        if(item) return item;
    }
    return null;
}