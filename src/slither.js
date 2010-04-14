//
// �p�Y���ŗL�X�N���v�g�� �X���U�[�����N�� slither.js v3.3.0
//
Puzzles.slither = function(){ };
Puzzles.slither.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
		k.irowake = 1;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
		k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
		k.isoutsideborder = 1;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
		k.isLineCross     = 0;	// 1:������������p�Y��
		k.isCenterLine    = 0;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = 1;	// 1:���E����line�Ƃ��Ĉ���

		k.dispzero      = 1;	// 1:0��\�����邩�ǂ���
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

		base.setTitle("�X���U�[�����N","Slitherlink");
		base.setExpression("�@���h���b�O�Ő����A�E�N���b�N�Ł~�����͂ł��܂��B",
						   " Left Button Drag to input black cells, Right Click to input a cross.");
		base.setFloatbgcolor("rgb(32, 32, 32)");

		enc.pidKanpen = 'slitherlink';
	},
	menufix : function(){
		pp.addCheck('bgcolor','setting',false, '�w�i�F����', 'Background-color');
		pp.setLabel('bgcolor', '�Z���̒������N���b�N�������ɔw�i�F�̓��͂�L���ɂ���', 'Enable to Input BGColor When the Center of the Cell is Clicked');

		menu.addRedLineToFlags();

		menu.ex.modechange = function(num){
			k.editmode = (num==1);
			k.playmode = (num==3);
			kc.prev = -1;
			ans.errDisp=true;
			bd.errclear();
			if(kp.ctl[1].enable || kp.ctl[3].enable){ pp.funcs.keypopup();}
			tc.setAlign();
			pc.paintAll();
			// �����܂Ō��Ɠ���

			ee('ck_bgcolor').el.disabled    = (num==3?"":"true");
			ee('cl_bgcolor').el.style.color = (num==3?"black":"silver");
		};
	},
	finalfix : function(){
		if(k.editmode){
			ee('ck_bgcolor').el.disabled    = "true";
			ee('cl_bgcolor').el.style.color = "silver";
		}
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if(kc.isZ ^ pp.getVal('dispred')){ this.dispRedLine(); return;}
			if(k.editmode){
				if(!kp.enabled()){ this.inputqnum();}
				else{ kp.display();}
			}
			else if(k.playmode){
				if(!pp.getVal('bgcolor') || !this.inputBGcolor0()){
					if(this.btn.Left) this.inputborderans();
					else if(this.btn.Right) this.inputpeke();
				}
				else{ this.inputBGcolor();}
			}
		};
		mv.mouseup = function(){ };
		mv.mousemove = function(){
			if(k.playmode){
				if(!pp.getVal('bgcolor') || this.inputData<10){
					if(this.btn.Left) this.inputborderans();
					else if(this.btn.Right) this.inputpeke();
				}
				else{ this.inputBGcolor();}
			}
		};

		mv.inputBGcolor0 = function(){
			var pos = this.borderpos(0.25);
			return ((pos.x&1) && (pos.y&1));
		};
		mv.inputBGcolor = function(){
			var cc = this.cellid();
			if(cc==-1 || cc==this.mouseCell){ return;}
			if(this.inputData==-1){
				if(this.btn.Left){
					if     (bd.cell[cc].qsub===0){ this.inputData=11;}
					else if(bd.cell[cc].qsub===1){ this.inputData=12;}
					else                         { this.inputData=10;}
				}
				else{
					if     (bd.cell[cc].qsub===0){ this.inputData=12;}
					else if(bd.cell[cc].qsub===1){ this.inputData=10;}
					else                         { this.inputData=11;}
				}
			}
			bd.sQsC(cc, this.inputData-10);
			pc.paintCell(cc);

			this.mouseCell = cc; 
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(ca=='z' && !this.keyPressed){ this.isZ=true; return;}
			if(k.playmode){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca);
		};
		kc.keyup = function(ca){ if(ca=='z'){ this.isZ=false;}};
		kc.isZ = false;

		if(k.EDITOR){
			kp.kpinput = function(ca){
				kc.key_inputqnum(ca);
			};
			kp.kpgenerate = function(mode){
				this.inputcol('num','knum0','0','0');
				this.inputcol('num','knum1','1','1');
				this.inputcol('num','knum2','2','2');
				this.insertrow();
				this.inputcol('num','knum3','3','3');
				this.inputcol('num','knum_',' ',' ');
				this.inputcol('num','knum.','-','?');
				this.insertrow();
			};
			kp.generate(kp.ORIGINAL, true, false, kp.kpgenerate);
		}

		bd.maxnum = 3;
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.setBGCellColorFunc('qsub2');
		pc.setBorderColorFunc('line');

		pc.paint = function(x1,y1,x2,y2){
			this.drawBGCells(x1,y1,x2,y2);

			this.drawBorders(x1,y1,x2,y2);

			this.drawBaseMarks(x1,y1,x2,y2);

			this.drawNumbers(x1,y1,x2,y2);

			this.drawPekes(x1,y1,x2,y2,0);

			this.drawTarget(x1,y1,x2,y2);
		};

		pc.drawBaseMarks = function(x1,y1,x2,y2){
			this.vinc('cross_mark', 'auto');

			for(var by=bd.minby;by<=bd.maxby;by+=2){
				for(var bx=bd.minbx;bx<=bd.maxbx;bx+=2){
					if(bx < x1-1 || x2+1 < bx){ continue;}
					if(by < y1-1 || y2+1 < by){ continue;}

					this.drawBaseMark1((bx>>1)+(by>>1)*(k.qcols+1));
				}
			}
		};
		pc.drawBaseMark1 = function(id){
			var vid = "x_cm_"+id;

			g.fillStyle = this.Cellcolor;
			if(this.vnop(vid,this.NONE)){
				var csize = (this.lw+1)/2;
				var bx = (id%(k.qcols+1))*2, by = mf(id/(k.qcols+1))*2;
				g.fillCircle(k.p0.x+bx*this.bw, k.p0.x+by*this.bh, csize);
			}
		};

		line.repaintParts = function(idlist){
			var xlist = this.getXlistFromIdlist(idlist);
			for(var i=0;i<xlist.length;i++){
				pc.drawBaseMark1(xlist[i]);
			}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type){
			this.decode4Cell();
		};
		enc.pzlexport = function(type){
			this.encode4Cell();
		};

		enc.decodeKanpen = function(){
			fio.decodeCellQnum_kanpen();
		};
		enc.encodeKanpen = function(){
			fio.encodeCellQnum_kanpen();
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			if(this.filever==1){
				this.decodeCellQnum();
				this.decodeCellQsub();
				this.decodeBorderAns2();
			}
			else if(this.filever==0){
				this.decodeCellQnum();
				this.decodeBorderAns2();
			}
		};
		fio.encodeData = function(){
			this.filever = 1;
			this.encodeCellQnum();
			this.encodeCellQsub();
			this.encodeBorderAns2();
		};

		fio.kanpenOpen = function(){
			this.decodeCellQnum_kanpen();
			this.decodeBorder2_kanpen( function(c,ca){
				if     (ca == "1") { bd.sQaB(c, 1);}
				else if(ca == "-1"){ bd.sQsB(c, 2);}
			});
		};
		fio.kanpenSave = function(){
			this.encodeCellQnum_kanpen();
			this.encodeBorder2_kanpen( function(c){
				if     (bd.QaB(c)==1){ return "1 ";}
				else if(bd.QsB(c)==2){ return "-1 ";}
				else{ return "0 ";}
			});
		};

		// �J���y���ł́Aoutsideborder�̎��͂ς��Ղ�Ƃ͏��Ԃ��t�ɂȂ��Ă܂�
		fio.decodeBorder2_kanpen = function(func){
			this.decodeObj(func, bd.bnum, 1, 0, 2*k.qcols-1, 2*k.qrows  );
			this.decodeObj(func, bd.bnum, 0, 1, 2*k.qcols  , 2*k.qrows-1);
		};
		fio.encodeBorder2_kanpen = function(func){
			this.encodeObj(func, bd.bnum, 1, 0, 2*k.qcols-1, 2*k.qrows  );
			this.encodeObj(func, bd.bnum, 0, 1, 2*k.qcols  , 2*k.qrows-1);
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkLcntCross(3,0) ){
				this.setAlert('���򂵂Ă����������܂��B','There is a branched line.'); return false;
			}
			if( !this.checkLcntCross(4,0) ){
				this.setAlert('�����������Ă��܂��B','There is a crossing line.'); return false;
			}

			if( !this.checkdir4Border() ){
				this.setAlert('�����̎���ɂ��鋫�E���̖{�����Ⴂ�܂��B','The number is not equal to the number of border lines around it.'); return false;
			}

			if( !this.checkOneLoop() ){
				this.setAlert('�ւ�������ł͂���܂���B','There are plural loops.'); return false;
			}

			if( !this.checkLcntCross(1,0) ){
				this.setAlert('�r���œr�؂�Ă����������܂��B','There is a dead-end line.'); return false;
			}

			return true;
		};
	}
};
