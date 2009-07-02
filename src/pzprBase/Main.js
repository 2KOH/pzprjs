// Main.js v3.2.0p2

//---------------------------------------------------------------------------
// ��PBase�N���X �ς��Ղ�v3�̃x�[�X�����₻�̑��̏������s��
//---------------------------------------------------------------------------

// PBase�N���X
PBase = function(){
	this.floatbgcolor = "black";
	this.expression   = { ja:'' ,en:''};
	this.puzzlename   = { ja:'' ,en:''};
	this.cv_obj = null;	// HTML�\�[�X��Canvas�������I�u�W�F�N�g
};
PBase.prototype = {
	//---------------------------------------------------------------------------
	// base.preload_func()
	//   ���̃t�@�C�����Ă΂ꂽ�Ƃ��Ɏ��s�����֐� -> onLoad�O�̍ŏ����̐ݒ���s��
	//---------------------------------------------------------------------------
	preload_func : function(){
		// URL�̎擾 -> URL��?�ȉ�����puzzleid����pzlURI���ɕ���(������url_decode()�Ă�ł���)
		enc = new Encode(location.search);
		k.puzzleid = enc.uri.pid;
		if(!k.puzzleid){ location.href = "./";} // �w�肳�ꂽ�p�Y�����Ȃ��ꍇ�͂��悤�Ȃ�`
		if(enc.uri.cols){ k.qcols = enc.uri.cols;}
		if(enc.uri.rows){ k.qrows = enc.uri.rows;}

		// Gears_init.js�̓ǂݍ���
		fio = new FileIO();
		if(fio.choiceDataBase()>0){
			document.writeln("<script type=\"text/javascript\" src=\"src/gears_init.js\"></script>");
		}

		// �p�Y����p�t�@�C���̓ǂݍ���
		document.writeln("<script type=\"text/javascript\" src=\"src/"+k.puzzleid+".js\"></script>");

		// onLoad��onResize�ɓ�������蓖�Ă�
		$(document).ready(this.onload_func.ebind(this));
		$(window).resize(this.resize_canvas.ebind(this));
	},

	//---------------------------------------------------------------------------
	// base.onload_func()
	//   �y�[�W��Load���ꂽ���̏����B�e�N���X�̃I�u�W�F�N�g�ւ̓ǂݍ��ݓ������ݒ���s��
	// base.setEvents()
	//   �}�E�X���́A�L�[���͂̃C�x���g�̐ݒ���s��
	// base.initSilverlight()
	//   Silverlight�I�u�W�F�N�g�ɃC�x���g�̐ݒ���s��(IE��Silverlight���[�h��)
	//---------------------------------------------------------------------------
	onload_func : function(){
		this.initCanvas();

		puz = new Puzzles[k.puzzleid]();	// �p�Y���ŗL�I�u�W�F�N�g
		puz.setting();					// �p�Y���ŗL�̕ϐ��ݒ�(�f�t�H���g��)

		// �N���X������
		bd = new Board();		// �ՖʃI�u�W�F�N�g
		mv = new MouseEvent();	// �}�E�X���̓I�u�W�F�N�g
		kc = new KeyEvent();	// �L�[�{�[�h���̓I�u�W�F�N�g
		kp = new KeyPopup();	// ���̓p�l���I�u�W�F�N�g
		col = new Colors();		// �F�����Ǘ��I�u�W�F�N�g
		pc = new Graphic();		// �`��n�I�u�W�F�N�g
		tc = new TCell();		// �L�[���͂̃^�[�Q�b�g�Ǘ��I�u�W�F�N�g
		ans = new AnsCheck();	// ���𔻒�I�u�W�F�N�g
		um = new UndoManager();	// ������Ǘ��I�u�W�F�N�g
		room = new Rooms();		// �������̃I�u�W�F�N�g
		lang = new LangMgr();	// ������I�u�W�F�N�g
		fio.initDataBase();		// �f�[�^�x�[�X�̐ݒ�
		menu = new Menu();		// ���j���[�������I�u�W�F�N�g
		pp = new Properties();	// ���j���[�֌W�̐ݒ�l��ێ�����I�u�W�F�N�g

		this.doc_design();		// �f�U�C���ύX�֘A�֐��̌Ăяo��

		enc.pzlinput(0);									// URL����p�Y���̃f�[�^��ǂݏo��
		if(!enc.uri.bstr){ this.resize_canvas_onload();}	// Canvas�̐ݒ�(pzlinput�ŌĂ΂��̂ŁA�����ł͌Ă΂Ȃ�)

		if(document.domain=='indi.s58.xrea.com' && k.callmode=='pplay'){ this.accesslog();}	// �A�N�Z�X���O���Ƃ��Ă݂�
		if(k.scriptcheck && debug){ debug.testonly_func();}							// �e�X�g�p

		this.setEvents();	// �C�x���g����������
		tm = new Timer();	// �^�C�}�[�I�u�W�F�N�g�̐����ƃ^�C�}�[�X�^�[�g
	},
	setEvents : function(){
		this.cv_obj.mousedown(mv.e_mousedown.ebind(mv)).mouseup(mv.e_mouseup.ebind(mv)).mousemove(mv.e_mousemove.ebind(mv));
		this.cv_obj.context.oncontextmenu = function(){return false;};	//�Ë��_ 

		$(document).keydown(kc.e_keydown.kcbind()).keyup(kc.e_keyup.kcbind()).keypress(kc.e_keypress.kcbind());
	},
	initSilverlight : function(sender){
		sender.AddEventListener("KeyDown", kc.e_SLkeydown.bind(kc));
		sender.AddEventListener("KeyUp",   kc.e_SLkeyup.bind(kc));
	},
	postfix : function(){
		puz.input_init();
		puz.graphic_init();
		puz.encode_init();
		puz.answer_init();
	},

	//---------------------------------------------------------------------------
	// base.doc_design()       onload_func()�ŌĂ΂��Bhtml�Ȃǂ̐ݒ���s��
	// base.gettitle()         ���݊J���Ă���^�C�g����Ԃ�
	// base.getPuzzleName()    ���݊J���Ă���p�Y���̖��O��Ԃ�
	// base.setTitle()         �p�Y���̖��O��ݒ肷��
	// base.setExpression()    ��������ݒ肷��
	// base.setFloatbgcolor()  �t���[�g���j���[�̔w�i�F��ݒ肷��
	//---------------------------------------------------------------------------
	// �w�i�摜�Ƃ�title��/html�\���̐ݒ� //
	doc_design : function(){
		this.resize_canvas_only();	// Canvas�̃T�C�Y�ݒ�

		document.title = this.gettitle();
		$("#title2").html(this.gettitle());

		$("body").css("background-image","url(../../"+k.puzzleid+"/bg.gif)");
		if(k.br.IE){
			$("#title2").css("margin-top","24px");
			$("hr").each(function(){ $(this).css("margin",'0pt');});
		}

		k.autocheck = (k.callmode!="pmake");
		this.postfix();			// �e�p�Y�����Ƃ̐ݒ�(��t����)
		menu.menuinit();
		um.enb_btn();
	},
	gettitle : function(){
		if(k.callmode=='pmake'){ return ""+this.getPuzzleName()+(lang.isJP()?" �G�f�B�^ - �ς��Ղ�v3":" editor - PUZ-PRE v3");}
		else				   { return ""+this.getPuzzleName()+(lang.isJP()?" player - �ς��Ղ�v3"  :" player - PUZ-PRE v3");}
	},
	getPuzzleName : function(){ return (lang.isJP()||!this.puzzlename.en)?this.puzzlename.ja:this.puzzlename.en;},
	setTitle      : function(strJP, strEN){ this.puzzlename.ja = strJP; this.puzzlename.en = strEN;},
	setExpression : function(strJP, strEN){ this.expression.ja = strJP; this.expression.en = strEN;},
	setFloatbgcolor : function(color){ this.floatbgcolor = color;},

	//---------------------------------------------------------------------------
	// base.initCanvas()           Canvas�̐ݒ���s��
	// base.resize_canvas_only()   �E�B���h�E��Load/Resize���̏����BCanvas/�\������}�X�ڂ̑傫����ݒ肷��B
	// base.resize_canvas()        resize_canvas_only()+Canvas�̍ĕ`��
	// base.resize_canvas_onload() ����������paint�ĕ`�悪�N����Ȃ��悤�ɁAresize_canvas���Ăяo��
	// base.getWindowSize()        �E�B���h�E�̑傫����Ԃ�
	//---------------------------------------------------------------------------
	initCanvas : function(){
		k.IEMargin = (k.br.IE)?(new Pos(4, 4)):(new Pos(0, 0));

		var canvas = document.getElementById('puzzle_canvas');	// Canvas�I�u�W�F�N�g����

		// jQuery���Ɠǂݍ��ݏ��̊֌W��initElement����Ȃ��Ȃ邽�߁AinitElement���Ȃ���
		if(k.br.IE){
			canvas = uuCanvas.init(canvas,!uuMeta.slver);		// uuCanvas�p
//			canvas = uuCanvas.init(canvas,true);				// uuCanvas(����VML���[�h)�p
//			canvas = G_vmlCanvasManager.initElement(canvas);	// excanvas�p
		}
		g = canvas.getContext("2d");

		this.cv_obj = $(canvas).unselectable();
	},
	resize_canvas_only : function(){
		var wsize = this.getWindowSize();
		k.p0 = new Pos(k.def_psize, k.def_psize);

		// �Z���̃T�C�Y�̌���
		var cratio = {0:(19/36), 1:0.75, 2:1.0, 3:1.5, 4:3.0}[k.widthmode];
		var ci0 = Math.round((wsize.x-k.p0.x*2)/(k.def_csize*cratio)*0.75);
		var ci1 = Math.round((wsize.x-k.p0.x*2)/(k.def_csize*cratio));
		var ci2 = Math.round((wsize.x-k.p0.x*2)/(k.def_csize)*2.25);

		if(k.qcols < ci0){				// ���ɏk�����Ȃ��Ƃ�
			k.cwidth = k.cheight = mf(k.def_csize*cratio);
			$("#main").css("width",'80%');
		}
		else if(k.qcols < ci1){			// �E�B���h�E�̕�75%�ɓ���ꍇ �t�H���g�̃T�C�Y��3/4�܂ŏk�߂Ă悢
			k.cwidth = k.cheight = mf(k.def_csize*cratio*(1-0.25*((k.qcols-ci0)/(ci1-ci0))));
			k.p0.x = k.p0.y = mf(k.def_psize*(k.cwidth/k.def_csize));
			$("#main").css("width",'80%');
		}
		else if(k.qcols < ci2){			// main��table���L����Ƃ�
			k.cwidth = k.cheight = mf(k.def_csize*cratio*(0.75-0.35*((k.qcols-ci1)/(ci2-ci1))));
			k.p0.x = k.p0.y = mf(k.def_psize*(k.cwidth/k.def_csize));
			$("#main").css("width",""+(k.p0.x*2+k.qcols*k.cwidth+12)+"px");
		}
		else{							// �W���T�C�Y��40%�ɂ���Ƃ�(���������̉���)
			k.cwidth = k.cheight = mf(k.def_csize*0.4);
			k.p0 = new Pos(k.def_psize*0.4, k.def_psize*0.4);
			$("#main").css("width",'96%');
		}

		// Canvas�̃T�C�Y�ύX
		this.cv_obj.attr("width",  k.p0.x*2 + k.qcols*k.cwidth);
		this.cv_obj.attr("height", k.p0.y*2 + k.qrows*k.cheight);

		// extendxell==1�̎��͏㉺�̊Ԋu���L���� (extendxell==2��def_psize�Œ���)
		if(k.isextendcell==1){
			k.p0.x += mf(k.cwidth*0.45);
			k.p0.y += mf(k.cheight*0.45);
		}

		k.cv_oft.x = this.cv_obj.offset().left;
		k.cv_oft.y = this.cv_obj.offset().top;

		kp.resize();

		pc.onresize_func();

		// jQuery�Ή�:���߂�Canvas���̃T�C�Y��0�ɂȂ�A�`�悳��Ȃ��s��ւ̑Ώ�
		if(g.vml){
			var fc = this.cv_obj.children(":first");
			fc.css("width",  ''+this.cv_obj.attr("clientWidth") + 'px');
			fc.css("height", ''+this.cv_obj.attr("clientHeight") + 'px');
		}
	},
	resize_canvas : function(){
		this.resize_canvas_only();
		pc.flushCanvasAll();
		pc.paintAll();
	},
	resize_canvas_onload : function(){
		if(!k.br.IE || pc.already()){ this.resize_canvas();}
		else{ uuCanvas.ready(this.resize_canvas.bind(this));}
	},
	getWindowSize : function(){
		if(document.all){
			return new Pos(document.body.clientWidth, document.body.clientHeight);
		}
		else if(document.layers || document.getElementById){
			return new Pos(innerWidth, innerHeight);
		}
		return new Pos(0, 0);
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

		$.post("./record.cgi", "pid="+k.puzzleid+"&pzldata="+enc.uri.qdata+"&referer="+refer);
	}
};

base = new PBase();	// onLoad�܂ł̍ŏ����̐ݒ���s��
base.preload_func();
