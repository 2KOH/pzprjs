//
// �p�Y���ŗL�X�N���v�g�� �R�[�W������ cojun.js v3.1.9p1
//

function setting(){
	// �O���[�o���ϐ��̏����ݒ�
	if(!k.qcols){ k.qcols = 8;}	// �Ֆʂ̉���
	if(!k.qrows){ k.qrows = 8;}	// �Ֆʂ̏c��
	k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

	k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
	k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
	k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

	k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
	k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
	k.isborderCross   = 0;	// 1:������������p�Y��
	k.isCenterLine    = 0;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
	k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

	k.dispzero      = 0;	// 1:0��\�����邩�ǂ���

	k.isDispHatena  = 1;	// 1:qnum��-2�̂Ƃ��ɁH��\������
	k.isAnsNumber   = 1;	// 1:�񓚂ɐ�������͂���p�Y��
	k.isArrowNumber = 0;	// 1:������������͂���p�Y��
	k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
	k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
	k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

	k.BlackCell     = 0;	// 1:���}�X����͂���p�Y��
	k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
	k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

	k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
	k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

	k.fstruct = ["borderques", "cellqnum", "cellqanssub"];

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

		base.setTitle("�R�[�W����","Cojun");
		base.setExpression("�L�[�{�[�h��}�E�X�Ő�������͂ł��܂��B",
						   " Inputting number is available by keybord or mouse");
		base.setFloatbgcolor("rgb(64, 64, 64)");
	},
	menufix : function(){
		if(k.callmode=="pmake"){ kp.defaultdisp = true;}
	},
	postfix : function(){
		room.setEnable();
		this.roommaxfunc = function(cc,mode){ return room.getCntOfRoomByCell(cc);};
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(k.mode==1) this.borderinput = this.inputborder(x,y);
			if(k.mode==3){
				if(!kp.enabled()){ this.inputqnum(x,y,99);}
				else{ kp.display(x,y);}
			}
		};
		mv.mouseup = function(x,y){
			if(this.notInputted()){
				if(k.mode==1){
					if(!kp.enabled()){ this.inputqnum(x,y,99);}
					else{ kp.display(x,y);}
				}
			}
		};
		mv.mousemove = function(x,y){
			if(k.mode==1 && this.btn.Left) this.inputborder(x,y);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca,99);
		};

		kp.generate(0, true, true, '');
		kp.kpinput = function(ca){ kc.key_inputqnum(ca,99);};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(160, 160, 160)";

		pc.errbcolor1 = "rgb(255, 160, 160)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawErrorCells(x1,y1,x2,y2);

			this.drawBDline(x1,y1,x2,y2);

			this.drawNumbers(x1,y1,x2,y2);

			this.drawBorders(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawTCell(x1,y1,x2+1,y2+1);
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	pzlinput : function(type, bstr){
		if(type==0 || type==1){
			bstr = enc.decodeBorder(bstr);
			bstr = enc.decodeNumber16(bstr);
		}
	},
	pzloutput : function(type){
		if(type==0)     { document.urloutput.ta.value = enc.getURLbase()+"?"+k.puzzleid+this.pzldata();}
		else if(type==1){ document.urloutput.ta.value = enc.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
		else if(type==3){ document.urloutput.ta.value = enc.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
	},
	pzldata : function(){
		return "/"+k.qcols+"/"+k.qrows+"/"+enc.encodeBorder()+enc.encodeNumber16();
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	check : function(){

		var rarea = ans.searchRarea();
		if( !this.checkDifferentNumber(rarea) ){
			ans.setAlert('1�̕����ɓ������������������Ă��܂��B','A room has two or more same numbers.'); return false;
		}

		if( !ans.checkSideCell(function(c1,c2){ return (puz.getNum(c1)>0 && puz.getNum(c1)==puz.getNum(c2));}) ){
			ans.setAlert('�����������^�e���R�ɘA�����Ă��܂��B','Same numbers are adjacent.'); return false;
		}

		if( !this.checkUpperNumber(rarea) ){
			ans.setAlert('���������ŏ�ɏ���������������Ă��܂��B','There is an small number on big number in a room.'); return false;
		}

		if( !ans.checkAllCell(function(c){ return (puz.getNum(c)==-1);}) ){
			ans.setAlert('�����̓����Ă��Ȃ��}�X������܂��B','There is a empty cell.'); return false;
		}

		return true;
	},
	check1st : function(){ return ans.checkAllCell(function(c){ return (puz.getNum(c)==-1);});},

	checkDifferentNumber : function(area){
		for(var r=1;r<=area.max;r++){
			var d = new Array();
			for(var i=1;i<=99;i++){ d[i]=-1;}
			for(var i=0;i<area.room[r].length;i++){
				var val=this.getNum(area.room[r][i]);
				if     (val==-1 || val==-2){ continue;}
				else if(d[val]==-1){ d[val] = area.room[r][i]; continue;}

				bd.setErrorCell(area.room[r],1);
				return false;
			}
		}
		return true;
	},
	checkUpperNumber : function(area){
		for(var c=0;c<bd.cell.length-k.qcols;c++){
			var dc = bd.cell[c].dn();
			if(area.check[c]!=area.check[dc] || this.getNum(c)<=0 || this.getNum(dc)<=0){ continue;}
			if(this.getNum(dc)>this.getNum(c)){
				bd.setErrorCell([c,dc],1);
				return false;
			}
		}
		return true;
	},
	getNum : function(cc){
		if(cc<0||cc>=bd.cell.length){ return -1;}
		return (bd.getQnumCell(cc)!=-1?bd.getQnumCell(cc):bd.getQansCell(cc));
	}
};
