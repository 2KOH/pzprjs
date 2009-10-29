//
// �p�Y���ŗL�X�N���v�g�� ��������ȂȂߔ� gokigen.js v3.2.2
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

		k.fstruct = ["crossnum","cellqanssub"];

		//k.def_csize = 36;
		//k.def_psize = 24;
		//k.area = { bcell:0, wcell:0, number:0};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		base.setTitle("��������ȂȂ�","Gokigen-naname");
		base.setExpression("�@�}�E�X�Ŏΐ�����͂ł��܂��B",
						   " Click to input slashes.");
		base.setFloatbgcolor("rgb(0, 127, 0)");
		base.proto = 1;
	},
	menufix : function(){
		menu.addUseToFlags();

		pp.addCheckToFlags('dispred','setting',false);
		pp.setMenuStr('dispred', '�q����`�F�b�N', 'Continuous Check');
		pp.setLabel  ('dispred', '���̂Ȃ�����`�F�b�N����', 'Check countinuous slashes');
	},
	protoChange : function(){
	},
	protoOriginal : function(){
		$("#btnclear2").css("display",'inline');
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(k.mode==3){
				if(!(kc.isZ ^ menu.getVal('dispred'))){ this.inputslash(x,y);}
				else{ this.dispBlue(x,y);}
			}
			else if(k.mode==1){
				if(!kp.enabled()){ this.inputcross(x,y);}
				else{ kp.display(x,y);}
			}
		};
		mv.mouseup = function(x,y){ };
		mv.mousemove = function(x,y){ };
		mv.dispBlue = function(x,y){
			var cc = this.cellid(new Pos(x,y));
			if(cc==-1 || bd.QaC(cc)==-1){ return;}

			var check = [];
			for(var i=0;i<bd.cross.length;i++){ check[i]=0;}

			var fc = bd.xnum(bd.cell[cc].cx+(bd.QaC(cc)==1?0:1),bd.cell[cc].cy);
			ans.searchline(check, 0, fc);
			for(var c=0;c<bd.cell.length;c++){
				if(bd.QaC(c)==1 && check[bd.xnum(bd.cell[c].cx  ,bd.cell[c].cy)]==1){ bd.sErC([c],2);}
				if(bd.QaC(c)==2 && check[bd.xnum(bd.cell[c].cx+1,bd.cell[c].cy)]==1){ bd.sErC([c],2);}
			}

			ans.errDisp = true;
			pc.paintAll();
		};
		mv.inputslash = function(x,y){
			var cc = this.cellid(new Pos(x,y));
			if(cc==-1){ return;}

			if     (k.use==1){ bd.sQaC(cc, (bd.QaC(cc)!=(this.btn.Left?1:2)?(this.btn.Left?1:2):-1));}
			else if(k.use==2){
				if(bd.QaC(cc)==-1){ bd.sQaC(cc, (this.btn.Left?1:2));}
				else{ bd.sQaC(cc, (this.btn.Left?{1:2,2:-1}:{1:-1,2:1})[bd.QaC(cc)]);}
			}

			pc.paint(bd.cell[cc].cx-1, bd.cell[cc].cy-1, bd.cell[cc].cx+1, bd.cell[cc].cy+1);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(ca=='z' && !this.keyPressed){ this.isZ=true; return;}
			if(k.mode==3){ return;}
			if(this.moveTCross(ca)){ return;}
			this.key_inputcross(ca,4);
		};
		kc.keyup = function(ca){ if(ca=='z'){ this.isZ=false;} };

		kc.isZ = false;

		if(k.callmode == "pmake"){
			kp.generate(4, true, false, '');
			kp.ctl[1].target = "cross";
			kp.kpinput = function(ca){
				kc.key_inputcross(ca,4);
			};
		}

		menu.ex.adjustSpecial = function(type,key){
			um.disableRecord();
			if(type>=1 && type<=4){ // ���]�E��]�S��
				for(var c=0;c<bd.cell.length;c++){ if(bd.QaC(c)!=-1){ bd.sQaC(c,{1:2,2:1}[bd.QaC(c)]); } }
			}
			um.enableRecord();
		};

		$("#btnclear2").css("display",'none');

		tc.minx = 0;
		tc.miny = 0;
		tc.maxx = 2*k.qcols;
		tc.maxy = 2*k.qrows;
		tc.setTXC(0);
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_DLIGHT;

		pc.crosssize = 0.33;
		pc.chassisflag = false;

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawErrorCells(x1,y1,x2,y2);

			this.drawDashedGrid(x1,y1,x2,y2);

			this.drawSlashes(x1,y1,x2,y2);

			this.drawCrosses(x1,y1,x2+1,y2+1);
			if(k.mode==1){ this.drawTCross(x1,y1,x2+1,y2+1);}else{ this.hideTCross();}
		};
		pc.drawErrorCells = function(x1,y1,x2,y2){
			var clist = this.cellinside(x1,y1,x2,y2,f_true);
			for(var i=0;i<clist.length;i++){
				var c=clist[i];
				if(bd.QaC(c)==-1 && bd.ErC(c)==1){
					g.fillStyle = this.errbcolor1;
					if(this.vnop("c"+c+"_full_",1)){ g.fillRect(bd.cell[c].px, bd.cell[c].py, k.cwidth, k.cheight);}
				}
				else{ this.vhide("c"+c+"_full_");}
			}
			this.vinc();
		},
		pc.drawSlashes = function(x1,y1,x2,y2){
			var clist = this.cellinside(x1,y1,x2,y2,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];

				if(bd.QaC(c)!=-1){
					if     (bd.ErC(c)==1){ g.strokeStyle = this.errcolor1;}
					else if(bd.ErC(c)==2){ g.strokeStyle = this.errcolor2;}
					else                 { g.strokeStyle = this.Cellcolor;}

					g.lineWidth = (mf(k.cwidth/8)>=2?mf(k.cwidth/8):2);
					g.beginPath();
					if(bd.QaC(c)==1){
						g.moveTo(bd.cell[c].px         , bd.cell[c].py          );
						g.lineTo(bd.cell[c].px+k.cwidth, bd.cell[c].py+k.cheight);
						this.vhide("c"+c+"_sl2_");
					}
					else if(bd.QaC(c)==2){
						g.moveTo(bd.cell[c].px+k.cwidth, bd.cell[c].py          );
						g.lineTo(bd.cell[c].px         , bd.cell[c].py+k.cheight);
						this.vhide("c"+c+"_sl1_");
					}
					g.closePath();
					if(this.vnop("c"+c+"_sl"+bd.QaC(c)+"_",0)){ g.stroke();}
				}
				else{ this.vhide(["c"+c+"_sl1_", "c"+c+"_sl2_"]);}
			}
			this.vinc();
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if((type==1 && this.checkpflag("c")) || (type==0 && !this.checkpflag("d"))){
				bstr = this.decode4(bstr, bd.sQnX.bind(bd), (k.qcols+1)*(k.qrows+1));
			}
			else{ bstr = this.decodecross_old(bstr);}
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			return "/"+k.qcols+"/"+k.qrows+"/"+this.encode4(bd.QnX.bind(bd), (k.qcols+1)*(k.qrows+1));
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
			var xx=bd.cross[id].cx, xy=bd.cross[id].cy;
			var cc, cnt=0;
			cc=bd.cnum(xx-1,xy-1); if(cc!=-1 && bd.QaC(cc)==1){ cnt++;}
			cc=bd.cnum(xx  ,xy-1); if(cc!=-1 && bd.QaC(cc)==2){ cnt++;}
			cc=bd.cnum(xx-1,xy  ); if(cc!=-1 && bd.QaC(cc)==2){ cnt++;}
			cc=bd.cnum(xx  ,xy  ); if(cc!=-1 && bd.QaC(cc)==1){ cnt++;}
			return cnt;
		};
		ans.scntCross2 = function(id){
			if(id==-1){ return -1;}
			var xx=bd.cross[id].cx, xy=bd.cross[id].cy;
			var cc, cnt=0;
			cc=bd.cnum(xx-1,xy-1); if(cc!=-1 && bd.ErC(cc)==1 && bd.QaC(cc)==1){ cnt++;}
			cc=bd.cnum(xx  ,xy-1); if(cc!=-1 && bd.ErC(cc)==1 && bd.QaC(cc)==2){ cnt++;}
			cc=bd.cnum(xx-1,xy  ); if(cc!=-1 && bd.ErC(cc)==1 && bd.QaC(cc)==2){ cnt++;}
			cc=bd.cnum(xx  ,xy  ); if(cc!=-1 && bd.ErC(cc)==1 && bd.QaC(cc)==1){ cnt++;}
			return cnt;
		};

		ans.checkLoopLine = function(){
			var check = [];
			for(var i=0;i<bd.cross.length;i++){ check[i]=0;}

			while(1){
				var fc=-1;
				for(var i=0;i<bd.cross.length;i++){ if(check[i]==0){ fc=i; break;}}
				if(fc==-1){ break;}

				if(!this.searchline(check, 0, fc)){
					for(var c=0;c<bd.cell.length;c++){
						if(bd.QaC(c)==1 && check[bd.xnum(bd.cell[c].cx  ,bd.cell[c].cy)]==1){ bd.sErC([c],1);}
						if(bd.QaC(c)==2 && check[bd.xnum(bd.cell[c].cx+1,bd.cell[c].cy)]==1){ bd.sErC([c],1);}
					}
					while(1){
						var endflag = true;
						var clist = pc.cellinside(0,0,k.qcols-1,k.qrows-1,function(c){ return (bd.ErC(c)==1);});
						for(var i=0;i<clist.length;i++){
							var c = clist[i];
							var cc1, cc2, cx=bd.cell[c].cx, cy=bd.cell[c].cy;
							if     (bd.QaC(c)==1){ cc1=bd.xnum(cx,cy  ); cc2=bd.xnum(cx+1,cy+1);}
							else if(bd.QaC(c)==2){ cc1=bd.xnum(cx,cy+1); cc2=bd.xnum(cx+1,cy  );}
							if(this.scntCross2(cc1)==1 || this.scntCross2(cc2)==1){ bd.sErC([c],0); endflag = false; break;}
						}
						if(endflag){ break;}
					}
					return false;
				}
				for(var c=0;c<bd.cross.length;c++){ if(check[c]==1){ check[c]=2;} }
			}
			return true;
		};
		ans.searchline = function(check, dir, c){
			var flag=true;
			var nc, tx=bd.cross[c].cx, ty=bd.cross[c].cy;
			check[c]=1;

			nc = bd.xnum(tx-1,ty-1);
			if(nc!=-1 && dir!=4 && bd.QaC(bd.cnum(tx-1,ty-1))==1 && (check[nc]!=0 || !this.searchline(check,1,nc))){ flag = false;}
			nc = bd.xnum(tx-1,ty+1);
			if(nc!=-1 && dir!=3 && bd.QaC(bd.cnum(tx-1,ty  ))==2 && (check[nc]!=0 || !this.searchline(check,2,nc))){ flag = false;}
			nc = bd.xnum(tx+1,ty-1);
			if(nc!=-1 && dir!=2 && bd.QaC(bd.cnum(tx  ,ty-1))==2 && (check[nc]!=0 || !this.searchline(check,3,nc))){ flag = false;}
			nc = bd.xnum(tx+1,ty+1);
			if(nc!=-1 && dir!=1 && bd.QaC(bd.cnum(tx  ,ty  ))==1 && (check[nc]!=0 || !this.searchline(check,4,nc))){ flag = false;}

			return flag;
		};

		ans.checkQnumCross = function(){
			for(var c=0;c<bd.cross.length;c++){
				if(bd.QnX(c)>=0 && bd.QnX(c)!=this.scntCross(c)){
					bd.sErX([c],1);
					return false;
				}
			}
			return true;
		};
	}
};
