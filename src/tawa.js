//
// �p�Y���ŗL�X�N���v�g�� ����ނ�񂪔� tawa.js v3.2.0p2
//
Puzzles.tawa = function(){ };
Puzzles.tawa.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 6;}	// �Ֆʂ̉��� �{�X�N���v�g�ł͈�ԏ�̒i�̃}�X�̐���\�����ƂƂ���.
		if(!k.qrows){ k.qrows = 7;}	// �Ֆʂ̏c��
		k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 0;		// 1:Border/Line������\�ȃp�Y��
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
		k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
		k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
		k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

		k.BlackCell     = 1;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 1;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

		k.fstruct = ["others"];

		//k.def_csize = 36;
		//k.def_psize = 24;

		base.setTitle("����ނ��","Tawamurenga");
		base.setExpression("�@���N���b�N�ō��}�X���A�E�N���b�N�Ŕ��}�X�m��}�X�����͂ł��܂��B",
						   " Left Click to input black cells, Right Click to input determined white cells.");
		base.setFloatbgcolor("rgb(64, 64, 64)");
		base.proto = 1;
	},
	menufix : function(){
		menu.addUseToFlags();
		menu.addLabels($("#pop1_1_cap1x"), "���� (���F�̐�)", "Width (Yellows)");
		menu.addLabels($("#pop1_1_cap2x"), "����",            "Height");
	},

	protoChange : function(){
		this.protofunc = {
			cellpx  : Cell.prototype.px,
			bdinit2 : Board.prototype.initialize2
		};

		Cell.prototype.px = function(){ return mf(k.p0.x+this.cx*k.cwidth/2);};
		Board.prototype.initialize2 = function(){
			var total = 0;
			if     (this.lap==0){ total = mf(k.qrows*0.5)*(2*k.qcols-1)+((k.qrows%2==1)?k.qcols:0);}
			else if(this.lap==3 || this.lap==undefined){ total = mf(k.qrows*0.5)*(2*k.qcols+1)+((k.qrows%2==1)?k.qcols:0);}
			else{ total = k.qcols*k.qrows;}

			this.cell = new Array();
			this.cells = new Array();
			for(var i=0;i<total;i++){
				this.cell[i] = new Cell(i);
				this.cell[i].allclear(i);
				this.cells.push(i);
			}

			this.setposAll();
		};

		this.resize_original = base.resize_canvas_only.bind(base);
		base.resize_canvas_only = function(){
			puz.resize_original();

			// Canvas�̃T�C�Y�ύX
			this.cv_obj.attr("width",  k.p0.x*2 + k.qcols*k.cwidth + mf(bd.lap==0?0:(bd.lap==3?k.cwidth:k.cwidth/2)));
			this.cv_obj.attr("height", k.p0.y*2 + k.qrows*k.cheight);

			k.cv_oft.x = this.cv_obj.offset().left;
			k.cv_oft.y = this.cv_obj.offset().top;

			// jQuery�Ή�:���߂�Canvas���̃T�C�Y��0�ɂȂ�A�`�悳��Ȃ��s��ւ̑Ώ�
			if(g.vml){
				var fc = this.cv_obj.children(":first");
				fc.css("width",  ''+this.cv_obj.attr("clientWidth") + 'px');
				fc.css("height", ''+this.cv_obj.attr("clientHeight") + 'px');
			}
		};

		this.newboard_html_original = $(document.newboard).html();
	},
	protoOriginal : function(){
		Cell.prototype.px = this.protofunc.cellpx;
		Board.prototype.initialize2 = this.protofunc.bdinit2;
		base.resize_canvas_only = this.resize_original;
		$(document.newboard).html(this.newboard_html_original);

		$(document.flip.turnl).attr("disabled",false);
		$(document.flip.turnr).attr("disabled",false);
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(k.mode==1){
				if(!kp.enabled()){ this.inputqnum(x,y,6);}
				else{ kp.display(x,y);}
			}
			else if(k.mode==3) this.inputcell(x,y);
		};
		mv.mouseup = function(x,y){ };
		mv.mousemove = function(x,y){
			if(k.mode==3) this.inputcell(x,y);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.mode==3){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca,6);
		};
		// x��2�{�œn�������׃I�[�o�[���C�h
		kc.moveTC = function(ca,mv){
			var tcx = tc.cursolx, tcy = tc.cursoly, flag = false;
			if     (ca == 'up'    && tcy-mv >= tc.miny){ tc.decTCY(mv); flag = true;}
			else if(ca == 'down'  && tcy+mv <= tc.maxy){ tc.incTCY(mv); flag = true;}
			else if(ca == 'left'  && tcx-mv >= tc.minx){ tc.decTCX(mv); flag = true;}
			else if(ca == 'right' && tcx+mv <= tc.maxx){ tc.incTCX(mv); flag = true;}

			if(flag){
				pc.paint(tcx-1, mf(tcy/2)-1, tcx, mf(tcy/2));
				pc.paint(tc.cursolx-1, mf(tc.cursoly/2)-1, tc.cursolx, mf(tc.cursoly/2));
				this.tcMoved = true;
			}
			return flag;
		};

		kp.kpgenerate = function(mode){
			this.inputcol('num','knum0','0','0');
			this.inputcol('num','knum1','1','1');
			this.inputcol('num','knum2','2','2');
			this.insertrow();
			this.inputcol('num','knum3','3','3');
			this.inputcol('num','knum4','4','4');
			this.inputcol('num','knum5','5','5');
			this.insertrow();
			this.inputcol('num','knum6','6','6');
			this.inputcol('num','knum.','-','?');
			this.inputcol('num','knum_',' ',' ');
			this.insertrow();
		};

		if(k.callmode=="pmake"){
			kp.generate(99, true, false, kp.kpgenerate.bind(kp));
			kp.kpinput = function(ca){
				kc.key_inputqnum(ca,Math.max(k.qcols,k.qrows));
			};
		}

		this.input_init2();

		tc.getTCC = function(){ return bd.cnum(this.cursolx, mf((this.cursoly-1)/2));}.bind(tc);
		tc.setTCC = function(id){
			if(id<0 || bd.cell.length<=id){ return;}
			this.cursolx = bd.cell[id].cx; this.cursoly = bd.cell[id].cy*2+1;
		};
		tc.incTCY = function(mv){
			this.cursoly+=mv;
			if(this.cursolx==this.minx || (this.cursolx<this.maxx && mf(this.cursoly/2)%2==1)){ this.cursolx++;}
			else{ this.cursolx--;}
		};
		tc.decTCY = function(mv){
			this.cursoly-=mv;
			if(this.cursolx==this.maxx || (this.cursolx>this.minx && mf(this.cursoly/2)%2==0)){ this.cursolx--;}
			else{ this.cursolx++;}
		};
		tc.setAlign = function(){
			this.minx = 0;
			this.miny = 0;
			this.maxx = (bd.lap==0?2*k.qcols-1:(bd.lap==3?2*k.qcols+1:2*k.qcols))-1;
			this.maxy = 2*k.qrows-1;

			if(bd.cnum(this.cursolx, mf(this.cursoly/2))==-1){ this.cursolx += (this.cursolx>0?-1:1);}
		};
		tc.setAlign();

		bd.setposCell = function(id){
			if(this.lap==0){
				this.cell[id].cy = mf((2*id)/(2*k.qcols-1));
				this.cell[id].cx = mf((2*id)%(2*k.qcols-1));
			}
			else if(this.lap==1){
				this.cell[id].cy = mf(id/k.qcols);
				this.cell[id].cx = mf(id%k.qcols)*2+(this.cell[id].cy%2==1?1:0);
			}
			else if(this.lap==2){
				this.cell[id].cy = mf(id/k.qcols);
				this.cell[id].cx = mf(id%k.qcols)*2+(this.cell[id].cy%2==0?1:0);
			}
			else if(this.lap==3){
				this.cell[id].cy = mf((2*id+1)/(2*k.qcols+1));
				this.cell[id].cx = mf((2*id+1)%(2*k.qcols+1));
			}
		};
		bd.cnum = function(bx,cy){
			return this.cnum2(bx,cy,k.qcols,k.qrows);
		};
		bd.cnum2 = function(bx,cy,qc,qr){
			if(cy<0||cy>qr-1||bx<0||bx>tc.maxx){ return -1;}
			else if(this.lap==0){
				if((bx+cy)%2==0 && (bx<=tc.maxx || cy%2==0)){ return mf((bx+cy*(2*qc-1))/2);}
			}
			else if(this.lap==1){
				if((bx+cy)%2==0 && (bx<=tc.maxx || cy%2==0)){ return mf(bx/2)+cy*qc;}
			}
			else if(this.lap==2){
				if((bx+cy)%2==1 && (bx<=tc.maxx || cy%2==1)){ return mf(bx/2)+cy*qc;}
			}
			else if(this.lap==3){
				if((bx+cy)%2==1 && (bx<=tc.maxx || cy%2==1)){ return mf((bx+cy*(2*qc+1))/2);}
			}
			return -1;
		};
		bd.initialize2();
		tc.setTCC(0);

		mv.cellid = function(p){
			var pos = this.cellpos(p);
			if((p.y-k.p0.y)%k.cheight==0){ return -1;} // �c���������A�҂�����͖���
			if(pos.x<0 || pos.x>tc.maxx+1 || pos.y<0 || pos.y>k.qrows-1){ return -1;}

			var cand = bd.cnum(pos.x, pos.y);
			cand = (cand!=-1?cand:bd.cnum(pos.x-1, pos.y));
			return cand;
		};
		mv.cellpos = function(p){
			return new Pos(mf((p.x-k.p0.x)/(k.cwidth/2)), mf((p.y-k.p0.y)/k.cheight));
		};

		menu.ex.newboard = function(e){
			if(menu.pop){
				var col = mf(parseInt(document.newboard.col.value));
				var row = mf(parseInt(document.newboard.row.value));
				var slap = {0:0,1:3,2:1,3:2}[this.clap];

				if(col==1 && (slap==0||slap==3)){ menu.popclose(); return;}
				if(slap==3){ col--;}
				if(col>0 && row>0){ bd.lap = slap; this.newboard2(col,row);}
				menu.popclose();
				base.resize_canvas();				// Canvas���X�V����
			}
		};
		menu.ex.newboard2 = function(col,row){
			var total = 0;
			if     (bd.lap==0){ total = mf(row*0.5)*(2*col-1)+((row%2==1)?col:0);}
			else if(bd.lap==3){ total = mf(row*0.5)*(2*col+1)+((row%2==1)?col:0);}
			else{ total = col*row;}

			// �����̃T�C�Y��菬�����Ȃ�delete����
			for(var n=bd.cell.length-1;n>=total;n--){
				if(bd.cell[n].numobj) { bd.cell[n].numobj.remove();}
				if(bd.cell[n].numobj2){ bd.cell[n].numobj2.remove();}
				delete bd.cell[n]; bd.cell.pop(); bd.cells.pop();
			}

			// �����̃T�C�Y���傫���Ȃ�new���s��
			for(var i=bd.cell.length;i<total;i++){ bd.cell.push(new Cell()); bd.cells.push(i);}

			// �T�C�Y�̕ύX
			//tc.maxy += (row-k.qrows)*2;
			k.qcols = col; k.qrows = row;
			tc.setAlign();

			// cellinit() = allclear()+setpos()���Ăяo��
			for(var i=0;i<bd.cell.length;i++){ bd.cell[i].allclear(i);}

			um.allerase();
			bd.setposAll();
			tc.setTCC(0);

			ans.reset();
		};

		// �Ֆʂ̊g��
		menu.ex.expand = function(number, rc, key){
			var margin = 0;
			if(rc=='c'){
				if(key=='lt'){
					k.qcols += {0:0,1:0,2:1,3:1}[bd.lap];
					margin   = mf((k.qrows + {0:0,1:0,2:1,3:1}[bd.lap])/2);
					bd.lap   = {0:2,1:3,2:0,3:1}[bd.lap];
				}
				else if(key=='rt'){
					k.qcols += {0:0,1:1,2:0,3:1}[bd.lap];
					margin   = mf((k.qrows + {0:0,1:1,2:0,3:1}[bd.lap])/2);
					bd.lap   = {0:1,1:0,2:3,3:2}[bd.lap];
				}
				tc.maxx++;
			}
			else if(rc=='r'){
				k.qrows++;
				tc.maxy+=2;
				if(bd.lap==1||bd.lap==2){ margin = k.qcols;}
				else if(bd.lap==0){ margin = k.qcols-1;}
				else if(bd.lap==3){ margin = k.qcols+1;}

				if(key=='up'){
					k.qcols += {0:-1,1:0,2:0,3:1}[bd.lap];
					bd.lap   = {0:3,1:2,2:1,3:0}[bd.lap];
				}
			}

			var tf = ((key=='up'||key=='lt')?1:-1);
			var func = function(cx,cy){ var ty=(k.qrows-1)/2; return (ty+tf*(cy-ty)==0);};
			if     (key=='lt'){ func = function(cx,cy,f){ return (cx<=0);};}
			else if(key=='rt'){ func = function(cx,cy,f){ return (cx>=tc.maxx);};}

			var ncount = bd.cell.length;
			for(var i=0;i<margin;i++){ bd.cell.push(new Cell()); bd.cell[ncount+i].cellinit(ncount+i); bd.cells.push(ncount+i);} 
			for(var i=0;i<bd.cell.length;i++){ bd.setposCell(i);}
			for(var i=bd.cell.length-1;i>=0;i--){
				if(i-margin<0 || func(bd.cell[i].cx, bd.cell[i].cy)){
					bd.cell[i] = new Cell(); bd.cell[i].cellinit(i); margin--;
				}
				else if(margin>0){ bd.cell[i] = bd.cell[i-margin];}
				if(margin==0){ break;}
			}
			bd.setposAll();
			tc.setAlign();
		};
		// �Ֆʂ̏k��
		menu.ex.reduce = function(number, rc, key){
			if((k.qcols==1 && rc=='c' && bd.lap!=3)||(rc=='r'&&k.qrows==1)){ return false;}

			var tf = ((key=='up'||key=='lt')?1:-1);
			var func = function(cx,cy){ var ty=(k.qrows-1)/2; return (ty+tf*(cy-ty)==0);};
			if     (key=='lt'){ func = function(cx,cy,f){ return (cx<=0);};}
			else if(key=='rt'){ func = function(cx,cy,f){ return (cx>=tc.maxx);};}

			var margin = 0;
			for(var i=0;i<bd.cell.length;i++){
				if(func(bd.cell[i].cx, bd.cell[i].cy)){
					if(bd.cell[i].numobj) { bd.cell[i].numobj.hide();}
					if(bd.cell[i].numobj2){ bd.cell[i].numobj2.hide();}
					if(!bd.isNullCell(i)){ um.addOpe('cell', 'cell', i, bd.cell[i], 0);}
					margin++;
				}
				else if(margin>0){ bd.cell[i-margin] = bd.cell[i];}
			}
			for(var i=0;i<margin;i++){ bd.cell.pop(); bd.cells.pop();}

			if(rc=='c'){
				if(key=='lt'){
					k.qcols -= {0:1,1:1,2:0,3:0}[bd.lap];
					bd.lap   = {0:2,1:3,2:0,3:1}[bd.lap];
				}
				else if(key=='rt'){
					k.qcols -= {0:1,1:0,2:1,3:0}[bd.lap];
					bd.lap   = {0:1,1:0,2:3,3:2}[bd.lap];
				}
				tc.maxx--;
			}
			else if(rc=='r'){
				k.qrows--;
				tc.maxy-=2;
				if(key=='up'){
					k.qcols += {0:-1,1:0,2:0,3:1}[bd.lap];
					bd.lap   = {0:3,1:2,2:1,3:0}[bd.lap];
				}
			}

			bd.setposAll();
			tc.setAlign();
			return true;
		};
		// ��]�E���](�㉺���])
		menu.ex.flipy = function(rx1,ry1,rx2,ry2){
			if(k.qrows%2==0){ bd.lap = {0:3,1:2,2:1,3:0}[bd.lap];}
			rx2 = tc.maxx;

			var cnt = bd.cell.length;
			var ch = new Array(); for(var i=0;i<cnt;i++){ ch[i]=1;}
			while(cnt>0){
				var tmp, source, prev, target, nex;
				for(source=0;source<bd.cell.length;source++){ if(ch[source]==1){ break;}}
				tmp = bd.cell[source]; target = source;
				while(true){
					nex = bd.cnum2(bd.cell[target].cx, (ry2+ry1)-bd.cell[target].cy, k.qcols, k.qrows);
					if(nex==source){ break;}
					bd.cell[target] = bd.cell[nex]; ch[target]=0; cnt--; target = nex;
				}
				bd.cell[target] = tmp; ch[target]=0; cnt--; 
			}
			bd.setposAll();
		};
		// ��]�E���](���E���])
		menu.ex.flipx = function(rx1,ry1,rx2,ry2){
			bd.lap = {0:0,1:2,2:1,3:3}[bd.lap];
			rx2 = tc.maxx;

			var cnt = bd.cell.length;
			var ch = new Array(); for(var i=0;i<cnt;i++){ ch[i]=1;}
			while(cnt>0){
				var tmp, source, prev, target, nex;
				for(source=0;source<bd.cell.length;source++){ if(ch[source]==1){ break;}}
				tmp = bd.cell[source]; target = source;
				while(true){
					nex = bd.cnum2((rx2+rx1)-bd.cell[target].cx, bd.cell[target].cy, k.qcols, k.qrows);
					if(nex==source){ break;}
					bd.cell[target] = bd.cell[nex]; ch[target]=0; cnt--; target = nex;
				}
				bd.cell[target] = tmp; ch[target]=0; cnt--; 
			}
			bd.setposAll();
		};

		$(document.flip.turnl).attr("disabled",true);
		$(document.flip.turnr).attr("disabled",true);
	},
	input_init2 : function(){	// �������傫���Ȃ����̂ŕ���(input_init()����Ă΂��)
		menu.ex.clap = 3;
		bd.lap = menu.ex.clap;	// 2�i�ڂ� => 0:���E�������� 1:�E�̂ݏo������ 2:���̂ݏo������ 3:���E�o������

		pp.funcs.newboard = function(){
			menu.pop = $("#pop1_1");
			pp.funcs.clickimg({0:0,1:2,2:3,3:1}[bd.lap]);
			document.newboard.col.value = (k.qcols+(bd.lap==3?1:0));
			document.newboard.row.value = k.qrows;
			k.enableKey = false;
		};
		pp.funcs.clickimg = function(num){
			$("img.clickimg").parent().css("background-color","");
			$("#nb"+num).parent().css("background-color","red");
			menu.ex.clap = num;
		};

		$(document.newboard).html(
			  "<span id=\"pop1_1_cap0\">�Ֆʂ�V�K�쐬���܂��B</span><br>\n"
			+ "<input type=\"text\" name=\"col\" value=\"\" size=\"3\" maxlength=\"3\" /> <span id=\"pop1_1_cap1x\">���� (���F�̐�)</span><br>\n"
			+ "<input type=\"text\" name=\"row\" value=\"\" size=\"3\" maxlength=\"3\" /> <span id=\"pop1_1_cap2x\">����</span><br>\n"
			+ "<table border=\"0\" cellpadding=\"0\" cellspacing=\"2\" style=\"margin-top:4pt;margin-bottom:4pt;\">"
			+ "<tr id=\"laps\" style=\"padding-bottom:2px;\">\n"
			+ "</tr></table>\n"
			+ "<input type=\"button\" name=\"newboard\" value=\"�V�K�쐬\" /><input type=\"button\" name=\"cancel\" value=\"�L�����Z��\" />\n"
		);
		var cw=32, bw=2;
		for(var i=0;i<=3;i++){
			newEL('td').append(
				newEL('div').append(
					newEL('img').attr("src",'./src/img/tawa_nb.gif').attr("class","clickimg").attr("id","nb"+i)
								.css("left","-"+(i*cw)+"px").css("clip", "rect(0px,"+((i+1)*cw)+"px,"+cw+"px,"+(i*cw)+"px)")
								.css("position","absolute").css("margin",""+bw+"px")
								.click(pp.funcs.clickimg.bind(pp,i)).unselectable()
				).css("position","relative").css("display","block").css("width",""+(cw+bw*2)+"px").css("height",""+(cw+bw*2)+"px")
			).appendTo($("#laps"));
		}
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.MBcolor = "rgb(64, 255, 64)";
		pc.BDlinecolor = "black";

		pc.paint = function(x1,y1,x2,y2){
			x1--; x2++;
			this.flushCanvas_tawa(x1+1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawWhiteCells(x1,y1,x2,y2);
			this.drawBlackCells(x1,y1,x2,y2);
			this.drawBDline_tawa(x1-1,y1,x2+1,y2);

			this.drawNumbers(x1,y1,x2,y2);

			if(k.mode==1){ this.drawTCell_tawa(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};
		pc.paintAll = function(){ if(this.already()){ this.paint(0,0,tc.maxx+1,k.qrows);} },

		pc.drawBDline_tawa = function(x1,y1,x2,y2){
			if(x1<0){ x1=0;} if(x2>tc.maxx+1){ x2=tc.maxx+1;}
			if(y1<0){ y1=0;} if(y2>k.qrows-1){ y2=k.qrows-1;}

			var lw = mf((k.cwidth/24)>=1?(k.cwidth/24):1);
			var lm = mf((lw-1)/2);

			g.fillStyle = this.BDlinecolor;
			var xa = Math.max(x1,0), xb = Math.min(x2+1,tc.maxx+2);
			var ya = Math.max(y1,0), yb = Math.min(y2+1,k.qrows  );
			for(var i=ya;i<=yb;i++){
				if(this.vnop("bdx"+i+"_",1)){
					var redx = 0, redw = 0;
					if     ((bd.lap==3 && (i==0||(i==k.qrows&&i%2==1))) || (bd.lap==0 && (i==k.qrows&&i%2==0))){ redx=1; redw=2;}
					else if((bd.lap==2 && (i==0||(i==k.qrows&&i%2==1))) || (bd.lap==1 && (i==k.qrows&&i%2==0))){ redx=1; redw=1;}
					else if((bd.lap==1 && (i==0||(i==k.qrows&&i%2==1))) || (bd.lap==2 && (i==k.qrows&&i%2==0))){ redx=0; redw=1;}
					g.fillRect(mf(k.p0.x+(x1+redx)*k.cwidth/2-lm), mf(k.p0.y+i*k.cheight-lm), (x2-x1+1-redw)*k.cwidth/2+1, lw);
				}
				if(i>k.qrows-1){ break;}
				var xs = xa;
				if((bd.lap==2 || bd.lap==3) ^ !((i%2==1)^(xs%2==0))){ xs++;}
				for(var j=xs;j<=xb;j+=2){
					if(this.vnop("bdy"+i+"_"+j+"_",1)){
						g.fillRect(mf(k.p0.x+j*k.cwidth/2-lm), mf(k.p0.y+i*k.cheight-lm), lw, k.cheight+1);
					}
				}
			}

			this.vinc();
		};

		pc.drawTCell_tawa = function(x1,y1,x2,y2){
			if(tc.cursolx < x1   || x2  +1 < tc.cursolx){ return;}
			if(tc.cursoly < y1*2 || y2*2+2 < tc.cursoly){ return;}

			var px = k.p0.x + mf(tc.cursolx*k.cwidth/2);
			var py = k.p0.y + mf((tc.cursoly-1)*k.cheight/2);
			var w = (k.cwidth<32?2:mf(k.cwidth/16));

			this.vdel(["tc1_","tc2_","tc3_","tc4_"]);
			g.fillStyle = (k.mode==1?"rgb(255,64,64)":"rgb(64,64,255)");
			if(this.vnop("tc1_",0)){ g.fillRect(px+1,           py+1, k.cwidth-2,  w);}
			if(this.vnop("tc2_",0)){ g.fillRect(px+1,           py+1, w, k.cheight-2);}
			if(this.vnop("tc3_",0)){ g.fillRect(px+1, py+k.cheight-w, k.cwidth-2,  w);}
			if(this.vnop("tc4_",0)){ g.fillRect(px+k.cwidth-w,  py+1, w, k.cheight-2);}

			this.vinc();
		};

		pc.flushCanvas_tawa = function(x1,y1,x2,y2){
			if(!g.vml){
				if(x1<=0 && y1<=0 && x2>=tc.maxx+1 && y2>=k.qrows-1){
					this.flushCanvasAll();
				}
				else{
					g.fillStyle = "rgb(255, 255, 255)";
					g.fillRect(k.p0.x+x1*k.cwidth/2, k.p0.y+y1*k.cheight, (x2-x1+1)*k.cwidth/2, (y2-y1+1)*k.cheight);
				}
			}
			else{ g.zidx=1;}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==0 || type==1){ bstr = this.decodeTawamurenga(bstr);}
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?"+this.pzldata();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			return "/"+k.qcols+"/"+k.qrows+"/"+bd.lap+"/"+this.encodeNumber10();
		};

		enc.decodeTawamurenga = function(bstr){
			var barray = bstr.split("/");
			bd.lap = parseInt(barray[0]);
			menu.ex.newboard2(enc.uri.cols, enc.uri.rows);
			return this.decodeNumber10(barray[1]);
		};

		//---------------------------------------------------------
		fio.decodeOthers = function(array){
			if(array.length<k.qrows+1){ return false;}
			bd.lap = parseInt(array[0]);
			for(var cy=0;cy<k.qrows;cy++){
				var cols = array[cy+1].split(" ");
				var n=0;
				for(var bx=0;bx<=tc.maxx;bx++){
					var cc=bd.cnum(bx,cy);
					if(cc==-1){ continue;}
					if     (cols[n]=="#"){ bd.sQaC(cc, 1);}
					else if(cols[n]=="+"){ bd.sQsC(cc, 1);}
					else if(cols[n]=="-"){ bd.sQnC(cc, -2);}
					else if(cols[n]!="."){ bd.sQnC(cc, parseInt(cols[n]));}
					n++;
				}
			}
			return true;
		};
		fio.encodeOthers = function(){
			var bstr = "";
			for(var cy=0;cy<k.qrows;cy++){
				for(var bx=0;bx<=tc.maxx;bx++){
					var cc=bd.cnum(bx,cy);
					if(cc==-1){ continue;}
					if     (bd.QnC(cc)==-2){ bstr += "- ";}
					else if(bd.QnC(cc)!=-1){ bstr += (""+bd.QnC(cc).toString()+" ");}
					else if(bd.QaC(cc)== 1){ bstr += "# ";}
					else if(bd.QsC(cc)== 1){ bstr += "+ ";}
					else{ bstr += ". ";}
				}
				bstr += "/";
			}
			return bd.lap + "/" + bstr;
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkThreeBlackCells() ){
				this.setAlert('���}�X������3�}�X�ȏ㑱���Ă��܂��B','Three or more black cells continue horizonally.'); return false;
			}

			if( !this.checkUnderCells() ){
				this.setAlert('���}�X�̉��ɍ��}�X������܂���B','There are no black cells under a black cell..'); return false;
			}

			if( !this.checkNumbers() ){
				this.setAlert('�����̎���ɓ����Ă��鍕�}�X�̐����Ⴂ�܂��B','The number of black cells around a number is not correct.'); return false;
			}

			return true;
		};

		ans.checkThreeBlackCells = function(){
			for(var cy=0;cy<k.qrows;cy++){
				var clist = [];
				for(var bx=0;bx<=tc.maxx;bx++){
					var cc = bd.cnum(bx,cy);
					if(cc==-1){ continue;}
					else if(bd.QaC(cc)!=1 || bd.QnC(cc)!=-1){
						if(clist.length>=3){ break;}
						clist=[];
					}
					else{ clist.push(cc);}
				}
				if(clist.length>=3){
					bd.sErC(clist,1);
					return false;
				}
			}
			return true;
		};
		ans.checkNumbers = function(){
			for(var c=0;c<bd.cell.length;c++){
				if(bd.QnC(c)==-1||bd.QnC(c)==-2){ continue;}
				var clist = [];
				clist.push(bd.cnum(bd.cell[c].cx-1,bd.cell[c].cy-1));
				clist.push(bd.cnum(bd.cell[c].cx+1,bd.cell[c].cy-1));
				clist.push(bd.cnum(bd.cell[c].cx-2,bd.cell[c].cy  ));
				clist.push(bd.cnum(bd.cell[c].cx+2,bd.cell[c].cy  ));
				clist.push(bd.cnum(bd.cell[c].cx-1,bd.cell[c].cy+1));
				clist.push(bd.cnum(bd.cell[c].cx+1,bd.cell[c].cy+1));

				var cnt=0;
				for(var i=0;i<clist.length;i++){ if(bd.QaC(clist[i])==1){ cnt++;} }

				if(bd.QnC(c)!=cnt){
					bd.sErC([c],1);
					bd.sErC(clist,1);
					return false;
				}
			}
			return true;
		};
		ans.checkUnderCells = function(){
			for(var c=0;c<bd.cell.length;c++){
				if(bd.QaC(c)!=1 || bd.cell[c].cy==k.qrows-1){ continue;}

				if(bd.QaC(bd.cnum(bd.cell[c].cx-1,bd.cell[c].cy+1))!=1 &&
				   bd.QaC(bd.cnum(bd.cell[c].cx+1,bd.cell[c].cy+1))!=1)
				{
					bd.sErC([c],1);
					bd.sErC([bd.cnum(bd.cell[c].cx-1,bd.cell[c].cy+1)],1);
					bd.sErC([bd.cnum(bd.cell[c].cx+1,bd.cell[c].cy+1)],1);
					return false;
				}
			}
			return true;
		};
	}
};
