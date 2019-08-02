import React                from 'react';
import Component            from '../base/Component';
import ReactTable           from 'react-table';

export default class Frame extends Component {

    svgElement = false;

    getSVG = (type) => {
        let svg = [];
        switch (type) {

            // Left and right frame
            case 'frame-a':
                svg.push(
                    <svg className="svg-frame svg-left"
                     ref={ref => (this.svgElement = ref)}
                     viewBox="0 0 4.638 22.934"
                     xmlns="http://www.w3.org/2000/svg"
                     vector-effect="non-scaling-stroke"
                     preserveAspectRatio="none">
                        <path className="orange-line" d="M4.638 22.801l-2.246-.003-1.18-1.002-.044-3.269-1.036-.77.034-5.778 1.132-.669-.053-9.944L2.45.144 4.33.132"/>
                        <path className="orange-line" d="M1.271 17.057l.695-.394-.006-3.586"/>
                    </svg>
                );
                svg.push(
                    <svg className="svg-frame svg-right"
                         ref={ref => (this.svgElement = ref)}
                         viewBox="0 0 4.557 22.918"
                         xmlns="http://www.w3.org/2000/svg"
                         vector-effect="non-scaling-stroke"
                         preserveAspectRatio="none">
                        <path className="orange-line" d="M.006 22.782l2.128.004 1.44-1.322-.033-9.94.883-.456-.017-7.056-.934-.669-.053-1.99L2.07.132 0 .138"/>
                        <path className="orange-line" d="M3.041 4.967l-.565.319.006 3.585"/>
                    </svg>
                );
                break;

            // frame-a inversed
            case 'frame-b':

                svg.push(
                    <svg className="svg-frame svg-left"
                         ref={ref => (this.svgElement = ref)}
                         viewBox="0 0 4.557 22.918"
                         xmlns="http://www.w3.org/2000/svg"
                         vector-effect="non-scaling-stroke"
                         preserveAspectRatio="none">
                        <path className="orange-line" d="M4.552 22.782l-2.13.004-1.438-1.321.032-9.94-.883-.456.017-7.056.934-.67.053-1.989L2.487.133l2.07.006"/>
                        <path className="orange-line" d="M1.515 4.967l.566.32-.007 3.585"/>
                    </svg>
                );

                svg.push(
                    <svg className="svg-frame svg-right"
                         ref={ref => (this.svgElement = ref)}
                         viewBox="0 0 4.638 22.934"
                         xmlns="http://www.w3.org/2000/svg"
                         vector-effect="non-scaling-stroke"
                         preserveAspectRatio="none">
                        <path className="orange-line" d="M0 22.801l2.246-.003 1.179-1.002.045-3.269 1.035-.77-.033-5.778-1.133-.669.053-9.944L2.188.144.307.132"/>
                        <path className="orange-line" d="M3.367 17.057l-.696-.394.006-3.586"/>
                    </svg>
                );

                break;

            // Top and bottom frame - large
            case 'frame-c':
                svg.push(
                    <svg className="svg-frame svg-top"
                         ref={ref => (this.svgElement = ref)}
                         viewBox="0 0 69.321 5.078"
                         xmlns="http://www.w3.org/2000/svg"
                         vector-effect="non-scaling-stroke"
                         preserveAspectRatio="none">
                        <path className="orange-line" d="M69.189 5.079V2.433l-.794-1.323h-3.44l-.764-.977-5.778.033-.601.944H1.455L.132 2.433v2.646"/>
                        <path className="orange-line" d="M63.351 1.292l-.395.695-3.585-.006"/>
                    </svg>
                );
                svg.push(
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
                break;

            // Top and bottom frame - small
            case 'frame-d':
                svg.push(
                    <svg className="svg-frame svg-top"
                         ref={ref => (this.svgElement = ref)}
                         viewBox="0 0 41.54 5.078"
                         xmlns="http://www.w3.org/2000/svg"
                         vector-effect="non-scaling-stroke"
                         preserveAspectRatio="none">
                        <path className="orange-line" d="M41.407 5.079V2.433l-.793-1.323h-3.44L36.41.133l-5.778.034-.602.943H1.455L.132 2.433v2.646"/>
                        <path className="orange-line" d="M35.569 1.292l-.394.696-3.585-.007"/>
                    </svg>
                );

                svg.push(
                    <svg className="svg-frame svg-bottom"
                         ref={ref => (this.svgElement = ref)}
                         viewBox="0 0 41.612 5.424"
                         xmlns="http://www.w3.org/2000/svg"
                         vector-effect="non-scaling-stroke"
                         preserveAspectRatio="none">
                        <path className="orange-line" d="M41.476.741l.004 2.129-1.322 1.438-9.94-.032-.981 1.016h-6.615l-1.323-1.323H1.455L.132 2.646V0"/>
                        <path className="orange-line" d="M23.969 3.585l.319-.565 3.585.006"/>
                    </svg>
                );

                break;

            // Left and right frame - tall mode
            case 'frame-e':
                svg.push(
                    <svg className="svg-frame svg-left"
                         ref={ref => (this.svgElement = ref)}
                         viewBox="0 0 3.969 54.504"
                         xmlns="http://www.w3.org/2000/svg"
                         vector-effect="non-scaling-stroke"
                         preserveAspectRatio="none">
                        <path className="orange-line" d="M3.969 54.372H2.646l-1.323-1.634V23.331l-1.19-1.504.033-7.136 1.133-.825-.053-12.281L2.382.132h1.587"/>
                        <path className="orange-line" d="M.628 21.694l.695-.395-.006-3.585"/>
                    </svg>
                );

                svg.push(
                    <svg className="svg-frame svg-right"
                         ref={ref => (this.svgElement = ref)}
                         viewBox="0 0 3.894 54.504"
                         xmlns="http://www.w3.org/2000/svg"
                         vector-effect="non-scaling-stroke"
                         preserveAspectRatio="none">
                        <path className="orange-line" d="M0 54.371h1.323l1.323-1.633V15.161l1.115-1.563-.018-8.715-.933-.826-.053-2.456L1.323.131H0"/>
                        <path className="orange-line" d="M3.211 9.073l-.565.32.006 3.585"/>
                    </svg>
                );
                break;

            case 'frame-f':
                svg.push(
                    <svg className="svg-frame svg-bottom"
                         ref={ref => (this.svgElement = ref)}
                         viewBox="0 0 305.594 2.91"
                         xmlns="http://www.w3.org/2000/svg"
                         vector-effect="non-scaling-stroke"
                         preserveAspectRatio="none">
                        <path className="orange-line" d="M305.594.133h-80.698l-1.323 1.322-67.81.308-.982 1.015h-6.614l-1.323-1.323h-85.99L59.531.132H0"/>
                    </svg>
                );
                break;
        }

        return svg;
    };

    render() {
        const { children, frameType, title, className, table } = this.props;
        const { getSVG } = this;
        const elProps = {
            className: 'inner-content ' + ( className ? className : ' ') + ' ' + frameType
        };

        return (
            <div { ...elProps }>
                { frameType && getSVG(frameType) }
                { title && <h3 className="title">{ title }</h3> }
                { table && <ReactTable { ...table } /> }
                { children }
            </div>
        )
    }

}