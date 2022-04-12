import React from 'react';

export class Sidebare extends React.Component{
    constructor(props){
        super(props)

    }

    render(){
        return (
            <aside className="Sidebar">
                <nav className = "Sidebar-nav">
                    {this.props.topMenu}
                </nav>
                <nav className = "Sidebar-nav">
                    {this.props.middleMenu}
                </nav>
                <nav className = "Sidebar-nav">
                    {this.props.bottomMenu}
                </nav>
            </aside>
        )
    }
}