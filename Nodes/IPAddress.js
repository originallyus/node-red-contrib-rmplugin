module.exports = function(RED) {
    function rmpluginIPAddressConfig(config) {
        RED.nodes.createNode(this, config);
        this.ipaddress = config.ipaddress;
        this.port = config.port
    }
    RED.nodes.registerType("rm-plugin-config", rmpluginIPAddressConfig);



   //  function rmpluginIPAddress(config) {
   //      RED.nodes.createNode(this,config);
   //      var context = this.context();
   //      // this.ipaddress = config.ipaddress;
   //      // this.port = config.port;
   //      var node = this;
   // // Retrieve the config node
   //      this.server = RED.nodes.getNode(config.server);

   //      if (this.server) {
   //          // Do something with:
           
   //          //  this.server.host
   //          node.send(this.server.ipaddress);
   //          //  this.server.port
   //          node.send(this.server.port);
   //          this.on('input', function(msg) {
   //            var payloadString = "http://" + this.server.ipaddress + ":" + this.server.port;
   //          msg.payload = payloadString;
   //         msg.ipaddress = this.server.ipaddress;

   //      node.send(msg);
   //  });

   //      } else {
   //          // No config node configured
   //      }
   //  }
   //  RED.nodes.registerType("RM Plugin IP Input",rmpluginIPAddress);

};
