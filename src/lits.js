//
// �p�Y���ŗL�X�N���v�g�� �k�h�s�r�� lits.js v3.1.9p2
//

function setting(){
	// �O���[�o���ϐ��̏����ݒ�
	if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
	if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
	k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

	k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
	k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
	k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

	k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
	k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
	k.isborderCross   = 0;	// 1:������������p�Y��
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

		base.setTitle("�k�h�s�r","LITS");
		base.setExpression("�@���N���b�N�ō��}�X���A�E�N���b�N�Ŕ��}�X�m��}�X�����͂ł��܂��B",
						   " Left Click to input black cells, Right Click to input determined white cells.");
		base.setFloatbgcolor("rgb(64, 64, 64)");
	},
	menufix : function(){
		menu.addUseToFlags();
		menu.addRedBlockToFlags();
	},
	postfix : function(){ },

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(kc.isZ ^ menu.getVal('dispred')){ this.dispRedLine(x,y); return;}
			if(k.mode==1) this.inputborder(x,y);
			else if(k.mode==3) this.inputcell(x,y);
		};
		mv.mouseup = function(x,y){ };
		mv.mousemove = function(x,y){
			if(k.mode==1) this.inputborder(x,y);
			else if(k.mode==3) this.inputcell(x,y);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){ if(ca=='z' && !this.keyPressed){ this.isZ=true; }};
		kc.keyup    = function(ca){ if(ca=='z'){ this.isZ=false;}};
		kc.isZ = false;
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(48, 48, 48)";
		pc.Cellcolor = "rgb(96, 96, 96)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawWhiteCells(x1,y1,x2,y2);
			this.drawBlackCells(x1,y1,x2,y2);

			this.drawBDline(x1,y1,x2,y2);

			this.drawBorders(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	pzlinput : function(type, bstr){
		if((type==1 && enc.pzlflag.indexOf("c")>=0) || (type==0 && enc.pzlflag.indexOf("d")==-1)){
			bstr = enc.decodeBorder(bstr);
		}
		else if(type==0 || type==1){ bstr = this.decodeLITS_old(bstr);}
		else if(type==2 && enc.pzlflag.indexOf("c")>=0){ bstr = enc.decodeBorder(bstr);}
		else if(type==2 && bstr.indexOf("/")>=0){ bstr = this.decodeKanpen(bstr);}
		else if(type==2){ bstr = this.decodeLITS_old(bstr);}
	},
	pzloutput : function(type){
		if(type==0)     { document.urloutput.ta.value = enc.getURLbase()+"?"+k.puzzleid+this.pzldata();}
		else if(type==1){ document.urloutput.ta.value = enc.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
		else if(type==2){ document.urloutput.ta.value = enc.kanpenbase()+"lits.html?pzpr=c"+this.pzldata();}
		else if(type==3){ document.urloutput.ta.value = enc.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
	},
	pzldata : function(){
		return "/"+k.qcols+"/"+k.qrows+"/"+enc.encodeBorder();
	},
	pzldataKanpen : function(){
		var rarea = ans.searchRarea();
		var bstr = "";
		for(var c=0;c<bd.cell.length;c++){
			bstr += (""+(rarea.check[c]-1)+"_");
			if((c+1)%k.qcols==0){ bstr += "/";}
		}
		return ""+k.qrows+"/"+k.qcols+"/"+rarea.max+"/"+bstr;
	},

	decodeKanpen : function(bstr){
		var array1 = bstr.split("/");
		array1.shift();
		var array = new Array();
		var i;
		for(i=0;i<array1.length;i++){
			var array2 = array1[i].split("_");
			var j;
			for(j=0;j<array2.length;j++){
				if(array2[j]!=""){ array.push(array2[j]);}
			}
		}
		this.decodeLITS(array);
		return "";
	},
	decodeLITS_old : function(bstr){
		var array = new Array();
		var i;
		for(i=0;i<bstr.length;i++){ array.push(bstr.charAt(i));}
		this.decodeLITS(array);
		return "";
	},
	decodeLITS : function(array){
		var id;
		for(id=0;id<bd.border.length;id++){
			var cc1 = bd.getcnum(int((bd.border[id].cx-(bd.border[id].cy%2))/2), int((bd.border[id].cy-(bd.border[id].cx%2))/2) );
			var cc2 = bd.getcnum(int((bd.border[id].cx+(bd.border[id].cy%2))/2), int((bd.border[id].cy+(bd.border[id].cx%2))/2) );

			if(cc1!=-1 && cc2!=-1 && array[cc1]!=array[cc2]){ bd.setQuesBorder(id,1);}
			else{ bd.setQuesBorder(id,0);}
		}
	},

	//---------------------------------------------------------
	kanpenOpen : function(array){
		var rmax = array.shift();
		var barray = array.slice(0,k.qrows);
		for(var i=0;i<barray.length;i++){ barray[i] = barray[i].replace(/ /g, "_");}
		this.decodeKanpen(""+rmax+"/"+barray.join("/"));
		fio.decodeCellAns(array.slice(k.qrows,2*k.qrows));
	},
	kanpenSave : function(){
		var barray = this.pzldataKanpen().split("/");
		barray.shift(); barray.shift();
		var rmax = barray.shift();
		for(var i=0;i<barray.length;i++){ barray[i] = barray[i].replace(/_/g, " ");}
		return rmax + "/" + barray.join("/") + fio.encodeCellAns()+"/";
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	check : function(){

		if( !ans.check2x2Block( function(id){ return (bd.getQansCell(id)==1);} ) ){
			ans.setAlert('2x2�̍��}�X�̂����܂肪����܂��B', 'There is a 2x2 block of black cells.'); return false;
		}

		var rarea = ans.searchRarea();
		if( !ans.checkBlackCellInArea(rarea, function(a){ return (a>4);}) ){
			ans.setAlert('�T�}�X�ȏ�̍��}�X�����镔�������݂��܂��B', 'A room has five or more black cells.'); return false;
		}

		if( !ans.checkSeqBlocksInRoom(rarea) ){
			ans.setAlert('1�̕����ɓ��鍕�}�X��2�ȏ�ɕ��􂵂Ă��܂��B', 'Black cells are devided in one room.'); return false;
		}

		if( !this.checkTetromino(rarea) ){
			ans.setAlert('�����`�̃e�g���~�m���ڂ��Ă��܂��B', 'Some Tetrominos that are the same shape are Adjacent.'); return false;
		}

		if( !ans.linkBWarea( ans.searchBarea() ) ){
			ans.setAlert('���}�X�����f����Ă��܂��B', 'Black cells are not continued.'); return false;
		}

		if( !ans.checkBlackCellInArea(rarea, function(a){ return (a==0);}) ){
			ans.setAlert('���}�X���Ȃ�����������܂��B', 'A room has no black cells.'); return false;
		}

		if( !ans.checkBlackCellInArea(rarea, function(a){ return (a<4);}) ){
			ans.setAlert('���}�X�̃J�^�}�����S�}�X�����̕���������܂��B', 'A room has three or less black cells.'); return false;
		}

		return true;
	},

	checkTetromino : function(rarea){
		var tarea = new AreaInfo();
		for(var c=0;c<bd.cell.length;c++){ tarea.check[c]=-1;}
		for(var r=1;r<=rarea.max;r++){
			var bcells = new Array();
			var minid = k.qcols*k.qrows;
			for(var i=0;i<rarea.room[r].length;i++){ if(bd.getQansCell(rarea.room[r][i])==1){ bcells.push(rarea.room[r][i]);} }
			if(bcells.length==4){
				bcells.sort(function(a,b){ return a-b;});
				var cx0=bd.cell[bcells[0]].cx; var cy0=bd.cell[bcells[0]].cy; var value=0;
				for(var i=1;i<bcells.length;i++){ value += ((bd.cell[bcells[i]].cy-cy0)*10+(bd.cell[bcells[i]].cx-cx0));}
				switch(value){
					case 13: case 15: case 27: case 31: case 33: case 49: case 51:
						for(var i=0;i<bcells.length;i++){ tarea.check[bcells[i]]="L";} break;
					case 6: case 60:
						for(var i=0;i<bcells.length;i++){ tarea.check[bcells[i]]="I";} break;
					case 14: case 30: case 39: case 41:
						for(var i=0;i<bcells.length;i++){ tarea.check[bcells[i]]="T";} break;
					case 20: case 24: case 38: case 42:
						for(var i=0;i<bcells.length;i++){ tarea.check[bcells[i]]="S";} break;
				}
			}
		}
		var area = new AreaInfo();
		for(var c=0;c<bd.cell.length;c++){ area.check[c]=(tarea.check[c]!=-1?0:-1);}
		for(var c=0;c<bd.cell.length;c++){ if(area.check[c]==0){ area.max++; area.room[area.max]=new Array(); this.st0(area, c, area.max, tarea);} }
		for(var r=1;r<=area.max;r++){ if(area.room[r].length>4){ bd.setErrorCell(area.room[r],2); return false;} }
		return true;
	},
	st0 : function(area,c,id,tarea){
		if(c==-1 || area.check[c]!=0){ return;}
		area.check[c] = id;
		area.room[id].push(c);
		var func = function(cc){ return (cc!=-1 && tarea.check[c]==tarea.check[cc]);};
		if( func(bd.cell[c].up()) ){ arguments.callee(area, bd.cell[c].up(), id, tarea);}
		if( func(bd.cell[c].dn()) ){ arguments.callee(area, bd.cell[c].dn(), id, tarea);}
		if( func(bd.cell[c].lt()) ){ arguments.callee(area, bd.cell[c].lt(), id, tarea);}
		if( func(bd.cell[c].rt()) ){ arguments.callee(area, bd.cell[c].rt(), id, tarea);}
		return;
	}
};
