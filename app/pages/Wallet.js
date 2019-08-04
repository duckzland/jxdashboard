import React            from 'react';
import ScrollArea       from 'react-scrollbar';
import ConfigPanel      from '../base/ConfigPanel';
import Config           from '../modules/Config';
import WalletNavigator  from '../components/WalletNavigator';
import Frame            from '../components/Frame';
import FormGroup        from '../components/FormGroup';
import Donation         from '../components/Donation';

import { get, unset, isEmpty, forEach, merge, omit, isEqual } from 'lodash';
import { Text, Form } from 'informed';

var coinsTimer = null;

export default class PageWallets extends ConfigPanel {

    state = {
        activeCoin: '',
        data: {}
    };

    constructor(props) {
        super(props);

        this.state.data = omit(Config.storage, 'local');

        // Point to first coin
        if (isEmpty(this.state.activeCoin) && !isEmpty(this.state.data.config.coins)) {
            const coins = Object.keys(this.state.data.config.coins);
            if (coins.length && coins[0]) {
                this.state.activeCoin = coins.sort()[0];
            }
        }

    }

    change = (newCoin) => {
        if (!isEmpty(newCoin) && newCoin !== this.state.activeCoin) {
            this.state.activeCoin = newCoin;
            this.formApi.setValues(this.state.data);
            this.setState(this.state);
        }
    };

    add = (newCoin) => {
        if (!isEmpty(newCoin) && isEmpty(this.state.data.config.coins[newCoin])) {
            this.state.data.config.coins[newCoin] = {
                ticker: newCoin,
                name: '',
                algo: '',
                wallet: ''
            };
            this.formApi.setValues(this.state.data);
            this.state.activeCoin = newCoin;
            this.setState(this.state);
        }
    };

    remove = () => {
        const activeCoin = this.state.activeCoin;
        unset(this.state.data.config.coins, activeCoin);
        unset(this.state.data.config.coins, false);

        this.formApi.setValues(this.state.data);
        this.state.activeCoin = isEmpty(this.state.data.config.coins) ? false : Object.keys(this.state.data.config.coins).sort()[0];

        this.setState(this.state);
        this.handleSave();
    };


    handleChange = () => {
        clearTimeout(coinsTimer);
        coinsTimer = setTimeout(() => {
            const { activeCoin } = this.state;
            const values = get(this.formApi.getState().values.config.coins, activeCoin, false);
            unset(this.state.data.config.coins, activeCoin);
            const ticker = get(values, 'ticker', activeCoin);
            this.state.data.config.coins[ticker] = values;
            this.state.activeCoin = ticker;
            this.setState(this.state);
        }, 300);
    };


    handleSave = () => {
        const config = new Config();
        config.blacklist.push('config.notification');
        config.blacklist.push('config.fans');
        config.blacklist.push('config.machine');
        config.blacklist.push('config.slack');
        config.blacklist.push('config.tuner');
        config.blacklist.push('config.watchdog');
        config.blacklist.push('config.systemd');
        config.blacklist.push('pools');
        config.save(this.savingStart, this.savingComplete);
    };

    isActive = () => {
        let active = false;
        if (Config.storage.config) {
            if (Config.storage.config.machine.cpu_miner.coin === this.state.activeCoin) {
                active = true;
            }
            if (!active && Config.storage.config.machine.gpu_miner.coin === this.state.activeCoin) {
                active = true;
            }
            if (!active && Config.storage.config.machine.gpu_miner.second_coin === this.state.activeCoin) {
                active = true;
            }
        }
        return active;
    };


    render() {

        const sidebarProps = {
            key: 'sidebar-element',
            speed: 0.8,
            className: 'side-panels panel',
            contentClassName: 'content',
            horizontal: false,
            vertical: true
        };

        const contentProps = {
            key: 'content-element',
            speed: 0.8,
            className: 'main-panels panel',
            contentClassName: 'content configuration',
            horizontal: false,
            vertical: true
        };

        const { isActive }              = this;
        const { activeCoin, data }      = this.state;
        const fieldName                 = 'config.coins.' + activeCoin;
        const btn                       = (this.isSaving
                ? <button type="submit" className="form-button" disabled>Saving in progress...</button>
                : <button type="submit" className="form-button" onClick={ this.handleSave }>Save</button>
        );

        return (
            <div className="panels">
                <ScrollArea { ...sidebarProps }>
                    <WalletNavigator data={ data } active={ activeCoin } onRegister={ this.add } onChange={ this.change } />
                </ScrollArea>
                <ScrollArea { ...contentProps }>
                    <Form id="configuration" className="form-instance" getApi={ this.setFormApi } onChange={ this.handleChange } initialValues={ data }>
                        { !isEmpty(activeCoin)
                            ? <div className="form-content">
                                <Frame frameType="frame-c" title="Settings">
                                    <FormGroup title="Ticker" elementType="text" initialValue={ get(data, fieldName + '.ticker', activeCoin) }
                                               type="text" key={ fieldName + '.ticker' } field={ fieldName + '.ticker' }/>

                                    <FormGroup title="Name" elementType="text" initialValue={ get(data, fieldName + '.name', '') }
                                               type="text" key={ fieldName + '.name' }   field={ fieldName + '.name'   }/>

                                    <FormGroup title="Address" elementType="text" initialValue={ get(data, fieldName + '.wallet', '') }
                                               type="text" key={ fieldName + '.wallet' } field={ fieldName + '.wallet' }/>

                                    <FormGroup title="Algorithm" elementType="algoselector" initialValue={ get(data, fieldName + '.algo', '') }
                                               key={ fieldName + '.algo' } field={ fieldName + '.algo' } hasEmpty={ true }/>

                                    { isActive() && <div className="notification">This coin is used for mining, cannot be removed</div> }
                                    { btn }
                                    { !isEmpty(activeCoin)
                                        && !isActive()
                                        && <button type="submit" className="form-button" onClick={ this.remove }>
                                            Remove
                                        </button> }
                                </Frame>
                            </div>
                            : <div className="form-content">
                                <Frame frameType="frame-c" title="No Coin Defined, please add one or more coin">
                                    <Text key={ 'coins' } field={ 'coins' } type="hidden"/>
                                </Frame>
                              </div>
                        }
                    </Form>
                    <Donation/>
                </ScrollArea>
            </div>
        )
    }
}
