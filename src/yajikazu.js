//
// �p�Y���ŗL�X�N���v�g�� �₶���񂩂������ yajikazu.js v3.1.9p2
//

function setting(){
	// �O���[�o���ϐ��̏����ݒ�
	if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
	if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
	k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

	k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
	k.isborder     = 0;		// 1:Border/Line������\�ȃp�Y��
	k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

	k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
	k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
	k.isborderCross   = 0;	// 1:������������p�Y��
	k.isCenterLine    = 0;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
	k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

	k.dispzero      = 1;	// 1:0��\�����邩�ǂ���
	k.isDispHatena  = 1;	// 1:qnum��-2�̂Ƃ��ɁH��\������
	k.isAnsNumber   = 0;	// 1:�񓚂ɐ�������͂���p�Y��
	k.isArrowNumber = 1;	// 1:������������͂���p�Y��
	k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
	k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
	k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

	k.BlackCell     = 1;	// 1:���}�X����͂���p�Y��
	k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
	k.RBBlackCell   = 1;	// 1:�A�����f�ւ̃p�Y��

	k.ispzprv3ONLY  = 0;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
	k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

	k.fstruct = ["celldirecnum","cellans"];

	//k.def_csize = 36;
	k.def_psize = 16;
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

		if(k.callmode=="pmake"){
			base.setExpression("�@���́A�}�E�X�̍��h���b�O���ASHIFT�����Ȃ�����L�[�œ��͂ł��܂��B",
							   " To input Arrows, Left Button Drag or Press arrow key with SHIFT key.");
		}
		else{
			base.setExpression("�@���N���b�N�ō��}�X���A�E�N���b�N�Ŕ��}�X�m��}�X�����͂ł��܂��B",
							   " Left Click to input black cells, Right Click to input determined white cells.");
		}
		base.setTitle("�₶���񂩂�����","Yajisan-Kazusan");
		base.setFloatbgcolor("rgb(0, 224, 0)");
	},
	menufix : function(){
		menu.addUseToFlags();
	},
	postfix : function(){ },

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(k.mode==1) this.inputdirec(x,y);
			else if(k.mode==3) this.inputcell(x,y);
		};
		mv.mouseup = function(x,y){
			if(k.mode==1 && this.notInputted() && bd.getcnum(this.mouseCell.x,this.mouseCell.y)==this.cellid(new Pos(x,y))) this.inputqnum(x,y,99);
		};
		mv.mousemove = function(x,y){
			if(k.mode==1){
				if(this.notInputted()) this.inputdirec(x,y);
			}
			else if(k.mode==3) this.inputcell(x,y);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.mode==3){ return;}
			if(this.key_inputdirec(ca)){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca,99);
		};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(127, 127, 127)";
		pc.bcolor = "rgb(160, 255, 160)";
		pc.BCell_fontcolor = "rgb(96,96,96)";

		pc.paint = function(x1,y1,x2,y2){
			x2++; y2++;
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawWhiteCells(x1,y1,x2,y2);
			this.drawBDline2(x1,y1,x2,y2);
			this.drawBlackCells(x1,y1,x2,y2);

			this.drawArrowNumbers(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	pzlinput : function(type, bstr){
		if(type==0 || type==1){ bstr = enc.decodeArrowNumber16(bstr);}
	},

	pzloutput : function(type){
		if(type==0)     { document.urloutput.ta.value = enc.getURLbase()+"?"+k.puzzleid+this.pzldata();}
		else if(type==1){ document.urloutput.ta.value = enc.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
		else if(type==3){ document.urloutput.ta.value = enc.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
	},
	pzldata : function(){
		return "/"+k.qcols+"/"+k.qrows+"/"+enc.encodeArrowNumber16();
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	check : function(){

		if( !ans.checkSideCell(function(c1,c2){ return (bd.getQansCell(c1)==1 && bd.getQansCell(c2)==1);}) ){
			ans.setAlert('���}�X���^�e���R�ɘA�����Ă��܂��B','Black cells are adjacent.'); return false;
		}

		if( !ans.linkBWarea( ans.searchWarea() ) ){
			ans.setAlert('���}�X�����f����Ă��܂��B','White cells are devided.'); return false;
		}

		if( !this.checkArrowNumber() ){
			ans.setAlert('���̕����ɂ��鍕�}�X�̐�������������܂���B','The number of black cells are not correct.'); return false;
		}

		return true;
	},
	check1st : function(){ return true;},

	checkArrowNumber : function(){
		for(var c=0;c<bd.cell.length;c++){
			if(bd.getQnumCell(c)<0 || bd.getDirecCell(c)==0 || bd.getQansCell(c)==1){ continue;}
			var cx = bd.cell[c].cx, cy = bd.cell[c].cy, dir = bd.getDirecCell(c);
			var cnt=0;
			if     (dir==1){ cy--; while(cy>=0     ){ if(bd.getQansCell(bd.getcnum(cx,cy))==1){cnt++;} cy--;} }
			else if(dir==2){ cy++; while(cy<k.qrows){ if(bd.getQansCell(bd.getcnum(cx,cy))==1){cnt++;} cy++;} }
			else if(dir==3){ cx--; while(cx>=0     ){ if(bd.getQansCell(bd.getcnum(cx,cy))==1){cnt++;} cx--;} }
			else if(dir==4){ cx++; while(cx<k.qcols){ if(bd.getQansCell(bd.getcnum(cx,cy))==1){cnt++;} cx++;} }

			if(bd.getQnumCell(c)!=cnt){
				bd.setErrorCell([c],1);
				cx = bd.cell[c].cx, cy = bd.cell[c].cy;
				if     (dir==1){ cy--; while(cy>=0     ){ bd.setErrorCell([bd.getcnum(cx,cy)],1); cy--;} }
				else if(dir==2){ cy++; while(cy<k.qrows){ bd.setErrorCell([bd.getcnum(cx,cy)],1); cy++;} }
				else if(dir==3){ cx--; while(cx>=0     ){ bd.setErrorCell([bd.getcnum(cx,cy)],1); cx--;} }
				else if(dir==4){ cx++; while(cx<k.qcols){ bd.setErrorCell([bd.getcnum(cx,cy)],1); cx++;} }
				return false;
			}
		}
		return true;
	}
};
