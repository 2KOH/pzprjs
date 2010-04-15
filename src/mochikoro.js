//
// �p�Y���ŗL�X�N���v�g�� ���`�R���� mochikoro.js v3.3.0
//
Puzzles.mochikoro = function(){ };
Puzzles.mochikoro.prototype = {
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

		k.area = { bcell:0, wcell:1, number:0, disroom:0};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		base.setTitle("���`�R��","Mochikoro");
		base.setExpression("�@���N���b�N�ō��}�X���A�E�N���b�N�Ŕ��}�X�m��}�X�����͂ł��܂��B",
						   " Left Click to input black cells, Right Click to input determined white cells.");
		base.setFloatbgcolor("rgb(64, 64, 64)");
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

			if( !this.check2x2Block( bd.isBlack ) ){
				this.setAlert('2x2�̍��}�X�̂����܂肪����܂��B','There is a block of 2x2 black cells.'); return false;
			}

			if( !this.checkWareaSequent() ){
				this.setAlert('�Ǘ��������}�X�̃u���b�N������܂��B','White cells are devided.'); return false;
			}

			var winfo = area.getWCellInfo();
			if( !this.checkAreaRect(winfo) ){
				this.setAlert('�l�p�`�łȂ����}�X�̃u���b�N������܂��B','There is a block of white cells that is not rectangle.'); return false;
			}

			if( !this.checkDoubleNumber(winfo) ){
				this.setAlert('1�̃u���b�N��2�ȏ�̐����������Ă��܂��B','A block has plural numbers.'); return false;
			}

			if( !this.checkNumberAndSize(winfo) ){
				this.setAlert('�����ƃu���b�N�̖ʐς��Ⴂ�܂��B','A size of tha block and the number written in the block is differrent.'); return false;
			}

			return true;
		};

		ans.checkWareaSequent = function(){
			var winfo = new AreaInfo();
			for(var c=0;c<bd.cellmax;c++){ winfo.id[c]=(bd.isWhite(c)?0:-1);}
			for(var c=0;c<bd.cellmax;c++){
				if(winfo.id[c]==0){
					winfo.max++;
					winfo.room[winfo.max] = {idlist:[]};
					this.sk0(winfo, c, winfo.max);
				}
			}
			return ans.checkOneArea(winfo);
		};
		ans.sk0 = function(winfo, i, areaid){
			if(winfo.id[i]!=0){ return;}
			winfo.id[i] = areaid;
			winfo.room[areaid].idlist.push(i);
			if( bd.isWhite(bd.up(i)) ){ this.sk0(winfo, bd.up(i), areaid);}
			if( bd.isWhite(bd.dn(i)) ){ this.sk0(winfo, bd.dn(i), areaid);}
			if( bd.isWhite(bd.lt(i)) ){ this.sk0(winfo, bd.lt(i), areaid);}
			if( bd.isWhite(bd.rt(i)) ){ this.sk0(winfo, bd.rt(i), areaid);}

			if(bd.cell[i].bx>bd.minbx+2){
				if( bd.isWhite(bd.up(bd.lt(i))) ){ this.sk0(winfo, bd.up(bd.lt(i)), areaid);}
				if( bd.isWhite(bd.dn(bd.lt(i))) ){ this.sk0(winfo, bd.dn(bd.lt(i)), areaid);}
			}
			if(bd.cell[i].bx<bd.maxbx-2){
				if( bd.isWhite(bd.up(bd.rt(i))) ){ this.sk0(winfo, bd.up(bd.rt(i)), areaid);}
				if( bd.isWhite(bd.dn(bd.rt(i))) ){ this.sk0(winfo, bd.dn(bd.rt(i)), areaid);}
			}
		};
	}
};
