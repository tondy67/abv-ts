/**
 * Abvos Debug
 * https://github.com/tondy67/abv-ts
 */
"use strict";

// export DEBUG=abv:*,info / unset DEBUG
// localStorage.debug = 'abv:*';

const log = console.log.bind(console);

const $fn = 'function';
const $obj  = 'object';
const $str  = 'string';
const $ud = "undefined";
const $uk = 'Unknown';
const $int = 'Int';
const $float = 'Float';
const $sc = 'Static class!';

const $isBrowser = typeof window !== $ud && window;
const $isInspector = $isBrowser ? false : process.execArgv.indexOf('--inspect') !== -1;

const $no 		= 'no';
const $error 	= 'error';
const $warn 	= 'warn';
const $log 		= 'log'; 
const $info 	= 'info'; 
const $debug 	= 'debug';

const $levels 	= [$no, $error, $warn, $log, $info, $debug];
Object.freeze($levels);

const $red 		= 'red';
const $blue 	= 'blue';
const $green 	= 'green';
const $yellow 	= 'yellow';
const $orange 	= 'orange';
const $magenta	= 'magenta';
const $cyan		= 'cyan';
const $gray		= 'gray';
const $black	= 'black';
const $white	= 'white';

const $colors 	= [$red, $blue, $green, $orange, $magenta, $cyan, $gray];
Object.freeze($colors);

const $Reset 	= "\x1b[0m"; 
const $Bold  	= "\x1b[1m"; 
const $Dim 		= "\x1b[2m"; 
const $Underline	= "\x1b[4m"; 
const $Blink 	= "\x1b[5m"; 
const $Reverse 	= "\x1b[7m"; 
const $Hidden 	= "\x1b[8m"; 
const $FgBlack 	= "\x1b[30m"; 
const $FgRed 	= "\x1b[31m"; 
const $FgGreen 	= "\x1b[32m"; 
const $FgYellow = "\x1b[33m"; 
const $FgBlue 	= "\x1b[34m"; 
const $FgMagenta = "\x1b[35m"; 
const $FgCyan 	= "\x1b[36m"; 
const $FgWhite 	= "\x1b[37m"; 
const $BgBlack 	= "\x1b[40m"; 
const $BgRed 	= "\x1b[41m"; 
const $BgGreen 	= "\x1b[42m"; 
const $BgYellow = "\x1b[43m"; 
const $BgBlue 	= "\x1b[44m"; 
const $BgMagenta = "\x1b[45m"; 
const $BgCyan 	= "\x1b[46m"; 
const $BgWhite 	= "\x1b[47m";

let $instances = 0|0;

const $sum = (arr) => {
		return arr.reduce(function(a, b) { return a + b; }, 0);
	};
	
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
		
		if (!c) r = $Reset;
		else if (c === $red) 	r = bg ? $BgRed:$FgRed;
		else if (c === $blue) 	r = bg ? $BgBlue:$FgBlue;
		else if (c === $green) 	r = bg ? $BgGreen:$FgGreen;
		else if (c === $orange) r = bg ? $BgYellow:$FgYellow;
		else if (c === $yellow) r = bg ? $BgYellow:$FgYellow;
		else if (c === $magenta)r = bg ? $BgMagenta:$FgMagenta;
		else if (c === $cyan) 	r = bg ? $BgCyan:$FgCyan;
		else if (c === $gray) 	r = bg ? $BgWhite:$Dim;
		else if (c === $black) 	r = bg ? $BgBlack:$FgBlack;
		else if (c === $white) 	r = bg ? $BgWhite:$FgWhite;
		
		return r;
	};
	
const $toString = (obj) => {
		let r = "[" + obj + "]";
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
		for (let i in str) {
			dv.setUint16(i*2,str.charCodeAt(i));
		}
		return buf;
	};

const $print = (s,color,bg) => {
		s = $is(s,String) ? s : String(s);
		if ($isBrowser){
			log(s);
		}else{
			if (color){
				s = $clr2c(color) + s + $Reset;
				if (bg) s = $clr2c(bg,true) + s;
			}
			process.stdout.write(s);
		}
	};
	

