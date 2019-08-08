import "core-js/stable";
import "regenerator-runtime/runtime";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Layout from './layout';

import './assets/styles.less';
import './assets/background.css';
import './assets/fonts.css';
import './assets/pretty-checkbox.css';

ReactDOM.render(
    <Layout />,
    document.getElementById('jxos-dashboard')
);
