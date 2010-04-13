// Main.js v3.3.0

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
	this.resizetimer  = null;	// resize�^�C�}�[
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
		enc.first_parseURI(location.search);
		if(!k.puzzleid){ location.href = "./";} // �w�肳�ꂽ�p�Y�����Ȃ��ꍇ�͂��悤�Ȃ�`

		// �p�Y����p�t�@�C���̓ǂݍ���
		if(!k.scriptcheck){
			document.writeln("<script type=\"text/javascript\" src=\"src/"+k.puzzleid+".js\"></script>");
		}
		else{
			document.writeln("<script type=\"text/javascript\" src=\"src/for_test.js\"></script>");
			document.writeln("<script type=\"text/javascript\" src=\"src/puzzles.js\"></script>");
		}

		fio = new FileIO();
		if(fio.dbm.requireGears()){
			// �K�v�ȏꍇ�Agears_init.js�̓ǂݍ���
			document.writeln("<script type=\"text/javascript\" src=\"src/gears_init.js\"></script>");
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
	// base.translationEN() ���{����łȂ��ꍇ�A�f�t�H���g�ŉp��\���ɂ���
	//---------------------------------------------------------------------------
	onload_func : function(){
		//Camp.select('canvas');
		Camp('divques');

		var self = this;
		var tim = setInterval(function(){
			if(Camp.isready()){
				clearInterval(tim);
				self.onload_func2.apply(self);
			}
		},10);
	},
	onload_func2 : function(){
		this.initCanvas();
		this.initObjects();
		this.setEvents(true);	// �C�x���g����������
		this.translationEN();

		if(document.domain=='indi.s58.xrea.com' && k.PLAYER){ this.accesslog();}	// �A�N�Z�X���O���Ƃ��Ă݂�
		tm = new Timer();	// �^�C�}�[�I�u�W�F�N�g�̐����ƃ^�C�}�[�X�^�[�g

		this.initProcess = false;
	},

	initCanvas : function(){
		this.canvas = ee('divques').unselectable().el;	// Canvas
		this.numparent = ee('numobj_parent').el;		// �����\���p
		g = this.canvas.getContext("2d");
	},

	initObjects : function(){
		this.proto = 0;

		puz = new Puzzles[k.puzzleid]();	// �p�Y���ŗL�I�u�W�F�N�g
		puz.setting();						// �p�Y���ŗL�̕ϐ��ݒ�(�f�t�H���g��)
		if(this.proto){ puz.protoChange();}

		// �N���X������
		tc = new TCell();		// �L�[���͂̃^�[�Q�b�g�Ǘ��I�u�W�F�N�g
		bd = new Board();		// �ՖʃI�u�W�F�N�g
		mv = new MouseEvent();	// �}�E�X���̓I�u�W�F�N�g
		kc = new KeyEvent();	// �L�[�{�[�h���̓I�u�W�F�N�g
		kp = new KeyPopup();	// ���̓p�l���I�u�W�F�N�g
		pc = new Graphic();		// �`��n�I�u�W�F�N�g
		ans = new AnsCheck();	// ���𔻒�I�u�W�F�N�g
		um   = new OperationManager();	// ������Ǘ��I�u�W�F�N�g
		area = new AreaManager();		// ������񓙊Ǘ��I�u�W�F�N�g
		line = new LineManager();		// ���̏��Ǘ��I�u�W�F�N�g

		menu = new Menu();		// ���j���[�������I�u�W�F�N�g
		pp = new Properties();	// ���j���[�֌W�̐ݒ�l��ێ�����I�u�W�F�N�g

		this.doc_design();		// �f�U�C���ύX�֘A�֐��̌Ăяo��

		enc.pzlinput();										// URL����p�Y���̃f�[�^��ǂݏo��
		if(!enc.uri.bstr){ this.resize_canvas();}	// Canvas�̐ݒ�(pzlinput�ŌĂ΂��̂ŁA�����ł͌Ă΂Ȃ�)

		if(!!puz.finalfix){ puz.finalfix();}					// �p�Y���ŗL�̌�t���ݒ�
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
			document.onkeydown  = ee.ebinder(kc, kc.e_keydown);
			document.onkeyup    = ee.ebinder(kc, kc.e_keyup);
			document.onkeypress = ee.ebinder(kc, kc.e_keypress);
			if(g.use.sl){ this.initSilverlight();}

			if(!!menu.ex.reader){
				var DDhandler = function(e){
					menu.ex.reader.readAsText(e.dataTransfer.files[0]);
					e.preventDefault();
					e.stopPropagation();
				}
				window.addEventListener('dragover', function(e){ e.preventDefault();}, true);
				window.addEventListener('drop', DDhandler, true);
			}

			// onBlur�ɃC�x���g�����蓖�Ă�
			document.onblur = ee.ebinder(this, this.onblur_func);
		}
	},
	translationEN : function(){
		var lang = (navigator.browserLanguage ||
					navigator.language        ||
					navigator.userLanguage      ).substr(0,2);
		if(lang!=='ja'){ pp.setVal('language', 1);}
	},

	//---------------------------------------------------------------------------
	// base.initSilverlight() Silverlight�I�u�W�F�N�g�ɃC�x���g�̐ݒ���s��(IE��Silverlight���[�h��)
	// base.e_SLkeydown()     Silverlight�I�u�W�F�N�g�Ƀt�H�[�J�X�����鎞�A�L�[���������ۂ̃C�x���g���ʏ���
	// base.e_SLkeyup()       Silverlight�I�u�W�F�N�g�Ƀt�H�[�J�X�����鎞�A�L�[�𗣂����ۂ̃C�x���g���ʏ���
	//---------------------------------------------------------------------------
	initSilverlight : function(){
		var sender = g.content.findName(g.canvasid);
		sender.AddEventListener("KeyDown", this.e_SLkeydown);
		sender.AddEventListener("KeyUp",   this.e_SLkeyup);
	},
	e_SLkeydown : function(sender, keyEventArgs){
		var emulate = { keyCode : keyEventArgs.platformKeyCode, shiftKey:keyEventArgs.shift, ctrlKey:keyEventArgs.ctrl,
						altKey:false, returnValue:false, preventDefault:f_true };
		return kc.e_keydown(emulate);
	},
	e_SLkeyup : function(sender, keyEventArgs){
		var emulate = { keyCode : keyEventArgs.platformKeyCode, shiftKey:keyEventArgs.shift, ctrlKey:keyEventArgs.ctrl,
						altKey:false, returnValue:false, preventDefault:f_true };
		return kc.e_keyup(emulate);
	},

	//---------------------------------------------------------------------------
	// base.doc_design() onload_func()�ŌĂ΂��Bhtml�Ȃǂ̐ݒ���s��
	// base.postfix()    �e�p�Y���̏������㏈�����Ăяo��
	// base.resetInfo()  AreaInfo���A�Ֆʓǂݍ��ݎ��ɏ��������������Ăяo��
	//---------------------------------------------------------------------------
	// �w�i�摜�Ƃ�title��/html�\���̐ݒ� //
	doc_design : function(){
		_doc.title = this.gettitle();
		ee('title2').el.innerHTML = this.gettitle();

		_doc.body.style.backgroundImage = "url(./bg/"+k.puzzleid+".gif)";
		if(k.br.IE){
			ee('title2').el.style.marginTop = "24px";
			ee('separator1').el.style.margin = '0pt';
			ee('separator2').el.style.margin = '0pt';
		}

		this.postfix();			// �e�p�Y�����Ƃ̐ݒ�(��t����)
		menu.menuinit();
		um.enb_btn();

		// �Ȃ���F5�ōX�V�����true�ɂȂ��Ă�̂ŉ��}���u...
		ee('btnclear') .el.disabled = false;
		ee('btnclear2').el.disabled = false;
	},
	postfix : function(){
		puz.input_init();
		puz.graphic_init();
		puz.encode_init();
		puz.answer_init();
	},
	resetInfo : function(iserase){
		if(iserase){ um.allerase();}
		area.resetArea();
		line.resetLcnts();
	},

	//---------------------------------------------------------------------------
	// base.gettitle()         ���݊J���Ă���^�C�g����Ԃ�
	// base.getPuzzleName()    ���݊J���Ă���p�Y���̖��O��Ԃ�
	// base.setTitle()         �p�Y���̖��O��ݒ肷��
	// base.setExpression()    ��������ݒ肷��
	// base.setFloatbgcolor()  �t���[�g���j���[�̔w�i�F��ݒ肷��
	//---------------------------------------------------------------------------
	gettitle : function(){
		if(k.EDITOR){ return ""+this.getPuzzleName()+(menu.isLangJP()?" �G�f�B�^ - �ς��Ղ�v3":" editor - PUZ-PRE v3");}
		else		{ return ""+this.getPuzzleName()+(menu.isLangJP()?" player - �ς��Ղ�v3"  :" player - PUZ-PRE v3");}
	},
	getPuzzleName : function(){ return (menu.isLangJP()||!this.puzzlename.en)?this.puzzlename.ja:this.puzzlename.en;},
	setTitle      : function(strJP, strEN){ this.puzzlename.ja = strJP; this.puzzlename.en = strEN;},
	setExpression : function(strJP, strEN){ this.expression.ja = strJP; this.expression.en = strEN;},
	setFloatbgcolor : function(color){ this.floatbgcolor = color;},

	//---------------------------------------------------------------------------
	// base.onresize_func()  �E�B���h�E���T�C�Y���ɌĂ΂��֐�
	// base.resize_canvas()  �E�B���h�E��Load/Resize���̏����BCanvas/�\������}�X�ڂ̑傫����ݒ肷��B
	//---------------------------------------------------------------------------
	onresize_func : function(){
		if(this.resizetimer){ clearTimeout(this.resizetimer);}
		this.resizetimer = setTimeout(ee.binder(this, this.resize_canvas),250);
	},
	resize_canvas : function(){
		var wwidth = ee.windowWidth()-6;	//  margin/border������̂ŁA�K���Ɉ����Ă���
		var cols   = (bd.maxbx-bd.minbx)/2+(2*k.def_psize/k.def_csize); // canvas�̉������Z�������ɑ������邩
		var rows   = (bd.maxby-bd.minby)/2+(2*k.def_psize/k.def_csize); // canvas�̏c�����Z�������ɑ������邩

		var cratio = {0:(19/36), 1:0.75, 2:1.0, 3:1.5, 4:3.0}[k.widthmode];
		var cr = {base:cratio,limit:0.40}, ws = {base:0.80,limit:0.96}, ci=[];
		ci[0] = (wwidth*ws.base )/(k.def_csize*cr.base );
		ci[1] = (wwidth*ws.limit)/(k.def_csize*cr.limit);

		var mwidth = wwidth*ws.base-4; // margin/border������̂ŁA�K���Ɉ����Ă���

		// ���ɏk�����K�v�Ȃ��ꍇ
		if(!pp.getVal('adjsize') || cols < ci[0]){
			mwidth = wwidth*ws.base-4;
			k.cwidth = k.cheight = mf(k.def_csize*cr.base);
		}
		// base�`limit�ԂŃT�C�Y���������߂���ꍇ
		else if(cols < ci[1]){
			var ws_tmp = ws.base+(ws.limit-ws.base)*((k.qcols-ci[0])/(ci[1]-ci[0]));
			mwidth = wwidth*ws_tmp-4;
			k.cwidth = k.cheight = mf(mwidth/cols); // �O�g���肬��ɂ���
		}
		// ���������̉����l�𒴂���ꍇ
		else{
			mwidth = wwidth*ws.limit-4;
			k.cwidth = k.cheight = mf(k.def_csize*cr.limit);
		}
		k.bwidth  = k.cwidth/2; k.bheight = k.cheight/2;

		// main�̃T�C�Y�ύX
		ee('main').el.style.width = ''+mf(mwidth)+'px';

		// �Ֆʂ̃Z��ID:0���`�悳���ʒu�̐ݒ�
		k.p0.x = k.p0.y = mf(k.def_psize*(k.cwidth/k.def_csize));
		// extendxell==0�łȂ����͈ʒu�����炷
		if(k.isextendcell!==0){ k.p0.x += k.cwidth; k.p0.y += k.cheight;}

		// Canvas�̃T�C�Y�ύX
		pc.setVectorFunctions();
		g.changeSize(mf(cols*k.cwidth), mf(rows*k.cheight));

		// canvas�̏�ɕ����E�摜��\�����鎞��Offset�w��
		var rect = ee('divques').getRect();
		k.cv_oft.x = rect.left;
		k.cv_oft.y = rect.top;

		kp.resize();
		bd.setcoordAll();
		pc.onresize_process();

		// �ĕ`��
		pc.flushCanvasAll();
		pc.paintAll();
	},

	//---------------------------------------------------------------------------
	// base.onblur_func() �E�B���h�E����t�H�[�J�X�����ꂽ���ɌĂ΂��֐�
	//---------------------------------------------------------------------------
	onblur_func : function(){
		kc.keyreset();
		mv.mousereset();
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
