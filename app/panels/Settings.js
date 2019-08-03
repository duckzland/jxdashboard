import React        from 'react';
import ConfigPanel  from '../base/ConfigPanel';
import Config       from '../modules/Config';
import CoinSelector from '../components/CoinSelector';
import PoolSelector from '../components/PoolSelector';
import Frame        from '../components/Frame';
import FormGroup    from '../components/FormGroup';
import { get  }     from 'lodash';
import { Form }     from 'informed';

export default class PanelSettings extends ConfigPanel {

    state = {
        data: Config.storage
    };

    handleSave() {
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

        return (
            <Form id="settings-configuration" className="form-instance" getApi={ this.setFormApi } onChange={ this.handleChange } initialValues={ data }>
                { /* General Settings */ }
                <Frame frameType="frame-c" title="General Settings">
                    <FormGroup title="Box Name"
                               elementType="text"
                               id="box_name"
                               field="config.machine.settings.box_name"
                               initialValue={ get(data, 'config.machine.settings.box_name') } />

                    <FormGroup title="Worker name"
                               elementType="text"
                               id="worker_name"
                               field="config.machine.settings.worker"
                               initialValue={ get(data, 'config.machine.settings.worker') }/>

                    <FormGroup title="Email address"
                               elementType="text"
                               id="email"
                               field="config.machine.settings.email"
                               initialValue={ get(data, 'config.machine.settings.email') }/>
                    { btn }
                </Frame>

                { /* GPU Miner */ }
                <Frame frameType="frame-c" title="GPU Miner">
                    <FormGroup title="Enable GPU Miner"
                               elementType="checkbox"
                               id="gpu_miner_enable"
                               field="config.machine.gpu_miner.enable"
                               initialValue={ get(data, 'config.machine.gpu_miner.enable') }/>

                    { get(data, 'config.machine.gpu_miner.enable', false)
                        && <div className="form-blocks">
                            <FormGroup title="Coin to mine"
                                       elementType="coinselector"
                                       field="config.machine.gpu_miner.coin"
                                       onlyHasWallet={ true }
                                       onlyHasPool={ true }
                                       onlyHasMiner={ true }
                                       onlyHasNvidia={ true }
                                       onlyHasAmd={ true }
                                       hasEmpty={ true }
                                       initialValue={ get(data, 'config.machine.gpu_miner.coin') } />

                            <FormGroup title="Pool to use"
                                       elementType="poolselector"
                                       field="config.machine.gpu_miner.pool"
                                       onlyHasCoin={ get(data, 'config.machine.gpu_miner.coin', false) }
                                       hasEmpty={ true }
                                       initialValue={ get(data, 'config.machine.gpu_miner.pool') } />

                            { (dual && !secondary)
                                && <FormGroup title="Enable dual mining"
                                              elementType="checkbox"
                                              key="gpu_miner_dual"
                                              field="config.machine.gpu_miner.dual"
                                              initialValue={ get(data, 'config.machine.gpu_miner.dual') }/>
                            }
                            { get(data, 'config.machine.gpu_miner.dual', false)
                                && dual
                                && !secondary
                                && <div className="form-blocks">
                                    <FormGroup title="Second Coin to mine"
                                               elementType="coinselector"
                                               key="config.machine.gpu_miner.second_coin"
                                               field="config.machine.gpu_miner.second_coin"
                                               onlyHasWallet={ true }
                                               onlyHasPool={ true }
                                               onlyHasMiner={ true }
                                               onlyHasDual={ true }
                                               onlyHasSecondary = { true }
                                               hasEmpty={ true }
                                               initialValue={ get(data, 'config.machine.gpu_miner.second_coin') }/>

                                    <FormGroup title="Second Pool to use"
                                               elementType="poolselector"
                                               key="config.machine.gpu_miner.second_pool"
                                               field="config.machine.gpu_miner.second_pool"
                                               onlyHasCoin={ get(data, 'config.machine.gpu_miner.second_coin', false) }
                                               hasEmpty={ true }
                                               initialValue={ get(data, 'config.machine.gpu_miner.second_pool') }/>
                                </div>
                            }
                            <FormGroup title="Use strict power mode for reporting GPU power usage"
                                       elementType="checkbox"
                                       id="gpu_miner_enable"
                                       field="config.machine.settings.gpu_strict_poser_mode"
                                       initialValue={ get(data, 'config.machine.settings.gpu_strict_power_mode') }/>
                        </div>
                    }
                    { btn }
                </Frame>

                { /* CPU Miner */ }
                <Frame frameType="frame-c" title="CPU Miner">
                    <FormGroup title="Enable CPU Miner"
                               elementType="checkbox"
                               id="cpu_miner_enable"
                               field="config.machine.cpu_miner.enable"
                               initialValue={ get(data, 'config.machine.cpu_miner.enable') }/>

                    { get(data, 'config.machine.cpu_miner.enable', false)
                        && <div className="form-blocks">
                            <FormGroup title="Coin to mine"
                                       elementType="coinselector"
                                       key="config.machine.cpu_miner.coin"
                                       field="config.machine.cpu_miner.coin"
                                       onlyHasWallet={ true }
                                       onlyHasPool={ true }
                                       onlyHasMiner={ true }
                                       onlyHasCpu={ true }
                                       hasEmpty={ true }
                                       initialValue={ get(data, 'config.machine.cpu_miner.coin') }/>

                            <FormGroup title="Pool to use"
                                       elementType="poolselector"
                                       key="config.machine.cpu_miner.pool"
                                       field="config.machine.cpu_miner.pool"
                                       onlyHasCoin={ get(data, 'config.machine.cpu_miner.coin', false) }
                                       hasEmpty={ true }
                                       initialValue={ get(data, 'config.machine.cpu_miner.pool') }/>

                            <FormGroup title="Number of CPU thread to use"
                                       description="Throttle the miner instance mining intensity by lowering the number of CPU thread to use."
                                       elementType="text"
                                       id="cpu_thread"
                                       field="config.machine.cpu_miner.thread"
                                       type="number"
                                       min="0"
                                       initialValue={ get(data, 'config.machine.cpu_miner.thread') } />

                            <FormGroup title="CPU miner priority"
                                       description="Throttle the miner instance mining intensity by setting higher number of process priority."
                                       elementType="text"
                                       id="cpu_priority"
                                       field="config.machine.cpu_miner.priority"
                                       type="number"
                                       min="0"
                                       initialValue={ get(data, 'config.machine.cpu_miner.priority') }/>
                        </div>
                    }
                    { btn }
                </Frame>
            </Form>
        )
    }
}
