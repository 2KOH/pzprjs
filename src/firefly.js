//
// �p�Y���ŗL�X�N���v�g�� �z�^���r�[���� firefly.js v3.1.9p1
//

function setting(){
	// �O���[�o���ϐ��̏����ݒ�
	if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
	if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
	k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

	k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
	k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
	k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

	k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
	k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
	k.isborderCross   = 0;	// 1:������������p�Y��
	k.isCenterLine    = 1;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
	k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

	k.dispzero      = 1;	// 1:0��\�����邩�ǂ���
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

	k.fstruct = ["celldirecnum","borderline"];

	//k.def_csize = 36;
	k.def_psize = 16;
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

		if(k.callmode=="pmake"){
			base.setExpression("�@���_�́A�}�E�X�̍��h���b�O���ASHIFT�����Ȃ�����L�[�œ��͂ł��܂��B",
							   " To input black marks, Left Button Drag or Press arrow key with SHIFT key.");
		}
		else{
			base.setExpression("�@���h���b�O�ŋ��E�����A�E�h���b�O�ŕ⏕�L�������͂ł��܂��B",
							   " Left Button Drag to input border lines, Right to input auxiliary marks.");
		}
		base.setTitle("�z�^���r�[��", 'Hotaru Beam'); //'Glow of Fireflies');
		base.setFloatbgcolor("rgb(0, 224, 0)");
	},
	menufix : function(){ },
	postfix : function(){ },

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(k.mode==1) this.inputdirec(x,y);
			else if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};
		mv.mouseup = function(x,y){
			if(k.mode==1 && this.notInputted() && bd.getcnum(this.mouseCell.x,this.mouseCell.y)==this.cellid(new Pos(x,y))) this.inputqnum(x,y,99);
		};
		mv.mousemove = function(x,y){
			if(k.mode==1){
				if(this.notInputted()) this.inputdirec(x,y);
			}
			else if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.mode==3){ return;}
			if(this.key_inputdirec(ca)){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca,99);
		};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(127, 127, 127)";
		pc.fontErrcolor = "black";
		pc.fontsizeratio = 0.85;

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawDashLines(x1,y1,x2,y2);
			this.drawLines(x1,y1,x2,y2);

			this.drawPekes(x1,y1,x2,y2,0);

			this.drawNumCells_firefly(x1,y1,x2,y2);

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};

		pc.drawNumCells_firefly = function(x1,y1,x2,y2){
			var rsize  = k.cwidth*0.40;
			var rsize2 = k.cwidth*0.36;
			var rsize3 = k.cwidth*0.10;

			var clist = this.cellinside(x1-2,y1-2,x2+2,y2+2,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.getQnumCell(c)!=-1){
					var px=bd.cell[c].px()+int(k.cwidth/2), py=bd.cell[c].py()+int(k.cheight/2);

					g.fillStyle = this.Cellcolor;
					g.beginPath();
					g.arc(px, py, rsize , 0, Math.PI*2, false);
					if(this.vnop("c"+c+"_cira_",1)){ g.fill(); }

					if(bd.getErrorCell(c)==1){ g.fillStyle = this.errbcolor1;}
					else{ g.fillStyle = "white";}
					g.beginPath();
					g.arc(px, py, rsize2, 0, Math.PI*2, false);
					if(this.vnop("c"+c+"_cirb_",1)){ g.fill(); }

					this.vdel("c"+c+"_circ_");
					g.fillStyle = this.Cellcolor;
					switch(bd.getDirecCell(c)){
						case  1: py-=(rsize-1); break;
						case  2: py+=(rsize-1); break;
						case  3: px-=(rsize-1); break;
						case  4: px+=(rsize-1); break;
					}
					if(bd.getDirecCell(c)!=0){
						g.beginPath();
						g.arc(px, py, rsize3 , 0, Math.PI*2, false);
						if(this.vnop("c"+c+"_circ_",1)){ g.fill();}
					}
				}
				else{ this.vhide("c"+c+"_cira_"); this.vhide("c"+c+"_cirb_"); this.vdel("c"+c+"_circ_");}

				this.dispnumCell_General(c);
			}
			this.vinc();
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	pzlinput : function(type, bstr){
		if(type==0 || type==1){ bstr = enc.decodeArrowNumber16(bstr);}
	},

	pzloutput : function(type){
		if(type==0)     { document.urloutput.ta.value = enc.getURLbase()+"?"+k.puzzleid+this.pzldata();}
		else if(type==1){ document.urloutput.ta.value = enc.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
		else if(type==3){ document.urloutput.ta.value = enc.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
	},
	pzldata : function(){
		return "/"+k.qcols+"/"+k.qrows+"/"+enc.encodeArrowNumber16();
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	check : function(){

		if( !this.checkLcntCell(3) ){
			ans.setAlert('���򂵂Ă����������܂��B', 'There is a branch line.'); return false;
		}
		if( !this.checkLcntCell(4) ){
			ans.setAlert('�����������Ă��܂��B', 'There is a crossing line.'); return false;
		}

		var saved = this.checkFireflies();
		if( !this.checkErrorFlag(saved,3) ){
			ans.setAlert('���_���m�����Ōq�����Ă��܂��B', 'Black points are connected each other.'); return false;
		}
		if( !this.checkErrorFlag(saved,2) ){
			ans.setAlert('���̋Ȃ������񐔂������ƈ���Ă��܂��B', 'The number of curves is different from a firefly\'s number.'); return false;
		}
		if( !this.checkErrorFlag(saved,1) ){
			ans.setAlert('�����r���œr�؂�Ă��܂��B', 'There is a dead-end line.'); return false;
		}

		ans.performAsLine = true;
		if( !ans.linkBWarea( ans.searchLarea() ) ){
			ans.setAlert('�����S�̂ň�Ȃ���ɂȂ��Ă��܂���B', 'All lines and fireflies are not connected each other.'); return false;
		}

		if( !this.checkLcntCell(1) ){
			ans.setAlert('�����r���œr�؂�Ă��܂��B', 'There is a dead-end line.'); return false;
		}

		if( !this.checkFireflyBeam() ){
			ans.setAlert('�z�^����������o�Ă��܂���B', 'There is a lonely firefly.'); return false;
		}

		if( !this.checkStrangeLine(saved) ){
			ans.setAlert('���ۂ́A���_�łȂ������ǂ������������Ă��܂��B', 'Fireflies are connected without a line starting from black point.'); return false;
		}

		bd.setErrorBorder(bd.borders,0);
		return true;
	},
	check1st : function(){ return true;},

	checkLcntCell : function(val){
		if(ans.lcnts.total[val]==0){ return true;}
		for(var c=0;c<bd.cell.length;c++){
			if(bd.getQnumCell(c)==-1 && ans.lcnts.cell[c]==val){
				bd.setErrorBorder(bd.borders,2);
				ans.setCellLineError(c,false);
				return false;
			}
		}
		return true;
	},
	checkFireflyBeam : function(val){
		if(ans.lcnts.total[val]==0){ return true;}
		for(var c=0;c<bd.cell.length;c++){
			if(bd.getQnumCell(c)!=-1 && bd.getDirecCell(c)!=0){
				if((bd.getDirecCell(c)==1 && bd.getLineBorder(bd.cell[c].ub())!=1) ||
				   (bd.getDirecCell(c)==2 && bd.getLineBorder(bd.cell[c].db())!=1) ||
				   (bd.getDirecCell(c)==3 && bd.getLineBorder(bd.cell[c].lb())!=1) ||
				   (bd.getDirecCell(c)==4 && bd.getLineBorder(bd.cell[c].rb())!=1) )
				{
					bd.setErrorCell([c],1);
					return false;
				}
			}
		}
		return true;
	},
	checkStrangeLine : function(saved){
		var idlist = new Array();
		for(var id=0;id<bd.border.length;id++){
			if(bd.getLineBorder(id)==1 && saved.area.check[id]!=2){ idlist.push(id);}
		}
		if(idlist.length>0){
			bd.setErrorBorder(bd.borders,2);
			bd.setErrorBorder(idlist,1);
			return false;
		}
		return true;
	},

	checkFireflies : function(){
		var saved = {errflag:0,cells:new Array(),idlist:new Array(),area:new AreaInfo()};
		for(var i=0;i<bd.border.length;i++){ saved.area.check[i]=0;}

		for(var c=0;c<bd.cell.length;c++){
			if(bd.getQnumCell(c)==-1 || bd.getDirecCell(c)==0){ continue;}

			var ccnt=0;
			var idlist = new Array();
			var dir=bd.getDirecCell(c);
			var bx=bd.cell[c].cx*2+1, by=bd.cell[c].cy*2+1;
			while(1){
				switch(dir){ case 1: by--; break; case 2: by++; break; case 3: bx--; break; case 4: bx++; break;}
				if((bx+by)%2==0){
					var cc = bd.getcnum(int(bx/2),int(by/2));
					if     (bd.getQnumCell(cc)!=-1){ break;}
					else if(dir!=1 && bd.getLineBorder(bd.getbnum(bx,by+1))==1){ if(dir!=2){ ccnt++;} dir=2;}
					else if(dir!=2 && bd.getLineBorder(bd.getbnum(bx,by-1))==1){ if(dir!=1){ ccnt++;} dir=1;}
					else if(dir!=3 && bd.getLineBorder(bd.getbnum(bx+1,by))==1){ if(dir!=4){ ccnt++;} dir=4;}
					else if(dir!=4 && bd.getLineBorder(bd.getbnum(bx-1,by))==1){ if(dir!=3){ ccnt++;} dir=3;}
				}
				else{
					var id = bd.getbnum(bx,by);
					if(bd.getLineBorder(id)!=1){ break;}
					idlist.push(id);
				}
			}

			for(var i=0;i<idlist.length;i++){ saved.area.check[idlist[i]]=2;}

			var cc = bd.getcnum(int(bx/2),int(by/2));
			if(idlist.length>0 && (bx+by)%2==1 && saved.errflag==0){
				saved = {errflag:1,cells:[c],idlist:idlist,area:saved.area};
			}
			else if(idlist.length>0 && (bx+by)%2==0 && bd.getQnumCell(c)!=-2 && bd.getQnumCell(c)!=ccnt && saved.errflag<=1){
				saved = {errflag:2,cells:[c],idlist:idlist,area:saved.area};
			}
			else if(((bd.getDirecCell(cc)==1 && dir==2) || (bd.getDirecCell(cc)==2 && dir==1) ||
					 (bd.getDirecCell(cc)==3 && dir==4) || (bd.getDirecCell(cc)==4 && dir==3) ) && (bx+by)%2==0 && saved.errflag<=2 )
			{
				saved = {errflag:3,cells:[c,cc],idlist:idlist,area:saved.area};
				return saved;
			}
		}
		return saved;
	},
	checkErrorFlag : function(saved, val){
		if(saved.errflag==val){
			bd.setErrorCell(saved.cells,1);
			bd.setErrorBorder(bd.borders,2);
			bd.setErrorBorder(saved.idlist,1);
			return false;
		}
		return true;
	}
};
