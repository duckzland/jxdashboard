import React        from 'react';
import Config       from '../modules/Config';
import ConfigPanel  from '../base/ConfigPanel';
import { get, merge, unset, isEmpty } from 'lodash';
import { Form, Text, Checkbox, Select, Option } from 'informed';

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

        const { data } = this.state;

        return (
            <div className="inner-content">
                <Form id="watchdog-configuration" className="form-instance" getApi={ this.setFormApi } onChange={ this.handleChange } initialValues={ data }>

                    { /* GPU Checker */ }
                    <h1 className="form-title">GPU Checker</h1>
                    <div className="form-group">
                        <div className="pretty p-default">
                            <Checkbox id="enable_gpu_check"
                                      field="config.machine.gpu_check_total.enable"
                                      initialValue={ get(data, 'config.machine.gpu_check_total.enable') }/>
                            <div className="state p-success-o">
                                <label className="form-checkbox">
                                    Enable GPU checker
                                </label>
                            </div>
                        </div>
                        <div className="form-description">
                            Caution : do not enable this when debugging or repairing GPU as it will cause infinite rebooting due to mismatch GPU count
                        </div>
                    </div>
                    { get(data, 'config.machine.gpu_check_total.enable', false)
                        && <div className="form-blocks">
                            <div className="form-group">
                                <div className="pretty p-default">
                                    <Checkbox id="gpu_check_reboot_failed"
                                              field="config.machine.gpu_check_total.reboot_when_failed"
                                              initialValue={ get(data, 'config.machine.gpu_check_total.reboot_when_failed') }/>
                                    <div className="state p-success-o">
                                        <label className="form-checkbox">
                                            Reboot machine when check failed
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">AMD GPU in the system</label>
                                <Text id="gpu_check_amd"
                                      field="config.machine.gpu_check_total.amd"
                                      type="number"
                                      min="0"
                                      initialValue={ get(data, 'config.machine.gpu_check_total.amd') }/>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Nvidia GPU in the system</label>
                                <Text id="gpu_check_nvidia"
                                      field="config.machine.gpu_check_total.nvidia"
                                      type="number"
                                      min="0"
                                      initialValue={ get(data, 'config.machine.gpu_check_total.nvidia') }/>
                            </div>
                        </div>
                    }

                    { /* Systemd */ }
                    <h1 className="form-title">SystemD Watcher</h1>
                    <div className="form-group">
                        <div className="pretty p-default">
                            <Checkbox id="watchdog_systemd"
                                      field="config.systemd.settings.enable"
                                      initialValue={ get(data, 'config.systemd.settings.enable') }/>
                            <div className="state p-success-o">
                                <label className="form-checkbox">
                                    Enable Systemd Watcher
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="pretty p-default">
                            <Checkbox id="hard_reboot"
                                      field="config.machine.settings.hard_reboot"
                                      initialValue={ get(data, 'config.machine.settings.hard_reboot') }/>
                            <div className="state p-success-o">
                                <label className="form-checkbox">
                                    Use hard reboot by calling Linux magic command
                                </label>
                            </div>
                        </div>
                    </div>

                    { /* Watchdog */ }
                    <h1 className="form-title">Miner Watchdog</h1>
                    <div className="form-group">
                        <div className="pretty p-default">
                            <Checkbox id="watchdog_enable"
                                      field="config.watchdog.settings.enable"
                                      initialValue={ get(data, 'config.watchdog.settings.enable') }/>
                            <div className="state p-success-o">
                                <label className="form-checkbox">
                                    Enable Watchdog
                                </label>
                            </div>
                        </div>
                    </div>

                    { get(data, 'config.watchdog.settings.enable', false)
                        && <div className="form-blocks">
                            <div className="form-group">
                                <label className="form-label">Checking interval in seconds</label>
                                <Text id="watchdog_interval"
                                      field="config.watchdog.settings.tick"
                                      type="number"
                                      min="0"
                                      initialValue={ get(data, 'config.watchdog.settings.tick') }/>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Maximum soft restarting retries</label>
                                <Text id="watchdog_retry"
                                      field="config.watchdog.settings.maximum_retry"
                                      type="number"
                                      min="0"
                                      initialValue={ get(data, 'config.watchdog.settings.maximum_retry') }/>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Delay in seconds before rebooting</label>
                                <Text id="reboot_delay"
                                      field="config.watchdog.settings.reboot_delay"
                                      type="number"
                                      min="0"
                                      initialValue={ get(data, 'config.watchdog.settings.reboot_delay') }/>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Maximum retry for soft reboot before going to full reboot</label>
                                <Text id="maximum_retry"
                                      field="config.watchdog.settings.maximum_retry"
                                      type="number"
                                      min="0"
                                      initialValue={ get(data, 'config.watchdog.settings.maximum_retry') }/>
                            </div>

                            { get(data, 'config.machine.gpu_miner.enable', false)
                                && <div className="form-group">
                                    <label className="form-label">GPU Miner Minimum Hash rate</label>
                                    <Text id="gpu_hashrate"
                                          field="config.machine.gpu_miner.minimum_hashrate"
                                          initialValue={ get(data, 'config.machine.gpu_miner.minimum_hashrate') }/>
                                    <div className="form-description">
                                        Warning : different miner will report different value denomination of hash rate.
                                        Leave this field empty to disable this feature.
                                    </div>
                                </div>
                            }

                            { get(data, 'config.machine.cpu_miner.enable', false)
                                && <div className="form-group">
                                    <label className="form-label">CPU Miner Minimum Hash rate</label>
                                    <Text id="cpu_hashrate"
                                          field="config.machine.cpu_miner.minimum_hashrate"
                                          initialValue={ get(data, 'config.machine.cpu_miner.minimum_hashrate') }/>
                                    <div className="form-description">
                                        Warning : different miner will report different value denomination of hash rate.
                                        Leave this field empty to disable this feature.
                                    </div>
                                </div>
                            }
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
