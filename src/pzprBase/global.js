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
	IEMargin : new Pos(4, 4),	// �}�E�X���͓��ł���錏��margin

	br:{
		IE    : !!(window.attachEvent && !window.opera),
		Opera : !!window.opera,
		WebKit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
		Gecko : navigator.userAgent.indexOf('Gecko')>-1 && navigator.userAgent.indexOf('KHTML') == -1,
		WinWebKit: navigator.userAgent.indexOf('AppleWebKit/') > -1 && navigator.userAgent.indexOf('Win') > -1
	},

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

var g;				// �O���t�B�b�N�R���e�L�X�g
var Puzzles = [];	// �p�Y���ʃN���X

//---------------------------------------------------------------------------
// �����ʃO���[�o���֐�
//---------------------------------------------------------------------------
	//---------------------------------------------------------------------------
	// newEL(tag)      �V����tag��HTML�G�������g��\��jQuery�I�u�W�F�N�g���쐬����
	// unselectable()  jQuery�I�u�W�F�N�g�𕶎���I��s�ɂ���(���\�b�h�`�F�[���L�q�p)
	// getSrcElement() �C�x���g���N�������G�������g��Ԃ�
	// mf()            �����_�ȉ���؎̂Ă�(��int())
	// f_true()        true��Ԃ��֐��I�u�W�F�N�g(�����ɋ�֐��������̂��߂�ǂ������̂�)
	//---------------------------------------------------------------------------
function newEL(tag){ return $(document.createElement(tag));}
$.fn.unselectable = function(){
	if     (k.br.Gecko) { this.css("-moz-user-select","none"  ).css("user-select","none");}
	else if(k.br.WebKit){ this.css("-khtml-user-select","none").css("user-select","none");}
	else{ this.attr("unselectable", "on");}
	return this;
};
function getSrcElement(event){ return event.target || event.srcElement;}

var mf = Math.floor;
function f_true(){ return true;}

	//---------------------------------------------------------------------------
	// toArray()         �z��ɂ���(bind�Ŏg��)
	// Function.bind()   this���֐��ɕR�t������
	// Function.ebind()  this���֐��ɕR�t������(�C�x���g�p)
	// Function.kcbind() this���֐��ɕR�t������(�L�[�{�[�h�C�x���g�p)
	//---------------------------------------------------------------------------
function toArray(inp){ var args=[]; for(var i=0;i<inp.length;i++){ args[i] = inp[i];} return args;}

Function.prototype.bind = function(){
	var args=toArray(arguments);
	var __method = this, obj = args.shift();
	return function(){ return __method.apply(obj, args.concat(toArray(arguments)));}
};
Function.prototype.ebind = function(){
	var args=toArray(arguments);
	var __method = this, obj = args.shift();
	return function(e){ return __method.apply(obj, [e||window.event].concat(args).concat(toArray(arguments)));}
};
Function.prototype.kcbind = function(){
	var args=toArray(arguments), __method = this;
	return function(e){
		ret = __method.apply(kc, [e||window.event].concat(args).concat(toArray(arguments)));
		if(kc.tcMoved){ if(k.br.Gecko||k.br.WebKit){ e.preventDefault();}else if(k.br.IE){ return false;}else{ e.returnValue = false;} }
		return ret;
	}
};

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
	this.timerEL = document.getElementById("timerpanel");

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
		this.timerEL.innerHTML(this.label()+"00:00");

		clearInterval(this.TID);
		this.start();
	},
	start : function(){
		this.st = (new Date()).getTime();
		this.TID = setInterval(this.update.bind(this), this.timerInterval);
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
		if(!this.TIDundo){ this.TIDundo = setInterval(this.procUndo.bind(this), this.undoInterval);}

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
