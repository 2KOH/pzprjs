/* 
 * pzprBase.js
 * 
 * pzprBase.js is a base script for playing nikoli puzzles on Web
 * written in JavaScript.
 * 
 * @author  happa.
 * @version v3.2.4
 * @date    2009-12-13
 * 
 * This script uses following library.
 *  uuCanvas.js (version 1.0)
 *  http://code.google.com/p/uupaa-js-spinoff/	uupaa.js SpinOff Project Home(Google Code)
 * 
 * For improvement of canvas drawing time, I make some change on uuCanvas.js.
 * Please see "//happa add.[20090608]" in uuCanvas.js.
 * 
 * This script is dual licensed under the MIT and Apache 2.0 licenses.
 * http://indi.s58.xrea.com/pzpr/v3/LICENCE.HTML
 * 
 */

var pzprversion="v3.2.4";

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
	qcols : 0, qrows : 0,	// �Ֆʂ̉����E�c��
	irowake   :  0,			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

	iscross      : 0,		// 1:Cross������\�ȃp�Y��
	isborder     : 0,		// 1:Border/Line������\�ȃp�Y��
	isextendcell : 0,		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

	isoutsidecross  : 1,	// 1:�O�g���Cross�̔z�u������p�Y��
	isoutsideborder : 0,	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
	isLineCross     : 1,	// 1:������������p�Y��
	isCenterLine    : 0,	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
	isborderAsLine  : 0,	// 1:���E����line�Ƃ��Ĉ���

	dispzero      : 0,		// 1:0��\�����邩�ǂ���
	isDispHatena  : 1,		// 1:qnum��-2�̂Ƃ��ɁH��\������
	isAnsNumber   : 0,		// 1:�񓚂ɐ�������͂���p�Y��
	isArrowNumber : 0,		// 1:������������͂���p�Y��
	isOneNumber   : 0,		// 1:���̐����������̍����1��������p�Y��
	isDispNumUL   : 0,		// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
	NumberWithMB  : 0,		// 1:�񓚂̐����Ɓ��~������p�Y��

	BlackCell     : 0,		// 1:���}�X����͂���p�Y��
	NumberIsWhite : 0,		// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
	RBBlackCell   : 0,		// 1:�A�����f�ւ̃p�Y��

	ispzprv3ONLY  : 0,		// �ς��Ղ�v3�ɂ����Ȃ��p�Y��
	isKanpenExist : 0,		// pencilbox/�J���y���ɂ���p�Y��

	def_csize : 36,			// �f�t�H���g�̃Z���T�C�Y
	def_psize : 24,			// �f�t�H���g�̘g�Omargin�T�C�Y
	area : { bcell:0, wcell:0, number:0, disroom:0},	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

	// �����Ŏ����I�ɐݒ肳���O���[�o���ϐ�
	puzzleid  : '',			// �p�Y����ID("creek"�Ȃ�)
	use       : 1,			// ������@
	widthmode : 2,			// Canvas�̉������ǂ����邩

	EDITOR    : true,		// �G�f�B�^���[�h
	PLAYER    : false,		// player���[�h
	editmode  : true,		// ���z�u���[�h
	playmode  : false,		// �񓚃��[�h

	enableKey   : true,		// �L�[���͂͗L����
	enableMouse : true,		// �}�E�X���͂͗L����
	autocheck   : true,		// �񓚓��͎��A�����I�ɓ������킹���邩

	cwidth   : this.def_csize,	// �Z���̉���
	cheight  : this.def_csize,	// �Z���̏c��

	p0       : new Pos(this.def_psize, this.def_psize),	// Canvas���ł̔Ֆʂ̍�����W
	cv_oft   : new Pos(0, 0),	// Canvas��window���ł̍�����W
	IEMargin : new Pos(2, 2),	// �}�E�X���͓��ł���錏��margin

	br:{
		IE    : !!(window.attachEvent && !window.opera),
		Opera : !!window.opera,
		WebKit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
		Gecko : navigator.userAgent.indexOf('Gecko')>-1 && navigator.userAgent.indexOf('KHTML') == -1,
		WinWebKit: navigator.userAgent.indexOf('AppleWebKit/') > -1 && navigator.userAgent.indexOf('Win') > -1
	},
	vml : !!(window.attachEvent && !window.opera) && !uuMeta.slver,

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
k.IEMargin = (k.br.IE ? k.IEMargin : new Pos(0,0));

//---------------------------------------------------------------------------
// �����̑��̃O���[�o���ϐ�
//---------------------------------------------------------------------------
var g;				// �O���t�B�b�N�R���e�L�X�g
var Puzzles = [];	// �p�Y���ʃN���X
var _doc = document;

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
	_Gecko  = k.br.Gecko,
	_WebKit = k.br.WebKit,

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
					if     (_Gecko) { style['UserSelect'] = style['MozUserSelect'] = 'none';}
					else if(_WebKit){ style['UserSelect'] = style['KhtmlUserSelect'] = 'none';}
					else{ attr['unselectable'] = 'on';}
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
		if(!!temp.parent){ temp.parent.appendChild(el);}

		if(!!id){ el.id = id;}
		for(var name in temp.attr) { el[name]       = temp.attr[name]; }
		for(var name in temp.style){ el.style[name] = temp.style[name];}
		for(var name in temp.func) { el["on"+name]  = temp.func[name]; }
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
		((!k.br.IE) ?
			function(e){ return e.pageX;}
		:
			function(e){ return e.clientX + (_doc.documentElement.scrollLeft || _doc.body.scrollLeft);}
		)
	),
	pageY : (
		((!k.br.IE) ?
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
	stopPropagation : (
		(!_IE) ? function(e){ e.stopPropagation();}
		:        function(e){ e.cancelBubble = true;}
	),
	preventDefault : (
		(_Gecko || _WebKit) ? function(e){ e.preventDefault();}
		:                     function(e){ e.returnValue = false;}
	)
});

// implementation of _ElementManager.ElementExt class
_ElementManager.ElementExt.prototype = {
	//----------------------------------------------------------------------
	// ee.getRect()   �G�������g�̎l�ӂ̍��W��Ԃ�
	// ee.getWidth()  �G�������g�̕���Ԃ�
	// ee.getHeight() �G�������g�̍�����Ԃ�
	//----------------------------------------------------------------------
	getRect : (
		((!!document.getBoundingClientRect) ?
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
	unselectable : (
		((_Gecko) ?
			function(){
				this.el.style.MozUserSelect = 'none';
				this.el.style.UserSelect    = 'none';
				return this;
			}
		:(_WebKit) ?
			function(){
				this.el.style.KhtmlUserSelect = 'none';
				this.el.style.UserSelect      = 'none';
				return this;
			}
		:
			function(){
				this.el.unselectable = "on";
				return this;
			}
		)
	),

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
	this.timerInterval = (!k.br.IE?100:200);

	this.st       = 0;		// �^�C�}�[�X�^�[�g����getTime()�擾�l(�~���b)
	this.current  = 0;		// ���݂�getTime()�擾�l(�~���b)

	// �o�ߎ��ԕ\���p�ϐ�
	this.bseconds = 0;		// �O�񃉃x���ɕ\����������(�b��)
	this.timerEL = ee('timerpanel').el;

	// ������������p�ϐ�
	this.lastAnsCnt  = 0;	// �O�񐳓����肵�����́AUndoManager�ɋL�^����Ă����/�񓚓��͂̃J�E���g
	this.worstACCost = 0;	// ��������ɂ����������Ԃ̍ň��l(�~���b)
	this.nextACtime  = 0;	// ���Ɏ����������胋�[�`���ɓ��邱�Ƃ��\�ɂȂ鎞��

	// ��ʃ^�C�}�[�X�^�[�g
	this.start();

	// ** Undo�^�C�}�[
	this.TIDundo = null;	// �^�C�}�[ID
	this.undoInterval = (!k.br.IE?25:50);

	// Undo/Redo�p�ϐ�
	this.undoStartCount = mf(300/this.undoInterval);	// 1��ڂ�wait�𑽂�����邽�߂̒l
	this.undoWaitCount = this.undoStartCount;
};
Timer.prototype = {
	//---------------------------------------------------------------------------
	// tm.reset()      �^�C�}�[�̃J�E���g��0�ɂ��āA�X�^�[�g����
	// tm.start()      update()�֐���200ms�Ԋu�ŌĂяo��
	// tm.update()     200ms�P�ʂŌĂяo�����֐�
	//---------------------------------------------------------------------------
	reset : function(){
		this.worstACCost = 0;
		this.timerEL.innerHTML = this.label()+"00:00";

		clearInterval(this.TID);
		this.start();
	},
	start : function(){
		this.st = (new Date()).getTime();
		this.TID = setInterval(ee.binder(this, this.update), this.timerInterval);
	},
	update : function(){
		this.current = (new Date()).getTime();

		if(k.PLAYER){ this.updatetime();}
		if(k.autocheck){ this.ACcheck();}
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

			this.worstACCost = Math.max(this.worstACCost, ((new Date()).getTime()-this.current));
			this.nextACtime = this.current + (this.worstACCost<250 ? this.worstACCost*4+120 : this.worstACCost*2+620);
		}
	},

	//---------------------------------------------------------------------------
	// tm.startUndoTimer()  Undo/Redo�Ăяo�����J�n����
	// tm.stopUndoTimer()   Undo/Redo�Ăяo�����I������
	// tm.procUndo()        Undo/Redo�Ăяo�������s����
	//---------------------------------------------------------------------------
	startUndoTimer : function(){
		this.undoWaitCount = this.undoStartCount;
		if(!this.TIDundo){ this.TIDundo = setInterval(ee.binder(this, this.procUndo), this.undoInterval);}

		if     (kc.inUNDO){ um.undo();}
		else if(kc.inREDO){ um.redo();}
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
		else if(kc.inUNDO){ um.undo();}
		else if(kc.inREDO){ um.redo();}
	}
};

//---------------------------------------------------------------------------
// ��Cell�N���X Board�N���X��Cell�̐������ێ�����
//---------------------------------------------------------------------------
// �{�[�h�����o�f�[�^�̒�`(1)
// Cell�N���X�̒�`
Cell = function(id){
	this.cx;	// �Z����X���W��ێ�����
	this.cy;	// �Z����Y���W��ێ�����
	this.px;	// �Z���̕`��pX���W��ێ�����
	this.py;	// �Z���̕`��pY���W��ێ�����
	this.ques;	// �Z���̖��f�[�^(�`��)��ێ�����
	this.qnum;	// �Z���̖��f�[�^(����)��ێ�����(���� or �J�b�N���̉E��)
	this.direc;	// �Z���̖��f�[�^(����)��ێ�����(��� or �J�b�N���̉���)
	this.qans;	// �Z���̉񓚃f�[�^��ێ�����(���}�X or �񓚐���)
	this.qsub;	// �Z���̕⏕�f�[�^��ێ�����(���}�X or �w�i�F)
	this.error;	// �G���[�f�[�^��ێ�����
	this.numobj = '';	// ������\�����邽�߂̃G�������g
	this.numobj2 = '';	// ������\�����邽�߂̃G�������g

	this.allclear(id);
};
Cell.prototype = {
	//---------------------------------------------------------------------------
	// cell.allclear() �Z����cx,cy,numobj���ȊO���N���A����
	// cell.ansclear() �Z����qans,qsub,error�����N���A����
	// cell.subclear() �Z����qsub,error�����N���A����
	//---------------------------------------------------------------------------
	allclear : function(num) {
		this.ques = 0;
		this.qans = -1;
		this.qsub = 0;
		this.ques = 0;
		this.qnum = -1;
		if(k.puzzleid==="tilepaint"||k.puzzleid==="kakuro"){ this.qnum = 0;}
		this.direc = 0;
		if(k.puzzleid==="triplace"){ this.direc = -1;}
		this.error = 0;
	},
	ansclear : function(num) {
		this.qans = -1;
		this.qsub = 0;
		this.error = 0;
	},
	subclear : function(num) {
		this.qsub = 0;
		this.error = 0;
	}
};

//---------------------------------------------------------------------------
// ��Cross�N���X Board�N���X��Cross�̐������ێ�����(iscross==1�̎�)
//---------------------------------------------------------------------------
// �{�[�h�����o�f�[�^�̒�`(2)
// Cross�N���X�̒�`
Cross = function(id){
	this.cx;	// �����_��X���W��ێ�����
	this.cy;	// �����_��Y���W��ێ�����
	this.px;	// �����_�̕`��pX���W��ێ�����
	this.py;	// �����_�̕`��pY���W��ێ�����
	this.ques;	// �����_�̖��f�[�^(���_)��ێ�����
	this.qnum;	// �����_�̖��f�[�^(����)��ێ�����
	this.error;	// �G���[�f�[�^��ێ�����
	this.numobj = '';	// ������\�����邽�߂̃G�������g

	this.allclear(id);
};
Cross.prototype = {
	//---------------------------------------------------------------------------
	// cross.allclear() �����_��cx,cy,numobj���ȊO���N���A����
	// cross.ansclear() �����_��error�����N���A����
	// cross.subclear() �����_��error�����N���A����
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
	}
};

