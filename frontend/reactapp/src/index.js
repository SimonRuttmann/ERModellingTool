import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

//Praktisch Zustandslose Komponente
function Welcome(props) {
  return <h1> Hello, {props.name} </h1>;
}

//Klassen für Komponenten mit Zustand
class Clock extends React.Component{
  constructor(props){
    console.log(props.name);  //Kann bei .Render übergeben werden
    super(props);
    this.state = {date: new Date()};// Alles was sich aktualisieren oder verändern soll
  }

  componentDidMount(){                                  //Aktualisierungsintervall setzen
    this.ticker = setInterval(() => this.tick(), 1000);
  }
  
  componentWillUnmount(){                               //Intervall entfernen, wenn Komponente nicht angezeigt wird
    clearInterval(this.ticker)
  }

  tick(){                                               //Aktualisierung setzen
    this.setState({
      date: new Date()
    });
  }

  render(){ // Zugriff auf internen Zustand
    return (
    <div>
      <h1> Aktuelle Uhrzeit: {this.state.date.toLocaleTimeString()}</h1>
    </div>
    );
  }

}

const element = <Welcome name="Sarah" />;
ReactDOM.render(
<App/>, document.getElementById('root')

//  <Clock name="2"/>,
//  document.getElementById('root')

//  <React.StrictMode>
//    <App />
//  </React.StrictMode>,
//  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
