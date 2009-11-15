//
// �p�Y���ŗL�X�N���v�g�� ���p�ٔ� lightup.js v3.2.3
//
Puzzles.lightup = function(){ };
Puzzles.lightup.prototype = {
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
		k.isLineCross     = 0;	// 1:������������p�Y��
		k.isCenterLine    = 0;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

		k.dispzero      = 1;	// 1:0��\�����邩�ǂ���
		k.isDispHatena  = 0;	// 1:qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber   = 0;	// 1:�񓚂ɐ�������͂���p�Y��
		k.isArrowNumber = 0;	// 1:������������͂���p�Y��
		k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
		k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
		k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

		k.BlackCell     = 0;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 1;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 1;	// 1:pencilbox/�J���y���ɂ���p�Y��

		k.fstruct = ["cellqnumans"];

		//k.def_csize = 36;
		//k.def_psize = 24;
		//k.area = { bcell:0, wcell:0, number:0};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		base.setTitle("���p��","Akari (Light Up)");
		base.setExpression("�@�}�E�X�Ō����Ɣ��}�X�m��}�X�����͂ł��܂��B",
						   " Click to input Akari (Light source) or determined white cells.");
		base.setFloatbgcolor("rgb(32, 32, 32)");
	},
	menufix : function(){
		menu.addUseToFlags();
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if(k.playmode) this.inputcell();
			else if(k.editmode){
				if(!kp.enabled()){ this.inputqnum();}
				else{ kp.display();}
			}
		};
		mv.mouseup = function(){ };
		mv.mousemove = function(){
			if(k.playmode && this.btn.Right) this.inputcell();
		};
		mv.paintAkari = function(id){
			if(k.br.IE && !uuCanvas.already()){ return;}
			var d = ans.cellRange(id);
			pc.paint(d.x1,bd.cell[id].cy,d.x2,bd.cell[id].cy);
			pc.paint(bd.cell[id].cx,d.y1,bd.cell[id].cx,d.y2);
		};
		mv.enableInputHatena = true;

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.playmode){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca);
		};

		if(k.EDITOR){
			kp.generate(2, true, false, '');
			kp.kpinput = function(ca){
				kc.key_inputqnum(ca);
			};
		}

		bd.maxnum = 4;
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_LIGHT;
		pc.fontcolor = pc.fontErrcolor = "white";
		pc.dotcolor = "rgb(255, 63, 191)";

		pc.lightcolor = "rgb(224, 255, 127)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawLightCells(x1,y1,x2,y2);

			this.drawGrid(x1,y1,x2,y2);

			this.drawBCells(x1,y1,x2,y2);

			this.drawAkari(x1,y1,x2,y2);
			this.drawDotCells(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawTarget(x1,y1,x2,y2);
		};

		pc.drawAkari = function(x1,y1,x2,y2){
			var rsize = k.cwidth*0.40;
			var ksize = k.cwidth*0.15;
			var lampcolor = "rgb(0, 127, 96)";
			var header = "c_AK_";

			var clist = this.cellinside(x1,y1,x2,y2);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.cell[c].qans===1){
					g.fillStyle = (bd.cell[c].error!==4 ? lampcolor : this.errcolor1);
					if(this.vnop(header+c,1)){
						g.beginPath();
						g.arc(bd.cell[c].px+mf(k.cwidth/2), bd.cell[c].py+mf(k.cheight/2), rsize, 0, Math.PI*2, false);
						g.fill();
					}
				}
				else{ this.vhide(header+c);}
			}
			this.vinc();
		};

		pc.drawLightCells = function(x1,y1,x2,y2){
			var header = "c_full_";

			var clist = this.cellinside_cond(x1,y1,x2,y2,function(c){ return (bd.cell[c].qnum===-1);});
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.cell[c].error===1 || ans.isShined(c)){
					g.fillStyle = (bd.cell[c].error===4 ? this.errbcolor1 : this.lightcolor);
					if(this.vnop(header+c,1)){
						g.fillRect(bd.cell[c].px, bd.cell[c].py, k.cwidth, k.cheight);
					}
				}
				else{ this.vhide(header+c);}
			}
			this.vinc();
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==0||type==1){ bstr = this.decode4Cell(bstr);}
			else if(type==2)    { bstr = this.decodeKanpen(bstr); }
		};
		enc.pzlexport= function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
			else if(type==2){ document.urloutput.ta.value = this.kanpenbase()+"bijutsukan.html?problem="+this.pzldataKanpen();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			return "/"+k.qcols+"/"+k.qrows+"/"+this.encode4Cell();
		};

		enc.decodeKanpen = function(bstr){
			bstr = (bstr.split("_")).join(" ");
			fio.decodeCell( function(c,ca){
				if(ca == "5")     { bd.sQnC(c, -2);}
				else if(ca != "."){ bd.sQnC(c, parseInt(ca));}
			},bstr.split("/"));
			return "";
		};
		enc.pzldataKanpen = function(){
			return ""+k.qrows+"/"+k.qcols+"/"+fio.encodeCell( function(c){
				if     (bd.QnC(c)>=0) { return (bd.QnC(c).toString() + "_");}
				else if(bd.QnC(c)==-2){ return "5_";}
				else                  { return "._";}
			});
		};

		//---------------------------------------------------------
		fio.kanpenOpen = function(array){
			this.decodeCell( function(c,ca){
				if(ca == "5")     { bd.sQnC(c, -2);}
				else if(ca == "+"){ bd.sQaC(c, 1);}
				else if(ca == "*"){ bd.sQsC(c, 1);}
				else if(ca != "."){ bd.sQnC(c, parseInt(ca));}
			},array.slice(0,k.qrows));
		};
		fio.kanpenSave = function(){
			return ""+this.encodeCell( function(c){
				if     (bd.QnC(c)>=0) { return (bd.QnC(c).toString() + " ");}
				else if(bd.QaC(c)==1) { return "+ ";}
				else if(bd.QsC(c)==1) { return "* ";}
				else if(bd.QnC(c)==-2){ return "5 ";}
				else                  { return ". ";}
			});
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkQnumCell(function(cn,bcnt){ return (cn<bcnt);}) ){
				this.setAlert('�����̂܂��ɂ���Ɩ��̐����Ԉ���Ă��܂��B','The number of Akari around the number is big.'); return false;
			}

			if( !this.checkRowsCols() ){
				this.setAlert('�Ɩ��ɕʂ̏Ɩ��̌����������Ă��܂��B','Akari is shined from another Akari.'); return false;
			}

			if( !this.checkQnumCell(function(cn,bcnt){ return (cn>bcnt);}) ){
				this.setAlert('�����̂܂��ɂ���Ɩ��̐����Ԉ���Ă��܂��B','The number of Akari around the number is small.'); return false;
			}

			if( !this.checkShinedCell() ){
				this.setAlert('�Ɩ��ɏƂ炳��Ă��Ȃ��Z��������܂��B','A cell is not shined.'); return false;
			}

			return true;
		};

		ans.checkQnumCell = function(func){	//func(crn,bcnt){} -> �G���[�Ȃ�false��Ԃ��֐��ɂ���
			for(var c=0;c<bd.cellmax;c++){
				if(bd.QnC(c)>=0 && func( bd.QnC(c), this.checkdir4Cell(c,function(a){ return (bd.QaC(a)==1);}))){
					bd.sErC([c],1);
					return false;
				}
			}
			return true;
		};

		ans.checkShinedCell = function(){
			for(var c=0;c<bd.cellmax;c++){
				if(bd.QnC(c)==-1 && !this.isShined(c)){
					bd.sErC([c],1);
					return false;
				}
			}
			return true;
		};

		ans.isShined = function(cc){
			if(bd.QnC(cc)!=-1){ return false;}

			var d = this.cellRange(cc);
			for(var tx=d.x1;tx<=d.x2;tx++){ if(bd.QaC(bd.cnum(tx,bd.cell[cc].cy))==1){ return true;} }
			for(var ty=d.y1;ty<=d.y2;ty++){ if(bd.QaC(bd.cnum(bd.cell[cc].cx,ty))==1){ return true;} }

			return false;
		};
		ans.cellRange = function(cc){
			var d = {x1:0,y1:0,x2:k.qcols-1,y2:k.qrows-1};

			var tx, ty;
			tx = bd.cell[cc].cx-1; ty = bd.cell[cc].cy;
			while(tx>=0)     { if(bd.QnC(bd.cnum(tx,ty))!=-1){ d.x1=tx+1; break;} tx--; }
			tx = bd.cell[cc].cx+1; ty = bd.cell[cc].cy;
			while(tx<k.qcols){ if(bd.QnC(bd.cnum(tx,ty))!=-1){ d.x2=tx-1; break;} tx++; }
			tx = bd.cell[cc].cx; ty = bd.cell[cc].cy-1;
			while(ty>=0)     { if(bd.QnC(bd.cnum(tx,ty))!=-1){ d.y1=ty+1; break;} ty--; }
			tx = bd.cell[cc].cx; ty = bd.cell[cc].cy+1;
			while(ty<k.qrows){ if(bd.QnC(bd.cnum(tx,ty))!=-1){ d.y2=ty-1; break;} ty++; }

			return d;
		};

		ans.checkRowsCols = function(){
			var fx, fy;
			for(var cy=0;cy<k.qrows;cy++){
				var cnt=0;
				for(var cx=0;cx<k.qcols;cx++){
					if     ( bd.QnC(bd.cnum(cx,cy))!=-1){ cnt=0;}
					else if( bd.QaC(bd.cnum(cx,cy))==1 ){ cnt++; if(cnt==1){ fx=cx;} }

					if( cnt>=2 ){
						for(var cx=fx;cx<k.qcols;cx++){
							var cc = bd.cnum(cx,cy);
							if( bd.QnC(cc)!=-1 ){ break;}
							else if( bd.QaC(cc)==1 ){ bd.sErC([cc],4);}
						}
						return false;
					}
				}
			}
			for(var cx=0;cx<k.qcols;cx++){
				var cnt=0;
				for(var cy=0;cy<k.qrows;cy++){
					if     ( bd.QnC(bd.cnum(cx,cy))!=-1){ cnt=0;}
					else if( bd.QaC(bd.cnum(cx,cy))==1 ){ cnt++; if(cnt==1){ fy=cy;} }

					if( cnt>=2 ){
						for(var cy=fy;cy<k.qrows;cy++){
							var cc = bd.cnum(cx,cy);
							if( bd.QnC(cc)!=-1 ){ break;}
							else if( bd.QaC(cc)==1 ){ bd.sErC([cc],4);}
						}
						return false;
					}
				}
			}

			return true;
		};
	}
};
