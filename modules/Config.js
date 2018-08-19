import Network from './Network';
import { merge, get, isArray, isObject, forEach, omit } from 'lodash';

/**
 * Class for managing apps wide configuration
 *
 * @author jason.xie@victheme.com
 */
export default class Config {

    static storage  = {};

    port      = window.jxdashboard.port;
    host      = window.jxdashboard.host;

    blacklist = ['miners', 'dynamic', 'local', 'config.miner', 'config.sensors', ''];

    constructor(config = {}) {
        this.insert(config);
    };

    load() {
        const network = new Network(this.host, this.port, 'config:load:json',

            (network, buffers) => {
                let payload = false;
                try {
                    payload = JSON.parse(buffers.slice(-1).pop());
                }
                catch(err) { }

                if (payload) {
                    this.insert(payload);
                }
            },

            () => {
                setTimeout(function() {
                    network.send();
                }, 1000);
            });

        network.send();
    }


    save() {
        const payload = {};
        const network = new Network(this.host, this.port, 'config:save:json', function() {}, function() {});
        merge(payload, omit(Config.storage, this.blacklist));
        network.send(JSON.stringify(payload));
    }

    reload() {
        const network = new Network(this.host, this.port, 'server:reboot', function() {}, function() {});
        network.send()
    }


    insert(config) {
        merge(Config.storage, omit(config, ['miners']));
    }

}