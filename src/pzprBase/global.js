// global.js v3.2.3

//----------------------------------------------------------------------------
// ���O���[�o���ϐ�
//---------------------------------------------------------------------------
// Pos�N���X
Pos = function(xx,yy){ this.x = xx; this.y = yy;};
Pos.prototype = {
	set : function(xx,yy){ this.x = xx; this.y = yy;}
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

	fstruct  : [],			// �t�@�C���̍\��

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
// �����ʃO���[�o���֐�
//---------------------------------------------------------------------------
var g;				// �O���t�B�b�N�R���e�L�X�g
var Puzzles = [];	// �p�Y���ʃN���X
var _doc = document;

	//---------------------------------------------------------------------------
	// mf()            �����_�ȉ���؎̂Ă�(��int())
	// f_true()        true��Ԃ��֐��I�u�W�F�N�g(�����ɋ�֐��������̂��߂�ǂ������̂�)
	//---------------------------------------------------------------------------
var mf = Math.floor;
function f_true(){ return true;}
function getEL(id){ return _doc.getElementById(id);}

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
		if(!_elx[id]){
			if(typeof id === 'string'){
				_elx[id] = new _ELx(_doc.getElementById(id));
			}
			else{ _elx[id] = new _ELx(id);}
		}
		return _elx[id];
	},
	_elx = _ElementManager._cache = {},

	// define and map _ElementManager.ElementExt class
	_ELx = _ElementManager.ElementExt = function(el){
		this.el     = el;
		this.parent = el.parentNode;
		this.pdisp  = 'none';
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
	clean : function(){
		this._cache = null;
		this._cache = {};
	},

	//----------------------------------------------------------------------
	get : function(id){
		if(!_elx[id]){ _elx[id] = new _ELx(_doc.getElementById(id));}
		return _elx[id];
	},
	getEL : function(id){
		if(!_elx[id]){ _elx[id] = new _ELx(_doc.getElementById(id));}
		return _elx[id].el;
	},

	//----------------------------------------------------------------------
	newELx : function(tag){ return new _ELx(_doc.createElement(tag));},
	newEL  : function(tag){ return _doc.createElement(tag);},
	newBTNx : function(idname, name, firstval){
		var elx = new _ELx(_doc.createElement('input'));
		var el = elx.el;
		el.type  = 'button';
		if(!!idname){ el.id    = idname;}
		if(!!name)  { el.name  = name;}
		el.value = firstval;
		if(!!idname){ _elx[idname] = elx;}
		return elx;
	},
	newBTN : function(idname, name, firstval){
		var el = _doc.createElement('input');
		el.type  = 'button';
		if(!!idname){ el.id    = idname;}
		if(!!name)  { el.name  = name;}
		el.value = firstval;
		return el;
	},

	CreateDOMAndSetNop : function(){
		return (!pc.textenable ? this.CreateElementAndSetNop() : null);
	},
	CreateElementAndSetNop : function(){
		var el = _doc.createElement('div');
		el.className = 'divnum';
		(new _ELx(el)).unselectable();
		base.numparent.appendChild(el);
		return el;
	},

	//----------------------------------------------------------------------
	replaceChildrenClass : function(parent, before, after){
		var el = parent.firstChild;
		while(!!el){ if(el.className===before){ el.className = after;} }
	},

	//----------------------------------------------------------------------
	getSrcElement : function(e){
		return e.target || e.srcElement;
	},

	binder : function(){
		var args=_toArray(arguments); var obj = args.shift(), __method = args.shift();
		return function(){
			return __method.apply(obj, _toArray(args).concat(_toArray(arguments)));
		}
	},
	ebinder : function(){
		var args=_toArray(arguments); var obj = args.shift(), __method = args.shift();
		return function(e){
			return __method.apply(obj, [e||_win.event].concat(_toArray(args)).concat(_toArray(arguments)));
		}
	},
	kcbinder : function(){
		var args=_toArray(arguments), __method = args.shift();
		return function(e){
			ret = __method.apply(kc, [e||_win.event].concat(_toArray(args)).concat(_toArray(arguments)));
			if(kc.tcMoved){
				if(_Gecko||_WebKit){ e.preventDefault();}
				else if(_IE){ return false;}
				else{ e.returnValue = false;}
			}
			return ret;
		}
	},

	//----------------------------------------------------------------------
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
	)
});

