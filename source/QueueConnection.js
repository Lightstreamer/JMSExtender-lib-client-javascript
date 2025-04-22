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
import Inheritance from "./Inheritance";
import Connection from "./Connection";
import QueueSession from "./QueueSession";

  /**
   * This method is not meant to be used directly.
   * Creates a {@link QueueConnection} object that wraps an underlying
   * {@link EXTERNAL_APIDOC_REFERENCE/LightstreamerClient.html|LightstreamerClient}
   * object into a JMS Extender compatible queue connection.
   * @constructor
   *
//JSDOC_IGNORE_START
   * @param {LightstreamerClient} lsClient instance of LightstreamerClient
   * to be wrapped into a JMS Extender queue connection.
   * @param {String} jmsConnector name of the JMS Connector, as
   * configured on the JMS Extender. Each connector can connect to
   * a different JMS broker.
   * @param {Boolean} owned if the lsClient is owned by the connection, that is:
   * if the lsClient should disconnect when the connection is closed
//JSDOC_IGNORE_END
   *
   * @exports QueueConnection
   * @class Class that wraps an underlying {@link external:LightstreamerClient}
   * object into a JMS Extender compatible queue connection.
   * @extends Connection
   */
  var QueueConnection= function(lsClient, jmsConnector, owned) {
    this._callSuperConstructor(QueueConnection, [lsClient, jmsConnector, owned]);
  };

  QueueConnection.prototype= {

    /**
     * Creates a {@link QueueSession} object with the specified transaction
     * flag and acknowledge mode.
     *
     * @param {Boolean} transacted flag that specifies if the session is
     * transacted.
     * @param {String} acknowledgeMode specifies the type of acknowledge
     * to be used for messages. Can be <code>"PRE_ACK"</code>, <code>"AUTO_ACK"</code>,
     * <code>"CLIENT_ACK"</code>, <code>"DUPS_OK"</code> or <code>"INDIVIDUAL_ACK"</code>.
     * See JMS Extender documentation for more information.
     * @returns {QueueSession}
     */
    createQueueSession: function(transacted, acknowledgeMode) {
      this.used= true;

      var session= new QueueSession(this, transacted, acknowledgeMode);
      this.sessions.push(session);

      if (this.running)
        session.start();

      return session;
    }
  };

  QueueConnection.prototype["createQueueSession"] = QueueConnection.prototype.createQueueSession;

  Inheritance(QueueConnection, Connection);
  export default QueueConnection;
