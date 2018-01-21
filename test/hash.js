/**
 * Test Debug
 */
"use strict";

const log = console.log.bind(console);
const assert = require('assert');
const ts = require('../index.js');

const name = 'abv:test';

const _s1 = 'string1';
const _s2 = 'string2';

describe('Hashes', function() {
	describe('djb2()', function() {
		const ts1 = ts(name);
		it('djb2("")', function() {
			let r = ts1.djb2('');
			assert.equal(r, 5381, 'return> 5381');
	  	});
		it('djb2("Hash")', function() {
			let r = ts1.djb2('Hash');
			assert.equal(r, 2089170601, 'return> 2089170601');
	  	});
		it('djb2("This is a test!")', function() {
			let r = ts1.djb2("This is a test!");
			assert.equal(r, 2011862043, 'return> 2011862043');
	  	});
	});

	describe('rand()', function() {
		const ts1 = ts(name);
		it('random string', function() {
			let s1 = ts1.rand();
			let s2 = ts1.rand();
			let r = s1 !== s2;
			assert.equal(r, true, 'return> true');
	  	});
	});


});
