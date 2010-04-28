/* 
 * pzprBase.js
 * 
 * pzprBase.js is a base script for playing nikoli puzzles on Web
 * written in JavaScript.
 * 
 * @author  dk22
 * @version v3.3.0
 * @date    2010-04-28
 * 
 * This script is licensed under the MIT license. See below,
 * http://www.opensource.org/licenses/mit-license.php
 * 
 */

var pzprversion="v3.3.0";
 
(function(){

// ���d��`�h�~
if(!!window.Camp){ return;}

/* ------------- */
/*   variables   */
/* ------------- */
var _win = this,
	_doc = document,
	_ms = Math.sin,
	_mc = Math.cos,
	_mr = Math.round,
	_2PI = 2*Math.PI,

	_IE = !!(window.attachEvent && !window.opera),

	Z  = 10,
	Z2 = Z/2,

	_color = [],
	flags = { debugmode:false },
	_types = ['svg','canvas','sl','flash','vml'],
	_initializing = 0,

	VML    = 0,
	SVG    = 1,
	CANVAS = 2,
	SL     = 3,
	FLASH  = 4,

	BEFOREEND = 'BeforeEnd';

/* ---------- */
/*   arrays   */
/* ---------- */
var _hex = (function(){
	var tbl = [];
	for(var r=256;r<512;r++){ tbl[r-256]=r.toString(16).substr(1);}
	return tbl;
})();

/* ------------ */
/*   ���ʊ֐�   */
/* ------------ */
function getRectSize(el){
	return { width :(el.offsetWidth  || el.clientWidth),
			 height:(el.offsetHeight || el.clientHeight)};
}
function parsecolor(rgbstr){
	if(!_color[rgbstr]){
		if(rgbstr.substr(0,4)==='rgb('){
			var m = rgbstr.match(/\d+/g);
			_color[rgbstr] = ["#",_hex[m[0]],_hex[m[1]],_hex[m[2]]].join('');
		}
		else{ _color[rgbstr] = rgbstr;}
	}
	return _color[rgbstr];
}
function parsecolorrev(colorstr){
	if(colorstr.match(/\#([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])([0-9a-f][0-9a-f])/)){
		var m0 = parseInt(RegExp.$1,16).toString();
		var m1 = parseInt(RegExp.$2,16).toString();
		var m2 = parseInt(RegExp.$3,16).toString();
		return ["rgb(",m0,',',m1,',',m2,")"].join('');
	}
	return colorstr;
}
function _extend(obj, ads){
	for(var name in ads){ obj[name] = ads[name];}
}

/* ------------------ */
/*   TypeList�N���X   */
/* ------------------ */
var TypeList = function(){
	this.canvas = false;
	this.vml    = false;
	this.svg    = false;
	this.sl     = false;
	this.flash  = false;
};

/* ------------------------------------------- */
/*   VectorContext(VML)�N���X�pconst������W   */
/* ------------------------------------------- */
var V_TAG_SHAPE    = '<v:shape',
	V_TAG_GROUP    = '<v:group',
	V_TAG_TEXTPATH = '<v:textpath',
	V_TAG_POLYLINE = '<v:polyline',
	V_TAG_PATH_FOR_TEXTPATH = '<v:path textpathok="t" />';
	V_EL_UNSELECTABLE = '', // �f�t�H���g��unselectable�łȂ�
//	V_EL_UNSELECTABLE = ' unselectable="on"',
	V_TAGEND      = '>',
	V_TAGEND_NULL = ' />',
	V_CLOSETAG_SHAPE    = '</v:shape>',
	V_CLOSETAG_GROUP    = '</v:group>',
	V_CLOSETAG_TEXTPATH = '</v:textpath>',
	V_CLOSETAG_POLYLINE = '</v:polyline>',

	V_ATT_ID     = ' id="',
	V_ATT_PATH   = ' path="',
	V_ATT_POINTS = ' points="',
	V_ATT_STYLE  = ' style="',
	V_ATT_STRING = ' string="',
	V_ATT_COORDSIZE    = ' coordsize="100,100"',
	V_ATT_FILLCOLOR    = ' fillcolor="',
	V_ATT_STROKECOLOR  = ' strokecolor="',
	V_ATT_STROKEWEIGHT = ' strokeweight="',
	V_ATT_END = '"',
	V_ATT_STYLE_TEXTBOX = ' style="white-space:nowrap;cursor:default;font:10px sans-serif;"',
	V_DEF_ATT_POLYLINE  = ' stroked="f" filled="t"',
	V_DEF_ATT_TEXTPATH  = ' on="t" xscale="t"',

	V_STYLE_LEFT  = 'left:',
	V_STYLE_TOP   = 'top:',
	V_STYLE_FONT  = 'font:',
	V_STYLE_ALIGN = 'v-text-align:',
	V_STYLE_END   = ';',

	V_PATH_MOVE   = ' m',
	V_PATH_LINE   = ' l',
	V_PATH_CLOSE  = ' x',
	V_PATH_NOSTROKE = ' ns',
	V_PATH_NOFILL   = ' nf',

	V_HEIGHT = { top:-0.3, hanging:-0.3, middle:0, alphabetic:0.4, bottom:0.45 };

/* ------------------------------------------- */
/*   VectorContext(SVG)�N���X�pconst������W   */
/* ------------------------------------------- */
var SVGNS = "http://www.w3.org/2000/svg",
	S_PATH_MOVE   = ' M',
	S_PATH_LINE   = ' L',
	S_PATH_ARCTO  = ' A',
	S_PATH_CLOSE  = ' z',

	S_ATT_ID          = 'id';
	S_ATT_FILL        = 'fill';
	S_ATT_STROKE      = 'stroke';
	S_ATT_STROKEWIDTH = 'stroke-width',
	S_ATT_RENDERING   = 'shape-rendering',

	SVG_ANCHOR = {
		left   : 'start',
		center : 'middle',
		right  : 'end'
	},

	S_NONE = 'none',

	S_HEIGHT = { top:-0.7, hanging:-0.66, middle:-0.35, alphabetic:0, bottom:0.1 },

/* ------------------------------------------ */
/*   VectorContext(SL)�N���X�pconst������W   */
/* ------------------------------------------ */
	SL_WIDTH = { left:0, center:0.5, right:1 },
	SL_HEIGHT = { top:0.2, hanging:0.2, middle:0.5, alphabetic:0.7, bottom:0.8 },

/* --------------------------------- */
/*   VectorContext�N���X�p�ϐ��Ȃ�   */
/* --------------------------------- */
	EL_ID_HEADER = "canvas_o_",
	ME    = null,
	EMPTY = '';

function initME(){
	ME = _doc.createElement('div');
	ME.style.display  = 'inline';
	ME.style.position = 'absolute';
	ME.style.left     = '-9000px';
	ME.innerHTML = '';
	_doc.body.appendChild(ME);

	Camp.ME = ME;
}

/* ----------------------- */
/*   VectorContext�N���X   */
/* ----------------------- */
var VectorContext = function(type, idname){
	// canvas�ɑ��݂���v���p�e�B���f�t�H���g�l
	this.fillStyle    = 'black';
	this.strokeStyle  = 'black';
	this.lineWidth    = 1;
	this.font         = '14px system';
	this.textAlign    = 'center';
	this.textBaseline = 'middle';
	this.canvas = null;	// �e�G�������g�ƂȂ�div�G�������g

	// changeOrigin�p(Sinverlight�p)
	this.OFFSETX = 0;
	this.OFFSETY = 0;

	// �O������ύX�����ǉ��v���p�e�B
	this.vid      = '';
	this.elements = [];
	this.lastElement = null;

	// variables for internal
	this.type   = type;
	this.target = null;	// �G�������g�̒ǉ��ΏۂƂȂ�I�u�W�F�N�g
	this.child  = null;	// this.canvas�̒����ɂ���G�������g
	this.idname = idname;
	this.canvasid = EL_ID_HEADER+idname;
	this.currentpath = [];
	this.lastpath    = '';

	this.currentLayerId = '_empty';
	this.isedgearray    = {_empty:false};
	this.isedge         = false;

	// Silverlight�p
	this.content = null;

	this.use = new TypeList();

	// define const
	if(this.type===SVG || this.type===SL){
		this.PATH_MOVE  = S_PATH_MOVE;
		this.PATH_LINE  = S_PATH_LINE;
		this.PATH_CLOSE = S_PATH_CLOSE;
		if(this.type===SVG){ this.use.svg = true;}
		if(this.type===SL) { this.use.sl  = true;}
	}
	else if(this.type===VML){
		this.PATH_MOVE  = V_PATH_MOVE;
		this.PATH_LINE  = V_PATH_LINE;
		this.PATH_CLOSE = V_PATH_CLOSE;
		this.use.vml = true;
	}

	this.initElement(idname);
};
VectorContext.prototype = {
	/* additional functions (for initialize) */
	initElement : function(idname){
		var child = null;
		if(this.type!==SL){ child = _doc.getElementById(this.canvasid)}
		else if(!!this.content){ child = this.content.findName(this.canvasid);}

		if(!child){
			var parent = _doc.getElementById(idname);
			var rect = getRectSize(parent);
			if     (this.type===SVG){ this.appendSVG(parent,rect.width,rect.height);}
			else if(this.type===SL) { this.appendSL (parent,rect.width,rect.height);}
			else if(this.type===VML){ this.appendVML(parent,rect.width,rect.height);}

			if(this.type!==SL){ this.afterInit();}
		}
		else{
			this.target = child;
		}
	},
	afterInit : function(){
		var parent = _doc.getElementById(this.idname);
		var rect   = getRectSize(parent);
		var child  = this.child;

		var self = this;
		//parent.className = "canvas";
		parent.style.display  = 'block';
		parent.style.position = 'relative';
		parent.style.overflow = 'hidden';
		if(flags.debugmode){
			parent.style.backgroundColor = "#efefef";
			parent.style.border = "solid 1px silver";
		}
		parent.getContext = function(type){ return self;};
		parent.toDataURL = function(type){ return null; /* ���T�|�[�g */ };
		this.canvas = parent;

		this.target = this.child;
		this.rect(0,0,rect.width,rect.height);
		this.addVectorElement(false,false);

		_initializing--;
	},

	appendSVG : function(parent, width, height){
		var svgtop = _doc.createElementNS(SVGNS,'svg');
		svgtop.setAttribute('id', this.canvasid);
		svgtop.setAttribute('font-size', "10px");
		svgtop.setAttribute('font-family', "sans-serif");
		svgtop.setAttribute('width', width);
		svgtop.setAttribute('height', height);
		svgtop.setAttribute('viewBox', [0,0,width,height].join(' '));

		parent.appendChild(svgtop);
		this.child = svgtop;
	},
	appendVML : function(parent, width, height){
		var vmltop = _doc.createElement('div');
		vmltop.id = this.canvasid;

		vmltop.style.position = 'absolute';
		vmltop.style.left   = '-2px';
		vmltop.style.top    = '-2px';
		vmltop.style.width  = width + 'px';
		vmltop.style.height = height + 'px';

		parent.appendChild(vmltop);
		this.child = vmltop;
	},
	appendSL : function(parent, width, height){
		var self = this, funcname = "_function_" + this.canvasid + "_onload";
		_win[funcname] = function(sender, context, source){
			self.content = document.getElementById([self.canvasid,'object'].join('_')).content;
			self.child = self.content.findName(self.canvasid);
			self.afterInit.call(self);
		};

		parent.innerHTML = [
			'<object type="application/x-silverlight" width="100%" height="100%" id="',this.canvasid,'_object" />',
			'<param name="windowless" value="true" />',
			'<param name="background" value="#00000000" />',	// �A���t�@�l0 = ����
			'<param name="source" value="#',this.canvasid,'_script" />',
			'<param name="onLoad" value="',funcname,'" />',	// �O��100%,100%�ݒ肪�K�v�������݂���
			'</object>',
			'<script type="text/xaml" id="',this.canvasid,'_script">',
			'<Canvas xmlns="http://schemas.microsoft.com/client/2007" Name="',this.canvasid,'" />',
			'</script>'
		].join('');
	},
	setLayer : function(layerid){
		this.initElement(this.idname);
		if(!!layerid){
			var lid = [this.canvasid,"layer",layerid].join('_');
			var layer = (this.type!==SL ? _doc.getElementById(lid) : this.content.findName(lid));
			if(!layer){
				if(this.type===SVG){
					layer = _doc.createElementNS(SVGNS,'g');
					layer.setAttribute('id', lid);
					this.target.appendChild(layer);
				}
				else if(this.type===SL){
					layer = this.content.createFromXaml(['<Canvas Name="',lid,'"/>'].join(''));
					this.target.children.add(layer);
				}
				else{
					layer = _doc.createElement('div');
					layer.id = lid;
					layer.unselectable = (!!V_EL_UNSELECTABLE ? 'on' : '');
					layer.style.position = 'absolute';
					layer.style.left   = '0px';
					layer.style.top    = '0px';
					this.target.appendChild(layer);
				}
			}
			this.target = layer;
		}

		this.currentLayerId = (!!layerid ? layerid : '_empty');
		if(this.type!==SVG){
			if(this.isedgearray[this.currentLayerId] === void 0){
				this.isedgearray[this.currentLayerId] = false;
			}
			this.isedge = this.isedgearray[this.currentLayerId];
		}
	},
	setRendering : function(render){
		if(this.type===SVG){
			this.target.setAttribute(S_ATT_RENDERING, render);
		}
		else{
			this.isedgearray[this.currentLayerId] = (render==='crispEdges');
			this.isedge = this.isedgearray[this.currentLayerId];
		}
	},
	setUnselectable : function(unsel){
		if(unsel===(void 0)){ unsel = true;}else{ unsel = !!unsel;}
		if(this.type===VML){
			V_EL_UNSELECTABLE = (unsel ? ' unselectable="on"' : '');
			this.canvas.unselectable = (unsel ? 'on' : '');
			this.child.unselectable  = (unsel ? 'on' : '');
		}
		else if(this.type===SL){
			this.canvas.unselectable = (unsel ? 'on' : '');
		}
		else if(this.type===SVG){
			this.canvas.style.MozUserSelect    = (unsel ? 'none' : 'text');
			this.canvas.style.WebkitUserSelect = (unsel ? 'none' : 'text');
			this.canvas.style.userSelect       = (unsel ? 'none' : 'text');
		}
	},
	getContextElement : function(){ return this.child;},
	getLayerElement   : function(){ return this.target;},

	changeSize : function(width,height){
		this.canvas.style.width  = width + 'px';
		this.canvas.style.height = height + 'px';

		var child = this.canvas.firstChild;
		if(this.type===SVG){
			child.setAttribute('width', width);
			child.setAttribute('height', height);
			child.setAttribute('viewBox', [0,0,width,height].join(' '));
		}
		else if(this.type==SL){
			// �`�悳��Ȃ����Ƃ����邽�߁A�T�C�Y��2�x�ݒ肷�邨�܂��Ȃ�
			child.height = (height+1)+'px';

			child.width  = width + 'px';
			child.height = height + 'px';
		}
		else if(this.type==VML){
			child.style.width  = width + 'px';
			child.style.height = height + 'px';
		}
	},
	changeOrigin : function(left,top){
		var child = this.canvas.firstChild;
		if(this.type===SVG){
			var m = child.getAttribute('viewBox').split(/ /);
			m[0]=left, m[1]=top;
			child.setAttribute('viewBox', m.join(' '));
		}
		else if(this.type===VML){
			child.style.position = 'absolute';
			child.style.left = (-left-2)+'px';
			child.style.top  = (-top -2)+'px';
		}
		else if(this.type===SL){
			this.OFFSETX = -left;//(left<0?-left:0);
			this.OFFSETY = -top;//(top<0?-top:0);
		}
	},
	clear : function(){
		if(this.type!==SL){ _doc.getElementById(this.idname).innerHTML = '';}

		this.vid = '';
		this.elements = [];
		this.lastElement = null;
		this.initElement(this.idname);

		if(this.type===SL){ this.target.children.clear();}
	},

	/* Canvas API functions (for path) */
	beginPath : function(){
		this.currentpath = [];
		this.lastpath = '';
	},
	closePath : function(){
		this.currentpath.push(this.PATH_CLOSE);
		this.lastpath = this.PATH_CLOSE;
	},
	moveTo : function(x,y){
		if(this.type===VML){ x=(x*Z-Z2)|0; y=(y*Z-Z2)|0;}
		else if(this.type===SL) {
			x = (this.isedge ? _mr(x+this.OFFSETX) : x+this.OFFSETX);
			y = (this.isedge ? _mr(y+this.OFFSETY) : y+this.OFFSETY);
		}
		this.currentpath.push(this.PATH_MOVE,x,y);
		this.lastpath = this.PATH_MOVE;
	},
	lineTo : function(x,y){
		if(this.lastpath!==this.PATH_LINE){ this.currentpath.push(this.PATH_LINE);}
		if(this.type===VML){ x=(x*Z-Z2)|0; y=(y*Z-Z2)|0;}
		else if(this.type===SL) {
			x = (this.isedge ? _mr(x+this.OFFSETX) : x+this.OFFSETX);
			y = (this.isedge ? _mr(y+this.OFFSETY) : y+this.OFFSETY);
		}
		this.currentpath.push(x,y);
		this.lastpath = this.PATH_LINE;
	},
	rect : function(x,y,w,h){
		if(this.type===VML){ x=(x*Z-Z2)|0; y=(y*Z-Z2)|0, w=(w*Z)|0, h=(h*Z)|0;}
		else if(this.type===SL) {
			x = (this.isedge ? _mr(x+this.OFFSETX) : x+this.OFFSETX);
			y = (this.isedge ? _mr(y+this.OFFSETY) : y+this.OFFSETY);
			w = (this.isedge ? _mr(w) : w);
			h = (this.isedge ? _mr(h) : h);
		}
		this.currentpath.push(this.PATH_MOVE,x,y,this.PATH_LINE,(x+w),y,(x+w),(y+h),x,(y+h),this.PATH_CLOSE);
	},
	arc : function(cx,cy,r,startRad,endRad,antiClockWise){
		if(this.type===SL) {
			cx = (this.isedge ? _mr(cx+this.OFFSETX) : cx+this.OFFSETX);
			cy = (this.isedge ? _mr(cy+this.OFFSETY) : cy+this.OFFSETY);
		}
		var sx = cx + r*_mc(startRad), sy = cy + r*_ms(startRad),
			ex = cx + r*_mc(endRad),   ey = cy + r*_ms(endRad);
		if(this.type===VML){
			cx=(cx*Z-Z2)|0, cy=(cy*Z-Z2)|0, r=(r*Z)|0;
			sx=(sx*Z-Z2)|0, sy=(sy*Z-Z2)|0, ex=(ex*Z-Z2)|0, ey=(ey*Z-Z2)|0;
			var com = (antiClockWise ? 'at' : 'wa');
			if(endRad-startRad>=_2PI){ sx+=1;}
			this.currentpath.push(com,(cx-r),(cy-r),(cx+r),(cy+r),sx,sy,ex,ey);
			this.lastpath = com;
		}
		else{
			if(endRad-startRad>=_2PI){ sy+=0.125;}
			var unknownflag = (startRad>endRad)^(Math.abs(endRad-startRad)>Math.PI);
			var islong = ((antiClockWise^unknownflag)?1:0), sweep = ((islong==0^unknownflag)?1:0);
			this.currentpath.push(this.PATH_MOVE,sx,sy,S_PATH_ARCTO,r,r,0,islong,sweep,ex,ey);
			this.lastpath = S_PATH_ARCTO;
		}
	},

	/* Canvas API functions (for drawing) */
	fill       : function(){ this.addVectorElement(true,false);},
	stroke     : function(){ this.addVectorElement(false,true);},
	fillRect   : function(x,y,w,h){
		var stack = this.currentpath;
		this.currentpath = [];
		this.rect(x,y,w,h);
		this.addVectorElement(true,false);
		this.currentpath = stack;
	},
	strokeRect : function(x,y,w,h){
		var stack = this.currentpath;
		this.currentpath = [];
		this.rect(x,y,w,h);
		this.addVectorElement(false,true);
		this.currentpath = stack;
	},
	shapeRect  : function(x,y,w,h){
		var stack = this.currentpath;
		this.currentpath = [];
		this.rect(x,y,w,h);
		this.addVectorElement(true,true);
		this.currentpath = stack;
	},

	fillText : function(text,x,y){
		switch(this.type){
		case SVG:
			ME.style.font = this.font; ME.innerHTML = text;
			var top = y - (ME.offsetHeight * S_HEIGHT[this.textBaseline.toLowerCase()]);

			var el = _doc.createElementNS(SVGNS,'text');
			el.setAttribute('x', x);
			el.setAttribute('y', top);
			el.setAttribute(S_ATT_FILL, parsecolor(this.fillStyle));
			el.setAttribute('text-anchor', SVG_ANCHOR[this.textAlign.toLowerCase()]);
			el.style.font = this.font;
			el.appendChild(_doc.createTextNode(text));
			this.target.appendChild(el);
			this.lastElement = el;
			break;

		case SL:
			ME.style.font = this.font;
			var fontFamily = ME.style.fontFamily.replace(/\"/g,'\'');
			var fontSize   = parseInt(ME.style.fontSize);
			var wid = parseInt(this.canvas.offsetWidth);
			var left = x + this.OFFSETX - wid * SL_WIDTH[this.textAlign.toLowerCase()];
			var ar = [
				'<TextBlock Canvas.Left="', left, '" Canvas.Top="',(y+this.OFFSETY),
				'" Width="', wid, '" TextAlignment="', this.textAlign,
				'" FontFamily="', fontFamily, '" FontSize="', fontSize,
				'" Foreground="', parsecolor(this.fillStyle), '" Text="',text, '" />'
			];
			var xaml = this.content.createFromXaml(ar.join(''));
			this.lastElement = this.elements[this.vid] = xaml;

			var offset = xaml.ActualHeight * SL_HEIGHT[this.textBaseline.toLowerCase()];
			xaml["Canvas.Top"] = y+this.OFFSETY - (!isNaN(offset)?offset:0);
			this.target.children.add(xaml);
			break;

		case VML:
			x=(x*Z-Z2)|0, y=(y*Z-Z2)|0;
			ME.style.font = this.font; ME.innerHTML = text;
			var top  = y - ((ME.offsetHeight * V_HEIGHT[this.textBaseline.toLowerCase()])*Z-Z2)|0;

			var wid = (ME.offsetWidth*Z-Z2)|0;
			var left = x - (wid * SL_WIDTH[this.textAlign.toLowerCase()])|0;

			var ar = [
				V_TAG_GROUP, V_ATT_COORDSIZE, V_TAGEND,
					V_TAG_POLYLINE, V_ATT_POINTS, [left,top,left+wid,top].join(','), V_ATT_END,
					V_DEF_ATT_POLYLINE, V_ATT_FILLCOLOR, parsecolor(this.fillStyle), V_ATT_END, V_TAGEND,
						V_TAG_PATH_FOR_TEXTPATH,
						
						V_TAG_TEXTPATH, V_DEF_ATT_TEXTPATH, V_ATT_STRING, text, V_ATT_END,
						V_ATT_STYLE, V_STYLE_FONT, this.font, V_STYLE_END,
						V_STYLE_ALIGN, this.textAlign, V_STYLE_END, V_ATT_END, V_TAGEND_NULL,
					V_CLOSETAG_POLYLINE,
				V_CLOSETAG_GROUP
			];

			this.target.insertAdjacentHTML(BEFOREEND, ar.join(''));
			this.lastElement = this.target.lastChild.lastChild;
			break;
		}
		if(!!this.vid){ this.elements[this.vid] = this.lastElement;}
	},

	/* extended functions */
	shape : function(){ this.addVectorElement(true,true);},

	setLinePath : function(){
		var _args = arguments, _len = _args.length, svg=(this.type!==VML);
		this.currentpath = [];
		for(var i=0,len=_len-((_len|1)?1:2);i<len;i+=2){
			if     (i==0){ this.currentpath.push(this.PATH_MOVE);}
			else if(i==2){ this.currentpath.push(this.PATH_LINE);}

			var a1=_args[i], a2=_args[i+1];
			if(this.type===VML){ a1=(a1*Z-Z2)|0, a2=(a2*Z-Z2)|0;}
			else if(this.type===SL) {
				a1 = (this.isedge ? _mr(a1+this.OFFSETX) : a1+this.OFFSETX);
				a2 = (this.isedge ? _mr(a2+this.OFFSETY) : a2+this.OFFSETY);
			}
			this.currentpath.push(a1,a2);
		}
		if(_args[_len-1]){ this.currentpath.push(this.PATH_CLOSE);}
	},
	setOffsetLinePath : function(){
		var _args = arguments, _len = _args.length, svg=(this.type!==VML), m=[_args[0],_args[1]];
		this.currentpath = [];
		for(var i=2,len=_len-((_len|1)?1:2);i<len;i+=2){
			m[i] = _args[i] + m[0];
			m[i+1] = _args[i+1] + m[1];

			if(this.type===VML){ m[i]=(m[i]*Z-Z2)|0, m[i+1]=(m[i+1]*Z-Z2)|0;}
			else if(this.type===SL) {
				m[i]   = (this.isedge ? _mr(m[i]  +this.OFFSETX) : m[i]  +this.OFFSETX);
				m[i+1] = (this.isedge ? _mr(m[i+1]+this.OFFSETY) : m[i+1]+this.OFFSETY);
			}
		}
		for(var i=2,len=_len-((_len|1)?1:2);i<len;i+=2){
			if     (i==2){ this.currentpath.push(this.PATH_MOVE);}
			else if(i==4){ this.currentpath.push(this.PATH_LINE);}
			this.currentpath.push(m[i], m[i+1]);
		}
		if(_args[_len-1]){ this.currentpath.push(this.PATH_CLOSE);}
	},
	setDashSize : function(size){
		if(!this.lastElement){ return;}
		if(this.type===SVG){
			this.lastElement.setAttribute('stroke-dasharray', size);
		}
		else if(this.type===SL){
			this.lastElement.StrokeDashArray = ''+size;
		}
		else if(this.type===VML){
			var el = _doc.createElement('v:stroke');
			if     (size<=2){ el.dashstyle = 'ShortDash';}
			else if(size<=5){ el.dashstyle = 'Dash';}
			else            { el.dashstyle = 'LongDash';}
			this.lastElement.appendChild(el);
		}
	},

	strokeLine : function(x1,y1,x2,y2){
		if     (this.type===VML){ x1=(x1*Z)|0, y1=(y1*Z)|0, x2=(x2*Z)|0, y2=(y2*Z)|0;}
		else if(this.type===SL) {
			x1 = (this.isedge ? _mr(x1+this.OFFSETX) : x1+this.OFFSETX);
			y1 = (this.isedge ? _mr(y1+this.OFFSETY) : y1+this.OFFSETY);
			x2 = (this.isedge ? _mr(x2+this.OFFSETX) : x2+this.OFFSETX);
			y2 = (this.isedge ? _mr(y2+this.OFFSETY) : y2+this.OFFSETY);
		}
		var stack = this.currentpath;
		this.currentpath = [this.PATH_MOVE,x1,y1,this.PATH_LINE,x2,y2];
		this.addVectorElement(false,true);
		this.currentpath = stack;
	},
	strokeCross : function(cx,cy,l){
		if     (this.type===VML){ cx=(cx*Z-Z2)|0, cy=(cy*Z-Z2)|0, l=(l*Z)|0;}
		else if(this.type===SL) {
			cx = (this.isedge ? _mr(cx+this.OFFSETX) : cx+this.OFFSETX);
			cy = (this.isedge ? _mr(cy+this.OFFSETY) : cy+this.OFFSETY);
			l  = (this.isedge ? _mr(l) : l);
		}
		var stack = this.currentpath;
		this.currentpath = [this.PATH_MOVE,(cx-l),(cy-l),this.PATH_LINE,(cx+l),(cy+l),
							this.PATH_MOVE,(cx-l),(cy+l),this.PATH_LINE,(cx+l),(cy-l)];
		this.addVectorElement(false,true);
		this.currentpath = stack;
	},
	fillCircle : function(cx,cy,r){
		var stack = this.currentpath;
		this.currentpath = [];
		this.arc(cx,cy,r,0,_2PI,false);
		this.currentpath.push(this.PATH_CLOSE);
		this.addVectorElement(true,false);
		this.currentpath = stack;
	},
	strokeCircle : function(cx,cy,r){
		var stack = this.currentpath;
		this.currentpath = [];
		this.arc(cx,cy,r,0,_2PI,false);
		this.currentpath.push(this.PATH_CLOSE);
		this.addVectorElement(false,true);
		this.currentpath = stack;
	},
	shapeCircle : function(cx,cy,r){
		var stack = this.currentpath;
		this.currentpath = [];
		this.arc(cx,cy,r,0,_2PI,false);
		this.currentpath.push(this.PATH_CLOSE);
		this.addVectorElement(true,true);
		this.currentpath = stack;
	},

	addVectorElement : function(isfill,isstroke){
	var path = this.currentpath.join(' ');
	switch(this.type){
	case SVG:
		var el = _doc.createElementNS(SVGNS,'path');
		el.setAttribute('d', path);
		el.setAttribute(S_ATT_FILL,   (isfill ? parsecolor(this.fillStyle) : S_NONE));
		el.setAttribute(S_ATT_STROKE, (isstroke ? parsecolor(this.strokeStyle) : S_NONE));
		if(isstroke) { el.setAttribute(S_ATT_STROKEWIDTH, this.lineWidth, 'px');}

		this.target.appendChild(el);
		this.lastElement = el;
		break;

	case SL:
		var ar = ['<Path Data="', path ,'"'];
		if(isfill)  { ar.push(' Fill="', parsecolor(this.fillStyle), '"');}
		if(isstroke){ ar.push(' Stroke="', parsecolor(this.strokeStyle), '" StrokeThickness="', this.lineWidth, '"');}
		ar.push(' />');

		var xaml = this.content.createFromXaml(ar.join(''));
		this.lastElement = xaml;
		this.target.children.add(xaml);
		break;

	case VML:
		path = [path, (!isfill ? V_PATH_NOFILL : EMPTY), (!isstroke ? V_PATH_NOSTROKE : EMPTY)].join('');
		var ar = [V_TAG_SHAPE, V_EL_UNSELECTABLE, V_ATT_COORDSIZE, V_ATT_PATH, path, V_ATT_END];
		if(isfill)  { ar.push(V_ATT_FILLCOLOR, parsecolor(this.fillStyle), V_ATT_END);}
		if(isstroke){ ar.push(V_ATT_STROKECOLOR, parsecolor(this.strokeStyle), V_ATT_END, V_ATT_STROKEWEIGHT, this.lineWidth, 'px', V_ATT_END);}
		ar.push(V_TAGEND_NULL);

		this.target.insertAdjacentHTML(BEFOREEND, ar.join(''));
		this.lastElement = this.target.lastChild;
		break;
	}
	if(!!this.vid){ this.elements[this.vid] = this.lastElement;}
	}
};

/* -------------------- */
/*   Canvas�ǉ��֐��Q   */
/* -------------------- */
CanvasRenderingContext2D_wrapper = function(type, idname){
	// canvas�ɑ��݂���v���p�e�B���f�t�H���g�l
	this.fillStyle    = 'black';
	this.strokeStyle  = 'black';
	this.lineWidth    = 1;
	this.font         = '14px system';
	this.textAlign    = 'center';
	this.textBaseline = 'middle';
	this.canvas = null;		// �e�G�������g�ƂȂ�div�G�������g

	// changeOrigin�p
	this.OFFSETX = 0;
	this.OFFSETY = 0;

	// variables for internal
	this.canvasid = '';
	this.child  = null;		// this.canvas�̒����ɂ���G�������g
	this.context  = null;	// �{����CanvasRenderingContext2D�I�u�W�F�N�g

	this.currentLayerId = '_empty';
	this.isedgearray    = {_empty:false};
	this.isedge         = false;

	this.use = new TypeList();
	this.use.vml    = (type===VML);
	this.use.svg    = false;
	this.use.canvas = (type===CANVAS);
	this.use.sl     = (type===SL);
	this.use.flash  = (type===FLASH);

	this.initElement(idname);
};

//function addCanvasFunctions(){ _extend(CanvasRenderingContext2D.prototype, {
CanvasRenderingContext2D_wrapper.prototype = {
	/* extend functions (initialize) */
	initElement : function(idname){
		this.canvasid = EL_ID_HEADER+idname;

		var parent = _doc.getElementById(idname);
		var canvas = _doc.getElementById(this.canvasid);

		if(!canvas){
			canvas = _doc.createElement('canvas');
			canvas.id = this.canvasid;
			parent.appendChild(canvas);
		}

		var rect = getRectSize(parent);
		canvas.width  = rect.width;
		canvas.height = rect.height;
		canvas.style.position = 'relative';
		canvas.style.width  = rect.width + 'px';
		canvas.style.height = rect.height + 'px';

		this.child = canvas;

		var self = this;
		//parent.className = "canvas";
		parent.style.display  = 'block';
		parent.style.position = 'relative';
		parent.style.overflow = 'hidden';
		if(flags.debugmode){
			parent.style.backgroundColor = "#efefef";
			parent.style.border = "solid 1px silver";
		}
		//parent.getContext = function(type){ return canvas.getContext(type);}
		parent.getContext = function(type){
			self.context = canvas.getContext(type);
			return self;
		};
		parent.toDataURL = function(type){ 
			return (!!type ? canvas.toDataURL(type) : canvas.toDataURL());
		};

		this.canvas = parent;
		_initializing--;
	},
	setLayer : function(layerid){
		this.currentLayerId = (!!layerid ? layerid : '_empty');
		if(this.isedgearray[this.currentLayerId] === void 0){
			this.isedgearray[this.currentLayerId] = false;
		}
		this.isedge = this.isedgearray[this.currentLayerId];
	},
	setRendering : function(render){
		this.isedgearray[this.currentLayerId] = (render==='crispEdges');
		this.isedge = this.isedgearray[this.currentLayerId];
	},
	setUnselectable : function(unsel){
		if(unsel===(void 0)){ unsel = true;}else{ unsel = !!unsel;}
		this.canvas.style.MozUserSelect    = (unsel ? 'none' : 'text');
		this.canvas.style.WebkitUserSelect = (unsel ? 'none' : 'text');
		this.canvas.style.userSelect       = (unsel ? 'none' : 'text');
	},
	getContextElement : function(){ return this.child;},
	getLayerElement   : function(){ return this.child;},

	changeSize : function(width,height){
		this.canvas.style.width  = width + 'px';
		this.canvas.style.height = height + 'px';

		var canvas = this.canvas.firstChild;
		var left = parseInt(canvas.style.left), top = parseInt(canvas.style.top);
		width += (left<0?-left:0); height += (top<0?-top:0);
		canvas.style.width  = width + 'px';
		canvas.style.height = height + 'px';
		canvas.width  = width;
		canvas.height = height;
	},
	changeOrigin : function(left,top){
//		var canvas = this.canvas.firstChild;
//		canvas.style.position = 'relative';
//		canvas.style.left = (parseInt(canvas.style.left) - left) + 'px';
//		canvas.style.top  = (parseInt(canvas.style.top ) - top)  + 'px';

		this.OFFSETX = -left;//(left<0?-left:0);
		this.OFFSETY = -top;//(top<0?-top:0);
	},
	clear : function(){
		if(!!this.canvas.style.backgroundColor){
			this.setProperties();
			this.context.fillStyle = parsecolorrev(this.canvas.style.backgroundColor);
			var rect = getRectSize(this.canvas);
			this.context.fillRect(this.OFFSETX,this.OFFSETY,rect.width,rect.height);
		}
	},

	/* �����p�֐� */
	setProperties : function(){
		this.context.fillStyle    = this.fillStyle;
		this.context.strokeStyle  = this.strokeStyle;
		this.context.lineWidth    = this.lineWidth;
		this.context.font         = this.font;
		this.context.textAlign    = this.textAlign;
		this.context.textBaseline = this.textBaseline;
	},

	/* Canvas API functions (for path) */
	beginPath : function(){ this.context.beginPath();},
	closePath : function(){ this.context.closePath();},
	moveTo : function(x,y){
		x = (this.isedge ? _mr(x+this.OFFSETX) : x+this.OFFSETX);
		y = (this.isedge ? _mr(y+this.OFFSETY) : y+this.OFFSETY);
		this.context.moveTo(x,y);
	},
	lineTo : function(x,y){
		x = (this.isedge ? _mr(x+this.OFFSETX) : x+this.OFFSETX);
		y = (this.isedge ? _mr(y+this.OFFSETY) : y+this.OFFSETY);
		this.context.lineTo(x,y);
	},
	rect : function(x,y,w,h){
		x = (this.isedge ? _mr(x+this.OFFSETX) : x+this.OFFSETX);
		y = (this.isedge ? _mr(y+this.OFFSETY) : y+this.OFFSETY);
		w = (this.isedge ? _mr(w) : w);
		h = (this.isedge ? _mr(h) : h);
		this.context.rect(x,y,w,h);
	},
	arc  : function(cx,cy,r,startRad,endRad,antiClockWise){
		cx = (this.isedge ? _mr(cx+this.OFFSETX) : cx+this.OFFSETX);
		cy = (this.isedge ? _mr(cy+this.OFFSETY) : cy+this.OFFSETY);
		this.context.arc(px,py,r,startRad,endRad,antiClockWise);
	},

	/* Canvas API functions (for drawing) */
	fill       : function(){ this.setProperties(); this.context.fill();},
	stroke     : function(){ this.setProperties(); this.context.stroke();},
	fillRect   : function(x,y,w,h){
		x = (this.isedge ? _mr(x+this.OFFSETX) : x+this.OFFSETX);
		y = (this.isedge ? _mr(y+this.OFFSETY) : y+this.OFFSETY);
		w = (this.isedge ? _mr(w) : w);
		h = (this.isedge ? _mr(h) : h);

		this.setProperties();
		this.context.fillRect(x,y,w,h);
	},
	strokeRect : function(x,y,w,h){
		x = (this.isedge ? _mr(x+this.OFFSETX) : x+this.OFFSETX);
		y = (this.isedge ? _mr(y+this.OFFSETY) : y+this.OFFSETY);
		w = (this.isedge ? _mr(w) : w);
		h = (this.isedge ? _mr(h) : h);

		this.setProperties();
		this.context.strokeRect(x,y,w,h);
	},
	fillText : function(text,x,y){
		this.setProperties();
		this.context.fillText(text,x+this.OFFSETX,y+this.OFFSETY);
	},

	/* extended functions */
	shape : function(){
		this.setProperties();
		this.context.fill();
		this.context.stroke();
	},
	shapeRect : function(x,y,w,h){
		x = (this.isedge ? _mr(x) : x);
		y = (this.isedge ? _mr(y) : y);
		w = (this.isedge ? _mr(w) : w);
		h = (this.isedge ? _mr(h) : h);

		this.setProperties();
		this.context.fillRect(x,y,w,h);
		this.context.strokeRect(x,y,w,h);
	},

	setLinePath : function(){
		var _args = arguments, _len = _args.length;
		for(var i=0,len=_len-((_len|1)?1:2);i<len;i+=2){
			var a1 = (this.isedge ? _mr(_args[i]  +this.OFFSETX) : _args[i]  +this.OFFSETX);
				a2 = (this.isedge ? _mr(_args[i+1]+this.OFFSETY) : _args[i+1]+this.OFFSETY);
			if(i==0){ this.context.moveTo(a1,a2);}
			else    { this.context.lineTo(a1,a2);}
		}
		if(_args[_len-1]){ this.context.closePath();}
	},
	setOffsetLinePath : function(){
		var _args = arguments, _len = _args.length, m=[_args[0]+this.OFFSETX,_args[1]+this.OFFSETY];
		for(var i=2,len=_len-((_len|1)?1:2);i<len;i+=2){
			m[i]   = _args[i]   + m[0];
			m[i+1] = _args[i+1] + m[1];
		}
		for(var i=2,len=_len-((_len|1)?1:2);i<len;i+=2){
			var a1 = (this.isedge ? _mr(m[i])   : m[i]);
				a2 = (this.isedge ? _mr(m[i+1]) : m[i+1]);
			if(i===2){ this.context.moveTo(a1,a2);}
			else     { this.context.lineTo(a1,a2);}
		}
		if(_args[_len-1]){ this.context.closePath();}
	},
	setDashSize : function(size){ },

	strokeLine : function(x1,y1,x2,y2){
		x1 = (this.isedge ? _mr(x1+this.OFFSETX) : x1+this.OFFSETX);
		y1 = (this.isedge ? _mr(y1+this.OFFSETY) : y1+this.OFFSETY);
		x2 = (this.isedge ? _mr(x2+this.OFFSETX) : x2+this.OFFSETX);
		y2 = (this.isedge ? _mr(y2+this.OFFSETY) : y2+this.OFFSETY);

		this.setProperties();
		this.context.beginPath();
		this.context.moveTo(x1,y1);
		this.context.lineTo(x2,y2);
		this.context.stroke();
	},
	strokeCross : function(cx,cy,l){
		var x1 = (this.isedge ? _mr(cx-l+this.OFFSETX) : cx-l+this.OFFSETX),
			y1 = (this.isedge ? _mr(cy-l+this.OFFSETY) : cy-l+this.OFFSETY),
			x2 = (this.isedge ? _mr(cx+l+this.OFFSETX) : cx+l+this.OFFSETX),
			y2 = (this.isedge ? _mr(cy+l+this.OFFSETY) : cy+l+this.OFFSETY);

		this.setProperties();
		this.context.beginPath();
		this.context.moveTo(x1,y1);
		this.context.lineTo(x2,y2);
		this.context.moveTo(x1,y2);
		this.context.lineTo(x2,y1);
		this.context.stroke();
	},
	fillCircle : function(cx,cy,r){
		cx = (this.isedge ? _mr(cx+this.OFFSETX) : cx+this.OFFSETX);
		cy = (this.isedge ? _mr(cy+this.OFFSETY) : cy+this.OFFSETY);
		this.setProperties();
		this.context.beginPath();
		this.context.arc(cx,cy,r,0,_2PI,false);
		this.context.fill();
	},
	strokeCircle : function(cx,cy,r){
		cx = (this.isedge ? _mr(cx+this.OFFSETX) : cx+this.OFFSETX);
		cy = (this.isedge ? _mr(cy+this.OFFSETY) : cy+this.OFFSETY);
		this.setProperties();
		this.context.beginPath();
		this.context.arc(cx,cy,r,0,_2PI,false);
		this.context.stroke();
	},
	shapeCircle : function(cx,cy,r){
		cx = (this.isedge ? _mr(cx+this.OFFSETX) : cx+this.OFFSETX);
		cy = (this.isedge ? _mr(cy+this.OFFSETY) : cy+this.OFFSETY);
		this.setProperties();
		this.context.beginPath();
		this.context.arc(cx,cy,r,0,_2PI,false);
		this.context.fill();
		this.context.stroke();
	}

};

/* -------------------- */
/*   Camp�I�u�W�F�N�g   */
/* -------------------- */
var Camp = function(idname, type){
	Camp.initElementById.apply(Camp, [idname, type]);
};
_extend( Camp, {
	/* externs */
	color : _color,
	parse : parsecolor,
	ME    : null,

	/* Selected & Enable types */
	enable  : new TypeList(),
	current : new TypeList(),

	/* functions */
	initAllElements : function(){
		var elements = _doc.getElementsByTagName('camp');
		for(var i=0;i<elements.length;i++){ this.initElementById(elements[i].id, type);}
	},
	initElementsById : function(idlist, type){
		for(var i=0;i<idlist.length;i++){ this.initElementById(idlist[i], type);}
	},
	initElementById : function(idname, type){
		if(!!_doc.getElementById(EL_ID_HEADER + idname)){ return;}
		if(!ME){ initME();}

		var choice = new TypeList();
		if((type===void 0)||(this.enable[type]!==true)){ choice = this.current;}
		else{ choice[type] = true;}

		_initializing++;
		if     (choice.svg){ new VectorContext(SVG, idname);}
		else if(choice.sl) { new VectorContext(SL,  idname);}
		else if(choice.vml){ new VectorContext(VML, idname);}
		else if(choice.canvas){
			new CanvasRenderingContext2D_wrapper(CANVAS, idname);
		}
	},

	select : function(type){
		if(this.enable[type]!==true){ return false;}
		for(var i=0;i<_types.length;i++){ this.current[_types[i]]=false;}
		this.current[type] = true;
		return true;
	},
	setflags : function(type, value){
		flags[type] = value;
	},

	isready : function(){ return (_initializing===0);}
});

/* ----------------------------------------------- */
/* Camp.enable, Camp.current�I�u�W�F�N�g�f�[�^�ݒ� */
/* ----------------------------------------------- */

//	/* Camp.enable �ݒ� */
	Camp.enable.canvas = (!!_doc.createElement('canvas').getContext);
	Camp.enable.svg    = (!!_doc.createElementNS && !!_doc.createElementNS(SVGNS, 'svg').suspendRedraw);
	Camp.enable.sl     = (function(){ try{ return (new ActiveXObject("AgControl.AgControl")).IsVersionSupported("1.0");}catch(e){} return false;})();
	Camp.enable.flash  = false;
	Camp.enable.vml    = _IE;

//	/* Camp.current�ݒ� */
	for(var i=0;i<_types.length;i++){ Camp.current[_types[i]]=false;}
	if     (Camp.enable.svg)   { Camp.current.svg    = true;}
	else if(Camp.enable.canvas){ Camp.current.canvas = true;}
	else if(Camp.enable.sl)    { Camp.current.sl     = true;}
	else if(Camp.enable.flash) { Camp.current.flash  = true;}
	else if(Camp.enable.vml)   { Camp.current.vml    = true;}

	/* �����ݒ� for VML */
	if(Camp.enable.vml){
		/* addNameSpace for VML */
		_doc.namespaces.add("v", "urn:schemas-microsoft-com:vml");

		/* addStyleSheet for VML */
		var text = [];
		text.push("v\\:shape, v\\:group, v\\:polyline { behavior: url(#default#VML); position:absolute; width:10px; height:10px; }");
		text.push("v\\:path, v\\:textpath, v\\:stroke { behavior: url(#default#VML); }");
		_doc.write('<style type="text/css" rel="stylesheet">');
		_doc.write(text.join(''));
		_doc.write('</style>');
	}

	/* �����ݒ� for Camp�^�O */
	var text = [];
	text.push("camp { display: block; }\n");
	_doc.write('<style type="text/css" rel="stylesheet">');
	_doc.write(text.join(''));
	_doc.write('</style>');

		// IE�p�n�b�N
	if(_IE){ _doc.createElement('camp');}

	_win.Camp = Camp;

})();

//----------------------------------------------------------------------------
// ���O���[�o���ϐ�
//---------------------------------------------------------------------------
// Pos�N���X
Pos = function(xx,yy){ this.x = xx; this.y = yy;};
Pos.prototype = {
	set : function(xx,yy){ this.x = xx; this.y = yy;},
	clone : function(){ return new Pos(this.x, this.y);}
};

// �e��p�����[�^�̒�`
var k = {
	// �e�p�Y����setting()�֐��Őݒ肳������
	qcols    : 0,			// �Ֆʂ̉���
	qrows    : 0,			// �Ֆʂ̏c��
	irowake  : 0,			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

	iscross  : 0,			// 1:�Ֆʓ�����Cross������p�Y�� 2:�O�g����܂߂�Cross������p�Y��
	isborder : 0,			// 1:Border/Line������\�ȃp�Y�� 2:�O�g�������\�ȃp�Y��
	isexcell : 0,			// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

	isLineCross    : false,	// ������������p�Y��
	isCenterLine   : false,	// �}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
	isborderAsLine : false,	// ���E����line�Ƃ��Ĉ���
	hasroom        : false,	// �������̗̈�ɕ�����Ă���/������p�Y��
	roomNumber     : false,	// ���̐����������̍����1��������p�Y��

	dispzero       : false,	// 0��\�����邩�ǂ���
	isDispHatena   : true,	// qnum��-2�̂Ƃ��ɁH��\������
	isAnsNumber    : false,	// �񓚂ɐ�������͂���p�Y��
	NumberWithMB   : false,	// �񓚂̐����Ɓ��~������p�Y��
	linkNumber     : false,	// �������ЂƂȂ���ɂȂ�p�Y��

	BlackCell      : false,	// ���}�X����͂���p�Y��
	NumberIsWhite  : false,	// �����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
	RBBlackCell    : false,	// �A�����f�ւ̃p�Y��
	checkBlackCell : false,	// ��������ō��}�X�̏����`�F�b�N����p�Y��
	checkWhiteCell : false,	// ��������Ŕ��}�X�̏����`�F�b�N����p�Y��

	ispzprv3ONLY   : false,	// �ς��Ղ�A�v���b�g�ɂ͑��݂��Ȃ��p�Y��
	isKanpenExist  : false,	// pencilbox/�J���y���ɂ���p�Y��

	// �e�p�Y����setting()�֐��Őݒ肳��邱�Ƃ��������
	bdmargin       : 0.70,	// �g�O�̈�ӂ�margin(�Z�������Z)
	bdmargin_image : 0.10,	// �摜�o�͎���bdmargin�l

	// �����Ŏ����I�ɐݒ肳���O���[�o���ϐ�
	puzzleid  : '',			// �p�Y����ID("creek"�Ȃ�)

	EDITOR    : true,		// �G�f�B�^���[�h
	PLAYER    : false,		// player���[�h
	editmode  : true,		// ���z�u���[�h
	playmode  : false,		// �񓚃��[�h

	cellsize : 36,			// �f�t�H���g�̃Z���T�C�Y
	cwidth   : 36,			// �Z���̉���
	cheight  : 36,			// �Z���̏c��
	bwidth   : 18,			// �Z���̉���/2
	bheight  : 18,			// �Z���̏c��/2

	p0       : new Pos(0, 0),	// Canvas���ł̔Ֆʂ̍�����W
	cv_oft   : new Pos(0, 0),	// Canvas��window���ł̍�����W

	br:{
		IE    : (!!(window.attachEvent && !window.opera)),
		Opera : (!!window.opera),
		WebKit: (navigator.userAgent.indexOf('AppleWebKit/') > -1),
		Gecko : (navigator.userAgent.indexOf('Gecko')>-1 && navigator.userAgent.indexOf('KHTML') == -1),

		WinWebKit: (navigator.userAgent.indexOf('AppleWebKit/') > -1 && navigator.userAgent.indexOf('Win') > -1),
		IEmoz4   : (!!(window.attachEvent && !window.opera) && navigator.userAgent.indexOf('Mozilla/4.0') > -1)
	},
	vml : Camp.current.vml,

	// const�l
	BOARD  : 'board',
	CELL   : 'cell',
	CROSS  : 'cross',
	BORDER : 'border',
	EXCELL : 'excell',

	QUES  : 'ques',
	QNUM  : 'qnum',
	DIREC : 'direc',
	QANS  : 'qans',
	LINE  : 'line',
	QSUB  : 'qsub',

	UP : 1,		// up
	DN : 2,		// down
	LT : 3,		// left
	RT : 4,		// right

	KEYUP : 'up',
	KEYDN : 'down',
	KEYLT : 'left',
	KEYRT : 'right',

	// for_test.js�p
	scriptcheck : false
};

//---------------------------------------------------------------------------
// �����̑��̃O���[�o���ϐ�
//---------------------------------------------------------------------------
var g;				// �O���t�B�b�N�R���e�L�X�g
var Puzzles = [];	// �p�Y���ʃN���X
var _doc = document;

// localStorage���Ȃ���globalStorage�Ή�(Firefox3.0)�u���E�U�̃n�b�N
if(typeof localStorage != "object" && typeof globalStorage == "object"){
	localStorage = globalStorage[location.host];
}

//---------------------------------------------------------------------------
// �����ʃO���[�o���֐�
// mf()            �����_�ȉ���؎̂Ă�(��int())
// f_true()        true��Ԃ��֐��I�u�W�F�N�g(�����ɋ�֐��������̂��߂�ǂ������̂�)
//---------------------------------------------------------------------------
var mf = Math.floor;
function f_true(){ return true;}

//---------------------------------------------------------------------------
// ��ElementManager�N���X Element�֌W�̏���
//    ee() �w�肵��id��ElementExt���擾����
//---------------------------------------------------------------------------
(function(){

// definition
var
	// local scope
	_doc = document,
	_win = this,

	// browsers
	_IE     = k.br.IE,

	/* ��������N���X��`�ł�  var�Ńh�b�g�t���́A�ō��ӂɒu���܂��� */

	// define and map _ElementManager class
	_ELm = _ElementManager = _win.ee = function(id){
		if(typeof id === 'string'){
			if(!_elx[id]){
				var el = _doc.getElementById(id);
				if(!el){ return null;}
				_elx[id] = new _ELx(el);
			}
			return _elx[id];
		}

		var el = id;
		if(!!el.id){
			if(!_elx[el.id]){ _elx[el.id] = new _ELx(el);}
			return _elx[el.id];
		}

		return ((!!el) ? new _ELx(el) : null);
	},
	_elx = _ElementManager._cache    = {},
	_elp = _ElementManager._template = [],
	_elpcnt = _ElementManager._tempcnt = 0;

	// define and map _ElementManager.ElementExt class
	_ELx = _ElementManager.ElementExt = function(el){
		this.el     = el;
		this.parent = el.parentNode;
		this.pdisp  = 'none';
	},
	_ELp = _ElementManager.ElementTemplate = function(parent, tag, attr, style, func){
		this.parent  = parent;
		this.tagName = tag;
		this.attr    = attr;
		this.style   = style;
		this.func    = func;
	},

	// Utility functions
	_extend = function(obj, ads){
		for(var name in ads){ obj[name] = ads[name];}
	},
	_toArray = function(args){
		if(!args){ return [];}
		var array = [];
		for(var i=0,len=args.length;i<len;i++){ array[i]=args[i];}
		return array;
	}
;

// implementation of _ElementManage class
_extend( _ElementManager, {

	//----------------------------------------------------------------------
	// ee.clean()  �����p�̕ϐ�������������
	//----------------------------------------------------------------------
	clean : function(){
		_elx = null;
		_elx = {};
		_elpcnt  = 0;
		_elp = null;
		_elp = [];
	},

	//----------------------------------------------------------------------
	// ee.addTemplate()  �w�肵�����e��ElementTemplate���쐬����ID��Ԃ�
	// ee.createEL()     ElementTemplate����G�������g���쐬���ĕԂ�
	//----------------------------------------------------------------------
	addTemplate : function(parent, tag, attr_i, style_i, func_i){
		if(!tag){ return;}

		if(!parent){ parent = null;}
		else if(typeof parent == 'string'){ parent = ee(parent).el;}

		var attr  = {};
		var style = (style_i || {});
		var func  = (func_i  || {});

		if(!!attr_i){
			for(var name in attr_i){
				if(name==='unselectable' && attr_i[name]==='on'){
					style['userSelect'] = style['MozUserSelect'] = style['KhtmlUserSelect'] = 'none';
					attr['unselectable'] = 'on';
				}
				else{ attr[name] = attr_i[name];}
			}
		}

		_elp[_elpcnt++] = new _ELp(parent, tag, attr, style, func_i);
		return (_elpcnt-1);
	},
	createEL : function(tid, id){
		if(!_elp[tid]){ return null;}

		var temp = _elp[tid];
		var el = _doc.createElement(temp.tagName);

		if(!!id){ el.id = id;}
		for(var name in temp.attr) { el[name]       = temp.attr[name]; }
		for(var name in temp.style){ el.style[name] = temp.style[name];}
		for(var name in temp.func) { el["on"+name]  = temp.func[name]; }

		if(!!temp.parent){ temp.parent.appendChild(el);} // ��낶��Ȃ���IE�ŃG���[�ɂȂ�B�B
		return el;
	},

	//----------------------------------------------------------------------
	// ee.getSrcElement() �C�x���g���N�������G�������g��Ԃ�
	// ee.pageX()         �C�x���g���N�������y�[�W���X���W��Ԃ�
	// ee.pageY()         �C�x���g���N�������y�[�W���Y���W��Ԃ�
	// ee.windowWidth()   �E�B���h�E�̕���Ԃ�
	// ee.windowHeight()  �E�B���h�E�̍�����Ԃ�
	//----------------------------------------------------------------------
	getSrcElement : function(e){
		return e.target || e.srcElement;
	},
	pageX : (
		((!_IE) ?
			function(e){ return e.pageX;}
		:
			function(e){ return e.clientX + (_doc.documentElement.scrollLeft || _doc.body.scrollLeft);}
		)
	),
	pageY : (
		((!_IE) ?
			function(e){ return e.pageY;}
		:
			function(e){ return e.clientY + (_doc.documentElement.scrollTop  || _doc.body.scrollTop);}
		)
	),

	windowWidth : (
		((_doc.all) ?
			function(){ return _doc.body.clientWidth;}
		:(_doc.layers || _doc.getElementById)?
			function(){ return innerWidth;}
		:
			function(){ return 0;}
		)
	),
	windowHeight : (
		((_doc.all) ?
			function(){ return _doc.body.clientHeight;}
		:(_doc.layers || _doc.getElementById)?
			function(){ return innerHeight;}
		:
			function(){ return 0;}
		)
	),

	//----------------------------------------------------------------------
	// ee.binder()   this��bind����
	// ee.ebinder()  this�ƃC�x���g��bind����
	//----------------------------------------------------------------------
	binder : function(){
		var args=_toArray(arguments); var obj = args.shift(), __method = args.shift();
		return function(){
			return __method.apply(obj, (args.length>0?args[0]:[]).concat(_toArray(arguments)));
		}
	},
	ebinder : function(){
		var args=_toArray(arguments); var obj = args.shift(), __method = args.shift(), rest = (args.length>0?args[0]:[]);
		return function(e){
			return __method.apply(obj, [e||_win.event].concat(args.length>0?args[0]:[]).concat(_toArray(arguments)));
		}
	},

	//----------------------------------------------------------------------
	// ee.stopPropagation() �C�x���g�̋N�������G�������g����ɃC�x���g��
	//                      �`�d�����Ȃ��悤�ɂ���
	// ee.preventDefault()  �C�x���g�̋N�������G�������g�ŁA�f�t�H���g��
	//                      �C�x���g���N����Ȃ��悤�ɂ���
	//----------------------------------------------------------------------
	stopPropagation : function(e){
		if(!!e.stopPropagation){ e.stopPropagation();}
		else{ e.cancelBubble = true;}
	},
	preventDefault : function(e){
		if(!!e.preventDefault){ e.preventDefault();}
		else{ e.returnValue = true;}
	}
});

// implementation of _ElementManager.ElementExt class
_ElementManager.ElementExt.prototype = {
	//----------------------------------------------------------------------
	// ee.getRect()   �G�������g�̎l�ӂ̍��W��Ԃ�
	// ee.getWidth()  �G�������g�̕���Ԃ�
	// ee.getHeight() �G�������g�̍�����Ԃ�
	//----------------------------------------------------------------------
	getRect : (
		((!!document.createElement('div').getBoundingClientRect) ?
			((!_IE) ?
				function(){
					var _html = _doc.documentElement, _body = _doc.body, rect = this.el.getBoundingClientRect();
					var left   = rect.left   + _win.scrollX;
					var top    = rect.top    + _win.scrollY;
					var right  = rect.right  + _win.scrollX;
					var bottom = rect.bottom + _win.scrollY;
					return { top:top, bottom:bottom, left:left, right:right};
				}
			:
				function(){
					var _html = _doc.documentElement, _body = _doc.body, rect = this.el.getBoundingClientRect();
					var left   = rect.left   + ((_body.scrollLeft || _html.scrollLeft) - _html.clientLeft);
					var top    = rect.top    + ((_body.scrollTop  || _html.scrollTop ) - _html.clientTop );
					var right  = rect.right  + ((_body.scrollLeft || _html.scrollLeft) - _html.clientLeft);
					var bottom = rect.bottom + ((_body.scrollTop  || _html.scrollTop ) - _html.clientTop );
					return { top:top, bottom:bottom, left:left, right:right};
				}
			)
		:
			function(){
				var left = 0, top = 0, el = this.el;
				while(!!el){
					left += +(!isNaN(el.offsetLeft) ? el.offsetLeft : el.clientLeft);
					top  += +(!isNaN(el.offsetTop)  ? el.offsetTop  : el.clientTop );
					el = el.offsetParent;
				}
				var right  = left + (this.el.offsetWidth  || this.el.clientWidth);
				var bottom = top  + (this.el.offsetHeight || this.el.clientHeight);
				return { top:top, bottom:bottom, left:left, right:right};
			}
		)
	),
	getWidth  : function(){ return this.el.offsetWidth  || this.el.clientWidth; },
	getHeight : function(){ return this.el.offsetHeight || this.el.clientHeight;},

	//----------------------------------------------------------------------
	// ee.unselectable()         �G�������g��I���ł��Ȃ�����
	// ee.replaceChildrenClass() �q�v�f�̃N���X��ύX����
	// ee.remove()               �G�������g���폜����
	// ee.removeNextAll()        �����e�v�f�������A���������ɂ���G�������g���폜����
	//----------------------------------------------------------------------
	unselectable : function(){
		this.el.style.MozUserSelect   = 'none';
		this.el.style.KhtmlUserSelect = 'none';
		this.el.style.userSelect      = 'none';
		this.el.unselectable = "on";
		return this;
	},

	replaceChildrenClass : function(before, after){
		var el = this.el.firstChild;
		while(!!el){
			if(el.className===before){ el.className = after;}
			el = el.nextSibling;
		}
	},

	remove : function(){
		this.parent.removeChild(this.el);
		return this;
	},
	removeNextAll : function(targetbase){
		var el = this.el.lastChild;
		while(!!el){
			if(el===targetbase){ break;}
			if(!!el){ this.el.removeChild(el);}else{ break;}

			el = this.el.lastChild;
		}
		return this;
	},

	//----------------------------------------------------------------------
	// ee.appendHTML() �w�肵��HTML������span�G�������g���q�v�f�̖����ɒǉ�����
	// ee.appendBR()   <BR>���q�v�f�̖����ɒǉ�����
	// ee.appendEL()   �w�肵���G�������g���q�v�f�̖����ɒǉ�����
	// ee.appendTo()   �������w�肵���e�v�f�̖����ɒǉ�����
	// ee.insertBefore() �G�������g�������̑O�ɒǉ�����
	// ee.insertAfter()  �G�������g�������̌��ɒǉ�����
	//----------------------------------------------------------------------
	appendHTML : function(html){
		var sel = _doc.createElement('span');
		sel.innerHTML = html;
		this.el.appendChild(sel);
		return this;
	},
	appendBR : function(){
		this.el.appendChild(_doc.createElement('br'));
		return this;
	},
	appendEL : function(el){
		this.el.appendChild(el);
		return this;
	},

	appendTo : function(elx){
		elx.el.appendChild(this.el);
		this.parent = elx.el;
		return this;
	},

	insertBefore : function(baseel){
		this.parent = baseel.parentNode;
		this.parent.insertBefore(this.el,baseel);
		return this;
	},
	insertAfter : function(baseel){
		this.parent = baseel.parentNode;
		this.parent.insertBefore(this.el,baseel.nextSibling);
		return this;
	}
};

})();

//---------------------------------------------------------------------------
// ��Timer�N���X
//---------------------------------------------------------------------------
Timer = function(){
	// ** ��ʃ^�C�}�[
	this.TID;				// �^�C�}�[ID
	this.timerInterval = 100;

	this.st       = 0;		// �^�C�}�[�X�^�[�g����getTime()�擾�l(�~���b)
	this.current  = 0;		// ���݂�getTime()�擾�l(�~���b)

	// �o�ߎ��ԕ\���p�ϐ�
	this.bseconds = 0;		// �O�񃉃x���ɕ\����������(�b��)
	this.timerEL = ee('timerpanel').el;

	// ������������p�ϐ�
	this.lastAnsCnt  = 0;	// �O�񐳓����肵�����́AOperationManager�ɋL�^����Ă����/�񓚓��͂̃J�E���g
	this.worstACtime = 0;	// ��������ɂ����������Ԃ̍ň��l(�~���b)
	this.nextACtime  = 0;	// ���Ɏ����������胋�[�`���ɓ��邱�Ƃ��\�ɂȂ鎞��

	// ��ʃ^�C�}�[�X�^�[�g
	this.start();

	// ** Undo�^�C�}�[
	this.TIDundo = null;	// �^�C�}�[ID
	this.undoInterval = 25

	// Undo/Redo�p�ϐ�
	this.undoWaitTime  = 300;	// 1��ڂ�wait�𑽂�����邽�߂̒l
	this.undoWaitCount = 0;

	if(k.br.IE){
		this.timerInterval *= 2;
		this.undoInterval  *= 2;
	}
};
Timer.prototype = {
	//---------------------------------------------------------------------------
	// tm.now()        ���݂̎��Ԃ��擾����
	// tm.reset()      �^�C�}�[�̃J�E���g��0�ɂ��āA�X�^�[�g����
	// tm.start()      update()�֐���200ms�Ԋu�ŌĂяo��
	// tm.update()     200ms�P�ʂŌĂяo�����֐�
	//---------------------------------------------------------------------------
	now : function(){ return (new Date()).getTime();},
	reset : function(){
		this.worstACtime = 0;
		this.timerEL.innerHTML = this.label()+"00:00";

		clearInterval(this.TID);
		this.start();
	},
	start : function(){
		this.st = this.now();
		this.TID = setInterval(ee.binder(this, this.update), this.timerInterval);
	},
	update : function(){
		this.current = this.now();

		if(k.PLAYER){ this.updatetime();}
		if(pp.getVal('autocheck')){ this.ACcheck();}
	},

	//---------------------------------------------------------------------------
	// tm.updatetime() �b���̕\�����s��
	// tm.label()      �o�ߎ��Ԃɕ\�����镶�����Ԃ�
	//---------------------------------------------------------------------------
	updatetime : function(){
		var seconds = mf((this.current - this.st)/1000);
		if(this.bseconds == seconds){ return;}

		var hours   = mf(seconds/3600);
		var minutes = mf(seconds/60) - hours*60;
		seconds = seconds - minutes*60 - hours*3600;

		if(minutes < 10) minutes = "0" + minutes;
		if(seconds < 10) seconds = "0" + seconds;

		this.timerEL.innerHTML = [this.label(), (!!hours?hours+":":""), minutes, ":", seconds].join('');

		this.bseconds = seconds;
	},
	label : function(){
		return menu.isLangJP()?"�o�ߎ��ԁF":"Time: ";
	},

	//---------------------------------------------------------------------------
	// tm.ACcheck()    �������𔻒���Ăяo��
	//---------------------------------------------------------------------------
	ACcheck : function(){
		if(this.current>this.nextACtime && this.lastAnsCnt!=um.anscount && !ans.inCheck){
			this.lastAnsCnt = um.anscount;
			if(!ans.autocheck()){ return;}

			this.worstACtime = Math.max(this.worstACtime, (this.now()-this.current));
			this.nextACtime = this.current + (this.worstACtime<250 ? this.worstACtime*4+120 : this.worstACtime*2+620);
		}
	},

	//---------------------------------------------------------------------------
	// tm.startUndoTimer()  Undo/Redo�Ăяo�����J�n����
	// tm.stopUndoTimer()   Undo/Redo�Ăяo�����I������
	// tm.procUndo()        Undo/Redo�Ăяo�������s����
	// tm.execUndo()        Undo/Redo�֐����Ăяo��
	//---------------------------------------------------------------------------
	startUndoTimer : function(){
		this.undoWaitCount = this.undoWaitTime/this.undoInterval;
		if(!this.TIDundo){ this.TIDundo = setInterval(ee.binder(this, this.procUndo), this.undoInterval);}
		this.execUndo();
	},
	stopUndoTimer : function(){
		kc.inUNDO=false;
		kc.inREDO=false;
		clearInterval(this.TIDundo);
		this.TIDundo = null;
	},
	procUndo : function(){
		if(!kc.isCTRL || (!kc.inUNDO && !kc.inREDO)){ this.stopUndoTimer();}
		else if(this.undoWaitCount>0)               { this.undoWaitCount--;}
		else{ execUndo();}
	},
	execUndo : function(){
		if     (kc.inUNDO){ um.undo();}
		else if(kc.inREDO){ um.redo();}
	}
};

//---------------------------------------------------------------------------
// ��Cell�N���X Board�N���X��Cell�̐������ێ�����
//---------------------------------------------------------------------------
// �{�[�h�����o�f�[�^�̒�`(1)
// Cell�N���X�̒�`
Cell = function(id){
	this.bx;	// �Z����X���W(border���W�n)��ێ�����
	this.by;	// �Z����Y���W(border���W�n)��ێ�����
	this.px;	// �Z���̕`��pX���W��ێ�����
	this.py;	// �Z���̕`��pY���W��ێ�����
	this.cpx;	// �Z���̕`��p���SX���W��ێ�����
	this.cpy;	// �Z���̕`��p���SY���W��ێ�����

	this.ques;	// �Z���̖��f�[�^(�`��)��ێ�����
	this.qnum;	// �Z���̖��f�[�^(����)��ێ�����(���� or �J�b�N���̉E��)
	this.direc;	// �Z���̖��f�[�^(����)��ێ�����(��� or �J�b�N���̉���)
	this.qans;	// �Z���̉񓚃f�[�^��ێ�����(���}�X or �񓚐���)
	this.qsub;	// �Z���̕⏕�f�[�^��ێ�����(���}�X or �w�i�F)
	this.error;	// �G���[�f�[�^��ێ�����

	this.allclear(id);
};
Cell.prototype = {
	//---------------------------------------------------------------------------
	// cell.allclear() �Z���̈ʒu,�`����ȊO���N���A����
	// cell.ansclear() �Z����qans,qsub,error�����N���A����
	// cell.subclear() �Z����qsub,error�����N���A����
	// cell.isempty()  �v���p�e�B�������l�Ɠ��������ʂ���
	//---------------------------------------------------------------------------
	allclear : function(num) {
		this.ques = 0;
		this.qans = -1;
		this.qsub = 0;
		this.ques = 0;
		this.qnum = -1;
		this.direc = 0;
		this.error = 0;
		if(k.puzzleid==="tilepaint"||k.puzzleid==="kakuro"){ this.qnum = this.direc = 0;}
		if(k.puzzleid==="triplace"){ this.qnum = this.direc = -1;}
	},
	ansclear : function(num) {
		this.qans = -1;
		this.qsub = 0;
		this.error = 0;
	},
	subclear : function(num) {
		this.qsub = 0;
		this.error = 0;
	},
	isempty : function(){
		return ((this.qans === bd.defcell.qans) &&
				(this.qsub === bd.defcell.qsub) &&
				(this.ques === bd.defcell.ques) &&
				(this.qnum === bd.defcell.qnum) &&
				(this.direc=== bd.defcell.direc));
	}
};

//---------------------------------------------------------------------------
// ��Cross�N���X Board�N���X��Cross�̐������ێ�����(iscross==1�̎�)
//---------------------------------------------------------------------------
// �{�[�h�����o�f�[�^�̒�`(2)
// Cross�N���X�̒�`
Cross = function(id){
	this.bx;	// �����_��X���W(border���W�n)��ێ�����
	this.by;	// �����_��Y���W(border���W�n)��ێ�����
	this.px;	// �����_�̕`��pX���W��ێ�����
	this.py;	// �����_�̕`��pY���W��ێ�����

	this.ques;	// �����_�̖��f�[�^(���_)��ێ�����
	this.qnum;	// �����_�̖��f�[�^(����)��ێ�����
	this.error;	// �G���[�f�[�^��ێ�����

	this.allclear(id);
};
Cross.prototype = {
	//---------------------------------------------------------------------------
	// cross.allclear() �����_�̈ʒu,�`����ȊO���N���A����
	// cross.ansclear() �����_��error�����N���A����
	// cross.subclear() �����_��error�����N���A����
	// cross.isempty()  �v���p�e�B�������l�Ɠ��������ʂ���
	//---------------------------------------------------------------------------
	allclear : function(num) {
		this.ques = 0;
		this.qnum = -1;
		this.error = 0;
	},
	ansclear : function(num) {
		this.error = 0;
	},
	subclear : function(num) {
		this.error = 0;
	},
	isempty : function(){
		return (this.qnum===bd.defcross.qnum);
	}
};

//---------------------------------------------------------------------------
// ��Border�N���X Board�N���X��Border�̐������ێ�����(isborder==1�̎�)
//---------------------------------------------------------------------------
// �{�[�h�����o�f�[�^�̒�`(3)
// Border�N���X�̒�`
Border = function(id){
	this.bx;	// ���E����X���W(border���W�n)��ێ�����
	this.by;	// ���E����Y���W(border���W�n)��ێ�����
	this.px;	// ���E���̕`��X���W��ێ�����
	this.py;	// ���E���̕`��Y���W��ێ�����

	this.ques;	// ���E���̖��f�[�^��ێ�����(���E�� or �}�C�i���Y���̕s����)
	this.qnum;	// ���E���̖��f�[�^��ێ�����(�}�C�i���Y���̐���)
	this.qans;	// ���E���̉񓚃f�[�^��ێ�����(�񓚋��E�� or �X�������Ȃǂ̐�)
	this.qsub;	// ���E���̕⏕�f�[�^��ێ�����(1:�⏕��/2:�~)
	this.line;	// ���̉񓚃f�[�^��ێ�����
	this.color;	// ���̐F�����f�[�^��ێ�����
	this.error;	// �G���[�f�[�^��ێ�����

	this.cellcc  = [-1,-1];	// �אڃZ����ID
	this.crosscc = [-1,-1];	// �אڌ�_��ID

	this.allclear(id);
};
Border.prototype = {
	//---------------------------------------------------------------------------
	// border.allclear() ���E���̈ʒu,�`����ȊO���N���A����
	// border.ansclear() ���E����qans,qsub,line,color,error�����N���A����
	// border.subclear() ���E����qsub,error�����N���A����
	// border.isempty()  �v���p�e�B�������l�Ɠ��������ʂ���
	//---------------------------------------------------------------------------
	allclear : function(num) {
		this.ques = 0;
		if(k.puzzleid==="mejilink" && num<k.qcols*(k.qrows-1)+(k.qcols-1)*k.qrows){ this.ques = 1;}
		this.qnum = -1;
		if(k.puzzleid==="tentaisho"){ this.qnum = 0;}
		this.qans = 0;
		this.qsub = 0;
		if(k.puzzleid==="bosanowa"){ this.qsub = -1;}
		this.line = 0;
		this.color = "";
		this.error = 0;
	},
	ansclear : function(num) {
		this.qans = 0;
		this.qsub = 0;
		if(k.puzzleid==="bosanowa"){ this.qsub = -1;}
		this.line = 0;
		this.color = "";
		this.error = 0;
	},
	subclear : function(num) {
		this.qsub = 0;
		if(k.puzzleid==="bosanowa"){ this.qsub = -1;}
		this.error = 0;
	},
	isempty : function(){
		return ((this.qans === bd.defborder.qans) &&
				(this.qsub === bd.defborder.qsub) &&
				(this.ques === bd.defborder.ques) &&
				(this.qnum === bd.defborder.qnum) &&
				(this.line === bd.defborder.line));
	}
};

//---------------------------------------------------------------------------
// ��EXCell�N���X Board�N���X��EXCell�̐������ێ�����
//---------------------------------------------------------------------------
// �{�[�h�����o�f�[�^�̒�`(4)
// EXCell�N���X�̒�`
EXCell = function(id){
	this.bx;	// �Z����X���W(border���W�n)��ێ�����
	this.by;	// �Z����Y���W(border���W�n)��ێ�����
	this.px;	// �Z���̕`��pX���W��ێ�����
	this.py;	// �Z���̕`��pY���W��ێ�����

	this.qnum;	// �Z���̖��f�[�^(����)��ێ�����(���� or �J�b�N���̉E��)
	this.direc;	// �Z���̖��f�[�^(����)��ێ�����(��� or �J�b�N���̉���)

	this.allclear(id);
};
EXCell.prototype = {
	//---------------------------------------------------------------------------
	// excell.allclear() �Z���̈ʒu,�`����ȊO���N���A����
	// excell.ansclear() �Z����error�����N���A����
	// excell.subclear() �Z����error�����N���A����
	// excell.isempty()  �v���p�e�B�������l�Ɠ��������ʂ���
	//---------------------------------------------------------------------------
	allclear : function(num) {
		this.qnum = -1;
		if(k.puzzleid==="box"){ this.qnum = 0;}
		this.direc = 0;
		this.error = 0;
		if(k.puzzleid==="tilepaint"||k.puzzleid==="kakuro"){ this.qnum = this.direc = 0;}
		if(k.puzzleid==="triplace"){ this.qnum = this.direc = -1;}
	},
	ansclear : function(num) {
		this.error = 0;
	},
	subclear : function(num) {
		this.error = 0;
	},
	isempty : function(){
		return ((this.qnum === bd.defexcell.qnum) &&
				(this.direc=== bd.defexcell.direc));
	}
};

//---------------------------------------------------------------------------
// ��Board�N���X �Ֆʂ̏���ێ�����BCell, Cross, Border�̃I�u�W�F�N�g���ێ�����
//---------------------------------------------------------------------------
// Board�N���X�̒�`
Board = function(){
	this.cell   = [];
	this.cross  = [];
	this.border = [];
	this.excell = [];

	this.cellmax   = 0;		// �Z���̐�
	this.crossmax  = 0;		// ��_�̐�
	this.bdmax     = 0;		// ���E���̐�
	this.excellmax = 0;		// �g���Z���̐�

	this._cnum  = {};		// cnum�֐��̃L���b�V��
	this._xnum  = {};		// xnum�֐��̃L���b�V��
	this._bnum  = {};		// bnum�֐��̃L���b�V��
	this._exnum = {};		// exnum�֐��̃L���b�V��

	this.bdinside = 0;		// �Ֆʂ̓���(�O�g��łȂ�)�ɑ��݂��鋫�E���̖{��

	this.maxnum   = 255;	// ���͂ł���ő�̐���

	// �Ֆʂ͈̔�
	this.minbx = 0;
	this.minby = 0;
	this.maxbx = 2*k.qcols;
	this.maxby = 2*k.qrows;

	// �f�t�H���g�̃Z���Ȃ�
	this.defcell   = new Cell(0);
	this.defcross  = new Cross(0);
	this.defborder = new Border(0);
	this.defexcell = new EXCell(0);

	this.enableLineNG = false;

	this.initBoardSize(k.qcols,k.qrows);
	this.setFunctions();
};
Board.prototype = {
	//---------------------------------------------------------------------------
	// bd.initBoardSize() �w�肳�ꂽ�T�C�Y�ŔՖʂ̏��������s��
	// bd.initSpecial()   �p�Y���ʂŏ��������s��������������͂���
	//---------------------------------------------------------------------------
	initBoardSize : function(col,row){
						{ this.initGroup(k.CELL,   col, row);}
		if(!!k.iscross) { this.initGroup(k.CROSS,  col, row);}
		if(!!k.isborder){ this.initGroup(k.BORDER, col, row);}
		if(!!k.isexcell){ this.initGroup(k.EXCELL, col, row);}

		this.initSpecial(col,row);

		k.qcols = col;
		k.qrows = row;

		this.setminmax();
		this.setposAll();
		if(!base.initProcess){ this.allclear();}
	},
	initSpecial : function(){ },

	//---------------------------------------------------------------------------
	// bd.initGroup()     �����r���āA�I�u�W�F�N�g�̒ǉ����폜���s��
	// bd.getGroup()      �w�肵���^�C�v�̃I�u�W�F�N�g�z���Ԃ�
	// bd.estimateSize()  �w�肵���I�u�W�F�N�g�������ɂȂ邩�v�Z���s��
	// bd.newObject()     �w�肳�ꂽ�^�C�v�̐V�����I�u�W�F�N�g��Ԃ�
	//---------------------------------------------------------------------------
	initGroup : function(type, col, row){
		var group = this.getGroup(type);
		var len = this.estimateSize(type, col, row), clen = group.length;
		// �����̃T�C�Y��菬�����Ȃ�Ȃ�delete����
		if(clen>len){
			for(var id=clen-1;id>=len;id--){ delete group[id]; group.pop();}
		}
		// �����̃T�C�Y���傫���Ȃ�Ȃ�ǉ�����
		else if(clen<len){
			for(var id=clen;id<len;id++){ group.push(this.newObject(type,id));}
		}
		this.setposGroup(type);
		return (len-clen);
	},
	getGroup : function(type){
		if     (type===k.CELL)  { return this.cell;}
		else if(type===k.CROSS) { return this.cross;}
		else if(type===k.BORDER){ return this.border;}
		else if(type===k.EXCELL){ return this.excell;}
		return [];
	},
	estimateSize : function(type, col, row){
		if     (type===k.CELL)  { return col*row;}
		else if(type===k.CROSS) { return (col+1)*(row+1);}
		else if(type===k.BORDER){
			if     (k.isborder===1){ return 2*col*row-(col+row);}
			else if(k.isborder===2){ return 2*col*row+(col+row);}
		}
		else if(type===k.EXCELL){
			if     (k.isexcell===1){ return col+row+1;}
			else if(k.isexcell===2){ return 2*col+2*row+4;}
		}
		return 0;
	},
	newObject : function(type,id){
		if     (type===k.CELL)  { return (new Cell(id));}
		else if(type===k.CROSS) { return (new Cross(id));}
		else if(type===k.BORDER){ return (new Border(id));}
		else if(type===k.EXCELL){ return (new EXCell(id));}
	},

	//---------------------------------------------------------------------------
	// bd.setposAll()    �S�Ă�Cell, Cross, Border�I�u�W�F�N�g��setposCell()�����Ăяo��
	//                   �Ֆʂ̐V�K�쐬��A�g��/�k��/��]/���]���ȂǂɌĂяo�����
	// bd.setposGroup()  �w�肳�ꂽ�^�C�v��setpos�֐����Ăяo��
	// bd.setposCell()   �Y������id�̃Z����bx,by�v���p�e�B��ݒ肷��
	// bd.setposCross()  �Y������id�̌����_��bx,by�v���p�e�B��ݒ肷��
	// bd.setposBorder() �Y������id�̋��E��/Line��bx,by�v���p�e�B��ݒ肷��
	// bd.setposEXCell() �Y������id��Extend�Z����bx,by�v���p�e�B��ݒ肷��
	// bd.set_xnum()     cross�͑��݂��Ȃ����Abd._xnum�����ݒ肵�����ꍇ�ɌĂяo��
	//---------------------------------------------------------------------------
	// setpos�֘A�֐� <- �eCell���������Ă���ƃ������������������̂ł����ɒu������.
	setposAll : function(){
		this.setposCells();
		if(!!k.iscross) { this.setposCrosses();}
		if(!!k.isborder){ this.setposBorders();}
		if(!!k.isexcell){ this.setposEXcells();}

		this.setcacheAll();
		this.setcoordAll();
	},
	setposGroup : function(type){
		if     (type===k.CELL)  { this.setposCells();}
		else if(type===k.CROSS) { this.setposCrosses();}
		else if(type===k.BORDER){ this.setposBorders();}
		else if(type===k.EXCELL){ this.setposEXcells();}
	},

	setposCells : function(){
		this.cellmax = this.cell.length;
		for(var id=0;id<this.cellmax;id++){
			var obj = this.cell[id];
			obj.bx = (id%k.qcols)*2+1;
			obj.by = mf(id/k.qcols)*2+1;
		}
	},
	setposCrosses : function(){
		this.crossmax = this.cross.length;
		for(var id=0;id<this.crossmax;id++){
			var obj = this.cross[id];
			obj.bx = (id%(k.qcols+1))*2;
			obj.by = mf(id/(k.qcols+1))*2;
		}
	},
	setposBorders : function(){
		this.bdinside = 2*k.qcols*k.qrows-(k.qcols+k.qrows);
		this.bdmax = this.border.length;
		for(var id=0;id<this.bdmax;id++){
			var obj=this.border[id], i=id;
			if(i>=0 && i<(k.qcols-1)*k.qrows){ obj.bx=(i%(k.qcols-1))*2+2; obj.by=mf(i/(k.qcols-1))*2+1;} i-=((k.qcols-1)*k.qrows);
			if(i>=0 && i<k.qcols*(k.qrows-1)){ obj.bx=(i%k.qcols)*2+1;     obj.by=mf(i/k.qcols)*2+2;    } i-=(k.qcols*(k.qrows-1));
			if(k.isborder===2){
				if(i>=0 && i<k.qcols){ obj.bx=i*2+1;     obj.by=0;        } i-=k.qcols;
				if(i>=0 && i<k.qcols){ obj.bx=i*2+1;     obj.by=2*k.qrows;} i-=k.qcols;
				if(i>=0 && i<k.qrows){ obj.bx=0;         obj.by=i*2+1;    } i-=k.qrows;
				if(i>=0 && i<k.qrows){ obj.bx=2*k.qcols; obj.by=i*2+1;    } i-=k.qrows;
			}
		}
	},
	setposEXcells : function(){
		this.excellmax = this.excell.length;
		for(var id=0;id<this.excellmax;id++){
			var obj = this.excell[id], i=id;
			obj.bx=-1;
			obj.by=-1;
			if(k.isexcell===1){
				if(i>=0 && i<k.qcols){ obj.bx=i*2+1; obj.by=-1;    continue;} i-=k.qcols;
				if(i>=0 && i<k.qrows){ obj.bx=-1;    obj.by=i*2+1; continue;} i-=k.qrows;
			}
			else if(k.isexcell===2){
				if(i>=0 && i<k.qcols){ obj.bx=i*2+1;       obj.by=-1;          continue;} i-=k.qcols;
				if(i>=0 && i<k.qcols){ obj.bx=i*2+1;       obj.by=2*k.qrows+1; continue;} i-=k.qcols;
				if(i>=0 && i<k.qrows){ obj.bx=-1;          obj.by=i*2+1;       continue;} i-=k.qrows;
				if(i>=0 && i<k.qrows){ obj.bx=2*k.qcols+1; obj.by=i*2+1;       continue;} i-=k.qrows;
				if(i===0)            { obj.bx=-1;          obj.by=-1;          continue;} i--;
				if(i===0)            { obj.bx=2*k.qcols+1; obj.by=-1;          continue;} i--;
				if(i===0)            { obj.bx=-1;          obj.by=2*k.qrows+1; continue;} i--;
				if(i===0)            { obj.bx=2*k.qcols+1; obj.by=2*k.qrows+1; continue;} i--;
			}
		}
	},

	//---------------------------------------------------------------------------
	// bd.setcacheAll() �S�Ă�Cell, Cross, Border�I�u�W�F�N�g��_cnum�����L���b�V������
	//---------------------------------------------------------------------------
	setcacheAll : function(){
		this._cnum = {};
		this._xnum = {};
		this._bnum = {};
		this._exnum = {};

		for(var id=0;id<this.cellmax;id++){
			var obj = this.cell[id];
			this._cnum[[obj.bx, obj.by].join("_")] = id;
		}
		for(var id=0;id<this.crossmax;id++){
			var obj = this.cross[id];
			this._xnum[[obj.bx, obj.by].join("_")] = id;
		}
		if(k.iscross===0){
			for(var by=0;by<=this.maxby;by+=2){ for(var bx=0;bx<=this.maxbx;bx+=2){
				this._xnum[[bx, by].join("_")] = (bx>>1)+(by>>1)*(k.qcols+1);
			}}
		}
		for(var id=0;id<this.bdmax;id++){
			var obj = this.border[id];
			this._bnum[[obj.bx, obj.by].join("_")] = id;

			obj.cellcc[0] = this.cnum(obj.bx-(obj.by&1), obj.by-(obj.bx&1));
			obj.cellcc[1] = this.cnum(obj.bx+(obj.by&1), obj.by+(obj.bx&1));

			obj.crosscc[0] = this.xnum(obj.bx-(obj.bx&1), obj.by-(obj.by&1));
			obj.crosscc[1] = this.xnum(obj.bx+(obj.bx&1), obj.by+(obj.by&1));
		}
		for(var id=0;id<this.excellmax;id++){
			var obj = this.excell[id];
			this._exnum[[obj.bx, obj.by].join("_")] = id;
		}
	},

	//---------------------------------------------------------------------------
	// bd.setcoordAll() �S�Ă�Cell, Cross, Border�I�u�W�F�N�g��setcoordCell()�����Ăяo��
	// bd.setminmax()   �Ֆʂ�bx,by�̍ŏ��l/�ő�l���Z�b�g����
	// bd.isinside()    �w�肳�ꂽ(bx,by)���Ֆʓ����ǂ������f����
	//---------------------------------------------------------------------------
	setcoordAll : function(){
		var x0=k.p0.x, y0=k.p0.y;
		{
			for(var id=0;id<this.cellmax;id++){
				var obj = this.cell[id];
				obj.px = x0 + (obj.bx-1)*k.bwidth;
				obj.py = y0 + (obj.by-1)*k.bheight;
				obj.cpx = x0 + obj.bx*k.bwidth;
				obj.cpy = y0 + obj.by*k.bheight;
			}
		}
		if(!!k.iscross){
			for(var id=0;id<this.crossmax;id++){
				var obj = this.cross[id];
				obj.px = x0 + obj.bx*k.bwidth;
				obj.py = y0 + obj.by*k.bheight;
			}
		}
		if(!!k.isborder){
			for(var id=0;id<this.bdmax;id++){
				var obj = this.border[id];
				obj.px = x0 + obj.bx*k.bwidth;
				obj.py = y0 + obj.by*k.bheight;
			}
		}
		if(!!k.isexcell){
			for(var id=0;id<this.excellmax;id++){
				var obj = this.excell[id];
				obj.px = x0 + (obj.bx-1)*k.bwidth;
				obj.py = y0 + (obj.by-1)*k.bheight;
			}
		}
	},

	setminmax : function(){
		var extUL = (k.isexcell===1 || k.isexcell===2);
		var extDR = (k.isexcell===2);
		this.minbx = (!extUL ? 0 : -2);
		this.minby = (!extUL ? 0 : -2);
		this.maxbx = (!extDR ? 2*k.qcols : 2*k.qcols+2);
		this.maxby = (!extDR ? 2*k.qrows : 2*k.qrows+2);

		tc.adjust();
	},
	isinside : function(bx,by){
		return (bx>=this.minbx && bx<=this.maxbx && by>=this.minby && by<=this.maxby);
	},

	//---------------------------------------------------------------------------
	// bd.allclear() �S�Ă�Cell, Cross, Border�I�u�W�F�N�g��allclear()���Ăяo��
	// bd.ansclear() �S�Ă�Cell, Cross, Border�I�u�W�F�N�g��ansclear()���Ăяo��
	// bd.subclear() �S�Ă�Cell, Cross, Border�I�u�W�F�N�g��subclear()���Ăяo��
	// bd.errclear() �S�Ă�Cell, Cross, Border�I�u�W�F�N�g��error�v���p�e�B��0�ɂ��āACanvas���ĕ`�悷��
	//---------------------------------------------------------------------------
	allclear : function(){
		for(var i=0;i<this.cellmax  ;i++){ this.cell[i].allclear(i);}
		for(var i=0;i<this.crossmax ;i++){ this.cross[i].allclear(i);}
		for(var i=0;i<this.bdmax    ;i++){ this.border[i].allclear(i);}
		for(var i=0;i<this.excellmax;i++){ this.excell[i].allclear(i);}
	},
	ansclear : function(){
		for(var i=0;i<this.cellmax  ;i++){ this.cell[i].ansclear(i);}
		for(var i=0;i<this.crossmax ;i++){ this.cross[i].ansclear(i);}
		for(var i=0;i<this.bdmax    ;i++){ this.border[i].ansclear(i);}
		for(var i=0;i<this.excellmax;i++){ this.excell[i].ansclear(i);}
	},
	subclear : function(){
		for(var i=0;i<this.cellmax  ;i++){ this.cell[i].subclear(i);}
		for(var i=0;i<this.crossmax ;i++){ this.cross[i].subclear(i);}
		for(var i=0;i<this.bdmax    ;i++){ this.border[i].subclear(i);}
		for(var i=0;i<this.excellmax;i++){ this.excell[i].subclear(i);}
	},

	errclear : function(isrepaint){
		if(!ans.errDisp){ return;}

		for(var i=0;i<this.cellmax  ;i++){ this.cell[i].error=0;}
		for(var i=0;i<this.crossmax ;i++){ this.cross[i].error=0;}
		for(var i=0;i<this.bdmax    ;i++){ this.border[i].error=0;}
		for(var i=0;i<this.excellmax;i++){ this.excell[i].error=0;}

		ans.errDisp = false;
		if(isrepaint!==false){ pc.paintAll();}
	},

	//---------------------------------------------------------------------------
	// bd.idnum()  (X,Y)�̈ʒu�ɂ���I�u�W�F�N�g��ID��Ԃ�
	//---------------------------------------------------------------------------
	idnum : function(type,bx,by,qc,qr){
		if(qc===(void 0)){
			if     (type===k.CELL)  { return this.cnum(bx,by);}
			else if(type===k.CROSS) { return this.xnum(bx,by);}
			else if(type===k.BORDER){ return this.bnum(bx,by);}
			else if(type===k.EXCELL){ return this.exnum(bx,by);}
		}
		else{
			if     (type===k.CELL)  { return this.cnum2(bx,by,qc,qr);}
			else if(type===k.CROSS) { return this.xnum2(bx,by,qc,qr);}
			else if(type===k.BORDER){ return this.bnum2(bx,by,qc,qr);}
			else if(type===k.EXCELL){ return this.exnum2(bx,by,qc,qr);}
		}
		return -1;
	},

	//---------------------------------------------------------------------------
	// bd.cnum()   (X,Y)�̈ʒu�ɂ���Cell��ID��Ԃ�
	// bd.xnum()   (X,Y)�̈ʒu�ɂ���Cross��ID��Ԃ�
	// bd.bnum()   (X,Y)�̈ʒu�ɂ���Border��ID��Ԃ�
	// bd.exnum()  (X,Y)�̈ʒu�ɂ���extendCell��ID��Ԃ�
	//---------------------------------------------------------------------------
	cnum : function(bx,by){
		var key = [bx,by].join("_");
		return (this._cnum[key]!==(void 0) ? this._cnum[key] : -1);
	},
	xnum : function(bx,by){
		var key = [bx,by].join("_");
		return (this._xnum[key]!==(void 0) ? this._xnum[key] : -1);
	},
	bnum : function(bx,by){
		var key = [bx,by].join("_");
		return (this._bnum[key]!==(void 0) ? this._bnum[key] : -1);
	},
	exnum : function(bx,by){
		var key = [bx,by].join("_");
		return (this._exnum[key]!==(void 0) ? this._exnum[key] : -1);
	},

	//---------------------------------------------------------------------------
	// bd.cnum2()  (X,Y)�̈ʒu�ɂ���Cell��ID���A�Ֆʂ̑傫����(qc�~qr)�Ōv�Z���ĕԂ�
	// bd.xnum2()  (X,Y)�̈ʒu�ɂ���Cross��ID���A�Ֆʂ̑傫����(qc�~qr)�Ōv�Z���ĕԂ�
	// bd.bnum2()  (X,Y)�̈ʒu�ɂ���Border��ID���A�Ֆʂ̑傫����(qc�~qr)�Ōv�Z���ĕԂ�
	// bd.exnum2() (X,Y)�̈ʒu�ɂ���extendCell��ID���A�Ֆʂ̑傫����(qc�~qr)�Ōv�Z���ĕԂ�
	//---------------------------------------------------------------------------
	cnum2 : function(bx,by,qc,qr){
		if((bx<0||bx>2*qc||by<0||by>2*qr)||(!(bx&1))||(!(by&1))){ return -1;}
		return (bx>>1)+(by>>1)*qc;
	},
	xnum2 : function(bx,by,qc,qr){
		if((bx<0||bx>2*qc||by<0||by>2*qr)||(!!(bx&1))||(!!(by&1))){ return -1;}
		return (bx>>1)+(by>>1)*(qc+1);
	},
	bnum2 : function(bx,by,qc,qr){
		if(bx>=1&&bx<=2*qc-1&&by>=1&&by<=2*qr-1){
			if     (!(bx&1) &&  (by&1)){ return ((bx>>1)-1)+(by>>1)*(qc-1);}
			else if( (bx&1) && !(by&1)){ return (bx>>1)+((by>>1)-1)*qc+(qc-1)*qr;}
		}
		else if(k.isborder==2){
			if     (by===0   &&(bx&1)&&(bx>=1&&bx<=2*qc-1)){ return (qc-1)*qr+qc*(qr-1)+(bx>>1);}
			else if(by===2*qr&&(bx&1)&&(bx>=1&&bx<=2*qc-1)){ return (qc-1)*qr+qc*(qr-1)+qc+(bx>>1);}
			else if(bx===0   &&(by&1)&&(by>=1&&by<=2*qr-1)){ return (qc-1)*qr+qc*(qr-1)+2*qc+(by>>1);}
			else if(bx===2*qc&&(by&1)&&(by>=1&&by<=2*qr-1)){ return (qc-1)*qr+qc*(qr-1)+2*qc+qr+(by>>1);}
		}
		return -1;
	},
	exnum2 : function(bx,by,qc,qr){
		if(k.isexcell===1){
			if(bx===-1&&by===-1){ return qc+qr;}
			else if(by===-1&&bx>0&&bx<2*qc){ return (bx>>1);}
			else if(bx===-1&&by>0&&by<2*qr){ return qc+(by>>1);}
		}
		else if(k.isexcell===2){
			if     (by===-1    &&bx>0&&bx<2*qc){ return (bx>>1);}
			else if(by===2*qr+1&&bx>0&&bx<2*qc){ return qc+(bx>>1);}
			else if(bx===-1    &&by>0&&by<2*qr){ return 2*qc+(by>>1);}
			else if(bx===2*qc+1&&by>0&&by<2*qr){ return 2*qc+qr+(by>>1);}
			else if(bx===-1    &&by===-1    ){ return 2*qc+2*qr;}
			else if(bx===2*qc+1&&by===-1    ){ return 2*qc+2*qr+1;}
			else if(bx===-1    &&by===2*qr+1){ return 2*qc+2*qr+2;}
			else if(bx===2*qc+1&&by===2*qr+1){ return 2*qc+2*qr+3;}
		}
		return -1;
	},

	//---------------------------------------------------------------------------
	// bd.objectinside() ���W(x1,y1)-(x2,y2)�Ɋ܂܂��I�u�W�F�N�g��ID���X�g���擾����
	//---------------------------------------------------------------------------
	objectinside : function(type,x1,y1,x2,y2){
		if     (type===k.CELL)  { return this.cellinside  (x1,y1,x2,y2);}
		else if(type===k.CROSS) { return this.crossinside (x1,y1,x2,y2);}
		else if(type===k.BORDER){ return this.borderinside(x1,y1,x2,y2);}
		else if(type===k.EXCELL){ return this.excellinside(x1,y1,x2,y2);}
		return [];
	},

	//---------------------------------------------------------------------------
	// bd.cellinside()   ���W(x1,y1)-(x2,y2)�Ɋ܂܂��Cell��ID���X�g���擾����
	// bd.crossinside()  ���W(x1,y1)-(x2,y2)�Ɋ܂܂��Cross��ID���X�g���擾����
	// bd.borderinside() ���W(x1,y1)-(x2,y2)�Ɋ܂܂��Border��ID���X�g���擾����
	// bd.excellinside() ���W(x1,y1)-(x2,y2)�Ɋ܂܂��Excell��ID���X�g���擾����
	//---------------------------------------------------------------------------
	cellinside : function(x1,y1,x2,y2){
		var clist = [];
		for(var by=(y1|1);by<=y2;by+=2){ for(var bx=(x1|1);bx<=x2;bx+=2){
			var c = this._cnum[[bx,by].join("_")];
			if(c!==(void 0)){ clist.push(c);}
		}}
		return clist;
	},
	crossinside : function(x1,y1,x2,y2){
		var clist = [];
		for(var by=y1+(y1&1);by<=y2;by+=2){ for(var bx=x1+(x1&1);bx<=x2;bx+=2){
			var c = this._xnum[[bx,by].join("_")];
			if(c!==(void 0)){ clist.push(c);}
		}}
		return clist;
	},
	borderinside : function(x1,y1,x2,y2){
		var idlist = [];
		for(var by=y1;by<=y2;by++){ for(var bx=x1;bx<=x2;bx++){
			if(bx&1===by&1){ continue;}
			var id = this._bnum[[bx,by].join("_")];
			if(id!==(void 0)){ idlist.push(id);}
		}}
		return idlist;
	},
	excellinside : function(x1,y1,x2,y2){
		var exlist = [];
		for(var by=(y1|1);by<=y2;by+=2){ for(var bx=(x1|1);bx<=x2;bx+=2){
			var c = this._exnum[[bx,by].join("_")];
			if(c!==(void 0)){ exlist.push(c);}
		}}
		return exlist;
	},

	//---------------------------------------------------------------------------
	// bd.up() bd.dn() bd.lt() bd.rt()  �Z���̏㉺���E�ɐڂ���Z����ID��Ԃ�
	//---------------------------------------------------------------------------
	up : function(cc){ return this.cell[cc]?this.cnum(this.cell[cc].bx  ,this.cell[cc].by-2):-1;},	//��̃Z����ID�����߂�
	dn : function(cc){ return this.cell[cc]?this.cnum(this.cell[cc].bx  ,this.cell[cc].by+2):-1;},	//���̃Z����ID�����߂�
	lt : function(cc){ return this.cell[cc]?this.cnum(this.cell[cc].bx-2,this.cell[cc].by  ):-1;},	//���̃Z����ID�����߂�
	rt : function(cc){ return this.cell[cc]?this.cnum(this.cell[cc].bx+2,this.cell[cc].by  ):-1;},	//�E�̃Z����ID�����߂�
	//---------------------------------------------------------------------------
	// bd.ub() bd.db() bd.lb() bd.rb()  �Z���̏㉺���E�ɂ��鋫�E����ID��Ԃ�
	//---------------------------------------------------------------------------
	ub : function(cc){ return this.cell[cc]?this.bnum(this.cell[cc].bx  ,this.cell[cc].by-1):-1;},	//�Z���̏�̋��E����ID�����߂�
	db : function(cc){ return this.cell[cc]?this.bnum(this.cell[cc].bx  ,this.cell[cc].by+1):-1;},	//�Z���̉��̋��E����ID�����߂�
	lb : function(cc){ return this.cell[cc]?this.bnum(this.cell[cc].bx-1,this.cell[cc].by  ):-1;},	//�Z���̍��̋��E����ID�����߂�
	rb : function(cc){ return this.cell[cc]?this.bnum(this.cell[cc].bx+1,this.cell[cc].by  ):-1;},	//�Z���̉E�̋��E����ID�����߂�

	//---------------------------------------------------------------------------
	// bd.bcntCross() �w�肳�ꂽ�ʒu��Cross�̎���4�}�X�̂���qans==1�̃}�X�̐������߂�
	//---------------------------------------------------------------------------
	bcntCross : function(c) {
		var cnt=0, bx=bd.cross[c].bx, by=bd.cross[c].by;
		if(this.isBlack(this.cnum(bx-1, by-1))){ cnt++;}
		if(this.isBlack(this.cnum(bx+1, by-1))){ cnt++;}
		if(this.isBlack(this.cnum(bx-1, by+1))){ cnt++;}
		if(this.isBlack(this.cnum(bx+1, by+1))){ cnt++;}
		return cnt;
	},

	//---------------------------------------------------------------------------
	// bd.isLPup(), bd.isLPdown(), bd.isLPleft(), bd.isLPright()
	//   �㉺���E��LineParts�����݂��Ă��邩���肷��
	// bd.isnoLPup(), bd.isnoLPdown(), bd.isnoLPleft(), bd.isnoLPright()
	//   �㉺���E�����������Ȃ������ɂȂ��Ă��邩���肷��
	//---------------------------------------------------------------------------
	isLPup    : function(cc){ return ({101:1,102:1,104:1,105:1}[this.QuC(cc)] === 1);},
	isLPdown  : function(cc){ return ({101:1,102:1,106:1,107:1}[this.QuC(cc)] === 1);},
	isLPleft  : function(cc){ return ({101:1,103:1,105:1,106:1}[this.QuC(cc)] === 1);},
	isLPright : function(cc){ return ({101:1,103:1,104:1,107:1}[this.QuC(cc)] === 1);},
	isnoLPup    : function(cc){ return ({1:1,4:1,5:1,21:1,103:1,106:1,107:1}[this.QuC(cc)] === 1);},
	isnoLPdown  : function(cc){ return ({1:1,2:1,3:1,21:1,103:1,104:1,105:1}[this.QuC(cc)] === 1);},
	isnoLPleft  : function(cc){ return ({1:1,2:1,5:1,22:1,102:1,104:1,107:1}[this.QuC(cc)] === 1);},
	isnoLPright : function(cc){ return ({1:1,3:1,4:1,22:1,102:1,105:1,106:1}[this.QuC(cc)] === 1);},
	//---------------------------------------------------------------------------
	// bd.isLPMarked()      Line�̂ǂ��炩����LineParts�����݂��Ă��邩�ǂ������肷��
	// bd.isLPCombined()    Line��2�����Ƃ�LineParts�����݂��Ă��邩�ǂ������肷��
	// bd.isLineNG()        Line�̂ǂ��炩���A���������Ȃ��悤�ɂȂ��Ă��邩���肷��
	// bd.isLP()            ���3�̋��ʊ֐�
	// bd.checkLPCombined() �����Ȃ����Ă��邩�ǂ������āALine==1��ݒ肷��
	//---------------------------------------------------------------------------
	isLPMarked : function(id){
		var cc1 = bd.border[id].cellcc[0], cc2 = bd.border[id].cellcc[1];
		return bd.border[id].bx&1 ? (bd.isLPdown(cc1) || bd.isLPup(cc2)) :
									(bd.isLPright(cc1) || bd.isLPleft(cc2));
	},
	isLPCombined : function(id){
		var cc1 = bd.border[id].cellcc[0], cc2 = bd.border[id].cellcc[1];
		return bd.border[id].bx&1 ? (bd.isLPdown(cc1) && bd.isLPup(cc2)) :
									(bd.isLPright(cc1) && bd.isLPleft(cc2));
	},
	isLineNG : function(id){
		var cc1 = bd.border[id].cellcc[0], cc2 = bd.border[id].cellcc[1];
		return bd.border[id].bx&1 ? (bd.isnoLPdown(cc1) || bd.isnoLPup(cc2)) :
									(bd.isnoLPright(cc1) || bd.isnoLPleft(cc2));
	},
	checkLPCombined : function(cc){
		var id;
		id = this.ub(cc); if(id!==-1 && this.border[id].line===0 && this.isLPCombined(id)){ this.sLiB(id,1);}
		id = this.db(cc); if(id!==-1 && this.border[id].line===0 && this.isLPCombined(id)){ this.sLiB(id,1);}
		id = this.lb(cc); if(id!==-1 && this.border[id].line===0 && this.isLPCombined(id)){ this.sLiB(id,1);}
		id = this.rb(cc); if(id!==-1 && this.border[id].line===0 && this.isLPCombined(id)){ this.sLiB(id,1);}
	},

	//---------------------------------------------------------------------------
	// bd.nummaxfunc() ���͂ł��鐔���̍ő�l��Ԃ�
	//---------------------------------------------------------------------------
	nummaxfunc : function(cc){
		return this.maxnum;
	},

	//---------------------------------------------------------------------------
	// sQuC / QuC : bd.setQuesCell() / bd.getQuesCell()  �Y������Cell��ques��ݒ肷��/�Ԃ�
	// sQnC / QnC : bd.setQnumCell() / bd.getQnumCell()  �Y������Cell��qnum��ݒ肷��/�Ԃ�
	// sQsC / QsC : bd.setQsubCell() / bd.getQsubCell()  �Y������Cell��qsub��ݒ肷��/�Ԃ�
	// sQaC / QaC : bd.setQansCell() / bd.getQansCell()  �Y������Cell��qans��ݒ肷��/�Ԃ�
	// sDiC / DiC : bd.setDirecCell()/ bd.getDirecCell() �Y������Cell��direc��ݒ肷��/�Ԃ�
	//---------------------------------------------------------------------------
	// Cell�֘AGet/Set�֐� <- �eCell�������Ă���ƃ������������������̂ł����ɒu������.
	// overwrite by pipelink.js and loopsp.js
	sQuC : function(id, num) {
		um.addOpe(k.CELL, k.QUES, id, this.cell[id].ques, num);
		this.cell[id].ques = num;
	},
	// overwrite by lightup.js and kakuro.js
	sQnC : function(id, num) {
		if(!k.dispzero && num===0){ return;}

		var old = this.cell[id].qnum;
		um.addOpe(k.CELL, k.QNUM, id, old, num);
		this.cell[id].qnum = num;

		if(um.isenableInfo() &&
			(area.numberColony && (num!==-1 ^ area.bcell.id[id]!==-1))
		){ area.setCell(id,(num!==-1?1:0));}
	},
	// overwrite by lightup.js
	sQaC : function(id, num) {
		var old = this.cell[id].qans;
		um.addOpe(k.CELL, k.QANS, id, old, num);
		this.cell[id].qans = num;

		if(um.isenableInfo() && (
			(area.bblock && (num!==-1 ^ area.bcell.id[id]!==-1)) || 
			(area.wblock && (num===-1 ^ area.wcell.id[id]!==-1))
		)){ area.setCell(id,(num!==-1?1:0));}
	},
	sQsC : function(id, num) {
		um.addOpe(k.CELL, k.QSUB, id, this.cell[id].qsub, num);
		this.cell[id].qsub = num;
	},
	sDiC : function(id, num) {
		um.addOpe(k.CELL, k.DIREC, id, this.cell[id].direc, num);
		this.cell[id].direc = num;
	},

	QuC : function(id){ return (id!==-1?this.cell[id].ques:-1);},
	QnC : function(id){ return (id!==-1?this.cell[id].qnum:-1);},
	QaC : function(id){ return (id!==-1?this.cell[id].qans:-1);},
	QsC : function(id){ return (id!==-1?this.cell[id].qsub:-1);},
	DiC : function(id){ return (id!==-1?this.cell[id].direc:-1);},

	//---------------------------------------------------------------------------
	// sQnE / QnE : bd.setQnumEXcell() / bd.getQnumEXcell()  �Y������EXCell��qnum��ݒ肷��/�Ԃ�
	// sDiE / DiE : bd.setDirecEXcell()/ bd.getDirecEXcell() �Y������EXCell��direc��ݒ肷��/�Ԃ�
	//---------------------------------------------------------------------------
	// EXcell�֘AGet/Set�֐�
	sQnE : function(id, num) {
		um.addOpe(k.EXCELL, k.QNUM, id, this.excell[id].qnum, num);
		this.excell[id].qnum = num;
	},
	sDiE : function(id, num) {
		um.addOpe(k.EXCELL, k.DIREC, id, this.excell[id].direc, num);
		this.excell[id].direc = num;
	},

	QnE : function(id){ return (id!==-1?this.excell[id].qnum:-1);},
	DiE : function(id){ return (id!==-1?this.excell[id].direc:-1);},

	//---------------------------------------------------------------------------
	// sQuX / QuX : bd.setQuesCross(id,num) / bd.getQuesCross() �Y������Cross��ques��ݒ肷��/�Ԃ�
	// sQnX / QnX : bd.setQnumCross(id,num) / bd.getQnumCross() �Y������Cross��qnum��ݒ肷��/�Ԃ�
	//---------------------------------------------------------------------------
	// Cross�֘AGet/Set�֐� <- �eCross�������Ă���ƃ������������������̂ł����ɒu������.
	sQuX : function(id, num) {
		um.addOpe(k.CROSS, k.QUES, id, this.cross[id].ques, num);
		this.cross[id].ques = num;
	},
	sQnX : function(id, num) {
		um.addOpe(k.CROSS, k.QNUM, id, this.cross[id].qnum, num);
		this.cross[id].qnum = num;
	},

	QuX : function(id){ return (id!==-1?this.cross[id].ques:-1);},
	QnX : function(id){ return (id!==-1?this.cross[id].qnum:-1);},

	//---------------------------------------------------------------------------
	// sQuB / QuB : bd.setQuesBorder() / bd.getQuesBorder() �Y������Border��ques��ݒ肷��/�Ԃ�
	// sQnB / QnB : bd.setQnumBorder() / bd.getQnumBorder() �Y������Border��qnum��ݒ肷��/�Ԃ�
	// sQaB / QaB : bd.setQansBorder() / bd.getQansBorder() �Y������Border��qans��ݒ肷��/�Ԃ�
	// sQsB / QsB : bd.setQsubBorder() / bd.getQsubBorder() �Y������Border��qsub��ݒ肷��/�Ԃ�
	// sLiB / LiB : bd.setLineBorder() / bd.getLineBorder() �Y������Border��line��ݒ肷��/�Ԃ�
	//---------------------------------------------------------------------------
	// Border�֘AGet/Set�֐� <- �eBorder�������Ă���ƃ������������������̂ł����ɒu������.
	sQuB : function(id, num) {
		var old = this.border[id].ques;
		um.addOpe(k.BORDER, k.QUES, id, old, num);
		this.border[id].ques = num;

		if(um.isenableInfo() && (num>0 ^ old>0)){ area.setBorder(id,num);}
	},
	sQnB : function(id, num) {
		um.addOpe(k.BORDER, k.QNUM, id, this.border[id].qnum, num);
		this.border[id].qnum = num;
	},
	sQaB : function(id, num) {
		if(this.border[id].ques!=0){ return;}

		var old = this.border[id].qans;
		um.addOpe(k.BORDER, k.QANS, id, old, num);
		this.border[id].qans = num;

		if(um.isenableInfo() && (num>0 ^ old>0)){
			if(k.isborderAsLine){ line.setLine(id,num);}
			else                { area.setBorder(id,num);}
		}
	},
	sQsB : function(id, num) {
		um.addOpe(k.BORDER, k.QSUB, id, this.border[id].qsub, num);
		this.border[id].qsub = num;
	},
	sLiB : function(id, num) {
		if(this.enableLineNG && (num==1?bd.isLineNG:bd.isLPCombined)(id)){ return;}

		var old = this.border[id].line;
		um.addOpe(k.BORDER, k.LINE, id, old, num);
		this.border[id].line = num;

		if(um.isenableInfo() && (num>0 ^ old>0)){ line.setLine(id,num);}
	},

	QuB : function(id){ return (id!==-1?this.border[id].ques:-1);},
	QnB : function(id){ return (id!==-1?this.border[id].qnum:-1);},
	QaB : function(id){ return (id!==-1?this.border[id].qans:-1);},
	QsB : function(id){ return (id!==-1?this.border[id].qsub:-1);},
	LiB : function(id){ return (id!==-1?this.border[id].line:-1);},

	//---------------------------------------------------------------------------
	// sErC / ErC : bd.setErrorCell()   / bd.getErrorCell()   �Y������Cell��error��ݒ肷��/�Ԃ�
	// sErX / ErX : bd.setErrorCross()  / bd.getErrorCross()  �Y������Cross��error��ݒ肷��/�Ԃ�
	// sErB / ErB : bd.setErrorBorder() / bd.getErrorBorder() �Y������Border��error��ݒ肷��/�Ԃ�
	// sErE / ErE : bd.setErrorEXcell() / bd.getErrorEXcell() �Y������EXcell��error��ݒ肷��/�Ԃ�
	// sErBAll() ���ׂĂ�border�ɃG���[�l��ݒ肷��
	//---------------------------------------------------------------------------
	// Get/SetError�֐�(set�͔z��œ���)
	sErC : function(idlist, num) {
		if(!ans.isenableSetError()){ return;}
		if(!idlist.push){ idlist = [idlist];}
		for(var i=0;i<idlist.length;i++){ if(idlist[i]!==-1){ this.cell[idlist[i]].error = num;} }
	},
	sErX : function(idlist, num) {
		if(!ans.isenableSetError()){ return;}
		if(!idlist.push){ idlist = [idlist];}
		for(var i=0;i<idlist.length;i++){ if(idlist[i]!==-1){ this.cross[idlist[i]].error = num;} }
	},
	sErB : function(idlist, num) {
		if(!ans.isenableSetError()){ return;}
		if(!idlist.push){ idlist = [idlist];}
		for(var i=0;i<idlist.length;i++){ if(idlist[i]!==-1){ this.border[idlist[i]].error = num;} }
	},
	sErE : function(idlist, num) {
		if(!ans.isenableSetError()){ return;}
		if(!idlist.push){ idlist = [idlist];}
		for(var i=0;i<idlist.length;i++){ if(idlist[i]!==-1){ this.excell[idlist[i]].error = num;} }
	},
	sErBAll : function(num){
		if(!ans.isenableSetError()){ return;}
		for(var i=0;i<bd.bdmax;i++){ this.border[i].error = num;}
	},

	ErC : function(id){ return (id!==-1?this.cell[id].error:0);},
	ErX : function(id){ return (id!==-1?this.cross[id].error:0);},
	ErB : function(id){ return (id!==-1?this.border[id].error:0);},
	ErE : function(id){ return (id!==-1?this.excell[id].error:0);},

	//---------------------------------------------------------------------------
	// bd.setFunctions()  �����t���O�����Ċ֐���ݒ肷��
	//---------------------------------------------------------------------------
	setFunctions : function(){
		//-----------------------------------------------------------------------
		// bd.isLine()      �Y������Border��line��������Ă��邩���肷��
		// bd.setLine()     �Y������Border�ɐ�������
		// bd.setPeke()     �Y������Border�Ɂ~������
		// bd.removeLine()  �Y������Border�����������
		//-----------------------------------------------------------------------
		this.isLine = (
			(!k.isborderAsLine) ? function(id){ return (id!==-1 && bd.border[id].line>0);}
								: function(id){ return (id!==-1 && bd.border[id].qans>0);}
		);
		this.setLine = (
			(!k.isborderAsLine) ? function(id){ this.sLiB(id, 1); this.sQsB(id, 0);}
								: function(id){ this.sQaB(id, 1); this.sQsB(id, 0);}
		);
		this.setPeke = (
			(!k.isborderAsLine) ? function(id){ this.sLiB(id, 0); this.sQsB(id, 2);}
								: function(id){ this.sQaB(id, 0); this.sQsB(id, 2);}
		);
		this.removeLine = (
			(!k.isborderAsLine) ? function(id){ this.sLiB(id, 0); this.sQsB(id, 0);}
								: function(id){ this.sQaB(id, 0); this.sQsB(id, 0);}
		);

		//-----------------------------------------------------------------------
		// bd.isNum()      �Y������Cell�ɐ��������邩�Ԃ�
		// bd.noNum()      �Y������Cell�ɐ������Ȃ����Ԃ�
		// bd.isValidNum() �Y������Cell��0�ȏ�̐��������邩�Ԃ�
		// bd.sameNumber() �Q��Cell�ɓ����L���Ȑ��������邩�Ԃ�
		//-----------------------------------------------------------------------
		this.isNum = (
			k.isAnsNumber ? function(c){ return (c!==-1 && (bd.cell[c].qnum!==-1 || bd.cell[c].qans!==-1));}
						  : function(c){ return (c!==-1 &&  bd.cell[c].qnum!==-1);}
		);
		this.noNum = (
			k.isAnsNumber ? function(c){ return (c===-1 || (bd.cell[c].qnum===-1 && bd.cell[c].qans===-1));}
						  : function(c){ return (c===-1 ||  bd.cell[c].qnum===-1);}
		);
		this.isValidNum = (
			k.isAnsNumber ? function(c){ return (c!==-1 && (bd.cell[c].qnum>=  0 ||(bd.cell[c].qans>=0 && bd.cell[c].qnum===-1)));}
						  : function(c){ return (c!==-1 &&  bd.cell[c].qnum>=  0);}
		);
		this.sameNumber     = function(c1,c2){ return (bd.isValidNum(c1) && (bd.getNum(c1)===bd.getNum(c2)));};

		//-----------------------------------------------------------------------
		// bd.getNum()     �Y������Cell�̐�����Ԃ�
		// bd.setNum()     �Y������Cell�ɐ�����ݒ肷��
		//-----------------------------------------------------------------------
		this.getNum = (
			k.isAnsNumber ? function(c){ return (c!==-1 ? this.cell[c].qnum!==-1 ? this.cell[c].qnum : this.cell[c].qans : -1);}
						  : function(c){ return (c!==-1 ? this.cell[c].qnum : -1);}
		);
		this.setNum = (
			(k.NumberIsWhite ?
				function(c,val){
					if(!k.dispzero && val===0){ return;}
					this.sQnC(c,val);
					this.sQaC(c,bd.defcell.qnum);
				}
			: k.isAnsNumber ?
				function(c,val){
					if(!k.dispzero && val===0){ return;}
					if(k.editmode){
						this.sQnC(c,val);
						this.sQaC(c,bd.defcell.qnum);
					}
					else if(this.cell[c].qnum===bd.defcell.qnum){
						this.sQaC(c,val);
					}
					this.sQsC(c,0);
				}
			:
				function(c,val){
					if(!k.dispzero && val===0){ return;}
					this.sQnC(c,val);
				}
			)
		);
	},

	//---------------------------------------------------------------------------
	// bd.isBlack()   �Y������Cell�����}�X���ǂ����Ԃ�
	// bd.isWhite()   �Y������Cell�����}�X���ǂ����Ԃ�
	// bd.setBlack()  �Y������Cell�ɍ��}�X���Z�b�g����
	// bd.setWhite()  �Y������Cell�ɔ��}�X���Z�b�g����
	//---------------------------------------------------------------------------
	isBlack : function(c){ return (c!==-1 && bd.cell[c].qans===1);},
	isWhite : function(c){ return (c!==-1 && bd.cell[c].qans!==1);},

	setBlack : function(c){ this.sQaC(c, 1);},
	setWhite : function(c){ this.sQaC(c,-1);},

	//---------------------------------------------------------------------------
	// bd.isBorder()     �Y������Border�ɋ��E����������Ă��邩���肷��
	// bd.setBorder()    �Y������Border�ɋ��E��������
	// bd.removeBorder() �Y������Border�����������
	// bd.setBsub()      �Y������Border�ɋ��E���p�̕⏕�L��������
	// bd.removeBsub()   �Y������Border���狫�E���p�̕⏕�L�����͂���
	//---------------------------------------------------------------------------
	isBorder     : function(id){
		return (id!==-1 && (bd.border[id].ques>0 || bd.border[id].qans>0));
	},

	setBorder    : function(id){
		if(k.editmode){ this.sQuB(id,1); this.sQaB(id,0);}
		else if(this.QuB(id)!==1){ this.sQaB(id,1);}
	},
	removeBorder : function(id){
		if(k.editmode){ this.sQuB(id,0); this.sQaB(id,0);}
		else if(this.QuB(id)!==1){ this.sQaB(id,0);}
	},
	setBsub      : function(id){ this.sQsB(id,1);},
	removeBsub   : function(id){ this.sQsB(id,0);}
};

//---------------------------------------------------------------------------
// ��Graphic�N���X Canvas�ɕ`�悷��
//---------------------------------------------------------------------------
// �p�Y������ Canvas/DOM���䕔
// Graphic�N���X�̒�`
Graphic = function(){
	// �Ֆʂ�Cell�𕪂���F
	this.gridcolor = "black";

	// �Z���̐F(���}�X)
	this.cellcolor = "black";
	this.errcolor1 = "rgb(224, 0, 0)";
	this.errcolor2 = "rgb(64, 64, 255)";
	this.errcolor3 = "rgb(0, 191, 0)";

	// �Z���̊ې����̒��ɏ����F
	this.circledcolor = "white";

	// �Z���́��~�̐F(�⏕�L��)
	this.mbcolor = "rgb(255, 160, 127)";

	this.qsubcolor1 = "rgb(160,255,160)";
	this.qsubcolor2 = "rgb(255,255,127)";
	this.qsubcolor3 = "rgb(192,192,192)";	// �G���o��p�Y���̔w�i����

	// �t�H���g�̐F(���}�X/���}�X)
	this.fontcolor = "black";
	this.fontAnscolor = "rgb(0, 160, 0)";
	this.fontErrcolor = "rgb(191, 0, 0)";
	this.fontBCellcolor = "rgb(224, 224, 224)";

	this.borderfontcolor = "black";

	// �Z���̔w�i�F(���}�X)
	this.bcolor = "white";
	this.dotcolor = "black";
	this.errbcolor1 = "rgb(255, 160, 160)";
	this.errbcolor2 = "rgb(64, 255, 64)";

	this.icecolor = "rgb(192, 224, 255)";

	// ques=51�̂Ƃ��A���͂ł���ꏊ�̔w�i�F(TargetTriangle)
	this.ttcolor = "rgb(127,255,127)";

	// ���E���̐F
	this.borderQuescolor = "black";
	this.borderQanscolor = "rgb(0, 191, 0)";
	this.borderQsubcolor = "rgb(255, 0, 255)";

	this.errborderQanscolor2 = "rgb(160, 160, 160)";

	this.bbcolor = "rgb(96, 96, 96)"; // ���E���ƍ��}�X�𕪂���F(BoxBorder)

	// ���E�~�̐F
	this.linecolor = "rgb(0, 160, 0)";	// �F�����Ȃ��̏ꍇ
	this.pekecolor = "rgb(32, 32, 255)";

	this.errlinecolor1 = "rgb(255, 0, 0)";
	this.errlinecolor2 = "rgb(160, 160, 160)";

	// ���̓^�[�Q�b�g�̐F
	this.targetColor1 = "rgb(255, 64,  64)";
	this.targetColor3 = "rgb(64,  64, 255)";

	// �Ֆ�(�g�̒�)�̔w�i�F
	this.bgcolor = '';

	// �F�X�ȃp�Y���Œ�`���Ă��Œ�F
	this.gridcolor_BLACK  = "black";
	this.gridcolor_LIGHT  = "rgb(127, 127, 127)";	/* �قƂ�ǂ͂��̐F���w�肵�Ă��� */
	this.gridcolor_DLIGHT = "rgb(160, 160, 160)";	/* �̈敪���n�Ŏg���Ă邱�Ƃ����� */
	this.gridcolor_SLIGHT = "rgb(191, 191, 191)";	/* �����{���������p�Y��           */
	this.gridcolor_THIN   = "rgb(224, 224, 224)";	/* �����͎��̂�Grid�\���̃p�Y�� */

	this.bcolor_GREEN = "rgb(160, 255, 160)";
	this.errbcolor1_DARK = "rgb(255, 127, 127)";
	this.linecolor_LIGHT = "rgb(0, 192, 0)";

	// ���̑�
	this.fontsizeratio = 1.0;	// ����Font�T�C�Y�̔{��
	this.crosssize = 0.4;
	this.circleratio = [0.40, 0.34];

	// �`��P��
	this.cw = k.cwidth;
	this.ch = k.cheight;
	this.bw = k.bwidth;
	this.bh = k.bheight;

	this.lw = 1;		// LineWidth ���E���ELine�̑���
	this.lm = 1;		// LineMargin
	this.lwratio = 12;	// onresize_process��lw�̒l�̎Z�o�ɗp����
	this.addlw = 0;		// �G���[���ɐ��̑������L����

	this.bdheader = "b_bd";	// drawBorder1�Ŏg��header

	this.chassisflag = true;	// false: Grid���O�g�̈ʒu�ɂ��`�悷��

	this.lastHdeg = 0;
	this.lastYdeg = 0;
	this.minYdeg = 0.18;
	this.maxYdeg = 0.70;

	this.zidx = 1;
	this.zidx_array=[];

	this.EL_NUMOBJ = ee.addTemplate('numobj_parent', 'div', {className:'divnum', unselectable:'on'}, null, null);
	this.EL_IMGOBJ = ee.addTemplate('numobj_parent', 'img', {className:'imgnum', unselectable:'on'}, null, null);

	this.numobj = {};					// �G�������g�ւ̎Q�Ƃ�ێ�����
	this.fillTextPrecisely  = false;	// ������g.fillText()�ŕ`��

	this.isdrawBC = false;
	this.isdrawBD = false;

	/* vnop�֐��p */
	this.STROKE      = 0;
	this.FILL        = 1;
	this.FILL_STROKE = 2;
	this.NONE        = 3;
	this.vnop_FILL   = [false,true,true,false];
	this.vnop_STROKE = [true,false,true,false];
};
Graphic.prototype = {
	//---------------------------------------------------------------------------
	// pc.onresize_process() resize���ɃT�C�Y��ύX����
	//---------------------------------------------------------------------------
	onresize_process : function(){
		this.cw = k.cwidth;
		this.ch = k.cheight;

		this.bw = k.bwidth;
		this.bh = k.bheight;

		this.lw = Math.max(k.cwidth/this.lwratio, 3);
		this.lm = (this.lw-1)/2;
	},
	//---------------------------------------------------------------------------
	// pc.prepaint()    paint�֐����Ăяo��
	// pc.paint()       ���W(x1,y1)-(x2,y2)���ĕ`�悷��B�e�p�Y���̃t�@�C���ŃI�[�o�[���C�h�����B
	//
	// pc.paintAll()    �S�̂��ĕ`�悷��
	// pc.paintRange()  ���W(x1,y1)-(x2,y2)���ĕ`�悷��B
	// pc.paintPos()    �w�肳�ꂽ(X,Y)���ĕ`�悷��
	//
	// pc.paintCell()   �w�肳�ꂽCell���ĕ`�悷��
	// pc.paintCellAround() �w�肳�ꂽCell�̎�����܂߂čĕ`�悷��
	// pc.paintCross()  �w�肳�ꂽCross���ĕ`�悷��
	// pc.paintBorder() �w�肳�ꂽBorder�̎�����ĕ`�悷��
	// pc.paintLine()   �w�肳�ꂽLine�̎�����ĕ`�悷��
	// pc.paintEXcell() �w�肳�ꂽEXCell���ĕ`�悷��
	//---------------------------------------------------------------------------
	paint : function(x1,y1,x2,y2){ }, //�I�[�o�[���C�h�p

	prepaint : function(x1,y1,x2,y2){
		this.flushCanvas(x1,y1,x2,y2);
	//	this.flushCanvasAll();

		this.paint(x1,y1,x2,y2);
	},

	paintAll : function(){
		this.prepaint(-1,-1,2*k.qcols+1,2*k.qrows+1);
	},
	paintRange : function(x1,y1,x2,y2){
		this.prepaint(x1,y1,x2,y2);
	},
	paintPos : function(pos){
		this.prepaint(pos.x-1, pos.y-1, pos.x+1, pos.y+1);
	},

	paintCell : function(cc){
		if(isNaN(cc) || !bd.cell[cc]){ return;}
		this.prepaint(bd.cell[cc].bx-1, bd.cell[cc].by-1, bd.cell[cc].bx+1, bd.cell[cc].by+1);
	},
	paintCellAround : function(cc){
		if(isNaN(cc) || !bd.cell[cc]){ return;}
		this.prepaint(bd.cell[cc].bx-3, bd.cell[cc].by-3, bd.cell[cc].bx+3, bd.cell[cc].by+3);
	},
	paintCross : function(cc){
		if(isNaN(cc) || !bd.cross[cc]){ return;}
		this.prepaint(bd.cross[cc].bx-1, bd.cross[cc].by-1, bd.cross[cc].bx+1, bd.cross[cc].by+1);
	},
	paintBorder : function(id){
		if(isNaN(id) || !bd.border[id]){ return;}
		if(bd.border[id].bx&1){
			this.prepaint(bd.border[id].bx-2, bd.border[id].by-1, bd.border[id].bx+2, bd.border[id].by+1);
		}
		else{
			this.prepaint(bd.border[id].bx-1, bd.border[id].by-2, bd.border[id].bx+1, bd.border[id].by+2);
		}
	},
	paintLine : function(id){
		if(isNaN(id) || !bd.border[id]){ return;}
		if(bd.border[id].bx&1){
			this.prepaint(bd.border[id].bx-1, bd.border[id].by-2, bd.border[id].bx+1, bd.border[id].by+2);
		}
		else{
			this.prepaint(bd.border[id].bx-2, bd.border[id].by-1, bd.border[id].bx+2, bd.border[id].by+1);
		}
	},
	paintEXcell : function(ec){
		if(isNaN(ec) || !bd.excell[ec]){ return;}
		this.prepaint(bd.excell[ec].bx-1, bd.excell[ec].by-1, bd.excell[ec].bx+1, bd.excell[ec].by+1);
	},

	//---------------------------------------------------------------------------
	// pc.getNewLineColor() �V�����F��Ԃ�
	//---------------------------------------------------------------------------
	getNewLineColor : function(){
		var loopcount = 0;

		while(1){
			var Rdeg = mf(Math.random() * 384)-64; if(Rdeg<0){Rdeg=0;} if(Rdeg>255){Rdeg=255;}
			var Gdeg = mf(Math.random() * 384)-64; if(Gdeg<0){Gdeg=0;} if(Gdeg>255){Gdeg=255;}
			var Bdeg = mf(Math.random() * 384)-64; if(Bdeg<0){Bdeg=0;} if(Bdeg>255){Bdeg=255;}

			// HLS�̊e�g���l�����߂�
			var Cmax = Math.max(Rdeg,Math.max(Gdeg,Bdeg));
			var Cmin = Math.min(Rdeg,Math.min(Gdeg,Bdeg));

			var Hdeg = 0;
			var Ldeg = (Cmax+Cmin)*0.5 / 255;
			var Sdeg = (Cmax===Cmin?0:(Cmax-Cmin)/((Ldeg<=0.5)?(Cmax+Cmin):(2*255-Cmax-Cmin)) );

			if(Cmax==Cmin){ Hdeg = 0;}
			else if(Rdeg>=Gdeg && Rdeg>=Bdeg){ Hdeg = (    60*(Gdeg-Bdeg)/(Cmax-Cmin)+360)%360;}
			else if(Gdeg>=Rdeg && Gdeg>=Bdeg){ Hdeg = (120+60*(Bdeg-Rdeg)/(Cmax-Cmin)+360)%360;}
			else if(Bdeg>=Gdeg && Bdeg>=Rdeg){ Hdeg = (240+60*(Rdeg-Gdeg)/(Cmax-Cmin)+360)%360;}

			// YCbCr��Y�����߂�
			var Ydeg = (0.29891*Rdeg + 0.58661*Gdeg + 0.11448*Bdeg) / 255;

			if( (this.minYdeg<Ydeg && Ydeg<this.maxYdeg) && (Math.abs(this.lastYdeg-Ydeg)>0.15) && (Sdeg<0.02 || 0.40<Sdeg)
				 && (((360+this.lastHdeg-Hdeg)%360>=45)&&((360+this.lastHdeg-Hdeg)%360<=315)) ){
				this.lastHdeg = Hdeg;
				this.lastYdeg = Ydeg;
				//alert("rgb("+Rdeg+", "+Gdeg+", "+Bdeg+")\nHLS("+mf(Hdeg)+", "+(""+mf(Ldeg*1000)*0.001).slice(0,5)+", "+(""+mf(Sdeg*1000)*0.001).slice(0,5)+")\nY("+(""+mf(Ydeg*1000)*0.001).slice(0,5)+")");
				return "rgb("+Rdeg+","+Gdeg+","+Bdeg+")";
			}

			loopcount++;
			if(loopcount>100){ return "rgb("+Rdeg+","+Gdeg+","+Bdeg+")";}
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawBlackCells() Cell�́A���E���̏ォ��`�悳��遡���}�X��Canvas�ɏ�������
	// pc.setCellColor()   �O�i�F�̐ݒ�E�`�攻�肷��
	// pc.setCellColorFunc()   pc.setCellColor�֐���ݒ肷��
	//
	// pc.drawBGCells()    Cell�́A���E���̉��ɕ`�悳���w�i�F��Canvas�ɏ�������
	// pc.setBGCellColor() �w�i�F�̐ݒ�E�`�攻�肷��
	// pc.setBGCellColorFunc() pc.setBGCellColor�֐���ݒ肷��
	//---------------------------------------------------------------------------
	// err==2�ɂȂ�lits�́AdrawBGCells�ŕ`�悵�Ă܂��B�B
	drawBlackCells : function(x1,y1,x2,y2){
		this.vinc('cell_front', 'crispEdges');
		var header = "c_fullb_";

		if(g.use.canvas && this.isdrawBC && !this.isdrawBD){ x1--; y1--; x2++; y2++;}
		var clist = bd.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(this.setCellColor(c)){
				if(this.vnop(header+c,this.FILL)){
					g.fillRect(bd.cell[c].px, bd.cell[c].py, this.cw+1, this.ch+1);
				}
			}
			else{ this.vhide(header+c); continue;}
		}
		this.isdrawBC = true;
	},
	// 'qans'�p
	setCellColor : function(c){
		var err = bd.cell[c].error;
		if(bd.cell[c].qans!==1){ return false;}
		else if(err===0){ g.fillStyle = this.cellcolor; return true;}
		else if(err===1){ g.fillStyle = this.errcolor1; return true;}
		return false;
	},
	setCellColorFunc : function(type){
		switch(type){
		case 'qnum':
			this.setCellColor = function(c){
				var err = bd.cell[c].error;
				if(bd.cell[c].qnum===-1){ return false;}
				else if(err===0){ g.fillStyle = this.cellcolor; return true;}
				else if(err===1){ g.fillStyle = this.errcolor1; return true;}
				return false;
			};
			break;
		default:
			break;
		}
	},

	drawBGCells : function(x1,y1,x2,y2){
		this.vinc('cell_back', 'crispEdges');
		var header = "c_full_";
		var clist = bd.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(this.setBGCellColor(c)){
				if(this.vnop(header+c,this.FILL)){
					g.fillRect(bd.cell[c].px, bd.cell[c].py, this.cw, this.ch);
				}
			}
			else{ this.vhide(header+c); continue;}
		}
	},
	// 'error1'�p
	setBGCellColor : function(c){
		if(bd.cell[c].error===1){ g.fillStyle = this.errbcolor1; return true;}
		return false;
	},
	setBGCellColorFunc : function(type){
		switch(type){
		case 'error2':
			this.setBGCellColor = function(c){
				var cell = bd.cell[c];
				if     (cell.error===1){ g.fillStyle = this.errbcolor1; return true;}
				else if(cell.error===2){ g.fillStyle = this.errbcolor2; return true;}
				return false;
			}
			break;
		case 'qans1':
			this.setBGCellColor = function(c){
				var cell = bd.cell[c];
				if(cell.qans===1){
					g.fillStyle = (cell.error===1 ? this.errcolor1 : this.cellcolor);
					return true;
				}
				if     (cell.error===1){ g.fillStyle = this.errbcolor1; return true;}
				else if(cell.qsub ===1 && this.bcolor!=="white"){ g.fillStyle = this.bcolor; return true;}
				return false;
			};
			break;
		case 'qans2':
			this.setBGCellColor = function(c){
				var cell = bd.cell[c];
				if(cell.qans===1){
					if     (cell.error===0){ g.fillStyle = this.cellcolor;}
					else if(cell.error===1){ g.fillStyle = this.errcolor1;}
					else if(cell.error===2){ g.fillStyle = this.errcolor2;}
					return true;
				}
				if     (cell.error===1){ g.fillStyle = this.errbcolor1; return true;}
				else if(cell.qsub ===1 && this.bcolor!=="white"){ g.fillStyle = this.bcolor; return true;}
				return false;
			};
			break;
		case 'qsub1':
			this.setBGCellColor = function(c){
				var cell = bd.cell[c];
				if     (cell.error===1){ g.fillStyle = this.errbcolor1; return true;}
				else if(cell.qsub ===1){ g.fillStyle = this.bcolor;     return true;}
				return false;
			};
			break;
		case 'qsub2':
			this.setBGCellColor = function(c){
				var cell = bd.cell[c];
				if     (cell.error===1){ g.fillStyle = this.errbcolor1; return true;}
				else if(cell.qsub ===1){ g.fillStyle = this.qsubcolor1; return true;}
				else if(cell.qsub ===2){ g.fillStyle = this.qsubcolor2; return true;}
				return false;
			};
			break;
		case 'qsub3':
			this.setBGCellColor = function(c){
				var cell = bd.cell[c];
				if     (cell.error===1){ g.fillStyle = this.errbcolor1; return true;}
				else if(cell.qsub ===1){ g.fillStyle = this.qsubcolor1; return true;}
				else if(cell.qsub ===2){ g.fillStyle = this.qsubcolor2; return true;}
				else if(cell.qsub ===3){ g.fillStyle = this.qsubcolor3; return true;}
				return false;
			};
			break;
		case 'icebarn':
			this.setBGCellColor = function(c){
				var cell = bd.cell[c];
				if     (cell.error===1){ g.fillStyle = this.errbcolor1; return true;}
				else if(cell.ques ===6){ g.fillStyle = this.icecolor;   return true;}
				return false;
			};
			break;
		default:
			break;
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawBGEXcells()    EXCell�ɕ`�悳���w�i�F��Canvas�ɏ�������
	// pc.setBGEXcellColor() �w�i�F�̐ݒ�E�`�攻�肷��
	//---------------------------------------------------------------------------
	drawBGEXcells : function(x1,y1,x2,y2){
		this.vinc('excell_back', 'crispEdges');

		var header = "ex_full_";
		var exlist = bd.excellinside(x1-1,y1-1,x2,y2);
		for(var i=0;i<exlist.length;i++){
			var c = exlist[i];
			if(this.setBGEXcellColor(c)){
				if(this.vnop(header+c,this.FILL)){
					g.fillRect(bd.excell[c].px+1, bd.excell[c].py+1, this.cw-1, this.ch-1);
				}
			}
			else{ this.vhide(header+c); continue;}
		}
	},
	setBGEXcellColor : function(c){
		if(bd.excell[c].error===1){ g.fillStyle = this.errbcolor1; return true;}
		return false;
	},

	//---------------------------------------------------------------------------
	// pc.drawRDotCells()  �E������Canvas�ɏ�������(�E�p)
	// pc.drawDotCells()   �E������Canvas�ɏ�������(�������l�p�`�p)
	//---------------------------------------------------------------------------
	drawRDotCells : function(x1,y1,x2,y2){
		this.vinc('cell_dot', 'auto');

		var dsize = this.cw*0.06; dsize=(dsize>2?dsize:2);
		var header = "c_rdot_";
		g.fillStyle = this.dotcolor;

		var clist = bd.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.cell[c].qsub===1){
				if(this.vnop(header+c,this.NONE)){
					g.fillCircle(bd.cell[c].cpx, bd.cell[c].cpy, dsize);
				}
			}
			else{ this.vhide(header+c);}
		}
	},
	drawDotCells : function(x1,y1,x2,y2){
		this.vinc('cell_dot', 'crispEdges');

		var dsize = this.cw*0.075;
		var header = "c_dot_";
		g.fillStyle = this.dotcolor;

		var clist = bd.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.cell[c].qsub===1){
				if(this.vnop(header+c,this.NONE)){
					g.fillRect(bd.cell[c].cpx-dsize, bd.cell[c].cpy-dsize, dsize*2, dsize*2);
				}
			}
			else{ this.vhide(header+c);}
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawNumbers()  Cell�̐�����Canvas�ɏ�������
	// pc.drawNumber1()  Cell�ɐ������L�����邽��dispnum�֐����Ăяo��
	// pc.getCellNumberColor()  Cell�̐����̐F��ݒ肷��
	// 
	// pc.drawArrowNumbers() Cell�̐����Ɩ���Canvas�ɏ�������
	// pc.drawQuesHatenas()  ques===-2�̎��ɁH��Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawNumbers : function(x1,y1,x2,y2){
		this.vinc('cell_number', 'auto');

		var clist = bd.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){ this.drawNumber1(clist[i]);}
	},
	drawNumber1 : function(c){
		var obj = bd.cell[c], key = ['cell',c].join('_'), num = bd.getNum(c);
		if(num>0 || (k.dispzero && num===0) || (k.isDispHatena && num===-2)){
			var text      = (num>=0 ? ""+num : "?");
			var fontratio = (num<10?0.8:(num<100?0.7:0.55));
			var color     = this.getCellNumberColor(c);
			this.dispnum(key, 1, text, fontratio, color, obj.cpx, obj.cpy);
		}
		else{ this.hideEL(key);}
	},
	getCellNumberColor : function(c){
		var obj = bd.cell[c], color = this.fontcolor;
		if(!k.isAnsNumber && ((k.BlackCell && obj.qans===1) || (!k.BlackCell && obj.ques!==0))){
			color = this.fontBCellcolor;
		}
		else if(obj.error===1 || obj.error===4){
			color = this.fontErrcolor;
		}
		else if(k.isAnsNumber && obj.qnum===-1){
			color = this.fontAnscolor;
		}
		return color;
	},

	drawArrowNumbers : function(x1,y1,x2,y2){
		this.vinc('cell_arrownumber', 'auto');

		var headers = ["c_ar1_", "c_dt1_", "c_dt2_", "c_ar3_", "c_dt3_", "c_dt4_"];
		var ll = this.cw*0.7;				//LineLength
		var ls = (this.cw-ll)/2;			//LineStart
		var lw = Math.max(this.cw/24, 1);	//LineWidth
		var lm = lw/2;						//LineMargin

		if(g.use.canvas && this.isdrawBC && !this.isdrawBD){ x1--; y1--; x2++; y2++;}
		var clist = bd.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];

			if(bd.cell[c].qnum!==-1 && (bd.cell[c].qnum!==-2||k.isDispHatena)){
				var ax=px=bd.cell[c].px, ay=py=bd.cell[c].py, dir = bd.cell[c].direc;

				if     (bd.cell[c].qans ===1){ g.fillStyle = this.fontBCellcolor;}
				else if(bd.cell[c].error===1){ g.fillStyle = this.fontErrcolor;}
				else                         { g.fillStyle = this.fontcolor;}

				// ���̕`��(�㉺����)
				if(dir===k.UP||dir===k.DN){
					// ���̐��̕`��
					ax+=(this.cw-ls*1.5-lm); ay+=(ls+1);
					if(this.vnop(headers[0]+c,this.FILL)){ g.fillRect(ax, ay, lw, ll);}
					ax+=lw/2;

					// ���̕`��
					if(dir===k.UP){
						if(this.vnop(headers[1]+c,this.FILL)){
							g.setOffsetLinePath(ax,ay, 0,0, -ll/6,ll/3, ll/6,ll/3, true);
							g.fill();
						}
					}
					else{ this.vhide(headers[1]+c);}
					if(dir===k.DN){
						if(this.vnop(headers[2]+c,this.FILL)){
							g.setOffsetLinePath(ax,ay+ll, 0,0, -ll/6,-ll/3, ll/6,-ll/3, true);
							g.fill();
						}
					}
					else{ this.vhide(headers[2]+c);}
				}
				else{ this.vhide([headers[0]+c, headers[1]+c, headers[2]+c]);}

				// ���̕`��(���E����)
				if(dir===k.LT||dir===k.RT){
					// ���̐��̕`��
					ax+=(ls+1); ay+=(ls*1.5-lm);
					if(this.vnop(headers[3]+c,this.FILL)){ g.fillRect(ax, ay, ll, lw);}
					ay+=lw/2;

					// ���̕`��
					if(dir===k.LT){
						if(this.vnop(headers[4]+c,this.FILL)){
							g.setOffsetLinePath(ax,ay, 0,0, ll/3,-ll/6, ll/3,ll/6, true);
							g.fill();
						}
					}
					else{ this.vhide(headers[4]+c);}
					if(dir===k.RT){
						if(this.vnop(headers[5]+c,this.FILL)){
							g.setOffsetLinePath(ax+ll,ay, 0,0, -ll/3,-ll/6, -ll/3,ll/6, true);
							g.fill();
						}
					}
					else{ this.vhide(headers[5]+c);}
				}
				else{ this.vhide([headers[3]+c, headers[4]+c, headers[5]+c]);}

				// �����̕`��
				var num = bd.getNum(c), text = (num>=0 ? ""+num : "?");
				var fontratio = (num<10?0.8:(num<100?0.7:0.55));
				var color = g.fillStyle;

				var cpx = bd.cell[c].cpx, cpy = bd.cell[c].cpy;
				if     (dir===k.UP||dir===k.DN){ fontratio *= 0.85; cpx-=this.cw*0.1;}
				else if(dir===k.LT||dir===k.RT){ fontratio *= 0.85; cpy+=this.ch*0.1;}

				this.dispnum('cell_'+c, 1, text, fontratio, color, cpx, cpy);
			}
			else{
				this.vhide([headers[0]+c, headers[1]+c, headers[2]+c, headers[3]+c, headers[4]+c, headers[5]+c]);
				this.hideEL('cell_'+c);
			}
		}
	},
	drawQuesHatenas : function(x1,y1,x2,y2){
		this.vinc('cell_number', 'auto');

		var clist = bd.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var obj = bd.cell[clist[i]], key = 'cell_'+clist[i];
			if(obj.ques===-2){
				var color = (obj.error===1 ? this.fontErrcolor : this.fontcolor);
				this.dispnum(key, 1, "?", 0.8, color, obj.cpx, obj.cpy);
			}
			else{ this.hideEL(key);}
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawCrosses()    Cross�̊ې�����Canvas�ɏ�������
	// pc.drawCrossMarks() Cross��̍��_��Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawCrosses : function(x1,y1,x2,y2){
		this.vinc('cross_base', 'auto');

		var csize = this.cw*this.crosssize+1;
		var header = "x_cp_";
		g.lineWidth = 1;

		var clist = bd.crossinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i], obj = bd.cross[c], key = ['cross',c].join('_');
			// ���̕`��
			if(obj.qnum!==-1){
				g.fillStyle = (obj.error===1 ? this.errcolor1 : "white");
				g.strokeStyle = "black";
				if(this.vnop(header+c,this.FILL_STROKE)){
					g.shapeCircle(obj.px, obj.py, csize);
				}
			}
			else{ this.vhide([header+c]);}

			// �����̕`��
			if(obj.qnum>=0){
				this.dispnum(key, 1, ""+obj.qnum, 0.6, this.fontcolor, obj.px, obj.py);
			}
			else{ this.hideEL(key);}
		}
	},
	drawCrossMarks : function(x1,y1,x2,y2){
		this.vinc('cross_mark', 'auto');

		var csize = this.cw*this.crosssize;
		var header = "x_cm_";

		var clist = bd.crossinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.cross[c].qnum===1){
				g.fillStyle = (bd.cross[c].error===1 ? this.errcolor1 : this.cellcolor);
				if(this.vnop(header+c,this.FILL)){
					g.fillCircle(bd.cross[c].px, bd.cross[c].py, csize);
				}
			}
			else{ this.vhide(header+c);}
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawBorders()        ���E����Canvas�ɏ�������
	// pc.drawBorder1()        1�J���̋��E����Canvas�ɏ�������
	// pc.setBorderColor()     ���E���̐ݒ�E�`�攻�肷��
	// pc.setBorderColorFunc() pc.setBorderColor�֐���ݒ肷��
	//---------------------------------------------------------------------------
	drawBorders : function(x1,y1,x2,y2){
		this.vinc('border', 'crispEdges');

		var idlist = bd.borderinside(x1-1,y1-1,x2+1,y2+1);
		for(var i=0;i<idlist.length;i++){ this.drawBorder1(idlist[i]);}
		this.isdrawBD = true;
	},
	drawBorder1 : function(id,forceFlag){
		var vid = [this.bdheader, id].join("_");
		if(forceFlag!==false && this.setBorderColor(id)){
			if(this.vnop(vid,this.FILL)){
				var lw = this.lw + this.addlw, lm = this.lm;
				var bx = bd.border[id].bx, by = bd.border[id].by;
				var px = bd.border[id].px, py = bd.border[id].py;
				if     (by&1){ g.fillRect(px-lm, py-this.bh-lm, lw, this.ch+lw);}
				else if(bx&1){ g.fillRect(px-this.bw-lm, py-lm, this.cw+lw, lw);}
			}
		}
		else{ this.vhide(vid);}
	},

	setBorderColor : function(id){
		if(bd.border[id].ques===1){ g.fillStyle = this.borderQuescolor; return true;}
		return false;
	},
	setBorderColorFunc : function(type){
		switch(type){
		case 'qans':
			this.setBorderColor = function(id){
				var err=bd.border[id].error;
				if(bd.isBorder(id)){
					if     (err===1){ g.fillStyle = this.errcolor1;          }
					else if(err===2){ g.fillStyle = this.errborderQanscolor2;}
					else            { g.fillStyle = this.borderQanscolor;    }
					return true;
				}
				return false;
			}
			break;
		case 'line':
			this.setBorderColor = this.setLineColor;
			break;
		case 'ice':
			this.setBorderColor = function(id){
				var cc1 = bd.border[id].cellcc[0], cc2 = bd.border[id].cellcc[1];
				if(cc1!==-1 && cc2!==-1 && (bd.cell[cc1].ques===6^bd.cell[cc2].ques===6)){
					g.fillStyle = this.cellcolor;
					return true;
				}
				return false;
			}
			break;
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawBorderQsubs() ���E���p�̕⏕�L����Canvas�ɏ�������
	// pc.drawBoxBorders()  ���E���ƍ��}�X�̊Ԃ̐���`�悷��
	//---------------------------------------------------------------------------
	drawBorderQsubs : function(x1,y1,x2,y2){
		this.vinc('border_qsub', 'crispEdges');

		var m = this.cw*0.15; //Margin
		var header = "b_qsub1_";
		g.fillStyle = this.borderQsubcolor;

		var idlist = bd.borderinside(x1-1,y1-1,x2+1,y2+1);
		for(var i=0;i<idlist.length;i++){
			var id = idlist[i];
			if(bd.border[id].qsub===1){
				if(this.vnop(header+id,this.NONE)){
					if     (bd.border[id].bx&1){ g.fillRect(bd.border[id].px, bd.border[id].py-this.bh+m, 1, this.ch-2*m);}
					else if(bd.border[id].by&1){ g.fillRect(bd.border[id].px-this.bw+m, bd.border[id].py, this.cw-2*m, 1);}
				}
			}
			else{ this.vhide(header+id);}
		}
	},

	// �O�g���Ȃ��ꍇ�͍l�����Ă��܂���
	drawBoxBorders  : function(x1,y1,x2,y2,tileflag){
		this.vinc('boxborder', 'crispEdges');

		var lw = this.lw, lm = this.lm;
		var cw = this.cw;
		var ch = this.ch;
		var chars = ['u','d','l','r'];

		g.fillStyle = this.bbcolor;

		var clist = bd.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i], vids=[];
			for(var n=0;n<12;n++){ vids[n]=['c_bb',n,c].join('_');}
			if(bd.cell[c].qans!==1){ this.vhide(vids); continue;}

			var bx = bd.cell[c].bx, by = bd.cell[c].by;
			var px = bd.cell[c].px, py = bd.cell[c].py;
			var px1 = px+lm+1, px2 = px+cw-lm-1;
			var py1 = py+lm+1, py2 = py+ch-lm-1;

			// ���̊֐����Ăԏꍇ�͑S��k.isoutsideborder===0�Ȃ̂�
			// �O�g�p�̍l���������폜���Ă��܂��B
			var UPin = (by>2), DNin = (by<2*k.qrows-2);
			var LTin = (bx>2), RTin = (bx<2*k.qcols-2);

			var isUP = (!UPin || bd.border[bd.bnum(bx  ,by-1)].ques===1);
			var isDN = (!DNin || bd.border[bd.bnum(bx  ,by+1)].ques===1);
			var isLT = (!LTin || bd.border[bd.bnum(bx-1,by  )].ques===1);
			var isRT = (!RTin || bd.border[bd.bnum(bx+1,by  )].ques===1);

			var isUL = (!UPin || !LTin || bd.border[bd.bnum(bx-2,by-1)].ques===1 || bd.border[bd.bnum(bx-1,by-2)].ques===1);
			var isUR = (!UPin || !RTin || bd.border[bd.bnum(bx+2,by-1)].ques===1 || bd.border[bd.bnum(bx+1,by-2)].ques===1);
			var isDL = (!DNin || !LTin || bd.border[bd.bnum(bx-2,by+1)].ques===1 || bd.border[bd.bnum(bx-1,by+2)].ques===1);
			var isDR = (!DNin || !RTin || bd.border[bd.bnum(bx+2,by+1)].ques===1 || bd.border[bd.bnum(bx+1,by+2)].ques===1);

			if(isUP){ if(this.vnop(vids[0],this.NONE)){ g.fillRect(px1, py1, cw-lw,1    );} }else{ this.vhide(vids[0]);}
			if(isDN){ if(this.vnop(vids[1],this.NONE)){ g.fillRect(px1, py2, cw-lw,1    );} }else{ this.vhide(vids[1]);}
			if(isLT){ if(this.vnop(vids[2],this.NONE)){ g.fillRect(px1, py1, 1    ,ch-lw);} }else{ this.vhide(vids[2]);}
			if(isRT){ if(this.vnop(vids[3],this.NONE)){ g.fillRect(px2, py1, 1    ,ch-lw);} }else{ this.vhide(vids[3]);}

			if(tileflag){
				if(!isUP&&(isUL||isLT)){ if(this.vnop(vids[4],this.NONE)){ g.fillRect(px1, py-lm, 1   ,lw+1);} }else{ this.vhide(vids[4]);}
				if(!isUP&&(isUR||isRT)){ if(this.vnop(vids[5],this.NONE)){ g.fillRect(px2, py-lm, 1   ,lw+1);} }else{ this.vhide(vids[5]);}
				if(!isLT&&(isUL||isUP)){ if(this.vnop(vids[6],this.NONE)){ g.fillRect(px-lm, py1, lw+1,1   );} }else{ this.vhide(vids[6]);}
				if(!isLT&&(isDL||isDN)){ if(this.vnop(vids[7],this.NONE)){ g.fillRect(px-lm, py2, lw+1,1   );} }else{ this.vhide(vids[7]);}
			}
			else{
				if(!isUP&&(isUL||isLT)){ if(this.vnop(vids[4] ,this.NONE)){ g.fillRect(px1, py , 1   ,lm+1);} }else{ this.vhide(vids[4] );}
				if(!isUP&&(isUR||isRT)){ if(this.vnop(vids[5] ,this.NONE)){ g.fillRect(px2, py , 1   ,lm+1);} }else{ this.vhide(vids[5] );}
				if(!isDN&&(isDL||isLT)){ if(this.vnop(vids[6] ,this.NONE)){ g.fillRect(px1, py2, 1   ,lm+1);} }else{ this.vhide(vids[6] );}
				if(!isDN&&(isDR||isRT)){ if(this.vnop(vids[7] ,this.NONE)){ g.fillRect(px2, py2, 1   ,lm+1);} }else{ this.vhide(vids[7] );}
				if(!isLT&&(isUL||isUP)){ if(this.vnop(vids[8] ,this.NONE)){ g.fillRect(px , py1, lm+1,1   );} }else{ this.vhide(vids[8] );}
				if(!isLT&&(isDL||isDN)){ if(this.vnop(vids[9] ,this.NONE)){ g.fillRect(px , py2, lm+1,1   );} }else{ this.vhide(vids[9] );}
				if(!isRT&&(isUR||isUP)){ if(this.vnop(vids[10],this.NONE)){ g.fillRect(px2, py1, lm+1,1   );} }else{ this.vhide(vids[10]);}
				if(!isRT&&(isDR||isDN)){ if(this.vnop(vids[11],this.NONE)){ g.fillRect(px2, py2, lm+1,1   );} }else{ this.vhide(vids[11]);}
			}
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawLines()    �񓚂̐���Canvas�ɏ�������
	// pc.drawLine1()    �񓚂̐���Canvas�ɏ�������(1�J���̂�)
	// pc.setLineColor() �`�悷����̐F��ݒ肷��
	// pc.drawPekes()    ���E����́~��Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawLines : function(x1,y1,x2,y2){
		this.vinc('line', 'crispEdges');

		var idlist = bd.borderinside(x1-1,y1-1,x2+1,y2+1);
		for(var i=0;i<idlist.length;i++){ this.drawLine1(idlist[i]);}
		this.addlw = 0;
	},
	drawLine1 : function(id, forceFlag){
		var vid = "b_line_"+id;
		if(forceFlag!==false && this.setLineColor(id)){
			if(this.vnop(vid,this.FILL)){
				var lw = this.lw + this.addlw, lm = this.lm;
				if     (bd.border[id].bx&1){ g.fillRect(bd.border[id].px-lm, bd.border[id].py-this.bh-lm, lw, this.ch+lw);}
				else if(bd.border[id].by&1){ g.fillRect(bd.border[id].px-this.bw-lm, bd.border[id].py-lm, this.cw+lw, lw);}
			}
		}
		else{ this.vhide(vid);}
	},
	setLineColor : function(id){
		this.addlw = 0;
		if(bd.isLine(id)){
			if     (bd.border[id].error===1){ g.fillStyle = this.errlinecolor1; if(g.use.canvas){ this.addlw=1;}}
			else if(bd.border[id].error===2){ g.fillStyle = this.errlinecolor2;}
			else if(k.irowake===0 || !pp.getVal('irowake') || !bd.border[id].color){ g.fillStyle = this.linecolor;}
			else{ g.fillStyle = bd.border[id].color;}
			return true;
		}
		return false;
	},
	drawPekes : function(x1,y1,x2,y2,flag){
		if(!g.use.canvas && flag===2){ return;}

		this.vinc('border_peke', 'auto');

		var size = this.cw*0.15+1; if(size<4){ size=4;}
		var headers = ["b_peke0_", "b_peke1_"];
		g.fillStyle = "white";
		g.strokeStyle = this.pekecolor;
		g.lineWidth = 1;

		var idlist = bd.borderinside(x1-1,y1-1,x2+1,y2+1);
		for(var i=0;i<idlist.length;i++){
			var id = idlist[i];
			if(bd.border[id].qsub!==2){ this.vhide([headers[0]+id, headers[1]+id]); continue;}

			if(g.use.canvas){
				if(flag===0 || flag===2){
					if(this.vnop(headers[0]+id,this.NONE)){
						g.fillRect(bd.border[id].px-size, bd.border[id].py-size, 2*size+1, 2*size+1);
					}
				}
				else{ this.vhide(headers[0]+id);}
			}

			if(flag===0 || flag===1){
				if(this.vnop(headers[1]+id,this.NONE)){
					g.strokeCross(bd.border[id].px, bd.border[id].py, size-1);
				}
			}
			else{ this.vhide(headers[1]+id);}
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawTriangle()   �O�p�`��Canvas�ɏ�������
	// pc.drawTriangle1()  �O�p�`��Canvas�ɏ�������(1�}�X�̂�)
	//---------------------------------------------------------------------------
	drawTriangle : function(x1,y1,x2,y2){
		this.vinc('cell_triangle', 'auto');
		var headers = ["c_tri2_", "c_tri3_", "c_tri4_", "c_tri5_"];

		if(g.use.canvas && k.puzzleid!=='reflect'){ x1--; y1--; x2++; y2++;}
		var clist = bd.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			var num = (bd.cell[c].ques!==0?bd.cell[c].ques:bd.cell[c].qans);

			this.vhide([headers[0]+c, headers[1]+c, headers[2]+c, headers[3]+c]);
			if(num>=2 && num<=5){
				switch(k.puzzleid){
				case 'reflect':
					g.fillStyle = ((bd.cell[c].error===1||bd.cell[c].error===4) ? this.errcolor1 : this.cellcolor);
					break;
				default:
					g.fillStyle = this.cellcolor;
					break;
				}

				this.drawTriangle1(bd.cell[c].px,bd.cell[c].py,num,headers[num-2]+c);
			}
		}
	},
	drawTriangle1 : function(px,py,num,vid){
		if(this.vnop(vid,this.FILL)){
			var cw = this.cw, ch = this.ch, mgn = (k.puzzleid==="reflect"?1:0);
			switch(num){
				case 2: g.setOffsetLinePath(px,py, mgn,mgn,  mgn,ch+1, cw+1,ch+1, true); break;
				case 3: g.setOffsetLinePath(px,py, cw+1,mgn, mgn,ch+1, cw+1,ch+1, true); break;
				case 4: g.setOffsetLinePath(px,py, mgn,mgn,  cw+1,mgn, cw+1,ch+1, true); break;
				case 5: g.setOffsetLinePath(px,py, mgn,mgn,  cw+1,mgn, mgn ,ch+1, true); break;
			}
			g.fill();
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawMBs()    Cell��́�,�~��Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawMBs : function(x1,y1,x2,y2){
		this.vinc('cell_mb', 'auto');
		g.strokeStyle = this.mbcolor;
		g.lineWidth = 1;

		var rsize = this.cw*0.35;
		var headers = ["c_MB1_", "c_MB2a_"];

		var clist = bd.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.cell[c].qsub===0){ this.vhide([headers[0]+c, headers[1]+c]); continue;}

			switch(bd.cell[c].qsub){
			case 1:
				if(this.vnop(headers[0]+c,this.NONE)){
					g.strokeCircle(bd.cell[c].cpx, bd.cell[c].cpy, rsize);
				}
				this.vhide(headers[1]+c);
				break;
			case 2:
				if(this.vnop(headers[1]+c,this.NONE)){
					g.strokeCross(bd.cell[c].cpx, bd.cell[c].cpy, rsize);
				}
				this.vhide(headers[0]+c);
				break;
			}
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawCircles41_42()    Cell��̍��ۂƔ��ۂ�Canvas�ɏ�������
	// pc.drawCirclesAtNumber() �������`�悳���Cell�̊ۂ���������
	// pc.drawCircle1AtNumber() �������`�悳���Cell�̊ۂ���������(1�}�X�̂�)
	//---------------------------------------------------------------------------
	drawCircles41_42 : function(x1,y1,x2,y2){
		this.vinc('cell_circle', 'auto');

		g.lineWidth = Math.max(this.cw*(this.circleratio[0]-this.circleratio[1]), 1);
		var rsize41 = this.cw*(this.circleratio[0]+this.circleratio[1])/2;
		var rsize42 = this.cw*this.circleratio[0];
		var headers = ["c_cir41_", "c_cir42_"];
		var clist = bd.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];

			if(bd.cell[c].ques===41){
				g.strokeStyle = (bd.cell[c].error===1 ? this.errcolor1  : this.cellcolor);
				g.fillStyle   = (bd.cell[c].error===1 ? this.errbcolor1 : "white");
				if(this.vnop(headers[0]+c,this.FILL_STROKE)){
					g.shapeCircle(bd.cell[c].cpx, bd.cell[c].cpy, rsize41);
				}
			}
			else{ this.vhide(headers[0]+c);}

			if(bd.cell[c].ques===42){
				g.fillStyle = (bd.cell[c].error===1 ? this.errcolor1 : this.cellcolor);
				if(this.vnop(headers[1]+c,this.FILL)){
					g.fillCircle(bd.cell[c].cpx, bd.cell[c].cpy, rsize42);
				}
			}
			else{ this.vhide(headers[1]+c);}
		}
	},
	drawCirclesAtNumber : function(x1,y1,x2,y2){
		this.vinc('cell_circle', 'auto');

		var clist = bd.cellinside(x1-2,y1-2,x2+2,y2+2);
		for(var i=0;i<clist.length;i++){ this.drawCircle1AtNumber(clist[i]);}
	},
	drawCircle1AtNumber : function(c){
		if(c===-1){ return;}

		var rsize  = this.cw*this.circleratio[0];
		var rsize2 = this.cw*this.circleratio[1];
		var headers = ["c_cira_", "c_cirb_"];

		if(bd.cell[c].qnum!=-1){
			g.lineWidth = this.cw*0.05;
			g.fillStyle = (bd.cell[c].error===1 ? this.errbcolor1 : this.circledcolor);
			if(this.vnop(headers[1]+c,this.FILL)){
				g.fillCircle(bd.cell[c].cpx, bd.cell[c].cpy, rsize2);
			}

			g.strokeStyle = (bd.cell[c].error===1 ? this.errcolor1 : this.cellcolor);
			if(this.vnop(headers[0]+c,this.STROKE)){
				g.strokeCircle(bd.cell[c].cpx, bd.cell[c].cpy, rsize);
			}
		}
		else{ this.vhide([headers[0]+c, headers[1]+c]);}
	},

	//---------------------------------------------------------------------------
	// pc.drawLineParts()   ���Ȃǂ�Canvas�ɏ�������
	// pc.drawLineParts1()  ���Ȃǂ�Canvas�ɏ�������(1�}�X�̂�)
	//---------------------------------------------------------------------------
	drawLineParts : function(x1,y1,x2,y2){
		this.vinc('cell_lineparts', 'crispEdges');

		var clist = bd.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){ this.drawLineParts1(clist[i]);}
	},
	drawLineParts1 : function(id){
		var vids = ["c_lp1_"+id, "c_lp2_"+id, "c_lp3_"+id, "c_lp4_"+id];

		var qs = bd.cell[id].ques;
		if(qs>=101 && qs<=107){
			var lw  = this.lw, lm = this.lm;
			var hhp = this.bh+this.lm, hwp = this.bw+this.lm;
			var px  = bd.cell[id].px, py = bd.cell[id].py;
			var cpx = bd.cell[id].cpx, cpy = bd.cell[id].cpy;
			g.fillStyle = this.borderQuescolor;

			var flag  = {101:15, 102:3, 103:12, 104:9, 105:5, 106:6, 107:10}[qs];
			if(flag&1){ if(this.vnop(vids[0],this.NONE)){ g.fillRect(cpx-lm, py    , lw, hhp);} }else{ this.vhide(vids[0]);}
			if(flag&2){ if(this.vnop(vids[1],this.NONE)){ g.fillRect(cpx-lm, cpy-lm, lw, hhp);} }else{ this.vhide(vids[1]);}
			if(flag&4){ if(this.vnop(vids[2],this.NONE)){ g.fillRect(px    , cpy-lm, hwp, lw);} }else{ this.vhide(vids[2]);}
			if(flag&8){ if(this.vnop(vids[3],this.NONE)){ g.fillRect(cpx-lm, cpy-lm, hwp, lw);} }else{ this.vhide(vids[3]);}
		}
		else{ this.vhide(vids);}
	},

	//---------------------------------------------------------------------------
	// pc.drawQues51()         Ques===51������悤�ȃp�Y���ŁA�`��֐����Ăяo��
	// pc.drawSlash51Cells()   [�_]�̃i�i������Canvas�ɏ�������
	// pc.drawSlash51EXcells() EXCell���[�_]�̃i�i������Canvas�ɏ�������
	// pc.drawEXCellGrid()     EXCell�Ԃ̋��E����Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawQues51 : function(x1,y1,x2,y2){
		this.drawEXCellGrid(x1,y1,x2,y2);
		this.drawSlash51Cells(x1,y1,x2,y2);
		this.drawSlash51EXcells(x1,y1,x2,y2);
		this.drawTargetTriangle(x1,y1,x2,y2);
	},
	drawSlash51Cells : function(x1,y1,x2,y2){
		this.vinc('cell_ques51', 'crispEdges');

		var header = "c_slash51_";
		g.strokeStyle = this.cellcolor;
		g.lineWidth = 1;
		var clist = bd.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i], px = bd.cell[c].px, py = bd.cell[c].py;

			if(bd.cell[c].ques===51){
				if(this.vnop(header+c,this.NONE)){
					g.strokeLine(px+1,py+1, px+this.cw,py+this.ch);
				}
			}
			else{ this.vhide(header+c);}
		}
	},
	drawSlash51EXcells : function(x1,y1,x2,y2){
		this.vinc('excell_ques51', 'crispEdges');

		var header = "ex_slash51_";
		g.strokeStyle = this.cellcolor;
		g.lineWidth = 1;
		var exlist = bd.excellinside(x1-1,y1-1,x2,y2);
		for(var i=0;i<exlist.length;i++){
			var c = exlist[i], px = bd.excell[c].px, py = bd.excell[c].py;
			if(this.vnop(header+c,this.NONE)){
				g.strokeLine(px+1,py+1, px+this.cw,py+this.ch);
			}
		}
	},
	drawEXCellGrid : function(x1,y1,x2,y2){
		this.vinc('grid_excell', 'crispEdges');

		g.fillStyle = this.cellcolor;
		var headers = ["ex_bdx_", "ex_bdy_"];
		var exlist = bd.excellinside(x1-1,y1-1,x2,y2);
		for(var i=0;i<exlist.length;i++){
			var c = exlist[i], px = bd.excell[c].px, py = bd.excell[c].py;

			if(bd.excell[c].by===-1 && bd.excell[c].bx<bd.maxbx){
				if(this.vnop(headers[0]+c,this.NONE)){
					g.fillRect(px+this.cw, py, 1, this.ch);
				}
			}

			if(bd.excell[c].bx===-1 && bd.excell[c].by<bd.maxby){
				if(this.vnop(headers[1]+c,this.NONE)){
					g.fillRect(px, py+this.ch, this.cw, 1);
				}
			}
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawNumbersOn51()   [�_]�ɐ������L������
	// pc.drawNumbersOn51_1() 1��[�_]�ɐ������L������
	//---------------------------------------------------------------------------
	drawNumbersOn51 : function(x1,y1,x2,y2){
		this.vinc('cell_number51', 'auto');

		for(var bx=(x1|1)-2;bx<=x2+2;bx+=2){
			for(var by=(y1|1)-2;by<=y2+2;by+=2){
				// cell�ゾ�����ꍇ
				if(bx!==-1 && by!==-1){
					var c = bd.cnum(bx,by);
					if(c!==-1){ this.drawNumbersOn51_1('cell', c);}
				}
				// excell�ゾ�����ꍇ
				else{
					var c = bd.exnum(bx,by);
					if(c!==-1){ this.drawNumbersOn51_1('excell', c);}
				}
			}
		}
	},
	drawNumbersOn51_1 : function(family, c){
		var val, err, guard, nb, type, str, obj=bd[family][c];
		var keys = [[family,c,'ques51','rt'].join('_'), [family,c,'ques51','dn'].join('_')];

		if(family==='excell' || bd.cell[c].ques===51){
			for(var i=0;i<2;i++){
				if     (i===0){ val=obj.qnum,  guard=obj.by, nb=bd.cnum(obj.bx+2, obj.by), type=4;} // 1��ڂ͉E����
				else if(i===1){ val=obj.direc, guard=obj.bx, nb=bd.cnum(obj.bx, obj.by+2), type=2;} // 2��ڂ͉�����

				if(val!==-1 && guard!==-1 && nb!==-1 && bd.cell[nb].ques!==51){
					var color = (obj.error===1?this.fontErrcolor:this.fontcolor);
					var text = (val>=0?""+val:"");

					this.dispnum(keys[i], type, text, 0.45, color, obj.px+this.bw, obj.py+this.bh);
				}
				else{ this.hideEL(keys[i]);}
			}
		}
		else{
			this.hideEL(keys[0]);
			this.hideEL(keys[1]);
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawTarget()  ���͑ΏۂƂȂ�ꏊ��`�悷��
	// pc.drawCursor()  �L�[�{�[�h����̓��͑Ώۂ�Canvas�ɏ�������
	// pc.drawTargetTriangle() [�_]�̂������͑Ώۂ̂ق��ɔw�i�F������
	//---------------------------------------------------------------------------
	drawTarget : function(x1,y1,x2,y2){
		this.drawCursor(x1, y1, x2, y2, true, k.editmode);
	},

	drawCursor : function(x1,y1,x2,y2,islarge,isdraw){
		this.vinc('target_cursor', 'crispEdges');

		if(isdraw!==false && pp.getVal('cursor')){
			if(tc.cursorx < x1-1 || x2+1 < tc.cursorx){ return;}
			if(tc.cursory < y1-1 || y2+1 < tc.cursory){ return;}

			var cpx = k.p0.x + tc.cursorx*this.bw + 0.5;
			var cpy = k.p0.y + tc.cursory*this.bh + 0.5;
			var w, size;
			if(islarge!==false){ w = mf(Math.max(this.cw/16, 2)); size = this.bw-0.5;}
			else	           { w = mf(Math.max(this.cw/24, 1)); size = this.bw*0.56;}

			this.vdel(["ti1_","ti2_","ti3_","ti4_"]);
			g.fillStyle = (k.editmode?this.targetColor1:this.targetColor3);
			if(this.vnop("ti1_",this.FILL)){ g.fillRect(cpx-size,   cpy-size,   size*2, w);}
			if(this.vnop("ti2_",this.FILL)){ g.fillRect(cpx-size,   cpy-size,   w, size*2);}
			if(this.vnop("ti3_",this.FILL)){ g.fillRect(cpx-size,   cpy+size-w, size*2, w);}
			if(this.vnop("ti4_",this.FILL)){ g.fillRect(cpx+size-w, cpy-size,   w, size*2);}
		}
		else{ this.vhide(["ti1_","ti2_","ti3_","ti4_"]);}
	},

	drawTargetTriangle : function(x1,y1,x2,y2){
		this.vinc('target_triangle', 'auto');

		var vid = "target_triangle";
		this.vdel([vid]);

		if(k.playmode){ return;}

		if(tc.cursorx < x1 || x2+2 < tc.cursorx){ return;}
		if(tc.cursory < y1 || y2+2 < tc.cursory){ return;}

		var cc = tc.getTCC(), ex = -1;
		if(cc===-1){ ex = tc.getTEC();}
		var target = kc.detectTarget(cc,ex);
		if(target===-1){ return;}

		g.fillStyle = this.ttcolor;
		this.drawTriangle1(k.p0.x+(tc.cursorx>>1)*this.cw, k.p0.y+(tc.cursory>>1)*this.ch, (target===2?4:2), vid);
	},

	//---------------------------------------------------------------------------
	// pc.drawDashedCenterLines() �Z���̒��S���璆�S�ɂЂ����_����Canvas�ɕ`�悷��
	//---------------------------------------------------------------------------
	drawDashedCenterLines : function(x1,y1,x2,y2){
		this.vinc('centerline', 'crispEdges');
		if(x1<bd.minbx+1){ x1=bd.minbx+1;} if(x2>bd.maxbx-1){ x2=bd.maxbx-1;}
		if(y1<bd.minby+1){ y1=bd.minby+1;} if(y2>bd.maxby-1){ y2=bd.maxby-1;}
		x1|=1, y1|=1;

		if(g.use.canvas){
			g.fillStyle = this.gridcolor;
			for(var i=x1;i<=x2;i+=2){
				for(var j=(k.p0.y+y1*this.bh),len=(k.p0.y+y2*this.bh);j<len;j+=6){
					g.fillRect(k.p0.x+i*this.bw, j, 1, 3);
				}
			}
			for(var i=y1;i<=y2;i+=2){
				for(var j=(k.p0.x+x1*this.bw),len=(k.p0.x+x2*this.bw);j<len;j+=6){
					g.fillRect(j, k.p0.y+i*this.bh, 3, 1);
				}
			}
		}
		else{
			g.lineWidth = 1;
			g.strokeStyle = this.gridcolor;
			for(var i=x1;i<=x2;i+=2){ if(this.vnop("cliney_"+i,this.NONE)){
				var px = k.p0.x+i*this.bw, py1 = k.p0.y+y1*this.bh, py2 = k.p0.y+y2*this.bh;
				g.strokeLine(px, py1, px, py2);
				g.setDashSize(3);
			}}
			for(var i=y1;i<=y2;i+=2){ if(this.vnop("clinex_"+i,this.NONE)){
				var py = k.p0.y+i*this.bh, px1 = k.p0.x+x1*this.bw, px2 = k.p0.x+x2*this.bw;
				g.strokeLine(px1, py, px2, py);
				g.setDashSize(3);
			}}
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawGrid()        �Z���̘g��(����)��Canvas�ɏ�������
	// pc.drawDashedGrid()  �Z���̘g��(�_��)��Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawGrid : function(x1,y1,x2,y2,isdraw){
		this.vinc('grid', 'crispEdges');

		// �O�g�܂ŕ`�悷��킯����Ȃ��̂ŁAmaxbx�Ƃ��g���܂���
		if(x1<0){ x1=0;} if(x2>2*k.qcols){ x2=2*k.qcols;}
		if(y1<0){ y1=0;} if(y2>2*k.qrows){ y2=2*k.qrows;}
		x1-=(x1&1), y1-=(y1&1);

		var bs=((k.isborder!==2&&this.chassisflag)?2:0);
		var xa = Math.max(x1,0+bs), xb = Math.min(x2,2*k.qcols-bs);
		var ya = Math.max(y1,0+bs), yb = Math.min(y2,2*k.qrows-bs);

		isdraw = (isdraw!==false?true:false);
		if(isdraw){
			g.fillStyle = this.gridcolor;
			for(var i=xa;i<=xb;i+=2){ if(this.vnop("bdy_"+i,this.NONE)){ g.fillRect(k.p0.x+i*this.bw, k.p0.y+y1*this.bh, 1, (y2-y1)*this.bh+1);} }
			for(var i=ya;i<=yb;i+=2){ if(this.vnop("bdx_"+i,this.NONE)){ g.fillRect(k.p0.x+x1*this.bw, k.p0.y+i*this.bh, (x2-x1)*this.bw+1, 1);} }
		}
		else{
			if(!g.use.canvas){
				for(var i=xa;i<=xb;i+=2){ this.vhide("bdy_"+i);}
				for(var i=ya;i<=yb;i+=2){ this.vhide("bdx_"+i);}
			}
		}
	},
	drawDashedGrid : function(x1,y1,x2,y2){
		this.vinc('grid', 'crispEdges');
		if(x1<bd.minbx){ x1=bd.minbx;} if(x2>bd.maxbx){ x2=bd.maxbx;}
		if(y1<bd.minby){ y1=bd.minby;} if(y2>bd.maxby){ y2=bd.maxby;}
		x1-=(x1&1), y1-=(y1&1);

		var dotmax   = this.cw/10+3;
		var dotCount = Math.max(this.cw/dotmax, 1);
		var dotSize  = this.cw/(dotCount*2);

		//var bs=((k.isborder!==2&&this.chassisflag)?1:0);
		var bs=(this.chassisflag?2:0);
		var xa = Math.max(x1,bd.minbx+bs), xb = Math.min(x2,bd.maxbx-bs);
		var ya = Math.max(y1,bd.minby+bs), yb = Math.min(y2,bd.maxby-bs);

		if(g.use.canvas){
			g.fillStyle = this.gridcolor;
			for(var i=xa;i<=xb;i+=2){
				var px = k.p0.x+i*this.bw;
				for(var j=(k.p0.y+y1*this.bh),len=(k.p0.y+y2*this.bh);j<len;j+=(2*dotSize)){
					g.fillRect(px, j, 1, dotSize);
				}
			}
			for(var i=ya;i<=yb;i+=2){
				var py = k.p0.y+i*this.bh;
				for(var j=(k.p0.x+x1*this.bw),len=(k.p0.x+x2*this.bw);j<len;j+=(2*dotSize)){
					g.fillRect(j, py, dotSize, 1);
				}
			}
		}
		else{
			// stroke�Ԃ�0.5���炷
			g.lineWidth = 1;
			g.strokeStyle = this.gridcolor;
			for(var i=xa;i<=xb;i+=2){ if(this.vnop("bdy_"+i,this.NONE)){
				var px = k.p0.x+i*this.bw+0.5, py1 = k.p0.y+y1*this.bh, py2 = k.p0.y+y2*this.bh;
				g.strokeLine(px, py1, px, py2);
				g.setDashSize(dotSize);
			}}
			for(var i=ya;i<=yb;i+=2){ if(this.vnop("bdx_"+i,this.NONE)){
				var py = k.p0.y+i*this.bh+0.5, px1 = k.p0.x+x1*this.bw, px2 = k.p0.x+x2*this.bw;
				g.strokeLine(px1, py, px2, py);
				g.setDashSize(dotSize);
			}}
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawChassis()     �O�g��Canvas�ɏ�������
	// pc.drawChassis_ex1() k.isextencdell==1�̎��̊O�g��Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawChassis : function(x1,y1,x2,y2){
		this.vinc('chassis', 'crispEdges');

		// ex===0��ex===2�œ����ꏊ�ɕ`�悷��̂ŁAmaxbx�Ƃ��g���܂���
		if(x1<0){ x1=0;} if(x2>2*k.qcols){ x2=2*k.qcols;}
		if(y1<0){ y1=0;} if(y2>2*k.qrows){ y2=2*k.qrows;}

		var lw = (k.puzzleid!=='bosanowa'?this.lw:1), bw = this.bw, bh = this.bh;
		var boardWidth = k.qcols*this.cw, boardHeight = k.qrows*this.ch;
		g.fillStyle = "black";

		if(g.use.canvas){
			if(x1===0)        { g.fillRect(k.p0.x      -lw+1, k.p0.y+y1*bh-lw+1,  lw, (y2-y1)*bh+2*lw-2);}
			if(x2===2*k.qcols){ g.fillRect(k.p0.x+boardWidth, k.p0.y+y1*bh-lw+1,  lw, (y2-y1)*bh+2*lw-2);}
			if(y1===0)        { g.fillRect(k.p0.x+x1*bw-lw+1, k.p0.y      -lw+1,  (x2-x1)*bw+2*lw-2, lw); }
			if(y2===2*k.qrows){ g.fillRect(k.p0.x+x1*bw-lw+1, k.p0.y+boardHeight, (x2-x1)*bw+2*lw-2, lw); }
		}
		else{
			if(this.vnop("chs1_",this.NONE)){ g.fillRect(k.p0.x-lw+1,        k.p0.y-lw+1, lw, boardHeight+2*lw-2);}
			if(this.vnop("chs2_",this.NONE)){ g.fillRect(k.p0.x+boardWidth,  k.p0.y-lw+1, lw, boardHeight+2*lw-2);}
			if(this.vnop("chs3_",this.NONE)){ g.fillRect(k.p0.x-lw+1,        k.p0.y-lw+1, boardWidth+2*lw-2, lw); }
			if(this.vnop("chs4_",this.NONE)){ g.fillRect(k.p0.x-lw+1, k.p0.y+boardHeight, boardWidth+2*lw-2, lw); }
		}
	},
	drawChassis_ex1 : function(x1,y1,x2,y2,boldflag){
		this.vinc('chassis_ex1', 'crispEdges');
		if(x1<=0){ x1=bd.minbx;} if(x2>bd.maxbx){ x2=bd.maxbx;}
		if(y1<=0){ y1=bd.minby;} if(y2>bd.maxby){ y2=bd.maxby;}

		var lw = this.lw, lm = this.lm, bw = this.bw, bh = this.bh;
		var boardWidth = k.qcols*this.cw, boardHeight = k.qrows*this.ch;
		g.fillStyle = "black";

		// extendcell==1���܂񂾊O�g�̕`��
		if(g.use.canvas){
			if(x1===bd.minbx){ g.fillRect(k.p0.x-this.cw-lw+1, k.p0.y+y1*bh-lw+1,   lw, (y2-y1)*bh+2*lw-2);}
			if(x2===bd.maxbx){ g.fillRect(k.p0.x+boardWidth,   k.p0.y+y1*bh-lw+1,   lw, (y2-y1)*bh+2*lw-2);}
			if(y1===bd.minby){ g.fillRect(k.p0.x+x1*bw-lw+1,   k.p0.y-this.ch-lw+1, (x2-x1)*bw+2*lw-2, lw);}
			if(y2===bd.maxby){ g.fillRect(k.p0.x+x1*bw-lw+1,   k.p0.y+boardHeight,  (x2-x1)*bw+2*lw-2, lw);}
		}
		else{
			if(this.vnop("chsex1_1_",this.NONE)){ g.fillRect(k.p0.x-this.cw-lw+1, k.p0.y-this.ch-lw+1, lw, boardHeight+this.ch+2*lw-2);}
			if(this.vnop("chsex1_2_",this.NONE)){ g.fillRect(k.p0.x+boardWidth,   k.p0.y-this.ch-lw+1, lw, boardHeight+this.ch+2*lw-2);}
			if(this.vnop("chsex1_3_",this.NONE)){ g.fillRect(k.p0.x-this.cw-lw+1, k.p0.y-this.ch-lw+1, boardWidth+this.cw+2*lw-2, lw); }
			if(this.vnop("chsex1_4_",this.NONE)){ g.fillRect(k.p0.x-this.cw-lw+1, k.p0.y+boardHeight,  boardWidth+this.cw+2*lw-2, lw); }
		}

		// �ʏ�̃Z����extendcell==1�̊Ԃ̕`��
		if(boldflag){
			// ���ׂđ����ŕ`�悷��ꍇ
			if(g.use.canvas){
				if(x1<=0){ g.fillRect(k.p0.x-lw+1, k.p0.y+y1*bh-lw+1, lw, (y2-y1)*bh+lw-1);}
				if(y1<=0){ g.fillRect(k.p0.x+x1*bw-lw+1, k.p0.y-lw+1, (x2-x1)*bw+lw-1, lw); }
			}
			else{
				if(this.vnop("chs1_",this.NONE)){ g.fillRect(k.p0.x-lw+1, k.p0.y-lw+1, lw, boardHeight+lw-1);}
				if(this.vnop("chs2_",this.NONE)){ g.fillRect(k.p0.x-lw+1, k.p0.y-lw+1, boardWidth+lw-1,  lw);}
			}
		}
		else{
			// ques==51�̃Z�����אڂ��Ă��鎞�ɍא���`�悷��ꍇ
			if(g.use.canvas){
				if(x1<=0){ g.fillRect(k.p0.x, k.p0.y+y1*bh, 1, (y2-y1)*bh);}
				if(y1<=0){ g.fillRect(k.p0.x+x1*bw, k.p0.y, (x2-x1)*bw, 1); }
			}
			else{
				if(this.vnop("chs1_",this.NONE)){ g.fillRect(k.p0.x, k.p0.y, 1, boardHeight);}
				if(this.vnop("chs2_",this.NONE)){ g.fillRect(k.p0.x, k.p0.y, boardWidth, 1); }
			}

			var headers = ["chs1_sub_", "chs2_sub_"];
			var clist = bd.cellinside(x1-1,y1-1,x2+1,y2+1);
			for(var i=0;i<clist.length;i++){
				var c = clist[i], bx = bd.cell[c].bx, by = bd.cell[c].by;
				var px = bd.cell[c].px, py = bd.cell[c].py;
				if(bx===1){
					if(bd.cell[c].ques!==51){
						if(this.vnop(headers[0]+by,this.NONE)){
							g.fillRect(k.p0.x-lm, py-lm, lw, this.ch+lw);
						}
					}
					else{ this.vhide([headers[0]+by]);}
				}
				if(by===1){
					if(bd.cell[c].ques!==51){
						if(this.vnop(headers[1]+bx,this.NONE)){
							g.fillRect(px-lm, k.p0.x-lm, this.cw+lw, lw);
						}
					}
					else{ this.vhide([headers[1]+bx]);}
				}
			}
		}
	},

	//---------------------------------------------------------------------------
	// pc.flushCanvas()    �w�肳�ꂽ�̈�𔒂œh��Ԃ�
	// pc.flushCanvasAll() Canvas�S�ʂ𔒂œh��Ԃ�
	//
	// pc.vnop()  VML�Ŋ��ɕ`�悳��Ă���I�u�W�F�N�g���ĕ`�悹���A�F�͐ݒ肷��
	// pc.vhide() VML�Ŋ��ɕ`�悳��Ă���I�u�W�F�N�g���B��
	// pc.vdel()  VML�Ŋ��ɕ`�悳��Ă���I�u�W�F�N�g���폜����
	// pc.vinc()  z-index�ɐݒ肳���l��+1����
	//---------------------------------------------------------------------------
	flushCanvasAll : f_true,
	flushCanvas    : f_true,
	vnop  : f_true,
	vhide : f_true,
	vdel  : f_true,
	vinc  : f_true,

	setVectorFunctions : function(){
		if(g.use.canvas){
			this.flushCanvasAll = function(x1,y1,x2,y2){
				this.numobj = {};
				base.numparent.innerHTML = '';
			};
			this.flushCanvas = function(x1,y1,x2,y2){
				g.fillStyle = (!this.bgcolor ? "rgb(255, 255, 255)" : this.bgcolor);
				g.fillRect(k.p0.x+x1*this.bw, k.p0.y+y1*this.bh, (x2-x1)*this.bw, (y2-y1)*this.bh);
			};
			this.vnop  = f_true;
			this.vhide = f_true;
			this.vdel  = f_true;
			this.vinc = function(layerid, rendering){
				g.setLayer(layerid);
				if(rendering){ g.setRendering(rendering);}
			};
		}
		else{
			this.flushCanvasAll = function(x1,y1,x2,y2){
				g.clear();
				this.zidx=0;
				this.zidx_array=[];

				this.numobj = {};
				base.numparent.innerHTML = '';

				this.vinc('board_base', 'crispEdges');
				g.fillStyle = (!this.bgcolor ? "rgb(255, 255, 255)" : this.bgcolor);
				if(this.vnop("boardfull",this.NONE)){
					g.fillRect(k.p0.x, k.p0.y, k.qcols*this.cw, k.qrows*this.ch);
				}
			};
			this.flushCanvas = function(x1,y1,x2,y2){
				this.zidx=1;
			};
			this.vnop = function(vid, ccflag){ // stroke�̂�:0, fill�̂�:1, ����:2, �F�̕ύX�Ȃ�:3
				g.vid = vid;
				if(!!g.elements[vid]){
					var el = g.elements[vid],
						isfill   = this.vnop_FILL[ccflag],
						isstroke = this.vnop_STROKE[ccflag];

					if(g.use.vml){
						el.style.display = 'inline';
						if(isfill)  { el.fillcolor   = Camp.parse(g.fillStyle);}
						if(isstroke){ el.strokecolor = Camp.parse(g.strokeStyle);}
					}
					else if(g.use.sl){
						el.Visibility = "Visible";
						if(isfill)  { el.fill   = Camp.parse(g.fillStyle);  }
						if(isstroke){ el.stroke = Camp.parse(g.strokeStyle);}
					}
					else if(g.use.svg){
						el.style.display = 'inline';
						if(isfill)  { el.setAttribute('fill',  Camp.parse(g.fillStyle));}
						if(isstroke){ el.setAttribute('stroke',Camp.parse(g.strokeStyle));}
					}
					return false;
				}
				return true;
			};
			this.vhide = function(vid){
				if(typeof vid === 'string'){ vid = [vid];}
				for(var i=0;i<vid.length;i++){
					if(g.elements[vid[i]]){
						if(!g.use.sl){ g.elements[vid[i]].style.display = 'none';}
						else{ g.elements[vid[i]].Visibility = "Collapsed";}
					}
				}
			};
			this.vdel = function(vid){
				for(var i=0;i<vid.length;i++){
					if(g.elements[vid[i]]){
						if(!g.use.sl){ g.target.removeChild(g.elements[vid[i]]);}
						else{ g.elements[vid[i]].Visibility = "Collapsed";}
						g.elements[vid[i]] = null;
					}
				}
			};
			this.vinc = function(layerid, rendering){
				g.vid = "";
				g.setLayer(layerid);

				if(!this.zidx_array[layerid]){
					this.zidx++;
					this.zidx_array[layerid] = this.zidx;
					if(rendering){ g.setRendering(rendering);}
					if(!g.use.sl){ g.getLayerElement().style.zIndex = this.zidx;}
					else{ g.getLayerElement()["Canvas.ZIndex"] = this.zidx;}
				}
			};
		}
	},

	//---------------------------------------------------------------------------
	// pc.showEL()   �G�������g��\������
	// pc.hideEL()   �G�������g���B��
	// pc.dispnum()  �������L�����邽�߂̋��ʊ֐�
	//---------------------------------------------------------------------------
	showEL : function(key){
		// �Ăяo������ if(!this.fillTextPrecisely) �̒������Ȃ̂�
		// hideEL�ɂ�������͌��Ȃ��Ă��悳�����B
		this.numobj[key].style.display = 'inline';
	},
	hideEL : function(key){
		if(!!this.numobj[key]){
			this.numobj[key].style.display = 'none';
		}
	},
	dispnum : function(key, type, text, fontratio, color, px, py){
		if(!this.fillTextPrecisely){
			if(k.br.IEmoz4){ py+=2;}

			// �G�������g���擾
			var el = this.numobj[key];
			if(!el){ el = this.numobj[key] = ee.createEL(this.EL_NUMOBJ,'');}

			el.innerHTML = text;

			var fontsize = mf(this.cw*fontratio*this.fontsizeratio);
			el.style.fontSize = (""+ fontsize + 'px');

			this.showEL(key);	// ��ɕ\�����Ȃ���wid,hgt=0�ɂȂ��Ĉʒu�������

			var wid = el.offsetWidth;
			var hgt = el.offsetHeight;

			if(type===1){
				px+=2; // �Ȃ񂩂�����Ƃ����
				el.style.left = k.cv_oft.x+px-wid/2 + 'px';
				el.style.top  = k.cv_oft.y+py-hgt/2 + 'px';
			}
			else{
				if     (type===3||type===4){ el.style.left = k.cv_oft.x+px+this.bw-wid -1 + 'px';}
				else if(type===2||type===5){ el.style.left = k.cv_oft.x+px-this.bw     +3 + 'px';}
				if     (type===2||type===3){ el.style.top  = k.cv_oft.y+py+this.bh-hgt -1 + 'px';}
				else if(type===4||type===5){ el.style.top  = k.cv_oft.y+py-this.bh     +2 + 'px';}
			}

			el.style.color = color;
		}
		// Native�ȕ��@�͂������Ȃ񂾂��ǁA�A(�O�͌v5�`6%���炢�x���Ȃ��Ă�)
		else{
			g.font = ""+mf(this.cw*fontratio*this.fontsizeratio)+"px 'Serif'";
			g.fillStyle = color;
			if(type===1){
				g.textAlign = 'center'; g.textBaseline = 'middle';
			}
			else{
				g.textAlign    = ((type===3||type===4)?'right':'left');
				g.textBaseline = ((type===2||type===3)?'alphabetic':'top');
				px += ((type===3||type===4)?this.bw-1:-this.bw+2), py += ((type===2||type===3)?this.bh-2:-this.bh+1);
			}
			g.fillText(text, px, py);
		}
	}
};

//---------------------------------------------------------------------------
// ��MouseEvent�N���X �}�E�X���͂Ɋւ�����̕ێ��ƃC�x���g����������
//---------------------------------------------------------------------------
// �p�Y������ �}�E�X���͕�
// MouseEvent�N���X���`
var MouseEvent = function(){
	this.enableMouse = true;	// �}�E�X���͂͗L����

	this.inputPos;
	this.mouseCell;
	this.inputData;
	this.firstPos;
	this.btn = {};
	this.mousereset();

	this.enableInputHatena = k.isDispHatena;
	this.inputQuesDirectly = false;

	this.mouseoffset;
	if     (k.br.IEmoz4)   { this.mouseoffset = new Pos(2,2);}
	else if(k.br.WinWebKit){ this.mouseoffset = new Pos(1,1);}
	else                   { this.mouseoffset = new Pos(0,0);}
};
MouseEvent.prototype = {
	//---------------------------------------------------------------------------
	// mv.mousereset() �}�E�X���͂Ɋւ����������������
	//---------------------------------------------------------------------------
	mousereset : function(){
		this.inputPos = new Pos(-1, -1);
		this.mouseCell = -1;
		this.inputData = -1;
		this.firstPos = new Pos(-1, -1);
		this.btn = { Left:false, Middle:false, Right:false};
	},

	//---------------------------------------------------------------------------
	// mv.e_mousedown() Canvas��Ń}�E�X�̃{�^�����������ۂ̃C�x���g���ʏ���
	// mv.e_mouseup()   Canvas��Ń}�E�X�̃{�^����������ۂ̃C�x���g���ʏ���
	// mv.e_mousemove() Canvas��Ń}�E�X�𓮂������ۂ̃C�x���g���ʏ���
	// mv.e_mouseout()  �}�E�X�J�[�\�����E�B���h�E���痣�ꂽ�ۂ̃C�x���g���ʏ���
	//---------------------------------------------------------------------------
	//�C�x���g�n���h������Ăяo�����
	// ����3�̃}�E�X�C�x���g��Canvas����Ăяo�����(mv��bind���Ă���)
	e_mousedown : function(e){
		if(this.enableMouse){
			this.setButtonFlag(e);
			// SHIFT�L�[�������Ă��鎞�͍��E�{�^�����]
			if(((kc.isSHIFT)^pp.getVal('lrcheck'))&&(this.btn.Left^this.btn.Right)){
				this.btn.Left = !this.btn.Left; this.btn.Right = !this.btn.Right;
			}
			if(this.btn.Middle){ this.modeflip();} //���{�^��
			else{
				if(ans.errDisp){ bd.errclear();}
				um.newOperation(true);
				this.setposition(e);
				this.mousedown();	// �e�p�Y���̃��[�`����
			}
		}
		ee.stopPropagation(e);
		ee.preventDefault(e);
		return false;
	},
	e_mouseup   : function(e){
		if(this.enableMouse && !this.btn.Middle && (this.btn.Left || this.btn.Right)){
			um.newOperation(false);
			this.setposition(e);
			this.mouseup();		// �e�p�Y���̃��[�`����
			this.mousereset();
		}
		ee.stopPropagation(e);
		ee.preventDefault(e);
		return false;
	},
	e_mousemove : function(e){
		// �|�b�v�A�b�v���j���[�ړ����͓��Y�������ŗD��
		if(!!menu.movingpop){ return true;}

		if(this.enableMouse && !this.btn.Middle && (this.btn.Left || this.btn.Right)){
			um.newOperation(false);
			this.setposition(e);
			this.mousemove();	// �e�p�Y���̃��[�`����
		}
		ee.stopPropagation(e);
		ee.preventDefault(e);
		return false;
	},
	e_mouseout : function(e) {
		um.newOperation(false);
	},

	//---------------------------------------------------------------------------
	// mv.mousedown() Canvas��Ń}�E�X�̃{�^�����������ۂ̃C�x���g�����B�e�p�Y���̃t�@�C���ŃI�[�o�[���C�h�����B
	// mv.mouseup()   Canvas��Ń}�E�X�̃{�^����������ۂ̃C�x���g�����B�e�p�Y���̃t�@�C���ŃI�[�o�[���C�h�����B
	// mv.mousemove() Canvas��Ń}�E�X�𓮂������ۂ̃C�x���g�����B�e�p�Y���̃t�@�C���ŃI�[�o�[���C�h�����B
	//---------------------------------------------------------------------------
	//�I�[�o�[���C�h�p
	mousedown : function(){ },
	mouseup   : function(){ },
	mousemove : function(){ },

	//---------------------------------------------------------------------------
	// mv.setButtonFlag() ��/��/�E�{�^����������Ă��邩�ݒ肷��
	//---------------------------------------------------------------------------
	setButtonFlag : (
		((k.br.IE) ?
			function(e){ this.btn = { Left:(e.button===1), Middle:(e.button===4), Right:(e.button===2)};}
		:(k.br.WinWebKit) ?
			function(e){ this.btn = { Left:(e.button===0), Middle:(e.button===1), Right:(e.button===2)};}
		:(k.br.WebKit) ?
			function(e){
				this.btn = { Left:(e.which===1 && !e.metaKey), Middle:false, Right:(e.which===1 && !!e.metaKey) };
			}
		:
			function(e){
				this.btn = (!!e.which ? { Left:(e.which ===1), Middle:(e.which ===2), Right:(e.which ===3)}
									  : { Left:(e.button===0), Middle:(e.button===1), Right:(e.button===2)});
			}
		)
	),

	//---------------------------------------------------------------------------
	// mv.setposition()   �C�x���g���N���������W��inputPos�ɑ��
	// mv.notInputted()   �Ֆʂւ̓��͂��s��ꂽ���ǂ������肷��
	// mv.modeflip()      ���{�^���Ń��[�h��ύX����Ƃ��̏���
	//---------------------------------------------------------------------------
	setposition : function(e){
		this.inputPos.x = ee.pageX(e) -k.cv_oft.x-k.p0.x - this.mouseoffset.x;
		this.inputPos.y = ee.pageY(e) -k.cv_oft.y-k.p0.y - this.mouseoffset.y;
	},

	notInputted : function(){ return !um.changeflag;},
	modeflip    : function(){ if(k.EDITOR){ pp.setVal('mode', (k.playmode?1:3));} },

	// ���ʊ֐�
	//---------------------------------------------------------------------------
	// mv.cellid()    ���͂��ꂽ�ʒu���ǂ̃Z����ID�ɊY�����邩��Ԃ�
	// mv.crossid()   ���͂��ꂽ�ʒu���ǂ̌����_��ID�ɊY�����邩��Ԃ�
	// mv.borderid()  ���͂��ꂽ�ʒu���ǂ̋��E���ELine��ID�ɊY�����邩��Ԃ�(�N���b�N�p)
	// mv.borderpos() ���͂��ꂽ�ʒu�����z�Z����łǂ���(X*2,Y*2)�ɊY�����邩��Ԃ��B
	//                �O�g�̍��オ(0,0)�ŉE����(k.qcols*2,k.qrows*2)�Brc��0�`0.5�̃p�����[�^�B
	//---------------------------------------------------------------------------
	cellid : function(){
		var pos = this.borderpos(0);
		if(this.inputPos.x%k.cwidth===0 || this.inputPos.y%k.cheight===0){ return -1;} // �҂�����͖���
		return bd.cnum(pos.x,pos.y);
	},
	crossid : function(){
		var pos = this.borderpos(0.5);
		return bd.xnum(pos.x,pos.y);
	},
	borderpos : function(rc){
		// �}�C�i�X�ł��V�[�����X�Ȓl�ɂ������̂ŁA+4����-4����
		var pm = rc*k.cwidth, px=(this.inputPos.x+pm+2*k.cwidth), py=(this.inputPos.y+pm+2*k.cheight);
		var bx = ((px/k.cwidth)|0)*2  + ((px%k.cwidth <2*pm)?0:1) - 4;
		var by = ((py/k.cheight)|0)*2 + ((py%k.cheight<2*pm)?0:1) - 4;

		return new Pos(bx,by);
	},

	borderid : function(spc){
		var bx = mf(this.inputPos.x/k.cwidth)*2+1, by = mf(this.inputPos.y/k.cheight)*2+1;
		var dx = this.inputPos.x%k.cwidth,         dy = this.inputPos.y%k.cheight;

		// �^�񒆂̂�����͂ǂ��ɂ��Y�����Ȃ��悤�ɂ���
		if(k.isLineCross){
			if(!k.isborderAsLine){
				var m1=spc*k.cwidth, m2=(1-spc)*k.cwidth;
				if((dx<m1||m2<dx) && (dy<m1||m2<dy)){ return -1;}
			}
			else{
				var m1=(0.5-spc)*k.cwidth, m2=(0.5+spc)*k.cwidth;
				if(m1<dx && dx<m2 && m1<dy && dy<m2){ return -1;}
			}
		}

		if(dx<k.cwidth-dy){	//����
			if(dx>dy){ return bd.bnum(bx  ,by-1);}	//���さ�E�� -> ��
			else     { return bd.bnum(bx-1,by  );}	//���さ���� -> ��
		}
		else{	//�E��
			if(dx>dy){ return bd.bnum(bx+1,by  );}	//�E�����E�� -> �E
			else     { return bd.bnum(bx,  by+1);}	//�E�������� -> ��
		}
		return -1;
	},

	//---------------------------------------------------------------------------
	// mv.inputcell() Cell��qans(�񓚃f�[�^)��0/1/2�̂����ꂩ����͂���B
	// mv.decIC()     0/1/2�ǂ����͂��ׂ��������肷��B
	//---------------------------------------------------------------------------
	inputcell : function(){
		var cc = this.cellid();
		if(cc==-1 || cc==this.mouseCell){ return;}
		if(this.inputData==-1){ this.decIC(cc);}

		this.mouseCell = cc; 

		if(k.NumberIsWhite && bd.QnC(cc)!=-1 && (this.inputData==1||(this.inputData==2 && pc.bcolor=="white"))){ return;}
		if(k.RBBlackCell && this.inputData==1){
			if(this.firstPos.x == -1 && this.firstPos.y == -1){ this.firstPos = new Pos(bd.cell[cc].bx, bd.cell[cc].by);}
			if( (((this.firstPos.x>>1)+(this.firstPos.y>>1))&1) != (((bd.cell[cc].bx>>1)+(bd.cell[cc].by>>1))&1) ){ return;}
		}

		(this.inputData==1?bd.setBlack:bd.setWhite).apply(bd,[cc]);
		bd.sQsC(cc, (this.inputData==2?1:0));

		pc.paintCell(cc);
	},
	decIC : function(cc){
		if(pp.getVal('use')==1){
			if(this.btn.Left){ this.inputData=(bd.isWhite(cc) ? 1 : 0); }
			else if(this.btn.Right){ this.inputData=((bd.QsC(cc)!=1) ? 2 : 0); }
		}
		else if(pp.getVal('use')==2){
			if(this.btn.Left){
				if(bd.isBlack(cc)) this.inputData=2;
				else if(bd.QsC(cc) == 1) this.inputData=0;
				else this.inputData=1;
			}
			else if(this.btn.Right){
				if(bd.isBlack(cc)) this.inputData=0;
				else if(bd.QsC(cc) == 1) this.inputData=1;
				else this.inputData=2;
			}
		}
	},
	//---------------------------------------------------------------------------
	// mv.inputqnum()  Cell��qnum(��萔���f�[�^)�ɐ�������͂���B
	// mv.inputqnum1() Cell��qnum(��萔���f�[�^)�ɐ�������͂���B
	// mv.inputqnum3() Cell��qans(��萔���f�[�^)�ɐ�������͂���B
	//---------------------------------------------------------------------------
	inputqnum : function(){
		var cc = this.cellid();
		if(cc===-1 || cc===this.mouseCell){ return;}

		if(cc===tc.getTCC()){
			cc =(k.playmode ?
					(k.NumberWithMB ?
						this.inputqnum3withMB(cc)
					:
						this.inputqnum3(cc)
					)
				:
					this.inputqnum1(cc)
				);
		}
		else{
			var cc0 = tc.getTCC();
			tc.setTCC(cc);

			pc.paintCell(cc0);
		}
		this.mouseCell = cc;

		pc.paintCell(cc);
	},
	inputqnum1 : function(cc){
		if(k.roomNumber){ cc = area.getTopOfRoomByCell(cc);}
		var max = bd.nummaxfunc(cc);

		if(this.btn.Left){
			if(bd.QnC(cc)===max){ bd.sQnC(cc,-1);}
			else if(bd.QnC(cc)===-1){ bd.sQnC(cc,(this.enableInputHatena?-2:(k.dispzero?0:1)));}
			else if(bd.QnC(cc)===-2){ bd.sQnC(cc,(k.dispzero?0:1));}
			else{ bd.sQnC(cc,bd.QnC(cc)+1);}
		}
		else if(this.btn.Right){
			if(bd.QnC(cc)===-1){ bd.sQnC(cc,max);}
			else if(bd.QnC(cc)===-2){ bd.sQnC(cc,-1);}
			else if(bd.QnC(cc)===(k.dispzero?0:1)){ bd.sQnC(cc,(this.enableInputHatena?-2:-1));}
			else{ bd.sQnC(cc,bd.QnC(cc)-1);}
		}
		if(bd.QnC(cc)!=-1 && k.NumberIsWhite){ bd.sQaC(cc,-1); if(pc.bcolor=="white"){ bd.sQsC(cc,0);} }
		if(k.isAnsNumber){ bd.sQaC(cc,-1); bd.sQsC(cc,0);}

		return cc;
	},
	inputqnum3 : function(cc){
		if(bd.QnC(cc)!==bd.defcell.qnum){ return cc;}
		var max = bd.nummaxfunc(cc);
		bd.sDiC(cc,0);

		if(this.btn.Left){
			if     (bd.QaC(cc)===max){ bd.sQaC(cc,-1);              }
			else if(bd.QaC(cc)===-1) { bd.sQaC(cc,(k.dispzero?0:1));}
			else                     { bd.sQaC(cc,bd.QaC(cc)+1);    }
		}
		else if(this.btn.Right){
			if     (bd.QaC(cc)===-1)              { bd.sQaC(cc,max);}
			else if(bd.QaC(cc)===(k.dispzero?0:1)){ bd.sQaC(cc,-1); }
			else                                  { bd.sQaC(cc,bd.QaC(cc)-1);}
		}
		return cc;
	},
	inputqnum3withMB : function(cc){
		if(bd.QnC(cc)!==-1){ return cc;}
		var max = bd.nummaxfunc(cc);

		if(this.btn.Left){
			if     (bd.QaC(cc)===max){ bd.sQaC(cc,-1); bd.sQsC(cc,1);}
			else if(bd.QsC(cc)===1)  { bd.sQaC(cc,-1); bd.sQsC(cc,2);}
			else if(bd.QsC(cc)===2)  { bd.sQaC(cc,-1); bd.sQsC(cc,0);}
			else if(bd.QaC(cc)===-1) { bd.sQaC(cc,(k.dispzero?0:1)); }
			else                     { bd.sQaC(cc,bd.QaC(cc)+1);     }
		}
		else if(this.btn.Right){
			if     (bd.QsC(cc)===1) { bd.sQaC(cc,max); bd.sQsC(cc,0);}
			else if(bd.QsC(cc)===2) { bd.sQaC(cc,-1);  bd.sQsC(cc,1);}
			else if(bd.QaC(cc)===-1){ bd.sQaC(cc,-1);  bd.sQsC(cc,2);}
			else if(bd.QaC(cc)===(k.dispzero?0:1)){ bd.sQaC(cc,-1);  }
			else                    { bd.sQaC(cc,bd.QaC(cc)-1);      }
		}
		return cc;
	},

	//---------------------------------------------------------------------------
	// mv.inputQues() Cell��ques�f�[�^��array�̂Ƃ���ɓ��͂���
	//---------------------------------------------------------------------------
	inputQues : function(array){
		var cc = this.cellid();
		if(cc==-1){ return;}

		var flag=false;
		if(cc!=tc.getTCC() && !this.inputQuesDirectly){
			var cc0 = tc.getTCC();
			tc.setTCC(cc);
			pc.paintCell(cc0);
			flag = true;
		}
		else{
			if(this.btn.Left){
				for(var i=0;i<array.length-1;i++){
					if(!flag && bd.QuC(cc)==array[i]){ bd.sQuC(cc,array[i+1]); flag=true;}
				}
				if(!flag && bd.QuC(cc)==array[array.length-1]){ bd.sQuC(cc,array[0]); flag=true;}
			}
			else if(this.btn.Right){
				for(var i=array.length;i>0;i--){
					if(!flag && bd.QuC(cc)==array[i]){ bd.sQuC(cc,array[i-1]); flag=true;}
				}
				if(!flag && bd.QuC(cc)==array[0]){ bd.sQuC(cc,array[array.length-1]); flag=true;}
			}
		}

		if(flag){ pc.paintCell(cc);}
	},

	//---------------------------------------------------------------------------
	// mv.inputMB()   Cell��qsub(�⏕�L��)�́�, �~�f�[�^����͂���
	//---------------------------------------------------------------------------
	inputMB : function(){
		var cc = this.cellid();
		if(cc==-1){ return;}

		if(this.btn.Left){
			if     (bd.QsC(cc)==0){ bd.sQsC(cc, 1);}
			else if(bd.QsC(cc)==1){ bd.sQsC(cc, 2);}
			else{ bd.sQsC(cc, 0);}
		}
		else if(this.btn.Right){
			if     (bd.QsC(cc)==0){ bd.sQsC(cc, 2);}
			else if(bd.QsC(cc)==2){ bd.sQsC(cc, 1);}
			else{ bd.sQsC(cc, 0);}
		}
		pc.paintCell(cc);
	},

	//---------------------------------------------------------------------------
	// mv.inputdirec() Cell��direc(����)�̃f�[�^����͂���
	//---------------------------------------------------------------------------
	inputdirec : function(){
		var pos = this.borderpos(0);
		if(pos.x==this.mouseCell.x && pos.y==this.mouseCell.y){ return;}

		var inp = 0;
		var cc = bd.cnum(this.mouseCell.x, this.mouseCell.y);
		if(cc!=-1 && bd.QnC(cc)!=-1){
			if     (pos.y-this.mouseCell.y==-2){ inp=k.UP;}
			else if(pos.y-this.mouseCell.y== 2){ inp=k.DN;}
			else if(pos.x-this.mouseCell.x==-2){ inp=k.LT;}
			else if(pos.x-this.mouseCell.x== 2){ inp=k.RT;}
			else{ return;}

			bd.sDiC(cc, (bd.DiC(cc)!=inp?inp:0));

			pc.paintCell(cc);
		}
		this.mouseCell = pos;
	},

	//---------------------------------------------------------------------------
	// mv.inputtile()  ���^�C���A���^�C������͂���
	//---------------------------------------------------------------------------
	inputtile : function(){
		var cc = this.cellid();
		if(cc==-1 || cc==this.mouseCell || bd.QuC(cc)==51){ return;}
		if(this.inputData==-1){ this.decIC(cc);}

		this.mouseCell = cc; 
		var areaid = area.getRoomID(cc);

		for(var i=0;i<area.room[areaid].clist.length;i++){
			var c = area.room[areaid].clist[i];
			if(this.inputData==1 || bd.QsC(c)!=3){
				(this.inputData==1?bd.setBlack:bd.setWhite).apply(bd,[c]);
				bd.sQsC(c, (this.inputData==2?1:0));
			}
		}
		var d = ans.getSizeOfClist(area.room[areaid].clist,f_true);

		pc.paintRange(d.x1, d.y1, d.x2, d.y2);
	},

	//---------------------------------------------------------------------------
	// mv.input51()   [�_]���������������肷��
	// mv.set51cell() [�_]���쐬�E��������Ƃ��̋��ʏ����֐�(�J�b�N���ȊO�̓I�[�o�[���C�h�����)
	//---------------------------------------------------------------------------
	input51 : function(){
		var pos = this.borderpos(0);
		var cc = bd.cnum(pos.x, pos.y);

		if((pos.x==-1 && pos.y>bd.minby && pos.y<bd.maxby) || (pos.y==-1 && pos.x>bd.minbx && pos.x<bd.maxbx)){
			var tcp=tc.getTCP();
			tc.setTCP(new Pos(pos.x,pos.y));
			pc.paintPos(tcp);
			pc.paintPos(pos);
			return;
		}
		else if(cc!=-1 && cc!=tc.getTCC()){
			var tcp=tc.getTCP();
			tc.setTCC(cc);
			pc.paintPos(tcp);
		}
		else if(cc!=-1){
			if(this.btn.Left){
				if(bd.QuC(cc)!=51){ this.set51cell(cc,true);}
				else{ kc.chtarget('shift');}
			}
			else if(this.btn.Right){ this.set51cell(cc,false);}
		}
		else{ return;}

		pc.paintCell(cc);
	},
	// ���Ƃ肠�����J�b�N���p
	set51cell : function(cc,val){
		if(val==true){
			bd.sQuC(cc,51);
			bd.sQnC(cc,0);
			bd.sDiC(cc,0);
			bd.sQaC(cc,-1);
		}
		else{
			bd.sQuC(cc,0);
			bd.sQnC(cc,0);
			bd.sDiC(cc,0);
			bd.sQaC(cc,-1);
		}
	},

	//---------------------------------------------------------------------------
	// mv.inputcross()     Cross��ques(���f�[�^)��0�`4����͂���B
	// mv.inputcrossMark() Cross�̍��_����͂���B
	//---------------------------------------------------------------------------
	inputcross : function(){
		var cc = this.crossid();
		if(cc==-1 || cc==this.mouseCell){ return;}

		if(cc==tc.getTXC()){
			if(this.btn.Left){
				if(bd.QnX(cc)==4){ bd.sQnX(cc,-2);}
				else{ bd.sQnX(cc,bd.QnX(cc)+1);}
			}
			else if(this.btn.Right){
				if(bd.QnX(cc)==-2){ bd.sQnX(cc,4);}
				else{ bd.sQnX(cc,bd.QnX(cc)-1);}
			}
		}
		else{
			var cc0 = tc.getTXC();
			tc.setTXC(cc);
			pc.paintCross(cc0);
		}
		this.mouseCell = cc;

		pc.paintCross(cc);
	},
	inputcrossMark : function(){
		var pos = this.borderpos(0.24);
		if((pos.x&1) || (pos.y&1)){ return;}
		var bm = (k.iscross===2?0:2);
		if(pos.x<bd.minbx+bm || pos.x>bd.maxbx-bm || pos.y<bd.minby+bm || pos.y>bd.maxby-bm){ return;}

		var cc = bd.xnum(pos.x,pos.y);

		um.disCombine = 1;
		bd.sQnX(cc,(bd.QnX(cc)==1)?-1:1);
		um.disCombine = 0;

		pc.paintCross(cc);
	},
	//---------------------------------------------------------------------------
	// mv.inputborder()    �Ֆʋ��E���̖��f�[�^����͂���
	// mv.inputborderans() �Ֆʋ��E���̉񓚃f�[�^����͂���
	// mv.inputBD()        ��L��̋��ʏ����֐�
	//---------------------------------------------------------------------------
	inputborder : function(){ this.inputBD(0);},
	inputborderans : function(){ this.inputBD(1);},
	inputBD : function(flag){
		var pos = this.borderpos(0.35);
		if(pos.x==this.mouseCell.x && pos.y==this.mouseCell.y){ return;}

		var id = bd.bnum(pos.x, pos.y);
		if(id==-1 && this.mouseCell.x){ id = bd.bnum(this.mouseCell.x, this.mouseCell.y);}

		if(this.mouseCell!=-1 && id!=-1){
			if((pos.x%2==0 && this.mouseCell.x==pos.x && Math.abs(this.mouseCell.y-pos.y)==1) ||
			   (pos.y%2==0 && this.mouseCell.y==pos.y && Math.abs(this.mouseCell.x-pos.x)==1) )
			{
				this.mouseCell=-1;
				if(this.inputData==-1){ this.inputData=(bd.isBorder(id)?0:1);}

				if(!(k.playmode && bd.QuB(id)!==0)){
					if     (this.inputData==1){ bd.setBorder(id); if(k.isborderAsLine){ bd.sQsB(id, 0);} }
					else if(this.inputData==0){ bd.removeBorder(id);}

					pc.paintBorder(id);
				}
			}
		}
		this.mouseCell = pos;
	},

	//---------------------------------------------------------------------------
	// mv.inputLine()     �Ֆʂ̐�����͂���
	// mv.inputQsubLine() �Ֆʂ̋��E���p�⏕�L������͂���
	// mv.inputLine1()    ��L��̋��ʏ����֐�
	// mv.inputLine2()    �Ֆʂ̐�����͗p�����֐�
	// mv.inputqsub2()    ���E���p�⏕�L���̓��͗p�����֐�
	//---------------------------------------------------------------------------
	inputLine : function(){ this.inputLine1(0);},
	inputQsubLine : function(){ this.inputLine1(1);},
	inputLine1 : function(flag){
		var pos = this.borderpos(0);
		if(pos.x==this.mouseCell.x && pos.y==this.mouseCell.y){ return;}

		var id = -1;
		if     (pos.y-this.mouseCell.y==-2){ id=bd.bnum(this.mouseCell.x  ,this.mouseCell.y-1);}
		else if(pos.y-this.mouseCell.y== 2){ id=bd.bnum(this.mouseCell.x  ,this.mouseCell.y+1);}
		else if(pos.x-this.mouseCell.x==-2){ id=bd.bnum(this.mouseCell.x-1,this.mouseCell.y  );}
		else if(pos.x-this.mouseCell.x== 2){ id=bd.bnum(this.mouseCell.x+1,this.mouseCell.y  );}

		this.mouseCell = pos;
		if(this.inputData==2 || this.inputData==3){ this.inputpeke2(id);}
		else if(this.mouseCell!=-1 && id!=-1){
			if     (flag==0) this.inputLine2(id);
			else if(flag==1) this.inputqsub2(id);
		}
	},
	inputLine2 : function(id){
		if(this.inputData==-1){ this.inputData=(bd.isLine(id)?0:1);}
		if     (this.inputData==1){ bd.setLine(id);}
		else if(this.inputData==0){ bd.removeLine(id);}
		pc.paintLine(id);
	},
	inputqsub2 : function(id){
		if(this.inputData==-1){ this.inputData=(bd.QsB(id)==0?1:0);}
		if     (this.inputData==1){ bd.sQsB(id, 1);}
		else if(this.inputData==0){ bd.sQsB(id, 0);}
		pc.paintLine(id);
	},

	//---------------------------------------------------------------------------
	// mv.inputpeke()   �Ֆʂ̐����ʂ�Ȃ����Ƃ������~����͂���
	// mv.inputpeke2()  �Ֆʂ̐����ʂ�Ȃ����Ƃ������~����͂���(inputLine1������Ă΂��)
	//---------------------------------------------------------------------------
	inputpeke : function(){
		var pos = this.borderpos(0.22);
		var id = bd.bnum(pos.x, pos.y);
		if(id==-1 || (pos.x==this.mouseCell.x && pos.y==this.mouseCell.y)){ return;}

		this.mouseCell = pos;
		this.inputpeke2(id);
	},
	inputpeke2 : function(id){
		if(this.inputData==-1){ if(bd.QsB(id)==0){ this.inputData=2;}else{ this.inputData=3;} }
		if     (this.inputData==2){ bd.setPeke(id);}
		else if(this.inputData==3){ bd.removeLine(id);}
		pc.paintLine(id);
	},

	//---------------------------------------------------------------------------
	// mv.dispRed() �ЂƂȂ���̍��}�X��Ԃ��\������
	// mv.db0()     �ȂȂ߂Ȃ���̍��}�X��Ԃ��\������(�ċN�Ăяo���p�֐�)
	// mv.dispRedLine()  �ЂƂȂ���̐���Ԃ��\������
	//---------------------------------------------------------------------------
	dispRed : function(){
		var cc = this.cellid();
		this.mousereset();
		if(!bd.isBlack(cc) || cc==this.mouseCell){ return;}
		if(!k.RBBlackCell){ bd.sErC(area.bcell[area.bcell.id[cc]].clist,1);}
		else{ this.db0(function(c){ return (bd.isBlack(c) && bd.ErC(c)==0);},cc,1);}
		ans.errDisp = true;
		pc.paintAll();
	},
	db0 : function(func, cc, num){
		if(bd.ErC(cc)!=0){ return;}
		bd.sErC([cc],num);
		var bx=bd.cell[cc].bx, by=bd.cell[cc].by;
		if( func(bd.cnum(bx-2,by-2)) ){ this.db0(func, bd.cnum(bx-2,by-2), num);}
		if( func(bd.cnum(bx  ,by-2)) ){ this.db0(func, bd.cnum(bx  ,by-2), num);}
		if( func(bd.cnum(bx+2,by-2)) ){ this.db0(func, bd.cnum(bx+2,by-2), num);}
		if( func(bd.cnum(bx-2,by  )) ){ this.db0(func, bd.cnum(bx-2,by  ), num);}
		if( func(bd.cnum(bx+2,by  )) ){ this.db0(func, bd.cnum(bx+2,by  ), num);}
		if( func(bd.cnum(bx-2,by+2)) ){ this.db0(func, bd.cnum(bx-2,by+2), num);}
		if( func(bd.cnum(bx  ,by+2)) ){ this.db0(func, bd.cnum(bx  ,by+2), num);}
		if( func(bd.cnum(bx+2,by+2)) ){ this.db0(func, bd.cnum(bx+2,by+2), num);}
		return;
	},

	dispRedLine : function(){
		var id = this.borderid(0.15);
		this.mousereset();
		if(id!=-1 && id==this.mouseCell){ return;}

		if(!bd.isLine(id)){
			var cc = (!k.isborderAsLine?this.cellid():this.crossid());
			if(cc==-1 || (line.iscrossing(cc) && (line.lcntCell(cc)==3 || line.lcntCell(cc)==4))){ return;}

			var bx, by;
			if(k.isbordeAsLine==0){ bx = (cc%k.qcols)*2, by = mf(cc/k.qcols)*2;}
			else{ bx = (cc%(k.qcols+1))*2, by = mf(cc/(k.qcols+1))*2;}
			id = (function(bx,by){
				if     (bd.isLine(bd.bnum(bx-1,by))){ return bd.bnum(bx-1,by);}
				else if(bd.isLine(bd.bnum(bx+1,by))){ return bd.bnum(bx+1,by);}
				else if(bd.isLine(bd.bnum(bx,by-1))){ return bd.bnum(bx,by-1);}
				else if(bd.isLine(bd.bnum(bx,by+1))){ return bd.bnum(bx,by+1);}
				return -1;
			})(bx,by);
		}
		if(id==-1){ return;}

		bd.sErBAll(2); bd.sErB(line.data[line.data.id[id]].idlist,1);
		ans.errDisp = true;
		pc.paintAll();
	}
};

//---------------------------------------------------------------------------
// ��KeyEvent�N���X �L�[�{�[�h���͂Ɋւ�����̕ێ��ƃC�x���g����������
//---------------------------------------------------------------------------
// �p�Y������ �L�[�{�[�h���͕�
// KeyEvent�N���X���`
KeyEvent = function(){
	this.enableKey = true;	// �L�[���͂͗L����

	this.isCTRL;
	this.isALT;	// ALT�̓��j���[�p�Ȃ̂ŋɗ͎g��Ȃ�
	this.isSHIFT;
	this.inUNDO;
	this.inREDO;
	this.tcMoved;	// �J�[�\���ړ����ɃX�N���[�������Ȃ�
	this.keyPressed;
	this.ca;
	this.prev;

	this.keyreset();
};
KeyEvent.prototype = {
	//---------------------------------------------------------------------------
	// kc.keyreset() �L�[�{�[�h���͂Ɋւ����������������
	//---------------------------------------------------------------------------
	keyreset : function(){
		this.isCTRL  = false;
		this.isALT   = false;
		this.isSHIFT = false;
		this.inUNDO  = false;
		this.inREDO  = false;
		this.tcMoved = false;
		this.keyPressed = false;
		this.prev = -1;
		this.ca = '';
		if(this.isZ){ this.isZ = false;}
		if(this.isX){ this.isX = false;}
	},

	//---------------------------------------------------------------------------
	// kc.e_keydown()  �L�[���������ۂ̃C�x���g���ʏ���
	// kc.e_keyup()    �L�[�𗣂����ۂ̃C�x���g���ʏ���
	// kc.e_keypress() �L�[���͂����ۂ̃C�x���g���ʏ���(-�L�[�p)
	//---------------------------------------------------------------------------
	// ����3�̃L�[�C�x���g��window����Ăяo�����(kc��bind���Ă���)
	// 48�`57��0�`9�L�[�A65�`90��a�`z�A96�`105�̓e���L�[�A112�`123��F1�`F12�L�[
	e_keydown : function(e){
		if(this.enableKey){
			um.newOperation(true);
			this.ca = this.getchar(e, this.getKeyCode(e));
			this.tcMoved = false;
			if(!this.isZ){ bd.errclear();}

			if(!this.keydown_common(e)){
				if(this.ca){ this.keyinput(this.ca);}	// �e�p�Y���̃��[�`����
				this.keyPressed = true;
			}

			if(this.tcMoved){
				ee.preventDefault(e);
				return false;
			}
		}
	},
	e_keyup : function(e){
		if(this.enableKey){
			um.newOperation(false);
			this.ca = this.getchar(e, this.getKeyCode(e));
			this.keyPressed = false;

			if(!this.keyup_common(e)){
				if(this.ca){ this.keyup(this.ca);}	// �e�p�Y���̃��[�`����
			}
		}
	},
	//(keypress�̂�)45��-(�}�C�i�X)
	e_keypress : function(e){
		if(this.enableKey){
			um.newOperation(false);
			this.ca = this.getcharp(e, this.getKeyCode(e));

			if(this.ca){ this.keyinput(this.ca);}	// �e�p�Y���̃��[�`����
		}
	},

	//---------------------------------------------------------------------------
	// kc.keyinput() �L�[���������ۂ̃C�x���g�����B�e�p�Y���̃t�@�C���ŃI�[�o�[���C�h�����B
	// kc.keyup()    �L�[�𗣂����ۂ̃C�x���g�����B�e�p�Y���̃t�@�C���ŃI�[�o�[���C�h�����B
	//---------------------------------------------------------------------------
	// �I�[�o�[���C�h�p
	keyinput : function(ca){ },
	keyup    : function(ca){ },

	//---------------------------------------------------------------------------
	// kc.getchar()    ���͂��ꂽ�L�[��\���������Ԃ�
	// kc.getcharp()   ���͂��ꂽ�L�[��\���������Ԃ�(keypress�̎�)
	// kc.getKeyCode() ���͂��ꂽ�L�[�̃R�[�h�𐔎��ŕԂ�
	//---------------------------------------------------------------------------
	getchar : function(e, keycode){
		if     (e.keyCode == 38)            { return k.KEYUP;}
		else if(e.keyCode == 40)            { return k.KEYDN;}
		else if(e.keyCode == 37)            { return k.KEYLT;}
		else if(e.keyCode == 39)            { return k.KEYRT;}
		else if(48<=keycode && keycode<=57) { return (keycode - 48).toString(36);}
		else if(65<=keycode && keycode<=90) { return (keycode - 55).toString(36);} //�A���t�@�x�b�g
		else if(96<=keycode && keycode<=105){ return (keycode - 96).toString(36);} //�e���L�[�Ή�
		else if(112<=keycode && keycode<=123){return 'F'+(keycode - 111).toString(10);}
		else if(keycode==32 || keycode==46) { return ' ';} // 32�̓X�y�[�X�L�[ 46��del�L�[
		else if(keycode==8)                 { return 'BS';}
		else if(e.shiftKey)                 { return 'shift';}
		else{ return '';}
	},
	getcharp : function(e, keycode){
		if(keycode==45){ return '-';}
		else{ return '';}
	},
	getKeyCode : function(e){
		return !!e.keyCode ? e.keyCode: e.charCode;
	},

	//---------------------------------------------------------------------------
	// kc.keydown_common() �L�[���������ۂ̃C�x���g���ʏ���(Shift,Undo,F2��)
	// kc.keyup_common()   �L�[�𗣂����ۂ̃C�x���g���ʏ���(Shift,Undo��)
	//---------------------------------------------------------------------------
	keydown_common : function(e){
		var flag = false;
		if(!this.isSHIFT && e.shiftKey){ this.isSHIFT=true; }
		if(!this.isCTRL  && e.ctrlKey ){ this.isCTRL=true;  flag = true; }
		if(!this.isALT   && e.altKey  ){ this.isALT=true;   flag = true; }

		if(this.isCTRL && this.ca=='z'){ this.inUNDO=true; flag = true; tm.startUndoTimer();}
		if(this.isCTRL && this.ca=='y'){ this.inREDO=true; flag = true; tm.startUndoTimer();}

		if(this.ca=='F2' && k.EDITOR){ // 112�`123��F1�`F12�L�[
			if     (k.editmode && !this.isSHIFT){ pp.setVal('mode',3); flag = true;}
			else if(k.playmode &&  this.isSHIFT){ pp.setVal('mode',1); flag = true;}
		}
		flag = (flag || debug.keydown(this.ca));

		return flag;
	},
	keyup_common : function(e){
		var flag = false;
		if(this.isSHIFT && !e.shiftKey){ this.isSHIFT=false; flag = true; }
		if((this.isCTRL || this.inUNDO || this.inREDO)  && !e.ctrlKey ){ this.isCTRL=false;  flag = true; this.inUNDO = false; this.inREDO = false; }
		if(this.isALT   && !e.altKey  ){ this.isALT=false;   flag = true; }

		if(this.inUNDO && this.ca=='z'){ this.inUNDO=false; flag = true; }
		if(this.inREDO && this.ca=='y'){ this.inREDO=false; flag = true; }

		return flag;
	},
	//---------------------------------------------------------------------------
	// kc.moveTCell()   Cell�̃L�[�{�[�h����̓��͑Ώۂ���L�[�œ�����
	// kc.moveTCross()  Cross�̃L�[�{�[�h����̓��͑Ώۂ���L�[�œ�����
	// kc.moveTBorder() Border�̃L�[�{�[�h����̓��͑Ώۂ���L�[�œ�����
	// kc.moveTC()      ��L3�̊֐��̋��ʏ���
	//---------------------------------------------------------------------------
	moveTCell   : function(ca){ return this.moveTC(ca,2);},
	moveTCross  : function(ca){ return this.moveTC(ca,2);},
	moveTBorder : function(ca){ return this.moveTC(ca,1);},
	moveTC : function(ca,mv){
		var tcp = tc.getTCP(), flag = false;
		if     (ca == k.KEYUP && tcp.y-mv >= tc.miny){ tc.decTCY(mv); flag = true;}
		else if(ca == k.KEYDN && tcp.y+mv <= tc.maxy){ tc.incTCY(mv); flag = true;}
		else if(ca == k.KEYLT && tcp.x-mv >= tc.minx){ tc.decTCX(mv); flag = true;}
		else if(ca == k.KEYRT && tcp.x+mv <= tc.maxx){ tc.incTCX(mv); flag = true;}

		if(flag){
			pc.paintPos(tcp);
			pc.paintPos(tc.getTCP());
			this.tcMoved = true;
		}
		return flag;
	},

	//---------------------------------------------------------------------------
	// kc.key_inputcross() ���max�܂ł̐�����Cross�̖��f�[�^�����ē��͂���(keydown��)
	//---------------------------------------------------------------------------
	key_inputcross : function(ca){
		var cc = tc.getTXC();
		var max = bd.nummaxfunc(cc);

		if('0'<=ca && ca<='9'){
			var num = parseInt(ca);

			if(bd.QnX(cc)<=0){
				if(num<=max){ bd.sQnX(cc,num);}
			}
			else{
				if(bd.QnX(cc)*10+num<=max){ bd.sQnX(cc,bd.QnX(cc)*10+num);}
				else if(num<=max){ bd.sQnX(cc,num);}
			}
		}
		else if(ca=='-'){
			if(bd.QnX(cc)!=-2){ bd.sQnX(cc,-2);}
			else{ bd.sQnX(cc,-1);}
		}
		else if(ca==' '){
			bd.sQnX(cc,-1);
		}
		else{ return;}

		pc.paintCross(cc);
	},
	//---------------------------------------------------------------------------
	// kc.key_inputqnum() ���max�܂ł̐�����Cell�̖��f�[�^�����ē��͂���(keydown��)
	//---------------------------------------------------------------------------
	key_inputqnum : function(ca){
		var cc = tc.getTCC();
		if(k.editmode && k.roomNumber){ cc = area.getTopOfRoomByCell(cc);}
		var max = bd.nummaxfunc(cc);

		if('0'<=ca && ca<='9'){
			var num = parseInt(ca);
			if(k.playmode && k.puzzleid!=='snakes'){ bd.sDiC(cc,0);}

			if(bd.getNum(cc)<=0 || this.prev!=cc){
				if(num<=max){ bd.setNum(cc,num);}
			}
			else{
				if(bd.getNum(cc)*10+num<=max){ bd.setNum(cc,bd.getNum(cc)*10+num);}
				else if(num<=max){ bd.setNum(cc,num);}
			}
			if(bd.QnC(cc)!=-1 && k.NumberIsWhite){ bd.sQaC(cc,-1); if(pc.bcolor=="white"){ bd.sQsC(cc,0);} }
			if(k.isAnsNumber){ if(k.editmode){ bd.sQaC(cc,-1);} bd.sQsC(cc,0); }
		}
		else if(ca=='-'){
			if(k.editmode && bd.QnC(cc)!=-2){ bd.setNum(cc,-2);}
			else{ bd.setNum(cc,-1);}
			if(bd.QnC(cc)!=-1 && k.NumberIsWhite){ bd.sQaC(cc,-1); if(pc.bcolor=="white"){ bd.sQsC(cc,0);} }
			if(k.isAnsNumber){ bd.sQsC(cc,0);}
		}
		else if(ca==' '){
			bd.setNum(cc,-1);
			if(bd.QnC(cc)!=-1 && k.NumberIsWhite){ bd.sQaC(cc,-1); if(pc.bcolor=="white"){ bd.sQsC(cc,0);} }
			if(k.isAnsNumber){ bd.sQsC(cc,0);}
		}
		else{ return;}

		this.prev = cc;
		pc.paintCell(cc);
	},

	//---------------------------------------------------------------------------
	// kc.key_inputdirec()  �l�����̖��Ȃǂ�ݒ肷��
	//---------------------------------------------------------------------------
	key_inputdirec : function(ca){
		if(!this.isSHIFT){ return false;}

		var cc = tc.getTCC();
		if(bd.QnC(cc)==-1){ return false;}

		var flag = false;

		if     (ca == k.KEYUP){ bd.sDiC(cc, (bd.DiC(cc)!=k.UP?k.UP:0)); flag = true;}
		else if(ca == k.KEYDN){ bd.sDiC(cc, (bd.DiC(cc)!=k.DN?k.DN:0)); flag = true;}
		else if(ca == k.KEYLT){ bd.sDiC(cc, (bd.DiC(cc)!=k.LT?k.LT:0)); flag = true;}
		else if(ca == k.KEYRT){ bd.sDiC(cc, (bd.DiC(cc)!=k.RT?k.RT:0)); flag = true;}

		if(flag){
			pc.paintPos(tc.getTCP());
			this.tcMoved = true;
		}
		return flag;
	},

	//---------------------------------------------------------------------------
	// kc.inputnumber51()  [�_]�̐���������͂���
	// kc.setnum51()      ���[�h�ʂɐ�����ݒ肷��
	// kc.getnum51()      ���[�h�ʂɐ������擾����
	//---------------------------------------------------------------------------
	inputnumber51 : function(ca,max_obj){
		if(this.chtarget(ca)){ return;}

		var cc = tc.getTCC(), ex = -1;
		if(cc==-1){ ex = tc.getTEC();}
		var target = this.detectTarget(cc,ex);
		if(target==-1 || (cc!=-1 && bd.QuC(cc)==51)){
			if(ca=='q' && cc!=-1){
				mv.set51cell(cc,(bd.QuC(cc)!=51));
				pc.paintPos(tc.getTCP());
				return;
			}
		}
		if(target==-1){ return;}

		var max = max_obj[target];

		if('0'<=ca && ca<='9'){
			var num = parseInt(ca);

			if(this.getnum51(cc,ex,target)<=0 || this.prev!=cc){
				if(num<=max){ this.setnum51(cc,ex,target,num);}
			}
			else{
				if(this.getnum51(cc,ex,target)*10+num<=max){ this.setnum51(cc,ex,target,this.getnum51(cc,ex,target)*10+num);}
				else if(num<=max){ this.setnum51(cc,ex,target,num);}
			}
		}
		else if(ca=='-' || ca==' '){ this.setnum51(cc,ex,target,-1);}
		else{ return;}

		this.prev = cc;
		if(cc!=-1){ pc.paintCell(tc.getTCC());}
		else      { pc.paintPos (tc.getTCP());}
	},
	setnum51 : function(cc,ex,target,val){
		if(cc!=-1){ (target==2 ? bd.sQnC(cc,val) : bd.sDiC(cc,val));}
		else      { (target==2 ? bd.sQnE(ex,val) : bd.sDiE(ex,val));}
	},
	getnum51 : function(cc,ex,target){
		if(cc!=-1){ return (target==2 ? bd.QnC(cc) : bd.DiC(cc));}
		else      { return (target==2 ? bd.QnE(ex) : bd.DiE(ex));}
	},

	//---------------------------------------------------------------------------
	// kc.chtarget()     SHIFT������������[�_]�̓��͂���Ƃ����I������
	// kc.detectTarget() [�_]�̉E�E���ǂ���ɐ�������͂��邩���f����
	//---------------------------------------------------------------------------
	chtarget : function(ca){
		if(ca!='shift'){ return false;}
		if(tc.targetdir==2){ tc.targetdir=4;}
		else{ tc.targetdir=2;}
		pc.paintCell(tc.getTCC());
		return true;
	},
	detectTarget : function(cc,ex){
		if((cc==-1 && ex==-1) || (cc!=-1 && bd.QuC(cc)!=51)){ return -1;}
		if(cc==bd.cellmax-1 || ex==k.qcols+k.qrows){ return -1;}
		if(cc!=-1){
			if	  ((bd.rt(cc)==-1 || bd.QuC(bd.rt(cc))==51) &&
				   (bd.dn(cc)==-1 || bd.QuC(bd.dn(cc))==51)){ return -1;}
			else if(bd.rt(cc)==-1 || bd.QuC(bd.rt(cc))==51){ return 4;}
			else if(bd.dn(cc)==-1 || bd.QuC(bd.dn(cc))==51){ return 2;}
		}
		else if(ex!=-1){
			if	  ((bd.excell[ex].by===-1 && bd.QuC(bd.cnum(bd.excell[ex].bx,1))===51) ||
				   (bd.excell[ex].bx===-1 && bd.QuC(bd.cnum(1,bd.excell[ex].by))===51)){ return -1;}
			else if(bd.excell[ex].by===-1){ return 4;}
			else if(bd.excell[ex].bx===-1){ return 2;}
		}

		return tc.targetdir;
	}
};

//---------------------------------------------------------------------------
// ��KeyPopup�N���X �}�E�X����L�[�{�[�h���͂���ۂ�Popup�E�B���h�E���Ǘ�����
//---------------------------------------------------------------------------
// �L�[���͗pPopup�E�B���h�E
// KeyPopup�N���X
KeyPopup = function(){
	this.ctl = { 1:{ el:null, enable:false, target:k.CELL},		// �����͎��ppopup
				 3:{ el:null, enable:false, target:k.CELL} };	// �񓚓��͎��ppopup
	this.tdcolor = "black";
	this.imgCR = [1,1];		// img�\���p�摜�̉��~�c�̃T�C�Y

	this.tds  = [];			// resize�p
	this.imgs = [];			// resize�p

	this.defaultdisp = false;

	this.tbodytmp=null, this.trtmp=null;

	this.ORIGINAL = 99;

	// ElementTemplate
	this.EL_KPNUM   = ee.addTemplate('','td', {unselectable:'on', className:'kpnum'}, null, null);
	this.EL_KPEMPTY = ee.addTemplate('','td', {unselectable:'on'}, null, null);
	this.EL_KPIMG   = ee.addTemplate('','td', {unselectable:'on', className:'kpimgcell'}, null, null);
	this.EL_KPIMG_DIV = ee.addTemplate('','div', {unselectable:'on', className:'kpimgdiv'}, null, null);
	this.EL_KPIMG_IMG = ee.addTemplate('','img', {unselectable:'on', className:'kpimg', src:"./src/img/"+k.puzzleid+"_kp.gif"}, null, null);
};
KeyPopup.prototype = {
	//---------------------------------------------------------------------------
	// kp.kpinput()  �L�[�|�b�v�A�b�v������͂��ꂽ���̏������I�[�o�[���C�h�ŋL�q����
	// kp.enabled()  �L�[�|�b�v�A�b�v���̂��L�����ǂ�����Ԃ�
	//---------------------------------------------------------------------------
	// �I�[�o�[���C�h�p
	kpinput : function(ca){ },
	enabled : function(){ return pp.getVal('keypopup');},

	//---------------------------------------------------------------------------
	// kp.generate()   �L�[�|�b�v�A�b�v�𐶐����ď���������
	// kp.gentable()   �L�[�|�b�v�A�b�v�̃e�[�u�����쐬����
	// kp.gentable10() �L�[�|�b�v�A�b�v��0�`9����͂ł���e�[�u�����쐬����
	// kp.gentable4()  �L�[�|�b�v�A�b�v��0�`4����͂ł���e�[�u�����쐬����
	//---------------------------------------------------------------------------
	generate : function(type, enablemake, enableplay, func){
		if(enablemake && k.EDITOR){ this.gentable(1, type, func);}
		if(enableplay)            { this.gentable(3, type, func);}
	},

	gentable : function(mode, type, func){
		this.ctl[mode].enable = true;
		this.ctl[mode].el     = ee('keypopup'+mode).el;
		this.ctl[mode].el.onmouseout = ee.ebinder(this, this.hide);

		var table = _doc.createElement('table');
		table.cellSpacing = '2pt';
		this.ctl[mode].el.appendChild(table);

		this.tbodytmp = _doc.createElement('tbody');
		table.appendChild(this.tbodytmp);

		this.trtmp = null;
		if(func)							  { func.apply(kp, [mode]);}
		else if(type==0 || type==3)			  { this.gentable10(mode,type);}
		else if(type==1 || type==2 || type==4){ this.gentable4 (mode,type);}
	},

	gentable10 : function(mode, type){
		this.inputcol('num','knum0','0','0');
		this.inputcol('num','knum1','1','1');
		this.inputcol('num','knum2','2','2');
		this.inputcol('num','knum3','3','3');
		this.insertrow();
		this.inputcol('num','knum4','4','4');
		this.inputcol('num','knum5','5','5');
		this.inputcol('num','knum6','6','6');
		this.inputcol('num','knum7','7','7');
		this.insertrow();
		this.inputcol('num','knum8','8','8');
		this.inputcol('num','knum9','9','9');
		this.inputcol('num','knum_',' ',' ');
		if     (type==0){ (mode==1)?this.inputcol('num','knum.','-','?'):this.inputcol('empty','knum.','','');}
		else if(type==3){ this.inputcol('num','knum.','-','��');}
		this.insertrow();
	},
	gentable4 : function(mode, type, tbody){
		this.inputcol('num','knum0','0','0');
		this.inputcol('num','knum1','1','1');
		this.inputcol('num','knum2','2','2');
		this.inputcol('num','knum3','3','3');
		this.insertrow();
		this.inputcol('num','knum4','4','4');
		this.inputcol('empty','knumx','','');
		this.inputcol('num','knum_',' ',' ');
		if     (type==1){ (mode==1)?this.inputcol('num','knum.','-','?'):this.inputcol('empty','knum.','','');}
		else if(type==2){ this.inputcol('num','knum.', '-', '��');}
		else if(type==4){ this.inputcol('num','knum.', '-', '��');}
		this.insertrow();
	},

	//---------------------------------------------------------------------------
	// kp.inputcol()  �e�[�u���̃Z����ǉ�����
	// kp.insertrow() �e�[�u���̍s��ǉ�����
	//---------------------------------------------------------------------------
	inputcol : function(type, id, ca, disp){
		if(!this.trtmp){ this.trtmp = _doc.createElement('tr');}
		var _td = null;
		if(type==='num'){
			_td = ee.createEL(this.EL_KPNUM, id);
			_td.style.color = this.tdcolor;
			_td.innerHTML   = disp;
			_td.onclick     = ee.ebinder(this, this.inputnumber, [ca]);
		}
		else if(type==='empty'){
			_td = ee.createEL(this.EL_KPEMPTY, '');
		}
		else if(type==='image'){
			var _img = ee.createEL(this.EL_KPIMG_IMG, ""+id+"_i");
			var _div = ee.createEL(this.EL_KPIMG_DIV, '');
			_div.appendChild(_img);

			_td = ee.createEL(this.EL_KPIMG, id);
			_td.onclick   = ee.ebinder(this, this.inputnumber, [ca]);
			_td.appendChild(_div);

			this.imgs.push({'el':_img, 'x':disp[0], 'y':disp[1]});
		}

		if(_td){
			this.tds.push(_td);
			this.trtmp.appendChild(_td);
		}
	},
	insertrow : function(){
		if(this.trtmp){
			this.tbodytmp.appendChild(this.trtmp);
			this.trtmp = null;
		}
	},

	//---------------------------------------------------------------------------
	// kp.display()     �L�[�|�b�v�A�b�v��\������
	// kp.inputnumber() kpinput�֐����Ăяo���ăL�[�|�b�v�A�b�v���B��
	// kp.hide()        �L�[�|�b�v�A�b�v���B��
	//---------------------------------------------------------------------------
	display : function(){
		var mode = pp.getVal('mode');
		if(this.ctl[mode].el && this.ctl[mode].enable && pp.getVal('keypopup') && mv.btn.Left){
			this.ctl[mode].el.style.left   = k.cv_oft.x + mv.inputPos.x - 3 + 'px';
			this.ctl[mode].el.style.top    = k.cv_oft.y + mv.inputPos.y - 3 + 'px';
			this.ctl[mode].el.style.zIndex = 100;

			if(this.ctl[mode].target==k.CELL){
				var cc0 = tc.getTCC();
				var cc = mv.cellid();
				if(cc==-1){ return;}
				tc.setTCC(cc);
				pc.paintCell(cc);
				pc.paintCell(cc0);
			}
			else if(this.ctl[mode].target==k.CROSS){
				var cc0 = tc.getTXC();
				var cc = mv.crossid();
				if(cc==-1){ return;}
				tc.setTXC(cc);
				pc.paintCross(cc);
				pc.paintCross(cc0);
			}

			this.ctl[mode].el.style.display = 'block';
		}
	},
	inputnumber : function(e, ca){
		this.kpinput(ca);
		this.ctl[pp.getVal('mode')].el.style.display = 'none';
	},
	hide : function(e){
		var mode = pp.getVal('mode');
		if(!!this.ctl[mode].el && !menu.insideOf(this.ctl[mode].el, e)){
			this.ctl[mode].el.style.display = 'none';
		}
	},

	//---------------------------------------------------------------------------
	// kp.resize() �L�[�|�b�v�A�b�v�̃Z���̃T�C�Y��ύX����
	//---------------------------------------------------------------------------
	resize : function(){
		var tfunc = function(el,tsize){
			el.style.width    = ""+mf(tsize*0.90)+"px"
			el.style.height   = ""+mf(tsize*0.90)+"px"
			el.style.fontSize = ""+mf(tsize*0.70)+"px";
		};
		var ifunc = function(obj,bsize){
			obj.el.style.width  = ""+(bsize*kp.imgCR[0])+"px";
			obj.el.style.height = ""+(bsize*kp.imgCR[1])+"px";
			obj.el.style.clip   = "rect("+(bsize*obj.y+1)+"px,"+(bsize*(obj.x+1))+"px,"+(bsize*(obj.y+1))+"px,"+(bsize*obj.x+1)+"px)";
			obj.el.style.top    = "-"+(obj.y*bsize+1)+"px";
			obj.el.style.left   = "-"+(obj.x*bsize+1)+"px";
		};

		if(k.cellsize>=24){
			for(var i=0,len=this.tds.length ;i<len;i++){ tfunc(this.tds[i],  k.cellsize);}
			for(var i=0,len=this.imgs.length;i<len;i++){ ifunc(this.imgs[i], mf(k.cellsize*0.90));}
		}
		else{
			for(var i=0,len=this.tds.length ;i<len;i++){ tfunc(this.tds[i],  22);}
			for(var i=0,len=this.imgs.length;i<len;i++){ ifunc(this.imgs[i], 18);}
		}
	}
};

//---------------------------------------------------------------------------
// ��TCell�N���X �L�[���͂̃^�[�Q�b�g��ێ�����
//---------------------------------------------------------------------------

TCell = function(){
	// ���ݓ��̓^�[�Q�b�g�ɂȂ��Ă���ꏊ(border���W�n)
	this.cursorx = 1;
	this.cursory = 1;

	// �L���Ȕ͈�(minx,miny)-(maxx,maxy)
	this.minx = 1;
	this.miny = 1;
	this.maxx = 2*k.qcols-1;
	this.maxy = 2*k.qrows-1;

	this.crosstype = false;
};
TCell.prototype = {
	//---------------------------------------------------------------------------
	// tc.adjust()   �͈͂ƃ^�[�Q�b�g�̈ʒu�𒲐߂���
	// tc.setAlign() ���[�h�ύX���Ɉʒu�����������ꍇ�ɒ��߂���(�I�[�o�[���C�h�p)
	// tc.setCrossType() ��_���͗p�Ƀv���p�e�B���Z�b�g����
	//---------------------------------------------------------------------------
	adjust : function(){
		if(this.crosstype){
			this.minx = 0;
			this.miny = 0;
			this.maxx = 2*k.qcols;
			this.maxy = 2*k.qrows;
		}
		else{
			var extUL = (k.isexcell===1 || k.isexcell===2);
			var extDR = (k.isexcell===2);
			this.minx = (!extUL ? 1 : -1);
			this.miny = (!extUL ? 1 : -1);
			this.maxx = (!extDR ? 2*k.qcols-1 : 2*k.qcols+1);
			this.maxy = (!extDR ? 2*k.qrows-1 : 2*k.qrows+1);
		}

		if(this.cursorx<this.minx){ this.cursorx=this.minx;}
		if(this.cursory<this.miny){ this.cursory=this.miny;}
		if(this.cursorx>this.maxx){ this.cursorx=this.maxx;}
		if(this.cursory>this.maxy){ this.cursory=this.maxy;}
	},
	setAlign : function(){ },

	setCrossType : function(){
		this.crosstype = true;
		this.adjust();
		this.setTCP(new Pos(0,0));
	},

	//---------------------------------------------------------------------------
	// tc.incTCX(), tc.incTCY(), tc.decTCX(), tc.decTCY() �^�[�Q�b�g�̈ʒu�𓮂���
	//---------------------------------------------------------------------------
	incTCX : function(mv){ this.cursorx+=mv;},
	incTCY : function(mv){ this.cursory+=mv;},
	decTCX : function(mv){ this.cursorx-=mv;},
	decTCY : function(mv){ this.cursory-=mv;},

	//---------------------------------------------------------------------------
	// tc.getTCP() �^�[�Q�b�g�̈ʒu��Pos�N���X�̃I�u�W�F�N�g�Ŏ擾����
	// tc.setTCP() �^�[�Q�b�g�̈ʒu��Pos�N���X�̃I�u�W�F�N�g�Őݒ肷��
	// tc.getTCC() �^�[�Q�b�g�̈ʒu��Cell��ID�Ŏ擾����
	// tc.setTCC() �^�[�Q�b�g�̈ʒu��Cell��ID�Őݒ肷��
	// tc.getTXC() �^�[�Q�b�g�̈ʒu��Cross��ID�Ŏ擾����
	// tc.setTXC() �^�[�Q�b�g�̈ʒu��Cross��ID�Őݒ肷��
	// tc.getTBC() �^�[�Q�b�g�̈ʒu��Border��ID�Ŏ擾����
	// tc.setTBC() �^�[�Q�b�g�̈ʒu��Border��ID�Őݒ肷��
	// tc.getTEC() �^�[�Q�b�g�̈ʒu��EXCell��ID�Ŏ擾����
	// tc.setTEC() �^�[�Q�b�g�̈ʒu��EXCell��ID�Őݒ肷��
	//---------------------------------------------------------------------------
	getTCP : function(){ return new Pos(this.cursorx,this.cursory);},
	setTCP : function(pos){
		if(pos.x<this.minx || this.maxx<pos.x || pos.y<this.miny || this.maxy<pos.y){ return;}
		this.cursorx = pos.x; this.cursory = pos.y;
	},
	getTCC : function(){ return bd.cnum(this.cursorx, this.cursory);},
	setTCC : function(id){
		if(id<0 || bd.cellmax<=id){ return;}
		this.cursorx = bd.cell[id].bx; this.cursory = bd.cell[id].by;
	},
	getTXC : function(){ return bd.xnum(this.cursorx, this.cursory);},
	setTXC : function(id){
		if(!k.iscross || id<0 || bd.crossmax<=id){ return;}
		this.cursorx = bd.cross[id].bx; this.cursory = bd.cross[id].by;
	},
	getTBC : function(){ return bd.bnum(this.cursorx, this.cursory);},
	setTBC : function(id){
		if(!k.isborder || id<0 || bd.bdmax<=id){ return;}
		this.cursorx = bd.border[id].bx; this.cursory = bd.border[id].by;
	},
	getTEC : function(){ return bd.exnum(this.cursorx, this.cursory);},
	setTEC : function(id){
		if(!k.isexcell || id<0 || bd.excellmax<=id){ return;}
		this.cursorx = bd.excell[id].bx; this.cursory = bd.excell[id].by;
	}
};

//---------------------------------------------------------------------------
// ��Encode�N���X URL�̃G���R�[�h/�f�R�[�h������
//    p.html?(pid)/(qdata)
//                  qdata -> [(pflag)/](cols)/(rows)/(bstr)
//---------------------------------------------------------------------------
// URL�G���R�[�h/�f�R�[�h
// Encode�N���X
Encode = function(){
	this.uri = {};

	this.uri.type;		// ���͂��ꂽURL�̃T�C�g�w�蕔��
	this.uri.qdata;		// ���͂��ꂽURL�̖�蕔��

	this.uri.pflag;		// ���͂��ꂽURL�̃t���O����
	this.uri.cols;		// ���͂��ꂽURL�̉�������
	this.uri.rows;		// ���͂��ꂽURL�̏c������
	this.uri.bstr;		// ���͂��ꂽURL�̔Ֆʕ���

	this.pidKanpen = '';
	this.pidforURL = '';

	this.outpflag  = '';
	this.outsize   = '';
	this.outbstr   = '';

	// �萔(URL�`��)
	this.PZPRV3  = 0;
	this.PZPRV3E = 3;
	this.PAPRAPP = 1;
	this.KANPEN  = 2;
	this.KANPENP = 5;
	this.HEYAAPP = 4;
};
Encode.prototype = {
	//---------------------------------------------------------------------------
	// enc.init()           Encode�I�u�W�F�N�g�Ŏ��l������������
	// enc.first_parseURI() �N������URL����͂��āApuzzleid�̒��o��G�f�B�^/player������s��
	// enc.parseURI()       ���͂��ꂽURL���ǂ̃T�C�g�p�����肵��this.uri�ɒl��ۑ�����
	// enc.parseURI_xxx()   pzlURI����pflag,bstr���̕����ɕ�������
	//---------------------------------------------------------------------------
	init : function(){
		this.uri.type = this.PZPRV3;
		this.uri.qdata = "";

		this.uri.pflag = "";
		this.uri.cols = 0;
		this.uri.rows = 0;
		this.uri.bstr = "";

		this.outpflag  = '';
		this.outsize   = '';
		this.outbstr   = '';
	},

	first_parseURI : function(search){
		if(search.length<=0){ return "";}

		this.init();

		var startmode = 'PLAYER';

		if     (search=="?test")       { startmode = 'TEST';   search = 'country';}
		else if(search.match(/^\?m\+/)){ startmode = 'EDITOR'; search = search.substr(3);}
		else if(search.match(/_test/)) { startmode = 'TEST';   search = search.substr(1).replace(/_test/, '');}
		else if(search.match(/_edit/)) { startmode = 'EDITOR'; search = search.substr(1).replace(/_edit/, '');}
		else if(!search.match(/\//))   { startmode = 'EDITER'; search = search.substr(1);}
		else                           { startmode = 'PLAYER'; search = search.substr(1);}
		switch(startmode){
			case 'PLAYER': k.EDITOR = false; k.editmode = false; break;
			case 'EDITOR': k.EDITOR = true;  k.editmode = true;  break;
			case 'TEST'  : k.EDITOR = true;  k.editmode = false; k.scriptcheck = true; break;
		}
		k.PLAYER    = !k.EDITOR;
		k.playmode  = !k.editmode;

		var qs = search.indexOf("/");
		if(qs>=0){
			this.parseURI_pzpr(search.substr(qs+1));
			if(!!this.uri.cols){ k.qcols = this.uri.cols;}
			if(!!this.uri.rows){ k.qrows = this.uri.rows;}

			search = search.substr(0,qs);
		}

		// alias�@�\
		var pid = search;
		switch(pid){
			case 'yajilin'    : this.pidforURL = 'yajilin'; pid = 'yajirin'; break;
			case 'akari'      : this.pidforURL = 'akari';   pid = 'lightup'; break;
			case 'bijutsukan' : this.pidforURL = 'akari';   pid = 'lightup'; break;
			case 'slitherlink': this.pidforURL = pid = 'slither'; break;
			case 'numberlink' : this.pidforURL = pid = 'numlin';  break;
			case 'hakyukoka'  : this.pidforURL = pid = 'ripple';  break;
			case 'masyu'      : this.pidforURL = pid = 'mashu';   break;
			default           : this.pidforURL = pid;
		}
		k.puzzleid = pid;
	},
	parseURI : function(url){
		this.init();

		// textarea��̉��s�����ۂ̉��s�����ɂȂ�UA�ɑΉ�(Opera�Ƃ�)
		url = url.replace(/(\r|\n)/g,"");

		// �J���y���̏ꍇ
		if(url.match(/www\.kanpen\.net/) || url.match(/www\.geocities(\.co)?\.jp\/pencil_applet/) ){
			// �J���y�������ǃf�[�^�`���͂ւ�킯�A�v���b�g
			if(url.indexOf("?heyawake=")>=0){
				this.parseURI_heyaapp(url.substr(url.indexOf("?heyawake=")+10));
			}
			// �J���y�������ǃf�[�^�`���͂ς��Ղ�
			else if(url.indexOf("?pzpr=")>=0){
				this.parseURI_pzpr(url.substr(url.indexOf("?pzpr=")+6));
			}
			else{
				this.parseURI_kanpen(url.substr(url.indexOf("?problem=")+9));
			}
		}
		// �ւ�킯�A�v���b�g�̏ꍇ
		else if(url.match(/www\.geocities(\.co)?\.jp\/heyawake/)){
			this.parseURI_heyaapp(url.substr(url.indexOf("?problem=")+9));
		}
		// �ς��Ղ�̏ꍇ
		else{ // if(url.match(/indi\.s58\.xrea\.com/)){
			// �ς��Ղ�A�v���b�g��URL
			if(url.match(/\/(sa|sc)\/pzpr\/v3/)){
				this.parseURI_pzpr(url.substr(url.indexOf("?")));
				this.uri.type = this.PZPRAPP; // �ς��Ղ�A�v���b�g/URL�W�F�l���[�^
			}
			// �ς��Ղ�v3��URL
			else{
				this.parseURI_pzpr(url.substr(url.indexOf("/", url.indexOf("?"))+1));
			}
		}
	},
	parseURI_pzpr : function(qstr){
		this.uri.type = this.PZPRV3; // �ς��Ղ�v3
		this.uri.qdata = qstr;
		var inp = qstr.split("/");
		if(!isNaN(parseInt(inp[0]))){ inp.unshift("");}

		this.uri.pflag = inp.shift();
		this.uri.cols = parseInt(inp.shift());
		this.uri.rows = parseInt(inp.shift());
		this.uri.bstr = inp.join("/");
	},
	parseURI_kanpen : function(qstr){
		this.uri.type = this.KANPEN; // �J���y��
		this.uri.qdata = qstr;
		var inp = qstr.split("/");

		if(k.puzzleid=="sudoku"){
			this.uri.rows = this.uri.cols = parseInt(inp.shift());
		}
		else{
			this.uri.rows = parseInt(inp.shift());
			this.uri.cols = parseInt(inp.shift());
			if(k.puzzleid=="kakuro"){ this.uri.rows--; this.uri.cols--;}
		}
		this.uri.bstr = inp.join("/");
	},
	parseURI_heyaapp : function(qstr){
		this.uri.type = this.HEYAAPP; // �ւ�킯�A�v���b�g
		this.uri.qdata = qstr;
		var inp = qstr.split("/");

		var size = inp.shift().split("x");
		this.uri.cols = parseInt(size[0]);
		this.uri.rows = parseInt(size[1]);
		this.uri.bstr = inp.join("/");
	},

	//---------------------------------------------------------------------------
	// enc.checkpflag()   pflag�Ɏw�肵�������񂪊܂܂�Ă��邩���ׂ�
	//---------------------------------------------------------------------------
	checkpflag : function(ca){ return (this.uri.pflag.indexOf(ca)>=0);},

	//---------------------------------------------------------------------------
	// enc.pzlinput()   parseURI()���s������ɌĂяo���A�e�p�Y����pzlimport�֐����Ăяo��
	// enc.getURLBase() URL�̌��ƂȂ镔�����擾����
	// 
	// enc.pzlimport()    �e�p�Y����URL���͗p(�I�[�o�[���C�h�p)
	// enc.pzlexport()    �e�p�Y����URL�o�͗p(�I�[�o�[���C�h�p)
	//---------------------------------------------------------------------------
	pzlinput : function(){
		if(this.uri.cols && this.uri.rows){
			bd.initBoardSize(this.uri.cols, this.uri.rows);
		}
		if(this.uri.bstr){
			um.disableRecord(); um.disableInfo();
			switch(this.uri.type){
			case this.PZPRV3: case this.PZPRAPP: case this.PZPRV3E:
				this.outbstr = this.uri.bstr;
				this.pzlimport(this.uri.type);
				break;
			case this.KANPEN:
				fio.lineseek = 0;
				fio.dataarray = this.uri.bstr.replace(/_/g, " ").split("/");
				this.decodeKanpen();
				break;
			case this.HEYAAPP:
				this.decodeHeyaApp();
				break;
			}
			um.enableRecord(); um.enableInfo();

			bd.ansclear();
			base.resetInfo(true);

			if(!base.initProcess){
				base.resize_canvas();
			}
		}
	},
	pzloutput : function(type){
		if(type===this.KANPEN && k.puzzleid=='lits'){ type = this.KANPENP;}
		var pdata = '', size = '', ispflag = false;

		this.outpflag = '';
		this.outsize = '';
		this.outbstr = '';

		switch(type){
		case this.PZPRV3: case this.PZPRV3E:
			this.pzlexport(this.PZPRV3);

			size = (!this.outsize ? [k.qcols,k.qrows].join('/') : this.outsize);
			ispflag = (!!this.outpflag);
			break;

		case this.PZPRAPP: case this.KANPENP:
			this.pzlexport(this.PZPRAPP);

			size = (!this.outsize ? [k.qcols,k.qrows].join('/') : this.outsize);
			ispflag = true;
			break;

		case this.KANPEN:
			fio.datastr = "";
			this.encodeKanpen()
			this.outbstr = fio.datastr.replace(/ /g, "_");

			size = (!this.outsize ? [k.qrows,k.qcols].join('/') : this.outsize);
			break;

		case this.HEYAAPP:
			this.encodeHeyaApp();

			size = [k.qcols,k.qrows].join('x');
			break;

		default:
			return '';
		}

		if(ispflag){ pdata = [this.outpflag, size, this.outbstr].join("/");}
		else{ pdata = [size, this.outbstr].join("/");}

		return this.getURLBase(type) + pdata;
	},
	getURLBase : function(type){
		var urls = {};
		urls[this.PZPRV3]  = "http://indi.s58.xrea.com/pzpr/v3/p.html?%PID%/";
		urls[this.PZPRV3E] = "http://indi.s58.xrea.com/pzpr/v3/p.html?%PID%_edit/";
		urls[this.PZPRAPP] = "http://indi.s58.xrea.com/%PID%/sa/q.html?";
		urls[this.KANPEN]  = "http://www.kanpen.net/%KID%.html?problem=";
		urls[this.KANPENP] = "http://www.kanpen.net/%KID%.html?pzpr=";
		urls[this.HEYAAPP] = "http://www.geocities.co.jp/heyawake/?problem=";

		return urls[type].replace("%PID%",this.pidforURL).replace("%KID%",this.pidKanpen);
	},

	// �I�[�o�[���C�h�p
	pzlimport : function(type,bstr){ },
	pzlexport : function(type){ },
	decodeKanpen : function(){ },
	encodeKanpen : function(){ },
	decodeHeyaApp : function(bstr){ },
	encodeHeyaApp : function(){ },

	//---------------------------------------------------------------------------
	// enc.decode4Cell()  ques��0�`4�܂ł̏ꍇ�A�f�R�[�h����
	// enc.encode4Cell()  ques��0�`4�܂ł̏ꍇ�A��蕔���G���R�[�h����
	//---------------------------------------------------------------------------
	decode4Cell : function(){
		var c=0, i=0, bstr = this.outbstr;
		for(i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i);
			if     (this.include(ca,"0","4")){ bd.sQnC(c, parseInt(ca,16));    c++; }
			else if(this.include(ca,"5","9")){ bd.sQnC(c, parseInt(ca,16)-5);  c+=2;}
			else if(this.include(ca,"a","e")){ bd.sQnC(c, parseInt(ca,16)-10); c+=3;}
			else if(this.include(ca,"g","z")){ c+=(parseInt(ca,36)-15);}
			else if(ca=="."){ bd.sQnC(c, -2); c++;}

			if(c>=bd.cellmax){ break;}
		}
		this.outbstr = bstr.substr(i+1);
	},
	encode4Cell : function(){
		var count=0, cm = "";
		for(var i=0;i<bd.cellmax;i++){
			var pstr = "";

			if(bd.QnC(i)>=0){
				if     (i<bd.cellmax-1&&(bd.QnC(i+1)>=0||bd.QnC(i+1)==-2)){ pstr=""+bd.QnC(i).toString(16);}
				else if(i<bd.cellmax-2&&(bd.QnC(i+2)>=0||bd.QnC(i+2)==-2)){ pstr=""+(5+bd.QnC(i)).toString(16); i++;}
				else{ pstr=""+(10+bd.QnC(i)).toString(16); i+=2;}
			}
			else if(bd.QnC(i)==-2){ pstr=".";}
			else{ pstr=" "; count++;}

			if(count==0)      { cm += pstr;}
			else if(pstr!=" "){ cm += ((count+15).toString(36)+pstr); count=0;}
			else if(count==20){ cm += "z"; count=0;}
		}
		if(count>0){ cm += ((count+15).toString(36));}

		this.outbstr += cm;
	},

	//---------------------------------------------------------------------------
	// enc.decode4Cross()  ques��0�`4�܂ł̏ꍇ�A�f�R�[�h����
	// enc.encode4Cross()  ques��0�`4�܂ł̏ꍇ�A��蕔���G���R�[�h����
	//---------------------------------------------------------------------------
	decode4Cross : function(){
		var c=0, i=0, bstr = this.outbstr;
		for(i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i);
			if     (this.include(ca,"0","4")){ bd.sQnX(c, parseInt(ca,16));    c++; }
			else if(this.include(ca,"5","9")){ bd.sQnX(c, parseInt(ca,16)-5);  c+=2;}
			else if(this.include(ca,"a","e")){ bd.sQnX(c, parseInt(ca,16)-10); c+=3;}
			else if(this.include(ca,"g","z")){ c+=(parseInt(ca,36)-15);}
			else if(ca=="."){ bd.sQnX(c, -2); c++;}

			if(c>=bd.crossmax){ break;}
		}
		this.outbstr = bstr.substr(i+1);
	},
	encode4Cross : function(){
		var count = 0, cm = "";
		for(var i=0;i<bd.crossmax;i++){
			var pstr = "";

			if(bd.QnX(i)>=0){
				if     (i<bd.crossmax-1&&(bd.QnX(i+1)>=0||bd.QnX(i+1)==-2)){ pstr=""+bd.QnX(i).toString(16);}
				else if(i<bd.crossmax-2&&(bd.QnX(i+2)>=0||bd.QnX(i+2)==-2)){ pstr=""+(5+bd.QnX(i)).toString(16); i++;}
				else{ pstr=""+(10+bd.QnX(i)).toString(16); i+=2;}
			}
			else if(bd.QnX(i)==-2){ pstr=".";}
			else{ pstr=" "; count++;}

			if(count==0)      { cm += pstr;}
			else if(pstr!=" "){ cm += ((count+15).toString(36)+pstr); count=0;}
			else if(count==20){ cm += "z"; count=0;}
		}
		if(count>0){ cm += ((count+15).toString(36));}

		this.outbstr += cm;
	},

	//---------------------------------------------------------------------------
	// enc.decodeNumber10()  ques��0�`9�܂ł̏ꍇ�A�f�R�[�h����
	// enc.encodeNumber10()  ques��0�`9�܂ł̏ꍇ�A��蕔���G���R�[�h����
	//---------------------------------------------------------------------------
	decodeNumber10 : function(){
		var c=0, i=0, bstr = this.outbstr;
		for(i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i);

			if     (this.include(ca,"0","9")){ bd.sQnC(c, parseInt(bstr.substr(i,1),10)); c++;}
			else if(this.include(ca,"a","z")){ c += (parseInt(ca,36)-9);}
			else if(ca == '.'){ bd.sQnC(c, -2); c++;}
			else{ c++;}

			if(c > bd.cellmax){ break;}
		}
		this.outbstr = bstr.substr(i);
	},
	encodeNumber10 : function(){
		var cm="", count=0;
		for(var i=0;i<bd.cellmax;i++){
			pstr = "";
			var val = bd.QnC(i);

			if     (val==  -2            ){ pstr = ".";}
			else if(val>=   0 && val<  10){ pstr =       val.toString(10);}
			else{ count++;}

			if(count==0){ cm += pstr;}
			else if(pstr || count==26){ cm+=((9+count).toString(36)+pstr); count=0;}
		}
		if(count>0){ cm+=(9+count).toString(36);}

		this.outbstr += cm;
	},

	//---------------------------------------------------------------------------
	// enc.decodeNumber16()  ques��0�`8192?�܂ł̏ꍇ�A�f�R�[�h����
	// enc.encodeNumber16()  ques��0�`8192?�܂ł̏ꍇ�A��蕔���G���R�[�h����
	//---------------------------------------------------------------------------
	decodeNumber16 : function(){
		var c=0, i=0, bstr = this.outbstr;
		for(i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i);

			if(this.include(ca,"0","9")||this.include(ca,"a","f"))
							  { bd.sQnC(c, parseInt(bstr.substr(i,  1),16));      c++;}
			else if(ca == '.'){ bd.sQnC(c, -2);                                   c++;      }
			else if(ca == '-'){ bd.sQnC(c, parseInt(bstr.substr(i+1,2),16));      c++; i+=2;}
			else if(ca == '+'){ bd.sQnC(c, parseInt(bstr.substr(i+1,3),16));      c++; i+=3;}
			else if(ca == '='){ bd.sQnC(c, parseInt(bstr.substr(i+1,3),16)+4096); c++; i+=3;}
			else if(ca == '%'){ bd.sQnC(c, parseInt(bstr.substr(i+1,3),16)+8192); c++; i+=3;}
			else if(ca >= 'g' && ca <= 'z'){ c += (parseInt(ca,36)-15);}
			else{ c++;}

			if(c > bd.cellmax){ break;}
		}
		this.outbstr = bstr.substr(i);
	},
	encodeNumber16 : function(){
		var count=0, cm="";
		for(var i=0;i<bd.cellmax;i++){
			pstr = "";
			var val = bd.QnC(i);

			if     (val==  -2            ){ pstr = ".";}
			else if(val>=   0 && val<  16){ pstr =       val.toString(16);}
			else if(val>=  16 && val< 256){ pstr = "-" + val.toString(16);}
			else if(val>= 256 && val<4096){ pstr = "+" + val.toString(16);}
			else if(val>=4096 && val<8192){ pstr = "=" + (val-4096).toString(16);}
			else if(val>=8192            ){ pstr = "%" + (val-8192).toString(16);}
			else{ count++;}

			if(count==0){ cm += pstr;}
			else if(pstr || count==20){ cm+=((15+count).toString(36)+pstr); count=0;}
		}
		if(count>0){ cm+=(15+count).toString(36);}

		this.outbstr += cm;
	},

	//---------------------------------------------------------------------------
	// enc.decodeRoomNumber16()  �����{�����̈��ques��0�`8192?�܂ł̏ꍇ�A�f�R�[�h����
	// enc.encodeRoomNumber16()  �����{�����̈��ques��0�`8192?�܂ł̏ꍇ�A��蕔���G���R�[�h����
	//---------------------------------------------------------------------------
	decodeRoomNumber16 : function(){
		area.resetRarea();
		var r=1, i=0, bstr = this.outbstr;
		for(i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i);

			if(this.include(ca,"0","9")||this.include(ca,"a","f"))
							  { bd.sQnC(area.getTopOfRoom(r), parseInt(bstr.substr(i,  1),16));      r++;}
			else if(ca == '-'){ bd.sQnC(area.getTopOfRoom(r), parseInt(bstr.substr(i+1,2),16));      r++; i+=2;}
			else if(ca == '+'){ bd.sQnC(area.getTopOfRoom(r), parseInt(bstr.substr(i+1,3),16));      r++; i+=3;}
			else if(ca == '='){ bd.sQnC(area.getTopOfRoom(r), parseInt(bstr.substr(i+1,3),16)+4096); r++; i+=3;}
			else if(ca == '%'){ bd.sQnC(area.getTopOfRoom(r), parseInt(bstr.substr(i+1,3),16)+8192); r++; i+=3;}
			else if(ca == '*'){ bd.sQnC(area.getTopOfRoom(r), parseInt(bstr.substr(i+1,3),16)+12240); r++; i+=4;}
			else if(ca == '$'){ bd.sQnC(area.getTopOfRoom(r), parseInt(bstr.substr(i+1,3),16)+77776); r++; i+=5;}
			else if(ca >= 'g' && ca <= 'z'){ r += (parseInt(ca,36)-15);}
			else{ r++;}

			if(r > area.room.max){ break;}
		}
		this.outbstr = bstr.substr(i);
	},
	encodeRoomNumber16 : function(){
		area.resetRarea();
		var count=0, cm="";
		for(var i=1;i<=area.room.max;i++){
			var pstr = "";
			var val = bd.QnC(area.getTopOfRoom(i));

			if     (val>=     0 && val<    16){ pstr =       val.toString(16);}
			else if(val>=    16 && val<   256){ pstr = "-" + val.toString(16);}
			else if(val>=   256 && val<  4096){ pstr = "+" + val.toString(16);}
			else if(val>=  4096 && val<  8192){ pstr = "=" + (val-4096).toString(16);}
			else if(val>=  8192 && val< 12240){ pstr = "%" + (val-8192).toString(16);}
			else if(val>= 12240 && val< 77776){ pstr = "*" + (val-12240).toString(16);}
			else if(val>= 77776              ){ pstr = "$" + (val-77776).toString(16);} // �ő�1126352
			else{ count++;}

			if(count==0){ cm += pstr;}
			else if(pstr || count==20){ cm+=((15+count).toString(36)+pstr); count=0;}
		}
		if(count>0){ cm+=(15+count).toString(36);}

		this.outbstr += cm;
	},

	//---------------------------------------------------------------------------
	// enc.decodeArrowNumber16()  ���t��ques��0�`8192?�܂ł̏ꍇ�A�f�R�[�h����
	// enc.encodeArrowNumber16()  ���t��ques��0�`8192?�܂ł̏ꍇ�A��蕔���G���R�[�h����
	//---------------------------------------------------------------------------
	decodeArrowNumber16 : function(){
		var c=0, i=0, bstr = this.outbstr;
		for(i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i);

			if(ca=='0'){
				if(bstr.charAt(i+1)=="."){ bd.sQnC(c,-2); c++; i++;}
				else{ bd.sQnC(c, parseInt(bstr.substr(i+1,1),16)); c++; i++;}
			}
			else if(ca=='5'){ bd.sQnC(c, parseInt(bstr.substr(i+1,2),16)); c++; i+=2;}
			else if(this.include(ca,"1","4")){
				bd.sDiC(c, parseInt(ca,16));
				if(bstr.charAt(i+1)!="."){ bd.sQnC(c, parseInt(bstr.substr(i+1,1),16));}
				else{ bd.sQnC(c,-2);}
				c++; i++;
			}
			else if(this.include(ca,"6","9")){
				bd.sDiC(c, parseInt(ca,16)-5);
				bd.sQnC(c, parseInt(bstr.substr(i+1,2),16));
				c++; i+=2;
			}
			else if(ca>='a' && ca<='z'){ c+=(parseInt(ca,36)-9);}
			else{ c++;}

			if(c > bd.cellmax){ break;}
		}
		this.outbstr = bstr.substr(i);
	},
	encodeArrowNumber16 : function(){
		var cm = "", count = 0;
		for(var c=0;c<bd.cellmax;c++){
			var pstr="";
			if(bd.QnC(c)!=-1){
				if     (bd.QnC(c)==-2){ pstr=((bd.DiC(c)==0?0:bd.DiC(c)  )+".");}
				else if(bd.QnC(c)< 16){ pstr=((bd.DiC(c)==0?0:bd.DiC(c)  )+bd.QnC(c).toString(16));}
				else if(bd.QnC(c)<256){ pstr=((bd.DiC(c)==0?5:bd.DiC(c)+5)+bd.QnC(c).toString(16));}
			}
			else{ pstr=" "; count++;}

			if(count==0)      { cm += pstr;}
			else if(pstr!=" "){ cm += ((count+9).toString(36)+pstr); count=0;}
			else if(count==26){ cm += "z"; count=0;}
		}
		if(count>0){ cm += (count+9).toString(36);}

		this.outbstr += cm;
	},

	//---------------------------------------------------------------------------
	// enc.decodeBorder() ���̋��E�����f�R�[�h����
	// enc.encodeBorder() ���̋��E�����G���R�[�h����
	//---------------------------------------------------------------------------
	decodeBorder : function(){
		var pos1, pos2, bstr = this.outbstr;

		if(bstr){
			pos1 = Math.min(mf(((k.qcols-1)*k.qrows+4)/5)     , bstr.length);
			pos2 = Math.min(mf((k.qcols*(k.qrows-1)+4)/5)+pos1, bstr.length);
		}
		else{ pos1 = 0; pos2 = 0;}

		for(var i=0;i<pos1;i++){
			var ca = parseInt(bstr.charAt(i),32);
			for(var w=0;w<5;w++){
				if(i*5+w<(k.qcols-1)*k.qrows){ bd.sQuB(i*5+w,(ca&Math.pow(2,4-w)?1:0));}
			}
		}

		var oft = (k.qcols-1)*k.qrows;
		for(var i=0;i<pos2-pos1;i++){
			var ca = parseInt(bstr.charAt(i+pos1),32);
			for(var w=0;w<5;w++){
				if(i*5+w<k.qcols*(k.qrows-1)){ bd.sQuB(i*5+w+oft,(ca&Math.pow(2,4-w)?1:0));}
			}
		}

		area.resetRarea();
		this.outbstr = bstr.substr(pos2);
	},
	encodeBorder : function(){
		var num, pass;
		var cm = "";

		num = 0; pass = 0;
		for(var i=0;i<(k.qcols-1)*k.qrows;i++){
			if(bd.QuB(i)==1){ pass+=Math.pow(2,4-num);}
			num++; if(num==5){ cm += pass.toString(32); num=0; pass=0;}
		}
		if(num>0){ cm += pass.toString(32);}

		num = 0; pass = 0;
		for(var i=(k.qcols-1)*k.qrows;i<bd.bdinside;i++){
			if(bd.QuB(i)==1){ pass+=Math.pow(2,4-num);}
			num++; if(num==5){ cm += pass.toString(32); num=0; pass=0;}
		}
		if(num>0){ cm += pass.toString(32);}

		this.outbstr += cm;
	},

	//---------------------------------------------------------------------------
	// enc.decodeCrossMark() ���_���f�R�[�h����
	// enc.encodeCrossMark() ���_���G���R�[�h����
	//---------------------------------------------------------------------------
	decodeCrossMark : function(){
		var cc=-1, i=0, bstr = this.outbstr
		for(i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i);

			if(this.include(ca,"0","9")||this.include(ca,"a","z")){
				cc += (parseInt(ca,36)+1);
				var bx = (k.iscross===2?   cc%(k.qcols+1) :   cc%(k.qcols-1) +1)*2;
				var by = (k.iscross===2?mf(cc/(k.qcols+1)):mf(cc/(k.qcols-1))+1)*2;

				if(by>=bd.maxby+(k.iscross===2?2:0)){ i++; break;}
				bd.sQnX(bd.xnum(bx,by), 1);
			}
			else if(ca == '.'){ cc += 36;}
			else{ cc++;}

			if(cc >= (k.iscross==2?(k.qcols+1)*(k.qrows+1):(k.qcols-1)*(k.qrows-1))-1){ i++; break;}
		}
		this.outbstr = bstr.substr(i);
	},
	encodeCrossMark : function(){
		var cm = "", count = 0;
		for(var i=0;i<(k.iscross===2?(k.qcols+1)*(k.qrows+1):(k.qcols-1)*(k.qrows-1));i++){
			var pstr = "";
			var bx = (k.iscross===2?   i%(k.qcols+1) :   i%(k.qcols-1) +1)*2;
			var by = (k.iscross===2?mf(i/(k.qcols+1)):mf(i/(k.qcols-1))+1)*2;

			if(bd.QnX(bd.xnum(bx,by))==1){ pstr = ".";}
			else{ pstr=" "; count++;}

			if(pstr!=" "){ cm += count.toString(36); count=0;}
			else if(count==36){ cm += "."; count=0;}
		}
		if(count>0){ cm += count.toString(36);}

		this.outbstr += cm;
	},

	//---------------------------------------------------------------------------
	// enc.decodeCircle41_42() ���ہE���ۂ��f�R�[�h����
	// enc.encodeCircle41_42() ���ہE���ۂ��G���R�[�h����
	//---------------------------------------------------------------------------
	decodeCircle41_42 : function(){
		var bstr = this.outbstr;
		var pos = bstr?Math.min(mf((k.qcols*k.qrows+2)/3), bstr.length):0;
		for(var i=0;i<pos;i++){
			var ca = parseInt(bstr.charAt(i),27);
			for(var w=0;w<3;w++){
				if(i*3+w<k.qcols*k.qrows){
					if     (mf(ca/Math.pow(3,2-w))%3==1){ bd.sQuC(i*3+w,41);}
					else if(mf(ca/Math.pow(3,2-w))%3==2){ bd.sQuC(i*3+w,42);}
				}
			}
		}
		this.outbstr = bstr.substr(pos);
	},
	encodeCircle41_42 : function(){
		var cm="", num=0, pass=0;
		for(var i=0;i<bd.cellmax;i++){
			if     (bd.QuC(i)==41){ pass+=(  Math.pow(3,2-num));}
			else if(bd.QuC(i)==42){ pass+=(2*Math.pow(3,2-num));}
			num++; if(num==3){ cm += pass.toString(27); num=0; pass=0;}
		}
		if(num>0){ cm += pass.toString(27);}

		this.outbstr += cm;
	},

	//---------------------------------------------------------------------------
	// enc.decodecross_old() Cross�̖�蕔���f�R�[�h����(���`��)
	//---------------------------------------------------------------------------
	decodecross_old : function(){
		var bstr = this.outbstr;
		for(var i=0;i<Math.min(bstr.length, bd.crossmax);i++){
			if     (bstr.charAt(i)=="0"){ bd.sQnX(i,0);}
			else if(bstr.charAt(i)=="1"){ bd.sQnX(i,1);}
			else if(bstr.charAt(i)=="2"){ bd.sQnX(i,2);}
			else if(bstr.charAt(i)=="3"){ bd.sQnX(i,3);}
			else if(bstr.charAt(i)=="4"){ bd.sQnX(i,4);}
			else{ bd.sQnX(i,-1);}
		}
		for(var j=bstr.length;j<bd.crossmax;j++){ bd.sQnX(j,-1);}

		this.outbstr = bstr.substr(i);
	},

	//---------------------------------------------------------------------------
	// enc.include()    ������ca��bottom��up�̊Ԃɂ��邩
	//---------------------------------------------------------------------------
	include : function(ca, bottom, up){
		if(bottom <= ca && ca <= up) return true;
		return false;
	}
};

//---------------------------------------------------------------------------
// ��FileIO�N���X �t�@�C���̃f�[�^�`���G���R�[�h/�f�R�[�h������
//---------------------------------------------------------------------------
FileIO = function(){
	this.filever = 0;
	this.lineseek = 0;
	this.dataarray = [];
	this.datastr = "";
	this.urlstr = "";

	// �萔(�t�@�C���`��)
	this.PZPR = 1;
	this.PBOX = 2;

	this.dbm = new DataBaseManager();
};
FileIO.prototype = {
	//---------------------------------------------------------------------------
	// fio.filedecode() �t�@�C�����J�����A�t�@�C���f�[�^����̃f�R�[�h���s�֐�
	//                  [menu.ex.fileopen] -> [fileio.xcg@iframe] -> [����]
	//---------------------------------------------------------------------------
	filedecode : function(datastr){
		this.filever = 0;
		this.lineseek = 0;
		this.dataarray = datastr.split("/");
		var type = this.PZPR;

		// �w�b�_�̏���
		if(this.readLine().match(/pzprv3\.?(\d+)?/)){
			if(RegExp.$1){ this.filever = parseInt(RegExp.$1);}
			if(this.readLine()!=k.puzzleid){ alert(base.getPuzzleName()+'�̃t�@�C���ł͂���܂���B'); return;}
			type = this.PZPR;
		}
		else{
			this.lineseek = 0;
			type = this.PBOX;
		}

		// �T�C�Y��\��������
		var row, col;
		if(k.puzzleid!=="sudoku"){
			row = parseInt(this.readLine(), 10);
			col = parseInt(this.readLine(), 10);
			if(type===2 && k.puzzleid==="kakuro"){ row--; col--;}
		}
		else{
			row = col = parseInt(this.readLine(), 10);
		}
		if(row<=0 || col<=0){ return;}
		bd.initBoardSize(col, row); // �Ֆʂ��w�肳�ꂽ�T�C�Y�ŏ�����

		// ���C������
		um.disableRecord(); um.disableInfo();
		if     (type===1){ this.decodeData();}
		else if(type===2){ this.kanpenOpen();}
		um.enableRecord(); um.enableInfo();

		this.dataarray = null; // �d���Ȃ肻���Ȃ̂ŏ�����

		base.resetInfo(true);
		base.resize_canvas();
	},
	//---------------------------------------------------------------------------
	// fio.fileencode() �t�@�C��������ւ̃G���R�[�h�A�t�@�C���ۑ����s�֐�
	//                  [[menu.ex.filesave] -> [����]] -> [fileio.xcg@iframe]
	//---------------------------------------------------------------------------
	fileencode : function(type){
		this.filever = 0;
		this.sizestr = "";
		this.datastr = "";
		this.urlstr = "";

		// ���C������
		if     (type===this.PZPR){ this.encodeData();}
		else if(type===this.PBOX){ this.kanpenSave();}

		// �T�C�Y��\��������
		if(!this.sizestr){ this.sizestr = [k.qrows, k.qcols].join("/");}
		this.datastr = [this.sizestr, this.datastr].join("/");

		// �w�b�_�̏���
		if(type===1){
			var header = (this.filever===0 ? "pzprv3" : ("pzprv3."+this.filever));
			this.datastr = [header, k.puzzleid, this.datastr].join("/");
		}
		var bstr = this.datastr;

		// ������URL�ǉ�����
		if(type===1){
			this.urlstr = enc.pzloutput((!k.isKanpenExist || k.puzzleid==="lits") ? enc.PZPRV3 : enc.KANPEN);
		}

		return bstr;
	},

	//---------------------------------------------------------------------------
	// fio.readLine()    �t�@�C���ɏ�����Ă���1�s�̕������Ԃ�
	// fio.readLines()   �t�@�C���ɏ�����Ă��镡���s�̕������Ԃ�
	// fio.getItemList() �t�@�C���ɏ�����Ă�����s�{�X�y�[�X��؂��
	//                   �����s�̕������z��ɂ��ĕԂ�
	//---------------------------------------------------------------------------
	readLine : function(){
		this.lineseek++;
		return this.dataarray[this.lineseek-1];
	},
	readLines : function(rows){
		this.lineseek += rows;
		return this.dataarray.slice(this.lineseek-rows, this.lineseek);
	},

	getItemList : function(rows){
		var item = [];
		var array = this.readLines(rows);
		for(var i=0;i<array.length;i++){
			var array1 = array[i].split(" ");
			var array2 = [];
			for(var c=0;c<array1.length;c++){
				if(array1[c]!=""){ array2.push(array1[c]);}
			}
			item = item.concat(array2);
		}
		return item;
	},

	//---------------------------------------------------------------------------
	// fio.decodeObj()     �z��ŁA�ʕ����񂩂�ʃZ���Ȃǂ̐ݒ���s��
	// fio.decodeCell()    �z��ŁA�ʕ����񂩂�ʃZ���̐ݒ���s��
	// fio.decodeCross()   �z��ŁA�ʕ����񂩂��Cross�̐ݒ���s��
	// fio.decodeBorder()  �z��ŁA�ʕ����񂩂��Border(�O�g��Ȃ�)�̐ݒ���s��
	// fio.decodeBorder2() �z��ŁA�ʕ����񂩂��Border(�O�g�゠��)�̐ݒ���s��
	//---------------------------------------------------------------------------
	decodeObj : function(func, getid, startbx, startby, endbx, endby){
		var bx=startbx, by=startby, step=2;
		var item=this.getItemList((endby-startby)/step+1);
		for(var i=0;i<item.length;i++){
			func(getid.call(bd,bx,by), item[i]);

			bx+=step;
			if(bx>endbx){ bx=startbx; by+=step;}
			if(by>endby){ break;}
		}
	},
	decodeCell   : function(func){
		this.decodeObj(func, bd.cnum, 1, 1, 2*k.qcols-1, 2*k.qrows-1);
	},
	decodeCross  : function(func){
		this.decodeObj(func, bd.xnum, 0, 0, 2*k.qcols,   2*k.qrows  );
	},
	decodeBorder : function(func){
		this.decodeObj(func, bd.bnum, 2, 1, 2*k.qcols-2, 2*k.qrows-1);
		this.decodeObj(func, bd.bnum, 1, 2, 2*k.qcols-1, 2*k.qrows-2);
	},
	decodeBorder2: function(func){
		this.decodeObj(func, bd.bnum, 0, 1, 2*k.qcols  , 2*k.qrows-1);
		this.decodeObj(func, bd.bnum, 1, 0, 2*k.qcols-1, 2*k.qrows  );
	},

	//---------------------------------------------------------------------------
	// fio.encodeObj()     �ʃZ���f�[�^������ʕ�����̐ݒ���s��
	// fio.encodeCell()    �ʃZ���f�[�^����ʕ�����̐ݒ���s��
	// fio.encodeCross()   ��Cross�f�[�^����ʕ�����̐ݒ���s��
	// fio.encodeBorder()  ��Border�f�[�^(�O�g��Ȃ�)����ʕ�����̐ݒ���s��
	// fio.encodeBorder2() ��Border�f�[�^(�O�g�゠��)����ʕ�����̐ݒ���s��
	//---------------------------------------------------------------------------
	encodeObj : function(func, getid, startbx, startby, endbx, endby){
		var step=2;
		for(var by=startby;by<=endby;by+=step){
			for(var bx=startbx;bx<=endbx;bx+=step){
				this.datastr += func(getid.call(bd,bx,by));
			}
			this.datastr += "/";
		}
	},
	encodeCell   : function(func){
		this.encodeObj(func, bd.cnum, 1, 1, 2*k.qcols-1, 2*k.qrows-1);
	},
	encodeCross  : function(func){
		this.encodeObj(func, bd.xnum, 0, 0, 2*k.qcols,   2*k.qrows  );
	},
	encodeBorder : function(func){
		this.encodeObj(func, bd.bnum, 2, 1, 2*k.qcols-2, 2*k.qrows-1);
		this.encodeObj(func, bd.bnum, 1, 2, 2*k.qcols-1, 2*k.qrows-2);
	},
	encodeBorder2: function(func){
		this.encodeObj(func, bd.bnum, 0, 1, 2*k.qcols  , 2*k.qrows-1);
		this.encodeObj(func, bd.bnum, 1, 0, 2*k.qcols-1, 2*k.qrows  );
	},

	//---------------------------------------------------------------------------
	// fio.decodeCellQues41_42() ���ۂƔ��ۂ̃f�R�[�h���s��
	// fio.encodeCellQues41_42() ���ۂƔ��ۂ̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQues41_42 : function(){
		this.decodeCell( function(c,ca){
			if     (ca === "-"){ bd.sQnC(c, -2);}
			else if(ca === "1"){ bd.sQuC(c, 41);}
			else if(ca === "2"){ bd.sQuC(c, 42);}
		});
	},
	encodeCellQues41_42 : function(){
		this.encodeCell( function(c){
			if     (bd.QuC(c)===41){ return "1 ";}
			else if(bd.QuC(c)===42){ return "2 ";}
			else if(bd.QnC(c)===-2){ return "- ";}
			else                   { return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellQnum() ��萔���̃f�R�[�h���s��
	// fio.encodeCellQnum() ��萔���̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQnum : function(){
		this.decodeCell( function(c,ca){
			if     (ca === "-"){ bd.sQnC(c, -2);}
			else if(ca !== "."){ bd.sQnC(c, parseInt(ca));}
		});
	},
	encodeCellQnum : function(){
		this.encodeCell( function(c){
			if     (bd.QnC(c)>=0)  { return (bd.QnC(c).toString() + " ");}
			else if(bd.QnC(c)===-2){ return "- ";}
			else                   { return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellQnumb() ���{��萔���̃f�R�[�h���s��
	// fio.encodeCellQnumb() ���{��萔���̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQnumb : function(){
		this.decodeCell( function(c,ca){
			if     (ca === "5"){ bd.sQnC(c, -2);}
			else if(ca !== "."){ bd.sQnC(c, parseInt(ca));}
		});
	},
	encodeCellQnumb : function(){
		this.encodeCell( function(c){
			if     (bd.QnC(c)>=0)  { return (bd.QnC(c).toString() + " ");}
			else if(bd.QnC(c)===-2){ return "5 ";}
			else                   { return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellQnumAns() ��萔���{���}�X���}�X�̃f�R�[�h���s��
	// fio.encodeCellQnumAns() ��萔���{���}�X���}�X�̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQnumAns : function(){
		this.decodeCell( function(c,ca){
			if     (ca === "#"){ bd.setBlack(c);}
			else if(ca === "+"){ bd.sQsC(c, 1);}
			else if(ca === "-"){ bd.sQnC(c, -2);}
			else if(ca !== "."){ bd.sQnC(c, parseInt(ca));}
		});
	},
	encodeCellQnumAns : function(){
		this.encodeCell( function(c){
			if     (bd.QnC(c)>=0) { return (bd.QnC(c).toString() + " ");}
			else if(bd.QnC(c)===-2){return "- ";}
			else if(bd.isBlack(c)){ return "# ";}
			else if(bd.QsC(c)===1){ return "+ ";}
			else                  { return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellDirecQnum() �����{��萔���̃f�R�[�h���s��
	// fio.encodeCellDirecQnum() �����{��萔���̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellDirecQnum : function(){
		this.decodeCell( function(c,ca){
			if(ca !== "."){
				var inp = ca.split(",");
				bd.sDiC(c, (inp[0]!=="0"?parseInt(inp[0]): 0));
				bd.sQnC(c, (inp[1]!=="-"?parseInt(inp[1]):-2));
			}
		});
	},
	encodeCellDirecQnum : function(){
		this.encodeCell( function(c){
			if(bd.QnC(c)!==-1){
				var ca1 = (bd.DiC(c)!== 0?(bd.DiC(c)).toString():"0");
				var ca2 = (bd.QnC(c)!==-2?(bd.QnC(c)).toString():"-");
				return ""+ca1+","+ca2+" ";
			}
			else{ return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellAns() ���}�X���}�X�̃f�R�[�h���s��
	// fio.encodeCellAns() ���}�X���}�X�̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellAns : function(){
		this.decodeCell( function(c,ca){
			if     (ca === "#"){ bd.setBlack(c);}
			else if(ca === "+"){ bd.sQsC(c, 1); }
		});
	},
	encodeCellAns : function(){
		this.encodeCell( function(c){
			if     (bd.isBlack(c)){ return "# ";}
			else if(bd.QsC(c)===1){ return "+ ";}
			else                  { return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellQanssub() �񓚐����Ɣw�i�F�̃f�R�[�h���s��
	// fio.encodeCellQanssub() �񓚐����Ɣw�i�F�̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQanssub : function(){
		this.decodeCell( function(c,ca){
			if     (ca === "+"){ bd.sQsC(c, 1);}
			else if(ca === "-"){ bd.sQsC(c, 2);}
			else if(ca === "="){ bd.sQsC(c, 3);}
			else if(ca === "%"){ bd.sQsC(c, 4);}
			else if(ca !== "."){ bd.sQaC(c, parseInt(ca));}
		});
	},
	encodeCellQanssub : function(){
		this.encodeCell( function(c){
			//if(bd.QuC(c)!=0 || bd.QnC(c)!=-1){ return ". ";}
			if     (bd.QaC(c)!==-1){ return (bd.QaC(c).toString() + " ");}
			else if(bd.QsC(c)===1 ){ return "+ ";}
			else if(bd.QsC(c)===2 ){ return "- ";}
			else if(bd.QsC(c)===3 ){ return "= ";}
			else if(bd.QsC(c)===4 ){ return "% ";}
			else                   { return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellQsub() �w�i�F�̃f�R�[�h���s��
	// fio.encodeCellQsub() �w�i�F�̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQsub : function(){
		this.decodeCell( function(c,ca){
			if(ca != "0"){ bd.sQsC(c, parseInt(ca));}
		});
	},
	encodeCellQsub : function(){
		this.encodeCell( function(c){
			if     (bd.QsC(c)>0){ return (bd.QsC(c).toString() + " ");}
			else                { return "0 ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCrossNum() ��_�̐����̃f�R�[�h���s��
	// fio.encodeCrossNum() ��_�̐����̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCrossNum : function(){
		this.decodeCross( function(c,ca){
			if     (ca === "-"){ bd.sQnX(c, -2);}
			else if(ca !== "."){ bd.sQnX(c, parseInt(ca));}
		});
	},
	encodeCrossNum : function(){
		this.encodeCross( function(c){
			if     (bd.QnX(c)>=0)  { return (bd.QnX(c).toString() + " ");}
			else if(bd.QnX(c)===-2){ return "- ";}
			else                   { return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeBorderQues() ���̋��E���̃f�R�[�h���s��
	// fio.encodeBorderQues() ���̋��E���̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeBorderQues : function(){
		this.decodeBorder( function(c,ca){
			if(ca === "1"){ bd.sQuB(c, 1);}
		});
	},
	encodeBorderQues : function(){
		this.encodeBorder( function(c){
			if     (bd.QuB(c)===1){ return "1 ";}
			else                  { return "0 ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeBorderLine() Line�̃f�R�[�h���s��
	// fio.encodeBorderLine() Line�̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeBorderLine : function(){
		var svfunc = bd.isLineNG;
		bd.isLineNG = function(id){ return false;};

		this.decodeBorder( function(c,ca){
			if     (ca === "-1"){ bd.sQsB(c, 2);}
			else if(ca !== "0" ){ bd.sLiB(c, parseInt(ca));}
		});

		bd.isLineNG = svfunc;
	},
	encodeBorderLine : function(){
		this.encodeBorder( function(c){
			if     (bd.LiB(c)>  0){ return ""+bd.LiB(c)+" ";}
			else if(bd.QsB(c)===2){ return "-1 ";}
			else                  { return "0 ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeBorderAns() ���E�񓚂̋��E���̃f�R�[�h���s��
	// fio.encodeBorderAns() ���E�񓚂̋��E���̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeBorderAns : function(){
		this.decodeBorder( function(c,ca){
			if     (ca === "1" ){ bd.sQaB(c, 1);}
			else if(ca === "2" ){ bd.sQaB(c, 1); bd.sQsB(c, 1);}
			else if(ca === "-1"){ bd.sQsB(c, 1);}
		});
	},
	encodeBorderAns : function(){
		this.encodeBorder( function(c){
			if     (bd.QaB(c)===1 && bd.QsB(c)===1){ return "2 ";}
			else if(bd.QaB(c)===1){ return "1 ";}
			else if(bd.QsB(c)===1){ return "-1 ";}
			else                  { return "0 ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeBorderAns2() ���E�񓚂̋��E���̃f�R�[�h(�O�g����)���s��
	// fio.encodeBorderAns2() ���E�񓚂̋��E���̃G���R�[�h(�O�g����)���s��
	//---------------------------------------------------------------------------
	decodeBorderAns2 : function(){
		this.decodeBorder2( function(c,ca){
			if     (ca === "1" ){ bd.sQaB(c, 1);}
			else if(ca === "2" ){ bd.sQsB(c, 1);}
			else if(ca === "3" ){ bd.sQaB(c, 1); bd.sQsB(c, 1);}
			else if(ca === "-1"){ bd.sQsB(c, 2);}
		});
	},
	encodeBorderAns2 : function(){
		this.encodeBorder2( function(c){
			if     (bd.QaB(c)===1 && bd.QsB(c)===1){ return "3 ";}
			else if(bd.QsB(c)===1){ return "2 ";}
			else if(bd.QaB(c)===1){ return "1 ";}
			else if(bd.QsB(c)===2){ return "-1 ";}
			else                  { return "0 ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeAreaRoom() �����̃f�R�[�h���s��
	// fio.encodeAreaRoom() �����̃G���R�[�h���s��
	// fio.decodeAnsAreaRoom() (�񓚗p)�����̃f�R�[�h���s��
	// fio.encodeAnsAreaRoom() (�񓚗p)�����̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeAreaRoom : function(){ this.decodeAreaRoom_com(true);},
	encodeAreaRoom : function(){ this.encodeAreaRoom_com(true);},
	decodeAnsAreaRoom : function(){ this.decodeAreaRoom_com(false);},
	encodeAnsAreaRoom : function(){ this.encodeAreaRoom_com(false);},

	decodeAreaRoom_com : function(isques){
		this.readLine();
		this.rdata2Border(isques, this.getItemList(k.qrows));

		area.resetRarea();
	},
	encodeAreaRoom_com : function(isques){
		var rinfo = area.getRoomInfo();

		this.datastr += (rinfo.max+"/");
		for(var c=0;c<bd.cellmax;c++){
			this.datastr += (""+(rinfo.id[c]-1)+" ");
			if((c+1)%k.qcols==0){ this.datastr += "/";}
		}
	},
	//---------------------------------------------------------------------------
	// fio.rdata2Border() ���͂��ꂽ�z�񂩂狫�E������͂���
	//---------------------------------------------------------------------------
	rdata2Border : function(isques, rdata){
		var func = (isques ? bd.sQuB : bd.sQaB);
		for(var id=0;id<bd.bdmax;id++){
			var cc1 = bd.border[id].cellcc[0], cc2 = bd.border[id].cellcc[1];
			func.apply(bd, [id, (cc1!=-1 && cc2!=-1 && rdata[cc1]!=rdata[cc2]?1:0)]);
		}
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellQnum51() [�_]�̃f�R�[�h���s��
	// fio.encodeCellQnum51() [�_]�̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQnum51 : function(){
		var item = this.getItemList(k.qrows+1);
		for(var i=0;i<item.length;i++) {
			var bx=(i%(k.qcols+1)-1)*2+1, by=(mf(i/(k.qcols+1))-1)*2+1;
			if(item[i]!="."){
				if     (by===-1){ bd.sDiE(bd.exnum(bx,by), parseInt(item[i]));}
				else if(bx===-1){ bd.sQnE(bd.exnum(bx,by), parseInt(item[i]));}
				else{
					var inp = item[i].split(",");
					var c = bd.cnum(bx,by);
					mv.set51cell(c, true);
					bd.sQnC(c, inp[0]);
					bd.sDiC(c, inp[1]);
				}
			}
		}
	},
	encodeCellQnum51 : function(){
		var str = "";
		for(var by=bd.minby+1;by<bd.maxby;by+=2){
			for(var bx=bd.minbx+1;bx<bd.maxbx;bx+=2){
				if     (bx===-1 && by==-1){ str += "0 ";}
				else if(by===-1){ str += (""+bd.DiE(bd.exnum(bx,by)).toString()+" ");}
				else if(bx===-1){ str += (""+bd.QnE(bd.exnum(bx,by)).toString()+" ");}
				else{
					var c = bd.cnum(bx,by);
					if(bd.QuC(c)===51){ str += (""+bd.QnC(c).toString()+","+bd.DiC(c).toString()+" ");}
					else{ str += ". ";}
				}
			}
			str += "/";
		}
		this.datastr += str;
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellQnum_kanpen() �J���y���p��萔���̃f�R�[�h���s��
	// fio.encodeCellQnum_kanpen() �J���y���p��萔���̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQnum_kanpen : function(){
		this.decodeCell( function(c,ca){
			if(ca != "."){ bd.sQnC(c, parseInt(ca));}
		});
	},
	encodeCellQnum_kanpen : function(){
		this.encodeCell( function(c){
			return (bd.QnC(c)>=0)?(bd.QnC(c).toString() + " "):". ";
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellQans_kanpen() �J���y���p�񓚐����̃f�R�[�h���s��
	// fio.encodeCellQans_kanpen() �J���y���p�񓚐����̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQans_kanpen : function(){
		this.decodeCell( function(c,ca){
			if(ca!="."&&ca!="0"){ bd.sQaC(c, parseInt(ca));}
		});
	},
	encodeCellQans_kanpen : function(){
		this.encodeCell( function(c){
			if     (bd.QnC(c)!=-1){ return ". ";}
			else if(bd.QaC(c)==-1){ return "0 ";}
			else                  { return ""+bd.QaC(c).toString()+" ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellQnumAns_kanpen() �J���y���p��萔���{���}�X���}�X�̃f�R�[�h���s��
	// fio.encodeCellQnumAns_kanpen() �J���y���p��萔���{���}�X���}�X�̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQnumAns_kanpen : function(){
		this.decodeCell( function(c,ca){
			if     (ca == "#"){ bd.setBlack(c);}
			else if(ca == "+"){ bd.sQsC(c, 1);}
			else if(ca != "."){ bd.sQnC(c, parseInt(ca));}
		});
	},
	encodeCellQnumAns_kanpen : function(){
		this.encodeCell( function(c){
			if     (bd.QnC(c)>=0 ){ return (bd.QnC(c).toString() + " ");}
			else if(bd.isBlack(c)){ return "# ";}
			else if(bd.QsC(c)==1 ){ return "+ ";}
			else                  { return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeSquareRoom() �J���y���p�l�p�`�̕����̃f�R�[�h���s��
	// fio.encodeSquareRoom() �J���y���p�l�p�`�̕����̃G���R�[�h���s��
	// fio.decodeAnsSquareRoom() (�񓚗p)�J���y���p�l�p�`�̕����̃f�R�[�h���s��
	// fio.encodeAnsSquareRoom() (�񓚗p)�J���y���p�l�p�`�̕����̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeSquareRoom : function(){ this.decodeSquareRoom_com(true);},
	encodeSquareRoom : function(){ this.encodeSquareRoom_com(true);},
	decodeAnsSquareRoom : function(){ this.decodeSquareRoom_com(false);},
	encodeAnsSquareRoom : function(){ this.encodeSquareRoom_com(false);},

	decodeSquareRoom_com : function(isques){
		var rmax = parseInt(this.readLine());
		var barray = this.readLines(rmax);
		var rdata = [];
		for(var i=0;i<barray.length;i++){
			if(barray[i]==""){ break;}
			var pce = barray[i].split(" ");
			for(var n=0;n<4;n++){ if(!isNaN(pce[n])){ pce[n]=parseInt(pce[n]);} }

			var sp = {y1:2*pce[0]+1, x1:2*pce[1]+1, y2:2*pce[2]+1, x2:2*pce[3]+1};
			if(isques && pce[4]!=""){ bd.sQnC(bd.cnum(sp.x1,sp.y1), parseInt(pce[4],10));}
			this.setRdataRect(rdata, i, sp);
		}
		this.rdata2Border(isques, rdata);

		area.resetRarea();
	},
	setRdataRect : function(rdata, i, sp){
		for(var bx=sp.x1;bx<=sp.x2;bx+=2){
			for(var by=sp.y1;by<=sp.y2;by+=2){
				rdata[bd.cnum(bx,by)] = i;
			}
		}
	},
	encodeSquareRoom_com : function(isques){
		var rinfo = area.getRoomInfo();

		this.datastr += (rinfo.max+"/");
		for(var id=1;id<=rinfo.max;id++){
			var d = ans.getSizeOfClist(rinfo.room[id].idlist,f_true);
			var num = (isques ? bd.QnC(area.getTopOfRoom(id)) : -1);
			this.datastr += (""+(d.y1>>1)+" "+(d.x1>>1)+" "+(d.y2>>1)+" "+(d.x2>>1)+" "+(num>=0 ? ""+num : "")+"/");
		}
	}
};

//---------------------------------------------------------------------------
// ��DataBaseManager�N���X Web SQL DataBase�p �f�[�^�x�[�X�̐ݒ�E�Ǘ����s��
//---------------------------------------------------------------------------
DataBaseManager = function(){
	this.dbh    = null;	// �f�[�^�x�[�X�n���h��

	//this.DBtype = 0;
	this.DBaccept = 0;	// �f�[�^�x�[�X�̃^�C�v 1:Gears 2:WebDB 4:IdxDB 8:localStorage

	this.DBsid  = -1;	// ���ݑI������Ă��郊�X�g����ID
	this.DBlist = [];	// ���݈ꗗ�ɂ�����̃��X�g
	this.keys = ['id', 'col', 'row', 'hard', 'pdata', 'time', 'comment']; // �L�[�̕���

	this.selectDBtype();
};
DataBaseManager.prototype = {
	//---------------------------------------------------------------------------
	// fio.dbm.selectDBtype() Web DataBase���g���邩�ǂ������肷��(�N����)
	// fio.dbm.requestGears() gears_init.js��ǂݏo�������肷��
	//---------------------------------------------------------------------------
	selectDBtype : function(){
		// HTML5 - Web localStorage����p
		if(!!window.localStorage){
			// Firefox�̓��[�J������localStorage���g���Ȃ�
			if(!k.br.Gecko || !!location.hostname){ this.DBaccept |= 0x08;}
		}

		// HTML5 - Web DataBase����p
		if(!!window.openDatabase){
			try{	// Opera10.50�΍�
				var dbtmp = openDatabase('pzprv3_manage', '1.0');	// Chrome3�΍�
				if(!!dbtmp){ this.DBaccept |= 0x02;}
			}
			catch(e){}
		}

		// �ȉ���Gears�p(gears_init.js�̔��胋�[�`���I�Ȃ���)
		// Google Chorme�p(����Gears�����݂��邩����)
		try{
			if((window.google && google.gears) || // ����Gears����������
			   (typeof GearsFactory != 'undefined') || 										// Firefox�̎�
			   (!!window.ActiveXObject && (!!(new ActiveXObject('Gears.Factory')))) ||		// IE�̎�
			   (!!navigator.mimeTypes && navigator.mimeTypes["application/x-googlegears"]))	// Webkit�̎�
			{ this.DBaccept |= 0x01;}
		}
		catch(e){}
	},
	requireGears : function(){
		return !!(this.DBaccept & 0x01);
	},

	//---------------------------------------------------------------------------
	// fio.dbm.openDialog()    �f�[�^�x�[�X�_�C�A���O���J�������̏���
	// fio.dbm.openHandler()   �f�[�^�x�[�X�n���h�����J��
	//---------------------------------------------------------------------------
	openDialog : function(){
		this.openHandler();
		this.update();
	},
	openHandler : function(){
		// �f�[�^�x�[�X���J��
		var type = 0;
		if     (this.DBaccept & 0x08){ type = 4;}
		else if(this.DBaccept & 0x04){ type = 3;}
		else if(this.DBaccept & 0x02){ type = 2;}
		else if(this.DBaccept & 0x01){ type = 1;}

		switch(type){
			case 1: case 2: this.dbh = new DataBaseHandler_SQL((type===2)); break;
			case 4:         this.dbh = new DataBaseHandler_LS(); break;
			default: return;
		}
		this.dbh.importDBlist(this);

		var sortlist = { idlist:"ID��", newsave:"�ۑ����V������", oldsave:"�ۑ����Â���", size:"�T�C�Y/��Փx��"};
		var str="";
		for(s in sortlist){ str += ("<option value=\""+s+"\">"+sortlist[s]+"</option>");}
		document.database.sorts.innerHTML = str;
	},

	//---------------------------------------------------------------------------
	// fio.dbm.closeDialog()   �f�[�^�x�[�X�_�C�A���O���������̏���
	// fio.dbm.clickHandler()  �t�H�[����̃{�^���������ꂽ���A�e�֐��ɃW�����v����
	//---------------------------------------------------------------------------
	closeDialog : function(){
		this.DBlist = [];
	},
	clickHandler : function(e){
		switch(ee.getSrcElement(e).name){
			case 'sorts'   : this.displayDataTableList();	// break���Ȃ��̂͂킴�Ƃł�
			case 'datalist': this.selectDataTable();   break;
			case 'tableup' : this.upDataTable_M();     break;
			case 'tabledn' : this.downDataTable_M();   break;
			case 'open'    : this.openDataTable_M();   break;
			case 'save'    : this.saveDataTable_M();   break;
			case 'comedit' : this.editComment_M();     break;
			case 'difedit' : this.editDifficult_M();   break;
			case 'del'     : this.deleteDataTable_M(); break;
		}
	},

	//---------------------------------------------------------------------------
	// fio.dbm.getDataID()  �I�𒆃f�[�^��(this.DBlist��key�ƂȂ�)ID���擾����
	// fio.dbm.update()     �Ǘ��e�[�u������_�C�A���O�̕\�����X�V����
	//---------------------------------------------------------------------------
	getDataID : function(){
		if(document.database.datalist.value!="new" && document.database.datalist.value!=""){
			for(var i=0;i<this.DBlist.length;i++){
				if(this.DBlist[i].id==document.database.datalist.value){ return i;}
			}
		}
		return -1;
	},
	update : function(){
		this.dbh.updateManageData(this);
			this.displayDataTableList();
			this.selectDataTable();
	},

	//---------------------------------------------------------------------------
	// fio.dbm.displayDataTableList() �ۑ����Ă���f�[�^�̈ꗗ��\������
	// fio.dbm.getRowString()         1�f�[�^���當����𐶐�����
	// fio.dbm.dateString()           �����̕�����𐶐�����
	//---------------------------------------------------------------------------
	displayDataTableList : function(){
			switch(document.database.sorts.value){
				case 'idlist':  this.DBlist = this.DBlist.sort(function(a,b){ return (a.id-b.id);}); break;
				case 'newsave': this.DBlist = this.DBlist.sort(function(a,b){ return (b.time-a.time || a.id-b.id);}); break;
				case 'oldsave': this.DBlist = this.DBlist.sort(function(a,b){ return (a.time-b.time || a.id-b.id);}); break;
				case 'size':    this.DBlist = this.DBlist.sort(function(a,b){ return (a.col-b.col || a.row-b.row || a.hard-b.hard || a.id-b.id);}); break;
			}

			var html = "";
			for(var i=0;i<this.DBlist.length;i++){
				var row = this.DBlist[i];
			if(!row){ continue;}//alert(i);}

			var valstr = " value=\""+row.id+"\"";
			var selstr = (this.DBsid==row.id?" selected":"");
			html += ("<option" + valstr + selstr + ">" + this.getRowString(row)+"</option>\n");
			}
			html += ("<option value=\"new\""+(this.DBsid==-1?" selected":"")+">&nbsp;&lt;�V�����ۑ�����&gt;</option>\n");
			document.database.datalist.innerHTML = html;
	},
	getRowString : function(row){
		var hardstr = [
			{ja:'�|'      , en:'-'     },
			{ja:'�炭�炭', en:'Easy'  },
			{ja:'���Ă���', en:'Normal'},
			{ja:'�����ւ�', en:'Hard'  },
			{ja:'�A�[��'  , en:'Expert'}
		];

		var str = "";
		str += ((row.id<10?"&nbsp;":"")+row.id+" :&nbsp;");
		str += (this.dateString(row.time*1000)+" &nbsp;");
		str += (""+row.col+"�~"+row.row+" &nbsp;");
		if(!!row.hard || row.hard=='0'){
			str += (hardstr[row.hard][menu.language]);
		}
		return str;
	},
	dateString : function(time){
		var ni   = function(num){ return (num<10?"0":"")+num;};
		var str  = " ";
		var date = new Date();
		date.setTime(time);

		str += (ni(date.getFullYear()%100) + "/" + ni(date.getMonth()+1) + "/" + ni(date.getDate())+" ");
		str += (ni(date.getHours()) + ":" + ni(date.getMinutes()));
		return str;
	},

	//---------------------------------------------------------------------------
	// fio.dbm.selectDataTable() �f�[�^��I�����āA�R�����g�Ȃǂ�\������
	//---------------------------------------------------------------------------
	selectDataTable : function(){
		var selected = this.getDataID();
		if(selected>=0){
			document.database.comtext.value = ""+this.DBlist[selected].comment;
			this.DBsid = parseInt(this.DBlist[selected].id);
		}
		else{
			document.database.comtext.value = "";
			this.DBsid = -1;
		}

		document.database.tableup.disabled = (document.database.sorts.value!=='idlist' || this.DBsid===-1 || this.DBsid===1);
		document.database.tabledn.disabled = (document.database.sorts.value!=='idlist' || this.DBsid===-1 || this.DBsid===this.DBlist.length);
		document.database.comedit.disabled = (this.DBsid===-1);
		document.database.difedit.disabled = (this.DBsid===-1);
		document.database.open.disabled    = (this.DBsid===-1);
		document.database.del.disabled     = (this.DBsid===-1);
	},

	//---------------------------------------------------------------------------
	// fio.dbm.upDataTable_M()      �f�[�^�̈ꗗ�ł̈ʒu���ЂƂ�ɂ���
	// fio.dbm.downDataTable_M()    �f�[�^�̈ꗗ�ł̈ʒu���ЂƂ��ɂ���
	// fio.dbm.convertDataTable_M() �f�[�^�̈ꗗ�ł̈ʒu�����ւ���
	//---------------------------------------------------------------------------
	upDataTable_M : function(){
		var selected = this.getDataID();
		if(selected===-1 || selected===0){ return;}
		this.convertDataTable_M(selected, selected-1);
	},
	downDataTable_M : function(){
		var selected = this.getDataID();
		if(selected===-1 || selected===this.DBlist.length-1){ return;}
		this.convertDataTable_M(selected, selected+1);
	},
	convertDataTable_M : function(sid, tid){
		this.DBsid = this.DBlist[tid].id;
		var row = {};
		for(var c=1;c<7;c++){ row[this.keys[c]]              = this.DBlist[sid][this.keys[c]];}
		for(var c=1;c<7;c++){ this.DBlist[sid][this.keys[c]] = this.DBlist[tid][this.keys[c]];}
		for(var c=1;c<7;c++){ this.DBlist[tid][this.keys[c]] = row[this.keys[c]];}

		this.dbh.convertDataTableID(this, sid, tid);
		this.update();
	},

	//---------------------------------------------------------------------------
	// fio.dbm.openDataTable_M()  �f�[�^�̔Ֆʂɓǂݍ���
	// fio.dbm.saveDataTable_M()  �f�[�^�̔Ֆʂ�ۑ�����
	//---------------------------------------------------------------------------
	openDataTable_M : function(){
		var id = this.getDataID(); if(id===-1){ return;}
		if(!confirm("���̃f�[�^��ǂݍ��݂܂����H (���݂̔Ֆʂ͔j������܂�)")){ return;}

		this.dbh.openDataTable(this, id);
	},
	saveDataTable_M : function(){
		var id = this.getDataID(), refresh = false;
			if(id===-1){
			id = this.DBlist.length;
			refresh = true;

			this.DBlist[id] = {};
			var str = prompt("�R�����g������ꍇ�͓��͂��Ă��������B","");
			this.DBlist[id].comment = (!!str ? str : '');
			this.DBlist[id].hard = 0;
			this.DBlist[id].id = id+1;
			this.DBsid = this.DBlist[id].id;
			}
			else{
			if(!confirm("���̃f�[�^�ɏ㏑�����܂����H")){ return;}
		}
		this.DBlist[id].col   = k.qcols;
		this.DBlist[id].row   = k.qrows;
		this.DBlist[id].time  = mf(tm.now()/1000);

		this.dbh.saveDataTable(this, id);
		this.update();
	},

	//---------------------------------------------------------------------------
	// fio.dbm.editComment_M()   �f�[�^�̃R�����g���X�V����
	// fio.dbm.editDifficult_M() �f�[�^�̓�Փx���X�V����
	//---------------------------------------------------------------------------
	editComment_M : function(){
		var id = this.getDataID(); if(id===-1){ return;}

		var str = prompt("���̖��ɑ΂���R�����g����͂��Ă��������B",this.DBlist[id].comment);
		if(str==null){ return;}

		this.DBlist[id].comment = str;
		this.dbh.updateComment(this, id);
		this.update();
	},
	editDifficult_M : function(){
		var id = this.getDataID(); if(id===-1){ return;}

		var hard = prompt("���̖��̓�Փx��ݒ肵�Ă��������B\n[0:�Ȃ� 1:�炭�炭 2:���Ă��� 3:�����ւ� 4:�A�[��]",this.DBlist[id].hard);
		if(hard==null){ return;}

		this.DBlist[id].hard = ((hard=='1'||hard=='2'||hard=='3'||hard=='4')?hard:0);
		this.dbh.updateDifficult(this, id);
		this.update();
	},

	//---------------------------------------------------------------------------
	// fio.dbm.deleteDataTable_M() �I�����Ă���Ֆʃf�[�^���폜����
	//---------------------------------------------------------------------------
	deleteDataTable_M : function(){
		var id = this.getDataID(); if(id===-1){ return;}
		if(!confirm("���̃f�[�^�����S�ɍ폜���܂����H")){ return;}

		var sID = this.DBlist[id].id, max = this.DBlist.length;
		for(var i=sID-1;i<max-1;i++){
			for(var c=1;c<7;c++){ this.DBlist[i][this.keys[c]] = this.DBlist[i+1][this.keys[c]];}
		}
		this.DBlist.pop();

		this.dbh.deleteDataTable(this, sID, max);
		this.update();
	}

	//---------------------------------------------------------------------------
	// fio.dbm.convertDataBase() ���������K�v�ɂȂ�����...
	//---------------------------------------------------------------------------
/*	convertDataBase : function(){
		// �����܂ŋ��f�[�^�x�[�X
		this.dbh.importDBlist(this);
		this.dbh.dropDataBase();

		// ��������V�f�[�^�x�[�X
		this.dbh.createDataBase();
		this.dbh.setupDBlist(this);
	}
*/
};

//---------------------------------------------------------------------------
// ��DataBaseHandler_LS�N���X Web localStorage�p �f�[�^�x�[�X�n���h��
//---------------------------------------------------------------------------
DataBaseHandler_LS = function(){
	this.pheader = 'pzprv3_' + k.puzzleid + ':puzdata';
	this.keys = fio.dbm.keys;

	this.initialize();
};
DataBaseHandler_LS.prototype = {
	//---------------------------------------------------------------------------
	// fio.dbm.dbh.initialize()    ���������Ƀf�[�^�x�[�X���J��
	// fio.dbm.dbh.importDBlist()  DataBase����DBlist���쐬����
	//---------------------------------------------------------------------------
	initialize : function(){
		this.createManageDataTable();
		this.createDataBase();
	},
	importDBlist : function(parent){
		parent.DBlist = [];
		var r=0;
		while(1){
			r++; var row = {};
			for(var c=0;c<7;c++){ row[this.keys[c]] = localStorage[this.pheader+'!'+r+'!'+this.keys[c]];}
			if(row.id==null){ break;}
			row.pdata = "";
			parent.DBlist.push(row);
		}
	},

	//---------------------------------------------------------------------------
	// fio.dbm.dbh.createManageDataTable() �Ǘ����e�[�u�����쐬����(�����͂Ȃ�)
	// fio.dbm.dbh.updateManageData()      �Ǘ���񃌃R�[�h���X�V����
	//---------------------------------------------------------------------------
	createManageDataTable : function(){
		localStorage['pzprv3_manage']        = 'DataBase';
		localStorage['pzprv3_manage:manage'] = 'Table';
	},
	updateManageData : function(parent){
		var mheader = 'pzprv3_manage:manage!'+k.puzzleid;
		localStorage[mheader+'!count'] = parent.DBlist.length;
		localStorage[mheader+'!time']  = mf(tm.now()/1000);
	},

	//---------------------------------------------------------------------------
	// fio.dbm.dbh.createDataBase()     �e�[�u�����쐬����
	//---------------------------------------------------------------------------
	createDataBase : function(){
		localStorage['pzprv3_'+k.puzzleid]            = 'DataBase';
		localStorage['pzprv3_'+k.puzzleid+':puzdata'] = 'Table';
	},

	//---------------------------------------------------------------------------
	// fio.dbm.dbh.convertDataTableID() �f�[�^��ID��t������
	//---------------------------------------------------------------------------
	convertDataTableID : function(parent, sid, tid){
		var sID = parent.DBlist[sid].id, tID = parent.DBlist[tid].id;
		var sheader=this.pheader+'!'+sID, theader=this.pheader+'!'+tID, row = {};
		for(var c=1;c<7;c++){ localStorage[sheader+'!'+this.keys[c]] = parent.DBlist[sid][this.keys[c]];}
		for(var c=1;c<7;c++){ localStorage[theader+'!'+this.keys[c]] = parent.DBlist[tid][this.keys[c]];}
	},

	//---------------------------------------------------------------------------
	// fio.dbm.dbh.openDataTable()   �f�[�^�̔Ֆʂɓǂݍ���
	// fio.dbm.dbh.saveDataTable()   �f�[�^�̔Ֆʂ�ۑ�����
	//---------------------------------------------------------------------------
	openDataTable : function(parent, id){
		var pdata = localStorage[this.pheader+'!'+parent.DBlist[id].id+'!pdata'];
		fio.filedecode(pdata);
	},
	saveDataTable : function(parent, id){
		var row = parent.DBlist[id];
		for(var c=0;c<7;c++){ localStorage[this.pheader+'!'+row.id+'!'+this.keys[c]] = (c!==4 ? row[this.keys[c]] : fio.fileencode(1));}
	},

	//---------------------------------------------------------------------------
	// fio.dbm.dbh.updateComment()   �f�[�^�̃R�����g���X�V����
	// fio.dbm.dbh.updateDifficult() �f�[�^�̓�Փx���X�V����
	//---------------------------------------------------------------------------
	updateComment : function(parent, id){
		var row = parent.DBlist[id];
		localStorage[this.pheader+'!'+row.id+'!comment'] = row.comment;
	},
	updateDifficult : function(parent, id){
		var row = parent.DBlist[id];
		localStorage[this.pheader+'!'+row.id+'!hard'] = row.hard;
	},
	//---------------------------------------------------------------------------
	// fio.dbm.dbh.deleteDataTable() �I�����Ă���Ֆʃf�[�^���폜����
	//---------------------------------------------------------------------------
	deleteDataTable : function(parent, sID, max){
		for(var i=parseInt(sID);i<max;i++){
			var headers = [this.pheader+'!'+(i+1), this.pheader+'!'+i];
			for(var c=1;c<7;c++){ localStorage[headers[1]+'!'+this.keys[c]] = localStorage[headers[0]+'!'+this.keys[c]];}
		}
		var dheader = this.pheader+'!'+max;
		for(var c=0;c<7;c++){ localStorage.removeItem(dheader+'!'+this.keys[c]);}
	}
};

//---------------------------------------------------------------------------
// ��DataBaseHandler_SQL�N���X Web SQL DataBase�p �f�[�^�x�[�X�n���h��
//---------------------------------------------------------------------------
DataBaseHandler_SQL = function(isSQLDB){
	this.db    = null;	// �p�Y���ʂ̃f�[�^�x�[�X
	this.dbmgr = null;	// pzprv3_manager�f�[�^�x�[�X
	this.isSQLDB = isSQLDB;

	this.initialize();
};
DataBaseHandler_SQL.prototype = {
	//---------------------------------------------------------------------------
	// fio.dbm.dbh.initialize()    ���������Ƀf�[�^�x�[�X���J��
	// fio.dbm.dbh.importDBlist()  DataBase����DBlist���쐬����
	// fio.dbm.dbh.setupDBlist()   DBlist�̃f�[�^��DataBase�ɑ������
	//---------------------------------------------------------------------------
	initialize : function(){
		var wrapper1 = new DataBaseObject_SQL(this.isSQLDB);
		var wrapper2 = new DataBaseObject_SQL(this.isSQLDB);

		this.dbmgr = wrapper1.openDatabase('pzprv3_manage', '1.0');
		this.db    = wrapper2.openDatabase('pzprv3_'+k.puzzleid, '1.0');

		this.createManageDataTable();
		this.createDataBase();
	},
	importDBlist : function(parent){
		parent.DBlist = [];
		this.db.transaction(
			function(tx){
				tx.executeSql('SELECT * FROM pzldata',[],function(tx,rs){
					var i=0, keys=parent.keys;
					for(var r=0;r<rs.rows.length;r++){
						parent.DBlist[i] = {};
						for(var c=0;c<7;c++){ parent.DBlist[i][keys[c]] = rs.rows.item(r)[keys[c]];}
						parent.DBlist[i].pdata = "";
						i++;
					}
				});
			},
			function(){ },
			function(){ fio.dbm.update();}
		);
	},
/*	setupDBlist : function(parent){
		for(var r=0;r<parent.DBlist.length;r++){
			this.saveDataTable(parent, r);
		}
	},
*/
	//---------------------------------------------------------------------------
	// fio.dbm.dbh.createManageDataTable() �Ǘ����e�[�u�����쐬����(�����͂Ȃ�)
	// fio.dbm.dbh.updateManageData()      �Ǘ���񃌃R�[�h���쐬�E�X�V����
	// fio.dbm.dbh.deleteManageData()      �Ǘ���񃌃R�[�h���폜����
	//---------------------------------------------------------------------------
	createManageDataTable : function(){
		this.dbmgr.transaction( function(tx){
			tx.executeSql('CREATE TABLE IF NOT EXISTS manage (puzzleid primary key,version,count,lastupdate)',[]);
		});
	},
	updateManageData : function(parent){
		var count = parent.DBlist.length;
		var time = mf(tm.now()/1000);
		this.dbmgr.transaction( function(tx){
			tx.executeSql('INSERT OR REPLACE INTO manage VALUES(?,?,?,?)', [k.puzzleid, '1.0', count, time]);
		});
	},
/*	deleteManageData : function(){
		this.dbmgr.transaction( function(tx){
			tx.executeSql('DELETE FROM manage WHERE puzzleid=?',[k.puzzleid]);
		});
	},
*/
	//---------------------------------------------------------------------------
	// fio.dbm.dbh.createDataBase()      �e�[�u�����쐬����
	// fio.dbm.dbh.dropDataBase()        �e�[�u�����폜����
	// fio.dbm.dbh.forcedeleteDataBase() �e�[�u�����폜����
	//---------------------------------------------------------------------------
	createDataBase : function(){
		this.db.transaction( function(tx){
			tx.executeSql('CREATE TABLE IF NOT EXISTS pzldata (id int primary key,col,row,hard,pdata,time,comment)',[]);
		});
	},
/*	dropDataBase : function(){
		this.db.transaction( function(tx){
			tx.executeSql('DROP TABLE IF EXISTS pzldata',[]);
		});
	},
	forceDeleteDataBase : function(parent){
		this.deleteManageData();
		this.dropDataBase();
	},*/

	//---------------------------------------------------------------------------
	// fio.dbm.dbh.convertDataTableID() �f�[�^��ID��t������
	//---------------------------------------------------------------------------
	convertDataTableID : function(parent, sid, tid){
		var sID = parent.DBlist[sid].id, tID = parent.DBlist[tid].id;
		this.db.transaction( function(tx){
			tx.executeSql('UPDATE pzldata SET id=? WHERE ID==?',[0  ,sID]);
			tx.executeSql('UPDATE pzldata SET id=? WHERE ID==?',[sID,tID]);
			tx.executeSql('UPDATE pzldata SET id=? WHERE ID==?',[tID,  0]);
		});
	},

	//---------------------------------------------------------------------------
	// fio.dbm.dbh.openDataTable()   �f�[�^�̔Ֆʂɓǂݍ���
	// fio.dbm.dbh.saveDataTable()   �f�[�^�̔Ֆʂ�ۑ�����
	//---------------------------------------------------------------------------
	openDataTable : function(parent, id){
		this.db.transaction( function(tx){
			tx.executeSql('SELECT * FROM pzldata WHERE ID==?',[parent.DBlist[id].id],
				function(tx,rs){ fio.filedecode(rs.rows.item(0)['pdata']);}
			);
		});
	},
	saveDataTable : function(parent, id){
		var row = parent.DBlist[id];
		this.db.transaction( function(tx){
			tx.executeSql('INSERT INTO pzldata VALUES(?,?,?,?,?,?,?)',[row.id,row.col,row.row,row.hard,fio.fileencode(1),row.time,row.comment]);
		});
	},

	//---------------------------------------------------------------------------
	// fio.dbm.dbh.updateComment()   �f�[�^�̃R�����g���X�V����
	// fio.dbm.dbh.updateDifficult() �f�[�^�̓�Փx���X�V����
	//---------------------------------------------------------------------------
	updateComment : function(parent, id){
		var row = parent.DBlist[id];
		this.db.transaction( function(tx){
			tx.executeSql('UPDATE pzldata SET comment=? WHERE ID==?',[row.comment, row.id]);
		});
	},
	updateDifficult : function(parent, id){
		var row = parent.DBlist[id];
		this.db.transaction( function(tx){
			tx.executeSql('UPDATE pzldata SET hard=? WHERE ID==?',[row.hard, row.id]);
		});
	},

	//---------------------------------------------------------------------------
	// fio.dbm.dbh.deleteDataTable() �I�����Ă���Ֆʃf�[�^���폜����
	//---------------------------------------------------------------------------
	deleteDataTable : function(parent, sID, max){
		this.db.transaction( function(tx){
			tx.executeSql('DELETE FROM pzldata WHERE ID==?',[sID]);
			for(var i=parseInt(sID);i<max;i++){
				tx.executeSql('UPDATE pzldata SET id=? WHERE ID==?',[i,i+1]);
			}
		});
	}
};

//---------------------------------------------------------------------------
// ��DataBaseObject_SQL�N���X  Web SQL DataBase�p �f�[�^�x�[�X�̃��b�p�[�N���X
//---------------------------------------------------------------------------
DataBaseObject_SQL = function(isSQLDB){
	this.name    = '';
	this.version = 0;
	this.isSQLDB = isSQLDB;

	this.object = null;
};
DataBaseObject_SQL.prototype = {
	openDatabase : function(name, ver){
		this.name    = name;
		this.version = ver;
		if(this.isSQLDB){
			this.object = openDatabase(this.name, this.version);
		}
		else{
			this.object = google.gears.factory.create('beta.database', this.version);
		}
		return this;
	},

	// Gears�p���b�p�[�݂����Ȃ���
	transaction : function(execfunc, errorfunc, compfunc){
		if(typeof errorfunc == 'undefined'){ errorfunc = f_true;}
		if(typeof compfunc  == 'undefined'){ compfunc  = f_true;}

		if(this.isSQLDB){
			// execfunc�̑�����tx��SQLTransaction�I�u�W�F�N�g(tx.executeSql�͉��̊֐����w���Ȃ�)
			this.object.transaction(execfunc, errorfunc, compfunc);
		}
		else{
			this.object.open(this.name);
			// execfunc�̑�����tx��this�ɂ��Ă���(tx.executeSql�͉��̊֐����w��)
			execfunc(this);
			this.object.close();

			compfunc();
		}
	},
	// Gears�p���b�p�[
	executeSql : function(statement, args, callback){
		var resultSet = this.object.execute(statement, args);
		// �ȉ���callback�p
		if(typeof callback != 'undefined'){
			var r=0, rows = {};
			rows.rowarray = [];
			while(resultSet.isValidRow()){
				var row = {};
				for(var i=0,len=resultSet.fieldCount();i<len;i++){
					row[i] = row[resultSet.fieldName(i)] = resultSet.field(i);
				}
				rows.rowarray[r] = row;
				resultSet.next();
				r++;
			}
			resultSet.close();

			rows.length = r;
			rows.item = function(r){ return this.rowarray[r];};

			var rs = {rows:rows};
			callback(this, rs);
		}
	}
};

//---------------------------------------------------------------------------
// ��AnsCheck�N���X �����`�F�b�N�֘A�̊֐�������
//---------------------------------------------------------------------------

// �񓚃`�F�b�N�N���X
// AnsCheck�N���X
AnsCheck = function(){
	this.performAsLine = false;
	this.errDisp = false;
	this.setError = true;
	this.inCheck = false;
	this.inAutoCheck = false;
	this.alstr = { jp:'' ,en:''};
};
AnsCheck.prototype = {

	//---------------------------------------------------------------------------
	// ans.check()     �����̃`�F�b�N���s��(checkAns()���Ăяo��)
	// ans.checkAns()  �����̃`�F�b�N���s��(�I�[�o�[���C�h�p)
	// ans.check1st()  �I�[�g�`�F�b�N���ɏ��߂ɔ�����s��(�I�[�o�[���C�h�p)
	// ans.setAlert()  check()����߂��Ă����Ƃ��ɕԂ��A�G���[���e��\������alert����ݒ肷��
	//---------------------------------------------------------------------------
	check : function(){
		this.inCheck = true;
		this.alstr = { jp:'' ,en:''};
		kc.keyreset();
		mv.mousereset();

		if(!this.checkAns()){
			alert((menu.isLangJP()||!this.alstr.en)?this.alstr.jp:this.alstr.en);
			this.errDisp = true;
			pc.paintAll();
			this.inCheck = false;
			return false;
		}

		alert(menu.isLangJP()?"�����ł��I":"Complete!");
		this.inCheck = false;
		return true;
	},
	checkAns : function(){},	//�I�[�o�[���C�h�p
	//check1st : function(){},	//�I�[�o�[���C�h�p
	setAlert : function(strJP, strEN){ this.alstr.jp = strJP; this.alstr.en = strEN;},

	//---------------------------------------------------------------------------
	// ans.autocheck()    �����̎����`�F�b�N���s��(alert���łȂ�������A�G���[�\�����s��Ȃ�)
	// ans.autocheck1st() autocheck�O�ɁA�y������������s��
	//
	// ans.disableSetError()  �Ֆʂ̃I�u�W�F�N�g�ɃG���[�t���O��ݒ�ł��Ȃ��悤�ɂ���
	// ans.enableSetError()   �Ֆʂ̃I�u�W�F�N�g�ɃG���[�t���O��ݒ�ł���悤�ɂ���
	// ans.isenableSetError() �Ֆʂ̃I�u�W�F�N�g�ɃG���[�t���O��ݒ�ł��邩�ǂ�����Ԃ�
	//---------------------------------------------------------------------------
	autocheck : function(){
		if(!pp.getVal('autocheck') || k.editmode || this.inCheck){ return;}

		var ret = false;

		this.inCheck = this.inAutoCheck = true;
		this.disableSetError();

		if(this.autocheck1st() && this.checkAns() && this.inCheck){
			mv.mousereset();
			alert(menu.isLangJP()?"�����ł��I":"Complete!");
			ret = true;
			pp.setVal('autocheck',false);
		}
		this.enableSetError();
		this.inCheck = this.inAutoCheck = false;

		return ret;
	},
	// �����N�n�͏d���̂ōŏ��ɒ[�_�𔻒肷��
	autocheck1st : function(){
		if(this.check1st){ return this.check1st();}
		else if( (k.isCenterLine && !ans.checkLcntCell(1)) || (k.isborderAsLine && !ans.checkLcntCross(1,0)) ){ return false;}
		return true;
	},

	disableSetError  : function(){ this.setError = false;},
	enableSetError   : function(){ this.setError = true; },
	isenableSetError : function(){ return this.setError; },

	//---------------------------------------------------------------------------
	// ans.checkdir4Cell()     �㉺���E4�����ŏ���func==true�ɂȂ�}�X�̐����J�E���g����
	// ans.setErrLareaByCell() �ЂƂȂ���ɂȂ����������݂���}�X�ɃG���[��ݒ肷��
	// ans.setErrLareaById()   �ЂƂȂ���ɂȂ����������݂���}�X�ɃG���[��ݒ肷��
	//---------------------------------------------------------------------------
	checkdir4Cell : function(cc, func){
		if(cc<0 || cc>=bd.cellmax){ return 0;}
		var cnt = 0;
		if(bd.up(cc)!=-1 && func(bd.up(cc))){ cnt++;}
		if(bd.dn(cc)!=-1 && func(bd.dn(cc))){ cnt++;}
		if(bd.lt(cc)!=-1 && func(bd.lt(cc))){ cnt++;}
		if(bd.rt(cc)!=-1 && func(bd.rt(cc))){ cnt++;}
		return cnt;
	},

	setErrLareaByCell : function(cinfo, c, val){ this.setErrLareaById(cinfo, cinfo.id[c], val); },
	setErrLareaById : function(cinfo, areaid, val){
		var blist = [];
		for(var id=0;id<bd.bdmax;id++){
			if(!bd.isLine(id)){ continue;}
			var cc1 = bd.border[id].cellcc[0], cc2 = bd.border[id].cellcc[1];
			if(cc1!=-1 && cc2!=-1 && cinfo.id[cc1]==areaid && cinfo.id[cc1]==cinfo.id[cc2]){ blist.push(id);}
		}
		bd.sErB(blist,val);

		var clist = [];
		for(var c=0;c<bd.cellmax;c++){ if(cinfo.id[c]==areaid && bd.QnC(c)!=-1){ clist.push(c);} }
		bd.sErC(clist,4);
	},

	//---------------------------------------------------------------------------
	// ans.checkAllCell()   ����func==true�ɂȂ�}�X����������G���[��ݒ肷��
	// ans.checkOneArea()   ���}�X/���}�X/�����ЂƂȂ��肩�ǂ����𔻒肷��
	// ans.check2x2Block()  2x2�̃Z�����S�ď���func==true�̎��A�G���[��ݒ肷��
	// ans.checkSideCell()  �ׂ荇����2�̃Z��������func==true�̎��A�G���[��ݒ肷��
	//---------------------------------------------------------------------------
	checkAllCell : function(func){
		var result = true;
		for(var c=0;c<bd.cellmax;c++){
			if(func(c)){
				if(this.inAutoCheck){ return false;}
				bd.sErC([c],1);
				result = false;
			}
		}
		return result;
	},
	checkOneArea : function(cinfo){
		if(cinfo.max>1){
			if(this.performAsLine){ bd.sErBAll(2); this.setErrLareaByCell(cinfo,1,1); }
			if(!this.performAsLine || k.puzzleid=="firefly"){ bd.sErC(cinfo.room[1].idlist,1);}
			return false;
		}
		return true;
	},
	check2x2Block : function(func){
		var result = true;
		for(var c=0;c<bd.cellmax;c++){
			if(bd.cell[c].bx<bd.maxbx-1 && bd.cell[c].by<bd.maxby-1){
				if( func(c) && func(c+1) && func(c+k.qcols) && func(c+k.qcols+1) ){
					if(this.inAutoCheck){ return false;}
					bd.sErC([c,c+1,c+k.qcols,c+k.qcols+1],1);
					result = false;
				}
			}
		}
		return result;
	},
	checkSideCell : function(func){
		var result = true;
		for(var c=0;c<bd.cellmax;c++){
			if(bd.cell[c].bx<bd.maxbx-1 && func(c,c+1)){
				if(this.inAutoCheck){ return false;}
				bd.sErC([c,c+1],1);
				result = false;
			}
			if(bd.cell[c].by<bd.maxby-1 && func(c,c+k.qcols)){
				if(this.inAutoCheck){ return false;}
				bd.sErC([c,c+k.qcols],1);
				result = false;
			}
		}
		return result;
	},

	//---------------------------------------------------------------------------
	// ans.checkQnumCross()  cross������func==false�̎��A�G���[��ݒ肷��
	//---------------------------------------------------------------------------
	checkQnumCross : function(func){	//func(cr,bcnt){} -> �G���[�Ȃ�false��Ԃ��֐��ɂ���
		for(var c=0;c<bd.crossmax;c++){
			if(bd.QnX(c)<0){ continue;}
			if(!func(bd.QnX(c), bd.bcntCross(c))){
				bd.sErX([c],1);
				return false;
			}
		}
		return true;
	},

	//---------------------------------------------------------------------------
	// ans.checkOneLoop()  ���������������ǂ������肷��
	// ans.checkLcntCell() �Z������o�Ă�����̖{���ɂ��Ĕ��肷��
	// ans.isLineStraight()   �Z���̏�Ő������i���Ă��邩���肷��
	// ans.setCellLineError() �Z���Ǝ���̐��ɃG���[�t���O��ݒ肷��
	//---------------------------------------------------------------------------
	checkOneLoop : function(){
		var xinfo = line.getLineInfo();
		if(xinfo.max>1){
			bd.sErBAll(2);
			bd.sErB(xinfo.room[1].idlist,1);
			return false;
		}
		return true;
	},

	checkLcntCell : function(val){
		var result = true;
		if(line.ltotal[val]==0){ return true;}
		for(var c=0;c<bd.cellmax;c++){
			if(line.lcnt[c]==val){
				if(this.inAutoCheck){ return false;}
				if(!this.performAsLine){ bd.sErC([c],1);}
				else{ if(result){ bd.sErBAll(2);} this.setCellLineError(c,true);}
				result = false;
			}
		}
		return result;
	},

	isLineStraight : function(cc){
		if     (bd.isLine(bd.ub(cc)) && bd.isLine(bd.db(cc))){ return true;}
		else if(bd.isLine(bd.lb(cc)) && bd.isLine(bd.rb(cc))){ return true;}

		return false;
	},

	setCellLineError : function(cc, flag){
		if(flag){ bd.sErC([cc],1);}
		var bx=bd.cell[cc].bx, by=bd.cell[cc].by;
		bd.sErB(bd.borderinside(bx-1,by-1,bx+1,by+1), 1);
	},

	//---------------------------------------------------------------------------
	// ans.checkdir4Border()  �Z���̎���l�����Ɏ䂩��Ă��鋫�E���̖{���𔻒肷��
	// ans.checkdir4Border1() �Z���̎���l�����Ɏ䂩��Ă��鋫�E���̖{����Ԃ�
	// ans.checkenableLineParts() '�ꕔ����������Ă���'���̕����ɁA����������Ă��邩���肷��
	//---------------------------------------------------------------------------
	checkdir4Border : function(){
		var result = true;
		for(var c=0;c<bd.cellmax;c++){
			if(bd.QnC(c)>=0 && this.checkdir4Border1(c)!=bd.QnC(c)){
				if(this.inAutoCheck){ return false;}
				bd.sErC([c],1);
				result = false;
			}
		}
		return result;
	},
	checkdir4Border1 : function(cc){
		if(cc<0 || cc>=bd.cellmax){ return 0;}
		var cnt = 0;
		var bx = bd.cell[cc].bx, by = bd.cell[cc].by;
		if( (k.isborder!==2 && by===bd.minby+1) || bd.isBorder(bd.bnum(bx  ,by-1)) ){ cnt++;}
		if( (k.isborder!==2 && by===bd.maxby-1) || bd.isBorder(bd.bnum(bx  ,by+1)) ){ cnt++;}
		if( (k.isborder!==2 && bx===bd.minbx+1) || bd.isBorder(bd.bnum(bx-1,by  )) ){ cnt++;}
		if( (k.isborder!==2 && bx===bd.maxby-1) || bd.isBorder(bd.bnum(bx+1,by  )) ){ cnt++;}
		return cnt;
	},

	checkenableLineParts : function(val){
		var result = true;
		var func = function(i){
			return ((bd.ub(i)!=-1 && bd.isLine(bd.ub(i)) && bd.isnoLPup(i)) ||
					(bd.db(i)!=-1 && bd.isLine(bd.db(i)) && bd.isnoLPdown(i)) ||
					(bd.lb(i)!=-1 && bd.isLine(bd.lb(i)) && bd.isnoLPleft(i)) ||
					(bd.rb(i)!=-1 && bd.isLine(bd.rb(i)) && bd.isnoLPright(i)) ); };
		for(var i=0;i<bd.cellmax;i++){
			if(func(i)){
				if(this.inAutoCheck){ return false;}
				bd.sErC([i],1);
				result = false;
			}
		}
		return result;
	},

	//---------------------------------------------------------------------------
	// ans.checkAllArea()    ���ׂĂ�func�𖞂����}�X�ō\�������G���A��evalfunc�𖞂������ǂ������肷��
	//
	// ans.checkDisconnectLine() �����ȂǂɌq�����Ă��Ȃ����̔�����s��
	// ans.checkNumberAndSize()  �G���A�ɂ��鐔���Ɩʐς������������肷��
	// ans.checkNoNumber()       �����ɐ������܂܂�Ă��Ȃ����̔�����s��
	// ans.checkDoubleNumber()   �����ɐ�����2�ȏ�܂܂�Ă��Ȃ��悤�ɔ�����s��
	// ans.checkTripleNumber()   �����ɐ�����3�ȏ�܂܂�Ă��Ȃ��悤�ɔ�����s��
	// ans.checkBlackCellCount() �̈���̐����ƍ��}�X�̐��������������肷��
	// ans.checkBlackCellInArea()�����ɂ��鍕�}�X�̐��̔�����s��
	// ans.checkAreaRect()       �̈悪�S�Ďl�p�`�ł��邩�ǂ������肷��
	// ans.checkLinesInArea()    �̈�̒��Ő����ʂ��Ă���Z���̐��𔻒肷��
	// ans.checkNoObjectInRoom() �G���A�Ɏw�肳�ꂽ�I�u�W�F�N�g���Ȃ��Ɣ��肷��
	//
	// ans.getQnumCellInArea() �����̒��ň�ԍ���ɂ��鐔����Ԃ�
	// ans.getSizeOfClist()    �w�肳�ꂽCell�̃��X�g�̏㉺���E�̒[�ƁA���̒��ŏ���func�𖞂����Z���̐���Ԃ�
	//---------------------------------------------------------------------------
	checkAllArea : function(cinfo, func, evalfunc){
		var result = true;
		for(var id=1;id<=cinfo.max;id++){
			var d = this.getSizeOfClist(cinfo.room[id].idlist,func);
			var n = bd.QnC(k.roomNumber ? area.getTopOfRoomByCell(cinfo.room[id].idlist[0])
										: this.getQnumCellOfClist(cinfo.room[id].idlist));
			if( !evalfunc(d.cols, d.rows, d.cnt, n) ){
				if(this.inAutoCheck){ return false;}
				if(this.performAsLine){ if(result){ bd.sErBAll(2);} this.setErrLareaById(cinfo,id,1);}
				else{ bd.sErC(cinfo.room[id].idlist,(k.puzzleid!="tateyoko"?1:4));}
				result = false;
			}
		}
		return result;
	},

	checkDisconnectLine  : function(cinfo){ return this.checkAllArea(cinfo, bd.isNum,   function(w,h,a,n){ return (n!=-1 || a>0); } );},
	checkNumberAndSize   : function(cinfo){ return this.checkAllArea(cinfo, f_true,     function(w,h,a,n){ return (n<= 0 || n==a);} );},

	checkNoNumber        : function(cinfo){ return this.checkAllArea(cinfo, bd.isNum,   function(w,h,a,n){ return (a!=0);}          );},
	checkDoubleNumber    : function(cinfo){ return this.checkAllArea(cinfo, bd.isNum,   function(w,h,a,n){ return (a< 2);}          );},
	checkTripleNumber    : function(cinfo){ return this.checkAllArea(cinfo, bd.isNum,   function(w,h,a,n){ return (a< 3);}          );},

	checkBlackCellCount  : function(cinfo)          { return this.checkAllArea(cinfo, bd.isBlack, function(w,h,a,n){ return (n<0 || n==a);} );},
	checkBlackCellInArea : function(cinfo, evalfunc){ return this.checkAllArea(cinfo, bd.isBlack, function(w,h,a,n){ return evalfunc(a);}     );},
	checkAreaRect        : function(cinfo)          { return this.checkAllArea(cinfo, f_true,     function(w,h,a,n){ return (w*h==a)});},

	checkLinesInArea     : function(cinfo, evalfunc){ return this.checkAllArea(cinfo, function(c){ return line.lcnt[c]>0;}, evalfunc);},
	checkNoObjectInRoom  : function(cinfo, getvalue){ return this.checkAllArea(cinfo, function(c){ return getvalue(c)!=-1;}, function(w,h,a,n){ return (a!=0);});},

	getQnumCellOfClist : function(clist){
		for(var i=0,len=clist.length;i<len;i++){
			if(bd.QnC(clist[i])!=-1){ return clist[i];}
		}
		return -1;
	},
	getSizeOfClist : function(clist, func){
		var d = { x1:bd.maxbx+1, x2:bd.minbx-1, y1:bd.maxby+1, y2:bd.minby-1, cols:0, rows:0, cnt:0 };
		for(var i=0;i<clist.length;i++){
			if(d.x1>bd.cell[clist[i]].bx){ d.x1=bd.cell[clist[i]].bx;}
			if(d.x2<bd.cell[clist[i]].bx){ d.x2=bd.cell[clist[i]].bx;}
			if(d.y1>bd.cell[clist[i]].by){ d.y1=bd.cell[clist[i]].by;}
			if(d.y2<bd.cell[clist[i]].by){ d.y2=bd.cell[clist[i]].by;}
			if(func(clist[i])){ d.cnt++;}
		}
		d.cols = (d.x2-d.x1+2)/2;
		d.rows = (d.y2-d.y1+2)/2;
		return d;
	},

	//---------------------------------------------------------------------------
	// ans.checkSideAreaSize()     ���E�����͂���Őڂ��镔����getval�œ�����T�C�Y���قȂ邱�Ƃ𔻒肷��
	// ans.checkSideAreaCell()     ���E�����͂���Ń^�e���R�ɐڂ���Z���̔�����s��
	// ans.checkSeqBlocksInRoom()  �����̒�����ŁA���}�X���ЂƂȂ��肩�ǂ������肷��
	// ans.checkSameObjectInRoom() �����̒���getvalue�ŕ�����ނ̒l�������邱�Ƃ𔻒肷��
	// ans.checkObjectRoom()       getvalue�œ����l��������Z�����A�����̕����̕��U���Ă��邩���肷��
	//---------------------------------------------------------------------------
	checkSideAreaSize : function(rinfo, getval){
		var adjs = [];
		for(var r=1;r<=rinfo.max-1;r++){
			adjs[r] = [];
			for(var s=r+1;s<=rinfo.max;s++){ adjs[r][s]=0;}
		}

		for(var id=0;id<bd.bdmax;id++){
			if(!bd.isBorder(id)){ continue;}
			var cc1 = bd.border[id].cellcc[0], cc2 = bd.border[id].cellcc[1];
			if(cc1==-1 || cc2==-1){ continue;}
			var r1=rinfo.id[cc1], r2=rinfo.id[cc2];
			try{
				if(r1<r2){ adjs[r1][r2]++;}
				if(r1>r2){ adjs[r2][r1]++;}
			}catch(e){ alert([r1,r2]); throw 0;}
		}

		for(var r=1;r<=rinfo.max-1;r++){
			for(var s=r+1;s<=rinfo.max;s++){
				if(adjs[r][s]==0){ continue;}
				var a1=getval(rinfo,r), a2=getval(rinfo,s);
				if(a1>0 && a2>0 && a1==a2){
					bd.sErC(rinfo.room[r].idlist,1);
					bd.sErC(rinfo.room[s].idlist,1);
					return false;
				}
			}
		}

		return true;
	},

	checkSideAreaCell : function(rinfo, func, flag){
		for(var id=0;id<bd.bdmax;id++){
			if(!bd.isBorder(id)){ continue;}
			var cc1 = bd.border[id].cellcc[0], cc2 = bd.border[id].cellcc[1];
			if(cc1!=-1 && cc2!=-1 && func(cc1, cc2)){
				if(!flag){ bd.sErC([cc1,cc2],1);}
				else{ bd.sErC(area.room[area.room.id[cc1]].clist,1); bd.sErC(area.room[area.room.id[cc2]].clist,1); }
				return false;
			}
		}
		return true;
	},

	checkSeqBlocksInRoom : function(){
		var result = true;
		for(var id=1;id<=area.room.max;id++){
			var data = {max:0,id:[]};
			for(var c=0;c<bd.cellmax;c++){ data.id[c] = ((area.room.id[c]==id && bd.isBlack(c))?0:-1);}
			for(var c=0;c<bd.cellmax;c++){
				if(data.id[c]!=0){ continue;}
				data.max++;
				data[data.max] = {clist:[]};
				area.sc0(c, data);
			}
			if(data.max>1){
				if(this.inAutoCheck){ return false;}
				bd.sErC(area.room[id].clist,1);
				result = false;
			}
		}
		return result;
	},

	checkSameObjectInRoom : function(rinfo, getvalue){
		var result = true;
		var d = [];
		for(var i=1;i<=rinfo.max;i++){ d[i]=-1;}
		for(var c=0;c<bd.cellmax;c++){
			if(rinfo.id[c]==-1 || getvalue(c)==-1){ continue;}
			if(d[rinfo.id[c]]==-1 && getvalue(c)!=-1){ d[rinfo.id[c]] = getvalue(c);}
			else if(d[rinfo.id[c]]!=getvalue(c)){
				if(this.inAutoCheck){ return false;}

				if(this.performAsLine){ bd.sErBAll(2); this.setErrLareaByCell(rinfo,c,1);}
				else{ bd.sErC(rinfo.room[rinfo.id[c]].idlist,1);}
				if(k.puzzleid=="kaero"){
					for(var cc=0;cc<bd.cellmax;cc++){
						if(rinfo.id[c]==rinfo.id[cc] && this.getBeforeCell(cc)!=-1 && rinfo.id[c]!=rinfo.id[this.getBeforeCell(cc)]){
							bd.sErC([this.getBeforeCell(cc)],4);
						}
					}
				}
				result = false;
			}
		}
		return result;
	},
	checkObjectRoom : function(rinfo, getvalue){
		var d = [];
		var dmax = 0;
		for(var c=0;c<bd.cellmax;c++){ if(dmax<getvalue(c)){ dmax=getvalue(c);} }
		for(var i=0;i<=dmax;i++){ d[i]=-1;}
		for(var c=0;c<bd.cellmax;c++){
			if(getvalue(c)==-1){ continue;}
			if(d[getvalue(c)]==-1){ d[getvalue(c)] = rinfo.id[c];}
			else if(d[getvalue(c)]!=rinfo.id[c]){
				var clist = [];
				for(var cc=0;cc<bd.cellmax;cc++){
					if(k.puzzleid=="kaero"){ if(getvalue(c)==bd.QnC(cc)){ clist.push(cc);}}
					else{ if(rinfo.id[c]==rinfo.id[cc] || d[getvalue(c)]==rinfo.id[cc]){ clist.push(cc);} }
				}
				bd.sErC(clist,1);
				return false;
			}
		}
		return true;
	},

	//---------------------------------------------------------------------------
	// ans.checkRowsCols()            �^�e��E���R��̐����̔�����s��
	// ans.checkRowsColsPartly()      ���}�X��[�_]���ŕ������^�e��E���R��̐����̔�����s��
	// ans.checkDifferentNumberInRoom() �����̒��ɓ������������݂��邩���肷��
	// ans.isDifferentNumberInClist() clist�̒��ɓ������������݂��邩���肷��
	//---------------------------------------------------------------------------
	checkRowsCols : function(evalfunc, numfunc){
		var result = true;
		for(var by=1;by<=bd.maxby;by+=2){
			var clist = bd.cellinside(bd.minbx+1,by,bd.maxbx-1,by);
			if(!evalfunc.apply(this,[clist, numfunc])){
				if(this.inAutoCheck){ return false;}
				result = false;
			}
		}
		for(var bx=1;bx<=bd.maxbx;bx+=2){
			var clist = bd.cellinside(bx,bd.minby+1,bx,bd.maxby-1);
			if(!evalfunc.apply(this,[clist, numfunc])){
				if(this.inAutoCheck){ return false;}
				result = false;
			}
		}
		return result;
	},
	checkRowsColsPartly : function(evalfunc, areainfo, termfunc, multierr){
		var result = true;
		for(var by=1;by<=bd.maxby;by+=2){
			var bx=1;
			while(bx<=bd.maxbx){
				for(var tx=bx;tx<=bd.maxbx;tx+=2){ if(termfunc.apply(this,[bd.cnum(tx,by)])){ break;}}
				var clist = bd.cellinside(bx,by,tx-2,by);
				var total = (k.isexcell!==1 ? 0 : (bx===1 ? bd.QnE(bd.exnum(-1,by)) : bd.QnC(bd.cnum(bx-2,by))));

				if(!evalfunc.apply(this,[total, [bx-2,by], clist, areainfo])){
					if(!multierr || this.inAutoCheck){ return false;}
					result = false;
				}
				bx = tx+2;
			}
		}
		for(var bx=1;bx<=bd.maxbx;bx+=2){
			var by=1;
			while(by<=bd.maxby){
				for(var ty=by;ty<=bd.maxby;ty+=2){ if(termfunc.apply(this,[bd.cnum(bx,ty)])){ break;}}
				var clist = bd.cellinside(bx,by,bx,ty-2);
				var total = (k.isexcell!==1 ? 0 : (by===1 ? bd.DiE(bd.exnum(bx,-1)) : bd.DiC(bd.cnum(bx,by-2))));

				if(!evalfunc.apply(this,[total, [bx,by-2], clist, areainfo])){
					if(!multierr || this.inAutoCheck){ return false;}
					result = false;
				}
				by = ty+2;
			}
		}
		return result;
	},

	checkDifferentNumberInRoom : function(rinfo, numfunc){
		var result = true;
		for(var id=1;id<=rinfo.max;id++){
			if(!this.isDifferentNumberInClist(rinfo.room[id].idlist, numfunc)){
				if(this.inAutoCheck){ return false;}
				bd.sErC(rinfo.room[id].idlist,1);
				result = false;
			}
		}
		return result;
	},
	isDifferentNumberInClist : function(clist, numfunc){
		var result = true, d = [], num = [], bottom = (k.dispzero?1:0);
		for(var n=bottom,max=bd.nummaxfunc(clist[0]);n<=max;n++){ d[n]=0;}
		for(var i=0;i<clist.length;i++){ num[clist[i]] = numfunc.apply(bd,[clist[i]]);}

		for(var i=0;i<clist.length;i++){ if(num[clist[i]]>=bottom){ d[num[clist[i]]]++;} }
		for(var i=0;i<clist.length;i++){
			if(num[clist[i]]>=bottom && d[num[clist[i]]]>=2){ bd.sErC([clist[i]],1); result = false;}
		}
		return result;
	},

	//---------------------------------------------------------------------------
	// ans.checkLcntCross()      �����_�Ƃ̎���l�����̋��E���̐��𔻒肷��(bp==1:���_���ł���Ă���ꍇ)
	// ans.setCrossBorderError() �����_�Ƃ��̎���l�����ɃG���[�t���O��ݒ肷��
	//---------------------------------------------------------------------------
	checkLcntCross : function(val, bp){
		var result = true;
		for(var by=0;by<=bd.maxby;by+=2){
			for(var bx=0;bx<=bd.maxbx;bx+=2){
				if(k.iscross===1 && (bx===bd.minbx||by===bd.minby||bx===bd.maxbx||by===bd.maxby)){ continue;}
				var id = (bx>>1)+(by>>1)*(k.qcols+1);
				var lcnts = (!k.isborderAsLine?area.lcnt[id]:line.lcnt[id]);
				if(lcnts==val && (bp==0 || (bp==1&&bd.QnX(bd.xnum(bx,by))==1) || (bp==2&&bd.QnX(bd.xnum(bx,by))!=1) )){
					if(this.inAutoCheck){ return false;}
					if(result){ bd.sErBAll(2);}
					this.setCrossBorderError(bx,by);
					result = false;
				}
			}
		}
		return result;
	},
	setCrossBorderError : function(bx,by){
		if(k.iscross!==0){ bd.sErX([bd.xnum(bx,by)], 1);}
		bd.sErB(bd.borderinside(bx-1,by-1,bx+1,by+1), 1);
	}
};

//---------------------------------------------------------------------------
// ��OperationManager�N���X ������������AUndo/Redo�̓������������
//---------------------------------------------------------------------------
// ���͏��Ǘ��N���X
// Operation�N���X
Operation = function(obj, property, id, old, num){
	this.obj = obj;
	this.property = property;
	this.id = id;
	this.old = old;
	this.num = num;
	this.chain = um.chainflag;
};

// OperationManager�N���X
OperationManager = function(){
	this.ope = [];			// Operation�N���X��ێ�����z��
	this.current = 0;		// ���݂̕\������ԍ���ێ�����
	this.disrec = 0;		// ���̃N���X����̌Ăяo������1�ɂ���
	this.disinfo = 0;		// LineManager, AreaManager���Ăяo���Ȃ��悤�ɂ���
	this.chainflag = 0;		// �O��Operation�Ƃ������āA����Undo/Redo�ŕω��ł���悤�ɂ���
	this.disCombine = 0;	// �������������Ă��܂��̂ŁA������ꎞ�I�ɖ����ɂ��邽�߂̃t���O

	this.anscount = 0;			// �⏕�ȊO�̑��삪�s��ꂽ����ێ�����(autocheck�p)
	this.changeflag = false;	// ���삪�s��ꂽ��true�ɂ���(mv.notInputted()�p)

	this.undoExec = false;		// Undo��
	this.redoExec = false;		// Redo��
	this.reqReset = false;		// Undo/Redo���ɔՖʉ�]���������Ă������Aresize,resetInfo�֐���call��v������
	this.range = { x1:bd.maxbx+1, y1:bd.maxby+1, x2:bd.minbx-1, y2:bd.minby-1};
};
OperationManager.prototype = {
	//---------------------------------------------------------------------------
	// um.disableRecord()  ����̓o�^���֎~����
	// um.enableRecord()   ����̓o�^��������
	// um.isenableRecord() ����̓o�^�ł��邩��Ԃ�
	// um.enb_btn()        html���[��][�i]�{�^�����������Ƃ��\���ݒ肷��
	// um.allerase()       �L�����Ă��������S�Ĕj������
	// um.newOperation()   �}�E�X�A�L�[���͊J�n���ɌĂяo��
	//---------------------------------------------------------------------------

	// �����̊֐��Ń��R�[�h�֎~�ɂȂ�̂́AUndoRedo���AURLdecode�Afileopen�AadjustGeneral/Special��
	// �A�����Ď��s���Ȃ��Ȃ�̂�addOpe()�ƁALineInfo/AreaInfo�̒��g.
	//  -> �����Ŏg���Ă���Undo/Redo��addOpe�ȊO��bd.QuC�n�֐����g�p���Ȃ��悤�ɕύX
	//     �ςȐ����������Ȃ��Ȃ邵�A���쑬�x�ɂ����Ȃ��������
	disableRecord : function(){ this.disrec++; },
	enableRecord  : function(){ if(this.disrec>0){ this.disrec--;} },
	isenableRecord : function(){ return (this.disrec==0);},

	disableInfo : function(){ this.disinfo++; },
	enableInfo  : function(){ if(this.disinfo>0){ this.disinfo--;} },
	isenableInfo : function(){ return (this.disinfo==0);},

	enb_btn : function(){
		ee('btnundo').el.disabled = ((!this.ope.length || this.current==0)               ? 'true' : '');
		ee('btnredo').el.disabled = ((!this.ope.length || this.current==this.ope.length) ? 'true' : '');
	},
	allerase : function(){
		for(var i=this.ope.length-1;i>=0;i--){ this.ope.pop();}
		this.current  = 0;
		this.anscount = 0;
		this.enb_btn();
	},
	newOperation : function(flag){	// �L�[�A�{�^���������n�߂��Ƃ���true
		this.chainflag = 0;
		if(flag){ this.changeflag = false;}
	},

	//---------------------------------------------------------------------------
	// um.addOpe() �w�肳�ꂽ�����ǉ�����Bid���������ꍇ�͍ŏI�����ύX����
	// um.addObj() �w�肳�ꂽ�I�u�W�F�N�g�𑀍�Ƃ��Ēǉ�����
	//---------------------------------------------------------------------------
	addOpe : function(obj, property, id, old, num){
		if(!this.isenableRecord()){ return;}
		else if(old==num && obj!==k.BOARD){ return;}

		var lastid = this.ope.length-1;

		if(this.current < this.ope.length){
			for(var i=this.ope.length-1;i>=this.current;i--){ this.ope.pop();}
			lastid = -1;
		}

		// �O��Ɠ����ꏊ�Ȃ�O��̍X�V�̂�
		if(lastid>=0 && this.ope[lastid].obj == obj && this.ope[lastid].property == property && this.ope[lastid].id == id && this.ope[lastid].num == old
			&& this.disCombine==0 && ( (obj == k.CELL && ( property==k.QNUM || (property==k.QANS && k.isAnsNumber) )) || obj == k.CROSS)
		)
		{
			this.ope[lastid].num = num;
		}
		else{
			this.ope.push(new Operation(obj, property, id, old, num));
			this.current++;
			if(this.chainflag==0){ this.chainflag = 1;}
		}

		if(property!=k.QSUB){ this.anscount++;}
		this.changeflag = true;
		this.enb_btn();
	},
	addObj : function(type, id){
		var old, obj;
		if     (type==k.CELL)  { old = new Cell();   obj = bd.cell[id];  }
		else if(type==k.CROSS) { old = new Cross();  obj = bd.cross[id]; }
		else if(type==k.BORDER){ old = new Border(); obj = bd.border[id];}
		else if(type==k.EXCELL){ old = new Cell();   obj = bd.excell[id];}
		for(var i in obj){ old[i] = obj[i];}
		this.addOpe(type, type, id, old, null);
	},

	//---------------------------------------------------------------------------
	// um.undo()  Undo�����s����
	// um.redo()  Redo�����s����
	// um.postproc() Undo/Redo���s��̏������s��
	// um.exec()  ����ope�𔽉f����Bundo(),redo()��������I�ɌĂ΂��
	//---------------------------------------------------------------------------
	undo : function(){
		if(this.current==0){ return;}
		this.undoExec = true;
		this.range = { x1:bd.maxbx+1, y1:bd.maxby+1, x2:bd.minbx-1, y2:bd.minby-1};
		this.disableRecord();

		while(this.current>0){
			var ope = this.ope[this.current-1];

			this.exec(ope, ope.old);
			if(ope.property!=k.QSUB){ this.anscount--;}
			this.current--;

			if(!this.ope[this.current].chain){ break;}
		}

		this.postproc();
		this.undoExec = false;
		if(this.current==0){ kc.inUNDO=false;}
	},
	redo : function(){
		if(this.current==this.ope.length){ return;}
		this.redoExec = true;
		this.range = { x1:bd.maxbx+1, y1:bd.maxby+1, x2:bd.minbx-1, y2:bd.minby-1};
		this.disableRecord();

		while(this.current<this.ope.length){
			var ope = this.ope[this.current];

			this.exec(ope, ope.num);
			if(ope.property!=k.QSUB){ this.anscount++;}
			this.current++;

			if(this.current<this.ope.length && !this.ope[this.current].chain){ break;}
		}

		this.postproc();
		this.redoExec = false;
		if(this.ope.length==0){ kc.inREDO=false;}
	},
	postproc : function(){
		if(this.reqReset){
			this.reqReset=false;

			bd.setposAll();
			bd.setminmax();
			base.resetInfo(false);
			base.resize_canvas();
		}
		else{
			pc.paintRange(this.range.x1, this.range.y1, this.range.x2, this.range.y2);
		}
		this.enableRecord();
		this.enableInfo();
		this.enb_btn();
	},
	exec : function(ope, num){
		var pp = ope.property;
		if(ope.obj == k.CELL){
			if     (pp == k.QUES){ bd.sQuC(ope.id, num);}
			else if(pp == k.QNUM){ bd.sQnC(ope.id, num);}
			else if(pp == k.DIREC){ bd.sDiC(ope.id, num);}
			else if(pp == k.QANS){ bd.sQaC(ope.id, num);}
			else if(pp == k.QSUB){ bd.sQsC(ope.id, num);}
			else if(pp == k.CELL && !!num){ bd.cell[ope.id] = num;}
			this.paintStack(bd.cell[ope.id].bx-1, bd.cell[ope.id].by-1, bd.cell[ope.id].bx+1, bd.cell[ope.id].by+1);
		}
		else if(ope.obj == k.EXCELL){
			if     (pp == k.QNUM){ bd.sQnE(ope.id, num);}
			else if(pp == k.DIREC){ bd.sDiE(ope.id, num);}
			else if(pp == k.EXCELL && !!num){ bd.excell[ope.id] = num;}
		}
		else if(ope.obj == k.CROSS){
			if     (pp == k.QUES){ bd.sQuX(ope.id, num);}
			else if(pp == k.QNUM){ bd.sQnX(ope.id, num);}
			else if(pp == k.CROSS && !!num){ bd.cross[ope.id] = num;}
			this.paintStack(bd.cross[ope.id].bx-1, bd.cross[ope.id].by-1, bd.cross[ope.id].bx+1, bd.cross[ope.id].by+1);
		}
		else if(ope.obj == k.BORDER){
			if     (pp == k.QUES){ bd.sQuB(ope.id, num);}
			else if(pp == k.QNUM){ bd.sQnB(ope.id, num);}
			else if(pp == k.QANS){ bd.sQaB(ope.id, num);}
			else if(pp == k.QSUB){ bd.sQsB(ope.id, num);}
			else if(pp == k.LINE){ bd.sLiB(ope.id, num);}
			else if(pp == k.BORDER && !!num){ bd.border[ope.id] = num;}
			this.paintBorder(ope.id);
		}
		else if(ope.obj == k.BOARD){
			var d = {x1:0, y1:0, x2:2*k.qcols, y2:2*k.qrows};

			this.disableInfo();
			if(num & menu.ex.TURNFLIP){ menu.ex.turnflip    (num,d);}
			else                      { menu.ex.expandreduce(num,d);}

			this.range = {x1:bd.minbx,y1:bd.minby,x2:bd.maxbx,y2:bd.maxby};
			this.reqReset = true;
		}
	},
	//---------------------------------------------------------------------------
	// um.paintBorder()  Border�̎����`�悷�邽�߁A�ǂ͈̔͂܂ŕύX�����������L�����Ă���
	// um.paintStack()   �ύX���������͈͂�Ԃ�
	//---------------------------------------------------------------------------
	paintBorder : function(id){
		if(isNaN(id) || !bd.border[id]){ return;}
		if(bd.border[id].bx&1){
			this.paintStack(bd.border[id].bx-2, bd.border[id].by-1, bd.border[id].bx+2, bd.border[id].by+1);
		}
		else{
			this.paintStack(bd.border[id].bx-1, bd.border[id].by-2, bd.border[id].bx+1, bd.border[id].by+2);
		}
	},
	paintStack : function(x1,y1,x2,y2){
		if(this.range.x1 > x1){ this.range.x1 = x1;}
		if(this.range.y1 > y1){ this.range.y1 = y1;}
		if(this.range.x2 < x2){ this.range.x2 = x2;}
		if(this.range.y2 < y2){ this.range.y2 = y2;}
	}
};

//---------------------------------------------------------------------------
// ��Menu�N���X [�t�@�C��]���̃��j���[�̓����ݒ肷��
//---------------------------------------------------------------------------
Caption = function(){
	this.menu     = '';
	this.label    = '';
};
MenuData = function(strJP, strEN){
	this.caption = { ja: strJP, en: strEN};
	this.smenus = [];
};

// ���j���[�`��/�擾/html�\���n
// Menu�N���X
Menu = function(){
	this.dispfloat  = [];			// ���ݕ\�����Ă���t���[�g���j���[�E�B���h�E(�I�u�W�F�N�g)
	this.floatpanel = [];			// (2�i�ڊ܂�)�t���[�g���j���[�I�u�W�F�N�g�̃��X�g
	this.pop        = "";			// ���ݕ\�����Ă���|�b�v�A�b�v�E�B���h�E(�I�u�W�F�N�g)

	this.movingpop  = "";			// �ړ����̃|�b�v�A�b�v���j���[
	this.offset = new Pos(0, 0);	// �|�b�v�A�b�v�E�B���h�E�̍��ォ��̈ʒu

	this.btnstack   = [];			// �{�^���̏��(idname�ƕ�����̃��X�g)
	this.labelstack = [];			// span���̕�����̏��(idname�ƕ�����̃��X�g)

	this.ex = new MenuExec();
	this.ex.init();

	this.language = 'ja';

	this.ispencilbox = (k.isKanpenExist && (k.puzzleid!=="nanro" && k.puzzleid!=="ayeheya" && k.puzzleid!=="kurochute"));

	// ElementTemplate : ���j���[�̈�
	var menu_funcs = {mouseover : ee.ebinder(this, this.menuhover), mouseout  : ee.ebinder(this, this.menuout)};
	this.EL_MENU  = ee.addTemplate('menupanel','li', {className:'menu'}, null, menu_funcs);

	// ElementTemplate : �t���[�g���j���[
	var float_funcs = {mouseout:ee.ebinder(this, this.floatmenuout)};
	this.EL_FLOAT = ee.addTemplate('float_parent','menu', {className:'floatmenu'}, {backgroundColor:base.floatbgcolor}, float_funcs);

	// ElementTemplate : �t���[�g���j���[(���g)
	var smenu_funcs  = {mouseover: ee.ebinder(this, this.submenuhover), mouseout: ee.ebinder(this, this.submenuout), click:ee.ebinder(this, this.submenuclick)};
	var select_funcs = {mouseover: ee.ebinder(this, this.submenuhover), mouseout: ee.ebinder(this, this.submenuout)};
	this.EL_SMENU    = ee.addTemplate('','li', {className:'smenu'}, null, smenu_funcs);
	this.EL_SPARENT  = ee.addTemplate('','li', {className:'smenu'}, null, select_funcs);
	this.EL_SELECT   = ee.addTemplate('','li', {className:'smenu'}, {fontWeight :'900', fontSize:'10pt'}, select_funcs);
	this.EL_SEPARATE = ee.addTemplate('','li', {className:'smenusep', innerHTML:'&nbsp;'}, null, null);
	this.EL_CHECK    = ee.addTemplate('','li', {className:'smenu'}, {paddingLeft:'6pt', fontSize:'10pt'}, smenu_funcs);
	this.EL_LABEL    = ee.addTemplate('','li', {className:'smenulabel'}, null, null);
	this.EL_CHILD = this.EL_CHECK;

	// ElementTemplate : �Ǘ��̈�
	this.EL_DIVPACK  = ee.addTemplate('','div',  null, null, null);
	this.EL_SPAN     = ee.addTemplate('','span', {unselectable:'on'}, null, null);
	this.EL_CHECKBOX = ee.addTemplate('','input',{type:'checkbox', check:''}, null, {click:ee.ebinder(this, this.checkclick)});
	this.EL_SELCHILD = ee.addTemplate('','div',  {className:'flag',unselectable:'on'}, null, {click:ee.ebinder(this, this.selectclick)});

	// ElementTemplate : �{�^��
	this.EL_BUTTON = ee.addTemplate('','input', {type:'button'}, null, null);
	this.EL_UBUTTON = ee.addTemplate('btnarea','input', {type:'button'}, null, null);
};
Menu.prototype = {
	//---------------------------------------------------------------------------
	// menu.menuinit()   ���j���[�A�T�u���j���[�A�t���[�g���j���[�A�{�^���A
	//                   �Ǘ��̈�A�|�b�v�A�b�v���j���[�̏����ݒ���s��
	// menu.menureset()  ���j���[�p�̐ݒ����������
	//
	// menu.addButtons() �{�^���̏���ϐ��ɓo�^����
	// menu.addLabels()  ���x���̏���ϐ��ɓo�^����
	//---------------------------------------------------------------------------
	menuinit : function(){
		this.menuarea();
		this.managearea();
		this.poparea();

		this.displayAll();
	},

	menureset : function(){
		this.dispfloat  = [];
		this.floatpanel = [];
		this.pop        = "";
		this.btnstack   = [];
		this.labelstack = [];
		this.managestack = [];

		this.popclose();
		this.menuclear();
		this.floatmenuclose(0);

		ee('float_parent').el.innerHTML = '';

		if(!!ee('btncolor2')){ ee('btncolor2').remove();}
		ee('btnarea').el.innerHTML = '';

		ee('urlbuttonarea').el.innerHTML = '';

		ee('menupanel') .el.innerHTML = '';
		ee('usepanel')  .el.innerHTML = '';
		ee('checkpanel').el.innerHTML = '';

		pp.reset();
	},

	addButtons : function(el, func, strJP, strEN){
		if(!!func) el.onclick = func;
		ee(el).unselectable();
		this.btnstack.push({el:el, str:{ja:strJP, en:strEN}});
	},
	addLabels  : function(el, strJP, strEN){
		this.labelstack.push({el:el, str:{ja:strJP, en:strEN}});
	},

	//---------------------------------------------------------------------------
	// menu.displayAll() �S�Ẵ��j���[�A�{�^���A���x���ɑ΂��ĕ������ݒ肷��
	// menu.setdisplay() �Ǘ��p�l���ƃT�u���j���[�ɕ\�����镶������ʂɐݒ肷��
	//---------------------------------------------------------------------------
	displayAll : function(){
		for(var i in pp.flags){ this.setdisplay(i);}
		for(var i=0,len=this.btnstack.length;i<len;i++){
			if(!this.btnstack[i].el){ continue;}
			this.btnstack[i].el.value = this.btnstack[i].str[menu.language];
		}
		for(var i=0,len=this.labelstack.length;i<len;i++){
			if(!this.labelstack[i].el){ continue;}
			this.labelstack[i].el.innerHTML = this.labelstack[i].str[menu.language];
		}
	},
	setdisplay : function(idname){
		switch(pp.type(idname)){
		case pp.MENU:
			var menu = ee('ms_'+idname);
			if(!!menu){ menu.el.innerHTML = "["+pp.getMenuStr(idname)+"]";}
			break;

		case pp.SMENU: case pp.LABEL: case pp.SPARENT:
			var smenu = ee('ms_'+idname);
			if(!!smenu){ smenu.el.innerHTML = pp.getMenuStr(idname);}
			break;

		case pp.SELECT:
			var smenu = ee('ms_'+idname), label = ee('cl_'+idname);
			if(!!smenu){ smenu.el.innerHTML = "&nbsp;"+pp.getMenuStr(idname);}	// ���j���[��̕\�L�̐ݒ�
			if(!!label){ label.el.innerHTML = pp.getLabel(idname);}			// �Ǘ��̈��̕\�L�̐ݒ�
			for(var i=0,len=pp.flags[idname].child.length;i<len;i++){ this.setdisplay(""+idname+"_"+pp.flags[idname].child[i]);}
			break;

		case pp.CHILD:
			var smenu = ee('ms_'+idname), manage = ee('up_'+idname);
			var issel = (pp.getVal(idname) == pp.getVal(pp.flags[idname].parent));
			var cap = pp.getMenuStr(idname);
			if(!!smenu){ smenu.el.innerHTML = (issel?"+":"&nbsp;")+cap;}	// ���j���[�̍���
			if(!!manage){													// �Ǘ��̈�̍���
				manage.el.innerHTML = cap;
				manage.el.className = (issel?"childsel":"child");
			}
			break;

		case pp.CHECK:
			var smenu = ee('ms_'+idname), check = ee('ck_'+idname), label = ee('cl_'+idname);
			var flag = pp.getVal(idname);
			if(!!smenu){ smenu.el.innerHTML = (flag?"+":"&nbsp;")+pp.getMenuStr(idname);}	// ���j���[
			if(!!check){ check.el.checked   = flag;}					// �Ǘ��̈�(�`�F�b�N�{�b�N�X)
			if(!!label){ label.el.innerHTML = pp.getLabel(idname);}		// �Ǘ��̈�(���x��)
			break;
		}
	},

//--------------------------------------------------------------------------------------------------------------

	//---------------------------------------------------------------------------
	// menu.menuarea()   ���j���[�̏����ݒ���s��
	//---------------------------------------------------------------------------
	menuarea : function(){
		var am = ee.binder(pp, pp.addMenu),
			at = ee.binder(pp, pp.addSParent),
			as = ee.binder(pp, pp.addSmenu),
			au = ee.binder(pp, pp.addSelect),
			ac = ee.binder(pp, pp.addCheck),
			aa = ee.binder(pp, pp.addCaption),
			ai = ee.binder(pp, pp.addChild),
			ap = ee.binder(pp, pp.addSeparator),
			af = ee.binder(pp, pp.addFlagOnly),
			sl = ee.binder(pp, pp.setLabel);

		// *�t�@�C�� ==========================================================
		am('file', "�t�@�C��", "File");

		as('newboard', 'file', '�V�K�쐬','New Board');
		as('urlinput', 'file', 'URL����', 'Import from URL');
		as('urloutput','file', 'URL�o��', 'Export URL');
		ap('sep_file', 'file');
		as('fileopen', 'file', '�t�@�C�����J��','Open the file');
		at('filesavep', 'file', '�t�@�C���ۑ� ->',  'Save the file as ... ->');
		if(fio.dbm.DBaccept>0){
			as('database',  'file', '�ꎞ�ۑ�/�߂�', 'Temporary Stack');
		}
		if(base.enableSaveImage){
			ap('sep_image', 'file');
			at('imagesavep', 'file', '�摜��ۑ� ->', 'Save as image file');
		}

		// *�t�@�C�� - �t�@�C���ۑ� -------------------------------------------
		as('filesave',  'filesavep', '�ς��Ղ�v3�`��',  'Puz-Pre v3 format');
		if(this.ispencilbox){
			as('filesave2', 'filesavep', 'pencilbox�`��', 'Pencilbox format');
		}

		// *�t�@�C�� - �摜��ۑ� -------------------------------------------
		if(base.enableSaveImage){
			as('imagedl',   'imagesavep', '�摜���_�E�����[�h', 'Download the image');
			as('imagesave', 'imagesavep', '�ʃE�B���h�E�ŊJ��', 'Open another window');
		}

		// *�ҏW ==============================================================
		am('edit', "�ҏW", "Edit");

		as('adjust', 'edit', '�Ֆʂ̒���', 'Adjust the Board');
		as('turn',   'edit', '���]�E��]', 'Filp/Turn the Board');

		// *�\�� ==============================================================
		am('disp', "�\��", "Display");

		au('size','disp',2,[0,1,2,3,4], '�\���T�C�Y','Cell Size');
		ap('sep_disp1',  'disp');

		if(!!k.irowake){
			ac('irowake','disp',(k.irowake==2?true:false),'���̐F����','Color coding');
			sl('irowake', '���̐F����������', 'Color each lines');
		}
		ac('cursor','disp',true,'�J�[�\���̕\��','Display cursor');
		ap('sep_disp2', 'disp');
		as('repaint', 'disp', '�Ֆʂ̍ĕ`��', 'Repaint whole board');
		as('manarea', 'disp', '�Ǘ��̈���B��', 'Hide Management Area');

		// *�\�� - �\���T�C�Y -------------------------------------------------
		as('dispsize',    'size','�T�C�Y�w��','Cell Size');
		aa('cap_dispmode','size','�\�����[�h','Display mode');
		ai('size_0', 'size', '�T�C�Y �ɏ�', 'Ex Small');
		ai('size_1', 'size', '�T�C�Y ��',   'Small');
		ai('size_2', 'size', '�T�C�Y �W��', 'Normal');
		ai('size_3', 'size', '�T�C�Y ��',   'Large');
		ai('size_4', 'size', '�T�C�Y ����', 'Ex Large');
		ap('sep_size', 'size');
		ac('adjsize', 'size', true, '�T�C�Y�̎�������', 'Auto Adjustment');

		// *�ݒ� ==============================================================
		am('setting', "�ݒ�", "Setting");

		if(k.EDITOR){
			au('mode','setting',(k.editmode?1:3),[1,3],'���[�h', 'mode');
			sl('mode','���[�h', 'mode');
		}
		else{
			af('mode', 3);
		}

		puz.menufix();	// �e�p�Y�����Ƃ̃��j���[�ǉ�

		ac('autocheck','setting', k.playmode, '������������', 'Auto Answer Check');
		ac('lrcheck',  'setting', false, '�}�E�X���E���]', 'Mouse button inversion');
		sl('lrcheck', '�}�E�X�̍��E�{�^���𔽓]����', 'Invert button of the mouse');
		if(kp.ctl[1].enable || kp.ctl[3].enable){
			ac('keypopup', 'setting', kp.defaultdisp, '�p�l������', 'Panel inputting');
			sl('keypopup', '�����E�L�����p�l���œ��͂���', 'Input numbers by panel');
		}
		au('language', 'setting', 0,[0,1], '����', 'Language');

		// *�ݒ� - ���[�h -----------------------------------------------------
		ai('mode_1', 'mode', '���쐬���[�h', 'Edit mode'  );
		ai('mode_3', 'mode', '�񓚃��[�h',     'Answer mode');

		// *�ݒ� - ���� -------------------------------------------------------
		ai('language_0', 'language', '���{��',  '���{��');
		ai('language_1', 'language', 'English', 'English');

		// *���̑� ============================================================
		am('other', "���̑�", "Others");

		as('credit',  'other', '�ς��Ղ�v3�ɂ���',   'About PUZ-PRE v3');
		ap('sep_other','other');
		at('link',     'other', '�����N', 'Link');
		// *���̑� - �����N -----------------------------------------------------
		as('jumpv3',  'link', '�ς��Ղ�v3�̃y�[�W��', 'Jump to PUZ-PRE v3 page');
		as('jumptop', 'link', '�A�����j�ۊǌ�TOP��',  'Jump to indi.s58.xrea.com');
		as('jumpblog','link', '�͂��ϓ��L(blog)��',   'Jump to my blog');

		this.createAllFloat();
	},

	//---------------------------------------------------------------------------
	// menu.addUseToFlags()       �u������@�v�T�u���j���[�o�^�p���ʊ֐�
	// menu.addRedLineToFlags()   �u���̂Ȃ�����`�F�b�N�v�T�u���j���[�o�^�p���ʊ֐�
	// menu.addRedBlockToFlags()  �u���}�X�̂Ȃ�����`�F�b�N�v�T�u���j���[�o�^�p���ʊ֐�
	// menu.addRedBlockRBToFlags()�u�i�i�����}�X�̂Ȃ�����`�F�b�N�v�T�u���j���[�o�^�p���ʊ֐�
	//---------------------------------------------------------------------------
	addUseToFlags : function(){
		pp.addSelect('use','setting',1,[1,2], '������@', 'Input Type');
		pp.setLabel ('use', '������@', 'Input Type');

		pp.addChild('use_1','use','���E�{�^��','LR Button');
		pp.addChild('use_2','use','1�{�^��',   'One Button');
	},
	addRedLineToFlags : function(){
		pp.addCheck('dispred','setting',false,'�q����`�F�b�N','Continuous Check');
		pp.setLabel('dispred', '���̂Ȃ�����`�F�b�N����', 'Check countinuous lines');
	},
	addRedBlockToFlags : function(){
		pp.addCheck('dispred','setting',false,'�q����`�F�b�N','Continuous Check');
		pp.setLabel('dispred', '���}�X�̂Ȃ�����`�F�b�N����', 'Check countinuous black cells');
	},
	addRedBlockRBToFlags : function(){
		pp.addCheck('dispred','setting',false,'�q����`�F�b�N','Continuous Check');
		pp.setLabel('dispred', '�i�i�����}�X�̂Ȃ�����`�F�b�N����', 'Check countinuous black cells with its corner');
	},

	//---------------------------------------------------------------------------
	// menu.createAllFloat() �o�^���ꂽ�T�u���j���[����S�Ẵt���[�g���j���[���쐬����
	// menu.csshack_forIE6() �Z�p���[�^��style��ύX����
	//---------------------------------------------------------------------------
	createAllFloat : function(){
		var _IE6 = false;
		if(navigator.userAgent.match(/MSIE (\d+)/)){
			if(parseInt(RegExp.$1)<=7){ _IE6=true;}
		}

		for(var i=0;i<pp.flaglist.length;i++){
			var id = pp.flaglist[i];
			if(!pp.flags[id]){ continue;}

			var smenu, smenuid = 'ms_'+id;
			switch(pp.type(id)){
				case pp.MENU:     smenu = ee.createEL(this.EL_MENU,    smenuid); continue; break;
				case pp.SEPARATE: smenu = ee.createEL(this.EL_SEPARATE,smenuid); if(_IE6){ this.csshack_forIE6(smenu);} break;
				case pp.LABEL:    smenu = ee.createEL(this.EL_LABEL,   smenuid); break;
				case pp.SELECT:   smenu = ee.createEL(this.EL_SELECT,  smenuid); break;
				case pp.SMENU:    smenu = ee.createEL(this.EL_SMENU,   smenuid); break;
				case pp.CHECK:    smenu = ee.createEL(this.EL_CHECK,   smenuid); break;
				case pp.CHILD:    smenu = ee.createEL(this.EL_CHILD,   smenuid); break;
				case pp.SPARENT:
					var dispnormal = (pp.getMenuStr(id).indexOf("->")>=0);
					smenu = ee.createEL((dispnormal ? this.EL_SPARENT : this.EL_SELECT), smenuid);
					break;
				default: continue; break;
			}

			var parentid = pp.flags[id].parent;
			if(!this.floatpanel[parentid]){
				this.floatpanel[parentid] = ee.createEL(this.EL_FLOAT, 'float_'+parentid);
			}
			this.floatpanel[parentid].appendChild(smenu);
		}

		// 'setting'�����̓Z�p���[�^���ォ��}������
		var el = ee('float_setting').el, fw = el.firstChild.style.fontWeight
		for(var i=1,len=el.childNodes.length;i<len;i++){
			var node = el.childNodes[i];
			if(fw!=node.style.fontWeight){
				var smenu = ee.createEL(this.EL_SEPARATE,''); if(_IE6){ this.csshack_forIE6(smenu);}
				ee(smenu).insertBefore(node);
				i++; len++; // �ǉ������̂�1�����Ă���
			}
			fw=node.style.fontWeight;
		}

		// ���̑��̒���
		if(k.PLAYER){
			ee('ms_newboard') .el.className = 'smenunull';
			ee('ms_urloutput').el.className = 'smenunull';
			ee('ms_adjust')   .el.className = 'smenunull';
		}
		ee('ms_jumpv3')  .el.style.fontSize = '10pt'; ee('ms_jumpv3')  .el.style.paddingLeft = '8pt';
		ee('ms_jumptop') .el.style.fontSize = '10pt'; ee('ms_jumptop') .el.style.paddingLeft = '8pt';
		ee('ms_jumpblog').el.style.fontSize = '10pt'; ee('ms_jumpblog').el.style.paddingLeft = '8pt';
	},
	// IE7�ȉ�������CSS�n�b�N����߂āA�����Őݒ肷��悤�ɂ���
	csshack_forIE6 : function(smenu){
		if(smenu.className == 'smenusep'){
			smenu.style.lineHeight = '2pt';
			smenu.style.display = 'inline';
		}
	},

	//---------------------------------------------------------------------------
	// menu.menuhover(e) ���j���[�Ƀ}�E�X��������Ƃ��̕\���ݒ���s��
	// menu.menuout(e)   ���j���[����}�E�X���O�ꂽ���̕\���ݒ���s��
	// menu.menuclear()  ���j���[/�T�u���j���[/�t���[�g���j���[��S�đI������Ă��Ȃ���Ԃɖ߂�
	//---------------------------------------------------------------------------
	menuhover : function(e){
		if(!!this.movingpop){ return true;}

		var idname = ee.getSrcElement(e).id.substr(3);
		this.floatmenuopen(e,idname,0);
		ee('menupanel').replaceChildrenClass('menusel','menu');
		ee.getSrcElement(e).className = "menusel";
	},
	menuout   : function(e){
		if(!this.insideOfMenu(e)){
			this.menuclear();
			this.floatmenuclose(0);
		}
	},
	menuclear : function(){
		ee('menupanel').replaceChildrenClass('menusel','menu');
	},

	//---------------------------------------------------------------------------
	// menu.submenuhover(e) �T�u���j���[�Ƀ}�E�X��������Ƃ��̕\���ݒ���s��
	// menu.submenuout(e)   �T�u���j���[����}�E�X���O�ꂽ�Ƃ��̕\���ݒ���s��
	// menu.submenuclick(e) �ʏ�/�I���^/�`�F�b�N�^�T�u���j���[���N���b�N���ꂽ�Ƃ��̓�������s����
	//---------------------------------------------------------------------------
	submenuhover : function(e){
		var idname = ee.getSrcElement(e).id.substr(3);
		if(ee.getSrcElement(e).className==="smenu"){ ee.getSrcElement(e).className="smenusel";}
		if(pp.flags[idname] && (pp.type(idname)===pp.SELECT || pp.type(idname)===pp.SPARENT)){
			if(ee.getSrcElement(e).className!=='smenunull'){
				this.floatmenuopen(e,idname,this.dispfloat.length);
			}
		}
	},
	submenuout   : function(e){
		var idname = ee.getSrcElement(e).id.substr(3);
		if(ee.getSrcElement(e).className==="smenusel"){ ee.getSrcElement(e).className="smenu";}
		if(pp.flags[idname] && (pp.type(idname)===pp.SELECT || pp.type(idname)===pp.SPARENT)){
			this.floatmenuout(e);
		}
	},
	submenuclick : function(e){
		var idname = ee.getSrcElement(e).id.substr(3);
		if(ee.getSrcElement(e).className==="smenunull"){ return;}
		this.menuclear();
		this.floatmenuclose(0);

		switch(pp.type(idname)){
			case pp.SMENU: this.popopen(e, idname); break;
			case pp.CHILD: pp.setVal(pp.flags[idname].parent, pp.getVal(idname)); break;
			case pp.CHECK: pp.setVal(idname, !pp.getVal(idname)); break;
		}
	},

	//---------------------------------------------------------------------------
	// menu.floatmenuopen()  �}�E�X�����j���[���ڏ�ɗ������Ƀt���[�g���j���[��\������
	// menu.floatmenuclose() �t���[�g���j���[��close����
	// menu.floatmenuout(e)  �}�E�X���t���[�g���j���[�𗣂ꂽ���Ƀt���[�g���j���[��close����
	// menu.insideOf()       �C�x���ge���G�������g�͈͓̔��ŋN���������H
	// menu.insideOfMenu()   �}�E�X�����j���[�̈�̒��ɂ��邩���肷��
	//---------------------------------------------------------------------------
	floatmenuopen : function(e, idname, depth){
		if(depth===0){ this.menuclear();}
		this.floatmenuclose(depth);

		if(depth>0 && !this.dispfloat[depth-1]){ return;}

		var rect = ee(ee.getSrcElement(e).id).getRect();
		var _float = this.floatpanel[idname];
		if(depth==0){
			_float.style.left = rect.left   + 1 + 'px';
			_float.style.top  = rect.bottom + 1 + 'px';
		}
		else{
			if(!k.br.IEmoz4){
				_float.style.left = rect.right - 3 + 'px';
				_float.style.top  = rect.top   - 3 + 'px';
			}
			else{
				_float.style.left = ee.pageX(e)  + 'px';
				_float.style.top  = rect.top - 3 + 'px';
			}
		}
		_float.style.zIndex   = 101+depth;
		_float.style.display  = 'block';

		this.dispfloat.push(_float);
	},
	// �}�E�X�����ꂽ�Ƃ��Ƀt���[�g���j���[���N���[�Y����
	// �t���[�g->���j���[���ɊO�ꂽ���́A�֐��I�������floatmenuopen()���Ă΂��
	floatmenuclose : function(depth){
		for(var i=this.dispfloat.length-1;i>=depth;i--){
			if(i!==0){
				var parentsmenuid = "ms_" + this.dispfloat[i].id.substr(6);
				ee(parentsmenuid).el.className = 'smenu';
			}
			this.dispfloat[i].style.display = 'none';
			this.dispfloat.pop();
		}
	},

	floatmenuout : function(e){
		for(var i=this.dispfloat.length-1;i>=0;i--){
			if(this.insideOf(this.dispfloat[i],e)){
				this.floatmenuclose(i+1);
				return;
			}
		}
		// �����ɗ���̂͂��ׂď�����ꍇ
		this.menuclear();
		this.floatmenuclose(0);
	},

	insideOf : function(el, e){
		var ex = ee.pageX(e);
		var ey = ee.pageY(e);
		var rect = ee(el.id).getRect();
		return (ex>=rect.left && ex<=rect.right && ey>=rect.top && ey<=rect.bottom);
	},
	insideOfMenu : function(e){
		var ex = ee.pageX(e);
		var ey = ee.pageY(e);
		var rect_f = ee('ms_file').getRect(), rect_o = ee('ms_other').getRect();
		return (ex>=rect_f.left && ex<=rect_o.right && ey>=rect_f.top);
	},

//--------------------------------------------------------------------------------------------------------------

	//---------------------------------------------------------------------------
	// menu.managearea()   �Ǘ��̈�̏��������s��(���e�̓T�u���j���[�̂��̂��Q��)
	// menu.checkclick()   �Ǘ��̈�̃`�F�b�N�{�^���������ꂽ�Ƃ��A�`�F�b�N�^�̐ݒ��ݒ肷��
	// menu.selectclick()  �I���^�T�u���j���[���ڂ��N���b�N���ꂽ�Ƃ��̓���
	//---------------------------------------------------------------------------
	managearea : function(){
		// usearea & checkarea
		for(var n=0;n<pp.flaglist.length;n++){
			var idname = pp.flaglist[n];
			if(!pp.flags[idname] || !pp.getLabel(idname)){ continue;}
			var _div = ee(ee.createEL(this.EL_DIVPACK,'div_'+idname));
			//_div.el.innerHTML = "";

			switch(pp.type(idname)){
			case pp.SELECT:
				_div.appendEL(ee.createEL(this.EL_SPAN, 'cl_'+idname));
				_div.appendHTML("&nbsp;|&nbsp;");
				for(var i=0;i<pp.flags[idname].child.length;i++){
					var num = pp.flags[idname].child[i];
					_div.appendEL(ee.createEL(this.EL_SELCHILD, ['up',idname,num].join("_")));
					_div.appendHTML('&nbsp;');
				}
				_div.appendBR();

				ee('usepanel').appendEL(_div.el);
				break;

			case pp.CHECK:
				_div.appendEL(ee.createEL(this.EL_CHECKBOX, 'ck_'+idname));
				_div.appendHTML("&nbsp;");
				_div.appendEL(ee.createEL(this.EL_SPAN, 'cl_'+idname));
				_div.appendBR();

				ee('checkpanel').appendEL(_div.el);
				break;
			}
		}

		// �F�����`�F�b�N�{�b�N�X�p�̏���
		if(k.irowake){
			// ���ɂ����������{�^����ǉ�
			var el = ee.createEL(this.EL_BUTTON, 'ck_btn_irowake');
			this.addButtons(el, ee.binder(menu.ex, menu.ex.irowakeRemake), "�F�������Ȃ���", "Change the color of Line");
			ee('ck_btn_irowake').insertAfter(ee('cl_irowake').el);

			// �F�����̂����ԉ��Ɏ����Ă���
			var el = ee('checkpanel').el.removeChild(ee('div_irowake').el);
			ee('checkpanel').el.appendChild(el);
		}

		// ����ɏo�Ă�����
		ee('translation').unselectable().el.onclick = ee.binder(this, this.translate);
		this.addLabels(ee('translation').el, "English", "���{��");

		// �������̏ꏊ
		ee('expression').el.innerHTML = base.expression.ja;

		// �Ǘ��̈�̕\��/��\���ݒ�
		if(k.EDITOR){
			ee('timerpanel').el.style.display = 'none';
			ee('separator2').el.style.display = 'none';
		}
		if(!!ee('ck_keypopup')){ pp.funcs.keypopup();}

		// (Canvas��) �{�^���̏����ݒ�
		ee.createEL(this.EL_UBUTTON, 'btncheck');
		ee('btnarea').appendHTML('&nbsp;');
		ee.createEL(this.EL_UBUTTON, 'btnundo');
		ee.createEL(this.EL_UBUTTON, 'btnredo');
		ee('btnarea').appendHTML('&nbsp;');
		ee.createEL(this.EL_UBUTTON, 'btnclear');
		ee.createEL(this.EL_UBUTTON, 'btnclear2');

		this.addButtons(ee("btncheck").el,  ee.binder(ans, ans.check),             "�`�F�b�N", "Check");
		this.addButtons(ee("btnundo").el,   ee.binder(um, um.undo),                "��",       "<-");
		this.addButtons(ee("btnredo").el,   ee.binder(um, um.redo),                "�i",       "->");
		this.addButtons(ee("btnclear").el,  ee.binder(menu.ex, menu.ex.ACconfirm), "�񓚏���", "Erase Answer");
		this.addButtons(ee("btnclear2").el, ee.binder(menu.ex, menu.ex.ASconfirm), "�⏕����", "Erase Auxiliary Marks");

		if(k.irowake!=0){
			var el = ee.createEL(this.EL_BUTTON, 'btncolor2');
			this.addButtons(el, ee.binder(menu.ex, menu.ex.irowakeRemake), "�F�������Ȃ���", "Change the color of Line");
			ee('btncolor2').insertAfter(ee('btnclear2').el).el.style.display = 'none';
		}
	},

	checkclick : function(e){
		var el = ee.getSrcElement(e);
		var idname = el.id.substr(3);
		pp.setVal(idname, !!el.checked);
	},
	selectclick : function(e){
		var list = ee.getSrcElement(e).id.split('_');
		pp.setVal(list[1], list[2]);
	},

//--------------------------------------------------------------------------------------------------------------

	//---------------------------------------------------------------------------
	// menu.poparea()       �|�b�v�A�b�v���j���[�̏����ݒ���s��
	//---------------------------------------------------------------------------
	poparea : function(){

		//=====================================================================
		//// �e�^�C�g���o�[�̓���ݒ�
		var pop = ee('popup_parent').el.firstChild;
		while(!!pop){
			var _el = pop.firstChild;
			while(!!_el){
				if(_el.className==='titlebar'){
					this.titlebarfunc(_el);
					break;
				}
				_el = _el.nextSibling;
			}
			pop = pop.nextSibling;
		}
		this.titlebarfunc(ee('credit3_1').el);

		document.onmousemove = ee.ebinder(this,this.titlebarmove);
		document.onmouseup   = ee.ebinder(this,this.titlebarup);

		//=====================================================================
		//// form�{�^���̓���ݒ�E���̑���Caption�ݒ�
		var btn = ee.binder(this, this.addButtons);
		var lab = ee.binder(this, this.addLabels);
		var close = ee.ebinder(this, this.popclose);
		var func = null;

		// �Ֆʂ̐V�K�쐬 -----------------------------------------------------
		func = ee.ebinder(this.ex, this.ex.newboard);
		lab(ee('bar1_1').el,      "�Ֆʂ̐V�K�쐬",         "Createing New Board");
		lab(ee('pop1_1_cap0').el, "�Ֆʂ�V�K�쐬���܂��B", "Create New Board.");
		if(k.puzzleid!=='sudoku' && k.puzzleid!=='tawa'){
			lab(ee('pop1_1_cap1').el, "�悱",                   "Cols");
			lab(ee('pop1_1_cap2').el, "����",                   "Rows");
		}
		btn(document.newboard.newboard, func,  "�V�K�쐬",   "Create");
		btn(document.newboard.cancel,   close, "�L�����Z��", "Cancel");

		// URL���� ------------------------------------------------------------
		func = ee.ebinder(this.ex, this.ex.urlinput);
		lab(ee('bar1_2').el,      "URL����",                     "Import from URL");
		lab(ee('pop1_2_cap0').el, "URL�������ǂݍ��݂܂��B", "Import a question from URL.");
		btn(document.urlinput.urlinput, func,  "�ǂݍ���",   "Import");
		btn(document.urlinput.cancel,   close, "�L�����Z��", "Cancel");

		// URL�o�� ------------------------------------------------------------
		func = ee.ebinder(this.ex, this.ex.urloutput);
		lab(ee('bar1_3').el, "URL�o��", "Export URL");
		var btt = function(name, strJP, strEN, eval){
			if(eval===false){ return;}
			var el = ee.createEL(menu.EL_BUTTON,''); el.name = name;
			ee('urlbuttonarea').appendEL(el).appendBR();
			btn(el, func, strJP, strEN);
		};
		btt('pzprv3',     "�ς��Ղ�v3��URL���o�͂���",           "Output PUZ-PRE v3 URL",          true);
		btt('pzprapplet', "�ς��Ղ�(�A�v���b�g)��URL���o�͂���", "Output PUZ-PRE(JavaApplet) URL", !k.ispzprv3ONLY);
		btt('kanpen',     "�J���y����URL���o�͂���",             "Output Kanpen URL",              k.isKanpenExist);
		btt('heyaapp',    "�ւ�킯�A�v���b�g��URL���o�͂���",   "Output Heyawake-Applet URL",     (k.puzzleid==="heyawake"));
		btt('pzprv3edit', "�ς��Ղ�v3�̍ĕҏW�pURL���o�͂���",   "Output PUZ-PRE v3 Re-Edit URL",  true);
		ee("urlbuttonarea").appendBR();
		func = ee.ebinder(this.ex, this.ex.openurl);
		btn(document.urloutput.openurl, func,  "����URL���J��", "Open this URL on another window/tab");
		btn(document.urloutput.close,   close, "����", "Close");

		// �t�@�C������ -------------------------------------------------------
		func = ee.ebinder(this.ex, this.ex.fileopen);
		lab(ee('bar1_4').el,      "�t�@�C�����J��", "Open file");
		lab(ee('pop1_4_cap0').el, "�t�@�C���I��",   "Choose file");
		document.fileform.filebox.onchange = func;
		btn(document.fileform.close,    close, "����",     "Close");

		// �f�[�^�x�[�X���J�� -------------------------------------------------
		func = ee.ebinder(fio.dbm, fio.dbm.clickHandler);
		lab(ee('bar1_8').el, "�ꎞ�ۑ�/�߂�", "Temporary Stack");
		document.database.sorts   .onchange = func;
		document.database.datalist.onchange = func;
		document.database.tableup .onclick  = func;
		document.database.tabledn .onclick  = func;
		btn(document.database.open,     func,  "�f�[�^��ǂݍ���",   "Load");
		btn(document.database.save,     func,  "�Ֆʂ�ۑ�",         "Save");
		lab(ee('pop1_8_com').el, "�R�����g:", "Comment:");
		btn(document.database.comedit,  func,  "�R�����g��ҏW����", "Edit Comment");
		btn(document.database.difedit,  func,  "��Փx��ݒ肷��",   "Set difficulty");
		btn(document.database.del,      func,  "�폜",               "Delete");
		btn(document.database.close,    close, "����",             "Close");

		// �Ֆʂ̒��� ---------------------------------------------------------
		func = ee.ebinder(this.ex, this.ex.popupadjust);
		lab(ee('bar2_1').el,      "�Ֆʂ̒���",             "Adjust the board");
		lab(ee('pop2_1_cap0').el, "�Ֆʂ̒������s���܂��B", "Adjust the board.");
		lab(ee('pop2_1_cap1').el, "�g��",  "Expand");
		btn(document.adjust.expandup,   func,  "��",     "UP");
		btn(document.adjust.expanddn,   func,  "��",     "Down");
		btn(document.adjust.expandlt,   func,  "��",     "Left");
		btn(document.adjust.expandrt,   func,  "�E",     "Right");
		lab(ee('pop2_1_cap2').el, "�k��", "Reduce");
		btn(document.adjust.reduceup,   func,  "��",     "UP");
		btn(document.adjust.reducedn,   func,  "��",     "Down");
		btn(document.adjust.reducelt,   func,  "��",     "Left");
		btn(document.adjust.reducert,   func,  "�E",     "Right");
		btn(document.adjust.close,      close, "����", "Close");

		// ���]�E��] ---------------------------------------------------------
		lab(ee('bar2_2').el,      "���]�E��]",                  "Flip/Turn the board");
		lab(ee('pop2_2_cap0').el, "�Ֆʂ̉�]�E���]���s���܂��B","Flip/Turn the board.");
		btn(document.flip.turnl,  func,  "��90����]", "Turn left by 90 degree");
		btn(document.flip.turnr,  func,  "�E90����]", "Turn right by 90 degree");
		btn(document.flip.flipy,  func,  "�㉺���]",   "Flip upside down");
		btn(document.flip.flipx,  func,  "���E���]",   "Flip leftside right");
		btn(document.flip.close,  close, "����",     "Close");

		// credit -------------------------------------------------------------
		lab(ee('bar3_1').el,   "credit", "credit");
		lab(ee('credit3_1').el,"�ς��Ղ�v3 "+pzprversion+"<br>\n<br>\n�ς��Ղ�v3�� �͂���/�A�����j���쐬���Ă��܂��B<br>\n���C�u�����Ƃ���uuCanvas1.0, Google Gears���g�p���Ă��܂��B<br>\n<br>\n",
							   "PUZ-PRE v3 "+pzprversion+"<br>\n<br>\nPUZ-PRE v3 id made by happa.<br>\nThis script use uuCanvas1.0 and Google Gears as libraries.&nbsp;<br>\n<br>\n");
		btn(document.credit.close,  close, "����", "OK");

		// �\���T�C�Y ---------------------------------------------------------
		func = ee.ebinder(this, this.ex.dispsize);
		lab(ee('bar4_1').el,      "�\���T�C�Y�̕ύX",         "Change size");
		lab(ee('pop4_1_cap0').el, "�\���T�C�Y��ύX���܂��B", "Change the display size.");
		lab(ee('pop4_1_cap1').el, "�\���T�C�Y",               "Display size");
		btn(document.dispsize.dispsize, func,  "�ύX����",   "Change");
		btn(document.dispsize.cancel,   close, "�L�����Z��", "Cancel");

		// poptest ------------------------------------------------------------
		debug.poptest_func();
	},

	//---------------------------------------------------------------------------
	// menu.popopen()  �|�b�v�A�b�v���j���[���J��
	// menu.popclose() �|�b�v�A�b�v���j���[�����
	//---------------------------------------------------------------------------
	popopen : function(e, idname){
		// �\�����Ă���E�B���h�E������ꍇ�͕���
		this.popclose();

		// ���̒���menu.pop���ݒ肳��܂��B
		if(pp.funcs[idname]){ pp.funcs[idname]();}

		// �|�b�v�A�b�v���j���[��\������
		if(this.pop){
			var _pop = this.pop.el;
			_pop.style.left = ee.pageX(e) - 8 + 'px';
			_pop.style.top  = ee.pageY(e) - 8 + 'px';
			_pop.style.display = 'inline';
		}
	},
	popclose : function(){
		if(this.pop){
			if(this.pop.el.id=='pop1_8'){
				fio.dbm.closeDialog();
			}

			this.pop.el.style.display = "none";
			this.pop = '';
			this.menuclear();
			this.movingpop = "";
			kc.enableKey = true;
		}
	},

	//---------------------------------------------------------------------------
	// menu.titlebarfunc()  ����4�̃C�x���g���C�x���g�n���h���ɂ�������
	// menu.titlebardown()  �^�C�g���o�[���N���b�N�����Ƃ��̓�����s��(�^�C�g���o�[��bind)
	// menu.titlebarup()    �^�C�g���o�[�Ń{�^���𗣂����Ƃ��̓�����s��(document��bind)
	// menu.titlebarmove()  �^�C�g���o�[����}�E�X�𓮂������Ƃ��|�b�v�A�b�v���j���[�𓮂���(document��bind)
	//---------------------------------------------------------------------------
	titlebarfunc : function(bar){
		bar.onmousedown = ee.ebinder(this, this.titlebardown);
		ee(bar).unselectable().el;
	},

	titlebardown : function(e){
		var pop = ee.getSrcElement(e).parentNode;
		this.movingpop = pop;
		this.offset.x = ee.pageX(e) - parseInt(pop.style.left);
		this.offset.y = ee.pageY(e) - parseInt(pop.style.top);
	},
	titlebarup : function(e){
		var pop = this.movingpop;
		if(!!pop){
			this.movingpop = "";
		}
	},
	titlebarmove : function(e){
		var pop = this.movingpop;
		if(!!pop){
			pop.style.left = ee.pageX(e) - this.offset.x + 'px';
			pop.style.top  = ee.pageY(e) - this.offset.y + 'px';
		}
	},

//--------------------------------------------------------------------------------------------------------------

	//--------------------------------------------------------------------------------
	// menu.isLangJP()  ���ꃂ�[�h����{��ɂ���
	// menu.isLangEN()  ���ꃂ�[�h���p��ɂ���
	//--------------------------------------------------------------------------------
	isLangJP : function(){ return this.language == 'ja';},
	isLangEN : function(){ return this.language == 'en';},

	//--------------------------------------------------------------------------------
	// menu.setLang()   �����ݒ肷��
	// menu.translate() html�̌����ς���
	//--------------------------------------------------------------------------------
	setLang : function(ln){ (ln=='ja')       ?this.setLangJP():this.setLangEN();},
	translate : function(){ (this.isLangJP())?this.setLangEN():this.setLangJP();},

	//--------------------------------------------------------------------------------
	// menu.setLangJP()  ���͂���{��ɂ���
	// menu.setLangEN()  ���͂��p��ɂ���
	// menu.setLangStr() ���͂�ݒ肷��
	//--------------------------------------------------------------------------------
	setLangJP : function(){ this.setLangStr('ja');},
	setLangEN : function(){ this.setLangStr('en');},
	setLangStr : function(ln){
		this.language = ln;
		document.title = base.gettitle();
		ee('title2').el.innerHTML = base.gettitle();
		ee('expression').el.innerHTML = base.expression[this.language];

		this.displayAll();
		this.ex.dispmanstr();

		base.resize_canvas();
	}
};

//--------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------
// ��Properties�N���X �ݒ�l�̒l�Ȃǂ�ێ�����
//---------------------------------------------------------------------------
SSData = function(){
	this.id     = '';
	this.type   = 0;
	this.val    = 1;
	this.parent = 1;
	this.child  = [];

	this.str    = { ja: new Caption(), en: new Caption()};
	//this.func   = null;
};
Properties = function(){
	this.flags    = [];	// �T�u���j���[���ڂ̏��(SSData�N���X�̃I�u�W�F�N�g�̔z��ɂȂ�)
	this.flaglist = [];	// idname�̔z��

	// const
	this.MENU     = 6;
	this.SPARENT  = 7;
	this.SMENU    = 0;
	this.SELECT   = 1;
	this.CHECK    = 2;
	this.LABEL    = 3;
	this.CHILD    = 4;
	this.SEPARATE = 5;
};
Properties.prototype = {
	reset : function(){
		this.flags    = [];
		this.flaglist = [];
	},

	//---------------------------------------------------------------------------
	// pp.addMenu()      ���j���[�ŏ�ʂ̏���o�^����
	// pp.addSParent()   �t���[�g���j���[���J���T�u���j���[���ڂ�o�^����
	// pp.addSmenu()     Popup���j���[���J���T�u���j���[���ڂ�o�^����
	// pp.addCaption()   Caption�Ƃ��Ďg�p����T�u���j���[���ڂ�o�^����
	// pp.addSeparator() �Z�p���[�^�Ƃ��Ďg�p����T�u���j���[���ڂ�o�^����
	// pp.addCheck()     �I���^�T�u���j���[���ڂɕ\�����镶�����ݒ肷��
	// pp.addSelect()    �`�F�b�N�^�T�u���j���[���ڂɕ\�����镶�����ݒ肷��
	// pp.addChild()     �`�F�b�N�^�T�u���j���[���ڂ̎q�v�f��ݒ肷��
	// pp.addFlagOnly()  ���݂̂�o�^����
	//---------------------------------------------------------------------------
	addMenu : function(idname, strJP, strEN){
		this.addFlags(idname, '', this.MENU, 0, strJP, strEN);
	},
	addSParent : function(idname, parent, strJP, strEN){
		this.addFlags(idname, parent, this.SPARENT, 0, strJP, strEN);
	},

	addSmenu : function(idname, parent, strJP, strEN){
		this.addFlags(idname, parent, this.SMENU, 0, strJP, strEN);
	},

	addCaption : function(idname, parent, strJP, strEN){
		this.addFlags(idname, parent, this.LABEL, 0, strJP, strEN);
	},
	addSeparator : function(idname, parent){
		this.addFlags(idname, parent, this.SEPARATE, 0, '', '');
	},

	addCheck : function(idname, parent, first, strJP, strEN){
		this.addFlags(idname, parent, this.CHECK, first, strJP, strEN);
	},
	addSelect : function(idname, parent, first, child, strJP, strEN){
		this.addFlags(idname, parent, this.SELECT, first, strJP, strEN);
		this.flags[idname].child = child;
	},
	addChild : function(idname, parent, strJP, strEN){
		var list = idname.split("_");
		this.addFlags(idname, list[0], this.CHILD, list[1], strJP, strEN);
	},

	addFlagOnly : function(idname, first){
		this.addFlags(idname, '', '', first, '', '');
	},

	//---------------------------------------------------------------------------
	// pp.addFlags()  ��L�֐��̓������ʏ���
	// pp.setLabel()  �Ǘ��̈�ɕ\�L���郉�x���������ݒ肷��
	//---------------------------------------------------------------------------
	addFlags : function(idname, parent, type, first, strJP, strEN){
		this.flags[idname] = new SSData();
		this.flags[idname].id     = idname;
		this.flags[idname].type   = type;
		this.flags[idname].val    = first;
		this.flags[idname].parent = parent;
		this.flags[idname].str.ja.menu = strJP;
		this.flags[idname].str.en.menu = strEN;
		this.flaglist.push(idname);
	},

	setLabel : function(idname, strJP, strEN){
		if(!this.flags[idname]){ return;}
		this.flags[idname].str.ja.label = strJP;
		this.flags[idname].str.en.label = strEN;
	},

	//---------------------------------------------------------------------------
	// pp.getMenuStr() �Ǘ��p�l���ƑI���^/�`�F�b�N�^�T�u���j���[�ɕ\�����镶�����Ԃ�
	// pp.getLabel()   �Ǘ��p�l���ƃ`�F�b�N�^�T�u���j���[�ɕ\�����镶�����Ԃ�
	// pp.type()       �ݒ�l�̃T�u���j���[�^�C�v��Ԃ�
	// pp.istype()     �ݒ�l�̃T�u���j���[�^�C�v���w�肳�ꂽ�l���ǂ�����Ԃ�
	//
	// pp.getVal()     �e�t���O��val�̒l��Ԃ�
	// pp.setVal()     �e�t���O�̐ݒ�l��ݒ肷��
	//---------------------------------------------------------------------------
	getMenuStr : function(idname){ return this.flags[idname].str[menu.language].menu; },
	getLabel   : function(idname){ return this.flags[idname].str[menu.language].label;},
	type   : function(idname)     { return this.flags[idname].type;},
	istype : function(idname,type){ return (this.flags[idname].type===type);},

	getVal : function(idname)  { return this.flags[idname]?this.flags[idname].val:0;},
	setVal : function(idname, newval, callfunc){
		if(!this.flags[idname]){ return;}
		else if(this.flags[idname].type===this.CHECK || this.flags[idname].type===this.SELECT){
			this.flags[idname].val = newval;
			menu.setdisplay(idname);
			if(this.funcs[idname] && callfunc!==false){ this.funcs[idname](newval);}
		}
	},

//--------------------------------------------------------------------------------------------------------------
	// submenu����Ăяo�����֐�����
	funcs : {
		urlinput  : function(){ menu.pop = ee("pop1_2");},
		urloutput : function(){ menu.pop = ee("pop1_3"); document.urloutput.ta.value = "";},
		fileopen  : function(){ menu.pop = ee("pop1_4");},
		filesave  : function(){ menu.ex.filesave(fio.PZPR);},
		filesave2 : function(){ if(!!fio.kanpenSave){ menu.ex.filesave(fio.PBOX);}},
		imagedl   : function(){ menu.ex.imagesave(true);},
		imagesave : function(){ menu.ex.imagesave(false);},
		database  : function(){ menu.pop = ee("pop1_8"); fio.dbm.openDialog();},
		adjust    : function(){ menu.pop = ee("pop2_1");},
		turn      : function(){ menu.pop = ee("pop2_2");},
		credit    : function(){ menu.pop = ee("pop3_1");},
		jumpv3    : function(){ window.open('./', '', '');},
		jumptop   : function(){ window.open('../../', '', '');},
		jumpblog  : function(){ window.open('http://d.hatena.ne.jp/sunanekoroom/', '', '');},
		irowake   : function(){ pc.paintAll();},
		cursor    : function(){ pc.paintAll();},
		manarea   : function(){ menu.ex.dispman();},
		mode      : function(num){ menu.ex.modechange(num);},
		size      : function(num){ base.resize_canvas();},
		repaint   : function(num){ base.resize_canvas();},
		language  : function(num){ menu.setLang({0:'ja',1:'en'}[num]);},

		newboard : function(){
			menu.pop = ee("pop1_1");
			if(k.puzzleid!="sudoku"){
				document.newboard.col.value = k.qcols;
				document.newboard.row.value = k.qrows;
			}
			kc.enableKey = false;
		},
		dispsize : function(){
			menu.pop = ee("pop4_1");
			document.dispsize.cs.value = k.cellsize;
			kc.enableKey = false;
		},
		keypopup : function(){
			var f = kp.ctl[pp.flags['mode'].val].enable;
			ee('ck_keypopup').el.disabled    = (f?"":"true");
			ee('cl_keypopup').el.style.color = (f?"black":"silver");
		}
	}
};

//---------------------------------------------------------------------------
// ��debug�I�u�W�F�N�g  poptest�֘A�̊֐��Ȃ�
//---------------------------------------------------------------------------
var debug = {
	extend : function(object){
		for(var i in object){ this[i] = object[i];}
	},

	poptest_func : function(){
		menu.titlebarfunc(ee('bartest').el);

		document.testform.t1.onclick        = ee.binder(this, this.perfeval);
		document.testform.t2.onclick        = ee.binder(this, this.painteval);
		document.testform.t3.onclick        = ee.binder(this, this.resizeeval);
		document.testform.perfload.onclick  = ee.binder(this, this.loadperf);

		document.testform.filesave.onclick  = ee.binder(this, this.filesave);
		document.testform.pbfilesave.onclick  = ee.binder(this, this.filesave_pencilbox);

		document.testform.fileopen.onclick  = ee.binder(this, this.fileopen);
		document.testform.database.onclick  = ee.binder(this, this.dispdatabase);

		document.testform.erasetext.onclick = ee.binder(this, this.erasetext);
		document.testform.close.onclick     = function(e){ ee('poptest').el.style.display = 'none';};

		document.testform.testarea.style.fontSize = '10pt';

		document.testform.starttest.style.display = 'none';

		document.testform.perfload.style.display = (k.puzzleid!=='country' ? 'none' : 'inline');
		document.testform.pbfilesave.style.display = (!menu.ispencilbox ? 'none' : 'inline');
		document.testform.database.style.display = (!fio.DBaccept<0x08 ? 'none' : 'inline');

		if(k.scriptcheck){ debug.testonly_func();}	// �e�X�g�p
	},

	disppoptest : function(){
		var _pop_style = ee('poptest').el.style;
		_pop_style.display = 'inline';
		_pop_style.left = '40px';
		_pop_style.top  = '80px';
	},

	// k.scriptcheck===true���̓I�[�o�[���C�h����܂�
	keydown : function(ca){
		if(kc.isCTRL && ca=='F8'){
			this.disppoptest();
			kc.tcMoved = true;
			return true;
		}
		return false;
	},

	filesave : function(){
		this.setTA(fio.fileencode(fio.PZPR).replace(/\//g,"\n"));
		this.addTA('');
		this.addTA(fio.urlstr);
	},
	filesave_pencilbox : function(){
		this.setTA(fio.fileencode(fio.PBOX).replace(/\//g,"\n"));
	},

	fileopen : function(){
		var dataarray = this.getTA().split("\n");
		fio.filedecode(dataarray.join("/"));
	},

	erasetext : function(){
		this.setTA('');
		if(k.scriptcheck){ ee('testdiv').el.innerHTML = '';}
	},

	perfeval : function(){
		this.timeeval("�������葪��",ee.binder(ans, ans.checkAns));
	},
	painteval : function(){
		this.timeeval("�`�掞�ԑ���",ee.binder(pc, pc.paintAll));
	},
	resizeeval : function(){
		this.timeeval("resize�`�摪��",ee.binder(base, base.resize_canvas));
	},
	timeeval : function(text,func){
		this.addTA(text);
		var count=0, old = tm.now();
		while(tm.now() - old < 3000){
			count++;

			func();
		}
		var time = tm.now() - old;

		this.addTA("����f�[�^ "+time+"ms / "+count+"��\n"+"���ώ���   "+(time/count)+"ms")
	},

	dispdatabase : function(){
		var text = "";
		for(var i=0;i<localStorage.length;i++){
			var key = localStorage.key(i);
			text += (""+key+" "+localStorage[key]+"\n");
		}
		this.setTA(text);
	},

	loadperf : function(){
		fio.filedecode("pzprv3/country/10/18/44/0 0 1 1 1 2 2 2 3 4 4 4 5 5 6 6 7 8 /0 9 1 10 10 10 11 2 3 4 12 4 4 5 6 13 13 8 /0 9 1 1 10 10 11 2 3 12 12 12 4 5 14 13 13 15 /0 9 9 9 10 16 16 16 16 17 12 18 4 5 14 13 15 15 /19 19 19 20 20 20 21 17 17 17 22 18 18 14 14 23 23 24 /19 25 25 26 26 21 21 17 22 22 22 18 27 27 27 24 24 24 /28 28 29 26 30 31 21 32 22 33 33 33 33 34 35 35 35 36 /28 29 29 26 30 31 32 32 32 37 38 39 34 34 40 40 35 36 /41 29 29 42 30 31 31 32 31 37 38 39 34 34 34 40 35 36 /41 43 42 42 30 30 31 31 31 37 38 38 38 40 40 40 36 36 /3 . 6 . . 4 . . 2 . . . . . . . . 1 /. . . 5 . . . . . . . . . . . . . . /. . . . . . . . . 1 . . . . . . . . /. . . . . . . . . . . . . . . . . . /3 . . 2 . . . 4 . . . . . . . . . . /. . . 3 . . . . 4 . . . 2 . . . . . /. . . . 3 6 . . . 4 . . . . . . . . /. 5 . . . . . . . 2 . . 3 . . . . . /. . . . . . . . . . . . . . . . . . /. . . . . . . . . . . . . . . . 5 . /0 0 1 1 0 0 1 0 0 1 1 0 0 0 1 1 0 /1 0 0 0 1 0 0 0 1 0 0 1 0 0 0 0 1 /0 0 1 0 1 0 0 1 0 0 0 0 0 0 0 0 0 /0 1 1 0 0 0 1 0 0 1 1 0 1 0 0 0 1 /1 1 0 0 1 0 0 1 1 0 0 0 0 1 0 1 0 /0 1 0 1 0 1 0 0 1 1 1 0 1 0 0 1 1 /1 0 1 0 0 0 0 1 0 1 1 1 0 0 1 1 0 /0 1 0 0 0 0 1 0 0 0 0 1 1 0 1 0 0 /0 1 1 0 1 1 0 0 1 0 1 0 0 0 0 0 0 /1 1 1 0 0 0 1 1 0 0 1 1 1 1 1 0 1 /0 0 1 0 1 0 1 1 0 1 0 1 0 0 1 0 1 0 /1 1 1 0 0 1 1 1 1 0 0 0 1 0 1 0 0 1 /1 1 0 1 1 0 1 0 0 0 0 0 1 0 1 0 0 1 /1 0 0 0 1 0 0 1 0 1 0 1 0 1 1 0 1 0 /0 0 1 0 0 1 0 0 0 0 0 1 0 0 0 1 0 0 /0 1 0 1 1 0 1 0 1 0 0 0 1 1 0 0 0 1 /1 0 1 0 1 0 1 1 0 1 0 0 0 1 1 0 1 1 /1 1 0 0 1 0 0 0 0 1 0 1 0 0 0 1 1 1 /1 0 0 1 0 0 1 0 1 0 1 0 0 0 0 1 1 1 /2 2 1 1 1 2 0 0 2 0 1 0 0 0 0 0 0 2 /1 1 1 2 1 1 0 0 0 1 2 1 0 0 1 2 0 0 /1 0 1 1 1 1 0 0 1 2 2 2 1 0 1 2 2 0 /1 0 0 1 1 2 1 0 2 1 1 1 1 0 1 2 1 0 /1 1 0 2 1 1 2 0 0 0 2 1 2 1 1 1 0 2 /2 1 0 1 1 1 0 2 0 0 0 0 1 1 2 1 0 0 /1 0 1 1 1 2 1 1 0 0 0 0 0 0 1 0 0 0 /0 1 1 2 1 2 1 1 2 1 2 0 1 0 1 0 0 0 /0 1 1 0 1 1 1 2 0 1 0 1 2 2 2 1 0 0 /0 0 0 1 2 2 1 1 0 2 0 0 1 0 1 0 0 0 /");
		pp.setVal('mode',3);
		pp.setVal('irowake',true);
	},

	getTA : function(){ return document.testform.testarea.value;},
	setTA : function(str){ document.testform.testarea.value  = str;},
	addTA : function(str){ document.testform.testarea.value += (str+"\n");}
};

//---------------------------------------------------------------------------
// ��MenuExec�N���X �|�b�v�A�b�v�E�B���h�E���Ń{�^���������ꂽ���̏������e���L�q����
//---------------------------------------------------------------------------

// Menu�N���X���s��
MenuExec = function(){
	this.displaymanage = true;
	this.qnumw;	// Ques==51�̉�]����]�p
	this.qnumh;	// Ques==51�̉�]����]�p
	this.qnums;	// reduce��isOneNumber���̌㏈���p

	this.reader;	// FileReader�I�u�W�F�N�g
	this.enableReadText = false;

	// expand/reduce�����p
	this.insex = {};
	this.insex[k.CELL]   = {1:true};
	this.insex[k.CROSS]  = (k.iscross===1 ? {2:true} : {0:true});
	this.insex[k.BORDER] = {1:true, 2:true};
	this.insex[k.EXCELL] = {1:true};

	// �萔
	this.EXPAND = 0x10;
	this.REDUCE = 0x20;
	this.TURN   = 0x40;
	this.FLIP   = 0x80;
	this.TURNFLIP = this.TURN|this.FLIP;

	this.EXPANDUP = this.EXPAND|k.UP;
	this.EXPANDDN = this.EXPAND|k.DN;
	this.EXPANDLT = this.EXPAND|k.LT;
	this.EXPANDRT = this.EXPAND|k.RT;

	this.REDUCEUP = this.REDUCE|k.UP;
	this.REDUCEDN = this.REDUCE|k.DN;
	this.REDUCELT = this.REDUCE|k.LT;
	this.REDUCERT = this.REDUCE|k.RT;

	this.TURNL = this.TURN|1;
	this.TURNR = this.TURN|2;

	this.FLIPX = this.FLIP|1;
	this.FLIPY = this.FLIP|2;

	this.boardtype = {
		expandup: [this.REDUCEUP, this.EXPANDUP],
		expanddn: [this.REDUCEDN, this.EXPANDDN],
		expandlt: [this.REDUCELT, this.EXPANDLT],
		expandrt: [this.REDUCERT, this.EXPANDRT],
		reduceup: [this.EXPANDUP, this.REDUCEUP],
		reducedn: [this.EXPANDDN, this.REDUCEDN],
		reducelt: [this.EXPANDLT, this.REDUCELT],
		reducert: [this.EXPANDRT, this.REDUCERT],

		turnl: [this.TURNR, this.TURNL],
		turnr: [this.TURNL, this.TURNR],
		flipy: [this.FLIPY, this.FLIPY],
		flipx: [this.FLIPX, this.FLIPX]
	};
};
MenuExec.prototype = {
	//------------------------------------------------------------------------------
	// menu.ex.init() �I�u�W�F�N�g�̏���������
	//------------------------------------------------------------------------------
	init : function(){
		if(typeof FileReader == 'undefined'){
			this.reader = null;

			if(typeof FileList != 'undefined' &&
			   typeof File.prototype.getAsText != 'undefined')
			{
				this.enableGetText = true;
			}
		}
		else{
			this.reader = new FileReader();
			this.reader.onload = ee.ebinder(this, function(e){
				this.fileonload(ee.getSrcElement(e).result);
			});
		}
	},

	//------------------------------------------------------------------------------
	// menu.ex.modechange() ���[�h�ύX���̏������s��
	//------------------------------------------------------------------------------
	modechange : function(num){
		k.editmode = (num==1);
		k.playmode = (num==3);
		kc.prev = -1;
		ans.errDisp=true;
		bd.errclear();
		if(kp.ctl[1].enable || kp.ctl[3].enable){ pp.funcs.keypopup();}
		tc.setAlign();
		pc.paintAll();
	},

	//------------------------------------------------------------------------------
	// menu.ex.newboard()  �V�K�Ֆʂ��쐬����
	//------------------------------------------------------------------------------
	newboard : function(e){
		if(menu.pop){
			var col,row;
			if(k.puzzleid!=="sudoku"){
				col = mf(parseInt(document.newboard.col.value));
				row = mf(parseInt(document.newboard.row.value));
			}
			else{
				if     (document.newboard.size[0].checked){ col=row= 9;}
				else if(document.newboard.size[1].checked){ col=row=16;}
				else if(document.newboard.size[2].checked){ col=row=25;}
				else if(document.newboard.size[3].checked){ col=row= 4;}
			}

			if(col>0 && row>0){ bd.initBoardSize(col,row);}
			menu.popclose();

			base.resetInfo(true);
			base.resize_canvas();				// Canvas���X�V����
		}
	},

	//------------------------------------------------------------------------------
	// menu.ex.urlinput()   URL����͂���
	// menu.ex.urloutput()  URL���o�͂���
	// menu.ex.openurl()    �u����URL���J���v�����s����
	//------------------------------------------------------------------------------
	urlinput : function(e){
		if(menu.pop){
			enc.parseURI(document.urlinput.ta.value);
			enc.pzlinput();

			tm.reset();
			menu.popclose();
		}
	},
	urloutput : function(e){
		if(menu.pop){
			switch(ee.getSrcElement(e).name){
				case "pzprv3":     document.urloutput.ta.value = enc.pzloutput(enc.PZPRV3);  break;
				case "pzprapplet": document.urloutput.ta.value = enc.pzloutput(enc.PAPRAPP); break;
				case "kanpen":     document.urloutput.ta.value = enc.pzloutput(enc.KANPEN);  break;
				case "pzprv3edit": document.urloutput.ta.value = enc.pzloutput(enc.PZPRV3E); break;
				case "heyaapp":    document.urloutput.ta.value = enc.pzloutput(enc.HEYAAPP); break;
			}
		}
	},
	openurl : function(e){
		if(menu.pop){
			if(document.urloutput.ta.value!==''){
				var win = window.open(document.urloutput.ta.value, '', '');
			}
		}
	},

	//------------------------------------------------------------------------------
	// menu.ex.fileopen()   �t�@�C�����J��
	// menu.ex.fileonload() File API�p�t�@�C�����J�����C�x���g�̏���
	// menu.ex.filesave()   �t�@�C����ۑ�����
	//------------------------------------------------------------------------------
	fileopen : function(e){
		if(menu.pop){ menu.popclose();}
		var fileEL = document.fileform.filebox;

		if(!!this.reader || this.enableGetText){
			var fitem = fileEL.files[0];
			if(!fitem){ return;}

			if(!!this.reader){ this.reader.readAsText(fitem);}
			else             { this.fileonload(fitem.getAsText(''));}
		}
		else{
			if(!fileEL.value){ return;}
			document.fileform.submit();
		}

		document.fileform.reset();
		tm.reset();
	},
	fileonload : function(data){
		var farray = data.split(/[\t\r\n]+/);
		var fstr = "";
		for(var i=0;i<farray.length;i++){
			if(farray[i].match(/^http\:\/\//)){ break;}
			fstr += (farray[i]+"/");
		}

		fio.filedecode(fstr);

		document.fileform.reset();
		tm.reset();
	},

	filesave : function(ftype){
		var fname = prompt("�ۑ�����t�@�C��������͂��ĉ������B", k.puzzleid+".txt");
		if(!fname){ return;}
		var prohibit = ['\\', '/', ':', '*', '?', '"', '<', '>', '|'];
		for(var i=0;i<prohibit.length;i++){ if(fname.indexOf(prohibit[i])!=-1){ alert('�t�@�C�����Ƃ��Ďg�p�ł��Ȃ��������܂܂�Ă��܂��B'); return;} }

		document.fileform2.filename.value = fname;

		if     (navigator.platform.indexOf("Win")!==-1){ document.fileform2.platform.value = "Win";}
		else if(navigator.platform.indexOf("Mac")!==-1){ document.fileform2.platform.value = "Mac";}
		else                                           { document.fileform2.platform.value = "Others";}

		document.fileform2.ques.value   = fio.fileencode(ftype);
		document.fileform2.urlstr.value = fio.urlstr;
		document.fileform2.operation.value = 'save';

		document.fileform2.submit();
	},

	//------------------------------------------------------------------------------
	// menu.ex.imagesave() �摜��ۑ�����
	//------------------------------------------------------------------------------
	imagesave : function(isDL){
		// ���݂̐ݒ��ۑ�����
		var temp_flag   = pc.fillTextPrecisely;
		var temp_margin = k.bdmargin;
		var temp_cursor = pp.getVal('cursor');

		// �ݒ�l�E�ϐ���canvas�p�̂��̂ɕύX
		pc.fillTextPrecisely = true;
		k.bdmargin = k.bdmargin_image;
		pp.setVal('cursor', false, false);
		g = ee('divques_sub').el.getContext("2d");

		// canvas�v�f�̐ݒ��K�p���āA�ĕ`��
		base.resize_canvas();

		// canvas�̕`����e��DataURL�Ƃ��Ď擾����
		var url = g.canvas.toDataURL();

		if(isDL){
			document.fileform2.filename.value  = k.puzzleid+'.gif';
			document.fileform2.urlstr.value    = url.replace('data:image/png;base64,', '');
			document.fileform2.operation.value = 'imagesave';
			document.fileform2.submit();
		}
		else{
			window.open(url, '', '');
		}

		// �ݒ�l�E�ϐ������ɖ߂�
		pc.fillTextPrecisely = temp_flag;
		k.bdmargin = temp_margin;
		pp.setVal('cursor', temp_cursor, false);
		base.initCanvas();

		// ���̑��̐ݒ�����ɖ߂��āA�ĕ`��
		base.resize_canvas();
	},

	//------------------------------------------------------------------------------
	// menu.ex.dispsize()  Canvas�ł̃}�X�ڂ̕\���T�C�Y��ύX����
	//------------------------------------------------------------------------------
	dispsize : function(e){
		if(menu.pop){
			var csize = parseInt(document.dispsize.cs.value);
			if(csize>0){ k.cellsize = mf(csize);}

			menu.popclose();
			base.resize_canvas();	// Canvas���X�V����
		}
	},

	//---------------------------------------------------------------------------
	// menu.ex.irowakeRemake() �u�F�������Ȃ����v�{�^�������������ɐF�������Ȃ���
	//---------------------------------------------------------------------------
	irowakeRemake : function(){
		line.newIrowake();
		if(pp.getVal('irowake')){ pc.paintAll();}
	},

	//------------------------------------------------------------------------------
	// menu.ex.dispman()    �Ǘ��̈���B��/�\�����邪�����ꂽ���ɓ��삷��
	// menu.ex.dispmanstr() �Ǘ��̈���B��/�\������ɂǂ̕������\�����邩
	//------------------------------------------------------------------------------
	dispman : function(e){
		var idlist = ['expression','usepanel','checkpanel'];
		var seplist = k.EDITOR ? ['separator1'] : ['separator1','separator2'];

		if(this.displaymanage){
			for(var i=0;i<idlist.length;i++)        { ee(idlist[i])  .el.style.display = 'none';}
			for(var i=0;i<seplist.length;i++)       { ee(seplist[i]) .el.style.display = 'none';}
			if(k.irowake!=0 && pp.getVal('irowake')){ ee('btncolor2').el.style.display = 'inline';}
			ee('menuboard').el.style.paddingBottom = '0pt';
		}
		else{
			for(var i=0;i<idlist.length;i++)        { ee(idlist[i])  .el.style.display = 'block';}
			for(var i=0;i<seplist.length;i++)       { ee(seplist[i]) .el.style.display = 'block';}
			if(k.irowake!=0 && pp.getVal('irowake')){ ee("btncolor2").el.style.display = 'none';}
			ee('menuboard').el.style.paddingBottom = '8pt';
		}
		this.displaymanage = !this.displaymanage;
		this.dispmanstr();

		base.resize_canvas();	// canvas�̍�����W�����X�V���čĕ`��
	},
	dispmanstr : function(){
		if(!this.displaymanage){ ee('ms_manarea').el.innerHTML = menu.isLangJP()?"�Ǘ��̈��\��":"Show management area";}
		else                   { ee('ms_manarea').el.innerHTML = menu.isLangJP()?"�Ǘ��̈���B��":"Hide management area";}
	},

	//------------------------------------------------------------------------------
	// menu.ex.popupadjust()  "�Ֆʂ̒���""��]�E���]"�Ń{�^���������ꂽ����
	//                        �Ή�����֐��փW�����v����
	//------------------------------------------------------------------------------
	popupadjust : function(e){
		if(menu.pop){
			um.newOperation(true);

			var name = ee.getSrcElement(e).name;
			if(name.indexOf("reduce")===0){
				if(name==="reduceup"||name==="reducedn"){
					if(k.qrows<=1){ return;}
				}
				else if(name==="reducelt"||name==="reducert"){
					if(k.qcols<=1 && (k.puzzleid!=="tawa" || bd.lap!==3)){ return;}
				}
			}

			var d = {x1:0, y1:0, x2:2*k.qcols, y2:2*k.qrows};
			um.disableInfo();
			if (name.match(/(expand|reduce)/)){ this.expandreduce(this.boardtype[name][1],d);}
			else if(name.match(/(turn|flip)/)){ this.turnflip    (this.boardtype[name][1],d);}
			um.enableInfo();

			// reduce�͂����K�{
			um.addOpe(k.BOARD, name, 0, this.boardtype[name][0], this.boardtype[name][1]);

			bd.setminmax();
			if(!um.undoExec){ base.resetInfo(false);}
			base.resize_canvas();				// Canvas���X�V����
		}
	},

	//------------------------------------------------------------------------------
	// menu.ex.expandreduce() �Ֆʂ̊g��E�k�������s����
	// menu.ex.expandGroup()  �I�u�W�F�N�g�̒ǉ����s��
	// menu.ex.reduceGroup()  �I�u�W�F�N�g�̏������s��
	//------------------------------------------------------------------------------
	expandreduce : function(key,d){
		this.adjustBoardData(key,d);

		if(key & this.EXPAND){
			if     (key===this.EXPANDUP||key===this.EXPANDDN){ k.qrows++;}
			else if(key===this.EXPANDLT||key===this.EXPANDRT){ k.qcols++;}

							{ this.expandGroup(k.CELL,   key);}
			if(!!k.iscross) { this.expandGroup(k.CROSS,  key);}
			if(!!k.isborder){ this.expandGroup(k.BORDER, key);}
			if(!!k.isexcell){ this.expandGroup(k.EXCELL, key);}
		}
		else if(key & this.REDUCE){
							{ this.reduceGroup(k.CELL,   key);}
			if(!!k.iscross) { this.reduceGroup(k.CROSS,  key);}
			if(!!k.isborder){ this.reduceGroup(k.BORDER, key);}
			if(!!k.isexcell){ this.reduceGroup(k.EXCELL, key);}

			if     (key===this.REDUCEUP||key===this.REDUCEDN){ k.qrows--;}
			else if(key===this.REDUCELT||key===this.REDUCERT){ k.qcols--;}
		}

		bd.setposAll();

		this.adjustBoardData2(key,d);
	},
	expandGroup : function(type,key){
		var margin = bd.initGroup(type, k.qcols, k.qrows);
		var group = bd.getGroup(type);
		for(var i=group.length-1;i>=0;i--){
			if(!!this.insex[type][this.distObj(type,i,key)]){
				group[i] = bd.newObject(type,i);
				margin--;
			}
			else if(margin>0){ group[i] = group[i-margin];}
		}

		if(type===k.BORDER){ this.expandborder(key);}
	},
	reduceGroup : function(type,key){
		if(type===k.BORDER){ this.reduceborder(key);}

		var margin=0, group = bd.getGroup(type);
		for(var i=0;i<group.length;i++){
			if(!!this.insex[type][this.distObj(type,i,key)]){
				if(!group[i].isempty()){ um.addObj(type,i);}
				margin++;
			}
			else if(margin>0){ group[i-margin] = group[i];}
		}
		for(var i=0;i<margin;i++){ group.pop();}
	},

	//------------------------------------------------------------------------------
	// menu.ex.turnflip()      ��]�E���]���������s����
	// menu.ex.turnflipGroup() turnflip()��������I�ɌĂ΂���]���s��
	//------------------------------------------------------------------------------
	turnflip : function(key,d){
		this.adjustBoardData(key,d);

		if(key & this.TURN){
			var tmp = k.qcols; k.qcols = k.qrows; k.qrows = tmp;
			bd.setposAll();
			d = {x1:0, y1:0, x2:2*k.qcols, y2:2*k.qrows};
		}

						  { this.turnflipGroup(k.CELL,   key, d);}
		if(!!k.iscross)   { this.turnflipGroup(k.CROSS,  key, d);}
		if(!!k.isborder)  { this.turnflipGroup(k.BORDER, key, d);}
		if(k.isexcell===2){ this.turnflipGroup(k.EXCELL, key, d);}
		else if(k.isexcell===1 && (key & this.FLIP)){
			var d2 = {x1:d.x1, y1:d.y1, x2:d.x2, y2:d.y2};
			if     (key===this.FLIPY){ d2.x1 = d2.x2 = -1;}
			else if(key===this.FLIPX){ d2.y1 = d2.y2 = -1;}
			this.turnflipGroup(k.EXCELL, key, d2);
		}

		bd.setposAll();

		this.adjustBoardData2(key,d);
	},
	turnflipGroup : function(type,key,d){
		var ch=[], idlist=bd.objectinside(type,d.x1,d.y1,d.x2,d.y2);
		for(var i=0;i<idlist.length;i++){ ch[idlist[i]]=false;}

		var group = bd.getGroup(type);
		var xx=(d.x1+d.x2), yy=(d.y1+d.y2);
		for(var source=0;source<group.length;source++){
			if(ch[source]!==false){ continue;}

			var tmp = group[source], target = source;
			while(ch[target]===false){
				ch[target]=true;
				// next�ɂȂ���̂�target�Ɉړ����Ă���A�A�Ƃ����l�������B
				// �����ł͈ړ��O��ID���擾���Ă��܂�
				switch(key){
					case this.FLIPY: next = bd.idnum(type, group[target].bx, yy-group[target].by); break;
					case this.FLIPX: next = bd.idnum(type, xx-group[target].bx, group[target].by); break;
					case this.TURNR: next = bd.idnum(type, group[target].by, xx-group[target].bx, k.qrows, k.qcols); break;
					case this.TURNL: next = bd.idnum(type, yy-group[target].by, group[target].bx, k.qrows, k.qcols); break;
				}

				if(ch[next]===false){
					group[target] = group[next];
					target = next;
				}
				else{
					group[target] = tmp;
					break;
				}
			}
		}
	},

	//---------------------------------------------------------------------------
	// menu.ex.distObj()      �㉺���E�����ꂩ�̊O�g�Ƃ̋��������߂�
	//---------------------------------------------------------------------------
	distObj : function(type,id,key){
		var obj;
		if     (type===k.CELL)  { obj = bd.cell[id];}
		else if(type===k.CROSS) { obj = bd.cross[id];}
		else if(type===k.BORDER){ obj = bd.border[id];}
		else if(type===k.EXCELL){ obj = bd.excell[id];}
		else{ return -1;}

		key &= 0x0F;
		if     (key===k.UP){ return obj.by;}
		else if(key===k.DN){ return 2*k.qrows-obj.by;}
		else if(key===k.LT){ return obj.bx;}
		else if(key===k.RT){ return 2*k.qcols-obj.bx;}
		return -1;
	},

	//---------------------------------------------------------------------------
	// menu.ex.expandborder() �Ֆʂ̊g�厞�A���E����L�΂�
	// menu.ex.reduceborder() �Ֆʂ̏k�����A�����ړ�����
	// menu.ex.copyBorder()   (expand/reduceBorder�p) �w�肵���f�[�^���R�s�[����
	// menu.ex.innerBorder()  (expand/reduceBorder�p) �ЂƂ����ɓ�����border��id��Ԃ�
	// menu.ex.outerBorder()  (expand/reduceBorder�p) �ЂƂO���ɍs����border��id��Ԃ�
	//---------------------------------------------------------------------------
	expandborder : function(key){
		// borderAsLine����Ȃ�Undo���́A��ŃI�u�W�F�N�g��������̂ŉ��̏����̓p�X
		if(k.isborderAsLine || !um.undoExec){
			// ���O��expandGroup�ŁAbx,by�v���p�e�B���s��Ȃ܂܂Ȃ̂Őݒ肷��
			bd.setposBorders();

			for(var id=0;id<bd.bdmax;id++){
				if(this.distObj(k.BORDER,id,key)!==(k.isborderAsLine?2:1)){ continue;}

				var source = (k.isborderAsLine ? this.outerBorder(id,key) : this.innerBorder(id,key));
				this.copyBorder(id,source);
				if(k.isborderAsLine){ bd.border[source].allclear(source);}
			}
		}
	},
	reduceborder : function(key){
		if(k.isborderAsLine){
			for(var id=0;id<bd.bdmax;id++){
				if(this.distObj(k.BORDER,id,key)!==0){ continue;}

				var source = this.innerBorder(id,key);
				this.copyBorder(id,source);
			}
		}
	},

	copyBorder : function(id1,id2){
		bd.border[id1].ques  = bd.border[id2].ques;
		bd.border[id1].qans  = bd.border[id2].qans;
		if(k.isborderAsLine){
			bd.border[id1].qsub  = bd.border[id2].qsub;
			bd.border[id1].color = bd.border[id2].color;
		}
	},
	innerBorder : function(id,key){
		var bx=bd.border[id].bx, by=bd.border[id].by;
		key &= 0x0F;
		if     (key===k.UP){ return bd.bnum2(bx, by+2, k.qcols, k.qrows);}
		else if(key===k.DN){ return bd.bnum2(bx, by-2, k.qcols, k.qrows);}
		else if(key===k.LT){ return bd.bnum2(bx+2, by, k.qcols, k.qrows);}
		else if(key===k.RT){ return bd.bnum2(bx-2, by, k.qcols, k.qrows);}
		return -1;
	},
	outerBorder : function(id,key){
		var bx=bd.border[id].bx, by=bd.border[id].by;
		key &= 0x0F;
		if     (key===k.UP){ return bd.bnum2(bx, by-2, k.qcols, k.qrows);}
		else if(key===k.DN){ return bd.bnum2(bx, by+2, k.qcols, k.qrows);}
		else if(key===k.LT){ return bd.bnum2(bx-2, by, k.qcols, k.qrows);}
		else if(key===k.RT){ return bd.bnum2(bx+2, by, k.qcols, k.qrows);}
		return -1;
	},

	//------------------------------------------------------------------------------
	// menu.ex.adjustBoardData()  ��]�E���]�J�n�O�Ɋe�Z���̒��߂��s��(���ʏ���)
	// menu.ex.adjustBoardData2() ��]�E���]�I����Ɋe�Z���̒��߂��s��(���ʏ���)
	// 
	// menu.ex.adjustSpecial()    ��]�E���]�E�Ֆʒ��ߊJ�n�O�Ɋe�Z���̒��߂��s��(�e�p�Y���̃I�[�o�[���C�h�p)
	// menu.ex.adjustSpecial2()   ��]�E���]�E�Ֆʒ��ߏI����Ɋe�Z���̒��߂��s��(�e�p�Y���̃I�[�o�[���C�h�p)
	// 
	// menu.ex.adjustQues51_1()   [�_]�Z���̒���(adjustSpecial�֐��ɑ������p)
	// menu.ex.adjustQues51_2()   [�_]�Z���̒���(adjustSpecial2�֐��ɑ������p)
	//------------------------------------------------------------------------------
	adjustBoardData : function(key,d){
		um.disableRecord();

		this.adjustSpecial.call(this,key,d);

		var clist = bd.cellinside(d.x1,d.y1,d.x2,d.y2);
		switch(key){
		case this.FLIPY: // �㉺���]
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(true){
					var val = ({2:5,3:4,4:3,5:2,104:107,105:106,106:105,107:104})[bd.QuC(c)];
					if(!isNaN(val)){ bd.sQuC(c,val);}
				}
				if(k.isexcell!==1){
					var val = ({1:2,2:1})[bd.DiC(c)];
					if(!isNaN(val)){ bd.sDiC(c,val);}
				}
			}
			break;

		case this.FLIPX: // ���E���]
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(true){
					var val = ({2:3,3:2,4:5,5:4,104:105,105:104,106:107,107:106})[bd.QuC(c)];
					if(!isNaN(val)){ bd.sQuC(c,val);}
				}
				if(k.isexcell!==1){
					var val = ({3:4,4:3})[bd.DiC(c)];
					if(!isNaN(val)){ bd.sDiC(c,val);}
				}
			}
			break;

		case this.TURNR: // �E90�����]
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(true){
					var val = {2:5,3:2,4:3,5:4,21:22,22:21,102:103,103:102,104:107,105:104,106:105,107:106}[bd.QuC(c)];
					if(!isNaN(val)){ bd.sQuC(c,val);}
				}
				if(k.isexcell!==1){
					var val = {1:4,2:3,3:1,4:2}[bd.DiC(c)];
					if(!isNaN(val)){ bd.sDiC(c,val);}
				}
			}
			break;

		case this.TURNL: // ��90�����]
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(true){
					var val = {2:3,3:4,4:5,5:2,21:22,22:21,102:103,103:102,104:105,105:106,106:107,107:104}[bd.QuC(c)];
					if(!isNaN(val)){ bd.sQuC(c,val);}
				}
				if(k.isexcell!==1){
					var val = {1:3,2:4,3:2,4:1}[bd.DiC(c)];
					if(!isNaN(val)){ bd.sDiC(c,val);}
				}
			}
			break;
		}
		um.enableRecord();

		if((key & this.REDUCE) && k.roomNumber){
			this.qnums = [];
			for(var i=0;i<bd.cell.length;i++){
				if(!!this.insex[k.CELL][this.distObj(k.CELL,i,key)] && bd.cell[i].qnum!==-1){
					this.qnums.push({ areaid:area.getRoomID(i), val:bd.cell[i].qnum});
				}
			}
		}
	},
	adjustBoardData2 : function(key,d){
		if((key & this.REDUCE) && k.roomNumber){
			area.resetArea();
			for(var i=0;i<this.qnums.length;i++){
				bd.sQnC(area.getTopOfRoom(this.qnums[i].areaid), this.qnums[i].val);
			}
		}

		um.disableRecord();
		this.adjustSpecial2.call(this,key,d);
		um.enableRecord();
	},
	adjustSpecial  : function(key,d){ },
	adjustSpecial2 : function(key,d){ },

	adjustQues51_1 : function(key,d){
		this.qnumw = [];
		this.qnumh = [];

		for(var by=(d.y1|1);by<=d.y2;by+=2){
			this.qnumw[by] = [bd.QnE(bd.exnum(-1,by))];
			for(var bx=(d.x1|1);bx<=d.x2;bx+=2){
				if(bd.QuC(bd.cnum(bx,by))===51){ this.qnumw[by].push(bd.QnC(bd.cnum(bx,by)));}
			}
		}
		for(var bx=(d.x1|1);bx<=d.x2;bx+=2){
			this.qnumh[bx] = [bd.DiE(bd.exnum(bx,-1))];
			for(var by=(d.y1|1);by<=d.y2;by+=2){
				if(bd.QuC(bd.cnum(bx,by))===51){ this.qnumh[bx].push(bd.DiC(bd.cnum(bx,by)));}
			}
		}
	},
	adjustQues51_2 : function(key,d){
		var xx=(d.x1+d.x2), yy=(d.y1+d.y2), idx;

		switch(key){
		case this.FLIPY: // �㉺���]
			for(var bx=(d.x1|1);bx<=d.x2;bx+=2){
				idx = 1; this.qnumh[bx] = this.qnumh[bx].reverse();
				bd.sDiE(bd.exnum(bx,-1), this.qnumh[bx][0]);
				for(var by=(d.y1|1);by<=d.y2;by+=2){
					if(bd.QuC(bd.cnum(bx,by))===51){ bd.sDiC(bd.cnum(bx,by), this.qnumh[bx][idx]); idx++;}
				}
			}
			break;

		case this.FLIPX: // ���E���]
			for(var by=(d.y1|1);by<=d.y2;by+=2){
				idx = 1; this.qnumw[by] = this.qnumw[by].reverse();
				bd.sQnE(bd.exnum(-1,by), this.qnumw[by][0]);
				for(var bx=(d.x1|1);bx<=d.x2;bx+=2){
					if(bd.QuC(bd.cnum(bx,by))===51){ bd.sQnC(bd.cnum(bx,by), this.qnumw[by][idx]); idx++;}
				}
			}
			break;

		case this.TURNR: // �E90�����]
			for(var by=(d.y1|1);by<=d.y2;by+=2){
				idx = 1; this.qnumh[by] = this.qnumh[by].reverse();
				bd.sQnE(bd.exnum(-1,by), this.qnumh[by][0]);
				for(var bx=(d.x1|1);bx<=d.x2;bx+=2){
					if(bd.QuC(bd.cnum(bx,by))===51){ bd.sQnC(bd.cnum(bx,by), this.qnumh[by][idx]); idx++;}
				}
			}
			for(var bx=(d.x1|1);bx<=d.x2;bx+=2){
				idx = 1;
				bd.sDiE(bd.exnum(bx,-1), this.qnumw[xx-bx][0]);
				for(var by=(d.y1|1);by<=d.y2;by+=2){
					if(bd.QuC(bd.cnum(bx,by))===51){ bd.sDiC(bd.cnum(bx,by), this.qnumw[xx-bx][idx]); idx++;}
				}
			}
			break;

		case this.TURNL: // ��90�����]
			for(var by=(d.y1|1);by<=d.y2;by+=2){
				idx = 1;
				bd.sQnE(bd.exnum(-1,by), this.qnumh[yy-by][0]);
				for(var bx=(d.x1|1);bx<=d.x2;bx+=2){
					if(bd.QuC(bd.cnum(bx,by))===51){ bd.sQnC(bd.cnum(bx,by), this.qnumh[yy-by][idx]); idx++;}
				}
			}
			for(var bx=(d.x1|1);bx<=d.x2;bx+=2){
				idx = 1; this.qnumw[bx] = this.qnumw[bx].reverse();
				bd.sDiE(bd.exnum(bx,-1), this.qnumw[bx][0]);
				for(var by=(d.y1|1);by<=d.y2;by+=2){
					if(bd.QuC(bd.cnum(bx,by))===51){ bd.sDiC(bd.cnum(bx,by), this.qnumw[bx][idx]); idx++;}
				}
			}
			break;
		}
	},

	//------------------------------------------------------------------------------
	// menu.ex.ACconfirm()  �u�񓚏����v�{�^�����������Ƃ��̏���
	// menu.ex.ASconfirm()  �u�⏕�����v�{�^�����������Ƃ��̏���
	//------------------------------------------------------------------------------
	ACconfirm : function(){
		if(confirm(menu.isLangJP()?"�񓚂��������܂����H":"Do you want to erase the Answer?")){
			um.newOperation(true);
			{
				for(var i=0;i<bd.cellmax;i++){
					if(bd.cell[i].qans!==bd.defcell.qans){ um.addOpe(k.CELL,k.QANS,i,bd.cell[i].qans,bd.defcell.qans);}
					if(bd.cell[i].qsub!==bd.defcell.qsub){ um.addOpe(k.CELL,k.QSUB,i,bd.cell[i].qsub,bd.defcell.qsub);}
				}
			}
			if(!!k.isborder){
				for(var i=0;i<bd.bdmax;i++){
					if(bd.border[i].qans!==bd.defborder.qans){ um.addOpe(k.BORDER,k.QANS,i,bd.border[i].qans,bd.defborder.qans);}
					if(bd.border[i].line!==bd.defborder.line){ um.addOpe(k.BORDER,k.LINE,i,bd.border[i].line,bd.defborder.line);}
					if(bd.border[i].qsub!==bd.defborder.qsub){ um.addOpe(k.BORDER,k.QSUB,i,bd.border[i].qsub,bd.defborder.qsub);}
				}
			}

			bd.ansclear();
			base.resetInfo(false);
			pc.paintAll();
		}
	},
	ASconfirm : function(){
		if(confirm(menu.isLangJP()?"�⏕�L�����������܂����H":"Do you want to erase the auxiliary marks?")){
			um.newOperation(true);
			{
				for(var i=0;i<bd.cellmax;i++){
					if(bd.cell[i].qsub!==bd.defcell.qsub){ um.addOpe(k.CELL,k.QSUB,i,bd.cell[i].qsub,bd.defcell.qsub);}
				}
			}
			if(!!k.isborder){
				for(var i=0;i<bd.bdmax;i++){
					if(bd.border[i].qsub!==bd.defborder.qsub){ um.addOpe(k.BORDER,k.QSUB,i,bd.border[i].qsub,bd.defborder.qsub);}
				}
			}

			bd.subclear();
			pc.paintAll();
		}
	}
};

//---------------------------------------------------------------------------
// ��AreaInfo�N���X ��ɐF�����̏����Ǘ�����
//   id : -1     �ǂ̕����ɂ������Ȃ��Z��(���}�X���Ŕ��}�X�̃Z���A��)
//         0     �ǂ̕����ɑ������邩�̏�����
//         1�ȏ� ���̔ԍ��̕����ɑ�����
//---------------------------------------------------------------------------
AreaInfo = function(){
	this.max  = 0;	// �ő�̕����ԍ�(1�`max�܂ő��݂���悤�\�����Ă�������)
	this.id   = [];	// �e�Z��/���Ȃǂ������镔���ԍ���ێ�����
	this.room = [];	// �e������idlist���̏���ێ�����(info.room[id].idlist�Ŏ擾)
};

//---------------------------------------------------------------------------
// ��LineManager�N���X ��ɐF�����̏����Ǘ�����
//---------------------------------------------------------------------------
// LineManager�N���X�̒�`
LineManager = function(){
	this.lcnt    = [];
	this.ltotal  = [];

	this.disableLine = (!k.isCenterLine && !k.isborderAsLine);
	this.data    = {};	// ��id���

	this.typeA = 'A';
	this.typeB = 'B';
	this.typeC = 'C';

	this.init();
};
LineManager.prototype = {

	//---------------------------------------------------------------------------
	// line.init()        �ϐ��̋N�����̏��������s��
	// line.resetLcnts()  lcnts���̕ϐ��̏��������s��
	// line.newIrowake()  ���̏�񂪍č\�z���ꂽ�ہA���ɐF������
	// line.lcntCell()    �Z���ɑ��݂�����̖{����Ԃ�
	//---------------------------------------------------------------------------
	init : function(){
		if(this.disableLine){ return;}

		// lcnt, ltotal�ϐ�(�z��)������
		if(k.isCenterLine){
			for(var c=0;c<bd.cellmax;c++){ this.lcnt[c]=0;}
			this.ltotal=[(k.qcols*k.qrows), 0, 0, 0, 0];
		}
		else{
			for(var c=0,len=(k.qcols+1)*(k.qrows+1);c<len;c++){ this.lcnt[c]=0;}
			this.ltotal=[((k.qcols+1)*(k.qrows+1)), 0, 0, 0, 0];
		}

		// ���̑��̕ϐ�������
		this.data = {max:0,id:[]};
		for(var id=0;id<bd.bdmax;id++){ this.data.id[id] = -1;}
	},

	resetLcnts : function(){
		if(this.disableLine){ return;}

		this.init();
		var bid = [];
		for(var id=0;id<bd.bdmax;id++){
			if(bd.isLine(id)){
				this.data.id[id] = 0;
				bid.push(id);

				var cc1, cc2;
				if(k.isCenterLine){ cc1 = bd.border[id].cellcc[0];  cc2 = bd.border[id].cellcc[1]; }
				else              { cc1 = bd.border[id].crosscc[0]; cc2 = bd.border[id].crosscc[1];}

				if(cc1!=-1){ this.ltotal[this.lcnt[cc1]]--; this.lcnt[cc1]++; this.ltotal[this.lcnt[cc1]]++;}
				if(cc2!=-1){ this.ltotal[this.lcnt[cc2]]--; this.lcnt[cc2]++; this.ltotal[this.lcnt[cc2]]++;}
			}
			else{
				this.data.id[id] = -1;
			}
		}
		this.lc0main(bid);
		if(k.irowake!==0){ this.newIrowake();}
	},
	newIrowake : function(){
		for(var i=1;i<=this.data.max;i++){
			var idlist = this.data[i].idlist;
			if(idlist.length>0){
				var newColor = pc.getNewLineColor();
				for(var n=0;n<idlist.length;n++){
					bd.border[idlist[n]].color = newColor;
				}
			}
		}
	},
	lcntCell  : function(cc){ return (cc!=-1?this.lcnt[cc]:0);},

	//---------------------------------------------------------------------------
	// line.gettype()    ���������ꂽ/�����ꂽ���ɁAtypeA/typeB/typeC�̂����ꂩ���肷��
	// line.isTpos()     piece���A�w�肳�ꂽcc����id�̔��Α��ɂ��邩���肷��
	// line.iscrossing() �w�肳�ꂽ�Z��/��_�Ő�����������ꍇ��true��Ԃ�
	//---------------------------------------------------------------------------
	gettype : function(cc,id,val){
		var erase = (val>0?0:1);
		if(cc===-1){
			return this.typeA;
		}
		else if(!this.iscrossing(cc)){
			return ((this.lcnt[cc]===(1-erase))?this.typeA:this.typeB);
		}
		else{
			if     (this.lcnt[cc]===(1-erase) || (this.lcnt[cc]===(3-erase) && this.isTpos(cc,id))){ return this.typeA;}
			else if(this.lcnt[cc]===(2-erase) ||  this.lcnt[cc]===(4-erase)){ return this.typeB;}
			return this.typeC;
		}
	},
	isTpos : function(cc,id){
		//   �� ��id                    
		// ������                       
		//   �E �����̏ꏊ�ɐ������邩�H
		if(k.isCenterLine){
			return !bd.isLine(bd.bnum( 2*bd.cell[cc].bx-bd.border[id].bx, 2*bd.cell[cc].by-bd.border[id].by ));
		}
		else{
			return !bd.isLine(bd.bnum( 4*(cc%(k.qcols+1))-bd.border[id].bx, 4*mf(cc/(k.qcols+1))-bd.border[id].by ));
		}
	},
	iscrossing : function(cc){ return k.isLineCross;},

	//---------------------------------------------------------------------------
	// line.setLine()         ���������ꂽ������ꂽ���ɁAlcnt�ϐ�����̏��𐶐����Ȃ���
	// line.setLineInfo()     ���������ꂽ���ɁA���̏��𐶐����Ȃ���
	// line.removeLineInfo()  ���������ꂽ���ɁA���̏��𐶐����Ȃ���
	// line.combineLineInfo() ���������ꂽ���ɁA����̐����S�Ă�������1�̐���
	//                        �ł���ꍇ�̐�id�̍Đݒ���s��
	// line.remakeLineInfo()  ���������ꂽ������ꂽ���A�V����2�ȏ�̐����ł���
	//                        �\��������ꍇ�̐�id�̍Đݒ���s��
	//---------------------------------------------------------------------------
	setLine : function(id, val){
		if(this.disableLine){ return;}
		val = (val>0?1:0);

		var cc1, cc2;
		if(k.isCenterLine){ cc1 = bd.border[id].cellcc[0];  cc2 = bd.border[id].cellcc[1]; }
		else              { cc1 = bd.border[id].crosscc[0]; cc2 = bd.border[id].crosscc[1];}

		if(val>0){
			if(cc1!=-1){ this.ltotal[this.lcnt[cc1]]--; this.lcnt[cc1]++; this.ltotal[this.lcnt[cc1]]++;}
			if(cc2!=-1){ this.ltotal[this.lcnt[cc2]]--; this.lcnt[cc2]++; this.ltotal[this.lcnt[cc2]]++;}
		}
		else{
			if(cc1!=-1){ this.ltotal[this.lcnt[cc1]]--; this.lcnt[cc1]--; this.ltotal[this.lcnt[cc1]]++;}
			if(cc2!=-1){ this.ltotal[this.lcnt[cc2]]--; this.lcnt[cc2]--; this.ltotal[this.lcnt[cc2]]++;}
		}

		//---------------------------------------------------------------------------
		// (A)�������Ȃ�                        (B)�P��������
		//     �E      ��    - ���������lcnt=1     ��      ��    - �����Ȃ���lcnt=2�`4
		//   �E ��   �E����  - �����Ȃ���lcnt=1   �E����  ������  - ���������lcnt=2or4
		//     �E      ��    - ���������lcnt=3     �E      ��                         
		// 
		// (C)���G������
		//    ��        ��   - ���������lcnt=3(���̃p�^�[��)
		//  �����E => ������   �����̐���񂪕ʁX�ɂȂ��Ă��܂�
		//    �E        �E   
		//---------------------------------------------------------------------------
		var type1 = this.gettype(cc1,id,val), type2 = this.gettype(cc2,id,val);
		if(val>0){
			// (A)+(A)�̏ꍇ -> �V������id�����蓖�Ă�
			if(type1===this.typeA && type2===this.typeA){
				this.data.max++;
				this.data[this.data.max] = {idlist:[id]};
				this.data.id[id] = this.data.max;
				bd.border[id].color = pc.getNewLineColor();
			}
			// (A)+(B)�̏ꍇ -> �����̐��ɂ�������
			else if((type1===this.typeA && type2===this.typeB) || (type1===this.typeB && type2===this.typeA)){
				var bid = (this.getbid(id,1))[0];
				this.data[this.data.id[bid]].idlist.push(id);
				this.data.id[id] = this.data.id[bid];
				bd.border[id].color = bd.border[bid].color;
			}
			// (B)+(B)�̏ꍇ -> �����������ŁA�傫�����̐�id�ɓ��ꂷ��
			else if(type1===this.typeB && type2===this.typeB){
				this.combineLineInfo(id);
			}
			// ���̑��̏ꍇ
			else{
				this.remakeLineInfo(id,1);
			}
		}
		else{
			// (A)+(A)�̏ꍇ -> ��id���̂����ł�����
			if(type1===this.typeA && type2===this.typeA){
				this.data[this.data.id[id]] = {idlist:[]};
				this.data.id[id] = -1;
				bd.border[id].color = "";
			}
			// (A)+(B)�̏ꍇ -> �����̐������菜��
			else if((type1===this.typeA && type2===this.typeB) || (type1===this.typeB && type2===this.typeA)){
				var ownid = this.data.id[id], idlist = this.data[ownid].idlist;
				for(var i=0;i<idlist.length;i++){ if(idlist[i]===id){ idlist.splice(i,1); break;} }
				this.data.id[id] = -1;
				bd.border[id].color = "";
			}
			// (B)+(B)�̏ꍇ�A���̑��̏ꍇ -> �����ꂽ���ɂ��ꂼ��V������id���ӂ�
			else{
				this.remakeLineInfo(id,0);
				bd.border[id].color = "";
			}
		}
	},

	combineLineInfo : function(id){
		var dataid = this.data.id;

		// ���̊֐��̓˓��������Abid.length�͕K��2�ɂȂ�
		// ���Ȃ�Ȃ�����... ����������ID���͕K��2�ȉ��ɂȂ�
		var bid = this.getbid(id,1);
		var did = [dataid[bid[0]], -1];
		for(var i=0;i<bid.length;i++){
			if(did[0]!=dataid[bid[i]]){
				did[1]=dataid[bid[i]];
				break;
			}
		}

		var newColor = bd.border[bid[0]].color;
		// ����������ID����2��ނ̏ꍇ
		if(did[1] != -1){
			// �ǂ����������́H
			var longid = did[0], shortid = did[1];
			if(this.data[did[0]].idlist.length < this.data[did[1]].idlist.length){
				longid=did[1]; shortid=did[0];
				newColor = bd.border[bid[1]].color;
			}

			// �Ȃ��������͑S�ē���ID�ɂ���
			var longidlist  = this.data[longid].idlist;
			var shortidlist = this.data[shortid].idlist;
			for(var n=0,len=shortidlist.length;n<len;n++){
				longidlist.push(shortidlist[n]);
				dataid[shortidlist[n]] = longid;
			}
			this.data[shortid].idlist = [];

			longidlist.push(id);
			dataid[id] = longid;

			// �F�𓯂��ɂ���
			for(var i=0,len=longidlist.length;i<len;i++){
				bd.border[longidlist[i]].color = newColor;
			}
			this.repaintLine(longidlist, id);
		}
		// ����������ID����1��ނ̏ꍇ => �����̐��ɂ�������
		else{
			this.data[did[0]].idlist.push(id);
			dataid[id] = did[0];
			bd.border[id].color = newColor;
		}
	},
	remakeLineInfo : function(id,val){
		var dataid = this.data.id;
		var oldmax = this.data.max;	// ���܂܂ł�this.data.max�l

		// �Ȃ�������ID����U0�ɂ��āAmax+1, max+2, ...������U�肵�Ȃ����֐�

		// �Ȃ��������̐�������U0�ɂ���
		var bid = this.getbid(id,val);
		var oldlongid = dataid[bid[0]], longColor = bd.border[bid[0]].color;
		for(var i=0,len=bid.length;i<len;i++){
			var current = dataid[bid[i]];
			if(current<=0){ continue;}
			var idlist = this.data[current].idlist;
			if(this.data[oldlongid].idlist.length < idlist.length){
				oldlongid = current;
				longColor = bd.border[bid[i]].color;
			}
			for(var n=0,len2=idlist.length;n<len2;n++){ dataid[idlist[n]] = 0;}
			this.data[current] = {idlist:[]};
		}

		// ������ID�̏���ύX����
		if(val>0){ dataid[id] =  0; bid.unshift(id);}
		else     { dataid[id] = -1;}

		// �V����id��ݒ肷��
		this.lc0main(bid);

		// �ł������ł����Ƃ��������ɁA�]���ł������������̐F���p������
		// ����ȊO�̐��ɂ͐V�����F��t������

		// �ł������̒��ł����Ƃ��������̂��擾����
		var newlongid = oldmax+1;
		for(var current=oldmax+1;current<=this.data.max;current++){
			var idlist = this.data[current].idlist;
			if(this.data[newlongid].idlist.length<idlist.length){ newlongid = current;}
		}

		// �V�����F�̐ݒ�
		for(var current=oldmax+1;current<=this.data.max;current++){
			var newColor = (current===newlongid ? longColor : pc.getNewLineColor());
			var idlist = this.data[current].idlist;
			for(var n=0,len=idlist.length;n<len;n++){ bd.border[idlist[n]].color = newColor;}
			this.repaintLine(idlist, id);
		}
	},

	//---------------------------------------------------------------------------
	// line.repaintLine()  �ЂƂȂ���̐����ĕ`�悷��
	// line.repaintParts() repaintLine()�֐��ŁA����ɏォ��`�悵�Ȃ�����������������
	//                     canvas�`�掞�̂݌Ă΂�܂�(���͕`�悵�Ȃ����K�v�Ȃ�)
	// line.getClistFromIdlist() idlist�̐����d�Ȃ�Z���̃��X�g���擾����
	// line.getXlistFromIdlist() idlist�̐����d�Ȃ��_�̃��X�g���擾����
	//---------------------------------------------------------------------------
	repaintLine : function(idlist, id){
		if(!pp.getVal('irowake')){ return;}
		var draw1 = (k.isCenterLine ? pc.drawLine1 : pc.drawBorder1);
		for(var i=0,len=idlist.length;i<len;i++){
			if(id===idlist[i]){ continue;}
			draw1.call(pc, idlist[i]);
		}
		if(g.use.canvas){ this.repaintParts(idlist);}
	},
	repaintParts : function(idlist){ }, // �I�[�o�[���C�h�p

	getClistFromIdlist : function(idlist){
		var cdata=[], clist=[];
		for(var c=0;c<bd.cellmax;c++){ cdata[c]=false;}
		for(var i=0;i<idlist.length;i++){
			cdata[bd.border[idlist[i]].cellcc[0]] = true;
			cdata[bd.border[idlist[i]].cellcc[1]] = true;
		}
		for(var c=0;c<bd.cellmax;c++){ if(cdata[c]){ clist.push(c);} }
		return clist;
	},
	getXlistFromIdlist : function(idlist){
		var cdata=[], xlist=[], crossmax=(k.qcols+1)*(k.qrows+1);
		for(var c=0;c<crossmax;c++){ cdata[c]=false;}
		for(var i=0;i<idlist.length;i++){
			cdata[bd.border[idlist[i]].crosscc[0]] = true;
			cdata[bd.border[idlist[i]].crosscc[1]] = true;
		}
		for(var c=0;c<crossmax;c++){ if(cdata[c]){ xlist.push(c);} }
		return xlist;
	},

	//---------------------------------------------------------------------------
	// line.getbid()  �w�肵��piece�Ɍq����A�ő�6�ӏ��Ɉ�����Ă������S�Ď擾����
	// line.lc0main() �w�肳�ꂽpiece�̃��X�g�ɑ΂��āAlc0�֐����Ăяo��
	// line.lc0()     �ЂƂȂ���̐���lineid��ݒ肷��(�ċA�Ăяo���p�֐�)
	//---------------------------------------------------------------------------
	getbid : function(id,val){
		var erase=(val>0?0:1), bx=bd.border[id].bx, by=bd.border[id].by;
		var dx=((k.isCenterLine^(bx%2===0))?2:0), dy=(2-dx);	// (dx,dy) = (2,0) or (0,2)

		var cc1 = bd.border[id].cellcc[0], cc2 = bd.border[id].cellcc[1];
		if(!k.isCenterLine){ cc1 = bd.border[id].crosscc[0]; cc2 = bd.border[id].crosscc[1];}
		// ���������k.isborderAsLine==true(->k.isCenterLine==false)�̃p�Y���͍���ĂȂ��͂�
		// ���܂ł̃I���p�ŊY������̂��X���U�[�{�b�N�X���炢�������悤�ȁA�A

		var lines=[];
		if(cc1!==-1){
			var iscrossing=this.iscrossing(cc1), lcnt=this.lcnt[cc1];
			if(iscrossing && lcnt>=(4-erase)){
				lines.push(bd.bnum(bx-dy,   by-dx  )); // cc1�����straight
			}
			else if(lcnt>=(2-erase) && !(iscrossing && lcnt===(3-erase) && this.isTpos(cc1,id))){
				lines.push(bd.bnum(bx-dy,   by-dx  )); // cc1�����straight
				lines.push(bd.bnum(bx-1,    by-1   )); // cc1�����curve1
				lines.push(bd.bnum(bx+dx-1, by+dy-1)); // cc1�����curve2
			}
		}
		if(cc2!==-1){
			var iscrossing=this.iscrossing(cc2), lcnt=this.lcnt[cc2];
			if(iscrossing && lcnt>=(4-erase)){
				lines.push(bd.bnum(bx+dy,   by+dx  )); // cc2�����straight
			}
			else if(lcnt>=(2-erase) && !(iscrossing && lcnt===(3-erase) && this.isTpos(cc2,id))){
				lines.push(bd.bnum(bx+dy,   by+dx  )); // cc2�����straight
				lines.push(bd.bnum(bx+1,    by+1   )); // cc2�����curve1
				lines.push(bd.bnum(bx-dx+1, by-dy+1)); // cc2�����curve2
			}
		}

		var bid = [];
		for(var i=0;i<lines.length;i++){ if(bd.isLine(lines[i])){ bid.push(lines[i]);}}
		return bid;
	},

	lc0main : function(bid){
		for(var i=0,len=bid.length;i<len;i++){
			if(this.data.id[bid[i]]!=0){ continue;}	// ����id�����Ă�����X���[
			var bx=bd.border[bid[i]].bx, by=bd.border[bid[i]].by;
			this.data.max++;
			this.data[this.data.max] = {idlist:[]};
			if(!k.isCenterLine^(bx&1)){ this.lc0(bx,by+1,1,this.data.max); this.lc0(bx,by,2,this.data.max);}
			else                      { this.lc0(bx+1,by,3,this.data.max); this.lc0(bx,by,4,this.data.max);}
		}
	},
	lc0 : function(bx,by,dir,newid){
		while(1){
			switch(dir){ case 1: by--; break; case 2: by++; break; case 3: bx--; break; case 4: bx++; break;}
			if((bx+by)%2===0){
				var cc = (k.isCenterLine?bd.cnum:bd.xnum).call(bd,bx,by);
				if(cc===-1){ break;}
				else if(this.lcnt[cc]>=3){
					if(!this.iscrossing(cc)){
						if(bd.isLine(bd.bnum(bx,by-1))){ this.lc0(bx,by,1,newid);}
						if(bd.isLine(bd.bnum(bx,by+1))){ this.lc0(bx,by,2,newid);}
						if(bd.isLine(bd.bnum(bx-1,by))){ this.lc0(bx,by,3,newid);}
						if(bd.isLine(bd.bnum(bx+1,by))){ this.lc0(bx,by,4,newid);}
						break;
					}
					/* lcnt>=3��iscrossing==true�̎��͒��i���������Ȃ� */
				}
				else{
					if     (dir!=1 && bd.isLine(bd.bnum(bx,by+1))){ dir=2;}
					else if(dir!=2 && bd.isLine(bd.bnum(bx,by-1))){ dir=1;}
					else if(dir!=3 && bd.isLine(bd.bnum(bx+1,by))){ dir=4;}
					else if(dir!=4 && bd.isLine(bd.bnum(bx-1,by))){ dir=3;}
				}
			}
			else{
				var id = bd.bnum(bx,by);
				if(this.data.id[id]!=0){ break;}
				this.data.id[id] = newid;
				this.data[newid].idlist.push(id);
			}
		}
	},

	//--------------------------------------------------------------------------------
	// line.getLineInfo()    ������AreaInfo�^�̃I�u�W�F�N�g�ŕԂ�
	// line.getLareaInfo()   ���������܂�����Z���̏���AreaInfo�^�̃I�u�W�F�N�g�ŕԂ�
	//                       (���ꂾ���͋��^�̐������@�ł���Ă܂�)
	//--------------------------------------------------------------------------------
	getLineInfo : function(){
		var info = new AreaInfo();
		for(var id=0;id<bd.bdmax;id++){ info.id[id]=(bd.isLine(id)?0:-1);}
		for(var id=0;id<bd.bdmax;id++){
			if(info.id[id]!=0){ continue;}
			info.max++;
			info.room[info.max] = {idlist:this.data[this.data.id[id]].idlist}; /* �Q�Ƃ����Ȃ̂�concat()����Ȃ��Ă悢 */
			for(var i=0;i<info.room[info.max].idlist.length;i++){
				info.id[info.room[info.max].idlist[i]] = info.max;
			}
		}
		return info;
	},
	getLareaInfo : function(){
		var linfo = new AreaInfo();
		for(var c=0;c<bd.cellmax;c++){ linfo.id[c]=(this.lcnt[c]>0?0:-1);}
		for(var c=0;c<bd.cellmax;c++){
			if(linfo.id[c]!=0){ continue;}
			linfo.max++;
			linfo.room[linfo.max] = {idlist:[]};
			this.sr0(linfo, c, linfo.max);
		}
		return linfo;
	},
	sr0 : function(linfo, i, areaid){
		linfo.id[i] = areaid;
		linfo.room[areaid].idlist.push(i);
		if( bd.isLine(bd.ub(i)) && linfo.id[bd.up(i)]===0 ){ this.sr0(linfo, bd.up(i), areaid);}
		if( bd.isLine(bd.db(i)) && linfo.id[bd.dn(i)]===0 ){ this.sr0(linfo, bd.dn(i), areaid);}
		if( bd.isLine(bd.lb(i)) && linfo.id[bd.lt(i)]===0 ){ this.sr0(linfo, bd.lt(i), areaid);}
		if( bd.isLine(bd.rb(i)) && linfo.id[bd.rt(i)]===0 ){ this.sr0(linfo, bd.rt(i), areaid);}
	}
};

//--------------------------------------------------------------------------------
// ��AreaManager�N���X ������TOP-Cell�̈ʒu���̏�������
//   �����̃N���X�ŊǗ����Ă���areaid�́A�������ȗ������邽�߂�
//     �̈�ɑ�����ID���Ȃ��Ȃ��Ă����Ƃ��Ă͏����Ă��܂���B
//     ���̂��߁A1�`max�܂őS�Ē��g�����݂��Ă���Ƃ͌���܂���B
//     �񓚃`�F�b�N��t�@�C���o�͑O�ɂ͈�UresetRarea()�����K�v�ł��B
//--------------------------------------------------------------------------------
// ������TOP�ɐ�������͂��鎞�́A�n���h�����O��
AreaManager = function(){
	this.lcnt  = [];	// ��_id -> ��_����o����̖{��

	this.room  = {};	// ��������ێ�����
	this.bcell = {};	// ���}�X����ێ�����
	this.wcell = {};	// ���}�X����ێ�����

	this.bblock = (k.checkBlackCell || k.linkNumber);	// ���}�X(or �q���鐔���E�L��)�̏��𐶐�����
	this.wblock = k.checkWhiteCell;						// ���}�X�̏��𐶐�����
	this.numberColony = k.linkNumber;					// �����E�L�������}�X���Ƃ݂Ȃ��ď��𐶐�����

	this.init();
};
AreaManager.prototype = {
	//--------------------------------------------------------------------------------
	// area.init()       �N�����ɕϐ�������������
	// area.resetArea()  �����A���}�X�A���}�X�̏���reset����
	//--------------------------------------------------------------------------------
	init : function(){
		this.initRarea();
		this.initBarea();
		this.initWarea();
	},
	resetArea : function(){
		if(!!k.isborder && !k.isborderAsLine){ this.resetRarea();}
		if(this.bblock){ this.resetBarea();}
		if(this.wblock){ this.resetWarea();}
	},

	//--------------------------------------------------------------------------------
	// area.initRarea()  �����֘A�̕ϐ�������������
	// area.resetRarea() �����̏���reset���āA1���犄�蓖�Ă��Ȃ���
	// 
	// area.lcntCross()  �w�肳�ꂽ�ʒu��Cross�̏㉺���E�̂������E����������Ă���(ques==1 or qans==1��)�������߂�
	// area.getRoomID()          ���̃I�u�W�F�N�g�ŊǗ����Ă���Z���̕���ID���擾����
	// area.setRoomID()          ���̃I�u�W�F�N�g�ŊǗ����Ă���Z���̕���ID��ݒ肷��
	// area.getTopOfRoomByCell() �w�肵���Z�����܂܂��̈��TOP�̕������擾����
	// area.getTopOfRoom()       �w�肵���̈��TOP�̕������擾����
	// area.getCntOfRoomByCell() �w�肵���Z�����܂܂��̈�̑傫���𒊏o����
	// area.getCntOfRoom()       �w�肵���̈�̑傫���𒊏o����
	//--------------------------------------------------------------------------------
	initRarea : function(){
		// ������񏉊���
		this.room = {max:1,id:[],1:{top:0,clist:[]}};
		for(var c=0;c<bd.cellmax;c++){ this.room.id[c] = 1; this.room[1].clist[c] = c;}

		// lcnt�ϐ�������
		this.lcnt = [];
		for(var c=0;c<(k.qcols+1)*(k.qrows+1);c++){ this.lcnt[c]=0;}

		if(k.isborder===1){
			for(var by=bd.minby;by<=bd.maxby;by+=2){
				for(var bx=bd.minbx;bx<=bd.maxbx;bx+=2){
					if(bx===bd.minbx || bx===bd.maxbx || by===bd.minby || by===bd.maxby){
						var c = (bx>>1)+(by>>1)*(k.qcols+1);
						this.lcnt[c]=2;
					}
				}
			}
		}

		if(!k.hasroom){ return;}
		for(var id=0;id<bd.bdmax;id++){
			if(bd.isBorder(id)){
				var cc1 = bd.border[id].crosscc[0], cc2 = bd.border[id].crosscc[1];
				if(cc1!==-1){ this.lcnt[cc1]++;}
				if(cc2!==-1){ this.lcnt[cc2]++;}
			}
		}
	},
	resetRarea : function(){
		if(!k.hasroom){ return;}

		this.initRarea();
		this.room.max = 0;
		for(var cc=0;cc<bd.cellmax;cc++){ this.room.id[cc]=0;}
		for(var cc=0;cc<bd.cellmax;cc++){
			if(this.room.id[cc]!=0){ continue;}
			this.room.max++;
			this.room[this.room.max] = {top:-1,clist:[]};
			this.sr0(cc,this.room,bd.isBorder);
		}

		// �������ƂɁATOP�̏ꏊ�ɐ��������邩�ǂ������f���Ĉړ�����
		if(k.roomNumber){
			for(var r=1;r<=this.room.max;r++){
				this.setTopOfRoom(r);

				var val = -1, clist = this.room[r].clist;
				for(var i=0,len=clist.length;i<len;i++){
					var c = clist[i];
					if(this.room.id[c]===r && bd.cell[c].qnum!==-1){
						if(val===-1){ val = bd.cell[c].qnum;}
						if(this.getTopOfRoom(r)!==c){ bd.sQnC(c, -1);}
					}
				}
				if(val!==-1 && bd.QnC(this.getTopOfRoom(r))===-1){ bd.sQnC(this.getTopOfRoom(r), val);}
			}
		}
	},

	lcntCross : function(id){ return this.lcnt[id];},

	getRoomID : function(cc){ return this.room.id[cc];},
//	setRoomID : function(cc,val){ this.room.id[cc] = val;},

	getTopOfRoomByCell : function(cc){ return this.room[this.room.id[cc]].top;},
	getTopOfRoom       : function(id){ return this.room[id].top;},

	getCntOfRoomByCell : function(cc){ return this.room[this.room.id[cc]].clist.length;},
//	getCntOfRoom       : function(id){ return this.room[id].clist.length;},

	//--------------------------------------------------------------------------------
	// area.setBorder()    ���E���������ꂽ�������Ă��肵�����ɁA�ϐ�lcnt�̓��e��ύX����
	// area.setTopOfRoom() �Z���̃��X�g���畔����TOP��ݒ肷��
	// area.sr0()          setBorder()����Ă΂�āA����id���܂ވ�̕����̗̈���A�w�肳�ꂽareaid�ɂ���
	//---------------------------------------------------------------------------
	setBorder : function(id,val){
		if(!k.hasroom){ return;}
		val = (val>0?1:0);

		var cc1, cc2, xc1 = bd.border[id].crosscc[0], xc2 = bd.border[id].crosscc[1];
		var room = this.room, roomid = room.id;
		if(val>0){
			this.lcnt[xc1]++; this.lcnt[xc2]++;

			if(this.lcnt[xc1]===1 || this.lcnt[xc2]===1){ return;}
			cc1 = bd.border[id].cellcc[0]; cc2 = bd.border[id].cellcc[1];
			if(cc1===-1 || cc2===-1 || roomid[cc1]!==roomid[cc2]){ return;}

			var baseid = roomid[cc1];

			// �܂���or�E���̃Z������q����Z����roomid��ύX����
			room.max++;
			room[room.max] = {top:-1,clist:[]}
			this.sr0(cc2,room,bd.isBorder);

			// ��������������Ă��Ȃ�������A���ɖ߂��ďI��
			if(roomid[cc1] === room.max){
				for(var i=0,len=room[room.max].clist.length;i<len;i++){
					roomid[room[room.max].clist[i]] = baseid;
				}
				room.max--;
				return;
			}

			// room�̏����X�V����
			var clist = room[baseid].clist.concat();
			room[baseid].clist = [];
			room[room.max].clist = [];
			for(var i=0,len=clist.length;i<len;i++){
				room[roomid[clist[i]]].clist.push(clist[i]);
			}

			// TOP�̏���ݒ肷��
			if(k.roomNumber){
				if(roomid[room[baseid].top]===baseid){
					this.setTopOfRoom(room.max);
				}
				else{
					room[room.max].top = room[baseid].top;
					this.setTopOfRoom(baseid);
				}
			}
		}
		else{
			this.lcnt[xc1]--; this.lcnt[xc2]--;

			if(this.lcnt[xc1]===0 || this.lcnt[xc2]===0){ return;}
			cc1 = bd.border[id].cellcc[0]; cc2 = bd.border[id].cellcc[1];
			if(cc1===-1 || cc2===-1 || roomid[cc1]===roomid[cc2]){ return;}

			// k.roomNumber�̎� �ǂ����̐������c�����́ATOP���m�̈ʒu�Ŕ�r����
			if(k.roomNumber){
				var merged, keep;

				var tc1 = room[roomid[cc1]].top, tc2 = room[roomid[cc2]].top;
				var tbx1 = bd.cell[tc1].bx, tbx2 = bd.cell[tc2].bx;
				if(tbx1>tbx2 || (tbx1===tbx2 && tc1>tc2)){ merged = tc1; keep = tc2;}
				else                                     { merged = tc2; keep = tc1;}

				// �����镔���̂ق��̐���������
				if(bd.QnC(merged)!==-1){
					// �����������镔���ɂ����Ȃ��ꍇ -> �c��ق��Ɉړ�������
					if(bd.QnC(keep)===-1){ bd.sQnC(keep, bd.QnC(merged)); pc.paintCell(keep);}
					bd.sQnC(merged,-1); pc.paintCell(merged);
				}
			}

			// room, roomid���X�V
			var r1 = roomid[cc1], r2 = roomid[cc2], clist = room[r2].clist;
			for(var i=0;i<clist.length;i++){
				roomid[clist[i]] = r1;
				room[r1].clist.push(clist[i]);
			}
			room[r2] = {top:-1,clist:[]};
		}
	},
	setTopOfRoom : function(roomid){
		var cc=-1, bx=bd.maxbx, by=bd.maxby;
		var clist = this.room[roomid].clist;
		for(var i=0;i<clist.length;i++){
			var tc = bd.cell[clist[i]];
			if(tc.bx>bx || (tc.bx===bx && tc.by>=by)){ continue;}
			cc=clist[i];
			bx=tc.bx;
			by=tc.by;
		}
		this.room[roomid].top = cc;
	},
	sr0 : function(c,data,func){
		data.id[c] = data.max;
		data[data.max].clist.push(c);
		var tc;
		tc=bd.up(c); if( tc!==-1 && data.id[tc]!==data.max && !func(bd.ub(c)) ){ this.sr0(tc,data,func);}
		tc=bd.dn(c); if( tc!==-1 && data.id[tc]!==data.max && !func(bd.db(c)) ){ this.sr0(tc,data,func);}
		tc=bd.lt(c); if( tc!==-1 && data.id[tc]!==data.max && !func(bd.lb(c)) ){ this.sr0(tc,data,func);}
		tc=bd.rt(c); if( tc!==-1 && data.id[tc]!==data.max && !func(bd.rb(c)) ){ this.sr0(tc,data,func);}
	},

	//--------------------------------------------------------------------------------
	// area.initBarea()  ���}�X�֘A�̕ϐ�������������
	// area.resetBarea() ���}�X�̏���reset���āA1���犄�蓖�Ă��Ȃ���
	// area.initWarea()  ���}�X�֘A�̕ϐ�������������
	// area.resetWarea() ���}�X�̏���reset���āA1���犄�蓖�Ă��Ȃ���
	//--------------------------------------------------------------------------------
	initBarea : function(){
		this.bcell = {max:0,id:[]};
		for(var c=0;c<bd.cellmax;c++){
			this.bcell.id[c] = -1;
		}
	},
	resetBarea : function(){
		this.initBarea();
		if(!this.numberColony){ for(var cc=0;cc<bd.cellmax;cc++){ this.bcell.id[cc]=(bd.isBlack(cc)?0:-1);} }
		else                  { for(var cc=0;cc<bd.cellmax;cc++){ this.bcell.id[cc]=(bd.isNum(cc)  ?0:-1);} }
		for(var cc=0;cc<bd.cellmax;cc++){
			if(this.bcell.id[cc]!=0){ continue;}
			this.bcell.max++;
			this.bcell[this.bcell.max] = {clist:[]};
			this.sc0(cc,this.bcell);
		}
	},

	initWarea : function(){
		this.wcell = {max:1,id:[],1:{clist:[]}};
		for(var c=0;c<bd.cellmax;c++){
			this.wcell.id[c] = 1;
			this.wcell[1].clist[c]=c;
		}
	},
	resetWarea : function(){
		this.initWarea();
		this.wcell.max = 0;
		for(var cc=0;cc<bd.cellmax;cc++){ this.wcell.id[cc]=(bd.isWhite(cc)?0:-1); }
		for(var cc=0;cc<bd.cellmax;cc++){
			if(this.wcell.id[cc]!=0){ continue;}
			this.wcell.max++;
			this.wcell[this.wcell.max] = {clist:[]};
			this.sc0(cc,this.wcell);
		}
	},

	//--------------------------------------------------------------------------------
	// area.setCell()    ���}�X�E���}�X�����͂��ꂽ������ꂽ���ɁA���}�X/���}�XID�̏���ύX����
	// area.setBWCell()  setCell����Ă΂��֐�
	// area.sc0()        ����id���܂ވ�̗̈����areaid���w�肳�ꂽ���̂ɂ���
	//--------------------------------------------------------------------------------
	setCell : function(cc,val){
		if(val>0){
			if(this.bblock){ this.setBWCell(cc,1,this.bcell);}
			if(this.wblock){ this.setBWCell(cc,0,this.wcell);}
		}
		else{
			if(this.bblock){ this.setBWCell(cc,0,this.bcell);}
			if(this.wblock){ this.setBWCell(cc,1,this.wcell);}
		}
	},
	setBWCell : function(cc,val,data){
		var cid = [], dataid = data.id, tc;
		tc=bd.up(cc); if(tc!==-1 && dataid[tc]!==-1){ cid.push(tc);}
		tc=bd.dn(cc); if(tc!==-1 && dataid[tc]!==-1){ cid.push(tc);}
		tc=bd.lt(cc); if(tc!==-1 && dataid[tc]!==-1){ cid.push(tc);}
		tc=bd.rt(cc); if(tc!==-1 && dataid[tc]!==-1){ cid.push(tc);}

		// �V���ɍ��}�X(���}�X)�ɂȂ�����
		if(val>0){
			// �܂��ɍ��}�X(���}�X)���Ȃ����͐V����ID�œo�^�ł�
			if(cid.length===0){
				data.max++;
				data[data.max] = {clist:[cc]};
				dataid[cc] = data.max;
			}
			// 1�����ɂ���Ƃ��́A�����ɂ������΂悢
			else if(cid.length===1){
				data[dataid[cid[0]]].clist.push(cc);
				dataid[cc] = dataid[cid[0]];
			}
			// 2�����ȏ�̎�
			else{
				// ����ň�ԑ傫�ȍ��}�X�́H
				var largeid = dataid[cid[0]];
				for(var i=1;i<cid.length;i++){
					if(data[largeid].clist.length < data[dataid[cid[i]]].clist.length){ largeid=dataid[cid[i]];}
				}
				// �Ȃ��������}�X(���}�X)�͑S�ē���ID�ɂ���
				for(var i=0;i<cid.length;i++){
					if(dataid[cid[i]]===largeid){ continue;}
					var clist = data[dataid[cid[i]]].clist;
					for(var n=0,len=clist.length;n<len;n++){
						dataid[clist[n]] = largeid;
						data[largeid].clist.push(clist[n]);
					}
					clist = [];
				}
				// ��������������
				dataid[cc] = largeid;
				data[largeid].clist.push(cc);
			}
		}
		// ���}�X(���}�X)�ł͂Ȃ��Ȃ�����
		else{
			// �܂��ɍ��}�X(���}�X)���Ȃ����͏����������邾��
			if(cid.length===0){
				data[dataid[cc]].clist = [];
				dataid[cc] = -1;
			}
			// �܂��1�����̎����������������邾���ł悢
			else if(cid.length===1){
				var ownid = dataid[cc], clist = data[ownid].clist;
				for(var i=0;i<clist.length;i++){ if(clist[i]===cc){ clist.splice(i,1); break;} }
				dataid[cc] = -1;
			}
			// 2�����ȏ�̎��͍l�����K�v
			else{
				// ��x�����̗̈�̍��}�X(���}�X)���𖳌��ɂ���
				var ownid = dataid[cc], clist = data[ownid].clist;
				for(var i=0;i<clist.length;i++){ dataid[clist[i]] = 0;}
				data[ownid].clist = [];

				// ���������}�X(���}�X)��񂩂����
				dataid[cc] = -1;

				// �܂���ID��0�ȃZ���ɍ��}�X(���}�X)ID���Z�b�g���Ă���
				for(var i=0;i<cid.length;i++){
					if(dataid[cid[i]]!==0){ continue;}
					data.max++;
					data[data.max] = {clist:[]};
					this.sc0(cid[i],data);
				}
			}
		}
	},
	sc0 : function(c,data){
		data.id[c] = data.max;
		data[data.max].clist.push(c);
		var tc;
		tc=bd.up(c); if( tc!==-1 && data.id[tc]===0 ){ this.sc0(tc,data);}
		tc=bd.dn(c); if( tc!==-1 && data.id[tc]===0 ){ this.sc0(tc,data);}
		tc=bd.lt(c); if( tc!==-1 && data.id[tc]===0 ){ this.sc0(tc,data);}
		tc=bd.rt(c); if( tc!==-1 && data.id[tc]===0 ){ this.sc0(tc,data);}
	},

	//--------------------------------------------------------------------------------
	// area.getRoomInfo()  ��������AreaInfo�^�̃I�u�W�F�N�g�ŕԂ�
	// area.getBCellInfo() ���}�X����AreaInfo�^�̃I�u�W�F�N�g�ŕԂ�
	// area.getWCellInfo() ���}�X����AreaInfo�^�̃I�u�W�F�N�g�ŕԂ�
	// area.getNumberInfo() �������(=���}�X���)��AreaInfo�^�̃I�u�W�F�N�g�ŕԂ�
	// area.getAreaInfo()  ��L�֐��̋��ʏ���
	//--------------------------------------------------------------------------------
	getRoomInfo  : function(){ return this.getAreaInfo(this.room);},
	getBCellInfo : function(){ return this.getAreaInfo(this.bcell);},
	getWCellInfo : function(){ return this.getAreaInfo(this.wcell);},
	getNumberInfo : function(){ return this.getAreaInfo(this.bcell);},
	getAreaInfo : function(block){
		var info = new AreaInfo();
		for(var c=0;c<bd.cellmax;c++){ info.id[c]=(block.id[c]>0?0:-1);}
		for(var c=0;c<bd.cellmax;c++){
			if(info.id[c]!=0){ continue;}
			info.max++;
			var clist = block[block.id[c]].clist;
			info.room[info.max] = {idlist:clist}; /* �Q�Ƃ����Ȃ̂�concat()����Ȃ��Ă悢 */
			for(var i=0,len=clist.length;i<len;i++){ info.id[clist[i]] = info.max;}
		}
		return info;
	}
};

//---------------------------------------------------------------------------
// ��PBase�N���X �ς��Ղ�v3�̃x�[�X�����₻�̑��̏������s��
//---------------------------------------------------------------------------

// PBase�N���X
PBase = function(){
	this.floatbgcolor = "black";
	this.proto        = 0;	// �e�N���X��prototype���p�Y���p�X�N���v�g�ɂ���ĕύX����Ă��邩
	this.expression   = { ja:'' ,en:''};
	this.puzzlename   = { ja:'' ,en:''};
	this.numparent    = null;	// 'numobj_parent'�������G�������g
	this.resizetimer  = null;	// resize�^�C�}�[
	this.initProcess  = true;	// �����������ǂ���
	this.enableSaveImage = false;	// �摜�ۑ����L����
};
PBase.prototype = {
	//---------------------------------------------------------------------------
	// base.preload_func()
	//   ���̃t�@�C�����Ă΂ꂽ�Ƃ��Ɏ��s�����֐� -> onLoad�O�̍ŏ����̐ݒ���s��
	//---------------------------------------------------------------------------
	preload_func : function(){
		// URL�̎擾 -> URL��?�ȉ�����puzzleid����pzlURI���ɕ���
		enc = new Encode();
		enc.first_parseURI(location.search);
		if(!k.puzzleid){ location.href = "./";} // �w�肳�ꂽ�p�Y�����Ȃ��ꍇ�͂��悤�Ȃ�`

		// �p�Y����p�t�@�C���̓ǂݍ���
		if(!k.scriptcheck){
			document.writeln("<script type=\"text/javascript\" src=\"src/"+k.puzzleid+".js\"></script>");
		}
		else{
			document.writeln("<script type=\"text/javascript\" src=\"src/for_test.js\"></script>");
			document.writeln("<script type=\"text/javascript\" src=\"src/puzzles.js\"></script>");
		}

		fio = new FileIO();
		if(fio.dbm.requireGears()){
			// �K�v�ȏꍇ�Agears_init.js�̓ǂݍ���
			document.writeln("<script type=\"text/javascript\" src=\"src/gears_init.js\"></script>");
		}

		// onLoad��onResize�ɓ�������蓖�Ă�
		window.onload   = ee.ebinder(this, this.onload_func);
		window.onresize = ee.ebinder(this, this.onresize_func);
	},

	//---------------------------------------------------------------------------
	// base.onload_func()
	//   �y�[�W��Load���ꂽ���̏����B�e�N���X�̃I�u�W�F�N�g�ւ̓ǂݍ��ݓ������ݒ���s��
	// 
	// base.initCanvas()  Canvas�֘A�̏�����
	// base.initObjects() �e�I�u�W�F�N�g�̐����Ȃǂ̏���
	// base.setEvents()   �}�E�X���́A�L�[���͂̃C�x���g�̐ݒ���s��
	// base.translationEN() ���{����łȂ��ꍇ�A�f�t�H���g�ŉp��\���ɂ���
	//---------------------------------------------------------------------------
	onload_func : function(){
		Camp('divques');
		if(Camp.enable.canvas && !!document.createElement('canvas').toDataURL){
			this.enableSaveImage = true;
			Camp('divques_sub', 'canvas');
		}

		var self = this;
		var tim = setInterval(function(){
			if(Camp.isready()){
				clearInterval(tim);
				self.onload_func2.apply(self);
			}
		},10);
	},
	onload_func2 : function(){
		this.initCanvas();
		this.initObjects();
		this.setEvents(true);	// �C�x���g����������
		this.translationEN();

		if(document.domain=='indi.s58.xrea.com' && k.PLAYER){ this.accesslog();}	// �A�N�Z�X���O���Ƃ��Ă݂�
		tm = new Timer();	// �^�C�}�[�I�u�W�F�N�g�̐����ƃ^�C�}�[�X�^�[�g

		this.initProcess = false;
	},

	initCanvas : function(){
		this.numparent = ee('numobj_parent').el;		// �����\���p
		var canvas = ee('divques').unselectable().el;	// Canvas
		g = canvas.getContext("2d");
	},

	initObjects : function(){
		this.proto = 0;

		puz = new Puzzles[k.puzzleid]();	// �p�Y���ŗL�I�u�W�F�N�g
		puz.setting();						// �p�Y���ŗL�̕ϐ��ݒ�(�f�t�H���g��)
		if(this.proto){ puz.protoChange();}

		// �N���X������
		tc = new TCell();		// �L�[���͂̃^�[�Q�b�g�Ǘ��I�u�W�F�N�g
		bd = new Board();		// �ՖʃI�u�W�F�N�g
		mv = new MouseEvent();	// �}�E�X���̓I�u�W�F�N�g
		kc = new KeyEvent();	// �L�[�{�[�h���̓I�u�W�F�N�g
		kp = new KeyPopup();	// ���̓p�l���I�u�W�F�N�g
		pc = new Graphic();		// �`��n�I�u�W�F�N�g
		ans = new AnsCheck();	// ���𔻒�I�u�W�F�N�g
		um   = new OperationManager();	// ������Ǘ��I�u�W�F�N�g
		area = new AreaManager();		// ������񓙊Ǘ��I�u�W�F�N�g
		line = new LineManager();		// ���̏��Ǘ��I�u�W�F�N�g

		menu = new Menu();		// ���j���[�������I�u�W�F�N�g
		pp = new Properties();	// ���j���[�֌W�̐ݒ�l��ێ�����I�u�W�F�N�g

		this.doc_design();		// �f�U�C���ύX�֘A�֐��̌Ăяo��

		enc.pzlinput();			// URL����p�Y���̃f�[�^��ǂݏo��
		this.resize_canvas();

		if(!!puz.finalfix){ puz.finalfix();}		// �p�Y���ŗL�̌�t���ݒ�
	},
	setEvents : function(first){
		var canvas = ee('divques').el;
		canvas.onmousedown   = ee.ebinder(mv, mv.e_mousedown);
		canvas.onmousemove   = ee.ebinder(mv, mv.e_mousemove);
		canvas.onmouseup     = ee.ebinder(mv, mv.e_mouseup  );
		canvas.oncontextmenu = function(){ return false;};

		this.numparent.onmousedown   = ee.ebinder(mv, mv.e_mousedown);
		this.numparent.onmousemove   = ee.ebinder(mv, mv.e_mousemove);
		this.numparent.onmouseup     = ee.ebinder(mv, mv.e_mouseup  );
		this.numparent.oncontextmenu = function(){ return false;};

		if(first){
			document.onkeydown  = ee.ebinder(kc, kc.e_keydown);
			document.onkeyup    = ee.ebinder(kc, kc.e_keyup);
			document.onkeypress = ee.ebinder(kc, kc.e_keypress);
			if(g.use.sl){ this.initSilverlight();}

			if(!!menu.ex.reader){
				var DDhandler = function(e){
					menu.ex.reader.readAsText(e.dataTransfer.files[0]);
					e.preventDefault();
					e.stopPropagation();
				}
				window.addEventListener('dragover', function(e){ e.preventDefault();}, true);
				window.addEventListener('drop', DDhandler, true);
			}

			// onBlur�ɃC�x���g�����蓖�Ă�
			document.onblur = ee.ebinder(this, this.onblur_func);
		}
	},
	translationEN : function(){
		var lang = (navigator.browserLanguage ||
					navigator.language        ||
					navigator.userLanguage      ).substr(0,2);
		if(lang!=='ja'){ pp.setVal('language', 1);}
	},

	//---------------------------------------------------------------------------
	// base.initSilverlight() Silverlight�I�u�W�F�N�g�ɃC�x���g�̐ݒ���s��(IE��Silverlight���[�h��)
	// base.e_SLkeydown()     Silverlight�I�u�W�F�N�g�Ƀt�H�[�J�X�����鎞�A�L�[���������ۂ̃C�x���g���ʏ���
	// base.e_SLkeyup()       Silverlight�I�u�W�F�N�g�Ƀt�H�[�J�X�����鎞�A�L�[�𗣂����ۂ̃C�x���g���ʏ���
	//---------------------------------------------------------------------------
	initSilverlight : function(){
		var sender = g.content.findName(g.canvasid);
		sender.AddEventListener("KeyDown", this.e_SLkeydown);
		sender.AddEventListener("KeyUp",   this.e_SLkeyup);
	},
	e_SLkeydown : function(sender, keyEventArgs){
		var emulate = { keyCode : keyEventArgs.platformKeyCode, shiftKey:keyEventArgs.shift, ctrlKey:keyEventArgs.ctrl,
						altKey:false, returnValue:false, preventDefault:f_true };
		return kc.e_keydown(emulate);
	},
	e_SLkeyup : function(sender, keyEventArgs){
		var emulate = { keyCode : keyEventArgs.platformKeyCode, shiftKey:keyEventArgs.shift, ctrlKey:keyEventArgs.ctrl,
						altKey:false, returnValue:false, preventDefault:f_true };
		return kc.e_keyup(emulate);
	},

	//---------------------------------------------------------------------------
	// base.doc_design() onload_func()�ŌĂ΂��Bhtml�Ȃǂ̐ݒ���s��
	// base.postfix()    �e�p�Y���̏������㏈�����Ăяo��
	// base.resetInfo()  AreaInfo���A�Ֆʓǂݍ��ݎ��ɏ��������������Ăяo��
	//---------------------------------------------------------------------------
	// �w�i�摜�Ƃ�title��/html�\���̐ݒ� //
	doc_design : function(){
		_doc.title = this.gettitle();
		ee('title2').el.innerHTML = this.gettitle();

		_doc.body.style.backgroundImage = "url(./bg/"+k.puzzleid+".gif)";
		if(k.br.IEmoz4){
			ee('title2').el.style.marginTop = "24px";
			ee('separator1').el.style.margin = '0pt';
			ee('separator2').el.style.margin = '0pt';
		}

		this.postfix();			// �e�p�Y�����Ƃ̐ݒ�(��t����)
		menu.menuinit();
		um.enb_btn();

		// �Ȃ���F5�ōX�V�����true�ɂȂ��Ă�̂ŉ��}���u...
		ee('btnclear') .el.disabled = false;
		ee('btnclear2').el.disabled = false;
	},
	postfix : function(){
		puz.input_init();
		puz.graphic_init();
		puz.encode_init();
		puz.answer_init();
	},
	resetInfo : function(iserase){
		if(iserase){ um.allerase();}
		area.resetArea();
		line.resetLcnts();
	},

	//---------------------------------------------------------------------------
	// base.gettitle()         ���݊J���Ă���^�C�g����Ԃ�
	// base.getPuzzleName()    ���݊J���Ă���p�Y���̖��O��Ԃ�
	// base.setTitle()         �p�Y���̖��O��ݒ肷��
	// base.setExpression()    ��������ݒ肷��
	// base.setFloatbgcolor()  �t���[�g���j���[�̔w�i�F��ݒ肷��
	//---------------------------------------------------------------------------
	gettitle : function(){
		if(k.EDITOR){ return ""+this.getPuzzleName()+(menu.isLangJP()?" �G�f�B�^ - �ς��Ղ�v3":" editor - PUZ-PRE v3");}
		else		{ return ""+this.getPuzzleName()+(menu.isLangJP()?" player - �ς��Ղ�v3"  :" player - PUZ-PRE v3");}
	},
	getPuzzleName : function(){ return (menu.isLangJP()||!this.puzzlename.en)?this.puzzlename.ja:this.puzzlename.en;},
	setTitle      : function(strJP, strEN){ this.puzzlename.ja = strJP; this.puzzlename.en = strEN;},
	setExpression : function(strJP, strEN){ this.expression.ja = strJP; this.expression.en = strEN;},
	setFloatbgcolor : function(color){ this.floatbgcolor = color;},

	//---------------------------------------------------------------------------
	// base.onresize_func()  �E�B���h�E���T�C�Y���ɌĂ΂��֐�
	// base.resize_canvas()  �E�B���h�E��Load/Resize���̏����BCanvas/�\������}�X�ڂ̑傫����ݒ肷��B
	//---------------------------------------------------------------------------
	onresize_func : function(){
		if(this.resizetimer){ clearTimeout(this.resizetimer);}
		this.resizetimer = setTimeout(ee.binder(this, this.resize_canvas),250);
	},
	resize_canvas : function(){
		var wwidth = ee.windowWidth()-6;	//  margin/border������̂ŁA�K���Ɉ����Ă���
		var cols   = (bd.maxbx-bd.minbx)/2+2*k.bdmargin; // canvas�̉������Z�������ɑ������邩
		var rows   = (bd.maxby-bd.minby)/2+2*k.bdmargin; // canvas�̏c�����Z�������ɑ������邩
		if(k.puzzleid==='box'){ cols++; rows++;}

		var cratio = {0:(19/36), 1:0.75, 2:1.0, 3:1.5, 4:3.0}[pp.getVal('size')];
		var cr = {base:cratio,limit:0.40}, ws = {base:0.80,limit:0.96}, ci=[];
		ci[0] = (wwidth*ws.base )/(k.cellsize*cr.base );
		ci[1] = (wwidth*ws.limit)/(k.cellsize*cr.limit);

		var mwidth = wwidth*ws.base-4; // margin/border������̂ŁA�K���Ɉ����Ă���

		// ���ɏk�����K�v�Ȃ��ꍇ
		if(!pp.getVal('adjsize') || cols < ci[0]){
			mwidth = wwidth*ws.base-4;
			k.cwidth = k.cheight = mf(k.cellsize*cr.base);
		}
		// base�`limit�ԂŃT�C�Y���������߂���ꍇ
		else if(cols < ci[1]){
			var ws_tmp = ws.base+(ws.limit-ws.base)*((k.qcols-ci[0])/(ci[1]-ci[0]));
			mwidth = wwidth*ws_tmp-4;
			k.cwidth = k.cheight = mf(mwidth/cols); // �O�g���肬��ɂ���
		}
		// ���������̉����l�𒴂���ꍇ
		else{
			mwidth = wwidth*ws.limit-4;
			k.cwidth = k.cheight = mf(k.cellsize*cr.limit);
		}
		k.bwidth  = k.cwidth/2; k.bheight = k.cheight/2;

		// main�̃T�C�Y�ύX
		ee('main').el.style.width = ''+mf(mwidth)+'px';

		// �Ֆʂ̃Z��ID:0���`�悳���ʒu�̐ݒ�
		k.p0.x = k.p0.y = mf(k.cwidth*k.bdmargin);
		// extendxell==0�łȂ����͈ʒu�����炷
		if(!!k.isexcell){ k.p0.x += k.cwidth; k.p0.y += k.cheight;}

		// Canvas�̃T�C�Y�ύX
		pc.setVectorFunctions();
		g.changeSize(mf(cols*k.cwidth), mf(rows*k.cheight));

		// canvas�̏�ɕ����E�摜��\�����鎞��Offset�w��
		var rect = ee('divques').getRect();
		k.cv_oft.x = rect.left;
		k.cv_oft.y = rect.top;

		kp.resize();
		bd.setcoordAll();
		pc.onresize_process();

		// �ĕ`��
		pc.flushCanvasAll();
		pc.paintAll();
	},

	//---------------------------------------------------------------------------
	// base.onblur_func() �E�B���h�E����t�H�[�J�X�����ꂽ���ɌĂ΂��֐�
	//---------------------------------------------------------------------------
	onblur_func : function(){
		kc.keyreset();
		mv.mousereset();
	},

	//---------------------------------------------------------------------------
	// base.accesslog() player�̃A�N�Z�X���O���Ƃ�
	//---------------------------------------------------------------------------
	accesslog : function(){
		var refer = document.referrer;
		refer = refer.replace(/\?/g,"%3f");
		refer = refer.replace(/\&/g,"%26");
		refer = refer.replace(/\=/g,"%3d");
		refer = refer.replace(/\//g,"%2f");

		// ���M
		var xmlhttp = false;
		if(typeof ActiveXObject != "undefined"){
			try { xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");}
			catch (e) { xmlhttp = false;}
		}
		if(!xmlhttp && typeof XMLHttpRequest != "undefined") {
			xmlhttp = new XMLHttpRequest();
		}
		if(xmlhttp){
			xmlhttp.open("GET", ["./record.cgi", "?pid=",k.puzzleid, "&pzldata=",enc.uri.qdata, "&referer=",refer].join(''));
			xmlhttp.onreadystatechange = function(){};
			xmlhttp.send(null);
		}
	}
};

base = new PBase();	// onLoad�܂ł̍ŏ����̐ݒ���s��
base.preload_func();
