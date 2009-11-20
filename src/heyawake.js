//
// �p�Y���ŗL�X�N���v�g�� �ւ�킯�� heyawake.js v3.2.3
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

		k.fstruct = ["arearoom","cellqnum","cellans"];

		//k.def_csize = 36;
		//k.def_psize = 24;
		k.area = { bcell:0, wcell:1, number:0, disroom:0};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		base.setTitle("�ւ�킯","Heyawake");
		base.setExpression("�@���N���b�N�ō��}�X���A�E�N���b�N�Ŕ��}�X�m��}�X�����͂ł��܂��B",
						   " Left Click to input black cells, Right Click to input determined white cells.");
		base.setFloatbgcolor("rgb(0, 191, 0)");
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
			var m=d.x2-d.x1+1, n=d.y2-d.y1+1; if(m>n){ var t=m;m=n;n=t;}
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
		enc.pzlimport = function(type, bstr){
			if(type==0 || type==1){
				bstr = this.decodeBorder(bstr);
				bstr = this.decodeRoomNumber16(bstr);
			}
			else if(type==2){ bstr = this.decodeKanpen(bstr); }
			else if(type==4){ bstr = this.decodeHeyaApp(bstr);}
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
			else if(type==2){ document.urloutput.ta.value = this.kanpenbase()+k.puzzleid+".html?problem="+this.pzldataKanpen();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
			else if(type==4){ document.urloutput.ta.value = "http://www.geocities.co.jp/heyawake/?problem="+this.pzldataHeyaApp();}
		};
		enc.pzldata = function(){
			return "/"+k.qcols+"/"+k.qrows+"/"+this.encodeBorder()+this.encodeRoomNumber16();
		};

		enc.decodeKanpen = function(bstr){
			var rdata = [];

			var inp = bstr.split("/");
			inp.shift();

			for(var i=0;i<inp.length;i++){
				if(inp[i]==""){ break;}
				var pce = inp[i].split("_");
				var sp = { y1:parseInt(pce[0]), x1:parseInt(pce[1]), y2:parseInt(pce[2]), x2:parseInt(pce[3]), num:pce[4]};
				if(sp.num!=""){ bd.sQnC(bd.cnum(sp.x1,sp.y1), parseInt(sp.num,10));}
				for(var cx=sp.x1;cx<=sp.x2;cx++){
					for(var cy=sp.y1;cy<=sp.y2;cy++){
						rdata[bd.cnum(cx,cy)] = i;
					}
				}
			}
			this.rdata2Border(rdata);
		};
		enc.decodeHeyaApp = function(bstr){
			var rdata = [];
			var c=0;
			while(c<bd.cellmax){ rdata[c]=-1; c++;}

			var inp = bstr.split("/");

			var i=0; c=0;
			while(c<bd.cellmax){
				if(rdata[c]==-1){
					var width, height;
					if(inp[i].match(/(\d+in)?(\d+)x(\d+)$/)){
						width = parseInt(RegExp.$2);
						height = parseInt(RegExp.$3);
						if(RegExp.$1.length>0){
							bd.sQnC(c, parseInt(RegExp.$1));
						}
					}

					for(var cx=bd.cell[c].cx;cx<=bd.cell[c].cx+width-1;cx++){
						for(var cy=bd.cell[c].cy;cy<=bd.cell[c].cy+height-1;cy++){
							rdata[bd.cnum(cx,cy)] = i;
						}
					}
					i++;
				}
				c++;
			}
			this.rdata2Border(rdata);
		};
		enc.rdata2Border = function(rdata){
			for(var id=0;id<bd.bdmax;id++){
				var cc1=bd.cc1(id), cc2=bd.cc2(id);
				if(cc1!=-1 && cc2!=-1 && rdata[cc1]!=rdata[cc2]){ bd.sQuB(id,1);}
			}
			return true;
		};

		enc.pzldataKanpen = function(){
			var bstr = "";

			var rinfo = area.getRoomInfo();
			for(var id=1;id<=rinfo.max;id++){
				var d = ans.getSizeOfClist(rinfo.room[id].idlist,f_true);
				if(bd.QnC(bd.cnum(d.x1,d.y1))>=0){
					bstr += (""+d.y1+"_"+d.x1+"_"+d.y2+"_"+d.x2+"_"+bd.QnC(bd.cnum(d.x1,d.y1))+"/");
				}
				else{ bstr += (""+d.y1+"_"+d.x1+"_"+d.y2+"_"+d.x2+"_/");}
			}

			return ""+k.qrows+"/"+k.qcols+"/"+rinfo.max+"/"+bstr;
		};
		enc.pzldataHeyaApp = function(){
			var barray = [];

			var rinfo = area.getRoomInfo();
			for(var id=1;id<=rinfo.max;id++){
				var d = ans.getSizeOfClist(rinfo.room[id].idlist,f_true);
				if(bd.QnC(bd.cnum(d.x1,d.y1))>=0){
					barray.push(""+bd.QnC(bd.cnum(d.x1,d.y1))+"in"+(d.x2-d.x1+1)+"x"+(d.y2-d.y1+1));
				}
				else{ barray.push(""+(d.x2-d.x1+1)+"x"+(d.y2-d.y1+1));}
			}
			return ""+k.qcols+"x"+k.qrows+"/"+barray.join("/");
		};

		//---------------------------------------------------------
		fio.kanpenOpen = function(array){
			var rmax = array.shift();
			var barray = array.slice(0,rmax);
			for(var i=0;i<barray.length;i++){ barray[i] = (barray[i].split(" ")).join("_");}
			enc.decodeKanpen(""+rmax+"/"+barray.join("/"));
			this.decodeCellAns(array.slice(rmax,rmax+k.qrows));
		};
		fio.kanpenSave = function(){
			var barray = enc.pzldataKanpen().split("/");
			barray.shift(); barray.shift();
			var rmax = barray.shift();
			for(var i=0;i<barray.length;i++){ barray[i] = (barray[i].split("_")).join(" ");}

			return rmax + "/" + barray.join("/") + this.encodeCellAns()+"/";
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

			if( !this.checkRowsCols() ){
				this.setAlert('���}�X��3�����A���ő����Ă��܂��B','White cells are continued for three consecutive room.'); return false;
			}

			if( !this.checkAreaRect(rinfo, f_true) ){
				this.setAlert('�l�p�`�ł͂Ȃ�����������܂��B','There is a room whose shape is not square.'); return false;
			}

			return true;
		},

		ans.checkRowsCols = function(){
			var fx, fy;

			for(var by=1;by<2*k.qrows;by+=2){
				var cnt=-1;
				for(var bx=1;bx<2*k.qcols;bx++){
					if(bx%2==1){
						if( bd.isWhite(bd.cnum(bx>>1,by>>1)) && cnt==-1 ){ cnt=0; fx=bx;}
						else if( bd.isBlack(bd.cnum(bx>>1,by>>1)) ){ cnt=-1;}

						if( cnt==2 ){
							for(bx=fx;bx<2*k.qcols;bx+=2){
								var cc = bd.cnum(bx>>1,by>>1);
								if( bd.isWhite(cc) ){ bd.sErC([cc],1);}else{ break;}
							}
							return false;
						}
					}
					else{
						if( bd.isBorder(bd.bnum(bx,by)) && cnt>=0 ){ cnt++;}
					}
				}
			}
			for(var bx=1;bx<2*k.qcols;bx+=2){
				var cnt=-1;
				for(var by=1;by<2*k.qrows;by++){
					if(by%2==1){
						if( bd.isWhite(bd.cnum(bx>>1,by>>1)) && cnt==-1 ){ cnt=0; fy=by;}
						else if( bd.isBlack(bd.cnum(bx>>1,by>>1)) ){ cnt=-1;}

						if( cnt>=2 ){
							for(by=fy;by<2*k.qrows;by+=2){
								var cc = bd.cnum(bx>>1,by>>1);
								if( bd.isWhite(cc) ){ bd.sErC([cc],1);}else{ break;}
							}
							return false;
						}
					}
					else{
						if( bd.isBorder(bd.bnum(bx,by)) && cnt>=0 ){ cnt++;}
					}
				}
			}

			return true;
		};
	}
};
