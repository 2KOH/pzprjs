//
// �p�Y���ŗL�X�N���v�g�� �z�^���r�[���� firefly.js v3.2.2
//
Puzzles.firefly = function(){ };
Puzzles.firefly.prototype = {
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
		k.isCenterLine    = 1;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
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

		k.fstruct = ["celldirecnum","borderline"];

		//k.def_csize = 36;
		k.def_psize = 16;
		//k.area = { bcell:0, wcell:0, number:0};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		if(k.callmode=="pmake"){
			base.setExpression("�@���_�́A�}�E�X�̍��h���b�O���ASHIFT�����Ȃ�����L�[�œ��͂ł��܂��B",
							   " To input black marks, Left Button Drag or Press arrow key with SHIFT key.");
		}
		else{
			base.setExpression("�@���h���b�O�ŋ��E�����A�E�h���b�O�ŕ⏕�L�������͂ł��܂��B",
							   " Left Button Drag to input border lines, Right to input auxiliary marks.");
		}
		base.setTitle("�z�^���r�[��", 'Hotaru Beam'); //'Glow of Fireflies');
		base.setFloatbgcolor("rgb(0, 224, 0)");
	},
	menufix : function(){ },

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(k.mode==1) this.inputdirec(x,y);
			else if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};
		mv.mouseup = function(x,y){
			if(k.mode==1 && this.notInputted() && bd.cnum(this.mouseCell.x,this.mouseCell.y)==this.cellid(new Pos(x,y))) this.inputqnum(x,y,99);
		};
		mv.mousemove = function(x,y){
			if(k.mode==1){
				if(this.notInputted()) this.inputdirec(x,y);
			}
			else if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.mode==3){ return;}
			if(this.key_inputdirec(ca)){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca,99);
		};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_LIGHT;

		pc.fontErrcolor = pc.fontcolor;
		pc.fontsizeratio = 0.85;

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawDashLines(x1,y1,x2,y2);
			this.drawLines(x1,y1,x2,y2);

			this.drawPekes(x1,y1,x2,y2,0);

			this.drawNumCells_firefly(x1,y1,x2,y2);

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};

		pc.drawNumCells_firefly = function(x1,y1,x2,y2){
			var rsize  = k.cwidth*0.40;
			var rsize2 = k.cwidth*0.36;
			var rsize3 = k.cwidth*0.10;

			var clist = this.cellinside(x1-2,y1-2,x2+2,y2+2,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.QnC(c)!=-1){
					var px=bd.cell[c].px+mf(k.cwidth/2), py=bd.cell[c].py+mf(k.cheight/2);

					g.fillStyle = this.Cellcolor;
					g.beginPath();
					g.arc(px, py, rsize , 0, Math.PI*2, false);
					if(this.vnop("c"+c+"_cira_",1)){ g.fill(); }

					if(bd.ErC(c)==1){ g.fillStyle = this.errbcolor1;}
					else{ g.fillStyle = "white";}
					g.beginPath();
					g.arc(px, py, rsize2, 0, Math.PI*2, false);
					if(this.vnop("c"+c+"_cirb_",1)){ g.fill(); }

					this.vdel("c"+c+"_circ_");
					g.fillStyle = this.Cellcolor;
					switch(bd.DiC(c)){
						case 1: py-=(rsize-1); break;
						case 2: py+=(rsize-1); break;
						case 3: px-=(rsize-1); break;
						case 4: px+=(rsize-1); break;
					}
					if(bd.DiC(c)!=0){
						g.beginPath();
						g.arc(px, py, rsize3 , 0, Math.PI*2, false);
						if(this.vnop("c"+c+"_circ_",1)){ g.fill();}
					}
				}
				else{ this.vhide(["c"+c+"_cira_","c"+c+"_cirb_"]); this.vdel("c"+c+"_circ_");}

				this.dispnumCell_General(c);
			}
			this.vinc();
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==0 || type==1){ bstr = this.decodeArrowNumber16(bstr);}
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			return "/"+k.qcols+"/"+k.qrows+"/"+this.encodeArrowNumber16();
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkLcntCell(3) ){
				this.setAlert('���򂵂Ă����������܂��B', 'There is a branch line.'); return false;
			}
			if( !this.checkLcntCell(4) ){
				this.setAlert('�����������Ă��܂��B', 'There is a crossing line.'); return false;
			}

			var saved = this.checkFireflies();
			if( !this.checkErrorFlag(saved,3) ){
				this.setAlert('���_���m�����Ōq�����Ă��܂��B', 'Black points are connected each other.'); return false;
			}
			if( !this.checkErrorFlag(saved,2) ){
				this.setAlert('���̋Ȃ������񐔂������ƈ���Ă��܂��B', 'The number of curves is different from a firefly\'s number.'); return false;
			}
			if( !this.checkErrorFlag(saved,1) ){
				this.setAlert('�����r���œr�؂�Ă��܂��B', 'There is a dead-end line.'); return false;
			}

			this.performAsLine = true;
			if( !this.checkOneArea( line.getLareaInfo() ) ){
				this.setAlert('�����S�̂ň�Ȃ���ɂȂ��Ă��܂���B', 'All lines and fireflies are not connected each other.'); return false;
			}

			if( !this.checkLcntCell(1) ){
				this.setAlert('�����r���œr�؂�Ă��܂��B', 'There is a dead-end line.'); return false;
			}

			if( !this.checkFireflyBeam() ){
				this.setAlert('�z�^����������o�Ă��܂���B', 'There is a lonely firefly.'); return false;
			}

			if( !this.checkStrangeLine(saved) ){
				this.setAlert('���ۂ́A���_�łȂ������ǂ������������Ă��܂��B', 'Fireflies are connected without a line starting from black point.'); return false;
			}

			bd.sErB(bd.borders,0);
			return true;
		};
		ans.check1st = function(){ return true;};

		ans.checkLcntCell = function(val){
			if(line.ltotal[val]==0){ return true;}
			for(var c=0;c<bd.cell.length;c++){
				if(bd.QnC(c)==-1 && line.lcntCell(c)==val){
					bd.sErB(bd.borders,2);
					ans.setCellLineError(c,false);
					return false;
				}
			}
			return true;
		};
		ans.checkFireflyBeam = function(){
			for(var c=0;c<bd.cell.length;c++){
				if(bd.QnC(c)==-1 || bd.DiC(c)==0){ continue;}
				if((bd.DiC(c)==1 && !bd.isLine(bd.ub(c))) || (bd.DiC(c)==2 && !bd.isLine(bd.db(c))) ||
				   (bd.DiC(c)==3 && !bd.isLine(bd.lb(c))) || (bd.DiC(c)==4 && !bd.isLine(bd.rb(c))) )
				{
					bd.sErC([c],1);
					return false;
				}
			}
			return true;
		};
		ans.checkStrangeLine = function(saved){
			var idlist = [];
			for(var id=0;id<bd.border.length;id++){
				if(bd.isLine(id) && saved.check[id]!=2){ idlist.push(id);}
			}
			if(idlist.length>0){
				bd.sErB(bd.borders,2);
				bd.sErB(idlist,1);
				return false;
			}
			return true;
		};

		ans.checkFireflies = function(){
			var saved = {errflag:0,cells:[],idlist:[],check:[]};
			for(var i=0;i<bd.border.length;i++){ saved.check[i]=0;}

			for(var c=0;c<bd.cell.length;c++){
				if(bd.QnC(c)==-1 || bd.DiC(c)==0){ continue;}

				var ccnt=0;
				var idlist = [];
				var dir=bd.DiC(c);
				var bx=bd.cell[c].cx*2+1, by=bd.cell[c].cy*2+1;
				while(1){
					switch(dir){ case 1: by--; break; case 2: by++; break; case 3: bx--; break; case 4: bx++; break;}
					if((bx+by)%2==0){
						var cc = bd.cnum(mf(bx/2),mf(by/2));
						if     (bd.QnC(cc)!=-1){ break;}
						else if(dir!=1 && bd.isLine(bd.bnum(bx,by+1))){ if(dir!=2){ ccnt++;} dir=2;}
						else if(dir!=2 && bd.isLine(bd.bnum(bx,by-1))){ if(dir!=1){ ccnt++;} dir=1;}
						else if(dir!=3 && bd.isLine(bd.bnum(bx+1,by))){ if(dir!=4){ ccnt++;} dir=4;}
						else if(dir!=4 && bd.isLine(bd.bnum(bx-1,by))){ if(dir!=3){ ccnt++;} dir=3;}
					}
					else{
						var id = bd.bnum(bx,by);
						if(!bd.isLine(id)){ break;}
						idlist.push(id);
					}
				}

				for(var i=0;i<idlist.length;i++){ saved.check[idlist[i]]=2;}

				var cc = bd.cnum(mf(bx/2),mf(by/2));
				if(idlist.length>0 && (bx+by)%2==1 && saved.errflag==0){
					saved = {errflag:1,cells:[c],idlist:idlist,check:saved.check};
				}
				else if(idlist.length>0 && (bx+by)%2==0 && bd.QnC(c)!=-2 && bd.QnC(c)!=ccnt && saved.errflag<=1){
					saved = {errflag:2,cells:[c],idlist:idlist,check:saved.check};
				}
				else if(((bd.DiC(cc)==1 && dir==2) || (bd.DiC(cc)==2 && dir==1) ||
						 (bd.DiC(cc)==3 && dir==4) || (bd.DiC(cc)==4 && dir==3) ) && (bx+by)%2==0 && saved.errflag<=2 )
				{
					saved = {errflag:3,cells:[c,cc],idlist:idlist,check:saved.check};
					return saved;
				}
			}
			return saved;
		};
		ans.checkErrorFlag = function(saved, val){
			if(saved.errflag==val){
				bd.sErC(saved.cells,1);
				bd.sErB(bd.borders,2);
				bd.sErB(saved.idlist,1);
				return false;
			}
			return true;
		};
	}
};
