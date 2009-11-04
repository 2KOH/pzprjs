//
// �p�Y���ŗL�X�N���v�g�� �܂���� mashu.js v3.2.2
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

		k.fstruct = ["cellques41_42","borderline"];

		//k.def_csize = 36;
		//k.def_psize = 24;
		//k.area = { bcell:0, wcell:0, number:0};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		base.setTitle("�܂���","Masyu (Pearl Puzzle)");
		base.setExpression("�@���h���b�O�Ő����A�E�N���b�N�Ł~�󂪓��͂ł��܂��B",
						   " Left Button Drag to input black cells, Right Click to input a cross.");
		base.setFloatbgcolor("rgb(0, 224, 0)");
	},
	menufix : function(){
		pp.addCheckToFlags('uramashu','setting',false);
		pp.setMenuStr('uramashu', '���܂���', 'Ura-Mashu');
		pp.setLabel  ('uramashu', '���܂���ɂ���', 'Change to Ura-Mashu');
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
		mv.mousedown = function(x,y){
			if(kc.isZ ^ menu.getVal('dispred')){ this.dispRedLine(x,y); return;}
			if(k.mode==1) this.inputQues(x,y,[0,41,42,-2]);
			else if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};
		mv.mouseup = function(x,y){ };
		mv.mousemove = function(x,y){
			if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};

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

			this.drawErrorCells(x1,y1,x2,y2);

			this.drawDashedGrid(x1,y1,x2,y2);

			this.drawQueses41_42(x1,y1,x2,y2);
			this.drawNumbers(x1,y1,x2,y2);

			this.drawPekes(x1,y1,x2,y2,0);
			this.drawLines(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==0 || type==1){ bstr = this.decodeCircle(bstr);}
			else if(type==2){ bstr = this.decodeKanpen(bstr);}
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
			else if(type==2){ document.urloutput.ta.value = this.kanpenbase()+"masyu.html?problem="+this.pzldataKanpen();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			return "/"+k.qcols+"/"+k.qrows+"/"+this.encodeCircle();
		};

		enc.decodeCircle = function(bstr,flag){
			var pos = bstr?Math.min(mf((k.qcols*k.qrows+2)/3), bstr.length):0;
			for(var i=0;i<pos;i++){
				var ca = parseInt(bstr.charAt(i),27);
				for(var w=0;w<3;w++){
					if(i*3+w<k.qcols*k.qrows){
						if     (mf(ca/Math.pow(3,2-w))%3==1){ bd.sQuC(i*3+w,41);}
						else if(mf(ca/Math.pow(3,2-w))%3==2){ bd.sQuC(i*3+w,42);}
					}
				}
			}
			if(menu.getVal('uramashu')){ (pp.funcs['uramashu'])();}

			return bstr.substring(pos,bstr.length);
		};
		enc.encodeCircle = function(flag){
			var cm="", num=0, pass=0, isura=menu.getVal('uramashu');
			for(var i=0;i<bd.cellmax;i++){
				if     (bd.QuC(i)==(!isura?41:42)){ pass+=(  Math.pow(3,2-num));}
				else if(bd.QuC(i)==(!isura?42:41)){ pass+=(2*Math.pow(3,2-num));}
				num++; if(num==3){ cm += pass.toString(27); num=0; pass=0;}
			}
			if(num>0){ cm += pass.toString(27);}

			return cm;
		};

		enc.decodeKanpen = function(bstr){
			bstr = (bstr.split("_")).join(" ");
			fio.decodeCell( function(c,ca){
				if     (ca == "1"){ bd.sQuC(c, 41);}
				else if(ca == "2"){ bd.sQuC(c, 42);}
			},bstr.split("/"));
			if(menu.getVal('uramashu')){ (pp.funcs['uramashu'])();}
			return "";
		};
		enc.pzldataKanpen = function(){
			var isura=menu.getVal('uramashu');
			return ""+k.qrows+"/"+k.qcols+"/"+fio.encodeCell( function(c){
				if     (bd.QuC(c)==(!isura?41:42)){ return "1_";}
				else if(bd.QuC(c)==(!isura?42:41)){ return "2_";}
				else                              { return "._";}
			});
		};

		//---------------------------------------------------------
		fio.kanpenOpen = function(array){
			this.decodeCell( function(c,ca){
				if     (ca == "1"){ bd.sQuC(c, 41);}
				else if(ca == "2"){ bd.sQuC(c, 42);}
			},array.slice(0,k.qrows));
			this.decodeBorderLine(array.slice(k.qrows,3*k.qrows-1));
			if(menu.getVal('uramashu')){ (pp.funcs['uramashu'])();}
		};
		fio.kanpenSave = function(){
			var isura=menu.getVal('uramashu');
			return ""+this.encodeCell( function(c){
				if     (bd.QuC(c)==(!isura?41:42)){ return "1 ";}
				else if(bd.QuC(c)==(!isura?42:41)){ return "2 ";}
				else                              { return ". ";}
			})
			+this.encodeBorderLine();
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
			for(var c=0;c<bd.cellmax;c++){
				if(bd.QuC(c)==41 && line.lcntCell(c)==2 && !ans.isLineStraight(c)){
					bd.sErBAll(2);
					ans.setCellLineError(c,1);
					return false;
				}
			}
			return true;
		};
		ans.checkBlackPearl1 = function(){
			for(var c=0;c<bd.cellmax;c++){
				if(bd.QuC(c)==42 && line.lcntCell(c)==2 && ans.isLineStraight(c)){
					bd.sErBAll(2);
					ans.setCellLineError(c,1);
					return false;
				}
			}
			return true;
		};

		ans.checkWhitePearl2 = function(){
			for(var c=0;c<bd.cellmax;c++){
				if(bd.QuC(c)!=41 || line.lcntCell(c)!=2){ continue;}
				if(bd.isLine(bd.ub(c)) && line.lcntCell(bd.up(c))==2 && !ans.isLineStraight(bd.up(c))){ continue;}
				if(bd.isLine(bd.db(c)) && line.lcntCell(bd.dn(c))==2 && !ans.isLineStraight(bd.dn(c))){ continue;}
				if(bd.isLine(bd.lb(c)) && line.lcntCell(bd.lt(c))==2 && !ans.isLineStraight(bd.lt(c))){ continue;}
				if(bd.isLine(bd.rb(c)) && line.lcntCell(bd.rt(c))==2 && !ans.isLineStraight(bd.rt(c))){ continue;}

				this.setErrorPearl(c);
				return false;
			}
			return true;
		};
		ans.checkBlackPearl2 = function(){
			for(var c=0;c<bd.cellmax;c++){
				if(bd.QuC(c)!=42 || line.lcntCell(c)!=2){ continue;}
				if((bd.isLine(bd.ub(c)) && line.lcntCell(bd.up(c))==2 && !ans.isLineStraight(bd.up(c))) ||
				   (bd.isLine(bd.db(c)) && line.lcntCell(bd.dn(c))==2 && !ans.isLineStraight(bd.dn(c))) ||
				   (bd.isLine(bd.lb(c)) && line.lcntCell(bd.lt(c))==2 && !ans.isLineStraight(bd.lt(c))) ||
				   (bd.isLine(bd.rb(c)) && line.lcntCell(bd.rt(c))==2 && !ans.isLineStraight(bd.rt(c))) ){
					this.setErrorPearl(c);
					return false;
				}
			}
			return true;
		};
		ans.setErrorPearl = function(cc){
			bd.sErBAll(2);
			ans.setCellLineError(cc,1);
			if(bd.isLine(bd.ub(cc))){ ans.setCellLineError(bd.up(cc),0);}
			if(bd.isLine(bd.db(cc))){ ans.setCellLineError(bd.dn(cc),0);}
			if(bd.isLine(bd.lb(cc))){ ans.setCellLineError(bd.lt(cc),0);}
			if(bd.isLine(bd.rb(cc))){ ans.setCellLineError(bd.rt(cc),0);}
		};
	}
};
