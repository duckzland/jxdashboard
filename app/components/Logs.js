import React from 'react';
import Ansi from 'ansi-to-react-with-classes';

export default class Logs extends React.PureComponent {
    render() {
        return (
            <div className="logs">
                { this.props.logs.map((text) => {
                    return ( <div className="entry"><Ansi>{ text }</Ansi></div> );
                })}
            </div>
        )
    }
}