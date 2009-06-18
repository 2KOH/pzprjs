//
// �p�Y���ŗL�X�N���v�g�� ���������� kramma.js v3.2.0
//
Puzzles.kramma = function(){ };
Puzzles.kramma.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 8;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 8;}	// �Ֆʂ̏c��
		k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 1;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
		k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
		k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
		k.isborderCross   = 0;	// 1:������������p�Y��
		k.isCenterLine    = 0;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

		k.dispzero      = 0;	// 1:0��\�����邩�ǂ���
		k.isDispHatena  = 1;	// 1:qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber   = 0;	// 1:�񓚂ɐ�������͂���p�Y��
		k.isArrowNumber = 0;	// 1:������������͂���p�Y��
		k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
		k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
		k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

		k.BlackCell     = 0;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

		k.fstruct = ["cellques41_42","crossnum","borderans"];

		//k.def_csize = 36;
		//k.def_psize = 24;

		base.setTitle("��������","KaitoRamma");
		base.setExpression("�@���h���b�O�ŋ��E�����A�E�h���b�O�ŕ⏕�L�������͂ł��܂��B",
						   " Left Button Drag to input border lines, Right to input auxiliary marks.");
		base.setFloatbgcolor("rgb(96, 96, 96)");
	},
	menufix : function(){ },

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(k.mode==1) this.inputcrossMark(x,y);
			else if(k.mode==3){
				if(this.btn.Left) this.inputborderans(x,y);
				else if(this.btn.Right) this.inputQsubLine(x,y);
			}
		};
		mv.mouseup = function(x,y){
			if(this.notInputted()){
				if(k.mode==1) this.inputQues(x,y,[0,41,42,-2]);
			}
		};
		mv.mousemove = function(x,y){
			if(k.mode==3){
				if(this.btn.Left) this.inputborderans(x,y);
				else if(this.btn.Right) this.inputQsubLine(x,y);
			}
		};
		// �I�[�o�[���C�h
		mv.inputBD = function(x,y,flag){
			var pos = this.crosspos(new Pos(x,y), 0.35);
			if(pos.x==this.mouseCell.x && pos.y==this.mouseCell.y){ return;}

			var id = bd.bnum(pos.x, pos.y);
			if(id==-1 && this.mouseCell.x){ id = bd.bnum(this.mouseCell.x, this.mouseCell.y);}

			if(this.mouseCell!=-1 && id!=-1){
				if((pos.x%2==0 && this.mouseCell.x==pos.x && Math.abs(this.mouseCell.y-pos.y)==1) ||
				   (pos.y%2==0 && this.mouseCell.y==pos.y && Math.abs(this.mouseCell.x-pos.x)==1) )
				{
					this.mouseCell=-1

					if(this.inputData==-1){
						if     (flag==0){ this.inputData=(bd.QUB(id)==0?1:0);}
						else if(flag==1){ this.inputData=(bd.QaB(id)==0?1:0);}
					}

					var idlist = [id];

					var bx1, bx2, by1, by2;
					if(bd.border[id].cx%2==1){
						var x;
						x = bd.border[id].cx; while(x>=0        ){ if(bd.QnX(bd.xnum(mf(x/2)  ,mf(bd.border[id].cy/2)))==1){ x-=2; break;} x-=2;} bx1 = x+2;
						x = bd.border[id].cx; while(x<=2*k.qcols){ if(bd.QnX(bd.xnum(mf(x/2)+1,mf(bd.border[id].cy/2)))==1){ x+=2; break;} x+=2;} bx2 = x-2;
						by1 = by2 = bd.border[id].cy;
					}
					else if(bd.border[id].cy%2==1){
						var y;
						y = bd.border[id].cy; while(y>=0        ){ if(bd.QnX(bd.xnum(mf(bd.border[id].cx/2),mf(y/2)  ))==1){ y-=2; break;} y-=2;} by1 = y+2;
						y = bd.border[id].cy; while(y<=2*k.qrows){ if(bd.QnX(bd.xnum(mf(bd.border[id].cx/2),mf(y/2)+1))==1){ y+=2; break;} y+=2;} by2 = y-2;
						bx1 = bx2 = bd.border[id].cx;
					}
					idlist = [];
					for(var i=bx1;i<=bx2;i+=2){ for(var j=by1;j<=by2;j+=2){ idlist.push(bd.bnum(i,j)); } }

					for(var i=0;i<idlist.length;i++){
						if(flag==0){
							if(this.inputData!=-1){ bd.sQuB(idlist[i], this.inputData); bd.sQaB(idlist[i], 0);}
						}
						else if(flag==1 && bd.QuB(id)==0){
							if     (this.inputData==1){ bd.sQaB(idlist[i], 1); if(k.isborderAsLine){ bd.sQsB(idlist[i], 0);} }
							else if(this.inputData==0){ bd.sQaB(idlist[i], 0);}
						}
						else{ return;}
						pc.paintBorder(idlist[i]);
					}
				}
			}
			this.mouseCell = pos;
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){ };
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(160, 160, 160)";

		pc.BorderQanscolor = "rgb(64, 64, 255)";
		pc.crosssize = 0.15;

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawErrorCells(x1,y1,x2,y2);

			this.drawBDline2(x1,y1,x2,y2);
			this.drawBorders(x1,y1,x2,y2);

			this.drawQueses41_42(x1,y1,x2,y2);
			this.drawCrossMarks(x1,y1,x2+1,y2+1);

			this.drawNumbers(x1,y1,x2,y2);

			this.drawBorderQsubs(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==0 || type==1){
				bstr = this.decodeCrossMark(bstr);
				bstr = this.decodeCircle(bstr);
			}
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			return "/"+k.qcols+"/"+k.qrows+"/"+this.encodeCrossMark()+this.encodeCircle();
		};

		enc.decodeCircle = function(bstr){
			var pos = bstr?Math.min(mf((k.qcols*k.qrows+2)/3), bstr.length):0;
			for(var i=0;i<pos;i++){
				var ca = parseInt(bstr.charAt(i),27);
				for(var w=0;w<3;w++){
					if(i*3+w<k.qcols*k.qrows){
						if     (mf(ca/Math.pow(3,2-w))%3==1){ bd.sQuC(i*3+w,41);}
						else if(mf(ca/Math.pow(3,2-w))%3==2){ bd.sQuC(i*3+w,42);}
					}
				}
			}
			return bstr.substring(pos,bstr.length);
		};
		enc.encodeCircle = function(){
			var cm="", num=0, pass=0;
			for(var i=0;i<bd.cell.length;i++){
				if     (bd.QuC(i)==41){ pass+=(  Math.pow(3,2-num));}
				else if(bd.QuC(i)==42){ pass+=(2*Math.pow(3,2-num));}
				num++; if(num==3){ cm += pass.toString(27); num=0; pass=0;}
			}
			if(num>0){ cm += pass.toString(27);}

			return cm;
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkLcntCross(3,0) ){
				this.setAlert('���򂵂Ă����������܂��B','There is a branched line.'); return false;
			}
			if( !this.checkLcntCross(4,1) ){
				this.setAlert('�������_��Ō������Ă��܂��B','There is a crossing line on the black point.'); return false;
			}
			if( !this.checkLcntCurve() ){
				this.setAlert('�������_�ȊO�ŋȂ����Ă��܂��B','A line curves out of the black points.'); return false;
			}

			rarea = this.searchRarea();
			if( !this.checkNoObjectInRoom(rarea, function(c){ return (bd.QuC(c)!=0?bd.QuC(c):-1);}) ){
				this.setAlert('���ۂ����ۂ��܂܂�Ȃ��̈悪����܂��B','An area has no marks.'); return false;
			}

			if( !this.checkSameObjectInRoom(rarea, function(c){ return (bd.QuC(c)!=0?bd.QuC(c):-1);}) ){
				this.setAlert('���ۂƍ��ۂ������܂܂��̈悪����܂��B','An area has both white and black circles.'); return false;
			}

			if( !this.checkLcntCross(1,0) ){
				this.setAlert('�r���œr�؂�Ă����������܂��B','There is a dead-end line.'); return false;
			}
			if( !this.checkLcntCross(0,1) ){
				this.setAlert('���_�������ʉ߂��Ă��܂���B','No lines on the black point.'); return false;
			}

			return true;
		};

		ans.checkLcntCurve = function(){
			for(var i=0;i<(k.qcols-1)*(k.qrows-1);i++){
				var cx = i%(k.qcols-1)+1;
				var cy = mf(i/(k.qcols-1))+1;
				if(bd.lcntCross(cx, cy)==2 && bd.QnX(bd.xnum(cx, cy))!=1){
					if(    !(bd.QaB(bd.bnum(cx*2  ,cy*2-1))==1 && bd.QaB(bd.bnum(cx*2  ,cy*2+1))==1)
						&& !(bd.QaB(bd.bnum(cx*2-1,cy*2  ))==1 && bd.QaB(bd.bnum(cx*2+1,cy*2  ))==1) )
					{
						this.setCrossBorderError(cx,cy);
						return false;
					}
				}
			}
			return true;
		};
	}
};
