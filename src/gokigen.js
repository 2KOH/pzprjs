//
// �p�Y���ŗL�X�N���v�g�� ��������ȂȂߔ� gokigen.js v3.3.0
//
Puzzles.gokigen = function(){ };
Puzzles.gokigen.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 7;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 7;}	// �Ֆʂ̏c��
		k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 1;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 0;		// 1:Border/Line������\�ȃp�Y��
		k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isoutsidecross  = 1;	// 1:�O�g���Cross�̔z�u������p�Y��
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
		k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 0;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

		k.bdmargin = 0.70;				// �g�O�̈�ӂ�margin(�Z�������Z)
		k.reduceImageMargin = false;	// �摜�o�͎���margin������������

		base.setTitle("��������ȂȂ�","Gokigen-naname");
		base.setExpression("�@�}�E�X�Ŏΐ�����͂ł��܂��B",
						   " Click to input slashes.");
		base.setFloatbgcolor("rgb(0, 127, 0)");
		base.proto = 1;
	},
	menufix : function(){
		menu.addUseToFlags();
		menu.addRedLineToFlags();
	},
	finalfix : function(){
		ee('btnclear2').el.style.display = 'none';
	},
	protoChange : function(){
	},
	protoOriginal : function(){
		ee('btnclear2').el.style.display = 'inline';
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if(k.playmode){
				if(!(kc.isZ ^ pp.getVal('dispred'))){ this.inputslash();}
				else{ this.dispBlue();}
			}
			else if(k.editmode){
				if(!kp.enabled()){ this.inputcross();}
				else{ kp.display();}
			}
		};
		mv.mouseup = function(){ };
		mv.mousemove = function(){ };
		mv.dispBlue = function(){
			var cc = this.cellid();
			if(cc==-1 || bd.QaC(cc)==-1){ return;}

			var check = [];
			for(var i=0;i<bd.crossmax;i++){ check[i]=0;}

			var fc = bd.xnum(bd.cell[cc].bx+(bd.QaC(cc)==1?-1:1),bd.cell[cc].by-1);
			ans.searchline(check, 0, fc);
			for(var c=0;c<bd.cellmax;c++){
				if(bd.QaC(c)==1 && check[bd.xnum(bd.cell[c].bx-1,bd.cell[c].by-1)]==1){ bd.sErC([c],2);}
				if(bd.QaC(c)==2 && check[bd.xnum(bd.cell[c].bx+1,bd.cell[c].by-1)]==1){ bd.sErC([c],2);}
			}

			ans.errDisp = true;
			pc.paintAll();
		};
		mv.inputslash = function(){
			var cc = this.cellid();
			if(cc==-1){ return;}

			if     (k.use==1){ bd.sQaC(cc, (bd.QaC(cc)!=(this.btn.Left?1:2)?(this.btn.Left?1:2):-1));}
			else if(k.use==2){
				if(bd.QaC(cc)==-1){ bd.sQaC(cc, (this.btn.Left?1:2));}
				else{ bd.sQaC(cc, (this.btn.Left?{1:2,2:-1}:{1:-1,2:1})[bd.QaC(cc)]);}
			}

			pc.paintCellAround(cc);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(ca=='z' && !this.keyPressed){ this.isZ=true; return;}
			if(k.playmode){ return;}
			if(this.moveTCross(ca)){ return;}
			this.key_inputcross(ca);
		};
		kc.keyup = function(ca){ if(ca=='z'){ this.isZ=false;} };

		kc.isZ = false;

		if(k.EDITOR){
			kp.generate(4, true, false, '');
			kp.ctl[1].target = k.CROSS;
			kp.kpinput = function(ca){
				kc.key_inputcross(ca);
			};
		}

		tc.setCrossType();

		bd.maxnum = 4;

		menu.ex.adjustSpecial = function(type,key){
			um.disableRecord();
			if(type>=1 && type<=4){ // ���]�E��]�S��
				for(var c=0;c<bd.cellmax;c++){ if(bd.QaC(c)!=-1){ bd.sQaC(c,{1:2,2:1}[bd.QaC(c)]); } }
			}
			um.enableRecord();
		};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_DLIGHT;

		pc.crosssize = 0.33;
		pc.chassisflag = false;

		pc.paint = function(x1,y1,x2,y2){
			this.drawBGCells(x1,y1,x2,y2);
			this.drawDashedGrid(x1,y1,x2,y2);

			this.drawSlashes(x1,y1,x2,y2);

			this.drawCrosses(x1,y1,x2+1,y2+1);
			this.drawTarget(x1,y1,x2,y2);
		};

		// �I�[�o�[���C�h
		pc.setBGCellColor = function(c){
			if(bd.cell[c].qans===-1 && bd.cell[c].error===1){
				g.fillStyle = this.errbcolor1;
				return true;
			}
			return false;
		};

		pc.drawSlashes = function(x1,y1,x2,y2){
			this.vinc('cell_slash', 'auto');

			var headers = ["c_sl1_", "c_sl2_"];
			g.lineWidth = Math.max(this.cw/8, 2);

			var clist = this.cellinside(x1,y1,x2,y2);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];

				if(bd.cell[c].qans!=-1){
					if     (bd.cell[c].error==1){ g.strokeStyle = this.errcolor1;}
					else if(bd.cell[c].error==2){ g.strokeStyle = this.errcolor2;}
					else                        { g.strokeStyle = this.Cellcolor;}

					if(bd.cell[c].qans==1){
						if(this.vnop(headers[0]+c,this.STROKE)){
							g.setOffsetLinePath(bd.cell[c].px,bd.cell[c].py, 0,0, this.cw,this.ch, true);
							g.stroke();
						}
					}
					else{ this.vhide(headers[0]+c);}

					if(bd.cell[c].qans==2){
						if(this.vnop(headers[1]+c,this.STROKE)){
							g.setOffsetLinePath(bd.cell[c].px,bd.cell[c].py, this.cw,0, 0,this.ch, true);
							g.stroke();
						}
					}
					else{ this.vhide(headers[1]+c);}
				}
				else{ this.vhide([headers[0]+c, headers[1]+c]);}
			}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type){
			var oldflag = ((type==1 && !this.checkpflag("c")) || (type==0 && this.checkpflag("d")));
			if(!oldflag){ this.decode4Cross();}
			else        { this.decodecross_old();}
		};
		enc.pzlexport = function(type){
			if(type==1){ this.outpflag = 'c';}
			this.encode4Cross();
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			this.decodeCrossNum();
			this.decodeCellQanssub();
		};
		fio.encodeData = function(){
			this.encodeCrossNum();
			this.encodeCellQanssub();
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkLoopLine() ){
				this.setAlert('�ΐ��ŗւ������ł��Ă��܂��B', 'There is a loop consisted in some slashes.'); return false;
			}

			if( !this.checkQnumCross() ){
				this.setAlert('�����Ɍq������̐����Ԉ���Ă��܂��B', 'A number is not equal to count of lines that is connected to it.'); return false;
			}

			if( !this.checkAllCell(function(c){ return (bd.QaC(c)==-1);}) ){
				this.setAlert('�ΐ����Ȃ��}�X������܂��B','There is a empty cell.'); return false;
			}

			return true;
		};

		ans.scntCross = function(id){
			if(id==-1){ return -1;}
			var bx=bd.cross[id].bx, by=bd.cross[id].by;
			var cc, cnt=0;
			cc=bd.cnum(bx-1,by-1); if(cc!=-1 && bd.QaC(cc)==1){ cnt++;}
			cc=bd.cnum(bx+1,by-1); if(cc!=-1 && bd.QaC(cc)==2){ cnt++;}
			cc=bd.cnum(bx-1,by+1); if(cc!=-1 && bd.QaC(cc)==2){ cnt++;}
			cc=bd.cnum(bx+1,by+1); if(cc!=-1 && bd.QaC(cc)==1){ cnt++;}
			return cnt;
		};
		ans.scntCross2 = function(id){
			if(id==-1){ return -1;}
			var bx=bd.cross[id].bx, by=bd.cross[id].by;
			var cc, cnt=0;
			cc=bd.cnum(bx-1,by-1); if(cc!=-1 && bd.ErC(cc)==1 && bd.QaC(cc)==1){ cnt++;}
			cc=bd.cnum(bx+1,by-1); if(cc!=-1 && bd.ErC(cc)==1 && bd.QaC(cc)==2){ cnt++;}
			cc=bd.cnum(bx-1,by+1); if(cc!=-1 && bd.ErC(cc)==1 && bd.QaC(cc)==2){ cnt++;}
			cc=bd.cnum(bx+1,by+1); if(cc!=-1 && bd.ErC(cc)==1 && bd.QaC(cc)==1){ cnt++;}
			return cnt;
		};

		ans.checkLoopLine = function(){
			var check = [], result = true;
			for(var i=0;i<bd.crossmax;i++){ check[i]=0;}

			while(1){
				var fc=-1;
				for(var i=0;i<bd.crossmax;i++){ if(check[i]==0){ fc=i; break;}}
				if(fc==-1){ break;}

				if(!this.searchline(check, 0, fc)){
					for(var c=0;c<bd.cellmax;c++){
						if(bd.QaC(c)==1 && check[bd.xnum(bd.cell[c].bx-1,bd.cell[c].by-1)]==1){ bd.sErC([c],1);}
						if(bd.QaC(c)==2 && check[bd.xnum(bd.cell[c].bx+1,bd.cell[c].by-1)]==1){ bd.sErC([c],1);}
					}
					while(1){
						var endflag = true;
						var clist = pc.cellinside_cond(bd.minbx,bd.minby,bd.maxbx,bd.maxby,function(c){ return (bd.ErC(c)==1);});
						for(var i=0;i<clist.length;i++){
							var c = clist[i];
							var cc1, cc2, bx=bd.cell[c].bx, by=bd.cell[c].by;
							if     (bd.QaC(c)==1){ cc1=bd.xnum(bx-1,by-1); cc2=bd.xnum(bx+1,by+1);}
							else if(bd.QaC(c)==2){ cc1=bd.xnum(bx-1,by+1); cc2=bd.xnum(bx+1,by-1);}
							if(this.scntCross2(cc1)==1 || this.scntCross2(cc2)==1){ bd.sErC([c],0); endflag = false; break;}
						}
						if(endflag){ break;}
					}
					if(this.inAutoCheck){ return false;}
					result = false;
				}
				for(var c=0;c<bd.crossmax;c++){ if(check[c]==1){ check[c]=2;} }
			}
			return result;
		};
		ans.searchline = function(check, dir, c){
			var flag=true;
			var nc, tx=bd.cross[c].bx, ty=bd.cross[c].by;
			check[c]=1;

			nc = bd.xnum(tx-2,ty-2);
			if(nc!=-1 && dir!=4 && bd.QaC(bd.cnum(tx-1,ty-1))==1 && (check[nc]!=0 || !this.searchline(check,1,nc))){ flag = false;}
			nc = bd.xnum(tx-2,ty+2);
			if(nc!=-1 && dir!=3 && bd.QaC(bd.cnum(tx-1,ty+1))==2 && (check[nc]!=0 || !this.searchline(check,2,nc))){ flag = false;}
			nc = bd.xnum(tx+2,ty-2);
			if(nc!=-1 && dir!=2 && bd.QaC(bd.cnum(tx+1,ty-1))==2 && (check[nc]!=0 || !this.searchline(check,3,nc))){ flag = false;}
			nc = bd.xnum(tx+2,ty+2);
			if(nc!=-1 && dir!=1 && bd.QaC(bd.cnum(tx+1,ty+1))==1 && (check[nc]!=0 || !this.searchline(check,4,nc))){ flag = false;}

			return flag;
		};

		ans.checkQnumCross = function(){
			var result = true;
			for(var c=0;c<bd.crossmax;c++){
				if(bd.QnX(c)>=0 && bd.QnX(c)!=this.scntCross(c)){
					if(this.inAutoCheck){ return false;}
					bd.sErX([c],1);
					result = false;
				}
			}
			return result;
		};
	}
};
