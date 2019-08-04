import React                     from 'react';
import Component                 from '../base/Component';
import Frame                     from './Frame';
import { get, forEach, isEmpty } from 'lodash';

export default class WalletSelector extends Component {

    state = {
        data: {},
        newCoin: '',
        active: '',
        error: ''
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
        e && e.target && this.setState({ newCoin: e.target.value });
    };

    create = () => {
        this.validate() && this.props.onRegister(this.state.newCoin);
    };

    validate = () => {
        if (Object.keys(this.state.data.config.coins).indexOf(this.state.newCoin) === -1) {
            this.state.error = '';
        }
        else {
            this.state.error = 'Coin exists';
        }

        return this.state.error === '';
    };

    render() {

        const { update, create }      = this;
        const { onChange }            = this.props;
        const { active, data, error } = this.state;

        const coins = get(data, 'config.coins', {});
        const CoinsSelector = [];

        Object.keys(coins).sort().forEach((ticker) => {
            const coin = coins[ticker];
            const menuItemProps = {
                key         : 'coin-selector-for-' + ticker,
                className   : (active === ticker) ? 'items active' : 'items',
                onClick     : () => onChange(ticker)
            };
            const name = get(coin, 'name', '');

            CoinsSelector.push( <div { ...menuItemProps }>{ !isEmpty(name) ? name : ticker }</div> );
        });

        return (
            <div className="coin-selector">
                <div className="new-coin">
                    <Frame frameType="frame-a" title="Add New Coin">
                        <div className="form-row">
                            <div className="items">
                                <input type="text" onChange={ update } placeholder="enter new coin ticker name"/>
                            </div>
                            <div className="items">
                                <button className="form-button" onClick={ create }>+</button>
                            </div>
                        </div>
                        { !isEmpty(error) && <div className="error">{ error }</div> }
                    </Frame>
                </div>
                <Frame frameType="frame-c" className="menu" title="Registered Coins">
                    { CoinsSelector }
                </Frame>
            </div>
        )
    }

}