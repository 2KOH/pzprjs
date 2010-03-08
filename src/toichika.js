//
// �p�Y���ŗL�X�N���v�g�� ���������� toichika.js v3.2.5��
//
Puzzles.toichika = function(){ };
Puzzles.toichika.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
		k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
		k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
		k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
		k.isLineCross     = 0;	// 1:������������p�Y��
		k.isCenterLine    = 0;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

		k.dispzero      = 0;	// 1:0��\�����邩�ǂ���
		k.isDispHatena  = 1;	// 1:qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber   = 1;	// 1:�񓚂ɐ�������͂���p�Y��
		k.isArrowNumber = 0;	// 1:������������͂���p�Y��
		k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
		k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
		k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

		k.BlackCell     = 0;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 0;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

		//k.def_csize = 36;
		//k.def_psize = 24;
		k.area = { bcell:0, wcell:0, number:1};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		if(k.EDITOR){
			base.setExpression("�@<span style=\"color:red;\">�I�I�J���r���łł��I�I</span><br>�@�L�[�{�[�h�̍�����-�L�[���ŁA�L���̓��͂��ł��܂��B",
							   " <span style=\"color:red;\">!!This is developng version.!!</span><br> Press left side of the keyboard or '-' key to input marks.");
		}
		else{
			base.setExpression("�@���N���b�N�ŋL�����A�E�h���b�O�ŕ⏕�L�������͂ł��܂��B",
							   " Left Click to input answers, Right Button Drag to input auxiliary marks.");
		}
		base.setTitle("��������","Toichika");
		base.setFloatbgcolor("rgb(127, 160, 96)");
	},
	menufix : function(){
		kp.defaultdisp = true;
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if     (k.editmode){ this.inputdirec_toichika(true);}
			else if(k.playmode){
				if(this.btn.Left){ this.inputdirec_toichika(true);}
			}
		};
		mv.mouseup = function(){
			if(this.notInputted()){
				this.inputdirec_mouseup();
//				if(!kp.enabled()) this.inputqnum();
//				else if(this.btn.Left){ kp.display();}
			}
		};
		mv.mousemove = function(){
			if     (k.editmode){ this.inputdirec_toichika(false);}
			else if(k.playmode){
				if     (this.btn.Left){ this.inputdirec_toichika(false);}
				else if(this.btn.Right){ this.inputDot(false);}
			}
		};

		mv.inputdirec_toichika = function(ismousedown){
			if(this.inputData===2){ return;}

			var pos;
			if(k.editmode && (this.inputData===1 || ismousedown)){
				pos = this.crosspos(0.33);
				if((!(pos.x&1)||!(pos.y&1))||this.inputData===1){
					this.inputData = 1;
					this.inputborder();
					return;
				}
			}

			this.inputData = 0;
			pos = this.cellpos();
			if(pos.x==this.mouseCell.x && pos.y==this.mouseCell.y){ return;}

			var inp = 0;
			var cc = bd.cnum(this.mouseCell.x, this.mouseCell.y);
			if(cc!=-1){
				if     (pos.y-this.mouseCell.y==-1){ inp=k.UP;}
				else if(pos.y-this.mouseCell.y== 1){ inp=k.DN;}
				else if(pos.x-this.mouseCell.x==-1){ inp=k.LT;}
				else if(pos.x-this.mouseCell.x== 1){ inp=k.RT;}
				else{ return;}

				if(k.editmode){
					bd.sDiC(cc, (bd.DiC(cc)!=inp?inp:0));
					bd.sQaC(cc, -1);
				}
				else if(k.playmode && bd.DiC(cc)===0){
					bd.sQaC(cc, (bd.QaC(cc)!=inp?inp:-1));
				}
				bd.sQsC(cc, 0);

				pc.paintCell(cc);
				this.inputData=2;
			}
			this.mouseCell = pos;
		};
		mv.inputdirec_mouseup = function(){
			var cc = this.cellid();
			if(cc==-1 || cc==this.mouseCell){ return;}

			if(cc==tc.getTCC()){
				var nex = (this.btn.Left ? [k.UP, k.RT, k.LT, 0, k.DN]
										 : [k.LT, 0, k.RT, k.DN, k.UP]);
				if(k.editmode){
					bd.sDiC(cc, nex[bd.DiC(cc)]);
					bd.sQaC(cc, -1);
					bd.sQsC(cc, 0);
				}
				else if(k.playmode && bd.DiC(cc)===0){
					var val = nex[(bd.QaC(cc)!==-1?bd.QaC(cc):0)];
					if(val===0){ val=-1;}
					bd.sQaC(cc, val);
					bd.sQsC(cc, 0);
				}
				this.mouseCell = cc;
			}
			else{
				var cc0 = tc.getTCC();
				tc.setTCC(cc);
				pc.paint(bd.cell[cc0].cx-1, bd.cell[cc0].cy-1, bd.cell[cc0].cx, bd.cell[cc0].cy);
				if(bd.QsC(cc)==1 || bd.QaC(cc)==-1){ this.inputData=1;}
			}

			pc.paint(bd.cell[cc].cx-1, bd.cell[cc].cy-1, bd.cell[cc].cx, bd.cell[cc].cy);
		};

		mv.inputDot = function(){
			var cc = this.cellid();
			if(cc==-1 || cc==this.mouseCell || bd.DiC(cc)!==0){ return;}

			if(this.inputData===-1){ this.inputData=(bd.QsC(cc)===1?0:1);}
			
			var cc0 = tc.getTCC(); //tc.setTCC(cc);
			bd.sQaC(cc,-1);
			bd.sQsC(cc,this.inputData);
			this.mouseCell = cc;

			pc.paint(bd.cell[cc0].cx-1, bd.cell[cc0].cy-1, bd.cell[cc0].cx, bd.cell[cc0].cy);
			pc.paint(bd.cell[cc].cx-1, bd.cell[cc].cy-1, bd.cell[cc].cx, bd.cell[cc].cy);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(this.moveTCell(ca)){ return;}
			kc.key_hakoiri(ca);
		};
		kc.key_hakoiri = function(ca){
			var cc = tc.getTCC();
			var flag = false;

			if     ((ca=='1'||ca=='q'||ca=='a'||ca=='z')){
				bd.setNum(cc,1);
				flag = true;
			}
			else if((ca=='2'||ca=='w'||ca=='s'||ca=='x')){
				bd.setNum(cc,2);
				flag = true;
			}
			else if((ca=='3'||ca=='e'||ca=='d'||ca=='c')){
				bd.setNum(cc,3);
				flag = true;
			}
			else if((ca=='4'||ca=='r'||ca=='f'||ca=='v')){
				bd.setNum(cc,(k.editmode?-2:-1));
				flag = true;
			}
			else if((ca=='5'||ca=='t'||ca=='g'||ca=='b'||ca==' ')){
				bd.setNum(cc,-1);
				flag = true;
			}
			else if(ca=='-'){
				if(k.editmode){ bd.sQnC(cc,(bd.QnC(cc)!=-2?-2:-1)); bd.sQaC(cc,-1); bd.sQsC(cc,0);}
				else if(bd.QnC(cc)==-1){ bd.sQaC(cc,-1); bd.sQsC(cc,(bd.QsC(cc)!=1?1:0));}
				flag = true;
			}

			if(flag){ pc.paint(bd.cell[cc].cx, bd.cell[cc].cy, bd.cell[cc].cx, bd.cell[cc].cy); return true;}
			return false;
		};

		kp.kpgenerate = function(mode){
			if(mode==1){
				this.inputcol('num','knum1','1','��');
				this.inputcol('num','knum2','2','��');
				this.inputcol('num','knum3','3','��');
				this.insertrow();
				this.inputcol('num','knum4','4','?');
				this.inputcol('num','knum_',' ',' ');
				this.inputcol('empty','knumx','','');
				this.insertrow();
			}
			else{
				this.tdcolor = pc.fontAnscolor;
				this.inputcol('num','qnum1','1','��');
				this.inputcol('num','qnum2','2','��');
				this.inputcol('num','qnum3','3','��');
				this.insertrow();
				this.tdcolor = "rgb(255, 96, 191)";
				this.inputcol('num','qnum4','4','�E');
				this.tdcolor = "black";
				this.inputcol('num','qnum_',' ',' ');
				this.inputcol('empty','qnumx','','');
				this.insertrow();
			}
		};
		kp.generate(kp.ORIGINAL, true, true, kp.kpgenerate);
		kp.kpinput = function(ca){ kc.key_hakoiri(ca);};

		bd.maxnum = 3;
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_LIGHT;
		pc.dotcolor = "rgb(255, 96, 191)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);

			this.drawBGCells(x1,y1,x2,y2);
			this.drawGrid(x1,y1,x2,y2);
			this.drawBorders(x1,y1,x2,y2);

			this.drawDotCells(x1,y1,x2,y2);
