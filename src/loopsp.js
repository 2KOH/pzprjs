//
// �p�Y���ŗL�X�N���v�g�� ����X�y�V������ loopsp.js v3.3.0
//
Puzzles.loopsp = function(){ };
Puzzles.loopsp.prototype = {
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

		k.ispzprv3ONLY  = 0;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

		if(k.EDITOR){
			base.setExpression("�@���̋L����QWEASDF�̊e�L�[�œ��͂ł��܂��B<br>R�L�[��-�L�[�ŏ����ł��܂��B�����L�[�Ő�������͂ł��܂��B",
							   " Press each QWEASDF key to input question. <br> Press 'R' or '-' key to erase. Number keys to input numbers.");
		}
		else{
			base.setExpression("�@���h���b�O�Ő����A�E�N���b�N�Ł~�󂪓��͂ł��܂��B",
							   " Left Button Drag to input black cells, Right Click to input a cross.");
		}
		base.setTitle("����X�y�V����","Loop Special");
		base.setFloatbgcolor("rgb(0, 191, 0)");
	},
	menufix : function(){
		if(k.EDITOR){ kp.defaultdisp = true;}
		menu.addRedLineToFlags();
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if(kc.isZ ^ pp.getVal('dispred')){ this.dispRedLine(); return;}
			if(k.editmode){
				if(!kp.enabled()){ this.inputLoopsp();}
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

		mv.inputLoopsp = function(){
			var cc = this.cellid();
			if(cc==-1 || cc==this.mouseCell){ return;}

			if(cc==tc.getTCC()){
				var qs = bd.QuC(cc); var qn = bd.QnC(cc);
				if(this.btn.Left){
					if(qn==-1){
						if     (qs==0)           { bd.sQuC(cc,101);}
						else if(qs>=101&&qs<=106){ bd.sQuC(cc,qs+1);}
						else if(qs==107)         { bd.sQuC(cc,0); bd.sQnC(cc,-2);}
					}
					else if(qn==-2){ bd.sQnC(cc,1);}
					else if(qn<bd.maxnum){ bd.sQnC(cc,qn+1);}
					else{ bd.sQuC(cc,0); bd.sQnC(cc,-1);}
				}
				else if(this.btn.Right){
					if(qn==-1){
						if     (qs==0)           { bd.sQuC(cc,0); bd.sQnC(cc,-2);}
						else if(qs==101)         { bd.sQuC(cc,0); bd.sQnC(cc,-1);}
						else if(qs>=102&&qs<=107){ bd.sQuC(cc,qs-1);}
					}
					else if(qn==-2){ bd.sQuC(cc,107); bd.sQnC(cc,-1);}
					else if(qn>1) { bd.sQnC(cc,qn-1);}
					else{ bd.sQuC(cc,0); bd.sQnC(cc,-2);}
				}
			}
			else{
				var cc0 = tc.getTCC();
				tc.setTCC(cc);
				pc.paintCell(cc0);
			}
			this.mouseCell = cc;

			pc.paintCell(cc);
		};

		bd.enableLineNG = true;

		// �I�[�o�[���C�g
		bd.sQuC = function(id, num) {
			um.addOpe(k.CELL, k.QUES, id, this.cell[id].ques, num);
			this.cell[id].ques = num;

			this.checkLPCombined(id);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(ca=='z' && !this.keyPressed){ this.isZ=true; return;}
			if(k.playmode){ return;}
			if(this.moveTCell(ca)){ return;}
			kc.key_inputLineParts(ca);
		};
		kc.key_inputLineParts = function(ca){
			if(k.playmode){ return false;}
			var cc = tc.getTCC();

			if     (ca=='q'){ bd.sQuC(cc,101); bd.sQnC(cc,-1); }
			else if(ca=='w'){ bd.sQuC(cc,102); bd.sQnC(cc,-1); }
			else if(ca=='e'){ bd.sQuC(cc,103); bd.sQnC(cc,-1); }
			else if(ca=='r'){ bd.sQuC(cc,  0); bd.sQnC(cc,-1); }
			else if(ca==' '){ bd.sQuC(cc,  0); bd.sQnC(cc,-1); }
			else if(ca=='a'){ bd.sQuC(cc,104); bd.sQnC(cc,-1); }
			else if(ca=='s'){ bd.sQuC(cc,105); bd.sQnC(cc,-1); }
			else if(ca=='d'){ bd.sQuC(cc,106); bd.sQnC(cc,-1); }
			else if(ca=='f'){ bd.sQuC(cc,107); bd.sQnC(cc,-1); }
			else if((ca>='0' && ca<='9') || ca=='-'){
				var old = bd.QnC(cc);
				kc.key_inputqnum(ca);
				if(old!=bd.QnC(cc)){ bd.sQuC(cc,0);}
			}
			else{ return false;}

			pc.paintCell(cc);
			return true;
		};
		kc.keyup = function(ca){ if(ca=='z'){ this.isZ=false;}};
		kc.isZ = false;

		if(k.EDITOR){
			kp.kpgenerate = function(mode){
				this.inputcol('num','knumq','q','��');
				this.inputcol('num','knumw','w','��');
				this.inputcol('num','knume','e','��');
				this.inputcol('num','knumr','r',' ');
				this.inputcol('num','knum.','-','��');
				this.insertrow();
				this.inputcol('num','knuma','a','��');
				this.inputcol('num','knums','s','��');
				this.inputcol('num','knumd','d','��');
				this.inputcol('num','knumf','f','��');
				this.inputcol('empty','knumx','','');
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
			};
			kp.generate(kp.ORIGINAL, true, false, kp.kpgenerate);
			kp.kpinput = function(ca){ kc.key_inputLineParts(ca);};
		}
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_LIGHT;
		pc.linecolor = pc.linecolor_LIGHT;
		pc.fontsizeratio = 0.85;
		pc.circleratio = [0.38, 0.30];

		pc.minYdeg = 0.36;
		pc.maxYdeg = 0.74;

		pc.paint = function(x1,y1,x2,y2){
			this.drawBGCells(x1,y1,x2,y2);
			if(g.use.canvas){ this.drawPekes(x1,y1,x2,y2,2);}
			this.drawDashedGrid(x1,y1,x2,y2);

			this.drawLines(x1,y1,x2,y2);

			this.drawCirclesAtNumber(x1,y1,x2,y2);
			this.drawNumbers(x1,y1,x2,y2);

			this.drawPekes(x1,y1,x2,y2,1);

			this.drawLineParts(x1-2,y1-2,x2+2,y2+2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawTarget(x1,y1,x2,y2);
		};

		line.repaintParts = function(idlist){
			var clist = this.getClistFromIdlist(idlist);
			for(var i=0;i<clist.length;i++){
				pc.drawLineParts1(clist[i]);
				pc.drawCircle1AtNumber(clist[i]);
				pc.dispnumCell(clist[i]);
			}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type){
			this.decodeLoopsp();
		};
		enc.pzlexport = function(type){
			this.encodeLoopsp();
		};

		enc.decodeLoopsp = function(){
			var c=0, bstr = this.outbstr;
			for(var i=0;i<bstr.length;i++){
				var ca = bstr.charAt(i);

				if     (ca == '.'){ bd.sQnC(c, -2); c++;}
				else if(ca == '-'){ bd.sQnC(c, parseInt(bstr.substr(i+1,2),16)); c++; i+=2;}
				else if((ca >= '0' && ca <= '9')||(ca >= 'a' && ca <= 'f')){ bd.sQnC(c, parseInt(bstr.substr(i,1),16)); c++;}
				else if(ca >= 'g' && ca <= 'm'){ bd.sQuC(c, (parseInt(ca,36)+85)); c++;}
				else if(ca >= 'n' && ca <= 'z'){ c += (parseInt(ca,36)-22);}
				else{ c++;}

				if(c > bd.cellmax){ break;}
			}

			this.outbstr = bstr.substr(i);
		};
		enc.encodeLoopsp = function(){
			var cm="", pstr="", count=0;
			for(var i=0;i<bd.cellmax;i++){
				if     (bd.QnC(i)== -2                  ){ pstr = ".";}
				else if(bd.QnC(i)>=  0 && bd.QnC(i)<  16){ pstr =       bd.QnC(i).toString(16);}
				else if(bd.QnC(i)>= 16 && bd.QnC(i)< 256){ pstr = "-" + bd.QnC(i).toString(16);}
				else if(bd.QuC(i)>=101 && bd.QuC(i)<=107){ pstr = (bd.QuC(i)-85).toString(36);}
				else{ pstr = ""; count++;}

				if(count==0){ cm += pstr;}
				else if(pstr || count==13){ cm+=((22+count).toString(36)+pstr); count=0;}
			}
			if(count>0){ cm+=(22+count).toString(36);}

			this.outbstr += cm;
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			this.decodeCell( function(c,ca){
				if(ca == "o")     { bd.sQuC(c, 6);}
				else if(ca == "-"){ bd.sQuC(c, -2);}
				else if(ca >= "a" && ca <= "g"){ bd.sQuC(c, parseInt(ca,36)+91);}
				else if(ca != "."){ bd.sQnC(c, parseInt(ca));}
			});
			this.decodeBorderLine();
		};
		fio.encodeData = function(){
			this.encodeCell( function(c){
				if     (bd.QuC(c)==6) { return "o ";}
				else if(bd.QuC(c)>=101 && bd.QuC(c)<=107) { return ""+(bd.QuC(c)-91).toString(36)+" ";}
				else if(bd.QuC(c)==-2){ return "- ";}
				else if(bd.QnC(c)!=-1){ return bd.QnC(c).toString()+" ";}
				else                  { return ". ";}
			});
			this.encodeBorderLine();
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkenableLineParts(1) ){
				this.setAlert('�ŏ����������Ă����������}�X�ɐ���������Ă��܂��B','Lines are added to the cell that the mark lie in by the question.'); return false;
			}

			if( !this.checkLcntCell(3) ){
				this.setAlert('���򂵂Ă����������܂��B','There is a branched line.'); return false;
			}

			if( !this.checkAllCell(function(c){ return (line.lcntCell(c)==4 && bd.QnC(c)!=-1);}) ){
				this.setAlert('���̕����Ő����������Ă��܂��B','The lines are crossed on the number.'); return false;
			}

			if( !this.checkLoopNumber() ){
				this.setAlert('�قȂ鐔�����܂񂾃��[�v������܂��B','A loop has plural kinds of number.'); return false;
			}
			if( !this.checkNumberLoop() ){
				this.setAlert('�����������قȂ郋�[�v�Ɋ܂܂�Ă��܂��B','A kind of numbers are in differernt loops.'); return false;
			}
			if( !this.checkNumberInLoop() ){
				this.setAlert('�����܂�ł��Ȃ����[�v������܂��B','A loop has no numbers.'); return false;
			}

			if( !this.checkAllCell(function(c){ return (line.lcntCell(c)!=4 && bd.QuC(c)==101);}) ){
				this.setAlert('���̃}�X�������4�{�o�Ă��܂���B','A cross-joint cell doesn\'t have four-way lines.'); return false;
			}

			if( !this.checkLcntCell(0) ){
				this.setAlert('����������Ă��Ȃ��}�X������܂��B','There is an empty cell.'); return false;
			}
			if( !this.checkLcntCell(1) ){
				this.setAlert('�r���œr�؂�Ă����������܂��B','There is a dead-end line.'); return false;
			}

			return true;
		};

		ans.checkLoopNumber = function(){
			return this.checkAllLoops(function(cells){
				var number = -1;
				for(var i=0;i<cells.length;i++){
					if(bd.QnC(cells[i])>=1){
						if(number==-1){ number=bd.QnC(cells[i]);}
						else if(number!=bd.QnC(cells[i])){
							for(var c=0;c<cells.length;c++){ if(bd.QnC(cells[c])>=1){ bd.sErC([cells[c]],1);} }
							return false;
						}
					}
				}
				return true;
			});
		};
		ans.checkNumberLoop = function(){
			return this.checkAllLoops(function(cells){
				var number = -1;
				var include = function(array,val){ for(var i=0;i<array.length;i++){ if(array[i]==val) return true;} return false;};
				for(var i=0;i<cells.length;i++){ if(bd.QnC(cells[i])>=1){ number = bd.QnC(cells[i]); break;} }
				if(number==-1){ return true;}
				for(var c=0;c<bd.cellmax;c++){
					if(bd.QnC(c)==number && !include(cells,c)){
						for(var cc=0;cc<bd.cellmax;cc++){ if(bd.QnC(cc)==number){ bd.sErC([cc],1);} }
						return false;
					}
				}
				return true;
			});
		};
		ans.checkNumberInLoop = function(){
			return this.checkAllLoops(function(cells){
				for(var i=0;i<cells.length;i++){ if(bd.QnC(cells[i])!=-1){ return true;} }
				return false;
			});
		};
		ans.checkAllLoops = function(func){
			var result = true;
			var xinfo = line.getLineInfo();
			for(var r=1;r<=xinfo.max;r++){
				if(func(line.LineList2Clist(xinfo.room[r].idlist))){ continue;}

				if(this.inAutoCheck){ return false;}
				if(result){ bd.sErBAll(2);}
				bd.sErB(xinfo.room[r].idlist,1);
				result = false;
			}
			return result;
		};

		line.LineList2Clist = function(idlist){
			var clist = [];
			clist.include = function(val){ for(var i=0,len=this.length;i<len;i++){ if(this[i]==val) return true;} return false;};
			for(var i=0,len=idlist.length;i<len;i++){
				var cc1 = bd.border[id].cellcc[0], cc2 = bd.border[id].cellcc[1];
				if(cc1!=-1 && !clist.include(cc1)){ clist.push(cc1);}
				if(cc2!=-1 && !clist.include(cc2)){ clist.push(cc2);}
			}
			return clist;
		};
	}
};
