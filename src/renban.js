//
// �p�Y���ŗL�X�N���v�g�� �A�ԑ����� renban.js v3.3.0
//
Puzzles.renban = function(){ };
Puzzles.renban.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 6;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 6;}	// �Ֆʂ̏c��
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
		k.isKanpenExist   = false;	// pencilbox/�J���y���ɂ���p�Y��

		base.setTitle("�A�ԑ���","Renban-Madoguchi");
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
			if(k.editmode){
				if     (this.btn.Left)  this.inputborder();
				else if(this.btn.Right) this.inputQsubLine();
			}
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
			if(k.editmode){
				if     (this.btn.Left)  this.inputborder();
				else if(this.btn.Right) this.inputQsubLine();
			}
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca);
		};

		kp.generate(0, true, true, '');
		kp.kpinput = function(ca){ kc.key_inputqnum(ca);};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_DLIGHT;
		pc.borderQsubcolor = pc.borderQuescolor;

		pc.paint = function(x1,y1,x2,y2){
			this.drawBGCells(x1,y1,x2,y2);
			this.drawGrid(x1,y1,x2,y2);

			this.drawNumbers(x1,y1,x2,y2);

			this.drawBorders(x1,y1,x2,y2);
			this.drawBorderQsubs(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawCursor(x1,y1,x2,y2);
		};

		// �G���[���ɐԂ��\���������̂ŏ㏑��
		pc.setBorderColor = function(id){
			if(bd.border[id].ques===1){
				g.fillStyle = (bd.border[id].error===1 ? this.errcolor1 : this.borderQuescolor);
				return true;
			}
			return false;
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

			var rinfo = area.getRoomInfo();
			if( !this.checkDifferentNumberInRoom(rinfo, bd.getNum) ){
				this.setAlert('1�̕����ɓ������������������Ă��܂��B','A room has two or more same numbers.'); return false;
			}

			if( !this.checkNumbersInRoom(rinfo) ){
				this.setAlert('�����ɓ��鐔��������������܂���B','The numbers in the room are wrong.'); return false;
			}

			if( !this.checkBorderSideNumber() ){
				this.setAlert('�����̍������̊Ԃɂ�����̒����Ɠ���������܂���B','The differnece between two numbers is not equal to the length of the line between them.'); return false;
			}

			if( !this.checkAllCell(bd.noNum) ){
				this.setAlert('�����̓����Ă��Ȃ��}�X������܂��B','There is an empty cell.'); return false;
			}

			return true;
		};
		ans.check1st = function(){ return this.checkAllCell(bd.noNum);};

		ans.checkNumbersInRoom = function(rinfo){
			var result = true;
			for(var r=1;r<=rinfo.max;r++){
				var idlist = rinfo.room[r].idlist
				if(idlist.length<=1){ continue;}
				var max=-1, min=bd.maxnum, breakflag=false;
				for(var i=0,len=idlist.length;i<len;i++){
					var val=bd.getNum(idlist[i]);
					if(val===-1 || val===-2){ breakflag=true; break;}
					if(max<val){ max=val;}
					if(min>val){ min=val;}
				}
				if(breakflag){ break;}

				if(idlist.length !== (max-min)+1){
					if(this.inAutoCheck){ return false;}
					bd.sErC(idlist,1);
					result = false;
				}
			}
			return result;
		};

		ans.checkBorderSideNumber = function(){
			var result = true;
			// ���̒������擾����
			var rdata = new AreaInfo();
			for(var i=0;i<bd.bdmax;i++){ rdata.id[i] = (bd.isBorder(i)?0:-1);}
			for(var i=0;i<bd.bdmax;i++){
				if(rdata.id[i]!==0){ continue;}
				var bx=bd.border[i].bx, by=bd.border[i].by, idlist=[];
				while(1){
					var id = bd.bnum(bx,by);
					if(id===-1 || rdata.id[id]!==0){ break;}

					idlist.push(id);
					if(bx%2===1){ bx+=2;}else{ by+=2;}
				}
				rdata.max++;
				for(var n=0;n<idlist.length;n++){ rdata.id[idlist[n]]=rdata.max;}
				rdata.room[rdata.max] = {idlist:idlist};
			}

			// ���ۂɍ��𒲍�����
			for(var i=0;i<bd.bdmax;i++){
				if(rdata.id[i]===-1){ continue;}
				var cc1 = bd.border[i].cellcc[0], cc2 = bd.border[i].cellcc[1];
				var val1=bd.getNum(cc1), val2=bd.getNum(cc2);
				if(val1<=0 || val2<=0){ continue;}

				if(Math.abs(val1-val2)!==rdata.room[rdata.id[i]].idlist.length){
					if(this.inAutoCheck){ return false;}
					bd.sErC([cc1,cc2],1);
					bd.sErB(rdata.room[rdata.id[i]].idlist,1);
					result = false;
				}
			}
			return result;
		};
	}
};
