module.exports = function (RED) {
    function LowerCaseNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        let os = require('os');
        let process = require('process');
        // Track the listeners and provide a way of adding a new one
        // You would probably want to put this into some kind of module
        // so it can be used in various places
        let listeners = [];
        function onChange(f) {
            if (listeners.indexOf(f) === -1) {
                listeners.push(f);
            }
        }
        let oldInterfaces = [];

        node.on('input', function (msg) {
            process.nextTick(function checkInterfaces() {
                let interfaces = os.networkInterfaces();

                // Quick and dirty way of checking for differences
                // Not very efficient
                if (JSON.stringify(interfaces) !== JSON.stringify(oldInterfaces)) {
                    listeners.forEach((f) => f(interfaces));
                    oldInterfaces = interfaces;
                }

                process.nextTick(checkInterfaces);
            });
            
            var msgTxt = 'xx';

            //onChange(msgTxt);

            msg.payload = msgTxt;
            node.send(msg);
        });
    }
    RED.nodes.registerType("if-listener", LowerCaseNode);
}