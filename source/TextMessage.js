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
