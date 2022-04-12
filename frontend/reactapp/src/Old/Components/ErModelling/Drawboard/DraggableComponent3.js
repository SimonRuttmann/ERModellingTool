import React from "react";
import './test.css'
import Draggable from 'react-draggable'
import { useXarrow } from "react-xarrows";

//React componente erstellen
export default function DraggableComponent3(props) {

   

        const updateXarrow = useXarrow();
        return (
            <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
        <div 
            id={props.uniqueId}
            className="attributeContainer">

                <div className="attributeShape" ref={props.box.ref} id={props.box.id} style={{ top: '10px', left: '15px'}}></div>
        
                <div className="arrowanchor" style={{ top: '2px' , left: '108px'}}  ></div>  
                <div className="arrowanchor" style={{ top: '13px', left: '170px'}}  ></div>  
                <div className="arrowanchor" style={{ top: '13px', left: '41px'}}   ></div>  

                <div className="arrowanchor" style={{ top: '52px', left: '8px'}}    ></div>  
                <div className="arrowanchor" style={{ top: '52px', left: '208px'}}  ></div>  

                <div className="arrowanchor" style={{ top: '102px', left: '108px'}} ></div>  
                <div className="arrowanchor" style={{ top: '90px',  left: '41px'}}  ></div>  
                <div className="arrowanchor" style={{ top: '90px',  left: '170px'}} ></div>  

                <input className="textfield" style={{top: '47px', left: '35px'}}    ></input>
        
        </div>
        </Draggable>
        );


    
}

/*
render(){
  return(
      <span className="entity" style={this.state.styles} onMouseDown={this._dragStart} onMouseMove={this._dragging} onMouseUp={this._dragEnd}>  
          <input className="textfield" />
      </span>
  )

  <div id={this.props.relationId} style = {{
      
    position: 'absolute',
    left: this.state.pos.x + 'px',
    top: this.state.pos.y + 'px',
    cursor: 'pointer',
    width: '200px',
    height: '200px',
    backgroundColor: '#cca',
}} onMouseDown = {this.onDragStart}> 
    Lovepreet Singh
</div>);
*/


/*
receice current position -> usefull for drawboard.js
var anchorPointElement = document.getElementById(this.props.uniqueId).getBoundingClientRect();
//returns the size and the relative position to the viewport
//Hier ist der fehler . docuemnt .get ElementById retuned den falschen wert...
*/