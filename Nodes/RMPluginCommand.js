module.exports = function(RED) {
    function rmpluginCommand(config) {
        RED.nodes.createNode(this,config);
        var context = this.context();
        // this.ipaddress = config.ipaddress;
        // this.port = config.port;
        var node = this;
        var msg;
        var codeID = config.codeid;
        var deviceMAC = config.devicemac;
   // Retrieve the config node
        this.server = RED.nodes.getNode(config.server);


      
        if (this.server) {
            // Do something with:
           
            //  this.server.host
            node.send(this.server.ipaddress);
            //  this.server.port
            node.send(this.server.port);

             this.on('input', function(msg) {
               node.send("cinfug: " + config.macroid);
                node.send( msg);
              if("codeID" in msg || "deviceMAC" in msg){
                codeID = msg.codeID;
                deviceMAC = msg.deviceMAC;
              }
                  
                node.send("code id: "+codeID + "---- device: "+ deviceMAC);
                node.status({fill:"blue",shape:"ring",text:"requesting"});
            

            const http = require("http");
               var url = "http://" + this.server.ipaddress + ":" + this.server.port+"/send?deviceMac="+deviceMAC+"&codeId="+codeID;

            http.get(url, (resp) => {

              let rawData = '';
             
              // A chunk of data has been recieved.
              resp.on('data', (chunk) => {
                rawData += chunk;
              });
             
              // The whole response has been received. Print out the result.
              resp.on('end', () => {
                console.log(JSON.parse(rawData).explanation);
                node.send("Final: "+JSON.parse(rawData));
                msg.payload = JSON.parse(rawData);
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
    RED.nodes.registerType("Command",rmpluginCommand);

};
