var assert = require("assert")
var funcs = require('../functions')
describe('Functions', function(){
  describe('#check_string_length()', function(){
    it('should return false when the value length is not between 1 and 30', function(){
      assert.equal(false, funcs.check_string_length("", 30), 'should be false');
      assert.equal(false, funcs.check_string_length("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", 30), 'should be false');
      assert.equal(true, funcs.check_string_length("aaa", 30), 'should be true');
    })
  })
  describe('#check_string_chars()', function(){
    it('should return false when the value length is not between 1 and 30', function(){
      assert.equal(true, funcs.check_string_chars(""), 'should be true');
      assert.equal(false, funcs.check_string_chars("asda!$&"), 'should be false');
      assert.equal(true, funcs.check_string_chars("monnijee"), 'should be true');
    })
  })
})