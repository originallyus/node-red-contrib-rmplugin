module.exports = function(RED) {
    function rmpluginIPAddressConfig(config) {
        RED.nodes.createNode(this,config);
        // var context = this.context();
        // this.ipaddress = config.ipaddress;
        // this.port = config.port;
        // var node = this;
        // this.on('input', function(msg) {
        //     var payloadString = "http://" + node.ipaddress + ":" + node.port;
        //     msg.payload = payloadString;
        //     msg.ipaddress = node.ipaddress;
        //     msg.port = node.port;
    
        // node.send(msg);
        
        // });
        this.ipaddress = config.ipaddress;
        this.port = config.port

    }
    RED.nodes.registerType("rm-plugin-config",rmpluginIPAddressConfig);
};
