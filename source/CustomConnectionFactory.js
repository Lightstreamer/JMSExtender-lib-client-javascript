import {LightstreamerClient} from "lightstreamer-client-stub";
import LightstreamerJMS from "./LightstreamerJMS";
  /**
   * @private
   */
  var CustomConnectionFactory = {
      /**
       * @private
       */
      /*public*/ createConnection: function(ConnectionClass, serverAddress, jmsConnector, userName, password, connListener) {
        var lsClient = new LightstreamerClient(serverAddress, "JMS");
        lsClient.connectionDetails.setUser(userName);
        lsClient.connectionDetails.setPassword(password);

        var connection = new ConnectionClass(lsClient, jmsConnector, true);

        var listener = new FactoryClientListener(connListener, connection, lsClient);
        lsClient.addListener(listener);
        listener.start(lsClient);

        lsClient.connect();

      }
  };

  /**
   * @private
   */
  function FactoryClientListener(connListener,connection,lsClient) {
    this.connListener = connListener;
    this.connection = connection;
    this.lsClient = lsClient;
  };

  FactoryClientListener.prototype = {
      /**
       * @private
       */
      /*private*/ callback: function(event,params) {
        if (this.connListener && this.connListener[event]) {
          try {
            if (params) {
              this.connListener[event].apply(this.connListener,params);
            } else {
              this.connListener[event].apply(this.connListener);
            }
          } catch (err) {

            // Log the error
            console.log("ConnectionFactory: exception while calling the "+event+" callback: " + err);
          }
        }
      },

      /**
       * @private
       */
      /*public*/ start: function() {
        this.callback("onLSClient",[this.lsClient]);
      },

      /*public*/ onServerError: function(errorCode, errorMessage) {
        this.callback("onConnectionFailed",[errorCode, errorMessage]);
        this.lsClient.disconnect();
      },

      /*public*/ onStatusChange: function(chngStatus) {
        switch (chngStatus) {
          case "CONNECTED:WS-STREAMING":
          case "CONNECTED:HTTP-STREAMING":
          case "CONNECTED:WS-POLLING":
          case "CONNECTED:HTTP-POLLING":
            this.callback("onConnectionCreated",[this.connection]);
            this.lsClient.removeListener(this);
            break;
        }
      }
  };

  FactoryClientListener.prototype["onStatusChange"] = FactoryClientListener.prototype.onStatusChange;
  FactoryClientListener.prototype["onServerError"] = FactoryClientListener.prototype.onServerError;

  export default CustomConnectionFactory;
