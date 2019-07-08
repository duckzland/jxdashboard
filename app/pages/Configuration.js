import React             from 'react';
import ScrollArea        from 'react-scrollbar';
import PanelSettings     from '../panels/Settings';
import PanelNotification from '../panels/Notification';
import PanelTuner        from '../panels/Tuner';
import PanelWatchdog     from '../panels/Watchdog';
import PanelFanControl   from '../panels/FanControl';

export default class PageConfiguration extends React.Component {
    state = {
        activeContent: 'settings'
    };

    changeContent = (newContent) => {
        newContent !== this.state.activeContent && this.setState({ activeContent: newContent });
    };

    render() {
        const { activeContent } = this.state;
        const { changeContent } = this;
        const panelProps        = {};

        const sidebarProps = {
            key: 'sidebar-element',
            speed: 0.8,
            className: 'side-panels panel',
            contentClassName: 'content',
            horizontal: false,
            vertical: true
        };

        const contentProps = {
            key: 'content-element',
            speed: 0.8,
            className: 'main-panels panel',
            contentClassName: 'content',
            horizontal: false,
            vertical: true
        };

        return (
            <div className="panels">
                <ScrollArea { ...sidebarProps }>
                    <div className={ 'menu menu-active-' + activeContent }>
                        <div className="items settings"     onClick={() => changeContent('settings')     }>Settings</div>
                        <div className="items watchdog"     onClick={() => changeContent('watchdog')     }>Watchdog</div>
                        <div className="items notification" onClick={() => changeContent('notification') }>Notification</div>
                        <div className="items tuner"        onClick={() => changeContent('tuner')        }>Tuner</div>
                        <div className="items fancontrol"   onClick={() => changeContent('fancontrol')   }>Fan Control</div>
                    </div>
                </ScrollArea>
                <ScrollArea { ...contentProps }>
                    { activeContent === 'settings'     && <PanelSettings     { ...panelProps } /> }
                    { activeContent === 'watchdog'     && <PanelWatchdog     { ...panelProps } /> }
                    { activeContent === 'notification' && <PanelNotification { ...panelProps } /> }
                    { activeContent === 'tuner'        && <PanelTuner        { ...panelProps } /> }
                    { activeContent === 'fancontrol'   && <PanelFanControl   { ...panelProps } /> }
                </ScrollArea>
            </div>
        )
    }
}
