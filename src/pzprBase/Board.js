// Board.js v3.3.0p2

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

		if(area.numberColony && (num!==-1 ^ area.bcell.id[id]!==-1)){
			area.setCell(id,(num!==-1?1:0));
		}
	},
	// overwrite by lightup.js
	sQaC : function(id, num) {
		var old = this.cell[id].qans;
		um.addOpe(k.CELL, k.QANS, id, old, num);
		this.cell[id].qans = num;

		if((area.bblock && (num!==-1 ^ area.bcell.id[id]!==-1)) || 
		   (area.wblock && (num===-1 ^ area.wcell.id[id]!==-1)))
		{
			area.setCell(id,(num!==-1?1:0));
		}
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

		if(num>0 ^ old>0){ area.setBorder(id,num);}
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

		if(num>0 ^ old>0){
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

		if(num>0 ^ old>0){ line.setLine(id,num);}
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
