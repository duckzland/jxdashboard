import React                from 'react';
import Component            from '../base/Component';
import CoinSelector         from '../components/CoinSelector';
import Config               from '../modules/Config';
import { forEach }          from 'lodash';
import { Text, Scope }      from 'informed';

export default class PoolCoins extends Component {

    state = {
        data: [],
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

    isActive = (coin) => {
        let active = false;
        if (Config.storage.config.machine.cpu_miner.coin === coin) {
            active = true;
        }
        if (!active && Config.storage.config.machine.gpu_miner.coin === coin) {
            active = true;
        }
        if (!active && Config.storage.config.machine.gpu_miner.second_coin === coin) {
            active = true;
        }
        return active;
    };

    render() {
        const { isActive } = this;
        const { onRegister, onRemove } = this.props;
        const { data, active } = this.state;

        let Markup = data.filter(Boolean).map((coin, index) => {
            const showLabel = (index === 0);
            return (
                <div key={ 'pool-coins-row-' + active + '-' + index } className="form-row">
                    <Scope scope={ active + '[' + index + ']' }>
                        <div className="items">
                            { showLabel && <label className="form-label">Coin Code</label> }
                            <CoinSelector field={ 'coin' } onlyHasMiner={ true } hasEmpty={ true } initialValue={ coin.coin }/>
                        </div>
                        <div className="items">
                            { showLabel && <label className="form-label">Protocol</label> }
                            <Text key={ active + '-' + index + '-protocol' } type="text" field={ 'protocol' } initialValue={ coin.protocol }/>
                        </div>
                        <div className="items">
                            { showLabel && <label className="form-label">Url</label> }
                            <Text key={ active + '-' + index + '-url' } type="text" field={ 'url' } initialValue={ coin.url }/>
                        </div>
                        <div className="items">
                            { showLabel && <label className="form-label">Port</label> }
                            <Text key={ active + '-' + index + '-port' } type="text" field={ 'port' } initialValue={ coin.port }/>
                        </div>
                        <div className="items">
                            { showLabel && <label className="form-label">Password</label> }
                            <Text key={ active + '-' + index + '-password' } type="text" field={ 'password' } initialValue={ coin.password }/>
                        </div>
                        <div className="items">
                            { showLabel            && <label className="form-label">&nbsp;</label> }
                            { !isActive(coin.coin) && <button type="submit" className="form-button" onClick={ () => onRemove(index) }>X</button> }
                            { isActive(coin.coin)  && <button type="submit" className="form-button" disabled>O</button> }
                        </div>
                    </Scope>
                </div>
            )
        });
        return (
            <div className="pool-coins-rows">
                <Scope scope={ 'local' }>
                    { Markup }
                </Scope>
                <button type="submit" className="form-button" onClick={ onRegister }>
                    Add Coin
                </button>
            </div>



        )
    }

}