const $out = (str, name, color, bg, dt) => {
		let s = '';
		let time = $opt.time ? ' +' + dt : '';
		if (!dt) time = '';
		
		if (!$opt.color){
			s = name + ': ' + str + time;
			if (!$opt.test) log(s);
		}else if ($isBrowser || $isInspector || $opt.browser){
			s = '%c ' + name + ' %c ' + str + time;
			if (!$opt.test) log(s,'background: ' + $clr2c(bg,true) +
				'; color: white', 'color: ' + $clr2c(color));
		}else{
			if ($opt.test) bg = $red; 
			s = $clr2c(bg,true) + $FgWhite + $Bold + ' ' + name + ' ' +  
				$Reset + ' ' + $clr2c(color) + str + time + $Reset;

			if (!$opt.test) log(s);
		}
		return s;
	};

const $cast = (arg,type) => {
		let r;
		if ($is(arg,type)){
			r = arg; // TODO: cast
		}else{
			throw new TypeError('Cast error');
		}
		return r;
	};
	
const $is = (arg,type) => {
		let r = false;
		if ((typeof arg === $ud) || (typeof type === $ud)) return r;
		
		if (type === String){
			r = typeof arg === $str || arg instanceof String;
		}else if (type === ArrayBuffer){
			r = arg instanceof ArrayBuffer;
		}else if (type === Buffer){
			r = arg instanceof Buffer;
		}else if (type instanceof Array){
			if (type.length !== 1){
			}else if (arg instanceof Array){
				let c = true;
				for(let i in arg){
					if (!$is(arg[i],type[0])){
						c = false;
						break;
					}
				}
				if (c) r = true;
			}			
		}else if (type === $int){
			r = Number.isInteger(arg);
		}else if (type === $float){
			r = Number.isFinite(arg) && !Number.isInteger(arg);
		}else if (type === Number){
			r = typeof arg === 'number';
		}else if (type === Boolean){
			r = typeof arg === 'boolean' || arg instanceof Boolean;
		}else if (arg instanceof type){
			r = true;
		}else{
			r = $implements([arg,type,215]) === '';
		}
		
		return r;	
	};

const $params = (args) => {
		let r = '';
		const a = []; 
		const len = args.length % 2 === 0 ? args.length : args.length-1;
		for (let i=0;i<len;i+=2){
			if (!$is(args[i],args[i+1])){
				a.push('arg' + Math.round((i+1)/2));
			}
		}
		const line = args.length > len ? args[len] + ' ': '';
		if (a.length > 0) r = line + 'TypeError: ' + a.join(', ');
		return r;
	};

const $implements = (args) => { // TODO: long story..
		let r = '';
		const a = [];
		const ft = $fn;
		let cls = typeof args[0] === ft ? new args[0](): args[0];
		const cp = Array.from(Object.keys(cls));
		const cn = cls.constructor.name + '{}';
		let cm = [];
		do{
			cm = cm.concat(Object.getOwnPropertyNames(cls));
		}while (cls = Object.getPrototypeOf(cls));
		let it, im, ip, d, n;
		const len = $is(args[args.length-1], $int) ? args.length-1 : args.length;
		for (let i=1;i<len;i++){
			it = typeof args[i] === ft ? new args[i](): args[i];
			n = it.constructor.name;
			im = Object.getOwnPropertyNames(Object.getPrototypeOf(it));//log(im);
			ip = Array.from(Object.keys(it));
			d = $intersec([cp,ip]); 
			d = $diff([d,ip]); 
			if (d.length > 0) a.push(n + '{' + d + '}');
			d = $intersec([cm,im]); 
			d = $diff([d,im]);
			if (d.length > 0) a.push(n + '(' + d + ')');
		}
		const line = args.length > len ? args[len] + ' ': '';
		if (a.length > 0) r = line + cn + ' missing: ' + a.join(', ');

		return r;	
	};

