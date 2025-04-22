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
   * This method is not meant to be used directly.
   * Creates a {@link Destination} object that holds the name and type
   * of JMS destination, e.g. a topic or queue.
   * @constructor
   *
//JSDOC_IGNORE_START
   * @param {String} destinationType specifies the type of destination. It
   * can either be <code>"TOPIC"</code> or <code>"QUEUE"</code>.
   * @param {String} destinationName name of the topic or queue referenced
   * by this destination.
//JSDOC_IGNORE_END
   *
   * @exports Destination
   * @class Class that holds the name and type of JMS
   * destination, e.g. a topic or queue.
   */
  var Destination= function(destinationType, destinationName) {
    this.destinationType= destinationType;
    this.destinationName= destinationName;
  };

  export default Destination;
