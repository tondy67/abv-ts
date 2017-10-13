/**
 * Abvos Debug
 */
"use strict";

// export DEBUG=abv:*,info / unset DEBUG
// localStorage.debug = 'abv:*';

const log = console.log.bind(console);

const $isBrowser = typeof window !== "undefined" && window;
const $isInspector = $isBrowser ? false : process.execArgv.indexOf('--inspect') !== -1;

const $no 		= 'no';
const $error 	= 'error';
const $warn 	= 'warn';
const $log 		= 'log'; 
const $info 	= 'info'; 
const $debug 	= 'debug';

const $levels 	= [$no, $error, $warn, $log, $info, $debug];

const $red 		= 'red';
const $blue 	= 'blue';
const $green 	= 'green';
const $yellow 	= 'yellow';
const $orange 	= 'orange';
const $magenta	= 'magenta';
const $cyan		= 'cyan';
const $gray		= 'gray';

const $colors 	= [$red, $blue, $green, $orange, $magenta, $cyan, $gray];

const Reset 	= "\x1b[0m"; 
const Bold  	= "\x1b[1m"; 
const Dim 		= "\x1b[2m"; 
const Underline	= "\x1b[4m"; 
const Blink 	= "\x1b[5m"; 
const Reverse 	= "\x1b[7m"; 
const Hidden 	= "\x1b[8m"; 
const FgBlack 	= "\x1b[30m"; 
const FgRed 	= "\x1b[31m"; 
const FgGreen 	= "\x1b[32m"; 
const FgYellow 	= "\x1b[33m"; 
const FgBlue 	= "\x1b[34m"; 
const FgMagenta = "\x1b[35m"; 
const FgCyan 	= "\x1b[36m"; 
const FgWhite 	= "\x1b[37m"; 
const BgBlack 	= "\x1b[40m"; 
const BgRed 	= "\x1b[41m"; 
const BgGreen 	= "\x1b[42m"; 
const BgYellow 	= "\x1b[43m"; 
const BgBlue 	= "\x1b[44m"; 
const BgMagenta = "\x1b[45m"; 
const BgCyan 	= "\x1b[46m"; 
const BgWhite 	= "\x1b[47m";

let $instances = 0|0;

const $intersec = (arr) => {
		return arr.reduce((prev, cur) => {
			const s = new Set(cur);
			return prev.filter((el) => s.has(el));
	 	});
	};
	
const $union = (arr) => {
		const r = arr.reduce((a, b) => a.concat(b), []);
		return Array.from(new Set(r));
	};
	
const $diff = (arr) => {
		const s = new Set($intersec(arr));
		const u = $union(arr);
		return u.filter((el) => !s.has(el));
	};
	
const $clr2c = (c, bg=false) => {
		let r = c;
		if ($isBrowser || $isInspector) return r;

		if (c === $red) 		r = bg ? BgRed:FgRed;
		else if (c === $blue) 	r = bg ? BgBlue:FgBlue;
		else if (c === $green) 	r = bg ? BgGreen:FgGreen;
		else if (c === $orange) r = bg ? BgYellow:FgYellow;
		else if (c === $yellow) r = bg ? BgYellow:FgYellow;
		else if (c === $magenta)r = bg ? BgMagenta:FgMagenta;
		else if (c === $cyan) 	r = bg ? BgCyan:FgCyan;
		else if (c === $gray) 	r = bg ? BgWhite:Dim;
		
		return r;
	};
	
const $toString = (obj) => {
		let r = "[object]";
		try{ r = JSON.stringify(obj); }catch(e){}
		return r;
	};

const $fromString = (s) => {
		let r = {};
		try{ r = JSON.parse(s); }catch(e){}
		return r;
	};

const $ab2str = (buf) => { 
		let r = "-1";
		try{ 
			const dv = new DataView(buf);
			const len = buf.byteLength / 2;
			const u16 = new Uint16Array(len);
			for (let i=0; i<len; i++) {
				u16[i] = dv.getUint16(i*2);
			}
			r = String.fromCharCode.apply(null, u16); 
		}catch(e){}
		return r;
	};

const $str2ab = (str) => {
		if (!$is(str,String)) str = "-1";
		const buf = new ArrayBuffer(str.length*2);
		const dv = new DataView(buf);
		for (let i=0, len=str.length; i<len; i++) {
			dv.setUint16(i*2,str.charCodeAt(i));
		}
		return buf;
	};

