//
// �p�Y���ŗL�X�N���v�g�� �N�T�r�����N�� kusabi.js v3.1.9p2
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
	k.isDispHatena  = 0;	// 1:qnum��-2�̂Ƃ��ɁH��\������
	k.isAnsNumber   = 0;	// 1:�񓚂ɐ�������͂���p�Y��
	k.isArrowNumber = 0;	// 1:������������͂���p�Y��
	k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
	k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
	k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

	k.BlackCell     = 0;	// 1:���}�X����͂���p�Y��
	k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
	k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

	k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
	k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

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

		base.setTitle("�N�T�r�����N","Kusabi");
		base.setExpression("�@���h���b�O�Ő����A�E�h���b�O�Ł~�󂪓��͂ł��܂��B",
						   " Left Button Drag to input black cells, Right Click to input a cross.");
		base.setFloatbgcolor("rgb(96, 96, 96)");
	},
	menufix : function(){ },
	postfix : function(){ },

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(k.mode==1){
				if(!kp.enabled()){ this.inputqnum(x,y,3);}
				else{ kp.display(x,y);}
			}
			else if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};
		mv.mouseup = function(x,y){ };
		mv.mousemove = function(x,y){
			if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.mode==3){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca,3);
		};

		if(k.callmode == "pmake"){
			kp.generate(99, true, false, this.kpgenerate);
			kp.kpinput = function(ca){
				kc.key_inputqnum(ca,3);
			};
		}
	},
	kpgenerate : function(mode){
		kp.inputcol('num','knum1','1','��');
		kp.inputcol('num','knum2','2','�Z');
		kp.inputcol('num','knum3','3','��');
		kp.insertrow();
		kp.inputcol('num','knum.','-','��');
		kp.inputcol('num','knum_',' ',' ');
		kp.inputcol('empty','knumx','','');
		kp.insertrow();
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

			this.drawNumCells_kusabi(x1,y1,x2,y2);
			this.drawNumbers_kusabi(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};

		pc.drawNumCells_kusabi = function(x1,y1,x2,y2){
			var rsize  = k.cwidth*0.42;
			var rsize2 = k.cwidth*0.36;

			var clist = this.cellinside(x1-2,y1-2,x2+2,y2+2,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.getQnumCell(c)!=-1){
					var px=bd.cell[c].px()+int(k.cwidth/2), py=bd.cell[c].py()+int(k.cheight/2);

					g.fillStyle = this.Cellcolor;
					g.beginPath();
					g.arc(px, py, rsize , 0, Math.PI*2, false);
					if(this.vnop("c"+c+"_cira_",1)){ g.fill(); }

					if(bd.getErrorCell(c)==1){ g.fillStyle = this.errbcolor1;}
					else{ g.fillStyle = "white";}
					g.beginPath();
					g.arc(px, py, rsize2, 0, Math.PI*2, false);
					if(this.vnop("c"+c+"_cirb_",1)){ g.fill(); }
				}
				else{ this.vhide(["c"+c+"_cira_", "c"+c+"_cirb_"]);}
			}
			this.vinc();
		};
		pc.drawNumbers_kusabi = function(x1,y1,x2,y2){
			var clist = this.cellinside(x1,y1,x2,y2,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				var num = bd.getQnumCell(c);
				if(num>=1 && num<=3){ text = ({1:"��",2:"�Z",3:"��"})[num];}
				else if(!bd.cell[c].numobj)   { continue;}
				else{ bd.cell[c].numobj.hide(); continue;}

				if(!bd.cell[c].numobj){ bd.cell[c].numobj = this.CreateDOMAndSetNop();}
				this.dispnumCell1(c, bd.cell[c].numobj, 1, text, 0.65, this.getNumberColor(c));
			}
			this.vinc();
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	pzlinput : function(type, bstr){
		if(type==0 || type==1){
			bstr = enc.decodeNumber10(bstr);
		}
	},
	pzloutput : function(type){
		if(type==0)     { document.urloutput.ta.value = enc.getURLbase()+"?"+k.puzzleid+this.pzldata();}
		else if(type==1){ document.urloutput.ta.value = enc.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
		else if(type==3){ document.urloutput.ta.value = enc.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
	},
	pzldata : function(){
		return "/"+k.qcols+"/"+k.qrows+"/"+enc.encodeNumber10();
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
			ans.setAlert('3�ȏ�̊ۂ��Ȃ����Ă��܂��B','Three or more objects are connected.'); return false;
		}
		if( !this.check2Line() ){
			ans.setAlert('�ۂ̏������ʉ߂��Ă��܂��B','A line goes through a circle.'); return false;
		}

		var saved = this.checkConnectedLine();
		if( !this.checkErrorFlag(saved,7) ){
			ans.setAlert('�ۂ��R�̎��^�Ɍq�����Ă��܂���B','The shape of a line is not correct.'); return false;
		}
		if( !this.checkErrorFlag(saved,6) ){
			ans.setAlert('�q����ۂ�����������܂���B','The type of connected circle is wrong.'); return false;
		}
		if( !this.checkErrorFlag(saved,5) ){
			ans.setAlert('����2��ȏ�Ȃ����Ă��܂��B','A line turns twice or more.'); return false;
		}
		if( !this.checkErrorFlag(saved,4) ){
			ans.setAlert('����2��Ȃ����Ă��܂���B','A line turns only once or lower.'); return false;
		}
		if( !this.checkErrorFlag(saved,3) ){
			ans.setAlert('���̒����������ł͂���܂���B','The length of lines is differnet.'); return false;
		}
		if( !this.checkErrorFlag(saved,2) ){
			ans.setAlert('���̒��Z�̎w���ɔ����Ă܂��B','The length of lines is not suit for the label of object.'); return false;
		}
		if( !this.checkErrorFlag(saved,1) ){
			ans.setAlert('�r�؂�Ă����������܂��B','There is a dead-end line.'); return false;
		}

		if( !ans.checkDisconnectLine(larea) ){
			ans.setAlert('�ۂɂȂ����Ă��Ȃ���������܂��B','A line doesn\'t connect any circle.'); return false;
		}

		if( !this.checkNumber() ){
			ans.setAlert('�ǂ��ɂ��Ȃ����Ă��Ȃ��ۂ�����܂��B','A circle is not connected another object.'); return false;
		}

		return true;
	},
	check1st : function(){ return this.checkNumber();},

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
	},

	checkConnectedLine : function(){
		var saved = {errflag:0,cells:new Array(),idlist:new Array()};
		var visited = new AreaInfo();
		for(var id=0;id<bd.border.length;id++){ visited[id]=0;}

		for(var c=0;c<bd.cell.length;c++){
			if(bd.getQnumCell(c)==-1 || ans.lcntCell(c)==0){ continue;}

			var cc      = -1;	// ���[�v���甲�����Ƃ��ɓ��B�n�_��ID������
			var ccnt    =  0;	// �Ȃ�������
			var dir     =  0;	// ���݌������Ă������/�Ō�Ɍ�����������
			var dir1    =  0;	// �ŏ��Ɍ�����������
			var length1 =  0;	// ���Ȃ���O�̐��̒���
			var length2 =  0;	// ���Ȃ�������̐��̒���
			var idlist  = new Array();	// �ʉ߂���line�̃��X�g(�G���[�\���p)
			var bx=bd.cell[c].cx*2+1, by=bd.cell[c].cy*2+1;	// ���ݒn
			while(1){
				switch(dir){ case 1: by--; break; case 2: by++; break; case 3: bx--; break; case 4: bx++; break;}
				if((bx+by)%2==0){
					cc = bd.getcnum(int(bx/2),int(by/2));
					if(dir!=0 && bd.getQnumCell(cc)!=-1){ break;}
					else if(dir!=1 && bd.getLineBorder(bd.getbnum(bx,by+1))>0){ if(dir!=0&&dir!=2){ ccnt++;} dir=2;}
					else if(dir!=2 && bd.getLineBorder(bd.getbnum(bx,by-1))>0){ if(dir!=0&&dir!=1){ ccnt++;} dir=1;}
					else if(dir!=3 && bd.getLineBorder(bd.getbnum(bx+1,by))>0){ if(dir!=0&&dir!=4){ ccnt++;} dir=4;}
					else if(dir!=4 && bd.getLineBorder(bd.getbnum(bx-1,by))>0){ if(dir!=0&&dir!=3){ ccnt++;} dir=3;}
				}
				else{
					cc=-1;
					var id = bd.getbnum(bx,by);
					if(id==-1||visited[id]!=0||bd.getLineBorder(id)<=0){ break;}
					idlist.push(id);
					visited[id]=1;
					if(dir1==0){ dir1=dir;}
					if     (ccnt==0){ length1++;}
					else if(ccnt==2){ length2++;}
				}
			}

			if(idlist.length<=0){ continue;}
			else if((cc==-1 || bd.getQnumCell(cc)==-1) && saved.errflag==0){
				saved = {errflag:1,cells:[c],idlist:idlist};
			}
			else if((((bd.getQnumCell(c)==2 || bd.getQnumCell(cc)==3) && length1>=length2) ||
					 ((bd.getQnumCell(c)==3 || bd.getQnumCell(cc)==2) && length1<=length2)) && ccnt==2 && cc!=-1 && saved.errflag<=1)
			{
				saved = {errflag:2,cells:[c,cc],idlist:idlist};
			}
			else if((bd.getQnumCell(c)==1 || bd.getQnumCell(cc)==1) && ccnt==2 && cc!=-1 && length1!=length2 && saved.errflag<=2){
				saved = {errflag:3,cells:[c,cc],idlist:idlist};
			}
			else if(ccnt<2 && cc!=-1 && saved.errflag<=3){
				saved = {errflag:4,cells:[c,cc],idlist:idlist};
				return saved;
			}
			else if(ccnt>2 && saved.errflag<=3){
				saved = {errflag:5,cells:[c,cc],idlist:idlist};
				return saved;
			}
			else if(!((bd.getQnumCell(c)==1 && bd.getQnumCell(cc)==1)||
					  (bd.getQnumCell(c)==2 && bd.getQnumCell(cc)==3)||
					  (bd.getQnumCell(c)==3 && bd.getQnumCell(cc)==2)||
					  bd.getQnumCell(c)==-2 || bd.getQnumCell(cc)==-2) && cc!=-1 && ccnt==2 && saved.errflag<=3)
			{
				saved = {errflag:6,cells:[c,cc],idlist:idlist};
				return saved;
			}
			else if(!((dir1==1&&dir==2)||(dir1==2&&dir==1)||(dir1==3&&dir==4)||(dir1==4&&dir==3)) && ccnt==2 && saved.errflag<=3){
				saved = {errflag:7,cells:[c,cc],idlist:idlist};
				return saved;
			}
		}
		return saved;
	},
	checkErrorFlag : function(saved, val){
		if(saved.errflag==val){
			bd.setErrorCell(saved.cells,1);
			bd.setErrorBorder(bd.borders,2);
			bd.setErrorBorder(saved.idlist,1);
			return false;
		}
		return true;
	}
};
