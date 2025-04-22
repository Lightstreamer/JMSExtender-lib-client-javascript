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
   * Creates a {@link CompletionListener} object used to receive notifications
   * on messages sent asynchronously.
   * @constructor
   *
   * @exports CompletionListener
   * @class Interface used to receive notifications on messages sent
   * asynchronously.
   */
  var CompletionListener= function() {
  };

  CompletionListener.prototype= {

    /**
     * Notifies the application that the message has been successfully sent.
     *
     * @param {Message} message the message that was sent.
     */
    onCompletion: function(message) {},

    /**
     * Notifies that the specified exception was thrown while attempting to
     * send the specified message. If an exception occurs it is undefined
     * whether or not the message was successfully sent.
     *
     * @param {Message} message the message that was sent.
     * @param {Exception} exception the exception
     */
    onException: function(message, exception) {}
  };

  export default CompletionListener;
