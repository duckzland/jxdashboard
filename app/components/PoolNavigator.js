import React                     from 'react';
import Component                 from '../base/Component';
import Frame                     from './Frame';
import { get, forEach, isEmpty } from 'lodash';

export default class PoolSelector extends Component {

    state = {
        data: {},
        newPool: '',
        active: ''
    };

    constructor(props) {
        super(props);
        this.locked = false;
        this.parseProps(props);
    }

    parseProps = (props) => {
        if ('data' in props) {
            this.state.data = props.data;
        }
        if ('active' in props) {
            this.state.active = props.active;
        }
    };

    update = (e) => {
        this.locked = false;
        this.setState({ newPool: e.target.value });
    };

    create = () => {
        this.props.onRegister(this.state.newPool);
    };

    render() {

        const { update, create } = this;
        const { onChange } = this.props;
        const { active, data } = this.state;

        const pools = get(data, 'pools', {});
        const PoolSelector = [];

        Object.keys(pools).sort().forEach((pool) => {
            const info = pools[pool];
            const menuItemProps = {
                key         : 'pool-selector-for-' + pool,
                className   : (active === pool) ? 'items active' : 'items',
                onClick     : () => onChange(pool)
            };
            const name = get(info, 'format.name', pool);

            PoolSelector.push( <div { ...menuItemProps }>{ !isEmpty(name) ? name : pool }</div> );
        });

        return (
            <div className="pool-selector">
                <div className="new-pool">
                    <Frame frameType="frame-a" title="Add Pool">
                        <div className="form-row">
                            <div className="items">
                                <input type="text" onChange={ update } placeholder="enter new pool name"/>
                            </div>
                            <div className="items">
                                <button className="form-button" onClick={ create }>+</button>
                            </div>
                        </div>
                    </Frame>
                </div>
                <Frame frameType="frame-e" className="menu" title="Registered Pools">
                    { PoolSelector }
                </Frame>
            </div>
        )
    }

}