// Board.js v3.1.9p2

//---------------------------------------------------------------------------
// ��Cell�N���X Board�N���X��Cell�̐������ێ�����
//---------------------------------------------------------------------------
// �{�[�h�����o�f�[�^�̒�`(1)
// Cell�N���X�̒�`
Cell = function(){
	this.cx;	// �Z����X���W��ێ�����
	this.cy;	// �Z����Y���W��ێ�����
	this.ques;	// �Z���̖��f�[�^(�`��)��ێ�����
	this.qnum;	// �Z���̖��f�[�^(����)��ێ�����
	this.direc;	// �㉺���E�̕���
	this.qans;	// �Z���̉񓚃f�[�^��ێ�����
	this.qsub;	// �Z���̕⏕�f�[�^��ێ�����(��qlight)
	//this.rarea;	// ������ID�f�[�^��ێ�����(������1���������A�̎��g��)
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
		this.qans = -1;
		this.qsub = 0;
		this.ques = 0;
		this.qnum = -1;
		if(k.puzzleid=="tilepaint"||k.puzzleid=="kakuro"){ this.qnum = 0;}
		this.direc = 0;
		if(k.puzzleid=="triplace"){ this.direc = -1;}
		//this.rarea = -1;
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
	},
	//---------------------------------------------------------------------------
	// cell.px() cell.py() �Z���̍���A�E���Canvas�̍��W��Ԃ�
	//---------------------------------------------------------------------------
	px : function() { return k.p0.x+this.cx*k.cwidth;},
	py : function() { return k.p0.y+this.cy*k.cheight;},
	//---------------------------------------------------------------------------
	// cell.up() cell.dn() cell.lt() cell.rt()
	//   ���̃Z���ɏ㉺���E�ŗאڂ��Ă���Z����ID��Ԃ�(���ݖ����̏ꍇ��-1)
	//---------------------------------------------------------------------------
	up : function() { return bd.getcnum(this.cx, this.cy-1);},	//��̃Z����ID�����߂�
	dn : function() { return bd.getcnum(this.cx, this.cy+1);},	//���̃Z����ID�����߂�
	lt : function() { return bd.getcnum(this.cx-1, this.cy);},	//���̃Z����ID�����߂�
	rt : function() { return bd.getcnum(this.cx+1, this.cy);},	//�E�̃Z����ID�����߂�
	//---------------------------------------------------------------------------
	// cell.ub() cell.db() cell.lb() cell.rb()
	//   ���̃Z���ɏ㉺���E�ŗאڂ��Ă��鋫�E��/�㉺���E�ɐL�т����ID��Ԃ�(���ݖ����̏ꍇ��-1)
	//---------------------------------------------------------------------------
	ub : function() { return bd.getbnum(this.cx*2+1, this.cy*2  );},	//�Z���̏�̋��E����ID�����߂�
	db : function() { return bd.getbnum(this.cx*2+1, this.cy*2+2);},	//�Z���̉��̋��E����ID�����߂�
	lb : function() { return bd.getbnum(this.cx*2  , this.cy*2+1);},	//�Z���̍��̋��E����ID�����߂�
	rb : function() { return bd.getbnum(this.cx*2+2, this.cy*2+1);}		//�Z���̉E�̋��E����ID�����߂�
};

//---------------------------------------------------------------------------
// ��Cross�N���X Board�N���X��Cross�̐������ێ�����(iscross==1�̎�)
//---------------------------------------------------------------------------
// �{�[�h�����o�f�[�^�̒�`(2)
// Cross�N���X�̒�`
Cross = function(){
	this.cx;	// �Z����X���W��ێ�����
	this.cy;	// �Z����Y���W��ێ�����
	this.ques;	// �Z���̖��f�[�^��ێ�����
	this.qnum;	// �Z���̖��f�[�^(����)��ێ�����
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
	},
	//---------------------------------------------------------------------------
	// cross.px() cell.py() �����_�̒��S�̍��W��Ԃ�
	//---------------------------------------------------------------------------
	px : function() { return k.p0.x+this.cx*k.cwidth;},
	py : function() { return k.p0.y+this.cy*k.cheight;}
};

