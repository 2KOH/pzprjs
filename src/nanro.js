//
// �p�Y���ŗL�X�N���v�g�� �i�����[�� nanro.js v3.1.9p1
//

function setting(){
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
	k.isCenterLine    = 0;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
	k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

	k.dispzero      = 0;	// 1:0��\�����邩�ǂ���
	k.isDispHatena  = 1;	// 1:qnum��-2�̂Ƃ��ɁH��\������
	k.isAnsNumber   = 1;	// 1:�񓚂ɐ�������͂���p�Y��
	k.isArrowNumber = 0;	// 1:������������͂���p�Y��
	k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
	k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
	k.NumberWithMB  = 1;	// 1:�񓚂̐����Ɓ��~������p�Y��

	k.BlackCell     = 0;	// 1:���}�X����͂���p�Y��
	k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
	k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

	k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
	k.isKanpenExist = 1;	// 1:pencilbox/�J���y���ɂ���p�Y��

	k.fstruct = ["arearoom", "cellqnum", "cellqanssub"];

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

		base.setTitle("�i�����[","Nanro");
		base.setExpression("�@�����Ȃǂ��N���b�N���ē��������ƂŁA��������͂��邱�Ƃ��ł��܂��B�E�N���b�N���ă}�E�X�𓮂����ā~����͂��邱�Ƃ��ł��܂��B",
						   " Press Mouse Button on the number and Move to copy the number. It is able to Press Right Mouse Button and Move to input a cross.");
		base.setFloatbgcolor("rgb(64, 64, 64)");
	},
	menufix : function(){
		kp.defaultdisp = true;
	},
	postfix : function(){
		room.setEnable();
		this.roommaxfunc = function(cc,mode){ return room.getCntOfRoomByCell(cc);};
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(k.mode==1) this.inputborder(x,y);
			else if(k.mode==3){
				if(this.btn.Left) this.dragnumber(x,y);
			}
		};
		mv.mouseup = function(x,y){
			if(this.notInputted()){
				if(!kp.enabled()){ this.mouseCell=-1; this.inputqnum(x,y,99);}
				else{ kp.display(x,y);}
			}
		};
		mv.mousemove = function(x,y){
			if(k.mode==1) this.inputborder(x,y);
			else if(k.mode==3){
				if(this.btn.Left) this.dragnumber(x,y);
				else if(this.btn.Right) this.inputDot(x,y);
			}
		};
		mv.dragnumber = function(x,y){
			var cc = this.cellid(new Pos(x,y));
			if(cc==-1||cc==this.mouseCell){ return;}
			if(this.mouseCell==-1){
				this.inputData = puz.getNum(cc);
				if   (this.inputData==-2){ this.inputData=-4;}
				else if(this.inputData==-1){
					if     (bd.getQsubCell(cc)==1){ this.inputData=-2;}
					else if(bd.getQsubCell(cc)==2){ this.inputData=-3;}
				}
				this.mouseCell = cc;
			}
			else if(bd.getQnumCell(cc)==-1){
				if(this.inputData>=-1){ bd.setQansCell(cc, this.inputData); bd.setQsubCell(cc,0);}
				else if(this.inputData==-2){ bd.setQansCell(cc,-1); bd.setQsubCell(cc,1);}
				else if(this.inputData==-3){ bd.setQansCell(cc,-1); bd.setQsubCell(cc,2);}
				this.mouseCell = cc;
				pc.paint(bd.cell[cc].cx, bd.cell[cc].cy, bd.cell[cc].cx, bd.cell[cc].cy);
			}
		};
		mv.inputDot = function(x,y){
			var cc = this.cellid(new Pos(x,y));
			if(cc==-1 || cc==this.mouseCell || bd.getQnumCell(cc)!=-1 || bd.getQansCell(cc)!=-1){ return;}
			if(this.inputData==-1){ this.inputData = (bd.getQsubCell(cc)==2?0:2);}
			if     (this.inputData==2){ bd.setQansCell(cc,-1); bd.setQsubCell(cc,2);}
			else if(this.inputData==0){ bd.setQansCell(cc,-1); bd.setQsubCell(cc,0);}
			this.mouseCell = cc;
			pc.paint(bd.cell[cc].cx-1, bd.cell[cc].cy-1, bd.cell[cc].cx, bd.cell[cc].cy);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(this.moveTCell(ca)){ return;}
			if(this.key_view(ca)){ return;}
			this.key_inputqnum(ca,99);
		};
		kc.key_view = function(ca){
			if(k.mode==1 || bd.getQnumCell(tc.getTCC())!=-1){ return false;}

			var cc = tc.getTCC();
			var flag = false;

			if     ((ca=='q'||ca=='a'||ca=='z')){ bd.setQansCell(cc,-1); bd.setQsubCell(cc,1); flag = true;}
			else if((ca=='w'||ca=='s'||ca=='x')){ bd.setQansCell(cc,-1); bd.setQsubCell(cc,2); flag = true;}
			else if((ca=='e'||ca=='d'||ca=='c')){ bd.setQansCell(cc,-1); bd.setQsubCell(cc,0); flag = true;}
			else if(ca=='1' && bd.getQansCell(cc)==1){ bd.setQansCell(cc,-1); bd.setQsubCell(cc,1); flag = true;}
			else if(ca=='2' && bd.getQansCell(cc)==2){ bd.setQansCell(cc,-1); bd.setQsubCell(cc,2); flag = true;}

			if(flag){ pc.paint(bd.cell[cc].cx, bd.cell[cc].cy, bd.cell[cc].cx, bd.cell[cc].cy); return true;}
			return false;
		};

		kp.generate(99, true, true, this.kpgenerate);
		kp.kpinput = function(ca){ kc.keyinput(ca,99);};
	},
	kpgenerate : function(mode){
		if(mode==3){
			kp.tdcolor = pc.MBcolor;
			kp.inputcol('num','knumq','q','��');
			kp.inputcol('num','knumw','w','�~');
			kp.tdcolor = "black";
			kp.inputcol('num','knum_',' ',' ');
			kp.inputcol('empty','knumx','','');
			kp.insertrow();
		}
		kp.inputcol('num','knum1','1','1');
		kp.inputcol('num','knum2','2','2');
		kp.inputcol('num','knum3','3','3');
		kp.inputcol('num','knum4','4','4');
		kp.insertrow();
		kp.inputcol('num','knum5','5','5');
		kp.inputcol('num','knum6','6','6');
		kp.inputcol('num','knum7','7','7');
		kp.inputcol('num','knum8','8','8');
		kp.insertrow();
		kp.inputcol('num','knum9','9','9');
		kp.inputcol('num','knum0','0','0');
		((mode==1)?kp.inputcol('num','knum.','-','?'):kp.inputcol('empty','knumz','',''));
		((mode==1)?kp.inputcol('num','knumc',' ',''):kp.inputcol('empty','knumy','',''));
		kp.insertrow();
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(160, 160, 160)";

		pc.BorderQanscolor = "rgb(0, 127, 0)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawErrorCells(x1,y1,x2,y2);

			this.drawBDline(x1,y1,x2,y2);

			this.drawMBs(x1,y1,x2,y2);
			this.drawNumbers(x1,y1,x2,y2);

			this.drawBorders(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawTCell(x1,y1,x2+1,y2+1);
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	pzlinput : function(type, bstr){
		if(type==0 || type==1){
			bstr = enc.decodeBorder(bstr);
			bstr = enc.decodeNumber16(bstr);
		}
		else if(type==2){ bstr = this.decodeKanpen(bstr);}
	},
	pzloutput : function(type){
		if(type==0)     { document.urloutput.ta.value = enc.getURLbase()+"?"+k.puzzleid+this.pzldata();}
		else if(type==1){ document.urloutput.ta.value = enc.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
		else if(type==2){ document.urloutput.ta.value = enc.kanpenbase()+"nanro.html?problem="+this.encodeKanpen();}
		else if(type==3){ document.urloutput.ta.value = enc.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
	},
	pzldata : function(){
		return "/"+k.qcols+"/"+k.qrows+"/"+enc.encodeBorder()+enc.encodeNumber16();
	},

	decodeKanpen : function(bstr){
		var barray = bstr.split("/").slice(1,k.qrows+1);
		var carray = new Array();
		for(var i=0;i<k.qrows;i++){
			var array2 = barray[i].split("_");
			for(var j=0;j<array2.length;j++){ if(array2[j]!=""){ carray.push(array2[j]);} }
		}
		this.decodeRoom_kanpen(carray);

		barray =  bstr.split("/").slice(k.qrows+1,2*k.qrows+1);
		for(var i=0;i<barray.length;i++){ barray[i] = (barray[i].split("_")).join(" ");}
		fio.decodeCell( function(c,ca){
			if(ca != "."){ bd.setQnumCell(c, parseInt(ca));}
		},barray);

		return "";
	},
	decodeRoom_kanpen : function(array){
		var id;
		for(id=0;id<bd.border.length;id++){
			var cc1 = bd.getcnum(int((bd.border[id].cx-(bd.border[id].cy%2))/2), int((bd.border[id].cy-(bd.border[id].cx%2))/2) );
			var cc2 = bd.getcnum(int((bd.border[id].cx+(bd.border[id].cy%2))/2), int((bd.border[id].cy+(bd.border[id].cx%2))/2) );

			if(cc1!=-1 && cc2!=-1 && array[cc1]!=array[cc2]){ bd.setQuesBorder(id,1);}
			else{ bd.setQuesBorder(id,0);}
		}
	},

	encodeKanpen : function(){
		return ""+k.qrows+"/"+k.qcols+"/"+this.encodeRoom_kanpen()+
		fio.encodeCell( function(c){
			if     (bd.getQnumCell(c)>=0) { return (bd.getQnumCell(c).toString() + "_");}
			else                          { return "._";}
		});
	},
	encodeRoom_kanpen : function(){
		var rarea = ans.searchRarea();
		var bstr = "";
		for(var c=0;c<bd.cell.length;c++){
			bstr += (""+(rarea.check[c]-1)+"_");
			if((c+1)%k.qcols==0){ bstr += "/";}
		}
		return ""+rarea.max+"/"+bstr;
	},

	//---------------------------------------------------------
	kanpenOpen : function(array){
		var rmax = array.shift();
		var barray = array.slice(0,2*k.qrows);
		for(var i=0;i<barray.length;i++){ barray[i] = barray[i].replace(/ /g, "_");}
		this.decodeKanpen(""+rmax+"/"+barray.join("/"));
		fio.decodeCell( function(c,ca){
			if(ca!="."&&ca!="0"){ bd.setQansCell(c, parseInt(ca));}
		},array.slice(2*k.qrows,3*k.qrows));
	},
	kanpenSave : function(){
		var barray = this.encodeKanpen().split("/");
		barray.shift(); barray.shift();
		var rmax = barray.shift();
		for(var i=0;i<barray.length;i++){ barray[i] = barray[i].replace(/_/g, " ");}
		var ansstr = fio.encodeCell( function(c){
			if     (bd.getQnumCell(c)!=-1){ return ". ";}
			else if(bd.getQansCell(c)==-1){ return "0 ";}
			else                          { return ""+bd.getQansCell(c).toString()+" ";}
		})
		return rmax + "/" + barray.join("/") + ansstr+"/";
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	check : function(){

		if( !ans.check2x2Block( function(cc){ return (puz.getNum(cc)>0);} ) ){
			ans.setAlert('������2x2�̂����܂�ɂȂ��Ă��܂��B','There is a 2x2 block of numbers.'); return false;
		}

		if( !ans.checkSideAreaCell(rarea, function(area,c1,c2){ return (puz.getNum(c1)>0 && puz.getNum(c1)==puz.getNum(c2));}, false) ){
			ans.setAlert('�������������E��������ŗׂ荇���Ă��܂��B','Adjacent blocks have the same number.'); return false;
		}

		var rarea = this.searchRarea2(ans.searchRarea());
		if( !this.checkErrorFlag(rarea, 4) ){
			ans.setAlert('������ނ̐����������Ă���u���b�N������܂��B','A block has two or more kinds of numbers.'); return false;
		}

		if( !this.checkErrorFlag(rarea, 1) ){
			ans.setAlert('�����Ă��鐔���̐���������葽���ł��B','A number is bigger than the size of block.'); return false;
		}

		if( !ans.linkBWarea( ans.searchBWarea(function(id){ return (id!=-1 && puz.getNum(id)!=-1); }) ) ){
			ans.setAlert('�^�e���R�ɂȂ����Ă��Ȃ�����������܂��B','Numbers are devided.'); return false;
		}

		if( !this.checkErrorFlag(rarea, 2) ){
			ans.setAlert('�����Ă��鐔���̐���������菭�Ȃ��ł��B','A number is smaller than the size of block.'); return false;
		}

		if( !this.checkErrorFlag(rarea, 3) ){
			ans.setAlert('�������܂܂�Ă��Ȃ��u���b�N������܂��B','A block has no number.'); return false;
		}

		return true;
	},
	//check1st : function(){ return ans.linkBWarea( ans.searchBWarea(function(id){ return (id!=-1 && puz.getNum(id)!=-1); }) );},

	checkErrorFlag : function(area, val){
		for(var id=1;id<=area.max;id++){
			if(area.error[id]==val){
				bd.setErrorCell(area.room[id],1);
				return false;
			}
		}
		return true;
	},
	getNum : function(cc){
		if(cc<0||cc>=bd.cell.length){ return -1;}
		return (bd.getQnumCell(cc)!=-1?bd.getQnumCell(cc):bd.getQansCell(cc));
	},

	searchRarea2 : function(area){
		var max = area.max;
		area.error = new Array();
		area.number = new Array();
		for(var id=1;id<=max;id++){
			area.error[id] = 0;		// ��ŃG���[�\������G���[�̃t���O
			area.number[id] = -1;	// ���̃G���A�ɓ����Ă��鐔��
			var nums = new Array();	// �L�[�̐����������Ă��鐔
			var numcnt = 0;			// �G���A�ɓ����Ă��鐔���̎�ސ�
			var emptycell = 0;		// �����������Ă��Ȃ��Z���̐�
			var filled = 0;			// �G���A�ɓ����Ă��鐔��
			for(var i=0;i<area.room[id].length;i++){
				var c = area.room[id][i];
				var num = this.getNum(c);
				if(num==-1){ emptycell++;}
				else if(isNaN(nums[num])){ numcnt++; filled=num; nums[num]=1;}
				else{ nums[num]++;}
			}
			if(numcnt>1)                               { area.error[id]=4;}
			else if(numcnt==0)                         { area.error[id]=3;}
			else if(numcnt==1 && filled < nums[filled]){ area.error[id]=1; area.number[id]=filled;}
			else if(numcnt==1 && filled > nums[filled]){ area.error[id]=2; area.number[id]=filled;}
			else                                       { area.error[id]=-1;area.number[id]=filled;}
		}
		return area;
	}
};
