//
// �p�Y���ŗL�X�N���v�g�� �^�^�~�o���� tatamibari.js v3.3.0
//
Puzzles.tatamibari = function(){ };
Puzzles.tatamibari.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
		k.irowake  = 0;		// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross  = 0;		// 1:�Ֆʓ�����Cross������p�Y�� 2:�O�g����܂߂�Cross������p�Y��
		k.isborder = 1;		// 1:Border/Line������\�ȃp�Y�� 2:�O�g�������\�ȃp�Y��
		k.isexcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isLineCross     = false;	// ������������p�Y��
		k.isCenterLine    = false;	// �}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = false;	// ���E����line�Ƃ��Ĉ���
		k.hasroom         = true;	// �������̗̈�ɕ�����Ă���/������p�Y��
		k.roomNumber      = false;	// �����̖��̐�����1��������p�Y��

		k.dispzero        = true;	// 0��\�����邩�ǂ���
		k.isDispHatena    = true;	// qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber     = false;	// �񓚂ɐ�������͂���p�Y��
		k.NumberWithMB    = false;	// �񓚂̐����Ɓ��~������p�Y��
		k.linkNumber      = false;	// �������ЂƂȂ���ɂȂ�p�Y��

		k.BlackCell       = false;	// ���}�X����͂���p�Y��
		k.NumberIsWhite   = false;	// �����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell     = false;	// �A�����f�ւ̃p�Y��
		k.checkBlackCell  = false;	// ��������ō��}�X�̏����`�F�b�N����p�Y��
		k.checkWhiteCell  = false;	// ��������Ŕ��}�X�̏����`�F�b�N����p�Y��

		k.ispzprv3ONLY    = false;	// �ς��Ղ�A�v���b�g�ɂ͑��݂��Ȃ��p�Y��
		k.isKanpenExist   = false;	// pencilbox/�J���y���ɂ���p�Y��

		base.setTitle("�^�^�~�o��","Tatamibari");
		base.setExpression("�@���h���b�O�ŋ��E�����A�E�h���b�O�ŕ⏕�L�������͂ł��܂��B",
						   " Left Button Drag to input border lines, Right to input auxiliary marks.");
		base.setFloatbgcolor("rgb(96, 224, 0)");
	},
	menufix : function(){ },

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
				if(this.btn.Left) this.inputborderans();
				else if(this.btn.Right) this.inputQsubLine();
			}
		};
		mv.mouseup = function(){ };
		mv.mousemove = function(){
			if(k.playmode){
				if(this.btn.Left) this.inputborderans();
				else if(this.btn.Right) this.inputQsubLine();
			}
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.playmode){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputMarks(ca);
		};
		kc.key_inputMarks = function(ca){
			if(k.playmode){ return false;}
			var cc = tc.getTCC();

			if     (ca=='q'||ca=='1'){ bd.sQnC(cc, 1); }
			else if(ca=='w'||ca=='2'){ bd.sQnC(cc, 2); }
			else if(ca=='e'||ca=='3'){ bd.sQnC(cc, 3); }
			else if(ca=='r'||ca=='4'){ bd.sQnC(cc,-1); }
			else if(ca==' '         ){ bd.sQnC(cc,-1); }
			else if(ca=='-'         ){ bd.sQnC(cc,(bd.QnC(cc)!=-2?-2:-1)); }
			else{ return false;}

			pc.paintCell(cc);
			return true;
		};

		if(k.EDITOR){
			kp.kpgenerate = function(mode){
				this.inputcol('num','knumq','q','��');
				this.inputcol('num','knumw','w','��');
				this.inputcol('num','knume','e','��');
				this.insertrow();
				this.inputcol('num','knumr','r',' ');
				this.inputcol('num','knum.','-','?');
				this.inputcol('empty','knumx','','');
				this.insertrow();
			};
			kp.generate(kp.ORIGINAL, true, false, kp.kpgenerate);
			kp.kpinput = function(ca){
				kc.key_inputMarks(ca);
			};
		}

		bd.maxnum = 3;
	},


	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_DLIGHT;
		pc.setBorderColorFunc('qans');

		pc.paint = function(x1,y1,x2,y2){
			this.drawBGCells(x1,y1,x2,y2);
			this.drawDashedGrid(x1,y1,x2,y2);
			this.drawBorders(x1,y1,x2,y2);

			this.drawMarks(x1,y1,x2,y2);

			this.drawQuesHatenas(x1,y1,x2,y2);
			this.drawBorderQsubs(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawTarget(x1,y1,x2,y2);
		};

		pc.drawMarks = function(x1,y1,x2,y2){
			this.vinc('cell_ques', 'crispEdges');

			var lw = Math.max(this.cw/12, 3);	//LineWidth
			var ll = this.cw*0.70;				//LineLength
			var headers = ["c_lp1_", "c_lp2_"];
			g.fillStyle = this.borderQuescolor;

			var clist = bd.cellinside(x1,y1,x2,y2);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				var qn = bd.cell[c].qnum;
				if(qn===1||qn===2){
					if(this.vnop(headers[0]+c,this.NONE)){
						g.fillRect(bd.cell[c].cpx-lw/2, bd.cell[c].cpy-ll/2, lw, ll);
					}
				}
				else{ this.vhide(headers[0]+c);}

				if(qn===1||qn===3){
					if(this.vnop(headers[1]+c,this.NONE)){
						g.fillRect(bd.cell[c].cpx-ll/2, bd.cell[c].cpy-lw/2, ll, lw);
					}
				}
				else{ this.vhide(headers[1]+c);}
			}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type){
			this.decodeTatamibari();
		};
		enc.pzlexport = function(type){
			this.encodeTatamibari();
		};

		enc.decodeTatamibari = function(){
			var c=0, bstr = this.outbstr;
			for(var i=0;i<bstr.length;i++){
				var ca = bstr.charAt(i);

				if     (ca == '.')             { bd.sQnC(c,-2); c++;}
				else if(ca == '1')             { bd.sQnC(c, 2); c++;}
				else if(ca == '2')             { bd.sQnC(c, 3); c++;}
				else if(ca == '3')             { bd.sQnC(c, 1); c++;}
				else if(ca >= 'g' && ca <= 'z'){ c += (parseInt(ca,36)-15);}
				else{ c++;}

				if(c > bd.cellmax){ break;}
			}

			this.outbstr = bstr.substr(i);
		};
		enc.encodeTatamibari = function(){
			var count, pass, i;
			var cm="";
			var pstr="";

			count=0;
			for(i=0;i<bd.cellmax;i++){
				if     (bd.QnC(i) == -2){ pstr = ".";}
				else if(bd.QnC(i) ==  1){ pstr = "3";}
				else if(bd.QnC(i) ==  2){ pstr = "1";}
				else if(bd.QnC(i) ==  3){ pstr = "2";}
				else{ pstr = ""; count++;}

				if(count==0){ cm += pstr;}
				else if(pstr || count==20){ cm+=((15+count).toString(36)+pstr); count=0;}
			}
			if(count>0){ cm+=(15+count).toString(36);}

			this.outbstr += cm;
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			this.decodeCell( function(c,ca){
				if     (ca=="a"){ bd.sQnC(c, 2);}
				else if(ca=="b"){ bd.sQnC(c, 3);}
				else if(ca=="c"){ bd.sQnC(c, 1);}
				else if(ca=="-"){ bd.sQnC(c,-2);}
			});
			this.decodeBorderAns();
		};
		fio.encodeData = function(){
			this.encodeCell( function(c){
				if     (bd.QnC(c)==-2){ return "- ";}
				else if(bd.QnC(c)== 1){ return "c ";}
				else if(bd.QnC(c)== 2){ return "a ";}
				else if(bd.QnC(c)== 3){ return "b ";}
				else                  { return ". ";}
			});
			this.encodeBorderAns();
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkLcntCross(4,0) ){
				this.setAlert('�\���̌����_������܂��B','There is a crossing border lines,'); return false;
			}

			var rinfo = area.getRoomInfo();
			if( !this.checkNoNumber(rinfo) ){
				this.setAlert('�L���̓����Ă��Ȃ��^�^�~������܂��B','A tatami has no marks.'); return false;
			}

			if( !this.checkAllArea(rinfo, f_true, function(w,h,a,n){ return (n!=1||a<=0||(w*h!=a)||w==h);} ) ){
				this.setAlert('�����`�łȂ��^�^�~������܂��B','A tatami is not regular rectangle.'); return false;
			}
			if( !this.checkAllArea(rinfo, f_true, function(w,h,a,n){ return (n!=3||a<=0||(w*h!=a)||w>h);} ) ){
				this.setAlert('�����ł͂Ȃ��^�^�~������܂��B','A tatami is not horizontally long rectangle.'); return false;
			}
			if( !this.checkAllArea(rinfo, f_true, function(w,h,a,n){ return (n!=2||a<=0||(w*h!=a)||w<h);} ) ){
				this.setAlert('�c���ł͂Ȃ��^�^�~������܂��B','A tatami is not vertically long rectangle.'); return false;
			}

			if( !this.checkDoubleNumber(rinfo) ){
				this.setAlert('1�̃^�^�~��2�ȏ�̋L���������Ă��܂��B','A tatami has plural marks.'); return false;
			}

			if( !this.checkAreaRect(rinfo) ){
				this.setAlert('�^�^�~�̌`�������`�ł͂���܂���B','A tatami is not rectangle.'); return false;
			}

			if( !this.checkLcntCross(1,0) ){
				this.setAlert('�r���œr�؂�Ă����������܂��B','There is a dead-end line.'); return false;
			}

			return true;
		};
	}
};
