//
// �p�Y���ŗL�X�N���v�g�� �N�T�r�����N�� kusabi.js v3.2.4
//
Puzzles.kusabi = function(){ };
Puzzles.kusabi.prototype = {
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

		//k.def_csize = 36;
		//k.def_psize = 24;
		//k.area = { bcell:0, wcell:0, number:0};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		base.setTitle("�N�T�r�����N","Kusabi");
		base.setExpression("�@���h���b�O�Ő����A�E�h���b�O�Ł~�󂪓��͂ł��܂��B",
						   " Left Button Drag to input black cells, Right Click to input a cross.");
		base.setFloatbgcolor("rgb(96, 96, 96)");
	},
	menufix : function(){ },

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if(k.editmode){
				if(!kp.enabled()){ this.inputqnum();}
				else{ kp.display();}
			}
			else if(k.playmode){
				if(this.btn.Left) this.inputLine();
				else if(this.btn.Right) this.inputpeke();
			}
		};
		mv.mouseup = function(){ };
		mv.mousemove = function(){
			if(k.playmode){
				if(this.btn.Left) this.inputLine();
				else if(this.btn.Right) this.inputpeke();
			}
		};
		mv.enableInputHatena = true;

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.playmode){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca);
		};

		if(k.EDITOR){
			kp.kpgenerate = function(mode){
				this.inputcol('num','knum1','1','��');
				this.inputcol('num','knum2','2','�Z');
				this.inputcol('num','knum3','3','��');
				this.insertrow();
				this.inputcol('num','knum.','-','��');
				this.inputcol('num','knum_',' ',' ');
				this.inputcol('empty','knumx','','');
				this.insertrow();
			};
			kp.generate(kp.ORIGINAL, true, false, kp.kpgenerate);
			kp.kpinput = function(ca){
				kc.key_inputqnum(ca);
			};
		}

		bd.maxnum = 3;
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_LIGHT;
		pc.circleratio = [0.40, 0.40];

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);

			this.drawBGCells(x1,y1,x2,y2);
			this.drawGrid(x1,y1,x2,y2);

			this.drawPekes(x1,y1,x2,y2,0);
			this.drawLines(x1,y1,x2,y2);

			this.drawCircledNumbers(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawTarget(x1,y1,x2,y2);
		};
		pc.dispnumCell = function(id){
			var num = bd.cell[id].qnum, obj = bd.cell[id];
			if(num>=1 && num<=3){ text = ({1:"��",2:"�Z",3:"��"})[num];}
			else{ this.hideEL(obj.numobj); return;}

			if(!obj.numobj){ obj.numobj = this.CreateDOMAndSetNop();}
			this.dispnum(obj.numobj, 1, text, 0.65, this.getNumberColor(id), obj.px, obj.py);
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type){
			this.decodeNumber10();
		};
		enc.pzlexport = function(type){
			this.encodeNumber10();
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			this.decodeCellQnum();
			this.decodeBorderLine();
		};
		fio.encodeData = function(){
			this.encodeCellQnum();
			this.encodeBorderLine();
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){
			this.performAsLine = true;

			if( !this.checkLcntCell(3) ){
				this.setAlert('���򂵂Ă����������܂��B','There is a branch line.'); return false;
			}
			if( !this.checkLcntCell(4) ){
				this.setAlert('�����������Ă��܂��B','There is a crossing line.'); return false;
			}

			var linfo = line.getLareaInfo();
			if( !this.checkQnumsInArea(linfo, function(a){ return (a>=3);}) ){
				this.setAlert('3�ȏ�̊ۂ��Ȃ����Ă��܂��B','Three or more objects are connected.'); return false;
			}
			if( !this.check2Line() ){
				this.setAlert('�ۂ̏������ʉ߂��Ă��܂��B','A line goes through a circle.'); return false;
			}

			var errinfo = this.searchConnectedLine();
			if( !this.checkErrorFlag(errinfo,7) ){
				this.setAlert('�ۂ��R�̎��^�Ɍq�����Ă��܂���B','The shape of a line is not correct.'); return false;
			}
			if( !this.checkErrorFlag(errinfo,6) ){
				this.setAlert('�q����ۂ�����������܂���B','The type of connected circle is wrong.'); return false;
			}
			if( !this.checkErrorFlag(errinfo,5) ){
				this.setAlert('����2��ȏ�Ȃ����Ă��܂��B','A line turns twice or more.'); return false;
			}
			if( !this.checkErrorFlag(errinfo,4) ){
				this.setAlert('����2��Ȃ����Ă��܂���B','A line turns only once or lower.'); return false;
			}
			if( !this.checkErrorFlag(errinfo,3) ){
				this.setAlert('���̒����������ł͂���܂���B','The length of lines is differnet.'); return false;
			}
			if( !this.checkErrorFlag(errinfo,2) ){
				this.setAlert('���̒��Z�̎w���ɔ����Ă܂��B','The length of lines is not suit for the label of object.'); return false;
			}
			if( !this.checkErrorFlag(errinfo,1) ){
				this.setAlert('�r�؂�Ă����������܂��B','There is a dead-end line.'); return false;
			}

			if( !this.checkDisconnectLine(linfo) ){
				this.setAlert('�ۂɂȂ����Ă��Ȃ���������܂��B','A line doesn\'t connect any circle.'); return false;
			}

			if( !this.checkAllCell(function(c){ return (line.lcntCell(c)==0 && bd.QnC(c)!=-1);}) ){
				this.setAlert('�ǂ��ɂ��Ȃ����Ă��Ȃ��ۂ�����܂��B','A circle is not connected another object.'); return false;
			}

			return true;
		};
		ans.check1st = function(){ return this.checkAllCell(function(c){ return (line.lcntCell(c)==0 && bd.QnC(c)!=-1);});};

		ans.check2Line = function(){ return this.checkLine(function(i){ return (line.lcntCell(i)>=2 && bd.QnC(i)!=-1);}); };
		ans.checkLine = function(func){
			var result = true;
			for(var c=0;c<bd.cellmax;c++){
				if(func(c)){
					if(this.inAutoCheck){ return false;}
					if(result){ bd.sErBAll(2);}
					ans.setCellLineError(c,true);
					result = false;
				}
			}
			return result;
		};

		ans.searchConnectedLine = function(){
			var errinfo = {data:[]};
			//var saved = {errflag:0,cells:[],idlist:[]};
			var visited = new AreaInfo();
			for(var id=0;id<bd.bdmax;id++){ visited[id]=0;}

			for(var c=0;c<bd.cellmax;c++){
				if(bd.QnC(c)==-1 || line.lcntCell(c)==0){ continue;}

				var cc      = -1;	// ���[�v���甲�����Ƃ��ɓ��B�n�_��ID������
				var ccnt    =  0;	// �Ȃ�������
				var dir     =  0;	// ���݌������Ă������/�Ō�Ɍ�����������
				var dir1    =  0;	// �ŏ��Ɍ�����������
				var length1 =  0;	// ���Ȃ���O�̐��̒���
				var length2 =  0;	// ���Ȃ�������̐��̒���
				var idlist  = [];	// �ʉ߂���line�̃��X�g(�G���[�\���p)
				var bx=bd.cell[c].cx*2+1, by=bd.cell[c].cy*2+1;	// ���ݒn
				while(1){
					switch(dir){ case 1: by--; break; case 2: by++; break; case 3: bx--; break; case 4: bx++; break;}
					if((bx+by)%2==0){
						cc = bd.cnum(bx>>1,by>>1);
						if(dir!=0 && bd.QnC(cc)!=-1){ break;}
						else if(dir!=1 && bd.isLine(bd.bnum(bx,by+1))){ if(dir!=0&&dir!=2){ ccnt++;} dir=2;}
						else if(dir!=2 && bd.isLine(bd.bnum(bx,by-1))){ if(dir!=0&&dir!=1){ ccnt++;} dir=1;}
						else if(dir!=3 && bd.isLine(bd.bnum(bx+1,by))){ if(dir!=0&&dir!=4){ ccnt++;} dir=4;}
						else if(dir!=4 && bd.isLine(bd.bnum(bx-1,by))){ if(dir!=0&&dir!=3){ ccnt++;} dir=3;}
					}
					else{
						cc=-1;
						var id = bd.bnum(bx,by);
						if(id==-1||visited[id]!=0||!bd.isLine(id)){ break;}
						idlist.push(id);
						visited[id]=1;
						if(dir1==0){ dir1=dir;}
						if     (ccnt==0){ length1++;}
						else if(ccnt==2){ length2++;}
					}
				}

				if(idlist.length<=0){ continue;}
				if(!((dir1==1&&dir==2)||(dir1==2&&dir==1)||(dir1==3&&dir==4)||(dir1==4&&dir==3)) && ccnt==2){
					errinfo.data.push({errflag:7,cells:[c,cc],idlist:idlist}); continue;
				}
				if(!((bd.QnC(c)==1 && bd.QnC(cc)==1) || (bd.QnC(c)==2 && bd.QnC(cc)==3) ||
						  (bd.QnC(c)==3 && bd.QnC(cc)==2) || bd.QnC(c)==-2 || bd.QnC(cc)==-2) && cc!=-1 && ccnt==2)
				{
					errinfo.data.push({errflag:6,cells:[c,cc],idlist:idlist}); continue;
				}
				if(ccnt>2){
					errinfo.data.push({errflag:5,cells:[c,cc],idlist:idlist}); continue;
				}
				if(ccnt<2 && cc!=-1){
					errinfo.data.push({errflag:4,cells:[c,cc],idlist:idlist}); continue;
				}
				if((bd.QnC(c)==1 || bd.QnC(cc)==1) && ccnt==2 && cc!=-1 && length1!=length2){
					errinfo.data.push({errflag:3,cells:[c,cc],idlist:idlist}); continue;
				}
				if((((bd.QnC(c)==2 || bd.QnC(cc)==3) && length1>=length2) ||
						 ((bd.QnC(c)==3 || bd.QnC(cc)==2) && length1<=length2)) && ccnt==2 && cc!=-1)
				{
					errinfo.data.push({errflag:2,cells:[c,cc],idlist:idlist}); continue;
				}
				if((cc==-1 || bd.QnC(cc)==-1)){
					errinfo.data.push({errflag:1,cells:[c],idlist:idlist}); continue;
				}
			}
			return errinfo;
		};
		ans.checkErrorFlag = function(errinfo, val){
			var result = true;
			for(var i=0,len=errinfo.data.length;i<len;i++){
				if(errinfo.data[i].errflag!=val){ continue;}

				if(this.inAutoCheck){ return false;}
				bd.sErC(errinfo.data[i].cells,1);
				if(result){ bd.sErBAll(2);}
				bd.sErB(errinfo.data[i].idlist,1);
				result = false;
			}
			return result;
		};
	}
};