//			this.drawNumbers(x1,y1,x2,y2);
			this.drawArrows(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawTCell(x1,y1,x2+1,y2+1);
		};

		pc.drawArrows = function(x1,y1,x2,y2){
			var headers = ["c_arup_", "c_ardn_", "c_arlt_", "c_arrt_"];
			var ll = mf(k.cwidth*0.8);							//LineLength
			var lw = (mf(k.cwidth/18)>=2?mf(k.cwidth/18/2)*2:2);	//LineWidth
			var lm = (lw-1)/2;								//LineMargin
			var head1 = mf(ll/5), head2 = mf(ll/5);

			var clist = this.cellinside(x1-2,y1-2,x2+2,y2+2);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.QaC(c)>0 || bd.DiC(c)>0){
					var ax=px=bd.cell[c].px+mf(k.cwidth/2);
					var ay=py=bd.cell[c].py+mf(k.cheight/2);
					var dir=(bd.cell[c].direc>0 ? bd.cell[c].direc : bd.cell[c].qans);

					if     (bd.cell[c].error===1){ g.fillStyle = this.fontErrcolor;}
					else if(bd.cell[c].direc>0)  { g.fillStyle = this.fontcolor;}
					else if(bd.cell[c].qans >0)  { g.fillStyle = this.fontAnscolor;}

					// ��������̕`��
					if(dir===k.UP){
						if(this.vnop(headers[0]+c,1)){
							this.inputPath([ax,ay ,0,-(ll/2) ,-head2,-head1 ,-lw/2,-head1 ,-lw/2,ll/2 ,lw/2,ll/2 ,lw/2,-head1 ,head2,-head1], true);
							g.fill();
						}
					}
					else{ this.vhide([headers[0]+c]);}

					// ���������̕`��
					if(dir===k.DN){
						if(this.vnop(headers[1]+c,1)){
							this.inputPath([ax,ay ,0,(ll/2) ,-head2,head1 ,-lw/2,head1 ,-lw/2,-ll/2 ,lw/2,-ll/2 ,lw/2,head1 ,head2,head1], true);
							g.fill();
						}
					}
					else{ this.vhide([headers[1]+c]);}

					// ���������̕`��
					if(dir===k.LT){
						if(this.vnop(headers[2]+c,1)){
							this.inputPath([ax,ay ,-(ll/2),0 ,-head1,-head2 ,-head1,-lw/2 ,ll/2,-lw/2 ,ll/2,lw/2 ,-head1,lw/2 ,-head1,head2], true);
							g.fill();
						}
					}
					else{ this.vhide([headers[2]+c]);}

					// �E�������̕`��
					if(dir===k.RT){
						if(this.vnop(headers[3]+c,1)){
							this.inputPath([ax,ay ,(ll/2),0 ,head1,-head2 ,head1,-lw/2 ,-ll/2,-lw/2 ,-ll/2,lw/2 ,head1,lw/2 ,head1,head2], true);
							g.fill();
						}
					}
					else{ this.vhide([headers[3]+c]);}
				}
				else{
					this.vhide([headers[0]+c, headers[1]+c, headers[2]+c, headers[3]+c]);
				}
			}
			this.vinc();
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type){
			this.decodeBorder();
			this.decodeNumber10();
		};
		enc.pzlexport = function(type){
			this.encodeBorder();
			this.encodeNumber10();
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			this.decodeAreaRoom();
			this.decodeCellQnum();
			this.decodeCellQanssub();
		};
		fio.encodeData = function(){
			this.encodeAreaRoom();
			this.encodeCellQnum();
			this.encodeCellQanssub();
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			var rinfo = area.getRoomInfo();
			if( !this.checkAllArea(rinfo, ans.isObject, function(w,h,a,n){ return (a<=1);}) ){
				this.setAlert('1�̍���2�ȏ�̖�󂪓����Ă��܂��B','A country has plural arrows.'); return false;
			}

			var ainfo = ans.getPairedArrows();
			if( !this.checkAdjacentCountries(rinfo, ainfo) ){
				this.setAlert('�ӂ����L���鍑�Ƀy�A�ƂȂ��󂪓����Ă��܂��B','There are paired arrows in adjacent countries.'); return false;
			}

			if( !this.checkDirectionOfArrow(ainfo) ){
				this.setAlert('���̐�Ƀy�A�ƂȂ��󂪂��܂���B','There is not paired arrow in the direction of an arrow.'); return false;
			}

			if( !this.checkAllArea(rinfo, ans.isObject, function(w,h,a,n){ return (a>=1);}) ){
				this.setAlert('���ɖ�󂪓����Ă��܂���B','A country has no arrow.'); return false;
			}

			return true;
		};

		ans.isObject = function(c){ return (c!==-1 && (bd.cell[c].direc!==0 || bd.cell[c].qans!==-1));};

		ans.getPairedArrows = function(){
			var ainfo=[], check=[];
			for(var c=0;c<bd.cellmax;c++){ check[c]=(ans.isObject(c)?0:-1);}
			for(var c=0;c<bd.cellmax;c++){
				if(check[c]!==0){ continue;}
				var cx=bd.cell[c].cx, cy=bd.cell[c].cy, tc=c,
					dir=(bd.cell[c].direc!==0 ? bd.cell[c].direc : bd.cell[c].qans);

				while(1){
					switch(dir){ case k.UP: cy--; break; case k.DN: cy++; break; case k.LT: cx--; break; case k.RT: cx++; break;}
					tc = bd.cnum(cx,cy);
					if(tc===-1){ ainfo.push([c]); break;}
					if(tc!==-1 && check[tc]!==-1){
						var tdir = (bd.cell[tc].direc!==0 ? bd.cell[tc].direc : bd.cell[tc].qans);
						if(tdir!==[0,k.DN,k.UP,k.RT,k.LT][dir]){ ainfo.push([c]);}
						else{ ainfo.push([c,tc]);}
						break;
					}
				}
			}
			return ainfo;
		};

		ans.checkDirectionOfArrow = function(ainfo){
			var result = true;
			for(var i=0;i<ainfo.length;i++){
				if(ainfo[i].length===1){
					bd.sErC(ainfo[i],1);
					result = false;
				}
			}
			return result;
		};
		ans.checkAdjacentCountries = function(rinfo, ainfo){
			// �אڃG���A�����擾����
			var adjs = [];
			for(var r=1;r<=rinfo.max-1;r++){
				adjs[r] = [];
				for(var s=r+1;s<=rinfo.max;s++){ adjs[r][s]=0;}
			}
			for(var id=0;id<bd.bdmax;id++){
				if(!bd.isBorder(id)){ continue;}
				var cc1=bd.cc1(id), cc2=bd.cc2(id);
				if(cc1==-1 || cc2==-1){ continue;}
				var r1=rinfo.id[cc1], r2=rinfo.id[cc2];
				try{
					if(r1<r2){ adjs[r1][r2]++;}
					if(r1>r2){ adjs[r2][r1]++;}
				}catch(e){ alert([r1,r2]); throw 0;}
			}

			// ����������ۂ̔���
			var result = true;
			for(var i=0;i<ainfo.length;i++){
				var r1 = rinfo.id[ainfo[i][0]], r2 = rinfo.id[ainfo[i][1]];
				if((r1<r2 ? adjs[r1][r2] : adjs[r2][r1])>0){
					bd.sErC(rinfo.room[r1].idlist,1);
					bd.sErC(rinfo.room[r2].idlist,1);
					result = false;
				}
			}
			return result;
		};
	}
};