//---------------------------------------------------------------------------
// ��Border�N���X Board�N���X��Border�̐������ێ�����(isborder==1�̎�)
//---------------------------------------------------------------------------
// �{�[�h�����o�f�[�^�̒�`(3)
// Border�N���X�̒�`
Border = function(id){
	this.cx;	// ���E����X���W��ێ�����
	this.cy;	// ���E����Y���W��ێ�����
	this.px;	// ���E���̕`��X���W��ێ�����
	this.py;	// ���E���̕`��Y���W��ێ�����
	this.ques;	// ���E���̖��f�[�^��ێ�����(���E�� or �}�C�i���Y���̕s����)
	this.qnum;	// ���E���̖��f�[�^��ێ�����(�}�C�i���Y���̐���)
	this.qans;	// ���E���̉񓚃f�[�^��ێ�����(�񓚋��E�� or �X�������Ȃǂ̐�)
	this.qsub;	// ���E���̕⏕�f�[�^��ێ�����(1:�⏕��/2:�~)
	this.line;	// ���̉񓚃f�[�^��ێ�����
	this.color;	// ���̐F�����f�[�^��ێ�����
	this.error;	// �G���[�f�[�^��ێ�����
	this.numobj = '';	// ������\�����邽�߂̃G�������g

	this.allclear(id);
};
Border.prototype = {
	//---------------------------------------------------------------------------
	// border.allclear() ���E����cx,cy,numobj���ȊO���N���A����
	// border.ansclear() ���E����qans,qsub,line,color,error�����N���A����
	// border.subclear() ���E����qsub,error�����N���A����
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

	this.bdinside = 0;		// �Ֆʂ̓���(�O�g��łȂ�)�ɑ��݂��鋫�E���̖{��

	this.maxnum   = 99;		// ���͂ł���ő�̐���

	// �f�t�H���g�̃Z���Ȃ�
	this.defcell   = new Cell(0);
	this.defcross  = new Cross(0);
	this.defborder = new Border(0);

	this.enableLineNG = false;

	this.initBoardSize(k.qcols,k.qrows);
	this.setFunctions();
};
Board.prototype = {
	//---------------------------------------------------------------------------
	// bd.initBoardSize() �Ֆʂ̃T�C�Y�̕ύX���s��
	// bd.initGroup()     �����r���āA�I�u�W�F�N�g�̒ǉ����폜���s��
	// bd.initSpecial()   �p�Y���ʂŏ��������s��������������͂���
	//---------------------------------------------------------------------------
	initBoardSize : function(col,row){
		{
			this.initGroup(k.CELL,   this.cell,   col*row);
		}
		if(k.iscross){
			this.initGroup(k.CROSS,  this.cross,  (col+1)*(row+1));
		}
		if(k.isborder){
			this.initGroup(k.BORDER, this.border, 2*col*row+(k.isoutsideborder===0?-1:1)*(col+row));
		}
		if(k.isextendcell===1){
			this.initGroup(k.EXCELL, this.excell, col+row+1);
		}
		else if(k.isextendcell===2){
			this.initGroup(k.EXCELL, this.excell, 2*col+2*row+4);
		}

		this.initSpecial(col,row);

		// �e��T�C�Y�̕ύX
		if(!base.initProcess){
			tc.maxx += (col-k.qcols)*2;
			tc.maxy += (row-k.qrows)*2;
		}
		k.qcols = col;
		k.qrows = row;

		this.setposAll();
		if(!base.initProcess){ this.allclear();}
	},
	initGroup : function(type, group, len){
		var clen = group.length;
		// �����̃T�C�Y��菬�����Ȃ�Ȃ�delete����
		if(clen>len){
			for(var id=clen-1;id>=len;id--){ this.hideNumobj(type,id); delete group[id]; group.pop();}
		}
		// �����̃T�C�Y���傫���Ȃ�Ȃ�ǉ�����
		else if(clen<len){
			for(var id=clen;id<len;id++){ group.push(this.getnewObj(type,id));}
		}
	},
	initSpecial : function(){ },

	//---------------------------------------------------------------------------
	// bd.setposAll()    �S�Ă�Cell, Cross, Border�I�u�W�F�N�g��setposCell()�����Ăяo��
	//                   �Ֆʂ̐V�K�쐬��A�g��/�k��/��]/���]���ȂǂɌĂяo�����
	// bd.setposCell()   �Y������id�̃Z����cx,cy�v���p�e�B��ݒ肷��
	// bd.setposCross()  �Y������id�̌����_��cx,cy�v���p�e�B��ݒ肷��
	// bd.setposBorder() �Y������id�̋��E��/Line��cx,cy�v���p�e�B��ݒ肷��
	// bd.setposEXCell() �Y������id��Extend�Z����cx,cy�v���p�e�B��ݒ肷��
	//---------------------------------------------------------------------------
	// setpos�֘A�֐� <- �eCell���������Ă���ƃ������������������̂ł����ɒu������.
	setposAll : function(){
		this.setposCells();
		if(k.iscross)        { this.setposCrosses();}
		if(k.isborder)       { this.setposBorders();}
		if(k.isextendcell!=0){ this.setposEXcells();}
	},
	setposCells : function(){
		var x0=k.p0.x, y0=k.p0.y;
		this.cellmax = this.cell.length;
		for(var id=0;id<this.cellmax;id++){
			var obj = this.cell[id];
			obj.cx = id%k.qcols;
			obj.cy = mf(id/k.qcols);
			obj.px = x0 + mf(obj.cx*k.cwidth);
			obj.py = y0 + mf(obj.cy*k.cheight);
		}
	},
	setposCrosses : function(){
		var x0=k.p0.x, y0=k.p0.y;
		this.crossmax = this.cross.length;
		for(var id=0;id<this.crossmax;id++){
			var obj = this.cross[id];
			obj.cx = id%(k.qcols+1);
			obj.cy = mf(id/(k.qcols+1));
			obj.px = x0 + mf(obj.cx*k.cwidth);
			obj.py = y0 + mf(obj.cy*k.cheight);
		}
	},
	setposBorders : function(){
		var x0=k.p0.x, y0=k.p0.y;
		this.bdinside = 2*k.qcols*k.qrows-(k.qcols+k.qrows);
		this.bdmax = this.border.length;
		for(var id=0;id<this.bdmax;id++){
			var obj = this.border[id];
			if(id>=0 && id<(k.qcols-1)*k.qrows){
				obj.cx = (id%(k.qcols-1))*2+2;
				obj.cy = mf(id/(k.qcols-1))*2+1;
			}
			else if(id>=(k.qcols-1)*k.qrows && id<this.bdinside){
				obj.cx = (id-(k.qcols-1)*k.qrows)%k.qcols*2+1;
				obj.cy = mf((id-(k.qcols-1)*k.qrows)/k.qcols)*2+2;
			}
			else if(id>=this.bdinside && id<this.bdinside+k.qcols){
				obj.cx = (id-this.bdinside)*2+1;
				obj.cy = 0;
			}
			else if(id>=this.bdinside+k.qcols && id<this.bdinside+2*k.qcols){
				obj.cx = (id-this.bdinside-k.qcols)*2+1;
				obj.cy = k.qrows*2;
			}
			else if(id>=this.bdinside+2*k.qcols && id<this.bdinside+2*k.qcols+k.qrows){
				obj.cx = 0;
				obj.cy = (id-this.bdinside-2*k.qcols)*2+1;
			}
			else if(id>=this.bdinside+2*k.qcols+k.qrows && id<this.bdinside+2*(k.qcols+k.qrows)){
				obj.cx = k.qcols*2;
				obj.cy = (id-this.bdinside-2*k.qcols-k.qrows)*2+1;
			}
			obj.px = x0 + mf(obj.cx*k.cwidth/2);
			obj.py = y0 + mf(obj.cy*k.cheight/2);
		}
	},
	setposEXcells : function(){
		var x0=k.p0.x, y0=k.p0.y;
		this.excellmax = this.excell.length;
		for(var id=0;id<this.excellmax;id++){
			var obj = this.excell[id];
			if(k.isextendcell===1){
				if     (id<k.qcols)        { obj.cx=id; obj.cy=-1;        }
				else if(id<k.qcols+k.qrows){ obj.cx=-1; obj.cy=id-k.qcols;}
				else                       { obj.cx=-1; obj.cy=-1;        }
			}
			else if(k.isextendcell===2){
				if     (id<  k.qcols)            { obj.cx=id;         obj.cy=-1;                  }
				else if(id<2*k.qcols)            { obj.cx=id-k.qcols; obj.cy=k.qrows;             }
				else if(id<2*k.qcols+  k.qrows)  { obj.cx=-1;         obj.cy=id-2*k.qcols;        }
				else if(id<2*k.qcols+2*k.qrows)  { obj.cx=k.qcols;    obj.cy=id-2*k.qcols-k.qrows;}
				else if(id<2*k.qcols+2*k.qrows+1){ obj.cx=-1;         obj.cy=-1;     }
				else if(id<2*k.qcols+2*k.qrows+2){ obj.cx=k.qcols;    obj.cy=-1;     }
				else if(id<2*k.qcols+2*k.qrows+3){ obj.cx=-1;         obj.cy=k.qrows;}
				else if(id<2*k.qcols+2*k.qrows+4){ obj.cx=k.qcols;    obj.cy=k.qrows;}
				else                             { obj.cx=-1;         obj.cy=-1;     }
			}
			obj.px = x0 + obj.cx*k.cwidth;
			obj.py = y0 + obj.cy*k.cheight;
		}
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

	errclear : function(){
		if(!ans.errDisp){ return;}

		for(var i=0;i<this.cellmax  ;i++){ this.cell[i].error=0;}
		for(var i=0;i<this.crossmax ;i++){ this.cross[i].error=0;}
		for(var i=0;i<this.bdmax    ;i++){ this.border[i].error=0;}
		for(var i=0;i<this.excellmax;i++){ this.excell[i].error=0;}

		ans.errDisp = false;
		pc.paintAll();
	},

	//---------------------------------------------------------------------------
	// bd.getnewObj()   �w�肳�ꂽ�^�C�v�̐V�����I�u�W�F�N�g��Ԃ�
	// bd.isNullObj()   �w�肵���I�u�W�F�N�g�������l�Ɠ��������f����
	// bd.hideNumobj()  �w�肵���I�u�W�F�N�g��numobj���B��
	//---------------------------------------------------------------------------
	getnewObj : function(type,id){
		if(type===k.CELL || type===k.EXCELL){ return (new Cell(id));}
		else if(type===k.CROSS) { return (new Cross(id));}
		else if(type===k.BORDER){ return (new Border(id));}
	},
	isNullObj : function(type,id){
		if(type===k.CELL){
			return ((this.cell[id].qans === this.defcell.qans)&&
					(this.cell[id].qsub === this.defcell.qsub)&&
					(this.cell[id].ques === this.defcell.ques)&&
					(this.cell[id].qnum === this.defcell.qnum)&&
					(this.cell[id].direc=== this.defcell.direc));
		}
		else if(type===k.CROSS) {
			return (this.cross[id].qnum===this.defcross.qnum);
		}
		else if(type===k.BORDER){
			return ((this.border[id].qans === this.defborder.qans)&&
					(this.border[id].qsub === this.defborder.qsub)&&
					(this.border[id].ques === this.defborder.ques)&&
					(this.border[id].qnum === this.defborder.qnum)&&
					(this.border[id].line === this.defborder.line));
		}
		else if(type===k.EXCELL){
			return ((this.excell[id].qnum === this.defcell.qnum)&&
					(this.excell[id].direc=== this.defcell.direc));
		}
		return true;
	},

	hideNumobj : function(type,id){
		if(type===k.CELL){
			pc.hideEL(this.cell[id].numobj);
			pc.hideEL(this.cell[id].numobj2);
		}
		else if(type===k.CROSS) {
			pc.hideEL(this.cross[id].numobj);
		}
		else if(type===k.BORDER){
			pc.hideEL(this.border[id].numobj);
		}
		else if(type===k.EXCELL){
			pc.hideEL(this.excell[id].numobj);
			pc.hideEL(this.excell[id].numobj2);
		}
	},

	//---------------------------------------------------------------------------
	// bd.cnum()   (X,Y)�̈ʒu�ɂ���Cell��ID��Ԃ�
	// bd.cnum2()  (X,Y)�̈ʒu�ɂ���Cell��ID���A�Ֆʂ̑傫����(qc�~qr)�Ōv�Z���ĕԂ�
	// bd.xnum()   (X,Y)�̈ʒu�ɂ���Cross��ID��Ԃ�
	// bd.xnum2()  (X,Y)�̈ʒu�ɂ���Cross��ID���A�Ֆʂ̑傫����(qc�~qr)�Ōv�Z���ĕԂ�
	// bd.bnum()   (X*2,Y*2)�̈ʒu�ɂ���Border��ID��Ԃ�
	// bd.bnum2()  (X*2,Y*2)�̈ʒu�ɂ���Border��ID���A�Ֆʂ̑傫����(qc�~qr)�Ōv�Z���ĕԂ�
	// bd.exnum()  (X,Y)�̈ʒu�ɂ���extendCell��ID��Ԃ�
	// bd.exnum2() (X,Y)�̈ʒu�ɂ���extendCell��ID���A�Ֆʂ̑傫����(qc�~qr)�Ōv�Z���ĕԂ�
	//---------------------------------------------------------------------------
	cnum : function(cx,cy){
		return (cx>=0&&cx<=k.qcols-1&&cy>=0&&cy<=k.qrows-1)?cx+cy*k.qcols:-1;
	},
	cnum2 : function(cx,cy,qc,qr){
		return (cx>=0&&cx<=qc-1&&cy>=0&&cy<=qr-1)?cx+cy*qc:-1;
	},
	xnum : function(cx,cy){
		return (cx>=0&&cx<=k.qcols&&cy>=0&&cy<=k.qrows)?cx+cy*(k.qcols+1):-1;
	},
	xnum2 : function(cx,cy,qc,qr){
		return (cx>=0&&cx<=qc&&cy>=0&&cy<=qr)?cx+cy*(qc+1):-1;
	},
	bnum : function(cx,cy){
		return this.bnum2(cx,cy,k.qcols,k.qrows);
	},
	bnum2 : function(cx,cy,qc,qr){
		if(cx>=1&&cx<=qc*2-1&&cy>=1&&cy<=qr*2-1){
			if     (!(cx&1) &&  (cy&1)){ return ((cx>>1)-1)+(cy>>1)*(qc-1);}
			else if( (cx&1) && !(cy&1)){ return (cx>>1)+((cy>>1)-1)*qc+(qc-1)*qr;}
		}
		else if(k.isoutsideborder==1){
			if     (cy===0   &&(cx&1)&&(cx>=1&&cx<=2*qc-1)){ return (qc-1)*qr+qc*(qr-1)+(cx>>1);}
			else if(cy===2*qr&&(cx&1)&&(cx>=1&&cx<=2*qc-1)){ return (qc-1)*qr+qc*(qr-1)+qc+(cx>>1);}
			else if(cx===0   &&(cy&1)&&(cy>=1&&cy<=2*qr-1)){ return (qc-1)*qr+qc*(qr-1)+2*qc+(cy>>1);}
			else if(cx===2*qc&&(cy&1)&&(cy>=1&&cy<=2*qr-1)){ return (qc-1)*qr+qc*(qr-1)+2*qc+qr+(cy>>1);}
		}
		return -1;
	},
	exnum : function(cx,cy){
		return this.exnum2(cx,cy,k.qcols,k.qrows);
	},
	exnum2 : function(cx,cy,qc,qr){
		if(k.isextendcell===1){
			if(cx===-1&&cy===-1){ return qc+qr;}
			else if(cy===-1&&cx>=0&&cx<qc){ return cx;}
			else if(cx===-1&&cy>=0&&cy<qr){ return qc+cy;}
		}
		else if(k.isextendcell===2){
			if     (cy===-1&&cx>=0&&cx<qc){ return cx;}
			else if(cy===qr&&cx>=0&&cx<qc){ return qc+cx;}
			else if(cx===-1&&cy>=0&&cy<qr){ return 2*qc+cy;}
			else if(cx===qc&&cy>=0&&cy<qr){ return 2*qc+qr+cy;}
			else if(cx===-1&&cy===-1){ return 2*qc+2*qr;}
			else if(cx===qc&&cy===-1){ return 2*qc+2*qr+1;}
			else if(cx===-1&&cy===qr){ return 2*qc+2*qr+2;}
			else if(cx===qc&&cy===qr){ return 2*qc+2*qr+3;}
		}
		return -1;
	},

	//---------------------------------------------------------------------------
	// bd.up() bd.dn() bd.lt() bd.rt()  �Z���̏㉺���E�ɐڂ���Z����ID��Ԃ�
	//---------------------------------------------------------------------------
	up : function(cc){ return this.cell[cc]?this.cnum(this.cell[cc].cx  ,this.cell[cc].cy-1):-1;},	//��̃Z����ID�����߂�
	dn : function(cc){ return this.cell[cc]?this.cnum(this.cell[cc].cx  ,this.cell[cc].cy+1):-1;},	//���̃Z����ID�����߂�
	lt : function(cc){ return this.cell[cc]?this.cnum(this.cell[cc].cx-1,this.cell[cc].cy  ):-1;},	//���̃Z����ID�����߂�
	rt : function(cc){ return this.cell[cc]?this.cnum(this.cell[cc].cx+1,this.cell[cc].cy  ):-1;},	//�E�̃Z����ID�����߂�
	//---------------------------------------------------------------------------
	// bd.ub() bd.db() bd.lb() bd.rb()  �Z���̏㉺���E�ɂ��鋫�E����ID��Ԃ�
	//---------------------------------------------------------------------------
	ub : function(cc){ return this.cell[cc]?this.bnum(2*this.cell[cc].cx+1,2*this.cell[cc].cy  ):-1;},	//�Z���̏�̋��E����ID�����߂�
	db : function(cc){ return this.cell[cc]?this.bnum(2*this.cell[cc].cx+1,2*this.cell[cc].cy+2):-1;},	//�Z���̉��̋��E����ID�����߂�
	lb : function(cc){ return this.cell[cc]?this.bnum(2*this.cell[cc].cx  ,2*this.cell[cc].cy+1):-1;},	//�Z���̍��̋��E����ID�����߂�
	rb : function(cc){ return this.cell[cc]?this.bnum(2*this.cell[cc].cx+2,2*this.cell[cc].cy+1):-1;},	//�Z���̉E�̋��E����ID�����߂�

	//---------------------------------------------------------------------------
	// bd.cc1()      ���E���̂����ォ�������ɂ���Z����ID��Ԃ�
	// bd.cc2()      ���E���̂������������E�ɂ���Z����ID��Ԃ�
	// bd.crosscc1() ���E���̂����ォ�������ɂ�������_��ID��Ԃ�
	// bd.crosscc2() ���E���̂������������E�ɂ�������_��ID��Ԃ�
	//---------------------------------------------------------------------------
	cc1 : function(id){
		return this.cnum((bd.border[id].cx-bd.border[id].cy%2)>>1, (bd.border[id].cy-bd.border[id].cx%2)>>1);
	},
	cc2 : function(id){
		return this.cnum((bd.border[id].cx+bd.border[id].cy%2)>>1, (bd.border[id].cy+bd.border[id].cx%2)>>1);
	},
	crosscc1 : function(id){
		return this.xnum((bd.border[id].cx-bd.border[id].cx%2)>>1, (bd.border[id].cy-bd.border[id].cy%2)>>1);
	},
	crosscc2 : function(id){
		return this.xnum((bd.border[id].cx+bd.border[id].cx%2)>>1, (bd.border[id].cy+bd.border[id].cy%2)>>1);
	},

	//---------------------------------------------------------------------------
	// bd.bcntCross() �w�肳�ꂽ�ʒu��Cross�̎���4�}�X�̂���qans==1�̃}�X�̐������߂�
	//---------------------------------------------------------------------------
	bcntCross : function(cx,cy) {
		var cnt = 0;
		if(this.isBlack(this.cnum(cx-1, cy-1))){ cnt++;}
		if(this.isBlack(this.cnum(cx  , cy-1))){ cnt++;}
		if(this.isBlack(this.cnum(cx-1, cy  ))){ cnt++;}
		if(this.isBlack(this.cnum(cx  , cy  ))){ cnt++;}
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
		return bd.border[id].cx&1 ? (bd.isLPdown(bd.cc1(id)) || bd.isLPup(bd.cc2(id))) :
									(bd.isLPright(bd.cc1(id)) || bd.isLPleft(bd.cc2(id)));
	},
	isLPCombined : function(id){
		return bd.border[id].cx&1 ? (bd.isLPdown(bd.cc1(id)) && bd.isLPup(bd.cc2(id))) :
									(bd.isLPright(bd.cc1(id)) && bd.isLPleft(bd.cc2(id)));
	},
	isLineNG : function(id){
		return bd.border[id].cx&1 ? (bd.isnoLPdown(bd.cc1(id)) || bd.isnoLPup(bd.cc2(id))) :
									(bd.isnoLPright(bd.cc1(id)) || bd.isnoLPleft(bd.cc2(id)));
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
		if(k.dispzero===0 && num===0){ return;}

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

		if(um.isenableInfo() && (num>0 ^ old>0)){ area.call_setBorder(id,num,k.QUES);}
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
			else                { area.call_setBorder(id,num,k.QANS);}
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
			(k.isAnsNumber) ? function(c){ return (c!==-1 && (bd.cell[c].qnum!==-1 || bd.cell[c].qans!==-1));}
							: function(c){ return (c!==-1 &&  bd.cell[c].qnum!==-1);}
		);
		this.noNum = (
			(k.isAnsNumber) ? function(c){ return (c===-1 || (bd.cell[c].qnum===-1 && bd.cell[c].qans===-1));}
							: function(c){ return (c===-1 ||  bd.cell[c].qnum===-1);}
		);
		this.isValidNum = (
			(k.isAnsNumber) ? function(c){ return (c!==-1 && (bd.cell[c].qnum>=  0 ||(bd.cell[c].qans>=0 && bd.cell[c].qnum===-1)));}
							: function(c){ return (c!==-1 &&  bd.cell[c].qnum>=  0);}
		);
		this.sameNumber     = function(c1,c2){ return (bd.isValidNum(c1) && (bd.getNum(c1)===bd.getNum(c2)));};

		//-----------------------------------------------------------------------
		// bd.getNum()     �Y������Cell�̐�����Ԃ�
		// bd.setNum()     �Y������Cell�ɐ�����ݒ肷��
		//-----------------------------------------------------------------------
		this.getNum = (
			(k.isAnsNumber) ? function(c){ return (c!==-1 ? this.cell[c].qnum!==-1 ? this.cell[c].qnum : this.cell[c].qans : -1);}
							: function(c){ return (c!==-1 ? this.cell[c].qnum : -1);}
		);
		this.setNum = (
			((k.NumberIsWhite) ?
				function(c,val){
					if(!k.dispzero && val===0){ return;}
					this.sQnC(c,val);
					this.sQaC(c,bd.defcell.qnum);
				}
			:(k.isAnsNumber) ?
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
	this.Cellcolor = "black";
	this.errcolor1 = "rgb(224, 0, 0)";
	this.errcolor2 = "rgb(64, 64, 255)";
	this.errcolor3 = "rgb(0, 191, 0)";

	// �Z���̊ې����̒��ɏ����F
	this.circledcolor = "white";

	// �Z���́��~�̐F(�⏕�L��)
	this.MBcolor = "rgb(255, 160, 127)";

	this.qsubcolor1 = "rgb(160,255,160)";
	this.qsubcolor2 = "rgb(255,255,127)";
	this.qsubcolor3 = "rgb(192,192,192)";	// �G���o��p�Y���̔w�i����

	// �t�H���g�̐F(���}�X/���}�X)
	this.fontcolor = "black";
	this.fontAnscolor = "rgb(0, 160, 0)";
	this.fontErrcolor = "rgb(191, 0, 0)";
	this.BCell_fontcolor = "rgb(224, 224, 224)";

	this.borderfontcolor = "black";

	// �Z���̔w�i�F(���}�X)
	this.bcolor = "white";
	this.dotcolor = "black";
	this.errbcolor1 = "rgb(255, 160, 160)";
	this.errbcolor2 = "rgb(64, 255, 64)";

	this.icecolor = "rgb(192, 224, 255)";

	// ques=51�̂Ƃ��A���͂ł���ꏊ�̔w�i�F
	this.TTcolor = "rgb(127,255,127)";

	// ���E���̐F
	this.BorderQuescolor = "black";
	this.BorderQanscolor = "rgb(0, 191, 0)";
	this.BorderQsubcolor = "rgb(255, 0, 255)";

	this.errBorderQanscolor2 = "rgb(160, 160, 160)";

	this.BBcolor = "rgb(96, 96, 96)"; // ���E���ƍ��}�X�𕪂���F

	// ���E�~�̐F
	this.linecolor = "rgb(0, 160, 0)";	// �F�����Ȃ��̏ꍇ
	this.pekecolor = "rgb(32, 32, 255)";

	this.errlinecolor1 = "rgb(255, 0, 0)";
	this.errlinecolor2 = "rgb(160, 160, 160)";

	// ���̓^�[�Q�b�g�̐F
	this.targetColor1 = "rgb(255, 64,  64)";
	this.targetColor3 = "rgb(64,  64, 255)";

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

	this.lw = 1;	// LineWidth ���E���ELine�̑���
	this.lm = 1;	// LineMargin
	this.addlw = 0;	// �G���[���ɐ��̑������L����

	this.chassisflag = true;	// false: Grid���O�g�̈ʒu�ɂ��`�悷��
	this.zstable     = false;	// �F�����̈ꕔ�ĕ`�掞��true�ɂ���(VML�p)
	this.textenable  = false;	// ������g.fillText()�ŕ`��(���݂̓R�����g�A�E�g)

	this.lastHdeg = 0;
	this.lastYdeg = 0;
	this.minYdeg = 0.18;
	this.maxYdeg = 0.70;

	var numobj_attr = {className:'divnum', unselectable:'on'};
	this.EL_NUMOBJ = ee.addTemplate('numobj_parent', 'div', numobj_attr, null, null);

	var isdrawBC = false, isdrawBD = false;

	this.setFunctions();
};
Graphic.prototype = {
	//---------------------------------------------------------------------------
	// pc.onresize_func() resize���ɃT�C�Y��ύX����
	// pc.already()       Canvas�����p�ł��邩(Safari3�΍��p)
	//---------------------------------------------------------------------------
	onresize_func : function(){
		this.lw = (mf(k.cwidth/12)>=3?mf(k.cwidth/12):3);
		this.lm = mf((this.lw-1)/2);

		//this.textenable = !!g.fillText;
	},
	already : (!k.br.IE ? f_true : function(){
		return uuCanvas.already();
	}),
	//---------------------------------------------------------------------------
	// pc.paint()       ���W(x1,y1)-(x2,y2)���ĕ`�悷��B�e�p�Y���̃t�@�C���ŃI�[�o�[���C�h�����B
	// pc.paintAll()    �S�̂��ĕ`�悷��
	// pc.paintBorder() �w�肳�ꂽBorder�̎�����ĕ`�悷��
	// pc.paintLine()   �w�肳�ꂽLine�̎�����ĕ`�悷��
	// pc.paintCell()   �w�肳�ꂽCell���ĕ`�悷��
	// pc.paintEXcell() �w�肳�ꂽEXCell���ĕ`�悷��
	//---------------------------------------------------------------------------
	paint : function(x1,y1,x2,y2){ }, //�I�[�o�[���C�h�p
	paintAll : (
		(!k.br.IE) ? function(){ this.paint(-1,-1,k.qcols,k.qrows); }
				   : function(){ if(this.already()){ this.paint(-1,-1,k.qcols,k.qrows);} }
	),
	paintBorder : function(id){
		if(isNaN(id) || !bd.border[id]){ return;}
		if(bd.border[id].cx&1){
			this.paint((bd.border[id].cx>>1)-1, (bd.border[id].cy>>1)-1,
					   (bd.border[id].cx>>1)+1, (bd.border[id].cy>>1)   );
		}
		else{
			this.paint((bd.border[id].cx>>1)-1, (bd.border[id].cy>>1)-1,
					   (bd.border[id].cx>>1)  , (bd.border[id].cy>>1)+1 );
		}
	},
	paintLine : function(id){
		if(isNaN(id) || !bd.border[id]){ return;}
		if(bd.border[id].cx&1){
			this.paint((bd.border[id].cx>>1), (bd.border[id].cy>>1)-1,
					   (bd.border[id].cx>>1), (bd.border[id].cy>>1)   );
		}
		else{
			this.paint((bd.border[id].cx>>1)-1, (bd.border[id].cy>>1),
					   (bd.border[id].cx>>1)  , (bd.border[id].cy>>1) );
		}
	},
	paintCell : function(cc){
		if(isNaN(cc) || !bd.cell[cc]){ return;}
		this.paint(bd.cell[cc].cx, bd.cell[cc].cy, bd.cell[cc].cx, bd.cell[cc].cy);
	},
	paintEXcell : function(ec){
		if(isNaN(ec) || !bd.excell[ec]){ return;}
		this.paint(bd.excell[ec].cx, bd.excell[ec].cy, bd.excell[ec].cx, bd.excell[ec].cy);
	},

	//---------------------------------------------------------------------------
	// pc.cellinside()   ���W(x1,y1)-(x2,y2)�Ɋ܂܂��Cell��ID���X�g���擾����
	// pc.crossinside()  ���W(x1,y1)-(x2,y2)�Ɋ܂܂��Cross��ID���X�g���擾����
	// pc.borderinside() ���W(x1,y1)-(x2,y2)�Ɋ܂܂��Border��ID���X�g���擾����
	// pc.excellinside() ���W(x1,y1)-(x2,y2)�Ɋ܂܂��Excell��ID���X�g���擾����
	// pc.cellinside_cond() ���W(x1,y1)-(x2,y2)�Ɋ܂܂������t��Cell��ID���X�g���擾����
	//---------------------------------------------------------------------------
	cellinside : function(x1,y1,x2,y2){
		var clist = [];
		for(var cy=y1;cy<=y2;cy++){ for(var cx=x1;cx<=x2;cx++){
			var c = bd.cnum(cx,cy);
			if(c!==-1){ clist.push(c);}
		}}
		return clist;
	},
	crossinside : function(x1,y1,x2,y2){
		var clist = [];
		for(var cy=y1;cy<=y2;cy++){ for(var cx=x1;cx<=x2;cx++){
			var c = bd.xnum(cx,cy);
			if(c!==-1){ clist.push(c);}
		}}
		return clist;
	},
	borderinside : function(x1,y1,x2,y2){
		var idlist = [];
		for(var by=y1;by<=y2;by++){ for(var bx=x1;bx<=x2;bx++){
			if(bx&1===by&1){ continue;}
			var id = bd.bnum(bx,by);
			if(id!==-1){ idlist.push(id);}
		}}
		return idlist;
	},
	excellinside : function(x1,y1,x2,y2){
		var exlist = [];
		for(var cy=y1;cy<=y2;cy++){ for(var cx=x1;cx<=x2;cx++){
			var c = bd.exnum(cx,cy);
			if(c!==-1){ exlist.push(c);}
		}}
		return exlist;
	},

	cellinside_cond : function(x1,y1,x2,y2,func){
		var clist = [];
		for(var cy=y1;cy<=y2;cy++){ for(var cx=x1;cx<=x2;cx++){
			var c = bd.cnum(cx,cy);
			if(c!==-1 && func(c)){ clist.push(c);}
		}}
		return clist;
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
	// pc.inputPath()  ���X�g����g.lineTo()���̊֐����Ăяo��
	//---------------------------------------------------------------------------
	inputPath : function(parray, isClose){
		g.beginPath();
		g.moveTo(mf(parray[0]+parray[2]), mf(parray[1]+parray[3]));
		for(var i=4;i<parray.length;i+=2){ g.lineTo(mf(parray[0]+parray[i+0]), mf(parray[1]+parray[i+1]));}
		if(isClose){ g.closePath();}
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
		var header = "c_fullb_";

		if(!k.br.IE && this.isdrawBC && !this.isdrawBD){ x1--; y1--; x2++; y2++;}
		var clist = this.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(this.setCellColor(c)){
				if(this.vnop(header+c,1)){
					g.fillRect(bd.cell[c].px, bd.cell[c].py, k.cwidth+1, k.cheight+1);
				}
			}
			else{ this.vhide(header+c); continue;}
		}
		this.vinc();
		this.isdrawBC = true;
	},
	// 'qans'�p
	setCellColor : function(c){
		var err = bd.cell[c].error;
		if(bd.cell[c].qans!==1){ return false;}
		else if(err===0){ g.fillStyle = this.Cellcolor; return true;}
		else if(err===1){ g.fillStyle = this.errcolor1; return true;}
		return false;
	},
	setCellColorFunc : function(type){
		switch(type){
		case 'qnum':
			this.setCellColor = function(c){
				var err = bd.cell[c].error;
				if(bd.cell[c].qnum===-1){ return false;}
				else if(err===0){ g.fillStyle = this.Cellcolor; return true;}
				else if(err===1){ g.fillStyle = this.errcolor1; return true;}
				return false;
			};
			break;
		default:
			break;
		}
	},

	drawBGCells : function(x1,y1,x2,y2){
		var header = "c_full_";

		var clist = this.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(this.setBGCellColor(c)){
				if(this.vnop(header+c,1)){
					g.fillRect(bd.cell[c].px, bd.cell[c].py, k.cwidth+1, k.cheight+1);
				}
			}
			else{ this.vhide(header+c); continue;}
		}
		this.vinc();
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
					g.fillStyle = (cell.error===1 ? this.errcolor1 : this.Cellcolor);
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
					if     (cell.error===0){ g.fillStyle = this.Cellcolor;}
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
	// pc.drawRDotCells()  �E������Canvas�ɏ�������(�E�p)
	// pc.drawDotCells()   �E������Canvas�ɏ�������(�������l�p�`�p)
	//---------------------------------------------------------------------------
	drawRDotCells : function(x1,y1,x2,y2){
		var dsize = k.cwidth*0.06; dsize=(dsize>2?dsize:2);
		var header = "c_rdot_";

		var clist = this.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.cell[c].qsub===1){
				g.fillStyle = this.dotcolor;
				if(this.vnop(header+c,1)){
					g.beginPath();
					g.arc(bd.cell[c].px+k.cwidth/2, bd.cell[c].py+k.cheight/2, dsize, 0, Math.PI*2, false);
					g.fill();
				}
			}
			else{ this.vhide(header+c);}
		}
		this.vinc();
	},
	drawDotCells : function(x1,y1,x2,y2){
		var ksize = k.cwidth*0.15;
		var header = "c_dot_";

		var clist = this.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.cell[c].qsub===1){
				g.fillStyle = this.dotcolor;
				if(this.vnop(header+c,1)){
					g.fillRect(bd.cell[c].px+mf(k.cwidth/2)-mf(ksize/2), bd.cell[c].py+mf(k.cheight/2)-mf(ksize/2), ksize, ksize);
				}
			}
			else{ this.vhide(header+c);}
		}
		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.drawNumbers()      Cell�̐�����Canvas�ɏ�������
	// pc.drawArrowNumbers() Cell�̐����Ɩ���Canvas�ɏ�������
	// pc.drawQuesHatenas()  ques===-2�̎��ɁH��Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawNumbers : function(x1,y1,x2,y2){
		var clist = this.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){ this.dispnumCell(clist[i]);}
		this.vinc();
	},
	drawArrowNumbers : function(x1,y1,x2,y2){
		var headers = ["c_ar1_", "c_dt1_", "c_dt2_", "c_ar3_", "c_dt3_", "c_dt4_"];
		var ll = mf(k.cwidth*0.7);							//LineLength
		var ls = mf((k.cwidth-ll)/2);						//LineStart
		var lw = (mf(k.cwidth/24)>=1?mf(k.cwidth/24):1);	//LineWidth
		var lm = mf((lw-1)/2);								//LineMargin

		if(!k.br.IE && this.isdrawBC && !this.isdrawBD){ x1--; y1--; x2++; y2++;}
		var clist = this.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];

			if(bd.cell[c].qnum!==-1 && (bd.cell[c].qnum!==-2||k.isDispHatena)){
				var ax=px=bd.cell[c].px, ay=py=bd.cell[c].py, dir = bd.cell[c].direc;

				if     (bd.cell[c].qans ===1){ g.fillStyle = this.BCell_fontcolor;}
				else if(bd.cell[c].error===1){ g.fillStyle = this.fontErrcolor;}
				else                         { g.fillStyle = this.fontcolor;}

				// ���̕`��(�㉺����)
				if(dir===k.UP||dir===k.DN){
					// ���̐��̕`��
					ax+=(k.cwidth-mf(ls*1.5)-lm); ay+=(ls+1);
					if(this.vnop(headers[0]+c,1)){ g.fillRect(ax, ay, lw, ll);}
					ax+=mf(lw/2);

					// ���̕`��
					if(dir===k.UP){
						if(this.vnop(headers[1]+c,1)){
							this.inputPath([ax,ay     ,0,0 ,-ll/6, ll/3 ,ll/6, ll/3], true);
							g.fill();
						}
					}
					else{ this.vhide(headers[1]+c);}
					if(dir===k.DN){
						if(this.vnop(headers[2]+c,1)){
							this.inputPath([ax,ay+ll  ,0,0 ,-ll/6,-ll/3 ,ll/6,-ll/3], true);
							g.fill();
						}
					}
					else{ this.vhide(headers[2]+c);}
				}
				else{ this.vhide([headers[0]+c, headers[1]+c, headers[2]+c]);}

				// ���̕`��(���E����)
				if(dir===k.LT||dir===k.RT){
					// ���̐��̕`��
					ax+=(ls+1); ay+=(mf(ls*1.5)-lm);
					if(this.vnop(headers[3]+c,1)){ g.fillRect(ax, ay, ll, lw);}
					ay+=mf(lw/2);

					// ���̕`��
					if(dir===k.LT){
						if(this.vnop(headers[4]+c,1)){
							this.inputPath([ax   ,ay  ,0,0 , ll/3,-ll/6 , ll/3,ll/6], true);
							g.fill();
						}
					}
					else{ this.vhide(headers[4]+c);}
					if(dir===k.RT){
						if(this.vnop(headers[5]+c,1)){
							this.inputPath([ax+ll,ay  ,0,0 ,-ll/3,-ll/6 ,-ll/3,ll/6], true);
							g.fill();
						}
					}
					else{ this.vhide(headers[5]+c);}
				}
				else{ this.vhide([headers[3]+c, headers[4]+c, headers[5]+c]);}

				// �����̕`��
				if(!bd.cell[c].numobj){ bd.cell[c].numobj = this.CreateDOMAndSetNop();}
				var num = bd.getNum(c), text = (num>=0 ? ""+num : "?");
				var fontratio = (num<10?0.8:(num<100?0.7:0.55));
				var color = g.fillStyle;

				var type=1;
				if     (dir===k.UP||dir===k.DN){ type=6; fontratio *= 0.85;}
				else if(dir===k.LT||dir===k.RT){ type=7; fontratio *= 0.85;}

				this.dispnum(bd.cell[c].numobj, type, text, fontratio, color, px, py);
			}
			else{
				this.vhide([headers[0]+c, headers[1]+c, headers[2]+c, headers[3]+c, headers[4]+c, headers[5]+c]);
				this.hideEL(bd.cell[c].numobj);
			}
		}
		this.vinc();
	},
	drawQuesHatenas : function(x1,y1,x2,y2){
		var clist = this.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var obj = bd.cell[clist[i]];
			if(obj.ques!==-2){ this.hideEL(obj.numobj); continue;}
			if(!obj.numobj){ obj.numobj = this.CreateDOMAndSetNop();}
			var color = (obj.error===1 ? this.fontErrcolor : this.fontcolor);
			this.dispnum(obj.numobj, 1, "?", 0.8, color, obj.px, obj.py);
		}
		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.drawCrosses()    Cross�̊ې�����Canvas�ɏ�������
	// pc.drawCrossMarks() Cross��̍��_��Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawCrosses : function(x1,y1,x2,y2){
		var csize = mf(k.cwidth*this.crosssize+1);
		var headers = ["x_cp1_", "x_cp2_"];
		g.lineWidth = 1;

		var clist = this.crossinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.cross[c].qnum!==-1){
				g.fillStyle = (bd.cross[c].error===1 ? this.errcolor1 : "white");
				if(this.vnop(headers[0]+c,1)){
					g.beginPath();
					g.arc(bd.cross[c].px, bd.cross[c].py, csize, 0, Math.PI*2, false);
					g.fill();
				}

				g.strokeStyle = "black";
				if(this.vnop(headers[1]+c,0)){
					if(k.br.IE){
						g.beginPath();
						g.arc(bd.cross[c].px, bd.cross[c].py, csize, 0, Math.PI*2, false);
					}
					g.stroke();
				}
			}
			else{ this.vhide([headers[0]+c, headers[1]+c]);}
			this.dispnumCross(c);
		}
		this.vinc();
	},
	drawCrossMarks : function(x1,y1,x2,y2){
		var csize = k.cwidth*this.crosssize;
		var header = "x_cm_";

		var clist = this.crossinside(x1-1,y1-1,x2+1,y2+1);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.cross[c].qnum===1){
				g.fillStyle = (bd.cross[c].error===1 ? this.errcolor1 : this.Cellcolor);
				if(this.vnop(header+c,1)){
					g.beginPath();
					g.arc(bd.cross[c].px, bd.cross[c].py, csize, 0, Math.PI*2, false);
					g.fill();
				}
			}
			else{ this.vhide(header+c);}
		}
		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.drawBorders()       ���E����Canvas�ɏ�������
	// pc.drawBordersAsLine() k.isborderAsLine===1�̎��A����Canvas�ɏ�������
	// pc.drawIceBorders()    �A�C�X�o�[���̋��E����Canvas�ɏ�������
	// pc.drawBorder1x()      (x,y)���w�肵��1�J���̋��E����Canvas�ɏ�������
	// pc.drawBorderQsubs()   ���E���p�̕⏕�L����Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawBorders : function(x1,y1,x2,y2){
		var idlist = this.borderinside(x1*2-2,y1*2-2,x2*2+2,y2*2+2);
		for(var i=0;i<idlist.length;i++){
			var id = idlist[i];

			if     (bd.border[id].qans !==1){ g.fillStyle = this.BorderQuescolor;    }
			else if(bd.border[id].error===1){ g.fillStyle = this.errcolor1;          }
			else if(bd.border[id].error===2){ g.fillStyle = this.errBorderQanscolor2;}
			else                            { g.fillStyle = this.BorderQanscolor;    }

			this.drawBorder1x(bd.border[id].cx, bd.border[id].cy, bd.isBorder(id));
		}
		this.vinc();
		this.isdrawBD = true;
	},
	drawBordersAsLine : function(x1,y1,x2,y2){
		var idlist = this.borderinside(x1*2-2,y1*2-2,x2*2+2,y2*2+2);
		for(var i=0;i<idlist.length;i++){
			var id = idlist[i];

			if(bd.border[id].qans!==1){ g.fillStyle = this.BorderQuescolor; }
			else                      { g.fillStyle = this.getLineColor(id);}

			this.drawBorder1x(bd.border[id].cx, bd.border[id].cy, bd.isBorder(id));
		}
		this.vinc();
		this.addlw = 0;
	},
	drawIceBorders : function(x1,y1,x2,y2){
		g.fillStyle = this.Cellcolor;
		var idlist = this.borderinside(x1*2-2,y1*2-2,x2*2+2,y2*2+2);
		for(var i=0;i<idlist.length;i++){
			var id = idlist[i], cc1 = bd.cc1(id), cc2 = bd.cc2(id);

			var flag = (cc1!==-1 && cc2!==-1 && (bd.cell[cc1].ques===6^bd.cell[cc2].ques===6));
			this.drawBorder1x(bd.border[id].cx, bd.border[id].cy, flag);
		}
		this.vinc();
	},

	drawBorder1x : function(bx,by,flag){
		var vid = ["b_bd", bx, by].join("_");
		if(!flag){ this.vhide(vid); return;}

		if(this.vnop(vid,1)){
			var lw = this.lw + this.addlw, lm = this.lm;

			if     (by&1){ g.fillRect(k.p0.x+mf(bx*k.cwidth/2)-lm, k.p0.x+mf((by-1)*k.cheight/2)-lm, lw, k.cheight+lw);}
			else if(bx&1){ g.fillRect(k.p0.x+mf((bx-1)*k.cwidth/2)-lm, k.p0.x+mf(by*k.cheight/2)-lm, k.cwidth+lw,  lw);}
		}
	},

	drawBorderQsubs : function(x1,y1,x2,y2){
		var m = mf(k.cwidth*0.15); //Margin
		var header = "b_qsub1_";
		g.fillStyle = this.BorderQsubcolor;

		var idlist = this.borderinside(x1*2-2,y1*2-2,x2*2+2,y2*2+2);
		for(var i=0;i<idlist.length;i++){
			var id = idlist[i];
			if(bd.border[id].qsub===1){
				if(this.vnop(header+id,1)){
					if     (bd.border[id].cx&1){ g.fillRect(bd.border[id].px, bd.border[id].py-mf(k.cheight/2)+m, 1,k.cheight-2*m);}
					else if(bd.border[id].cy&1){ g.fillRect(bd.border[id].px-mf(k.cwidth/2)+m,  bd.border[id].py, k.cwidth-2*m, 1);}
				}
			}
			else{ this.vhide(header+id);}
		}
		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.drawBoxBorders() ���E���ƍ��}�X�̊Ԃ̐���`�悷��
	//---------------------------------------------------------------------------
	// �O�g���Ȃ��ꍇ�͍l�����Ă��܂���
	drawBoxBorders  : function(x1,y1,x2,y2,tileflag){
		var lw = this.lw, lm = this.lm+1;
		var cw = k.cwidth;
		var ch = k.cheight;
		var chars = ['u','d','l','r'];

		g.fillStyle = this.BBcolor;

		var clist = this.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i], vids=[];
			for(var n=0;n<12;n++){ vids[n]=['c_bb',n,c].join('_');}
			if(bd.cell[c].qans!==1){ this.vhide(vids); continue;}

			var cx = bd.cell[c].cx, cy = bd.cell[c].cy, bx = 2*cx+1, by = 2*cy+1;
			var px = bd.cell[c].px, py = bd.cell[c].py;

			// ���̊֐����Ăԏꍇ�͑S��k.isoutsideborder===0�Ȃ̂�
			// �O�g�p�̍l���������폜���Ă��܂��B
			var UPin = (cy>0), DNin = (cy<k.qrows-1);
			var LTin = (cx>0), RTin = (cx<k.qcols-1);

			var isUP = (!UPin || bd.border[bd.bnum(bx  ,by-1)].ques===1);
			var isDN = (!DNin || bd.border[bd.bnum(bx  ,by+1)].ques===1);
			var isLT = (!LTin || bd.border[bd.bnum(bx-1,by  )].ques===1);
			var isRT = (!RTin || bd.border[bd.bnum(bx+1,by  )].ques===1);

			var isUL = (!UPin || !LTin || bd.border[bd.bnum(bx-2,by-1)].ques===1 || bd.border[bd.bnum(bx-1,by-2)].ques===1);
			var isUR = (!UPin || !RTin || bd.border[bd.bnum(bx+2,by-1)].ques===1 || bd.border[bd.bnum(bx+1,by-2)].ques===1);
			var isDL = (!DNin || !LTin || bd.border[bd.bnum(bx-2,by+1)].ques===1 || bd.border[bd.bnum(bx-1,by+2)].ques===1);
			var isDR = (!DNin || !RTin || bd.border[bd.bnum(bx+2,by+1)].ques===1 || bd.border[bd.bnum(bx+1,by+2)].ques===1);

			if(isUP){ if(this.vnop(vids[0],1)){ g.fillRect(px   +lm, py   +lm, cw-lw,1    );} }else{ this.vhide(vids[0]);}
			if(isDN){ if(this.vnop(vids[1],1)){ g.fillRect(px   +lm, py+ch-lm, cw-lw,1    );} }else{ this.vhide(vids[1]);}
			if(isLT){ if(this.vnop(vids[2],1)){ g.fillRect(px   +lm, py   +lm, 1    ,ch-lw);} }else{ this.vhide(vids[2]);}
			if(isRT){ if(this.vnop(vids[3],1)){ g.fillRect(px+cw-lm, py   +lm, 1    ,ch-lw);} }else{ this.vhide(vids[3]);}

			if(tileflag){
				if(!isUP&&(isUL||isLT)){ if(this.vnop(vids[4],1)){ g.fillRect(px   +lm, py   -lm, 1   ,lw+1);} }else{ this.vhide(vids[4]);}
				if(!isUP&&(isUR||isRT)){ if(this.vnop(vids[5],1)){ g.fillRect(px+cw-lm, py   -lm, 1   ,lw+1);} }else{ this.vhide(vids[5]);}
				if(!isLT&&(isUL||isUP)){ if(this.vnop(vids[6],1)){ g.fillRect(px   -lm, py   +lm, lw+1,1   );} }else{ this.vhide(vids[6]);}
				if(!isLT&&(isDL||isDN)){ if(this.vnop(vids[7],1)){ g.fillRect(px   -lm, py+ch-lm, lw+1,1   );} }else{ this.vhide(vids[7]);}
			}
			else{
				if(!isUP&&(isUL||isLT)){ if(this.vnop(vids[4] ,1)){ g.fillRect(px   +lm, py      , 1   ,lm+1);} }else{ this.vhide(vids[4] );}
				if(!isUP&&(isUR||isRT)){ if(this.vnop(vids[5] ,1)){ g.fillRect(px+cw-lm, py      , 1   ,lm+1);} }else{ this.vhide(vids[5] );}
				if(!isDN&&(isDL||isLT)){ if(this.vnop(vids[6] ,1)){ g.fillRect(px   +lm, py+ch-lm, 1   ,lm+1);} }else{ this.vhide(vids[6] );}
				if(!isDN&&(isDR||isRT)){ if(this.vnop(vids[7] ,1)){ g.fillRect(px+cw-lm, py+ch-lm, 1   ,lm+1);} }else{ this.vhide(vids[7] );}
				if(!isLT&&(isUL||isUP)){ if(this.vnop(vids[8] ,1)){ g.fillRect(px      , py   +lm, lm+1,1   );} }else{ this.vhide(vids[8] );}
				if(!isLT&&(isDL||isDN)){ if(this.vnop(vids[9] ,1)){ g.fillRect(px      , py+ch-lm, lm+1,1   );} }else{ this.vhide(vids[9] );}
				if(!isRT&&(isUR||isUP)){ if(this.vnop(vids[10],1)){ g.fillRect(px+cw-lm, py   +lm, lm+1,1   );} }else{ this.vhide(vids[10]);}
				if(!isRT&&(isDR||isDN)){ if(this.vnop(vids[11],1)){ g.fillRect(px+cw-lm, py+ch-lm, lm+1,1   );} }else{ this.vhide(vids[11]);}
			}
		}
		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.drawLines()    �񓚂̐���Canvas�ɏ�������
	// pc.drawLine1()    �񓚂̐���Canvas�ɏ�������(1�J���̂�)
	// pc.getLineColor() �`�悷����̐F��ݒ肷��
	// pc.drawPekes()    ���E����́~��Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawLines : function(x1,y1,x2,y2){
		var idlist = this.borderinside(x1*2-2,y1*2-2,x2*2+2,y2*2+2);
		for(var i=0;i<idlist.length;i++){ this.drawLine1(idlist[i], bd.isLine(idlist[i]));}
		this.vinc();
		this.addlw = 0;
	},
	drawLine1 : function(id, flag){
		var vid = "b_line_"+id;
		if(!flag){ this.vhide(vid); return;}

		g.fillStyle = this.getLineColor(id);
		if(this.vnop(vid,1)){
			var lw = this.lw + this.addlw, lm = this.lm;
			if     (bd.border[id].cx&1){ g.fillRect(bd.border[id].px-lm, bd.border[id].py-mf(k.cheight/2)-lm, lw, k.cheight+lw);}
			else if(bd.border[id].cy&1){ g.fillRect(bd.border[id].px-mf(k.cwidth/2)-lm,  bd.border[id].py-lm, k.cwidth+lw,  lw);}
		}
	},
	getLineColor : function(id){
		this.addlw = 0;
		if     (bd.border[id].error===1){ this.addlw=1; return this.errlinecolor1;}
		else if(bd.border[id].error===2){ return this.errlinecolor2;}
		else if(k.irowake===0 || !pp.getVal('irowake') || !bd.border[id].color){ return this.linecolor;}
		return bd.border[id].color;
	},
	drawPekes : function(x1,y1,x2,y2,flag){
		var size = mf(k.cwidth*0.15); if(size<3){ size=3;}
		var headers = ["b_peke0_", "b_peke1_"];
		g.strokeStyle = this.pekecolor;
		g.lineWidth = 1;

		var idlist = this.borderinside(x1*2-2,y1*2-2,x2*2+2,y2*2+2);
		for(var i=0;i<idlist.length;i++){
			var id = idlist[i];
			if(bd.border[id].qsub!==2){ this.vhide([headers[0]+id, headers[1]+id]); continue;}

			g.fillStyle = "white";
			if(flag===0 || flag===2){
				if(this.vnop(headers[0]+id,1)){
					g.fillRect(bd.border[id].px-size, bd.border[id].py-size, 2*size+1, 2*size+1);
				}
			}
			else{ this.vhide(headers[0]+id);}

			if(flag===0 || flag===1){
				if(this.vnop(headers[1]+id,0)){
					this.inputPath([bd.border[id].px,bd.border[id].py ,-size+1,-size+1 ,0,0 ,-size+1,size ,size,-size+1 ,0,0 ,size,size ,-size+1,-size+1],false);
					g.stroke();
				}
			}
			else{ this.vhide(headers[1]+id);}
		}
		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.drawTriangle()   �O�p�`��Canvas�ɏ�������
	// pc.drawTriangle1()  �O�p�`��Canvas�ɏ�������(1�}�X�̂�)
	//---------------------------------------------------------------------------
	drawTriangle : function(x1,y1,x2,y2){
		var headers = ["c_tri2_", "c_tri3_", "c_tri4_", "c_tri5_"];

		if(!k.br.IE && k.puzzleid!=='reflect'){ x1--; y1--; x2++; y2++;}
		var clist = this.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			var num = (bd.cell[c].ques!==0?bd.cell[c].ques:bd.cell[c].qans);

			this.vhide([headers[0]+c, headers[1]+c, headers[2]+c, headers[3]+c]);
			if(num>=2 && num<=5){
				switch(k.puzzleid){
				case 'reflect':
					g.fillStyle = ((bd.cell[c].error===1||bd.cell[c].error===4) ? this.errcolor1 : this.Cellcolor);
					break;
				default:
					g.fillStyle = this.Cellcolor;
					break;
				}

				var cx=bd.cell[c].cx, cy=bd.cell[c].cy;
				this.drawTriangle1(bd.cell[c].px,bd.cell[c].py,num,headers[num-2]+c);
			}
		}
		this.vinc();
	},
	drawTriangle1 : function(px,py,num,vid){
		if(this.vnop(vid,1)){
			var mgn = (k.puzzleid==="reflect"?1:0);
			switch(num){
				case 2: this.inputPath([px,py ,mgn,mgn        ,mgn,k.cheight+1 ,k.cwidth+1,k.cheight+1],true); break;
				case 3: this.inputPath([px,py ,k.cwidth+1,mgn ,mgn,k.cheight+1 ,k.cwidth+1,k.cheight+1],true); break;
				case 4: this.inputPath([px,py ,mgn,mgn        ,k.cwidth+1,mgn  ,k.cwidth+1,k.cheight+1],true); break;
				case 5: this.inputPath([px,py ,mgn,mgn        ,k.cwidth+1,mgn  ,mgn       ,k.cheight+1],true); break;
			}
			g.fill();
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawMBs()    Cell��́�,�~��Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawMBs : function(x1,y1,x2,y2){
		g.strokeStyle = this.MBcolor;
		g.lineWidth = 1;

		var rsize = k.cwidth*0.35;
		var headers = ["c_MB1_", "c_MB2a_"];

		var clist = this.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.cell[c].qsub===0){ this.vhide([headers[0]+c, headers[1]+c]); continue;}

			switch(bd.cell[c].qsub){
			case 1:
				if(this.vnop(headers[0]+c,0)){
					g.beginPath();
					g.arc(bd.cell[c].px+mf(k.cwidth/2), bd.cell[c].py+mf(k.cheight/2), rsize, 0, Math.PI*2, false);
					g.stroke();
				}
				this.vhide(headers[1]+c);
				break;
			case 2:
				if(this.vnop(headers[1]+c,0)){
					this.inputPath([bd.cell[c].px+mf(k.cwidth/2),bd.cell[c].py+mf(k.cheight/2) ,-rsize,-rsize ,0,0 ,-rsize,rsize ,rsize,-rsize ,0,0 ,rsize,rsize ,-rsize,-rsize],true);
					g.stroke();
				}
				this.vhide(headers[0]+c);
				break;
			}
		}
		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.drawQueses41_42()    Cell��̍��ۂƔ��ۂ�Canvas�ɏ�������
	// pc.drawCircledNumbers() Cell��̊ې�������������
	//---------------------------------------------------------------------------
	drawQueses41_42 : function(x1,y1,x2,y2){
		var rsize  = mf(k.cwidth*this.circleratio[0]);
		var rsize2 = mf(k.cwidth*this.circleratio[1]);
		var mgnx = mf(k.cwidth/2), mgny = mf(k.cheight/2);
		var headers = ["c_cir41a_", "c_cir41b_"];

		var clist = this.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i], px = bd.cell[c].px+mgnx, py = bd.cell[c].py+mgny;

			if(bd.cell[c].ques===41 || bd.cell[c].ques===42){
				g.fillStyle = (bd.cell[c].error===1 ? this.errcolor1 : this.Cellcolor);
				if(this.vnop(headers[0]+c,1)){
					g.beginPath();
					g.arc(px, py, rsize , 0, Math.PI*2, false);
					g.fill();
				}
			}
			else{ this.vhide(headers[0]+c);}

			if(bd.cell[c].ques===41){
				g.fillStyle = (bd.cell[c].error===1 ? this.errbcolor1 : "white");
				if(this.vnop(headers[1]+c,1)){
					g.beginPath();
					g.arc(px, py, rsize2, 0, Math.PI*2, false);
					g.fill();
				}
			}
			else{ this.vhide(headers[1]+c);}
		}
		this.vinc();
	},
	drawCircledNumbers : function(x1,y1,x2,y2){
		var rsize  = k.cwidth*this.circleratio[0];
		var rsize2 = k.cwidth*this.circleratio[1];
		var mgnx = mf(k.cwidth/2), mgny = mf(k.cheight/2);
		var headers = ["c_cira_", "c_cirb_"];

		g.lineWidth = k.cwidth*0.05;
		var clist = this.cellinside(x1-2,y1-2,x2+2,y2+2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.cell[c].qnum!=-1){
				var px=bd.cell[c].px+mgnx, py=bd.cell[c].py+mgny;

				g.fillStyle = (bd.cell[c].error===1 ? this.errbcolor1 : this.circledcolor);
				if(this.vnop(headers[1]+c,1)){
					g.beginPath();
					g.arc(px, py, rsize2, 0, Math.PI*2, false);
					g.fill();
				}

				g.strokeStyle = (bd.cell[c].error===1 ? this.errcolor1 : this.Cellcolor);
				if(this.vnop(headers[0]+c,0)){
					g.beginPath();
					g.arc(px, py, rsize , 0, Math.PI*2, false);
					g.stroke();
				}
			}
			else{ this.vhide([headers[0]+c, headers[1]+c]);}

			this.dispnumCell(c);
		}
		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.drawLineParts()   ���Ȃǂ�Canvas�ɏ�������
	// pc.drawLineParts1()  ���Ȃǂ�Canvas�ɏ�������(1�}�X�̂�)
	//---------------------------------------------------------------------------
	drawLineParts : function(x1,y1,x2,y2){
		var clist = this.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){ this.drawLineParts1(clist[i]);}
		this.vinc();
	},
	drawLineParts1 : function(id){
		var vids = ["c_lp1_"+id, "c_lp2_"+id, "c_lp3_"+id, "c_lp4_"+id];
		if(qs<101 || qs>107){ this.vhide(vids); return;}

		var hh = mf(k.cheight/2), hw = mf(k.cwidth/2);
		var hhp = mf((this.lw+k.cheight)/2), hwp = mf((this.lw+k.cwidth)/2);
		var px = bd.cell[id].px, py = bd.cell[id].py;
		g.fillStyle = this.BorderQuescolor;

		var qs = bd.cell[id].ques, flag  = {101:15, 102:3, 103:12, 104:9, 105:5, 106:6, 107:10}[qs];
		if(flag&1){ if(this.vnop(vids[0],1)){ g.fillRect(px+hw-1, py     , this.lw, hhp);} }else{ this.vhide(vids[0]);}
		if(flag&2){ if(this.vnop(vids[1],1)){ g.fillRect(px+hw-1, py+hh-1, this.lw, hhp);} }else{ this.vhide(vids[1]);}
		if(flag&4){ if(this.vnop(vids[2],1)){ g.fillRect(px     , py+hh-1, hwp, this.lw);} }else{ this.vhide(vids[2]);}
		if(flag&8){ if(this.vnop(vids[3],1)){ g.fillRect(px+hw-1, py+hh-1, hwp, this.lw);} }else{ this.vhide(vids[3]);}
	},

	//---------------------------------------------------------------------------
	// pc.draw51()          [�_]��Canvas�ɏ�������
	// pc.draw51EXcell()    EXCell���[�_]��Canvas�ɏ�������
	// pc.drawChassis_ex1() k.isextencdell==1�ő�����O�g��Canvas�ɕ`�悷��
	//---------------------------------------------------------------------------
	draw51 : function(x1,y1,x2,y2,errdisp){
		var headers = ["c_full_", "c_q51_"];

		var clist = this.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.cell[c].ques===51){
				if(errdisp){
					if(bd.cell[c].error===1){
						g.fillStyle = this.errbcolor1;
						if(this.vnop(headers[0]+c,1)){
							g.fillRect(bd.cell[c].px+1, bd.cell[c].py+1, k.cwidth-1, k.cheight-1);
						}
					}
					else{ this.vhide(headers[0]+c);}
				}
				g.strokeStyle = this.Cellcolor;
				if(this.vnop(headers[1]+c,0)){
					g.lineWidth = 1;
					this.inputPath([bd.cell[c].px,bd.cell[c].py, 1,1, k.cwidth,k.cheight], true);
					g.stroke();
				}
			}
			else{
				if(bd.cell[c].qsub===0 && bd.cell[c].error===0){ this.vhide(headers[0]+c);}
				this.vhide(headers[1]+c);
			}
		}
		this.vinc();
	},
	draw51EXcells : function(x1,y1,x2,y2,errdisp){
		var lw = this.lw;
		var headers = ["ex_full_", "ex_q51_", "ex_bdx_", "ex_bdy_"];

		var exlist = this.excellinside(x1-1,y1-1,x2,y2);
		for(var i=0;i<exlist.length;i++){
			var c = exlist[i];

			var px = bd.excell[c].px, py = bd.excell[c].py;
			if(errdisp){
				if(bd.excell[c].error===1){
					g.fillStyle = this.errbcolor1;
					if(this.vnop(headers[0]+c,1)){
						g.fillRect(px+1, py+1, k.cwidth-1, k.cheight-1);
					}
				}
				else{ this.vhide(headers[0]+c);}
			}

			g.strokeStyle = this.Cellcolor;
			if(this.vnop(headers[1]+c,0)){
				g.lineWidth = 1;
				this.inputPath([px,py, 1,1, k.cwidth,k.cheight], true);
				g.stroke();
			}

			g.fillStyle = this.Cellcolor;
			if(bd.excell[c].cy===-1 && bd.excell[c].cx<k.qcols-1){
				if(this.vnop(headers[2]+c,1)){
					g.fillRect(px+k.cwidth, py, 1, k.cheight);
				}
			}
			else{ this.vhide(headers[2]+c);}
			if(bd.excell[c].cx===-1 && bd.excell[c].cy<k.qrows-1){
				if(this.vnop(headers[3]+c,1)){
					g.fillRect(px, py+k.cheight, k.cwidth, 1);
				}
			}
			else{ this.vhide(headers[3]+c);}
		}
		this.vinc();
	},

	drawChassis_ex1 : function(x1,y1,x2,y2,boldflag){
		var lw = this.lw, lm = this.lm;

		if(x1<0){ x1=0;} if(x2>k.qcols-1){ x2=k.qcols-1;}
		if(y1<0){ y1=0;} if(y2>k.qrows-1){ y2=k.qrows-1;}

		g.fillStyle = "black";
		if(boldflag){
			if(x1<1){ if(this.vnop("chs1_",1)){ g.fillRect(k.p0.x+x1*k.cwidth-lw+2, k.p0.y+y1*k.cheight-lw+2, lw, (y2-y1+1)*k.cheight+lw-2);} }
			if(y1<1){ if(this.vnop("chs2_",1)){ g.fillRect(k.p0.x+x1*k.cwidth-lw+2, k.p0.y+y1*k.cheight-lw+2, (x2-x1+1)*k.cwidth+lw-2, lw); } }
		}
		else{
			if(x1<1){ if(this.vnop("chs1_",1)){ g.fillRect(k.p0.x+x1*k.cwidth, k.p0.y+y1*k.cheight, 1, (y2-y1+1)*k.cheight);} }
			if(y1<1){ if(this.vnop("chs2_",1)){ g.fillRect(k.p0.x+x1*k.cwidth, k.p0.y+y1*k.cheight, (x2-x1+1)*k.cwidth, 1); } }
		}
		if(y2>=k.qrows-1){ if(this.vnop("chs3_",1)){ g.fillRect(k.p0.x+(x1-1)*k.cwidth-lw+1, k.p0.y+(y2+1)*k.cheight , (x2-x1+2)*k.cwidth+2*lw-1, lw); } }
		if(x2>=k.qcols-1){ if(this.vnop("chs4_",1)){ g.fillRect(k.p0.x+(x2+1)*k.cwidth , k.p0.y+(y1-1)*k.cheight-lw+1, lw, (y2-y1+2)*k.cheight+2*lw-1);} }
		if(x1<1)         { if(this.vnop("chs21_",1)){ g.fillRect(k.p0.x+(x1-1)*k.cwidth-lw+1, k.p0.y+(y1-1)*k.cheight-lw+1, lw, (y2-y1+2)*k.cheight+2*lw-1);} }
		if(y1<1)         { if(this.vnop("chs22_",1)){ g.fillRect(k.p0.x+(x1-1)*k.cwidth-lw+1, k.p0.y+(y1-1)*k.cheight-lw+1, (x2-x1+2)*k.cwidth+2*lw-1, lw); } }
		this.vinc();

		if(!boldflag){
			g.fillStyle = this.Cellcolor;
			var clist = this.cellinside(x1-1,y1-1,x2+1,y2+1);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.cell[c].ques===51){ continue;}
				if(bd.cell[c].cx===0){ this.drawBorder1x(0, 2*bd.cell[c].cy+1, true);}
				if(bd.cell[c].cy===0){ this.drawBorder1x(2*bd.cell[c].cx+1, 0, true);}
			}
			this.vinc();
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawTarget()  ���͑ΏۂƂȂ�ꏊ��`�悷��
	// pc.drawTCell()   Cell�̃L�[�{�[�h����̓��͑Ώۂ�Canvas�ɏ�������
	// pc.drawTCross()  Cross�̃L�[�{�[�h����̓��͑Ώۂ�Canvas�ɏ�������
	// pc.drawTBorder() Border�̃L�[�{�[�h����̓��͑Ώۂ�Canvas�ɏ�������
	// pc.hideTCell()   �L�[�{�[�h����̓��͑Ώۂ��B��
	// pc.hideTCross()  �L�[�{�[�h����̓��͑Ώۂ��B��
	// pc.hideTBorder() �L�[�{�[�h����̓��͑Ώۂ��B��
	// pc.drawTargetTriangle() [�_]�̂������͑Ώۂ̂ق��ɔw�i�F������
	//---------------------------------------------------------------------------
	drawTarget : function(x1,y1,x2,y2){
		if(k.editmode){ this.drawTCell(x1,y1,x2+1,y2+1);}
		else{ this.hideTCell();}
	},

	drawTCell : function(x1,y1,x2,y2){
		if(tc.cursolx < x1*2-2 || x2*2+4 < tc.cursolx){ return;}
		if(tc.cursoly < y1*2-2 || y2*2+4 < tc.cursoly){ return;}

		var px = k.p0.x + mf((tc.cursolx-1)*k.cwidth/2);
		var py = k.p0.y + mf((tc.cursoly-1)*k.cheight/2);
		var w = (k.cwidth<32?2:mf(k.cwidth/16));

		this.vdel(["tc1_","tc2_","tc3_","tc4_"]);
		g.fillStyle = (k.editmode?this.targetColor1:this.targetColor3);
		if(this.vnop("tc1_",0)){ g.fillRect(px+1,           py+1, k.cwidth-2,  w);}
		if(this.vnop("tc2_",0)){ g.fillRect(px+1,           py+1, w, k.cheight-2);}
		if(this.vnop("tc3_",0)){ g.fillRect(px+1, py+k.cheight-w, k.cwidth-2,  w);}
		if(this.vnop("tc4_",0)){ g.fillRect(px+k.cwidth-w,  py+1, w, k.cheight-2);}

		this.vinc();
	},
	drawTCross : function(x1,y1,x2,y2){
		if(tc.cursolx < x1*2-1 || x2*2+3 < tc.cursolx){ return;}
		if(tc.cursoly < y1*2-1 || y2*2+3 < tc.cursoly){ return;}

		var px = k.p0.x + mf((tc.cursolx-1)*k.cwidth/2);
		var py = k.p0.y + mf((tc.cursoly-1)*k.cheight/2);
		var w = (k.cwidth<32?2:mf(k.cwidth/16));

		this.vdel(["tx1_","tx2_","tx3_","tx4_"]);
		g.fillStyle = (k.editmode?this.targetColor1:this.targetColor3);
		if(this.vnop("tx1_",0)){ g.fillRect(px+1,           py+1, k.cwidth-2,  w);}
		if(this.vnop("tx2_",0)){ g.fillRect(px+1,           py+1, w, k.cheight-2);}
		if(this.vnop("tx3_",0)){ g.fillRect(px+1, py+k.cheight-w, k.cwidth-2,  w);}
		if(this.vnop("tx4_",0)){ g.fillRect(px+k.cwidth-w,  py+1, w, k.cheight-2);}

		this.vinc();
	},
	drawTBorder : function(x1,y1,x2,y2){
		if(tc.cursolx < x1*2-1 || x2*2+3 < tc.cursolx){ return;}
		if(tc.cursoly < y1*2-1 || y2*2+3 < tc.cursoly){ return;}

		var px = k.p0.x + mf(tc.cursolx*k.cwidth/2);
		var py = k.p0.y + mf(tc.cursoly*k.cheight/2);
		var w = (k.cwidth<24?1:mf(k.cwidth/24));
		var size = mf(k.cwidth*0.28);

		this.vdel(["tb1_","tb2_","tb3_","tb4_"]);
		g.fillStyle = (k.editmode?this.targetColor1:this.targetColor3);
		if(this.vnop("tb1_",0)){ g.fillRect(px-size  , py-size  , size*2, 1);}
		if(this.vnop("tb2_",0)){ g.fillRect(px-size  , py-size  , 1, size*2);}
		if(this.vnop("tb3_",0)){ g.fillRect(px-size  , py+size-w, size*2, 1);}
		if(this.vnop("tb4_",0)){ g.fillRect(px+size-w, py-size  , 1, size*2);}

		this.vinc();
	},
	hideTCell   : function(){ this.vhide(["tc1_","tc2_","tc3_","tc4_"]);},
	hideTCross  : function(){ this.vhide(["tx1_","tx2_","tx3_","tx4_"]);},
	hideTBorder : function(){ this.vhide(["tb1_","tb2_","tb3_","tb4_"]);},

	drawTargetTriangle : function(x1,y1,x2,y2){
		var vid = "target_triangle";
		this.vdel([vid]);

		if(k.playmode){ return;}

		if(tc.cursolx < x1*2 || x2*2+2 < tc.cursolx){ return;}
		if(tc.cursoly < y1*2 || y2*2+2 < tc.cursoly){ return;}

		var cc = tc.getTCC(), ex = -1;
		if(cc===-1){ ex = bd.exnum(tc.getTCX(),tc.getTCY());}
		var target = kc.detectTarget(cc,ex);
		if(target===-1){ return;}

		g.fillStyle = this.TTcolor;
		this.drawTriangle1(k.p0.x+tc.getTCX()*k.cwidth, k.p0.y+tc.getTCY()*k.cheight, (target===2?4:2), vid);

		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.drawDashLines()    �Z���̒��S���璆�S�ɂЂ����_����Canvas�ɕ`�悷��
	//---------------------------------------------------------------------------
	drawDashLines : (
		((!k.br.IE) ?
			function(x1,y1,x2,y2){
				if(x1<1){ x1=1;} if(x2>k.qcols-2){ x2=k.qcols-2;}
				if(y1<1){ y1=1;} if(y2>k.qrows-2){ y2=k.qrows-2;}

				g.fillStyle = this.gridcolor;
				for(var i=x1-1;i<=x2+1;i++){
					for(var j=(k.p0.y+(y1-0.5)*k.cheight);j<(k.p0.y+(y2+1.5)*k.cheight);j+=6){
						g.fillRect(k.p0.x+(i+0.5)*k.cwidth, j, 1, 3);
					}
				}
				for(var i=y1-1;i<=y2+1;i++){
					for(var j=(k.p0.x+(x1-0.5)*k.cwidth);j<(k.p0.x+(x2+1.5)*k.cwidth);j+=6){
						g.fillRect(j, k.p0.y+(i+0.5)*k.cheight, 3, 1);
					}
				}

				this.vinc();
			}
		:
			function(x1,y1,x2,y2){
				if(x1<1){ x1=1;} if(x2>k.qcols-2){ x2=k.qcols-2;}
				if(y1<1){ y1=1;} if(y2>k.qrows-2){ y2=k.qrows-2;}

/*				g.fillStyle = this.gridcolor;
				g.lineWidth = 1;
				g.enabledash = true;
				for(var i=x1-1;i<=x2+1;i++){ if(this.vnop("bdy"+i+"_",1)){
					g.beginPath()
					g.moveTo(k.p0.x+(i+0.5)*k.cwidth, k.p0.y+(y1-0.5)*k.cheight);
					g.lineTo(k.p0.x+(i+0.5)*k.cwidth, k.p0.y+(y2+1.5)*k.cheight);
					g.closePath()
					g.stroke()
				} }
				for(var i=y1-1;i<=y2+1;i++){ if(this.vnop("bdx"+i+"_",1)){
					g.beginPath()
					g.moveTo(k.p0.x+(x1-0.5)*k.cwidth, k.p0.y+( i+0.5)*k.cheight);
					g.lineTo(k.p0.x+(x2+1.5)*k.cwidth, k.p0.y+( i+0.5)*k.cheight);
					g.closePath()
					g.stroke()
				} }
				g.enabledash = false;

				g.fillStyle = "white";
*/
				g.fillStyle = this.gridcolor_SLIGHT;
				for(var i=x1-1;i<=x2+1;i++){ if(this.vnop("cliney_"+i,1)){ g.fillRect(k.p0.x+(i+0.5)*k.cwidth, k.p0.y+(y1-0.5)*k.cheight, 1, (y2-y1+2)*k.cheight+1);} }
				for(var i=y1-1;i<=y2+1;i++){ if(this.vnop("clinex_"+i,1)){ g.fillRect(k.p0.x+(x1-0.5)*k.cwidth, k.p0.y+(i+0.5)*k.cheight, (x2-x1+2)*k.cwidth+1, 1);} }

				this.vinc();
			}
		)
	),

	//---------------------------------------------------------------------------
	// pc.drawGrid()        �Z���̘g��(����)��Canvas�ɏ�������
	// pc.drawDashedGrid()  �Z���̘g��(�_��)��Canvas�ɏ�������
	// pc.drawChassis()     �O�g��Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawGrid : function(x1,y1,x2,y2){
		if(x1<0){ x1=0;} if(x2>k.qcols-1){ x2=k.qcols-1;}
		if(y1<0){ y1=0;} if(y2>k.qrows-1){ y2=k.qrows-1;}

		var bs=((k.isoutsideborder===0&&this.chassisflag)?1:0);

		g.fillStyle = this.gridcolor;
		var xa = (x1>bs?x1:bs), xb = (x2+1<k.qcols-bs?x2+1:k.qcols-bs);
		var ya = (y1>bs?y1:bs), yb = (y2+1<k.qrows-bs?y2+1:k.qrows-bs);
		for(var i=xa;i<=xb;i++){ if(this.vnop("bdy_"+i,1)){ g.fillRect(k.p0.x+i*k.cwidth, k.p0.y+y1*k.cheight, 1, (y2-y1+1)*k.cheight+1);} }
		for(var i=ya;i<=yb;i++){ if(this.vnop("bdx_"+i,1)){ g.fillRect(k.p0.x+x1*k.cwidth, k.p0.y+i*k.cheight, (x2-x1+1)*k.cwidth+1, 1);} }

		this.vinc();
	},
	drawDashedGrid : (
		((!k.br.IE) ?
			function(x1,y1,x2,y2){
				if(x1<0){ x1=0;} if(x2>k.qcols-1){ x2=k.qcols-1;}
				if(y1<0){ y1=0;} if(y2>k.qrows-1){ y2=k.qrows-1;}

				var bs=((k.isoutsideborder===0&&this.chassisflag)?1:0);

				var dotmax = mf(k.cwidth/10)+3;
				var dotCount = (mf(k.cwidth/dotmax)>=1?mf(k.cwidth/dotmax):1);
				var dotSize  = k.cwidth/(dotCount*2);

				g.fillStyle = this.gridcolor;
				var xa = (x1>bs?x1:bs), xb = (x2+1<k.qcols-bs?x2+1:k.qcols-bs);
				var ya = (y1>bs?y1:bs), yb = (y2+1<k.qrows-bs?y2+1:k.qrows-bs);
				for(var i=xa;i<=xb;i++){
					for(var j=(k.p0.y+y1*k.cheight);j<(k.p0.y+(y2+1)*k.cheight);j+=(2*dotSize)){
						g.fillRect(k.p0.x+i*k.cwidth, mf(j), 1, mf(dotSize));
					}
				}
				for(var i=ya;i<=yb;i++){
					for(var j=(k.p0.x+x1*k.cwidth);j<(k.p0.x+(x2+1)*k.cwidth);j+=(2*dotSize)){
						g.fillRect(mf(j), k.p0.y+i*k.cheight, mf(dotSize), 1);
					}
				}
			}
		:
			function(x1,y1,x2,y2){
				this.gridcolor = this.gridcolor_SLIGHT;
				this.drawGrid(x1,y1,x2,y2);

/*				if(x1<0){ x1=0;} if(x2>k.qcols-1){ x2=k.qcols-1;}
				if(y1<0){ y1=0;} if(y2>k.qrows-1){ y2=k.qrows-1;}

				var bs=((k.isoutsideborder==0&&this.chassisflag)?1:0);

				g.fillStyle = this.gridcolor;
				var xa = (x1>bs?x1:bs), xb = (x2+1<k.qcols-bs?x2+1:k.qcols-bs);
				var ya = (y1>bs?y1:bs), yb = (y2+1<k.qrows-bs?y2+1:k.qrows-bs);
				g.lineWidth = 1;
				g.enabledash = true;
				for(var i=xa;i<=xb;i++){ if(this.vnop("bdy"+i+"_",0)){
					g.beginPath()
					g.moveTo(mf(k.p0.x+i*k.cwidth+0.0), mf(k.p0.y+ y1   *k.cheight));
					g.lineTo(mf(k.p0.x+i*k.cwidth+0.0), mf(k.p0.y+(y2+1)*k.cheight));
					g.closePath()
					g.stroke()
				} }
				for(var i=ya;i<=yb;i++){ if(this.vnop("bdx"+i+"_",0)){
					g.beginPath()
					g.moveTo(mf(k.p0.x+ x1   *k.cwidth), mf(k.p0.y+i*k.cheight));
					g.lineTo(mf(k.p0.x+(x2+1)*k.cwidth), mf(k.p0.y+i*k.cheight));
					g.closePath()
					g.stroke()
				} }
				g.enabledash = false;

				g.fillStyle = "white";
				for(var i=xa;i<=xb;i++){ if(this.vnop("bdy"+i+"_1_",1)){ g.fillRect(k.p0.x+i*k.cwidth, k.p0.y+y1*k.cheight, 1, (y2-y1+1)*k.cheight+1);} }
				for(var i=ya;i<=yb;i++){ if(this.vnop("bdx"+i+"_1_",1)){ g.fillRect(k.p0.x+x1*k.cwidth, k.p0.y+i*k.cheight, (x2-x1+1)*k.cwidth+1, 1);} }

				this.vinc();
*/			}
		)
	),

	drawChassis : function(x1,y1,x2,y2){
		var lw = this.lw;

		if(x1<0){ x1=0;} if(x2>k.qcols-1){ x2=k.qcols-1;}
		if(y1<0){ y1=0;} if(y2>k.qrows-1){ y2=k.qrows-1;}

		g.fillStyle = "black";
		if(x1<1)         { if(this.vnop("chs1_",1)){ g.fillRect(k.p0.x+x1*k.cwidth-lw+1, k.p0.y+y1*k.cheight-lw+1, lw, (y2-y1+1)*k.cheight+2*lw-1);} }
		if(y1<1)         { if(this.vnop("chs2_",1)){ g.fillRect(k.p0.x+x1*k.cwidth-lw+1, k.p0.y+y1*k.cheight-lw+1, (x2-x1+1)*k.cwidth+2*lw-1, lw); } }
		if(y2>=k.qrows-1){ if(this.vnop("chs3_",1)){ g.fillRect(k.p0.x+x1*k.cwidth-lw+1, k.p0.y+(y2+1)*k.cheight , (x2-x1+1)*k.cwidth+2*lw-1, lw); } }
		if(x2>=k.qcols-1){ if(this.vnop("chs4_",1)){ g.fillRect(k.p0.x+(x2+1)*k.cwidth , k.p0.y+y1*k.cheight-lw+1, lw, (y2-y1+1)*k.cheight+2*lw-1);} }
		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.flushCanvas()    �w�肳�ꂽ�̈�𔒂œh��Ԃ�
	// pc.flushCanvasAll() Canvas�S�ʂ𔒂œh��Ԃ�
	//---------------------------------------------------------------------------
	flushCanvas : (
		((!k.vml) ?
			function(x1,y1,x2,y2){
				if     (k.isextendcell===0 && x1<= 0 && y1<= 0 && x2>=k.qcols-1 && y2>=k.qrows-1){ this.flushCanvasAll();}
				else if(k.isextendcell===1 && x1<=-1 && y1<=-1 && x2>=k.qcols-1 && y2>=k.qrows-1){ this.flushCanvasAll();}
				else if(k.isextendcell===2 && x1<=-1 && y1<=-1 && x2>=k.qcols   && y2>=k.qrows  ){ this.flushCanvasAll();}
				else{
					g.fillStyle = "rgb(255, 255, 255)";
					g.fillRect(k.p0.x+x1*k.cwidth, k.p0.y+y1*k.cheight, (x2-x1+1)*k.cwidth, (y2-y1+1)*k.cheight);
				}
			}
		:
			function(x1,y1,x2,y2){ g.zidx=1;}
		)
	),
	// excanvas�̏ꍇ�A�����`�悵�Ȃ���VML�v�f���I������Ă��܂�
	flushCanvasAll : (
		((!k.vml) ?
			((!k.br.IE) ?
				function(){
					g.fillStyle = "rgb(255, 255, 255)";
					g.fillRect(0, 0, ee(base.canvas).getWidth(), ee(base.canvas).getHeight());
					this.vinc();
				}
			:
				function(){
					g._clear();	// uuCanvas�p���ꏈ��
					g.fillStyle = "rgb(255, 255, 255)";
					g.fillRect(0, 0, ee(base.canvas).getWidth(), ee(base.canvas).getHeight());
					this.vinc();
				}
			)
		:
			function(){
				g.zidx=0; g.vid="bg_"; g.pelements = []; g.elements = [];	// VML�p
				g._clear();													// uuCanvas�p���ꏈ��
				g.fillStyle = "rgb(255, 255, 255)";
				g.fillRect(0, 0, ee(base.canvas).getWidth(), ee(base.canvas).getHeight());
				this.vinc();
			}
		)
	),

	//---------------------------------------------------------------------------
	// pc.vnop()  VML�Ŋ��ɕ`�悳��Ă���I�u�W�F�N�g���ĕ`�悹���A�F�͐ݒ肷��
	// pc.vhide() VML�Ŋ��ɕ`�悳��Ă���I�u�W�F�N�g���B��
	// pc.vdel()  VML�Ŋ��ɕ`�悳��Ă���I�u�W�F�N�g���폜����
	// pc.vinc()  z-index�ɐݒ肳���l��+1����
	//  ��IE�ȊO�ł�f_true�ɂȂ��Ă��܂��B
	//---------------------------------------------------------------------------
	// excanvas�֌W�֐�
	vnop : (!k.vml ? f_true : function(vid, isfill){
		if(g.elements[vid]){
			var el = g.elements[vid];
			el.color = uuColor.parse(isfill===1?g.fillStyle:g.strokeStyle)[0];

			var pel = g.pelements[vid];
			if(!this.zstable){ pel.style.zIndex = g.zidx;}
			pel.style.display = 'inline';
			return false;
		}
		g.vid = vid;
		return true;
	}),
	vhide : (!k.vml ? f_true : function(vid){
		if(typeof vid === 'string'){ vid = [vid];}
		for(var i=0;i<vid.length;i++){
			if(g.elements[vid[i]]){
				g.pelements[vid[i]].style.display = 'none';
			}
		}
	}),
	vdel : (!k.vml ? f_true : function(vid){
		for(var i=0;i<vid.length;i++){
			if(g.elements[vid[i]]){
				g._elm.removeChild(g.pelements[vid[i]]);	// uuCanvas��g._elm��parentNode��ێ����Ă�
				g.pelements[vid[i]]=null;
				g.elements[vid[i]] =null;
			}
		}
	}),
	vinc : (!k.vml ? f_true : function(){
		g.vid = ""; g.zidx++;
	}),

	//---------------------------------------------------------------------------
	// pc.CreateDOMAndSetNop()  �����\���p�̃G�������g��Ԃ�
	// pc.showEL()              �G�������g��\������
	// pc.hideEL()              �G�������g���B��
	// pc.isdispnumCell()       �������L���ł��邩���肷��
	// pc.getNumberColor()      �����̐F�𔻒肷��
	//---------------------------------------------------------------------------
	// �����\���֐�
	CreateDOMAndSetNop : function(){
		return (!pc.textenable ? ee.createEL(pc.EL_NUMOBJ,'') : null);
	},

	showEL : function(el){ el.style.display = 'inline'; },	// �������Ȃ��Ă��悳�����B
	hideEL : function(el){ if(!!el){ el.style.display = 'none';} },

	setFunctions : function(){
		this.isdispnumCell = (
			((!!k.isDispHatena) ?
				(!!k.dispzero) ? function(id){ var num=bd.getNum(id); return (num>=0 || num===-2);}
							   : function(id){ var num=bd.getNum(id); return (num> 0 || num===-2);}
			:
				(!!k.dispzero) ? function(id){ var num=bd.getNum(id); return (num>=0);}
							   : function(id){ var num=bd.getNum(id); return (num> 0);}
			)
		);
		this.getNumberColor = (
			((!!k.isAnsNumber) ?
				function(id){
					if(bd.cell[id].error===1 || bd.cell[id].error===4){ return this.fontErrcolor;}
					return (bd.cell[id].qnum!==-1 ? this.fontcolor : this.fontAnscolor);
				}
			:(!!k.BlackCell) ?
				function(id){
					if(bd.cell[id].qans===1){ return this.BCell_fontcolor;}
					else if(bd.cell[id].error===1 || bd.cell[id].error===4){ return this.fontErrcolor;}
					return this.fontcolor;
				}
			:
				function(id){
					if(bd.cell[id].ques!==0){ return this.BCell_fontcolor;}
					else if(bd.cell[id].error===1 || bd.cell[id].error===4){ return this.fontErrcolor;}
					return this.fontcolor;
				}
			)
		);
	},
	isdispnumCell  : f_true,
	getNumberColor : function(){ return this.fontcolor;},

	//---------------------------------------------------------------------------
	// pc.dispnumCell()   Cell�ɐ������L�����邽�߂̒l�����肷��
	// pc.dispnumCross()  Cross�ɐ������L�����邽�߂̒l�����肷��
	// pc.dispnumBorder() Border�ɐ������L�����邽�߂̒l�����肷��
	//---------------------------------------------------------------------------
	dispnumCell : function(id){
		var obj = bd.cell[id];
		if(!this.isdispnumCell(id)){ this.hideEL(obj.numobj); return;}
		if(!obj.numobj){ obj.numobj = this.CreateDOMAndSetNop();}

		var type = (!k.isDispNumUL ? 1 : 5);
		if(obj.ques>=2 && obj.ques<=5){ type=obj.ques;}

		var num = bd.getNum(id);
		var text = (num>=0 ? ""+num : "?");

		var fontratio = 0.45;
		if(type===1){ fontratio = (num<10?0.8:(num<100?0.7:0.55));}

		var color = this.getNumberColor(id);

		this.dispnum(obj.numobj, type, text, fontratio, color, obj.px, obj.py);
	},
	dispnumCross : function(id){
		var obj = bd.cross[id];
		if(obj.qnum<0||(obj.qnum===0&&k.dispzero===0)){ this.hideEL(obj.numobj); return;}
		if(!obj.numobj){ obj.numobj = this.CreateDOMAndSetNop();}

		var text  = ""+obj.qnum;
		var color = this.fontcolor;

		this.dispnum(obj.numobj, 101, text, 0.6, color, obj.px, obj.py);
	},
	dispnumBorder : function(id){
		var obj = bd.border[id];
		if(obj.qnum<0||(obj.qnum===0&&k.dispzero===0)){ this.hideEL(obj.numobj); return;}
		if(!obj.numobj){ obj.numobj = this.CreateDOMAndSetNop();}

		var text  = ""+obj.qnum;
		var color = this.borderfontcolor;

		this.dispnum(obj.numobj, 101, text, 0.45, color, obj.px, obj.py);
	},

	//---------------------------------------------------------------------------
	// pc.dispnum()  �������L�����邽�߂̋��ʊ֐�
	//---------------------------------------------------------------------------
	dispnum : function(el, type, text, fontratio, color, px, py){
//		if(!this.textenable){
			if(!el){ return;}
			var IE = k.br.IE;

			el.innerHTML = text;

			var fontsize = mf(k.cwidth*fontratio*this.fontsizeratio);
			el.style.fontSize = (""+ fontsize + 'px');

			this.showEL(el);	// ��ɕ\�����Ȃ���wid,hgt=0�ɂȂ��Ĉʒu�������

			var wid = el.clientWidth;
			var hgt = el.clientHeight;

			if(type===1||type===6||type===7){
				el.style.left = k.cv_oft.x+px+mf((k.cwidth-wid) /2)+(IE?3:2)-(type===6?mf(k.cwidth *0.1):0);
				el.style.top  = k.cv_oft.y+py+mf((k.cheight-hgt)/2)+(IE?3:1)+(type===7?mf(k.cheight*0.1):0);
			}
			else if(type===101){
				el.style.left = k.cv_oft.x+px-wid/2+(IE?4:2);
				el.style.top  = k.cv_oft.y+py-hgt/2+(IE?2:1);
			}
			else{
				if(type==52||type==54){ px--; type-=50;}	// excell��[�_]�Ή�..
				if     (type===3||type===4){ el.style.left = k.cv_oft.x+px+k.cwidth -wid+(IE?1: 0);}
				else if(type===2||type===5){ el.style.left = k.cv_oft.x+px              +(IE?5: 4);}
				if     (type===2||type===3){ el.style.top  = k.cv_oft.y+py+k.cheight-hgt+(IE?2:-1);}
				else if(type===4||type===5){ el.style.top  = k.cv_oft.y+py              +(IE?4: 2);}
			}

			el.style.color = color;
//		}
//		// Native�ȕ��@�͂������Ȃ񂾂��ǁA�v5�`6%���炢�x���Ȃ�B�B
//		else{
//			g.font = ""+mf(k.cwidth*fontratio*this.fontsizeratio)+"px 'Serif'";
//			g.fillStyle = color;
//			if(type==1||type==6||type==7){
//				g.textAlign = 'center'; g.textBaseline = 'middle';
//				g.fillText(text, px+mf(k.cwidth/2)-(type==6?mf(k.cwidth*0.1):0), py+mf(k.cheight/2)+(type==7?mf(k.cheight*0.1):0));
//			}
//			else if(type==101){
//				g.textAlign = 'center'; g.textBaseline = 'middle';
//				g.fillText(text, px, py);
//			}
//			else{
//				g.textAlign    = ((type==3||type==4)?'right':'left');
//				g.textBaseline = ((type==2||type==3)?'alphabetic':'top');
//				g.fillText(text, px+((type==3||type==4)?k.cwidth:3), py+((type==2||type==3)?k.cheight-1:0));
//			}
//		}
	},

	//---------------------------------------------------------------------------
	// pc.drawNumbersOn51()   [�_]�ɐ������L������
	// pc.drawNumbersOn51_1() 1��[�_]�ɐ������L������
	//---------------------------------------------------------------------------
	drawNumbersOn51 : function(x1,y1,x2,y2){
		for(var cx=x1;cx<=x2;cx++){ for(var cy=y1;cy<=y2;cy++){
			var c = bd.cnum(cx,cy);
			// cell�ゾ�����ꍇ
			if(c!==-1){
				if(bd.cell[c].ques===51){
					this.drawNumbersOn51_1(bd.cell[c], bd.rt(c), bd.dn(c), 0)
				}
				else{
					this.hideEL(bd.cell[c].numobj);
					this.hideEL(bd.cell[c].numobj2);
				}
			}
			else{
				c = bd.exnum(cx,cy);
				// excell�ゾ�����ꍇ
				if(c!==-1){
					this.drawNumbersOn51_1(bd.excell[c], bd.excell[c].cy*k.qcols, bd.excell[c].cx, 50)
				}
			}
		}}

		this.vinc();
	},
	drawNumbersOn51_1 : function(obj, rt, dn, add){
		var val,err,grd,nb,el,type,str;
		for(var i=0;i<2;i++){
			if(i===0){ val=obj.qnum,  err=obj.error, guard=obj.cy, nb=rt, type=add+4, str='numobj'; }	// 1��ڂ͉E����
			if(i===1){ val=obj.direc, err=obj.error, guard=obj.cx, nb=dn, type=add+2, str='numobj2';}	// 2��ڂ͉�����

			if(val===-1 || guard===-1 || nb===-1 || bd.cell[nb].ques===51){ this.hideEL(obj[str]);}
			else{
				if(!obj[str]){ obj[str] = this.CreateDOMAndSetNop();}
				var color = (err===1?this.fontErrcolor:this.fontcolor);
				var text = (val>=0?""+val:"");
				this.dispnum(obj[str], type, text, 0.45, color, obj.px, obj.py);
			}
		}
	}
};

