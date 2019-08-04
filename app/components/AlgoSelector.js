import React              from 'react';
import Component          from '../base/Component';
import Config             from '../modules/Config';
import { Select, Option } from 'informed';
import { forEach, get, isEmpty, findKey, omit, isEqual }   from 'lodash';

export default class AlgoSelector extends Component {

    state = {
        algos            : [],
        data             : Config.storage,
        onlyHasCpu       : false,
        onlyHasAmd       : false,
        onlyHasNvidia    : false,
        onlyHasDual      : false,
        onlyHasSecondary : false
    };

    constructor(props) {
        super(props);
        this.locked = false;
        this.parseProps(props);
    }

    componentWillReceiveProps(nextProps) {
        forEach(['onlyHasCpu', 'onlyHasAmd', 'onlyHasNvidia', 'onlyHasDual', 'onlyHasSecondary'], (key) => {
            if (key in nextProps && !isEqual(nextProps[key], this.state[key])) {
                this.parseProps(nextProps);
                this.locked = false;
                this.setState(this.state);
                return false;
            }
        });
    }

    parseProps = (props) => {
        if ('onlyHasCpu' in props) {
            this.state.onlyHasCpu = props.onlyHasCpu;
        }
        if ('onlyHasNvidia' in props) {
            this.state.onlyHasNvidia = props.onlyHasNvidia;
        }
        if ('onlyHasAmd' in props) {
            this.state.onlyHasAmd = props.onlyHasAmd;
        }

        if ('onlyHasDual' in props) {
            this.state.onlyHasDual = props.onlyHasDual;
        }

        if ('onlyHasSecondary' in props) {
            this.state.onlyHasSecondary = props.onlyHasSecondary;
        }

        this.generate();
    };

    validate = (miner) => {

        const { onlyHasCpu, onlyHasNvidia, onlyHasAmd, onlyHasDual, onlyHasSecondary } = this.state;
        const amd    = get(this.state, 'data.dynamic.server.GPU.amd', 0);
        const nvidia = get(this.state, 'data.dynamic.server.GPU.nvidia', 0);

        let valid = true;

        if (onlyHasCpu && !get(miner, 'cpu', false)) {
            valid = false;
        }

        if (onlyHasNvidia && (nvidia > 0) && !get(miner, 'nvidia', false)) {
            valid = false;
        }

        if (onlyHasAmd && (amd > 0) && !get(miner, 'amd', false)) {
            valid = false;
        }

        if (onlyHasDual && !get(miner, 'dual', false)) {
            valid = false;
        }

        if (onlyHasSecondary && !get(miner, 'secondary', false)) {
            valid = false;
        }

        return valid;
    };

    generate = () => {
        const miners = get(this.state, 'data.config.miner', {});
        this.state.algos = [];
        forEach(miners, (miner, algo) => {
            if (!this.validate(miner)) {
                return;
            }
            this.state.algos.push( algo );
        });

        this.state.algos.sort();
    };

    render() {

        const { hasGlobal, hasEmpty } = this.props;
        const { algos }               = this.state;

        return (
            <Select { ...this.props }>
                { hasEmpty  && <Option value="">Select Algorithm</Option> }
                { hasGlobal && <Option value="global">All Algorithm</Option> }
                {
                    algos.map((algo, index) => {
                        const optionProps = {
                            key  : 'algo-selector-option-' + algo,
                            value: algo
                        };
                        return (
                            <Option { ...optionProps } >{ algo }</Option>
                        )
                    })
                }
            </Select>
        )
    }

}