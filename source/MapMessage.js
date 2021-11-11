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
