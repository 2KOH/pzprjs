//
// �p�Y���ŗL�X�N���v�g�� �N���V���[�g�� kurochute.js v3.1.9
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
	k.isDispHatena  = 1;	// 1:qnum��-2�̂Ƃ��ɁH��\������
	k.isAnsNumber   = 0;	// 1:�񓚂ɐ�������͂���p�Y��
	k.isArrowNumber = 0;	// 1:������������͂���p�Y��
	k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
	k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
	k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

	k.BlackCell     = 1;	// 1:���}�X����͂���p�Y��
	k.NumberIsWhite = 1;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
	k.RBBlackCell   = 1;	// 1:�A�����f�ւ̃p�Y��

	k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
	k.isKanpenExist = 1;	// 1:pencilbox/�J���y���ɂ���p�Y��

	k.fstruct = ["cellqnum", "cellqanssub"];

	//k.def_csize = 36;
	//k.def_psize = 16;
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

		base.setTitle("�N���V���[�g","Kurochute");
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
			if(k.mode==1) this.inputqnum(x,y,Math.max(k.qcols,k.qrows)-1);
			else if(k.mode==3) this.inputcell(x,y);
		};
		mv.mouseup = function(x,y){
			if(k.mode==3 && this.notInputted()) this.inputqsub(x,y);
		};
		mv.mousemove = function(x,y){
			if(k.mode==3) this.inputcell(x,y);
		};
		mv.inputqsub = function(x,y){
			var cc = this.cellid(new Pos(x,y));
			if(cc==-1){ return;}

			if     (bd.getQsubCell(cc)==0){ bd.setQsubCell(cc,2);}
			else if(bd.getQsubCell(cc)==2){ bd.setQsubCell(cc,0);}
			pc.paintCell(cc);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.mode==3){ return;}
			if(this.key_inputdirec(ca)){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca,Math.max(k.qcols,k.qrows)-1);
		};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(127, 127, 127)";
		pc.qsubcolor1 = "white";
		pc.qsubcolor2 = "rgb(255, 255, 160)";
		pc.BCell_fontcolor = "rgb(96,96,96)";

		pc.paint = function(x1,y1,x2,y2){
			x2++; y2++;
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawQSubCells(x1,y1,x2,y2);
			this.drawDots(x1,y1,x2,y2);
			this.drawBDline(x1,y1,x2,y2);
			this.drawBlackCells(x1,y1,x2,y2);

			this.drawNumbers(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};
		pc.drawDots = function(x1,y1,x2,y2){
			var dsize = k.cwidth*0.06;
			var clist = this.cellinside(x1,y1,x2,y2,function(c){ return (bd.getQansCell(c)!=1);});
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.getQsubCell(c)==1){
					g.fillStyle = this.dotcolor;
					if(this.vnop("c"+c+"_dot_",1)){
						g.beginPath();
						g.arc(bd.cell[c].px()+k.cwidth/2, bd.cell[c].py()+k.cheight/2, dsize, 0, Math.PI*2, false);
						g.fill();
					}
				}
				else{ this.vhide("c"+c+"_dot_");}
			}
			this.vinc();
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	pzlinput : function(type, bstr){
		if(type==0 || type==1){ bstr = enc.decodeNumber16(bstr);}
		else if(type==2){ bstr = this.decodeKanpen(bstr);}
	},

	pzloutput : function(type){
		if(type==0)     { document.urloutput.ta.value = enc.getURLbase()+"?"+k.puzzleid+this.pzldata();}
		else if(type==1){ document.urloutput.ta.value = enc.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
		else if(type==2){ document.urloutput.ta.value = enc.kanpenbase()+"kurochute.html?problem="+this.pzldataKanpen();}
		else if(type==3){ document.urloutput.ta.value = enc.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
	},
	pzldata : function(){
		return "/"+k.qcols+"/"+k.qrows+"/"+enc.encodeNumber16();
	},

	//---------------------------------------------------------
	decodeKanpen : function(bstr){
		bstr = (bstr.split("_")).join(" ");
		fio.decodeCell( function(c,ca){
			if(ca != "0"){ bd.setQnumCell(c, parseInt(ca));}
		},bstr.split("/"));
		return "";
	},
	pzldataKanpen : function(){
		return ""+k.qrows+"/"+k.qcols+"/"+fio.encodeCell( function(c){
			if     (bd.getQnumCell(c)>=0) { return (bd.getQnumCell(c).toString() + "_");}
			else                          { return "0_";}
		});
	},

	//---------------------------------------------------------
	kanpenOpen : function(array){
		fio.decodeCell( function(c,ca){
			if     (ca == "#"){ bd.setQansCell(c, 1);}
			else if(ca == "+"){ bd.setQsubCell(c, 1);}
			else if(ca != "."){ bd.setQnumCell(c, parseInt(ca));}
		},array.slice(0,k.qrows));
	},
	kanpenSave : function(){
		return ""+fio.encodeCell( function(c){
			if     (bd.getQnumCell(c)>=0) { return (bd.getQnumCell(c).toString() + " ");}
			else if(bd.getQansCell(c)==1) { return "# ";}
			else if(bd.getQsubCell(c)==1) { return "+ ";}
			else                          { return ". ";}
		});
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

		if( !this.checkCellNumber() ){
			ans.setAlert('�����̐��������ꂽ�}�X�̂����A1�}�X�������}�X�ɂȂ��Ă��܂���B','The number of black cells at aparted cell by the number is not one.'); return false;
		}

		return true;
	},
	check1st : function(){ return true;},

	checkCellNumber : function(){
		var cx, cy;

		for(var c=0;c<bd.cell.length;c++){
			if(bd.getQnumCell(c)<0){ continue;}
			var cx=bd.cell[c].cx, cy=bd.cell[c].cy, num=bd.getQnumCell(c), cnt=0;
			if(bd.getQansCell(bd.getcnum(cx-num,cy))==1){ cnt++;}
			if(bd.getQansCell(bd.getcnum(cx+num,cy))==1){ cnt++;}
			if(bd.getQansCell(bd.getcnum(cx,cy-num))==1){ cnt++;}
			if(bd.getQansCell(bd.getcnum(cx,cy+num))==1){ cnt++;}
			if(cnt!=1){
				bd.setErrorCell([c],4);
				bd.setErrorCell([bd.getcnum(cx-num,cy),bd.getcnum(cx+num,cy),bd.getcnum(cx,cy-num),bd.getcnum(cx,cy+num)],1);
				return false;
			}
		}
		return true;
	}
};
