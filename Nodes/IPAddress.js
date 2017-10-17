module.exports = function(RED) {
  function rmpluginIPAddressConfig(config) {
    RED.nodes.createNode(this, config);
    this.ipaddress = config.ipaddress;
    this.port = config.port;
    setInterval(mdnsScan,10000);
  }

  function mdnsScan() {
    console.log('on scan');
    var bonjour = require('bonjour')()

// advertise an HTTP server on port 3000 
// bonjour.publish({ name: 'My Web Server', type: 'http', port: 3000 })

          // browse for all http services 
          bonjour.find({  }, function (service) {
            
            for(key in service){
               // console.log("key: "+ key);
              if(key == 'type'){

                var type = service[key];
                  // console.log("key value: "+ service[key]);
                if(type == "rmplugin-http"  ){
                  // console.log('Found an HTTP server:', service);
                       // console.log('data:', data);
                    
                       var address = service["addresses"];
                       for(var value in address){
                        var addressSplit = address[value].split(".");
                        if(addressSplit.length === 4){
                          var finalAddress = address[value];
                        }
                      }

                       var port = service["port"];
                       console.log('address:',finalAddress);
                       console.log('port:',port);                    
                      var configInfo = [];
                      configInfo.push({
                        key:address,
                        value: finalAddress
                      });
                      configInfo.push({
                        key:port,
                        value: port
                      });
                      RED.httpAdmin.get('/config',function(req,res){
                        res.json(configInfo || []);
                      });
                    
                     }                 
                   }
                 }

               })


        }

        
        RED.nodes.registerType("rm-plugin-config", rmpluginIPAddressConfig);
      };
