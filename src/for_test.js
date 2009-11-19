// for_test.js v3.2.3

k.scriptcheck = true;
k.EDITOR = true;
k.PLAYER = false;

var debug = {
	testonly_func : function(){
		menu.titlebarfunc(getEL("bartest"));

		document.testform.starttest.onclick = ee.binder(this, this.presccheck);
		document.testform.t1.onclick        = ee.binder(this, this.perfeval);
		document.testform.t2.onclick        = ee.binder(this, this.painteval);
		document.testform.t3.onclick        = ee.binder(this, this.resizeeval);

		document.testform.filesave.onclick  = function(){ getEL("testarea").value=''; debug.addTextarea(fio.fileencode(1).replace(/\//g,"\n"));};
		document.testform.fileopen.onclick  = function(){ fio.fileopen(getEL("testarea").value.split("\n"),1);};
		document.testform.erasetext.onclick = function(e){ getEL("testarea").value='';};
		document.testform.close.onclick     = function(e){ getEL("poptest").style.display = 'none';};
		document.testform.perfload.onclick  = ee.binder(this, this.loadperf);

		document.testform.perfload.display = (k.puzzleid!=='country' ? 'none' : 'inline');
	},

	keydown : function(ca){
		if(ca=='F7'){ this.accheck1();  return true;}
		if(kc.isCTRL && ca=='F8'){ this.disptest(0); return true;}
		if(kc.isCTRL && ca=='F9'){ this.disptest(1); return true;}
		if(kc.isCTRL && kc.isSHIFT && ca=='F10'){ this.all_test(); return true;}
		return false;
	},

	perfeval : function(){
		this.timeeval("�������葪��",ee.binder(ans, ans.checkAns));
	},
	painteval : function(){
		this.timeeval("�`�掞�ԑ���",ee.binder(pc, pc.paintAll));
	},
	resizeeval : function(){
		this.timeeval("resize�`�摪��",ee.binder(base, base.resize_canvas));
	},
	timeeval : function(text,func){
		this.addTextarea(text);
		var count=0, old = (new Date()).getTime();
		while((new Date()).getTime() - old < 3000){
			count++;

			func();
		}
		var time = (new Date()).getTime() - old;

		this.addTextarea("����f�[�^ "+time+"ms / "+count+"��\n"+"���ώ���   "+(time/count)+"ms")
	},

	loadperf : function(){
		fio.fileopen(debug.acs['perftest'][0][1].split("/"),1);
		menu.setVal('mode',3);
		menu.setVal('irowake',true);
	},

	all_test : function(){
		var pnum=0, term=debug.urls.length-1;
		debug.phase = 99;

		var tam = setInterval(function(){
			if(debug.phase != 99){ return;}

			var newid = debug.urls[pnum][0];
			k.qcols = 0;
			k.qrows = 0;
			k.area = { bcell:0, wcell:0, number:0};

			debug.reload_func(newid);

			enc.parseURI_pzpr.apply(enc, [debug.urls[pnum][1]]);
			enc.pzlinput.apply(enc);

			getEL("testarea").rows = "32";
			var _pop = getEL('poptest');
			_pop.style.display = 'inline';
			_pop.style.left = '40px';
			_pop.style.top  = '80px';
			debug.addTextarea("Test ("+pnum+", "+newid+") start.");
			debug.sccheck();

			if(pnum >= term){ clearInterval(tam);} 
			pnum++;
		},500);
	},

	reload_func : function(newid){
		base.initProcess = true;

		if(base.proto){ puz.protoOriginal();}

		menu.menureset();
		base.numparent.innerHTML = '';
		if(kp.ctl[1].enable){ kp.ctl[1].el.innerHTML = '';}
		if(kp.ctl[3].enable){ kp.ctl[3].el.innerHTML = '';}

		ee.clean();

		k.puzzleid = newid;
		if(!Puzzles[k.puzzleid]){
			var _script = _doc.createElement('script');
			_script.type = 'text/javascript';
//			_script.charset = 'Shift_JIS';
			_script.src = "src/"+k.puzzleid+".js";
			_doc.body.appendChild(_script);	// head����Ȃ����ǁA�A���傤���Ȃ������B�B
		}

		enc = new Encode();
		fio = new FileIO();

		base.initObjects();
		base.setEvents(false);

		base.initProcess = false;
	},

	accheck1 : function(){
		var outputstr = fio.fileencode(1);

		ans.inCheck = true;
		ans.disableSetError();
		ans.alstr = { jp:'' ,en:''};
		ans.checkAns();
		ans.enableSetError();
		ans.inCheck = false;

		this.addTextarea("\t\t\t[\""+ans.alstr.jp+"\",\""+outputstr+"\"],");
	},

	disptest : function(type){
		var _pop = getEL('poptest');
		_pop.style.display = 'inline';
		_pop.style.left = '40px';
		_pop.style.top  = '80px';
		if(type==1){ this.presccheck();}
	},

	phase : 0,
	presccheck : function(e){
		getEL("testarea").rows = "32";
		getEL("testarea").value = "";
		this.sccheck(e);
	},
	sccheck : function(e){
		if(menu.getVal('autocheck')){ menu.setVal('autocheck',false);}
		var n=0, alstr='', qstr='', mint=80, fint=50;
		this.phase = 10;
		var tim = setInterval(function(){
		//Encode test--------------------------------------------------------------
		switch(debug.phase){
		case 10:
			(function(){
				var col = k.qcols;
				var row = k.qrows;
				var pfg = enc.uri.pflag;
				var str = enc.uri.bstr;

				var inp = enc.getURLbase()+"?"+k.puzzleid+(pfg?("/"+pfg):"")+("/"+col)+("/"+row)+("/"+str);

				enc.pzlexport(0);
				var ta = document.urloutput.ta.value;

				// �Ȃ���Opera��textarea��̉��s�����ۂ̉��s�����ɂȂ��Ă��܂����ۂ�
				if(k.br.Opera){ ta = ta.replace(/(\r|\n)/g,"");}

				debug.addTextarea("Encode test   = "+(inp==ta?"pass":"failure...\n "+inp+"\n "+ta));

				setTimeout(function(){
					if(k.isKanpenExist){ debug.phase = 11;}
					else{ debug.phase = (debug.acs[k.puzzleid])?20:30;}
				},fint);
			})();
			break;
		case 11:
			(function(){
				var bd2 = debug.bd_freezecopy();

				enc.pzlexport(2);
				document.urlinput.ta.value = document.urloutput.ta.value;
				menu.pop = getEL("pop1_5");
				menu.ex.urlinput({});

				debug.addTextarea("Encode kanpen = "+(debug.bd_compare(bd,bd2)?"pass":"failure..."));

				setTimeout(function(){
					debug.phase = (debug.acs[k.puzzleid])?20:30;
				},fint);
			})();
			break;
		//Answer test--------------------------------------------------------------
		case 20:
			(function(){
				alstr = debug.acs[k.puzzleid][n][0];
				qstr  = debug.acs[k.puzzleid][n][1];
				fio.fileopen(debug.acs[k.puzzleid][n][1].split("/"),1);
				setTimeout(function(){
					ans.inCheck = true;
					ans.alstr = { jp:'' ,en:''};
					ans.checkAns();
					pc.paintAll();
					ans.inCheck = false;

					var iserror = false, misstr = false;
					                    for(var c=0;c<bd.cellmax  ;c++){if(bd.cell[c].error!=0  ){ iserror = true;}}
					if(k.isextendcell){ for(var c=0;c<bd.excellmax;c++){if(bd.excell[c].error!=0){ iserror = true;}}}
					if(k.iscross)     { for(var c=0;c<bd.crossmax ;c++){if(bd.cross[c].error!=0 ){ iserror = true;}}}
					if(k.isborder)    { for(var i=0;i<bd.bdmax    ;i++){if(bd.border[i].error!=0){ iserror = true;}}}
					if(k.puzzleid=='nagenawa' && n==0){ iserror = true;}
					if(debug.acs[k.puzzleid][n][0] != ""){ iserror = !iserror;}

					if(ans.alstr.jp != debug.acs[k.puzzleid][n][0]){ misstr = true;}

					debug.addTextarea("Answer test "+(n+1)+" = "+((!iserror&&!misstr)?"pass":"failure...")+" \""+debug.acs[k.puzzleid][n][0]+"\"");

					n++;
					if(n<debug.acs[k.puzzleid].length){ debug.phase = 20;}
					else{
						if(k.isKanpenExist && k.puzzleid!="nanro" && k.puzzleid!="ayeheya" && k.puzzleid!="kurochute"){ debug.phase = 31;}
						else{ debug.phase = 30;}
					}
				},fint);
			})();
			break;
		//FileIO test--------------------------------------------------------------
		case 30:
			(function(){
				var outputstr = fio.fileencode(1).replace(/\//g,"\n");

				var bd2 = debug.bd_freezecopy();

				bd.initBoardSize(1,1);
				base.resetInfo();
				base.resize_canvas();

				setTimeout(function(){
					fio.fileopen(outputstr.split("\n"),1);
					debug.addTextarea("FileIO test   = "+(debug.bd_compare(bd,bd2)?"pass":"failure..."));

					fio.fileopen(debug.acs[k.puzzleid][debug.acs[k.puzzleid].length-1][1].split("/"),1);
					debug.phase = (k.puzzleid != 'tawa')?40:50;
				},fint);
			})();
			break;
		case 31:
			(function(){
				var outputstr = fio.fileencode(2).replace(/\//g,"\n");

				var bd2 = debug.bd_freezecopy();

				bd.initBoardSize(1,1);
				base.resetInfo();
				base.resize_canvas();

				setTimeout(function(){
					fio.fileopen(outputstr.split("\n"),2);

					debug.qsubf = !(k.puzzleid=='fillomino'||k.puzzleid=='hashikake'||k.puzzleid=='kurodoko'||k.puzzleid=='shikaku'||k.puzzleid=='tentaisho');
					debug.addTextarea("FileIO kanpen = "+(debug.bd_compare(bd,bd2)?"pass":"failure..."));
					debug.qsubf = true;

					debug.phase = 30;
				},fint);
			})();
			break;
		//Turn test--------------------------------------------------------------
		case 40:
			(function(){
				var bd2 = debug.bd_freezecopy();
				var func = function(){ menu.pop = getEL("pop2_2"); menu.ex.popupadjust({srcElement:{name:'turnr'}}); menu.pop = '';};
				func();
				setTimeout(function(){ func(); setTimeout(function(){ func(); setTimeout(function(){ func();
					debug.addTextarea("TurnR test 1  = "+(debug.bd_compare(bd,bd2)?"pass":"failure..."));
					debug.phase = 41;
				},fint); },fint); },fint);
			})();
			break;
		case 41:
			(function(){
				var bd2 = debug.bd_freezecopy();
				var func = function(){ um.undo();};
				func();
				setTimeout(function(){ func(); setTimeout(function(){ func(); setTimeout(function(){ func();
					debug.addTextarea("TurnR test 2  = "+(debug.bd_compare(bd,bd2)?"pass":"failure..."));
					debug.phase = 45;
				},fint); },fint); },fint);
			})();
			break;
		case 45:
			(function(){
				var bd2 = debug.bd_freezecopy();
				var func = function(){ menu.pop = getEL("pop2_2"); menu.ex.popupadjust({srcElement:{name:'turnl'}}); menu.pop = '';};
				func();
				setTimeout(function(){ func(); setTimeout(function(){ func(); setTimeout(function(){ func();
					debug.addTextarea("TurnL test 1  = "+(debug.bd_compare(bd,bd2)?"pass":"failure..."));
					debug.phase = 46;
				},fint); },fint); },fint);
			})();
			break;
		case 46:
			(function(){
				var bd2 = debug.bd_freezecopy();
				var func = function(){ um.undo();};
				func();
				setTimeout(function(){ func(); setTimeout(function(){ func(); setTimeout(function(){ func();
					debug.addTextarea("TurnL test 2  = "+(debug.bd_compare(bd,bd2)?"pass":"failure..."));
					debug.phase = 50;
				},fint); },fint); },fint);
			})();
			break;
		//Flip test--------------------------------------------------------------
		case 50:
			(function(){
				var bd2 = debug.bd_freezecopy();
				menu.pop = getEL("pop2_2"); menu.ex.popupadjust({srcElement:{name:'flipx'}});

				setTimeout(function(){ menu.pop = getEL("pop2_2"); menu.ex.popupadjust({srcElement:{name:'flipx'}}); menu.pop = '';
					debug.addTextarea("FlipX test 1  = "+(debug.bd_compare(bd,bd2)?"pass":"failure..."));
					debug.phase = 51;
				},fint);
			})();
			break;
		case 51:
			(function(){
				var bd2 = debug.bd_freezecopy();
				um.undo();

				setTimeout(function(){ um.undo();
					debug.addTextarea("FlipX test 2  = "+(debug.bd_compare(bd,bd2)?"pass":"failure..."));
					debug.phase = 55;
				},fint);
			})();
			break;
		case 55:
			(function(){
				var bd2 = debug.bd_freezecopy();
				menu.pop = getEL("pop2_2"); menu.ex.popupadjust({srcElement:{name:'flipy'}});

				setTimeout(function(){ menu.pop = getEL("pop2_2"); menu.ex.popupadjust({srcElement:{name:'flipy'}}); menu.pop = '';
					debug.addTextarea("FlipY test 1  = "+(debug.bd_compare(bd,bd2)?"pass":"failure..."));
					debug.phase = 56;
				},fint);
			})();
			break;
		case 56:
			(function(){
				var bd2 = debug.bd_freezecopy();
				um.undo();

				setTimeout(function(){ um.undo();
					debug.addTextarea("FlipY test 2  = "+(debug.bd_compare(bd,bd2)?"pass":"failure..."));
					debug.phase = 60;
				},fint);
			})();
			break;
		//Adjust test--------------------------------------------------------------
		case 60:
			debug.phase=0;
			(function(){
				var bd2 = debug.bd_freezecopy();
				var func = function(nid){ menu.pop = getEL("pop2_1"); menu.ex.popupadjust({srcElement:{name:nid}}); menu.pop = '';};
				setTimeout(function(){ func('expandup'); setTimeout(function(){ func('expandrt');
				setTimeout(function(){ func('expanddn'); setTimeout(function(){ func('expandlt');
				setTimeout(function(){ func('reduceup'); setTimeout(function(){ func('reducert');
				setTimeout(function(){ func('reducedn'); setTimeout(function(){ func('reducelt');
					debug.addTextarea("Adjust test 1 = "+(debug.bd_compare(bd,bd2)?"pass":"failure..."));
					debug.phase = 61;
				},fint); },fint); },fint); },fint); },fint); },fint); },fint); },fint);
			})();
			break;
		case 61: // �����N�b�V�����u��
			setTimeout(function(){ debug.phase = 62;},mf(fint/2));
			break;
		case 62:
			(function(){
				var bd2 = debug.bd_freezecopy();
				var func = function(){ um.undo();};
				func();
				setTimeout(function(){ func(); setTimeout(function(){ func(); setTimeout(function(){ func();
				setTimeout(function(){ func(); setTimeout(function(){ func(); setTimeout(function(){ func(); setTimeout(function(){ func();
					debug.addTextarea("Adjust test 2 = "+(debug.bd_compare(bd,bd2)?"pass":"failure..."));
					debug.phase = 90;
				},fint); },fint); },fint); },fint); },fint); },fint); },fint);
			})();
			break;
		//test end--------------------------------------------------------------
		case 90:
			clearInterval(tim);
			debug.addTextarea("Test end.");
			debug.phase = 99;
			return;
		}
		debug.phase=0;
		},mint);
	},
	taenable : true,
	addTextarea : function(str){ if(this.taenable){ getEL('testarea').value += (str+"\n");} },

	qsubf : true,
	bd_freezecopy : function(){
		var bd2 = {cell:[],excell:[],cross:[],border:[]};
		for(var c=0;c<bd.cellmax;c++){
			bd2.cell[c] = {};
			bd2.cell[c].ques =bd.cell[c].ques;
			bd2.cell[c].qnum =bd.cell[c].qnum;
			bd2.cell[c].direc=bd.cell[c].direc;
			bd2.cell[c].qans =bd.cell[c].qans;
			bd2.cell[c].qsub =bd.cell[c].qsub;
		}
		if(k.isextendcell){
			for(var c=0;c<bd.excellmax;c++){
				bd2.excell[c] = {};
				bd2.excell[c].qnum =bd.excell[c].qnum;
				bd2.excell[c].direc=bd.excell[c].direc;
			}
		}
		if(k.iscross){
			for(var c=0;c<bd.crossmax;c++){
				bd2.cross[c] = {};
				bd2.cross[c].ques=bd.cross[c].ques;
				bd2.cross[c].qnum=bd.cross[c].qnum;
			}
		}
		if(k.isborder){
			for(var i=0;i<bd.bdmax;i++){
				bd2.border[i] = {};
				bd2.border[i].ques=bd.border[i].ques;
				bd2.border[i].qnum=bd.border[i].qnum;
				bd2.border[i].qans=bd.border[i].qans;
				bd2.border[i].qsub=bd.border[i].qsub;
				bd2.border[i].line=bd.border[i].line;
			}
		}
		return bd2;
	},
	bd_compare : function(bd1,bd2){
//		debug.taenable = false;
		var result = true;
		for(var c=0,len=Math.min(bd1.cell.length,bd2.cell.length);c<len;c++){
			if(bd1.cell[c].ques !=bd2.cell[c].ques ){ result = false; debug.addTextarea("cell ques "+c+" "+bd1.cell[c].ques+" "+bd2.cell[c].ques);}
			if(bd1.cell[c].qnum !=bd2.cell[c].qnum ){ result = false; debug.addTextarea("cell qnum "+c+" "+bd1.cell[c].qnum+" "+bd2.cell[c].qnum);}
			if(bd1.cell[c].direc!=bd2.cell[c].direc){ result = false; debug.addTextarea("cell dirc "+c+" "+bd1.cell[c].direc+" "+bd2.cell[c].direc);}
			if(bd1.cell[c].qans !=bd2.cell[c].qans ){ result = false; debug.addTextarea("cell qans "+c+" "+bd1.cell[c].qans+" "+bd2.cell[c].qans);}
			if(bd1.cell[c].qsub !=bd2.cell[c].qsub ){
				if(debug.qsubf){ result = false; debug.addTextarea("cell qsub "+c+" "+bd1.cell[c].qsub+" "+bd2.cell[c].qsub);}
				else{ bd1.cell[c].qsub = bd2.cell[c].qsub;}
			}
		}
		if(k.isextendcell){
			for(var c=0;c<bd1.excell.length;c++){
				if(bd1.excell[c].qnum !=bd2.excell[c].qnum ){ result = false;}
				if(bd1.excell[c].direc!=bd2.excell[c].direc){ result = false;}
			}
		}
		if(k.iscross){
			for(var c=0;c<bd1.cross.length;c++){
				if(bd1.cross[c].ques!=bd2.cross[c].ques){ result = false;}
				if(bd1.cross[c].qnum!=bd2.cross[c].qnum){ result = false;}
			}
		}
		if(k.isborder){
			for(var i=0;i<bd1.border.length;i++){
				if(bd1.border[i].ques!=bd2.border[i].ques){ result = false; debug.addTextarea("border ques "+i+" "+bd1.border[i].ques+" "+bd2.border[i].ques);}
				if(bd1.border[i].qnum!=bd2.border[i].qnum){ result = false; debug.addTextarea("border qnum "+i+" "+bd1.border[i].qnum+" "+bd2.border[i].qnum);}
				if(bd1.border[i].qans!=bd2.border[i].qans){ result = false; debug.addTextarea("border qans "+i+" "+bd1.border[i].qans+" "+bd2.border[i].qans);}
				if(bd1.border[i].line!=bd2.border[i].line){ result = false; debug.addTextarea("border line "+i+" "+bd1.border[i].line+" "+bd2.border[i].line);}
				if(bd1.border[i].qsub!=bd2.border[i].qsub){
					if(debug.qsubf){ result = false; debug.addTextarea("border qsub "+i+" "+bd1.border[i].qsub+" "+bd2.border[i].qsub);}
					else{ bd1.border[i].qsub = bd2.border[i].qsub;}
				}
			}
		}
//		debug.taenable = true;
		return result;
	},

	acs : {
		ayeheya : [
			["���}�X���^�e���R�ɘA�����Ă��܂��B","pzprv3/ayeheya/6/6/11/0 0 1 1 1 2 /0 0 1 1 1 3 /4 4 5 5 6 6 /7 7 5 5 6 6 /7 7 8 8 8 8 /7 7 9 10 10 10 /. . . . . . /. . . . . . /. . 2 . . . /. . . . . . /. . . . . . /. . . . . . /. . . . . . /. # . . . . /. # . . . . /. . . . . . /. . . . . . /. . . . . . /"],
			["���}�X�����f����Ă��܂��B","pzprv3/ayeheya/6/6/11/0 0 1 1 1 2 /0 0 1 1 1 3 /4 4 5 5 6 6 /7 7 5 5 6 6 /7 7 8 8 8 8 /7 7 9 10 10 10 /. . . . . . /. . . . . . /. . 2 . . . /. . . . . . /. . . . . . /. . . . . . /. . . . . # /. . . . # . /. . . # . . /. . # . . . /. # . . . . /# . . . . . /"],
			["�����̒��̍��}�X���_�Ώ̂ɔz�u����Ă��܂���B","pzprv3/ayeheya/6/6/11/0 0 1 1 1 2 /0 0 1 1 1 3 /4 4 5 5 6 6 /7 7 5 5 6 6 /7 7 8 8 8 8 /7 7 9 10 10 10 /. . . . . . /. . . . . . /. . 2 . . . /. . . . . . /. . . . . . /. . . . . . /. . . . . . /. . # . # . /. . . . . . /. . . . . . /. . . . . . /. . . . . . /"],
			["�����̐����ƍ��}�X�̐�����v���Ă��܂���B","pzprv3/ayeheya/6/6/11/0 0 1 1 1 2 /0 0 1 1 1 3 /4 4 5 5 6 6 /7 7 5 5 6 6 /7 7 8 8 8 8 /7 7 9 10 10 10 /. . . . . . /. . . . . . /. . 2 . . . /. . . . . . /. . . . . . /. . . . . . /. . . . . . /. . . . . . /. . . . . . /. . . . . . /. . . . . . /. . . . . . /"],
			["���}�X��3�����A���ő����Ă��܂��B","pzprv3/ayeheya/6/6/11/0 0 1 1 1 2 /0 0 1 1 1 3 /4 4 5 5 6 6 /7 7 5 5 6 6 /7 7 8 8 8 8 /7 7 9 10 10 10 /. . . . . . /. . . . . . /. . 2 . . . /. . . . . . /. . . . . . /. . . . . . /. . . . . . /. . . . . . /. . # . . . /. . . # . . /. . . . . . /. . . . . . /"],
			["�l�p�`�ł͂Ȃ�����������܂��B","pzprv3/ayeheya/6/6/9/0 1 1 2 2 2 /1 1 1 2 2 2 /1 1 3 3 4 4 /5 5 3 3 4 4 /5 5 6 6 6 6 /5 5 7 8 8 8 /. . . . . . /. . . . . . /. . 2 . . . /. . . . . . /. . . . . . /. . . . . . /# . . . . . /. . . . . . /. . . # . # /# . # . # . /. . . . . . /. # . # . # /"],
			["","pzprv3/ayeheya/6/6/11/0 0 1 1 1 2 /0 0 1 1 1 3 /4 4 5 5 6 6 /7 7 5 5 6 6 /7 7 8 8 8 8 /7 7 9 10 10 10 /. . . . . . /. . . . . . /. . 2 . . . /. . . . . . /. . . . . . /. . . . . . /# + + + + # /+ # + + + + /+ + + # + # /# + # . # . /+ + . . . . /+ # . # . # /"]
		],
		bag : [
			["���򂵂Ă����������܂��B","pzprv3/bag/6/6/. 3 . . . . /. . . . . . /. 2 . . 3 . /. . . 11 . . /. . 3 . . . /3 . . . 2 . /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 0 /0 0 0 0 0 0 0 /0 0 1 0 0 0 0 /0 0 1 0 0 0 0 /0 0 1 0 0 0 0 /0 0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /1 1 1 1 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /"],
			["�����������Ă��܂��B","pzprv3/bag/6/6/. 3 . . . . /. . . . . . /. 2 . . 3 . /. . . 11 . . /. . 3 . . . /3 . . . 2 . /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 1 0 0 0 0 /0 0 1 0 0 0 0 /0 0 1 0 0 0 0 /0 0 1 0 0 0 0 /0 0 1 0 0 0 0 /0 0 0 0 0 0 0 /0 0 1 0 0 0 /0 0 0 0 0 0 /1 1 1 1 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /"],
			["�ւ�������ł͂���܂���B","pzprv3/bag/6/6/. 3 . . . . /. . . . . . /. 2 . . 3 . /. . . 11 . . /. . 3 . . . /3 . . . 2 . /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 1 0 1 0 0 /0 0 0 1 1 0 0 /1 0 0 0 0 0 0 /1 0 0 0 0 0 0 /1 0 1 0 0 0 0 /0 0 0 0 0 0 0 /0 0 1 1 0 0 /0 0 1 0 0 0 /1 1 0 1 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /1 1 0 0 0 0 /0 0 0 0 0 0 /"],
			["�r���œr�؂�Ă����������܂��B","pzprv3/bag/6/6/. 3 . . . . /. . . . . . /. 2 . . 3 . /. . . 11 . . /. . 3 . . . /3 . . . 2 . /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 1 0 1 0 0 /0 0 0 0 1 0 0 /1 0 0 0 0 0 0 /1 0 0 0 0 0 0 /1 0 1 0 0 0 0 /0 0 0 0 0 0 0 /0 0 1 1 0 0 /0 0 1 0 0 0 /1 1 1 1 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /1 1 0 0 0 0 /0 0 0 0 0 0 /"],
			["�ւ̓����ɓ����Ă��Ȃ�����������܂��B","pzprv3/bag/6/6/. 3 . . . . /. . . . . . /. 2 . . 3 . /. . . 11 . . /. . 3 . . . /3 . . . 2 . /0 0 0 1 2 0 /2 2 2 1 2 2 /2 1 2 1 1 2 /1 1 1 1 1 1 /1 2 1 1 2 2 /1 2 2 1 1 2 /0 0 0 1 1 0 0 /0 0 0 1 1 0 0 /0 1 1 1 0 1 0 /1 0 0 0 0 0 1 /1 1 1 0 1 0 0 /1 1 0 1 0 1 0 /0 0 0 1 0 0 /0 0 0 0 0 0 /0 1 0 0 1 0 /1 0 1 0 0 1 /0 1 0 0 1 1 /0 0 1 0 1 0 /1 0 0 1 1 0 /"],
			["�����Ɨւ̓����ɂȂ�4�����̃}�X�̍��v���Ⴂ�܂��B","pzprv3/bag/6/6/. 3 . . . . /. . . . . . /. 2 . . 3 . /. . . 11 . . /. . 3 . . . /3 . . . 2 . /1 1 1 1 2 0 /2 2 2 1 2 2 /2 1 2 1 1 2 /1 1 1 1 1 1 /1 2 1 1 2 2 /1 2 2 1 1 2 /1 0 0 0 1 0 0 /0 0 0 1 1 0 0 /0 1 1 1 0 1 0 /1 0 0 0 0 0 1 /1 1 1 0 1 0 0 /1 1 0 1 0 1 0 /1 1 1 1 0 0 /1 1 1 0 0 0 /0 1 0 0 1 0 /1 0 1 0 0 1 /0 1 0 0 1 1 /0 0 1 0 1 0 /1 0 0 1 1 0 /"],
			["","pzprv3/bag/6/6/. 3 . . . . /. . . . . . /. 2 . . 3 . /. . . 11 . . /. . 3 . . . /3 . . . 2 . /2 1 1 1 2 0 /2 2 2 1 2 2 /2 1 2 1 1 2 /1 1 1 1 1 1 /1 2 1 1 2 2 /1 2 2 1 1 2 /0 1 0 0 1 0 0 /0 0 0 1 1 0 0 /0 1 1 1 0 1 0 /1 0 0 0 0 0 1 /1 1 1 0 1 0 0 /1 1 0 1 0 1 0 /0 1 1 1 0 0 /0 1 1 0 0 0 /0 1 0 0 1 0 /1 0 1 0 0 1 /0 1 0 0 1 1 /0 0 1 0 1 0 /1 0 0 1 1 0 /"]
		],
		barns : [
			["����������Ă��Ȃ��}�X������܂��B","pzprv3/barns/5/5/. . . . . /. . 1 1 . /. 1 1 1 . /. 1 1 . . /. . . . . /0 1 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 0 0 0 1 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["���򂵂Ă����������܂��B","pzprv3/barns/5/5/. . . . . /. . 1 1 . /. 1 1 1 . /. 1 1 . . /. . . . . /0 1 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 0 0 0 1 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /1 1 1 1 /0 1 0 0 0 /0 1 0 0 0 /0 1 0 0 0 /0 1 0 0 0 /"],
			["�X�̕����ȊO�Ő����������Ă��܂��B","pzprv3/barns/5/5/. . . . . /. . 1 1 . /. 1 1 1 . /. 1 1 . . /. . . . . /0 1 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 0 0 0 1 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 1 /1 1 1 1 /0 0 0 0 /0 0 0 0 /0 1 1 1 /0 1 0 0 1 /0 1 0 0 0 /0 1 0 0 0 /0 1 0 0 0 /"],
			["�X�̕����Ő����Ȃ����Ă��܂��B","pzprv3/barns/5/5/. . . . . /. . 1 1 . /. 1 1 1 . /. 1 1 . . /. . . . . /0 1 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 0 0 0 1 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 1 /0 0 1 1 /0 1 0 0 /0 0 0 0 /0 1 1 1 /0 0 0 0 1 /0 0 1 0 0 /0 1 0 0 0 /0 1 0 0 0 /"],
			["�ւ�������ł͂���܂���B","pzprv3/barns/5/5/. . . . . /. . 1 1 . /. 1 1 1 . /. 1 1 . . /. . . . . /0 1 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 0 0 0 1 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 1 /0 0 1 1 /0 0 0 0 /0 0 0 0 /0 1 1 1 /0 0 0 0 1 /0 0 0 0 0 /0 1 0 0 0 /0 1 0 0 0 /"],
			["�r���œr�؂�Ă����������܂��B","pzprv3/barns/5/5/. . . . . /. . 1 1 . /. 1 1 1 . /. 1 1 . . /. . . . . /0 1 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 0 0 0 1 /0 0 0 0 0 /0 0 0 0 0 /1 0 1 1 /0 1 1 1 /1 1 1 1 /1 0 0 0 /1 1 0 1 /1 1 1 0 1 /1 0 1 0 0 /0 0 1 0 1 /1 0 1 1 1 /"],
			["","pzprv3/barns/5/5/. . . . . /. . 1 1 . /. 1 1 1 . /. 1 1 . . /. . . . . /0 1 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 0 0 0 1 /0 0 0 0 0 /0 0 0 0 0 /1 0 1 1 /0 1 1 1 /1 1 1 1 /1 1 1 0 /1 1 -1 1 /1 1 1 -1 1 /1 -1 1 -1 0 /-1 -1 1 -1 1 /1 -1 1 1 1 /"]
		],
		bdblock : [
			["���_�ȊO�̂Ƃ���Ő������򂵂Ă��܂��B","pzprv3/bdblock/5/5/1 2 3 4 5 /. . . . . /. . . . 5 /1 . 4 . . /. 3 . . . /. 1 1 1 1 . /. . . . . . /. 1 . . . . /. . . . . 1 /1 . . . . . /. . . 1 . . /1 0 0 0 /1 0 0 0 /1 0 0 0 /1 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /1 1 1 0 0 /"],
			["���_�ȊO�̂Ƃ���Ő����������Ă��܂��B","pzprv3/bdblock/5/5/1 2 3 4 5 /. . . . . /. . . . 5 /1 . 4 . . /. 3 . . . /. 1 1 1 1 . /. . . . . . /. 1 . . . . /. . . . . 1 /1 . . . . . /. . . 1 . . /1 0 0 0 /1 0 0 0 /1 1 0 0 /0 1 1 0 /0 0 1 0 /0 0 0 0 0 /0 1 0 0 0 /0 1 1 0 0 /1 1 0 0 0 /"],
			["�����̂Ȃ��u���b�N������܂��B","pzprv3/bdblock/5/5/1 2 3 4 5 /. . . . . /. . . . 5 /1 . 4 . . /. 3 . . . /. 1 1 1 1 . /. . . . . . /. 1 . . . . /. . . . . 1 /1 . . . . . /. . . 1 . . /1 0 0 0 /1 0 0 0 /1 1 0 0 /0 1 1 0 /0 0 1 0 /0 0 0 0 0 /0 1 0 0 0 /0 0 0 1 1 /1 1 0 0 0 /"],
			["�P�̃u���b�N�ɈقȂ鐔���������Ă��܂��B","pzprv3/bdblock/5/5/1 2 3 4 5 /. . . . . /. . . . 5 /1 . 4 . . /. 3 . . . /. 1 1 1 1 . /. . . . . . /. 1 . . . . /. . . . . 1 /1 . . . . . /. . . 1 . . /0 1 0 0 /0 1 0 0 /0 1 0 0 /0 1 0 0 /0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /1 1 0 0 0 /"],
			["�����������قȂ�u���b�N�ɓ����Ă��܂��B","pzprv3/bdblock/5/5/1 2 3 4 5 /. . . . . /. . . . 5 /1 . 4 . . /. 3 . . 1 /. 1 1 1 1 . /. . . . . . /. 1 . . . . /. . . . 1 1 /1 . . . . . /. . . 1 1 . /1 1 1 1 /1 1 1 1 /1 0 1 1 /1 1 0 1 /0 0 1 1 /0 0 0 0 0 /0 1 0 0 0 /0 0 1 0 1 /1 0 1 0 0 /"],
			["�r���œr�؂�Ă����������܂��B","pzprv3/bdblock/5/5/1 2 3 4 5 /. . . . . /. . . . 5 /1 . 4 . . /. 3 . . . /. 1 1 1 1 . /. . . . . . /. 1 . . . . /. . . . . 1 /1 . . . . . /. . . 1 1 . /1 1 1 1 /1 1 1 1 /1 0 1 1 /1 1 0 0 /0 0 1 1 /0 0 0 0 0 /0 1 0 0 0 /0 0 1 0 1 /1 0 1 0 0 /"],
			["�����R�{�ȏ�o�Ă��Ȃ����_������܂��B","pzprv3/bdblock/5/5/1 2 3 4 5 /. . . . . /. . . . 5 /1 . 4 . . /. 3 . . . /. 1 1 1 1 . /. . . . . . /. 1 . . . . /. . . . . 1 /1 . . . . . /. . . 1 1 . /1 1 1 1 /1 1 1 1 /1 0 1 1 /1 1 0 0 /0 0 1 0 /0 0 0 0 0 /0 1 0 0 0 /0 0 1 0 1 /1 0 1 0 0 /"],
			["�����o�Ă��Ȃ����_������܂��B","pzprv3/bdblock/5/5/1 2 3 4 5 /. . . . . /. . . . 5 /1 . 4 . . /. 3 . . . /. 1 1 1 1 . /. . . . . . /. 1 . . . . /. . . . . 1 /1 . . . 1 . /. . . 1 . . /1 1 1 1 /1 1 1 1 /1 0 1 1 /1 1 0 0 /0 0 1 0 /0 0 0 0 0 /0 1 0 0 0 /0 0 1 0 1 /1 0 1 0 0 /"],
			["","pzprv3/bdblock/5/5/1 2 3 4 5 /. . . . . /. . . . 5 /1 . 4 . . /. 3 . . . /. 1 1 1 1 . /. . . . . . /. 1 . . . . /. . . . . 1 /1 . . . . . /. . . 1 . . /1 1 1 1 /1 1 1 1 /1 -1 1 1 /1 1 -1 -1 /-1 -1 1 -1 /0 0 -1 -1 0 /0 1 -1 -1 0 /0 -1 1 -1 1 /1 -1 1 -1 -1 /"]
		],
		bonsan : [
			["���򂵂Ă����������܂��B","pzprv3/bonsan/5/5/. 1 . . 0 /. - . . . /. 1 2 1 . /3 . . 1 . /. - . - . /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 1 1 0 /0 1 1 0 /0 0 0 0 /0 1 1 0 /0 1 1 0 /0 0 0 0 0 /1 1 0 1 1 /1 1 0 1 1 /0 0 0 0 0 /0 0 0 0 /0 0 1 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 1 0 0 /0 0 1 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["�����������Ă��܂��B","pzprv3/bonsan/5/5/. 1 . . 0 /. - . . . /. 1 2 1 . /3 . . 1 . /. - . - . /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 1 1 0 /0 1 1 0 /0 0 0 0 /0 1 1 0 /0 1 1 0 /0 0 0 0 0 /1 1 0 1 1 /1 1 0 1 1 /0 0 0 0 0 /0 0 0 0 /0 1 1 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 1 0 0 /0 0 1 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["�����q�����Ă��܂��B","pzprv3/bonsan/5/5/. 1 . . 0 /. - . . . /. 1 2 1 . /3 . . 1 . /. - . - . /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 1 1 0 /0 1 1 0 /0 0 0 0 /0 1 1 0 /0 1 1 0 /0 0 0 0 0 /1 1 0 1 1 /1 1 0 1 1 /0 0 0 0 0 /0 0 0 0 /0 1 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 0 1 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["���̏������ʉ߂��Ă��܂��B","pzprv3/bonsan/5/5/. 1 . . 0 /. - . . . /. 1 2 1 . /3 . . 1 . /. - . - . /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 1 1 0 /0 1 1 0 /0 0 0 0 /0 1 1 0 /0 1 1 0 /0 0 0 0 0 /1 1 0 1 1 /1 1 0 1 1 /0 0 0 0 0 /0 0 0 0 /1 1 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /1 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["�Ȃ����Ă����������܂��B","pzprv3/bonsan/5/5/. 1 . . 0 /. - . . . /. 1 2 1 . /3 . . 1 . /. - . - . /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 1 1 0 /0 1 1 0 /0 0 0 0 /0 1 1 0 /0 1 1 0 /0 0 0 0 0 /1 1 0 1 1 /1 1 0 1 1 /0 0 0 0 0 /0 0 0 0 /1 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /1 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["�����Ɛ��̒������Ⴂ�܂��B","pzprv3/bonsan/5/5/. 1 . . 0 /. - . . . /. 1 2 1 . /3 . . 1 . /. - . - . /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 1 1 0 /0 1 1 0 /0 0 0 0 /0 1 1 0 /0 1 1 0 /0 0 0 0 0 /1 1 0 1 1 /1 1 0 1 1 /0 0 0 0 0 /0 1 1 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["�����̒��́����_�Ώ̂ɔz�u����Ă��܂���B","pzprv3/bonsan/5/5/. 1 . . 0 /. - . . . /. 1 2 1 . /3 . . 1 . /. - . - . /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 1 1 0 /0 1 1 0 /0 0 0 0 /0 1 1 0 /0 1 1 0 /0 0 0 0 0 /1 1 0 1 1 /1 1 0 1 1 /0 0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["���̂Ȃ�����������܂��B","pzprv3/bonsan/5/5/. 1 . . 0 /. - . . . /. 1 2 1 . /3 . . 1 . /. - . - . /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 1 1 0 /0 1 1 0 /0 0 0 0 /0 1 1 0 /0 1 1 0 /0 0 0 0 0 /1 1 0 1 1 /1 1 0 1 1 /0 0 0 0 0 /0 1 0 0 /0 1 1 0 /0 0 0 0 /0 0 0 1 /0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 1 0 0 /0 0 1 0 0 /"],
			["����������o�Ă��܂���B","pzprv3/bonsan/5/5/. 1 . . 0 /. 4 . . . /. 1 2 1 . /3 . . 1 . /. - . - . /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 1 1 0 /0 1 1 0 /0 0 0 0 /0 1 1 0 /0 1 1 0 /0 0 0 0 0 /1 1 0 1 1 /1 1 0 1 1 /0 0 0 0 0 /0 1 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 1 /1 0 0 0 /1 0 0 0 0 /1 0 0 1 0 /1 1 1 0 0 /0 0 1 0 0 /"],
			["���ɂȂ����Ă��Ȃ���������܂��B","pzprv3/bonsan/5/5/. 1 . . 0 /. - . . . /. 1 2 1 . /3 . . 1 . /. - . - . /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 1 1 0 /0 1 1 0 /0 0 0 0 /0 1 1 0 /0 1 1 0 /0 0 0 0 0 /1 1 0 1 1 /1 1 0 1 1 /0 0 0 0 0 /0 1 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 1 /1 0 0 0 /1 0 0 0 0 /1 0 0 1 1 /1 1 1 0 0 /0 0 1 0 0 /"],
			["","pzprv3/bonsan/5/5/. 1 . . 0 /. - . . . /. 1 2 1 . /3 . . 1 . /. - . - . /2 1 2 0 2 /1 2 1 2 0 /0 1 1 1 0 /0 2 1 1 2 /2 0 2 2 0 /0 1 1 0 /0 1 1 0 /0 0 0 0 /0 1 1 0 /0 1 1 0 /0 0 0 0 0 /1 1 0 1 1 /1 1 0 1 1 /0 0 0 0 0 /0 1 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 1 /1 0 0 0 /1 0 0 0 0 /1 0 0 1 0 /1 1 1 0 0 /0 0 1 0 0 /"]
		],
		bosanowa : [
			["�����Ƃ��ׂ̗̐����̍��̍��v�������Ă��܂���B","pzprv3/bosanowa/5/6/. 2 0 . . . /. 0 0 0 2 . /0 0 . 0 0 0 /0 3 0 4 0 . /. 0 3 . . . /. . 3 . . . /. 4 0 0 . . /0 0 . 0 0 0 /0 . 0 . 0 . /. 0 . . . . /. . . . . /. . . . . /. . . . . /. . . . . /. . . . . /. . . . . . /. . . . . . /. . . . . . /. . . . . . /"],
			["�����̓����Ă��Ȃ��}�X������܂��B","pzprv3/bosanowa/5/6/. 2 0 . . . /. 0 0 0 2 . /0 0 . 0 0 0 /0 3 0 4 0 . /. 0 3 . . . /. . 0 . . . /. 0 0 0 . . /0 0 . 0 0 0 /0 . 0 . 0 . /. 0 . . . . /. . . . . /. . . . . /. . . . . /. . . . . /. . . . . /. . . . . . /. . . . . . /. . . . . . /. . . . . . /"],
			["","pzprv3/bosanowa/5/6/. 2 0 . . . /. 0 0 0 2 . /0 0 . 0 0 0 /0 3 0 4 0 . /. 0 3 . . . /. . 3 . . . /. 3 5 4 . . /6 3 . 3 2 1 /3 . 5 . 2 . /. 2 . . . . /. 1 . . . /. 2 1 2 . /3 . . 1 . /0 . 1 2 . /. . . . . /. 1 2 . . . /. 0 . 1 0 . /3 0 . 1 0 . /. . . . . . /"]
		],
		chocona : [
			["���}�X�̃J�^�}���������`�������`�ł͂���܂���B","pzprv3/chocona/6/6/11/0 0 1 1 1 1 /0 2 2 2 2 2 /3 4 5 6 7 7 /3 4 5 6 7 7 /3 5 5 8 9 9 /3 10 10 8 8 9 /3 . 3 . . . /. 1 . . . . /2 2 . 2 1 . /. . . . . . /. . . . 3 . /. 2 . . . . /# # . . . . /# # # # # # /. . . . . . /. . . . . . /. . . . . . /. . . . . . /"],
			["�����̂���̈�ƁA�̈�̒��ɂ��鍕�}�X�̐����Ⴂ�܂��B","pzprv3/chocona/6/6/11/0 0 1 1 1 1 /0 2 2 2 2 2 /3 4 5 6 7 7 /3 4 5 6 7 7 /3 5 5 8 9 9 /3 10 10 8 8 9 /3 . 3 . . . /. 1 . . . . /2 2 . 2 1 . /. . . . . . /. . . . 3 . /. 2 . . . . /# # . # # # /# # . # # # /. . . . . . /. . . . . . /. . . . . . /. . . . . . /"],
			["","pzprv3/chocona/6/6/11/0 0 1 1 1 1 /0 2 2 2 2 2 /3 4 5 6 7 7 /3 4 5 6 7 7 /3 5 5 8 9 9 /3 10 10 8 8 9 /3 . 3 . . . /. 1 . . . . /2 2 . 2 1 . /. . . . . . /. . . . 3 . /. 2 . . . . /# # + # # # /# # + + + + /# # + # + # /# # + # + + /. . + + # # /. # # + # # /"]
		],
		cojun : [
			["1�̕����ɓ������������������Ă��܂��B","pzprv3/cojun/4/4/1 1 0 /0 1 0 /1 1 0 /1 0 0 /1 0 0 0 /1 1 1 1 /0 0 1 1 /. . 3 . /. . . . /. . . . /. 3 . . /. . . . /. . . 3 /. . . . /. . . . /"],
			["�����������^�e���R�ɘA�����Ă��܂��B","pzprv3/cojun/4/4/1 1 0 /0 1 0 /1 1 0 /1 0 0 /1 0 0 0 /1 1 1 1 /0 0 1 1 /. . 3 . /. . . . /. . . . /. 3 . . /. 3 . . /. . . . /. . . . /. . . . /"],
			["���������ŏ�ɏ���������������Ă��܂��B","pzprv3/cojun/4/4/1 1 0 /0 1 0 /1 1 0 /1 0 0 /1 0 0 0 /1 1 1 1 /0 0 1 1 /. . 3 . /. . . . /. . . . /. 3 . . /1 2 . . /3 1 4 . /. . . . /. . . . /"],
			["�����̓����Ă��Ȃ��}�X������܂��B","pzprv3/cojun/4/4/1 1 0 /0 1 0 /1 1 0 /1 0 0 /1 0 0 0 /1 1 1 1 /0 0 1 1 /. . 3 . /. . . . /. . . . /. 3 . . /1 2 . 4 /3 1 2 1 /. . 1 2 /. . 2 1 /"],
			["","pzprv3/cojun/4/4/1 1 0 /0 1 0 /1 1 0 /1 0 0 /1 0 0 0 /1 1 1 1 /0 0 1 1 /. . 3 . /. . . . /. . . . /. 3 . . /1 2 . 4 /3 1 2 1 /2 4 1 2 /1 . 2 1 /"]
		],
		country : [
			["���򂵂Ă����������܂��B","pzprv3/country/5/5/7/0 0 1 1 2 /0 0 1 1 2 /3 4 4 4 2 /3 5 5 6 6 /3 5 5 6 6 /2 . . . . /. . . . . /1 2 . . . /. . . . . /. . . . . /0 0 0 0 /1 1 1 1 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 1 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["�������Ă����������܂��B","pzprv3/country/5/5/7/0 0 1 1 2 /0 0 1 1 2 /3 4 4 4 2 /3 5 5 6 6 /3 5 5 6 6 /2 . . . . /. . . . . /1 2 . . . /. . . . . /. . . . . /0 0 0 0 /1 1 1 1 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 1 0 0 0 /0 1 0 0 0 /0 1 0 0 0 /0 1 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["�����P�̍����Q��ȏ�ʂ��Ă��܂��B","pzprv3/country/5/5/7/0 0 1 1 2 /0 0 1 1 2 /3 4 4 4 2 /3 5 5 6 6 /3 5 5 6 6 /2 . . . . /. . . . . /1 2 . . . /. . . . . /. . . . . /0 1 1 0 /0 0 0 0 /1 0 0 0 /0 0 0 0 /1 1 1 0 /0 1 0 1 0 /0 1 0 1 0 /1 0 0 1 0 /1 0 0 1 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["�����̂��鍑�Ɛ����ʉ߂���}�X�̐����Ⴂ�܂��B","pzprv3/country/5/5/7/0 0 1 1 2 /0 0 1 1 2 /3 4 4 4 2 /3 5 5 6 6 /3 5 5 6 6 /2 . . . . /. . . . . /1 2 . . . /. . . . . /. . . . . /0 1 0 0 /1 0 0 0 /1 1 0 0 /0 1 0 1 /0 1 1 0 /0 1 0 0 0 /1 0 0 0 0 /0 0 1 0 0 /0 1 0 1 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["���̒ʂ��Ă��Ȃ���������܂��B","pzprv3/country/5/5/8/0 0 1 1 2 /0 0 1 1 2 /3 4 4 5 2 /3 6 6 7 7 /3 6 6 7 7 /2 . . . . /. . . . . /1 2 . . . /. . . . . /. . . . . /0 0 1 0 /1 1 0 1 /1 1 0 0 /0 1 0 1 /0 1 1 0 /0 0 1 1 0 /1 0 0 0 1 /0 0 1 0 1 /0 1 0 1 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["�����ʂ�Ȃ��}�X���A�������͂���Ń^�e���R�ɂƂȂ肠���Ă��܂��B","pzprv3/country/5/5/7/0 0 1 1 2 /0 0 1 1 2 /3 4 4 4 2 /3 5 5 6 6 /3 5 5 6 6 /2 . . . . /. . . . . /1 2 . . . /. . . . . /. . . . . /0 0 1 1 /1 1 0 0 /1 1 0 0 /0 1 0 1 /0 1 1 0 /0 0 1 0 1 /1 0 0 0 1 /0 0 1 0 1 /0 1 0 1 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["�r���œr�؂�Ă����������܂��B","pzprv3/country/5/5/7/0 0 1 1 2 /0 0 1 1 2 /3 4 4 4 2 /3 5 5 6 6 /3 5 5 6 6 /2 . . . . /. . . . . /1 2 . . . /. . . . . /. . . . . /0 0 1 0 /1 1 0 0 /1 1 0 0 /0 1 0 1 /0 1 1 0 /0 0 1 1 0 /1 0 0 0 1 /0 0 1 0 1 /0 1 0 1 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["�ւ�������ł͂���܂���B","pzprv3/country/5/5/7/0 0 1 1 2 /0 0 1 1 2 /3 4 4 4 2 /3 5 5 6 6 /3 5 5 6 6 /2 . . . . /. . . . . /1 3 . . . /. . . . . /. . . . . /0 0 1 0 /1 1 0 1 /1 1 1 1 /0 1 1 0 /0 1 1 0 /0 0 1 1 0 /1 0 0 0 1 /0 0 0 0 0 /0 1 0 1 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["","pzprv3/country/5/5/7/0 0 1 1 2 /0 0 1 1 2 /3 4 4 4 2 /3 5 5 6 6 /3 5 5 6 6 /2 . . . . /. . . . . /1 2 . . . /. . . . . /. . . . . /0 0 1 0 /1 1 0 1 /1 1 0 0 /0 1 0 1 /0 1 1 0 /0 0 1 1 0 /1 0 0 0 1 /0 0 1 0 1 /0 1 0 1 0 /2 2 1 0 0 /1 1 0 1 0 /1 1 1 2 1 /2 1 0 1 0 /2 1 0 0 0 /"]
		],
		creek : [
			["�����̂܂��ɂ��鍕�}�X�̐����Ԉ���Ă��܂��B","pzprv3/creek/6/6/. 0 . . . 0 . /. . . . 2 . . /. . 2 2 . . . /1 . . 1 . 2 . /1 . 4 . 3 . . /. . . . . . . /. . . . . . . /# # . . . . /. . . . . . /. . . . . . /. . . . . . /. . . . . . /. . . . . . /"],
			["���}�X�����f����Ă��܂��B","pzprv3/creek/6/6/. 0 . . . 0 . /. . . . 2 . . /. . 2 2 . . . /1 . . 1 . 2 . /1 . 4 . 3 . . /. . . . . . . /. . . . . . . /. . . . . . /. . . # . . /# # # . # # /. . . . . . /. . . . . . /. . . . . . /"],
			["�����̂܂��ɂ��鍕�}�X�̐����Ԉ���Ă��܂��B","pzprv3/creek/6/6/. 0 . . . 0 . /. . . . 2 . . /. . 2 2 . . . /1 . . 1 . 2 . /1 . 4 . 3 . . /. . . . . . . /. . . . . . . /. . . . . . /. . . . # . /. . . . # . /. # # . # . /. # # # # . /. . . . . . /"],
			["","pzprv3/creek/6/6/. 0 . . . 0 . /. . . . 2 . . /. . 2 2 . . . /1 . . 1 . 2 . /1 . 4 . 3 . . /. . . . . . . /. . . . . . . /. + + + + . /. # # # # + /. + + + # + /# # # + # + /. # # # # + /. . + + + + /"]
		],
		factors : [
			["������ɓ��������������Ă��܂��B","pzprv3/factors/5/5/1 1 0 1 /1 1 1 1 /1 1 1 1 /1 1 1 0 /1 1 0 0 /1 0 1 1 0 /0 1 0 0 1 /1 0 0 1 1 /0 1 1 1 1 /5 4 6 . 5 /3 . 40 12 . /. 10 . . 2 /8 . . 3 . /. 3 20 . . /5 . . . 5 /. . . . 1 /. . . . . /. . . . . /. . . . . /"],
			["�u���b�N�̐����Ɛ����̐ς������ł͂���܂���B","pzprv3/factors/5/5/1 1 0 1 /1 1 1 1 /1 1 1 1 /1 1 1 0 /1 1 0 0 /1 0 1 1 0 /0 1 0 0 1 /1 0 0 1 1 /0 1 1 1 1 /5 4 6 . 5 /3 . 40 12 . /. 10 . . 2 /8 . . 3 . /. 3 20 . . /5 . . . 2 /. . . . 5 /. . . . . /. . . . . /. . . . . /"],
			["�����̓����Ă��Ȃ��}�X������܂��B","pzprv3/factors/5/5/1 1 0 1 /1 1 1 1 /1 1 1 1 /1 1 1 0 /1 1 0 0 /1 0 1 1 0 /0 1 0 0 1 /1 0 0 1 1 /0 1 1 1 1 /5 4 6 . 5 /3 . 40 12 . /. 10 . . 2 /8 . . 3 . /. 3 20 . . /5 4 . . 1 /3 1 . 4 5 /1 . . 3 . /. . . . . /. . . . . /"],
			["","pzprv3/factors/5/5/1 1 0 1 /1 1 1 1 /1 1 1 1 /1 1 1 0 /1 1 0 0 /1 0 1 1 0 /0 1 0 0 1 /1 0 0 1 1 /0 1 1 1 1 /5 4 6 . 5 /3 . 40 12 . /. 10 . . 2 /8 . . 3 . /. 3 20 . . /5 4 3 2 1 /3 1 2 4 5 /1 5 4 3 2 /4 2 5 1 3 /2 3 1 5 4 /"]
		],
		fillmat : [
			["�\���̌����_������܂��B","pzprv3/fillmat/5/5/3 . . 3 . /. . . . . /. . 1 . . /. . . . . /. 1 . . 4 /0 1 0 0 /0 1 0 0 /0 1 0 0 /0 1 0 0 /0 1 0 0 /0 0 0 0 0 /1 1 1 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["�ׂ荇���^�^�~�̑傫���������ł��B","pzprv3/fillmat/5/5/3 . . 3 . /. . . . . /. . 1 . . /. . . . . /. 1 . . 4 /0 0 1 1 /0 0 1 1 /0 0 1 1 /0 0 0 0 /0 0 0 0 /1 1 1 0 0 /0 0 0 0 0 /0 0 0 1 0 /0 0 0 0 0 /"],
			["�u���P�}�X�A�����P�`�S�}�X�v�ł͂Ȃ��^�^�~������܂��B","pzprv3/fillmat/5/5/3 . . 3 . /. . . . . /. . 1 . . /. . . . . /. 1 . . 4 /1 0 0 0 /1 0 0 0 /1 0 0 0 /1 0 0 0 /1 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["1�̃^�^�~��2�ȏ�̐����������Ă��܂��B","pzprv3/fillmat/5/5/3 . . 3 . /. . . . . /. . 1 . . /. . . . . /. 1 . . 4 /0 0 0 1 /0 0 1 0 /1 0 0 0 /0 1 0 0 /0 0 0 1 /1 1 1 1 1 /1 1 1 1 1 /1 1 1 1 1 /1 1 1 1 1 /"],
			["�����ƃ^�^�~�̑傫�����Ⴂ�܂��B","pzprv3/fillmat/5/5/3 . . 3 . /. . . . . /. . 1 . . /. . . . . /. 1 . . 4 /0 1 0 0 /0 0 0 1 /0 -1 2 -1 /1 0 -1 -1 /-1 -1 2 0 /1 1 1 1 1 /1 1 1 1 1 /1 1 1 1 1 /1 1 1 1 1 /"],
			["","pzprv3/fillmat/5/5/3 . . 3 . /. . . . . /. . 1 . . /. . . . . /. 1 . . 4 /1 1 0 0 /1 1 0 1 /1 1 1 1 /1 1 1 1 /1 1 1 1 /0 -1 1 1 1 /0 -1 1 1 -1 /1 -1 1 -1 -1 /0 1 -1 0 -1 /"]
		],
		fillomino : [
			["�������܂܂�Ă��Ȃ��u���b�N������܂��B","pzprv3/fillomino/6/6/. . 4 . . . /. 5 3 . 2 . /. . . . 5 2 /3 3 . . . . /. 2 . 1 4 . /. . . 3 . . /. . . . . . /. . . . . . /. . . . . . /. . . . . . /. . . . . . /. . . . . . /0 0 0 1 0 /0 0 0 0 1 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 1 0 /0 0 0 0 0 1 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /"],
			["�u���b�N�̑傫����萔���̂ق����傫���ł��B","pzprv3/fillomino/6/6/. . 4 . . . /. 5 3 . 2 . /. . . . 5 2 /3 3 . . . . /. 2 . 1 4 . /. . . 3 . . /. . . . . . /. . . . . . /. . . . . . /. . . . 5 . /. . . . . . /. . . . . . /0 0 0 0 0 /0 0 0 0 0 /0 0 0 1 1 /0 0 0 1 1 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 1 0 /0 0 0 0 0 0 /0 0 0 0 1 0 /0 0 0 0 0 0 /"],
			["���������̃u���b�N���ӂ����L���Ă��܂��B","pzprv3/fillomino/6/6/. . 4 . . . /. 5 3 . 2 . /. . . . 5 2 /3 3 . . . . /. 2 . 1 4 . /. . . 3 . . /. . . . . . /. . . . . . /. 3 3 3 . . /. . . . 5 . /. . . . . . /. . . . . . /0 0 0 0 0 /0 1 1 0 0 /1 1 0 1 1 /0 1 0 0 1 /0 0 0 0 0 /0 0 0 0 0 /0 0 1 0 0 0 /0 1 0 1 1 0 /1 0 1 1 0 0 /1 1 0 0 1 0 /0 0 0 0 0 0 /"],
			["�u���b�N�̑傫�������������������ł��B","pzprv3/fillomino/6/6/. . 4 . . . /. 5 3 . 2 . /. . . . 5 2 /3 3 . . . . /. 2 . 1 4 . /. . . 3 . . /. . . . . . /. . . . . . /. . 3 3 . . /. . 5 5 5 . /. . 5 . . . /. . 5 . . . /0 0 0 0 0 /0 1 1 0 0 /0 1 0 1 1 /0 1 0 0 1 /1 1 1 0 0 /0 1 1 0 0 /0 0 1 0 0 0 /0 0 0 1 1 0 /1 1 1 1 0 0 /0 1 0 1 1 0 /1 0 0 0 0 0 /"],
			["������ނ̐����������Ă���u���b�N������܂��B","pzprv3/fillomino/6/6/. . 4 . . . /. 5 3 . 2 . /. . . . 5 2 /3 3 . . . . /. 2 . 1 4 . /. . . 3 . . /. . . . . . /. . . . . . /. . 3 3 . . /. . 5 5 5 . /. . 5 . . . /1 . . . . . /0 0 0 0 0 /0 1 1 0 0 /0 1 0 1 1 /0 1 0 0 1 /1 1 1 0 0 /1 0 0 0 0 /0 0 1 0 0 0 /0 0 0 1 1 0 /1 1 1 1 0 0 /0 1 0 1 1 0 /0 0 1 0 0 0 /"],
			["�u���b�N�̑傫����萔���̂ق����傫���ł��B","pzprv3/fillomino/6/6/. . 4 . . . /. 5 3 . 2 . /. . . . 5 2 /3 3 . . . . /. 2 . 1 4 . /. . . 3 . . /. . . . . . /. . . . . 1 /. . 3 3 . . /. . 5 5 5 . /3 . 5 . . . /1 2 3 . . . /0 1 0 0 0 /0 1 1 0 1 /0 1 0 1 1 /0 1 0 0 1 /1 1 1 1 0 /1 1 0 0 1 /0 0 1 1 1 1 /0 0 0 1 1 1 /1 1 1 1 0 0 /0 1 0 1 1 1 /1 0 1 1 1 0 /"],
			["�����̓����Ă��Ȃ��}�X������܂��B","pzprv3/fillomino/6/6/. . 4 . . . /. 5 3 . 2 . /. . . . 5 2 /3 3 . . . . /. 2 . 1 4 . /. . . 3 . . /. . . . . . /. . . . . 1 /. . 3 3 . . /. . 5 5 5 2 /2 . 5 . . . /1 3 3 . 4 . /0 1 0 0 0 /0 1 1 0 1 /1 1 0 1 1 /0 1 0 0 1 /0 1 1 1 0 /1 0 0 1 0 /0 0 1 1 1 1 /1 0 0 1 1 1 /0 1 1 1 0 0 /1 1 0 1 1 1 /1 1 1 1 0 0 /"],
			["","pzprv3/fillomino/6/6/. . 4 . . . /. 5 3 . 2 . /. . . . 5 2 /3 3 . . . . /. 2 . 1 4 . /. . . 3 . . /5 5 . 4 4 4 /5 . . 2 . 1 /3 5 3 3 . . /. . 5 5 5 2 /2 . 5 . . 4 /1 3 3 . 4 4 /0 1 0 0 0 /0 1 1 0 1 /1 1 0 1 1 /0 1 0 0 1 /0 1 1 1 0 /1 0 0 1 0 /0 0 1 1 1 1 /1 0 0 1 1 1 /0 1 1 1 0 0 /1 1 0 1 1 1 /1 1 1 1 0 0 /"]
		],
		firefly : [
			["���򂵂Ă����������܂��B","pzprv3/firefly/5/5/4,0 . . . 2,1 /. 3,- . 3,0 . /. . . . . /. 1,0 . 2,2 . /1,1 . . . 1,1 /1 1 1 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 1 0 0 /0 0 1 0 0 /0 0 1 0 0 /0 0 0 0 0 /"],
			["�����������Ă��܂��B","pzprv3/firefly/5/5/4,0 . . . 2,1 /. 3,- . 3,0 . /. . . . . /. 1,0 . 2,2 . /1,1 . . . 1,1 /1 1 0 0 /0 0 0 0 /0 1 1 0 /0 0 0 0 /0 0 0 0 /0 0 1 0 0 /0 0 1 1 0 /0 1 1 0 0 /0 0 0 0 0 /"],
			["���_���m�����Ōq�����Ă��܂��B","pzprv3/firefly/5/5/4,0 . . . 2,1 /. 3,- . 3,0 . /. . . . . /. 1,0 . 2,2 . /1,1 . . . 1,1 /1 0 0 0 /0 0 1 0 /0 1 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 0 1 0 0 /0 1 0 0 0 /0 0 0 0 0 /"],
			["���̋Ȃ������񐔂������ƈ���Ă��܂��B","pzprv3/firefly/5/5/4,0 . . . 2,1 /. 3,- . 3,0 . /. . . . . /. 1,0 . 2,2 . /1,1 . . . 1,1 /1 1 1 1 /0 1 0 0 /0 1 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 0 1 0 0 /0 1 0 0 0 /0 0 0 0 0 /"],
			["�����r���œr�؂�Ă��܂��B","pzprv3/firefly/5/5/4,0 . . . 2,1 /. 3,- . 3,0 . /. . . . . /. 1,0 . 2,2 . /1,1 . . . 1,1 /1 1 1 1 /0 0 0 0 /0 1 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 0 1 0 0 /0 1 0 0 0 /0 0 0 0 0 /"],
			["�����S�̂ň�Ȃ���ɂȂ��Ă��܂���B","pzprv3/firefly/5/5/4,0 . . . 2,1 /. 3,- . 3,0 . /. . . . . /. 1,0 . 2,2 . /1,1 . . . 1,1 /1 1 1 1 /1 1 1 1 /0 0 0 0 /1 0 0 1 /0 1 1 0 /1 0 0 0 1 /0 0 0 0 0 /0 0 0 0 0 /1 1 0 1 1 /"],
			["�����r���œr�؂�Ă��܂��B","pzprv3/firefly/5/5/4,0 . . . 2,1 /. 3,- . 3,0 . /. . . . . /. 1,0 . 2,2 . /1,1 . . . 1,1 /1 1 1 1 /1 1 1 1 /0 0 0 0 /1 0 0 1 /0 1 1 0 /1 0 0 0 1 /0 0 0 0 0 /0 1 0 0 0 /1 1 0 1 1 /"],
			["�z�^����������o�Ă��܂���B","pzprv3/firefly/5/5/4,0 . . . 2,1 /. 3,- . 3,0 . /. . . . . /. 1,0 . 2,2 . /1,1 . . . 1,1 /1 1 1 1 /1 1 1 1 /0 0 0 0 /0 0 0 1 /0 1 1 0 /1 0 0 0 1 /0 1 0 0 0 /0 1 0 0 0 /0 1 0 1 1 /"],
			["���ۂ́A���_�łȂ������ǂ������������Ă��܂��B","pzprv3/firefly/5/5/4,0 . . . 2,1 /. 3,- . 3,0 . /. . . . . /. 1,0 . 2,2 . /1,1 . . . 1,1 /1 1 1 1 /1 1 1 1 /0 0 0 0 /1 0 0 1 /0 1 1 0 /1 0 0 0 1 /0 1 0 1 0 /0 1 0 1 0 /1 1 0 1 1 /"],
			["","pzprv3/firefly/5/5/4,0 . . . 2,1 /. 3,- . 3,0 . /. . . . . /. 1,0 . 2,2 . /1,1 . . . 1,1 /1 1 1 1 /1 1 1 1 /-1 -1 -1 -1 /1 0 0 1 /0 1 1 0 /1 -1 -1 -1 1 /0 1 0 0 -1 /0 1 0 0 -1 /1 1 0 1 1 /"]
		],
		gokigen : [
			["�ΐ��ŗւ������ł��Ă��܂��B","pzprv3/gokigen/4/4/. . . 0 . /. 4 . . . /2 . . . 2 /. . . . . /. 1 . 0 . /. 2 1 . /2 . . 1 /1 . . 2 /. 1 2 . /"],
			["�����Ɍq������̐����Ԉ���Ă��܂��B","pzprv3/gokigen/4/4/. . . 0 . /. 4 . . . /2 . . . 2 /. . . . . /. 1 . 0 . /. 2 1 . /2 . . 1 /1 . . 2 /. . 2 . /"],
			["�ΐ����Ȃ��}�X������܂��B","pzprv3/gokigen/4/4/. . . 0 . /. 4 . . . /2 . . . 2 /. . . . . /. 1 . 0 . /1 2 1 2 /2 1 . 1 /1 . . 2 /. 2 2 1 /"],
			["","pzprv3/gokigen/4/4/. . . 0 . /. 4 . . . /2 . . . 2 /. . . . . /. 1 . 0 . /1 2 1 2 /2 1 1 1 /1 1 2 2 /2 2 2 1 /"]
		],
		hakoiri : [
			["�����L�����^�e���R�i�i���ɗאڂ��Ă��܂��B","pzprv3/hakoiri/5/5/4/0 0 0 1 1 /0 0 2 1 1 /3 2 2 2 1 /3 3 2 3 3 /3 3 3 3 3 /1 . . . 3 /. . . 1 . /. . . . . /2 3 . 2 . /. 1 . . 1 /. . . . . /. 1 2 . . /+ . . 3 . /. . . . . /+ . . . . /"],
			["1�̃n�R��4�ȏ�̋L���������Ă��܂��B","pzprv3/hakoiri/5/5/4/0 0 0 1 1 /0 0 2 1 1 /3 2 2 2 1 /3 3 2 3 3 /3 3 3 3 3 /1 . . . 3 /. . . 1 . /. . . . . /2 3 . 2 . /. 1 . . 1 /. . . . . /. . 2 . . /+ . . 3 . /. . . . . /+ . . . . /"],
			["1�̃n�R�ɓ����L�������������Ă��܂��B","pzprv3/hakoiri/5/5/4/0 0 0 1 1 /0 0 0 1 1 /2 0 0 0 1 /2 2 0 3 3 /2 2 3 3 3 /1 . . . 3 /. . . 1 . /. . . . . /2 3 . 2 . /. 1 . . 1 /. . . . . /. . . . . /+ 1 . 3 . /. . . . . /+ . . . . /"],
			["�^�e���R�ɂȂ����Ă��Ȃ��L��������܂��B","pzprv3/hakoiri/5/5/5/0 0 0 1 1 /0 0 2 1 1 /3 2 2 2 1 /3 3 2 4 4 /3 3 4 4 4 /1 . . . 3 /. . . 1 . /. . . . . /2 3 . 2 . /. 1 . . 1 /. . . . . /. . . . . /. . . . . /. . . . . /. . . . . /"],
			["1�̃n�R��2�ȉ��̋L�����������Ă��܂���B","pzprv3/hakoiri/5/5/5/0 0 0 1 1 /0 0 2 1 1 /3 2 2 2 1 /3 3 2 4 4 /3 3 4 4 4 /. . . . 3 /. . . 1 . /. . . . . /2 3 . 2 . /. 1 . . 1 /. + + . . /2 3 2 . 2 /+ 1 + 3 . /. . + . + /+ . + 3 . /"],
			["","pzprv3/hakoiri/5/5/5/0 0 0 1 1 /0 0 2 1 1 /3 2 2 2 1 /3 3 2 4 4 /3 3 4 4 4 /1 . . . 3 /. . . 1 . /. . . . . /2 3 . 2 . /. 1 . . 1 /. + + . . /2 3 2 . 2 /+ 1 + 3 . /. . + . + /+ . + 3 . /"]
		],
		hashikake : [
			["�����ɂȂ��鋴�̐����Ⴂ�܂��B","pzprv3/hashikake/5/5/4 . 2 . . /. 3 . . 2 /3 . . . . /. 3 . 1 . /3 . 4 . 3 /2 2 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /2 0 0 0 0 /2 0 0 0 0 /2 0 0 0 0 /2 0 0 0 0 /"],
			["�����S�̂ň�Ȃ���ɂȂ��Ă��܂���B","pzprv3/hashikake/5/5/4 . 2 . . /. 3 . . 2 /3 . . . . /. 3 . 1 . /3 . 4 . 3 /2 2 0 0 /0 1 1 1 /-1 0 0 0 /0 0 0 0 /0 0 0 0 /2 0 0 0 0 /2 1 0 0 0 /1 1 0 0 0 /1 0 0 0 0 /"],
			["�����ɂȂ��鋴�̐����Ⴂ�܂��B","pzprv3/hashikake/5/5/4 . 2 . . /. 3 . . 2 /3 . . . . /. 3 . 1 . /3 . 4 . 3 /2 2 0 0 /0 1 1 1 /-1 0 0 0 /0 1 1 0 /1 1 1 1 /2 0 0 0 0 /2 1 0 0 1 /1 1 0 0 1 /1 0 0 0 1 /"],
			["","pzprv3/hashikake/5/5/4 . 2 . . /. 3 . . 2 /3 . . . . /. 3 . 1 . /3 . 4 . 3 /2 2 0 0 /0 1 1 1 /-1 0 -1 -1 /0 1 1 -1 /2 2 2 2 /2 0 0 0 0 /2 2 0 0 1 /1 2 0 -1 1 /1 0 0 -1 1 /"]
		],
		heyawake : [
			["���}�X���^�e���R�ɘA�����Ă��܂��B","pzprv3/heyawake/6/6/8/0 1 1 2 2 3 /0 1 1 2 2 3 /0 1 1 2 2 3 /4 4 4 4 4 3 /5 5 5 6 6 3 /5 5 5 6 6 7 /2 2 . 2 . 2 /. . . . . . /. . . . . . /. . . . . . /. . . . . . /. . . . . . /. . . . . . /. . . . . . /. # . . . . /. # . . . . /. . . . . . /. . . . . . /"],
			["���}�X�����f����Ă��܂��B","pzprv3/heyawake/6/6/8/0 1 1 2 2 3 /0 1 1 2 2 3 /0 1 1 2 2 3 /4 4 4 4 4 3 /5 5 5 6 6 3 /5 5 5 6 6 7 /2 2 . 2 . 2 /. . . . . . /. . . . . . /. . . . . . /. . . . . . /. . . . . . /# . # . . . /. . . # . . /# . # . . . /. # . . . . /. . . . . . /. . . . . . /"],
			["�����̐����ƍ��}�X�̐�����v���Ă��܂���B","pzprv3/heyawake/6/6/8/0 1 1 2 2 3 /0 1 1 2 2 3 /0 1 1 2 2 3 /4 4 4 4 4 3 /5 5 5 6 6 3 /5 5 5 6 6 7 /2 2 . 2 . 2 /. . . . . . /. . . . . . /. . . . . . /. . . . . . /. . . . . . /# . . . . . /. . . # . . /# . # . # . /. # . . . . /. . . . . . /. . . . . . /"],
			["���}�X��3�����A���ő����Ă��܂��B","pzprv3/heyawake/6/6/8/0 1 1 2 2 3 /0 1 1 2 2 3 /0 1 1 2 2 3 /4 4 4 4 4 3 /5 5 5 6 6 3 /5 5 5 6 6 7 /2 2 . 2 . 2 /. . . . . . /. . . . . . /. . . . . . /. . . . . . /. . . . . . /# + # + + # /+ + + # + + /# + # + # + /+ + + + + + /. # . # . # /. . . . . . /"],
			["�l�p�`�ł͂Ȃ�����������܂��B","pzprv3/heyawake/6/6/7/0 1 1 2 2 3 /0 1 1 2 2 3 /0 1 1 2 2 3 /4 4 4 4 4 3 /5 5 5 6 6 3 /5 5 5 6 6 6 /2 2 . 2 . 2 /. . . . . . /. . . . . . /. . . . . . /. . . . . . /. . . . . . /# + # + + # /+ + + # + + /# + # + # + /+ + + + + + /. # . # . # /. . . . . . /"],
			["","pzprv3/heyawake/6/6/8/0 1 1 2 2 3 /0 1 1 2 2 3 /0 1 1 2 2 3 /4 4 4 4 4 3 /5 5 5 6 6 3 /5 5 5 6 6 7 /2 2 . 2 . 2 /. . . . . . /. . . . . . /. . . . . . /. . . . . . /. . . . . . /# + # + + # /+ + + # + + /# + # + # + /+ + + + + + /. # . # . # /. . # . . . /"]
		],
		hitori : [
			["���}�X���^�e���R�ɘA�����Ă��܂��B","pzprv3/hitori/4/4/1 1 1 4 /1 4 2 3 /3 3 2 1 /4 2 1 3 /# . . . /# . . . /. . . . /. . . . /"],
			["���}�X�����f����Ă��܂��B","pzprv3/hitori/4/4/1 1 1 4 /1 4 2 3 /3 3 2 1 /4 2 1 3 /# . . . /. . . # /# . # . /. # . . /"],
			["������ɓ��������������Ă��܂��B","pzprv3/hitori/4/4/1 1 1 4 /1 4 2 3 /3 3 2 1 /4 2 1 3 /# . . . /. . . . /# . # . /. . . # /"],
			["","pzprv3/hitori/4/4/1 1 1 4 /1 4 2 3 /3 3 2 1 /4 2 1 3 /# + # . /+ + + . /# + # . /+ + + # /"]
		],
		icebarn : [
			["���򂵂Ă����������܂��B","pzprv3/icebarn/8/8/115/123/0 0 1 1 1 0 0 0 /1 1 0 1 0 1 1 1 /1 1 0 1 0 1 1 1 /1 1 0 1 0 0 0 0 /0 0 0 0 0 1 0 1 /1 1 0 0 0 1 1 1 /1 1 0 1 0 1 1 1 /0 0 1 1 1 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 1 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 2 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 2 0 0 0 0 /2 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 /0 0 0 0 0 0 1 0 /0 0 0 0 0 0 0 0 /0 2 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 1 /0 0 0 2 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 1 1 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 1 0 0 0 0 /0 0 0 1 0 0 0 0 /0 0 0 1 0 0 0 0 /0 0 0 1 0 0 0 0 /0 0 0 1 0 0 0 0 /0 1 0 1 0 0 0 0 /0 1 0 0 0 0 0 0 /0 1 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 /"],
			["�X�̕����ȊO�Ő����������Ă��܂��B","pzprv3/icebarn/8/8/115/123/0 0 1 1 1 0 0 0 /1 1 0 1 0 1 1 1 /1 1 0 1 0 1 1 1 /1 1 0 1 0 0 0 0 /0 0 0 0 0 1 0 1 /1 1 0 0 0 1 1 1 /1 1 0 1 0 1 1 1 /0 0 1 1 1 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 1 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 2 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 2 0 0 0 0 /2 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 /0 0 0 0 0 0 1 0 /0 0 0 0 0 0 0 0 /0 2 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 1 /0 0 0 2 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 1 1 1 1 1 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 1 0 0 0 0 /0 0 0 1 0 0 1 0 /0 0 0 1 0 0 1 0 /0 0 0 1 0 0 1 0 /0 0 0 1 0 0 1 0 /0 1 0 1 0 0 0 0 /0 1 0 0 0 0 0 0 /0 1 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 /"],
			["�X�̕����Ő����Ȃ����Ă��܂��B","pzprv3/icebarn/8/8/115/123/0 0 1 1 1 0 0 0 /1 1 0 1 0 1 1 1 /1 1 0 1 0 1 1 1 /1 1 0 1 0 0 0 0 /0 0 0 0 0 1 0 1 /1 1 0 0 0 1 1 1 /1 1 0 1 0 1 1 1 /0 0 1 1 1 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 1 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 2 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 2 0 0 0 0 /2 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 /0 0 0 0 0 0 1 0 /0 0 0 0 0 0 0 0 /0 2 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 1 /0 0 0 2 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 1 0 0 /0 0 0 0 1 1 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 1 0 0 0 0 /0 0 0 1 0 0 1 0 /0 0 0 1 0 0 1 0 /0 0 0 1 0 0 1 0 /0 0 0 1 0 1 0 0 /0 1 0 0 0 0 0 0 /0 1 0 0 0 0 0 0 /0 1 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 /"],
			["IN�ɐ����ʂ��Ă��܂���B","pzprv3/icebarn/8/8/115/123/0 0 1 1 1 0 0 0 /1 1 0 1 0 1 1 1 /1 1 0 1 0 1 1 1 /1 1 0 1 0 0 0 0 /0 0 0 0 0 1 0 1 /1 1 0 0 0 1 1 1 /1 1 0 1 0 1 1 1 /0 0 1 1 1 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 1 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 2 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 2 0 0 0 0 /2 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 /0 0 0 0 0 0 1 0 /0 0 0 0 0 0 0 0 /0 2 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 1 /0 0 0 2 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 1 1 1 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 /0 0 0 0 0 0 1 0 /0 0 0 0 0 0 1 0 /0 0 0 0 0 0 1 0 /0 0 0 0 0 0 1 0 /0 1 0 0 0 0 0 0 /0 1 0 0 0 0 0 0 /0 1 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 /"],
			["�r���œr�؂�Ă����������܂��B","pzprv3/icebarn/8/8/115/123/0 0 1 1 1 0 0 0 /1 1 0 1 0 1 1 1 /1 1 0 1 0 1 1 1 /1 1 0 1 0 0 0 0 /0 0 0 0 0 1 0 1 /1 1 0 0 0 1 1 1 /1 1 0 1 0 1 1 1 /0 0 1 1 1 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 1 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 2 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 2 0 0 0 0 /2 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 /0 0 0 0 0 0 1 0 /0 0 0 0 0 0 0 0 /0 2 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 1 /0 0 0 2 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 1 1 1 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 1 0 0 0 0 /0 0 0 1 0 0 1 0 /0 0 0 1 0 0 1 0 /0 0 0 1 0 0 1 0 /0 0 0 1 0 0 1 0 /0 1 0 0 0 0 0 0 /0 1 0 0 0 0 0 0 /0 1 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 /"],
			["�Ֆʂ̊O�ɏo�Ă��܂�����������܂��B","pzprv3/icebarn/8/8/115/123/0 0 1 1 1 0 0 0 /1 1 0 1 0 1 1 1 /1 1 0 1 0 1 1 1 /1 1 0 1 0 0 0 0 /0 0 0 0 0 1 0 1 /1 1 0 0 0 1 1 1 /1 1 0 1 0 1 1 1 /0 0 1 1 1 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 1 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 2 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 2 0 0 0 0 /2 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 /0 0 0 0 0 0 1 0 /0 0 0 0 0 0 0 0 /0 2 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 1 /0 0 0 2 0 0 0 0 /0 0 0 0 0 0 0 1 1 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 1 1 1 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 1 0 0 0 0 /0 0 0 1 0 0 1 0 /0 0 0 1 0 0 1 0 /0 0 0 1 0 0 1 0 /0 0 0 1 0 0 1 0 /0 1 0 0 0 0 0 0 /0 1 0 0 0 0 0 0 /0 1 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 /"],
			["�����t�ɒʂ��Ă��܂��B","pzprv3/icebarn/8/8/115/123/0 0 1 1 1 0 0 0 /1 1 0 1 0 1 1 1 /1 1 0 1 0 1 1 1 /1 1 0 1 0 0 0 0 /0 0 0 0 0 1 0 1 /1 1 0 0 0 1 1 1 /1 1 0 1 0 1 1 1 /0 0 1 1 1 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 1 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 2 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 2 0 0 0 0 /2 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 /0 0 0 0 0 0 1 0 /0 0 0 0 0 0 0 0 /0 2 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 1 /0 0 0 2 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 1 1 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 1 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 1 0 0 0 0 /0 0 0 1 0 0 0 0 /0 0 0 1 0 0 0 0 /0 0 1 1 1 0 0 0 /0 0 1 1 1 0 0 0 /0 1 0 0 0 0 0 0 /0 1 0 0 0 0 0 0 /0 1 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 /"],
			["�����ЂƂȂ���ł͂���܂���B","pzprv3/icebarn/8/8/115/123/0 0 1 1 1 0 0 0 /1 1 0 1 0 1 1 1 /1 1 0 1 0 1 1 1 /1 1 0 1 0 0 0 0 /0 0 0 0 0 1 0 1 /1 1 0 0 0 1 1 1 /1 1 0 1 0 1 1 1 /0 0 1 1 1 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 1 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 2 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 2 0 0 0 0 /2 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 /0 0 0 0 0 0 1 0 /0 0 0 0 0 0 0 0 /0 2 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 1 /0 0 0 2 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 -1 -1 -1 0 /0 0 0 1 1 -1 -1 -1 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 1 0 0 0 0 /0 0 0 -1 1 -1 -1 -1 0 /0 0 0 1 1 -1 -1 -1 0 /0 0 1 1 1 1 0 1 0 /0 0 0 1 0 0 0 0 /0 0 0 1 0 0 0 0 /0 0 0 1 0 0 0 0 /0 0 1 1 1 0 0 0 /0 0 1 1 1 0 0 1 /0 1 1 -1 0 0 0 1 /0 1 1 1 1 0 0 1 /0 1 0 1 0 0 0 1 /0 0 0 1 0 0 0 0 /"],
			["���ׂẴA�C�X�o�[����ʂ��Ă��܂���B","pzprv3/icebarn/8/8/115/123/0 0 1 1 1 0 0 0 /1 1 0 1 0 1 1 1 /1 1 0 1 0 1 1 1 /1 1 0 1 0 0 0 0 /0 0 0 0 0 1 0 1 /1 0 0 0 0 1 1 1 /1 0 0 1 0 1 1 1 /0 0 1 1 1 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 1 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 2 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 2 0 0 0 0 /2 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 /0 0 0 0 0 0 1 0 /0 0 0 0 0 0 0 0 /0 2 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 1 /0 0 0 2 0 0 0 0 /0 1 1 1 1 1 1 0 0 /0 0 0 0 0 -1 -1 -1 0 /0 0 0 1 1 -1 -1 -1 0 /0 0 0 0 0 1 0 1 0 /0 1 0 0 1 1 1 0 0 /0 0 0 -1 1 -1 -1 -1 0 /0 0 0 1 1 -1 -1 -1 0 /0 0 1 1 1 1 0 1 0 /0 0 0 1 0 0 0 0 /1 0 0 1 0 0 1 0 /1 0 0 1 0 0 1 0 /1 0 1 1 1 0 1 0 /1 0 1 1 0 1 0 1 /0 1 1 -1 0 1 1 1 /0 1 1 1 1 1 1 1 /0 1 0 1 0 1 1 1 /0 0 0 1 0 0 0 0 /"],
			["�����ʂ��Ă��Ȃ���󂪂���܂��B","pzprv3/icebarn/8/8/115/123/0 0 1 1 1 0 0 0 /1 1 0 1 0 1 1 1 /1 1 0 1 0 1 1 1 /1 1 0 1 0 0 0 0 /0 0 0 0 0 1 0 1 /1 1 0 0 0 1 1 1 /1 1 0 1 0 1 1 1 /0 0 1 1 1 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 1 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 2 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 2 0 0 0 0 /2 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 /0 0 0 0 0 0 1 0 /0 0 0 0 0 0 0 0 /0 2 0 0 0 0 0 0 /2 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 1 /0 0 0 2 0 0 0 0 /0 1 1 1 1 1 1 0 0 /0 0 0 0 0 -1 -1 -1 0 /0 0 0 1 1 -1 -1 -1 0 /0 0 0 0 0 1 0 1 0 /0 1 0 0 1 1 1 0 0 /0 0 0 -1 1 -1 -1 -1 0 /0 0 0 1 1 -1 -1 -1 0 /0 0 1 1 1 1 0 1 0 /0 0 0 1 0 0 0 0 /1 0 0 1 0 0 1 0 /1 0 0 1 0 0 1 0 /1 0 1 1 1 0 1 0 /1 0 1 1 0 1 0 1 /0 1 1 -1 0 1 1 1 /0 1 1 1 1 1 1 1 /0 1 0 1 0 1 1 1 /0 0 0 1 0 0 0 0 /"],
			["","pzprv3/icebarn/8/8/115/123/0 0 1 1 1 0 0 0 /1 1 0 1 0 1 1 1 /1 1 0 1 0 1 1 1 /1 1 0 1 0 0 0 0 /0 0 0 0 0 1 0 1 /1 1 0 0 0 1 1 1 /1 1 0 1 0 1 1 1 /0 0 1 1 1 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 1 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 2 0 0 0 0 0 /0 0 0 0 0 0 0 0 0 /0 0 0 2 0 0 0 0 /2 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 /0 0 0 0 0 0 1 0 /0 0 0 0 0 0 0 0 /0 2 0 0 0 0 0 0 /0 0 0 0 0 0 0 0 /0 0 0 0 0 0 0 1 /0 0 0 2 0 0 0 0 /0 1 1 1 1 1 1 0 0 /0 0 0 0 0 -1 -1 -1 0 /0 0 0 1 1 -1 -1 -1 0 /0 0 0 0 0 1 0 1 0 /0 1 0 0 1 1 1 0 0 /0 0 0 -1 1 -1 -1 -1 0 /0 0 0 1 1 -1 -1 -1 0 /0 0 1 1 1 1 0 1 0 /0 0 0 1 0 0 0 0 /1 0 0 1 0 0 1 0 /1 0 0 1 0 0 1 0 /1 0 1 1 1 0 1 0 /1 0 1 1 0 1 0 1 /0 1 1 -1 0 1 1 1 /0 1 1 1 1 1 1 1 /0 1 0 1 0 1 1 1 /0 0 0 1 0 0 0 0 /"]
		],
		ichimaga : [
			["���򂵂Ă����������܂��B","pzprv3/ichimaga/5/5/mag/2 . 2 . . /. 4 . . . /1 . . 4 . /. . 1 . . /. 2 . . 2 /1 1 1 1 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 1 0 /0 0 0 1 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["�����������Ă��܂��B","pzprv3/ichimaga/5/5/mag/2 . 2 . . /. 4 . . . /1 . . 4 . /. . 1 . . /. 2 . . 2 /1 1 1 0 /0 0 1 1 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 1 1 0 /0 0 0 1 1 /0 0 0 0 1 /0 0 0 0 1 /"],
			["�����������m�����Ōq�����Ă��܂��B","pzprv3/ichimaga/5/5/mag/2 . 2 . . /. 4 . . . /1 . . 4 . /. . 1 . . /. 2 . . 2 /0 0 0 0 /1 1 1 0 /0 1 1 1 /0 0 0 0 /0 0 0 1 /0 1 0 0 0 /0 1 0 1 0 /0 0 0 1 0 /0 0 0 1 0 /"],
			["����2��ȏ�Ȃ����Ă��܂��B","pzprv3/ichimaga/5/5/def/2 . 2 . . /. 4 . . . /1 . . 4 . /. . 1 . . /. 2 . . 2 /0 0 0 0 /1 0 1 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 1 0 0 0 /0 1 1 1 0 /0 0 1 0 0 /0 0 0 0 0 /"],
			["�����r���œr�؂�Ă��܂��B","pzprv3/ichimaga/5/5/def/2 . 2 . . /. 4 . . . /1 . . 4 . /. . 1 . . /. 2 . . 2 /0 0 0 0 /1 1 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 1 0 0 0 /0 1 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["�����S�̂ň�Ȃ���ɂȂ��Ă��܂���B","pzprv3/ichimaga/5/5/def/2 . 2 . . /. 4 . . . /1 . . 4 . /. . 1 . . /. 2 . . 2 /0 0 0 0 /1 1 0 0 /0 0 1 1 /0 0 0 0 /0 0 0 0 /0 1 0 0 0 /0 1 0 1 0 /0 0 0 1 0 /0 0 0 0 0 /"],
			["","pzprv3/ichimaga/5/5/cross/2 . 2 . . /. 4 . . . /1 . . 4 . /. . 1 . . /. 2 . . 2 /1 0 1 0 /1 1 0 0 /1 1 1 1 /0 0 1 0 /0 1 1 1 /1 1 1 1 0 /0 1 0 1 0 /0 1 0 1 1 /0 1 0 0 1 /"],
			["������o����̖{��������������܂���B","pzprv3/ichimaga/5/5/cross/2 . 2 . . /. 4 . . . /1 . . 4 . /. . 1 . . /. 2 . . 2 /1 0 1 0 /1 1 0 0 /1 1 1 1 /0 0 1 0 /1 1 1 1 /1 1 1 1 0 /0 1 0 1 0 /1 1 0 1 1 /1 1 0 0 1 /"],
			["�����������Ă��܂��B","pzprv3/ichimaga/5/5/def/2 . 2 . . /. 4 . . . /1 . . 4 . /. . 1 . . /. 2 . . 2 /1 0 1 0 /1 1 0 0 /1 1 1 1 /0 0 1 0 /1 1 1 1 /1 1 1 1 0 /0 1 0 1 0 /0 1 0 1 1 /0 1 0 0 1 /"],
			["�����S�̂ň�Ȃ���ɂȂ��Ă��܂���B","pzprv3/ichimaga/5/5/def/2 . 2 . . /. 4 . . . /1 . . 4 . /. . 1 . . /. 2 . . 2 /1 0 1 0 /1 1 0 0 /0 0 0 1 /0 0 1 0 /1 1 1 1 /1 1 1 1 0 /0 1 0 1 0 /1 1 0 1 1 /0 1 0 0 1 /"],
			["�����r���œr�؂�Ă��܂��B","pzprv3/ichimaga/5/5/def/2 . 2 . . /. 4 . . . /1 . . 4 . /. . 1 . . /. 2 . . 2 /1 0 1 0 /1 1 0 0 /0 0 0 1 /0 0 1 0 /1 1 0 1 /1 1 1 1 0 /0 1 0 1 0 /1 1 0 1 1 /1 1 0 0 1 /"],
			["������o����̖{��������������܂���B","pzprv3/ichimaga/5/5/def/2 . 2 . . /. 4 . . . /1 . . 4 . /. . 1 . . /. 2 . . 2 /1 0 1 0 /1 1 0 0 /0 0 0 1 /0 0 1 0 /0 1 1 1 /1 1 1 1 0 /0 1 0 1 0 /0 1 0 1 1 /0 1 0 0 1 /"],
			["","pzprv3/ichimaga/5/5/def/2 . 2 . . /. 4 . . . /1 . . 4 . /. . 1 . . /. 2 . . 2 /1 0 1 -1 /1 1 0 -1 /-1 -1 1 1 /0 -1 -1 0 /1 0 0 1 /1 1 1 1 -1 /-1 1 -1 1 -1 /1 1 1 1 1 /1 1 -1 1 1 /"]
		],
		kaero : [
			["���򂵂Ă����������܂��B","pzprv3/kaero/3/3/2 3 2 /. . . /1 . 1 /. . . /. . . /. . . /0 1 /1 1 /0 1 /1 0 0 /0 1 0 /0 0 /1 1 /0 0 /1 0 0 /0 1 0 /"],
			["�����������Ă��܂��B","pzprv3/kaero/3/3/2 3 2 /. . . /1 . 1 /. . . /. . . /. . . /0 1 /1 1 /0 1 /1 0 0 /0 1 0 /0 0 /1 1 /0 0 /0 1 0 /0 1 0 /"],
			["�A���t�@�x�b�g���q�����Ă��܂��B","pzprv3/kaero/3/3/2 3 2 /. . . /1 . 1 /. . . /. . . /. . . /0 1 /1 1 /0 1 /1 0 0 /0 1 0 /0 0 /1 0 /0 0 /0 1 0 /1 0 0 /"],
			["�A���t�@�x�b�g�̏������ʉ߂��Ă��܂��B","pzprv3/kaero/3/3/2 3 2 /. . . /1 . 1 /. . . /. . . /. . . /0 1 /1 1 /0 1 /1 0 0 /0 1 0 /0 0 /1 0 /1 0 /0 0 0 /1 0 0 /"],
			["�P�̃u���b�N�ɈقȂ�A���t�@�x�b�g�������Ă��܂��B","pzprv3/kaero/3/3/2 3 2 /. . . /1 . 1 /. . . /. . . /. . . /0 1 /1 1 /0 1 /1 0 0 /0 1 0 /0 0 /0 0 /0 0 /0 0 0 /0 0 0 /"],
			["�����A���t�@�x�b�g���قȂ�u���b�N�ɓ����Ă��܂��B","pzprv3/kaero/3/3/2 3 2 /. . . /1 . 1 /. . . /. . . /. . . /0 1 /1 1 /1 1 /1 0 0 /0 1 0 /0 0 /1 1 /0 1 /1 0 0 /0 0 0 /"],
			["�A���t�@�x�b�g�̂Ȃ��u���b�N������܂��B","pzprv3/kaero/3/3/2 3 2 /. . . /1 . 1 /. . . /. . . /. . . /0 1 /1 1 /0 1 /1 0 0 /1 1 0 /0 0 /1 1 /0 1 /1 0 0 /0 0 0 /"],
			["�A���t�@�x�b�g�ɂȂ����Ă��Ȃ���������܂��B","pzprv3/kaero/3/3/2 3 2 /. . . /1 . 1 /. . . /. . . /. . . /1 1 /0 0 /0 0 /0 1 0 /1 1 1 /0 0 /0 1 /0 1 /1 0 0 /0 0 0 /"],
			["","pzprv3/kaero/3/3/2 3 2 /. . . /1 . 1 /+ - - /. . - /- - + /0 1 /1 1 /0 1 /1 0 0 /0 1 0 /0 0 /1 1 /0 1 /1 0 0 /0 0 0 /"]
		],
		kakuro : [
			["����������������ɓ����Ă��܂��B","pzprv3/kakuro/5/5/0 0 12 4 0 0 /0 8,4 . . 0,10 0,0 /10 . . . . 0,10 /3 . . 3,17 . . /0 21,0 . . . . /0 0,0 12,0 . . 0,0 /. . . . . /2 . . . . /2 . . . . /. . . . . /. . . . . /"],
			["�����̉����E�ɂ��鐔���̍��v���Ԉ���Ă��܂��B","pzprv3/kakuro/5/5/0 0 12 4 0 0 /0 8,4 . . 0,10 0,0 /10 . . . . 0,10 /3 . . 3,17 . . /0 21,0 . . . . /0 0,0 12,0 . . 0,0 /. . 3 . . /3 4 1 5 . /1 2 . . . /. . . . . /. . . . . /"],
			["���ׂẴ}�X�ɐ����������Ă��܂���B","pzprv3/kakuro/5/5/0 0 12 4 0 0 /0 8,4 . . 0,10 0,0 /10 . . . . 0,10 /3 . . 3,17 . . /0 21,0 . . . . /0 0,0 12,0 . . 0,0 /. . 3 . . /3 4 1 2 . /1 2 . 1 2 /. . 9 . 8 /. . 8 4 . /"],
			["","pzprv3/kakuro/5/5/0 0 12 4 0 0 /0 8,4 . . 0,10 0,0 /10 . . . . 0,10 /3 . . 3,17 . . /0 21,0 . . . . /0 0,0 12,0 . . 0,0 /. 5 3 . . /3 4 1 2 . /1 2 . 1 2 /. 1 9 3 8 /. . 8 4 . /"]
		],
		kakuru : [
			["���߂���o�Ă��鐔���̎���ɓ��������������Ă��܂��B","pzprv3/kakuru/5/5/3 . 10 b 4 /b . . . . /23 . 38 . 11 /. . . . b /16 b 20 . 3 /. 0 . . . /. 0 0 2 2 /. 0 . 0 . /0 0 0 0 . /. . . 0 . /"],
			["���߂���o�Ă��鐔���̎���ɓ��鐔�̍��v������������܂���B","pzprv3/kakuru/5/5/3 . 10 b 4 /b . . . . /23 . 38 . 11 /. . . . b /16 b 20 . 3 /. 1 . . . /. 2 5 3 1 /. 0 . 0 . /0 0 0 0 . /. . . 0 . /"],
			["�����������^�e���R�i�i���ɗאڂ��Ă��܂��B","pzprv3/kakuru/5/5/3 . 10 b 4 /b . . . . /23 . . . 11 /. . . . b /16 b 20 . 3 /. 1 . . . /. 2 4 3 1 /. 0 3 0 . /0 0 0 0 . /. . . 0 . /"],
			["���������Ă��Ȃ��}�X������܂��B","pzprv3/kakuru/5/5/3 . 10 b 4 /b . . . . /23 . 38 . 11 /. . . . b /16 b 20 . 3 /. 2 . . . /. 1 4 3 1 /. 0 . 5 . /0 0 0 2 . /. . . 1 . /"],
			["","pzprv3/kakuru/5/5/3 . 10 b 4 /b . . . . /23 . 38 . 11 /. . . . b /16 b 20 . 3 /. 2 . . . /. 1 4 3 1 /. 6 . 5 . /7 9 8 2 . /. . . 1 . /"]
		],
		kinkonkan : [
			["�ΐ������������ꂽ����������܂��B","pzprv3/kinkonkan/4/4/5/0 0 1 1 /2 2 1 1 /2 2 3 3 /4 4 3 3 /. 2,2 1,1 . 4,1 . /3,2 . . . . . /. . . . . 1,1 /. . . . . . /3,2 . . . . 4,1 /. . . 2,2 . . /. . . . /. 1 . . /1 . . . /. . . . /"],
			["�������������̏ꏊ�֓��B���܂���B","pzprv3/kinkonkan/4/4/5/0 0 1 1 /2 2 1 1 /2 2 3 3 /4 4 3 3 /. 2,2 1,1 . 4,1 . /3,2 . . . . . /. . . . . 1,1 /. . . . . . /3,2 . . . . 4,1 /. . . 2,2 . . /. + . + /+ 2 + + /+ + + + /. . + 1 /"],
			["���̔��ˉ񐔂�����������܂���B","pzprv3/kinkonkan/4/4/5/0 0 1 1 /2 2 1 1 /2 2 3 3 /4 4 3 3 /. 2,2 1,1 . 4,1 . /3,3 . . . . . /. . . . . 1,1 /. . . . . . /3,3 . . . . 4,1 /. . . 2,2 . . /1 + 1 + /+ 1 + + /+ + + + /2 + + 1 /"],
			["�ΐ��̈�����Ă��Ȃ�����������܂��B","pzprv3/kinkonkan/4/4/6/0 0 1 2 /3 3 1 2 /3 3 4 4 /5 5 4 4 /. 2,2 1,1 . 4,1 . /3,2 . . . . . /. . . . . 1,1 /. . . . . . /3,2 . . . . 4,1 /. . . 2,2 . . /1 + 1 + /+ 1 + + /+ + + + /2 + + 1 /"],
			["","pzprv3/kinkonkan/4/4/5/0 0 1 1 /2 2 1 1 /2 2 3 3 /4 4 3 3 /. 2,2 1,1 . 4,1 . /3,2 . . . . . /. . . . . 1,1 /. . . . . . /3,2 . . . . 4,1 /. . . 2,2 . . /1 + 1 + /+ 1 + + /+ + + + /2 + + 1 /"]
		],
		kramma : [
			["���򂵂Ă����������܂��B","pzprv3/kramma/5/5/2 . . . 1 /. 1 2 . . /. 2 1 2 . /1 . 2 1 . /. 1 . . 2 /. . . . . . /. . . . 1 . /. . . 1 . . /. . 1 . . . /. 1 . . . . /. . . . . . /0 0 1 0 /0 0 1 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 0 /1 1 1 1 1 /0 0 0 0 0 /0 0 0 0 0 /"],
			["�������_��Ō������Ă��܂��B","pzprv3/kramma/5/5/2 . . . 1 /. 1 2 . . /. 2 1 2 . /1 . 2 1 . /. 1 . . 2 /. . . . . . /. . . . 1 . /. . . 1 . . /. . 1 . . . /. 1 . . . . /. . . . . . /0 0 1 0 /0 0 1 0 /0 0 1 0 /0 0 1 0 /0 0 0 0 /0 0 0 0 0 /1 1 1 1 1 /0 0 0 0 0 /0 1 1 0 0 /"],
			["�������_�ȊO�ŋȂ����Ă��܂��B","pzprv3/kramma/5/5/2 . . . 1 /. 1 2 . . /. 2 1 2 . /1 . 2 1 . /. 1 . . 2 /. . . . . . /. . . . 1 . /. . . 1 . . /. . 1 . . . /. 1 . . . . /. . . . . . /0 0 0 0 /0 0 0 0 /0 0 1 0 /0 0 1 0 /0 0 0 0 /0 0 0 0 0 /1 1 1 0 0 /0 0 0 0 0 /0 1 1 0 0 /"],
			["���ۂ����ۂ��܂܂�Ȃ��̈悪����܂��B","pzprv3/kramma/5/5/2 . . . 1 /. 1 2 . . /. 2 1 2 . /1 . 2 1 . /. 1 . . 2 /. . . . . . /. . . . 1 . /. . . 1 . . /. . 1 . . . /. 1 . . . . /. . . . . . /1 0 0 1 /1 0 0 0 /1 0 0 0 /1 0 0 0 /0 0 0 0 /1 1 1 1 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["���ۂƍ��ۂ������܂܂��̈悪����܂��B","pzprv3/kramma/5/5/2 . . . 1 /. 1 2 . . /. 2 1 2 . /1 . 2 1 . /. 1 . . 2 /. . . . . . /. . . . 1 . /. . . 1 . . /. . 1 . . . /. 1 . . . . /. . . . . . /1 0 0 1 /1 0 0 0 /1 0 0 0 /1 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["�r���œr�؂�Ă����������܂��B","pzprv3/kramma/5/5/2 . . . 1 /. 1 2 . . /. 2 1 2 . /1 . 2 1 . /. 1 . . 2 /. . . . . . /. . . 1 1 . /. . . 1 . . /. . 1 . . . /. 1 . . . . /. . . . . . /1 1 1 1 /1 1 0 0 /1 1 1 0 /1 0 1 0 /0 0 1 0 /0 0 0 0 1 /1 1 1 0 0 /0 0 1 1 1 /0 1 1 1 1 /"],
			["���_�������ʉ߂��Ă��܂���B","pzprv3/kramma/5/5/2 . . . 1 /. 1 2 . . /. 2 1 2 . /1 . 2 1 . /. 1 . . 2 /. . . . . . /. . . 1 1 . /. . . 1 . . /. . 1 . . . /. 1 . . . . /. . . . . . /1 1 0 1 /1 1 0 0 /1 1 1 0 /1 0 1 0 /0 0 1 0 /0 0 0 0 1 /1 1 1 0 0 /0 0 1 1 1 /0 1 1 1 1 /"],
			["","pzprv3/kramma/5/5/2 . . . 1 /. 1 2 . . /. 2 1 2 . /1 . 2 1 . /. 1 . . 2 /. . . . . . /. . . . 1 . /. . . 1 . . /. . 1 . . . /. 1 . . . . /. . . . . . /1 1 -1 1 /1 1 -1 -1 /1 1 1 -1 /1 -1 1 0 /0 -1 1 0 /-1 -1 -1 -1 1 /1 1 1 -1 -1 /-1 -1 1 1 1 /0 1 1 1 1 /"]
		],
		kurochute : [
			["���}�X���^�e���R�ɘA�����Ă��܂��B","pzprv3/kurochute/5/5/1 3 2 . . /. . . 1 . /. . 1 . . /. 2 . . . /. . 3 3 2 /. . . . . /. 1 . . . /. 1 . . . /. . . . . /. . . . . /"],
			["���}�X�����f����Ă��܂��B","pzprv3/kurochute/5/5/1 3 2 . . /. . . 1 . /. . 1 . . /. 2 . . . /. . 3 3 2 /- . . . . /1 + 1 . . /+ 1 . 1 . /. . . . 1 /. . . . . /"],
			["�����̐��������ꂽ�}�X�̂����A1�}�X�������}�X�ɂȂ��Ă��܂���B","pzprv3/kurochute/5/5/1 3 2 . . /. . . 1 . /. . 1 . . /. 2 . . . /. . 3 3 2 /- - - + 1 /1 + 1 . + /+ + . 1 . /. - + . . /1 . - - . /"],
			["","pzprv3/kurochute/5/5/1 3 2 . . /. . . 1 . /. . 1 . . /. 2 . . . /. . 3 3 2 /- - - + 1 /1 + 1 . + /+ + . . 1 /. - + 1 . /1 . - - . /"]
		],
		kurodoko : [
			["���}�X���^�e���R�ɘA�����Ă��܂��B","pzprv3/kurodoko/5/5/. . . 7 . /5 . . . . /. . 2 . . /. . . . 2 /. 4 . . . /. . . . . /. . . . . /. . . . . /. . # . . /. . # . . /"],
			["���}�X�����f����Ă��܂��B","pzprv3/kurodoko/5/5/. . . 7 . /5 . . . . /. . 2 . . /. . . . 2 /. 4 . . . /. # . . . /. . # . . /. # . . . /. . # . . /. . . # . /"],
			["�����ƍ��}�X�ɂԂ���܂ł�4�����̃}�X�̍��v���Ⴂ�܂��B","pzprv3/kurodoko/5/5/. . . 7 . /5 . . . . /. . 2 . . /. . . . 2 /. 4 . . . /# + + + . /+ + # + + /+ # + + # /+ + # + + /# + + + # /"],
			["","pzprv3/kurodoko/5/5/. . . 7 . /5 . . . . /. . 2 . . /. . . . 2 /. 4 . . . /+ # + + . /+ + # + + /+ # + + # /+ + # + + /# + + + # /"]
		],
		kusabi : [
			["���򂵂Ă����������܂��B","pzprv3/kusabi/5/5/3 1 1 . . /. . . 2 . /. . 1 2 . /. . 1 . . /. . . . 3 /0 0 0 0 /0 0 0 0 /1 1 0 0 /0 0 0 0 /0 0 0 0 /1 0 0 0 0 /1 0 0 0 0 /1 0 0 0 0 /1 0 0 0 0 /"],
			["�����������Ă��܂��B","pzprv3/kusabi/5/5/3 1 1 . . /. . . 2 . /. . 1 2 . /. . 1 . . /. . . . 3 /0 0 0 0 /0 0 0 0 /1 1 0 0 /0 0 0 0 /0 1 0 0 /1 1 0 0 0 /1 1 0 0 0 /0 1 0 0 0 /0 1 1 0 0 /"],
			["3�ȏ�̊ۂ��Ȃ����Ă��܂��B","pzprv3/kusabi/5/5/3 1 1 . . /. . . 2 . /. . 1 2 . /. . 1 . . /. . . . 3 /0 1 1 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 1 0 0 /0 1 0 1 0 /0 1 0 0 0 /0 1 0 0 0 /0 1 1 0 0 /"],
			["�ۂ̏������ʉ߂��Ă��܂��B","pzprv3/kusabi/5/5/3 1 1 . . /. . . 2 . /. . 1 2 . /. . 1 . . /. . . . 3 /0 0 0 0 /1 0 0 0 /0 0 0 0 /1 1 1 1 /0 0 0 0 /0 0 0 0 0 /1 0 0 0 0 /1 0 0 0 0 /0 0 0 0 1 /"],
			["�ۂ��R�̎��^�Ɍq�����Ă��܂���B","pzprv3/kusabi/5/5/3 1 1 . . /. . . 2 . /. . 1 2 . /. . 1 . . /. . . . 3 /0 0 0 0 /0 1 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 1 0 0 0 /0 0 1 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["�q����ۂ�����������܂���B","pzprv3/kusabi/5/5/3 1 1 . . /. . . 2 . /. . 1 2 . /. . 1 . . /. . . . 3 /0 0 0 0 /0 0 0 0 /1 0 0 0 /0 0 1 0 /0 0 0 1 /1 1 0 0 0 /1 1 0 0 0 /-1 -1 0 0 0 /-1 -1 0 1 0 /"],
			["����2��ȏ�Ȃ����Ă��܂��B","pzprv3/kusabi/5/5/3 1 1 . . /. . . 2 . /. . 1 2 . /. . 1 . . /. . . . 3 /0 0 0 0 /0 1 1 0 /1 0 0 0 /0 0 0 0 /0 0 0 0 /1 0 0 0 0 /1 1 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["����2��Ȃ����Ă��܂���B","pzprv3/kusabi/5/5/3 1 1 . . /. . . 2 . /. . 1 2 . /. . 1 . . /. . . . 3 /0 0 0 0 /0 0 1 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 0 1 0 0 /-1 -1 0 0 0 /-1 -1 0 0 0 /"],
			["���̒����������ł͂���܂���B","pzprv3/kusabi/5/5/3 1 1 . . /. . . 2 . /. . 1 2 . /. . 1 . . /. . . . 3 /0 0 0 0 /0 0 0 0 /0 0 0 1 /0 0 1 1 /0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 1 /0 0 0 0 0 /"],
			["���̒��Z�̎w���ɔ����Ă܂��B","pzprv3/kusabi/5/5/3 1 1 . . /. . . 2 . /. . 1 2 . /. . 1 . . /. . . . 3 /0 0 0 0 /1 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /1 1 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["���̒��Z�̎w���ɔ����Ă܂��B","pzprv3/kusabi/5/5/3 1 1 . . /. . . 2 . /. . 1 2 . /. . 1 . . /. . . . 3 /0 0 0 0 /0 1 1 0 /0 1 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 1 0 0 0 /-1 -1 0 0 0 /-1 -1 0 0 0 /"],
			["�r�؂�Ă����������܂��B","pzprv3/kusabi/5/5/3 1 1 . . /. . . 2 . /. . 1 2 . /. . 1 . . /. . . . 3 /0 0 0 0 /0 1 0 0 /0 0 0 0 /0 0 0 0 /1 1 1 0 /1 1 1 0 0 /1 0 0 0 0 /1 -1 0 0 0 /1 -1 0 1 0 /"],
			["�ۂɂȂ����Ă��Ȃ���������܂��B","pzprv3/kusabi/5/5/3 1 1 . . /. . . 2 . /. . 1 2 . /. . 1 . . /. . . . 3 /0 0 0 1 /0 1 0 0 /-1 1 0 0 /-1 1 0 0 /1 1 1 0 /1 1 1 0 1 /1 -1 0 0 1 /1 1 0 1 1 /1 -1 0 1 0 /"],
			["�ǂ��ɂ��Ȃ����Ă��Ȃ��ۂ�����܂��B","pzprv3/kusabi/5/5/3 1 1 . . /. . . 2 . /. . 1 2 . /. . 1 . . /. . . . 3 /0 0 0 0 /0 1 0 0 /-1 1 0 0 /-1 1 0 0 /1 1 1 0 /1 1 1 0 0 /1 -1 0 0 0 /1 1 0 1 0 /1 -1 0 1 0 /"],
			["","pzprv3/kusabi/5/5/3 1 1 . . /. . . 2 . /. . 1 2 . /. . 1 . . /. . . . 3 /0 0 0 1 /0 1 0 0 /-1 1 0 0 /-1 1 0 0 /1 1 1 0 /1 1 1 1 1 /1 -1 0 0 1 /1 1 0 1 1 /1 -1 0 1 1 /"]
		],
		lightup : [
			["�����̂܂��ɂ���Ɩ��̐����Ԉ���Ă��܂��B","pzprv3/lightup/6/6/. . . . . . /. . 4 . . . /. # . . 2 . /# 0 # . . . /. # . 1 . . /. . . . . . /"],
			["�Ɩ��ɕʂ̏Ɩ��̌����������Ă��܂��B","pzprv3/lightup/6/6/. . # . . # /. # 4 # . . /. . # . 2 . /. 0 . . # . /. . . 1 . . /. . . . . . /"],
			["�����̂܂��ɂ���Ɩ��̐����Ԉ���Ă��܂��B","pzprv3/lightup/6/6/. . # . . . /. # 4 # . . /. . # . 2 # /+ 0 . . # . /. + . 1 . . /. . . . . . /"],
			["�Ɩ��ɏƂ炳��Ă��Ȃ��Z��������܂��B","pzprv3/lightup/6/6/. . # . . . /. # 4 # . . /. . # . 2 # /+ 0 . . # . /. + . 1 . . /. . . # . . /"],
			["","pzprv3/lightup/6/6/. . # . . . /. # 4 # . . /. . # . 2 # /+ 0 . . # . /# + . 1 . . /. . . # . . /"]
		],
		lits : [
			["2x2�̍��}�X�̂����܂肪����܂��B","pzprv3/lits/4/4/3/0 0 1 1 /0 0 1 2 /0 1 1 2 /2 2 2 2 /# # . . /# # . . /. . . . /. . . . /"],
			["�T�}�X�ȏ�̍��}�X�����镔�������݂��܂��B","pzprv3/lits/4/4/3/0 0 1 1 /0 0 1 2 /0 1 1 2 /2 2 2 2 /. . # # /. . # . /. # # . /. . . . /"],
			["1�̕����ɓ��鍕�}�X��2�ȏ�ɕ��􂵂Ă��܂��B","pzprv3/lits/4/4/3/0 0 1 1 /0 0 1 2 /0 1 1 2 /2 2 2 2 /. . # # /. . . . /. # # # /. . . . /"],
			["�����`�̃e�g���~�m���ڂ��Ă��܂��B","pzprv3/lits/4/4/3/0 0 1 1 /0 0 1 2 /0 1 1 2 /2 2 2 2 /# # # # /# . # . /# . # . /. . . . /"],
			["���}�X�����f����Ă��܂��B","pzprv3/lits/4/4/3/0 0 1 1 /0 0 1 2 /0 1 1 2 /2 2 2 2 /# . # # /# . # . /# . # . /. . . . /"],
			["���}�X���Ȃ�����������܂��B","pzprv3/lits/4/4/3/0 0 1 1 /0 0 1 2 /0 1 1 2 /2 2 2 2 /# . # # /# # # . /# . # . /. . . . /"],
			["���}�X�̃J�^�}�����S�}�X�����̕���������܂��B","pzprv3/lits/4/4/3/0 0 1 1 /0 0 1 2 /0 1 1 2 /2 2 2 2 /# . # # /# # # . /# . # . /. . # # /"],
			["","pzprv3/lits/4/4/3/0 0 1 1 /0 0 1 2 /0 1 1 2 /2 2 2 2 /# + # # /# # # + /# + # + /# # # # /"]
		],
		loopsp : [
			["�ŏ����������Ă����������}�X�ɐ���������Ă��܂��B","pzprv3/loopsp/5/5/. . . . . /. a . g . /1 . 1 . 2 /. d . f . /. . . . . /0 0 0 0 /0 0 1 1 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 1 0 /0 0 0 1 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["���򂵂Ă����������܂��B","pzprv3/loopsp/5/5/. . . . . /. a . g . /1 . 1 . 2 /. d . f . /. . . . . /0 0 0 0 /0 1 0 0 /0 0 0 0 /0 1 1 0 /0 0 0 0 /0 1 1 0 0 /0 1 0 0 0 /0 1 0 0 0 /0 0 0 1 0 /"],
			["���̕����Ő����������Ă��܂��B","pzprv3/loopsp/5/5/. . . . . /. a . g . /1 . 1 . 2 /. d . f . /. . . . . /0 0 0 0 /0 0 0 0 /1 1 1 0 /0 0 0 0 /0 0 0 0 /0 0 1 0 0 /0 0 1 0 0 /0 0 1 0 0 /0 0 1 0 0 /"],
			["�قȂ鐔�����܂񂾃��[�v������܂��B","pzprv3/loopsp/5/5/. . . . . /. a . g . /1 . 1 . 2 /. d . f . /. . . . . /1 1 1 1 /0 0 0 0 /1 1 0 0 /0 0 0 0 /0 0 1 1 /1 0 0 0 1 /1 0 0 0 1 /0 0 1 0 1 /0 0 1 0 1 /"],
			["�����������قȂ郋�[�v�Ɋ܂܂�Ă��܂��B","pzprv3/loopsp/5/5/. . . . . /. a . g . /1 . 1 . 2 /. d . f . /. . . . . /1 0 1 1 /0 0 0 1 /0 0 1 0 /0 1 0 0 /1 1 0 0 /1 1 1 0 1 /1 1 1 1 0 /1 1 0 0 0 /1 0 1 0 0 /"],
			["�����܂�ł��Ȃ����[�v������܂��B","pzprv3/loopsp/5/5/. . . . . /. a . g . /1 . 1 . 2 /. d . f . /. . . . . /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 1 0 /0 -1 1 -1 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 1 1 0 /"],
			["���̃}�X�������4�{�o�Ă��܂���B","pzprv3/loopsp/5/5/. . . . . /. a . g . /1 . 1 . 2 /. d . f . /. . . . . /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["����������Ă��Ȃ��}�X������܂��B","pzprv3/loopsp/5/5/. . . . . /. a . g . /1 . 1 . 2 /. d . f . /. . . . . /1 0 1 1 /1 1 0 1 /0 0 0 1 /0 1 1 0 /0 0 0 1 /1 1 1 0 1 /0 1 0 1 0 /0 1 0 0 1 /0 0 0 1 1 /"],
			["�r���œr�؂�Ă����������܂��B","pzprv3/loopsp/5/5/. . . . . /. a . g . /1 . 1 . 2 /. d . f . /. . . . . /1 -1 1 1 /1 1 -1 1 /1 1 -1 1 /0 1 1 0 /0 1 -1 1 /1 1 1 -1 1 /-1 1 -1 1 0 /1 1 1 0 1 /1 0 1 1 1 /"],
			["","pzprv3/loopsp/5/5/. . . . . /. a . g . /1 . 1 . 2 /. d . f . /. . . . . /1 -1 1 1 /1 1 -1 1 /1 1 -1 1 /0 1 1 0 /1 1 -1 1 /1 1 1 -1 1 /-1 1 -1 1 0 /1 1 1 0 1 /1 0 1 1 1 /"]
		],
		mashu : [
			["���򂵂Ă����������܂��B","pzprv3/mashu/6/6/. . 1 . . . /. 2 . . 1 . /. . . . . . /. . . 2 . . /. 1 . . . . /. . . . . . /0 0 1 1 0 /0 0 0 0 0 /1 1 1 1 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 1 0 0 0 /0 0 1 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /"],
			["�����������Ă��܂��B","pzprv3/mashu/6/6/. . 1 . . . /. 2 . . 1 . /. . . . . . /. . . 2 . . /. 1 . . . . /. . . . . . /0 0 1 1 0 /0 0 0 0 0 /1 1 1 1 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 1 0 0 0 /0 0 1 0 0 0 /0 0 1 0 0 0 /0 0 1 0 0 0 /0 0 1 0 0 0 /"],
			["���ۂ̏�Ő����Ȃ����Ă��܂��B","pzprv3/mashu/6/6/. . 1 . . . /. 2 . . 1 . /. . . . . . /. . . 2 . . /. 1 . . . . /. . . . . . /0 0 1 1 0 /0 0 0 0 0 /0 0 1 1 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 1 0 0 0 /0 0 1 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /"],
			["���ۂ̏�Ő������i���Ă��܂��B","pzprv3/mashu/6/6/. . 1 . . . /. 2 . . 1 . /. . . . . . /. . . 2 . . /. 1 . . . . /. . . . . . /0 0 0 0 0 /0 1 1 -1 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 0 /0 1 0 0 0 0 /0 1 0 1 0 0 /0 -1 0 1 0 0 /0 0 0 1 0 0 /"],
			["���ۂׂ̗Ő����Ȃ����Ă��܂��B","pzprv3/mashu/6/6/. . 1 . . . /. 2 . . 1 . /. . . . . . /. . . 2 . . /. 1 . . . . /. . . . . . /1 1 1 0 0 /0 1 1 -1 0 /0 0 0 0 0 /0 0 1 0 0 /0 0 0 0 0 /0 0 0 0 0 /1 0 0 0 0 0 /0 1 0 0 0 0 /0 1 0 1 0 0 /0 -1 1 0 0 0 /0 0 0 0 0 0 /"],
			["���ۂׂ̗Ő����Ȃ����Ă��܂���B","pzprv3/mashu/6/6/. . 1 . . . /. 2 . . 1 . /. . . . . . /. . . 2 . . /. 1 . . . . /. . . . . . /1 1 1 0 0 /0 1 1 -1 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /1 0 0 0 0 0 /0 1 0 0 0 0 /0 1 0 0 0 0 /0 -1 0 0 0 0 /0 0 0 0 0 0 /"],
			["�������ʂ��Ă��Ȃ��ۂ�����܂��B","pzprv3/mashu/6/6/. . 1 . . . /. 2 . . 1 . /. . . . . . /. . . 2 . . /. 1 . . . . /. . . . . . /1 1 1 0 0 /0 1 1 -1 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /1 0 0 1 0 0 /0 1 0 0 0 0 /0 1 0 0 0 0 /0 -1 0 0 0 0 /0 0 0 0 0 0 /"],
			["�����r���œr�؂�Ă��܂��B","pzprv3/mashu/6/6/. . 1 . . . /. 2 . . 1 . /. . . . . . /. . . 2 . . /. 1 . . . . /. . . . . . /1 1 1 0 1 /0 1 1 -1 0 /0 0 0 0 0 /0 1 0 0 0 /1 1 0 0 0 /0 0 0 0 0 /1 0 0 1 1 1 /1 1 0 0 1 1 /1 1 0 0 0 1 /1 -1 0 1 0 0 /0 0 0 1 0 0 /"],
			["�ւ�������ł͂���܂���B","pzprv3/mashu/6/6/. . 1 . . . /. 2 . . 1 . /. . . . . . /. . . 2 . . /. 1 . . . . /. . . . . . /1 1 1 0 1 /0 1 1 -1 0 /0 0 0 0 0 /0 1 1 0 0 /1 1 0 0 0 /0 0 1 0 1 /1 0 0 1 1 1 /1 1 0 0 1 1 /1 1 0 0 1 1 /1 -1 0 1 1 1 /0 0 1 1 1 1 /"],
			["","pzprv3/mashu/6/6/. . 1 . . . /. 2 . . 1 . /. . . . . . /. . . 2 . . /. 1 . . . . /. . . . . . /1 1 1 0 1 /0 1 1 -1 0 /0 0 1 1 0 /0 1 -1 1 1 /1 1 0 0 0 /0 0 1 0 0 /1 0 0 1 1 1 /1 1 0 0 1 1 /1 1 1 -1 0 1 /1 -1 0 1 0 0 /0 0 1 1 0 0 /"]
		],
		mejilink : [
			["���򂵂Ă����������܂��B","pzprv3/mejilink/4/4/1 0 1 1 1 /2 2 1 1 1 /2 0 1 1 1 /1 0 0 0 1 /1 1 1 1 /1 0 0 0 /2 0 0 1 /1 1 0 1 /1 1 1 1 /"],
			["�����������Ă��܂��B","pzprv3/mejilink/4/4/1 0 1 1 1 /1 1 1 2 1 /1 0 2 2 1 /1 0 0 0 1 /1 1 1 1 /1 0 0 0 /1 0 2 2 /2 2 0 2 /1 1 1 1 /"],
			["�^�C���Ǝ��͂̐���������Ȃ��_���̒������قȂ�܂��B","pzprv3/mejilink/4/4/2 0 1 1 1 /1 2 1 1 1 /2 0 1 1 1 /2 0 0 0 1 /2 2 1 1 /2 0 0 0 /2 0 0 1 /1 1 0 1 /2 2 2 2 /"],
			["�r���œr�؂�Ă����������܂��B","pzprv3/mejilink/4/4/2 0 1 2 2 /1 2 1 2 2 /2 0 1 2 2 /2 0 0 1 2 /2 2 2 1 /2 0 0 0 /2 0 0 1 /1 1 0 0 /2 2 2 2 /"],
			["�ւ�������ł͂���܂���B","pzprv3/mejilink/4/4/2 2 0 2 2 /2 2 0 2 2 /1 0 0 0 1 /2 1 0 1 2 /2 1 1 2 /1 0 0 1 /2 1 1 2 /2 2 2 2 /2 2 2 2 /"],
			["","pzprv3/mejilink/4/4/2 0 -1 1 2 /-1 2 -1 1 2 /2 0 -1 2 1 /2 0 0 0 2 /2 2 2 2 /2 0 0 0 /2 0 0 2 /-1 -1 0 2 /2 2 2 2 /"]
		],
		minarism : [
			["������ɓ��������������Ă��܂��B","pzprv3/minarism/4/4/b b b /0 0 0 /0 0 0 /0 0 0 /2 1 0 0 /0 0 0 0 /0 0 a 0 /4 . . 4 /. . . . /. . . . /. . . . /"],
			["�ەt�������Ƃ��̗����̐����̍�����v���Ă��܂���B","pzprv3/minarism/4/4/b b b /0 0 0 /0 0 0 /0 0 0 /2 1 0 0 /0 0 0 0 /0 0 a 0 /4 3 2 1 /1 . . . /. . . . /. . . . /"],
			["�s�����Ɛ������������Ă��܂��B","pzprv3/minarism/4/4/b b b /0 0 0 /0 0 0 /0 0 0 /2 1 0 0 /0 0 0 0 /0 0 a 0 /4 3 2 1 /2 4 . . /. . 3 . /. . 1 . /"],
			["�����̓����Ă��Ȃ��}�X������܂��B","pzprv3/minarism/4/4/b b b /0 0 0 /0 0 0 /0 0 0 /2 1 0 0 /0 0 0 0 /0 0 a 0 /4 3 2 1 /2 4 1 3 /. . 3 . /. . 4 . /"],
			["","pzprv3/minarism/4/4/b b b /0 0 0 /0 0 0 /0 0 0 /2 1 0 0 /0 0 0 0 /0 0 a 0 /4 3 2 1 /2 4 1 3 /1 2 3 4 /3 1 4 2 /"]
		],
		mochikoro : [
			["2x2�̍��}�X�̂����܂肪����܂��B","pzprv3/mochikoro/5/5/4 . . . . /. . . . . /. 2 . . . /. . . . . /1 . . . 1 /. . . # # /. . . # # /. . . . . /. . . . . /. . . . . /"],
			["�Ǘ��������}�X�̃u���b�N������܂��B","pzprv3/mochikoro/5/5/4 . . . . /. . . . . /. 2 . . . /. . . . . /1 . . . 1 /+ + + + # /# # # # # /. . . . . /. . . . . /. . . . . /"],
			["�l�p�`�łȂ����}�X�̃u���b�N������܂��B","pzprv3/mochikoro/5/5/4 . . . . /. . . . . /. 2 . . . /. . . . . /1 . . . 1 /+ + + + # /# # # # + /. . # + + /. . . # # /. . . . . /"],
			["1�̃u���b�N��2�ȏ�̐����������Ă��܂��B","pzprv3/mochikoro/5/5/4 . . . . /. . . . . /. 2 . . . /. . . . . /1 . . . 1 /+ + # + . /. . # . + /. . # . + /# # . # # /. . # . . /"],
			["�����ƃu���b�N�̖ʐς��Ⴂ�܂��B","pzprv3/mochikoro/5/5/4 . . . . /. . . . . /. 2 . . . /. . . . . /1 . . . 1 /+ + + + # /# # # # + /# + + # + /+ # # + # /+ # + # + /"],
			["","pzprv3/mochikoro/5/5/4 . . . . /. . . . . /. 2 . . . /. . . . . /1 . . . 1 /+ + + + # /# # # # + /# + # + # /# + # + # /+ # + # + /"]
		],
		mochinyoro : [
			["2x2�̍��}�X�̂����܂肪����܂��B","pzprv3/mochinyoro/5/5/. . . . . /. 4 . 2 . /. . . . . /. 2 . . . /. . . . 1 /. . . . . /. . . . . /. . . . . /. . # # . /. . # # . /"],
			["�Ǘ��������}�X�̃u���b�N������܂��B","pzprv3/mochinyoro/5/5/. . . . . /. 4 . 2 . /. . . . . /. 2 . . . /. . . . 1 /. . # . . /. . # . . /# # # . . /. . . . . /. . . . . /"],
			["�l�p�`�łȂ����}�X�̃u���b�N������܂��B","pzprv3/mochinyoro/5/5/. . . . . /. 4 . 2 . /. . . . . /. 2 . . . /. . . . 1 /+ + # . . /+ + # . . /# # + . . /. . . . . /. . . . . /"],
			["1�̃u���b�N��2�ȏ�̐����������Ă��܂��B","pzprv3/mochinyoro/5/5/. . . . . /. 4 . 2 . /. . . . . /. 2 . . . /. . . . 1 /+ + # . # /+ + # . # /. . # # . /. . # . # /# # . # . /"],
			["�����ƃu���b�N�̖ʐς��Ⴂ�܂��B","pzprv3/mochinyoro/5/5/. . . . . /. 4 . 2 . /. . . . . /. 2 . . . /. . . . 1 /+ + # . . /+ + # + . /# # + # # /# + # + # /# # # # + /"],
			["�l�p�`�ɂȂ��Ă��鍕�}�X�̃u���b�N������܂��B","pzprv3/mochinyoro/5/5/. . . . . /. 4 . 2 . /. . . . . /. 2 . . . /. . . . 1 /+ + # + # /+ + # + # /# # + # # /# + # + # /# + # # + /"],
			["","pzprv3/mochinyoro/5/5/. . . . . /. 4 . 2 . /. . . . . /. 2 . . . /. . . . 1 /+ + # # # /+ + # + + /# # + # # /# + # + # /# + # # + /"]
		],
		nagenawa : [
			["����������Ă��܂���B","pzprv3/nagenawa/6/6/13/0 0 1 1 2 2 /0 3 3 4 4 2 /5 3 6 6 4 7 /5 8 6 6 9 7 /10 8 8 9 9 11 /10 10 12 12 11 11 /3 . 0 . 1 . /. 1 . 3 . . /1 . 4 . . . /. 2 . . . . /3 . . 2 . . /. . . . . . /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /"],
			["�����̂��镔���Ɛ����ʉ߂���}�X�̐����Ⴂ�܂��B","pzprv3/nagenawa/6/6/13/0 0 1 1 2 2 /0 3 3 4 4 2 /5 3 6 6 4 7 /5 8 6 6 9 7 /10 8 8 9 9 11 /10 10 12 12 11 11 /3 . 0 . 1 . /. 1 . 3 . . /1 . 4 . . . /. 2 . . . . /3 . . 2 . . /. . . . . . /1 0 0 0 0 /0 0 0 0 0 /1 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /1 1 0 0 0 0 /1 1 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 2 2 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /"],
			["���򂵂Ă����������܂��B","pzprv3/nagenawa/6/6/13/0 0 1 1 2 2 /0 3 3 4 4 2 /5 3 6 6 4 7 /5 8 6 6 9 7 /10 8 8 9 9 11 /10 10 12 12 11 11 /3 . 0 . 1 . /. 1 . 3 . . /1 . 4 . . . /. 2 . . . . /3 . . 2 . . /. . . . . . /1 0 0 0 0 /1 0 0 0 0 /0 0 0 0 0 /1 0 0 0 0 /1 0 0 0 0 /1 0 0 0 0 /1 1 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /1 0 0 0 0 0 /1 0 0 0 0 0 /0 0 2 2 0 0 /0 0 2 0 0 0 /2 2 0 0 0 0 /1 0 0 0 0 0 /1 0 0 0 0 0 /1 1 0 0 0 0 /"],
			["�r���œr�؂�Ă����������܂��B","pzprv3/nagenawa/6/6/13/0 0 1 1 2 2 /0 3 3 4 4 2 /5 3 6 6 4 7 /5 8 6 6 9 7 /10 8 8 9 9 11 /10 10 12 12 11 11 /3 . 0 . 1 . /. 1 . 3 . . /1 . 4 . . . /. 2 . . . . /3 . . 2 . . /. . . . . . /1 0 0 0 0 /1 0 0 1 0 /0 0 1 1 0 /1 0 0 0 0 /0 0 0 0 0 /1 0 0 0 0 /1 1 0 0 0 0 /0 0 0 1 0 0 /0 0 1 1 0 0 /1 1 0 0 0 0 /1 1 0 0 0 0 /0 0 2 2 0 0 /0 0 2 0 0 0 /2 2 0 0 0 0 /1 0 0 0 0 0 /1 0 2 0 0 0 /1 1 0 0 0 0 /"],
			["�����̂��镔���Ɛ����ʉ߂���}�X�̐����Ⴂ�܂��B","pzprv3/nagenawa/6/6/13/0 0 1 1 2 2 /0 3 3 4 4 2 /5 3 6 6 4 7 /5 8 6 6 9 7 /10 8 8 9 9 11 /10 10 12 12 11 11 /3 . 0 . 1 . /. 1 . 3 . . /1 . 4 . . . /. 2 . . . . /3 . . 2 . . /. . . . . . /1 0 0 0 0 /1 0 0 1 0 /0 0 1 1 0 /1 0 1 0 0 /0 0 0 0 0 /1 0 0 0 0 /1 1 0 0 0 0 /0 0 0 1 1 0 /0 0 1 1 0 0 /1 1 0 0 0 0 /1 1 0 0 0 0 /0 0 2 2 0 0 /0 0 2 0 0 0 /2 2 0 0 0 0 /1 0 0 0 0 0 /1 0 2 0 0 0 /1 1 0 0 0 0 /"],
			["�����`�������`�łȂ��ւ���������܂��B","pzprv3/nagenawa/6/6/13/0 0 1 1 2 2 /0 3 3 4 4 2 /5 3 6 6 4 7 /5 8 6 6 9 7 /10 8 8 9 9 11 /10 10 12 12 11 11 /3 . 0 . 1 . /. 1 . 3 . . /1 . 4 . . . /. . . . . . /3 . . 2 . . /. . . . . . /1 0 0 0 0 /1 0 0 1 1 /0 0 1 1 0 /1 0 1 1 0 /0 0 1 0 0 /1 0 1 1 1 /1 1 0 0 0 0 /0 0 0 1 0 1 /0 0 1 1 1 1 /1 1 0 1 0 1 /1 1 1 0 0 1 /0 0 2 2 0 0 /0 0 2 0 0 0 /2 2 0 0 0 0 /1 0 0 0 0 0 /1 0 2 0 0 0 /1 1 0 0 0 0 /"],
			["","pzprv3/nagenawa/6/6/13/0 0 1 1 2 2 /0 3 3 4 4 2 /5 3 6 6 4 7 /5 8 6 6 9 7 /10 8 8 9 9 11 /10 10 12 12 11 11 /3 . 0 . 1 . /. 1 . 3 . . /1 . 4 . . . /. 2 . . . . /3 . . 2 . . /. . . . . . /1 0 0 0 0 /1 0 0 1 1 /0 0 1 1 0 /1 0 1 1 0 /0 0 0 0 0 /1 0 0 1 1 /1 1 0 0 0 0 /0 0 0 1 0 1 /0 0 1 1 1 1 /1 1 0 1 0 1 /1 1 0 1 0 1 /0 0 2 2 0 0 /0 0 2 0 0 0 /2 2 0 0 0 0 /1 0 0 0 0 0 /1 0 2 0 0 0 /1 1 0 0 0 0 /"]
		],
		nanro : [
			["������2x2�̂����܂�ɂȂ��Ă��܂��B","pzprv3/nanro/4/4/5/0 0 0 1 /2 3 3 1 /2 3 3 1 /2 4 4 4 /. . . 1 /3 . . . /. . . . /. 1 . . /. . . . /. . . - /3 2 . - /3 . - - /"],
			["�������������E��������ŗׂ荇���Ă��܂��B","pzprv3/nanro/4/4/5/0 0 0 1 /2 3 3 1 /2 3 3 1 /2 4 4 4 /. . . 1 /3 . . . /. . . . /. 1 . . /. . . . /. 3 3 - /3 . 3 - /3 . - - /"],
			["������ނ̐����������Ă���u���b�N������܂��B","pzprv3/nanro/4/4/5/0 0 0 1 /2 3 3 1 /2 3 3 1 /2 4 4 4 /. . . 1 /3 . . . /. . . . /. 1 . . /. + . . /. . 1 - /3 - 2 - /3 . - - /"],
			["�����Ă��鐔���̐���������葽���ł��B","pzprv3/nanro/4/4/5/0 0 0 1 /2 3 3 1 /2 3 3 1 /2 4 4 4 /. . . 1 /3 . . . /. . . . /. 1 . . /. + . . /. . 1 - /3 - 1 - /3 . - - /"],
			["�^�e���R�ɂȂ����Ă��Ȃ�����������܂��B","pzprv3/nanro/4/4/5/0 0 0 1 /2 3 3 1 /2 3 3 1 /2 4 4 4 /. . . 1 /3 . . . /. . . . /. 1 . . /. + . . /. 1 . - /3 - . - /3 . - - /"],
			["�����Ă��鐔���̐���������菭�Ȃ��ł��B","pzprv3/nanro/4/4/5/0 0 0 1 /2 3 3 1 /2 3 3 1 /2 4 4 4 /. . . 1 /3 . . . /. . . . /. 1 . . /. 3 3 . /. 1 . - /3 - . - /3 . - - /"],
			["�������܂܂�Ă��Ȃ��u���b�N������܂��B","pzprv3/nanro/4/4/6/0 0 0 1 /2 3 4 1 /2 3 4 1 /2 5 5 5 /. . . 1 /3 . . . /. . . . /. 1 . . /. 2 2 . /. 1 . - /3 - . - /3 . - - /"],
			["","pzprv3/nanro/4/4/5/0 0 0 1 /2 3 3 1 /2 3 3 1 /2 4 4 4 /. . . 1 /3 . . . /. . . . /. 1 . . /. 2 2 . /. 1 . - /3 - + - /3 . - - /"]
		],
		nawabari : [
			["�����̌`�������`�ł͂���܂���B","pzprv3/nawabari/5/5/. . . . . /. 0 . 1 . /. . . . . /. 2 . 1 . /. . . . . /0 0 1 0 /0 0 1 0 /0 1 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 0 1 0 0 /1 1 0 0 0 /0 0 0 0 0 /"],
			["�����̓����Ă��Ȃ�����������܂��B","pzprv3/nawabari/5/5/. . . . . /. 0 . 1 . /. . . . . /. 2 . 1 . /. . . . . /0 0 1 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /1 1 1 1 1 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["1�̕�����2�ȏ�̐����������Ă��܂��B","pzprv3/nawabari/5/5/. . . . . /. 0 . 1 . /. . . . . /. 2 . 1 . /. . . . . /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["�����̎���ɂ��鋫�E���̖{�����Ⴂ�܂��B","pzprv3/nawabari/5/5/. . . . . /. 0 . 1 . /. . . . . /. 2 . 1 . /. . . . . /0 0 1 0 /0 0 1 0 /0 0 1 0 /0 0 1 0 /0 0 1 0 /0 0 0 0 0 /0 0 0 1 1 /1 1 1 0 0 /0 0 0 0 0 /"],
			["�r���œr�؂�Ă����������܂��B","pzprv3/nawabari/5/5/. . . . . /. 0 . 1 . /. . . . . /. 2 . 1 . /. . . . . /0 0 1 0 /0 0 1 0 /0 0 1 0 /0 1 0 0 /0 1 0 0 /0 0 0 0 0 /0 0 0 0 0 /1 1 1 1 1 /0 0 1 0 0 /"],
			["","pzprv3/nawabari/5/5/. . . . . /. 0 . 1 . /. . . . . /. 2 . 1 . /. . . . . /0 0 1 0 /0 0 1 0 /0 0 1 0 /0 1 0 0 /0 1 0 0 /0 0 0 0 0 /0 0 0 0 0 /1 1 1 1 1 /0 0 0 0 0 /"]
		],
		norinori : [
			["�Q�}�X���傫�����}�X�̃J�^�}��������܂��B","pzprv3/norinori/5/5/5/0 0 1 2 2 /1 1 1 2 2 /1 3 3 2 2 /3 3 3 3 3 /4 4 3 3 3 /# # . . . /. # . . . /. . . . . /. . . . . /. . . . . /"],
			["�Q�}�X�ȏ�̍��}�X�����镔�������݂��܂��B","pzprv3/norinori/5/5/5/0 0 1 2 2 /1 1 1 2 2 /1 3 3 2 2 /3 3 3 3 3 /4 4 3 3 3 /# # + . # /+ + # # . /# . . . # /. . . . # /. . . . . /"],
			["�P�}�X�����̍��}�X�̃J�^�}��������܂��B","pzprv3/norinori/5/5/5/0 0 1 2 2 /1 1 1 2 2 /1 3 3 2 2 /3 3 3 3 3 /4 4 3 3 3 /# # + + + /+ + # # + /# . . + . /+ + . . . /# # + . . /"],
			["�P�}�X�������}�X���Ȃ�����������܂��B","pzprv3/norinori/5/5/5/0 0 1 2 2 /1 1 1 2 2 /1 3 3 2 2 /3 3 3 3 3 /4 4 3 3 3 /# # + + + /+ + # # + /# # + + . /+ + . . . /# # + . . /"],
			["���}�X���Ȃ�����������܂��B","pzprv3/norinori/5/5/5/0 0 1 2 2 /1 1 1 2 2 /1 3 3 2 2 /3 3 3 3 3 /4 4 3 3 3 /# # + + + /+ + + + + /+ + + + . /+ + . . . /# # + . . /"],
			["","pzprv3/norinori/5/5/5/0 0 1 2 2 /1 1 1 2 2 /1 3 3 2 2 /3 3 3 3 3 /4 4 3 3 3 /# # + + + /+ + # # + /# # + + # /+ + . . # /# # + . . /"]
		],
		numlin : [
			["���򂵂Ă����������܂��B","pzprv3/numlin/5/5/1 . . . . /2 . . 3 . /. . . . . /. 1 . . 2 /. . . . 3 /0 0 0 0 /1 1 1 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 1 0 0 0 /0 1 0 0 0 /0 0 0 0 0 /"],
			["�����������Ă��܂��B","pzprv3/numlin/5/5/1 . . . . /2 . . 3 . /. . . . . /. 1 . . 2 /. . . . 3 /1 0 0 0 /1 1 1 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 1 0 0 0 /0 1 0 0 0 /0 1 0 0 0 /0 0 0 0 0 /"],
			["3�ȏ�̐������Ȃ����Ă��܂��B","pzprv3/numlin/5/5/1 . . . . /2 . . 3 . /. . . . . /. 1 . . 2 /. . . . 3 /1 1 1 1 /1 1 1 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /1 0 0 0 1 /0 0 0 0 1 /0 0 0 0 1 /0 0 0 0 1 /"],
			["�قȂ鐔�����Ȃ����Ă��܂��B","pzprv3/numlin/5/5/1 . . . . /2 . . 3 . /. . . . . /. 1 . . 2 /. . . . 3 /1 1 0 0 /0 0 0 0 /0 0 0 0 /0 0 1 1 /0 0 0 0 /0 0 1 0 0 /0 0 1 0 0 /0 0 1 0 0 /0 0 0 0 0 /"],
			["�����̏������ʉ߂��Ă��܂��B","pzprv3/numlin/5/5/1 . . . . /2 . . 3 . /. . . . . /. 1 . . 2 /. . . . 3 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 1 1 /0 0 0 0 /0 0 1 0 1 /0 0 1 0 1 /0 0 1 0 1 /0 0 0 0 0 /"],
			["�r�؂�Ă����������܂��B","pzprv3/numlin/5/5/1 . . . . /2 . . 3 . /. . . . . /. 1 . . 2 /. . . . 3 /1 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 1 /0 1 0 0 0 /0 1 0 1 0 /0 0 0 1 0 /0 0 0 1 0 /"],
			["�����ɂȂ����Ă��Ȃ���������܂��B","pzprv3/numlin/5/5/1 . . . . /2 . . 3 . /. . . . . /. 1 . . 2 /. . . . 3 /1 0 0 0 /0 0 0 0 /0 0 1 0 /0 0 0 0 /0 0 1 0 /0 1 0 0 0 /0 1 0 0 0 /0 1 1 1 0 /0 0 1 1 0 /"],
			["�ǂ��ɂ��Ȃ����Ă��Ȃ�����������܂��B","pzprv3/numlin/5/5/1 . . . . /2 . . 3 . /. . . . . /. 1 . . 2 /. . . . 3 /1 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 1 /0 1 0 0 0 /0 1 0 1 0 /0 1 0 1 0 /0 0 0 1 0 /"],
			["","pzprv3/numlin/5/5/1 . . . . /2 . . 3 . /. . . . . /. 1 . . 2 /. . . . 3 /1 -1 1 1 /0 -1 0 0 /0 -1 -1 0 /0 -1 -1 0 /1 1 -1 1 /0 1 1 0 1 /1 1 1 1 1 /1 1 1 1 1 /1 0 1 1 0 /"]
		],
		nuribou : [
			["�u���P�}�X�A�����P�}�X�ȏ�v�ł͂Ȃ����}�X�̃J�^�}��������܂��B","pzprv3/nuribou/5/5/1 . 2 . . /. . . . 1 /. 4 . . . /. . . . . /. . . . 7 /. . . . . /# # # . . /. . # . . /. . # . . /. . . . . /"],
			["�����ʐς̍��}�X�̃J�^�}�����A�p�����L���Ă��܂��B","pzprv3/nuribou/5/5/1 . 2 . . /. . . . 1 /. 4 . . . /. . . . . /. . . . 7 /+ # + + # /# + # # + /. . + + # /. . . . . /. . . . . /"],
			["�����̓����Ă��Ȃ��V�}������܂��B","pzprv3/nuribou/5/5/1 . 2 . . /. . . . 1 /. 4 . . . /. . . . . /. . . . 7 /+ # + + # /# + # # + /# + + + # /. # . . . /. . # # . /"],
			["1�̃V�}��2�ȏ�̐����������Ă��܂��B","pzprv3/nuribou/5/5/1 . 2 . . /. . . . 1 /. 4 . . . /. . . . . /. . . . 7 /+ # + + # /# + # # + /# + + + # /. . . . . /. . . . . /"],
			["�����ƃV�}�̖ʐς��Ⴂ�܂��B","pzprv3/nuribou/5/5/1 . 2 . . /. . . . 1 /. 4 . . . /. . . . . /. . . . 7 /+ # + # . /+ # + # + /# + # . # /. . # . . /. . # . . /"],
			["","pzprv3/nuribou/5/5/1 . 2 . . /. . . . 1 /. 4 . . . /. . . . . /. . . . 7 /+ # + + # /# + # # + /# + + + # /+ # # # . /. . . . . /"]
		],
		nurikabe : [
			["2x2�̍��}�X�̂����܂肪����܂��B","pzprv3/nurikabe/5/5/. 5 . . . /. . 2 . . /# # . . . /# # 1 . . /. . . 3 . /"],
			["�����̓����Ă��Ȃ��V�}������܂��B","pzprv3/nurikabe/5/5/. 5 # # . /. # 2 . # /. # # # # /. # 1 . . /# . . 3 . /"],
			["���}�X�����f����Ă��܂��B","pzprv3/nurikabe/5/5/. 5 # # # /. # 2 . # /. . # # # /. . 1 . . /# . . 3 . /"],
			["1�̃V�}��2�ȏ�̐����������Ă��܂��B","pzprv3/nurikabe/5/5/. 5 # # # /. # 2 . # /. # # # # /. . 1 . . /. . . 3 . /"],
			["�����ƃV�}�̖ʐς��Ⴂ�܂��B","pzprv3/nurikabe/5/5/. 5 # # # /. # 2 . # /. # # # # /. # 1 # . /. # # 3 . /"],
			["","pzprv3/nurikabe/5/5/+ 5 # # # /+ # 2 + # /+ # # # # /+ # 1 # . /# # # 3 . /"]
		],
		paintarea : [
			["���}�X�ƍ��}�X�̍��݂����^�C��������܂��B","pzprv3/paintarea/5/5/12/0 1 2 2 2 /0 3 2 2 4 /5 6 6 7 4 /5 8 9 10 4 /8 8 9 11 11 /. . . . . /. 4 . . . /. . . . . /. . . 1 . /. . . . . /. . + + + /. . # # . /. . . . . /. . . . . /. . . . . /"],
			["���}�X���ЂƂȂ���ɂȂ��Ă��܂���B","pzprv3/paintarea/5/5/13/0 1 2 2 2 /0 3 4 4 5 /6 7 7 8 5 /6 9 10 11 5 /9 9 10 12 12 /. . . . . /. 4 . . . /. . . . . /. . . 1 . /. . . . . /# # + + + /# + # # . /. # # . . /. . . . . /. . . . . /"],
			["2x2�̍��}�X�̂����܂肪����܂��B","pzprv3/paintarea/5/5/13/0 1 2 2 2 /0 3 4 4 5 /6 7 7 8 5 /6 9 10 11 5 /9 9 10 12 12 /. . . . . /. 4 . . . /. . . . . /. . . 1 . /. . . . . /# # + + + /# + # # . /# # # . . /# # . . . /# # . . . /"],
			["�����̏㉺���E�ɂ��鍕�}�X�̐����Ԉ���Ă��܂��B","pzprv3/paintarea/5/5/13/0 1 2 2 2 /0 3 4 4 5 /6 7 7 8 5 /6 9 10 11 5 /9 9 10 12 12 /. . . . . /. 4 . . . /. . . . . /. . . 1 . /. . . . . /# # + + + /# + # # . /# # # . . /# + + . . /+ + + . . /"],
			["2x2�̔��}�X�̂����܂肪����܂��B","pzprv3/paintarea/5/5/13/0 1 2 2 2 /0 3 4 4 5 /6 7 7 8 5 /6 9 10 11 5 /9 9 10 12 12 /. . . . . /. 4 . . . /. . . . . /. . . 1 . /. . . . . /# # + + + /# + # # # /# # # . # /# + + . # /+ + + . . /"],
			["","pzprv3/paintarea/5/5/13/0 1 2 2 2 /0 3 4 4 5 /6 7 7 8 5 /6 9 10 11 5 /9 9 10 12 12 /. . . . . /. 4 . . . /. . . . . /. . . 1 . /. . . . . /# # + + + /# + # # + /# # # + + /# + # # + /+ + # + + /"]
		],
		pipelink : [
			["�ŏ����������Ă����������}�X�ɐ���������Ă��܂��B","pzprv3/pipelink/5/5/circle/. . . . . /. a . . . /. . . e . /. . a . . /. . . . . /0 0 0 0 /0 0 0 0 /0 0 0 1 /0 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 0 0 1 0 /0 0 0 1 0 /0 0 0 0 0 /"],
			["���򂵂Ă����������܂��B","pzprv3/pipelink/5/5/circle/. . . . . /. a . . . /. . . e . /. . a . . /. . . . . /0 0 0 0 /0 0 0 0 /0 0 1 0 /0 0 1 1 /0 0 0 0 /0 0 0 0 0 /0 0 0 1 0 /0 0 1 0 0 /0 0 1 0 0 /"],
			["���̕����ȊO�Ő����������Ă��܂��B","pzprv3/pipelink/5/5/circle/. . . . . /. a . . . /. o . e . /. . a . . /. . . . . /0 0 0 0 /0 0 0 0 /1 1 1 0 /0 0 1 1 /0 0 0 0 /0 0 0 0 0 /0 1 1 1 0 /0 1 1 0 0 /0 0 0 0 0 /"],
			["�ւ�������ł͂���܂���B","pzprv3/pipelink/5/5/circle/. . . . . /. a . . . /. . . e . /. . a . . /. . . . . /1 0 0 0 /1 1 0 0 /0 0 0 0 /0 1 1 0 /0 0 1 0 /1 1 0 0 0 /0 1 0 0 0 /0 0 1 0 0 /0 0 1 1 0 /"],
			["���̃}�X�������4�{�o�Ă��܂���B","pzprv3/pipelink/5/5/circle/. . . . . /. a . . . /. . . e . /. . a . . /. . . . . /1 0 1 1 /1 1 1 0 /1 1 1 0 /0 0 1 0 /1 1 1 0 /1 1 1 0 1 /0 1 1 1 1 /1 1 1 0 1 /1 0 0 1 0 /"],
			["���򂵂Ă����������܂��B","pzprv3/pipelink/5/5/circle/. . . . . /. a . . . /. . . e . /. . a . . /. . . . . /1 0 1 1 /1 1 1 0 /1 1 1 0 /0 1 1 0 /1 1 0 1 /1 1 1 0 1 /0 0 1 1 1 /1 0 1 0 1 /1 0 1 1 1 /"],
			["����������Ă��Ȃ��}�X������܂��B","pzprv3/pipelink/5/5/circle/. . . . . /. a . . . /. . . e . /. . a . . /. . . . . /1 0 1 1 /1 1 1 0 /1 1 1 0 /0 1 1 1 /1 1 0 0 /1 1 1 0 1 /0 1 1 1 1 /1 1 1 0 1 /1 0 1 0 0 /"],
			["�r���œr�؂�Ă����������܂��B","pzprv3/pipelink/5/5/circle/. . . . . /. a . . . /. . . e . /. . a . . /. . . . . /1 0 1 1 /1 1 1 0 /1 1 1 0 /0 1 1 0 /1 1 0 0 /1 1 1 0 1 /0 1 1 1 1 /1 1 1 0 1 /1 0 1 1 1 /"],
			["","pzprv3/pipelink/5/5/circle/. . . . . /. a . . . /. . . e . /. . a . . /. . . . . /1 -1 1 1 /1 1 1 -1 /1 1 1 -1 /-1 1 1 0 /1 1 0 1 /1 1 1 -1 1 /-1 1 1 1 1 /1 1 1 -1 1 /1 -1 1 1 1 /"]
		],
		reflect : [
			["���򂵂Ă����������܂��B","pzprv3/reflect/5/5/49 . . . . /. . . . . /. . . 2 . /. . + . . /. . . . 24 /0 0 0 0 /0 0 0 0 /0 1 1 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 0 0 1 0 /0 0 1 0 0 /0 0 1 0 0 /"],
			["�\���ȊO�̏ꏊ�Ő����������Ă��܂��B","pzprv3/reflect/5/5/49 . . . . /. . . . . /. . . 2 . /. . + . . /. . . . 24 /0 0 0 0 /0 0 0 0 /0 1 1 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 0 1 1 0 /0 0 1 0 0 /0 0 1 0 0 /"],
			["�O�p�`�̐����Ƃ������牄�т���̒�������v���Ă��܂���B","pzprv3/reflect/5/5/49 . . . . /. . . . . /. . . 2 . /. . + . . /. . . . 24 /0 0 0 0 /0 0 0 0 /0 0 1 0 /0 0 0 0 /0 0 1 1 /0 0 0 0 0 /0 0 0 1 0 /0 0 1 0 1 /0 0 1 0 1 /"],
			["�����O�p�`��ʉ߂��Ă��܂���B","pzprv3/reflect/5/5/49 . . . . /. . . . . /. . . 2 . /. . + . . /. . . . 24 /1 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /1 0 1 1 /1 0 0 0 0 /1 0 0 0 0 /1 0 1 0 0 /1 0 1 0 1 /"],
			["�O�p�`�̐����Ƃ������牄�т���̒�������v���Ă��܂���B","pzprv3/reflect/5/5/49 . . . . /. . . . . /. . . 2 . /. . + . . /. . . . 24 /1 0 0 0 /0 0 0 0 /0 0 1 0 /0 0 0 0 /1 0 1 1 /1 0 0 0 0 /1 0 0 1 0 /1 0 1 0 0 /1 0 1 0 1 /"],
			["�\���̏ꏊ�Ő����������Ă��܂���B","pzprv3/reflect/5/5/49 . . . . /. . . . . /. . . 2 . /. . + . . /. . . . 24 /1 1 1 1 /0 0 0 0 /0 0 1 0 /0 0 0 0 /1 0 1 1 /1 0 0 0 1 /1 0 0 1 0 /1 0 1 0 0 /1 0 1 0 1 /"],
			["�����r���œr�؂�Ă��܂��B","pzprv3/reflect/5/5/49 . . . . /. . . . . /. . . 2 . /. . . . . /. . . . 2-2 /1 1 1 1 /0 1 1 0 /0 1 1 0 /0 0 1 1 /1 0 1 1 /1 0 0 0 1 /1 1 0 1 0 /1 0 0 0 0 /1 0 1 0 1 /"],
			["�ւ�������ł͂���܂���B","pzprv3/reflect/5/5/49 . . . . /. . . . . /. . . 2 . /. . . . . /. . . . 2-2 /1 1 1 1 /0 1 1 0 /0 1 1 0 /0 0 0 0 /1 1 1 1 /1 0 0 0 1 /1 1 0 1 1 /1 0 0 0 1 /1 0 0 0 1 /"],
			["","pzprv3/reflect/5/5/49 . . . . /. . . . . /. . . 2 . /. . + . . /. . . . 24 /1 1 1 1 /0 0 -1 1 /0 -1 1 0 /-1 1 1 1 /1 0 1 1 /1 0 0 -1 1 /1 0 -1 1 0 /1 -1 1 0 0 /1 1 1 0 1 /"]
		],
		ripple : [
			["1�̕����ɓ������������������Ă��܂��B","pzprv3/ripple/4/4/0 1 0 /0 1 1 /0 1 1 /1 0 1 /1 1 0 1 /1 1 0 0 /1 0 1 0 /. . . . /. 1 4 . /. 3 2 . /. . . . /. . . . /. . . . /. . . . /. . 3 . /"],
			["�����������̊Ԋu���Z���Ƃ��낪����܂��B","pzprv3/ripple/4/4/0 1 0 /0 1 1 /0 1 1 /1 0 1 /1 1 0 1 /1 1 0 0 /1 0 1 0 /. . . . /. 1 4 . /. 3 2 . /. . . . /1 2 . . /2 . . . /4 . . 3 /1 2 1 . /"],
			["�����̓����Ă��Ȃ��}�X������܂��B","pzprv3/ripple/4/4/0 1 0 /0 1 1 /0 1 1 /1 0 1 /1 1 0 1 /1 1 0 0 /1 0 1 0 /. . . . /. 1 4 . /. 3 2 . /. . . . /1 2 . . /2 . . . /4 . . . /1 2 1 . /"],
			["","pzprv3/ripple/4/4/0 1 0 /0 1 1 /0 1 1 /1 0 1 /1 1 0 1 /1 1 0 0 /1 0 1 0 /. . . . /. 1 4 . /. 3 2 . /. . . . /1 2 3 1 /2 . . 2 /4 . . 1 /1 2 1 3 /"]
		],
		shakashaka : [
			["�����̂܂��ɂ��鍕���O�p�`�̐����Ԉ���Ă��܂��B","pzprv3/shakashaka/6/6/2 . . . 1 . /. . . 3 . . /. . 4 . . . /3 . . . . . /. . . . . . /. . . 1 . . /. 5 4 . . . /5 . 3 . . . /2 3 . . . . /. . . . . . /. . . . . . /. 2 3 . 2 3 /"],
			["���}�X�������`(�����`)�ł͂���܂���B","pzprv3/shakashaka/6/6/2 . . . 1 . /. . . 3 . . /. . 4 . . . /3 . . . . . /. . . . . . /. . . 1 . . /. 5 4 . . . /5 . 3 . . . /2 3 . . . . /. . . . . . /. . . . . . /. . . . 2 3 /"],
			["���}�X�������`(�����`)�ł͂���܂���B","pzprv3/shakashaka/6/6/2 . . . 1 . /. . . 3 . 5 /. . 4 . . . /3 . . . . . /. . . . . . /. . . 5 . . /. 5 4 . . . /5 . 3 . . . /2 3 . . 5 4 /. 5 4 5 . 3 /5 . 3 2 . 4 /2 3 . . 2 3 /"],
			["���}�X�������`(�����`)�ł͂���܂���B","pzprv3/shakashaka/6/6/2 . . . 1 . /. . . 3 . . /. . 4 . . . /3 . . . . . /. . . . . . /. . . 1 . . /. 5 4 . . . /5 . 3 . 5 4 /2 3 . 5 5 3 /. 5 4 2 3 . /5 . 3 . 5 4 /2 3 . . 2 3 /"],
			["�����̂܂��ɂ��鍕���O�p�`�̐����Ԉ���Ă��܂��B","pzprv3/shakashaka/6/6/2 . . . 1 . /. . . 3 . . /. . 4 . . . /3 . . . . . /. . . . . . /. . . 1 . . /. 5 4 . . . /5 . 3 . . . /2 3 . . 5 4 /. 5 4 5 . 3 /5 . 3 2 . 4 /2 3 . . 2 3 /"],
			["","pzprv3/shakashaka/6/6/2 . . . 1 . /. . . 3 . . /. . 4 . . . /3 . . . . . /. . . . . . /. . . 1 . . /. 5 4 + . + /5 . 3 . 5 4 /2 3 . 5 . 3 /. 5 4 2 3 . /5 . 3 + 5 4 /2 3 + . 2 3 /"]
		],
		shikaku : [
			["�����̓����Ă��Ȃ��̈悪����܂��B","pzprv3/shikaku/6/6/. . . . 3 . /5 6 . . 6 . /. . . . . . /. . . . . . /. 6 . . 2 3 /. 5 . . . . /0 0 0 0 0 /0 1 0 1 0 /0 1 0 1 0 /0 1 0 1 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 1 1 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 1 1 0 0 /0 0 0 0 0 0 /"],
			["1�̗̈��2�ȏ�̐����������Ă��܂��B","pzprv3/shikaku/6/6/. . . . 3 . /5 6 . . 6 . /. . . . . . /. . . . . . /. 6 . . 2 3 /. 5 . . . . /0 0 0 0 0 /1 0 0 0 0 /1 0 0 0 0 /1 0 0 0 0 /1 0 0 0 0 /0 -1 -1 -1 0 /0 0 0 0 0 0 /-1 0 0 0 0 0 /-1 0 0 0 0 0 /-1 0 0 0 0 0 /0 1 1 1 1 0 /"],
			["�l�p�`�ł͂Ȃ��̈悪����܂��B","pzprv3/shikaku/6/6/. . . . 3 . /5 6 . . 6 . /. . . . . . /. . . . . . /. 6 . . 2 3 /. 5 . . . . /0 1 1 0 0 /1 0 1 0 0 /1 0 1 0 0 /1 -1 1 0 1 /1 -1 1 0 1 /0 -1 -1 -1 1 /0 1 0 1 1 1 /-1 0 0 0 0 0 /-1 1 1 1 1 1 /-1 -1 -1 0 0 0 /1 1 1 1 1 0 /"],
			["�����Ɨ̈�̑傫�����Ⴂ�܂��B","pzprv3/shikaku/6/6/. . . . 3 . /5 6 . . 6 . /. . . . . . /. . . . . . /. 6 . . 2 3 /. 5 . . . . /1 0 1 0 0 /1 0 1 0 0 /1 0 1 0 0 /1 -1 1 0 1 /1 -1 1 0 1 /0 -1 -1 -1 1 /0 0 0 1 1 1 /-1 1 1 0 0 0 /-1 0 0 1 1 1 /-1 -1 -1 0 0 0 /1 1 1 1 1 0 /"],
			["�r�؂�Ă����������܂��B","pzprv3/shikaku/6/6/. . . . 3 . /5 6 . . 6 . /. . . . . . /. . . . . . /. 6 . . 2 3 /. 5 . . . . /1 0 1 0 0 /1 0 1 0 0 /1 0 1 0 0 /1 -1 0 1 1 /1 -1 1 1 1 /0 -1 -1 -1 1 /0 0 0 1 1 1 /-1 0 0 0 0 0 /-1 1 1 1 1 1 /-1 -1 -1 0 0 0 /1 1 1 1 1 0 /"],
			["","pzprv3/shikaku/6/6/. . . . 3 . /5 6 . . 6 . /. . . . . . /. . . . . . /. 6 . . 2 3 /. 5 . . . . /1 -1 1 0 0 /1 0 1 0 0 /1 -1 1 0 0 /1 -1 0 1 1 /1 -1 0 1 1 /0 -1 -1 -1 1 /0 -1 -1 1 1 1 /-1 -1 -1 0 0 0 /-1 1 1 1 1 1 /-1 -1 -1 0 0 0 /1 1 1 1 1 0 /"]
		],
		shimaguni : [
			["�قȂ�C��ɂ��鍑�ǂ������ӂ����L���Ă��܂��B","pzprv3/shimaguni/6/6/8/0 0 0 1 2 3 /4 4 5 1 2 3 /4 4 5 1 2 2 /5 5 5 1 2 2 /6 6 6 6 6 6 /6 6 7 7 7 7 /3 . . . 3 . /2 . . . . . /. . . . . . /. . . . . . /4 . . . . . /. . 3 . . . /# # # . . . /# # . . . . /. . . . . . /. . . . . . /. . . . . . /. . . . . . /"],
			["1�̊C��ɓ��鍑��2�ȏ�ɕ��􂵂Ă��܂��B","pzprv3/shimaguni/6/6/8/0 0 0 1 2 3 /4 4 5 1 2 3 /4 4 5 1 2 2 /5 5 5 1 2 2 /6 6 6 6 6 6 /6 6 7 7 7 7 /3 . . . 3 . /2 . . . . . /. . . . . . /. . . . . . /4 . . . . . /. . 3 . . . /# # # + . . /+ + + . . . /# # + . . . /+ + # . . . /# # + # # # /# # . . . . /"],
			["�C����̐����ƍ��̃}�X������v���Ă��܂���B","pzprv3/shimaguni/6/6/8/0 0 0 1 2 3 /4 4 5 1 2 3 /4 4 5 1 2 2 /5 5 5 1 2 2 /6 6 6 6 6 6 /6 6 7 7 7 7 /3 . . . 3 . /2 . . . . . /. . . . . . /. . . . . . /4 . . . . . /. . 3 . . . /# # # + . . /+ + + . . . /# # + . . . /+ + # . . . /# # + + + + /# + . . . . /"],
			["�ׂ荇���C��ɂ��鍑�̑傫���������ł��B","pzprv3/shimaguni/6/6/8/0 0 0 1 2 3 /4 4 5 1 2 3 /4 4 5 1 2 2 /5 5 5 1 2 2 /6 6 6 6 6 6 /6 6 7 7 7 7 /3 . . . 3 . /2 . . . . . /. . . . . . /. . . . . . /4 . . . . . /. . 3 . . . /# # # + . . /+ + + . . . /# # + # . # /+ + # + # # /# # + + + + /# # + # # # /"],
			["���}�X�̃J�^�}�����Ȃ��C�悪����܂��B","pzprv3/shimaguni/6/6/8/0 0 0 1 2 3 /4 4 5 1 2 3 /4 4 5 1 2 2 /5 5 5 1 2 2 /6 6 6 6 6 6 /6 6 7 7 7 7 /3 . . . 3 . /2 . . . . . /. . . . . . /. . . . . . /4 . . . . . /. . 3 . . . /# # # + . . /+ + + # . . /# # + # . # /+ + # + # # /# # + + + + /# # + # # # /"],
			["","pzprv3/shimaguni/6/6/8/0 0 0 1 2 3 /4 4 5 1 2 3 /4 4 5 1 2 2 /5 5 5 1 2 2 /6 6 6 6 6 6 /6 6 7 7 7 7 /3 . . . 3 . /2 . . . . . /. . . . . . /. . . . . . /4 . . . . . /. . 3 . . . /# # # + . # /+ + + # + + /# # + # + # /+ + # + # # /# # + + + + /# # + # # # /"]
		],
		shugaku : [
			["�k���ɂȂ��Ă���z�c������܂��B","pzprv3/shugaku/5/5/. . . . . /. . 5 . . /. . . . . /c 4 . 2 . /g . . . . /"],
			["2x2�̍��}�X�̂����܂肪����܂��B","pzprv3/shugaku/5/5/. . . . . /. . 5 # # /. a . # # /a 4 a 2 . /j d . . . /"],
			["���̂܂��ɂ��閍�̐����Ԉ���Ă��܂��B","pzprv3/shugaku/5/5/. - - - . /. - 5 - # /. a - # # /a 4 a 2 a /j d . a . /"],
			["�z�c��2�}�X�ɂȂ��Ă��܂���B","pzprv3/shugaku/5/5/. . . . . /. . 5 . . /h a . . . /b 4 a 2 . /j d . . . /"],
			["�ʘH�ɐڂ��Ă��Ȃ��z�c������܂��B","pzprv3/shugaku/5/5/. . . . . /. h 5 . . /h b h . . /b 4 b 2 . /j d # # # /"],
			["���}�X�����f����Ă��܂��B","pzprv3/shugaku/5/5/# # # # . /# h 5 . . /h b h . . /b 4 b 2 . /j d # # # /"],
			["���̂܂��ɂ��閍�̐����Ԉ���Ă��܂��B","pzprv3/shugaku/5/5/# # # # . /# h 5 # . /h b h # # /b 4 b 2 # /j d # # # /"],
			["�z�c�ł����}�X�ł��Ȃ��}�X������܂��B","pzprv3/shugaku/5/5/# # # # # /# h . h # /h b h b # /b 4 b 2 # /j d # # # /"],
			["","pzprv3/shugaku/5/5/# # # # # /# h 5 h # /h b h b # /b 4 b 2 # /j d # # # /"]
		],
		shwolf : [
			["���򂵂Ă����������܂��B","pzprv3/shwolf/5/5/1 . 2 2 2 /. 1 1 . 1 /. 2 . 2 . /1 . 1 2 . /1 1 2 . 1 /. . . . . . /. 1 . . 1 . /. . . . . . /. . . . . . /. 1 . . 1 . /. . . . . . /0 0 0 0 /1 0 0 0 /1 0 0 0 /1 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /1 1 1 1 0 /"],
			["�������_��Ō������Ă��܂��B","pzprv3/shwolf/5/5/1 . 2 2 2 /. 1 1 . 1 /. 2 . 2 . /1 . 1 2 . /1 1 2 . 1 /. . . . . . /. 1 . . 1 . /. . . . . . /. . . . . . /. 1 . . 1 . /. . . . . . /0 0 0 0 /1 0 0 0 /1 0 0 0 /1 0 0 0 /1 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /1 1 1 1 0 /"],
			["�������_�ȊO�ŋȂ����Ă��܂��B","pzprv3/shwolf/5/5/1 . 2 2 2 /. 1 1 . 1 /. 2 . 2 . /1 . 1 2 . /1 1 2 . 1 /. . . . . . /. 1 . . 1 . /. . . . . . /. . . . . . /. 1 . . 1 . /. . . . . . /0 0 0 0 /1 0 0 0 /1 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 1 1 1 1 /0 0 0 0 0 /"],
			["�O�g�ɂȂ����Ă��Ȃ���������܂��B","pzprv3/shwolf/5/5/1 . 2 2 2 /. 1 1 . 1 /. 2 . 2 . /1 . 1 2 . /1 1 2 . 1 /. . . . . . /. 1 . . 1 . /. . . . . . /. . . . . . /. 1 . . 1 . /. . . . . . /0 0 0 0 /1 0 0 0 /1 0 0 0 /1 0 0 0 /0 0 0 0 /0 1 1 1 0 /0 0 0 0 0 /0 0 0 0 0 /0 1 1 1 0 /"],
			["���M���I�I�J�~�����Ȃ��̈悪����܂��B","pzprv3/shwolf/5/5/1 . 2 2 2 /. 1 1 . 1 /. 2 . 2 . /1 . 1 2 . /1 1 2 . 1 /. . . . . . /. 1 . . 1 . /. . . . . . /. . . . . . /. 1 . . 1 . /. . . . . . /0 0 1 0 /1 0 1 1 /1 0 1 1 /1 0 1 1 /1 0 1 1 /0 1 1 1 0 /1 1 1 1 1 /0 0 0 0 0 /0 0 0 0 0 /"],
			["���M�ƃI�I�J�~����������̈悪����܂��B","pzprv3/shwolf/5/5/1 . 2 2 2 /. 1 1 . 1 /. 2 . 2 . /1 . 1 2 . /1 1 2 . 1 /. . . . . . /. 1 . . 1 . /. . . . . . /. . . . . . /. 1 . . 1 . /. . . . . . /0 0 1 0 /1 0 1 0 /1 0 1 0 /1 0 1 0 /1 0 1 1 /0 1 1 1 0 /1 1 1 1 1 /0 0 0 0 0 /0 0 0 0 0 /"],
			["�r���œr�؂�Ă����������܂��B","pzprv3/shwolf/5/5/1 . 2 2 2 /. 1 1 . 1 /. . . 2 . /1 . 1 2 . /1 1 2 . 1 /. . . . . . /. 1 . . 1 . /. . . . . . /. . . . . . /. 1 . . 1 . /. . . . . . /0 1 1 0 /0 1 1 0 /0 1 1 0 /0 1 1 0 /0 1 1 0 /0 1 1 1 1 /1 1 1 1 1 /0 0 0 0 0 /0 1 1 1 1 /"],
			["","pzprv3/shwolf/5/5/1 . 2 2 2 /. 1 1 . 1 /. 2 . 2 . /1 . 1 2 . /1 1 2 . 1 /. . . . . . /. 1 . . 1 . /. . . . . . /. . . . . . /. 1 . . 1 . /. . . . . . /0 1 1 0 /1 1 1 0 /1 1 1 -1 /1 1 1 -1 /-1 1 1 -1 /0 1 1 1 1 /1 1 1 1 1 /-1 0 -1 -1 -1 /-1 1 1 1 1 /"]
		],
		slalom : [
			["���}�X�ɐ����ʂ��Ă��܂��B","pzprv3/slalom/6/6/. . . . . . /w # . # w4 # /w # . # w # /. . . . . . /. # # w1 # . /. . . o . . /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 1 0 0 0 0 /0 1 0 0 0 0 /"],
			["�������Ă����������܂��B","pzprv3/slalom/6/6/. . . . . . /w # . # w4 # /w # . . w # /. . . . . . /. # # w1 # . /. . . o . . /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 1 1 1 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 1 0 0 /0 0 0 1 0 0 /0 0 0 1 0 0 /"],
			["���򂵂Ă����������܂��B","pzprv3/slalom/6/6/. . . . . . /w # . # w4 # /w # . . w # /. . . . . . /. # # w1 # . /. . . o . . /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 1 1 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 1 0 0 /0 0 0 1 0 0 /0 0 0 1 0 0 /"],
			["�����Q��ȏ�ʉ߂��Ă�����傪����܂��B","pzprv3/slalom/6/6/. . . . . . /w # . # w4 # /w w w # w # /. . . . . . /. # # w1 # . /. . . o . . /1 1 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /1 1 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /1 0 1 0 0 0 /1 0 1 0 0 0 /1 0 1 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /"],
			["�����ʉ߂��鏇�Ԃ��Ԉ���Ă��܂��B","pzprv3/slalom/6/6/. . . . . . /w # . # w4 # /w # . # w # /. . . . . . /. # # w1 # . /. . . o . . /1 1 1 1 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 1 0 /0 0 0 0 0 /1 1 1 0 0 /1 0 0 0 1 0 /1 0 0 0 1 0 /1 0 0 0 1 0 /1 0 0 1 0 0 /1 0 0 1 0 0 /"],
			["�����r���œr�؂�Ă��܂��B","pzprv3/slalom/6/6/. . . . . . /w # . # w4 # /w # . # w # /. . . . . . /. # # w1 # . /. . . o . . /1 1 1 1 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /1 1 1 0 0 /1 0 0 0 1 0 /1 0 0 0 1 0 /1 0 0 0 1 0 /0 0 0 1 0 0 /0 0 0 1 0 0 /"],
			["�ւ�������ł͂���܂���B","pzprv3/slalom/6/6/. . . . . . /w # . # w4 # /w # . # w # /. . . . . . /. # # w1 # . /. . . o . . /1 1 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /1 1 0 1 1 /0 0 0 0 0 /0 0 0 1 1 /1 0 1 0 0 0 /1 0 1 0 0 0 /1 0 1 0 0 0 /0 0 0 1 0 1 /0 0 0 1 0 1 /"],
			["�����ʉ߂��Ă��Ȃ����傪����܂��B","pzprv3/slalom/6/6/. . . . . . /w # . # w4 # /w # . # w # /. . . . . . /. # # w1 # . /. . . o . . /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /1 1 1 1 1 /0 0 0 0 0 /1 1 1 1 1 /0 0 0 0 0 0 /0 0 0 0 0 0 /0 0 0 0 0 0 /1 0 0 0 0 1 /1 0 0 0 0 1 /"],
			["","pzprv3.1/slalom/6/6/. . . . . . /- # . 4 - 4 /- # . # - # /. . . . . . /. # 1 - 1 . /. . . o . . /1 1 1 1 0 /0 0 0 0 0 /0 0 0 0 0 /1 1 1 0 1 /0 0 0 0 0 /-1 -1 -1 1 1 /1 0 -1 0 1 0 /1 0 -1 0 1 0 /1 0 -1 0 1 0 /-1 0 0 1 0 1 /-1 0 0 1 0 1 /"]
		],
		slither : [
			["���򂵂Ă����������܂��B","pzprv3/slither/5/5/2 . . 1 . /. 2 . . 1 /. . 2 . . /3 . . 3 . /. 0 . . 3 /1 0 0 0 0 0 /1 1 0 0 0 0 /1 0 0 0 0 0 /1 0 0 0 0 0 /1 0 0 0 0 0 /1 1 0 0 0 /0 1 0 0 0 /0 0 0 0 0 /1 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["�����������Ă��܂��B","pzprv3/slither/5/5/2 . . 1 . /. 2 . . 1 /. . 2 . . /3 . . 3 . /. 0 . . 3 /1 0 0 0 0 0 /1 1 0 1 0 0 /1 1 1 0 1 0 /1 1 1 0 1 0 /0 0 0 0 1 0 /1 1 0 0 0 /0 1 1 0 0 /0 0 1 0 0 /0 0 0 0 0 /1 0 1 1 1 /0 0 0 0 0 /"],
			["�����̎���ɂ��鋫�E���̖{�����Ⴂ�܂��B","pzprv3/slither/5/5/2 . . 1 . /. 2 . . 1 /. . 2 . . /3 . . 3 . /. 0 . . 3 /1 0 0 0 0 0 /1 1 0 1 0 0 /1 1 1 0 0 0 /1 1 1 0 0 0 /0 0 0 0 0 0 /1 1 0 0 0 /0 1 1 0 0 /0 0 1 0 0 /0 0 0 0 0 /1 0 1 1 0 /0 0 0 0 0 /"],
			["�ւ�������ł͂���܂���B","pzprv3/slither/5/5/2 . . 0 . /. 2 . . 1 /. . 2 . . /3 . . 3 . /. 0 . . 3 /1 0 1 0 0 0 /1 1 0 0 0 0 /1 1 1 0 0 1 /1 1 1 1 1 1 /0 0 0 0 1 1 /1 1 0 0 0 /0 1 0 0 0 /0 0 1 1 1 /0 0 0 1 0 /1 0 1 0 0 /0 0 0 0 1 /"],
			["�r���œr�؂�Ă����������܂��B","pzprv3/slither/5/5/2 . . 1 . /. 2 . . 1 /. . 2 . . /3 . . 3 . /. 0 . . 3 /1 0 0 0 0 0 /1 1 0 1 0 0 /1 1 1 0 0 1 /1 1 1 1 1 1 /0 0 0 0 1 1 /1 1 1 1 0 /0 1 1 0 0 /0 0 1 0 1 /0 0 0 1 0 /1 0 1 0 0 /0 0 0 0 1 /"],
			["","pzprv3/slither/5/5/2 . . 1 . /. 2 . . 1 /. . 2 . . /3 . . 3 . /. 0 . . 3 /1 -1 0 -1 -1 1 /1 1 -1 1 -1 1 /1 1 1 0 0 1 /1 1 1 1 1 1 /-1 -1 -1 0 1 1 /1 1 1 1 1 /-1 1 1 -1 -1 /0 -1 1 0 0 /0 0 0 1 0 /1 -1 1 -1 0 /-1 0 -1 0 1 /"]
		],
		snakes : [
			["�傫�����T�ł͂Ȃ��ւ����܂��B","pzprv3/snakes/5/5/. 2,1 . . . /. . . . 2,3 /. . 2,0 . . /4,5 . . . . /. . . 4,1 . /. . . . . /. 1 . . . /. . . . . /. . . . . /. . . . . /"],
			["���������������Ă��܂��B","pzprv3/snakes/5/5/. 2,1 . . . /. . . . 2,3 /. . 2,0 . . /4,5 . . . . /. . . 4,1 . /. . . . . /. 1 2 3 . /. . . 2 . /. . . 1 . /. . . . . /"],
			["�ʁX�̎ւ��ڂ��Ă��܂��B","pzprv3/snakes/5/5/. 2,1 . . . /. . . . 2,3 /. . 2,0 . . /4,5 . . . . /. . . 4,1 . /. . 3 2 1 /2 1 4 5 . /3 4 . . . /. 5 + . . /+ + + . . /"],
			["���̕����ɂ��鐔��������������܂���B","pzprv3/snakes/5/5/. 2,1 . . . /. . . . 2,3 /. . 2,0 . . /4,5 . . . . /. . . 4,1 . /. . . . . /2 1 + . . /3 4 + 4 5 /. 5 + 3 2 /+ + + . 1 /"],
			["�ւ̎����̐�ɕʂ̎ւ����܂��B","pzprv3/snakes/5/5/. 2,1 . . . /. . . . 2,3 /. . 2,0 . . /4,5 . . . . /. . . 4,1 . /. . . . . /2 1 + 5 . /3 4 + 4 3 /. 5 + . 2 /+ + + . 1 /"],
			["","pzprv3/snakes/5/5/. 2,1 . . . /. . . . 2,3 /. . 2,0 . . /4,5 . . . . /. . . 4,1 . /. . . . . /2 1 + . . /3 4 + 4 3 /. 5 + 5 2 /+ + + . 1 /"]
		],
		sudoku : [
			["�����u���b�N�ɓ��������������Ă��܂��B","pzprv3/sudoku/4/. 1 . . /. . . 2 /3 . . . /. . 3 . /. . . . /1 . . . /. . . . /. . . . /"],
			["������ɓ��������������Ă��܂��B","pzprv3/sudoku/4/. 1 . . /. . . 2 /3 . . . /. . 3 . /. . . . /. . . . /. . . . /. 1 . . /"],
			["�����̓����Ă��Ȃ��}�X������܂��B","pzprv3/sudoku/4/. 1 . . /. . . 2 /3 . . . /. . 3 . /2 . . . /. . . . /. 4 2 . /1 2 . . /"],
			["","pzprv3/sudoku/4/. 1 . . /. . . 2 /3 . . . /. . 3 . /2 . 4 3 /4 3 1 . /. 4 2 1 /1 2 . 4 /"]
		],
		sukoro : [
			["�����������^�e���R�ɘA�����Ă��܂��B","pzprv3/sukoro/5/5/2 . 2 . . /. 4 . 2 . /. . . . . /. 2 . 4 . /. . 2 . 2 /. 3 . . . /3 . 3 . . /2 3 . . . /. . 3 . . /. 2 . . . /"],
			["�����ƁA���̐����̏㉺���E�ɓ��鐔���̐�����v���Ă��܂���B","pzprv3/sukoro/5/5/2 . 2 . . /. 4 . 2 . /. . . . . /. 2 . 4 . /. . 2 . 2 /. 3 . . . /3 . 3 . . /2 3 . . . /. . 3 . . /. . . . . /"],
			["�^�e���R�ɂȂ����Ă��Ȃ�����������܂��B","pzprv3/sukoro/5/5/. . 1 . . /. 1 . . . /. . . . . /. 2 . . . /. . 2 . . /1 3 . . . /. . . . . /. . 1 . . /. . 4 1 . /1 3 . . . /"],
			["","pzprv3/sukoro/5/5/2 . 2 . . /. 4 . 2 . /. . . . . /. 2 . 4 . /. . 2 . 2 /. 3 . - - /3 . 3 . - /2 3 - 3 2 /- . 3 . 3 /. - . 3 . /"]
		],
		tasquare : [
			["�����`�łȂ����}�X�̃J�^�}��������܂��B","pzprv3/tasquare/6/6/1 # - . . . /4 # # . . 1 /. . . 3 . . /. . 5 . . . /5 . . . . - /. . . 2 . 1 /"],
			["���}�X�����f����Ă��܂��B","pzprv3/tasquare/6/6/1 . - # . . /4 . # . . 1 /. # . 3 . . /# . 5 . . . /5 . . . . - /. . . 2 . 1 /"],
			["�����Ƃ���ɐڂ��鍕�}�X�̑傫���̍��v����v���܂���B","pzprv3/tasquare/6/6/1 . - . . . /4 . . . . 1 /. . . 3 . . /. . 5 . . . /5 . . . . - /. . . 2 . 1 /"],
			["�����̂Ȃ����ɍ��}�X���ڂ��Ă��܂���B","pzprv3/tasquare/6/6/1 # - . . # /4 . . # . 1 /# # . 3 # . /# # 5 # . . /5 . . . . - /# . # 2 # 1 /"],
			["","pzprv3/tasquare/6/6/1 # - + + # /4 + + # + 1 /# # + 3 # + /# # 5 # + # /5 . + + + - /# . # 2 # 1 /"]
		],
		tatamibari : [
			["�\���̌����_������܂��B","pzprv3/tatamibari/5/5/. . . . . /. . c . a /a . . . b /. c a . . /a c . c . /0 0 0 0 /0 0 0 0 /0 0 0 0 /1 1 0 0 /1 1 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 1 0 0 0 /1 1 0 0 0 /"],
			["�L���̓����Ă��Ȃ��^�^�~������܂��B","pzprv3/tatamibari/5/5/. . . . . /. . c . a /a . . . b /. c a . . /a c . c . /1 1 0 0 /1 1 0 0 /1 1 0 0 /1 1 0 0 /1 1 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 1 0 0 0 /0 1 0 0 0 /"],
			["�����`�łȂ��^�^�~������܂��B","pzprv3/tatamibari/5/5/. . . . . /. . c . a /a . . . b /. c a . . /a c . c . /1 0 0 1 /1 0 0 1 /0 0 0 0 /1 1 0 0 /1 1 0 0 /0 0 0 0 0 /0 1 1 1 0 /0 1 0 0 0 /0 1 0 0 0 /"],
			["�����ł͂Ȃ��^�^�~������܂��B","pzprv3/tatamibari/5/5/. . . . . /. . c . a /a . . . b /. c a . . /a c . c . /0 0 0 0 /0 0 0 0 /0 0 0 1 /1 1 0 1 /1 1 0 1 /0 0 0 0 0 /0 0 0 0 1 /0 1 0 0 0 /0 1 0 0 0 /"],
			["�c���ł͂Ȃ��^�^�~������܂��B","pzprv3/tatamibari/5/5/. . . . . /. . c . a /a . . . b /. c a . . /a c . c . /0 0 1 0 /0 0 1 0 /0 0 0 0 /1 1 0 0 /1 1 0 0 /0 0 0 0 0 /0 0 0 1 1 /0 1 0 0 0 /0 1 0 0 0 /"],
			["1�̃^�^�~��2�ȏ�̋L���������Ă��܂��B","pzprv3/tatamibari/5/5/. . . . . /. . c . a /a . . . b /. c a . . /a c . c . /0 0 0 0 /0 0 0 0 /0 0 0 0 /1 1 0 0 /1 1 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 1 0 0 0 /0 1 0 0 0 /"],
			["�^�^�~�̌`�������`�ł͂���܂���B","pzprv3/tatamibari/5/5/. . . . . /. . c . a /a . . . b /. c a . . /a c . c . /0 1 0 1 /0 1 0 1 /0 1 1 0 /1 1 1 1 /1 1 1 0 /0 0 0 0 0 /0 0 1 1 1 /1 1 0 1 0 /0 1 0 0 1 /"],
			["�r���œr�؂�Ă����������܂��B","pzprv3/tatamibari/5/5/. . . . . /. . c . a /a . . . b /. c a . . /a c . c . /0 1 0 1 /0 1 0 1 /0 1 1 0 /1 1 1 1 /1 1 1 0 /0 0 0 0 0 /0 0 1 1 1 /1 1 0 1 1 /0 1 0 0 0 /"],
			["","pzprv3/tatamibari/5/5/. . . . . /. . c . a /a . . . b /. c a . . /a c . c . /-1 1 0 1 /0 1 0 1 /-1 1 1 0 /1 1 1 0 /1 1 1 0 /-1 -1 0 0 0 /-1 -1 1 1 1 /1 1 -1 1 1 /0 1 -1 0 0 /"]
		],
		tateyoko : [
			["���}�X�Ɍq������̐�������������܂���B","pzprv3/tateyoko/5/5/. . 3 . . /. e . e 2 /. . 5 . . /2 a . b . /. . 3 . . /0 0 0 0 0 /2 . 2 . 2 /0 0 0 0 0 /0 . 0 . 0 /0 0 0 0 0 /"],
			["1�̖_��2�ȏ�̐����������Ă��܂��B","pzprv3/tateyoko/5/5/. . 3 . . /. e . e 2 /. . 5 . . /2 a . b . /. . 3 . . /0 0 1 0 0 /0 . 1 . 0 /0 0 1 0 0 /0 . 1 . 0 /0 0 1 0 0 /"],
			["�����Ɩ_�̒������Ⴂ�܂��B","pzprv3/tateyoko/5/5/. . 3 . . /. e . e 2 /. . 5 . . /2 a . b . /. . 3 . . /0 0 0 0 0 /0 . 0 . 0 /0 2 2 2 2 /0 . 0 . 0 /0 0 0 0 0 /"],
			["���}�X�Ɍq������̐�������������܂���B","pzprv3/tateyoko/5/5/. . 3 . . /. e . e 2 /. . 5 . . /2 a . b . /. . 3 . . /0 0 0 0 0 /0 . 0 . 0 /2 2 2 2 2 /0 . 0 . 0 /0 0 0 0 0 /"],
			["���������Ă��Ȃ��}�X������܂��B","pzprv3/tateyoko/5/5/. . 3 . . /. e . e 2 /. . 5 . . /2 a . b . /. . 3 . . /1 2 2 2 1 /1 . 1 . 1 /2 2 2 2 2 /1 . 2 . 2 /1 2 2 2 0 /"],
			["","pzprv3/tateyoko/5/5/. . 3 . . /. e . e 2 /. . 5 . . /2 a . b . /. . 3 . . /1 2 2 2 1 /1 . 1 . 1 /2 2 2 2 2 /1 . 2 . 2 /1 2 2 2 1 /"]
		],
		tawa : [
			["�����̎���ɓ����Ă��鍕�}�X�̐����Ⴂ�܂��B","pzprv3/tawa/5/5/0/. 2 . . 2 /. . 3 . /. . . . . /. 5 . . /2 . . . 2 /"],
			["���}�X�̉��ɍ��}�X������܂���B","pzprv3/tawa/5/5/0/. 2 . # 2 /. . 3 # /. . . . . /. 5 . # /2 . . # 2 /"],
			["���}�X������3�}�X�ȏ㑱���Ă��܂��B","pzprv3/tawa/5/5/0/. 2 . # 2 /. . 3 # /# # # # . /. 5 . # /2 . . # 2 /"],
			["","pzprv3/tawa/5/5/0/# 2 + # 2 /# + 3 # /+ # # + # /# 5 # # /2 # + # 2 /"]
		],
		tentaisho : [
			["��������ʉ߂��Ă��܂��B","pzprv3/tentaisho/5/5/1...2...1/........./2....1..2/........./.1...2..1/........./......1../..2....../2.....2../1 0 0 0 /1 0 0 0 /1 0 0 0 /1 0 0 0 /1 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["�����܂܂�Ă��Ȃ��̈悪����܂��B","pzprv3/tentaisho/5/5/1...2...1/........./2....1..2/........./.1...2..1/........./......1../..2....../2.....2../1 1 0 0 /1 1 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 1 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["�̈悪���𒆐S�ɓ_�Ώ̂ɂȂ��Ă��܂���B","pzprv3/tentaisho/5/5/1...2...1/........./2....1..2/........./.1...2..1/........./......1../..2....../2.....2../1 0 0 0 /1 1 0 0 /0 1 0 0 /0 0 0 0 /0 0 0 0 /1 1 0 0 0 /1 0 0 0 0 /1 1 0 0 0 /0 0 0 0 0 /1 0 0 0 0 /2 1 0 0 0 /1 1 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["���������܂܂��̈悪����܂��B","pzprv3/tentaisho/5/5/1...2...1/........./2....1..2/........./.1...2..1/........./......1../..2....../2.....2../1 0 0 0 /1 1 0 0 /0 1 0 0 /1 1 0 0 /1 1 0 0 /1 1 0 0 0 /1 0 0 0 0 /0 1 0 0 0 /1 0 0 0 0 /1 0 0 0 0 /2 1 0 0 0 /1 1 0 0 0 /1 2 0 0 0 /2 2 0 0 0 /"],
			["","pzprv3/tentaisho/5/5/1...2...1/........./2....1..2/........./.1...2..1/........./......1../..2....../2.....2../1 0 0 1 /1 1 0 1 /0 1 0 1 /1 1 0 0 /1 1 0 0 /1 1 1 1 1 /1 0 1 1 1 /0 1 1 1 1 /1 0 1 1 1 /1 2 2 2 1 /2 1 1 1 2 /1 1 2 2 1 /1 2 1 1 1 /2 2 2 2 2 /"]
		],
		tilepaint : [
			["���}�X�ƍ��}�X�̍��݂����^�C��������܂��B","pzprv3/tilepaint/6/6/19/0 1 1 2 3 3 /4 4 1 2 3 5 /6 7 1 8 8 9 /6 10 1 11 11 9 /12 12 13 14 11 15 /16 16 16 17 17 18 /0 2 3 4 2 3 2 /2 . . . . . . /4 . . . . . . /3 . . . . . . /3 . . . . . . /3 . . . . . . /1 . . . . . . /. # # . . . /. . # . . . /. . + . . . /. . + . . . /. . . . . . /. . . . . . /"],
			["�����̉����E�ɂ��鍕�}�X�̐����Ԉ���Ă��܂��B","pzprv3/tilepaint/6/6/20/0 1 1 2 3 3 /4 4 1 2 3 5 /6 7 8 9 9 10 /6 11 8 12 12 10 /13 13 14 15 12 16 /17 17 17 18 18 19 /0 2 3 4 2 3 2 /2 . . . . . . /4 . . . . . . /3 . . . . . . /3 . . . . . . /3 . . . . . . /1 . . . . . . /. # # . . . /. . # . . . /. . + . . . /. . + . . . /. . . . . . /. . . . . . /"],
			["","pzprv3/tilepaint/6/6/20/0 1 1 2 3 3 /4 4 1 2 3 5 /6 7 8 9 9 10 /6 11 8 12 12 10 /13 13 14 15 12 16 /17 17 17 18 18 19 /0 2 3 4 2 3 2 /2 . . . . . . /4 . . . . . . /3 . . . . . . /3 . . . . . . /3 . . . . . . /1 . . . . . . /+ # # + + + /# # # + + # /+ + # # # + /+ + # # # + /# # + + # + /+ + + + + # /"]
		],
		triplace : [
			["�T�C�Y��3�}�X��菬�����u���b�N������܂��B","pzprv3/triplace/5/5/0 -1 0 -1 1 -1 /-1 -1,2 . . . . /-1 . . . -1,-1 . /-1 . . . . . /1 . -1,1 . . . /1 . . . . -1,-1 /0 0 0 0 /1 0 0 0 /1 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /1 0 0 0 0 /0 0 0 0 0 /. . . . . /. . . . . /. . . . . /. . . . . /. . . . . /"],
			["�����̉����E�ɂ���܂������̃u���b�N�̐����Ԉ���Ă��܂��B","pzprv3/triplace/5/5/0 -1 0 -1 1 -1 /-1 -1,2 . . . . /-1 . . . -1,-1 . /-1 . . . . . /1 . -1,1 . . . /1 . . . . -1,-1 /0 0 0 0 /1 0 0 0 /1 0 0 0 /0 0 0 0 /-1 -1 1 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 1 0 /1 0 1 -1 0 /. - . . . /+ - . . . /+ - . . . /+ . . - . /+ + + - . /"],
			["�T�C�Y��3�}�X���傫���u���b�N������܂��B","pzprv3/triplace/5/5/0 -1 0 -1 1 -1 /-1 -1,2 . . . . /-1 . . . -1,-1 . /-1 . . . . . /1 . -1,1 . . . /1 . . . . -1,-1 /0 1 0 0 /1 0 0 0 /1 0 0 0 /0 0 0 0 /-1 -1 1 0 /0 0 1 0 1 /0 0 0 0 0 /0 0 0 1 0 /1 0 1 -1 0 /. - . . . /+ - . . . /+ - . . . /+ . . - . /+ + + - . /"],
			["","pzprv3/triplace/5/5/0 -1 0 -1 1 -1 /-1 -1,2 . . . . /-1 . . . -1,-1 . /-1 . . . . . /1 . -1,1 . . . /1 . . . . -1,-1 /0 1 0 0 /1 0 0 0 /1 0 1 0 /0 0 1 0 /-1 -1 1 0 /0 0 1 0 1 /0 1 1 0 0 /0 0 -1 1 1 /1 0 1 -1 0 /. - + + + /+ - - . . /+ - - . . /+ . - - - /+ + + - . /"]
		],
		usotatami : [
			["�\���̌����_������܂��B","pzprv3/usotatami/5/5/1 . 1 3 . /2 . . . . /1 . 1 . 3 /. 1 2 1 . /. 3 . . 2 /1 0 0 0 /1 0 0 0 /1 0 0 0 /1 0 0 0 /1 0 0 0 /1 1 1 1 1 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["�����̓����Ă��Ȃ��^�^�~������܂��B","pzprv3/usotatami/5/5/1 . 1 3 . /2 . . . . /1 . 1 . 3 /. 1 2 1 . /. 3 . . 2 /0 0 0 0 /1 0 0 0 /1 0 0 0 /1 0 0 0 /1 0 0 0 /1 1 1 1 1 /0 1 1 1 1 /0 0 0 0 0 /0 0 0 0 0 /"],
			["1�̃^�^�~��2�ȏ�̐����������Ă��܂��B","pzprv3/usotatami/5/5/1 . 1 3 . /2 . . . . /1 . 1 . 3 /. 1 2 1 . /. 3 . . 2 /0 0 0 0 /1 0 0 0 /1 0 0 0 /1 0 0 0 /1 0 0 0 /1 1 1 1 1 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["�����ƃ^�^�~�̑傫���������ł��B","pzprv3/usotatami/5/5/1 . 1 3 . /2 . . . . /1 . 1 . 3 /. 1 2 1 . /. 3 . . 2 /0 1 1 1 /1 1 1 1 /1 1 0 1 /1 1 1 1 /0 0 1 1 /1 1 0 0 0 /1 0 1 1 0 /0 0 1 1 0 /1 1 1 0 1 /"],
			["�r�؂�Ă����������܂��B","pzprv3/usotatami/5/5/1 . 1 3 . /2 . . . . /1 . 1 . 3 /. 1 2 1 . /. 3 . . 2 /0 1 1 0 /1 1 1 0 /1 1 0 1 /1 1 1 1 /1 0 1 1 /1 1 0 0 1 /1 0 1 1 1 /0 0 1 1 0 /0 1 1 0 1 /"],
			["�����P�}�X�ł͂Ȃ��^�^�~������܂��B","pzprv3/usotatami/5/5/1 . 1 3 . /2 . . . . /1 . 1 . 3 /. 1 2 1 . /. 3 . . 2 /0 1 1 0 /1 1 1 0 /1 1 0 1 /1 1 1 1 /1 0 1 1 /1 1 0 0 0 /1 0 1 1 1 /0 0 1 1 0 /0 1 1 0 1 /"],
			["","pzprv3/usotatami/5/5/1 . 1 3 . /2 . . . . /1 . 1 . 3 /. 1 2 1 . /. 3 . . 2 /-1 1 1 1 /1 1 1 1 /1 1 0 1 /1 1 1 1 /1 0 1 1 /1 1 0 0 -1 /1 -1 1 1 -1 /0 -1 1 1 -1 /0 1 1 0 1 /"]
		],
		view : [
			["�����������^�e���R�ɘA�����Ă��܂��B","pzprv3/view/5/5/. . . . . /. . 4 0 1 /. 3 . 2 . /1 0 1 . . /. . . . . /- - - . . /- - . . . /. . - . . /. . . . . /. 0 . . . /"],
			["�����ƁA���̃}�X�ɂ��ǂ蒅���܂ł̃}�X�̐��̍��v����v���Ă��܂���B","pzprv3/view/5/5/. . . . . /. . 4 0 1 /. 3 . 2 . /1 0 1 . . /. . . . . /- - - . + /- - . . . /+ . - . - /. . . + + /- + + . . /"],
			["�^�e���R�ɂȂ����Ă��Ȃ�����������܂��B","pzprv3/view/5/5/. . . . . /. . 4 0 1 /. 3 . 2 . /1 0 1 . . /. . . . . /- - - + + /- - . . . /+ . - . - /. . . + + /- + + . . /"],
			["�����̓����Ă��Ȃ��}�X������܂��B","pzprv3/view/5/5/. . . . . /. . 4 0 1 /. 3 . 2 . /1 0 1 . . /. . . . . /- - - + + /- - . . . /2 . - . - /. . . 0 + /- + + + . /"],
			["","pzprv3/view/5/5/. . . . . /. . 4 0 1 /. 3 . 2 . /1 0 1 . . /. . . . . /- - - 3 0 /- - . . . /2 . - . - /. . . 0 2 /- 1 0 1 . /"]
		],
		wblink : [
			["�����������Ă��܂��B","pzprv3/wblink/5/5/1 1 . 2 . /. . 2 . 1 /. 1 . . 2 /2 1 . 2 1 /2 . . 1 2 /0 0 0 0 /0 0 0 0 /0 1 1 1 /0 0 0 0 /0 0 0 0 /0 0 0 1 0 /0 0 0 1 0 /0 0 0 1 0 /0 0 0 0 0 /"],
			["3�ȏ�́����q�����Ă��܂��B","pzprv3/wblink/5/5/1 1 . 2 . /. . 2 . 1 /. 1 . . 2 /2 1 . 2 1 /2 . . 1 2 /0 0 0 0 /0 0 0 0 /0 0 0 0 /1 1 1 1 /0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["���ۓ��m���q�����Ă��܂��B","pzprv3/wblink/5/5/1 1 . 2 . /. . 2 . 1 /. 1 . . 2 /2 1 . 2 1 /2 . . 1 2 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 1 0 0 0 /0 1 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
			["���ۓ��m���q�����Ă��܂��B","pzprv3/wblink/5/5/1 1 . 2 . /. . 2 . 1 /. 1 . . 2 /2 1 . 2 1 /2 . . 1 2 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 1 0 /0 0 0 1 0 /0 0 0 1 0 /0 0 0 0 0 /"],
			["����������o�Ă��܂���B","pzprv3/wblink/5/5/1 1 . 2 . /. . 2 . 1 /. 1 . . 2 /2 1 . 2 1 /2 . . 1 2 /-1 1 1 0 /0 0 1 1 /0 0 0 0 /0 1 1 0 /1 1 1 0 /1 -1 0 0 0 /1 -1 0 0 0 /1 -1 0 0 0 /0 0 0 0 0 /"],
			["","pzprv3/wblink/5/5/1 1 . 2 . /. . 2 . 1 /. 1 . . 2 /2 1 . 2 1 /2 . . 1 2 /-1 1 1 0 /0 0 1 1 /0 1 1 1 /0 1 1 0 /1 1 1 0 /1 -1 0 0 0 /1 -1 0 0 0 /1 -1 0 0 0 /0 0 0 -1 1 /"]
		],
		yajikazu : [
			["���}�X���^�e���R�ɘA�����Ă��܂��B","pzprv3/yajikazu/6/6/4,0 . . . . 2,3 /1,99 . . . . . /. . . . 3,2 . /. . . . . . /. 1,2 . . 3,2 . /1,2 . 1,1 . . . /+ + . . . . /# + . . . . /# . . . . . /. . . . . . /. . . . . . /. . . . . . /"],
			["���}�X�����f����Ă��܂��B","pzprv3/yajikazu/6/6/4,0 . . . . 2,3 /1,99 . . . . . /. . . . 3,2 . /. . . . . . /. 1,2 . . 3,2 . /1,2 . 1,1 . . . /+ + + + + + /# + . . + # /+ # . . + + /. . # . + # /. . . # + + /. . # . + # /"],
			["���̕����ɂ��鍕�}�X�̐�������������܂���B","pzprv3/yajikazu/6/6/4,0 . . . . 2,3 /1,99 . . . . . /. . . . 3,2 . /. . . . . . /. 1,2 . . 3,2 . /1,2 . 1,1 . . . /+ + + + + + /# + . + + # /+ # . # + + /+ + . . + # /. + . . + + /. . . . + # /"],
			["","pzprv3/yajikazu/6/6/4,0 . . . . 2,3 /1,99 . . . . . /. . . . 3,2 . /. . . . . . /. 1,2 . . 3,2 . /1,2 . 1,1 . . . /+ + + + + + /# + # + + # /+ # + # + + /+ + + . + # /+ # + # + + /# + + . + # /"]
		],
		yajirin : [
			["���򂵂Ă����������܂��B","pzprv3/yajirin/5/5/. . . . . /. . . . . /. . . 3,2 . /. . . . . /. . . . 1,0 /. . . . . /. . . . . /. . . . . /. . . . . /. . . . . /1 1 1 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 1 0 0 0 /0 1 0 0 0 /0 1 0 0 0 /0 0 0 0 0 /"],
			["�������Ă����������܂��B","pzprv3/yajirin/5/5/. . . . . /. . . . . /. . . 3,2 . /. . . . . /. . . . 1,0 /. . . . . /. . . . . /. . . . . /. . . . . /. . . . . /0 0 1 0 /1 1 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 1 1 0 0 /0 1 0 0 0 /0 1 0 0 0 /0 0 0 0 0 /"],
			["���}�X�̏�ɐ���������Ă��܂��B","pzprv3/yajirin/5/5/. . . . . /. . . . . /. . . 3,2 . /. . . . . /. . . . 1,0 /. . . # . /. . . . . /# . # . . /. . . . . /. . . . . /1 1 0 1 /1 0 1 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /1 0 1 1 0 /0 1 0 0 0 /0 1 0 0 0 /0 0 0 0 0 /"],
			["���}�X���^�e���R�ɘA�����Ă��܂��B","pzprv3/yajirin/5/5/. . . . . /. . . . . /. . . 3,2 . /. . . . . /. . . . 1,0 /. . . . . /. . . . . /# . # . . /. . # . . /. . . . . /1 1 0 1 /1 0 1 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /1 0 1 1 0 /0 1 0 0 0 /0 1 0 0 0 /0 0 0 0 0 /"],
			["���̕����ɂ��鍕�}�X�̐�������������܂���B","pzprv3/yajirin/5/5/. . . . . /. . . . . /. . . 3,2 . /. . . . . /. . . . 1,0 /. . . . . /. . . . + /+ . # . + /. . + . + /. . . . . /1 1 0 1 /1 0 1 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /1 0 1 1 0 /0 1 0 0 0 /0 1 0 0 0 /0 0 0 0 0 /"],
			["�r�؂�Ă����������܂��B","pzprv3/yajirin/5/5/. . . . . /. . . . . /. . . 3,2 . /. . . . . /. . . . 1,0 /. . . . . /. . . . + /# . # . + /. . + . + /. . . . . /1 1 0 1 /1 0 1 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /1 0 1 1 0 /0 1 0 0 0 /0 1 0 0 0 /0 0 0 0 0 /"],
			["�ւ�������ł͂���܂���B","pzprv3/yajirin/5/5/. . . . . /. . . . . /. . . 3,2 . /. . . . . /. . . . 1,0 /. . . . . /. . . . + /# . # . + /. . + . + /. . . . . /1 1 0 1 /1 1 0 1 /0 0 0 0 /0 0 1 0 /0 0 1 0 /1 0 1 1 1 /0 0 0 0 0 /0 0 0 0 0 /0 0 1 1 0 /"],
			["���}�X������������Ă��Ȃ��}�X������܂��B","pzprv3/yajirin/5/5/. . . . . /. . . . . /. . . 3,2 . /. . . . . /. . . . 1,0 /. . . . . /. . . . + /# . # . + /. . + . + /. . . . . /1 1 0 1 /1 0 1 0 /0 0 0 0 /0 1 0 1 /0 0 1 0 /1 0 1 1 1 /0 1 0 0 1 /0 1 0 0 1 /0 0 1 1 0 /"],
			["","pzprv3/yajirin/5/5/. . . . . /. . . . . /. . . 3,2 . /. . . . . /. . . . 1,0 /. . . . . /. . . . + /# . # . + /. . + . + /. . . # . /1 1 -1 1 /1 -1 1 -1 /0 0 0 -1 /1 -1 1 1 /1 1 0 0 /1 -1 1 1 1 /0 1 0 0 1 /0 1 0 0 1 /1 -1 1 0 0 /"]
		],
		perftest : [
			["","pzprv3/country/10/18/44/0 0 1 1 1 2 2 2 3 4 4 4 5 5 6 6 7 8 /0 9 1 10 10 10 11 2 3 4 12 4 4 5 6 13 13 8 /0 9 1 1 10 10 11 2 3 12 12 12 4 5 14 13 13 15 /0 9 9 9 10 16 16 16 16 17 12 18 4 5 14 13 15 15 /19 19 19 20 20 20 21 17 17 17 22 18 18 14 14 23 23 24 /19 25 25 26 26 21 21 17 22 22 22 18 27 27 27 24 24 24 /28 28 29 26 30 31 21 32 22 33 33 33 33 34 35 35 35 36 /28 29 29 26 30 31 32 32 32 37 38 39 34 34 40 40 35 36 /41 29 29 42 30 31 31 32 31 37 38 39 34 34 34 40 35 36 /41 43 42 42 30 30 31 31 31 37 38 38 38 40 40 40 36 36 /3 . 6 . . 4 . . 2 . . . . . . . . 1 /. . . 5 . . . . . . . . . . . . . . /. . . . . . . . . 1 . . . . . . . . /. . . . . . . . . . . . . . . . . . /3 . . 2 . . . 4 . . . . . . . . . . /. . . 3 . . . . 4 . . . 2 . . . . . /. . . . 3 6 . . . 4 . . . . . . . . /. 5 . . . . . . . 2 . . 3 . . . . . /. . . . . . . . . . . . . . . . . . /. . . . . . . . . . . . . . . . 5 . /0 0 1 1 0 0 1 0 0 1 1 0 0 0 1 1 0 /1 0 0 0 1 0 0 0 1 0 0 1 0 0 0 0 1 /0 0 1 0 1 0 0 1 0 0 0 0 0 0 0 0 0 /0 1 1 0 0 0 1 0 0 1 1 0 1 0 0 0 1 /1 1 0 0 1 0 0 1 1 0 0 0 0 1 0 1 0 /0 1 0 1 0 1 0 0 1 1 1 0 1 0 0 1 1 /1 0 1 0 0 0 0 1 0 1 1 1 0 0 1 1 0 /0 1 0 0 0 0 1 0 0 0 0 1 1 0 1 0 0 /0 1 1 0 1 1 0 0 1 0 1 0 0 0 0 0 0 /1 1 1 0 0 0 1 1 0 0 1 1 1 1 1 0 1 /0 0 1 0 1 0 1 1 0 1 0 1 0 0 1 0 1 0 /1 1 1 0 0 1 1 1 1 0 0 0 1 0 1 0 0 1 /1 1 0 1 1 0 1 0 0 0 0 0 1 0 1 0 0 1 /1 0 0 0 1 0 0 1 0 1 0 1 0 1 1 0 1 0 /0 0 1 0 0 1 0 0 0 0 0 1 0 0 0 1 0 0 /0 1 0 1 1 0 1 0 1 0 0 0 1 1 0 0 0 1 /1 0 1 0 1 0 1 1 0 1 0 0 0 1 1 0 1 1 /1 1 0 0 1 0 0 0 0 1 0 1 0 0 0 1 1 1 /1 0 0 1 0 0 1 0 1 0 1 0 0 0 0 1 1 1 /2 2 1 1 1 2 0 0 2 0 1 0 0 0 0 0 0 2 /1 1 1 2 1 1 0 0 0 1 2 1 0 0 1 2 0 0 /1 0 1 1 1 1 0 0 1 2 2 2 1 0 1 2 2 0 /1 0 0 1 1 2 1 0 2 1 1 1 1 0 1 2 1 0 /1 1 0 2 1 1 2 0 0 0 2 1 2 1 1 1 0 2 /2 1 0 1 1 1 0 2 0 0 0 0 1 1 2 1 0 0 /1 0 1 1 1 2 1 1 0 0 0 0 0 0 1 0 0 0 /0 1 1 2 1 2 1 1 2 1 2 0 1 0 1 0 0 0 /0 1 1 0 1 1 1 2 0 1 0 1 2 2 2 1 0 0 /0 0 0 1 2 2 1 1 0 2 0 0 1 0 1 0 0 0 /"]
		]
	},

	urls : [
		['ayeheya'    , '6/6/99aa8c0vu0ufk2k'],
		['bag'        , '6/6/g3q2h3jbj3i3i2g'],
		['barns'      , '5/5/06ec080000100'],
		['bdblock'    , '5/5/100089082/12345o51g4i3i'],
		['bonsan'     , '5/5/co360rr0g1h0g.j121g3h1h.g.g'],
		['bosanowa'   , '6/5/jo9037g2n2n3g4j3i'],
		['chocona'    , '6/6/8guumlfvo1eq33122g21g32'],
		['cojun'      , '4/4/pd0hsoh3p3h'],
		['country'    , '5/5/amda0uf02h12h'],
		['creek'      , '6/6/gagaich2cgb6769dt'],
		['factors'    , '5/5/rvvcm9jf54653-28ca2833-14'],
		['fillmat'    , '5/5/3b3h1h1b4'],
		['fillomino'  , '6/6/h4j53g2k5233k2g14j3h'],
		['firefly'    , '5/5/40c21a3.a30g10a22a11c11'],
		['gokigen'    , '4/4/iaegcgcj6a'],
		['hakoiri'    , '5/5/4qb44qb41c3c1f23a2b1b1'],
		['hashikake'  , '5/5/4g2i3h23k3g1g3g4g3'],
		['heyawake'   , '6/6/lll155007rs12222j'],
		['hitori'     , '4/4/1114142333214213'],
		['icebarn'    , '8/8/73btfk05ovbjghzpwz9bwm/3/11'],
		['ichimaga'   , 'm/5/5/7cgegbegbgcc'],
		['kaero'      , '3/3/egh0BCBcAaA'],
		['kakuro'     , '5/5/48la0.na0lh3l0Bn.0cl.c4a3'],
		['kakuru'     , '5/5/3.a+4+mD.S.bm+g+A.3'],
		['kinkonkan'  , '4/4/94gof0BAaDbBaCbCaAaD21122211'],
		['kramma'     , '5/5/32223i3f2fb99i'],
		['kurochute'  , '5/5/132k1i1i2k332'],
		['kurodoko'   , '5/5/i7g5l2l2g4i'],
		['kusabi'     , '5/5/311e2c12c1f3'],
		['lightup'    , '6/6/nekcakbl'],
		['lits'       , '4/4/9q02jg'],
		['loopsp'     , '5/5/sgnmn1n1n2njnls'],
		['mashu'      , '6/6/1063000i3000'],
		['mejilink'   , '4/4/g9rm4'],
		['minarism'   , '4/4/hhhq21pgi'],
		['mochikoro'  , '5/5/4p2n1i1'],
		['mochinyoro' , '5/5/l4g2m2m1'],
		['nagenawa'   , '6/6/alrrlafbaaqu3011314g223h'],
		['nanro'      , '4/4/6r0s1oi13n1h'],
		['nawabari'   , '5/5/f0a1g2a1f'],
		['norinori'   , '5/5/cag4ocjo'],
		['numlin'     , '5/5/1j2h3m1h2j3'],
		['nuribou'    , '5/5/1g2l1g4r7'],
		['nurikabe'   , '5/5/g5k2o1k3g'],
		['paintarea'  , '5/5/pmvmfuejf4k1f'],
		['pipelink'   , '5/5/mamejan'],
		['reflect'    , '5/5/49l20c5f24'],
		['ripple'     , '4/4/9n8rigk14h32k'],
		['shakashaka' , '6/6/cgbhdhegdrb'],
		['shikaku'    , '6/6/j3g56h6t6h23g5j'],
		['shimaguni'  , '6/6/7fe608s0e3uf3g3g2g43'],
		['shugaku'    , '5/5/c5d462b'],
		['shwolf'     , '5/5/0282bocb6ajf9'],
		['slalom'     , 'p/6/6/9314131314131a1131ag44j11/33'],
		['slither'    , '5/5/cbcbcddad'],
		['snakes'     , '5/5/a21g23b20b45g41a'],
		['sudoku'     , '4/4/g1k23k3g'],
		['sukoro'     , '5/5/2a2c4a2g2a4c2a2'],
		['tasquare'   , '6/6/1g.i4j1i3j5i5j.i2g1'],
		['tatamibari' , '5/5/m3g11i2g31h13g3g'],
		['tateyoko'   , '5/5/i23i3ono2i25i22pnqi33i2'],
		['tawa'       , '5/5/0/a2b2b3g5b2c2'],
		['tentaisho'  , '5/5/67eh94fi65en8dbf'],
		['tilepaint'  , '6/6/mfttf5ovqrrvzv234232243331'],
		['triplace'   , '5/5/%2m_m%1m_.0.1....11'],
		['usotatami'  , '5/5/1a13a2d1a1a3a121b3b2'],
		['view'       , '5/5/m401g3g2g101m'],
		['wblink'     , '5/5/ci6a2ln1i'],
		['yajikazu'   , '6/6/40d23663i32h12b32a12a11c'],
		['yajirin'    , '5/5/m32j10']
	]
};
