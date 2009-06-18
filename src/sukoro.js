//
// �p�Y���ŗL�X�N���v�g�� ���R���� sukoro.js v3.1.9p1
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
	k.isAnsNumber   = 1;	// 1:�񓚂ɐ�������͂���p�Y��
	k.isArrowNumber = 0;	// 1:������������͂���p�Y��
	k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
	k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
	k.NumberWithMB  = 1;	// 1:�񓚂̐����Ɓ��~������p�Y��

	k.BlackCell     = 0;	// 1:���}�X����͂���p�Y��
	k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
	k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

	k.ispzprv3ONLY  = 0;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
	k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

	k.fstruct = ["cellqnum", "cellqanssub"];

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

		base.setTitle("���R��","Sukoro");
		base.setExpression("�@�}�X�̃N���b�N��L�[�{�[�h�Ő�������͂ł��܂��BQAZ�L�[�Ł��AWSX�L�[�Ł~����͂ł��܂��B",
					   " It is available to input number by keybord or mouse. Each QAZ key to input auxiliary circle, each WSX key to input auxiliary cross.");
		base.setFloatbgcolor("rgb(64, 64, 64)");
	},
	menufix : function(){ },
	postfix : function(){ },

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(!kp.enabled()){ this.inputqnum(x,y,4);}
			else{ kp.display(x,y);}
		};
		mv.mouseup = function(x,y){ };
		mv.mousemove = function(x,y){
			//this.inputqnum(x,y,4);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(this.moveTCell(ca)){ return;}
			if(puz.key_sukoro(ca)){ return;}
			this.key_inputqnum(ca,4);
		};

		kp.generate(99, true, true, this.kpgenerate);
		kp.kpinput = function(ca){
			if(puz.key_sukoro(ca)){ return;}
			kc.key_inputqnum(ca,4);
		};
	},
	key_sukoro : function(ca){
		if(k.mode==1 || bd.getQnumCell(tc.getTCC())!=-1){ return false;}

		var cc = tc.getTCC();
		var flag = false;

		if     ((ca=='q'||ca=='a'||ca=='z')){ if(bd.getQsubCell(cc)==1){ bd.setQansCell(cc,1); bd.setQsubCell(cc,0);}else{ bd.setQansCell(cc,-1); bd.setQsubCell(cc,1);} flag = true;}
		else if((ca=='w'||ca=='s'||ca=='x')){ if(bd.getQsubCell(cc)==2){ bd.setQansCell(cc,2); bd.setQsubCell(cc,0);}else{ bd.setQansCell(cc,-1); bd.setQsubCell(cc,2);} flag = true;}
		else if((ca=='e'||ca=='d'||ca=='c')){ bd.setQansCell(cc,-1); bd.setQsubCell(cc,0); flag = true;}
		else if(ca=='1' && bd.getQansCell(cc)==1){ bd.setQansCell(cc,-1); bd.setQsubCell(cc,1); flag = true;}
		else if(ca=='2' && bd.getQansCell(cc)==2){ bd.setQansCell(cc,-1); bd.setQsubCell(cc,2); flag = true;}

		if(flag){ pc.paint(bd.cell[cc].cx, bd.cell[cc].cy, bd.cell[cc].cx, bd.cell[cc].cy); return true;}
		return false;
	},

	kpgenerate : function(mode){
		kp.inputcol('num','knum1','1','1');
		kp.inputcol('num','knum2','2','2');
		kp.inputcol('num','knum3','3','3');
		kp.inputcol('num','knum4','4','4');
		kp.insertrow();
		if(mode==1){
			kp.inputcol('num','knum.','-','?');
			kp.inputcol('num','knum_',' ',' ');
			kp.inputcol('empty','knumx','','');
			kp.inputcol('empty','knumy','','');
			kp.insertrow();
		}
		else{
			kp.tdcolor = pc.MBcolor;
			kp.inputcol('num','knumq','q','��');
			kp.inputcol('num','knumw','w','�~');
			kp.tdcolor = "black";
			kp.inputcol('num','knum_',' ',' ');
			kp.inputcol('empty','knumx','','');
			kp.insertrow();
		}
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		this.MBcolor = "rgb(64, 255, 64)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawErrorCells(x1,y1,x2,y2);

			this.drawBDline(x1,y1,x2,y2);

			this.drawMBs(x1,y1,x2,y2);
			this.drawNumbers(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawTCell(x1,y1,x2+1,y2+1);
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	pzlinput : function(type, bstr){
		if(type==0 || type==1){ bstr = enc.decodeNumber10(bstr);}
	},
	pzloutput : function(type){
		if(type==0)     { document.urloutput.ta.value = enc.getURLbase()+"?"+k.puzzleid+this.pzldata();}
		else if(type==1){ document.urloutput.ta.value = enc.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
		else if(type==3){ document.urloutput.ta.value = enc.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
	},
	pzldata : function(){
		return "/"+k.qcols+"/"+k.qrows+"/"+enc.encodeNumber10();
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	check : function(){

		if( !ans.checkSideCell(function(c1,c2){ return (puz.getNum(c1)>0 && puz.getNum(c1)==puz.getNum(c2));}) ){
			ans.setAlert('�����������^�e���R�ɘA�����Ă��܂��B','Same numbers are adjacent.'); return false;
		}

		if( !this.checkCellNumber() ){
			ans.setAlert('�����ƁA���̐����̏㉺���E�ɓ��鐔���̐�����v���Ă��܂���B','The number of numbers placed in four adjacent cells is not equal to the number.'); return false;
		}

		if( !ans.linkBWarea( ans.searchBWarea(function(id){ return (id!=-1 && puz.getNum(id)!=-1); }) ) ){
			ans.setAlert('�^�e���R�ɂȂ����Ă��Ȃ�����������܂��B','Numbers are devided.'); return false;
		}

		return true;
	},

	checkCellNumber : function(){
		for(var c=0;c<bd.cell.length;c++){
			if(this.getNum(c)>=0 && this.getNum(c)!=ans.checkdir4Cell(c,function(a){ return (puz.getNum(a)!=-1);})){
				bd.setErrorCell([c],1);
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
