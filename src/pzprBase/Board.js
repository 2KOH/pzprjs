// Board.js v3.2.2

//---------------------------------------------------------------------------
// ��Cell�N���X Board�N���X��Cell�̐������ێ�����
//---------------------------------------------------------------------------
// �{�[�h�����o�f�[�^�̒�`(1)
// Cell�N���X�̒�`
Cell = function(){
	this.cx;	// �Z����X���W��ێ�����
	this.cy;	// �Z����Y���W��ێ�����
	this.px;	// �Z���̕`��pX���W��ێ�����
	this.py;	// �Z���̕`��pY���W��ێ�����
	this.ques;	// �Z���̖��f�[�^(�`��)��ێ�����
	this.qnum;	// �Z���̖��f�[�^(����)��ێ�����
	this.direc;	// �㉺���E�̕���
	this.qans;	// �Z���̉񓚃f�[�^��ێ�����
	this.qsub;	// �Z���̕⏕�f�[�^��ێ�����(��qlight)
	this.error;	// �G���[�f�[�^��ێ�����
	this.numobj = '';	// ������\�����邽�߂̃G�������g
	this.numobj2 = '';	// ������\�����邽�߂̃G�������g
};
Cell.prototype = {
	//---------------------------------------------------------------------------
	// cell.cellinit() �Z���̏�������������
	// cell.allclear() �Z����cx,cy,numobj���ȊO���N���A����
	// cell.ansclear() �Z����qans,qsub,error�����N���A����
	// cell.subclear() �Z����qsub,error�����N���A����
	//---------------------------------------------------------------------------
	cellinit : function(num){
		this.allclear(num);
		bd.setposCell(num);
	},
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
Cross = function(){
	this.cx;	// �����_��X���W��ێ�����
	this.cy;	// �����_��Y���W��ێ�����
	this.px;	// �����_�̕`��pX���W��ێ�����
	this.py;	// �����_�̕`��pY���W��ێ�����
	this.ques;	// �����_�̖��f�[�^��ێ�����
	this.qnum;	// �����_�̖��f�[�^(����)��ێ�����
	this.error;	// �G���[�f�[�^��ێ�����
	this.numobj = '';	// ������\�����邽�߂̃G�������g
};
Cross.prototype = {
	//---------------------------------------------------------------------------
	// cross.cellinit() �����_�̏�������������
	// cross.allclear() �����_��cx,cy,numobj���ȊO���N���A����
	// cross.ansclear() �����_��error�����N���A����
	// cross.subclear() �����_��error�����N���A����
	//---------------------------------------------------------------------------
	cellinit : function(num){
		this.allclear(num);
		bd.setposCross(num);
	},
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
Border = function(){
	this.cx;	// ���E����X���W��ێ�����
	this.cy;	// ���E����Y���W��ێ�����
	this.px;	// ���E���̕`��X���W��ێ�����
	this.py;	// ���E���̕`��Y���W��ێ�����
	this.ques;	// ���E���̖��f�[�^(1:���E������)��ێ�����
	this.qnum;	// ���E���̖��f�[�^(����)��ێ�����
	this.qans;	// ���E���̉񓚃f�[�^(1:���E������)��ێ�����
	this.qsub;	// ���E���̕⏕�f�[�^(1:�⏕��/2:�~)��ێ�����
	this.line;	// ���̉񓚃f�[�^(1:�񓚂̐�����)��ێ�����
	this.color;	// ���̐F�����f�[�^��ێ�����
	this.error;	// �G���[�f�[�^��ێ�����
	this.numobj = '';	// ������\�����邽�߂̃G�������g
};
Border.prototype = {
	//---------------------------------------------------------------------------
	// border.cellinit() �����_�̏�������������
	// border.allclear() ���E����cx,cy,numobj���ȊO���N���A����
	// border.ansclear() ���E����qans,qsub,line,color,error�����N���A����
	// border.subclear() ���E����qsub,error�����N���A����
	//---------------------------------------------------------------------------
	cellinit : function(num){
		this.allclear(num);
		bd.setposBorder(num);
	},
	allclear : function(num) {
		this.ques = 0;
		if(k.puzzleid=="mejilink" && num<k.qcols*(k.qrows-1)+(k.qcols-1)*k.qrows){ this.ques = 1;}
		this.qnum = -1;
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
	this.lcnts = { cell:new Array(), total:new Array()};
	this.initialize2();
};
Board.prototype = {
	//---------------------------------------------------------------------------
	// bd.initialize2()  �f�[�^�̏��������s��
	//---------------------------------------------------------------------------
	initialize2 : function(){
		// Cell�̏���������
		this.cell = new Array();
		this.cells = new Array();
		for(var i=0;i<k.qcols*k.qrows;i++){
			this.cell[i] = new Cell(i);
			this.cell[i].allclear(i);
			this.cells.push(i);
		}

		if(k.iscross){
			this.cross = new Array();	// Cross���`
			this.crosses = new Array();
			for(var i=0;i<(k.qcols+1)*(k.qrows+1);i++){
				this.cross[i] = new Cross(i);
				this.cross[i].allclear(i);
				this.crosses.push(i);
			}
		}

		if(k.isborder){
			this.border = new Array();	// Border/Line���`
			this.borders = new Array();
			this.bdinside = (k.qcols-1)*k.qrows+k.qcols*(k.qrows-1);
			for(var i=0;i<this.bdinside+(k.isoutsideborder==0?0:2*(k.qcols+k.qrows));i++){
				this.border[i] = new Border(i);
				this.border[i].allclear(i);
				this.borders.push(i);
			}
		}

		if(k.isextendcell!=0){
			this.excell = new Array();
			for(var i=0;i<(k.isextendcell==1?k.qcols+k.qrows+1:2*k.qcols+2*k.qrows+4);i++){
				this.excell[i] = new Cell(i);
				this.excell[i].allclear(i);
			}
		}

		this.setposAll();
		this.resetLcnts();
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
		for(var i=0;i<this.cell.length;i++){ this.setposCell(i);}
		if(k.iscross ){ for(var i=0;i<this.cross.length ;i++){ this.setposCross(i); } }
		if(k.isborder){
			this.bdinside = (k.qcols-1)*k.qrows+k.qcols*(k.qrows-1);
			for(var i=0;i<this.border.length;i++){ this.setposBorder(i);}
		}
		if(k.isextendcell!=0){ for(var i=0;i<this.excell.length;i++){ this.setposEXcell(i);} }

		this.setpicAll();
	},
	setposCell : function(id){
		this.cell[id].cx = id%k.qcols;
		this.cell[id].cy = mf(id/k.qcols);
	},
	setposCross : function(id){
		this.cross[id].cx = id%(k.qcols+1);
		this.cross[id].cy = mf(id/(k.qcols+1));
	},
	setposBorder : function(id){
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
	},
	setposEXcell : function(id){
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
	},

	//---------------------------------------------------------------------------
	// bd.setpicAll()    �S�Ă�Cell, Cross, Border�I�u�W�F�N�g��setpicCell()�����Ăяo��
	// bd.setpicCell()   �Y������id�̃Z����px,py�v���p�e�B��ݒ肷��
	// bd.setpicCross()  �Y������id�̌����_��px,py�v���p�e�B��ݒ肷��
	// bd.setpicBorder() �Y������id�̋��E��/Line��px,py�v���p�e�B��ݒ肷��
	// bd.setpicEXCell() �Y������id��Extend�Z����px,py�v���p�e�B��ݒ肷��
	//---------------------------------------------------------------------------
	setpicAll : function(){
		for(var i=0;i<this.cell.length;i++){ this.setpicCell(i);}
		if(k.iscross ){ for(var i=0;i<this.cross.length ;i++){ this.setpicCross(i); } }
		if(k.isborder){
			this.bdinside = (k.qcols-1)*k.qrows+k.qcols*(k.qrows-1);
			for(var i=0;i<this.border.length;i++){ this.setpicBorder(i);}
		}
		if(k.isextendcell!=0){ for(var i=0;i<this.excell.length;i++){ this.setpicEXcell(i);} }
	},

	setpicCell : function(id){
		this.cell[id].px = k.p0.x+this.cell[id].cx*k.cwidth;
		this.cell[id].py = k.p0.y+this.cell[id].cy*k.cheight;
	},
	setpicCross : function(id){
		this.cross[id].px = k.p0.x+this.cross[id].cx*k.cwidth;
		this.cross[id].py = k.p0.y+this.cross[id].cy*k.cheight;
	},
	setpicBorder : function(id){
		this.border[id].px = k.p0.x+mf(this.border[id].cx*k.cwidth/2);
		this.border[id].py = k.p0.y+mf(this.border[id].cy*k.cheight/2);
	},
	setpicEXCell : function(id){
		this.excell[id].px = k.p0.x+this.excell[id].cx*k.cwidth;
		this.excell[id].py = k.p0.y+this.excell[id].cy*k.cheight;
	},

	//---------------------------------------------------------------------------
	// bd.ansclear() �S�Ă�Cell, Cross, Border�I�u�W�F�N�g��ansclear()���Ăяo���ACanvas���ĕ`�悷��
	// bd.subclear() �S�Ă�Cell, Cross, Border�I�u�W�F�N�g��subclear()���Ăяo���ACanvas���ĕ`�悷��
	// bd.errclear() �S�Ă�Cell, Cross, Border�I�u�W�F�N�g��error�v���p�e�B��0�ɂ��āACanvas���ĕ`�悷��
	//---------------------------------------------------------------------------
	ansclear : function(){
		for(var i=0;i<this.cell.length;i++){ this.cell[i].ansclear(i);}
		if(k.iscross ){ for(var i=0;i<this.cross.length ;i++){ this.cross[i].ansclear(i); } }
		if(k.isborder){ for(var i=0;i<this.border.length;i++){ this.border[i].ansclear(i);} }
		if(k.isextendcell!=0){ for(var i=0;i<this.excell.length;i++){ this.excell[i].ansclear(i);} }

		pc.paintAll();

		this.resetLcnts();
	},
	subclear : function(){
		for(var i=0;i<this.cell.length;i++){ this.cell[i].subclear(i);}
		if(k.iscross ){ for(var i=0;i<this.cross.length ;i++){ this.cross[i].subclear(i); } }
		if(k.isborder){ for(var i=0;i<this.border.length;i++){ this.border[i].subclear(i);} }
		if(k.isextendcell!=0){ for(var i=0;i<this.excell.length;i++){ this.excell[i].subclear(i);} }

		pc.paintAll();
	},
	errclear : function(){
		if(!ans.errDisp){ return;}

		for(var i=0;i<this.cell.length;i++){ this.cell[i].error=0;}
		if(k.iscross ){ for(var i=0;i<this.cross.length ;i++){ this.cross[i].error=0; } }
		if(k.isborder){ for(var i=0;i<this.border.length;i++){ this.border[i].error=0;} }
		if(k.isextendcell!=0){ for(var i=0;i<this.excell.length;i++){ this.excell[i].error=0;} }

		ans.errDisp = false;
		pc.paintAll();
	},
	//---------------------------------------------------------------------------
	// bd.isNullCell()   �w�肵��id��Cell��qans��ques���������l�Ɠ��������f����
	// bd.isNullCross()  �w�肵��id��Cross��ques���������l�Ɠ��������f����
	// bd.isNullBorder() �w�肵��id��Border��line��ques���������l�Ɠ��������f����
	//---------------------------------------------------------------------------
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
		if(this.QaC(this.cnum(cx-1, cy-1))==1){ cnt++;}
		if(this.QaC(this.cnum(cx  , cy-1))==1){ cnt++;}
		if(this.QaC(this.cnum(cx-1, cy  ))==1){ cnt++;}
		if(this.QaC(this.cnum(cx  , cy  ))==1){ cnt++;}
		return cnt;
	},

	//---------------------------------------------------------------------------
	// bd.setLcnts()      ���������ꂽ�������Ă��肵�����ɁA�ϐ�lcnts�̓��e��ύX����
	// bd.resetLcount()   ��]���]�E�g��k������lcnt�ϐ����č\�z����
	// bd.resetLcnts()    lcnts���̕ϐ��̏��������s��
	// bd.lcntCell()      �Z���ɑ��݂�����̖{����Ԃ�
	// bd.lcntCross()     ��_�ɑ��݂�����̖{����Ԃ�
	//---------------------------------------------------------------------------
	setLcnts : function(id, val){
		var cc1, cc2;
		if(k.isCenterLine){ cc1 = this.cc1(id),      cc2 = this.cc2(id);}
		else              { cc1 = this.crosscc1(id), cc2 = this.crosscc2(id);}

		if(val>0){
			if(cc1!=-1){ this.lcnts.total[this.lcnts.cell[cc1]]--; this.lcnts.cell[cc1]++; this.lcnts.total[this.lcnts.cell[cc1]]++;}
			if(cc2!=-1){ this.lcnts.total[this.lcnts.cell[cc2]]--; this.lcnts.cell[cc2]++; this.lcnts.total[this.lcnts.cell[cc2]]++;}
		}
		else{
			if(cc1!=-1){ this.lcnts.total[this.lcnts.cell[cc1]]--; this.lcnts.cell[cc1]--; this.lcnts.total[this.lcnts.cell[cc1]]++;}
			if(cc2!=-1){ this.lcnts.total[this.lcnts.cell[cc2]]--; this.lcnts.cell[cc2]--; this.lcnts.total[this.lcnts.cell[cc2]]++;}
		}
	},
	resetLcnts : function(){
		if(k.isborder){
			if(k.isCenterLine){
				if(this.border){ for(var c=0;c<this.cell.length;c++){ this.lcnts.cell[c]=0;} };
				for(var i=1;i<=4;i++){ this.lcnts.cell[i]=0;}
				this.lcnts.total[0] = k.qcols*k.qrows;
			}
			else{
				if(this.border){ for(var c=0;c<(k.qcols+1)*(k.qrows+1);c++){ this.lcnts.cell[c]=0;} };
				for(var i=1;i<=4;i++){ this.lcnts.cell[i]=0;}
				this.lcnts.total[0] = (k.qcols+1)*(k.qrows+1);
			}

			for(var id=0;id<this.border.length;id++){
				if((k.isCenterLine && this.LiB(id)>0) || (!k.isCenterLine && this.QaB(id)>0)){
					this.setLcnts(id,1);
				}
			}
		}
	},

	lcntCell  : function(cc){ return this.lcnts.cell[cc];},
	lcntCross : function(cc){ return this.lcnts.cell[cc];},

	//---------------------------------------------------------------------------
	// bd.backLine()    �w�肳�ꂽID�̏㑤���������瑱������ID��Ԃ�(�����p)
	// bd.nextLine()    �w�肳�ꂽID�̉������E�����瑱������ID��Ԃ�(�����p)
	// bd.forwardLine() �w�肵��ID�̎��ɂ���ID���������ĕԂ�
	//---------------------------------------------------------------------------
	backLine : function(id){
		if(id==-1){ return -1;}
		var straight, curve1, curve2, func;
		if(k.isborderAsLine==0){
			func = this.LiB.bind(bd);
			straight = this.bnum(this.border[id].cx-(this.border[id].cy%2)*2  , this.border[id].cy-(this.border[id].cx%2)*2  );
			if(func(straight)>0){ return straight;}

			curve1   = this.bnum(this.border[id].cx-1                         , this.border[id].cy-1                         );
			curve2   = this.bnum(this.border[id].cx+(this.border[id].cx%2)*2-1, this.border[id].cy+(this.border[id].cy%2)*2-1);
		}
		else{
			func = this.QaB.bind(bd);
			straight = this.bnum(this.border[id].cx-(this.border[id].cx%2)*2  , this.border[id].cy-(this.border[id].cy%2)*2  );
			if(func(straight)>0){ return straight;}

			curve1   = this.bnum(this.border[id].cx-1                         , this.border[id].cy-1                         );
			curve2   = this.bnum(this.border[id].cx+(this.border[id].cy%2)*2-1, this.border[id].cy+(this.border[id].cx%2)*2-1);
		}

		if     (func(curve1)>0 && func(curve2)<=0){ return curve1;}
		else if(func(curve1)<=0 && func(curve2)>0){ return curve2;}
		else if(!k.isborderCross && func(curve1)>0 && func(curve2)>0){ return curve1;}
		return -1;
	},
	nextLine : function(id){
		if(id==-1){ return -1;}
		var straight, curve1, curve2, func;
		if(k.isborderAsLine==0){
			func = this.LiB.bind(bd);
			straight = this.bnum(this.border[id].cx+(this.border[id].cy%2)*2  , this.border[id].cy+(this.border[id].cx%2)*2  );
			if(func(straight)>0){ return straight;}

			curve1   = this.bnum(this.border[id].cx+1                         , this.border[id].cy+1                         );
			curve2   = this.bnum(this.border[id].cx-(this.border[id].cx%2)*2+1, this.border[id].cy-(this.border[id].cy%2)*2+1);
		}
		else{
			func = this.QaB.bind(bd);
			straight = this.bnum(this.border[id].cx+(this.border[id].cx%2)*2  , this.border[id].cy+(this.border[id].cy%2)*2  );
			if(func(straight)>0){ return straight;}

			curve1   = this.bnum(this.border[id].cx+1                         , this.border[id].cy+1                         );
			curve2   = this.bnum(this.border[id].cx-(this.border[id].cy%2)*2+1, this.border[id].cy-(this.border[id].cx%2)*2+1);
		}

		if     (func(curve1)>0 && func(curve2)<=0){ return curve1;}
		else if(func(curve1)<=0 && func(curve2)>0){ return curve2;}
		else if(!k.isborderCross && func(curve1)>0 && func(curve2)>0){ return curve1;}
		return -1;
	},
	forwardLine : function(id, backwardid){
		var retid = this.nextLine(id);
		if(retid==-1 || retid==backwardid){ retid = this.backLine(id);}
		if(retid!=backwardid){ return retid;}
		return -1;
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
		return this.border[id].cx%2==1 ? (bd.isLPdown(this.cc1(id)) || bd.isLPup(this.cc2(id))) :
										 (bd.isLPright(this.cc1(id)) || bd.isLPleft(this.cc2(id)));
	},
	isLPCombined : function(id){
		return this.border[id].cx%2==1 ? (bd.isLPdown(this.cc1(id)) && bd.isLPup(this.cc2(id))) :
										 (bd.isLPright(this.cc1(id)) && bd.isLPleft(this.cc2(id)));
	},
	isLineNG : function(id){
		return this.border[id].cx%2==1 ? (bd.isnoLPdown(this.cc1(id)) || bd.isnoLPup(this.cc2(id))) :
										 (bd.isnoLPright(this.cc1(id)) || bd.isnoLPleft(this.cc2(id)));
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

		um.addOpe('cell', 'ques', id, this.QuC(id), num);
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

		var old = this.QnC(id);
		um.addOpe('cell', 'qnum', id, old, num);
		this.cell[id].qnum = num;

		if(k.puzzleid=="lightup" && mv.paintAkari && ((old==-1)^(num==-1))){ mv.paintAkari(id);}
	},
	QnC : function(id){
		if(id<0 || this.cell.length<=id){ return -1;}
		return this.cell[id].qnum;
	},
	sQaC : function(id, num) {
		if(id<0 || this.cell.length<=id){ return;}

		var old = this.QaC(id);
		um.addOpe('cell', 'qans', id, old, num);
		this.cell[id].qans = num;

		if(k.puzzleid=="lightup" && mv.paintAkari && ((old==1)^(num==1))){ mv.paintAkari(id);}
	},
	QaC : function(id){
		if(id<0 || this.cell.length<=id){ return -1;}
		return this.cell[id].qans;
	},
	sQsC : function(id, num) {
		if(id<0 || this.cell.length<=id){ return;}

		um.addOpe('cell', 'qsub', id, this.QsC(id), num);
		this.cell[id].qsub = num;
	},
	QsC : function(id){
		if(id<0 || this.cell.length<=id){ return -1;}
		return this.cell[id].qsub;
	},
	sDiC : function(id, num) {
		if(id<0 || this.cell.length<=id){ return;}

		um.addOpe('cell', 'direc', id, this.DiC(id), num);
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

		um.addOpe('cross', 'ques', id, this.QuX(id), num);
		this.cross[id].ques = num;
	},
	QuX : function(id){
		if(id<0 || this.cross.length<=id){ return -1;}
		return this.cross[id].ques;
	},
	sQnX : function(id, num) {
		if(id<0 || this.cross.length<=id){ return;}

		um.addOpe('cross', 'qnum', id, this.QnX(id), num);
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
		if(this.border[id].ques == num){ return;}

		if(!k.isCenterLine && num!=1){ this.setLcnts(id, num);}

		um.addOpe('border', 'ques', id, this.QuB(id), num);
		this.border[id].ques = num;

		if(!k.isCenterLine && num==1){ this.setLcnts(id, num);}

		if(room.isEnable()){
			if(num==1){ room.setLineToRarea(id);}
			else{ room.removeLineFromRarea(id);}
		}
	},
	QuB : function(id){
		if(id<0 || this.border.length<=id){ return -1;}
		return this.border[id].ques;
	},
	sQnB : function(id, num) {
		if(id<0 || this.border.length<=id){ return;}
		if(this.border[id].qnum == num){ return;}

		um.addOpe('border', 'qnum', id, this.QnB(id), num);
		this.border[id].qnum = num;
	},
	QnB : function(id){
		if(id<0 || this.border.length<=id){ return -1;}
		return this.border[id].qnum;
	},
	sQaB : function(id, num) {
		if(id<0 || this.border.length<=id){ return;}
		if(this.border[id].qans == num){ return;}
		var old = this.border[id].qans;

		um.addOpe('border', 'qans', id, old, num);
		this.border[id].qans = num;

		if     (num>0 && old<=0){
			if(!k.isCenterLine)                 { this.setLcnts(id, num);    }
			if(k.irowake!=0 && k.isborderAsLine){ col.setLineColor(id, num);}
		}
		else if(num<=0 && old>0){
			if(k.irowake!=0 && k.isborderAsLine){ col.setLineColor(id, num);}
			if(!k.isCenterLine)                 { this.setLcnts(id, num);    }
		}
	},
	QaB : function(id){
		if(id<0 || this.border.length<=id){ return -1;}
		return this.border[id].qans;
	},
	sQsB : function(id, num) {
		if(id<0 || this.border.length<=id){ return;}
		if(this.border[id].qsub == num){ return;}

		um.addOpe('border', 'qsub', id, this.QsB(id), num);
		this.border[id].qsub = num;
	},
	QsB : function(id){
		if(id<0 || this.border.length<=id){ return -1;}
		return this.border[id].qsub;
	},
	sLiB : function(id, num) {
		if(id<0 || this.border.length<=id){ return;}
		if(this.border[id].line == num){ return;}
		if((num==1 && bd.isLineNG(id))||(num!=1 && bd.isLPCombined(id))){ return;}
		var old = this.LiB(id);

		um.addOpe('border', 'line', id, old, num);
		this.border[id].line = num;

		if     (num>0 && old<=0){
			if(k.isCenterLine){ this.setLcnts(id, num);    }
			if(k.irowake!=0)  { col.setLineColor(id, num);}
		}
		else if(num<=0 && old>0){
			if(k.irowake!=0)  { col.setLineColor(id, num);}
			if(k.isCenterLine){ this.setLcnts(id, num);    }
		}
	},
	LiB : function(id){
		if(id<0 || this.border.length<=id){ return -1;}
		return this.border[id].line;
	},

	//---------------------------------------------------------------------------
	// sErC / ErC : bd.setErrorCell()   / bd.getErrorCell()   �Y������Cell��line��ݒ肷��/�Ԃ�
	// sErX / ErX : bd.setErrorCross()  / bd.getErrorCross()  �Y������Cross��line��ݒ肷��/�Ԃ�
	// sErB / ErB : bd.setErrorBorder() / bd.getErrorBorder() �Y������Border��line��ݒ肷��/�Ԃ�
	// sErE / ErE : bd.setErrorEXcell() / bd.getErrorEXcell() �Y������EXcell��line��ݒ肷��/�Ԃ�
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
	}
};
