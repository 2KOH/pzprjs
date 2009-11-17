// Menu.js v3.2.3

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

	this.isptitle   = 0;			// �^�C�g���o�[��������Ă��邩
	this.offset = new Pos(0, 0);	// �|�b�v�A�b�v�E�B���h�E�̍��ォ��̈ʒu

	this.btnstack   = [];			// �{�^���̏��(idname�ƕ�����̃��X�g)
	this.labelstack = [];			// span���̕�����̏��(idname�ƕ�����̃��X�g)

	this.ex = new MenuExec();
	this.language = 'ja';
};
Menu.prototype = {
	//---------------------------------------------------------------------------
	// menu.menuinit()      ���j���[�A�{�^���A�T�u���j���[�A�t���[�g���j���[�A
	//                      �|�b�v�A�b�v���j���[�̏����ݒ���s��
	// menu.menureset()     ���j���[�p�̐ݒ����������
	//---------------------------------------------------------------------------
	menuinit : function(){
		this.buttonarea();
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

		this.popclose();
		this.menuclear();
		this.floatmenuclose(0);

		getEL("float_parent").innerHTML;

		if(!!getEL("btncolor2")){ getEL('btnarea').removeChild(getEL('btncolor2'));}
		$("#btnclear2").nextAll().remove();
		$("#outbtnarea").remove();

		getEL('menupanel') .innerHTML = '';
		getEL('usepanel')  .innerHTML = '';
		getEL('checkpanel').innerHTML = '';

		pp.reset();
	},

	//---------------------------------------------------------------------------
	// menu.menuarea()   ���j���[�̏����ݒ���s��
	// menu.addMenu()    ���j���[�̏���ϐ��ɓo�^����
	// menu.menuhover(e) ���j���[�Ƀ}�E�X��������Ƃ��̕\���ݒ���s��
	// menu.menuout(e)   ���j���[����}�E�X���O�ꂽ���̕\���ݒ���s��
	// menu.menuclear()  ���j���[/�T�u���j���[/�t���[�g���j���[��S�đI������Ă��Ȃ���Ԃɖ߂�
	//---------------------------------------------------------------------------
	menuarea : function(){
		this.addMenu('file', "�t�@�C��", "File");
		this.addMenu('edit', "�ҏW", "Edit");
		this.addMenu('disp', "�\��", "Display");
		this.addMenu('setting', "�ݒ�", "Setting");
		this.addMenu('other', "���̑�", "Others");

		pp.setDefaultFlags();
		this.createFloats();

		getEL("expression").innerHTML = base.expression.ja;
		if(k.PLAYER){
			getEL('ms_newboard').className = 'smenunull';
			getEL('ms_urloutput').className = 'smenunull';
			getEL('ms_adjust').className = 'smenunull';
		}
		getEL('ms_jumpv3')  .style.fontSize = '10pt'; getEL('ms_jumpv3')  .style.paddingLeft = '8pt';
		getEL('ms_jumptop') .style.fontSize = '10pt'; getEL('ms_jumptop') .style.paddingLeft = '8pt';
		getEL('ms_jumpblog').style.fontSize = '10pt'; getEL('ms_jumpblog').style.paddingLeft = '8pt';
	},

	addMenu : function(idname, strJP, strEN){
		var el = ee.newEL('div');
		el.className = 'menu';
		el.id        = 'menu_'+idname;
		el.innerHTML = "["+strJP+"]";
		el.style.marginRight = "4pt";
		el.onmouseover = ee.ebinder(this, this.menuhover, [idname]);
		el.onmouseout  = ee.ebinder(this, this.menuout);
		getEL('menupanel').appendChild(el);

		this.addLabels(el, "["+strJP+"]", "["+strEN+"]");
	},
	menuhover : function(e, idname){
		this.floatmenuopen(e,idname,0);
		$("div.menusel").attr("class", "menu");
		ee.getSrcElement(e).className = "menusel";
	},
	menuout   : function(e){
		if(!this.insideOfMenu(e)){
			this.menuclear();
			this.floatmenuclose(0);
		}
	},
	menuclear : function(){
		$("div.menusel").attr("class", "menu");
	},

	//---------------------------------------------------------------------------
	// menu.submenuhover(e) �T�u���j���[�Ƀ}�E�X��������Ƃ��̕\���ݒ���s��
	// menu.submenuout(e)   �T�u���j���[����}�E�X���O�ꂽ�Ƃ��̕\���ݒ���s��
	// menu.submenuclick(e) �ʏ�/�I���^/�`�F�b�N�^�T�u���j���[���N���b�N���ꂽ�Ƃ��̓�������s����
	// menu.checkclick()    �Ǘ��̈�̃`�F�b�N�{�^���������ꂽ�Ƃ��A�`�F�b�N�^�̐ݒ��ݒ肷��
	//---------------------------------------------------------------------------
	submenuhover : function(e, idname){
		if(ee.getSrcElement(e).className==="smenu"){ ee.getSrcElement(e).className="smenusel";}
		if(pp.flags[idname] && pp.istype(idname, pp.SELECT)){ this.floatmenuopen(e,idname,this.dispfloat.length);}
	},
	submenuout   : function(e, idname){
		if(ee.getSrcElement(e).className==="smenusel"){ ee.getSrcElement(e).className="smenu";}
		if(pp.flags[idname] && pp.istype(idname, pp.SELECT)){ this.floatmenuout(e);}
	},
	submenuclick : function(e, idname){
		if(ee.getSrcElement(e).className==="smenunull"){ return;}
		this.menuclear();
		this.floatmenuclose(0);

		if(pp.istype(idname, pp.SMENU)){
			this.popclose();							// �\�����Ă���E�B���h�E������ꍇ�͕���
			if(pp.funcs[idname]){ pp.funcs[idname]();}	// ���̒���this.popupenu���ݒ肳��܂��B
			if(this.pop){
				var _pop = this.pop;
				_pop.style.left = mv.pointerX(e) - 8 + k.IEMargin.x;
				_pop.style.top  = mv.pointerY(e) - 8 + k.IEMargin.y;
				_pop.style.display = 'inline';
			}
		}
		else if(pp.istype(idname, pp.CHILD)){ this.setVal(pp.flags[idname].parent, pp.getVal(idname));}
		else if(pp.istype(idname, pp.CHECK)){ this.setVal(idname, !pp.getVal(idname));}
	},
	checkclick : function(idname){
		this.setVal(idname, getEL("ck_"+idname).checked);
	},

	//---------------------------------------------------------------------------
	// menu.floatmenuopen()  �}�E�X�����j���[���ڏ�ɗ������Ƀt���[�g���j���[��\������
	// menu.floatmenuclose() �t���[�g���j���[��close����
	// menu.floatmenuout(e)  �}�E�X���t���[�g���j���[�𗣂ꂽ���Ƀt���[�g���j���[��close����
	// menu.insideOf()       �C�x���ge��jQuery�I�u�W�F�N�gjqobj�͈͓̔��ŋN���������H
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
				getEL(parentsmenuid).className = 'smenu';
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
		var ex = mv.pointerX(e)+(k.br.WinWebKit?1:0);
		var ey = mv.pointerY(e)+(k.br.WinWebKit?1:0);
		var rect = ee(el.id).getRect();
		return (ex>=rect.left && ex<=rect.right && ey>=rect.top && ey<=rect.bottom);
	},
	insideOfMenu : function(e){
		var ex = mv.pointerX(e)+(k.br.WinWebKit?1:0);
		var ey = mv.pointerY(e)+(k.br.WinWebKit?1:0);
		var rect_f = ee('menu_file').getRect(), rect_o = ee('menu_other').getRect();
		return (ex>=rect_f.left && ex<=rect_o.right && ey>=rect_f.top);
	},
	//---------------------------------------------------------------------------
	// menu.getTop()         �v�f�̏���W���擾����
	// menu.getBottom()      �v�f�̉����W���擾����
	// menu.getLeft()        �v�f�̍����W���擾����
	// menu.getRight()       �v�f�̉E���W���擾����
	// menu.getWidth()       �v�f�̉������擾����
	// menu.getHeight()      �v�f�̏c�����擾����
	//---------------------------------------------------------------------------
	getTop    : function(el){
		var _html = _doc.documentElement, _body = _doc.body;
		return el.getBoundingClientRect().top + ((_body.scrollTop || _html.scrollTop) - _html.clientTop);
	},
	getBottom : function(el){
		var _html = _doc.documentElement, _body = _doc.body;
		return el.getBoundingClientRect().top + ((_body.scrollTop || _html.scrollTop) - _html.clientTop) + el.offsetHeight;
	},
	getLeft   : function(el){
		var _html = document.documentElement, _body = _doc.body;
		return el.getBoundingClientRect().left + ((_body.scrollLeft || _html.scrollLeft) - _html.clientLeft);
	},
	getRight  : function(el){
		var _html = document.documentElement, _body = _doc.body;
		return el.getBoundingClientRect().left + ((_body.scrollLeft || _html.scrollLeft) - _html.clientLeft) + el.offsetWidth;
	},
	getWidth  : function(el){ return el.offsetWidth;},
	getHeight : function(el){ return el.offsetHeight;},

	//---------------------------------------------------------------------------
	// menu.addUseToFlags()      �u������@�v�T�u���j���[�o�^�p���ʊ֐�
	// menu.addRedLineToFlags()  �u���̂Ȃ�����`�F�b�N�v�T�u���j���[�o�^�p���ʊ֐�
	// menu.addRedBlockToFlags() �u���}�X�̂Ȃ�����`�F�b�N�v�T�u���j���[�o�^�p���ʊ֐�
	//---------------------------------------------------------------------------
	// menu�o�^�p�̊֐�
	addUseToFlags : function(){
		pp.addUseToFlags('use','setting',1,[1,2]);
		pp.setMenuStr('use', '������@', 'Input Type');
		pp.setLabel  ('use', '������@', 'Input Type');

		pp.addUseChildrenToFlags('use','use');
		pp.setMenuStr('use_1', '���E�{�^��', 'LR Button');
		pp.setMenuStr('use_2', '1�{�^��', 'One Button');
	},
	addRedLineToFlags : function(){
		pp.addCheckToFlags('dispred','setting',false);
		pp.setMenuStr('dispred', '�q����`�F�b�N', 'Continuous Check');
		pp.setLabel  ('dispred', '���̂Ȃ�����`�F�b�N����', 'Check countinuous lines');
	},
	addRedBlockToFlags : function(){
		pp.addCheckToFlags('dispred','setting',false);
		pp.setMenuStr('dispred', '�q����`�F�b�N', 'Continuous Check');
		pp.setLabel  ('dispred', '���}�X�̂Ȃ�����`�F�b�N����', 'Check countinuous black cells');
	},
	addRedBlockRBToFlags : function(){
		pp.addCheckToFlags('dispred','setting',false);
		pp.setMenuStr('dispred', '�q����`�F�b�N', 'Continuous Check');
		pp.setLabel  ('dispred', '�i�i�����}�X�̂Ȃ�����`�F�b�N����', 'Check countinuous black cells with its corner');
	},

	//---------------------------------------------------------------------------
	// menu.getVal()     �e�t���O��val�̒l��Ԃ�
	// menu.setVal()     �e�t���O�̐ݒ�l��ݒ肷��
	// menu.setdisplay() �Ǘ��p�l���ƃT�u���j���[�ɕ\�����镶�����ݒ肷��
	// menu.displayAll() �S�Ẵ��j���[�A�{�^���A���x���ɑ΂��ĕ������ݒ肷��
	//---------------------------------------------------------------------------
	getVal : function(idname)  { return pp.getVal(idname);},
	setVal : function(idname, newval){ pp.setVal(idname,newval);},
	setdisplay : function(idname){
		if(pp.istype(idname, pp.SMENU)||pp.istype(idname, pp.LABEL)){
			if(getEL("ms_"+idname)){ getEL("ms_"+idname).innerHTML = pp.getMenuStr(idname);}
		}
		else if(pp.istype(idname, pp.SELECT)){
			if(getEL("ms_"+idname)){ getEL("ms_"+idname).innerHTML = "&nbsp;"+pp.getMenuStr(idname);}	// ���j���[��̕\�L�̐ݒ�
			if(getEL("cl_"+idname)){ getEL("cl_"+idname).innerHTML = pp.getLabel(idname);}				// �Ǘ��̈��̕\�L�̐ݒ�
			for(var i=0,len=pp.flags[idname].child.length;i<len;i++){ this.setdisplay(""+idname+"_"+pp.flags[idname].child[i]);}
		}
		else if(pp.istype(idname, pp.CHILD)){
			var issel = (pp.getVal(idname) == pp.getVal(pp.flags[idname].parent));
			var cap = pp.getMenuStr(idname);
			if(getEL("ms_"+idname)){ getEL("ms_"+idname).innerHTML = (issel?"+":"&nbsp;")+cap;}	// ���j���[�̍���
			if(getEL("up_"+idname)){															// �Ǘ��̈�̍���
				getEL("up_"+idname).innerHTML = cap;
				getEL("up_"+idname).className = (issel?"flagsel":"flag");
			}
		}
		else if(pp.istype(idname, pp.CHECK)){
			var flag = pp.getVal(idname);
			if(getEL("ms_"+idname)){ getEL("ms_"+idname).innerHTML = (flag?"+":"&nbsp;")+pp.getMenuStr(idname);}	// ���j���[
			if(getEL("ck_"+idname)){ getEL("ck_"+idname).checked = flag;}						// �Ǘ��̈�(�`�F�b�N�{�b�N�X)
			if(getEL("cl_"+idname)){ getEL("cl_"+idname).innerHTML = pp.getLabel(idname);}		// �Ǘ��̈�(���x��)
		}
	},
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

	//---------------------------------------------------------------------------
	// menu.createFloatMenu() �o�^���ꂽ�T�u���j���[����t���[�g���j���[���쐬����
	// menu.getFloatpanel()   �w�肳�ꂽID�����t���[�g���j���[��Ԃ�(�Ȃ��ꍇ�͍쐬����)
	//---------------------------------------------------------------------------
	createFloats : function(){
		var last=0;
		for(var i=0;i<pp.flaglist.length;i++){
			var idname = pp.flaglist[i];
			if(!pp.flags[idname]){ continue;}

			var menuid = pp.flags[idname].parent;
			var floats = this.getFloatpanel(menuid);

			if(menuid=='setting'){
				if(last>0 && last!=pp.type(idname)){
					var _sep = ee.newEL('div');
					_sep.className = 'smenusep';
					_sep.innerHTML = '&nbsp;';
					floats.appendChild(_sep);
				}
				last=pp.type(idname);
			}

			var smenu;
			if     (pp.istype(idname, pp.SEPARATE)){
				smenu = ee.newEL('div');
				smenu.className = 'smenusep';
				smenu.innerHTML = '&nbsp;';
			}
			else if(pp.istype(idname, pp.LABEL)){
				smenu = ee.newEL('span');
				smenu.style.color = 'white';
			}
			else if(pp.istype(idname, pp.SELECT)){
				smenu = ee.newEL('div');
				smenu.className  = 'smenu';
				smenu.style.fontWeight = '900';
				smenu.style.fontSize   = '10pt';
				smenu.onmouseover = ee.ebinder(this, this.submenuhover, [idname]);
				smenu.onmouseout  = ee.ebinder(this, this.submenuout,   [idname]);
				this.getFloatpanel(idname);
			}
			else{
				smenu = ee.newEL('div');
				smenu.className  = 'smenu';
				smenu.onmouseover = ee.ebinder(this, this.submenuhover, [idname]);
				smenu.onmouseout  = ee.ebinder(this, this.submenuout,   [idname]);
				smenu.onclick     = ee.ebinder(this, this.submenuclick, [idname]);
				this.getFloatpanel(idname);
				if(!pp.istype(idname, pp.SMENU)){
					smenu.style.fontSize    = '10pt';
					smenu.style.paddingLeft = '6pt';
				}
			}
			smenu.id = "ms_"+idname;
			floats.appendChild(smenu);

			this.setdisplay(idname);
		}
		this.floatpanel[menuid] = floats;
	},
	getFloatpanel : function(id){
		if(!this.floatpanel[id]){
			var _float = ee.newEL("div");
			_float.className = 'floatmenu';
			_float.id        = 'float_'+id;
			_float.onmouseout = ee.ebinder(this, this.floatmenuout);
			_float.style.zIndex = 101;
			_float.style.backgroundColor = base.floatbgcolor;
			getEL('float_parent').appendChild(_float);

			this.floatpanel[id] = _float;
			//$(_float).hide();
		}
		return this.floatpanel[id];
	},

	//---------------------------------------------------------------------------
	// menu.managearea()   �Ǘ��̈�̏��������s��
	//---------------------------------------------------------------------------
	managearea : function(){
		for(var n=0;n<pp.flaglist.length;n++){
			var idname = pp.flaglist[n];
			if(!pp.flags[idname] || !pp.getLabel(idname)){ continue;}

			if(pp.istype(idname, pp.SELECT)){
				var plx = ee("usepanel");

				var _el = ee.newEL('span');
				_el.id = "cl_" + idname;
				_el.innerHTML = pp.getLabel(idname);
				plx.appendEL(_el);
				plx.appendHTML(" |&nbsp;");

				for(var i=0;i<pp.flags[idname].child.length;i++){
					var num = pp.flags[idname].child[i];
					var _el = ee.newELx('div').unselectable().el;
					_el.className = ((num==pp.getVal(idname))?"flagsel":"flag");
					_el.id        = "up_"+idname+"_"+num;
					_el.innerHTML = pp.getMenuStr(""+idname+"_"+num);
					_el.onclick   = ee.binder(pp, pp.setVal, [idname,num]);

					plx.appendEL(_el);
					plx.appendHTML(" ");
				}

				plx.appendEL(ee.newEL('br'));
			}
			else if(pp.istype(idname, pp.CHECK)){
				var cpx = ee("checkpanel");

				var _el = ee.newEL('input');
				_el.type  = 'checkbox';
				_el.id    = "ck_" + idname;
				_el.check = '';
				_el.onclick = ee.binder(this, this.checkclick, [idname]);
				cpx.appendEL(_el)

				cpx.appendHTML(" ");

				_el = ee.newEL('span');
				_el.id = "cl_" + idname;
				_el.innerHTML = pp.getLabel(idname);
				cpx.appendEL(_el);

				if(idname==="irowake"){
					cpx.appendEL(ee.newBTN('ck_irowake2','','�F�������Ȃ���'));
					this.addButtons(getEL("ck_irowake2"), ee.binder(menu.ex, menu.ex.irowakeRemake), "�F�������Ȃ���", "Change the color of Line");
				}

				cpx.appendEL(ee.newEL('br'));
			}
		}

		var _tr = ee('translation').unselectable().el;
		_tr.style.position = 'absolute';
		_tr.style.cursor   = 'pointer';
		_tr.style.fontSize = '10pt';
		_tr.style.color    = 'green';
		_tr.style.backgroundColor = '#dfdfdf';
		_tr.onclick = ee.binder(this, this.translate);

		if(k.EDITOR){
			$("#timerpanel,#separator2").hide();
		}
		if(k.irowake!=0){
			getEL('btnarea').appendChild(menu.createButton('btncolor2','','�F�������Ȃ���'))
			this.addButtons(getEL("btncolor2"), ee.binder(menu.ex, menu.ex.irowakeRemake), "�F�������Ȃ���", "Change the color of Line");
			$("#btncolor2").hide();
		}
	},

