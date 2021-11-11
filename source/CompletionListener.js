

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
