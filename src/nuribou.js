//
// �p�Y���ŗL�X�N���v�g�� �ʂ�ڂ��� nuribou.js v3.1.9p2
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

	k.dispzero      = 0;	// 1:0��\�����邩�ǂ���
	k.isDispHatena  = 1;	// 1:qnum��-2�̂Ƃ��ɁH��\������
	k.isAnsNumber   = 0;	// 1:�񓚂ɐ�������͂���p�Y��
	k.isArrowNumber = 0;	// 1:������������͂���p�Y��
	k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
	k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
	k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

	k.BlackCell     = 1;	// 1:���}�X����͂���p�Y��
	k.NumberIsWhite = 1;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
	k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

	k.ispzprv3ONLY  = 0;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
	k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

	k.fstruct = ["cellqnum","cellans"];

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

		base.setTitle("�ʂ�ڂ�","Nuribou");
		base.setExpression("�@���N���b�N�ō��}�X���A�E�N���b�N�Ŕ��}�X�m��}�X�����͂ł��܂��B",
						   " Left Click to input black cells, Right Click to input determined white cells.");
		base.setFloatbgcolor("rgb(96, 96, 96)");
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
			if(k.mode==1){
				if(!kp.enabled()){ this.inputqnum(x,y,99);}
				else{ kp.display(x,y);}
			}
			else if(k.mode==3) this.inputcell(x,y);
		};
		mv.mouseup = function(x,y){ };
		mv.mousemove = function(x,y){
			if(k.mode==3) this.inputcell(x,y);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.mode==3){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca,99);
		};

		if(k.callmode == "pmake"){
			kp.generate(0, true, false, '');
			kp.kpinput = function(ca){
				kc.key_inputqnum(ca,99);
			};
		}
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.bcolor = "rgb(127, 255, 127)";
		pc.errcolor1 = "rgb(192, 0, 0)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);

			this.drawWhiteCells(x1,y1,x2,y2);
			this.drawBDline(x1,y1,x2,y2);
			this.drawBlackCells(x1,y1,x2,y2);

			this.drawNumbers(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	pzlinput : function(type, bstr){
		if(type==0 || type==1){ bstr = enc.decodeNumber16(bstr);}
	},
	pzloutput : function(type){
		if(type==0)     { document.urloutput.ta.value = enc.getURLbase()+"?"+k.puzzleid+this.pzldata();}
		else if(type==1){ document.urloutput.ta.value = enc.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
		else if(type==3){ document.urloutput.ta.value = enc.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
	},
	pzldata : function(){
		return "/"+k.qcols+"/"+k.qrows+"/"+enc.encodeNumber16();
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	check : function(){

		var barea = ans.searchBarea();
		if( !ans.checkAllArea(barea, function(id){ return (bd.getQansCell(id)==1);}, function(w,h,a){ return (w==1 || h==1);} ) ){
			ans.setAlert('�u���P�}�X�A�����P�}�X�ȏ�v�ł͂Ȃ����}�X�̃J�^�}��������܂��B','There is a mass of black cells, whose width is more than two.'); return false;
		}

		if( !this.checkCorners(barea) ){
			ans.setAlert('�����ʐς̍��}�X�̃J�^�}�����A�p�����L���Ă��܂��B','Masses of black cells whose length is the same share a corner.'); return false;
		}

		var warea = ans.searchWarea();
		if( !ans.checkQnumsInArea(warea, function(a){ return (a==0);}) ){
			ans.setAlert('�����̓����Ă��Ȃ��V�}������܂��B','An area of white cells has no numbers.'); return false;
		}

		if( !ans.checkQnumsInArea(warea, function(a){ return (a>=2);}) ){
			ans.setAlert('1�̃V�}��2�ȏ�̐����������Ă��܂��B','An area of white cells has plural numbers.'); return false;
		}

		if( !ans.checkNumberAndSize(warea) ){
			ans.setAlert('�����ƃV�}�̖ʐς��Ⴂ�܂��B','The number is not equal to the number of the size of the area.'); return false;
		}

		return true;
	},

	checkCorners : function(area){
		var cc1, cc2;
		for(var c=0;c<bd.cell.length;c++){
			if(bd.cell[c].cx==k.qcols-1 || bd.cell[c].cy==k.qrows-1){ continue;}
			var cc1, cc2;
			if     ( bd.getQansCell(c)==1 && bd.getQansCell(c+k.qcols+1)==1 ){ cc1 = c; cc2 = c+k.qcols+1;}
			else if( bd.getQansCell(c+1)==1 && bd.getQansCell(c+k.qcols)==1 ){ cc1 = c+1; cc2 = c+k.qcols;}
			else{ continue;}
			if(ans.getCntOfRoom(area, area.check[cc1]) == ans.getCntOfRoom(area, area.check[cc2])){
				bd.setErrorCell(area.room[area.check[cc1]],1);
				bd.setErrorCell(area.room[area.check[cc2]],1);
				return false;
			}
		}
		return true;
	}
};
