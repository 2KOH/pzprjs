// global.js v3.3.0

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

	cellsize          : 36,		// �f�t�H���g�̃Z���T�C�Y
	bdmargin          : 0.70,	// �g�O�̈�ӂ�margin(�Z�������Z)
	reduceImageMargin : true,	// �摜�o�͎���margin������������

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

	cwidth   : this.cellsize,	// �Z���̉���
	cheight  : this.cellsize,	// �Z���̏c��
	bwidth   : this.cellsize/2,	// �Z���̉���/2
	bheight  : this.cellsize/2,	// �Z���̏c��/2

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
