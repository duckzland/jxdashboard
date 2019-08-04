import "core-js/stable";
import "regenerator-runtime/runtime";
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Layout from './layout';

import './assets/styles.less';

ReactDOM.render(
    <Layout />,
    document.getElementById('jxos-dashboard')
);
