// KeyInput.js v3.2.3

//---------------------------------------------------------------------------
// ��KeyEvent�N���X �L�[�{�[�h���͂Ɋւ�����̕ێ��ƃC�x���g����������
//---------------------------------------------------------------------------
// �p�Y������ �L�[�{�[�h���͕�
// KeyEvent�N���X���`
KeyEvent = function(){
	this.isCTRL;
	this.isALT;	// ALT�̓��j���[�p�Ȃ̂ŋɗ͎g��Ȃ�
	this.isSHIFT;
	this.inUNDO;
	this.inREDO;
	this.tcMoved;	// �J�[�\���ړ����ɃX�N���[�������Ȃ�
	this.keyPressed;
	this.ca;
	this.prev;
	this.keyreset();
};
KeyEvent.prototype = {
	//---------------------------------------------------------------------------
	// kc.keyreset() �L�[�{�[�h���͂Ɋւ����������������
	//---------------------------------------------------------------------------
	keyreset : function(){
		this.isCTRL  = false;
		this.isALT   = false;
		this.isSHIFT = false;
		this.inUNDO  = false;
		this.inREDO  = false;
		this.tcMoved = false;
		this.keyPressed = false;
		this.prev = -1;
		this.ca = '';
		if(this.isZ){ this.isZ = false;}
		if(this.isX){ this.isX = false;}
	},

	//---------------------------------------------------------------------------
	// kc.e_keydown()  �L�[���������ۂ̃C�x���g���ʏ���
	// kc.e_keyup()    �L�[�𗣂����ۂ̃C�x���g���ʏ���
	// kc.e_keypress() �L�[���͂����ۂ̃C�x���g���ʏ���(-�L�[�p)
	//---------------------------------------------------------------------------
	// ����3�̃L�[�C�x���g��window����Ăяo�����(kc��bind���Ă���)
	// 48�`57��0�`9�L�[�A65�`90��a�`z�A96�`105�̓e���L�[�A112�`123��F1�`F12�L�[
	e_keydown : function(e){
		if(!k.enableKey){ return;}

		um.newOperation(true);
		this.ca = this.getchar(e, this.getKeyCode(e));
		this.tcMoved = false;
		if(!this.isZ){ bd.errclear();}

		if(this.keydown_common(e)){ return false;}
		if(this.ca){ this.keyinput(this.ca);} //kc.keydown(e.modifier, String.fromCharCode(e.which), e);

		this.keyPressed = true;
	},
	e_keyup : function(e)    {
		if(!k.enableKey){ return;}

		um.newOperation(false);
		this.ca = this.getchar(e, this.getKeyCode(e));

		this.keyPressed = false;

		if(this.keyup_common(e)){ return false;}
		if(this.ca){ this.keyup(this.ca);} //kc.keyup(e.modifier, String.fromCharCode(e.which), e);
	},
	//(keypress�̂�)45��-(�}�C�i�X)
	e_keypress : function(e)    {
		if(!k.enableKey){ return;}

		um.newOperation(false);
		this.ca = this.getcharp(e, this.getKeyCode(e));

		if(this.ca){ this.keyinput(this.ca);}
	},

	//---------------------------------------------------------------------------
	// kc.e_SLkeydown()  Silverlight�I�u�W�F�N�g�Ƀt�H�[�J�X�����鎞�A�L�[���������ۂ̃C�x���g���ʏ���
	// kc.e_SLkeyup()    Silverlight�I�u�W�F�N�g�Ƀt�H�[�J�X�����鎞�A�L�[�𗣂����ۂ̃C�x���g���ʏ���
	//---------------------------------------------------------------------------
	e_SLkeydown : function(sender,keyEventArgs){
		var emulate = { keyCode : keyEventArgs.platformKeyCode, shiftKey:keyEventArgs.shift, ctrlKey:keyEventArgs.ctrl,
						altKey:false, returnValue:false, preventEvent:f_true };
		return this.e_keydown(emulate);
	},
	e_SLkeyup : function(sender,keyEventArgs){
		var emulate = {keyCode : keyEventArgs.platformKeyCode, shiftKey:keyEventArgs.shift, ctrlKey:keyEventArgs.ctrl, altKey:false};
		return this.e_keyup(emulate);
	},

	//---------------------------------------------------------------------------
	// kc.keyinput() �L�[���������ۂ̃C�x���g�����B�e�p�Y���̃t�@�C���ŃI�[�o�[���C�h�����B
	// kc.keyup()    �L�[�𗣂����ۂ̃C�x���g�����B�e�p�Y���̃t�@�C���ŃI�[�o�[���C�h�����B
	//---------------------------------------------------------------------------
	// �I�[�o�[���C�h�p
	keyinput : function(ca){ },
	keyup    : function(ca){ },

	//---------------------------------------------------------------------------
	// kc.getchar()    ���͂��ꂽ�L�[��\���������Ԃ�
	// kc.getcharp()   ���͂��ꂽ�L�[��\���������Ԃ�(keypress�̎�)
	// kc.getKeyCode() ���͂��ꂽ�L�[�̃R�[�h�𐔎��ŕԂ�
	//---------------------------------------------------------------------------
	getchar : function(e, keycode){
		if     (e.keyCode == 38)            { return k.KEYUP;}
		else if(e.keyCode == 40)            { return k.KEYDN;}
		else if(e.keyCode == 37)            { return k.KEYLT;}
		else if(e.keyCode == 39)            { return k.KEYRT;}
		else if(48<=keycode && keycode<=57) { return (keycode - 48).toString(36);}
		else if(65<=keycode && keycode<=90) { return (keycode - 55).toString(36);} //�A���t�@�x�b�g
		else if(96<=keycode && keycode<=105){ return (keycode - 96).toString(36);} //�e���L�[�Ή�
		else if(112<=keycode && keycode<=123){return 'F'+(keycode - 111).toString(10);}
		else if(keycode==32 || keycode==46) { return ' ';} // 32�̓X�y�[�X�L�[ 46��del�L�[
		else if(keycode==8)                 { return 'BS';}
		else if(e.shiftKey)                 { return 'shift';}
		else{ return '';}
	},
	getcharp : function(e, keycode){
		if(keycode==45){ return '-';}
		else{ return '';}
	},
	//Programming Magic�l�̃R�[�h
	getKeyCode : function(e){
		if(document.all) return  e.keyCode;
		else if(document.getElementById) return (e.keyCode)? e.keyCode: e.charCode;
		else if(document.layers) return  e.which;
	},

	//---------------------------------------------------------------------------
	// kc.keydown_common() �L�[���������ۂ̃C�x���g���ʏ���(Shift,Undo,F2��)
	// kc.keyup_common()   �L�[�𗣂����ۂ̃C�x���g���ʏ���(Shift,Undo��)
	//---------------------------------------------------------------------------
	keydown_common : function(e){
		var flag = false;
		if(!this.isSHIFT && e.shiftKey){ this.isSHIFT=true; }
		if(!this.isCTRL  && e.ctrlKey ){ this.isCTRL=true;  flag = true; }
		if(!this.isALT   && e.altKey  ){ this.isALT=true;   flag = true; }

		if(this.isCTRL && this.ca=='z'){ this.inUNDO=true; flag = true; tm.startUndoTimer();}
		if(this.isCTRL && this.ca=='y'){ this.inREDO=true; flag = true; tm.startUndoTimer();}

		if(this.ca=='F2' && k.EDITOR){ // 112�`123��F1�`F12�L�[
			if     (k.editmode && !this.isSHIFT){ pp.setVal('mode',3); flag = true;}
			else if(k.playmode &&  this.isSHIFT){ pp.setVal('mode',1); flag = true;}
		}
		if(k.scriptcheck && debug){ flag = (flag || debug.keydown(this.ca));}

		return flag;
	},
	keyup_common : function(e){
		var flag = false;
		if(this.isSHIFT && !e.shiftKey){ this.isSHIFT=false; flag = true; }
		if((this.isCTRL || this.inUNDO || this.inREDO)  && !e.ctrlKey ){ this.isCTRL=false;  flag = true; this.inUNDO = false; this.inREDO = false; }
		if(this.isALT   && !e.altKey  ){ this.isALT=false;   flag = true; }

		if(this.inUNDO && this.ca=='z'){ this.inUNDO=false; flag = true; }
		if(this.inREDO && this.ca=='y'){ this.inREDO=false; flag = true; }

		return flag;
	},
	//---------------------------------------------------------------------------
	// kc.moveTCell()   Cell�̃L�[�{�[�h����̓��͑Ώۂ���L�[�œ�����
	// kc.moveTCross()  Cross�̃L�[�{�[�h����̓��͑Ώۂ���L�[�œ�����
	// kc.moveTBorder() Border�̃L�[�{�[�h����̓��͑Ώۂ���L�[�œ�����
	// kc.moveTC()      ��L3�̊֐��̋��ʏ���
	//---------------------------------------------------------------------------
	moveTCell   : function(ca){ return this.moveTC(ca,2);},
	moveTCross  : function(ca){ return this.moveTC(ca,2);},
	moveTBorder : function(ca){ return this.moveTC(ca,1);},
	moveTC : function(ca,mv){
		var tcx = tc.cursolx, tcy = tc.cursoly, flag = false;
		if     (ca == k.KEYUP && tcy-mv >= tc.miny){ tc.decTCY(mv); flag = true;}
		else if(ca == k.KEYDN && tcy+mv <= tc.maxy){ tc.incTCY(mv); flag = true;}
		else if(ca == k.KEYLT && tcx-mv >= tc.minx){ tc.decTCX(mv); flag = true;}
		else if(ca == k.KEYRT && tcx+mv <= tc.maxx){ tc.incTCX(mv); flag = true;}

		if(flag){
			pc.paint((tcx>>1)-1, (tcy>>1)-1, tcx>>1, tcy>>1);
			pc.paint((tc.cursolx>>1)-1, (tc.cursoly>>1)-1, tc.cursolx>>1, tc.cursoly>>1);
			this.tcMoved = true;
		}
		return flag;
	},

	//---------------------------------------------------------------------------
	// kc.key_inputcross() ���max�܂ł̐�����Cross�̖��f�[�^�����ē��͂���(keydown��)
	//---------------------------------------------------------------------------
	key_inputcross : function(ca){
		var cc = tc.getTXC();
		var max = bd.nummaxfunc(cc);

		if('0'<=ca && ca<='9'){
			var num = parseInt(ca);

			if(bd.QnX(cc)<=0){
				if(num<=max){ bd.sQnX(cc,num);}
			}
			else{
				if(bd.QnX(cc)*10+num<=max){ bd.sQnX(cc,bd.QnX(cc)*10+num);}
				else if(num<=max){ bd.sQnX(cc,num);}
			}
		}
		else if(ca=='-'){
			if(bd.QnX(cc)!=-2){ bd.sQnX(cc,-2);}
			else{ bd.sQnX(cc,-1);}
		}
		else if(ca==' '){
			bd.sQnX(cc,-1);
		}
		else{ return;}

		pc.paint(bd.cross[cc].cx-1, bd.cross[cc].cy-1, bd.cross[cc].cx, bd.cross[cc].cy);
	},
	//---------------------------------------------------------------------------
	// kc.key_inputqnum() ���max�܂ł̐�����Cell�̖��f�[�^�����ē��͂���(keydown��)
	//---------------------------------------------------------------------------
	key_inputqnum : function(ca){
		var cc = tc.getTCC();
		if(k.editmode && k.isOneNumber){ cc = area.getTopOfRoomByCell(cc);}
		var max = bd.nummaxfunc(cc);

		if('0'<=ca && ca<='9'){
			var num = parseInt(ca);
			if(k.playmode){ bd.sDiC(cc,0);}

			if(bd.getNum(cc)<=0 || this.prev!=cc){
				if(num<=max){ bd.setNum(cc,num);}
			}
			else{
				if(bd.getNum(cc)*10+num<=max){ bd.setNum(cc,bd.getNum(cc)*10+num);}
				else if(num<=max){ bd.setNum(cc,num);}
			}
			if(bd.QnC(cc)!=-1 && k.NumberIsWhite){ bd.sQaC(cc,-1); if(pc.bcolor=="white"){ bd.sQsC(cc,0);} }
			if(k.isAnsNumber){ if(k.editmode){ bd.sQaC(cc,-1);} bd.sQsC(cc,0); }
		}
		else if(ca=='-'){
			if(k.editmode && bd.QnC(cc)!=-2){ bd.setNum(cc,-2);}
			else{ bd.setNum(cc,-1);}
			if(bd.QnC(cc)!=-1 && k.NumberIsWhite){ bd.sQaC(cc,-1); if(pc.bcolor=="white"){ bd.sQsC(cc,0);} }
			if(k.isAnsNumber){ bd.sQsC(cc,0);}
		}
		else if(ca==' '){
			bd.setNum(cc,-1);
			if(bd.QnC(cc)!=-1 && k.NumberIsWhite){ bd.sQaC(cc,-1); if(pc.bcolor=="white"){ bd.sQsC(cc,0);} }
			if(k.isAnsNumber){ bd.sQsC(cc,0);}
		}
		else{ return;}

		this.prev = cc;
		pc.paintCell(cc);
	},

	//---------------------------------------------------------------------------
	// kc.key_inputdirec()  �l�����̖��Ȃǂ�ݒ肷��
	//---------------------------------------------------------------------------
	key_inputdirec : function(ca){
		if(!this.isSHIFT){ return false;}

		var cc = tc.getTCC();
		if(bd.QnC(cc)==-1){ return false;}

		var flag = false;

		if     (ca == k.KEYUP){ bd.sDiC(cc, (bd.DiC(cc)!=k.UP?k.UP:0)); flag = true;}
		else if(ca == k.KEYDN){ bd.sDiC(cc, (bd.DiC(cc)!=k.DN?k.DN:0)); flag = true;}
		else if(ca == k.KEYLT){ bd.sDiC(cc, (bd.DiC(cc)!=k.LT?k.LT:0)); flag = true;}
		else if(ca == k.KEYRT){ bd.sDiC(cc, (bd.DiC(cc)!=k.RT?k.RT:0)); flag = true;}

		if(flag){
			pc.paint(tc.cursolx>>1, tc.cursoly>>1, tc.cursolx>>1, tc.cursoly>>1);
			this.tcMoved = true;
		}
		return flag;
	},

	//---------------------------------------------------------------------------
	// kc.inputnumber51()  [�_]�̐���������͂���
	// kc.setnum51()      ���[�h�ʂɐ�����ݒ肷��
	// kc.getnum51()      ���[�h�ʂɐ������擾����
	//---------------------------------------------------------------------------
	inputnumber51 : function(ca,max_obj){
		if(this.chtarget(ca)){ return;}

		var cc = tc.getTCC(), ex = -1;
		if(cc==-1){ ex = bd.exnum(tc.getTCX(),tc.getTCY());}
		var target = this.detectTarget(cc,ex);
		if(target==-1 || (cc!=-1 && bd.QuC(cc)==51)){
			if(ca=='q' && cc!=-1){
				mv.set51cell(cc,(bd.QuC(cc)!=51));
				pc.paint(tc.getTCX()-1,tc.getTCY()-1,tc.getTCX()+1,tc.getTCY()+1);
				return;
			}
		}
		if(target==-1){ return;}

		var max = max_obj[target];

		if('0'<=ca && ca<='9'){
			var num = parseInt(ca);

			if(this.getnum51(cc,ex,target)<=0 || this.prev!=cc){
				if(num<=max){ this.setnum51(cc,ex,target,num);}
			}
			else{
				if(this.getnum51(cc,ex,target)*10+num<=max){ this.setnum51(cc,ex,target,this.getnum51(cc,ex,target)*10+num);}
				else if(num<=max){ this.setnum51(cc,ex,target,num);}
			}
		}
		else if(ca=='-' || ca==' '){ this.setnum51(cc,ex,target,-1);}
		else{ return;}

		this.prev = cc;
		if(cc!=-1){ pc.paintCell(tc.getTCC());}else{ pc.paint(tc.getTCX(),tc.getTCY(),tc.getTCX(),tc.getTCY());}
	},
	setnum51 : function(cc,ex,target,val){
		if(cc!=-1){ (target==2 ? bd.sQnC(cc,val) : bd.sDiC(cc,val));}
		else      { (target==2 ? bd.sQnE(ex,val) : bd.sDiE(ex,val));}
	},
	getnum51 : function(cc,ex,target){
		if(cc!=-1){ return (target==2 ? bd.QnC(cc) : bd.DiC(cc));}
		else      { return (target==2 ? bd.QnE(ex) : bd.DiE(ex));}
	},

	//---------------------------------------------------------------------------
	// kc.chtarget()     SHIFT������������[�_]�̓��͂���Ƃ����I������
	// kc.detectTarget() [�_]�̉E�E���ǂ���ɐ�������͂��邩���f����
	//---------------------------------------------------------------------------
	chtarget : function(ca){
		if(ca!='shift'){ return false;}
		if(tc.targetdir==2){ tc.targetdir=4;}
		else{ tc.targetdir=2;}
		pc.paintCell(tc.getTCC());
		return true;
	},
	detectTarget : function(cc,ex){
		if((cc==-1 && ex==-1) || (cc!=-1 && bd.QuC(cc)!=51)){ return -1;}
		if(cc==bd.cellmax-1 || ex==k.qcols+k.qrows){ return -1;}
		if(cc!=-1){
			if	  ((bd.rt(cc)==-1 || bd.QuC(bd.rt(cc))==51) &&
				   (bd.dn(cc)==-1 || bd.QuC(bd.dn(cc))==51)){ return -1;}
			else if(bd.rt(cc)==-1 || bd.QuC(bd.rt(cc))==51){ return 4;}
			else if(bd.dn(cc)==-1 || bd.QuC(bd.dn(cc))==51){ return 2;}
		}
		else if(ex!=-1){
			if	  ((bd.excell[ex].cy==-1 && bd.QuC(bd.excell[ex].cx)==51) ||
				   (bd.excell[ex].cx==-1 && bd.QuC(bd.excell[ex].cy*k.qcols)==51)){ return -1;}
			else if(bd.excell[ex].cy==-1){ return 4;}
			else if(bd.excell[ex].cx==-1){ return 2;}
		}

		return tc.targetdir;
	}
};

