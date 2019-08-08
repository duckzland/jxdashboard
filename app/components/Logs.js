import React                       from 'react';
import Ansi                        from 'ansi-to-react-with-classes';
import Typist                      from 'react-typist';

export default class Logs extends React.PureComponent {

    state = {};

    getKey(text) {
        return text.replace(/\033\[[0-9;]*m/,"").replace('-', '').replace(' ', '');
    }

    render() {
        return (
            <div className="logs">
                { this.props.logs.map((text, index) => {
                    return (
                        <div key={ this.getKey(text) } className="entry">
                            <Typist avgTypingDelay={0} stdTypingDelay={0} startDelay={ index * 500 } cursor={{ show: false }}>
                                <Ansi>{ text }</Ansi>
                            </Typist>
                        </div>
                    );
                })}
            </div>
        )
    }
}