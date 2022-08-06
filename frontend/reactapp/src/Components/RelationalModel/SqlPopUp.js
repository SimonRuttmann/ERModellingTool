import React, {useState} from "react";
import ReactModal from "react-modal"
import sqlIcon from "../../Resources/Icons/sql.svg";

/**
 * Renders a modal containing the sql generated from the relational model
 * Also renders the button to open the modal
 * @param prepareSqlRequest A function execution when opening the modal
 * @param sqlCode The sql code as string to display
 * @returns {JSX.Element} The rendered modal and open button
 */
const SqlPopUp = ({prepareSqlRequest, sqlCode}) => {

    const [isShown, setIsShown] = useState(false);

    const showSqlPopUp = (e) => {
        prepareSqlRequest(e);
        setIsShown(true)
    }

    const closeSqlPopUp = () => {
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

/**
 * Renders and formats a line of sql
 * @param line The sql line as string to render
 * @returns {JSX.Element} Renders the formatted sql
 */
const SqlLine = ({line}) => {

    if(line == null || line === "") return <React.Fragment> <br/> </React.Fragment>

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