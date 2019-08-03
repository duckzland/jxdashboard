import React             from 'react';
import ScrollArea        from 'react-scrollbar';
import Typist            from 'react-typist';
import PanelSettings     from '../panels/Settings';
import PanelNotification from '../panels/Notification';
import PanelTuner        from '../panels/Tuner';
import PanelWatchdog     from '../panels/Watchdog';
import PanelFanControl   from '../panels/FanControl';
import Frame             from '../components/Frame';
import Donation          from '../components/Donation';

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
            contentClassName: 'content configuration',
            horizontal: false,
            vertical: true
        };
        
        const typistProps = {
            avgTypingDelay: 1,
            stdTypingDelay: 2,
            startDelay: Frame.svgCount * 100,
            cursor: {
                show: false
            }
        };

        return (
            <div className="panels">
                <ScrollArea { ...sidebarProps }>
                    <Frame frameType="frame-a" className={ 'menu menu-active-' + activeContent }>
                        <div className="items settings"     onClick={() => changeContent('settings')     }><Typist { ...typistProps }>Settings</Typist></div>
                        <div className="items watchdog"     onClick={() => changeContent('watchdog')     }><Typist { ...typistProps }>Watchdog</Typist></div>
                        <div className="items notification" onClick={() => changeContent('notification') }><Typist { ...typistProps }>Notification</Typist></div>
                        <div className="items tuner"        onClick={() => changeContent('tuner')        }><Typist { ...typistProps }>Tuner</Typist></div>
                        <div className="items fancontrol"   onClick={() => changeContent('fancontrol')   }><Typist { ...typistProps }>Fan Control</Typist></div>
                    </Frame>
                </ScrollArea>
                <ScrollArea { ...contentProps }>
                    { activeContent === 'settings'     && <PanelSettings     { ...panelProps } /> }
                    { activeContent === 'watchdog'     && <PanelWatchdog     { ...panelProps } /> }
                    { activeContent === 'notification' && <PanelNotification { ...panelProps } /> }
                    { activeContent === 'tuner'        && <PanelTuner        { ...panelProps } /> }
                    { activeContent === 'fancontrol'   && <PanelFanControl   { ...panelProps } /> }
                    <Donation/>
                </ScrollArea>
            </div>
        )
    }
}
