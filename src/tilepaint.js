//
// �p�Y���ŗL�X�N���v�g�� �^�C���y�C���g�� tilepaint.js v3.1.9p1
//

function setting(){
	// �O���[�o���ϐ��̏����ݒ�
	if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
	if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
	k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

	k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
	k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
	k.isextendcell = 1;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

	k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
	k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
	k.isborderCross   = 0;	// 1:������������p�Y��
	k.isCenterLine    = 0;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
	k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

	k.dispzero      = 1;	// 1:0��\�����邩�ǂ���
	k.isDispHatena  = 0;	// 1:qnum��-2�̂Ƃ��ɁH��\������
	k.isAnsNumber   = 0;	// 1:�񓚂ɐ�������͂���p�Y��
	k.isArrowNumber = 0;	// 1:������������͂���p�Y��
	k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
	k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
	k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

	k.BlackCell     = 1;	// 1:���}�X����͂���p�Y��
	k.NumberIsWhite = 1;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
	k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

	k.ispzprv3ONLY  = 0;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
	k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

	k.fstruct = ["arearoom", "cellqnum51", "others"];

	//k.def_csize = 36;
	k.def_psize = 40;
}

//-------------------------------------------------------------
// Puzzle�ʃN���X�̒�`
Puzzle = function(){
	this.prefix();
};
Puzzle.prototype = {
	prefix : function(){
		this.input_init();
		this.graphic_init();

		if(k.callmode=="pplay"){
			base.setExpression("�@���N���b�N�ō��^�C�����A�E�N���b�N�Ŕ��^�C���m��^�C�������͂ł��܂��B",
							   " Left Click to input black tile, Right Click to determined white tile.");
		}
		else{
			base.setExpression("�@���N���b�N�ŋ��E���␔���̃u���b�N���A�E�N���b�N�ŉ��G�����͂ł��܂��B��������͂���ꏊ��SHIFT�L�[�������Ɛ؂�ւ����܂��B",
							   " Left Click to input border lines or number block, Right Click to paint a design. Press SHIFT key to change the side of inputting numbers.");
			tc.targetdir = 2;
		}
		base.setTitle("�^�C���y�C���g","TilePaint");
		base.setFloatbgcolor("rgb(96, 96, 96)");
	},
	menufix : function(){
		menu.addUseToFlags();
	},
	postfix : function(){
		menu.ex.adjustSpecial  = menu.ex.adjustQues51_1;
		menu.ex.adjustSpecial2 = menu.ex.adjustQues51_2;

		tc.getTCX = function(){ return int((tc.cursolx-1)/2);};
		tc.getTCY = function(){ return int((tc.cursoly-1)/2);};
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(k.mode==1){
				if     (this.btn.Left)  this.inputborder(x,y);
				else if(this.btn.Right) this.inputBGcolor1(x,y);
			}
			else if(k.mode==3) this.inputtile(x,y);
		};
		mv.mouseup = function(x,y){
			if(k.mode==1 && this.notInputted()){
				if(!kp.enabled()){ this.input51(x,y);}
				else{ kp.display(x,y);}
			}
		};
		mv.mousemove = function(x,y){
			if(k.mode==1){
				if     (this.btn.Left)  this.inputborder(x,y);
				else if(this.btn.Right) this.inputBGcolor1(x,y);
			}
			else if(k.mode==3) this.inputtile(x,y);
		};
		mv.set51cell = function(cc,val){
			if(val==true){
				bd.setQuesCell(cc,51);
				bd.setQnumCell(cc,0);
				bd.setDirecCell(cc,0);
				bd.setQansCell(cc,-1);
				bd.setQsubCell(cc,0);
				bd.setQuesBorder(bd.cell[cc].ub(),((bd.cell[cc].up()!=-1 && bd.getQuesCell(bd.cell[cc].up())!=51)?1:0));
				bd.setQuesBorder(bd.cell[cc].db(),((bd.cell[cc].dn()!=-1 && bd.getQuesCell(bd.cell[cc].dn())!=51)?1:0));
				bd.setQuesBorder(bd.cell[cc].lb(),((bd.cell[cc].lt()!=-1 && bd.getQuesCell(bd.cell[cc].lt())!=51)?1:0));
				bd.setQuesBorder(bd.cell[cc].rb(),((bd.cell[cc].rt()!=-1 && bd.getQuesCell(bd.cell[cc].rt())!=51)?1:0));
			}
			else{
				bd.setQuesCell(cc,0);
				bd.setQnumCell(cc,0);
				bd.setDirecCell(cc,0);
				bd.setQansCell(cc,-1);
				bd.setQsubCell(cc,0);
			}
		};

		mv.inputBGcolor1 = function(x,y){
			var cc = this.cellid(new Pos(x,y));
			if(cc==-1 || cc==this.mouseCell || bd.getQuesCell(cc)==51){ return;}
			if(this.inputData==-1){
				if     (bd.getQsubCell(cc)==0){ this.inputData=3;}
				else                          { this.inputData=0;}
			}
			bd.setQsubCell(cc, this.inputData);
			this.mouseCell = cc; 
			pc.paint(bd.cell[cc].cx, bd.cell[cc].cy, bd.cell[cc].cx, bd.cell[cc].cy);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.mode==3){ return;}
			if(this.moveTCell(ca)){ return;}
			this.inputnumber51(ca,{2:(k.qcols-tc.getTCX()-1), 4:(k.qrows-tc.getTCY()-1)});
		};

		if(k.callmode == "pmake"){
			kp.generate(99, true, false, this.kpgenerate);
			kp.imgCR = [1,1];
			kp.kpinput = function(ca){
				kc.key_inputqnum(ca,99);
			};
		}

		// �ꕔqsub�ŏ��������Ȃ����̂����邽�ߏ㏑��
		base.ASconfirm = function(){
			if(confirm("�⏕�L�����������܂����H")){
				um.chainflag=0;
				for(i=0;i<k.qcols*k.qrows;i++){
					if(bd.getQsubCell(i)==1){ um.addOpe('cell','qsub',i,bd.getQsubCell(i),0);}
				}
				if(!g.vml){ pc.flushCanvasAll();}

				$.each(bd.cell,   function(i,cell){ cell.error=0; if(cell.qsub==1){ cell.qsub=0;} });
				$.each(bd.border, function(i,border){ border.error=0;});
				$.each(bd.excell, function(i,excell){ excell.error=0;});

				pc.paintAll();
			}
		};
	},

	kpgenerate : function(mode){
		kp.inputcol('image','knumq','-',[0,0]);
		kp.inputcol('num','knum_',' ',' ');
		kp.inputcol('num','knum1','1','1');
		kp.inputcol('num','knum2','2','2');
		kp.insertrow();
		kp.inputcol('num','knum3','3','3');
		kp.inputcol('num','knum4','4','4');
		kp.inputcol('num','knum5','5','5');
		kp.inputcol('num','knum6','6','6');
		kp.insertrow();
		kp.inputcol('num','knum7','7','7');
		kp.inputcol('num','knum8','8','8');
		kp.inputcol('num','knum9','9','9');
		kp.inputcol('num','knum0','0','0');
		kp.insertrow();
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(127, 127, 127)";

		pc.errcolor1 = "rgb(192, 0, 0)";
		pc.bcolor = "rgb(160, 255, 160)";
		pc.BBcolor = "rgb(127, 127, 127)";

		pc.qsubcolor3 = "rgb(192,192,192)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);

			this.drawWhiteCells(x1,y1,x2,y2);

			this.drawQSubCells(x1,y1,x2,y2);

			this.draw51(x1,y1,x2,y2,true);
			this.drawEXcell(x1,y1,x2,y2,true);
			this.drawTargetTriangle(x1,y1,x2,y2);

			this.drawBDline(x1,y1,x2,y2);
			this.drawBorders(x1,y1,x2,y2);

			this.drawBlackCells(x1,y1,x2,y2);

			this.drawChassis_ex1(x1-1,y1-1,x2,y2,true);

			this.drawNumbersOn51(x1,y1,x2,y2);
			this.drawNumbersOn51EX(x1,y1,x2,y2);

			this.drawBoxBorders(x1-1,y1-1,x2+1,y2+1,1);

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	pzlinput : function(type, bstr){
		if(type==0 || type==1){
			bstr = enc.decodeBorder(bstr);
			bstr = this.decodeTilePaint(bstr);
		}
	},

	pzloutput : function(type){
		if(type==0)     { document.urloutput.ta.value = enc.getURLbase()+"?"+k.puzzleid+this.pzldata();}
		else if(type==1){ document.urloutput.ta.value = enc.getDocbase()+k.puzzleid+"/sa/m.html?"+this.pzldata();}
		else if(type==3){ document.urloutput.ta.value = enc.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
	},
	pzldata : function(){
		return "/"+k.qcols+"/"+k.qrows+"/"+enc.encodeBorder()+this.encodeTilePaint();
	},

	//---------------------------------------------------------
	decodeTilePaint : function(bstr){
		// �Ֆʓ������̃f�R�[�h
		var cell=0, a=0;
		for(var i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i);

			if(ca>='g' && ca<='z'){ cell+=(parseInt(ca,36)-15);}
			else{
				bd.setQuesCell(cell,51);
				if     (ca=='-'){
					bd.setDirecCell(cell,(bstr.charAt(i+1)!="."?parseInt(bstr.charAt(i+1),16):-1));
					bd.setQnumCell(cell,parseInt(bstr.substring(i+2,i+4),16));
					cell++; i+=3;
				}
				else if(ca=='+'){
					bd.setDirecCell(cell,parseInt(bstr.substring(i+1,i+3),16));
					bd.setQnumCell(cell,(bstr.charAt(i+3)!="."?parseInt(bstr.charAt(i+3),16):-1));
					cell++; i+=3;
				}
				else if(ca=='='){
					bd.setDirecCell(cell,parseInt(bstr.substring(i+1,i+3),16));
					bd.setQnumCell(cell,parseInt(bstr.substring(i+3,i+5),16));
					cell++; i+=4;
				}
				else{
					bd.setDirecCell(cell,(bstr.charAt(i)!="."?parseInt(bstr.charAt(i),16):-1));
					bd.setQnumCell(cell,(bstr.charAt(i+1)!="."?parseInt(bstr.charAt(i+1),16):-1));
					cell++; i+=1;
				}
			}
			if(cell>=bd.cell.length){ a=i+1; break;}
		}

		// �ՖʊO�����̃f�R�[�h
		cell=0;
		for(var i=a;i<bstr.length;i++){
			var ca = bstr.charAt(i);
			if     (ca=='.'){ bd.setDirecEXcell(cell,-1); cell++;}
			else if(ca=='-'){ bd.setDirecEXcell(cell,parseInt(bstr.substring(i+1,i+3),16)); cell++; i+=2;}
			else            { bd.setDirecEXcell(cell,parseInt(ca,16)); cell++;}
			if(cell>=k.qcols){ a=i+1; break;}
		}
		for(var i=a;i<bstr.length;i++){
			var ca = bstr.charAt(i);
			if     (ca=='.'){ bd.setQnumEXcell(cell,-1); cell++;}
			else if(ca=='-'){ bd.setQnumEXcell(cell,parseInt(bstr.substring(i+1,i+3),16)); cell++; i+=2;}
			else            { bd.setQnumEXcell(cell,parseInt(ca,16)); cell++;}
			if(cell>=k.qcols+k.qrows){ a=i+1; break;}
		}

		return bstr.substring(a,bstr.length);
	},
	encodeTilePaint : function(type){
		var cm="";

		// �Ֆʓ����̐��������̃G���R�[�h
		var count=0;
		for(var c=0;c<bd.cell.length;c++){
			var pstr = "";

			if(bd.getQuesCell(c)==51){
				pstr+=bd.getDirecCell(c).toString(16);
				pstr+=bd.getQnumCell(c).toString(16);

				if     (bd.getQnumCell(c) >=16 && bd.getDirecCell(c)>=16){ pstr = ("="+pstr);}
				else if(bd.getQnumCell(c) >=16){ pstr = ("-"+pstr);}
				else if(bd.getDirecCell(c)>=16){ pstr = ("+"+pstr);}
			}
			else{ pstr=" "; count++;}

			if     (count== 0){ cm += pstr;}
			else if(pstr!=" "){ cm += ((count+15).toString(36)+pstr); count=0;}
			else if(count==20){ cm += "z"; count=0;}
		}
		if(count>0){ cm += (count+15).toString(36);}

		// �ՖʊO���̐��������̃G���R�[�h
		for(var c=0;c<k.qcols;c++){
			if     (bd.getDirecEXcell(c)<  0){ cm += ".";}
			else if(bd.getDirecEXcell(c)< 16){ cm += bd.getDirecEXcell(c).toString(16);}
			else if(bd.getDirecEXcell(c)<256){ cm += ("-"+bd.getDirecEXcell(c).toString(16));}
		}
		for(var c=k.qcols;c<k.qcols+k.qrows;c++){
			if     (bd.getQnumEXcell(c)<  0){ cm += ".";}
			else if(bd.getQnumEXcell(c)< 16){ cm += bd.getQnumEXcell(c).toString(16);}
			else if(bd.getQnumEXcell(c)<256){ cm += ("-"+bd.getQnumEXcell(c).toString(16));}
		}

		return cm;
	},

	//---------------------------------------------------------
	decodeOthers : function(array){
		if(array.length<2*k.qrows+1){ return false;}
		fio.decodeCell( function(c,ca){
			if     (ca == "#"){ bd.setQansCell(c, 1);}
			else if(ca == "+"){ bd.setQsubCell(c, 1);}
			else if(ca == "-"){ bd.setQsubCell(c, 3);}
		},array.slice(k.qrows+1,2*k.qrows+1));
		return true;
	},
	encodeOthers : function(){
		return ""+fio.encodeCell( function(c){
			if     (bd.getQansCell(c)==1){ return "# ";}
			else if(bd.getQsubCell(c)==1){ return "+ ";}
			else if(bd.getQsubCell(c)==3){ return "- ";}
			else                         { return ". ";}
		});
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	check : function(){

		if( !ans.checkSameObjectInRoom(ans.searchRarea(), function(c){ return bd.getQansCell(c);}) ){
			ans.setAlert('���}�X�ƍ��}�X�̍��݂����^�C��������܂��B','A tile includes both balck and white cells.'); return false;
		}

		if( !this.checkRowsCols() ){
			ans.setAlert('�����̉����E�ɂ��鍕�}�X�̐����Ԉ���Ă��܂��B','The number of black cells underward or rightward is not correct.'); return false;
		}

		return true;
	},

	checkRowsCols : function(){
		var num, cnt, clist;

		for(var cy=0;cy<k.qrows;cy++){
			cnt = 0; clist = new Array();
			num = bd.getQnumEXcell(bd.getexnum(-1,cy));
			bd.setErrorEXcell([bd.getexnum(-1,cy)],1);
			for(var cx=0;cx<=k.qcols;cx++){
				var cc = bd.getcnum(cx,cy);
				if(cx==k.qcols || bd.getQuesCell(cc)==51){
					if(clist.length>0 && num!=cnt){ bd.setErrorCell(clist,1); return false;}

					bd.setErrorEXcell([bd.getexnum(-1,cy)],0);
					if(cx==k.qcols){ break;}
					num = bd.getQnumCell(cc);
					cnt = 0; clist = new Array();
				}
				else if(bd.getQansCell(cc)==1){ cnt++;}
				clist.push(cc);
			}
			bd.setErrorEXcell([bd.getexnum(-1,cy)],0);
		}
		for(var cx=0;cx<k.qcols;cx++){
			cnt = 0; clist = new Array();
			num = bd.getDirecEXcell([bd.getexnum(cx,-1)]);
			bd.setErrorEXcell([bd.getexnum(cx,-1)],1);
			for(var cy=0;cy<k.qrows;cy++){
				var cc = bd.getcnum(cx,cy);
				if(cy==k.qrows || bd.getQuesCell(cc)==51){
					if(clist.length>0 && num!=cnt){ bd.setErrorCell(clist,1); return false;}

					bd.setErrorEXcell([bd.getexnum(cx,-1)],0);
					if(cy==k.qrows){ break;}
					num = bd.getDirecCell(cc);
					cnt = 0; clist = new Array();
				}
				else if(bd.getQansCell(cc)==1){ cnt++;}
				clist.push(cc);
			}
			bd.setErrorEXcell([bd.getexnum(cx,-1)],0);
		}

		return true;
	}
};
