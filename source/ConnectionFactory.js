import Connection from "./Connection";
import CustomConnectionFactory from "./CustomConnectionFactory";
import JMSContext from "./JMSContext";

  /**
   * This method is not meant to be used directly.
   * Creates a {@link ConnectionFactory} object that can create new {@link Connection}
   * objects.
   * @constructor
   *
   * @exports ConnectionFactory
   * @class A {@link ConnectionFactory} object can be used used to create a connection
   * with a JMS broker through an embedded JMS Extender client connection.
   */
  var ConnectionFactory = function(lsClient, jmsConnector) {
  };

  /**
   * Creates a new {@link Connection}. If a userName is specified, the connection is
   * created with the specified user identity. The connection is created in
   * stopped mode. No messages will be delivered until the {@link Connection#start}
   * method is explicitly called on the {@link Connection} object.
   * <BR/><B>Implementation note</B>: due to limitations of JavaScript this
   * method can't return a connection synchronously: the connection will be
   * delivered asynchronously through the
   * {@link ConnectionListener#onConnectionCreated} event.
   * @returns {Connection}
   *
   * @param {String} serverAddress the full address of the JMS Extender.
   * @param {String} jmsConnector the name of the JMS Connector.
   * @param {String} userName the optional username to be used for the
   * authentication on the JMS Extender.
   * @param {String} password the optional password to be used for the
   * authentication on the JMS Extender.
   * @param {ConnectionListener} listener the listener that will receive the events related
   * to the connection creation.
   */
  ConnectionFactory.createConnection= function(serverAddress, jmsConnector, userName, password, listener) {
    return CustomConnectionFactory.createConnection(Connection, serverAddress, jmsConnector, userName, password, listener);
  };

  /**
   * Creates a new {@link JMSContext}. If a userName is specified, the context is
   * created with the specified user identity.
   * <BR/><B>Implementation note</B>: due to limitations of JavaScript this
   * method can't return a context synchronously: the context will be
   * delivered asynchronously through the
   * {@link JMSContextListener#onContextCreated} event.
   * @returns {JMSContext}
   *
   * @param {String} serverAddress the full address of the JMS Extender.
   * @param {String} jmsConnector the name of the JMS Connector.
   * @param {String} userName the optional username to be used for the
   * authentication on the JMS Extender.
   * @param {String} password the optional password to be used for the
   * authentication on the JMS Extender.
   * @param {String} sessionMode the session mode to be used for the context.
   * @param {JMSContextListener} listener the listener that will receive the events related
   * to the context creation.
   */
  ConnectionFactory.createContext= function(serverAddress, jmsConnector, userName, password, sessionMode, contextListener) {
    return CustomConnectionFactory.createConnection(Connection, serverAddress, jmsConnector, userName, password, {
      "onLSClient": function(client) {
        if (contextListener.onLSClient != null) {

          // Pass the client to the context listener
          contextListener.onLSClient(client);
        }
      },

      "onConnectionCreated": function(connection) {

        // Create the session and the context
        var session= connection.createSession(sessionMode);
        var context= new JMSContext(connection, session);

        if (contextListener['onContextCreated'] != null) {

          // Pass the context to the context listener
          contextListener['onContextCreated'](context);
        }
      },

      "onConnectionFailed": function(errorCode, errorMessage) {
        if (contextListener['onContextCreated']!= null) {

          // Pass the error to the context listener
          contextListener['onContextCreated'](errorCode, errorMessage);
        }
      }
    });
  }

  ConnectionFactory["createConnection"] = ConnectionFactory.createConnection;
  ConnectionFactory["createContext"] = ConnectionFactory.createContext;

  export default ConnectionFactory;
