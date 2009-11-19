//
// �p�Y���ŗL�X�N���v�g�� �C�`�}�K/���΃C�`�}�K�� ichimaga.js v3.2.3
//
Puzzles.ichimaga = function(){ };
Puzzles.ichimaga.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
		k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
		k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
		k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
		k.isLineCross     = 0;	// 1:������������p�Y��
		k.isCenterLine    = 1;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

		k.dispzero      = 0;	// 1:0��\�����邩�ǂ���
		k.isDispHatena  = 0;	// 1:qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber   = 0;	// 1:�񓚂ɐ�������͂���p�Y��
		k.isArrowNumber = 0;	// 1:������������͂���p�Y��
		k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
		k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
		k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

		k.BlackCell     = 0;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

		k.fstruct = ["others","cellqnum","borderline"];

		//k.def_csize = 36;
		k.def_psize = 16;
		//k.area = { bcell:0, wcell:0, number:0};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		base.setTitle("�C�`�}�K/���΃C�`�}�K","Ichimaga / Magnetic Ichimaga");
		base.setExpression("�@���h���b�O�Ő����A�E�h���b�O�ŕ⏕�L�������͂ł��܂��B",
						   " Left Button Drag to input lines, Right to input auxiliary marks.");
		base.setFloatbgcolor("rgb(0, 224, 0)");
	},
	menufix : function(){
		if(k.EDITOR){
			pp.addSelect('puztype','setting',1,[1,2,3], '�p�Y���̎��', 'Kind of the puzzle');
			pp.setLabel ('puztype', '�p�Y���̎��', 'Kind of the puzzle');

			pp.addChild('puztype_1', 'puztype', '�C�`�}�K', 'Ichimaga');
			pp.addChild('puztype_2', 'puztype', '���΃C�`�}�K', 'Magnetic Ichimaga');
			pp.addChild('puztype_3', 'puztype', '������', 'Crossing Ichimaga');
		}
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if(k.editmode) this.inputqnum();
			else if(k.playmode){
				if(this.btn.Left) this.inputLine();
				else if(this.btn.Right) this.inputpeke();
			}
		};
		mv.mouseup = function(){ };
		mv.mousemove = function(){
			if(k.playmode){
				if(this.btn.Left) this.inputLine();
				else if(this.btn.Right) this.inputpeke();
			}
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.playmode){ return;}
			if(this.key_inputdirec(ca)){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca);
		};

		bd.maxnum = 4;
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_LIGHT;

		pc.fontErrcolor = pc.fontcolor;
		pc.fontsizeratio = 0.85;
		pc.circleratio = [0.38, 0.38];

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawDashLines(x1,y1,x2,y2);
			this.drawLines(x1,y1,x2,y2);

			this.drawPekes(x1,y1,x2,y2,0);

			this.drawCircledNumbers(x1,y1,x2,y2);

			this.drawTarget(x1,y1,x2,y2);
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==0 || type==1){ this.decode4Cell(bstr);}

			if(k.EDITOR){
				if     (this.checkpflag("m")){ pp.setVal('puztype',2);}
				else if(this.checkpflag("x")){ pp.setVal('puztype',3);}
				else                         { pp.setVal('puztype',1);}
			}
			else{
				if     (this.checkpflag("m")){ base.setTitle("���΃C�`�}�K","Magnetic Ichimaga");}
				else if(this.checkpflag("x")){ base.setTitle("���Ȃ����Č����������","Crossing Ichimaga");}
				else                         { base.setTitle("�C�`�}�K","Ichimaga");}
				document.title = base.gettitle();
				ee('title2').el.innerHTML = base.gettitle();
			}
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			var pzlflag="";
			if     (pp.getVal('puztype')==2){ pzlflag="/m";}
			else if(pp.getVal('puztype')==3){ pzlflag="/x";}

			return ""+pzlflag+"/"+k.qcols+"/"+k.qrows+"/"+this.encode4Cell();
		};

		//---------------------------------------------------------
		fio.decodeOthers = function(array){
			if(array.length<1){ return false;}

			if(k.EDITOR){
				if     (array[0]=="mag")  { pp.setVal('puztype',2);}
				else if(array[0]==k.CROSS){ pp.setVal('puztype',3);}
				else                      { pp.setVal('puztype',1);}
			}
			else{
				if     (array[0]=="mag")  { base.setTitle("���΃C�`�}�K","Magnetic Ichimaga");}
				else if(array[0]==k.CROSS){ base.setTitle("���Ȃ����Č����������","Crossing Ichimaga");}
				else                      { base.setTitle("�C�`�}�K","Ichimaga");}
				document.title = base.gettitle();
				ee('title2').el.innerHTML = base.gettitle();
			}
			return true;
		};
		fio.encodeOthers = function(){
			if     (pp.getVal('puztype')==2){ return "mag/";}
			else if(pp.getVal('puztype')==3){ return "cross/";}
			return "def/";
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkLcntCell(3) ){
				this.setAlert('���򂵂Ă����������܂��B', 'There is a branch line.'); return false;
			}
			if( !this.iscross() && !this.checkLcntCell(4) ){
				this.setAlert('�����������Ă��܂��B', 'There is a crossing line.'); return false;
			}

			var saved = this.checkFireflies();
			if( !this.checkErrorFlag(saved,3) ){
				this.setAlert('�����������m�����Ōq�����Ă��܂��B', 'Same numbers are connected each other.'); return false;
			}
			if( !this.checkErrorFlag(saved,2) ){
				this.setAlert('����2��ȏ�Ȃ����Ă��܂��B', 'The number of curves is twice or more.'); return false;
			}

			this.performAsLine = true
			if( !this.checkConnectedLine() ){
				this.setAlert('�����S�̂ň�Ȃ���ɂȂ��Ă��܂���B', 'All lines and circles are not connected each other.'); return false;
			}

			if( !this.checkErrorFlag(saved,1) ){
				this.setAlert('�����r���œr�؂�Ă��܂��B', 'There is a dead-end line.'); return false;
			}

			if( !this.checkAllCell( function(c){ return bd.QnC(c)>0&&bd.QnC(c)!=line.lcntCell(c); } ) ){
				this.setAlert('������o����̖{��������������܂���B', 'The number is not equal to the number of lines out of the circle.'); return false;
			}

			if( !this.checkLcntCell(1) ){
				this.setAlert('�����r���œr�؂�Ă��܂��B', 'There is a dead-end line.'); return false;
			}

			if( !this.checkAllCell( function(c){ return bd.QnC(c)!=-1&&line.lcntCell(c)==0; } ) ){
				this.setAlert('����������o�Ă��܂���B', 'There is a lonely circle.'); return false;
			}

			return true;
		};
		ans.check1st = function(){ return true;};
		ans.ismag    = function(){ return ((k.EDITOR&&pp.getVal('puztype')==2)||(k.PLAYER&&enc.checkpflag("m")));};
		ans.iscross  = function(){ return ((k.EDITOR&&pp.getVal('puztype')==3)||(k.PLAYER&&enc.checkpflag("x")));};
		ans.isnormal = function(){ return ((k.EDITOR&&pp.getVal('puztype')==1)||(k.PLAYER&&!enc.checkpflag("m")&&!enc.checkpflag("x")));};

		ans.checkLcntCell = function(val){
			if(line.ltotal[val]==0){ return true;}
			for(var c=0;c<bd.cellmax;c++){
				if(bd.QnC(c)==-1 && line.lcntCell(c)==val){
					bd.sErBAll(2);
					this.setCellLineError(c,false);
					return false;
				}
			}
			return true;
		};

		ans.checkFireflies = function(){
			var saved = {errflag:0,cells:[],idlist:[],check:[]};
			var visited = [];
			for(var i=0;i<bd.bdmax;i++){ saved.check[i]=0; visited[i]=0;}

			for(var c=0;c<bd.cellmax;c++){
				if(bd.QnC(c)==-1){ continue;}

				var bx=bd.cell[c].cx*2+1, by=bd.cell[c].cy*2+1;
				var dir4id = [bd.bnum(bx,by-1),bd.bnum(bx,by+1),bd.bnum(bx-1,by),bd.bnum(bx+1,by)];

				for(var a=0;a<4;a++){
					if(dir4id[a]==-1||!bd.isLine(dir4id[a])||visited[dir4id[a]]!=0){ continue;}

					var ccnt=0;	// curve count.
					var idlist = [];
					var dir=a+1;
					bx=bd.cell[c].cx*2+1, by=bd.cell[c].cy*2+1;
					while(1){
						switch(dir){ case 1: by--; break; case 2: by++; break; case 3: bx--; break; case 4: bx++; break;}
						if((bx+by)%2==0){
							var cc = bd.cnum(mf(bx/2),mf(by/2));
							if     (bd.QnC(cc)!=-1){ break;}
							else if(line.lcntCell(cc)==4){ }
							else if(dir!=1 && bd.isLine(bd.bnum(bx,by+1))){ if(dir!=2){ ccnt++;} dir=2;}
							else if(dir!=2 && bd.isLine(bd.bnum(bx,by-1))){ if(dir!=1){ ccnt++;} dir=1;}
							else if(dir!=3 && bd.isLine(bd.bnum(bx+1,by))){ if(dir!=4){ ccnt++;} dir=4;}
							else if(dir!=4 && bd.isLine(bd.bnum(bx-1,by))){ if(dir!=3){ ccnt++;} dir=3;}
						}
						else{
							var id = bd.bnum(bx,by);
							if(!bd.isLine(id)){ break;}
							visited[i]=1;
							idlist.push(id);
						}
					}

					for(var i=0;i<idlist.length;i++){ saved.check[idlist[i]]=2;}

					var cc = bd.cnum(mf(bx/2),mf(by/2));
					if(idlist.length>0 && (bx+by)%2==1 && saved.errflag==0){
						saved = {errflag:1,cells:[c],idlist:idlist,check:saved.check};
					}
					else if(idlist.length>0 && (bx+by)%2==0 && bd.QnC(c)!=-2 && ccnt>1 && saved.errflag<=1){
						saved = {errflag:2,cells:[c,cc],idlist:idlist,check:saved.check};
						if(!this.ismag()){ return saved;}
					}
					else if(this.ismag() && bd.QnC(c)!=-2 && bd.QnC(c)==bd.QnC(cc) && saved.errflag<=2 )
					{
						saved = {errflag:3,cells:[c,cc],idlist:idlist,check:saved.check};
						return saved;
					}
				}
			}
			return saved;
		};
		ans.checkErrorFlag = function(saved, val){
			if(saved.errflag==val){
				bd.sErC(saved.cells,1);
				bd.sErBAll(2);
				bd.sErB(saved.idlist,1);
				return false;
			}
			return true;
		};

		ans.checkConnectedLine = function(){
			var lcnt=0;
			var visited = new AreaInfo();
			for(var id=0;id<bd.bdmax;id++){ if(bd.isLine(id)){ visited.id[id]=0; lcnt++;}else{ visited.id[id]=-1;} }
			var fc=-1;
			for(var c=0;c<bd.cellmax;c++){ if(bd.QnC(c)!=-1 && line.lcntCell(c)>0){ fc=c; break;} }
			if(fc==-1){ return true;}

			this.cl0(visited.id, bd.cell[fc].cx*2+1, bd.cell[fc].cy*2+1,0);
			var lcnt2=0, idlist=[];
			for(var id=0;id<bd.bdmax;id++){ if(visited.id[id]==1){ lcnt2++; idlist.push(id);} }

			if(lcnt!=lcnt2){
				bd.sErBAll(2);
				bd.sErB(idlist,1);
				return false;
			}
			return true;
		};
		ans.cl0 = function(check,bx,by,dir){
			while(1){
				switch(dir){ case 1: by--; break; case 2: by++; break; case 3: bx--; break; case 4: bx++; break;}
				if((bx+by)%2==0){
					if(bd.QnC(bd.cnum(mf(bx/2),mf(by/2)))!=-1){
						if(bd.isLine(bd.bnum(bx,by-1))){ this.cl0(check,bx,by,1);}
						if(bd.isLine(bd.bnum(bx,by+1))){ this.cl0(check,bx,by,2);}
						if(bd.isLine(bd.bnum(bx-1,by))){ this.cl0(check,bx,by,3);}
						if(bd.isLine(bd.bnum(bx+1,by))){ this.cl0(check,bx,by,4);}
						break;
					}
					else if(line.lcntCell(bd.cnum(mf(bx/2),mf(by/2)))==4){ }
					else if(dir!=1 && bd.isLine(bd.bnum(bx,by+1))){ dir=2;}
					else if(dir!=2 && bd.isLine(bd.bnum(bx,by-1))){ dir=1;}
					else if(dir!=3 && bd.isLine(bd.bnum(bx+1,by))){ dir=4;}
					else if(dir!=4 && bd.isLine(bd.bnum(bx-1,by))){ dir=3;}
				}
				else{
					var id = bd.bnum(bx,by);
					if(check[id]>0 || !bd.isLine(id)){ break;}
					check[id]=1;
				}
			}
		};
	}
};
