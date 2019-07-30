import React             from 'react';
import Config            from './modules/Config';
import Network           from './modules/Network';
import PageCoins         from './pages/Coins';
import PageConfiguration from './pages/Configuration';
import PageDashboard     from './pages/Dashboard';
import PagePools         from './pages/Pools';

var monitorTimer = null;

export default class Layout extends React.Component {
    state = {
        activePage: 'dashboard',
        serverState: 'not-connected'
    };

    locked = true;
    config = false;
    port   = window.jxdashboard.port;
    host   = window.jxdashboard.host;

    constructor(props) {
        super(props);
        this.config = new Config();
        this.loadConfig();
        this.serverMonitor();
    }

    loadConfig = () => {
        this.config.load( this.serverLoading, this.serverCompleted, this.serverError );
    };

    resetConfig = () => {
        this.config.reset();
    };

    serverMonitor = () => {
        const network = new Network(
            this.host,
            this.port,
            'server:status:live',
            () => {
                this.serverCompleted();
            },
            () => {
                this.serverError();
                clearTimeout(monitorTimer);
                monitorTimer = setTimeout(this.serverMonitor, 2500);
            },
            () => {
                this.serverError();
                clearTimeout(monitorTimer);
                monitorTimer = setTimeout(this.serverMonitor, 2500);
            });

        network.send();
    };

    serverLoading = () => {
        this.setState({
            serverState: 'loading'
        });
    };

    serverCompleted = () => {
        if ((new Config()).isReady()) {
            this.setState({
                serverState: 'connected'
            });
        }
    };

    serverError = () => {
        this.setState({
            serverState: 'error'
        });
    };

    changePage = (page) => {
        page !== this.state.activePage && this.setState({ activePage: page, serverState: this.state.serverState });
    };

    render() {

        const { activePage, serverState } = this.state;
        const { changePage } = this;

        return (
            serverState !== 'connected'
                ? <div key="main-layout" id="not-connected">
                    { serverState === 'loading' && 'Awaiting connection to server...' }
                    { serverState === 'error'   && 'Cannot connect to server'         }
                </div>
                : <div key="main-layout" id="main-layout">
                    <div id="main-menu" className={ 'menu-active-' + activePage }>
                        <svg className="svg-frame"
                             ref={ref => (this.svgElement = ref)}
                             viewBox='0 0 100 40'
                             xmlns='http://www.w3.org/2000/svg'
                             preserveAspectRatio="none">
                            <path className="orange-line" d='M0,10 L0,0 L10,0'/>
                            <path className="orange-line" d='M90,0 L100,0 L100,10'/>
                            <path className="orange-line" d='M10,40 L0,40 L0,30'/>
                            <path className="orange-line" d='M100,30 L100,40 L90,40'/>
                        </svg>
                        <div className="items dashboard" onClick={ () => changePage('dashboard') }>
                            Dashboard
                        </div>
                        <div className="items configuration" onClick={ () => changePage('configuration') }>
                            Configuration
                        </div>
                        <div className="items coins" onClick={ () => changePage('coins') }>
                            Wallets
                        </div>
                        <div className="items pools" onClick={ () => changePage('pools') }>
                            Mining Pools
                        </div>
                    </div>
                    <div id="main-content">
                        { (activePage === 'dashboard')     && <PageDashboard     /> }
                        { (activePage === 'configuration') && <PageConfiguration /> }
                        { (activePage === 'pools')         && <PagePools         /> }
                        { (activePage === 'coins')         && <PageCoins         /> }
                    </div>
                </div>
        )

    }
}