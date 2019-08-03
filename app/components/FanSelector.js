import React              from 'react';
import Component          from '../base/Component';
import Config             from '../modules/Config';
import { Select, Option } from 'informed';
import { forEach, get, isEmpty, findKey }   from 'lodash';

export default class FanSelector extends Component {

    state = {
        fans             : [],
        data             : Config.storage
    };

    parseProps = (props) => {
        this.generate();
    };

    generate = () => {
        const fans      = get(this.state, 'data.dynamic.detected.fans', {});
        this.state.fans = [];

        forEach(fans, (index) => {
            this.state.fans.push(index);
        });
        this.state.fans.sort();
    };

    render() {

        const { hasGlobal, field, key } = this.props;
        const { fans }             = this.state;

        return (
            <Select key={ key } field={ field }>
                { hasGlobal && <Option value="global">All Fans</Option> }
                {
                    fans.map((index, key) => {
                        const optionProps = {
                            key     : 'fan-selector-option-' + key,
                            value   : index
                        };

                        return (
                            <Option { ...optionProps } >{ index }</Option>
                        )
                    })
                }
            </Select>
        )
    }

}