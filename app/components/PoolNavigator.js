import React                from 'react';
import Component            from '../base/Component';
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
        forEach(pools, (info, pool) => {
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
                    <div className="inner-content">
                        <svg className="svg-frame"
                             ref={ref => (this.svgElement = ref)}
                             viewBox="0 0 41.612 14.471"
                             xmlns="http://www.w3.org/2000/svg"
                             vector-effect="non-scaling-stroke"
                             preserveAspectRatio="none">
                            <path className="orange-line" d="M41.475 9.788l.004 2.129-1.321 1.438-9.94-.032-.982 1.016h-6.614l-1.323-1.323H1.455L.132 11.693V9.047M41.407 5.078V2.433l-.793-1.323h-3.44L36.41.133l-5.778.033-.602.944H1.455L.132 2.433v2.645"/>
                            <path className="orange-line" d="M35.57 1.292l-.395.695-3.585-.006M23.969 12.632l.319-.565 3.585.006"/>
                        </svg>
                        <h3 className="title">Add Pool</h3>
                        <div className="form-row">
                            <div className="items">
                                <input type="text" onChange={ update } placeholder="enter new pool name"/>
                            </div>
                            <div className="items">
                                <button className="form-button" onClick={ create }>Add</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="inner-content menu">
                    <svg className="svg-frame svg-top"
                         ref={ref => (this.svgElement = ref)}
                         viewBox="0 0 69.393 35.638"
                         xmlns="http://www.w3.org/2000/svg"
                         vector-effect="non-scaling-stroke"
                         preserveAspectRatio="none">

                        <path className="orange-line" d="M69.189 5.079V2.433l-.794-1.323h-3.44l-.764-.977-5.778.033-.601.944H1.455L.132 2.433v2.646"/>
                        <path className="orange-line" d="M63.351 1.292l-.395.695-3.585-.006"/>

                    </svg>
                    { PoolSelector }
                    <svg className="svg-frame svg-bottom"
                         ref={ref => (this.svgElement = ref)}
                         viewBox="0 0 69.393 5.424"
                         xmlns="http://www.w3.org/2000/svg"
                         vector-effect="non-scaling-stroke"
                         preserveAspectRatio="none">
                        <path className="orange-line" d="M69.256.74l.004 2.13-1.321 1.439-9.94-.032-.981 1.015h-6.616l-1.323-1.323H1.455L.132 2.646V0"/>
                        <path className="orange-line" d="M51.75 3.585l.319-.565 3.585.006"/>
                    </svg>
                </div>
            </div>
        )
    }

}