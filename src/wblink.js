//
// �p�Y���ŗL�X�N���v�g�� �V���N�������N�� wblink.js v3.2.0
//
Puzzles.wblink = function(){ };
Puzzles.wblink.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 8;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 8;}	// �Ֆʂ̏c��
		k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
		k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
		k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
		k.isborderCross   = 0;	// 1:������������p�Y��
		k.isCenterLine    = 1;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

		k.dispzero      = 0;	// 1:0��\�����邩�ǂ���
		k.isDispHatena  = 1;	// 1:qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber   = 0;	// 1:�񓚂ɐ�������͂���p�Y��
		k.isArrowNumber = 0;	// 1:������������͂���p�Y��
		k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
		k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
		k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

		k.BlackCell     = 0;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

		k.fstruct = ["cellques41_42","borderline"];

		//k.def_csize = 36;
		k.def_psize = 16;

		base.setTitle("�V���N�������N","Shirokuro-link");
		base.setExpression("�@���h���b�O�Ő����A�E�N���b�N�Ł~�����͂ł��܂��B",
						   " Left Button Drag to input black cells, Right Click to input a cross.");
		base.setFloatbgcolor("rgb(127, 191, 0)");
	},
	menufix : function(){ },

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(k.mode==1) this.inputQues(x,y,[0,41,42,-2]);
			else if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};
		mv.mouseup = function(x,y){ };
		mv.mousemove = function(x,y){
			if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};

		mv.inputLine = function(x,y){
			if(this.inputData==2){ return;}
			var pos = this.cellpos(new Pos(x,y));
			if(pos.x==this.mouseCell.x && pos.y==this.mouseCell.y){ return;}

			var id = -1;
			if     (pos.y-this.mouseCell.y==-1){ id=bd.bnum(this.mouseCell.x*2+1,this.mouseCell.y*2  );}
			else if(pos.y-this.mouseCell.y== 1){ id=bd.bnum(this.mouseCell.x*2+1,this.mouseCell.y*2+2);}
			else if(pos.x-this.mouseCell.x==-1){ id=bd.bnum(this.mouseCell.x*2  ,this.mouseCell.y*2+1);}
			else if(pos.x-this.mouseCell.x== 1){ id=bd.bnum(this.mouseCell.x*2+2,this.mouseCell.y*2+1);}

			if(this.mouseCell!=-1 && id!=-1){
				var idlist = this.getidlist(id);
				if(this.inputData==-1){ this.inputData=(bd.LiB(id)==0)?1:0;}
				if(this.inputData> 0 && ((pos.x-this.mouseCell.x==-1)||(pos.y-this.mouseCell.y==-1))){ idlist=idlist.reverse();} // �F�����̓s����̏���
				for(var i=0;i<idlist.length;i++){
					if(this.inputData!=-1){ bd.sLiB(idlist[i], this.inputData); bd.sQsB(idlist[i], 0);}
					pc.paintLine(idlist[i]);
				}
				this.inputData=2;
			}
			this.mouseCell = pos;
		};
		mv.getidlist = function(id){
			var idlist=[], bx1, bx2, by1, by2;
			var cc1=bd.cc1(id), cx=bd.cell[cc1].cx, cy=bd.cell[cc1].cy;
			if(bd.border[id].cx%2==1){
				while(cy>=0         && bd.QuC(bd.cnum(cx,cy  ))==0){ cy--;} by1=2*cy+2;
				while(cy<=k.qrows-1 && bd.QuC(bd.cnum(cx,cy+1))==0){ cy++;} by2=2*cy+2;
				bx1 = bx2 = bd.border[id].cx;
			}
			else if(bd.border[id].cy%2==1){
				while(cx>=0         && bd.QuC(bd.cnum(cx  ,cy))==0){ cx--;} bx1=2*cx+2;
				while(cx<=k.qcols-1 && bd.QuC(bd.cnum(cx+1,cy))==0){ cx++;} bx2=2*cx+2;
				by1 = by2 = bd.border[id].cy;
			}
			if(bx1<1||bx2>2*k.qcols-1||by1<1||by2>2*k.qrows-1){ return [];}
			for(var i=bx1;i<=bx2;i+=2){ for(var j=by1;j<=by2;j+=2){ idlist.push(bd.bnum(i,j)); } }
			return idlist;
		};

		mv.inputpeke = function(x,y){
			var pos = this.crosspos(new Pos(x,y), 0.22);
			var id = bd.bnum(pos.x, pos.y);
			if(id==-1 || (pos.x==this.mouseCell.x && pos.y==this.mouseCell.y)){ return;}

			if(this.inputData==-1){ this.inputData=(bd.QsB(id)!=2?2:0);}
			bd.sQsB(id, this.inputData);

			var idlist = this.getidlist(id);
			for(var i=0;i<idlist.length;i++){
				bd.sLiB(idlist[i], 0);
				pc.paintBorder(idlist[i]);
			}
			if(idlist.length==0){ pc.paintBorder(id);}
			this.mouseCell = pos;
		},

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.mode==3){ return;}
			if(this.moveTCell(ca)){ return;}
			this.input41_42(ca);
		};
		kc.input41_42 = function(ca){
			if(k.mode==3){ return false;}

			var cc = tc.getTCC();
			var flag = false;

			if     (ca=='1'){ bd.sQuC(cc,(bd.QuC(cc)!=41?41:0)); flag = true;}
			else if(ca=='2'){ bd.sQuC(cc,(bd.QuC(cc)!=42?42:0)); flag = true;}
			else if(ca=='-'){ bd.sQuC(cc,(bd.QuC(cc)!=-2?-2:0)); flag = true;}
			else if(ca=='3'||ca==" "){ bd.sQuC(cc,0); flag = true;}

			if(flag){ pc.paintCell(cc);}
			return flag;
		};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(224, 224, 224)";
		pc.errbcolor1 = "rgb(255, 127, 127)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			if(k.mode==1){
				this.drawChassis_bridges(x1,y1,x2,y2);
				this.drawBDline(x1,y1,x2,y2);
			}
			else{ this.hideBorder();}

			this.drawPekes(x1,y1,x2,y2,0);
			this.drawLines(x1,y1,x2,y2);

			this.drawQueses41_42(x1-2,y1-2,x2+1,y2+1);
			this.drawNumbers(x1,y1,x2,y2);

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};

		pc.drawQueses41_42 = function(x1,y1,x2,y2){
			var rsize  = k.cwidth*0.35;
			var rsize2 = k.cwidth*0.30;

			var clist = this.cellinside(x1,y1,x2,y2,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];

				if(bd.QuC(c)==41 || bd.QuC(c)==42){
					if(bd.ErC(c)==1){ g.fillStyle = this.errcolor1;}
					else{ g.fillStyle = this.Cellcolor;}
					if(this.vnop("c"+c+"_cir41a_",1)){
						g.beginPath(); g.arc(bd.cell[c].px()+mf(k.cwidth/2), bd.cell[c].py()+mf(k.cheight/2), rsize , 0, Math.PI*2, false); g.fill();
					}
				}
				else{ this.vhide("c"+c+"_cir41a_");}

				if(bd.QuC(c)==41){
					g.fillStyle = "white";
					if(this.vnop("c"+c+"_cir41b_",1)){
						g.beginPath(); g.arc(bd.cell[c].px()+mf(k.cwidth/2), bd.cell[c].py()+mf(k.cheight/2), rsize2, 0, Math.PI*2, false); g.fill();
					}
				}
				else{ this.vhide("c"+c+"_cir41b_");}
			}
			this.vinc();
		};
		pc.drawLine1 = function(id, flag){
			var lw = (mf(k.cwidth/8)>=3?mf(k.cwidth/8):3); //LineWidth
			var lm = mf((lw-1)/2); //LineMargin
			var pid = "b"+id+"_line_";

			if     (bd.ErB(id)==1){ g.fillStyle = this.errlinecolor1; lw++;}
			else if(bd.ErB(id)==2){ g.fillStyle = this.errlinecolor2;}
			else{ g.fillStyle = this.linecolor;}

			if(!flag){ this.vhide(pid);}
			else if(bd.border[id].cx%2==1 && this.vnop(pid,1)){
				g.fillRect(bd.border[id].px()-lm, bd.border[id].py()-mf(k.cheight/2)-lm, lw, k.cheight+lw);
			}
			else if(bd.border[id].cy%2==1 && this.vnop(pid,1)){
				g.fillRect(bd.border[id].px()-mf(k.cwidth/2)-lm, bd.border[id].py()-lm, k.cwidth+lw, lw);
			}
		};
		pc.drawChassis_bridges = function(x1,y1,x2,y2){
			x1--; y1--; x2++; y2++;
			if(x1<0){ x1=0;} if(x2>k.qcols-1){ x2=k.qcols-1;}
			if(y1<0){ y1=0;} if(y2>k.qrows-1){ y2=k.qrows-1;}

			g.fillStyle = "rgb(224,224,224)";
			if(x1<1)         { if(this.vnop("chs1_",1)){ g.fillRect(k.p0.x+x1*k.cwidth    , k.p0.y+y1*k.cheight    , 1, (y2-y1+1)*k.cheight+1);} }
			if(y1<1)         { if(this.vnop("chs2_",1)){ g.fillRect(k.p0.x+x1*k.cwidth    , k.p0.y+y1*k.cheight    , (x2-x1+1)*k.cwidth+1, 1); } }
			if(y2>=k.qrows-1){ if(this.vnop("chs3_",1)){ g.fillRect(k.p0.x+x1*k.cwidth    , k.p0.y+(y2+1)*k.cheight, (x2-x1+1)*k.cwidth+1, 1); } }
			if(x2>=k.qcols-1){ if(this.vnop("chs4_",1)){ g.fillRect(k.p0.x+(x2+1)*k.cwidth, k.p0.y+y1*k.cheight    , 1, (y2-y1+1)*k.cheight+1);} }
			this.vinc();
		};
		pc.hideBorder = function(){
			if(!g.vml){ return;}
			this.vhide(["chs1_","chs2_","chs3_","chs4_"]);
			for(var i=0;i<=k.qcols;i++){ this.vhide("bdy"+i+"_");}
			for(var i=0;i<=k.qrows;i++){ this.vhide("bdx"+i+"_");}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==0 || type==1){ bstr = this.decodeCircle(bstr);}
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			return "/"+k.qcols+"/"+k.qrows+"/"+this.encodeCircle();
		};

		enc.decodeCircle = function(bstr,flag){
			var pos = bstr?Math.min(mf((k.qcols*k.qrows+2)/3), bstr.length):0;
			for(var i=0;i<pos;i++){
				var ca = parseInt(bstr.charAt(i),27);
				for(var w=0;w<3;w++){
					if(i*3+w<k.qcols*k.qrows){
						if     (mf(ca/Math.pow(3,2-w))%3==1){ bd.sQuC(i*3+w,41);}
						else if(mf(ca/Math.pow(3,2-w))%3==2){ bd.sQuC(i*3+w,42);}
					}
				}
			}

			return bstr.substring(pos,bstr.length);
		};
		enc.encodeCircle = function(flag){
			var cm = "", num = 0, pass = 0;
			for(var i=0;i<bd.cell.length;i++){
				if     (bd.QuC(i)==41){ pass+=(  Math.pow(3,2-num));}
				else if(bd.QuC(i)==42){ pass+=(2*Math.pow(3,2-num));}
				num++; if(num==3){ cm += pass.toString(27); num=0; pass=0;}
			}
			if(num>0){ cm += pass.toString(27);}

			return cm;
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			this.performAsLine = true;
			if( !this.checkLcntCell(4) ){
				this.setAlert('�����������Ă��܂��B','There is a crossing line.'); return false;
			}

			var larea = this.searchLarea();
			if( !this.checkOneNumber(larea, function(a,cnt){ return (cnt>=3);}, function(c){ return (bd.QuC(c)!=0);} ) ){
				this.setAlert('3�ȏ�́����q�����Ă��܂��B','Three or more objects are connected.'); return false;
			}

			if( !this.checkWBcircle(larea, 41) ){
				this.setAlert('���ۓ��m���q�����Ă��܂��B','Two white circles are connected.'); return false;
			}
			if( !this.checkWBcircle(larea, 42) ){
				this.setAlert('���ۓ��m���q�����Ă��܂��B','Two black circles are connected.'); return false;
			}

			if( !this.checkAllCell(function(c){ return (bd.QuC(c)!=0 && this.lcntCell(c)==0);}.bind(this) ) ){
				this.setAlert('����������o�Ă��܂���B','A circle doesn\'t start any line.'); return false;
			}

			return true;
		};
		ans.check1st = function(){ return true;};

		ans.checkWBcircle = function(larea,val){
			for(var r=1;r<=larea.max;r++){
				var tip1=-1, tip2=-1;
				if(larea.room[r].length>1){
					var tip1 = larea.room[r][0];
					var tip2 = larea.room[r][larea.room[r].length-1];
					if(bd.QuC(tip1)==val && bd.QuC(tip2)==val){
						bd.sErB(bd.borders,2); ans.setErrLareaById(larea,r,1);
						bd.sErC([tip1,tip2],1);
						return false;
					}
				}
			}
			return true;
		};
	}
};
