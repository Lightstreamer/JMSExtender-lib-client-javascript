
  
  var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  
  /**
   * @extends DataConverter
   * @ignore
   */
  var IntArrayConverter = function() {
    this.buffer = [];
  };
  
  /**
   * adapted from https://raw.github.com/kvz/phpjs/master/functions/url/base64_encode.js
   */
  IntArrayConverter.toBase64 = function(dataToConvert) {
    var o1, o2, o3, h1, h2, h3, h4, bits;
    var res = [];

    if (!dataToConvert) {
      return "";
    }

    var i = 0;
    do { // pack three octets into four hexets
        o1 = dataToConvert[i++];
        o2 = dataToConvert[i++];
        o3 = dataToConvert[i++];

        bits = o1 << 16 | o2 << 8 | o3;

        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;

        // use hexets to index into b64, and append result to encoded string
        res.push(b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4));
        
    } while (i < dataToConvert.length);

    var enc = res.join("");
    
    var r = dataToConvert.length % 3;
    
    return (r ? enc.slice(0, r - 3) : enc) + "===".slice(r || 3);
  };
  
  /**
   * adapted from https://raw.github.com/kvz/phpjs/master/functions/url/base64_decode.js
   */
  IntArrayConverter.fromBase64 = function(dataToConvert) {

      var o1, o2, o3, h1, h2, h3, h4, bits;
      
      var res = [];

      if (!dataToConvert) {
        return [];
      }

      dataToConvert += "";

      var i = 0;
      do { // unpack four hexets into three octets using index points in b64
        h1 = b64.indexOf(dataToConvert.charAt(i++));
        h2 = b64.indexOf(dataToConvert.charAt(i++));
        h3 = b64.indexOf(dataToConvert.charAt(i++));
        h4 = b64.indexOf(dataToConvert.charAt(i++));

        bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

        o1 = bits >> 16 & 0xff;
        o2 = bits >> 8 & 0xff;
        o3 = bits & 0xff;
        
        if (h3 == 64) {
          res.push(o1);
        } else if (h4 == 64) {
          res.push(o1);
          res.push(o2);
        } else {
          res.push(o1);
          res.push(o2);
          res.push(o3);
        }
      } while (i < dataToConvert.length);

      return res;
  };
  
  
  IntArrayConverter.prototype = {
      
      decodeBase64AndStore: function(base64Data) {
        var newData = IntArrayConverter.fromBase64(base64Data);
        this.buffer = this.buffer.concat(newData);
      },
      
      getBytes: function(howMany) {
        howMany = howMany || this.buffer.length;
        howMany = howMany > this.buffer.length ? this.buffer.length : howMany;
        
        return this.buffer.splice(0,howMany);
      },
      
      getLength: function() {
        return this.buffer.length; 
      }
      
  };
  
  export default IntArrayConverter;