//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------

	//---------------------------------------------------------------------------
	// menu.poparea()     �|�b�v�A�b�v���j���[�̏����ݒ���s��
	// menu.popclose()    �|�b�v�A�b�v���j���[�����
	//---------------------------------------------------------------------------
	poparea : function(){

		$("div.titlebar,#credir3_1").each(function(){ menu.titlebarfunc(this);});

		//---------------------------------------------------------------------------
		//// form�{�^���̃C�x���g
		var px = ee.ebinder(this, this.popclose);

		// �Ֆʂ̐V�K�쐬
		document.newboard.newboard.onclick = ee.ebinder(this.ex, this.ex.newboard);
		document.newboard.cancel.onclick   = px;

		// URL����
		document.urlinput.urlinput.onclick = ee.ebinder(this.ex, this.ex.urlinput);
		document.urlinput.cancel.onclick   = px;

		// URL�o��
		var _div = getEL('urlbuttonarea');
		var ib = ee.binder(this, function(name, strJP, strEN, eval){
			if(eval===false) return;
			var el = menu.createButton('', name, strJP);
			this.addButtons(el, ee.ebinder(this.ex, this.ex.urloutput), strJP, strEN);
			_div.appendChild(el)
			_div.appendChild(ee.newEL('br'));
		});
		ib('pzprv3',     "�ς��Ղ�v3��URL���o�͂���",           "Output PUZ-PRE v3 URL",          true);
		ib('pzprapplet', "�ς��Ղ�(�A�v���b�g)��URL���o�͂���", "Output PUZ-PRE(JavaApplet) URL", !k.ispzprv3ONLY);
		ib('kanpen',     "�J���y����URL���o�͂���",             "Output Kanpen URL",              !!k.isKanpenExist);
		ib('heyaapp',    "�ւ�킯�A�v���b�g��URL���o�͂���",   "Output Heyawake-Applet URL",     (k.puzzleid==="heyawake"));
		ib('pzprv3edit', "�ς��Ղ�v3�̍ĕҏW�pURL���o�͂���",   "Output PUZ-PRE v3 Re-Edit URL",  true);
		getEL("urlbuttonarea").appendChild(ee.newEL('br'));

		this.addButtons(document.urloutput.openurl, ee.ebinder(this.ex, this.ex.openurl), "����URL���J��", "Open this URL on another window/tab");
		this.addButtons(document.urloutput.close,   px,                                   "����", "Close");

		// �t�@�C������
		document.fileform.filebox.onchange = ee.ebinder(this.ex, this.ex.fileopen);
		document.fileform.close.onclick    = px;

		// �f�[�^�x�[�X���J��
		document.database.sorts   .onchange = ee.ebinder(fio, fio.displayDataTableList);
		document.database.datalist.onchange = ee.ebinder(fio, fio.selectDataTable);
		document.database.tableup.onclick   = ee.ebinder(fio, fio.upDataTable);
		document.database.tabledn.onclick   = ee.ebinder(fio, fio.downDataTable);
		document.database.open   .onclick   = ee.ebinder(fio, fio.openDataTable);
		document.database.save   .onclick   = ee.ebinder(fio, fio.saveDataTable);
		document.database.comedit.onclick   = ee.ebinder(fio, fio.editComment);
		document.database.difedit.onclick   = ee.ebinder(fio, fio.editDifficult);
		document.database.del    .onclick   = ee.ebinder(fio, fio.deleteDataTable);
		document.database.close  .onclick   = px;

		// �Ֆʂ̒���
		var pa = ee.ebinder(this.ex, this.ex.popupadjust);
		document.adjust.expandup.onclick = pa;
		document.adjust.expanddn.onclick = pa;
		document.adjust.expandlt.onclick = pa;
		document.adjust.expandrt.onclick = pa;
		document.adjust.reduceup.onclick = pa;
		document.adjust.reducedn.onclick = pa;
		document.adjust.reducelt.onclick = pa;
		document.adjust.reducert.onclick = pa;
		document.adjust.close   .onclick = px;

		// ���]�E��]
		document.flip.turnl.onclick = pa;
		document.flip.turnr.onclick = pa;
		document.flip.flipy.onclick = pa;
		document.flip.flipx.onclick = pa;
		document.flip.close.onclick = px;

		// credit
		document.credit.close.onclick = px;

		// �\���T�C�Y
		document.dispsize.dispsize.onclick = ee.ebinder(this, this.ex.dispsize);
		document.dispsize.cancel.onclick   = px;
	},
	popclose : function(){
		if(this.pop){
			this.pop.style.display = "none";
			this.pop = '';
			this.menuclear();
			this.isptitle = 0;
			k.enableKey = true;
		}
	},

	//---------------------------------------------------------------------------
	// menu.titlebarfunc() ����4�̃C�x���g���C�x���g�n���h���ɂ�������
	// menu.titlebardown() Popup�^�C�g���o�[���N���b�N�����Ƃ��̓�����s��
	// menu.titlebarup()   Popup�^�C�g���o�[�Ń{�^���𗣂����Ƃ��̓�����s��
	// menu.titlebarout()  Popup�^�C�g���o�[����}�E�X�����ꂽ�Ƃ��̓�����s��
	// menu.titlebarmove() Popup�^�C�g���o�[����}�E�X�𓮂������Ƃ��|�b�v�A�b�v���j���[�𓮂���
	//---------------------------------------------------------------------------
	titlebarfunc : function(bar){
		bar.onmousedown = ee.ebinder(menu, menu.titlebardown);
		bar.onmouseup   = ee.ebinder(menu, menu.titlebarup);
		bar.onmouseout  = ee.ebinder(menu, menu.titlebarout);
		bar.onmousemove = ee.ebinder(menu, menu.titlebarmove);

		ee(bar).unselectable().el;
	},

	titlebardown : function(e){
		var pop = ee.getSrcElement(e).parentNode;
		this.isptitle = 1;
		this.offset.x = mv.pointerX(e) - parseInt(pop.style.left);
		this.offset.y = mv.pointerY(e) - parseInt(pop.style.top);
	},
	titlebarup   : function(e){
		this.isptitle = 0;
	},
	titlebarout  : function(e){
		var pop = ee.getSrcElement(e).parentNode;
		if(!this.insideOf(pop, e)){ this.isptitle = 0;}
	},
	titlebarmove : function(e){
		var pop = ee.getSrcElement(e).parentNode;
		if(pop && this.isptitle){
			pop.style.left = mv.pointerX(e) - this.offset.x;
			pop.style.top  = mv.pointerY(e) - this.offset.y;
		}
	},

