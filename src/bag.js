//
// �p�Y���ŗL�X�N���v�g�� �o�b�O�� bag.js v3.1.9
//

function setting(){
	// �O���[�o���ϐ��̏����ݒ�
	if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
	if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
	k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

	k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
	k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
	k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

	k.isoutsidecross  = 1;	// 1:�O�g���Cross�̔z�u������p�Y��
	k.isoutsideborder = 1;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
	k.isborderCross   = 0;	// 1:������������p�Y��
	k.isCenterLine    = 0;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
	k.isborderAsLine  = 1;	// 1:���E����line�Ƃ��Ĉ���

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

	k.ispzprv3ONLY  = 0;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
	k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

	k.fstruct = ["cellqnum","cellqsub","borderans2"];

	//k.def_csize = 36;
	//k.def_psize = 24;
}

//-------------------------------------------------------------
// Puzzle�ʃN���X�̒�`
Puzzle = function(){
	this.prefix();
};
Puzzle.prototype = {
	prefix : function(){
		this.input_init();
		this.graphic_init();

		base.setTitle("�o�b�O", "BAG");
		base.setExpression("�@���h���b�O�Ő����A�E�N���b�N�ŃZ���̔w�i�F(��/���F)�����͂ł��܂��B",
						   " Left Button Drag to input lines, Right Click to input background color (lime or yellow) of the cell.");
		base.setFloatbgcolor("rgb(160, 0, 0)");
	},
	menufix : function(){ },
	postfix : function(){ },

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(k.mode==1){
				if(!kp.enabled()){ this.inputqnum(x,y,Math.min(99,k.qcols+k.qrows-1));}
				else{ kp.display(x,y);}
			}
			else if(k.mode==3){
				if(this.btn.Left) this.inputborderans(x,y);
				else if(this.btn.Right) this.inputBGcolor(x,y);
			}
		};
		mv.mouseup = function(x,y){ };
		mv.mousemove = function(x,y){
			if(k.mode==3){
				if(this.btn.Left) this.inputborderans(x,y);
				else if(this.btn.Right) this.inputBGcolor(x,y);
			}
		};
		mv.inputBGcolor = function(x,y){
			var cc = this.cellid(new Pos(x,y));
			if(cc==-1 || cc==this.mouseCell){ return;}
			if(this.inputData==-1){
				if     (bd.getQsubCell(cc)==0){ this.inputData=1;}
				else if(bd.getQsubCell(cc)==1){ this.inputData=2;}
				else                          { this.inputData=0;}
			}
			bd.setQsubCell(cc, this.inputData);

			this.mouseCell = cc; 

			pc.paint(bd.cell[cc].cx, bd.cell[cc].cy, bd.cell[cc].cx, bd.cell[cc].cy);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.mode==3){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca,Math.min(99,k.qcols+k.qrows-1));
		};

		if(k.callmode == "pmake"){
			kp.generate(0, true, false, '');
			kp.kpinput = function(ca){
				kc.key_inputqnum(ca,Math.min(99,k.qcols+k.qrows-1));
			};
		}
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(160, 160, 160)";
		if(k.br.IE){ pc.BDlinecolor = "rgb(191, 191, 191)";}

		pc.BorderQanscolor = "rgb(0, 160, 0)";
		pc.fontErrcolor = "red";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawQSubCells(x1,y1,x2,y2);

			this.drawBDline2(x1,y1,x2,y2);
			this.drawBorders(x1,y1,x2,y2);

			this.drawNumbers(x1,y1,x2,y2);

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	pzlinput : function(type, bstr){
		if(type==0 || type==1){ bstr = enc.decodeNumber16(bstr);}
	},
	pzloutput : function(type){
		if(type==0)     { document.urloutput.ta.value = enc.getURLbase()+"?"+k.puzzleid+this.pzldata();}
		else if(type==1){ document.urloutput.ta.value = enc.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
		else if(type==3){ document.urloutput.ta.value = enc.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
	},
	pzldata : function(){
		return "/"+k.qcols+"/"+k.qrows+"/"+enc.encodeNumber16();
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	check : function(){

		if( !ans.checkLcntCross(3,0) ){
			ans.setAlert('���򂵂Ă����������܂��B', 'There is a branch line.'); return false;
		}
		if( !ans.checkLcntCross(4,0) ){
			ans.setAlert('�����������Ă��܂��B', 'There is a crossing line.'); return false;
		}
		if( !ans.checkLcntCross(1,0) ){
			ans.setAlert('�r���œr�؂�Ă����������܂��B', 'There is a dead-end line.'); return false;
		}

		if( !ans.checkOneLoop() ){
			ans.setAlert('�ւ�������ł͂���܂���B','There are two or more loops.'); return false;
		}

		var iarea = this.generateIarea();
		if( !this.checkNumberInside(iarea) ){
			ans.setAlert('�ւ̓����ɓ����Ă��Ȃ�����������܂��B','There is an outside number.'); return false;
		}
		if( !this.checkCellNumber(iarea) ){
			ans.setAlert('�����Ɨւ̓����ɂȂ�4�����̃}�X�̍��v���Ⴂ�܂��B','The number and the sum of the inside cells of four direction is different.'); return false;
		}

		return true;
	},

	generateIarea : function(){
		var area = new AreaInfo();
		var cx, cy;
		area.check[0]=(bd.lcntCross(0,0)==0?-1:1);
		for(cy=0;cy<k.qrows;cy++){
			if(cy>0){ area.check[bd.getcnum(0,cy)]=area.check[bd.getcnum(0,cy-1)]*(bd.getQansBorder(bd.getbnum(1,cy*2))==1?-1:1);}
			for(cx=1;cx<k.qcols;cx++){
				area.check[bd.getcnum(cx,cy)]=area.check[bd.getcnum(cx-1,cy)]*(bd.getQansBorder(bd.getbnum(cx*2,cy*2+1))==1?-1:1);
			}
		}
		return area;
	},
	checkNumberInside : function(area){
		for(var c=0;c<bd.cell.length;c++){
			if(area.check[c]==-1 && bd.getQnumCell(c)!=-1){
				bd.setErrorCell([c],1);
				return false;
			}
		}
		return true;
	},
	checkCellNumber : function(area){
		for(var cc=0;cc<bd.cell.length;cc++){
			if(bd.getQnumCell(cc)<0){ continue;}

			var list = new Array();
			list.push(cc);
			var cnt = 1;
			var tx, ty;
			tx = bd.cell[cc].cx-1; ty = bd.cell[cc].cy;
			while(tx>=0)     { var c=bd.getcnum(tx,ty); if(area.check[c]!=-1){ cnt++; list.push(c); tx--;} else{ break;} }
			tx = bd.cell[cc].cx+1; ty = bd.cell[cc].cy;
			while(tx<k.qcols){ var c=bd.getcnum(tx,ty); if(area.check[c]!=-1){ cnt++; list.push(c); tx++;} else{ break;} }
			tx = bd.cell[cc].cx; ty = bd.cell[cc].cy-1;
			while(ty>=0)     { var c=bd.getcnum(tx,ty); if(area.check[c]!=-1){ cnt++; list.push(c); ty--;} else{ break;} }
			tx = bd.cell[cc].cx; ty = bd.cell[cc].cy+1;
			while(ty<k.qrows){ var c=bd.getcnum(tx,ty); if(area.check[c]!=-1){ cnt++; list.push(c); ty++;} else{ break;} }

			if(bd.getQnumCell(cc)!=cnt){
				bd.setErrorCell(list,1);
				return false;
			}
		}
		return true;
	}
};
