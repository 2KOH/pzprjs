//
// �p�Y���ŗL�X�N���v�g�� �V���J�V���J�� shakashaka.js v3.2.2
//
Puzzles.shakashaka = function(){ };
Puzzles.shakashaka.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
		k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 0;		// 1:Border/Line������\�ȃp�Y��
		k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
		k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
		k.isLineCross     = 0;	// 1:������������p�Y��
		k.isCenterLine    = 0;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

		k.dispzero      = 1;	// 1:0��\�����邩�ǂ���
		k.isDispHatena  = 0;	// 1:qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber   = 0;	// 1:�񓚂ɐ�������͂���p�Y��
		k.isArrowNumber = 0;	// 1:������������͂���p�Y��
		k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
		k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
		k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

		k.BlackCell     = 0;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 1;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

		k.fstruct = ["cellqnumb","cellqanssub"];

		//k.def_csize = 36;
		//k.def_psize = 24;
		//k.area = { bcell:0, wcell:0, number:0};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		base.setTitle("�V���J�V���J","ShakaShaka");
		base.setExpression("�@\"�N���b�N�����ʒu\"�ł̓}�X�ڂ̊p�̂ق����N���b�N���邱�ƂŎO�p�`�����͂ł��܂��B<br>�@\"�h���b�O����\"�ł͎΂�4�����Ƀh���b�O���ĎO�p�`����͂ł��܂��B",
						   " Click corner-side to input triangles if 'Position of Cell'.<br> Left Button Drag to skew-ward to input triangle if 'Drag Type'.");
		base.setFloatbgcolor("rgb(32, 32, 32)");
	},
	menufix : function(){
		pp.addUseToFlags('use','setting',1,[1,2,3]);
		pp.addUseChildrenToFlags('use','use');
		pp.setMenuStr('use', '�O�p�`�̓��͕��@', 'Input Triangle Type');
		pp.setLabel  ('use', '�O�p�`�̓��͕��@', 'Input Triangle Type');
		pp.setMenuStr('use_1', '�N���b�N�����ʒu', 'Position of Cell');
		pp.setMenuStr('use_2', '�h���b�O����', 'Drag Type');
		pp.setMenuStr('use_3', '1�{�^��', 'One Button');
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			this.firstPos = new Pos(x,y);

			if(k.mode==3) this.inputTriangle(x,y,0);
			if(k.mode==1){
				if(!kp.enabled()){ this.inputqnum(x,y,4);}
				else{ kp.display(x,y);}
			}
		};
		mv.mouseup = function(x,y){
			if(k.mode==3 && k.use==2 && this.notInputted()){
				this.inputTriangle(x,y,1);
			}
		};
		mv.mousemove = function(x,y){
			if(k.mode==3 && k.use==2 && this.firstPos.x != -1 && this.firstPos.y != -1){
				this.inputTriangle(x,y,0);
			}
		};
		mv.inputTriangle = function(x,y,flag){
			var cc = this.cellid( new Pos(x,y) );
			if(k.mode==3 && k.use==2){ cc = this.cellid( new Pos(this.firstPos.x,this.firstPos.y) );}

			if(cc==-1 || (k.use!=2 && cc==this.mouseCell)){ return;}
			if(bd.QnC(cc)!=-1){ return;}

			if(k.use==1){
				if(this.btn.Left){
					var xpos = x - k.p0.x-bd.cell[cc].cx*k.cwidth;
					var ypos = y - k.p0.y-bd.cell[cc].cy*k.cheight;
					if(xpos>0&&xpos<=k.cwidth/2){
						if(ypos>0&&ypos<=k.cheight/2){ this.inputData = 5;}
						else if(ypos>k.cheight/2){ this.inputData = 2;}
					}
					else if(xpos>k.cwidth/2){
						if(ypos>0&&ypos<=k.cheight/2){ this.inputData = 4;}
						else if(ypos>k.cheight/2){ this.inputData = 3;}
					}

					bd.sQaC(cc, (bd.QaC(cc)!=this.inputData?this.inputData:-1));
					bd.sQsC(cc, 0);
				}
				else if(this.btn.Right){
					bd.sQaC(cc, -1);
					bd.sQsC(cc, (bd.QsC(cc)==0?1:0));
				}
			}
			else if(k.use==2){
				if(flag==0){
					var moves = 12;
					if(x-this.firstPos.x <= -moves){
						if     (y-this.firstPos.y >=  moves){ bd.sQaC(cc,(bd.QaC(cc)!=2)?2:-1); bd.sQsC(cc,0); this.mousereset();}
						else if(y-this.firstPos.y <= -moves){ bd.sQaC(cc,(bd.QaC(cc)!=5)?5:-1); bd.sQsC(cc,0); this.mousereset();}
					}
					else if(x-this.firstPos.x >= moves){
						if     (y-this.firstPos.y >=  moves){ bd.sQaC(cc,(bd.QaC(cc)!=3)?3:-1); bd.sQsC(cc,0); this.mousereset();}
						else if(y-this.firstPos.y <= -moves){ bd.sQaC(cc,(bd.QaC(cc)!=4)?4:-1); bd.sQsC(cc,0); this.mousereset();}
					}
				}
				else if(flag==1){
					if(Math.abs(x-this.firstPos.x) <= 3 && Math.abs(y-this.firstPos.y) <= 3){
						if(bd.QsC(cc)==1){ bd.sQaC(cc,-1); bd.sQsC(cc,0);}
						else{ bd.sQaC(cc,-1); bd.sQsC(cc,1);}
					}
				}
			}
			else if(k.use==3){
				if(this.btn.Left){
					if(bd.QsC(cc)==1)      { bd.sQaC(cc,-1); bd.sQsC(cc,0);}
					else if(bd.QaC(cc)==-1){ bd.sQaC(cc, 2); bd.sQsC(cc,0);}
					else if(bd.QaC(cc)==5) { bd.sQaC(cc,-1); bd.sQsC(cc,1);}
					else{ bd.sQaC(cc,bd.QaC(cc)+1); bd.sQsC(cc,0);}
				}
				else if(this.btn.Right){
					if(bd.QsC(cc)==1)      { bd.sQaC(cc, 5); bd.sQsC(cc,0);}
					else if(bd.QaC(cc)==-1){ bd.sQaC(cc,-1); bd.sQsC(cc,1);}
					else if(bd.QaC(cc)==2) { bd.sQaC(cc,-1); bd.sQsC(cc,0);}
					else{ bd.sQaC(cc,bd.QaC(cc)-1); bd.sQsC(cc,0);}
				}
			}

			this.mouseCell = cc;

			pc.paintCell(cc);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.mode==3){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca,4);
		};

		if(k.callmode == "pmake"){
			kp.generate(2, true, false, '');
			kp.kpinput = function(ca){
				kc.key_inputqnum(ca,4);
			};
		}

		menu.ex.adjustSpecial = function(type,key){
			um.disableRecord();
			switch(type){
			case 1: // �㉺���]
				for(var cc=0;cc<bd.cell.length;cc++){
					var val = {2:5,3:4,4:3,5:2}[bd.QaC(cc)];
					if(!isNaN(val)){ bd.cell[cc].qans = val;}
				}
				break;
			case 2: // ���E���]
				for(var cc=0;cc<bd.cell.length;cc++){
					var val = {2:3,3:2,4:5,5:4}[bd.QaC(cc)];
					if(!isNaN(val)){ bd.cell[cc].qans = val;}
				}
				break;
			case 3: // �E90�����]
				for(var cc=0;cc<bd.cell.length;cc++){
					var val = {2:5,3:2,4:3,5:4}[bd.QaC(cc)];
					if(!isNaN(val)){ bd.cell[cc].qans = val;}
				}
				break;
			case 4: // ��90�����]
				for(var cc=0;cc<bd.cell.length;cc++){
					var val = {2:3,3:4,4:5,5:2}[bd.QaC(cc)];
					if(!isNaN(val)){ bd.cell[cc].qans = val;}
				}
				break;
			case 5: // �Ֆʊg��
				break;
			case 6: // �Ֆʏk��
				break;
			}
			um.enableRecord();
		};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_LIGHT;
		pc.fontcolor = pc.fontErrcolor = "white";

		pc.paint = function(x1,y1,x2,y2){
			x2++; y2++;
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawWhiteCells(x1,y1,x2,y2);

			this.drawDashedGrid(x1,y1,x2,y2);

			this.drawBCells(x1,y1,x2,y2);
			this.drawTriangle(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			bstr = this.decode4(bstr, bd.sQnC.bind(bd), k.qcols*k.qrows);
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			return "/"+k.qcols+"/"+k.qrows+"/"+this.encode4(bd.QnC.bind(bd), k.qcols*k.qrows);
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkAllCell(function(c){ return ( bd.QnC(c)>=0 && (bd.QnC(c)<ans.checkdir4Cell(c,ans.isTri)) );} ) ){
				this.setAlert('�����̂܂��ɂ��鍕���O�p�`�̐����Ԉ���Ă��܂��B','The number of triangles in four adjacent cells is bigger than it.'); return false;
			}

			if( !this.checkWhiteArea() ){
				this.setAlert('���}�X�������`(�����`)�ł͂���܂���B','A mass of white cells is not rectangle.'); return false;
			}

			if( !this.checkAllCell(function(c){ return ( bd.QnC(c)>=0 && (bd.QnC(c)>ans.checkdir4Cell(c,ans.isTri)) );} ) ){
				this.setAlert('�����̂܂��ɂ��鍕���O�p�`�̐����Ԉ���Ă��܂��B','The number of triangles in four adjacent cells is smaller than it.'); return false;
			}

			return true;
		};
		ans.isTri = function(c){ return (bd.QaC(c)!=-1);};

		ans.checkWhiteArea = function(){
			var winfo = this.searchWarea_slope();
			for(var id=1;id<=winfo.max;id++){
				var d = this.getSizeOfClist(winfo.room[id].idlist,function(cc){ return (bd.QaC(cc)==-1);});
				if((d.x2-d.x1+1)*(d.y2-d.y1+1)!=d.cnt && !this.isAreaRect_slope(winfo,id)){
					bd.sErC(winfo.room[id].idlist,1);
					return false;
				}
			}
			return true;
		};
		// �΂ߗ̈攻��p
		ans.isAreaRect_slope = function(winfo,id){
			for(var i=0;i<winfo.room[id].idlist.length;i++){
				var c = winfo.room[id].idlist[i];
				var a = bd.QaC(c);
				if( ((a==4||a==5)^(bd.up(c)==-1||winfo.id[bd.up(c)]!=id)) ||
					((a==2||a==3)^(bd.dn(c)==-1||winfo.id[bd.dn(c)]!=id)) ||
					((a==2||a==5)^(bd.lt(c)==-1||winfo.id[bd.lt(c)]!=id)) ||
					((a==3||a==4)^(bd.rt(c)==-1||winfo.id[bd.rt(c)]!=id)) )
				{
					return false;
				}
			}
			return true;
		};

		ans.searchWarea_slope = function(){
			var winfo = new AreaInfo();
			for(var c=0;c<bd.cell.length;c++){ winfo.id[c]=(bd.QnC(c)==-1?0:-1);}
			for(var c=0;c<bd.cell.length;c++){
				if(winfo.id[c]!=0){ continue;}
				winfo.max++;
				winfo.room[winfo.max] = {idlist:[]};
				this.sw0(winfo, c, winfo.max);
			}
			return winfo;
		};
		ans.sw0 = function(winfo,i,areaid){
			winfo.id[i] = areaid;
			winfo.room[areaid].idlist.push(i);
			var a = bd.QaC(i), b1 = bd.QaC(bd.up(i)), b2 = bd.QaC(bd.dn(i)), b3 = bd.QaC(bd.lt(i)), b4 = bd.QaC(bd.rt(i));
			var cc;
			cc=bd.up(i); if( cc!=-1 && winfo.id[cc]==0 && (a!=4 && a!=5) && (b1!=2 && b1!=3) ){ this.sw0(winfo, cc, areaid);}
			cc=bd.dn(i); if( cc!=-1 && winfo.id[cc]==0 && (a!=2 && a!=3) && (b2!=4 && b2!=5) ){ this.sw0(winfo, cc, areaid);}
			cc=bd.lt(i); if( cc!=-1 && winfo.id[cc]==0 && (a!=2 && a!=5) && (b3!=3 && b3!=4) ){ this.sw0(winfo, cc, areaid);}
			cc=bd.rt(i); if( cc!=-1 && winfo.id[cc]==0 && (a!=3 && a!=4) && (b4!=2 && b4!=5) ){ this.sw0(winfo, cc, areaid);}
		};
	}
};
