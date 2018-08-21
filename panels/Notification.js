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
        config.reload();
    };

	render() {
        const { data } = this.state;
        return (
            <div className="inner-content">
                <Form id="notification-configuration" className="form-instance" getApi={ this.setFormApi } onChange={ this.handleChange } initialValues={ data }>
                    { /* Slack Settings */ }
                    <h1 className="form-title">Slack Settings</h1>
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

                    { this.isSaving
                        ? <button type="submit" className="form-button" disabled>
                            Saving in progress...
                        </button>
                        : <button type="submit" className="form-button" onClick={ this.handleSave }>
                            Save
                        </button>
                    }
                </Form>
            </div>
        )
    }
}
