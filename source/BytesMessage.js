import Inheritance from "./Inheritance";
import Message from "./Message";
import JMSException from "./JMSException";

  /**
   * This method is not meant to be used directly.
   * Creates a {@link BytesMessage} object that is used to send a message that
   * contains a stream of bytes as its payload.
   * @constructor
   *
//JSDOC_IGNORE_START
   * @param {Session} session specifies the session this message will be
   * sent on.
//JSDOC_IGNORE_END
   *
   * @exports BytesMessage
   * @class A {@link BytesMessage} object is used to send a message that
   * contains a stream of bytes as its payload. When the message is first
   * created, and when clearBody is called, the body of the message is in
   * write-only mode. After the first call to reset has been made, the
   * message body is in read-only mode.
   * @extends Message
   */
  var BytesMessage= function(session) {
    this._callSuperConstructor(BytesMessage, [session, "BYTES_MSG"]);

    this.body= [];
    this.readMode= false;
    this.position= 0;
  };

  BytesMessage.prototype= {

    /**
     * Clears the message body (e.g. the payload). Message properties
     * and specifications remain unaltered.
     */
    clearBody: function() {
      this.body= [];
      this.readMode= false;
      this.position= 0;
    },

    /**
     * Gets the number of bytes of the message body when the message is in read-only
     * mode. The value returned is the entire length of the message body, regardless
     * of where the pointer for reading the message is currently located.
     * @returns {Number}
     */
    getBodyLength: function() {
      if (!this.readMode)
        throw new JMSException("Message is in write-only mode");

      return this.body.length;
    },

    /**
     * Reads a boolean from the bytes message stream.
     * @returns {Boolean}
     */
    readBoolean: function() {
      if (!this.readMode)
        throw new JMSException("Message is in write-only mode");

      if (this.position +1 > this.body.length)
        throw new JMSException("Unexpected end of stream");

      var value= ((this.body[this.position] & 0xff) != 0) ? true : false;
      this.position++;

      return value;
    },

    /**
     * Reads a signed 8-bit value from the bytes message stream.
     * @returns {Number}
     */
    readByte: function() {
      if (!this.readMode)
        throw new JMSException("Message is in write-only mode");

      if (this.position +1 > this.body.length)
        throw new JMSException("Unexpected end of stream");

      var value= (this.body[this.position] & 0xff);
      this.position++;

      return value;
    },

    /**
     * Reads a signed 16-bit number from the bytes message stream.
     * @returns {Number}
     */
    readShort: function() {
      if (!this.readMode)
        throw new JMSException("Message is in write-only mode");

      if (this.position +2 > this.body.length)
        throw new JMSException("Unexpected end of stream");

      var value= (this.body[this.position] & 0xff) << 8;
      value= value | (this.body[this.position +1] & 0xff);
      this.position += 2;

      return value;
    },

    /**
     * Reads a Unicode character value from the bytes message stream.
     * @returns {String}
     */
    readChar: function() {
      if (!this.readMode)
        throw new JMSException("Message is in write-only mode");

      if (this.position +2 > this.body.length)
        throw new JMSException("Unexpected end of stream");

      var value= (this.body[this.position] & 0xff) << 8;
      value= value | (this.body[this.position +1] & 0xff);
      this.position += 2;

      return String.fromCharCode(value);
    },

    /**
     * Reads a signed 32-bit integer from the bytes message stream.
     * @returns {Number}
     */
    readInt: function() {
      if (!this.readMode)
        throw new JMSException("Message is in write-only mode");

      if (this.position +4 > this.body.length)
        throw new JMSException("Unexpected end of stream");

      var value= (this.body[this.position] & 0xff) << 24;
      value= value | (this.body[this.position +1] & 0xff) << 16;
      value= value | (this.body[this.position +2] & 0xff) << 8;
      value= value | (this.body[this.position +3] & 0xff);
      this.position += 4;

      return value;
    },

    /**
     * Reads a string that has been encoded using a modified UTF-8 format
     * from the bytes message stream.
     * @returns {String}
     */
    readUTF: function() {
      if (!this.readMode)
        throw new JMSException("Message is in write-only mode");

      var utf8value= "";
      do {
        var c= this.readByte();
        if (c != 0)
          utf8value += String.fromCharCode(c);
        else
          break;

      } while (true);

      // According to: http://ecmanaut.blogspot.it/2006/07/encoding-decoding-utf8-in-javascript.html
      var value= decodeURIComponent(escape(utf8value));

      return value;
    },

    /**
     * Reads a byte array from the bytes message stream.
     * @returns {Number} the total number of bytes read into the buffer, or -1
     * if there is no more data because the end of the stream has been
     * reached
     */
    readBytes: function(value, length) {
      if (!this.readMode)
        throw new JMSException("Message is in write-only mode");

      if (length == null)
        length= value.length;

      var count= 0;
      do {
        if (this.position >= this.body.length)
          break;

        value[count]= this.body[this.position];

        count++;
        this.position++;

        if (count >= length)
          break;

      } while (true);

      if (count == 0)
        return -1;

      return count;
    },

    /**
     * Puts the message body in read-only mode and repositions the stream
     * of bytes to the beginning.
     */
    reset: function() {
      this.position= 0;
      this.readMode= true;
    },

    /**
     * Writes a boolean to the bytes message stream as a 1-byte value.
     *
     * @param {Boolean} value the boolean value to be written.
     */
    writeBoolean: function(value) {
      if (this.readMode)
        throw new JMSException("Message is in read-only mode");

      this.body.push(value ? 1 : 0);
    },

    /**
     * Writes a byte to the bytes message stream as a 1-byte value.
     *
     * @param {Number} value the byte value to be written.
     */
    writeByte: function(value) {
      if (this.readMode)
        throw new JMSException("Message is in read-only mode");

      this.body.push(value);
    },

    /**
     * Writes a short to the bytes message stream as two bytes, high byte
     * first.
     *
     * @param {Number} value the short value to be written.
     */
    writeShort: function(value) {
      if (this.readMode)
        throw new JMSException("Message is in read-only mode");

      this.body.push((value & 0xff00) >> 8);
      this.body.push(value & 0xff);
    },

    /**
     * Writes a char to the bytes message stream as a 2-byte value, high byte
     * first.
     *
     * @param {String} value the char value to be written.
     */
    writeChar: function(value) {
      if (this.readMode)
        throw new JMSException("Message is in read-only mode");

      this.body.push((value.charCodeAt(0) & 0xff00) >> 8);
      this.body.push(value.charCodeAt(0) & 0xff);
    },

    /**
     * Writes an int to the bytes message stream as four bytes, high byte
     * first.
     *
     * @param {Number} value the int value to be written.
     */
    writeInt: function(value) {
      if (this.readMode)
        throw new JMSException("Message is in read-only mode");

      this.body.push((value & 0xff000000) >> 24);
      this.body.push((value & 0xff0000) >> 16);
      this.body.push((value & 0xff00) >> 8);
      this.body.push(value & 0xff);
    },

    /**
     * Writes a string to the bytes message stream using UTF-8 encoding in
     * a machine-independent manner.
     *
     * @param {String} value the string value to be written.
     */
    writeUTF: function(value) {
      if (this.readMode)
        throw new JMSException("Message is in read-only mode");

      // According to: http://ecmanaut.blogspot.it/2006/07/encoding-decoding-utf8-in-javascript.html
      var utf8value= unescape(encodeURIComponent(value));

      for (var i= 0; i < utf8value.length; i++)
        this.writeByte(value.charCodeAt(i));

      this.writeByte(0);
    },

    /**
     * Writes a byte array to the bytes message stream.
     *
     * @param {Array} value the byte array to be written.
     */
    writeBytes: function(value) {
      if (this.readMode)
        throw new JMSException("Message is in read-only mode");

      for (var i= 0; i < value.length; i++)
        this.writeByte(value[i]);
    }
  };

  BytesMessage.prototype["clearBody"] = BytesMessage.prototype.clearBody;
  BytesMessage.prototype["getBodyLength"] = BytesMessage.prototype.getBodyLength;
  BytesMessage.prototype["readBoolean"] = BytesMessage.prototype.readBoolean;
  BytesMessage.prototype["readByte"] = BytesMessage.prototype.readByte;
  BytesMessage.prototype["readBytes"] = BytesMessage.prototype.readBytes;
  BytesMessage.prototype["readChar"] = BytesMessage.prototype.readChar;
  BytesMessage.prototype["readInt"] = BytesMessage.prototype.readInt;
  BytesMessage.prototype["readShort"] = BytesMessage.prototype.readShort;
  BytesMessage.prototype["readUTF"] = BytesMessage.prototype.readUTF;
  BytesMessage.prototype["reset"] = BytesMessage.prototype.reset;
  BytesMessage.prototype["writeBoolean"] = BytesMessage.prototype.writeBoolean;
  BytesMessage.prototype["writeByte"] = BytesMessage.prototype.writeByte;
  BytesMessage.prototype["writeBytes"] = BytesMessage.prototype.writeBytes;
  BytesMessage.prototype["writeChar"] = BytesMessage.prototype.writeChar;
  BytesMessage.prototype["writeInt"] = BytesMessage.prototype.writeInt;
  BytesMessage.prototype["writeShort"] = BytesMessage.prototype.writeShort;
  BytesMessage.prototype["writeUTF"] = BytesMessage.prototype.writeUTF;

  Inheritance(BytesMessage, Message);
  export default BytesMessage;
