//
// �p�Y���ŗL�X�N���v�g�� ���p�ٔ� lightup.js v3.2.4
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

		//k.def_csize = 36;
		//k.def_psize = 24;
		//k.area = { bcell:0, wcell:0, number:0};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		base.setTitle("���p��","Akari (Light Up)");
		base.setExpression("�@�}�E�X�Ō����Ɣ��}�X�m��}�X�����͂ł��܂��B",
						   " Click to input Akari (Light source) or determined white cells.");
		base.setFloatbgcolor("rgb(32, 32, 32)");
		base.proto = 1;
	},
	menufix : function(){
		menu.addUseToFlags();
	},

	protoChange : function(){
		this.protofunc = { resetinfo : base.resetInfo};

		base.resetInfo = function(iserase){
			if(iserase){ um.allerase();}
			tc.Adjust();
			bd.initQlight();
		};
	},
	protoOriginal : function(){
		base.resetInfo = this.protofunc.resetinfo;
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
		bd.qlight = [];
		bd.initQlight = function(){
			bd.qlight = [];
			for(var c=0;c<bd.cellmax;c++){ bd.qlight[c] = false;}
			for(var c=0;c<bd.cellmax;c++){
				if(bd.cell[c].qans!==1){ continue;}

				var cx = bd.cell[c].cx, cy = bd.cell[c].cy;
				var d = this.cellRange(c);
				for(var tx=d.x1;tx<=d.x2;tx++){ bd.qlight[tx+cy*k.qcols]=true;}
				for(var ty=d.y1;ty<=d.y2;ty++){ bd.qlight[cx+ty*k.qcols]=true;}
			}
		};

		// �I�[�o�[���C�g
		bd.sQnC = function(id, num) {
			var old = this.cell[id].qnum;
			um.addOpe(k.CELL, k.QNUM, id, old, num);
			this.cell[id].qnum = num;

			if((old===-1)^(num===-1)){ this.setAkari(id, (num!==-1?0:2));}
		};
		// �I�[�o�[���C�g
		bd.sQaC = function(id, num) {
			var old = this.cell[id].qans;
			um.addOpe(k.CELL, k.QANS, id, old, num);
			this.cell[id].qans = num;

			if((old===-1)^(num===-1)){ this.setAkari(id, (num!==-1?1:0));}
		};
		bd.setAkari = function(id, val){
			var d = this.cellRange(id), cx = bd.cell[id].cx, cy = bd.cell[id].cy;
			if(val===1){
				for(var tx=d.x1;tx<=d.x2;tx++){ bd.qlight[tx+cy*k.qcols]=true;}
				for(var ty=d.y1;ty<=d.y2;ty++){ bd.qlight[cx+ty*k.qcols]=true;}
			}
			else{
				var clist = [];
				for(var tx=d.x1;tx<=d.x2;tx++){ clist.push(tx+cy*k.qcols);}
				for(var ty=d.y1;ty<=d.y2;ty++){ clist.push(cx+ty*k.qcols);}

				for(var i=0;i<clist.length;i++){
					var cc = clist[i];
					if(bd.qlight[cc]?val===2:val===0){ continue;}

					var ccx = bd.cell[cc].cx, ccy = bd.cell[cc].cy;
					var dd = this.cellRange(cc), isakari = false;
								  for(var tx=dd.x1;tx<=dd.x2;tx++){ if(bd.cell[tx+ccy*k.qcols].qans===1){ isakari=true; break;} }
					if(!isakari){ for(var ty=dd.y1;ty<=dd.y2;ty++){ if(bd.cell[ccx+ty*k.qcols].qans===1){ isakari=true; break;} } }
					bd.qlight[cc] = isakari;
				}
			}

			if(pc.already()){
				pc.paint(d.x1,cy,d.x2,cy);
				pc.paint(cx,d.y1,cx,d.y2);
			}
		};

		bd.cellRange = function(cc){
			var cx = tx = bd.cell[cc].cx, cy = ty = bd.cell[cc].cy;
			var d = {x1:0, y1:0, x2:k.qcols-1, y2:k.qrows-1};

			tx=cx-1; ty=cy; while(tx>=0)     { if(bd.cell[tx+ty*k.qcols].qnum!==-1){ d.x1=tx+1; break;} tx--; }
			tx=cx+1; ty=cy; while(tx<k.qcols){ if(bd.cell[tx+ty*k.qcols].qnum!==-1){ d.x2=tx-1; break;} tx++; }
			tx=cx; ty=cy-1; while(ty>=0)     { if(bd.cell[tx+ty*k.qcols].qnum!==-1){ d.y1=ty+1; break;} ty--; }
			tx=cx; ty=cy+1; while(ty<k.qrows){ if(bd.cell[tx+ty*k.qcols].qnum!==-1){ d.y2=ty-1; break;} ty++; }

			return d;
		};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_LIGHT;
		pc.fontcolor = pc.fontErrcolor = "white";
		pc.dotcolor = "rgb(255, 63, 191)";
		pc.setCellColorFunc('qnum');

		pc.lightcolor = "rgb(224, 255, 127)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawBGCells(x1,y1,x2,y2);
			this.drawGrid(x1,y1,x2,y2);
			this.drawBlackCells(x1,y1,x2,y2);
			this.drawNumbers(x1,y1,x2,y2);

			this.drawAkari(x1,y1,x2,y2);
			this.drawDotCells(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawTarget(x1,y1,x2,y2);
		};

		// �I�[�o�[���C�h drawBGCells�p
		pc.setBGCellColor = function(cc){
			if     (bd.cell[cc].qnum!==-1){ return false;}
			else if(bd.cell[cc].error===1){ g.fillStyle = this.errbcolor1; return true;}
			else if(bd.qlight[cc])        { g.fillStyle = this.lightcolor; return true;}
			return false;
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
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type){
			this.decode4Cell();
		};
		enc.pzlexport= function(type){
			this.encode4Cell();
		};

		enc.decodeKanpen = function(){
			fio.decodeCell( function(c,ca){
				if     (ca == "5"){ bd.sQnC(c, -2);}
				else if(ca != "."){ bd.sQnC(c, parseInt(ca));}
			});
		};
		enc.encodeKanpen = function(){
			fio.encodeCell( function(c){
				if     (bd.QnC(c)>=0) { return (bd.QnC(c).toString() + " ");}
				else if(bd.QnC(c)==-2){ return "5 ";}
				else                  { return ". ";}
			});
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			this.decodeCellQnumAns();
		};
		fio.encodeData = function(){
			return this.encodeCellQnumAns();
		};

		fio.kanpenOpen = function(){
			this.decodeCell( function(c,ca){
				if     (ca == "5"){ bd.sQnC(c, -2);}
				else if(ca == "+"){ bd.sQaC(c, 1);}
				else if(ca == "*"){ bd.sQsC(c, 1);}
				else if(ca != "."){ bd.sQnC(c, parseInt(ca));}
			});
		};
		fio.kanpenSave = function(){
			this.encodeCell( function(c){
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

			if( !this.checkRowsCols() ){
				this.setAlert('�Ɩ��ɕʂ̏Ɩ��̌����������Ă��܂��B','Akari is shined from another Akari.'); return false;
			}

			if( !this.checkAllCell(function(c){ return (bd.QnC(c)>=0 && bd.QnC(c)!==ans.checkdir4Cell(c,function(a){ return (bd.QaC(a)==1);})); }) ){
				this.setAlert('�����̂܂��ɂ���Ɩ��̐����Ԉ���Ă��܂��B','The number is not equal to the number of Akari around it.'); return false;
			}

			if( !this.checkAllCell(function(c){ return (bd.QnC(c)===-1 && !bd.qlight[c]);}) ){
				this.setAlert('�Ɩ��ɏƂ炳��Ă��Ȃ��Z��������܂��B','A cell is not shined.'); return false;
			}

			return true;
		};

		ans.checkRowsCols = function(){
			var fx, fy, result = true;
			for(var cy=0;cy<k.qrows;cy++){
				var cnt=0;
				for(var cx=0;cx<k.qcols;cx++){
					if     ( bd.QnC(bd.cnum(cx,cy))!=-1){ cnt=0;}
					else if( bd.QaC(bd.cnum(cx,cy))==1 ){ cnt++; if(cnt==1){ fx=cx;} }

					if( cnt>=2 ){
						if(this.inAutoCheck){ return false;}
						for(var cx=fx;cx<k.qcols;cx++){
							var cc = bd.cnum(cx,cy);
							if( bd.QnC(cc)!=-1 ){ break;}
							else if( bd.QaC(cc)==1 ){ bd.sErC([cc],4);}
						}
						result = false;
					}
				}
			}
			for(var cx=0;cx<k.qcols;cx++){
				var cnt=0;
				for(var cy=0;cy<k.qrows;cy++){
					if     ( bd.QnC(bd.cnum(cx,cy))!=-1){ cnt=0;}
					else if( bd.QaC(bd.cnum(cx,cy))==1 ){ cnt++; if(cnt==1){ fy=cy;} }

					if( cnt>=2 ){
						if(this.inAutoCheck){ return false;}
						for(var cy=fy;cy<k.qrows;cy++){
							var cc = bd.cnum(cx,cy);
							if( bd.QnC(cc)!=-1 ){ break;}
							else if( bd.QaC(cc)==1 ){ bd.sErC([cc],4);}
						}
						result = false;
					}
				}
			}

			return result;
		};
	}
};