//---------------------------------------------------------------------------
// ��MouseEvent�N���X �}�E�X���͂Ɋւ�����̕ێ��ƃC�x���g����������
//---------------------------------------------------------------------------
// �p�Y������ �}�E�X���͕�
// MouseEvent�N���X���`
var MouseEvent = function(){
	this.inputPos;
	this.mouseCell;
	this.inputData;
	this.firstPos;
	this.btn = {};
	this.mousereset();

	this.enableInputHatena = !!k.isDispHatena;
	this.inputQuesDirectly = false;

	this.docEL  = document.documentElement;
	this.bodyEL = document.body;
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
		if(k.enableMouse){
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
		if(k.enableMouse && !this.btn.Middle && (this.btn.Left || this.btn.Right)){
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

		if(k.enableMouse && !this.btn.Middle && (this.btn.Left || this.btn.Right)){
			um.newOperation(false);
			this.setposition(e);
			this.mousemove();	// �e�p�Y���̃��[�`����
		}
		ee.stopPropagation(e);
		ee.preventDefault(e);
		return false;
	},
	e_mouseout : function(e) {
//		if (k.br.IE){ var e=window.event;}
//		this.mousereset();
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
	setposition : (
		((k.br.WinWebKit) ?
			function(e){
				this.inputPos.x = e.pageX-1 -k.cv_oft.x-k.p0.x-k.IEMargin.x;
				this.inputPos.y = e.pageY-1 -k.cv_oft.y-k.p0.y-k.IEMargin.y;
			}
		:(!k.br.IE) ?
			function(e){
				this.inputPos.x = e.pageX   -k.cv_oft.x-k.p0.x-k.IEMargin.x;
				this.inputPos.y = e.pageY   -k.cv_oft.y-k.p0.y-k.IEMargin.y;
			}
		:
			function(e){
				this.inputPos.x = e.clientX + (this.docEL.scrollLeft || this.bodyEL.scrollLeft) -k.cv_oft.x-k.p0.x-k.IEMargin.x;
				this.inputPos.y = e.clientY + (this.docEL.scrollTop  || this.bodyEL.scrollTop ) -k.cv_oft.y-k.p0.y-k.IEMargin.y;
			}
		)
	),

	notInputted : function(){ return !um.changeflag;},
	modeflip    : function(){ if(k.EDITOR){ pp.setVal('mode', (k.playmode?1:3));} },

	// ���ʊ֐�
	//---------------------------------------------------------------------------
	// mv.cellid()   ���͂��ꂽ�ʒu���ǂ̃Z����ID�ɊY�����邩��Ԃ�
	// mv.crossid()  ���͂��ꂽ�ʒu���ǂ̌����_��ID�ɊY�����邩��Ԃ�
	// mv.cellpos()  ���͂��ꂽ�ʒu�����z�Z����łǂ���(X,Y)�ɊY�����邩��Ԃ�
	// mv.crosspos() ���͂��ꂽ�ʒu�����z�Z����łǂ���(X*2,Y*2)�ɊY�����邩��Ԃ��B
	//               �O�g�̍��オ(0,0)�ŉE����(k.qcols*2,k.qrows*2)�Brc��0�`0.5�̃p�����[�^�B
	// mv.borderid() ���͂��ꂽ�ʒu���ǂ̋��E���ELine��ID�ɊY�����邩��Ԃ�(�N���b�N�p)
	//---------------------------------------------------------------------------
	cellid : function(){
		var pos = this.cellpos();
		if(this.inputPos.x%k.cwidth==0 || this.inputPos.y%k.cheight==0){ return -1;} // �҂�����͖���
		return bd.cnum(pos.x,pos.y);
	},
	crossid : function(){
		var pos = this.crosspos(0.5);
		return bd.xnum(pos.x>>1,pos.y>>1);
	},
	cellpos : function(){	// crosspos(p,0)�ł���ւ͂ł���
		return new Pos(mf(this.inputPos.x/k.cwidth), mf(this.inputPos.y/k.cheight));
	},
	crosspos : function(rc){
		var pm = rc*k.cwidth;
		var cx = mf((this.inputPos.x+pm)/k.cwidth), cy = mf((this.inputPos.y+pm)/k.cheight);
		var dx = (this.inputPos.x+pm)%k.cwidth,     dy = (this.inputPos.y+pm)%k.cheight;

		return new Pos(cx*2+(dx<2*pm?0:1), cy*2+(dy<2*pm?0:1));
	},

	borderid : function(spc){
		var cx = mf(this.inputPos.x/k.cwidth), cy = mf(this.inputPos.y/k.cheight);
		var dx = this.inputPos.x%k.cwidth,     dy = this.inputPos.y%k.cheight;
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
			if(dx>dy){ return bd.bnum(2*cx+1,2*cy  );}	//�E��
			else     { return bd.bnum(2*cx  ,2*cy+1);}	//����
		}
		else{	//�E��
			if(dx>dy){ return bd.bnum(2*cx+2,2*cy+1);}	//�E��
			else     { return bd.bnum(2*cx+1,2*cy+2);}	//����
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

		if(k.NumberIsWhite==1 && bd.QnC(cc)!=-1 && (this.inputData==1||(this.inputData==2 && pc.bcolor=="white"))){ return;}
		if(k.RBBlackCell==1 && this.inputData==1){
			if(this.firstPos.x == -1 && this.firstPos.y == -1){ this.firstPos = new Pos(bd.cell[cc].cx, bd.cell[cc].cy);}
			if((this.firstPos.x+this.firstPos.y) % 2 != (bd.cell[cc].cx+bd.cell[cc].cy) % 2){ return;}
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

			pc.paint(bd.cell[cc0].cx-1, bd.cell[cc0].cy-1, bd.cell[cc0].cx, bd.cell[cc0].cy);
		}
		this.mouseCell = cc;

		pc.paint(bd.cell[cc].cx-1, bd.cell[cc].cy-1, bd.cell[cc].cx, bd.cell[cc].cy);
	},
	inputqnum1 : function(cc){
		if(k.isOneNumber){ cc = area.getTopOfRoomByCell(cc);}
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
			pc.paint(bd.cell[cc0].cx-1, bd.cell[cc0].cy-1, bd.cell[cc0].cx, bd.cell[cc0].cy);
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
		var pos = this.cellpos();
		if(pos.x==this.mouseCell.x && pos.y==this.mouseCell.y){ return;}

		var inp = 0;
		var cc = bd.cnum(this.mouseCell.x, this.mouseCell.y);
		if(cc!=-1 && bd.QnC(cc)!=-1){
			if     (pos.y-this.mouseCell.y==-1){ inp=k.UP;}
			else if(pos.y-this.mouseCell.y== 1){ inp=k.DN;}
			else if(pos.x-this.mouseCell.x==-1){ inp=k.LT;}
			else if(pos.x-this.mouseCell.x== 1){ inp=k.RT;}
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

		pc.paint(d.x1, d.y1, d.x2, d.y2);
	},

	//---------------------------------------------------------------------------
	// mv.input51()   [�_]���������������肷��
	// mv.set51cell() [�_]���쐬�E��������Ƃ��̋��ʏ����֐�(�J�b�N���ȊO�̓I�[�o�[���C�h�����)
	//---------------------------------------------------------------------------
	input51 : function(){
		var pos = this.cellpos();
		var cc = bd.cnum(pos.x, pos.y);

		if((pos.x==-1 && pos.y>=-1 && pos.y<=k.qrows-1) || (pos.y==-1 && pos.x>=-1 && pos.x<=k.qcols-1)){
			var tcx=tc.getTCX(), tcy=tc.getTCY();
			tc.setTCP(new Pos(2*pos.x+1,2*pos.y+1));
			pc.paint(tcx-1,tcy-1,tcx,tcy);
			pc.paint(tc.getTCX()-1,tc.getTCY()-1,tc.getTCX(),tc.getTCY());
			return;
		}
		else if(cc!=-1 && cc!=tc.getTCC()){
			var tcx=tc.getTCX(), tcy=tc.getTCY();
			tc.setTCC(cc);
			pc.paint(tcx-1,tcy-1,tcx,tcy);
		}
		else if(cc!=-1){
			if(this.btn.Left){
				if(bd.QuC(cc)!=51){ this.set51cell(cc,true);}
				else{ kc.chtarget('shift');}
			}
			else if(this.btn.Right){ this.set51cell(cc,false);}
		}
		else{ return;}

		pc.paint(bd.cell[cc].cx-1, bd.cell[cc].cy-1, bd.cell[cc].cx+1, bd.cell[cc].cy+1);
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

			pc.paint(bd.cross[cc0].cx-1, bd.cross[cc0].cy-1, bd.cross[cc0].cx, bd.cross[cc0].cy);
		}
		this.mouseCell = cc;

		pc.paint(bd.cross[cc].cx-1, bd.cross[cc].cy-1, bd.cross[cc].cx, bd.cross[cc].cy);
	},
	inputcrossMark : function(){
		var pos = this.crosspos(0.24);
		if(pos.x%2!=0 || pos.y%2!=0){ return;}
		if(pos.x<(k.isoutsidecross==1?0:2) || pos.x>(k.isoutsidecross==1?2*k.qcols:2*k.qcols-2)){ return;}
		if(pos.y<(k.isoutsidecross==1?0:2) || pos.y>(k.isoutsidecross==1?2*k.qrows:2*k.qrows-2)){ return;}

		var cc = bd.xnum(pos.x>>1,pos.y>>1);

		um.disCombine = 1;
		bd.sQnX(cc,(bd.QnX(cc)==1)?-1:1);
		um.disCombine = 0;

		pc.paint(bd.cross[cc].cx-1, bd.cross[cc].cy-1, bd.cross[cc].cx, bd.cross[cc].cy);
	},
	//---------------------------------------------------------------------------
	// mv.inputborder()    �Ֆʋ��E���̖��f�[�^����͂���
	// mv.inputborderans() �Ֆʋ��E���̉񓚃f�[�^����͂���
	// mv.inputBD()        ��L��̋��ʏ����֐�
	//---------------------------------------------------------------------------
	inputborder : function(){ this.inputBD(0);},
	inputborderans : function(){ this.inputBD(1);},
	inputBD : function(flag){
		var pos = this.crosspos(0.35);
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
		var pos = this.cellpos();
		if(pos.x==this.mouseCell.x && pos.y==this.mouseCell.y){ return;}

		var id = -1;
		if     (pos.y-this.mouseCell.y==-1){ id=bd.bnum(this.mouseCell.x*2+1,this.mouseCell.y*2  );}
		else if(pos.y-this.mouseCell.y== 1){ id=bd.bnum(this.mouseCell.x*2+1,this.mouseCell.y*2+2);}
		else if(pos.x-this.mouseCell.x==-1){ id=bd.bnum(this.mouseCell.x*2  ,this.mouseCell.y*2+1);}
		else if(pos.x-this.mouseCell.x== 1){ id=bd.bnum(this.mouseCell.x*2+2,this.mouseCell.y*2+1);}

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
		var pos = this.crosspos(0.22);
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
		var cx=bd.cell[cc].cx, cy=bd.cell[cc].cy;
		if( func(bd.cnum(cx-1,cy-1)) ){ this.db0(func, bd.cnum(cx-1,cy-1), num);}
		if( func(bd.cnum(cx  ,cy-1)) ){ this.db0(func, bd.cnum(cx  ,cy-1), num);}
		if( func(bd.cnum(cx+1,cy-1)) ){ this.db0(func, bd.cnum(cx+1,cy-1), num);}
		if( func(bd.cnum(cx-1,cy  )) ){ this.db0(func, bd.cnum(cx-1,cy  ), num);}
		if( func(bd.cnum(cx+1,cy  )) ){ this.db0(func, bd.cnum(cx+1,cy  ), num);}
		if( func(bd.cnum(cx-1,cy+1)) ){ this.db0(func, bd.cnum(cx-1,cy+1), num);}
		if( func(bd.cnum(cx  ,cy+1)) ){ this.db0(func, bd.cnum(cx  ,cy+1), num);}
		if( func(bd.cnum(cx+1,cy+1)) ){ this.db0(func, bd.cnum(cx+1,cy+1), num);}
		return;
	},

	dispRedLine : function(){
		var id = this.borderid(0.15);
		this.mousereset();
		if(id!=-1 && id==this.mouseCell){ return;}

		if(!bd.isLine(id)){
			var cc = (k.isborderAsLine==0?this.cellid():this.crossid());
			if(cc==-1 || (k.isLineCross && (line.lcntCell(cc)==3 || line.lcntCell(cc)==4))){ return;}

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
		if(k.enableKey){
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
		if(k.enableKey){
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
		if(k.enableKey){
			um.newOperation(false);
			this.ca = this.getcharp(e, this.getKeyCode(e));

			if(this.ca){ this.keyinput(this.ca);}	// �e�p�Y���̃��[�`����
		}
	},

	//---------------------------------------------------------------------------
	// kc.e_SLkeydown()  Silverlight�I�u�W�F�N�g�Ƀt�H�[�J�X�����鎞�A�L�[���������ۂ̃C�x���g���ʏ���
	// kc.e_SLkeyup()    Silverlight�I�u�W�F�N�g�Ƀt�H�[�J�X�����鎞�A�L�[�𗣂����ۂ̃C�x���g���ʏ���
	//---------------------------------------------------------------------------
	e_SLkeydown : function(sender,keyEventArgs){
		var emulate = { keyCode : keyEventArgs.platformKeyCode, shiftKey:keyEventArgs.shift, ctrlKey:keyEventArgs.ctrl,
						altKey:false, returnValue:false, preventDefault:f_true };
		return this.e_keydown(emulate);
	},
	e_SLkeyup : function(sender,keyEventArgs){
		var emulate = { keyCode : keyEventArgs.platformKeyCode, shiftKey:keyEventArgs.shift, ctrlKey:keyEventArgs.ctrl,
						altKey:false, returnValue:false, preventDefault:f_true };
		return this.e_keyup(emulate);
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
	//Programming Magic�l�̃R�[�h
	getKeyCode : function(e){
		if(document.all) return  e.keyCode;
		else if(document.getElementById) return (e.keyCode)? e.keyCode: e.charCode;
		else if(document.layers) return  e.which;
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
		if(k.scriptcheck && debug){ flag = (flag || debug.keydown(this.ca));}

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
		var tcx = tc.cursolx, tcy = tc.cursoly, flag = false;
		if     (ca == k.KEYUP && tcy-mv >= tc.miny){ tc.decTCY(mv); flag = true;}
		else if(ca == k.KEYDN && tcy+mv <= tc.maxy){ tc.incTCY(mv); flag = true;}
		else if(ca == k.KEYLT && tcx-mv >= tc.minx){ tc.decTCX(mv); flag = true;}
		else if(ca == k.KEYRT && tcx+mv <= tc.maxx){ tc.incTCX(mv); flag = true;}

		if(flag){
			pc.paint((tcx>>1)-1, (tcy>>1)-1, tcx>>1, tcy>>1);
			pc.paint((tc.cursolx>>1)-1, (tc.cursoly>>1)-1, tc.cursolx>>1, tc.cursoly>>1);
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

		pc.paint(bd.cross[cc].cx-1, bd.cross[cc].cy-1, bd.cross[cc].cx, bd.cross[cc].cy);
	},
	//---------------------------------------------------------------------------
	// kc.key_inputqnum() ���max�܂ł̐�����Cell�̖��f�[�^�����ē��͂���(keydown��)
	//---------------------------------------------------------------------------
	key_inputqnum : function(ca){
		var cc = tc.getTCC();
		if(k.editmode && k.isOneNumber){ cc = area.getTopOfRoomByCell(cc);}
		var max = bd.nummaxfunc(cc);

		if('0'<=ca && ca<='9'){
			var num = parseInt(ca);
			if(k.playmode){ bd.sDiC(cc,0);}

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
			pc.paint(tc.cursolx>>1, tc.cursoly>>1, tc.cursolx>>1, tc.cursoly>>1);
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
		if(cc==-1){ ex = bd.exnum(tc.getTCX(),tc.getTCY());}
		var target = this.detectTarget(cc,ex);
		if(target==-1 || (cc!=-1 && bd.QuC(cc)==51)){
			if(ca=='q' && cc!=-1){
				mv.set51cell(cc,(bd.QuC(cc)!=51));
				pc.paint(tc.getTCX()-1,tc.getTCY()-1,tc.getTCX()+1,tc.getTCY()+1);
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
		if(cc!=-1){ pc.paintCell(tc.getTCC());}else{ pc.paint(tc.getTCX(),tc.getTCY(),tc.getTCX(),tc.getTCY());}
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
			if	  ((bd.excell[ex].cy==-1 && bd.QuC(bd.excell[ex].cx)==51) ||
				   (bd.excell[ex].cx==-1 && bd.QuC(bd.excell[ex].cy*k.qcols)==51)){ return -1;}
			else if(bd.excell[ex].cy==-1){ return 4;}
			else if(bd.excell[ex].cx==-1){ return 2;}
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

			this.imgs.push({'el':_img, 'cx':disp[0], 'cy':disp[1]});
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
			this.ctl[mode].el.style.left   = k.cv_oft.x + mv.inputPos.x - 3 + k.IEMargin.x;
			this.ctl[mode].el.style.top    = k.cv_oft.y + mv.inputPos.y - 3 + k.IEMargin.y;
			this.ctl[mode].el.style.zIndex = 100;

			if(this.ctl[mode].target==k.CELL){
				var cc0 = tc.getTCC();
				var cc = mv.cellid();
				if(cc==-1){ return;}
				tc.setTCC(cc);
				pc.paint(bd.cell[cc].cx-1, bd.cell[cc].cy-1, bd.cell[cc].cx, bd.cell[cc].cy);
				pc.paint(bd.cell[cc0].cx-1, bd.cell[cc0].cy-1, bd.cell[cc0].cx, bd.cell[cc0].cy);
			}
			else if(this.ctl[mode].target==k.CROSS){
				var cc0 = tc.getTXC();
				var cc = mv.crossid();
				if(cc==-1){ return;}
				tc.setTXC(cc);
				pc.paint(bd.cross[cc].cx-1, bd.cross[cc].cy-1, bd.cross[cc].cx, bd.cross[cc].cy);
				pc.paint(bd.cross[cc0].cx-1, bd.cross[cc0].cy-1, bd.cross[cc0].cx, bd.cross[cc0].cy);
			}

			this.ctl[mode].el.style.display = 'inline';
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
			obj.el.style.clip   = "rect("+(bsize*obj.cy+1)+"px,"+(bsize*(obj.cx+1))+"px,"+(bsize*(obj.cy+1))+"px,"+(bsize*obj.cx+1)+"px)";
			obj.el.style.top    = "-"+(obj.cy*bsize+1)+"px";
			obj.el.style.left   = "-"+(obj.cx*bsize+1)+"px";
		};

		if(k.def_csize>=24){
			for(var i=0,len=this.tds.length ;i<len;i++){ tfunc(this.tds[i],  k.def_csize);}
			for(var i=0,len=this.imgs.length;i<len;i++){ ifunc(this.imgs[i], mf(k.def_csize*0.90));}
		}
		else{
			for(var i=0,len=this.tds.length ;i<len;i++){ tfunc(this.tds[i],  22);}
			for(var i=0,len=this.imgs.length;i<len;i++){ ifunc(this.imgs[i], 18);}
		}
	}
};

//---------------------------------------------------------------------------
// ��TCell�N���X �L�[���͂̃^�[�Q�b�g��ێ����� (�֐��̐����͗�)
//---------------------------------------------------------------------------

TCell = function(){
	this.cursolx = 1;
	this.cursoly = 1;

	this.minx = (k.isextendcell!=0?-1:1);
	this.miny = (k.isextendcell!=0?-1:1);
	this.maxx = (k.isextendcell==2?2*k.qcols+1:2*k.qcols-1);
	this.maxy = (k.isextendcell==2?2*k.qrows+1:2*k.qrows-1);
};
TCell.prototype = {
	//---------------------------------------------------------------------------
	// tc.Adjust()   �͈͂ƃ^�[�Q�b�g�̈ʒu�𒲐߂���
	// tc.setAlign() ���[�h�ύX���Ɉʒu�����������ꍇ�ɒ��߂���(�I�[�o�[���C�h�p)
	//---------------------------------------------------------------------------
	Adjust : function(){
		if(this.cursolx<this.minx){ this.tborderx=this.minx; }
		if(this.cursoly<this.miny){ this.tbordery=this.miny; }
		if(this.cursolx>this.maxx){ this.tborderx=this.maxx; }
		if(this.cursoly>this.maxy){ this.tbordery=this.maxy; }
	},
	setAlign : function(){ },

	//---------------------------------------------------------------------------
	// tc.incTCX(), tc.incTCY(), tc.decTCX(), tc.decTCY() �^�[�Q�b�g�̈ʒu�𓮂���
	//---------------------------------------------------------------------------
	incTCX : function(mv){ this.cursolx+=mv;},
	incTCY : function(mv){ this.cursoly+=mv;},
	decTCX : function(mv){ this.cursolx-=mv;},
	decTCY : function(mv){ this.cursoly-=mv;},

	//---------------------------------------------------------------------------
	// tc.getTCP() �^�[�Q�b�g�̈ʒu��(X,Y)�Ŏ擾����(�Z����1/2=1�Ƃ���)
	// tc.setTCP() �^�[�Q�b�g�̈ʒu��(X,Y)�Őݒ肷��(�Z����1/2=1�Ƃ���)
	// tc.getTCC() �^�[�Q�b�g�̈ʒu��Cell��ID�Ŏ擾����
	// tc.setTCC() �^�[�Q�b�g�̈ʒu��Cell��ID�Őݒ肷��
	// tc.getTXC() �^�[�Q�b�g�̈ʒu��Cross��ID�Ŏ擾����
	// tc.setTXC() �^�[�Q�b�g�̈ʒu��Cross��ID�Őݒ肷��
	// tc.getTBC() �^�[�Q�b�g�̈ʒu��Border��ID�Ŏ擾����
	// tc.setTBC() �^�[�Q�b�g�̈ʒu��Border��ID�Őݒ肷��
	//---------------------------------------------------------------------------
	getTCP : function(){ return new Pos(this.cursolx,this.cursoly);},
	setTCP : function(pos){
		if(pos.x<this.minx || this.maxx<pos.x || pos.y<this.miny || this.maxy<pos.y){ return;}
		this.cursolx = pos.x; this.cursoly = pos.y;
	},
	getTCC : function(){ return bd.cnum(this.cursolx>>1, this.cursoly>>1);},
	setTCC : function(id){
		if(id<0 || bd.cellmax<=id){ return;}
		this.cursolx = bd.cell[id].cx*2+1; this.cursoly = bd.cell[id].cy*2+1;
	},
	getTXC : function(){ return bd.xnum(this.cursolx>>1, this.cursoly>>1);},
	setTXC : function(id){
		if(!k.iscross || id<0 || bd.crossmax<=id){ return;}
		this.cursolx = bd.cross[id].cx*2; this.cursoly = bd.cross[id].cy*2;
	},
	getTBC : function(){ return bd.bnum(this.cursolx, this.cursoly);},
	setTBC : function(id){
		if(!k.isborder || id<0 || bd.bdmax<=id){ return;}
		this.cursolx = bd.border[id].cx*2; this.cursoly = bd.border[id].cy;
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
	this.outpflag  = '';
	this.outsize   = '';
	this.outbstr   = '';
};
Encode.prototype = {
	//---------------------------------------------------------------------------
	// enc.init()           Encode�I�u�W�F�N�g�Ŏ��l������������
	// enc.first_parseURI() �N������URL����͂��āApuzzleid�̒��o��G�f�B�^/player������s��
	// enc.parseURI()       ���͂��ꂽURL���ǂ̃T�C�g�p�����肵��this.uri�ɒl��ۑ�����
	// enc.parseURI_xxx()   pzlURI����pflag,bstr���̕����ɕ�������
	//---------------------------------------------------------------------------
	init : function(){
		this.uri.type = 0;
		this.uri.qdata = "";

		this.uri.pflag = "";
		this.uri.cols = 0;
		this.uri.rows = 0;
		this.uri.bstr = "";

		this.pidKanpen = '';
		this.outpflag  = '';
		this.outsize   = '';
		this.outbstr   = '';
	},

	first_parseURI : function(search){
		if(search.length<=0){ return "";}

		this.init();

		if(search.substr(0,3)=="?m+" || search.substr(0,3)=="?m/"){
			k.editmode = true;
			k.playmode = false;
			k.EDITOR = true;
			k.PLAYER = false;
			k.autocheck = false;
			search = search.substr(3);
		}
		else{
			k.editmode = false;
			k.playmode = true;
			k.EDITOR = !!k.scriptcheck;
			k.PLAYER =  !k.scriptcheck;
			k.autocheck = true;
			search = search.substr(1);
		}

		var qs = search.indexOf("/");
		if(qs>=0){
			this.parseURI_pzpr(search.substr(qs+1));
			return search.substr(0,qs);
		}

		return search;
	},
	parseURI : function(url){
		this.init();

		// �Ȃ���Opera��textarea��̉��s�����ۂ̉��s�����ɂȂ��Ă��܂����ۂ�
		if(k.br.Opera){ url = url.replace(/(\r|\n)/g,"");}

		// �ς��Ղ�̏ꍇ
		if(url.match(/indi\.s58\.xrea\.com/)){
			// �ς��Ղ�v3��URL
			if(!url.match(/\/(sa|sc)\//)){
				this.parseURI_pzpr(url.substr(url.indexOf("/", url.indexOf("?"))+1));
			}
			// �ς��Ղ�A�v���b�g��URL
			else{
				this.parseURI_pzpr(url.substr(url.indexOf("?")));
				this.uri.type = 1; // 1�͂ς��Ղ�A�v���b�g/URL�W�F�l���[�^
			}
		}
		// �J���y���̏ꍇ
		else if(url.match(/www\.kanpen\.net/) || url.match(/www\.geocities(\.co)?\.jp\/pencil_applet/) ){
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
	},
	parseURI_pzpr : function(qstr){
		this.uri.type = 0; // 0�͂ς��Ղ�v3
		this.uri.qdata = qstr;
		var inp = qstr.split("/");
		if(!isNaN(parseInt(inp[0]))){ inp.unshift("");}

		this.uri.pflag = inp.shift();
		this.uri.cols = parseInt(inp.shift());
		this.uri.rows = parseInt(inp.shift());
		this.uri.bstr = inp.join("/");
	},
	parseURI_kanpen : function(qstr){
		this.uri.type = 2; // 2�̓J���y��
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
		this.uri.type = 4; // 4�͂ւ�킯�A�v���b�g
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
	// enc.getURLbase() ���̃X�N���v�g���u���Ă���URL��\������
	// enc.getDocbase() ���̃X�N���v�g���u���Ă���h���C������\������
	// enc.kanpenbase() �J���y���̃h���C������\������
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
			case 0: case 1: case 3:
				this.outbstr = this.uri.bstr;
				this.pzlimport(this.uri.type);
				break;
			case 2:
				fio.lineseek = 0;
				fio.dataarray = this.uri.bstr.replace(/_/g, " ").split("/");
				this.decodeKanpen();
				break;
			case 4:
				this.decodeHeyaApp();
				break;
			}
			um.enableRecord(); um.enableInfo();

			bd.ansclear();

			base.resetInfo(true);
			base.resize_canvas_onload();
		}
	},
	pzloutput : function(type){
		this.outpflag = '';
		this.outsize = '';
		this.outbstr = '';

		if(type===0 || type===3 || type===1 || (type===2 && k.puzzleid=='lits')){
			this.pzlexport(((type===0 || type===3)?0:1));

			var size = [k.qcols,k.qrows].join('/');
			if(!!this.outsize){ size = this.outsize;}

			var pflag = this.outpflag, bstr = this.outbstr;

			if(type===0 || type===3){
				return [this.getURLbase(),(type===3?"m+":""),k.puzzleid,"/",(!!pflag?(pflag+"/"):""),size,"/",bstr].join('');
			}
			else if(type===1){
				return [this.getDocbase(),k.puzzleid,"/sa/m.html?",pflag,"/",size,"/",bstr].join('');
			}
			else if(type===2){
				return [this.kanpenbase(),this.pidKanpen,".html?pzpr=",pflag,"/",size,"/",bstr].join('');
			}
		}
		else if(type===2){
			fio.datastr = "";
			this.encodeKanpen()
			var bstr = fio.datastr.replace(/ /g, "_");

			var size = [k.qrows,k.qcols].join('/');
			if(!!this.outsize){ size = this.outsize;}

			return [this.kanpenbase(),this.pidKanpen,".html?problem=",size,"/",bstr].join('');
		}
		else if(type===4){
			var bstr = this.encodeHeyaApp(bstr);
			var size = [k.qcols,k.qrows].join('x');

			return ["http://www.geocities.co.jp/heyawake/?problem=",size,"/",bstr].join('');
		}

		return '';
	},
	getURLbase : function(){ return "http://indi.s58.xrea.com/pzpr/v3/p.html?";},
	getDocbase : function(){ return "http://indi.s58.xrea.com/";},
	kanpenbase : function(){ return "http://www.kanpen.net/";},

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
				var cx = (k.isoutsidecross==1?   cc%(k.qcols+1) :   cc%(k.qcols-1) +1);
				var cy = (k.isoutsidecross==1?mf(cc/(k.qcols+1)):mf(cc/(k.qcols-1))+1);

				if(cy>=k.qrows+(k.isoutsidecross==1?1:0)){ i++; break;}
				bd.sQnX(bd.xnum(cx,cy), 1);
			}
			else if(ca == '.'){ cc += 36;}
			else{ cc++;}

			if(cc >= (k.isoutsidecross==1?(k.qcols+1)*(k.qrows+1):(k.qcols-1)*(k.qrows-1))-1){ i++; break;}
		}
		this.outbstr = bstr.substr(i);
	},
	encodeCrossMark : function(){
		var cm = "", count = 0;
		for(var i=0;i<(k.isoutsidecross==1?(k.qcols+1)*(k.qrows+1):(k.qcols-1)*(k.qrows-1));i++){
			var pstr = "";
			var cx = (k.isoutsidecross==1?   i%(k.qcols+1) :   i%(k.qcols-1) +1);
			var cy = (k.isoutsidecross==1?mf(i/(k.qcols+1)):mf(i/(k.qcols-1))+1);

			if(bd.QnX(bd.xnum(cx,cy))==1){ pstr = ".";}
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

	this.db = null;
	this.dbmgr = null;
	this.DBtype = 0;
	this.DBsid  = -1;
	this.DBlist = [];
};
FileIO.prototype = {
	//---------------------------------------------------------------------------
	// fio.filedecode() �t�@�C�����J�����A�t�@�C���f�[�^����̃f�R�[�h���s�֐�
	//                  [menu.ex.fileopen] -> [fileio.xcg@iframe] -> [����]
	//---------------------------------------------------------------------------
	filedecode : function(datastr, type){
		this.filever = 0;
		this.lineseek = 0;
		this.dataarray = datastr.split("/");

		// �w�b�_�̏���
		if(type===1){
			if(!this.readLine().match(/pzprv3\.?(\d+)?/)){ alert('�ς��Ղ�v3�`���̃t�@�C���ł͂���܂���B'); return;}
			if(RegExp.$1){ this.filever = parseInt(RegExp.$1);}

			if(this.readLine()!=k.puzzleid){ alert(base.getPuzzleName()+'�̃t�@�C���ł͂���܂���B'); return;}
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
		if     (type===1){ this.encodeData();}
		else if(type===2){ this.kanpenSave();}

		// �T�C�Y��\��������
		if(!this.sizestr){ this.sizestr = [k.qrows, k.qcols].join("/");}
		this.datastr = [this.sizestr, this.datastr].join("/");

		// �w�b�_�̏���
		if(type===1){
			var header = (this.filever===0 ? "pzprv3" : ("pzprv3."+this.filever));
			this.datastr = [header, k.puzzleid, this.datastr].join("/");
		}

		// ������URL�ǉ�����
		if(type===1){
			this.urlstr = enc.pzloutput((!k.isKanpenExist || k.puzzleid==="lits") ? 0 : 2);
		}

		return this.datastr;
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
	decodeObj : function(func, width, height, getid){
		var item = this.getItemList(height);
		for(var i=0;i<item.length;i++){ func(getid(i%width,mf(i/width)), item[i]);}
	},
	decodeCell   : function(func){
		this.decodeObj(func, k.qcols  , k.qrows  , function(cx,cy){return bd.cnum(cx,cy);});
	},
	decodeCross  : function(func){
		this.decodeObj(func, k.qcols+1, k.qrows+1, function(cx,cy){return bd.xnum(cx,cy);});
	},
	decodeBorder : function(func){
		this.decodeObj(func, k.qcols-1, k.qrows  , function(cx,cy){return bd.bnum(2*cx+2,2*cy+1);});
		this.decodeObj(func, k.qcols  , k.qrows-1, function(cx,cy){return bd.bnum(2*cx+1,2*cy+2);});
	},
	decodeBorder2: function(func){
		this.decodeObj(func, k.qcols+1, k.qrows  , function(cx,cy){return bd.bnum(2*cx  ,2*cy+1);});
		this.decodeObj(func, k.qcols  , k.qrows+1, function(cx,cy){return bd.bnum(2*cx+1,2*cy  );});
	},

	//---------------------------------------------------------------------------
	// fio.encodeObj()     �ʃZ���f�[�^������ʕ�����̐ݒ���s��
	// fio.encodeCell()    �ʃZ���f�[�^����ʕ�����̐ݒ���s��
	// fio.encodeCross()   ��Cross�f�[�^����ʕ�����̐ݒ���s��
	// fio.encodeBorder()  ��Border�f�[�^(�O�g��Ȃ�)����ʕ�����̐ݒ���s��
	// fio.encodeBorder2() ��Border�f�[�^(�O�g�゠��)����ʕ�����̐ݒ���s��
	//---------------------------------------------------------------------------
	encodeObj : function(func, width, height, getid){
		for(var cy=0;cy<height;cy++){
			for(var cx=0;cx<width;cx++){
				this.datastr += func(getid(cx,cy));
			}
			this.datastr += "/";
		}
	},
	encodeCell   : function(func){
		this.encodeObj(func, k.qcols  , k.qrows  , function(cx,cy){return bd.cnum(cx,cy);});
	},
	encodeCross  : function(func){
		this.encodeObj(func, k.qcols+1, k.qrows+1, function(cx,cy){return bd.xnum(cx,cy);});
	},
	encodeBorder : function(func){
		this.encodeObj(func, k.qcols-1, k.qrows  , function(cx,cy){return bd.bnum(2*cx+2,2*cy+1);})
		this.encodeObj(func, k.qcols  , k.qrows-1, function(cx,cy){return bd.bnum(2*cx+1,2*cy+2);});
	},
	encodeBorder2: function(func){
		this.encodeObj(func, k.qcols+1, k.qrows  , function(cx,cy){return bd.bnum(2*cx  ,2*cy+1);})
		this.encodeObj(func, k.qcols  , k.qrows+1, function(cx,cy){return bd.bnum(2*cx+1,2*cy  );});
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
			var cc1 = bd.cc1(id), cc2 = bd.cc2(id);
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
			var cx=i%(k.qcols+1)-1, cy=mf(i/(k.qcols+1))-1;
			if(item[i]!="."){
				if     (cy===-1){ bd.sDiE(bd.exnum(cx,cy), parseInt(item[i]));}
				else if(cx===-1){ bd.sQnE(bd.exnum(cx,cy), parseInt(item[i]));}
				else{
					var inp = item[i].split(",");
					var c = bd.cnum(cx,cy);
					mv.set51cell(c, true);
					bd.sQnC(c, inp[0]);
					bd.sDiC(c, inp[1]);
				}
			}
		}
	},
	encodeCellQnum51 : function(){
		var str = "";
		for(var cy=-1;cy<k.qrows;cy++){
			for(var cx=-1;cx<k.qcols;cx++){
				if     (cx===-1 && cy==-1){ str += "0 ";}
				else if(cy===-1){ str += (""+bd.DiE(bd.exnum(cx,cy)).toString()+" ");}
				else if(cx===-1){ str += (""+bd.QnE(bd.exnum(cx,cy)).toString()+" ");}
				else{
					var c = bd.cnum(cx,cy);
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
			var sp = { y1:parseInt(pce[0]), x1:parseInt(pce[1]), y2:parseInt(pce[2]), x2:parseInt(pce[3]), num:pce[4]};
			if(sp.num!=""){ bd.sQnC(bd.cnum(sp.x1,sp.y1), parseInt(sp.num,10));}
			for(var cx=sp.x1;cx<=sp.x2;cx++){
				for(var cy=sp.y1;cy<=sp.y2;cy++){
					rdata[bd.cnum(cx,cy)] = i;
				}
			}
		}
		this.rdata2Border(isques, rdata);

		area.resetRarea();
	},
	encodeSquareRoom_com : function(isques){
		var rinfo = area.getRoomInfo();

		this.datastr += (rinfo.max+"/");
		for(var id=1;id<=rinfo.max;id++){
			var d = ans.getSizeOfClist(rinfo.room[id].idlist,f_true);
			var num = bd.QnC(area.getTopOfRoom(id));
			this.datastr += (""+d.y1+" "+d.x1+" "+d.y2+" "+d.x2+" "+(num>=0 ? ""+num : "")+"/");
		}
	},

//---------------------------------------------------------------------------
// ��Local Storage�p�f�[�^�x�[�X�̐ݒ�E�Ǘ����s��
//---------------------------------------------------------------------------
	//---------------------------------------------------------------------------
	// fio.choiceDataBase() LocalStorage���g���邩�ǂ������肷��
	//---------------------------------------------------------------------------
	choiceDataBase : function(){
		if(window.google && google.gears){ this.DBtype=1; return 1;}
		var factory = 0;

		// FireFox
		if (typeof GearsFactory != 'undefined') { factory=11;}
		else{
			try {
				// IE
				var axobj = new ActiveXObject('Gears.Factory');
				factory=21;
			} catch (e) {
				// Safari
				if((typeof navigator.mimeTypes != 'undefined') && navigator.mimeTypes["application/x-googlegears"]){
					factory=31;
				}
			}
		}
		this.DBtype=(factory>0?1:0);
		return factory;
	},

	//---------------------------------------------------------------------------
	// fio.initDataBase() �f�[�^�x�[�X��V�K�쐬����
	// fio.dropDataBase() �f�[�^�x�[�X���폜����
	// fio.remakeDataBase() �f�[�^�x�[�X���č\�z����
	// fio.updateManager() �X�V���Ԃ��X�V����
	//---------------------------------------------------------------------------
	initDataBase : function(){
		if(this.DBtype===0){ return false;}
		else if(this.DBtype===1){
			this.dbmgr = google.gears.factory.create('beta.database', '1.0');
			this.dbmgr.open('pzprv3_manage');
			this.dbmgr.execute('CREATE TABLE IF NOT EXISTS manage (puzzleid primary key,version,count,lastupdate)');
			this.dbmgr.close();

//			this.remakeDataBase2();

			this.db    = google.gears.factory.create('beta.database', '1.0');
			this.db.open('pzprv3_'+k.puzzleid);
			this.db.execute('CREATE TABLE IF NOT EXISTS pzldata (id int primary key,col,row,hard,pdata,time,comment)');
			this.db.close();
		}
		else if(this.DBtype===2){
			this.dbmgr = openDataBase('pzprv3_manage', '1.0');
			this.dbmgr.transaction(function(tx){
				tx.executeSql('CREATE TABLE IF NOT EXISTS manage (puzzleid primary key,version,count,lastupdate)');
			});

			this.db = openDataBase('pzprv3_'+k.puzzleid, '1.0');
			this.db.transaction(function(tx){
				tx.executeSql('CREATE TABLE IF NOT EXISTS pzldata (id int primary key,col,row,hard,pdata,time,comment)');
			});
		}

		this.updateManager(false);

		var sortlist = { idlist:"ID��", newsave:"�ۑ����V������", oldsave:"�ۑ����Â���", size:"�T�C�Y/��Փx��"};
		var str="";
		for(s in sortlist){ str += ("<option value=\""+s+"\">"+sortlist[s]+"</option>");}
		document.database.sorts.innerHTML = str;

		return true;
	},
	dropDataBase : function(){
		if(this.DBtype===1){
			this.dbmgr.open('pzprv3_manage');
			this.dbmgr.execute('DELETE FROM manage WHERE puzzleid=?',[k.puzzleid]);
			this.dbmgr.close();

			this.db.open('pzprv3_'+k.puzzleid);
			this.db.execute('DROP TABLE IF EXISTS pzldata');
			this.db.close();
		}
		else if(this.DBtype===2){
			this.dbmgr.transaction(function(tx){
				tx.executeSql('DELETE FROM manage WHERE puzzleid=?',[k.puzzleid]);
			});

			this.db.transaction(function(tx){
				tx.executeSql('DROP TABLE IF EXISTS pzldata');
			});
		}
	},

	remakeDataBase : function(){
		this.DBlist = [];

		this.db.open('pzprv3_'+k.puzzleid);
		var rs = this.db.execute('SELECT * FROM pzldata');
		while(rs.isValidRow()){
			var src = {};
			for(var i=0;i<rs.fieldCount();i++){ src[rs.fieldName(i)] = rs.field(i);}
			this.DBlist.push(src);
			rs.next();
		}
		rs.close();

		this.db.execute('DROP TABLE IF EXISTS pzldata');
		this.db.execute('CREATE TABLE IF NOT EXISTS pzldata (id int primary key,col,row,hard,pdata,time,comment)');

		for(var r=0;r<this.DBlist.length;r++){
			var row=this.DBlist[r];
			this.db.execute('INSERT INTO pzldata VALUES(?,?,?,?,?,?,?)',[row.id,row.col,row.row,row.hard,row.pdata,row.time,row.comment]);
		}

		this.db.close();
	},

	updateManager : function(flag){
		var count = -1;
		if(this.DBtype===1){
			if(!flag){
				this.db.open('pzprv3_'+k.puzzleid);
				var rs = this.db.execute('SELECT COUNT(*) FROM pzldata');
				count = (rs.isValidRow()?rs.field(0):0);
				this.db.close();
			}
			else{ count=this.DBlist.length;}

			this.dbmgr.open('pzprv3_manage');
			this.dbmgr.execute('INSERT OR REPLACE INTO manage VALUES(?,?,?,?)',[k.puzzleid,'1.0',count,mf((new Date()).getTime()/1000)]);
			this.dbmgr.close();
		}
		else if(this.DBtype===2){
			if(!flag){
				this.db.transaction(function(tx){
					tx.executeSql('SELECT COUNT(*) FROM pzldata',function(){},function(tx,rs){ count = rs.rows[0];});
				});
			}
			else{ count=this.DBlist.length;}

			this.dbmgr.transaction(function(tx){
				tx.executeSql('INSERT OR REPLACE INTO manage VALUES(?,?,?,?)',[k.puzzleid,'1.0',count,mf((new Date()).getTime()/1000)]);
			});
		}
	},

	//---------------------------------------------------------------------------
	// fio.clickHandler()  �t�H�[����̃{�^���������ꂽ���A�e�֐��ɃW�����v����
	//---------------------------------------------------------------------------
	clickHandler : function(e){
		switch(ee.getSrcElement(e).name){
			case 'sorts'   : this.displayDataTableList(); break;
			case 'datalist': this.selectDataTable(); break;
			case 'tableup' : this.upDataTable();     break;
			case 'tabledn' : this.downDataTable();   break;
			case 'open'    : this.openDataTable();   break;
			case 'save'    : this.saveDataTable();   break;
			case 'comedit' : this.editComment();     break;
			case 'difedit' : this.editDifficult();   break;
			case 'del'     : this.deleteDataTable(); break;
		}
	},

	//---------------------------------------------------------------------------
	// fio.displayDataTableList() �ۑ����Ă���f�[�^�̈ꗗ��\������
	// fio.ni()                   �������1���Ȃ�0������
	// fio.getDataTableList()     �ۑ����Ă���f�[�^�̈ꗗ���擾����
	//---------------------------------------------------------------------------
	displayDataTableList : function(){
		if(this.DBtype>0){
			switch(document.database.sorts.value){
				case 'idlist':  this.DBlist = this.DBlist.sort(function(a,b){ return (a.id-b.id);}); break;
				case 'newsave': this.DBlist = this.DBlist.sort(function(a,b){ return (b.time-a.time || a.id-b.id);}); break;
				case 'oldsave': this.DBlist = this.DBlist.sort(function(a,b){ return (a.time-b.time || a.id-b.id);}); break;
				case 'size':    this.DBlist = this.DBlist.sort(function(a,b){ return (a.col-b.col || a.row-b.row || a.hard-b.hard || a.id-b.id);}); break;
			}

			var html = "";
			for(var i=0;i<this.DBlist.length;i++){
				var row = this.DBlist[i];
				if(!row){ alert(i);}
				var src = ((row.id<10?"&nbsp;":"")+row.id+" :&nbsp;");
				var dt = new Date(); dt.setTime(row.time*1000);
				src += (" "+this.ni(dt.getFullYear()%100)+"/"+this.ni(dt.getMonth()+1)+"/"+this.ni(dt.getDate())+" "+this.ni(dt.getHours())+":"+this.ni(dt.getMinutes()) + "&nbsp;&nbsp;");
				src += (""+row.col+"�~"+row.row+"&nbsp;&nbsp;");
				if     (menu.isLangJP()){ src += ({0:'�|',1:'�炭�炭',2:'���Ă���',3:'�����ւ�',4:'�A�[��'}[row.hard]);}
				else if(menu.isLangEN()){ src += ({0:'-',1:'Easy',2:'Normal',3:'Hard',4:'Expert'}[row.hard]);}
				html += ("<option value=\""+row.id+"\""+(this.DBsid==row.id?" selected":"")+">"+src+"</option>\n");
			}
			html += ("<option value=\"new\""+(this.DBsid==-1?" selected":"")+">&nbsp;&lt;�V�����ۑ�����&gt;</option>\n");
			document.database.datalist.innerHTML = html;

			this.selectDataTable();
		}
	},
	ni : function(num){ return (num<10?"0"+num:""+num);},
	getDataTableList : function(){
		this.DBlist = [];
		if(this.DBtype===1){
			this.db.open('pzprv3_'+k.puzzleid);
			var rs = this.db.execute('SELECT * FROM pzldata');
			while(rs.isValidRow()){
				var src = {};
				for(var i=0;i<rs.fieldCount();i++){ src[rs.fieldName(i)] = rs.field(i);}
				this.DBlist.push(src);
				rs.next();
			}
			rs.close();
			this.db.close();
			this.displayDataTableList();
		}
		else if(this.DBtype===2){
			var self = this;
			this.db.transaction(function(tx){
				tx.executeSql('SELECT * FROM pzldata',[],function(tx,rs){
				for(var r=0;r<rs.rows.length;r++){ self.DBlist.push(rs.rows[r]);}
				self.DBlist = rs;
				self.displayDataTableList();
			}); });
		}
	},

	//---------------------------------------------------------------------------
	// fio.upDataTable()        �f�[�^�̈ꗗ�ł̈ʒu���ЂƂ�ɂ���
	// fio.downDataTable()      �f�[�^�̈ꗗ�ł̈ʒu���ЂƂ��ɂ���
	// fio.convertDataTableID() �f�[�^��ID��t������
	//---------------------------------------------------------------------------
	upDataTable : function(){
		var selected = this.getDataID();
		if(this.DBtype===0 || selected===-1 || selected===0){ return;}

		this.convertDataTableID(selected, selected-1);
	},
	downDataTable : function(){
		var selected = this.getDataID();
		if(this.DBtype===0 || selected===-1 || selected===this.DBlist.length-1){ return;}

		this.convertDataTableID(selected, selected+1);
	},
	convertDataTableID : function(selected,target){
		var sid = this.DBsid;
		var tid = this.DBlist[target].id;
		this.DBsid = tid;

		this.DBlist[selected].id = tid;
		this.DBlist[target].id   = sid;

		if(this.DBtype===1){
			this.db.open('pzprv3_'+k.puzzleid);
			this.db.execute('UPDATE pzldata SET id=? WHERE ID==?',[0  ,sid]);
			this.db.execute('UPDATE pzldata SET id=? WHERE ID==?',[sid,tid]);
			this.db.execute('UPDATE pzldata SET id=? WHERE ID==?',[tid,  0]);
			this.db.close();

			this.displayDataTableList();
		}
		else if(this.DBtype===2){
			var self = this;
			this.db.transaction(function(tx){
				tx.executeSql('UPDATE pzldata SET id=? WHERE ID==?',[0  ,sid]);
				tx.executeSql('UPDATE pzldata SET id=? WHERE ID==?',[sid,tid]);
				tx.executeSql('UPDATE pzldata SET id=? WHERE ID==?',[tid,  0]);
			},f_true,self.displayDataTableList);
		}

		this.updateManager(true);
	},

	//---------------------------------------------------------------------------
	// fio.getDataID()       �f�[�^��ID���擾����
	// fio.selectDataTable() �f�[�^��I�����āA�R�����g�Ȃǂ�\������
	//---------------------------------------------------------------------------
	getDataID : function(){
		if(document.database.datalist.value!="new" && document.database.datalist.value!=""){
			for(var i=0;i<this.DBlist.length;i++){
				if(this.DBlist[i].id===document.database.datalist.value){ return i;}
			}
		}
		return -1;
	},
	selectDataTable : function(){
		var selected = this.getDataID();
		if(selected>=0){
			document.database.comtext.value = ""+this.DBlist[selected].comment;
			this.DBsid = this.DBlist[selected].id;
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
	// fio.openDataTable()   �f�[�^�̔Ֆʂɓǂݍ���
	// fio.saveDataTable()   �f�[�^�̔Ֆʂ�ۑ�����
	//---------------------------------------------------------------------------
	openDataTable : function(){
		var id = this.getDataID();
		if(id===-1 || !confirm("���̃f�[�^��ǂݍ��݂܂����H (���݂̔Ֆʂ͔j������܂�)")){ return;}

		if(this.DBtype===1){
			this.db.open('pzprv3_'+k.puzzleid);

			var id = this.getDataID();
			var rs = this.db.execute('SELECT * FROM pzldata WHERE ID==?',[this.DBlist[id].id]);
			this.filedecode(rs.field(4),1);

			rs.close();
			this.db.close();
		}
		else if(this.DBtype===2){
			var self = this;
			this.db.transaction(function(tx){
				tx.executeSql('SELECT * FROM pzldata WHERE ID==?',[self.DBlist[id].id],
					function(tx,rs){ self.filedecode(rs.rows[0].pdata,1); }
				);
			});
		}
	},
	saveDataTable : function(){
		var id = this.getDataID();
		if(this.DBtype===0 || (id!==-1 && !confirm("���̃f�[�^�ɏ㏑�����܂����H"))){ return;}

		var time = mf((new Date()).getTime()/1000);
		var pdata = this.fileencode(1);
		var str = "";
		if(id===-1){ str = prompt("�R�����g������ꍇ�͓��͂��Ă��������B",""); if(str==null){ str="";} }
		else       { str = this.DBlist[this.getDataID()].comment;}

		if(this.DBtype===1){
			this.db.open('pzprv3_'+k.puzzleid);
			if(id===-1){
				id = this.DBlist.length+1;
				this.db.execute('INSERT INTO pzldata VALUES(?,?,?,?,?,?,?)',[id,k.qcols,k.qrows,0,pdata,time,str]);
			}
			else{
				id = document.database.datalist.value;
				this.db.execute('INSERT OR REPLACE INTO pzldata VALUES(?,?,?,?,?,?,?)',[id,k.qcols,k.qrows,0,pdata,time,str]);
			}
			this.db.close();
			this.getDataTableList();
		}
		else if(this.DBtype===2){
			var self = this;
			if(id===-1){
				id = this.DBlist.length+1;
				this.db.transaction(function(tx){
					tx.executeSql('INSERT INTO pzldata VALUES(?,?,?,?,?,?,?)',[id,k.qcols,k.qrows,0,pdata,time,str]);
				},f_true,self.getDataTableList);
			}
			else{
				id = document.database.datalist.value;
				this.db.transaction(function(tx){
					tx.executeSql('INSERT OR REPLACE INTO pzldata VALUES(?,?,?,?,?,?,?)',[id,k.qcols,k.qrows,0,pdata,time,str]);
				},f_true,self.getDataTableList);
			}
		}

		this.updateManager(true);
	},

	//---------------------------------------------------------------------------
	// fio.editComment()   �f�[�^�̃R�����g���X�V����
	// fio.editDifficult() �f�[�^�̓�Փx���X�V����
	//---------------------------------------------------------------------------
	editComment : function(){
		var id = this.getDataID();
		if(this.DBtype===0 || id===-1){ return;}

		var str = prompt("���̖��ɑ΂���R�����g����͂��Ă��������B",this.DBlist[id].comment);
		if(str==null){ return;}

		this.DBlist[id].comment = str;

		if(this.DBtype===1){
			this.db.open('pzprv3_'+k.puzzleid);

			this.db.execute('UPDATE pzldata SET comment=? WHERE ID==?',[str,this.DBlist[id].id]);
			this.db.close();

			this.displayDataTableList();
		}
		else if(this.DBtype===2){
			var self = this;
			this.db.transaction(function(tx){
				tx.executeSql('UPDATE pzldata SET comment=? WHERE ID==?',[str,self.DBlist[id].id]);
			},f_true,self.displayDataTableList);
		}

		this.updateManager(true);
	},
	editDifficult : function(){
		var id = this.getDataID();
		if(this.DBtype===0 || id===-1){ return;}

		var hard = prompt("���̖��̓�Փx��ݒ肵�Ă��������B\n[0:�Ȃ� 1:�炭�炭 2:���Ă��� 3:�����ւ� 4:�A�[��]",this.DBlist[id].hard);
		if(hard==null){ return;}

		this.DBlist[id].hard = ((hard==='1'||hard==='2'||hard==='3'||hard==='4')?hard:0);

		if(this.DBtype===1){
			this.db.open('pzprv3_'+k.puzzleid);

			this.db.execute('UPDATE pzldata SET hard=? WHERE ID==?',[hard,this.DBlist[id].id]);
			this.db.close();

			this.displayDataTableList();
		}
		else if(this.DBtype===2){
			var self = this;
			this.db.transaction(function(tx){
				tx.executeSql('UPDATE pzldata SET hard=? WHERE ID==?',[hard,self.DBlist[id].id]);
			},f_true,self.displayDataTableList);
		}

		this.updateManager(true);
	},

	//---------------------------------------------------------------------------
	// fio.deleteDataTable() �I�����Ă���Ֆʃf�[�^���폜����
	//---------------------------------------------------------------------------
	deleteDataTable : function(){
		var id = this.getDataID();
		if(this.DBtype===0 || id===-1 || !confirm("���̃f�[�^�����S�ɍ폜���܂����H")){ return;}

		if(this.DBtype===1){
			this.db.open('pzprv3_'+k.puzzleid);

			this.db.execute('DELETE FROM pzldata WHERE ID==?',[this.DBlist[id].id]);

			this.DBlist = this.DBlist.sort(function(a,b){ return (a.id-b.id);});
			for(var i=id+1;i<this.DBlist.length;i++){
				this.db.execute('UPDATE pzldata SET id=? WHERE ID==?',[this.DBlist[i].id-1,this.DBlist[i].id]);
				this.DBlist[i].id--;
				this.DBlist[i-1] = this.DBlist[i];
			}
			this.DBlist.splice(this.DBlist.length-1,1);

			this.db.close();
			this.displayDataTableList();
		}
		else if(this.DBtype===2){
			var self = this;
			this.db.transaction(function(tx){
				tx.executeSql('DELETE FROM pzldata WHERE ID==?',[self.DBlist[id].id]);
				self.DBlist = self.DBlist.sort(function(a,b){ return (a.id-b.id);});
				for(var i=id+1;i<self.DBlist.length;i++){
					tx.executeSql('UPDATE pzldata SET id=? WHERE ID==?',[self.DBlist[i].id-1,self.DBlist[i].id]);
					self.DBlist[i].id--;
					self.DBlist[i-1] = self.DBlist[i];
				}
				self.DBlist.splice(this.DBlist.length-1,1);
			},f_true,self.displayDataTableList);
		}

		this.updateManager(true);
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
		if(!k.autocheck || k.editmode || this.inCheck){ return;}

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
			var cc1 = bd.cc1(id), cc2 = bd.cc2(id);
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
				bd.sErC([c],1); result = false;
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
			if(bd.cell[c].cx<k.qcols-1 && bd.cell[c].cy<k.qrows-1){
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
			if(bd.cell[c].cx<k.qcols-1 && func(c,c+1)){
				if(this.inAutoCheck){ return false;}
				bd.sErC([c,c+1],1); result = false;
			}
			if(bd.cell[c].cy<k.qrows-1 && func(c,c+k.qcols)){
				if(this.inAutoCheck){ return false;}
				bd.sErC([c,c+k.qcols],1); result = false;
			}
		}
		return result;
	},

	//---------------------------------------------------------------------------
	// ans.checkAreaRect()  ���ׂĂ�func�𖞂����}�X�ō\�������G���A���l�p�`�ł��邩�ǂ������肷��
	// ans.checkAllArea()   ���ׂĂ�func�𖞂����}�X�ō\�������G���A���T�C�Y����func2�𖞂������ǂ������肷��
	// ans.getSizeOfClist() �w�肳�ꂽCell�̃��X�g�̏㉺���E�̒[�ƁA���̒��ŏ���func�𖞂����Z���̑傫����Ԃ�
	//---------------------------------------------------------------------------
	checkAreaRect : function(cinfo, func){ return this.checkAllArea(cinfo, func, function(w,h,a){ return (w*h==a)}); },
	checkAllArea : function(cinfo, func, func2){
		var result = true;
		for(var id=1;id<=cinfo.max;id++){
			var d = this.getSizeOfClist(cinfo.room[id].idlist,func);
			if(!func2(d.x2-d.x1+1, d.y2-d.y1+1, d.cnt)){
				if(this.inAutoCheck){ return false;}
				bd.sErC(cinfo.room[id].idlist,1);
				result = false;
			}
		}
		return result;
	},
	getSizeOfClist : function(clist, func){
		var d = { x1:k.qcols, x2:-1, y1:k.qrows, y2:-1, cnt:0 };
		for(var i=0;i<clist.length;i++){
			if(d.x1>bd.cell[clist[i]].cx){ d.x1=bd.cell[clist[i]].cx;}
			if(d.x2<bd.cell[clist[i]].cx){ d.x2=bd.cell[clist[i]].cx;}
			if(d.y1>bd.cell[clist[i]].cy){ d.y1=bd.cell[clist[i]].cy;}
			if(d.y2<bd.cell[clist[i]].cy){ d.y2=bd.cell[clist[i]].cy;}
			if(func(clist[i])){ d.cnt++;}
		}
		return d;
	},

	//---------------------------------------------------------------------------
	// ans.checkQnumCross()  cross������func==false�̎��A�G���[��ݒ肷��
	//---------------------------------------------------------------------------
	checkQnumCross : function(func){	//func(cr,bcnt){} -> �G���[�Ȃ�false��Ԃ��֐��ɂ���
		for(var c=0;c<bd.crossmax;c++){
			if(bd.QnX(c)<0){ continue;}
			if(!func(bd.QnX(c), bd.bcntCross(bd.cross[c].cx, bd.cross[c].cy))){
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
		bd.sErB([bd.ub(cc),bd.db(cc),bd.lb(cc),bd.rb(cc)], 1);
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
		var cx = bd.cell[cc].cx; var cy = bd.cell[cc].cy;
		if( (k.isoutsideborder==0 && cy==0        ) || bd.isBorder(bd.bnum(cx*2+1,cy*2  )) ){ cnt++;}
		if( (k.isoutsideborder==0 && cy==k.qrows-1) || bd.isBorder(bd.bnum(cx*2+1,cy*2+2)) ){ cnt++;}
		if( (k.isoutsideborder==0 && cx==0        ) || bd.isBorder(bd.bnum(cx*2  ,cy*2+1)) ){ cnt++;}
		if( (k.isoutsideborder==0 && cx==k.qcols-1) || bd.isBorder(bd.bnum(cx*2+2,cy*2+1)) ){ cnt++;}
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
				bd.sErC([i],1); result = false;
			}
		}
		return result;
	},

	//---------------------------------------------------------------------------
	// ans.checkOneNumber()      �����̒���func==true�𖞂���Cell�̐���eval()==true���ǂ����𒲂ׂ�
	//                           ������func==true�ɂȂ�Z���̐��̔���A�����ɂ��鐔���ƍ��}�X�̐��̔�r�A
	//                           ���}�X�̖ʐςƓ����Ă��鐔���̔�r�Ȃǂɗp������
	// ans.checkBlackCellCount() �̈���̐����ƍ��}�X�̐��������������肷��
	// ans.checkDisconnectLine() �����ȂǂɌq�����Ă��Ȃ����̔�����s��
	// ans.checkNumberAndSize()  �G���A�ɂ��鐔���Ɩʐς������������肷��
	// ans.checkQnumsInArea()    �����ɐ����������܂܂�Ă��邩�̔�����s��
	// ans.checkBlackCellInArea()�����ɂ��鍕�}�X�̐��̔�����s��
	// ans,checkNoObjectInRoom() �G���A�Ɏw�肳�ꂽ�I�u�W�F�N�g���Ȃ��Ɣ��肷��
	//
	// ans.getQnumCellInArea()   �����̒��ň�ԍ���ɂ��鐔����Ԃ�
	// ans.getCntOfRoom()        �����̖ʐς�Ԃ�
	// ans.getCellsOfRoom()      �����̒���func==true�ƂȂ�Z���̐���Ԃ�
	//---------------------------------------------------------------------------
	checkOneNumber : function(cinfo, evalfunc, func){
		var result = true;
		for(var id=1;id<=cinfo.max;id++){
			var top = bd.QnC(k.isOneNumber ? area.getTopOfRoomByCell(cinfo.room[id].idlist[0]) : this.getQnumCellInArea(cinfo,id));
			if( evalfunc(top, this.getCellsOfRoom(cinfo, id, func)) ){
				if(this.inAutoCheck){ return false;}
				if(this.performAsLine){ if(result){ bd.sErBAll(2);} this.setErrLareaById(cinfo,id,1);}
				else{ bd.sErC(cinfo.room[id].idlist,(k.puzzleid!="tateyoko"?1:4));}
				result = false;
			}
		}
		return result;
	},
	checkBlackCellCount  : function(cinfo)          { return this.checkOneNumber(cinfo, function(top,cnt){ return (top>=0 && top!=cnt);}, bd.isBlack);},
	checkDisconnectLine  : function(cinfo)          { return this.checkOneNumber(cinfo, function(top,cnt){ return (top==-1 && cnt==0); }, bd.isNum  );},
	checkNumberAndSize   : function(cinfo)          { return this.checkOneNumber(cinfo, function(top,cnt){ return (top> 0 && top!=cnt);}, f_true    );},
	checkQnumsInArea     : function(cinfo, func)    { return this.checkOneNumber(cinfo, function(top,cnt){ return func(cnt);},            bd.isNum  );},
	checkBlackCellInArea : function(cinfo, func)    { return this.checkOneNumber(cinfo, function(top,cnt){ return func(cnt);},            bd.isBlack);},
	checkNoObjectInRoom  : function(cinfo, getvalue){ return this.checkOneNumber(cinfo, function(top,cnt){ return (cnt==0); },            function(c){ return getvalue(c)!=-1;} );},

	getQnumCellInArea : function(cinfo, areaid){
		var idlist = cinfo.room[areaid].idlist;
		for(var i=0,len=idlist.length;i<len;i++){
			if(bd.QnC(idlist[i])!=-1){ return idlist[i];}
		}
		return -1;
	},
	getCntOfRoom : function(cinfo, areaid){
		return cinfo.room[areaid].idlist.length;
	},
	getCellsOfRoom : function(cinfo, areaid, func){
		var cnt=0, idlist = cinfo.room[areaid].idlist;
		for(var i=0,len=idlist.length;i<len;i++){ if(func(idlist[i])){ cnt++;}}
		return cnt;
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
			var cc1=bd.cc1(id), cc2=bd.cc2(id);
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
			var cc1 = bd.cc1(id), cc2 = bd.cc2(id);
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
			for(var c=0;c<k.qcols*k.qrows;c++){
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
	// ans.checkLcntCross()      �����_�Ƃ̎���l�����̋��E���̐��𔻒肷��(bp==1:���_���ł���Ă���ꍇ)
	// ans.setCrossBorderError() �����_�Ƃ��̎���l�����ɃG���[�t���O��ݒ肷��
	//---------------------------------------------------------------------------
	checkLcntCross : function(val, bp){
		var result = true;
		for(var i=0;i<(k.qcols+1)*(k.qrows+1);i++){
			var cx = i%(k.qcols+1), cy = mf(i/(k.qcols+1));
			if(k.isoutsidecross==0 && k.isborderAsLine==0 && (cx==0||cy==0||cx==k.qcols||cy==k.qrows)){ continue;}
			var lcnts = (!k.isborderAsLine?area.lcnt[i]:line.lcnt[i]);
			if(lcnts==val && (bp==0 || (bp==1&&bd.QnX(bd.xnum(cx, cy))==1) || (bp==2&&bd.QnX(bd.xnum(cx, cy))!=1) )){
				if(this.inAutoCheck){ return false;}
				if(result){ bd.sErBAll(2);}
				this.setCrossBorderError(cx,cy);
				result = false;
			}
		}
		return result;
	},
	setCrossBorderError : function(cx,cy){
		if(k.iscross){ bd.sErX([bd.xnum(cx, cy)], 1);}
		bd.sErB([bd.bnum(cx*2,cy*2-1),bd.bnum(cx*2,cy*2+1),bd.bnum(cx*2-1,cy*2),bd.bnum(cx*2+1,cy*2)], 1);
	}
};

//---------------------------------------------------------------------------
// ��UndoManager�N���X ������������AUndo/Redo�̓������������
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

// UndoManager�N���X
UndoManager = function(){
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
	this.range = { x1:k.qcols+1, y1:k.qrows+1, x2:-2, y2:-2};
};
UndoManager.prototype = {
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
		else if(old==num){ return;}

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
		this.range = { x1:k.qcols+1, y1:k.qrows+1, x2:-2, y2:-2};
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
		this.range = { x1:k.qcols+1, y1:k.qrows+1, x2:-2, y2:-2};
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
			base.resetInfo(false);
			base.resize_canvas();
		}
		else{
			pc.paint(this.range.x1, this.range.y1, this.range.x2, this.range.y2);
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
			this.paintStack(bd.cell[ope.id].cx, bd.cell[ope.id].cy, bd.cell[ope.id].cx, bd.cell[ope.id].cy);
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
			this.paintStack(bd.cross[ope.id].cx-1, bd.cross[ope.id].cy-1, bd.cross[ope.id].cx, bd.cross[ope.id].cy);
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
			this.disableInfo();
			if     (pp == 'expandup'){ if(num==1){ menu.ex.expand(k.UP);}else{ menu.ex.reduce(k.UP);} }
			else if(pp == 'expanddn'){ if(num==1){ menu.ex.expand(k.DN);}else{ menu.ex.reduce(k.DN);} }
			else if(pp == 'expandlt'){ if(num==1){ menu.ex.expand(k.LT);}else{ menu.ex.reduce(k.LT);} }
			else if(pp == 'expandrt'){ if(num==1){ menu.ex.expand(k.RT);}else{ menu.ex.reduce(k.RT);} }
			else if(pp == 'reduceup'){ if(num==1){ menu.ex.reduce(k.UP);}else{ menu.ex.expand(k.UP);} }
			else if(pp == 'reducedn'){ if(num==1){ menu.ex.reduce(k.DN);}else{ menu.ex.expand(k.DN);} }
			else if(pp == 'reducelt'){ if(num==1){ menu.ex.reduce(k.LT);}else{ menu.ex.expand(k.LT);} }
			else if(pp == 'reducert'){ if(num==1){ menu.ex.reduce(k.RT);}else{ menu.ex.expand(k.RT);} }

			else if(pp == 'flipy'){ menu.ex.turnflip(1,{x1:0,y1:0,x2:k.qcols-1,y2:k.qrows-1});}
			else if(pp == 'flipx'){ menu.ex.turnflip(2,{x1:0,y1:0,x2:k.qcols-1,y2:k.qrows-1});}
			else if(pp == 'turnr'){ menu.ex.turnflip((num==1?3:4),{x1:0,y1:0,x2:k.qcols-1,y2:k.qrows-1}); }
			else if(pp == 'turnl'){ menu.ex.turnflip((num==1?4:3),{x1:0,y1:0,x2:k.qcols-1,y2:k.qrows-1}); }

			this.range = { x1:0, y1:0, x2:k.qcols-1, y2:k.qrows-1};
			this.reqReset = true;
		}
	},
	//---------------------------------------------------------------------------
	// um.paintBorder()  Border�̎����`�悷�邽�߁A�ǂ͈̔͂܂ŕύX�����������L�����Ă���
	// um.paintStack()   �ύX���������͈͂�Ԃ�
	//---------------------------------------------------------------------------
	paintBorder : function(id){
		if(isNaN(id) || !bd.border[id]){ return;}
		if(bd.border[id].cx%2==1){
			this.paintStack((bd.border[id].cx>>1)-1, (bd.border[id].cy>>1)-1,
							(bd.border[id].cx>>1)+1, (bd.border[id].cy>>1)   );
		}
		else{
			this.paintStack((bd.border[id].cx>>1)-1, (bd.border[id].cy>>1)-1,
							(bd.border[id].cx>>1)  , (bd.border[id].cy>>1)+1 );
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
	this.language = 'ja';

	// ElementTemplate : ���j���[�̈�
	var menu_funcs = {mouseover : ee.ebinder(this, this.menuhover), mouseout  : ee.ebinder(this, this.menuout)};
	this.EL_MENU  = ee.addTemplate('menupanel','div', {className:'menu'}, {marginRight:'4pt'}, menu_funcs);

	// ElementTemplate : �t���[�g���j���[
	var float_funcs = {mouseout:ee.ebinder(this, this.floatmenuout)};
	this.EL_FLOAT = ee.addTemplate('float_parent','div', {className:'floatmenu'}, {zIndex:101, backgroundColor:base.floatbgcolor}, float_funcs);

	// ElementTemplate : �t���[�g���j���[(���g)
	var smenu_funcs  = {mouseover: ee.ebinder(this, this.submenuhover), mouseout: ee.ebinder(this, this.submenuout), click:ee.ebinder(this, this.submenuclick)};
	var select_funcs = {mouseover: ee.ebinder(this, this.submenuhover), mouseout: ee.ebinder(this, this.submenuout)};
	this.EL_SMENU    = ee.addTemplate('','div' , {className:'smenu'}, null, smenu_funcs);
	this.EL_SELECT   = ee.addTemplate('','div' , {className:'smenu'}, {fontWeight :'900', fontSize:'10pt'}, select_funcs);
	this.EL_SEPARATE = ee.addTemplate('','div' , {className:'smenusep', innerHTML:'&nbsp;'}, null, null);
	this.EL_CHECK    = ee.addTemplate('','div' , {className:'smenu'}, {paddingLeft:'6pt', fontSize:'10pt'}, smenu_funcs);
	this.EL_LABEL    = ee.addTemplate('','span', null, {color:'white'}, null);
	this.EL_CHILD = this.EL_CHECK;

	// ElementTemplate : �Ǘ��̈�
	this.EL_DIVPACK  = ee.addTemplate('','div',  null, null, null);
	this.EL_SPAN     = ee.addTemplate('','span', {unselectable:'on'}, null, null);
	this.EL_CHECKBOX = ee.addTemplate('','input',{type:'checkbox', check:''}, null, {click:ee.ebinder(this, this.checkclick)});
	this.EL_SELCHILD = ee.addTemplate('','div',  {className:'flag',unselectable:'on'}, null, {click:ee.ebinder(this, this.selectclick)});

	// ElementTemplate : �{�^��
	this.EL_BUTTON = ee.addTemplate('','input', {type:'button'}, null, null);
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
		ee('btnarea').removeNextAll(ee('btnclear2').el);

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

		case pp.SMENU: case pp.LABEL:
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
				manage.el.className = (issel?"flagsel":"flag");
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
			as = ee.binder(pp, pp.addSmenu),
			au = ee.binder(pp, pp.addSelect),
			ac = ee.binder(pp, pp.addCheck),
			aa = ee.binder(pp, pp.addCaption),
			ai = ee.binder(pp, pp.addChild),
			ap = ee.binder(pp, pp.addSeparator),
			sl = ee.binder(pp, pp.setLabel);

		// *�t�@�C�� ==========================================================
		am('file', "�t�@�C��", "File");

		as('newboard', 'file', '�V�K�쐬','New Board');
		as('urlinput', 'file', 'URL����', 'Import from URL');
		as('urloutput','file', 'URL�o��', 'Export URL');
		ap('sep_2', 'file');
		as('fileopen', 'file', '�t�@�C�����J��','Open the file');
		as('filesave', 'file', '�t�@�C���ۑ�',  'Save the file as ...');
		if(!!fio.DBtype){
			as('database', 'file', '�f�[�^�x�[�X�̊Ǘ�', 'Database Management');
		}
		if(k.isKanpenExist && (k.puzzleid!=="nanro" && k.puzzleid!=="ayeheya" && k.puzzleid!=="kurochute")){
			ap('sep_3', 'file');
			as('fileopen2', 'file', 'pencilbox�̃t�@�C�����J��', 'Open the pencilbox file');
			as('filesave2', 'file', 'pencilbox�̃t�@�C����ۑ�', 'Save the pencilbox file as ...');
		}

		// *�ҏW ==============================================================
		am('edit', "�ҏW", "Edit");

		as('adjust', 'edit', '�Ֆʂ̒���', 'Adjust the Board');
		as('turn',   'edit', '���]�E��]', 'Filp/Turn the Board');

		// *�\�� ==============================================================
		am('disp', "�\��", "Display");

		au('size','disp',k.widthmode,[0,1,2,3,4], '�\���T�C�Y','Cell Size');
		ap('sep_4',  'disp');

		if(!!k.irowake){
			ac('irowake','disp',(k.irowake==2?true:false),'���̐F����','Color coding');
			sl('irowake', '���̐F����������', 'Color each lines');
			ap('sep_5', 'disp');
		}
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

		// *�ݒ� ==============================================================
		am('setting', "�ݒ�", "Setting");

		if(k.EDITOR){
			au('mode','setting',(k.editmode?1:3),[1,3],'���[�h', 'mode');
			sl('mode','���[�h', 'mode');
		}

		puz.menufix();	// �e�p�Y�����Ƃ̃��j���[�ǉ�

		ac('autocheck','setting', k.autocheck, '������������', 'Auto Answer Check');
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
		aa('cap_others1', 'other', '�����N', 'Link');
		as('jumpv3',  'other', '�ς��Ղ�v3�̃y�[�W��', 'Jump to PUZ-PRE v3 page');
		as('jumptop', 'other', '�A�����j�ۊǌ�TOP��',  'Jump to indi.s58.xrea.com');
		as('jumpblog','other', '�͂��ϓ��L(blog)��',   'Jump to my blog');
		//sm('eval', '�e�X�g�p', 'for Evaluation');

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
	//---------------------------------------------------------------------------
	createAllFloat : function(){
		for(var i=0;i<pp.flaglist.length;i++){
			var id = pp.flaglist[i];
			if(!pp.flags[id]){ continue;}

			var smenuid = 'ms_'+id;
			switch(pp.type(id)){
				case pp.MENU:     smenu = ee.createEL(this.EL_MENU,    smenuid); continue; break;
				case pp.SEPARATE: smenu = ee.createEL(this.EL_SEPARATE,smenuid); break;
				case pp.LABEL:    smenu = ee.createEL(this.EL_LABEL,   smenuid); break;
				case pp.SELECT:   smenu = ee.createEL(this.EL_SELECT,  smenuid); break;
				case pp.SMENU:    smenu = ee.createEL(this.EL_SMENU,   smenuid); break;
				case pp.CHECK:    smenu = ee.createEL(this.EL_CHECK,   smenuid); break;
				case pp.CHILD:    smenu = ee.createEL(this.EL_CHILD,   smenuid); break;
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
				ee(ee.createEL(this.EL_SEPARATE,'')).insertBefore(node);
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
		if(pp.flags[idname] && pp.type(idname)===pp.SELECT){ this.floatmenuopen(e,idname,this.dispfloat.length);}
	},
	submenuout   : function(e){
		var idname = ee.getSrcElement(e).id.substr(3);
		if(ee.getSrcElement(e).className==="smenusel"){ ee.getSrcElement(e).className="smenu";}
		if(pp.flags[idname] && pp.type(idname)===pp.SELECT){ this.floatmenuout(e);}
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
			_float.style.left = rect.left - 3 + k.IEMargin.x;
			_float.style.top  = rect.bottom + (k.br.IE?-2:1);
		}
		else{
			_float.style.left = rect.right - 2;
			_float.style.top  = rect.top + (k.br.IE?-5:-2);
		}
		_float.style.zIndex   = 101+depth;
		_float.style.display  = 'inline';

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
		pp.setVal(idname, el.checked);
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
		btt('kanpen',     "�J���y����URL���o�͂���",             "Output Kanpen URL",              !!k.isKanpenExist);
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
		func = ee.ebinder(fio, fio.clickHandler);
		lab(ee('bar1_8').el, "�f�[�^�x�[�X�̊Ǘ�", "Database Management");
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
			_pop.style.left = ee.pageX(e) - 8 + k.IEMargin.x;
			_pop.style.top  = ee.pageY(e) - 8 + k.IEMargin.y;
			_pop.style.display = 'inline';
		}
	},
	popclose : function(){
		if(this.pop){
			this.pop.el.style.display = "none";
			this.pop = '';
			this.menuclear();
			this.movingpop = "";
			k.enableKey = true;
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
			pop.style.left = ee.pageX(e) - this.offset.x;
			pop.style.top  = ee.pageY(e) - this.offset.y;
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
	// pp.addSmenu()     Popup���j���[���J���T�u���j���[���ڂ�o�^����
	// pp.addCaption()   Caption�Ƃ��Ďg�p����T�u���j���[���ڂ�o�^����
	// pp.addSeparator() �Z�p���[�^�Ƃ��Ďg�p����T�u���j���[���ڂ�o�^����
	// pp.addCheck()     �I���^�T�u���j���[���ڂɕ\�����镶�����ݒ肷��
	// pp.addSelect()    �`�F�b�N�^�T�u���j���[���ڂɕ\�����镶�����ݒ肷��
	// pp.addChild()     �`�F�b�N�^�T�u���j���[���ڂ̎q�v�f��ݒ肷��
	//---------------------------------------------------------------------------
	addMenu : function(idname, strJP, strEN){
		this.addFlags(idname, '', this.MENU, 0, strJP, strEN);
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
	setVal : function(idname, newval){
		if(!this.flags[idname]){ return;}
		else if(this.flags[idname].type===this.CHECK || this.flags[idname].type===this.SELECT){
			this.flags[idname].val = newval;
			menu.setdisplay(idname);
			if(this.funcs[idname]){ this.funcs[idname](newval);}
		}
	},

//--------------------------------------------------------------------------------------------------------------
	// submenu����Ăяo�����֐�����
	funcs : {
		urlinput  : function(){ menu.pop = ee("pop1_2");},
		urloutput : function(){ menu.pop = ee("pop1_3"); document.urloutput.ta.value = "";},
		filesave  : function(){ menu.ex.filesave(1);},
		database  : function(){ menu.pop = ee("pop1_8"); fio.getDataTableList();},
		filesave2 : function(){ if(fio.kanpenSave){ menu.ex.filesave(2);}},
		adjust    : function(){ menu.pop = ee("pop2_1");},
		turn      : function(){ menu.pop = ee("pop2_2");},
		credit    : function(){ menu.pop = ee("pop3_1");},
		jumpv3    : function(){ window.open('./', '', '');},
		jumptop   : function(){ window.open('../../', '', '');},
		jumpblog  : function(){ window.open('http://d.hatena.ne.jp/sunanekoroom/', '', '');},
		irowake   : function(){ pc.paintAll();},
		manarea   : function(){ menu.ex.dispman();},
		autocheck : function(val){ k.autocheck = !k.autocheck;},
		mode      : function(num){ menu.ex.modechange(num);},
		size      : function(num){ k.widthmode=num; base.resize_canvas();},
		repaint   : function(num){ base.resize_canvas();},
		use       : function(num){ k.use =num;},
		language  : function(num){ menu.setLang({0:'ja',1:'en'}[num]);},

		newboard : function(){
			menu.pop = ee("pop1_1");
			if(k.puzzleid!="sudoku"){
				document.newboard.col.value = k.qcols;
				document.newboard.row.value = k.qrows;
			}
			k.enableKey = false;
		},
		fileopen : function(){
			document.fileform.pencilbox.value = "0";
			if(k.br.IE || k.br.Gecko || k.br.Opera){ if(!menu.pop){ menu.pop = ee("pop1_4");}}
			else{ if(!menu.pop){ document.fileform.filebox.click();}}
		},
		fileopen2 : function(){
			if(!fio.kanpenOpen){ return;}
			document.fileform.pencilbox.value = "1";
			if(k.br.IE || k.br.Gecko || k.br.Opera){ if(!menu.pop){ menu.pop = ee("pop1_4");}}
			else{ if(!menu.pop){ document.fileform.filebox.click();}}
		},
		dispsize : function(){
			menu.pop = ee("pop4_1");
			document.dispsize.cs.value = k.def_csize;
			k.enableKey = false;
		},
		keypopup : function(){
			var f = kp.ctl[pp.flags['mode'].val].enable;
			ee('ck_keypopup').el.disabled    = (f?"":"true");
			ee('cl_keypopup').el.style.color = (f?"black":"silver");
		}
	}
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
};
MenuExec.prototype = {
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
				case "pzprv3":     document.urloutput.ta.value = enc.pzloutput(0); break;
				case "pzprapplet": document.urloutput.ta.value = enc.pzloutput(1); break;
				case "kanpen":     document.urloutput.ta.value = enc.pzloutput(2); break;
				case "pzprv3edit": document.urloutput.ta.value = enc.pzloutput(3); break;
				case "heyaapp":    document.urloutput.ta.value = enc.pzloutput(4); break;
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
	// menu.ex.fileopen()  �t�@�C�����J��
	// menu.ex.filesave()  �t�@�C����ۑ�����
	//------------------------------------------------------------------------------
	fileopen : function(e){
		if(menu.pop){ menu.popclose();}
		if(document.fileform.filebox.value){
			document.fileform.submit();
			document.fileform.filebox.value = "";
			tm.reset();
		}
	},

	filesave : function(type){
		var fname = prompt("�ۑ�����t�@�C��������͂��ĉ������B", k.puzzleid+".txt");
		if(!fname){ return;}
		var prohibit = ['\\', '/', ':', '*', '?', '"', '<', '>', '|'];
		for(var i=0;i<prohibit.length;i++){ if(fname.indexOf(prohibit[i])!=-1){ alert('�t�@�C�����Ƃ��Ďg�p�ł��Ȃ��������܂܂�Ă��܂��B'); return;} }

		document.fileform2.filename.value = fname;

		if     (navigator.platform.indexOf("Win")!==-1){ document.fileform2.platform.value = "Win";}
		else if(navigator.platform.indexOf("Mac")!==-1){ document.fileform2.platform.value = "Mac";}
		else                                           { document.fileform2.platform.value = "Others";}

		document.fileform2.ques.value   = fio.fileencode(type);
		document.fileform2.urlstr.value = fio.urlstr;

		document.fileform2.submit();
	},

	//------------------------------------------------------------------------------
	// menu.ex.dispsize()  Canvas�ł̃}�X�ڂ̕\���T�C�Y��ύX����
	//------------------------------------------------------------------------------
	dispsize : function(e){
		if(menu.pop){
			var csize = parseInt(document.dispsize.cs.value);

			if(csize>0){
				k.def_psize = mf(csize*(k.def_psize/k.def_csize));
				if(k.def_psize===0){ k.def_psize=1;}
				k.def_csize = mf(csize);
			}
			menu.popclose();
			base.resize_canvas();	// Canvas���X�V����
		}
	},

	//---------------------------------------------------------------------------
	// menu.ex.irowakeRemake() �u�F�������Ȃ����v�{�^�������������ɐF�������Ȃ���
	//---------------------------------------------------------------------------
	irowakeRemake : function(){
		if(!pp.getVal('irowake')){ return;}

		for(var i=1;i<=line.data.max;i++){
			var idlist = line.data[i].idlist;
			if(idlist.length>0){
				var newColor = pc.getNewLineColor();
				for(n=0;n<idlist.length;n++){
					bd.border[idlist[n]].color = newColor;
				}
			}
		}
		pc.paint(0,0,k.qcols-1,k.qrows-1);
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

		base.resize_canvas_only();	// canvas�̍�����W�����X�V
		bd.setposAll();	// �e�Z����px,py���W���X�V

		if(g.vml){ pc.flushCanvasAll();}	// VML�̈ʒu�������̂ŏ����Ȃ��ƁB�B
		pc.paintAll();	// �ĕ`��
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
				else if(name==="reducelt"||name==="reducedn"){
					if(k.qcols<=1 && k.puzzleid!=="tawa"){ return;}
					else if(k.qcols<=1 && k.puzzleid==="tawa" && bd.lap!==3){ return;}
				}
			}

			um.disableInfo();
			switch(name){
				case "expandup": this.expand(k.UP); break;
				case "expanddn": this.expand(k.DN); break;
				case "expandlt": this.expand(k.LT); break;
				case "expandrt": this.expand(k.RT); break;
				case "reduceup": this.reduce(k.UP); break;
				case "reducedn": this.reduce(k.DN); break;
				case "reducelt": this.reduce(k.LT); break;
				case "reducert": this.reduce(k.RT); break;

				case "turnl": this.turnflip(4,{x1:0,y1:0,x2:k.qcols-1,y2:k.qrows-1}); break;
				case "turnr": this.turnflip(3,{x1:0,y1:0,x2:k.qcols-1,y2:k.qrows-1}); break;
				case "flipy": this.turnflip(1,{x1:0,y1:0,x2:k.qcols-1,y2:k.qrows-1}); break;
				case "flipx": this.turnflip(2,{x1:0,y1:0,x2:k.qcols-1,y2:k.qrows-1}); break;
			}
			um.enableInfo();

			// reduce�͂����K�{
			um.addOpe(k.BOARD, name, 0, 0, 1);

			if(!um.undoExec){ base.resetInfo(false);}
			base.resize_canvas();				// Canvas���X�V����
		}
	},

	//------------------------------------------------------------------------------
	// menu.ex.expand()       �Ֆʂ̊g������s����
	// menu.ex.expandGroup()  �I�u�W�F�N�g�̒ǉ����s��
	// menu.ex.reduce()       �Ֆʂ̏k�������s����
	// menu.ex.reduceGroup()  �I�u�W�F�N�g�̏������s��
	//------------------------------------------------------------------------------
	expand : function(key){
		this.adjustSpecial(5,key);
		this.adjustGeneral(5,'',{x1:0,y1:0,x2:k.qcols-1,y2:k.qrows-1});

		var number;
		if     (key===k.UP||key===k.DN){ number=k.qcols; k.qrows++; tc.maxy+=2;}
		else if(key===k.LT||key===k.RT){ number=k.qrows; k.qcols++; tc.maxx+=2;}

		var func;
		{
			func = function(id){ return (menu.ex.distObj(key,k.CELL,id)===0);};
			this.expandGroup(k.CELL, bd.cell, number, func);
		}
		if(k.iscross){
			var oc = k.isoutsidecross?0:1;
			func = function(id){ return (menu.ex.distObj(key,k.CROSS,id)===oc);};
			this.expandGroup(k.CROSS, bd.cross, number+1, func);
		}
		if(k.isborder){
			bd.bdinside = 2*k.qcols*k.qrows-(k.qcols+k.qrows);

			func = function(id){ var m=menu.ex.distObj(key,k.BORDER,id); return (m===1||m===2);};
			this.expandGroup(k.BORDER, bd.border, 2*number+(k.isoutsideborder===0?-1:1), func);

			// �g�厞�ɁA���E���͐L�΂����Ⴂ�܂��B
			if(k.isborderAsLine===0){ this.expandborder(key);}
			else{ this.expandborderAsLine(key);}
		}
		if(k.isextendcell!==0){
			func = function(id){ return (menu.ex.distObj(key,k.EXCELL,id)===0);};
			this.expandGroup(k.EXCELL, bd.excell, k.isextendcell, func);
		}

		bd.setposAll();

		this.adjustSpecial2(5,key);
	},
	expandGroup : function(type,group,margin,insfunc){
		for(var len=group.length,i=len;i<len+margin;i++){ group.push(bd.getnewObj(type,i));}
		this.setposObj(type);
		for(var i=group.length-1;i>=0;i--){
			if(insfunc(i)){
				group[i] = bd.getnewObj(type,i);
				margin--;
			}
			else if(margin>0){ group[i] = group[i-margin];}
		}
	},

	reduce : function(key){
		this.adjustSpecial(6,key);
		this.adjustGeneral(6,'',{x1:0,y1:0,x2:k.qcols-1,y2:k.qrows-1});

		var func, margin;
		{
			this.qnums = [];
			func = function(id){ return (menu.ex.distObj(key,k.CELL,id)===0);};
			margin = this.reduceGroup(k.CELL, bd.cell, func);
		}
		if(k.iscross){
			var oc = k.isoutsidecross?0:1;
			func = function(id){ return (menu.ex.distObj(key,k.CROSS,id)===oc);};
			margin = this.reduceGroup(k.CROSS, bd.cross, func);
		}
		if(k.isborder){
			if(k.isborderAsLine===1){ this.reduceborderAsLine(key);}

			if     (key===k.UP||key===k.DN){ bd.bdinside = 2*k.qcols*(k.qrows-1)-(k.qcols+k.qrows-1);}
			else if(key===k.LT||key===k.RT){ bd.bdinside = 2*(k.qcols-1)*k.qrows-(k.qcols+k.qrows-1);}

			func = function(id){ var m=menu.ex.distObj(key,k.BORDER,id); return (m===1||m===2);};
			margin = this.reduceGroup(k.BORDER, bd.border, func);
		}
		if(k.isextendcell!==0){
			func = function(id){ return (menu.ex.distObj(key,k.EXCELL,id)===0);};
			margin = this.reduceGroup(k.EXCELL, bd.excell, func);
		}

		if     (key===k.UP||key===k.DN){ k.qrows--; tc.maxy-=2;}
		else if(key===k.LT||key===k.RT){ k.qcols--; tc.maxx-=2;}

		bd.setposAll();
		if(k.isOneNumber){
			area.resetArea();
			for(var i=0;i<this.qnums.length;i++){
				bd.sQnC(area.getTopOfRoom(this.qnums[i].areaid), this.qnums[i].val);
			}
		}

		this.adjustSpecial2(6,key);
	},
	reduceGroup : function(type,group,exfunc){
		var margin=0;
		for(var i=0;i<group.length;i++){
			if(exfunc(i)){
				bd.hideNumobj(type,i);
				if(!bd.isNullObj(type,i)){ um.addObj(type,i);}
				margin++;

				if(type===k.CELL && k.isOneNumber){
					if(bd.QnC(i)!==-1){ this.qnums.push({ areaid:area.getRoomID(i), val:bd.QnC(i)});}
					//area.setRoomID(i, -1);
				}
			}
			else if(margin>0){ group[i-margin] = group[i];}
		}
		for(var i=0;i<margin;i++){ group.pop();}

		return margin;
	},

	//------------------------------------------------------------------------------
	// menu.ex.turnflip()      ��]�E���]���������s����
	// menu.ex.turnflipGroup() turnflip()��������I�ɌĂ΂���]���s��
	//------------------------------------------------------------------------------
	turnflip : function(type,d){
		d.xx = (d.x1+d.x2); d.yy = (d.y1+d.y2);

		this.adjustSpecial(type,'');
		this.adjustGeneral(type,'',d);

		if(type===3||type===4){
			var tmp = k.qcols; k.qcols = k.qrows; k.qrows = tmp;
			tmp = tc.maxx; tc.maxx = tc.maxy; tc.maxy = tmp;
			bd.setposAll();
		}

		var func;
		{
			if     (type===1){ func = function(d,id){ return bd.cnum(bd.cell[id].cx, d.yy-bd.cell[id].cy);}; }
			else if(type===2){ func = function(d,id){ return bd.cnum(d.xx-bd.cell[id].cx, bd.cell[id].cy);}; }
			else if(type===3){ func = function(d,id){ return bd.cnum2(bd.cell[id].cy, d.yy-bd.cell[id].cx, k.qrows, k.qcols);}; }
			else if(type===4){ func = function(d,id){ return bd.cnum2(d.xx-bd.cell[id].cy, bd.cell[id].cx, k.qrows, k.qcols);}; }
			this.turnflipGroup(d, bd.cell, k.qcols*k.qrows, func);
		}
		if(k.iscross){
			if     (type===1){ func = function(d,id){ return bd.xnum(bd.cross[id].cx, (d.yy+1)-bd.cross[id].cy);}; }
			else if(type===2){ func = function(d,id){ return bd.xnum((d.xx+1)-bd.cross[id].cx, bd.cross[id].cy);}; }
			else if(type===3){ func = function(d,id){ return bd.xnum2(bd.cross[id].cy, (d.yy+1)-bd.cross[id].cx, k.qrows, k.qcols);}; }
			else if(type===4){ func = function(d,id){ return bd.xnum2((d.xx+1)-bd.cross[id].cy, bd.cross[id].cx, k.qrows, k.qcols);}; }
			this.turnflipGroup(d, bd.cross, (k.qcols+1)*(k.qrows+1), func);
		}
		if(k.isborder){
			if     (type===1){ func = function(d,id){ return bd.bnum(bd.border[id].cx, (d.yy+1)*2-bd.border[id].cy);}; }
			else if(type===2){ func = function(d,id){ return bd.bnum((d.xx+1)*2-bd.border[id].cx, bd.border[id].cy);}; }
			else if(type===3){ func = function(d,id){ return bd.bnum2(bd.border[id].cy, (d.yy+1)*2-bd.border[id].cx, k.qrows, k.qcols);}; }
			else if(type===4){ func = function(d,id){ return bd.bnum2((d.xx+1)*2-bd.border[id].cy, bd.border[id].cx, k.qrows, k.qcols);}; }
			this.turnflipGroup(d, bd.border, bd.bdinside+(k.isoutsideborder===0?0:2*(k.qcols+k.qrows)), func);
		}
		if(k.isextendcell===2){
			if     (type===1){ func = function(d,id){ return bd.exnum(bd.excell[id].cx, d.yy-bd.excell[id].cy);}; }
			else if(type===2){ func = function(d,id){ return bd.exnum(d.xx-bd.excell[id].cx, bd.excell[id].cy);}; }
			else if(type===3){ func = function(d,id){ return bd.exnum2(bd.excell[id].cy, d.yy-bd.excell[id].cx, k.qrows, k.qcols);}; }
			else if(type===4){ func = function(d,id){ return bd.exnum2(d.xx-bd.excell[id].cy, bd.excell[id].cx, k.qrows, k.qcols);}; }
			this.turnflipGroup(d, bd.excell, 2*(k.qcols+k.qrows)+4, func);
		}
		else if(k.isextendcell===1 && (type===1 || type===2)){
			if(type===1){
				for(var cy=d.y1;cy<d.yy/2;cy++){
					var c = bd.excell[bd.exnum(-1,cy)];
					bd.excell[bd.exnum(-1,cy)] = bd.excell[bd.exnum(-1,d.yy-cy)];
					bd.excell[bd.exnum(-1,d.yy-cy)] = c;
				}
			}
			else if(type===2){
				for(var cx=d.x1;cx<d.xx/2;cx++){
					var c = bd.excell[bd.exnum(cx,-1)];
					bd.excell[bd.exnum(cx,-1)] = bd.excell[bd.exnum(d.xx-cx,-1)];
					bd.excell[bd.exnum(d.xx-cx,-1)] = c;
				}
			}
		}

		bd.setposAll();
		this.adjustSpecial2(type,'');
	},
	turnflipGroup : function(d,group,maxcnt,getnext){
		var ch = []; for(var i=0;i<maxcnt;i++){ ch[i]=1;}
		for(var source=0;source<maxcnt;source++){
			if(ch[source]===0){ continue;}
			var tmp = group[source], target = source;
			while(ch[target]!==0){
				ch[target]=0;
				var next = getnext(d,target);

				if(ch[next]!==0){
					group[target] = group[next];
					target = next;
				}
				else{
					group[target] = tmp;
				}
			}
		}
	},

	//---------------------------------------------------------------------------
	// menu.ex.expandborder()       �Ֆʂ̊g�厞�A���E����L�΂�
	// menu.ex.expandborderAsLine() borderAsLine==1�ȃp�Y���̔Ֆʊg�厞�ɐ����ړ�����
	// menu.ex.reduceborderAsLine() borderAsLine==1�ȃp�Y���̔Ֆʏk�����ɐ����ړ�����
	// menu.ex.copyData()           �w�肵���f�[�^���R�s�[����
	//---------------------------------------------------------------------------
	expandborder : function(key){
		if(um.undoExec){ return;} // Undo���́A��ŃI�u�W�F�N�g��������̂ŉ��̏����̓p�X

		bd.setposBorders();
		for(var i=0;i<bd.bdmax;i++){
			if(this.distObj(key,k.BORDER,i)!==1){ continue;}

			var source = this.innerBorder(key,i);
			bd.border[i].ques  = bd.border[source].ques;
			bd.border[i].qans  = bd.border[source].qans;
		}
	},
	// m==0||m==1�Œ��ڈړ��ł����������ǁAexpandGroup()�ƕʂ�
	// �֐����K�v������̂Ŗ������ړ�������
	expandborderAsLine : function(key){
		bd.setposBorders();
		for(var i=0;i<bd.bdmax;i++){
			if(this.distObj(key,k.BORDER,i)!==2){ continue;}

			var source = this.outerBorder(key,i);
			this.copyData(i,source);
			bd.border[source].allclear(source);
		}
	},
	// borderAsLine���̖�����肪�Ȃ�Ƃ�����Ƃ�
	reduceborderAsLine : function(key){
		for(var i=0;i<bd.bdmax;i++){
			if(this.distObj(key,k.BORDER,i)!==0){ continue;}

			var source = this.innerBorder(key,i);
			this.copyData(i,source);
		}
	},
	copyData : function(id1,id2){
		bd.border[id1].qans  = bd.border[id2].qans;
		bd.border[id1].qsub  = bd.border[id2].qsub;
		bd.border[id1].ques  = bd.border[id2].ques;
		bd.border[id1].color = bd.border[id2].color;
	},

	//---------------------------------------------------------------------------
	// menu.ex.innerBorder()  (expand/reduceBorder�p) �ЂƂ����ɓ�����border��id��Ԃ�
	// menu.ex.outerBorder()  (expand/reduceBorder�p) �ЂƂO���ɍs����border��id��Ԃ�
	//---------------------------------------------------------------------------
	innerBorder : function(key,id){
		var bx=bd.border[id].cx, by=bd.border[id].cy;
		if     (key===k.UP){ return bd.bnum(bx, by+2);}
		else if(key===k.DN){ return bd.bnum(bx, by-2);}
		else if(key===k.LT){ return bd.bnum(bx+2, by);}
		else if(key===k.RT){ return bd.bnum(bx-2, by);}
		return -1;
	},
	outerBorder : function(key,id){
		var bx=bd.border[id].cx, by=bd.border[id].cy;
		if     (key===k.UP){ return bd.bnum(bx, by-2);}
		else if(key===k.DN){ return bd.bnum(bx, by+2);}
		else if(key===k.LT){ return bd.bnum(bx-2, by);}
		else if(key===k.RT){ return bd.bnum(bx+2, by);}
		return -1;
	},

	//---------------------------------------------------------------------------
	// menu.ex.setposObj()  �w�肳�ꂽ�^�C�v��setpos�֐����Ăяo��
	// menu.ex.distObj()    �㉺���E�����ꂩ�̊O�g�Ƃ̋��������߂�
	//---------------------------------------------------------------------------
	setposObj : function(type){
		if     (type===k.CELL)  { bd.setposCells();}
		else if(type===k.CROSS) { bd.setposCrosses();}
		else if(type===k.BORDER){ bd.setposBorders();}
		else if(type===k.EXCELL){ bd.setposEXcells();}
	},
	distObj : function(key,type,id){
		if(type===k.CELL){
			if     (key===k.UP){ return bd.cell[id].cy;}
			else if(key===k.DN){ return (k.qrows-1)-bd.cell[id].cy;}
			else if(key===k.LT){ return bd.cell[id].cx;}
			else if(key===k.RT){ return (k.qcols-1)-bd.cell[id].cx;}
		}
		else if(type===k.CROSS){
			if     (key===k.UP){ return bd.cross[id].cy;}
			else if(key===k.DN){ return k.qrows-bd.cross[id].cy;}
			else if(key===k.LT){ return bd.cross[id].cx;}
			else if(key===k.RT){ return k.qcols-bd.cross[id].cx;}
		}
		else if(type===k.BORDER){
			if     (key===k.UP){ return bd.border[id].cy;}
			else if(key===k.DN){ return 2*k.qrows-bd.border[id].cy;}
			else if(key===k.LT){ return bd.border[id].cx;}
			else if(key===k.RT){ return 2*k.qcols-bd.border[id].cx;}
		}
		else if(type===k.EXCELL){
			if     (key===k.UP){ return bd.excell[id].cy;}
			else if(key===k.DN){ return (k.qrows-1)-bd.excell[id].cy;}
			else if(key===k.LT){ return bd.excell[id].cx;}
			else if(key===k.RT){ return (k.qcols-1)-bd.excell[id].cx;}
		}
		return -1;
	},

	//------------------------------------------------------------------------------
	// menu.ex.adjustGeneral()  ��]�E���]���Ɋe�Z���̒��߂��s��(���ʏ���)
	// menu.ex.adjustSpecial()  ��]�E���]�E�Ֆʒ��ߊJ�n�O�Ɋe�Z���̒��߂��s��(�e�p�Y���̃I�[�o�[���C�h�p)
	// menu.ex.adjustSpecial2() ��]�E���]�E�Ֆʒ��ߏI����Ɋe�Z���̒��߂��s��(�e�p�Y���̃I�[�o�[���C�h�p)
	// menu.ex.adjustQues51_1() [�_]�Z���̒���(adjustSpecial�֐��ɑ������p)
	// menu.ex.adjustQues51_2() [�_]�Z���̒���(adjustSpecial2�֐��ɑ������p)
	//------------------------------------------------------------------------------
	adjustGeneral : function(type,key,d){
		um.disableRecord();
		for(var cy=d.y1;cy<=d.y2;cy++){
			for(var cx=d.x1;cx<=d.x2;cx++){
				var c = bd.cnum(cx,cy);

				switch(type){
				case 1: // �㉺���]
					if(true){
						var val = ({2:5,3:4,4:3,5:2,104:107,105:106,106:105,107:104})[bd.QuC(c)];
						if(!isNaN(val)){ bd.sQuC(c,val);}
					}
					if(k.isextendcell!==1){
						var val = ({1:2,2:1})[bd.DiC(c)];
						if(!isNaN(val)){ bd.sDiC(c,val);}
					}
					break;
				case 2: // ���E���]
					if(true){
						var val = ({2:3,3:2,4:5,5:4,104:105,105:104,106:107,107:106})[bd.QuC(c)];
						if(!isNaN(val)){ bd.sQuC(c,val);}
					}
					if(k.isextendcell!==1){
						var val = ({3:4,4:3})[bd.DiC(c)];
						if(!isNaN(val)){ bd.sDiC(c,val);}
					}
					break;
				case 3: // �E90�����]
					if(true){
						var val = {2:5,3:2,4:3,5:4,21:22,22:21,102:103,103:102,104:107,105:104,106:105,107:106}[bd.QuC(c)];
						if(!isNaN(val)){ bd.sQuC(c,val);}
					}
					if(k.isextendcell!==1){
						var val = {1:4,2:3,3:1,4:2}[bd.DiC(c)];
						if(!isNaN(val)){ bd.sDiC(c,val);}
					}
					break;
				case 4: // ��90�����]
					if(true){
						var val = {2:3,3:4,4:5,5:2,21:22,22:21,102:103,103:102,104:105,105:106,106:107,107:104}[bd.QuC(c)];
						if(!isNaN(val)){ bd.sQuC(c,val);}
					}
					if(k.isextendcell!==1){
						var val = {1:3,2:4,3:2,4:1}[bd.DiC(c)];
						if(!isNaN(val)){ bd.sDiC(c,val);}
					}
					break;
				case 5: // �Ֆʊg��
					break;
				case 6: // �Ֆʏk��
					break;
				}
			}
		}
		um.enableRecord();
	},
	adjustQues51_1 : function(type,key){
		this.qnumw = [];
		this.qnumh = [];

		for(var cy=0;cy<=k.qrows-1;cy++){
			this.qnumw[cy] = [bd.QnE(bd.exnum(-1,cy))];
			for(var cx=0;cx<=k.qcols-1;cx++){
				if(bd.QuC(bd.cnum(cx,cy))===51){ this.qnumw[cy].push(bd.QnC(bd.cnum(cx,cy)));}
			}
		}
		for(var cx=0;cx<=k.qcols-1;cx++){
			this.qnumh[cx] = [bd.DiE(bd.exnum(cx,-1))];
			for(var cy=0;cy<=k.qrows-1;cy++){
				if(bd.QuC(bd.cnum(cx,cy))===51){ this.qnumh[cx].push(bd.DiC(bd.cnum(cx,cy)));}
			}
		}
	},
	adjustQues51_2 : function(type,key){
		um.disableRecord();
		var idx;
		switch(type){
		case 1: // �㉺���]
			for(var cx=0;cx<=k.qcols-1;cx++){
				idx = 1; this.qnumh[cx] = this.qnumh[cx].reverse();
				bd.sDiE(bd.exnum(cx,-1), this.qnumh[cx][0]);
				for(var cy=0;cy<=k.qrows-1;cy++){
					if(bd.QuC(bd.cnum(cx,cy))===51){ bd.sDiC(bd.cnum(cx,cy), this.qnumh[cx][idx]); idx++;}
				}
			}
			break;
		case 2: // ���E���]
			for(var cy=0;cy<=k.qrows-1;cy++){
				idx = 1; this.qnumw[cy] = this.qnumw[cy].reverse();
				bd.sQnE(bd.exnum(-1,cy), this.qnumw[cy][0]);
				for(var cx=0;cx<=k.qcols-1;cx++){
					if(bd.QuC(bd.cnum(cx,cy))===51){ bd.sQnC(bd.cnum(cx,cy), this.qnumw[cy][idx]); idx++;}
				}
			}
			break;
		case 3: // �E90�����]
			for(var cy=0;cy<=k.qrows-1;cy++){
				idx = 1; this.qnumh[cy] = this.qnumh[cy].reverse();
				bd.sQnE(bd.exnum(-1,cy), this.qnumh[cy][0]);
				for(var cx=0;cx<=k.qcols-1;cx++){
					if(bd.QuC(bd.cnum(cx,cy))===51){ bd.sQnC(bd.cnum(cx,cy), this.qnumh[cy][idx]); idx++;}
				}
			}
			for(var cx=0;cx<=k.qcols-1;cx++){
				idx = 1;
				bd.sDiE(bd.exnum(cx,-1), this.qnumw[k.qcols-1-cx][0]);
				for(var cy=0;cy<=k.qrows-1;cy++){
					if(bd.QuC(bd.cnum(cx,cy))===51){ bd.sDiC(bd.cnum(cx,cy), this.qnumw[k.qcols-1-cx][idx]); idx++;}
				}
			}
			break;
		case 4: // ��90�����]
			for(var cy=0;cy<=k.qrows-1;cy++){
				idx = 1;
				bd.sQnE(bd.exnum(-1,cy), this.qnumh[k.qrows-1-cy][0]);
				for(var cx=0;cx<=k.qcols-1;cx++){
					if(bd.QuC(bd.cnum(cx,cy))===51){ bd.sQnC(bd.cnum(cx,cy), this.qnumh[k.qrows-1-cy][idx]); idx++;}
				}
			}
			for(var cx=0;cx<=k.qcols-1;cx++){
				idx = 1; this.qnumw[cx] = this.qnumw[cx].reverse();
				bd.sDiE(bd.exnum(cx,-1), this.qnumw[cx][0]);
				for(var cy=0;cy<=k.qrows-1;cy++){
					if(bd.QuC(bd.cnum(cx,cy))===51){ bd.sDiC(bd.cnum(cx,cy), this.qnumw[cx][idx]); idx++;}
				}
			}
			break;
		}
		um.enableRecord();
	},
	adjustSpecial  : function(type,key){ },
	adjustSpecial2 : function(type,key){ },

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
			if(k.isborder){
				for(var i=0;i<bd.bdmax;i++){
					if(bd.border[i].qans!==bd.defborder.qans){ um.addOpe(k.BORDER,k.QANS,i,bd.border[i].qans,bd.defborder.qans);}
					if(bd.border[i].line!==bd.defborder.line){ um.addOpe(k.BORDER,k.LINE,i,bd.border[i].line,bd.defborder.line);}
					if(bd.border[i].qsub!==bd.defborder.qsub){ um.addOpe(k.BORDER,k.QSUB,i,bd.border[i].qsub,bd.defborder.qsub);}
				}
			}
			if(!g.vml){ pc.flushCanvasAll();}

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
			if(k.isborder){
				for(var i=0;i<bd.bdmax;i++){
					if(bd.border[i].qsub!==bd.defborder.qsub){ um.addOpe(k.BORDER,k.QSUB,i,bd.border[i].qsub,bd.defborder.qsub);}
				}
			}
			if(!g.vml){ pc.flushCanvasAll();}
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

	this.saved = 0;

	this.init();
};
LineManager.prototype = {

	//---------------------------------------------------------------------------
	// line.init()        �ϐ��̋N�����̏��������s��
	// line.resetLcnts()  lcnts���̕ϐ��̏��������s��
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
		for(var id=0;id<bd.bdmax;id++){ this.data.id[id] = (bd.isLine(id)?0:-1);
			if(bd.isLine(id)){
				this.data.id[id] = 0;

				var cc1, cc2;
				if(k.isCenterLine){ cc1 = bd.cc1(id),      cc2 = bd.cc2(id);}
				else              { cc1 = bd.crosscc1(id), cc2 = bd.crosscc2(id);}

				if(cc1!=-1){ this.ltotal[this.lcnt[cc1]]--; this.lcnt[cc1]++; this.ltotal[this.lcnt[cc1]]++;}
				if(cc2!=-1){ this.ltotal[this.lcnt[cc2]]--; this.lcnt[cc2]++; this.ltotal[this.lcnt[cc2]]++;}
			}
		}
		for(var id=0;id<bd.bdmax;id++){
			if(this.data.id[id]!=0){ continue;}	// ����id�����Ă�����X���[
			var bx=bd.border[id].cx, by=bd.border[id].cy;
			this.data.max++;
			this.data[this.data.max] = {idlist:[]};
			if(k.isCenterLine^(bx%2==0)){ this.lc0(bx,by+1,1,this.data.max); this.lc0(bx,by,2,this.data.max);}
			else                        { this.lc0(bx+1,by,3,this.data.max); this.lc0(bx,by,4,this.data.max);}
		}
	},
	lcntCell  : function(cc){ return (cc!=-1?this.lcnt[cc]:0);},

	//---------------------------------------------------------------------------
	// line.gettype()   ���������ꂽ/�����ꂽ���ɁAtypeA/typeB/typeC�̂����ꂩ���肷��
	// line.isTpos()    piece���A�w�肳�ꂽcc����id�̔��Α��ɂ��邩���肷��
	// line.branch()    lc0�֐���id�����蓖�Ē��A���̃Z���ŕ��򂷂邩�ǂ������肷��
	// line.terminate() lc0�֐���id�����蓖�Ē��A���̃Z���ŏI�����邩�ǂ������肷��
	//---------------------------------------------------------------------------
	gettype : function(cc,id,val){
		if(!k.isLineCross){
			return ((this.lcnt[cc]===(0+val))?this.typeA:this.typeB);
		}
		else{
			if(cc===-1 || this.lcnt[cc]===(0+val) || (this.lcnt[cc]===(2+val) && this.isTpos(cc,id))){ return this.typeA;}
			else if(this.lcnt[cc]===(1+val) || this.lcnt[cc]===(3+val)){ return this.typeB;}
			return this.typeC;
		}
	},
	isTpos : function(cc,id){
		//   �� ��id                    
		// ������                       
		//   �E �����̏ꏊ�ɐ������邩�H
		if(k.isCenterLine){
			return !bd.isLine(bd.bnum( 4*bd.cell[cc].cx+2-bd.border[id].cx, 4*bd.cell[cc].cy+2  -bd.border[id].cy ));
		}
		else{
			return !bd.isLine(bd.bnum( 4*(cc%(k.qcols+1))-bd.border[id].cx, 4*mf(cc/(k.qcols+1))-bd.border[id].cy ));
		}
	},

	branch    : function(bx,by){
		if(!k.isLineCross){
			return (this.lcntCell((k.isCenterLine?bd.cnum:bd.xnum)(bx>>1,by>>1))>=3);
		}
		return false;
	},
	terminate : function(bx,by){
		return false;
	},

	//---------------------------------------------------------------------------
	// line.setLine()        ���������ꂽ������ꂽ���ɁAlcnt�ϐ�����̏��𐶐����Ȃ���
	// line.setLineInfo()    ���������ꂽ���ɁA���̏��𐶐����Ȃ���
	// line.removeLineInfo() ���������ꂽ���ɁA���̏��𐶐����Ȃ���
	// line.addLineInfo()    ���������ꂽ���ɁA����̐����S�Ă�������1�̐���
	//                       �ł���ꍇ�̐�id�̍Đݒ���s��
	// line.remakeLineInfo() ���������ꂽ������ꂽ���A�V����2�ȏ�̐����ł���
	//                       �\��������ꍇ�̐�id�̍Đݒ���s��
	// line.repaintLine()    �ЂƂȂ���̐����ĕ`�悷��
	// line.repaintParts()   repaintLine()�֐��ŁA����ɏォ��`�悵�Ȃ�����������������
	//---------------------------------------------------------------------------
	setLine : function(id, val){
		if(this.disableLine){ return;}
		val = (val>0?1:0);

		var cc1, cc2;
		if(k.isCenterLine){ cc1 = bd.cc1(id),      cc2 = bd.cc2(id);}
		else              { cc1 = bd.crosscc1(id), cc2 = bd.crosscc2(id);}

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
			else if(!k.isLineCross || (type1===this.typeB && type2===this.typeB)){
				this.addLineInfo(id);
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

	addLineInfo : function(id){
		var dataid = this.data.id;

		// ���̊֐��̓˓��������Abid.length�͕K��2�ɂȂ�
		// ���Ȃ�Ȃ�����... ����������ID�͕K��2�ɂȂ�
		var bid = this.getbid(id,1);
		var did = [dataid[bid[0]], -1];
		for(var i=0;i<bid.length;i++){
			if(did[0]!=dataid[bid[i]]){
				did[1]=dataid[bid[i]];
				break;
			}
		}

		var newColor = bd.border[bid[0]].color;
		if(did[1] != -1){
			var longid = did[0], shortid = did[1];
			if(this.data[did[0]].idlist.length < this.data[did[1]].idlist.length){
				longid=did[1]; shortid=did[0];
				newColor=bd.border[bid[1]].color;
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
			this.repaintLine(longidlist);
		}
		else{
			this.data[did[0]].idlist.push(id);
			dataid[id] = did[0];
			bd.border[id].color = newColor;
		}
	},
	remakeLineInfo : function(id,val){
		var dataid = this.data.id;

		var bid = this.getbid(id,val);
		var longid = dataid[bid[0]];
		var longColor = bd.border[bid[0]].color; // ����ň�Ԓ������̐F��ێ�����

		// �Ȃ��������̐�����0�ɂ���
		for(var i=0,len=bid.length;i<len;i++){
			var lid = dataid[bid[i]];
			if(lid<=0){ continue;}
			var idlist = this.data[lid].idlist;
			if(this.data[longid].idlist.length < idlist.length){
				longid=lid; longColor=bd.border[bid[i]].color;
			}
			for(var n=0,len2=idlist.length;n<len2;n++){ dataid[idlist[n]] = 0;}
			this.data[lid] = {idlist:[]};
		}

		dataid[id] = (val>0?0:-1);
		if(val===1){ bid.unshift(id);}

		// �V����id��ݒ肷��
		var oldmax = this.data.max;
		for(var i=0,len=bid.length;i<len;i++){
			if(dataid[bid[i]]!=0){ continue;}	// ����id�����Ă�����X���[
			var bx=bd.border[bid[i]].cx, by=bd.border[bid[i]].cy;
			this.data.max++; this.data[this.data.max] = {idlist:[]};
			if(k.isCenterLine^(bx%2===0)){ this.lc0(bx,by+1,1,this.data.max); this.lc0(bx,by,2,this.data.max);}
			else                         { this.lc0(bx+1,by,3,this.data.max); this.lc0(bx,by,4,this.data.max);}
		}

		// �V�����F��ݒ肵�āA�ĕ`�悷��
		longid = oldmax+1;
		if(this.data.max>longid || k.isLineCross){
			for(var i=oldmax+2;i<=this.data.max;i++){ if(this.data[longid].idlist.length < this.data[i].idlist.length){ longid=i;} }
			for(var i=oldmax+1;i<=this.data.max;i++){
				var newColor = (i===longid?longColor:pc.getNewLineColor());
				var idlist = this.data[i].idlist;
				for(var n=0,len=idlist.length;n<len;n++){
					bd.border[idlist[n]].color = newColor;
				}
				this.repaintLine(idlist);
			}
		}
		else{
			bd.border[id].color = (val==0?longColor:"");
		}
	},

	repaintLine : (
		((!k.vml) ?
			function(idlist){
				if(!pp.getVal('irowake')){ return;}

				if(k.isCenterLine){
					for(var i=0,len=idlist.length;i<len;i++){
						pc.drawLine1(idlist[i],true);
						this.repaintParts(idlist[i]);
					}
				}
				else{
					for(var i=0,len=idlist.length;i<len;i++){
						var id = idlist[i];
						if(bd.border[id].qans!==1){ g.fillStyle = pc.BorderQuescolor; }
						else                      { g.fillStyle = pc.getLineColor(id);}
						pc.drawBorder1x(bd.border[id].cx, bd.border[id].cy, true);
						this.repaintParts(id);
					}
				}
			}
		:
			function(idlist){
				if(!pp.getVal('irowake')){ return;}

				pc.zstable = true;
				if(k.isCenterLine){
					for(var i=0,len=idlist.length;i<len;i++){
						pc.drawLine1(idlist[i],true);
					}
				}
				else{
					for(var i=0,len=idlist.length;i<len;i++){
						pc.drawBorder1x(bd.border[idlist[i]].cx,bd.border[idlist[i]].cy,true);
					}
				}
				pc.zstable = false;
			}
		)
	),
	repaintParts : function(id){ }, // �I�[�o�[���C�h�p

	//---------------------------------------------------------------------------
	// line.getbid()  �w�肵��piece�Ɍq����A�ő�6�ӏ��Ɉ�����Ă������S�Ď擾����
	// line.lc0()     �ЂƂȂ���̐���lineid��ݒ肷��(�ċA�Ăяo���p�֐�)
	//---------------------------------------------------------------------------
	getbid : function(id,val){
		var bid = [];
		var bx=bd.border[id].cx, by=bd.border[id].cy;
		var dx =((k.isCenterLine^(bx%2===0))?2:0), dy=(2-dx);	// (dx,dy) = (2,0) or (0,2)

		var i;
		if(!k.isLineCross){
			i = bd.bnum(bx-dy,   by-dx  ); if(bd.isLine(i)){ bid.push(i);} // cc1�����straight
			i = bd.bnum(bx-1,    by-1   ); if(bd.isLine(i)){ bid.push(i);} // cc1�����curve1
			i = bd.bnum(bx+dx-1, by+dy-1); if(bd.isLine(i)){ bid.push(i);} // cc1�����curve2
			i = bd.bnum(bx+dy,   by+dx  ); if(bd.isLine(i)){ bid.push(i);} // cc2�����straight
			i = bd.bnum(bx+1,    by+1   ); if(bd.isLine(i)){ bid.push(i);} // cc2�����curve1
			i = bd.bnum(bx-dx+1, by-dy+1); if(bd.isLine(i)){ bid.push(i);} // cc2�����curve2
		}
		else{
			var cc1 = bd.cc1(id), cc2 = bd.cc2(id);
			if(!k.isCenterLine){ cc1 = bd.crosscc1(id); cc2 = bd.crosscc2(id);}
			// k.isLineCross==1��k.isborderAsLine==1(->k.isCenterLine==0)�̃p�Y���͍���ĂȂ��͂�
			// �Y������̂��X���U�[�{�b�N�X���炢�������悤�ȁA�A

			if(cc1!==-1){
				if(this.lcnt[cc1]===(1+val) || (this.lcnt[cc1]===(2+val) && !this.isTpos(cc1,id))){
					i = bd.bnum(bx-dy,   by-dx  ); if(bd.isLine(i)){ bid.push(i);} // cc1�����straight
					i = bd.bnum(bx-1,    by-1   ); if(bd.isLine(i)){ bid.push(i);} // cc1�����curve1
					i = bd.bnum(bx+dx-1, by+dy-1); if(bd.isLine(i)){ bid.push(i);} // cc1�����curve2
				}
				else if(this.lcnt[cc1]>=(3+val)){
					i = bd.bnum(bx-dy,   by-dx  ); if(bd.isLine(i)){ bid.push(i);} // cc1�����straight
				}
			}
			if(cc2!==-1){
				if(this.lcnt[cc2]===(1+val) || (this.lcnt[cc2]===(2+val) && !this.isTpos(cc2,id))){
					i = bd.bnum(bx+dy,   by+dx  ); if(bd.isLine(i)){ bid.push(i);} // cc2�����straight
					i = bd.bnum(bx+1,    by+1   ); if(bd.isLine(i)){ bid.push(i);} // cc2�����curve1
					i = bd.bnum(bx-dx+1, by-dy+1); if(bd.isLine(i)){ bid.push(i);} // cc2�����curve2
				}
				else if(this.lcnt[cc2]>=(3+val)){
					i = bd.bnum(bx+dy,   by+dx  ); if(bd.isLine(i)){ bid.push(i);} // cc2�����straight
				}
			}
		}

		return bid;
	},

	lc0 : function(bx,by,dir,newid){
		while(1){
			switch(dir){ case 1: by--; break; case 2: by++; break; case 3: bx--; break; case 4: bx++; break;}
			if((bx+by)%2===0){
				if(this.branch(bx,by)){
					if(bd.isLine(bd.bnum(bx,by-1))){ this.lc0(bx,by,1,newid);}
					if(bd.isLine(bd.bnum(bx,by+1))){ this.lc0(bx,by,2,newid);}
					if(bd.isLine(bd.bnum(bx-1,by))){ this.lc0(bx,by,3,newid);}
					if(bd.isLine(bd.bnum(bx+1,by))){ this.lc0(bx,by,4,newid);}
					break;
				}
				else if(this.lcntCell((k.isCenterLine?bd.cnum:bd.xnum)(bx>>1,by>>1))<=2){
					if     (dir!=1 && bd.isLine(bd.bnum(bx,by+1))){ dir=2;}
					else if(dir!=2 && bd.isLine(bd.bnum(bx,by-1))){ dir=1;}
					else if(dir!=3 && bd.isLine(bd.bnum(bx+1,by))){ dir=4;}
					else if(dir!=4 && bd.isLine(bd.bnum(bx-1,by))){ dir=3;}
				}
				else if(this.terminate(bx,by)){ break;}
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

	this.disroom = (!k.isborder || !!k.area.disroom);	// �������𐶐����Ȃ�
	this.bblock = (!!k.area.bcell || !!k.area.number);	// ���}�X(or �q���鐔���E�L��)�̏��𐶐�����
	this.wblock = !!k.area.wcell;						// ���}�X�̏��𐶐�����
	this.numberColony = !!k.area.number;				// �����E�L�������}�X���Ƃ݂Ȃ��ď��𐶐�����

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
		if(k.isborder && !k.isborderAsLine){ this.resetRarea();}
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
		for(var c=0;c<(k.qcols+1)*(k.qrows+1);c++){
			this.lcnt[c]=0;
			if(k.isoutsideborder===0){
				var xx=c%(k.qcols+1), xy=mf(c/(k.qcols+1));
				if(xx===0 || xx===k.qcols || xy===0 || xy===k.qrows){ this.lcnt[c]=2;}
			}
		}

		if(this.disroom){ return;}
		for(var id=0;id<bd.bdmax;id++){
			if(bd.isBorder(id)){
				var cc1 = bd.crosscc1(id), cc2 = bd.crosscc2(id);
				if(cc1!==-1){ this.lcnt[cc1]++;}
				if(cc2!==-1){ this.lcnt[cc2]++;}
			}
		}
	},
	resetRarea : function(){
		if(this.disroom){ return;}

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
		if(k.isOneNumber){
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
	call_setBorder : function(id,val,type){
		this.setBorder(id,val);
	},
	setBorder : function(id,val){
		if(this.disroom){ return;}
		val = (val>0?1:0);

		var cc1, cc2, xc1 = bd.crosscc1(id), xc2 = bd.crosscc2(id);
		var room = this.room, roomid = room.id;
		if(val>0){
			this.lcnt[xc1]++; this.lcnt[xc2]++;

			if(this.lcnt[xc1]===1 || this.lcnt[xc2]===1){ return;}
			cc1 = bd.cc1(id); cc2 = bd.cc2(id);
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
			if(k.isOneNumber){
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
			cc1 = bd.cc1(id); cc2 = bd.cc2(id);
			if(cc1===-1 || cc2===-1 || roomid[cc1]===roomid[cc2]){ return;}

			// k.isOneNumber�̎� �ǂ����̐������c�����́ATOP���m�̈ʒu�Ŕ�r����
			if(k.isOneNumber){
				var merged, keep;

				var tc1 = room[roomid[cc1]].top, tc2 = room[roomid[cc2]].top;
				var tcx1 = bd.cell[tc1].cx, tcx2 = bd.cell[tc2].cx;
				if(tcx1>tcx2 || (tcx1===tcx2 && tc1>tc2)){ merged = tc1; keep = tc2;}
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
		var cc=-1, cx=k.qcols, cy=k.qrows;
		var clist = this.room[roomid].clist;
		for(var i=0;i<clist.length;i++){
			var tc = bd.cell[clist[i]];
			if(tc.cx>cx || (tc.cx==cx && tc.cy>=cy)){ continue;}
			cc=clist[i];
			cx=tc.cx;
			cy=tc.cy;
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
	this.canvas       = null;	// HTML�\�[�X��Canvas�������G�������g
	this.numparent    = null;	// 'numobj_parent'�������G�������g
	this.resizetimer  = null;	// resize�^�C�}�[
	this.initProcess  = true;	// �����������ǂ���
};
PBase.prototype = {
	//---------------------------------------------------------------------------
	// base.preload_func()
	//   ���̃t�@�C�����Ă΂ꂽ�Ƃ��Ɏ��s�����֐� -> onLoad�O�̍ŏ����̐ݒ���s��
	//---------------------------------------------------------------------------
	preload_func : function(){
		// URL�̎擾 -> URL��?�ȉ�����puzzleid����pzlURI���ɕ���
		enc = new Encode();
		k.puzzleid = enc.first_parseURI(location.search);
		if(!k.puzzleid && location.href.indexOf('for_test.html')>=0){ k.puzzleid = 'country';}
		if(!k.puzzleid){ location.href = "./";} // �w�肳�ꂽ�p�Y�����Ȃ��ꍇ�͂��悤�Ȃ�`
		if(enc.uri.cols){ k.qcols = enc.uri.cols;}
		if(enc.uri.rows){ k.qrows = enc.uri.rows;}

		// Gears_init.js�̓ǂݍ���
		fio = new FileIO();
		if(fio.choiceDataBase()>0){
			document.writeln("<script type=\"text/javascript\" src=\"src/gears_init.js\"></script>");
		}

		// �p�Y����p�t�@�C���̓ǂݍ���
		if(location.href.indexOf('for_test.html')==-1){
			document.writeln("<script type=\"text/javascript\" src=\"src/"+k.puzzleid+".js\"></script>");
		}
		else{
			document.writeln("<script type=\"text/javascript\" src=\"src/puzzles.js\"></script>");
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
	// base.initSilverlight() Silverlight�I�u�W�F�N�g�ɃC�x���g�̐ݒ���s��(IE��Silverlight���[�h��)
	//---------------------------------------------------------------------------
	onload_func : function(){
		this.initCanvas();
		this.initObjects();
		this.setEvents(true);	// �C�x���g����������

		if(document.domain=='indi.s58.xrea.com' && k.PLAYER){ this.accesslog();}	// �A�N�Z�X���O���Ƃ��Ă݂�
		tm = new Timer();	// �^�C�}�[�I�u�W�F�N�g�̐����ƃ^�C�}�[�X�^�[�g

		this.initProcess = false;
	},

	initCanvas : function(){
		this.canvas = ee('puzzle_canvas').unselectable().el; // Canvas
		this.numparent = ee('numobj_parent').el;			// �����\���p
		g = this.canvas.getContext("2d");
	},

	initObjects : function(){
		this.proto = 0;

		puz = new Puzzles[k.puzzleid]();	// �p�Y���ŗL�I�u�W�F�N�g
		puz.setting();						// �p�Y���ŗL�̕ϐ��ݒ�(�f�t�H���g��)
		if(this.proto){ puz.protoChange();}

		// �N���X������
		bd = new Board();		// �ՖʃI�u�W�F�N�g
		mv = new MouseEvent();	// �}�E�X���̓I�u�W�F�N�g
		kc = new KeyEvent();	// �L�[�{�[�h���̓I�u�W�F�N�g
		kp = new KeyPopup();	// ���̓p�l���I�u�W�F�N�g
		pc = new Graphic();		// �`��n�I�u�W�F�N�g
		tc = new TCell();		// �L�[���͂̃^�[�Q�b�g�Ǘ��I�u�W�F�N�g
		ans = new AnsCheck();	// ���𔻒�I�u�W�F�N�g
		um   = new UndoManager();	// ������Ǘ��I�u�W�F�N�g
		area = new AreaManager();	// ������񓙊Ǘ��I�u�W�F�N�g
		line = new LineManager();	// ���̏��Ǘ��I�u�W�F�N�g

		fio.initDataBase();		// �f�[�^�x�[�X�̐ݒ�
		menu = new Menu();		// ���j���[�������I�u�W�F�N�g
		pp = new Properties();	// ���j���[�֌W�̐ݒ�l��ێ�����I�u�W�F�N�g

		this.doc_design();		// �f�U�C���ύX�֘A�֐��̌Ăяo��

		enc.pzlinput();										// URL����p�Y���̃f�[�^��ǂݏo��
		if(!enc.uri.bstr){ this.resize_canvas_onload();}	// Canvas�̐ݒ�(pzlinput�ŌĂ΂��̂ŁA�����ł͌Ă΂Ȃ�)

		if(k.scriptcheck && debug){ debug.testonly_func();}	// �e�X�g�p

		if(!!puz.finalfix){ puz.finalfix();}					// �p�Y���ŗL�̌�t���ݒ�
	},
	setEvents : function(first){
		this.canvas.onmousedown   = ee.ebinder(mv, mv.e_mousedown);
		this.canvas.onmousemove   = ee.ebinder(mv, mv.e_mousemove);
		this.canvas.onmouseup     = ee.ebinder(mv, mv.e_mouseup  );
		this.canvas.oncontextmenu = function(){ return false;};

		this.numparent.onmousedown   = ee.ebinder(mv, mv.e_mousedown);
		this.numparent.onmousemove   = ee.ebinder(mv, mv.e_mousemove);
		this.numparent.onmouseup     = ee.ebinder(mv, mv.e_mouseup  );
		this.numparent.oncontextmenu = function(){ return false;};

		if(first){
			document.onkeydown  = ee.ebinder(kc, kc.e_keydown);
			document.onkeyup    = ee.ebinder(kc, kc.e_keyup);
			document.onkeypress = ee.ebinder(kc, kc.e_keypress);
		}
	},
	initSilverlight : function(sender){
		sender.AddEventListener("KeyDown", ee.ebinder(kc, kc.e_SLkeydown));
		sender.AddEventListener("KeyUp",   ee.ebinder(kc, kc.e_SLkeyup));
	},

	//---------------------------------------------------------------------------
	// base.doc_design()       onload_func()�ŌĂ΂��Bhtml�Ȃǂ̐ݒ���s��
	// base.postfix()          �e�p�Y���̏������㏈�����Ăяo��
	// base.gettitle()         ���݊J���Ă���^�C�g����Ԃ�
	// base.getPuzzleName()    ���݊J���Ă���p�Y���̖��O��Ԃ�
	// base.setTitle()         �p�Y���̖��O��ݒ肷��
	// base.setExpression()    ��������ݒ肷��
	// base.setFloatbgcolor()  �t���[�g���j���[�̔w�i�F��ݒ肷��
	//---------------------------------------------------------------------------
	// �w�i�摜�Ƃ�title��/html�\���̐ݒ� //
	doc_design : function(){
		this.resize_canvas_only();	// Canvas�̃T�C�Y�ݒ�

		_doc.title = this.gettitle();
		ee('title2').el.innerHTML = this.gettitle();

		_doc.body.style.backgroundImage = "url(../../"+k.puzzleid+"/bg.gif)";
		if(k.br.IE){
			ee('title2').el.style.marginTop = "24px";
			ee('separator1').el.style.margin = '0pt';
			ee('separator2').el.style.margin = '0pt';
		}

		this.postfix();			// �e�p�Y�����Ƃ̐ݒ�(��t����)
		menu.menuinit();
		um.enb_btn();
	},
	postfix : function(){
		puz.input_init();
		puz.graphic_init();
		puz.encode_init();
		puz.answer_init();
	},

	gettitle : function(){
		if(k.EDITOR){ return ""+this.getPuzzleName()+(menu.isLangJP()?" �G�f�B�^ - �ς��Ղ�v3":" editor - PUZ-PRE v3");}
		else		{ return ""+this.getPuzzleName()+(menu.isLangJP()?" player - �ς��Ղ�v3"  :" player - PUZ-PRE v3");}
	},
	getPuzzleName : function(){ return (menu.isLangJP()||!this.puzzlename.en)?this.puzzlename.ja:this.puzzlename.en;},
	setTitle      : function(strJP, strEN){ this.puzzlename.ja = strJP; this.puzzlename.en = strEN;},
	setExpression : function(strJP, strEN){ this.expression.ja = strJP; this.expression.en = strEN;},
	setFloatbgcolor : function(color){ this.floatbgcolor = color;},

	//---------------------------------------------------------------------------
	// base.resize_canvas_only()   �E�B���h�E��Load/Resize���̏����BCanvas/�\������}�X�ڂ̑傫����ݒ肷��B
	// base.resize_canvas()        resize_canvas_only()+Canvas�̍ĕ`��
	// base.resize_canvas_onload() ����������paint�ĕ`�悪�N����Ȃ��悤�ɁAresize_canvas���Ăяo��
	// base.onresize_func()        �E�B���h�E���T�C�Y���ɌĂ΂��֐�
	// base.resetInfo()            AreaInfo���A�Ֆʓǂݍ��ݎ��ɏ��������������Ăяo��
	//---------------------------------------------------------------------------
	resize_canvas_only : function(){
		var wwidth = ee.windowWidth()-6;	//  margin/border������̂ŁA�K���Ɉ����Ă���
		var cols   = k.qcols+(2*k.def_psize/k.def_csize) + k.isextendcell; // canvas�̉������Z�������ɑ������邩
		var rows   = k.qrows+(2*k.def_psize/k.def_csize) + k.isextendcell; // canvas�̏c�����Z�������ɑ������邩

		var cratio = {0:(19/36), 1:0.75, 2:1.0, 3:1.5, 4:3.0}[k.widthmode];
		var cr = {base:cratio,limit:0.40}, ws = {base:0.80,limit:0.96}, ci=[];
		ci[0] = (wwidth*ws.base )/(k.def_csize*cr.base );
		ci[1] = (wwidth*ws.limit)/(k.def_csize*cr.limit);

		var mwidth = wwidth*ws.base-4; // margin/border������̂ŁA�K���Ɉ����Ă���

		// ���ɏk�����K�v�Ȃ��ꍇ
		if(cols < ci[0]){
			mwidth = wwidth*ws.base-4;
			k.cwidth = k.cheight = mf(k.def_csize*cr.base);
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
			k.cwidth = k.cheight = mf(k.def_csize*cr.limit);
		}

		// main�̃T�C�Y�ύX
		ee('main').el.style.width = ''+mf(mwidth)+'px';

		// Canvas�̃T�C�Y�ύX
		this.canvas.width  = mf((cols-k.isextendcell)*k.cwidth );
		this.canvas.height = mf((rows-k.isextendcell)*k.cheight);

		// VML�g�����ɁACanvas�O�̘g���������Ă��܂��̂Ŏc���Ă����܂�.
		if(g.vml){
			var fc = this.canvas.firstChild;
			fc.style.width  = ''+this.canvas.clientWidth  + 'px';
			fc.style.height = ''+this.canvas.clientHeight + 'px';
		}

		// �Ֆʂ̃Z��ID:0���`�悳���ʒu�̐ݒ�
		k.p0.x = k.p0.y = mf(k.def_psize*(k.cwidth/k.def_csize));
		// extendxell==1�̎��͈ʒu�����炷 (extendxell==2��def_psize�Œ���)
		if(k.isextendcell==1){
			k.p0.x += mf(k.cwidth*0.45);
			k.p0.y += mf(k.cheight*0.45);
		}

		var rect = ee('puzzle_canvas').getRect();
		k.cv_oft.x = rect.left;
		k.cv_oft.y = rect.top;

		kp.resize();
		bd.setposAll();

		pc.onresize_func();
	},
	resize_canvas : function(){
		this.resize_canvas_only();
		pc.flushCanvasAll();
		pc.paintAll();
	},
	resize_canvas_onload : function(){
		if(pc.already()){ this.resize_canvas();}
		else{ uuCanvas.ready(ee.binder(this, this.resize_canvas));}
	},
	onresize_func : function(){
		if(this.resizetimer){ clearTimeout(this.resizetimer);}
		this.resizetimer = setTimeout(ee.binder(this, this.resize_canvas),250);
	},

	resetInfo : function(iserase){
		if(iserase){ um.allerase();}
		tc.Adjust();
		area.resetArea();
		line.resetLcnts();
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
