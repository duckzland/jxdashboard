import React                from 'react';
import CoinSelector         from './CoinSelector';
import PoolSelector         from './PoolSelector';
import GpuSelector          from './GpuSelector';
import FanSelector          from './FanSelector';
import AlgoSelector         from './AlgoSelector';
import { omit }             from 'lodash';
import { Text, Checkbox, Select } from 'informed';

export default class FormGroup extends React.PureComponent {

    getFormElement = (elementType) => {
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
                                { this.props.title }
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
        return (
            <div className={ elementClass }>
                { title && elementType !== 'checkbox' && <label className="form-label">{ title }</label> }
                { elementType !== 'select' && children }
                { elementType && this.getFormElement(elementType) }
                { description && <div className="form-description">{ description }</div> }
            </div>
        )
    }

}