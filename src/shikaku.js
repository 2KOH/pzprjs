//
// �p�Y���ŗL�X�N���v�g�� �l�p�ɐ؂�� shikaku.js v3.2.3
//
Puzzles.shikaku = function(){ };
Puzzles.shikaku.prototype = {
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
		k.isKanpenExist = 1;	// 1:pencilbox/�J���y���ɂ���p�Y��

		k.fstruct = ["cellqnum","borderans"];

		//k.def_csize = 36;
		//k.def_psize = 24;
		//k.area = { bcell:0, wcell:0, number:0};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		base.setTitle("�l�p�ɐ؂�","Shikaku");
		base.setExpression("�@���h���b�O�ŋ��E�����A�E�h���b�O�ŕ⏕�L�������͂ł��܂��B",
						   " Left Button Drag to input border lines, Right to input auxiliary marks.");
		base.setFloatbgcolor("rgb(127, 191, 0)");
	},
	menufix : function(){ },

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if(k.editmode){
				if(!kp.enabled()){ this.inputqnum();}
				else{ kp.display();}
			}
			else if(k.playmode){
				if(this.btn.Left) this.inputborderans();
				else if(this.btn.Right) this.inputQsubLine();
			}
		};
		mv.mouseup = function(){ };
		mv.mousemove = function(){
			if(k.playmode){
				if(this.btn.Left) this.inputborderans();
				else if(this.btn.Right) this.inputQsubLine();
			}
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.playmode){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca);
		};

		if(k.EDITOR){
			kp.generate(0, true, false, '');
			kp.kpinput = function(ca){
				kc.key_inputqnum(ca);
			};
		}
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_DLIGHT;
		pc.fontcolor = pc.fontErrcolor = "white";

		pc.fontsizeratio = 0.85;

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawErrorCells(x1,y1,x2,y2);

			this.drawDashedGrid(x1,y1,x2,y2);
			this.drawBorders(x1,y1,x2,y2);

			this.drawNumCells_shikaku(x1,y1,x2,y2);
			this.drawBorderQsubs(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawTarget(x1,y1,x2,y2);
		};

		pc.drawNumCells_shikaku = function(x1,y1,x2,y2){
			var rsize  = k.cwidth*0.40;
			var rsize2 = k.cwidth*0.36;

			var clist = this.cellinside(x1,y1,x2,y2,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.QnC(c)!=-1){
					var px=bd.cell[c].px+mf(k.cwidth/2), py=bd.cell[c].py+mf(k.cheight/2);

					if(bd.ErC(c)==1){ g.fillStyle = this.errcolor1;}
					else{ g.fillStyle = this.Cellcolor;}
					g.beginPath();
					g.arc(px, py, rsize , 0, Math.PI*2, false);
					if(this.vnop("c"+c+"_cir_",1)){ g.fill(); }
				}
				else{ this.vhide("c"+c+"_cir_");}

				this.dispnumCell_General(c);
			}
			this.vinc();
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==0 || type==1){ bstr = this.decodeNumber16(bstr);}
			else if(type==2)      { bstr = this.decodeKanpen(bstr); }
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
			else if(type==2){ document.urloutput.ta.value = this.kanpenbase()+"shikaku.html?problem="+this.pzldataKanpen();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			return "/"+k.qcols+"/"+k.qrows+"/"+this.encodeNumber16();
		};

		enc.decodeKanpen = function(bstr){
			bstr = (bstr.split("_")).join(" ");
			fio.decodeCell( function(c,ca){
				if(ca != "."){ bd.sQnC(c, parseInt(ca));}
			},bstr.split("/"));
			return "";
		};
		enc.pzldataKanpen = function(){
			return ""+k.qrows+"/"+k.qcols+"/"+fio.encodeCell( function(c){
				return (bd.QnC(c)>=0)?(bd.QnC(c).toString() + "_"):"._";
			});
		};

		//---------------------------------------------------------
		fio.kanpenOpen = function(array){
			this.decodeCell( function(c,ca){
				if(ca != "."){ bd.sQnC(c, parseInt(ca));}
			},array.slice(0,k.qrows));

			var rmax = parseInt(array[k.qrows]);
			var barray = array.slice(k.qrows+1,k.qrows+1+rmax);
			this.decodeRectArea(barray);
		};
		fio.decodeRectArea = function(barray){
			var rdata = [];
			for(var i=0;i<barray.length;i++){
				if(barray[i]==""){ break;}
				var pce = barray[i].split(" ");
				var sp = { y1:parseInt(pce[0]), x1:parseInt(pce[1]), y2:parseInt(pce[2]), x2:parseInt(pce[3])};
				for(var cx=sp.x1;cx<=sp.x2;cx++){
					for(var cy=sp.y1;cy<=sp.y2;cy++){
						rdata[bd.cnum(cx,cy)] = i+1;
					}
				}
			}
			for(var id=0;id<bd.bdmax;id++){
				var cc1=bd.cc1(id), cc2=bd.cc2(id);
				if(cc1!=-1 && cc2!=-1 && rdata[cc1]!=rdata[cc2]){ bd.sQaB(id,1);}
			}
		};

		fio.kanpenSave = function(){
			return ""+this.encodeCell( function(c){
				return (bd.QnC(c)>0)?(bd.QnC(c).toString() + " "):". ";
			})+this.encodeRectArea();
		};
		fio.encodeRectArea = function(){
			var bstr = "", rectcount = 0;
			var rinfo = area.getRoomInfo();
			for(var id=1;id<=rinfo.max;id++){
				var d = ans.getSizeOfClist(rinfo.room[id].idlist,f_true);
				if((d.x2-d.x1+1)*(d.y2-d.y1+1)==d.cnt){
					bstr += (""+d.y1+" "+d.x1+" "+d.y2+" "+d.x2+"/");
					rectcount++;
				}
			}
			return ""+rectcount+"/"+bstr;
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			var rinfo = area.getRoomInfo();
			if( !this.checkQnumsInArea(rinfo, function(a){ return (a==0);}) ){
				this.setAlert('�����̓����Ă��Ȃ��̈悪����܂��B','An area has no numbers.'); return false;
			}

			if( !this.checkQnumsInArea(rinfo, function(a){ return (a>=2);}) ){
				this.setAlert('1�̗̈��2�ȏ�̐����������Ă��܂��B','An area has plural numbers.'); return false;
			}

			if( !this.checkAllArea(rinfo, f_true, function(w,h,a){ return (w*h==a);} ) ){
				this.setAlert('�l�p�`�ł͂Ȃ��̈悪����܂��B','An area is not rectangle.'); return false;
			}

			if( !this.checkNumberAndSize(rinfo) ){
				this.setAlert('�����Ɨ̈�̑傫�����Ⴂ�܂��B','The size of the area is not equal to the number.'); return false;
			}

			if( !this.checkLcntCross(1,0) ){
				this.setAlert('�r�؂�Ă����������܂��B','There is a dead-end line.'); return false;
			}

			return true;
		};
	}
};
