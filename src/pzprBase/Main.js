// Main.js v3.2.3

//---------------------------------------------------------------------------
// ��PBase�N���X �ς��Ղ�v3�̃x�[�X�����₻�̑��̏������s��
//---------------------------------------------------------------------------

// PBase�N���X
PBase = function(){
	this.floatbgcolor = "black";
	this.proto        = 0;	// �e�N���X��prototype���p�Y���p�X�N���v�g�ɂ���ĕύX����Ă��邩
	this.expression   = { ja:'' ,en:''};
	this.puzzlename   = { ja:'' ,en:''};
	this.canvas       = null;	// HTML�\�[�X��Canvas�������G�������g
	this.numparent    = null;	// 'numobj_parent'�������G�������g
	this.onresizenow  = false;	// resize�����ǂ���
	this.initProcess  = true;	// �����������ǂ���
};
PBase.prototype = {
	//---------------------------------------------------------------------------
	// base.preload_func()
	//   ���̃t�@�C�����Ă΂ꂽ�Ƃ��Ɏ��s�����֐� -> onLoad�O�̍ŏ����̐ݒ���s��
	//---------------------------------------------------------------------------
	preload_func : function(){
		// URL�̎擾 -> URL��?�ȉ�����puzzleid����pzlURI���ɕ���
		enc = new Encode();
		k.puzzleid = enc.first_parseURI(location.search);
		if(!k.puzzleid && location.href.indexOf('for_test.html')>=0){ k.puzzleid = 'country';}
		if(!k.puzzleid){ location.href = "./";} // �w�肳�ꂽ�p�Y�����Ȃ��ꍇ�͂��悤�Ȃ�`
		if(enc.uri.cols){ k.qcols = enc.uri.cols;}
		if(enc.uri.rows){ k.qrows = enc.uri.rows;}

		// Gears_init.js�̓ǂݍ���
		fio = new FileIO();
		if(fio.choiceDataBase()>0){
			document.writeln("<script type=\"text/javascript\" src=\"src/gears_init.js\"></script>");
		}

		// �p�Y����p�t�@�C���̓ǂݍ���
		if(location.href.indexOf('for_test.html')==-1){
			document.writeln("<script type=\"text/javascript\" src=\"src/"+k.puzzleid+".js\"></script>");
		}
		else{
			document.writeln("<script type=\"text/javascript\" src=\"src/puzzles.js\"></script>");
		}

		// onLoad��onResize�ɓ�������蓖�Ă�
		window.onload   = ee.ebinder(this, this.onload_func);
		window.onresize = ee.ebinder(this, this.onresize_func);
	},

	//---------------------------------------------------------------------------
	// base.onload_func()
	//   �y�[�W��Load���ꂽ���̏����B�e�N���X�̃I�u�W�F�N�g�ւ̓ǂݍ��ݓ������ݒ���s��
	// 
	// base.initCanvas()  Canvas�֘A�̏�����
	// base.initObjects() �e�I�u�W�F�N�g�̐����Ȃǂ̏���
	// base.setEvents()   �}�E�X���́A�L�[���͂̃C�x���g�̐ݒ���s��
	// base.initSilverlight() Silverlight�I�u�W�F�N�g�ɃC�x���g�̐ݒ���s��(IE��Silverlight���[�h��)
	//---------------------------------------------------------------------------
	onload_func : function(){
		this.initCanvas();
		this.initObjects();
		this.setEvents(true);	// �C�x���g����������

		if(document.domain=='indi.s58.xrea.com' && k.PLAYER){ this.accesslog();}	// �A�N�Z�X���O���Ƃ��Ă݂�
		tm = new Timer();	// �^�C�}�[�I�u�W�F�N�g�̐����ƃ^�C�}�[�X�^�[�g

		this.initProcess = false;
	},

	initCanvas : function(){
		this.canvas = ee('puzzle_canvas').unselectable().el; // Canvas
		this.numparent = ee('numobj_parent').el;			// �����\���p
		g = this.canvas.getContext("2d");
	},

	initObjects : function(){
		this.proto = 0;

		puz = new Puzzles[k.puzzleid]();	// �p�Y���ŗL�I�u�W�F�N�g
		puz.setting();					// �p�Y���ŗL�̕ϐ��ݒ�(�f�t�H���g��)
		if(this.proto){ puz.protoChange();}

		// �N���X������
		bd = new Board();		// �ՖʃI�u�W�F�N�g
		mv = new MouseEvent();	// �}�E�X���̓I�u�W�F�N�g
		kc = new KeyEvent();	// �L�[�{�[�h���̓I�u�W�F�N�g
		kp = new KeyPopup();	// ���̓p�l���I�u�W�F�N�g
		pc = new Graphic();		// �`��n�I�u�W�F�N�g
		tc = new TCell();		// �L�[���͂̃^�[�Q�b�g�Ǘ��I�u�W�F�N�g
		ans = new AnsCheck();	// ���𔻒�I�u�W�F�N�g
		um   = new UndoManager();	// ������Ǘ��I�u�W�F�N�g
		area = new AreaManager();	// ������񓙊Ǘ��I�u�W�F�N�g
		line = new LineManager();	// ���̏��Ǘ��I�u�W�F�N�g

		fio.initDataBase();		// �f�[�^�x�[�X�̐ݒ�
		menu = new Menu();		// ���j���[�������I�u�W�F�N�g
		pp = new Properties();	// ���j���[�֌W�̐ݒ�l��ێ�����I�u�W�F�N�g

		this.doc_design();		// �f�U�C���ύX�֘A�֐��̌Ăяo��

		enc.pzlinput();										// URL����p�Y���̃f�[�^��ǂݏo��
		if(!enc.uri.bstr){ this.resize_canvas_onload();}	// Canvas�̐ݒ�(pzlinput�ŌĂ΂��̂ŁA�����ł͌Ă΂Ȃ�)

		if(k.scriptcheck && debug){ debug.testonly_func();}	// �e�X�g�p
	},
	setEvents : function(first){
		this.canvas.onmousedown   = ee.ebinder(mv, mv.e_mousedown);
		this.canvas.onmousemove   = ee.ebinder(mv, mv.e_mousemove);
		this.canvas.onmouseup     = ee.ebinder(mv, mv.e_mouseup  );
		this.canvas.oncontextmenu = function(){ return false;};

		this.numparent.onmousedown   = ee.ebinder(mv, mv.e_mousedown);
		this.numparent.onmousemove   = ee.ebinder(mv, mv.e_mousemove);
		this.numparent.onmouseup     = ee.ebinder(mv, mv.e_mouseup  );
		this.numparent.oncontextmenu = function(){ return false;};

		if(first){
			document.onkeydown  = ee.kcbinder(kc.e_keydown);
			document.onkeyup    = ee.kcbinder(kc.e_keyup);
			document.onkeypress = ee.kcbinder(kc.e_keypress);
		}
	},
	initSilverlight : function(sender){
		sender.AddEventListener("KeyDown", ee.kcbinder(kc.e_SLkeydown));
		sender.AddEventListener("KeyUp",   ee.kcbinder(kc.e_SLkeyup));
	},

	//---------------------------------------------------------------------------
	// base.doc_design()       onload_func()�ŌĂ΂��Bhtml�Ȃǂ̐ݒ���s��
	// base.postfix()          �e�p�Y���̏������㏈�����Ăяo��
	// base.gettitle()         ���݊J���Ă���^�C�g����Ԃ�
	// base.getPuzzleName()    ���݊J���Ă���p�Y���̖��O��Ԃ�
	// base.setTitle()         �p�Y���̖��O��ݒ肷��
	// base.setExpression()    ��������ݒ肷��
	// base.setFloatbgcolor()  �t���[�g���j���[�̔w�i�F��ݒ肷��
	//---------------------------------------------------------------------------
	// �w�i�摜�Ƃ�title��/html�\���̐ݒ� //
	doc_design : function(){
		this.resize_canvas_only();	// Canvas�̃T�C�Y�ݒ�

		_doc.title = this.gettitle();
		ee('title2').el.innerHTML = this.gettitle();

		_doc.body.style.backgroundImage = "url(../../"+k.puzzleid+"/bg.gif)";
		if(k.br.IE){
			ee('title2').el.style.marginTop = "24px";
			ee('separator1').el.style.margin = '0pt';
			ee('separator2').el.style.margin = '0pt';
		}

		this.postfix();			// �e�p�Y�����Ƃ̐ݒ�(��t����)
		menu.menuinit();
		um.enb_btn();
	},
	postfix : function(){
		puz.input_init();
		puz.graphic_init();
		puz.encode_init();
		puz.answer_init();
	},

	gettitle : function(){
		if(k.EDITOR){ return ""+this.getPuzzleName()+(menu.isLangJP()?" �G�f�B�^ - �ς��Ղ�v3":" editor - PUZ-PRE v3");}
		else		{ return ""+this.getPuzzleName()+(menu.isLangJP()?" player - �ς��Ղ�v3"  :" player - PUZ-PRE v3");}
	},
	getPuzzleName : function(){ return (menu.isLangJP()||!this.puzzlename.en)?this.puzzlename.ja:this.puzzlename.en;},
	setTitle      : function(strJP, strEN){ this.puzzlename.ja = strJP; this.puzzlename.en = strEN;},
	setExpression : function(strJP, strEN){ this.expression.ja = strJP; this.expression.en = strEN;},
	setFloatbgcolor : function(color){ this.floatbgcolor = color;},

	//---------------------------------------------------------------------------
	// base.resize_canvas_only()   �E�B���h�E��Load/Resize���̏����BCanvas/�\������}�X�ڂ̑傫����ݒ肷��B
	// base.resize_canvas()        resize_canvas_only()+Canvas�̍ĕ`��
	// base.resize_canvas_onload() ����������paint�ĕ`�悪�N����Ȃ��悤�ɁAresize_canvas���Ăяo��
	// base.onresize_func()        �E�B���h�E���T�C�Y���ɌĂ΂��֐�
	// base.resetInfo()            AreaInfo���A�Ֆʓǂݍ��ݎ��ɏ��������������Ăяo��
	//---------------------------------------------------------------------------
	resize_canvas_only : function(){
		var wwidth = ee.windowWidth();
		k.p0 = new Pos(k.def_psize, k.def_psize);

		// �Z���̃T�C�Y�̌���
		var cratio = {0:(19/36), 1:0.75, 2:1.0, 3:1.5, 4:3.0}[k.widthmode];
		var ci0 = Math.round((wwidth-k.p0.x*2)/(k.def_csize*cratio)*0.75);
		var ci1 = Math.round((wwidth-k.p0.x*2)/(k.def_csize*cratio));
		var ci2 = Math.round((wwidth-k.p0.x*2)/(k.def_csize)*2.25);

		if(k.qcols < ci0){				// ���ɏk�����Ȃ��Ƃ�
			k.cwidth = k.cheight = mf(k.def_csize*cratio);
			ee('main').el.style.width = '80%';
		}
		else if(k.qcols < ci1){			// �E�B���h�E�̕�75%�ɓ���ꍇ �t�H���g�̃T�C�Y��3/4�܂ŏk�߂Ă悢
			k.cwidth = k.cheight = mf(k.def_csize*cratio*(1-0.25*((k.qcols-ci0)/(ci1-ci0))));
			k.p0.x = k.p0.y = mf(k.def_psize*(k.cwidth/k.def_csize));
			ee('main').el.style.width = '80%';
		}
		else if(k.qcols < ci2){			// main��table���L����Ƃ�
			k.cwidth = k.cheight = mf(k.def_csize*cratio*(0.75-0.35*((k.qcols-ci1)/(ci2-ci1))));
			k.p0.x = k.p0.y = mf(k.def_psize*(k.cwidth/k.def_csize));
			ee('main').el.style.width = ""+(k.p0.x*2+k.qcols*k.cwidth+12)+"px";
		}
		else{							// �W���T�C�Y��40%�ɂ���Ƃ�(���������̉���)
			k.cwidth = k.cheight = mf(k.def_csize*0.4);
			k.p0 = new Pos(k.def_psize*0.4, k.def_psize*0.4);
			ee('main').el.style.width = '96%';
		}

		// Canvas�̃T�C�Y�ύX
		this.canvas.width  = k.p0.x*2 + k.qcols*k.cwidth;
		this.canvas.height = k.p0.y*2 + k.qrows*k.cheight;

		// VML�g�����ɁACanvas�O�̘g���������Ă��܂��̂Ŏc���Ă����܂�.
		if(g.vml){
			var fc = this.canvas.firstChild;
			fc.style.width  = ''+this.canvas.clientWidth  + 'px';
			fc.style.height = ''+this.canvas.clientHeight + 'px';
		}

		// extendxell==1�̎��͏㉺�̊Ԋu���L���� (extendxell==2��def_psize�Œ���)
		if(k.isextendcell==1){
			k.p0.x += mf(k.cwidth*0.45);
			k.p0.y += mf(k.cheight*0.45);
		}

		var rect = ee('puzzle_canvas').getRect();
		k.cv_oft.x = rect.left;
		k.cv_oft.y = rect.top;

		kp.resize();
		bd.setposAll();

		pc.onresize_func();
	},
	resize_canvas : function(){
		this.resize_canvas_only();
		pc.flushCanvasAll();
		pc.paintAll();
	},
	resize_canvas_onload : function(){
		if(pc.already()){ this.resize_canvas();}
		else{ uuCanvas.ready(ee.binder(this, this.resize_canvas));}
	},
	onresize_func : function(){
		if(this.onresizenow){ return;}
		this.onresizenow = true;

		this.resize_canvas();

		this.onresizenow = false;
	},

	resetInfo : function(iserase){
		if(iserase){ um.allerase();}
		tc.Adjust();
		area.resetArea();
		line.resetLcnts();
	},

	//---------------------------------------------------------------------------
	// base.accesslog() player�̃A�N�Z�X���O���Ƃ�
	//---------------------------------------------------------------------------
	accesslog : function(){
		var refer = document.referrer;
		refer = refer.replace(/\?/g,"%3f");
		refer = refer.replace(/\&/g,"%26");
		refer = refer.replace(/\=/g,"%3d");
		refer = refer.replace(/\//g,"%2f");

		// ���M
		var xmlhttp = false;
		if(typeof ActiveXObject != "undefined"){
			try { xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");}
			catch (e) { xmlhttp = false;}
		}
		if(!xmlhttp && typeof XMLHttpRequest != "undefined") {
			xmlhttp = new XMLHttpRequest();
		}
		if(xmlhttp){
			xmlhttp.open("GET", ["./record.cgi", "?pid=",k.puzzleid, "&pzldata=",enc.uri.qdata, "&referer=",refer].join(''));
			xmlhttp.onreadystatechange = function(){};
			xmlhttp.send(null);
		}
	}
};

base = new PBase();	// onLoad�܂ł̍ŏ����̐ݒ���s��
base.preload_func();
