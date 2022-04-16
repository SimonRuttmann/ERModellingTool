import React from 'react'
import {ERTYPE} from "../../ErType";

const ToolTip = ({erType}) => {
    return (
        <div>
            {ERTYPE[erType].toolTipTitle}
            {ERTYPE[erType].toolTipDescription}
            {ERTYPE[erType].toolTipImage}
        </div>
    )
}

export default ToolTip
