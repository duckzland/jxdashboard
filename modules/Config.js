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

    load(onLoad = false, onComplete = false, onError = false) {
        const network = new Network(this.host, this.port, 'config:load:json',

            (network, buffers) => {
                let payload = false;
                try {
                    payload = JSON.parse(buffers.slice(-1).pop());
                }
                catch(err) {
                    onError && onError();
                    onComplete && onComplete();
                }

                if (payload) {
                    this.insert(payload);
                    onComplete && onComplete();
                }
            },

            () => {
                setTimeout(function() {
                    onLoad && onLoad();
                    network.send();
                }, 1000);
            });

        onLoad && onLoad();
        network.send();
    }


    save(onLoad = false, onComplete = false) {
        const payload = {};
        const network = new Network(this.host, this.port, 'config:save:json', onComplete, onComplete);
        merge(payload, omit(Config.storage, this.blacklist));
        onLoad && onLoad();
        console.log(JSON.stringify(payload));
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