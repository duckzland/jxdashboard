import React        from 'react';
import ConfigPanel  from '../base/ConfigPanel';
import Config       from '../modules/Config';
import CoinSelector from '../components/CoinSelector';
import PoolSelector from '../components/PoolSelector';

import { get, merge, unset, isEmpty } from 'lodash';
import { Form, Text, Checkbox, Select, Option } from 'informed';

export default class PanelSettings extends ConfigPanel {

    state = {
        data: Config.storage
    };

    handleSave = () => {
        const config = new Config();
        config.blacklist.push('config.notification');
        config.blacklist.push('config.coins');
        config.blacklist.push('config.tuner');
        config.blacklist.push('config.slack');
        config.blacklist.push('config.watchdog');
        config.blacklist.push('config.systemd');
        config.blacklist.push('pools');
        config.save(this.savingStart, this.savingComplete);
    };

	render() {

        const { data }  = this.state;
        const coin      = get(data, 'config.machine.gpu_miner.coin', false);
        const coinData  = coin ? get(data, 'config.coins.' + coin, false) : false;
        const dual      = coinData && coinData.algo ? get(data, 'config.miner.' + coinData.algo + '.dual', false) : false;
        const secondary = coinData && coinData.algo ? get(data, 'config.miner.' + coinData.algo + '.secondary', false) : false;
        const btn       = (this.isSaving
            ? <button type="submit" className="form-button" disabled>Saving in progress...</button>
            : <button type="submit" className="form-button" onClick={ this.handleSave }>Save</button>
        );
        const svg       = (
            <svg className="svg-frame"
                 ref={ref => (this.svgElement = ref)}
                 viewBox="0 0 69.393 35.638"
                 xmlns="http://www.w3.org/2000/svg"
                 vector-effect="non-scaling-stroke"
                 preserveAspectRatio="none">
                <path className="orange-line" d="M69.257 30.954l.004 2.13-1.322 1.438L58 34.49l-.982 1.016h-6.615l-1.323-1.324H1.455L.132 32.859v-2.646"/>
                <path className="orange-line" d="M69.189 5.079V2.432l-.794-1.323h-3.44l-.764-.977-5.777.033-.602.944H1.455L.132 2.432v2.646"/>
                <path className="orange-line" d="M63.35 1.292l-.394.695-3.585-.006"/>
                <path className="orange-line" d="M51.75 33.799l.32-.566 3.584.007"/>
            </svg>
        );


        return (
            <Form id="settings-configuration" className="form-instance" getApi={ this.setFormApi } onChange={ this.handleChange } initialValues={ data }>
                { /* General Settings */ }
                <div className="inner-content">
                    { svg }
                    <h1 className="title form-title">General Settings</h1>
                    <div className="form-group">
                        <label className="form-label">Box name</label>
                        <Text id="box_name"
                              field="config.machine.settings.box_name"
                              initialValue={ get(data, 'config.machine.settings.box_name') }/>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Worker name</label>
                        <Text id="worker_name"
                              field="config.machine.settings.worker"
                              initialValue={ get(data, 'config.machine.settings.worker') }/>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email address</label>
                        <Text id="email"
                              field="config.machine.settings.email"
                              initialValue={ get(data, 'config.machine.settings.email') }/>
                    </div>
                    { btn }
                </div>

                { /* GPU Miner */ }
                <div className="inner-content">
                    { svg }
                    <h1 className="title form-title">GPU Miner</h1>
                    <div className="form-group">
                        <div className="pretty p-default">
                            <Checkbox id="gpu_miner_enable"
                                      field="config.machine.gpu_miner.enable"
                                      initialValue={ get(data, 'config.machine.gpu_miner.enable') }/>
                            <div className="state p-success-o">
                                <label className="form-checkbox">
                                    Enable GPU Miner
                                </label>
                            </div>
                        </div>
                    </div>

                    { get(data, 'config.machine.gpu_miner.enable', false)
                        && <div className="form-blocks">
                            <div className="form-group">
                                <label className="form-label">Coin to mine</label>
                                <CoinSelector field="config.machine.gpu_miner.coin"
                                              onlyHasWallet={ true }
                                              onlyHasPool={ true }
                                              onlyHasMiner={ true }
                                              onlyHasNvidia={ true }
                                              onlyHasAmd={ true }
                                              hasEmpty={ true }
                                              initialValue={ get(data, 'config.machine.gpu_miner.coin') }/>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Pool to use</label>
                                <PoolSelector field="config.machine.gpu_miner.pool"
                                              onlyHasCoin={ get(data, 'config.machine.gpu_miner.coin', false) }
                                              hasEmpty={ true }
                                              initialValue={ get(data, 'config.machine.gpu_miner.pool') }/>
                            </div>

                            { (dual && !secondary)
                                && <div className="form-group">
                                    <div className="pretty p-default">
                                        <Checkbox key="gpu_miner_dual"
                                                  field="config.machine.gpu_miner.dual"
                                                  initialValue={ get(data, 'config.machine.gpu_miner.dual') }/>
                                        <div className="state p-success-o">
                                            <label className="form-checkbox">
                                                Enable dual mining
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            }
                            { get(data, 'config.machine.gpu_miner.dual', false)
                                && dual
                                && !secondary
                                && <div className="form-blocks">
                                    <div className="form-group">
                                        <label className="form-label">Second Coin to mine</label>
                                        <CoinSelector key="config.machine.gpu_miner.second_coin"
                                                      field="config.machine.gpu_miner.second_coin"
                                                      onlyHasWallet={ true }
                                                      onlyHasPool={ true }
                                                      onlyHasMiner={ true }
                                                      onlyHasDual={ true }
                                                      onlyHasSecondary = { true }
                                                      hasEmpty={ true }
                                                      initialValue={ get(data, 'config.machine.gpu_miner.second_coin') }/>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Second Pool to use</label>
                                        <PoolSelector key="config.machine.gpu_miner.second_pool"
                                                      field="config.machine.gpu_miner.second_pool"
                                                      onlyHasCoin={ get(data, 'config.machine.gpu_miner.second_coin', false) }
                                                      hasEmpty={ true }
                                                      initialValue={ get(data, 'config.machine.gpu_miner.second_pool') }/>
                                    </div>
                                </div>
                            }
                            <div className="form-group">
                                <div className="pretty p-default">
                                    <Checkbox id="gpu_miner_enable"
                                              field="config.machine.settings.gpu_strict_poser_mode"
                                              initialValue={ get(data, 'config.machine.settings.gpu_strict_power_mode') }/>
                                    <div className="state p-success-o">
                                        <label className="form-checkbox">
                                            Use strict power mode for reporting GPU power usage
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    { btn }
                </div>

                { /* CPU Miner */ }
                <div className="inner-content">
                    { svg }
                    <h1 className="title form-title">CPU Miner</h1>
                    <div className="form-group">
                        <div className="pretty p-default">
                            <Checkbox id="cpu_miner_enable"
                                      field="config.machine.cpu_miner.enable"
                                      initialValue={ get(data, 'config.machine.cpu_miner.enable') }/>
                            <div className="state p-success-o">
                                <label className="form-checkbox">
                                    Enable CPU Miner
                                </label>
                            </div>
                        </div>
                    </div>
                    { get(data, 'config.machine.cpu_miner.enable', false)
                        && <div className="form-blocks">
                            <div className="form-group">
                                <label className="form-label">Coin to mine</label>
                                <CoinSelector key="config.machine.cpu_miner.coin"
                                              field="config.machine.cpu_miner.coin"
                                              onlyHasWallet={ true }
                                              onlyHasPool={ true }
                                              onlyHasMiner={ true }
                                              onlyHasCpu={ true }
                                              hasEmpty={ true }
                                              initialValue={ get(data, 'config.machine.cpu_miner.coin') }/>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Pool to use</label>
                                <PoolSelector key="config.machine.cpu_miner.pool"
                                              field="config.machine.cpu_miner.pool"
                                              onlyHasCoin={ get(data, 'config.machine.cpu_miner.coin', false) }
                                              hasEmpty={ true }
                                              initialValue={ get(data, 'config.machine.cpu_miner.pool') }/>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Number of CPU thread to use</label>
                                <Text id="cpu_thread"
                                      field="config.machine.cpu_miner.thread"
                                      type="number"
                                      min="0"
                                      initialValue={ get(data, 'config.machine.cpu_miner.thread') }/>
                                <div className="form-description">
                                    Throttle the miner instance mining intensity by lowering the number of CPU thread to use.
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">CPU miner priority</label>
                                <Text id="cpu_priority"
                                      field="config.machine.cpu_miner.priority"
                                      type="number"
                                      min="0"
                                      initialValue={ get(data, 'config.machine.cpu_miner.priority') }/>
                                <div className="form-description">
                                    Throttle the miner instance mining intensity by setting higher number of process priority.
                                </div>
                            </div>
                        </div>
                    }
                    { btn }
                </div>
            </Form>
        )
    }
}
