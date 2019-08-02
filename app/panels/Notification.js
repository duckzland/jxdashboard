import React        from 'react';
import ConfigPanel  from '../base/ConfigPanel';
import Config       from '../modules/Config';
import Frame        from '../components/Frame';
import FormGroup    from '../components/FormGroup';
import { Form }     from 'informed';
import { get  }     from 'lodash';

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

        return (
            <Form id="notification-configuration" className="form-instance" getApi={ this.setFormApi } onChange={ this.handleChange } initialValues={ data }>
                { /* Slack Settings */ }
                <Frame frameType="frame-c" title="Slack Settings">
                    <FormGroup title="Enable Slack Integration"
                               elementType="checkbox"
                               id="enable_slack"
                               field="config.slack.settings.enable"
                               initialValue={ get(data, 'config.slack.settings.enable') }/>

                    { get(data, 'config.slack.settings.enable', false)
                        && <div className="form-blocks">
                            <FormGroup title="Channel"
                                       elementType="text"
                                       id="slack_channel"
                                       field="config.slack.settings.channel"
                                       initialValue={ get(data, 'config.slack.settings.channel') }/>

                            <FormGroup title="Username"
                                       elementType="text"
                                       id="slack_username"
                                       field="config.slack.settings.user"
                                       initialValue={ get(data, 'config.slack.settings.user') }/>
                            <FormGroup title="Token"
                                       elementType="text"
                                       id="slack_token"
                                       field="config.slack.settings.token"
                                       initialValue={ get(data, 'config.slack.settings.token') }/>
                        </div>
                    }
                    { btn }
                </Frame>
            </Form>
        )
    }
}
