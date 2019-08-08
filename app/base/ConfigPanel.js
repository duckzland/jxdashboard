import React        from 'react';
import { merge }    from 'lodash';
import Config       from '../modules/Config';

export default class ConfigPanel extends React.Component {

    isSaving = false;
    state = {};

    constructor(props) {
        super(props);
        this.formApi = false;

        this.handleSave     = this.handleSave.bind(this);
        this.handleChange   = this.handleChange.bind(this);
        this.savingStart    = this.savingStart.bind(this);
        this.savingComplete = this.savingComplete.bind(this);
        this.setFormApi     = this.setFormApi.bind(this);
    }

    setFormApi(formApi) {
        this.formApi = formApi;
        this.formApi.setValues(this.state.data)
    }

    handleChange() {
        this.state.data = merge(this.state.data, this.formApi.getState().values);
        this.setState(this.state);
    }

    handleSave() {
        const config = new Config();
        config.save(this.savingStart, this.savingComplete);
        config.reload();
    }

    savingStart() {
        this.isSaving = true;
        this.forceUpdate();
    }

    savingComplete() {
        const config = new Config();
        this.isSaving = false;
        this.forceUpdate();
        config.reload();
    }
}