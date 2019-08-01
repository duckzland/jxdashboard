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
            contentClassName: 'content configuration',
            horizontal: false,
            vertical: true
        };

        return (
            <div className="panels">
                <ScrollArea { ...sidebarProps }>
                    <div className={ 'inner-content menu menu-active-' + activeContent }>
                        <svg className="svg-frame"
                             ref={ref => (this.svgElement = ref)}
                             viewBox="0 0 23.738 22.944"
                             xmlns="http://www.w3.org/2000/svg"
                             vector-effect="non-scaling-stroke"
                             preserveAspectRatio="none">
                            <path className="orange-line" d="M19.186 22.808l2.13.004 1.438-1.322-.032-9.94.883-.456-.017-7.056-.934-.669-.053-1.99L21.25.159l-2.07.006M4.638 22.801l-2.246-.003-1.179-1.002-.045-3.269-1.035-.77.033-5.778 1.133-.668-.053-9.945L2.45.144 4.331.132"/>
                            <path className="orange-line" d="M1.271 17.058l.695-.395-.006-3.585m20.263-8.085l-.566.319.006 3.585"/>
                        </svg>
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
