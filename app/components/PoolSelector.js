import React              from 'react';
import Component          from '../base/Component';
import Config             from '../modules/Config';
import { Select, Option } from 'informed';
import { forEach, get, isEmpty, sortBy, findKey }   from 'lodash';

export default class PoolSelector extends Component {

    state = {
        pools            : [],
        data             : Config.storage,
        onlyHasCoin      : false
    };

    constructor(props) {
        super(props);
        this.locked = false;
        this.parseProps(props);
    }

    parseProps = (props) => {
        if ('onlyHasCoin' in props) {
            this.state.onlyHasCoin = props.onlyHasCoin;
        }

        this.generate();
    };


    validate = (pool) => {

        const { onlyHasCoin } = this.state;
        
        let valid = true;
        if (onlyHasCoin && !get(pool, onlyHasCoin, false)) {
            valid = false;
        }

        return valid;
    };

    generate = () => {
        const pools  = get(this.state, 'data.pools', {});
        this.state.pools = [];
        forEach(pools, (pool, code) => {
            pool.format.code = code;
            if (!this.validate(pool)) {
                return;
            }

            this.state.pools.push( pool );
        });

        this.state.pools = sortBy(this.state.pools, 'name');

    };

    render() {

        const { hasGlobal, hasEmpty } = this.props;
        const { pools }               = this.state;

        return (
            <Select { ...this.props }>
                { hasEmpty  && <Option value="">Select Pool</Option> }
                { hasGlobal && <Option value="global">All Pools</Option> }
                {
                    pools.map((pool, index) => {
                        const optionProps = {
                            key  : 'pool-selector-option-' + index,
                            value: pool.format.code
                        };
                        const name = !isEmpty(pool.name) ? pool.name : pool.format.code;
                        return (
                            <Option { ...optionProps } >{ name }</Option>
                        )
                    })
                }
            </Select>
        )
    }

}