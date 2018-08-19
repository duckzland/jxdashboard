import React                from 'react';
import { isEqual }          from 'lodash';

export default class Component extends React.Component {

    constructor(props) {
        super(props);
        this.locked = false;
        this.parseProps(props);
    }

    parseProps = (props) => {};

    shouldComponentUpdate() {
        return !this.locked;
    }

    componentWillReceiveProps(nextProps) {
        if (!isEqual(nextProps, this.state)) {
            this.parseProps(nextProps);
            this.locked = false;
            this.setState(this.state);
        }
    }

    componentDidMount() {
        this.locked = true;
    }

    componentDidUpdate() {
        this.locked = true;
    }

}