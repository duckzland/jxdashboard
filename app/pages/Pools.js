import React         from 'react';
import ScrollArea    from 'react-scrollbar';
import ConfigPanel   from '../base/ConfigPanel';
import Config        from '../modules/Config';
import PoolNavigator from '../components/PoolNavigator';
import PoolCoins     from '../components/PoolCoins';
import Frame         from '../components/Frame';
import FormGroup     from '../components/FormGroup';

import { get, unset, isEmpty, forEach, merge, omit } from 'lodash';
import { Text, Form } from 'informed';

export default class PagePools extends ConfigPanel {

    state = {
        activePool: '',
        data: {}
    };

    constructor(props) {
        super(props);

        this.state.data = omit(Config.storage, 'local');

        // Point to first pool
        if (isEmpty(this.state.activePool) && !isEmpty(this.state.data.pools)) {
            const pools = Object.keys(this.state.data.pools);
            if (pools.length && pools[0]) {
                this.state.activePool = pools[0];
            }
        }

        this.convertProps();

        if (isEmpty(this.state.data.local[this.state.activePool]) && !isEmpty(this.state.activePool)) {
            this.state.data.local[this.state.activePool] = [{
                coin    : '',
                protocol: '',
                url     : '',
                port    : '',
                password: ''
            }];
        }

    }

    changePool = (newPool) => {
        if (!isEmpty(newPool) && newPool !== this.state.activePool) {
            this.state.activePool = newPool;
            this.convertProps();
            if (isEmpty(this.state.data.local[this.state.activePool]) && !isEmpty(this.state.activePool)) {
                this.state.data.local[this.state.activePool] = [{
                    coin    : '',
                    protocol: '',
                    url     : '',
                    port    : '',
                    password: ''
                }];
            }
            this.formApi.setValues(this.state.data);
            this.setState(this.state);
        }
    };

    addPool = (newPool) => {
        if (!isEmpty(newPool) && isEmpty(this.state.data.pools[newPool])) {
            this.state.data.pools[newPool] = {
                format: {
                    name    : newPool,
                    wallet  : '',
                    address : ''
                }
            };
            this.state.data.local[newPool] = [];

            let newPoolObject = {};
            newPoolObject[newPool] = {
                format: {
                    name    : newPool,
                    wallet  : '',
                    address : ''
                }
            };
            merge(newPoolObject, this.state.data.pools);
            this.state.data.pools = newPoolObject;
            this.state.data.local[newPool] = [
                {
                    coin    : '',
                    protocol: '',
                    url     : '',
                    port    : '',
                    password: ''
                }
            ];
            this.formApi.setValues(this.state.data);
            this.state.activePool = newPool;
            this.setState(this.state);
        }
    };

    removePool = () => {
        const activePool = this.state.activePool;
        unset(this.state.data.local, activePool);
        unset(this.state.data.pools, activePool);
        unset(this.state.data.pools, false);
        this.formApi.setValues(this.state.data);
        this.state.activePool = isEmpty(this.state.data.pools) ? false : Object.keys(this.state.data.pools)[0];
        this.convertProps();
        this.setState(this.state);
    };

    addCoin = () => {
        const activePool = this.state.activePool;

        if (!this.state.data.local[activePool]) {
            this.state.data.local[activePool] = [];
        }

        this.state.data.local[activePool].push({
            coin    : '',
            protocol: '',
            url     : '',
            port    : '',
            password: ''
        });
        this.formApi.setValues(this.state.data);
        this.setState(this.state);
    };

    removeCoin = (index) => {
        const activePool = this.state.activePool;
        const removedCoin = this.state.data.local[activePool][index];
        if (!isEmpty(removedCoin.coin)) {
            unset(this.state.data.pools, activePool + '.' + removedCoin.coin);
        }
        this.state.data.local[activePool].splice(index, 1);
        this.formApi.setValues(this.state.data);
        this.state.data.local[activePool].length === 0
            ? this.addCoin()
            : this.setState(this.state);
    };

    handleChange = () => {
        this.state.data = merge(this.state.data, this.formApi.getState().values);
        this.convertLocal();
        this.setState(this.state);
    };

    handleSave = () => {
        const config = new Config();
        config.blacklist.push('config');
        config.save(this.savingStart, this.savingComplete);
    };

    isActive = () => {
        let active = false;
        if (Config.storage.config.machine.cpu_miner.pool === this.state.activePool) {
            active = true;
        }
        if (!active && Config.storage.config.machine.gpu_miner.pool === this.state.activePool) {
            active = true;
        }
        if (!active && Config.storage.config.machine.gpu_miner.second_pool === this.state.activePool) {
            active = true;
        }
        return active;
    };

