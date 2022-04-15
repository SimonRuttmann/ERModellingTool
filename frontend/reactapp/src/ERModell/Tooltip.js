import React from 'react'
import {erTypesDescription, erTypesName, erTypesPreview} from "./ErTypesEnum";

const ToolTip = ({erType}) => {
    return (
        <div>
            {erTypesName[erType]}
            {erTypesDescription[erType]}
            {erTypesPreview[erType]}
        </div>
    )
}

export default ToolTip

// Image

// Beschreibung