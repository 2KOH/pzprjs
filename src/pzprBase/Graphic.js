// Graphic.js v3.2.3

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

	this.lw = 1;	// LineWidth ���E���ELine�̑���
	this.lm = 1;	// LineMargin
	this.addlw = 0;	// �G���[���ɐ��̑������L����

	this.chassisflag = true;	// false: Grid���O�g�̈ʒu�ɂ��`�悷��
	this.zstable     = false;	// �F�����̈ꕔ�ĕ`�掞��true�ɂ���(VML�p)
	this.textenable  = false;	// ������g.fillText()�ŕ`��(���݂̓R�����g�A�E�g)

	this.lastHdeg = 0;
	this.lastYdeg = 0;
	this.minYdeg = 0.18;
	this.maxYdeg = 0.70;

	this.setFunctions();
};
Graphic.prototype = {
	//---------------------------------------------------------------------------
	// pc.onresize_func() resize���ɃT�C�Y��ύX����
	// pc.already()       Canvas�����p�ł��邩(Safari3�΍��p)
	//---------------------------------------------------------------------------
	onresize_func : function(){
		this.lw = (mf(k.cwidth/12)>=3?mf(k.cwidth/12):3);
		this.lm = mf((this.lw-1)/2);

		//this.textenable = !!g.fillText;
	},
	already : (!k.br.IE ? f_true : function(){
		return uuCanvas.already();
	}),
	//---------------------------------------------------------------------------
	// pc.paint()       ���W(x1,y1)-(x2,y2)���ĕ`�悷��B�e�p�Y���̃t�@�C���ŃI�[�o�[���C�h�����B
	// pc.paintAll()    �S�̂��ĕ`�悷��
	// pc.paintBorder() �w�肳�ꂽBorder�̎�����ĕ`�悷��
	// pc.paintLine()   �w�肳�ꂽLine�̎�����ĕ`�悷��
	// pc.paintCell()   �w�肳�ꂽCell���ĕ`�悷��
	// pc.paintEXcell() �w�肳�ꂽEXCell���ĕ`�悷��
	//---------------------------------------------------------------------------
	paint : function(x1,y1,x2,y2){ }, //�I�[�o�[���C�h�p
	paintAll : (
		(!k.br.IE) ? function(){ this.paint(-1,-1,k.qcols,k.qrows); }
				   : function(){ if(this.already()){ this.paint(-1,-1,k.qcols,k.qrows);} }
	),
	paintBorder : function(id){
		if(isNaN(id) || !bd.border[id]){ return;}
		if(bd.border[id].cx&1){
			this.paint(mf((bd.border[id].cx-1)/2)-1, mf(bd.border[id].cy/2)-1,
					   mf((bd.border[id].cx-1)/2)+1, mf(bd.border[id].cy/2)   );
		}
		else{
			this.paint(mf(bd.border[id].cx/2)-1, mf((bd.border[id].cy-1)/2)-1,
					   mf(bd.border[id].cx/2)  , mf((bd.border[id].cy-1)/2)+1 );
		}
	},
	paintLine : function(id){
		if(isNaN(id) || !bd.border[id]){ return;}
		if(bd.border[id].cx&1){
			this.paint(mf((bd.border[id].cx-1)/2), mf(bd.border[id].cy/2)-1,
					   mf((bd.border[id].cx-1)/2), mf(bd.border[id].cy/2)   );
		}
		else{
			this.paint(mf(bd.border[id].cx/2)-1, mf((bd.border[id].cy-1)/2),
					   mf(bd.border[id].cx/2)  , mf((bd.border[id].cy-1)/2) );
		}
	},
	paintCell : function(cc){
		if(isNaN(cc) || !bd.cell[cc]){ return;}
		this.paint(bd.cell[cc].cx, bd.cell[cc].cy, bd.cell[cc].cx, bd.cell[cc].cy);
	},
	paintEXcell : function(ec){
		if(isNaN(ec) || !bd.excell[ec]){ return;}
		this.paint(bd.excell[ec].cx, bd.excell[ec].cy, bd.excell[ec].cx, bd.excell[ec].cy);
	},

	//---------------------------------------------------------------------------
	// pc.cellinside()   ���W(x1,y1)-(x2,y2)�Ɋ܂܂��Cell��ID���X�g���擾����
	// pc.crossinside()  ���W(x1,y1)-(x2,y2)�Ɋ܂܂��Cross��ID���X�g���擾����
	// pc.borderinside() ���W(x1,y1)-(x2,y2)�Ɋ܂܂��Border��ID���X�g���擾����
	// pc.excellinside() ���W(x1,y1)-(x2,y2)�Ɋ܂܂��Excell��ID���X�g���擾����
	// pc.cellinside_cond() ���W(x1,y1)-(x2,y2)�Ɋ܂܂������t��Cell��ID���X�g���擾����
	//---------------------------------------------------------------------------
	cellinside : function(x1,y1,x2,y2){
		var clist = [];
		for(var cy=y1;cy<=y2;cy++){ for(var cx=x1;cx<=x2;cx++){
			var c = bd.cnum(cx,cy);
			if(c!==-1){ clist.push(c);}
		}}
		return clist;
	},
	crossinside : function(x1,y1,x2,y2){
		var clist = [];
		for(var cy=y1;cy<=y2;cy++){ for(var cx=x1;cx<=x2;cx++){
			var c = bd.xnum(cx,cy);
			if(c!==-1){ clist.push(c);}
		}}
		return clist;
	},
	borderinside : function(x1,y1,x2,y2){
		var idlist = [];
		for(var by=y1;by<=y2;by++){ for(var bx=x1;bx<=x2;bx++){
			if(bx&1===by&1){ continue;}
			var id = bd.bnum(bx,by);
			if(id!==-1){ idlist.push(id);}
		}}
		return idlist;
	},
	excellinside : function(x1,y1,x2,y2){
		var exlist = [];
		for(var cy=y1;cy<=y2;cy++){ for(var cx=x1;cx<=x2;cx++){
			var c = bd.exnum(cx,cy);
			if(c!==-1){ exlist.push(c);}
		}}
		return exlist;
	},

	cellinside_cond : function(x1,y1,x2,y2,func){
		var clist = [];
		for(var cy=y1;cy<=y2;cy++){ for(var cx=x1;cx<=x2;cx++){
			var c = bd.cnum(cx,cy);
			if(c!==-1 && func(c)){ clist.push(c);}
		}}
		return clist;
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
	// pc.inputPath()  ���X�g����g.lineTo()���̊֐����Ăяo��
	//---------------------------------------------------------------------------
	inputPath : function(parray, isClose){
		g.beginPath();
		g.moveTo(mf(parray[0]+parray[2]), mf(parray[1]+parray[3]));
		for(var i=4;i<parray.length;i+=2){ g.lineTo(mf(parray[0]+parray[i+0]), mf(parray[1]+parray[i+1]));}
		if(isClose){ g.closePath();}
	},

	//---------------------------------------------------------------------------
	// pc.drawBWCells()    Cell�́��Ɣw�i�F/�E��Canvas�ɏ�������
	// pc.setCellColor()   drawBWCells�ŕ`�悷��F��ݒ肷��
	// pc.drawBGCells()    [Cell��Qsub or Error or �A�C�X�o�[��]�̔w�i�F��Canvas�ɏ�������
	// pc.drawBGCellColor()�w�i�F��ݒ肷��
	// pc.drawDotCells()  �E������Canvas�ɏ�������
	// pc.drawBCells()     Cell�̍��}�X�{���}�X��̐�����Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawBWCells : function(x1,y1,x2,y2){
		var dsize = k.cwidth*0.06; dsize=(dsize>2?dsize:2);
		var headers = ["c_full_", "c_dot_"];

		var clist = this.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			this.vhide([headers[0]+c, headers[1]+c]);

			var m = this.setCellColor(c);
			if(g.fillStyle!=="white" && this.vnop(headers[0]+c,1)){
				g.fillRect(bd.cell[c].px+!m, bd.cell[c].py+!m, k.cwidth+(m?1:-1), k.cheight+(m?1:-1));
			}

			// ���̉��́E�\����
			if(this.bcolor!=="white" || bd.cell[c].qsub!==1){ continue;}
			g.fillStyle = this.dotcolor;
			if(this.vnop(headers[1]+c,1)){
				g.beginPath();
				g.arc(bd.cell[c].px+k.cwidth/2, bd.cell[c].py+k.cheight/2, dsize, 0, Math.PI*2, false);
				g.fill();
			}
		}
		this.vinc();
	},
	setCellColor : function(cc){
		var _b = bd.isBlack(cc), err = bd.cell[cc].error;

		if     ( _b && err===0){ g.fillStyle = this.Cellcolor; return true;}
		else if( _b && err===1){ g.fillStyle = this.errcolor1; return true;}
		else if( _b && err===2){ g.fillStyle = this.errcolor2; return true;}
		else if( _b && err===3){ g.fillStyle = this.errcolor3; return true;}
		else if(!_b && err===1){ g.fillStyle = this.errbcolor1; return false;}
		else if(!_b && err===2){ g.fillStyle = this.errbcolor2; return false;}
		else if(bd.cell[cc].qsub===1){ g.fillStyle = this.bcolor;     return false;}
		g.fillStyle = "white"; return false;
	},

	drawBGCells : function(x1,y1,x2,y2){
		var header = "c_full_";

		var clist = this.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(!this.setBGCellColor(c)){ this.vhide(header+c); continue;}

			if(this.vnop(header+c,1)){
				g.fillRect(bd.cell[c].px+1, bd.cell[c].py+1, k.cwidth-1, k.cheight-1);
			}
		}
		this.vinc();
	},
	setBGCellColorFunc : function(type){
		switch(type){
		case 'error2':
			this.setBGCellColor = function(c){
				if     (bd.cell[c].error===1){ g.fillStyle = this.errbcolor1; return true;}
				else if(bd.cell[c].error===2){ g.fillStyle = this.errbcolor2; return true;}
				return false;
			}
			break;
		case 'qsub2':
			this.setBGCellColor = function(c){
				if     (bd.cell[c].error===1){ g.fillStyle = this.errbcolor1; return true;}
				else if(bd.cell[c].qsub ===1){ g.fillStyle = this.qsubcolor1; return true;}
				else if(bd.cell[c].qsub ===2){ g.fillStyle = this.qsubcolor2; return true;}
				return false;
			};
			break;
		case 'qsub3':
			this.setBGCellColor = function(c){
				if     (bd.cell[c].error===1){ g.fillStyle = this.errbcolor1; return true;}
				else if(bd.cell[c].qsub ===1){ g.fillStyle = this.qsubcolor1; return true;}
				else if(bd.cell[c].qsub ===2){ g.fillStyle = this.qsubcolor2; return true;}
				else if(bd.cell[c].qsub ===3){ g.fillStyle = this.qsubcolor3; return true;}
				return false;
			};
			break;
		case 'icebarn':
			this.setBGCellColor = function(c){
				if     (bd.cell[c].error===1){ g.fillStyle = this.errbcolor1; return true;}
				else if(bd.cell[c].ques ===6){ g.fillStyle = this.icecolor;   return true;}
				return false;
			};
			break;
		default:
			this.setBGCellColor = function(c){
				if(bd.cell[c].error===1){ g.fillStyle = this.errbcolor1; return true;}
				return false;
			}
			break;
		}
	},
	setBGCellColor : function(c){
		if(bd.cell[c].error===1){ g.fillStyle = this.errbcolor1; return true;}
		return false;
	},

	drawBCells : function(x1,y1,x2,y2){
		var header = "c_full_";

		var clist = this.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.cell[c].qnum!==-1){
				g.fillStyle = (bd.cell[c].error===1 ? this.errcolor1 : this.Cellcolor);
				if(this.vnop(header+c,1)){
					g.fillRect(bd.cell[c].px, bd.cell[c].py, k.cwidth+1, k.cheight+1);
				}
			}
			else if(bd.cell[c].error===0 && !(k.puzzleid==="lightup" && ans.isShined && ans.isShined(c))){ this.vhide(header+c);}
			this.dispnumCell(c);
		}
		this.vinc();
	},

	drawDotCells : function(x1,y1,x2,y2){
		var ksize = k.cwidth*0.15;
		var header = "c_dot_";

		var clist = this.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.cell[c].qsub===1){
				g.fillStyle = this.dotcolor;
				if(this.vnop(header+c,1)){
					g.fillRect(bd.cell[c].px+mf(k.cwidth/2)-mf(ksize/2), bd.cell[c].py+mf(k.cheight/2)-mf(ksize/2), ksize, ksize);
				}
			}
			else{ this.vhide(header+c);}
		}
		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.drawNumbers()      Cell�̐�����Canvas�ɏ�������
	// pc.drawArrowNumbers() Cell�̐����Ɩ���Canvas�ɏ�������
	// pc.drawQuesHatenas()  ques===-2�̎��ɁH��Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawNumbers : function(x1,y1,x2,y2){
		var clist = this.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){ this.dispnumCell(clist[i]);}
		this.vinc();
	},
	drawArrowNumbers : function(x1,y1,x2,y2){
		var headers = ["c_ar1_", "c_dt1_", "c_dt2_", "c_ar3_", "c_dt3_", "c_dt4_"];
		var ll = mf(k.cwidth*0.7);							//LineLength
		var ls = mf((k.cwidth-ll)/2);						//LineStart
		var lw = (mf(k.cwidth/24)>=1?mf(k.cwidth/24):1);	//LineWidth
		var lm = mf((lw-1)/2);								//LineMargin

		var clist = this.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];

			if     (bd.cell[c].qans ===1){ g.fillStyle = this.BCell_fontcolor;}
			else if(bd.cell[c].error===1){ g.fillStyle = this.fontErrcolor;}
			else                         { g.fillStyle = this.fontcolor;}

			var dir = bd.cell[c].direc;
			if(bd.cell[c].qnum!==-1 && (bd.cell[c].qnum!==-2||k.isDispHatena) && dir!=0){
				var px=bd.cell[c].px, py=bd.cell[c].py;

				if(dir===k.UP||dir===k.DN){
					px+=(k.cwidth-mf(ls*1.5)-lm); py+=(ls+1);
					if(this.vnop(headers[0]+c,1)){ g.fillRect(px, py, lw, ll);}
					px+=mf(lw/2);

					if(dir===k.UP){
						if(this.vnop(headers[1]+c,1)){
							this.inputPath([px,py     ,0,0 ,-ll/6, ll/3 ,ll/6, ll/3], true);
							g.fill();
						}
					}
					else{ this.vhide(headers[1]+c);}
					if(dir===k.DN){
						if(this.vnop(headers[2]+c,1)){
							this.inputPath([px,py+ll  ,0,0 ,-ll/6,-ll/3 ,ll/6,-ll/3], true);
							g.fill();
						}
					}
					else{ this.vhide(headers[2]+c);}
				}
				else{ this.vhide([headers[0]+c, headers[1]+c, headers[2]+c]);}

				if(dir===k.LT||dir===k.RT){
					px+=(ls+1); py+=(mf(ls*1.5)-lm);
					if(this.vnop(headers[3]+c,1)){ g.fillRect(px, py, ll, lw);}
					py+=mf(lw/2);

					if(dir===k.LT){
						if(this.vnop(headers[4]+c,1)){
							this.inputPath([px   ,py  ,0,0 , ll/3,-ll/6 , ll/3,ll/6], true);
							g.fill();
						}
					}
					else{ this.vhide(headers[4]+c);}
					if(dir===k.RT){
						if(this.vnop(headers[5]+c,1)){
							this.inputPath([px+ll,py  ,0,0 ,-ll/3,-ll/6 ,-ll/3,ll/6], true);
							g.fill();
						}
					}
					else{ this.vhide(headers[5]+c);}
				}
				else{ this.vhide([headers[3]+c, headers[4]+c, headers[5]+c]);}
			}
			else{ this.vhide([headers[0]+c, headers[1]+c, headers[2]+c, headers[3]+c, headers[4]+c, headers[5]+c]);}

			this.dispnumCell(c);
		}
		this.vinc();
	},
	drawQuesHatenas : function(x1,y1,x2,y2){
		var clist = this.cellinside(x1,y1,x2,y2);
		for(var id=0;id<clist.length;id++){
			var obj = bd.cell[id];
			if(bd.cell[id].ques!==-2){ this.hideEL(obj.numobj); continue;}
			if(!obj.numobj){ obj.numobj = ee.CreateDOMAndSetNop();}
			var color = (bd.cell[id].error===1 ? this.fontErrcolor : this.fontcolor);
			this.dispnum(obj.numobj, 1, "?", 0.8, color, obj.px, obj.py);
		}
		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.drawCrosses()    Cross�̊ې�����Canvas�ɏ�������
	// pc.drawCrossMarks() Cross��̍��_��Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawCrosses : function(x1,y1,x2,y2){
		var csize = mf(k.cwidth*this.crosssize+1);
		var headers = ["x_cp1_", "x_cp2_"];
		g.lineWidth = 1;

		var clist = this.crossinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.cross[c].qnum!==-1){
				g.fillStyle = (bd.cross[c].error===1 ? this.errcolor1 : "white");
				if(this.vnop(headers[0]+c,1)){
					g.beginPath();
					g.arc(bd.cross[c].px, bd.cross[c].py, csize, 0, Math.PI*2, false);
					g.fill();
				}

				g.strokeStyle = "black";
				if(this.vnop(headers[1]+c,0)){
					if(k.br.IE){
						g.beginPath();
						g.arc(bd.cross[c].px, bd.cross[c].py, csize, 0, Math.PI*2, false);
					}
					g.stroke();
				}
			}
			else{ this.vhide([headers[0]+c, headers[1]+c]);}
			this.dispnumCross(c);
		}
		this.vinc();
	},
	drawCrossMarks : function(x1,y1,x2,y2){
		var csize = k.cwidth*this.crosssize;
		var header = "x_cm_";

		var clist = this.crossinside(x1-1,y1-1,x2+1,y2+1);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.cross[c].qnum===1){
				g.fillStyle = (bd.cross[c].error===1 ? this.errcolor1 : this.Cellcolor);
				if(this.vnop(header+c,1)){
					g.beginPath();
					g.arc(bd.cross[c].px, bd.cross[c].py, csize, 0, Math.PI*2, false);
					g.fill();
				}
			}
			else{ this.vhide(header+c);}
		}
		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.drawBorders()     ���E����Canvas�ɏ�������
	// pc.drawIceBorders()  �A�C�X�o�[���̋��E����Canvas�ɏ�������
	// pc.drawBorder1()     id���w�肵��1�J���̋��E����Canvas�ɏ�������
	// pc.drawBorder1x()    x,y���w�肵��1�J���̋��E����Canvas�ɏ�������
	// pc.drawBorderQsubs() ���E���p�̕⏕�L����Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawBorders : function(x1,y1,x2,y2){
		var idlist = this.borderinside(x1*2-2,y1*2-2,x2*2+2,y2*2+2);
		for(var i=0;i<idlist.length;i++){ this.drawBorder1(idlist[i], bd.isBorder(idlist[i]));}
		this.vinc();
	},
	drawIceBorders : function(x1,y1,x2,y2){
		g.fillStyle = pc.Cellcolor;
		var idlist = this.borderinside(x1*2-2,y1*2-2,x2*2+2,y2*2+2);
		for(var i=0;i<idlist.length;i++){
			var id = idlist[i], cc1 = bd.cc1(id), cc2 = bd.cc2(id);
			this.drawBorder1x(bd.border[id].cx,bd.border[id].cy,(cc1!==-1&&cc2!==-1&&(bd.cell[cc1].ques===6^bd.cell[cc2].ques===6)));
		}
		this.vinc();
	},
	drawBorder1 : function(id, flag){
		if(bd.border[id].qans!==1){ g.fillStyle = this.BorderQuescolor;}
		else{
			if(k.isborderAsLine===1){ g.fillStyle = this.getLineColor(id);}
			else{
				if     (bd.border[id].error===1){ g.fillStyle = this.errcolor1;          }
				else if(bd.border[id].error===2){ g.fillStyle = this.errBorderQanscolor2;}
				else                            { g.fillStyle = this.BorderQanscolor;    }
			}
		}
		this.drawBorder1x(bd.border[id].cx,bd.border[id].cy,flag);
	},
	drawBorder1x : function(bx,by,flag){
		var vid = ["b_bd", bx, by].join("_");
		if(!flag){ this.vhide(vid); return;}

		if(this.vnop(vid,1)){
			var lw = this.lw + this.addlw, lm = this.lm;

			if     (by&1){ g.fillRect(k.p0.x+mf(bx*k.cwidth/2)-lm, k.p0.x+mf((by-1)*k.cheight/2)-lm, lw, k.cheight+lw);}
			else if(bx&1){ g.fillRect(k.p0.x+mf((bx-1)*k.cwidth/2)-lm, k.p0.x+mf(by*k.cheight/2)-lm, k.cwidth+lw,  lw);}
		}
	},

	drawBorderQsubs : function(x1,y1,x2,y2){
		var m = mf(k.cwidth*0.15); //Margin
		var header = "b_qsub1_";
		g.fillStyle = this.BorderQsubcolor;

		var idlist = this.borderinside(x1*2-2,y1*2-2,x2*2+2,y2*2+2);
		for(var i=0;i<idlist.length;i++){
			var id = idlist[i];
			if(bd.border[id].qsub===1){
				if(this.vnop(header+id,1)){
					if     (bd.border[id].cx&1){ g.fillRect(bd.border[id].px, bd.border[id].py-mf(k.cheight/2)+m, 1,k.cheight-2*m);}
					else if(bd.border[id].cy&1){ g.fillRect(bd.border[id].px-mf(k.cwidth/2)+m,  bd.border[id].py, k.cwidth-2*m, 1);}
				}
			}
			else{ this.vhide(header+id);}
		}
		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.drawBoxBorders() ���E���ƍ��}�X�̊Ԃ̐���`�悷��
	//---------------------------------------------------------------------------
	// �O�g���Ȃ��ꍇ�͍l�����Ă��܂���
	drawBoxBorders  : function(x1,y1,x2,y2,tileflag){
		var lw = this.lw, lm = this.lm+1;
		var cw = k.cwidth;
		var ch = k.cheight;

		g.fillStyle = this.BBcolor;

		var clist = this.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.cell[c].qans!=1){ for(var n=1;n<=12;n++){ this.vhide("c_bb"+n+"_"+c);} continue;}

			var bx = 2*bd.cell[c].cx+1, by = 2*bd.cell[c].cy+1;
			var px = bd.cell[c].px, py = bd.cell[c].py;

			var isUP = ((bd.QuB(bd.ub(c))!==1) && !(!k.isoutsideborder&&by<=1));
			var isLT = ((bd.QuB(bd.lb(c))!==1) && !(!k.isoutsideborder&&bx<=1));
			var isRT = ((bd.QuB(bd.rb(c))!==1) && !(!k.isoutsideborder&&bx>=2*k.qcols-1));
			var isDN = ((bd.QuB(bd.db(c))!==1) && !(!k.isoutsideborder&&by>=2*k.qrows-1));

			var isUL = (bd.QuB(bd.bnum(bx-2,by-1))!==1 && bd.QuB(bd.bnum(bx-1,by-2))!==1);
			var isUR = (bd.QuB(bd.bnum(bx+2,by-1))!==1 && bd.QuB(bd.bnum(bx+1,by-2))!==1);
			var isDL = (bd.QuB(bd.bnum(bx-2,by+1))!==1 && bd.QuB(bd.bnum(bx-1,by+2))!==1);
			var isDR = (bd.QuB(bd.bnum(bx+2,by+1))!==1 && bd.QuB(bd.bnum(bx+1,by+2))!==1);

			if(!isLT){ if(this.vnop("c_bb1_"+c,1)){ g.fillRect(px   +lm, py   +lm, 1    ,ch-lw);} }else{ this.vhide("c_bb1_"+c);}
			if(!isRT){ if(this.vnop("c_bb2_"+c,1)){ g.fillRect(px+cw-lm, py   +lm, 1    ,ch-lw);} }else{ this.vhide("c_bb2_"+c);}
			if(!isUP){ if(this.vnop("c_bb3_"+c,1)){ g.fillRect(px   +lm, py   +lm, cw-lw,1    );} }else{ this.vhide("c_bb3_"+c);}
			if(!isDN){ if(this.vnop("c_bb4_"+c,1)){ g.fillRect(px   +lm, py+ch-lm, cw-lw,1    );} }else{ this.vhide("c_bb4_"+c);}

			if(tileflag){
				if(isLT&&!(isUL&&isUP)){ if(this.vnop("c_bb5_"+c,1)){ g.fillRect(px   -lm, py   +lm, lw+1,1   );} }else{ this.vhide("c_bb5_"+c);}
				if(isLT&&!(isDL&&isDN)){ if(this.vnop("c_bb6_"+c,1)){ g.fillRect(px   -lm, py+ch-lm, lw+1,1   );} }else{ this.vhide("c_bb6_"+c);}
				if(isUP&&!(isUL&&isLT)){ if(this.vnop("c_bb7_"+c,1)){ g.fillRect(px   +lm, py   -lm, 1   ,lw+1);} }else{ this.vhide("c_bb7_"+c);}
				if(isUP&&!(isUR&&isRT)){ if(this.vnop("c_bb8_"+c,1)){ g.fillRect(px+cw-lm, py   -lm, 1   ,lw+1);} }else{ this.vhide("c_bb8_"+c);}
			}
			else{
				if(isLT&&!(isUL&&isUP)){ if(this.vnop("c_bb5_" +c,1)){ g.fillRect(px      , py   +lm, lm+1,1   );} }else{ this.vhide("c_bb5_" +c); }
				if(isLT&&!(isDL&&isDN)){ if(this.vnop("c_bb6_" +c,1)){ g.fillRect(px      , py+ch-lm, lm+1,1   );} }else{ this.vhide("c_bb6_" +c); }
				if(isUP&&!(isUL&&isLT)){ if(this.vnop("c_bb7_" +c,1)){ g.fillRect(px   +lm, py      , 1   ,lm+1);} }else{ this.vhide("c_bb7_" +c); }
				if(isUP&&!(isUR&&isRT)){ if(this.vnop("c_bb8_" +c,1)){ g.fillRect(px+cw-lm, py      , 1   ,lm+1);} }else{ this.vhide("c_bb8_" +c); }
				if(isRT&&!(isUR&&isUP)){ if(this.vnop("c_bb9_" +c,1)){ g.fillRect(px+cw-lm, py   +lm, lm+1,1   );} }else{ this.vhide("c_bb9_" +c); }
				if(isRT&&!(isDR&&isDN)){ if(this.vnop("c_bb10_"+c,1)){ g.fillRect(px+cw-lm, py+ch-lm, lm+1,1   );} }else{ this.vhide("c_bb10_"+c);}
				if(isDN&&!(isDL&&isLT)){ if(this.vnop("c_bb11_"+c,1)){ g.fillRect(px   +lm, py+ch-lm, 1   ,lm+1);} }else{ this.vhide("c_bb11_"+c);}
				if(isDN&&!(isDR&&isRT)){ if(this.vnop("c_bb12_"+c,1)){ g.fillRect(px+cw-lm, py+ch-lm, 1   ,lm+1);} }else{ this.vhide("c_bb12_"+c);}
			}
		}
		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.drawLines()    �񓚂̐���Canvas�ɏ�������
	// pc.drawLine1()    �񓚂̐���Canvas�ɏ�������(1�J���̂�)
	// pc.getLineColor() �`�悷����̐F��ݒ肷��
	// pc.drawPekes()    ���E����́~��Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawLines : function(x1,y1,x2,y2){
		var idlist = this.borderinside(x1*2-2,y1*2-2,x2*2+2,y2*2+2);
		for(var i=0;i<idlist.length;i++){ this.drawLine1(idlist[i], bd.isLine(idlist[i]));}
		this.vinc();
	},
	drawLine1 : function(id, flag){
		var vid = "b_line_"+id;
		if(!flag){ this.vhide(vid); return;}

		g.fillStyle = this.getLineColor(id);
		if(this.vnop(vid,1)){
			var lw = this.lw + this.addlw, lm = this.lm;
			if     (bd.border[id].cx&1){ g.fillRect(bd.border[id].px-lm, bd.border[id].py-mf(k.cheight/2)-lm, lw, k.cheight+lw);}
			else if(bd.border[id].cy&1){ g.fillRect(bd.border[id].px-mf(k.cwidth/2)-lm,  bd.border[id].py-lm, k.cwidth+lw,  lw);}
		}
	},
	getLineColor : function(id){
		this.addlw = 0;
		if     (bd.border[id].error===1){ this.addlw=1; return this.errlinecolor1;}
		else if(bd.border[id].error===2){ return this.errlinecolor2;}
		else if(k.irowake===0 || !menu.getVal('irowake') || !bd.border[id].color){ return this.linecolor;}
		return bd.border[id].color;
	},
	drawPekes : function(x1,y1,x2,y2,flag){
		var size = mf(k.cwidth*0.15); if(size<3){ size=3;}
		var headers = ["b_peke0_", "b_peke1_"];
		g.strokeStyle = this.pekecolor;
		g.lineWidth = 1;

		var idlist = this.borderinside(x1*2-2,y1*2-2,x2*2+2,y2*2+2);
		for(var i=0;i<idlist.length;i++){
			var id = idlist[i];
			if(bd.border[id].qsub!==2){ this.vhide([headers[0]+id, headers[1]+id]); continue;}

			g.fillStyle = "white";
			if(flag===0 || flag===2){
				if(this.vnop(headers[0]+id,1)){
					g.fillRect(bd.border[id].px-size, bd.border[id].py-size, 2*size+1, 2*size+1);
				}
			}
			else{ this.vhide(headers[0]+id);}

			if(flag===0 || flag===1){
				if(this.vnop(headers[1]+id,0)){
					this.inputPath([bd.border[id].px,bd.border[id].py ,-size+1,-size+1 ,0,0 ,-size+1,size ,size,-size+1 ,0,0 ,size,size ,-size+1,-size+1],false);
					g.stroke();
				}
			}
			else{ this.vhide(headers[1]+id);}
		}
		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.drawTriangle()   �O�p�`��Canvas�ɏ�������
	// pc.drawTriangle1()  �O�p�`��Canvas�ɏ�������(1�}�X�̂�)
	//---------------------------------------------------------------------------
	drawTriangle : function(x1,y1,x2,y2){
		var headers = ["c_tri2_", "c_tri3_", "c_tri4_", "c_tri5_"];

		var clist = this.cellinside(x1,y1,x2,y2);
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

				var cx=bd.cell[c].cx, cy=bd.cell[c].cy;
				this.drawTriangle1(bd.cell[c].px,bd.cell[c].py,num,headers[num-2]+c);
			}
		}
		this.vinc();
	},
	drawTriangle1 : function(px,py,num,vid){
		if(this.vnop(vid,1)){
			var mgn = (k.puzzleid==="reflect"?1:0);
			switch(num){
				case 2: this.inputPath([px,py ,mgn,mgn        ,mgn,k.cheight+1 ,k.cwidth+1,k.cheight+1],true); break;
				case 3: this.inputPath([px,py ,k.cwidth+1,mgn ,mgn,k.cheight+1 ,k.cwidth+1,k.cheight+1],true); break;
				case 4: this.inputPath([px,py ,mgn,mgn        ,k.cwidth+1,mgn  ,k.cwidth+1,k.cheight+1],true); break;
				case 5: this.inputPath([px,py ,mgn,mgn        ,k.cwidth+1,mgn  ,mgn       ,k.cheight+1],true); break;
			}
			g.fill();
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawMBs()    Cell��́�,�~��Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawMBs : function(x1,y1,x2,y2){
		g.strokeStyle = this.MBcolor;
		g.lineWidth = 1;

		var rsize = k.cwidth*0.35;
		var headers = ["c_MB1_", "c_MB2a_"];

		var clist = this.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.cell[c].qsub===0){ this.vhide([headers[0]+c, headers[1]+c]); continue;}

			switch(bd.cell[c].qsub){
			case 1:
				if(this.vnop(headers[0]+c,0)){
					g.beginPath();
					g.arc(bd.cell[c].px+mf(k.cwidth/2), bd.cell[c].py+mf(k.cheight/2), rsize, 0, Math.PI*2, false);
					g.stroke();
				}
				this.vhide(headers[1]+c);
				break;
			case 2:
				if(this.vnop(headers[1]+c,0)){
					this.inputPath([bd.cell[c].px+mf(k.cwidth/2),bd.cell[c].py+mf(k.cheight/2) ,-rsize,-rsize ,0,0 ,-rsize,rsize ,rsize,-rsize ,0,0 ,rsize,rsize ,-rsize,-rsize],true);
					g.stroke();
				}
				this.vhide(headers[0]+c);
				break;
			}
		}
		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.drawQueses41_42()    Cell��̍��ۂƔ��ۂ�Canvas�ɏ�������
	// pc.drawCircledNumbers() Cell��̊ې�������������
	//---------------------------------------------------------------------------
	drawQueses41_42 : function(x1,y1,x2,y2){
		var rsize  = mf(k.cwidth*this.circleratio[0]);
		var rsize2 = mf(k.cwidth*this.circleratio[1]);
		var mgnx = mf(k.cwidth/2), mgny = mf(k.cheight/2);
		var headers = ["c_cir41a_", "c_cir41b_"];

		var clist = this.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i], px = bd.cell[c].px+mgnx, py = bd.cell[c].py+mgny;

			if(bd.cell[c].ques===41 || bd.cell[c].ques===42){
				g.fillStyle = (bd.cell[c].error===1 ? this.errcolor1 : this.Cellcolor);
				if(this.vnop(headers[0]+c,1)){
					g.beginPath();
					g.arc(px, py, rsize , 0, Math.PI*2, false);
					g.fill();
				}
			}
			else{ this.vhide(headers[0]+c);}

			if(bd.cell[c].ques===41){
				g.fillStyle = (bd.cell[c].error===1 ? this.errbcolor1 : "white");
				if(this.vnop(headers[1]+c,1)){
					g.beginPath();
					g.arc(px, py, rsize2, 0, Math.PI*2, false);
					g.fill();
				}
			}
			else{ this.vhide(headers[1]+c);}
		}
		this.vinc();
	},
	drawCircledNumbers : function(x1,y1,x2,y2){
		var rsize  = k.cwidth*this.circleratio[0];
		var rsize2 = k.cwidth*this.circleratio[1];
		var mgnx = mf(k.cwidth/2), mgny = mf(k.cheight/2);
		var headers = ["c_cira_", "c_cirb_"];

		g.lineWidth = k.cwidth*0.05;
		var clist = this.cellinside(x1-2,y1-2,x2+2,y2+2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.cell[c].qnum!=-1){
				var px=bd.cell[c].px+mgnx, py=bd.cell[c].py+mgny;

				g.fillStyle = (bd.cell[c].error===1 ? this.errbcolor1 : this.circledcolor);
				if(this.vnop(headers[1]+c,1)){
					g.beginPath();
					g.arc(px, py, rsize2, 0, Math.PI*2, false);
					g.fill();
				}

				g.strokeStyle = (bd.cell[c].error===1 ? this.errcolor1 : this.Cellcolor);
				if(this.vnop(headers[0]+c,0)){
					g.beginPath();
					g.arc(px, py, rsize , 0, Math.PI*2, false);
					g.stroke();
				}
			}
			else{ this.vhide([headers[0]+c, headers[1]+c]);}

			this.dispnumCell(c);
		}
		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.drawLineParts()   ���Ȃǂ�Canvas�ɏ�������
	// pc.drawLineParts1()  ���Ȃǂ�Canvas�ɏ�������(1�}�X�̂�)
	//---------------------------------------------------------------------------
	drawLineParts : function(x1,y1,x2,y2){
		var clist = this.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){ this.drawLineParts1(clist[i]);}
		this.vinc();
	},
	drawLineParts1 : function(id){
		var vids = ["c_lp1_"+id, "c_lp2_"+id, "c_lp3_"+id, "c_lp4_"+id];
		if(qs<101 || qs>107){ this.vhide(vids); return;}

		var hh = mf(k.cheight/2), hw = mf(k.cwidth/2);
		var hhp = mf((this.lw+k.cheight)/2), hwp = mf((this.lw+k.cwidth)/2);
		var px = bd.cell[id].px, py = bd.cell[id].py;
		g.fillStyle = this.BorderQuescolor;

		var qs = bd.cell[id].ques, flag  = {101:15, 102:3, 103:12, 104:9, 105:5, 106:6, 107:10}[qs];
		if(flag&1){ if(this.vnop(vids[0],1)){ g.fillRect(px+hw-1, py     , this.lw, hhp);} }else{ this.vhide(vids[0]);}
		if(flag&2){ if(this.vnop(vids[1],1)){ g.fillRect(px+hw-1, py+hh-1, this.lw, hhp);} }else{ this.vhide(vids[1]);}
		if(flag&4){ if(this.vnop(vids[2],1)){ g.fillRect(px     , py+hh-1, hwp, this.lw);} }else{ this.vhide(vids[2]);}
		if(flag&8){ if(this.vnop(vids[3],1)){ g.fillRect(px+hw-1, py+hh-1, hwp, this.lw);} }else{ this.vhide(vids[3]);}
	},

	//---------------------------------------------------------------------------
	// pc.draw51()          [�_]��Canvas�ɏ�������
	// pc.draw51EXcell()    EXCell���[�_]��Canvas�ɏ�������
	// pc.drawChassis_ex1() k.isextencdell==1�ő�����O�g��Canvas�ɕ`�悷��
	//---------------------------------------------------------------------------
	draw51 : function(x1,y1,x2,y2,errdisp){
		var headers = ["c_full_", "c_q51_"];

		var clist = this.cellinside(x1,y1,x2,y2);
		for(var i=0;i<clist.length;i++){
			var c = clist[i];
			if(bd.cell[c].ques===51){
				if(errdisp){
					if(bd.cell[c].error===1){
						g.fillStyle = this.errbcolor1;
						if(this.vnop(headers[0]+c,1)){
							g.fillRect(bd.cell[c].px+1, bd.cell[c].py+1, k.cwidth-1, k.cheight-1);
						}
					}
					else{ this.vhide(headers[0]+c);}
				}
				g.strokeStyle = this.Cellcolor;
				if(this.vnop(headers[1]+c,0)){
					g.lineWidth = 1;
					this.inputPath([bd.cell[c].px,bd.cell[c].py, 1,1, k.cwidth,k.cheight], true);
					g.stroke();
				}
			}
			else{
				if(bd.cell[c].qsub===0 && bd.cell[c].error===0){ this.vhide(headers[0]+c);}
				this.vhide(headers[1]+c);
			}
		}
		this.vinc();
	},
	draw51EXcells : function(x1,y1,x2,y2,errdisp){
		var lw = this.lw;
		var headers = ["ex_full_", "ex_q51_", "ex_bdx_", "ex_bdy_"];

		var exlist = this.excellinside(x1-1,y1-1,x2,y2);
		for(var i=0;i<exlist.length;i++){
			var c = exlist[i];

			var px = bd.excell[c].px, py = bd.excell[c].py;
			if(errdisp){
				if(bd.excell[c].error===1){
					g.fillStyle = this.errbcolor1;
					if(this.vnop(headers[0]+c,1)){
						g.fillRect(px+1, py+1, k.cwidth-1, k.cheight-1);
					}
				}
				else{ this.vhide(headers[0]+c);}
			}

			g.strokeStyle = this.Cellcolor;
			if(this.vnop(headers[1]+c,0)){
				g.lineWidth = 1;
				this.inputPath([px,py, 1,1, k.cwidth,k.cheight], true);
				g.stroke();
			}

			g.fillStyle = this.Cellcolor;
			if(bd.excell[c].cy===-1 && bd.excell[c].cx<k.qcols-1){
				if(this.vnop(headers[2]+c,1)){
					g.fillRect(px+k.cwidth, py, 1, k.cheight);
				}
			}
			else{ this.vhide(headers[2]+c);}
			if(bd.excell[c].cx===-1 && bd.excell[c].cy<k.qrows-1){
				if(this.vnop(headers[3]+c,1)){
					g.fillRect(px, py+k.cheight, k.cwidth, 1);
				}
			}
			else{ this.vhide(headers[3]+c);}
		}
		this.vinc();
	},

	drawChassis_ex1 : function(x1,y1,x2,y2,boldflag){
		var lw = this.lw, lm = this.lm;

		if(x1<0){ x1=0;} if(x2>k.qcols-1){ x2=k.qcols-1;}
		if(y1<0){ y1=0;} if(y2>k.qrows-1){ y2=k.qrows-1;}

		g.fillStyle = "black";
		if(boldflag){
			if(x1<1){ if(this.vnop("chs1_",1)){ g.fillRect(k.p0.x+x1*k.cwidth-lw+2, k.p0.y+y1*k.cheight-lw+2, lw, (y2-y1+1)*k.cheight+lw-2);} }
			if(y1<1){ if(this.vnop("chs2_",1)){ g.fillRect(k.p0.x+x1*k.cwidth-lw+2, k.p0.y+y1*k.cheight-lw+2, (x2-x1+1)*k.cwidth+lw-2, lw); } }
		}
		else{
			if(x1<1){ if(this.vnop("chs1_",1)){ g.fillRect(k.p0.x+x1*k.cwidth, k.p0.y+y1*k.cheight, 1, (y2-y1+1)*k.cheight);} }
			if(y1<1){ if(this.vnop("chs2_",1)){ g.fillRect(k.p0.x+x1*k.cwidth, k.p0.y+y1*k.cheight, (x2-x1+1)*k.cwidth, 1); } }
		}
		if(y2>=k.qrows-1){ if(this.vnop("chs3_",1)){ g.fillRect(k.p0.x+(x1-1)*k.cwidth-lw+1, k.p0.y+(y2+1)*k.cheight , (x2-x1+2)*k.cwidth+2*lw-1, lw); } }
		if(x2>=k.qcols-1){ if(this.vnop("chs4_",1)){ g.fillRect(k.p0.x+(x2+1)*k.cwidth , k.p0.y+(y1-1)*k.cheight-lw+1, lw, (y2-y1+2)*k.cheight+2*lw-1);} }
		if(x1<1)         { if(this.vnop("chs21_",1)){ g.fillRect(k.p0.x+(x1-1)*k.cwidth-lw+1, k.p0.y+(y1-1)*k.cheight-lw+1, lw, (y2-y1+2)*k.cheight+2*lw-1);} }
		if(y1<1)         { if(this.vnop("chs22_",1)){ g.fillRect(k.p0.x+(x1-1)*k.cwidth-lw+1, k.p0.y+(y1-1)*k.cheight-lw+1, (x2-x1+2)*k.cwidth+2*lw-1, lw); } }
		this.vinc();

		if(!boldflag){
			g.fillStyle = this.Cellcolor;
			var clist = this.cellinside(x1-1,y1-1,x2+1,y2+1);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.cell[c].ques===51){ continue;}
				if(bd.cell[c].cx===0){ this.drawBorder1x(0, 2*bd.cell[c].cy+1, true);}
				if(bd.cell[c].cy===0){ this.drawBorder1x(2*bd.cell[c].cx+1, 0, true);}
			}
			this.vinc();
		}
	},

	//---------------------------------------------------------------------------
	// pc.drawTarget()  ���͑ΏۂƂȂ�ꏊ��`�悷��
	// pc.drawTCell()   Cell�̃L�[�{�[�h����̓��͑Ώۂ�Canvas�ɏ�������
	// pc.drawTCross()  Cross�̃L�[�{�[�h����̓��͑Ώۂ�Canvas�ɏ�������
	// pc.drawTBorder() Border�̃L�[�{�[�h����̓��͑Ώۂ�Canvas�ɏ�������
	// pc.hideTCell()   �L�[�{�[�h����̓��͑Ώۂ��B��
	// pc.hideTCross()  �L�[�{�[�h����̓��͑Ώۂ��B��
	// pc.hideTBorder() �L�[�{�[�h����̓��͑Ώۂ��B��
	// pc.drawTargetTriangle() [�_]�̂������͑Ώۂ̂ق��ɔw�i�F������
	//---------------------------------------------------------------------------
	drawTarget : function(x1,y1,x2,y2){
		if(k.editmode){ this.drawTCell(x1,y1,x2+1,y2+1);}
		else{ this.hideTCell();}
	},

	drawTCell : function(x1,y1,x2,y2){
		if(tc.cursolx < x1*2 || x2*2+2 < tc.cursolx){ return;}
		if(tc.cursoly < y1*2 || y2*2+2 < tc.cursoly){ return;}

		var px = k.p0.x + mf((tc.cursolx-1)*k.cwidth/2);
		var py = k.p0.y + mf((tc.cursoly-1)*k.cheight/2);
		var w = (k.cwidth<32?2:mf(k.cwidth/16));

		this.vdel(["tc1_","tc2_","tc3_","tc4_"]);
		g.fillStyle = (k.editmode?this.targetColor1:this.targetColor3);
		if(this.vnop("tc1_",0)){ g.fillRect(px+1,           py+1, k.cwidth-2,  w);}
		if(this.vnop("tc2_",0)){ g.fillRect(px+1,           py+1, w, k.cheight-2);}
		if(this.vnop("tc3_",0)){ g.fillRect(px+1, py+k.cheight-w, k.cwidth-2,  w);}
		if(this.vnop("tc4_",0)){ g.fillRect(px+k.cwidth-w,  py+1, w, k.cheight-2);}

		this.vinc();
	},
	drawTCross : function(x1,y1,x2,y2){
		if(tc.cursolx < x1*2-1 || x2*2+3 < tc.cursolx){ return;}
		if(tc.cursoly < y1*2-1 || y2*2+3 < tc.cursoly){ return;}

		var px = k.p0.x + mf((tc.cursolx-1)*k.cwidth/2);
		var py = k.p0.y + mf((tc.cursoly-1)*k.cheight/2);
		var w = (k.cwidth<32?2:mf(k.cwidth/16));

		this.vdel(["tx1_","tx2_","tx3_","tx4_"]);
		g.fillStyle = (k.editmode?this.targetColor1:this.targetColor3);
		if(this.vnop("tx1_",0)){ g.fillRect(px+1,           py+1, k.cwidth-2,  w);}
		if(this.vnop("tx2_",0)){ g.fillRect(px+1,           py+1, w, k.cheight-2);}
		if(this.vnop("tx3_",0)){ g.fillRect(px+1, py+k.cheight-w, k.cwidth-2,  w);}
		if(this.vnop("tx4_",0)){ g.fillRect(px+k.cwidth-w,  py+1, w, k.cheight-2);}

		this.vinc();
	},
	drawTBorder : function(x1,y1,x2,y2){
		if(tc.cursolx < x1*2-1 || x2*2+3 < tc.cursolx){ return;}
		if(tc.cursoly < y1*2-1 || y2*2+3 < tc.cursoly){ return;}

		var px = k.p0.x + mf(tc.cursolx*k.cwidth/2);
		var py = k.p0.y + mf(tc.cursoly*k.cheight/2);
		var w = (k.cwidth<24?1:mf(k.cwidth/24));
		var size = mf(k.cwidth*0.28);

		this.vdel(["tb1_","tb2_","tb3_","tb4_"]);
		g.fillStyle = (k.editmode?this.targetColor1:this.targetColor3);
		if(this.vnop("tb1_",0)){ g.fillRect(px-size  , py-size  , size*2, 1);}
		if(this.vnop("tb2_",0)){ g.fillRect(px-size  , py-size  , 1, size*2);}
		if(this.vnop("tb3_",0)){ g.fillRect(px-size  , py+size-w, size*2, 1);}
		if(this.vnop("tb4_",0)){ g.fillRect(px+size-w, py-size  , 1, size*2);}

		this.vinc();
	},
	hideTCell   : function(){ this.vhide(["tc1_","tc2_","tc3_","tc4_"]);},
	hideTCross  : function(){ this.vhide(["tx1_","tx2_","tx3_","tx4_"]);},
	hideTBorder : function(){ this.vhide(["tb1_","tb2_","tb3_","tb4_"]);},

	drawTargetTriangle : function(x1,y1,x2,y2){
		var vid = "target_triangle";
		this.vdel([vid]);

		if(k.playmode){ return;}

		if(tc.cursolx < x1*2 || x2*2+2 < tc.cursolx){ return;}
		if(tc.cursoly < y1*2 || y2*2+2 < tc.cursoly){ return;}

		var cc = tc.getTCC(), ex = -1;
		if(cc===-1){ ex = bd.exnum(tc.getTCX(),tc.getTCY());}
		var target = kc.detectTarget(cc,ex);
		if(target===-1){ return;}

		g.fillStyle = this.TTcolor;
		this.drawTriangle1(k.p0.x+tc.getTCX()*k.cwidth, k.p0.y+tc.getTCY()*k.cheight, (target===2?4:2), vid);

		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.drawDashLines()    �Z���̒��S���璆�S�ɂЂ����_����Canvas�ɕ`�悷��
	//---------------------------------------------------------------------------
	drawDashLines : (
		((!k.br.IE) ?
			function(x1,y1,x2,y2){
				if(x1<1){ x1=1;} if(x2>k.qcols-2){ x2=k.qcols-2;}
				if(y1<1){ y1=1;} if(y2>k.qrows-2){ y2=k.qrows-2;}

				g.fillStyle = this.gridcolor;
				for(var i=x1-1;i<=x2+1;i++){
					for(var j=(k.p0.y+(y1-0.5)*k.cheight);j<(k.p0.y+(y2+1.5)*k.cheight);j+=6){
						g.fillRect(k.p0.x+(i+0.5)*k.cwidth, j, 1, 3);
					}
				}
				for(var i=y1-1;i<=y2+1;i++){
					for(var j=(k.p0.x+(x1-0.5)*k.cwidth);j<(k.p0.x+(x2+1.5)*k.cwidth);j+=6){
						g.fillRect(j, k.p0.y+(i+0.5)*k.cheight, 3, 1);
					}
				}

				this.vinc();
			}
		:
			function(x1,y1,x2,y2){
				if(x1<1){ x1=1;} if(x2>k.qcols-2){ x2=k.qcols-2;}
				if(y1<1){ y1=1;} if(y2>k.qrows-2){ y2=k.qrows-2;}

/*				g.fillStyle = this.gridcolor;
				g.lineWidth = 1;
				g.enabledash = true;
				for(var i=x1-1;i<=x2+1;i++){ if(this.vnop("bdy"+i+"_",1)){
					g.beginPath()
					g.moveTo(k.p0.x+(i+0.5)*k.cwidth, k.p0.y+(y1-0.5)*k.cheight);
					g.lineTo(k.p0.x+(i+0.5)*k.cwidth, k.p0.y+(y2+1.5)*k.cheight);
					g.closePath()
					g.stroke()
				} }
				for(var i=y1-1;i<=y2+1;i++){ if(this.vnop("bdx"+i+"_",1)){
					g.beginPath()
					g.moveTo(k.p0.x+(x1-0.5)*k.cwidth, k.p0.y+( i+0.5)*k.cheight);
					g.lineTo(k.p0.x+(x2+1.5)*k.cwidth, k.p0.y+( i+0.5)*k.cheight);
					g.closePath()
					g.stroke()
				} }
				g.enabledash = false;

				g.fillStyle = "white";
*/
				g.fillStyle = this.gridcolor_SLIGHT;
				for(var i=x1-1;i<=x2+1;i++){ if(this.vnop("cliney_"+i,1)){ g.fillRect(k.p0.x+(i+0.5)*k.cwidth, k.p0.y+(y1-0.5)*k.cheight, 1, (y2-y1+2)*k.cheight+1);} }
				for(var i=y1-1;i<=y2+1;i++){ if(this.vnop("clinex_"+i,1)){ g.fillRect(k.p0.x+(x1-0.5)*k.cwidth, k.p0.y+(i+0.5)*k.cheight, (x2-x1+2)*k.cwidth+1, 1);} }

				this.vinc();
			}
		)
	),

	//---------------------------------------------------------------------------
	// pc.drawGrid()        �Z���̘g��(����)��Canvas�ɏ�������
	// pc.drawDashedGrid()  �Z���̘g��(�_��)��Canvas�ɏ�������
	// pc.drawChassis()     �O�g��Canvas�ɏ�������
	//---------------------------------------------------------------------------
	drawGrid : function(x1,y1,x2,y2){
		if(x1<0){ x1=0;} if(x2>k.qcols-1){ x2=k.qcols-1;}
		if(y1<0){ y1=0;} if(y2>k.qrows-1){ y2=k.qrows-1;}

		var bs=((k.isoutsideborder===0&&this.chassisflag)?1:0);

		g.fillStyle = this.gridcolor;
		var xa = (x1>bs?x1:bs), xb = (x2+1<k.qcols-bs?x2+1:k.qcols-bs);
		var ya = (y1>bs?y1:bs), yb = (y2+1<k.qrows-bs?y2+1:k.qrows-bs);
		for(var i=xa;i<=xb;i++){ if(this.vnop("bdy_"+i,1)){ g.fillRect(k.p0.x+i*k.cwidth, k.p0.y+y1*k.cheight, 1, (y2-y1+1)*k.cheight+1);} }
		for(var i=ya;i<=yb;i++){ if(this.vnop("bdx_"+i,1)){ g.fillRect(k.p0.x+x1*k.cwidth, k.p0.y+i*k.cheight, (x2-x1+1)*k.cwidth+1, 1);} }

		this.vinc();
	},
	drawDashedGrid : (
		((!k.br.IE) ?
			function(x1,y1,x2,y2){
				if(x1<0){ x1=0;} if(x2>k.qcols-1){ x2=k.qcols-1;}
				if(y1<0){ y1=0;} if(y2>k.qrows-1){ y2=k.qrows-1;}

				var bs=((k.isoutsideborder===0&&this.chassisflag)?1:0);

				var dotmax = mf(k.cwidth/10)+3;
				var dotCount = (mf(k.cwidth/dotmax)>=1?mf(k.cwidth/dotmax):1);
				var dotSize  = k.cwidth/(dotCount*2);

				g.fillStyle = this.gridcolor;
				var xa = (x1>bs?x1:bs), xb = (x2+1<k.qcols-bs?x2+1:k.qcols-bs);
				var ya = (y1>bs?y1:bs), yb = (y2+1<k.qrows-bs?y2+1:k.qrows-bs);
				for(var i=xa;i<=xb;i++){
					for(var j=(k.p0.y+y1*k.cheight);j<(k.p0.y+(y2+1)*k.cheight);j+=(2*dotSize)){
						g.fillRect(k.p0.x+i*k.cwidth, mf(j), 1, mf(dotSize));
					}
				}
				for(var i=ya;i<=yb;i++){
					for(var j=(k.p0.x+x1*k.cwidth);j<(k.p0.x+(x2+1)*k.cwidth);j+=(2*dotSize)){
						g.fillRect(mf(j), k.p0.y+i*k.cheight, mf(dotSize), 1);
					}
				}
			}
		:
			function(x1,y1,x2,y2){
				this.gridcolor = this.gridcolor_SLIGHT;
				this.drawGrid(x1,y1,x2,y2);

/*				if(x1<0){ x1=0;} if(x2>k.qcols-1){ x2=k.qcols-1;}
				if(y1<0){ y1=0;} if(y2>k.qrows-1){ y2=k.qrows-1;}

				var bs=((k.isoutsideborder==0&&this.chassisflag)?1:0);

				g.fillStyle = this.gridcolor;
				var xa = (x1>bs?x1:bs), xb = (x2+1<k.qcols-bs?x2+1:k.qcols-bs);
				var ya = (y1>bs?y1:bs), yb = (y2+1<k.qrows-bs?y2+1:k.qrows-bs);
				g.lineWidth = 1;
				g.enabledash = true;
				for(var i=xa;i<=xb;i++){ if(this.vnop("bdy"+i+"_",0)){
					g.beginPath()
					g.moveTo(mf(k.p0.x+i*k.cwidth+0.0), mf(k.p0.y+ y1   *k.cheight));
					g.lineTo(mf(k.p0.x+i*k.cwidth+0.0), mf(k.p0.y+(y2+1)*k.cheight));
					g.closePath()
					g.stroke()
				} }
				for(var i=ya;i<=yb;i++){ if(this.vnop("bdx"+i+"_",0)){
					g.beginPath()
					g.moveTo(mf(k.p0.x+ x1   *k.cwidth), mf(k.p0.y+i*k.cheight));
					g.lineTo(mf(k.p0.x+(x2+1)*k.cwidth), mf(k.p0.y+i*k.cheight));
					g.closePath()
					g.stroke()
				} }
				g.enabledash = false;

				g.fillStyle = "white";
				for(var i=xa;i<=xb;i++){ if(this.vnop("bdy"+i+"_1_",1)){ g.fillRect(k.p0.x+i*k.cwidth, k.p0.y+y1*k.cheight, 1, (y2-y1+1)*k.cheight+1);} }
				for(var i=ya;i<=yb;i++){ if(this.vnop("bdx"+i+"_1_",1)){ g.fillRect(k.p0.x+x1*k.cwidth, k.p0.y+i*k.cheight, (x2-x1+1)*k.cwidth+1, 1);} }

				this.vinc();
*/			}
		)
	),

	drawChassis : function(x1,y1,x2,y2){
		var lw = this.lw;

		if(x1<0){ x1=0;} if(x2>k.qcols-1){ x2=k.qcols-1;}
		if(y1<0){ y1=0;} if(y2>k.qrows-1){ y2=k.qrows-1;}

		g.fillStyle = "black";
		if(x1<1)         { if(this.vnop("chs1_",1)){ g.fillRect(k.p0.x+x1*k.cwidth-lw+1, k.p0.y+y1*k.cheight-lw+1, lw, (y2-y1+1)*k.cheight+2*lw-1);} }
		if(y1<1)         { if(this.vnop("chs2_",1)){ g.fillRect(k.p0.x+x1*k.cwidth-lw+1, k.p0.y+y1*k.cheight-lw+1, (x2-x1+1)*k.cwidth+2*lw-1, lw); } }
		if(y2>=k.qrows-1){ if(this.vnop("chs3_",1)){ g.fillRect(k.p0.x+x1*k.cwidth-lw+1, k.p0.y+(y2+1)*k.cheight , (x2-x1+1)*k.cwidth+2*lw-1, lw); } }
		if(x2>=k.qcols-1){ if(this.vnop("chs4_",1)){ g.fillRect(k.p0.x+(x2+1)*k.cwidth , k.p0.y+y1*k.cheight-lw+1, lw, (y2-y1+1)*k.cheight+2*lw-1);} }
		this.vinc();
	},

	//---------------------------------------------------------------------------
	// pc.flushCanvas()    �w�肳�ꂽ�̈�𔒂œh��Ԃ�
	// pc.flushCanvasAll() Canvas�S�ʂ𔒂œh��Ԃ�
	//---------------------------------------------------------------------------
	flushCanvas : (
		((!k.vml) ?
			function(x1,y1,x2,y2){
				if     (k.isextendcell===0 && x1<= 0 && y1<= 0 && x2>=k.qcols-1 && y2>=k.qrows-1){ this.flushCanvasAll();}
				else if(k.isextendcell===1 && x1<=-1 && y1<=-1 && x2>=k.qcols-1 && y2>=k.qrows-1){ this.flushCanvasAll();}
				else if(k.isextendcell===2 && x1<=-1 && y1<=-1 && x2>=k.qcols   && y2>=k.qrows  ){ this.flushCanvasAll();}
				else{
					g.fillStyle = "rgb(255, 255, 255)";
					g.fillRect(k.p0.x+x1*k.cwidth, k.p0.y+y1*k.cheight, (x2-x1+1)*k.cwidth, (y2-y1+1)*k.cheight);
				}
			}
		:
			function(x1,y1,x2,y2){ g.zidx=1;}
		)
	),
	// excanvas�̏ꍇ�A�����`�悵�Ȃ���VML�v�f���I������Ă��܂�
	flushCanvasAll : (
		((!k.vml) ?
			((!k.br.IE) ?
				function(){
					g.fillStyle = "rgb(255, 255, 255)";
					g.fillRect(0, 0, menu.getWidth(base.canvas), menu.getHeight(base.canvas));
					this.vinc();
				}
			:
				function(){
					g._clear();	// uuCanvas�p���ꏈ��
					g.fillStyle = "rgb(255, 255, 255)";
					g.fillRect(0, 0, menu.getWidth(base.canvas), menu.getHeight(base.canvas));
					this.vinc();
				}
			)
		:
			function(){
				g.zidx=0; g.vid="bg_"; g.pelements = []; g.elements = [];	// VML�p
				g._clear();													// uuCanvas�p���ꏈ��
				g.fillStyle = "rgb(255, 255, 255)";
				g.fillRect(0, 0, menu.getWidth(base.canvas), menu.getHeight(base.canvas));
				this.vinc();
			}
		)
	),

	//---------------------------------------------------------------------------
	// pc.vnop()  VML�Ŋ��ɕ`�悳��Ă���I�u�W�F�N�g���ĕ`�悹���A�F�͐ݒ肷��
	// pc.vhide() VML�Ŋ��ɕ`�悳��Ă���I�u�W�F�N�g���B��
	// pc.vdel()  VML�Ŋ��ɕ`�悳��Ă���I�u�W�F�N�g���폜����
	// pc.vinc()  z-index�ɐݒ肳���l��+1����
	//  ��IE�ȊO�ł�f_true�ɂȂ��Ă��܂��B
	//---------------------------------------------------------------------------
	// excanvas�֌W�֐�
	vnop : (!k.vml ? f_true : function(vid, isfill){
		if(g.elements[vid]){
			var el = g.elements[vid];
			el.color = uuColor.parse(isfill===1?g.fillStyle:g.strokeStyle)[0];

			var pel = g.pelements[vid];
			if(!this.zstable){ pel.style.zIndex = g.zidx;}
			pel.style.display = 'inline';
			return false;
		}
		g.vid = vid;
		return true;
	}),
	vhide : (!k.vml ? f_true : function(vid){
		if(typeof vid === 'string'){ vid = [vid];}
		for(var i=0;i<vid.length;i++){
			if(g.elements[vid[i]]){
				g.pelements[vid[i]].style.display = 'none';
			}
		}
	}),
	vdel : (!k.vml ? f_true : function(vid){
		for(var i=0;i<vid.length;i++){
			if(g.elements[vid[i]]){
				g._elm.removeChild(g.pelements[vid[i]]);	// uuCanvas��g._elm��parentNode��ێ����Ă�
				g.pelements[vid[i]]=null;
				g.elements[vid[i]] =null;
			}
		}
	}),
	vinc : (!k.vml ? f_true : function(){
		g.vid = ""; g.zidx++;
	}),

	//---------------------------------------------------------------------------
	// pc.showEL()                 �G�������g��\������
	// pc.hideEL()                 �G�������g���B��
	// pc.isdispnumCell()          �������L���ł��邩���肷��
	// pc.getNumberColor()         �����̐F�𔻒肷��
	//---------------------------------------------------------------------------
	// �����\���֐�
	showEL : function(el){ el.style.display = 'inline'; },	// �������Ȃ��Ă��悳�����B
	hideEL : function(el){ if(!!el){ el.style.display = 'none';} },

	setFunctions : function(){
		this.isdispnumCell = (
			((!!k.isDispHatena) ?
				(!!k.dispzero) ? function(id){ var num=bd.getNum(id); return (num>=0 || num===-2);}
							   : function(id){ var num=bd.getNum(id); return (num> 0 || num===-2);}
			:
				(!!k.dispzero) ? function(id){ var num=bd.getNum(id); return (num>=0);}
							   : function(id){ var num=bd.getNum(id); return (num> 0);}
			)
		);
		this.getNumberColor = (
			((!!k.isAnsNumber) ?
				function(id){
					if(bd.ErC(id)===1 || bd.ErC(id)===4){ return this.fontErrcolor;}
					return (bd.QnC(id)!==-1 ? this.fontcolor : this.fontAnscolor);
				}
			:(!!k.BlackCell) ?
				function(id){
					if(bd.QaC(id)===1){ return this.BCell_fontcolor;}
					else if(bd.ErC(id)===1 || bd.ErC(id)===4){ return this.fontErrcolor;}
					return this.fontcolor;
				}
			:
				function(id){
					if(bd.QuC(id)!==0){ return this.BCell_fontcolor;}
					else if(bd.ErC(id)===1 || bd.ErC(id)===4){ return this.fontErrcolor;}
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
		var obj = bd.cell[id];
		if(!this.isdispnumCell(id)){ this.hideEL(obj.numobj); return;}
		if(!obj.numobj){ obj.numobj = ee.CreateDOMAndSetNop();}

		var type = (!k.isDispNumUL ? 1 : 5);
		if(bd.cell[id].ques>=2 && bd.cell[id].ques<=5){ type=bd.cell[id].ques;}

		var num = bd.getNum(id);
		var text = (num>=0 ? ""+num : "?");

		var fontratio = 0.45;
		if(type===1){ fontratio = (num<10?0.8:(num<100?0.7:0.55));}
		if(k.isArrowNumber===1){
			var dir = bd.cell[id].direc;
			if(dir!==0){ fontratio *= 0.85;}
			if     (dir===k.UP||dir===k.DN){ type=6;}
			else if(dir===k.LT||dir===k.RT){ type=7;}
		}

		this.dispnum(obj.numobj, type, text, fontratio, this.getNumberColor(id), obj.px, obj.py);
	},
	dispnumCross : function(id){
		var obj = bd.cross[id];
		if(bd.cross[id].qnum>0||(bd.cross[id].qnum===0&&k.dispzero===1)){
			if(!obj.numobj){ obj.numobj = ee.CreateDOMAndSetNop();}
			this.dispnum(obj.numobj, 101, ""+bd.cross[id].qnum, 0.6 ,this.fontcolor, obj.px, obj.py);
		}
		else{ this.hideEL(obj.numobj);}
	},
	dispnumBorder : function(id){
		var obj = bd.border[id];
		if(bd.border[id].qnum>0||(bd.border[id].qnum===0&&k.dispzero===1)){
			if(!obj.numobj){ obj.numobj = ee.CreateDOMAndSetNop();}
			this.dispnum(obj.numobj, 101, ""+bd.border[id].qnum, 0.45 ,this.borderfontcolor, obj.px, obj.py);
		}
		else{ this.hideEL(obj.numobj);}
	},

	//---------------------------------------------------------------------------
	// pc.dispnum()  �������L�����邽�߂̋��ʊ֐�
	//---------------------------------------------------------------------------
	dispnum : function(el, type, text, fontratio, color, px, py){
//		if(!this.textenable){
			if(!el){ return;}
			var IE = k.br.IE;

			el.innerHTML = text;

			var fontsize = mf(k.cwidth*fontratio*this.fontsizeratio);
			el.style.fontSize = (""+ fontsize + 'px');

			this.showEL(el);	// ��ɕ\�����Ȃ���wid,hgt=0�ɂȂ��Ĉʒu�������

			var wid = el.clientWidth;
			var hgt = el.clientHeight;

			if(type===1||type===6||type===7){
				el.style.left = k.cv_oft.x+px+mf((k.cwidth-wid) /2)+(IE?-1:2)-(type===6?mf(k.cwidth *0.1):0);
				el.style.top  = k.cv_oft.y+py+mf((k.cheight-hgt)/2)+(IE? 1:1)+(type===7?mf(k.cheight*0.1):0);
			}
			else if(type===101){
				el.style.left = k.cv_oft.x+px-wid/2+(IE?1:2);
				el.style.top  = k.cv_oft.y+py-hgt/2+(IE?1:1);
			}
			else{
				if(type==52||type==54){ px--; py++; type-=50;}	// excell��[�_]�Ή�..
				if     (type===3||type===4){ el.style.left = k.cv_oft.x+px+k.cwidth -wid+(IE?-1: 0);}
				else if(type===2||type===5){ el.style.left = k.cv_oft.x+px              +(IE? 3: 4);}
				if     (type===2||type===3){ el.style.top  = k.cv_oft.y+py+k.cheight-hgt+(IE?-1:-1);}
				else if(type===4||type===5){ el.style.top  = k.cv_oft.y+py              +(IE? 2: 2);}
			}

			el.style.color = color;
//		}
//		// Native�ȕ��@�͂������Ȃ񂾂��ǁA�v5�`6%���炢�x���Ȃ�B�B
//		else{
//			g.font = ""+mf(k.cwidth*fontratio*this.fontsizeratio)+"px 'Serif'";
//			g.fillStyle = color;
//			if(type==1||type==6||type==7){
//				g.textAlign = 'center'; g.textBaseline = 'middle';
//				g.fillText(text, px+mf(k.cwidth/2)-(type==6?mf(k.cwidth*0.1):0), py+mf(k.cheight/2)+(type==7?mf(k.cheight*0.1):0));
//			}
//			else if(type==101){
//				g.textAlign = 'center'; g.textBaseline = 'middle';
//				g.fillText(text, px, py);
//			}
//			else{
//				g.textAlign    = ((type==3||type==4)?'right':'left');
//				g.textBaseline = ((type==2||type==3)?'alphabetic':'top');
//				g.fillText(text, px+((type==3||type==4)?k.cwidth:3), py+((type==2||type==3)?k.cheight-1:0));
//			}
//		}
	},

	//---------------------------------------------------------------------------
	// pc.drawNumbersOn51()   [�_]�ɐ������L������
	// pc.drawNumbersOn51_1() 1��[�_]�ɐ������L������
	//---------------------------------------------------------------------------
	drawNumbersOn51 : function(x1,y1,x2,y2){
		for(var cx=x1;cx<=x2;cx++){ for(var cy=y1;cy<=y2;cy++){
			var c = bd.cnum(cx,cy);
			// cell�ゾ�����ꍇ
			if(c!==-1){
				if(bd.cell[c].ques===51){
					this.drawNumbersOn51_1(bd.cell[c], bd.rt(c), bd.dn(c), 0)
				}
				else{
					this.hideEL(bd.cell[c].numobj);
					this.hideEL(bd.cell[c].numobj2);
				}
			}
			else{
				c = bd.exnum(cx,cy);
				// excell�ゾ�����ꍇ
				if(c!==-1){
					this.drawNumbersOn51_1(bd.excell[c], bd.excell[c].cy*k.qcols, bd.excell[c].cx, 50)
				}
			}
		}}

		this.vinc();
	},
	drawNumbersOn51_1 : function(obj, rt, dn, add){
		var val,err,grd,nb,el,type,str;
		for(var i=0;i<2;i++){
			if(i===0){ val=obj.qnum,  err=obj.error, guard=obj.cy, nb=rt, type=add+4, str='numobj'; }	// 1��ڂ͉E����
			if(i===1){ val=obj.direc, err=obj.error, guard=obj.cx, nb=dn, type=add+2, str='numobj2';}	// 2��ڂ͉�����

			if(val===-1 || guard===-1 || nb===-1 || bd.cell[nb].ques===51){ this.hideEL(obj[str]);}
			else{
				if(!obj[str]){ obj[str] = ee.CreateDOMAndSetNop();}
				var color = (err===1?this.fontErrcolor:this.fontcolor);
				var text = (val>=0?""+val:"");
				this.dispnum(obj[str], type, text, 0.45, color, obj.px, obj.py);
			}
		}
	}
};
