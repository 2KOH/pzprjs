//
// �p�Y���ŗL�X�N���v�g�� �N���V���[�g�� kurochute.js v3.2.3
//
Puzzles.kurochute = function(){ };
Puzzles.kurochute.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 8;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 8;}	// �Ֆʂ̏c��
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
		k.isAnsNumber   = 0;	// 1:�񓚂ɐ�������͂���p�Y��
		k.isArrowNumber = 0;	// 1:������������͂���p�Y��
		k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
		k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
		k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

		k.BlackCell     = 1;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 1;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 1;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 1;	// 1:pencilbox/�J���y���ɂ���p�Y��

		k.fstruct = ["cellqnum", "cellqanssub"];

		//k.def_csize = 36;
		//k.def_psize = 16;
		k.area = { bcell:0, wcell:1, number:0};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		base.setTitle("�N���V���[�g","Kurochute");
		base.setExpression("�@���N���b�N�ō��}�X���A�E�N���b�N�Ŕ��}�X�m��}�X�����͂ł��܂��B",
						   " Left Click to input black cells, Right Click to input determined white cells.");
		base.setFloatbgcolor("rgb(96, 96, 96)");
	},
	menufix : function(){
		menu.addUseToFlags();
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if     (k.editmode) this.inputqnum();
			else if(k.playmode) this.inputcell();
		};
		mv.mouseup = function(){
			if(k.playmode && this.notInputted()) this.inputqsub();
		};
		mv.mousemove = function(){
			if(k.playmode) this.inputcell();
		};
		mv.inputqsub = function(){
			var cc = this.cellid();
			if(cc==-1){ return;}

			if     (bd.QsC(cc)==0){ bd.sQsC(cc,2);}
			else if(bd.QsC(cc)==2){ bd.sQsC(cc,0);}
			pc.paintCell(cc);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.playmode){ return;}
			if(this.key_inputdirec(ca)){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca);
		};

		bd.nummaxfunc = function(cc){ return Math.max(k.qcols,k.qrows)-1;};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_LIGHT;
		pc.qsubcolor1 = "white";
		pc.qsubcolor2 = pc.bcolor_GREEN;

		pc.paint = function(x1,y1,x2,y2){
			x2++; y2++;
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawGrid(x1,y1,x2,y2);
			this.drawBWCells(x1,y1,x2,y2);

			this.drawNumbers(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawTarget(x1,y1,x2,y2);
		};

		// �I�[�o�[���C�h drawBWCells�p
		pc.setCellColor = function(cc){
			var _b = bd.isBlack(cc), err = bd.cell[cc].error;

			if     ( _b && err===0){ g.fillStyle = this.Cellcolor; return true;}
			else if( _b && err===1){ g.fillStyle = this.errcolor1; return true;}
			else if( _b && err===2){ g.fillStyle = this.errcolor2; return true;}
			else if(!_b && err===1){ g.fillStyle = this.errbcolor1; return false;}
			else if(bd.cell[cc].qsub===2){ g.fillStyle = this.qsubcolor2; return false;}
			g.fillStyle = "white"; return false;
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==0 || type==1){ bstr = this.decodeNumber16(bstr);}
			else if(type==2){ bstr = this.decodeKanpen(bstr);}
		};

		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
			else if(type==2){ document.urloutput.ta.value = this.kanpenbase()+"kurochute.html?problem="+this.pzldataKanpen();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			return "/"+k.qcols+"/"+k.qrows+"/"+this.encodeNumber16();
		};

		enc.decodeKanpen = function(bstr){
			bstr = (bstr.split("_")).join(" ");
			fio.decodeCell( function(c,ca){
				if(ca != "."){ bd.sQnC(c, parseInt(ca));}
			},bstr.split("/"));
			return "";
		};
		enc.pzldataKanpen = function(){
			return ""+k.qrows+"/"+k.qcols+"/"+fio.encodeCell( function(c){
				return (bd.QnC(c)>=0)?(bd.QnC(c).toString() + "_"):"._";
			});
		};

		//---------------------------------------------------------
		fio.kanpenOpen = function(array){
			this.decodeCell( function(c,ca){
				if     (ca == "#"){ bd.setBlack(c);}
				else if(ca == "+"){ bd.sQsC(c, 1);}
				else if(ca != "."){ bd.sQnC(c, parseInt(ca));}
			},array.slice(0,k.qrows));
		};
		fio.kanpenSave = function(){
			return ""+this.encodeCell( function(c){
				if     (bd.QnC(c)>=0 ){ return (bd.QnC(c).toString() + " ");}
				else if(bd.isBlack(c)){ return "# ";}
				else if(bd.QsC(c)==1 ){ return "+ ";}
				else                  { return ". ";}
			});
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkSideCell(function(c1,c2){ return (bd.isBlack(c1) && bd.isBlack(c2));}) ){
				this.setAlert('���}�X���^�e���R�ɘA�����Ă��܂��B','Black cells are adjacent.'); return false;
			}

			if( !this.checkOneArea( area.getWCellInfo() ) ){
				this.setAlert('���}�X�����f����Ă��܂��B','White cells are devided.'); return false;
			}

			if( !this.checkCellNumber() ){
				this.setAlert('�����̐��������ꂽ�}�X�̂����A1�}�X�������}�X�ɂȂ��Ă��܂���B','The number of black cells at aparted cell by the number is not one.'); return false;
			}

			return true;
		};
		ans.check1st = function(){ return true;};

		ans.checkCellNumber = function(){
			var cx, cy;

			for(var c=0;c<bd.cellmax;c++){
				if(bd.QnC(c)<0){ continue;}
				var cx=bd.cell[c].cx, cy=bd.cell[c].cy, num=bd.QnC(c), cnt=0;
				if(bd.isBlack(bd.cnum(cx-num,cy))){ cnt++;}
				if(bd.isBlack(bd.cnum(cx+num,cy))){ cnt++;}
				if(bd.isBlack(bd.cnum(cx,cy-num))){ cnt++;}
				if(bd.isBlack(bd.cnum(cx,cy+num))){ cnt++;}
				if(cnt!=1){
					bd.sErC([c],4);
					bd.sErC([bd.cnum(cx-num,cy),bd.cnum(cx+num,cy),bd.cnum(cx,cy-num),bd.cnum(cx,cy+num)],1);
					return false;
				}
			}
			return true;
		};
	}
};
