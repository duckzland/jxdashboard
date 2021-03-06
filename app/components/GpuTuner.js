import React                from 'react';
import Component            from '../base/Component';
import FormGroup            from './FormGroup';
import { Text }             from 'informed';
import { isEqual, get }     from 'lodash';

export default class GpuTuner extends Component {

    state = {
        label: false,
        name: '',
        data: {}
    };

    parseProps = (props) => {
        if ('name' in props) {
            this.state.name = props.name;
        }
        if ('data' in props) {
            this.state.data = props.data;
        }
        if ('label' in props) {
            this.state.label = props.label;
        }
    };

    render() {
        const { name, data, label } = this.state;
        const markup = ['core', 'memory', 'power'].map((t) => {
            const k         = name.replace('%s', t);
            const enable    = get(data, k + '.enable', false);
            const target    = get(data, k + '.target', '');
            const min       = get(data, k + '.min', '');
            const max       = get(data, k + '.max', '');
            const up        = get(data, k + '.up', '');
            const down      = get(data, k + '.down', '');
            const showLabel = t === 'core' && label;

            let l = '';
            switch (t) {
                case 'core' :
                    l = 'Core Clock';
                    break;
                case 'memory' :
                    l = 'Memory Clock';
                    break;
                case 'power' :
                    l = 'Power Level';
                    break;
            }

            return (
                <div key={ 'row-' + t } className="form-row">
                    <FormGroup title={ l }
                               elementType="checkbox"
                               elementClass="items"
                               key={ k + '.enable' } field={ k + '.enable' } initialValue={ enable }/>

                    <FormGroup title={ showLabel && 'Target' } elementClass="items">
                        <Text key={ k + '.target.text'   } field={ k + '.target' } initialValue={ target }/>
                        <Text key={ k + '.target.slider' } field={ k + '.target' } initialValue={ target } type="range" min="0" max="100" />
                    </FormGroup>
                    <FormGroup title={ showLabel && 'Minimum' } elementClass="items">
                        <Text key={ k + '.min.text'      } field={ k + '.min'    } initialValue={ min    }/>
                        <Text key={ k + '.min.slider'    } field={ k + '.min'    } initialValue={ min    } type="range" min="0" max="100"/>
                    </FormGroup>
                    <FormGroup title={ showLabel && 'Maximum' } elementClass="items">
                        <Text key={ k + '.max.text'      } field={ k + '.max'    } initialValue={ max    }/>
                        <Text key={ k + '.max.slider'    } field={ k + '.max'    } initialValue={ max    } type="range" min="0" max="100"/>
                    </FormGroup>
                    <FormGroup title={ showLabel && 'Step Up' } elementClass="items">
                        <Text key={ k + '.up.text'       } field={ k + '.up'     } initialValue={ up     }/>
                        <Text key={ k + '.up.slider'     } field={ k + '.up'     } initialValue={ up     } type="range" min="0" max="100"/>
                    </FormGroup>
                    <FormGroup title={ showLabel && 'Step Down' } elementClass="items">
                        <Text key={ k + '.down.text'     } field={ k + '.down'   } initialValue={ down   }/>
                        <Text key={ k + '.down.slider'   } field={ k + '.down'   } initialValue={ down   } type="range" min="0" max="100"/>
                    </FormGroup>
                </div>
            )
        });

        return (
            <div className="gpu-tuner-rows">
                { markup }
            </div>
        )
    }

}