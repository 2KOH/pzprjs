//
// �p�Y���ŗL�X�N���v�g�� �܂���� mashu.js v3.1.9p3
//

function setting(){
	// �O���[�o���ϐ��̏����ݒ�
	if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
	if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
	k.irowake = 1;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

	k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
	k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
	k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

	k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
	k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
	k.isborderCross   = 0;	// 1:������������p�Y��
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
}

//-------------------------------------------------------------
// Puzzle�ʃN���X�̒�`
Puzzle = function(){
	this.prefix();
};
Puzzle.prototype = {
	prefix : function(){
		this.input_init();
		this.graphic_init();

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
			for(var c=0;c<bd.cell.length;c++){
				if     (bd.getQuesCell(c)==41){ bd.setQuesCell(c,42);}
				else if(bd.getQuesCell(c)==42){ bd.setQuesCell(c,41);}
			}
			pc.paintAll();
		};

		menu.addRedLineToFlags();
	},
	postfix : function(){ },

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
			if(kc.isZ ^ menu.getVal('dispred')){ this.dispRedLine(x,y); return;}
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
		pc.BDlinecolor = "rgb(160, 160, 160)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawErrorCells(x1,y1,x2,y2);

			this.drawBDline2(x1,y1,x2,y2);

			this.drawQueses41_42(x1,y1,x2,y2);
			this.drawNumbers(x1,y1,x2,y2);

			this.drawPekes(x1,y1,x2,y2,0);
			this.drawLines(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	pzlinput : function(type, bstr){
		if(type==0 || type==1){ bstr = this.decodeCircle(bstr);}
		else if(type==2){ bstr = this.decodeKanpen(bstr);}
	},
	decodeKanpen : function(bstr){
		bstr = (bstr.split("_")).join(" ");
		fio.decodeCell( function(c,ca){
			if     (ca == "1"){ bd.setQuesCell(c, 41);}
			else if(ca == "2"){ bd.setQuesCell(c, 42);}
		},bstr.split("/"));
		return "";
	},

	pzloutput : function(type){
		if(type==0)     { document.urloutput.ta.value = enc.getURLbase()+"?"+k.puzzleid+this.pzldata();}
		else if(type==1){ document.urloutput.ta.value = enc.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
		else if(type==2){ document.urloutput.ta.value = enc.kanpenbase()+"masyu.html?problem="+this.pzldataKanpen();}
		else if(type==3){ document.urloutput.ta.value = enc.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
	},
	pzldata : function(){
		return "/"+k.qcols+"/"+k.qrows+"/"+this.encodeCircle();
	},
	pzldataKanpen : function(){
		return ""+k.qrows+"/"+k.qcols+"/"+fio.encodeCell( function(c){
			if     (bd.getQuesCell(c)==41){ return "1_";}
			else if(bd.getQuesCell(c)==42){ return "2_";}
			else                          { return "._";}
		});
	},

	//---------------------------------------------------------
	kanpenOpen : function(array){
		fio.decodeCell( function(c,ca){
			if     (ca == "1"){ bd.setQuesCell(c, 41);}
			else if(ca == "2"){ bd.setQuesCell(c, 42);}
		},array.slice(0,k.qrows));
		fio.decodeBorderLine(array.slice(k.qrows,3*k.qrows-1));
	},
	kanpenSave : function(){
		return ""+fio.encodeCell( function(c){
			if     (bd.getQuesCell(c)==41){ return "1 ";}
			else if(bd.getQuesCell(c)==42){ return "2 ";}
			else                          { return ". ";}
		})
		+fio.encodeBorderLine();
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	check : function(){

		if( !ans.checkLcntCell(3) ){
			ans.setAlert('���򂵂Ă����������܂��B','There is a branched line.'); return false;
		}
		if( !ans.checkLcntCell(4) ){
			ans.setAlert('�����������Ă��܂��B','There is a crossing line.'); return false;
		}

		if( !this.checkWhitePearl1() ){
			ans.setAlert('���ۂ̏�Ő����Ȃ����Ă��܂��B','Lines curve on white pearl.'); return false;
		}
		if( !this.checkBlackPearl1() ){
			ans.setAlert('���ۂ̏�Ő������i���Ă��܂��B','Lines go straight on black pearl.'); return false;
		}

		if( !this.checkBlackPearl2() ){
			ans.setAlert('���ۂׂ̗Ő����Ȃ����Ă��܂��B','Lines curve next to black pearl.'); return false;
		}
		if( !this.checkWhitePearl2() ){
			ans.setAlert('���ۂׂ̗Ő����Ȃ����Ă��܂���B','Lines go straight next to white pearl on each side.'); return false;
		}

		if( !this.checkPearlLine() ){
			ans.setAlert('�������ʂ��Ă��Ȃ��ۂ�����܂��B','Lines don\'t pass some pearls.'); return false;
		}

		if( !ans.checkLcntCell(1) ){
			ans.setAlert('�����r���œr�؂�Ă��܂��B','There is a dead-end line.'); return false;
		}

		if( !ans.checkOneLoop() ){
			ans.setAlert('�ւ�������ł͂���܂���B','There are plural loops.'); return false;
		}

		return true;
	},

	checkWhitePearl1 : function(){
		for(var c=0;c<bd.cell.length;c++){
			if(bd.getQuesCell(c)==41 && ans.lcntCell(c)==2 && !ans.isLineStraight(c)){
				bd.setErrorBorder(bd.borders,2);
				ans.setCellLineError(c,1);
				return false;
			}
		}
		return true;
	},
	checkBlackPearl1 : function(){
		for(var c=0;c<bd.cell.length;c++){
			if(bd.getQuesCell(c)==42 && ans.lcntCell(c)==2 && ans.isLineStraight(c)){
				bd.setErrorBorder(bd.borders,2);
				ans.setCellLineError(c,1);
				return false;
			}
		}
		return true;
	},

	checkWhitePearl2 : function(){
		for(var c=0;c<bd.cell.length;c++){
			if(bd.getQuesCell(c)!=41 || ans.lcntCell(c)!=2){ continue;}
			if(bd.getLineBorder(bd.cell[c].ub())==1 && ans.lcntCell(bd.cell[c].up())==2 && !ans.isLineStraight(bd.cell[c].up())){ continue;}
			if(bd.getLineBorder(bd.cell[c].db())==1 && ans.lcntCell(bd.cell[c].dn())==2 && !ans.isLineStraight(bd.cell[c].dn())){ continue;}
			if(bd.getLineBorder(bd.cell[c].lb())==1 && ans.lcntCell(bd.cell[c].lt())==2 && !ans.isLineStraight(bd.cell[c].lt())){ continue;}
			if(bd.getLineBorder(bd.cell[c].rb())==1 && ans.lcntCell(bd.cell[c].rt())==2 && !ans.isLineStraight(bd.cell[c].rt())){ continue;}

			this.setErrorPearl(c);
			return false;
		}
		return true;
	},
	checkBlackPearl2 : function(){
		for(var c=0;c<bd.cell.length;c++){
			if(bd.getQuesCell(c)!=42 || ans.lcntCell(c)!=2){ continue;}
			if((bd.getLineBorder(bd.cell[c].ub())==1 && ans.lcntCell(bd.cell[c].up())==2 && !ans.isLineStraight(bd.cell[c].up())) ||
			   (bd.getLineBorder(bd.cell[c].db())==1 && ans.lcntCell(bd.cell[c].dn())==2 && !ans.isLineStraight(bd.cell[c].dn())) ||
			   (bd.getLineBorder(bd.cell[c].lb())==1 && ans.lcntCell(bd.cell[c].lt())==2 && !ans.isLineStraight(bd.cell[c].lt())) ||
			   (bd.getLineBorder(bd.cell[c].rb())==1 && ans.lcntCell(bd.cell[c].rt())==2 && !ans.isLineStraight(bd.cell[c].rt())) ){
				this.setErrorPearl(c);
				return false;
			}
		}
		return true;
	},
	setErrorPearl : function(cc){
		bd.setErrorBorder(bd.borders,2);
		ans.setCellLineError(cc,1);
		if(bd.getLineBorder(bd.cell[cc].ub())==1){ ans.setCellLineError(bd.cell[cc].up(),0);}
		if(bd.getLineBorder(bd.cell[cc].db())==1){ ans.setCellLineError(bd.cell[cc].dn(),0);}
		if(bd.getLineBorder(bd.cell[cc].lb())==1){ ans.setCellLineError(bd.cell[cc].lt(),0);}
		if(bd.getLineBorder(bd.cell[cc].rb())==1){ ans.setCellLineError(bd.cell[cc].rt(),0);}
	},

	checkPearlLine : function(){
		for(var c=0;c<bd.cell.length;c++){ if(bd.getQuesCell(c)!=0 && ans.lcntCell(c)==0){ bd.setErrorCell([c],1); return false;} }
		return true;
	},

	//---------------------------------------------------------
	decodeCircle : function(bstr,flag){
		var i, w;
		var pos;

		if(bstr){ pos = Math.min(int((k.qcols*k.qrows+2)/3), bstr.length);}
		else{ pos = 0;}

		for(i=0;i<pos;i++){
			var ca = parseInt(bstr.charAt(i),27);
			for(w=0;w<3;w++){
				if(i*3+w<k.qcols*k.qrows){
					if     (int(ca/Math.pow(3,2-w))%3==1){ bd.setQuesCell(i*3+w,41);}
					else if(int(ca/Math.pow(3,2-w))%3==2){ bd.setQuesCell(i*3+w,42);}
				}
			}
		}

		return bstr.substring(pos,bstr.length);
	},
	encodeCircle : function(flag){
		var i, j, num, pass;
		var cm = "";

		num = 0; pass = 0;
		for(i=0;i<bd.cell.length;i++){
			if     (bd.getQuesCell(i)==41){ pass+=(  Math.pow(3,2-num));}
			else if(bd.getQuesCell(i)==42){ pass+=(2*Math.pow(3,2-num));}
			num++; if(num==3){ cm += pass.toString(27); num=0; pass=0;}
		}
		if(num>0){ cm += pass.toString(27);}

		return cm;
	}
};
