import JMSException from "./JMSException";
import Session from "./Session";
import {Subscription} from "lightstreamer-client-stub";
import IllegalStateException from "./IllegalStateException";
import IllegalArgumentException from "./IllegalArgumentException";

   /**
   * The embedded Lightstreamer client instance that is used internally to
   * connect to Lightstreamer JMS Extender.
   * @external LightstreamerClient
   * @see {@link EXTERNAL_APIDOC_REFERENCE/LightstreamerClient.html|LightstreamerClient}
   */

  /**
   * This method is not meant to be used directly.
   * Creates a {@link Connection} object that wraps an underlying
   * {@link EXTERNAL_APIDOC_REFERENCE/LightstreamerClient.html|LightstreamerClient}
   * object into a JMS Extender compatible connection.
   * @constructor
   *
//JSDOC_IGNORE_START
   * @param {!external:LightstreamerClient} lsClient instance of LightstreamerClient
   * to be wrapped into a JMS Extender connection.
   * @param {String} jmsConnector name of the JMS Connector, as configured on the
   * JMS Extender. Each connector can connect to a different JMS broker.
   * @param {Boolean} owned if the lsClient is owned by the connection, that is:
   * if the lsClient should disconnect when the connection is closed
//JSDOC_IGNORE_END
   *
   * @exports Connection
   * @class Class that wraps an underlying {@link external:LightstreamerClient}
   * connection into a JMS Extender compatible connection.
   */
  var Connection= function(lsClient, jmsConnector, owned) {
    this.lsClient = lsClient;
    this.dataAdapterName= jmsConnector;
    this.owned= ((owned != null) ? owned : false);
    this.clientId= null;
    this.exceptionListener= null;

    this.used= false;
    this.open= true;
    this.running= false;
    this.sessions= [];

    this.outcomeCallbacks= {};

    // Subscribe to exception notifications
    this.exceptionGroup= {
      "dataAdapterName": this.dataAdapterName,
      "localClientId": null,
      "localSessionGuid": "-",
      "destinationType": "EXCEPTIONS"
    };

    this.exceptionSubscription= new Subscription("RAW", JSON.stringify(this.exceptionGroup),
      ["dataAdapterName", "localSessionGuid", "exceptionType", "exceptionReason", "exceptionErrorCode"]);

    this.exceptionSubscription.setDataAdapter(this.dataAdapterName);
    this.exceptionSubscription.setRequestedSnapshot("no");

    var that= this;
    this.exceptionSubscription.addListener({
      onItemUpdate: function(updateInfo) {
        if (that.exceptionListener == null)
          return;

        try {

          // Check if exception belongs to this connection
          var localSessionGuid= updateInfo.getValue("localSessionGuid");
          if (localSessionGuid != null) {
            var belongsToMe= false;

            for (var i= 0; i < that.sessions.length; i++) {
              var session= that.sessions[i];

              if (session.localGuid == localSessionGuid) {
                belongsToMe= true;
                break;
              }
            }

            if (!belongsToMe)
              return;
          }

          var exceptionType= updateInfo.getValue("exceptionType");
          var exceptionReason= updateInfo.getValue("exceptionReason");
          var exceptionErrorCode= updateInfo.getValue("exceptionErrorCode");

          var exception= null;
          switch (exceptionType) {
            case "GENERIC_EXCEPTION":
              exception= new JMSException(exceptionReason, exceptionErrorCode);
              break;

            default:
              break;
          }

          if (exception == null)
            return;

          // Call client callback
          try {
            that.exceptionListener["onException"](exception);

          } catch (err) {

            // Log the error
            try {
              console.log("Connection: exception while forwarding asynchronous exception: " + err);
            } catch (err2) {}
          }

        } catch (err) {

          // Log the error
          try {
            console.log("Connection: exception while processing asynchronous exception: " + err);
          } catch (err2) {}
        }
      }
    });

    this.lsClient.subscribe(this.exceptionSubscription);

    // Subscribe to operation outcome notifications
    this.outcomeGroup= {
      "dataAdapterName": this.dataAdapterName,
      "localClientId": null,
      "localSessionGuid": "-",
      "destinationType": "OUTCOMES"
    };

    this.outcomeSubscription= new Subscription("RAW", JSON.stringify(this.outcomeGroup),
      ["dataAdapterName", "localSessionGuid", "operationId", "operationOutcome",
      "exceptionType", "exceptionReason", "exceptionErrorCode"]);

    this.outcomeSubscription.setDataAdapter(this.dataAdapterName);
    this.outcomeSubscription.setRequestedSnapshot("no");

    this.outcomeSubscription.addListener({
      onItemUpdate: function(updateInfo) {
        try {

          // Check if outcome belongs to this connection
          var localSessionGuid= updateInfo.getValue("localSessionGuid");
          if (localSessionGuid != null) {
            var belongsToMe= false;

            for (var i= 0; i < that.sessions.length; i++) {
              var session= that.sessions[i];

              if (session.localGuid == localSessionGuid) {
                belongsToMe= true;
                break;
              }
            }

            if (!belongsToMe)
              return;
          }

          var operationId= updateInfo.getValue("operationId");
          var operationOutcome= updateInfo.getValue("operationOutcome");

          var exceptionType= updateInfo.getValue("exceptionType");
          var exceptionReason= updateInfo.getValue("exceptionReason");
          var exceptionErrorCode= updateInfo.getValue("exceptionErrorCode");

          var callback= that.outcomeCallbacks[operationId];
          if (callback == null)
            return;

          // Remove outcome callback
          that.outcomeCallbacks[operationId]= null;

          // Call callback
          try {
            if (exceptionType != null)
              callback.onException(exceptionType, exceptionReason, exceptionErrorCode);
            else
              callback.callback(operationOutcome);

          } catch (err) {

            // Log the error
            try {
              console.log("Connection: exception while forwarding operation outcome: " + err);
            } catch (err2) {}
          }

        } catch (err) {

          // Log the error
          try {
            console.log("Connection: exception while processing operation outcome: " + err);
          } catch (err2) {}
        }
      }
    });

    this.lsClient.subscribe(this.outcomeSubscription);
  };

  Connection.prototype= {

    /**
     * Gets the client identifier for this connection. See JMS specifications
     * for more information.
     * @returns {String}
     */
    getClientID: function() {
      return this.clientId;
    },

    /**
     * Sets the client identifier for this connection. See JMS specifications
     * for more information.
     * <BR/><B>Implementation note</B>: scalability considerations apply
     * when the client ID is set, see JMS Extender documentation.
     *
     * @param {String} clientId the unique client identifier
     */
    setClientID: function(clientId) {
      if (this.used)
        throw new IllegalStateException("Connection has already been used");

      this.clientId= clientId;
    },

    /**
     * Gets the {@link ExceptionListener} object for this connection.
     * @returns {ExceptionListener}
     */
    getExceptionListener: function() {
      return this.exceptionListener;
    },

    /**
     * Sets an exception listener for this connection. Many common JMS
     * exceptions will be delivered asynchronously through this listener.
     *
     * @param {ExceptionListener} exceptionListener the exception listener
     * meant to receive exceptions for this connection.
     */
    setExceptionListener: function(exceptionListener) {
      this.exceptionListener= exceptionListener;
    },

    /**
     * Creates a {@link Session} object.<BR/>
     * This method may be called in 3 different ways:<UL>
     * <LI>No arguments: the session is created as non-transacted and with
     *     "AUTO_ACK" acknowledge mode.</LI>
     * <LI>One arguments: the argument is the session mode and must be a
     *     string specifying either "TRANSACTED" or an ancknowledge
     *     mode.</LI>
     * <LI>Two arguments: the first argument is the transacted flag and must
     *     be a boolean; the second argument is the acknowledge mode and must
     *     be a string.</LI>
     * </UL>
     *
     * @param {String | Boolean} sessionMode In case of String, specifies the
     * session mode. Can be one of the following: <code>"TRANSACTED"</code>,
     * <code>"PRE_ACK"</code>, <code>"AUTO_ACK"</code>, <code>"CLIENT_ACK"</code>,
     * <code>"DUPS_OK"</code> or <code>"INDIVIDUAL_ACK"</code>.<BR/>
     * In case of Boolean, specifies if the session is transacted.
     * @param {String} acknowledgeMode If the first argument is Boolean, specifies
     * the type of acknowledge to be used for messages. Can be one of the following:
     * <code>"PRE_ACK"</code>, <code>"AUTO_ACK"</code>, <code>"CLIENT_ACK"</code>,
     * <code>"DUPS_OK"</code> or <code>"INDIVIDUAL_ACK"</code>.<BR/>
     * See JMS Extender documentation for more information on acknowledge modes.
     * @returns {Session}
     */
    createSession: function(sessionMode, acknowledgeMode) {
      this.used= true;

      var session= null;
      if ((sessionMode == null) && (acknowledgeMode == null)) {
        session= new Session(this, false, "AUTO_ACK");

      } else if (typeof sessionMode == "boolean") {
        session= new Session(this, sessionMode, acknowledgeMode);

      } else if (typeof sessionMode == "string") {
        session= new Session(this, (sessionMode == "TRANSACTED"), sessionMode);

      } else
        throw new IllegalArgumentException("Invalid arguments");

      this.sessions.push(session);

      if (this.running)
        session.start();

      return session;
    },

    /**
     * Starts (or restarts) the connection's delivery of incoming messages.
     * A call to {@link Connection#start} on a connection that has already been
     * started is ignored.
     */
    start: function() {
      this.used= true;

      if (this.running)
        return;

      this.running= true;

      // Start all the sessions
      for (var i= 0; i < this.sessions.length; i++) {
        var session= this.sessions[i];

        session.start();
      }
    },

    /**
     * Temporarily stops the connection's delivery of incoming messages.
     * Delivery can be restarted using the connection's {@link Connection#start}
     * method. A call to {@link Connection#stop} on a connection that has already
     * been stopped is ignored.
     * <BR/>Stopping a connection has no effect on its ability to send
     * messages.
     * <BR/><B>Implementation note</B>: underlying subscriptions are
     * unsubscribed but their item names are kept for a later restart.
     */
    stop: function() {
      this.used= true;

      if (!this.running)
        return;

      this.running= false;

      // Stop all the sessions
      for (var i= 0; i < this.sessions.length; i++) {
        var session= this.sessions[i];

        session.stop();
      }
    },

    /**
     * Closes the connection. All message producers and consumers will be
     * stopped and their subsequent use will cause an
     * {@link IllegalStateException}. A call to {@link Connection#close} on a
     * connection that has already been closed is ignored.
     * <BR/><B>Implementation note</B>: underlying subscriptions are
     * unsubscribed and deleted. If the connection was created
     * through a ConnectionFactory the underlying LightstreamerClient connection
     * is also disconnected. This means any message being sent (JMS messages,
     * acknowledges, unsubscriptions, etc.) may get lost if the library did
     * not have enough time to deliver them.
     */
    close: function() {
      this.used= true;

      if (!this.open)
        return;

      this.open= false;
      this.running= false;

      this.exceptionListener= null;

      // Close all the producers
      while (this.sessions.length > 0) {
        var session= this.sessions.shift();

        session.close();
      }

      // Disconnect only if it is owned, i.e.: if it has
      // been created with a factory
      if (this.owned)
        this.lsClient.disconnect();
    },

//JSDOC_IGNORE_START
    addOutcomeCallback: function(operationId, outcomeCallback) {
      this.outcomeCallbacks[operationId]= outcomeCallback;
    },

    setClientIDInternal: function(clientId) {
      this.clientId= clientId;
    }
//JSDOC_IGNORE_END
  };

  Connection.prototype["close"] = Connection.prototype.close;
  Connection.prototype["createSession"] = Connection.prototype.createSession;
  Connection.prototype["getClientID"] = Connection.prototype.getClientID;
  Connection.prototype["getExceptionListener"] = Connection.prototype.getExceptionListener;
  Connection.prototype["setClientID"] = Connection.prototype.setClientID;
  Connection.prototype["setExceptionListener"] = Connection.prototype.setExceptionListener;
  Connection.prototype["start"] = Connection.prototype.start;
  Connection.prototype["stop"] = Connection.prototype.stop;

  export default Connection;
