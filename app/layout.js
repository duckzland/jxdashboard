import React             from 'react';
import Config            from './modules/Config';
import PageCoins         from './pages/Coins';
import PageConfiguration from './pages/Configuration';
import PageDashboard     from './pages/Dashboard';
import PagePools         from './pages/Pools';

export default class Layout extends React.Component {
    state = {
        activePage: 'dashboard'
    };

    constructor(props) {
        super(props);
        (new Config()).load();
    }

    changePage = (page) => {
        page !== this.state.activePage && this.setState({ activePage: page });
    };

    render() {

        const { activePage } = this.state;
        const { changePage } = this;

        return (
            <div key="main-layout" id="main-layout">
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
            </div>
        )

    }
}