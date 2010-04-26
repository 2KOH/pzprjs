//
// �p�Y���ŗL�X�N���v�g�� ��΂Ђ낢�� goishi.js v3.3.0
//
Puzzles.goishi = function(){ };
Puzzles.goishi.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
		k.irowake  = 0;		// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross  = 0;		// 1:�Ֆʓ�����Cross������p�Y�� 2:�O�g����܂߂�Cross������p�Y��
		k.isborder = 0;		// 1:Border/Line������\�ȃp�Y�� 2:�O�g�������\�ȃp�Y��
		k.isexcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isLineCross     = false;	// ������������p�Y��
		k.isCenterLine    = false;	// �}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = false;	// ���E����line�Ƃ��Ĉ���
		k.hasroom         = false;	// �������̗̈�ɕ�����Ă���/������p�Y��
		k.roomNumber      = false;	// �����̖��̐�����1��������p�Y��

		k.dispzero        = false;	// 0��\�����邩�ǂ���
		k.isDispHatena    = false;	// qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber     = true;	// �񓚂ɐ�������͂���p�Y��
		k.NumberWithMB    = false;	// �񓚂̐����Ɓ��~������p�Y��
		k.linkNumber      = false;	// �������ЂƂȂ���ɂȂ�p�Y��

		k.BlackCell       = false;	// ���}�X����͂���p�Y��
		k.NumberIsWhite   = false;	// �����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell     = false;	// �A�����f�ւ̃p�Y��
		k.checkBlackCell  = false;	// ��������ō��}�X�̏����`�F�b�N����p�Y��
		k.checkWhiteCell  = false;	// ��������Ŕ��}�X�̏����`�F�b�N����p�Y��

		k.ispzprv3ONLY    = true;	// �ς��Ղ�A�v���b�g�ɂ͑��݂��Ȃ��p�Y��
		k.isKanpenExist   = true;	// pencilbox/�J���y���ɂ���p�Y��

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
			this.undoWaitCount = this.undoWaitTime/this.undoInterval;
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
				d.x1 = bd.cell[cc].bx, d.x2 = bd.cell[bcc].bx;
				d.y1 = bd.cell[cc].by, d.y2 = bd.cell[bcc].by;

				// �����̏㉺���E��max�Ȍ�΂��Ȃ��ꍇ�͉������Ȃ�
				if(d.x1!==d.x2 && d.y1!==d.y2){ return;}
				else if(d.x1===d.x2){
					if(d.y1>d.y2){ tmp=d.y2; d.y2=d.y1; d.y1=tmp;}
					d.y1+=2; d.y2-=2;
				}
				else{ // if(d.y1===d.y2)
					if(d.x1>d.x2){ tmp=d.x2; d.x2=d.x1; d.x1=tmp;}
					d.x1+=2; d.x2-=2;
				}
				// �ԂɌ�΂�����ꍇ�͉������Ȃ�
				for(var bx=d.x1;bx<=d.x2;bx+=2){ for(var by=d.y1;by<=d.y2;by+=2){
					var c = bd.cnum(bx,by);
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
			this.drawCenterLines(x1,y1,x2,y2);

			x1--; y1--; x2++; y2++;
			this.drawCircles_goishi(x1,y1,x2,y2);
			this.drawCellSquare(x1,y1,x2,y2);
			this.drawNumbers(x1,y1,x2,y2);

			this.drawTarget(x1,y1,x2,y2);
		};

		pc.drawCenterLines = function(x1,y1,x2,y2){
			this.vinc('centerline', 'crispEdges');
			if(x1<bd.minbx+1){ x1=bd.minbx+1;} if(x2>bd.maxbx-1){ x2=bd.maxbx-1;}
			if(y1<bd.minby+1){ y1=bd.minby+1;} if(y2>bd.maxby-1){ y2=bd.maxby-1;}
			x1|=1, y1|=1;

			g.fillStyle = this.gridcolor_LIGHT;
			for(var i=x1;i<=x2;i+=2){ if(this.vnop("cliney_"+i,this.NONE)){ g.fillRect(k.p0.x+ i*this.bw, k.p0.y+y1*this.bh, 1, (y2-y1)*this.bh+1);} }
			for(var i=y1;i<=y2;i+=2){ if(this.vnop("clinex_"+i,this.NONE)){ g.fillRect(k.p0.x+x1*this.bw, k.p0.y+ i*this.bh, (x2-x1)*this.bw+1, 1);} }
		};
		pc.drawCircles_goishi = function(x1,y1,x2,y2){
			this.vinc('cell_goishi', 'auto');

			g.lineWidth = Math.max(this.cw*0.05, 1);
			var rsize  = this.cw*0.38;
			var header = "c_cir_";
			var clist = bd.cellinside(x1,y1,x2,y2);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.cell[c].ques===7 && bd.cell[c].qans===-1){
					g.strokeStyle = (bd.cell[c].error===1 ? this.errcolor1  : this.Cellcolor);
					g.fillStyle   = (bd.cell[c].error===1 ? this.errbcolor1 : "white");
					if(this.vnop(header+c,this.FILL_STROKE)){
						g.shapeCircle(bd.cell[c].cpx, bd.cell[c].cpy, rsize);
					}
				}
				else{ this.vhide([header+c]);}
			}
		};
		pc.drawCellSquare = function(x1,y1,x2,y2){
			this.vinc('cell_number_base', 'crispEdges');

			var mgnw = this.cw*0.1;
			var mgnh = this.ch*0.1;
			var header = "c_sq2_";

			var clist = bd.cellinside(x1,y1,x2,y2);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.cell[c].ques===7 && bd.cell[c].qans!==-1){
					g.fillStyle = (bd.cell[c].error===1 ? this.errbcolor1 : "white");
					if(this.vnop(header+c,this.FILL)){
						g.fillRect(bd.cell[c].px+mgnw+2, bd.cell[c].py+mgnh+2, this.cw-mgnw*2-3, this.ch-mgnh*2-3);
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
			this.decodeGoishi();
		};
		enc.pzlexport = function(type){
			this.encodeGoishi();
		};

		enc.decodeKanpen = function(){
			fio.decodeGoishi_kanpen();
		};
		enc.encodeKanpen = function(){
			fio.encodeGoishi_kanpen();
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			this.decodeGoishiFile();
		};
		fio.encodeData = function(){
			this.encodeGoishiFile();
		};

		fio.kanpenOpen = function(){
			this.decodeGoishi_kanpen();
			this.decodeQansPos_kanpen();
		};
		fio.kanpenSave = function(){
			this.encodeGoishi_kanpen();
			this.encodeQansPos_kanpen();
		};

		//---------------------------------------------------------
		enc.decodeGoishi = function(){
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
			for(var by=d.y1;by<=d.y2;by+=2){
				for(var bx=d.x1;bx<=d.x2;bx+=2){
					var c=bd.cnum(bx,by);
					if(c===-1 || bd.QuC(c)==0){ pass+=Math.pow(2,4-count);}
					count++; if(count==5){ cm += pass.toString(32); count=0; pass=0;}
				}
			}
			if(count>0){ cm += pass.toString(32);}
			this.outbstr += cm;

			this.outsize = [d.cols>>1, d.rows>>1].join("/");
		};

		enc.getSizeOfBoard_goishi = function(){
			var x1=9999, x2=-1, y1=9999, y2=-1, count=0;
			for(var c=0;c<bd.cellmax;c++){
				if(bd.QuC(c)!=7){ continue;}
				if(x1>bd.cell[c].bx){ x1=bd.cell[c].bx;}
				if(x2<bd.cell[c].bx){ x2=bd.cell[c].bx;}
				if(y1>bd.cell[c].by){ y1=bd.cell[c].by;}
				if(y2<bd.cell[c].by){ y2=bd.cell[c].by;}
				count++;
			}
			if(count==0){ return {x1:0, y1:0, x2:1, y2:1, cols:2, rows:2};}
			if(pp.getVal('bdpadding')){ return {x1:x1-1, y1:y1-1, x2:x2+1, y2:y2+1, cols:(x2-x1+6)/2, rows:(y2-y1+6)/2};}
			return {x1:x1, y1:y1, x2:x2, y2:y2, cols:(x2-x1+2)/2, rows:(y2-y1+2)/2};
		};

		//---------------------------------------------------------
		fio.decodeGoishiFile = function(){
			this.decodeCell( function(c,ca){
				if(ca!=='.'){
					bd.sQuC(c, 7);
					if(ca!=='0'){ bd.sQaC(c, parseInt(ca));}
				}
			});
		};
		fio.encodeGoishiFile = function(){
			this.encodeCell( function(c){
				if(bd.QuC(c)===7){
					if(bd.QaC(c)===-1){ return "0 ";}
					else{ return ""+parseInt(bd.QaC(c))+" ";}
				}
				return ". ";
			});
		};

		fio.decodeGoishi_kanpen = function(){
			this.decodeCell( function(c,ca){
				if(ca==='1'){ bd.sQuC(c, 7);}
			});
		};
		fio.encodeGoishi_kanpen = function(){
			for(var by=bd.minby+1;by<bd.maxby;by+=2){
				for(var bx=bd.minbx+1;bx<bd.maxbx;bx+=2){
					var c = bd.cnum(bx,by);
					this.datastr += (bd.QuC(c)===7 ? "1 " : ". ");
				}
				this.datastr += "/";
			}
		};

		fio.decodeQansPos_kanpen = function(){
			for(;;){
				var data = this.readLine();
				if(!data){ break;}

				var item = data.split(" ");
				if(item.length<=1){ return;}
				else{
					var c=bd.cnum(parseInt(item[2])*2+1,parseInt(item[1])*2+1);
					bd.sQuC(c, 7);
					bd.sQaC(c, parseInt(item[0]));
				}
			}
		};
		fio.encodeQansPos_kanpen = function(){
			var stones = []
			for(var by=bd.minby+1;by<bd.maxby;by+=2){ for(var bx=bd.minbx+1;bx<bd.maxbx;bx+=2){
				var c = bd.cnum(bx,by);
				if(bd.QuC(c)!==7 || bd.QaC(c)===-1){ continue;}

				var pos = [(bx>>1).toString(), (by>>1).toString()];
				stones[bd.QaC(c)-1] = pos;
			}}
			for(var i=0,len=stones.length;i<len;i++){
				var item = [(i+1), stones[i][1], stones[i][0]];
				this.datastr += (item.join(" ")+"/");
			}
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
