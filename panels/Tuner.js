import React        from 'react';
import GpuTuner     from '../components/GpuTuner';
import FanSettings  from '../components/FanSettings';
import CoinSelector from '../components/CoinSelector';
import GpuSelector  from '../components/GpuSelector';
import Config       from '../modules/Config';
import ConfigPanel  from '../base/ConfigPanel';
import { get, merge, unset, isEmpty, forEach, omit, defer } from 'lodash';
import { Form, Text, Checkbox, Select, Option } from 'informed';


export default class PanelTuner extends ConfigPanel {

    state = {
        data: Config.storage,
        fansName: 'config.fans.gpu',
        tuneName: 'config.tuner.%s'
    };

    constructor(props) {
        super(props);
        this.generateName();
    }

    handleChange = () => {
        this.state.data = merge(this.state.data, this.formApi.getState().values);
        this.generateName();
        this.setState(this.state);
    };

    handleSave = () => {
        const config = new Config();
        config.blacklist.push('config.notification');
        config.blacklist.push('config.coins');
        config.blacklist.push('config.machine');
        config.blacklist.push('config.slack');
        config.blacklist.push('config.watchdog');
        config.blacklist.push('config.systemd');
        config.blacklist.push('pools');
        config.save(this.savingStart, this.savingComplete);
        config.reload();
    };

    removeOverride = () => {
        const { fansName, tuneName } = this.state;

        unset(this, 'state.data.' + fansName);
        unset(this, 'state.data.' + tuneName.replace('%s', 'core'));
        unset(this, 'state.data.' + tuneName.replace('%s', 'memory'));
        unset(this, 'state.data.' + tuneName.replace('%s', 'power'));

        this.state.data.local.name.gpu  = 'global';
        this.state.data.local.name.coin = 'global';

        this.formApi.setValues(this.state.data);
    };

    generateName = () => {
        const gpu  = get(this, 'state.data.local.name.gpu', 'global');
        const coin = get(this, 'state.data.local.name.coin', 'global');

        let fan  = 'config.fans.gpu';
        let tune = 'config.tuner.%s';

        if (gpu !== 'global') {
            fan  += '|' + gpu;
            tune += '|' + gpu;
        }

        if (coin !== 'global') {
            fan  += '|' + coin;
            tune += '|' + coin;
        }
        this.state.fansName = fan;
        this.state.tuneName = tune;
    };
	
	render() {

        const { data, fansName, tuneName } = this.state;

        return (
            <div className="inner-content">
                <Form id="tuner-configuration" className="form-instance" getApi={ this.setFormApi } onChange={ this.handleChange } initialValues={ data }>
                    <h1 className="form-title">Global Settings</h1>
                    <div className="form-group">
                        <div className="pretty p-default">
                            <Checkbox id="enable_tuner"
                                      field="config.tuner.settings.enable"
                                      initialValue={ get(data, 'config.tuner.settings.enable') }/>
                            <div className="state p-success-o">
                                <label className="form-checkbox">
                                    Enable GPU Tuner
                                </label>
                            </div>
                        </div>
                    </div>

                    { get(data, 'config.tuner.settings.enable', false)
                        && <div className="gpu-tuners-block">
                            <div className="form-row">
                                <div className="items">
                                    <label className="form-label">Tuning Mode</label>
                                    <Select id="tuner_mode"
                                            field="config.tuner.settings.mode"
                                            initialValue={ get(data, 'config.tuner.settings.mode') }>
                                        <Option value="dynamic">Dynamic</Option>
                                        <Option value="static">Static</Option>
                                        <Option value="time">Time based</Option>
                                    </Select>
                                </div>
                                { ( get(data, 'config.tuner.settings.mode', 'dynamic') === 'time')
                                    && <div className="items">
                                        <label className="form-label">Hour to use minimum power</label>
                                        <Text id="tuner_minhour"
                                              field="config.tuner.settings.minHour"
                                              type="number"
                                              min="0"
                                              max="24"
                                              initialValue={ get(data, 'config.tuner.settings.minHour') }/>
                                    </div> }
                                { ( get(data, 'config.tuner.settings.mode', 'dynamic') === 'time')
                                    && <div className="items">
                                        <label className="form-label">Hour to use maximum power</label>
                                        <Text id="tuner_maxhour"
                                              field="config.tuner.settings.maxHour"
                                              type="number"
                                              min="0"
                                              max="24"
                                              initialValue={ get(data, 'config.tuner.settings.maxHour') }/>
                                    </div> }
                                { ( get(data, 'config.tuner.settings.mode', 'dynamic') === 'dynamic')
                                    && <div className="items">
                                        <label className="form-label">Interval Period in seconds</label>
                                        <Text id="tuner_tick"
                                              field="config.tuner.settings.tick"
                                              type="number"
                                              min="0"
                                              initialValue={ get(data, 'config.tuner.settings.tick') }/>
                                    </div> }
                            </div>

                            <h1 className="form-title">Tuner</h1>
                            <div className="tuner-box">
                                <div className="action-bar">
                                    <div className="form-row">
                                        <div className="items">
                                            <label className="form-label">Select GPU:</label>
                                            <GpuSelector key="local.name.gpu"
                                                         field="local.name.gpu"
                                                         hasGlobal={ true }
                                                         initialValue={ get(data, 'local.name.gpu') }/>
                                        </div>
                                        <div className="items">
                                            <label className="form-label">Coin Overrides:</label>
                                            <CoinSelector key="local.name.coin"
                                                          field="local.name.coin"
                                                          hasGlobal={ true }
                                                          initialValue={ get(data, 'local.name.coin') }/>
                                        </div>
                                    </div>
                                </div>
                                { !isEmpty(fansName) && <FanSettings name={ fansName } data={ data } formApi={ this.formApi } curve={ get(data, fansName + '.curve_enable', false) } checkbox={ true } /> }
                                { !isEmpty(tuneName) && <GpuTuner    name={ tuneName } data={ data } formApi={ this.formApi } label={ get(data, fansName + '.curve_enable', false) } /> }
                            </div>
                        </div>
                    }

                    { this.isSaving
                        ? <button type="submit" className="form-button" disabled>
                            Saving in progress...
                        </button>
                        : <button type="submit" className="form-button" onClick={ this.handleSave }>
                            Save
                        </button>
                    }

                    { ( get(data, 'local.name.gpu', 'global') !== 'global' || get(data, 'local.name.coin', 'global') !== 'global' )
                        && <button type="submit" className="form-button" onClick={ this.removeOverride }>
                            Remove
                        </button> }
                </Form>
            </div>
        )
    }
}
