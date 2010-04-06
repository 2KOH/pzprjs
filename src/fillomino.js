//
// �p�Y���ŗL�X�N���v�g�� �t�B���I�~�m�� fillomino.js v3.2.4
//
Puzzles.fillomino = function(){ };
Puzzles.fillomino.prototype = {
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
		k.isCenterLine    = 0;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

		k.dispzero      = 0;	// 1:0��\�����邩�ǂ���
		k.isDispHatena  = 1;	// 1:qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber   = 1;	// 1:�񓚂ɐ�������͂���p�Y��
		k.isArrowNumber = 0;	// 1:������������͂���p�Y��
		k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
		k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
		k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

		k.BlackCell     = 0;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 1;	// 1:pencilbox/�J���y���ɂ���p�Y��

		//k.def_csize = 36;
		//k.def_psize = 24;
		//k.area = { bcell:0, wcell:0, number:0};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		base.setTitle("�t�B���I�~�m","Fillomino");
		base.setExpression("<small><span style=\"line-height:125%;\">�@�}�E�X�̍��{�^���������Ȃ���_����𓮂����Ƌ��E���������܂��B�}�X�̒������瓯�����Ƃ�����Ɛ�����ׂ̃}�X�ɃR�s�[�ł��܂��B�E�{�^���͕⏕�L���ł��B<br>�@�L�[�{�[�h�ł͓������͂��A���ꂼ��Z�L�[�AX�L�[�ACtrl�L�[�������Ȃ�����L�[�ōs�����Ƃ��ł��܂��B</span></small>",
						   "<small><span style=\"line-height:125%;\"> Left Button Drag on dotted line to input border line. Do it from center of the cell to copy the number. Right Button Drag to input auxiliary marks.<br> By keyboard, it is available to input each ones by using arrow keys with 'Z', 'X' or 'Ctrl' key.</span></small>");
		base.setFloatbgcolor("rgb(64, 64, 64)");

		enc.pidKanpen = 'fillomino';
	},
	menufix : function(){
		pp.addCheck('enbnonum','setting',false,'�����͂Ő�������','Allow Empty cell');
		pp.setLabel('enbnonum', '�S�Ă̐����������Ă��Ȃ���Ԃł̐��������������', 'Allow answer check with empty cell in the board.');
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if(k.playmode){
				if(this.btn.Left){ this.borderinput = this.inputborder_fillomino();}
				else if(this.btn.Right) this.inputQsubLine();
			}
		};
		mv.mouseup = function(){
			if(this.notInputted()){
				if(!kp.enabled()){ this.mouseCell=-1; 	this.inputqnum();}
				else{ kp.display();}
			}
		};
		mv.mousemove = function(){
			if(k.playmode){
				if(this.btn.Left){
					if(this.borderinput){ this.inputborder_fillomino();}
					else{ this.dragnumber();}
				}
				else if(this.btn.Right) this.inputQsubLine();
			}
		};
		mv.inputborder_fillomino = function(){
			var pos = this.crosspos(0.25);
			if(this.mouseCell==-1 && pos.x%2==1 && pos.y%2==1){
				pos = this.cellid();
				if(pos==-1){ return true;}
				this.inputData = bd.getNum(pos);
				this.mouseCell = pos;
				return false;
			}
			if(pos.x==this.mouseCell.x && pos.y==this.mouseCell.y){ return true;}

			var id = bd.bnum(pos.x, pos.y);
			if(id==-1 && this.mouseCell.x){ id = bd.bnum(this.mouseCell.x, this.mouseCell.y);}

			if(this.mouseCell!=-1 && id!=-1){
				if((pos.x%2==0 && this.mouseCell.x==pos.x && Math.abs(this.mouseCell.y-pos.y)==1) ||
				   (pos.y%2==0 && this.mouseCell.y==pos.y && Math.abs(this.mouseCell.x-pos.x)==1) )
				{
					this.mouseCell=-1

					if(this.inputData==-1){ this.inputData=(bd.QaB(id)==0?1:0);}
					if(this.inputData!=-1){ bd.sQaB(id, this.inputData);}
					else{ return true;}
					pc.paintBorder(id);
				}
			}
			this.mouseCell = pos;
			return true;
		};
		mv.dragnumber = function(){
			var cc = this.cellid();
			if(cc==-1||cc==this.mouseCell){ return;}
			bd.sQaC(cc, this.inputData);
			this.mouseCell = cc;
			pc.paintCell(cc);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(!this.isCTRL && !this.isZ && !this.isX && this.moveTCell(ca)){ return;}
			if(kc.key_fillomino(ca)){ return;}
			if(ca=='z' && !this.keyPressed){ this.isZ=true; return;}
			if(ca=='x' && !this.keyPressed){ this.isX=true; return;}
			this.key_inputqnum(ca);
		};
		kc.keyup    = function(ca){ if(ca=='z'){ this.isZ=false;} if(ca=='x'){ this.isX=false;}};
		kc.key_fillomino = function(ca){
			if(k.editmode){ return false;}

			var cc = tc.getTCC();
			if(cc==-1){ return;}
			var flag = false;

			if     (ca == k.KEYUP && bd.up(cc) != -1){
				if(kc.isCTRL)  { bd.sQsB(bd.ub(cc),(bd.QsB(bd.ub(cc))==0?1:0)); tc.decTCY(2); flag = true;}
				else if(kc.isZ){ bd.sQaB(bd.ub(cc),(bd.QaB(bd.ub(cc))==0?1:0)); flag = true;}
				else if(kc.isX){ bd.sQaC(bd.up(cc),bd.getNum(cc)); tc.decTCY(2); flag = true;}
			}
			else if(ca == k.KEYDN && bd.dn(cc) != -1){
				if(kc.isCTRL)  { bd.sQsB(bd.db(cc),(bd.QsB(bd.db(cc))==0?1:0)); tc.incTCY(2); flag = true;}
				else if(kc.isZ){ bd.sQaB(bd.db(cc),(bd.QaB(bd.db(cc))==0?1:0)); flag = true;}
				else if(kc.isX){ bd.sQaC(bd.dn(cc),bd.getNum(cc)); tc.incTCY(2); flag = true;}
			}
			else if(ca == k.KEYLT && bd.lt(cc) != -1){
				if(kc.isCTRL)  { bd.sQsB(bd.lb(cc),(bd.QsB(bd.lb(cc))==0?1:0)); tc.decTCX(2); flag = true;}
				else if(kc.isZ){ bd.sQaB(bd.lb(cc),(bd.QaB(bd.lb(cc))==0?1:0)); kc.tcMoved = true; flag = true;}
				else if(kc.isX){ bd.sQaC(bd.lt(cc),bd.getNum(cc)); tc.decTCX(2); kc.tcMoved = true; flag = true;}
			}
			else if(ca == k.KEYRT && bd.rt(cc) != -1){
				if(kc.isCTRL)  { bd.sQsB(bd.rb(cc),(bd.QsB(bd.rb(cc))==0?1:0)); tc.incTCX(2); flag = true;}
				else if(kc.isZ){ bd.sQaB(bd.rb(cc),(bd.QaB(bd.rb(cc))==0?1:0)); flag = true;}
				else if(kc.isX){ bd.sQaC(bd.rt(cc),bd.getNum(cc)); tc.incTCX(2); flag = true;}
			}

			kc.tcMoved = flag;
			if(flag){ pc.paint(bd.cell[cc].cx-1, bd.cell[cc].cy-1, bd.cell[cc].cx+1, bd.cell[cc].cy+1); return true;}
			return false;
		};

		kc.isX = false;
		kc.isZ = false;

		kp.generate(0, true, true, '');
		kp.kpinput = function(ca){ kc.key_inputqnum(ca);};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_DLIGHT;
		pc.setBorderColorFunc('qans');

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawBGCells(x1,y1,x2,y2);
			this.drawDashedGrid(x1,y1,x2,y2);

			this.drawNumbers(x1,y1,x2,y2);

			this.drawBorders(x1,y1,x2,y2);
			this.drawBorderQsubs(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawTCell(x1,y1,x2+1,y2+1);
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type){
			this.decodeNumber16();
		};
		enc.pzlexport = function(type){
			this.encodeNumber16();
		};

		enc.decodeKanpen = function(){
			fio.decodeCellQnum_kanpen();
		};
		enc.encodeKanpen = function(){
			fio.encodeCellQnum_kanpen();
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			this.decodeCellQnum();
			this.decodeCellQanssub();
			this.decodeBorderAns();
		};
		fio.encodeData = function(){
			this.encodeCellQnum();
			this.encodeCellQanssub();
			this.encodeBorderAns();
		};

		fio.kanpenOpen = function(){
			this.decodeCellQnum_kanpen();
			this.decodeCellQans_kanpen();

			// ���E������������
			for(var id=0;id<bd.bdmax;id++){
				var cc1 = bd.cc1(id), cc2 = bd.cc2(id);
				var bdflag = (cc1!=-1 && cc2!=-1 && bd.getNum(cc1)!=-1 && bd.getNum(cc2)!=-1 && bd.getNum(cc1)!=bd.getNum(cc2));
				bd.sQaB(id,(bdflag?1:0));
			}
		};
		fio.kanpenSave = function(){
			this.encodeCellQnum_kanpen();
			this.encodeCellQans_kanpen();
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			var rinfo = this.searchRarea2();
			if( !this.checkErrorFlag(rinfo, 3) ){
				this.setAlert('�������܂܂�Ă��Ȃ��u���b�N������܂��B','A block has no number.'); return false;
			}

			if( !this.checkErrorFlag(rinfo, 1) || !this.checkAreaSize(rinfo, 2) ){
				this.setAlert('�u���b�N�̑傫����萔���̂ق����傫���ł��B','A number is bigger than the size of block.'); return false;
			}

			if( !this.checkSideAreaSize(rinfo, function(rinfo,r){ return rinfo.room[r].number;}) ){
				this.setAlert('���������̃u���b�N���ӂ����L���Ă��܂��B','Adjacent blocks have the same number.'); return false;
			}

			if( !this.checkErrorFlag(rinfo, 2) || !this.checkAreaSize(rinfo, 1) ){
				this.setAlert('�u���b�N�̑傫�������������������ł��B','A number is smaller than the size of block.'); return false;
			}

			if( !this.checkErrorFlag(rinfo, 4) ){
				this.setAlert('������ނ̐����������Ă���u���b�N������܂��B','A block has two or more kinds of numbers.'); return false;
			}

			if( !pp.getVal('enbnonum') && !this.checkAllCell(bd.noNum) ){
				this.setAlert('�����̓����Ă��Ȃ��}�X������܂��B','There is a empty cell.'); return false;
			}

			return true;
		};
		ans.check1st = function(){ return (pp.getVal('enbnonum') || this.checkAllCell(bd.noNum));};

		ans.checkAreaSize = function(rinfo, flag){
			var result = true;
			for(var id=1;id<=rinfo.max;id++){
				var room = rinfo.room[id];
				if(room.error==-1||room.number<=0){ continue;}
				if     (flag==1 && room.number<room.idlist.length){
					if(this.inAutoCheck){ return false;}
					bd.sErC(room.idlist,1);
					result = false;
				}
				else if(flag==2 && room.number>room.idlist.length){
					if(this.inAutoCheck){ return false;}
					bd.sErC(room.idlist,1);
					result = false;
				}
			}
			return result;
		};
		ans.checkErrorFlag = function(rinfo, val){
			var result = true;
			for(var id=1;id<=rinfo.max;id++){
				if(rinfo.room[id].error==val){
					if(this.inAutoCheck){ return false;}
					bd.sErC(rinfo.room[id].idlist,1);
					result = false;
				}
			}
			return result;
		};

		ans.searchRarea2 = function(){
			var rinfo = area.getRoomInfo();
			for(var id=1,max=rinfo.max;id<=max;id++){
				var room = rinfo.room[id];
				room.error  =  0;
				room.number = -1;
				var nums = [];
				var emptycell = 0, numcnt = 0, filled = 0;
				for(var i=0;i<room.idlist.length;i++){
					var c = room.idlist[i];
					var num = bd.getNum(c);
					if(num==-1){ emptycell++;}
					else if(isNaN(nums[num])){ numcnt++; filled=num; nums[num]=1;}
					else{ nums[num]++;}
				}
				if(numcnt>1 && emptycell>0){ room.error=4; continue;}
				else if(numcnt==0)         { room.error=3; continue;}
				else if(numcnt==1 && filled < nums[filled]+emptycell){ room.error=2;  room.number=filled; continue;}
				else if(numcnt==1 && filled > nums[filled]+emptycell){ room.error=1;  room.number=filled; continue;}
				else if(numcnt==1)                                   { room.error=-1; room.number=filled; continue;}

				// �����܂ŗ���̂�emptycell��0��2��ވȏ�̐����������Ă���̈�̂�
				// -> ���ꂼ��ɕʂ̗̈�id�����蓖�ĂĔ���ł���悤�ɂ���
				var clist = room.idlist;
				for(var i=0;i<clist.length;i++){ rinfo.id[clist[i]] = 0;}
				for(var i=0;i<clist.length;i++){
					if(rinfo.id[clist[i]]!=0){ continue;}
					rinfo.max++; max++;
					rinfo.room[rinfo.max] = {idlist:[]};
					this.sa0(rinfo, clist[i], rinfo.max);
				}
				// �Ō�Ɏ����̏��𖳌��ɂ���
				room = {idlist:[], error:0, number:-1};
			}
			return rinfo;
		};
		ans.sa0 = function(rinfo, i, areaid){
			if(rinfo.id[i]!=0){ return;}
			rinfo.id[i] = areaid;
			rinfo.room[areaid].idlist.push(i);
			if( bd.sameNumber(i,bd.up(i)) ){ this.sa0(rinfo, bd.up(i), areaid);}
			if( bd.sameNumber(i,bd.dn(i)) ){ this.sa0(rinfo, bd.dn(i), areaid);}
			if( bd.sameNumber(i,bd.lt(i)) ){ this.sa0(rinfo, bd.lt(i), areaid);}
			if( bd.sameNumber(i,bd.rt(i)) ){ this.sa0(rinfo, bd.rt(i), areaid);}
			return;
		};
	}
};
