// Undo.js v3.2.3

//---------------------------------------------------------------------------
// ��UndoManager�N���X ������������AUndo/Redo�̓������������
//---------------------------------------------------------------------------
// ���͏��Ǘ��N���X
// Operation�N���X
Operation = function(obj, property, id, old, num){
	this.obj = obj;
	this.property = property;
	this.id = id;
	this.old = old;
	this.num = num;
	this.chain = um.chainflag;
};

// UndoManager�N���X
UndoManager = function(){
	this.ope = [];			// Operation�N���X��ێ�����z��
	this.current = 0;		// ���݂̕\������ԍ���ێ�����
	this.disrec = 0;		// ���̃N���X����̌Ăяo������1�ɂ���
	this.disinfo = 0;		// LineManager, AreaManager���Ăяo���Ȃ��悤�ɂ���
	this.chainflag = 0;		// �O��Operation�Ƃ������āA����Undo/Redo�ŕω��ł���悤�ɂ���
	this.disCombine = 0;	// �������������Ă��܂��̂ŁA������ꎞ�I�ɖ����ɂ��邽�߂̃t���O

	this.anscount = 0;			// �⏕�ȊO�̑��삪�s��ꂽ����ێ�����(autocheck�p)
	this.changeflag = false;	// ���삪�s��ꂽ��true�ɂ���(mv.notInputted()�p)

	this.undoExec = false;		// Undo��
	this.redoExec = false;		// Redo��
	this.reqReset = false;		// Undo/Redo���ɔՖʉ�]���������Ă������Aresize,resetInfo�֐���call��v������
	this.range = { x1:k.qcols+1, y1:k.qrows+1, x2:-2, y2:-2};
};
UndoManager.prototype = {
	//---------------------------------------------------------------------------
	// um.disableRecord()  ����̓o�^���֎~����
	// um.enableRecord()   ����̓o�^��������
	// um.isenableRecord() ����̓o�^�ł��邩��Ԃ�
	// um.enb_btn()        html���[��][�i]�{�^�����������Ƃ��\���ݒ肷��
	// um.allerase()       �L�����Ă��������S�Ĕj������
	// um.newOperation()   �}�E�X�A�L�[���͊J�n���ɌĂяo��
	//---------------------------------------------------------------------------

	// �����̊֐��Ń��R�[�h�֎~�ɂȂ�̂́AUndoRedo���AURLdecode�Afileopen�AadjustGeneral/Special��
	// �A�����Ď��s���Ȃ��Ȃ�̂�addOpe()�ƁALineInfo/AreaInfo�̒��g.
	//  -> �����Ŏg���Ă���Undo/Redo��addOpe�ȊO��bd.QuC�n�֐����g�p���Ȃ��悤�ɕύX
	//     �ςȐ����������Ȃ��Ȃ邵�A���쑬�x�ɂ����Ȃ��������
	disableRecord : function(){ this.disrec++; },
	enableRecord  : function(){ if(this.disrec>0){ this.disrec--;} },
	isenableRecord : function(){ return (this.disrec==0);},

	disableInfo : function(){ this.disinfo++; },
	enableInfo  : function(){ if(this.disinfo>0){ this.disinfo--;} },
	isenableInfo : function(){ return (this.disinfo==0);},

	enb_btn : function(){
		ee('btnundo').el.disabled = ((!this.ope.length || this.current==0)               ? 'true' : '');
		ee('btnredo').el.disabled = ((!this.ope.length || this.current==this.ope.length) ? 'true' : '');
	},
	allerase : function(){
		for(var i=this.ope.length-1;i>=0;i--){ this.ope.pop();}
		this.current  = 0;
		this.anscount = 0;
		this.enb_btn();
	},
	newOperation : function(flag){	// �L�[�A�{�^���������n�߂��Ƃ���true
		this.chainflag = 0;
		if(flag){ this.changeflag = false;}
	},

	//---------------------------------------------------------------------------
	// um.addOpe() �w�肳�ꂽ�����ǉ�����Bid���������ꍇ�͍ŏI�����ύX����
	// um.addObj() �w�肳�ꂽ�I�u�W�F�N�g�𑀍�Ƃ��Ēǉ�����
	//---------------------------------------------------------------------------
	addOpe : function(obj, property, id, old, num){
		if(!this.isenableRecord()){ return;}
		else if(old==num){ return;}

		var lastid = this.ope.length-1;

		if(this.current < this.ope.length){
			for(var i=this.ope.length-1;i>=this.current;i--){ this.ope.pop();}
			lastid = -1;
		}

		// �O��Ɠ����ꏊ�Ȃ�O��̍X�V�̂�
		if(lastid>=0 && this.ope[lastid].obj == obj && this.ope[lastid].property == property && this.ope[lastid].id == id && this.ope[lastid].num == old
			&& this.disCombine==0 && ( (obj == k.CELL && ( property==k.QNUM || (property==k.QANS && k.isAnsNumber) )) || obj == k.CROSS)
		)
		{
			this.ope[lastid].num = num;
		}
		else{
			this.ope.push(new Operation(obj, property, id, old, num));
			this.current++;
			if(this.chainflag==0){ this.chainflag = 1;}
		}

		if(property!=k.QSUB){ this.anscount++;}
		this.changeflag = true;
		this.enb_btn();
	},
	addObj : function(type, id){
		var old, obj;
		if     (type==k.CELL)  { old = new Cell();   obj = bd.cell[id];  }
		else if(type==k.CROSS) { old = new Cross();  obj = bd.cross[id]; }
		else if(type==k.BORDER){ old = new Border(); obj = bd.border[id];}
		else if(type==k.EXCELL){ old = new Cell();   obj = bd.excell[id];}
		for(var i in obj){ old[i] = obj[i];}
		this.addOpe(type, type, id, old, null);
	},

	//---------------------------------------------------------------------------
	// um.undo()  Undo�����s����
	// um.redo()  Redo�����s����
	// um.postproc() Undo/Redo���s��̏������s��
	// um.exec()  ����ope�𔽉f����Bundo(),redo()��������I�ɌĂ΂��
	//---------------------------------------------------------------------------
	undo : function(){
		if(this.current==0){ return;}
		this.undoExec = true;
		this.range = { x1:k.qcols+1, y1:k.qrows+1, x2:-2, y2:-2};
		this.disableRecord();

		while(this.current>0){
			var ope = this.ope[this.current-1];

			this.exec(ope, ope.old);
			if(ope.property!=k.QSUB){ this.anscount--;}
			this.current--;

			if(!this.ope[this.current].chain){ break;}
		}

		this.postproc();
		this.undoExec = false;
		if(this.current==0){ kc.inUNDO=false;}
	},
	redo : function(){
		if(this.current==this.ope.length){ return;}
		this.redoExec = true;
		this.range = { x1:k.qcols+1, y1:k.qrows+1, x2:-2, y2:-2};
		this.disableRecord();

		while(this.current<this.ope.length){
			var ope = this.ope[this.current];

			this.exec(ope, ope.num);
			if(ope.property!=k.QSUB){ this.anscount++;}
			this.current++;

			if(this.current<this.ope.length && !this.ope[this.current].chain){ break;}
		}

		this.postproc();
		this.redoExec = false;
		if(this.ope.length==0){ kc.inREDO=false;}
	},
	postproc : function(){
		if(this.reqReset){
			this.reqReset=false;

			bd.setposAll();
			base.resetInfo();
			base.resize_canvas();
		}
		else{
			pc.paint(this.range.x1, this.range.y1, this.range.x2, this.range.y2);
		}
		this.enableRecord();
		this.enableInfo();
		this.enb_btn();
	},
	exec : function(ope, num){
		var pp = ope.property;
		if(ope.obj == k.CELL){
			if     (pp == k.QUES){ bd.sQuC(ope.id, num);}
			else if(pp == k.QNUM){ bd.sQnC(ope.id, num);}
			else if(pp == k.DIREC){ bd.sDiC(ope.id, num);}
			else if(pp == k.QANS){ bd.sQaC(ope.id, num);}
			else if(pp == k.QSUB){ bd.sQsC(ope.id, num);}
			else if(pp == k.CELL && !!num){ bd.cell[ope.id] = num;}
			this.paintStack(bd.cell[ope.id].cx, bd.cell[ope.id].cy, bd.cell[ope.id].cx, bd.cell[ope.id].cy);
		}
		else if(ope.obj == k.EXCELL){
			if     (pp == k.QNUM){ bd.sQnE(ope.id, num);}
			else if(pp == k.DIREC){ bd.sDiE(ope.id, num);}
			else if(pp == k.EXCELL && !!num){ bd.excell[ope.id] = num;}
		}
		else if(ope.obj == k.CROSS){
			if     (pp == k.QUES){ bd.sQuX(ope.id, num);}
			else if(pp == k.QNUM){ bd.sQnX(ope.id, num);}
			else if(pp == k.CROSS && !!num){ bd.cross[ope.id] = num;}
			this.paintStack(bd.cross[ope.id].cx-1, bd.cross[ope.id].cy-1, bd.cross[ope.id].cx, bd.cross[ope.id].cy);
		}
		else if(ope.obj == k.BORDER){
			if     (pp == k.QUES){ bd.sQuB(ope.id, num);}
			else if(pp == k.QNUM){ bd.sQnB(ope.id, num);}
			else if(pp == k.QANS){ bd.sQaB(ope.id, num);}
			else if(pp == k.QSUB){ bd.sQsB(ope.id, num);}
			else if(pp == k.LINE){ bd.sLiB(ope.id, num);}
			else if(pp == k.BORDER && !!num){ bd.border[ope.id] = num;}
			this.paintBorder(ope.id);
		}
		else if(ope.obj == k.BOARD){
			this.disableInfo();
			if     (pp == 'expandup'){ if(num==1){ menu.ex.expand(k.UP);}else{ menu.ex.reduce(k.UP);} }
			else if(pp == 'expanddn'){ if(num==1){ menu.ex.expand(k.DN);}else{ menu.ex.reduce(k.DN);} }
			else if(pp == 'expandlt'){ if(num==1){ menu.ex.expand(k.LT);}else{ menu.ex.reduce(k.LT);} }
			else if(pp == 'expandrt'){ if(num==1){ menu.ex.expand(k.RT);}else{ menu.ex.reduce(k.RT);} }
			else if(pp == 'reduceup'){ if(num==1){ menu.ex.reduce(k.UP);}else{ menu.ex.expand(k.UP);} }
			else if(pp == 'reducedn'){ if(num==1){ menu.ex.reduce(k.DN);}else{ menu.ex.expand(k.DN);} }
			else if(pp == 'reducelt'){ if(num==1){ menu.ex.reduce(k.LT);}else{ menu.ex.expand(k.LT);} }
			else if(pp == 'reducert'){ if(num==1){ menu.ex.reduce(k.RT);}else{ menu.ex.expand(k.RT);} }

			else if(pp == 'flipy'){ menu.ex.turnflip(1,{x1:0,y1:0,x2:k.qcols-1,y2:k.qrows-1});}
			else if(pp == 'flipx'){ menu.ex.turnflip(2,{x1:0,y1:0,x2:k.qcols-1,y2:k.qrows-1});}
			else if(pp == 'turnr'){ menu.ex.turnflip((num==1?3:4),{x1:0,y1:0,x2:k.qcols-1,y2:k.qrows-1}); }
			else if(pp == 'turnl'){ menu.ex.turnflip((num==1?4:3),{x1:0,y1:0,x2:k.qcols-1,y2:k.qrows-1}); }

			this.range = { x1:0, y1:0, x2:k.qcols-1, y2:k.qrows-1};
			this.reqReset = true;
		}
	},
	//---------------------------------------------------------------------------
	// um.paintBorder()  Border�̎����`�悷�邽�߁A�ǂ͈̔͂܂ŕύX�����������L�����Ă���
	// um.paintStack()   �ύX���������͈͂�Ԃ�
	//---------------------------------------------------------------------------
	paintBorder : function(id){
		if(isNaN(id) || !bd.border[id]){ return;}
		if(bd.border[id].cx%2==1){
			this.paintStack(mf((bd.border[id].cx-1)/2)-1, mf(bd.border[id].cy/2)-1,
							mf((bd.border[id].cx-1)/2)+1, mf(bd.border[id].cy/2)   );
		}
		else{
			this.paintStack(mf(bd.border[id].cx/2)-1, mf((bd.border[id].cy-1)/2)-1,
							mf(bd.border[id].cx/2)  , mf((bd.border[id].cy-1)/2)+1 );
		}
	},
	paintStack : function(x1,y1,x2,y2){
		if(this.range.x1 > x1){ this.range.x1 = x1;}
		if(this.range.y1 > y1){ this.range.y1 = y1;}
		if(this.range.x2 < x2){ this.range.x2 = x2;}
		if(this.range.y2 < y2){ this.range.y2 = y2;}
	}
};
