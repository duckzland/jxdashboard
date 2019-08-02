import React        from 'react';
import Config       from '../modules/Config';
import ConfigPanel  from '../base/ConfigPanel';
import Frame        from '../components/Frame';
import FormGroup    from '../components/FormGroup';
import { Form }     from 'informed';
import { get  }     from 'lodash';

export default class PanelWatchdog extends ConfigPanel {

    state = {
        data: Config.storage
    };

    handleSave = () => {
        const config = new Config();
        config.blacklist.push('config.notification');
        config.blacklist.push('config.coins');
        config.blacklist.push('config.tuner');
        config.blacklist.push('config.slack');
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
            <Form id="watchdog-configuration" className="form-instance" getApi={ this.setFormApi } onChange={ this.handleChange } initialValues={ data }>

                { /* GPU Checker */ }
                <Frame frameType="frame-c" title="GPU Checker">
                    <FormGroup title="Enable GPU checker"
                               description="Caution : do not enable this when debugging or repairing GPU as it will cause infinite rebooting due to mismatch GPU count"
                               elementType="checkbox"
                               id="enable_gpu_check"
                               field="config.machine.gpu_check_total.enable"
                               initialValue={ get(data, 'config.machine.gpu_check_total.enable') }/>

                    { get(data, 'config.machine.gpu_check_total.enable', false)
                        && <div className="form-blocks">
                            <FormGroup title="Reboot machine when check failed"
                                       elementType="checkbox"
                                       id="gpu_check_reboot_failed"
                                       field="config.machine.gpu_check_total.reboot_when_failed"
                                       initialValue={ get(data, 'config.machine.gpu_check_total.reboot_when_failed') }/>

                            <FormGroup title="AMD GPU in the system"
                                       elementType="text"
                                       id="gpu_check_amd"
                                       field="config.machine.gpu_check_total.amd"
                                       type="number"
                                       min="0"
                                       initialValue={ get(data, 'config.machine.gpu_check_total.amd') }/>

                            <FormGroup title="Nvidia GPU in the system"
                                       elementType="text"
                                       id="gpu_check_nvidia"
                                       field="config.machine.gpu_check_total.nvidia"
                                       type="number"
                                       min="0"
                                       initialValue={ get(data, 'config.machine.gpu_check_total.nvidia') }/>
                        </div>
                    }
                    { btn }
                </Frame>

                { /* Systemd */ }
                <Frame frameType="frame-c" title="SystemD Watcher">
                    <FormGroup title="Enable Systemd Watcher"
                               elementType="checkbox"
                               id="watchdog_systemd"
                               field="config.systemd.settings.enable"
                               initialValue={ get(data, 'config.systemd.settings.enable') }/>

                    <FormGroup title="Use hard reboot by calling Linux magic command"
                               elementType="checkbox"
                               id="hard_reboot"
                               field="config.machine.settings.hard_reboot"
                               initialValue={ get(data, 'config.machine.settings.hard_reboot') }/>

                    { btn }
                </Frame>

                { /* Watchdog */ }
                <Frame frameType="frame-c" title="Miner Watchdog">
                    <FormGroup title="Enable Watchdog"
                               elementType="checkbox"
                               id="watchdog_enable"
                               field="config.watchdog.settings.enable"
                               initialValue={ get(data, 'config.watchdog.settings.enable') }/>

                    { get(data, 'config.watchdog.settings.enable', false)
                        && <div className="form-blocks">
                            <FormGroup title="Checking interval in seconds"
                                       elementType="text"
                                       id="watchdog_interval"
                                       field="config.watchdog.settings.tick"
                                       type="number"
                                       min="0"
                                       initialValue={ get(data, 'config.watchdog.settings.tick') }/>

                            <FormGroup title="Maximum soft restarting retries"
                                       elementType="text"
                                       id="watchdog_retry"
                                       field="config.watchdog.settings.maximum_retry"
                                       type="number"
                                       min="0"
                                       initialValue={ get(data, 'config.watchdog.settings.maximum_retry') }/>

                            <FormGroup title="Delay in seconds before rebooting"
                                       elementType="text"
                                       id="reboot_delay"
                                       field="config.watchdog.settings.reboot_delay"
                                       type="number"
                                       min="0"
                                       initialValue={ get(data, 'config.watchdog.settings.reboot_delay') }/>

                            <FormGroup title="Maximum retry for soft reboot before going to full reboot"
                                       elementType="text"
                                       id="maximum_retry"
                                       field="config.watchdog.settings.maximum_retry"
                                       type="number"
                                       min="0"
                                       initialValue={ get(data, 'config.watchdog.settings.maximum_retry') }/>

                            { get(data, 'config.machine.gpu_miner.enable', false) &&
                            <FormGroup title="GPU Miner Minimum Hash rate"
                                       description="Warning : different miner will report different value denomination of hash rate. Leave this field empty to disable this feature."
                                       elementType="text"
                                       id="gpu_hashrate"
                                       field="config.machine.gpu_miner.minimum_hashrate"
                                       initialValue={ get(data, 'config.machine.gpu_miner.minimum_hashrate') }/>
                            }

                            { get(data, 'config.machine.cpu_miner.enable', false) &&
                            <FormGroup title="CPU Miner Minimum Hash rate"
                                       description="Warning : different miner will report different value denomination of hash rate. Leave this field empty to disable this feature."
                                       elementType="text"
                                       id="cpu_hashrate"
                                       field="config.machine.cpu_miner.minimum_hashrate"
                                       initialValue={ get(data, 'config.machine.cpu_miner.minimum_hashrate') }/>
                            }
                        </div>
                    }
                    { btn }
                </Frame>
            </Form>
        )
    }
}
