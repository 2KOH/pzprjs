//
// �p�Y���ŗL�X�N���v�g�� �C�w���s�̖�� shugaku.js v3.3.0
//
Puzzles.shugaku = function(){ };
Puzzles.shugaku.prototype = {
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

		k.BlackCell     = 1;	// 1:���}�X����͂���p�Y��
		k.NumberIsWhite = 1;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

		k.ispzprv3ONLY  = 1;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
		k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

		k.area = { bcell:1, wcell:0, number:0};	// area�I�u�W�F�N�g�ŗ̈�𐶐�����

		base.setTitle("�C�w���s�̖�","School Trip");
		base.setExpression("�@�}�E�X�̍��{�^���h���b�O�ŕz�c���A�E�{�^���ŒʘH����͂ł��܂��B",
						   " Left Button Drag to input Futon, Right Click to input aisle.");
		base.setFloatbgcolor("rgb(32, 32, 32)");
	},
	menufix : function(){ },

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if(k.playmode){
				if(this.btn.Left) this.inputFuton();
				else if(this.btn.Right) this.inputcell_shugaku();
			}
			else if(k.editmode){
				if(!kp.enabled()){ this.inputqnum();}
				else{ kp.display();}
			}
		};
		mv.mouseup = function(){
			if(k.playmode){
				if(this.btn.Left) this.inputFuton2();
			}
		};
		mv.mousemove = function(){
			if(k.playmode){
				if(this.btn.Left) this.inputFuton();
				else if(this.btn.Right) this.inputcell_shugaku();
			}
		};
		mv.inputFuton = function(){
			var cc = this.cellid();

			if(this.firstPos.x==-1 && this.firstPos.y==-1){
				if(cc==-1 || bd.QnC(cc)!=-1){ return;}
				this.mouseCell = cc;
				this.inputData = 1;
				this.firstPos = this.inputPos.clone();
				pc.paintCell(cc);
			}
			else{
				var old = this.inputData;
				if(this.mouseCell==cc){ this.inputData = 1;}
				else{
					var mx=this.inputPos.x-this.firstPos.x, my=this.inputPos.y-this.firstPos.y;
					if     (cc==-1){ /* nop */ }
					else if(mx-my>0 && mx+my>0){ this.inputData = (bd.QnC(bd.rt(this.mouseCell))==-1?5:6);}
					else if(mx-my>0 && mx+my<0){ this.inputData = (bd.QnC(bd.up(this.mouseCell))==-1?2:6);}
					else if(mx-my<0 && mx+my>0){ this.inputData = (bd.QnC(bd.dn(this.mouseCell))==-1?3:6);}
					else if(mx-my<0 && mx+my<0){ this.inputData = (bd.QnC(bd.lt(this.mouseCell))==-1?4:6);}
				}
				if(old!=this.inputData){ pc.paintCellAround(this.mouseCell);}
			}
		};
		mv.inputFuton2 = function(){
			if(this.mouseCell==-1 || (this.firstPos.x==-1 && this.firstPos.y==-1)){ return;}
			var cc=this.mouseCell

			this.changeHalf(cc);
			if(this.inputData!=1 && this.inputData!=6){ bd.sQaC(cc, 10+this.inputData); bd.sQsC(cc, 0);}
			else if(this.inputData==6){ bd.sQaC(cc, 11); bd.sQsC(cc, 0);}
			else{
				if     (bd.QaC(cc)==11){ bd.sQaC(cc, 16); bd.sQsC(cc, 0);}
				else if(bd.QaC(cc)==16){ bd.sQaC(cc, -1); bd.sQsC(cc, 1);}
//				else if(bd.QsC(cc)== 1){ bd.sQaC(cc, -1); bd.sQsC(cc, 0);}
				else                   { bd.sQaC(cc, 11); bd.sQsC(cc, 0);}
			}

			cc = this.getTargetADJ();
			if(cc!=-1){
				this.changeHalf(cc);
				bd.sQaC(cc, {2:18,3:17,4:20,5:19}[this.inputData]); bd.sQsC(cc, 0);
			}

			cc = this.mouseCell;
			this.mouseCell = -1;
			pc.paintCellAround(cc);
		};

		mv.inputcell_shugaku = function(){
			var cc = this.cellid();
			if(cc==-1 || cc==this.mouseCell || bd.QnC(cc)!=-1){ return;}
			if(this.inputData==-1){
				if     (bd.QaC(cc)==1){ this.inputData = 2;}
				else if(bd.QsC(cc)==1){ this.inputData = 3;}
				else{ this.inputData = 1;}
			}
			this.changeHalf(cc);
			this.mouseCell = cc; 

			bd.sQaC(cc, (this.inputData==1?1:-1));
			bd.sQsC(cc, (this.inputData==2?1:0));

			pc.paintCellAround(cc);
		};

		mv.changeHalf = function(cc){
			var adj=-1;
			if     (bd.QaC(cc)==12 || bd.QaC(cc)==17){ adj=bd.up(cc);}
			else if(bd.QaC(cc)==13 || bd.QaC(cc)==18){ adj=bd.dn(cc);}
			else if(bd.QaC(cc)==14 || bd.QaC(cc)==19){ adj=bd.lt(cc);}
			else if(bd.QaC(cc)==15 || bd.QaC(cc)==20){ adj=bd.rt(cc);}

			if     (adj==-1){ /* nop */ }
			else if(bd.QaC(adj)>=12 && bd.QaC(adj)<=15){ bd.sQaC(adj,11);}
			else if(bd.QaC(adj)>=17 && bd.QaC(adj)<=20){ bd.sQaC(adj,16);}
		};
		mv.getTargetADJ = function(){
			if(this.mouseCell==-1){ return -1;}
			switch(this.inputData){
				case 2: return bd.up(this.mouseCell);
				case 3: return bd.dn(this.mouseCell);
				case 4: return bd.lt(this.mouseCell);
				case 5: return bd.rt(this.mouseCell);
			}
			return -1;
		};
		mv.enableInputHatena = true;

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.playmode){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca);
		};

		if(k.EDITOR){
			kp.generate(4, true, false, '');
			kp.kpinput = function(ca){
				kc.key_inputqnum(ca);
			};
		}

		bd.maxnum = 4;

		menu.ex.adjustSpecial = function(type,key){
			um.disableRecord();
			switch(type){
			case 1: // �㉺���]
				for(var cc=0;cc<bd.cellmax;cc++){
					var val = {12:13,13:12,17:18,18:17}[bd.QaC(cc)];
					if(!isNaN(val)){ bd.cell[cc].qans = val;}
				}
				break;
			case 2: // ���E���]
				for(var cc=0;cc<bd.cellmax;cc++){
					var val = {14:15,15:14,19:20,20:19}[bd.QaC(cc)];
					if(!isNaN(val)){ bd.cell[cc].qans = val;}
				}
				break;
			case 3: // �E90�����]
				for(var cc=0;cc<bd.cellmax;cc++){
					var val = {12:15,15:13,13:14,14:12,17:20,20:18,18:19,19:17}[bd.QaC(cc)];
					if(!isNaN(val)){ bd.cell[cc].qans = val;}
				}
				break;
			case 4: // ��90�����]
				for(var cc=0;cc<bd.cellmax;cc++){
					var val = {12:14,14:13,13:15,15:12,17:19,19:18,18:20,20:17}[bd.QaC(cc)];
					if(!isNaN(val)){ bd.cell[cc].qans = val;}
				}
				break;
			case 5: // �Ֆʊg��
				break;
			case 6: // �Ֆʏk��
				break;
			}
			um.enableRecord();
		}

		bd.sQaC = function(id, num){
			var old = this.cell[id].qans;
			um.addOpe(k.CELL, k.QANS, id, old, num);
			this.cell[id].qans = num;

			if(um.isenableInfo() && (num===1 ^ area.bcell.id[id]!==-1)){
				area.setCell(id,(num===1?1:0));
			}
		};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_LIGHT;
		pc.errbcolor1 = pc.errbcolor1_DARK;
		pc.bgcolor = "rgb(208, 208, 208)";
		pc.targetbgcolor = "rgb(255, 192, 192)";
		pc.circleratio = [0.44, 0.44];

		pc.paint = function(x1,y1,x2,y2){
			x1--; y1--; x2++; y2++;	// Undo���ɐՂ��c���Ă��܂���

			this.drawRDotCells(x1,y1,x2,y2);
			this.drawDashedGrid(x1,y1,x2,y2);
			this.drawBlackCells(x1,y1,x2,y2);

			this.drawFutons(x1,y1,x2,y2);
			this.drawFutonBorders(x1,y1,x2,y2);

			this.drawTargetFuton(x1,y1,x2,y2);

			this.drawCirclesAtNumber(x1,y1,x2,y2);
			this.drawNumbers(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawTarget(x1,y1,x2,y2);
		};

		pc.drawFutons = function(x1,y1,x2,y2){
			this.vinc('cell_back', 'crispEdges');

			var header = "c_full_";
			var clist = this.cellinside(x1,y1,x2,y2);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.cell[c].qans>=11){
					g.fillStyle = (bd.cell[c].error===1 ? this.errbcolor1 : "white");
					if(this.vnop(header+c,this.FILL)){
						g.fillRect(bd.cell[c].px+1, bd.cell[c].py+1, this.cw-1, this.ch-1);
					}
				}
				else{ this.vhide(header+c);}

				this.drawPillow1(c, (bd.cell[c].qans>=11 && bd.cell[c].qans<=15), false);
			}
		};
		pc.drawPillow1 = function(cc, flag, inputting){
			var mgnw = this.cw*0.15;
			var mgnh = this.ch*0.15;
			var header = "c_pillow_"+cc;

			if(flag){
				g.lineWidth = 1;
				g.strokeStyle = "black";
				if     (inputting)            { g.fillStyle = this.targetbgcolor;}
				else if(bd.cell[cc].error===1){ g.fillStyle = this.errbcolor1;   }
				else                          { g.fillStyle = "white";}

				if(this.vnop(header,this.FILL)){
					g.shapeRect(bd.cell[cc].px+mgnw+1, bd.cell[cc].py+mgnh+1, this.cw-mgnw*2-1, this.ch-mgnh*2-1);
				}
			}
			else{ this.vhide([header]);}
		};

		pc.drawFutonBorders = function(x1,y1,x2,y2){
			this.vinc('border_futon', 'crispEdges');

			var lw = this.lw, lm = this.lm;
			var doma1 = {11:1,12:1,14:1,15:1,16:1,17:1,19:1,20:1};
			var domb1 = {11:1,13:1,14:1,15:1,16:1,18:1,19:1,20:1};
			var doma2 = {11:1,12:1,13:1,14:1,16:1,17:1,18:1,19:1};
			var domb2 = {11:1,12:1,13:1,15:1,16:1,17:1,18:1,20:1};
			var header = "b_bd";
			g.fillStyle = "black";

			for(var by=Math.min(bd.minby+1,y1-2),maxy=Math.max(bd.maxby-1,y2+2);by<=maxy;by++){
				for(var bx=Math.min(bd.minbx+1,x1-2),maxx=Math.max(bd.maxbx-1,x2+2);bx<=maxx;bx++){
					if(!((bx+by)&1)){ continue;}
					var a = bd.QaC( bd.cnum(bx-(by&1), by-(bx&1)) );
					var b = bd.QaC( bd.cnum(bx+(by&1), by+(bx&1)) );
					var vid = [header,bx,by].join("_");

					if     ((bx&1) && !(isNaN(doma1[a])&&isNaN(domb1[b]))){
						if(this.vnop(vid,this.NONE)){
							g.fillRect(k.p0.x+(bx-1)*this.bw-lm, k.p0.x+by*this.bh-lm, this.cw+lw, lw);
						}
					}
					else if((by&1) && !(isNaN(doma2[a])&&isNaN(domb2[b]))){
						if(this.vnop(vid,this.NONE)){
							g.fillRect(k.p0.x+bx*this.bw-lm, k.p0.x+(by-1)*this.bh-lm, lw, this.ch+lw);
						}
					}
					else{ this.vhide(vid);}
				}
			}
		};

		pc.drawTargetFuton = function(x1,y1,x2,y2){
			this.vinc('cell_back', 'crispEdges');

			var cc=mv.mouseCell;
			var inputting = ((mv.firstPos.x!==-1 || mv.firstPos.y!==-1) && cc!==-1);

			// ���͒��ӂƂ�̔w�i�J���[�`��
			if(inputting){
				var header = "c_full_";
				g.fillStyle = this.targetbgcolor;

				if(cc!=-1){
					if(this.vnop(header+cc,this.FILL)){
						g.fillRect(bd.cell[cc].px+1, bd.cell[cc].py+1, this.cw-1, this.ch-1);
					}
				}
				else{ this.vhide(header+cc);}

				var adj=mv.getTargetADJ();
				if(adj!=-1){
					if(this.vnop(header+adj,this.FILL)){
						g.fillRect(bd.cell[adj].px+1, bd.cell[adj].py+1, this.cw-1, this.ch-1);
					}
				}
				else{ this.vhide(header+adj);}
			}

			// ���͒��ӂƂ�̂܂���`��
			if(inputting){
				this.drawPillow1(cc,true,true);
			}

			// ���͒��ӂƂ�̎���̋��E���`��
			this.vinc('border_futon', 'crispEdges');

			this.vdel(["tbd1_","tbd2_","tbd3_","tbd4_"]);
			if(inputting){
				var lw = this.lw, lm = this.lm;
				var bx1 = (adj===-1?bd.cell[cc].bx:Math.min(bd.cell[cc].bx,bd.cell[adj].bx));
				var by1 = (adj===-1?bd.cell[cc].by:Math.min(bd.cell[cc].by,bd.cell[adj].by));
				var px = k.p0.x+(bx1-1)*this.bw, py = k.p0.y+(by1-1)*this.bh;
				var wid = (mv.inputData===4||mv.inputData===5?2:1)*this.cw;
				var hgt = (mv.inputData===2||mv.inputData===3?2:1)*this.ch;

				g.fillStyle = "black";
				if(this.vnop("tbd1_",this.NONE)){ g.fillRect(px-lm    , py-lm    , wid+lw, lw);}
				if(this.vnop("tbd2_",this.NONE)){ g.fillRect(px-lm    , py-lm    , lw, hgt+lw);}
				if(this.vnop("tbd3_",this.NONE)){ g.fillRect(px+wid-lm, py-lm    , lw, hgt+lw);}
				if(this.vnop("tbd4_",this.NONE)){ g.fillRect(px-lm    , py+hgt-lm, wid+lw, lw);}
			}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type){
			this.decodeShugaku();
		};
		enc.pzlexport = function(type){
			this.encodeShugaku();
		};

		enc.decodeShugaku = function(){
			var c=0, bstr = this.outbstr;
			for(var i=0;i<bstr.length;i++){
				var ca = bstr.charAt(i);
				if     (ca>='0' && ca<='4'){ bd.sQnC(c, parseInt(ca,36)); c++;}
				else if(ca=='5')           { bd.sQnC(c, -2);              c++;}
				else{ c += (parseInt(ca,36)-5);}
				if(c>=bd.cellmax){ break;}
			}
			this.outbstr = bstr.substr(i);
		};
		enc.encodeShugaku = function(){
			var cm="", count=0;
			for(var i=0;i<bd.cellmax;i++){
				var pstr = "";
				var val = bd.QnC(i);

				if     (val==-2){ pstr = "5";}
				else if(val!=-1){ pstr = val.toString(36);}
				else{ count++;}

				if(count==0){ cm += pstr;}
				else if(pstr || count==30){ cm+=((5+count).toString(36)+pstr); count=0;}
			}
			if(count>0){ cm+=(5+count).toString(36);}
			this.outbstr += cm;
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			this.decodeCell( function(c,ca){
				if(ca == "5")     { bd.sQnC(c, -2);}
				else if(ca == "#"){ bd.sQaC(c, 1);}
				else if(ca == "-"){ bd.sQsC(c, 1);}
				else if(ca>="a" && ca<="j"){ bd.sQaC(c, parseInt(ca,20)+1);}
				else if(ca != "."){ bd.sQnC(c, parseInt(ca));}
			});
		};
		fio.encodeData = function(){
			this.encodeCell( function(c){
				if     (bd.QnC(c)>=0) { return (bd.QnC(c).toString() + " ");}
				else if(bd.QnC(c)==-2){ return "5 ";}
				else if(bd.QaC(c)==1) { return "# ";}
				else if(bd.QaC(c)>=0) { return ((bd.QaC(c)-1).toString(20) + " ");}
				else if(bd.QsC(c)==1) { return "- ";}
				else                  { return ". ";}
			});
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkKitamakura() ){
				this.setAlert('�k���ɂȂ��Ă���z�c������܂��B', 'There is a \'Kita-makura\' futon.'); return false;
			}

			if( !this.check2x2Block( bd.isBlack ) ){
				this.setAlert('2x2�̍��}�X�̂����܂肪����܂��B', 'There is a 2x2 block of black cells.'); return false;
			}

			if( !this.checkAllCell(ee.binder(this, function(c){ return (bd.QnC(c)>=0 && bd.QnC(c)<this.checkdir4Cell(c,function(a){ return (bd.QaC(a)>=11&&bd.QaC(a)<=15);}));})) ){
				this.setAlert('���̂܂��ɂ��閍�̐����Ԉ���Ă��܂��B', 'The number of pillows around the number is wrong.'); return false;
			}

			if( !this.checkAllCell(function(c){ return (bd.QaC(c)==11||bd.QaC(c)==16);}) ){
				this.setAlert('�z�c��2�}�X�ɂȂ��Ă��܂���B', 'There is a half-size futon.'); return false;
			}

			if( !this.checkFutonAisle() ){
				this.setAlert('�ʘH�ɐڂ��Ă��Ȃ��z�c������܂��B', 'There is a futon separated to aisle.'); return false;
			}

			if( !this.checkOneArea( area.getBCellInfo() ) ){
				this.setAlert('���}�X�����f����Ă��܂��B', 'Aisle is divided.'); return false;
			}

			if( !this.checkAllCell(ee.binder(this, function(c){ return (bd.QnC(c)>=0 && bd.QnC(c)>this.checkdir4Cell(c,function(a){ return (bd.QaC(a)>=11&&bd.QaC(a)<=15);}));})) ){
				this.setAlert('���̂܂��ɂ��閍�̐����Ԉ���Ă��܂��B', 'The number of pillows around the number is wrong.'); return false;
			}

			if( !this.checkAllCell(function(c){ return (bd.QnC(c)==-1 && bd.QaC(c)==-1);}) ){
				this.setAlert('�z�c�ł����}�X�ł��Ȃ��}�X������܂��B', 'There is an empty cell.'); return false;
			}

			return true;
		};

		ans.checkKitamakura = function(){
			var result = true;
			for(var c=0;c<bd.cellmax;c++){
				if(bd.QaC(c)==13){
					if(this.inAutoCheck){ return false;}
					bd.sErC([c,bd.dn(c)],1);
					result = false;
				}
			}
			return result;
		};

		ans.checkFutonAisle = function(){
			var result = true;
			for(var c=0;c<bd.cellmax;c++){
				if(bd.QnC(c)==-1 && bd.QaC(c)>=12 && bd.QaC(c)<=15){
					var adj=-1;
					switch(bd.QaC(c)){
						case 12: adj = bd.up(c); break;
						case 13: adj = bd.dn(c); break;
						case 14: adj = bd.lt(c); break;
						case 15: adj = bd.rt(c); break;
					}
					if( this.checkdir4Cell(c  ,function(a){ return (bd.QaC(a)==1)})==0 &&
						this.checkdir4Cell(adj,function(a){ return (bd.QaC(a)==1)})==0 )
					{
						if(this.inAutoCheck){ return false;}
						bd.sErC([c,adj],1);
						result = false;
					}
				}
			}
			return result;
		};
	}
};
