//
// �p�Y�����ʃX�N���v�g pzplBase.js v3.0.7��2
//

//----------------------------------------------------------------------------
// ���O���[�o���ϐ�
//---------------------------------------------------------------------------
// Pos�N���X
Pos = Class.create();
Pos.prototype = {
	initialize : function(xx,yy){ this.x = xx; this.y = yy; },
	set : function(xx,yy){ this.x = xx; this.y = yy; }
};

// �e��p�����[�^�̒�`
var k = {
	// �e�p�Y����setting()�֐��Őݒ肳������
	qcols : 0, qrows : 0,	// �Ֆʂ̉����E�c��
	outside   :  0,			// 1:�Ֆʂ̊O����ID��p�ӂ���
	dispzero  :  0,			// 1:0��\�����邩�ǂ���
	irowake   :  0,			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������
	def_csize : 40,			// �f�t�H���g�̃Z���T�C�Y
	def_psize : 24,			// �f�t�H���g�̘g�Omargin�T�C�Y

	iscross  : 0,			// 1:Cross������\�ȃp�Y��
	isborder : 0,			// 1:Border/Line������\�ȃp�Y��
	isoutsidecross : 1,		// 1:�O�g���Cross�̔z�u������p�Y��
	isborderCross : 1,		// 1:������������p�Y��
	isborderAsLine : 0,		// 1:���E����line�Ƃ��Ĉ���

	isDispHatena : 1,		// 1:qnum��-2�̂Ƃ��ɁH��\������
	isAnsNumber  : 0,		// 1:�񓚂ɐ�������͂���p�Y��
	isOneNumber  : 0,		// 1:���̐����������̍����1��������p�Y��
	isDispNumUL  : 0,		// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
	NumberWithMB : 0,		// 1:�񓚂̐����Ɓ��~������p�Y��

	BlackCell     : 0,		// 1:���}�X����͂���p�Y��
	NumberIsWhite : 0,		// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
	RBBlackCell   : 0,		// 1:�A�����f�ւ̃p�Y��

	ispzprv3ONLY  : 0,		// �ς��Ղ�v3�ɂ����Ȃ��p�Y��
	isKanpenExist : 0,		// pencilbox/�J���y���ɂ���p�Y��

	// �����Ŏ����I�ɐݒ肳���O���[�o���ϐ�
	puzzleid  : '',			// �p�Y����ID("creek"�Ȃ�)
	callmode  : 'pmake',		// 'pmake':�G�f�B�^ 'pplay':player
	mode      : 3,			// 1:���z�u���[�h 3:�񓚃��[�h
	use       : 1,			// ������@
	irowake   : 0,			// ���̐F���������邩���Ȃ���
	widthmode : 1,			// Canvas�̉������ǂ����邩

	enableKey   : true,		// �L�[���͂͗L����
	enableMouse : true,		// �}�E�X���͂͗L����

	fstruct  : new Array(),		// �t�@�C���̍\��

	cwidth   : this.def_csize,	// �Z���̉���
	cheight  : this.def_csize,	// �Z���̏c��

	p0       : new Pos(this.def_psize, this.def_psize),	// �Ֆʂ̍�����W
	cv_oft   : new Pos(0, 0),	// Canvas�̍�����W
	IEMargin : new Pos(4, 4)	// �}�E�X���͂ł���錏��margin
};

var cv_obj;					// HTML�\�[�X��Canvas�������I�u�W�F�N�g
var g;						// �O���t�B�b�N�R���e�L�X�g

//---------------------------------------------------------------------------
// �����ʃO���[�o���֐�
//    unselectable(obj)
//      �G�������gobj�𕶎���I��s�ɂ���
//    CreateDOMAndSetNop()
//      �Ֆʐ����\���pDOM�Ƃ��ēo�^�����G�������g��Ԃ�
//    insideOf(obj,e)
//      �C�x���ge���G�������gobj�͈͓̔��ŋN���������H
//    getWindowSize(obj)
//      �E�B���h�E�̕���Pos�N���X�ŕԂ�
//---------------------------------------------------------------------------

// ���ʊ֐�
function unselectable(obj){
	if(Prototype.Browser.Gecko){ Element.setStyle(obj, "-moz-user-select: none; user-select: none;");}
	else if(Prototype.Browser.WebKit){ Element.setStyle(obj, "-khtml-user-select: none; user-select: none;");}
	else{ obj.unselectable = "on";}
}

function CreateDOMAndSetNop(){
	obj = document.createElement("div");
	obj.className = "divnum";
	document.getElementById("numobj_parent").appendChild(obj);

	Event.observe(obj, 'mousedown', mv.e_mousedown.bindAsEventListener(mv), true);
	Event.observe(obj, 'mouseup'  , mv.e_mouseup.bindAsEventListener(mv), true);
	Event.observe(obj, 'mousemove', mv.e_mousemove.bindAsEventListener(mv), true);
	obj.oncontextmenu = function(){ return false;}	//�Ë��_ 
	Event.observe(obj, 'contextmenu', function(){ return false;}, true);
	unselectable(obj);

	return obj;
}

function insideOf(obj, e){
	var ret = Element.getDimensions(obj);
	var LT = new Pos(Position.cumulativeOffset(obj)[0], Position.cumulativeOffset(obj)[1]);
	var ex = Event.pointerX(e);
	var ey = Event.pointerY(e);

	if(ex<=LT.x || ex>=LT.x+ret.width || ey<=LT.y || ey>=LT.y+ret.height){
		return false;
	}
	return true;
}

function getWindowSize() {
	if(document.all){
		return new Pos(document.body.clientWidth, document.body.clientHeight);
	}
	else if(document.layers || document.getElementById){
		return new Pos(innerWidth, innerHeight);
	}
	return new Pos(0, 0);
}

function int(a){
	return Math.floor(a);
}

//---------------------------------------------------------------------------
// ��Timer�N���X
//    tm.reset()
//      �^�C�}�[�̃J�E���g��0�ɂ���
//    tm.start()
//      update()�֐���100ms�Ԋu�ŌĂяo��
//    tm.update()
//      100ms�P�ʂŌĂяo�����֐�
//    tm.updatetime()
//      �b���̕\�����s��
//---------------------------------------------------------------------------

// Timer�N���X
Timer = Class.create();
Timer.prototype = {
	initialize : function(){
		this.st = 0;	// �ŏ��̃^�C�}�[�擾�l
		this.TID;		// �^�C�}�[ID
	},

	reset : function(){
		this,st = 0;
		this.prev = clearInterval(this.TID);
		document.timer.innerHTML = "00:00";
	},
	start : function(){
		this.st = (new Date()).getTime();
		var self = this;
		this.TID = setInterval(function(){self.update();},100);
	},
	update : function(){
		if(k.callmode!='pmake'){ this.updatetime();}

		if(!kc.isCTRL){ kc.inUNDO=false; kc.inREDO=false;}
		else if(kc.inUNDO){ um.undo(); }
		else if(kc.inREDO){ um.redo();}

		if(menu.resumecount>0) menu.resumecount--;
	},
	updatetime : function(){
		var nowtime = (new Date()).getTime();
		var seconds = int((nowtime - this.st)/1000);
		var hours   = int(seconds/3600);
		var minutes = int(seconds/60) - hours*60;
		seconds = seconds - minutes*60 - hours*3600;

		if(minutes < 10) minutes = "0" + minutes;
		if(seconds < 10) seconds = "0" + seconds;

		if(hours) $("timerpanel").innerHTML = "�o�ߎ��ԁF"+hours+":"+minutes+":"+seconds;
		$("timerpanel").innerHTML = "�o�ߎ��ԁF"+minutes+":"+seconds;
	}
};

//---------------------------------------------------------------------------
// ��Cell�N���X Board�N���X��Cell�̐������ێ�����
//    cell.cellinit()
//      �Z���̏�������������
//    cell.allclear()
//      �Z����cx,cy,numobj���ȊO���N���A����
//    cell.ansclear()
//      �Z����qans,qsub,error�����N���A����
//    cell.px() cell.py()
//      �Z���̍���A�E��̍��W��Ԃ�
//    cell.up() cell.dn() cell.lt() cell.rt()
//      ���̃Z���ɏ㉺���E�ŗאڂ��Ă���Z����ID��Ԃ�(���ݖ����̏ꍇ��-1)
//    cell.ub() cell.db() cell.lb() cell.rb()
//      ���̃Z���ɏ㉺���E�ŗאڂ��Ă��鋫�E��/�㉺���E�ɐL�т����ID��Ԃ�(���ݖ����̏ꍇ��-1)
//---------------------------------------------------------------------------

// �{�[�h�����o�f�[�^�̒�`(1)
// Cell�N���X�̒�`
Cell = Class.create();
Cell.prototype = {
	// Cell�N���X�̃����o�ϐ����`
	initialize : function(num){
		this.cx;	// �Z����X���W��ێ�����
		this.cy;	// �Z����Y���W��ێ�����
		this.ques;	// �Z���̖��f�[�^(�`��)��ێ�����
		this.qnum;	// �Z���̖��f�[�^(����)��ێ�����
		this.direc;	// �㉺���E�̕���
		this.qans;	// �Z���̉񓚃f�[�^��ێ�����
		this.qsub;	// �Z���̕⏕�f�[�^��ێ�����(��qlight)
		this.rarea;	// ������ID�f�[�^��ێ�����(������1���������A�̎��g��)
		this.error;	// �G���[�f�[�^��ێ�����
		this.numobj = '';	// ������\�����邽�߂̃G�������g
	},
	cellinit : function(num){
		this.allclear();
		bd.setposCell(num);
	},
	allclear : function() {
		this.qans = -1;
		this.qsub = 0;
		this.ques = 0;
		this.qnum = -1;
		this.direc = 0;
		this.rarea = -1;
		this.error = 0;
	},
	ansclear : function() {
		this.qans = -1;
		this.qsub = 0;
		this.error = 0;
	},
	px : function() { return k.p0.x+this.cx*k.cwidth;},
	py : function() { return k.p0.y+this.cy*k.cheight;},
	//dispnum : function(){ },
	//-------------------------------------------------------------------
	up : function() { return bd.getcnum(this.cx, this.cy-1);},	//��̃Z����ID�����߂�
	dn : function() { return bd.getcnum(this.cx, this.cy+1);},	//���̃Z����ID�����߂�
	lt : function() { return bd.getcnum(this.cx-1, this.cy);},	//���̃Z����ID�����߂�
	rt : function() { return bd.getcnum(this.cx+1, this.cy);},	//�E�̃Z����ID�����߂�
	//-------------------------------------------------------------------
	ub : function() { return bd.getbnum(this.cx*2+1, this.cy*2  );},	//�Z���̏�̋��E����ID�����߂�
	db : function() { return bd.getbnum(this.cx*2+1, this.cy*2+2);},	//�Z���̉��̋��E����ID�����߂�
	lb : function() { return bd.getbnum(this.cx*2  , this.cy*2+1);},	//�Z���̍��̋��E����ID�����߂�
	rb : function() { return bd.getbnum(this.cx*2+2, this.cy*2+1);}		//�Z���̉E�̋��E����ID�����߂�
};

//---------------------------------------------------------------------------
// ��Cross�N���X Board�N���X��Cross�̐������ێ�����(iscross==1�̎�)
//    cross.cellinit()
//      �����_�̏�������������
//    cross.allclear()
//      �����_��cx,cy,numobj���ȊO���N���A����
//    cross.px() cell.py()
//      �����_�̒��S�̍��W��Ԃ�
//---------------------------------------------------------------------------

// �{�[�h�����o�f�[�^�̒�`(2)
// Cross�N���X�̒�`
Cross = Class.create();
Cross.prototype = {
	// Cell�N���X�̃����o�ϐ����`
	initialize : function(num){
		this.cx;	// �Z����X���W��ێ�����
		this.cy;	// �Z����Y���W��ێ�����
		this.qnum;	// �Z���̖��f�[�^(����)��ێ�����
		this.error;	// �G���[�f�[�^��ێ�����
		this.numobj = '';	// ������\�����邽�߂̃G�������g
	},
	cellinit : function(num){
		this.allclear();
		bd.setposCross(num);
	},
	allclear : function() {
		this.qnum = -1;
		this.error = 0;
	},
	ansclear : function() {
		this.error = 0;
	},
	// ���̕`��̒��S�����߂�
	px : function() { return k.p0.x+this.cx*k.cwidth;},
	py : function() { return k.p0.y+this.cy*k.cheight;}
}

//---------------------------------------------------------------------------
// ��Border�N���X Board�N���X��Border�̐������ێ�����(isborder==1�̎�)
//    border.cellinit()
//      ���E���̏�������������
//    border.allclear()
//      ���E����cx,cy,numobj���ȊO���N���A����
//    border.px() border.py()
//      ���E���̒��S�̍��W��Ԃ�
//---------------------------------------------------------------------------

// �{�[�h�����o�f�[�^�̒�`(3)
// Border�N���X�̒�`
Border = Class.create();
Border.prototype = {
	initialize : function(num){
		this.cx;	// ���E����X���W��ێ�����
		this.cy;	// ���E����Y���W��ێ�����
		this.ques;	// ���E���̖��f�[�^(1:���E������)��ێ�����
		this.qans;	// ���E���̉񓚃f�[�^(1:���E������)��ێ�����
		this.qsub;	// ���E���̕⏕�f�[�^(1:�⏕��/2:�~)��ێ�����
		this.line;	// ���̉񓚃f�[�^(1:�񓚂̐�����)��ێ�����
		this.color;	// ���̐F�����f�[�^��ێ�����
		this.error;	// �G���[�f�[�^��ێ�����
		//this.numobj = '';	// ������\�����邽�߂̃G�������g
	},
	cellinit : function(num){
		this.allclear();
		bd.setposBorder(num);
	},
	allclear : function() {
		this.ques = 0;
		this.qans = 0;
		this.qsub = 0;
		this.line = 0;
		this.color = "";
		this.error = 0;
	},
	ansclear : function() {
		this.qans = 0;
		this.qsub = 0;
		this.line = 0;
		this.color = "";
		this.error = 0;
	},
	// ���E���Ȃǂ̕`��̒��S�����߂�
	px : function() { return k.p0.x+int(this.cx*k.cwidth/2);},
	py : function() { return k.p0.y+int(this.cy*k.cheight/2);}
}

//---------------------------------------------------------------------------
// ��Board�N���X �Ֆʂ̏���ێ�����BCell, Cross, Border�̃I�u�W�F�N�g���ێ�����
//    bd.initialize2()
//      initialize�֐��̕ς��(each�֐��̊֌W��u���E�U����ɓ{����̂�)
//    bd.counts(a,b)
//      outside==1�̎���a+b, outside==0�̎���a��Ԃ�
//    bd.ansclear()
//      �S�Ă�Cell, Cross, Border�I�u�W�F�N�g��ansclear()���Ăяo���ACanvas���ĕ`�悷��
//    bd.errclear()
//      �S�Ă�Cell, Cross, Border�I�u�W�F�N�g��error�v���p�e�B��0�ɂ��āACanvas���ĕ`�悷��
//
//    bd.setposAll()
//      �S�Ă�Cell, Cross, Border�I�u�W�F�N�g��setposCell()�����Ăяo��
//    bd.setposCell(id)
//      �Y������id�̃Z����cx,cy�v���p�e�B��ݒ肷��
//    bd.setposCross(id)
//      �Y������id�̌����_��cx,cy�v���p�e�B��ݒ肷��
//    bd.setposBorder(id)
//      �Y������id�̋��E��/Line��cx,cy�v���p�e�B��ݒ肷��
//
//    bd.isNullCell(id)
//      �w�肵��id��Cell��qans��ques���������l�����f����
//    bd.isNullCross(id)
//      �w�肵��id��Cross��ques���������l�����f����
//    bd.isNullBorder(id)
//      �w�肵��id��Border��line��ques���������l�����f����
//
//    bd.getcnum(cx,cy)
//      (X,Y)�̈ʒu�ɂ���Cell��ID��Ԃ�
//    bd.getcnum2(cx,cy,qc,qr)
//      (X,Y)�̈ʒu�ɂ���Cell��ID���A�Ֆʂ̑傫����(qc�~qr)�Ōv�Z���ĕԂ�
//    bd.getxnum(cx,cy)
//      (X,Y)�̈ʒu�ɂ���Cross��ID��Ԃ�
//    bd.getxnum2(cx,cy,qc,qr)
//      (X,Y)�̈ʒu�ɂ���Cross��ID���A�Ֆʂ̑傫����(qc�~qr)�Ōv�Z���ĕԂ�
//    bd.getbnum(cx,cy)
//      (X*2,Y*2)�̈ʒu�ɂ���Border��ID��Ԃ�
//    bd.getbnum2(cx,cy,qc,qr)
//      (X*2,Y*2)�̈ʒu�ɂ���Border��ID���A�Ֆʂ̑傫����(qc�~qr)�Ōv�Z���ĕԂ�
//
//    bd.bcntCross(cx,cy)
//      �w�肳�ꂽ�ʒu��Cross�̎���4�}�X�̂���qans==1�̃}�X�̐������߂�
//
//    bd.lcntCell(cx,cy)
//      �w�肳�ꂽ�ʒu��Cell�̏㉺���E�̂�������������Ă���(line==1��)�������߂�
//    bd.lcntCross(cx,cy)
//      �w�肳�ꂽ�ʒu��Cross�̏㉺���E�̂������E����������Ă���(ques==1 or qans==1��)�������߂�
//
//    bd.backLine(id)
//      �w�肳�ꂽID�̏㑤���������瑱������ID��Ԃ�(�����p)
//    bd.nextLine(id)
//      �w�肳�ꂽID�̉������E�����瑱������ID��Ԃ�(�����p)
//    bd.forwardLine(id,backwardid)
//      �w�肵��ID�̎��ɂ���ID���������ĕԂ�
//
//    bd.setQuesCell(id,num) / bd.getQuesCell(id)
//      �Y������Cell��ques��ݒ肷��/�Ԃ�
//    bd.setQnumCell(id,num) / bd.getQnumCell(id)
//      �Y������Cell��qnum��ݒ肷��/�Ԃ�
//    bd.setQsubCell(id,num) / bd.getQsubCell(id)
//      �Y������Cell��qsub��ݒ肷��/�Ԃ�
//    bd.setQansCell(id,num) / bd.getQansCell(id)
//      �Y������Cell��qans��ݒ肷��/�Ԃ�
//
//    bd.setQnumCross(id,num) / bd.getQnumCross(id)
//      �Y������Cross��ques��ݒ肷��/�Ԃ�
//
//    bd.setQuesBorder(id,num) / bd.getQuesBorder(id)
//      �Y������Border��ques��ݒ肷��/�Ԃ�
//    bd.setQnumBorder(id,num) / bd.getQnumBorder(id)
//      �Y������Border��qnum��ݒ肷��/�Ԃ�
//    bd.setQsubBorder(id,num) / bd.getQsubBorder(id)
//      �Y������Border��qsub��ݒ肷��/�Ԃ�
//    bd.setLineBorder(id,num) / bd.getLineBorder(id)
//      �Y������Border��line��ݒ肷��/�Ԃ�
//
//    bd.dispnumCell(id)
//      �Y������Cell�̐�����Canvas��ɏ�������
//    bd.dispnumCross(id)
//      �Y������Cross�̐�����Canvas��ɏ�������
//---------------------------------------------------------------------------

// Board�N���X�̒�`
Board = Class.create();
Board.prototype = {
	initialize : function(){ },
	initialize2 : function(){
		var self = this;

		// Cell�̏���������
		this.cell = new Array();
		$R(0, this.counts(k.qcols*k.qrows,2*(k.qcols+k.qrows)), true).each(function(i){
			self.cell[i] = new Cell(i);
			self.cell[i].allclear();
		});

		if(k.iscross){
			this.cross = new Array();	// Cross���`
			$R(0, (k.qcols+1)*(k.qrows+1), true).each(function(i){
				self.cross[i] = new Cross(i);
				self.cross[i].allclear();
			});
		}

		if(k.isborder){
			this.border = new Array();	// Border/Line���`
			var save=0;
			if(k.isborderAsLine){ save = k.outside; k.outside=1;}
			$R(0, this.counts(k.qcols*(k.qrows-1)+(k.qcols-1)*k.qrows,2*(k.qcols+k.qrows)), true).each(function(i){
				self.border[i] = new Border(i);
				self.border[i].allclear();
			});
			k.outside=save;
		}

		this.setposAll();
	},
	counts : function(a,b){ return (k.outside==0)?a:a+b;},
	ansclear : function(){
		this.cell.each(function(cell,i){ cell.ansclear();});
		if(k.iscross){ this.cross.each(function(cell,i){ cell.ansclear();});}
		if(k.isborder){ this.border.each(function(border,i){ border.ansclear();});}

		pc.paint(0,0,k.qcols-1,k.qrows-1);
	},
	subclear : function(){
		var flag = false;
		this.cell.each(function(cell,i){ if(cell.error!=0 || cell.qsub!=0){ cell.error=0; cell.qsub=0; flag=true;} });
		if(k.iscross){ this.cross.each(function(cell,i){ if(cell.error!=0){ cell.error=0; flag=true;} });}
		if(k.isborder){ this.border.each(function(border,i){ if(border.error!=0 || border.qsub!=0){ border.error=0; border.qsub=0; flag=true;} });}

		if(flag){ pc.paint(0,0,k.qcols-1,k.qrows-1);}
	},
	errclear : function(){
		var flag = false;
		this.cell.each(function(cell,i){ if(cell.error!=0){ cell.error=0; flag=true;} });
		if(k.iscross){ this.cross.each(function(cell,i){ if(cell.error!=0){ cell.error=0; flag=true;} });}
		if(k.isborder){ this.border.each(function(border,i){ if(border.error!=0){ border.error=0; flag=true;} });}

		if(flag){ pc.paint(0,0,k.qcols-1,k.qrows-1);}
	},
	//-------------------------------------------------------------------
	// setpos�֘A�֐� <- �eCell���������Ă���ƃ������������������̂ł����ɒu������.
	setposAll : function(){
		var self = this;
		this.cell.each(function(c,i){ self.setposCell(i);})
		if(k.iscross){ this.cross.each(function(c,i){ self.setposCross(i);})}
		if(k.isborder){ this.border.each(function(c,i){ self.setposBorder(i);})}
	},
	setposCell : function(id){
		if(id>=0 && id<k.qcols*k.qrows){
			this.cell[id].cx = id%k.qcols;
			this.cell[id].cy = int(id/k.qcols);
		}
		else if(id>=k.qcols*k.qrows && id<k.qcols*k.qrows+k.qcols){
			this.cell[id].cx = id-(k.qcols*k.qrows);
			this.cell[id].cy = -1;
		}
		else if(id>=k.qcols*k.qrows+k.qcols && id<k.qcols*k.qrows+2*k.qcols){
			this.cell[id].cx = id-(k.qcols*k.qrows)-k.qcols;
			this.cell[id].cy = k.qrows;
		}
		else if(id>=k.qcols*k.qrows+2*k.qcols && id<k.qcols*k.qrows+k.qcols+2*k.qcols+k.qrows){
			this.cell[id].cx = -1;
			this.cell[id].cy = id-(k.qcols*k.qrows)-2*k.qcols;
		}
		else if(id>=k.qcols*k.qrows+2*k.qcols+k.qrows && id<k.qcols*k.qrows+2*(k.qcols+k.qrows)){
			this.cell[id].cx = k.qcols;
			this.cell[id].cy = id-(k.qcols*k.qrows)-2*k.qcols-k.qrows;
		}
	},
	setposCross : function(id){
		this.cross[id].cx = id%(k.qcols+1);
		this.cross[id].cy = int(id/(k.qcols+1));
	},
	setposBorder : function(id){
		if(id>=0 && id<(k.qcols-1)*k.qrows){
			this.border[id].cx = (id%(k.qcols-1))*2+2;
			this.border[id].cy = int(id/(k.qcols-1))*2+1;
		}
		else if(id>=(k.qcols-1)*k.qrows && id<(k.qcols-1)*k.qrows+k.qcols*(k.qrows-1)){
			this.border[id].cx = (id-(k.qcols-1)*k.qrows)%k.qcols*2+1;
			this.border[id].cy = int((id-(k.qcols-1)*k.qrows)/k.qcols)*2+2;
		}
		else if(id>=(k.qcols-1)*k.qrows+k.qcols*(k.qrows-1) && id<(k.qcols-1)*k.qrows+k.qcols*(k.qrows-1)+k.qcols){
			this.border[id].cx = (id-((k.qcols-1)*k.qrows+k.qcols*(k.qrows-1)))*2+1;
			this.border[id].cy = 0;
		}
		else if(id>=(k.qcols-1)*k.qrows+k.qcols*(k.qrows-1)+k.qcols && id<(k.qcols-1)*k.qrows+k.qcols*(k.qrows-1)+2*k.qcols){
			this.border[id].cx = (id-((k.qcols-1)*k.qrows+k.qcols*(k.qrows-1))-k.qcols)*2+1;
			this.border[id].cy = k.qrows*2;
		}
		else if(id>=(k.qcols-1)*k.qrows+k.qcols*(k.qrows-1)+2*k.qcols && id<(k.qcols-1)*k.qrows+k.qcols*(k.qrows-1)+2*k.qcols+k.qrows){
			this.border[id].cx = 0;
			this.border[id].cy = (id-((k.qcols-1)*k.qrows+k.qcols*(k.qrows-1))-2*k.qcols)*2+1;
		}
		else if(id>=(k.qcols-1)*k.qrows+k.qcols*(k.qrows-1)+2*k.qcols+k.qrows && id<(k.qcols-1)*k.qrows+k.qcols*(k.qrows-1)+2*(k.qcols+k.qrows)){
			this.border[id].cx = k.qcols*2;
			this.border[id].cy = (id-((k.qcols-1)*k.qrows+k.qcols*(k.qrows-1))-2*k.qcols-k.qrows)*2+1;
		}
	},
	//-------------------------------------------------------------------
	isNullCell : function(id){
		if(id<0 || this.cell.length<=id){ return false;}
		return ((this.cell[id].qans==-1)&&(this.cell[id].qsub==0)&&(this.cell[id].ques==0)&&(this.cell[id].qnum==-1)&&(this.cell[id].direc==0));
	},
	isNullCross : function(id){
		if(id<0 || this.cross.length<=id){ return false;}
		return (this.cross[id].qnum==-1);
	},
	isNullBorder : function(id){
		if(id<0 || this.border.length<=id){ return false;}
		return ((this.border[id].qans==0)&&(this.border[id].qsub==0)&&(this.border[id].ques==0)&&(this.border[id].line==0));
	},

	//-------------------------------------------------------------------
	getcnum : function(cx,cy){
		return this.getcnum2(cx,cy,k.qcols,k.qrows);
	},
	getcnum2 : function(cx,cy,qc,qr){
		if(cx>=0&&cx<=qc-1&&cy>=0&&cy<=qr-1){ return cx+cy*qc;}
		else if(k.outside==1){
			if     (cy==-1&&(cx>=0&&cx<=qc-1)){ return qc*qr+cx;}
			else if(cy==qr&&(cx>=0&&cx<=qc-1)){ return qc*qr+qc+cx;}
			else if(cx==-1&&(cy>=0&&cy<=qr-1)){ return qc*qr+2*qc+cy;}
			else if(cx==qc&&(cy>=0&&cy<=qr-1)){ return qc*qr+2*qc+qr+cy;}
		}
		return -1;
	},
	getxnum : function(cx,cy){
		if(cx>=0&&cx<=k.qcols&&cy>=0&&cy<=k.qrows){ return cx+cy*(k.qcols+1);}
		return -1;
	},
	getxnum2 : function(cx,cy,qc,qr){
		if(cx>=0&&cx<=qc&&cy>=0&&cy<=qr){ return cx+cy*(qc+1);}
		return -1;
	},
	getbnum : function(cx,cy){
		return this.getbnum2(cx,cy,k.qcols,k.qrows);
	},
	getbnum2 : function(cx,cy,qc,qr){
		if(cx>=1&&cx<=qc*2-1&&cy>=1&&cy<=qr*2-1){
			if(cx%2==0 && cy%2==1){ return int((cx-1)/2)+int((cy-1)/2)*(qc-1);}
			else if(cx%2==1 && cy%2==0){ return int((cx-1)/2)+int((cy-2)/2)*qc+(qc-1)*qr;}
		}
		else if(k.outside==1||k.isborderAsLine==1){
			if     (cy==0   &&cx%2==1&&(cx>=1&&cx<=2*qc-1)){ return (qc-1)*qr+qc*(qr-1)+int((cx-1)/2);}
			else if(cy==2*qr&&cx%2==1&&(cx>=1&&cx<=2*qc-1)){ return (qc-1)*qr+qc*(qr-1)+qc+int((cx-1)/2);}
			else if(cx==0   &&cy%2==1&&(cy>=1&&cy<=2*qr-1)){ return (qc-1)*qr+qc*(qr-1)+2*qc+int((cy-1)/2);}
			else if(cx==2*qc&&cy%2==1&&(cy>=1&&cy<=2*qr-1)){ return (qc-1)*qr+qc*(qr-1)+2*qc+qr+int((cy-1)/2);}
		}
		return -1;
	},

	//-------------------------------------------------------------------
	// Cross�֘A�֐�
	bcntCross : function(cx,cy) {
		var cnt = 0;
		if(this.getQansCell(this.getcnum(cx-1, cy-1))==1){ cnt++;}
		if(this.getQansCell(this.getcnum(cx  , cy-1))==1){ cnt++;}
		if(this.getQansCell(this.getcnum(cx-1, cy  ))==1){ cnt++;}
		if(this.getQansCell(this.getcnum(cx  , cy  ))==1){ cnt++;}
		return cnt;
	},

	//-------------------------------------------------------------------
	// Border�֘A�֐�
	lcntCell : function(cx,cy){
		var cc = this.getcnum(cx,cy);
		if(cc==-1){ return 0;}

		var cnt = 0;
		if(this.getLineBorder(this.cell[cc].ub())==1){ cnt++;}
		if(this.getLineBorder(this.cell[cc].db())==1){ cnt++;}
		if(this.getLineBorder(this.cell[cc].lb())==1){ cnt++;}
		if(this.getLineBorder(this.cell[cc].rb())==1){ cnt++;}
		return cnt;
	},
	lcntCross : function(cx,cy){
		var self = this;
		var func = function(id){ return (id!=-1&&((self.getQuesBorder(id)==1)||(self.getQansBorder(id)==1)));};
		var cnt = 0;
		if(cy>0       && ( (k.outside==0 && k.isborderAsLine==0 && (cx==0 || cx==k.qcols)) || func(this.getbnum(cx*2  ,cy*2-1)) ) ){ cnt++;}
		if(cy<k.qrows && ( (k.outside==0 && k.isborderAsLine==0 && (cx==0 || cx==k.qcols)) || func(this.getbnum(cx*2  ,cy*2+1)) ) ){ cnt++;}
		if(cx>0       && ( (k.outside==0 && k.isborderAsLine==0 && (cy==0 || cy==k.qrows)) || func(this.getbnum(cx*2-1,cy*2  )) ) ){ cnt++;}
		if(cx<k.qcols && ( (k.outside==0 && k.isborderAsLine==0 && (cy==0 || cy==k.qrows)) || func(this.getbnum(cx*2+1,cy*2  )) ) ){ cnt++;}
		return cnt;
	},

	backLine : function(id){
		if(id==-1){ return -1;}
		var straight, curve1, curve2, func;
		if(k.isborderAsLine==0){
			straight = this.getbnum(this.border[id].cx-(this.border[id].cy%2)*2  , this.border[id].cy-(this.border[id].cx%2)*2  );
			curve1   = this.getbnum(this.border[id].cx-1                         , this.border[id].cy-1                         );
			curve2   = this.getbnum(this.border[id].cx+(this.border[id].cx%2)*2-1, this.border[id].cy+(this.border[id].cy%2)*2-1);
			func = this.getLineBorder.bind(bd);
		}
		else{
			straight = this.getbnum(this.border[id].cx-(this.border[id].cx%2)*2  , this.border[id].cy-(this.border[id].cy%2)*2  );
			curve1   = this.getbnum(this.border[id].cx-1                         , this.border[id].cy-1                         );
			curve2   = this.getbnum(this.border[id].cx+(this.border[id].cy%2)*2-1, this.border[id].cy+(this.border[id].cx%2)*2-1);
			func = this.getQansBorder.bind(bd);
		}

		if(func(straight)==1){ return straight;}
		else if(func(curve1)==1 && func(curve2)!=1){ return curve1;}
		else if(func(curve1)!=1 && func(curve2)==1){ return curve2;}
		return -1;
	},
	nextLine : function(id){
		if(id==-1){ return -1;}
		var straight, curve1, curve2, func;
		if(k.isborderAsLine==0){
			straight = this.getbnum(this.border[id].cx+(this.border[id].cy%2)*2  , this.border[id].cy+(this.border[id].cx%2)*2  );
			curve1   = this.getbnum(this.border[id].cx+1                         , this.border[id].cy+1                         );
			curve2   = this.getbnum(this.border[id].cx-(this.border[id].cx%2)*2+1, this.border[id].cy-(this.border[id].cy%2)*2+1);
			func = this.getLineBorder.bind(bd);
		}
		else{
			straight = this.getbnum(this.border[id].cx+(this.border[id].cx%2)*2  , this.border[id].cy+(this.border[id].cy%2)*2  );
			curve1   = this.getbnum(this.border[id].cx+1                         , this.border[id].cy+1                         );
			curve2   = this.getbnum(this.border[id].cx-(this.border[id].cy%2)*2+1, this.border[id].cy-(this.border[id].cx%2)*2+1);
			func = this.getQansBorder.bind(bd);
		}

		if(func(straight)==1){ return straight;}
		else if(func(curve1)==1 && func(curve2)!=1){ return curve1;}
		else if(func(curve1)!=1 && func(curve2)==1){ return curve2;}
		return -1;
	},
	forwardLine : function(id, backwardid){
		var retid = this.nextLine(id);
		if(retid==-1 || retid==backwardid){ retid = this.backLine(id);}
		if(retid!=backwardid){ return retid;}
		return -1;
	},

	//-------------------------------------------------------------------
	// Cell�֘AGet/Set�֐� <- �eCell�������Ă���ƃ������������������̂ł����ɒu������.
	setQuesCell : function(id, num) {
		if(id<0 || this.cell.length<=id){ return;}

		um.addOpe('cell', 'ques', id, this.getQuesCell(id), num);
		this.cell[id].ques = num;
	},
	getQuesCell : function(id){
		if(id<0 || this.cell.length<=id){ return -1;}
		return this.cell[id].ques;
	},
	setQnumCell : function(id, num) {
		if(id<0 || this.cell.length<=id){ return;}
		if(k.dispzero==0 && num==0){ return;}

		var old = this.getQnumCell(id);
		um.addOpe('cell', 'qnum', id, old, num);
		this.cell[id].qnum = num;

		if(k.puzzleid=="lightup" && mv.paintAkari && ((old==-1)^(num==-1))){ mv.paintAkari(id);}
	},
	getQnumCell : function(id){
		if(id<0 || this.cell.length<=id){ return -1;}
		return this.cell[id].qnum;
	},
	setQansCell : function(id, num) {
		if(id<0 || this.cell.length<=id){ return;}

		var old = this.getQansCell(id);
		um.addOpe('cell', 'qans', id, old, num);
		this.cell[id].qans = num;

		if(k.puzzleid=="lightup" && mv.paintAkari && ((old==1)^(num==1))){ mv.paintAkari(id);}
	},
	getQansCell : function(id){
		if(id<0 || this.cell.length<=id){ return -1;}
		return this.cell[id].qans;
	},
	setQsubCell : function(id, num) {
		if(id<0 || this.cell.length<=id){ return;}

		um.addOpe('cell', 'qsub', id, this.getQsubCell(id), num);
		this.cell[id].qsub = num;
	},
	getQsubCell : function(id){
		if(id<0 || this.cell.length<=id){ return -1;}
		return this.cell[id].qsub;
	},
	//-------------------------------------------------------------------
	// Cross�֘AGet/Set�֐� <- �eCross�������Ă���ƃ������������������̂ł����ɒu������.
	// �����̃I�u�W�F�N�g
	setQnumCross : function(id, num) {
		if(!k.iscross || id<0 || this.cross.length<=id){ return;}

		um.addOpe('cross', 'qnum', id, this.getQnumCross(id), num);
		this.cross[id].qnum = num;
	},
	getQnumCross : function(id){
		if(!k.iscross || id<0 || this.cross.length<=id){ return -1;}
		return this.cross[id].qnum;
	},

	//-------------------------------------------------------------------
	// Border�֘AGet/Set�֐� <- �eBorder�������Ă���ƃ������������������̂ł����ɒu������.
	setQuesBorder : function(id, num) {
		if(!k.isborder || id<0 || this.border.length<=id){ return;}
		if(this.border[id].ques == num){ return;}

		um.addOpe('border', 'ques', id, this.getQuesBorder(id), num);
		this.border[id].ques = num;

		if(k.isOneNumber){
			if(num==1){ room.setLineToRarea(id);}
			else{ room.removeLineFromRarea(id);}
		}
	},
	getQuesBorder : function(id){
		if(!k.isborder || id<0 || this.border.length<=id){ return -1;}
		return this.border[id].ques;
	},
	setQansBorder : function(id, num) {
		if(!k.isborder || id<0 || this.border.length<=id){ return;}
		if(this.border[id].qans == num){ return;}

		if(k.irowake!=0 && k.isborderAsLine && num!=1){ col.setLineColor(id, num);}

		um.addOpe('border', 'qans', id, this.getQansBorder(id), num);
		this.border[id].qans = num;

		if(k.irowake!=0 && k.isborderAsLine && num==1){ col.setLineColor(id, num);}
	},
	getQansBorder : function(id){
		if(!k.isborder || id<0 || this.border.length<=id){ return -1;}
		return this.border[id].qans;
	},
	setQsubBorder : function(id, num) {
		if(!k.isborder || id<0 || this.border.length<=id){ return;}
		if(this.border[id].qsub == num){ return;}

		um.addOpe('border', 'qsub', id, this.getQsubBorder(id), num);
		this.border[id].qsub = num;
	},
	getQsubBorder : function(id){
		if(!k.isborder || id<0 || this.border.length<=id){ return -1;}
		return this.border[id].qsub;
	},
	setLineBorder : function(id, num) {
		if(!k.isborder || id<0 || this.border.length<=id){ return;}
		if(this.border[id].line == num){ return;}

		if(k.irowake!=0 && num!=1){ col.setLineColor(id, num);}

		um.addOpe('border', 'line', id, this.getLineBorder(id), num);
		this.border[id].line = num;

		if(k.irowake!=0 && num==1){ col.setLineColor(id, num);}
	},
	getLineBorder : function(id){
		if(!k.isborder || id<0 || this.border.length<=id){ return -1;}
		return this.border[id].line;
	},

	//-------------------------------------------------------------------
	// �����\���֐�
	dispnumCell : function(id){
		if(this.getQnumCell(id)>0||(this.getQnumCell(id)==0&&k.dispzero==1)||(this.getQnumCell(id)==-2&&k.isDispHatena==1)||
				((k.isAnsNumber)&&(this.getQansCell(id)>0||(this.getQansCell(id)==0&&k.dispzero==1))) ){
			if(!this.cell[id].numobj){ this.cell[id].numobj = CreateDOMAndSetNop();}

			var obj = this.cell[id].numobj;

			var num = (this.getQnumCell(id)!=-1 ? this.getQnumCell(id) : this.getQansCell(id));

			if(num>=0){ obj.innerHTML = ""+num;}
			else{ obj.innerHTML = "?";}

			if     (k.isDispNumUL==1){ obj.style.fontSize = int(k.cwidth*0.45*pc.fontsizeratio)+'px';}
			else if(num<10)          { obj.style.fontSize = int(k.cwidth*0.8 *pc.fontsizeratio)+'px';}
			else					 { obj.style.fontSize = int(k.cwidth*0.7 *pc.fontsizeratio)+'px';}

			if(Prototype.Browser.IE){
				var fontsize = parseInt(obj.style.fontSize);
				if(fontsize>24){ obj.style.paddingTop = obj.style.paddingBottom = int((fontsize-24)/2);}
			}

			var wid = Element.getDimensions(obj).width/2;
			var hgt = Element.getDimensions(obj).height/2;

			if(k.isDispNumUL==0){
				obj.style.left = k.cv_oft.x + this.cell[id].px()+int(k.cwidth/2) -wid+(!Prototype.Browser.IE?2:4);
				obj.style.top  = k.cv_oft.y + this.cell[id].py()+int(k.cheight/2)-hgt+(!Prototype.Browser.IE?1:5);
			}
			else{
				obj.style.left = k.cv_oft.x + this.cell[id].px()+(!Prototype.Browser.IE?4:7);
				obj.style.top  = k.cv_oft.y + this.cell[id].py()+(!Prototype.Browser.IE?-2:2)+int(k.cheight/10);
			}

			if((k.BlackCell==0 ? this.cell[id].ques!=0 : this.cell[id].qans==1)){ obj.style.color = pc.BCell_fontcolor;}
			else if(this.cell[id].error==1)                                     { obj.style.color = pc.fontErrcolor;   }
			else if(k.isAnsNumber && this.getQansCell(id)!=-1)                  { obj.style.color = pc.fontAnscolor;   }
			else                                                                { obj.style.color = pc.fontcolor;      }

			Element.show(obj);
		}
		else if(this.cell[id].numobj){ Element.hide(this.cell[id].numobj);}
	},
	dispnumCross : function(id){
		if(this.getQnumCross(id)>0||(this.getQnumCross(id)==0&&k.dispzero==1)){
			if(!this.cross[id].numobj){ this.cross[id].numobj = CreateDOMAndSetNop();}

			this.cross[id].numobj.innerHTML = ""+this.getQnumCross(id);

			//Element.getStyle(this.cross[id].numobj, 'width');
			this.cross[id].numobj.style.fontSize = (k.cwidth*0.6)+'px';

			var wid = Element.getDimensions(this.cross[id].numobj).width/2;
			var hgt = Element.getDimensions(this.cross[id].numobj).height/2;

			this.cross[id].numobj.style.left = k.cv_oft.x + this.cross[id].px()-wid+(!Prototype.Browser.IE?2:4);
			this.cross[id].numobj.style.top  = k.cv_oft.y + this.cross[id].py()-hgt+(!Prototype.Browser.IE?1:5);
			this.cross[id].numobj.style.color = pc.crossnumcolor;

			Element.show(this.cross[id].numobj);
		}
		else if(this.cross[id].numobj){ Element.hide(this.cross[id].numobj);}
	}
};

