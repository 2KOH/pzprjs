//
// �p�Y���ŗL�X�N���v�g�� ��������ȂȂ߁E�֐ؔ� wagiri.js v3.3.0
//
Puzzles.wagiri = function(){ };
Puzzles.wagiri.prototype = {
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

		k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

		//k.def_csize = 36;
		//k.def_psize = 24;
		//k.area = { bcell:0, wcell:0, number:0};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		base.setTitle("��������ȂȂ߁E�֐�","Gokigen-naname:wagiri");
		base.setExpression("�@�}�E�X�Ŏΐ�����͂ł��܂��B",
						   " Click to input slashes.");
		base.setFloatbgcolor("rgb(0, 127, 0)");
		base.proto = 1;
	},
	menufix : function(){
		menu.addUseToFlags();

		pp.addCheck('colorslash','setting',false, '�ΐ��̐F����', 'Slash with color');
		pp.setLabel('colorslash', '�ΐ���֐؂肩�̂ǂ��炩�ŐF��������(���d��)', 'Encolor slashes whether it consists in a loop or not.(Too busy)');
		pp.funcs['colorslash'] = function(){ pc.paintAll();};
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
			if(k.playmode){ this.inputslash();}
			else if(k.editmode){
				if(!kp.enabled()){ this.inputquestion();}
				else{ kp.display();}
			}
		};
		mv.mouseup = function(){ };
		mv.mousemove = function(){ };

		mv.inputquestion = function(){
			var pos = this.crosspos(0.33);
			if(pos.x<tc.minx || tc.maxx<pos.x || pos.y<tc.miny || tc.maxy<pos.y){ return;}
			if(!(pos.x&1) && !(pos.y&1)){
				this.inputcross();
			}
			else if((pos.x&1) && (pos.y&1)){
				var cc = this.cellid();
				if(cc!==tc.getTCC()){
					var tcx = tc.cursolx, tcy = tc.cursoly;
					tc.setTCC(cc);
					pc.paint((tcx>>1)-1, (tcy>>1)-1, (tcx>>1)+1, (tcy>>1)+1);
					pc.paint((pos.x>>1)-1, (pos.y>>1)-1, pos.x>>1, pos.y>>1);
				}
				else if(cc!=-1){
					var trans = (this.btn.Left ? [-1,1,0,2,-2] : [2,-2,0,-1,1]);
					bd.sQnC(cc,trans[bd.QnC(cc)+2]);
					pc.paintCell(cc);
				}
			}
			else{
				var id = bd.bnum(pos.x, pos.y);
				if(id!==tc.getTBC()){
					var tcx = tc.cursolx, tcy = tc.cursoly;
					tc.setTCP(pos);
					pc.paint((tcx>>1)-1, (tcy>>1)-1, (tcx>>1)+1, (tcy>>1)+1);
					pc.paint((pos.x>>1)-1, (pos.y>>1)-1, pos.x>>1, pos.y>>1);
				}
			}
		};

		mv.inputslash = function(){
			var cc = this.cellid();
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
			if(k.playmode){ return;}
			if(this.moveTBorder(ca)){ return;}
			this.key_wagiri(ca);
		};
		kc.key_wagiri = function(ca){
			var pos = tc.getTCP();
			if(!(pos.x&1)&&!(pos.y&1)){
				this.key_inputcross(ca);
			}
			else if((pos.x&1)&&(pos.y&1)){
				var cc = tc.getTCC(), val = 0;
				if     (ca=='1'){ val= 1;}
				else if(ca=='2'){ val= 2;}
				else if(ca=='-'){ val=-2;}
				else if(ca==' '){ val=-1;}

				if(cc!==-1 && val!==0){
					bd.sQnC(cc,(bd.QnC(cc)!==val?val:-1));
					pc.paintCell(cc);
				}
			}
		};

		menu.ex.adjustSpecial = function(type,key){
			um.disableRecord();
			if(type>=1 && type<=4){ // ���]�E��]�S��
				for(var c=0;c<bd.cellmax;c++){ if(bd.QaC(c)!=-1){ bd.sQaC(c,{1:2,2:1}[bd.QaC(c)]); } }
			}
			um.enableRecord();
		};

		tc.minx = 0;
		tc.miny = 0;
		tc.maxx = 2*k.qcols;
		tc.maxy = 2*k.qrows;
		tc.setTXC(0);

		bd.maxnum = 4;
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_DLIGHT;
		pc.errcolor1 = "red";
		pc.errcolor2 = "rgb(0, 0, 127)";

		pc.crosssize = 0.33;
		pc.chassisflag = false;

		pc.paint = function(x1,y1,x2,y2){
			if(!ans.errDisp && pp.getVal('colorslash')){ x1=0; y1=0; x2=k.qcols-1; y2=k.qrows-1;}

			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawBGCells(x1,y1,x2,y2);
			this.drawDashedGrid(x1,y1,x2,y2);

			this.dispLetters_wagiri(x1,y1,x2,y2);
			this.drawSlashes(x1,y1,x2,y2);

			this.drawCrosses(x1,y1,x2+1,y2+1);
			this.drawTarget_wagiri(x1,y1,x2,y2);
		};

		// �I�[�o�[���C�h
		pc.setBGCellColor = function(c){
			if(bd.cell[c].qans===-1 && bd.cell[c].error===1){
				g.fillStyle = this.errbcolor1;
				return true;
			}
			return false;
		};

		pc.dispLetters_wagiri = function(x1,y1,x2,y2){
			var clist = this.cellinside(x1,y1,x2,y2);
			for(var i=0;i<clist.length;i++){
				var id = clist[i];
				var num = bd.cell[id].qnum, obj = bd.cell[id];
				if(num>=1 && num<=2){ text = ({1:"��",2:"��"})[num];}
				else if(num===-2){ text = "?";}
				else{ this.hideEL(obj.numobj); continue;}

				if(!obj.numobj){ obj.numobj = this.CreateDOMAndSetNop();}
				this.dispnum(obj.numobj, 1, text, 0.70, this.getNumberColor(id), obj.px, obj.py);
			}
		};

		pc.drawSlashes = function(x1,y1,x2,y2){
			var headers = ["c_sl1_", "c_sl2_"], check=[];
			g.lineWidth = (mf(k.cwidth/8)>=2?mf(k.cwidth/8):2);

			if(!ans.errDisp && pp.getVal('colorslash')){
				var sdata=ans.getSlashData();
				for(var c=0;c<bd.cellmax;c++){ if(sdata[c]>0){ bd.sErC([c],sdata[c]);} }
			}

			var clist = this.cellinside(x1,y1,x2,y2);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];

				if(bd.cell[c].qans!=-1){
					if     (bd.cell[c].error==1){ g.strokeStyle = this.errcolor1;}
					else if(bd.cell[c].error==2){ g.strokeStyle = this.errcolor2;}
					else                        { g.strokeStyle = this.Cellcolor;}

					if(bd.cell[c].qans==1){
						if(this.vnop(headers[0]+c,this.STROKE)){
							g.setOffsetLinePath(bd.cell[c].px,bd.cell[c].py, 0,0, k.cwidth,k.cheight, true);
							g.stroke();
						}
					}
					else{ this.vhide(headers[0]+c);}

					if(bd.cell[c].qans==2){
						if(this.vnop(headers[1]+c,this.STROKE)){
							g.setOffsetLinePath(bd.cell[c].px,bd.cell[c].py, k.cwidth,0, 0,k.cheight, true);
							g.stroke();
						}
					}
					else{ this.vhide(headers[1]+c);}
				}
				else{ this.vhide([headers[0]+c, headers[1]+c]);}
			}
			this.vinc();

			if(!ans.errDisp && pp.getVal('colorslash')){
				for(var c=0;c<bd.cellmax;c++){ if(sdata[c]>0){ bd.sErC([c],0);} }
			}
		};

		pc.drawTarget_wagiri = function(x1,y1,x2,y2){
			if(k.playmode){
				this.hideTCell();
				this.hideTCross();
				this.hideTBorder();
			}
			else if((tc.cursolx&1)&&(tc.cursoly&1)){
				this.drawTCell(x1-1,y1-1,x2+1,y2+1);
				this.hideTCross();
				this.hideTBorder();
			}
			else if(!(tc.cursolx&1)&&!(tc.cursoly&1)){
				this.hideTCell();
				this.drawTCross(x1-1,y1-1,x2+1,y2+1);
				this.hideTBorder();
			}
			else{
				this.hideTCell();
				this.hideTCross();
				this.drawTBorder(x1-1,y1-1,x2+1,y2+1);
			}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type){
			this.decode4Cross();
			this.decodeNumber10();
		};
		enc.pzlexport = function(type){
			this.encode4Cross();
			this.encodeNumber10();
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			this.decodeCrossNum();
			this.decodeCellQnum();
			this.decodeCellQanssub();
		};
		fio.encodeData = function(){
			this.encodeCrossNum();
			this.encodeCellQnum();
			this.encodeCellQanssub();
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			var sdata=this.getSlashData();
			if( !this.checkLoopLine(sdata, false) ){
				this.setAlert('"��"���܂܂ꂽ�����ւ����ɂȂ��Ă��܂��B', 'There is a loop that consists "��".'); return false;
			}

			if( !this.checkQnumCross() ){
				this.setAlert('�����Ɍq������̐����Ԉ���Ă��܂��B', 'A number is not equal to count of lines that is connected to it.'); return false;
			}

			if( !this.checkLoopLine(sdata, true) ){
				this.setAlert('"��"���܂܂ꂽ�����ւ����ɂȂ��Ă��܂���B', 'There is not a loop that consists "��".'); return false;
			}

			if( !this.checkAllCell(function(c){ return (bd.QaC(c)==-1);}) ){
				this.setAlert('�ΐ����Ȃ��}�X������܂��B','There is a empty cell.'); return false;
			}

			return true;
		};

		ans.getSlashData = function(){
			var check=[], scnt=this.getScnt();
			for(var c=0;c<bd.cellmax;c++) { check[c] =(bd.QaC(c)!==-1?0:-1);}
			for(var c=0;c<bd.cellmax;c++){
				if(check[c]!==0){ continue;}
				// history -> �X�^�b�N�݂����ȃI�u�W�F�N�g
				var history={cell:[],cross:[]};
				for(var cc=0;cc<bd.cellmax;cc++) { history.cell[cc] =(check[cc]!==-1?0:-1);}
				for(var xc=0;xc<bd.crossmax;xc++){ history.cross[xc]=(scnt[xc]>0    ?0:-1);}

				var fc = bd.xnum(bd.cell[c].cx+(bd.QaC(c)===1?0:1), bd.cell[c].cy);
				this.sp0(fc, 1, scnt, check, history);
			}
			for(var c=0;c<bd.cellmax;c++) { if(check[c]===0){ check[c]=2;} }
			return check;
		};
		ans.sp0 = function(xc, depth, scnt, check, history){
			// �߂��������n�_�ɓ��B���������̒n�_����R�R�܂ł̓��[�v���Ă�
			if(history.cross[xc]>0){
				var min = history.cross[xc];
				for(var cc=0;cc<bd.cellmax;cc++){ if(history.cell[cc]>=min){ check[cc]=1;} }
				return;
			}

			// �ʂɓ��B���Ă��Ȃ� -> �ׂɐi��ł݂�
			history.cross[xc] = depth; // ���̌�_�Ƀ}�[�L���O
			var xx=bd.cross[xc].cx, xy=bd.cross[xc].cy, isloop=false;
			var nb = [
					{ cell:bd.cnum(xx-1,xy-1), cross:bd.xnum(xx-1,xy-1), qans:1},
					{ cell:bd.cnum(xx  ,xy-1), cross:bd.xnum(xx+1,xy-1), qans:2},
					{ cell:bd.cnum(xx-1,xy  ), cross:bd.xnum(xx-1,xy+1), qans:2},
					{ cell:bd.cnum(xx  ,xy  ), cross:bd.xnum(xx+1,xy+1), qans:1}
				];
			for(var i=0;i<4;i++){
				if( nb[i].cell===-1 ||					// �������͔Ֆʂ̊O����I
					history.cell[nb[i].cell]!==0 ||		// �������͒ʂ��ė���������I
					nb[i].qans!==bd.QaC(nb[i].cell) ||	// �������͌q�����ĂȂ��B
					scnt[nb[i].cross]===1 || 			// �������͍s���~�܂�B
					check[nb[i].cell]===1 )		// check��1�ɂȂ��Ă���Ă��Ƃ͑O�ɂ�����������ɗ��Ă���
				{ continue;}					// ��ɕ��򂪂���Ƃ��Ă��A���̎��ɒT���ς݂ł�.

				history.cell[nb[i].cell] = depth;	 // �ׂ̃Z���Ƀ}�[�L���O
				this.sp0(nb[i].cross, depth+1, scnt, check, history);
				history.cell[nb[i].cell] = 0;		 // �Z���̃}�[�L���O���O��
			}
			history.cross[xc] = 0; // ��_�̃}�[�L���O���O��
		};

		ans.checkLoopLine = function(sdata, checkLoop){
			var result = true;
			for(var c=0;c<bd.cellmax;c++){
				if(!checkLoop && sdata[c]==1 && bd.QnC(c)===2){ result = false;}
				if( checkLoop && sdata[c]==2 && bd.QnC(c)===1){ result = false;}
			}
			if(!result){ for(var c=0;c<bd.cellmax;c++){ if(sdata[c]>0){ bd.sErC([c],sdata[c]);} } }
			return result;
		};

		ans.checkQnumCross = function(){
			var result = true, scnt = this.getScnt();
			for(var c=0;c<bd.crossmax;c++){
				var qn = bd.QnX(c);
				if(qn>=0 && qn!=scnt[c]){
					if(this.inAutoCheck){ return false;}
					bd.sErX([c],1);
					result = false;
				}
			}
			return result;
		};

		ans.getScnt = function(){
			var scnt = [];
			for(var c=0;c<bd.crossmax;c++){ scnt[c]=0;}
			for(var c=0;c<bd.cellmax;c++){
				var cx=c%k.qcols, cy=(c/k.qcols)|0;
				if(bd.QaC(c)===1){
					scnt[cx+cy*(k.qcols+1)]++;
					scnt[(cx+1)+(cy+1)*(k.qcols+1)]++;
				}
				else if(bd.QaC(c)===2){
					scnt[cx+(cy+1)*(k.qcols+1)]++;
					scnt[(cx+1)+cy*(k.qcols+1)]++;
				}
			}
			return scnt;
		};
	}
};
