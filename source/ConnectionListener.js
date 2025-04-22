/*
 * Copyright (C) 2013 Lightstreamer Srl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


  /**
   * This is a dummy constructor not to be used in any case.
   * @constructor
   *
   * @exports ConnectionListener
   * @class Interface to be implemented to listen to JMS connection outcome events. Methods of this interface are
   * called during {@link ConnectionFactory.createConnection}, {@link QueueConnectionFactory.createQueueConnection}
   * and {@link TopicConnectionFactory.createTopicConnection} calls, as the processing of JMS connection proceeds.
   * <BR/>Note that it is not necessary to implement all of the interface methods, missing methods
   * will not be called. Note that if the onConnectionCreated method is not implemented it will
   * not be possible to use the created connection in any way.
   */
  var ConnectionListener = function() {
  };

  ConnectionListener.prototype = {
    /**
     * Event that will be invoked when the embedded <code>LightstreamerClient</code>
     * instance has been created and initialized, but before opening the connection. This is the first event to be
     * fired: it offers the possibility to further customize the <code>LightstreamerClient</code>
     * instance before the connection is issued. It can also be used to attach listeners to the given instance.
     * Note that this method is called synchronously inside the factory methods (i.e.
     * it executes before the create*Connection method ends).
     *
     * @param {external:LightstreamerClient} client The client instance that will be used to connect
     * to the JMS Extender.
     */
    onLSClient: function(client) {
      return;
    },

    /**
     * Event handler that is called when the connection is created. This method will never
     * be called if a {@link ConnectionListener#onConnectionFailed} event was fired.
     *
     * @param {Connection} connection The Connection instance representing
     * the current JMS connection.
     */
    onConnectionCreated: function(connection) {
      return;
    },

    /**
     * Event handler that is called if the connection can't be created.
     * The following error codes are used for specific error conditions on
     * the JMS Extender:<ul>
     * <li>-13: the JMS Extender configured hook denied access to the
     *     specified user/password pair.
     * </ul>
     * Other possible error codes are the reported in the event 
     * {@link EXTERNAL_APIDOC_REFERENCE/ClientListener.html| ClientListener#onServerError}, see for more information.
     * <BR/>This method will never be called if a {@link ConnectionListener#onConnectionCreated}
     * event was fired.
     *
     * @param {Number} errorCode The code of the error.
     * @param {String} errorMessage The description of the error as sent by the Server.
     *
     */
    onConnectionFailed: function(errorCode, errorMessage) {
      return;
    }
  };

  export default ConnectionListener;