//---------------------------------------------------------------------------
// ��Colors�N���X ��ɐF�����̏����Ǘ�����
//    col.getNewLineColor()
//      �V�����F��Ԃ�
//
//    col.setLineColor(id,val)
//      ���͂��ꂽ���ɉ����Ď��ӂ̐��̐F��ύX����
//    col.setLineColor1(id,cc1,cc2)
//      ���͂��ꂽ���ɉ����Ď��ӂ̐��̐F��ύX����(������������)
//    col.setLineColor2(id,cc1,cc2)
//      ���͂��ꂽ���ɉ����Ď��ӂ̐��̐F��ύX����(������������)
//
//    col.lcntCell(cc)
//      ���͂��ꂽ���ɉ����Ď��ӂ̐��̐F��ύX����
//    col.changeColors(startid,backid,col)
//      startid�Ɍq�����Ă�����̐F��col�ɕς���
//    col.tshapeid(cc)
//      lcnt==3�̎��A�s���H�̂Ԃ����Ă��������Line��ID��Ԃ�
//---------------------------------------------------------------------------
// Colors�N���X�̒�`
Colors = Class.create();
Colors.prototype = {
	initialize : function(){
		this.linecolors = [	"rgb(  0,160,  0)", "rgb(128,128,255)", "rgb(255,128,128)", "rgb(  0,  0,255)",
							"rgb(  0,255,  0)", "rgb(128,128,128)", "rgb(255, 32, 32)", "rgb(  0,255,255)",
							"rgb( 64, 64, 64)", "rgb( 64,192,128)", "rgb(192,192,  0)", "rgb(192,192,192)",
							"rgb(  0,  0,128)", "rgb(255,  0,112)", "rgb(  0,128,255)", "rgb(255,  0,255)",
							"rgb(  0,255,128)", "rgb(128,128,  0)", "rgb(128,  0,  0)", "rgb(128,255,128)"  ];
		this.linecolorval = -1;
	},
	getNewLineColor : function(){
		this.linecolorval++;
		return this.linecolors[this.linecolorval % 20];
	},
	setLineColor : function(id, val){
		var cc1, cc2;
		if(k.isborderAsLine==0){
			cc1 = bd.getcnum(int((bd.border[id].cx-(bd.border[id].cy%2))/2), int((bd.border[id].cy-(bd.border[id].cx%2))/2) );
			cc2 = bd.getcnum(int((bd.border[id].cx+(bd.border[id].cy%2))/2), int((bd.border[id].cy+(bd.border[id].cx%2))/2) );
		}
		else{
			cc1 = bd.getxnum(int((bd.border[id].cx-(bd.border[id].cx%2))/2), int((bd.border[id].cy-(bd.border[id].cy%2))/2) );
			cc2 = bd.getxnum(int((bd.border[id].cx+(bd.border[id].cx%2))/2), int((bd.border[id].cy+(bd.border[id].cy%2))/2) );
		}

		if(val==1){ this.setLineColor1(id,cc1,cc2);}
		else      { this.setLineColor2(id,cc1,cc2);}
	},
	setLineColor1 : function(id, cc1, cc2){
		var setc = "";
		if(cc1!=-1 && bd.backLine(id)!=-1){
			if(this.lcntCell(cc1)!=3){
				setc = bd.border[bd.backLine(id)].color;
			}
			else{
				setc = bd.border[bd.backLine(id)].color;
				this.changeColors(bd.backLine(id), id, setc);
				if(!ans.isConnectLine(this.tshapeid(cc1),id,-1)){ this.changeColors(this.tshapeid(cc1), -1, this.getNewLineColor());}
			}
		}
		if(cc2!=-1 && bd.nextLine(id)!=-1){
			if(this.lcntCell(cc2)!=3){
				if(!setc){ setc = bd.border[bd.nextLine(id)].color;}
				else{ this.changeColors(bd.nextLine(id), id, setc);}
			}
			else{
				if(!setc){ setc = bd.border[bd.nextLine(id)].color;}
				this.changeColors(bd.nextLine(id), id, setc);
				if(!ans.isConnectLine(this.tshapeid(cc2),id,-1)){ this.changeColors(this.tshapeid(cc2), -1, this.getNewLineColor());}
			}
		}

		if(!setc){ bd.border[id].color = this.getNewLineColor();}
		else{ bd.border[id].color = setc;}
	},
	setLineColor2 : function(id, cc1, cc2){
		var keeped = 0;
		var firstchange = false;
		if(cc1!=-1 && cc2!=-1){
			if(!ans.isLoopLine(id) && cc1!=-1 && (this.lcntCell(cc1)==2 || this.lcntCell(cc1)==4)){
				keeped=1;
			}
			else if(cc1!=-1 && this.lcntCell(cc1)==3 && this.tshapeid(cc1)!=id){
				this.changeColors(this.tshapeid(cc1), -1, bd.border[bd.backLine(id)].color);
				firstchange = true;
				if(!ans.isConnectLine(bd.nextLine(id), this.tshapeid(cc1), id)){ keeped=1;}
			}
			
			if(!ans.isLoopLine(id) && cc2!=-1 && (this.lcntCell(cc2)==2 || this.lcntCell(cc2)==4) && keeped==1){
				this.changeColors(bd.nextLine(id), id, this.getNewLineColor());
			}
			else if(cc2!=-1 && this.lcntCell(cc2)==3 && this.tshapeid(cc2)!=id){
				if(keeped==0){ this.changeColors(this.tshapeid(cc2), -1, bd.border[bd.nextLine(id)].color);}
				else{
					if(ans.isConnectLine(this.tshapeid(cc2),bd.nextLine(id),-1)){
						if(!ans.isConnectLine(bd.backLine(id),this.tshapeid(cc2),id)){ this.changeColors(bd.nextLine(id), -1, this.getNewLineColor());}
					}
					else{
						this.changeColors(bd.nextLine(id), -1, bd.border[this.tshapeid(cc2)].color);
						if(firstchange){ this.changeColors(this.tshapeid(cc1), -1, bd.border[bd.backLine(id)].color);}
					}
				}
			}
		}
		bd.border[id].color = "";
	},
	lcntCell : function(id){
		if(k.isborderAsLine==0){
			if(id==-1 || id>=bd.cell.length){ return -1;}
			return bd.lcntCell(bd.cell[id].cx,bd.cell[id].cy);
		}
		else{
			if(id==-1 || id>=(k.qcols+1)*(k.qrows+1)){ return -1;}
			return bd.lcntCross(id%(k.qcols+1), int(id/(k.qcols+1)));
		}
	},
	changeColors : function(startid, backid, col){
		this.changeLines(startid, backid, col, function(id,col){
			bd.border[id].color = col;
			if($("irowake").checked){
				if(k.isborderAsLine==0){ pc.drawLine1(id);}
				else{ pc.drawBorder1(id);}
			}
		});
	},
	changeErrors : function(startid, backid, val){
		this.changeLines(startid, backid, val, function(id,val){ bd.border[id].error = val;})
	},
	changeLines : function(startid, backid, col, func){
		if(startid==-1){ return;}
		var forward = -1;
		var here = startid;
		var backward = backid;
		while(k.qcols*k.qrows*3){
			func(here,col);
			forward = bd.forwardLine(here, backward);
			backward = here; here = forward;
			if(forward==startid || forward==-1){ break;}
		}
	},
	tshapeid : function(cc){
		var bx, by, func;
		if(k.isborderAsLine==0){
			bx = cc%(k.qcols)*2+1; by = int(cc/(k.qcols))*2+1;
			if(cc==-1 || bd.lcntCell(bd.cell[cc].cx,bd.cell[cc].cy)!=3){ return -1;}
			func = bd.getLineBorder.bind(bd);
		}
		else{
			bx = cc%(k.qcols+1)*2; by = int(cc/(k.qcols+1))*2;
			if(cc==-1 || bd.lcntCross(int(bx/2),int(by/2))!=3){ return -1;}
			func = bd.getQansBorder.bind(bd);
		}

		if     (func(bd.getbnum(bx-1,by  ))!=1){ return bd.getbnum(bx+1,by  );}
		else if(func(bd.getbnum(bx+1,by  ))!=1){ return bd.getbnum(bx-1,by  );}
		else if(func(bd.getbnum(bx  ,by-1))!=1){ return bd.getbnum(bx  ,by+1);}
		else if(func(bd.getbnum(bx  ,by+1))!=1){ return bd.getbnum(bx  ,by-1);}

		return -1;
	}
};

//---------------------------------------------------------------------------
// ��Graphic�N���X Canvas�ɕ`�悷��
//    pc.paint(x1,y1,x2,y2)
//      ���W(x1,y1)-(x2,y2)���ĕ`�悷��B�e�p�Y���̃t�@�C���ŃI�[�o�[���C�h�����B
//
//    pc.drawCells(x1,y1,x2,y2)
//      Cell�́����w�i�F/�E(pc.bcolor=="white"�̏ꍇ)��Canvas�ɏ�������
//    pc.drawErrorCells(x1,y1,x2,y2)
//      Error����Cell�̔w�i�F��Canvas�ɏ�������
//    pc.drawBCells(x1,y1,x2,y2)
//      Cell�́��Ɛ�����Canvas�ɏ�������
//    pc.drawCrosses(x1,y1,x2,y2)
//      Cross�̊ې�����Canvas�ɏ�������
//
//    pc.drawNumbers(x1,y1,x2,y2)
//      Cell�̐�����Canvas�ɏ�������
//
//    pc.drawTriangle(x1,y1,x2,y2)
//      �O�p�`��Canvas�ɏ�������
//
//    pc.drawMBs(x1,y1,x2,y2)
//      Cell��́�,�~��Canvas�ɏ�������
//
//    pc.drawBorders(x1,y1,x2,y2)
//      ���E����Canvas�ɏ�������
//    pc.drawLines(x1,y1,x2,y2)
//      �񓚂̐���Canvas�ɏ�������
//    pc.drawPekes(x1,y1,x2,y2,flag)
//      ���E����́~��Canvas�ɏ�������
//
//    pc.drawTCell(x1,y1,x2,y2)
//      Cell�̃L�[�{�[�h����̓��͑Ώۂ�Canvas�ɏ�������
//    pc.drawTCross(x1,y1,x2,y2)
//      Cross�̃L�[�{�[�h����̓��͑Ώۂ�Canvas�ɏ�������
//
//    pc.drawBDline(x1,y1,x2,y2)
//      �Z���̘g��(����)��Canvas�ɏ�������
//    pc.drawChassis(x1,y1,x2,y2)
//      �O�g��Canvas�ɏ�������
//
//    pc.flushCanvas(x1,y1,x2,y2)
//      �w�肳�ꂽ�̈�𔒂œh��Ԃ�
//    pc.flushCanvasAll()
//      Canvas�S�ʂ𔒂œh��Ԃ�
//---------------------------------------------------------------------------