const $add = (str, end, start=null) => { 
	str = str.endsWith(end) ? str : str + end;
	if (start) str = str.startsWith(start) ? str : start + str; 
	return str;
};

const $trim = (a) => { 
		for (let i in a) a[i] = a[i].trim(); 
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
		for (let i in args){
			if (typeof args[i] !== $obj){
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
	
// http://www.cse.yorku.ca/~oz/hash.html
const $djb2 = (s) => {
	if (!$is(s,String)) s = ''; 
	let h = 5381|0;
	for (let i in s) {
		h = ((h << 5) + h) + s.charCodeAt(i); // h*33 + c 
	}
	return h;
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

// common strings	
	get FN(){ return $fn; }
	get OBJ(){ return $obj; }
	get STR(){ return $str; }
	get UD(){ return $ud; }
	get UK(){ return $uk; }
	get INT(){ return $int; }
	get FLOAT(){ return $float; }
	get SC(){ return $sc; }

// colors
	get RED 	() { return $red; }
	get BLUE 	() { return $blue; }
	get GREEN 	() { return $green; }
	get YELLOW 	() { return $yellow; }
	get ORANGE 	() { return $orange; }
	get MAGENTA	() { return $magenta; }
	get CYAN	() { return $cyan; }
	get GRAY	() { return $gray; }
	get BLACK	() { return $black; }
	get WHITE	() { return $white; }

	get colors(){ return $colors; }

	get levels(){ return $levels; }

	get isBrowser(){ return $isBrowser; }

	get isInspector(){ return $isInspector; } 
	
	range(val, max, min=0){ return (val >= min) && (val < max); }
	
	time(ms) { return $time(ms); }

	rs(str) { return str.replace(/\/\/+/g, '/'); }
	
	add(str, end, start=null) { return $add(str, end, start); }
	
	trim(arr) { $trim(arr); }

	toString(obj){ return $toString(obj); }

	fromString(s){ return $fromString(s); }

	ab2str(buf){ return $ab2str(buf); }

	str2ab(str){ return $str2ab(str); }

	djb2(str){ return $djb2(str); }

	clear(arr){ arr.length = 0; }

	clr2c(c, bg=false){ return $clr2c(c,bg); }
	
	toJson(v) { return JSON.stringify(v,null,2); }
	
	print(s,color,bg) { $print(s,color,bg); }
	
	println(s,color,bg) { $print(s + '\n',color,bg); }

	rand()
	{ 
		const t = $djb2(Date.now() + this.name);
		return Math.random().toString(36).slice(2) + t; 
	}

	set(opt) 
	{ 
		if (typeof opt !== $obj) return;
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
	
	type(v, stop)
	{
		let r = '';
		if (this.level < 5 /*debug*/) return r;
		if (v === null) r = 'null';
		else if (v && v.constructor) r = v.constructor.name;
		else r = typeof v;
		$out([r],this.name,$red,this.bg,this.dt());
		if (stop) throw new Error(String(stop));
	}
	
	cast(arg,type)
	{
		return $cast(arg,type);
	}
	
	is(arg,type)
	{
		return $is(arg,type);
	}
	
	params(arg1,type1,line)
	{
		if (this.level < 5 /*debug*/) return true;
		const s = $params(Array.from(arguments));
		if (s !== '') {
			this.error(s);
			return false;
		}
		return true;
	}
	
	implements(type,interface1,line)
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
			this.error('arg2..?');
			return [];
		}
		return $intersec(a);
	}
	
	diff(arr1, arr2)
	{
		const a = Array.from(arguments);
		if (a.length < 2){
			this.error('arg2..?');
			return [];
		}
		return $diff(a);
	}
	
	union(arr1, arr2)
	{
		const a = Array.from(arguments);
		if (a.length < 2){
			this.error('arg2..?');
			return [];
		}
		return $union(a);
	}
	
	sum(arr) { return $sum(arr); }
	
}

module.exports = Debug;
