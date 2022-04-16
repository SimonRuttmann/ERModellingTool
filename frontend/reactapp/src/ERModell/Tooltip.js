import React from 'react'
import {erType_TooltipDescription, erType_TooltipTitle, erType_TooltipImage} from "./ErTypesEnum";

const ToolTip = ({erType}) => {
    return (
        <div>
            {erType_TooltipTitle[erType]}
            {erType_TooltipDescription[erType]}
            {erType_TooltipImage[erType]}
        </div>
    )
}

export default ToolTip
