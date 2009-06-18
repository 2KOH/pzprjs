//
// �p�Y���ŗL�X�N���v�g�� �X���U�[�����N�� slither.js v3.1.0
//

function setting(){
	// �O���[�o���ϐ��̏����ݒ�
	if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
	if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
	k.outside = 0;			// 1:�Ֆʂ̊O����ID��p�ӂ���
	k.dispzero = 1;			// 1:0��\�����邩�ǂ���
	k.irowake = 1;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

	k.iscross = 0;			// 1:Cross������\�ȃp�Y��
	k.isborder = 1;			// 1:Border/Line������\�ȃp�Y��
	k.isoutsidecross = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
	k.isborderCross = 0;	// 1:������������p�Y��
	k.isborderAsLine = 1;	// 1:���E����line�Ƃ��Ĉ���

	k.isDispHatena = 1;		// 1:qnum��-2�̂Ƃ��ɁH��\������
	k.isAnsNumber = 0;		// 1:�񓚂ɐ�������͂���p�Y��
	k.isOneNumber = 0;		// 1:�����̖��̐�����1��������p�Y��
	k.isDispNumUL = 0;		// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
	k.NumberWithMB = 0,		// 1:�񓚂̐����Ɓ��~������p�Y��

	k.BlackCell = 0;		// 1:���}�X����͂���p�Y��
	k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
	k.RBBlackCell = 0,		// 1:�A�����f�ւ̃p�Y��

	k.ispzprv3ONLY  = 1,	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
	k.isKanpenExist = 1,	// 1:pencilbox/�J���y���ɂ���p�Y��

	k.fstruct = ["cellqnum","borderans2"];

	//k.def_csize = 36;
	//k.def_psize = 24;
}

