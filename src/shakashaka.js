//
// �p�Y���ŗL�X�N���v�g�� �V���J�V���J�� shakashaka.js v3.3.0
//
Puzzles.shakashaka = function(){ };
Puzzles.shakashaka.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
		k.irowake  = 0;		// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross  = 0;		// 1:�Ֆʓ�����Cross������p�Y�� 2:�O�g����܂߂�Cross������p�Y��
		k.isborder = 0;		// 1:Border/Line������\�ȃp�Y�� 2:�O�g�������\�ȃp�Y��
		k.isexcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isLineCross     = true;	// ������������p�Y��
		k.isCenterLine    = true;	// �}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = false;	// ���E����line�Ƃ��Ĉ���
		k.hasroom         = false;	// �������̗̈�ɕ�����Ă���/������p�Y��
		k.roomNumber      = false;	// �����̖��̐�����1��������p�Y��

		k.dispzero        = true;	// 0��\�����邩�ǂ���
		k.isDispHatena    = false;	// qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber     = false;	// �񓚂ɐ�������͂���p�Y��
		k.NumberWithMB    = false;	// �񓚂̐����Ɓ��~������p�Y��
		k.linkNumber      = false;	// �������ЂƂȂ���ɂȂ�p�Y��

		k.BlackCell       = false;	// ���}�X����͂���p�Y��
		k.NumberIsWhite   = true;	// �����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell     = false;	// �A�����f�ւ̃p�Y��
		k.checkBlackCell  = false;	// ��������ō��}�X�̏����`�F�b�N����p�Y��
		k.checkWhiteCell  = false;	// ��������Ŕ��}�X�̏����`�F�b�N����p�Y��

		k.ispzprv3ONLY    = true;	// �ς��Ղ�A�v���b�g�ɂ͑��݂��Ȃ��p�Y��
		k.isKanpenExist   = false;	// pencilbox/�J���y���ɂ���p�Y��

		base.setTitle("�V���J�V���J","ShakaShaka");
		base.setExpression("�@\"�N���b�N�����ʒu\"�ł̓}�X�ڂ̊p�̂ق����N���b�N���邱�ƂŎO�p�`�����͂ł��܂��B<br>�@\"�h���b�O����\"�ł͎΂�4�����Ƀh���b�O���ĎO�p�`����͂ł��܂��B",
						   " Click corner-side to input triangles if 'Position of Cell'.<br> Left Button Drag to skew-ward to input triangle if 'Drag Type'.");
		base.setFloatbgcolor("rgb(32, 32, 32)");
	},
	menufix : function(){
		pp.addSelect('use','setting',1,[1,2,3], '�O�p�`�̓��͕��@', 'Input Triangle Type');
		pp.setLabel ('use', '�O�p�`�̓��͕��@', 'Input Triangle Type');

		pp.addChild('use_1', 'use', '�N���b�N�����ʒu', 'Position of Cell');
		pp.addChild('use_2', 'use', '�h���b�O����', 'Drag Type');
		pp.addChild('use_3', 'use', '1�{�^��', 'One Button');
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if(k.playmode) this.inputTriangle(0);
			if(k.editmode){
				if(!kp.enabled()){ this.inputqnum();}
				else{ kp.display();}
			}
		};
		mv.mouseup = function(){
			if(k.playmode && pp.getVal('use')===2 && this.notInputted()){
				this.inputTriangle(2);
			}
		};
		mv.mousemove = function(){
			if(k.playmode && pp.getVal('use')===2 && this.mouseCell!=-1){
				this.inputTriangle(1);
			}
		};
		mv.inputTriangle = function(use2step){
			var cc;
			if(pp.getVal('use')!==2 || use2step==0){
				cc = this.cellid();
				if(cc==-1 || bd.QnC(cc)!=-1){ this.mousereset(); return;}
			}

			var use = pp.getVal('use');
			if(use===1){
				if(this.btn.Left){
					var dx = this.inputPos.x - bd.cell[cc].px + k.p0.x;
					var dy = this.inputPos.y - bd.cell[cc].py + k.p0.y;
					if(dx>0&&dx<=k.cwidth/2){
						if(dy>0&&dy<=k.cheight/2){ this.inputData = 5;}
						else if  (dy>k.cheight/2){ this.inputData = 2;}
					}
					else if(dx>k.cwidth/2){
						if(dy>0&&dy<=k.cheight/2){ this.inputData = 4;}
						else if  (dy>k.cheight/2){ this.inputData = 3;}
					}

					bd.sQaC(cc, (bd.QaC(cc)!=this.inputData?this.inputData:-1));
					bd.sQsC(cc, 0);
				}
				else if(this.btn.Right){
					bd.sQaC(cc, -1);
					bd.sQsC(cc, (bd.QsC(cc)==0?1:0));
				}
			}
			else if(use===2){
				if(use2step==0){
					// �ŏ��͂ǂ��̃Z�����N���b�N�������擾���邾��
					this.firstPos = this.inputPos.clone();
					this.mouseCell = cc;
					return;
				}

				var dx=(this.inputPos.x-this.firstPos.x), dy=(this.inputPos.y-this.firstPos.y);
				cc = this.mouseCell;

				if(use2step==1){
					// ���ȏ㓮���Ă�����O�p�`�����
					var moves = 12;
					if     (dx<=-moves && dy>= moves){ this.inputData=2;}
					else if(dx<=-moves && dy<=-moves){ this.inputData=5;}
					else if(dx>= moves && dy>= moves){ this.inputData=3;}
					else if(dx>= moves && dy<=-moves){ this.inputData=4;}

					if(this.inputData!=-1){
						bd.sQaC(cc, (bd.QaC(cc)!=this.inputData)?this.inputData:-1);
						bd.sQsC(cc, 0);
						this.mousereset();
					}
				}
				else if(use2step==2){
					// �قƂ�Ǔ����Ă��Ȃ������ꍇ�́E�����
					if(Math.abs(dx)<=3 && Math.abs(dy)<=3){
						bd.sQaC(cc, -1);
						bd.sQsC(cc, (bd.QsC(cc)==1?0:1));
					}
				}
			}
			else if(use===3){
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

			pc.paintCell(cc);
		};
		mv.enableInputHatena = true;

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.playmode){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca);
		};

		if(k.EDITOR){
			kp.generate(2, true, false, '');
			kp.kpinput = function(ca){
				kc.key_inputqnum(ca);
			};
		}

		bd.maxnum = 4;

		menu.ex.adjustSpecial = function(arg,key,d){
			um.disableRecord();
			switch(arg){
			case 1: // �㉺���]
				for(var cc=0;cc<bd.cellmax;cc++){
					var val = {2:5,3:4,4:3,5:2}[bd.QaC(cc)];
					if(!isNaN(val)){ bd.cell[cc].qans = val;}
				}
				break;
			case 2: // ���E���]
				for(var cc=0;cc<bd.cellmax;cc++){
					var val = {2:3,3:2,4:5,5:4}[bd.QaC(cc)];
					if(!isNaN(val)){ bd.cell[cc].qans = val;}
				}
				break;
			case 3: // �E90�����]
				for(var cc=0;cc<bd.cellmax;cc++){
					var val = {2:5,3:2,4:3,5:4}[bd.QaC(cc)];
					if(!isNaN(val)){ bd.cell[cc].qans = val;}
				}
				break;
			case 4: // ��90�����]
				for(var cc=0;cc<bd.cellmax;cc++){
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
		pc.setCellColorFunc('qnum');

		pc.paint = function(x1,y1,x2,y2){
			this.drawBGCells(x1,y1,x2,y2);
			this.drawRDotCells(x1,y1,x2,y2);
			this.drawDashedGrid(x1,y1,x2,y2);
			this.drawBlackCells(x1,y1,x2,y2);
			this.drawNumbers(x1,y1,x2,y2);

			this.drawTriangle(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawTarget(x1,y1,x2,y2);
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type){
			this.decode4Cell();
		};
		enc.pzlexport = function(type){
			this.encode4Cell();
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			this.decodeCellQnumb();
			this.decodeCellQanssub();
		};
		fio.encodeData = function(){
			this.encodeCellQnumb();
			this.encodeCellQanssub();
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
			var result = true;
			var winfo = this.searchWarea_slope();
			for(var id=1;id<=winfo.max;id++){
				var d = this.getSizeOfClist(winfo.room[id].idlist,function(cc){ return (bd.QaC(cc)==-1);});
				if(d.cols*d.rows!=d.cnt && !this.isAreaRect_slope(winfo,id)){
					if(this.inAutoCheck){ return false;}
					bd.sErC(winfo.room[id].idlist,1);
					result = false;
				}
			}
			return result;
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
			for(var c=0;c<bd.cellmax;c++){ winfo.id[c]=(bd.QnC(c)==-1?0:-1);}
			for(var c=0;c<bd.cellmax;c++){
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
