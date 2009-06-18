//
// �p�Y���ŗL�X�N���v�g�� �C�`�}�K/���΃C�`�}�K�� ichimaga.js v3.2.0
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
		k.isborderCross   = 0;	// 1:������������p�Y��
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

		base.setTitle("�C�`�}�K/���΃C�`�}�K","Ichimaga / Magnetic Ichimaga");
		base.setExpression("�@���h���b�O�Ő����A�E�h���b�O�ŕ⏕�L�������͂ł��܂��B",
						   " Left Button Drag to input lines, Right to input auxiliary marks.");
		base.setFloatbgcolor("rgb(0, 224, 0)");
	},
	menufix : function(){
		if(k.callmode=="pmake"){
			pp.addUseToFlags('puztype','setting',1,[1,2,3]);
			pp.addUseChildrenToFlags('puztype','puztype');
			pp.setMenuStr('puztype', '�p�Y���̎��', 'Kind of the puzzle');
			pp.setLabel  ('puztype', '�p�Y���̎��', 'Kind of the puzzle');
			pp.setMenuStr('puztype_1', '�C�`�}�K', 'Ichimaga');
			pp.setMenuStr('puztype_2', '���΃C�`�}�K', 'Magnetic Ichimaga');
			pp.setMenuStr('puztype_3', '������', 'Crossing Ichimaga');
		}
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(k.mode==1) this.inputqnum(x,y,4);
			else if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};
		mv.mouseup = function(x,y){ };
		mv.mousemove = function(x,y){
			if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.mode==3){ return;}
			if(this.key_inputdirec(ca)){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca,4);
		};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(127, 127, 127)";
		pc.fontErrcolor = "black";
		pc.fontsizeratio = 0.85;

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawDashLines(x1,y1,x2,y2);
			this.drawLines(x1,y1,x2,y2);

			this.drawPekes(x1,y1,x2,y2,0);

			this.drawNumCells_circle(x1,y1,x2,y2);

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};

		pc.drawNumCells_circle = function(x1,y1,x2,y2){
			var rsize  = k.cwidth*0.40;
			var rsize2 = k.cwidth*0.36;

			var clist = this.cellinside(x1-2,y1-2,x2+2,y2+2,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.QnC(c)!=-1){
					var px=bd.cell[c].px()+mf(k.cwidth/2), py=bd.cell[c].py()+mf(k.cheight/2);

					g.fillStyle = this.Cellcolor;
					g.beginPath();
					g.arc(px, py, rsize , 0, Math.PI*2, false);
					if(this.vnop("c"+c+"_cira_",1)){ g.fill(); }

					if(bd.ErC(c)==1){ g.fillStyle = this.errbcolor1;}
					else{ g.fillStyle = "white";}
					g.beginPath();
					g.arc(px, py, rsize2, 0, Math.PI*2, false);
					if(this.vnop("c"+c+"_cirb_",1)){ g.fill(); }
				}
				else{ this.vhide(["c"+c+"_cira_", "c"+c+"_cirb_"]);}

				this.dispnumCell_General(c);
			}
			this.vinc();
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==0 || type==1){ this.decode4(bstr, bd.sQnC.bind(bd), k.qcols*k.qrows);}

			if(k.callmode=="pmake"){
				if     (this.checkpflag("m")){ menu.setVal('puztype',2);}
				else if(this.checkpflag("x")){ menu.setVal('puztype',3);}
				else                         { menu.setVal('puztype',1);}
			}
			else{
				if     (this.checkpflag("m")){ base.setTitle("���΃C�`�}�K","Magnetic Ichimaga");}
				else if(this.checkpflag("x")){ base.setTitle("���Ȃ����Č����������","Crossing Ichimaga");}
				else                         { base.setTitle("�C�`�}�K","Ichimaga");}
				document.title = base.gettitle();
				$("#title2").html(base.gettitle());
			}
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			var pzlflag="";
			if     (menu.getVal('puztype')==2){ pzlflag="/m";}
			else if(menu.getVal('puztype')==3){ pzlflag="/x";}

			return ""+pzlflag+"/"+k.qcols+"/"+k.qrows+"/"+this.encode4(bd.QnC.bind(bd), k.qcols*k.qrows);
		};

		//---------------------------------------------------------
		fio.decodeOthers = function(array){
			if(array.length<1){ return false;}

			if(k.callmode=="pmake"){
				if     (array[0]=="mag")  { menu.setVal('puztype',2);}
				else if(array[0]=="cross"){ menu.setVal('puztype',3);}
				else                      { menu.setVal('puztype',1);}
			}
			else{
				if     (array[0]=="mag")  { base.setTitle("���΃C�`�}�K","Magnetic Ichimaga");}
				else if(array[0]=="cross"){ base.setTitle("���Ȃ����Č����������","Crossing Ichimaga");}
				else                      { base.setTitle("�C�`�}�K","Ichimaga");}
				document.title = base.gettitle();
				$("#title2").html(base.gettitle());
			}
			return true;
		};
		fio.encodeOthers = function(){
			if     (menu.getVal('puztype')==2){ return "mag/";}
			else if(menu.getVal('puztype')==3){ return "cross/";}
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

			if( !this.checkAllCell( function(c){ return bd.QnC(c)>0&&bd.QnC(c)!=this.lcntCell(c); }.bind(this) ) ){
				this.setAlert('������o����̖{��������������܂���B', 'The number is not equal to the number of lines out of the circle.'); return false;
			}

			if( !this.checkLcntCell(1) ){
				this.setAlert('�����r���œr�؂�Ă��܂��B', 'There is a dead-end line.'); return false;
			}

			if( !this.checkAllCell( function(c){ return bd.QnC(c)!=-1&&this.lcntCell(c)==0; }.bind(this) ) ){
				this.setAlert('����������o�Ă��܂���B', 'There is a lonely circle.'); return false;
			}

			return true;
		};
		ans.check1st = function(){ return true;};
		ans.ismag    = function(){ return ((k.callmode=="pmake"&&menu.getVal('puztype')==2)||(k.callmode=="pplay"&&enc.checkpflag("m")));};
		ans.iscross  = function(){ return ((k.callmode=="pmake"&&menu.getVal('puztype')==3)||(k.callmode=="pplay"&&enc.checkpflag("x")));};
		ans.isnormal = function(){ return ((k.callmode=="pmake"&&menu.getVal('puztype')==1)||(k.callmode=="pplay"&&!enc.checkpflag("m")&&!enc.checkpflag("x")));};

		ans.checkLcntCell = function(val){
			if(this.lcnts.total[val]==0){ return true;}
			for(var c=0;c<bd.cell.length;c++){
				if(bd.QnC(c)==-1 && this.lcnts.cell[c]==val){
					bd.sErB(bd.borders,2);
					this.setCellLineError(c,false);
					return false;
				}
			}
			return true;
		};

		ans.checkFireflies = function(){
			var saved = {errflag:0,cells:new Array(),idlist:new Array(),area:new AreaInfo()};
			var visited = new Array();
			for(var i=0;i<bd.border.length;i++){ saved.area.check[i]=0; visited[i]=0;}

			for(var c=0;c<bd.cell.length;c++){
				if(bd.QnC(c)==-1){ continue;}

				var bx=bd.cell[c].cx*2+1, by=bd.cell[c].cy*2+1;
				var dir4id = [bd.bnum(bx,by-1),bd.bnum(bx,by+1),bd.bnum(bx-1,by),bd.bnum(bx+1,by)];

				for(var a=0;a<4;a++){
					if(dir4id[a]==-1||bd.LiB(dir4id[a])!=1||visited[dir4id[a]]!=0){ continue;}

					var ccnt=0;	// curve count.
					var idlist = new Array();
					var dir=a+1;
					bx=bd.cell[c].cx*2+1, by=bd.cell[c].cy*2+1;
					while(1){
						switch(dir){ case 1: by--; break; case 2: by++; break; case 3: bx--; break; case 4: bx++; break;}
						if((bx+by)%2==0){
							var cc = bd.cnum(mf(bx/2),mf(by/2));
							if     (bd.QnC(cc)!=-1){ break;}
							else if(this.lcntCell(cc)==4){ }
							else if(dir!=1 && bd.LiB(bd.bnum(bx,by+1))==1){ if(dir!=2){ ccnt++;} dir=2;}
							else if(dir!=2 && bd.LiB(bd.bnum(bx,by-1))==1){ if(dir!=1){ ccnt++;} dir=1;}
							else if(dir!=3 && bd.LiB(bd.bnum(bx+1,by))==1){ if(dir!=4){ ccnt++;} dir=4;}
							else if(dir!=4 && bd.LiB(bd.bnum(bx-1,by))==1){ if(dir!=3){ ccnt++;} dir=3;}
						}
						else{
							var id = bd.bnum(bx,by);
							if(bd.LiB(id)!=1){ break;}
							visited[i]=1;
							idlist.push(id);
						}
					}

					for(var i=0;i<idlist.length;i++){ saved.area.check[idlist[i]]=2;}

					var cc = bd.cnum(mf(bx/2),mf(by/2));
					if(idlist.length>0 && (bx+by)%2==1 && saved.errflag==0){
						saved = {errflag:1,cells:[c],idlist:idlist,area:saved.area};
					}
					else if(idlist.length>0 && (bx+by)%2==0 && bd.QnC(c)!=-2 && ccnt>1 && saved.errflag<=1){
						saved = {errflag:2,cells:[c,cc],idlist:idlist,area:saved.area};
						if(!this.ismag()){ return saved;}
					}
					else if(this.ismag() && bd.QnC(c)!=-2 && bd.QnC(c)==bd.QnC(cc) && saved.errflag<=2 )
					{
						saved = {errflag:3,cells:[c,cc],idlist:idlist,area:saved.area};
						return saved;
					}
				}
			}
			return saved;
		};
		ans.checkErrorFlag = function(saved, val){
			if(saved.errflag==val){
				bd.sErC(saved.cells,1);
				bd.sErB(bd.borders,2);
				bd.sErB(saved.idlist,1);
				return false;
			}
			return true;
		};

		ans.checkConnectedLine = function(){
			var lcnt=0;
			var visited = new AreaInfo();
			for(var id=0;id<bd.border.length;id++){ if(bd.LiB(id)==1){ visited.check[id]=0; lcnt++;}else{ visited.check[id]=-1;} }
			var fc=-1;
			for(var c=0;c<bd.cell.length;c++){ if(bd.QnC(c)!=-1 && this.lcntCell(c)>0){ fc=c; break;} }
			if(fc==-1){ return true;}

			this.cl0(visited,bd.cell[fc].cx*2+1,bd.cell[fc].cy*2+1,0);
			var lcnt2=0, idlist=new Array();
			for(var id=0;id<bd.border.length;id++){ if(visited.check[id]==1){ lcnt2++; idlist.push(id);} }

			if(lcnt!=lcnt2){
				bd.sErB(bd.borders,2);
				bd.sErB(idlist,1);
				return false;
			}
			return true;
		};
		ans.cl0 = function(area,bx,by,dir){
			while(1){
				switch(dir){ case 1: by--; break; case 2: by++; break; case 3: bx--; break; case 4: bx++; break;}
				if((bx+by)%2==0){
					if(bd.QnC(bd.cnum(mf(bx/2),mf(by/2)))!=-1){
						if(bd.LiB(bd.bnum(bx,by-1))==1){ this.cl0(area,bx,by,1);}
						if(bd.LiB(bd.bnum(bx,by+1))==1){ this.cl0(area,bx,by,2);}
						if(bd.LiB(bd.bnum(bx-1,by))==1){ this.cl0(area,bx,by,3);}
						if(bd.LiB(bd.bnum(bx+1,by))==1){ this.cl0(area,bx,by,4);}
						break;
					}
					else if(this.lcntCell(bd.cnum(mf(bx/2),mf(by/2)))==4){ }
					else if(dir!=1 && bd.LiB(bd.bnum(bx,by+1))==1){ dir=2;}
					else if(dir!=2 && bd.LiB(bd.bnum(bx,by-1))==1){ dir=1;}
					else if(dir!=3 && bd.LiB(bd.bnum(bx+1,by))==1){ dir=4;}
					else if(dir!=4 && bd.LiB(bd.bnum(bx-1,by))==1){ dir=3;}
				}
				else{
					var id = bd.bnum(bx,by);
					if(area.check[id]>0 || bd.LiB(id)!=1){ break;}
					area.check[id]=1;
				}
			}
		};
	}
};
