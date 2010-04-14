// MenuExec.js v3.3.0

//---------------------------------------------------------------------------
// ��MenuExec�N���X �|�b�v�A�b�v�E�B���h�E���Ń{�^���������ꂽ���̏������e���L�q����
//---------------------------------------------------------------------------

// Menu�N���X���s��
MenuExec = function(){
	this.displaymanage = true;
	this.qnumw;	// Ques==51�̉�]����]�p
	this.qnumh;	// Ques==51�̉�]����]�p
	this.qnums;	// reduce��isOneNumber���̌㏈���p

	this.reader;	// FileReader�I�u�W�F�N�g
	this.enableReadText = false;
};
MenuExec.prototype = {
	//------------------------------------------------------------------------------
	// menu.ex.init() �I�u�W�F�N�g�̏���������
	//------------------------------------------------------------------------------
	init : function(){
		if(typeof FileReader == 'undefined'){
			this.reader = null;

			if(typeof FileList != 'undefined' &&
			   typeof File.prototype.getAsText != 'undefined')
			{
				this.enableGetText = true;
			}
		}
		else{
			this.reader = new FileReader();
			this.reader.onload = ee.ebinder(this, function(e){
				this.fileonload(ee.getSrcElement(e).result);
			});
		}
	},

	//------------------------------------------------------------------------------
	// menu.ex.modechange() ���[�h�ύX���̏������s��
	//------------------------------------------------------------------------------
	modechange : function(num){
		k.editmode = (num==1);
		k.playmode = (num==3);
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
			menu.popclose();

			base.resetInfo(true);
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
			switch(ee.getSrcElement(e).name){
				case "pzprv3":     document.urloutput.ta.value = enc.pzloutput(enc.PZPRV3);  break;
				case "pzprapplet": document.urloutput.ta.value = enc.pzloutput(enc.PAPRAPP); break;
				case "kanpen":     document.urloutput.ta.value = enc.pzloutput(enc.KANPEN);  break;
				case "pzprv3edit": document.urloutput.ta.value = enc.pzloutput(enc.PZPRV3E); break;
				case "heyaapp":    document.urloutput.ta.value = enc.pzloutput(enc.HEYAAPP); break;
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
	// menu.ex.fileopen()   �t�@�C�����J��
	// menu.ex.fileonload() File API�p�t�@�C�����J�����C�x���g�̏���
	// menu.ex.filesave()   �t�@�C����ۑ�����
	//------------------------------------------------------------------------------
	fileopen : function(e){
		if(menu.pop){ menu.popclose();}
		var fileEL = document.fileform.filebox;

		if(!!this.reader || this.enableGetText){
			var fitem = fileEL.files[0];
			if(!fitem){ return;}

			if(!!this.reader){ this.reader.readAsText(fitem);}
			else             { this.fileonload(fitem.getAsText(''));}
		}
		else{
			if(!fileEL.value){ return;}
			document.fileform.submit();
		}

		document.fileform.reset();
		tm.reset();
	},
	fileonload : function(data){
		var farray = data.split(/[\t\r\n]+/);
		var fstr = "";
		for(var i=0;i<farray.length;i++){
			if(farray[i].match(/^http\:\/\//)){ break;}
			fstr += (farray[i]+"/");
		}

		fio.filedecode(fstr);

		document.fileform.reset();
		tm.reset();
	},

	filesave : function(ftype){
		var fname = prompt("�ۑ�����t�@�C��������͂��ĉ������B", k.puzzleid+".txt");
		if(!fname){ return;}
		var prohibit = ['\\', '/', ':', '*', '?', '"', '<', '>', '|'];
		for(var i=0;i<prohibit.length;i++){ if(fname.indexOf(prohibit[i])!=-1){ alert('�t�@�C�����Ƃ��Ďg�p�ł��Ȃ��������܂܂�Ă��܂��B'); return;} }

		document.fileform2.filename.value = fname;

		if     (navigator.platform.indexOf("Win")!==-1){ document.fileform2.platform.value = "Win";}
		else if(navigator.platform.indexOf("Mac")!==-1){ document.fileform2.platform.value = "Mac";}
		else                                           { document.fileform2.platform.value = "Others";}

		document.fileform2.ques.value   = fio.fileencode(ftype);
		document.fileform2.urlstr.value = fio.urlstr;

		document.fileform2.submit();
	},

	//------------------------------------------------------------------------------
	// menu.ex.imagesave() �摜��ۑ�����
	//------------------------------------------------------------------------------
	imagesave : function(){
		// ���݂̐ݒ��ۑ�����
		var temp_flag = pc.fillTextPrecisely;
		var temp_size = k.def_psize;
		var temp_cursor = pp.getVal('cursor');

		// �ݒ�l�E�ϐ���canvas�p�̂��̂ɕύX
		pc.fillTextPrecisely = true;
		k.def_psize *= 0.1;
		pp.setVal('cursor', false);
		g = ee('divques_sub').el.getContext("2d");

		// canvas�v�f�̐ݒ��K�p���āA�ĕ`��
		base.resize_canvas();

		// canvas�̕`����e��DataURL�Ƃ��Ď擾����
		var url = g.canvas.toDataURL();

		window.open(url, '', '');

		// �ݒ�l�E�ϐ������ɖ߂�
		pc.fillTextPrecisely = temp_flag;
		k.def_psize = temp_size;
		pp.setVal('cursor', temp_cursor);
		base.initCanvas();

		// ���̑��̐ݒ�����ɖ߂��āA�ĕ`��
		base.resize_canvas();
	},

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
		line.newIrowake();
		if(pp.getVal('irowake')){ pc.paintAll();}
	},

	//------------------------------------------------------------------------------
	// menu.ex.dispman()    �Ǘ��̈���B��/�\�����邪�����ꂽ���ɓ��삷��
	// menu.ex.dispmanstr() �Ǘ��̈���B��/�\������ɂǂ̕������\�����邩
	//------------------------------------------------------------------------------
	dispman : function(e){
		var idlist = ['expression','usepanel','checkpanel'];
		var seplist = k.EDITOR ? ['separator1'] : ['separator1','separator2'];

		if(this.displaymanage){
			for(var i=0;i<idlist.length;i++)        { ee(idlist[i])  .el.style.display = 'none';}
			for(var i=0;i<seplist.length;i++)       { ee(seplist[i]) .el.style.display = 'none';}
			if(k.irowake!=0 && pp.getVal('irowake')){ ee('btncolor2').el.style.display = 'inline';}
			ee('menuboard').el.style.paddingBottom = '0pt';
		}
		else{
			for(var i=0;i<idlist.length;i++)        { ee(idlist[i])  .el.style.display = 'block';}
			for(var i=0;i<seplist.length;i++)       { ee(seplist[i]) .el.style.display = 'block';}
			if(k.irowake!=0 && pp.getVal('irowake')){ ee("btncolor2").el.style.display = 'none';}
			ee('menuboard').el.style.paddingBottom = '8pt';
		}
		this.displaymanage = !this.displaymanage;
		this.dispmanstr();

		base.resize_canvas();	// canvas�̍�����W�����X�V���čĕ`��
	},
	dispmanstr : function(){
		if(!this.displaymanage){ ee('ms_manarea').el.innerHTML = menu.isLangJP()?"�Ǘ��̈��\��":"Show management area";}
		else                   { ee('ms_manarea').el.innerHTML = menu.isLangJP()?"�Ǘ��̈���B��":"Hide management area";}
	},

	//------------------------------------------------------------------------------
	// menu.ex.popupadjust()  "�Ֆʂ̒���""��]�E���]"�Ń{�^���������ꂽ����
	//                        �Ή�����֐��փW�����v����
	//------------------------------------------------------------------------------
	popupadjust : function(e){
		if(menu.pop){
			um.newOperation(true);

			var name = ee.getSrcElement(e).name;
			if(name.indexOf("reduce")===0){
				if(name==="reduceup"||name==="reducedn"){
					if(k.qrows<=1){ return;}
				}
				else if(name==="reducelt"||name==="reducert"){
					if(k.qcols<=1 && (k.puzzleid!=="tawa" || bd.lap!==3)){ return;}
				}
			}

			um.disableInfo();
			switch(name){
				case "expandup": this.expand(k.UP); break;
				case "expanddn": this.expand(k.DN); break;
				case "expandlt": this.expand(k.LT); break;
				case "expandrt": this.expand(k.RT); break;
				case "reduceup": this.reduce(k.UP); break;
				case "reducedn": this.reduce(k.DN); break;
				case "reducelt": this.reduce(k.LT); break;
				case "reducert": this.reduce(k.RT); break;

				case "turnl": this.turnflip(4,{x1:bd.minbx, y1:bd.minby, x2:bd.maxbx, y2:bd.maxby}); break;
				case "turnr": this.turnflip(3,{x1:bd.minbx, y1:bd.minby, x2:bd.maxbx, y2:bd.maxby}); break;
				case "flipy": this.turnflip(1,{x1:bd.minbx, y1:bd.minby, x2:bd.maxbx, y2:bd.maxby}); break;
				case "flipx": this.turnflip(2,{x1:bd.minbx, y1:bd.minby, x2:bd.maxbx, y2:bd.maxby}); break;
			}
			um.enableInfo();

			// reduce�͂����K�{
			um.addOpe(k.BOARD, name, 0, 0, 1);

			bd.setminmax();
			if(!um.undoExec){ base.resetInfo(false);}
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
		this.adjustGeneral(5,'',{x1:bd.minbx, y1:bd.minby, x2:bd.maxbx, y2:bd.maxby});

		var number;
		if     (key===k.UP||key===k.DN){ number=k.qcols; k.qrows++;}
		else if(key===k.LT||key===k.RT){ number=k.qrows; k.qcols++;}

		var func;
		{
			func = function(id){ return (menu.ex.distObj(key,k.CELL,id)===0);};
			this.expandGroup(k.CELL, bd.cell, number, func);
		}
		if(k.iscross){
			var oc = k.isoutsidecross?0:1;
			func = function(id){ return (menu.ex.distObj(key,k.CROSS,id)===oc);};
			this.expandGroup(k.CROSS, bd.cross, number+1, func);
		}
		if(k.isborder){
			bd.bdinside = 2*k.qcols*k.qrows-(k.qcols+k.qrows);

			func = function(id){ var m=menu.ex.distObj(key,k.BORDER,id); return (m===1||m===2);};
			this.expandGroup(k.BORDER, bd.border, 2*number+(k.isoutsideborder===0?-1:1), func);

			// �g�厞�ɁA���E���͐L�΂����Ⴂ�܂��B
			if(k.isborderAsLine===0){ this.expandborder(key);}
			else{ this.expandborderAsLine(key);}
		}
		if(k.isextendcell!==0){
			func = function(id){ return (menu.ex.distObj(key,k.EXCELL,id)===0);};
			this.expandGroup(k.EXCELL, bd.excell, k.isextendcell, func);
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
		this.adjustGeneral(6,'',{x1:bd.minbx, y1:bd.minby, x2:bd.maxbx, y2:bd.maxby});

		var func, margin;
		{
			this.qnums = [];
			func = function(id){ return (menu.ex.distObj(key,k.CELL,id)===0);};
			margin = this.reduceGroup(k.CELL, bd.cell, func);
		}
		if(k.iscross){
			var oc = k.isoutsidecross?0:1;
			func = function(id){ return (menu.ex.distObj(key,k.CROSS,id)===oc);};
			margin = this.reduceGroup(k.CROSS, bd.cross, func);
		}
		if(k.isborder){
			if(k.isborderAsLine===1){ this.reduceborderAsLine(key);}

			if     (key===k.UP||key===k.DN){ bd.bdinside = 2*k.qcols*(k.qrows-1)-(k.qcols+k.qrows-1);}
			else if(key===k.LT||key===k.RT){ bd.bdinside = 2*(k.qcols-1)*k.qrows-(k.qcols+k.qrows-1);}

			func = function(id){ var m=menu.ex.distObj(key,k.BORDER,id); return (m===1||m===2);};
			margin = this.reduceGroup(k.BORDER, bd.border, func);
		}
		if(k.isextendcell!==0){
			func = function(id){ return (menu.ex.distObj(key,k.EXCELL,id)===0);};
			margin = this.reduceGroup(k.EXCELL, bd.excell, func);
		}

		if     (key===k.UP||key===k.DN){ k.qrows--;}
		else if(key===k.LT||key===k.RT){ k.qcols--;}

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

				if(type===k.CELL && k.isOneNumber){
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
			bd.setposAll();
		}

		var func;
		{
			func = ((type===1||type==2) ? bd.cnum : bd.cnum2);
			this.turnflipGroup(type, d, bd.cell, k.qcols*k.qrows, func);
		}
		if(k.iscross){
			func = ((type===1||type==2) ? bd.xnum : bd.xnum2);
			this.turnflipGroup(type, d, bd.cross, (k.qcols+1)*(k.qrows+1), func);
		}
		if(k.isborder){
			func = ((type===1||type==2) ? bd.bnum : bd.bnum2);
			this.turnflipGroup(type, d, bd.border, bd.bdinside+(k.isoutsideborder===0?0:2*(k.qcols+k.qrows)), func);
		}
		if(k.isextendcell===2){
			func = ((type===1||type==2) ? bd.exnum : bd.exnum2);
			this.turnflipGroup(type, d, bd.excell, 2*(k.qcols+k.qrows)+4, func);
		}
		else if(k.isextendcell===1 && (type===1 || type===2)){
			if(type===1){
				for(var by=(d.y1|1);by<d.yy/2;by+=2){
					var c = bd.excell[bd.exnum(-1,by)];
					bd.excell[bd.exnum(-1,by)] = bd.excell[bd.exnum(-1,d.yy-by)];
					bd.excell[bd.exnum(-1,d.yy-by)] = c;
				}
			}
			else if(type===2){
				for(var bx=(d.x1|1);bx<d.xx/2;bx+=2){
					var c = bd.excell[bd.exnum(bx,-1)];
					bd.excell[bd.exnum(bx,-1)] = bd.excell[bd.exnum(d.xx-bx,-1)];
					bd.excell[bd.exnum(d.xx-bx,-1)] = c;
				}
			}
		}

		bd.setposAll();
		this.adjustSpecial2(type,'');
	},
	turnflipGroup : function(type,d,group,maxcnt,getnext){
		var ch = []; for(var i=0;i<maxcnt;i++){ ch[i]=1;}
		for(var source=0;source<maxcnt;source++){
			if(ch[source]===0){ continue;}
			var tmp = group[source], target = source;
			while(ch[target]!==0){
				ch[target]=0;
				if     (type===1){ next = getnext.call(bd, group[target].bx, d.yy-group[target].by);}
				else if(type===2){ next = getnext.call(bd, d.xx-group[target].bx, group[target].by);}
				else if(type===3){ next = getnext.call(bd, group[target].by, d.yy-group[target].bx, k.qrows, k.qcols);}
				else if(type===4){ next = getnext.call(bd, d.xx-group[target].by, group[target].bx, k.qrows, k.qcols);}

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
			if(this.distObj(key,k.BORDER,i)!==1){ continue;}

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
			if(this.distObj(key,k.BORDER,i)!==2){ continue;}

			var source = this.outerBorder(key,i);
			this.copyData(i,source);
			bd.border[source].allclear(source);
		}
	},
	// borderAsLine���̖�����肪�Ȃ�Ƃ�����Ƃ�
	reduceborderAsLine : function(key){
		for(var i=0;i<bd.bdmax;i++){
			if(this.distObj(key,k.BORDER,i)!==0){ continue;}

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
		var bx=bd.border[id].bx, by=bd.border[id].by;
		if     (key===k.UP){ return bd.bnum(bx, by+2);}
		else if(key===k.DN){ return bd.bnum(bx, by-2);}
		else if(key===k.LT){ return bd.bnum(bx+2, by);}
		else if(key===k.RT){ return bd.bnum(bx-2, by);}
		return -1;
	},
	outerBorder : function(key,id){
		var bx=bd.border[id].bx, by=bd.border[id].by;
		if     (key===k.UP){ return bd.bnum(bx, by-2);}
		else if(key===k.DN){ return bd.bnum(bx, by+2);}
		else if(key===k.LT){ return bd.bnum(bx-2, by);}
		else if(key===k.RT){ return bd.bnum(bx+2, by);}
		return -1;
	},

	//---------------------------------------------------------------------------
	// menu.ex.setposObj()  �w�肳�ꂽ�^�C�v��setpos�֐����Ăяo��
	// menu.ex.distObj()    �㉺���E�����ꂩ�̊O�g�Ƃ̋��������߂�
	//---------------------------------------------------------------------------
	setposObj : function(type){
		if     (type===k.CELL)  { bd.setposCells();}
		else if(type===k.CROSS) { bd.setposCrosses();}
		else if(type===k.BORDER){ bd.setposBorders();}
		else if(type===k.EXCELL){ bd.setposEXcells();}
	},
	distObj : function(key,type,id){
		var obj;
		if     (type===k.CELL)  { obj = bd.cell[id];}
		else if(type===k.CROSS) { obj = bd.cross[id];}
		else if(type===k.BORDER){ obj = bd.border[id];}
		else if(type===k.EXCELL){ obj = bd.excell[id];}
		else{ return -1;}

		if     (key===k.UP){ return obj.by-bd.minby;}
		else if(key===k.DN){ return bd.maxby-obj.by;}
		else if(key===k.LT){ return obj.bx-bd.minbx;}
		else if(key===k.RT){ return bd.maxbx-obj.bx;}
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
		for(var by=(d.y1|1);by<=d.y2;by+=2){
			for(var bx=(d.x1|1);bx<=d.x2;bx+=2){
				var c = bd.cnum(bx,by);

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
		var d = {x1:bd.minbx, y1:bd.minby, x2:bd.maxbx, y2:bd.maxby};

		this.qnumw = [];
		this.qnumh = [];

		for(var by=(d.y1|1);by<=d.y2;by+=2){
			this.qnumw[by] = [bd.QnE(bd.exnum(-1,by))];
			for(var bx=(d.x1|1);bx<=d.x2;bx+=2){
				if(bd.QuC(bd.cnum(bx,by))===51){ this.qnumw[by].push(bd.QnC(bd.cnum(bx,by)));}
			}
		}
		for(var bx=(d.x1|1);bx<=d.x2;bx+=2){
			this.qnumh[bx] = [bd.DiE(bd.exnum(bx,-1))];
			for(var by=(d.y1|1);by<=d.y2;by+=2){
				if(bd.QuC(bd.cnum(bx,by))===51){ this.qnumh[bx].push(bd.DiC(bd.cnum(bx,by)));}
			}
		}
	},
	adjustQues51_2 : function(type,key){
		var d = {x1:bd.minbx, y1:bd.minby, x2:bd.maxbx, y2:bd.maxby};
		d.xx = (d.x1+d.x2); d.yy = (d.y1+d.y2);

		um.disableRecord();
		var idx;
		switch(type){
		case 1: // �㉺���]
			for(var bx=(d.x1|1);bx<=d.x2;bx+=2){
				idx = 1; this.qnumh[bx] = this.qnumh[bx].reverse();
				bd.sDiE(bd.exnum(bx,-1), this.qnumh[bx][0]);
				for(var by=(d.y1|1);by<=d.y2;by+=2){
					if(bd.QuC(bd.cnum(bx,by))===51){ bd.sDiC(bd.cnum(bx,by), this.qnumh[bx][idx]); idx++;}
				}
			}
			break;
		case 2: // ���E���]
			for(var by=(d.y1|1);by<=d.y2;by+=2){
				idx = 1; this.qnumw[by] = this.qnumw[by].reverse();
				bd.sQnE(bd.exnum(-1,by), this.qnumw[by][0]);
				for(var bx=(d.x1|1);bx<=d.x2;bx+=2){
					if(bd.QuC(bd.cnum(bx,by))===51){ bd.sQnC(bd.cnum(bx,by), this.qnumw[by][idx]); idx++;}
				}
			}
			break;
		case 3: // �E90�����]
			for(var by=(d.y1|1);by<=d.y2;by+=2){
				idx = 1; this.qnumh[by] = this.qnumh[by].reverse();
				bd.sQnE(bd.exnum(-1,by), this.qnumh[by][0]);
				for(var bx=(d.x1|1);bx<=d.x2;bx+=2){
					if(bd.QuC(bd.cnum(bx,by))===51){ bd.sQnC(bd.cnum(bx,by), this.qnumh[by][idx]); idx++;}
				}
			}
			for(var bx=(d.x1|1);bx<=d.x2;bx+=2){
				idx = 1;
				bd.sDiE(bd.exnum(bx,-1), this.qnumw[d.xx-bx][0]);
				for(var by=(d.y1|1);by<=d.y2;by+=2){
					if(bd.QuC(bd.cnum(bx,by))===51){ bd.sDiC(bd.cnum(bx,by), this.qnumw[d.xx-bx][idx]); idx++;}
				}
			}
			break;
		case 4: // ��90�����]
			for(var by=(d.y1|1);by<=d.y2;by+=2){
				idx = 1;
				bd.sQnE(bd.exnum(-1,by), this.qnumh[d.yy-by][0]);
				for(var bx=(d.x1|1);bx<=d.x2;bx+=2){
					if(bd.QuC(bd.cnum(bx,by))===51){ bd.sQnC(bd.cnum(bx,by), this.qnumh[d.yy-by][idx]); idx++;}
				}
			}
			for(var bx=(d.x1|1);bx<=d.x2;bx+=2){
				idx = 1; this.qnumw[bx] = this.qnumw[bx].reverse();
				bd.sDiE(bd.exnum(bx,-1), this.qnumw[bx][0]);
				for(var by=(d.y1|1);by<=d.y2;by+=2){
					if(bd.QuC(bd.cnum(bx,by))===51){ bd.sDiC(bd.cnum(bx,by), this.qnumw[bx][idx]); idx++;}
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
					if(bd.cell[i].qans!==bd.defcell.qans){ um.addOpe(k.CELL,k.QANS,i,bd.cell[i].qans,bd.defcell.qans);}
					if(bd.cell[i].qsub!==bd.defcell.qsub){ um.addOpe(k.CELL,k.QSUB,i,bd.cell[i].qsub,bd.defcell.qsub);}
				}
			}
			if(k.isborder){
				for(var i=0;i<bd.bdmax;i++){
					if(bd.border[i].qans!==bd.defborder.qans){ um.addOpe(k.BORDER,k.QANS,i,bd.border[i].qans,bd.defborder.qans);}
					if(bd.border[i].line!==bd.defborder.line){ um.addOpe(k.BORDER,k.LINE,i,bd.border[i].line,bd.defborder.line);}
					if(bd.border[i].qsub!==bd.defborder.qsub){ um.addOpe(k.BORDER,k.QSUB,i,bd.border[i].qsub,bd.defborder.qsub);}
				}
			}

			bd.ansclear();
			base.resetInfo(false);
			pc.paintAll();
		}
	},
	ASconfirm : function(){
		if(confirm(menu.isLangJP()?"�⏕�L�����������܂����H":"Do you want to erase the auxiliary marks?")){
			um.newOperation(true);
			{
				for(var i=0;i<bd.cellmax;i++){
					if(bd.cell[i].qsub!==bd.defcell.qsub){ um.addOpe(k.CELL,k.QSUB,i,bd.cell[i].qsub,bd.defcell.qsub);}
				}
			}
			if(k.isborder){
				for(var i=0;i<bd.bdmax;i++){
					if(bd.border[i].qsub!==bd.defborder.qsub){ um.addOpe(k.BORDER,k.QSUB,i,bd.border[i].qsub,bd.defborder.qsub);}
				}
			}

			bd.subclear();
			pc.paintAll();
		}
	}
};
