// Graphic.js v3.3.0

//---------------------------------------------------------------------------
// ��Graphic�N���X Canvas�ɕ`�悷��
//---------------------------------------------------------------------------
// �p�Y������ Canvas/DOM���䕔
// Graphic�N���X�̒�`
Graphic = function(){
	// �Ֆʂ�Cell�𕪂���F
	this.gridcolor = "black";

	// �Z���̐F(���}�X)
	this.Cellcolor = "black";
	this.errcolor1 = "rgb(224, 0, 0)";
	this.errcolor2 = "rgb(64, 64, 255)";
	this.errcolor3 = "rgb(0, 191, 0)";

	// �Z���̊ې����̒��ɏ����F
	this.circledcolor = "white";

	// �Z���́��~�̐F(�⏕�L��)
	this.MBcolor = "rgb(255, 160, 127)";

	this.qsubcolor1 = "rgb(160,255,160)";
	this.qsubcolor2 = "rgb(255,255,127)";
	this.qsubcolor3 = "rgb(192,192,192)";	// �G���o��p�Y���̔w�i����

	// �t�H���g�̐F(���}�X/���}�X)
	this.fontcolor = "black";
	this.fontAnscolor = "rgb(0, 160, 0)";
	this.fontErrcolor = "rgb(191, 0, 0)";
	this.BCell_fontcolor = "rgb(224, 224, 224)";

	this.borderfontcolor = "black";

	// �Z���̔w�i�F(���}�X)
	this.bcolor = "white";
	this.dotcolor = "black";
	this.errbcolor1 = "rgb(255, 160, 160)";
	this.errbcolor2 = "rgb(64, 255, 64)";

	this.icecolor = "rgb(192, 224, 255)";

	// ques=51�̂Ƃ��A���͂ł���ꏊ�̔w�i�F
	this.TTcolor = "rgb(127,255,127)";

	// ���E���̐F
	this.BorderQuescolor = "black";
	this.BorderQanscolor = "rgb(0, 191, 0)";
	this.BorderQsubcolor = "rgb(255, 0, 255)";

	this.errBorderQanscolor2 = "rgb(160, 160, 160)";

	this.BBcolor = "rgb(96, 96, 96)"; // ���E���ƍ��}�X�𕪂���F

	// ���E�~�̐F
	this.linecolor = "rgb(0, 160, 0)";	// �F�����Ȃ��̏ꍇ
	this.pekecolor = "rgb(32, 32, 255)";

	this.errlinecolor1 = "rgb(255, 0, 0)";
	this.errlinecolor2 = "rgb(160, 160, 160)";

	// ���̓^�[�Q�b�g�̐F
	this.targetColor1 = "rgb(255, 64,  64)";
	this.targetColor3 = "rgb(64,  64, 255)";

	// �Ֆ�(�g�̒�)�̔w�i�F
	this.bgcolor = '';

	// �F�X�ȃp�Y���Œ�`���Ă��Œ�F
	this.gridcolor_BLACK  = "black";
	this.gridcolor_LIGHT  = "rgb(127, 127, 127)";	/* �قƂ�ǂ͂��̐F���w�肵�Ă��� */
	this.gridcolor_DLIGHT = "rgb(160, 160, 160)";	/* �̈敪���n�Ŏg���Ă邱�Ƃ����� */
	this.gridcolor_SLIGHT = "rgb(191, 191, 191)";	/* �����{���������p�Y��           */
	this.gridcolor_THIN   = "rgb(224, 224, 224)";	/* �����͎��̂�Grid�\���̃p�Y�� */

	this.bcolor_GREEN = "rgb(160, 255, 160)";
	this.errbcolor1_DARK = "rgb(255, 127, 127)";
	this.linecolor_LIGHT = "rgb(0, 192, 0)";

	// ���̑�
	this.fontsizeratio = 1.0;	// ����Font�T�C�Y�̔{��
	this.crosssize = 0.4;
	this.circleratio = [0.40, 0.34];

	// �`��P��
	this.cw = k.cwidth;
	this.ch = k.cheight;
	this.bw = k.bwidth;
	this.bh = k.bheight;

	this.lw = 1;		// LineWidth ���E���ELine�̑���
	this.lm = 1;		// LineMargin
	this.lwratio = 12;	// onresize_process��lw�̒l�̎Z�o�ɗp����
	this.addlw = 0;		// �G���[���ɐ��̑������L����

	this.bdheader = "b_bd";	// drawBorder1�Ŏg��header

	this.chassisflag = true;	// false: Grid���O�g�̈ʒu�ɂ��`�悷��

	this.lastHdeg = 0;
	this.lastYdeg = 0;
	this.minYdeg = 0.18;
	this.maxYdeg = 0.70;

	this.zidx = 1;
	this.zidx_array=[];

	var numobj_attr = {className:'divnum', unselectable:'on'};
	this.EL_NUMOBJ = ee.addTemplate('numobj_parent', 'div', numobj_attr, null, null);

	this.numobj = {};					// �G�������g�ւ̎Q�Ƃ�ێ�����
	this.fillTextPrecisely  = false;	// ������g.fillText()�ŕ`��

	this.isdrawBC = false;
	this.isdrawBD = false;

	/* vnop�֐��p */
	this.STROKE      = 0;
	this.FILL        = 1;
	this.FILL_STROKE = 2;
	this.NONE        = 3;
	this.vnop_FILL   = [false,true,true,false];
	this.vnop_STROKE = [true,false,true,false];

	this.setFunctions();
};
Graphic.prototype = {
	//---------------------------------------------------------------------------
	// pc.onresize_process() resize���ɃT�C�Y��ύX����
	//---------------------------------------------------------------------------
	onresize_process : function(){
		this.cw = k.cwidth;
		this.ch = k.cheight;

		this.bw = k.bwidth;
		this.bh = k.bheight;

		this.lw = Math.max(k.cwidth/this.lwratio, 3);
		this.lm = (this.lw-1)/2;
	},
	//---------------------------------------------------------------------------
	// pc.prepaint()    paint�֐����Ăяo��
	// pc.paint()       ���W(x1,y1)-(x2,y2)���ĕ`�悷��B�e�p�Y���̃t�@�C���ŃI�[�o�[���C�h�����B
	//
	// pc.paintAll()    �S�̂��ĕ`�悷��
	// pc.paintRange()  ���W(x1,y1)-(x2,y2)���ĕ`�悷��B
	// pc.paintPos()    �w�肳�ꂽ(X,Y)���ĕ`�悷��
	//
	// pc.paintCell()   �w�肳�ꂽCell���ĕ`�悷��
	// pc.paintCellAround() �w�肳�ꂽCell�̎�����܂߂čĕ`�悷��
	// pc.paintCross()  �w�肳�ꂽCross���ĕ`�悷��
	// pc.paintBorder() �w�肳�ꂽBorder�̎�����ĕ`�悷��
	// pc.paintLine()   �w�肳�ꂽLine�̎�����ĕ`�悷��
	// pc.paintEXcell() �w�肳�ꂽEXCell���ĕ`�悷��
	//---------------------------------------------------------------------------
	paint : function(x1,y1,x2,y2){ }, //�I�[�o�[���C�h�p

	prepaint : function(x1,y1,x2,y2){
		this.flushCanvas(x1,y1,x2,y2);
	//	this.flushCanvasAll();

		this.paint(x1,y1,x2,y2);
	},

	paintAll : function(){
		this.prepaint(-1,-1,2*k.qcols+1,2*k.qrows+1);
	},
	paintRange : function(x1,y1,x2,y2){
		this.prepaint(x1,y1,x2,y2);
	},
	paintPos : function(pos){
		this.prepaint(pos.x-1, pos.y-1, pos.x+1, pos.y+1);
	},

	paintCell : function(cc){
		if(isNaN(cc) || !bd.cell[cc]){ return;}
		this.prepaint(bd.cell[cc].bx-1, bd.cell[cc].by-1, bd.cell[cc].bx+1, bd.cell[cc].by+1);
	},
	paintCellAround : function(cc){
		if(isNaN(cc) || !bd.cell[cc]){ return;}
		this.prepaint(bd.cell[cc].bx-3, bd.cell[cc].by-3, bd.cell[cc].bx+3, bd.cell[cc].by+3);
	},
	paintCross : function(cc){
		if(isNaN(cc) || !bd.cross[cc]){ return;}
		this.prepaint(bd.cross[cc].bx-1, bd.cross[cc].by-1, bd.cross[cc].bx+1, bd.cross[cc].by+1);
	},
	paintBorder : function(id){
		if(isNaN(id) || !bd.border[id]){ return;}
		if(bd.border[id].bx&1){
			this.prepaint(bd.border[id].bx-2, bd.border[id].by-1, bd.border[id].bx+2, bd.border[id].by+1);
		}
		else{
			this.prepaint(bd.border[id].bx-1, bd.border[id].by-2, bd.border[id].bx+1, bd.border[id].by+2);
		}
	},
	paintLine : function(id){
		if(isNaN(id) || !bd.border[id]){ return;}
		if(bd.border[id].bx&1){
			this.prepaint(bd.border[id].bx-1, bd.border[id].by-2, bd.border[id].bx+1, bd.border[id].by+2);
		}
		else{
			this.prepaint(bd.border[id].bx-2, bd.border[id].by-1, bd.border[id].bx+2, bd.border[id].by+1);
		}
	},
	paintEXcell : function(ec){
		if(isNaN(ec) || !bd.excell[ec]){ return;}
		this.prepaint(bd.excell[ec].bx-1, bd.excell[ec].by-1, bd.excell[ec].bx+1, bd.excell[ec].by+1);
	},

	//---------------------------------------------------------------------------
	// pc.getNewLineColor() �V�����F��Ԃ�
	//---------------------------------------------------------------------------
	getNewLineColor : function(){
		var loopcount = 0;

		while(1){
			var Rdeg = mf(Math.random() * 384)-64; if(Rdeg<0){Rdeg=0;} if(Rdeg>255){Rdeg=255;}
			var Gdeg = mf(Math.random() * 384)-64; if(Gdeg<0){Gdeg=0;} if(Gdeg>255){Gdeg=255;}
			var Bdeg = mf(Math.random() * 384)-64; if(Bdeg<0){Bdeg=0;} if(Bdeg>255){Bdeg=255;}

			// HLS�̊e�g���l�����߂�
			var Cmax = Math.max(Rdeg,Math.max(Gdeg,Bdeg));
			var Cmin = Math.min(Rdeg,Math.min(Gdeg,Bdeg));

			var Hdeg = 0;
			var Ldeg = (Cmax+Cmin)*0.5 / 255;
			var Sdeg = (Cmax===Cmin?0:(Cmax-Cmin)/((Ldeg<=0.5)?(Cmax+Cmin):(2*255-Cmax-Cmin)) );

			if(Cmax==Cmin){ Hdeg = 0;}
			else if(Rdeg>=Gdeg && Rdeg>=Bdeg){ Hdeg = (    60*(Gdeg-Bdeg)/(Cmax-Cmin)+360)%360;}
			else if(Gdeg>=Rdeg && Gdeg>=Bdeg){ Hdeg = (120+60*(Bdeg-Rdeg)/(Cmax-Cmin)+360)%360;}
			else if(Bdeg>=Gdeg && Bdeg>=Rdeg){ Hdeg = (240+60*(Rdeg-Gdeg)/(Cmax-Cmin)+360)%360;}

			// YCbCr��Y�����߂�
			var Ydeg = (0.29891*Rdeg + 0.58661*Gdeg + 0.11448*Bdeg) / 255;

			if( (this.minYdeg<Ydeg && Ydeg<this.maxYdeg) && (Math.abs(this.lastYdeg-Ydeg)>0.15) && (Sdeg<0.02 || 0.40<Sdeg)
				 && (((360+this.lastHdeg-Hdeg)%360>=45)&&((360+this.lastHdeg-Hdeg)%360<=315)) ){
				this.lastHdeg = Hdeg;
				this.lastYdeg = Ydeg;
				//alert("rgb("+Rdeg+", "+Gdeg+", "+Bdeg+")\nHLS("+mf(Hdeg)+", "+(""+mf(Ldeg*1000)*0.001).slice(0,5)+", "+(""+mf(Sdeg*1000)*0.001).slice(0,5)+")\nY("+(""+mf(Ydeg*1000)*0.001).slice(0,5)+")");
				return "rgb("+Rdeg+","+Gdeg+","+Bdeg+")";
			}

			loopcount++;
			if(loopcount>100){ return "rgb("+Rdeg+","+Gdeg+","+Bdeg+")";}
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawBlackCells() Cell�́A���E���̏ォ��`�悳��遡���}�X��Canvas�ɏ�������
	// pc.setCellColor()   �O�i�F�̐ݒ�E�`�攻�肷��
	// pc.setCellColorFunc()   pc.setCellColor�֐���ݒ肷��
	//
	// pc.drawBGCells()    Cell�́A���E���̉��ɕ`�悳���w�i�F��Canvas�ɏ�������
	// pc.setBGCellColor() �w�i�F�̐ݒ�E�`�攻�肷��
	// pc.setBGCellColorFunc() pc.setBGCellColor�֐���ݒ肷��
	//---------------------------------------------------------------------------
	// err==2�ɂȂ�lits�́AdrawBGCells�ŕ`�悵�Ă܂��B�B
	drawBlackCells : function(x1,y1,x2,y2){
		this.vinc('cell_front', 'crispEdges');
		var header = "c_fullb_";

		if(g.use.canvas && this.isdrawBC && !this.isdrawBD){ x1--; y1--; x2++; y2++;}
		var clist = bd.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(this.setCellColor(c)){
				if(this.vnop(header+c,this.FILL)){
					g.fillRect(bd.cell[c].px, bd.cell[c].py, this.cw+1, this.ch+1);
				}
			}
			else{ this.vhide(header+c); continue;}
		}
		this.isdrawBC = true;
	},
	// 'qans'�p
	setCellColor : function(c){
		var err = bd.cell[c].error;
		if(bd.cell[c].qans!==1){ return false;}
		else if(err===0){ g.fillStyle = this.Cellcolor; return true;}
		else if(err===1){ g.fillStyle = this.errcolor1; return true;}
		return false;
	},
	setCellColorFunc : function(type){
		switch(type){
		case 'qnum':
			this.setCellColor = function(c){
				var err = bd.cell[c].error;
				if(bd.cell[c].qnum===-1){ return false;}
				else if(err===0){ g.fillStyle = this.Cellcolor; return true;}
				else if(err===1){ g.fillStyle = this.errcolor1; return true;}
				return false;
			};
			break;
		default:
			break;
		}
	},

	drawBGCells : function(x1,y1,x2,y2){
		this.vinc('cell_back', 'crispEdges');
		var header = "c_full_";

		var clist = bd.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(this.setBGCellColor(c)){
				if(this.vnop(header+c,this.FILL)){
					g.fillRect(bd.cell[c].px, bd.cell[c].py, this.cw, this.ch);
				}
			}
			else{ this.vhide(header+c); continue;}
		}
	},
	// 'error1'�p
	setBGCellColor : function(c){
		if(bd.cell[c].error===1){ g.fillStyle = this.errbcolor1; return true;}
		return false;
	},
	setBGCellColorFunc : function(type){
		switch(type){
		case 'error2':
			this.setBGCellColor = function(c){
				var cell = bd.cell[c];
				if     (cell.error===1){ g.fillStyle = this.errbcolor1; return true;}
				else if(cell.error===2){ g.fillStyle = this.errbcolor2; return true;}
				return false;
			}
			break;
		case 'qans1':
			this.setBGCellColor = function(c){
				var cell = bd.cell[c];
				if(cell.qans===1){
					g.fillStyle = (cell.error===1 ? this.errcolor1 : this.Cellcolor);
					return true;
				}
				if     (cell.error===1){ g.fillStyle = this.errbcolor1; return true;}
				else if(cell.qsub ===1 && this.bcolor!=="white"){ g.fillStyle = this.bcolor; return true;}
				return false;
			};
			break;
		case 'qans2':
			this.setBGCellColor = function(c){
				var cell = bd.cell[c];
				if(cell.qans===1){
					if     (cell.error===0){ g.fillStyle = this.Cellcolor;}
					else if(cell.error===1){ g.fillStyle = this.errcolor1;}
					else if(cell.error===2){ g.fillStyle = this.errcolor2;}
					return true;
				}
				if     (cell.error===1){ g.fillStyle = this.errbcolor1; return true;}
				else if(cell.qsub ===1 && this.bcolor!=="white"){ g.fillStyle = this.bcolor; return true;}
				return false;
			};
			break;
		case 'qsub1':
			this.setBGCellColor = function(c){
				var cell = bd.cell[c];
				if     (cell.error===1){ g.fillStyle = this.errbcolor1; return true;}
				else if(cell.qsub ===1){ g.fillStyle = this.bcolor;     return true;}
				return false;
			};
			break;
		case 'qsub2':
			this.setBGCellColor = function(c){
				var cell = bd.cell[c];
				if     (cell.error===1){ g.fillStyle = this.errbcolor1; return true;}
				else if(cell.qsub ===1){ g.fillStyle = this.qsubcolor1; return true;}
				else if(cell.qsub ===2){ g.fillStyle = this.qsubcolor2; return true;}
				return false;
			};
			break;
		case 'qsub3':
			this.setBGCellColor = function(c){
				var cell = bd.cell[c];
				if     (cell.error===1){ g.fillStyle = this.errbcolor1; return true;}
				else if(cell.qsub ===1){ g.fillStyle = this.qsubcolor1; return true;}
				else if(cell.qsub ===2){ g.fillStyle = this.qsubcolor2; return true;}
				else if(cell.qsub ===3){ g.fillStyle = this.qsubcolor3; return true;}
				return false;
			};
			break;
		case 'icebarn':
			this.setBGCellColor = function(c){
				var cell = bd.cell[c];
				if     (cell.error===1){ g.fillStyle = this.errbcolor1; return true;}
				else if(cell.ques ===6){ g.fillStyle = this.icecolor;   return true;}
				return false;
			};
			break;
		default:
			break;
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawBGEXcells()    EXCell�ɕ`�悳���w�i�F��Canvas�ɏ�������
	// pc.setBGEXcellColor() �w�i�F�̐ݒ�E�`�攻�肷��
	//---------------------------------------------------------------------------
	drawBGEXcells : function(x1,y1,x2,y2){
		this.vinc('excell_back', 'crispEdges');

		var header = "ex_full_";
		var exlist = bd.excellinside(x1-1,y1-1,x2,y2);
		for(var i=0;i<exlist.length;i++){
			var c = exlist[i];
			if(this.setBGEXcellColor(c)){
				if(this.vnop(header+c,this.FILL)){
					g.fillRect(bd.excell[c].px+1, bd.excell[c].py+1, this.cw-1, this.ch-1);
				}
			}
			else{ this.vhide(header+c); continue;}
		}
	},
	setBGEXcellColor : function(c){
		if(bd.excell[c].error===1){ g.fillStyle = this.errbcolor1; return true;}
		return false;
	},

	//---------------------------------------------------------------------------
	// pc.drawRDotCells()  �E������Canvas�ɏ�������(�E�p)
	// pc.drawDotCells()   �E������Canvas�ɏ�������(�������l�p�`�p)
	//---------------------------------------------------------------------------
	drawRDotCells : function(x1,y1,x2,y2){
		this.vinc('cell_dot', 'auto');

		var dsize = this.cw*0.06; dsize=(dsize>2?dsize:2);
		var header = "c_rdot_";
		g.fillStyle = this.dotcolor;

		var clist = bd.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.cell[c].qsub===1){
				if(this.vnop(header+c,this.NONE)){
					g.fillCircle(bd.cell[c].cpx, bd.cell[c].cpy, dsize);
				}
			}
			else{ this.vhide(header+c);}
		}
	},
	drawDotCells : function(x1,y1,x2,y2){
		this.vinc('cell_dot', 'crispEdges');

		var dsize = this.cw*0.075;
		var header = "c_dot_";
		g.fillStyle = this.dotcolor;

		var clist = bd.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.cell[c].qsub===1){
				if(this.vnop(header+c,this.NONE)){
					g.fillRect(bd.cell[c].cpx-dsize, bd.cell[c].cpy-dsize, dsize*2, dsize*2);
				}
			}
			else{ this.vhide(header+c);}
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawNumbers()      Cell�̐�����Canvas�ɏ�������
	// pc.drawArrowNumbers() Cell�̐����Ɩ���Canvas�ɏ�������
	// pc.drawQuesHatenas()  ques===-2�̎��ɁH��Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawNumbers : function(x1,y1,x2,y2){
		this.vinc('cell_number', 'auto');

		var clist = bd.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){ this.dispnumCell(clist[i]);}
	},
	drawArrowNumbers : function(x1,y1,x2,y2){
		this.vinc('cell_arrownumber', 'auto');

		var headers = ["c_ar1_", "c_dt1_", "c_dt2_", "c_ar3_", "c_dt3_", "c_dt4_"];
		var ll = this.cw*0.7;				//LineLength
		var ls = (this.cw-ll)/2;			//LineStart
		var lw = Math.max(this.cw/24, 1);	//LineWidth
		var lm = lw/2;						//LineMargin

		if(g.use.canvas && this.isdrawBC && !this.isdrawBD){ x1--; y1--; x2++; y2++;}
		var clist = bd.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];

			if(bd.cell[c].qnum!==-1 && (bd.cell[c].qnum!==-2||k.isDispHatena)){
				var ax=px=bd.cell[c].px, ay=py=bd.cell[c].py, dir = bd.cell[c].direc;

				if     (bd.cell[c].qans ===1){ g.fillStyle = this.BCell_fontcolor;}
				else if(bd.cell[c].error===1){ g.fillStyle = this.fontErrcolor;}
				else                         { g.fillStyle = this.fontcolor;}

				// ���̕`��(�㉺����)
				if(dir===k.UP||dir===k.DN){
					// ���̐��̕`��
					ax+=(this.cw-ls*1.5-lm); ay+=(ls+1);
					if(this.vnop(headers[0]+c,this.FILL)){ g.fillRect(ax, ay, lw, ll);}
					ax+=lw/2;

					// ���̕`��
					if(dir===k.UP){
						if(this.vnop(headers[1]+c,this.FILL)){
							g.setOffsetLinePath(ax,ay, 0,0, -ll/6,ll/3, ll/6,ll/3, true);
							g.fill();
						}
					}
					else{ this.vhide(headers[1]+c);}
					if(dir===k.DN){
						if(this.vnop(headers[2]+c,this.FILL)){
							g.setOffsetLinePath(ax,ay+ll, 0,0, -ll/6,-ll/3, ll/6,-ll/3, true);
							g.fill();
						}
					}
					else{ this.vhide(headers[2]+c);}
				}
				else{ this.vhide([headers[0]+c, headers[1]+c, headers[2]+c]);}

				// ���̕`��(���E����)
				if(dir===k.LT||dir===k.RT){
					// ���̐��̕`��
					ax+=(ls+1); ay+=(ls*1.5-lm);
					if(this.vnop(headers[3]+c,this.FILL)){ g.fillRect(ax, ay, ll, lw);}
					ay+=lw/2;

					// ���̕`��
					if(dir===k.LT){
						if(this.vnop(headers[4]+c,this.FILL)){
							g.setOffsetLinePath(ax,ay, 0,0, ll/3,-ll/6, ll/3,ll/6, true);
							g.fill();
						}
					}
					else{ this.vhide(headers[4]+c);}
					if(dir===k.RT){
						if(this.vnop(headers[5]+c,this.FILL)){
							g.setOffsetLinePath(ax+ll,ay, 0,0, -ll/3,-ll/6, -ll/3,ll/6, true);
							g.fill();
						}
					}
					else{ this.vhide(headers[5]+c);}
				}
				else{ this.vhide([headers[3]+c, headers[4]+c, headers[5]+c]);}

				// �����̕`��
				var num = bd.getNum(c), text = (num>=0 ? ""+num : "?");
				var fontratio = (num<10?0.8:(num<100?0.7:0.55));
				var color = g.fillStyle;

				var cpx = bd.cell[c].cpx, cpy = bd.cell[c].cpy;
				if     (dir===k.UP||dir===k.DN){ fontratio *= 0.85; cpx-=this.cw*0.1;}
				else if(dir===k.LT||dir===k.RT){ fontratio *= 0.85; cpy+=this.ch*0.1;}

				this.dispnum('cell_'+c, 1, text, fontratio, color, cpx, cpy);
			}
			else{
				this.vhide([headers[0]+c, headers[1]+c, headers[2]+c, headers[3]+c, headers[4]+c, headers[5]+c]);
				this.hideEL('cell_'+c);
			}
		}
	},
	drawQuesHatenas : function(x1,y1,x2,y2){
		this.vinc('cell_number', 'auto');

		var clist = bd.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var obj = bd.cell[clist[i]], key = 'cell_'+clist[i];
			if(obj.ques===-2){
				var color = (obj.error===1 ? this.fontErrcolor : this.fontcolor);
				this.dispnum(key, 1, "?", 0.8, color, obj.cpx, obj.cpy);
			}
			else{ this.hideEL(key);}
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawCrosses()    Cross�̊ې�����Canvas�ɏ�������
	// pc.drawCrossMarks() Cross��̍��_��Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawCrosses : function(x1,y1,x2,y2){
		this.vinc('cross_base', 'auto');

		var csize = this.cw*this.crosssize+1;
		var header = "x_cp_";
		g.lineWidth = 1;

		var clist = bd.crossinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.cross[c].qnum!==-1){
				g.fillStyle = (bd.cross[c].error===1 ? this.errcolor1 : "white");
				g.strokeStyle = "black";
				if(this.vnop(header+c,this.FILL_STROKE)){
					g.shapeCircle(bd.cross[c].px, bd.cross[c].py, csize);
				}
			}
			else{ this.vhide([header+c]);}
			this.dispnumCross(c);
		}
	},
	drawCrossMarks : function(x1,y1,x2,y2){
		this.vinc('cross_mark', 'auto');

		var csize = this.cw*this.crosssize;
		var header = "x_cm_";

		var clist = bd.crossinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.cross[c].qnum===1){
				g.fillStyle = (bd.cross[c].error===1 ? this.errcolor1 : this.Cellcolor);
				if(this.vnop(header+c,this.FILL)){
					g.fillCircle(bd.cross[c].px, bd.cross[c].py, csize);
				}
			}
			else{ this.vhide(header+c);}
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawBorders()        ���E����Canvas�ɏ�������
	// pc.drawBorder1()        1�J���̋��E����Canvas�ɏ�������
	// pc.setBorderColor()     ���E���̐ݒ�E�`�攻�肷��
	// pc.setBorderColorFunc() pc.setBorderColor�֐���ݒ肷��
	//---------------------------------------------------------------------------
	drawBorders : function(x1,y1,x2,y2){
		this.vinc('border', 'crispEdges');

		var idlist = bd.borderinside(x1-1,y1-1,x2+1,y2+1);
		for(var i=0;i<idlist.length;i++){ this.drawBorder1(idlist[i]);}
		this.isdrawBD = true;
	},
	drawBorder1 : function(id,forceFlag){
		var vid = [this.bdheader, id].join("_");
		if(forceFlag!==false && this.setBorderColor(id)){
			if(this.vnop(vid,this.FILL)){
				var lw = this.lw + this.addlw, lm = this.lm;
				var bx = bd.border[id].bx, by = bd.border[id].by;
				var px = bd.border[id].px, py = bd.border[id].py;
				if     (by&1){ g.fillRect(px-lm, py-this.bh-lm, lw, this.ch+lw);}
				else if(bx&1){ g.fillRect(px-this.bw-lm, py-lm, this.cw+lw, lw);}
			}
		}
		else{ this.vhide(vid);}
	},

	setBorderColor : function(id){
		if(bd.border[id].ques===1){ g.fillStyle = this.BorderQuescolor; return true;}
		return false;
	},
	setBorderColorFunc : function(type){
		switch(type){
		case 'qans':
			this.setBorderColor = function(id){
				var err=bd.border[id].error;
				if(bd.isBorder(id)){
					if     (err===1){ g.fillStyle = this.errcolor1;          }
					else if(err===2){ g.fillStyle = this.errBorderQanscolor2;}
					else            { g.fillStyle = this.BorderQanscolor;    }
					return true;
				}
				return false;
			}
			break;
		case 'line':
			this.setBorderColor = this.setLineColor;
			break;
		case 'ice':
			this.setBorderColor = function(id){
				var cc1 = bd.border[id].cellcc[0], cc2 = bd.border[id].cellcc[1];
				if(cc1!==-1 && cc2!==-1 && (bd.cell[cc1].ques===6^bd.cell[cc2].ques===6)){
					g.fillStyle = this.Cellcolor;
					return true;
				}
				return false;
			}
			break;
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawBorderQsubs() ���E���p�̕⏕�L����Canvas�ɏ�������
	// pc.drawBoxBorders()  ���E���ƍ��}�X�̊Ԃ̐���`�悷��
	//---------------------------------------------------------------------------
	drawBorderQsubs : function(x1,y1,x2,y2){
		this.vinc('border_qsub', 'crispEdges');

		var m = this.cw*0.15; //Margin
		var header = "b_qsub1_";
		g.fillStyle = this.BorderQsubcolor;

		var idlist = bd.borderinside(x1-1,y1-1,x2+1,y2+1);
		for(var i=0;i<idlist.length;i++){
			var id = idlist[i];
			if(bd.border[id].qsub===1){
				if(this.vnop(header+id,this.NONE)){
					if     (bd.border[id].bx&1){ g.fillRect(bd.border[id].px, bd.border[id].py-this.bh+m, 1, this.ch-2*m);}
					else if(bd.border[id].by&1){ g.fillRect(bd.border[id].px-this.bw+m, bd.border[id].py, this.cw-2*m, 1);}
				}
			}
			else{ this.vhide(header+id);}
		}
	},

	// �O�g���Ȃ��ꍇ�͍l�����Ă��܂���
	drawBoxBorders  : function(x1,y1,x2,y2,tileflag){
		this.vinc('boxborder', 'crispEdges');

		var lw = this.lw, lm = this.lm;
		var cw = this.cw;
		var ch = this.ch;
		var chars = ['u','d','l','r'];

		g.fillStyle = this.BBcolor;

		var clist = bd.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i], vids=[];
			for(var n=0;n<12;n++){ vids[n]=['c_bb',n,c].join('_');}
			if(bd.cell[c].qans!==1){ this.vhide(vids); continue;}

			var bx = bd.cell[c].bx, by = bd.cell[c].by;
			var px = bd.cell[c].px, py = bd.cell[c].py;
			var px1 = px+lm, px2 = px+cw-lm-1;
			var py1 = py+lm, py2 = py+ch-lm-1;

			// ���̊֐����Ăԏꍇ�͑S��k.isoutsideborder===0�Ȃ̂�
			// �O�g�p�̍l���������폜���Ă��܂��B
			var UPin = (by>2), DNin = (by<2*k.qrows-2);
			var LTin = (bx>2), RTin = (bx<2*k.qcols-2);

			var isUP = (!UPin || bd.border[bd.bnum(bx  ,by-1)].ques===1);
			var isDN = (!DNin || bd.border[bd.bnum(bx  ,by+1)].ques===1);
			var isLT = (!LTin || bd.border[bd.bnum(bx-1,by  )].ques===1);
			var isRT = (!RTin || bd.border[bd.bnum(bx+1,by  )].ques===1);

			var isUL = (!UPin || !LTin || bd.border[bd.bnum(bx-2,by-1)].ques===1 || bd.border[bd.bnum(bx-1,by-2)].ques===1);
			var isUR = (!UPin || !RTin || bd.border[bd.bnum(bx+2,by-1)].ques===1 || bd.border[bd.bnum(bx+1,by-2)].ques===1);
			var isDL = (!DNin || !LTin || bd.border[bd.bnum(bx-2,by+1)].ques===1 || bd.border[bd.bnum(bx-1,by+2)].ques===1);
			var isDR = (!DNin || !RTin || bd.border[bd.bnum(bx+2,by+1)].ques===1 || bd.border[bd.bnum(bx+1,by+2)].ques===1);

			if(isUP){ if(this.vnop(vids[0],this.NONE)){ g.fillRect(px1, py1, cw-lw,1    );} }else{ this.vhide(vids[0]);}
			if(isDN){ if(this.vnop(vids[1],this.NONE)){ g.fillRect(px1, py2, cw-lw,1    );} }else{ this.vhide(vids[1]);}
			if(isLT){ if(this.vnop(vids[2],this.NONE)){ g.fillRect(px1, py1, 1    ,ch-lw);} }else{ this.vhide(vids[2]);}
			if(isRT){ if(this.vnop(vids[3],this.NONE)){ g.fillRect(px2, py1, 1    ,ch-lw);} }else{ this.vhide(vids[3]);}

			if(tileflag){
				if(!isUP&&(isUL||isLT)){ if(this.vnop(vids[4],this.NONE)){ g.fillRect(px1, py-lm, 1   ,lw+1);} }else{ this.vhide(vids[4]);}
				if(!isUP&&(isUR||isRT)){ if(this.vnop(vids[5],this.NONE)){ g.fillRect(px2, py-lm, 1   ,lw+1);} }else{ this.vhide(vids[5]);}
				if(!isLT&&(isUL||isUP)){ if(this.vnop(vids[6],this.NONE)){ g.fillRect(px-lm, py1, lw+1,1   );} }else{ this.vhide(vids[6]);}
				if(!isLT&&(isDL||isDN)){ if(this.vnop(vids[7],this.NONE)){ g.fillRect(px-lm, py2, lw+1,1   );} }else{ this.vhide(vids[7]);}
			}
			else{
				if(!isUP&&(isUL||isLT)){ if(this.vnop(vids[4] ,this.NONE)){ g.fillRect(px1, py , 1   ,lm+1);} }else{ this.vhide(vids[4] );}
				if(!isUP&&(isUR||isRT)){ if(this.vnop(vids[5] ,this.NONE)){ g.fillRect(px2, py , 1   ,lm+1);} }else{ this.vhide(vids[5] );}
				if(!isDN&&(isDL||isLT)){ if(this.vnop(vids[6] ,this.NONE)){ g.fillRect(px1, py2, 1   ,lm+1);} }else{ this.vhide(vids[6] );}
				if(!isDN&&(isDR||isRT)){ if(this.vnop(vids[7] ,this.NONE)){ g.fillRect(px2, py2, 1   ,lm+1);} }else{ this.vhide(vids[7] );}
				if(!isLT&&(isUL||isUP)){ if(this.vnop(vids[8] ,this.NONE)){ g.fillRect(px , py1, lm+1,1   );} }else{ this.vhide(vids[8] );}
				if(!isLT&&(isDL||isDN)){ if(this.vnop(vids[9] ,this.NONE)){ g.fillRect(px , py2, lm+1,1   );} }else{ this.vhide(vids[9] );}
				if(!isRT&&(isUR||isUP)){ if(this.vnop(vids[10],this.NONE)){ g.fillRect(px2, py1, lm+1,1   );} }else{ this.vhide(vids[10]);}
				if(!isRT&&(isDR||isDN)){ if(this.vnop(vids[11],this.NONE)){ g.fillRect(px2, py2, lm+1,1   );} }else{ this.vhide(vids[11]);}
			}
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawLines()    �񓚂̐���Canvas�ɏ�������
	// pc.drawLine1()    �񓚂̐���Canvas�ɏ�������(1�J���̂�)
	// pc.setLineColor() �`�悷����̐F��ݒ肷��
	// pc.drawPekes()    ���E����́~��Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawLines : function(x1,y1,x2,y2){
		this.vinc('line', 'crispEdges');

		var idlist = bd.borderinside(x1-1,y1-1,x2+1,y2+1);
		for(var i=0;i<idlist.length;i++){ this.drawLine1(idlist[i]);}
		this.addlw = 0;
	},
	drawLine1 : function(id, forceFlag){
		var vid = "b_line_"+id;
		if(forceFlag!==false && this.setLineColor(id)){
			if(this.vnop(vid,this.FILL)){
				var lw = this.lw + this.addlw, lm = this.lm;
				if     (bd.border[id].bx&1){ g.fillRect(bd.border[id].px-lm, bd.border[id].py-this.bh-lm, lw, this.ch+lw);}
				else if(bd.border[id].by&1){ g.fillRect(bd.border[id].px-this.bw-lm, bd.border[id].py-lm, this.cw+lw, lw);}
			}
		}
		else{ this.vhide(vid);}
	},
	setLineColor : function(id){
		this.addlw = 0;
		if(bd.isLine(id)){
			if     (bd.border[id].error===1){ g.fillStyle = this.errlinecolor1; if(g.use.canvas){ this.addlw=1;}}
			else if(bd.border[id].error===2){ g.fillStyle = this.errlinecolor2;}
			else if(k.irowake===0 || !pp.getVal('irowake') || !bd.border[id].color){ g.fillStyle = this.linecolor;}
			else{ g.fillStyle = bd.border[id].color;}
			return true;
		}
		return false;
	},
	drawPekes : function(x1,y1,x2,y2,flag){
		if(!g.use.canvas && flag===2){ return;}

		this.vinc('border_peke', 'auto');

		var size = this.cw*0.15+1; if(size<4){ size=4;}
		var headers = ["b_peke0_", "b_peke1_"];
		g.fillStyle = "white";
		g.strokeStyle = this.pekecolor;
		g.lineWidth = 1;

		var idlist = bd.borderinside(x1-1,y1-1,x2+1,y2+1);
		for(var i=0;i<idlist.length;i++){
			var id = idlist[i];
			if(bd.border[id].qsub!==2){ this.vhide([headers[0]+id, headers[1]+id]); continue;}

			if(g.use.canvas){
				if(flag===0 || flag===2){
					if(this.vnop(headers[0]+id,this.NONE)){
						g.fillRect(bd.border[id].px-size, bd.border[id].py-size, 2*size+1, 2*size+1);
					}
				}
				else{ this.vhide(headers[0]+id);}
			}

			if(flag===0 || flag===1){
				if(this.vnop(headers[1]+id,this.NONE)){
					g.strokeCross(bd.border[id].px, bd.border[id].py, size-1);
				}
			}
			else{ this.vhide(headers[1]+id);}
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawTriangle()   �O�p�`��Canvas�ɏ�������
	// pc.drawTriangle1()  �O�p�`��Canvas�ɏ�������(1�}�X�̂�)
	//---------------------------------------------------------------------------
	drawTriangle : function(x1,y1,x2,y2){
		this.vinc('cell_triangle', 'auto');
		var headers = ["c_tri2_", "c_tri3_", "c_tri4_", "c_tri5_"];

		if(g.use.canvas && k.puzzleid!=='reflect'){ x1--; y1--; x2++; y2++;}
		var clist = bd.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			var num = (bd.cell[c].ques!==0?bd.cell[c].ques:bd.cell[c].qans);

			this.vhide([headers[0]+c, headers[1]+c, headers[2]+c, headers[3]+c]);
			if(num>=2 && num<=5){
				switch(k.puzzleid){
				case 'reflect':
					g.fillStyle = ((bd.cell[c].error===1||bd.cell[c].error===4) ? this.errcolor1 : this.Cellcolor);
					break;
				default:
					g.fillStyle = this.Cellcolor;
					break;
				}

				this.drawTriangle1(bd.cell[c].px,bd.cell[c].py,num,headers[num-2]+c);
			}
		}
	},
	drawTriangle1 : function(px,py,num,vid){
		if(this.vnop(vid,this.FILL)){
			var cw = this.cw, ch = this.ch, mgn = (k.puzzleid==="reflect"?1:0);
			switch(num){
				case 2: g.setOffsetLinePath(px,py, mgn,mgn,  mgn,ch+1, cw+1,ch+1, true); break;
				case 3: g.setOffsetLinePath(px,py, cw+1,mgn, mgn,ch+1, cw+1,ch+1, true); break;
				case 4: g.setOffsetLinePath(px,py, mgn,mgn,  cw+1,mgn, cw+1,ch+1, true); break;
				case 5: g.setOffsetLinePath(px,py, mgn,mgn,  cw+1,mgn, mgn ,ch+1, true); break;
			}
			g.fill();
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawMBs()    Cell��́�,�~��Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawMBs : function(x1,y1,x2,y2){
		this.vinc('cell_mb', 'auto');
		g.strokeStyle = this.MBcolor;
		g.lineWidth = 1;

		var rsize = this.cw*0.35;
		var headers = ["c_MB1_", "c_MB2a_"];

		var clist = bd.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.cell[c].qsub===0){ this.vhide([headers[0]+c, headers[1]+c]); continue;}

			switch(bd.cell[c].qsub){
			case 1:
				if(this.vnop(headers[0]+c,this.NONE)){
					g.strokeCircle(bd.cell[c].cpx, bd.cell[c].cpy, rsize);
				}
				this.vhide(headers[1]+c);
				break;
			case 2:
				if(this.vnop(headers[1]+c,this.NONE)){
					g.strokeCross(bd.cell[c].cpx, bd.cell[c].cpy, rsize);
				}
				this.vhide(headers[0]+c);
				break;
			}
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawCircles41_42()    Cell��̍��ۂƔ��ۂ�Canvas�ɏ�������
	// pc.drawCirclesAtNumber() �������`�悳���Cell�̊ۂ���������
	// pc.drawCircle1AtNumber() �������`�悳���Cell�̊ۂ���������(1�}�X�̂�)
	//---------------------------------------------------------------------------
	drawCircles41_42 : function(x1,y1,x2,y2){
		this.vinc('cell_circle', 'auto');

		g.lineWidth = Math.max(this.cw*(this.circleratio[0]-this.circleratio[1]), 1);
		var rsize41 = this.cw*(this.circleratio[0]+this.circleratio[1])/2;
		var rsize42 = this.cw*this.circleratio[0];
		var headers = ["c_cir41_", "c_cir42_"];
		var clist = bd.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];

			if(bd.cell[c].ques===41){
				g.strokeStyle = (bd.cell[c].error===1 ? this.errcolor1  : this.Cellcolor);
				g.fillStyle   = (bd.cell[c].error===1 ? this.errbcolor1 : "white");
				if(this.vnop(headers[0]+c,this.FILL_STROKE)){
					g.shapeCircle(bd.cell[c].cpx, bd.cell[c].cpy, rsize41);
				}
			}
			else{ this.vhide(headers[0]+c);}

			if(bd.cell[c].ques===42){
				g.fillStyle = (bd.cell[c].error===1 ? this.errcolor1 : this.Cellcolor);
				if(this.vnop(headers[1]+c,this.FILL)){
					g.fillCircle(bd.cell[c].cpx, bd.cell[c].cpy, rsize42);
				}
			}
			else{ this.vhide(headers[1]+c);}
		}
	},
	drawCirclesAtNumber : function(x1,y1,x2,y2){
		this.vinc('cell_circle', 'auto');

		var clist = bd.cellinside(x1-2,y1-2,x2+2,y2+2);
		for(var i=0;i<clist.length;i++){ this.drawCircle1AtNumber(clist[i]);}
	},
	drawCircle1AtNumber : function(c){
		if(c===-1){ return;}

		var rsize  = this.cw*this.circleratio[0];
		var rsize2 = this.cw*this.circleratio[1];
		var headers = ["c_cira_", "c_cirb_"];

		if(bd.cell[c].qnum!=-1){
			g.lineWidth = this.cw*0.05;
			g.fillStyle = (bd.cell[c].error===1 ? this.errbcolor1 : this.circledcolor);
			if(this.vnop(headers[1]+c,this.FILL)){
				g.fillCircle(bd.cell[c].cpx, bd.cell[c].cpy, rsize2);
			}

			g.strokeStyle = (bd.cell[c].error===1 ? this.errcolor1 : this.Cellcolor);
			if(this.vnop(headers[0]+c,this.STROKE)){
				g.strokeCircle(bd.cell[c].cpx, bd.cell[c].cpy, rsize);
			}
		}
		else{ this.vhide([headers[0]+c, headers[1]+c]);}
	},

	//---------------------------------------------------------------------------
	// pc.drawLineParts()   ���Ȃǂ�Canvas�ɏ�������
	// pc.drawLineParts1()  ���Ȃǂ�Canvas�ɏ�������(1�}�X�̂�)
	//---------------------------------------------------------------------------
	drawLineParts : function(x1,y1,x2,y2){
		this.vinc('cell_lineparts', 'crispEdges');

		var clist = bd.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){ this.drawLineParts1(clist[i]);}
	},
	drawLineParts1 : function(id){
		var vids = ["c_lp1_"+id, "c_lp2_"+id, "c_lp3_"+id, "c_lp4_"+id];

		var qs = bd.cell[id].ques;
		if(qs>=101 && qs<=107){
			var lw  = this.lw, lm = this.lm;
			var hhp = this.bh+this.lm, hwp = this.bw+this.lm;
			var px  = bd.cell[id].px, py = bd.cell[id].py;
			var cpx = bd.cell[id].cpx, cpy = bd.cell[id].cpy;
			g.fillStyle = this.BorderQuescolor;

			var flag  = {101:15, 102:3, 103:12, 104:9, 105:5, 106:6, 107:10}[qs];
			if(flag&1){ if(this.vnop(vids[0],this.NONE)){ g.fillRect(cpx-lm, py    , lw, hhp);} }else{ this.vhide(vids[0]);}
			if(flag&2){ if(this.vnop(vids[1],this.NONE)){ g.fillRect(cpx-lm, cpy-lm, lw, hhp);} }else{ this.vhide(vids[1]);}
			if(flag&4){ if(this.vnop(vids[2],this.NONE)){ g.fillRect(px    , cpy-lm, hwp, lw);} }else{ this.vhide(vids[2]);}
			if(flag&8){ if(this.vnop(vids[3],this.NONE)){ g.fillRect(cpx-lm, cpy-lm, hwp, lw);} }else{ this.vhide(vids[3]);}
		}
		else{ this.vhide(vids);}
	},

	//---------------------------------------------------------------------------
	// pc.drawQues51()         Ques===51������悤�ȃp�Y���ŁA�`��֐����Ăяo��
	// pc.drawSlash51Cells()   [�_]�̃i�i������Canvas�ɏ�������
	// pc.drawSlash51EXcells() EXCell���[�_]�̃i�i������Canvas�ɏ�������
	// pc.drawEXCellGrid()     EXCell�Ԃ̋��E����Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawQues51 : function(x1,y1,x2,y2){
		this.drawEXCellGrid(x1,y1,x2,y2);
		this.drawSlash51Cells(x1,y1,x2,y2);
		this.drawSlash51EXcells(x1,y1,x2,y2);
		this.drawTargetTriangle(x1,y1,x2,y2);
	},
	drawSlash51Cells : function(x1,y1,x2,y2){
		this.vinc('cell_ques51', 'crispEdges');

		var header = "c_slash51_";
		g.strokeStyle = this.Cellcolor;
		g.lineWidth = 1;
		var clist = bd.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i], px = bd.cell[c].px, py = bd.cell[c].py;

			if(bd.cell[c].ques===51){
				if(this.vnop(header+c,this.NONE)){
					g.strokeLine(px+1,py+1, px+this.cw,py+this.ch);
				}
			}
			else{ this.vhide(header+c);}
		}
	},
	drawSlash51EXcells : function(x1,y1,x2,y2){
		this.vinc('excell_ques51', 'crispEdges');

		var header = "ex_slash51_";
		g.strokeStyle = this.Cellcolor;
		g.lineWidth = 1;
		var exlist = bd.excellinside(x1-1,y1-1,x2,y2);
		for(var i=0;i<exlist.length;i++){
			var c = exlist[i], px = bd.excell[c].px, py = bd.excell[c].py;
			if(this.vnop(header+c,this.NONE)){
				g.strokeLine(px+1,py+1, px+this.cw,py+this.ch);
			}
		}
	},
	drawEXCellGrid : function(x1,y1,x2,y2){
		this.vinc('grid_excell', 'crispEdges');

		g.fillStyle = this.Cellcolor;
		var headers = ["ex_bdx_", "ex_bdy_"];
		var exlist = bd.excellinside(x1-1,y1-1,x2,y2);
		for(var i=0;i<exlist.length;i++){
			var c = exlist[i], px = bd.excell[c].px, py = bd.excell[c].py;

			if(bd.excell[c].by===-1 && bd.excell[c].bx<bd.maxbx){
				if(this.vnop(headers[0]+c,this.NONE)){
					g.fillRect(px+this.cw, py, 1, this.ch);
				}
			}

			if(bd.excell[c].bx===-1 && bd.excell[c].by<bd.maxby){
				if(this.vnop(headers[1]+c,this.NONE)){
					g.fillRect(px, py+this.ch, this.cw, 1);
				}
			}
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawTarget()  ���͑ΏۂƂȂ�ꏊ��`�悷��
	// pc.drawCursor()  �L�[�{�[�h����̓��͑Ώۂ�Canvas�ɏ�������
	// pc.drawTargetTriangle() [�_]�̂������͑Ώۂ̂ق��ɔw�i�F������
	//---------------------------------------------------------------------------
	drawTarget : function(x1,y1,x2,y2){
		this.drawCursor(x1, y1, x2, y2, true, k.editmode);
	},

	drawCursor : function(x1,y1,x2,y2,islarge,isdraw){
		this.vinc('target_cursor', 'crispEdges');

		if(isdraw!==false && pp.getVal('cursor')){
			if(tc.cursolx < x1-1 || x2+1 < tc.cursolx){ return;}
			if(tc.cursoly < y1-1 || y2+1 < tc.cursoly){ return;}

			var cpx = k.p0.x + tc.cursolx*this.bw + 0.5;
			var cpy = k.p0.y + tc.cursoly*this.bh + 0.5;
			var w, size;
			if(islarge!==false){ w = mf(Math.max(this.cw/16, 2)); size = this.bw-0.5;}
			else	           { w = mf(Math.max(this.cw/24, 1)); size = this.bw*0.56;}

			this.vdel(["ti1_","ti2_","ti3_","ti4_"]);
			g.fillStyle = (k.editmode?this.targetColor1:this.targetColor3);
			if(this.vnop("ti1_",this.FILL)){ g.fillRect(cpx-size,   cpy-size,   size*2, w);}
			if(this.vnop("ti2_",this.FILL)){ g.fillRect(cpx-size,   cpy-size,   w, size*2);}
			if(this.vnop("ti3_",this.FILL)){ g.fillRect(cpx-size,   cpy+size-w, size*2, w);}
			if(this.vnop("ti4_",this.FILL)){ g.fillRect(cpx+size-w, cpy-size,   w, size*2);}
		}
		else{ this.vhide(["ti1_","ti2_","ti3_","ti4_"]);}
	},

	drawTargetTriangle : function(x1,y1,x2,y2){
		this.vinc('target_triangle', 'auto');

		var vid = "target_triangle";
		this.vdel([vid]);

		if(k.playmode){ return;}

		if(tc.cursolx < x1 || x2+2 < tc.cursolx){ return;}
		if(tc.cursoly < y1 || y2+2 < tc.cursoly){ return;}

		var cc = tc.getTCC(), ex = -1;
		if(cc===-1){ ex = tc.getTEC();}
		var target = kc.detectTarget(cc,ex);
		if(target===-1){ return;}

		g.fillStyle = this.TTcolor;
		this.drawTriangle1(k.p0.x+(tc.cursolx>>1)*this.cw, k.p0.y+(tc.cursoly>>1)*this.ch, (target===2?4:2), vid);
	},

	//---------------------------------------------------------------------------
	// pc.drawDashedCenterLines() �Z���̒��S���璆�S�ɂЂ����_����Canvas�ɕ`�悷��
	//---------------------------------------------------------------------------
	drawDashedCenterLines : function(x1,y1,x2,y2){
		this.vinc('centerline', 'crispEdges');
		if(x1<bd.minbx+1){ x1=bd.minbx+1;} if(x2>bd.maxbx-1){ x2=bd.maxbx-1;}
		if(y1<bd.minby+1){ y1=bd.minby+1;} if(y2>bd.maxby-1){ y2=bd.maxby-1;}
		x1|=1, y1|=1;

		if(g.use.canvas){
			g.fillStyle = this.gridcolor;
			for(var i=x1;i<=x2;i+=2){
				for(var j=(k.p0.y+y1*this.bh),len=(k.p0.y+y2*this.bh);j<len;j+=6){
					g.fillRect(k.p0.x+i*this.bw, j, 1, 3);
				}
			}
			for(var i=y1;i<=y2;i+=2){
				for(var j=(k.p0.x+x1*this.bw),len=(k.p0.x+x2*this.bw);j<len;j+=6){
					g.fillRect(j, k.p0.y+i*this.bh, 3, 1);
				}
			}
		}
		else{
			g.lineWidth = 1;
			g.strokeStyle = this.gridcolor;
			for(var i=x1;i<=x2;i+=2){ if(this.vnop("cliney_"+i,this.NONE)){
				var px = k.p0.x+i*this.bw, py1 = k.p0.y+y1*this.bh, py2 = k.p0.y+y2*this.bh;
				g.strokeLine(px, py1, px, py2);
				g.setDashSize(3);
			}}
			for(var i=y1;i<=y2;i+=2){ if(this.vnop("clinex_"+i,this.NONE)){
				var py = k.p0.y+i*this.bh, px1 = k.p0.x+x1*this.bw, px2 = k.p0.x+x2*this.bw;
				g.strokeLine(px1, py, px2, py);
				g.setDashSize(3);
			}}
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawGrid()        �Z���̘g��(����)��Canvas�ɏ�������
	// pc.drawDashedGrid()  �Z���̘g��(�_��)��Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawGrid : function(x1,y1,x2,y2,isdraw){
		this.vinc('grid', 'crispEdges');

		// �O�g�܂ŕ`�悷��킯����Ȃ��̂ŁAmaxbx�Ƃ��g���܂���
		if(x1<0){ x1=0;} if(x2>2*k.qcols){ x2=2*k.qcols;}
		if(y1<0){ y1=0;} if(y2>2*k.qrows){ y2=2*k.qrows;}
		x1-=(x1&1), y1-=(y1&1);

		var bs=((k.isborder!==2&&this.chassisflag)?2:0);
		var xa = Math.max(x1,0+bs), xb = Math.min(x2,2*k.qcols-bs);
		var ya = Math.max(y1,0+bs), yb = Math.min(y2,2*k.qrows-bs);

		isdraw = (isdraw!==false?true:false);
		if(isdraw){
			g.fillStyle = this.gridcolor;
			for(var i=xa;i<=xb;i+=2){ if(this.vnop("bdy_"+i,this.NONE)){ g.fillRect(k.p0.x+i*this.bw, k.p0.y+y1*this.bh, 1, (y2-y1)*this.bh+1);} }
			for(var i=ya;i<=yb;i+=2){ if(this.vnop("bdx_"+i,this.NONE)){ g.fillRect(k.p0.x+x1*this.bw, k.p0.y+i*this.bh, (x2-x1)*this.bw+1, 1);} }
		}
		else{
			if(!g.use.canvas){
				for(var i=xa;i<=xb;i+=2){ this.vhide("bdy_"+i);}
				for(var i=ya;i<=yb;i+=2){ this.vhide("bdx_"+i);}
			}
		}
	},
	drawDashedGrid : function(x1,y1,x2,y2){
		this.vinc('grid', 'crispEdges');
		if(x1<bd.minbx){ x1=bd.minbx;} if(x2>bd.maxbx){ x2=bd.maxbx;}
		if(y1<bd.minby){ y1=bd.minby;} if(y2>bd.maxby){ y2=bd.maxby;}
		x1-=(x1&1), y1-=(y1&1);

		var dotmax   = this.cw/10+3;
		var dotCount = Math.max(this.cw/dotmax, 1);
		var dotSize  = this.cw/(dotCount*2);

		//var bs=((k.isborder!==2&&this.chassisflag)?1:0);
		var bs=(this.chassisflag?2:0);
		var xa = Math.max(x1,bd.minbx+bs), xb = Math.min(x2,bd.maxbx-bs);
		var ya = Math.max(y1,bd.minby+bs), yb = Math.min(y2,bd.maxby-bs);

		if(g.use.canvas){
			g.fillStyle = this.gridcolor;
			for(var i=xa;i<=xb;i+=2){
				var px = k.p0.x+i*this.bw;
				for(var j=(k.p0.y+y1*this.bh),len=(k.p0.y+y2*this.bh);j<len;j+=(2*dotSize)){
					g.fillRect(px, j, 1, dotSize);
				}
			}
			for(var i=ya;i<=yb;i+=2){
				var py = k.p0.y+i*this.bh;
				for(var j=(k.p0.x+x1*this.bw),len=(k.p0.x+x2*this.bw);j<len;j+=(2*dotSize)){
					g.fillRect(j, py, dotSize, 1);
				}
			}
		}
		else{
			// stroke�Ԃ�0.5���炷
			g.lineWidth = 1;
			g.strokeStyle = this.gridcolor;
			for(var i=xa;i<=xb;i+=2){ if(this.vnop("bdy_"+i,this.NONE)){
				var px = k.p0.x+i*this.bw+0.5, py1 = k.p0.y+y1*this.bh, py2 = k.p0.y+y2*this.bh;
				g.strokeLine(px, py1, px, py2);
				g.setDashSize(dotSize);
			}}
			for(var i=ya;i<=yb;i+=2){ if(this.vnop("bdx_"+i,this.NONE)){
				var py = k.p0.y+i*this.bh+0.5, px1 = k.p0.x+x1*this.bw, px2 = k.p0.x+x2*this.bw;
				g.strokeLine(px1, py, px2, py);
				g.setDashSize(dotSize);
			}}
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawChassis()     �O�g��Canvas�ɏ�������
	// pc.drawChassis_ex1() k.isextencdell==1�̎��̊O�g��Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawChassis : function(x1,y1,x2,y2){
		this.vinc('chassis', 'crispEdges');

		// ex===0��ex===2�œ����ꏊ�ɕ`�悷��̂ŁAmaxbx�Ƃ��g���܂���
		if(x1<0){ x1=0;} if(x2>2*k.qcols){ x2=2*k.qcols;}
		if(y1<0){ y1=0;} if(y2>2*k.qrows){ y2=2*k.qrows;}

		var lw = (k.puzzleid!=='bosanowa'?this.lw:1), bw = this.bw, bh = this.bh;
		var boardWidth = k.qcols*this.cw, boardHeight = k.qrows*this.ch;
		g.fillStyle = "black";

		if(g.use.canvas){
			if(x1===0)        { g.fillRect(k.p0.x      -lw+1, k.p0.y+y1*bh-lw+1,  lw, (y2-y1)*bh+2*lw-2);}
			if(x2===2*k.qcols){ g.fillRect(k.p0.x+boardWidth, k.p0.y+y1*bh-lw+1,  lw, (y2-y1)*bh+2*lw-2);}
			if(y1===0)        { g.fillRect(k.p0.x+x1*bw-lw+1, k.p0.y      -lw+1,  (x2-x1)*bw+2*lw-2, lw); }
			if(y2===2*k.qrows){ g.fillRect(k.p0.x+x1*bw-lw+1, k.p0.y+boardHeight, (x2-x1)*bw+2*lw-2, lw); }
		}
		else{
			if(this.vnop("chs1_",this.NONE)){ g.fillRect(k.p0.x-lw+1,        k.p0.y-lw+1, lw, boardHeight+2*lw-2);}
			if(this.vnop("chs2_",this.NONE)){ g.fillRect(k.p0.x+boardWidth,  k.p0.y-lw+1, lw, boardHeight+2*lw-2);}
			if(this.vnop("chs3_",this.NONE)){ g.fillRect(k.p0.x-lw+1,        k.p0.y-lw+1, boardWidth+2*lw-2, lw); }
			if(this.vnop("chs4_",this.NONE)){ g.fillRect(k.p0.x-lw+1, k.p0.y+boardHeight, boardWidth+2*lw-2, lw); }
		}
	},
	drawChassis_ex1 : function(x1,y1,x2,y2,boldflag){
		this.vinc('chassis_ex1', 'crispEdges');
		if(x1<=0){ x1=bd.minbx;} if(x2>bd.maxbx){ x2=bd.maxbx;}
		if(y1<=0){ y1=bd.minby;} if(y2>bd.maxby){ y2=bd.maxby;}

		var lw = this.lw, lm = this.lm, bw = this.bw, bh = this.bh;
		var boardWidth = k.qcols*this.cw, boardHeight = k.qrows*this.ch;
		g.fillStyle = "black";

		// extendcell==1���܂񂾊O�g�̕`��
		if(g.use.canvas){
			if(x1===bd.minbx){ g.fillRect(k.p0.x-this.cw-lw+1, k.p0.y+y1*bh-lw+1,   lw, (y2-y1)*bh+2*lw-2);}
			if(x2===bd.maxbx){ g.fillRect(k.p0.x+boardWidth,   k.p0.y+y1*bh-lw+1,   lw, (y2-y1)*bh+2*lw-2);}
			if(y1===bd.minby){ g.fillRect(k.p0.x+x1*bw-lw+1,   k.p0.y-this.ch-lw+1, (x2-x1)*bw+2*lw-2, lw);}
			if(y2===bd.maxby){ g.fillRect(k.p0.x+x1*bw-lw+1,   k.p0.y+boardHeight,  (x2-x1)*bw+2*lw-2, lw);}
		}
		else{
			if(this.vnop("chsex1_1_",this.NONE)){ g.fillRect(k.p0.x-this.cw-lw+1, k.p0.y-this.ch-lw+1, lw, boardHeight+this.ch+2*lw-2);}
			if(this.vnop("chsex1_2_",this.NONE)){ g.fillRect(k.p0.x+boardWidth,   k.p0.y-this.ch-lw+1, lw, boardHeight+this.ch+2*lw-2);}
			if(this.vnop("chsex1_3_",this.NONE)){ g.fillRect(k.p0.x-this.cw-lw+1, k.p0.y-this.ch-lw+1, boardWidth+this.cw+2*lw-2, lw); }
			if(this.vnop("chsex1_4_",this.NONE)){ g.fillRect(k.p0.x-this.cw-lw+1, k.p0.y+boardHeight,  boardWidth+this.cw+2*lw-2, lw); }
		}

		// �ʏ�̃Z����extendcell==1�̊Ԃ̕`��
		if(boldflag){
			// ���ׂđ����ŕ`�悷��ꍇ
			if(g.use.canvas){
				if(x1<=0){ g.fillRect(k.p0.x-lw+1, k.p0.y+y1*bh-lw+1, lw, (y2-y1)*bh+lw-1);}
				if(y1<=0){ g.fillRect(k.p0.x+x1*bw-lw+1, k.p0.y-lw+1, (x2-x1)*bw+lw-1, lw); }
			}
			else{
				if(this.vnop("chs1_",this.NONE)){ g.fillRect(k.p0.x-lw+1, k.p0.y-lw+1, lw, boardHeight+lw-1);}
				if(this.vnop("chs2_",this.NONE)){ g.fillRect(k.p0.x-lw+1, k.p0.y-lw+1, boardWidth+lw-1,  lw);}
			}
		}
		else{
			// ques==51�̃Z�����אڂ��Ă��鎞�ɍא���`�悷��ꍇ
			if(g.use.canvas){
				if(x1<=0){ g.fillRect(k.p0.x, k.p0.y+y1*bh, 1, (y2-y1)*bh);}
				if(y1<=0){ g.fillRect(k.p0.x+x1*bw, k.p0.y, (x2-x1)*bw, 1); }
			}
			else{
				if(this.vnop("chs1_",this.NONE)){ g.fillRect(k.p0.x, k.p0.y, 1, boardHeight);}
				if(this.vnop("chs2_",this.NONE)){ g.fillRect(k.p0.x, k.p0.y, boardWidth, 1); }
			}

			var headers = ["chs1_sub_", "chs2_sub_"];
			var clist = bd.cellinside(x1-1,y1-1,x2+1,y2+1);
			for(var i=0;i<clist.length;i++){
				var c = clist[i], bx = bd.cell[c].bx, by = bd.cell[c].by;
				var px = bd.cell[c].px, py = bd.cell[c].py;
				if(bx===1){
					if(bd.cell[c].ques!==51){
						if(this.vnop(headers[0]+by,this.NONE)){
							g.fillRect(k.p0.x-lm, py-lm, lw, this.ch+lw);
						}
					}
					else{ this.vhide([headers[0]+by]);}
				}
				if(by===1){
					if(bd.cell[c].ques!==51){
						if(this.vnop(headers[1]+bx,this.NONE)){
							g.fillRect(px-lm, k.p0.x-lm, this.cw+lw, lw);
						}
					}
					else{ this.vhide([headers[1]+bx]);}
				}
			}
		}
	},

	//---------------------------------------------------------------------------
	// pc.flushCanvas()    �w�肳�ꂽ�̈�𔒂œh��Ԃ�
	// pc.flushCanvasAll() Canvas�S�ʂ𔒂œh��Ԃ�
	//
	// pc.vnop()  VML�Ŋ��ɕ`�悳��Ă���I�u�W�F�N�g���ĕ`�悹���A�F�͐ݒ肷��
	// pc.vhide() VML�Ŋ��ɕ`�悳��Ă���I�u�W�F�N�g���B��
	// pc.vdel()  VML�Ŋ��ɕ`�悳��Ă���I�u�W�F�N�g���폜����
	// pc.vinc()  z-index�ɐݒ肳���l��+1����
	//---------------------------------------------------------------------------
	flushCanvasAll : f_true,
	flushCanvas    : f_true,
	vnop  : f_true,
	vhide : f_true,
	vdel  : f_true,
	vinc  : f_true,

	setVectorFunctions : function(){
		if(g.use.canvas){
			this.flushCanvasAll = function(x1,y1,x2,y2){
				this.numobj = {};
				base.numparent.innerHTML = '';
			};
			this.flushCanvas = function(x1,y1,x2,y2){
				g.fillStyle = (!this.bgcolor ? "rgb(255, 255, 255)" : this.bgcolor);
				g.fillRect(k.p0.x+x1*this.bw, k.p0.y+y1*this.bh, (x2-x1)*this.bw, (y2-y1)*this.bh);
			};
			this.vnop  = f_true;
			this.vhide = f_true;
			this.vdel  = f_true;
			this.vinc = function(layerid, rendering){
				g.setLayer(layerid);
				if(rendering){ g.setRendering(rendering);}
			};
		}
		else{
			this.flushCanvasAll = function(x1,y1,x2,y2){
				g.clear();
				this.zidx=0;
				this.zidx_array=[];

				this.numobj = {};
				base.numparent.innerHTML = '';

				this.vinc('board_base', 'crispEdges');
				g.fillStyle = (!this.bgcolor ? "rgb(255, 255, 255)" : this.bgcolor);
				if(this.vnop("boardfull",this.NONE)){
					g.fillRect(k.p0.x, k.p0.y, k.qcols*this.cw, k.qrows*this.ch);
				}
			};
			this.flushCanvas = function(x1,y1,x2,y2){
				this.zidx=1;
			};
			this.vnop = function(vid, ccflag){ // stroke�̂�:0, fill�̂�:1, ����:2, �F�̕ύX�Ȃ�:3
				g.vid = vid;
				if(!!g.elements[vid]){
					var el = g.elements[vid],
						isfill   = this.vnop_FILL[ccflag],
						isstroke = this.vnop_STROKE[ccflag];

					if(g.use.vml){
						el.style.display = 'inline';
						if(isfill)  { el.fillcolor   = Camp.parse(g.fillStyle);}
						if(isstroke){ el.strokecolor = Camp.parse(g.strokeStyle);}
					}
					else if(g.use.sl){
						el.Visibility = "Visible";
						if(isfill)  { el.fill   = Camp.parse(g.fillStyle);  }
						if(isstroke){ el.stroke = Camp.parse(g.strokeStyle);}
					}
					else if(g.use.svg){
						el.style.display = 'inline';
						if(isfill)  { el.setAttribute('fill',  Camp.parse(g.fillStyle));}
						if(isstroke){ el.setAttribute('stroke',Camp.parse(g.strokeStyle));}
					}
					return false;
				}
				return true;
			};
			this.vhide = function(vid){
				if(typeof vid === 'string'){ vid = [vid];}
				for(var i=0;i<vid.length;i++){
					if(g.elements[vid[i]]){
						if(!g.use.sl){ g.elements[vid[i]].style.display = 'none';}
						else{ g.elements[vid[i]].Visibility = "Collapsed";}
					}
				}
			};
			this.vdel = function(vid){
				for(var i=0;i<vid.length;i++){
					if(g.elements[vid[i]]){
						if(!g.use.sl){ g.target.removeChild(g.elements[vid[i]]);}
						else{ g.elements[vid[i]].Visibility = "Collapsed";}
						g.elements[vid[i]] = null;
					}
				}
			};
			this.vinc = function(layerid, rendering){
				g.vid = "";
				g.setLayer(layerid);

				if(!this.zidx_array[layerid]){
					this.zidx++;
					this.zidx_array[layerid] = this.zidx;
					if(rendering){ g.setRendering(rendering);}
					if(!g.use.sl){ g.getLayerElement().style.zIndex = this.zidx;}
					else{ g.getLayerElement()["Canvas.ZIndex"] = this.zidx;}
				}
			};
		}
	},

	//---------------------------------------------------------------------------
	// pc.showEL()          �G�������g��\������
	// pc.hideEL()          �G�������g���B��
	// pc.isdispnumCell()   �������L���ł��邩���肷��
	// pc.getNumberColor()  �����̐F�𔻒肷��
	//---------------------------------------------------------------------------
	// �����\���֐�
	showEL : function(key){ this.numobj[key].style.display = 'inline'; },	// �������Ȃ��Ă��悳�����B
	hideEL : function(key){ if(!!this.numobj[key]){ this.numobj[key].style.display = 'none';} },

	setFunctions : function(){
		this.isdispnumCell = (
			(k.isDispHatena ?
				k.dispzero ? function(id){ var num=bd.getNum(id); return (num>=0 || num===-2);}
						   : function(id){ var num=bd.getNum(id); return (num> 0 || num===-2);}
			:
				k.dispzero ? function(id){ var num=bd.getNum(id); return (num>=0);}
						   : function(id){ var num=bd.getNum(id); return (num> 0);}
			)
		);
		this.getNumberColor = (
			(k.isAnsNumber ?
				function(id){
					if(bd.cell[id].error===1 || bd.cell[id].error===4){ return this.fontErrcolor;}
					return (bd.cell[id].qnum!==-1 ? this.fontcolor : this.fontAnscolor);
				}
			: k.BlackCell ?
				function(id){
					if(bd.cell[id].qans===1){ return this.BCell_fontcolor;}
					else if(bd.cell[id].error===1 || bd.cell[id].error===4){ return this.fontErrcolor;}
					return this.fontcolor;
				}
			:
				function(id){
					if(bd.cell[id].ques!==0){ return this.BCell_fontcolor;}
					else if(bd.cell[id].error===1 || bd.cell[id].error===4){ return this.fontErrcolor;}
					return this.fontcolor;
				}
			)
		);
	},
	isdispnumCell  : f_true,
	getNumberColor : function(){ return this.fontcolor;},

	//---------------------------------------------------------------------------
	// pc.dispnumCell()   Cell�ɐ������L�����邽�߂̒l�����肷��
	// pc.dispnumCross()  Cross�ɐ������L�����邽�߂̒l�����肷��
	// pc.dispnumBorder() Border�ɐ������L�����邽�߂̒l�����肷��
	//---------------------------------------------------------------------------
	dispnumCell : function(id){
		var obj = bd.cell[id], key = ['cell',id].join('_');
		if(this.isdispnumCell(id)){
			var type = ((obj.ques>=2 && obj.ques<=5) ? obj.ques : 1);
			var num  = bd.getNum(id);
			var text = (num>=0 ? ""+num : "?");

			var fontratio = 0.45;
			if(type===1){ fontratio = (num<10?0.8:(num<100?0.7:0.55));}

			var color = this.getNumberColor(id);

			this.dispnum(key, type, text, fontratio, color, obj.cpx, obj.cpy);
		}
		else{ this.hideEL(key);}
	},
	dispnumCross : function(id){
		var obj = bd.cross[id], key = ['cross',id].join('_');
		if(obj.qnum>0 || (obj.qnum===0 && k.dispzero)){
			var text  = ""+obj.qnum;
			var color = this.fontcolor;

			this.dispnum(key, 1, text, 0.6, color, obj.px, obj.py);
		}
		else{ this.hideEL(key);}
	},
	dispnumBorder : function(id){
		var obj = bd.border[id], key = ['border',id].join('_');
		if(obj.qnum>0 || (obj.qnum===0 && k.dispzero)){
			var text  = ""+obj.qnum;
			var color = this.borderfontcolor;

			this.dispnum(key, 1, text, 0.45, color, obj.px, obj.py);
		}
		else{ this.hideEL(key);}
	},

	//---------------------------------------------------------------------------
	// pc.dispnum()  �������L�����邽�߂̋��ʊ֐�
	//---------------------------------------------------------------------------
	dispnum : function(key, type, text, fontratio, color, px, py){
		if(!this.fillTextPrecisely){
			if(k.br.IEmoz4){ py+=2;}

			// �G�������g���擾
			var el = this.numobj[key];
			if(!el){ el = this.numobj[key] = ee.createEL(this.EL_NUMOBJ,'');}

			el.innerHTML = text;

			var fontsize = mf(this.cw*fontratio*this.fontsizeratio);
			el.style.fontSize = (""+ fontsize + 'px');

			this.showEL(key);	// ��ɕ\�����Ȃ���wid,hgt=0�ɂȂ��Ĉʒu�������

			var wid = el.offsetWidth;
			var hgt = el.offsetHeight;

			if(type===1){
				px+=2; // �Ȃ񂩂�����Ƃ����
				el.style.left = k.cv_oft.x+px-wid/2 + 'px';
				el.style.top  = k.cv_oft.y+py-hgt/2 + 'px';
			}
			else{
				if     (type===3||type===4){ el.style.left = k.cv_oft.x+px+this.bw-wid -1 + 'px';}
				else if(type===2||type===5){ el.style.left = k.cv_oft.x+px-this.bw     +3 + 'px';}
				if     (type===2||type===3){ el.style.top  = k.cv_oft.y+py+this.bh-hgt -1 + 'px';}
				else if(type===4||type===5){ el.style.top  = k.cv_oft.y+py-this.bh     +2 + 'px';}
			}

			el.style.color = color;
		}
		// Native�ȕ��@�͂������Ȃ񂾂��ǁA�A(�O�͌v5�`6%���炢�x���Ȃ��Ă�)
		else{
			g.font = ""+mf(this.cw*fontratio*this.fontsizeratio)+"px 'Serif'";
			g.fillStyle = color;
			if(type===1){
				g.textAlign = 'center'; g.textBaseline = 'middle';
			}
			else{
				g.textAlign    = ((type===3||type===4)?'right':'left');
				g.textBaseline = ((type===2||type===3)?'alphabetic':'top');
				px += ((type===3||type===4)?this.bw-1:-this.bw+2), py += ((type===2||type===3)?this.bh-2:-this.bh+1);
			}
			g.fillText(text, px, py);
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawNumbersOn51()   [�_]�ɐ������L������
	// pc.drawNumbersOn51_1() 1��[�_]�ɐ������L������
	//---------------------------------------------------------------------------
	drawNumbersOn51 : function(x1,y1,x2,y2){
		this.vinc('cell_number51', 'auto');

		for(var bx=(x1|1)-2;bx<=x2+2;bx+=2){
			for(var by=(y1|1)-2;by<=y2+2;by+=2){
				// cell�ゾ�����ꍇ
				if(bx!==-1 && by!==-1){
					var c = bd.cnum(bx,by);
					if(c!==-1){ this.drawNumbersOn51_1('cell', c);}
				}
				// excell�ゾ�����ꍇ
				else{
					var c = bd.exnum(bx,by);
					if(c!==-1){ this.drawNumbersOn51_1('excell', c);}
				}
			}
		}
	},
	drawNumbersOn51_1 : function(family, c){
		var val, err, guard, nb, type, str, obj=bd[family][c];
		var keys = [[family,c,'ques51','rt'].join('_'), [family,c,'ques51','dn'].join('_')];

		if(family==='excell' || bd.cell[c].ques===51){
			for(var i=0;i<2;i++){
				if     (i===0){ val=obj.qnum,  guard=obj.by, nb=bd.cnum(obj.bx+2, obj.by), type=4;} // 1��ڂ͉E����
				else if(i===1){ val=obj.direc, guard=obj.bx, nb=bd.cnum(obj.bx, obj.by+2), type=2;} // 2��ڂ͉�����

				if(val!==-1 && guard!==-1 && nb!==-1 && bd.cell[nb].ques!==51){
					var color = (obj.error===1?this.fontErrcolor:this.fontcolor);
					var text = (val>=0?""+val:"");

					this.dispnum(keys[i], type, text, 0.45, color, obj.px+this.bw, obj.py+this.bh);
				}
				else{ this.hideEL(keys[i]);}
			}
		}
		else{
			this.hideEL(keys[0]);
			this.hideEL(keys[1]);
		}
	}
};
