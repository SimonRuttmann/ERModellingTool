import React from "react";
import './EntityRelationObjectStyles.css'
import Draggable from 'react-draggable'
import { useXarrow } from "react-xarrows";

//React componente erstellen
export default function Entity(props) {

    const [state, setState] = React.useState({color: "hidden"})
    function onClick(){
        console.log("clicked!")
    }

    function onMouseEnter(){
        console.log("enter object")
    }

    
    function onMouseLeave(){
        setState({color: "hidden"})
        console.log("leave object")
    }

    function onMouseOverA(){
        setState({color: "visible"})

        console.log("over object")
    }

    function onMouseOver(){
        console.log("over arrow anchor")

    }

    function wrapXarrow(){
        console.log("Dragging")
        updateXarrow();
    }
    const updateXarrow = useXarrow();

    function onArrowAnchorSelected(){
        console.log("anchor selected")
    };

    return (
        <Draggable onDrag={wrapXarrow} onStop={updateXarrow} >
            <div  onClick={() => onClick()} onMouseEnter={() => onMouseEnter()} onMouseLeave={() => onMouseLeave()} onMouseOver={() => onMouseOverA()}
               // className = {props.type}      //Style Entity-Attribute-Relation
               // ref={props.box.ref} 
               // id={props.box.id} 
                style={{position: 'absolute', top: props.startY+'px', left: props.startX+'px'}}>
                    <div className="draggableContainer">

                        <div className="entityShape"></div>
  
                        <div className="arrowanchor" onMouseOver={() => onMouseOver()} onClick={()=>onArrowAnchorSelected()} style={{visibility: state.color, top: "3px", 	 left: "108px"}}></div> {/* top middle */}
                        <div className="arrowanchor" onMouseOver={() => onMouseOver()} onClick={()=>onArrowAnchorSelected()} style={{visibility: state.color, top: "3px", 	 left: "208px"}}></div> {/* top middle */}
                        <div className="arrowanchor" onMouseOver={() => onMouseOver()} onClick={()=>onArrowAnchorSelected()} style={{visibility: state.color, top: "3px", 	 left: "8px"}}></div>   {/* top middle */}
  
                        <div className="arrowanchor" onMouseOver={() => onMouseOver()} onClick={()=>onArrowAnchorSelected()} style={{visibility: state.color, top: "53px",  left: "8px"}}></div>   {/* left       */}
                        <div className="arrowanchor" onMouseOver={() => onMouseOver()} onClick={()=>onArrowAnchorSelected()} style={{visibility: state.color, top: "53px",  left: "208px"}}></div> {/* right      */}
  
                        <div className="arrowanchor" onMouseOver={() => onMouseOver()} onClick={()=>onArrowAnchorSelected()} style={{visibility: state.color, top: "103px", left: "8px"}}></div>   {/* bot left   */}
                        <div className="arrowanchor" onMouseOver={() => onMouseOver()} onClick={()=>onArrowAnchorSelected()} style={{visibility: state.color, top: "103px", left: "108px"}}></div> {/* bot mid    */}
                        <div className="arrowanchor" onMouseOver={() => onMouseOver()} onClick={()=>onArrowAnchorSelected()} style={{visibility: state.color, top: "103px", left: "208px"}}></div> {/* bot right  */}

                        <input className="textfieldObjects" onClick={()=>onArrowAnchorSelected()} style={{top: "48px",  left: "35px"}}/>

                    </div>        
            </div>  
        </Draggable>
    );   
    
}



