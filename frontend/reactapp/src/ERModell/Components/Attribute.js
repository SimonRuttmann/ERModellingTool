import React from "react"
import '../Playground.css';
export default function Attribute(props) {

   // console.log(props)
    return(
        <div 
            id={props.id} 
            className="Attribute hoverMarker" 
            style={{background: props.highlight}}
        >
            <input type="text"  onClick={(e) => e.stopPropagation()} className="textfieldObjects" defaultValue={"Attribute"}/>
        </div>
       
    )
}
