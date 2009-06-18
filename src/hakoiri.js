//
// �p�Y���ŗL�X�N���v�g�� �͂����聛������ hakoiri.js v3.1.9p1
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

	k.ispzprv3ONLY  = 0;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
	k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

	k.fstruct = ["arearoom","cellqnum","cellans"];

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

		if(k.callmode=="pplay"){
			base.setExpression("�@���N���b�N�ŋL�����A�E�h���b�O�ŕ⏕�L�������͂ł��܂��B",
							   " Left Click to input answers, Right Button Drag to input auxiliary marks.");
		}
		else{
			base.setExpression("�@�L�[�{�[�h�̍�����-�L�[���ŁA�L���̓��͂��ł��܂��B",
							   " Press left side of the keyboard or '-' key to input marks.");
		}
		base.setTitle("�͂����聛����","Triplets");
		base.setFloatbgcolor("rgb(127, 160, 96)");
	},
	menufix : function(){
		kp.defaultdisp = true;
	},
	postfix : function(){ },

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(k.mode==1) this.inputborder(x,y);
			else if(k.mode==3){
				if(!kp.enabled() || this.btn.Right) this.inputmark(x,y);
				else kp.display(x,y);
			}
		};
		mv.mouseup = function(x,y){
			if(k.mode==1 && this.notInputted()){
				if(!kp.enabled()) this.inputqnum(x,y,3);
				else if(this.btn.Left){ kp.display(x,y);}
			}
		};
		mv.mousemove = function(x,y){
			if(k.mode==1) this.inputborder(x,y);
			else if(k.mode==3 && this.btn.Right) this.inputDot(x,y);
		};

		mv.inputmark = function(x,y){
			var cc = this.cellid(new Pos(x,y));
			if(cc==-1 || cc==this.mouseCell){ return;}

			if(cc==tc.getTCC()){
				this.inputmark3(cc);
				this.mouseCell = cc;
			}
			else{
				var cc0 = tc.getTCC();
				tc.setTCC(cc);
				pc.paint(bd.cell[cc0].cx-1, bd.cell[cc0].cy-1, bd.cell[cc0].cx, bd.cell[cc0].cy);
				if(bd.getQsubCell(cc)==1 || bd.getQansCell(cc)==-1){ this.inputData=1;}
			}

			pc.paint(bd.cell[cc].cx-1, bd.cell[cc].cy-1, bd.cell[cc].cx, bd.cell[cc].cy);
		};
		mv.inputmark3 = function(cc){
			if(bd.getQnumCell(cc)!=-1){ return;}
			if(this.btn.Left){
				if(bd.getQsubCell(cc)== 1){ bd.setQansCell(cc,-1); bd.setQsubCell(cc,0);}
				else{
					bd.setQsubCell(cc,(bd.getQansCell(cc)==3?1:0));
					bd.setQansCell(cc,({'-1':1,'1':2,'2':3,'3':-1})[bd.getQansCell(cc).toString()]);
				}
			}
			else if(this.btn.Right){
				if(bd.getQsubCell(cc)== 1){ bd.setQansCell(cc, 3); bd.setQsubCell(cc,0);}
				else{
					bd.setQsubCell(cc,(bd.getQansCell(cc)==-1?1:0));
					bd.setQansCell(cc,({'-1':-1,'1':-1,'2':1,'3':2})[bd.getQansCell(cc).toString()]);
				}
			}
			if(bd.getQsubCell(cc)==1){ this.inputData=1;}
		};

		mv.inputDot = function(x,y){
			var cc = this.cellid(new Pos(x,y));
			if(cc==-1 || cc==this.mouseCell || this.inputData!=1 || bd.getQnumCell(cc)!=-1){ return;}
			var cc0 = tc.getTCC(); tc.setTCC(cc);
			bd.setQansCell(cc,-1);
			bd.setQsubCell(cc,1);
			this.mouseCell = cc;

			pc.paint(bd.cell[cc0].cx-1, bd.cell[cc0].cy-1, bd.cell[cc0].cx, bd.cell[cc0].cy);
			pc.paint(bd.cell[cc].cx-1, bd.cell[cc].cy-1, bd.cell[cc].cx, bd.cell[cc].cy);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(this.moveTCell(ca)){ return;}
			puz.key_hakoiri(ca);
		};

		kp.generate(99, true, true, this.kpgenerate);
		kp.kpinput = function(ca){ puz.key_hakoiri(ca);};
	},
	key_hakoiri : function(ca){
		var cc = tc.getTCC();
		var flag = false;

		if     ((ca=='1'||ca=='q'||ca=='a'||ca=='z')){
			if(k.mode==1){ bd.setQnumCell(cc, 1); bd.setQansCell(cc,-1); bd.setQsubCell(cc,0);}
			else if(bd.getQnumCell(cc)==-1){ bd.setQansCell(cc,1); bd.setQsubCell(cc,0);}
			flag = true;
		}
		else if((ca=='2'||ca=='w'||ca=='s'||ca=='x')){
			if(k.mode==1){ bd.setQnumCell(cc, 2); bd.setQansCell(cc,-1); bd.setQsubCell(cc,0);}
			else if(bd.getQnumCell(cc)==-1){ bd.setQansCell(cc,2); bd.setQsubCell(cc,0);}
			flag = true;
		}
		else if((ca=='3'||ca=='e'||ca=='d'||ca=='c')){
			if(k.mode==1){ bd.setQnumCell(cc, 3); bd.setQansCell(cc,-1); bd.setQsubCell(cc,0);}
			else if(bd.getQnumCell(cc)==-1){ bd.setQansCell(cc,3); bd.setQsubCell(cc,0);}
			flag = true;
		}
		else if((ca=='4'||ca=='r'||ca=='f'||ca=='v')){
			if(k.mode==1){ bd.setQnumCell(cc,-2); bd.setQansCell(cc,-1); bd.setQsubCell(cc,0);}
			else if(bd.getQnumCell(cc)==-1){ bd.setQansCell(cc,-1); bd.setQsubCell(cc,1);}
			flag = true;
		}
		else if((ca=='5'||ca=='t'||ca=='g'||ca=='b'||ca==' ')){
			if(k.mode==1){ bd.setQnumCell(cc, -1); bd.setQansCell(cc,-1); bd.setQsubCell(cc,0);}
			else if(bd.getQnumCell(cc)==-1){ bd.setQansCell(cc,-1); bd.setQsubCell(cc,0);}
			flag = true;
		}
		else if(ca=='-'){
			if(k.mode==1){ bd.setQnumCell(cc,(bd.getQnumCell(cc)!=-2?-2:-1)); bd.setQansCell(cc,-1); bd.setQsubCell(cc,0);}
			else if(bd.getQnumCell(cc)==-1){ bd.setQansCell(cc,-1); bd.setQsubCell(cc,(bd.getQsubCell(cc)!=1?1:0));}
			flag = true;
		}

		if(flag){ pc.paint(bd.cell[cc].cx, bd.cell[cc].cy, bd.cell[cc].cx, bd.cell[cc].cy); return true;}
		return false;
	},
	kpgenerate : function(mode){
		if(mode==1){
			kp.inputcol('num','knum1','1','��');
			kp.inputcol('num','knum2','2','��');
			kp.inputcol('num','knum3','3','��');
			kp.insertrow();
			kp.inputcol('num','knum4','4','?');
			kp.inputcol('num','knum_',' ',' ');
			kp.inputcol('empty','knumx','','');
			kp.insertrow();
		}
		else{
			kp.tdcolor = pc.fontAnscolor;
			kp.inputcol('num','qnum1','1','��');
			kp.inputcol('num','qnum2','2','��');
			kp.inputcol('num','qnum3','3','��');
			kp.insertrow();
			kp.tdcolor = "rgb(255, 96, 191)";
			kp.inputcol('num','qnum4','4','�E');
			kp.tdcolor = "black";
			kp.inputcol('num','qnum_',' ',' ');
			kp.inputcol('empty','qnumx','','');
			kp.insertrow();
		}
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.bcolor = "rgb(160, 255, 160)";
		pc.BBcolor = "rgb(127, 127, 127)";
		pc.dotcolor = "rgb(255, 96, 191)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);

			this.drawErrorCells(x1,y1,x2,y2);

			this.drawBDline(x1,y1,x2,y2);
			this.drawBorders(x1,y1,x2,y2);

			this.drawDots(x1,y1,x2,y2);
			this.drawNumbers_hakoiri(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawTCell(x1,y1,x2+1,y2+1);
		};

		pc.drawNumbers_hakoiri = function(x1,y1,x2,y2){
			var clist = this.cellinside(x1,y1,x2,y2,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				var num = (bd.getQnumCell(c)!=-1 ? bd.getQnumCell(c) : bd.getQansCell(c));
				if(num>=1 && num<=3){ text = ({1:"��",2:"��",3:"��"})[num];}
				else if(num==-2)    { text = "?";}
				else if(!bd.cell[c].numobj)  { continue;}
				else{ bd.cell[c].numobj.hide(); continue;}

				if(!bd.cell[c].numobj){ bd.cell[c].numobj = this.CreateDOMAndSetNop();}
				this.dispnumCell1(c, bd.cell[c].numobj, 1, text, 0.8, this.getNumberColor(c));
			}
			this.vinc();
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	pzlinput : function(type, bstr){
		if(type==0 || type==1){
			bstr = enc.decodeBorder(bstr);
			bstr = enc.decodeNumber10(bstr);
		}
	},
	pzloutput : function(type){
		if(type==0)     { document.urloutput.ta.value = enc.getURLbase()+"?"+k.puzzleid+this.pzldata();}
		else if(type==1){ document.urloutput.ta.value = enc.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
		else if(type==3){ document.urloutput.ta.value = enc.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
	},
	pzldata : function(){
		return "/"+k.qcols+"/"+k.qrows+"/"+enc.encodeBorder()+enc.encodeNumber10();
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	check : function(){

		if( !this.checkAroundMarks() ){
			ans.setAlert('�����L�����^�e���R�i�i���ɗאڂ��Ă��܂��B','Same marks are adjacent.'); return false;
		}

		var rarea = ans.searchRarea();
		if( !ans.checkAllArea(rarea, function(id){ return (puz.getNum(id)!=-1);}, function(w,h,a){ return (a<4);} ) ){
			ans.setAlert('1�̃n�R��4�ȏ�̋L���������Ă��܂��B','A box has four or more marks.'); return false;
		}

		if( !this.checkDifferentObjectInRoom(rarea) ){
			ans.setAlert('1�̃n�R�ɓ����L�������������Ă��܂��B','A box has same plural marks.'); return false;
		}

		if( !ans.linkBWarea( ans.searchBWarea(function(id){ return (id!=-1 && puz.getNum(id)!=-1); }) ) ){
			ans.setAlert('�^�e���R�ɂȂ����Ă��Ȃ��L��������܂��B','Marks are devided.'); return false;
		}

		if( !ans.checkAllArea(rarea, function(id){ return (puz.getNum(id)!=-1);}, function(w,h,a){ return (a>2);} ) ){
			ans.setAlert('1�̃n�R��2�ȉ��̋L�����������Ă��܂���B','A box has tow or less marks.'); return false;
		}

		return true;
	},

	checkDifferentObjectInRoom : function(area){
		for(var r=1;r<=area.max;r++){
			var d = new Array();
			d[-2]=0; d[1]=0; d[2]=0; d[3]=0;
			for(var i=0;i<area.room[r].length;i++){
				var val = this.getNum(area.room[r][i]);
				if(val==-1){ continue;}

				if(d[val]==0){ d[val]++;}
				else if(d[val]>0){ bd.setErrorCell(area.room[r],1); return false;}
			}
		}
		return true;
	},
	checkAroundMarks : function(){
		for(var c=0;c<bd.cell.length;c++){
			if(this.getNum(c)<0){ continue;}
			var cx = bd.cell[c].cx; var cy = bd.cell[c].cy; var target=0;
			var func = function(cc){ return (cc!=-1 && this.getNum(c)==this.getNum(cc));}.bind(this);
			target = bd.getcnum(cx+1,cy  ); if(func(target)){ bd.setErrorCell([c,target],1); return false;}
			target = bd.getcnum(cx  ,cy+1); if(func(target)){ bd.setErrorCell([c,target],1); return false;}
			target = bd.getcnum(cx-1,cy+1); if(func(target)){ bd.setErrorCell([c,target],1); return false;}
			target = bd.getcnum(cx+1,cy+1); if(func(target)){ bd.setErrorCell([c,target],1); return false;}
		}
		return true;
	},
	getNum : function(cc){
		if(cc<0||cc>=bd.cell.length){ return -1;}
		return (bd.getQnumCell(cc)!=-1?bd.getQnumCell(cc):bd.getQansCell(cc));
	}
};
