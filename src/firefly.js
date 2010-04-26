//
// �p�Y���ŗL�X�N���v�g�� �z�^���r�[���� firefly.js v3.3.0
//
Puzzles.firefly = function(){ };
Puzzles.firefly.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
		k.irowake  = 1;		// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross  = 0;		// 1:�Ֆʓ�����Cross������p�Y�� 2:�O�g����܂߂�Cross������p�Y��
		k.isborder = 1;		// 1:Border/Line������\�ȃp�Y�� 2:�O�g�������\�ȃp�Y��
		k.isexcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isLineCross     = false;	// ������������p�Y��
		k.isCenterLine    = true;	// �}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = false;	// ���E����line�Ƃ��Ĉ���
		k.hasroom         = false;	// �������̗̈�ɕ�����Ă���/������p�Y��
		k.roomNumber      = false;	// �����̖��̐�����1��������p�Y��

		k.dispzero        = true;	// 0��\�����邩�ǂ���
		k.isDispHatena    = false;	// qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber     = false;	// �񓚂ɐ�������͂���p�Y��
		k.NumberWithMB    = false;	// �񓚂̐����Ɓ��~������p�Y��
		k.linkNumber      = false;	// �������ЂƂȂ���ɂȂ�p�Y��

		k.BlackCell       = false;	// ���}�X����͂���p�Y��
		k.NumberIsWhite   = false;	// �����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell     = false;	// �A�����f�ւ̃p�Y��
		k.checkBlackCell  = false;	// ��������ō��}�X�̏����`�F�b�N����p�Y��
		k.checkWhiteCell  = false;	// ��������Ŕ��}�X�̏����`�F�b�N����p�Y��

		k.bdmargin       = 0.50;	// �g�O�̈�ӂ�margin(�Z�������Z)
		k.bdmargin_image = 0.10;	// �摜�o�͎���bdmargin�l

		if(k.EDITOR){
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
		mv.mousedown = function(){
			if(k.editmode) this.inputdirec();
			else if(k.playmode){
				if(this.btn.Left) this.inputLine();
				else if(this.btn.Right) this.inputpeke();
			}
		};
		mv.mouseup = function(){
			if(k.editmode && this.notInputted() && bd.cnum(this.mouseCell.x,this.mouseCell.y)==this.cellid()) this.inputqnum();
		};
		mv.mousemove = function(){
			if(k.editmode){
				if(this.notInputted()) this.inputdirec();
			}
			else if(k.playmode){
				if(this.btn.Left) this.inputLine();
				else if(this.btn.Right) this.inputpeke();
			}
		};
		mv.enableInputHatena = true;

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.playmode){ return;}
			if(this.key_inputdirec(ca)){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca);
		};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_LIGHT;

		pc.fontErrcolor = pc.fontcolor;
		pc.fontsizeratio = 0.85;

		pc.paint = function(x1,y1,x2,y2){
			this.drawDashedCenterLines(x1,y1,x2,y2);
			this.drawLines(x1,y1,x2,y2);

			this.drawPekes(x1,y1,x2,y2,0);

			this.drawFireflies(x1,y1,x2,y2);
			this.drawNumbers(x1,y1,x2,y2);

			this.drawTarget(x1,y1,x2,y2);
		};

		pc.drawFireflies = function(x1,y1,x2,y2){
			this.vinc('cell_firefly', 'auto');

			var clist = bd.cellinside(x1-2,y1-2,x2+2,y2+2);
			for(var i=0;i<clist.length;i++){ this.drawFirefly1(clist[i]);}
		};
		pc.drawFirefly1 = function(c){
			if(c===-1){ return;}

			var rsize  = this.cw*0.40;
			var rsize3 = this.cw*0.10;
			var headers = ["c_cira_", "c_cirb_"];

			if(bd.cell[c].qnum!=-1){
				var px=bd.cell[c].cpx, py=bd.cell[c].cpy;

				g.lineWidth = 1.5;
				g.strokeStyle = this.cellcolor;
				g.fillStyle = (bd.cell[c].error===1 ? this.errbcolor1 : "white");
				if(this.vnop(headers[0]+c,this.FILL)){
					g.shapeCircle(px, py, rsize);
				}

				this.vdel([headers[1]+c]);
				if(bd.cell[c].direc!=0){
					g.fillStyle = this.cellcolor;
					switch(bd.cell[c].direc){
						case k.UP: py-=(rsize-1); break;
						case k.DN: py+=(rsize-1); break;
						case k.LT: px-=(rsize-1); break;
						case k.RT: px+=(rsize-1); break;
					}
					if(this.vnop(headers[1]+c,this.NONE)){
						g.fillCircle(px, py, rsize3);
					}
				}
			}
			else{ this.vhide([headers[0]+c, headers[1]+c]);}
		};

		line.repaintParts = function(idlist){
			var clist = this.getClistFromIdlist(idlist);
			for(var i=0;i<clist.length;i++){
				pc.drawFirefly1(clist[i]);
				pc.drawNumber1(clist[i]);
			}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type){
			this.decodeArrowNumber16();
		};
		enc.pzlexport = function(type){
			this.encodeArrowNumber16();
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			this.decodeCellDirecQnum();
			this.decodeBorderLine();
		};
		fio.encodeData = function(){
			this.encodeCellDirecQnum();
			this.encodeBorderLine();
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

			var errinfo = this.searchFireflies();
			if( !this.checkErrorFlag(errinfo,3) ){
				this.setAlert('���_���m�����Ōq�����Ă��܂��B', 'Black points are connected each other.'); return false;
			}
			if( !this.checkErrorFlag(errinfo,2) ){
				this.setAlert('���̋Ȃ������񐔂������ƈ���Ă��܂��B', 'The number of curves is different from a firefly\'s number.'); return false;
			}
			if( !this.checkErrorFlag(errinfo,1) ){
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

			if( !this.checkStrangeLine(errinfo) ){
				this.setAlert('���ۂ́A���_�łȂ������ǂ������������Ă��܂��B', 'Fireflies are connected without a line starting from black point.'); return false;
			}

			bd.sErBAll(0);
			return true;
		};
		ans.check1st = function(){ return true;};

		ans.checkLcntCell = function(val){
			var result = true;
			if(line.ltotal[val]==0){ return true;}
			for(var c=0;c<bd.cellmax;c++){
				if(bd.QnC(c)==-1 && line.lcntCell(c)==val){
					if(this.inAutoCheck){ return false;}
					if(result){ bd.sErBAll(2);}
					ans.setCellLineError(c,false);
					result = false;
				}
			}
			return result;
		};
		ans.checkFireflyBeam = function(){
			var result = true;
			for(var c=0;c<bd.cellmax;c++){
				if(bd.QnC(c)==-1 || bd.DiC(c)==0){ continue;}
				if((bd.DiC(c)==k.UP && !bd.isLine(bd.ub(c))) || (bd.DiC(c)==k.DN && !bd.isLine(bd.db(c))) ||
				   (bd.DiC(c)==k.LT && !bd.isLine(bd.lb(c))) || (bd.DiC(c)==k.RT && !bd.isLine(bd.rb(c))) )
				{
					if(this.inAutoCheck){ return false;}
					bd.sErC([c],1);
					result = false;
				}
			}
			return result;
		};
		ans.checkStrangeLine = function(errinfo){
			var idlist = [];
			for(var id=0;id<bd.bdmax;id++){
				if(bd.isLine(id) && errinfo.check[id]!=2){ idlist.push(id);}
			}
			if(idlist.length>0){
				bd.sErBAll(2);
				bd.sErB(idlist,1);
				return false;
			}
			return true;
		};

		ans.searchFireflies = function(){
			var errinfo={data:[],check:[]};
			for(var i=0;i<bd.bdmax;i++){ errinfo.check[i]=0;}

			for(var c=0;c<bd.cellmax;c++){
				if(bd.QnC(c)==-1 || bd.DiC(c)==0){ continue;}

				var ccnt=0;
				var idlist = [];
				var dir=bd.DiC(c);
				var bx=bd.cell[c].bx, by=bd.cell[c].by;
				while(1){
					switch(dir){ case 1: by--; break; case 2: by++; break; case 3: bx--; break; case 4: bx++; break;}
					if(!((bx+by)&1)){
						var cc = bd.cnum(bx,by);
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

				for(var i=0;i<idlist.length;i++){ errinfo.check[idlist[i]]=2;}

				var cc = bd.cnum(bx,by);
				if(((bd.DiC(cc)==k.UP && dir==k.DN) || (bd.DiC(cc)==k.DN && dir==k.UP) ||
					(bd.DiC(cc)==k.LT && dir==k.RT) || (bd.DiC(cc)==k.RT && dir==k.LT) ) && (!((bx+by)&1)))
				{
					errinfo.data.push({errflag:3,cells:[c,cc],idlist:idlist}); continue;
				}
				if(idlist.length>0 && (!((bx+by)&1)) && bd.QnC(c)!=-2 && bd.QnC(c)!=ccnt){
					errinfo.data.push({errflag:2,cells:[c],idlist:idlist}); continue;
				}
				if(idlist.length>0 && ((bx+by)&1)){
					errinfo.data.push({errflag:1,cells:[c],idlist:idlist}); continue;
				}
			}
			return errinfo;
		};
		ans.checkErrorFlag = function(errinfo, val){
			var result = true;
			for(var i=0,len=errinfo.data.length;i<len;i++){
				if(errinfo.data[i].errflag!=val){ continue;}

				if(this.inAutoCheck){ return false;}
				bd.sErC(errinfo.data[i].cells,1);
				if(result){ bd.sErBAll(2);}
				bd.sErB(errinfo.data[i].idlist,1);
				result = false;
			}
			return result;
		};
	}
};
