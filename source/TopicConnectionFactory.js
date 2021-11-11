import TopicConnection from "./TopicConnection";
import CustomConnectionFactory from "./CustomConnectionFactory";
import ConnectionFactory from "./ConnectionFactory";

  /**
   * This method is not meant to be used directly.
   * Creates a {@link TopicConnectionFactory} object that can create new {@link TopicConnection}
   * objects.
   * @constructor
   *
   * @exports TopicConnectionFactory
   * @class A {@link TopicConnectionFactory} object can be used used to create a connection
   * with a JMS broker through an embedded JMS Extender connection.
   * @extends ConnectionFactory
   */
  var TopicConnectionFactory= function() {
  };

  /**
   * Creates a new {@link TopicConnection}. If a userName is specified, the connection is
   * created with the specified user identity. The connection is created in
   * stopped mode. No messages will be delivered until the {@link TopicConnection#start}
   * method is explicitly called on the {@link TopicConnection} object.
   * <BR/><B>Implementation note</B>: due to limitations of Javascript this
   * method can't return a connection synchronously, the connection will be
   * delivered asynchronously through the specified callback.
   * @returns {TopicConnection}
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
  TopicConnectionFactory.createTopicConnection= function(serverAddress, jmsConnector, userName, password, connListener) {
    return CustomConnectionFactory.createConnection(TopicConnection, serverAddress, jmsConnector, userName, password, connListener);
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
  TopicConnectionFactory.createContext= function(serverAddress, jmsConnector, userName, password, sessionMode, contextListener) {
    return ConnectionFactory.createContext(serverAddress, jmsConnector, userName, password, sessionMode, contextListener);
  };

  TopicConnectionFactory["createTopicConnection"] = TopicConnectionFactory.createTopicConnection;
  TopicConnectionFactory["createContext"] = TopicConnectionFactory.createContext;

  export default TopicConnectionFactory;
