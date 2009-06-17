// Answer.js v3.2.0

//---------------------------------------------------------------------------
// ��AnsCheck�N���X �����`�F�b�N�֘A�̊֐�������
//---------------------------------------------------------------------------

AreaInfo = function(){
	this.max = 0;
	this.check = new Array();
	this.room  = new Array();
};

// �񓚃`�F�b�N�N���X
// AnsCheck�N���X
AnsCheck = function(){
	this.performAsLine = false;
	this.errDisp = false;
	this.setError = true;
	this.inAutoCheck = false;
	this.alstr = { jp:'' ,en:''};
	this.lcnts = { cell:new Array(), total:new Array()};
	this.reset();
};
AnsCheck.prototype = {
	//---------------------------------------------------------------------------
	// ans.reset()        lcnts���̕ϐ��̏��������s��
	//---------------------------------------------------------------------------
	reset : function(){
		var self = this;
		if(k.isCenterLine){
			if(bd.border){ for(var c=0;c<bd.cell.length;c++){ self.lcnts.cell[c]=0;} };
			for(var i=1;i<=4;i++){ self.lcnts.cell[i]=0;}
			this.lcnts.total[0] = k.qcols*k.qrows;
		}
		else{
			if(bd.border){ for(var c=0;c<(k.qcols+1)*(k.qrows+1);c++){ self.lcnts.cell[c]=0;} };
			for(var i=1;i<=4;i++){ self.lcnts.cell[i]=0;}
			this.lcnts.total[0] = (k.qcols+1)*(k.qrows+1);
		}
	},

	//---------------------------------------------------------------------------
	// ans.check()     �����̃`�F�b�N���s��(checkAns()���Ăяo��)
	// ans.checkAns()  �����̃`�F�b�N���s��(�I�[�o�[���C�h�p)
	// ans.check1st()  �I�[�g�`�F�b�N���ɏ��߂ɔ�����s��(�I�[�o�[���C�h�p)
	// ans.setAlert()  check()����߂��Ă����Ƃ��ɕԂ��A�G���[���e��\������alert����ݒ肷��
	//---------------------------------------------------------------------------
	check : function(){
		this.inCheck = true;
		this.alstr = { jp:'' ,en:''};
		kc.keyreset();

		if(!this.checkAns()){
			alert((lang.isJP()||!this.alstr.en)?this.alstr.jp:this.alstr.en);
			this.errDisp = true;
			pc.paintAll();
			this.inCheck = false;
			return false;
		}

		alert(lang.isJP()?"�����ł��I":"Complete!");
		this.inCheck = false;
		return true;
	},
	checkAns : function(){},	//�I�[�o�[���C�h�p
	//check1st : function(){},	//�I�[�o�[���C�h�p
	setAlert : function(strJP, strEN){ this.alstr.jp = strJP; this.alstr.en = strEN;},

	//---------------------------------------------------------------------------
	// ans.autocheck()    �����̎����`�F�b�N���s��(alert���łȂ�������A�G���[�\�����s��Ȃ�)
	// ans.autocheck1st() autocheck�O�ɁA�y������������s��
	//
	// ans.disableSetError()  �Ֆʂ̃I�u�W�F�N�g�ɃG���[�t���O��ݒ�ł��Ȃ��悤�ɂ���
	// ans.enableSetError()   �Ֆʂ̃I�u�W�F�N�g�ɃG���[�t���O��ݒ�ł���悤�ɂ���
	// ans.isenableSetError() �Ֆʂ̃I�u�W�F�N�g�ɃG���[�t���O��ݒ�ł��邩�ǂ�����Ԃ�
	//---------------------------------------------------------------------------
	autocheck : function(){
		if(!k.autocheck || k.mode!=3 || this.inCheck){ return;}

		var ret = false;

		this.inCheck = true;
		this.disableSetError();

		if(this.autocheck1st() && this.checkAns() && this.inCheck){
			mv.mousereset();
			alert(lang.isJP()?"�����ł��I":"Complete!");
			ret = true;
			menu.setVal('autocheck',false);
		}
		this.enableSetError();
		this.inCheck = false;

		return ret;
	},
	// �����N�n�͏d���̂ōŏ��ɒ[�_�𔻒肷��
	autocheck1st : function(){
		if(this.check1st){ return this.check1st();}
		else if( (k.isCenterLine && !ans.checkLcntCell(1)) || (k.isborderAsLine && !ans.checkLcntCross(1,0)) ){ return false;}
		return true;
	},

	disableSetError  : function(){ this.setError = false;},
	enableSetError   : function(){ this.setError = true; },
	isenableSetError : function(){ return this.setError; },

	//---------------------------------------------------------------------------
	// ans.checkdir4Cell()     �㉺���E4�����ŏ���func==true�ɂȂ�}�X�̐����J�E���g����
	// ans.setErrLareaByCell() �ЂƂȂ���ɂȂ����������݂���}�X�ɃG���[��ݒ肷��
	// ans.setErrLareaById()   �ЂƂȂ���ɂȂ����������݂���}�X�ɃG���[��ݒ肷��
	//---------------------------------------------------------------------------
	checkdir4Cell : function(cc, func){
		if(cc<0 || cc>=bd.cell.length){ return 0;}
		var cnt = 0;
		if(bd.up(cc)!=-1 && func(bd.up(cc))){ cnt++;}
		if(bd.dn(cc)!=-1 && func(bd.dn(cc))){ cnt++;}
		if(bd.lt(cc)!=-1 && func(bd.lt(cc))){ cnt++;}
		if(bd.rt(cc)!=-1 && func(bd.rt(cc))){ cnt++;}
		return cnt;
	},

	setErrLareaByCell : function(area, c, val){ this.setErrLareaById(area, area.check[c], val); },
	setErrLareaById : function(area, areaid, val){
		var blist = new Array();
		for(var id=0;id<bd.border.length;id++){
			if(bd.LiB(id)!=1){ continue;}
			var cc1 = bd.cc1(id), cc2 = bd.cc2(id);
			if(cc1!=-1 && cc2!=-1 && area.check[cc1]==areaid && area.check[cc1]==area.check[cc2]){ blist.push(id);}
		}
		bd.sErB(blist,val);

		var clist = new Array();
		for(var c=0;c<bd.cell.length;c++){ if(area.check[c]==areaid && bd.QnC(c)!=-1){ clist.push(c);} }
		bd.sErC(clist,4);
	},

	//---------------------------------------------------------------------------
	// ans.checkAllCell()   ����func==true�ɂȂ�}�X����������G���[��ݒ肷��
	// ans.linkBWarea()     ���}�X/���}�X/�����ЂƂȂ��肩�ǂ����𔻒肷��
	// ans.check2x2Block()  2x2�̃Z�����S�ď���func==true�̎��A�G���[��ݒ肷��
	// ans.checkSideCell()  �ׂ荇����2�̃Z��������func==true�̎��A�G���[��ݒ肷��
	//---------------------------------------------------------------------------
	checkAllCell : function(func){
		for(var c=0;c<bd.cell.length;c++){
			if(func(c)){ bd.sErC([c],1); return false;}
		}
		return true;
	},
	linkBWarea : function(area){
		if(area.max>1){
			if(this.performAsLine){ bd.sErB(bd.borders,2); this.setErrLareaByCell(area,1,1); }
			if(!this.performAsLine || k.puzzleid=="firefly"){ bd.sErC(area.room[1],1);}
			return false;
		}
		return true;
	},
	check2x2Block : function(func){
		for(var c=0;c<bd.cell.length;c++){
			if(bd.cell[c].cx<k.qcols-1 && bd.cell[c].cy<k.qrows-1){
				if( func(c) && func(c+1) && func(c+k.qcols) && func(c+k.qcols+1) ){
					bd.sErC([c,c+1,c+k.qcols,c+k.qcols+1],1);
					return false;
				}
			}
		}
		return true;
	},
	checkSideCell : function(func){
		for(var c=0;c<bd.cell.length;c++){
			if(bd.cell[c].cx<k.qcols-1 && func(c,c+1)){
				bd.sErC([c,c+1],1); return false;
			}
			if(bd.cell[c].cy<k.qrows-1 && func(c,c+k.qcols)){
				bd.sErC([c,c+k.qcols],1); return false;
			}
		}
		return true;
	},

	//---------------------------------------------------------------------------
	// ans.isAreaRect()     ���ׂĂ�func�𖞂����}�X�ō\�������G���A���l�p�`�ł��邩�ǂ������肷��
	// ans.checkAllArea()   ���ׂĂ�func�𖞂����}�X�ō\�������G���A���T�C�Y����func2�𖞂������ǂ������肷��
	// ans.getSizeOfArea()  �w�肳�ꂽarea�̏㉺���E�̒[�ƁA���̒��ŏ���func�𖞂����Z���̑傫����Ԃ�
	// ans.getSizeOfClist() �w�肳�ꂽCell�̃��X�g�̏㉺���E�̒[�ƁA���̒��ŏ���func�𖞂����Z���̑傫����Ԃ�
	//---------------------------------------------------------------------------
	isAreaRect : function(area, func){ return this.checkAllArea(area, func, function(w,h,a){ return (w*h==a)}); },
	checkAllArea : function(area, func, func2){
		for(var id=1;id<=area.max;id++){
			var d = this.getSizeOfArea(area,id,func);
			if(!func2(d.x2-d.x1+1, d.y2-d.y1+1, d.cnt)){
				bd.sErC(area.room[id],1);
				return false;
			}
		}
		return true;
	},
	getSizeOfArea : function(area, id, func){
		return this.getSizeOfClist(area.room[id], func);
	},
	getSizeOfClist : function(clist, func){
		var d = { x1:k.qcols, x2:-1, y1:k.qrows, y2:-1, cnt:0 };
		for(var i=0;i<clist.length;i++){
			if(d.x1>bd.cell[clist[i]].cx){ d.x1=bd.cell[clist[i]].cx;}
			if(d.x2<bd.cell[clist[i]].cx){ d.x2=bd.cell[clist[i]].cx;}
			if(d.y1>bd.cell[clist[i]].cy){ d.y1=bd.cell[clist[i]].cy;}
			if(d.y2<bd.cell[clist[i]].cy){ d.y2=bd.cell[clist[i]].cy;}
			if(func(clist[i])){ d.cnt++;}
		}
		return d;
	},

	//---------------------------------------------------------------------------
	// ans.checkQnumCross()  cross������func==false�̎��A�G���[��ݒ肷��
	//---------------------------------------------------------------------------
	checkQnumCross : function(func){	//func(cr,bcnt){} -> �G���[�Ȃ�false��Ԃ��֐��ɂ���
		for(var c=0;c<bd.cross.length;c++){
			if(bd.QnX(c)<0){ continue;}
			if(!func(bd.QnX(c), bd.bcntCross(bd.cross[c].cx, bd.cross[c].cy))){
				bd.sErX([c],1);
				return false;
			}
		}
		return true;
	},

	//---------------------------------------------------------------------------
	// ans.isLoopLine()    ��������������[�v�ɂȂ��Ă��邩�ǂ����𔻒肷��
	// ans.isConnectLine() ������������ЂƂȂ���ɂȂ��Ă��邩�ǂ����𔻒肷��
	// ans.LineList()      ����������̂ЂƂȂ���̐��̃��X�g��Ԃ�
	// ans.checkOneLoop()  ���������������ǂ������肷��
	//---------------------------------------------------------------------------
	isLoopLine : function(startid){ return this.isConnectLine(startid, startid, -1); },
	isConnectLine : function(startid, terminal, startback){
		var forward = -1;
		var backward = startback;
		var here = startid;
		if(startid==-1){ return false;}
		while(k.qcols*k.qrows*3){
			forward = bd.forwardLine(here, backward);
			backward = here; here = forward;
			if(forward==terminal || forward==startid || forward==-1){ break;}
		}

		if(forward==terminal){ return true;}
		return false;
	},

	LineList : function(startid){
		if(startid==-1||startid==null){ return [];}
		var lists = [startid];
		var forward,backward, here;
		if(bd.backLine(startid)!=-1){
			here = startid;
			backward = bd.nextLine(startid);
			while(k.qcols*k.qrows*3){
				forward = bd.forwardLine(here, backward);
				backward = here; here = forward;
				if(forward==startid || forward==-1){ break;}
				lists.push(forward);
			}
		}
		if(forward!=startid && bd.nextLine(startid)!=-1){
			here = startid;
			backward = bd.backLine(startid);
			while(k.qcols*k.qrows*3){
				forward = bd.forwardLine(here, backward);
				backward = here; here = forward;
				if(forward==startid || forward==-1){ break;}
				lists.push(forward);
			}
		}
		return lists;
	},
	checkOneLoop : function(){
		var xarea = this.searchXarea();
		if(xarea.max>1){
			bd.sErB(bd.borders,2);
			bd.sErB(xarea.room[1],1);
			return false;
		}
		return true;
	},

	//---------------------------------------------------------------------------
	// ans.setLcnts()      ���������ꂽ�������Ă��肵�����ɁA�ϐ�lcnts�̓��e��ύX����
	// ans.lcntCell()      �Z���ɑ��݂�����̖{����Ԃ�
	// ans.checkLcntCell() �Z������o�Ă�����̖{���ɂ��Ĕ��肷��
	//---------------------------------------------------------------------------
	setLcnts : function(id, val){
		var cc1, cc2;
		if(k.isCenterLine){ cc1 = bd.cc1(id),      cc2 = bd.cc2(id);}
		else              { cc1 = bd.crosscc1(id), cc2 = bd.crosscc2(id);}

		if(val>0){
			if(cc1!=-1){ this.lcnts.total[this.lcnts.cell[cc1]]--; this.lcnts.cell[cc1]++; this.lcnts.total[this.lcnts.cell[cc1]]++;}
			if(cc2!=-1){ this.lcnts.total[this.lcnts.cell[cc2]]--; this.lcnts.cell[cc2]++; this.lcnts.total[this.lcnts.cell[cc2]]++;}
		}
		else{
			if(cc1!=-1){ this.lcnts.total[this.lcnts.cell[cc1]]--; this.lcnts.cell[cc1]--; this.lcnts.total[this.lcnts.cell[cc1]]++;}
			if(cc2!=-1){ this.lcnts.total[this.lcnts.cell[cc2]]--; this.lcnts.cell[cc2]--; this.lcnts.total[this.lcnts.cell[cc2]]++;}
		}
	},

	lcntCell : function(cc){ return col.lcntCell(cc);},
	checkLcntCell : function(val){
		if(this.lcnts.total[val]==0){ return true;}
		for(var c=0;c<bd.cell.length;c++){
			if(this.lcnts.cell[c]==val){
				if(!this.performAsLine){ bd.sErC([c],1);}
				else{ bd.sErB(bd.borders,2); this.setCellLineError(c,true);}
				return false;
			}
		}
		return true;
	},

	//---------------------------------------------------------------------------
	// ans.checkdir4Border()  �Z���̎���l�����Ɏ䂩��Ă��鋫�E���̖{���𔻒肷��
	// ans.checkdir4Border1() �Z���̎���l�����Ɏ䂩��Ă��鋫�E���̖{����Ԃ�
	// ans.checkenableLineParts() '�ꕔ����������Ă���'���̕����ɁA����������Ă��邩���肷��
	//---------------------------------------------------------------------------
	checkdir4Border : function(){
		for(var c=0;c<bd.cell.length;c++){
			if(bd.QnC(c)>=0 && this.checkdir4Border1(c)!=bd.QnC(c)){ bd.sErC([c],1); return false;}
		}
		return true;
	},
	checkdir4Border1 : function(cc){
		if(cc<0 || cc>=bd.cell.length){ return 0;}
		var func = function(id){ return (id!=-1&&((bd.QuB(id)==1)||(bd.QaB(id)==1)));};
		var cnt = 0;
		var cx = bd.cell[cc].cx; var cy = bd.cell[cc].cy;
		if( (k.isoutsideborder==0 && cy==0        ) || func(bd.bnum(cx*2+1,cy*2  )) ){ cnt++;}
		if( (k.isoutsideborder==0 && cy==k.qrows-1) || func(bd.bnum(cx*2+1,cy*2+2)) ){ cnt++;}
		if( (k.isoutsideborder==0 && cx==0        ) || func(bd.bnum(cx*2  ,cy*2+1)) ){ cnt++;}
		if( (k.isoutsideborder==0 && cx==k.qcols-1) || func(bd.bnum(cx*2+2,cy*2+1)) ){ cnt++;}
		return cnt;
	},

	checkenableLineParts : function(val){
		var func = function(i){
			return ((bd.ub(i)!=-1 && bd.LiB(bd.ub(i))==1 && bd.isnoLPup(i)) ||
					(bd.db(i)!=-1 && bd.LiB(bd.db(i))==1 && bd.isnoLPdown(i)) ||
					(bd.lb(i)!=-1 && bd.LiB(bd.lb(i))==1 && bd.isnoLPleft(i)) ||
					(bd.rb(i)!=-1 && bd.LiB(bd.rb(i))==1 && bd.isnoLPright(i)) ); };
		for(var i=0;i<bd.cell.length;i++){ if(func(i)){ bd.sErC([i],1); return false;} }
		return true;
	},

	//---------------------------------------------------------------------------
	// ans.isLineStraight()   �Z���̏�Ő������i���Ă��邩���肷��
	// ans.setCellLineError() �Z���Ǝ���̐��ɃG���[�t���O��ݒ肷��
	//---------------------------------------------------------------------------
	isLineStraight : function(cc){
		if     (this.lcntCell(cc)==3 || this.lcntCell(cc)==4){ return true;}
		else if(this.lcntCell(cc)==0 || this.lcntCell(cc)==1){ return false;}

		if     (bd.LiB(bd.ub(cc))==1 && bd.LiB(bd.db(cc))==1){ return true;}
		else if(bd.LiB(bd.lb(cc))==1 && bd.LiB(bd.rb(cc))==1){ return true;}

		return false;
	},

	setCellLineError : function(cc, flag){
		if(flag){ bd.sErC([cc],1);}
		bd.sErB([bd.ub(cc),bd.db(cc),bd.lb(cc),bd.rb(cc)], 1);
	},

	//---------------------------------------------------------------------------
	// ans.checkOneNumber()      �����̒���func==true�𖞂���Cell�̐���eval()==true���ǂ����𒲂ׂ�
	//                           ������func==true�ɂȂ�Z���̐��̔���A�����ɂ��鐔���ƍ��}�X�̐��̔�r�A
	//                           ���}�X�̖ʐςƓ����Ă��鐔���̔�r�Ȃǂɗp������
	// ans.checkBlackCellCount() �̈���̐����ƍ��}�X�̐��������������肷��
	// ans.checkDisconnectLine() �����ȂǂɌq�����Ă��Ȃ����̔�����s��
	// ans.checkNumberAndSize()  �G���A�ɂ��鐔���Ɩʐς������������肷��
	// ans.checkQnumsInArea()    �����ɂ��鐔���̐��̔�����s��
	// ans.checkBlackCellInArea()�����ɂ��鍕�}�X�̐��̔�����s��
	// ans,checkNoObjectInRoom() �G���A�Ɏw�肳�ꂽ�I�u�W�F�N�g���Ȃ��Ɣ��肷��
	//
	// ans.getQnumCellInArea()   �����̒��ň�ԍ���ɂ��鐔����Ԃ�
	// ans.getTopOfRoom()        ������TOP��Cell��ID��Ԃ�
	// ans.getCntOfRoom()        �����̖ʐς�Ԃ�
	// ans.getCellsOfRoom()      �����̒���func==true�ƂȂ�Z���̐���Ԃ�
	//---------------------------------------------------------------------------
	checkOneNumber : function(area, eval, func){
		for(var id=1;id<=area.max;id++){
			if(eval( bd.QnC(this.getQnumCellInArea(area,id)), this.getCellsOfRoom(area, id, func) )){
				if(this.performAsLine){ bd.sErB(bd.borders,2); this.setErrLareaById(area,id,1);}
				else{ bd.sErC(area.room[id],(k.puzzleid!="tateyoko"?1:4));}
				return false;
			}
		}
		return true;
	},
	checkBlackCellCount  : function(area)          { return this.checkOneNumber(area, function(top,cnt){ return (top>=0 && top!=cnt);}, function(c){ return bd.QaC(c)== 1;} );},
	checkDisconnectLine  : function(area)          { return this.checkOneNumber(area, function(top,cnt){ return (top==-1 && cnt==0); }, function(c){ return bd.QnC(c)!=-1;} );},
	checkNumberAndSize   : function(area)          { return this.checkOneNumber(area, function(top,cnt){ return (top> 0 && top!=cnt);}, f_true); },
	checkQnumsInArea     : function(area, func)    { return this.checkOneNumber(area, function(top,cnt){ return func(cnt);},            function(c){ return bd.QnC(c)!=-1;} );},
	checkBlackCellInArea : function(area, func)    { return this.checkOneNumber(area, function(top,cnt){ return func(cnt);},            function(c){ return bd.QaC(c)== 1;} );},
	checkNoObjectInRoom  : function(area, getvalue){ return this.checkOneNumber(area, function(top,cnt){ return (cnt==0); },            function(c){ return getvalue(c)!=-1;} );},

	getQnumCellInArea : function(area, areaid){
		if(k.isOneNumber){ return this.getTopOfRoom(area,areaid); }
		for(var i=0;i<area.room[areaid].length;i++){ if(bd.QnC(area.room[areaid][i])!=-1){ return area.room[areaid][i];} }
		return -1;
	},
	getTopOfRoom : function(area, areaid){
		var cc=-1;
		var ccx=k.qcols;
		for(var i=0;i<area.room[areaid].length;i++){
			var c = area.room[areaid][i];
			if(bd.cell[c].cx < ccx){ cc=c; ccx=bd.cell[c].cx; }
		}
		return cc;
	},
	getCntOfRoom : function(area, areaid){
		return area.room[areaid].length;
	},
	getCellsOfRoom : function(area, areaid, func){
		var cnt=0;
		for(var i=0;i<area.room[areaid].length;i++){ if(func(area.room[areaid][i])){ cnt++;} }
		return cnt;
	},

	//---------------------------------------------------------------------------
	// ans.checkSideAreaCell()     ���E�����͂���Ń^�e���R�ɐڂ���Z���̔�����s��
	// ans.checkSeqBlocksInRoom()  �����̒�����ŁA���}�X���ЂƂȂ��肩�ǂ������肷��
	// ans.checkSameObjectInRoom() �����̒���getvalue�ŕ�����ނ̒l�������邱�Ƃ𔻒肷��
	// ans.checkObjectRoom()       getvalue�œ����l��������Z�����A�����̕����̕��U���Ă��邩���肷��
	//---------------------------------------------------------------------------
	checkSideAreaCell : function(area, func, flag){
		for(var id=0;id<bd.border.length;id++){
			if(bd.QuB(id)!=1&&bd.QaB(id)!=1){ continue;}
			var cc1 = bd.cc1(id), cc2 = bd.cc2(id);
			if(cc1!=-1 && cc2!=-1 && func(area, cc1, cc2)){
				if(!flag){ bd.sErC([cc1,cc2],1);}
				else{ bd.sErC(area.room[area.check[cc1]],1); bd.sErC(area.room[area.check[cc2]],1); }
				return false;
			}
		}
		return true;
	},

	checkSeqBlocksInRoom : function(rarea){
		for(var id=1;id<=rarea.max;id++){
			var area = new AreaInfo();
			var func = function(id){ return (id!=-1 && bd.QaC(id)==1); };
			for(var c=0;c<bd.cell.length;c++){ area.check.push(((rarea.check[c]==id && bd.QaC(c)==1)?0:-1));}
			for(var c=0;c<k.qcols*k.qrows;c++){ if(area.check[c]==0){ area.max++; area.room[area.max]=new Array(); this.sc0(func, area, c, area.max);} }
			if(area.max>1){
				bd.sErC(rarea.room[id],1);
				return false;
			}
		}
		return true;
	},

	checkSameObjectInRoom : function(area, getvalue){
		var d = new Array();
		for(var i=1;i<=area.max;i++){ d[i]=-1;}
		for(var c=0;c<bd.cell.length;c++){
			if(area.check[c]==-1 || getvalue(c)==-1){ continue;}
			if(d[area.check[c]]==-1 && getvalue(c)!=-1){ d[area.check[c]] = getvalue(c);}
			else if(d[area.check[c]]!=getvalue(c)){
				if(this.performAsLine){ bd.sErB(bd.borders,2); this.setErrLareaByCell(area,c,1);}
				else{ bd.sErC(area.room[area.check[c]],1);}
				if(k.puzzleid=="kaero"){
					for(var cc=0;cc<bd.cell.length;cc++){
						if(area.check[c]==area.check[cc] && this.getBeforeCell(cc)!=-1 && area.check[c]!=area.check[this.getBeforeCell(cc)]){
							bd.sErC([this.getBeforeCell(cc)],4);
						}
					}
				}
				return false;
			}
		}
		return true;
	},
	checkObjectRoom : function(area, getvalue){
		var d = new Array();
		var dmax = 0;
		for(var c=0;c<bd.cell.length;c++){ if(dmax<getvalue(c)){ dmax=getvalue(c);} }
		for(var i=0;i<=dmax;i++){ d[i]=-1;}
		for(var c=0;c<bd.cell.length;c++){
			if(getvalue(c)==-1){ continue;}
			if(d[getvalue(c)]==-1){ d[getvalue(c)] = area.check[c];}
			else if(d[getvalue(c)]!=area.check[c]){
				var clist = new Array();
				for(var cc=0;cc<bd.cell.length;cc++){
					if(k.puzzleid=="kaero"){ if(getvalue(c)==bd.QnC(cc)){ clist.push(cc);}}
					else{ if(area.check[c]==area.check[cc] || d[getvalue(c)]==area.check[cc]){ clist.push(cc);} }
				}
				bd.sErC(clist,1);
				return false;
			}
		}
		return true;
	},

	//---------------------------------------------------------------------------
	// ans.checkLcntCross()      �����_�Ƃ̎���l�����̋��E���̐��𔻒肷��(bp==1:���_���ł���Ă���ꍇ)
	// ans.setCrossBorderError() �����_�Ƃ��̎���l�����ɃG���[�t���O��ݒ肷��
	//---------------------------------------------------------------------------
	checkLcntCross : function(val, bp){
		for(var i=0;i<(k.qcols+1)*(k.qrows+1);i++){
			var cx = i%(k.qcols+1), cy = mf(i/(k.qcols+1));
			if(k.isoutsidecross==0 && k.isborderAsLine==0 && (cx==0||cy==0||cx==k.qcols||cy==k.qrows)){ continue;}
			var lcnts = this.lcnts.cell[i] + ((k.isoutsideborder==0&&(cx==0||cy==0||cx==k.qcols||cy==k.qrows))?2:0);
			if(lcnts==val && (bp==0 || (bp==1&&bd.QnX(bd.xnum(cx, cy))==1) || (bp==2&&bd.QnX(bd.xnum(cx, cy))!=1) )){
				bd.sErB(bd.borders,2);
				this.setCrossBorderError(cx,cy);
				return false;
			}
		}
		return true;
	},
	setCrossBorderError : function(cx,cy){
		if(k.iscross){ bd.sErX([bd.xnum(cx, cy)], 1);}
		bd.sErB([bd.bnum(cx*2,cy*2-1),bd.bnum(cx*2,cy*2+1),bd.bnum(cx*2-1,cy*2),bd.bnum(cx*2+1,cy*2)], 1);
	},

	//---------------------------------------------------------------------------
	// ans.searchWarea()   �Ֆʂ̔��}�X�̃G���A����AreaInfo(cell)�I�u�W�F�N�g�Ŏ擾����
	// ans.searchBarea()   �Ֆʂ̍��}�X�̃G���A����AreaInfo(cell)�I�u�W�F�N�g�Ŏ擾����
	// ans.searchBWarea()  searchWarea, searchBarea����Ă΂��֐�
	// ans.sc0()           searchBWarea����Ă΂��ċA�Ăяo���p�֐�
	//
	// ans.searchRarea()   �Ֆʂ̋��E���ŋ�؂�ꂽ��������AreaInfo(cell)�I�u�W�F�N�g�Ŏ擾����
	// ans.searchLarea()   �Ֆʏ�Ɉ�����Ă�����łȂ������G���A����AreaInfo(cell)�I�u�W�F�N�g�Ŏ擾����
	// ans.searchRLrea()   searchRarea, searchLarea����Ă΂��֐�
	// ans.sr0()           searchRLarea����Ă΂��ċN�Ăяo���p�֐�
	//---------------------------------------------------------------------------
	searchWarea : function(){
		return this.searchBWarea(function(id){ return (id!=-1 && bd.QaC(id)!=1); });
	},
	searchBarea : function(){
		return this.searchBWarea(function(id){ return (id!=-1 && bd.QaC(id)==1); });
	},
	searchBWarea : function(func){
		var area = new AreaInfo();
		for(var c=0;c<bd.cell.length;c++){ area.check[c]=(func(c)?0:-1);}
		for(var c=0;c<bd.cell.length;c++){ if(area.check[c]==0){ area.max++; area.room[area.max]=new Array(); this.sc0(func, area, c, area.max);} }
		return area;
	},
	sc0 : function(func, area, i, areaid){
		if(area.check[i]!=0){ return;}
		area.check[i] = areaid;
		area.room[areaid].push(i);
		if( func(bd.up(i)) ){ this.sc0(func, area, bd.up(i), areaid);}
		if( func(bd.dn(i)) ){ this.sc0(func, area, bd.dn(i), areaid);}
		if( func(bd.lt(i)) ){ this.sc0(func, area, bd.lt(i), areaid);}
		if( func(bd.rt(i)) ){ this.sc0(func, area, bd.rt(i), areaid);}
		return;
	},

	searchRarea : function(){
		return this.searchRLarea(function(id){ return (id!=-1 && bd.QuB(id)==0 && bd.QaB(id)==0); }, false);
	},
	searchLarea : function(){
		return this.searchRLarea(function(id){ return (id!=-1 && bd.LiB(id)>0); }, true);
	},
	searchRLarea : function(func, flag){
		var area = new AreaInfo();
		for(var c=0;c<bd.cell.length;c++){ area.check[c]=((!flag||this.lcnts.cell[c]>0)?0:-1);}
		for(var c=0;c<bd.cell.length;c++){ if(area.check[c]==0){ area.max++; area.room[area.max]=new Array(); this.sr0(func, area, c, area.max);} }
		return area;
	},
	sr0 : function(func, area, i, areaid){
		if(area.check[i]!=0){ return;}
		area.check[i] = areaid;
		area.room[areaid].push(i);
		if( func(bd.ub(i)) ){ this.sr0(func, area, bd.up(i), areaid);}
		if( func(bd.db(i)) ){ this.sr0(func, area, bd.dn(i), areaid);}
		if( func(bd.lb(i)) ){ this.sr0(func, area, bd.lt(i), areaid);}
		if( func(bd.rb(i)) ){ this.sr0(func, area, bd.rt(i), areaid);}
		return;
	},

	//---------------------------------------------------------------------------
	// ans.searchXarea()   ����������̂Ȃ������AreaInfo(border)�I�u�W�F�N�g�Ŏ擾����
	// ans.setLineArea()   1�̂Ȃ��������ɃG���A�����Z�b�g����
	//---------------------------------------------------------------------------
	searchXarea : function(){
		var area = new AreaInfo();
		for(var id=0;id<bd.border.length;id++){ area.check[id]=((k.isborderAsLine==0?bd.LiB(id)==1:bd.QaB(id)==1)?0:-1); }
		for(var id=0;id<bd.border.length;id++){ if(area.check[id]==0){ this.setLineArea(area, this.LineList(id), area.max);} }
		return area;
	},
	setLineArea : function(area, idlist, areaid){
		area.max++;
		area.room[area.max] = idlist;
		for(var i=0;i<idlist.length;i++){if(idlist[i]>=0 && bd.border.length>idlist[i]){ area.check[idlist[i]] = area.max;} }
	}
};
