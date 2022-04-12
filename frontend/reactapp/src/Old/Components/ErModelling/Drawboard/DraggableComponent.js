import React from "react";

//React componente erstellen
export default class DraggableComponent extends React.Component{

  // given Props:
  // uniqueId
  // type {entity, relation, attribute, isa-structure}
  
    //Konstruktor, um einen State zu erstellen
    constructor(props){
     
        super(props);
        this.state = {
            anchorPointElement: {x:0, y:0},    //The left top anchorpoint of the element
            dragging: false,                   //Boolean indicates if the object is beeing dragged 
            rel: {x:0, y:0}                    //Difference between the initial left click on the element and the anchor point
        };

        //Bind the methods to the "this" instance
        this.onDragStart = this.onDragStart.bind(this);
        this.whileDragging = this.whileDragging.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    //We do not use the react MouseEventHandler as they run into performance issues 
    //and lose focus when the curser is moved outwards the displayed DOM-Elements between updates
    componentDidUpdate(props, prevState){
      //Drag started
        if (!prevState.dragging && this.state.dragging) {
            document.addEventListener('mousemove', this.whileDragging)
            document.addEventListener('mouseup', this.onDragEnd)
        //Drag ended
        } else if (prevState.dragging && !this.state.dragging) {
            document.removeEventListener('mousemove', this.whileDragging)
            document.removeEventListener('mouseup', this.onDragEnd)
        }
    }

    onDragStart(mouseEvent){
    //Main button pressed, usually the left button or the un-initialized state
      if (mouseEvent.button !== 0) return

      this.setState((prevState, props) => {
        return {
          dragging: true,
          rel: {
            x: mouseEvent.pageX - prevState.anchorPointElement.x, 
            y: mouseEvent.pageY - prevState.anchorPointElement.y
          }};
      });
    }

    whileDragging(mouseEvent) {
        if (!this.state.dragging) return

        this.setState({
          anchorPointElement: {
            x: mouseEvent.pageX - this.state.rel.x,
            y: mouseEvent.pageY - this.state.rel.y
          }
        })
      }


    onDragEnd(e) {
        this.setState({dragging: false})
    }    


    render(){
      var reverseRelation = ""
      if(this.props.type == "relation")
        reverseRelation = "reverseRelation"
      
        return (
        
        <span 
          id={this.props.uniqueId}           //Id to add eventListener
          className = {this.props.type}      //Style Entity-Attribute-Relation
          onMouseDown = {this.onDragStart}   //Start DragAndDrop
          style = {{                         //Update postion for DragAndDrop
            left: this.state.anchorPointElement.x + 'px', 
            top: this.state.anchorPointElement.y + 'px'}} >
          
            <input className="textfield" />
          </span> );
    }
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