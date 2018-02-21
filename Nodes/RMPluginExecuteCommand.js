module.exports = function(RED) {
  function rmpluginExecuteCommand(config) {
    RED.nodes.createNode(this,config);
    var context = this.context();
        // this.ipaddress = config.ipaddress;
        // this.port = config.port;
        var node = this;
        var msg;
   // Retrieve the config node
   this.server = RED.nodes.getNode(config.server);

   if (this.server) {
            // Do something with:
            
            //  this.server.host
            node.send(this.server.ipaddress);
            //  this.server.port
            node.send(this.server.port);
            this.on('input', function(msg) {
              node.status({fill:"blue", shape:"ring", text:"requesting"});
              
              const http = require("http");
              var url = "http://" + this.server.ipaddress + ":" + this.server.port+"/send?deviceMac="+msg.deviceMAC+"&codeId="+msg.codeID;

              http.get(url, (resp) => {
              // A chunk of data has been received.
              var rawData = '';
              resp.on('data', (chunk) => {
                rawData += chunk;
              });
              
              // The whole response has been received. Print out the result.
              resp.on('end', () => {
                const { statusCode } = resp;
                if (statusCode !== 200) {
                  node.status({fill:"red", shape:"dot", text:"status:" + statusCode});
                  var error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
                  console.error(error.message);
                  return;
                }
                
                msg.rawResponse = JSON.parse(rawData);
                if (msg.rawResponse === undefined) {
                  node.status({fill:"red", shape:"dot", text:"unable to parse json from bridge"});
                  console.error(rawData);
                  return;
                }

                if (msg.rawResponse.status === undefined || msg.rawResponse.status === null) {
                  node.status({fill:"red", shape:"dot", text:"unexpected response format from bridge"});
                  console.error(rawData);
                  return;
                }
                
                var success = msg.rawResponse.status === "ok";
                msg.payload = success ? "success" : "failed";
                console.log(msg.rawResponse);
                
                node.send(msg);
                node.status({fill:"green", shape:"dot", text:success});
              });
              
            }).on("error", (err) => {
              console.log("Error: " + err.message);
              node.status({fill:"red", shape:"ring", text:"error: " + err.message});
            });
          });

          } else {
            // No config node configured
          }
        }
        RED.nodes.registerType("Execute Command",rmpluginExecuteCommand);

      };
