/**
 * Test Debug
 */
"use strict";

const log = console.log.bind(console);
const assert = require('assert');
const ts = require('../index.js');

const name = 'abv:test';

const _debug = 'abv:test: errorabv:test: warnabv:test: log' +
	'abv:test: infoabv:test: debug';
const _info = 'abv:test: errorabv:test: warnabv:test: logabv:test: info';
const _log = 'abv:test: errorabv:test: warnabv:test: log';
const _warn = 'abv:test: errorabv:test: warn';
const _error = 'abv:test: error';
const _no = '';
const _error_c = '%c abv:test %c error';
const _error_con = "\x1b[41m" + "\x1b[37m" + "\x1b[1m" + ' abv:test ' + 
	"\x1b[0m" + ' ' + "\x1b[31m" + 'error' + "\x1b[0m";

describe('Debug: ts.debug()', function() {
	const ts1 = ts(name);
	ts1.set({level:'debug',test:true,browser:true,time:false,color:false});
	describe('print log levels', function() {
		it('debug', function() {
			let r = ts1.error('error') + ts1.warn('warn') + ts1.log('log') + 
				ts1.info('info') + ts1.debug('debug');
			assert.equal(r, _debug, 'print> ' + _debug);
	  	});
		it('info', function() {
			ts1.set({level:'info'});
			let r = ts1.error('error') + ts1.warn('warn') + ts1.log('log') + 
				ts1.info('info') + ts1.debug('debug');
			assert.equal(r, _info, 'print> ' + _info);
	  	});
		it('log', function() {
			ts1.set({level:'log'});
			let r = ts1.error('error') + ts1.warn('warn') + ts1.log('log') + 
				ts1.info('info') + ts1.debug('debug');
			assert.equal(r, _log, 'print> ' + _log);
	  	});
		it('warn', function() {
			ts1.set({level:'warn'});
			let r = ts1.error('error') + ts1.warn('warn') + ts1.log('log') + 
				ts1.info('info') + ts1.debug('debug');
			assert.equal(r, _warn, 'print> ' + _warn);
	  	});
		it('error', function() {
			ts1.set({level:'error'});
			let r = ts1.error('error') + ts1.warn('warn') + ts1.log('log') + 
				ts1.info('info') + ts1.debug('debug');
			assert.equal(r, _error, 'print> ' + _error);
	  	});
		it('no', function() {
			ts1.set({level:'no'});
			let r = ts1.error('error') + ts1.warn('warn') + ts1.log('log') + 
				ts1.info('info') + ts1.debug('debug');
			assert.equal(r, _no, 'print> ' + _no);
	  	});
	});

	describe('colors', function() {
		it('no color', function() {
			ts1.set({level:'error'});
			let r = ts1.error('error');
			assert.equal(r, _error, 'print> ' + _error);
	  	});
		it('with color', function() {
			ts1.set({level:'error',color:true});
			let r = ts1.error('error');
			assert.equal(r, _error_c, 'print> ' + _error_c);
	  	});
	});

	describe('environment', function() {
		it('browser', function() {
			ts1.set({level:'error',color:true,browser:true});
			let r = ts1.error('error');
			assert.equal(r, _error_c, 'print> ' + _error_c);
	  	});
		it('node.js', function() {
			ts1.set({level:'error',color:true,browser:false});
			let r = ts1.error('error');
			assert.equal(r, _error_con, 'print> ' + _error_con);
	  	});
	});

});

