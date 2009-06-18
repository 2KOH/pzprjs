//
// �p�Y���ŗL�X�N���v�g�� �͐l�΂g�d�x�`�� ayeheya.js v3.1.9p1
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

	k.fstruct = ["arearoom","cellqnum","cellans"];

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

		base.setTitle("�͐l�΂g�d�x�`", "ekawayeh");
		base.setExpression("�@���N���b�N�ō��}�X���A�E�N���b�N�Ŕ��}�X�m��}�X�����͂ł��܂��B",
						   " Left Click to input black cells, Right Click to input determined white cells.");
		base.setFloatbgcolor("rgb(0, 191, 0)");
	},
	menufix : function(){
		menu.addUseToFlags();
	},
	postfix : function(){ },

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(k.mode==1) this.inputborder(x,y);
			else if(k.mode==3) this.inputcell(x,y);
		};
		mv.mouseup = function(x,y){
			if(this.notInputted()){
				if(k.mode==1){
					if(!kp.enabled()){ this.inputqnum(x,y,99);}
					else{ kp.display(x,y);}
				}
			}
		};
		mv.mousemove = function(x,y){
			if(k.mode==1) this.inputborder(x,y);
			else if(k.mode==3) this.inputcell(x,y);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.mode==3){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca,99);
		};

		if(k.callmode == "pmake"){
			kp.generate(0, true, false, '');
			kp.kpinput = function(ca){
				kc.key_inputqnum(ca,99);
			};
		}
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(127, 127, 127)";
		pc.bcolor = "rgb(127, 255, 160)";
		pc.BBcolor = "rgb(160, 255, 191)";
		pc.BCell_fontcolor = "rgb(224, 224, 224)";
		pc.errcolor1 = "rgb(191, 0, 0)";
		pc.errbcolor1 = "rgb(240, 160, 127)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawWhiteCells(x1,y1,x2,y2);
			this.drawBDline(x1,y1,x2,y2);
			this.drawBlackCells(x1,y1,x2,y2);

			this.drawNumbers(x1,y1,x2,y2);

			this.drawBorders(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawBoxBorders(x1-1,y1-1,x2+1,y2+1,0);

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	pzlinput : function(type, bstr){
		if(type==0 || type==1){
			bstr = enc.decodeBorder(bstr);
			bstr = enc.decodeRoomNumber16(bstr);
		}
		else if(type==2){ bstr = this.decodeKanpen(bstr); }
		else if(type==4){ bstr = this.decodeHeyaApp(bstr);}
	},
	decodeKanpen : function(bstr){
		var rdata = new Array();

		var inp = bstr.split("/");
		inp.shift();

		k.isOneNumber = 0;

		var i, cx ,cy;
		for(i=0;i<inp.length;i++){
			if(inp[i]==""){ break;}
			var pce = inp[i].split("_");
			var sp = { y1:parseInt(pce[0]), x1:parseInt(pce[1]), y2:parseInt(pce[2]), x2:parseInt(pce[3]), num:pce[4]};
			if(sp.num!=""){ bd.setQnumCell(bd.getcnum(sp.x1,sp.y1), parseInt(sp.num,10));}
			for(cx=sp.x1;cx<=sp.x2;cx++){
				for(cy=sp.y1;cy<=sp.y2;cy++){
					rdata[bd.getcnum(cx,cy)] = i;
				}
			}
		}
		this.rdata2Border(rdata);

		k.isOneNumber = 1;
	},
	decodeHeyaApp : function(bstr){
		var rdata = new Array();
		var c=0;
		while(c<bd.cell.length){ rdata[c]=-1; c++;}

		var inp = bstr.split("/");
		var RE1 = new RegExp("(\\d+)in(\\d+)x(\\d+)$","g");
		var RE2 = new RegExp("(\\d+)x(\\d+)$","g");

		k.isOneNumber = 0;

		var i=0;
		c=0;
		while(c<bd.cell.length){
			if(rdata[c]==-1){
				var num, width, height;
				if     (inp[i].match(RE1)){ width = parseInt(RegExp.$2); height = parseInt(RegExp.$3); bd.setQnumCell(bd.getcnum(bd.cell[c].cx,bd.cell[c].cy), parseInt(RegExp.$1)); }
				else if(inp[i].match(RE2)){ width = parseInt(RegExp.$1); height = parseInt(RegExp.$2); }

				for(cx=bd.cell[c].cx;cx<=bd.cell[c].cx+width-1;cx++){
					for(cy=bd.cell[c].cy;cy<=bd.cell[c].cy+height-1;cy++){
						rdata[bd.getcnum(cx,cy)] = i;
					}
				}
				i++;
			}
			c++;
		}
		this.rdata2Border(rdata);

		k.isOneNumber = 1;
	},
	rdata2Border : function(rdata){
		var id;
		for(id=0;id<bd.border.length;id++){
			var cc1 = bd.getcnum(int((bd.border[id].cx-(bd.border[id].cy%2))/2), int((bd.border[id].cy-(bd.border[id].cx%2))/2) );
			var cc2 = bd.getcnum(int((bd.border[id].cx+(bd.border[id].cy%2))/2), int((bd.border[id].cy+(bd.border[id].cx%2))/2) );
			if(cc1!=-1 && cc2!=-1 && rdata[cc1]!=rdata[cc2]){ bd.setQuesBorder(id,1);}
		}
		return true;
	},

	pzloutput : function(type){
		if(type==0)     { document.urloutput.ta.value = enc.getURLbase()+"?"+k.puzzleid+this.pzldata();}
		else if(type==1){ document.urloutput.ta.value = enc.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
		else if(type==2){ document.urloutput.ta.value = enc.kanpenbase()+k.puzzleid+".html?problem="+this.pzldataKanpen();}
		else if(type==3){ document.urloutput.ta.value = enc.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
	},
	pzldata : function(){
		return "/"+k.qcols+"/"+k.qrows+"/"+enc.encodeBorder()+enc.encodeRoomNumber16();
	},
	pzldataKanpen : function(){
		var bstr = "";

		var rarea = ans.searchRarea();
		var id;
		for(id=1;id<=rarea.max;id++){
			var d = ans.getSizeOfArea(rarea,id,f_true);
			if(bd.getQnumCell(bd.getcnum(d.x1,d.y1))>=0){
				bstr += (""+d.y1+"_"+d.x1+"_"+d.y2+"_"+d.x2+"_"+bd.getQnumCell(bd.getcnum(d.x1,d.y1))+"/");
			}
			else{ bstr += (""+d.y1+"_"+d.x1+"_"+d.y2+"_"+d.x2+"_/");}
		}

		return ""+k.qrows+"/"+k.qcols+"/"+rarea.max+"/"+bstr;
	},

	//---------------------------------------------------------
	kanpenOpen : function(array){
		var rmax = array.shift();
		var barray = array.slice(0,rmax);
		var i;
		for(i=0;i<barray.length;i++){ barray[i] = (barray[i].split(" ")).join("_");}
		this.decodeKanpen(""+rmax+"/"+barray.join("/"));
		fio.decodeCellAns(array.slice(rmax,rmax+k.qrows));
	},
	kanpenSave : function(){
		var barray = this.pzldataKanpen().split("/");
		barray.shift(); barray.shift();
		var rmax = barray.shift();
		var i;
		for(i=0;i<barray.length;i++){ barray[i] = (barray[i].split("_")).join(" ");}

		return rmax + "/" + barray.join("/") + fio.encodeCellAns()+"/";
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	check : function(){

		if( !ans.checkSideCell(function(c1,c2){ return (bd.getQansCell(c1)==1 && bd.getQansCell(c2)==1);}) ){
			ans.setAlert('���}�X���^�e���R�ɘA�����Ă��܂��B','Black cells are adjacent.'); return false;
		}

		if( !ans.linkBWarea( ans.searchWarea() ) ){
			ans.setAlert('���}�X�����f����Ă��܂��B','White cells are devided.'); return false;
		}

		var rarea = ans.searchRarea();
		if( !this.checkFractal(rarea) ){
			ans.setAlert('�����̒��̍��}�X���_�Ώ̂ɔz�u����Ă��܂���B', 'Position of black cells in the room is not point symmetric.'); return false;
		}

		if( !ans.checkBlackCellCount(rarea) ){
			ans.setAlert('�����̐����ƍ��}�X�̐�����v���Ă��܂���B','The number of Black cells in the room and The number written in the room is different.'); return false;
		}

		if( !this.checkRowsCols() ){
			ans.setAlert('���}�X��3�����A���ő����Ă��܂��B','White cells are continued for three consecutive room.'); return false;
		}

		if( !ans.isAreaRect(rarea, f_true) ){
			ans.setAlert('�l�p�`�ł͂Ȃ�����������܂��B','There is a room whose shape is not square.'); return false;
		}

		return true;
	},

	checkFractal : function(area){
		for(var id=1;id<=area.max;id++){
			var d = ans.getSizeOfArea(area,id,f_true);
			var sx=d.x1+d.x2+1, sy=d.y1+d.y2+1;
			var movex=0, movey=0;
			for(var i=0;i<area.room[id].length;i++){
				var c=area.room[id][i];
				if(bd.getQansCell(c)==1 ^ bd.getQansCell(bd.getcnum(sx-bd.cell[c].cx-1, sy-bd.cell[c].cy-1))==1){
					bd.setErrorCell(area.room[id],1);
					return false;
				}
			}
		}
		return true;
	},

	checkRowsCols : function(){
		var bx, by, fx, fy, cnt;

		for(by=1;by<2*k.qrows;by+=2){
			cnt=-1;
			for(bx=1;bx<2*k.qcols;bx++){
				if(bx%2==1){
					if( bd.getQansCell(bd.getcnum( int(bx/2),int(by/2) ))!=1 && cnt==-1 ){ cnt=0; fx=bx;}
					else if( bd.getQansCell(bd.getcnum( int(bx/2),int(by/2) ))==1 ){ cnt=-1;}

					if( cnt==2 ){
						for(bx=fx;bx<2*k.qcols;bx+=2){
							var cc = bd.getcnum( int(bx/2),int(by/2) );
							if( bd.getQansCell(cc)!=1 ){ bd.setErrorCell([cc],1);}else{ break;}
						}
						return false;
					}
				}
				else{
					if( bd.getQuesBorder(bd.getbnum(bx,by))==1 && cnt>=0 ){ cnt++;}
				}
			}
		}
		for(bx=1;bx<2*k.qcols;bx+=2){
			cnt=-1;
			for(by=1;by<2*k.qrows;by++){
				if(by%2==1){
					if( bd.getQansCell(bd.getcnum( int(bx/2),int(by/2) ))!=1 && cnt==-1 ){ cnt=0; fy=by;}
					else if( bd.getQansCell(bd.getcnum( int(bx/2),int(by/2) ))==1 ){ cnt=-1;}

					if( cnt>=2 ){
						for(by=fy;by<2*k.qrows;by+=2){
							var cc = bd.getcnum( int(bx/2),int(by/2) );
							if( bd.getQansCell(cc)!=1 ){ bd.setErrorCell([cc],1);}else{ break;}
						}
						return false;
					}
				}
				else{
					if( bd.getQuesBorder(bd.getbnum(bx,by))==1 && cnt>=0 ){ cnt++;}
				}
			}
		}

		return true;
	}
};
