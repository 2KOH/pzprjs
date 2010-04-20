//
// �p�Y���ŗL�X�N���v�g�� ���q�̕����� factors.js v3.3.0
//
Puzzles.factors = function(){ };
Puzzles.factors.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 9;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 9;}	// �Ֆʂ̏c��
		k.irowake  = 0;		// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross  = 0;		// 1:�Ֆʓ�����Cross������p�Y�� 2:�O�g����܂߂�Cross������p�Y��
		k.isborder = 1;		// 1:Border/Line������\�ȃp�Y�� 2:�O�g�������\�ȃp�Y��
		k.isexcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isLineCross     = false;	// ������������p�Y��
		k.isCenterLine    = false;	// �}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = false;	// ���E����line�Ƃ��Ĉ���
		k.hasroom         = true;	// �������̗̈�ɕ�����Ă���/������p�Y��
		k.roomNumber      = true;	// �����̖��̐�����1��������p�Y��

		k.dispzero        = false;	// 0��\�����邩�ǂ���
		k.isDispHatena    = false;	// qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber     = true;	// �񓚂ɐ�������͂���p�Y��
		k.NumberWithMB    = false;	// �񓚂̐����Ɓ��~������p�Y��
		k.linkNumber      = false;	// �������ЂƂȂ���ɂȂ�p�Y��

		k.BlackCell       = false;	// ���}�X����͂���p�Y��
		k.NumberIsWhite   = false;	// �����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell     = false;	// �A�����f�ւ̃p�Y��
		k.checkBlackCell  = false;	// ��������ō��}�X�̏����`�F�b�N����p�Y��
		k.checkWhiteCell  = false;	// ��������Ŕ��}�X�̏����`�F�b�N����p�Y��

		k.ispzprv3ONLY    = false;	// �ς��Ղ�A�v���b�g�ɂ͑��݂��Ȃ��p�Y��
		k.isKanpenExist   = false;	// pencilbox/�J���y���ɂ���p�Y��

		base.setTitle("���q�̕���",'Rooms of Factors');
		base.setExpression("�@�L�[�{�[�h��}�E�X�Ő��������͂ł��܂��B",
						   " Inputting number is available by keybord or mouse");
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
		kp.kpinput = function(ca){ kc.key_inputqnum(ca,Math.max(k.qcols,k.qrows));};

		bd.nummaxfunc = function(cc){ return k.editmode?999999:Math.max(k.qcols,k.qrows);};
		bd.setNum = function(c,val){
			if(val==0){ return;}
			if(k.editmode){ this.sQnC(c,val);}else{ this.sQaC(c,val);}
		};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_DLIGHT;

		pc.paint = function(x1,y1,x2,y2){
			this.drawBGCells(x1,y1,x2,y2);
			this.drawGrid(x1,y1,x2,y2);

			this.drawNumbers_factors(x1,y1,x2,y2);

			this.drawBorders(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawCursor(x1,y1,x2,y2);
		};
		pc.drawNumbers_factors = function(x1,y1,x2,y2){
			this.vinc('cell_number', 'auto');

			var clist = this.cellinside(x1,y1,x2,y2);
			for(var i=0;i<clist.length;i++){
				var c = clist[i], obj = bd.cell[c];
				var key_qans = ['cell',c,'qans'].join('_');
				var key_ques = ['cell',c,'ques'].join('_');

				if(bd.cell[c].qans!==-1){
					var color = (bd.cell[c].error==1?this.fontErrcolor:this.fontAnscolor);
					var size = (bd.cell[c].qans<10?0.8:0.7);
					this.dispnum(key_qans, 1, (""+bd.cell[c].qans), size, color, obj.cpx, obj.cpy);
				}
				else{ this.hideEL(key_qans);}

				if(bd.cell[c].qnum!==-1){
					var size = 0.45;
					if     (bd.QnC(c)>=100000){ size = 0.30;}
					else if(bd.QnC(c)>= 10000){ size = 0.36;}
					this.dispnum(key_ques, 5, (""+bd.cell[c].qnum), size, this.fontcolor, obj.cpx, obj.cpy);
				}
				else{ this.hideEL(key_ques);}
			}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type){
			this.decodeBorder();
			this.decodeRoomNumber16();
		};
		enc.pzlexport = function(type){
			this.encodeBorder();
			this.encodeRoomNumber16();
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
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkRowsCols(this.isDifferentNumberInClist, bd.QaC) ){
				this.setAlert('������ɓ��������������Ă��܂��B','There are same numbers in a row.'); return false;
			}

			if( !this.checkRoomNumber(area.getRoomInfo()) ){
				this.setAlert('�u���b�N�̐����Ɛ����̐ς������ł͂���܂���B','A number of room is not equal to the product of these numbers.'); return false;
			}

			if( !this.checkAllCell(function(c){ return (bd.QaC(c)==-1);}) ){
				this.setAlert('�����̓����Ă��Ȃ��}�X������܂��B','There is a empty cell.'); return false;
			}

			return true;
		};
		ans.check1st = function(){ return this.checkAllCell(function(c){ return (bd.QaC(c)==-1);});};

		ans.checkRoomNumber = function(rinfo){
			var result = true;
			for(var id=1;id<=rinfo.max;id++){
				var product = 1;
				for(var i=0;i<rinfo.room[id].idlist.length;i++){
					if(bd.QaC(rinfo.room[id].idlist[i])>0){ product *= bd.QaC(rinfo.room[id].idlist[i]);}
					else{ product = 0;}
				}
				if(product==0){ continue;}

				if(product!=bd.QnC(area.getTopOfRoom(id))){
					if(this.inAutoCheck){ return false;}
					bd.sErC(rinfo.room[id].idlist,1);
					result = false;
				}
			}
			return result;
		};
	}
};