const $out = (str, name, color, bg, dt) => {
		let s = '';
		const time = $opt.time ? ' +' + dt : '';

		if (!$opt.color){
			s = name + ': ' + str + time;
			if (!$opt.test) log(s);
		}else if ($isBrowser || $isInspector || $opt.browser){
			s = '%c ' + name + ' %c ' + str + time;
			if (!$opt.test) log(s,'background: ' + $clr2c(bg,true) +
				'; color: white', 'color: ' + $clr2c(color));
		}else{
			s = $clr2c(bg,true) + FgWhite + Bold + ' ' + name + ' ' +  
				Reset + ' ' + $clr2c(color) + str + time + Reset;

			if (!$opt.test) log(s);
		}
		return s;
	};
	
const $is = (arg,type) => {
		let r = false;
		if ((typeof arg === 'undefined') || !type) return r;
		
		if (type === String){
			r = typeof arg === 'string' || arg instanceof String;
		}else if (type === ArrayBuffer){
			r = arg instanceof ArrayBuffer;
		}else if (type === Buffer){
			r = arg instanceof Buffer;
		}else if (type instanceof Array){
			if (type.length !== 1){
			}else if (arg instanceof Array){
				let c = true;
				for(let i=0,len=arg.length;i<len;i++){
					if (!$is(arg[i],type[0])){
						c = false;
						break;
					}
				}
				if (c) r = true;
			}			
		}else if (type === 'Int'){
			r = Number.isInteger(arg);
		}else if (type === 'Float'){
			r = Number.isFinite(arg) && !Number.isInteger(arg);
		}else if (type === Number){
			r = typeof arg === 'number';
		}else if (type === Boolean){
			r = typeof arg === 'boolean' || arg instanceof Boolean;
		}else{
			r = arg instanceof type;
		}
		return r;	
	};

const $params = (args) => {
		let r = '';
		const a = [];
		for (let i=1,len = args.length;i<len;i+=2){
			if (!$is(args[i],args[i+1])){
				a.push('arg' + Math.round(i/2));
			}
		}
		if (a.length > 0) r = args[0] + ' TypeError: ' + a.join(', ');
		return r;
	};

const $implements = (args) => { // TODO: long story..
		let r = '';
		const a = [];
		const ft = 'function';
		const cls = typeof args[1] === ft ? new args[1](): args[1];
		const cm = Object.getOwnPropertyNames(Object.getPrototypeOf(cls));
		const cp = Array.from(Object.keys(cls));
		const cn = ' ' + cls.constructor.name + '{}';
		let it, im, ip, d, n;
		for (let i=2,len=args.length;i<len;i++){
			it = typeof args[i] === ft ? new args[i](): args[i];
			n = it.constructor.name;
			im = Object.getOwnPropertyNames(Object.getPrototypeOf(it));
			ip = Array.from(Object.keys(it));
			d = $intersec([cp,ip]); 
			d = $diff([d,ip]);
			if (d.length > 0) a.push(n + '{' + d + '}');
			d = $intersec([cm,im]); 
			d = $diff([d,im]);
			if (d.length > 0) a.push(n + '(' + d + ')');
		}
		if (a.length > 0) r = args[0] + cn + ' missing: ' + a.join(', ');
		
		return r;	
	};

const $trim = (a) => { 
		for (let i=0,len=a.length;i<len;i++) a[i] = a[i].trim(); 
	};
	
const $parseOpt = (opt) => {
		const r = {};
		if (!opt) opt = '';
		let t = [];
		try { t = opt.split(','); $trim(t); }catch(e){}
		let n = t[0] ? t[0] : '';
		const l = t[1] ? t[1] : $debug;
		try { t = n.split(':'); $trim(t); }catch(e){}
		r.proj = t[0] ? t[0] : '';
		r.mod = t[1] ? t[1] : '';
		r.bg = $colors[$instances % $colors.length]; 
		n = $levels.indexOf(l);
		r.level = n === -1? 0 : n;
		return r;
	};

const $a2a = (args) => { 
		let r = [];
		let s = '';
		for (let i=0,len=args.length;i<len;i++){
			if (typeof args[i] !== 'object'){
				r.push(args[i]);
			}else{
				r.push($toString(args[i]));
			}
		}
		return r.join(', '); 
	};

