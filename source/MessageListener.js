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
   * Creates a {@link MessageListener} object used to receive asynchronously
   * delivered messages.
   * @constructor
   *
   * @exports MessageListener
   * @class Interface used to receive asynchronously delivered
   * messages.
   */
  var MessageListener= function() {
  };

  MessageListener.prototype= {

    /**
     * Passes a {@link Message} to the listener.
     *
     * @param {Message} message passed to the listener.
     */
    onMessage: function(message) {}
  };

  export default MessageListener;
