// MenuExec.js v3.2.2

//---------------------------------------------------------------------------
// ��MenuExec�N���X �|�b�v�A�b�v�E�B���h�E���Ń{�^���������ꂽ���̏������e���L�q����
//---------------------------------------------------------------------------

// Menu�N���X���s��
MenuExec = function(){
	this.displaymanage = true;
	this.qnumw;	// Ques==51�̉�]����]�p
	this.qnumh;	// Ques==51�̉�]����]�p
	this.qnums;	// reduce��isOneNumber���̌㏈���p
};
MenuExec.prototype = {
	//------------------------------------------------------------------------------
	// menu.ex.modechange() ���[�h�ύX���̏������s��
	//------------------------------------------------------------------------------
	modechange : function(num){
		k.mode=num;
		kc.prev = -1;
		ans.errDisp=true;
		bd.errclear();
		if(kp.ctl[1].enable || kp.ctl[3].enable){ pp.funcs.keypopup();}
		tc.setAlign();
		pc.paintAll();
	},

	//------------------------------------------------------------------------------
	// menu.ex.newboard()  �V�K�Ֆʂ��쐬����
	//------------------------------------------------------------------------------
	newboard : function(e){
		if(menu.pop){
			var col,row;
			if(k.puzzleid!=="sudoku"){
				col = mf(parseInt(document.newboard.col.value));
				row = mf(parseInt(document.newboard.row.value));
			}
			else{
				if     (document.newboard.size[0].checked){ col=row= 9;}
				else if(document.newboard.size[1].checked){ col=row=16;}
				else if(document.newboard.size[2].checked){ col=row=25;}
				else if(document.newboard.size[3].checked){ col=row= 4;}
			}

			if(col>0 && row>0){ bd.initBoardSize(col,row);}
			um.allerase();
			menu.popclose();
			base.resetInfo();
			base.resize_canvas();				// Canvas���X�V����
		}
	},

	//------------------------------------------------------------------------------
	// menu.ex.urlinput()   URL����͂���
	// menu.ex.urloutput()  URL���o�͂���
	// menu.ex.openurl()    �u����URL���J���v�����s����
	//------------------------------------------------------------------------------
	urlinput : function(e){
		if(menu.pop){
			enc.parseURI(document.urlinput.ta.value);
			enc.pzlinput();

			tm.reset();
			menu.popclose();
		}
	},
	urloutput : function(e){
		if(menu.pop){
			switch(getSrcElement(e).name){
				case "pzprv3":     enc.pzlexport(0); break;
				case "pzprapplet": enc.pzlexport(1); break;
				case "kanpen":     enc.pzlexport(2); break;
				case "pzprv3edit": enc.pzlexport(3); break;
				case "heyaapp":    enc.pzlexport(4); break;
			}
		}
	},
	openurl : function(e){
		if(menu.pop){
			if(document.urloutput.ta.value!==''){
				var win = window.open(document.urloutput.ta.value, '', '');
			}
		}
	},

	//------------------------------------------------------------------------------
	// menu.ex.fileopen()  �t�@�C�����J��
	// menu.ex.filesave()  �t�@�C����ۑ�����
	// menu.ex.filesave2() pencilboxo�`���̃t�@�C����ۑ�����
	//------------------------------------------------------------------------------
	fileopen : function(e){
		if(menu.pop){ menu.popclose();}
		if(document.fileform.filebox.value){
			document.fileform.submit();
			document.fileform.filebox.value = "";
			tm.reset();
		}
	},
	filesave  : function(e){ fio.filesave(1);},
	filesave2 : function(e){ fio.filesave(2);},

	//------------------------------------------------------------------------------
	// menu.ex.dispsize()  Canvas�ł̃}�X�ڂ̕\���T�C�Y��ύX����
	//------------------------------------------------------------------------------
	dispsize : function(e){
		if(menu.pop){
			var csize = parseInt(document.dispsize.cs.value);

			if(csize>0){
				k.def_psize = mf(csize*(k.def_psize/k.def_csize));
				if(k.def_psize===0){ k.def_psize=1;}
				k.def_csize = mf(csize);
			}
			menu.popclose();
			base.resize_canvas();	// Canvas���X�V����
		}
	},

	//---------------------------------------------------------------------------
	// menu.ex.irowakeRemake() �u�F�������Ȃ����v�{�^�������������ɐF�������Ȃ���
	//---------------------------------------------------------------------------
	irowakeRemake : function(){
		if(!menu.getVal('irowake')){ return;}

		for(var i=1;i<=line.data.max;i++){
			var idlist = line.data[i].idlist;
			if(idlist.length>0){
				var newColor = pc.getNewLineColor();
				for(n=0;n<idlist.length;n++){
					bd.border[idlist[n]].color = newColor;
				}
			}
		}
		pc.paint(0,0,k.qcols-1,k.qrows-1);
	},

	//------------------------------------------------------------------------------
	// menu.ex.dispman()    �Ǘ��̈���B��/�\�����邪�����ꂽ���ɓ��삷��
	// menu.ex.dispmanstr() �Ǘ��̈���B��/�\������ɂǂ̕������\�����邩
	//------------------------------------------------------------------------------
	dispman : function(e){
		var idlist = ['expression','usepanel','checkpanel'];
		var sparatorlist = (k.callmode==="pmake")?['separator1']:['separator1','separator2'];

		if(this.displaymanage){
			for(var i=0;i<idlist.length;i++){ $("#"+idlist[i]).hide(800, base.resize_canvas.bind(base));}
			for(var i=0;i<sparatorlist.length;i++){ $("#"+sparatorlist[i]).hide();}
			if(k.irowake!=0 && menu.getVal('irowake')){ $("#btncolor2").show();}
			$("#menuboard").css('padding-bottom','0pt');
		}
		else{
			for(var i=0;i<idlist.length;i++){ $("#"+idlist[i]).show(800, base.resize_canvas.bind(base));}
			for(var i=0;i<sparatorlist.length;i++){ $("#"+sparatorlist[i]).show();}
			if(k.irowake!=0 && menu.getVal('irowake')){ $("#btncolor2").hide();}
			$("#menuboard").css('padding-bottom','8pt');
		}
		this.displaymanage = !this.displaymanage;
		this.dispmanstr();
	},
	dispmanstr : function(){
		if(!this.displaymanage){ $("#ms_manarea").html(menu.isLangJP()?"�Ǘ��̈��\��":"Show management area");}
		else                   { $("#ms_manarea").html(menu.isLangJP()?"�Ǘ��̈���B��":"Hide management area");}
	},

	//------------------------------------------------------------------------------
	// menu.ex.popupadjust()  "�Ֆʂ̒���""��]�E���]"�Ń{�^���������ꂽ����
	//                        �Ή�����֐��փW�����v����
	//------------------------------------------------------------------------------
	popupadjust : function(e){
		if(menu.pop){
			um.newOperation(true);

			var name = getSrcElement(e).name;
			if(name.indexOf("reduce")===0){
				if(name==="reduceup"||name==="reducedn"){
					if(k.qrows<=1){ return;}
				}
				else if(name==="reducelt"||name==="reducedn"){
					if(k.qcols<=1 && k.puzzleid!=="tawa"){ return;}
					else if(k.qcols<=1 && k.puzzleid==="tawa" && bd.lap!==3){ return;}
				}
			}

			um.disableInfo();
			switch(name){
				case "expandup": this.expand('up'); break;
				case "expanddn": this.expand('dn'); break;
				case "expandlt": this.expand('lt'); break;
				case "expandrt": this.expand('rt'); break;
				case "reduceup": this.reduce('up'); break;
				case "reducedn": this.reduce('dn'); break;
				case "reducelt": this.reduce('lt'); break;
				case "reducert": this.reduce('rt'); break;

				case "turnl": this.turnflip(4,{x1:0,y1:0,x2:k.qcols-1,y2:k.qrows-1}); break;
				case "turnr": this.turnflip(3,{x1:0,y1:0,x2:k.qcols-1,y2:k.qrows-1}); break;
				case "flipy": this.turnflip(1,{x1:0,y1:0,x2:k.qcols-1,y2:k.qrows-1}); break;
				case "flipx": this.turnflip(2,{x1:0,y1:0,x2:k.qcols-1,y2:k.qrows-1}); break;
			}
			um.enableInfo();

			// reduce�͂����K�{
			um.addOpe('board', name, 0, 0, 1);

			if(!um.undoExec){ base.resetInfo();}
			base.resize_canvas();				// Canvas���X�V����
		}
	},

	//------------------------------------------------------------------------------
	// menu.ex.expand()       �Ֆʂ̊g������s����
	// menu.ex.expandGroup()  �I�u�W�F�N�g�̒ǉ����s��
	// menu.ex.reduce()       �Ֆʂ̏k�������s����
	// menu.ex.reduceGroup()  �I�u�W�F�N�g�̏������s��
	//------------------------------------------------------------------------------
	expand : function(key){
		this.adjustSpecial(5,key);
		this.adjustGeneral(5,'',{x1:0,y1:0,x2:k.qcols-1,y2:k.qrows-1});

		var number;
		if     (key==='up'||key==='dn'){ number=k.qcols; k.qrows++; tc.maxy+=2;}
		else if(key==='lt'||key==='rt'){ number=k.qrows; k.qcols++; tc.maxx+=2;}

		var func;
		{
			func = function(id){ return (menu.ex.distObj(key,'cell',id)===0);};
			this.expandGroup('cell', bd.cell, number, func);
		}
		if(k.iscross){
			var oc = k.isoutsidecross?0:1;
			func = function(id){ return (menu.ex.distObj(key,'cross',id)===oc);};
			this.expandGroup('cross', bd.cross, number+1, func);
		}
		if(k.isborder){
			bd.bdinside = 2*k.qcols*k.qrows-(k.qcols+k.qrows);

			func = function(id){ var m=menu.ex.distObj(key,'border',id); return (m===1||m===2);};
			this.expandGroup('border', bd.border, 2*number+(k.isoutsideborder===0?-1:1), func);

			// �g�厞�ɁA���E���͐L�΂����Ⴂ�܂��B
			if(k.isborderAsLine===0){ this.expandborder(key);}
			else{ this.expandborderAsLine(key);}
		}
		if(k.isextendcell!==0){
			func = function(id){ return (menu.ex.distObj(key,'excell',id)===0);};
			this.expandGroup('excell', bd.excell, k.isextendcell, func);
		}

		bd.setposAll();

		this.adjustSpecial2(5,key);
	},
	expandGroup : function(type,group,margin,insfunc){
		for(var len=group.length,i=len;i<len+margin;i++){ group.push(bd.getnewObj(type,i));}
		this.setposObj(type);
		for(var i=group.length-1;i>=0;i--){
			if(insfunc(i)){
				group[i] = bd.getnewObj(type,i);
				margin--;
			}
			else if(margin>0){ group[i] = group[i-margin];}
		}
	},

	reduce : function(key){
		this.adjustSpecial(6,key);
		this.adjustGeneral(6,'',{x1:0,y1:0,x2:k.qcols-1,y2:k.qrows-1});

		var func, margin;
		{
			this.qnums = [];
			func = function(id){ return (menu.ex.distObj(key,'cell',id)===0);};
			margin = this.reduceGroup('cell', bd.cell, func);
		}
		if(k.iscross){
			var oc = k.isoutsidecross?0:1;
			func = function(id){ return (menu.ex.distObj(key,'cross',id)===oc);};
			margin = this.reduceGroup('cross', bd.cross, func);
		}
		if(k.isborder){
			if(k.isborderAsLine===1){ this.reduceborderAsLine(key);}

			if     (key==='up'||key==='dn'){ bd.bdinside = 2*k.qcols*(k.qrows-1)-(k.qcols+k.qrows-1);}
			else if(key==='lt'||key==='rt'){ bd.bdinside = 2*(k.qcols-1)*k.qrows-(k.qcols+k.qrows-1);}

			func = function(id){ var m=menu.ex.distObj(key,'border',id); return (m===1||m===2);};
			margin = this.reduceGroup('border', bd.border, func);
		}
		if(k.isextendcell!==0){
			func = function(id){ return (menu.ex.distObj(key,'excell',id)===0);};
			margin = this.reduceGroup('excell', bd.excell, func);
		}

		if     (key==='up'||key==='dn'){ k.qrows--; tc.maxy-=2;}
		else if(key==='lt'||key==='rt'){ k.qcols--; tc.maxx-=2;}

		bd.setposAll();
		if(k.isOneNumber){
			area.resetArea();
			for(var i=0;i<this.qnums.length;i++){
				bd.sQnC(area.getTopOfRoom(this.qnums[i].areaid), this.qnums[i].val);
			}
		}

		this.adjustSpecial2(6,key);
	},
	reduceGroup : function(type,group,exfunc){
		var margin=0;
		for(var i=0;i<group.length;i++){
			if(exfunc(i)){
				bd.hideNumobj(type,i);
				if(!bd.isNullObj(type,i)){ um.addObj(type,i);}
				margin++;

				if(type==='cell' && k.isOneNumber){
					if(bd.QnC(i)!==-1){ this.qnums.push({ areaid:area.getRoomID(i), val:bd.QnC(i)});}
					//area.setRoomID(i, -1);
				}
			}
			else if(margin>0){ group[i-margin] = group[i];}
		}
		for(var i=0;i<margin;i++){ group.pop();}

		return margin;
	},

	//------------------------------------------------------------------------------
	// menu.ex.turnflip()      ��]�E���]���������s����
	// menu.ex.turnflipGroup() turnflip()��������I�ɌĂ΂���]���s��
	//------------------------------------------------------------------------------
	turnflip : function(type,d){
		d.xx = (d.x1+d.x2); d.yy = (d.y1+d.y2);

		this.adjustSpecial(type,'');
		this.adjustGeneral(type,'',d);

		if(type===3||type===4){
			var tmp = k.qcols; k.qcols = k.qrows; k.qrows = tmp;
			tmp = tc.maxx; tc.maxx = tc.maxy; tc.maxy = tmp;
			bd.setposAll();
		}

		var func;
		{
			if     (type===1){ func = function(d,id){ return bd.cnum(bd.cell[id].cx, d.yy-bd.cell[id].cy);}; }
			else if(type===2){ func = function(d,id){ return bd.cnum(d.xx-bd.cell[id].cx, bd.cell[id].cy);}; }
			else if(type===3){ func = function(d,id){ return bd.cnum2(bd.cell[id].cy, d.yy-bd.cell[id].cx, k.qrows, k.qcols);}; }
			else if(type===4){ func = function(d,id){ return bd.cnum2(d.xx-bd.cell[id].cy, bd.cell[id].cx, k.qrows, k.qcols);}; }
			this.turnflipGroup(d, bd.cell, k.qcols*k.qrows, func);
		}
		if(k.iscross){
			if     (type===1){ func = function(d,id){ return bd.xnum(bd.cross[id].cx, (d.yy+1)-bd.cross[id].cy);}; }
			else if(type===2){ func = function(d,id){ return bd.xnum((d.xx+1)-bd.cross[id].cx, bd.cross[id].cy);}; }
			else if(type===3){ func = function(d,id){ return bd.xnum2(bd.cross[id].cy, (d.yy+1)-bd.cross[id].cx, k.qrows, k.qcols);}; }
			else if(type===4){ func = function(d,id){ return bd.xnum2((d.xx+1)-bd.cross[id].cy, bd.cross[id].cx, k.qrows, k.qcols);}; }
			this.turnflipGroup(d, bd.cross, (k.qcols+1)*(k.qrows+1), func);
		}
		if(k.isborder){
			if     (type===1){ func = function(d,id){ return bd.bnum(bd.border[id].cx, (d.yy+1)*2-bd.border[id].cy);}; }
			else if(type===2){ func = function(d,id){ return bd.bnum((d.xx+1)*2-bd.border[id].cx, bd.border[id].cy);}; }
			else if(type===3){ func = function(d,id){ return bd.bnum2(bd.border[id].cy, (d.yy+1)*2-bd.border[id].cx, k.qrows, k.qcols);}; }
			else if(type===4){ func = function(d,id){ return bd.bnum2((d.xx+1)*2-bd.border[id].cy, bd.border[id].cx, k.qrows, k.qcols);}; }
			this.turnflipGroup(d, bd.border, bd.bdinside+(k.isoutsideborder===0?0:2*(k.qcols+k.qrows)), func);
		}
		if(k.isextendcell===2){
			if     (type===1){ func = function(d,id){ return bd.exnum(bd.excell[id].cx, d.yy-bd.excell[id].cy);}; }
			else if(type===2){ func = function(d,id){ return bd.exnum(d.xx-bd.excell[id].cx, bd.excell[id].cy);}; }
			else if(type===3){ func = function(d,id){ return bd.exnum2(bd.excell[id].cy, d.yy-bd.excell[id].cx, k.qrows, k.qcols);}; }
			else if(type===4){ func = function(d,id){ return bd.exnum2(d.xx-bd.excell[id].cy, bd.excell[id].cx, k.qrows, k.qcols);}; }
			this.turnflipGroup(d, bd.excell, 2*(k.qcols+k.qrows)+4, func);
		}
		else if(k.isextendcell===1 && (type===1 || type===2)){
			if(type===1){
				for(var cy=d.y1;cy<d.yy/2;cy++){
					var c = bd.excell[bd.exnum(-1,cy)];
					bd.excell[bd.exnum(-1,cy)] = bd.excell[bd.exnum(-1,d.yy-cy)];
					bd.excell[bd.exnum(-1,d.yy-cy)] = c;
				}
			}
			else if(type===2){
				for(var cx=d.x1;cx<d.xx/2;cx++){
					var c = bd.excell[bd.exnum(cx,-1)];
					bd.excell[bd.exnum(cx,-1)] = bd.excell[bd.exnum(d.xx-cx,-1)];
					bd.excell[bd.exnum(d.xx-cx,-1)] = c;
				}
			}
		}

		bd.setposAll();
		this.adjustSpecial2(type,'');
	},
	turnflipGroup : function(d,group,maxcnt,getnext){
		var ch = []; for(var i=0;i<maxcnt;i++){ ch[i]=1;}
		for(var source=0;source<maxcnt;source++){
			if(ch[source]===0){ continue;}
			var tmp = group[source], target = source;
			while(ch[target]!==0){
				ch[target]=0;
				var next = getnext(d,target);

				if(ch[next]!==0){
					group[target] = group[next];
					target = next;
				}
				else{
					group[target] = tmp;
				}
			}
		}
	},

	//---------------------------------------------------------------------------
	// menu.ex.expandborder()       �Ֆʂ̊g�厞�A���E����L�΂�
	// menu.ex.expandborderAsLine() borderAsLine==1�ȃp�Y���̔Ֆʊg�厞�ɐ����ړ�����
	// menu.ex.reduceborderAsLine() borderAsLine==1�ȃp�Y���̔Ֆʏk�����ɐ����ړ�����
	// menu.ex.copyData()           �w�肵���f�[�^���R�s�[����
	//---------------------------------------------------------------------------
	expandborder : function(key){
		if(um.undoExec){ return;} // Undo���́A��ŃI�u�W�F�N�g��������̂ŉ��̏����̓p�X

		bd.setposBorders();
		for(var i=0;i<bd.bdmax;i++){
			if(this.distObj(key,'border',i)!==1){ continue;}

			var source = this.innerBorder(key,i);
			bd.border[i].ques  = bd.border[source].ques;
			bd.border[i].qans  = bd.border[source].qans;
		}
	},
	// m==0||m==1�Œ��ڈړ��ł����������ǁAexpandGroup()�ƕʂ�
	// �֐����K�v������̂Ŗ������ړ�������
	expandborderAsLine : function(key){
		bd.setposBorders();
		for(var i=0;i<bd.bdmax;i++){
			if(this.distObj(key,'border',i)!==2){ continue;}

			var source = this.outerBorder(key,i);
			this.copyData(i,source);
			bd.border[source].allclear(source);
		}
	},
	// borderAsLine���̖�����肪�Ȃ�Ƃ�����Ƃ�
	reduceborderAsLine : function(key){
		for(var i=0;i<bd.bdmax;i++){
			if(this.distObj(key,'border',i)!==0){ continue;}

			var source = this.innerBorder(key,i);
			this.copyData(i,source);
		}
	},
	copyData : function(id1,id2){
		bd.border[id1].qans  = bd.border[id2].qans;
		bd.border[id1].qsub  = bd.border[id2].qsub;
		bd.border[id1].ques  = bd.border[id2].ques;
		bd.border[id1].color = bd.border[id2].color;
	},

	//---------------------------------------------------------------------------
	// menu.ex.innerBorder()  (expand/reduceBorder�p) �ЂƂ����ɓ�����border��id��Ԃ�
	// menu.ex.outerBorder()  (expand/reduceBorder�p) �ЂƂO���ɍs����border��id��Ԃ�
	//---------------------------------------------------------------------------
	innerBorder : function(key,id){
		var bx=bd.border[id].cx, by=bd.border[id].cy;
		if     (key==='up'){ return bd.bnum(bx, by+2);}
		else if(key==='dn'){ return bd.bnum(bx, by-2);}
		else if(key==='lt'){ return bd.bnum(bx+2, by);}
		else if(key==='rt'){ return bd.bnum(bx-2, by);}
		return -1;
	},
	outerBorder : function(key,id){
		var bx=bd.border[id].cx, by=bd.border[id].cy;
		if     (key==='up'){ return bd.bnum(bx, by-2);}
		else if(key==='dn'){ return bd.bnum(bx, by+2);}
		else if(key==='lt'){ return bd.bnum(bx-2, by);}
		else if(key==='rt'){ return bd.bnum(bx+2, by);}
		return -1;
	},

	//---------------------------------------------------------------------------
	// menu.ex.setposObj()  �w�肳�ꂽ�^�C�v��setpos�֐����Ăяo��
	// menu.ex.distObj()    �㉺���E�����ꂩ�̊O�g�Ƃ̋��������߂�
	//---------------------------------------------------------------------------
	setposObj : function(type){
		if     (type==='cell')  { bd.setposCells();}
		else if(type==='cross') { bd.setposCrosses();}
		else if(type==='border'){ bd.setposBorders();}
		else if(type==='excell'){ bd.setposEXcells();}
	},
	distObj : function(key,type,id){
		if(type==='cell'){
			if     (key==='up'){ return bd.cell[id].cy;}
			else if(key==='dn'){ return (k.qrows-1)-bd.cell[id].cy;}
			else if(key==='lt'){ return bd.cell[id].cx;}
			else if(key==='rt'){ return (k.qcols-1)-bd.cell[id].cx;}
		}
		else if(type==='cross'){
			if     (key==='up'){ return bd.cross[id].cy;}
			else if(key==='dn'){ return k.qrows-bd.cross[id].cy;}
			else if(key==='lt'){ return bd.cross[id].cx;}
			else if(key==='rt'){ return k.qcols-bd.cross[id].cx;}
		}
		else if(type==='border'){
			if     (key==='up'){ return bd.border[id].cy;}
			else if(key==='dn'){ return 2*k.qrows-bd.border[id].cy;}
			else if(key==='lt'){ return bd.border[id].cx;}
			else if(key==='rt'){ return 2*k.qcols-bd.border[id].cx;}
		}
		else if(type==='excell'){
			if     (key==='up'){ return bd.excell[id].cy;}
			else if(key==='dn'){ return (k.qrows-1)-bd.excell[id].cy;}
			else if(key==='lt'){ return bd.excell[id].cx;}
			else if(key==='rt'){ return (k.qcols-1)-bd.excell[id].cx;}
		}
		return -1;
	},

	//------------------------------------------------------------------------------
	// menu.ex.adjustGeneral()  ��]�E���]���Ɋe�Z���̒��߂��s��(���ʏ���)
	// menu.ex.adjustSpecial()  ��]�E���]�E�Ֆʒ��ߊJ�n�O�Ɋe�Z���̒��߂��s��(�e�p�Y���̃I�[�o�[���C�h�p)
	// menu.ex.adjustSpecial2() ��]�E���]�E�Ֆʒ��ߏI����Ɋe�Z���̒��߂��s��(�e�p�Y���̃I�[�o�[���C�h�p)
	// menu.ex.adjustQues51_1() [�_]�Z���̒���(adjustSpecial�֐��ɑ������p)
	// menu.ex.adjustQues51_2() [�_]�Z���̒���(adjustSpecial2�֐��ɑ������p)
	//------------------------------------------------------------------------------
	adjustGeneral : function(type,key,d){
		um.disableRecord();
		for(var cy=d.y1;cy<=d.y2;cy++){
			for(var cx=d.x1;cx<=d.x2;cx++){
				var c = bd.cnum(cx,cy);

				switch(type){
				case 1: // �㉺���]
					if(true){
						var val = ({2:5,3:4,4:3,5:2,104:107,105:106,106:105,107:104})[bd.QuC(c)];
						if(!isNaN(val)){ bd.sQuC(c,val);}
					}
					if(k.isextendcell!==1){
						var val = ({1:2,2:1})[bd.DiC(c)];
						if(!isNaN(val)){ bd.sDiC(c,val);}
					}
					break;
				case 2: // ���E���]
					if(true){
						var val = ({2:3,3:2,4:5,5:4,104:105,105:104,106:107,107:106})[bd.QuC(c)];
						if(!isNaN(val)){ bd.sQuC(c,val);}
					}
					if(k.isextendcell!==1){
						var val = ({3:4,4:3})[bd.DiC(c)];
						if(!isNaN(val)){ bd.sDiC(c,val);}
					}
					break;
				case 3: // �E90�����]
					if(true){
						var val = {2:5,3:2,4:3,5:4,21:22,22:21,102:103,103:102,104:107,105:104,106:105,107:106}[bd.QuC(c)];
						if(!isNaN(val)){ bd.sQuC(c,val);}
					}
					if(k.isextendcell!==1){
						var val = {1:4,2:3,3:1,4:2}[bd.DiC(c)];
						if(!isNaN(val)){ bd.sDiC(c,val);}
					}
					break;
				case 4: // ��90�����]
					if(true){
						var val = {2:3,3:4,4:5,5:2,21:22,22:21,102:103,103:102,104:105,105:106,106:107,107:104}[bd.QuC(c)];
						if(!isNaN(val)){ bd.sQuC(c,val);}
					}
					if(k.isextendcell!==1){
						var val = {1:3,2:4,3:2,4:1}[bd.DiC(c)];
						if(!isNaN(val)){ bd.sDiC(c,val);}
					}
					break;
				case 5: // �Ֆʊg��
					break;
				case 6: // �Ֆʏk��
					break;
				}
			}
		}
		um.enableRecord();
	},
	adjustQues51_1 : function(type,key){
		this.qnumw = [];
		this.qnumh = [];

		for(var cy=0;cy<=k.qrows-1;cy++){
			this.qnumw[cy] = [bd.QnE(bd.exnum(-1,cy))];
			for(var cx=0;cx<=k.qcols-1;cx++){
				if(bd.QuC(bd.cnum(cx,cy))===51){ this.qnumw[cy].push(bd.QnC(bd.cnum(cx,cy)));}
			}
		}
		for(var cx=0;cx<=k.qcols-1;cx++){
			this.qnumh[cx] = [bd.DiE(bd.exnum(cx,-1))];
			for(var cy=0;cy<=k.qrows-1;cy++){
				if(bd.QuC(bd.cnum(cx,cy))===51){ this.qnumh[cx].push(bd.DiC(bd.cnum(cx,cy)));}
			}
		}
	},
	adjustQues51_2 : function(type,key){
		um.disableRecord();
		var idx;
		switch(type){
		case 1: // �㉺���]
			for(var cx=0;cx<=k.qcols-1;cx++){
				idx = 1; this.qnumh[cx] = this.qnumh[cx].reverse();
				bd.sDiE(bd.exnum(cx,-1), this.qnumh[cx][0]);
				for(var cy=0;cy<=k.qrows-1;cy++){
					if(bd.QuC(bd.cnum(cx,cy))===51){ bd.sDiC(bd.cnum(cx,cy), this.qnumh[cx][idx]); idx++;}
				}
			}
			break;
		case 2: // ���E���]
			for(var cy=0;cy<=k.qrows-1;cy++){
				idx = 1; this.qnumw[cy] = this.qnumw[cy].reverse();
				bd.sQnE(bd.exnum(-1,cy), this.qnumw[cy][0]);
				for(var cx=0;cx<=k.qcols-1;cx++){
					if(bd.QuC(bd.cnum(cx,cy))===51){ bd.sQnC(bd.cnum(cx,cy), this.qnumw[cy][idx]); idx++;}
				}
			}
			break;
		case 3: // �E90�����]
			for(var cy=0;cy<=k.qrows-1;cy++){
				idx = 1; this.qnumh[cy] = this.qnumh[cy].reverse();
				bd.sQnE(bd.exnum(-1,cy), this.qnumh[cy][0]);
				for(var cx=0;cx<=k.qcols-1;cx++){
					if(bd.QuC(bd.cnum(cx,cy))===51){ bd.sQnC(bd.cnum(cx,cy), this.qnumh[cy][idx]); idx++;}
				}
			}
			for(var cx=0;cx<=k.qcols-1;cx++){
				idx = 1;
				bd.sDiE(bd.exnum(cx,-1), this.qnumw[k.qcols-1-cx][0]);
				for(var cy=0;cy<=k.qrows-1;cy++){
					if(bd.QuC(bd.cnum(cx,cy))===51){ bd.sDiC(bd.cnum(cx,cy), this.qnumw[k.qcols-1-cx][idx]); idx++;}
				}
			}
			break;
		case 4: // ��90�����]
			for(var cy=0;cy<=k.qrows-1;cy++){
				idx = 1;
				bd.sQnE(bd.exnum(-1,cy), this.qnumh[k.qrows-1-cy][0]);
				for(var cx=0;cx<=k.qcols-1;cx++){
					if(bd.QuC(bd.cnum(cx,cy))===51){ bd.sQnC(bd.cnum(cx,cy), this.qnumh[k.qrows-1-cy][idx]); idx++;}
				}
			}
			for(var cx=0;cx<=k.qcols-1;cx++){
				idx = 1; this.qnumw[cx] = this.qnumw[cx].reverse();
				bd.sDiE(bd.exnum(cx,-1), this.qnumw[cx][0]);
				for(var cy=0;cy<=k.qrows-1;cy++){
					if(bd.QuC(bd.cnum(cx,cy))===51){ bd.sDiC(bd.cnum(cx,cy), this.qnumw[cx][idx]); idx++;}
				}
			}
			break;
		}
		um.enableRecord();
	},
	adjustSpecial  : function(type,key){ },
	adjustSpecial2 : function(type,key){ },

	//------------------------------------------------------------------------------
	// menu.ex.ACconfirm()  �u�񓚏����v�{�^�����������Ƃ��̏���
	// menu.ex.ASconfirm()  �u�⏕�����v�{�^�����������Ƃ��̏���
	//------------------------------------------------------------------------------
	ACconfirm : function(){
		if(confirm(menu.isLangJP()?"�񓚂��������܂����H":"Do you want to erase the Answer?")){
			um.newOperation(true);
			{
				for(var i=0;i<bd.cellmax;i++){
					if(bd.cell[i].qans!==bd.defcell.qans){ um.addOpe('cell','qans',i,bd.cell[i].qans,bd.defcell.qans);}
					if(bd.cell[i].qsub!==bd.defcell.qsub){ um.addOpe('cell','qsub',i,bd.cell[i].qsub,bd.defcell.qsub);}
				}
			}
			if(k.isborder){
				for(var i=0;i<bd.bdmax;i++){
					if(bd.border[i].qans!==bd.defborder.qans){ um.addOpe('border','qans',i,bd.border[i].qans,bd.defborder.qans);}
					if(bd.border[i].line!==bd.defborder.line){ um.addOpe('border','line',i,bd.border[i].line,bd.defborder.line);}
					if(bd.border[i].qsub!==bd.defborder.qsub){ um.addOpe('border','qsub',i,bd.border[i].qsub,bd.defborder.qsub);}
				}
			}
			if(!g.vml){ pc.flushCanvasAll();}

			bd.ansclear();
			base.resetInfo();
			pc.paintAll();
		}
	},
	ASconfirm : function(){
		if(confirm(menu.isLangJP()?"�⏕�L�����������܂����H":"Do you want to erase the auxiliary marks?")){
			um.newOperation(true);
			{
				for(var i=0;i<bd.cellmax;i++){
					if(bd.cell[i].qsub!==bd.defcell.qsub){ um.addOpe('cell','qsub',i,bd.cell[i].qsub,bd.defcell.qsub);}
				}
			}
			if(k.isborder){
				for(var i=0;i<bd.bdmax;i++){
					if(bd.border[i].qsub!==bd.defborder.qsub){ um.addOpe('border','qsub',i,bd.border[i].qsub,bd.defborder.qsub);}
				}
			}
			if(!g.vml){ pc.flushCanvasAll();}
			bd.subclear();
			pc.paintAll();
		}
	}
};
