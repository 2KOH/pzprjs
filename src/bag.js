//
// �p�Y���ŗL�X�N���v�g�� �o�b�O�� bag.js v3.3.0
//
Puzzles.bag = function(){ };
Puzzles.bag.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
		k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
		k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
		k.isoutsideborder = 1;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
		k.isLineCross     = 0;	// 1:������������p�Y��
		k.isCenterLine    = 0;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = 1;	// 1:���E����line�Ƃ��Ĉ���

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

		base.setTitle("�o�b�O", "BAG (Corral)");
		base.setExpression("�@���h���b�O�Ő����A�E�N���b�N�ŃZ���̔w�i�F(��/���F)�����͂ł��܂��B",
						   " Left Button Drag to input lines, Right Click to input background color (lime or yellow) of the cell.");
		base.setFloatbgcolor("rgb(160, 0, 0)");
	},
	menufix : function(){
		pp.addCheck('bgcolor','setting',false, '�w�i�F����', 'Background-color');
		pp.setLabel('bgcolor', '�Z���̒������N���b�N�������ɔw�i�F�̓��͂�L���ɂ���', 'Enable to Input BGColor When the Center of the Cell is Clicked');

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

			ee('ck_bgcolor').el.disabled    = (num===3?"":"true");
			ee('cl_bgcolor').el.style.color = (num===3?"black":"silver");
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
			if(k.editmode){
				if(!kp.enabled()){ this.inputqnum();}
				else{ kp.display();}
			}
			else if(k.playmode){
				if(!pp.getVal('bgcolor') || !this.inputBGcolor0()){
					if(this.btn.Left) this.inputborderans();
					else if(this.btn.Right) this.inputBGcolor(true);
				}
				else{ this.inputBGcolor(false);}
			}
		};
		mv.mouseup = function(){ };
		mv.mousemove = function(){
			if(k.playmode){
				if(!pp.getVal('bgcolor') || this.inputData<10){
					if(this.btn.Left) this.inputborderans();
					else if(this.btn.Right) this.inputBGcolor(true);
				}
				else{ this.inputBGcolor(false);}
			}
		};

		mv.inputBGcolor0 = function(){
			var pos = this.borderpos(0.25);
			return ((pos.x&1) && (pos.y&1));
		};
		mv.inputBGcolor = function(isnormal){
			var cc = this.cellid();
			if(cc==-1 || cc==this.mouseCell){ return;}
			if(this.inputData==-1){
				if(isnormal || this.btn.Left){
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
			if(k.playmode){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca);
		};

		if(k.EDITOR){
			kp.generate(0, true, false, '');
			kp.kpinput = function(ca){
				kc.key_inputqnum(ca);
			};
		}

		bd.nummaxfunc = function(cc){ return Math.min(bd.maxnum,k.qcols+k.qrows-1);};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_DLIGHT;
		pc.setBGCellColorFunc('qsub2');
		pc.setBorderColorFunc('line');

		pc.chassisflag = false;

		pc.paint = function(x1,y1,x2,y2){
			this.drawBGCells(x1,y1,x2,y2);
			this.drawDashedGrid(x1,y1,x2,y2);
			this.drawBorders(x1,y1,x2,y2);

			this.drawNumbers(x1,y1,x2,y2);

			this.drawTarget(x1,y1,x2,y2);
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type){
			this.decodeNumber16();
		};
		enc.pzlexport = function(type){
			this.encodeNumber16();
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			this.decodeCellQnum();
			this.decodeCellQsub();
			this.decodeBorderAns2();
		};
		fio.encodeData = function(){
			this.encodeCellQnum();
			this.encodeCellQsub();
			this.encodeBorderAns2();
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkLcntCross(3,0) ){
				this.setAlert('���򂵂Ă����������܂��B', 'There is a branch line.'); return false;
			}
			if( !this.checkLcntCross(4,0) ){
				this.setAlert('�����������Ă��܂��B', 'There is a crossing line.'); return false;
			}

			if( !this.checkOneLoop() ){
				this.setAlert('�ւ�������ł͂���܂���B','There are two or more loops.'); return false;
			}

			if( !this.checkLcntCross(1,0) ){
				this.setAlert('�r���œr�؂�Ă����������܂��B', 'There is a dead-end line.'); return false;
			}

			var icheck = this.generateIarea();
			if( !this.checkNumberInside(icheck) ){
				this.setAlert('�ւ̓����ɓ����Ă��Ȃ�����������܂��B','There is an outside number.'); return false;
			}
			if( !this.checkCellNumber(icheck) ){
				this.setAlert('�����Ɨւ̓����ɂȂ�4�����̃}�X�̍��v���Ⴂ�܂��B','The number and the sum of the inside cells of four direction is different.'); return false;
			}

			return true;
		};

		ans.generateIarea = function(){
			var icheck = [];
			icheck[0]=(line.lcntCell(0)==0?-1:1);
			for(var by=1;by<bd.maxby;by+=2){
				if(by>1){ icheck[bd.cnum(1,by)]=icheck[bd.cnum(1,by-2)]*(bd.isLine(bd.bnum(1,by-1))?-1:1);}
				for(var bx=3;bx<bd.maxbx;bx+=2){
					icheck[bd.cnum(bx,by)]=icheck[bd.cnum(bx-2,by)]*(bd.isLine(bd.bnum(bx-1,by))?-1:1);
				}
			}
			return icheck;
		};
		ans.checkNumberInside = function(icheck){
			var result = true;
			for(var c=0;c<bd.cellmax;c++){
				if(icheck[c]==-1 && bd.QnC(c)!=-1){
					if(this.inAutoCheck){ return false;}
					bd.sErC([c],1);
					result = false;
				}
			}
			return result;
		};
		ans.checkCellNumber = function(icheck){
			var result = true;
			for(var cc=0;cc<bd.cellmax;cc++){
				if(bd.QnC(cc)<0){ continue;}

				var list = [];
				list.push(cc);
				var cnt = 1;
				var tx, ty;
				tx = bd.cell[cc].bx-2; ty = bd.cell[cc].by;
				while(tx>bd.minbx){ var c=bd.cnum(tx,ty); if(icheck[c]!==-1){ cnt++; list.push(c); tx-=2;} else{ break;} }
				tx = bd.cell[cc].bx+2; ty = bd.cell[cc].by;
				while(tx<bd.maxbx){ var c=bd.cnum(tx,ty); if(icheck[c]!==-1){ cnt++; list.push(c); tx+=2;} else{ break;} }
				tx = bd.cell[cc].bx; ty = bd.cell[cc].by-2;
				while(ty>bd.minby){ var c=bd.cnum(tx,ty); if(icheck[c]!==-1){ cnt++; list.push(c); ty-=2;} else{ break;} }
				tx = bd.cell[cc].bx; ty = bd.cell[cc].by+2;
				while(ty<bd.maxby){ var c=bd.cnum(tx,ty); if(icheck[c]!==-1){ cnt++; list.push(c); ty+=2;} else{ break;} }

				if(bd.QnC(cc)!=cnt){
					if(this.inAutoCheck){ return false;}
					bd.sErC(list,1);
					result = false;
				}
			}
			return result;
		};
	}
};
