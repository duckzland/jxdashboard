import React                from 'react';
import Component            from '../base/Component';
import Frame                from './Frame';


export default class InfoLine extends Component {
    render() {
        const { label, value, className } = this.props;

        return (
            <div className={ className }>
                <span className="label">{ label }</span>
                <span className="value">{ value }</span>
            </div>
        )
    }
}