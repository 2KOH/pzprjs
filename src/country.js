//
// �p�Y���ŗL�X�N���v�g�� �J���g���[���[�h�� country.js v3.3.0
//
Puzzles.country = function(){ };
Puzzles.country.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
		k.irowake = 1;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
		k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
		k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
		k.isLineCross     = 0;	// 1:������������p�Y��
		k.isCenterLine    = 1;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

		k.dispzero      = 0;	// 1:0��\�����邩�ǂ���
		k.isDispHatena  = 1;	// 1:qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber   = 0;	// 1:�񓚂ɐ�������͂���p�Y��
		k.isArrowNumber = 0;	// 1:������������͂���p�Y��
		k.isOneNumber   = 1;	// 1:�����̖��̐�����1��������p�Y��
		k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
		k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

		k.BlackCell     = 0;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 0;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

		//k.def_csize = 36;
		//k.def_psize = 24;
		//k.area = { bcell:0, wcell:0, number:0};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		base.setTitle("�J���g���[���[�h","Country Road");
		base.setExpression("�@�h���b�O�Ő����A�}�X�̃N���b�N�Ł��~(�⏕�L��)�����͂ł��܂��B",
						   " Left Button Drag to input lines, Click to input auxiliary marks.");
		base.setFloatbgcolor("rgb(191, 0, 0)");
	},
	menufix : function(){
		menu.addRedLineToFlags();
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if(kc.isZ ^ pp.getVal('dispred')){ this.dispRedLine(); return;}
			if(k.editmode) this.inputborder();
			else if(k.playmode){
				if(this.btn.Left) this.inputLine();
			}
		};
		mv.mouseup = function(){
			if(this.notInputted()){
				if(k.editmode){
					if(!kp.enabled()){ this.inputqnum();}
					else{ kp.display();}
				}
				else if(k.playmode) this.inputMB();
			}
		};
		mv.mousemove = function(){
			if(k.editmode) this.inputborder();
			else if(k.playmode){
				if(this.btn.Left) this.inputLine();
			}
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(ca=='z' && !this.keyPressed){ this.isZ=true; return;}
			if(k.playmode){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca);
		};
		kc.keyup = function(ca){ if(ca=='z'){ this.isZ=false;}};
		kc.isZ = false;

		if(k.EDITOR){
			kp.generate(0, true, false, '');
			kp.kpinput = function(ca){
				kc.key_inputqnum(ca);
			};
		}

		bd.nummaxfunc = function(cc){ return Math.min(this.maxnum, area.getCntOfRoomByCell(cc));};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_SLIGHT;

		pc.paint = function(x1,y1,x2,y2){
			this.drawBGCells(x1,y1,x2,y2);
			this.drawNumbers(x1,y1,x2,y2);

			this.drawGrid(x1,y1,x2,y2);
			this.drawBorders(x1,y1,x2,y2);

			this.drawMBs(x1,y1,x2,y2);
			this.drawLines(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawTarget(x1,y1,x2,y2);
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
			this.decodeAreaRoom();
			this.decodeCellQnum();
			this.decodeBorderLine();
			this.decodeCellQsub();
		};
		fio.encodeData = function(){
			this.encodeAreaRoom();
			this.encodeCellQnum();
			this.encodeBorderLine();
			this.encodeCellQsub();
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkLcntCell(3) ){
				this.setAlert('���򂵂Ă����������܂��B','There is a branch line.'); return false;
			}
			if( !this.checkLcntCell(4) ){
				this.setAlert('�������Ă����������܂��B','There is a crossing line.'); return false;
			}

			var rinfo = area.getRoomInfo();
			if( !this.checkRoom2( rinfo ) ){
				this.setAlert('�����P�̍����Q��ȏ�ʂ��Ă��܂��B','A line passes a country twice or more.'); return false;
			}

			if( !this.checkLinesInArea(rinfo, function(w,h,a,n){ return (n<=0||n==a);}) ){
				this.setAlert('�����̂��鍑�Ɛ����ʉ߂���}�X�̐����Ⴂ�܂��B','The number of the cells that is passed any line in the country and the number written in the country is diffrerent.'); return false;
			}
			if( !this.checkLinesInArea(rinfo, function(w,h,a,n){ return (a!=0);}) ){
				this.setAlert('���̒ʂ��Ă��Ȃ���������܂��B','There is a country that is not passed any line.'); return false;
			}

			if( !this.checkSideAreaCell(rinfo, function(c1,c2){ return (line.lcntCell(c1)==0 && line.lcntCell(c2)==0);}, false) ){
				this.setAlert('�����ʂ�Ȃ��}�X���A�������͂���Ń^�e���R�ɂƂȂ肠���Ă��܂��B','The cells that is not passed any line are adjacent over border line.'); return false;
			}

			if( !this.checkLcntCell(1) ){
				this.setAlert('�r���œr�؂�Ă����������܂��B', 'There is a dead-end line.'); return false;
			}

			if( !this.checkOneLoop() ){
				this.setAlert('�ւ�������ł͂���܂���B','There are two or more loops.'); return false;
			}

			return true;
		};

		ans.checkRoom2 = function(rinfo){
			if(rinfo.max<=1){ return true;}
			var result = true;
			for(var r=1;r<=rinfo.max;r++){
				var cnt=0;
				for(var i=0;i<rinfo.room[r].idlist.length;i++){
					var c=rinfo.room[r].idlist[i];
					var ub=bd.ub(c); if(bd.up(c)!=-1 && bd.isBorder(ub) && bd.isLine(ub)){ cnt++;}
					var db=bd.db(c); if(bd.dn(c)!=-1 && bd.isBorder(db) && bd.isLine(db)){ cnt++;}
					var lb=bd.lb(c); if(bd.lt(c)!=-1 && bd.isBorder(lb) && bd.isLine(lb)){ cnt++;}
					var rb=bd.rb(c); if(bd.rt(c)!=-1 && bd.isBorder(rb) && bd.isLine(rb)){ cnt++;}
				}
				if(cnt>2){
					if(this.inAutoCheck){ return false;}
					bd.sErC(rinfo.room[r].idlist,1);
					result = false;
				}
			}
			return result;
		};
	}
};
