import React from 'react'
import {ERTYPE} from "../../../Services/DrawBoardModel/ErType";

/**
 * Renders the tooltip for the draggable elements on the left sidebar
 * @param erType The erType to create a tooltip for
 *
 * The data for the tooltip is provided via the
 * @see ERTYPE
 */
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
