import React              from 'react';
import Component          from '../base/Component';
import Config             from '../modules/Config';
import { Select, Option } from 'informed';
import { forEach, get, isEmpty, findKey }   from 'lodash';

export default class GpuSelector extends Component {

    state = {
        gpu              : [],
        data             : Config.storage,
        onlyHasNvidia    : false,
        onlyHasAmd       : false
    };

    constructor(props) {
        super(props);
        this.locked = false;
        this.parseProps(props);
    }

    parseProps = (props) => {
        if ('onlyHasNvidia' in props) {
            this.state.onlyHasNvidia = props.onlyHasNvidia;
        }
        if ('onlyHasAmd' in props) {
            this.state.onlyHasAmd = props.onlyHasAmd;
        }

        this.generate();
    };

    generate = () => {
        const detected     = get(this.state, 'data.dynamic.detected', {});
        const amd          = get(this.state, 'data.dynamic.server.GPU.amd', 0);
        const nvidia       = get(this.state, 'data.dynamic.server.GPU.nvidia', 0);
        this.state.gpu = [];

        const { onlyHasNvidia, onlyHasAmd } = this.state;

        forEach(detected, (data, type) => {
            if ((onlyHasNvidia && type !== 'nvidia' && (nvidia > 0))
                || (onlyHasAmd && type !== 'amd' && (amd > 0))
                || (type !== 'nvidia' && type !== 'amd')) {
                return;
            }

            forEach(data, (index) => {
                this.state.gpu.push({
                    type    : type,
                    index   : index
                });
            });
        });

    };

    render() {

        const { hasGlobal } = this.props;
        const { gpu }       = this.state;

        return (
            <Select { ...this.props }>
                { hasGlobal && <Option value="global">All GPU</Option> }
                {
                    gpu.map((unit, index) => {
                        const optionProps = {
                            key     : 'gpu-selector-option-' + index,
                            value   : unit.index
                        };

                        return (
                            <Option { ...optionProps } >{ '%type GPU:%index'.replace('%index', unit.index).replace('%type', unit.type.toUpperCase()) }</Option>
                        )
                    })
                }
            </Select>
        )
    }

}