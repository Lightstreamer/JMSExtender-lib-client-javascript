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
   * Creates a {@link MapMessage} object that is used to send a message that
   * contains a set of key-value pairs as its payload.
   * @constructor
   *
//JSDOC_IGNORE_START
   * @param {Session} session specifies the session this message will be
   * sent on.
//JSDOC_IGNORE_END
   *
   * @exports MapMessage
   * @class A {@link MapMessage} object is used to send a message that
   * contains a set of key-value pairs as its payload.
   * @extends Message
   */
  var MapMessage= function(session) {
    this._callSuperConstructor(MapMessage, [session, "MAP_MSG"]);

    this.body= {};
  };

  MapMessage.prototype= {

    /**
     * Sets the value of the specified key name into the message.
     * <BR/>Note that values must be one of recognized Java
     * primitives, e.g. integer, double, string, etc. Use of a custom
     * object may raise an exception on the JMS Extender and cause the
     * message to be lost.
     *
     * @param {String} name key name of the key-value pair.
     * @param {Object} value value of the key-value pair.
     */
    setObject: function(name, value) {
      this.body[name]= value;
    },

    /**
     * Returns the value of the specified key name.
     * @returns {Object}
     */
    getObject: function(name) {
      return this.body[name];
    },

//JSDOC_IGNORE_START
    clearBody: function() {
      this.body= {};
    }
//JSDOC_IGNORE_END
  };

  MapMessage.prototype["getObject"] = MapMessage.prototype.getObject;
  MapMessage.prototype["setObject"] = MapMessage.prototype.setObject;
  MapMessage.prototype["clearBody"] = MapMessage.prototype.clearBody;

  Inheritance(MapMessage, Message);
  export default MapMessage;
