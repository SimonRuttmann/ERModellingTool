import React from "react";
import '../EntityRelationObjectStyles.css'
import Draggable from 'react-draggable'
import { useXarrow } from "react-xarrows";

//React componente erstellen
export default function Entity(props) {

    const [state, setState] = React.useState({color: "hidden", draggable: true, inDrag: false})
    function onClick(){

    }

    function onMouseEnter(){
    }


    //Shape
    function onMouseLeaveA(){
        setState(prevState => {
            return {...prevState, color: "hidden"}
        })

    }


    function onMouseOverA(){
        setState(prevState => {
            return {...prevState, color: "visible"}
        })
    
    }

    //arrowsanchors

    function onMouseLeave(){
        setState(prevState => {
            return {...prevState, draggable: true}
        })
     
    }

    //from arrowancors
    function onMouseOver(){
        setState(prevState => {
            return {...prevState, draggable: false}
        })
 

    }

    function checkDraggingCondition(draggableEventHandler){

        setState(prevState => {
            return {...prevState, inDrag: true}
        })
        console.log("Dragging started")

    }


    function onDragStop(){
        setState(prevState => {
            return {...prevState, inDrag: false}
        })
    }

    function wrapXarrow(draggableEventHandler){

        updateXarrow();  
    }
    
    const updateXarrow = useXarrow();

    function onArrowAnchorSelected(e){
        if(!state.inDrag && e){
            e.stopPropagation();
            e.preventDefault();
            props.onAnchorSelected();
        }
        console.log("anchor selected")
    };

    return (
        <Draggable disabled={!state.draggable && !state.inDrag} onStart={checkDraggingCondition} onDrag={wrapXarrow} onStop={onDragStop} >
            <div  onClick={() => onClick()} onMouseEnter={() => onMouseEnter()} onMouseLeave={() => onMouseLeaveA()} onMouseOver={() => onMouseOverA()}
               // className = {props.type}      //Style Entity-Attribute-Relation
               // ref={props.box.ref} 
               // id={props.box.id} 
                style={{position: 'absolute', top: props.startY+'px', left: props.startX+'px'}}>
                    <div className="draggableContainer">

                        <div className="entityShape"></div>
  
                        <div className="arrowanchor" onMouseDown={onArrowAnchorSelected} onMouseLeave={() => onMouseLeave()} onMouseOver={() => onMouseOver()} onClick={()=>onArrowAnchorSelected()} style={{visibility: state.color, top: "3px", 	 left: "108px"}}></div> {/* top middle */}
                        <div className="arrowanchor" onMouseLeave={() => onMouseLeave()} onMouseOver={() => onMouseOver()} onClick={()=>onArrowAnchorSelected()} style={{visibility: props.showAnchors, top: "3px", 	 left: "208px"}}></div> {/* top middle */}
                        <div className="arrowanchor" onMouseLeave={() => onMouseLeave()} onMouseOver={() => onMouseOver()} onClick={()=>onArrowAnchorSelected()} style={{visibility: state.color, top: "3px", 	 left: "8px"}}></div>   {/* top middle */}
  
                        <div className="arrowanchor" onMouseLeave={() => onMouseLeave()} onMouseOver={() => onMouseOver()} onClick={()=>onArrowAnchorSelected()} style={{visibility: state.color, top: "53px",  left: "8px"}}></div>   {/* left       */}
                        <div className="arrowanchor" onMouseLeave={() => onMouseLeave()} onMouseOver={() => onMouseOver()} onClick={()=>onArrowAnchorSelected()} style={{visibility: state.color, top: "53px",  left: "208px"}}></div> {/* right      */}
  
                        <div className="arrowanchor" onMouseLeave={() => onMouseLeave()} onMouseOver={() => onMouseOver()} onClick={()=>onArrowAnchorSelected()} style={{visibility: state.color, top: "103px", left: "8px"}}></div>   {/* bot left   */}
                        <div className="arrowanchor" onMouseLeave={() => onMouseLeave()} onMouseOver={() => onMouseOver()} onClick={()=>onArrowAnchorSelected()} style={{visibility: state.color, top: "103px", left: "108px"}}></div> {/* bot mid    */}
                        <div className="arrowanchor" onMouseLeave={() => onMouseLeave()} onMouseOver={() => onMouseOver()} onClick={()=>onArrowAnchorSelected()} style={{visibility: state.color, top: "103px", left: "208px"}}></div> {/* bot right  */}

                        <input className="textfieldObjects" style={{top: "48px",  left: "35px"}}/>

                    </div>        
            </div>  
        </Draggable>
    );   
    
}



