import transformIcon from "../Resources/server.svg";

const TransformButton = ({transformToRel}) => {
    return (
        <img src={transformIcon} className="TransformButton" onClick={transformToRel} alt={"To relational diagram"}/>
    )
}
export default TransformButton;