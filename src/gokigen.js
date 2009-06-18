//
// �p�Y���ŗL�X�N���v�g�� ��������ȂȂߔ� gokigen.js v3.1.9p2
//

function setting(){
	// �O���[�o���ϐ��̏����ݒ�
	if(!k.qcols){ k.qcols = 7;}	// �Ֆʂ̉���
	if(!k.qrows){ k.qrows = 7;}	// �Ֆʂ̏c��
	k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

	k.iscross      = 1;		// 1:Cross������\�ȃp�Y��
	k.isborder     = 0;		// 1:Border/Line������\�ȃp�Y��
	k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

	k.isoutsidecross  = 1;	// 1:�O�g���Cross�̔z�u������p�Y��
	k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
	k.isborderCross   = 0;	// 1:������������p�Y��
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
}

//-------------------------------------------------------------
// Puzzle�ʃN���X�̒�`
Puzzle = function(){
	this.prefix();
};
Puzzle.prototype = {
	prefix : function(){
		this.input_init();
		this.graphic_init();

		base.setTitle("��������ȂȂ�","Gokigen-naname");
		base.setExpression("�@�}�E�X�Ŏΐ�����͂ł��܂��B",
						   " Click to input slashes.");
		base.setFloatbgcolor("rgb(0, 127, 0)");
	},
	menufix : function(){
		menu.addUseToFlags();

		pp.addCheckToFlags('dispred','setting',false);
		pp.setMenuStr('dispred', '�q����`�F�b�N', 'Continuous Check');
		pp.setLabel  ('dispred', '���̂Ȃ�����`�F�b�N����', 'Check countinuous slashes');
	},
	postfix : function(){
		menu.ex.adjustSpecial = this.adjustSpecial;

		$("#btnclear2").css("display",'none');

		tc.minx = 0;
		tc.miny = 0;
		tc.maxx = 2*k.qcols;
		tc.maxy = 2*k.qrows;
		tc.setTXC(0);
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
			if(cc==-1 || bd.getQansCell(cc)==-1){ return;}

			var area = new AreaInfo();
			for(var i=0;i<bd.cross.length;i++){ area.check[i]=0;}

			var fc = bd.getxnum(bd.cell[cc].cx+(bd.getQansCell(cc)==1?0:1),bd.cell[cc].cy);
			puz.searchline(area, 0, fc);
			for(var c=0;c<bd.cell.length;c++){
				if(bd.getQansCell(c)==1 && area.check[bd.getxnum(bd.cell[c].cx  ,bd.cell[c].cy)]==1){ bd.setErrorCell([c],2);}
				if(bd.getQansCell(c)==2 && area.check[bd.getxnum(bd.cell[c].cx+1,bd.cell[c].cy)]==1){ bd.setErrorCell([c],2);}
			}

			ans.errDisp = true;
			pc.paintAll();
		};
		mv.inputslash = function(x,y){
			var cc = this.cellid(new Pos(x,y));
			if(cc==-1){ return;}

			if     (k.use==1){ bd.setQansCell(cc, (bd.getQansCell(cc)!=(this.btn.Left?1:2)?(this.btn.Left?1:2):-1));}
			else if(k.use==2){
				if(bd.getQansCell(cc)==-1){ bd.setQansCell(cc, (this.btn.Left?1:2));}
				else{ bd.setQansCell(cc, (this.btn.Left?{1:2,2:-1}:{1:-1,2:1})[bd.getQansCell(cc)]);}
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
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(160, 160, 160)";
		pc.errcolor1 = "red";

		pc.crosssize = 0.33;
		pc.chassisflag = false;

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawErrorCells(x1,y1,x2,y2);

			this.drawBDline2(x1,y1,x2,y2);

			this.drawSlashes(x1,y1,x2,y2);

			this.drawCrosses(x1,y1,x2+1,y2+1);
			if(k.mode==1){ this.drawTCross(x1,y1,x2+1,y2+1);}else{ this.hideTCross();}
		};
		pc.drawErrorCells = function(x1,y1,x2,y2){
			var clist = this.cellinside(x1,y1,x2,y2,f_true);
			for(var i=0;i<clist.length;i++){
				var c=clist[i];
				if(bd.getQansCell(c)==-1 && bd.getErrorCell(c)==1){
					g.fillStyle = this.errbcolor1;
					if(this.vnop("c"+c+"_full_",1)){ g.fillRect(bd.cell[c].px(), bd.cell[c].py(), k.cwidth, k.cheight);}
				}
				else{ this.vhide("c"+c+"_full_");}
			}
			this.vinc();
		},
		pc.drawSlashes = function(x1,y1,x2,y2){
			var clist = this.cellinside(x1,y1,x2,y2,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];

				if(bd.getQansCell(c)!=-1){
					if     (bd.getErrorCell(c)==1){ g.strokeStyle = this.errcolor1;}
					else if(bd.getErrorCell(c)==2){ g.strokeStyle = this.errcolor2;}
					else                          { g.strokeStyle = this.Cellcolor;}

					g.lineWidth = (int(k.cwidth/8)>=2?int(k.cwidth/8):2);
					g.beginPath();
					if(bd.getQansCell(c)==1){
						g.moveTo(bd.cell[c].px()         , bd.cell[c].py()          );
						g.lineTo(bd.cell[c].px()+k.cwidth, bd.cell[c].py()+k.cheight);
						this.vhide("c"+c+"_sl2_");
					}
					else if(bd.getQansCell(c)==2){
						g.moveTo(bd.cell[c].px()+k.cwidth, bd.cell[c].py()          );
						g.lineTo(bd.cell[c].px()         , bd.cell[c].py()+k.cheight);
						this.vhide("c"+c+"_sl1_");
					}
					g.closePath();
					if(this.vnop("c"+c+"_sl"+bd.getQansCell(c)+"_",0)){ g.stroke();}
				}
				else{ this.vhide("c"+c+"_sl1_"); this.vhide("c"+c+"_sl2_");}
			}
			this.vinc();
		};
	},

	adjustSpecial : function(type,key){
		um.disableRecord();
		if(type>=1 && type<=4){ // ���]�E��]�S��
			for(var c=0;c<bd.cell.length;c++){ if(bd.getQansCell(c)!=0){ bd.setQansCell(c,{1:2,2:1}[bd.getQansCell(c)]); } }
		}
		um.enableRecord();
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	pzlinput : function(type, bstr){
		if((type==1 && enc.pzlflag.indexOf("c")>=0) || (type==0 && enc.pzlflag.indexOf("d")==-1)){
			bstr = enc.decode4(bstr, bd.setQnumCross.bind(bd), (k.qcols+1)*(k.qrows+1));
		}
		else{ bstr = enc.decodecross_old(bstr);}
	},
	pzloutput : function(type){
		if(type==0)     { document.urloutput.ta.value = enc.getURLbase()+"?"+k.puzzleid+this.pzldata();}
		else if(type==1){ document.urloutput.ta.value = enc.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
		else if(type==3){ document.urloutput.ta.value = enc.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
	},
	pzldata : function(){
		return "/"+k.qcols+"/"+k.qrows+"/"+enc.encode4(bd.getQnumCross.bind(bd), (k.qcols+1)*(k.qrows+1));
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	check : function(){

		if( !this.checkLoopLine() ){
			ans.setAlert('�ΐ��ŗւ������ł��Ă��܂��B', 'There is a loop consisted in some slashes.'); return false;
		}

		if( !this.checkQnumCross() ){
			ans.setAlert('�����Ɍq������̐����Ԉ���Ă��܂��B', 'A number is not equal to count of lines that is connected to it.'); return false;
		}

		if( !ans.checkAllCell(function(c){ return (bd.getQansCell(c)==-1);}) ){
			ans.setAlert('�ΐ����Ȃ��}�X������܂��B','There is a empty cell.'); return false;
		}

		return true;
	},

	scntCross : function(id){
		if(id==-1){ return -1;}
		var xx=bd.cross[id].cx, xy=bd.cross[id].cy;
		var cc, cnt=0;
		cc=bd.getcnum(xx-1,xy-1); if(cc!=-1 && bd.getQansCell(cc)==1){ cnt++;}
		cc=bd.getcnum(xx  ,xy-1); if(cc!=-1 && bd.getQansCell(cc)==2){ cnt++;}
		cc=bd.getcnum(xx-1,xy  ); if(cc!=-1 && bd.getQansCell(cc)==2){ cnt++;}
		cc=bd.getcnum(xx  ,xy  ); if(cc!=-1 && bd.getQansCell(cc)==1){ cnt++;}
		return cnt;
	},
	scntCross2 : function(id){
		if(id==-1){ return -1;}
		var xx=bd.cross[id].cx, xy=bd.cross[id].cy;
		var cc, cnt=0;
		cc=bd.getcnum(xx-1,xy-1); if(cc!=-1 && bd.getErrorCell(cc)==1 && bd.getQansCell(cc)==1){ cnt++;}
		cc=bd.getcnum(xx  ,xy-1); if(cc!=-1 && bd.getErrorCell(cc)==1 && bd.getQansCell(cc)==2){ cnt++;}
		cc=bd.getcnum(xx-1,xy  ); if(cc!=-1 && bd.getErrorCell(cc)==1 && bd.getQansCell(cc)==2){ cnt++;}
		cc=bd.getcnum(xx  ,xy  ); if(cc!=-1 && bd.getErrorCell(cc)==1 && bd.getQansCell(cc)==1){ cnt++;}
		return cnt;
	},

	checkLoopLine : function(){
		var area = new AreaInfo();
		for(var i=0;i<bd.cross.length;i++){ area.check[i]=0;}

		while(1){
			var fc=-1;
			for(var i=0;i<bd.cross.length;i++){ if(area.check[i]==0){ fc=i; break;}}
			if(fc==-1){ break;}

			if(!this.searchline(area, 0, fc)){
				for(var c=0;c<bd.cell.length;c++){
					if(bd.getQansCell(c)==1 && area.check[bd.getxnum(bd.cell[c].cx  ,bd.cell[c].cy)]==1){ bd.setErrorCell([c],1);}
					if(bd.getQansCell(c)==2 && area.check[bd.getxnum(bd.cell[c].cx+1,bd.cell[c].cy)]==1){ bd.setErrorCell([c],1);}
				}
				while(1){
					var endflag = true;
					var clist = pc.cellinside(0,0,k.qcols-1,k.qrows-1,function(c){ return (bd.getErrorCell(c)==1);});
					for(var i=0;i<clist.length;i++){
						var c = clist[i];
						var cc1, cc2, cx=bd.cell[c].cx, cy=bd.cell[c].cy;
						if     (bd.getQansCell(c)==1){ cc1=bd.getxnum(cx,cy  ); cc2=bd.getxnum(cx+1,cy+1);}
						else if(bd.getQansCell(c)==2){ cc1=bd.getxnum(cx,cy+1); cc2=bd.getxnum(cx+1,cy  );}
						if(this.scntCross2(cc1)==1 || this.scntCross2(cc2)==1){ bd.setErrorCell([c],0); endflag = false; break;}
					}
					if(endflag){ break;}
				}
				return false;
			}
			for(var c=0;c<bd.cross.length;c++){ if(area.check[c]==1){ area.check[c]=2;} }
		}
		return true;
	},
	searchline : function(area, dir, c){
		var check=true;
		var nc, tx=bd.cross[c].cx, ty=bd.cross[c].cy;
		area.check[c]=1;

		nc = bd.getxnum(tx-1,ty-1);
		if(nc!=-1 && dir!=4 && bd.getQansCell(bd.getcnum(tx-1,ty-1))==1 && (area.check[nc]!=0 || !arguments.callee(area,1,nc))){ check = false;}
		nc = bd.getxnum(tx-1,ty+1);
		if(nc!=-1 && dir!=3 && bd.getQansCell(bd.getcnum(tx-1,ty  ))==2 && (area.check[nc]!=0 || !arguments.callee(area,2,nc))){ check = false;}
		nc = bd.getxnum(tx+1,ty-1);
		if(nc!=-1 && dir!=2 && bd.getQansCell(bd.getcnum(tx  ,ty-1))==2 && (area.check[nc]!=0 || !arguments.callee(area,3,nc))){ check = false;}
		nc = bd.getxnum(tx+1,ty+1);
		if(nc!=-1 && dir!=1 && bd.getQansCell(bd.getcnum(tx  ,ty  ))==1 && (area.check[nc]!=0 || !arguments.callee(area,4,nc))){ check = false;}

		return check;
	},


	checkQnumCross : function(){
		for(var c=0;c<bd.cross.length;c++){
			if(bd.getQnumCross(c)>=0 && bd.getQnumCross(c)!=this.scntCross(c)){
				bd.setErrorCross([c],1);
				return false;
			}
		}
		return true;
	}
};
