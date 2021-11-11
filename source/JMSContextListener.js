

  /**
   * This is a dummy constructor not to be used in any case.
   * @constructor
   *
   * @exports JMSContextListener
   * @class Interface to be implemented to listen to JMS context outcome events. Methods of this interface are
   * called during {@link ConnectionFactory.createContext} calls, as the processing of JMS context proceeds.
   * <BR/>Note that it is not necessary to implement all of the interface methods, missing methods
   * will not be called. Note that if the onContextCreated method is not implemented it will
   * not be possible to use the created context in any way.
   */
  var JMSContextListener = function() {
  };

  JMSContextListener.prototype = {
    /**
     * Event that will be invoked when the embedded <code>LightstreamerClient</code> instance has been
     * created and initialized, but before creating the context.
     * 
     * <p>
     * This is the first event to be fired: it offers the possibility to further 
     * customize the {@linkcode EXTERNAL_APIDOC_REFERENCE/LightstreamerClient.html|LightstreamerClient}
     * instance before the connection is issued. It can also be used to attach
     * listeners to the given instance. Note that this method is called synchronously inside the factory methods (i.e.
     * it executes before the create*Context method ends).
     *
     * @param {external:LightstreamerClient} client The client instance that will be used to connect
     * to the JMS Extender.
     */
    onLSClient: function(client) {
      return;
    },

    /**
     * Event handler that is called when the context is created. This method will never
     * be called if a {@link JMSContextListener#onContextFailed} event was fired.
     *
     * @param {JMSContext} context The JMSContext instance representing
     * the current JMS context.
     */
    onContextCreated: function(context) {
      return;
    },

    /**
     * Event handler that is called if the context can't be created.
     * The following error codes are used for specific error conditions on
     * the JMS Extender:<ul>
     * <li>-13: the JMS Extender configured hook denied acces to the
     *     specified user/password pair.
     * </ul>
     * Other possible error codes are the reported in the <code>LightstreamerClient</code>
     * event {@link EXTERNAL_APIDOC_REFERENCE/ClientListener.html#onServerError|ClientListener#onServerError},
     * see for more information.
     * 
     * <p>This method will never be called if a 
     * {@link JMSContextListener#onContextCreated} event was fired.
     *
     * @param {Number} errorCode The code of the error.
     * @param {String} errorMessage The description of the error as sent by the Server.
     *
     */
    onContextFailed: function(errorCode, errorMessage) {
      return;
    }
  };

  export default JMSContextListener;