    convertProps = () => {
        const pools = this.state.data.pools;
        const activePool = this.state.activePool;

        this.state.data.local = {};
        !isEmpty(activePool)
            && !isEmpty(pools)
            && forEach(pools, (data, pool) => {

                if (activePool !== pool) {
                    return;
                }

                this.state.data.local[pool] = [];
                forEach(data, (coinData, coin) => {
                    if (coin !== 'format' && coin !== 'code') {
                        this.state.data.local[pool].push({
                            coin     : coin,
                            protocol : get(coinData, 'protocol', ''),
                            url      : get(coinData, 'url', ''),
                            port     : get(coinData, 'port', ''),
                            password : get(coinData, 'password', '')
                        });
                    }
                });
            });
    };

    convertLocal = () => {
        const poolCoins = this.state.data.local;
        const activePool = this.state.activePool;

        if (!this.state.data.pools) {
            this.state.data.pools = {};
        }

        !isEmpty(activePool) && forEach(poolCoins, (coins, pool) => {

            if (activePool !== pool) {
                return;
            }

            forEach(coins, (coin) => {
                if (!coin || !coin.coin) {
                    return;
                }
                if (!this.state.data.pools[pool]) {
                    this.state.data.pools[pool] = {};
                }
                this.state.data.pools[pool][coin.coin] = {
                    protocol : get(coin, 'protocol', ''),
                    url      : get(coin, 'url',      ''),
                    port     : get(coin, 'port',     ''),
                    password : get(coin, 'password', '')
                };
            });
        });

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

        const { isActive } = this;
        const { activePool, data } = this.state;
        const fieldName     = 'pools.' + activePool;
        const activeData    = get(data, 'local.' + activePool);
        const format        = get(data, 'pools.' + activePool + '.format',    { name: '', wallet: '', address: ''});
        const btn           = (this.isSaving
                ? <button type="submit" className="form-button" disabled>Saving in progress...</button>
                : <button type="submit" className="form-button" onClick={ this.handleSave }>Save</button>
        );

        const { name, wallet, address } = format;

        return (
            <div className="panels">
                <ScrollArea { ...sidebarProps }>
                    <PoolNavigator data={ data } active={ activePool } onRegister={ this.addPool } onChange={ this.changePool } />
                </ScrollArea>
                <ScrollArea { ...contentProps }>
                    <Form id="configuration" className="form-instance" getApi={ this.setFormApi } onChange={ this.handleChange } initialValues={ data }>
                        { !isEmpty(activePool)
                            ? <div className="form-content">
                                <Frame frameType="frame-c" title="Settings">
                                    <FormGroup title="Pool Name"
                                               elementType="text"
                                               key={ fieldName + '.format.name' }
                                               field={ fieldName + '.format.name' }
                                               type="text"
                                               initialValue={ name }/>

                                    <FormGroup title="Wallet Format"
                                               description={ 'Example format : {wallet}.{worker}/{email}' }
                                               elementType="text"
                                               key={ fieldName + '.format.wallet' }
                                               field={ fieldName + '.format.wallet' }
                                               type="text"
                                               initialValue={ wallet }/>

                                    <FormGroup title="Address Format"
                                               description={ 'Example format : {protocol}://{url}:{port}' }
                                               elementType="text"
                                               key={ fieldName + '.format.address' }
                                               field={ fieldName + '.format.address' }
                                               type="text"
                                               initialValue={ address }/>

                                    { btn }
                                    { !isEmpty(activePool)
                                        && !isActive()
                                        && <button type="submit" className="form-button" onClick={ this.removePool }>
                                            Remove
                                        </button> }
                                </Frame>
                            { activeData
                                && activePool
                                && <Frame frameType="frame-c" title="Coin Settings">
                                    <PoolCoins data={ activeData }
                                                  active={ activePool }
                                                  onRegister={ this.addCoin }
                                                  onRemove={ this.removeCoin }/>
                                    { btn }
                                </Frame> }
                            </div>
                            : <div className="form-content">
                                <Frame frameType="frame-c" title="No Pool Defined, please add one or more pool">
                                    <Text key={ 'pools' } field={ 'pools' } type="hidden"/>
                                </Frame>
                              </div>
                        }
                    </Form>
                </ScrollArea>
            </div>
        )
    }
}