//---------------------------------------------------------------------------
// ��KeyPopup�N���X �}�E�X����L�[�{�[�h���͂���ۂ�Popup�E�B���h�E���Ǘ�����
//---------------------------------------------------------------------------
// �L�[���͗pPopup�E�B���h�E
// KeyPopup�N���X
KeyPopup = function(){
	this.ctl = { 1:{ el:null, enable:false, target:k.CELL},		// �����͎��ppopup
				 3:{ el:null, enable:false, target:k.CELL} };	// �񓚓��͎��ppopup
	this.tdcolor = "black";
	this.imgCR = [1,1];		// img�\���p�摜�̉��~�c�̃T�C�Y

	this.tds  = [];			// resize�p
	this.imgs = [];			// resize�p

	this.defaultdisp = false;

	this.tbodytmp=null, this.trtmp=null;

	this.ORIGINAL = 99;

	// ElementTemplate
	this.EL_KPNUM   = ee.addTemplate('','td', {unselectable:'on', className:'kpnum'}, null, null);
	this.EL_KPEMPTY = ee.addTemplate('','td', {unselectable:'on'}, null, null);
	this.EL_KPIMG   = ee.addTemplate('','td', {unselectable:'on', className:'kpimgcell'}, null, null);
	this.EL_KPIMG_DIV = ee.addTemplate('','div', {unselectable:'on', className:'kpimgdiv'}, null, null);
	this.EL_KPIMG_IMG = ee.addTemplate('','img', {unselectable:'on', className:'kpimg', src:"./src/img/"+k.puzzleid+"_kp.gif"}, null, null);
};
KeyPopup.prototype = {
	//---------------------------------------------------------------------------
	// kp.kpinput()  �L�[�|�b�v�A�b�v������͂��ꂽ���̏������I�[�o�[���C�h�ŋL�q����
	// kp.enabled()  �L�[�|�b�v�A�b�v���̂��L�����ǂ�����Ԃ�
	//---------------------------------------------------------------------------
	// �I�[�o�[���C�h�p
	kpinput : function(ca){ },
	enabled : function(){ return pp.getVal('keypopup');},

	//---------------------------------------------------------------------------
	// kp.generate()   �L�[�|�b�v�A�b�v�𐶐����ď���������
	// kp.gentable()   �L�[�|�b�v�A�b�v�̃e�[�u�����쐬����
	// kp.gentable10() �L�[�|�b�v�A�b�v��0�`9����͂ł���e�[�u�����쐬����
	// kp.gentable4()  �L�[�|�b�v�A�b�v��0�`4����͂ł���e�[�u�����쐬����
	//---------------------------------------------------------------------------
	generate : function(type, enablemake, enableplay, func){
		if(enablemake && k.EDITOR){ this.gentable(1, type, func);}
		if(enableplay)            { this.gentable(3, type, func);}
	},

	gentable : function(mode, type, func){
		this.ctl[mode].enable = true;
		this.ctl[mode].el     = ee('keypopup'+mode).el;
		this.ctl[mode].el.onmouseout = ee.ebinder(this, this.hide);

		var table = _doc.createElement('table');
		table.cellSpacing = '2pt';
		this.ctl[mode].el.appendChild(table);

		this.tbodytmp = _doc.createElement('tbody');
		table.appendChild(this.tbodytmp);

		this.trtmp = null;
		if(func)							  { func.apply(kp, [mode]);}
		else if(type==0 || type==3)			  { this.gentable10(mode,type);}
		else if(type==1 || type==2 || type==4){ this.gentable4 (mode,type);}
	},

	gentable10 : function(mode, type){
		this.inputcol('num','knum0','0','0');
		this.inputcol('num','knum1','1','1');
		this.inputcol('num','knum2','2','2');
		this.inputcol('num','knum3','3','3');
		this.insertrow();
		this.inputcol('num','knum4','4','4');
		this.inputcol('num','knum5','5','5');
		this.inputcol('num','knum6','6','6');
		this.inputcol('num','knum7','7','7');
		this.insertrow();
		this.inputcol('num','knum8','8','8');
		this.inputcol('num','knum9','9','9');
		this.inputcol('num','knum_',' ',' ');
		if     (type==0){ (mode==1)?this.inputcol('num','knum.','-','?'):this.inputcol('empty','knum.','','');}
		else if(type==3){ this.inputcol('num','knum.','-','��');}
		this.insertrow();
	},
	gentable4 : function(mode, type, tbody){
		this.inputcol('num','knum0','0','0');
		this.inputcol('num','knum1','1','1');
		this.inputcol('num','knum2','2','2');
		this.inputcol('num','knum3','3','3');
		this.insertrow();
		this.inputcol('num','knum4','4','4');
		this.inputcol('empty','knumx','','');
		this.inputcol('num','knum_',' ',' ');
		if     (type==1){ (mode==1)?this.inputcol('num','knum.','-','?'):this.inputcol('empty','knum.','','');}
		else if(type==2){ this.inputcol('num','knum.', '-', '��');}
		else if(type==4){ this.inputcol('num','knum.', '-', '��');}
		this.insertrow();
	},

	//---------------------------------------------------------------------------
	// kp.inputcol()  �e�[�u���̃Z����ǉ�����
	// kp.insertrow() �e�[�u���̍s��ǉ�����
	//---------------------------------------------------------------------------
	inputcol : function(type, id, ca, disp){
		if(!this.trtmp){ this.trtmp = _doc.createElement('tr');}
		var _td = null;
		if(type==='num'){
			_td = ee.createEL(this.EL_KPNUM, id);
			_td.style.color = this.tdcolor;
			_td.innerHTML   = disp;
			_td.onclick     = ee.ebinder(this, this.inputnumber, [ca]);
		}
		else if(type==='empty'){
			_td = ee.createEL(this.EL_KPEMPTY, '');
		}
		else if(type==='image'){
			var _img = ee.createEL(this.EL_KPIMG_IMG, ""+id+"_i");
			var _div = ee.createEL(this.EL_KPIMG_DIV, '');
			_div.appendChild(_img);

			_td = ee.createEL(this.EL_KPIMG, id);
			_td.onclick   = ee.ebinder(this, this.inputnumber, [ca]);
			_td.appendChild(_div);

			this.imgs.push({'el':_img, 'cx':disp[0], 'cy':disp[1]});
		}

		if(_td){
			this.tds.push(_td);
			this.trtmp.appendChild(_td);
		}
	},
	insertrow : function(){
		if(this.trtmp){
			this.tbodytmp.appendChild(this.trtmp);
			this.trtmp = null;
		}
	},

	//---------------------------------------------------------------------------
	// kp.display()     �L�[�|�b�v�A�b�v��\������
	// kp.inputnumber() kpinput�֐����Ăяo���ăL�[�|�b�v�A�b�v���B��
	// kp.hide()        �L�[�|�b�v�A�b�v���B��
	//---------------------------------------------------------------------------
	display : function(){
		var mode = pp.getVal('mode');
		if(this.ctl[mode].el && this.ctl[mode].enable && pp.getVal('keypopup') && mv.btn.Left){
			this.ctl[mode].el.style.left   = k.cv_oft.x + mv.inputX - 3 + k.IEMargin.x;
			this.ctl[mode].el.style.top    = k.cv_oft.y + mv.inputY - 3 + k.IEMargin.y;
			this.ctl[mode].el.style.zIndex = 100;

			if(this.ctl[mode].target==k.CELL){
				var cc0 = tc.getTCC();
				var cc = mv.cellid();
				if(cc==-1){ return;}
				tc.setTCC(cc);
				pc.paint(bd.cell[cc].cx-1, bd.cell[cc].cy-1, bd.cell[cc].cx, bd.cell[cc].cy);
				pc.paint(bd.cell[cc0].cx-1, bd.cell[cc0].cy-1, bd.cell[cc0].cx, bd.cell[cc0].cy);
			}
			else if(this.ctl[mode].target==k.CROSS){
				var cc0 = tc.getTXC();
				var cc = mv.crossid();
				if(cc==-1){ return;}
				tc.setTXC(cc);
				pc.paint(bd.cross[cc].cx-1, bd.cross[cc].cy-1, bd.cross[cc].cx, bd.cross[cc].cy);
				pc.paint(bd.cross[cc0].cx-1, bd.cross[cc0].cy-1, bd.cross[cc0].cx, bd.cross[cc0].cy);
			}

			this.ctl[mode].el.style.display = 'inline';
		}
	},
	inputnumber : function(e, ca){
		this.kpinput(ca);
		this.ctl[pp.getVal('mode')].el.style.display = 'none';
	},
	hide : function(e){
		var mode = pp.getVal('mode');
		if(!!this.ctl[mode].el && !menu.insideOf(this.ctl[mode].el, e)){
			this.ctl[mode].el.style.display = 'none';
		}
	},

	//---------------------------------------------------------------------------
	// kp.resize() �L�[�|�b�v�A�b�v�̃Z���̃T�C�Y��ύX����
	//---------------------------------------------------------------------------
	resize : function(){
		var tfunc = function(el,tsize){
			el.style.width    = ""+mf(tsize*0.90)+"px"
			el.style.height   = ""+mf(tsize*0.90)+"px"
			el.style.fontSize = ""+mf(tsize*0.70)+"px";
		};
		var ifunc = function(obj,bsize){
			obj.el.style.width  = ""+(bsize*kp.imgCR[0])+"px";
			obj.el.style.height = ""+(bsize*kp.imgCR[1])+"px";
			obj.el.style.clip   = "rect("+(bsize*obj.cy+1)+"px,"+(bsize*(obj.cx+1))+"px,"+(bsize*(obj.cy+1))+"px,"+(bsize*obj.cx+1)+"px)";
			obj.el.style.top    = "-"+(obj.cy*bsize+1)+"px";
			obj.el.style.left   = "-"+(obj.cx*bsize+1)+"px";
		};

		if(k.def_csize>=24){
			for(var i=0,len=this.tds.length ;i<len;i++){ tfunc(this.tds[i],  k.def_csize);}
			for(var i=0,len=this.imgs.length;i<len;i++){ ifunc(this.imgs[i], mf(k.def_csize*0.90));}
		}
		else{
			for(var i=0,len=this.tds.length ;i<len;i++){ tfunc(this.tds[i],  22);}
			for(var i=0,len=this.imgs.length;i<len;i++){ ifunc(this.imgs[i], 18);}
		}
	}
};

