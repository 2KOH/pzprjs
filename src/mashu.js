//
// �p�Y���ŗL�X�N���v�g�� �܂���� mashu.js v3.2.4
//
Puzzles.mashu = function(){ };
Puzzles.mashu.prototype = {
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

		base.setTitle("�܂���","Masyu (Pearl Puzzle)");
		base.setExpression("�@���h���b�O�Ő����A�E�N���b�N�Ł~�󂪓��͂ł��܂��B",
						   " Left Button Drag to input black cells, Right Click to input a cross.");
		base.setFloatbgcolor("rgb(0, 224, 0)");

		enc.pidKanpen = 'masyu';
	},
	menufix : function(){
		pp.addCheck('uramashu','setting',false, '���܂���', 'Ura-Mashu');
		pp.setLabel('uramashu', '���܂���ɂ���', 'Change to Ura-Mashu');
		pp.funcs['uramashu'] = function(){
			for(var c=0;c<bd.cellmax;c++){
				if     (bd.QuC(c)==41){ bd.sQuC(c,42);}
				else if(bd.QuC(c)==42){ bd.sQuC(c,41);}
			}
			pc.paintAll();
		};

		menu.addRedLineToFlags();
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if(kc.isZ ^ pp.getVal('dispred')){ this.dispRedLine(); return;}
			if(k.editmode) this.inputQues([0,41,42,-2]);
			else if(k.playmode){
				if(this.btn.Left) this.inputLine();
				else if(this.btn.Right) this.inputpeke();
			}
		};
		mv.mouseup = function(){ };
		mv.mousemove = function(){
			if(k.playmode){
				if(this.btn.Left) this.inputLine();
				else if(this.btn.Right) this.inputpeke();
			}
		};
		mv.inputQuesDirectly = true;

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){ if(ca=='z' && !this.keyPressed){ this.isZ=true;} };
		kc.keyup = function(ca){ if(ca=='z'){ this.isZ=false;}};
		kc.isZ = false;
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_LIGHT;

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawBGCells(x1,y1,x2,y2);
			this.drawDashedGrid(x1,y1,x2,y2);

			this.drawQueses41_42(x1,y1,x2,y2);
			this.drawQuesHatenas(x1,y1,x2,y2);

			this.drawPekes(x1,y1,x2,y2,0);
			this.drawLines(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type){
			this.decodeCircle41_42();
			this.revCircle();
		};
		enc.pzlexport = function(){
			this.revCircle();
			this.encodeCircle41_42();
			this.revCircle();
		};

		enc.decodeKanpen = function(){
			fio.decodeCellQues41_42_kanpen();
			this.revCircle();
		};
		enc.encodeKanpen = function(){
			this.revCircle();
			fio.encodeCellQues41_42_kanpen();
			this.revCircle();
		};

		enc.revCircle = function(){
			if(!pp.getVal('uramashu')){ return;}
			for(var c=0;c<bd.cellmax;c++){
				if     (bd.cell[c].ques===41){ bd.cell[c].ques = 42;}
				else if(bd.cell[c].ques===42){ bd.cell[c].ques = 41;}
			}
		}

		//---------------------------------------------------------
		fio.decodeData = function(){
			this.decodeCellQues41_42();
			this.decodeBorderLine();
			enc.revCircle();
		};
		fio.encodeData = function(){
			enc.revCircle();
			this.encodeCellQues41_42();
			this.encodeBorderLine();
			enc.revCircle();
		};

		fio.kanpenOpen = function(){
			this.decodeCellQues41_42_kanpen();
			this.decodeBorderLine();
			enc.revCircle();
		};
		fio.kanpenSave = function(){
			enc.revCircle();
			this.encodeCellQues41_42_kanpen();
			this.encodeBorderLine();
			enc.revCircle();
		};

		fio.decodeCellQues41_42_kanpen = function(){
			this.decodeCell( function(c,ca){
				if     (ca === "1"){ bd.sQuC(c, 41);}
				else if(ca === "2"){ bd.sQuC(c, 42);}
			});
		};
		fio.encodeCellQues41_42_kanpen = function(){
			this.encodeCell( function(c){
				if     (bd.QuC(c)===41){ return "1 ";}
				else if(bd.QuC(c)===42){ return "2 ";}
				else                   { return ". ";}
			});
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkLcntCell(3) ){
				this.setAlert('���򂵂Ă����������܂��B','There is a branched line.'); return false;
			}
			if( !this.checkLcntCell(4) ){
				this.setAlert('�����������Ă��܂��B','There is a crossing line.'); return false;
			}

			if( !this.checkWhitePearl1() ){
				this.setAlert('���ۂ̏�Ő����Ȃ����Ă��܂��B','Lines curve on white pearl.'); return false;
			}
			if( !this.checkBlackPearl1() ){
				this.setAlert('���ۂ̏�Ő������i���Ă��܂��B','Lines go straight on black pearl.'); return false;
			}

			if( !this.checkBlackPearl2() ){
				this.setAlert('���ۂׂ̗Ő����Ȃ����Ă��܂��B','Lines curve next to black pearl.'); return false;
			}
			if( !this.checkWhitePearl2() ){
				this.setAlert('���ۂׂ̗Ő����Ȃ����Ă��܂���B','Lines go straight next to white pearl on each side.'); return false;
			}

			if( !this.checkAllCell(function(c){ return (bd.QuC(c)!=0 && line.lcntCell(c)==0);}) ){
				this.setAlert('�������ʂ��Ă��Ȃ��ۂ�����܂��B','Lines don\'t pass some pearls.'); return false;
			}

			if( !this.checkLcntCell(1) ){
				this.setAlert('�����r���œr�؂�Ă��܂��B','There is a dead-end line.'); return false;
			}

			if( !this.checkOneLoop() ){
				this.setAlert('�ւ�������ł͂���܂���B','There are plural loops.'); return false;
			}

			return true;
		};

		ans.checkWhitePearl1 = function(){
			var result = true;
			for(var c=0;c<bd.cellmax;c++){
				if(bd.QuC(c)==41 && line.lcntCell(c)==2 && !ans.isLineStraight(c)){
					if(this.inAutoCheck){ return false;}
					if(result){ bd.sErBAll(2);}
					ans.setCellLineError(c,1);
					result = false;
				}
			}
			return result;
		};
		ans.checkBlackPearl1 = function(){
			var result = true;
			for(var c=0;c<bd.cellmax;c++){
				if(bd.QuC(c)==42 && line.lcntCell(c)==2 && ans.isLineStraight(c)){
					if(this.inAutoCheck){ return false;}
					if(result){ bd.sErBAll(2);}
					ans.setCellLineError(c,1);
					result = false;
				}
			}
			return result;
		};

		ans.checkWhitePearl2 = function(){
			var result = true;
			for(var c=0;c<bd.cellmax;c++){
				if(bd.QuC(c)!=41 || line.lcntCell(c)!=2){ continue;}
				var stcnt = 0;
				if(bd.isLine(bd.ub(c)) && line.lcntCell(bd.up(c))===2 && ans.isLineStraight(bd.up(c))){ stcnt++;}
				if(bd.isLine(bd.db(c)) && line.lcntCell(bd.dn(c))===2 && ans.isLineStraight(bd.dn(c))){ stcnt++;}
				if(bd.isLine(bd.lb(c)) && line.lcntCell(bd.lt(c))===2 && ans.isLineStraight(bd.lt(c))){ stcnt++;}
				if(bd.isLine(bd.rb(c)) && line.lcntCell(bd.rt(c))===2 && ans.isLineStraight(bd.rt(c))){ stcnt++;}

				if(stcnt>=2){
					if(this.inAutoCheck){ return false;}
					this.setErrorPearl(c,result);
					result = false;
				}
			}
			return result;
		};
		ans.checkBlackPearl2 = function(){
			var result = true;
			for(var c=0;c<bd.cellmax;c++){
				if(bd.QuC(c)!=42 || line.lcntCell(c)!=2){ continue;}
				if((bd.isLine(bd.ub(c)) && line.lcntCell(bd.up(c))==2 && !ans.isLineStraight(bd.up(c))) ||
				   (bd.isLine(bd.db(c)) && line.lcntCell(bd.dn(c))==2 && !ans.isLineStraight(bd.dn(c))) ||
				   (bd.isLine(bd.lb(c)) && line.lcntCell(bd.lt(c))==2 && !ans.isLineStraight(bd.lt(c))) ||
				   (bd.isLine(bd.rb(c)) && line.lcntCell(bd.rt(c))==2 && !ans.isLineStraight(bd.rt(c))) ){

					if(this.inAutoCheck){ return false;}
					this.setErrorPearl(c,result);
					result = false;
				}
			}
			return result;
		};
		ans.setErrorPearl = function(cc,result){
			if(result){ bd.sErBAll(2);}
			ans.setCellLineError(cc,1);
			if(bd.isLine(bd.ub(cc))){ ans.setCellLineError(bd.up(cc),0);}
			if(bd.isLine(bd.db(cc))){ ans.setCellLineError(bd.dn(cc),0);}
			if(bd.isLine(bd.lb(cc))){ ans.setCellLineError(bd.lt(cc),0);}
			if(bd.isLine(bd.rb(cc))){ ans.setCellLineError(bd.rt(cc),0);}
		};
	}
};
