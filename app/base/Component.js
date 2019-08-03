import React                from 'react';
import { isEqual, forEach } from 'lodash';
import anime                from 'animejs';

export default class Component extends React.Component {

    static faderCount = 1;
    duration = 600;
    delay = 200;
    fader = [];

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
        this.enter();
    }

    componentDidUpdate() {
        this.locked = true;
        this.update();
    }

    componentWillUnmount() {
        this.exit();
    }

    enter() {
        this.fader.map((element, i) => {
            Component.faderCount++;
            element
                && element.current
                && anime.set(element.current, {
                    opacity: 0
                });

            element
                && element.current
                && anime({
                    targets: element.current,
                    easing: 'linear',
                    opacity: 1,
                    delay: Component.faderCount * this.delay,
                    duration: this.duration
                });
        });
    };

    update() {};

    exit() {

        forEach(this.fader, (element, i) => {
            Component.faderCount--;
            element
                && element.current
                && anime.remove(element.current);

            /** Animation not working yet
            element
                && element.current
                && anime({
                    targets: element.current,
                    easing: 'linear',
                    opacity: 0,
                    delay: 0,
                    duration: 300
                });**/
        });

    };

}