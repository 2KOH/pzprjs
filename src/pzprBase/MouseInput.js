// MouseInput.js v3.2.3

//---------------------------------------------------------------------------
// ��MouseEvent�N���X �}�E�X���͂Ɋւ�����̕ێ��ƃC�x���g����������
//---------------------------------------------------------------------------
// �p�Y������ �}�E�X���͕�
// MouseEvent�N���X���`
var MouseEvent = function(){
	this.inputX;
	this.inputY;
	this.mouseCell;
	this.inputData;
	this.firstPos;
	this.btn = {};
	this.mousereset();

	this.enableInputHatena = !!k.isDispHatena;
	this.inputQuesDirectly = false;

	this.docEL  = document.documentElement;
	this.bodyEL = document.body;
};
MouseEvent.prototype = {
	//---------------------------------------------------------------------------
	// mv.mousereset() �}�E�X���͂Ɋւ����������������
	//---------------------------------------------------------------------------
	mousereset : function(){
		this.inputX = -1;
		this.inputY = -1;
		this.mouseCell = -1;
		this.inputData = -1;
		this.firstPos = new Pos(-1, -1);
		this.btn = { Left:false, Middle:false, Right:false};
	},

	//---------------------------------------------------------------------------
	// mv.e_mousedown() Canvas��Ń}�E�X�̃{�^�����������ۂ̃C�x���g���ʏ���
	// mv.e_mouseup()   Canvas��Ń}�E�X�̃{�^����������ۂ̃C�x���g���ʏ���
	// mv.e_mousemove() Canvas��Ń}�E�X�𓮂������ۂ̃C�x���g���ʏ���
	// mv.e_mouseout()  �}�E�X�J�[�\�����E�B���h�E���痣�ꂽ�ۂ̃C�x���g���ʏ���
	//---------------------------------------------------------------------------
	//�C�x���g�n���h������Ăяo�����
	// ����3�̃}�E�X�C�x���g��Canvas����Ăяo�����(mv��bind���Ă���)
	e_mousedown : function(e){
		if(!k.enableMouse){ return;}

		this.setButtonFlag(e);
		// SHIFT�L�[�������Ă��鎞�͍��E�{�^�����]
		if(((kc.isSHIFT)^menu.getVal('lrcheck'))&&(this.btn.Left^this.btn.Right)){
			this.btn.Left = !this.btn.Left; this.btn.Right = !this.btn.Right;
		}
		if(this.btn.Middle){ this.modeflip(); return;} //���{�^��

		if(ans.errDisp){ bd.errclear();}
		um.newOperation(true);
		this.setposition(e);
		this.mousedown();	// �e�p�Y���̃��[�`����
		return false;
	},
	e_mouseup   : function(e){
		if(!k.enableMouse || this.btn.Middle || (!this.btn.Left && !this.btn.Right)){ return;}
		um.newOperation(false);
		this.setposition(e);
		this.mouseup();		// �e�p�Y���̃��[�`����
		this.mousereset();
		return false;
	},
	e_mousemove : function(e){
		if(!k.enableMouse || this.btn.Middle || (!this.btn.Left && !this.btn.Right)){ return;}
		um.newOperation(false);
		this.setposition(e);
		this.mousemove();	// �e�p�Y���̃��[�`����
	},
	e_mouseout : function(e) {
//		if (k.br.IE){ var e=window.event;}
//		this.mousereset();
		um.newOperation(false);
	},

	//---------------------------------------------------------------------------
	// mv.mousedown() Canvas��Ń}�E�X�̃{�^�����������ۂ̃C�x���g�����B�e�p�Y���̃t�@�C���ŃI�[�o�[���C�h�����B
	// mv.mouseup()   Canvas��Ń}�E�X�̃{�^����������ۂ̃C�x���g�����B�e�p�Y���̃t�@�C���ŃI�[�o�[���C�h�����B
	// mv.mousemove() Canvas��Ń}�E�X�𓮂������ۂ̃C�x���g�����B�e�p�Y���̃t�@�C���ŃI�[�o�[���C�h�����B
	//---------------------------------------------------------------------------
	//�I�[�o�[���C�h�p
	mousedown : function(){ },
	mouseup   : function(){ },
	mousemove : function(){ },

	//---------------------------------------------------------------------------
	// mv.setButtonFlag() ��/��/�E�{�^����������Ă��邩�ݒ肷��
	//---------------------------------------------------------------------------
	setButtonFlag : (
		((k.br.IE) ?
			function(e){ this.btn = { Left:(e.button===1), Middle:(e.button===4), Right:(e.button===2)};}
		:(k.br.WinWebKit) ?
			function(e){ this.btn = { Left:(e.button===0), Middle:(e.button===1), Right:(e.button===2)};}
		:(k.br.WebKit) ?
			function(e){
				this.btn = { Left:(e.which===1 && !e.metaKey), Middle:false, Right:(e.which===1 && !!e.metaKey) };
			}
		:
			function(e){
				this.btn = (!!e.which ? { Left:(e.which ===1), Middle:(e.which ===2), Right:(e.which ===3)}
									  : { Left:(e.button===0), Middle:(e.button===1), Right:(e.button===2)});
			}
		)
	),

	//---------------------------------------------------------------------------
	// mv.setposition()   �C�x���g���N���������W��inputX, inputY�ϐ��ɑ��
	// mv.notInputted()   �Ֆʂւ̓��͂��s��ꂽ���ǂ������肷��
	// mv.modeflip()      ���{�^���Ń��[�h��ύX����Ƃ��̏���
	//---------------------------------------------------------------------------
	setposition : (
		((k.br.WinWebKit) ?
			function(e){
				this.inputX = e.pageX-1 -k.cv_oft.x-k.p0.x-k.IEMargin.x;
				this.inputY = e.pageY-1 -k.cv_oft.y-k.p0.y-k.IEMargin.y;
			}
		:(!k.br.IE) ?
			function(e){
				this.inputX = e.pageX   -k.cv_oft.x-k.p0.x-k.IEMargin.x;
				this.inputY = e.pageY   -k.cv_oft.y-k.p0.y-k.IEMargin.y;
			}
		:
			function(e){
				this.inputX = e.clientX + (this.docEL.scrollLeft || this.bodyEL.scrollLeft) -k.cv_oft.x-k.p0.x-k.IEMargin.x;
				this.inputY = e.clientY + (this.docEL.scrollTop  || this.bodyEL.scrollTop ) -k.cv_oft.y-k.p0.y-k.IEMargin.y;
			}
		)
	),

	notInputted : function(){ return !um.changeflag;},
	modeflip    : function(){ if(k.EDITOR){ menu.setVal('mode', (k.playmode?1:3));} },

	// ���ʊ֐�
	//---------------------------------------------------------------------------
	// mv.cellid()   ���͂��ꂽ�ʒu���ǂ̃Z����ID�ɊY�����邩��Ԃ�
	// mv.crossid()  ���͂��ꂽ�ʒu���ǂ̌����_��ID�ɊY�����邩��Ԃ�
	// mv.cellpos()  ���͂��ꂽ�ʒu�����z�Z����łǂ���(X,Y)�ɊY�����邩��Ԃ�
	// mv.crosspos() ���͂��ꂽ�ʒu�����z�Z����łǂ���(X*2,Y*2)�ɊY�����邩��Ԃ��B
	//               �O�g�̍��オ(0,0)�ŉE����(k.qcols*2,k.qrows*2)�Brc��0�`0.5�̃p�����[�^�B
	// mv.borderid() ���͂��ꂽ�ʒu���ǂ̋��E���ELine��ID�ɊY�����邩��Ԃ�(�N���b�N�p)
	//---------------------------------------------------------------------------
	cellid : function(){
		var pos = this.cellpos();
		if(this.inputX%k.cwidth==0 || this.inputY%k.cheight==0){ return -1;} // �҂�����͖���
		return bd.cnum(pos.x,pos.y);
	},
	crossid : function(){
		var pos = this.crosspos(0.5);
		return bd.xnum(mf(pos.x/2),mf(pos.y/2));
	},
	cellpos : function(){	// crosspos(p,0)�ł���ւ͂ł���
		return new Pos(mf(this.inputX/k.cwidth), mf(this.inputY/k.cheight));
	},
	crosspos : function(rc){
		var pm = rc*k.cwidth;
		var cx = mf((this.inputX+pm)/k.cwidth), cy = mf((this.inputY+pm)/k.cheight);
		var dx = (this.inputX+pm)%k.cwidth,     dy = (this.inputY+pm)%k.cheight;

		return new Pos(cx*2+(dx<2*pm?0:1), cy*2+(dy<2*pm?0:1));
	},

	borderid : function(spc){
		var cx = mf(this.inputX/k.cwidth), cy = mf(this.inputY/k.cheight);
		var dx = this.inputX%k.cwidth,     dy = this.inputY%k.cheight;
		if(k.isLineCross){
			if(!k.isborderAsLine){
				var m1=spc*k.cwidth, m2=(1-spc)*k.cwidth;
				if((dx<m1||m2<dx) && (dy<m1||m2<dy)){ return -1;}
			}
			else{
				var m1=(0.5-spc)*k.cwidth, m2=(0.5+spc)*k.cwidth;
				if(m1<dx && dx<m2 && m1<dy && dy<m2){ return -1;}
			}
		}

		if(dx<k.cwidth-dy){	//����
			if(dx>dy){ return bd.bnum(2*cx+1,2*cy  );}	//�E��
			else     { return bd.bnum(2*cx  ,2*cy+1);}	//����
		}
		else{	//�E��
			if(dx>dy){ return bd.bnum(2*cx+2,2*cy+1);}	//�E��
			else     { return bd.bnum(2*cx+1,2*cy+2);}	//����
		}
		return -1;
	},

	//---------------------------------------------------------------------------
	// mv.inputcell() Cell��qans(�񓚃f�[�^)��0/1/2�̂����ꂩ����͂���B
	// mv.decIC()     0/1/2�ǂ����͂��ׂ��������肷��B
	//---------------------------------------------------------------------------
	inputcell : function(){
		var cc = this.cellid();
		if(cc==-1 || cc==this.mouseCell){ return;}
		if(this.inputData==-1){ this.decIC(cc);}

		this.mouseCell = cc; 

		if(k.NumberIsWhite==1 && bd.QnC(cc)!=-1 && (this.inputData==1||(this.inputData==2 && pc.bcolor=="white"))){ return;}
		if(k.RBBlackCell==1 && this.inputData==1){
			if(this.firstPos.x == -1 && this.firstPos.y == -1){ this.firstPos = new Pos(bd.cell[cc].cx, bd.cell[cc].cy);}
			if((this.firstPos.x+this.firstPos.y) % 2 != (bd.cell[cc].cx+bd.cell[cc].cy) % 2){ return;}
		}

		(this.inputData==1?bd.setBlack:bd.setWhite).apply(bd,[cc]);
		bd.sQsC(cc, (this.inputData==2?1:0));

		pc.paintCell(cc);
	},
	decIC : function(cc){
		if(menu.getVal('use')==1){
			if(this.btn.Left){ this.inputData=(bd.isWhite(cc) ? 1 : 0); }
			else if(this.btn.Right){ this.inputData=((bd.QsC(cc)!=1) ? 2 : 0); }
		}
		else if(menu.getVal('use')==2){
			if(this.btn.Left){
				if(bd.isBlack(cc)) this.inputData=2;
				else if(bd.QsC(cc) == 1) this.inputData=0;
				else this.inputData=1;
			}
			else if(this.btn.Right){
				if(bd.isBlack(cc)) this.inputData=0;
				else if(bd.QsC(cc) == 1) this.inputData=1;
				else this.inputData=2;
			}
		}
	},
	//---------------------------------------------------------------------------
	// mv.inputqnum()  Cell��qnum(��萔���f�[�^)�ɐ�������͂���B
	// mv.inputqnum1() Cell��qnum(��萔���f�[�^)�ɐ�������͂���B
	// mv.inputqnum3() Cell��qans(��萔���f�[�^)�ɐ�������͂���B
	//---------------------------------------------------------------------------
	inputqnum : function(){
		var cc = this.cellid();
		if(cc===-1 || cc===this.mouseCell){ return;}

		if(cc===tc.getTCC()){
			cc =(k.playmode ?
					(k.NumberWithMB ?
						this.inputqnum3withMB(cc)
					:
						this.inputqnum3(cc)
					)
				:
					this.inputqnum1(cc)
				);
		}
		else{
			var cc0 = tc.getTCC();
			tc.setTCC(cc);

			pc.paint(bd.cell[cc0].cx-1, bd.cell[cc0].cy-1, bd.cell[cc0].cx, bd.cell[cc0].cy);
		}
		this.mouseCell = cc;

		pc.paint(bd.cell[cc].cx-1, bd.cell[cc].cy-1, bd.cell[cc].cx, bd.cell[cc].cy);
	},
	inputqnum1 : function(cc){
		if(k.isOneNumber){ cc = area.getTopOfRoomByCell(cc);}
		var max = bd.nummaxfunc(cc);

		if(this.btn.Left){
			if(bd.QnC(cc)===max){ bd.sQnC(cc,-1);}
			else if(bd.QnC(cc)===-1){ bd.sQnC(cc,(this.enableInputHatena?-2:(k.dispzero?0:1)));}
			else if(bd.QnC(cc)===-2){ bd.sQnC(cc,(k.dispzero?0:1));}
			else{ bd.sQnC(cc,bd.QnC(cc)+1);}
		}
		else if(this.btn.Right){
			if(bd.QnC(cc)===-1){ bd.sQnC(cc,max);}
			else if(bd.QnC(cc)===-2){ bd.sQnC(cc,-1);}
			else if(bd.QnC(cc)===(k.dispzero?0:1)){ bd.sQnC(cc,(this.enableInputHatena?-2:-1));}
			else{ bd.sQnC(cc,bd.QnC(cc)-1);}
		}
		if(bd.QnC(cc)!=-1 && k.NumberIsWhite){ bd.sQaC(cc,-1); if(pc.bcolor=="white"){ bd.sQsC(cc,0);} }
		if(k.isAnsNumber){ bd.sQaC(cc,-1); bd.sQsC(cc,0);}

		return cc;
	},
	inputqnum3 : function(cc){
		if(bd.QnC(cc)!==-1){ return cc;}
		var max = bd.nummaxfunc(cc);
		bd.sDiC(cc,0);

		if(this.btn.Left){
			if     (bd.QaC(cc)===max){ bd.sQaC(cc,-1);              }
			else if(bd.QaC(cc)===-1) { bd.sQaC(cc,(k.dispzero?0:1));}
			else                     { bd.sQaC(cc,bd.QaC(cc)+1);    }
		}
		else if(this.btn.Right){
			if     (bd.QaC(cc)===-1)              { bd.sQaC(cc,max);}
			else if(bd.QaC(cc)===(k.dispzero?0:1)){ bd.sQaC(cc,-1); }
			else                                  { bd.sQaC(cc,bd.QaC(cc)-1);}
		}
		return cc;
	},
	inputqnum3withMB : function(cc){
		if(bd.QnC(cc)!==-1){ return cc;}
		var max = bd.nummaxfunc(cc);

		if(this.btn.Left){
			if     (bd.QaC(cc)===max){ bd.sQaC(cc,-1); bd.sQsC(cc,1);}
			else if(bd.QsC(cc)===1)  { bd.sQaC(cc,-1); bd.sQsC(cc,2);}
			else if(bd.QsC(cc)===2)  { bd.sQaC(cc,-1); bd.sQsC(cc,0);}
			else if(bd.QaC(cc)===-1) { bd.sQaC(cc,(k.dispzero?0:1)); }
			else                     { bd.sQaC(cc,bd.QaC(cc)+1);     }
		}
		else if(this.btn.Right){
			if     (bd.QsC(cc)===1) { bd.sQaC(cc,max); bd.sQsC(cc,0);}
			else if(bd.QsC(cc)===2) { bd.sQaC(cc,-1);  bd.sQsC(cc,1);}
			else if(bd.QaC(cc)===-1){ bd.sQaC(cc,-1);  bd.sQsC(cc,2);}
			else if(bd.QaC(cc)===(k.dispzero?0:1)){ bd.sQaC(cc,-1);  }
			else                    { bd.sQaC(cc,bd.QaC(cc)-1);      }
		}
		return cc;
	},

	//---------------------------------------------------------------------------
	// mv.inputQues() Cell��ques�f�[�^��array�̂Ƃ���ɓ��͂���
	//---------------------------------------------------------------------------
	inputQues : function(array){
		var cc = this.cellid();
		if(cc==-1){ return;}

		var flag=false;
		if(cc!=tc.getTCC() && !this.inputQuesDirectly){
			var cc0 = tc.getTCC();
			tc.setTCC(cc);
			pc.paint(bd.cell[cc0].cx-1, bd.cell[cc0].cy-1, bd.cell[cc0].cx, bd.cell[cc0].cy);
			flag = true;
		}
		else{
			if(this.btn.Left){
				for(var i=0;i<array.length-1;i++){
					if(!flag && bd.QuC(cc)==array[i]){ bd.sQuC(cc,array[i+1]); flag=true;}
				}
				if(!flag && bd.QuC(cc)==array[array.length-1]){ bd.sQuC(cc,array[0]); flag=true;}
			}
			else if(this.btn.Right){
				for(var i=array.length;i>0;i--){
					if(!flag && bd.QuC(cc)==array[i]){ bd.sQuC(cc,array[i-1]); flag=true;}
				}
				if(!flag && bd.QuC(cc)==array[0]){ bd.sQuC(cc,array[array.length-1]); flag=true;}
			}
		}

		if(flag){ pc.paintCell(cc);}
	},

	//---------------------------------------------------------------------------
	// mv.inputMB()   Cell��qsub(�⏕�L��)�́�, �~�f�[�^����͂���
	//---------------------------------------------------------------------------
	inputMB : function(){
		var cc = this.cellid();
		if(cc==-1){ return;}

		if(this.btn.Left){
			if     (bd.QsC(cc)==0){ bd.sQsC(cc, 1);}
			else if(bd.QsC(cc)==1){ bd.sQsC(cc, 2);}
			else{ bd.sQsC(cc, 0);}
		}
		else if(this.btn.Right){
			if     (bd.QsC(cc)==0){ bd.sQsC(cc, 2);}
			else if(bd.QsC(cc)==2){ bd.sQsC(cc, 1);}
			else{ bd.sQsC(cc, 0);}
		}
		pc.paintCell(cc);
	},

	//---------------------------------------------------------------------------
	// mv.inputdirec() Cell��direc(����)�̃f�[�^����͂���
	//---------------------------------------------------------------------------
	inputdirec : function(){
		var pos = this.cellpos();
		if(pos.x==this.mouseCell.x && pos.y==this.mouseCell.y){ return;}

		var inp = 0;
		var cc = bd.cnum(this.mouseCell.x, this.mouseCell.y);
		if(cc!=-1 && bd.QnC(cc)!=-1){
			if     (pos.y-this.mouseCell.y==-1){ inp=k.UP;}
			else if(pos.y-this.mouseCell.y== 1){ inp=k.DN;}
			else if(pos.x-this.mouseCell.x==-1){ inp=k.LT;}
			else if(pos.x-this.mouseCell.x== 1){ inp=k.RT;}
			else{ return;}

			bd.sDiC(cc, (bd.DiC(cc)!=inp?inp:0));

			pc.paintCell(cc);
		}
		this.mouseCell = pos;
	},

	//---------------------------------------------------------------------------
	// mv.inputtile()  ���^�C���A���^�C������͂���
	//---------------------------------------------------------------------------
	inputtile : function(){
		var cc = this.cellid();
		if(cc==-1 || cc==this.mouseCell || bd.QuC(cc)==51){ return;}
		if(this.inputData==-1){ this.decIC(cc);}

		this.mouseCell = cc; 
		var areaid = area.getRoomID(cc);

		for(var i=0;i<area.room[areaid].clist.length;i++){
			var c = area.room[areaid].clist[i];
			if(this.inputData==1 || bd.QsC(c)!=3){
				(this.inputData==1?bd.setBlack:bd.setWhite).apply(bd,[c]);
				bd.sQsC(c, (this.inputData==2?1:0));
			}
		}
		var d = ans.getSizeOfClist(area.room[areaid].clist,f_true);

		pc.paint(d.x1, d.y1, d.x2, d.y2);
	},

	//---------------------------------------------------------------------------
	// mv.input51()   [�_]���������������肷��
	// mv.set51cell() [�_]���쐬�E��������Ƃ��̋��ʏ����֐�(�J�b�N���ȊO�̓I�[�o�[���C�h�����)
	//---------------------------------------------------------------------------
	input51 : function(){
		var pos = this.cellpos();
		var cc = bd.cnum(pos.x, pos.y);

		if((pos.x==-1 && pos.y>=-1 && pos.y<=k.qrows-1) || (pos.y==-1 && pos.x>=-1 && pos.x<=k.qcols-1)){
			var tcx=tc.getTCX(), tcy=tc.getTCY();
			tc.setTCP(new Pos(2*pos.x+1,2*pos.y+1));
			pc.paint(tcx-1,tcy-1,tcx,tcy);
			pc.paint(tc.getTCX()-1,tc.getTCY()-1,tc.getTCX(),tc.getTCY());
			return;
		}
		else if(cc!=-1 && cc!=tc.getTCC()){
			var tcx=tc.getTCX(), tcy=tc.getTCY();
			tc.setTCC(cc);
			pc.paint(tcx-1,tcy-1,tcx,tcy);
		}
		else if(cc!=-1){
			if(this.btn.Left){
				if(bd.QuC(cc)!=51){ this.set51cell(cc,true);}
				else{ kc.chtarget('shift');}
			}
			else if(this.btn.Right){ this.set51cell(cc,false);}
		}
		else{ return;}

		pc.paint(bd.cell[cc].cx-1, bd.cell[cc].cy-1, bd.cell[cc].cx+1, bd.cell[cc].cy+1);
	},
	// ���Ƃ肠�����J�b�N���p
	set51cell : function(cc,val){
		if(val==true){
			bd.sQuC(cc,51);
			bd.sQnC(cc,0);
			bd.sDiC(cc,0);
			bd.sQaC(cc,-1);
		}
		else{
			bd.sQuC(cc,0);
			bd.sQnC(cc,0);
			bd.sDiC(cc,0);
			bd.sQaC(cc,-1);
		}
	},

	//---------------------------------------------------------------------------
	// mv.inputcross()     Cross��ques(���f�[�^)��0�`4����͂���B
	// mv.inputcrossMark() Cross�̍��_����͂���B
	//---------------------------------------------------------------------------
	inputcross : function(){
		var cc = this.crossid();
		if(cc==-1 || cc==this.mouseCell){ return;}

		if(cc==tc.getTXC()){
			if(this.btn.Left){
				if(bd.QnX(cc)==4){ bd.sQnX(cc,-2);}
				else{ bd.sQnX(cc,bd.QnX(cc)+1);}
			}
			else if(this.btn.Right){
				if(bd.QnX(cc)==-2){ bd.sQnX(cc,4);}
				else{ bd.sQnX(cc,bd.QnX(cc)-1);}
			}
		}
		else{
			var cc0 = tc.getTXC();
			tc.setTXC(cc);

			pc.paint(bd.cross[cc0].cx-1, bd.cross[cc0].cy-1, bd.cross[cc0].cx, bd.cross[cc0].cy);
		}
		this.mouseCell = cc;

		pc.paint(bd.cross[cc].cx-1, bd.cross[cc].cy-1, bd.cross[cc].cx, bd.cross[cc].cy);
	},
	inputcrossMark : function(){
		var pos = this.crosspos(0.24);
		if(pos.x%2!=0 || pos.y%2!=0){ return;}
		if(pos.x<(k.isoutsidecross==1?0:2) || pos.x>(k.isoutsidecross==1?2*k.qcols:2*k.qcols-2)){ return;}
		if(pos.y<(k.isoutsidecross==1?0:2) || pos.y>(k.isoutsidecross==1?2*k.qrows:2*k.qrows-2)){ return;}

		var cc = bd.xnum(mf(pos.x/2),mf(pos.y/2));

		um.disCombine = 1;
		bd.sQnX(cc,(bd.QnX(cc)==1)?-1:1);
		um.disCombine = 0;

		pc.paint(bd.cross[cc].cx-1, bd.cross[cc].cy-1, bd.cross[cc].cx, bd.cross[cc].cy);
	},
	//---------------------------------------------------------------------------
	// mv.inputborder()    �Ֆʋ��E���̖��f�[�^����͂���
	// mv.inputborderans() �Ֆʋ��E���̉񓚃f�[�^����͂���
	// mv.inputBD()        ��L��̋��ʏ����֐�
	//---------------------------------------------------------------------------
	inputborder : function(){ this.inputBD(0);},
	inputborderans : function(){ this.inputBD(1);},
	inputBD : function(flag){
		var pos = this.crosspos(0.35);
		if(pos.x==this.mouseCell.x && pos.y==this.mouseCell.y){ return;}

		var id = bd.bnum(pos.x, pos.y);
		if(id==-1 && this.mouseCell.x){ id = bd.bnum(this.mouseCell.x, this.mouseCell.y);}

		if(this.mouseCell!=-1 && id!=-1){
			if((pos.x%2==0 && this.mouseCell.x==pos.x && Math.abs(this.mouseCell.y-pos.y)==1) ||
			   (pos.y%2==0 && this.mouseCell.y==pos.y && Math.abs(this.mouseCell.x-pos.x)==1) )
			{
				this.mouseCell=-1;
				if(this.inputData==-1){ this.inputData=(bd.isBorder(id)?0:1);}

				if(!(k.playmode && bd.QuB(id)!==0)){
					if     (this.inputData==1){ bd.setBorder(id); if(k.isborderAsLine){ bd.sQsB(id, 0);} }
					else if(this.inputData==0){ bd.removeBorder(id);}

					pc.paintBorder(id);
				}
			}
		}
		this.mouseCell = pos;
	},

	//---------------------------------------------------------------------------
	// mv.inputLine()     �Ֆʂ̐�����͂���
	// mv.inputQsubLine() �Ֆʂ̋��E���p�⏕�L������͂���
	// mv.inputLine1()    ��L��̋��ʏ����֐�
	// mv.inputLine2()    �Ֆʂ̐�����͗p�����֐�
	// mv.inputqsub2()    ���E���p�⏕�L���̓��͗p�����֐�
	//---------------------------------------------------------------------------
	inputLine : function(){ this.inputLine1(0);},
	inputQsubLine : function(){ this.inputLine1(1);},
	inputLine1 : function(flag){
		var pos = this.cellpos();
		if(pos.x==this.mouseCell.x && pos.y==this.mouseCell.y){ return;}

		var id = -1;
		if     (pos.y-this.mouseCell.y==-1){ id=bd.bnum(this.mouseCell.x*2+1,this.mouseCell.y*2  );}
		else if(pos.y-this.mouseCell.y== 1){ id=bd.bnum(this.mouseCell.x*2+1,this.mouseCell.y*2+2);}
		else if(pos.x-this.mouseCell.x==-1){ id=bd.bnum(this.mouseCell.x*2  ,this.mouseCell.y*2+1);}
		else if(pos.x-this.mouseCell.x== 1){ id=bd.bnum(this.mouseCell.x*2+2,this.mouseCell.y*2+1);}

		this.mouseCell = pos;
		if(this.inputData==2 || this.inputData==3){ this.inputpeke2(id);}
		else if(this.mouseCell!=-1 && id!=-1){
			if     (flag==0) this.inputLine2(id);
			else if(flag==1) this.inputqsub2(id);
		}
	},
	inputLine2 : function(id){
		if(this.inputData==-1){ this.inputData=(bd.isLine(id)?0:1);}
		if     (this.inputData==1){ bd.setLine(id);}
		else if(this.inputData==0){ bd.removeLine(id);}
		pc.paintLine(id);
	},
	inputqsub2 : function(id){
		if(this.inputData==-1){ this.inputData=(bd.QsB(id)==0?1:0);}
		if     (this.inputData==1){ bd.sQsB(id, 1);}
		else if(this.inputData==0){ bd.sQsB(id, 0);}
		pc.paintLine(id);
	},

	//---------------------------------------------------------------------------
	// mv.inputpeke()   �Ֆʂ̐����ʂ�Ȃ����Ƃ������~����͂���
	// mv.inputpeke2()  �Ֆʂ̐����ʂ�Ȃ����Ƃ������~����͂���(inputLine1������Ă΂��)
	//---------------------------------------------------------------------------
	inputpeke : function(){
		var pos = this.crosspos(0.22);
		var id = bd.bnum(pos.x, pos.y);
		if(id==-1 || (pos.x==this.mouseCell.x && pos.y==this.mouseCell.y)){ return;}

		this.mouseCell = pos;
		this.inputpeke2(id);
	},
	inputpeke2 : function(id){
		if(this.inputData==-1){ if(bd.QsB(id)==0){ this.inputData=2;}else{ this.inputData=3;} }
		if     (this.inputData==2){ bd.setPeke(id);}
		else if(this.inputData==3){ bd.removeLine(id);}
		pc.paintLine(id);
	},

	//---------------------------------------------------------------------------
	// mv.dispRed() �ЂƂȂ���̍��}�X��Ԃ��\������
	// mv.db0()     �ȂȂ߂Ȃ���̍��}�X��Ԃ��\������(�ċN�Ăяo���p�֐�)
	// mv.dispRedLine()  �ЂƂȂ���̐���Ԃ��\������
	//---------------------------------------------------------------------------
	dispRed : function(){
		var cc = this.cellid();
		this.mousereset();
		if(!bd.isBlack(cc) || cc==this.mouseCell){ return;}
		if(!k.RBBlackCell){ bd.sErC(area.bcell[area.bcell.id[cc]].clist,1);}
		else{ this.db0(function(c){ return (bd.isBlack(c) && bd.ErC(c)==0);},cc,1);}
		ans.errDisp = true;
		pc.paintAll();
	},
	db0 : function(func, cc, num){
		if(bd.ErC(cc)!=0){ return;}
		bd.sErC([cc],num);
		var cx=bd.cell[cc].cx, cy=bd.cell[cc].cy;
		if( func(bd.cnum(cx-1,cy-1)) ){ this.db0(func, bd.cnum(cx-1,cy-1), num);}
		if( func(bd.cnum(cx  ,cy-1)) ){ this.db0(func, bd.cnum(cx  ,cy-1), num);}
		if( func(bd.cnum(cx+1,cy-1)) ){ this.db0(func, bd.cnum(cx+1,cy-1), num);}
		if( func(bd.cnum(cx-1,cy  )) ){ this.db0(func, bd.cnum(cx-1,cy  ), num);}
		if( func(bd.cnum(cx+1,cy  )) ){ this.db0(func, bd.cnum(cx+1,cy  ), num);}
		if( func(bd.cnum(cx-1,cy+1)) ){ this.db0(func, bd.cnum(cx-1,cy+1), num);}
		if( func(bd.cnum(cx  ,cy+1)) ){ this.db0(func, bd.cnum(cx  ,cy+1), num);}
		if( func(bd.cnum(cx+1,cy+1)) ){ this.db0(func, bd.cnum(cx+1,cy+1), num);}
		return;
	},

	dispRedLine : function(){
		var id = this.borderid(0.15);
		this.mousereset();
		if(id!=-1 && id==this.mouseCell){ return;}

		if(!bd.isLine(id)){
			var cc = (k.isborderAsLine==0?this.cellid():this.crossid());
			if(cc==-1 || (k.isLineCross && (line.lcntCell(cc)==3 || line.lcntCell(cc)==4))){ return;}

			var bx, by;
			if(k.isbordeAsLine==0){ bx = (cc%k.qcols)*2, by = mf(cc/k.qcols)*2;}
			else{ bx = (cc%(k.qcols+1))*2, by = mf(cc/(k.qcols+1))*2;}
			id = (function(bx,by){
				if     (bd.isLine(bd.bnum(bx-1,by))){ return bd.bnum(bx-1,by);}
				else if(bd.isLine(bd.bnum(bx+1,by))){ return bd.bnum(bx+1,by);}
				else if(bd.isLine(bd.bnum(bx,by-1))){ return bd.bnum(bx,by-1);}
				else if(bd.isLine(bd.bnum(bx,by+1))){ return bd.bnum(bx,by+1);}
				return -1;
			})(bx,by);
		}
		if(id==-1){ return;}

		bd.sErBAll(2); bd.sErB(line.data[line.data.id[id]].idlist,1);
		ans.errDisp = true;
		pc.paintAll();
	}
};
