//
// �p�Y���ŗL�X�N���v�g�� �g�y���ʔ� ripple.js v3.2.4
//
Puzzles.ripple = function(){ };
Puzzles.ripple.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
		k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
		k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
		k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
		k.isLineCross     = 0;	// 1:������������p�Y��
		k.isCenterLine    = 0;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

		k.dispzero      = 0;	// 1:0��\�����邩�ǂ���
		k.isDispHatena  = 1;	// 1:qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber   = 1;	// 1:�񓚂ɐ�������͂���p�Y��
		k.isArrowNumber = 0;	// 1:������������͂���p�Y��
		k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
		k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
		k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

		k.BlackCell     = 0;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 1;	// 1:pencilbox/�J���y���ɂ���p�Y��

		//k.def_csize = 36;
		//k.def_psize = 24;
		//k.area = { bcell:0, wcell:0, number:0};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		base.setTitle("�g�y����","Ripple Effect");
			base.setExpression("�@�L�[�{�[�h��}�E�X�Ő��������͂ł��܂��B",
							   " It is available to input number by keybord or mouse");
		base.setFloatbgcolor("rgb(64, 64, 64)");
	},
	menufix : function(){
		if(k.EDITOR){ kp.defaultdisp = true;}
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if(k.editmode) this.inputborder();
			if(k.playmode){
				if(!kp.enabled()){ this.inputqnum();}
				else{ kp.display();}
			}
		};
		mv.mouseup = function(){
			if(this.notInputted()){
				if(k.editmode){
					if(!kp.enabled()){ this.inputqnum();}
					else{ kp.display();}
				}
			}
		};
		mv.mousemove = function(){
			if(k.editmode && this.btn.Left) this.inputborder();
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca);
		};

		kp.generate(0, true, true, '');
		kp.kpinput = function(ca){ kc.key_inputqnum(ca);};

		area.resetArea();
		bd.nummaxfunc = function(cc){ return area.getCntOfRoomByCell(cc);};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_DLIGHT;

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawBGCells(x1,y1,x2,y2);
			this.drawGrid(x1,y1,x2,y2);

			this.drawNumbers(x1,y1,x2,y2);

			this.drawBorders(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawTCell(x1,y1,x2+1,y2+1);
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type){
			this.decodeBorder();
			this.decodeNumber16();
		};
		enc.pzlexport = function(type){
			this.encodeBorder();
			this.encodeNumber16();
		};

		enc.decodeKanpen = function(){
			fio.decodeAreaRoom();
			fio.decodeCellQnum_kanpen();
		};
		enc.encodeKanpen = function(){
			fio.encodeAreaRoom();
			fio.encodeCellQnum_kanpen();
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			this.decodeBorderQues();
			this.decodeCellQnum();
			this.decodeCellQanssub();
		};
		fio.encodeData = function(){
			this.encodeBorderQues();
			this.encodeCellQnum();
			this.encodeCellQanssub();
		};

		fio.kanpenOpen = function(){
			this.decodeAreaRoom();
			this.decodeCellQnum_kanpen();
			this.decodeCellQans_kanpen();
		};
		fio.kanpenSave = function(){
			this.encodeAreaRoom();
			this.encodeCellQnum_kanpen();
			this.encodeCellQans_kanpen();
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkDifferentNumber(area.getRoomInfo()) ){
				this.setAlert('1�̕����ɓ������������������Ă��܂��B','A room has two or more same numbers.'); return false;
			}

			if( !this.checkRippleNumber() ){
				this.setAlert('�����������̊Ԋu���Z���Ƃ��낪����܂��B','The gap of the same kind of number is smaller than the number.'); return false;
			}

			if( !this.checkAllCell(bd.noNum) ){
				this.setAlert('�����̓����Ă��Ȃ��}�X������܂��B','There is an empty cell.'); return false;
			}

			return true;
		};
		ans.check1st = function(){ return this.checkAllCell(bd.noNum);};

		ans.checkDifferentNumber = function(rinfo){
			var result = true;
			for(var r=1;r<=rinfo.max;r++){
				var d = [];
				for(var i=1;i<=bd.maxnum;i++){ d[i]=-1;}
				for(var i=0;i<rinfo.room[r].idlist.length;i++){
					var val=bd.getNum(rinfo.room[r].idlist[i]);
					if     (val==-1 || val==-2){ continue;}
					else if(d[val]==-1){ d[val] = rinfo.room[r].idlist[i]; continue;}

					if(this.inAutoCheck){ return false;}
					bd.sErC(rinfo.room[r].idlist,1);
					result = false;
				}
			}
			return result;
		};
		ans.checkRippleNumber = function(){
			var result = true;
			for(var c=0;c<bd.cellmax;c++){
				var num=bd.getNum(c), cx=bd.cell[c].cx, cy=bd.cell[c].cy;
				if(num<=0){ continue;}
				for(var i=1;i<=num;i++){
					var tc = bd.cnum(cx+i,cy);
					if(tc!=-1 && bd.getNum(tc)==num){
						if(this.inAutoCheck){ return false;}
						bd.sErC([c,tc],1);
						result = false;
					}
				}
				for(var i=1;i<=num;i++){
					var tc = bd.cnum(cx,cy+i);
					if(tc!=-1 && bd.getNum(tc)==num){
						if(this.inAutoCheck){ return false;}
						bd.sErC([c,tc],1);
						result = false;
					}
				}
			}
			return result;
		};
	}
};