// �p�Y������ Canvas/DOM���䕔
// Graphic�N���X�̒�`
Graphic = Class.create();
Graphic.prototype = {
	// Graphic�N���X�̊֐����`
	initialize : function(){
		// �Ֆʂ�Cell�𕪂���F
		this.BDlinecolor = "black";

		// �Z���̐F(���}�X)
		this.Cellcolor = "black";
		this.errcolor1 = "rgb(224, 0, 0)";
		this.errcolor2 = "rgb(32, 32, 255)";
		this.errcolor3 = "rgb(0, 191, 0)";

		// �Z���́��~�̐F(�⏕�L��)
		this.MBcolor = "rgb(255, 127, 64)";

		// �t�H���g�̐F(���}�X/���}�X)
		this.fontcolor = "black";
		this.fontAnscolor = "rgb(0, 160, 0)";
		this.fontErrcolor = "rgb(191, 0, 0)";
		this.BCell_fontcolor = "white";

		this.fontsizeratio = 1.0;	// �����̔{��

		// �Z���̔w�i�F(���}�X)
		this.bcolor = "white";
		this.errbcolor1 = "rgb(255, 191, 191)";
		this.errbcolor2 = "rgb(64, 255, 64)";

		// �t�H���g�̐F(��_�̐���)
		this.crossnumcolor = "black";

		this.crosssize = 0.4;

		// ���E���̐F
		this.BorderQuescolor = "black";
		this.BorderQanscolor = "rgb(0, 191, 0)";
		this.BorderQsubcolor = "rgb(255, 0, 255)";

		this.BBcolor = "rgb(96, 96, 96)"; // ���E���ƍ��}�X�𕪂���F

		// ���E�~�̐F
		this.linecolor = "rgb(0, 160, 0)";	// �F�����Ȃ��̏ꍇ
		this.pekecolor = "rgb(32, 32, 255)";

		this.errlinecolor1 = "rgb(255, 0, 0)";
		this.errlinecolor2 = "rgb(191, 191, 191)";
	},
	paint : function(x1,y1,x2,y2){ }, //�I�[�o�[���C�h�p
	paintAll : function(){ this.paint(-1,-1,k.qcols,k.qrows);},
	paintBorder : function(id){
		if(isNaN(id) || !bd.border[id]){ return;}
		if(bd.border[id].cx%2==1){
			this.paint(int((bd.border[id].cx-1)/2)-1, int(bd.border[id].cy/2)-1,
					   int((bd.border[id].cx-1)/2)+1, int(bd.border[id].cy/2)   );
		}
		else{
			this.paint(int(bd.border[id].cx/2)-1, int((bd.border[id].cy-1)/2)-1,
					   int(bd.border[id].cx/2)  , int((bd.border[id].cy-1)/2)+1 );
		}
	},
	paintLine : function(id){
		if(isNaN(id) || !bd.border[id]){ return;}
		if(bd.border[id].cx%2==1){
			this.paint(int((bd.border[id].cx-1)/2), int(bd.border[id].cy/2)-1,
					   int((bd.border[id].cx-1)/2), int(bd.border[id].cy/2)   );
		}
		else{
			this.paint(int(bd.border[id].cx/2)-1, int((bd.border[id].cy-1)/2),
					   int(bd.border[id].cx/2)  , int((bd.border[id].cy-1)/2) );
		}
	},

	//--------------------------------------------------------------------
	drawBlackCells : function(x1,y1,x2,y2){
		var dsize = k.cwidth*0.06;
		var i;
		for(i=0;i<bd.cell.length;i++){
			if(bd.cell[i].cx < x1 || x2 < bd.cell[i].cx){ continue;}
			if(bd.cell[i].cy < y1 || y2 < bd.cell[i].cy){ continue;}
			if(bd.getQansCell(i)!=1){ continue;}

			if(bd.cell[i].error==0){ g.fillStyle = this.Cellcolor;}
			else if(bd.cell[i].error==1){ g.fillStyle = this.errcolor1;}
			else if(bd.cell[i].error==2){ g.fillStyle = this.errcolor2;}
			else if(bd.cell[i].error==3){ g.fillStyle = this.errcolor3;}
			if(this.vnop("c"+i+"_full_",1)){ g.fillRect(bd.cell[i].px(), bd.cell[i].py(), k.cwidth+1, k.cheight+1);}
			this.vhide("c"+i+"_dot_");
		}

		this.vinc();
	},
	drawWhiteCells : function(x1,y1,x2,y2){
		var dsize = k.cwidth*0.06;
		var i;
		for(i=0;i<bd.cell.length;i++){
			if(bd.cell[i].cx < x1 || x2 < bd.cell[i].cx){ continue;}
			if(bd.cell[i].cy < y1 || y2 < bd.cell[i].cy){ continue;}
			if(bd.getQansCell(i)==1){ continue;}

			if(bd.cell[i].error!=0){
				if     (bd.cell[i].error==1){ g.fillStyle = this.errbcolor1;}
				else if(bd.cell[i].error==2){ g.fillStyle = this.errbcolor2;}
				if(this.vnop("c"+i+"_full_",1)){ g.fillRect(bd.cell[i].px(), bd.cell[i].py(), k.cwidth+1, k.cheight+1);}
			}

			if(bd.getQsubCell(i)==1){
				if(this.bcolor=="white"){
					g.fillStyle = "black";
					g.beginPath();
					g.arc(bd.cell[i].px()+k.cwidth/2, bd.cell[i].py()+k.cheight/2, dsize, 0, Math.PI*2, false);
					if(this.vnop("c"+i+"_dot_",1)){ g.fill();}
					if(bd.cell[i].error==0){ this.vhide("c"+i+"_full_");}
				}
				else if(bd.cell[i].error==0){
					g.fillStyle = this.bcolor;
					if(this.vnop("c"+i+"_full_",1)){ g.fillRect(bd.cell[i].px(), bd.cell[i].py(), k.cwidth+1, k.cheight+1);}
				}
			}
			else{ if(bd.cell[i].error==0){ this.vhide("c"+i+"_full_");} this.vhide("c"+i+"_dot_");}
		}

		this.vinc();
	},
	drawErrorCells : function(x1,y1,x2,y2){
		var i;
		for(i=0;i<bd.cell.length;i++){
			if(bd.cell[i].cx < x1 || x2 < bd.cell[i].cx){ continue;}
			if(bd.cell[i].cy < y1 || y2 < bd.cell[i].cy){ continue;}

			if(bd.cell[i].error){
				if     (bd.cell[i].error==1){ g.fillStyle = this.errbcolor1;}
				else if(bd.cell[i].error==2){ g.fillStyle = this.errbcolor2;}
				if(this.vnop("c"+i+"_full_",1)){ g.fillRect(bd.cell[i].px(), bd.cell[i].py(), k.cwidth, k.cheight);}
			}
			else{ this.vhide("c"+i+"_full_");}
		}

		this.vinc();
	},
	drawBCells : function(x1,y1,x2,y2){
		var i;
		for(i=0;i<bd.cell.length;i++){
			if(bd.cell[i].cx < x1 || x2 < bd.cell[i].cx){ continue;}
			if(bd.cell[i].cy < y1 || y2 < bd.cell[i].cy){ continue;}

			if(bd.getQnumCell(i)!=-1){
				if(bd.cell[i].error==1){ g.fillStyle = this.errcolor1;}
				else{ g.fillStyle = this.Cellcolor;}
				if(this.vnop("c"+i+"_full_",1)){ g.fillRect(bd.cell[i].px(), bd.cell[i].py(), k.cwidth+1, k.cheight+1);}
			}
			else if(bd.cell[i].error==0){ this.vhide("c"+i+"_full_");}
			bd.dispnumCell(i);
		}

		this.vinc();
	},

	drawNumbers : function(x1,y1,x2,y2){
		var i;
		for(i=0;i<bd.cell.length;i++){
			if(bd.cell[i].cx < x1 || x2 < bd.cell[i].cx){ continue;}
			if(bd.cell[i].cy < y1 || y2 < bd.cell[i].cy){ continue;}

			bd.dispnumCell(i);
		}

		this.vinc();
	},

	//--------------------------------------------------------------------
	drawCrosses : function(x1,y1,x2,y2){
		var csize = k.cwidth*this.crosssize;
		var i;
		for(i=0;i<bd.cross.length;i++){
			if(bd.cross[i].cx < x1 || x2 < bd.cross[i].cx){ continue;}
			if(bd.cross[i].cy < y1 || y2 < bd.cross[i].cy){ continue;}

			if(bd.getQnumCross(i)!=-1){
				if(bd.cross[i].error==1){ g.fillStyle = this.errcolor1;}
				else{ g.fillStyle = "white";}
				g.strokeStyle = "black";
				g.beginPath();
				g.arc(bd.cross[i].px(), bd.cross[i].py(), csize, 0, Math.PI*2, false);
				if(this.vnop("x"+i+"_cp1_",1)){ g.fill();}
				if(Prototype.Browser.IE){
					g.beginPath();
					g.arc(bd.cross[i].px(), bd.cross[i].py(), csize, 0, Math.PI*2, false);
				}
				if(this.vnop("x"+i+"_cp2_",0)){ g.stroke();}
			}
			else{ this.vhide("x"+i+"_cp1_"); this.vhide("x"+i+"_cp2_");}
			bd.dispnumCross(i);
		}

		this.vinc();
	},
	drawCrossMarks : function(x1,y1,x2,y2){
		var csize = k.cwidth*this.crosssize;
		var i;
		for(i=0;i<bd.cross.length;i++){
			if(bd.cross[i].cx < x1-1 || x2+1 < bd.cross[i].cx){ continue;}
			if(bd.cross[i].cy < y1-1 || y2+1 < bd.cross[i].cy){ continue;}

			if(bd.getQnumCross(i)==1){
				if(bd.cross[i].error==1){ g.fillStyle = this.errcolor1;}
				else{ g.fillStyle = this.crossnumcolor;}
				g.beginPath();
				g.arc(bd.cross[i].px(), bd.cross[i].py(), csize, 0, Math.PI*2, false);
				if(this.vnop("x"+i+"_cm_",1)){ g.fill();}
			}
			else{ this.vhide("x"+i+"_cm_");}
		}

		this.vinc();
	},

	//--------------------------------------------------------------------
	drawBorders : function(x1,y1,x2,y2){
		var i;
		for(i=0;i<bd.border.length;i++){
			if(bd.border[i].cx < x1*2-2 || x2*2+2 < bd.border[i].cx){ continue;}
			if(bd.border[i].cy < y1*2-2 || y2*2+2 < bd.border[i].cy){ continue;}

			if(bd.getQuesBorder(i)!=1 && bd.getQansBorder(i)!=1){ this.vhide("b"+i+"_bd_"); continue;}

			this.drawBorder1(i);
		}

		this.vinc();
	},
	drawBorder1 : function(id){
		var lw = (int(k.cwidth/12)>=3?int(k.cwidth/12):3); //LineWidth
		var lm = int((lw-1)/2); //LineMargin

		if(bd.getQuesBorder(id)==1){ g.fillStyle = this.BorderQuescolor;}
		else if(bd.getQansBorder(id)==1){
			if     (k.isborderAsLine==0 && bd.border[id].error==1){ g.fillStyle = this.errcolor1;}
			else if(k.isborderAsLine==1 && bd.border[id].error==1){ g.fillStyle = this.errlinecolor1; lw++;}
			else if(k.isborderAsLine==1 && bd.border[id].error==2){ g.fillStyle = this.errlinecolor2;}
			else if(k.isborderAsLine==0 || k.irowake==0 || !$("irowake").checked || !bd.border[id].color){ g.fillStyle = this.BorderQanscolor;}
			else{ g.fillStyle = bd.border[id].color;}
		}

		if     (bd.border[id].cy%2==1){ if(this.vnop("b"+id+"_bd_",1)){ g.fillRect(bd.border[id].px()-lm,                 bd.border[id].py()-int(k.cheight/2)-lm, lw         , k.cheight+lw);} }
		else if(bd.border[id].cx%2==1){ if(this.vnop("b"+id+"_bd_",1)){ g.fillRect(bd.border[id].px()-int(k.cwidth/2)-lm, bd.border[id].py()-lm                 , k.cwidth+lw, lw          );} }
	},
	drawBorderQsubs : function(x1,y1,x2,y2){
		var i;
		var m = int(k.cwidth*0.15); //Margin
		for(i=0;i<bd.border.length;i++){
			if(bd.border[i].cx < x1*2-2 || x2*2+2 < bd.border[i].cx){ continue;}
			if(bd.border[i].cy < y1*2-2 || y2*2+2 < bd.border[i].cy){ continue;}

			if(bd.getQsubBorder(i)==1){ g.fillStyle = this.BorderQsubcolor;}
			else{ this.vhide("b"+i+"_qsub1_"); continue;}

			if     (bd.border[i].cx%2==1){ if(this.vnop("b"+i+"_qsub1_",1)){ g.fillRect(bd.border[i].px(),                   bd.border[i].py()-int(k.cheight/2)+m, 1,            k.cheight-2*m);} }
			else if(bd.border[i].cy%2==1){ if(this.vnop("b"+i+"_qsub1_",1)){ g.fillRect(bd.border[i].px()-int(k.cwidth/2)+m, bd.border[i].py(),                    k.cwidth-2*m, 1            );} }
		}

		this.vinc();
	},

	// �O�g���Ȃ��ꍇ�͍l�����Ă��܂���
	drawBoxBorders  : function(x1,y1,x2,y2,tileflag){
		var i;
		var lw = (int(k.cwidth/12)>=3?int(k.cwidth/12):3); //LineWidth
		var lm = int((lw-1)/2)+1; //LineMargin
		var cw = k.cwidth;
		var ch = k.cheight;

		g.fillStyle = this.BBcolor;

		for(i=0;i<k.qcols*k.qrows;i++){
			if(bd.cell[i].cx < x1 || x2 < bd.cell[i].cx){ continue;}
			if(bd.cell[i].cy < y1 || y2 < bd.cell[i].cy){ continue;}
			if(bd.getQansCell(i)!=1){ $R(1,12,false).each(function(n){ pc.vhide("c"+i+"_bb"+n+"_");}); continue;}

			var bx = 2*bd.cell[i].cx+1;
			var by = 2*bd.cell[i].cy+1;

			var px = bd.cell[i].px();
			var py = bd.cell[i].py();

			var isUP = ((bd.getQuesBorder(bd.getbnum(bx  ,by-1))!=1) && !(!k.outside&&by<=1));
			var isLT = ((bd.getQuesBorder(bd.getbnum(bx-1,by  ))!=1) && !(!k.outside&&bx<=1));
			var isRT = ((bd.getQuesBorder(bd.getbnum(bx+1,by  ))!=1) && !(!k.outside&&bx>=2*k.qcols-1));
			var isDN = ((bd.getQuesBorder(bd.getbnum(bx  ,by+1))!=1) && !(!k.outside&&by>=2*k.qrows-1));

			var isUL = (bd.getQuesBorder(bd.getbnum(bx-2,by-1))!=1 && bd.getQuesBorder(bd.getbnum(bx-1,by-2))!=1);
			var isUR = (bd.getQuesBorder(bd.getbnum(bx+2,by-1))!=1 && bd.getQuesBorder(bd.getbnum(bx+1,by-2))!=1);
			var isDL = (bd.getQuesBorder(bd.getbnum(bx-2,by+1))!=1 && bd.getQuesBorder(bd.getbnum(bx-1,by+2))!=1);
			var isDR = (bd.getQuesBorder(bd.getbnum(bx+2,by+1))!=1 && bd.getQuesBorder(bd.getbnum(bx+1,by+2))!=1);

			if(!isLT){ if(this.vnop("c"+i+"_bb1_",1)){ g.fillRect(px   +lm, py   +lm, 1    ,ch-lw);} }else{ this.vhide("c"+i+"_bb1_");}
			if(!isRT){ if(this.vnop("c"+i+"_bb2_",1)){ g.fillRect(px+cw-lm, py   +lm, 1    ,ch-lw);} }else{ this.vhide("c"+i+"_bb2_");}
			if(!isUP){ if(this.vnop("c"+i+"_bb3_",1)){ g.fillRect(px   +lm, py   +lm, cw-lw,1    );} }else{ this.vhide("c"+i+"_bb3_");}
			if(!isDN){ if(this.vnop("c"+i+"_bb4_",1)){ g.fillRect(px   +lm, py+ch-lm, cw-lw,1    );} }else{ this.vhide("c"+i+"_bb4_");}

			if(tileflag){
				if(isLT&&!(isUL&&isUP)){ if(this.vnop("c"+i+"_bb5_",1)){ g.fillRect(px   -lm, py   +lm, lw+1,1   );} }else{ this.vhide("c"+i+"_bb5_");}
				if(isLT&&!(isDL&&isDN)){ if(this.vnop("c"+i+"_bb6_",1)){ g.fillRect(px   -lm, py+ch-lm, lw+1,1   );} }else{ this.vhide("c"+i+"_bb6_");}
				if(isUP&&!(isUL&&isLT)){ if(this.vnop("c"+i+"_bb7_",1)){ g.fillRect(px   +lm, py   -lm, 1   ,lw+1);} }else{ this.vhide("c"+i+"_bb7_");}
				if(isUP&&!(isUR&&isRT)){ if(this.vnop("c"+i+"_bb8_",1)){ g.fillRect(px+cw-lm, py   -lm, 1   ,lw+1);} }else{ this.vhide("c"+i+"_bb8_");}
			}
			else{
				if(isLT&&!(isUL&&isUP)){ if(this.vnop("c"+i+"_bb5_" ,1)){ g.fillRect(px      , py   +lm, lm+1,1   );} }else{ this.vhide("c"+i+"_bb5_"); }
				if(isLT&&!(isDL&&isDN)){ if(this.vnop("c"+i+"_bb6_" ,1)){ g.fillRect(px      , py+ch-lm, lm+1,1   );} }else{ this.vhide("c"+i+"_bb6_"); }
				if(isUP&&!(isUL&&isLT)){ if(this.vnop("c"+i+"_bb7_" ,1)){ g.fillRect(px   +lm, py      , 1   ,lm+1);} }else{ this.vhide("c"+i+"_bb7_"); }
				if(isUP&&!(isUR&&isRT)){ if(this.vnop("c"+i+"_bb8_" ,1)){ g.fillRect(px+cw-lm, py      , 1   ,lm+1);} }else{ this.vhide("c"+i+"_bb8_"); }
				if(isRT&&!(isUR&&isUP)){ if(this.vnop("c"+i+"_bb9_" ,1)){ g.fillRect(px+cw-lm, py   +lm, lm+1,1   );} }else{ this.vhide("c"+i+"_bb9_"); }
				if(isRT&&!(isDR&&isDN)){ if(this.vnop("c"+i+"_bb10_",1)){ g.fillRect(px+cw-lm, py+ch-lm, lm+1,1   );} }else{ this.vhide("c"+i+"_bb10_");}
				if(isDN&&!(isDL&&isLT)){ if(this.vnop("c"+i+"_bb11_",1)){ g.fillRect(px   +lm, py+ch-lm, 1   ,lm+1);} }else{ this.vhide("c"+i+"_bb11_");}
				if(isDN&&!(isDR&&isRT)){ if(this.vnop("c"+i+"_bb12_",1)){ g.fillRect(px+cw-lm, py+ch-lm, 1   ,lm+1);} }else{ this.vhide("c"+i+"_bb12_");}
			}
		}
	},

	drawLines : function(x1,y1,x2,y2){
		var i;
		for(i=0;i<bd.border.length;i++){
			if(bd.border[i].cx < x1*2-2 || x2*2+2 < bd.border[i].cx){ continue;}
			if(bd.border[i].cy < y1*2-2 || y2*2+2 < bd.border[i].cy){ continue;}

			if(bd.getLineBorder(i)!=1){ this.vhide("b"+i+"_line_"); continue;}

			this.drawLine1(i);
		}

		this.vinc();
	},
	drawLine1 : function(id){
		var lw = (int(k.cwidth/12)>=3?int(k.cwidth/12):3); //LineWidth

		if     (bd.border[id].error==1){ g.fillStyle = this.errlinecolor1; lw++;}
		else if(bd.border[id].error==2){ g.fillStyle = this.errlinecolor2;}
		else if(k.irowake==0 || !$("irowake").checked || !bd.border[id].color){ g.fillStyle = this.linecolor;}
		else{ g.fillStyle = bd.border[id].color;}

		var lm = int((lw-1)/2); //LineMargin

		if(bd.border[id].cx%2==1){
			if(this.vnop("b"+id+"_line_",1)){ g.fillRect(bd.border[id].px()-lm, bd.border[id].py()-int(k.cheight/2)-1, lw, k.cheight+lw);}
		}
		else if(bd.border[id].cy%2==1){
			if(this.vnop("b"+id+"_line_",1)){ g.fillRect(bd.border[id].px()-int(k.cwidth/2)-lm, bd.border[id].py()-1, k.cwidth+lw, lw);}
		}

		this.vinc();
	},
	drawPekes : function(x1,y1,x2,y2,flag){
		var i;
		var size = int(k.cwidth*0.15);
		if(size<2){ size=2;}

		g.fillStyle = "white";

		for(i=0;i<bd.border.length;i++){
			if(bd.border[i].cx < x1*2-2 || x2*2+2 < bd.border[i].cx){ continue;}
			if(bd.border[i].cy < y1*2-2 || y2*2+2 < bd.border[i].cy){ continue;}

			if(bd.getQsubBorder(i)==2){ g.strokeStyle = this.pekecolor;}
			else{ this.vhide("b"+i+"_peke0_"); this.vhide("b"+i+"_peke1_"); this.vhide("b"+i+"_peke2_"); continue;}

			if(flag==0 || flag==2){
				if(this.vnop("b"+i+"_peke0_",1)){ g.fillRect(bd.border[i].px()-size, bd.border[i].py()-size, 2*size+1, 2*size+1);}
			}
			else{ this.vhide("b"+i+"_peke0_");}

			if(flag==0 || flag==1){
				g.beginPath();
				g.moveTo(bd.border[i].px()-size+1, bd.border[i].py()-size+1);
				g.lineTo(bd.border[i].px()+size  , bd.border[i].py()+size  );
				if(this.vnop("b"+i+"_peke1_",0)){ g.stroke();}

				g.beginPath();
				g.moveTo(bd.border[i].px()-size+1, bd.border[i].py()+size  );
				g.lineTo(bd.border[i].px()+size  , bd.border[i].py()-size+1);
				if(this.vnop("b"+i+"_peke2_",0)){ g.stroke();}
			}
			else{ this.vhide("b"+i+"_peke1_"); this.vhide("b"+i+"_peke2_");}
		}

		this.vinc();
	},

	//--------------------------------------------------------------------
	drawTriangle : function(x1,y1,x2,y2){
		var i;
		for(i=0;i<bd.cell.length;i++){
			if(bd.cell[i].cx < x1 || x2 < bd.cell[i].cx){ continue;}
			if(bd.cell[i].cy < y1 || y2 < bd.cell[i].cy){ continue;}

			if(bd.getQansCell(i)>=2 && bd.getQansCell(i)<=5){
				//if(bd.cell[i].error==1){ g.fillStyle = this.errcolor1;}
				//else{ g.fillStyle = this.Cellcolor;}
				g.fillStyle = this.Cellcolor;

				g.beginPath();
				if(bd.getQansCell(i)!=3){ g.moveTo(bd.cell[i].px(), bd.cell[i].py());}
				if(bd.getQansCell(i)==3){ g.moveTo(bd.cell[i].px()+k.cwidth+1, bd.cell[i].py());}
				else if(bd.getQansCell(i)!=2){ g.lineTo(bd.cell[i].px()+k.cwidth+1, bd.cell[i].py());}
				if(bd.getQansCell(i)!=5){ g.lineTo(bd.cell[i].px()+k.cwidth+1, bd.cell[i].py()+k.cheight+1);}
				if(bd.getQansCell(i)!=4){ g.lineTo(bd.cell[i].px(), bd.cell[i].py()+k.cheight+1);}
				g.closePath();
				this.vdel("c"+i+"_tri_");
				if(this.vnop("c"+i+"_tri_",1)){ g.fill();}
			}
			else{ this.vdel("c"+i+"_tri_");}
		}

		this.vinc();
	},

	//--------------------------------------------------------------------
	drawMBs : function(x1,y1,x2,y2){
		g.strokeStyle = this.MBcolor;
		var rsize = k.cwidth*0.35;

		for(i=0;i<bd.cell.length;i++){
			if(bd.cell[i].cx < x1 || x2 < bd.cell[i].cx){ continue;}
			if(bd.cell[i].cy < y1 || y2 < bd.cell[i].cy){ continue;}

			if(bd.getQsubCell(i)==1){
				g.beginPath();
				g.arc(bd.cell[i].px()+int(k.cwidth/2), bd.cell[i].py()+int(k.cheight/2), rsize, 0, Math.PI*2, false);
				if(this.vnop("c"+i+"_MB1_",0)){ g.stroke();}
			}
			else{ this.vhide("c"+i+"_MB1_");}

			if(bd.getQsubCell(i)==2){
				g.beginPath();
				g.moveTo(bd.cell[i].px()+int(k.cwidth/2)-rsize, bd.cell[i].py()+int(k.cheight/2)-rsize);
				g.lineTo(bd.cell[i].px()+int(k.cwidth/2)+rsize, bd.cell[i].py()+int(k.cheight/2)+rsize);
				g.closePath();
				if(this.vnop("c"+i+"_MB2a_",0)){ g.stroke();}

				g.beginPath();
				g.moveTo(bd.cell[i].px()+int(k.cwidth/2)-rsize, bd.cell[i].py()+int(k.cheight/2)+rsize);
				g.lineTo(bd.cell[i].px()+int(k.cwidth/2)+rsize, bd.cell[i].py()+int(k.cheight/2)-rsize);
				g.closePath();
				if(this.vnop("c"+i+"_MB2b_",0)){ g.stroke();}
			}
			else{ this.vhide("c"+i+"_MB2a_"); this.vhide("c"+i+"_MB2b_");}
		}

		this.vinc();
	},

	drawQueses41_42 : function(x1,y1,x2,y2){
		var rsize  = k.cwidth*0.40;
		var rsize2 = k.cwidth*0.34;

		for(i=0;i<bd.cell.length;i++){
			if(bd.cell[i].cx < x1 || x2 < bd.cell[i].cx){ continue;}
			if(bd.cell[i].cy < y1 || y2 < bd.cell[i].cy){ continue;}

			if(bd.getQuesCell(i)==41 || bd.getQuesCell(i)==42){
				g.fillStyle = this.Cellcolor;
				g.beginPath();
				g.arc(bd.cell[i].px()+int(k.cwidth/2), bd.cell[i].py()+int(k.cheight/2), rsize , 0, Math.PI*2, false);
				if(this.vnop("c"+i+"_cir41a_",1)){ g.fill(); }
			}
			else{ this.vhide("c"+i+"_cir41a_");}
			if(bd.getQuesCell(i)==41){
				g.fillStyle = "white";
				g.beginPath();
				g.arc(bd.cell[i].px()+int(k.cwidth/2), bd.cell[i].py()+int(k.cheight/2), rsize2, 0, Math.PI*2, false);
				if(this.vnop("c"+i+"_cir41b_",1)){ g.fill(); }
			}
			else{ this.vhide("c"+i+"_cir41b_");}
		}

		this.vinc();
	},

	//--------------------------------------------------------------------
	drawTCell : function(x1,y1,x2,y2){
		if(tc.tcellx < x1 || x2 < tc.tcellx){ return;}
		if(tc.tcelly < y1 || y2 < tc.tcelly){ return;}
		if(tc.getTCC() < 0 || bd.cell.length <= tc.getTCC()){ return;}

		if(k.mode==1){ g.strokeStyle = "red"; g.fillStyle = "rgba(255,0,0,0.05)";}
		else if(k.mode==3){ g.strokeStyle = "blue"; g.fillStyle = "rgba(0,0,255,0.05)";}

		var px = bd.cell[tc.getTCC()].px();
		var py = bd.cell[tc.getTCC()].py();

		this.vdel("tc1_"); this.vdel("tc2_");
		if(this.vnop("tc1_",0)){ g.strokeRect(px+1, py+1, k.cwidth-1, k.cheight-1);}
		if(this.vnop("tc2_",1)){ g.fillRect  (px+2, py+2, k.cwidth-3, k.cheight-3);}

		this.vinc();
	},
	drawTCross : function(x1,y1,x2,y2){
		if(tc.tcrossx < x1 || x2 < tc.tcrossx){ return;}
		if(tc.tcrossy < y1 || y2 < tc.tcrossy){ return;}
		if(tc.getTXC() < 0 || bd.cross.length <= tc.getTXC()){ return;}

		if(k.mode==1){ g.strokeStyle = "red"; g.fillStyle = "rgba(255,0,0,0.05)";}
		else if(k.mode==3){ g.strokeStyle = "blue"; g.fillStyle = "rgba(0,0,255,0.05)";}

		var px = bd.cross[tc.getTXC()].px() - int(k.cwidth/2);
		var py = bd.cross[tc.getTXC()].py() - int(k.cheight/2);

		this.vdel("tx1_"); this.vdel("tx2_");
		if(this.vnop("tx1_",0)){ g.strokeRect(px+1, py+1, k.cwidth-1, k.cheight-1);}
		if(this.vnop("tx2_",1)){ g.fillRect  (px+2, py+2, k.cwidth-3, k.cheight-3);}

		this.vinc();
	},

	drawBDline : function(x1,y1,x2,y2){
		if(x1<0){ x1=0;} if(x2>k.qcols-1){ x2=k.qcols-1;}
		if(y1<0){ y1=0;} if(y2>k.qrows-1){ y2=k.qrows-1;}

		g.fillStyle = this.BDlinecolor;
		var xa = (k.outside==0&&k.isborderAsLine==0)?(x1>1?x1:1)                    :(x1>0?x1:0);
		var xb = (k.outside==0&&k.isborderAsLine==0)?(x2+1<k.qcols-1?x2+1:k.qcols-1):(x2+1<k.qcols?x2+1:k.qcols);
		var ya = (k.outside==0&&k.isborderAsLine==0)?(y1>1?y1:1)                    :(y1>0?y1:0);
		var yb = (k.outside==0&&k.isborderAsLine==0)?(y2+1<k.qrows-1?y2+1:k.qrows-1):(y2+1<k.qrows?y2+1:k.qrows);
		var i;
		for(i=xa;i<=xb;i++){ if(this.vnop("bdy"+i+"_",1)){ g.fillRect(k.p0.x+i*k.cwidth, k.p0.y+y1*k.cheight, 1, (y2-y1+1)*k.cheight+1);} }
		for(i=ya;i<=yb;i++){ if(this.vnop("bdx"+i+"_",1)){ g.fillRect(k.p0.x+x1*k.cwidth, k.p0.y+i*k.cheight, (x2-x1+1)*k.cwidth+1, 1);} }

		this.vinc();
	},
	drawBDline2 : function(x1,y1,x2,y2){
		if(g.vml){ this.drawBDline(x1,y1,x2,y2); return;}

		if(x1<0){ x1=0;} if(x2>k.qcols-1){ x2=k.qcols-1;}
		if(y1<0){ y1=0;} if(y2>k.qrows-1){ y2=k.qrows-1;}

		g.fillStyle = this.BDlinecolor;
		var xa = (k.outside==0&&k.isborderAsLine==0)?(x1>1?x1:1)                    :(x1>0?x1:0);
		var xb = (k.outside==0&&k.isborderAsLine==0)?(x2+1<k.qcols-1?x2+1:k.qcols-1):(x2+1<k.qcols?x2+1:k.qcols);
		var ya = (k.outside==0&&k.isborderAsLine==0)?(y1>1?y1:1)                    :(y1>0?y1:0);
		var yb = (k.outside==0&&k.isborderAsLine==0)?(y2+1<k.qrows-1?y2+1:k.qrows-1):(y2+1<k.qrows?y2+1:k.qrows);
		var i, j;
		for(i=xa;i<=xb;i++){
			for(j=(k.p0.y+y1*k.cheight);j<(k.p0.y+(y2+1)*k.cheight);j+=6){
				g.fillRect(k.p0.x+i*k.cwidth, j, 1, 3);
			}
		}
		for(i=ya;i<=yb;i++){
			for(j=(k.p0.x+x1*k.cwidth);j<(k.p0.x+(x2+1)*k.cwidth);j+=6){
				g.fillRect(j, k.p0.y+i*k.cheight, 3, 1);
			}
		}
	},
	drawChassis : function(x1,y1,x2,y2){
		var lw = (int(k.cwidth/12)>=3?int(k.cwidth/12):3); //LineWidth
		var lm = int((lw-1)/2); //LineMargin

		if(x1<0){ x1=0;} if(x2>k.qcols-1){ x2=k.qcols-1;}
		if(y1<0){ y1=0;} if(y2>k.qrows-1){ y2=k.qrows-1;}

		g.fillStyle = "black";
		if(x1<1)         { if(this.vnop("chs1_",1)){ g.fillRect(k.p0.x+x1*k.cwidth-lw+1, k.p0.y+y1*k.cheight-lw+1, lw, (y2-y1+1)*k.cheight+2*lw-1);} }
		if(y1<1)         { if(this.vnop("chs2_",1)){ g.fillRect(k.p0.x+x1*k.cwidth-lw+1, k.p0.y+y1*k.cheight-lw+1, (x2-x1+1)*k.cwidth+2*lw-1, lw); } }
		if(y2>=k.qrows-1){ if(this.vnop("chs3_",1)){ g.fillRect(k.p0.x+x1*k.cwidth-lw+1, k.p0.y+(y2+1)*k.cheight , (x2-x1+1)*k.cwidth+2*lw-1, lw); } }
		if(x2>=k.qcols-1){ if(this.vnop("chs4_",1)){ g.fillRect(k.p0.x+(x2+1)*k.cwidth , k.p0.y+y1*k.cheight-lw+1, lw, (y2-y1+1)*k.cheight+2*lw-1);} }
		this.vinc();
	},
	flushCanvas : function(x1,y1,x2,y2){
		if(!g.vml){
			g.fillStyle = "rgb(255, 255, 255)";
			g.fillRect(k.p0.x+x1*k.cwidth, k.p0.y+y1*k.cheight, (x2-x1+1)*k.cwidth+1, (y2-y1+1)*k.cheight+1);
		}
		else{ g.zidx=1;}
	},
	// excanvas�̏ꍇ�A�����`�悵�Ȃ���VML�v�f���I������Ă��܂�
	flushCanvasAll : function(){
		if(g.vml){ g.zidx=0; g.vid="bg_"; g.clearRect();}
		g.fillStyle = "rgb(255, 255, 255)";
		g.fillRect(0, 0, cv_obj.width, cv_obj.height);
		this.vinc();
	},
	//-------------------------------------------------------------------------------------------
	// excanvas�֌W�֐�
	vnop : function(vid, isfill){
		if(g.vml){
			if($(vid)){
				$(vid).color = (g.processStyle((isfill==1?g.fillStyle:g.strokeStyle)))[0];
				Element.show($("p_"+vid));
				return false;
			}
			g.vid = vid;
		}
		return true;
	},
	vhide : function(vid){ if(g.vml && $(vid)){ Element.hide($("p_"+vid));} },
	vdel : function(vid) { if(g.vml && $(vid)){ $("p_"+vid).outerHTML = "";} },
	vinc : function(){
		if(g.vml){
			g.vid = "";
			g.zidx++;
		}
	}

};

//---------------------------------------------------------------------------
// ��TCell�N���X �L�[���͂̃^�[�Q�b�g��ێ����� (�֐��̐����͗�)
//---------------------------------------------------------------------------

TCell = Class.create();
TCell.prototype = {
	initialize : function(){
		this.tcellx = 0;
		this.tcelly = 0;
		this.tcrossx = 0;
		this.tcrossy = 0;
	},
	incTCX : function(){ this.tcellx++;},
	incTCY : function(){ this.tcelly++;},
	decTCX : function(){ this.tcellx--;},
	decTCY : function(){ this.tcelly--;},
	getTCC : function(){ return bd.getcnum(this.tcellx, this.tcelly);},
	setTCC : function(id){
		if(id<0 || bd.cell.length<=id){ return;}
		this.tcellx = bd.cell[id].cx;
		this.tcelly = bd.cell[id].cy;
	},
	incTXX : function(){ this.tcrossx++;},
	incTXY : function(){ this.tcrossy++;},
	decTXX : function(){ this.tcrossx--;},
	decTXY : function(){ this.tcrossy--;},
	getTXC : function(){ return bd.getxnum(this.tcrossx, this.tcrossy);},
	setTXC : function(id){
		if(!k.iscross || id<0 || bd.cross.length<=id){ return;}
		this.tcrossx = bd.cross[id].cx;
		this.tcrossy = bd.cross[id].cy;
	},
	Adjust : function(){
		if(this.tcellx<(k.outside?-1:0)){ this.tcellx=(k.outside?-1:0); }
		if(this.tcellx>(k.outside?k.qcols:k.qcols-1)){ this.tcellx=(k.outside?k.qcols:k.qcols-1); }
		if(this.tcelly<(k.outside?-1:0)){ this.tcelly=(k.outside?-1:0); }
		if(this.tcelly>(k.outside?k.qrows:k.qrows-1)){ this.tcelly=(k.outside?k.qrows:k.qrows-1); }

		if(this.tcrossx<0){ this.tcrossx=0; }
		if(this.tcrossx>k.qcols){ this.tcrossx=k.qcols; }
		if(this.tcrossy<0){ this.tcrossy=0; }
		if(this.tcrossy>k.qrows){ this.tcrossy=k.qrows; }
	}
};

//---------------------------------------------------------------------------
// ��MouseEvent�N���X �}�E�X���͂Ɋւ�����̕ێ��ƃC�x���g����������
//    mv.mousereset()
//      �}�E�X���͂Ɋւ����������������
//
//    mv.e_mousedown(e)
//      Canvas��Ń}�E�X�̃{�^�����������ۂ̃C�x���g���ʏ���
//    mv.e_mouseup(e)
//      Canvas��Ń}�E�X�̃{�^����������ۂ̃C�x���g���ʏ���
//    mv.e_mousemove(e)
//      Canvas��Ń}�E�X�𓮂������ۂ̃C�x���g���ʏ���
//    mv.e_mouseout(e)
//      �}�E�X�J�[�\�����E�B���h�E���痣�ꂽ�ۂ̃C�x���g���ʏ���
//
//    mv.mousedown(x,y,e)
//      Canvas��Ń}�E�X�̃{�^�����������ۂ̃C�x���g�����B�e�p�Y���̃t�@�C���ŃI�[�o�[���C�h�����B
//    mv.mouseup(x,y,e)
//      Canvas��Ń}�E�X�̃{�^����������ۂ̃C�x���g�����B�e�p�Y���̃t�@�C���ŃI�[�o�[���C�h�����B
//    mv.mousemove(x,y,e)
//      Canvas��Ń}�E�X�𓮂������ۂ̃C�x���g�����B�e�p�Y���̃t�@�C���ŃI�[�o�[���C�h�����B
//
//    mv.cellid(p)
//      Pos(x,y)���ǂ̃Z����ID�ɊY�����邩��Ԃ�
//    mv.crossid(p)
//      Pos(x,y)���ǂ̌����_��ID�ɊY�����邩��Ԃ�
//    mv.cellpos(p)
//      Pos(x,y)�����z�Z����łǂ���(X,Y)�ɊY�����邩��Ԃ�
//    mv.crosspos(p,rc)
//      Pos(x,y)�����z�Z����łǂ���(X*2,Y*2)�ɊY�����邩��Ԃ��B
//      �O�g�̍��オ(0,0)�ŉE����(k.qcols*2,k.qrows*2)�Brc��0�`0.5�̃p�����[�^�B
//
//    mv.isLeft(e)
//      ���N���b�N���ꂽ���ǂ�����Ԃ��BShift�L�[�������͍��E�t�ɂȂ��Ă���B
//    mv.isMiddle(e)
//      ���{�^���N���b�N���ꂽ���ǂ�����Ԃ��B
//    mv.isRight(e)
//      �E�N���b�N���ꂽ���ǂ�����Ԃ��BShift�L�[�������͍��E�t�ɂȂ��Ă���B
//    mv.isWinWebKit()
//      isLeft�œ��ꏈ�����s�����̓����֐�
//
//    mv.inputcell(x,y,e)
//      Cell��qans(�񓚃f�[�^)��0/1/2�̂����ꂩ����͂���B
//    mv.decIC(cc,e)
//      0/1/2�ǂ����͂��ׂ��������肷��B
//    mv.inputqnum(x,y,max,e)
//      Cell��qnum(��萔���f�[�^)�ɐ�������͂���B
//    mv.inputQues(x,y,e,array)
//      Cell��ques�f�[�^��array�̂Ƃ���ɓ��͂���
//    mv.inputMB(x,y,e)
//      Cell��qsub(�⏕�L��)�́�, �~�f�[�^����͂���
//
//    mv.inputcross(x,y,e)
//      Cross��ques(���f�[�^)��0�`4����͂���B
//
//    mv.inputborder(x,y,e)
//      �Ֆʋ��E���̖��f�[�^����͂���
//    mv.inputLine(x,y,e)
//      �Ֆʂ̐�����͂���
//    mv.inputpeke(x,y,e)
//      �Ֆʂ̐����ʂ�Ȃ����Ƃ������~����͂���
//---------------------------------------------------------------------------

