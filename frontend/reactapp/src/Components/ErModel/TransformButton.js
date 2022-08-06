import transformIcon from "../../Resources/Icons/server.svg";
import relationalIcon from "../../Resources/Icons/table.svg";
import React from "react";
import validIcon from "../../Resources/Icons/check-circle-fill.svg";
import invalidIcon from "../../Resources/Icons/exclamation-circle-fill.svg"
import ReactTooltip from "react-tooltip";

const TransformButton = ({transformToRel, invalidMessages}) => {

    const isValid = invalidMessages.length === 0;

    let displayedIcon;
    let transformButtonStyle;
    if(isValid) {
        displayedIcon = <img src={validIcon} className="TransformInvalidValidIcon" alt={"Valid"}/>
        transformButtonStyle = "TransformButtonEnabled"
    }
    else {

        displayedIcon =
            <div>
            <ReactTooltip id={"TransformToolTip"} effect="solid" place={"top"} backgroundColor={"#3c3f41"}>
                <ol className="invalidMessage">
                {invalidMessages.map( (message,i) => (
                    <li key={"transformToolTipKey-"+i}>{message}</li>
                ))}
                </ol>
            </ReactTooltip>
            <img src={invalidIcon} className="TransformInvalidValidIcon" alt={"Invalid"}
                 data-for={"TransformToolTip"} data-tip={"TransformToolTipDataTip"}/>
            </div>

        transformButtonStyle = "TransformButtonDisabled"
    }

    transformButtonStyle = "TransformButton " + transformButtonStyle;

    const handleClick = (e) => {
        if(isValid)  transformToRel(e);
    }


    return (

        <React.Fragment>
            <React.Fragment>

                {displayedIcon}
                <img src={relationalIcon} className={transformButtonStyle} onClick={handleClick} alt={"To relational diagram"}/>
            </React.Fragment>
        </React.Fragment>
    )
}
export default TransformButton;

