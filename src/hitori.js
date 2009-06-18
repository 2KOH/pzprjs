//
// �p�Y���ŗL�X�N���v�g�� �ЂƂ�ɂ��Ă���� hitori.js v3.1.9
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

	k.dispzero      = 0;	// 1:0��\�����邩�ǂ���
	k.isDispHatena  = 0;	// 1:qnum��-2�̂Ƃ��ɁH��\������
	k.isAnsNumber   = 0;	// 1:�񓚂ɐ�������͂���p�Y��
	k.isArrowNumber = 0;	// 1:������������͂���p�Y��
	k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
	k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
	k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

	k.BlackCell     = 1;	// 1:���}�X����͂���p�Y��
	k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
	k.RBBlackCell   = 1;	// 1:�A�����f�ւ̃p�Y��

	k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
	k.isKanpenExist = 1;	// 1:pencilbox/�J���y���ɂ���p�Y��

	k.fstruct = ["cellqnum", "cellans"];

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

		base.setTitle("�ЂƂ�ɂ��Ă���","Hitori");
		base.setExpression("�@���N���b�N�ō��}�X���A�E�N���b�N�Ŕ��}�X�m��}�X�����͂ł��܂��B",
						   " Left Click to input black cells, Right Click to input determined white cells.");
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
			if(k.mode==1) this.inputqnum(x,y,Math.max(k.qcols,k.qrows));
			else if(k.mode==3) this.inputcell(x,y);
		};
		mv.mouseup = function(x,y){ };
		mv.mousemove = function(x,y){
			if(k.mode==3) this.inputcell(x,y);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.mode==3){ return;}
			if(this.key_inputdirec(ca)){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca,Math.max(k.qcols,k.qrows));
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
		if(type==0 || type==1){ bstr = this.decodeHitori(bstr);}
		else if(type==2)      { bstr = this.decodeKanpen(bstr); }
	},

	pzloutput : function(type){
		if(type==0)     { document.urloutput.ta.value = enc.getURLbase()+"?"+k.puzzleid+this.pzldata();}
		else if(type==1){ document.urloutput.ta.value = enc.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
		else if(type==2){ document.urloutput.ta.value = enc.kanpenbase()+"hitori.html?problem="+this.pzldataKanpen();}
		else if(type==3){ document.urloutput.ta.value = enc.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
	},
	pzldata : function(){
		return "/"+k.qcols+"/"+k.qrows+"/"+this.encodeHitori();
	},

	decodeHitori : function(bstr){
		var c=0, i=0;
		for(i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i);

			if(enc.include(ca,"0","9")||enc.include(ca,"a","z")){ bd.setQnumCell(c, parseInt(bstr.substring(i,i+1),36)); c++;}
			else if(ca == '-'){ bd.setQnumCell(c, parseInt(bstr.substring(i+1,i+3),36)); c++; i+=2;}
			else if(ca == '%'){ bd.setQnumCell(c, -2);                                   c++;      }
			else{ c++;}

			if(c > bd.cell.length){ break;}
		}
		return bstr.substring(i,bstr.length);
	},
	encodeHitori : function(bstr){
		var count=0, cm="";
		for(var i=0;i<bd.cell.length;i++){
			var pstr = "";
			var val = bd.getQnumCell(i);

			if     (val==-2           ){ pstr = "%";}
			else if(val>= 0 && val< 16){ pstr =       val.toString(36);}
			else if(val>=16 && val<256){ pstr = "-" + val.toString(36);}
			else{ count++;}

			if(count==0){ cm += pstr;}
			else{ cm+="."; count=0;}
		}
		if(count>0){ cm+=".";}

		return cm;
	},

	//---------------------------------------------------------
	decodeKanpen : function(bstr){
		bstr = (bstr.split("_")).join(" ");
		fio.decodeCell( function(c,ca){
			if(ca != "."){ bd.setQnumCell(c, parseInt(ca));}
		},bstr.split("/"));
		return "";
	},
	pzldataKanpen : function(){
		return ""+k.qrows+"/"+k.qcols+"/"+fio.encodeCell( function(c){
			if     (bd.getQnumCell(c)>=0) { return (bd.getQnumCell(c).toString() + "_");}
			else                          { return "._";}
		});
	},

	//---------------------------------------------------------
	kanpenOpen : function(array){
		fio.decodeCell( function(c,ca){
			if(ca != "0"){ bd.setQnumCell(c, parseInt(ca));}
		},array.slice(0,k.qrows));
		fio.decodeCellAns(array.slice(k.qrows,2*k.qrows));
	},
	kanpenSave : function(){
		return ""+fio.encodeCell( function(c){
			if     (bd.getQnumCell(c)>0) { return (bd.getQnumCell(c).toString() + " ");}
			else                         { return "0 ";}
		})+
		fio.encodeCellAns();
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

		if( !this.checkRowsCols() ){
			ans.setAlert('������ɓ��������������Ă��܂��B','There are same numbers in a row.'); return false;
		}

		return true;
	},
	check1st : function(){ return true;},

	checkRowsCols : function(){
		var cx, cy;

		for(var cy=0;cy<k.qrows;cy++){
			var clist = new Array();
			for(var cx=0;cx<k.qcols;cx++){ if(bd.getQansCell(bd.getcnum(cx,cy))!=1){ clist.push(bd.getcnum(cx,cy));}}
			if(!this.checkDifferentNumberInClist(clist)){ return false;}
		}
		for(var cx=1;cx<k.qcols;cx++){
			var clist = new Array();
			for(var cy=0;cy<k.qrows;cy++){ if(bd.getQansCell(bd.getcnum(cx,cy))!=1){ clist.push(bd.getcnum(cx,cy));}}
			if(!this.checkDifferentNumberInClist(clist)){ return false;}
		}
		return true;
	},
	checkDifferentNumberInClist : function(clist){
		var d = new Array();
		for(var i=1;i<=Math.max(k.qcols,k.qrows);i++){ d[i]=-1;}
		for(var i=0;i<clist.length;i++){
			var val=bd.getQnumCell(clist[i]);
			if     (val==-1){ continue;}
			else if(d[val]==-1){ d[val] = bd.getQnumCell(clist[i]); continue;}

			for(var j=0;j<clist.length;j++){ if(bd.getQnumCell(clist[j])==val){ bd.setErrorCell([clist[j]],1);} }
			return false;
		}
		return true;
	}
};
