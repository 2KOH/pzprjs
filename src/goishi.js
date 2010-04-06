//
// �p�Y���ŗL�X�N���v�g�� ��΂Ђ낢�� goishi.js v3.3.0
//
Puzzles.goishi = function(){ };
Puzzles.goishi.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
		k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 0;		// 1:Border/Line������\�ȃp�Y��
		k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
		k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
		k.isLineCross     = 0;	// 1:������������p�Y��
		k.isCenterLine    = 0;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

		k.dispzero      = 0;	// 1:0��\�����邩�ǂ���
		k.isDispHatena  = 0;	// 1:qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber   = 1;	// 1:�񓚂ɐ�������͂���p�Y��
		k.isArrowNumber = 0;	// 1:������������͂���p�Y��
		k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
		k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
		k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

		k.BlackCell     = 0;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 1;	// 1:pencilbox/�J���y���ɂ���p�Y��

		//k.def_csize = 36;
		//k.def_psize = 24;
		k.area = { bcell:0, wcell:0, number:0};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		base.setTitle("��΂Ђ낢","Goishi");
		if(k.EDITOR){
			base.setExpression("�@���N���b�N�Ł��ɏ��Ԃ�\���������A�E�N���b�Nor�������ςȂ��Ō��ɖ߂��܂��BURL�������A��΂̂Ȃ������͎����I�ɃJ�b�g����܂��B",
							   " Left Click to input number of orders, Right Click or Pressing to Undo. The area with no Goishi is cut when outputting URL.");
		}
		else{
			base.setExpression("�@���N���b�N�Ł��ɏ��Ԃ�\���������A�E�N���b�Nor�������ςȂ��Ō��ɖ߂��܂��B",
							   " Left Click to input number of orders, Right Click or Pressing to Undo.");
		}
		base.setFloatbgcolor("rgb(96, 96, 96)");
		base.proto = 1;

		enc.pidKanpen = 'goishi';
	},
	menufix : function(){
		if(k.EDITOR){
			pp.addCheck('bdpadding','setting',true, '�󌄂�URL', 'URL with Padding');
			pp.setLabel('bdpadding', 'URL�������Ɏ���1�}�X�����Ȃ�����������', 'Add Padding around the Board in outputting URL.');
			pp.funcs['bdpadding'] = function(){ };
		}
	},
	finalfix : function(){
		ee('btnclear2').el.style.display = 'none';
		var el = document.urloutput.firstChild;
		if(!el.innerHTML){
			document.urloutput.removeChild(el);
			el = document.urloutput.firstChild;
		}
		el.removeChild(el.firstChild);
		el.removeChild(el.firstChild);
	},

	protoChange : function(){
		Timer.prototype.startMouseUndoTimer = function(){
			this.undoWaitCount = this.undoStartCount;
			if(!this.TIDundo){ this.TIDundo = setInterval(ee.binder(this, this.procMouseUndo), this.undoInterval);}
			this.execMouseUndo();
		};
		Timer.prototype.stopMouseUndoTimer = function(){
			kc.inUNDO=false;
			kc.inREDO=false;
			clearInterval(this.TIDundo);
			this.TIDundo = null;
		};
		Timer.prototype.procMouseUndo = function(){
			if (!kc.inUNDO && !kc.inREDO){ this.stopUndoTimer();}
			else if(this.undoWaitCount>0){ this.undoWaitCount--;}
			else{ this.execMouseUndo();}
		};
		Timer.prototype.execMouseUndo = function(){
			if(kc.inUNDO){
				var prop = (um.current>0 ? um.ope[um.current-1].property : '');
				if(prop===k.QANS){ um.undo();}
				else             { kc.inUNDO = false;}
			}
			else if(kc.inREDO){
				var prop = (um.current<um.ope.length ? um.ope[um.current].property : '');
				if(prop===k.QANS){ um.redo();}
				else             { kc.inREDO = false;}
			}
		};
	},
	protoOriginal : function(){
		Timer.prototype.startMouseUndoTimer = null;
		Timer.prototype.stopMouseUndoTimer  = null;
		Timer.prototype.procMouseUndo       = null;
		Timer.prototype.execMouseUndo       = null;

		ee('btnclear2').el.style.display = 'inline';
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if     (k.editmode) this.inputstone();
			else if(k.playmode){
				if     (this.btn.Left)  this.inputqans();
				else if(this.btn.Right){
					kc.inUNDO = true;
					tm.startMouseUndoTimer();
				}
			}
		};
		mv.mouseup = function(){ kc.inUNDO = false; kc.inREDO = false;};
		mv.mousemove = function(){ };

		mv.inputstone = function(){
			var cc = this.cellid();
			if(cc===-1){ return;}

			var cc0 = tc.getTCC();
			if(cc!==cc0){
				tc.setTCC(cc);
				pc.paintCell(cc0);
			}

			bd.setStone(cc);
			pc.paintCell(cc);
		};
		mv.inputqans = function(){
			var cc = this.cellid();
			if(cc===-1 || bd.cell[cc].ques!==7 || bd.cell[cc].qans!==-1){
				kc.inREDO = true;
				tm.startMouseUndoTimer();
				return;
			}

			var max=0, bcc=-1;
			for(var c=0;c<bd.cellmax;c++){
				if(bd.cell[c].qans>max){
					max = bd.cell[c].qans;
					bcc = c;
				}
			}

			// ���ł�1�ȏ�̌�΂�����Ă���ꍇ
			if(bcc!==-1){
				var tmp, d = {x1:-1, y1:-1, x2:-1, y2:-1};
				d.x1 = bd.cell[cc].cx, d.x2 = bd.cell[bcc].cx;
				d.y1 = bd.cell[cc].cy, d.y2 = bd.cell[bcc].cy;

				// �����̏㉺���E��max�Ȍ�΂��Ȃ��ꍇ�͉������Ȃ�
				if(d.x1!==d.x2 && d.y1!==d.y2){ return;}
				else if(d.x1===d.x2){
					if(d.y1>d.y2){ tmp=d.y2; d.y2=d.y1; d.y1=tmp;}
					d.y1++; d.y2--;
				}
				else{ // if(d.y1===d.y2)
					if(d.x1>d.x2){ tmp=d.x2; d.x2=d.x1; d.x1=tmp;}
					d.x1++; d.x2--;
				}
				// �ԂɌ�΂�����ꍇ�͉������Ȃ�
				for(var cx=d.x1;cx<=d.x2;cx++){ for(var cy=d.y1;cy<=d.y2;cy++){
					var c = bd.cnum(cx,cy);
					if(c!==-1 && bd.cell[c].ques===7){
						var qa = bd.cell[c].qans;
						if(qa===-1 || (max>=2 && qa===max-1)){ return;}
					}
				} }
			}

			bd.sQaC(cc,max+1);
			pc.paintCell(cc);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.playmode){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputstone(ca);
		};
		kc.keyup = function(ca){ };

		kc.key_inputstone = function(ca){
			if(ca=='q'){
				var cc = tc.getTCC();
				bd.setStone(cc);
				pc.paintCell(cc);
			}
		};

		bd.setStone = function(cc){
			if     (bd.QuC(cc)!== 7){ bd.sQuC(cc,7);}
			else if(bd.QaC(cc)===-1){ bd.sQuC(cc,0);} // �����̃}�X�͏����܂���
		};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.errcolor1 = "rgb(208, 0, 0)";
		pc.errbcolor1 = "rgb(255, 192, 192)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);

			this.drawCenterLines(x1,y1,x2,y2);

			x1--; y1--; x2++; y2++;
			this.drawCircles_goishi(x1,y1,x2,y2);
			this.drawCellSquare(x1,y1,x2,y2);
			this.drawNumbers(x1,y1,x2,y2);

			this.drawTarget(x1,y1,x2,y2);
		};

		pc.drawCenterLines = function(x1,y1,x2,y2){
			this.vinc('centerline', 'crispEdges');
			if(x1<1){ x1=1;} if(x2>k.qcols-2){ x2=k.qcols-2;}
			if(y1<1){ y1=1;} if(y2>k.qrows-2){ y2=k.qrows-2;}

			g.fillStyle = this.gridcolor_LIGHT;
			for(var i=x1-1;i<=x2+1;i++){ if(this.vnop("cliney_"+i,this.NONE)){ g.fillRect(mf(k.p0.x+(i+0.5)*k.cwidth), mf(k.p0.y+(y1-0.5)*k.cheight), 1, (y2-y1+2)*k.cheight+1);} }
			for(var i=y1-1;i<=y2+1;i++){ if(this.vnop("clinex_"+i,this.NONE)){ g.fillRect(mf(k.p0.x+(x1-0.5)*k.cwidth), mf(k.p0.y+(i+0.5)*k.cheight), (x2-x1+2)*k.cwidth+1, 1);} }
		};
		pc.drawCircles_goishi = function(x1,y1,x2,y2){
			this.vinc('cell_goishi', 'auto');

			g.lineWidth = Math.max(k.cwidth*0.05, 1);
			var rsize  = k.cwidth*0.38;
			var header = "c_cir_";
			var clist = this.cellinside(x1,y1,x2,y2);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.cell[c].ques===7 && bd.cell[c].qans===-1){
					g.strokeStyle = (bd.cell[c].error===1 ? this.errcolor1  : this.Cellcolor);
					g.fillStyle   = (bd.cell[c].error===1 ? this.errbcolor1 : "white");
					if(this.vnop(header+c,this.FILL_STROKE)){
						g.shapeCircle(bd.cell[c].px+k.cwidth/2, bd.cell[c].py+k.cheight/2, rsize);
					}
				}
				else{ this.vhide([header+c]);}
			}
		};
		pc.drawCellSquare = function(x1,y1,x2,y2){
			this.vinc('cell_number_base', 'crispEdges');

			var mgnw = mf(k.cwidth*0.1);
			var mgnh = mf(k.cheight*0.1);
			var header = "c_sq2_";

			var clist = this.cellinside(x1,y1,x2,y2);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.cell[c].ques===7 && bd.cell[c].qans!==-1){
					g.fillStyle = (bd.cell[c].error===1 ? this.errbcolor1 : "white");
					if(this.vnop(header+c,this.FILL)){
						g.fillRect(bd.cell[c].px+mgnw+2, bd.cell[c].py+mgnh+2, k.cwidth-mgnw*2-3, k.cheight-mgnh*2-3);
					}
				}
				else{ this.vhide([header+c]);}
			}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type){
			this.decodeBoard();
		};
		enc.pzlexport = function(type){
			this.encodeGoishi();
		};

		enc.decodeKanpen = function(){
			fio.decodeCell( function(c,ca){
				if(ca==='1'){ bd.sQuC(c, 7);}
			});
		};
		enc.encodeKanpen = function(){
			fio.encodeGoishi_kanpen();
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			this.decodeCell( function(c,ca){
				if(ca!=='.'){
					bd.sQuC(c, 7);
					if(ca!=='0'){ bd.sQaC(c, parseInt(ca));}
				}
			});
		};
		fio.encodeData = function(){
			this.encodeCell( function(c){
				if(bd.QuC(c)===7){
					if(bd.QaC(c)===-1){ return "0 ";}
					else{ return ""+parseInt(bd.QaC(c))+" ";}
				}
				return ". ";
			});
		};

		//---------------------------------------------------------
		enc.decodeBoard = function(){
			var bstr = this.outbstr;
			for(var i=0;i<bstr.length;i++){
				var num = parseInt(bstr.charAt(i),32);
				for(var w=0;w<5;w++){ if((i*5+w)<bd.cellmax){ bd.sQuC(i*5+w,(num&Math.pow(2,4-w)?0:7));} }
				if((i*5+5)>=k.qcols*k.qrows){ break;}
			}
			this.outbstr = bstr.substr(i+1);
		};

		// �G���R�[�h���́A�ՖʃT�C�Y�̏k���Ƃ������ꏈ�����s���Ă܂�
		enc.encodeGoishi = function(){
			var d = this.getSizeOfBoard_goishi();

			var cm="", count=0, pass=0;
			for(var cy=d.y1;cy<=d.y2;cy++){
				for(var cx=d.x1;cx<=d.x2;cx++){
					var c=bd.cnum(cx,cy);
					if(c===-1 || bd.QuC(c)==0){ pass+=Math.pow(2,4-count);}
					count++; if(count==5){ cm += pass.toString(32); count=0; pass=0;}
				}
			}
			if(count>0){ cm += pass.toString(32);}
			this.outbstr += cm;

			this.outsize = [d.x2-d.x1+1, d.y2-d.y1+1].join("/");
		};

		fio.encodeGoishi_kanpen = function(){
			var d = enc.getSizeOfBoard_goishi();

			for(var cy=d.y1;cy<=d.y2;cy++){
				for(var cx=d.x1;cx<=d.x2;cx++){
					var c = bd.cnum(cx,cy);
					this.datastr += (bd.QuC(c)===7 ? "1 " : ". ");
				}
				this.datastr += "/";
			}

			enc.outsize  = [d.y2-d.y1+1, d.x2-d.x1+1].join("/");
			this.sizestr = [d.y2-d.y1+1, d.x2-d.x1+1].join("/");
		};

		enc.getSizeOfBoard_goishi = function(){
			var x1=9999, x2=-1, y1=9999, y2=-1, count=0;
			for(var c=0;c<bd.cellmax;c++){
				if(bd.QuC(c)!=7){ continue;}
				if(x1>bd.cell[c].cx){ x1=bd.cell[c].cx;}
				if(x2<bd.cell[c].cx){ x2=bd.cell[c].cx;}
				if(y1>bd.cell[c].cy){ y1=bd.cell[c].cy;}
				if(y2<bd.cell[c].cy){ y2=bd.cell[c].cy;}
				count++;
			}
			if(count==0){ return {x1:0, y1:0, x2:1, y2:1};}
			if(pp.getVal('bdpadding')){ return {x1:x1-1, y1:y1-1, x2:x2+1, y2:y2+1};}
			return {x1:x1, y1:y1, x2:x2, y2:y2};
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkAllCell(function(c){ return (bd.cell[c].ques===7 && bd.cell[c].qans===-1);}) ){
				this.setAlert('�E���Ă��Ȃ���΂�����܂��B','There is remaining Goishi.'); return false;
			}

			return true;
		}
	}
};
