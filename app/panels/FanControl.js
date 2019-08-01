import React        from 'react';
import FanSettings  from '../components/FanSettings';
import FanSelector  from '../components/FanSelector';
import ConfigPanel  from '../base/ConfigPanel';
import Config       from '../modules/Config';

import { get, merge, unset, isEmpty, forEach, omit } from 'lodash';
import { Form, Text, Checkbox, Select, Option } from 'informed';

export default class PanelFanControl extends ConfigPanel {

    state = {
        data: Config.storage,
        fansName: 'config.fans.casing'
    };

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
        config.blacklist.push('config.tuner');
        config.blacklist.push('config.watchdog');
        config.blacklist.push('config.systemd');
        config.blacklist.push('pools');
        config.save(this.savingStart, this.savingComplete);
    };

    removeOverride = () => {
        const { fansName } = this.state;

        unset(this, 'state.data.' + fansName);
        this.state.data.local.name.pwm  = 'global';

        this.formApi.setValues(this.state.data);
    };

    generateName = () => {
        const pwm  = get(this, 'state.data.local.name.pwm', 'global');
        let fan  = 'config.fans.casing';
        if (pwm !== 'global') {
            fan  += '|' + pwm;
        }
        this.state.fansName = fan;
    };

    render() {

        const { data, fansName } = this.state;
        const isActive  = get(data, 'config.fans.casing.enable', false);
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
            <Form id="fans-configuration" className="form-instance" getApi={ this.setFormApi } onChange={ this.handleChange } initialValues={ data }>
                <div className="inner-content">
                    { svg }
                    <h1 className="title form-title">Global Settings</h1>
                    <div className="form-group">
                        <div className="pretty p-default">
                            <Checkbox id="enable_tuner"
                                      field="config.fans.casing.enable"
                                      initialValue={ get(data, 'config.fans.casing.enable') }/>
                            <div className="state p-success-o">
                                <label className="form-checkbox">
                                    Enable Fan Casing
                                </label>
                            </div>
                        </div>
                    </div>
                    { isActive
                        && <div className="fan-tuners-block">
                            <div className="form-row">
                                <div className="items">
                                    <label className="form-label">Strategy</label>
                                    <Select id="tuner_mode"
                                            field="config.fans.casing.strategy"
                                            initialValue={ get(data, 'config.fans.casing.strategy') }>
                                        <Option value="highest">Highest</Option>
                                        <Option value="average">Average</Option>
                                    </Select>
                                </div>
                                <div className="items">
                                    <label className="form-label">Interval Period in seconds</label>
                                    <Text id="tuner_tick"
                                          field="config.fans.casing.tick"
                                          type="number"
                                          initialValue={ get(data, 'config.fans.casing.tick') }/>
                                </div>
                            </div>
                        </div> }
                    { btn }
                </div>
                { isActive
                    && <div className="inner-content">
                        { svg }
                        <h1 className="title form-title">Tuner</h1>
                        <div className="tuner-box">
                            <div className="action-bar">
                                <div className="form-row">
                                    <div className="items">
                                        <label className="form-label">Select Fans:</label>
                                        <FanSelector key="local.name.pwm"
                                                     field="local.name.pwm"
                                                     hasGlobal={ true }
                                                     initialValue={ get(data, 'local.name.pwm') }/>
                                    </div>
                                </div>
                            </div>
                            { !isEmpty(fansName) && <FanSettings name={ fansName } data={ data } formApi={ this.formApi } curve={ get(data, fansName + '.curve_enable', false) } checkbox={ false } /> }
                        </div>
                        { btn }
                        { ( get(data, 'local.name.pwm', 'global') !== 'global' )
                        && <button type="submit" className="form-button" onClick={ this.removeOverride }>
                            Remove
                        </button> }
                    </div>
                }

            </Form>
        )
    }
}
