const SvgEventHandler = ({children}) => {

    return(
        <svg
            id="boxesContainer"
            className="drawboardDragArea"
            onDragOver={(e) => e.preventDefault()} //enable "dropping"
            onDrop={(e) => addDrawBoardElement(e)}
            style={{
                position: "absolute",                   //TODO
                left: `${drawBoardBorderOffset}px`,
                top: `${drawBoardBorderOffset}px`,
                height: svgSize.height,
                width:  svgSize.width
            }}
        >
            {children}
        </svg>
    )
}