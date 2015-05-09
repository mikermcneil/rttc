/**
 * Module dependencies
 */

var util = require('util');
var _ = require('lodash');
var rttc = require('../../');



module.exports = function testCoercion(expectations, cb){


  // Determine type schema of the value.
  // (using inference to pull it from the `example`, if provided)
  var typeSchema;
  if (!_.isUndefined(expectations.type)) {
    typeSchema = expectations.type;
  }
  else {
    typeSchema = rttc.infer(expectations.example);
  }


  // Now validate and/or coerce the actual value against the type schema.
  var actualResult;
  var gotError;
  try {
    actualResult = rttc.coerce(typeSchema, expectations.actual);
  }
  catch (e) {
    gotError = e;
  }



  // Finally, make sure the right thing happened and that we
  // got the appropriate result.
  //
  //
  // Ensure that if we got an error, we were expecting it.
  if (gotError){
    if (expectations.error) {return cb();}
    return cb(new Error('did not expect error, but got one:\n' + util.inspect(gotError)));
  }
  // Handle case where we were expecting an error, but we didn't get one.
  if (expectations.error) {
    return cb(new Error('expected a error, but did not get one. Instead, returned '+util.inspect(actualResult, false, null)+'.'));
  }

  // Ensure that the actual result matches the test's expectations.
  if (_.isEqual(actualResult, expectations.result)) {
    return cb();
  }
  return cb(new Error('returned incorrect value: '+util.inspect(actualResult, false, null)));

};
