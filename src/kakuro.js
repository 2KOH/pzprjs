//
// �p�Y���ŗL�X�N���v�g�� �J�b�N���� kakuro.js v3.2.4p4
//
Puzzles.kakuro = function(){ };
Puzzles.kakuro.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 11;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 11;}	// �Ֆʂ̏c��
		k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 0;		// 1:Border/Line������\�ȃp�Y��
		k.isextendcell = 1;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
		k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
		k.isLineCross     = 0;	// 1:������������p�Y��
		k.isCenterLine    = 0;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

		k.dispzero      = 0;	// 1:0��\�����邩�ǂ���
		k.isDispHatena  = 0;	// 1:qnum��-2�̂Ƃ��ɁH��\������
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
		k.def_psize = 40;
		//k.area = { bcell:0, wcell:0, number:0};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		if(k.EDITOR){
			base.setExpression("�@Q�L�[�Ńu���b�N�����͂ł��܂��B��������͂���ꏊ��SHIFT�L�[�������Ɛ؂�ւ����܂��B",
							   " 'Q' key toggles question block. Press SHIFT key to change the target side of the block to input the number.");
		}
		else{
			base.setExpression("�@�}�E�X��L�[�{�[�h�Ő��������͂ł��܂��B",
							   " It is available to input number by keybord or mouse");
		}
		base.setTitle("�J�b�N��","Kakuro");
		base.setFloatbgcolor("rgb(96, 96, 96)");

		enc.pidKanpen = 'kakuro';
	},
	menufix : function(){ },

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if(k.editmode){
				if(!kp.enabled()){ this.input51();}
				else{ kp.display();}
			}
			else if(k.playmode){
				if(!kp.enabled()){ this.inputqnum();}
				else{ kp.display();}
			}
		};
		mv.mouseup = function(){ };
		mv.mousemove = function(){ };

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(this.moveTCell(ca)){ return;}

			if(k.editmode){ this.inputnumber51(ca,{2:45,4:45});}
			else{
				var cc = tc.getTCC();
				if(cc!=-1&&bd.QuC(cc)!=51){ this.key_inputqnum(ca);}
			}
		};

		if(k.EDITOR){
			kp.kpgenerate = function(mode){
				if(mode===3){ this.gentable10(3,0); return;}
				this.inputcol('image','knumq','q',[0,0]);
				this.inputcol('num','knum_',' ',' ');
				this.inputcol('num','knum1','1','1');
				this.inputcol('num','knum2','2','2');
				this.insertrow();
				this.inputcol('num','knum3','3','3');
				this.inputcol('num','knum4','4','4');
				this.inputcol('num','knum5','5','5');
				this.inputcol('num','knum6','6','6');
				this.insertrow();
				this.inputcol('num','knum7','7','7');
				this.inputcol('num','knum8','8','8');
				this.inputcol('num','knum9','9','9');
				this.inputcol('num','knum0','0','0');
				this.insertrow();
			};
			kp.generate(kp.ORIGINAL, true, true, kp.kpgenerate);
			kp.imgCR = [1,1];
			kp.kpinput = function(ca){
				if(k.editmode){ kc.inputnumber51(ca,{2:45,4:45});}
				if(k.playmode){ kc.key_inputqnum(ca);}
			};
		}

		menu.ex.adjustSpecial  = menu.ex.adjustQues51_1;
		menu.ex.adjustSpecial2 = menu.ex.adjustQues51_2;

		tc.getTCX = function(){ return tc.cursolx>>1;};
		tc.getTCY = function(){ return tc.cursoly>>1;};
		tc.setAlign = function(){
			if(k.playmode){
				if(this.cursolx<1) this.cursolx = 1;
				if(this.cursoly<1) this.cursoly = 1;
				pc.paint((this.cursolx>>1)-1, (this.cursoly>>1)-1, this.cursolx>>1, this.cursoly>>1);
			}
		};
		tc.targetdir = 2;

		bd.maxnum = 9;

		// �I�[�o�[���C�g
		bd.sQnC = function(id, num) {
			um.addOpe(k.CELL, k.QNUM, id, this.cell[id].qnum, num);
			this.cell[id].qnum = num;
		};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.TTcolor = "rgb(255,255,127)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);

			this.drawBGCells(x1,y1,x2,y2);
			this.drawBGEXcells(x1,y1,x2,y2);

			this.draw51(x1,y1,x2,y2,false);
			this.draw51EXcells(x1,y1,x2,y2,false);
			this.drawTargetTriangle(x1,y1,x2,y2);

			this.drawGrid(x1,y1,x2,y2);
			this.drawBorders51(x1,y1,x2,y2);

			this.drawChassis_ex1(x1-1,y1-1,x2,y2,false);

			this.drawNumbersOn51(x1,y1,x2,y2);
			this.drawNumbers_kakuro(x1,y1,x2,y2);

			this.drawTCell(x1,y1,x2+1,y2+1);
		};

		// �I�[�o�[���C�h drawBGCells�p
		pc.setBGCellColor = function(cc){
			var err = bd.cell[cc].error, _f = (bd.cell[cc].ques===51);
			if     ( _f && err===0){ g.fillStyle = "rgb(192,192,192)"; return true;}
			else if( _f && err===1){ g.fillStyle = this.errbcolor1;    return true;}
			else if(!_f && err===1){ g.fillStyle = this.errbcolor1;    return true;}
			return false;
		};
		pc.drawBGEXcells = function(x1,y1,x2,y2){
			var header = "ex_full_";

			var exlist = this.excellinside(x1-1,y1-1,x2,y2);
			for(var i=0;i<exlist.length;i++){
				var c = exlist[i];

				g.fillStyle = (bd.excell[c].error!==1 ? "rgb(192,192,192)" : this.errbcolor1);
				if(this.vnop(header+c,1)){
					g.fillRect(bd.excell[c].px+1, bd.excell[c].py+1, k.cwidth-1, k.cheight-1);
				}
			}
			this.vinc();
		};

		// ���E���̕`��
		pc.drawBorders51 = function(x1,y1,x2,y2){
			g.fillStyle = pc.Cellcolor;
			var clist = this.cellinside(x1-1,y1-1,x2+1,y2+1);
			for(var i=0;i<clist.length;i++){
				var c = clist[i], rt=bd.rt(c), dn=bd.dn(c);
				var cx=bd.cell[c].cx, cy=bd.cell[c].cy;

				this.drawBorder1x(2*cx+2,2*cy+1,(rt!=-1&&((bd.cell[c].ques===51)^(bd.cell[rt].ques===51))));
				this.drawBorder1x(2*cx+1,2*cy+2,(dn!=-1&&((bd.cell[c].ques===51)^(bd.cell[dn].ques===51))));
			}
			this.vinc();
		};

		pc.drawNumbers_kakuro = function(x1,y1,x2,y2){
			var clist = this.cellinside(x1,y1,x2,y2);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				var target = ((k.editmode&&c===tc.getTCC())?kc.detectTarget(c,-1):-1);

				if(bd.cell[c].ques!=51 && bd.cell[c].qans>0){
					var obj = bd.cell[c];
					if(!obj.numobj){ obj.numobj = this.CreateDOMAndSetNop();}
					var color = (bd.cell[c].error===1 ? this.fontErrcolor : this.fontAnscolor);
					var text  = ""+bd.cell[c].qans;
					this.dispnum(obj.numobj, 1, text, 0.80, color, obj.px, obj.py);
				}
			}
			this.vinc();
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type){
			this.decodeKakuro();
		};
		enc.pzlexport = function(type){
			this.encodeKakuro();
		};

		enc.decodeKanpen = function(){
			fio.decodeRoom_kanpen();
		};
		enc.encodeKanpen = function(){
			this.outsize = [k.qrows+1, k.qcols+1].join("/");

			fio.encodeRoom_kanpen();
		};

		enc.decodeKakuro = function(){
			// �Ֆʓ������̃f�R�[�h
			var cell=0, a=0, bstr = this.outbstr;
			for(var i=0;i<bstr.length;i++){
				var ca = bstr.charAt(i);
				if(ca>='k' && ca<='z'){ cell+=(parseInt(ca,36)-19);}
				else{
					bd.sQuC(cell,51);
					if(ca!='.'){
						bd.sDiC(cell,this.decval(ca));
						bd.sQnC(cell,this.decval(bstr.charAt(i+1)));
						i++;
					}
					cell++;
				}
				if(cell>=bd.cellmax){ a=i+1; break;}
			}

			// �ՖʊO�����̃f�R�[�h
			cell=0;
			for(var i=a;i<bstr.length;i++){
				var ca = bstr.charAt(i);
				while(cell<k.qcols){
					if(bd.QuC(bd.cnum(cell,0))!=51){ bd.sDiE(cell,this.decval(ca)); cell++; i++; break;}
					cell++;
				}
				if(cell>=k.qcols){ a=i; break;}
				i--;
			}
			for(var i=a;i<bstr.length;i++){
				var ca = bstr.charAt(i);
				while(cell<k.qcols+k.qrows){
					if(bd.QuC(bd.cnum(0,cell-k.qcols))!=51){ bd.sQnE(cell,this.decval(ca)); cell++; i++; break;}
					cell++;
				}
				if(cell>=k.qcols+k.qrows){ a=i; break;}
				i--;
			}

			this.outbstr = bstr.substr(a);
		};
		enc.encodeKakuro = function(type){
			var cm="";

			// �Ֆʓ����̐��������̃G���R�[�h
			var count=0;
			for(var c=0;c<bd.cellmax;c++){
				var pstr = "";

				if(bd.QuC(c)==51){
					if(bd.QnC(c)<=0 && bd.DiC(c)<=0){ pstr = ".";}
					else{ pstr = ""+this.encval(bd.DiC(c))+this.encval(bd.QnC(c));}
				}
				else{ pstr=" "; count++;}

				if     (count== 0){ cm += pstr;}
				else if(pstr!=" "){ cm += ((count+19).toString(36)+pstr); count=0;}
				else if(count==16){ cm += "z"; count=0;}
			}
			if(count>0){ cm += (count+19).toString(36);}

			// �ՖʊO���̐��������̃G���R�[�h
			for(var c=0;c<k.qcols;c++){ if(bd.QuC(bd.cnum(c,0))!=51){ cm+=this.encval(bd.DiE(c));} }
			for(var c=k.qcols;c<k.qcols+k.qrows;c++){ if(bd.QuC(bd.cnum(0,c-k.qcols))!=51){ cm+=this.encval(bd.QnE(c));} }

			this.outbstr += cm;
		};

		enc.decval = function(ca){
			if     (ca>='0'&&ca<='9'){ return parseInt(ca,36);}
			else if(ca>='a'&&ca<='j'){ return parseInt(ca,36);}
			else if(ca>='A'&&ca<='Z'){ return parseInt(ca,36)+10;}
			return "";
		};
		enc.encval = function(val){
			if     (val>= 1&&val<=19){ return val.toString(36).toLowerCase();}
			else if(val>=20&&val<=45){ return (val-10).toString(36).toUpperCase();}
			return "0";
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			this.decodeCellQnum51();
			this.decodeCellQanssub();
		};
		fio.encodeData = function(){
			this.encodeCellQnum51();
			this.encodeCellQanssub();
		};

		fio.kanpenOpen = function(){
			this.decodeRoom_kanpen();
			this.decodeQans_kanpen();
		};
		fio.kanpenSave = function(){
			this.sizestr = [k.qrows+1, k.qcols+1].join("/");

			this.encodeRoom_kanpen();
			this.datastr += "/";
			this.encodeQans_kanpen();
		};

		fio.decodeRoom_kanpen = function(){
			for(;;){
				var data = this.readLine();
				if(!data){ break;}

				var item = data.split(" ");
				if(item.length<=1){ return;}
				else if(item[0]==0 && item[1]==0){ }
				else if(item[0]==0){ bd.sDiE(parseInt(item[1])-1, parseInt(item[3]));}
				else if(item[1]==0){ bd.sQnE(parseInt(item[0])-1+k.qcols, parseInt(item[2]));}
				else{
					var c=bd.cnum(parseInt(item[1])-1,parseInt(item[0])-1);
					bd.sQuC(c, 51);
					bd.sQnC(c, parseInt(item[2]));
					bd.sDiC(c, parseInt(item[3]));
				}
			}
		};
		fio.encodeRoom_kanpen = function(){
			for(var cy=-1;cy<k.qrows;cy++){ for(var cx=-1;cx<k.qcols;cx++){
				if(cx!==-1 && cy!==-1 && bd.QuC(bd.cnum(cx,cy))!==51){ continue;}

				var item=[(cy+1).toString(),(cx+1).toString(),0,0];
				if(cx==-1&&cy==-1){ }
				else if(cy==-1){
					item[3]=bd.DiE(bd.exnum(cx,cy)).toString();
				}
				else if(cx==-1){
					item[2]=bd.QnE(bd.exnum(cx,cy)).toString();
				}
				else{
					item[2]=bd.QnC(bd.cnum(cx,cy)).toString();
					item[3]=bd.DiC(bd.cnum(cx,cy)).toString();
				}
				this.datastr += (item.join(" ")+"/");
			}}
		};

		fio.decodeQans_kanpen = function(){
			var barray = this.readLines(k.qrows+1);
			for(var cy=-1;cy<k.qrows;cy++){
				if(cy+1>=barray.length){ break;}
				var arr = barray[cy+1].split(" ");
				for(var cx=-1;cx<k.qcols;cx++){
					if(arr[cx+1]==''){ continue;}
					var c = bd.cnum(cx,cy);
					if(c!=-1&&arr[cx+1]!="."&&arr[cx+1]!="0"){ bd.sQaC(c, parseInt(arr[cx+1]));}
				}
			}
		};
		fio.encodeQans_kanpen = function(){
			for(cy=-1;cy<k.qrows;cy++){
				for(cx=-1;cx<k.qrows;cx++){
					var c = bd.cnum(cx,cy);
					if(c==-1){ this.datastr += ". ";}
					else if(bd.QuC(c)==51){ this.datastr += ". ";}
					else if(bd.QaC(c) > 0){ this.datastr += (bd.QaC(c).toString() + " ");}
					else                  { this.datastr += "0 ";}
				}
				if(cy<k.qrows-1){ this.datastr += "/";}
			}
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkRowsColsPartly(this.isSameNumber, {}, function(cc){ return (bd.QuC(cc)==51);}, true) ){
				this.setAlert('����������������ɓ����Ă��܂��B','Same number is in the same row.'); return false;
			}

			if( !this.checkRowsColsPartly(this.isTotalNumber, {}, function(cc){ return (bd.QuC(cc)==51);}, false) ){
				this.setAlert('�����̉����E�ɂ��鐔���̍��v���Ԉ���Ă��܂��B','The sum of the cells is not correct.'); return false;
			}

			if( !this.checkAllCell(function(c){ return (bd.QuC(c)!=51 && bd.QaC(c)<=0);}) ){
				this.setAlert('���ׂẴ}�X�ɐ����������Ă��܂���B','There is a empty cell.'); return false;
			}

			return true;
		};
		ans.check1st = function(){ return this.checkAllCell(function(c){ return (bd.QuC(c)!=51 && bd.QaC(c)<=0);});};

		ans.isSameNumber = function(nullnum, clist, nullobj){
			return this.isDifferentNumberInClist(clist, bd.QaC);
		};
		ans.isTotalNumber = function(number, clist, nullobj){
			var sum = 0;
			for(var i=0;i<clist.length;i++){
				if(bd.QaC(clist[i])>0){ sum += bd.QaC(clist[i]);}
				else{ return true;}
						}
			if(number>0 && sum!=number){ bd.sErC(clist,1); return false;}
			return true;
		};
	}
};
