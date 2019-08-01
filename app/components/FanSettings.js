import React                from 'react';
import { Text, Checkbox }   from 'informed';
import CurveEditor          from './CurveEditor';
import Component            from '../base/Component';
import { isEqual, get, isEmpty } from 'lodash';

export default class FanSettings extends Component {

    state = {
        name: '',
        curve: false,
        checkbox: false,
        data: {}
    };


    parseProps = (props) => {
        if ('name' in props) {
            this.state.name = props.name;
        }
        if ('curve' in props) {
            this.state.curve = props.curve;
        }
        if ('checkbox' in props) {
            this.state.checkbox = props.checkbox;
        }
        if ('data' in props) {
            this.state.data = props.data;
        }
    };

    setCurve = (newCurve) => {
        const { name    } = this.state;
        const { formApi } = this.props;
        !isEmpty(name) && !isEmpty(newCurve) && formApi && formApi.setValue(name + '.curve', newCurve);
    };

    convertCurve(curve) {
        const rawCurves = curve.split(',');
        let curves = [];
        (rawCurves.length > 0) && rawCurves.map((c) => {
            const d = c.split('|');
            (d.length == 2) && curves.push({
                x: parseInt(d[0].trim()),
                y: parseInt(d[1].trim())
            });
        });
        return curves;
    };

    render() {
        const { convertCurve, setCurve } = this;
        const { name, curve, checkbox, data } = this.state;
        const curve_enable  = get(data, name + '.curve_enable', false);
        const curve_value   = get(data, name + '.curve', '0|0, 10|10, 30|30, 50|50, 60|60, 80|80, 100|100');
        const enable        = get(data, name + '.enable', false);
        const target        = get(data, name + '.target', '');
        const min           = get(data, name + '.min', '');
        const max           = get(data, name + '.max', '');
        const up            = get(data, name + '.up', '');
        const down          = get(data, name + '.down', '');

        return (
            <div className="gpu-tuner-rows">
                <div className="form-graph">
                </div>
                { curve && <CurveEditor onChange={ setCurve } data={ convertCurve(curve_value) }/> }
                { curve && <Text type="hidden" field={ name + '.curve' } initialValue={ curve_value } /> }
                <div className="form-group">
                    <div className="pretty p-default">
                        <Checkbox key={ name + '.curve_enable' } field={ name + '.curve_enable' } initialValue={ curve_enable }/>
                        <div className="state p-success-o">
                            <label className="form-checkbox">
                                Use Curve
                            </label>
                        </div>
                    </div>
                </div>
                { !curve && <div className="form-row">
                    { checkbox && <div className="items">
                        <div className="pretty p-default">
                            <Checkbox key={ name + '.enable' } field={ name + '.enable' } initialValue={ enable } />
                            <div className="state p-success-o">
                                <label className="form-checkbox">
                                    Fan Settings
                                </label>
                            </div>
                        </div>
                    </div> }
                    { !checkbox && <div className="items">
                        <label className="form-checkbox">
                            Fan Settings
                        </label>
                    </div> }
                    <div className="items">
                        <label className="form-label">Target</label>
                        <Text key={ name + '.target.text'   } field={ name + '.target' } initialValue={ target } />
                        <Text key={ name + '.target.slider' } field={ name + '.target' } initialValue={ target } type="range" min="0" max="100" />
                    </div>
                    <div className="items">
                        <label className="form-label">Minimum</label>
                        <Text key={ name + '.min.text'      } field={ name + '.min'    } initialValue={ min } />
                        <Text key={ name + '.min.slider'    } field={ name + '.min'    } initialValue={ min } type="range" min="0" max="100"/>
                    </div>
                    <div className="items">
                        <label className="form-label">Maximum</label>
                        <Text key={ name + '.max.text'      } field={ name + '.max'    } initialValue={ max } />
                        <Text key={ name + '.max.slider'    } field={ name + '.max'    } initialValue={ max } type="range" min="0" max="100"/>
                    </div>
                    <div className="items">
                        <label className="form-label">Step Up</label>
                        <Text key={ name + '.up.text'      } field={ name + '.up'      } initialValue={ up } />
                        <Text key={ name + '.up.slider'    } field={ name + '.up'      } initialValue={ up } type="range" min="0" max="100"/>
                    </div>
                    <div className="items">
                        <label className="form-label">Step Down</label>
                        <Text key={ name + '.down.text'    } field={ name + '.down'    } initialValue={ down } />
                        <Text key={ name + '.down.slider'  } field={ name + '.down'    } initialValue={ down } type="range" min="0" max="100"/>
                    </div>
                </div> }
            </div>
        )
    }

}