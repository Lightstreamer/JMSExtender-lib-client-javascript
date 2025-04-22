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
import IllegalStateException from "./IllegalStateException";
export default (function () {
  function doCall(o, tc, params) {
    if (tc) {
      if (params) {
        return tc.apply(o, params);
      } else {
        return tc.apply(o);
      }
    }
  }
  function searchAlias(proto, extendedName) {
    for (var i in proto) {
      if (proto[extendedName] == proto[i] && extendedName != i) {
        return i;
      }
    }
    return null;
  }
  var Inheritance = {
    Inheritance: function (subClass, superClass, lightExtension, checkAliases) {
      for (var i in superClass.prototype) {
        if (!subClass.prototype[i]) {
          subClass.prototype[i] = superClass.prototype[i];
        } else if (checkAliases) {
          var name = searchAlias(superClass.prototype, i);
          if (name) {
            if (subClass.prototype[name] && subClass.prototype[name] !== subClass.prototype[i]) {
              if (superClass.prototype[name] !== superClass.prototype[name]) {
                throw new IllegalStateException("Can't solve alias collision, try to minify the classes again (" + name + ", " + i + ")");
              }
            }
            subClass.prototype[name] = subClass.prototype[i];
          }
        }
      }
      if (!lightExtension) {
        subClass.prototype["_super_"] = superClass;
        subClass.prototype["_callSuperConstructor"] = Inheritance._callSuperConstructor;
        subClass.prototype["_callSuperMethod"] = Inheritance._callSuperMethod;
      }
      return subClass;
    },
    _callSuperMethod: function (ownerClass, toCall, params) {
      return doCall(this, ownerClass.prototype["_super_"].prototype[toCall], params);
    },
    _callSuperConstructor: function (ownerClass, params) {
      doCall(this, ownerClass.prototype["_super_"], params);
    }
  };
  return Inheritance.Inheritance;
})();
