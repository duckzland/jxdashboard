import React              from 'react';
import Component          from '../base/Component';
import Config             from '../modules/Config';
import { Select, Option } from 'informed';
import { forEach, get, isEmpty, findKey }   from 'lodash';

export default class CoinSelector extends Component {

    state = {
        coins            : [],
        data             : Config.storage,
        onlyHasMiner     : false,
        onlyHasWallet    : false,
        onlyHasPool      : false,
        onlyHasCpu       : false,
        onlyHasNvidia    : false,
        onlyHasAmd       : false,
        onlyHasDual      : false,
        onlyHasSecondary : false
    };

    constructor(props) {
        super(props);
        this.locked = false;
        this.parseProps(props);
    }

    parseProps = (props) => {
        if ('onlyHasMiner' in props) {
            this.state.onlyHasMiner = props.onlyHasMiner;
        }
        if ('onlyHasWallet' in props) {
            this.state.onlyHasMiner = props.onlyHasWallet;
        }
        if ('onlyHasPool' in props) {
            this.state.onlyHasMiner = props.onlyHasPool;
        }
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


    validate = (coin) => {
        const miners = get(this.state, 'data.config.miner', {});
        const pools  = get(this.state, 'data.pools',        {});
        const amd    = get(this.state, 'data.dynamic.server.GPU.amd', 0);
        const nvidia = get(this.state, 'data.dynamic.server.GPU.nvidia', 0);
        const { onlyHasMiner, onlyHasWallet, onlyHasPool, onlyHasCpu, onlyHasNvidia, onlyHasAmd, onlyHasDual, onlyHasSecondary } = this.state;
        
        let valid = true;
        if (!coin.algo || isEmpty(coin.algo)) {
            valid = false;
        }

        if (!coin.name || isEmpty(coin.name)) {
            valid = false;
        }

        if (!coin.ticker || isEmpty(coin.ticker)) {
            valid = false;
        }

        if (onlyHasMiner && !get(miners, coin.algo, false)) {
            valid = false;
        }

        if (onlyHasCpu && !get(miners, coin.algo + '.cpu', false)) {
            valid = false;
        }

        if (onlyHasNvidia && (nvidia > 0) && !get(miners, coin.algo + '.nvidia', false)) {
            valid = false;
        }

        if (onlyHasAmd && (amd > 0) && !get(miners, coin.algo + '.amd', false)) {
            valid = false;
        }

        if (onlyHasDual && !get(miners, coin.algo + '.dual', false)) {
            valid = false;
        }

        if (onlyHasSecondary && !get(miners, coin.algo + '.secondary', false)) {
            valid = false;
        }

        if (onlyHasWallet && isEmpty(coin.wallet)) {
            valid = false;
        }

        if (onlyHasPool && !findKey(pools, coin.ticker)) {
            valid = false;
        }

        return valid;
    };

    generate = () => {
        const coins  = get(this.state, 'data.config.coins', {});
        this.state.coins = [];
        forEach(coins, (coin, ticker) => {
            coin.ticker = ticker;
            if (!this.validate(coin)) {
                return;
            }

            this.state.coins.push( coin );
        });

    };

    render() {

        const { hasGlobal, hasEmpty } = this.props;
        const { coins }      = this.state;

        return (
            <Select { ...this.props }>
                { hasEmpty  && <Option value="">Select Coin</Option>     }
                { hasGlobal && <Option value="global">All Coins</Option> }
                {
                    coins.map((coin, index) => {
                        const optionProps = {
                            key: 'coin-selector-option-' + index,
                            value: coin.ticker
                        };

                        return (
                            <Option { ...optionProps } >{ coin.name }</Option>
                        )
                    })
                }
            </Select>
        )
    }

}