//
// �p�Y���ŗL�X�N���v�g�� �g���v���C�X�� triplace.js v3.3.0
//
Puzzles.triplace = function(){ };
Puzzles.triplace.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
		k.irowake  = 0;		// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross  = 0;		// 1:�Ֆʓ�����Cross������p�Y�� 2:�O�g����܂߂�Cross������p�Y��
		k.isborder = 1;		// 1:Border/Line������\�ȃp�Y�� 2:�O�g�������\�ȃp�Y��
		k.isexcell = 1;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isLineCross     = false;	// ������������p�Y��
		k.isCenterLine    = false;	// �}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = false;	// ���E����line�Ƃ��Ĉ���
		k.hasroom         = true;	// �������̗̈�ɕ�����Ă���/������p�Y��
		k.roomNumber      = false;	// �����̖��̐�����1��������p�Y��

		k.dispzero        = true;	// 0��\�����邩�ǂ���
		k.isDispHatena    = false;	// qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber     = false;	// �񓚂ɐ�������͂���p�Y��
		k.NumberWithMB    = false;	// �񓚂̐����Ɓ��~������p�Y��
		k.linkNumber      = false;	// �������ЂƂȂ���ɂȂ�p�Y��

		k.BlackCell       = false;	// ���}�X����͂���p�Y��
		k.NumberIsWhite   = false;	// �����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell     = false;	// �A�����f�ւ̃p�Y��
		k.checkBlackCell  = false;	// ��������ō��}�X�̏����`�F�b�N����p�Y��
		k.checkWhiteCell  = false;	// ��������Ŕ��}�X�̏����`�F�b�N����p�Y��

		k.ispzprv3ONLY    = true;	// �ς��Ղ�A�v���b�g�ɂ͑��݂��Ȃ��p�Y��
		k.isKanpenExist   = false;	// pencilbox/�J���y���ɂ���p�Y��

		if(k.EDITOR){
			base.setExpression("�@���{�^���ŋ��E�����A�E�{�^���ŕ⏕�L�������͂ł��܂��B��������͂���ꏊ��SHIFT�L�[�������Ɛ؂�ւ����܂��B",
							   " Left Button Drag to input border lines, Right Click to auxiliary marks. Press SHIFT key to change the side of inputting numbers.");
		}
		else{
			base.setExpression("�@���{�^���ŋ��E�����A�E�{�^���ŕ⏕�L�������͂ł��܂��B�Z���̃N���b�N���AZ�L�[�����Ȃ���w�i�F(2���)����͂��邱�Ƃ��ł��܂��B",
							   " Left Button Drag to input border lines, Right Click to auxiliary marks. Click cell or Click with Pressing Z key to input background color.");
		}
		base.setTitle("�g���v���C�X","Tri-place");
		base.setFloatbgcolor("rgb(96, 96, 96)");
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
				if(!kc.isZ){
					if(this.btn.Left) this.inputborderans();
					else if(this.btn.Right) this.inputQsubLine();
				}
				else this.inputBGcolor();
			}
		};
		mv.mouseup = function(){
			if(k.playmode && this.notInputted()) this.inputBGcolor();
		};
		mv.mousemove = function(){
			if(k.playmode){
				if(!kc.isZ){
					if(this.btn.Left) this.inputborderans();
					else if(this.btn.Right) this.inputQsubLine();
				}
				else this.inputBGcolor();
			}
		};
		mv.set51cell = function(cc,val){
			if(val==true){
				bd.sQuC(cc,51);
				bd.sQnC(cc,-1);
				bd.sDiC(cc,-1);
				if(bd.ub(cc)!==-1){ bd.sQuB(bd.ub(cc), ((bd.up(cc)!=-1 && bd.QuC(bd.up(cc))!=51)?1:0));}
				if(bd.db(cc)!==-1){ bd.sQuB(bd.db(cc), ((bd.dn(cc)!=-1 && bd.QuC(bd.dn(cc))!=51)?1:0));}
				if(bd.lb(cc)!==-1){ bd.sQuB(bd.lb(cc), ((bd.lt(cc)!=-1 && bd.QuC(bd.lt(cc))!=51)?1:0));}
				if(bd.rb(cc)!==-1){ bd.sQuB(bd.rb(cc), ((bd.rt(cc)!=-1 && bd.QuC(bd.rt(cc))!=51)?1:0));}
			}
			else{
				bd.sQuC(cc,0);
				bd.sQnC(cc,-1);
				bd.sDiC(cc,-1);
				if(bd.ub(cc)!==-1){ bd.sQuB(bd.ub(cc), ((bd.up(cc)!=-1 && bd.QuC(bd.up(cc))==51)?1:0));}
				if(bd.db(cc)!==-1){ bd.sQuB(bd.db(cc), ((bd.dn(cc)!=-1 && bd.QuC(bd.dn(cc))==51)?1:0));}
				if(bd.lb(cc)!==-1){ bd.sQuB(bd.lb(cc), ((bd.lt(cc)!=-1 && bd.QuC(bd.lt(cc))==51)?1:0));}
				if(bd.rb(cc)!==-1){ bd.sQuB(bd.rb(cc), ((bd.rt(cc)!=-1 && bd.QuC(bd.rt(cc))==51)?1:0));}
			}
		};
		mv.inputBGcolor = function(){
			var cc = this.cellid();
			if(cc==-1 || cc==this.mouseCell || bd.QuC(cc)==51){ return;}
			if(this.inputData==-1){
				if(this.btn.Left){
					if     (bd.QsC(cc)==0){ this.inputData=1;}
					else if(bd.QsC(cc)==1){ this.inputData=2;}
					else                  { this.inputData=0;}
				}
				else if(this.btn.Right){
					if     (bd.QsC(cc)==0){ this.inputData=2;}
					else if(bd.QsC(cc)==1){ this.inputData=0;}
					else                  { this.inputData=1;}
				}
			}
			bd.sQsC(cc, this.inputData);
			this.mouseCell = cc;
			pc.paintCell(cc);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.playmode){
				if(ca=='z' && !this.keyPressed){ this.isZ=true; }
				return;
			}
			if(this.moveTCell(ca)){ return;}
			this.inputnumber51(ca,{2:(k.qcols-(tc.cursorx>>1)-1), 4:(k.qrows-(tc.cursory>>1)-1)});
		};
		kc.keyup    = function(ca){ if(ca=='z'){ this.isZ=false;}};

		kc.isZ = false;

		if(k.EDITOR){
			kp.kpgenerate = function(mode){
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
			kp.generate(kp.ORIGINAL, false, true, kp.kpgenerate);
			kp.imgCR = [1,1];
			kp.kpinput = function(ca){
				kc.inputnumber51(ca,{2:(k.qcols-(tc.cursorx>>1)-1), 4:(k.qrows-(tc.cursory>>1)-1)});
			};
		}

		menu.ex.adjustSpecial  = menu.ex.adjustQues51_1;
		menu.ex.adjustSpecial2 = menu.ex.adjustQues51_2;

		tc.targetdir = 2;
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_LIGHT;
		pc.borderQanscolor = "rgb(0, 160, 0)";
		pc.setBGCellColorFunc('qsub2');

		pc.paint = function(x1,y1,x2,y2){
			this.drawBGCells(x1,y1,x2,y2);
			this.drawBGEXcells(x1,y1,x2,y2);
			this.drawQues51(x1,y1,x2,y2);

			this.drawGrid(x1,y1,x2,y2);
			this.drawQansBorders(x1,y1,x2,y2);
			this.drawQuesBorders(x1,y1,x2,y2);

			this.drawBorderQsubs(x1,y1,x2,y2);

			this.drawChassis_ex1(x1-1,y1-1,x2,y2,false);

			this.drawNumbersOn51(x1,y1,x2,y2);

			this.drawTarget(x1,y1,x2,y2);
		};

		// ���Ɖ񓚂̋��E����ʁX�ɕ`�悷��悤�ɂ��܂�
		pc.drawQansBorders = function(x1,y1,x2,y2){
			this.vinc('border_answer', 'crispEdges');
			this.bdheader = "b_bdans";
			this.setBorderColor = function(id){ return (bd.border[id].qans===1);};

			g.fillStyle = this.borderQanscolor;
			var idlist = bd.borderinside(x1-1,y1-1,x2+1,y2+1);
			for(var i=0;i<idlist.length;i++){ this.drawBorder1(idlist[i]);}
			this.isdrawBD = true;
		};
		pc.drawQuesBorders = function(x1,y1,x2,y2){
			this.vinc('border_question', 'crispEdges');
			this.bdheader = "b_bdques";
			this.setBorderColor = function(id){ return (bd.border[id].ques===1);};

			g.fillStyle = this.borderQuescolor;
			var idlist = bd.borderinside(x1-1,y1-1,x2+1,y2+1);
			for(var i=0;i<idlist.length;i++){ this.drawBorder1(idlist[i]);}
			this.isdrawBD = true;
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type){
			this.decodeTriplace();
		};
		enc.pzlexport = function(type){
			this.encodeTriplace();
		};

		enc.decodeTriplace = function(){
			// �Ֆʓ������̃f�R�[�h
			var cell=0, a=0, bstr = this.outbstr;
			for(var i=0;i<bstr.length;i++){
				var ca = bstr.charAt(i);

				if(ca>='g' && ca<='z'){ cell+=(parseInt(ca,36)-15);}
				else{
					mv.set51cell(cell,true);
					if     (ca=='_'){ cell++;}
					else if(ca=='$'){ bd.sQnC(cell,bstr.charAt(i+1)); cell++; i++;}
					else if(ca=='%'){ bd.sDiC(cell,bstr.charAt(i+1)); cell++; i++;}
					else if(ca=='-'){
						bd.sDiC(cell,(bstr.charAt(i+1)!="."?parseInt(bstr.charAt(i+1),16):-1));
						bd.sQnC(cell,parseInt(bstr.substr(i+2,2),16));
						cell++; i+=3;
					}
					else if(ca=='+'){
						bd.sDiC(cell,parseInt(bstr.substr(i+1,2),16));
						bd.sQnC(cell,(bstr.charAt(i+3)!="."?parseInt(bstr.charAt(i+3),16):-1));
						cell++; i+=3;
					}
					else if(ca=='='){
						bd.sDiC(cell,parseInt(bstr.substr(i+1,2),16));
						bd.sQnC(cell,parseInt(bstr.substr(i+3,2),16));
						cell++; i+=4;
					}
					else{
						bd.sDiC(cell,(bstr.charAt(i)!="."?parseInt(bstr.charAt(i),16):-1));
						bd.sQnC(cell,(bstr.charAt(i+1)!="."?parseInt(bstr.charAt(i+1),16):-1));
						cell++; i+=1;
					}
				}
				if(cell>=bd.cellmax){ a=i+1; break;}
			}

			// �ՖʊO�����̃f�R�[�h
			cell=0;
			for(var i=a;i<bstr.length;i++){
				var ca = bstr.charAt(i);
				if     (ca=='.'){ bd.sDiE(cell,-1); cell++;}
				else if(ca=='-'){ bd.sDiE(cell,parseInt(bstr.substr(i+1,2),16)); cell++; i+=2;}
				else            { bd.sDiE(cell,parseInt(ca,16)); cell++;}
				if(cell>=k.qcols){ a=i+1; break;}
			}
			for(var i=a;i<bstr.length;i++){
				var ca = bstr.charAt(i);
				if     (ca=='.'){ bd.sQnE(cell,-1); cell++;}
				else if(ca=='-'){ bd.sQnE(cell,parseInt(bstr.substr(i+1,2),16)); cell++; i+=2;}
				else            { bd.sQnE(cell,parseInt(ca,16)); cell++;}
				if(cell>=k.qcols+k.qrows){ a=i+1; break;}
			}

			this.outbstr = bstr.substr(a);
		};
		enc.encodeTriplace = function(type){
			var cm="";

			// �Ֆʓ����̐��������̃G���R�[�h
			var count=0;
			for(var c=0;c<bd.cellmax;c++){
				var pstr = "";

				if(bd.QuC(c)==51){
					if(bd.QnC(c)==-1 && bd.DiC(c)==-1){ pstr="_";}
					else if(bd.DiC(c)==-1 && bd.QnC(c)<35){ pstr="$"+bd.QnC(c).toString(36);}
					else if(bd.QnC(c)==-1 && bd.DiC(c)<35){ pstr="%"+bd.DiC(c).toString(36);}
					else{
						pstr+=bd.DiC(c).toString(16);
						pstr+=bd.QnC(c).toString(16);

						if     (bd.QnC(c) >=16 && bd.DiC(c)>=16){ pstr = ("="+pstr);}
						else if(bd.QnC(c) >=16){ pstr = ("-"+pstr);}
						else if(bd.DiC(c)>=16){ pstr = ("+"+pstr);}
					}
				}
				else{ pstr=" "; count++;}

				if     (count== 0){ cm += pstr;}
				else if(pstr!=" "){ cm += ((count+15).toString(36)+pstr); count=0;}
				else if(count==20){ cm += "z"; count=0;}
			}
			if(count>0){ cm += (count+15).toString(36);}

			// �ՖʊO���̐��������̃G���R�[�h
			for(var c=0;c<k.qcols;c++){
				if     (bd.DiE(c)<  0){ cm += ".";}
				else if(bd.DiE(c)< 16){ cm += bd.DiE(c).toString(16);}
				else if(bd.DiE(c)<256){ cm += ("-"+bd.DiE(c).toString(16));}
			}
			for(var c=k.qcols;c<k.qcols+k.qrows;c++){
				if     (bd.QnE(c)<  0){ cm += ".";}
				else if(bd.QnE(c)< 16){ cm += bd.QnE(c).toString(16);}
				else if(bd.QnE(c)<256){ cm += ("-"+bd.QnE(c).toString(16));}
			}

			this.outbstr += cm;
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			this.decodeCellQnum51();
			this.decodeBorderAns();
			this.decodeCell( function(c,ca){
				if     (ca == "+"){ bd.sQsC(c, 1);}
				else if(ca == "-"){ bd.sQsC(c, 2);}
			});
		};
		fio.encodeData = function(){
			this.encodeCellQnum51();
			this.encodeBorderAns();
			this.encodeCell( function(c){
				if     (bd.QsC(c)==1){ return "+ ";}
				else if(bd.QsC(c)==2){ return "- ";}
				else                 { return ". ";}
			});
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			var tiles = this.getTileInfo();
			if( !this.checkAllArea(tiles, f_true, function(w,h,a,n){ return (a>=3);} ) ){
				this.setAlert('�T�C�Y��3�}�X��菬�����u���b�N������܂��B','The size of block is smaller than two.'); return false;
			}

			if( !this.checkRowsColsPartly(this.isTileCount, tiles, function(cc){ return (bd.QuC(cc)==51);}, false) ){
				this.setAlert('�����̉����E�ɂ���܂������̃u���b�N�̐����Ԉ���Ă��܂��B','The number of straight blocks underward or rightward is not correct.'); return false;
			}

			if( !this.checkAllArea(tiles, f_true, function(w,h,a,n){ return (a<=3);} ) ){
				this.setAlert('�T�C�Y��3�}�X���傫���u���b�N������܂��B','The size of block is bigger than four.'); return false;
			}

			return true;
		};

		ans.getTileInfo = function(){
			var tinfo = new AreaInfo();
			for(var c=0;c<bd.cellmax;c++){ tinfo.id[c]=(bd.QuC(c)!=51?0:-1);}
			for(var c=0;c<bd.cellmax;c++){
				if(tinfo.id[c]!=0){ continue;}
				tinfo.max++;
				tinfo[tinfo.max] = {clist:[]};
				area.sr0(c, tinfo, bd.isBorder);

				var clist = tinfo[tinfo.max].clist;
				var d = ans.getSizeOfClist(clist,f_true);

				tinfo.room[tinfo.max] = {idlist:clist, is1x3:((((d.x1===d.x2)||(d.y1===d.y2))&&d.cnt===3)?1:0)};
			}
			return tinfo;
		};

		ans.isTileCount = function(number, keycellpos, clist, tiles){
			var count = 0, counted = [];
			for(var i=0;i<clist.length;i++){
				var tid = tiles.id[clist[i]];
				if(tiles.room[tid].is1x3==1 && !counted[tid]){ count++; counted[tid] = true;}
			}
			if(number>=0 && count!=number){
				var isex = (keycellpos[0]===-1 || keycellpos[1]===-1);
				if(isex){ bd.sErE(bd.exnum(keycellpos[0],keycellpos[1]),1);}
				else    { bd.sErC(bd.cnum (keycellpos[0],keycellpos[1]),1);}
				bd.sErC(clist,1);
				return false;
			}
			return true;
		};
	}
};
