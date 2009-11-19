//
// �p�Y���ŗL�X�N���v�g�� �X�����[���� slalom.js v3.2.3
//
Puzzles.slalom = function(){ };
Puzzles.slalom.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
		k.irowake = 1;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
		k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
		k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
		k.isLineCross     = 0;	// 1:������������p�Y��
		k.isCenterLine    = 1;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

		k.dispzero      = 0;	// 1:0��\�����邩�ǂ���
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
		k.isKanpenExist = 1;	// 1:pencilbox/�J���y���ɂ���p�Y��

		k.fstruct = ["others", "borderline"];

		//k.def_csize = 36;
		//k.def_psize = 24;
		//k.area = { bcell:0, wcell:0, number:0};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		if(k.EDITOR){
			base.setExpression("�@���̋L����QWE�̊e�L�[�œ��́AR�L�[�ŏ����ł��܂��B�����͓_����ŃL�[�{�[�h���͂ł��B����S�L�[���A�}�E�X�h���b�O�ňړ��o���܂��B���}�X�̓}�E�X�̍��N���b�N�A�_���̓h���b�O�ł����͂ł��܂��B",
							   " Press each QWE key to input question marks and R key to erase a mark. Type number key on dotted line to input numbers. Type S key or Left Button Drag to move circle. Left Click to input black cells. Left Button Drag out of circles to also input dotted line.");
		}
		else{
			base.setExpression("�@���h���b�O�Ő����A�E�N���b�N�Ł~�����͂ł��܂��B",
							   " Left Button Drag to input black cells, Right Click to input a cross.");
		}
		base.setTitle("�X�����[��","Slalom");
		base.setFloatbgcolor("rgb(96, 96, 255)");
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
			if(k.editmode){ this.inputGate();}
			else if(k.playmode){
				if(this.btn.Left) this.inputLine();
				else if(this.btn.Right) this.inputpeke();
			}
		};
		mv.mouseup = function(){
			if(k.editmode){
				if(this.inputData==10){ this.inputStartid_up(); }
				else if(this.notInputted() && !kp.enabled()){ this.inputQues_slalom();}
				else if(this.notInputted()){ kp.display();}
			}
		};
		mv.mousemove = function(){
			if(k.editmode){ this.inputGate();}
			else if(k.playmode){
				if(this.btn.Left) this.inputLine();
				else if(this.btn.Right) this.inputpeke();
			}
		};

		mv.inputQues_slalom = function(){
			var cc = this.cellid();
			if(cc==-1){ return;}

			if(cc!=tc.getTCC()){
				var cc0 = tc.getTCC(); tc.setTCC(cc);
				pc.paint(bd.cell[cc0].cx-1, bd.cell[cc0].cy-1, bd.cell[cc0].cx, bd.cell[cc0].cy);
			}
			else{
				if     (this.btn.Left ){ bd.sQuC(cc, {0:1,1:21,21:22,22:0}[bd.QuC(cc)]);}
				else if(this.btn.Right){ bd.sQuC(cc, {0:22,22:21,21:1,1:0}[bd.QuC(cc)]);}
				bd.sQnC(cc,-1);
			}
			bd.hinfo.generateGates();

			pc.paint(bd.cell[cc].cx, bd.cell[cc].cy, bd.cell[cc].cx+1, bd.cell[cc].cy+1);
			pc.dispnumStartpos(bd.startid);
		};
		mv.inputStartid_up = function(){
			this.inputData = -1;
			var cc0 = bd.startid;
			pc.paintCell(cc0);
		};
		mv.inputGate = function(){
			var pos = this.crosspos(0.30);
			var cc  = this.cellid();
			if(cc==-1){ return;}
			if(pos.x==this.firstPos.x && pos.y==this.firstPos.y && cc==this.mouseCell){ return;}

			if(this.inputData==-1){
				if(bd.startid==cc){ this.inputData=10;}
				if     (Math.abs(pos.y-this.firstPos.y)==1){ this.inputData=21;}
				else if(Math.abs(pos.x-this.firstPos.x)==1){ this.inputData=22;}
				if(bd.QuC(cc)==this.inputData){ this.inputData=0;}
			}
			else if(this.inputData==10){
				if(bd.QuC(cc)==1){ return;}
				var cc0 = bd.startid;
				bd.startid=cc;
				pc.paintCell(cc0);
			}
			else{
				if     (this.inputData!=21 && Math.abs(pos.y-this.firstPos.y)==1){ return;}
				else if(this.inputData!=22 && Math.abs(pos.x-this.firstPos.x)==1){ return;}
			}

			if((this.inputData==0 || this.inputData==21 || this.inputData==22)
				&& bd.QuC(cc)!=1 && bd.QuC(cc)!=this.inputData)
			{
				bd.sQuC(cc,this.inputData);
				bd.hinfo.generateGates();
			}

			this.firstPos = pos;
			this.mouseCell = cc;
			pc.paint(bd.cell[cc].cx, bd.cell[cc].cy, bd.cell[cc].cx+1, bd.cell[cc].cy+1);
			pc.dispnumStartpos(bd.startid);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(ca=='z' && !this.keyPressed){ this.isZ=true; return;}
			if(ca=='x' && !this.keyPressed){ this.isX=true; pc.drawNumbersOnGate(true); return;}
			if(k.playmode){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum_slalom(ca);
		};
		kc.key_inputqnum_slalom = function(ca){
			var cc = tc.getTCC();

			if(ca=='q'||ca=='w'||ca=='e'||ca=='r'||ca=='s'||ca==' '){
				var old=bd.QuC(cc), newques=-1;
				if     (ca=='q'){ newques=(old!=1?1:0);}
				else if(ca=='w'){ newques=21;}
				else if(ca=='e'){ newques=22;}
				else if(ca=='r'||ca==' '){ newques= 0;}
				else if(ca=='s'){ bd.inputstartid(cc); return;}
				else{ return;}
				if(old==newques){ return;}

				bd.sQuC(cc,newques);
				if(newques==0){ bd.sQnC(cc,-1);}
				if(old==21||old==22||newques==21||newques==22){ bd.hinfo.generateGates();}

				var cx=bd.cell[cc].cx, cy=bd.cell[cc].cy;
				pc.paint(cx,cy,cx+1,cy+1);
				pc.dispnumStartpos(bd.startid);
			}
			else if(bd.QuC(cc)==1){
				this.key_inputqnum(ca);
			}
		};
		kc.keyup = function(ca){
			if(ca=='z'){ this.isZ=false;}
			if(ca=='x'){ pc.drawNumbersOnGate(false); this.isX=false;}
		};
		kc.isZ = false;
		kc.isX = false;

		if(k.EDITOR){
			kp.kpgenerate = function(mode){
				this.inputcol('image','knumq','q',[0,0]);
				this.inputcol('image','knums','s',[1,0]);
				this.inputcol('image','knumw','w',[2,0]);
				this.inputcol('image','knume','e',[3,0]);
				this.inputcol('num','knumr','r',' ');
				this.insertrow();
				this.inputcol('num','knum1','1','1');
				this.inputcol('num','knum2','2','2');
				this.inputcol('num','knum3','3','3');
				this.inputcol('num','knum4','4','4');
				this.inputcol('num','knum5','5','5');
				this.insertrow();
				this.inputcol('num','knum6','6','6');
				this.inputcol('num','knum7','7','7');
				this.inputcol('num','knum8','8','8');
				this.inputcol('num','knum9','9','9');
				this.inputcol('num','knum0','0','0');
				this.insertrow();
				this.inputcol('num','knum.','-','-');
				this.inputcol('num','knum_',' ',' ');
				this.insertrow();
			};
			kp.generate(kp.ORIGINAL, true, false, kp.kpgenerate);
			kp.imgCR = [4,1];
			kp.kpinput = function(ca){
				kc.key_inputqnum_slalom(ca);
			};
		}

		bd.enableLineNG = true;

		bd.startid = 0;
		bd.inputstartid = function(cc){
			if(cc!=this.startid){
				var cc0 = this.startid;
				this.startid = cc;
				pc.paintCell(cc0);
				pc.paintCell(cc);
			}
		};

		bd.hinfo = new Hurdle();
		bd.hinfo.init();

		bd.initSpecial = function(col,row){
			if(!base.initProcess){
				bd.startid = 0;
				bd.hinfo.init();
			}
		};

		bd.maxnum = 255;
		bd.nummaxfunc = function(cc){ return Math.min(bd.hinfo.max,bd.maxnum);}

		menu.ex.adjustSpecial = function(type,key){
			um.disableRecord();
			var cx=bd.cell[bd.startid].cx, cy=bd.cell[bd.startid].cy;
			switch(type){
			case 1: // �㉺���]
				bd.startid = bd.cnum(cx,k.qrows-1-cy);
				break;
			case 2: // ���E���]
				bd.startid = bd.cnum(k.qcols-1-cx,cy);
				break;
			case 3: // �E90�����]
				bd.startid = bd.cnum2(k.qrows-1-cy,cx,k.qrows,k.qcols);
				break;
			case 4: // ��90�����]
				bd.startid = bd.cnum2(cy,k.qcols-1-cx,k.qrows,k.qcols);
				break;
			case 5: // �Ֆʊg��
				if     (key==k.UP){ bd.startid = bd.cnum2(cx  ,cy+1,k.qcols,k.qrows+1);}
				else if(key==k.DN){ bd.startid = bd.cnum2(cx  ,cy  ,k.qcols,k.qrows+1);}
				else if(key==k.LT){ bd.startid = bd.cnum2(cx+1,cy  ,k.qcols+1,k.qrows);}
				else if(key==k.RT){ bd.startid = bd.cnum2(cx  ,cy  ,k.qcols+1,k.qrows);}
				break;
			case 6: // �Ֆʏk��
				if     (key==k.DN && cy<k.qrows-1){ bd.startid = bd.cnum2(cx  ,cy  ,k.qcols,k.qrows-1);}
				else if(key==k.UP || key==k.DN)   { bd.startid = bd.cnum2(cx  ,cy-1,k.qcols,k.qrows-1);}
				else if(key==k.RT && cx<k.qcols-1){ bd.startid = bd.cnum2(cx  ,cy  ,k.qcols-1,k.qrows);}
				else if(key==k.LT || key==k.RT)   { bd.startid = bd.cnum2(cx-1,cy  ,k.qcols-1,k.qrows);}
				break;
			}
			um.enableRecord();
		};
		menu.ex.adjustSpecial2 = function(type,key){
			bd.hinfo.generateGates();	// �O�̂���
		};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_LIGHT;
		pc.linecolor = "rgb(32, 32, 255)";	// �F�����Ȃ��̏ꍇ
		pc.pekecolor = "rgb(0, 160, 0)";
		pc.errlinecolor2 = "rgb(160, 150, 255)";
		pc.errbcolor1 = pc.errbcolor1_DARK;
		pc.fontcolor = pc.fontErrcolor = "white";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);

			this.drawBGCells(x1,y1,x2,y2);
			this.drawGrid(x1,y1,x2,y2);

			this.drawGates(x1,y1,x2,y2)

			this.drawBlackCells(x1,y1,x2,y2);
			this.drawNumbers(x1,y1,x2,y2);

			this.drawPekes(x1,y1,x2,y2,1);
			this.drawLines(x1,y1,x2,y2);

			this.drawStartpos(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawTarget(x1,y1,x2,y2);
		};

		// �I�[�o�[���C�h drawBlackCells�p
		pc.setCellColor = function(cc){
			var err = bd.cell[cc].error;
			if(bd.cell[cc].ques!==1){ return false;}
			else if(err===0)        { g.fillStyle = this.Cellcolor; return true;}
			else if(err===1)        { g.fillStyle = this.errcolor1; return true;}
			return false;
		};

		pc.drawGates = function(x1,y1,x2,y2){
			var lw = (mf(k.cwidth/10)>=3?mf(k.cwidth/10):3); //LineWidth
			var lm = mf((lw-1)/2)+1; //LineMargin
			var ll = lw*1.1;	//LineLength
			var headers = ["c_dl21", "c_dl22"];

			var clist = this.cellinside(x1,y1,x2,y2);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				g.fillStyle = (bd.cell[c].error===4 ? this.errcolor1 : this.Cellcolor);

				for(var j=bd.cell[c].py,max=bd.cell[c].py+k.cheight;j<max;j+=ll*2){ //����
					if(bd.cell[c].ques===21){
						if(this.vnop([headers[0],c,mf(j)].join("_"),1)){
							g.fillRect(bd.cell[c].px+mf(k.cwidth/2)-lm+1, j, lw, ll);
						}
					}
					else{ this.vhide([headers[0],c,mf(j)].join("_"));}
				}

				for(var j=bd.cell[c].px,max=bd.cell[c].px+k.cwidth;j<max;j+=ll*2){ //�悱
					if(bd.cell[c].ques===22){
						if(this.vnop([headers[1],c,mf(j)].join("_"),1)){
							g.fillRect(j, bd.cell[c].py+mf(k.cheight/2)-lm+1, ll, lw);
						}
					}
					else{ this.vhide([headers[1],c,mf(j)].join("_"));}
				}
			}
		};

		pc.drawStartpos = function(x1,y1,x2,y2){
			var c = bd.startid;
			if(bd.cell[c].cx<x1-2 || x2+2<bd.cell[c].cx || bd.cell[c].cy<y1-2 || y2+2<bd.cell[c].cy){ return;}

			var rsize  = k.cwidth*0.45;
			var rsize2 = k.cwidth*0.40;
			var vids = ["sposa_","sposb_"];
			this.vdel(vids);

			var px=bd.cell[c].px+mf(k.cwidth/2), py=bd.cell[c].py+mf(k.cheight/2);

			g.fillStyle = this.Cellcolor;
			if(this.vnop(vids[0],1)){
				g.beginPath();
				g.arc(px, py, rsize, 0, Math.PI*2, false);
				g.fill();
			}

			g.fillStyle = (mv.inputData==10 ? this.errbcolor1 : "white");
			if(this.vnop(vids[1],1)){
				g.beginPath();
				g.arc(px, py, rsize2, 0, Math.PI*2, false);
				g.fill();
			}

			this.dispnumStartpos(c);

			this.vinc();
		};
		pc.dispnumStartpos = function(c){
			var num = bd.hinfo.max, obj = bd.cell[c];
			if(num<0){ this.hideEL(obj.numobj); return;}

			if(!obj.numobj){ obj.numobj = this.CreateDOMAndSetNop();}
			var fontratio = (num<10?0.75:0.66);
			this.dispnum(obj.numobj, 1, ""+num, fontratio, "black", obj.px, obj.py);
		};

		line.repaintParts = function(id){
			var bx = bd.border[id].cx; var by = bd.border[id].cy;
			pc.drawStartpos(mf((bx-by%2)/2),mf((by-bx%2)/2),mf((bx-by%2)/2),mf((by-bx%2)/2));
			pc.drawStartpos(mf((bx+by%2)/2),mf((by+bx%2)/2),mf((bx+by%2)/2),mf((by+bx%2)/2));
		};

		// X�L�[���������ɐ�����\�����郁�\�b�h
		pc.drawNumbersOnGate = function(keydown){
			if(keydown){ bd.hinfo.generateGateNumber();}

			for(var c=0;c<bd.cellmax;c++){
				if(bd.cell[c].ques!==21 && bd.cell[c].ques!==22){ continue;}
				var obj = bd.cell[c];

				var r = bd.hinfo.getGateid(c);
				var num = (r>0?bd.hinfo.data[r].number:-1);
				if(!keydown || num<=0){ this.hideEL(obj.numobj); continue;}

				if(!obj.numobj){ obj.numobj = this.CreateDOMAndSetNop();}
				var fontratio = (num<10?0.8:(num<100?0.7:0.55));
				this.dispnum(obj.numobj, 1, ""+num, fontratio ,"tomato", obj.px, obj.py);
			}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==0 || type==1){
				if(this.checkpflag("p")){ bstr = this.decodeSlalom(bstr,1);}
				else{ bstr = this.decodeSlalom(bstr,0);}
			}
			else if(type==2){ bstr = this.decodeKanpen(bstr); }
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+"/p"+this.pzldata(1);}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?"+this.pzldata(0);}
			else if(type==2){ document.urloutput.ta.value = this.kanpenbase()+"slalom.html?problem="+this.encodeKanpen();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+"/p"+this.pzldata(1);}
		};
		enc.pzldata = function(ver){
			return "/"+k.qcols+"/"+k.qrows+"/"+this.encodeSlalom(ver);
		};

		enc.decodeSlalom = function(bstr,ver){
			var array = bstr.split("/");

			var c=0, i=0;
			for(i=0;i<array[0].length;i++){
				var ca = array[0].charAt(i);

				if     (ca=='1'){ bd.sQuC(c,  1); c++;}
				else if(ca=='2'){ bd.sQuC(c, 21); c++;}
				else if(ca=='3'){ bd.sQuC(c, 22); c++;}
				else if(this.include(ca,"4","9")||this.include(ca,"a","z")){ c += (parseInt(ca,36)-3);}
				else{ c++;}

				if(c >= bd.cellmax){ break;}
			}
			bd.hinfo.generateGates();

			if(ver==0){
				var i0 = i+1, r = 1;
				for(i=i0;i<array[0].length;i++){
					var ca = array[0].charAt(i);

					if(this.include(ca,"0","9")||this.include(ca,"a","f")){
						bd.hinfo.data[r].number = parseInt(bstr.substr(i  ,1),16); r++;
					}
					else if(ca == '-'){
						bd.hinfo.data[r].number = parseInt(bstr.substr(i+1,2),16); r++; i+=2;
					}
					else if(this.include(ca,"g","z")){ r+=(parseInt(ca,36)-15);}
					else{ r++;}

					if(r > bd.hinfo.max){ break;}
				}

				for(var c=0;c<bd.cellmax;c++){
					var idlist=bd.hinfo.getConnectingGate(c), min=1000;
					for(var i=0;i<idlist.length;i++){
						var val=bd.hinfo.data[idlist[i]].number;
						if(val>0){ min=Math.min(min,val);}
					}
					bd.sQnC(c, (min<1000?min:-1));
				}
			}
			else if(ver==1){
				var c=0, i0=i+1, spare=0;
				for(i=i0;i<array[0].length;i++){
					if(bd.QuC(c)!=1){ i--;}
					else if(spare>0){ i--; spare--;}
					else{
						var ca = array[0].charAt(i);

						if(this.include(ca,"0","9")||this.include(ca,"a","f")){ bd.sQnC(c, parseInt(bstr.substr(i,1),16));}
						else if(ca=='-'){ bd.sQnC(c, parseInt(bstr.substr(i+1,2),16)); i+=2;}
						else if(ca>='g' && ca<='z'){ spare = (parseInt(ca,36)-15) - 1;}
					}
					c++;
					if(c > bd.cellmax){ break;}
				}
			}

			bd.startid = parseInt(array[1]);

			return array[0].substr(i);
		};
		enc.encodeSlalom = function(ver){
			var cm="", count=0;
			for(var i=0;i<bd.cellmax;i++){
				var pstr="";
				if     (bd.QuC(i)== 1){ pstr = "1";}
				else if(bd.QuC(i)==21){ pstr = "2";}
				else if(bd.QuC(i)==22){ pstr = "3";}
				else{ pstr = ""; count++;}

				if(count==0){ cm += pstr;}
				else if(pstr || count==32){ cm+=((3+count).toString(36)+pstr); count=0;}
			}
			if(count>0){ cm+=(3+count).toString(36);}

			count=0;
			if(ver==0){
				bd.hinfo.generateAll();
				for(var r=1;r<=bd.hinfo.max;r++){
					var pstr = "";
					var val = bd.hinfo.data[r].number;

					if     (val>= 0 && val< 16){ pstr =       val.toString(16);}
					else if(val>=16 && val<256){ pstr = "-" + val.toString(16);}
					else{ count++;}

					if(count==0){ cm += pstr;}
					else if(pstr || count==20){ cm+=((15+count).toString(36)+pstr); count=0;}
				}
				if(count>0){ cm+=(15+count).toString(36);}
			}
			else if(ver==1){
				for(var c=0;c<bd.cellmax;c++){
					if(bd.QuC(c)!=1){ continue;}

					var pstr = "";
					var val = bd.QnC(c);

					if     (val>= 1 && val< 16){ pstr =       val.toString(16);}
					else if(val>=16 && val<256){ pstr = "-" + val.toString(16);}
					else{ count++;}

					if(count==0){ cm += pstr;}
					else if(pstr || count==20){ cm+=((15+count).toString(36)+pstr); count=0;}
				}
				if(count>0){ cm+=(15+count).toString(36);}
			}

			cm += ("/"+bd.startid.toString());

			return cm;
		};

		enc.decodeKanpen = function(bstr){
			bstr = (bstr.split("_")).join(" ");
			fio.decodeCell( function(c,ca){
				if     (ca == "+"){ bd.startid=c;}
				else if(ca == "|"){ bd.sQuC(c,21);}
				else if(ca == "-"){ bd.sQuC(c,22);}
				else if(ca != "."){ bd.sQuC(c, 1); if(ca!="0"){ bd.sQnC(c, parseInt(ca));} }
			},bstr.split("/"));
			bd.hinfo.generateGates();
			return "";
		};
		enc.encodeKanpen = function(){
			return ""+k.qrows+"/"+k.qcols+"/"+fio.encodeCell( function(c){
				if     (bd.startid==c){ return "+_";}
				else if(bd.QuC(c)== 1){
					if(bd.QnC(c)>0){ return bd.QnC(c).toString()+"_";}
					else{ return "0_";}
				}
				else if(bd.QuC(c)==21){ return "|_";}
				else if(bd.QuC(c)==22){ return "-_";}
				else{ return "._";}
			});
		};

		//---------------------------------------------------------
		fio.decodeOthers = function(array){
			if(array.length<k.qrows){ return false;}
			if(fio.filever==0){
				var sv_num = [];
				this.decodeCell( function(c,ca){
					sv_num[c]=-1;
					if     (ca == "#"){ bd.sQuC(c,1);}
					else if(ca == "o"){ bd.startid=c;}
					else if(ca != "."){
						if     (ca.charAt(0)=="i"){ bd.sQuC(c,21);}
						else if(ca.charAt(0)=="w"){ bd.sQuC(c,22);}
						if(ca.length>1){ sv_num[c] = parseInt(ca.substr(1));}
					}
				},array.slice(0,k.qrows));
				bd.hinfo.generateGates();

				for(var c=0;c<bd.cellmax;c++){
					if(sv_num[c]!=-1){ bd.hinfo.data[bd.hinfo.getGateid(c)].number = sv_num[c];}
				}
				for(var c=0;c<bd.cellmax;c++){
					var idlist=bd.hinfo.getConnectingGate(c), min=1000;
					for(var i=0;i<idlist.length;i++){
						var val=bd.hinfo.data[idlist[i]].number;
						if(val>0){ min=Math.min(min,val);}
					}
					bd.sQnC(c, (min<1000?min:-1));
				}
			}
			else if(fio.filever==1){
				this.decodeCell( function(c,ca){
					if     (ca == "o"){ bd.startid=c;}
					else if(ca == "#"){ bd.sQuC(c,1);}
					else if(ca == "i"){ bd.sQuC(c,21);}
					else if(ca == "-"){ bd.sQuC(c,22);}
					else if(ca != "."){ bd.sQuC(c,1); bd.sQnC(c, parseInt(ca));}
				},array.slice(0,k.qrows));
				bd.hinfo.generateGates();
			}
			return true;
		};
		fio.encodeOthers = function(){
			fio.filever = 1;
			return (""+this.encodeCell( function(c){
				if     (bd.startid==c){ return "o ";}
				else if(bd.QuC(c)== 1){
					if(bd.QnC(c)>0){ return bd.QnC(c).toString()+" ";}
					else{ return "# ";}
				}
				else if(bd.QuC(c)==21){ return "i ";}
				else if(bd.QuC(c)==22){ return "- ";}
				else{ return ". ";}
			}) );
		};

		fio.kanpenOpen = function(array){
			var barray = array.slice(0,k.qrows);
			for(var i=0;i<barray.length;i++){ barray[i] = (barray[i].split(" ")).join("_");}
			enc.decodeKanpen(barray.join("/"));
			this.decodeBorderLine(array.slice(k.qrows,3*k.qrows-1));
		};
		fio.kanpenSave = function(){
			var barray = enc.encodeKanpen().split("/");
			barray.shift(); barray.shift();
			for(var i=0;i<barray.length;i++){ barray[i] = (barray[i].split("_")).join(" ");}

			return barray.join("/") + this.encodeBorderLine()+"/";
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){
			bd.hinfo.generateAll();

			if( !this.checkAllCell(function(c){ return (bd.QuC(c)==1 && line.lcntCell(c)>0);}) ){
				this.setAlert('���}�X�ɐ����ʂ��Ă��܂��B','A line is over a black cell.'); return false;
			}

			if( !this.checkLcntCell(4) ){
				this.setAlert('�������Ă����������܂��B','There is a crossing line.'); return false;
			}

			if( !this.checkLcntCell(3) ){
				this.setAlert('���򂵂Ă����������܂��B','There is a branch line.'); return false;
			}

			if( !this.checkGateLine(1) ){
				this.setAlert('�����Q��ȏ�ʉ߂��Ă�����傪����܂��B','A line goes through a gate twice or more.'); return false;
			}

			if( !this.checkStartid() ){
				this.setAlert('����������Q�{�o�Ă��܂���B','A line goes through a gate twice or more.'); return false;
			}

			if( !this.checkGateNumber() ){
				this.setAlert('�����ʉ߂��鏇�Ԃ��Ԉ���Ă��܂��B','The order of passing the gate is wrong.'); return false;
			}

			if( !this.checkLcntCell(1) ){
				this.setAlert('�����r���œr�؂�Ă��܂��B','There is a dead-end line.'); return false;
			}

			if( !this.checkOneLoop() ){
				this.setAlert('�ւ�������ł͂���܂���B','There are two or more loops.'); return false;
			}

			if( !this.checkGateLine(2) ){
				this.setAlert('�����ʉ߂��Ă��Ȃ����傪����܂��B','There is a gate that the line is not passing.'); return false;
			}

			return true;
		};
		ans.check1st = function(){ return this.checkLcntCell(1);};

		ans.checkStartid = function(){
			if(line.lcntCell(bd.startid)!=2){
				bd.sErC(bd.startid,1);
				return false;
			}
			return true;
		};
		ans.checkGateLine = function(type){
			for(var r=1;r<=bd.hinfo.max;r++){
				var cnt=0;
				for(var i=0;i<bd.hinfo.data[r].clist.length;i++){
					if(line.lcntCell(bd.hinfo.data[r].clist[i])>0){ cnt++;}
				}
				if((type==1 && cnt>1)||(type==2 && cnt==0)){
					bd.sErC(bd.hinfo.data[r].clist, 4);
					bd.sErC(bd.hinfo.getGatePole(r),1)
					return false;
				}
			}
			return true;
		};
		ans.checkGateNumber = function(){
			var sid = [];
			if(bd.isLine(bd.rb(bd.startid))){ sid.push({id:bd.rb(bd.startid),dir:4});}
			if(bd.isLine(bd.db(bd.startid))){ sid.push({id:bd.db(bd.startid),dir:2});}
			if(bd.isLine(bd.lb(bd.startid))){ sid.push({id:bd.lb(bd.startid),dir:3});}
			if(bd.isLine(bd.ub(bd.startid))){ sid.push({id:bd.ub(bd.startid),dir:1});}

			for(var i=0;i<sid.length;i++){
				var bx=bd.border[sid[i].id].cx, by=bd.border[sid[i].id].cy;
				var dir=sid[i].dir, ordertype=-1, passing=0;

				while(1){
					switch(dir){ case 1: by--; break; case 2: by++; break; case 3: bx--; break; case 4: bx++; break;}
					if((bx+by)%2==0){
						var cc = bd.cnum(mf(bx/2),mf(by/2));
						if(cc==bd.startid){ return true;} // �����Ɩ߂��Ă���

						if(bd.QuC(cc)==21 || bd.QuC(cc)==22){
							var r = bd.hinfo.getGateid(cc);
							var gatenumber = bd.hinfo.data[r].number;
							passing++;
							if(gatenumber<=0){ } // �������Ȃ�
							else if(ordertype==-1){
								if(gatenumber*2-1==bd.hinfo.max){ } // �ǐ^�񒆂̐����Ȃ牽�����Ȃ�
								else if(passing==gatenumber)               { ordertype=1;}
								else if(passing==bd.hinfo.max+1-gatenumber){ break;      } // �t�����Ȃ̂ŋt�̕���������
								else{
									bd.sErC(bd.hinfo.data[r].clist, 4);
									bd.sErC(bd.hinfo.getGatePole(r),1)
									return false;
								}
							}
							else if(ordertype==1 && passing!=gatenumber){
								bd.sErC(bd.hinfo.data[r].clist, 4);
								bd.sErC(bd.hinfo.getGatePole(r),1)
								return false;
							}
						}

						if     (line.lcntCell(cc)!=2){ break;}
						else if(dir!=1 && bd.isLine(bd.bnum(bx,by+1))){ dir=2;}
						else if(dir!=2 && bd.isLine(bd.bnum(bx,by-1))){ dir=1;}
						else if(dir!=3 && bd.isLine(bd.bnum(bx+1,by))){ dir=4;}
						else if(dir!=4 && bd.isLine(bd.bnum(bx-1,by))){ dir=3;}
					}
					else{
						var id = bd.bnum(bx,by);
						if(!bd.isLine(id)){ break;} // �r�؂�Ă���A�������Ȃ������悤�ɏI��
						else if(id==-1 || id>=bd.bdinside){ break;}
					}
				}
			}
			return true;
		};
	}
};

