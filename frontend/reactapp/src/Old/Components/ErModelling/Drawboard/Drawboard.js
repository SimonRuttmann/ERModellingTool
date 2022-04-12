import React, { useRef } from 'react';
import Xarrow, { Xwrapper } from 'react-xarrows';
import './Drawboard.css';

import DraggableComponent from './DraggableComponent';
import DraggableComponent2 from './DraggableComponent2';
import DraggableComponent3 from './DraggableComponent3';
import DraggableComponent4 from './DraggableComponent4';
import Entity from './ErComponents/Entity';
//import Entity from './Entity';
export class Drawboard extends React.Component{

    constructor(props){
        super(props);
        this.box1 = {id: 'box1', ref: React.createRef(null)};
        this.box2 = {id: 'box2', ref: React.createRef(null)};
        this.box3 = {id: 'box3', ref: React.createRef(null)};
        this.box4 = {id: 'box4', ref: React.createRef(null)};
        this.box5 = {id: 'box5', ref: React.createRef(null)};
        this.box6 = {id: 'box6', ref: React.createRef(null)};
        this.box7 = {id: 'box7', ref: React.createRef(null)};
        this.box8 = {id: 'box8', ref: React.createRef(null)};
        this.box9 = {id: 'box9', ref: React.createRef(null)};
        this.box10 = {id: 'box10', ref: React.createRef(null)};

        this.state = {
            showAnchors: "hidden"
        }
    }

    receivePosOfComponent(id){
        var anchorPointElement = document.getElementById(id).getBoundingClientRect();
        return {x: anchorPointElement.left, y: anchorPointElement.top}
    }

    onAnchorSelected(){
        console.log("Connect arrows")
        this.setState({
            showAnchors: "visible"
        })
        
        //1. Erhalte alle AnchorPoints der der Entities
    }

    render(){
        return(
            <React.Fragment>
                <Xwrapper>

                    
                    <Entity onAnchorSelected={() => this.onAnchorSelected()} showAnchors={this.state.showAnchors}></Entity>
                    <Entity onAnchorSelected={() => this.onAnchorSelected()} showAnchors={this.state.showAnchors}></Entity>
                    <DraggableComponent4 type="entity" box={this.box1} startX="100" startY="100"/>
                    <DraggableComponent4 type="entity" box={this.box2} startX="1000" startY="100"/>
                    <DraggableComponent4 type="entity" box={this.box3} startX="2000" startY="100"/>

                    

                    <DraggableComponent4 type="relation" box={this.box4} startX="500" startY="100"/>
                    <DraggableComponent4 type="relation" box={this.box5} startX="1500" startY="100"/>
                    

                    <DraggableComponent4 type="attribute" box={this.box6} startX="100" startY="300"/>
                    <DraggableComponent4 type="attribute" box={this.box7} startX="500" startY="300"/>
                    <DraggableComponent4 type="attribute" box={this.box8} startX="1000" startY="300"/>
                    <DraggableComponent4 type="attribute" box={this.box9} startX="1500" startY="300"/>
                    <DraggableComponent4 type="attribute" box={this.box10} startX="2000" startY="300"/>

                    <Xarrow start={this.box1.id} end={this.box4.ref}/>
                    <Xarrow start={this.box4.id} end={this.box2.ref}/>
                    <Xarrow start={this.box2.id} end={this.box5.ref}/>
                    <Xarrow start={this.box5.id} end={this.box3.ref}/>
                    <Xarrow start={this.box6.id} end={this.box1.ref}/>
                    <Xarrow start={this.box7.id} end={this.box1.ref}/>
                    <Xarrow start={this.box8.id} end={this.box2.ref}/>
                    <Xarrow start={this.box9.id} end={this.box2.ref}/>
                    <Xarrow start={this.box10.id} end={this.box3.ref}/>
                </Xwrapper>
            </React.Fragment>
        )
    }

}




