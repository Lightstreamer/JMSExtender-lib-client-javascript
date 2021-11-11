

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
