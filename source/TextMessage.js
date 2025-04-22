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
import Message from "./Message";

  /**
   * This method is not meant to be used directly.
   * Creates a {@link TextMessage} object that is used to send a message that
   * contains a string as its payload.
   * @constructor
   *
//JSDOC_IGNORE_START
   * @param {Session} session specifies the session this message will be
   * sent on.
//JSDOC_IGNORE_END
   *
   * @exports TextMessage
   * @class A {@link TextMessage} object is used to send a message that
   * contains a string as its payload.
   * @extends Message
   */
  var TextMessage= function(session) {
    this._callSuperConstructor(TextMessage, [session, "TEXT_MSG"]);
  };

  TextMessage.prototype= {

    /**
     * Sets the string that must be sent as the payload of this message.
     *
     * @param {String} text text to be sent as payload.
     */
    setText: function(text) {
      this.body= text;
    },

    /**
     * Returns the text that will be sent as the payload of this message.
     * @returns {String}
     */
    getText: function() {
      return this.body;
    }
  };

  TextMessage.prototype["getText"] = TextMessage.prototype.getText;
  TextMessage.prototype["setText"] = TextMessage.prototype.setText;

  Inheritance(TextMessage, Message);
  export default TextMessage;
