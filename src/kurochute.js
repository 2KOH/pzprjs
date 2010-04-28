//
// �p�Y���ŗL�X�N���v�g�� �N���V���[�g�� kurochute.js v3.3.0
//
Puzzles.kurochute = function(){ };
Puzzles.kurochute.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 8;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 8;}	// �Ֆʂ̏c��
		k.irowake  = 0;		// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross  = 0;		// 1:�Ֆʓ�����Cross������p�Y�� 2:�O�g����܂߂�Cross������p�Y��
		k.isborder = 0;		// 1:Border/Line������\�ȃp�Y�� 2:�O�g�������\�ȃp�Y��
		k.isexcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isLineCross     = false;	// ������������p�Y��
		k.isCenterLine    = false;	// �}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = false;	// ���E����line�Ƃ��Ĉ���
		k.hasroom         = false;	// �������̗̈�ɕ�����Ă���/������p�Y��
		k.roomNumber      = false;	// �����̖��̐�����1��������p�Y��

		k.dispzero        = false;	// 0��\�����邩�ǂ���
		k.isDispHatena    = true;	// qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber     = false;	// �񓚂ɐ�������͂���p�Y��
		k.NumberWithMB    = false;	// �񓚂̐����Ɓ��~������p�Y��
		k.linkNumber      = false;	// �������ЂƂȂ���ɂȂ�p�Y��

		k.BlackCell       = true;	// ���}�X����͂���p�Y��
		k.NumberIsWhite   = true;	// �����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell     = true;	// �A�����f�ւ̃p�Y��
		k.checkBlackCell  = false;	// ��������ō��}�X�̏����`�F�b�N����p�Y��
		k.checkWhiteCell  = true;	// ��������Ŕ��}�X�̏����`�F�b�N����p�Y��

		k.ispzprv3ONLY    = true;	// �ς��Ղ�A�v���b�g�ɂ͑��݂��Ȃ��p�Y��
		k.isKanpenExist   = true;	// pencilbox/�J���y���ɂ���p�Y��

		base.setTitle("�N���V���[�g","Kurochute");
		base.setExpression("�@���N���b�N�ō��}�X���A�E�N���b�N�Ŕ��}�X�m��}�X�����͂ł��܂��B",
						   " Left Click to input black cells, Right Click to input determined white cells.");
		base.setFloatbgcolor("rgb(96, 96, 96)");

		enc.pidKanpen = 'kurochute';
	},
	menufix : function(){
		menu.addUseToFlags();
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if     (k.editmode) this.inputqnum();
			else if(k.playmode) this.inputcell();
		};
		mv.mouseup = function(){
			if(k.playmode && this.notInputted()) this.inputqsub();
		};
		mv.mousemove = function(){
			if(k.playmode) this.inputcell();
		};
		mv.inputqsub = function(){
			var cc = this.cellid();
			if(cc==-1){ return;}

			if     (bd.QsC(cc)==0){ bd.sQsC(cc,2);}
			else if(bd.QsC(cc)==2){ bd.sQsC(cc,0);}
			pc.paintCell(cc);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.playmode){ return;}
			if(this.key_inputdirec(ca)){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca);
		};

		bd.nummaxfunc = function(cc){ return Math.max(k.qcols,k.qrows)-1;};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_LIGHT;
		pc.qsubcolor2 = pc.bcolor_GREEN;

		pc.paint = function(x1,y1,x2,y2){
			this.drawBGCells(x1,y1,x2,y2);
			this.drawRDotCells(x1,y1,x2,y2);
			this.drawGrid(x1,y1,x2,y2);
			this.drawBlackCells(x1,y1,x2,y2);

			this.drawNumbers(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawTarget(x1,y1,x2,y2);
		};

		// �I�[�o�[���C�h drawBGCells�p (qsub==1�͕\�����Ȃ�..)
		pc.setBGCellColor = function(cc){
			var cell = bd.cell[cc];
			if     (cell.error===1){ g.fillStyle = this.errbcolor1; return true;}
			else if(cell.qsub ===2){ g.fillStyle = this.qsubcolor2; return true;}
			return false;
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type){
			this.decodeNumber16();
		};
		enc.pzlexport = function(type){
			this.encodeNumber16();
		};

		enc.decodeKanpen = function(){
			fio.decodeCellQnum_kanpen();
		};
		enc.encodeKanpen = function(){
			fio.encodeCellQnum_kanpen();
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			this.decodeCellQnum();
			this.decodeCellQanssub();
		};
		fio.encodeData = function(){
			this.encodeCellQnum();
			this.encodeCellQanssub();
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkSideCell(function(c1,c2){ return (bd.isBlack(c1) && bd.isBlack(c2));}) ){
				this.setAlert('���}�X���^�e���R�ɘA�����Ă��܂��B','Black cells are adjacent.'); return false;
			}

			if( !this.checkOneArea( area.getWCellInfo() ) ){
				this.setAlert('���}�X�����f����Ă��܂��B','White cells are devided.'); return false;
			}

			if( !this.checkCellNumber() ){
				this.setAlert('�����̐��������ꂽ�}�X�̂����A1�}�X�������}�X�ɂȂ��Ă��܂���B','The number of black cells at aparted cell by the number is not one.'); return false;
			}

			return true;
		};
		ans.check1st = function(){ return true;};

		ans.checkCellNumber = function(){
			var result = true;

			for(var c=0;c<bd.cellmax;c++){
				if(bd.QnC(c)<0){ continue;}
				var bx=bd.cell[c].bx, by=bd.cell[c].by, num=bd.QnC(c), clist=[];
				if(bd.isBlack(bd.cnum(bx-num*2,by))){ clist.push(bd.cnum(bx-num*2,by));}
				if(bd.isBlack(bd.cnum(bx+num*2,by))){ clist.push(bd.cnum(bx+num*2,by));}
				if(bd.isBlack(bd.cnum(bx,by-num*2))){ clist.push(bd.cnum(bx,by-num*2));}
				if(bd.isBlack(bd.cnum(bx,by+num*2))){ clist.push(bd.cnum(bx,by+num*2));}
				if(clist.length!==1){
					if(this.inAutoCheck){ return false;}
					bd.sErC([c],4);
					bd.sErC(clist,1);
					result = false;
				}
			}
			return result;
		};
	}
};
