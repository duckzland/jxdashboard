import React        from 'react';
import { merge }    from 'lodash';
import Config       from '../modules/Config';

export default class ConfigPanel extends React.Component {

    isSaving = false;

    constructor(props) {
        super(props);
        this.formApi = false;
    }

    setFormApi = (formApi) => {
        this.formApi = formApi;
        this.formApi.setValues(this.state.data)
    };

    handleChange = () => {
        this.state.data = merge(this.state.data, this.formApi.getState().values);
        this.setState(this.state);
    };

    handleSave = () => {
        const config = new Config();
        config.save(this.savingStart, this.savingComplete);
        config.reload();
    };

    savingStart = () => {
        this.isSaving = true;
        this.forceUpdate();
    };

    savingComplete = () => {
        this.isSaving = false;
        this.forceUpdate();
    }
}