//---------------------------------------------------------
//---------------------------------------------------------
HurdleData = function(){
	this.clist  = [];		// ���̊���Ɋ܂܂��Z���̃��X�g
	this.number = -1;		// ���̊��傪������
	this.val    = 0;		// ���̊���̕���(21:�^�e 22:���R)
	this.x1 = this.x2 = this.y1 = this.y2 = -1; // ����̃T�C�Y(���[�̍��}�XID���擾����̂ɕK�v)
};

Hurdle = function(){
	this.max    = 0;
	this.gateid = [];
	this.data   = [];
};
Hurdle.prototype = {
	// ���傪������ID���擾����
	getGateid : function(cc){
		if(cc<0 || cc>=bd.cellmax){ return -1;}
		return this.gateid[cc];
	},

	// ����̗��[�ɂ��鍕�}�X�̏ꏊ��ID���擾����
	getGatePole : function(gateid){
		var clist = [];
		var cc1,cc2;
		if(this.data[gateid].val==21){
			cc1 = bd.cnum(this.data[gateid].x1, this.data[gateid].y1-1);
			cc2 = bd.cnum(this.data[gateid].x1, this.data[gateid].y2+1);
		}
		else if(this.data[gateid].val==22){
			cc1 = bd.cnum(this.data[gateid].x1-1, this.data[gateid].y1);
			cc2 = bd.cnum(this.data[gateid].x2+1, this.data[gateid].y1);
		}
		else{ return [];}
		if(cc1!=-1 && bd.QuC(cc1)==1){ clist.push(cc1);}
		if(cc2!=-1 && bd.QuC(cc2)==1){ clist.push(cc2);}
		return clist;
	},
	// ���}�X�̎���Ɍq�����Ă������ID�����X�g�ɂ��ĕԂ�
	getConnectingGate : function(cc){
		var idlist = [];
		if(bd.QuC(bd.up(cc))==21){ idlist.push(this.gateid[bd.up(cc)]);}
		if(bd.QuC(bd.dn(cc))==21){ idlist.push(this.gateid[bd.dn(cc)]);}
		if(bd.QuC(bd.lt(cc))==22){ idlist.push(this.gateid[bd.lt(cc)]);}
		if(bd.QuC(bd.rt(cc))==22){ idlist.push(this.gateid[bd.rt(cc)]);}
		return idlist;
	},

	//---------------------------------------------------------
	init : function(){
		this.max=0;
		for(var c=0;c<bd.cellmax;c++){ this.gateid[c] = -1;}
		this.data=[];
	},

	generateAll : function(){
		this.generateGates();
		this.generateGateNumber();
	},

	generateGates : function(){
		this.init();
		for(var c=0;c<bd.cellmax;c++){
			if(bd.QuC(c)==0 || bd.QuC(c)==1 || this.getGateid(c)!=-1){ continue;}

			var cx=bd.cell[c].cx, cy=bd.cell[c].cy;
			var val=bd.QuC(c);

			this.max++;
			this.data[this.max] = new HurdleData();
			while(bd.QuC(bd.cnum(cx,cy))==val){
				this.data[this.max].clist.push(bd.cnum(cx,cy));
				this.gateid[bd.cnum(cx,cy)]=this.max;
				if(val==21){ cy++;}else{ cx++;}
			}
			this.data[this.max].x1 = bd.cell[c].cx;
			this.data[this.max].y1 = bd.cell[c].cy;
			this.data[this.max].x2 = (val==22?cx-1:cx);
			this.data[this.max].y2 = (val==21?cy-1:cy);
			this.data[this.max].val = val;
		}
	},

	generateGateNumber : function(){
		// ��U���ׂĂ̊����number������
		for(var r=1;r<=this.max;r++){ this.data[r].number=-1;}

		// �������ǂ̊���Ɍq�����Ă��邩��nums�z��ɂƂ��Ă���
		var nums = [];
		for(var r=1;r<=this.max;r++){ nums[r] = [];}
		for(var c=0;c<bd.cellmax;c++){
			if(bd.QuC(c)==1){
				if(bd.QnC(c)<=0 || bd.QnC(c)>this.max){ continue;}
				var idlist = this.getConnectingGate(c);
				for(var i=0;i<idlist.length;i++){ nums[idlist[i]].push(bd.QnC(c));}
			}
		}

		// �Z�b�g���ꂽ������S�Ă�nums��������֐�
		var delnum = ee.binder(this, function(dn){ for(var r=1;r<=this.max;r++){
			var atmp = [];
			for(var i=0;i<nums[r].length;i++){ if(dn[nums[r][i]]!=1){ atmp.push(nums[r][i]);} }
			nums[r] = atmp;
		} });
		var decnumber = [];
		for(var n=1;n<=this.max;n++){ decnumber[n] = 0;}

		// ����n�Ɍq���鐔����2�Ƃ����������̏ꍇ�A�������Ŋ���ɐ������Z�b�g
		for(var r=1;r<=this.max;r++){
			if(nums[r].length==2 && nums[r][0]>0 && nums[r][0]==nums[r][1]){
				this.data[r].number = nums[r][0];
				decnumber[nums[r][0]] = 1
				nums[r] = [];
			}
		}
		delnum(decnumber);

		// ����Ɍq����2�̐������قȂ�ꍇ�A��������1�̐������q����ꍇ
		var repeatflag = true;
		while(repeatflag){
			repeatflag = false;
			for(var n=1;n<=this.max;n++){ decnumber[n] = 0;}
			var numcnt = [];

			// �������Ă��Ȃ������������c���Ă��邩������
			for(var n=1;n<=this.max;n++){ numcnt[n] = 0;}
			for(var r=1;r<=this.max;r++){ if(nums[r].length==1){ numcnt[nums[r][0]]++;} }

			// �e������`�F�b�N
			for(var r=1;r<=this.max;r++){
				// 2�ȏ�̐������q�����Ă���ꍇ�̓_���ł�
				// �܂��A�����ӏ��̊���̌��ɂȂ��Ă���ꍇ���_��
				var cand=(nums[r].length==1?nums[r][0]:-1);
				if(cand>0 && numcnt[cand]>1){ cand=-1;}

				// ����ɐ������Z�b�g
				if(cand>0){
					this.data[r].number = cand;
					decnumber[cand] = 1;
					nums[r] = [];
					repeatflag = true;	//�ă��[�v����
				}
			}
			delnum(decnumber);

			// �����܂łŃZ�b�g���ꂽ�������Ȃ�A���߂��烋�[�v
			if(repeatflag){ continue;}

			// �d�Ȃ��Ă��Ă��A1�����Ɍq�����Ă��鐔���𔻒肵�����B�B
			for(var n=1;n<=this.max;n++){ numcnt[n] = 0;}
			for(var r=1;r<=this.max;r++){ for(var i=0;i<nums[r].length;i++){ numcnt[nums[r][i]]++;} }

			// �e������`�F�b�N
			for(var r=1;r<=this.max;r++){
				var cand=-1;
				for(var i=0;i<nums[r].length;i++){
					if(numcnt[nums[r][i]]==1){ cand=(cand==-1?nums[r][i]:-1);}
				}

				// ����ɐ������Z�b�g
				if(cand>0){
					this.data[r].number = cand;
					decnumber[cand] = 1;
					nums[r] = [];
					repeatflag = true;	//�ă��[�v����
				}
			}
			delnum(decnumber);
		}
	}
};
