//
// �p�Y���ŗL�X�N���v�g�� ���B�E�� view.js v3.1.9p1
//

function setting(){
	// �O���[�o���ϐ��̏����ݒ�
	if(!k.qcols){ k.qcols = 8;}	// �Ֆʂ̉���
	if(!k.qrows){ k.qrows = 8;}	// �Ֆʂ̏c��
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

		base.setTitle("���B�E","View");
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
			if(!kp.enabled()){ this.inputqnum(x,y,Math.min(k.qcols+k.qrows-2,99));}
			else{ kp.display(x,y);}
		};
		mv.mouseup = function(x,y){ };
		mv.mousemove = function(x,y){
			//this.inputqnum(x,y,Math.min(k.qcols+k.qrows-2,99));
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(this.moveTCell(ca)){ return;}
			if(puz.key_view(ca)){ return;}
			this.key_inputqnum(ca,Math.min(k.qcols+k.qrows-2,99));
		};

		kp.generate(99, true, true, this.kpgenerate);
		kp.kpinput = function(ca){
			if(puz.key_view(ca)){ return;}
			kc.key_inputqnum(ca,Math.min(k.qcols+k.qrows-2,99));
		};
	},
	key_view : function(ca){
		if(k.mode==1 || bd.getQnumCell(tc.getTCC())!=-1){ return false;}

		var cc = tc.getTCC();
		var flag = false;

		if     ((ca=='q'||ca=='a'||ca=='z')){ bd.setQansCell(cc,-1); bd.setQsubCell(cc,1); flag = true;}
		else if((ca=='w'||ca=='s'||ca=='x')){ bd.setQansCell(cc,-1); bd.setQsubCell(cc,2); flag = true;}
		else if((ca=='e'||ca=='d'||ca=='c')){ bd.setQansCell(cc,-1); bd.setQsubCell(cc,0); flag = true;}
		else if(ca=='1' && bd.getQansCell(cc)==1){ bd.setQansCell(cc,-1); bd.setQsubCell(cc,1); flag = true;}
		else if(ca=='2' && bd.getQansCell(cc)==2){ bd.setQansCell(cc,-1); bd.setQsubCell(cc,2); flag = true;}

		if(flag){ pc.paint(bd.cell[cc].cx, bd.cell[cc].cy, bd.cell[cc].cx, bd.cell[cc].cy); return true;}
		return false;
	},

	kpgenerate : function(mode){
		if(mode==3){
			kp.tdcolor = pc.MBcolor;
			kp.inputcol('num','knumq','q','��');
			kp.inputcol('num','knumw','w','�~');
			kp.tdcolor = "black";
			kp.inputcol('empty','knumx','','');
			kp.inputcol('empty','knumy','','');
			kp.insertrow();
		}
		kp.inputcol('num','knum0','0','0');
		kp.inputcol('num','knum1','1','1');
		kp.inputcol('num','knum2','2','2');
		kp.inputcol('num','knum3','3','3');
		kp.insertrow();
		kp.inputcol('num','knum4','4','4');
		kp.inputcol('num','knum5','5','5');
		kp.inputcol('num','knum6','6','6');
		kp.inputcol('num','knum7','7','7');
		kp.insertrow();
		kp.inputcol('num','knum8','8','8');
		kp.inputcol('num','knum9','9','9');
		kp.inputcol('num','knum_',' ',' ');
		((mode==1)?kp.inputcol('num','knum.','-','?'):kp.inputcol('empty','knumz','',''));
		kp.insertrow();
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.errbcolor2 = "rgb(127, 255, 127)";

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

		if( !ans.checkSideCell(function(c1,c2){ return (puz.getNum(c1)>=0 && puz.getNum(c1)==puz.getNum(c2));}) ){
			ans.setAlert('�����������^�e���R�ɘA�����Ă��܂��B','Same numbers are adjacent.'); return false;
		}

		if( !this.checkCellNumber() ){
			ans.setAlert('�����ƁA���̃}�X�ɂ��ǂ蒅���܂ł̃}�X�̐��̍��v����v���Ă��܂���B','Sum of four-way gaps to another number is not equal to the number.'); return false;
		}

		if( !ans.linkBWarea( ans.searchBWarea(function(id){ return (id!=-1 && puz.getNum(id)!=-1 && puz.getNum(id)!=-3); }) ) ){
			ans.setAlert('�^�e���R�ɂȂ����Ă��Ȃ�����������܂��B','Numbers are devided.'); return false;
		}

		if( !this.checkMB() ){
			ans.setAlert('�����̓����Ă��Ȃ��}�X������܂��B','There is a cell that is not filled in number.'); return false;
		}

		return true;
	},

	checkCellNumber : function(){
		for(var c=0;c<bd.cell.length;c++){
			if(this.getNum(c)<0){ continue;}

			var list = new Array();
			var cnt=0;
			var tx, ty;

			tx = bd.cell[c].cx-1; ty = bd.cell[c].cy;
			while(tx>=0)     { var cc=bd.getcnum(tx,ty); if(this.getNum(cc)==-1){ cnt++; list.push(cc); tx--;} else{ break;} }
			tx = bd.cell[c].cx+1; ty = bd.cell[c].cy;
			while(tx<k.qcols){ var cc=bd.getcnum(tx,ty); if(this.getNum(cc)==-1){ cnt++; list.push(cc); tx++;} else{ break;} }
			tx = bd.cell[c].cx; ty = bd.cell[c].cy-1;
			while(ty>=0)     { var cc=bd.getcnum(tx,ty); if(this.getNum(cc)==-1){ cnt++; list.push(cc); ty--;} else{ break;} }
			tx = bd.cell[c].cx; ty = bd.cell[c].cy+1;
			while(ty<k.qrows){ var cc=bd.getcnum(tx,ty); if(this.getNum(cc)==-1){ cnt++; list.push(cc); ty++;} else{ break;} }

			if(this.getNum(c)!=cnt){
				bd.setErrorCell([c],1);
				bd.setErrorCell(list,2);
				return false;
			}
		}
		return true;
	},
	getNum : function(cc){
		if(cc<0||cc>=bd.cell.length){ return -1;}
		if(bd.getQnumCell(cc)!=-1){ return bd.getQnumCell(cc);}
		if(bd.getQsubCell(cc)==1) { return -3;}
		return bd.getQansCell(cc);
	},

	checkMB : function(){
		for(var c=0;c<bd.cell.length;c++){
			if(bd.getQsubCell(c)==1){ bd.setErrorCell([c],1); return false;}
		}
		return true;
	}
};
