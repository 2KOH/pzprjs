//
// �p�Y���ŗL�X�N���v�g�� �g�y���ʔ� ripple.js v3.3.0
//
Puzzles.ripple = function(){ };
Puzzles.ripple.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
		k.irowake  = 0;		// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross  = 0;		// 1:�Ֆʓ�����Cross������p�Y�� 2:�O�g����܂߂�Cross������p�Y��
		k.isborder = 1;		// 1:Border/Line������\�ȃp�Y�� 2:�O�g�������\�ȃp�Y��
		k.isexcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isLineCross     = false;	// ������������p�Y��
		k.isCenterLine    = false;	// �}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = false;	// ���E����line�Ƃ��Ĉ���
		k.hasroom         = true;	// �������̗̈�ɕ�����Ă���/������p�Y��
		k.roomNumber      = false;	// �����̖��̐�����1��������p�Y��

		k.dispzero        = false;	// 0��\�����邩�ǂ���
		k.isDispHatena    = true;	// qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber     = true;	// �񓚂ɐ�������͂���p�Y��
		k.NumberWithMB    = false;	// �񓚂̐����Ɓ��~������p�Y��
		k.linkNumber      = false;	// �������ЂƂȂ���ɂȂ�p�Y��

		k.BlackCell       = false;	// ���}�X����͂���p�Y��
		k.NumberIsWhite   = false;	// �����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell     = false;	// �A�����f�ւ̃p�Y��
		k.checkBlackCell  = false;	// ��������ō��}�X�̏����`�F�b�N����p�Y��
		k.checkWhiteCell  = false;	// ��������Ŕ��}�X�̏����`�F�b�N����p�Y��

		k.ispzprv3ONLY    = true;	// �ς��Ղ�A�v���b�g�ɂ͑��݂��Ȃ��p�Y��
		k.isKanpenExist   = true;	// pencilbox/�J���y���ɂ���p�Y��

		base.setTitle("�g�y����","Ripple Effect");
			base.setExpression("�@�L�[�{�[�h��}�E�X�Ő��������͂ł��܂��B",
							   " It is available to input number by keybord or mouse");
		base.setFloatbgcolor("rgb(64, 64, 64)");

		enc.pidKanpen = 'hakyukoka';
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
			this.drawBGCells(x1,y1,x2,y2);
			this.drawGrid(x1,y1,x2,y2);

			this.drawNumbers(x1,y1,x2,y2);

			this.drawBorders(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawCursor(x1,y1,x2,y2);
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

			if( !this.checkDifferentNumberInRoom(area.getRoomInfo(), bd.getNum) ){
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

		ans.checkRippleNumber = function(){
			var result = true;
			for(var c=0;c<bd.cellmax;c++){
				var num=bd.getNum(c), bx=bd.cell[c].bx, by=bd.cell[c].by;
				if(num<=0){ continue;}
				for(var i=2;i<=num*2;i+=2){
					var tc = bd.cnum(bx+i,by);
					if(tc!=-1 && bd.getNum(tc)==num){
						if(this.inAutoCheck){ return false;}
						bd.sErC([c,tc],1);
						result = false;
					}
				}
				for(var i=2;i<=num*2;i+=2){
					var tc = bd.cnum(bx,by+i);
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
