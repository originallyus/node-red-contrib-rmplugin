module.exports = function(RED) {
  function rmpluginIPAddressConfig(config) {
    RED.nodes.createNode(this, config);
    this.ipaddress = config.ipaddress;
    this.port = config.port;

     //Build another API to auto detect IP Addresses
     discoverIpAddresses('rmplugin-http', function(ipaddresses) {
      RED.httpAdmin.get('/ipaddresses', function(req, res) {
        res.json(ipaddresses);
      });
    });
   };

   function discoverIpAddresses(serviceType, discoveryCallback)
   {
    var configInfo = [];
    var bonjour = require('bonjour')();
    var browser = bonjour.find({type: serviceType}, function(service) {
      service.addresses.forEach(function(element) {
        if (element.split(".").length == 4) {
          var label = "" + service.txt.md + " (" + element + ")";         
          configInfo.push({
            key:"address",
            value: element
          });
       
        }
      });
     
      configInfo.push({
        key:"port",
        value: service.port
      });
      //Add a bit of delay for all services to be discovered
      if (discoveryCallback) 
        setTimeout(function(){ 
          discoveryCallback(configInfo);
        }, 2000);
    });


  }

  RED.nodes.registerType("rm-plugin-config", rmpluginIPAddressConfig);
};
