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
   * Creates an {@link ExceptionListener} object used to receive asynchronously
   * delivered exceptions.
   * @constructor
   *
   * @exports ExceptionListener
   * @class Interface used to receive asynchronously delivered exceptions.
   * JMS exceptions may be due to a number of different reasons and/or
   * caused by different APIs:<ul>
   * <li>connection exceptions caused by timeouts while communicating with
   *     the JMS broker;
   * <li>argument exceptions caused by passing invalid arguments or
   *     specifying inexistent destination names;
   * <li>authorization exceptions thrown by a server-side hook;
   * <li>etc.
   * </ul>
   * See {@link JMSException#getErrorCode} for a list on known exception
   * error codes.
   */
  var ExceptionListener= function() {
  };

  ExceptionListener.prototype= {

    /**
     * Notifies user of a {@link JMSException}. Exceptions may be due to a
     * number of different reasons and/or caused by different APIs. See
     * {@link JMSException#getErrorCode} for a list of known exception
     * error codes.
     *
     * @param {JMSException} exception notified to the listener.
     */
    onException: function(exception) {}
  };

  export default ExceptionListener;
