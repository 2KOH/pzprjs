//
// �p�Y���ŗL�X�N���v�g�� ���Ɣ� sudoku.js v3.3.0
//
Puzzles.sudoku = function(){ };
Puzzles.sudoku.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 9;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 9;}	// �Ֆʂ̏c��
		k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 0;		// 1:Border/Line������\�ȃp�Y��
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

		k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 1;	// 1:pencilbox/�J���y���ɂ���p�Y��

		//k.def_csize = 36;
		//k.def_psize = 24;
		//k.area = { bcell:0, wcell:0, number:0};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		base.setTitle("����","Sudoku");
		base.setExpression("�@�L�[�{�[�h��}�E�X�Ő��������͂ł��܂��B",
						   " It is available to input number by keybord or mouse");
		base.setFloatbgcolor("rgb(64, 64, 64)");
		base.proto = 1;

		enc.pidKanpen = 'sudoku';
	},
	menufix : function(){ },

	protoChange : function(){
		this.newboard_html_original = document.newboard.innerHTML;

		document.newboard.innerHTML =
			["<span id=\"pop1_1_cap0\">�Ֆʂ�V�K�쐬���܂��B</span><br>\n",
			 "<input type=\"radio\" name=\"size\" value=\"9\" checked>9�~9<br>\n",
			 "<input type=\"radio\" name=\"size\" value=\"16\">16�~16<br>\n",
			 "<input type=\"radio\" name=\"size\" value=\"25\">25�~25<br>\n",
			 "<input type=\"radio\" name=\"size\" value=\"4\">4�~4<br>\n",
			 "<input type=\"button\" name=\"newboard\" value=\"�V�K�쐬\" /><input type=\"button\" name=\"cancel\" value=\"�L�����Z��\" />\n"
			].join('');
	},
	protoOriginal : function(){
		document.newboard.innerHTML = this.newboard_html_original;
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if(!kp.enabled()){ this.inputqnum();}
			else{ kp.display();}
		};
		mv.mouseup = function(){ };
		mv.mousemove = function(){ };

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca);
		};

		kp.kpgenerate = function(mode){
			this.inputcol('num','knum1','1','1');
			this.inputcol('num','knum2','2','2');
			this.inputcol('num','knum3','3','3');
			this.inputcol('num','knum4','4','4');
			this.insertrow();
			this.inputcol('num','knum5','5','5');
			this.inputcol('num','knum6','6','6');
			this.inputcol('num','knum7','7','7');
			this.inputcol('num','knum8','8','8');
			this.insertrow();
			this.inputcol('num','knum9','9','9');
			if(mode==1){
				this.inputcol('num','knum.','-','?');
				this.inputcol('num','knum_',' ',' ');
			}
			else{
				this.inputcol('empty','knumx','','');
				this.inputcol('num','knum_',' ',' ');
			}
			this.inputcol('num','knum0','0','0');
			this.insertrow();
		};
		kp.generate(kp.ORIGINAL, true, true, kp.kpgenerate);
		kp.kpinput = function(ca){
			kc.key_inputqnum(ca);
		};

		bd.nummaxfunc = function(cc){ return Math.max(k.qcols,k.qrows);};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawBGCells(x1,y1,x2,y2);
			this.drawGrid(x1,y1,x2,y2);
			this.drawBlockBorders(x1,y1,x2,y2);

			this.drawNumbers(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawTCell(x1,y1,x2+1,y2+1);
		};
		pc.drawBlockBorders = function(x1,y1,x2,y2){
			this.vinc('border_block', 'crispEdges');

			var lw = this.lw, lm = this.lm;

			var max=k.qcols;
			var block=mf(Math.sqrt(max)+0.1);
			var headers = ["bbx_", "bby_"];

			if(x1<0){ x1=0;} if(x2>k.qcols-1){ x2=k.qcols-1;}
			if(y1<0){ y1=0;} if(y2>k.qrows-1){ y2=k.qrows-1;}

			g.fillStyle = "black";
			for(var i=1;i<block;i++){
				if(x1-1<=i*block&&i*block<=x2+1){ if(this.vnop(headers[0]+i,this.NONE)){
					g.fillRect(k.p0.x+i*block*k.cwidth-lw+1, k.p0.y+y1*k.cheight-lw+1, lw, (y2-y1+1)*k.cheight+2*lw-1);
				}}
			}
			for(var i=1;i<block;i++){
				if(y1-1<=i*block&&i*block<=y2+1){ if(this.vnop(headers[1]+i,this.NONE)){
					g.fillRect(k.p0.x+x1*k.cwidth-lw+1, k.p0.y+i*block*k.cheight-lw+1, (x2-x1+1)*k.cwidth+2*lw-1, lw);
				}}
			}
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

		enc.decodeKanpen = function(){
			fio.decodeCellQnum_kanpen();
		};
		enc.encodeKanpen = function(){
			this.outsize = [k.qcols].join('/');

			fio.encodeCellQnum_kanpen();
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			this.decodeCellQnum();
			this.decodeCellQanssub();
		};
		fio.encodeData = function(){
			this.sizestr = [k.qcols].join("/");

			this.encodeCellQnum();
			this.encodeCellQanssub();
		};

		fio.kanpenOpen = function(){
			this.decodeCellQnum_kanpen();
			this.decodeCellQans_kanpen();
		};
		fio.kanpenSave = function(){
			this.sizestr = [k.qcols].join("/");

			this.encodeCellQnum_kanpen();
			this.encodeCellQans_kanpen();
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkRoomNumber() ){
				this.setAlert('�����u���b�N�ɓ��������������Ă��܂��B','There are same numbers in a block.'); return false;
			}

			if( !this.checkRowsCols(this.isDifferentNumberInClist, bd.getNum) ){
				this.setAlert('������ɓ��������������Ă��܂��B','There are same numbers in a row.'); return false;
			}

			if( !this.checkAllCell(bd.noNum) ){
				this.setAlert('�����̓����Ă��Ȃ��}�X������܂��B','There is a empty cell.'); return false;
			}

			return true;
		};
		ans.check1st = function(){ return this.checkAllCell(bd.noNum);};

		ans.checkRoomNumber = function(){
			var result = true;
			var max=k.qcols;
			var blk=mf(Math.sqrt(max)+0.1);
			for(var i=0;i<max;i++){
				var clist = bd.getClistByPosition((i%blk)*blk, mf(i/blk)*blk, (i%blk+1)*blk-1, mf(i/blk+1)*blk-1);
				if(!this.isDifferentNumberInClist(clist, bd.getNum)){
					if(this.inAutoCheck){ return false;}
					result = false;
				}
			}
			return result;
		};
	}
};