//---------------------------------------------------------------------------
// ��Border�N���X Board�N���X��Border�̐������ێ�����(isborder==1�̎�)
//---------------------------------------------------------------------------
// �{�[�h�����o�f�[�^�̒�`(3)
// Border�N���X�̒�`
Border = function(){
	this.cx;	// ���E����X���W��ێ�����
	this.cy;	// ���E����Y���W��ێ�����
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
	},
	//---------------------------------------------------------------------------
	// cross.px() cell.py() ���E���̒��S�̍��W��Ԃ�
	//---------------------------------------------------------------------------
	px : function() { return k.p0.x+int(this.cx*k.cwidth/2);},
	py : function() { return k.p0.y+int(this.cy*k.cheight/2);}
};

//---------------------------------------------------------------------------
// ��Board�N���X �Ֆʂ̏���ێ�����BCell, Cross, Border�̃I�u�W�F�N�g���ێ�����
//---------------------------------------------------------------------------
// Board�N���X�̒�`
Board = function(){
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
			for(var i=0;i<(k.qcols*(k.qrows-1)+(k.qcols-1)*k.qrows+(k.isoutsideborder==0?0:2*(k.qcols+k.qrows)));i++){
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

		ans.reset();
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
	// bd.setposAll()    �S�Ă�Cell, Cross, Border�I�u�W�F�N�g��setposCell()�����Ăяo��
	// bd.setposCell()   �Y������id�̃Z����cx,cy�v���p�e�B��ݒ肷��
	// bd.setposCross()  �Y������id�̌����_��cx,cy�v���p�e�B��ݒ肷��
	// bd.setposBorder() �Y������id�̋��E��/Line��cx,cy�v���p�e�B��ݒ肷��
	// bd.setposEXCell() �Y������id��Extend�Z����cx,cy�v���p�e�B��ݒ肷��
	//---------------------------------------------------------------------------
	// setpos�֘A�֐� <- �eCell���������Ă���ƃ������������������̂ł����ɒu������.
	setposAll : function(){
		for(var i=0;i<this.cell.length;i++){ this.setposCell(i);}
		if(k.iscross ){ for(var i=0;i<this.cross.length ;i++){ this.setposCross(i); } }
		if(k.isborder){ for(var i=0;i<this.border.length;i++){ this.setposBorder(i);} }
		if(k.isextendcell!=0){ for(var i=0;i<this.excell.length;i++){ this.setposEXcell(i);} }
	},
	setposCell : function(id){
		this.cell[id].cx = id%k.qcols;
		this.cell[id].cy = int(id/k.qcols);
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
	// bd.getcnum()   (X,Y)�̈ʒu�ɂ���Cell��ID��Ԃ�
	// bd.getcnum2()  (X,Y)�̈ʒu�ɂ���Cell��ID���A�Ֆʂ̑傫����(qc�~qr)�Ōv�Z���ĕԂ�
	// bd.getxnum()   (X,Y)�̈ʒu�ɂ���Cross��ID��Ԃ�
	// bd.getxnum2()  (X,Y)�̈ʒu�ɂ���Cross��ID���A�Ֆʂ̑傫����(qc�~qr)�Ōv�Z���ĕԂ�
	// bd.getbnum()   (X*2,Y*2)�̈ʒu�ɂ���Border��ID��Ԃ�
	// bd.getbnum2()  (X*2,Y*2)�̈ʒu�ɂ���Border��ID���A�Ֆʂ̑傫����(qc�~qr)�Ōv�Z���ĕԂ�
	// bd.getexnum()  (X,Y)�̈ʒu�ɂ���extendCell��ID��Ԃ�
	// bd.getexnum2() (X,Y)�̈ʒu�ɂ���extendCell��ID���A�Ֆʂ̑傫����(qc�~qr)�Ōv�Z���ĕԂ�
	//---------------------------------------------------------------------------
	getcnum : function(cx,cy){
		if(cx>=0&&cx<=k.qcols-1&&cy>=0&&cy<=k.qrows-1){ return cx+cy*k.qcols;}
		return -1;
	},
	getcnum2 : function(cx,cy,qc,qr){
		if(cx>=0&&cx<=qc-1&&cy>=0&&cy<=qr-1){ return cx+cy*qc;}
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
		else if(k.isoutsideborder==1){
			if     (cy==0   &&cx%2==1&&(cx>=1&&cx<=2*qc-1)){ return (qc-1)*qr+qc*(qr-1)+int((cx-1)/2);}
			else if(cy==2*qr&&cx%2==1&&(cx>=1&&cx<=2*qc-1)){ return (qc-1)*qr+qc*(qr-1)+qc+int((cx-1)/2);}
			else if(cx==0   &&cy%2==1&&(cy>=1&&cy<=2*qr-1)){ return (qc-1)*qr+qc*(qr-1)+2*qc+int((cy-1)/2);}
			else if(cx==2*qc&&cy%2==1&&(cy>=1&&cy<=2*qr-1)){ return (qc-1)*qr+qc*(qr-1)+2*qc+qr+int((cy-1)/2);}
		}
		return -1;
	},
	getexnum : function(cx,cy){
		return this.getexnum2(cx,cy,k.qcols,k.qrows);
	},
	getexnum2 : function(cx,cy,qc,qr){
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
	// bd.getcc1()      ���E���̂����ォ�������ɂ���Z����ID��Ԃ�
	// bd.getcc2()      ���E���̂������������E�ɂ���Z����ID��Ԃ�
	// bd.getcrosscc1() ���E���̂����ォ�������ɂ�������_��ID��Ԃ�
	// bd.getcrosscc2() ���E���̂������������E�ɂ�������_��ID��Ԃ�
	//---------------------------------------------------------------------------
	getcc1 : function(id){
		return this.getcnum(int((bd.border[id].cx-(bd.border[id].cy%2))/2), int((bd.border[id].cy-(bd.border[id].cx%2))/2) );
	},
	getcc2 : function(id){
		return this.getcnum(int((bd.border[id].cx+(bd.border[id].cy%2))/2), int((bd.border[id].cy+(bd.border[id].cx%2))/2) );
	},
	getcrosscc1 : function(id){
		return bd.getxnum(int((bd.border[id].cx-(bd.border[id].cx%2))/2), int((bd.border[id].cy-(bd.border[id].cy%2))/2) );
	},
	getcrosscc2 : function(id){
		return bd.getxnum(int((bd.border[id].cx+(bd.border[id].cx%2))/2), int((bd.border[id].cy+(bd.border[id].cy%2))/2) );
	},

	//---------------------------------------------------------------------------
	// bd.bcntCross() �w�肳�ꂽ�ʒu��Cross�̎���4�}�X�̂���qans==1�̃}�X�̐������߂�
	//---------------------------------------------------------------------------
	bcntCross : function(cx,cy) {
		var cnt = 0;
		if(this.getQansCell(this.getcnum(cx-1, cy-1))==1){ cnt++;}
		if(this.getQansCell(this.getcnum(cx  , cy-1))==1){ cnt++;}
		if(this.getQansCell(this.getcnum(cx-1, cy  ))==1){ cnt++;}
		if(this.getQansCell(this.getcnum(cx  , cy  ))==1){ cnt++;}
		return cnt;
	},

	//---------------------------------------------------------------------------
	// bd.lcntCell()  �w�肳�ꂽ�ʒu��Cell�̏㉺���E�̂�������������Ă���(line==1��)�������߂�
	// bd.lcntCross() �w�肳�ꂽ�ʒu��Cross�̏㉺���E�̂������E����������Ă���(ques==1 or qans==1��)�������߂�
	//---------------------------------------------------------------------------
	lcntCell : function(cx,cy){
		var cc = this.getcnum(cx,cy);
		if(cc==-1){ return 0;}

		var cnt = 0;
		if(this.getLineBorder(this.cell[cc].ub())>0){ cnt++;}
		if(this.getLineBorder(this.cell[cc].db())>0){ cnt++;}
		if(this.getLineBorder(this.cell[cc].lb())>0){ cnt++;}
		if(this.getLineBorder(this.cell[cc].rb())>0){ cnt++;}
		return cnt;
	},
	lcntCross : function(cx,cy){
		var self = this;
		var func = function(id){ return (id!=-1&&((self.getQuesBorder(id)==1)||(self.getQansBorder(id)==1)));};
		var cnt = 0;
		if(cy>0       && ( (k.isoutsideborder==0 && (cx==0 || cx==k.qcols)) || func(this.getbnum(cx*2  ,cy*2-1)) ) ){ cnt++;}
		if(cy<k.qrows && ( (k.isoutsideborder==0 && (cx==0 || cx==k.qcols)) || func(this.getbnum(cx*2  ,cy*2+1)) ) ){ cnt++;}
		if(cx>0       && ( (k.isoutsideborder==0 && (cy==0 || cy==k.qrows)) || func(this.getbnum(cx*2-1,cy*2  )) ) ){ cnt++;}
		if(cx<k.qcols && ( (k.isoutsideborder==0 && (cy==0 || cy==k.qrows)) || func(this.getbnum(cx*2+1,cy*2  )) ) ){ cnt++;}
		return cnt;
	},

	//---------------------------------------------------------------------------
	// bd.backLine()    �w�肳�ꂽID�̏㑤���������瑱������ID��Ԃ�(�����p)
	// bd.nextLine()    �w�肳�ꂽID�̉������E�����瑱������ID��Ԃ�(�����p)
	// bd.forwardLine() �w�肵��ID�̎��ɂ���ID���������ĕԂ�
	//---------------------------------------------------------------------------
	backLine : function(id){
		if(id==-1){ return -1;}
		var straight, curve1, curve2, func;
		if(k.isborderAsLine==0){
			func = this.getLineBorder.bind(bd);
			straight = this.getbnum(this.border[id].cx-(this.border[id].cy%2)*2  , this.border[id].cy-(this.border[id].cx%2)*2  );
			if(func(straight)>0){ return straight;}

			curve1   = this.getbnum(this.border[id].cx-1                         , this.border[id].cy-1                         );
			curve2   = this.getbnum(this.border[id].cx+(this.border[id].cx%2)*2-1, this.border[id].cy+(this.border[id].cy%2)*2-1);
		}
		else{
			func = this.getQansBorder.bind(bd);
			straight = this.getbnum(this.border[id].cx-(this.border[id].cx%2)*2  , this.border[id].cy-(this.border[id].cy%2)*2  );
			if(func(straight)>0){ return straight;}

			curve1   = this.getbnum(this.border[id].cx-1                         , this.border[id].cy-1                         );
			curve2   = this.getbnum(this.border[id].cx+(this.border[id].cy%2)*2-1, this.border[id].cy+(this.border[id].cx%2)*2-1);
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
			func = this.getLineBorder.bind(bd);
			straight = this.getbnum(this.border[id].cx+(this.border[id].cy%2)*2  , this.border[id].cy+(this.border[id].cx%2)*2  );
			if(func(straight)>0){ return straight;}

			curve1   = this.getbnum(this.border[id].cx+1                         , this.border[id].cy+1                         );
			curve2   = this.getbnum(this.border[id].cx-(this.border[id].cx%2)*2+1, this.border[id].cy-(this.border[id].cy%2)*2+1);
		}
		else{
			func = this.getQansBorder.bind(bd);
			straight = this.getbnum(this.border[id].cx+(this.border[id].cx%2)*2  , this.border[id].cy+(this.border[id].cy%2)*2  );
			if(func(straight)>0){ return straight;}

			curve1   = this.getbnum(this.border[id].cx+1                         , this.border[id].cy+1                         );
			curve2   = this.getbnum(this.border[id].cx-(this.border[id].cy%2)*2+1, this.border[id].cy-(this.border[id].cx%2)*2+1);
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
	isLPup    : function(cc){ var qs = bd.getQuesCell(cc); return (qs==101||qs==102||qs==104||qs==105);},
	isLPdown  : function(cc){ var qs = bd.getQuesCell(cc); return (qs==101||qs==102||qs==106||qs==107);},
	isLPleft  : function(cc){ var qs = bd.getQuesCell(cc); return (qs==101||qs==103||qs==105||qs==106);},
	isLPright : function(cc){ var qs = bd.getQuesCell(cc); return (qs==101||qs==103||qs==104||qs==107);},
	isnoLPup    : function(cc){ var qs = bd.getQuesCell(cc); return (qs==1||qs==4||qs==5||qs==21||qs==103||qs==106||qs==107);},
	isnoLPdown  : function(cc){ var qs = bd.getQuesCell(cc); return (qs==1||qs==2||qs==3||qs==21||qs==103||qs==104||qs==105);},
	isnoLPleft  : function(cc){ var qs = bd.getQuesCell(cc); return (qs==1||qs==2||qs==5||qs==22||qs==102||qs==104||qs==107);},
	isnoLPright : function(cc){ var qs = bd.getQuesCell(cc); return (qs==1||qs==3||qs==4||qs==22||qs==102||qs==105||qs==106);},
	//---------------------------------------------------------------------------
	// bd.isLPMarked()      Line�̂ǂ��炩����LineParts�����݂��Ă��邩�ǂ������肷��
	// bd.isLPCombined()    Line��2�����Ƃ�LineParts�����݂��Ă��邩�ǂ������肷��
	// bd.isLineNG()        Line�̂ǂ��炩���A���������Ȃ��悤�ɂȂ��Ă��邩���肷��
	// bd.isLP()            ���3�̋��ʊ֐�
	// bd.checkLPCombined() �����Ȃ����Ă��邩�ǂ������āALine==1��ݒ肷��
	//---------------------------------------------------------------------------
	isLPMarked : function(id){
		return  this.isLP(id, function(cc1,cc2){ return (bd.isLPdown(cc1)||bd.isLPup(cc2));}    , function(cc1,cc2){ return (bd.isLPright(cc1)||bd.isLPleft(cc2));}    );
	},
	isLPCombined : function(id){
		return  this.isLP(id, function(cc1,cc2){ return (bd.isLPdown(cc1)&&bd.isLPup(cc2));}    , function(cc1,cc2){ return (bd.isLPright(cc1)&&bd.isLPleft(cc2));}    );
	},
	isLineNG : function(id){
		return !this.isLP(id, function(cc1,cc2){ return (bd.isnoLPdown(cc1)||bd.isnoLPup(cc2));}, function(cc1,cc2){ return (bd.isnoLPright(cc1)||bd.isnoLPleft(cc2));});
	},
	isLP : function(id,funcUD,funcLR){
		var cc1 = bd.getcc1(id), cc2 = bd.getcc2(id);
		if(cc1==-1||cc2==-1){ return false;}

		var val1 = bd.getQuesCell(cc1);
		var val2 = bd.getQuesCell(cc2);
		if     (bd.border[id].cx%2==1){ if(funcUD(cc1,cc2)){ return true;} } // �㉺�֌W
		else if(bd.border[id].cy%2==1){ if(funcLR(cc1,cc2)){ return true;} } // ���E�֌W
		return false;
	},
	checkLPCombined : function(cc){
		var id;
		id = this.cell[cc].ub(); if(id!=-1 && this.getLineBorder(id)==0 && this.isLPCombined(id)){ this.setLineBorder(id,1);}
		id = this.cell[cc].db(); if(id!=-1 && this.getLineBorder(id)==0 && this.isLPCombined(id)){ this.setLineBorder(id,1);}
		id = this.cell[cc].lb(); if(id!=-1 && this.getLineBorder(id)==0 && this.isLPCombined(id)){ this.setLineBorder(id,1);}
		id = this.cell[cc].rb(); if(id!=-1 && this.getLineBorder(id)==0 && this.isLPCombined(id)){ this.setLineBorder(id,1);}
	},

	//---------------------------------------------------------------------------
	// bd.setQuesCell() / bd.getQuesCell()  �Y������Cell��ques��ݒ肷��/�Ԃ�
	// bd.setQnumCell() / bd.getQnumCell()  �Y������Cell��qnum��ݒ肷��/�Ԃ�
	// bd.setQsubCell() / bd.getQsubCell()  �Y������Cell��qsub��ݒ肷��/�Ԃ�
	// bd.setQansCell() / bd.getQansCell()  �Y������Cell��qans��ݒ肷��/�Ԃ�
	// bd.setDirecCell()/ bd.getDirecCell() �Y������Cell��direc��ݒ肷��/�Ԃ�
	//---------------------------------------------------------------------------
	// Cell�֘AGet/Set�֐� <- �eCell�������Ă���ƃ������������������̂ł����ɒu������.
	setQuesCell : function(id, num) {
		if(id<0 || this.cell.length<=id){ return;}

		um.addOpe('cell', 'ques', id, this.getQuesCell(id), num);
		this.cell[id].ques = num;

		if(k.puzzleid=="pipelink"||k.puzzleid=="loopsp"){ this.checkLPCombined(id);}
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
	setDirecCell : function(id, num) {
		if(id<0 || this.cell.length<=id){ return;}

		um.addOpe('cell', 'direc', id, this.getDirecCell(id), num);
		this.cell[id].direc = num;
	},
	getDirecCell : function(id){
		if(id<0 || this.cell.length<=id){ return -1;}
		return this.cell[id].direc;
	},
	//---------------------------------------------------------------------------
	// bd.setQnumEXcell() / bd.getQnumEXcell()  �Y������EXCell��qnum��ݒ肷��/�Ԃ�
	// bd.setDirecEXcell()/ bd.getDirecEXcell() �Y������EXCell��direc��ݒ肷��/�Ԃ�
	//---------------------------------------------------------------------------
	// EXcell�֘AGet/Set�֐�
	setQnumEXcell : function(id, num) {
		if(id<0 || this.excell.length<=id){ return;}
		um.addOpe('excell', 'qnum', id, this.excell[id].qnum, num);
		this.excell[id].qnum = num;
	},
	getQnumEXcell : function(id){
		if(id<0 || this.excell.length<=id){ return -1;}
		return this.excell[id].qnum;
	},
	setDirecEXcell : function(id, num) {
		if(id<0 || this.excell.length<=id){ return;}
		um.addOpe('excell', 'direc', id, this.excell[id].direc, num);
		this.excell[id].direc = num;
	},
	getDirecEXcell : function(id){
		if(id<0 || this.excell.length<=id){ return -1;}
		return this.excell[id].direc;
	},

	//---------------------------------------------------------------------------
	// bd.setQuesCross(id,num) / bd.getQuesCross() �Y������Cross��ques��ݒ肷��/�Ԃ�
	// bd.setQnumCross(id,num) / bd.getQnumCross() �Y������Cross��qnum��ݒ肷��/�Ԃ�
	//---------------------------------------------------------------------------
	// Cross�֘AGet/Set�֐� <- �eCross�������Ă���ƃ������������������̂ł����ɒu������.
	setQuesCross : function(id, num) {
		if(!k.iscross || id<0 || this.cross.length<=id){ return;}

		um.addOpe('cross', 'ques', id, this.getQuesCross(id), num);
		this.cross[id].ques = num;
	},
	getQuesCross : function(id){
		if(!k.iscross || id<0 || this.cross.length<=id){ return -1;}
		return this.cross[id].ques;
	},
	setQnumCross : function(id, num) {
		if(!k.iscross || id<0 || this.cross.length<=id){ return;}

		um.addOpe('cross', 'qnum', id, this.getQnumCross(id), num);
		this.cross[id].qnum = num;
	},
	getQnumCross : function(id){
		if(!k.iscross || id<0 || this.cross.length<=id){ return -1;}
		return this.cross[id].qnum;
	},

	//---------------------------------------------------------------------------
	// bd.setQuesBorder() / bd.getQuesBorder() �Y������Border��ques��ݒ肷��/�Ԃ�
	// bd.setQnumBorder() / bd.getQnumBorder() �Y������Border��qnum��ݒ肷��/�Ԃ�
	// bd.setQansBorder() / bd.getQansBorder() �Y������Border��qans��ݒ肷��/�Ԃ�
	// bd.setQsubBorder() / bd.getQsubBorder() �Y������Border��qsub��ݒ肷��/�Ԃ�
	// bd.setLineBorder() / bd.getLineBorder() �Y������Border��line��ݒ肷��/�Ԃ�
	//---------------------------------------------------------------------------
	// Border�֘AGet/Set�֐� <- �eBorder�������Ă���ƃ������������������̂ł����ɒu������.
	setQuesBorder : function(id, num) {
		if(!k.isborder || id<0 || this.border.length<=id){ return;}
		if(this.border[id].ques == num){ return;}

		if(!k.isCenterLine && num!=1){ ans.setLcnts(id, num);}

		um.addOpe('border', 'ques', id, this.getQuesBorder(id), num);
		this.border[id].ques = num;

		if(!k.isCenterLine && num==1){ ans.setLcnts(id, num);}

		if(room.isEnable()){
			if(num==1){ room.setLineToRarea(id);}
			else{ room.removeLineFromRarea(id);}
		}
	},
	getQuesBorder : function(id){
		if(!k.isborder || id<0 || this.border.length<=id){ return -1;}
		return this.border[id].ques;
	},
	setQnumBorder : function(id, num) {
		if(!k.isborder || id<0 || this.border.length<=id){ return;}
		if(this.border[id].qnum == num){ return;}

		um.addOpe('border', 'qnum', id, this.getQnumBorder(id), num);
		this.border[id].qnum = num;
	},
	getQnumBorder : function(id){
		if(!k.isborder || id<0 || this.border.length<=id){ return -1;}
		return this.border[id].qnum;
	},
	setQansBorder : function(id, num) {
		if(!k.isborder || id<0 || this.border.length<=id){ return;}
		if(this.border[id].qans == num){ return;}
		var old = this.border[id].qans;

		if(k.irowake!=0 && k.isborderAsLine && old>0 && num<=0){ col.setLineColor(id, num);}
		if(!k.isCenterLine && num!=1){ ans.setLcnts(id, num);}

		um.addOpe('border', 'qans', id, old, num);
		this.border[id].qans = num;

		if(k.irowake!=0 && k.isborderAsLine && old<=0 && num>0){ col.setLineColor(id, num);}
		if(!k.isCenterLine && num==1){ ans.setLcnts(id, num);}
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
		if((num==1 && !bd.isLineNG(id))||(num!=1 && bd.isLPCombined(id))){ return;}
		if(num==1 && k.puzzleid=="barns" && bd.getQuesBorder(id)==1){ return;}
		var old = this.getLineBorder(id);

		if(k.irowake!=0 && old>0 && num<=0){ col.setLineColor(id, num);}
		if(k.isCenterLine && old>0 && num<=0){ ans.setLcnts(id, num);}

		um.addOpe('border', 'line', id, old, num);
		this.border[id].line = num;

		if(k.irowake!=0 && old<=0 && num>0){ col.setLineColor(id, num);}
		if(k.isCenterLine && old<=0 && num>0){ ans.setLcnts(id, num);}
	},
	getLineBorder : function(id){
		if(!k.isborder || id<0 || this.border.length<=id){ return -1;}
		return this.border[id].line;
	},

	//---------------------------------------------------------------------------
	// bd.setErrorCell()   / bd.setErrorCell()   �Y������Cell��line��ݒ肷��/�Ԃ�
	// bd.setErrorCross()  / bd.setErrorCross()  �Y������Cross��line��ݒ肷��/�Ԃ�
	// bd.setErrorBorder() / bd.setErrorBorder() �Y������Border��line��ݒ肷��/�Ԃ�
	// bd.setErrorEXcell() / bd.setErrorEXcell() �Y������EXcell��line��ݒ肷��/�Ԃ�
	//---------------------------------------------------------------------------
	// Get/SetError�֐�(set�͔z��œ���)
	setErrorCell : function(idlist, num) {
		if(!ans.isenableSetError()){ return;}
		if(!idlist.push){ idlist = [idlist];}
		for(var i=0;i<idlist.length;i++){ if(idlist[i]>=0 && this.cell.length>idlist[i]){ this.cell[idlist[i]].error = num;} }
	},
	getErrorCell : function(id){
		if(id<0 || this.cell.length<=id){ return 0;}
		return this.cell[id].error;
	},
	setErrorCross : function(idlist, num) {
		if(!k.iscross || !ans.isenableSetError()){ return;}
		if(!idlist.push){ idlist = [idlist];}
		for(var i=0;i<idlist.length;i++){ if(idlist[i]>=0 && this.cross.length>idlist[i]){ this.cross[idlist[i]].error = num;} }
	},
	getErrorCross : function(id){
		if(!k.iscross || id<0 || this.cross.length<=id){ return 0;}
		return this.cross[id].error;
	},
	setErrorBorder : function(idlist, num) {
		if(!k.isborder || !ans.isenableSetError()){ return;}
		if(!idlist.push){ idlist = [idlist];}
		for(var i=0;i<idlist.length;i++){ if(idlist[i]>=0 && this.border.length>idlist[i]){ this.border[idlist[i]].error = num;} }
	},
	getErrorBorder : function(id){
		if(!k.isborder || id<0 || this.border.length<=id){ return 0;}
		return this.border[id].error;
	},
	setErrorEXcell : function(idlist, num) {
		if(!ans.isenableSetError()){ return;}
		if(!idlist.push){ idlist = [idlist];}
		for(var i=0;i<idlist.length;i++){ if(idlist[i]>=0 && this.excell.length>idlist[i]){ this.excell[idlist[i]].error = num;} }
	},
	getErrorEXcell : function(id){
		if(id<0 || this.excell.length<=id){ return 0;}
		return this.excell[id].error;
	}
};
