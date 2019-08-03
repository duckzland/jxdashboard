import React                from 'react';
import Typist               from 'react-typist';
import Frame                from './Frame';


export default class InfoLine extends React.PureComponent {
    render() {
        const { label, value, className } = this.props;

        return (
            <div className={ className }>
                <span className="label">
                    <Typist avgTypingDelay="1" stdTypingDelay="2" startDelay={ Frame.svgCount * 100 } cursor={{ show: false }}>
                        { label }
                    </Typist>
                </span>
                <span className="value">
                    <Typist avgTypingDelay="1" stdTypingDelay="2" startDelay={ Frame.svgCount * 100 } cursor={{ show: false }}>
                        { value }
                    </Typist>
                </span>
            </div>
        )
    }
}