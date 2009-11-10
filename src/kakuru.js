//
// �p�Y���ŗL�X�N���v�g�� �J�b�N���� kakuru.js v3.2.3
//
Puzzles.kakuru = function(){ };
Puzzles.kakuru.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 7;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 7;}	// �Ֆʂ̏c��
		k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
		k.isborder     = 0;		// 1:Border/Line������\�ȃp�Y��
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
		k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

		k.fstruct = ["others"];

		//k.def_csize = 36;
		//k.def_psize = 24;
		//k.area = { bcell:0, wcell:0, number:0};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		if(k.EDITOR){
			base.setExpression("�@���}�X��Q�L�[�œ��͂ł��܂��B",
							   " Press 'Q' key to input black cell.");
		}
		else{
			base.setExpression("�@�}�E�X��L�[�{�[�h�Ő��������͂ł��܂��B",
							   " It is available to input number by keybord or mouse");
		}
		base.setTitle("�J�b�N��","Kakuru");
		base.setFloatbgcolor("rgb(96, 255, 96)");
	},
	menufix : function(){ },

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if(k.editmode && !kp.enabled()){
				if(this.notInputted() && kp.enabled()){ kp.display();}
				else{ this.inputqnum_kakuru();}
			}
			else if(k.playmode){ this.inputqnum_kakuru();}
		};
		mv.mouseup = function(){ };
		mv.mousemove = function(){ };
		mv.inputqnum_kakuru = function(){
			var cc = this.cellid();
			if(cc==-1 || (bd.QuC(cc)==1 && cc==tc.getTCC())){ return;}
			this.inputqnum();
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum_kakuru(ca);
		};
		kc.key_inputqnum_kakuru = function(ca){
			var cc = tc.getTCC();

			if('0'<=ca && ca<='9'){
				if(bd.QuC(cc)==1){ return;}
				this.key_inputqnum(ca);
			}
			else if(ca=='-'){
				if(bd.QuC(cc)==1){ return;}
				if(k.editmode){ bd.sQnC(cc,(bd.QnC(cc)!=-2?-2:-1));}
				else{ bd.sQaC(cc,-1);}
			}
			else if(ca==' '){
				if(k.editmode){ bd.sQuC(cc,0); bd.sQnC(cc,-1);}
				else{ bd.sQaC(cc,-1);}
			}
			else if(k.editmode && (ca=='q'||ca=='q1'||ca=='q2')){
				if(ca=='q'){ ca = (bd.QuC(cc)!=1?'q1':'q2');}
				if(ca=='q1'){
					bd.sQuC(cc, 1);
					bd.sQaC(cc,-1);
					bd.sQnC(cc,-1);
				}
				else if(ca=='q2'){ bd.sQuC(cc, 0);}
			}
			else{ return;}
			this.prev=cc;
			pc.paintCell(cc);
		};

		if(k.EDITOR){
			kp.kpgenerate = function(mode){
				if(mode==1){
					this.inputcol('num','knumq1','q1','��');
					this.inputcol('num','knumq2','q2','��');
					this.inputcol('empty','knumx','','');
					this.inputcol('empty','knumy','','');
					this.insertrow();
				}
				this.inputcol('num','knum1','1','1');
				this.inputcol('num','knum2','2','2');
				this.inputcol('num','knum3','3','3');
				this.inputcol('num','knum4','4','4');
				this.insertrow();
				this.inputcol('num','knum5','5','5');
				this.inputcol('num','knum6','6','6');
				this.inputcol('num','knum7','7','7');
				this.inputcol('num','knum8','8','8');
				this.insertrow();
				this.inputcol('num','knum9','9','9');
				if(mode==1){ this.inputcol('num','knum0','0','0');}
				if(mode==1){ this.inputcol('num','knum_','-','?');}
				this.inputcol('num','knum.',' ',' ');
				this.insertrow();
			};
			kp.generate(kp.ORIGINAL, true, true, kp.kpgenerate.bind(kp));
			kp.kpinput = function(ca){
				kc.key_inputqnum_tateyoko(ca);
			};
		}

		bd.nummaxfunc = function(cc){ return (k.editmode?44:9);};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_LIGHT;

		pc.errbcolor1 = pc.errbcolor1_DARK;
		pc.errbcolor2 = "white";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);

			this.drawErrorCells(x1,y1,x2,y2);

			this.drawBCells2(x1,y1,x2,y2);
			this.drawGrid(x1,y1,x2,y2);
			this.drawBCells1(x1,y1,x2,y2);

			this.drawNumbers(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawTCell(x1,y1,x2+1,y2+1);
		};

		pc.drawBCells1 = function(x1,y1,x2,y2){
			var clist = this.cellinside(x1,y1,x2,y2,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.QuC(c)==1){
					g.fillStyle = this.Cellcolor;
					if(this.vnop("c"+c+"_full_",1)){ g.fillRect(bd.cell[c].px, bd.cell[c].py, k.cwidth+1, k.cheight+1);}
				}
				// drawBCells2�Ŋ���vhide����Ă���̂ŁA�����ł�vhide���Ȃ�
			}
			this.vinc();
		};
		pc.drawBCells2 = function(x1,y1,x2,y2){
			var clist = this.cellinside(x1,y1,x2,y2,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.QnC(c)!=-1){
					g.fillStyle = "rgb(208, 208, 208)";
					if(this.vnop("c"+c+"_full_",1)){ g.fillRect(bd.cell[c].px, bd.cell[c].py, k.cwidth+1, k.cheight+1);}
				}
				else{ this.vhide("c"+c+"_full_");}
			}
			this.vinc();
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==0 || type==1){ bstr = this.decodeKakuru(bstr);}
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?"+this.pzldata();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			return "/"+k.qcols+"/"+k.qrows+"/"+this.encodeKakuru();
		};

		enc.decodeKakuru = function(bstr){
			var cell=0, i=0;
			for(i=0;i<bstr.length;i++){
				var ca = bstr.charAt(i);

				if     (ca=='.'){ cell++;}
				else if(ca=='+'){ bd.sQuC(cell,1); cell++;}
				else if(enc.include(ca,"k","z")){ cell+=(parseInt(ca,36)-18);}
				else if(ca=='_'){ bd.sQnC(cell,-2); cell++;}
				else if(ca!='.'){ bd.sQnC(cell,this.decval(ca)); cell++;}
				else{ cell++;}

				if(cell>=bd.cellmax){ break;}
			}
			return bstr.substring(i,bstr.length);
		};
		enc.encodeKakuru = function(type){
			var cm="", count=0;
			for(var c=0;c<bd.cellmax;c++){
				var pstr="";
				if     (bd.QuC(c)==1){ pstr = "+";}
				else if(bd.QnC(c)!=-1){
					if(bd.QnC(c)==-2){ pstr = "_";}
					else{ pstr = ""+this.encval(bd.QnC(c));}
				}
				else{ count++;}

				if(count==0){ cm+=pstr;}
				else if(pstr!=""){
					if(count==1){ cm+=("."+pstr); count=0;}
					else{ cm+=((count+18).toString(36)+pstr); count=0;}
				}
				else if(count==17){ cm+="z"; count=0;}
			}
			if(count==1){ cm+=".";}
			else if(count>1){ cm+=((count+18).toString(36));}

			return cm;
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
		fio.decodeOthers = function(array){
			if(array.length<2*k.qrows){ return false;}
			this.decodeCell( function(c,ca){
				if     (ca=="?"){ bd.sQnC(c,-2);}
				else if(ca=="b"){ bd.sQuC(c, 1);}
				else if(ca!="."){ bd.sQnC(c, parseInt(ca));}
			},array.slice(0,k.qrows));
			this.decodeCell( function(c,ca){
				if(ca!="."&&ca!="0"){ bd.sQaC(c,parseInt(ca));}
			},array.slice(k.qrows,2*k.qrows));
			return true;
		};
		fio.encodeOthers = function(){
			return (""+this.encodeCell( function(c){
				if(bd.QuC(c)==1){ return "b ";}
				else if(bd.QnC(c)>= 0){ return ""+bd.QnC(c).toString()+" ";}
				else if(bd.QnC(c)==-2){ return "? ";}
				else{ return ". ";}
			}) + this.encodeCell( function(c){
				if     (bd.QuC(c)==1||bd.QnC(c)!=-1){ return ". ";}
				else if(bd.QaC(c)==-1){ return "0 ";}
				else{ return ""+bd.QaC(c).toString()+" ";}
			} ));
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkAroundPrenums() ){
				this.setAlert('���߂���o�Ă��鐔���̎���ɓ��������������Ă��܂��B','There are same numbers around the pre-numbered cell.'); return false;
			}

			if( !this.checkNumber() ){
				this.setAlert('���߂���o�Ă��鐔���̎���ɓ��鐔�̍��v������������܂���B','A sum of numbers around the pre-numbered cell is incorrect.'); return false;
			}

			if( !this.checkAroundNumbers() ){
				this.setAlert('�����������^�e���R�i�i���ɗאڂ��Ă��܂��B','Same numbers is adjacent.'); return false;
			}

			if( !this.checkAllCell(function(c){ return (bd.QuC(c)==0 && bd.QnC(c)==-1 && bd.QaC(c)==-1);}) ){
				this.setAlert('���������Ă��Ȃ��}�X������܂��B','There is a empty cell.'); return false;
			}

			return true;
		};
		ans.check1st = function(){ return this.checkAllCell(function(c){ return (bd.QuC(c)==0 && bd.QnC(c)==-1 && bd.QaC(c)==-1);});};

		ans.checkAroundPrenums = function(type){
			for(var c=0;c<bd.cellmax;c++){
				if(bd.QuC(c)==1 || bd.QnC(c)<=0){ continue;}

				var clist=[c], d={1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0};
				var cx=bd.cell[c].cx, cy=bd.cell[c].cy, cc;
				var func = function(cc){ return (cc!=-1 && bd.QuC(cc)==0 && bd.QnC(cc)==-1);}
				cc=bd.cnum(cx-1,cy-1); if(func(cc)){ if(bd.QaC(cc)>0){ d[bd.QaC(cc)]++; clist.push(cc);} }
				cc=bd.cnum(cx  ,cy-1); if(func(cc)){ if(bd.QaC(cc)>0){ d[bd.QaC(cc)]++; clist.push(cc);} }
				cc=bd.cnum(cx+1,cy-1); if(func(cc)){ if(bd.QaC(cc)>0){ d[bd.QaC(cc)]++; clist.push(cc);} }
				cc=bd.cnum(cx-1,cy  ); if(func(cc)){ if(bd.QaC(cc)>0){ d[bd.QaC(cc)]++; clist.push(cc);} }
				cc=bd.cnum(cx+1,cy  ); if(func(cc)){ if(bd.QaC(cc)>0){ d[bd.QaC(cc)]++; clist.push(cc);} }
				cc=bd.cnum(cx-1,cy+1); if(func(cc)){ if(bd.QaC(cc)>0){ d[bd.QaC(cc)]++; clist.push(cc);} }
				cc=bd.cnum(cx  ,cy+1); if(func(cc)){ if(bd.QaC(cc)>0){ d[bd.QaC(cc)]++; clist.push(cc);} }
				cc=bd.cnum(cx+1,cy+1); if(func(cc)){ if(bd.QaC(cc)>0){ d[bd.QaC(cc)]++; clist.push(cc);} }

				for(var n=1;n<=9;n++){
					if(d[n]>1){
						bd.sErC([c],1);
						for(i=0;i<clist.length;i++){ if(bd.QaC(clist[i])==n){ bd.sErC(clist[i],1);} }
						return false;
					}
				}
			}
			return true;
		};
		ans.checkNumber = function(type){
			for(var c=0;c<bd.cellmax;c++){
				if(bd.QuC(c)==1 || bd.QnC(c)<=0){ continue;}

				var cnt=0, clist=[c];
				var cx=bd.cell[c].cx, cy=bd.cell[c].cy, cc;
				var func = function(cc){ return (cc!=-1 && bd.QuC(cc)==0 && bd.QnC(cc)==-1);}
				cc=bd.cnum(cx-1,cy-1); if(func(cc)){ if(bd.QaC(cc)>0){ cnt+=bd.QaC(cc); clist.push(cc);}else{ continue;} }
				cc=bd.cnum(cx  ,cy-1); if(func(cc)){ if(bd.QaC(cc)>0){ cnt+=bd.QaC(cc); clist.push(cc);}else{ continue;} }
				cc=bd.cnum(cx+1,cy-1); if(func(cc)){ if(bd.QaC(cc)>0){ cnt+=bd.QaC(cc); clist.push(cc);}else{ continue;} }
				cc=bd.cnum(cx-1,cy  ); if(func(cc)){ if(bd.QaC(cc)>0){ cnt+=bd.QaC(cc); clist.push(cc);}else{ continue;} }
				cc=bd.cnum(cx+1,cy  ); if(func(cc)){ if(bd.QaC(cc)>0){ cnt+=bd.QaC(cc); clist.push(cc);}else{ continue;} }
				cc=bd.cnum(cx-1,cy+1); if(func(cc)){ if(bd.QaC(cc)>0){ cnt+=bd.QaC(cc); clist.push(cc);}else{ continue;} }
				cc=bd.cnum(cx  ,cy+1); if(func(cc)){ if(bd.QaC(cc)>0){ cnt+=bd.QaC(cc); clist.push(cc);}else{ continue;} }
				cc=bd.cnum(cx+1,cy+1); if(func(cc)){ if(bd.QaC(cc)>0){ cnt+=bd.QaC(cc); clist.push(cc);}else{ continue;} }

				if(bd.QnC(c)!=cnt){ bd.sErC(clist,1); return false;}
			}
			return true;
		};
		ans.checkAroundNumbers = function(){
			for(var c=0;c<bd.cellmax;c++){
				if(bd.QaC(c)<=0){ continue;}
				var cx = bd.cell[c].cx; var cy = bd.cell[c].cy; var target=0;
				var func = function(cc){ return (cc!=-1 && bd.QaC(c)==bd.QaC(cc));};
				target=bd.cnum(cx+1,cy  ); if(func(target)){ bd.sErC([c,target],1); return false;}
				target=bd.cnum(cx  ,cy+1); if(func(target)){ bd.sErC([c,target],1); return false;}
				target=bd.cnum(cx-1,cy+1); if(func(target)){ bd.sErC([c,target],1); return false;}
				target=bd.cnum(cx+1,cy+1); if(func(target)){ bd.sErC([c,target],1); return false;}
			}
			return true;
		};
	}
};
