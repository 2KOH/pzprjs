//
// �p�Y���ŗL�X�N���v�g�� �o�[���Y�� barns.js v3.3.0
//
Puzzles.barns = function(){ };
Puzzles.barns.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 8;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 8;}	// �Ֆʂ̏c��
		k.irowake  = 1;		// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross  = 0;		// 1:�Ֆʓ�����Cross������p�Y�� 2:�O�g����܂߂�Cross������p�Y��
		k.isborder = 1;		// 1:Border/Line������\�ȃp�Y�� 2:�O�g�������\�ȃp�Y��
		k.isexcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isLineCross     = true;	// ������������p�Y��
		k.isCenterLine    = true;	// �}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = false;	// ���E����line�Ƃ��Ĉ���
		k.hasroom         = false;	// �������̗̈�ɕ�����Ă���/������p�Y��
		k.roomNumber      = false;	// �����̖��̐�����1��������p�Y��

		k.dispzero        = false;	// 0��\�����邩�ǂ���
		k.isDispHatena    = true;	// qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber     = false;	// �񓚂ɐ�������͂���p�Y��
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
			base.setExpression("�@���h���b�O�ŋ��E�����A�E�N���b�N�ŕX�����͂ł��܂��B",
							   " Left Button Drag to input border lines, Right Click to input ice.");
		}
		else{
			base.setExpression("�@���h���b�O�Ő����A�E�N���b�N�Ł~�����͂ł��܂��B",
							   " Left Button Drag to input black cells, Right Click to input a cross.");
		}
		base.setTitle("�o�[���Y","Barns");
		base.setFloatbgcolor("rgb(0, 0, 191)");
	},
	menufix : function(){
		menu.addRedLineToFlags();
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if(kc.isZ ^ pp.getVal('dispred')){ this.dispRedLine(); return;}
			if(k.editmode){
				if(this.btn.Left) this.inputborder();
				else if(this.btn.Right) this.inputIcebarn();
			}
			else if(k.playmode){
				if(this.btn.Left) this.inputLine();
				else if(this.btn.Right) this.inputpeke();
			}
		};
		mv.mouseup = function(){ };
		mv.mousemove = function(){
			if(k.editmode){
				if(this.btn.Left) this.inputborder();
				else if(this.btn.Right) this.inputIcebarn();
			}
			else if(k.playmode){
				if(this.btn.Left) this.inputLine();
				else if(this.btn.Right) this.inputpeke();
			}
		};
		mv.inputIcebarn = function(){
			var cc = this.cellid();
			if(cc==-1 || cc==this.mouseCell){ return;}
			if(this.inputData==-1){ this.inputData = (bd.QuC(cc)==6?0:6);}

			bd.sQuC(cc, this.inputData);
			pc.paintCell(cc);
		},

		// ���������������Ȃ��̂ŏ㏑��
		bd.isLineNG = function(id){ return (bd.QuB(id)==1);},
		bd.enableLineNG = true;

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){ if(ca=='z' && !this.keyPressed){ this.isZ=true;}};
		kc.keyup = function(ca){ if(ca=='z'){ this.isZ=false;}};
		kc.isZ = false;
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_LIGHT;
		pc.linecolor = pc.linecolor_LIGHT;
		pc.errbcolor1 = pc.errbcolor1_DARK;
		pc.setBGCellColorFunc('icebarn');

		pc.maxYdeg = 0.70;

		pc.paint = function(x1,y1,x2,y2){
			this.drawBGCells(x1,y1,x2,y2);
			this.drawDashedGrid(x1,y1,x2,y2);
			this.drawBorders(x1,y1,x2,y2);

			this.drawLines(x1,y1,x2,y2);
			this.drawPekes(x1,y1,x2,y2,0);

			this.drawChassis(x1,y1,x2,y2);
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type){
			this.decodeBarns();
			this.decodeBorder();
		};
		enc.pzlexport = function(type){
			this.encodeBarns();
			this.encodeBorder();
		};

		enc.decodeBarns = function(){
			var c=0, bstr = this.outbstr;
			for(var i=0;i<bstr.length;i++){
				var ca = parseInt(bstr.charAt(i),32);
				for(var w=0;w<5;w++){ if((i*5+w)<bd.cellmax){ bd.sQuC(i*5+w,(ca&Math.pow(2,4-w)?6:0));} }
				if((i*5+5)>=bd.cellmax){ break;}
			}
			this.outbstr = bstr.substr(i+1);
		};
		enc.encodeBarns = function(){
			var cm = "";
			var num = 0, pass = 0;
			for(var i=0;i<bd.cellmax;i++){
				if(bd.QuC(i)==6){ pass+=Math.pow(2,4-num);}
				num++; if(num==5){ cm += pass.toString(32); num=0; pass=0;}
			}
			if(num>0){ cm += pass.toString(32);}

			this.outbstr += cm;
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			this.decodeCell( function(c,ca){
				if(ca=="1"){ bd.sQuC(c, 6);}
			});
			this.decodeBorderQues();
			this.decodeBorderLine();
		};
		fio.encodeData = function(){
			this.encodeCell( function(c){
				return ""+(bd.QuC(c)==6?"1":".")+" ";
			});
			this.encodeBorderQues();
			this.encodeBorderLine();
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkLcntCell(3) ){
				this.setAlert('���򂵂Ă����������܂��B','There is a branch line.'); return false;
			}

			if( !this.checkAllCell(function(c){ return (line.lcntCell(c)==4 && bd.QuC(c)!=6 && bd.QuC(c)!=101);}) ){
				this.setAlert('�X�̕����ȊO�Ő����������Ă��܂��B', 'A Line is crossed outside of ice.'); return false;
			}
			if( !this.checkAllCell(function(c){ return (line.lcntCell(c)==2 && bd.QuC(c)==6 && !ans.isLineStraight(c));}) ){
				this.setAlert('�X�̕����Ő����Ȃ����Ă��܂��B', 'A Line curve on ice.'); return false;
			}

			if( !this.checkOneLoop() ){
				this.setAlert('�ւ�������ł͂���܂���B','There are two or more loops.'); return false;
			}

			if( !this.checkLcntCell(0) ){
				this.setAlert('����������Ă��Ȃ��}�X������܂��B','There is a line-less cell.'); return false;
			}

			if( !this.checkLcntCell(1) ){
				this.setAlert('�r���œr�؂�Ă����������܂��B', 'There is a dead-end line.'); return false;
			}

			return true;
		};
	}
};
