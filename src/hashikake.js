//
// �p�Y���ŗL�X�N���v�g�� ����������� hashikake.js v3.3.0
//
Puzzles.hashikake = function(){ };
Puzzles.hashikake.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 9;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 9;}	// �Ֆʂ̏c��
		k.irowake = 1;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
		k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
		k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
		k.isLineCross     = 1;	// 1:������������p�Y��
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

		k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 1;	// 1:pencilbox/�J���y���ɂ���p�Y��

		//k.def_csize = 36;
		k.def_psize = 16;
		//k.area = { bcell:0, wcell:0, number:0};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		base.setTitle("����������","Bridges");
		base.setExpression("�@���{�^���Ő����A�E�{�^���Ł~�����͂ł��܂��B",
						   " Left Button Drag to inpur lines, Right to input a cross.");
		base.setFloatbgcolor("rgb(127, 191, 0)");

		enc.pidKanpen = 'hashi';
	},
	menufix : function(){
		pp.addCheck('circolor','setting',false,'�������O���[�ɂ���','Set Grey Color');
		pp.setLabel('circolor', '�����Ɠ����{��������������O���[�ɂ���', 'Grey if the number is equal to linked bridges.');

		pp.funcs['circolor'] = function(){ pc.paintAll();};
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if(k.editmode){
				if(!kp.enabled()){ this.inputqnum();}
				else{ kp.display();}
			}
			else if(k.playmode){
				if(this.btn.Left) this.inputLine();
				else if(this.btn.Right) this.inputpeke();
			}
		};
		mv.mouseup = function(){ };
		mv.mousemove = function(){
			if(k.playmode){
				if(this.btn.Left) this.inputLine();
				else if(this.btn.Right) this.inputpeke();
			}
		};

		mv.inputLine = function(){
			var pos = this.borderpos(0);
			if(pos.x==this.mouseCell.x && pos.y==this.mouseCell.y){ return;}

			var id = -1;
			if     (pos.y-this.mouseCell.y==-2){ id=bd.bnum(this.mouseCell.x  ,this.mouseCell.y-1);}
			else if(pos.y-this.mouseCell.y== 2){ id=bd.bnum(this.mouseCell.x  ,this.mouseCell.y+1);}
			else if(pos.x-this.mouseCell.x==-2){ id=bd.bnum(this.mouseCell.x-1,this.mouseCell.y  );}
			else if(pos.x-this.mouseCell.x== 2){ id=bd.bnum(this.mouseCell.x+1,this.mouseCell.y  );}

			var include = function(array,val){ for(var i=0;i<array.length;i++){ if(array[i]==val) return true;} return false;};
			if(this.mouseCell!=-1 && id!=-1){
				var idlist = this.getidlist(id);
				if(this.firstPos.x==-1 || !include(this.firstPos,id)){ this.inputData=-1;}
				if(this.inputData==-1){
					if     (bd.LiB(id)==0){ this.inputData=1;}
					else if(bd.LiB(id)==1){ this.inputData=2;}
					else                  { this.inputData=0;}
				}
				if(this.inputData> 0 && ((pos.x-this.mouseCell.x==-2)||(pos.y-this.mouseCell.y==-2))){ idlist=idlist.reverse();} // �F�����̓s����̏���
				for(var i=0;i<idlist.length;i++){
					if(this.inputData!=-1){ bd.sLiB(idlist[i], this.inputData); bd.sQsB(idlist[i], 0);}
					pc.paintLine(idlist[i]);
				}
				this.firstPos=idlist;
			}
			this.mouseCell = pos;
		};
		mv.getidlist = function(id){
			var idlist=[], bx1, bx2, by1, by2;
			var bx=bd.border[id].bx, by=bd.border[id].by;
			if(bd.border[id].bx&1){
				while(by>bd.minby && bd.QnC(bd.cnum(bx,by-1))===-1){ by-=2;} by1=by;
				while(by<bd.maxby && bd.QnC(bd.cnum(bx,by+1))===-1){ by+=2;} by2=by;
				bx1 = bx2 = bd.border[id].bx;
			}
			else if(bd.border[id].by&1){
				while(bx>bd.minbx && bd.QnC(bd.cnum(bx-1,by))===-1){ bx-=2;} bx1=bx;
				while(bx<bd.maxbx && bd.QnC(bd.cnum(bx+1,by))===-1){ bx+=2;} bx2=bx;
				by1 = by2 = bd.border[id].by;
			}
			if(!bd.isinside(bx,by)){ return [];}
			for(var i=bx1;i<=bx2;i+=2){ for(var j=by1;j<=by2;j+=2){ idlist.push(bd.bnum(i,j)); } }
			return idlist;
		};

		mv.inputpeke = function(){
			var pos = this.borderpos(0.22);
			var id = bd.bnum(pos.x, pos.y);
			if(id==-1 || (pos.x==this.mouseCell.x && pos.y==this.mouseCell.y)){ return;}

			if(this.inputData==-1){ this.inputData=(bd.QsB(id)!=2?2:0);}
			bd.sQsB(id, this.inputData);

			var idlist = this.getidlist(id);
			for(var i=0;i<idlist.length;i++){
				bd.sLiB(idlist[i], 0);
				pc.paintBorder(idlist[i]);
			}
			if(idlist.length==0){ pc.paintBorder(id);}
			this.mouseCell = pos;
		},
		mv.enableInputHatena = true;

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.playmode){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca);
		};

		if(k.EDITOR){
			kp.kpgenerate = function(mode){
				this.inputcol('num','knum1','1','1');
				this.inputcol('num','knum2','2','2');
				this.inputcol('num','knum3','3','3');
				this.inputcol('num','knum4','4','4');
				this.insertrow();
				this.inputcol('num','knum5','5','5');
				this.inputcol('num','knum6','6','6');
				this.inputcol('num','knum7','7','7');
				this.inputcol('num','knum8','8','8');
				this.insertrow();
				this.inputcol('num','knum_',' ',' ');
				this.inputcol('num','knum.','-','��');
				this.insertrow();
			};
			kp.generate(kp.ORIGINAL, true, false, kp.kpgenerate);
			kp.kpinput = function(ca){
				kc.key_inputqnum(ca);
			};
		}

		bd.maxnum = 8;
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_THIN;
		pc.bcolor    = "silver";
		pc.fontsizeratio = 0.85;
		pc.chassisflag = false;

		// ���̑�����ʏ��菭����������
		pc.lwratio = 8;

		pc.paint = function(x1,y1,x2,y2){
			this.drawGrid(x1,y1,x2,y2,k.editmode);

			this.drawPekes(x1,y1,x2,y2,0);
			this.drawLines(x1,y1,x2,y2);

			this.drawCirclesAtNumber(x1,y1,x2,y2);
			this.drawNumbers(x1,y1,x2,y2);

			this.drawTarget(x1,y1,x2,y2);
		};

		// �I�[�o�[���C�h
		pc.drawLine1 = function(id, forceFlag){
			var vids = ["b_line_"+id,"b_dline1_"+id,"b_dline2_"+id];

			// LineWidth, LineMargin, LineSpace
			var lw = this.lw + this.addlw, lm = this.lm, ls = lw*1.5;
			if(forceFlag!==false && this.setLineColor(id)){
				if(bd.border[id].line==1){
					if(this.vnop(vids[0],this.FILL)){
						if(bd.border[id].bx&1){ g.fillRect(bd.border[id].px-lm, bd.border[id].py-this.bh-lm, lw, this.ch+lw);}
						if(bd.border[id].by&1){ g.fillRect(bd.border[id].px-this.bw-lm, bd.border[id].py-lm, this.cw+lw, lw);}
					}
				}
				else{ this.vhide(vids[0]);}

				if(bd.border[id].line==2){
					if(this.vnop(vids[1],this.FILL)){
						if(bd.border[id].bx&1){ g.fillRect(bd.border[id].px-lm-ls, bd.border[id].py-this.bh-lm, lw, this.ch+lw);}
						if(bd.border[id].by&1){ g.fillRect(bd.border[id].px-this.bw-lm, bd.border[id].py-lm-ls, this.cw+lw, lw);}
					}
					if(this.vnop(vids[2],this.FILL)){
						if(bd.border[id].bx&1){ g.fillRect(bd.border[id].px-lm+ls, bd.border[id].py-this.bh-lm, lw, this.ch+lw);}
						if(bd.border[id].by&1){ g.fillRect(bd.border[id].px-this.bw-lm, bd.border[id].py-lm+ls, this.cw+lw, lw);}
					}
				}
				else{ this.vhide([vids[1], vids[2]]);}
			}
			else{ this.vhide(vids);}
		};
		// �w�i�F������׃I�[�o�[���C�h
		pc.drawCircle1AtNumber = function(c){
			if(c===-1){ return;}

			var rsize = this.cw*0.44;
			var header = "c_cir_";

			if(bd.cell[c].qnum!=-1){
				g.lineWidth   = this.cw*0.05;
				g.strokeStyle = this.Cellcolor;

				if (pp.getVal('circolor') && bd.cell[c].qnum===ans.getCountOfBridges(c))
											 { g.fillStyle = this.bcolor;      }
				else if(bd.cell[c].error===1){ g.fillStyle = this.errbcolor1;  }
				else                         { g.fillStyle = this.circledcolor;}

				if(this.vnop(header+c,this.FILL)){
					g.shapeCircle(bd.cell[c].cpx, bd.cell[c].cpy, rsize);
				}
			}
			else{ this.vhide([header+c]);}
		};

		line.repaintParts = function(idlist){
			var clist = this.getClistFromIdlist(idlist);
			for(var i=0;i<clist.length;i++){
				pc.drawCircle1AtNumber(clist[i]);
				pc.dispnumCell(clist[i]);
			}
		};
		line.iscrossing = function(cc){ return (bd.QnC(cc)===-1);};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type){
			this.decodeNumber16();
		};
		enc.pzlexport = function(type){
			this.encodeNumber16();
		};

		enc.decodeKanpen = function(){
			fio.decodeCellQnum_kanpen();
		};
		enc.encodeKanpen = function(){
			fio.encodeCellQnum_kanpen();
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			this.decodeCellQnum();
			this.decodeBorderLine();
		};
		fio.encodeData = function(){
			this.encodeCellQnum();
			this.encodeBorderLine();
		};

		fio.kanpenOpen = function(){
			this.decodeCell( function(c,ca){
				if(ca>="1" && ca<="8"){ bd.sQnC(c, parseInt(ca));}
				else if(ca=="9")      { bd.sQsC(c, -2);}
			});
			this.decodeCell( function(c,ca){
				if(ca!="0"){
					var datah = (parseInt(ca)&3);
					if(datah>0){
						bd.sLiB(bd.ub(c),datah);
						bd.sLiB(bd.db(c),datah);
					}
					var dataw = ((parseInt(ca)&12)>>2);
					if(dataw>0){
						bd.sLiB(bd.lb(c),dataw);
						bd.sLiB(bd.rb(c),dataw);
					}
				}
			});
		};
		fio.kanpenSave = function(){
			this.encodeCell( function(c){
				if     (bd.QnC(c) > 0){ return (bd.QnC(c).toString() + " ");}
				else if(bd.QnC(c)==-2){ return "9 ";}
				else                  { return ". ";}
			});
			this.encodeCell( function(c){
				if(bd.QnC(c)!=-1){ return "0 ";}
				var datah = bd.LiB(bd.ub(c));
				var dataw = bd.LiB(bd.lb(c));
				return ""+((datah>0?datah:0)+(dataw>0?(dataw<<2):0))+" ";
			});
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkCellNumber(1) ){
				this.setAlert('�����ɂȂ��鋴�̐����Ⴂ�܂��B','The number of connecting bridges to a number is not correct.'); return false;
			}

			this.performAsLine = true;
			if( !this.checkOneArea( line.getLareaInfo() ) ){
				this.setAlert('�����S�̂ň�Ȃ���ɂȂ��Ă��܂���B', 'All lines and numbers are not connected each other.'); return false;
			}

			if( !this.checkCellNumber(2) ){
				this.setAlert('�����ɂȂ��鋴�̐����Ⴂ�܂��B','The number of connecting bridges to a number is not correct.'); return false;
			}
			return true;
		};
		ans.check1st = function(){ return true;};

		ans.checkCellNumber = function(flag){
			var result = true;
			for(var cc=0;cc<bd.cellmax;cc++){
				var qn = bd.QnC(cc);
				if(qn<0){ continue;}

				var cnt = this.getCountOfBridges(cc);
				if((flag===1 && qn<cnt)||(flag===2 && qn>cnt)){
					if(this.inAutoCheck){ return false;}
					bd.sErC([cc],1);
					result = false;
				}
			}
			return result;
		};
		ans.getCountOfBridges = function(cc){
			var cnt=0, idlist=[bd.ub(cc), bd.db(cc), bd.lb(cc), bd.rb(cc)];
			for(var i=0;i<idlist.length;i++){
				var id = idlist[i];
				if(id!==-1 && bd.border[id].line>0){ cnt+=bd.border[id].line;}
			}
			return cnt;
		};
	}
};
