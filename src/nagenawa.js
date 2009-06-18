//
// �p�Y���ŗL�X�N���v�g�� �Ȃ��Ȃ�� nagenawa.js v3.1.9p1
//

function setting(){
	// �O���[�o���ϐ��̏����ݒ�
	if(!k.qcols){ k.qcols = 8;}	// �Ֆʂ̉���
	if(!k.qrows){ k.qrows = 8;}	// �Ֆʂ̏c��
	k.irowake = 1;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

	k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
	k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
	k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

	k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
	k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
	k.isborderCross   = 1;	// 1:������������p�Y��
	k.isCenterLine    = 1;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
	k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

	k.dispzero      = 1;	// 1:0��\�����邩�ǂ���
	k.isDispHatena  = 1;	// 1:qnum��-2�̂Ƃ��ɁH��\������
	k.isAnsNumber   = 0;	// 1:�񓚂ɐ�������͂���p�Y��
	k.isArrowNumber = 0;	// 1:������������͂���p�Y��
	k.isOneNumber   = 1;	// 1:�����̖��̐�����1��������p�Y��
	k.isDispNumUL   = 1;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
	k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

	k.BlackCell     = 1;	// 1:���}�X����͂���p�Y��
	k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
	k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

	k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
	k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

	k.fstruct = ["arearoom","cellqnum","borderline","cellqansnum"];

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

		base.setTitle("�Ȃ��Ȃ�","Nagenawa");
		base.setExpression("�@�h���b�O�Ő����A�}�X�̃N���b�N�Ł��~(�⏕�L��)�����͂ł��܂��B",
						   " Left Button Drag to input lines, Click to input auxiliary marks.");
		base.setFloatbgcolor("rgb(0, 127, 0)");
	},
	menufix : function(){
		menu.addRedLineToFlags();
	},
	postfix : function(){ },

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(kc.isZ ^ menu.getVal('dispred')){ this.dispRedLine(x,y); return;}
			if(k.mode==1) this.inputborder(x,y);
			else if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
			}
		};
		mv.mouseup = function(x,y){
			if(this.notInputted() && !(kc.isZ ^ menu.getVal('dispred'))){
				if(k.mode==1){
					if(!kp.enabled()){ this.inputqnum(x,y,99);}
					else{ kp.display(x,y);}
				}
				else if(k.mode==3) this.inputMB(x,y);
			}
		};
		mv.mousemove = function(x,y,e){
			if(kc.isZ ^ menu.getVal('dispred')){ this.dispRedLine(x,y); return;}
			if(k.mode==1) this.inputborder(x,y);
			else if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
			}
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(ca=='z' && !this.keyPressed){ this.isZ=true; return;}
			if(k.mode==3){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca,99);
		};
		kc.keyup = function(ca){ if(ca=='z'){ this.isZ=false;}};
		kc.isZ = false;

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
		pc.BDlinecolor = "rgb(191, 191, 191)";
		pc.MBcolor = "rgb(63, 160, 255)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawErrorCells(x1,y1,x2,y2);

			this.drawNumbers(x1,y1,x2,y2);

			this.drawBDline2(x1,y1,x2,y2);
			this.drawBorders(x1,y1,x2,y2);

		//	this.drawPekes(x1,y1,x2,y2,0);
			this.drawMBs(x1,y1,x2,y2);
			this.drawLines(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	pzlinput : function(type, bstr){
		if(type==0 || type==1){
			bstr = enc.decodeBorder(bstr);
			bstr = enc.decodeRoomNumber16(bstr);
		}
	},
	pzloutput : function(type){
		if(type==0)     { document.urloutput.ta.value = enc.getURLbase()+"?"+k.puzzleid+this.pzldata();}
		else if(type==1){ document.urloutput.ta.value = enc.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
		else if(type==3){ document.urloutput.ta.value = enc.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
	},
	pzldata : function(){
		return "/"+k.qcols+"/"+k.qrows+"/"+enc.encodeBorder()+enc.encodeRoomNumber16();
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	check : function(){

		var cnt=0; var i;
		for(i=0;i<bd.border.length;i++){ if(bd.getLineBorder(i)==1){ cnt++;} }
		if( cnt==0 ){ ans.setAlert('����������Ă��܂���B','There is no line on the board.'); return false;}

		var rarea = ans.searchRarea();
		if( !ans.checkOneNumber(rarea, function(top,lcnt){ return (top>=0 && top<lcnt);}, function(cc){ return ans.lcnts.cell[cc]>0;}) ){
			ans.setAlert('�����̂��镔���Ɛ����ʉ߂���}�X�̐����Ⴂ�܂��B','The number of the cells that is passed any line in the room and the number written in the room is diffrerent.'); return false;
		}

		if( !ans.checkLcntCell(3) ){
			ans.setAlert('���򂵂Ă����������܂��B','There is a branch line.'); return false;
		}
		if( !ans.checkLcntCell(1) ){
			ans.setAlert('�r���œr�؂�Ă����������܂��B', 'There is a dead-end line.'); return false;
		}

		if( !ans.checkOneNumber(rarea, function(top,lcnt){ return (top>=0 && top>lcnt);}, function(cc){ return ans.lcnts.cell[cc]>0;}) ){
			ans.setAlert('�����̂��镔���Ɛ����ʉ߂���}�X�̐����Ⴂ�܂��B','The number of the cells that is passed any line in the room and the number written in the room is diffrerent.'); return false;
		}

		if( !this.checkAllLoopRect() ){
			ans.setAlert('�����`�������`�łȂ��ւ���������܂��B','There is a non-rectangle loop.'); return false;
		}

		return true;
	},

	checkAllLoopRect : function(){
		var xarea = ans.searchXarea();
		for(var r=1;r<=xarea.max;r++){
			if(!this.isLoopRect(xarea.room[r])){
				bd.setErrorBorder(bd.borders,2);
				bd.setErrorBorder(xarea.room[r],1);
				return false;
			}
		}
		return true;
	},
	isLoopRect : function(list){
		var x1=2*k.qcols; var x2=0; var y1=2*k.qrows; var y2=0;
		for(var i=0;i<list.length;i++){
			if(x1>bd.border[list[i]].cx){ x1=bd.border[list[i]].cx;}
			if(x2<bd.border[list[i]].cx){ x2=bd.border[list[i]].cx;}
			if(y1>bd.border[list[i]].cy){ y1=bd.border[list[i]].cy;}
			if(y2<bd.border[list[i]].cy){ y2=bd.border[list[i]].cy;}
		}
		for(var i=0;i<list.length;i++){
			if(bd.border[list[i]].cx!=x1 && bd.border[list[i]].cx!=x2 && bd.border[list[i]].cy!=y1 && bd.border[list[i]].cy!=y2){ return false;}
		}
		return true;
	}
};
