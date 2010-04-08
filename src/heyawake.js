//
// �p�Y���ŗL�X�N���v�g�� �ւ�킯�� heyawake.js v3.3.0
//
Puzzles.heyawake = function(){ };
Puzzles.heyawake.prototype = {
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

		k.dispzero      = 1;	// 1:0��\�����邩�ǂ���
		k.isDispHatena  = 1;	// 1:qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber   = 0;	// 1:�񓚂ɐ�������͂���p�Y��
		k.isArrowNumber = 0;	// 1:������������͂���p�Y��
		k.isOneNumber   = 1;	// 1:�����̖��̐�����1��������p�Y��
		k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
		k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

		k.BlackCell     = 1;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 1;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 1;	// 1:pencilbox/�J���y���ɂ���p�Y��

		//k.def_csize = 36;
		//k.def_psize = 24;
		k.area = { bcell:0, wcell:1, number:0, disroom:0};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		base.setTitle("�ւ�킯","Heyawake");
		base.setExpression("�@���N���b�N�ō��}�X���A�E�N���b�N�Ŕ��}�X�m��}�X�����͂ł��܂��B",
						   " Left Click to input black cells, Right Click to input determined white cells.");
		base.setFloatbgcolor("rgb(0, 191, 0)");

		enc.pidKanpen = 'heyawake';
	},
	menufix : function(){
		menu.addUseToFlags();
		menu.addRedBlockRBToFlags();
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if(kc.isZ ^ pp.getVal('dispred')){ this.dispRed();}
			else if(k.editmode) this.inputborder();
			else if(k.playmode) this.inputcell();
		};
		mv.mouseup = function(){
			if(this.notInputted()){
				if(k.editmode){
					if(!kp.enabled()){ this.inputqnum();}
					else{ kp.display();}
				}
			}
		};
		mv.mousemove = function(){
			if     (k.editmode) this.inputborder();
			else if(k.playmode) this.inputcell();
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(ca=='z' && !this.keyPressed){ this.isZ=true; return;}
			if(k.playmode){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca);
		};
		kc.keyup = function(ca){ if(ca=='z'){ this.isZ=false;}};
		kc.isZ = false;

		if(k.EDITOR){
			kp.generate(0, true, false, '');
			kp.kpinput = function(ca){
				kc.key_inputqnum(ca);
			};
		}

		bd.maxnum = 255;
		bd.nummaxfunc = function(cc){
			var id = area.room.id[cc];
			var d = ans.getSizeOfClist(area.room[id].clist,f_true);
			var m=d.cols, n=d.rows; if(m>n){ var t=m;m=n;n=t;}
			if     (m===1){ return mf((n+1)/2);}
			else if(m===2){ return n;}
			else if(m===3){
				if     (n%4===0){ return (n  )/4*5  ;}
				else if(n%4===1){ return (n-1)/4*5+2;}
				else if(n%4===2){ return (n-2)/4*5+3;}
				else            { return (n+1)/4*5  ;}
			}
			else{
				if(((Math.log(m+1)/Math.log(2))%1===0)&&(m===n)){ return (m*n+m+n)/3;}
				else if((m&1)&&(n&1)){ return mf((m*n+m+n-1)/3);}
				else{ return mf((m*n+m+n-2)/3);}
			}
		};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_LIGHT;
		pc.bcolor = pc.bcolor_GREEN;
		pc.BBcolor = "rgb(160, 255, 191)";
		pc.setBGCellColorFunc('qsub1');

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawBGCells(x1,y1,x2,y2);
			this.drawGrid(x1,y1,x2,y2);
			this.drawBlackCells(x1,y1,x2,y2);

			this.drawNumbers(x1,y1,x2,y2);

			this.drawBorders(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawBoxBorders(x1,y1,x2,y2,false);

			this.drawTarget(x1,y1,x2,y2);
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type){
			this.decodeBorder();
			this.decodeRoomNumber16();
		};
		enc.pzlexport = function(type){
			this.encodeBorder();
			this.encodeRoomNumber16();
		};

		enc.decodeKanpen = function(){
			fio.decodeSquareRoom();
		};
		enc.encodeKanpen = function(){
			fio.encodeSquareRoom();
		};

		enc.decodeHeyaApp = function(){
			var c=0, rdata=[];
			while(c<bd.cellmax){ rdata[c]=-1; c++;}

			var i=0, inp=this.uri.bstr.split("/");
			for(var c=0;c<bd.cellmax;c++){
				if(rdata[c]>-1){ continue;}

				if(inp[i].match(/(\d+in)?(\d+)x(\d+)$/)){
					if(RegExp.$1.length>0){ bd.sQnC(c, parseInt(RegExp.$1));}
					var x1 = bd.cell[c].bx, x2 = x1 + 2*parseInt(RegExp.$2) - 2;
					var y1 = bd.cell[c].by, y2 = y1 + 2*parseInt(RegExp.$3) - 2;
					fio.setRdataRect(rdata, i, {x1:x1, x2:x2, y1:y1, y2:y2});
				}
				i++;
			}
			fio.rdata2Border(true, rdata);
		};
		enc.encodeHeyaApp = function(){
			var barray=[], rinfo=area.getRoomInfo();
			for(var id=1;id<=rinfo.max;id++){
				var d = ans.getSizeOfClist(rinfo.room[id].idlist,f_true);
				if(bd.QnC(bd.cnum(d.x1,d.y1))>=0){
					barray.push(""+bd.QnC(bd.cnum(d.x1,d.y1))+"in"+d.cols+"x"+d.rows);
				}
				else{ barray.push(""+d.cols+"x"+d.rows);}
			}
			this.outbstr = barray.join("/");
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			this.decodeAreaRoom();
			this.decodeCellQnum();
			this.decodeCellAns();
		};
		fio.encodeData = function(){
			this.encodeAreaRoom();
			this.encodeCellQnum();
			this.encodeCellAns();
		};

		fio.kanpenOpen = function(){
			this.decodeSquareRoom();
			this.decodeCellAns();
		};
		fio.kanpenSave = function(){
			this.encodeSquareRoom();
			this.encodeCellAns();
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkSideCell(function(c1,c2){ return (bd.isBlack(c1) && bd.isBlack(c2));}) ){
				this.setAlert('���}�X���^�e���R�ɘA�����Ă��܂��B','Black cells are adjacent.'); return false;
			}

			if( !this.checkOneArea( area.getWCellInfo() ) ){
				this.setAlert('���}�X�����f����Ă��܂��B','White cells are devided.'); return false;
			}

			var rinfo = area.getRoomInfo();
			if( !this.checkBlackCellCount(rinfo) ){
				this.setAlert('�����̐����ƍ��}�X�̐�����v���Ă��܂���B','The number of Black cells in the room and The number written in the room is different.'); return false;
			}

			if( !this.checkRowsColsPartly(this.isBorderCount, {}, function(cc){ return (bd.QaC(cc)==1);}, false) ){
				this.setAlert('���}�X��3�����A���ő����Ă��܂��B','White cells are continued for three consecutive room.'); return false;
			}

			if( !this.checkAreaRect(rinfo) ){
				this.setAlert('�l�p�`�ł͂Ȃ�����������܂��B','There is a room whose shape is not square.'); return false;
			}

			return true;
		};

		ans.isBorderCount = function(nullnum, keycellpos, clist, nullobj){
			var d = ans.getSizeOfClist(clist,f_true), count = 0, bx, by;
			if(d.x1===d.x2){
				bx = d.x1;
				for(by=d.y1+1;by<=d.y2-1;by+=2){
					if(bd.QuB(bd.bnum(bx,by))===1){ count++;}
				}
			}
			else if(d.y1===d.y2){
				by = d.y1;
				for(bx=d.x1+1;bx<=d.x2-1;bx+=2){
					if(bd.QuB(bd.bnum(bx,by))===1){ count++;}
				}
			}

			if(count>=2){ bd.sErC(clist,1); return false;}
			return true;
		};
	}
};