//---------------------------------------------------------------------------
// ��TCell�N���X �L�[���͂̃^�[�Q�b�g��ێ����� (�֐��̐����͗�)
//---------------------------------------------------------------------------

TCell = function(){
	this.cursolx = 1;
	this.cursoly = 1;

	this.minx = (k.isextendcell!=0?-1:1);
	this.miny = (k.isextendcell!=0?-1:1);
	this.maxx = (k.isextendcell==2?2*k.qcols+1:2*k.qcols-1);
	this.maxy = (k.isextendcell==2?2*k.qrows+1:2*k.qrows-1);
};
TCell.prototype = {
	//---------------------------------------------------------------------------
	// tc.Adjust()   �͈͂ƃ^�[�Q�b�g�̈ʒu�𒲐߂���
	// tc.setAlign() ���[�h�ύX���Ɉʒu�����������ꍇ�ɒ��߂���(�I�[�o�[���C�h�p)
	//---------------------------------------------------------------------------
	Adjust : function(){
		if(this.cursolx<this.minx){ this.tborderx=this.minx; }
		if(this.cursoly<this.miny){ this.tbordery=this.miny; }
		if(this.cursolx>this.maxx){ this.tborderx=this.maxx; }
		if(this.cursoly>this.maxy){ this.tbordery=this.maxy; }
	},
	setAlign : function(){ },

	//---------------------------------------------------------------------------
	// tc.incTCX(), tc.incTCY(), tc.decTCX(), tc.decTCY() �^�[�Q�b�g�̈ʒu�𓮂���
	//---------------------------------------------------------------------------
	incTCX : function(mv){ this.cursolx+=mv;},
	incTCY : function(mv){ this.cursoly+=mv;},
	decTCX : function(mv){ this.cursolx-=mv;},
	decTCY : function(mv){ this.cursoly-=mv;},

	//---------------------------------------------------------------------------
	// tc.getTCP() �^�[�Q�b�g�̈ʒu��(X,Y)�Ŏ擾����(�Z����1/2=1�Ƃ���)
	// tc.setTCP() �^�[�Q�b�g�̈ʒu��(X,Y)�Őݒ肷��(�Z����1/2=1�Ƃ���)
	// tc.getTCC() �^�[�Q�b�g�̈ʒu��Cell��ID�Ŏ擾����
	// tc.setTCC() �^�[�Q�b�g�̈ʒu��Cell��ID�Őݒ肷��
	// tc.getTXC() �^�[�Q�b�g�̈ʒu��Cross��ID�Ŏ擾����
	// tc.setTXC() �^�[�Q�b�g�̈ʒu��Cross��ID�Őݒ肷��
	// tc.getTBC() �^�[�Q�b�g�̈ʒu��Border��ID�Ŏ擾����
	// tc.setTBC() �^�[�Q�b�g�̈ʒu��Border��ID�Őݒ肷��
	//---------------------------------------------------------------------------
	getTCP : function(){ return new Pos(this.cursolx,this.cursoly);},
	setTCP : function(pos){
		if(pos.x<this.minx || this.maxx<pos.x || pos.y<this.miny || this.maxy<pos.y){ return;}
		this.cursolx = pos.x; this.cursoly = pos.y;
	},
	getTCC : function(){ return bd.cnum(this.cursolx>>1, this.cursoly>>1);},
	setTCC : function(id){
		if(id<0 || bd.cellmax<=id){ return;}
		this.cursolx = bd.cell[id].cx*2+1; this.cursoly = bd.cell[id].cy*2+1;
	},
	getTXC : function(){ return bd.xnum(this.cursolx>>1, this.cursoly>>1);},
	setTXC : function(id){
		if(!k.iscross || id<0 || bd.crossmax<=id){ return;}
		this.cursolx = bd.cross[id].cx*2; this.cursoly = bd.cross[id].cy*2;
	},
	getTBC : function(){ return bd.bnum(this.cursolx, this.cursoly);},
	setTBC : function(id){
		if(!k.isborder || id<0 || bd.bdmax<=id){ return;}
		this.cursolx = bd.border[id].cx*2; this.cursoly = bd.border[id].cy;
	}
};
