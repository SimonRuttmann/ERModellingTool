
import '../App.css';
import PlayGround from '../ERModell/Playground';
import React from "react";
import SaveAndLoad from "./SaveAndLoad";

function ContentManager() {

    //We use useRef as "instance variable" (normally used for DOM Refs) https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables
    // avoid setting refs during rendering

    const projectType = "erDiagram";
    const projectVersion = 1.0;
    const projectName = "notNamed";

    const metaInformation = {
        projectVersion: projectVersion,
        projectName: projectName,
        projectType: projectType
    }

    return (
        <div className="App">
            <SaveAndLoad metaInforamtion={metaInformation}>
                <PlayGround/>
            </SaveAndLoad>
        </div>
    )
}




export default ContentManager;

/*
useEffect(() => {
    window.addEventListener('mousemove', () => {});

    // returned function will be called on component unmount
    return () => {
        window.removeEventListener('mousemove', () => {})
    }
}, [])
var myevent = new CustomEvent("myEvent"< {someData: {}})
document.dispatchEvent(myevent)


//wo anderst in use effect
document.addEventListener("myEvent", (e) => doSthm(e.someData))
//By did unmount -> document.removeEventListener("myEvent");
*/