const $time = (ms) => {
		if (ms < 1000) return ms + 'ms';
	  	let s = ms / 1000;
		if (s < 60) return s.toFixed(2) + 's';
		s = Math.floor((ms % 60000)/1000);
	  	let m = Math.floor(ms / 60000);
	  	if (m < 60) return  (m + ":" + (s < 10 ? "0" : "") + s) + 'm';
		m = Math.floor((ms % 3600000)/60000);
	  	let h = Math.floor(ms / 3600000);
	  	return  (h + ":" + (m < 10 ? "0" : "") + m) + 'h';
	};

const $opt = $parseOpt(($isBrowser?localStorage.debug:process.env.DEBUG)||'');
$opt.color 	= true;
$opt.time 	= true;
$opt.test 	= false;
$opt.browser = false;
					
class Debug
{
	constructor(opt)
	{
		const o = $parseOpt(opt);
		this.level = $opt.level < o.level ? $opt.level : o.level;
		if ($opt.proj !== o.proj) this.level = 0;
		else if (($opt.mod === '') || ($opt.mod === '*')){}
		else if ($opt.mod !== o.mod) this.level = 0;
		this.name = o.proj + (o.mod?':'+o.mod:'');
		if (this.name == '') this.name = 'ts:'+ this.rand;
		this.bg = o.bg; 
		$instances++;
		if ($instances > $colors.length) $instances = 0;
		this.now = Date.now(); 
	}
	
	rand() { return Math.random().toString(36).slice(2) + Date.now(); }
	time(ms) { return $time(ms); }
	trim(a) { $trim(a); }
	toString(obj){ return $toString(obj); }
	fromString(s){ return $fromString(s); }
	ab2str(buf){ return $ab2str(buf); }
	str2ab(str){ return $str2ab(str); }
	isBrowser(){ return $isBrowser; }
	isInspector(){ return $isInspector; } 

	set(opt) 
	{ 
		if (typeof opt !== 'object') return;
		if (opt.level){
			const ix = $levels.indexOf(opt.level);
			if (ix !== -1) opt.level = this.level = ix;
		}

		Object.keys(opt).forEach((key)=>{
    	if ($opt.hasOwnProperty(key)) $opt[key] = opt[key];
		});
	}
	
	dt()
	{
		const now = Date.now(); 
		const r = now - this.now; 
		this.now = now;
		return $time(r);
	}
	
	error(v)
	{
		if (this.level < 1) return '';
		return $out($a2a(arguments),this.name,$red,this.bg,this.dt());
	}
	
	warn(v)
	{
		if (this.level < 2) return '';
		return $out($a2a(arguments),this.name,$orange,this.bg,this.dt());
	}
	
	log(v)
	{
		if (this.level < 3) return '';
		return $out($a2a(arguments),this.name,$gray,this.bg,this.dt());
	}
	
	info(v)
	{
		if (this.level < 4) return '';
		return $out($a2a(arguments),this.name,$blue,this.bg,this.dt());
	}
	
	debug(v)
	{
		if (this.level < 5 /*debug*/) return '';
		return $out($a2a(arguments),this.name,$green,this.bg,this.dt());
	}
	
	is(arg,type)
	{
		return $is(arg,type);
	}
	
	params(line,arg1,type1)
	{
		if (this.level < 5 /*debug*/) return true;
		const s = $params(Array.from(arguments));
		if (s !== '') {
			this.error(s);
			return false;
		}
		return true;
	}
	
	implements(line,type1)
	{
		if (this.level < 5 /*debug*/) return true;
		const s = $implements(Array.from(arguments));
		if (s !== '') {
			this.error(s);
			return false;
		}
		return true;
	}
	
	intersec(arr1, arr2)
	{
		const a = Array.from(arguments);
		if (a.length < 2){
			ts.error('arg2..?');
			return [];
		}
		return $intersec(a);
	}
	
	diff(arr1, arr2)
	{
		const a = Array.from(arguments);
		if (a.length < 2){
			ts.error('arg2..?');
			return [];
		}
		return $diff(a);
	}
	
	union(arr1, arr2)
	{
		const a = Array.from(arguments);
		if (a.length < 2){
			ts.error('arg2..?');
			return [];
		}
		return $union(a);
	}
	
}

module.exports = (opt) => { return new Debug(opt); };
