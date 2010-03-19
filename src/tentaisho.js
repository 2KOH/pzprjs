//
// �p�Y���ŗL�X�N���v�g�� �V�̃V���[�� tentaisho.js v3.3.0
//
Puzzles.tentaisho = function(){ };
Puzzles.tentaisho.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
		k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 1;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
		k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
		k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
		k.isLineCross     = 0;	// 1:������������p�Y��
		k.isCenterLine    = 0;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

		k.dispzero      = 0;	// 1:0��\�����邩�ǂ���
		k.isDispHatena  = 0;	// 1:qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber   = 0;	// 1:�񓚂ɐ�������͂���p�Y��
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

		if(k.EDITOR){
			base.setExpression("�@���쐬���[�h���ɁA�}�E�X�̉E�{�^���ŉ��G��`�����Ƃ��o���܂��B���̔w�i�F�́u�����N���b�N�v��u�F������v�{�^���ŏ㏑������܂��B",
							   " In edit mode, it is able to paint a design by Right Click. This background color is superscripted by clicking star or pressing 'Color up' button.");
		}
		else{
			base.setExpression("�@�����N���b�N����ƐF���ʂ�܂��B",
							   " Click star to paint.");
		}
		base.setTitle("�V�̃V���[","Tentaisho");
		base.setFloatbgcolor("rgb(0, 224, 0)");

		enc.pidKanpen = 'tentaisho';
	},
	menufix : function(){
		if(k.EDITOR){
			pp.addCheck('discolor','setting',false,'�F����������','Disable color');
			pp.setLabel('discolor', '���N���b�N�ɂ��F�����𖳌�������', 'Disable Coloring up by clicking star');
		}

		var el = ee.createEL(menu.EL_BUTTON, 'btncolor');
		menu.addButtons(el, ee.binder(mv, mv.encolorall), "�F������","Color up");
		ee('btnarea').appendEL(el);
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if(k.editmode){
				if(this.btn.Left) this.inputstar();
				else if(this.btn.Right) this.inputBGcolor1();
			}
			else if(k.playmode){
				if(this.btn.Left) this.inputborder_tentaisho();
				else if(this.btn.Right) this.inputQsubLine();
			}
		};
		mv.mouseup = function(){
			if(k.playmode && this.notInputted()) this.inputBGcolor3();
		};
		mv.mousemove = function(){
			if(k.editmode){
				if(this.btn.Right) this.inputBGcolor1();
			}
			else if(k.playmode){
				if(this.btn.Left) this.inputborder_tentaisho();
				else if(this.btn.Right) this.inputQsubLine();
			}
		};

		mv.inputBGcolor1 = function(){
			var cc = this.cellid();
			if(cc==-1 || cc==this.mouseCell){ return;}
			if(this.inputData==-1){ this.inputData=(bd.QsC(cc)==0)?3:0;}
			bd.sQsC(cc, this.inputData);
			this.mouseCell = cc; 
			pc.paintCell(cc);
		};
		mv.inputBGcolor3 = function(){
			if(k.EDITOR){ if(pp.getVal('discolor')){ return;} }

			var pos = this.crosspos(0.34);
			var id = bd.snum(pos.x, pos.y);
			if(id==-1 || bd.getStar(id)==0){ return;}

			var cc;
			var sx=id%(2*k.qcols-1)+1;
			var sy=mf(id/(2*k.qcols-1))+1;
			if     ( (sx&1) &&  (sy&1)){ cc = bd.cnum(sx>>1,sy>>1);}
			else if(!(sx&1) && !(sy&1)){
				var xc = bd.xnum(sx>>1,sy>>1);
				if(area.lcntCross(xc)==0){ cc = bd.cnum((sx>>1)-1,(sy>>1)-1);}
				else{ return;}
			}
			else{
				if(bd.QaB(bd.bnum(sx,sy))==0){ cc = bd.cnum((sx-sy%2)>>1, (sy-sx%2)>>1);}
				else{ return;}
			}

			var clist = area.room[area.room.id[cc]].clist;
			if(mv.encolor(clist)){
				var d = ans.getSizeOfClist(clist,f_true);
				pc.paint(d.x1, d.y1, d.x2, d.y2);
			}
		};
		mv.inputborder_tentaisho = function(){
			var pos = this.crosspos(0.34);
			if(pos.x==this.mouseCell.x && pos.y==this.mouseCell.y){ return;}

			var id = bd.bnum(pos.x, pos.y);
			if(id==-1 && this.mouseCell.x){ id = bd.bnum(this.mouseCell.x, this.mouseCell.y);}

			if(this.mouseCell!=-1 && id!=-1){
				if((!(pos.x&1) && this.mouseCell.x==pos.x && Math.abs(this.mouseCell.y-pos.y)==1) ||
				   (!(pos.y&1) && this.mouseCell.y==pos.y && Math.abs(this.mouseCell.x-pos.x)==1) )
				{
					this.mouseCell=-1

					if(this.inputData==-1){ this.inputData=(bd.QaB(id)==0?1:0);}
					if(this.inputData!=-1){
						bd.sQaB(id, this.inputData);
						pc.paintBorder(id);
					}
				}
			}
			this.mouseCell = pos;
		};
		mv.inputstar = function(){
			var pos = this.crosspos(0.25);
			if(pos.x==this.mouseCell.x && pos.y==this.mouseCell.y){ return;}

			var id = bd.snum(pos.x, pos.y);
			if(id==-1 && this.mouseCell.x){ id = bd.snum(this.mouseCell.x, this.mouseCell.y);}

			if(id!=-1){
				if(this.btn.Left)      { bd.setStar(id, {0:1,1:2,2:0}[bd.getStar(id)]);}
				else if(this.btn.Right){ bd.setStar(id, {0:2,1:0,2:1}[bd.getStar(id)]);}
			}
			this.mouseCell = pos;
			pc.paint((pos.x-1)>>1,(pos.y-1)>>1,(pos.x+1)>>1,(pos.y+1)>>1);
		};

		mv.encolorall = function(){
			var rinfo = area.getRoomInfo();
			for(var id=1;id<=rinfo.max;id++){ this.encolor(rinfo.room[id].idlist);}
			pc.paintAll();
		};
		mv.encolor = function(clist){
			var ret = bd.getStar(ans.getInsideStar(clist));

			var flag = false;
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(k.EDITOR && bd.QsC(c)==3 && ret!=2){ continue;}
				else if(bd.QsC(c)!=(ret>0?ret:0)){
					bd.sQsC(c,(ret>0?ret:0));
					flag = true;
				}
			}
			return flag;
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){ };

		// �ꕔqsub�ŏ��������Ȃ����̂����邽�ߏ㏑��
		menu.ex.ASconfirm = function(){
			if(confirm(menu.isLangJP()?"�⏕�L�����������܂����H":"Do you want to erase the auxiliary marks?")){
				um.newOperation(true);
				for(i=0;i<bd.cellmax;i++){
					if(bd.QsC(i)===1){
						um.addOpe(k.CELL,k.QSUB,i,bd.QsC(i),0);
						bd.cell[i].qsub = 0;
					}
				}
				for(i=0;i<bd.bdmax;i++){
					if(bd.QsB(i)!==0){
						um.addOpe(k.BORDER,k.QSUB,i,bd.QsB(i),0);
						bd.border[i].qsub = 0;
					}
				}

				if(g.use.canvas){ pc.flushCanvasAll();}
				pc.paintAll();
			}
		};

		bd.snum = function(sx,sy){
			if(sx<=0 || 2*k.qcols<=sx || sy<=0 || 2*k.qrows<=sy){ return -1;}
			return ((sx-1)+(sy-1)*(2*k.qcols-1));
		};
		bd.getStar = function(id){
			if(id<0||(2*k.qcols-1)*(2*k.qrows-1)<=id){ return -1;}
			var sx=id%(2*k.qcols-1)+1;
			var sy=mf(id/(2*k.qcols-1))+1;

			if     ( (sx&1) &&  (sy&1)){ return bd.QuC(bd.cnum(sx>>1,sy>>1));}
			else if(!(sx&1) && !(sy&1)){ return bd.QuX(bd.xnum(sx>>1,sy>>1));}
			else                       { return bd.QnB(bd.bnum(sx,sy));}
		};
		bd.getStarError = function(id){
			if(id<0||(2*k.qcols-1)*(2*k.qrows-1)<id){ return -1;}
			var sx=id%(2*k.qcols-1)+1;
			var sy=mf(id/(2*k.qcols-1))+1;

			if     ( (sx&1) &&  (sy&1)){ return bd.ErC(bd.cnum(sx>>1,sy>>1));}
			else if(!(sx&1) && !(sy&1)){ return bd.ErX(bd.xnum(sx>>1,sy>>1));}
			else                       { return bd.ErB(bd.bnum(sx,sy));}
		};
		bd.setStar = function(id,val){
			if(id<0||(2*k.qcols-1)*(2*k.qrows-1)<id){ return;}
			var sx=id%(2*k.qcols-1)+1;
			var sy=mf(id/(2*k.qcols-1))+1;

			if     ( (sx&1) &&  (sy&1)){ bd.sQuC(bd.cnum(sx>>1,sy>>1),val);}
			else if(!(sx&1) && !(sy&1)){ bd.sQuX(bd.xnum(sx>>1,sy>>1),val);}
			else{
				um.disCombine = 1;
				bd.sQnB(bd.bnum(sx,sy),val);
				um.disCombine = 0;
			}
		};

		area.call_setBorder = function(id,val,type){
			if(type==k.QANS){ this.setBorder(id,val);}
		};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_LIGHT;
		pc.BorderQanscolor = "rgb(72, 72, 72)";
		pc.qsubcolor1 = "rgb(176,255,176)";
		pc.qsubcolor2 = "rgb(108,108,108)";
		pc.errbcolor1 = pc.errbcolor1_DARK;
		pc.setBGCellColorFunc('qsub3');

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawBGCells(x1,y1,x2,y2);
			this.drawDashedGrid(x1,y1,x2,y2);

			this.drawBorderAnswers(x1,y1,x2,y2);
			this.drawBorderQsubs(x1,y1,x2,y2);

			this.drawStars(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);
		};

		pc.drawBorderAnswers = function(x1,y1,x2,y2){
			var lw = this.lw, lm = this.lm;
			var header = "b_bd_";

			var idlist = this.borderinside(x1*2-2,y1*2-2,x2*2+2,y2*2+2);
			for(var i=0;i<idlist.length;i++){
				var id = idlist[i];
				if(bd.border[id].qans===1){
					if     (bd.border[id].error===1){ g.fillStyle = this.errcolor1;}
					else if(bd.border[id].error===2){ g.fillStyle = this.errBorderQanscolor2;}
					else                            { g.fillStyle = this.BorderQanscolor;}

					if(this.vnop(header+id,this.FILL)){
						if     (bd.border[id].cy&1){ g.fillRect(bd.border[id].px-lm, bd.border[id].py-mf(k.cheight/2)-lm,  lw, k.cheight+lw);}
						else if(bd.border[id].cx&1){ g.fillRect(bd.border[id].px-mf(k.cwidth/2)-lm,  bd.border[id].py-lm,  k.cwidth+lw,  lw);}
					}
				}
				else{ this.vhide(header+id);}
			}
			this.vinc();
		};
		pc.drawStars = function(x1,y1,x2,y2){
			var rsize  = k.cwidth*0.18;
			var rsize2 = k.cwidth*0.14;
			var headers = ["s_star41a_", "s_star41b_"];

			for(var y=2*y1-2;y<=2*y2+2;y++){
				if(y<=0){ y=0; continue;} if(2*k.qrows<=y){ break;}
				for(var x=2*x1-2;x<=2*x2+2;x++){
					if(x<=0){ x=0; continue;} if(2*k.qcols<=x){ break;}

					var id = bd.snum(x,y);

					if(bd.getStar(id)===1 || bd.getStar(id)===2){
						var iserr = bd.getStarError(id);
						g.fillStyle = (iserr ? this.errcolor1 : this.Cellcolor);
						if(this.vnop(headers[0]+id,this.FILL)){
							g.fillCircle(k.p0.x+x*k.cwidth/2, k.p0.y+y*k.cheight/2, rsize);
						}
					}
					else{ this.vhide(headers[0]+id);}

					if(bd.getStar(id)===1){
						g.fillStyle = (iserr ? this.errbcolor1 : "white");
						if(this.vnop(headers[1]+id,this.FILL)){
							g.fillCircle(k.p0.x+x*k.cwidth/2, k.p0.y+y*k.cheight/2, rsize2);
						}
					}
					else{ this.vhide(headers[1]+id);}
				}
			}
			this.vinc();
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type){
			this.decodeStar();
		};
		enc.pzlexport = function(type){
			this.encodeStar();
		};

		enc.decodeKanpen = function(){
			fio.decodeStarFile();
		};
		enc.encodeKanpen = function(){
			fio.encodeStarFile();
		};

		enc.decodeStar = function(bstr){
			var s=0, bstr = this.outbstr;
			for(var i=0;i<bstr.length;i++){
				var ca = bstr.charAt(i);
				if(this.include(ca,"0","f")){
					var val = parseInt(ca,16);
					bd.setStar(s,val%2+1);
					s+=(mf(val/2)+1);
				}
				else if(this.include(ca,"g","z")){ s+=(parseInt(ca,36)-15);}

				if(s>=(2*k.qcols-1)*(2*k.qrows-1)){ break;}
			}
			this.outbstr = bstr.substr(i+1);
		};
		enc.encodeStar = function(){
			var count = 0;
			var cm = "";

			for(var s=0;s<(2*k.qcols-1)*(2*k.qrows-1);s++){
				var pstr = "";
				if(bd.getStar(s)>0){
					for(var i=0;i<=6;i++){
						if(bd.getStar(s+i+1)>0){ pstr=""+(2*i+(bd.getStar(s)-1)).toString(16); s+=i; break;}
					}
					if(pstr==""){ pstr=(13+bd.getStar(s)).toString(16); s+=7;}
				}
				else{ pstr=" "; count++;}

				if(count==0)      { cm += pstr;}
				else if(pstr!=" "){ cm += ((count+15).toString(36)+pstr); count=0;}
				else if(count==20){ cm += "z"; count=0;}
			}
			if(count>0){ cm += ((count+15).toString(36));}

			this.outbstr += cm;
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			this.decodeStarFile();
			this.decodeBorderAns();
			this.decodeCellQsub();
		};
		fio.encodeData = function(){
			this.encodeStarFile();
			this.encodeBorderAns();
			this.encodeCellQsub();
		};

		fio.kanpenOpen = function(){
			this.decodeStarFile();
			this.decodeAnsAreaRoom();
		};
		fio.kanpenSave = function(){
			this.encodeStarFile();
			this.encodeAnsAreaRoom();
		};

		fio.decodeStarFile = function(){
			var array = this.readLines(2*k.qrows-1), s=0;
			for(var i=0;i<array.length;i++){
				for(var c=0;c<array[i].length;c++){
					if     (array[i].charAt(c) == "1"){ bd.setStar(s, 1);}
					else if(array[i].charAt(c) == "2"){ bd.setStar(s, 2);}
					s++;
				}
			}
		};
		fio.encodeStarFile = function(){
			var s=0;
			for(var i=0;i<2*k.qrows-1;i++){
				for(var c=0;c<2*k.qcols-1;c++){
					if     (bd.getStar(s)==1){ this.datastr += "1";}
					else if(bd.getStar(s)==2){ this.datastr += "2";}
					else                     { this.datastr += ".";}
					s++;
				}
				this.datastr += "/";
			}
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkStarOnLine() ){
				this.setAlert('��������ʉ߂��Ă��܂��B', 'A line goes over the star.'); return false;
			}

			var rinfo = area.getRoomInfo();
			this.setAreaStar(rinfo);
			if( !this.checkErrorFlag(rinfo, -1) ){
				this.setAlert('�����܂܂�Ă��Ȃ��̈悪����܂��B','A block has no stars.'); return false;
			}

			if( !this.checkFractal(rinfo) ){
				this.setAlert('�̈悪���𒆐S�ɓ_�Ώ̂ɂȂ��Ă��܂���B', 'A area is not point symmetric about the star.'); return false;
			}

			if( !this.checkErrorFlag(rinfo, -2) ){
				this.setAlert('���������܂܂��̈悪����܂��B','A block has two or more stars.'); return false;
			}

			return true;
		};

		ans.checkStarOnLine = function(){
			var result = true;
			for(var s=0;s<(2*k.qcols-1)*(2*k.qrows-1);s++){
				if(bd.getStar(s)<=0){ continue;}
				var sx=s%(2*k.qcols-1)+1, sy=mf(s/(2*k.qcols-1))+1;
				if(!(sx&1) && !(sy&1)){
					if(area.lcntCross(bd.xnum(sx>>1,sy>>1))!=0){
						if(this.inAutoCheck){ return false;}
						this.setCrossBorderError(sx>>1,sy>>1);
						result = false;
					}
				}
				else if((sx+sy)&1){
					if(bd.QaB(bd.bnum(sx,sy))!=0){
						if(this.inAutoCheck){ return false;}
						bd.sErB(bd.bnum(sx,sy),1);
						result = false;
					}
				}
			}
			return result;
		};

		ans.setAreaStar = function(rinfo){
			rinfo.starid = [];
			for(var id=1;id<=rinfo.max;id++){
				rinfo.starid[id] = this.getInsideStar(rinfo.room[id].idlist);
			}
		};
		ans.getInsideStar = function(clist){
			var cnt=0, ret=-1;
			for(var i=0;i<clist.length;i++){
				var c=clist[i];
				var cx = bd.cell[c].cx, cy = bd.cell[c].cy;
				if(bd.getStar(bd.snum(cx*2+1,cy*2+1))>0){
					cnt++; ret=bd.snum(cx*2+1,cy*2+1);
				}
				if(bd.db(c)!=-1 && bd.QaB(bd.db(c))==0 && bd.getStar(bd.snum(cx*2+1,cy*2+2))>0){
					cnt++; ret=bd.snum(cx*2+1,cy*2+2);
				}
				if(bd.rb(c)!=-1 && bd.QaB(bd.rb(c))==0 && bd.getStar(bd.snum(cx*2+2,cy*2+1))>0){
					cnt++; ret=bd.snum(cx*2+2,cy*2+1);
				}
				if(bd.xnum(cx+1,cy+1)!=-1 && area.lcntCross(bd.xnum(cx+1,cy+1))==0 && bd.getStar(bd.snum(cx*2+2,cy*2+2))>0){
					cnt++; ret=bd.snum(cx*2+2,cy*2+2);
				}

				if(cnt>1){ return -2;}
			}
			return ret;
		};

		ans.checkFractal = function(rinfo){
			var result = true;
			for(var r=1;r<=rinfo.max;r++){
				var sc = rinfo.starid[r];
				if(sc<0){ continue;}
				var sx=sc%(2*k.qcols-1)+1, sy=mf(sc/(2*k.qcols-1))+1;
				for(var i=0;i<rinfo.room[r].idlist.length;i++){
					var c=rinfo.room[r].idlist[i];
					var ccopy = bd.cnum(sx-bd.cell[c].cx-1, sy-bd.cell[c].cy-1);
					if(ccopy==-1||rinfo.id[c]!=rinfo.id[ccopy]){
						if(this.inAutoCheck){ return false;}
						bd.sErC(rinfo.room[r].idlist,1); result = false;
					}
				}
			}
			return result;
		};

		ans.checkErrorFlag = function(rinfo, val){
			var result = true;
			for(var id=1;id<=rinfo.max;id++){
				if(rinfo.starid[id]!==val){ continue;}

				if(this.inAutoCheck){ return false;}
				bd.sErC(rinfo.room[id].idlist,1);
				result = false;
			}
			return result;
		};
	}
};
