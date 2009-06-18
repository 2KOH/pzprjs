//
// �p�Y���ŗL�X�N���v�g�� ���ƂɋA�낤�� kaero.js v3.1.9p1
//

function setting(){
	// �O���[�o���ϐ��̏����ݒ�
	if(!k.qcols){ k.qcols = 6;}	// �Ֆʂ̉���
	if(!k.qrows){ k.qrows = 6;}	// �Ֆʂ̏c��
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

	k.ispzprv3ONLY  = 0;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
	k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

	k.fstruct = ["cellqnumans","cellqanssub","borderques","borderline"];

	//k.def_csize = 36;
	//k.def_psize = 24;
}

//-------------------------------------------------------------
// Puzzle�ʃN���X�̒�`
Puzzle = function(){
	this.before = new Array();
	this.prefix();
};
Puzzle.prototype = {
	prefix : function(){
		this.input_init();
		this.graphic_init();

		base.setTitle("���ƂɋA�낤","Return Home");
		base.setExpression("�@���h���b�O�Ő����A�}�X�̃N���b�N�Ŕw�i�F�����͂ł��܂��B",
						   " Left Button Drag to input lines, Click the cell to input background color of the cell.");
		base.setFloatbgcolor("rgb(127,96,64)");
	},
	menufix : function(){ },
	postfix : function(){ },

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(k.mode==1){ this.inputborder(x,y);}
			else if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};
		mv.mouseup = function(x,y){
			if     (k.mode==1 && this.notInputted()){ this.inputqnum(x,y,99);}
			else if(k.mode==3 && this.notInputted()){ this.inputlight(x,y);}
		};
		mv.mousemove = function(x,y){
			if(k.mode==1){ this.inputborder(x,y);}
			else if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};
		mv.inputlight = function(x,y){
			var cc = this.cellid(new Pos(x,y));
			if(cc==-1){ return;}

			if     (bd.getQsubCell(cc)==0){ bd.setQsubCell(cc, (this.btn.Left?1:2));}
			else if(bd.getQsubCell(cc)==1){ bd.setQsubCell(cc, (this.btn.Left?2:0));}
			else if(bd.getQsubCell(cc)==2){ bd.setQsubCell(cc, (this.btn.Left?0:1));}
			pc.paint(bd.cell[cc].cx, bd.cell[cc].cy, bd.cell[cc].cx, bd.cell[cc].cy);
		}

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.mode==3){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum_kaero(ca);
		};
		kc.key_inputqnum_kaero = function(ca){
			var c = tc.getTCC();
			var max = 104;

			if('a'<=ca && ca<='z'){
				var num = parseInt(ca,36)-10;
				var canum = bd.getQnumCell(c);
				if     ((canum-1)%26==num && canum>0 && canum<=26){ bd.setQnumCell(c,canum+26);}
				else if((canum-1)%26==num){ bd.setQnumCell(c,-1);}
				else{ bd.setQnumCell(c,num+1);}
			}
			else if(ca=='-'){ bd.setQnumCell(c,(bd.getQnumCell(c)!=-2?-2:-1));}
			else if(ca==' '){ bd.setQnumCell(c,-1);}
			else{ return;}

			this.prev = c;
			pc.paintCell(tc.getTCC());
		};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(127, 127, 127)";
