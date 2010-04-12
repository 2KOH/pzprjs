//
// �p�Y���ŗL�X�N���v�g�� ���W�����N�� mejilink.js v3.3.0
//
Puzzles.mejilink = function(){ };
Puzzles.mejilink.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 8;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 8;}	// �Ֆʂ̏c��
		k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
		k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
		k.isoutsideborder = 1;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
		k.isLineCross     = 0;	// 1:������������p�Y��
		k.isCenterLine    = 0;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = 1;	// 1:���E����line�Ƃ��Ĉ���

		k.dispzero      = 1;	// 1:0��\�����邩�ǂ���
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

		//k.def_csize = 36;
		//k.def_psize = 24;
		k.area = { bcell:0, wcell:0, number:0, disroom:1};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		base.setTitle("���W�����N","Mejilink");
		base.setExpression("�@���h���b�O�Ő����A�E�N���b�N�Ł~�����͂ł��܂��B",
						   " Left Button Drag to input black cells, Right Click to input a cross.");
		base.setFloatbgcolor("rgb(32, 32, 32)");
	},
	menufix : function(){
		menu.addRedLineToFlags();
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if(kc.isZ ^ pp.getVal('dispred')){ this.dispRedLine(); return;}
			if(k.editmode) this.inputborder();
			else if(k.playmode){
				if(this.btn.Left) this.inputborderans();
				else if(this.btn.Right) this.inputpeke();
			}
		};
		mv.mouseup = function(){ };
		mv.mousemove = function(){
			if(k.editmode) this.inputborder();
			else if(k.playmode){
				if(this.btn.Left) this.inputborderans();
				else if(this.btn.Right) this.inputpeke();
			}
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){ if(ca=='z' && !this.keyPressed){ this.isZ=true;} };
		kc.keyup = function(ca){ if(ca=='z'){ this.isZ=false;}};
		kc.isZ = false;
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_LIGHT;
		pc.BorderQuescolor = "white";

		pc.chassisflag = false;

		pc.paint = function(x1,y1,x2,y2){
			this.drawBGCells(x1,y1,x2,y2);
			this.drawDashedGrid(x1,y1,x2,y2);
			this.drawBorders(x1,y1,x2,y2);

			this.drawBaseMarks(x1,y1,x2,y2);

			this.drawPekes(x1,y1,x2,y2,0);
		};

		pc.drawBaseMarks = function(x1,y1,x2,y2){
			this.vinc('cross_mark', 'auto');

			for(var by=bd.minby;by<=bd.maxby;by+=2){
				for(var bx=bd.minbx;bx<=bd.maxbx;bx+=2){
					if(bx < x1-1 || x2+1 < bx){ continue;}
					if(by < y1-1 || y2+1 < by){ continue;}

					this.drawBaseMark1((bx>>1)+(by>>1)*(k.qcols+1));
				}
			}
		};
		pc.drawBaseMark1 = function(id){
			var vid = "x_cm_"+id;

			g.fillStyle = this.Cellcolor;
			if(this.vnop(vid,this.NONE)){
				var csize = (this.lw+1)/2;
				var bx = (id%(k.qcols+1))*2, by = mf(id/(k.qcols+1))*2;
				g.fillCircle(k.p0.x+bx*this.bw, k.p0.x+by*this.bh, csize);
			}
		};

		// �I�[�o�[���C�h
		pc.setBorderColor = function(id){
			if(bd.border[id].qans===1 || bd.border[id].ques===1){
				if(bd.border[id].qans===1){ this.setLineColor(id);}
				else{
					var cc2=bd.border[id].cellcc[1];
					g.fillStyle = ((cc2==-1 || bd.cell[cc2].error==0) ? this.BorderQuescolor : this.errbcolor1);
				}
				return true;
			}
			return false;
		};

		line.repaintParts = function(idlist){
			var xlist = this.getXlistFromIdlist(idlist);
			for(var i=0;i<xlist.length;i++){
				pc.drawBaseMark1(xlist[i]);
			}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type){
			this.decodeMejilink();
		};
		enc.pzlexport = function(type){
			this.encodeMejilink();
		};

		enc.decodeMejilink = function(){
			var bstr = this.outbstr;
			var pos = bstr?Math.min(mf((bd.bdmax+4)/5),bstr.length):0;
			for(var i=0;i<pos;i++){
				var ca = parseInt(bstr.charAt(i),32);
				for(var w=0;w<5;w++){
					if(i*5+w<bd.bdmax){ bd.sQuB(i*5+w,(ca&Math.pow(2,4-w)?1:0));}
				}
			}
			this.outbstr = bstr.substr(pos);
		};
		enc.encodeMejilink = function(){
			var count = 0;
			for(var i=bd.bdinside;i<bd.bdmax;i++){ if(bd.QuB(i)==1) count++;}
			var num=0, pass=0, cm="";
			for(var i=0;i<(count==0?bd.bdinside:bd.bdmax);i++){
				if(bd.QuB(i)==1){ pass+=Math.pow(2,4-num);}
				num++; if(num==5){ cm += pass.toString(32); num=0; pass=0;}
			}
			if(num>0){ cm += pass.toString(32);}
			this.outbstr += cm;
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			this.decodeBorder2( function(c,ca){
				if     (ca == "2" ){ bd.sQuB(c, 0); bd.sQaB(c, 1);}
				else if(ca == "-1"){ bd.sQuB(c, 0); bd.sQsB(c, 2);}
				else if(ca == "1" ){ bd.sQuB(c, 0);}
				else               { bd.sQuB(c, 1);}
			});
		};
		fio.encodeData = function(){
			this.encodeBorder2( function(c){
				if     (bd.QaB(c)==1){ return "2 ";}
				else if(bd.QsB(c)==2){ return "-1 ";}
				else if(bd.QuB(c)==0){ return "1 ";}
				else                 { return "0 ";}
			});
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkdir4Line_meji(3) ){
				this.setAlert('���򂵂Ă����������܂��B','There is a branched line.'); return false;
			}
			if( !this.checkdir4Line_meji(4) ){
				this.setAlert('�����������Ă��܂��B','There is a crossing line.'); return false;
			}

			if( !this.checkDotLength() ){
				this.setAlert('�^�C���Ǝ��͂̐���������Ȃ��_���̒������قȂ�܂��B','The size of the tile is not equal to the total of length of lines that is remained dotted around the tile.'); return false;
			}

			if( !this.checkdir4Line_meji(1) ){
				this.setAlert('�r���œr�؂�Ă����������܂��B','There is a dead-end line.'); return false;
			}

			if( !this.checkOneLoop() ){
				this.setAlert('�ւ�������ł͂���܂���B','There are plural loops.'); return false;
			}

			return true;
		};
		ans.check1st = function(){ return true;};

		ans.checkdir4Line_meji = function(val){
			var result = true;
			for(var by=bd.minby;by<=bd.maxby;by+=2){
				for(var bx=bd.minbx;bx<=bd.maxbx;bx+=2){
					var cnt = 0;
					if(bd.isLine(bd.bnum(bx-1,by  ))){ cnt++;}
					if(bd.isLine(bd.bnum(bx+1,by  ))){ cnt++;}
					if(bd.isLine(bd.bnum(bx  ,by-1))){ cnt++;}
					if(bd.isLine(bd.bnum(bx  ,by+1))){ cnt++;}
					if(cnt==val){
						if(this.inAutoCheck){ return false;}
						if(result){ bd.sErBAll(2);}
						ans.setCrossBorderError(bx,by);
						result = false;
					}
				}
			}
			return result;
		};
		ans.checkDotLength = function(){
			var result = true;
			var tarea = new AreaInfo();
			for(var cc=0;cc<bd.cellmax;cc++){ tarea.id[cc]=0;}
			for(var cc=0;cc<bd.cellmax;cc++){
				if(tarea.id[cc]!=0){ continue;}
				tarea.max++;
				tarea[tarea.max] = {clist:[]};
				area.sr0(cc,tarea,function(id){ return (id==-1 || bd.QuB(id)!=1);});

				tarea.room[tarea.max] = {idlist:tarea[tarea.max].clist};
			}

			var tcount = [], numerous_value = 999999;
			for(var r=1;r<=tarea.max;r++){ tcount[r]=0;}
			for(var id=0;id<bd.bdmax;id++){
				if(bd.QuB(id)==1 && id>=bd.bdinside){
					var cc1 = bd.border[id].cellcc[0], cc2 = bd.border[id].cellcc[1];
					if(cc1!=-1){ tcount[tarea.id[cc1]] -= numerous_value;}
					if(cc2!=-1){ tcount[tarea.id[cc2]] -= numerous_value;}
					continue;
				}
				else if(bd.QuB(id)==1 || bd.QaB(id)==1){ continue;}
				var cc1 = bd.border[id].cellcc[0], cc2 = bd.border[id].cellcc[1];
				if(cc1!=-1){ tcount[tarea.id[cc1]]++;}
				if(cc2!=-1){ tcount[tarea.id[cc2]]++;}
			}
			for(var r=1;r<=tarea.max;r++){
				if(tcount[r]>=0 && tcount[r]!=tarea.room[r].idlist.length){
					if(this.inAutoCheck){ return false;}
					bd.sErC(tarea.room[r].idlist,1);
					result = false;
				}
			}
			return result;
		};
	}
};
