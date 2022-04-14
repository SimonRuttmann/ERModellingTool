import React, { Fragment } from 'react';
import '../Playground.css';
// import MaterialIcon from "material-icons-react";
/*
Props: 
 Functions 
    setActionState(action like "Remove Connections")
    setLines()
 Werte:
    boxes   Array box
    lines   Array lines
    selected (box)   

*/

const actions = {
  box: ['Add Connections', 'Remove Connections', 'Delete'], //Edit Name --> Don't change the id --> name needs to be a seperate property, or the lines will break
  arrow: ['Edit Properties', 'Remove Connection'],
};

const TopBar = (props) => {
  const handleEditAction = (action) => {
    switch (action) {
      case 'Edit Name':
        props.setBoxes((boxes) => {
          var newName = prompt('Enter new name: ');
          while ([...boxes, ...props.interfaces].map((a) => a.id).includes(newName))
            newName = prompt('Name Already taken,Choose another: ');
          if (!newName) return;
          return boxes.map((box) => (box.id === props.selected.id ? { ...box, id: newName } : box));
        });
        break;
      case 'Add Connections':
        props.setActionState(action);
        break;
      case 'Remove Connections':
        props.setActionState(action);
        break;
      case 'Remove Connection':
        props.setLines((lines) =>
          lines.filter(
            (line) => !(line.props.root === props.selected.id.root && line.props.end === props.selected.id.end)
          )
        );
        break;
      case 'Edit Properties':
        props.setLines((lines) =>
          lines.map((line) =>
            line.props.root === props.selected.id.root && line.props.end === props.selected.id.end
              ? {
                  ...line,
                  menuWindowOpened: true,
                }
              : line
          )
        );
        break;
      case 'Delete':
        //if (window.confirm(`are you sure you want to delete ${props.selected.id}?`)) {
          // first remove any lines connected to the node.
          props.setLines((lines) => {
            return lines.filter(
              (line) => !(line.props.start === props.selected.id || line.props.end === props.selected.id)
            );
          });
          // if its a box remove from boxes
          if (props.boxes.map((box) => box.id).includes(props.selected.id)) {
            props.setBoxes((boxes) => boxes.filter((box) => !(box.id === props.selected.id)));
          }

          props.handleSelect(null);
        //}
        break;
      default:
    }
  };

  const boxMenu = () => {
    return (

      <React.Fragment>

        <h1>{props.selected.type}</h1>
        <p> Name: <input/></p>

        <button>Assoziation hinzufügen</button>

        <br/><br/>

        <button>Entität löschen</button>
      </React.Fragment>

    )
  }


  const associationMenu = () => {
    return (

      <React.Fragment>

        <h1>Assoziation</h1>
        
        <p>Kardinalität nach Min-Max Notation</p>
        <p>Min:<input/> Max: <input/> </p>
        
        <br/><br/>
        <button>Assoziation löschen</button>

        <p>Darstellung</p>

        <select name="Darstellung" id="cars">
	        <option value="Direkt">Direkt</option>
          <option value="Gitter">Gitter</option>
          <option value="Geschwungen">Geschwungen</option>
        </select>

        <p>Pfeilausrichtung:</p>
        <div> 
          <p>Von</p>
          <select name="Ausrichtung" id="cars">
            <option value="Auto">Automatisch</option>
	          <option value="Links">Links</option>
            <option value="Rechts">Rechts</option>
            <option value="Oben">Oben</option>
            <option value="Unten">Unten</option>
          </select>
        </div>

        <div> 
          <p>Nach</p>
          <select name="Ausrichtung" id="cars">
            <option value="Auto">Automatisch</option>
	          <option value="Links">Links</option>
            <option value="Rechts">Rechts</option>
            <option value="Oben">Oben</option>
            <option value="Unten">Unten</option>
          </select>
        </div>
      </React.Fragment>

    )
  }

/*
<!DOCTYPE html>
<html>
<head>
<style>

</style>
</head>
<body>
<h1>Entität</h1>
<p> Name: <input/></p>
<Button>Assoziation hinzufügen</Button>
<br/><br/>
<Button>Entität löschen</Button>

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>


<h1>Assoziation</h1>
<p>Kardinalität nach Min-Max Notation</p>
<p>Min:<input/></p> <p>Max: <input/> 
<br/> <br/>
<Button>Assoziation löschen</Button>

<p>Darstellung</p>

<select name="Darstellung" id="cars">
	<option value="Direkt">Direkt</option>
    <option value="Gitter">Gitter</option>
    <option value="Geschwungen">Geschwungen</option>
</select>

<p>Pfeilausrichtung:</p>
<div> 
<p>Von</p>
<select name="Ausrichtung" id="cars">
    <option value="Auto">Automatisch</option>
	<option value="Links">Links</option>
    <option value="Rechts">Rechts</option>
    <option value="Oben">Oben</option>
    <option value="Unten">Unten</option>
</select>
</div>

<div> 
<p>Nach</p>
<select name="Ausrichtung" id="cars">
    <option value="Auto">Automatisch</option>
	<option value="Links">Links</option>
    <option value="Rechts">Rechts</option>
    <option value="Oben">Oben</option>
    <option value="Unten">Unten</option>
</select>
</div>

</body>
</html>


*/


  var returnTopBarApearnce = () => {
    let allowedActions = [];
    if (props.selected) allowedActions = actions[props.selected.type];      //Wenn selektiert -> Arrow oder Box selektiert?
    switch (props.actionState) {
      case 'Normal':        //Anfangsansicht -> Add Connections, Remove Conenctions, Delete ODER Edit Properties, Remove Connection (Arrow <-> Box --> allowedActions)
        return (
          <React.Fragment>
            {allowedActions.map((action, i) => (
              <div className="actionBubble" key={i} onClick={() => handleEditAction(action)}>
                {action}
              </div>
            ))}
            </React.Fragment>
        );
      case 'Add Connections':
        return (
         <React.Fragment>
            <p>To where connect new connection?</p>
            <div className="actionBubble" onClick={() => props.setActionState('Normal')}>
              finish
            </div>
            </React.Fragment>
        );

      case 'Remove Connections':
        return (
          <React.Fragment>
            <p>Which connection to remove?</p>
            </React.Fragment>
        );
      default:
    }
  };


  var displayMenu = null;
  if(props != undefined && props.selected != undefined && props.selected != null) {
  //  console.log("hallo?")
  //  console.log(props.selected.type)
    switch(props.selected.type){
      case "arrow": displayMenu = associationMenu(); break;
      case "box": displayMenu = boxMenu(); break;
      default: break;

    }
  }
  return (
    <div
      className="topBarStyle"
      style={{ visibility: props.selected === null ? 'hidden' : 'visible' }}
      onClick={(e) => e.stopPropagation()}>
      <div className="topBarLabel" onClick={() => props.handleSelect(null)}>         {/* Can be removed*/}
      </div>
      {returnTopBarApearnce()}


      {displayMenu}

    </div>
  );
};

export default TopBar;
