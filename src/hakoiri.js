//
// �p�Y���ŗL�X�N���v�g�� �͂����聛������ hakoiri.js v3.2.3
//
Puzzles.hakoiri = function(){ };
Puzzles.hakoiri.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
		k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
		k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
		k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
		k.isLineCross     = 0;	// 1:������������p�Y��
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

		k.fstruct = ["arearoom","cellqnum","cellqanssub"];

		//k.def_csize = 36;
		//k.def_psize = 24;
		k.area = { bcell:0, wcell:0, number:1};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		if(k.EDITOR){
			base.setExpression("�@�L�[�{�[�h�̍�����-�L�[���ŁA�L���̓��͂��ł��܂��B",
							   " Press left side of the keyboard or '-' key to input marks.");
		}
		else{
			base.setExpression("�@���N���b�N�ŋL�����A�E�h���b�O�ŕ⏕�L�������͂ł��܂��B",
							   " Left Click to input answers, Right Button Drag to input auxiliary marks.");
		}
		base.setTitle("�͂����聛����","Triplets");
		base.setFloatbgcolor("rgb(127, 160, 96)");
	},
	menufix : function(){
		kp.defaultdisp = true;
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if(k.editmode) this.inputborder();
			else if(k.playmode){
				if(!kp.enabled() || this.btn.Right) this.inputmark();
				else kp.display();
			}
		};
		mv.mouseup = function(){
			if(k.editmode && this.notInputted()){
				if(!kp.enabled()) this.inputqnum();
				else if(this.btn.Left){ kp.display();}
			}
		};
		mv.mousemove = function(){
			if(k.editmode) this.inputborder();
			else if(k.playmode && this.btn.Right) this.inputDot();
		};

		mv.inputmark = function(){
			var cc = this.cellid();
			if(cc==-1 || cc==this.mouseCell){ return;}

			if(cc==tc.getTCC()){
				this.inputmark3(cc);
				this.mouseCell = cc;
			}
			else{
				var cc0 = tc.getTCC();
				tc.setTCC(cc);
				pc.paint(bd.cell[cc0].cx-1, bd.cell[cc0].cy-1, bd.cell[cc0].cx, bd.cell[cc0].cy);
				if(bd.QsC(cc)==1 || bd.QaC(cc)==-1){ this.inputData=1;}
			}

			pc.paint(bd.cell[cc].cx-1, bd.cell[cc].cy-1, bd.cell[cc].cx, bd.cell[cc].cy);
		};
		mv.inputmark3 = function(cc){
			if(bd.QnC(cc)!=-1){ return;}
			if(this.btn.Left){
				if(bd.QsC(cc)== 1){ bd.sQaC(cc,-1); bd.sQsC(cc,0);}
				else{
					bd.sQsC(cc,(bd.QaC(cc)==3?1:0));
					bd.sQaC(cc,({'-1':1,'1':2,'2':3,'3':-1})[bd.QaC(cc).toString()]);
				}
			}
			else if(this.btn.Right){
				if(bd.QsC(cc)== 1){ bd.sQaC(cc, 3); bd.sQsC(cc,0);}
				else{
					bd.sQsC(cc,(bd.QaC(cc)==-1?1:0));
					bd.sQaC(cc,({'-1':-1,'1':-1,'2':1,'3':2})[bd.QaC(cc).toString()]);
				}
			}
			if(bd.QsC(cc)==1){ this.inputData=1;}
		};

		mv.inputDot = function(){
			var cc = this.cellid();
			if(cc==-1 || cc==this.mouseCell || this.inputData!=1 || bd.QnC(cc)!=-1){ return;}
			var cc0 = tc.getTCC(); tc.setTCC(cc);
			bd.sQaC(cc,-1);
			bd.sQsC(cc,1);
			this.mouseCell = cc;

			pc.paint(bd.cell[cc0].cx-1, bd.cell[cc0].cy-1, bd.cell[cc0].cx, bd.cell[cc0].cy);
			pc.paint(bd.cell[cc].cx-1, bd.cell[cc].cy-1, bd.cell[cc].cx, bd.cell[cc].cy);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(this.moveTCell(ca)){ return;}
			kc.key_hakoiri(ca);
		};
		kc.key_hakoiri = function(ca){
			var cc = tc.getTCC();
			var flag = false;

			if     ((ca=='1'||ca=='q'||ca=='a'||ca=='z')){
				bd.setNum(cc,1);
				flag = true;
			}
			else if((ca=='2'||ca=='w'||ca=='s'||ca=='x')){
				bd.setNum(cc,2);
				flag = true;
			}
			else if((ca=='3'||ca=='e'||ca=='d'||ca=='c')){
				bd.setNum(cc,3);
				flag = true;
			}
			else if((ca=='4'||ca=='r'||ca=='f'||ca=='v')){
				bd.setNum(cc,(k.editmode?-2:-1));
				flag = true;
			}
			else if((ca=='5'||ca=='t'||ca=='g'||ca=='b'||ca==' ')){
				bd.setNum(cc,-1);
				flag = true;
			}
			else if(ca=='-'){
				if(k.editmode){ bd.sQnC(cc,(bd.QnC(cc)!=-2?-2:-1)); bd.sQaC(cc,-1); bd.sQsC(cc,0);}
				else if(bd.QnC(cc)==-1){ bd.sQaC(cc,-1); bd.sQsC(cc,(bd.QsC(cc)!=1?1:0));}
				flag = true;
			}

			if(flag){ pc.paint(bd.cell[cc].cx, bd.cell[cc].cy, bd.cell[cc].cx, bd.cell[cc].cy); return true;}
			return false;
		};

		kp.kpgenerate = function(mode){
			if(mode==1){
				this.inputcol('num','knum1','1','��');
				this.inputcol('num','knum2','2','��');
				this.inputcol('num','knum3','3','��');
				this.insertrow();
				this.inputcol('num','knum4','4','?');
				this.inputcol('num','knum_',' ',' ');
				this.inputcol('empty','knumx','','');
				this.insertrow();
			}
			else{
				this.tdcolor = pc.fontAnscolor;
				this.inputcol('num','qnum1','1','��');
				this.inputcol('num','qnum2','2','��');
				this.inputcol('num','qnum3','3','��');
				this.insertrow();
				this.tdcolor = "rgb(255, 96, 191)";
				this.inputcol('num','qnum4','4','�E');
				this.tdcolor = "black";
				this.inputcol('num','qnum_',' ',' ');
				this.inputcol('empty','qnumx','','');
				this.insertrow();
			}
		};
		kp.generate(kp.ORIGINAL, true, true, kp.kpgenerate);
		kp.kpinput = function(ca){ kc.key_hakoiri(ca);};

		bd.maxnum = 3;
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.bcolor = pc.bcolor_GREEN;
		pc.BBcolor = "rgb(127, 127, 127)";
		pc.dotcolor = "rgb(255, 96, 191)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);

			this.drawBGCells(x1,y1,x2,y2);
			this.drawGrid(x1,y1,x2,y2);
			this.drawBorders(x1,y1,x2,y2);

			this.drawDotCells(x1,y1,x2,y2);
			this.drawNumbers(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawTCell(x1,y1,x2+1,y2+1);
		};

		pc.dispnumCell = function(c){
			var num = bd.getNum(c), obj = bd.cell[c];
			if(num>=1 && num<=3){ text = ({1:"��",2:"��",3:"��"})[num];}
			else if(num==-2)    { text = "?";}
			else{ this.hideEL(obj.numobj); return;}

			if(!obj.numobj){ obj.numobj = ee.CreateDOMAndSetNop();}
			this.dispnum(obj.numobj, 1, text, 0.8, this.getNumberColor(c), obj.px, obj.py);
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==0 || type==1){
				bstr = this.decodeBorder(bstr);
				bstr = this.decodeNumber10(bstr);
			}
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			return "/"+k.qcols+"/"+k.qrows+"/"+this.encodeBorder()+this.encodeNumber10();
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkAroundMarks() ){
				this.setAlert('�����L�����^�e���R�i�i���ɗאڂ��Ă��܂��B','Same marks are adjacent.'); return false;
			}

			var rinfo = area.getRoomInfo();
			if( !this.checkAllArea(rinfo, bd.isNum, function(w,h,a){ return (a<4);} ) ){
				this.setAlert('1�̃n�R��4�ȏ�̋L���������Ă��܂��B','A box has four or more marks.'); return false;
			}

			if( !this.checkDifferentObjectInRoom(rinfo) ){
				this.setAlert('1�̃n�R�ɓ����L�������������Ă��܂��B','A box has same plural marks.'); return false;
			}

			if( !this.checkOneArea( area.getNumberInfo() ) ){
				this.setAlert('�^�e���R�ɂȂ����Ă��Ȃ��L��������܂��B','Marks are devided.'); return false;
			}

			if( !this.checkAllArea(rinfo, bd.isNum, function(w,h,a){ return (a>2);} ) ){
				this.setAlert('1�̃n�R��2�ȉ��̋L�����������Ă��܂���B','A box has tow or less marks.'); return false;
			}

			return true;
		};

		ans.checkDifferentObjectInRoom = function(rinfo){
			for(var r=1;r<=rinfo.max;r++){
				var d = [];
				d[-2]=0; d[1]=0; d[2]=0; d[3]=0;
				for(var i=0;i<rinfo.room[r].idlist.length;i++){
					var val = bd.getNum(rinfo.room[r].idlist[i]);
					if(val==-1){ continue;}

					if(d[val]==0){ d[val]++;}
					else if(d[val]>0){ bd.sErC(rinfo.room[r].idlist,1); return false;}
				}
			}
			return true;
		};
		ans.checkAroundMarks = function(){
			for(var c=0;c<bd.cellmax;c++){
				if(bd.getNum(c)<0){ continue;}
				var cx = bd.cell[c].cx; var cy = bd.cell[c].cy; var target=0;
				var func = function(cc){ return (cc!=-1 && bd.getNum(c)==bd.getNum(cc));};
				target = bd.cnum(cx+1,cy  ); if(func(target)){ bd.sErC([c,target],1); return false;}
				target = bd.cnum(cx  ,cy+1); if(func(target)){ bd.sErC([c,target],1); return false;}
				target = bd.cnum(cx-1,cy+1); if(func(target)){ bd.sErC([c,target],1); return false;}
				target = bd.cnum(cx+1,cy+1); if(func(target)){ bd.sErC([c,target],1); return false;}
			}
			return true;
		};
	}
};
