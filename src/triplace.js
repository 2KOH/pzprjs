//
// �p�Y���ŗL�X�N���v�g�� �g���v���C�X�� triplace.js v3.2.3
//
Puzzles.triplace = function(){ };
Puzzles.triplace.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
		k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
		k.isextendcell = 1;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

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
		k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

		k.fstruct = ["cellqnum51", "borderans", "others"];

		//k.def_csize = 36;
		k.def_psize = 40;
		//k.area = { bcell:0, wcell:0, number:0};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

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
			this.inputnumber51(ca,{2:(k.qcols-tc.getTCX()-1), 4:(k.qrows-tc.getTCY()-1)});
		};
		kc.keyup    = function(ca){ if(ca=='z'){ this.isZ=false;}};

		kc.isZ = false;

		if(k.EDITOR){
			kp.kpgenerate = function(mode){
				this.inputcol('image','knumq','-',[0,0]);
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
			kp.generate(kp.ORIGINAL, true, false, kp.kpgenerate);
			kp.imgCR = [1,1];
			kp.kpinput = function(ca){
				kc.key_inputqnum(ca);
			};
		}

		menu.ex.adjustSpecial  = menu.ex.adjustQues51_1;
		menu.ex.adjustSpecial2 = menu.ex.adjustQues51_2;

		tc.getTCX = function(){ return mf((tc.cursolx-1)/2);};
		tc.getTCY = function(){ return mf((tc.cursoly-1)/2);};
		tc.targetdir = 2;
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_LIGHT;
		pc.BorderQanscolor = "rgb(0, 160, 0)";
		pc.setBGCellColorFunc('qsub2');

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);

			this.drawBGCells(x1,y1,x2,y2);

			this.draw51(x1,y1,x2,y2,true);
			this.draw51EXcells(x1,y1,x2,y2,true);
			this.drawTargetTriangle(x1,y1,x2,y2);

			this.drawGrid(x1,y1,x2,y2);
			this.drawBorders(x1,y1,x2,y2);

			this.drawChassis_ex1(x1-1,y1-1,x2,y2,false);

			this.drawBorderQsubs(x1,y1,x2,y2);

			this.drawNumbersOn51(x1,y1,x2,y2);

			this.drawTarget(x1,y1,x2,y2);
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==0 || type==1){ bstr = this.decodeTriplace(bstr);}
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?"+this.pzldata();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			return "/"+k.qcols+"/"+k.qrows+"/"+this.encodeTriplace();
		};

		enc.decodeTriplace = function(bstr){
			// �Ֆʓ������̃f�R�[�h
			var cell=0, a=0;
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

			return bstr.substr(a);
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

			return cm;
		};

		//---------------------------------------------------------
		fio.decodeOthers = function(array){
			if(array.length<k.qrows){ return false;}
			this.decodeCell( function(c,ca){
				if     (ca == "+"){ bd.sQsC(c, 1);}
				else if(ca == "-"){ bd.sQsC(c, 2);}
			},array.slice(0,k.qrows));
			return true;
		};

		fio.encodeOthers = function(){
			return ""+this.encodeCell( function(c){
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

			var tiles = this.checkTileInfo();
			if( !this.checkAllArea(tiles, f_true, function(w,h,a){ return (a>=3);} ) ){
				this.setAlert('�T�C�Y��3�}�X��菬�����u���b�N������܂��B','The size of block is smaller than two.'); return false;
			}

			if( !this.checkRowsCols(tiles) ){
				this.setAlert('�����̉����E�ɂ���܂������̃u���b�N�̐����Ԉ���Ă��܂��B','The number of straight blocks underward or rightward is not correct.'); return false;
			}

			if( !this.checkAllArea(tiles, f_true, function(w,h,a){ return (a<=3);} ) ){
				this.setAlert('�T�C�Y��3�}�X���傫���u���b�N������܂��B','The size of block is bigger than four.'); return false;
			}

			return true;
		};

		ans.checkTileInfo = function(){
			var tinfo = new AreaInfo();
			for(var c=0;c<bd.cellmax;c++){ tinfo.id[c]=(bd.QuC(c)!=51?0:-1);}
			for(var c=0;c<bd.cellmax;c++){
				if(tinfo.id[c]!=0){ continue;}
				tinfo.max++;
				tinfo[tinfo.max] = {clist:[]};
				area.sr0(c, tinfo, bd.isBorder);

				tinfo.room[tinfo.max] = {idlist:tinfo[tinfo.max].clist};
			}
			return tinfo;
		};
		ans.checkRowsCols = function(tiles){
			var num, cnt, clist, counted;

			var is1x3 = [];
			for(var r=1;r<=tiles.max;r++){
				var d = ans.getSizeOfClist(tiles.room[r].idlist,f_true);
				is1x3[r] = ((((d.x1==d.x2)||(d.y1==d.y2))&&d.cnt==3)?1:0);
			}

			for(var cy=0;cy<k.qrows;cy++){
				cnt = 0; clist = []; counted = [];
				num = bd.QnE(bd.exnum(-1,cy));
				bd.sErE([bd.exnum(-1,cy)],1);
				for(var cx=0;cx<=k.qcols;cx++){
					var cc = bd.cnum(cx,cy);
					if(cx==k.qcols || bd.QuC(cc)==51){
						if(num>=0 && clist.length>0 && num!=cnt){ bd.sErC(clist,1); return false;}

						bd.sErE([bd.exnum(-1,cy)],0);
						if(cx==k.qcols){ break;}
						num = bd.QnC(cc);
						cnt = 0; clist = []; counted = [];
					}
					else if(is1x3[tiles.id[cc]]==1 && !counted[tiles.id[cc]]){ cnt++; counted[tiles.id[cc]]=true;}
					clist.push(cc);
				}
				bd.sErE([bd.exnum(-1,cy)],0);
			}
			for(var cx=0;cx<k.qcols;cx++){
				cnt = 0; clist = []; counted = [];
				num = bd.DiE([bd.exnum(cx,-1)]);
				bd.sErE([bd.exnum(cx,-1)],1);
				for(var cy=0;cy<k.qrows;cy++){
					var cc = bd.cnum(cx,cy);
					if(cy==k.qrows || bd.QuC(cc)==51){
						if(num>=0 && clist.length>0 && num!=cnt){ bd.sErC(clist,1); return false;}

						bd.sErE([bd.exnum(cx,-1)],0);
						if(cy==k.qrows){ break;}
						num = bd.DiC(cc);
						cnt = 0; clist = []; counted = [];
					}
					else if(is1x3[tiles.id[cc]]==1 && !counted[tiles.id[cc]]){ cnt++; counted[tiles.id[cc]]=true;}
					clist.push(cc);
				}
				bd.sErE([bd.exnum(cx,-1)],0);
			}

			return true;
		};
	}
};