//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------

	//---------------------------------------------------------------------------
	// menu.buttonarea()        �{�^���̏����ݒ���s��
	// menu.createButton()      �w�肵��id, name, ���x�����������{�^�����쐬����
	// menu.addButtons()        �{�^���̏���ϐ��ɓo�^����
	// menu.addLAbels()         ���x���̏���ϐ��ɓo�^����
	// menu.setDefaultButtons() �{�^����btnstack�ɐݒ肷��
	// menu.setDefaultLabels()  ���x����spanstack�ɐݒ肷��
	//---------------------------------------------------------------------------
	buttonarea : function(){
		this.addButtons(getEL("btncheck"),  ee.binder(ans, ans.check),             "�`�F�b�N", "Check");
		this.addButtons(getEL("btnundo"),   ee.binder(um, um.undo),                "��",       "<-");
		this.addButtons(getEL("btnredo"),   ee.binder(um, um.redo),                "�i",       "->");
		this.addButtons(getEL("btnclear"),  ee.binder(menu.ex, menu.ex.ACconfirm), "�񓚏���", "Erase Answer");
		this.addButtons(getEL("btnclear2"), ee.binder(menu.ex, menu.ex.ASconfirm), "�⏕����", "Erase Auxiliary Marks");

		this.setDefaultButtons();
		this.setDefaultLabels();
	},
	createButton : function(id, name, val){
		var _btn = ee.newEL('input');
		_btn.type  = 'button';
		if(!!id)  { _btn.id   = id;}
		if(!!name){ _btn.name = name;}
		_btn.value = val;

		return _btn;
	},

	addButtons : function(el, func, strJP, strEN){
		if(!!func) el.onclick = func;
		this.btnstack.push({el:ee(el).unselectable().el, str:{ja:strJP, en:strEN}});
	},
	addLabels  : function(el, strJP, strEN){
		this.labelstack.push({el:el, str:{ja:strJP, en:strEN}});
	},

	setDefaultButtons : function(){
		var t = ee.binder(this, this.addButtons);
		t(document.newboard.newboard, null, "�V�K�쐬",   "Create");
		t(document.newboard.cancel,   null, "�L�����Z��", "Cancel");
		t(document.urlinput.urlinput, null, "�ǂݍ���",   "Import");
		t(document.urlinput.cancel,   null, "�L�����Z��", "Cancel");
		t(document.fileform.close,    null, "����",     "Close");
		t(document.database.save,     null, "�Ֆʂ�ۑ�", "Save");
		t(document.database.comedit,  null, "�R�����g��ҏW����", "Edit Comment");
		t(document.database.difedit,  null, "��Փx��ݒ肷��",   "Set difficulty");
		t(document.database.open,     null, "�f�[�^��ǂݍ���",   "Load");
		t(document.database.del,      null, "�폜",       "Delete");
		t(document.database.close,    null, "����",     "Close");
		t(document.adjust.expandup,   null, "��",         "UP");
		t(document.adjust.expanddn,   null, "��",         "Down");
		t(document.adjust.expandlt,   null, "��",         "Left");
		t(document.adjust.expandrt,   null, "�E",         "Right");
		t(document.adjust.reduceup,   null, "��",         "UP");
		t(document.adjust.reducedn,   null, "��",         "Down");
		t(document.adjust.reducelt,   null, "��",         "Left");
		t(document.adjust.reducert,   null, "�E",         "Right");
		t(document.adjust.close,      null, "����",     "Close");
		t(document.flip.turnl,        null, "��90����]", "Turn left by 90 degree");
		t(document.flip.turnr,        null, "�E90����]", "Turn right by 90 degree");
		t(document.flip.flipy,        null, "�㉺���]",   "Flip upside down");
		t(document.flip.flipx,        null, "���E���]",   "Flip leftside right");
		t(document.flip.close,        null, "����",     "Close");
		t(document.dispsize.dispsize, null, "�ύX����",   "Change");
		t(document.dispsize.cancel,   null, "�L�����Z��", "Cancel");
		t(document.credit.close,      null, "����",     "OK");
	},
	setDefaultLabels : function(){
		var t = ee.binder(this, this.addLabels);
		t(getEL("translation"), "English",                     "���{��");
		t(getEL("bar1_1"),      "�Ֆʂ̐V�K�쐬",              "Createing New Board");
		t(getEL("pop1_1_cap0"), "�Ֆʂ�V�K�쐬���܂��B",      "Create New Board.");
		t(getEL("pop1_1_cap1"), "�悱",                        "Cols");
		t(getEL("pop1_1_cap2"), "����",                        "Rows");
		t(getEL("bar1_2"),      "URL����",                     "Import from URL");
		t(getEL("pop1_2_cap0"), "URL�������ǂݍ��݂܂��B", "Import a question from URL.");
		t(getEL("bar1_3"),      "URL�o��",                     "Export URL");
		t(getEL("bar1_4"),      "�t�@�C�����J��",              "Open file");
		t(getEL("pop1_4_cap0"), "�t�@�C���I��",                "Choose file");
		t(getEL("bar1_8"),      "�f�[�^�x�[�X�̊Ǘ�",          "Database Management");
		t(getEL("pop1_8_com"),  "�R�����g:",                   "Comment:");
		t(getEL("bar2_1"),      "�Ֆʂ̒���",                  "Adjust the board");
		t(getEL("pop2_1_cap0"), "�Ֆʂ̒������s���܂��B",      "Adjust the board.");
		t(getEL("pop2_1_cap1"), "�g��",                        "Expand");
		t(getEL("pop2_1_cap2"), "�k��",                        "Reduce");
		t(getEL("bar2_2"),      "���]�E��]",                  "Flip/Turn the board");
		t(getEL("pop2_2_cap0"), "�Ֆʂ̉�]�E���]���s���܂��B","Flip/Turn the board.");
		t(getEL("bar4_1"),      "�\���T�C�Y�̕ύX",            "Change size");
		t(getEL("pop4_1_cap0"), "�\���T�C�Y��ύX���܂��B",    "Change the display size.");
		t(getEL("pop4_1_cap1"), "�\���T�C�Y",                  "Display size");
		t(getEL("bar3_1"),      "credit",                      "credit");
		t(getEL("credit3_1"), "�ς��Ղ�v3 "+pzprversion+"<br>\n<br>\n�ς��Ղ�v3�� �͂���/�A�����j���쐬���Ă��܂��B<br>\n���C�u�����Ƃ���jQuery1.3.2, uuCanvas1.0, <br>Google Gears��\n�g�p���Ă��܂��B<br>\n<br>\n",
							  "PUZ-PRE v3 "+pzprversion+"<br>\n<br>\nPUZ-PRE v3 id made by happa.<br>\nThis script use jQuery1.3.2, uuCanvas1.0, <br>Google Gears as libraries.<br>\n<br>\n");
	},

