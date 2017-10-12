module.exports = function(RED) {
    function rmpluginA1(config) {
        RED.nodes.createNode(this,config);
        var context = this.context();
        // this.ipaddress = config.ipaddress;
        // this.port = config.port;
        var node = this;
        var msg= {};
        var deviceMac = config.devicemac;
   // Retrieve the config node
        this.server = RED.nodes.getNode(config.server);

        if (this.server) {
             this.on('input', function(msg) {
                node.status({fill:"blue",shape:"ring",text:"requesting"});
                 if("deviceMac" in msg)
                  deviceMac = msg.deviceMac;
            const http = require("http");
               var url = "http://" + this.server.ipaddress + ":" + this.server.port+"/a1_status?deviceMac="+deviceMac;

            http.get(url, (resp) => {

              let rawData = '';
             
              // A chunk of data has been recieved.
              resp.on('data', (chunk) => {
                rawData += chunk;
              });
             
              // The whole response has been received. Print out the result.
              resp.on('end', () => {
                console.log(JSON.parse(rawData).explanation);

                 msg.rawResponse = JSON.parse(rawData);
                if(msg.rawResponse.status === "ok"){
                  msg.status = "success";
                      msg.payload = {};
                     checknull(msg.payload,"temperature",msg.rawResponse);
                     checknull(msg.payload,"humidity",msg.rawResponse);
                     checknull(msg.payload,"air",msg.rawResponse);
                     checknull(msg.payload,"light",msg.rawResponse);
                     checknull(msg.payload,"noisy",msg.rawResponse);
                 
                }
                if(msg.rawResponse.status !== "ok"){
                  msg.status = "failed";
                }
                node.send(msg);
                node.status({fill:"green",shape:"dot",text:"completed"});
              });
             
            }).on("error", (err) => {
              console.log("Error: " + err.message);
              node.status({fill:"red",shape:"ring",text:"ERR: " + err.message});
            });
        });

        } else {
            // No config node configured
        }
    }
    RED.nodes.registerType("A1 Devices",rmpluginA1);

    function checknull(msg,field,rawResponse) {
            if (rawResponse[field] === null || rawResponse[field] === undefined)
                  msg[field] = null;
            else
                  msg[field] = rawResponse[field];
      // body...
    }
};
