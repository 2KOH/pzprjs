//
// �p�Y���ŗL�X�N���v�g�� �ʂ�ڂ��� nuribou.js v3.3.0
//
Puzzles.nuribou = function(){ };
Puzzles.nuribou.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
		k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 0;		// 1:Border/Line������\�ȃp�Y��
		k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
		k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
		k.isLineCross     = 0;	// 1:������������p�Y��
		k.isCenterLine    = 0;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

		k.dispzero      = 0;	// 1:0��\�����邩�ǂ���
		k.isDispHatena  = 1;	// 1:qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber   = 0;	// 1:�񓚂ɐ�������͂���p�Y��
		k.isArrowNumber = 0;	// 1:������������͂���p�Y��
		k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
		k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
		k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

		k.BlackCell     = 1;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 1;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 0;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

		k.area = { bcell:1, wcell:1, number:0};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		base.setTitle("�ʂ�ڂ�","Nuribou");
		base.setExpression("�@���N���b�N�ō��}�X���A�E�N���b�N�Ŕ��}�X�m��}�X�����͂ł��܂��B",
						   " Left Click to input black cells, Right Click to input determined white cells.");
		base.setFloatbgcolor("rgb(96, 96, 96)");
	},
	menufix : function(){
		menu.addUseToFlags();
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if(k.editmode){
				if(!kp.enabled()){ this.inputqnum();}
				else{ kp.display();}
			}
			else if(k.playmode) this.inputcell();
		};
		mv.mouseup = function(){ };
		mv.mousemove = function(){
			if(k.playmode) this.inputcell();
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.playmode){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca);
		};

		if(k.EDITOR){
			kp.generate(0, true, false, '');
			kp.kpinput = function(ca){
				kc.key_inputqnum(ca);
			};
		}
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.bcolor = pc.bcolor_GREEN;
		pc.setBGCellColorFunc('qsub1');

		pc.paint = function(x1,y1,x2,y2){
			this.drawBGCells(x1,y1,x2,y2);
			this.drawGrid(x1,y1,x2,y2);
			this.drawBlackCells(x1,y1,x2,y2);

			this.drawNumbers(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawTarget(x1,y1,x2,y2);
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

		//---------------------------------------------------------
		fio.decodeData = function(){
			this.decodeCellQnum();
			this.decodeCellAns();
		};
		fio.encodeData = function(){
			this.encodeCellQnum();
			this.encodeCellAns();
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			var binfo = area.getBCellInfo();
			if( !this.checkAllArea(binfo, f_true, function(w,h,a,n){ return (w==1||h==1);} ) ){
				this.setAlert('�u���P�}�X�A�����P�}�X�ȏ�v�ł͂Ȃ����}�X�̃J�^�}��������܂��B','There is a mass of black cells, whose width is more than two.'); return false;
			}

			if( !this.checkCorners(binfo) ){
				this.setAlert('�����ʐς̍��}�X�̃J�^�}�����A�p�����L���Ă��܂��B','Masses of black cells whose length is the same share a corner.'); return false;
			}

			var winfo = area.getWCellInfo();
			if( !this.checkNoNumber(winfo) ){
				this.setAlert('�����̓����Ă��Ȃ��V�}������܂��B','An area of white cells has no numbers.'); return false;
			}

			if( !this.checkDoubleNumber(winfo) ){
				this.setAlert('1�̃V�}��2�ȏ�̐����������Ă��܂��B','An area of white cells has plural numbers.'); return false;
			}

			if( !this.checkNumberAndSize(winfo) ){
				this.setAlert('�����ƃV�}�̖ʐς��Ⴂ�܂��B','The number is not equal to the number of the size of the area.'); return false;
			}

			return true;
		};

		ans.checkCorners = function(binfo){
			var result = true;
			for(var c=0;c<bd.cellmax;c++){
				if(bd.cell[c].bx===bd.maxbx-1 || bd.cell[c].by===bd.maxby-1){ continue;}

				var cc1, cc2;
				if     ( bd.isBlack(c) && bd.isBlack(c+k.qcols+1) ){ cc1 = c; cc2 = c+k.qcols+1;}
				else if( bd.isBlack(c+1) && bd.isBlack(c+k.qcols) ){ cc1 = c+1; cc2 = c+k.qcols;}
				else{ continue;}

				if(binfo.room[binfo.id[cc1]].idlist.length == binfo.room[binfo.id[cc2]].idlist.length){
					if(this.inAutoCheck){ return false;}
					bd.sErC(binfo.room[binfo.id[cc1]].idlist,1);
					bd.sErC(binfo.room[binfo.id[cc2]].idlist,1);
					result = false;
				}
			}
			return result;
		};
	}
};
