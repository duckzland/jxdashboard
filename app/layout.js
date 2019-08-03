import React             from 'react';
import Config            from './modules/Config';
import Network           from './modules/Network';
import PageCoins         from './pages/Coins';
import PageConfiguration from './pages/Configuration';
import PageDashboard     from './pages/Dashboard';
import PagePools         from './pages/Pools';
import Frame             from './components/Frame';
import Logo              from './components/Logo';

var monitorTimer = null;

export default class Layout extends React.Component {
    state = {
        activePage: 'dashboard',
        serverState: 'initializing'
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
        const svg = (
            <svg width="0" height="0" shapeRendering="geometricPrecision">
                <defs>
                    <linearGradient id="orange-one" x1="0%" y1="0" x2="100%" y2="100%">
                        <stop offset="0%" className="stop-one" stopColor="#ff7900"></stop>
                        <stop offset="60%" className="stop-two" stopColor="#ff7900"></stop>
                        <stop offset="80%" className="stop-three" stopColor="#ff4f00"></stop>
                        <stop offset="100%" className="stop-four" stopColor="#ffb079"></stop>
                    </linearGradient>
                </defs>
            </svg>
        );

        let message = 'Connecting to server...';
        switch (serverState) {

            case 'initializing':
                message = 'Starting up...';
                break;

            case 'connected':
                message = 'Connected to server';
                break;

            case 'loading' :
                message = 'Awaiting connection to server...';
                break;

            case 'error' :
                message = 'Cannot connect to server';
                break;

            default:
                message = 'Connecting to server...';
        }

        return (
            ( serverState !== 'connected')
                ? <div key="main-layout-disconnected" id="not-connected">
                    <Frame frameType="frame-d">
                        <Logo />
                        { message }
                    </Frame>
                    { svg }
                </div>
                : <div key="main-layout-connected" id="main-layout">
                    <Frame frameType="frame-f">
                        <div id="main-menu" className={ 'menu-active-' + activePage }>
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
                    </Frame>
                    <div id="main-content">
                        { (activePage === 'dashboard')     && <PageDashboard     /> }
                        { (activePage === 'configuration') && <PageConfiguration /> }
                        { (activePage === 'pools')         && <PagePools         /> }
                        { (activePage === 'coins')         && <PageCoins         /> }
                    </div>
                    { svg }
                </div>
        )

    }
}