// �p�Y������ �}�E�X���͕�
// MouseEvent�N���X���`
MouseEvent = Class.create();
MouseEvent.prototype = {
	initialize : function(){
		// �}�E�X�n�񏉊���
		this.mousePressed;
		this.mouseCell;
		this.inputData;
		this.clickBtn;
		this.currentOpeCount;
		this.firstPos;
		this.btn;
		this.mousereset();
	},
	mousereset : function(){
		this.mousePressed = 0;
		this.mouseCell = -1;
		this.inputData = -1;
		this.clickBtn = -1;
		this.currentOpeCount = 0;
		this.firstPos = new Pos(-1, -1);
		this.btn = { Left: false, Middle: false, Right: false };
	},

	//�C�x���g�n���h������Ăяo�����
	// ����3�̃}�E�X�C�x���g��Canvas����Ăяo�����(mv��bind���Ă���)
	e_mousedown : function(e){
		if(!k.enableMouse){ return;}
		if(this.isMiddle(e)){ base.modeflip(); return;} //���{�^��
		bd.errclear();
		um.chainflag = 0;
		this.currentOpeCount = um.ope.length;
		this.btn = { Left: this.isLeft(e), Middle: this.isMiddle(e), Right: this.isRight(e) };
		this.mousedown(Event.pointerX(e)-k.cv_oft.x-k.IEMargin.x, Event.pointerY(e)-k.cv_oft.y-k.IEMargin.y);
		this.mousePressed = 1;
	},
	e_mouseup   : function(e){
		if(!k.enableMouse){ return;}
		um.chainflag = 0;
		this.mouseup  (Event.pointerX(e)-k.cv_oft.x-k.IEMargin.x, Event.pointerY(e)-k.cv_oft.y-k.IEMargin.y);
		this.mousereset();
	},
	e_mousemove : function(e){
		if(!k.enableMouse){ return;}
		if(this.mousePressed!=1){ return;}
		um.chainflag = 0;
		this.mousemove(Event.pointerX(e)-k.cv_oft.x-k.IEMargin.x, Event.pointerY(e)-k.cv_oft.y-k.IEMargin.y);
	},

	e_mouseout : function(e) {
//		if (Prototype.Browser.IE){ var e=window.event;}
//		this.mousereset();
		um.chainflag = 0;
	},

	//�I�[�o�[���C�h�p
	mousedown : function(x,y){ },
	mouseup   : function(x,y){ },
	mousemove : function(x,y){ },

	//-----------------------------------------------------------
	// ���ʊ֐�
	cellid : function(p){
		var pos = this.cellpos(p);
		if((p.x-k.p0.x)%k.cwidth==0 || (p.y-k.p0.y)%k.cheight==0){ return -1;} // �҂�����͖���
		if(pos.x<0 || pos.x>k.qcols-1 || pos.y<0 || pos.y>k.qrows-1){ return -1;}
		return pos.x+pos.y*k.qcols;
	},
	crossid : function(p){
		var pos = this.crosspos(p,0.5);
		if(pos.x<0 || pos.x>2*k.qcols || pos.y<0 || pos.y>2*k.qrows){ return -1;}

		return int((pos.x/2)+(pos.y/2)*(k.qcols+1));
	},
	cellpos : function(p){	// crosspos(p,0)�ł���ւ͂ł���
		return new Pos(int((p.x-k.p0.x)/k.cwidth), int((p.y-k.p0.y)/k.cheight));
	},
	crosspos : function(p,rc){
		var pm = rc*k.cwidth;
		var ax = int((p.x-k.p0.x+pm)/k.cwidth); var ay = int((p.y-k.p0.y+pm)/k.cheight);
		var bx = (p.x-k.p0.x+pm)%k.cwidth; var by = (p.y-k.p0.y+pm)%k.cheight;

		return new Pos(ax*2+(bx<2*pm?0:1), ay*2+(by<2*pm?0:1));
	},

	// else if��Prototype.js���Ή�����܂łً̋}�[�u
	isLeft : function(e){
		if(!((kc.isSHIFT||kc.isALT) ^ $("lrcheck").checked)){
			if(!this.isWinWebKit()){ return Event.isLeftClick(e);}
			else if(e.button == 0){ return true;}
		}
		else{
			if(!this.isWinWebKit()){ return Event.isRightClick(e);}
			else if(e.button == 2){ return true;}
		}
		return false;
	},
	isMiddle : function(e){
		if(!this.isWinWebKit()){ return Event.isMiddleClick(e);}
		else if(e.button == 1){ return true;}
		return false;
	},
	isRight : function(e){
		if(!((kc.isSHIFT||kc.isALT) ^ $("lrcheck").checked)){
			if(!this.isWinWebKit()){ return Event.isRightClick(e);}
			else if(e.button == 2){ return true;}
		}
		else{
			if(!this.isWinWebKit()){ return Event.isLeftClick(e);}
			else if(e.button == 0){ return true;}
		}
		return false;
	},
	isWinWebKit : function(){
		return (navigator.userAgent.indexOf('Win')!=-1 && Prototype.Browser.WebKit);
	},

	notInputted : function(){ return (this.currentOpeCount==um.ope.length);},

	//-----------------------------------------------------------
	inputcell : function(x,y){
		var cc = this.cellid(new Pos(x,y));
		if(cc==-1 || cc==this.mouseCell){ return;}
		if(this.inputData==-1){ this.decIC(cc);}

		this.mouseCell = cc; 

		if(k.NumberIsWhite==1 && bd.getQnumCell(cc)!=-1 && (this.inputData==1||(this.inputData==2 && pc.bcolor=="white"))){ return;}
		if(k.RBBlackCell==1 && this.inputData==1){
			if(this.firstPos.x == -1 && this.firstPos.y == -1){ this.firstPos = new Pos(bd.cell[cc].cx, bd.cell[cc].cy);}
			if((this.firstPos.x+this.firstPos.y) % 2 != (bd.cell[cc].cx+bd.cell[cc].cy) % 2){ return;}
		}

		bd.setQansCell(cc, (this.inputData==1?1:-1));
		bd.setQsubCell(cc, (this.inputData==2?1:0));

		pc.paint(bd.cell[cc].cx, bd.cell[cc].cy, bd.cell[cc].cx, bd.cell[cc].cy);
	},
	decIC : function(cc){
		if(k.use==1){
			if(this.btn.Left){ this.inputData=((bd.getQansCell(cc)!=1) ? 1 : 0); }
			else if(this.btn.Right){ this.inputData=((bd.getQsubCell(cc)!=1) ? 2 : 0); }
		}
		else if(k.use==2){
			if(this.btn.Left){
				if(bd.getQansCell(cc) == 1) this.inputData=2;
				else if(bd.getQsubCell(cc) == 1) this.inputData=0;
				else this.inputData=1;
			}
			else if(this.btn.Right){
				if(bd.getQansCell(cc) == 1) this.inputData=0;
				else if(bd.getQsubCell(cc) == 1) this.inputData=1;
				else this.inputData=2;
			}
		}
	},
	inputqnum : function(x,y,max){
		var cc = this.cellid(new Pos(x,y));
		if(cc==-1 || cc==this.mouseCell){ return;}

		if(cc==tc.getTCC()){
			cc = (k.mode==3 ? this.inputqnum3(cc,max) : this.inputqnum1(cc,max));
		}
		else{
			var cc0 = tc.getTCC();
			tc.setTCC(cc);

			pc.paint(bd.cell[cc0].cx-1, bd.cell[cc0].cy-1, bd.cell[cc0].cx, bd.cell[cc0].cy);
		}
		this.mouseCell = cc;

		pc.paint(bd.cell[cc].cx-1, bd.cell[cc].cy-1, bd.cell[cc].cx, bd.cell[cc].cy);
	},
	inputqnum1 : function(cc,max){
		if(k.isOneNumber){
			cc = room.getTopOfRoom(bd.cell[cc].rarea);
			if(room.getCntOfRoom(bd.cell[cc].rarea)<max){ max = room.getCntOfRoom(bd.cell[cc].rarea);}
		}
		if(this.btn.Left){
			if(bd.getQnumCell(cc)==max){ bd.setQnumCell(cc,-1);}
			else if(bd.getQnumCell(cc)==-1){ bd.setQnumCell(cc,-2);}
			else if(bd.getQnumCell(cc)==-2){ bd.setQnumCell(cc,(k.dispzero?0:1));}
			else{ bd.setQnumCell(cc,bd.getQnumCell(cc)+1);}
		}
		else if(this.btn.Right){
			if(bd.getQnumCell(cc)==-1){ bd.setQnumCell(cc,max);}
			else if(bd.getQnumCell(cc)==-2){ bd.setQnumCell(cc,-1);}
			else if(bd.getQnumCell(cc)==(k.dispzero?0:1)){ bd.setQnumCell(cc,-2);}
			else{ bd.setQnumCell(cc,bd.getQnumCell(cc)-1);}
		}
		if(bd.getQnumCell(cc)!=-1 && k.NumberIsWhite){ bd.setQansCell(cc,-1); if(pc.bcolor=="white"){ bd.setQsubCell(cc,0);} }
		if(k.isAnsNumber){ bd.setQansCell(cc,-1); bd.setQsubCell(cc,0);}

		return cc;
	},
	inputqnum3 : function(cc,max){
		if(bd.getQnumCell(cc)!=-1){ return cc;}
		if(this.btn.Left){
			if(k.NumberWithMB){
				if     (bd.getQansCell(cc)==max){ bd.setQansCell(cc,-1); bd.setQsubCell(cc,1); return cc;}
				else if(bd.getQsubCell(cc)==1)  { bd.setQansCell(cc,-1); bd.setQsubCell(cc,2); return cc;}
				else if(bd.getQsubCell(cc)==2)  { bd.setQansCell(cc,-1); bd.setQsubCell(cc,0); return cc;}
			}
			if     (bd.getQansCell(cc)==max){ bd.setQansCell(cc,-1);                  }
			else if(bd.getQansCell(cc)==-1) { bd.setQansCell(cc,(k.dispzero?0:1));    }
			else                            { bd.setQansCell(cc,bd.getQansCell(cc)+1);}
		}
		else if(this.btn.Right){
			if(k.NumberWithMB){
				if     (bd.getQsubCell(cc)==1) { bd.setQansCell(cc,max); bd.setQsubCell(cc,0); return cc;}
				else if(bd.getQsubCell(cc)==2) { bd.setQansCell(cc,-1);  bd.setQsubCell(cc,1); return cc;}
				else if(bd.getQansCell(cc)==-1){ bd.setQansCell(cc,-1);  bd.setQsubCell(cc,2); return cc;}
			}
			if     (bd.getQansCell(cc)==-1)              { bd.setQansCell(cc,max);}
			else if(bd.getQansCell(cc)==(k.dispzero?0:1)){ bd.setQansCell(cc,-1); }
			else                                         { bd.setQansCell(cc,bd.getQansCell(cc)-1);}
		}
		return cc;
	},

	inputQues : function(x,y,array){
		var i;
		var cc = this.cellid(new Pos(x,y));
		if(cc==-1){ return;}

		var flag=false;
		if(this.btn.Left){
			for(i=0;i<array.length-1;i++){
				if(!flag && bd.getQuesCell(cc)==array[i]){ bd.setQuesCell(cc,array[i+1]); flag=true;}
			}
			if(!flag && bd.getQuesCell(cc)==array[array.length-1]){ bd.setQuesCell(cc,array[0]); flag=true;}
		}
		else if(this.btn.Right){
			for(i=array.length;i>0;i--){
				if(!flag && bd.getQuesCell(cc)==array[i]){ bd.setQuesCell(cc,array[i-1]); flag=true;}
			}
			if(!flag && bd.getQuesCell(cc)==array[0]){ bd.setQuesCell(cc,array[array.length-1]); flag=true;}
		}
		if(flag){ pc.paint(bd.cell[cc].cx, bd.cell[cc].cy, bd.cell[cc].cx, bd.cell[cc].cy);}
	},

	inputMB : function(x,y){
		var cc = this.cellid(new Pos(x,y));
		if(cc==-1){ return;}

		if(this.btn.Left){
			if(bd.getQsubCell(cc)==0){ bd.setQsubCell(cc, 1);}
			else if(bd.getQsubCell(cc)==1){ bd.setQsubCell(cc, 2);}
			else{ bd.setQsubCell(cc, 0);}
		}
		else if(this.btn.Right){
			if(bd.getQsubCell(cc)==0){ bd.setQsubCell(cc, 2);}
			else if(bd.getQsubCell(cc)==2){ bd.setQsubCell(cc, 1);}
			else{ bd.setQsubCell(cc, 0);}
		}
		pc.paint(bd.cell[cc].cx, bd.cell[cc].cy, bd.cell[cc].cx, bd.cell[cc].cy);
	},

	inputtile : function(x,y){
		var cc = this.cellid(new Pos(x,y));
		if(cc==-1 || cc==this.mouseCell){ return;}
		if(this.inputData==-1){ this.decIC(cc);}

		this.mouseCell = cc; 
		var area = ans.searchRarea();
		var areaid = area.check[cc];
		var c;

		for(c=0;c<k.qcols*k.qrows;c++){
			if(area.check[c] == areaid){
				bd.setQansCell(c, (this.inputData==1?1:-1));
				bd.setQsubCell(c, (this.inputData==2?1:0));
			}
		}

		var d = ans.getSizeOfArea(area,areaid,function(a){ return true;});

		pc.paint(d.x1, d.y1, d.x2, d.y2);
	},
	//-----------------------------------------------------------

	inputcross : function(x,y){
		var cc = this.crossid(new Pos(x,y));
		if(cc==-1 || cc==this.mouseCell){ return;}

		if(cc==tc.getTXC()){
			if(this.btn.Left){
				if(bd.getQnumCross(cc)==4){ bd.setQnumCross(cc,-2);}
				else{ bd.setQnumCross(cc,bd.getQnumCross(cc)+1);}
			}
			else if(this.btn.Right){
				if(bd.getQnumCross(cc)==-2){ bd.setQnumCross(cc,4);}
				else{ bd.setQnumCross(cc,bd.getQnumCross(cc)-1);}
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
	inputcrossMark : function(x,y,flag){
		var pos = this.crosspos(new Pos(x,y), 0.24);
		if(pos.x%2!=0 || pos.y%2!=0){ return;}
		if(pos.x<(flag==0?0:2) || pos.x>(flag==0?2*k.qcols:2*k.qcols-2)){ return;}
		if(pos.y<(flag==0?0:2) || pos.y>(flag==0?2*k.qrows:2*k.qrows-2)){ return;}

		var cc = bd.getxnum(int(pos.x/2),int(pos.y/2));

		um.disCombine = 1;
		if(bd.getQnumCross(cc)==1){ bd.setQnumCross(cc,-1);}
		else{ bd.setQnumCross(cc,1);}
		um.disCombine = 0;

		pc.paint(bd.cross[cc].cx-1, bd.cross[cc].cy-1, bd.cross[cc].cx, bd.cross[cc].cy);
	},
	//-----------------------------------------------------------
	inputborder : function(x,y){ this.inputBD(x,y,0);},
	inputborderans : function(x,y){ this.inputBD(x,y,1);},
	inputBD : function(x,y,flag){
		var pos = this.crosspos(new Pos(x,y), 0.35);
		if(pos.x==this.mouseCell.x && pos.y==this.mouseCell.y){ return;}

		var id = bd.getbnum(pos.x, pos.y);
		if(id==-1 && this.mouseCell.x){ id = bd.getbnum(this.mouseCell.x, this.mouseCell.y);}

		if(this.mouseCell!=-1 && id!=-1){
			if((pos.x%2==0 && this.mouseCell.x==pos.x && Math.abs(this.mouseCell.y-pos.y)==1) ||
			   (pos.y%2==0 && this.mouseCell.y==pos.y && Math.abs(this.mouseCell.x-pos.x)==1) )
			{
				this.mouseCell=-1

				if(this.inputData==-1){
					if     (flag==0){ if(bd.getQuesBorder(id)==0){ this.inputData=1;}else{ this.inputData=0;} }
					else if(flag==1){ if(bd.getQansBorder(id)==0){ this.inputData=1;}else{ this.inputData=0;} }
				}

				var i,j;
				var idlist = [id];
				if(k.puzzleid=="kramma"){
					var bx1, bx2, by1, by2;
					if(bd.border[id].cx%2==1){
						i = bd.border[id].cx; while(i>=0        ){ if(bd.getQnumCross(bd.getxnum(int(i/2)  ,int(bd.border[id].cy/2)))==1){ i-=2; break;} i-=2;} bx1 = i+2;
						i = bd.border[id].cx; while(i<=2*k.qcols){ if(bd.getQnumCross(bd.getxnum(int(i/2)+1,int(bd.border[id].cy/2)))==1){ i+=2; break;} i+=2;} bx2 = i-2;
						by1 = by2 = bd.border[id].cy;
					}
					else if(bd.border[id].cy%2==1){
						i = bd.border[id].cy; while(i>=0        ){ if(bd.getQnumCross(bd.getxnum(int(bd.border[id].cx/2),int(i/2)  ))==1){ i-=2; break;} i-=2;} by1 = i+2;
						i = bd.border[id].cy; while(i<=2*k.qrows){ if(bd.getQnumCross(bd.getxnum(int(bd.border[id].cx/2),int(i/2)+1))==1){ i+=2; break;} i+=2;} by2 = i-2;
						bx1 = bx2 = bd.border[id].cx;
					}
					idlist = [];
					for(i=bx1;i<=bx2;i+=2){ for(j=by1;j<=by2;j+=2){ idlist.push(bd.getbnum(i,j)); } }
				}

				for(i=0;i<idlist.length;i++){
					if(flag==0){
						if     (this.inputData==1){ bd.setQuesBorder(idlist[i], 1); bd.setQansBorder(idlist[i], 0);}
						else if(this.inputData==0){ bd.setQuesBorder(idlist[i], 0); bd.setQansBorder(idlist[i], 0);}
					}
					else if(flag==1 && bd.getQuesBorder(id)==0){
						if     (this.inputData==1){ bd.setQansBorder(idlist[i], 1);}
						else if(this.inputData==0){ bd.setQansBorder(idlist[i], 0);}
					}
					else{ return;}
					pc.paintBorder(idlist[i]);
				}
			}
		}
		this.mouseCell = pos;
	},

	inputLine : function(x,y){ this.inputLine1(x,y,0);},
	inputQsubLine : function(x,y){ this.inputLine1(x,y,1);},
	inputLine1 : function(x,y,flag){
		var pos = this.cellpos(new Pos(x,y));
		if(pos.x==this.mouseCell.x && pos.y==this.mouseCell.y){ return;}

		var id = -1;
		var cc = bd.getcnum(this.mouseCell.x, this.mouseCell.y);
		if(cc != -1){
			if     (pos.y - this.mouseCell.y == -1){ id = bd.cell[cc].ub();}
			else if(pos.y - this.mouseCell.y ==  1){ id = bd.cell[cc].db();}
			else if(pos.x - this.mouseCell.x == -1){ id = bd.cell[cc].lb();}
			else if(pos.x - this.mouseCell.x ==  1){ id = bd.cell[cc].rb();}
		}

		this.mouseCell = pos;
		if(this.inputData==2 || this.inputData==3){ this.inputpeke2(id);}
		else if(this.mouseCell!=-1 && id!=-1){
			if     (flag==0) this.inputLine2(id);
			else if(flag==1) this.inputqsub2(id);
		}
	},
	inputLine2 : function(id){
		if(this.inputData==-1){ if(bd.getLineBorder(id)==0){ this.inputData=1;}else{ this.inputData=0;} }
		if     (this.inputData==1){ bd.setLineBorder(id, 1); bd.setQsubBorder(id, 0);}
		else if(this.inputData==0){ bd.setLineBorder(id, 0); bd.setQsubBorder(id, 0);}
		pc.paintLine(id);
	},
	inputqsub2 : function(id){
		if(this.inputData==-1){ if(bd.getQsubBorder(id)==0){ this.inputData=1;}else{ this.inputData=0;} }
		if     (this.inputData==1){ bd.setQsubBorder(id, 1);}
		else if(this.inputData==0){ bd.setQsubBorder(id, 0);}
		pc.paintLine(id);
	},

	inputpeke : function(x,y){
		var pos = this.crosspos(new Pos(x,y), 0.22);
		var id = bd.getbnum(pos.x, pos.y);
		if(id==-1 || (pos.x==this.mouseCell.x && pos.y==this.mouseCell.y)){ return;}

		this.mouseCell = pos;
		this.inputpeke2(id);
	},
	inputpeke2 : function(id){
		if(this.inputData==-1){ if(bd.getQsubBorder(id)==0){ this.inputData=2;}else{ this.inputData=3;} }
		if     (this.inputData==2){ bd.setLineBorder(id, 0); bd.setQsubBorder(id, 2);}
		else if(this.inputData==3){ bd.setLineBorder(id, 0); bd.setQsubBorder(id, 0);}
		pc.paintLine(id);
	}
};

//---------------------------------------------------------------------------
// ��KeyEvent�N���X �L�[�{�[�h���͂Ɋւ�����̕ێ��ƃC�x���g����������
//    kc.keyreset()
//      �L�[�{�[�h���͂Ɋւ����������������
//
//    kc.e_keydown(e)
//      �L�[���������ۂ̃C�x���g���ʏ���
//    kc.e_keyup(e)
//      �L�[�𗣂����ۂ̃C�x���g���ʏ���
//    kc.e_keypress(e)
//      �L�[���͂����ۂ̃C�x���g���ʏ���(-�L�[�p)
//
//    kc.keydown(x,y,e)
//      �L�[���������ۂ̃C�x���g�����B�e�p�Y���̃t�@�C���ŃI�[�o�[���C�h�����B
//    kc.keyup(x,y,e)
//      �L�[�𗣂����ۂ̃C�x���g�����B�e�p�Y���̃t�@�C���ŃI�[�o�[���C�h�����B
//    kc.keypress(x,y,e)
//      �L�[���͂����ۂ̃C�x���g�����B�e�p�Y���̃t�@�C���ŃI�[�o�[���C�h�����B(-�L�[�p)
//
//    kc.getKeyCode(e)
//      ���͂��ꂽ�L�[�𐔎��ŕԂ�
//    kc.keydown_common(e)
//      �L�[���������ۂ̃C�x���g���ʏ���(Shift,Undo,F2��)
//    kc.keyup_common(e)
//      �L�[�𗣂����ۂ̃C�x���g���ʏ���(Shift,Undo��)
//    kc.moveTCell(e)
//      Cell�̃L�[�{�[�h����̓��͑Ώۂ���L�[�œ�����
//    kc.moveTCross(e)
//      Cross�̃L�[�{�[�h����̓��͑Ώۂ���L�[�œ�����
//
//    kc.key_inputcross(e,max)
//      ���max�܂ł̐�����Cross�̖��f�[�^�����ē��͂���(keydown��)
//    kc.key_inputcrossp(e,max)
//      ���max�܂ł̐�����Cross�̖��f�[�^�����ē��͂���(keypress��;-�L�[�p)
//
//    kc.key_inputqnum(e,max)
//      ���max�܂ł̐�����Cell�̖��f�[�^�����ē��͂���(keydown��)
//    kc.key_inputqnump(e,max)
//      ���max�܂ł̐�����Cell�̖��f�[�^�����ē��͂���(keypress��;-�L�[�p)
//---------------------------------------------------------------------------

// �p�Y������ �L�[�{�[�h���͕�
// KeyEvent�N���X���`
KeyEvent = Class.create();
KeyEvent.prototype = {
	initialize : function(){
		// �L�[�{�[�h�n�񏉊���
		this.isCTRL;
		this.isALT;	// ALT�̓��j���[�p�Ȃ̂ŋɗ͎g��Ȃ�
		this.isSHIFT;
		this.inUNDO;
		this.inREDO;
		this.keyreset();

		this.code = { keycode: 0, keymd: 0, ca: '' };
	},
	keyreset : function(){
		this.isCTRL  = false;
		this.isALT   = false;
		this.isSHIFT = false;
		this.inUNDO  = false;
		this.inREDO  = false;
	},
	

	// ����3�̃L�[�C�x���g��window����Ăяo�����(kc��bind���Ă���)
	// 48�`57��0�`9�L�[�A65�`90��a�`z�A96�`105�̓e���L�[�A112�`123��F1�`F12�L�[
	e_keydown : function(e)  {
		if(!k.enableKey){ return;}
		if(Prototype.Browser.IE){ e = window.event;}

		um.chainflag = 0;
		this.code = { keycode: this.getKeyCode(e), keymd: e.keyCode, ca: this.getchar(this.getKeyCode(e)) };

		if(this.keydown_common(e)){ return false ;}
		this.keydown(this.code.ca); //kc.keydown(e.modifier, String.fromCharCode(e.which), e);
	},
	e_keyup : function(e)    {
		if(!k.enableKey){ return;}
		if(Prototype.Browser.IE){ e = window.event;}

		um.chainflag = 0;
		this.code = { keycode: this.getKeyCode(e), keymd: e.keyCode, ca: this.getchar(this.getKeyCode(e)) };

		if(this.keyup_common(e)){ return false;}
		this.keyup(this.code.ca); //kc.keyup(e.modifier, String.fromCharCode(e.which), e);
	},
	//(keypress�̂�)45��-(�}�C�i�X)
	e_keypress : function(e)    {
		if(!k.enableKey){ return;}
		if(Prototype.Browser.IE){ e = window.event;}

		um.chainflag = 0;
		this.code = { keycode: this.getKeyCode(e), keymd: e.keyCode, ca: this.getcharp(this.getKeyCode(e)) };

		this.keypress(this.code.ca);
	},

	// �I�[�o�[���C�h�p
	keydown : function(ca){ },
	keyup : function(ca){ },
	keypress : function(ca){ },

	getchar : function(keycode){
		if     (48<=keycode && keycode<=57) { return (keycode - 48).toString(36);}
		else if(65<=keycode && keycode<=90) { return (keycode - 55).toString(36);} //�A���t�@�x�b�g
		else if(96<=keycode && keycode<=105){ return (keycode - 96).toString(36);} //�e���L�[�Ή�
		else{ return '';}
	},
	getcharp : function(keycode){
		if(keycode==45){ return '-';}
		else{ return '';}
	},

	//-----------------------------------------------------------
	//Programming Magic�l�̃R�[�h
	getKeyCode : function(e){
		if(document.all) return  e.keyCode;
		else if(document.getElementById) return (e.keyCode)? e.keyCode: e.charCode;
		else if(document.layers) return  e.which;
	},

	keydown_common : function(e){
		var flag = false;
		if(!this.isSHIFT && e.shiftKey){ this.isSHIFT=true; flag = true; }
		if(!this.isCTRL  && e.ctrlKey ){ this.isCTRL=true;  flag = true; }
		if(!this.isALT   && e.altKey  ){ this.isALT=true;   flag = true; }

		if(this.isCTRL && this.code.ca=='z'){ this.inUNDO=true; flag = true; }
		if(this.isCTRL && this.code.ca=='y'){ this.inREDO=true; flag = true; }

		if(this.code.keycode==113 && k.callmode == "pmake"){ // 112�`123��F1�`F12�L�[
			if     (k.mode==1 && !this.isSHIFT){ k.mode=3; base.modedisp(); flag = true;}
			else if(k.mode==3 &&  this.isSHIFT){ k.mode=1; base.modedisp(); flag = true;}
		}

		return flag;
	},
	keyup_common : function(e){
		var flag = false;
		if(this.isSHIFT && !e.shiftKey){ this.isSHIFT=false; flag = true; }
		if((this.isCTRL || this.inUNDO || this.inREDO)  && !e.ctrlKey ){ this.isCTRL=false;  flag = true; this.inUNDO = false; this.inREDO = false; }
		if(this.isALT   && !e.altKey  ){ this.isALT=false;   flag = true; }

		if(this.inUNDO && this.code.ca=='z'){ this.inUNDO=false; flag = true; }
		if(this.inREDO && this.code.ca=='y'){ this.inREDO=false; flag = true; }

		return flag;
	},
	moveTCell : function(){
		var cc0 = tc.getTCC();
		var flag = false;
		if     (this.code.keymd == Event.KEY_UP    && bd.cell[tc.getTCC()].up() != -1){ tc.decTCY(); flag = true;}
		else if(this.code.keymd == Event.KEY_DOWN  && bd.cell[tc.getTCC()].dn() != -1){ tc.incTCY(); flag = true;}
		else if(this.code.keymd == Event.KEY_LEFT  && bd.cell[tc.getTCC()].lt() != -1){ tc.decTCX(); flag = true;}
		else if(this.code.keymd == Event.KEY_RIGHT && bd.cell[tc.getTCC()].rt() != -1){ tc.incTCX(); flag = true;}

		if(flag){
			var cc= tc.getTCC();
			pc.paint(bd.cell[cc0].cx, bd.cell[cc0].cy, bd.cell[cc0].cx, bd.cell[cc0].cy);
			pc.paint(bd.cell[cc].cx, bd.cell[cc].cy, bd.cell[cc].cx, bd.cell[cc].cy);
		}

		return flag;
	},
	moveTCross : function(){
		var cc0 = tc.getTXC();
		var flag = false;
		if     (this.code.keymd == Event.KEY_UP    && tc.tcrossy > 0      ){ tc.decTXY(); flag = true;}
		else if(this.code.keymd == Event.KEY_DOWN  && tc.tcrossy < k.qrows){ tc.incTXY(); flag = true;}
		else if(this.code.keymd == Event.KEY_LEFT  && tc.tcrossx > 0      ){ tc.decTXX(); flag = true;}
		else if(this.code.keymd == Event.KEY_RIGHT && tc.tcrossx < k.qcols){ tc.incTXX(); flag = true;}

		if(flag){
			var cc= tc.getTXC();
			pc.paint(bd.cross[cc0].cx-1, bd.cross[cc0].cy-1, bd.cross[cc0].cx, bd.cross[cc0].cy);
			pc.paint(bd.cross[cc].cx-1, bd.cross[cc].cy-1, bd.cross[cc].cx, bd.cross[cc].cy);
		}

		return flag;
	},

	//-----------------------------------------------------------
	key_inputcross : function(ca, max){
		var cc = tc.getTXC();

		if('0'<=ca && ca<='9'){
			var num = parseInt(ca);

			if(bd.getQnumCross(cc)<=0){
				if(num<=max){ bd.setQnumCross(cc,num);}
			}
			else{
				if(bd.getQnumCross(cc)*10+num<=max){ bd.setQnumCross(cc,bd.getQnumCross(cc)*10+num);}
				else if(num<=max){ bd.setQnumCross(cc,num);}
			}
		}
		else if(ca=='-'){
			if(bd.getQnumCross(cc)!=-2){ bd.setQnumCross(cc,-2);}
			else{ bd.setQnumCross(cc,-1);}
		}
		else{ return;}

		pc.paint(bd.cross[cc].cx-1, bd.cross[cc].cy-1, bd.cross[cc].cx, bd.cross[cc].cy);
	},
	//-----------------------------------------------------------
	key_inputqnum : function(ca, max){
		var cc = tc.getTCC();
		if(k.mode==1 && k.isOneNumber){ cc = room.getTopOfRoom(bd.cell[cc].rarea);}

		if('0'<=ca && ca<='9'){
			var num = parseInt(ca);

			if(this.getnum(cc)<=0){
				if(num<=max){ if(k.NumberIsWhite){ bd.setQansCell(cc,-1);} this.setnum(cc,num);}
			}
			else{
				if(this.getnum(cc)*10+num<=max){ this.setnum(cc,this.getnum(cc)*10+num);}
				else if(num<=max){ this.setnum(cc,num);}
			}
			if(bd.getQnumCell(cc)!=-1 && k.NumberIsWhite){ bd.setQansCell(cc,-1); if(pc.bcolor=="white"){ bd.setQsubCell(cc,0);} }
			if(k.isAnsNumber){ if(k.mode==1){ bd.setQansCell(cc,-1);} bd.setQsubCell(cc,0); }
		}
		else if(ca=='-'){
			if(k.mode==1 && bd.getQnumCell(cc)!=-2){ this.setnum(cc,-2);}
			else{ this.setnum(cc,-1);}
			if(bd.getQnumCell(cc)!=-1 && k.NumberIsWhite){ bd.setQansCell(cc,-1); if(pc.bcolor=="white"){ bd.setQsubCell(cc,0);} }
			if(k.isAnsNumber){ bd.setQsubCell(cc,0);}
		}
		else{ return;}

		pc.paint(bd.cell[cc].cx, bd.cell[cc].cy, bd.cell[cc].cx, bd.cell[cc].cy);
	},

	setnum : function(cc,val){ (k.mode==1 ? bd.setQnumCell(cc,val) : bd.setQansCell(cc,val));},
	getnum : function(cc){ return (k.mode==1 ? bd.getQnumCell(cc) : bd.getQansCell(cc));}
};

//---------------------------------------------------------------------------
// ��Encode�N���X URL�̃G���R�[�h/�f�R�[�h������
//    enc.first_decode(search)
//      �͂��߂�URL����͂���puzzleid��G�f�B�^��player���𔻒f����
//    enc.get_search(url)
//      ���͂��ꂽURL��?�ȉ��̕�����Ԃ�
//    enc.data_decode(search,type)
//      pzldata����pzlflag,bbox���̕����ɕ�������
//
//    enc.decode4(bstr,func,max)
//      ques��0�`4�܂ł̏ꍇ�A�f�R�[�h����
//    enc.encode4(func,max)
//      ques��0�`4�܂ł̏ꍇ�A��蕔���G���R�[�h����
//
//    enc.decodeNumber10(bstr,func,max)
//      ques��0�`9�܂ł̏ꍇ�A�f�R�[�h����
//    enc.encodeNumber10(func,max)
//      ques��0�`9�܂ł̏ꍇ�A��蕔���G���R�[�h����
//
//    enc.decodeNumber16(bstr,func,max)
//      ques��0�`8192?�܂ł̏ꍇ�A�f�R�[�h����
//    enc.encodeNumber16(func,max)
//      ques��0�`8192?�܂ł̏ꍇ�A��蕔���G���R�[�h����
//
//    enc.decodecross_old(bstr)
//      Cross�̖�蕔���f�R�[�h����(���`��)
//
//    enc.include(ca,bottom,up)
//      ������ca��bottom��up�̊Ԃɂ��邩
//    enc.getURLbase()
//      ���̃X�N���v�g���u���Ă���URL��\������
//    enc.getDocbase()
//      ���̃X�N���v�g���u���Ă���h���C������\������
//---------------------------------------------------------------------------

// URL�G���R�[�h/�f�R�[�h
// Encode�N���X
Encode = Class.create();
Encode.prototype = {
	initialize : function(search){
		this.pid = "";			// ���͂��ꂽURL��ID����
		this.pzldata = "";		// ���͂��ꂽURL�̖�蕔��

		this.pzlflag = "";		// ���͂��ꂽURL�̃t���O����
		this.pzlcols = 0;		// ���͂��ꂽURL�̉�������
		this.pzlrows = 0;		// ���͂��ꂽURL�̏c������
		this.bbox = "";			// ���͂��ꂽURL�̔Ֆʕ���

		this.first_decode(search);
	},
	init : function(){
		this.pid = "";
		this.pzldata = "";
		this.pzlflag = "";
		this.pzlcols = 0;
		this.pzlrows = 0;
		this.bbox = "";
	},
	first_decode : function(search){
		if(search.length>0){
			if(search.substring(0,3)=="?m+"){
				k.callmode = "pmake"; k.mode = 1;
				search = search.substring(3, search.length);
			}
			else{
				k.callmode = "pplay"; k.mode = 3;
				search = search.substring(1, search.length);
			}
			this.data_decode(search, 0)
		}
	},

	//-----------------------------------------------------------
	get_search : function(url){
		var type = 0;	// 0�͂ς��Ղ�v3�Ƃ���
		if(url.indexOf("indi.s58.xrea.com", 0)>=0){
			if(url.indexOf("/sa/", 0)>=0 || url.indexOf("/sc/", 0)>=0){ type = 1;} // 1�͂ς��Ղ�/URL�W�F�l���[�^�Ƃ���
		}
		else if(url.indexOf("www.kanpen.net", 0)>=0){
			type = 2; // 2�̓J���y���Ƃ���
		}
		else if(url.indexOf("www.geocities.jp/heyawake", 0)>=0){
			type = 4; // 4�͂ւ�킯�A�v���b�g
		}

		var qus;
		if(type!=2){ qus = url.indexOf("?", 0);}
		else{ qus = url.indexOf("www.kanpen.net", 0);}

		if(qus>=0){
			this.data_decode(url.substring(qus+1,url.length), type);
		}
		else{
			this.init();
		}
		return type;
	},
	data_decode : function(search, type){
		var idx;

		this.init();

		if(type==0||type==1){
			idx = search.indexOf("/", 0);

			if(idx==-1){
				this.pid = search.substring(0, search.length);
				this.pzldata = "";
				return;
			}

			this.pid = search.substring(0, idx);
			if(type==0){
				this.pzldata = search.substring(idx+1, search.length);
			}
			else if(type==1){
				this.pzldata = search;
			}

			var inp = this.pzldata.split("/");
			if(!isNaN(parseInt(inp[0]))){ inp.unshift("");}

			if(inp.length==3){
				this.pzlflag = inp.shift();
				this.pzlcols = parseInt(inp.shift());
				this.pzlrows = parseInt(inp.shift());
			}
			else if(inp.length>=4){
				this.pzlflag = inp.shift();
				this.pzlcols = parseInt(inp.shift());
				this.pzlrows = parseInt(inp.shift());
				this.bbox = inp.join("/");
			}
		}
		else if(type==2){
			this.pid = "heyawake";
			idx = search.indexOf("=", 0);
			this.pzldata = search.substring(idx+1, search.length);

			var inp = this.pzldata.split("/");

			this.pzlflag = "";
			this.pzlrows = parseInt(inp.shift());
			this.pzlcols = parseInt(inp.shift());
			this.bbox = inp.join("/");
		}
		else if(type==4){
			this.pid = "heyawake";
			idx = search.indexOf("=", 0);
			this.pzldata = search.substring(idx+1, search.length);

			var inp = this.pzldata.split("/");

			this.pzlflag = "";
			var inp0 = inp.shift().split("x");
			this.pzlcols = parseInt(inp0[0]);
			this.pzlrows = parseInt(inp0[1]);
			this.bbox = inp.join("/");
		}

	},

	//-----------------------------------------------------------
	decode4 : function(bstr, func, max){
		cell = 0;

		for(i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i);
			if     (this.include(ca,"0","4")){ func(cell, parseInt(ca,16));    cell++; }
			else if(this.include(ca,"5","9")){ func(cell, parseInt(ca,16)-5);  cell+=2;}
			else if(this.include(ca,"a","e")){ func(cell, parseInt(ca,16)-10); cell+=3;}
			else if(this.include(ca,"g","z")){ cell+=(parseInt(ca,36)-15);}
			else if(ca=="."){ func(cell, -2); cell++;}

			if(cell>=max){ break;}
		}
		return bstr.substring(i+1,bstr.length);
	},
	encode4 : function(func, max){
		var i;
		var count = 0;
		var cm = "";
		var pstr = "";

		for(i=0;i<max;i++){
			pstr = "";

			if(func(i)>=0){
				if(func(i+1)>=0||func(i+1)==-2){ pstr=""+func(i).toString(16);}
				else if(func(i+2)>=0||func(i+2)==-2){ pstr=""+(5+func(i)).toString(16); i++;}
				else{ pstr=""+(10+func(i)).toString(16); i+=2;}
			}
			else if(func(i)==-2){ pstr=".";}
			else{ pstr=" "; count++;}

			if(count==0)      { cm += pstr;}
			else if(pstr!=" "){ cm += ((count+15).toString(36)+pstr); count=0;}
			else if(count==20){ cm += "z"; count=0;}
		}
		if(count>0){ cm += ((count+15).toString(36));}

		return cm;
	},

	//-----------------------------------------------------------
	decodeNumber10 : function(bstr){
		var i, ca, c;
		c = 0;
		for(i=0;i<bstr.length;i++){
			ca = bstr.charAt(i);

			if     (ca >= '0' && ca <= '9'){ bd.setQnumCell(c, parseInt(bstr.substring(i,i+1),10)); c++;}
			else if(ca >= 'a' && ca <= 'z'){ c += (parseInt(ca,36)-9);}
			else if(ca == '.'){ bd.setQnumCell(c, -2); c++;}
			else{ c++;}

			if(c > bd.cell.length){ break;}
		}

		return bstr.substring(i,bstr.length);
	},
	encodeNumber10 : function(){
		var count, pass, i;
		var cm="";
		var pstr="";

		count=0;
		for(i=0;i<bd.cell.length;i++){
			pstr = "";
			var val = bd.getQnumCell(i);

			if     (val==  -2            ){ pstr = ".";}
			else if(val>=   0 && val<  10){ pstr =       val.toString(10);}
			else{ count++;}

			if(count==0){ cm += pstr;}
			else if(pstr || count==26){ cm+=((9+count).toString(36)+pstr); count=0;}
		}
		if(count>0){ cm+=(9+count).toString(36);}

		return cm;
	},

	//-----------------------------------------------------------
	decodeNumber16 : function(bstr){
		var i, ca, c;
		c = 0;
		for(i=0;i<bstr.length;i++){
			ca = bstr.charAt(i);

			if((ca >= '0' && ca <= '9')||(ca >= 'a' && ca <= 'f')){ bd.setQnumCell(c, parseInt(bstr.substring(i,i+1),16)); c++;}
			else if(ca == '.'){ bd.setQnumCell(c, -2);                                        c++;      }
			else if(ca == '-'){ bd.setQnumCell(c, parseInt(bstr.substring(i+1,i+3),16));      c++; i+=2;}
			else if(ca == '+'){ bd.setQnumCell(c, parseInt(bstr.substring(i+1,i+4),16));      c++; i+=3;}
			else if(ca == '='){ bd.setQnumCell(c, parseInt(bstr.substring(i+1,i+4),16)+4096); c++; i+=3;}
			else if(ca == '%'){ bd.setQnumCell(c, parseInt(bstr.substring(i+1,i+4),16)+8192); c++; i+=3;}
			else if(ca >= 'g' && ca <= 'z'){ c += (parseInt(ca,36)-15);}
			else{ c++;}

			if(c > bd.cell.length){ break;}
		}

		return bstr.substring(i,bstr.length);
	},
	encodeNumber16 : function(){
		var count, pass, i;
		var cm="";
		var pstr="";

		count=0;
		for(i=0;i<bd.cell.length;i++){
			pstr = "";
			var val = bd.getQnumCell(i);

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

		return cm;
	},

	//-----------------------------------------------------------
	decodeRoomNumber16 : function(bstr){
		var i, ca, r;

		if(k.isOneNumber){ room.resetRarea();}

		r = 1;
		for(i=0;i<bstr.length;i++){
			ca = bstr.charAt(i);

			if((ca >= '0' && ca <= '9')||(ca >= 'a' && ca <= 'f')){ bd.setQnumCell(room.getTopOfRoom(r), parseInt(bstr.substring(i,i+1),16)); r++;}
			else if(ca == '-'){ bd.setQnumCell(room.getTopOfRoom(r), parseInt(bstr.substring(i+1,i+3),16));      r++; i+=2;}
			else if(ca == '+'){ bd.setQnumCell(room.getTopOfRoom(r), parseInt(bstr.substring(i+1,i+4),16));      r++; i+=3;}
			else if(ca == '='){ bd.setQnumCell(room.getTopOfRoom(r), parseInt(bstr.substring(i+1,i+4),16)+4096); r++; i+=3;}
			else if(ca == '%'){ bd.setQnumCell(room.getTopOfRoom(r), parseInt(bstr.substring(i+1,i+4),16)+8192); r++; i+=3;}
			else if(ca >= 'g' && ca <= 'z'){ r += (parseInt(ca,36)-15);}
			else{ r++;}

			if(r > room.rareamax){ break;}
		}

		return bstr.substring(i,bstr.length);
	},
	encodeRoomNumber16 : function(){
		var count, pass, i;
		var cm="";
		var pstr="";

		if(k.isOneNumber){ room.resetRarea();}

		count=0;
		for(i=1;i<=room.rareamax;i++){
			pstr = "";
			var val = bd.getQnumCell(room.getTopOfRoom(i));

			if     (val>=   0 && val<  16){ pstr =       val.toString(16);}
			else if(val>=  16 && val< 256){ pstr = "-" + val.toString(16);}
			else if(val>= 256 && val<4096){ pstr = "+" + val.toString(16);}
			else if(val>=4096 && val<8192){ pstr = "=" + (val-4096).toString(16);}
			else if(val>=8192            ){ pstr = "%" + (val-8192).toString(16);}
			else{ count++;}

			if(count==0){ cm += pstr;}
			else if(pstr || count==20){ cm+=((15+count).toString(36)+pstr); count=0;}
		}
		if(count>0){ cm+=(15+count).toString(36);}

		return cm;
	},

	//-----------------------------------------------------------
	decodeBorder : function(bstr){
		var i, w, ca;
		var pos1, pos2;

		if(bstr){
			pos1 = Math.min(int(((k.qcols-1)*k.qrows+4)/5)     , bstr.length);
			pos2 = Math.min(int((k.qcols*(k.qrows-1)+4)/5)+pos1, bstr.length);
		}
		else{ pos1 = 0; pos2 = 0;}

		for(i=0;i<pos1;i++){
			ca = parseInt(bstr.charAt(i),32);
			for(w=0;w<5;w++){
				if(i*5+w<(k.qcols-1)*k.qrows){ bd.setQuesBorder(i*5+w,(ca&Math.pow(2,4-w)?1:0));}
			}
		}

		var oft = (k.qcols-1)*k.qrows;
		for(i=0;i<pos2-pos1;i++){
			ca = parseInt(bstr.charAt(i+pos1),32);
			for(w=0;w<5;w++){
				if(i*5+w<k.qcols*(k.qrows-1)){ bd.setQuesBorder(i*5+w+oft,(ca&Math.pow(2,4-w)?1:0));}
			}
		}

		return bstr.substring(pos2,bstr.length);
	},
	encodeBorder : function(){
		var i, j, num, pass;
		var cm = "";

		num = 0; pass = 0;
		for(i=0;i<(k.qcols-1)*k.qrows;i++){
			if(bd.getQuesBorder(i)==1){ pass+=Math.pow(2,4-num);}
			num++; if(num==5){ cm += pass.toString(32); num=0; pass=0;}
		}
		if(num>0){ cm += pass.toString(32);}

		num = 0; pass = 0;
		for(i=(k.qcols-1)*k.qrows;i<(k.qcols-1)*k.qrows+k.qcols*(k.qrows-1);i++){
			if(bd.getQuesBorder(i)==1){ pass+=Math.pow(2,4-num);}
			num++; if(num==5){ cm += pass.toString(32); num=0; pass=0;}
		}
		if(num>0){ cm += pass.toString(32);}

		return cm;
	},
	//-----------------------------------------------------------

	decodeCrossMark : function(bstr,flag){
		var cc = -1;
		var i;
		for(i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i);

			if(ca >= '0' && ca <= '9' || ca >= 'a' && ca <= 'z'){
				cc += (parseInt(ca,36)+1);
				var cx = (flag==0?    cc%(k.qcols+1) :    cc%(k.qcols-1) +1);
				var cy = (flag==0?int(cc/(k.qcols+1)):int(cc/(k.qcols-1))+1);
				if(cy>=k.qcols-flag+1){ i++; break;}
				bd.setQnumCross(bd.getxnum(cx,cy), 1);
			}
			else if(ca == '.'){ cc += 36;}
			else{ cc++;}

			if(cc >= (flag==0?(k.qcols+1)*(k.qrows+1):(k.qcols-1)*(k.qrows-1))-1){ i++; break;}
		}
		return bstr.substring(i, bstr.length);
	},
	encodeCrossMark : function(flag){
		var count = 0;
		var cm = "";
		var pstr = "";
		var i;
		for(i=0;i<(flag==0?(k.qcols+1)*(k.qrows+1):(k.qcols-1)*(k.qrows-1));i++){
			var cx = (flag==0?i%(k.qcols+1):i%(k.qcols-1)+1);
			var cy = (flag==0?int(i/(k.qcols+1)):int(i/(k.qcols-1))+1);

			if(bd.getQnumCross(bd.getxnum(cx,cy))==1){ pstr = ".";}
			else{ pstr=" "; count++;}

			if(pstr!=" "){ cm += count.toString(36); count=0;}
			else if(count==36){ cm += "."; count=0;}
		}
		if(count>0){ cm += count.toString(36);}

		return cm;
	},

	//-----------------------------------------------------------

	decodecross_old : function(bstr){
		var i, j;

		for(i=0;i<Math.min(bstr.length, bd.cross.length);i++){
			if(this.bbox.charAt(i)=="0"){ bd.setQnumCross(i,0);}
			else if(this.bbox.charAt(i)=="1"){ bd.setQnumCross(i,1);}
			else if(this.bbox.charAt(i)=="2"){ bd.setQnumCross(i,2);}
			else if(this.bbox.charAt(i)=="3"){ bd.setQnumCross(i,3);}
			else if(this.bbox.charAt(i)=="4"){ bd.setQnumCross(i,4);}
			else{ bd.setQnumCross(i,-1);}
		}
		for(j=bstr.length;j<bd.cross.length;j++){ bd.setQnumCross(j,-1);}

		return bstr.substring(i,bstr.length);
	},

	include : function(char, bottom, up){
		if(bottom <= char && char <= up) return true;
		return false;
	},
	getURLbase : function(){ return "http://indi.s58.xrea.com/pzpr/v3/p.html";},
	getDocbase : function(){ return "http://indi.s58.xrea.com/";},
	kanpenbase : function(){ return "http://www.kanpen.net/";}
};

//---------------------------------------------------------------------------
// ��FileIO�N���X �t�@�C���̃f�[�^�`���G���R�[�h/�f�R�[�h������
//   ��fstruct�̓��e�ɂ���
//     "cellques41_42" Cell��́��Ɓ��̃G���R�[�h/�f�R�[�h
//     "cellqnum"      Cell��̖�萔���݂̂̃G���R�[�h/�f�R�[�h
//     "cellqnumb"     Cell��̍��}�X�{��萔��(0�`4)�̃G���R�[�h/�f�R�[�h
//     "cellqnumans"   Cell��̖�萔���Ɓ��ƁE�̃G���R�[�h/�f�R�[�h
//     "cellans"       Cell�́��ƁE�̃G���R�[�h/�f�R�[�h
//     "cellqans"     *Cell��̉񓚂݂̂̃G���R�[�h/�f�R�[�h
//     "cellqanssub"   Cell��̉񓚐����ƕ⏕�L��(qsub==1�`4)�̃G���R�[�h/�f�R�[�h
//     "cellqsub"      Cell��̕⏕�L���݂̂̃G���R�[�h/�f�R�[�h
//     "crossnum"      Cross/qnum��0�`�A-2���G���R�[�h/�f�R�[�h
//     "borderques"    ���E��(���)�̃G���R�[�h/�f�R�[�h
//     "borderline"    �񓚂̐��Ɓ~�̃G���R�[�h/�f�R�[�h
//     "borderans"     ���E��(��)�ƕ⏕�L���̃G���R�[�h/�f�R�[�h
//     "arearoom"      ����(�C�ӂ̌`)�̃G���R�[�h/�f�R�[�h
//     "special??"    *puz�I�u�W�F�N�g�̊֐����Ăяo��
//
//---------------------------------------------------------------------------
FileIO = Class.create();
FileIO.prototype = {
	initialize : function(){
		this.max = 0;
		this.check = new Array();
	},

	fileopen : function(arrays, type){
		if(type==1){
			if(arrays.shift()!='pzprv3'){ alert('�ς��Ղ�v3�`���̃t�@�C���ł͂���܂���B');}
			if(arrays.shift()!=k.puzzleid){ alert(puz.gettitle()+'�̃t�@�C���ł͂���܂���B');}
		}

		var row = parseInt(arrays.shift(), 10);
		var col = parseInt(arrays.shift(), 10);
		if(row>0 && col>0){ menu.ex.newboard2(col, row);}
		else{ um.callby = 0; return;}

		um.callby = 1;

		if(type==1){
			var line = 0;
			var item = 0;
			var stacks = new Array();
			while(1){
				if(arrays.length<=0){ break;}
				stacks.push( arrays.shift() ); line++;
				if     (k.fstruct[item] == "cellques41_42"&& line>=k.qrows    ){ this.decodeCellQues41_42(stacks); }
				else if(k.fstruct[item] == "cellqnum"     && line>=k.qrows    ){ this.decodeCellQnum(stacks);      }
				else if(k.fstruct[item] == "cellqnumb"    && line>=k.qrows    ){ this.decodeCellQnumb(stacks);     }
				else if(k.fstruct[item] == "cellqnumans"  && line>=k.qrows    ){ this.decodeCellQnumAns(stacks);   }
				else if(k.fstruct[item] == "cellans"      && line>=k.qrows    ){ this.decodeCellAns(stacks);       }
				else if(k.fstruct[item] == "cellqanssub"  && line>=k.qrows    ){ this.decodeCellQanssub(stacks);   }
				else if(k.fstruct[item] == "cellqsub"     && line>=k.qrows    ){ this.decodeCellQsub(stacks);      }
				else if(k.fstruct[item] == "crossnum"     && line>=k.qrows+1  ){ this.decodeCrossNum(stacks);      }
				else if(k.fstruct[item] == "borderques"   && line>=2*k.qrows-1){ this.decodeBorderQues(stacks);    }
				else if(k.fstruct[item] == "borderline"   && line>=2*k.qrows-1){ this.decodeBorderLine(stacks);    }
				else if(k.fstruct[item] == "borderans"    && line>=2*k.qrows-1){ this.decodeBorderAns(stacks);     }
				else if(k.fstruct[item] == "arearoom"     && line>=k.qrows+1  ){ this.decodeAreaRoom(stacks);      }
				else{ continue;}

				// decode�������Ƃ̏���
				line=0;
				item++;
				stacks = new Array();
			}
		}
		else if(type==2){
			puz.kanpenOpen(arrays);
		}

		um.callby = 0;
		base.resize_canvas();
	},
	filesave : function(type){
		var fname = prompt("�ۑ�����t�@�C��������͂��ĉ������B", k.puzzleid+".txt");
		if(!fname){ return;}
		var prohibit = ['\\', '/', ':', '*', '?', '"', '<', '>', '|']; var i;
		for(i=0;i<prohibit.length;i++){ if(fname.indexOf(prohibit[i])!=-1){ alert('�t�@�C�����Ƃ��Ďg�p�ł��Ȃ��������܂܂�Ă��܂��B'); return;} }

		document.fileform2.filename.value = fname;

		if     (navigator.platform.indexOf("Win")!=-1){ document.fileform2.platform.value = "Win";}
		else if(navigator.platform.indexOf("Mac")!=-1){ document.fileform2.platform.value = "Mac";}
		else                                          { document.fileform2.platform.value = "Others";}

		var str = "";

		if(type==1){
			str = "pzprv3/"+k.puzzleid+"/"+k.qrows+"/"+k.qcols+"/";

			var i;
			for(i=0;i<k.fstruct.length;i++){
				if     (k.fstruct[i] == "cellques41_42" ){ str += this.encodeCellQues41_42(); }
				else if(k.fstruct[i] == "cellqnum"      ){ str += this.encodeCellQnum();      }
				else if(k.fstruct[i] == "cellqnumb"     ){ str += this.encodeCellQnumb();     }
				else if(k.fstruct[i] == "cellqnumans"   ){ str += this.encodeCellQnumAns();   }
				else if(k.fstruct[i] == "cellans"       ){ str += this.encodeCellAns();       }
				else if(k.fstruct[i] == "cellqanssub"   ){ str += this.encodeCellQanssub();   }
				else if(k.fstruct[i] == "cellqsub"      ){ str += this.encodeCellQsub();      }
				else if(k.fstruct[i] == "crossnum"      ){ str += this.encodeCrossNum();      }
				else if(k.fstruct[i] == "borderques"    ){ str += this.encodeBorderQues();    }
				else if(k.fstruct[i] == "borderline"    ){ str += this.encodeBorderLine();    }
				else if(k.fstruct[i] == "borderans"     ){ str += this.encodeBorderAns();     }
				else if(k.fstruct[i] == "arearoom"      ){ str += this.encodeAreaRoom();      }
			}
		}
		else if(type==2){
			str = ""+k.qrows+"/"+k.qcols+"/";
			str += puz.kanpenSave();
		}

		document.fileform2.ques.value = str;

		if(type==1){
			if(!k.isKanpenExist || k.puzzleid=="lits"){ document.fileform2.urlstr.value = enc.getURLbase() + "?" + k.puzzleid + puz.pzldata();}
			else{ puz.pzloutput(2); document.fileform2.urlstr.value = document.urloutput.ta.value;}
		}
		else if(type==2){
			document.fileform2.urlstr.value = "";
		}

		document.fileform2.submit();
	},

	//-----------------------------------------------------------
	retarray : function(str){
		var array1 = str.split(" ");
		var array2 = new Array();
		var i;
		for(i=0;i<array1.length;i++){ if(array1[i]!=""){ array2.push(array1[i]);} }
		return array2;
	},

	//-----------------------------------------------------------
	decodeObj : function(func, stack){
		var i, n, c;
		c=0;
		for(i=0;i<stack.length;i++){
			var item = this.retarray( stack[i] );
			for(n=0;n<item.length;n++){
				func(c, item[n]);
				c++;
			}
		}
	},
	decodeCell   : function(func, stack){ this.decodeObj(func,stack);},
	decodeCross  : function(func, stack){ this.decodeObj(func,stack);},
	decodeBorder : function(func, stack){ this.decodeObj(func,stack);},

	encodeObj : function(func, max, width){
		var str = "";
		var i;
		for(i=0;i<max;i++){
			str += func(i);
			if(i%width==width-1){ str += "/";}
		}
		return str;
	},
	encodeCell  : function(func){ return this.encodeObj(func, k.qcols*k.qrows, k.qcols);},
	encodeCross : function(func){ return this.encodeObj(func, (k.qcols+1)*(k.qrows+1), (k.qcols+1));},
	encodeBorder : function(func){
		var str = "";
		var i;
		var ih = (k.qcols-1)*k.qrows;
		for(i=0;i<ih+k.qcols*(k.qrows-1);i++){
			str += func(i);

			if     (i< ih && i%(k.qcols-1)==k.qcols-2){ str += "/";}
			else if(i>=ih && (i-ih)%k.qcols==k.qcols-1){ str += "/";}
		}
		return str;
	},

	//-----------------------------------------------------------
	decodeCellQues41_42 : function(stack){
		this.decodeCell( function(c,ca){
			if     (ca == "-"){ bd.setQnumCell(c, -2);}
			else if(ca == "1"){ bd.setQuesCell(c, 41);}
			else if(ca == "2"){ bd.setQuesCell(c, 42);}
		},stack);
	},
	encodeCellQues41_42 : function(){
		return this.encodeCell( function(c){
			if     (bd.getQuesCell(c)==41){ return "1 ";}
			else if(bd.getQuesCell(c)==42){ return "2 ";}
			else if(bd.getQnumCell(c)==-2){ return "- ";}
			else                          { return ". ";}
		});
	},
	//-----------------------------------------------------------
	decodeCellQnum : function(stack){
		this.decodeCell( function(c,ca){
			if     (ca == "-"){ bd.setQnumCell(c, -2);}
			else if(ca != "."){ bd.setQnumCell(c, parseInt(ca));}
		},stack);
	},
	encodeCellQnum : function(){
		return this.encodeCell( function(c){
			if     (bd.getQnumCell(c)>=0) { return (bd.getQnumCell(c).toString() + " ");}
			else if(bd.getQnumCell(c)==-2){ return "- ";}
			else                          { return ". ";}
		});
	},
	//-----------------------------------------------------------
	decodeCellQnumb : function(stack){
		this.decodeCell( function(c,ca){
			if     (ca == "5"){ bd.setQnumCell(c, -2);}
			else if(ca != "."){ bd.setQnumCell(c, parseInt(ca));}
		},stack);
	},
	encodeCellQnumb : function(){
		return this.encodeCell( function(c){
			if     (bd.getQnumCell(c)>=0) { return (bd.getQnumCell(c).toString() + " ");}
			else if(bd.getQnumCell(c)==-2){ return "5 ";}
			else                          { return ". ";}
		});
	},
	//-----------------------------------------------------------
	decodeCellQnumAns : function(stack){
		this.decodeCell( function(c,ca){
			if     (ca == "#"){ bd.setQansCell(c, 1);}
			else if(ca == "+"){ bd.setQsubCell(c, 1);}
			else if(ca == "-"){ bd.setQnumCell(c, -2);}
			else if(ca != "."){ bd.setQnumCell(c, parseInt(ca));}
		},stack);
	},
	encodeCellQnumAns : function(){
		return this.encodeCell( function(c){
			if     (bd.getQnumCell(c)>=0) { return (bd.getQnumCell(c).toString() + " ");}
			else if(bd.getQnumCell(c)==-2){ return "- ";}
			else if(bd.getQansCell(c)==1) { return "# ";}
			else if(bd.getQsubCell(c)==1) { return "+ ";}
			else                          { return ". ";}
		});
	},
	//-----------------------------------------------------------
	decodeCellAns : function(stack){
		this.decodeCell( function(c,ca){
			if     (ca == "#"){ bd.setQansCell(c, 1);}
			else if(ca == "+"){ bd.setQsubCell(c, 1);}
		},stack);
	},
	encodeCellAns : function(){
		return this.encodeCell( function(c){
			if     (bd.getQansCell(c)==1){ return "# ";}
			else if(bd.getQsubCell(c)==1){ return "+ ";}
			else                         { return ". ";}
		});
	},
	//-----------------------------------------------------------
	decodeCellQanssub : function(stack){
		this.decodeCell( function(c,ca){
			if     (ca == "+"){ bd.setQsubCell(c, 1);}
			else if(ca == "-"){ bd.setQsubCell(c, 2);}
			else if(ca == "="){ bd.setQsubCell(c, 3);}
			else if(ca == "%"){ bd.setQsubCell(c, 4);}
			else if(ca != "."){ bd.setQansCell(c, parseInt(ca));}
		},stack);
	},
	encodeCellQanssub : function(){
		return this.encodeCell( function(c){
			if(bd.getQuesCell(c)!=0 || bd.getQnumCell(c)!=-1){ return ". ";}
			else if(bd.getQansCell(c)!=-1){ return (bd.getQansCell(c).toString() + " ");}
			else if(bd.getQsubCell(c)==1 ){ return "+ ";}
			else if(bd.getQsubCell(c)==2 ){ return "- ";}
			else if(bd.getQsubCell(c)==3 ){ return "= ";}
			else if(bd.getQsubCell(c)==4 ){ return "% ";}
			else                          { return ". ";}
		});
	},
	//-----------------------------------------------------------
	decodeCellQsub : function(stack){
		this.decodeCell( function(c,ca){
			if(ca != "0"){ bd.setQsubCell(c, parseInt(ca));}
		},stack);
	},
	encodeCellQsub : function(){
		return this.encodeCell( function(c){
			if     (bd.getQsubCell(c)>0){ return (bd.getQsubCell(c).toString() + " ");}
			else                        { return "0 ";}
		});
	},
	//-----------------------------------------------------------
	decodeCrossNum : function(stack){
		this.decodeCross( function(c,ca){
			if     (ca == "-"){ bd.setQnumCross(c, -2);}
			else if(ca != "."){ bd.setQnumCross(c, parseInt(ca));}
		},stack);
	},
	encodeCrossNum : function(){
		return this.encodeCross( function(c){
			if     (bd.getQnumCross(c)>=0) { return (bd.getQnumCross(c).toString() + " ");}
			else if(bd.getQnumCross(c)==-2){ return "- ";}
			else                           { return ". ";}
		});
	},
	//-----------------------------------------------------------
	decodeBorderQues : function(stack){
		this.decodeBorder( function(c,ca){
			if(ca == "1"){ bd.setQuesBorder(c, 1);}
		},stack);
	},
	encodeBorderQues : function(){
		return this.encodeBorder( function(c){
			if     (bd.getQuesBorder(c)==1){ return "1 ";}
			else                           { return "0 ";}
		});
	},
	//-----------------------------------------------------------
	decodeBorderLine : function(stack){
		this.decodeBorder( function(c,ca){
			if     (ca == "1" ){ bd.setLineBorder(c, 1);}
			else if(ca == "-1"){ bd.setQsubBorder(c, 2);}
		},stack);
	},
	encodeBorderLine : function(){
		return this.encodeBorder( function(c){
			if     (bd.getLineBorder(c)==1){ return "1 ";}
			else if(bd.getQsubBorder(c)==2){ return "-1 ";}
			else                           { return "0 ";}
		});
	},
	//-----------------------------------------------------------
	decodeBorderAns : function(stack){
		this.decodeBorder( function(c,ca){
			if     (ca == "1" ){ bd.setQansBorder(c, 1);}
			else if(ca == "2" ){ bd.setQansBorder(c, 1); bd.setQsubBorder(c, 1);}
			else if(ca == "-1"){ bd.setQsubBorder(c, 1);}
		},stack);
	},
	encodeBorderAns : function(){
		return this.encodeBorder( function(c){
			if     (bd.getQansBorder(c)==1 && bd.getQsubBorder(c)==1){ return "2 ";}
			else if(bd.getQansBorder(c)==1){ return "1 ";}
			else if(bd.getQsubBorder(c)==1){ return "-1 ";}
			else                           { return "0 ";}
		});
	},
	//-----------------------------------------------------------
	decodeAreaRoom : function(stack){
		stack.shift();
		this.decodeCell( function(c,ca){
			bd.cell[c].rarea = parseInt(ca)+1;
		},stack);

		var c;
		k.isOneNumber = 0;
		for(c=0;c<k.qcols*k.qrows;c++){
			if(bd.cell[c].dn()!=-1 && bd.cell[c].rarea != bd.cell[bd.cell[c].dn()].rarea){ bd.setQuesBorder(bd.cell[c].db(),1); }
			if(bd.cell[c].rt()!=-1 && bd.cell[c].rarea != bd.cell[bd.cell[c].rt()].rarea){ bd.setQuesBorder(bd.cell[c].rb(),1); }
		}
		k.isOneNumber = 1;

		room.resetRarea();
	},
	encodeAreaRoom : function(){
		room.resetRarea();
		var str = ""+room.rareamax+"/";
		return str + this.encodeCell( function(c){
			return ((bd.cell[c].rarea-1) + " ");
		});
	}
};

//---------------------------------------------------------------------------
// ��AnsCheck�N���X �����`�F�b�N�֘A�̊֐�������
//
//    ans.checkdir4Cell(cc, func)
//      �㉺���E4�����ŏ���func�𖞂����}�X�̐����J�E���g����
//
//    ans.checkQnumCross(func)
//      Cross�̎���̍��}�X�̐����`�F�b�N����
//
//    ans.linkBWarea(area)
//      AreaInfo(cell)�N���X�̃I�u�W�F�N�garea�Ŏ����ꂽ���}�Xor���}�X����q���肩�`�F�b�N����
//
//    ans.isAreaRect(area,id,func)
//      AreaInfo(cell)�N���X�̃I�u�W�F�N�garea��id�Ŏ����ꂽ���}�Xor���}�X�������`���`�F�b�N����
//    ans.isLoopLine(startid)
//      startid���܂ސ���Loop�ɂȂ��Ă��邩�\������
//    ans.isConnectLine(startid,terminal,startback)
//      ����startid����terminal�܂Ōq�����Ă��邩�Ԃ�
//    ans.LineList(startid)
//      startid�ƂȂ����Ă���S�Ă̐���ID��z��ŕԂ�
//
//    ans.lcntCell(cc)
//      1��Cell�Ɉ�����Ă�����̐���Ԃ�
//    ans.checkLcntCell(val)
//      Cell�Ɉ�����Ă�����̐���val���`�F�b�N����
//    ans.checkSideCell(func)
//      Border��������Ă�����̗�����Cell��func()==true���ǂ����𒲂ׂ�
//    ans.checkOneNumber(area, eval, func)
//      �����̒���func==true�𖞂���Cell�̐���eval()==true���ǂ����𒲂ׂ�
//    ans.getTopOfRoom(area, areaid)
//      ������TOP��Cell��ID��Ԃ�
//
//    ans.searchWarea()
//      �Ֆʂ̔��}�X�̃G���A����AreaInfo(cell)�N���X�Ŏ擾����
//    ans.searchBarea()
//      �Ֆʂ̍��}�X�̃G���A����AreaInfo(cell)�N���X�Ŏ擾����
//    ans.searchBWarea(func)
//      searchWarea, searchBarea����Ă΂��֐�
//    ans.sc0(func, area, i, areaid)
//      searchBWarea����Ă΂��ċN�Ăяo���p�֐�
//
//    ans.searchRarea()
//      �Ֆʂ̋��E���ŋ�؂�ꂽ��������AreaInfo(cell)�N���X�Ŏ擾����
//    ans.sr0(func, area, i, areaid)
//      searchRarea����Ă΂��ċN�Ăяo���p�֐�
//---------------------------------------------------------------------------

AreaInfo = Class.create();
AreaInfo.prototype = {
	initialize : function(){
		this.max = 0;
		this.check = new Array();
	}
};

// �񓚃`�F�b�N�N���X
// AnsCheck�N���X
AnsCheck = Class.create();
AnsCheck.prototype = {
	initialize : function(){
		this.errArea = false;
	},

	//-----------------------------------------------------------
	checkdir4Cell : function(cc, func){
		if(cc<0 || cc>=bd.cell.length){ return 0;}
		var cnt = 0;
		if(bd.cell[cc].up()!=-1 && func(bd.cell[cc].up())){ cnt++;}
		if(bd.cell[cc].dn()!=-1 && func(bd.cell[cc].dn())){ cnt++;}
		if(bd.cell[cc].lt()!=-1 && func(bd.cell[cc].lt())){ cnt++;}
		if(bd.cell[cc].rt()!=-1 && func(bd.cell[cc].rt())){ cnt++;}
		return cnt;
	},

	setErrAreaByCell : function(area, c, val){ this.setErrAreaById(area, area.check[c], val); },
	setErrAreaById : function(area, id, val){ this.setErrAreaById2(area, id, val, function(cc){ return true;}); },
	setErrAreaById2 : function(area, id, val, func){
		var i;
		for(i=0;i<k.qcols*k.qrows;i++){
			if(area.check[i]==id && func(i)){ bd.cell[i].error = val;}
		}
	},

	//-----------------------------------------------------------
	linkBWarea : function(area){
		if(area.max!=1){
			this.setErrAreaById(area,1,1);
			return false;
		}
		return true;
	},

	isAreaRect : function(area, func){ return this.checkAllArea(area, func, function(w,h,a){ return (w*h==a)}); },
	checkAllArea : function(area, func, func2){
		var id;
		for(id=1;id<=area.max;id++){
			var d = this.getSizeOfArea(area,id,func);
			if( !func2(d.x2-d.x1+1, d.y2-d.y1+1, d.cnt) ){
				this.setErrAreaById(area,id,1);
				return false;
			}
		}
		return true;
	},
	getSizeOfArea : function(area, id, func){
		var d = { x1:k.qcols+1, x2:-1, y1:k.qrows+1, y2:-1, cnt:0 };
		for(i=0;i<k.qcols*k.qrows;i++){
			if(area.check[i]==id){
				if(bd.cell[i].cx<d.x1){ d.x1 = bd.cell[i].cx;}
				if(d.x2<bd.cell[i].cx){ d.x2 = bd.cell[i].cx;}
				if(bd.cell[i].cy<d.y1){ d.y1 = bd.cell[i].cy;}
				if(d.y2<bd.cell[i].cy){ d.y2 = bd.cell[i].cy;}
				if(func(i)){ d.cnt++;}
			}
		}
		return d;
	},

	checkQnumsInArea : function(area, func){
		return this.checkOneNumber(area, function(a,cnt){ return func(cnt);}, function(c){ return (bd.getQnumCell(c)!=-1);} );
	},
	check2x2Block : function(func){
		var i;
		for(i=0;i<bd.cell.length;i++){
			if(bd.cell[i].cx<k.qcols-1 && bd.cell[i].cy<k.qrows-1){
				if( func(i) && func(i+1) && func(i+k.qcols) && func(i+k.qcols+1) ){
					bd.cell[i].error=1; bd.cell[i+1].error=1; bd.cell[i+k.qcols].error=1; bd.cell[i+k.qcols+1].error=1; return false;
				}
			}
		}
		return true;
	},
	checkSideCell : function(func){
		var i;
		for(i=0;i<bd.cell.length;i++){
			if(bd.cell[i].cx<k.qcols-1){
				if(func(i, i+1)){
					bd.cell[i].error=1; bd.cell[i+1].error=1; return false;
				}
			}
			if(bd.cell[i].cy<k.qrows-1){
				if(func(i, i+k.qcols)){
					bd.cell[i].error=1; bd.cell[i+k.qcols].error=1; return false;
				}
			}
		}
		return true;
	},

	//-----------------------------------------------------------
	checkQnumCross : function(func){	//func(cr,bcnt){} -> �G���[�Ȃ�false��Ԃ��֐��ɂ���
		var i=0;
		for(i=0;i<(k.qcols+1)*(k.qrows+1);i++){
			if(bd.getQnumCross(i)<0){ continue;}
			if(!func(bd.getQnumCross(i), bd.bcntCross(bd.cross[i].cx, bd.cross[i].cy))){ bd.cross[i].error=1; return false;}
		}
		return true;
	},

	//-----------------------------------------------------------
	isLoopLine : function(startid){ return this.isConnectLine(startid, startid, -1); },
	isConnectLine : function(startid, terminal, startback){
		var forward = -1;
		var backward = startback;
		var here = startid;
		if(startid==-1){ return false;}
		while(k.qcols*k.qrows*3){
			forward = bd.forwardLine(here, backward);
			backward = here; here = forward;
			if(forward==terminal || forward==startid || forward==-1){ break;}
		}

		if(forward==terminal){ return true;}
		return false;
	},

	LineList : function(startid){
		if(startid==-1){ return [];}
		var lists = [startid];
		var forward,backward, here;
		if(bd.backLine(startid)!=-1){
			here = startid;
			backward = bd.nextLine(startid);
			while(k.qcols*k.qrows*3){
				forward = bd.forwardLine(here, backward);
				backward = here; here = forward;
				if(forward==startid || forward==-1){ break;}
				lists.push(forward);
			}
		}
		if(forward!=startid && bd.nextLine(startid)!=-1){
			here = startid;
			backward = bd.backLine(startid);
			while(k.qcols*k.qrows*3){
				forward = bd.forwardLine(here, backward);
				backward = here; here = forward;
				if(forward==startid || forward==-1){ break;}
				lists.push(forward);
			}
		}
		return lists;
	},
	checkOneLoop : function(){
		var i;
		var cnt=0;
		var first=-1;
		for(i=0;i<bd.border.length;i++){ if((k.isborderAsLine==0?bd.getLineBorder(i)==1:bd.getQansBorder(i)==1)){ cnt++; if(first==-1){ first=i;} } }
		if(this.LineList(first).length!=cnt){
			col.changeErrors(first,first,1);
			for(i=0;i<bd.border.length;i++){ if(bd.border[i].error!=1){ bd.border[i].error=2;} }
			return false;
		}
		return true;
	},

	lcntCell : function(cc){ return col.lcntCell(cc);},
	checkLcntCell : function(val){
		var i;
		for(i=0;i<k.qcols*k.qrows;i++){ if(this.lcntCell(i)==val){ bd.cell[i].error=1; return false;} }
		return true;
	},
	checkdir4Border : function(){
		var i;
		for(i=0;i<k.qcols*k.qrows;i++){ if(bd.getQnumCell(i)>=0 && this.checkdir4Border1(i)!=bd.getQnumCell(i)){ bd.cell[i].error=1; return false;} }
		return true;
	},
	checkdir4Border1 : function(cc){
		if(cc<0 || cc>=bd.cell.length){ return 0;}
		var func = function(id){ return (id!=-1&&((bd.getQuesBorder(id)==1)||(bd.getQansBorder(id)==1)));};
		var cnt = 0;
		var cx = bd.cell[cc].cx; var cy = bd.cell[cc].cy;
		if( (k.outside==0 && k.isborderAsLine==0 && cy==0        ) || func(bd.getbnum(cx*2+1,cy*2  )) ){ cnt++;}
		if( (k.outside==0 && k.isborderAsLine==0 && cy==k.qrows-1) || func(bd.getbnum(cx*2+1,cy*2+2)) ){ cnt++;}
		if( (k.outside==0 && k.isborderAsLine==0 && cx==0        ) || func(bd.getbnum(cx*2  ,cy*2+1)) ){ cnt++;}
		if( (k.outside==0 && k.isborderAsLine==0 && cx==k.qcols-1) || func(bd.getbnum(cx*2+2,cy*2+1)) ){ cnt++;}
		return cnt;
	},

	//-----------------------------------------------------------
	checkOneNumber : function(area, eval, func){
		var i, c;
		for(i=1;i<=area.max;i++){
			if( eval( bd.getQnumCell(this.getQnumCellInArea(area,i)), this.getCellsOfRoom(area, i, func) ) ){
				this.setErrAreaById(area,i,1);
				return false;
			}
		}
		return true;
	},
	getQnumCellInArea : function(area, areaid){
		if(k.isOneNumber){ return this.getTopOfRoom(area,areaid); }
		var c;
		for(c=0;c<k.qcols*k.qrows;c++){ if(area.check[c]==areaid && bd.getQnumCell(c)!=-1){ return c;} }
		return -1;
	},
	getTopOfRoom : function(area, areaid){
		var cc=-1; var cx=k.qcols;
		var i;
		for(i=0;i<bd.cell.length;i++){
			if(area.check[i] == areaid && bd.cell[i].cx < cx){ cc=i; cx = bd.cell[i].cx; }
		}
		return cc;
	},
	getCntOfRoom : function(area, areaid){ return this.getCellsOfRoom(area, areaid, function(id){ return true;} ); },
	getCellsOfRoom : function(area, areaid, func){
		var cnt=0;
		var i;
		for(i=0;i<bd.cell.length;i++){
			if(area.check[i] == areaid && func(i)){ cnt++; }
		}
		return cnt;
	},

	checkSideAreaCell : function(func){
		var id;
		for(id=0;id<bd.border.length;id++){
			if(bd.getQuesBorder(id)!=1&&bd.getQansBorder(id)!=1){ continue;}
			var cc1 = bd.getcnum(int((bd.border[id].cx-(bd.border[id].cy%2))/2), int((bd.border[id].cy-(bd.border[id].cx%2))/2) );
			var cc2 = bd.getcnum(int((bd.border[id].cx+(bd.border[id].cy%2))/2), int((bd.border[id].cy+(bd.border[id].cx%2))/2) );
			if(cc1!=-1 && cc2!=-1 && func(cc1, cc2)){
				if(!this.errArea){ bd.cell[cc1].error=1; bd.cell[cc2].error=1;}
				else{ this.setErrAreaByCell(puz.rarea,cc1,1); this.setErrAreaByCell(puz.rarea,cc2,1); }
				return false;
			}
		}
		return true;
	},

	checkSeqBlocksInRoom : function(rarea){
		var id
		for(id=1;id<=rarea.max;id++){
			if( !this.checkSeqBlocksInSingleRoom(rarea, id) ){ return false;}
		}
		return true;
	},
	checkSeqBlocksInSingleRoom : function(rarea, areaid){
		var area = new AreaInfo();
		var func = function(id){ return (id!=-1 && bd.getQansCell(id)==1); };
		var c;
		for(c=0;c<bd.cell.length;c++){ if(rarea.check[c]==areaid && bd.getQansCell(c)==1){ area.check.push(0); }else{ area.check.push(-1); } }
		for(c=0;c<k.qcols*k.qrows;c++){ if(area.check[c]==0){ area.max++; this.sc0( func, area, c, area.max);} }

		var func = function(c){ return (bd.getQansCell(c)==1); };
		if(area.max>1){ this.setErrAreaById2(rarea, areaid, 1, func); return false;}
		return true;
	},

	checkSameObjectInRoom : function(area, getvalue, flag){
		var i, c;
		var d = new Array();
		$R(1,area.max,false).each(function(i){ d[i]=-1;});
		for(c=0;c<bd.cell.length;c++){
			if(getvalue(c)!=-1){
				if(d[area.check[c]]==-1 && getvalue(c)!=-1){ d[area.check[c]] = getvalue(c);}
				else if(flag==1 && d[area.check[c]]!=getvalue(c)){
					this.setErrAreaByCell(area,c,1);
					return false;
				}
			}
		}
		if(flag==0){
			for(i=1;i<=area.max;i++){
				if(d[i]==-1){
					this.setErrAreaById(area,i,1);
					return false;
				}
			}
		}
		return true;
	},
	checkObjectRoom : function(area, getvalue){
		var i, c;
		var maxqnum = -1;
		for(c=0;c<bd.cell.length;c++){ if(maxqnum<getvalue(c)){ maxqnum=getvalue(c);} }
		var d = new Array();
		$R(1,maxqnum,false).each(function(i){ d[i]=-1;});
		for(c=0;c<bd.cell.length;c++){
			if(getvalue(c)!=-1){
				if(d[getvalue(c)]==-1){ d[getvalue(c)] = area.check[c];}
				else if(d[getvalue(c)]!=area.check[c]){
					var c0 = c;
					for(c=0;c<bd.cell.length;c++){ if(getvalue(c)==getvalue(c0)){ bd.cell[c].error = 1;} }
					return false;
				}
			}
		}
		return true;
	},

	//-----------------------------------------------------------
	checkLcntCross : function(val, bp){
		var i;
		for(i=0;i<(k.qcols+1)*(k.qrows+1);i++){
			var cx = i%(k.qcols+1);
			var cy = int(i/(k.qcols+1));
			if(k.isoutsidecross==0 && k.isborderAsLine==0 && (cx==0||cy==0||cx==k.qcols||cy==k.qrows)){ continue;}
			if(bd.lcntCross(cx, cy)==val && (bp==0 || (bp==1&&bd.getQnumCross(bd.getxnum(cx, cy))==1) || (bp==2&&bd.getQnumCross(bd.getxnum(cx, cy))!=1) )){
				this.setCrossBorderError(cx,cy);
				return false;
			}
		}
		return true;
	},
	setCrossBorderError : function(cx,cy){
		if(bd.cross){ bd.cross[bd.getxnum(cx, cy)].error = 1;}
		if(bd.getbnum(cx*2  ,cy*2-1)!=-1){ bd.border[bd.getbnum(cx*2  ,cy*2-1)].error = 1;}
		if(bd.getbnum(cx*2  ,cy*2+1)!=-1){ bd.border[bd.getbnum(cx*2  ,cy*2+1)].error = 1;}
		if(bd.getbnum(cx*2-1,cy*2  )!=-1){ bd.border[bd.getbnum(cx*2-1,cy*2  )].error = 1;}
		if(bd.getbnum(cx*2+1,cy*2  )!=-1){ bd.border[bd.getbnum(cx*2+1,cy*2  )].error = 1;}
	},

	//-----------------------------------------------------------
	searchWarea : function(){
		return this.searchBWarea(function(id){ return (id!=-1 && bd.getQansCell(id)!=1); });
	},
	searchBarea : function(){
		return this.searchBWarea(function(id){ return (id!=-1 && bd.getQansCell(id)==1); });
	},
	searchBWarea : function(func){
		var area = new AreaInfo();
		var i=0;
		for(i=0;i<k.qcols*k.qrows;i++){
			if( func(i) ){ area.check[i]=0;}
			else{ area.check[i]=-1;}
		}
		for(i=0;i<k.qcols*k.qrows;i++){ if(area.check[i]==0){ area.max++; this.sc0(func, area, i, area.max);} }
		return area;
	},
	sc0 : function(func, area, i, areaid){
		if(i==-1 || area.check[i]!=0){ return;}
		area.check[i] = areaid;
		if( func(bd.cell[i].up()) ){ arguments.callee(func, area, bd.cell[i].up(), areaid);}
		if( func(bd.cell[i].dn()) ){ arguments.callee(func, area, bd.cell[i].dn(), areaid);}
		if( func(bd.cell[i].lt()) ){ arguments.callee(func, area, bd.cell[i].lt(), areaid);}
		if( func(bd.cell[i].rt()) ){ arguments.callee(func, area, bd.cell[i].rt(), areaid);}
		return;
	},

	searchRarea : function(){
		var area = new AreaInfo();
		var func = function(id){ return (id!=-1 && bd.getQuesBorder(id)==0 && bd.getQansBorder(id)==0); };
		var i=0;
		for(i=0;i<k.qcols*k.qrows;i++){ area.check[i]=0; }
		for(i=0;i<k.qcols*k.qrows;i++){ if(area.check[i]==0){ area.max++; this.sr0(func, area, i, area.max);} }
		return area;
	},
	sr0 : function(func, area, i, areaid){
		if(i==-1 || area.check[i]==areaid){ return;}
		area.check[i] = areaid;
		if( bd.cell[i].up()!=-1 && func(bd.cell[i].ub()) ){ arguments.callee(func, area, bd.cell[i].up(), areaid);}
		if( bd.cell[i].dn()!=-1 && func(bd.cell[i].db()) ){ arguments.callee(func, area, bd.cell[i].dn(), areaid);}
		if( bd.cell[i].lt()!=-1 && func(bd.cell[i].lb()) ){ arguments.callee(func, area, bd.cell[i].lt(), areaid);}
		if( bd.cell[i].rt()!=-1 && func(bd.cell[i].rb()) ){ arguments.callee(func, area, bd.cell[i].rt(), areaid);}
		return;
	}

	//-----------------------------------------------------------
};

//---------------------------------------------------------------------------
// ��UndoManager�N���X ������������AUndo/Redo�̓������������
//    um.addOpe(obj,property,id,old,num)
//      �w�肳�ꂽ�����ǉ�����Bid���������ꍇ�͍ŏI�����ύX����
//    um.enb_btn()
//      html���[��][�i]�{�^�����������Ƃ��\���ݒ肷��
//    um.undo()
//      Undo����
//    um.redo()
//      Redo����
//    um.exec(ope,num)
//      ����ope�𔽉f����Bundo(),redo()��������I�ɌĂ΂��
//    um.allerase()
//      �L�����Ă��������S�Ĕj������
//---------------------------------------------------------------------------

// ���͏��Ǘ��N���X
// Operation�N���X
Operation = Class.create();
Operation.prototype = {
	initialize : function(obj, property, id, old, num){
		this.obj = obj;
		this.property = property;
		this.id = id;
		this.old = old;
		this.num = num;
		this.chain = um.chainflag;
		this.undoonly = um.undoonly;
	}
};

// UndoManager�N���X
UndoManager = Class.create();
UndoManager.prototype = {
	initialize : function(){
		this.ope = new Array();	// Operation�N���X��ێ�����z��
		this.current = 0;		// ���݂̕\������ԍ���ێ�����
		this.callby = 0;		// ���̃N���X����̌Ăяo������1�ɂ���
		this.chainflag = 0;
		this.undoonly = 0;
		this.range = { x1:k.qcols+1, y1:k.qrows+1, x2:-2, y2:-2};
		this.reqReset = 0;
		this.disCombine = 0;
		this.enb_btn();
	},

	addOpe : function(obj, property, id, old, num){
		if(this.callby){ return;}
		else if(old==num){ return;}

		if(obj==property){
			if(obj=='cell'){
				this.addOpe('cell', 'ques', id, old.ques, 0);
				this.addOpe('cell', 'qnum', id, old.qnum, -1);
				this.addOpe('cell', 'qans', id, old.qans, -1);
				this.addOpe('cell', 'qsub', id, old.qsub, 0);
				if(old.obj){ this.addOpe('cell', 'numobj', id, old.numobj, "");}
			}
			else if(obj=='cross'){
				this.addOpe('cross', 'qnum', id, old.qnum, -1);
				if(old.obj){ this.addOpe('cross', 'numobj', id, old.numobj, "");}
			}
			else if(obj=='border'){
				this.addOpe('border', 'ques', id, old.ques, 0);
				this.addOpe('border', 'qans', id, old.qans, 0);
				this.addOpe('border', 'qsub', id, old.qsub, 0);
				this.addOpe('border', 'line', id, old.line, 0);
				this.addOpe('border', 'color', id, old.color, "");
			}
		}
		else{
			var lastid = this.ope.length-1;

			if(this.current < this.ope.length){
				var i;
				for(i=this.ope.length-1;i>=this.current;i--){ this.ope.pop();}
				lastid = -1;
			}
			else if(this.undoonly!=1){ lastid!=-1;}

			// �O��Ɠ����ꏊ�Ȃ�O��̍X�V�̂�
			if(lastid>=0 && this.ope[lastid].obj == obj && this.ope[lastid].property == property && this.ope[lastid].id == id && this.ope[lastid].num == old
				&& this.disCombine==0 && ( (obj == 'cell' && ( property=='qnum' || (property=='qans' && k.isAnsNumber) )) || obj == 'cross')
			)
			{
				this.ope[lastid].num = num;
			}
			else{
				this.ope.push(new Operation(obj, property, id, old, num));
				this.current++;
				if(this.chainflag==0){ this.chainflag = 1;}
			}
		}
		this.enb_btn();
	},
	enb_btn : function(){
		if(!this.ope.length){
			$("btnundo").disabled = true;
			$("btnredo").disabled = true;
		}
		else{
			if(!this.current){ $("btnundo").disabled = true;}
			else{ $("btnundo").disabled = false;}

			if(this.current==this.ope.length){ $("btnredo").disabled = true;}
			else{ $("btnredo").disabled = false;}
		}
	},

	//-----------------------------------------------------------------------
	undo : function(){
		if(this.current==0){ return;}

		this.callby = 1; this.range = { x1:k.qcols+1, y1:k.qrows+1, x2:-2, y2:-2};
		while(this.current>0){
			this.exec(this.ope[this.current-1], this.ope[this.current-1].old);
			this.current--;

			if(!this.ope[this.current].chain){ break;}
		}
		if(this.reqReset==1){ if(k.isOneNumber){ room.resetRarea();} this.reqReset=0;}
		this.callby = 0; pc.paint(this.range.x1, this.range.y1, this.range.x2, this.range.y2);
		this.enb_btn();
	},
	redo : function(){
		if(this.current==this.ope.length){ return;}
		this.callby = 1; this.range = { x1:k.qcols+1, y1:k.qrows+1, x2:-2, y2:-2};
		while(this.current<this.ope.length){
			if(this.ope[this.current].undoonly!=1){ this.exec(this.ope[this.current], this.ope[this.current].num);}
			this.current++;

			if(this.current<this.ope.length && !this.ope[this.current].chain){ break;}
		}
		if(this.reqReset==1){ if(k.isOneNumber){ room.resetRarea();} this.reqReset=0;}
		this.callby = 0; pc.paint(this.range.x1, this.range.y1, this.range.x2, this.range.y2);
		this.enb_btn();
	},
	exec : function(ope, num){
		if(ope.obj == 'cell'){
			if     (ope.property == 'ques'){ bd.setQuesCell(ope.id, num);}
			else if(ope.property == 'qnum'){ bd.setQnumCell(ope.id, num);}
			else if(ope.property == 'qans'){ bd.setQansCell(ope.id, num);}
			else if(ope.property == 'qsub'){ bd.setQsubCell(ope.id, num);}
			else if(ope.property == 'numobj'){ bd.cell[ope.id].numobj = num;}
			this.paintStack(bd.cell[ope.id].cx, bd.cell[ope.id].cy, bd.cell[ope.id].cx, bd.cell[ope.id].cy);
		}
		else if(ope.obj == 'cross'){
			if     (ope.property == 'qnum'){ bd.setQnumCross(ope.id, num);}
			else if(ope.property == 'numobj'){ bd.cross[ope.id].numobj = num;}
			this.paintStack(bd.cross[ope.id].cx-1, bd.cross[ope.id].cy-1, bd.cross[ope.id].cx, bd.cross[ope.id].cy);
		}
		else if(ope.obj == 'border'){
			if     (ope.property == 'ques'){ bd.setQuesBorder(ope.id, num);}
			else if(ope.property == 'qans'){ bd.setQansBorder(ope.id, num);}
			else if(ope.property == 'qsub'){ bd.setQsubBorder(ope.id, num);}
			else if(ope.property == 'line'){ bd.setLineBorder(ope.id, num);}
			else if(ope.property == 'color'){ bd.border[ope.id].color = num;}
			this.paintBorder(ope.id);
		}
		else if(ope.obj == 'board'){
			if     (ope.property == 'expandup'){ if(num==1){ menu.ex.expandup();}else{ menu.ex.reduceup();} }
			else if(ope.property == 'expanddn'){ if(num==1){ menu.ex.expanddn();}else{ menu.ex.reducedn();} }
			else if(ope.property == 'expandlt'){ if(num==1){ menu.ex.expandlt();}else{ menu.ex.reducelt();} }
			else if(ope.property == 'expandrt'){ if(num==1){ menu.ex.expandrt();}else{ menu.ex.reducert();} }
			else if(ope.property == 'reduceup'){ if(num==1){ menu.ex.reduceup();}else{ menu.ex.expandup();} }
			else if(ope.property == 'reducedn'){ if(num==1){ menu.ex.reducedn();}else{ menu.ex.expanddn();} }
			else if(ope.property == 'reducelt'){ if(num==1){ menu.ex.reducelt();}else{ menu.ex.expandlt();} }
			else if(ope.property == 'reducert'){ if(num==1){ menu.ex.reducert();}else{ menu.ex.expandrt();} }

			else if(ope.property == 'flipy'){ menu.ex.flipy(0,0,k.qcols-1,k.qrows-1);}
			else if(ope.property == 'flipx'){ menu.ex.flipx(0,0,k.qcols-1,k.qrows-1);}
			else if(ope.property == 'turnr'){ if(num==1){ menu.ex.turnr(0,0,k.qcols-1,k.qrows-1);} else{ menu.ex.turnl(0,0,k.qcols-1,k.qrows-1);} }
			else if(ope.property == 'turnl'){ if(num==1){ menu.ex.turnl(0,0,k.qcols-1,k.qrows-1);} else{ menu.ex.turnr(0,0,k.qcols-1,k.qrows-1);} }

			tc.Adjust();
			base.resize_canvas();
			this.range = { x1:0, y1:0, x2:k.qcols-1, y2:k.qrows-1};
			this.reqReset = 1;
		}
	},
	paintBorder : function(id){
		if(isNaN(id) || !bd.border[id]){ return;}
		if(bd.border[id].cx%2==1){
			this.paintStack(int((bd.border[id].cx-1)/2)-1, int(bd.border[id].cy/2)-1,
							int((bd.border[id].cx-1)/2)+1, int(bd.border[id].cy/2)   );
		}
		else{
			this.paintStack(int(bd.border[id].cx/2)-1, int((bd.border[id].cy-1)/2)-1,
							int(bd.border[id].cx/2)  , int((bd.border[id].cy-1)/2)+1 );
		}
	},
	paintStack : function(x1,y1,x2,y2){
		if(this.range.x1 > x1){ this.range.x1 = x1;}
		if(this.range.y1 > y1){ this.range.y1 = y1;}
		if(this.range.x2 < x2){ this.range.x2 = x2;}
		if(this.range.y2 < y2){ this.range.y2 = y2;}
	},
	allerase : function(){
		for(i=this.ope.length-1;i>=0;i--){ this.ope.pop();}
		this.current = 0;
		this.enb_btn();
	}
};

//---------------------------------------------------------------------------
// ��Menu�N���X [�t�@�C��]���̃��j���[�̓����ݒ肷��
//    menu.menuarea()
//      ���j���[�A�T�u���j���[�A�|�b�v�A�b�v�E�B���h�E�̓���ݒ���s��
//
//    menu.submenuopen()
//      �}�E�X�����j���[���ڏ�ɗ������ɃT�u���j���[��\������
//    menu.submenuhover()
//      �}�E�X������T�u���j���[�̍��ڏ�ɗ������ɂɃT�u���j���[��class������smenusel�ɂ���
//    menu.submenuout()
//      �}�E�X������T�u���j���[�̍��ڂ𗣂ꂽ���ɃT�u���j���[��class�������f�t�H���g�ɖ߂�
//    menu.submenuclose1()
//      �}�E�X���T�u���j���[�𗣂ꂽ���ɃT�u���j���[��close����
//    menu.submenuclose()
//      �T�u���j���[��close����
//
//    menu.smenuclick()
//      �T�u���j���[���N���b�N���ꂽ���A�T�u���j���[����Ďw�肳�ꂽ�|�b�v�A�b�v�E�B���h�E���J��
//    menu.poparea()
//      �|�b�v�A�b�v�E�B���h�E�̃{�^���ɃC�x���g�����蓖�Ă�
//    menu.popclose()
//      �|�b�v�A�b�v�E�B���h�E��close����
//
//    menu.titlebardown()
//      �|�b�v�A�b�v�E�B���h�E�𓮂����������s��
//    menu.titlebarup() menu.titlebarout()
//      �|�b�v�A�b�v�E�B���h�E�𓮂����Ȃ�����
//    menu.titlebarmove()
//      �|�b�v�A�b�v�E�B���h�E�𓮂���
//---------------------------------------------------------------------------

// ���j���[�`��/�擾/html�\���n
// Menu�N���X
Menu = Class.create();
Menu.prototype = {
	initialize : function(){
		this.submenu = "";			// �\�����Ă���T�u���j���[�E�B���h�E(�I�u�W�F�N�g)
		this.selectedmenu = 0;		// �\�����Ă���T�u���j���[ID
		this.popupmenu = "";		// �\�����Ă���|�b�v�A�b�v�E�B���h�E(�I�u�W�F�N�g)
		this.resumecount = 0;		// �{�^����������Ă��炵�΂炭�������Ȃ����߂̕ϐ�
		this.istitlebarpress = 0;	// �^�C�g���o�[��������Ă��邩
		this.offset = new Pos(0, 0);// �|�b�v�A�b�v�E�B���h�E�̍��ォ��̈ʒu
		this.openflag = 0;
		this.ex = new MenuExec();
	},

	//---------------------------------------------------------------------------
	menuarea : function(){
		if(k.callmode=="pplay"){
			$("menu1").className = "menunull";
			$("s2menu1").className = "smenunull";
		}
		if(k.isKanpenExist){
			new Insertion.Bottom($("submenupanel1"), "<div class=\"smenu\" id=\"s1menu6\">pencilbox�̃t�@�C�����J��</div>\n");
			new Insertion.Bottom($("submenupanel1"), "<div class=\"smenu\" id=\"s1menu7\">pencilbox�̃t�@�C����ۑ�</div>\n");
		}

		var self = this;	// each���ł�this�̎w�����̂��ς��̂ŁA������this��self�ɑ������
		$$("div.menu").each(
			function(o){
				Event.observe(o, 'mouseover', self.submenuopen.bindAsEventListener(self), true);
			}
		);
		$$("div.submenu").each(function(o){
			o.style.backgroundColor = puz.smenubgcolor();
			o.style.visibility = "visible";
			Event.observe(o, 'click'   , self.smenuclick.bindAsEventListener(self), true);
			Event.observe(o, 'mouseout', self.submenuclose1.bindAsEventListener(self), true);
		});

		$$("div.smenu").each(
			function(o){
				Event.observe(o, 'click'    , self.smenuclick.bindAsEventListener(self), true);
				Event.observe(o, 'mouseover', self.submenuhover.bindAsEventListener(self), true);
				Event.observe(o, 'mouseout' , self.submenuout.bindAsEventListener(self), true);
			}
		);
		$$("div.popup").each(
			function(pop){
				pop.style.left = 0; pop.style.top = 0;
				pop.style.zIndex = 100;
			}
		);
		var func = function(o){
			unselectable(o);
			Event.observe(o, 'mousedown', self.titlebardown.bindAsEventListener(self), true);
			Event.observe(o, 'mouseup'  , self.titlebarup.bindAsEventListener(self), true);
			Event.observe(o, 'mouseout' , self.titlebarout.bindAsEventListener(self), true);
			Event.observe(o, 'mousemove', self.titlebarmove.bindAsEventListener(self), true);
		};
		$$("div.titlebar").each(func);
		//$$("form").each(func);
		func($("credit3_1"));

		this.poparea();
	},
	//---------------------------------------------------------------------------
	// �T�u���j���[�֘A
	submenuopen : function(e){
		if(this.resumecount>0) return;
		this.resumecount = 1;

		var id = parseInt(Event.element(e).id.charAt(4));

		if(this.selectedmenu!=id){
			$R(1,4,false).each(function(i){
				if($("menu"+i).className == "menusel"){ $("menu"+i).className = "menu";}
				Element.hide($("submenupanel"+i));
			});

			this.submenuclose();

			$(Event.element(e).id).className = "menusel";

			this.submenu = $("submenupanel"+id);
			this.submenu.style.left = Position.cumulativeOffset(Event.element(e))[0] - 3 + k.IEMargin.x;
			this.submenu.style.top = Position.cumulativeOffset(Event.element(e))[1] + Element.getDimensions(Event.element(e)).height - 3 + k.IEMargin.y;

			Element.show(this.submenu);
			this.selectedmenu = id;
			this.openflag = 0;
		}
	},
	submenuhover : function(e){
		Event.element(e).className = "smenusel";
	},
	submenuout : function(){
		$$("div.smenusel").each(function(o){ o.className = "smenu";});
	},
	// �}�E�X�����ꂽ�Ƃ��ɑ����N���[�Y����
	submenuclose1 : function(e){
		var self = menu;
		if(this.submenu){
			if(!insideOf($("menu"+this.selectedmenu),e) && !insideOf(this.submenu,e)){
				this.submenuclose();
			}
		}
	},
	submenuclose : function(){
		if(this.submenu){
			Element.hide(this.submenu);
			this.submenu = '';

			$("menu"+this.selectedmenu).className = "menu";
			this.selectedmenu = 0;
		}
	},

	//---------------------------------------------------------------------------
	// ���j���[Popup
	smenuclick : function(e){
		if(this.resumecount>0) return;
		this.resumecount = 2;

		if(Event.element(e).className == "smenunull"){ return;}

		this.submenuclose();
		if(this.popupmenu) this.popclose();	//�\�����Ă���E�B���h�E������ꍇ�͕���

		switch(Event.element(e).id){
			case "s1menu1":
				this.popupmenu = $("pop1_1");
				document.newboard.col.value = k.qcols;
				document.newboard.row.value = k.qrows;
				k.enableKey = false;
				break;
			case "s1menu2": this.popupmenu = $("pop1_2"); break;
			case "s1menu3":
				this.popupmenu = $("pop1_3");
				document.urloutput.ta.value = "";
				break;
			case "s1menu4":
				document.fileform.pencilbox.value = "0";
				if(Prototype.Browser.IE || Prototype.Browser.Gecko){ if(this.openflag==0){ this.popupmenu = $("pop1_4"); this.openflag=1;}}
				else{ if(this.openflag==0){ document.fileform.filebox.click();}}
				break;
			case "s1menu5": this.ex.filesave(); break;
			case "s1menu6":
				if(puz.kanpenOpen){
					document.fileform.pencilbox.value = "1";
					if(Prototype.Browser.IE || Prototype.Browser.Gecko){ if(this.openflag==0){ this.popupmenu = $("pop1_4"); this.openflag=1;}}
					else{ if(this.openflag==0){ document.fileform.filebox.click();}}
				}
				break;
			case "s1menu7": if(puz.kanpenSave){ this.ex.filesave2();} break;
			case "s2menu1": this.popupmenu = $("pop2_1"); break;
			case "s2menu2": this.popupmenu = $("pop2_2"); break;
			case "s4menu1":
				this.popupmenu = $("pop4_1");
				document.dispsize.cs.value = k.def_csize;
				k.enableKey = false;
				break;
			case "s4menu2": k.widthmode=1; base.resize_canvas(); break;
			case "s4menu3": k.widthmode=2; base.resize_canvas(); break;
			case "s4menu4": k.widthmode=3; base.resize_canvas(); break;
			case "s3menu1": this.popupmenu = $("pop3_1"); break;
			case "s3menu2": location.href = "./"; break;
			case "s3menu3": location.href = "../../"; break;
			case "s3menu4": location.href = "http://d.hatena.ne.jp/sunanekoroom/"; break;
		}

		if(this.popupmenu){
			this.popupmenu.style.left = Event.pointerX(e) - 8 + k.IEMargin.x;
			this.popupmenu.style.top  = Event.pointerY(e) - 8 + k.IEMargin.y;
			this.popupmenu.style.visibility = "visible";
		}
	},
	poparea : function(){

		// Inserton.Top�͋t���ɂ���
		new Insertion.Top(document.urloutput, "<input type=\"button\" name=\"pzprv3edit\" value=\"�ς��Ղ�v3�̍ĕҏW�pURL���o�͂���\" /><br>\n");
		if(k.puzzleid=="heyawake"){ new Insertion.Top(document.urloutput, "<input type=\"button\" name=\"heyaapp\" value=\"�ւ�킯�A�v���b�g��URL���o�͂���\" /><br>\n");}
		if(k.isKanpenExist){ new Insertion.Top(document.urloutput, "<input type=\"button\" name=\"kanpen\" value=\"�J���y����URL���o�͂���\" /><br>\n");}
		if(!k.ispzprv3ONLY){ new Insertion.Top(document.urloutput, "<input type=\"button\" name=\"pzprapplet\" value=\"�ς��Ղ�\(�A�v���b�g\)��URL���o�͂���\" /><br>\n");}
		new Insertion.Top(document.urloutput, "<input type=\"button\" name=\"pzprv3\" value=\"�ς��Ղ�v3��URL���o�͂���\" /><br>\n");
		new Insertion.Top(document.urloutput, "URL���o�͂��܂��B<br>\n");

		Event.observe(document.newboard.newboard, 'click', this.ex.newboard.bindAsEventListener(this.ex), false);
		Event.observe(document.newboard.cancel, 'click', this.popclose.bindAsEventListener(this), false);

		Event.observe(document.urlinput.urlinput, 'click', this.ex.urlinput.bindAsEventListener(this.ex), false);
		Event.observe(document.urlinput.cancel, 'click', this.popclose.bindAsEventListener(this), false);

		Event.observe(document.urloutput.pzprv3,     'click', this.ex.urloutput.bindAsEventListener(this.ex), false);
		if(!k.ispzprv3ONLY)       { Event.observe(document.urloutput.pzprapplet, 'click', this.ex.urloutput.bindAsEventListener(this.ex), false);}
		if(k.isKanpenExist)       { Event.observe(document.urloutput.kanpen,     'click', this.ex.urloutput.bindAsEventListener(this.ex), false);}
		if(k.puzzleid=="heyawake"){ Event.observe(document.urloutput.heyaapp,    'click', this.ex.urloutput.bindAsEventListener(this.ex), false);}
		Event.observe(document.urloutput.pzprv3edit, 'click', this.ex.urloutput.bindAsEventListener(this.ex), false);
		Event.observe(document.urloutput.close,      'click', this.popclose.bindAsEventListener(this), false);

		Event.observe(document.fileform.filebox,   'change', this.ex.fileopen.bindAsEventListener(this), false);
		Event.observe(document.fileform.close,      'click', this.popclose.bindAsEventListener(this), false);

		Event.observe(document.dispsize.dispsize, 'click', this.ex.dispsize.bindAsEventListener(this.ex), false);
		Event.observe(document.dispsize.cancel, 'click', this.popclose.bindAsEventListener(this), false);

		Event.observe(document.adjust.expandup, 'click', this.ex.popupadjust.bindAsEventListener(this.ex), false);
		Event.observe(document.adjust.expanddn, 'click', this.ex.popupadjust.bindAsEventListener(this.ex), false);
		Event.observe(document.adjust.expandlt, 'click', this.ex.popupadjust.bindAsEventListener(this.ex), false);
		Event.observe(document.adjust.expandrt, 'click', this.ex.popupadjust.bindAsEventListener(this.ex), false);
		Event.observe(document.adjust.reduceup, 'click', this.ex.popupadjust.bindAsEventListener(this.ex), false);
		Event.observe(document.adjust.reducedn, 'click', this.ex.popupadjust.bindAsEventListener(this.ex), false);
		Event.observe(document.adjust.reducelt, 'click', this.ex.popupadjust.bindAsEventListener(this.ex), false);
		Event.observe(document.adjust.reducert, 'click', this.ex.popupadjust.bindAsEventListener(this.ex), false);
		Event.observe(document.adjust.close, 'click', this.popclose.bindAsEventListener(this), false);

		Event.observe(document.flip.turnl, 'click', this.ex.popupflip.bindAsEventListener(this.ex), false);
		Event.observe(document.flip.turnr, 'click', this.ex.popupflip.bindAsEventListener(this.ex), false);
		Event.observe(document.flip.flipx, 'click', this.ex.popupflip.bindAsEventListener(this.ex), false);
		Event.observe(document.flip.flipy, 'click', this.ex.popupflip.bindAsEventListener(this.ex), false);
		Event.observe(document.flip.close, 'click', this.popclose.bindAsEventListener(this), false);

		Event.observe(document.credit.close, 'click', this.popclose.bindAsEventListener(this), false);
	},
	popclose : function(){
		if(this.popupmenu){
			this.popupmenu.style.visibility = "hidden";
			this.popupmenu = '';
			this.submenuclose();
			this.istitlebarpress = 0;
			k.enableKey = true;
		}
	},

	titlebardown : function(e){
		this.istitlebarpress = 1;
		this.offset.x = Event.pointerX(e) - parseInt(this.popupmenu.style.left);
		this.offset.y = Event.pointerY(e) - parseInt(this.popupmenu.style.top);
	},
	titlebarup   : function(e){ this.istitlebarpress = 0; },
	titlebarout  : function(e){ if(this.popupmenu && !insideOf(this.popupmenu, e)){ this.istitlebarpress = 0;} },
	titlebarmove : function(e){
		if(this.popupmenu && this.istitlebarpress){
			//this.istitlebarpress = 0;

			var x = Event.pointerX(e);
			var y = Event.pointerY(e);

			this.popupmenu.style.left = (Event.pointerX(e) - this.offset.x);
			this.popupmenu.style.top  = (Event.pointerY(e) - this.offset.y);

			//this.istitlebarpress = 1;
		}
	}
};

//---------------------------------------------------------------------------
// ��MenuExec�N���X �|�b�v�A�b�v�E�B���h�E���Ń{�^���������ꂽ���̏������e���L�q����
//    menu.ex.newboard(e)
//      �V�K�Ֆʂ��쐬����
//    menu.ex.newboard2(col,row)
//      �T�C�Y(col�~row)�̐V�K�Ֆʂ��쐬����(���s��)
//
//    menu.ex.urlinput(e)
//      URL����͂���
//    menu.ex.urloutput(e)
//      URL���o�͂���
//
//    menu.ex.fileopen(e)
//      �t�@�C�����J��
//    menu.ex.filesave(e)
//      �t�@�C����ۑ�����
//
//    menu.ex.dispsize(e)
//      Canvas�ł̃}�X�ڂ̕\���T�C�Y��ύX����
//
//    menu.ex.popupadjust(e)
//      "�Ֆʂ̒���"�Ń{�^���������ꂽ���̓�����w�肷��
//    menu.ex.expandup() menu.ex.expanddn() menu.ex.expandlt() menu.ex.expandrt()
//    menu.ex.expand(number, func)
//      �Ֆʂ̊g����s��
//    menu.ex.reduceup() menu.ex.reducedn() menu.ex.reducelt() menu.ex.reducert()
//    menu.ex.reduce(number, func)
//      �Ֆʂ̏k�����s��
//
//    menu.ex.popupflip(e)
//      "��]�E���]"�Ń{�^���������ꂽ���̓�����w�肷��
//    menu.ex.flipy(rx1,ry1,rx2,ry2)
//      �㉺���]���s��
//    menu.ex.flipx(rx1,ry1,rx2,ry2)
//      ���E���]���s��
//    menu.ex.turnr(rx1,ry1,rx2,ry2)
//      �E90����]���s��
//    menu.ex.turnl(rx1,ry1,rx2,ry2)
//      ��90����]���s��
//    menu.ex.turn2(rx1,ry1,rx2,ry2,f)
//      turnr(),turnl()��������I�ɌĂ΂���]���s��
//---------------------------------------------------------------------------

// Menu�N���X���s��
MenuExec = Class.create();
MenuExec.prototype = {
	initialize : function(){ },

	//------------------------------------------------------------------------------
	// �ՖʐV�K�쐬
	newboard : function(e){
		if(menu.popupmenu){
			var col = int(parseInt(document.newboard.col.value));
			var row = int(parseInt(document.newboard.row.value));

			if(col>0 && row>0){ this.newboard2(col,row);}
			menu.popclose();
			base.resize_canvas();				// Canvas���X�V����
		}
	},
	newboard2 : function(col,row){
		// �����̃T�C�Y��菬�����Ȃ�delete����
		var n;
		for(n=this.clcnt(k.qcols,k.qrows)-1;n>=this.clcnt(col,row);n--){
			if(bd.cell[n].numobj){ $("numobj_parent").removeChild(bd.cell[n].numobj);}
			delete bd.cell[n]; bd.cell.pop();
		}
		if(k.iscross){ for(n=(k.qcols+1)*(k.qrows+1)-1;n>=(col+1)*(row+1);n--){
			if(bd.cross[n].numobj){ $("numobj_parent").removeChild(bd.cross[n].numobj);}
			delete bd.cross[n]; bd.cross.pop();
		}}
		if(k.isborder){ for(n=this.bdcnt(k.qcols,k.qrows)-1;n>=this.bdcnt(col,row);n--){
			//if(bd.border[n].numobj){ $("numobj_parent").removeChild(bd.border[n].numobj);}
			delete bd.border[n]; bd.border.pop();
		}}

		// �����̃T�C�Y���傫���Ȃ�new���s��
		$R(this.clcnt(k.qcols,k.qrows),this.clcnt(col,row),true).each(function(i){ bd.cell.push(new Cell());});
		if(k.iscross){ $R((k.qcols+1)*(k.qrows+1),(col+1)*(row+1),true).each(function(i){ bd.cross.push(new Cross());});}
		if(k.isborder){ $R(this.bdcnt(k.qcols,k.qrows),this.bdcnt(col,row),true).each(function(i){ bd.border.push(new Border());});}

		// �T�C�Y�̕ύX
		k.qcols = col; k.qrows = row;

		// cellinit() = allclear()+setpos()���Ăяo��
		bd.cell.each(function(c,i){ c.cellinit(i);});
		if(k.iscross){ bd.cross.each(function(c,i){ c.cellinit(i);});}
		if(k.isborder){ bd.border.each(function(c,i){ c.cellinit(i);});}

		if(k.isOneNumber){ room.resetRarea();}

		um.allerase();
	},
	clcnt : function(col,row){
		if(k.outside){ return col*row+2*(col+row);}
		return col*row;
	},
	bdcnt : function(col,row){
		if(k.outside||k.isborderAsLine){ return (col-1)*row+col*(row-1)+2*(col+row);}
		return (col-1)*row+col*(row-1);
	},

	//------------------------------------------------------------------------------
	urlinput : function(e){
		if(menu.popupmenu){
			var type = enc.get_search(document.urlinput.ta.value);
			if(enc.pzlcols && enc.pzlrows){ this.newboard2(enc.pzlcols, enc.pzlrows);}
			puz.pzlinput(type);
			if(k.isOneNumber){ room.resetRarea();}

			menu.popclose();
		}
	},

	//------------------------------------------------------------------------------
	urloutput : function(e){
		if(menu.popupmenu){
			switch(Event.element(e).name){
				case "pzprv3":     puz.pzloutput(0); break;
				case "pzprapplet": puz.pzloutput(1); break;
				case "kanpen":     puz.pzloutput(2); break;
				case "pzprv3edit": puz.pzloutput(3); break;
				case "heyaapp":    puz.pzloutput(4); break;
			}
		}
	},

	//------------------------------------------------------------------------------
	fileopen : function(e){
		if(menu.popupmenu){ menu.popclose();}
		if(document.fileform.filebox.value){
			document.fileform.submit();
			document.fileform.filebox.value = "";
		}
	},
	filesave : function(e){
		fio.filesave(1);
	},
	filesave2 : function(e){
		fio.filesave(2);
	},

	//------------------------------------------------------------------------------
	// �\���T�C�Y�ύX
	dispsize : function(e){
		if(menu.popupmenu){
			var csize = parseInt(document.dispsize.cs.value);

			if(csize>0){
				k.def_psize = int(csize*(k.def_psize/k.def_csize));
				if(k.def_psize==0){ k.def_psize=1;}
				k.def_csize = int(csize);
			}
			menu.popclose();
			base.resize_canvas();				// Canvas���X�V����
		}
	},

	//------------------------------------------------------------------------------
	// �Ֆʂ̒����֘A�̃{�^���������ꂽ�Ƃ�
	popupadjust : function(e){
		if(menu.popupmenu){
			if(menu.resumecount>0){ return;}
			menu.resumecount = 2;
			um.chainflag = 0;

			if(Event.element(e).name.indexOf("expand")!=-1){ um.addOpe('board', Event.element(e).name, 0, 0, 1);}

			var f=true;
			switch(Event.element(e).name){
				case "expandup": this.expandup(); break;
				case "expanddn": this.expanddn(); break;
				case "expandlt": this.expandlt(); break;
				case "expandrt": this.expandrt(); break;
				case "reduceup": um.undoonly = 1; if(k.qrows>1){ this.reduceup();}else{f=false;} um.undoonly = 0; break;
				case "reducedn": um.undoonly = 1; if(k.qrows>1){ this.reducedn();}else{f=false;} um.undoonly = 0; break;
				case "reducelt": um.undoonly = 1; if(k.qcols>1){ this.reducelt();}else{f=false;} um.undoonly = 0; break;
				case "reducert": um.undoonly = 1; if(k.qcols>1){ this.reducert();}else{f=false;} um.undoonly = 0; break;
			}

			if(f&&Event.element(e).name.indexOf("reduce")!=-1){ um.addOpe('board', Event.element(e).name, 0, 0, 1);}

			if(k.isOneNumber){ room.resetRarea();}
			tc.Adjust();
			base.resize_canvas();				// Canvas���X�V����
		}
	},
	expandup : function(){ this.expand(k.qcols, 'r', function(cx,cy,f){ return (cy==0);}          , function(bx,by){ return (by==1)||(by==2);},                     'up' ); },
	expanddn : function(){ this.expand(k.qcols, 'r', function(cx,cy,f){ return (cy==k.qrows-1+f);}, function(bx,by){ return (by==2*k.qrows-1)||(by==2*k.qrows-2);}, 'dn' ); },
	expandlt : function(){ this.expand(k.qrows, 'c', function(cx,cy,f){ return (cx==0);}          , function(bx,by){ return (bx==1)||(bx==2);},                     'lt' ); },
	expandrt : function(){ this.expand(k.qrows, 'c', function(cx,cy,f){ return (cx==k.qcols-1+f);}, function(bx,by){ return (bx==2*k.qcols-1)||(bx==2*k.qcols-2);}, 'rt' ); },
	expand : function(number, rc, func, func2, key){

		if(rc=='c'){ k.qcols++;}else if(rc=='r'){ k.qrows++;}

		var i, margin;
		margin = (k.outside?number+2:number);
		for(i=0;i<margin;i++){ bd.cell.push(new Cell()); bd.cell[bd.cell.length-1].cellinit(bd.cell.length-1);}
		bd.cell.each(function(c,i){ bd.setposCell(i);})
		for(i=bd.cell.length-1;i>=0;i--){
			if(i-margin<0 || func(bd.cell[i].cx, bd.cell[i].cy, 0)){
				bd.cell[i] = new Cell(); bd.cell[i].cellinit(i); margin--;
			}
			else if(margin>0){ bd.cell[i] = bd.cell[i-margin];}
			if(margin==0){ break;}
		}
		if(k.iscross){
			margin = number+1;
			for(i=0;i<margin;i++){ bd.cross.push(new Cross()); bd.cross[bd.cross.length-1].cellinit(bd.cross.length-1);}
			bd.cross.each(function(c,i){ bd.setposCross(i);});
			for(i=bd.cross.length-1;i>=0;i--){
				if(i-margin<0 || func(bd.cross[i].cx, bd.cross[i].cy, 1)){
					bd.cross[i] = new Cross(); bd.cross[i].cellinit(i); margin--;
				}
				else if(margin>0){ bd.cross[i] = bd.cross[i-margin];}
				if(margin==0){ break;}
			}
		}
		if(k.isborder){
			margin = 2*number-1+(k.outside||k.isborderAsLine?2:0);
			for(i=0;i<margin;i++){ bd.border.push(new Border()); bd.border[bd.border.length-1].cellinit(bd.border.length-1);}
			bd.border.each(function(c,i){ bd.setposBorder(i);});
			for(i=bd.border.length-1;i>=0;i--){
				if(i-margin<0 || func2(bd.border[i].cx, bd.border[i].cy)){
					bd.border[i] = new Border(); bd.border[i].cellinit(i); margin--;
				}
				else if(margin>0){ bd.border[i] = bd.border[i-margin];}
				if(margin==0){ break;}
			}
		}

		bd.setposAll();

		// �g�厞�A���E���͑�����Ă���
		if(k.isborder && um.callby==0){ this.expandborder(key);}
	},
	expandborder : function(key){
		for(i=0;i<bd.border.length;i++){
			var source = -1;
			if(k.isborderAsLine==0){
				if     (key=='up' && bd.border[i].cy==1          ){ source = bd.getbnum(bd.border[i].cx, 3          );}
				else if(key=='dn' && bd.border[i].cy==2*k.qrows-1){ source = bd.getbnum(bd.border[i].cx, 2*k.qrows-3);}
				else if(key=='lt' && bd.border[i].cx==1          ){ source = bd.getbnum(3,           bd.border[i].cy);}
				else if(key=='rt' && bd.border[i].cx==2*k.qcols-1){ source = bd.getbnum(2*k.qcols-3, bd.border[i].cy);}

				if(source!=-1){
					bd.setQuesBorder(i, bd.getQuesBorder(source));
					bd.setQansBorder(i, bd.getQansBorder(source));
				}
			}
			else{
				if     (key=='up' && bd.border[i].cy==2          ){ source = bd.getbnum(bd.border[i].cx, 0        );}
				else if(key=='dn' && bd.border[i].cy==2*k.qrows-2){ source = bd.getbnum(bd.border[i].cx, 2*k.qrows);}
				else if(key=='lt' && bd.border[i].cx==2          ){ source = bd.getbnum(0,         bd.border[i].cy);}
				else if(key=='rt' && bd.border[i].cx==2*k.qcols-2){ source = bd.getbnum(2*k.qcols, bd.border[i].cy);}

				if(source!=-1){
					bd.setQuesBorder(i, bd.getQuesBorder(source));
					bd.setQansBorder(i, bd.getQansBorder(source));
					bd.setQuesBorder(source,  0);
					bd.setQansBorder(source, -1);
				}
			}
		}
	},

	reduceup : function(){ this.reduce(k.qcols, 'r', function(cx,cy,f){ return (cy==0);}        ,	function(bx,by){ return (by==1)||(by==2);}                     ,'up'); },
	reducedn : function(){ this.reduce(k.qcols, 'r', function(cx,cy,f){ return (cy==k.qrows-1+f);},	function(bx,by){ return (by==2*k.qrows-1)||(by==2*k.qrows-2);} ,'dn'); },
	reducelt : function(){ this.reduce(k.qrows, 'c', function(cx,cy,f){ return (cx==0);}        ,	function(bx,by){ return (bx==1)||(bx==2);}                     ,'lt'); },
	reducert : function(){ this.reduce(k.qrows, 'c', function(cx,cy,f){ return (cx==k.qcols-1+f);},	function(bx,by){ return (bx==2*k.qcols-1)||(bx==2*k.qcols-2);} ,'rt'); },
	reduce : function(number, rc, func, func2, key){
		var i, margin;
		margin = 0;

		if(k.isborder && um.callby==0){ this.reduceborder(key);}

		var qnums = new Array();

		for(i=0;i<bd.cell.length;i++){
			if(func(bd.cell[i].cx, bd.cell[i].cy, 0)){
				if(bd.cell[i].numobj){ Element.hide(bd.cell[i].numobj);}
				if(!bd.isNullCell(i)){ um.addOpe('cell', 'cell', i, bd.cell[i], 0);}
				if(k.isOneNumber && bd.getQnumCell(i)!=-1){
					qnums.push(new Array());
					qnums[qnums.length-1].areaid=bd.cell[i].rarea;
					qnums[qnums.length-1].val=bd.getQnumCell(i);
				}
				margin++;
			}
			else if(margin>0){ bd.cell[i-margin] = bd.cell[i];}
		}
		for(i=0;i<(k.outside?number+2:number);i++){ bd.cell.pop();}

		if(k.iscross){
			margin = 0;
			for(i=0;i<bd.cross.length;i++){
				if(func(bd.cross[i].cx, bd.cross[i].cy, 1)){
					if(bd.cross[i].numobj){ Element.hide(bd.cross[i].numobj);}
					if(!bd.isNullCross(i)){ um.addOpe('cross', 'cross', i, bd.cross[i], 0);}
					margin++;
				}
				else if(margin>0){ bd.cross[i-margin] = bd.cross[i];}
			}
			for(i=0;i<number+1;i++){ bd.cross.pop();}
		}
		if(k.isborder){
			margin = 0;
			for(i=0;i<bd.border.length;i++){
				if(func2(bd.border[i].cx, bd.border[i].cy)){
					if(!bd.isNullBorder(i)){ um.addOpe('border', 'border', i, bd.border[i], 0);}
					margin++;
				}
				else if(margin>0){ bd.border[i-margin] = bd.border[i];}
			}
			for(i=0;i<2*number-1+(k.outside||k.isborderAsLine?2:0);i++){ bd.border.pop();}
		}

		if(rc=='c'){ k.qcols--;}else if(rc=='r'){ k.qrows--;}

		bd.setposAll();
		if(k.isOneNumber){
			for(i=0;i<qnums.length;i++){ bd.setQnumCell(room.getTopOfRoom(qnums[i].areaid), qnums[i].val);}
		}
	},
	reduceborder : function(key){
		for(i=0;i<bd.border.length;i++){
			var source = -1;
			if(k.isborderAsLine==1){
				if     (key=='up' && bd.border[i].cy==0        ){ source = bd.getbnum(bd.border[i].cx, 2          );}
				else if(key=='dn' && bd.border[i].cy==2*k.qrows){ source = bd.getbnum(bd.border[i].cx, 2*k.qrows-2);}
				else if(key=='lt' && bd.border[i].cx==0        ){ source = bd.getbnum(2,           bd.border[i].cy);}
				else if(key=='rt' && bd.border[i].cx==2*k.qcols){ source = bd.getbnum(2*k.qcols-2, bd.border[i].cy);}

				if(source!=-1){
					bd.setQuesBorder(i, bd.getQuesBorder(source));
					bd.setQansBorder(i, bd.getQansBorder(source));
					bd.setQuesBorder(source,  0);
					bd.setQansBorder(source, -1);
				}
			}
		}
	},

	//------------------------------------------------------------------------------
	// ��]�E���]�֘A�̃{�^���������ꂽ�Ƃ�
	popupflip : function(e){
		if(menu.popupmenu){
			if(menu.resumecount>0){ return;}
			menu.resumecount = 3;

			um.chainflag = 0;

			switch(Event.element(e).name){
				case "turnl": this.turnl((k.outside?-1:0),(k.outside?-1:0),(k.outside?k.qcols:k.qcols-1),(k.outside?k.qrows:k.qrows-1)); break;
				case "turnr": this.turnr((k.outside?-1:0),(k.outside?-1:0),(k.outside?k.qcols:k.qcols-1),(k.outside?k.qrows:k.qrows-1)); break;
				case "flipy": this.flipy((k.outside?-1:0),(k.outside?-1:0),(k.outside?k.qcols:k.qcols-1),(k.outside?k.qrows:k.qrows-1)); break;
				case "flipx": this.flipx((k.outside?-1:0),(k.outside?-1:0),(k.outside?k.qcols:k.qcols-1),(k.outside?k.qrows:k.qrows-1)); break;
			}

			um.addOpe('board', Event.element(e).name, 0, 0, 1);

			tc.Adjust();
			if(k.isOneNumber){ room.resetRarea();}
			base.resize_canvas();				// Canvas���X�V����
		}
	},
	// ��]�E���](�㉺���])
	flipy : function(rx1,ry1,rx2,ry2){
		var cx, cy;
		for(cy=ry1;cy<ry1+(ry2-ry1)/2;cy++){
			for(cx=rx1;cx<=rx2;cx++){
				var c = bd.cell[bd.getcnum(cx,cy)];
				bd.cell[bd.getcnum(cx,cy)] = bd.cell[bd.getcnum(cx,(ry1+ry2)-cy)];
				bd.cell[bd.getcnum(cx,(ry1+ry2)-cy)] = c;
			}
		}

		if(k.iscross){
			for(cy=ry1;cy<(ry2+1-ry1)/2;cy++){
				for(cx=rx1;cx<=rx2+1;cx++){
					var c = bd.cross[bd.getxnum(cx,cy)];
					bd.cross[bd.getxnum(cx,cy)] = bd.cross[bd.getxnum(cx,(ry1+ry2+1)-cy)];
					bd.cross[bd.getxnum(cx,(ry1+ry2+1)-cy)] = c;
				}
			}
		}

		if(k.isborder){
			for(cy=ry1*2;cy<(ry2+1-ry1)*2/2;cy++){
				for(cx=rx1*2;cx<=(rx2+1)*2;cx++){
					if(bd.getbnum(cx,cy)==-1){ continue;}
					var c = bd.border[bd.getbnum(cx,cy)];
					bd.border[bd.getbnum(cx,cy)] = bd.border[bd.getbnum(cx,(ry1+ry2+1)*2-cy)];
					bd.border[bd.getbnum(cx,(ry1+ry2+1)*2-cy)] = c;
				}
			}
		}
		bd.setposAll();
	},
	// ��]�E���](���E���])
	flipx : function(rx1,ry1,rx2,ry2){
		var cx, cy;
		for(cx=rx1;cx<rx1+(rx2-rx1)/2;cx++){
			for(cy=ry1;cy<=ry2;cy++){
				var c = bd.cell[bd.getcnum(cx,cy)];
				bd.cell[bd.getcnum(cx,cy)] = bd.cell[bd.getcnum((rx1+rx2)-cx,cy)];
				bd.cell[bd.getcnum((rx1+rx2)-cx,cy)] = c;
			}
		}
		if(k.iscross){
			for(cx=rx1;cx<(rx2+1-rx1)/2;cx++){
				for(cy=ry1;cy<=ry2+1;cy++){
					var c = bd.cross[bd.getxnum(cx,cy)];
					bd.cross[bd.getxnum(cx,cy)] = bd.cross[bd.getxnum((rx1+rx2+1)-cx,cy)];
					bd.cross[bd.getxnum((rx1+rx2+1)-cx,cy)] = c;
				}
			}
		}
		if(k.isborder){
			for(cx=rx1*2;cx<(rx2+1-rx1)*2/2;cx++){
				for(cy=ry1*2;cy<=(ry2+1)*2;cy++){
					if(bd.getbnum(cx,cy)==-1){ continue;}
					var c = bd.border[bd.getbnum(cx,cy)];
					bd.border[bd.getbnum(cx,cy)] = bd.border[bd.getbnum((rx1+rx2+1)*2-cx,cy)];
					bd.border[bd.getbnum((rx1+rx2+1)*2-cx,cy)] = c;
				}
			}
		}
		bd.setposAll();
	},
	// ��]�E���](�E90����])
	turnr : function(rx1,ry1,rx2,ry2){ this.turn2(rx1,ry1,rx2,ry2,1); },
	// ��]�E���](��90����])
	turnl : function(rx1,ry1,rx2,ry2){ this.turn2(rx1,ry1,rx2,ry2,2); },
	turn2 : function(rx1,ry1,rx2,ry2,f){
		var tmp = k.qcols;
		k.qcols = k.qrows;
		k.qrows = tmp;

		bd.setposAll();

		var cnt = (k.outside==0?k.qcols*k.qrows:k.qcols*k.qrows+2*(k.qcols+k.qrows));
		var ch = new Array(); $R(0,cnt,true).each(function(i){ ch[i]=1;});
		while(cnt>0){
			var tmp, source, prev, target, nex;
			for(source=0;source<(k.outside==0?k.qcols*k.qrows:k.qcols*k.qrows+2*(k.qcols+k.qrows));source++){ if(ch[source]==1){ break;}}
			tmp = bd.cell[source]; target = source;
			while(true){
				if(f==1){ nex = bd.getcnum2(bd.cell[target].cy, (ry2-ry1)-bd.cell[target].cx, k.qrows, k.qcols);}
				else{ nex = bd.getcnum2((rx2-rx1)-bd.cell[target].cy, bd.cell[target].cx, k.qrows, k.qcols);}
				if(nex==source){ break;}
				bd.cell[target] = bd.cell[nex]; ch[target]=0; cnt--; target = nex;
			}
			bd.cell[target] = tmp; ch[target]=0; cnt--; 
		}

		if(k.iscross){
			cnt = (k.qcols+1)*(k.qrows+1);
			ch = new Array(); $R(0,cnt,true).each(function(i){ ch[i]=1;});
			while(cnt>0){
				var tmp, source, prev, target, nex;
				for(source=0;source<(k.qcols+1)*(k.qrows+1);source++){ if(ch[source]==1){ break;}}
				tmp = bd.cross[source]; target = source;
				while(true){
					nex = bd.getxnum2(bd.cross[target].cy, (ry2-ry1+1)-bd.cross[target].cx, k.qrows, k.qcols);
					if(f==1){ nex = bd.getxnum2(bd.cross[target].cy, (ry2-ry1+1)-bd.cross[target].cx, k.qrows, k.qcols);}
					else{ nex = bd.getxnum2((rx2-rx1+1)-bd.cross[target].cy, bd.cross[target].cx, k.qrows, k.qcols);}
					if(nex==source){ break;}
					bd.cross[target] = bd.cross[nex]; ch[target]=0; cnt--; target = nex;
				}
				bd.cross[target] = tmp; ch[target]=0; cnt--; 
			}
		}

		if(k.isborder){
			cnt = (k.outside==0&&k.isborderAsLine==0?(k.qcols-1)*k.qrows+k.qcols*(k.qrows-1):(k.qcols-1)*k.qrows+k.qcols*(k.qrows-1)+2*(k.qcols+k.qrows));
			ch = new Array(); $R(0,cnt,true).each(function(i){ ch[i]=1;});
			while(cnt>0){
				var tmp, source, prev, target, nex;
				for(source=0;source<(k.outside==0&&k.isborderAsLine==0?(k.qcols-1)*k.qrows+k.qcols*(k.qrows-1):(k.qcols-1)*k.qrows+k.qcols*(k.qrows-1)+2*(k.qcols+k.qrows));source++){ if(ch[source]==1){ break;}}
				tmp = bd.border[source]; target = source;
				while(true){
					nex = bd.getbnum2(bd.border[target].cy, (ry2-ry1+1)*2-bd.border[target].cx, k.qrows, k.qcols);
					if(f==1){ nex = bd.getbnum2(bd.border[target].cy, (ry2-ry1+1)*2-bd.border[target].cx, k.qrows, k.qcols);}
					else{ nex = bd.getbnum2((rx2-rx1+1)*2-bd.border[target].cy, bd.border[target].cx, k.qrows, k.qcols);}
					if(nex==source){ break;}
					bd.border[target] = bd.border[nex]; ch[target]=0; cnt--; target = nex;
				}
				bd.border[target] = tmp; ch[target]=0; cnt--;
			}
		}

		bd.setposAll();
	}
};

//--------------------------------------------------------------------------------
// ��Rooms�N���X ������TOP-Cell�̈ʒu���̏�������
//    room.resetRarea()
//      �����̏���reset����
//    room.setLineToRarea(id)
//      ���E�������͂��ꂽ���ɁA������TOP�ɂ��鐔�����ǂ��n���h�����O���邩
//    room.removeLineFromRarea(id)
//      ���E���������ꂽ���ɁA������TOP�ɂ��鐔�����ǂ��n���h�����O���邩
//    room.sr0(func,id,areaid)
//      setLineToRarea()����Ă΂�āAid���܂ވ�̕����̗̈���A�w�肳�ꂽareaid�ɂ���
//
//    room.getTopOfRoom(area, areaid)
//      areaid�̒��Ő����������Ă���cell��ID�𒊏o����
//    room.getCntOfRoom(area, areaid)
//      areaid�̗̈�̑傫���𒊏o����
//---------------------------------------------------------------------------
// ������TOP�ɐ�������͂��鎞�́A�n���h�����O��

Rooms = Class.create();
Rooms.prototype = {
	initialize : function(){
		this.rareamax;
	},

	resetRarea : function(){
		var i,c;
		var rarea = ans.searchRarea();
		for(c=0;c<bd.cell.length;c++){ bd.cell[c].rarea = rarea.check[c]; }
		this.rareamax = rarea.max;

		if(!k.isOneNumber){ return;}
		for(i=1;i<=this.rareamax;i++){
			var val = -1;
			for(c=0;c<bd.cell.length;c++){
				if(bd.cell[c].rarea==i && bd.getQnumCell(c)!=-1){
					if(val==-1){ val = bd.getQnumCell(c);}
					if(this.getTopOfRoom(i)!=c){ bd.setQnumCell(c, -1);}
				}
			}
			if(val!=-1){ bd.setQnumCell(this.getTopOfRoom(i), val);}
		}
	},
	setLineToRarea : function(id){
		var i;
		var cc1 = bd.getcnum(int((bd.border[id].cx-(bd.border[id].cy%2))/2), int((bd.border[id].cy-(bd.border[id].cx%2))/2) );
		var cc2 = bd.getcnum(int((bd.border[id].cx+(bd.border[id].cy%2))/2), int((bd.border[id].cy+(bd.border[id].cx%2))/2) );

		if( bd.lcntCross(int((bd.border[id].cx-(bd.border[id].cx%2))/2), int((bd.border[id].cy-(bd.border[id].cy%2))/2) ) >= 2
		 && bd.lcntCross(int((bd.border[id].cx+(bd.border[id].cx%2))/2), int((bd.border[id].cy+(bd.border[id].cy%2))/2) ) >= 2
		 && cc1 != -1 && cc2 != -1 )
		{
			var keep = bd.cell[cc1].rarea;
			var func = function(id){ return (id!=-1 && bd.getQuesBorder(id)==0); };
			this.rareamax++;
			this.sr0(func, cc2, this.rareamax);
			if(bd.cell[cc1].rarea == this.rareamax){
				for(i=0;i<bd.cell.length;i++){ if(bd.cell[i].rarea==this.rareamax){ bd.cell[i].rarea = keep;} }
				this.rareamax--;
			}
		}
	},
	removeLineFromRarea : function(id){
		var i, fordel, keep;
		var cc1 = bd.getcnum(int((bd.border[id].cx-(bd.border[id].cy%2))/2), int((bd.border[id].cy-(bd.border[id].cx%2))/2) );
		var cc2 = bd.getcnum(int((bd.border[id].cx+(bd.border[id].cy%2))/2), int((bd.border[id].cy+(bd.border[id].cx%2))/2) );

		if(cc1!=-1 && cc2!=-1 && bd.cell[cc1].rarea != bd.cell[cc2].rarea){
			tc1 = this.getTopOfRoom(bd.cell[cc1].rarea);
			tc2 = this.getTopOfRoom(bd.cell[cc2].rarea);

			if     (bd.getQnumCell(tc1)!=-1&&bd.getQnumCell(tc2)==-1){ bd.setQnumCell(tc2, bd.getQnumCell(tc1)); pc.paint(bd.cell[tc2].cx, bd.cell[tc2].cy, bd.cell[tc2].cx, bd.cell[tc2].cy);}
			else if(bd.getQnumCell(tc1)==-1&&bd.getQnumCell(tc2)!=-1){ bd.setQnumCell(tc1, bd.getQnumCell(tc2)); pc.paint(bd.cell[tc1].cx, bd.cell[tc1].cy, bd.cell[tc1].cx, bd.cell[tc1].cy);}

			var dcc = -1;
			if(bd.cell[tc1].cx > bd.cell[tc2].cx || (bd.cell[tc1].cx == bd.cell[tc2].cx && bd.cell[tc1].cy > bd.cell[tc2].cy)){
				fordel = bd.cell[tc1].rarea; keep = bd.cell[tc2].rarea; dcc = tc1;
			}
			else{ fordel = bd.cell[tc2].rarea; keep = bd.cell[tc1].rarea; dcc = tc2;}

			for(i=0;i<bd.cell.length;i++){ if(bd.cell[i].rarea==fordel){ bd.cell[i].rarea = keep;} }

			if(bd.getQnumCell(dcc) != -1){
				bd.setQnumCell(dcc, -1);
				pc.paint(bd.cell[dcc].cx, bd.cell[dcc].cy, bd.cell[dcc].cx, bd.cell[dcc].cy);
			}
		}
	},
	sr0 : function(func, i, areaid){
		if(i==-1 || bd.cell[i].rarea==areaid){ return;}
		bd.cell[i].rarea = areaid;
		if( bd.cell[i].up()!=-1 && func(bd.cell[i].ub()) ){ arguments.callee(func, bd.cell[i].up(), areaid);}
		if( bd.cell[i].dn()!=-1 && func(bd.cell[i].db()) ){ arguments.callee(func, bd.cell[i].dn(), areaid);}
		if( bd.cell[i].lt()!=-1 && func(bd.cell[i].lb()) ){ arguments.callee(func, bd.cell[i].lt(), areaid);}
		if( bd.cell[i].rt()!=-1 && func(bd.cell[i].rb()) ){ arguments.callee(func, bd.cell[i].rt(), areaid);}
		return;
	},

	getTopOfRoom : function(areaid){
		var cc=-1; var cx=k.qcols;
		var i;
		for(i=0;i<bd.cell.length;i++){
			if(bd.cell[i].rarea == areaid && bd.cell[i].cx < cx){ cc=i; cx = bd.cell[i].cx; }
		}
		return cc;
	},
	getCntOfRoom : function(areaid){
		var cnt=0;
		var i;
		for(i=0;i<bd.cell.length;i++){
			if(bd.cell[i].rarea == areaid){ cnt++; }
		}
		return cnt;
	}
};

//--------------------------------------------------------------------------------
// ��PBase�N���X �ς��Ղ�v3�̃x�[�X�����₻�̑��̏������s��
//    base.include_func()
//      ���̃t�@�C�����ǂݍ��܂ꂽ�ۂ̏������s��
//    base.onload_func()
//      �y�[�W��Load���ꂽ���̏����B�e�N���X�̃I�u�W�F�N�g�ւ̓ǂݍ��ݓ����s��
//    base.doc_design()
//      onload_func()�ŌĂ΂��Bhtml�Ȃǂ̐ݒ���s��
//    base.resize_canvas()
//      �E�B���h�E��Load/Resize���̏����BCanvas/�\������}�X�ڂ̑傫����ݒ肷��B
//      Canvas�S�̂̍ĕ`����s�����ɂ��Ă΂��
//
//    base.modearea()
//      �㕔��"���[�h"��\������ۂ̏������s��
//    base.modeclick()
//      "���[�h"���N���b�N���ꂽ�ۂ̏������s��
//    base.modedisp()
//      ���[�h�̕\���ݒ���s��
//    base.modeflip()
//      ���{�^�����N���b�N�����ۂ̃��[�h�̐؂�ւ����s��
//    base.irowakeClick()
//      �F��������{�^�����N���b�N�����ۂ̓�����w�肷��
//
//    base.buttonarea()
//      Canvas�����̃{�^����\������ۂ̏������s��
//    base.ACconfirm()
//      �񓚏����{�^���������ꂽ�ۂ̏������s��
//    base.ASconfirm()
//      �⏕�����{�^���������ꂽ�ۂ̏������s��
//    base.accesslog()
//      player�̃A�N�Z�X���O���Ƃ�
//---------------------------------------------------------------------------
// onLoad/onResize���ȂǃC�x���g�n

// PBase�N���X
PBase = Class.create();
PBase.prototype = {
	// Base.js��include�������̏�ŌĂ΂��֐�
	initialize : function(){
		this.include_func();
	},
	include_func : function(){	// onLoad�O�̍ŏ����̐ݒ���s��
		// URL�̎擾 -> URL��?�ȉ�����puzzleid����pzldata���ɕ���(������url_decode()�Ă�ł���)
		enc = new Encode(location.search);
		k.puzzleid = enc.pid;
		if(!k.puzzleid){ location.href = "../";} // �w�肳�ꂽ�p�Y�����Ȃ��ꍇ�͂��悤�Ȃ�`
		if(enc.pzlcols){ k.qcols = enc.pzlcols;}
		if(enc.pzlrows){ k.qrows = enc.pzlrows;}

		// ��p�t�@�C���̓ǂݍ���
		document.writeln("<script type=\"text/javascript\" src=\""+k.puzzleid+".js\"></script>");

		// onLoad��onResize�ɓ�������蓖�Ă�
		Event.observe(window, 'load', this.onload_func.bindAsEventListener(this), false);
		Event.observe(window, 'resize', this.resize_canvas.bindAsEventListener(this), false);

		if(Prototype.Browser.IE){ k.IEMargin = new Pos(4, 4);}
		else{ k.IEMargin = new Pos(0, 0);}
	},

	//---------------------------------------------------------------------------
	// window��onLoad���ɌĂ΂��֐� -> �����ݒ���s��
	onload_func : function(){

		// Canvas�I�u�W�F�N�g����
		cv_obj = $("puzzle_canvas");
		g = cv_obj.getContext("2d");
		unselectable(cv_obj);

		// �p�Y���ŗL�̕ϐ��ݒ�(�f�t�H���g��)
		setting();

		// �N���X�Ăяo��
		bd = new Board();		// ���ʃN���X
		bd.initialize2()
		mv = new MouseEvent();	// ���ʃN���X
		kc = new KeyEvent();	// ���ʃN���X
		col = new Colors();		// ���ʃN���X
		pc = new Graphic();		// ���ʃN���X
		tc = new TCell();		// �L�[���͂̃^�[�Q�b�g�Ǘ��I�u�W�F�N�g
		ans = new AnsCheck();	// ���𔻒�N���X
		puz = new Puzzle();		// �p�Y���ŗL�N���X
		room = new Rooms();
		if(k.isOneNumber){
			room.resetRarea();
		}

		// ���j���[�������I�u�W�F�N�g
		menu = new Menu();
		fio = new FileIO();

		// �f�U�C���ύX�֐��̌Ăяo��
		this.doc_design();
		um = new UndoManager();	// ������Ǘ��N���X

		// URL����p�Y���̃f�[�^��ǂݏo��
		puz.pzlinput(0);

		// Canvas�̐ݒ�
		this.resize_canvas();

		// �C�x���g����������
		Event.observe(cv_obj, 'mousedown', mv.e_mousedown.bindAsEventListener(mv), true);
		Event.observe(cv_obj, 'mouseup'  , mv.e_mouseup.bindAsEventListener(mv), true);
		Event.observe(cv_obj, 'mousemove', mv.e_mousemove.bindAsEventListener(mv), true);
		//Event.observe(cv_obj, 'mouseout' , mv.e_mouseout.bindAsEventListener(mv), true);

		if(!Prototype.Browser.IE){
			Event.observe(window, 'keydown' , kc.e_keydown.bindAsEventListener(kc), true);
			Event.observe(window, 'keyup'   , kc.e_keyup.bindAsEventListener(kc), true);
			Event.observe(window, 'keypress', kc.e_keypress.bindAsEventListener(kc), true);
		}
		else{
			Event.observe(document, 'keydown' , kc.e_keydown.bindAsEventListener(kc), true);
			Event.observe(document, 'keyup'   , kc.e_keyup.bindAsEventListener(kc), true);
			Event.observe(document, 'keypress', kc.e_keypress.bindAsEventListener(kc), true);
		}

		//Event.observe(window, 'mouseout', mv.mousereset.bindAsEventListener(mv), true);

		cv_obj.oncontextmenu = function(){return false;}	//�Ë��_ 
		Event.observe(cv_obj, 'contextmenu', function(){return false;}, true);

		// �A�N�Z�X���O���Ƃ��Ă݂�
		if(document.domain=='indi.s58.xrea.com' && k.callmode=='pplay'){ this.accesslog();}

		// �^�C�}�[�I�u�W�F�N�g�̐����ƃ^�C�}�[�X�^�[�g
		var tm = new Timer();
		tm.start();
	},

	// �w�i�摜�Ƃ�title��/html�\���̐ݒ� //
	doc_design : function(){
		document.title = ""+this.gettitle()+" - �ς��Ղ�v3";
		$("title2").innerHTML = ""+this.gettitle()+" - �ς��Ղ�v3";
		document.body.style.backgroundImage = "url(../../../"+k.puzzleid+"/bg.gif)";

		if(Prototype.Browser.IE){
			$("title2").style.marginTop = "24px";
			$$("hr").each(function(o){ o.style.margin = "0px";});
		}

		if(k.callmode=="pmake"){ Element.hide($("timerpanel")); Element.hide($("separator2"));}
		else{ Element.hide($("modepanel"));}

		Element.hide($("submenupanel1"));
		Element.hide($("submenupanel2"));
		Element.hide($("submenupanel3"));
		Element.hide($("submenupanel4"));

		menu.menuarea();
		this.modearea();
		puz.usearea();		// "������@"�͊e�p�Y���ŗL�ɂ���
		this.buttonarea();

		$("credit3_1").innerHTML = "�ς��Ղ�v3 v3.0.7��2<br>\n<br>\n�ς��Ղ�v3�� �͂���/�A�����j���쐬���Ă��܂��B<br>\n���C�u�����Ƃ���Prototype.js, excanvas.js��<br>\n�g�p���Ă��܂��B<br>\n<br>\n";

		if     (k.irowake==2){ new Insertion.Bottom("checkpanel", "\n<br><input type=\"checkbox\" id=\"irowake\" onClick=\"javascript:base.irowakeClick();\" checked> ���̐F����������");}
		else if(k.irowake!=0){ new Insertion.Bottom("checkpanel", "\n<br><input type=\"checkbox\" id=\"irowake\" onClick=\"javascript:base.irowakeClick();\"> ���̐F����������");}
	},
	gettitle : function(){
		if(k.callmode=='pmake'){ return ""+puz.gettitle()+" �G�f�B�^";}
		else{ return ""+puz.gettitle()+" player";}
	},

	//---------------------------------------------------------------------------
	// window��onResize���ɌĂ΂��֐�
	resize_canvas : function(){
		var wsize = getWindowSize();
		k.p0 = new Pos(k.def_psize, k.def_psize);

		if(k.widthmode==1){
			var ci0 = Math.round((wsize.x-k.p0.x*2)*0.75/k.def_csize);
			var ci1 = Math.round((wsize.x-k.p0.x*2)*0.75/(k.def_csize*0.75));
			var ci2 = Math.round((wsize.x-k.p0.x*2)*0.9/(k.def_csize*0.4));

			// �ő�T�C�Y�ɂ���Ƃ�
			if(k.qcols < ci0){
				k.cwidth = k.cheight = k.def_csize;
				document.getElementById("main").style.width = "80%";
			}
			// ��75%�ɓ���ꍇ �t�H���g�̃T�C�Y��3/4�܂ŏk�߂Ă悢
			else if(k.qcols < ci1){
				k.cwidth = k.cheight = int(k.def_csize*(1-0.25*((k.qcols-ci0)/(ci1-ci0))));
				k.p0.x = k.p0.y = int(k.def_psize*(k.cwidth/k.def_csize));
				document.getElementById("main").style.width = "80%";
			}
			// main��table���L����Ƃ�
			else if(k.qcols < ci2){
				k.cwidth = k.cheight = int(k.def_csize*(0.75-0.35*((k.qcols-ci1)/(ci2-ci1))));
				k.p0.x = k.p0.y = int(k.def_psize*(k.cwidth/k.def_csize));
				document.getElementById("main").style.width = ""+(k.p0.x*2+k.qcols*k.cwidth+12)+"px";
			}
			// �ŏ��T�C�Y40%�ɂ���Ƃ�
			else{
				k.cwidth = k.cheight = int(k.def_csize*0.4);
				k.p0 = new Pos(k.def_psize*0.4, k.def_psize*0.4);
				document.getElementById("main").style.width = "95%";
			}
		}
		else if(k.widthmode==2 || k.widthmode==3){
			var cratio = (k.widthmode==2?1.5:3.0);
			var ci0 = (wsize.x-k.p0.x*2)*0.9/(k.def_csize*cratio);
			var ci1 = (wsize.x-k.p0.x*2)*0.9/(k.def_csize*0.4);

			if(k.qcols < ci0){
				k.cwidth = k.cheight = int(k.def_csize*cratio);
			}
			else if(k.qcols < ci1){
				k.cwidth = k.cheight = int((wsize.x-k.p0.x*2)*0.9/(k.qcols+1));
			}
			// �ŏ��T�C�Y40%�ɂ���Ƃ�
			else{
				k.cwidth = k.cheight = int(k.def_csize*0.4);
			}

			k.p0.x = k.p0.y = int(k.def_psize*(k.cwidth/k.def_csize));
			document.getElementById("main").style.width = "96%";
		}

		cv_obj.width = k.p0.x*2 + k.qcols*k.cwidth;
		cv_obj.height = k.p0.y*2 + k.qrows*k.cheight;

		k.cv_oft.x = Position.cumulativeOffset(cv_obj)[0];
		k.cv_oft.y = Position.cumulativeOffset(cv_obj)[1];

		pc.flushCanvasAll();
		pc.paint(0,0,k.qcols-1,k.qrows-1);
	},

	//---------------------------------------------------------------------------
	modearea : function(){
		Event.observe($("mode1"), 'click', this.modeclick.bindAsEventListener(this), false);
		Event.observe($("mode3"), 'click', this.modeclick.bindAsEventListener(this), false);
		unselectable($("mode1"));
		unselectable($("mode3"));
		this.modedisp();
	},
	modeclick : function(e){
		if(Event.element(e).id=="mode1"){ k.mode = 1;}
		else if(Event.element(e).id=="mode3"){ k.mode = 3;}
		this.modedisp();
	},
	modedisp : function(){
		if(k.mode==1)     { $("mode1").className = "flagsel"; $("mode3").className = "flag";}
		else if(k.mode==3){ $("mode1").className = "flag"; $("mode3").className = "flagsel";}
		this.resize_canvas();
	},
	modeflip : function(input){
		if(k.callmode!="pmake"){ return;}
		if(k.mode==3){ k.mode=1;} else{ k.mode=3;}
		this.modedisp();
	},
	irowakeClick : function(){
		pc.paint(0,0,k.qcols-1,k.qrows-1);
	},

	buttonarea : function(){
		new Insertion.Bottom("btnarea", "<input type=\"button\" id=\"btncheck\" value=\"�`�F�b�N\" onClick=\"javascript:puz.check();\">�@");
		new Insertion.Bottom("btnarea", "<input type=\"button\" id=\"btnundo\" value=\"��\" onClick=\"javascript:um.undo();\">");
		new Insertion.Bottom("btnarea", "<input type=\"button\" id=\"btnredo\" value=\"�i\" onClick=\"javascript:um.redo();\">�@");
		new Insertion.Bottom("btnarea", "<input type=\"button\" id=\"btnclear\" value=\"�񓚏���\" onClick=\"javascript:base.ACconfirm();\">");
		new Insertion.Bottom("btnarea", "<input type=\"button\" id=\"btnclear\" value=\"�⏕����\" onClick=\"javascript:base.ASconfirm();\">");
		unselectable($("btnarea"));
		unselectable($("btnundo"));
		unselectable($("btnredo"));
	},
	ACconfirm : function(){
		if(confirm("�񓚂��������܂����H")){
			um.chainflag=0;
			for(i=0;i<k.qcols*k.qrows;i++){
				if(bd.getQansCell(i)!=0){ um.addOpe('cell','qans',i,bd.getQansCell(i),0);}
				if(bd.getQsubCell(i)!=0){ um.addOpe('cell','qsub',i,bd.getQsubCell(i),0);}
			}
			if(k.isborder){
				for(i=0;i<bd.border.length;i++){
					if(bd.getQansBorder(i)!=0){ um.addOpe('border','qans',i,bd.getQansBorder(i),0);}
					if(bd.getQsubBorder(i)!=0){ um.addOpe('border','qsub',i,bd.getQsubBorder(i),0);}
					if(bd.getLineBorder(i)!=0){ um.addOpe('border','line',i,bd.getLineBorder(i),0);}
				}
			}
			pc.flushCanvasAll();
			bd.ansclear();
		}
	},
	ASconfirm : function(){
		if(confirm("�⏕�L�����������܂����H")){
			um.chainflag=0;
			for(i=0;i<k.qcols*k.qrows;i++){
				if(bd.getQsubCell(i)!=0){ um.addOpe('cell','qsub',i,bd.getQsubCell(i),0);}
			}
			if(k.isborder){
				for(i=0;i<bd.border.length;i++){
					if(bd.getQsubBorder(i)!=0){ um.addOpe('border','qsub',i,bd.getQsubBorder(i),0);}
				}
			}
			bd.subclear();
		}
	},
	accesslog : function(){
//		new Ajax.Request(
//			'record.cgi',
//			{
//				method: "post",
//				parameters: "pid="+k.puzzleid+"&pzldata="+enc.pzldata+"&referer="+document.referrer
//			}
//		);
	}
};

base = new PBase();	// onLoad�܂ł̍ŏ����̐ݒ���s��
