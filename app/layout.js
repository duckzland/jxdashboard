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
            (!serverState || serverState !== 'connected')
                ? <div key="main-layout" id="not-connected">
                    <div className="inner-content">
                        <svg className="svg-frame"
                             ref={ref => (this.svgElement = ref)}
                             viewBox="0 0 41.612 14.471"
                             xmlns="http://www.w3.org/2000/svg"
                             vector-effect="non-scaling-stroke"
                             preserveAspectRatio="none">
                            <path className="orange-line" d="M41.475 9.788l.004 2.129-1.321 1.438-9.94-.032-.982 1.016h-6.614l-1.323-1.323H1.455L.132 11.693V9.047M41.407 5.078V2.433l-.793-1.323h-3.44L36.41.133l-5.778.033-.602.944H1.455L.132 2.433v2.645"/>
                            <path className="orange-line" d="M35.57 1.292l-.395.695-3.585-.006M23.969 12.632l.319-.565 3.585.006"/>
                        </svg>
                        { message }
                    </div>
                    { svg }
                </div>
                : <div key="main-layout" id="main-layout">
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