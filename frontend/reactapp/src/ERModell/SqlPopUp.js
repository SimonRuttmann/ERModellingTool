import React, {useState} from "react";
import ReactModal from "react-modal"
import sqlIcon from "../Resources/sql.svg";

export function SqlPopUp({prepareSqlRequest, sqlCode}){

    const [isShown, setIsShown] = useState(false);

    function showSqlPopUp(e){
        prepareSqlRequest(e);
        setIsShown(true)
    }

    function closeSqlPopUp(e){
        setIsShown(false)
    }
    if(sqlCode == null) sqlCode = "";

    return (
        <React.Fragment>
            <div>
                <ReactModal
                    isOpen={isShown}
                    contentLabel="onRequestClose Example"
                    onRequestClose={closeSqlPopUp}
                    ariaHideApp={false}

                    className="SqlPopUp"
                >
                    <div className="SqlContent">

                        <h1>SQL</h1>
                        {sqlCode.split("\n").map((line, i) => (
                            <SqlLine key={line + i} line={line}/>
                        )) }
                    </div>

                </ReactModal>
            </div>
            <img src={sqlIcon} className="TransformButton TransformButtonEnabled" onClick={showSqlPopUp} alt={"Show Sql"}/>
        </React.Fragment>
    );
}

function SqlLine({line}) {

    if(line == null || line === "") return <React.Fragment> <br/> </React.Fragment>
    console.log("LINE")
    console.log(line)

    if(line.includes("\t")) {
        return (
            <React.Fragment key={line}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {line} <br/>
            </React.Fragment>
        )
    }

    return (
        <React.Fragment key={line}>
            {line} <br/>
        </React.Fragment>
    )

}

export default SqlPopUp;