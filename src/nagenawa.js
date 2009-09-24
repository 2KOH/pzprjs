//
// �p�Y���ŗL�X�N���v�g�� �Ȃ��Ȃ�� nagenawa.js v3.2.1
//
Puzzles.nagenawa = function(){ };
Puzzles.nagenawa.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 8;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 8;}	// �Ֆʂ̏c��
		k.irowake = 1;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
		k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
		k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
		k.isborderCross   = 1;	// 1:������������p�Y��
		k.isCenterLine    = 1;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

		k.dispzero      = 1;	// 1:0��\�����邩�ǂ���
		k.isDispHatena  = 1;	// 1:qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber   = 0;	// 1:�񓚂ɐ�������͂���p�Y��
		k.isArrowNumber = 0;	// 1:������������͂���p�Y��
		k.isOneNumber   = 1;	// 1:�����̖��̐�����1��������p�Y��
		k.isDispNumUL   = 1;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
		k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

		k.BlackCell     = 1;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

		k.fstruct = ["arearoom","cellqnum","borderline","cellqsub"];

		//k.def_csize = 36;
		//k.def_psize = 24;

		base.setTitle("�Ȃ��Ȃ�","Nagenawa");
		base.setExpression("�@�h���b�O�Ő����A�}�X�̃N���b�N�Ł��~(�⏕�L��)�����͂ł��܂��B",
						   " Left Button Drag to input lines, Click to input auxiliary marks.");
		base.setFloatbgcolor("rgb(0, 127, 0)");
	},
	menufix : function(){
		menu.addRedLineToFlags();
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(kc.isZ ^ menu.getVal('dispred')){ this.dispRedLine(x,y); return;}
			if(k.mode==1) this.inputborder(x,y);
			else if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
			}
		};
		mv.mouseup = function(x,y){
			if(this.notInputted()){
				if(k.mode==1){
					if(!kp.enabled()){ this.inputqnum(x,y,99);}
					else{ kp.display(x,y);}
				}
				else if(k.mode==3) this.inputMB(x,y);
			}
		};
		mv.mousemove = function(x,y,e){
			if(k.mode==1) this.inputborder(x,y);
			else if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
			}
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(ca=='z' && !this.keyPressed){ this.isZ=true; return;}
			if(k.mode==3){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca,99);
		};
		kc.keyup = function(ca){ if(ca=='z'){ this.isZ=false;}};
		kc.isZ = false;

		if(k.callmode == "pmake"){
			kp.generate(0, true, false, '');
			kp.kpinput = function(ca){
				kc.key_inputqnum(ca,99);
			};
		}
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(191, 191, 191)";
		pc.MBcolor = "rgb(63, 160, 255)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawErrorCells(x1,y1,x2,y2);

			this.drawNumbers(x1,y1,x2,y2);

			this.drawBDline2(x1,y1,x2,y2);
			this.drawBorders(x1,y1,x2,y2);

		//	this.drawPekes(x1,y1,x2,y2,0);
			this.drawMBs(x1,y1,x2,y2);
			this.drawLines(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==0 || type==1){
				bstr = this.decodeBorder(bstr);
				bstr = this.decodeRoomNumber16(bstr);
			}
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			return "/"+k.qcols+"/"+k.qrows+"/"+this.encodeBorder()+this.encodeRoomNumber16();
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			var cnt=0;
			for(var i=0;i<bd.border.length;i++){ if(bd.LiB(i)==1){ cnt++;} }
			if( cnt==0 ){ this.setAlert('����������Ă��܂���B','There is no line on the board.'); return false;}

			var rarea = this.searchRarea();
			if( !this.checkOneNumber(rarea, function(top,lcnt){ return (top>=0 && top<lcnt);}, function(cc){ return this.lcnts.cell[cc]>0;}.bind(this)) ){
				this.setAlert('�����̂��镔���Ɛ����ʉ߂���}�X�̐����Ⴂ�܂��B','The number of the cells that is passed any line in the room and the number written in the room is diffrerent.'); return false;
			}

			if( !this.checkLcntCell(3) ){
				this.setAlert('���򂵂Ă����������܂��B','There is a branch line.'); return false;
			}
			if( !this.checkLcntCell(1) ){
				this.setAlert('�r���œr�؂�Ă����������܂��B', 'There is a dead-end line.'); return false;
			}

			if( !this.checkOneNumber(rarea, function(top,lcnt){ return (top>=0 && top>lcnt);}, function(cc){ return this.lcnts.cell[cc]>0;}.bind(this)) ){
				this.setAlert('�����̂��镔���Ɛ����ʉ߂���}�X�̐����Ⴂ�܂��B','The number of the cells that is passed any line in the room and the number written in the room is diffrerent.'); return false;
			}

			if( !this.checkAllLoopRect() ){
				this.setAlert('�����`�������`�łȂ��ւ���������܂��B','There is a non-rectangle loop.'); return false;
			}

			return true;
		};

		ans.checkAllLoopRect = function(){
			var xarea = this.searchXarea();
			for(var r=1;r<=xarea.max;r++){
				if(!this.isLoopRect(xarea.room[r])){
					bd.sErB(bd.borders,2);
					bd.sErB(xarea.room[r],1);
					return false;
				}
			}
			return true;
		};
		ans.isLoopRect = function(list){
			var x1=2*k.qcols; var x2=0; var y1=2*k.qrows; var y2=0;
			for(var i=0;i<list.length;i++){
				if(x1>bd.border[list[i]].cx){ x1=bd.border[list[i]].cx;}
				if(x2<bd.border[list[i]].cx){ x2=bd.border[list[i]].cx;}
				if(y1>bd.border[list[i]].cy){ y1=bd.border[list[i]].cy;}
				if(y2<bd.border[list[i]].cy){ y2=bd.border[list[i]].cy;}
			}
			for(var i=0;i<list.length;i++){
				if(bd.border[list[i]].cx!=x1 && bd.border[list[i]].cx!=x2 && bd.border[list[i]].cy!=y1 && bd.border[list[i]].cy!=y2){ return false;}
			}
			return true;
		};
	}
};
