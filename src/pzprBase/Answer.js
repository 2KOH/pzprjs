// Answer.js v3.3.0

//---------------------------------------------------------------------------
// ��AnsCheck�N���X �����`�F�b�N�֘A�̊֐�������
//---------------------------------------------------------------------------

// �񓚃`�F�b�N�N���X
// AnsCheck�N���X
AnsCheck = function(){
	this.performAsLine = false;
	this.errDisp = false;
	this.setError = true;
	this.inCheck = false;
	this.inAutoCheck = false;
	this.alstr = { jp:'' ,en:''};
};
AnsCheck.prototype = {

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
		mv.mousereset();

		if(!this.checkAns()){
			alert((menu.isLangJP()||!this.alstr.en)?this.alstr.jp:this.alstr.en);
			this.errDisp = true;
			pc.paintAll();
			this.inCheck = false;
			return false;
		}

		alert(menu.isLangJP()?"�����ł��I":"Complete!");
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
		if(!pp.getVal('autocheck') || k.editmode || this.inCheck){ return;}

		var ret = false;

		this.inCheck = this.inAutoCheck = true;
		this.disableSetError();

		if(this.autocheck1st() && this.checkAns() && this.inCheck){
			mv.mousereset();
			alert(menu.isLangJP()?"�����ł��I":"Complete!");
			ret = true;
			pp.setVal('autocheck',false);
		}
		this.enableSetError();
		this.inCheck = this.inAutoCheck = false;

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
		if(cc<0 || cc>=bd.cellmax){ return 0;}
		var cnt = 0;
		if(bd.up(cc)!=-1 && func(bd.up(cc))){ cnt++;}
		if(bd.dn(cc)!=-1 && func(bd.dn(cc))){ cnt++;}
		if(bd.lt(cc)!=-1 && func(bd.lt(cc))){ cnt++;}
		if(bd.rt(cc)!=-1 && func(bd.rt(cc))){ cnt++;}
		return cnt;
	},

	setErrLareaByCell : function(cinfo, c, val){ this.setErrLareaById(cinfo, cinfo.id[c], val); },
	setErrLareaById : function(cinfo, areaid, val){
		var blist = [];
		for(var id=0;id<bd.bdmax;id++){
			if(!bd.isLine(id)){ continue;}
			var cc1 = bd.border[id].cellcc[0], cc2 = bd.border[id].cellcc[1];
			if(cc1!=-1 && cc2!=-1 && cinfo.id[cc1]==areaid && cinfo.id[cc1]==cinfo.id[cc2]){ blist.push(id);}
		}
		bd.sErB(blist,val);

		var clist = [];
		for(var c=0;c<bd.cellmax;c++){ if(cinfo.id[c]==areaid && bd.QnC(c)!=-1){ clist.push(c);} }
		bd.sErC(clist,4);
	},

	//---------------------------------------------------------------------------
	// ans.checkAllCell()   ����func==true�ɂȂ�}�X����������G���[��ݒ肷��
	// ans.checkOneArea()   ���}�X/���}�X/�����ЂƂȂ��肩�ǂ����𔻒肷��
	// ans.check2x2Block()  2x2�̃Z�����S�ď���func==true�̎��A�G���[��ݒ肷��
	// ans.checkSideCell()  �ׂ荇����2�̃Z��������func==true�̎��A�G���[��ݒ肷��
	//---------------------------------------------------------------------------
	checkAllCell : function(func){
		var result = true;
		for(var c=0;c<bd.cellmax;c++){
			if(func(c)){
				if(this.inAutoCheck){ return false;}
				bd.sErC([c],1);
				result = false;
			}
		}
		return result;
	},
	checkOneArea : function(cinfo){
		if(cinfo.max>1){
			if(this.performAsLine){ bd.sErBAll(2); this.setErrLareaByCell(cinfo,1,1); }
			if(!this.performAsLine || k.puzzleid=="firefly"){ bd.sErC(cinfo.room[1].idlist,1);}
			return false;
		}
		return true;
	},
	check2x2Block : function(func){
		var result = true;
		for(var c=0;c<bd.cellmax;c++){
			if(bd.cell[c].bx<bd.maxbx-1 && bd.cell[c].by<bd.maxby-1){
				if( func(c) && func(c+1) && func(c+k.qcols) && func(c+k.qcols+1) ){
					if(this.inAutoCheck){ return false;}
					bd.sErC([c,c+1,c+k.qcols,c+k.qcols+1],1);
					result = false;
				}
			}
		}
		return result;
	},
	checkSideCell : function(func){
		var result = true;
		for(var c=0;c<bd.cellmax;c++){
			if(bd.cell[c].bx<bd.maxbx-1 && func(c,c+1)){
				if(this.inAutoCheck){ return false;}
				bd.sErC([c,c+1],1);
				result = false;
			}
			if(bd.cell[c].by<bd.maxby-1 && func(c,c+k.qcols)){
				if(this.inAutoCheck){ return false;}
				bd.sErC([c,c+k.qcols],1);
				result = false;
			}
		}
		return result;
	},

	//---------------------------------------------------------------------------
	// ans.checkQnumCross()  cross������func==false�̎��A�G���[��ݒ肷��
	//---------------------------------------------------------------------------
	checkQnumCross : function(func){	//func(cr,bcnt){} -> �G���[�Ȃ�false��Ԃ��֐��ɂ���
		for(var c=0;c<bd.crossmax;c++){
			if(bd.QnX(c)<0){ continue;}
			if(!func(bd.QnX(c), bd.bcntCross(c))){
				bd.sErX([c],1);
				return false;
			}
		}
		return true;
	},

	//---------------------------------------------------------------------------
	// ans.checkOneLoop()  ���������������ǂ������肷��
	// ans.checkLcntCell() �Z������o�Ă�����̖{���ɂ��Ĕ��肷��
	// ans.isLineStraight()   �Z���̏�Ő������i���Ă��邩���肷��
	// ans.setCellLineError() �Z���Ǝ���̐��ɃG���[�t���O��ݒ肷��
	//---------------------------------------------------------------------------
	checkOneLoop : function(){
		var xinfo = line.getLineInfo();
		if(xinfo.max>1){
			bd.sErBAll(2);
			bd.sErB(xinfo.room[1].idlist,1);
			return false;
		}
		return true;
	},

	checkLcntCell : function(val){
		var result = true;
		if(line.ltotal[val]==0){ return true;}
		for(var c=0;c<bd.cellmax;c++){
			if(line.lcnt[c]==val){
				if(this.inAutoCheck){ return false;}
				if(!this.performAsLine){ bd.sErC([c],1);}
				else{ if(result){ bd.sErBAll(2);} this.setCellLineError(c,true);}
				result = false;
			}
		}
		return result;
	},

	isLineStraight : function(cc){
		if     (bd.isLine(bd.ub(cc)) && bd.isLine(bd.db(cc))){ return true;}
		else if(bd.isLine(bd.lb(cc)) && bd.isLine(bd.rb(cc))){ return true;}

		return false;
	},

	setCellLineError : function(cc, flag){
		if(flag){ bd.sErC([cc],1);}
		bd.sErB([bd.ub(cc),bd.db(cc),bd.lb(cc),bd.rb(cc)], 1);
	},

	//---------------------------------------------------------------------------
	// ans.checkdir4Border()  �Z���̎���l�����Ɏ䂩��Ă��鋫�E���̖{���𔻒肷��
	// ans.checkdir4Border1() �Z���̎���l�����Ɏ䂩��Ă��鋫�E���̖{����Ԃ�
	// ans.checkenableLineParts() '�ꕔ����������Ă���'���̕����ɁA����������Ă��邩���肷��
	//---------------------------------------------------------------------------
	checkdir4Border : function(){
		var result = true;
		for(var c=0;c<bd.cellmax;c++){
			if(bd.QnC(c)>=0 && this.checkdir4Border1(c)!=bd.QnC(c)){
				if(this.inAutoCheck){ return false;}
				bd.sErC([c],1);
				result = false;
			}
		}
		return result;
	},
	checkdir4Border1 : function(cc){
		if(cc<0 || cc>=bd.cellmax){ return 0;}
		var cnt = 0;
		var bx = bd.cell[cc].bx, by = bd.cell[cc].by;
		if( (k.isborder!==2 && by===bd.minby+1) || bd.isBorder(bd.bnum(bx  ,by-1)) ){ cnt++;}
		if( (k.isborder!==2 && by===bd.maxby-1) || bd.isBorder(bd.bnum(bx  ,by+1)) ){ cnt++;}
		if( (k.isborder!==2 && bx===bd.minbx+1) || bd.isBorder(bd.bnum(bx-1,by  )) ){ cnt++;}
		if( (k.isborder!==2 && bx===bd.maxby-1) || bd.isBorder(bd.bnum(bx+1,by  )) ){ cnt++;}
		return cnt;
	},

	checkenableLineParts : function(val){
		var result = true;
		var func = function(i){
			return ((bd.ub(i)!=-1 && bd.isLine(bd.ub(i)) && bd.isnoLPup(i)) ||
					(bd.db(i)!=-1 && bd.isLine(bd.db(i)) && bd.isnoLPdown(i)) ||
					(bd.lb(i)!=-1 && bd.isLine(bd.lb(i)) && bd.isnoLPleft(i)) ||
					(bd.rb(i)!=-1 && bd.isLine(bd.rb(i)) && bd.isnoLPright(i)) ); };
		for(var i=0;i<bd.cellmax;i++){
			if(func(i)){
				if(this.inAutoCheck){ return false;}
				bd.sErC([i],1);
				result = false;
			}
		}
		return result;
	},

	//---------------------------------------------------------------------------
	// ans.checkAllArea()    ���ׂĂ�func�𖞂����}�X�ō\�������G���A��evalfunc�𖞂������ǂ������肷��
	//
	// ans.checkDisconnectLine() �����ȂǂɌq�����Ă��Ȃ����̔�����s��
	// ans.checkNumberAndSize()  �G���A�ɂ��鐔���Ɩʐς������������肷��
	// ans.checkNoNumber()       �����ɐ������܂܂�Ă��Ȃ����̔�����s��
	// ans.checkDoubleNumber()   �����ɐ�����2�ȏ�܂܂�Ă��Ȃ��悤�ɔ�����s��
	// ans.checkTripleNumber()   �����ɐ�����3�ȏ�܂܂�Ă��Ȃ��悤�ɔ�����s��
	// ans.checkBlackCellCount() �̈���̐����ƍ��}�X�̐��������������肷��
	// ans.checkBlackCellInArea()�����ɂ��鍕�}�X�̐��̔�����s��
	// ans.checkAreaRect()       �̈悪�S�Ďl�p�`�ł��邩�ǂ������肷��
	// ans.checkLinesInArea()    �̈�̒��Ő����ʂ��Ă���Z���̐��𔻒肷��
	// ans.checkNoObjectInRoom() �G���A�Ɏw�肳�ꂽ�I�u�W�F�N�g���Ȃ��Ɣ��肷��
	//
	// ans.getQnumCellInArea() �����̒��ň�ԍ���ɂ��鐔����Ԃ�
	// ans.getSizeOfClist()    �w�肳�ꂽCell�̃��X�g�̏㉺���E�̒[�ƁA���̒��ŏ���func�𖞂����Z���̐���Ԃ�
	//---------------------------------------------------------------------------
	checkAllArea : function(cinfo, func, evalfunc){
		var result = true;
		for(var id=1;id<=cinfo.max;id++){
			var d = this.getSizeOfClist(cinfo.room[id].idlist,func);
			var n = bd.QnC(k.roomNumber ? area.getTopOfRoomByCell(cinfo.room[id].idlist[0])
										: this.getQnumCellOfClist(cinfo.room[id].idlist));
			if( !evalfunc(d.cols, d.rows, d.cnt, n) ){
				if(this.inAutoCheck){ return false;}
				if(this.performAsLine){ if(result){ bd.sErBAll(2);} this.setErrLareaById(cinfo,id,1);}
				else{ bd.sErC(cinfo.room[id].idlist,(k.puzzleid!="tateyoko"?1:4));}
				result = false;
			}
		}
		return result;
	},

	checkDisconnectLine  : function(cinfo){ return this.checkAllArea(cinfo, bd.isNum,   function(w,h,a,n){ return (n!=-1 || a>0); } );},
	checkNumberAndSize   : function(cinfo){ return this.checkAllArea(cinfo, f_true,     function(w,h,a,n){ return (n<= 0 || n==a);} );},

	checkNoNumber        : function(cinfo){ return this.checkAllArea(cinfo, bd.isNum,   function(w,h,a,n){ return (a!=0);}          );},
	checkDoubleNumber    : function(cinfo){ return this.checkAllArea(cinfo, bd.isNum,   function(w,h,a,n){ return (a< 2);}          );},
	checkTripleNumber    : function(cinfo){ return this.checkAllArea(cinfo, bd.isNum,   function(w,h,a,n){ return (a< 3);}          );},

	checkBlackCellCount  : function(cinfo)          { return this.checkAllArea(cinfo, bd.isBlack, function(w,h,a,n){ return (n<0 || n==a);} );},
	checkBlackCellInArea : function(cinfo, evalfunc){ return this.checkAllArea(cinfo, bd.isBlack, function(w,h,a,n){ return evalfunc(a);}     );},
	checkAreaRect        : function(cinfo)          { return this.checkAllArea(cinfo, f_true,     function(w,h,a,n){ return (w*h==a)});},

	checkLinesInArea     : function(cinfo, evalfunc){ return this.checkAllArea(cinfo, function(c){ return line.lcnt[c]>0;}, evalfunc);},
	checkNoObjectInRoom  : function(cinfo, getvalue){ return this.checkAllArea(cinfo, function(c){ return getvalue(c)!=-1;}, function(w,h,a,n){ return (a!=0);});},

	getQnumCellOfClist : function(clist){
		for(var i=0,len=clist.length;i<len;i++){
			if(bd.QnC(clist[i])!=-1){ return clist[i];}
		}
		return -1;
	},
	getSizeOfClist : function(clist, func){
		var d = { x1:bd.maxbx+1, x2:bd.minbx-1, y1:bd.maxby+1, y2:bd.minby-1, cols:0, rows:0, cnt:0 };
		for(var i=0;i<clist.length;i++){
			if(d.x1>bd.cell[clist[i]].bx){ d.x1=bd.cell[clist[i]].bx;}
			if(d.x2<bd.cell[clist[i]].bx){ d.x2=bd.cell[clist[i]].bx;}
			if(d.y1>bd.cell[clist[i]].by){ d.y1=bd.cell[clist[i]].by;}
			if(d.y2<bd.cell[clist[i]].by){ d.y2=bd.cell[clist[i]].by;}
			if(func(clist[i])){ d.cnt++;}
		}
		d.cols = (d.x2-d.x1+2)/2;
		d.rows = (d.y2-d.y1+2)/2;
		return d;
	},

	//---------------------------------------------------------------------------
	// ans.checkSideAreaSize()     ���E�����͂���Őڂ��镔����getval�œ�����T�C�Y���قȂ邱�Ƃ𔻒肷��
	// ans.checkSideAreaCell()     ���E�����͂���Ń^�e���R�ɐڂ���Z���̔�����s��
	// ans.checkSeqBlocksInRoom()  �����̒�����ŁA���}�X���ЂƂȂ��肩�ǂ������肷��
	// ans.checkSameObjectInRoom() �����̒���getvalue�ŕ�����ނ̒l�������邱�Ƃ𔻒肷��
	// ans.checkObjectRoom()       getvalue�œ����l��������Z�����A�����̕����̕��U���Ă��邩���肷��
	//---------------------------------------------------------------------------
	checkSideAreaSize : function(rinfo, getval){
		var adjs = [];
		for(var r=1;r<=rinfo.max-1;r++){
			adjs[r] = [];
			for(var s=r+1;s<=rinfo.max;s++){ adjs[r][s]=0;}
		}

		for(var id=0;id<bd.bdmax;id++){
			if(!bd.isBorder(id)){ continue;}
			var cc1 = bd.border[id].cellcc[0], cc2 = bd.border[id].cellcc[1];
			if(cc1==-1 || cc2==-1){ continue;}
			var r1=rinfo.id[cc1], r2=rinfo.id[cc2];
			try{
				if(r1<r2){ adjs[r1][r2]++;}
				if(r1>r2){ adjs[r2][r1]++;}
			}catch(e){ alert([r1,r2]); throw 0;}
		}

		for(var r=1;r<=rinfo.max-1;r++){
			for(var s=r+1;s<=rinfo.max;s++){
				if(adjs[r][s]==0){ continue;}
				var a1=getval(rinfo,r), a2=getval(rinfo,s);
				if(a1>0 && a2>0 && a1==a2){
					bd.sErC(rinfo.room[r].idlist,1);
					bd.sErC(rinfo.room[s].idlist,1);
					return false;
				}
			}
		}

		return true;
	},

	checkSideAreaCell : function(rinfo, func, flag){
		for(var id=0;id<bd.bdmax;id++){
			if(!bd.isBorder(id)){ continue;}
			var cc1 = bd.border[id].cellcc[0], cc2 = bd.border[id].cellcc[1];
			if(cc1!=-1 && cc2!=-1 && func(cc1, cc2)){
				if(!flag){ bd.sErC([cc1,cc2],1);}
				else{ bd.sErC(area.room[area.room.id[cc1]].clist,1); bd.sErC(area.room[area.room.id[cc2]].clist,1); }
				return false;
			}
		}
		return true;
	},

	checkSeqBlocksInRoom : function(){
		var result = true;
		for(var id=1;id<=area.room.max;id++){
			var data = {max:0,id:[]};
			for(var c=0;c<bd.cellmax;c++){ data.id[c] = ((area.room.id[c]==id && bd.isBlack(c))?0:-1);}
			for(var c=0;c<bd.cellmax;c++){
				if(data.id[c]!=0){ continue;}
				data.max++;
				data[data.max] = {clist:[]};
				area.sc0(c, data);
			}
			if(data.max>1){
				if(this.inAutoCheck){ return false;}
				bd.sErC(area.room[id].clist,1);
				result = false;
			}
		}
		return result;
	},

	checkSameObjectInRoom : function(rinfo, getvalue){
		var result = true;
		var d = [];
		for(var i=1;i<=rinfo.max;i++){ d[i]=-1;}
		for(var c=0;c<bd.cellmax;c++){
			if(rinfo.id[c]==-1 || getvalue(c)==-1){ continue;}
			if(d[rinfo.id[c]]==-1 && getvalue(c)!=-1){ d[rinfo.id[c]] = getvalue(c);}
			else if(d[rinfo.id[c]]!=getvalue(c)){
				if(this.inAutoCheck){ return false;}

				if(this.performAsLine){ bd.sErBAll(2); this.setErrLareaByCell(rinfo,c,1);}
				else{ bd.sErC(rinfo.room[rinfo.id[c]].idlist,1);}
				if(k.puzzleid=="kaero"){
					for(var cc=0;cc<bd.cellmax;cc++){
						if(rinfo.id[c]==rinfo.id[cc] && this.getBeforeCell(cc)!=-1 && rinfo.id[c]!=rinfo.id[this.getBeforeCell(cc)]){
							bd.sErC([this.getBeforeCell(cc)],4);
						}
					}
				}
				result = false;
			}
		}
		return result;
	},
	checkObjectRoom : function(rinfo, getvalue){
		var d = [];
		var dmax = 0;
		for(var c=0;c<bd.cellmax;c++){ if(dmax<getvalue(c)){ dmax=getvalue(c);} }
		for(var i=0;i<=dmax;i++){ d[i]=-1;}
		for(var c=0;c<bd.cellmax;c++){
			if(getvalue(c)==-1){ continue;}
			if(d[getvalue(c)]==-1){ d[getvalue(c)] = rinfo.id[c];}
			else if(d[getvalue(c)]!=rinfo.id[c]){
				var clist = [];
				for(var cc=0;cc<bd.cellmax;cc++){
					if(k.puzzleid=="kaero"){ if(getvalue(c)==bd.QnC(cc)){ clist.push(cc);}}
					else{ if(rinfo.id[c]==rinfo.id[cc] || d[getvalue(c)]==rinfo.id[cc]){ clist.push(cc);} }
				}
				bd.sErC(clist,1);
				return false;
			}
		}
		return true;
	},

	//---------------------------------------------------------------------------
	// ans.checkRowsCols()            �^�e��E���R��̐����̔�����s��
	// ans.checkRowsColsPartly()      ���}�X��[�_]���ŕ������^�e��E���R��̐����̔�����s��
	// ans.checkDifferentNumberInRoom() �����̒��ɓ������������݂��邩���肷��
	// ans.isDifferentNumberInClist() clist�̒��ɓ������������݂��邩���肷��
	//---------------------------------------------------------------------------
	checkRowsCols : function(evalfunc, numfunc){
		var result = true;
		for(var by=1;by<=bd.maxby;by+=2){
			var clist = bd.cellinside(bd.minbx+1,by,bd.maxbx-1,by);
			if(!evalfunc.apply(this,[clist, numfunc])){
				if(this.inAutoCheck){ return false;}
				result = false;
			}
		}
		for(var bx=1;bx<=bd.maxbx;bx+=2){
			var clist = bd.cellinside(bx,bd.minby+1,bx,bd.maxby-1);
			if(!evalfunc.apply(this,[clist, numfunc])){
				if(this.inAutoCheck){ return false;}
				result = false;
			}
		}
		return result;
	},
	checkRowsColsPartly : function(evalfunc, areainfo, termfunc, multierr){
		var result = true;
		for(var by=1;by<=bd.maxby;by+=2){
			var bx=1;
			while(bx<=bd.maxbx){
				for(var tx=bx;tx<=bd.maxbx;tx+=2){ if(termfunc.apply(this,[bd.cnum(tx,by)])){ break;}}
				var clist = bd.cellinside(bx,by,tx-2,by);
				var total = (k.isexcell!==1 ? 0 : (bx===1 ? bd.QnE(bd.exnum(-1,by)) : bd.QnC(bd.cnum(bx-2,by))));

				if(!evalfunc.apply(this,[total, [bx-2,by], clist, areainfo])){
					if(!multierr || this.inAutoCheck){ return false;}
					result = false;
				}
				bx = tx+2;
			}
		}
		for(var bx=1;bx<=bd.maxbx;bx+=2){
			var by=1;
			while(by<=bd.maxby){
				for(var ty=by;ty<=bd.maxby;ty+=2){ if(termfunc.apply(this,[bd.cnum(bx,ty)])){ break;}}
				var clist = bd.cellinside(bx,by,bx,ty-2);
				var total = (k.isexcell!==1 ? 0 : (by===1 ? bd.DiE(bd.exnum(bx,-1)) : bd.DiC(bd.cnum(bx,by-2))));

				if(!evalfunc.apply(this,[total, [bx,by-2], clist, areainfo])){
					if(!multierr || this.inAutoCheck){ return false;}
					result = false;
				}
				by = ty+2;
			}
		}
		return result;
	},

	checkDifferentNumberInRoom : function(rinfo, numfunc){
		var result = true;
		for(var id=1;id<=rinfo.max;id++){
			if(!this.isDifferentNumberInClist(rinfo.room[id].idlist, numfunc)){
				if(this.inAutoCheck){ return false;}
				bd.sErC(rinfo.room[id].idlist,1);
				result = false;
			}
		}
		return result;
	},
	isDifferentNumberInClist : function(clist, numfunc){
		var result = true, d = [], num = [], bottom = (k.dispzero?1:0);
		for(var n=bottom,max=bd.nummaxfunc(clist[0]);n<=max;n++){ d[n]=0;}
		for(var i=0;i<clist.length;i++){ num[clist[i]] = numfunc.apply(bd,[clist[i]]);}

		for(var i=0;i<clist.length;i++){ if(num[clist[i]]>=bottom){ d[num[clist[i]]]++;} }
		for(var i=0;i<clist.length;i++){
			if(num[clist[i]]>=bottom && d[num[clist[i]]]>=2){ bd.sErC([clist[i]],1); result = false;}
		}
		return result;
	},

	//---------------------------------------------------------------------------
	// ans.checkLcntCross()      �����_�Ƃ̎���l�����̋��E���̐��𔻒肷��(bp==1:���_���ł���Ă���ꍇ)
	// ans.setCrossBorderError() �����_�Ƃ��̎���l�����ɃG���[�t���O��ݒ肷��
	//---------------------------------------------------------------------------
	checkLcntCross : function(val, bp){
		var result = true;
		for(var by=0;by<=bd.maxby;by+=2){
			for(var bx=0;bx<=bd.maxbx;bx+=2){
				if(k.iscross===1 && !k.isborderAsLine &&
				   (bx===bd.minbx||by===bd.minby||bx===bd.maxbx||by===bd.maxby)){ continue;}
				var id = (bx>>1)+(by>>1)*(k.qcols+1);
				var lcnts = (!k.isborderAsLine?area.lcnt[id]:line.lcnt[id]);
				if(lcnts==val && (bp==0 || (bp==1&&bd.QnX(bd.xnum(bx,by))==1) || (bp==2&&bd.QnX(bd.xnum(bx,by))!=1) )){
					if(this.inAutoCheck){ return false;}
					if(result){ bd.sErBAll(2);}
					this.setCrossBorderError(bx,by);
					result = false;
				}
			}
		}
		return result;
	},
	setCrossBorderError : function(bx,by){
		if(k.iscross!==0){ bd.sErX([bd.xnum(bx,by)], 1);}
		bd.sErB([bd.bnum(bx,by-1),bd.bnum(bx,by+1),bd.bnum(bx-1,by),bd.bnum(bx+1,by)], 1);
	}
};
