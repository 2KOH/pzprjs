//
// �p�Y���ŗL�X�N���v�g�� ���W������ yajirin.js v3.2.4
// 
Puzzles.yajirin = function(){ };
Puzzles.yajirin.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
		k.irowake = 1;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
		k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
		k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
		k.isLineCross     = 0;	// 1:������������p�Y��
		k.isCenterLine    = 1;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

		k.dispzero      = 1;	// 1:0��\�����邩�ǂ���
		k.isDispHatena  = 1;	// 1:qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber   = 0;	// 1:�񓚂ɐ�������͂���p�Y��
		k.isArrowNumber = 1;	// 1:������������͂���p�Y��
		k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
		k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
		k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

		k.BlackCell     = 1;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 1;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 1;	// 1:pencilbox/�J���y���ɂ���p�Y��

		//k.def_csize = 36;
		//k.def_psize = 24;
		//k.area = { bcell:0, wcell:0, number:0};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		if(k.EDITOR){
			base.setExpression("�@���́A�}�E�X�̍��h���b�O���ASHIFT�����Ȃ�����L�[�œ��͂ł��܂��B",
							   " To input Arrows, Left Button Drag or Press arrow key with SHIFT key.");
		}
		else{
			base.setExpression("�@���h���b�O�Ő����A���N���b�N�ō��}�X�����͂ł��܂��B",
							   " Left Button Drag to input black cells, Left Click to input black cells.");
		}
		base.setTitle("���W����","Yajilin");
		base.setFloatbgcolor("rgb(0, 224, 0)");

		enc.pidKanpen = 'yajilin';
	},
	menufix : function(){
		menu.addUseToFlags();
		menu.addRedLineToFlags();
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if(kc.isZ ^ pp.getVal('dispred')){ this.dispRedLine(); return;}
			if(k.editmode) this.inputdirec();
			else if(k.playmode){
				if(this.btn.Left) this.inputLine();
				else if(this.btn.Right) this.inputpeke();
			}
		};
		mv.mouseup = function(){
			if(this.notInputted()){
				if     (k.editmode) this.inputqnum();
				else if(k.playmode) this.inputcell();
			}
		};
		mv.mousemove = function(){
			if(k.editmode) this.inputdirec();
			else if(k.playmode){
				if(this.btn.Left) this.inputLine();
				else if(this.btn.Right) this.inputpeke();
			}
		};

		// ���������������Ȃ��̂ŏ㏑��
		bd.isnoLPup    = function(cc){ return (bd.isBlack(cc) || bd.QnC(cc)!=-1);},
		bd.isnoLPdown  = function(cc){ return (bd.isBlack(cc) || bd.QnC(cc)!=-1);},
		bd.isnoLPleft  = function(cc){ return (bd.isBlack(cc) || bd.QnC(cc)!=-1);},
		bd.isnoLPright = function(cc){ return (bd.isBlack(cc) || bd.QnC(cc)!=-1);},
		bd.enableLineNG = true;

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(ca=='z' && !this.keyPressed){ this.isZ=true; return;}
			if(k.playmode){ return;}
			if(this.key_inputdirec(ca)){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca);
		};
		kc.keyup = function(ca){ if(ca=='z'){ this.isZ=false;}};
		kc.isZ = false;
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_LIGHT;
		pc.dotcolor = "rgb(255, 96, 191)";

		pc.paint = function(x1,y1,x2,y2){
			x2++; y2++;
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawBGCells(x1,y1,x2,y2);
			this.drawRDotCells(x1,y1,x2,y2);
			this.drawGrid(x1,y1,x2,y2);
			this.drawBlackCells(x1,y1,x2,y2);

			this.drawArrowNumbers(x1,y1,x2,y2);

			this.drawLines(x1,y1,x2,y2);
			this.drawPekes(x1,y1,x2,y2,1);

			this.drawChassis(x1,y1,x2,y2);

			this.drawTarget(x1,y1,x2,y2);
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

		enc.decodeKanpen = function(){
			fio.decodeCellDirecQnum_kanpen(true);
		};
		enc.encodeKanpen = function(){
			fio.encodeCellDirecQnum_kanpen(true);
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			this.decodeCellDirecQnum();
			this.decodeCellAns();
			this.decodeBorderLine();
		};
		fio.encodeData = function(){
			this.encodeCellDirecQnum();
			this.encodeCellAns();
			this.encodeBorderLine();
		};

		fio.kanpenOpen = function(array){
			this.decodeCellDirecQnum_kanpen(false);
			this.decodeBorderLine();
		};
		fio.kanpenSave = function(){
			this.encodeCellDirecQnum_kanpen(false);
			this.encodeBorderLine();
		};

		fio.decodeCellDirecQnum_kanpen = function(isurl){
			this.decodeCell( function(c,ca){
				if     (ca=="#" && !isurl){ bd.setBlack(c);}
				else if(ca=="+" && !isurl){ bd.sQsC(c,1);}
				else if(ca != "."){
					var num = parseInt(ca);
					if     (num<16){ bd.sDiC(c,k.UP); bd.sQnC(c,num   );}
					else if(num<32){ bd.sDiC(c,k.LT); bd.sQnC(c,num-16);}
					else if(num<48){ bd.sDiC(c,k.DN); bd.sQnC(c,num-32);}
					else if(num<64){ bd.sDiC(c,k.RT); bd.sQnC(c,num-48);}
				}
			});
		};
		fio.encodeCellDirecQnum_kanpen = function(isurl){
			this.encodeCell( function(c){
				var num = (bd.QnC(c)>=0&&bd.QnC(c)<10?bd.QnC(c):-1)
				if(num==-1 && !isurl){
					if     (bd.isBlack(c)){ return "# ";}
					else if(bd.QsC(c)==1) { return "+ ";}
					else                  { return ". ";}
				}
				else if(bd.DiC(c)==k.UP){ return ""+( 0+num)+" ";}
				else if(bd.DiC(c)==k.LT){ return ""+(16+num)+" ";}
				else if(bd.DiC(c)==k.DN){ return ""+(32+num)+" ";}
				else if(bd.DiC(c)==k.RT){ return ""+(48+num)+" ";}
				else                    { return ". ";}
			});
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkLcntCell(3) ){
				this.setAlert('���򂵂Ă����������܂��B','There is a branched line.'); return false;
			}
			if( !this.checkLcntCell(4) ){
				this.setAlert('�������Ă����������܂��B','There is a crossing line.'); return false;
			}

			if( !this.checkAllCell(function(c){ return (line.lcntCell(c)>0 && bd.isBlack(c));}) ){
				this.setAlert('���}�X�̏�ɐ���������Ă��܂��B','Theer is a line on the black cell.'); return false;
			}

			if( !this.checkSideCell(function(c1,c2){ return (bd.isBlack(c1) && bd.isBlack(c2));}) ){
				this.setAlert('���}�X���^�e���R�ɘA�����Ă��܂��B','Black cells are adjacent.'); return false;
			}

			if( !this.checkLcntCell(1) ){
				this.setAlert('�r�؂�Ă����������܂��B','There is a dead-end line.'); return false;
			}

			if( !this.checkArrowNumber() ){
				this.setAlert('���̕����ɂ��鍕�}�X�̐�������������܂���B','The number of black cells are not correct.'); return false;
			}

			if( !this.checkOneLoop() ){
				this.setAlert('�ւ�������ł͂���܂���B','There are plural loops.'); return false;
			}

			if( !this.checkAllCell(function(c){ return (line.lcntCell(c)==0 && !bd.isBlack(c) && bd.QnC(c)==-1);}) ){
				this.setAlert('���}�X������������Ă��Ȃ��}�X������܂��B','Theer is an empty cell.'); return false;
			}

			return true;
		};
		ans.check1st = function(){ return this.checkLcntCell(1);};

		ans.checkArrowNumber = function(){
			var result = true;
			for(var c=0;c<bd.cellmax;c++){
				if(bd.QnC(c)<0 || bd.DiC(c)==0 || bd.isBlack(c)){ continue;}
				var cx = bd.cell[c].cx, cy = bd.cell[c].cy, dir = bd.DiC(c);
				var cnt=0, clist = [];
				if     (dir==k.UP){ cy--; while(cy>=0     ){ clist.push(bd.cnum(cx,cy)); cy--;} }
				else if(dir==k.DN){ cy++; while(cy<k.qrows){ clist.push(bd.cnum(cx,cy)); cy++;} }
				else if(dir==k.LT){ cx--; while(cx>=0     ){ clist.push(bd.cnum(cx,cy)); cx--;} }
				else if(dir==k.RT){ cx++; while(cx<k.qcols){ clist.push(bd.cnum(cx,cy)); cx++;} }

				for(var i=0;i<clist.length;i++){ if(bd.isBlack(clist[i])){ cnt++;} }

				if(bd.QnC(c)!=cnt){
					if(this.inAutoCheck){ return false;}
					bd.sErC([c],1);
					bd.sErC(clist,1);
					result = false;
				}
			}
			return result;
		};
	}
};
