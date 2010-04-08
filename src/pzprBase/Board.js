// Board.js v3.3.0

//---------------------------------------------------------------------------
// ��Cell�N���X Board�N���X��Cell�̐������ێ�����
//---------------------------------------------------------------------------
// �{�[�h�����o�f�[�^�̒�`(1)
// Cell�N���X�̒�`
Cell = function(id){
	this.cx;	// �Z����X���W��ێ�����
	this.cy;	// �Z����Y���W��ێ�����
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
	this.bx;	// �����_��X���W(border���W�n)��ێ�����
	this.by;	// �����_��Y���W(border���W�n)��ێ�����
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
	this.numobj = '';	// ������\�����邽�߂̃G�������g

	this.cellcc  = [-1,-1];	// �אڃZ����ID
	this.crosscc = [-1,-1];	// �אڌ�_��ID

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

		this.setcoordAll();
	},
	setposCells : function(){
		var x0=k.p0.x, y0=k.p0.y;
		this.cellmax = this.cell.length;
		for(var id=0;id<this.cellmax;id++){
			var obj = this.cell[id];
			obj.cx = id%k.qcols;
			obj.cy = mf(id/k.qcols);
			obj.bx = obj.cx*2+1;
			obj.by = obj.cy*2+1;
		}
	},
	setposCrosses : function(){
		var x0=k.p0.x, y0=k.p0.y;
		this.crossmax = this.cross.length;
		for(var id=0;id<this.crossmax;id++){
			var obj = this.cross[id];
			obj.cx = id%(k.qcols+1);
			obj.cy = mf(id/(k.qcols+1));
			obj.bx = obj.cx*2;
			obj.by = obj.cy*2;
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
			obj.bx = obj.cx;
			obj.by = obj.cy;

			obj.cellcc[0] = this.cnum((obj.cx-obj.cy%2)>>1, (obj.cy-obj.cx%2)>>1);
			obj.cellcc[1] = this.cnum((obj.cx+obj.cy%2)>>1, (obj.cy+obj.cx%2)>>1);

			obj.crosscc[0] = this.xnum((obj.cx-obj.cx%2)>>1, (obj.cy-obj.cy%2)>>1);
			obj.crosscc[1] = this.xnum((obj.cx+obj.cx%2)>>1, (obj.cy+obj.cy%2)>>1);
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
			obj.bx = obj.cx*2+1;
			obj.by = obj.cy*2+1;
		}
	},

	//---------------------------------------------------------------------------
	// bd.setcoordAll()  �S�Ă�Cell, Cross, Border�I�u�W�F�N�g��setcoordCell()�����Ăяo��
	//---------------------------------------------------------------------------
	setcoordAll : function(){
		var x0=k.p0.x, y0=k.p0.y;
		{
			for(var id=0;id<this.cellmax;id++){
				var obj = this.cell[id];
				obj.px = x0 + obj.cx*k.cwidth;
				obj.py = y0 + obj.cy*k.cheight;
				obj.cpx = x0 + obj.bx*k.cwidth/2;
				obj.cpy = y0 + obj.by*k.cheight/2;
			}
		}
		if(k.iscross){
			for(var id=0;id<this.crossmax;id++){
				var obj = this.cross[id];
				obj.px = x0 + obj.cx*k.cwidth;
				obj.py = y0 + obj.cy*k.cheight;
			}
		}
		if(k.isborder){
			for(var id=0;id<this.bdmax;id++){
				var obj = this.border[id];
				obj.px = x0 + obj.cx*k.cwidth/2;
				obj.py = y0 + obj.cy*k.cheight/2;
			}
		}
		if(k.isextendcell!=0){
			for(var id=0;id<this.excellmax;id++){
				var obj = this.excell[id];
				obj.px = x0 + obj.cx*k.cwidth;
				obj.py = y0 + obj.cy*k.cheight;
			}
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
	// bd.getClistByPosition()  �w�肵���͈͂Ɋ܂܂��Z����ID��Ԃ�
	//---------------------------------------------------------------------------
	getClistByPosition : function(x1,y1,x2,y2){
		var clist = [];
		for(var cx=x1;cx<=Math.min(x2,k.qcols-1);cx++){
			for(var cy=y1;cy<=Math.min(y2,k.qrows-1);cy++){
				var cc = this.cnum(cx,cy);
				if(cc!==-1){ clist.push(cc);}
			}
		}
		return clist;
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
		var cc1 = bd.border[id].cellcc[0], cc2 = bd.border[id].cellcc[1];
		return bd.border[id].cx&1 ? (bd.isLPdown(cc1) || bd.isLPup(cc2)) :
									(bd.isLPright(cc1) || bd.isLPleft(cc2));
	},
	isLPCombined : function(id){
		var cc1 = bd.border[id].cellcc[0], cc2 = bd.border[id].cellcc[1];
		return bd.border[id].cx&1 ? (bd.isLPdown(cc1) && bd.isLPup(cc2)) :
									(bd.isLPright(cc1) && bd.isLPleft(cc2));
	},
	isLineNG : function(id){
		var cc1 = bd.border[id].cellcc[0], cc2 = bd.border[id].cellcc[1];
		return bd.border[id].cx&1 ? (bd.isnoLPdown(cc1) || bd.isnoLPup(cc2)) :
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
