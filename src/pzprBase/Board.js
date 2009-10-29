// Board.js v3.2.2

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
		if(k.puzzleid=="tilepaint"||k.puzzleid=="kakuro"){ this.qnum = 0;}
		this.direc = 0;
		if(k.puzzleid=="triplace"){ this.direc = -1;}
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
		if(k.puzzleid=="mejilink" && num<k.qcols*(k.qrows-1)+(k.qcols-1)*k.qrows){ this.ques = 1;}
		this.qnum = -1;
		if(k.puzzleid=="tentaisho"){ this.qnum = 0;}
		this.qans = 0;
		this.qsub = 0;
		if(k.puzzleid=="bosanowa"){ this.qsub = -1;}
		this.line = 0;
		this.color = "";
		this.error = 0;
	},
	ansclear : function(num) {
		this.qans = 0;
		this.qsub = 0;
		if(k.puzzleid=="bosanowa"){ this.qsub = -1;}
		this.line = 0;
		this.color = "";
		this.error = 0;
	},
	subclear : function(num) {
		this.qsub = 0;
		if(k.puzzleid=="bosanowa"){ this.qsub = -1;}
		this.error = 0;
	}
};

//---------------------------------------------------------------------------
// ��Board�N���X �Ֆʂ̏���ێ�����BCell, Cross, Border�̃I�u�W�F�N�g���ێ�����
//---------------------------------------------------------------------------
// Board�N���X�̒�`
Board = function(){
	this.bdinside = 0;		// �Ֆʂ̓���(�O�g��łȂ�)�ɑ��݂��鋫�E���̖{��

	this.cellmax   = 0;		// �Z���̐�
	this.crossmax  = 0;		// ��_�̐�
	this.bdmax     = 0;		// ���E���̐�
	this.excellmax = 0;		// �g���Z���̐�

	this.enableLineNG = false;
	this.def = {};			// �f�t�H���g�̃Z���Ȃ�

	this.initialize2();
};
Board.prototype = {
	//---------------------------------------------------------------------------
	// bd.initialize2()  �N�����Ƀf�[�^�̏��������s��
	//---------------------------------------------------------------------------
	initialize2 : function(){
		// Cell�̏���������
		this.cell = [];
		this.cellmax = (k.qcols*k.qrows);
		for(var i=0;i<this.cellmax;i++){
			this.cell[i] = new Cell(i);
		}
		this.def.cell = new Cell(0);

		if(k.iscross){
			this.cross = [];	// Cross���`
			this.crossmax = (k.qcols+1)*(k.qrows+1);
			for(var i=0;i<this.crossmax;i++){
				this.cross[i] = new Cross(i);
			}
			this.def.cross = new Cross(0);
		}

		if(k.isborder){
			this.border = [];	// Border/Line���`
			this.borders = [];
			this.bdinside = 2*k.qcols*k.qrows-(k.qcols+k.qrows);
			this.bdmax    = this.bdinside+(k.isoutsideborder==0?0:2*(k.qcols+k.qrows));
			for(var i=0;i<this.bdmax;i++){
				this.border[i] = new Border(i);
				this.borders[i] = i;
			}
			this.def.border = new Border(0);
		}

		if(k.isextendcell!=0){
			this.excell = [];
			this.excellmax = (k.isextendcell==1?k.qcols+k.qrows+1:2*k.qcols+2*k.qrows+4);
			for(var i=0;i<this.excellmax;i++){
				this.excell[i] = new Cell(i);
			}
		}

		this.setposAll();
		this.override();
	},
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

		this.setpicAll();
	},
	setposCells : function(){
		this.cellmax = this.cell.length;
		for(var id=0;id<this.cell.length;id++){
			this.cell[id].cx = id%k.qcols;
			this.cell[id].cy = mf(id/k.qcols);
		}
	},
	setposCrosses : function(){
		this.crossmax = this.cross.length;
		for(var id=0;id<this.cross.length;id++){
			this.cross[id].cx = id%(k.qcols+1);
			this.cross[id].cy = mf(id/(k.qcols+1));
		}
	},
	setposBorders : function(){
		this.bdinside = 2*k.qcols*k.qrows-(k.qcols+k.qrows);
		this.bdmax = this.border.length;
		for(var id=0;id<this.border.length;id++){
			if(id>=0 && id<(k.qcols-1)*k.qrows){
				this.border[id].cx = (id%(k.qcols-1))*2+2;
				this.border[id].cy = mf(id/(k.qcols-1))*2+1;
			}
			else if(id>=(k.qcols-1)*k.qrows && id<this.bdinside){
				this.border[id].cx = (id-(k.qcols-1)*k.qrows)%k.qcols*2+1;
				this.border[id].cy = mf((id-(k.qcols-1)*k.qrows)/k.qcols)*2+2;
			}
			else if(id>=this.bdinside && id<this.bdinside+k.qcols){
				this.border[id].cx = (id-this.bdinside)*2+1;
				this.border[id].cy = 0;
			}
			else if(id>=this.bdinside+k.qcols && id<this.bdinside+2*k.qcols){
				this.border[id].cx = (id-this.bdinside-k.qcols)*2+1;
				this.border[id].cy = k.qrows*2;
			}
			else if(id>=this.bdinside+2*k.qcols && id<this.bdinside+2*k.qcols+k.qrows){
				this.border[id].cx = 0;
				this.border[id].cy = (id-this.bdinside-2*k.qcols)*2+1;
			}
			else if(id>=this.bdinside+2*k.qcols+k.qrows && id<this.bdinside+2*(k.qcols+k.qrows)){
				this.border[id].cx = k.qcols*2;
				this.border[id].cy = (id-this.bdinside-2*k.qcols-k.qrows)*2+1;
			}
		}
	},
	setposEXcells : function(){
		this.excellmax = this.excell.length;
		for(var id=0;id<this.excell.length;id++){
			if(k.isextendcell==1){
				if     (id<k.qcols)        { this.excell[id].cx=id; this.excell[id].cy=-1;        }
				else if(id<k.qcols+k.qrows){ this.excell[id].cx=-1; this.excell[id].cy=id-k.qcols;}
				else                       { this.excell[id].cx=-1; this.excell[id].cy=-1;        }
			}
			else if(k.isextendcell==2){
				if     (id<  k.qcols)            { this.excell[id].cx=id;         this.excell[id].cy=-1;                  }
				else if(id<2*k.qcols)            { this.excell[id].cx=id-k.qcols; this.excell[id].cy=k.qrows;             }
				else if(id<2*k.qcols+  k.qrows)  { this.excell[id].cx=-1;         this.excell[id].cy=id-2*k.qcols;        }
				else if(id<2*k.qcols+2*k.qrows)  { this.excell[id].cx=k.qcols;    this.excell[id].cy=id-2*k.qcols-k.qrows;}
				else if(id<2*k.qcols+2*k.qrows+1){ this.excell[id].cx=-1;         this.excell[id].cy=-1;     }
				else if(id<2*k.qcols+2*k.qrows+2){ this.excell[id].cx=k.qcols;    this.excell[id].cy=-1;     }
				else if(id<2*k.qcols+2*k.qrows+3){ this.excell[id].cx=-1;         this.excell[id].cy=k.qrows;}
				else if(id<2*k.qcols+2*k.qrows+4){ this.excell[id].cx=k.qcols;    this.excell[id].cy=k.qrows;}
				else                             { this.excell[id].cx=-1;         this.excell[id].cy=-1;     }
			}
		}
	},

	//---------------------------------------------------------------------------
	// bd.setpicAll()  �S�Ă�Cell, Cross, Border�I�u�W�F�N�g��px,py��ݒ肷��
	//---------------------------------------------------------------------------
	setpicAll : function(){
		var x0=k.p0.x, y0=k.p0.y, id;

		id=0;
		for(var cy=0,py=y0;cy<k.qrows;cy++){
			for(var cx=0,px=x0;cx<k.qcols;cx++){
				this.cell[id].px = px;
				this.cell[id].py = py;
				id++; px+=k.cwidth;
			}
			py+=k.cheight;
		}
		if(k.iscross){
			id=0;
			for(var cy=0,py=y0;cy<=k.qrows;cy++){
				for(var cx=0,px=x0;cx<=k.qcols;cx++){
					this.cross[id].px = px;
					this.cross[id].py = py;
					id++; px+=k.cwidth;
				}
				py+=k.cheight;
			}
		}
		if(k.isborder){
			for(var id=0;id<this.bdmax;id++){
				this.border[id].px = x0+mf(this.border[id].cx*k.cwidth/2);
				this.border[id].py = y0+mf(this.border[id].cy*k.cheight/2);
			}
		}
		if(k.isextendcell!=0){
			for(var id=0;id<this.excellmax;id++){
				this.excell[id].px = x0+this.excell[id].cx*k.cwidth;
				this.excell[id].py = y0+this.excell[id].cy*k.cheight;
			}
		}
	},

	//---------------------------------------------------------------------------
	// bd.ansclear() �S�Ă�Cell, Cross, Border�I�u�W�F�N�g��ansclear()���Ăяo���ACanvas���ĕ`�悷��
	// bd.subclear() �S�Ă�Cell, Cross, Border�I�u�W�F�N�g��subclear()���Ăяo���ACanvas���ĕ`�悷��
	// bd.errclear() �S�Ă�Cell, Cross, Border�I�u�W�F�N�g��error�v���p�e�B��0�ɂ��āACanvas���ĕ`�悷��
	//---------------------------------------------------------------------------
	ansclear : function(){
		for(var i=0;i<this.cellmax;i++){ this.cell[i].ansclear(i);}
		if(k.iscross ){ for(var i=0;i<this.crossmax;i++){ this.cross[i].ansclear(i); } }
		if(k.isborder){ for(var i=0;i<this.bdmax;i++){ this.border[i].ansclear(i);} }
		if(k.isextendcell!=0){ for(var i=0;i<this.excellmax;i++){ this.excell[i].ansclear(i);} }

		pc.paintAll();
		base.resetInfo();
	},
	subclear : function(){
		for(var i=0;i<this.cellmax;i++){ this.cell[i].subclear(i);}
		if(k.iscross ){ for(var i=0;i<this.crossmax;i++){ this.cross[i].subclear(i); } }
		if(k.isborder){ for(var i=0;i<this.bdmax;i++){ this.border[i].subclear(i);} }
		if(k.isextendcell!=0){ for(var i=0;i<this.excellmax;i++){ this.excell[i].subclear(i);} }

		pc.paintAll();
	},
	errclear : function(){
		if(!ans.errDisp){ return;}

		for(var i=0;i<this.cellmax;i++){ this.cell[i].error=0;}
		if(k.iscross ){ for(var i=0;i<this.crossmax;i++){ this.cross[i].error=0; } }
		if(k.isborder){ for(var i=0;i<this.bdmax;i++){ this.border[i].error=0;} }
		if(k.isextendcell!=0){ for(var i=0;i<this.excellmax;i++){ this.excell[i].error=0;} }

		ans.errDisp = false;
		pc.paintAll();
	},
	//---------------------------------------------------------------------------
	// bd.isNullObj()   �w�肵���I�u�W�F�N�g�������l�Ɠ��������f����
	// bd.hideNumobj()  �w�肵���I�u�W�F�N�g��numobj���B��
	//---------------------------------------------------------------------------
	isNullObj : function(type,id){
		if(type=='cell'){
			return ((this.cell[id].qans == this.def.cell.qans)&&
					(this.cell[id].qsub == this.def.cell.qsub)&&
					(this.cell[id].ques == this.def.cell.ques)&&
					(this.cell[id].qnum == this.def.cell.qnum)&&
					(this.cell[id].direc== this.def.cell.direc));
		}
		else if(type=='cross') {
			return (this.cross[id].qnum==this.def.cross.qnum);
		}
		else if(type=='border'){
			return ((this.border[id].qans == this.def.border.qans)&&
					(this.border[id].qsub == this.def.border.qsub)&&
					(this.border[id].ques == this.def.border.ques)&&
					(this.border[id].qnum == this.def.border.qnum)&&
					(this.border[id].line == this.def.border.line));
		}
		else if(type=='excell'){
			return ((this.excell[id].qnum == this.def.cell.qnum)&&
					(this.excell[id].direc== this.def.cell.direc));
		}
		return true;
	},

	hideNumobj : function(type,id){
		if(type=='cell'){
			if(this.cell[id].numobj) { this.cell[id].numobj.hide();}
			if(this.cell[id].numobj2){ this.cell[id].numobj2.hide();}
		}
		else if(type=='cross') {
			if(this.cross[id].numobj){ this.cross[id].numobj.hide();}
		}
		else if(type=='border'){
			if(this.border[id].numobj){ this.border[id].numobj.hide();}
		}
		else if(type=='excell'){
			if(this.excell[id].numobj) { this.excell[id].numobj.hide();}
			if(this.excell[id].numobj2){ this.excell[id].numobj2.hide();}
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
			if(cx%2==0 && cy%2==1){ return mf((cx-1)/2)+mf((cy-1)/2)*(qc-1);}
			else if(cx%2==1 && cy%2==0){ return mf((cx-1)/2)+mf((cy-2)/2)*qc+(qc-1)*qr;}
		}
		else if(k.isoutsideborder==1){
			if     (cy==0   &&cx%2==1&&(cx>=1&&cx<=2*qc-1)){ return (qc-1)*qr+qc*(qr-1)+mf((cx-1)/2);}
			else if(cy==2*qr&&cx%2==1&&(cx>=1&&cx<=2*qc-1)){ return (qc-1)*qr+qc*(qr-1)+qc+mf((cx-1)/2);}
			else if(cx==0   &&cy%2==1&&(cy>=1&&cy<=2*qr-1)){ return (qc-1)*qr+qc*(qr-1)+2*qc+mf((cy-1)/2);}
			else if(cx==2*qc&&cy%2==1&&(cy>=1&&cy<=2*qr-1)){ return (qc-1)*qr+qc*(qr-1)+2*qc+qr+mf((cy-1)/2);}
		}
		return -1;
	},
	exnum : function(cx,cy){
		return this.exnum2(cx,cy,k.qcols,k.qrows);
	},
	exnum2 : function(cx,cy,qc,qr){
		if(k.isextendcell==1){
			if(cx==-1&&cy==-1){ return qc+qr;}
			else if(cy==-1&&cx>=0&&cx<qc){ return cx;}
			else if(cx==-1&&cy>=0&&cy<qr){ return qc+cy;}
		}
		else if(k.isextendcell==2){
			if     (cy==-1&&cx>=0&&cx<qc){ return cx;}
			else if(cy==qr&&cx>=0&&cx<qc){ return qc+cx;}
			else if(cx==-1&&cy>=0&&cy<qr){ return 2*qc+cy;}
			else if(cx==qc&&cy>=0&&cy<qr){ return 2*qc+qr+cy;}
			else if(cx==-1&&cy==-1){ return 2*qc+2*qr;}
			else if(cx==qc&&cy==-1){ return 2*qc+2*qr+1;}
			else if(cx==-1&&cy==qr){ return 2*qc+2*qr+2;}
			else if(cx==qc&&cy==qr){ return 2*qc+2*qr+3;}
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
		return this.cnum(mf((bd.border[id].cx-(bd.border[id].cy%2))/2), mf((bd.border[id].cy-(bd.border[id].cx%2))/2) );
	},
	cc2 : function(id){
		return this.cnum(mf((bd.border[id].cx+(bd.border[id].cy%2))/2), mf((bd.border[id].cy+(bd.border[id].cx%2))/2) );
	},
	crosscc1 : function(id){
		return this.xnum(mf((bd.border[id].cx-(bd.border[id].cx%2))/2), mf((bd.border[id].cy-(bd.border[id].cy%2))/2) );
	},
	crosscc2 : function(id){
		return this.xnum(mf((bd.border[id].cx+(bd.border[id].cx%2))/2), mf((bd.border[id].cy+(bd.border[id].cy%2))/2) );
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
	isLPup    : function(cc){ return ({101:1,102:1,104:1,105:1}[this.QuC(cc)] == 1);},
	isLPdown  : function(cc){ return ({101:1,102:1,106:1,107:1}[this.QuC(cc)] == 1);},
	isLPleft  : function(cc){ return ({101:1,103:1,105:1,106:1}[this.QuC(cc)] == 1);},
	isLPright : function(cc){ return ({101:1,103:1,104:1,107:1}[this.QuC(cc)] == 1);},
	isnoLPup    : function(cc){ return ({1:1,4:1,5:1,21:1,103:1,106:1,107:1}[this.QuC(cc)] == 1);},
	isnoLPdown  : function(cc){ return ({1:1,2:1,3:1,21:1,103:1,104:1,105:1}[this.QuC(cc)] == 1);},
	isnoLPleft  : function(cc){ return ({1:1,2:1,5:1,22:1,102:1,104:1,107:1}[this.QuC(cc)] == 1);},
	isnoLPright : function(cc){ return ({1:1,3:1,4:1,22:1,102:1,105:1,106:1}[this.QuC(cc)] == 1);},
	//---------------------------------------------------------------------------
	// bd.isLPMarked()      Line�̂ǂ��炩����LineParts�����݂��Ă��邩�ǂ������肷��
	// bd.isLPCombined()    Line��2�����Ƃ�LineParts�����݂��Ă��邩�ǂ������肷��
	// bd.isLineNG()        Line�̂ǂ��炩���A���������Ȃ��悤�ɂȂ��Ă��邩���肷��
	// bd.isLP()            ���3�̋��ʊ֐�
	// bd.checkLPCombined() �����Ȃ����Ă��邩�ǂ������āALine==1��ݒ肷��
	//---------------------------------------------------------------------------
	isLPMarked : function(id){
		return bd.border[id].cx%2==1 ? (bd.isLPdown(bd.cc1(id)) || bd.isLPup(bd.cc2(id))) :
									   (bd.isLPright(bd.cc1(id)) || bd.isLPleft(bd.cc2(id)));
	},
	isLPCombined : function(id){
		return bd.border[id].cx%2==1 ? (bd.isLPdown(bd.cc1(id)) && bd.isLPup(bd.cc2(id))) :
									   (bd.isLPright(bd.cc1(id)) && bd.isLPleft(bd.cc2(id)));
	},
	isLineNG : function(id){
		return bd.border[id].cx%2==1 ? (bd.isnoLPdown(bd.cc1(id)) || bd.isnoLPup(bd.cc2(id))) :
									   (bd.isnoLPright(bd.cc1(id)) || bd.isnoLPleft(bd.cc2(id)));
	},
	checkLPCombined : function(cc){
		var id;
		id = this.ub(cc); if(id!=-1 && this.LiB(id)==0 && this.isLPCombined(id)){ this.sLiB(id,1);}
		id = this.db(cc); if(id!=-1 && this.LiB(id)==0 && this.isLPCombined(id)){ this.sLiB(id,1);}
		id = this.lb(cc); if(id!=-1 && this.LiB(id)==0 && this.isLPCombined(id)){ this.sLiB(id,1);}
		id = this.rb(cc); if(id!=-1 && this.LiB(id)==0 && this.isLPCombined(id)){ this.sLiB(id,1);}
	},

	//---------------------------------------------------------------------------
	// sQuC / QuC : bd.setQuesCell() / bd.getQuesCell()  �Y������Cell��ques��ݒ肷��/�Ԃ�
	// sQnC / QnC : bd.setQnumCell() / bd.getQnumCell()  �Y������Cell��qnum��ݒ肷��/�Ԃ�
	// sQsC / QsC : bd.setQsubCell() / bd.getQsubCell()  �Y������Cell��qsub��ݒ肷��/�Ԃ�
	// sQaC / QaC : bd.setQansCell() / bd.getQansCell()  �Y������Cell��qans��ݒ肷��/�Ԃ�
	// sDiC / DiC : bd.setDirecCell()/ bd.getDirecCell() �Y������Cell��direc��ݒ肷��/�Ԃ�
	//---------------------------------------------------------------------------
	// Cell�֘AGet/Set�֐� <- �eCell�������Ă���ƃ������������������̂ł����ɒu������.
	sQuC : function(id, num) {
		if(id<0 || this.cell.length<=id){ return;}

		um.addOpe('cell', 'ques', id, this.cell[id].ques, num);
		this.cell[id].ques = num;

		if(k.puzzleid=="pipelink"||k.puzzleid=="loopsp"){ this.checkLPCombined(id);}
	},
	QuC : function(id){
		if(id<0 || this.cell.length<=id){ return -1;}
		return this.cell[id].ques;
	},
	sQnC : function(id, num) {
		if(id<0 || this.cell.length<=id){ return;}
		if(k.dispzero==0 && num==0){ return;}

		var old = this.cell[id].qnum;
		um.addOpe('cell', 'qnum', id, old, num);
		this.cell[id].qnum = num;

		if(area.numberColony && (num!=-1 ^ area.bcell.id[id]!=-1)){ area.setCell(id,(num!=-1?1:0));}
		if(k.puzzleid=="lightup" && ((old==-1)^(num==-1))){ mv.paintAkari(id);}
	},
	QnC : function(id){
		if(id<0 || this.cell.length<=id){ return -1;}
		return this.cell[id].qnum;
	},
	sQaC : function(id, num) {
		if(id<0 || this.cell.length<=id){ return;}

		var old = this.cell[id].qans;
		um.addOpe('cell', 'qans', id, old, num);
		this.cell[id].qans = num;

		if((area.bblock && (num!=-1 ^ area.bcell.id[id]!=-1)) || 
		   (area.wblock && (num==-1 ^ area.wcell.id[id]!=-1))){ area.setCell(id,(num!=-1?1:0));}
		if(k.puzzleid=="lightup" && ((old==1)^(num==1))){ mv.paintAkari(id);}
	},
	QaC : function(id){
		if(id<0 || this.cell.length<=id){ return -1;}
		return this.cell[id].qans;
	},
	sQsC : function(id, num) {
		if(id<0 || this.cell.length<=id){ return;}

		um.addOpe('cell', 'qsub', id, this.cell[id].qsub, num);
		this.cell[id].qsub = num;
	},
	QsC : function(id){
		if(id<0 || this.cell.length<=id){ return -1;}
		return this.cell[id].qsub;
	},
	sDiC : function(id, num) {
		if(id<0 || this.cell.length<=id){ return;}

		um.addOpe('cell', 'direc', id, this.cell[id].direc, num);
		this.cell[id].direc = num;
	},
	DiC : function(id){
		if(id<0 || this.cell.length<=id){ return -1;}
		return this.cell[id].direc;
	},
	//---------------------------------------------------------------------------
	// sQnE / QnE : bd.setQnumEXcell() / bd.getQnumEXcell()  �Y������EXCell��qnum��ݒ肷��/�Ԃ�
	// sDiE / DiE : bd.setDirecEXcell()/ bd.getDirecEXcell() �Y������EXCell��direc��ݒ肷��/�Ԃ�
	//---------------------------------------------------------------------------
	// EXcell�֘AGet/Set�֐�
	sQnE : function(id, num) {
		if(id<0 || this.excell.length<=id){ return;}
		um.addOpe('excell', 'qnum', id, this.excell[id].qnum, num);
		this.excell[id].qnum = num;
	},
	QnE : function(id){
		if(id<0 || this.excell.length<=id){ return -1;}
		return this.excell[id].qnum;
	},
	sDiE : function(id, num) {
		if(id<0 || this.excell.length<=id){ return;}
		um.addOpe('excell', 'direc', id, this.excell[id].direc, num);
		this.excell[id].direc = num;
	},
	DiE : function(id){
		if(id<0 || this.excell.length<=id){ return -1;}
		return this.excell[id].direc;
	},

	//---------------------------------------------------------------------------
	// sQuX / QuX : bd.setQuesCross(id,num) / bd.getQuesCross() �Y������Cross��ques��ݒ肷��/�Ԃ�
	// sQnX / QnX : bd.setQnumCross(id,num) / bd.getQnumCross() �Y������Cross��qnum��ݒ肷��/�Ԃ�
	//---------------------------------------------------------------------------
	// Cross�֘AGet/Set�֐� <- �eCross�������Ă���ƃ������������������̂ł����ɒu������.
	sQuX : function(id, num) {
		if(id<0 || this.cross.length<=id){ return;}

		um.addOpe('cross', 'ques', id, this.cross[id].ques, num);
		this.cross[id].ques = num;
	},
	QuX : function(id){
		if(id<0 || this.cross.length<=id){ return -1;}
		return this.cross[id].ques;
	},
	sQnX : function(id, num) {
		if(id<0 || this.cross.length<=id){ return;}

		um.addOpe('cross', 'qnum', id, this.cross[id].qnum, num);
		this.cross[id].qnum = num;
	},
	QnX : function(id){
		if(id<0 || this.cross.length<=id){ return -1;}
		return this.cross[id].qnum;
	},

	//---------------------------------------------------------------------------
	// sQuB / QuB : bd.setQuesBorder() / bd.getQuesBorder() �Y������Border��ques��ݒ肷��/�Ԃ�
	// sQnB / QnB : bd.setQnumBorder() / bd.getQnumBorder() �Y������Border��qnum��ݒ肷��/�Ԃ�
	// sQaB / QaB : bd.setQansBorder() / bd.getQansBorder() �Y������Border��qans��ݒ肷��/�Ԃ�
	// sQsB / QsB : bd.setQsubBorder() / bd.getQsubBorder() �Y������Border��qsub��ݒ肷��/�Ԃ�
	// sLiB / LiB : bd.setLineBorder() / bd.getLineBorder() �Y������Border��line��ݒ肷��/�Ԃ�
	//---------------------------------------------------------------------------
	// Border�֘AGet/Set�֐� <- �eBorder�������Ă���ƃ������������������̂ł����ɒu������.
	sQuB : function(id, num) {
		if(id<0 || this.border.length<=id){ return;}

		var old = this.border[id].ques;
		um.addOpe('border', 'ques', id, old, num);
		this.border[id].ques = num;

		if(num>0 ^ old>0){ area.call_setBorder(id,num,'ques');}
	},
	QuB : function(id){
		if(id<0 || this.border.length<=id){ return -1;}
		return this.border[id].ques;
	},
	sQnB : function(id, num) {
		if(id<0 || this.border.length<=id){ return;}

		um.addOpe('border', 'qnum', id, this.border[id].qnum, num);
		this.border[id].qnum = num;
	},
	QnB : function(id){
		if(id<0 || this.border.length<=id){ return -1;}
		return this.border[id].qnum;
	},
	sQaB : function(id, num) {
		if(id<0 || this.border.length<=id){ return;}
		if(this.border[id].ques!=0){ return;}

		var old = this.border[id].qans;
		um.addOpe('border', 'qans', id, old, num);
		this.border[id].qans = num;

		if(num>0 ^ old>0){
			if(k.isborderAsLine){ line.setLine(id,num);}
			else                { area.call_setBorder(id,num,'qans');}
		}
	},
	QaB : function(id){
		if(id<0 || this.border.length<=id){ return -1;}
		return this.border[id].qans;
	},
	sQsB : function(id, num) {
		if(id<0 || this.border.length<=id){ return;}

		um.addOpe('border', 'qsub', id, this.border[id].qsub, num);
		this.border[id].qsub = num;
	},
	QsB : function(id){
		if(id<0 || this.border.length<=id){ return -1;}
		return this.border[id].qsub;
	},
	sLiB : function(id, num) {
		if(id<0 || this.border.length<=id){ return;}
		if(this.enableLineNG && (num==1?bd.isLineNG:bd.isLPCombined)(id)){ return;}

		var old = this.border[id].line;
		um.addOpe('border', 'line', id, old, num);
		this.border[id].line = num;

		if(num>0 ^ old>0){ line.setLine(id,num);}
	},
	LiB : function(id){
		if(id<0 || this.border.length<=id){ return -1;}
		return this.border[id].line;
	},

	//---------------------------------------------------------------------------
	// sErC / ErC : bd.setErrorCell()   / bd.getErrorCell()   �Y������Cell��error��ݒ肷��/�Ԃ�
	// sErX / ErX : bd.setErrorCross()  / bd.getErrorCross()  �Y������Cross��error��ݒ肷��/�Ԃ�
	// sErB / ErB : bd.setErrorBorder() / bd.getErrorBorder() �Y������Border��error��ݒ肷��/�Ԃ�
	// sErE / ErE : bd.setErrorEXcell() / bd.getErrorEXcell() �Y������EXcell��error��ݒ肷��/�Ԃ�
	//---------------------------------------------------------------------------
	// Get/SetError�֐�(set�͔z��œ���)
	sErC : function(idlist, num) {
		if(!ans.isenableSetError()){ return;}
		if(!idlist.push){ idlist = [idlist];}
		for(var i=0;i<idlist.length;i++){ if(idlist[i]>=0 && this.cell.length>idlist[i]){ this.cell[idlist[i]].error = num;} }
	},
	ErC : function(id){
		if(id<0 || this.cell.length<=id){ return 0;}
		return this.cell[id].error;
	},
	sErX : function(idlist, num) {
		if(!ans.isenableSetError()){ return;}
		if(!idlist.push){ idlist = [idlist];}
		for(var i=0;i<idlist.length;i++){ if(idlist[i]>=0 && this.cross.length>idlist[i]){ this.cross[idlist[i]].error = num;} }
	},
	ErX : function(id){
		if(id<0 || this.cross.length<=id){ return 0;}
		return this.cross[id].error;
	},
	sErB : function(idlist, num) {
		if(!ans.isenableSetError()){ return;}
		if(!idlist.push){ idlist = [idlist];}
		for(var i=0;i<idlist.length;i++){ if(idlist[i]>=0 && this.border.length>idlist[i]){ this.border[idlist[i]].error = num;} }
	},
	ErB : function(id){
		if(id<0 || this.border.length<=id){ return 0;}
		return this.border[id].error;
	},
	sErE : function(idlist, num) {
		if(!ans.isenableSetError()){ return;}
		if(!idlist.push){ idlist = [idlist];}
		for(var i=0;i<idlist.length;i++){ if(idlist[i]>=0 && this.excell.length>idlist[i]){ this.excell[idlist[i]].error = num;} }
	},
	ErE : function(id){
		if(id<0 || this.excell.length<=id){ return 0;}
		return this.excell[id].error;
	},

	//---------------------------------------------------------------------------
	// bd.override()  �����t���O�����Ċ֐����I�[�o�[���C�h����
	//---------------------------------------------------------------------------
	override : function(){
		if(k.isborderAsLine){
			this.isLine     = function(id){ return (bd.QaB(id)>0);};
			this.setLine    = function(id){ this.sQaB(id, 1); this.sQsB(id, 0);};
			this.setPeke    = function(id){ this.sQaB(id, 0); this.sQsB(id, 2);};
			this.removeLine = function(id){ this.sQaB(id, 0); this.sQsB(id, 0);};
		}
		if(!k.isAnsNumber){
			this.isNum      = function(c){ return (bd.QnC(c)!=-1);};
			this.noNum      = function(c){ return (bd.QnC(c)==-1);};
			this.isValidNum = function(c){ return (bd.QnC(c)>= 0);};

			this.getNum = function(c)    { return bd.QnC(c);};
			this.setNum = function(c,val){ if(k.dispzero || val!=0){ this.sQnC(c,val);} };
			if(k.NumberIsWhite){
				this.setNum = function(c,val){ if(k.dispzero || val!=0){ this.sQnC(c,val); this.sQaC(c,-1);} };
			}
		}
		else{
			if(k.NumberIsWhite){
				this.setNum = function(c){ this.sQnC(c,val); this.sQaC(c,-1);}
			}
		}
	},

	//---------------------------------------------------------------------------
	// bd.isBlack()   �Y������Cell�����}�X���ǂ����Ԃ�
	// bd.isWhite()   �Y������Cell�����}�X���ǂ����Ԃ�
	// bd.setBlack()  �Y������Cell�ɍ��}�X���Z�b�g����
	// bd.setWhite()  �Y������Cell�ɔ��}�X���Z�b�g����
	//---------------------------------------------------------------------------
	isBlack : function(c){ return (bd.QaC(c)==1);},
	isWhite : function(c){ return (c!=-1 && bd.QaC(c)!=1);},

	setBlack : function(c){ this.sQaC(c, 1);},
	setWhite : function(c){ this.sQaC(c,-1);},

	//---------------------------------------------------------------------------
	// bd.isNum()      �Y������Cell�ɐ��������邩�Ԃ�
	// bd.noNum()      �Y������Cell�ɐ������Ȃ����Ԃ�
	// bd.isValidNum() �Y������Cell��0�ȏ�̐��������邩�Ԃ�
	// bd.sameNumber() �Q��Cell�ɓ����L���Ȑ��������邩�Ԃ�
	// bd.getNum()     �Y������Cell�̐�����Ԃ�
	// bd.setNum()     �Y������Cell�ɐ�����ݒ肷��
	//---------------------------------------------------------------------------
	isNum      : function(c){ return (bd.QnC(c)!=-1 || bd.QaC(c)!=-1);},
	noNum      : function(c){ return (bd.QnC(c)==-1 && bd.QaC(c)==-1);},
	isValidNum : function(c){ return (bd.QnC(c)>=0 || (bd.QnC(c)==-1 && bd.QaC(c)>=0));},
	sameNumber : function(c1,c2){ return (bd.isValidNum(c1) && (bd.getNum(c1) == bd.getNum(c2)));},

	getNum : function(c){ return (this.QnC(c)!=-1?this.QnC(c):this.QaC(c));},
	setNum : function(c,val){
		if(k.dispzero || val!=0){
			if(k.mode==1){ this.sQnC(c,val); this.sQaC(c,bd.def.cell.qnum);}
			else if(this.QnC(c)==bd.def.cell.qnum){ this.sQaC(c,val);}
			this.sQsC(c,0);
		}
	},

	//---------------------------------------------------------------------------
	// bd.isLine()      �Y������Border��line��������Ă��邩���肷��
	//                  (k.isborderAsLine���̓I�[�o�[���C�h����܂�)
	// bd.setLine()     �Y������Border�ɐ�������
	// bd.setPeke()     �Y������Border�Ɂ~������
	// bd.removeLine()  �Y������Border�����������
	//---------------------------------------------------------------------------
	isLine : function(id){
		try{ return (bd.border[id].line>0);}catch(e){}
		return false;
	},

	setLine    : function(id){ this.sLiB(id, 1); this.sQsB(id, 0);},
	setPeke    : function(id){ this.sLiB(id, 0); this.sQsB(id, 2);},
	removeLine : function(id){ this.sLiB(id, 0); this.sQsB(id, 0);},

	//---------------------------------------------------------------------------
	// bd.isBorder()     �Y������Border�ɋ��E����������Ă��邩���肷��
	// bd.setBorder()    �Y������Border�ɋ��E��������
	// bd.removeBorder() �Y������Border�����������
	// bd.setBsub()      �Y������Border�ɋ��E���p�̕⏕�L��������
	// bd.removeBsub()   �Y������Border���狫�E���p�̕⏕�L�����͂���
	//---------------------------------------------------------------------------
	isBorder : function(id){
		try{ return (bd.border[id].ques>0 || bd.border[id].qans>0);}catch(e){}
		return false;
	},

	setBorder    : function(id){
		if(k.mode==1){ this.sQuB(id,1); this.sQaB(id,0);}
		else if(this.QuB(id)!=1){ this.sQaB(id,1);}
	},
	removeBorder : function(id){
		if(k.mode==1){ this.sQuB(id,0); this.sQaB(id,0);}
		else if(this.QuB(id)!=1){ this.sQaB(id,0);}
	},
	setBsub      : function(id){ this.sQsB(id,1);},
	removeBsub   : function(id){ this.sQsB(id,0);}
};
