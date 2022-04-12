import React from "react";
import './Drawboard.css'
import Draggable from 'react-draggable'
import { useXarrow } from "react-xarrows";

//React componente erstellen
export default function DraggableComponent4(props) {

    var reverseRelation = ""
    if(props.type == "relation")
      reverseRelation = "reverseRelation"

    function onClick(){
        console.log("clicked!")
    }

    function onMouseEnter(){
        console.log("enter object")
    }

    
    function onMouseLeave(){
        console.log("leave object")
    }

    
    function onMouseOver(){
        console.log("over object")
    }

    function wrapXarrow(){
        console.log("Dragging")
        updateXarrow();
    }
    const updateXarrow = useXarrow();
    return (
        <Draggable onDrag={wrapXarrow} onStop={updateXarrow} >
            <div onClick={() => onClick()} onMouseEnter={() => onMouseEnter()} onMouseLeave={() => onMouseLeave()} onMouseOver={() => onMouseOver()} 
                className = {props.type}      //Style Entity-Attribute-Relation
                ref={props.box.ref} 
                id={props.box.id} 
                style={{position: 'absolute', top: props.startY+'px', left: props.startX+'px'}}>
                    <input id = {reverseRelation} className="textfield"  />
            </div>  
        </Draggable>
    );

      
    
}

