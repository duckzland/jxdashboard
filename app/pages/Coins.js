import React        from 'react';
import ScrollArea   from 'react-scrollbar';
import CoinRow      from '../components/CoinRow';
import ConfigPanel  from '../base/ConfigPanel';
import Config       from '../modules/Config';
import { Form }     from 'informed';

import { forEach, get, merge, isEmpty, omit, isEqual, unset } from 'lodash';

var coinsTimer = null;

export default class PageCoins extends ConfigPanel {
    state = {
        data: {}
    };

    constructor(props) {
        super(props);

        this.parseProps({ data: omit(Config.storage, 'local') });
        this.convertProps();

        // Set the initial row
        isEmpty(this.state.data.local) && this.state.data.local.push(
            { ticker: '', algo: '', name: '', wallet: '' }
        )
    }

    parseProps = (props) => {
        if ('data' in props) {
            this.state.data = props.data;
        }
    };

    convertProps = () => {
        const coins = get(this.state.data, 'config.coins', {});
        this.state.data.local = [];
        forEach(coins, (coin, ticker) => {
            const algo = get(coin, 'algo', '');
            this.state.data.local.push({
                ticker  : ticker,
                algo    : algo,
                name    : get(coin, 'name', ''),
                wallet  : get(coin, 'wallet', '')
            })
        });
    };

    convertLocal = () => {
        const coins = this.state.data.local;
        if (coins && this.state.data.config) {
            this.state.data.config.coins = {};
            forEach(coins, (coin) => {
                if (coin && coin.ticker) {
                    this.state.data.config.coins[coin.ticker] = {
                        name: coin.name,
                        algo: coin.algo,
                        wallet: coin.wallet
                    };
                }
            });
        }
    };

    handleChange = () => {
        // @bugfix must create "promise" to prevent broken coin list created due to formapi hasn't got enough
        // time to populate its form value.
        clearTimeout(coinsTimer);
        coinsTimer = setTimeout(() => {
            if (!isEqual(this.formApi.getState().values.local, this.state.data.local)) {
                this.state.data.local = this.formApi.getState().values.local;
                this.convertLocal();
                this.setState(this.state);
            }
        }, 300);
    };

    handleSave = () => {
        const config = new Config();
        config.blacklist.push('config.notification');
        config.blacklist.push('config.fans');
        config.blacklist.push('config.machine');
        config.blacklist.push('config.slack');
        config.blacklist.push('config.tuner');
        config.blacklist.push('config.watchdog');
        config.blacklist.push('config.systemd');
        config.blacklist.push('pools');
        config.save(this.savingStart, this.savingComplete);
    };

    add = () => {
        this.state.data.local.push({ ticker: '', algo: '', name: '', wallet: '' });
        this.convertLocal();
        this.formApi.setValues(this.state.data);
        this.setState(this.state);
    };

    remove = (index) => {
        this.state.data.local.splice(index, 1);
        this.convertLocal();
        this.formApi.setValues(this.state.data);
        this.state.data.local.length === 0
            ? this.add()
            : this.setState(this.state);
    };

    isActive = (coin) => {
        let active = false;
        if (Config.storage.config) {
			if (Config.storage.config.machine.cpu_miner.coin === coin) {
				active = true;
			}
			if (!active && Config.storage.config.machine.gpu_miner.coin === coin) {
				active = true;
			}
			if (!active && Config.storage.config.machine.gpu_miner.second_coin === coin) {
				active = true;
			}
		}
        return active;
    };

    render() {
        const { isActive } =  this;
        const { data }     = this.state;
        const svg          = (
            <svg className="svg-frame svg-top"
                 ref={ref => (this.svgElement = ref)}
                 viewBox="0 0 69.393 35.638"
                 xmlns="http://www.w3.org/2000/svg"
                 vector-effect="non-scaling-stroke"
                 preserveAspectRatio="none">
                <path className="orange-line" d="M69.189 5.079V2.433l-.794-1.323h-3.44l-.764-.977-5.778.033-.601.944H1.455L.132 2.433v2.646"/>
                <path className="orange-line" d="M63.351 1.292l-.395.695-3.585-.006"/>
            </svg>
        );
        const svg2         = (
            <svg className="svg-frame svg-bottom"
                 ref={ref => (this.svgElement = ref)}
                 viewBox="0 0 69.393 5.424"
                 xmlns="http://www.w3.org/2000/svg"
                 vector-effect="non-scaling-stroke"
                 preserveAspectRatio="none">
                <path className="orange-line" d="M69.256.74l.004 2.13-1.321 1.439-9.94-.032-.981 1.015h-6.616l-1.323-1.323H1.455L.132 2.646V0"/>
                <path className="orange-line" d="M51.75 3.585l.319-.565 3.585.006"/>
            </svg>
        );

        const contentProps = {
            key: 'content-element',
            speed: 0.8,
            className: 'main-panels panel',
            contentClassName: 'content configuration',
            horizontal: false,
            vertical: true
        };

        const Rows = this.state.data.local.map((entry, key) => {
            const rowProps = {
                key       : 'coin-row-' + key,
                index     : key,
                removable : !isActive(entry.ticker),
                onRemove  : () => this.remove(key)
            };
            return (<CoinRow { ...rowProps }/>)
        });

        return (
            <div className="panels">
                <ScrollArea { ...contentProps }>
                        <Form id="coin-configuration" className="form-instance wallet-form" getApi={ this.setFormApi } onChange={ this.handleChange } initialValues={ data }>
                            <div className="inner-content">
                                { svg  }
                                { svg2 }
                                <h1 className="form-title">Registered Coins</h1>
                                { Rows }
                                { this.isSaving
                                    ? <button type="submit" className="form-button" disabled>
                                        Saving in progress...
                                    </button>
                                    : <button type="submit" className="form-button" onClick={ this.handleSave }>
                                        Save
                                    </button>
                                }
                                <button type="submit" className="form-button" onClick={ this.add }>
                                    Add New
                                </button>
                            </div>
                        </Form>
                </ScrollArea>
            </div>
        )
    }
}
