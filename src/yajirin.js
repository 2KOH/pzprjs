//
// �p�Y���ŗL�X�N���v�g�� ���W������ yajirin.js v3.2.0p1
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
		k.isborderCross   = 0;	// 1:������������p�Y��
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

		k.fstruct = ["celldirecnum","cellans","borderline"];

		//k.def_csize = 36;
		//k.def_psize = 24;

		if(k.callmode=="pmake"){
			base.setExpression("�@���́A�}�E�X�̍��h���b�O���ASHIFT�����Ȃ�����L�[�œ��͂ł��܂��B",
							   " To input Arrows, Left Button Drag or Press arrow key with SHIFT key.");
		}
		else{
			base.setExpression("�@���h���b�O�Ő����A���N���b�N�ō��}�X�����͂ł��܂��B",
							   " Left Button Drag to input black cells, Left Click to input black cells.");
		}
		base.setTitle("���W����","Yajilin");
		base.setFloatbgcolor("rgb(0, 224, 0)");
	},
	menufix : function(){
		menu.addUseToFlags();
		menu.addRedLineToFlags();
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(kc.isZ ^ menu.getVal('dispred')){ this.dispRedLine(x,y); return;}
			if(k.mode==1) this.inputdirec(x,y);
			else if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};
		mv.mouseup = function(x,y){
			if(this.notInputted() && !(kc.isZ ^ menu.getVal('dispred'))){
				if(k.mode==1) this.inputqnum(x,y,99);
				else if(k.mode==3) this.inputcell(x,y);
			}
		};
		mv.mousemove = function(x,y){
			if(kc.isZ ^ menu.getVal('dispred')){ this.dispRedLine(x,y); return;}
			if(k.mode==1) this.inputdirec(x,y);
			else if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};

		// ���������������Ȃ��̂ŏ㏑��
		bd.isnoLPup    = function(cc){ return (bd.QaC(cc)==1||bd.QnC(cc)!=-1);},
		bd.isnoLPdown  = function(cc){ return (bd.QaC(cc)==1||bd.QnC(cc)!=-1);},
		bd.isnoLPleft  = function(cc){ return (bd.QaC(cc)==1||bd.QnC(cc)!=-1);},
		bd.isnoLPright = function(cc){ return (bd.QaC(cc)==1||bd.QnC(cc)!=-1);},

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(ca=='z' && !this.keyPressed){ this.isZ=true; return;}
			if(k.mode==3){ return;}
			if(this.key_inputdirec(ca)){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca,99);
		};
		kc.keyup = function(ca){ if(ca=='z'){ this.isZ=false;}};
		kc.isZ = false;
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(127, 127, 127)";
		pc.errbcolor1 = "rgb(255, 160, 160)";
		pc.linecolor = "rgb(0, 127, 0)";
		pc.dotcolor = "rgb(255, 96, 191)";
		pc.BCell_fontcolor = "rgb(96,96,96)";

		pc.paint = function(x1,y1,x2,y2){
			x2++; y2++;
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawWhiteCells(x1,y1,x2,y2);
			this.drawBDline2(x1,y1,x2,y2);
			this.drawBlackCells(x1,y1,x2,y2);

			this.drawArrowNumbers(x1,y1,x2,y2);

			this.drawLines(x1,y1,x2,y2);
			this.drawPekes(x1,y1,x2,y2,1);

			this.drawChassis(x1,y1,x2,y2);

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==0 || type==1){ bstr = this.decodeArrowNumber16(bstr);}
			else if(type==2)      { bstr = this.decodeKanpen(bstr); }
		};

		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
			else if(type==2){ document.urloutput.ta.value = this.kanpenbase()+"yajilin.html?problem="+this.pzldataKanpen();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			return "/"+k.qcols+"/"+k.qrows+"/"+this.encodeArrowNumber16();
		};

		enc.decodeKanpen = function(bstr){
			bstr = (bstr.split("_")).join(" ");
			fio.decodeCell( function(c,ca){
				if(ca != "."){
					var num = parseInt(ca);
					if     (num<16){ bd.sDiC(c,1); bd.sQnC(c,num   );}
					else if(num<32){ bd.sDiC(c,3); bd.sQnC(c,num-16);}
					else if(num<48){ bd.sDiC(c,2); bd.sQnC(c,num-32);}
					else if(num<64){ bd.sDiC(c,4); bd.sQnC(c,num-48);}
				}
			},bstr.split("/"));
		};
		enc.pzldataKanpen = function(){
			return ""+k.qrows+"/"+k.qcols+"/"+fio.encodeCell( function(c){
				var num = (bd.QnC(c)>=0&&bd.QnC(c)<10?bd.QnC(c):-1)
				if     (num==-1)     { return "._";}
				else if(bd.DiC(c)==1){ return ""+( 0+num)+"_";}
				else if(bd.DiC(c)==3){ return ""+(16+num)+"_";}
				else if(bd.DiC(c)==2){ return ""+(32+num)+"_";}
				else if(bd.DiC(c)==4){ return ""+(48+num)+"_";}
				else                 { return "._";}
			});
		};

		//---------------------------------------------------------
		fio.kanpenOpen = function(array){
			this.decodeCell( function(c,ca){
				if     (ca=="#"){ bd.sQaC(c,1);}
				else if(ca=="+"){ bd.sQsC(c,1);}
				else if(ca != "."){
					var num = parseInt(ca);
					if     (num<16){ bd.sDiC(c,1); bd.sQnC(c,num   );}
					else if(num<32){ bd.sDiC(c,3); bd.sQnC(c,num-16);}
					else if(num<48){ bd.sDiC(c,2); bd.sQnC(c,num-32);}
					else if(num<64){ bd.sDiC(c,4); bd.sQnC(c,num-48);}
				}
			},array.slice(0,k.qrows));
			this.decodeBorderLine(array.slice(k.qrows,3*k.qrows-1));
		};
		fio.kanpenSave = function(){
			return ""+this.encodeCell( function(c){
				var num = (bd.QnC(c)>=0&&bd.QnC(c)<10?bd.QnC(c):-1)
				if     (num==-1)     { return ". ";}
				else if(bd.DiC(c)==1){ return ""+( 0+num)+" ";}
				else if(bd.DiC(c)==3){ return ""+(16+num)+" ";}
				else if(bd.DiC(c)==2){ return ""+(32+num)+" ";}
				else if(bd.DiC(c)==4){ return ""+(48+num)+" ";}
				else if(bd.QaC(c)==1){ return "# ";}
				else if(bd.QsC(c)==1){ return "+ ";}
				else                 { return ". ";}
			})
			+this.encodeBorderLine();
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

			if( !this.checkAllCell(function(c){ return (this.lcntCell(c)>0 && bd.QaC(c)==1);}.bind(this)) ){
				this.setAlert('���}�X�̏�ɐ���������Ă��܂��B','Theer is a line on the black cell.'); return false;
			}

			if( !this.checkSideCell(function(c1,c2){ return (bd.QaC(c1)==1 && bd.QaC(c2)==1);}) ){
				this.setAlert('���}�X���^�e���R�ɘA�����Ă��܂��B','Black cells are adjacent.'); return false;
			}

			if( !this.checkArrowNumber() ){
				this.setAlert('���̕����ɂ��鍕�}�X�̐�������������܂���B','The number of black cells are not correct.'); return false;
			}

			if( !this.checkLcntCell(1) ){
				this.setAlert('�r�؂�Ă����������܂��B','There is a dead-end line.'); return false;
			}

			if( !this.checkOneLoop() ){
				this.setAlert('�ւ�������ł͂���܂���B','There are plural loops.'); return false;
			}

			if( !this.checkAllCell(function(c){ return (this.lcntCell(c)==0 && bd.QaC(c)!=1 && bd.QnC(c)==-1);}.bind(this)) ){
				this.setAlert('���}�X������������Ă��Ȃ��}�X������܂��B','Theer is an empty cell.'); return false;
			}

			return true;
		};
		ans.check1st = function(){ return this.checkLcntCell(1);};

		ans.checkArrowNumber = function(){
			for(var c=0;c<bd.cell.length;c++){
				if(bd.QnC(c)<0 || bd.DiC(c)==0 || bd.QaC(c)==1){ continue;}
				var cx = bd.cell[c].cx, cy = bd.cell[c].cy, dir = bd.DiC(c);
				var cnt=0;
				if     (dir==1){ cy--; while(cy>=0     ){ if(bd.QaC(bd.cnum(cx,cy))==1){cnt++;} cy--;} }
				else if(dir==2){ cy++; while(cy<k.qrows){ if(bd.QaC(bd.cnum(cx,cy))==1){cnt++;} cy++;} }
				else if(dir==3){ cx--; while(cx>=0     ){ if(bd.QaC(bd.cnum(cx,cy))==1){cnt++;} cx--;} }
				else if(dir==4){ cx++; while(cx<k.qcols){ if(bd.QaC(bd.cnum(cx,cy))==1){cnt++;} cx++;} }

				if(bd.QnC(c)!=cnt){
					bd.sErC([c],1);
					cx = bd.cell[c].cx, cy = bd.cell[c].cy;
					if     (dir==1){ cy--; while(cy>=0     ){ bd.sErC([bd.cnum(cx,cy)],1); cy--;} }
					else if(dir==2){ cy++; while(cy<k.qrows){ bd.sErC([bd.cnum(cx,cy)],1); cy++;} }
					else if(dir==3){ cx--; while(cx>=0     ){ bd.sErC([bd.cnum(cx,cy)],1); cx--;} }
					else if(dir==4){ cx++; while(cx<k.qcols){ bd.sErC([bd.cnum(cx,cy)],1); cx++;} }
					return false;
				}
			}
			return true;
		};
	}
};
