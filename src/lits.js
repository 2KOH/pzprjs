//
// �p�Y���ŗL�X�N���v�g�� �k�h�s�r�� lits.js v3.2.3
//
Puzzles.lits = function(){ };
Puzzles.lits.prototype = {
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
		k.isDispHatena  = 0;	// 1:qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber   = 0;	// 1:�񓚂ɐ�������͂���p�Y��
		k.isArrowNumber = 0;	// 1:������������͂���p�Y��
		k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
		k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
		k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

		k.BlackCell     = 1;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 0;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 1;	// 1:pencilbox/�J���y���ɂ���p�Y��

		k.fstruct = ["arearoom","cellans"];

		//k.def_csize = 36;
		//k.def_psize = 24;
		k.area = { bcell:1, wcell:0, number:0};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		base.setTitle("�k�h�s�r","LITS");
		base.setExpression("�@���N���b�N�ō��}�X���A�E�N���b�N�Ŕ��}�X�m��}�X�����͂ł��܂��B",
						   " Left Click to input black cells, Right Click to input determined white cells.");
		base.setFloatbgcolor("rgb(64, 64, 64)");
	},
	menufix : function(){
		menu.addUseToFlags();
		menu.addRedBlockToFlags();
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
		mv.mouseup = function(){ };
		mv.mousemove = function(){
			if     (k.editmode) this.inputborder();
			else if(k.playmode) this.inputcell();
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){ if(ca=='z' && !this.keyPressed){ this.isZ=true; }};
		kc.keyup    = function(ca){ if(ca=='z'){ this.isZ=false;}};
		kc.isZ = false;
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = "rgb(48, 48, 48)";
		pc.Cellcolor = "rgb(96, 96, 96)";
		pc.setBGCellColorFunc('qans2');

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawBGCells(x1,y1,x2,y2);
			this.drawRDotCells(x1,y1,x2,y2);
			this.drawGrid(x1,y1,x2,y2);

			this.drawBorders(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if((type==1 && this.checkpflag("c")) || (type==0 && !this.checkpflag("d"))){
				bstr = this.decodeBorder(bstr);
			}
			else if(type==0 || type==1){ bstr = this.decodeLITS_old(bstr);}
			else if(type==2 && this.checkpflag("c")){ bstr = this.decodeBorder(bstr);}
			else if(type==2 && bstr.indexOf("/")>=0){ bstr = this.decodeKanpen(bstr);}
			else if(type==2){ bstr = this.decodeLITS_old(bstr);}
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
			else if(type==2){ document.urloutput.ta.value = this.kanpenbase()+"lits.html?pzpr=c"+this.pzldata();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			return "/"+k.qcols+"/"+k.qrows+"/"+this.encodeBorder();
		};
		enc.pzldataKanpen = function(){
			var rinfo = area.getRoomInfo();
			var bstr = "";
			for(var c=0;c<bd.cellmax;c++){
				bstr += (""+(rinfo.id[c]-1)+"_");
				if((c+1)%k.qcols==0){ bstr += "/";}
			}
			return ""+k.qrows+"/"+k.qcols+"/"+rinfo.max+"/"+bstr;
		};

		enc.decodeKanpen = function(bstr){
			var array1 = bstr.split("/");
			array1.shift();
			var array = [];
			for(var i=0;i<array1.length;i++){
				var array2 = array1[i].split("_");
				var j;
				for(j=0;j<array2.length;j++){
					if(array2[j]!=""){ array.push(array2[j]);}
				}
			}
			this.decodeLITS(array);
			return "";
		};
		enc.decodeLITS_old = function(bstr){
			var array = [];
			for(var i=0;i<bstr.length;i++){ array.push(bstr.charAt(i));}
			this.decodeLITS(array);
			return "";
		};
		enc.decodeLITS = function(array){
			for(var id=0;id<bd.bdmax;id++){
				var cc1 = bd.cc1(id), cc2 = bd.cc2(id);
				if(cc1!=-1 && cc2!=-1 && array[cc1]!=array[cc2]){ bd.sQuB(id,1);}
			}
		};

		//---------------------------------------------------------
		fio.kanpenOpen = function(array){
			var rmax = array.shift();
			var barray = array.slice(0,k.qrows);
			for(var i=0;i<barray.length;i++){ barray[i] = barray[i].replace(/ /g, "_");}
			enc.decodeKanpen(""+rmax+"/"+barray.join("/"));
			this.decodeCellAns(array.slice(k.qrows,2*k.qrows));
		};
		fio.kanpenSave = function(){
			var barray = enc.pzldataKanpen().split("/");
			barray.shift(); barray.shift();
			var rmax = barray.shift();
			for(var i=0;i<barray.length;i++){ barray[i] = barray[i].replace(/_/g, " ");}
			return rmax + "/" + barray.join("/") + this.encodeCellAns()+"/";
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.check2x2Block( bd.isBlack ) ){
				this.setAlert('2x2�̍��}�X�̂����܂肪����܂��B', 'There is a 2x2 block of black cells.'); return false;
			}

			var rinfo = area.getRoomInfo();
			if( !this.checkBlackCellInArea(rinfo, function(a){ return (a>4);}) ){
				this.setAlert('�T�}�X�ȏ�̍��}�X�����镔�������݂��܂��B', 'A room has five or more black cells.'); return false;
			}

			if( !this.checkSeqBlocksInRoom() ){
				this.setAlert('1�̕����ɓ��鍕�}�X��2�ȏ�ɕ��􂵂Ă��܂��B', 'Black cells are devided in one room.'); return false;
			}

			if( !this.checkTetromino(rinfo) ){
				this.setAlert('�����`�̃e�g���~�m���ڂ��Ă��܂��B', 'Some Tetrominos that are the same shape are Adjacent.'); return false;
			}

			if( !this.checkOneArea( area.getBCellInfo() ) ){
				this.setAlert('���}�X�����f����Ă��܂��B', 'Black cells are not continued.'); return false;
			}

			if( !this.checkBlackCellInArea(rinfo, function(a){ return (a==0);}) ){
				this.setAlert('���}�X���Ȃ�����������܂��B', 'A room has no black cells.'); return false;
			}

			if( !this.checkBlackCellInArea(rinfo, function(a){ return (a<4);}) ){
				this.setAlert('���}�X�̃J�^�}�����S�}�X�����̕���������܂��B', 'A room has three or less black cells.'); return false;
			}

			return true;
		};

		ans.checkTetromino = function(rinfo){
			var tinfo = new AreaInfo();
			for(var c=0;c<bd.cellmax;c++){ tinfo.id[c]=-1;}
			for(var r=1;r<=rinfo.max;r++){
				var bcells = [];
				var minid = k.qcols*k.qrows;
				for(var i=0;i<rinfo.room[r].idlist.length;i++){ if(bd.isBlack(rinfo.room[r].idlist[i])){ bcells.push(rinfo.room[r].idlist[i]);} }
				if(bcells.length==4){
					bcells.sort(function(a,b){ return a-b;});
					var cx0=bd.cell[bcells[0]].cx; var cy0=bd.cell[bcells[0]].cy; var value=0;
					for(var i=1;i<bcells.length;i++){ value += ((bd.cell[bcells[i]].cy-cy0)*10+(bd.cell[bcells[i]].cx-cx0));}
					switch(value){
						case 13: case 15: case 27: case 31: case 33: case 49: case 51:
							for(var i=0;i<bcells.length;i++){ tinfo.id[bcells[i]]="L";} break;
						case 6: case 60:
							for(var i=0;i<bcells.length;i++){ tinfo.id[bcells[i]]="I";} break;
						case 14: case 30: case 39: case 41:
							for(var i=0;i<bcells.length;i++){ tinfo.id[bcells[i]]="T";} break;
						case 20: case 24: case 38: case 42:
							for(var i=0;i<bcells.length;i++){ tinfo.id[bcells[i]]="S";} break;
					}
				}
			}
			var dinfo = new AreaInfo();
			for(var c=0;c<bd.cellmax;c++){ dinfo.id[c]=(tinfo.id[c]!=-1?0:-1);}
			for(var c=0;c<bd.cellmax;c++){
				if(dinfo.id[c]!=0){ continue;}
				dinfo.max++;
				dinfo.room[dinfo.max] = {idlist:[]};
				this.st0(dinfo, c, dinfo.max, tinfo);
			}
			for(var r=1;r<=dinfo.max;r++){ if(dinfo.room[r].idlist.length>4){ bd.sErC(dinfo.room[r].idlist,2); return false;} }
			return true;
		};
		ans.st0 = function(dinfo,c,id,tinfo){
			if(dinfo.id[c]!=0){ return;}
			dinfo.id[c] = id;
			dinfo.room[id].idlist.push(c);
			var func = function(cc){ return (cc!=-1 && tinfo.id[c]==tinfo.id[cc]);};
			if( func(bd.up(c)) ){ this.st0(dinfo, bd.up(c), id, tinfo);}
			if( func(bd.dn(c)) ){ this.st0(dinfo, bd.dn(c), id, tinfo);}
			if( func(bd.lt(c)) ){ this.st0(dinfo, bd.lt(c), id, tinfo);}
			if( func(bd.rt(c)) ){ this.st0(dinfo, bd.rt(c), id, tinfo);}
			return;
		};
	}
};
