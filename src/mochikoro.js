//
// �p�Y���ŗL�X�N���v�g�� ���`�R���� mochikoro.js v3.2.0
//
Puzzles.mochikoro = function(){ };
Puzzles.mochikoro.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
		k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 0;		// 1:Border/Line������\�ȃp�Y��
		k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
		k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
		k.isborderCross   = 0;	// 1:������������p�Y��
		k.isCenterLine    = 0;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

		k.dispzero      = 0;	// 1:0��\�����邩�ǂ���
		k.isDispHatena  = 1;	// 1:qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber   = 0;	// 1:�񓚂ɐ�������͂���p�Y��
		k.isArrowNumber = 0;	// 1:������������͂���p�Y��
		k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
		k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
		k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

		k.BlackCell     = 1;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 1;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 0;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

		k.fstruct = ["cellqnum","cellans"];

		//k.def_csize = 36;
		//k.def_psize = 24;

		base.setTitle("���`�R��","Mochikoro");
		base.setExpression("�@���N���b�N�ō��}�X���A�E�N���b�N�Ŕ��}�X�m��}�X�����͂ł��܂��B",
						   " Left Click to input black cells, Right Click to input determined white cells.");
		base.setFloatbgcolor("rgb(64, 64, 64)");
	},
	menufix : function(){
		menu.addUseToFlags();
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(k.mode==1){
				if(!kp.enabled()){ this.inputqnum(x,y,99);}
				else{ kp.display(x,y);}
			}
			else if(k.mode==3) this.inputcell(x,y);
		};
		mv.mouseup = function(x,y){ };
		mv.mousemove = function(x,y){
			if(k.mode==3) this.inputcell(x,y);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.mode==3){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca,99);
		};

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
		pc.bcolor = "rgb(127, 255, 127)";
		pc.errcolor1 = "rgb(192, 0, 0)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);

			this.drawWhiteCells(x1,y1,x2,y2);
			this.drawBDline(x1,y1,x2,y2);
			this.drawBlackCells(x1,y1,x2,y2);

			this.drawNumbers(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==0 || type==1){ bstr = this.decodeNumber16(bstr);}
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			return "/"+k.qcols+"/"+k.qrows+"/"+this.encodeNumber16();
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.check2x2Block( function(cc){ return (bd.QaC(cc)==1);} ) ){
				this.setAlert('2x2�̍��}�X�̂����܂肪����܂��B','There is a block of 2x2 black cells.'); return false;
			}

			if( !this.checkWareaSequent() ){
				this.setAlert('�Ǘ��������}�X�̃u���b�N������܂��B','White cells are devided.'); return false;
			}

			var warea = this.searchWarea();
			if( !this.isAreaRect(warea, function(cc){ return (bd.QaC(cc)!=1);}) ){
				this.setAlert('�l�p�`�łȂ����}�X�̃u���b�N������܂��B','There is a block of white cells that is not rectangle.'); return false;
			}

			if( !this.checkQnumsInArea(warea, function(a){ return (a>=2);}) ){
				this.setAlert('1�̃u���b�N��2�ȏ�̐����������Ă��܂��B','A block has plural numbers.'); return false;
			}

			if( !this.checkNumberAndSize(warea) ){
				this.setAlert('�����ƃu���b�N�̖ʐς��Ⴂ�܂��B','A size of tha block and the number written in the block is differrent.'); return false;
			}

			return true;
		};

		ans.checkWareaSequent = function(){
			var func = function(id){ return (id!=-1 && bd.QaC(id)!=1); };
			var area = new AreaInfo();
			for(var c=0;c<bd.cell.length;c++){ area.check[c]=(func(c)?0:-1);}
			for(var c=0;c<bd.cell.length;c++){ if(area.check[c]==0){ area.max++; area.room[area.max]=new Array(); this.sk0(func, area, c, area.max);} }
			return ans.linkBWarea(area);
		};
		ans.sk0 = function(func, area, i, areaid){
			if(area.check[i]!=0){ return;}
			area.check[i] = areaid;
			area.room[areaid].push(i);
			if( func(bd.up(i)) ){ this.sk0(func, area, bd.up(i), areaid);}
			if( func(bd.dn(i)) ){ this.sk0(func, area, bd.dn(i), areaid);}
			if( func(bd.lt(i)) ){ this.sk0(func, area, bd.lt(i), areaid);}
			if( func(bd.rt(i)) ){ this.sk0(func, area, bd.rt(i), areaid);}

			if(bd.cell[i].cx>0){
				if( func(bd.up(bd.lt(i))) ){ this.sk0(func, area, bd.up(bd.lt(i)), areaid);}
				if( func(bd.dn(bd.lt(i))) ){ this.sk0(func, area, bd.dn(bd.lt(i)), areaid);}
			}
			if(bd.cell[i].cx<k.qcols-1){
				if( func(bd.up(bd.rt(i))) ){ this.sk0(func, area, bd.up(bd.rt(i)), areaid);}
				if( func(bd.dn(bd.rt(i))) ){ this.sk0(func, area, bd.dn(bd.rt(i)), areaid);}
			}
		};
	}
};
