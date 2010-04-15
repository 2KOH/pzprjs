//
// �p�Y���ŗL�X�N���v�g�� �i�����[�� nanro.js v3.3.0
//
Puzzles.nanro = function(){ };
Puzzles.nanro.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 8;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 8;}	// �Ֆʂ̏c��
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
		k.NumberWithMB  = 1;	// 1:�񓚂̐����Ɓ��~������p�Y��

		k.BlackCell     = 0;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 1;	// 1:pencilbox/�J���y���ɂ���p�Y��

		k.area = { bcell:0, wcell:0, number:1, disroom:0};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		base.setTitle("�i�����[","Nanro");
		base.setExpression("�@�����Ȃǂ��N���b�N���ē��������ƂŁA��������͂��邱�Ƃ��ł��܂��B�E�N���b�N���ă}�E�X�𓮂����ā~����͂��邱�Ƃ��ł��܂��B",
						   " Press Mouse Button on the number and Move to copy the number. It is able to Press Right Mouse Button and Move to input a cross.");
		base.setFloatbgcolor("rgb(64, 64, 64)");

		enc.pidKanpen = 'nanro';
	},
	menufix : function(){
		kp.defaultdisp = true;
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if(k.editmode) this.inputborder();
			else if(k.playmode){
				if(this.btn.Left) this.dragnumber();
			}
		};
		mv.mouseup = function(){
			if(this.notInputted()){
				if(!kp.enabled()){ this.mouseCell=-1; this.inputqnum();}
				else{ kp.display();}
			}
		};
		mv.mousemove = function(){
			if(k.editmode) this.inputborder();
			else if(k.playmode){
				if(this.btn.Left) this.dragnumber();
				else if(this.btn.Right) this.inputDot();
			}
		};
		mv.dragnumber = function(){
			var cc = this.cellid();
			if(cc==-1||cc==this.mouseCell){ return;}
			if(this.mouseCell==-1){
				this.inputData = bd.getNum(cc);
				if   (this.inputData==-2){ this.inputData=-4;}
				else if(this.inputData==-1){
					if     (bd.QsC(cc)==1){ this.inputData=-2;}
					else if(bd.QsC(cc)==2){ this.inputData=-3;}
				}
				this.mouseCell = cc;
			}
			else if(bd.QnC(cc)==-1){
				if(this.inputData>=-1){ bd.sQaC(cc, this.inputData); bd.sQsC(cc,0);}
				else if(this.inputData==-2){ bd.sQaC(cc,-1); bd.sQsC(cc,1);}
				else if(this.inputData==-3){ bd.sQaC(cc,-1); bd.sQsC(cc,2);}
				this.mouseCell = cc;
				pc.paintCell(cc);
			}
		};
		mv.inputDot = function(){
			var cc = this.cellid();
			if(cc==-1 || cc==this.mouseCell || bd.isNum(cc)){ return;}
			if(this.inputData==-1){ this.inputData = (bd.QsC(cc)==2?0:2);}
			if     (this.inputData==2){ bd.sQaC(cc,-1); bd.sQsC(cc,2);}
			else if(this.inputData==0){ bd.sQaC(cc,-1); bd.sQsC(cc,0);}
			this.mouseCell = cc;
			pc.paintCell(cc);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(this.moveTCell(ca)){ return;}
			if(this.key_view(ca)){ return;}
			this.key_inputqnum(ca);
		};
		kc.key_view = function(ca){
			if(k.editmode || bd.QnC(tc.getTCC())!=-1){ return false;}

			var cc = tc.getTCC();
			var flag = false;

			if     ((ca=='q'||ca=='a'||ca=='z')){ bd.sQaC(cc,-1); bd.sQsC(cc,1); flag = true;}
			else if((ca=='w'||ca=='s'||ca=='x')){ bd.sQaC(cc,-1); bd.sQsC(cc,2); flag = true;}
			else if((ca=='e'||ca=='d'||ca=='c')){ bd.sQaC(cc,-1); bd.sQsC(cc,0); flag = true;}
			else if(ca=='1' && bd.QaC(cc)==1)   { bd.sQaC(cc,-1); bd.sQsC(cc,1); flag = true;}
			else if(ca=='2' && bd.QaC(cc)==2)   { bd.sQaC(cc,-1); bd.sQsC(cc,2); flag = true;}

			if(flag){ pc.paintCell(cc); return true;}
			return false;
		};

		kp.kpgenerate = function(mode){
			if(mode==3){
				this.tdcolor = pc.MBcolor;
				this.inputcol('num','knumq','q','��');
				this.inputcol('num','knumw','w','�~');
				this.tdcolor = "black";
				this.inputcol('num','knum_',' ',' ');
				this.inputcol('empty','knumx','','');
				this.insertrow();
			}
			this.inputcol('num','knum1','1','1');
			this.inputcol('num','knum2','2','2');
			this.inputcol('num','knum3','3','3');
			this.inputcol('num','knum4','4','4');
			this.insertrow();
			this.inputcol('num','knum5','5','5');
			this.inputcol('num','knum6','6','6');
			this.inputcol('num','knum7','7','7');
			this.inputcol('num','knum8','8','8');
			this.insertrow();
			this.inputcol('num','knum9','9','9');
			this.inputcol('num','knum0','0','0');
			((mode==1)?this.inputcol('num','knum.','-','?'):this.inputcol('empty','knumz','',''));
			((mode==1)?this.inputcol('num','knumc',' ','') :this.inputcol('empty','knumy','',''));
			this.insertrow();
		};
		kp.generate(kp.ORIGINAL, true, true, kp.kpgenerate);
		kp.kpinput = function(ca){ kc.keyinput(ca);};

		area.resetArea();
		bd.nummaxfunc = function(cc){ return area.getCntOfRoomByCell(cc);};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_LIGHT;

		pc.paint = function(x1,y1,x2,y2){
			this.drawBGCells(x1,y1,x2,y2);
			this.drawGrid(x1,y1,x2,y2);

			this.drawMBs(x1,y1,x2,y2);
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
			this.decodeAreaRoom();
			this.decodeCellQnum();
			this.decodeCellQanssub();
		};
		fio.encodeData = function(){
			this.encodeAreaRoom();
			this.encodeCellQnum();
			this.encodeCellQanssub();
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.check2x2Block(bd.isNum) ){
				this.setAlert('������2x2�̂����܂�ɂȂ��Ă��܂��B','There is a 2x2 block of numbers.'); return false;
			}

			if( !this.checkSideAreaCell(rinfo, bd.sameNumber, false) ){
				this.setAlert('�������������E��������ŗׂ荇���Ă��܂��B','Adjacent blocks have the same number.'); return false;
			}

			var rinfo = this.searchRarea2();
			if( !this.checkErrorFlag(rinfo, 4) ){
				this.setAlert('������ނ̐����������Ă���u���b�N������܂��B','A block has two or more kinds of numbers.'); return false;
			}

			if( !this.checkErrorFlag(rinfo, 1) ){
				this.setAlert('�����Ă��鐔���̐���������葽���ł��B','A number is bigger than the size of block.'); return false;
			}

			if( !this.checkOneArea( area.getNumberInfo() ) ){
				this.setAlert('�^�e���R�ɂȂ����Ă��Ȃ�����������܂��B','Numbers are devided.'); return false;
			}

			if( !this.checkErrorFlag(rinfo, 2) ){
				this.setAlert('�����Ă��鐔���̐���������菭�Ȃ��ł��B','A number is smaller than the size of block.'); return false;
			}

			if( !this.checkErrorFlag(rinfo, 3) ){
				this.setAlert('�������܂܂�Ă��Ȃ��u���b�N������܂��B','A block has no number.'); return false;
			}

			return true;
		};
		//check1st : function(){ return ans.checkOneArea( ans.searchBWarea(function(id){ return (id!=-1 && puz.getNum(id)!=-1); }) );},

		ans.checkErrorFlag = function(rinfo, val){
			var result = true;
			for(var id=1;id<=rinfo.max;id++){
				if(rinfo.room[id].error!==val){ continue;}

				if(this.inAutoCheck){ return false;}
				bd.sErC(rinfo.room[id].idlist,1);
				result = false;
			}
			return result;
		};

		ans.searchRarea2 = function(){
			var rinfo = area.getRoomInfo();
			for(var id=1,max=rinfo.max;id<=max;id++){
				var room = rinfo.room[id];
				room.error  =  0;		// ��ŃG���[�\������G���[�̃t���O
				room.number = -1;		// ���̃G���A�ɓ����Ă��鐔��
				var nums = [];			// �L�[�̐����������Ă��鐔
				var numcnt = 0;			// �G���A�ɓ����Ă��鐔���̎�ސ�
				var emptycell = 0;		// �����������Ă��Ȃ��Z���̐�
				var filled = 0;			// �G���A�ɓ����Ă��鐔��
				for(var i=0;i<room.idlist.length;i++){
					var c = room.idlist[i];
					var num = bd.getNum(c);
					if(num==-1){ emptycell++;}
					else if(isNaN(nums[num])){ numcnt++; filled=num; nums[num]=1;}
					else{ nums[num]++;}
				}
				if(numcnt>1)                               { room.error=4;}
				else if(numcnt==0)                         { room.error=3;}
				else if(numcnt==1 && filled < nums[filled]){ room.error=1; room.number=filled;}
				else if(numcnt==1 && filled > nums[filled]){ room.error=2; room.number=filled;}
				else                                       { room.error=-1;room.number=filled;}
			}
			return rinfo;
		};
	}
};