//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
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
		getEL("title2").innerHTML = base.gettitle();
		getEL("expression").innerHTML = base.expression[this.language];

		this.displayAll();
		this.ex.dispmanstr();

		base.resize_canvas();
	}
};

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

	// pp.setMenuStr() �Ǘ��p�l���ƑI���^/�`�F�b�N�^�T�u���j���[�ɕ\�����镶�����ݒ肷��
	addSmenuToFlags : function(idname, parent)       { this.addToFlags(idname, parent, this.SMENU, 0);},
	addCheckToFlags : function(idname, parent, first){ this.addToFlags(idname, parent, this.CHECK, first);},
	addCaptionToFlags     : function(idname, parent) { this.addToFlags(idname, parent, this.LABEL, 0);},
	addSeparatorToFlags   : function(idname, parent) { this.addToFlags(idname, parent, this.SEPARATE, 0);},
	addUseToFlags   : function(idname, parent, first, child){
		this.addToFlags(idname, parent, this.SELECT, first);
		this.flags[idname].child = child;
	},
	addUseChildrenToFlags : function(idname, parent){
		if(!this.flags[idname]){ return;}
		for(var i=0;i<this.flags[idname].child.length;i++){
			var num = this.flags[idname].child[i];
			this.addToFlags(""+idname+"_"+num, parent, this.CHILD, num);
		}
	},
	addToFlags : function(idname, parent, type, first){
		this.flags[idname] = new SSData();
		this.flags[idname].id     = idname;
		this.flags[idname].type   = type;
		this.flags[idname].val    = first;
		this.flags[idname].parent = parent;
		this.flaglist.push(idname);
	},

	setMenuStr : function(idname, strJP, strEN){
		if(!this.flags[idname]){ return;}
		this.flags[idname].str.ja.menu = strJP; this.flags[idname].str.en.menu = strEN;
	},
	setLabel : function(idname, strJP, strEN){
		if(!this.flags[idname]){ return;}
		this.flags[idname].str.ja.label = strJP; this.flags[idname].str.en.label = strEN;
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

	//---------------------------------------------------------------------------
	// pp.setDefaultFlags()  �ݒ�l��o�^����
	// pp.setStringToFlags() �ݒ�l�ɕ������o�^����
	//---------------------------------------------------------------------------
	setDefaultFlags : function(){
		var as = ee.binder(this, this.addSmenuToFlags),
			au = ee.binder(this, this.addUseToFlags),
			ac = ee.binder(this, this.addCheckToFlags),
			aa = ee.binder(this, this.addCaptionToFlags),
			ai = ee.binder(this, this.addUseChildrenToFlags),
			ap = ee.binder(this, this.addSeparatorToFlags);

		au('mode','setting',(k.editmode?1:3),[1,3]);

		puz.menufix();	// �e�p�Y�����Ƃ̃��j���[�ǉ�

		ac('autocheck','setting',k.autocheck);
		ac('lrcheck','setting',false);
		ac('keypopup','setting',kp.defaultdisp);
		au('language','setting',0,[0,1]);
		if(k.PLAYER){ delete this.flags['mode'];}
		if(!kp.ctl[1].enable && !kp.ctl[3].enable){ delete this.flags['keypopup'];}

		as('newboard',  'file');
		as('urlinput',  'file');
		as('urloutput', 'file');
		ap('sep_2',     'file');
		as('fileopen',  'file');
		as('filesave',  'file');
		as('database',  'file');
		ap('sep_3',     'file');
		as('fileopen2', 'file');
		as('filesave2', 'file');
		if(fio.DBtype==0){ delete this.flags['database'];}
		if(!k.isKanpenExist || (k.puzzleid=="nanro"||k.puzzleid=="ayeheya"||k.puzzleid=="kurochute")){
			delete this.flags['fileopen2']; delete this.flags['filesave2']; delete this.flags['sep_3'];
		}

		as('adjust', 'edit');
		as('turn',   'edit');

		au('size',   'disp',k.widthmode,[0,1,2,3,4]);
		ap('sep_4',  'disp');
		ac('irowake','disp',(k.irowake==2?true:false));
		ap('sep_5',  'disp');
		as('manarea','disp');
		if(k.irowake==0){ delete this.flags['irowake']; delete this.flags['sep_4'];}

		as('dispsize',    'size');
		aa('cap_dispmode','size');
		ai('size','size');

		ai('mode','mode');

		ai('language','language');

		as('credit',      'other');
		aa('cap_others1', 'other');
		as('jumpv3',      'other');
		as('jumptop',     'other');
		as('jumpblog',    'other');

		this.setStringToFlags();
	},
	setStringToFlags : function(){
		var sm = ee.binder(this, this.setMenuStr),
			sl = ee.binder(this, this.setLabel);

		sm('size',   '�\���T�C�Y',  'Cell Size');
		sm('size_0', '�T�C�Y �ɏ�', 'Ex Small');
		sm('size_1', '�T�C�Y ��',   'Small');
		sm('size_2', '�T�C�Y �W��', 'Normal');
		sm('size_3', '�T�C�Y ��',   'Large');
		sm('size_4', '�T�C�Y ����', 'Ex Large');

		sm('irowake', '���̐F����', 'Color coding');
		sl('irowake', '���̐F����������', 'Color each lines');

		sm('mode',   '���[�h', 'mode');
		sl('mode',   '���[�h', 'mode');
		sm('mode_1', '���쐬���[�h', 'Edit mode'  );
		sm('mode_3', '�񓚃��[�h',     'Answer mode');

		sm('autocheck', '������������', 'Auto Answer Check');

		sm('lrcheck', '�}�E�X���E���]', 'Mouse button inversion');
		sl('lrcheck', '�}�E�X�̍��E�{�^���𔽓]����', 'Invert button of the mouse');

		sm('keypopup', '�p�l������', 'Panel inputting');
		sl('keypopup', '�����E�L�����p�l���œ��͂���', 'Input numbers by panel');

		sm('language',   '����',    'Language');
		sm('language_0', '���{��',  '���{��');
		sm('language_1', 'English', 'English');

		sm('newboard',     '�V�K�쐬',                  'New Board');
		sm('urlinput',     'URL����',                   'Import from URL');
		sm('urloutput',    'URL�o��',                   'Export URL');
		sm('fileopen',     '�t�@�C�����J��',            'Open the file');
		sm('filesave',     '�t�@�C���ۑ�',              'Save the file as ...');
		sm('database',     '�f�[�^�x�[�X�̊Ǘ�',        'Database Management');
		sm('fileopen2',    'pencilbox�̃t�@�C�����J��', 'Open the pencilbox file');
		sm('filesave2',    'pencilbox�̃t�@�C����ۑ�', 'Save the pencilbox file as ...');
		sm('adjust',       '�Ֆʂ̒���',                'Adjust the Board');
		sm('turn',         '���]�E��]',                'Filp/Turn the Board');
		sm('dispsize',     '�T�C�Y�w��',                'Cell Size');
		sm('cap_dispmode', '�\�����[�h',                'Display mode');
		sm('manarea',      '�Ǘ��̈���B��',            'Hide Management Area');
		sm('credit',       '�ς��Ղ�v3�ɂ���',        'About PUZ-PRE v3');
		sm('cap_others1',  '�����N',                    'Link');
		sm('jumpv3',       '�ς��Ղ�v3�̃y�[�W��',      'Jump to PUZ-PRE v3 page');
		sm('jumptop',      '�A�����j�ۊǌ�TOP��',       'Jump to indi.s58.xrea.com');
		sm('jumpblog',     '�͂��ϓ��L(blog)��',        'Jump to my blog');

		sm('eval', '�e�X�g�p', 'for Evaluation');
	},

//--------------------------------------------------------------------------------------------------------------
	// submenu����Ăяo�����֐�����
	funcs : {
		urlinput  : function(){ menu.pop = getEL("pop1_2");},
		urloutput : function(){ menu.pop = getEL("pop1_3"); document.urloutput.ta.value = "";},
		filesave  : function(){ menu.ex.filesave();},
		database  : function(){ menu.pop = getEL("pop1_8"); fio.getDataTableList();},
		filesave2 : function(){ if(fio.kanpenSave){ menu.ex.filesave2();}},
		adjust    : function(){ menu.pop = getEL("pop2_1");},
		turn      : function(){ menu.pop = getEL("pop2_2");},
		credit    : function(){ menu.pop = getEL("pop3_1");},
		jumpv3    : function(){ window.open('./', '', '');},
		jumptop   : function(){ window.open('../../', '', '');},
		jumpblog  : function(){ window.open('http://d.hatena.ne.jp/sunanekoroom/', '', '');},
		irowake   : function(){ menu.ex.irowakeRemake();},
		manarea   : function(){ menu.ex.dispman();},
		autocheck : function(val){ k.autocheck = !k.autocheck;},
		mode      : function(num){ menu.ex.modechange(num);},
		size      : function(num){ k.widthmode=num; base.resize_canvas();},
		use       : function(num){ k.use =num;},
		language  : function(num){ menu.setLang({0:'ja',1:'en'}[num]);},

		newboard : function(){
			menu.pop = getEL("pop1_1");
			if(k.puzzleid!="sudoku"){
				document.newboard.col.value = k.qcols;
				document.newboard.row.value = k.qrows;
			}
			k.enableKey = false;
		},
		fileopen : function(){
			document.fileform.pencilbox.value = "0";
			if(k.br.IE || k.br.Gecko || k.br.Opera){ if(!menu.pop){ menu.pop = getEL("pop1_4");}}
			else{ if(!menu.pop){ document.fileform.filebox.click();}}
		},
		fileopen2 : function(){
			if(!fio.kanpenOpen){ return;}
			document.fileform.pencilbox.value = "1";
			if(k.br.IE || k.br.Gecko || k.br.Opera){ if(!menu.pop){ menu.pop = getEL("pop1_4");}}
			else{ if(!menu.pop){ document.fileform.filebox.click();}}
		},
		dispsize : function(){
			menu.pop = getEL("pop4_1");
			document.dispsize.cs.value = k.def_csize;
			k.enableKey = false;
		},
		keypopup : function(){
			var f = kp.ctl[pp.flags['mode'].val].enable;
			getEL("ck_keypopup").disabled    = (f?"":"true");
			getEL("cl_keypopup").style.color = (f?"black":"silver");
		}
	}
};
