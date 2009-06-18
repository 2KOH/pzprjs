//
// �p�Y���ŗL�X�N���v�g�� ���W������ yajilin.js v3.1.9p1
//

function setting(){
	// �O���[�o���ϐ��̏����ݒ�
	if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
	if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
	k.irowake = 1;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

	k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
	k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
	k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

	k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
	k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
	k.isborderCross   = 0;	// 1:������������p�Y��
	k.isCenterLine    = 1;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
	k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

	k.dispzero      = 1;	// 1:0��\�����邩�ǂ���
	k.isDispHatena  = 1;	// 1:qnum��-2�̂Ƃ��ɁH��\������
	k.isAnsNumber   = 0;	// 1:�񓚂ɐ�������͂���p�Y��
	k.isArrowNumber = 1;	// 1:������������͂���p�Y��
	k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
	k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
	k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

	k.BlackCell     = 1;	// 1:���}�X����͂���p�Y��
	k.NumberIsWhite = 1;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
	k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

	k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
	k.isKanpenExist = 1;	// 1:pencilbox/�J���y���ɂ���p�Y��

	k.fstruct = ["celldirecnum","cellans","borderline"];

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

		if(k.callmode=="pmake"){
			base.setExpression("�@���́A�}�E�X�̍��h���b�O���ASHIFT�����Ȃ�����L�[�œ��͂ł��܂��B",
							   " To input Arrows, Left Button Drag or Press arrow key with SHIFT key.");
		}
		else{
			base.setExpression("�@���h���b�O�Ő����A���N���b�N�ō��}�X�����͂ł��܂��B",
							   " Left Button Drag to input black cells, Left Click to input black cells.");
		}
		base.setTitle("���W����","Yajilin");
		base.setFloatbgcolor("rgb(0, 224, 0)");
	},
	menufix : function(){
		menu.addUseToFlags();
		menu.addRedLineToFlags();
	},
	postfix : function(){ },

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(kc.isZ ^ menu.getVal('dispred')){ this.dispRedLine(x,y); return;}
			if(k.mode==1) this.inputdirec(x,y);
			else if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};
		mv.mouseup = function(x,y){
			if(this.notInputted() && !(kc.isZ ^ menu.getVal('dispred'))){
				if(k.mode==1) this.inputqnum(x,y,99);
				else if(k.mode==3) this.inputcell(x,y);
			}
		};
		mv.mousemove = function(x,y){
			if(kc.isZ ^ menu.getVal('dispred')){ this.dispRedLine(x,y); return;}
			if(k.mode==1) this.inputdirec(x,y);
			else if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};

		// ���������������Ȃ��̂ŏ㏑��
		bd.isnoLPup    = function(cc){ return (bd.getQansCell(cc)==1||bd.getQnumCell(cc)!=-1);},
		bd.isnoLPdown  = function(cc){ return (bd.getQansCell(cc)==1||bd.getQnumCell(cc)!=-1);},
		bd.isnoLPleft  = function(cc){ return (bd.getQansCell(cc)==1||bd.getQnumCell(cc)!=-1);},
		bd.isnoLPright = function(cc){ return (bd.getQansCell(cc)==1||bd.getQnumCell(cc)!=-1);},

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(ca=='z' && !this.keyPressed){ this.isZ=true; return;}
			if(k.mode==3){ return;}
			if(this.key_inputdirec(ca)){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca,99);
		};
		kc.keyup = function(ca){ if(ca=='z'){ this.isZ=false;}};
		kc.isZ = false;
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(127, 127, 127)";
		pc.errbcolor1 = "rgb(255, 160, 160)";
		pc.linecolor = "rgb(0, 127, 0)";
		pc.dotcolor = "rgb(255, 96, 191)";
		pc.BCell_fontcolor = "rgb(96,96,96)";

		pc.paint = function(x1,y1,x2,y2){
			x2++; y2++;
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawWhiteCells(x1,y1,x2,y2);
			this.drawBDline2(x1,y1,x2,y2);
			this.drawBlackCells(x1,y1,x2,y2);

			this.drawArrowNumbers(x1,y1,x2,y2);

			this.drawLines(x1,y1,x2,y2);
			this.drawPekes(x1,y1,x2,y2,1);

			this.drawChassis(x1,y1,x2,y2);

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	pzlinput : function(type, bstr){
		if(type==0 || type==1){ bstr = enc.decodeArrowNumber16(bstr);}
		else if(type==2)      { bstr = this.decodeKanpen(bstr); }
	},

	pzloutput : function(type){
		if(type==0)     { document.urloutput.ta.value = enc.getURLbase()+"?"+k.puzzleid+this.pzldata();}
		else if(type==1){ document.urloutput.ta.value = enc.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
		else if(type==2){ document.urloutput.ta.value = enc.kanpenbase()+"yajilin.html?problem="+this.pzldataKanpen();}
		else if(type==3){ document.urloutput.ta.value = enc.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
	},
	pzldata : function(){
		return "/"+k.qcols+"/"+k.qrows+"/"+enc.encodeArrowNumber16();
	},

	decodeKanpen : function(bstr){
		bstr = (bstr.split("_")).join(" ");
		fio.decodeCell( function(c,ca){
			if(ca != "."){
				var num = parseInt(ca);
				if     (num<16){ bd.setDirecCell(c,1); bd.setQnumCell(c,num   );}
				else if(num<32){ bd.setDirecCell(c,3); bd.setQnumCell(c,num-16);}
				else if(num<48){ bd.setDirecCell(c,2); bd.setQnumCell(c,num-32);}
				else if(num<64){ bd.setDirecCell(c,4); bd.setQnumCell(c,num-48);}
			}
		},bstr.split("/"));
	},
	pzldataKanpen : function(){
		return ""+k.qrows+"/"+k.qcols+"/"+fio.encodeCell( function(c){
			var num = (bd.getQnumCell(c)>=0&&bd.getQnumCell(c)<10?bd.getQnumCell(c):0)
			if     (bd.getDirecCell(c)==1){ return ""+( 0+num)+"_";}
			else if(bd.getDirecCell(c)==3){ return ""+(16+num)+"_";}
			else if(bd.getDirecCell(c)==2){ return ""+(32+num)+"_";}
			else if(bd.getDirecCell(c)==4){ return ""+(48+num)+"_";}
			else                          { return "._";}
		});
	},

	//---------------------------------------------------------
	kanpenOpen : function(array){
		fio.decodeCell( function(c,ca){
			if     (ca=="#"){ bd.setQansCell(c,1);}
			else if(ca=="+"){ bd.setQsubCell(c,1);}
			else if(ca != "."){
				var num = parseInt(ca);
				if     (num<16){ bd.setDirecCell(c,1); bd.setQnumCell(c,num   );}
				else if(num<32){ bd.setDirecCell(c,3); bd.setQnumCell(c,num-16);}
				else if(num<48){ bd.setDirecCell(c,2); bd.setQnumCell(c,num-32);}
				else if(num<64){ bd.setDirecCell(c,4); bd.setQnumCell(c,num-48);}
			}
		},array.slice(0,k.qrows));
		fio.decodeBorderLine(array.slice(k.qrows,3*k.qrows-1));
	},
	kanpenSave : function(){
		return ""+fio.encodeCell( function(c){
			var num = (bd.getQnumCell(c)>=0&&bd.getQnumCell(c)<10?bd.getQnumCell(c):0)
			if     (bd.getDirecCell(c)==1){ return ""+( 0+num)+" ";}
			else if(bd.getDirecCell(c)==3){ return ""+(16+num)+" ";}
			else if(bd.getDirecCell(c)==2){ return ""+(32+num)+" ";}
			else if(bd.getDirecCell(c)==4){ return ""+(48+num)+" ";}
			else if(bd.getQansCell (c)==1){ return "# ";}
			else if(bd.getQsubCell (c)==1){ return "+ ";}
			else                          { return ". ";}
		})
		+fio.encodeBorderLine();
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	check : function(){

		if( !ans.checkLcntCell(3) ){
			ans.setAlert('���򂵂Ă����������܂��B','There is a branched line.'); return false;
		}
		if( !ans.checkLcntCell(4) ){
			ans.setAlert('�������Ă����������܂��B','There is a crossing line.'); return false;
		}

		if( !ans.checkAllCell(function(c){ return (ans.lcntCell(c)>0 && bd.getQansCell(c)==1);}) ){
			ans.setAlert('���}�X�̏�ɐ���������Ă��܂��B','Theer is a line on the black cell.'); return false;
		}

		if( !ans.checkSideCell(function(c1,c2){ return (bd.getQansCell(c1)==1 && bd.getQansCell(c2)==1);}) ){
			ans.setAlert('���}�X���^�e���R�ɘA�����Ă��܂��B','Black cells are adjacent.'); return false;
		}

		if( !this.checkArrowNumber() ){
			ans.setAlert('���̕����ɂ��鍕�}�X�̐�������������܂���B','The number of black cells are not correct.'); return false;
		}

		if( !ans.checkLcntCell(1) ){
			ans.setAlert('�r�؂�Ă����������܂��B','There is a dead-end line.'); return false;
		}

		if( !ans.checkOneLoop() ){
			ans.setAlert('�ւ�������ł͂���܂���B','There are plural loops.'); return false;
		}

		if( !ans.checkAllCell(function(c){ return (ans.lcntCell(c)==0 && bd.getQansCell(c)!=1 && bd.getQnumCell(c)==-1);}) ){
			ans.setAlert('���}�X������������Ă��Ȃ��}�X������܂��B','Theer is an empty cell.'); return false;
		}

		return true;
	},
	check1st : function(){ return ans.checkLcntCell(1);},

	checkArrowNumber : function(){
		for(var c=0;c<bd.cell.length;c++){
			if(bd.getQnumCell(c)<0 || bd.getDirecCell(c)==0 || bd.getQansCell(c)==1){ continue;}
			var cx = bd.cell[c].cx, cy = bd.cell[c].cy, dir = bd.getDirecCell(c);
			var cnt=0;
			if     (dir==1){ cy--; while(cy>=0     ){ if(bd.getQansCell(bd.getcnum(cx,cy))==1){cnt++;} cy--;} }
			else if(dir==2){ cy++; while(cy<k.qrows){ if(bd.getQansCell(bd.getcnum(cx,cy))==1){cnt++;} cy++;} }
			else if(dir==3){ cx--; while(cx>=0     ){ if(bd.getQansCell(bd.getcnum(cx,cy))==1){cnt++;} cx--;} }
			else if(dir==4){ cx++; while(cx<k.qcols){ if(bd.getQansCell(bd.getcnum(cx,cy))==1){cnt++;} cx++;} }

			if(bd.getQnumCell(c)!=cnt){
				bd.setErrorCell([c],1);
				cx = bd.cell[c].cx, cy = bd.cell[c].cy;
				if     (dir==1){ cy--; while(cy>=0     ){ bd.setErrorCell([bd.getcnum(cx,cy)],1); cy--;} }
				else if(dir==2){ cy++; while(cy<k.qrows){ bd.setErrorCell([bd.getcnum(cx,cy)],1); cy++;} }
				else if(dir==3){ cx--; while(cx>=0     ){ bd.setErrorCell([bd.getcnum(cx,cy)],1); cx--;} }
				else if(dir==4){ cx++; while(cx<k.qcols){ bd.setErrorCell([bd.getcnum(cx,cy)],1); cx++;} }
				return false;
			}
		}
		return true;
	}
};
