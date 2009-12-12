// Menu.js v3.2.3p1

//---------------------------------------------------------------------------
// ��Menu�N���X [�t�@�C��]���̃��j���[�̓����ݒ肷��
//---------------------------------------------------------------------------
Caption = function(){
	this.menu     = '';
	this.label    = '';
};
MenuData = function(strJP, strEN){
	this.caption = { ja: strJP, en: strEN};
	this.smenus = [];
};

// ���j���[�`��/�擾/html�\���n
// Menu�N���X
Menu = function(){
	this.dispfloat  = [];			// ���ݕ\�����Ă���t���[�g���j���[�E�B���h�E(�I�u�W�F�N�g)
	this.floatpanel = [];			// (2�i�ڊ܂�)�t���[�g���j���[�I�u�W�F�N�g�̃��X�g
	this.pop        = "";			// ���ݕ\�����Ă���|�b�v�A�b�v�E�B���h�E(�I�u�W�F�N�g)

	this.movingpop  = "";			// �ړ����̃|�b�v�A�b�v���j���[
	this.offset = new Pos(0, 0);	// �|�b�v�A�b�v�E�B���h�E�̍��ォ��̈ʒu

	this.btnstack   = [];			// �{�^���̏��(idname�ƕ�����̃��X�g)
	this.labelstack = [];			// span���̕�����̏��(idname�ƕ�����̃��X�g)

	this.ex = new MenuExec();
	this.language = 'ja';

	// ElementTemplate : ���j���[�̈�
	var menu_funcs = {mouseover : ee.ebinder(this, this.menuhover), mouseout  : ee.ebinder(this, this.menuout)};
	this.EL_MENU  = ee.addTemplate('menupanel','div', {className:'menu'}, {marginRight:'4pt'}, menu_funcs);

	// ElementTemplate : �t���[�g���j���[
	var float_funcs = {mouseout:ee.ebinder(this, this.floatmenuout)};
	this.EL_FLOAT = ee.addTemplate('float_parent','div', {className:'floatmenu'}, {zIndex:101, backgroundColor:base.floatbgcolor}, float_funcs);

	// ElementTemplate : �t���[�g���j���[(���g)
	var smenu_funcs  = {mouseover: ee.ebinder(this, this.submenuhover), mouseout: ee.ebinder(this, this.submenuout), click:ee.ebinder(this, this.submenuclick)};
	var select_funcs = {mouseover: ee.ebinder(this, this.submenuhover), mouseout: ee.ebinder(this, this.submenuout)};
	this.EL_SMENU    = ee.addTemplate('','div' , {className:'smenu'}, null, smenu_funcs);
	this.EL_SELECT   = ee.addTemplate('','div' , {className:'smenu'}, {fontWeight :'900', fontSize:'10pt'}, select_funcs);
	this.EL_SEPARATE = ee.addTemplate('','div' , {className:'smenusep', innerHTML:'&nbsp;'}, null, null);
	this.EL_CHECK    = ee.addTemplate('','div' , {className:'smenu'}, {paddingLeft:'6pt', fontSize:'10pt'}, smenu_funcs);
	this.EL_LABEL    = ee.addTemplate('','span', null, {color:'white'}, null);
	this.EL_CHILD = this.EL_CHECK;

	// ElementTemplate : �Ǘ��̈�
	this.EL_DIVPACK  = ee.addTemplate('','div',  null, null, null);
	this.EL_SPAN     = ee.addTemplate('','span', {unselectable:'on'}, null, null);
	this.EL_CHECKBOX = ee.addTemplate('','input',{type:'checkbox', check:''}, null, {click:ee.ebinder(this, this.checkclick)});
	this.EL_SELCHILD = ee.addTemplate('','div',  {className:'flag',unselectable:'on'}, null, {click:ee.ebinder(this, this.selectclick)});

	// ElementTemplate : �{�^��
	this.EL_BUTTON = ee.addTemplate('','input', {type:'button'}, null, null);
};
Menu.prototype = {
	//---------------------------------------------------------------------------
	// menu.menuinit()   ���j���[�A�T�u���j���[�A�t���[�g���j���[�A�{�^���A
	//                   �Ǘ��̈�A�|�b�v�A�b�v���j���[�̏����ݒ���s��
	// menu.menureset()  ���j���[�p�̐ݒ����������
	//
	// menu.addButtons() �{�^���̏���ϐ��ɓo�^����
	// menu.addLabels()  ���x���̏���ϐ��ɓo�^����
	//---------------------------------------------------------------------------
	menuinit : function(){
		this.menuarea();
		this.managearea();
		this.poparea();

		this.displayAll();
	},

	menureset : function(){
		this.dispfloat  = [];
		this.floatpanel = [];
		this.pop        = "";
		this.btnstack   = [];
		this.labelstack = [];
		this.managestack = [];

		this.popclose();
		this.menuclear();
		this.floatmenuclose(0);

		ee('float_parent').el.innerHTML = '';

		if(!!ee('btncolor2')){ ee('btncolor2').remove();}
		ee('btnarea').removeNextAll(ee('btnclear2').el);

		ee('menupanel') .el.innerHTML = '';
		ee('usepanel')  .el.innerHTML = '';
		ee('checkpanel').el.innerHTML = '';

		pp.reset();
	},

	addButtons : function(el, func, strJP, strEN){
		if(!!func) el.onclick = func;
		ee(el).unselectable();
		this.btnstack.push({el:el, str:{ja:strJP, en:strEN}});
	},
	addLabels  : function(el, strJP, strEN){
		this.labelstack.push({el:el, str:{ja:strJP, en:strEN}});
	},

	//---------------------------------------------------------------------------
	// menu.displayAll() �S�Ẵ��j���[�A�{�^���A���x���ɑ΂��ĕ������ݒ肷��
	// menu.setdisplay() �Ǘ��p�l���ƃT�u���j���[�ɕ\�����镶������ʂɐݒ肷��
	//---------------------------------------------------------------------------
	displayAll : function(){
		for(var i in pp.flags){ this.setdisplay(i);}
		for(var i=0,len=this.btnstack.length;i<len;i++){
			if(!this.btnstack[i].el){ continue;}
			this.btnstack[i].el.value = this.btnstack[i].str[menu.language];
		}
		for(var i=0,len=this.labelstack.length;i<len;i++){
			if(!this.labelstack[i].el){ continue;}
			this.labelstack[i].el.innerHTML = this.labelstack[i].str[menu.language];
		}
	},
	setdisplay : function(idname){
		switch(pp.type(idname)){
		case pp.MENU:
			var menu = ee('ms_'+idname);
			if(!!menu){ menu.el.innerHTML = "["+pp.getMenuStr(idname)+"]";}
			break;

		case pp.SMENU: case pp.LABEL:
			var smenu = ee('ms_'+idname);
			if(!!smenu){ smenu.el.innerHTML = pp.getMenuStr(idname);}
			break;

		case pp.SELECT:
			var smenu = ee('ms_'+idname), label = ee('cl_'+idname);
			if(!!smenu){ smenu.el.innerHTML = "&nbsp;"+pp.getMenuStr(idname);}	// ���j���[��̕\�L�̐ݒ�
			if(!!label){ label.el.innerHTML = pp.getLabel(idname);}			// �Ǘ��̈��̕\�L�̐ݒ�
			for(var i=0,len=pp.flags[idname].child.length;i<len;i++){ this.setdisplay(""+idname+"_"+pp.flags[idname].child[i]);}
			break;

		case pp.CHILD:
			var smenu = ee('ms_'+idname), manage = ee('up_'+idname);
			var issel = (pp.getVal(idname) == pp.getVal(pp.flags[idname].parent));
			var cap = pp.getMenuStr(idname);
			if(!!smenu){ smenu.el.innerHTML = (issel?"+":"&nbsp;")+cap;}	// ���j���[�̍���
			if(!!manage){													// �Ǘ��̈�̍���
				manage.el.innerHTML = cap;
				manage.el.className = (issel?"flagsel":"flag");
			}
			break;

		case pp.CHECK:
			var smenu = ee('ms_'+idname), check = ee('ck_'+idname), label = ee('cl_'+idname);
			var flag = pp.getVal(idname);
			if(!!smenu){ smenu.el.innerHTML = (flag?"+":"&nbsp;")+pp.getMenuStr(idname);}	// ���j���[
			if(!!check){ check.el.checked   = flag;}					// �Ǘ��̈�(�`�F�b�N�{�b�N�X)
			if(!!label){ label.el.innerHTML = pp.getLabel(idname);}		// �Ǘ��̈�(���x��)
			break;
		}
	},

//--------------------------------------------------------------------------------------------------------------

	//---------------------------------------------------------------------------
	// menu.menuarea()   ���j���[�̏����ݒ���s��
	//---------------------------------------------------------------------------
	menuarea : function(){
		var am = ee.binder(pp, pp.addMenu),
			as = ee.binder(pp, pp.addSmenu),
			au = ee.binder(pp, pp.addSelect),
			ac = ee.binder(pp, pp.addCheck),
			aa = ee.binder(pp, pp.addCaption),
			ai = ee.binder(pp, pp.addChild),
			ap = ee.binder(pp, pp.addSeparator),
			sl = ee.binder(pp, pp.setLabel);

		// *�t�@�C�� ==========================================================
		am('file', "�t�@�C��", "File");

		as('newboard', 'file', '�V�K�쐬','New Board');
		as('urlinput', 'file', 'URL����', 'Import from URL');
		as('urloutput','file', 'URL�o��', 'Export URL');
		ap('sep_2', 'file');
		as('fileopen', 'file', '�t�@�C�����J��','Open the file');
		as('filesave', 'file', '�t�@�C���ۑ�',  'Save the file as ...');
		if(!!fio.DBtype){
			as('database', 'file', '�f�[�^�x�[�X�̊Ǘ�', 'Database Management');
		}
		if(k.isKanpenExist && (k.puzzleid!=="nanro" && k.puzzleid!=="ayeheya" && k.puzzleid!=="kurochute")){
			ap('sep_3', 'file');
			as('fileopen2', 'file', 'pencilbox�̃t�@�C�����J��', 'Open the pencilbox file');
			as('filesave2', 'file', 'pencilbox�̃t�@�C����ۑ�', 'Save the pencilbox file as ...');
		}

		// *�ҏW ==============================================================
		am('edit', "�ҏW", "Edit");

		as('adjust', 'edit', '�Ֆʂ̒���', 'Adjust the Board');
		as('turn',   'edit', '���]�E��]', 'Filp/Turn the Board');

		// *�\�� ==============================================================
		am('disp', "�\��", "Display");

		au('size','disp',k.widthmode,[0,1,2,3,4], '�\���T�C�Y','Cell Size');
		ap('sep_4',  'disp');

		if(!!k.irowake){
			ac('irowake','disp',(k.irowake==2?true:false),'���̐F����','Color coding');
			sl('irowake', '���̐F����������', 'Color each lines');
			ap('sep_5', 'disp');
		}
		as('repaint', 'disp', '�Ֆʂ̍ĕ`��', 'Repaint whole board');
		as('manarea', 'disp', '�Ǘ��̈���B��', 'Hide Management Area');

		// *�\�� - �\���T�C�Y -------------------------------------------------
		as('dispsize',    'size','�T�C�Y�w��','Cell Size');
		aa('cap_dispmode','size','�\�����[�h','Display mode');
		ai('size_0', 'size', '�T�C�Y �ɏ�', 'Ex Small');
		ai('size_1', 'size', '�T�C�Y ��',   'Small');
		ai('size_2', 'size', '�T�C�Y �W��', 'Normal');
		ai('size_3', 'size', '�T�C�Y ��',   'Large');
		ai('size_4', 'size', '�T�C�Y ����', 'Ex Large');

		// *�ݒ� ==============================================================
		am('setting', "�ݒ�", "Setting");

		if(k.EDITOR){
			au('mode','setting',(k.editmode?1:3),[1,3],'���[�h', 'mode');
			sl('mode','���[�h', 'mode');
		}

		puz.menufix();	// �e�p�Y�����Ƃ̃��j���[�ǉ�

		ac('autocheck','setting', k.autocheck, '������������', 'Auto Answer Check');
		ac('lrcheck',  'setting', false, '�}�E�X���E���]', 'Mouse button inversion');
		sl('lrcheck', '�}�E�X�̍��E�{�^���𔽓]����', 'Invert button of the mouse');
		if(kp.ctl[1].enable || kp.ctl[3].enable){
			ac('keypopup', 'setting', kp.defaultdisp, '�p�l������', 'Panel inputting');
			sl('keypopup', '�����E�L�����p�l���œ��͂���', 'Input numbers by panel');
		}
		au('language', 'setting', 0,[0,1], '����', 'Language');

		// *�ݒ� - ���[�h -----------------------------------------------------
		ai('mode_1', 'mode', '���쐬���[�h', 'Edit mode'  );
		ai('mode_3', 'mode', '�񓚃��[�h',     'Answer mode');

		// *�ݒ� - ���� -------------------------------------------------------
		ai('language_0', 'language', '���{��',  '���{��');
		ai('language_1', 'language', 'English', 'English');

		// *���̑� ============================================================
		am('other', "���̑�", "Others");

		as('credit',  'other', '�ς��Ղ�v3�ɂ���',   'About PUZ-PRE v3');
		aa('cap_others1', 'other', '�����N', 'Link');
		as('jumpv3',  'other', '�ς��Ղ�v3�̃y�[�W��', 'Jump to PUZ-PRE v3 page');
		as('jumptop', 'other', '�A�����j�ۊǌ�TOP��',  'Jump to indi.s58.xrea.com');
		as('jumpblog','other', '�͂��ϓ��L(blog)��',   'Jump to my blog');
		//sm('eval', '�e�X�g�p', 'for Evaluation');

		this.createAllFloat();
	},

	//---------------------------------------------------------------------------
	// menu.addUseToFlags()       �u������@�v�T�u���j���[�o�^�p���ʊ֐�
	// menu.addRedLineToFlags()   �u���̂Ȃ�����`�F�b�N�v�T�u���j���[�o�^�p���ʊ֐�
	// menu.addRedBlockToFlags()  �u���}�X�̂Ȃ�����`�F�b�N�v�T�u���j���[�o�^�p���ʊ֐�
	// menu.addRedBlockRBToFlags()�u�i�i�����}�X�̂Ȃ�����`�F�b�N�v�T�u���j���[�o�^�p���ʊ֐�
	//---------------------------------------------------------------------------
	addUseToFlags : function(){
		pp.addSelect('use','setting',1,[1,2], '������@', 'Input Type');
		pp.setLabel ('use', '������@', 'Input Type');

		pp.addChild('use_1','use','���E�{�^��','LR Button');
		pp.addChild('use_2','use','1�{�^��',   'One Button');
	},
	addRedLineToFlags : function(){
		pp.addCheck('dispred','setting',false,'�q����`�F�b�N','Continuous Check');
		pp.setLabel('dispred', '���̂Ȃ�����`�F�b�N����', 'Check countinuous lines');
	},
	addRedBlockToFlags : function(){
		pp.addCheck('dispred','setting',false,'�q����`�F�b�N','Continuous Check');
		pp.setLabel('dispred', '���}�X�̂Ȃ�����`�F�b�N����', 'Check countinuous black cells');
	},
	addRedBlockRBToFlags : function(){
		pp.addCheck('dispred','setting',false,'�q����`�F�b�N','Continuous Check');
		pp.setLabel('dispred', '�i�i�����}�X�̂Ȃ�����`�F�b�N����', 'Check countinuous black cells with its corner');
	},

	//---------------------------------------------------------------------------
	// menu.createAllFloat() �o�^���ꂽ�T�u���j���[����S�Ẵt���[�g���j���[���쐬����
	//---------------------------------------------------------------------------
	createAllFloat : function(){
		for(var i=0;i<pp.flaglist.length;i++){
			var id = pp.flaglist[i];
			if(!pp.flags[id]){ continue;}

			var smenuid = 'ms_'+id;
			switch(pp.type(id)){
				case pp.MENU:     smenu = ee.createEL(this.EL_MENU,    smenuid); continue; break;
				case pp.SEPARATE: smenu = ee.createEL(this.EL_SEPARATE,smenuid); break;
				case pp.LABEL:    smenu = ee.createEL(this.EL_LABEL,   smenuid); break;
				case pp.SELECT:   smenu = ee.createEL(this.EL_SELECT,  smenuid); break;
				case pp.SMENU:    smenu = ee.createEL(this.EL_SMENU,   smenuid); break;
				case pp.CHECK:    smenu = ee.createEL(this.EL_CHECK,   smenuid); break;
				case pp.CHILD:    smenu = ee.createEL(this.EL_CHILD,   smenuid); break;
				default: continue; break;
			}

			var parentid = pp.flags[id].parent;
			if(!this.floatpanel[parentid]){
				this.floatpanel[parentid] = ee.createEL(this.EL_FLOAT, 'float_'+parentid);
			}
			this.floatpanel[parentid].appendChild(smenu);
		}

		// 'setting'�����̓Z�p���[�^���ォ��}������
		var el = ee('float_setting').el, fw = el.firstChild.style.fontWeight
		for(var i=1,len=el.childNodes.length;i<len;i++){
			var node = el.childNodes[i];
			if(fw!=node.style.fontWeight){
				ee(ee.createEL(this.EL_SEPARATE,'')).insertBefore(node);
				i++; len++; // �ǉ������̂�1�����Ă���
			}
			fw=node.style.fontWeight;
		}

		// ���̑��̒���
		if(k.PLAYER){
			ee('ms_newboard') .el.className = 'smenunull';
			ee('ms_urloutput').el.className = 'smenunull';
			ee('ms_adjust')   .el.className = 'smenunull';
		}
		ee('ms_jumpv3')  .el.style.fontSize = '10pt'; ee('ms_jumpv3')  .el.style.paddingLeft = '8pt';
		ee('ms_jumptop') .el.style.fontSize = '10pt'; ee('ms_jumptop') .el.style.paddingLeft = '8pt';
		ee('ms_jumpblog').el.style.fontSize = '10pt'; ee('ms_jumpblog').el.style.paddingLeft = '8pt';
	},

	//---------------------------------------------------------------------------
	// menu.menuhover(e) ���j���[�Ƀ}�E�X��������Ƃ��̕\���ݒ���s��
	// menu.menuout(e)   ���j���[����}�E�X���O�ꂽ���̕\���ݒ���s��
	// menu.menuclear()  ���j���[/�T�u���j���[/�t���[�g���j���[��S�đI������Ă��Ȃ���Ԃɖ߂�
	//---------------------------------------------------------------------------
	menuhover : function(e){
		if(!!this.movingpop){ return true;}

		var idname = ee.getSrcElement(e).id.substr(3);
		this.floatmenuopen(e,idname,0);
		ee('menupanel').replaceChildrenClass('menusel','menu');
		ee.getSrcElement(e).className = "menusel";
	},
	menuout   : function(e){
		if(!this.insideOfMenu(e)){
			this.menuclear();
			this.floatmenuclose(0);
		}
	},
	menuclear : function(){
		ee('menupanel').replaceChildrenClass('menusel','menu');
	},

	//---------------------------------------------------------------------------
	// menu.submenuhover(e) �T�u���j���[�Ƀ}�E�X��������Ƃ��̕\���ݒ���s��
	// menu.submenuout(e)   �T�u���j���[����}�E�X���O�ꂽ�Ƃ��̕\���ݒ���s��
	// menu.submenuclick(e) �ʏ�/�I���^/�`�F�b�N�^�T�u���j���[���N���b�N���ꂽ�Ƃ��̓�������s����
	//---------------------------------------------------------------------------
	submenuhover : function(e){
		var idname = ee.getSrcElement(e).id.substr(3);
		if(ee.getSrcElement(e).className==="smenu"){ ee.getSrcElement(e).className="smenusel";}
		if(pp.flags[idname] && pp.type(idname)===pp.SELECT){ this.floatmenuopen(e,idname,this.dispfloat.length);}
	},
	submenuout   : function(e){
		var idname = ee.getSrcElement(e).id.substr(3);
		if(ee.getSrcElement(e).className==="smenusel"){ ee.getSrcElement(e).className="smenu";}
		if(pp.flags[idname] && pp.type(idname)===pp.SELECT){ this.floatmenuout(e);}
	},
	submenuclick : function(e){
		var idname = ee.getSrcElement(e).id.substr(3);
		if(ee.getSrcElement(e).className==="smenunull"){ return;}
		this.menuclear();
		this.floatmenuclose(0);

		switch(pp.type(idname)){
			case pp.SMENU: this.popopen(e, idname); break;
			case pp.CHILD: pp.setVal(pp.flags[idname].parent, pp.getVal(idname)); break;
			case pp.CHECK: pp.setVal(idname, !pp.getVal(idname)); break;
		}
	},

	//---------------------------------------------------------------------------
	// menu.floatmenuopen()  �}�E�X�����j���[���ڏ�ɗ������Ƀt���[�g���j���[��\������
	// menu.floatmenuclose() �t���[�g���j���[��close����
	// menu.floatmenuout(e)  �}�E�X���t���[�g���j���[�𗣂ꂽ���Ƀt���[�g���j���[��close����
	// menu.insideOf()       �C�x���ge���G�������g�͈͓̔��ŋN���������H
	// menu.insideOfMenu()   �}�E�X�����j���[�̈�̒��ɂ��邩���肷��
	//---------------------------------------------------------------------------
	floatmenuopen : function(e, idname, depth){
		if(depth===0){ this.menuclear();}
		this.floatmenuclose(depth);

		if(depth>0 && !this.dispfloat[depth-1]){ return;}

		var rect = ee(ee.getSrcElement(e).id).getRect();
		var _float = this.floatpanel[idname];
		if(depth==0){
			_float.style.left = rect.left - 3 + k.IEMargin.x;
			_float.style.top  = rect.bottom + (k.br.IE?-2:1);
		}
		else{
			_float.style.left = rect.right - 2;
			_float.style.top  = rect.top + (k.br.IE?-5:-2);
		}
		_float.style.zIndex   = 101+depth;
		_float.style.display  = 'inline';

		this.dispfloat.push(_float);
	},
	// �}�E�X�����ꂽ�Ƃ��Ƀt���[�g���j���[���N���[�Y����
	// �t���[�g->���j���[���ɊO�ꂽ���́A�֐��I�������floatmenuopen()���Ă΂��
	floatmenuclose : function(depth){
		for(var i=this.dispfloat.length-1;i>=depth;i--){
			if(i!==0){
				var parentsmenuid = "ms_" + this.dispfloat[i].id.substr(6);
				ee(parentsmenuid).el.className = 'smenu';
			}
			this.dispfloat[i].style.display = 'none';
			this.dispfloat.pop();
		}
	},

	floatmenuout : function(e){
		for(var i=this.dispfloat.length-1;i>=0;i--){
			if(this.insideOf(this.dispfloat[i],e)){
				this.floatmenuclose(i+1);
				return;
			}
		}
		// �����ɗ���̂͂��ׂď�����ꍇ
		this.menuclear();
		this.floatmenuclose(0);
	},

	insideOf : function(el, e){
		var ex = ee.pageX(e);
		var ey = ee.pageY(e);
		var rect = ee(el.id).getRect();
		return (ex>=rect.left && ex<=rect.right && ey>=rect.top && ey<=rect.bottom);
	},
	insideOfMenu : function(e){
		var ex = ee.pageX(e);
		var ey = ee.pageY(e);
		var rect_f = ee('ms_file').getRect(), rect_o = ee('ms_other').getRect();
		return (ex>=rect_f.left && ex<=rect_o.right && ey>=rect_f.top);
	},

//--------------------------------------------------------------------------------------------------------------

	//---------------------------------------------------------------------------
	// menu.managearea()   �Ǘ��̈�̏��������s��(���e�̓T�u���j���[�̂��̂��Q��)
	// menu.checkclick()   �Ǘ��̈�̃`�F�b�N�{�^���������ꂽ�Ƃ��A�`�F�b�N�^�̐ݒ��ݒ肷��
	// menu.selectclick()  �I���^�T�u���j���[���ڂ��N���b�N���ꂽ�Ƃ��̓���
	//---------------------------------------------------------------------------
	managearea : function(){
		// usearea & checkarea
		for(var n=0;n<pp.flaglist.length;n++){
			var idname = pp.flaglist[n];
			if(!pp.flags[idname] || !pp.getLabel(idname)){ continue;}
			var _div = ee(ee.createEL(this.EL_DIVPACK,'div_'+idname));
			//_div.el.innerHTML = "";

			switch(pp.type(idname)){
			case pp.SELECT:
				_div.appendEL(ee.createEL(this.EL_SPAN, 'cl_'+idname));
				_div.appendHTML("&nbsp;|&nbsp;");
				for(var i=0;i<pp.flags[idname].child.length;i++){
					var num = pp.flags[idname].child[i];
					_div.appendEL(ee.createEL(this.EL_SELCHILD, ['up',idname,num].join("_")));
					_div.appendHTML('&nbsp;');
				}
				_div.appendBR();

				ee('usepanel').appendEL(_div.el);
				break;

			case pp.CHECK:
				_div.appendEL(ee.createEL(this.EL_CHECKBOX, 'ck_'+idname));
				_div.appendHTML("&nbsp;");
				_div.appendEL(ee.createEL(this.EL_SPAN, 'cl_'+idname));
				_div.appendBR();

				ee('checkpanel').appendEL(_div.el);
				break;
			}
		}

		// �F�����`�F�b�N�{�b�N�X�p�̏���
		if(k.irowake){
			// ���ɂ����������{�^����ǉ�
			var el = ee.createEL(this.EL_BUTTON, 'ck_btn_irowake');
			this.addButtons(el, ee.binder(menu.ex, menu.ex.irowakeRemake), "�F�������Ȃ���", "Change the color of Line");
			ee('ck_btn_irowake').insertAfter(ee('cl_irowake').el);

			// �F�����̂����ԉ��Ɏ����Ă���
			var el = ee('checkpanel').el.removeChild(ee('div_irowake').el);
			ee('checkpanel').el.appendChild(el);
		}

		// ����ɏo�Ă�����
		ee('translation').unselectable().el.onclick = ee.binder(this, this.translate);
		this.addLabels(ee('translation').el, "English", "���{��");

		// �������̏ꏊ
		ee('expression').el.innerHTML = base.expression.ja;

		// �Ǘ��̈�̕\��/��\���ݒ�
		if(k.EDITOR){
			ee('timerpanel').el.style.display = 'none';
			ee('separator2').el.style.display = 'none';
		}
		if(!!ee('ck_keypopup')){ pp.funcs.keypopup();}

		// (Canvas��) �{�^���̏����ݒ�
		this.addButtons(ee("btncheck").el,  ee.binder(ans, ans.check),             "�`�F�b�N", "Check");
		this.addButtons(ee("btnundo").el,   ee.binder(um, um.undo),                "��",       "<-");
		this.addButtons(ee("btnredo").el,   ee.binder(um, um.redo),                "�i",       "->");
		this.addButtons(ee("btnclear").el,  ee.binder(menu.ex, menu.ex.ACconfirm), "�񓚏���", "Erase Answer");
		this.addButtons(ee("btnclear2").el, ee.binder(menu.ex, menu.ex.ASconfirm), "�⏕����", "Erase Auxiliary Marks");
		if(k.irowake!=0){
			var el = ee.createEL(this.EL_BUTTON, 'btncolor2');
			this.addButtons(el, ee.binder(menu.ex, menu.ex.irowakeRemake), "�F�������Ȃ���", "Change the color of Line");
			ee('btncolor2').insertAfter(ee('btnclear2').el).el.style.display = 'none';
		}
	},

	checkclick : function(e){
		var el = ee.getSrcElement(e);
		var idname = el.id.substr(3);
		pp.setVal(idname, el.checked);
	},
	selectclick : function(e){
		var list = ee.getSrcElement(e).id.split('_');
		pp.setVal(list[1], list[2]);
	},

//--------------------------------------------------------------------------------------------------------------

	//---------------------------------------------------------------------------
	// menu.poparea()       �|�b�v�A�b�v���j���[�̏����ݒ���s��
	//---------------------------------------------------------------------------
	poparea : function(){

		//=====================================================================
		//// �e�^�C�g���o�[�̓���ݒ�
		var pop = ee('popup_parent').el.firstChild;
		while(!!pop){
			var _el = pop.firstChild;
			while(!!_el){
				if(_el.className==='titlebar'){
					this.titlebarfunc(_el);
					break;
				}
				_el = _el.nextSibling;
			}
			pop = pop.nextSibling;
		}
		this.titlebarfunc(ee('credit3_1').el);

		document.onmousemove = ee.ebinder(this,this.titlebarmove);
		document.onmouseup   = ee.ebinder(this,this.titlebarup);

		//=====================================================================
		//// form�{�^���̓���ݒ�E���̑���Caption�ݒ�
		var btn = ee.binder(this, this.addButtons);
		var lab = ee.binder(this, this.addLabels);
		var close = ee.ebinder(this, this.popclose);
		var func = null;

		// �Ֆʂ̐V�K�쐬 -----------------------------------------------------
		func = ee.ebinder(this.ex, this.ex.newboard);
		lab(ee('bar1_1').el,      "�Ֆʂ̐V�K�쐬",         "Createing New Board");
		lab(ee('pop1_1_cap0').el, "�Ֆʂ�V�K�쐬���܂��B", "Create New Board.");
		if(k.puzzleid!=='sudoku' && k.puzzleid!=='tawa'){
			lab(ee('pop1_1_cap1').el, "�悱",                   "Cols");
			lab(ee('pop1_1_cap2').el, "����",                   "Rows");
		}
		btn(document.newboard.newboard, func,  "�V�K�쐬",   "Create");
		btn(document.newboard.cancel,   close, "�L�����Z��", "Cancel");

		// URL���� ------------------------------------------------------------
		func = ee.ebinder(this.ex, this.ex.urlinput);
		lab(ee('bar1_2').el,      "URL����",                     "Import from URL");
		lab(ee('pop1_2_cap0').el, "URL�������ǂݍ��݂܂��B", "Import a question from URL.");
		btn(document.urlinput.urlinput, func,  "�ǂݍ���",   "Import");
		btn(document.urlinput.cancel,   close, "�L�����Z��", "Cancel");

		// URL�o�� ------------------------------------------------------------
		func = ee.ebinder(this.ex, this.ex.urloutput);
		lab(ee('bar1_3').el, "URL�o��", "Export URL");
		var btt = function(name, strJP, strEN, eval){
			if(eval===false){ return;}
			var el = ee.createEL(menu.EL_BUTTON,''); el.name = name;
			ee('urlbuttonarea').appendEL(el).appendBR();
			btn(el, func, strJP, strEN);
		};
		btt('pzprv3',     "�ς��Ղ�v3��URL���o�͂���",           "Output PUZ-PRE v3 URL",          true);
		btt('pzprapplet', "�ς��Ղ�(�A�v���b�g)��URL���o�͂���", "Output PUZ-PRE(JavaApplet) URL", !k.ispzprv3ONLY);
		btt('kanpen',     "�J���y����URL���o�͂���",             "Output Kanpen URL",              !!k.isKanpenExist);
		btt('heyaapp',    "�ւ�킯�A�v���b�g��URL���o�͂���",   "Output Heyawake-Applet URL",     (k.puzzleid==="heyawake"));
		btt('pzprv3edit', "�ς��Ղ�v3�̍ĕҏW�pURL���o�͂���",   "Output PUZ-PRE v3 Re-Edit URL",  true);
		ee("urlbuttonarea").appendBR();
		func = ee.ebinder(this.ex, this.ex.openurl);
		btn(document.urloutput.openurl, func,  "����URL���J��", "Open this URL on another window/tab");
		btn(document.urloutput.close,   close, "����", "Close");

		// �t�@�C������ -------------------------------------------------------
		func = ee.ebinder(this.ex, this.ex.fileopen);
		lab(ee('bar1_4').el,      "�t�@�C�����J��", "Open file");
		lab(ee('pop1_4_cap0').el, "�t�@�C���I��",   "Choose file");
		document.fileform.filebox.onchange = func;
		btn(document.fileform.close,    close, "����",     "Close");

		// �f�[�^�x�[�X���J�� -------------------------------------------------
		func = ee.ebinder(fio, fio.clickHandler);
		lab(ee('bar1_8').el, "�f�[�^�x�[�X�̊Ǘ�", "Database Management");
		document.database.sorts   .onchange = func;
		document.database.datalist.onchange = func;
		document.database.tableup .onclick  = func;
		document.database.tabledn .onclick  = func;
		btn(document.database.open,     func,  "�f�[�^��ǂݍ���",   "Load");
		btn(document.database.save,     func,  "�Ֆʂ�ۑ�",         "Save");
		lab(ee('pop1_8_com').el, "�R�����g:", "Comment:");
		btn(document.database.comedit,  func,  "�R�����g��ҏW����", "Edit Comment");
		btn(document.database.difedit,  func,  "��Փx��ݒ肷��",   "Set difficulty");
		btn(document.database.del,      func,  "�폜",               "Delete");
		btn(document.database.close,    close, "����",             "Close");

		// �Ֆʂ̒��� ---------------------------------------------------------
		func = ee.ebinder(this.ex, this.ex.popupadjust);
		lab(ee('bar2_1').el,      "�Ֆʂ̒���",             "Adjust the board");
		lab(ee('pop2_1_cap0').el, "�Ֆʂ̒������s���܂��B", "Adjust the board.");
		lab(ee('pop2_1_cap1').el, "�g��",  "Expand");
		btn(document.adjust.expandup,   func,  "��",     "UP");
		btn(document.adjust.expanddn,   func,  "��",     "Down");
		btn(document.adjust.expandlt,   func,  "��",     "Left");
		btn(document.adjust.expandrt,   func,  "�E",     "Right");
		lab(ee('pop2_1_cap2').el, "�k��", "Reduce");
		btn(document.adjust.reduceup,   func,  "��",     "UP");
		btn(document.adjust.reducedn,   func,  "��",     "Down");
		btn(document.adjust.reducelt,   func,  "��",     "Left");
		btn(document.adjust.reducert,   func,  "�E",     "Right");
		btn(document.adjust.close,      close, "����", "Close");

		// ���]�E��] ---------------------------------------------------------
		lab(ee('bar2_2').el,      "���]�E��]",                  "Flip/Turn the board");
		lab(ee('pop2_2_cap0').el, "�Ֆʂ̉�]�E���]���s���܂��B","Flip/Turn the board.");
		btn(document.flip.turnl,  func,  "��90����]", "Turn left by 90 degree");
		btn(document.flip.turnr,  func,  "�E90����]", "Turn right by 90 degree");
		btn(document.flip.flipy,  func,  "�㉺���]",   "Flip upside down");
		btn(document.flip.flipx,  func,  "���E���]",   "Flip leftside right");
		btn(document.flip.close,  close, "����",     "Close");

		// credit -------------------------------------------------------------
		lab(ee('bar3_1').el,   "credit", "credit");
		lab(ee('credit3_1').el,"�ς��Ղ�v3 "+pzprversion+"<br>\n<br>\n�ς��Ղ�v3�� �͂���/�A�����j���쐬���Ă��܂��B<br>\n���C�u�����Ƃ���uuCanvas1.0, Google Gears���g�p���Ă��܂��B<br>\n<br>\n",
							   "PUZ-PRE v3 "+pzprversion+"<br>\n<br>\nPUZ-PRE v3 id made by happa.<br>\nThis script use uuCanvas1.0 and Google Gears as libraries.&nbsp;<br>\n<br>\n");
		btn(document.credit.close,  close, "����", "OK");

		// �\���T�C�Y ---------------------------------------------------------
		func = ee.ebinder(this, this.ex.dispsize);
		lab(ee('bar4_1').el,      "�\���T�C�Y�̕ύX",         "Change size");
		lab(ee('pop4_1_cap0').el, "�\���T�C�Y��ύX���܂��B", "Change the display size.");
		lab(ee('pop4_1_cap1').el, "�\���T�C�Y",               "Display size");
		btn(document.dispsize.dispsize, func,  "�ύX����",   "Change");
		btn(document.dispsize.cancel,   close, "�L�����Z��", "Cancel");
	},

	//---------------------------------------------------------------------------
	// menu.popopen()  �|�b�v�A�b�v���j���[���J��
	// menu.popclose() �|�b�v�A�b�v���j���[�����
	//---------------------------------------------------------------------------
	popopen : function(e, idname){
		// �\�����Ă���E�B���h�E������ꍇ�͕���
		this.popclose();

		// ���̒���menu.pop���ݒ肳��܂��B
		if(pp.funcs[idname]){ pp.funcs[idname]();}

		// �|�b�v�A�b�v���j���[��\������
		if(this.pop){
			var _pop = this.pop.el;
			_pop.style.left = ee.pageX(e) - 8 + k.IEMargin.x;
			_pop.style.top  = ee.pageY(e) - 8 + k.IEMargin.y;
			_pop.style.display = 'inline';
		}
	},
	popclose : function(){
		if(this.pop){
			this.pop.el.style.display = "none";
			this.pop = '';
			this.menuclear();
			this.movingpop = "";
			k.enableKey = true;
		}
	},

	//---------------------------------------------------------------------------
	// menu.titlebarfunc()  ����4�̃C�x���g���C�x���g�n���h���ɂ�������
	// menu.titlebardown()  �^�C�g���o�[���N���b�N�����Ƃ��̓�����s��(�^�C�g���o�[��bind)
	// menu.titlebarup()    �^�C�g���o�[�Ń{�^���𗣂����Ƃ��̓�����s��(document��bind)
	// menu.titlebarmove()  �^�C�g���o�[����}�E�X�𓮂������Ƃ��|�b�v�A�b�v���j���[�𓮂���(document��bind)
	//---------------------------------------------------------------------------
	titlebarfunc : function(bar){
		bar.onmousedown = ee.ebinder(this, this.titlebardown);
		ee(bar).unselectable().el;
	},

	titlebardown : function(e){
		var pop = ee.getSrcElement(e).parentNode;
		this.movingpop = pop;
		this.offset.x = ee.pageX(e) - parseInt(pop.style.left);
		this.offset.y = ee.pageY(e) - parseInt(pop.style.top);
	},
	titlebarup : function(e){
		var pop = this.movingpop;
		if(!!pop){
			this.movingpop = "";
		}
	},
	titlebarmove : function(e){
		var pop = this.movingpop;
		if(!!pop){
			pop.style.left = ee.pageX(e) - this.offset.x;
			pop.style.top  = ee.pageY(e) - this.offset.y;
		}
	},

//--------------------------------------------------------------------------------------------------------------

	//--------------------------------------------------------------------------------
	// menu.isLangJP()  ���ꃂ�[�h����{��ɂ���
	// menu.isLangEN()  ���ꃂ�[�h���p��ɂ���
	//--------------------------------------------------------------------------------
	isLangJP : function(){ return this.language == 'ja';},
	isLangEN : function(){ return this.language == 'en';},

	//--------------------------------------------------------------------------------
	// menu.setLang()   �����ݒ肷��
	// menu.translate() html�̌����ς���
	//--------------------------------------------------------------------------------
	setLang : function(ln){ (ln=='ja')       ?this.setLangJP():this.setLangEN();},
	translate : function(){ (this.isLangJP())?this.setLangEN():this.setLangJP();},

	//--------------------------------------------------------------------------------
	// menu.setLangJP()  ���͂���{��ɂ���
	// menu.setLangEN()  ���͂��p��ɂ���
	// menu.setLangStr() ���͂�ݒ肷��
	//--------------------------------------------------------------------------------
	setLangJP : function(){ this.setLangStr('ja');},
	setLangEN : function(){ this.setLangStr('en');},
	setLangStr : function(ln){
		this.language = ln;
		document.title = base.gettitle();
		ee('title2').el.innerHTML = base.gettitle();
		ee('expression').el.innerHTML = base.expression[this.language];

		this.displayAll();
		this.ex.dispmanstr();

		base.resize_canvas();
	}
};

