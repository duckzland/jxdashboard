import React        from 'react';
import GpuTuner     from '../components/GpuTuner';
import FanSettings  from '../components/FanSettings';
import Frame        from '../components/Frame';
import FormGroup    from '../components/FormGroup';
import Config       from '../modules/Config';
import ConfigPanel  from '../base/ConfigPanel';
import { Form, Option } from 'informed';

import { get, merge, unset, isEmpty, forEach, uniqBy } from 'lodash';



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

    handleChange() {
        this.state.data = merge(this.state.data, this.formApi.getState().values);
        this.generateName();
        this.setState(this.state);
    };

    handleSave() {
        const config = new Config();
        config.blacklist.push('config.notification');
        config.blacklist.push('config.coins');
        config.blacklist.push('config.machine');
        config.blacklist.push('config.slack');
        config.blacklist.push('config.watchdog');
        config.blacklist.push('config.systemd');
        config.blacklist.push('pools');
        config.save(this.savingStart, this.savingComplete);
    };

    removeOverride = () => {
        const { fansName, tuneName } = this.state;

        unset(this, 'state.data.' + fansName);
        unset(this, 'state.data.' + tuneName.replace('%s', 'core'));
        unset(this, 'state.data.' + tuneName.replace('%s', 'memory'));
        unset(this, 'state.data.' + tuneName.replace('%s', 'power'));

        this.state.data.local.name.gpu      = 'global';
        this.state.data.local.name.coin     = 'global';
        this.state.data.local.name.override = 'global';

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

    generateOverrideSelector = () => {
        const tuner = get(this.state, 'data.config.tuner', {});
        const fans  = get(this.state, 'data.config.fans', {});
        let overrides = [];
        forEach(tuner, (data, k) => {
            if (k.indexOf('|') !== -1) {
                overrides.push({
                    value: k.replace('core|', '').replace('memory|', '').replace('power|', ''),
                    text: k.replace('core', 'gpu').replace('memory', 'gpu').replace('power', 'gpu').replace(/\|/g, ' - ')
                });
            }
        });

        forEach(fans, (data, k) => {
            if (k.indexOf('gpu|') !== -1) {
                overrides.push({
                    value: k.replace('gpu|', ''),
                    text: k.replace(/\|/g, ' - ')
                });
            }
        });

        return uniqBy(overrides, 'value');
    };

    handleOverrideChange = (e) => {

        const overrides = this.generateOverrideSelector();

        if (e.target.value === 'global') {
            this.state.data.local.name.gpu       = 'global';
            this.state.data.local.name.coin      = 'global';
            this.state.data.local.name.overrides = 'global';
        }
        else {
            switch (e.target.name) {
                case 'local.name.coin':
                    let x = e.target.value;
                    if (!isEmpty(this.state.data.local.name.gpu) && this.state.data.local.name.gpu !== 'global') {
                        x = this.state.data.local.name.gpu + '|' + x;
                    }
                    forEach(overrides, (override) => {
                        if (override.value === x) {
                            this.state.data.local.name.overrides = x;
                            return false;
                        }
                    });
                    break;
                case 'local.name.gpu':
                    let y = e.target.value;
                    if (!isEmpty(this.state.data.local.name.coin) && this.state.data.local.name.coin !== 'global') {
                        y = y + '|' + this.state.data.local.name.coin;
                    }
                    forEach(overrides, (override) => {
                        if (override.value === y) {
                            this.state.data.local.name.overrides = y;
                            return false;
                        }
                    });

                    break;
                case 'local.name.overrides':
                    let n = e.target.value.split('|');

                    if (n[0]) {
                        if (!isNaN(parseFloat(n[0])) && isFinite(n[0])) {
                            this.state.data.local.name.gpu = n[0];
                            this.state.data.local.name.coin = 'global';
                        }
                        else {
                            this.state.data.local.name.gpu = 'global';
                            this.state.data.local.name.coin = n[0]
                        }
                    }

                    if (n[1]) {
                        this.state.data.local.name.coin = n[1];
                    }

                    break;
            }
        }

        this.formApi.setValues(this.state.data);

    };
	
	render() {

        const { data, fansName, tuneName } = this.state;
        const overrides = this.generateOverrideSelector();
        const isActive  = get(data, 'config.tuner.settings.enable', false);
        const btn       = (this.isSaving
                ? <button type="submit" className="form-button" disabled>Saving in progress...</button>
                : <button type="submit" className="form-button" onClick={ this.handleSave }>Save</button>
        );

        return (
            <Form id="tuner-configuration" className="form-instance" getApi={ this.setFormApi } onChange={ this.handleChange } initialValues={ data }>
                <Frame frameType="frame-c" title="Global Settings">
                    <FormGroup title="Enable GPU Tuner"
                               elementType="checkbox"
                               id="enable_tuner"
                               field="config.tuner.settings.enable"
                               initialValue={ get(data, 'config.tuner.settings.enable') }/>

                    { isActive
                        &&  <div className="gpu-tuners-block">
                        <div className="form-row">
                            <FormGroup title="Tuner Mode"
                                       elementClass="items"
                                       elementType="select"
                                       id="tuner_mode"
                                       field="config.tuner.settings.mode"
                                       initialValue={ get(data, 'config.tuner.settings.mode') }>
                                <Option value="dynamic">Dynamic</Option>
                                <Option value="static">Static</Option>
                                <Option value="time">Time based</Option>
                            </FormGroup>

                            { ( get(data, 'config.tuner.settings.mode', 'dynamic') === 'time')
                            && <FormGroup title="Hour to use minimum power"
                                          elementClass="items"
                                          elementType="text"
                                          id="tuner_minhour"
                                          field="config.tuner.settings.minHour"
                                          type="number"
                                          min="0"
                                          max="24"
                                          initialValue={ get(data, 'config.tuner.settings.minHour') }/>
                            }
                            { ( get(data, 'config.tuner.settings.mode', 'dynamic') === 'time')
                            && <FormGroup title="Hour to use maximum power"
                                          elementClass="items"
                                          elementType="text"
                                          id="tuner_maxhour"
                                          field="config.tuner.settings.maxHour"
                                          type="number"
                                          min="0"
                                          max="24"
                                          initialValue={ get(data, 'config.tuner.settings.maxHour') }/>
                            }
                            { ( get(data, 'config.tuner.settings.mode', 'dynamic') === 'dynamic')
                            && <FormGroup title="Interval Period in seconds"
                                          elementClass="items"
                                          elementType="text"
                                          id="tuner_tick"
                                          field="config.tuner.settings.tick"
                                          type="number"
                                          min="0"
                                          initialValue={ get(data, 'config.tuner.settings.tick') }/>
                            }
                        </div>
                    </div> }
                    { btn }
                </Frame>

                { isActive
                    && <Frame frameType="frame-c" title="GPU Tuner">
                        <div className="tuner-box">
                            <div className="action-bar">
                                <div className="form-row">
                                    <FormGroup title="Select GPU:"
                                               elementClass="items"
                                               elementType="gpuselector"
                                               key="local.name.gpu"
                                               field="local.name.gpu"
                                               hasGlobal={ true }
                                               onChange={ this.handleOverrideChange }
                                               initialValue={ get(data, 'local.name.gpu') }/>

                                    <FormGroup title="Coin Overrides:"
                                               elementClass="items"
                                               elementType="coinselector"
                                               key="local.name.coin"
                                               field="local.name.coin"
                                               hasGlobal={ true }
                                               onChange={ this.handleOverrideChange }
                                               initialValue={ get(data, 'local.name.coin') }/>

                                    { !isEmpty(overrides)
                                        && <FormGroup title="Stored Overrides"
                                                      elementClass="items"
                                                      elementType="select"
                                                      id="tuner_overides"
                                                      field="local.name.overrides"
                                                      onChange={ this.handleOverrideChange }
                                                      initialValue={ get(data, 'local.name.overrides') }>
                                            <Option value="global">Select Override</Option>
                                            { overrides.map((override, key) => {
                                                return (<Option key={ 'gpu-override-' + key } value={ override.value }>{ override.text }</Option>);
                                            }) }
                                        </FormGroup>
                                    }
                                </div>
                            </div>
                            { !isEmpty(fansName) && <FanSettings name={ fansName } data={ data } formApi={ this.formApi } curve={ get(data, fansName + '.curve_enable', false) } checkbox={ true } /> }
                            { !isEmpty(tuneName) && <GpuTuner    name={ tuneName } data={ data } formApi={ this.formApi } label={ get(data, fansName + '.curve_enable', false) } /> }
                        </div>
                        { btn }
                        { ( get(data, 'local.name.gpu', 'global') !== 'global' || get(data, 'local.name.coin', 'global') !== 'global' )
                        && <button type="submit" className="form-button" onClick={ this.removeOverride }>
                            Remove
                        </button> }
                    </Frame> }
            </Form>
        )
    }
}