//-------------------------------------------------------------
// Puzzle�ʃN���X�̒�`
Puzzle = Class.create();
Puzzle.prototype = {
	initialize : function(){
		this.input_init();
		this.graphic_init();

		$("expression").innerHTML = "�@���h���b�O�Ő����A�E�N���b�N�ŃZ���̔w�i�F(��/���F)�����͂ł��܂��B";
	},

	//---------------------------------------------------------
	// html�Ȃǂ̕\���ݒ���s��
	gettitle : function(){
		return "�X���U�[�����N";
	},
	smenubgcolor : function(){
		return "rgb(32, 32, 32)";
	},

	//---------------------------------------------------------
	// "������@"�֘A�֐��Q
//	useclick : function(e){
//		if(Event.element(e).id=="use1"){ use = 1;}
//		else if(Event.element(e).id=="use2"){ use = 2;}
//		this.usedisp();
//	},
	usearea : function(){
//		$("usepanel").innerHTML = "������@ |&nbsp;";
//		new Insertion.Bottom("usepanel", "<div class=\"flag\" id=\"use1\">���E�{�^��</div>&nbsp;");
//		new Insertion.Bottom("usepanel", "<div class=\"flag\" id=\"use2\">1�{�^��</div>&nbsp;");
//		//new Insertion.Bottom("usepanel", "<a href=\"use.html\" target=_blank>������@�̐���</a>");
//
//		Event.observe($("use1"), 'click', this.useclick.bindAsEventListener(this), false);
//		Event.observe($("use2"), 'click', this.useclick.bindAsEventListener(this), false);
//		unselectable($("use1"));
//		unselectable($("use2"));
//
//		this.usedisp();
	},
//	usedisp : function(){
//		if(use==1)		{ $("use1").className = "flagsel"; $("use2").className = "flag";}
//		else if(use==2)	{ $("use1").className = "flag"; $("use2").className = "flagsel";}
//	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(k.mode==1){
				this.inputqnum(x,y,3);
			}
			else if(k.mode==3){
				if(this.btn.Left) this.inputborderans(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};
		mv.mouseup = function(x,y){ };
		mv.mousemove = function(x,y){
			if(k.mode==3){
				if(this.btn.Left) this.inputborderans(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};
		mv.inputBGcolor = function(x,y){
			var cc = this.cellid(new Pos(x,y));
			if(cc==-1 || cc==this.mouseCell){ return;}
			if(this.inputData==-1){
				if     (bd.getQsubCell(cc)==0){ this.inputData=1;}
				else if(bd.getQsubCell(cc)==1){ this.inputData=2;}
				else                          { this.inputData=0;}
			}
			bd.setQsubCell(cc, this.inputData);

			this.mouseCell = cc; 

			pc.paint(bd.cell[cc].cx, bd.cell[cc].cy, bd.cell[cc].cx, bd.cell[cc].cy);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.mode==3){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca,3);
		};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BorderQanscolor = "rgb(0, 160, 0)";
		pc.fontErrcolor = "red";

		pc.crosssize = 0.05;

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

		//	this.drawBDline2(x1,y1,x2,y2);
			this.drawBorders(x1,y1,x2,y2);

			this.drawBaseMarks(x1,y1,x2,y2);

			this.drawNumbers(x1,y1,x2,y2);

			if(Prototype.Browser.IE){ this.drawPekes(x1,y1,x2,y2,1);}
			else{ this.drawPekes(x1,y1,x2,y2,0);}

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}
		};

		pc.drawBaseMarks = function(x1,y1,x2,y2){
			var i;
			for(i=0;i<(k.qcols+1)*(k.qrows+1);i++){
				var cx = i%(k.qcols+1); var cy = int(i/(k.qcols+1));

				if(cx < x1-1 || x2+1 < cx){ continue;}
				if(cy < y1-1 || y2+1 < cy){ continue;}

				this.drawBaseMark1(i);
			}

			this.vinc();
		};
		pc.drawBaseMark1 = function(i){
			var lw = (int(k.cwidth/12)>=3?int(k.cwidth/12):3); //LineWidth
			var csize = int((lw+1)/2);

			var cx = i%(k.qcols+1); var cy = int(i/(k.qcols+1));

			g.fillStyle = this.crossnumcolor;
			g.beginPath();
			g.arc(k.p0.x+cx*k.cwidth, k.p0.x+cy*k.cheight, csize, 0, Math.PI*2, false);
			if(this.vnop("x"+i+"_cm_",1)){ g.fill();}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	pzlinput : function(type){
		if(enc.bbox){
			var bstr = enc.bbox;

			bd.ansclear();
			um.allerase();
			um.callby = 1;
			if(type==0||type==1){ bstr = enc.decode4(bstr, bd.setQnumCell.bind(bd), k.qcols*k.qrows);}
			else if(type==2)    { bstr = this.decodeKanpen(bstr); }
			um.callby = 0;

			base.resize_canvas();
		}
	},
	decodeKanpen : function(bstr){
		bstr = (bstr.split("_")).join(" ");
		fio.decodeCell( function(c,ca){
			if(ca != "."){ bd.setQnumCell(c, parseInt(ca));}
		},bstr.split("/"));
		return "";
	},

	pzloutput : function(type){
		if(type==0)     { document.urloutput.ta.value = enc.getURLbase()+"?"+k.puzzleid+this.pzldata();}
		else if(type==1){ document.urloutput.ta.value = enc.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
		else if(type==2){ document.urloutput.ta.value = enc.kanpenbase()+"slitherlink.html?problem="+this.pzldataKanpen();}
		else if(type==3){ document.urloutput.ta.value = enc.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
	},
	pzldata : function(){
		return "/"+k.qcols+"/"+k.qrows+"/"+enc.encode4(bd.getQnumCell.bind(bd), k.qcols*k.qrows);
	},
	pzldataKanpen : function(){
		return ""+k.qrows+"/"+k.qcols+"/"+fio.encodeCell( function(c){
			if     (bd.getQnumCell(c)>=0) { return (bd.getQnumCell(c).toString() + "_");}
			else                          { return "._";}
		});
	},

	//---------------------------------------------------------
	kanpenOpen : function(array){
		fio.decodeCellQnum(array.slice(0,k.qrows));
		var func = function(c,ca){ if(ca == "1"){ bd.setQansBorder(c, 1);} else if(ca == "-1"){ bd.setQsubBorder(c, 2);} }
		fio.decodeObj(func, stack.slice(k.qrows    ,2*k.qrows+1), k.qcols  , function(cx,cy){return bd.getbnum(2*cx+1,2*cy  );});
		fio.decodeObj(func, stack.slice(2*k.qrows+1,3*k.qrows+1), k.qcols+1, function(cx,cy){return bd.getbnum(2*cx  ,2*cy+1);});
	},
	kanpenSave : function(){
		var func = function(c,ca){ if(bd.getQansBorder(c)==1){ return "1 ";} else if(bd.getQsubBorder(c)==2){ return "-1 ";} else{ return "0 ";} }

		return ""+fio.encodeCell( function(c){ if(bd.getQnumCell(c)>=0) { return (bd.getQnumCell(c).toString() + " ");} else{ return ". ";} })
		+fio.encodeObj(func, k.qcols  , k.qrows+1, function(cx,cy){return bd.getbnum(2*cx+1,2*cy  );})
		+fio.encodeObj(func, k.qcols+1, k.qrows  , function(cx,cy){return bd.getbnum(2*cx  ,2*cy+1);});
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	check : function(){

		if( !ans.checkLcntCross(3,0) ){
			alert('���򂵂Ă����������܂��B'); pc.paintAll(); return false;
		}
		if( !ans.checkLcntCross(4,0) ){
			alert('�����������Ă��܂��B'); pc.paintAll(); return false;
		}

		if( !ans.checkdir4Border() ){
			alert('�����̎���ɂ��鋫�E���̖{�����Ⴂ�܂��B'); pc.paintAll(); return false;
		}

		if( !ans.checkOneLoop() ){
			alert('�ւ�������ł͂���܂���B'); pc.paintAll(); return false;
		}

		if( !ans.checkLcntCross(1,0) ){
			alert('�r���œr�؂�Ă����������܂��B'); pc.paintAll(); return false;
		}

		alert('�����ł��I');
		return true;
	}
};
