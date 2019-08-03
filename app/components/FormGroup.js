import React                from 'react';
import Component            from '../base/Component';
import CoinSelector         from './CoinSelector';
import PoolSelector         from './PoolSelector';
import GpuSelector          from './GpuSelector';
import FanSelector          from './FanSelector';
import AlgoSelector         from './AlgoSelector';
import Frame                from './Frame';
import { omit }             from 'lodash';
import Typist               from 'react-typist';
import { Text, Checkbox, Select } from 'informed';

export default class FormGroup extends Component {

    delay = 10;
    duration = 200;

    constructor(props) {
        super(props);
        this.elementRef = React.createRef();

        !props.elementStopAnimate && this.fader.push(this.elementRef);

        this.getFormElement = this.getFormElement.bind(this);
    }

    getFormElement(elementType) {
        let element = [];
        const elProps = omit(this.props, ['title', 'elementType', 'elementClass', 'children', 'description']);
        switch (elementType) {
            case 'text':
                element.push(<Text { ...elProps } />);
                break;

            case 'checkbox':
                element.push(
                    <div className="pretty p-default">
                        <Checkbox { ...elProps } />
                        <div className="state p-success-o">
                            <label className="form-checkbox">
                                <Typist avgTypingDelay="1" stdTypingDelay="2" startDelay={ Frame.svgCount * 100 } cursor={{ show: false }}>
                                    { this.props.title }
                                </Typist>
                            </label>
                        </div>
                    </div>
                );
                break;

            case 'select':
                element.push(
                    <Select { ...elProps }>
                        { this.props.children }
                    </Select>
                );
                break;

            case 'coinselector':
                element.push(<CoinSelector { ...elProps } />);
                break;

            case 'poolselector':
                element.push(<PoolSelector { ...elProps } />);
                break;

            case 'gpuselector':
                element.push(<GpuSelector { ...elProps } />);
                break;

            case 'fanselector':
                element.push(<FanSelector { ...elProps } />);
                break;

            case 'algoselector':
                element.push(<AlgoSelector { ...elProps } />);
                break;
        }

        return element;
    };

    render() {
        const { title, description, elementType, children } = this.props;
        const elementClass = this.props.elementClass ? this.props.elementClass : 'form-group';
        const typistProps = {
            avgTypingDelay: 0,
            stdTypingDelay: 0,
            startDelay: Frame.svgCount * 10,
            cursor: {
                show: false
            }
        };
        
        return (
            <div className={ elementClass } ref={ this.elementRef }>
                { title && elementType !== 'checkbox' && <label className="form-label"><Typist { ...typistProps }>{ title }</Typist></label> }
                { elementType !== 'select' && children }
                { elementType && this.getFormElement(elementType) }
                { description && <div className="form-description"><Typist { ...typistProps }>{ description }</Typist></div> }
            </div>
        )
    }

}