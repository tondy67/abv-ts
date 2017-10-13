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
const _u8 = new Uint8Array([0,1,2,3]);
const _buf = _u8.buffer;

const _a1 = [_s1,_s2];
const _a2 = [_u8,_u8];
const _a3 = [_s1,_u8];

class Ia
{
	constructor()
	{
		this.iaa = 1;
		this.ccc = 1;
		this.bbb = 1;
	}

	print(){}	
	show(){}	
}
class Ib
{
	constructor()
	{
		this.ibb = 1;
	}
	echo(){}
}

class A
{
	constructor()
	{
		this.aaa = 1;
	}

	echo(){}
//	print(){}
}

class B
{
	constructor()
	{
		this.iaa = 1;
		this.ccc = 1;
		this.bbb = 1;
		this.ibb = 1;
	}

	echo(){}
	print(){}
	calc(){}
	show(){}	
}

describe('Typechecks', function() {
	describe('ts.params()', function() {
		const ts1 = ts(name);
		it('string == String', function() {
			ts1.set({level:'debug'});
			let r = ts1.params(100,_s1,String, new String(_s1),String);
			assert.equal(r, true, 'return> true');
	  	});
		it('buf == ArrayBuffer', function() {
			ts1.set({level:'debug'});
			let r = ts1.params(104,_buf,ArrayBuffer);
			assert.equal(r, true, 'return> true');
	  	});
		it('string == String, buf != String', function() {
			ts1.set({level:'debug'});
			let r = ts1.params(108,_s1,String, _buf,String);
			assert.equal(r, false, 'return> false');
	  	});
		it('true == Boolean', function() {
			ts1.set({level:'debug'});
			let r = ts1.params(112,true,Boolean, new Boolean(true),Boolean);
			assert.equal(r, true, 'return> true');
	  	});
		it('123 == Number, "123" != Number', function() {
			ts1.set({level:'debug'});
			let r = ts1.params(116,123,Number, "123", Number);
			assert.equal(r, false, 'return> false');
	  	});
		it('[str,str] == [String]', function() {
			ts1.set({level:'debug'});
			let r = ts1.params(120,_a1,[String]);
			assert.equal(r, true, 'return> true');
	  	});
		it('[u8,u8] == [Uint8Array]', function() {
			let r = ts1.params(124,_a2,[Uint8Array]);
			assert.equal(r, true, 'return> true');
	  	});
		it('[str,u8] != [String]', function() {
			ts1.set({level:'debug'});
			let r = ts1.params(128,_a3,[String]);
			assert.equal(r, false, 'return> false');
	  	});
	});

	describe('ts.implements()', function() {
		const ts1 = ts(name);
		it('class A not implements Ia', function() {
			ts1.set({level:'debug'});
			let r = ts1.implements(110,A,Ia);
			assert.equal(r, false, 'return> false');
	  	});
		it('class B implements Ia, Ib', function() {
			ts1.set({level:'debug'});
			let r = ts1.implements(115,B,Ia,Ib);
			assert.equal(r, true, 'return> true');
	  	});
	});


});
