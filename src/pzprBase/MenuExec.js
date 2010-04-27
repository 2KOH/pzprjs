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

	// expand/reduce�����p
	this.insex = {};
	this.insex[k.CELL]   = {1:true};
	this.insex[k.CROSS]  = (k.iscross===1 ? {2:true} : {0:true});
	this.insex[k.BORDER] = {1:true, 2:true};
	this.insex[k.EXCELL] = {1:true};
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
		document.fileform2.operation.value = 'save';

		document.fileform2.submit();
	},

	//------------------------------------------------------------------------------
	// menu.ex.imagesave() �摜��ۑ�����
	//------------------------------------------------------------------------------
	imagesave : function(isDL){
		// ���݂̐ݒ��ۑ�����
		var temp_flag   = pc.fillTextPrecisely;
		var temp_margin = k.bdmargin;
		var temp_cursor = pp.getVal('cursor');

		// �ݒ�l�E�ϐ���canvas�p�̂��̂ɕύX
		pc.fillTextPrecisely = true;
		k.bdmargin = k.bdmargin_image;
		pp.setVal('cursor', false, false);
		g = ee('divques_sub').el.getContext("2d");

		// canvas�v�f�̐ݒ��K�p���āA�ĕ`��
		base.resize_canvas();

		// canvas�̕`����e��DataURL�Ƃ��Ď擾����
		var url = g.canvas.toDataURL();

		if(isDL){
			document.fileform2.filename.value  = k.puzzleid+'.gif';
			document.fileform2.urlstr.value    = url.replace('data:image/png;base64,', '');
			document.fileform2.operation.value = 'imagesave';
			document.fileform2.submit();
		}
		else{
			window.open(url, '', '');
		}

		// �ݒ�l�E�ϐ������ɖ߂�
		pc.fillTextPrecisely = temp_flag;
		k.bdmargin = temp_margin;
		pp.setVal('cursor', temp_cursor, false);
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
			if(csize>0){ k.cellsize = mf(csize);}

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

			var d = {x1:0, y1:0, x2:2*k.qcols, y2:2*k.qrows};
			d.xx=(d.x1+d.x2); d.yy=(d.y1+d.y2);

			um.disableInfo();
			switch(name){
				case "expandup": this.expand(k.UP,d); break;
				case "expanddn": this.expand(k.DN,d); break;
				case "expandlt": this.expand(k.LT,d); break;
				case "expandrt": this.expand(k.RT,d); break;
				case "reduceup": this.reduce(k.UP,d); break;
				case "reducedn": this.reduce(k.DN,d); break;
				case "reducelt": this.reduce(k.LT,d); break;
				case "reducert": this.reduce(k.RT,d); break;

				case "turnl": this.turnflip(4,d); break;
				case "turnr": this.turnflip(3,d); break;
				case "flipy": this.turnflip(1,d); break;
				case "flipx": this.turnflip(2,d); break;
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
	expand : function(key,d){
		this.adjustSpecial(5,key,d);
		this.adjustGeneral(5,'',d);

		var number;
		if     (key===k.UP||key===k.DN){ number=k.qcols; k.qrows++;}
		else if(key===k.LT||key===k.RT){ number=k.qrows; k.qcols++;}
		if(!!k.isborder){ bd.bdinside = 2*k.qcols*k.qrows-(k.qcols+k.qrows);}

						{ this.expandGroup(k.CELL,   bd.cell,   number,   key);}
		if(!!k.iscross) { this.expandGroup(k.CROSS,  bd.cross,  number+1, key);}
		if(!!k.isborder){ this.expandGroup(k.BORDER, bd.border, 2*number+(k.isborder===1?-1:1), key);}
		if(!!k.isexcell){ this.expandGroup(k.EXCELL, bd.excell, k.isexcell, key);}

		bd.setposAll();

		this.adjustSpecial2(5,key,d);
	},
	expandGroup : function(type,group,margin,key){
		for(var len=group.length,i=len;i<len+margin;i++){ group.push(bd.getnewObj(type,i));}
		this.setposObj(type);
		for(var i=group.length-1;i>=0;i--){
			if(!!this.insex[type][this.distObj(key,type,i)]){
				group[i] = bd.getnewObj(type,i);
				margin--;
			}
			else if(margin>0){ group[i] = group[i-margin];}
		}

		if(type===k.BORDER){ this.expandborder(key);}
	},

	reduce : function(key,d){
		this.adjustSpecial(6,key,d);
		this.adjustGeneral(6,'',d);
		if(k.roomNumber){ this.adjustForRoomNumber(key);}

						{ this.reduceGroup(k.CELL,   bd.cell,   key);}
		if(!!k.iscross) { this.reduceGroup(k.CROSS,  bd.cross,  key);}
		if(!!k.isborder){ this.reduceGroup(k.BORDER, bd.border, key);}
		if(!!k.isexcell){ this.reduceGroup(k.EXCELL, bd.excell, key);}

		if     (key===k.UP||key===k.DN){ k.qrows--;}
		else if(key===k.LT||key===k.RT){ k.qcols--;}
		if(!!k.isborder){ bd.bdinside = 2*k.qcols*k.qrows-(k.qcols+k.qrows);}

		bd.setposAll();

		if(k.roomNumber){ this.adjustForRoomNumber2(key);}
		this.adjustSpecial2(6,key,d);
	},
	reduceGroup : function(type,group,key){
		if(type===k.BORDER){ this.reduceborder(key);}

		var margin=0;
		for(var i=0;i<group.length;i++){
			if(!!this.insex[type][this.distObj(key,type,i)]){
				if(!bd.isNullObj(type,i)){ um.addObj(type,i);}
				margin++;
			}
			else if(margin>0){ group[i-margin] = group[i];}
		}
		for(var i=0;i<margin;i++){ group.pop();}
	},

	adjustForRoomNumber : function(key){
		this.qnums = [];
		for(var i=0;i<bd.cell.length;i++){
			if(!!this.insex[k.CELL][this.distObj(key,k.CELL,i)] && bd.cell[i].qnum!==-1){
				this.qnums.push({ areaid:area.getRoomID(i), val:bd.cell[i].qnum});
			}
		}
	},
	adjustForRoomNumber2 : function(){
		area.resetArea();
		for(var i=0;i<this.qnums.length;i++){
			bd.sQnC(area.getTopOfRoom(this.qnums[i].areaid), this.qnums[i].val);
		}
	},

	//------------------------------------------------------------------------------
	// menu.ex.turnflip()      ��]�E���]���������s����
	// menu.ex.turnflipGroup() turnflip()��������I�ɌĂ΂���]���s��
	//------------------------------------------------------------------------------
	turnflip : function(arg,d){
		this.adjustSpecial(arg,'',d);
		this.adjustGeneral(arg,'',d);

		if(arg===3||arg===4){
			var tmp = k.qcols; k.qcols = k.qrows; k.qrows = tmp;
			bd.setposAll();
		}

						  { this.turnflipGroup(k.CELL,   arg, d, bd.cell,   bd.cellmax);  }
		if(!!k.iscross)   { this.turnflipGroup(k.CROSS,  arg, d, bd.cross,  bd.crossmax); }
		if(!!k.isborder)  { this.turnflipGroup(k.BORDER, arg, d, bd.border, bd.bdmax);    }
		if(k.isexcell===2){ this.turnflipGroup(k.EXCELL, arg, d, bd.excell, bd.excellmax);}
		else if(k.isexcell===1 && (arg===1 || arg===2)){
			if(arg===1){
				for(var by=(d.y1|1);by<d.yy/2;by+=2){
					var c = bd.excell[bd.exnum(-1,by)];
					bd.excell[bd.exnum(-1,by)] = bd.excell[bd.exnum(-1,d.yy-by)];
					bd.excell[bd.exnum(-1,d.yy-by)] = c;
				}
			}
			else if(arg===2){
				for(var bx=(d.x1|1);bx<d.xx/2;bx+=2){
					var c = bd.excell[bd.exnum(bx,-1)];
					bd.excell[bd.exnum(bx,-1)] = bd.excell[bd.exnum(d.xx-bx,-1)];
					bd.excell[bd.exnum(d.xx-bx,-1)] = c;
				}
			}
		}

		bd.setposAll();
		this.adjustSpecial2(arg,'',d);
	},
	turnflipGroup : function(type,arg,d,group,maxcnt){
		var getnext, ch=[]; for(var i=0;i<maxcnt;i++){ ch[i]=1;}
		switch(type){
			case k.CELL:   getnext=((arg===1||arg===2) ? bd.cnum : bd.cnum2); break;
			case k.CROSS:  getnext=((arg===1||arg===2) ? bd.xnum : bd.xnum2); break;
			case k.BORDER: getnext=((arg===1||arg===2) ? bd.bnum : bd.bnum2); break;
			case k.EXCELL: getnext=((arg===1||arg===2) ?bd.exnum :bd.exnum2); break;
		}
		for(var source=0;source<maxcnt;source++){
			if(ch[source]===0){ continue;}
			var tmp = group[source], target = source;
			while(ch[target]!==0){
				ch[target]=0;
				if     (arg===1){ next = getnext.call(bd, group[target].bx, d.yy-group[target].by);}
				else if(arg===2){ next = getnext.call(bd, d.xx-group[target].bx, group[target].by);}
				else if(arg===3){ next = getnext.call(bd, group[target].by, d.yy-group[target].bx, k.qrows, k.qcols);}
				else if(arg===4){ next = getnext.call(bd, d.xx-group[target].by, group[target].bx, k.qrows, k.qcols);}

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
	// menu.ex.expandborder() �Ֆʂ̊g�厞�A���E����L�΂�
	// menu.ex.reduceborder() �Ֆʂ̏k�����A�����ړ�����
	//---------------------------------------------------------------------------
	expandborder : function(key){
		if(!k.isborderAsLine){
			if(um.undoExec){ return;} // Undo���́A��ŃI�u�W�F�N�g��������̂ŉ��̏����̓p�X

			bd.setposBorders();
			for(var i=0;i<bd.bdmax;i++){
				if(this.distObj(key,k.BORDER,i)!==1){ continue;}

				var source = this.innerBorder(key,i);
				bd.border[i].ques  = bd.border[source].ques;
				bd.border[i].qans  = bd.border[source].qans;
			}
		}
		else{
			// m==0||m==1�Œ��ڈړ��ł����������ǁAexpandGroup()�ƕʂ�
			// �֐����K�v������̂ł����Ŗ������ړ�������
			bd.setposBorders();
			for(var i=0;i<bd.bdmax;i++){
				if(this.distObj(key,k.BORDER,i)!==2){ continue;}

				var source = this.outerBorder(key,i);
				this.copyData(i,source);
				bd.border[source].allclear(source);
			}
		}
	},
	reduceborder : function(key){
		if(k.isborderAsLine){
			// borderAsLine���̖�����肪�Ȃ�Ƃ�����Ƃ�
			for(var i=0;i<bd.bdmax;i++){
				if(this.distObj(key,k.BORDER,i)!==0){ continue;}

				var source = this.innerBorder(key,i);
				this.copyData(i,source);
			}
		}
	},

	//---------------------------------------------------------------------------
	// menu.ex.copyData()     �w�肵���f�[�^���R�s�[����
	// menu.ex.innerBorder()  (expand/reduceBorder�p) �ЂƂ����ɓ�����border��id��Ԃ�
	// menu.ex.outerBorder()  (expand/reduceBorder�p) �ЂƂO���ɍs����border��id��Ԃ�
	// menu.ex.setposObj()    �w�肳�ꂽ�^�C�v��setpos�֐����Ăяo��
	// menu.ex.distObj()      �㉺���E�����ꂩ�̊O�g�Ƃ̋��������߂�
	//---------------------------------------------------------------------------
	copyData : function(id1,id2){
		bd.border[id1].qans  = bd.border[id2].qans;
		bd.border[id1].qsub  = bd.border[id2].qsub;
		bd.border[id1].ques  = bd.border[id2].ques;
		bd.border[id1].color = bd.border[id2].color;
	},
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

		if     (key===k.UP){ return obj.by;}
		else if(key===k.DN){ return 2*k.qrows-obj.by;}
		else if(key===k.LT){ return obj.bx;}
		else if(key===k.RT){ return 2*k.qcols-obj.bx;}
		return -1;
	},

	//------------------------------------------------------------------------------
	// menu.ex.adjustGeneral()  ��]�E���]���Ɋe�Z���̒��߂��s��(���ʏ���)
	// menu.ex.adjustSpecial()  ��]�E���]�E�Ֆʒ��ߊJ�n�O�Ɋe�Z���̒��߂��s��(�e�p�Y���̃I�[�o�[���C�h�p)
	// menu.ex.adjustSpecial2() ��]�E���]�E�Ֆʒ��ߏI����Ɋe�Z���̒��߂��s��(�e�p�Y���̃I�[�o�[���C�h�p)
	// menu.ex.adjustQues51_1() [�_]�Z���̒���(adjustSpecial�֐��ɑ������p)
	// menu.ex.adjustQues51_2() [�_]�Z���̒���(adjustSpecial2�֐��ɑ������p)
	//------------------------------------------------------------------------------
	adjustGeneral : function(arg,key,d){
		um.disableRecord();
		for(var by=(d.y1|1);by<=d.y2;by+=2){
			for(var bx=(d.x1|1);bx<=d.x2;bx+=2){
				var c = bd.cnum(bx,by);

				switch(arg){
				case 1: // �㉺���]
					if(true){
						var val = ({2:5,3:4,4:3,5:2,104:107,105:106,106:105,107:104})[bd.QuC(c)];
						if(!isNaN(val)){ bd.sQuC(c,val);}
					}
					if(k.isexcell!==1){
						var val = ({1:2,2:1})[bd.DiC(c)];
						if(!isNaN(val)){ bd.sDiC(c,val);}
					}
					break;
				case 2: // ���E���]
					if(true){
						var val = ({2:3,3:2,4:5,5:4,104:105,105:104,106:107,107:106})[bd.QuC(c)];
						if(!isNaN(val)){ bd.sQuC(c,val);}
					}
					if(k.isexcell!==1){
						var val = ({3:4,4:3})[bd.DiC(c)];
						if(!isNaN(val)){ bd.sDiC(c,val);}
					}
					break;
				case 3: // �E90�����]
					if(true){
						var val = {2:5,3:2,4:3,5:4,21:22,22:21,102:103,103:102,104:107,105:104,106:105,107:106}[bd.QuC(c)];
						if(!isNaN(val)){ bd.sQuC(c,val);}
					}
					if(k.isexcell!==1){
						var val = {1:4,2:3,3:1,4:2}[bd.DiC(c)];
						if(!isNaN(val)){ bd.sDiC(c,val);}
					}
					break;
				case 4: // ��90�����]
					if(true){
						var val = {2:3,3:4,4:5,5:2,21:22,22:21,102:103,103:102,104:105,105:106,106:107,107:104}[bd.QuC(c)];
						if(!isNaN(val)){ bd.sQuC(c,val);}
					}
					if(k.isexcell!==1){
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
	adjustQues51_1 : function(arg,key,d){
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
	adjustQues51_2 : function(arg,key,d){
		um.disableRecord();
		var idx;
		switch(arg){
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
	adjustSpecial  : function(arg,key,d){ },
	adjustSpecial2 : function(arg,key,d){ },

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
			if(!!k.isborder){
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
			if(!!k.isborder){
				for(var i=0;i<bd.bdmax;i++){
					if(bd.border[i].qsub!==bd.defborder.qsub){ um.addOpe(k.BORDER,k.QSUB,i,bd.border[i].qsub,bd.defborder.qsub);}
				}
			}

			bd.subclear();
			pc.paintAll();
		}
	}
};
