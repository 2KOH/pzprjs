//
// �p�Y���ŗL�X�N���v�g�� �g���v���C�X�� triplace.js v3.2.0
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

		k.BlackCell     = 0;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

		k.fstruct = ["cellqnum51", "borderans", "others"];

		//k.def_csize = 36;
		k.def_psize = 40;

		if(k.callmode=="pplay"){
			base.setExpression("�@���{�^���ŋ��E�����A�E�{�^���ŕ⏕�L�������͂ł��܂��B�Z���̃N���b�N���AZ�L�[�����Ȃ���w�i�F(2���)����͂��邱�Ƃ��ł��܂��B",
							   " Left Button Drag to input border lines, Right Click to auxiliary marks. Click cell or Click with Pressing Z key to input background color.");
		}
		else{
			base.setExpression("�@���{�^���ŋ��E�����A�E�{�^���ŕ⏕�L�������͂ł��܂��B��������͂���ꏊ��SHIFT�L�[�������Ɛ؂�ւ����܂��B",
							   " Left Button Drag to input border lines, Right Click to auxiliary marks. Press SHIFT key to change the side of inputting numbers.");
		}
		base.setTitle("�g���v���C�X","Tri-place");
		base.setFloatbgcolor("rgb(96, 96, 96)");
	},
	menufix : function(){ },

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(k.mode==1){
				if(!kp.enabled()){ this.input51(x,y);}
				else{ kp.display(x,y);}
			}
			else if(k.mode==3){
				if(!kc.isZ){
					if(this.btn.Left) this.inputborderans(x,y);
					else if(this.btn.Right) this.inputQsubLine(x,y);
				}
				else this.inputBGcolor(x,y);
			}
		};
		mv.mouseup = function(x,y){
			if(k.mode==3 && this.notInputted()) this.inputBGcolor(x,y);
		};
		mv.mousemove = function(x,y){
			if(k.mode==3){
				if(!kc.isZ){
					if(this.btn.Left) this.inputborderans(x,y);
					else if(this.btn.Right) this.inputQsubLine(x,y);
				}
				else this.inputBGcolor(x,y);
			}
		};
		mv.set51cell = function(cc,val){
			if(val==true){
				bd.sQuC(cc,51);
				bd.sQnC(cc,-1);
				bd.sDiC(cc,-1);
				bd.sQuB(bd.ub(cc),((bd.up(cc)!=-1 && bd.QuC(bd.up(cc))!=51)?1:0));
				bd.sQuB(bd.db(cc),((bd.dn(cc)!=-1 && bd.QuC(bd.dn(cc))!=51)?1:0));
				bd.sQuB(bd.lb(cc),((bd.lt(cc)!=-1 && bd.QuC(bd.lt(cc))!=51)?1:0));
				bd.sQuB(bd.rb(cc),((bd.rt(cc)!=-1 && bd.QuC(bd.rt(cc))!=51)?1:0));
			}
			else{
				bd.sQuC(cc,0);
				bd.sQnC(cc,-1);
				bd.sDiC(cc,-1);
				bd.sQuB(bd.ub(cc),((bd.up(cc)!=-1 && bd.QuC(bd.up(cc))==51)?1:0));
				bd.sQuB(bd.db(cc),((bd.dn(cc)!=-1 && bd.QuC(bd.dn(cc))==51)?1:0));
				bd.sQuB(bd.lb(cc),((bd.lt(cc)!=-1 && bd.QuC(bd.lt(cc))==51)?1:0));
				bd.sQuB(bd.rb(cc),((bd.rt(cc)!=-1 && bd.QuC(bd.rt(cc))==51)?1:0));
			}
		};
		mv.inputBGcolor = function(x,y){
			var cc = this.cellid(new Pos(x,y));
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
			if(k.mode==3){
				if(ca=='z' && !this.keyPressed){ this.isZ=true; }
				return;
			}
			if(this.moveTCell(ca)){ return;}
			this.inputnumber51(ca,{2:(k.qcols-tc.getTCX()-1), 4:(k.qrows-tc.getTCY()-1)});
		};
		kc.keyup    = function(ca){ if(ca=='z'){ this.isZ=false;}};

		kc.isZ = false;

		if(k.callmode == "pmake"){
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
			kp.generate(99, true, false, kp.kpgenerate.bind(kp));
			kp.imgCR = [1,1];
			kp.kpinput = function(ca){
				kc.key_inputqnum(ca,99);
			};
		}

		menu.ex.adjustSpecial  = menu.ex.adjustQues51_1;
		menu.ex.adjustSpecial2 = menu.ex.adjustQues51_2;

		tc.getTCX = function(){ return int((tc.cursolx-1)/2);};
		tc.getTCY = function(){ return int((tc.cursoly-1)/2);};
		tc.targetdir = 2;
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(127, 127, 127)";
		pc.BorderQanscolor = "rgb(0, 160, 0)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);

			this.drawQSubCells(x1,y1,x2,y2);

			this.draw51(x1,y1,x2,y2,true);
			this.drawEXcell(x1,y1,x2,y2,true);
			this.drawTargetTriangle(x1,y1,x2,y2);

			this.drawBDline(x1,y1,x2,y2);
			this.drawBorders(x1,y1,x2,y2);
			this.drawBorders51(x1,y1,x2,y2);

			this.drawChassis_ex1(x1-1,y1-1,x2,y2,false);

			this.drawBorderQsubs(x1,y1,x2,y2);

			this.drawNumbersOn51(x1,y1,x2,y2);
			this.drawNumbersOn51EX(x1,y1,x2,y2);

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};

		// �������̕`��
		pc.drawBorders51 = function(x1,y1,x2,y2){
			var idlist = this.borderinside(x1*2-4,y1*2-4,x2*2+4,y2*2+4,f_true);
			for(var i=0;i<idlist.length;i++){
				var id = idlist[i], cc1=bd.cc1(id), cc2=bd.cc2(id);

				this.vhide(["b"+id+"_bdm_"]);
				if((cc1!=-1&&bd.QuC(cc1)==51)&&(cc2!=-1&&bd.QuC(cc2)==51)){
					g.fillStyle="black";
					if(this.vnop("b"+id+"_bdm_",1)){
						if     (bd.border[id].cy%2==1){ g.fillRect(bd.border[id].px()               , bd.border[id].py()-mf(k.cheight/2), 1         , k.cheight+1);}
						else if(bd.border[id].cx%2==1){ g.fillRect(bd.border[id].px()-mf(k.cwidth/2), bd.border[id].py()                , k.cwidth+1, 1          );}
					}
				}
			}
			this.vinc();
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
						bd.sQnC(cell,parseInt(bstr.substring(i+2,i+4),16));
						cell++; i+=3;
					}
					else if(ca=='+'){
						bd.sDiC(cell,parseInt(bstr.substring(i+1,i+3),16));
						bd.sQnC(cell,(bstr.charAt(i+3)!="."?parseInt(bstr.charAt(i+3),16):-1));
						cell++; i+=3;
					}
					else if(ca=='='){
						bd.sDiC(cell,parseInt(bstr.substring(i+1,i+3),16));
						bd.sQnC(cell,parseInt(bstr.substring(i+3,i+5),16));
						cell++; i+=4;
					}
					else{
						bd.sDiC(cell,(bstr.charAt(i)!="."?parseInt(bstr.charAt(i),16):-1));
						bd.sQnC(cell,(bstr.charAt(i+1)!="."?parseInt(bstr.charAt(i+1),16):-1));
						cell++; i+=1;
					}
				}
				if(cell>=bd.cell.length){ a=i+1; break;}
			}

			// �ՖʊO�����̃f�R�[�h
			cell=0;
			for(var i=a;i<bstr.length;i++){
				var ca = bstr.charAt(i);
				if     (ca=='.'){ bd.sDiE(cell,-1); cell++;}
				else if(ca=='-'){ bd.sDiE(cell,parseInt(bstr.substring(i+1,i+3),16)); cell++; i+=2;}
				else            { bd.sDiE(cell,parseInt(ca,16)); cell++;}
				if(cell>=k.qcols){ a=i+1; break;}
			}
			for(var i=a;i<bstr.length;i++){
				var ca = bstr.charAt(i);
				if     (ca=='.'){ bd.sQnE(cell,-1); cell++;}
				else if(ca=='-'){ bd.sQnE(cell,parseInt(bstr.substring(i+1,i+3),16)); cell++; i+=2;}
				else            { bd.sQnE(cell,parseInt(ca,16)); cell++;}
				if(cell>=k.qcols+k.qrows){ a=i+1; break;}
			}

			return bstr.substring(a,bstr.length);
		};
		enc.encodeTriplace = function(type){
			var cm="";

			// �Ֆʓ����̐��������̃G���R�[�h
			var count=0;
			for(var c=0;c<bd.cell.length;c++){
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

			var tiles = this.searchTParea();
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

		ans.searchTParea = function(){
			var area = new AreaInfo();
			var func = function(id){ return (id!=-1 && bd.QuB(id)==0 && bd.QaB(id)==0); };
			for(var c=0;c<bd.cell.length;c++){ area.check[c]=(bd.QuC(c)!=51?0:-1);}
			for(var c=0;c<bd.cell.length;c++){ if(area.check[c]==0){ area.max++; area.room[area.max]=new Array(); ans.sr0(func, area, c, area.max);} }
			return area;
		};
		ans.checkRowsCols = function(area){
			var num, cnt, clist, counted;

			var is1x3 = new Array();
			for(var r=1;r<=area.max;r++){
				var d = this.getSizeOfArea(area,r,f_true);
				is1x3[r] = ((((d.x1==d.x2)||(d.y1==d.y2))&&d.cnt==3)?1:0);
			}

			for(var cy=0;cy<k.qrows;cy++){
				cnt = 0; clist = new Array();
				num = bd.QnE(bd.exnum(-1,cy));
				counted = new Array();
				bd.sErE([bd.exnum(-1,cy)],1);
				for(var cx=0;cx<=k.qcols;cx++){
					var cc = bd.cnum(cx,cy);
					if(cx==k.qcols || bd.QuC(cc)==51){
						if(num>=0 && clist.length>0 && num!=cnt){ bd.sErC(clist,1); return false;}

						bd.sErE([bd.exnum(-1,cy)],0);
						if(cx==k.qcols){ break;}
						num = bd.QnC(cc);
						cnt = 0; clist = new Array();
						counted = new Array();
					}
					else if(is1x3[area.check[cc]]==1 && !counted[area.check[cc]]){ cnt++; counted[area.check[cc]]=true;}
					clist.push(cc);
				}
				bd.sErE([bd.exnum(-1,cy)],0);
			}
			for(var cx=0;cx<k.qcols;cx++){
				cnt = 0; clist = new Array();
				num = bd.DiE([bd.exnum(cx,-1)]);
				counted = new Array();
				bd.sErE([bd.exnum(cx,-1)],1);
				for(var cy=0;cy<k.qrows;cy++){
					var cc = bd.cnum(cx,cy);
					if(cy==k.qrows || bd.QuC(cc)==51){
						if(num>=0 && clist.length>0 && num!=cnt){ bd.sErC(clist,1); return false;}

						bd.sErE([bd.exnum(cx,-1)],0);
						if(cy==k.qrows){ break;}
						num = bd.DiC(cc);
						cnt = 0; clist = new Array();
						counted = new Array();
					}
					else if(is1x3[area.check[cc]]==1 && !counted[area.check[cc]]){ cnt++; counted[area.check[cc]]=true;}
					clist.push(cc);
				}
				bd.sErE([bd.exnum(cx,-1)],0);
			}

			return true;
		};
	}
};
