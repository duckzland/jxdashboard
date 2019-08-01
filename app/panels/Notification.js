import React        from 'react';
import ConfigPanel  from '../base/ConfigPanel';
import Config       from '../modules/Config';
import { get, merge, unset, isEmpty } from 'lodash';
import { Form, Text, Checkbox, Select, Option } from 'informed';

export default class PanelNotification extends ConfigPanel {

    state = {
        data: Config.storage
    };

    handleSave = () => {
        const config = new Config();
        config.blacklist.push('config.notification');
        config.blacklist.push('config.coins');
        config.blacklist.push('config.tuner');
        config.blacklist.push('config.machine');
        config.blacklist.push('config.watchdog');
        config.blacklist.push('config.systemd');
        config.blacklist.push('pools');
        config.save(this.savingStart, this.savingComplete);
    };

	render() {
        const { data }  = this.state;
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
            <Form id="notification-configuration" className="form-instance" getApi={ this.setFormApi } onChange={ this.handleChange } initialValues={ data }>
                { /* Slack Settings */ }
                <div className="inner-content">
                    { svg }
                    <h1 className="title form-title">Slack Settings</h1>
                    <div className="form-group">
                        <div className="pretty p-default">
                            <Checkbox id="enable_slack"
                                      field="config.slack.settings.enable"
                                      initialValue={ get(data, 'config.slack.settings.enable') }/>
                            <div className="state p-success-o">
                                <label className="form-checkbox">
                                    Enable Slack Integration
                                </label>
                            </div>
                        </div>
                    </div>
                    { get(data, 'config.slack.settings.enable', false)
                        && <div className="form-blocks">
                            <div className="form-group">
                                <label className="form-label">Channel</label>
                                <Text id="slack_channel"
                                      field="config.slack.settings.channel"
                                      initialValue={ get(data, 'config.slack.settings.channel') }/>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Username</label>
                                <Text id="slack_username"
                                      field="config.slack.settings.user"
                                      initialValue={ get(data, 'config.slack.settings.user') }/>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Token</label>
                                <Text id="slack_token"
                                      field="config.slack.settings.token"
                                      initialValue={ get(data, 'config.slack.settings.token') }/>
                            </div>
                        </div>
                    }
                    { btn }
                </div>
            </Form>
        )
    }
}
