//
// �p�Y���ŗL�X�N���v�g�� �ւт������� snakes.js v3.3.0
//
Puzzles.snakes = function(){ };
Puzzles.snakes.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
		k.irowake  = 0;		// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross  = 0;		// 1:�Ֆʓ�����Cross������p�Y�� 2:�O�g����܂߂�Cross������p�Y��
		k.isborder = 1;		// 1:Border/Line������\�ȃp�Y�� 2:�O�g�������\�ȃp�Y��
		k.isexcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isLineCross     = false;	// ������������p�Y��
		k.isCenterLine    = false;	// �}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = false;	// ���E����line�Ƃ��Ĉ���
		k.hasroom         = false;	// �������̗̈�ɕ�����Ă���/������p�Y��
		k.roomNumber      = false;	// �����̖��̐�����1��������p�Y��

		k.dispzero        = true;	// 0��\�����邩�ǂ���
		k.isDispHatena    = false;	// qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber     = true;	// �񓚂ɐ�������͂���p�Y��
		k.NumberWithMB    = false;	// �񓚂̐����Ɓ��~������p�Y��
		k.linkNumber      = false;	// �������ЂƂȂ���ɂȂ�p�Y��

		k.BlackCell       = false;	// ���}�X����͂���p�Y��
		k.NumberIsWhite   = false;	// �����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell     = false;	// �A�����f�ւ̃p�Y��
		k.checkBlackCell  = false;	// ��������ō��}�X�̏����`�F�b�N����p�Y��
		k.checkWhiteCell  = false;	// ��������Ŕ��}�X�̏����`�F�b�N����p�Y��

		k.ispzprv3ONLY    = false;	// �ς��Ղ�A�v���b�g�ɂ͑��݂��Ȃ��p�Y��
		k.isKanpenExist   = false;	// pencilbox/�J���y���ɂ���p�Y��

		if(k.EDITOR){
			base.setExpression("�@���́A�}�E�X�̍��h���b�O���ASHIFT�����Ȃ�����L�[�œ��͂ł��܂��B",
							   " To input Arrows, Left Button Drag or Press arrow key with SHIFT key.");
		}
		else{
			base.setExpression("�@���N���b�N�ō��}�X���A�E�N���b�N�łւт̂��Ȃ��}�X�����͂ł��܂��B�L�[�{�[�h�ł́AQ�L�[�ŕ⏕�L�����łĂ܂��B",
							   " Left Click or Press Keys to input numbers, Right Click to input determined snake not existing cells. Q Key to input auxiliary mark.");
		}
		base.setTitle("�ւт�����","Hebi-Ichigo");
		base.setFloatbgcolor("rgb(0, 224, 0)");
	},
	menufix : function(){
		menu.addUseToFlags();

		pp.addCheck('snakebd','setting',false,'�ւы��E���L��','Enable snake border');
		pp.setLabel('snakebd', '�ւт̎���ɋ��E����\������', 'Draw border around a snake.');
		pp.funcs['snakebd'] = function(){ pc.paintAll();};
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if(k.editmode) this.inputdirec();
			else if(k.playmode){
				if(!this.inputDot()){
					this.dragnumber();
				}
			}
		};
		mv.mouseup = function(){
			if(this.notInputted()){
				if     (k.editmode) this.inputqnum();
				else if(k.playmode) this.inputqnum_snakes();
			}
		};
		mv.mousemove = function(){
			if(k.editmode && this.notInputted()) this.inputdirec();
			else if(k.playmode){
				if(!this.inputDot()){
					this.dragnumber();
				}
			}
		};

		mv.inputqnum_snakes = function(){
			var cc = this.cellid();
			if(cc==-1){ return;}
			k.dispzero=0;
			cc = this.inputqnum3(cc);
			bd.sQsC(cc,0);
			k.dispzero=1;
			pc.paintCellAround(cc);
		},
		mv.dragnumber = function(){
			var cc = this.cellid();
			if(cc==-1||cc==this.mouseCell){ return;}
			if(this.mouseCell==-1){
				this.inputData = bd.QaC(cc)!=-1?bd.QaC(cc):10;
				this.mouseCell = cc;
			}
			else if(bd.QnC(cc)==-1 && this.inputData>=1 && this.inputData<=5){
				if     (this.btn.Left ) this.inputData++;
				else if(this.btn.Right) this.inputData--;
				if(this.inputData>=1 && this.inputData<=5){
					bd.sDiC(cc, 0);
					bd.sQaC(cc, this.inputData); bd.sQsC(cc,0);
					this.mouseCell = cc;
					pc.paintCell(cc);
				}
			}
			else if(bd.QnC(cc)==-1 && this.inputData==10){
				bd.sQaC(cc, -1); bd.sQsC(cc,0);
				pc.paintCell(cc);
			}
		};
		mv.inputDot = function(){
			var cc = this.cellid();
			if(!this.btn.Right||cc==-1||cc==this.mouseCell||this.inputData>=0){ return false;}

			if(this.inputData==-1){
				if(bd.QaC(cc)==-1){
					this.inputData = bd.QsC(cc)!=1?-2:-3;
					return true;
				}
				else{ return false;}
			}
			else if(this.inputData!=-2 && this.inputData!=-3){ return false;}
			bd.sQaC(cc,-1); bd.sQsC(cc,(this.inputData==-2?1:0));
			pc.paintCell(cc);
			this.mouseCell = cc;
			return true;
		};
		mv.enableInputHatena = true;

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.editmode && this.key_inputdirec(ca)){ return;}
			if(this.moveTCell(ca)){ return;}
			if(k.playmode && this.key_inputdot(ca)){ return;}
			this.key_inputqnum(ca);
		};
		kc.key_inputdot = function(ca){
			if(ca=='q'){
				var cc = tc.getTCC();
				if(bd.QnC(cc)===-1){
					bd.sQsC(cc,(bd.QsC(cc)!==1?1:0));
					bd.sQaC(cc,-1);
					pc.paintCell(cc);
					return true;
				}
			}
			return false;
		};

		bd.maxnum = 5;
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_LIGHT;
		pc.dotcolor = "rgb(255, 96, 191)";
		pc.fontcolor = pc.fontErrcolor = "white";
		pc.setCellColorFunc('qnum');

		pc.paint = function(x1,y1,x2,y2){
			x1--; y1--; x2++; y2++;	// �Ղ��c���Ă��܂���

			this.drawBGCells(x1,y1,x2,y2);
			this.drawDotCells(x1,y1,x2,y2);
			this.drawDashedGrid(x1,y1,x2,y2);

			this.drawBorders(x1,y1,x2,y2);

			this.drawBlackCells(x1,y1,x2,y2);
			this.drawArrowNumbers(x1-2,y1-2,x2+2,y2+2);
			this.drawAnswerNumbers(x1-2,y1-2,x2+2,y2+2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawCursor(x1,y1,x2,y2);
		};

		pc.setBorderColor = function(id){
			if(!pp.getVal('snakebd')){ return false;}

			var cc1 = bd.border[id].cellcc[0], cc2 = bd.border[id].cellcc[1];
			if(cc1!==-1 && cc2!==-1 &&
			   (bd.cell[cc1].qnum===-1 && bd.cell[cc2].qnum===-1) &&
			   (bd.cell[cc1].qans!==-1 || bd.cell[cc2].qans!==-1) &&
			   ( ((bd.cell[cc1].qans===-1)^(bd.cell[cc2].qans===-1)) ||
				 (Math.abs(bd.cell[cc1].qans-bd.cell[cc2].qans)!==1)) )
			{
				g.fillStyle = this.BorderQanscolor;
				return true;
			}
			return false;
		};

		pc.drawAnswerNumbers = function(x1,y1,x2,y2){
			this.vinc('cell_number', 'auto');

			var clist = this.cellinside(x1-1,y1-1,x2+1,y2+1);
			for(var i=0;i<clist.length;i++){
				var c = clist[i], obj = bd.cell[c], key='cell_'+c;
				if(obj.qnum===-1 && obj.qans>0){
					this.dispnum(key, 1, ""+obj.qans, 0.8, this.fontAnscolor, obj.cpx, obj.cpy);
				}
				/* �s�v�ȕ�����drawArrowNumbers�ŏ����Ă���̂ŁA�����ł͏����Ȃ� */
			}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type){
			this.decodeArrowNumber16();
		};
		enc.pzlexport = function(type){
			this.encodeArrowNumber16();
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			this.decodeCellDirecQnum();
			this.decodeCellQanssub();
		};
		fio.encodeData = function(){
			this.encodeCellDirecQnum();
			this.encodeCellQanssub();
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			var sinfo = this.getSnakeInfo();
			if( !this.checkAllArea(sinfo, f_true, function(w,h,a,n){ return (a==5);} ) ){
				this.setAlert('�傫�����T�ł͂Ȃ��ւ����܂��B','The size of a snake is not five.'); return false;
			}

			if( !this.checkDifferentNumberInRoom(sinfo, bd.QaC) ){
				this.setAlert('���������������Ă��܂��B','A Snake has same plural marks.'); return false;
			}

			if( !this.checkSideCell2(sinfo) ){
				this.setAlert('�ʁX�̎ւ��ڂ��Ă��܂��B','Other snakes are adjacent.'); return false;
			}

			if( !this.checkArrowNumber() ){
				this.setAlert('���̕����ɂ��鐔��������������܂���B','The number in the direction of the arrow is not correct.'); return false;
			}

			if( !this.checkSnakesView(sinfo) ){
				this.setAlert('�ւ̎����̐�ɕʂ̎ւ����܂��B','A snake can see another snake.'); return false;
			}

			return true;
		};
		ans.check1st = function(){ return true;};

		ans.getSnakeInfo = function(){
			var sinfo = new AreaInfo();
			var func = function(c,cc){ return (cc!=-1 && (Math.abs(bd.QaC(c)-bd.QaC(cc))==1)); };
			for(var c=0;c<bd.cellmax;c++){ sinfo.id[c]=(bd.QaC(c)>0?0:-1);}
			for(var c=0;c<bd.cellmax;c++){
				if(sinfo.id[c]!=0){ continue;}
				sinfo.max++;
				sinfo.room[sinfo.max] = {idlist:[]};
				this.ss0(func, sinfo, c, sinfo.max);
			}
			return sinfo;
		};
		ans.ss0 = function(func, sinfo, c, areaid){
			if(sinfo.id[c]!=0){ return;}
			sinfo.id[c] = areaid;
			sinfo.room[areaid].idlist.push(c);
			if( func(c, bd.up(c)) ){ this.ss0(func, sinfo, bd.up(c), areaid);}
			if( func(c, bd.dn(c)) ){ this.ss0(func, sinfo, bd.dn(c), areaid);}
			if( func(c, bd.lt(c)) ){ this.ss0(func, sinfo, bd.lt(c), areaid);}
			if( func(c, bd.rt(c)) ){ this.ss0(func, sinfo, bd.rt(c), areaid);}
			return;
		};

		ans.checkSideCell2 = function(sinfo){
			var result = true;
			var func = function(sinfo,c1,c2){ return (sinfo.id[c1]>0 && sinfo.id[c2]>0 && sinfo.id[c1]!=sinfo.id[c2]);};
			for(var c=0;c<bd.cellmax;c++){
				if(bd.cell[c].bx<bd.maxbx-2 && func(sinfo,c,c+1)){
					if(this.inAutoCheck){ return false;}
					bd.sErC(sinfo.room[sinfo.id[c]].idlist,1);
					bd.sErC(sinfo.room[sinfo.id[c+1]].idlist,1);
					result = false;
				}
				if(bd.cell[c].by<bd.maxby-2 && func(sinfo,c,c+k.qcols)){
					if(this.inAutoCheck){ return false;}
					bd.sErC(sinfo.room[sinfo.id[c]].idlist,1);
					bd.sErC(sinfo.room[sinfo.id[c+k.qcols]].idlist,1);
					result = false;
				}
			}
			return result;
		};

		ans.checkArrowNumber = function(){
			var result = true;
			var func = function(clist){
				var cc=bd.cnum(bx,by); clist.push(cc);
				if(bd.QnC(cc)!=-1 || bd.QaC(cc)>0){ return false;}
				return true;
			};

			for(var c=0;c<bd.cellmax;c++){
				if(bd.QnC(c)<0 || bd.DiC(c)==0){ continue;}
				var bx = bd.cell[c].bx, by = bd.cell[c].by, dir = bd.DiC(c);
				var num=bd.QnC(c), clist=[c];
				if     (dir==k.UP){ by-=2; while(by>bd.minby){ if(!func(clist)){ break;} by-=2;} }
				else if(dir==k.DN){ by+=2; while(by<bd.maxby){ if(!func(clist)){ break;} by+=2;} }
				else if(dir==k.LT){ bx-=2; while(bx>bd.minbx){ if(!func(clist)){ break;} bx-=2;} }
				else if(dir==k.RT){ bx+=2; while(bx<bd.maxbx){ if(!func(clist)){ break;} bx+=2;} }

				if(num==0^(!bd.isinside(bx,by)||bd.QnC(bd.cnum(bx,by))!=-1)){
					if(this.inAutoCheck){ return false;}
					if(num>0){ bd.sErC(clist,1);}
					else{ bd.sErC([c,bd.cnum(bx,by)],1);}
					result = false;
				}
				else if(num>0 && bd.QaC(bd.cnum(bx,by))!=num){
					if(this.inAutoCheck){ return false;}
					bd.sErC([c,bd.cnum(bx,by)],1);
					result = false;
				}
			}
			return result;
		};
		ans.checkSnakesView = function(sinfo){
			var result = true;
			var func = function(clist){
				var cc=bd.cnum(bx,by); clist.push(cc);
				if(bd.QnC(cc)!=-1 || bd.QaC(cc)>0){ return false;}
				return true;
			};

			for(var r=1;r<=sinfo.max;r++){
				var c1=-1, dir=0, idlist = sinfo.room[r].idlist;
				for(var i=0;i<idlist.length;i++){ if(bd.QaC(idlist[i])==1){c1=idlist[i]; break;}}
				if     (bd.QaC(bd.dn(c1))==2){ dir=1;}
				else if(bd.QaC(bd.up(c1))==2){ dir=2;}
				else if(bd.QaC(bd.rt(c1))==2){ dir=3;}
				else if(bd.QaC(bd.lt(c1))==2){ dir=4;}
				var bx = bd.cell[c1].bx, by = bd.cell[c1].by, clist=[c1];

				if     (dir==1){ by-=2; while(by>bd.minby){ if(!func(clist)){ break;} by-=2;} }
				else if(dir==2){ by+=2; while(by<bd.maxby){ if(!func(clist)){ break;} by+=2;} }
				else if(dir==3){ bx-=2; while(bx>bd.minbx){ if(!func(clist)){ break;} bx-=2;} }
				else if(dir==4){ bx+=2; while(bx<bd.maxbx){ if(!func(clist)){ break;} bx+=2;} }

				var c2 = bd.cnum(bx,by), r2 = sinfo.id[c2];
				if(bd.QaC(c2)>0 && bd.QnC(c2)==-1 && r2>0 && r!=r2){
					if(this.inAutoCheck){ return false;}
					bd.sErC(clist,1);
					bd.sErC(idlist,1);
					bd.sErC(sinfo.room[r2].idlist,1);
					result = false;
				}
			}
			return result;
		};
	}
};
