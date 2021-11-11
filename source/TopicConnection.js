import Inheritance from "./Inheritance";
import Connection from "./Connection";
import TopicSession from "./TopicSession";

  /**
   * This method is not meant to be used directly.
   * Creates a {@link TopicConnection} object that wraps an underlying
   * {@link EXTERNAL_APIDOC_REFERENCE/LightstreamerClient.html|LightstreamerClient}
   * object into a JMS Extender compatible topic connection.
   * @constructor
   *
//JSDOC_IGNORE_START
   * @param {LightstreamerClient} lsClient instance of LightstreamerClient
   * to be wrapped into a JMS Extender topic connection.
   * @param {String} jmsConnector name of the JMS Connector, as
   * configured on the JMS Extender. Each connector can connect to
   * a different JMS broker.
   * @param {Boolean} owned if the lsClient is owned by the connection, that is:
   * if the lsClient should disconnect when the connection is closed
//JSDOC_IGNORE_END
   *
   * @exports TopicConnection
   * @class Concrete class that wraps an underlying {@link external:LightstreamerClient}
   * object into a JMS Extender compatible topic connection.
   * @extends Connection
   */
  var TopicConnection= function(lsClient, jmsConnector, owned) {
    this._callSuperConstructor(TopicConnection, [lsClient, jmsConnector, owned]);
  };

  TopicConnection.prototype= {

    /**
     * Creates a {@link TopicSession} object with the specified transaction
     * flag and acknowledge mode.
     *
     * @param {Boolean} transacted flag that specifies if the session is
     * transacted.
     * @param {String} acknowledgeMode specifies the type of acknowledge
     * to be used for messages. Can be <code>"PRE_ACK"</code>, <code>"AUTO_ACK"</code>,
     * <code>"CLIENT_ACK"</code>, <code>"DUPS_OK"</code> or <code>"INDIVIDUAL_ACK"</code>.
     * See JMS Extender documentation for more information.
     * @returns {TopicSession}
     */
    createTopicSession: function(transacted, acknowledgeMode) {
      this.used= true;

      var session= new TopicSession(this, transacted, acknowledgeMode);
      this.sessions.push(session);

      if (this.running)
        session.start();

      return session;
    }
  };

  TopicConnection.prototype["createTopicSession"] = TopicConnection.prototype.createTopicSession;

  Inheritance(TopicConnection, Connection);
  export default TopicConnection;
