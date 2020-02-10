let os = require('os');
let process = require('process');

module.exports = function (RED) {
    'use strict';

    let listeners = [];
    function onChange(f) {
        if (listeners.indexOf(f) === -1) {
            listeners.push(f);
        }
    }

    let oldInterfaces = [];
    process.nextTick(function checkInterfaces() {
        let interfaces = os.networkInterfaces();

        if (JSON.stringify(interfaces) !== JSON.stringify(oldInterfaces)) {
            listeners.forEach((f) => f(interfaces));
            oldInterfaces = interfaces;
        }

        process.nextTick(checkInterfaces);
    });

    RED.nodes.registerType("if-listener", LowerCaseNode);
}