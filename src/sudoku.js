//
// �p�Y���ŗL�X�N���v�g�� ���Ɣ� sudoku.js v3.1.9p2
//

function setting(){
	// �O���[�o���ϐ��̏����ݒ�
	if(!k.qcols){ k.qcols = 9;}	// �Ֆʂ̉���
	if(!k.qrows){ k.qrows = 9;}	// �Ֆʂ̏c��
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
	k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

	k.BlackCell     = 0;	// 1:���}�X����͂���p�Y��
	k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
	k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

	k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
	k.isKanpenExist = 1;	// 1:pencilbox/�J���y���ɂ���p�Y��

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

		base.setTitle("����","Sudoku");
		base.setExpression("�@�L�[�{�[�h��}�E�X�Ő��������͂ł��܂��B",
						   " It is available to input number by keybord or mouse");
		base.setFloatbgcolor("rgb(64, 64, 64)");

		var inhtml = "<span id=\"pop1_1_cap0\">�Ֆʂ�V�K�쐬���܂��B</span><br>\n";
		inhtml += "<input type=\"radio\" name=\"size\" value=\"9\" checked>9�~9<br>\n";
		inhtml += "<input type=\"radio\" name=\"size\" value=\"16\">16�~16<br>\n";
		inhtml += "<input type=\"radio\" name=\"size\" value=\"25\">25�~25<br>\n";
		inhtml += "<input type=\"radio\" name=\"size\" value=\"4\">4�~4<br>\n";
		inhtml += "<input type=\"button\" name=\"newboard\" value=\"�V�K�쐬\" /><input type=\"button\" name=\"cancel\" value=\"�L�����Z��\" />\n";
		$(document.newboard).html(inhtml);
	},
	menufix : function(){ },
	postfix : function(){ },

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(!kp.enabled()){ this.inputqnum(x,y,Math.max(k.qcols,k.qrows));}
			else{ kp.display(x,y);}
		};
		mv.mouseup = function(x,y){ };
		mv.mousemove = function(x,y){ };

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca,Math.max(k.qcols,k.qrows));
		};

		kp.generate(99, true, true, this.kpgenerate);
		kp.kpinput = function(ca){
			kc.key_inputqnum(ca,Math.max(k.qcols,k.qrows));
		};
	},

	kpgenerate : function(mode){
		kp.inputcol('num','knum1','1','1');
		kp.inputcol('num','knum2','2','2');
		kp.inputcol('num','knum3','3','3');
		kp.inputcol('num','knum4','4','4');
		kp.insertrow();
		kp.inputcol('num','knum5','5','5');
		kp.inputcol('num','knum6','6','6');
		kp.inputcol('num','knum7','7','7');
		kp.inputcol('num','knum8','8','8');
		kp.insertrow();
		kp.inputcol('num','knum9','9','9');
		kp.insertrow();
		if(mode==1){
			kp.inputcol('num','knum.','-','?');
			kp.inputcol('num','knum_',' ',' ');
		}
		else{
			kp.inputcol('empty','knumx','','');
			kp.inputcol('empty','knumy','','');
		}
		kp.inputcol('num','knum0','0','0');
		kp.insertrow();
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
			this.drawBlockBorders(x1,y1,x2,y2);

			this.drawNumbers(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawTCell(x1,y1,x2+1,y2+1);
		};
		pc.drawBlockBorders = function(x1,y1,x2,y2){
			var lw = this.lw, lm = this.lm;

			var max=k.qcols;
			var block=int(Math.sqrt(max)+0.1);

			if(x1<0){ x1=0;} if(x2>k.qcols-1){ x2=k.qcols-1;}
			if(y1<0){ y1=0;} if(y2>k.qrows-1){ y2=k.qrows-1;}

			g.fillStyle = "black";
			for(var i=1;i<block;i++){
				if(x1-1<=i*block&&i*block<=x2+1){ if(this.vnop("bbx"+i+"_")){
					g.fillRect(k.p0.x+i*block*k.cwidth-lw+1, k.p0.y+y1*k.cheight-lw+1, lw, (y2-y1+1)*k.cheight+2*lw-1);
				}}
			}
			for(var i=1;i<block;i++){
				if(y1-1<=i*block&&i*block<=y2+1){ if(this.vnop("bby"+i+"_")){
					g.fillRect(k.p0.x+x1*k.cwidth-lw+1, k.p0.y+i*block*k.cheight-lw+1, (x2-x1+1)*k.cwidth+2*lw-1, lw);
				}}
			}
			this.vinc();
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	pzlinput : function(type, bstr){
		if(type==0 || type==1){ bstr = enc.decodeNumber16(bstr);}
		else if(type==2)      { bstr = this.decodeKanpen(bstr); }
	},
	pzloutput : function(type){
		if(type==0)     { document.urloutput.ta.value = enc.getURLbase()+"?"+k.puzzleid+this.pzldata();}
		else if(type==1){ document.urloutput.ta.value = enc.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
		else if(type==2){ document.urloutput.ta.value = enc.kanpenbase()+"sudoku.html?problem="+this.encodeKanpen();}
		else if(type==3){ document.urloutput.ta.value = enc.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
	},
	pzldata : function(){
		return "/"+k.qcols+"/"+k.qrows+"/"+enc.encodeNumber16();
	},

	decodeKanpen : function(bstr){
		bstr = (bstr.split("_")).join(" ");
		fio.decodeCell( function(c,ca){
			if(ca != "."){ bd.setQnumCell(c, parseInt(ca));}
		},bstr.split("/"));
		return "";
	},
	encodeKanpen : function(){
		return ""+k.qcols+"/"+fio.encodeCell( function(c){
			if     (bd.getQnumCell(c)>=0) { return (bd.getQnumCell(c).toString() + "_");}
			else                          { return "._";}
		});
	},

	//---------------------------------------------------------
	kanpenOpen : function(array){
		fio.decodeCell( function(c,ca){
			if     (ca == "0"){ bd.setQnumCell(c, -2);}
			else if(ca != "."){ bd.setQnumCell(c, parseInt(ca));}
		},array.slice(0,k.qrows));
		fio.decodeCell( function(c,ca){
			if(ca!="."&&ca!="0"){ bd.setQansCell(c, parseInt(ca));}
		},array.slice(k.qrows,2*k.qrows));
	},
	kanpenSave : function(){
		return ""+fio.encodeCell( function(c){
			if     (bd.getQnumCell(c) > 0){ return (bd.getQnumCell(c).toString() + " ");}
			else if(bd.getQnumCell(c)==-2){ return "0 ";}
			else                          { return ". ";}
		})+
		fio.encodeCell( function(c){
			if     (bd.getQnumCell(c)!=-1){ return ". ";}
			else if(bd.getQansCell(c) > 0){ return (bd.getQansCell(c).toString() + " ");}
			else                          { return "0 ";}
		});
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	check : function(){

		if( !this.checkRoomNumber() ){
			ans.setAlert('�����u���b�N�ɓ��������������Ă��܂��B','There are same numbers in a block.'); return false;
		}

		if( !this.checkRowsCols() ){
			ans.setAlert('������ɓ��������������Ă��܂��B','There are same numbers in a row.'); return false;
		}

		if( !ans.checkAllCell(function(c){ return (puz.getNum(c)==-1);}) ){
			ans.setAlert('�����̓����Ă��Ȃ��}�X������܂��B','There is a empty cell.'); return false;
		}

		return true;
	},
	check1st : function(){ return ans.checkAllCell(function(c){ return (puz.getNum(c)==-1);});},

	checkRowsCols : function(){
		var cx, cy;

		for(var cy=0;cy<k.qrows;cy++){
			var clist = new Array();
			for(var cx=0;cx<k.qcols;cx++){ clist.push(bd.getcnum(cx,cy));}
			if(!this.checkDifferentNumberInClist(clist)){ return false;}
		}
		for(var cx=1;cx<k.qcols;cx++){
			var clist = new Array();
			for(var cy=0;cy<k.qrows;cy++){ clist.push(bd.getcnum(cx,cy));}
			if(!this.checkDifferentNumberInClist(clist)){ return false;}
		}
		return true;
	},
	checkRoomNumber : function(area){
		var max=k.qcols;
		var block=int(Math.sqrt(max)+0.1);
		for(var i=0;i<max;i++){
			var clist = new Array();
			for(var cx=(i%block)*block;cx<(i%block+1)*block;cx++){
				for(var cy=int(i/block)*block;cy<int(i/block+1)*block;cy++){ clist.push(bd.getcnum(cx,cy));}
			}
			if(!this.checkDifferentNumberInClist(clist)){ return false;}
		}
		return true;
	},
	checkDifferentNumberInClist : function(clist){
		var d = new Array();
		for(var i=1;i<=Math.max(k.qcols,k.qrows);i++){ d[i]=-1;}
		for(var i=0;i<clist.length;i++){
			var val=this.getNum(clist[i]);
			if     (val==-1){ continue;}
			else if(d[val]==-1){ d[val] = this.getNum(clist[i]); continue;}

			for(var j=0;j<clist.length;j++){ if(this.getNum(clist[j])==val){ bd.setErrorCell([clist[j]],1);} }
			return false;
		}
		return true;
	},
	getNum : function(cc){
		if(cc<0||cc>=bd.cell.length){ return -1;}
		if(bd.getQnumCell(cc)!=-1){ return bd.getQnumCell(cc);}
		if(bd.getQsubCell(cc)==1) { return -3;}
		return bd.getQansCell(cc);
	}
};
