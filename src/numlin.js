//
// �p�Y���ŗL�X�N���v�g�� �i���o�[�����N�� numlin.js v3.1.9p2
//

function setting(){
	// �O���[�o���ϐ��̏����ݒ�
	if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
	if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
	k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

	k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
	k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
	k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

	k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
	k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
	k.isborderCross   = 0;	// 1:������������p�Y��
	k.isCenterLine    = 1;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
	k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

	k.dispzero      = 0;	// 1:0��\�����邩�ǂ���
	k.isDispHatena  = 1;	// 1:qnum��-2�̂Ƃ��ɁH��\������
	k.isAnsNumber   = 0;	// 1:�񓚂ɐ�������͂���p�Y��
	k.isArrowNumber = 0;	// 1:������������͂���p�Y��
	k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
	k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
	k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

	k.BlackCell     = 0;	// 1:���}�X����͂���p�Y��
	k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
	k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

	k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
	k.isKanpenExist = 1;	// 1:pencilbox/�J���y���ɂ���p�Y��

	k.fstruct = ["cellqnum", "borderline"];

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

		base.setTitle("�@�i���o�[�����N","Numberlink");
		base.setExpression("�@���h���b�O�Ő����A�E�h���b�O�Ł~�󂪓��͂ł��܂��B",
						   " Left Button Drag to input black cells, Right Click to input a cross.");
		base.setFloatbgcolor("rgb(96, 96, 96)");
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
			if(k.mode==1){
				if(!kp.enabled()){ this.inputqnum(x,y,99);}
				else{ kp.display(x,y);}
			}
			else if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};
		mv.mouseup = function(x,y){ };
		mv.mousemove = function(x,y){
			if(kc.isZ ^ menu.getVal('dispred')){ this.dispRedLine(x,y); return;}
			if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
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
		pc.BDlinecolor = "rgb(127, 127, 127)";

		pc.errcolor1 = "rgb(192, 0, 0)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);

			this.drawErrorCells(x1,y1,x2,y2);

			this.drawBDline(x1,y1,x2,y2);

			this.drawPekes(x1,y1,x2,y2,0);
			this.drawLines(x1,y1,x2,y2);

			this.drawCellSquare(x1,y1,x2,y2);
			this.drawNumbers(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};

		pc.drawCellSquare = function(x1,y1,x2,y2){
			var mgnw = int(k.cwidth*0.15);
			var mgnh = int(k.cheight*0.15);

			var clist = this.cellinside(x1-2,y1-2,x2+2,y2+2,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.getQnumCell(c)!=-1){
					if     (bd.getErrorCell(c)==1){ g.fillStyle = this.errbcolor1;}
					else if(bd.getErrorCell(c)==2){ g.fillStyle = this.errbcolor2;}
					else                          { g.fillStyle = "white";}

					if(this.vnop("c"+c+"_sq_",1)){ g.fillRect(bd.cell[c].px()+mgnw+1, bd.cell[c].py()+mgnh+1, k.cwidth-mgnw*2-1, k.cheight-mgnh*2-1);}
				}
				else{ this.vhide("c"+c+"_sq_");}
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
		else if(type==2){ document.urloutput.ta.value = enc.kanpenbase()+"numberlink.html?problem="+this.pzldataKanpen();}
		else if(type==3){ document.urloutput.ta.value = enc.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
	},
	pzldata : function(){
		return "/"+k.qcols+"/"+k.qrows+"/"+enc.encodeNumber16();
	},
	pzldataKanpen : function(){
		return ""+k.qrows+"/"+k.qcols+"/"+fio.encodeCell( function(c){
			if     (bd.getQnumCell(c)>=0) { return (bd.getQnumCell(c).toString() + "_");}
			else                          { return "._";}
		});
	},

	//---------------------------------------------------------
	kanpenOpen : function(array){
		fio.decodeCell( function(c,ca){ if(ca != "."){ bd.setQnumCell(c, parseInt(ca));} },array.slice(0,k.qrows));
		fio.decodeBorderLine(array.slice(k.qrows,3*k.qrows-1));
	},
	kanpenSave : function(){
		return ""+fio.encodeCell( function(c){
			if     (bd.getQnumCell(c)>=0) { return (bd.getQnumCell(c).toString() + " ");}
			else                          { return ". ";}
		})
		+fio.encodeBorderLine();
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	check : function(){
		ans.performAsLine = true;

		if( !ans.checkLcntCell(3) ){
			ans.setAlert('���򂵂Ă����������܂��B','There is a branch line.'); return false;
		}
		if( !ans.checkLcntCell(4) ){
			ans.setAlert('�����������Ă��܂��B','There is a crossing line.'); return false;
		}

		var larea = ans.searchLarea();
		if( !ans.checkQnumsInArea(larea, function(a){ return (a>=3);}) ){
			ans.setAlert('3�ȏ�̐������Ȃ����Ă��܂��B','Three or more numbers are connected.'); return false;
		}

		if( !ans.checkSameObjectInRoom(larea, bd.getQnumCell.bind(bd)) ){
			ans.setAlert('�قȂ鐔�����Ȃ����Ă��܂��B','Different numbers are connected.'); return false;
		}

		if( !this.check2Line() ){
			ans.setAlert('�����̏������ʉ߂��Ă��܂��B','A line goes through a number.'); return false;
		}
		if( !this.check1Line() ){
			ans.setAlert('�r�؂�Ă����������܂��B','There is a dead-end line.'); return false;
		}
		if( !ans.checkDisconnectLine(larea) ){
			ans.setAlert('�����ɂȂ����Ă��Ȃ���������܂��B','A line doesn\'t connect any number.'); return false;
		}

		if( !this.checkNumber() ){
			ans.setAlert('�ǂ��ɂ��Ȃ����Ă��Ȃ�����������܂��B','A number is not connected another number.'); return false;
		}

		return true;
	},
	check1st : function(){ return true;},

	check1Line : function(){ return this.checkLine(function(i){ return (ans.lcntCell(i)==1 && bd.getQnumCell(i)==-1);}); },
	check2Line : function(){ return this.checkLine(function(i){ return (ans.lcntCell(i)>=2 && bd.getQnumCell(i)!=-1);}); },
	checkLine : function(func){
		for(var c=0;c<bd.cell.length;c++){
			if(func(c)){
				bd.setErrorBorder(bd.borders,2);
				ans.setCellLineError(c,true);
				return false;
			}
		}
		return true;
	},

	checkNumber : function(){
		for(var c=0;c<bd.cell.length;c++){
			if(ans.lcntCell(c)==0 && bd.getQnumCell(c)!=-1){
				bd.setErrorCell(c,1);
				return false;
			}
		}
		return true;
	}
};