// implementation of _ElementManager.ElementExt class
_ElementManager.ElementExt.prototype = {

	show : function(){
		if(!this.pdisp && this.el.style.display!=='none'){
			this.pdisp = this.el.style.display;
		}
		this.el.style.display = (this.pdisp!=='none' ? this.pdisp : 'inline');
		return this;
	},
	hide : function(){
		if(!this.pdisp && this.el.style.display!=='none'){
			this.pdisp = this.el.style.display;
		}
		this.el.style.display = 'none';
		return this;
	},

	remove : function(){
		this.parent.removechild(this.el);
		return this;
	},

	//----------------------------------------------------------------------
	set : function(cname, idname, styles){
		this.el.className = cname;
		this.el.id = idname;
		for(var name in styles){ this.el.style[name] = styles[name];}
		return this;
	},
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
				this.attr("unselectable", "on");
				return this;
			}
		)
	),

	//----------------------------------------------------------------------
	getClass : function(cname){
		return this.el.className;
	},
	getId : function(idname){
		return this.el.id;
	},
	getStyle : function(name){
		return this.el.style[name];
	},

	setClass : function(cname){
		this.el.className = cname;
		return this;
	},
	setId : function(idname){
		this.el.id = id;
		return this;
	},
	setStyle : function(name, val){
		this.el.style[name] = val;
		return this;
	},

	setStyles : function(styles){
		for(var name in styles){ this.el.style[name] = styles[name];}
		return this;
	},
	setEvents : (
		((false && _win.addEventListener) ?
			function(funcs){
				for(var name in funcs){ this.el.addEventListener(name, funcs[name], false);}
				return this;
			}
		:(false && _win.attachEvent) ?
			function(funcs){
				for(var name in funcs){ this.el.attachEvent(name, funcs[name]);}
				return this;
			}
		:
			function(funcs){
				for(var name in funcs){ this.el['on'+name] = funcs[name];}
				return this;
			}
		)
	),

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
					left += +(el.offsetLeft || el.clientLeft);
					top  += +(el.offsetTop  || el.clientTop );
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
	getText : (
		((!_IE) ?
			// el.textContent -> IE�ȊO�Ή����ĂāA�W���͂�����
			function(){ return this.el.textContent;}
		:
			// el.innerText   -> Firefox�ȊO�͑Ή����Ă邯�ǕW������Ȃ�
			function(){ return this.el.innerText;}
		)
	),
	setText : (
		((!_IE) ?
			function(text){
				this.el.textContent = text;
				return this;
			}
		:
			function(text){
				this.el.innerText = text;
				return this;
			}
		)
	),
	appendText : (
		((!_IE) ?
			function(text){
				var sel = _doc.createElement('span');
				sel.textContent = text;
				this.el.appendChild(sel);
				return this;
			}
		:
			function(text){
				var sel = _doc.createElement('span');
				sel.innerText = text;
				this.el.appendChild(sel);
				return this;
			}
		)
	),

	getHTML : function(){
		return innerHTML;
	},
	setHTML : function(html){
		this.el.innerHTML = html;
		return this;
	},
	appendHTML : function(html){
		var sel = _doc.createElement('span');
		sel.innerHTML = html;
		this.el.appendChild(sel);
		return this;
	},

	//----------------------------------------------------------------------
	// el.prevousSibling -> ����parentNode�̒��Œ��O�ɂ���v�f��Ԃ� ���Ƃ��ƍŏ��Ȃ�null
	// el.nextSibling    -> ����parentNode�̒��Œ���ɂ���v�f��Ԃ� ���Ƃ��ƍŌ�Ȃ�null
	// parent.insertBefore(el,el2) -> el2�̒��O��el��}�� el2��null����apendChild�Ɠ���
	append : function(elx){
		this.el.appendChild(elx.el);
		return this;
	},
	appendEL : function(el){
		this.el.appendChild(el);
		return this;
	},
	appendTo : function(elx){
		elx.el.appendChild(this.el);
		return this;
	},
	insertBefore : function(baseel){
		this.parent.insertBefore(this.el,baseel);
		return this;
	},
	insertAfter : function(baseel){
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
	this.timerEL = getEL("timerpanel");

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
