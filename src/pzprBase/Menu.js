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
	// menu.menuinit()  ���j���[�A�{�^���A�T�u���j���[�A�t���[�g���j���[�A
	//                  �|�b�v�A�b�v���j���[�̏����ݒ���s��
	// menu.menureset() ���j���[�p�̐ݒ����������
	//---------------------------------------------------------------------------
	menuinit : function(){
		this.buttonarea();
		this.menuarea();
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

		$("#popup_parent > .floatmenu").remove();
		$("#menupanel,#usepanel,#checkpanel").html("");
		if($("#btncolor2").length>0){ $("#btncolor2").remove();}
		$("#btnclear2").nextAll().remove();
		$("#outbtnarea").remove();

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

		$("#expression").html(base.expression.ja);
		if(k.PLAYER){ $("#ms_newboard,#ms_urloutput").attr("class", "smenunull");}
		if(k.PLAYER){ $("#ms_adjust").attr("class", "smenunull");}
		$("#ms_jumpv3,#ms_jumptop,#ms_jumpblog").css("font-size",'10pt').css("padding-left",'8pt');

		this.managearea();
	},

	addMenu : function(idname, strJP, strEN){
		var jqel = newEL("div").attr("class", 'menu').attr("id",'menu_'+idname).appendTo($("#menupanel"))
							   .html("["+strJP+"]").css("margin-right","4pt")
							   .hover(this.menuhover.ebind(this,idname), this.menuout.ebind(this));
		this.addLabels(jqel, "["+strJP+"]", "["+strEN+"]");
	},
	menuhover : function(e, idname){
		this.floatmenuopen(e,idname,0);
		$("div.menusel").attr("class", "menu");
		$(getSrcElement(e)).attr("class", "menusel");
	},
	menuout   : function(e){ if(!this.insideOfMenu(e)){ this.menuclear();} },
	menuclear : function(){
		$("div.menusel").attr("class", "menu");
		$("div.smenusel").attr("class", "smenu");
		$("#popup_parent > .floatmenu").hide();
		this.dispfloat = [];
	},

	//---------------------------------------------------------------------------
	// menu.submenuhover(e) �T�u���j���[�Ƀ}�E�X��������Ƃ��̕\���ݒ���s��
	// menu.submenuout(e)   �T�u���j���[����}�E�X���O�ꂽ�Ƃ��̕\���ݒ���s��
	// menu.submenuclick(e) �ʏ�/�I���^/�`�F�b�N�^�T�u���j���[���N���b�N���ꂽ�Ƃ��̓�������s����
	// menu.checkclick()    �Ǘ��̈�̃`�F�b�N�{�^���������ꂽ�Ƃ��A�`�F�b�N�^�̐ݒ��ݒ肷��
	//---------------------------------------------------------------------------
	submenuhover : function(e, idname){
		if($(getSrcElement(e)).attr("class")=="smenu"){ $(getSrcElement(e)).attr("class", "smenusel");}
		if(pp.flags[idname] && pp.type(idname)==1){ this.floatmenuopen(e,idname,this.dispfloat.length);}
	},
	submenuout   : function(e, idname){
		if($(getSrcElement(e)).attr("class")=="smenusel"){ $(getSrcElement(e)).attr("class", "smenu");}
		if(pp.flags[idname] && pp.type(idname)==1){ this.floatmenuout(e);}
	},
	submenuclick : function(e, idname){
		if($(getSrcElement(e)).attr("class") == "smenunull"){ return;}
		this.menuclear();

		if(pp.type(idname)==0){
			this.popclose();							// �\�����Ă���E�B���h�E������ꍇ�͕���
			if(pp.funcs[idname]){ pp.funcs[idname]();}	// ���̒���this.popupenu���ݒ肳��܂��B
			if(this.pop){
				this.pop.css("left", mv.pointerX(e) - 8 + k.IEMargin.x)
						.css("top",  mv.pointerY(e) - 8 + k.IEMargin.y).css("visibility", "visible");
			}
		}
		else if(pp.type(idname)==4){ this.setVal(pp.flags[idname].parent, pp.getVal(idname));}
		else if(pp.type(idname)==2){ this.setVal(idname, !pp.getVal(idname));}
	},
	checkclick : function(idname){ this.setVal(idname, $("#ck_"+idname).attr("checked"));},

	//---------------------------------------------------------------------------
	// menu.floatmenuopen()  �}�E�X�����j���[���ڏ�ɗ������Ƀt���[�g���j���[��\������
	// menu.floatmenuclose() �t���[�g���j���[��close����
	// menu.floatmenuout(e)  �}�E�X���t���[�g���j���[�𗣂ꂽ���Ƀt���[�g���j���[��close����
	// menu.insideOf()       �C�x���ge��jQuery�I�u�W�F�N�gjqobj�͈͓̔��ŋN���������H
	// menu.insideOfMenu()   �}�E�X�����j���[�̈�̒��ɂ��邩���肷��
	//---------------------------------------------------------------------------
	floatmenuopen : function(e, idname, depth){
		this.floatmenuclose(depth);
		var src = $(getSrcElement(e));

		if(depth==0||this.dispfloat[depth-1]){
			if(depth==0){ this.floatpanel[idname].css("left", src.offset().left - 3 + k.IEMargin.x).css("top" , src.offset().top + src.height());}
			else        { this.floatpanel[idname].css("left", src.offset().left + src.width())     .css("top",  src.offset().top - 3);}
			this.floatpanel[idname].css("z-index",101+depth).css("visibility", "visible").show();
			this.dispfloat.push(idname);
		}
	},
	// �}�E�X�����ꂽ�Ƃ��Ƀt���[�g���j���[���N���[�Y����
	// �t���[�g->���j���[���ɊO�ꂽ���́A�֐��I�������floatmenuopen()���Ă΂��
	floatmenuclose : function(depth){
		if(depth==0){ this.menuclear(); return;}
		for(var i=this.dispfloat.length-1;i>=depth;i--){
			if(this.dispfloat[i]){
				$("#ms_"+this.dispfloat[i]).attr("class", "smenu");
				this.floatpanel[this.dispfloat[i]].hide();
				this.dispfloat.pop();
			}
		}
	},
	floatmenuout : function(e){
		for(var i=this.dispfloat.length-1;i>=0;i--){
			if(this.insideOf(this.floatpanel[this.dispfloat[i]],e)){ this.floatmenuclose(i+1); return;}
		}
		this.menuclear();
	},

	insideOf : function(jqobj, e){
		var LT = new Pos(jqobj.offset().left, jqobj.offset().top);
		var ev = new Pos(mv.pointerX(e), mv.pointerY(e));
		return !(ev.x<=LT.x || ev.x>=LT.x+jqobj.width() || ev.y<=LT.y || ev.y>=LT.y+jqobj.height());
	},
	insideOfMenu : function(e){
		var upperLimit = $("#menu_file").offset().top;
		var leftLimit  = $("#menu_file").offset().left;
		var rightLimit = $("#menu_other").offset().left + $("#menu_other").width();
		var ex = mv.pointerX(e), ey = mv.pointerY(e);
		return (ex>leftLimit && ex<rightLimit && ey>upperLimit);
	},

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
		if(pp.type(idname)==0||pp.type(idname)==3){
			if($("#ms_"+idname)){ $("#ms_"+idname).html(pp.getMenuStr(idname));}
		}
		else if(pp.type(idname)==1){
			if($("#ms_"+idname)){ $("#ms_"+idname).html("&nbsp;"+pp.getMenuStr(idname));}	// ���j���[��̕\�L�̐ݒ�
			$("#cl_"+idname).html(pp.getLabel(idname));									// �Ǘ��̈��̕\�L�̐ݒ�
			for(var i=0;i<pp.flags[idname].child.length;i++){ this.setdisplay(""+idname+"_"+pp.flags[idname].child[i]);}
		}
		else if(pp.type(idname)==4){
			var issel = (pp.getVal(idname) == pp.getVal(pp.flags[idname].parent));
			var cap = pp.getMenuStr(idname);
			$("#ms_"+idname).html((issel?"+":"&nbsp;")+cap);					// ���j���[�̍���
			$("#up_"+idname).html(cap).attr("class", issel?"flagsel":"flag");	// �Ǘ��̈�̍���
		}
		else if(pp.type(idname)==2){
			var flag = pp.getVal(idname);
			if($("#ms_"+idname)){ $("#ms_"+idname).html((flag?"+":"&nbsp;")+pp.getMenuStr(idname));}	// ���j���[
			$("#ck_"+idname).attr("checked",flag);			// �Ǘ��̈�(�`�F�b�N�{�b�N�X)
			$("#cl_"+idname).html(pp.getLabel(idname));		// �Ǘ��̈�(���x��)
		}
	},
	displayAll : function(){
		for(var i in pp.flags){ this.setdisplay(i);}
		$.each(this.btnstack,function(i,obj){obj.el.attr("value",obj.str[menu.language]);});
		$.each(this.labelstack,function(i,obj){obj.el.html(obj.str[menu.language]);});
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
				if(last>0 && last!=pp.type(idname)){ $("<div class=\"smenusep\">&nbsp;</div>").appendTo(floats);}
				last=pp.type(idname);
			}

			var smenu;
			if     (pp.type(idname)==5){ smenu = $("<div class=\"smenusep\">&nbsp;</div>");}
			else if(pp.type(idname)==3){ smenu = newEL("span").css("color", 'white');}
			else if(pp.type(idname)==1){
				smenu = newEL("div").attr("class", 'smenu').css("font-weight","900").css("font-size",'10pt')
									.hover(this.submenuhover.ebind(this,idname), this.submenuout.ebind(this,idname));
				this.getFloatpanel(idname);
			}
			else{
				smenu = newEL("div").attr("class", 'smenu')
									.hover(this.submenuhover.ebind(this,idname), this.submenuout.ebind(this,idname))
									.click(this.submenuclick.ebind(this,idname));
				if(pp.type(idname)!=0){ smenu.css("font-size",'10pt').css("padding-left",'6pt');}
			}
			smenu.attr("id","ms_"+idname).appendTo(floats);
			this.setdisplay(idname);
		}
		this.floatpanel[menuid] = floats;
	},
	getFloatpanel : function(id){
		if(!this.floatpanel[id]){
			this.floatpanel[id] = newEL("div")
				.attr("class", 'floatmenu').attr("id",'float_'+id).appendTo($("#popup_parent"))
				.css("background-color", base.floatbgcolor).css("z-index",101)
				.mouseout(this.floatmenuout.ebind(this)).hide();
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

			if(pp.type(idname)==1){
				$("#usepanel").append("<span id=\"cl_"+idname+"\">"+pp.getLabel(idname)+"</span> |&nbsp;");
				for(var i=0;i<pp.flags[idname].child.length;i++){
					var num = pp.flags[idname].child[i];
					var el = newEL('div').attr("class",((num==pp.getVal(idname))?"flagsel":"flag")).attr("id","up_"+idname+"_"+num)
										 .html(pp.getMenuStr(""+idname+"_"+num)).appendTo($("#usepanel"))
										 .click(pp.setVal.bind(pp,idname,num)).unselectable();
					$("#usepanel").append(" ");
				}
				$("#usepanel").append("<br>\n");
			}
			else if(pp.type(idname)==2){
				$("#checkpanel").append("<input type=\"checkbox\" id=\"ck_"+idname+"\""+(pp.getVal(idname)?' checked':'')+"> ")
								.append("<span id=\"cl_"+idname+"\"> "+pp.getLabel(idname)+"</span>");
				if(idname=="irowake"){
					$("#checkpanel").append("<input type=button id=\"ck_irowake2\" value=\"�F�������Ȃ���\" onClick=\"javascript:menu.ex.irowakeRemake();\">");
					this.addButtons($("#ck_irowake2"), "�F�������Ȃ���", "Change the color of Line");
				}
				$("#checkpanel").append("<br>\n");
				$("#ck_"+idname).click(this.checkclick.bind(this,idname));
			}
		}

		$("#translation").css("position","absolute").css("cursor","pointer")
						 .css("font-size","10pt").css("color","green").css("background-color","#dfdfdf")
						 .click(this.translate.bind(this)).unselectable();
		if(k.EDITOR){ $("#timerpanel,#separator2").hide();}
		if(k.irowake!=0){
			$("#btnarea").append("<input type=\"button\" id=\"btncolor2\" value=\"�F�������Ȃ���\">");
			$("#btncolor2").click(menu.ex.irowakeRemake).hide();
			menu.addButtons($("#btncolor2"), "�F�������Ȃ���", "Change the color of Line");
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
		var self = this;
		// Popup���j���[�𓮂����C�x���g
		var popupfunc = function(){
			$(this).mousedown(self.titlebardown.ebind(self)).mouseup(self.titlebarup.ebind(self))
				   .mouseout(self.titlebarout.ebind(self)).mousemove(self.titlebarmove.ebind(self))
				   .unselectable();
		};
		$("div.titlebar,#credir3_1").each(popupfunc);

		//---------------------------------------------------------------------------
		//// form�{�^���̃C�x���g
		var px = this.popclose.ebind(this);

		// �Ֆʂ̐V�K�쐬
		$(document.newboard.newboard).click(this.ex.newboard.ebind(this.ex));
		$(document.newboard.cancel).click(px);

		// URL����
		$(document.urlinput.urlinput).click(this.ex.urlinput.ebind(this.ex));
		$(document.urlinput.cancel).click(px);

		// URL�o��
		$(document.urloutput.ta).before(newEL('div').attr('id','outbtnarea'));
		var ib = function(name, strJP, strEN, eval){ if(!eval) return;
			var btn = newEL('input').attr('type','button').attr("name",name).click(this.ex.urloutput.ebind(this.ex));
			$("#outbtnarea").append(btn).append("<br>");
			this.addButtons(btn, strJP, strEN);
		}.bind(this);
		ib('pzprv3', "�ς��Ղ�v3��URL���o�͂���", "Output PUZ-PRE v3 URL", true);
		ib('pzprapplet', "�ς��Ղ�\(�A�v���b�g\)��URL���o�͂���", "Output PUZ-PRE(JavaApplet) URL", !k.ispzprv3ONLY);
		ib('kanpen', "�J���y����URL���o�͂���", "Output Kanpen URL", k.isKanpenExist);
		ib('heyaapp', "�ւ�킯�A�v���b�g��URL���o�͂���", "Output Heyawake-Applet URL", (k.puzzleid=="heyawake"));
		ib('pzprv3edit', "�ς��Ղ�v3�̍ĕҏW�pURL���o�͂���", "Output PUZ-PRE v3 Re-Edit URL", true);
		$("#outbtnarea").append("<br>\n");
		$(document.urloutput.openurl).click(this.ex.openurl.ebind(this.ex));
		$(document.urloutput.close).click(px);

		this.addButtons($(document.urloutput.openurl), "����URL���J��", "Open this URL on another window/tab");
		this.addButtons($(document.urloutput.close),   "����", "Close");

		// �t�@�C������
		$(document.fileform.filebox).change(this.ex.fileopen.ebind(this.ex));
		$(document.fileform.close).click(px);

		// �f�[�^�x�[�X���J��
		$(document.database.sorts   ).change(fio.displayDataTableList.ebind(fio));
		$(document.database.datalist).change(fio.selectDataTable.ebind(fio));
		$(document.database.tableup ).click(fio.upDataTable.ebind(fio));
		$(document.database.tabledn ).click(fio.downDataTable.ebind(fio));
		$(document.database.open    ).click(fio.openDataTable.ebind(fio));
		$(document.database.save    ).click(fio.saveDataTable.ebind(fio));
		$(document.database.comedit ).click(fio.editComment.ebind(fio));
		$(document.database.difedit ).click(fio.editDifficult.ebind(fio));
		$(document.database.del     ).click(fio.deleteDataTable.ebind(fio));
		$(document.database.close   ).click(px);

		// �Ֆʂ̒���
		var pa = this.ex.popupadjust.ebind(this.ex);
		$(document.adjust.expandup).click(pa);
		$(document.adjust.expanddn).click(pa);
		$(document.adjust.expandlt).click(pa);
		$(document.adjust.expandrt).click(pa);
		$(document.adjust.reduceup).click(pa);
		$(document.adjust.reducedn).click(pa);
		$(document.adjust.reducelt).click(pa);
		$(document.adjust.reducert).click(pa);
		$(document.adjust.close   ).click(px);

		// ���]�E��]
		$(document.flip.turnl).click(pa);
		$(document.flip.turnr).click(pa);
		$(document.flip.flipy).click(pa);
		$(document.flip.flipx).click(pa);
		$(document.flip.close).click(px);

		// credit
		$(document.credit.close).click(px);

		// �\���T�C�Y
		$(document.dispsize.dispsize).click(this.ex.dispsize.ebind(this));
		$(document.dispsize.cancel).click(px);
	},
	popclose : function(){
		if(this.pop){
			this.pop.css("visibility","hidden");
			this.pop = '';
			this.menuclear();
			this.isptitle = 0;
			k.enableKey = true;
		}
	},

	//---------------------------------------------------------------------------
	// menu.titlebardown() Popup�^�C�g���o�[���N���b�N�����Ƃ��̓�����s��
	// menu.titlebarup()   Popup�^�C�g���o�[�Ń{�^���𗣂����Ƃ��̓�����s��
	// menu.titlebarout()  Popup�^�C�g���o�[����}�E�X�����ꂽ�Ƃ��̓�����s��
	// menu.titlebarmove() Popup�^�C�g���o�[����}�E�X�𓮂������Ƃ��|�b�v�A�b�v���j���[�𓮂���
	//---------------------------------------------------------------------------
	titlebardown : function(e){
		this.isptitle = 1;
		this.offset.x = mv.pointerX(e) - parseInt(this.pop.css("left"));
		this.offset.y = mv.pointerY(e) - parseInt(this.pop.css("top"));
	},
	titlebarup   : function(e){ this.isptitle = 0; },
	titlebarout  : function(e){ if(this.pop && !this.insideOf(this.pop, e)){ this.isptitle = 0;} },
	titlebarmove : function(e){
		if(this.pop && this.isptitle){
			this.pop.css("left", (mv.pointerX(e) - this.offset.x));
			this.pop.css("top" , (mv.pointerY(e) - this.offset.y));
		}
	},

//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------

	//---------------------------------------------------------------------------
	// menu.buttonarea()        �{�^���̏����ݒ���s��
	// menu.addButtons()        �{�^���̏���ϐ��ɓo�^����
	// menu.addLAbels()         ���x���̏���ϐ��ɓo�^����
	// menu.setDefaultButtons() �{�^����btnstack�ɐݒ肷��
	// menu.setDefaultLabels()  ���x����spanstack�ɐݒ肷��
	//---------------------------------------------------------------------------
	buttonarea : function(){
		this.addButtons($("#btncheck").click(ans.check.bind(ans)),              "�`�F�b�N", "Check");
		this.addButtons($("#btnundo").click(um.undo.bind(um)),                  "��",       "<-");
		this.addButtons($("#btnredo").click(um.redo.bind(um)),                  "�i",       "->");
		this.addButtons($("#btnclear").click(menu.ex.ACconfirm.bind(menu.ex)),  "�񓚏���", "Erase Answer");
		this.addButtons($("#btnclear2").click(menu.ex.ASconfirm.bind(menu.ex)), "�⏕����", "Erase Auxiliary Marks");
		$("#btnarea,#btnundo,#btnredo,#btnclear,#btnclear2").unselectable();

		this.setDefaultButtons();
		this.setDefaultLabels();
	},
	addButtons : function(jqel, strJP, strEN){ this.btnstack.push({el:jqel, str:{ja:strJP, en:strEN}}); },
	addLabels  : function(jqel, strJP, strEN){ this.labelstack.push({el:jqel, str:{ja:strJP, en:strEN}}); },

	setDefaultButtons : function(){
		var t = this.addButtons.bind(this);
		t($(document.newboard.newboard), "�V�K�쐬",   "Create");
		t($(document.newboard.cancel),   "�L�����Z��", "Cancel");
		t($(document.urlinput.urlinput), "�ǂݍ���",   "Import");
		t($(document.urlinput.cancel),   "�L�����Z��", "Cancel");
		t($(document.fileform.button),   "����",     "Close");
		t($(document.database.save),     "�Ֆʂ�ۑ�", "Save");
		t($(document.database.comedit),  "�R�����g��ҏW����", "Edit Comment");
		t($(document.database.difedit),  "��Փx��ݒ肷��",   "Set difficulty");
		t($(document.database.open),     "�f�[�^��ǂݍ���",   "Load");
		t($(document.database.del),      "�폜",       "Delete");
		t($(document.database.close),    "����",     "Close");
		t($(document.adjust.expandup),   "��",         "UP");
		t($(document.adjust.expanddn),   "��",         "Down");
		t($(document.adjust.expandlt),   "��",         "Left");
		t($(document.adjust.expandrt),   "�E",         "Right");
		t($(document.adjust.reduceup),   "��",         "UP");
		t($(document.adjust.reducedn),   "��",         "Down");
		t($(document.adjust.reducelt),   "��",         "Left");
		t($(document.adjust.reducert),   "�E",         "Right");
		t($(document.adjust.close),      "����",     "Close");
		t($(document.flip.turnl),        "��90����]", "Turn left by 90 degree");
		t($(document.flip.turnr),        "�E90����]", "Turn right by 90 degree");
		t($(document.flip.flipy),        "�㉺���]",   "Flip upside down");
		t($(document.flip.flipx),        "���E���]",   "Flip leftside right");
		t($(document.flip.close),        "����",     "Close");
		t($(document.dispsize.dispsize), "�ύX����",   "Change");
		t($(document.dispsize.cancel),   "�L�����Z��", "Cancel");
		t($(document.credit.close),      "����",     "OK");
	},
	setDefaultLabels : function(){
		var t = this.addLabels.bind(this);
		t($("#translation"), "English",                      "���{��");
		t($("#bar1_1"),      "&nbsp;�Ֆʂ̐V�K�쐬",         "&nbsp;Createing New Board");
		t($("#pop1_1_cap0"), "�Ֆʂ�V�K�쐬���܂��B",       "Create New Board.");
		t($("#pop1_1_cap1"), "�悱",                         "Cols");
		t($("#pop1_1_cap2"), "����",                         "Rows");
		t($("#bar1_2"),      "&nbsp;URL����",                "&nbsp;Import from URL");
		t($("#pop1_2_cap0"), "URL�������ǂݍ��݂܂��B",  "Import a question from URL.");
		t($("#bar1_3"),      "&nbsp;URL�o��",                "&nbsp;Export URL");
		t($("#bar1_4"),      "&nbsp;�t�@�C�����J��",         "&nbsp;Open file");
		t($("#pop1_4_cap0"), "�t�@�C���I��",                 "Choose file");
		t($("#bar1_8"),      "&nbsp;�f�[�^�x�[�X�̊Ǘ�",     "&nbsp;Database Management");
		t($("#pop1_8_com"),  "�R�����g:",                    "Comment:");
		t($("#bar2_1"),      "&nbsp;�Ֆʂ̒���",             "&nbsp;Adjust the board");
		t($("#pop2_1_cap0"), "�Ֆʂ̒������s���܂��B",       "Adjust the board.");
		t($("#pop2_1_cap1"), "�g��",                         "Expand");
		t($("#pop2_1_cap2"), "�k��",                         "Reduce");
		t($("#bar2_2"),      "&nbsp;���]�E��]",             "&nbsp;Flip/Turn the board");
		t($("#pop2_2_cap0"), "�Ֆʂ̉�]�E���]���s���܂��B", "Flip/Turn the board.");
		t($("#bar4_1"),      "&nbsp;�\���T�C�Y�̕ύX",       "&nbsp;Change size");
		t($("#pop4_1_cap0"), "�\���T�C�Y��ύX���܂��B",     "Change the display size.");
		t($("#pop4_1_cap1"), "�\���T�C�Y",                   "Display size");
		t($("#bar3_1"),      "&nbsp;credit",                 "&nbsp;credit");
		t($("#credit3_1"), "�ς��Ղ�v3 "+pzprversion+"<br>\n<br>\n�ς��Ղ�v3�� �͂���/�A�����j���쐬���Ă��܂��B<br>\n���C�u�����Ƃ���jQuery1.3.2, uuCanvas1.0, <br>Google Gears��\n�g�p���Ă��܂��B<br>\n<br>\n",
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
		$("#title2").html(base.gettitle());
		$("#expression").html(base.expression[this.language]);

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
};
Properties.prototype = {
	reset : function(){
		this.flags    = [];
		this.flaglist = [];
	},

	// pp.setMenuStr() �Ǘ��p�l���ƑI���^/�`�F�b�N�^�T�u���j���[�ɕ\�����镶�����ݒ肷��
	addSmenuToFlags : function(idname, parent)       { this.addToFlags(idname, parent, 0, 0);},
	addCheckToFlags : function(idname, parent, first){ this.addToFlags(idname, parent, 2, first);},
	addCaptionToFlags     : function(idname, parent) { this.addToFlags(idname, parent, 3, 0);},
	addSeparatorToFlags   : function(idname, parent) { this.addToFlags(idname, parent, 5, 0);},
	addUseToFlags   : function(idname, parent, first, child){
		this.addToFlags(idname, parent, 1, first);
		this.flags[idname].child = child;
	},
	addUseChildrenToFlags : function(idname, parent){
		if(!this.flags[idname]){ return;}
		for(var i=0;i<this.flags[idname].child.length;i++){
			var num = this.flags[idname].child[i];
			this.addToFlags(""+idname+"_"+num, parent, 4, num);
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
	// pp.getVal()     �e�t���O��val�̒l��Ԃ�
	// pp.setVal()     �e�t���O�̐ݒ�l��ݒ肷��
	//---------------------------------------------------------------------------
	getMenuStr : function(idname){ return this.flags[idname].str[menu.language].menu; },
	getLabel   : function(idname){ return this.flags[idname].str[menu.language].label;},
	type : function(idname){ return this.flags[idname].type;},

	getVal : function(idname)  { return this.flags[idname]?this.flags[idname].val:0;},
	setVal : function(idname, newval){
		if(!this.flags[idname]){ return;}
		else if(this.type(idname)==1 || this.type(idname)==2){
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
		var as = this.addSmenuToFlags.bind(this),
			au = this.addUseToFlags.bind(this),
			ac = this.addCheckToFlags.bind(this),
			aa = this.addCaptionToFlags.bind(this),
			ai = this.addUseChildrenToFlags.bind(this),
			ap = this.addSeparatorToFlags.bind(this);

		au('mode','setting',(k.editmode?1:3),[1,3]);

		puz.menufix();	// �e�p�Y�����Ƃ̃��j���[�ǉ�

		ac('autocheck','setting',k.autocheck);
		ac('lrcheck','setting',false);
		ac('keypopup','setting',kp.defaultdisp);
		au('language','setting',0,[0,1]);
		if(k.PLAYER){ delete this.flags['mode'];}
		if(!kp.ctl[1].enable && !kp.ctl[3].enable){ delete this.flags['keypopup'];}

		as('newboard', 'file');
		as('urlinput', 'file');
		as('urloutput', 'file');
		ap('sep_2','file');
		as('fileopen', 'file');
		as('filesave', 'file');
		as('database', 'file');
		ap('sep_3','file');
		as('fileopen2', 'file');
		as('filesave2', 'file');
		if(fio.DBtype==0){ delete this.flags['database'];}
		if(!k.isKanpenExist || (k.puzzleid=="nanro"||k.puzzleid=="ayeheya"||k.puzzleid=="kurochute")){
			delete this.flags['fileopen2']; delete this.flags['filesave2']; delete this.flags['sep_3'];
		}

		as('adjust', 'edit');
		as('turn', 'edit');

		au('size','disp',k.widthmode,[0,1,2,3,4]);
		ap('sep_4','disp');
		ac('irowake','disp',(k.irowake==2?true:false));
		ap('sep_5','disp');
		as('manarea', 'disp');
		if(k.irowake==0){ delete this.flags['irowake']; delete this.flags['sep_4'];}

		as('dispsize', 'size');
		aa('cap_dispmode', 'size');
		ai('size','size');

		ai('mode','mode');

		ai('language','language');

		as('credit', 'other');
		aa('cap_others1', 'other');
		as('jumpv3', 'other');
		as('jumptop', 'other');
		as('jumpblog', 'other');

		this.setStringToFlags();
	},
	setStringToFlags : function(){
		var sm = this.setMenuStr.bind(this),
			sl = this.setLabel.bind(this);

		sm('size', '�\���T�C�Y', 'Cell Size');
		sm('size_0', '�T�C�Y �ɏ�', 'Ex Small');
		sm('size_1', '�T�C�Y ��', 'Small');
		sm('size_2', '�T�C�Y �W��', 'Normal');
		sm('size_3', '�T�C�Y ��', 'Large');
		sm('size_4', '�T�C�Y ����', 'Ex Large');

		sm('irowake', '���̐F����', 'Color coding');
		sl('irowake', '���̐F����������', 'Color each lines');

		sm('mode', '���[�h', 'mode');
		sl('mode', '���[�h', 'mode');
		sm('mode_1', '���쐬���[�h', 'Edit mode');
		sm('mode_3', '�񓚃��[�h', 'Answer mode');

		sm('autocheck', '������������', 'Auto Answer Check');

		sm('lrcheck', '�}�E�X���E���]', 'Mouse button inversion');
		sl('lrcheck', '�}�E�X�̍��E�{�^���𔽓]����', 'Invert button of the mouse');

		sm('keypopup', '�p�l������', 'Panel inputting');
		sl('keypopup', '�����E�L�����p�l���œ��͂���', 'Input numbers by panel');

		sm('language', '����', 'Language');
		sm('language_0', '���{��', '���{��');
		sm('language_1', 'English', 'English');

		sm('newboard', '�V�K�쐬', 'New Board');
		sm('urlinput', 'URL����', 'Import from URL');
		sm('urloutput', 'URL�o��', 'Export URL');
		sm('fileopen', '�t�@�C�����J��', 'Open the file');
		sm('filesave', '�t�@�C���ۑ�', 'Save the file as ...');
		sm('database', '�f�[�^�x�[�X�̊Ǘ�', 'Database Management');
		sm('fileopen2', 'pencilbox�̃t�@�C�����J��', 'Open the pencilbox file');
		sm('filesave2', 'pencilbox�̃t�@�C����ۑ�', 'Save the pencilbox file as ...');
		sm('adjust', '�Ֆʂ̒���', 'Adjust the Board');
		sm('turn', '���]�E��]', 'Filp/Turn the Board');
		sm('dispsize', '�T�C�Y�w��', 'Cell Size');
		sm('cap_dispmode', '&nbsp;�\�����[�h', '&nbsp;Display mode');
		sm('manarea', '�Ǘ��̈���B��', 'Hide Management Area');
		sm('credit', '�ς��Ղ�v3�ɂ���', 'About PUZ-PRE v3');
		sm('cap_others1', '&nbsp;�����N', '&nbsp;Link');
		sm('jumpv3', '�ς��Ղ�v3�̃y�[�W��', 'Jump to PUZ-PRE v3 page');
		sm('jumptop', '�A�����j�ۊǌ�TOP��', 'Jump to indi.s58.xrea.com');
		sm('jumpblog', '�͂��ϓ��L(blog)��', 'Jump to my blog');

		sm('eval', '�e�X�g�p', 'for Evaluation');
	},

//--------------------------------------------------------------------------------------------------------------
	// submenu����Ăяo�����֐�����
	funcs : {
		urlinput  : function(){ menu.pop = $("#pop1_2");},
		urloutput : function(){ menu.pop = $("#pop1_3"); document.urloutput.ta.value = "";},
		filesave  : function(){ menu.ex.filesave();},
		database  : function(){ menu.pop = $("#pop1_8"); fio.getDataTableList();},
		filesave2 : function(){ if(fio.kanpenSave){ menu.ex.filesave2();}},
		adjust    : function(){ menu.pop = $("#pop2_1");},
		turn      : function(){ menu.pop = $("#pop2_2");},
		credit    : function(){ menu.pop = $("#pop3_1");},
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
			menu.pop = $("#pop1_1");
			if(k.puzzleid!="sudoku"){
				document.newboard.col.value = k.qcols;
				document.newboard.row.value = k.qrows;
			}
			k.enableKey = false;
		},
		fileopen : function(){
			document.fileform.pencilbox.value = "0";
			if(k.br.IE || k.br.Gecko || k.br.Opera){ if(!menu.pop){ menu.pop = $("#pop1_4");}}
			else{ if(!menu.pop){ document.fileform.filebox.click();}}
		},
		fileopen2 : function(){
			if(!fio.kanpenOpen){ return;}
			document.fileform.pencilbox.value = "1";
			if(k.br.IE || k.br.Gecko || k.br.Opera){ if(!menu.pop){ menu.pop = $("#pop1_4");}}
			else{ if(!menu.pop){ document.fileform.filebox.click();}}
		},
		dispsize : function(){
			menu.pop = $("#pop4_1");
			document.dispsize.cs.value = k.def_csize;
			k.enableKey = false;
		},
		keypopup : function(){
			var f = kp.ctl[pp.flags['mode'].val].enable;
			$("#ck_keypopup").attr("disabled", f?"":"true");
			$("#cl_keypopup").css("color",f?"black":"silver");
		}
	}
};
