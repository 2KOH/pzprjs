//
// �p�Y���ŗL�X�N���v�g�� �V���N�������N�� wblink.js v3.3.0
//
Puzzles.wblink = function(){ };
Puzzles.wblink.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 8;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 8;}	// �Ֆʂ̏c��
		k.irowake  = 0;		// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross  = 0;		// 1:�Ֆʓ�����Cross������p�Y�� 2:�O�g����܂߂�Cross������p�Y��
		k.isborder = 1;		// 1:Border/Line������\�ȃp�Y�� 2:�O�g�������\�ȃp�Y��
		k.isexcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isLineCross     = false;	// ������������p�Y��
		k.isCenterLine    = true;	// �}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = false;	// ���E����line�Ƃ��Ĉ���
		k.hasroom         = false;	// �������̗̈�ɕ�����Ă���/������p�Y��
		k.roomNumber      = false;	// �����̖��̐�����1��������p�Y��

		k.dispzero        = false;	// 0��\�����邩�ǂ���
		k.isDispHatena    = true;	// qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber     = false;	// �񓚂ɐ�������͂���p�Y��
		k.NumberWithMB    = false;	// �񓚂̐����Ɓ��~������p�Y��
		k.linkNumber      = false;	// �������ЂƂȂ���ɂȂ�p�Y��

		k.BlackCell       = false;	// ���}�X����͂���p�Y��
		k.NumberIsWhite   = false;	// �����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell     = false;	// �A�����f�ւ̃p�Y��
		k.checkBlackCell  = false;	// ��������ō��}�X�̏����`�F�b�N����p�Y��
		k.checkWhiteCell  = false;	// ��������Ŕ��}�X�̏����`�F�b�N����p�Y��

		k.ispzprv3ONLY    = true;	// �ς��Ղ�A�v���b�g�ɂ͑��݂��Ȃ��p�Y��
		k.isKanpenExist   = false;	// pencilbox/�J���y���ɂ���p�Y��

		k.bdmargin       = 0.50;	// �g�O�̈�ӂ�margin(�Z�������Z)
		k.bdmargin_image = 0.10;	// �摜�o�͎���bdmargin�l

		base.setTitle("�V���N�������N","Shirokuro-link");
		base.setExpression("�@���h���b�O�Ő����A�E�N���b�N�Ł~�����͂ł��܂��B",
						   " Left Button Drag to input black cells, Right Click to input a cross.");
		base.setFloatbgcolor("rgb(127, 191, 0)");
	},
	menufix : function(){ },

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if(k.editmode) this.inputQues([0,41,42,-2]);
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
			if(this.inputData==2){ return;}
			var pos = this.borderpos(0);
			if(pos.x==this.mouseCell.x && pos.y==this.mouseCell.y){ return;}

			var id = -1;
			if     (pos.y-this.mouseCell.y==-2){ id=bd.bnum(this.mouseCell.x  ,this.mouseCell.y-1);}
			else if(pos.y-this.mouseCell.y== 2){ id=bd.bnum(this.mouseCell.x  ,this.mouseCell.y+1);}
			else if(pos.x-this.mouseCell.x==-2){ id=bd.bnum(this.mouseCell.x-1,this.mouseCell.y  );}
			else if(pos.x-this.mouseCell.x== 2){ id=bd.bnum(this.mouseCell.x+1,this.mouseCell.y  );}

			if(this.mouseCell!=-1 && id!=-1){
				var idlist = this.getidlist(id);
				if(this.inputData==-1){ this.inputData=(bd.isLine(id)?0:1);}
				if(this.inputData> 0 && ((pos.x-this.mouseCell.x==-2)||(pos.y-this.mouseCell.y==-2))){ idlist=idlist.reverse();} // �F�����̓s����̏���
				for(var i=0;i<idlist.length;i++){
					if(idlist[i]===-1){ continue;}
					if(this.inputData==1){ bd.setLine(idlist[i]);}
					else                 { bd.removeLine(idlist[i]);}
					pc.paintLine(idlist[i]);
				}
				this.inputData=2;
			}
			this.mouseCell = pos;
		};
		mv.getidlist = function(id){
			var idlist=[], bx=bd.border[id].bx, by=bd.border[id].by;
			if(bd.border[id].bx&1){
				var by1=by, by2=by;
				while(by1>bd.minby && bd.QuC(bd.cnum(bx,by1-1))===0){ by1-=2;}
				while(by2<bd.maxby && bd.QuC(bd.cnum(bx,by2+1))===0){ by2+=2;}
				if(bd.minby<by1 && by2<bd.maxby){
					for(by=by1;by<=by2;by+=2){ idlist.push(bd.bnum(bx,by)); }
				}
			}
			else if(bd.border[id].by&1){
				var bx1=bx, bx2=bx;
				while(bx1>bd.minbx && bd.QuC(bd.cnum(bx1-1,by))===0){ bx1-=2;}
				while(bx2<bd.maxbx && bd.QuC(bd.cnum(bx2+1,by))===0){ bx2+=2;}
				if(bd.minbx<bx1 && bx2<bd.maxbx){
					for(bx=bx1;bx<=bx2;bx+=2){ idlist.push(bd.bnum(bx,by)); }
				}
			}
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

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.playmode){ return;}
			if(this.moveTCell(ca)){ return;}
			this.input41_42(ca);
		};
		kc.input41_42 = function(ca){
			if(k.playmode){ return false;}

			var cc = tc.getTCC();
			var flag = false;

			if     (ca=='1'){ bd.sQuC(cc,(bd.QuC(cc)!=41?41:0)); flag = true;}
			else if(ca=='2'){ bd.sQuC(cc,(bd.QuC(cc)!=42?42:0)); flag = true;}
			else if(ca=='-'){ bd.sQuC(cc,(bd.QuC(cc)!=-2?-2:0)); flag = true;}
			else if(ca=='3'||ca==" "){ bd.sQuC(cc,0); flag = true;}

			if(flag){ pc.paintCell(cc);}
			return flag;
		};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_THIN;
		pc.errbcolor1 = "white";
		pc.circleratio = [0.35, 0.30];
		pc.chassisflag = false;

		// ���̑�����ʏ��菭����������
		pc.lwratio = 8;

		pc.paint = function(x1,y1,x2,y2){
			this.drawGrid(x1,y1,x2,y2,(k.editmode && !this.fillTextPrecisely));

			this.drawPekes(x1,y1,x2,y2,0);
			this.drawLines(x1,y1,x2,y2);

			this.drawCircles41_42(x1-2,y1-2,x2+1,y2+1);
			this.drawQuesHatenas(x1-2,y1-2,x2+1,y2+1);

			this.drawTarget(x1,y1,x2,y2);
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type){
			this.decodeCircle41_42();
		};
		enc.pzlexport = function(type){
			this.encodeCircle41_42();
		};

		//---------------------------------------------------------
		fio.decodeData = function(array){
			this.decodeCellQues41_42();
			this.decodeBorderLine();
		};
		fio.encodeData = function(){
			this.encodeCellQues41_42();
			this.encodeBorderLine();
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkLcntCell(4) ){
				this.setAlert('�����������Ă��܂��B','There is a crossing line.'); return false;
			}

			var linfo = line.getLareaInfo();
			if( !this.checkAllArea(linfo, function(c){ return (bd.QuC(c)!=0);}, function(w,h,a,n){ return (a<3);}) ){
				this.setAlert('3�ȏ�́����q�����Ă��܂��B','Three or more objects are connected.'); return false;
			}

			if( !this.checkWBcircle(linfo, 41) ){
				this.setAlert('���ۓ��m���q�����Ă��܂��B','Two white circles are connected.'); return false;
			}
			if( !this.checkWBcircle(linfo, 42) ){
				this.setAlert('���ۓ��m���q�����Ă��܂��B','Two black circles are connected.'); return false;
			}

			if( !this.checkAllCell(function(c){ return (bd.QuC(c)!=0 && line.lcntCell(c)==0);} ) ){
				this.setAlert('����������o�Ă��܂���B','A circle doesn\'t start any line.'); return false;
			}

			return true;
		};
		ans.check1st = function(){ return true;};

		ans.checkWBcircle = function(linfo,val){
			var result = true;
			for(var r=1;r<=linfo.max;r++){
				if(linfo.room[r].idlist.length<=1){ continue;}

				var tip1 = linfo.room[r].idlist[0];
				var tip2 = linfo.room[r].idlist[linfo.room[r].idlist.length-1];
				if(bd.QuC(tip1)!==val || bd.QuC(tip2)!==val){ continue;}

				if(this.inAutoCheck){ return false;}
				if(result){ bd.sErBAll(2);}
				ans.setErrLareaById(linfo,r,1);
				bd.sErC([tip1,tip2],1);
				result = false;
			}
			return result;
		};
	}
};
