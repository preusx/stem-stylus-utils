/**
 * String functions
 * ======================================================================== */

var plugin = function(style){

  style.define('split', function(what, by) {
    var splitter = new RegExp('\\s*' + by.string + '\\s*', 'igm');

    return what.string.split(splitter);
  });


  /**
   * RegExp functions
   * ======================================================================== */

  style.define('reg_replace', function(what, expression, by) {
    var regExp = new RegExp(expression.string, 'igm');

    return what.string.replace(regExp, by.string);
  });


  /**
   * Byte operator functions
   * ======================================================================== */

  style.define('byte_or', function(first, second) {
    return first.val | second.val;
  });


  style.define('byte_and', function(first, second) {
    return first.val & second.val;
  });


  /**
   * Math functions
   * ======================================================================== */

  var gcd = function(a, b) {
    return b ? gcd(b, a % b) : a;
  };

  var lcm = function(a, b) {
    var divider = gcd(a, b);

    return Math.abs(a * b) / (divider ? divider : 0);
  };

  style.define('math_gcd', function(first, second) {
    return gcd(first.val, second.val);
  });

  style.define('math_nod', function(first, second) {
    return gcd(first.val, second.val);
  });

  style.define('math_lcm', function(first, second) {
    return lcm(first.val, second.val);
  });

  style.define('math_nok', function(first, second) {
    return lcm(first.val, second.val);
  });

  style.define('math_simple_fraction', function(decimal) {
    var denominator = 10000;
    var numerator = Math.round(decimal.val * denominator);
    var _gcd = gcd(numerator, denominator);

    return [numerator / _gcd, denominator / _gcd];
  });
};


module.exports = {
  plugin: plugin,
}