//		pc.errcolor1 = "rgb(192, 0, 0)";
		pc.qsubcolor1 = "rgb(224, 224, 255)";
		pc.qsubcolor2 = "rgb(255, 255, 144)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);

			this.drawQSubCells(x1,y1,x2,y2);

			this.drawBDline2(x1,y1,x2,y2);
			this.drawBorders(x1,y1,x2,y2);
			this.drawTip(x1,y1,x2,y2);

			this.drawPekes(x1,y1,x2,y2,0);
			this.drawLines(x1,y1,x2,y2);

			this.drawCellSquare(x1,y1,x2,y2);
			this.drawNumbers_kaero(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};

		pc.drawTip = function(x1,y1,x2,y2){
			var tsize = k.cwidth*0.30;
			var tplus = k.cwidth*0.05;

			var clist = this.cellinside(x1-2,y1-2,x2+2,y2+2,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				this.vhide(["c"+c+"_tp1_","c"+c+"_tp2_","c"+c+"_tp3_","c"+c+"_tp4_"]);
				if(ans.lcntCell(c)==1 && bd.getQnumCell(c)==-1){
					var dir=0, id=-1;
					if     (bd.getLineBorder(bd.cell[c].ub())==1){ dir=2; id=bd.cell[c].ub();}
					else if(bd.getLineBorder(bd.cell[c].db())==1){ dir=1; id=bd.cell[c].db();}
					else if(bd.getLineBorder(bd.cell[c].lb())==1){ dir=4; id=bd.cell[c].lb();}
					else if(bd.getLineBorder(bd.cell[c].rb())==1){ dir=3; id=bd.cell[c].rb();}

					g.lineWidth = (int(k.cwidth/12)>=3?int(k.cwidth/12):3); //LineWidth
					if     (bd.getErrorBorder(id)==1){ g.strokeStyle = this.errlinecolor1; g.lineWidth=g.lineWidth+1;}
					else if(bd.getErrorBorder(id)==2){ g.strokeStyle = this.errlinecolor2;}
					else                             { g.strokeStyle = this.linecolor;}

					if(this.vnop("c"+c+"_tp"+dir+"_",0)){
						var px=bd.cell[c].px()+k.cwidth/2+1, py=bd.cell[c].py()+k.cheight/2+1;
						if     (dir==1){ this.inputPath([px,py ,-tsize, tsize ,0,-tplus , tsize, tsize], false);}
						else if(dir==2){ this.inputPath([px,py ,-tsize,-tsize ,0, tplus , tsize,-tsize], false);}
						else if(dir==3){ this.inputPath([px,py , tsize,-tsize ,-tplus,0 , tsize, tsize], false);}
						else if(dir==4){ this.inputPath([px,py ,-tsize,-tsize , tplus,0 ,-tsize, tsize], false);}
						g.stroke();
					}
				}
			}
			this.vinc();
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
					else if(bd.getQsubCell(c)==1) { g.fillStyle = this.qsubcolor1;}
					else if(bd.getQsubCell(c)==2) { g.fillStyle = this.qsubcolor2;}
					else                          { g.fillStyle = "white";}

					if(this.vnop("c"+c+"_sq_",1)){ g.fillRect(bd.cell[c].px()+mgnw+1, bd.cell[c].py()+mgnh+1, k.cwidth-mgnw*2-1, k.cheight-mgnh*2-1);}
				}
				else{ this.vhide("c"+c+"_sq_");}
			}
			this.vinc();
		};
		pc.drawNumbers_kaero = function(x1,y1,x2,y2){
			var clist = this.cellinside(x1-2,y1-2,x2+2,y2+2,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.getQnumCell(c)==-1){
					if(bd.cell[c].numobj){ bd.cell[c].numobj.hide();}
				}
				else{
					if(!bd.cell[c].numobj){ bd.cell[c].numobj = this.CreateDOMAndSetNop();}
					var num=bd.getQnumCell(c);

					var color = this.fontErrcolor;
					if(bd.getErrorCell(c)==0){ color=this.fontcolor;}

					var text="";
					if     (num> 0&&num<= 26){ text+=(num+ 9).toString(36).toUpperCase();}
					else if(num>26&&num<= 52){ text+=(num-17).toString(36).toLowerCase();}

					this.dispnumCell1(c, bd.cell[c].numobj, 1, text, 0.85, color);
				}
			}
			this.vinc();
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	pzlinput : function(type, bstr){
		if(type==0 || type==1){
			bstr = enc.decodeBorder(bstr);
			bstr = this.decodeKaero(bstr);
		}
	},
	pzloutput : function(type){
		if(type==0)     { document.urloutput.ta.value = enc.getURLbase()+"?"+k.puzzleid+this.pzldata();}
		else if(type==1){ document.urloutput.ta.value = enc.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
		else if(type==3){ document.urloutput.ta.value = enc.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
	},
	pzldata : function(){
		return "/"+k.qcols+"/"+k.qrows+"/"+enc.encodeBorder()+this.encodeKaero();
	},

	decodeKaero : function(bstr){
		// �ՖʊO�����̃f�R�[�h
		var c=0, a=0;
		for(var i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i);

			if     (enc.include(ca,'0','9')){ bd.setQnumCell(c, parseInt(ca,36)+27); c++;}
			else if(enc.include(ca,'A','Z')){ bd.setQnumCell(c, parseInt(ca,36)-9); c++;}
			else if(ca=="-"){ bd.setQnumCell(c, 37+parseInt(bstr.charAt(i+1),36)); c++; i++;}
			else if(ca=="."){ bd.setQnumCell(c, -2); c++;}
			else if(enc.include(ca,'a','z')){ c+=(parseInt(ca,36)-9);}
			else{ c++;}

			if(c >= bd.cell.length){ a=i+1; break;}
		}
		return bstr.substring(a,bstr.length);
	},
	encodeKaero : function(){
		var cm="", count=0;
		for(var c=0;c<bd.cell.length;c++){
			var pstr = "";
			var qnum = bd.getQnumCell(c);
			if     (qnum==-2){ pstr = ".";}
			else if(qnum>= 1 && qnum<=26){ pstr = ""+ (qnum+9).toString(36).toUpperCase();}
			else if(qnum>=27 && qnum<=36){ pstr = ""+ (qnum-27).toString(10);}
			else if(qnum>=37 && qnum<=72){ pstr = "-"+ (qnum-37).toString(36).toUpperCase();}
			else{ count++;}

			if(count==0){ cm += pstr;}
			else if(pstr||count==26){ cm+=((9+count).toString(36).toLowerCase()+pstr); count=0;}
		}
		if(count>0){ cm+=(9+count).toString(36).toLowerCase();}
		return cm;
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
		if( !ans.checkQnumsInArea(larea, function(a){ return (a>=2);}) ){
			ans.setAlert('�A���t�@�x�b�g���q�����Ă��܂��B','There are connected letters.'); return false;
		}
		if( !this.checkLineOverLetter() ){
			ans.setAlert('�A���t�@�x�b�g�̏������ʉ߂��Ă��܂��B','A line goes through a letter.'); return false;
		}

		var rarea = ans.searchRarea();
		this.movedPosition(larea);
		ans.performAsLine = false;
		if( !ans.checkSameObjectInRoom(rarea, this.getMoved.bind(this)) ){
			ans.setAlert('�P�̃u���b�N�ɈقȂ�A���t�@�x�b�g�������Ă��܂��B','A block has plural kinds of letters.'); return false;
		}
		if( !ans.checkObjectRoom(rarea, this.getMoved.bind(this)) ){
			ans.setAlert('�����A���t�@�x�b�g���قȂ�u���b�N�ɓ����Ă��܂��B','Same kinds of letters are placed different blocks.'); return false;
		}
		if( !ans.checkNoObjectInRoom(rarea, this.getMoved.bind(this)) ){
			ans.setAlert('�A���t�@�x�b�g�̂Ȃ��u���b�N������܂��B','A block has no letters.'); return false;
		}

		ans.performAsLine = true;
		if( !ans.checkDisconnectLine(larea) ){
			ans.setAlert('�A���t�@�x�b�g�ɂȂ����Ă��Ȃ���������܂��B','A line doesn\'t connect any letter.'); return false;
		}

		return true;
	},
	check1st : function(){ return true;},

	checkLineOverLetter : function(func){
		for(var c=0;c<bd.cell.length;c++){
			if(ans.lcntCell(c)>=2 && bd.getQnumCell(c)!=-1){
				bd.setErrorBorder(bd.borders,2);
				ans.setCellLineError(c,true);
				return false;
			}
		}
		return true;
	},
	movedPosition : function(larea){
		this.before = new AreaInfo();
		for(var c=0;c<bd.cell.length;c++){
			if(ans.lcntCell(c)==0 && bd.getQnumCell(c)!=-1){ this.before.check[c]=c;}
			else{ this.before.check[c]=-1;}
		}
		for(var r=1;r<=larea.max;r++){
			var before=-1, after=-1;
			if(larea.room[r].length>1){
				for(var i=0;i<larea.room[r].length;i++){
					var c=larea.room[r][i];
					if(ans.lcntCell(c)==1){
						if(bd.getQnumCell(c)!=-1){ before=c;} else{ after=c;}
					}
				}
			}
			this.before.check[after]=before;
		}
	},
	getMoved : function(cc){ return bd.getQnumCell(this.before.check[cc]);},
	getBeforeCell : function(cc){ return this.before.check[cc];}
};