//--------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------
// ��Properties�N���X �ݒ�l�̒l�Ȃǂ�ێ�����
//---------------------------------------------------------------------------
SSData = function(){
	this.id     = '';
	this.type   = 0;
	this.val    = 1;
	this.parent = 1;
	this.child  = [];

	this.str    = { ja: new Caption(), en: new Caption()};
	//this.func   = null;
};
Properties = function(){
	this.flags    = [];	// �T�u���j���[���ڂ̏��(SSData�N���X�̃I�u�W�F�N�g�̔z��ɂȂ�)
	this.flaglist = [];	// idname�̔z��

	// const
	this.MENU     = 6;
	this.SMENU    = 0;
	this.SELECT   = 1;
	this.CHECK    = 2;
	this.LABEL    = 3;
	this.CHILD    = 4;
	this.SEPARATE = 5;
};
Properties.prototype = {
	reset : function(){
		this.flags    = [];
		this.flaglist = [];
	},

	//---------------------------------------------------------------------------
	// pp.addMenu()      ���j���[�ŏ�ʂ̏���o�^����
	// pp.addSmenu()     Popup���j���[���J���T�u���j���[���ڂ�o�^����
	// pp.addCaption()   Caption�Ƃ��Ďg�p����T�u���j���[���ڂ�o�^����
	// pp.addSeparator() �Z�p���[�^�Ƃ��Ďg�p����T�u���j���[���ڂ�o�^����
	// pp.addCheck()     �I���^�T�u���j���[���ڂɕ\�����镶�����ݒ肷��
	// pp.addSelect()    �`�F�b�N�^�T�u���j���[���ڂɕ\�����镶�����ݒ肷��
	// pp.addChild()     �`�F�b�N�^�T�u���j���[���ڂ̎q�v�f��ݒ肷��
	//---------------------------------------------------------------------------
	addMenu : function(idname, strJP, strEN){
		this.addFlags(idname, '', this.MENU, 0, strJP, strEN);
	},

	addSmenu : function(idname, parent, strJP, strEN){
		this.addFlags(idname, parent, this.SMENU, 0, strJP, strEN);
	},

	addCaption : function(idname, parent, strJP, strEN){
		this.addFlags(idname, parent, this.LABEL, 0, strJP, strEN);
	},
	addSeparator : function(idname, parent){
		this.addFlags(idname, parent, this.SEPARATE, 0, '', '');
	},

	addCheck : function(idname, parent, first, strJP, strEN){
		this.addFlags(idname, parent, this.CHECK, first, strJP, strEN);
	},
	addSelect : function(idname, parent, first, child, strJP, strEN){
		this.addFlags(idname, parent, this.SELECT, first, strJP, strEN);
		this.flags[idname].child = child;
	},
	addChild : function(idname, parent, strJP, strEN){
		var list = idname.split("_");
		this.addFlags(idname, list[0], this.CHILD, list[1], strJP, strEN);
	},

	//---------------------------------------------------------------------------
	// pp.addFlags()  ��L�֐��̓������ʏ���
	// pp.setLabel()  �Ǘ��̈�ɕ\�L���郉�x���������ݒ肷��
	//---------------------------------------------------------------------------
	addFlags : function(idname, parent, type, first, strJP, strEN){
		this.flags[idname] = new SSData();
		this.flags[idname].id     = idname;
		this.flags[idname].type   = type;
		this.flags[idname].val    = first;
		this.flags[idname].parent = parent;
		this.flags[idname].str.ja.menu = strJP;
		this.flags[idname].str.en.menu = strEN;
		this.flaglist.push(idname);
	},

	setLabel : function(idname, strJP, strEN){
		if(!this.flags[idname]){ return;}
		this.flags[idname].str.ja.label = strJP;
		this.flags[idname].str.en.label = strEN;
	},

	//---------------------------------------------------------------------------
	// pp.getMenuStr() �Ǘ��p�l���ƑI���^/�`�F�b�N�^�T�u���j���[�ɕ\�����镶�����Ԃ�
	// pp.getLabel()   �Ǘ��p�l���ƃ`�F�b�N�^�T�u���j���[�ɕ\�����镶�����Ԃ�
	// pp.type()       �ݒ�l�̃T�u���j���[�^�C�v��Ԃ�
	// pp.istype()     �ݒ�l�̃T�u���j���[�^�C�v���w�肳�ꂽ�l���ǂ�����Ԃ�
	//
	// pp.getVal()     �e�t���O��val�̒l��Ԃ�
	// pp.setVal()     �e�t���O�̐ݒ�l��ݒ肷��
	//---------------------------------------------------------------------------
	getMenuStr : function(idname){ return this.flags[idname].str[menu.language].menu; },
	getLabel   : function(idname){ return this.flags[idname].str[menu.language].label;},
	type   : function(idname)     { return this.flags[idname].type;},
	istype : function(idname,type){ return (this.flags[idname].type===type);},

	getVal : function(idname)  { return this.flags[idname]?this.flags[idname].val:0;},
	setVal : function(idname, newval){
		if(!this.flags[idname]){ return;}
		else if(this.flags[idname].type===this.CHECK || this.flags[idname].type===this.SELECT){
			this.flags[idname].val = newval;
			menu.setdisplay(idname);
			if(this.funcs[idname]){ this.funcs[idname](newval);}
		}
	},

//--------------------------------------------------------------------------------------------------------------
	// submenu����Ăяo�����֐�����
	funcs : {
		urlinput  : function(){ menu.pop = ee("pop1_2");},
		urloutput : function(){ menu.pop = ee("pop1_3"); document.urloutput.ta.value = "";},
		filesave  : function(){ menu.ex.filesave(1);},
		database  : function(){ menu.pop = ee("pop1_8"); fio.getDataTableList();},
		filesave2 : function(){ if(fio.kanpenSave){ menu.ex.filesave(2);}},
		adjust    : function(){ menu.pop = ee("pop2_1");},
		turn      : function(){ menu.pop = ee("pop2_2");},
		credit    : function(){ menu.pop = ee("pop3_1");},
		jumpv3    : function(){ window.open('./', '', '');},
		jumptop   : function(){ window.open('../../', '', '');},
		jumpblog  : function(){ window.open('http://d.hatena.ne.jp/sunanekoroom/', '', '');},
		irowake   : function(){ pc.paintAll();},
		manarea   : function(){ menu.ex.dispman();},
		autocheck : function(val){ k.autocheck = !k.autocheck;},
		mode      : function(num){ menu.ex.modechange(num);},
		size      : function(num){ k.widthmode=num; base.resize_canvas();},
		repaint   : function(num){ base.resize_canvas();},
		use       : function(num){ k.use =num;},
		language  : function(num){ menu.setLang({0:'ja',1:'en'}[num]);},

		newboard : function(){
			menu.pop = ee("pop1_1");
			if(k.puzzleid!="sudoku"){
				document.newboard.col.value = k.qcols;
				document.newboard.row.value = k.qrows;
			}
			k.enableKey = false;
		},
		fileopen : function(){
			document.fileform.pencilbox.value = "0";
			if(k.br.IE || k.br.Gecko || k.br.Opera){ if(!menu.pop){ menu.pop = ee("pop1_4");}}
			else{ if(!menu.pop){ document.fileform.filebox.click();}}
		},
		fileopen2 : function(){
			if(!fio.kanpenOpen){ return;}
			document.fileform.pencilbox.value = "1";
			if(k.br.IE || k.br.Gecko || k.br.Opera){ if(!menu.pop){ menu.pop = ee("pop1_4");}}
			else{ if(!menu.pop){ document.fileform.filebox.click();}}
		},
		dispsize : function(){
			menu.pop = ee("pop4_1");
			document.dispsize.cs.value = k.def_csize;
			k.enableKey = false;
		},
		keypopup : function(){
			var f = kp.ctl[pp.flags['mode'].val].enable;
			ee('ck_keypopup').el.disabled    = (f?"":"true");
			ee('cl_keypopup').el.style.color = (f?"black":"silver");
		}
	}
};
