//
// �p�Y���ŗL�X�N���v�g�� �A�C�X�o�[���� icebarn.js v3.3.0
//
Puzzles.icebarn = function(){ };
Puzzles.icebarn.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 8;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 8;}	// �Ֆʂ̏c��
		k.irowake  = 1;		// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross  = 0;		// 1:�Ֆʓ�����Cross������p�Y�� 2:�O�g����܂߂�Cross������p�Y��
		k.isborder = 2;		// 1:Border/Line������\�ȃp�Y�� 2:�O�g�������\�ȃp�Y��
		k.isexcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isLineCross     = true;	// ������������p�Y��
		k.isCenterLine    = true;	// �}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = false;	// ���E����line�Ƃ��Ĉ���
		k.hasroom         = false;	// �������̗̈�ɕ�����Ă���/������p�Y��
		k.roomNumber      = false;	// �����̖��̐�����1��������p�Y��

		k.dispzero        = false;	// 0��\�����邩�ǂ���
		k.isDispHatena    = true;	// qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber     = false;	// �񓚂ɐ�������͂���p�Y��
		k.NumberWithMB    = false;	// �񓚂̐����Ɓ��~������p�Y��
		k.linkNumber      = false;	// �������ЂƂȂ���ɂȂ�p�Y��

		k.BlackCell       = false;	// ���}�X����͂���p�Y��
		k.NumberIsWhite   = false;	// �����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell     = false;	// �A�����f�ւ̃p�Y��
		k.checkBlackCell  = false;	// ��������ō��}�X�̏����`�F�b�N����p�Y��
		k.checkWhiteCell  = false;	// ��������Ŕ��}�X�̏����`�F�b�N����p�Y��

		k.ispzprv3ONLY    = false;	// �ς��Ղ�A�v���b�g�ɂ͑��݂��Ȃ��p�Y��
		k.isKanpenExist   = false;	// pencilbox/�J���y���ɂ���p�Y��

		k.bdmargin = 1.0;				// �g�O�̈�ӂ�margin(�Z�������Z)
		k.reduceImageMargin = false;	// �摜�o�͎���margin������������

		if(k.EDITOR){
			base.setExpression("�@���h���b�O�Ŗ�󂪁A�E�N���b�N�ŕX�����͂ł��܂��B",
							   " Left Button Drag to input arrows, Right Click to input ice.");
		}
		else{
			base.setExpression("�@���h���b�O�Ő����A�E�N���b�N�Ł~�����͂ł��܂��B",
							   " Left Button Drag to input black cells, Right Click to input a cross.");
		}
		base.setTitle("�A�C�X�o�[��","Icebarn");
		base.setFloatbgcolor("rgb(0, 0, 127)");
	},
	menufix : function(){
		menu.addRedLineToFlags();
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if(kc.isZ ^ pp.getVal('dispred')){ this.dispRedLine(); return;}
			if(k.editmode){
				if(this.btn.Left) this.inputarrow();
				else if(this.btn.Right) this.inputIcebarn();
			}
			else if(k.playmode){
				if(this.btn.Left) this.inputLine();
				else if(this.btn.Right) this.inputpeke();
			}
		};
		mv.mouseup = function(){ };
		mv.mousemove = function(){
			if(k.editmode){
				if(this.btn.Left) this.inputarrow();
				else if(this.btn.Right) this.inputIcebarn();
			}
			else if(k.playmode){
				if(this.btn.Left) this.inputLine();
				else if(this.btn.Right) this.inputpeke();
			}
		};
		mv.inputIcebarn = function(){
			var cc = this.cellid();
			if(cc==-1 || cc==this.mouseCell){ return;}
			if(this.inputData==-1){ this.inputData = (bd.QuC(cc)==6?0:6);}

			bd.sQuC(cc, this.inputData);
			pc.paintCellAround(cc);
			this.mouseCell = cc;
		};
		mv.inputarrow = function(){
			var pos = this.borderpos(0);
			if(pos.x==this.mouseCell.x && pos.y==this.mouseCell.y){ return;}

			var id = -1;
			if     (pos.y-this.mouseCell.y==-2){ id=bd.bnum(this.mouseCell.x  ,this.mouseCell.y-1); if(this.inputData!=0){ this.inputData=1;} }
			else if(pos.y-this.mouseCell.y== 2){ id=bd.bnum(this.mouseCell.x  ,this.mouseCell.y+1); if(this.inputData!=0){ this.inputData=2;} }
			else if(pos.x-this.mouseCell.x==-2){ id=bd.bnum(this.mouseCell.x-1,this.mouseCell.y  ); if(this.inputData!=0){ this.inputData=1;} }
			else if(pos.x-this.mouseCell.x== 2){ id=bd.bnum(this.mouseCell.x+1,this.mouseCell.y  ); if(this.inputData!=0){ this.inputData=2;} }

			this.mouseCell = pos;

			if(id==-1){ return;}
			else if(id<bd.bdinside){
				if(this.inputData==bd.getArrow(id)){ this.inputData=0;}
				bd.setArrow(id,this.inputData);
			}
			else{
				if(bd.border[id].bx===0 || bd.border[id].by===0){
					if     (this.inputData==1){ bd.inputarrowout(id);}
					else if(this.inputData==2){ bd.inputarrowin (id);}
				}
				else{
					if     (this.inputData==1){ bd.inputarrowin (id);}
					else if(this.inputData==2){ bd.inputarrowout(id);}
				}
			}
			pc.paintBorder(id);
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){ if(ca=='z' && !this.keyPressed){ this.isZ=true;}};
		kc.keyup = function(ca){ if(ca=='z'){ this.isZ=false;}};
		kc.isZ = false;

		if(!bd.arrowin) { bd.arrowin  = -1;}
		if(!bd.arrowout){ bd.arrowout = -1;}
		bd.inputarrowin = function(id){
			var dir=((this.border[id].bx===0||this.border[id].by===0)?1:2);
			this.setArrow(this.arrowin,0);
			pc.paintBorder(this.arrowin);
			if(this.arrowout==id){
				this.arrowout = this.arrowin;
				this.setArrow(this.arrowout, ((dir+1)%2)+1);
				pc.paintBorder(this.arrowout);
			}
			this.arrowin = id;
			this.setArrow(this.arrowin, (dir%2)+1);
		};
		bd.inputarrowout = function(id){
			var dir=((this.border[id].bx===0||this.border[id].by===0)?1:2);
			this.setArrow(this.arrowout,0);
			pc.paintBorder(this.arrowout);
			if(this.arrowin==id){
				this.arrowin = this.arrowout;
				this.setArrow(this.arrowin, (dir%2)+1);
				pc.paintBorder(this.arrowin);
			}
			this.arrowout = id;
			this.setArrow(this.arrowout, ((dir+1)%2)+1);
		};
		bd.getArrow = function(id){ return this.QuB(id); };
		bd.setArrow = function(id,val){ if(id!==-1){ this.sQuB(id,val);}};
		bd.isArrow  = function(id){ return (this.QuB(id)>0);};

		bd.initSpecial = function(col,row){
			this.bdinside = 2*col*row-(col+row);
			if(this.arrowin==-1 && this.arrowout==-1){
				this.inputarrowin (0 + this.bdinside, 1);
				this.inputarrowout(2 + this.bdinside, 1);
			}

			if(!base.initProcess){
				if(this.arrowin<k.qcols+this.bdinside){ if(this.arrowin>col+this.bdinside){ this.arrowin=col+this.bdinside-1;} }
				else{ if(this.arrowin>col+row+this.bdinside){ this.arrowin=col+row+this.bdinside-1;} }

				if(this.arrowout<k.qcols+this.bdinside){ if(this.arrowout>col+this.bdinside){ this.arrowout=col+this.bdinside-1;} }
				else{ if(this.arrowout>col+row+this.bdinside){ this.arrowout=col+row+this.bdinside-1;} }

				if(this.arrowin==this.arrowout){ this.arrowin--;}
			}
		}

		menu.ex.adjustSpecial = function(type,key){
			var d = {xx:(bd.minbx+bd.minbx), yy:(bd.minby+bd.minby)};

			um.disableRecord();
			var ibx=bd.border[bd.arrowin ].bx, iby=bd.border[bd.arrowin ].by;
			var obx=bd.border[bd.arrowout].bx, oby=bd.border[bd.arrowout].by;
			switch(type){
			case 1: // �㉺���]
				bd.arrowin  = bd.bnum(ibx,d.yy-iby);
				bd.arrowout = bd.bnum(obx,d.yy-oby);
				for(var id=0;id<bd.bdmax;id++){
					if((bd.border[id].bx&1)&&bd.isArrow(id)){ bd.border[id].ques={1:2,2:1}[bd.getArrow(id)]; }
				}
				break;
			case 2: // ���E���]
				bd.arrowin  = bd.bnum(d.xx-ibx,iby);
				bd.arrowout = bd.bnum(d.xx-obx,oby);
				for(var id=0;id<bd.bdmax;id++){
					if((bd.border[id].by&1)&&bd.isArrow(id)){ bd.border[id].ques={1:2,2:1}[bd.getArrow(id)]; }
				}
				break;
			case 3: // �E90�����]
				bd.arrowin  = bd.bnum2(d.yy-iby,ibx,k.qrows,k.qcols);
				bd.arrowout = bd.bnum2(d.yy-oby,obx,k.qrows,k.qcols);
				for(var id=0;id<bd.bdmax;id++){
					if((bd.border[id].bx&1)&&bd.isArrow(id)){ bd.border[id].ques={1:2,2:1}[bd.getArrow(id)]; }
				}
				break;
			case 4: // ��90�����]
				bd.arrowin  = bd.bnum2(iby,d.xx-ibx,k.qrows,k.qcols);
				bd.arrowout = bd.bnum2(oby,d.xx-obx,k.qrows,k.qcols);
				for(var id=0;id<bd.bdmax;id++){
					if((bd.border[id].by&1)&&bd.isArrow(id)){ bd.border[id].ques={1:2,2:1}[bd.getArrow(id)]; }
				}
				break;
			case 5: // �Ֆʊg��
				bd.arrowin  += (key==k.UP||key==k.DN?2*k.qcols-1:2*k.qrows-1);
				bd.arrowout += (key==k.UP||key==k.DN?2*k.qcols-1:2*k.qrows-1);
				break;
			case 6: // �Ֆʏk��
				bd.arrowin  -= (key==k.UP||key==k.DN?2*k.qcols-1:2*k.qrows-1);
				bd.arrowout -= (key==k.UP||key==k.DN?2*k.qcols-1:2*k.qrows-1);
				break;
			}

			um.enableRecord();
		};
		menu.ex.expandborder = function(key){ };
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_LIGHT;
		pc.linecolor = pc.linecolor_LIGHT;
		pc.errcolor1 = "red";
		pc.setBGCellColorFunc('icebarn');
		pc.setBorderColorFunc('ice');

		pc.maxYdeg = 0.70;

		pc.paint = function(x1,y1,x2,y2){
			this.drawBGCells(x1,y1,x2,y2);
			this.drawDashedGrid(x1,y1,x2,y2);

			this.drawBorders(x1,y1,x2,y2);

			this.drawLines(x1,y1,x2,y2);
			this.drawPekes(x1,y1,x2,y2,1);

			this.drawArrows(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawInOut();
		};

		pc.drawArrows = function(x1,y1,x2,y2){
			this.vinc('border_arrow', 'crispEdges');

			var idlist = this.borderinside(x1-1,y1-1,x2+2,y2+2);
			for(var i=0;i<idlist.length;i++){ this.drawArrow1(idlist[i], bd.isArrow(idlist[i]));}
		};
		pc.drawArrow1 = function(id, flag){
			var vids = ["b_ar_"+id,"b_dt1_"+id,"b_dt2_"+id];
			if(!flag){ this.vhide(vids); return;}

			var ll = this.cw*0.35;				//LineLength
			var lw = Math.max(this.cw/36, 1);	//LineWidth
			var lm = lw/2;					//LineMargin
			var px=bd.border[id].px; var py=bd.border[id].py;

			g.fillStyle = (bd.border[id].error===3 ? this.errcolor1 : this.Cellcolor);
			if(this.vnop(vids[0],this.FILL)){
				var mr = Math.round;
				if(bd.border[id].bx&1){ g.fillRect(px-lm, py-ll, lw, ll*2);}
				if(bd.border[id].by&1){ g.fillRect(px-ll, py-lm, ll*2, lw);}
			}

			if(bd.getArrow(id)===1){
				if(this.vnop(vids[1],this.FILL)){
					if(bd.border[id].bx&1){ g.setOffsetLinePath(px,py ,0,-ll ,-ll/2,-ll*0.4 ,ll/2,-ll*0.4, true);}
					if(bd.border[id].by&1){ g.setOffsetLinePath(px,py ,-ll,0 ,-ll*0.4,-ll/2 ,-ll*0.4,ll/2, true);}
					g.fill();
				}
			}
			else{ this.vhide(vids[1]);}
			if(bd.getArrow(id)===2){
				if(this.vnop(vids[2],this.FILL)){
					if(bd.border[id].bx&1){ g.setOffsetLinePath(px,py ,0,+ll ,-ll/2, ll*0.4 ,ll/2, ll*0.4, true);}
					if(bd.border[id].by&1){ g.setOffsetLinePath(px,py , ll,0 , ll*0.4,-ll/2 , ll*0.4,ll/2, true);}
					g.fill();
				}
			}
			else{ this.vhide(vids[2]);}
		};
		pc.drawInOut = function(){
			if(bd.arrowin<bd.bdinside || bd.arrowin>=bd.bdmax || bd.arrowout<bd.bdinside || bd.arrowout>=bd.bdmax){ return;}

			g.fillStyle = (bd.border[bd.arrowin].error===3 ? this.errcolor1 : this.Cellcolor);
			var bx = bd.border[bd.arrowin].bx, by = bd.border[bd.arrowin].by;
			var px = bd.border[bd.arrowin].px, py = bd.border[bd.arrowin].py;
			if     (by===bd.minby){ this.dispnum("string_in", 1, "IN", 0.55, "black", px,             py-0.6*this.ch);}
			else if(by===bd.maxby){ this.dispnum("string_in", 1, "IN", 0.55, "black", px,             py+0.6*this.ch);}
			else if(bx===bd.minbx){ this.dispnum("string_in", 1, "IN", 0.55, "black", px-0.5*this.cw, py-0.3*this.ch);}
			else if(bx===bd.maxbx){ this.dispnum("string_in", 1, "IN", 0.55, "black", px+0.5*this.cw, py-0.3*this.ch);}

			g.fillStyle = (bd.border[bd.arrowout].error===3 ? this.errcolor1 : this.Cellcolor);
			var bx = bd.border[bd.arrowout].bx, by = bd.border[bd.arrowout].by;
			var px = bd.border[bd.arrowout].px, py = bd.border[bd.arrowout].py;
			if     (by===bd.minby){ this.dispnum("string_out", 1, "OUT", 0.55, "black", px,             py-0.6*this.ch);}
			else if(by===bd.maxby){ this.dispnum("string_out", 1, "OUT", 0.55, "black", px,             py+0.6*this.ch);}
			else if(bx===bd.minbx){ this.dispnum("string_out", 1, "OUT", 0.55, "black", px-0.7*this.cw, py-0.3*this.ch);}
			else if(bx===bd.maxbx){ this.dispnum("string_out", 1, "OUT", 0.55, "black", px+0.7*this.cw, py-0.3*this.ch);}
		};

		line.repaintParts = function(idlist){
			for(var i=0;i<idlist.length;i++){
				if(bd.isArrow(idlist[i])){
					pc.drawArrow1(idlist[i],true);
				}
			}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type){
			if(type==0){ bstr = this.decodeIcebarn();}
			else if(type==1){
				if(this.checkpflag("c")){ bstr = this.decodeIcebarn_old2();}
				else{ bstr = this.decodeIcebarn_old1();}
			}
		};
		enc.pzlexport = function(type){
			if     (type==0){ return this.encodeIcebarn();}
			else if(type==1){ return this.encodeIcebarn_old1();}
		};

		enc.decodeIcebarn = function(){
			var barray = this.outbstr.split("/");

			var a=0;
			for(var i=0;i<barray[0].length;i++){
				var num = parseInt(barray[0].charAt(i),32);
				for(var w=0;w<5;w++){ if((i*5+w)<bd.cellmax){ bd.sQuC(i*5+w,(num&Math.pow(2,4-w)?6:0));} }
				if((i*5+5)>=k.qcols*k.qrows){ a=i+1; break;}
			}

			var id=0;
			for(var i=a;i<barray[0].length;i++){
				var ca = barray[0].charAt(i);
				if(ca=='z'){ id+=35;}else{ id += parseInt(ca,36); if(id<bd.bdinside){ bd.setArrow(id,1);} id++;}
				if(id>=bd.bdinside){ a=i+1; break;}
			}

			id=0;
			for(var i=a;i<barray[0].length;i++){
				var ca = barray[0].charAt(i);
				if(ca=='z'){ id+=35;}else{ id += parseInt(ca,36); if(id<bd.bdinside){ bd.setArrow(id,2);} id++;}
				if(id>=bd.bdinside){ break;}
			}

			bd.setArrow(bd.arrowin,0); bd.setArrow(bd.arrowout,0);
			bd.arrowin = bd.arrowout = -1;
			bd.inputarrowin (parseInt(barray[1])+bd.bdinside);
			bd.inputarrowout(parseInt(barray[2])+bd.bdinside);

			this.outbstr = "";
		};
		enc.encodeIcebarn = function(){
			var cm = "";
			var num=0, pass=0;
			for(i=0;i<bd.cellmax;i++){
				if(bd.QuC(i)==6){ pass+=Math.pow(2,4-num);}
				num++; if(num==5){ cm += pass.toString(32); num=0; pass=0;}
			}
			if(num>0){ cm += pass.toString(32);}

			num=0;
			for(var id=0;id<bd.bdinside;id++){
				if(bd.getArrow(id)==1){ cm+=num.toString(36); num=0;}else{ num++;} if(num>=35){ cm+="z"; num=0;}
			}
			if(num>0){ cm+=num.toString(36);}

			num=0;
			for(var id=0;id<bd.bdinside;id++){
				if(bd.getArrow(id)==2){ cm+=num.toString(36); num=0;}else{ num++;} if(num>=35){ cm+="z"; num=0;}
			}
			if(num>0){ cm+=num.toString(36);}

			cm += ("/"+(bd.arrowin-bd.bdinside)+"/"+(bd.arrowout-bd.bdinside));

			this.outbstr += cm;
		};

		enc.decodeIcebarn_old2 = function(){
			var barray = this.outbstr.split("/");

			var a;
			for(var i=0;i<barray[2].length;i++){
				var num = parseInt(barray[2].charAt(i),32);
				for(var w=0;w<5;w++){ if((i*5+w)<k.qcols*k.qrows){ bd.sQuC(i*5+w,(num&Math.pow(2,4-w)?6:0));} }
				if((i*5+5)>=k.qcols*k.qrows){ a=i+1; break;}
			}
			var id=0;
			for(var i=a;i<barray[2].length;i++){
				var ca = barray[2].charAt(i);
				if     (ca>='0' && ca<='9'){ var num=parseInt(ca); bd.setArrow(id, num%2+1); id+=(mf(num/2)+1);}
				else if(ca>='a' && ca<='z'){ var num=parseInt(ca,36); id+=(num-9);}
				else{ id++;}
				if(id>=(k.qcols-1)*k.qrows){ a=i+1; break;}
			}
			id=(k.qcols-1)*k.qrows;
			for(var i=a;i<barray[2].length;i++){
				var ca = barray[2].charAt(i);
				if     (ca>='0' && ca<='9'){ var num=parseInt(ca); bd.setArrow(id, num%2+1); id+=(mf(num/2)+1);}
				else if(ca>='a' && ca<='z'){ var num=parseInt(ca,36); id+=(num-9);}
				else{ id++;}
				if(id>=bd.bdinside){ break;}
			}

			bd.setArrow(bd.arrowin,0); bd.setArrow(bd.arrowout,0);
			bd.arrowin = bd.arrowout = -1;
			bd.inputarrowin (parseInt(barray[0])+bd.bdinside);
			bd.inputarrowout(parseInt(barray[1])+bd.bdinside);

			this.outbstr = "";
		};
		enc.decodeIcebarn_old1 = function(){
			var barray = this.outbstr.split("/");

			var c=0;
			for(var i=0;i<barray[0].length;i++){
				var ca = parseInt(barray[0].charAt(i),16);
				for(var w=0;w<4;w++){ if((i*4+w)<bd.cellmax){ bd.sQuC(i*4+w,(ca&Math.pow(2,3-w)?6:0));} }
				if((i*4+4)>=k.qcols*k.qrows){ break;}
			}

			if(barray[1]!=""){
				var array = barray[1].split("+");
				for(var i=0;i<array.length;i++){ bd.setArrow(bd.db(array[i]),1);}
			}
			if(barray[2]!=""){
				var array = barray[2].split("+");
				for(var i=0;i<array.length;i++){ bd.setArrow(bd.db(array[i]),2);}
			}
			if(barray[3]!=""){
				var array = barray[3].split("+");
				for(var i=0;i<array.length;i++){ bd.setArrow(bd.rb(array[i]),1);}
			}
			if(barray[4]!=""){
				var array = barray[4].split("+");
				for(var i=0;i<array.length;i++){ bd.setArrow(bd.rb(array[i]),2);}
			}

			bd.setArrow(bd.arrowin,0); bd.setArrow(bd.arrowout,0);
			bd.arrowin = bd.arrowout = -1;
			bd.inputarrowin (parseInt(barray[5])+bd.bdinside);
			bd.inputarrowout(parseInt(barray[6])+bd.bdinside);

			this.outbstr = "";
		};
		enc.encodeIcebarn_old1 = function(){
			var cm = "";
			var num=0, pass=0;
			for(i=0;i<bd.cellmax;i++){
				if(bd.QuC(i)==6){ pass+=Math.pow(2,3-num);}
				num++; if(num==4){ cm += pass.toString(16); num=0; pass=0;}
			}
			if(num>0){ cm += pass.toString(16);}
			cm += "/";

			var array = [];
			for(var c=0;c<bd.cellmax;c++){ if(bd.cell[c].by<bd.maxby && bd.getArrow(bd.db(c))==1){ array.push(c);} }
			cm += (array.join("+") + "/");
			array = [];
			for(var c=0;c<bd.cellmax;c++){ if(bd.cell[c].by<bd.maxby && bd.getArrow(bd.db(c))==2){ array.push(c);} }
			cm += (array.join("+") + "/");
			array = [];
			for(var c=0;c<bd.cellmax;c++){ if(bd.cell[c].bx<bd.maxbx && bd.getArrow(bd.rb(c))==1){ array.push(c);} }
			cm += (array.join("+") + "/");
			array = [];
			for(var c=0;c<bd.cellmax;c++){ if(bd.cell[c].bx<bd.maxbx && bd.getArrow(bd.rb(c))==2){ array.push(c);} }
			cm += (array.join("+") + "/");

			cm += ((bd.arrowin-bd.bdinside)+"/"+(bd.arrowout-bd.bdinside));

			this.outbstr += cm;
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			bd.inputarrowin (parseInt(this.readLine()));
			bd.inputarrowout(parseInt(this.readLine()));

			this.decodeCell( function(c,ca){
				if(ca=="1"){ bd.sQuC(c, 6);}
			});
			this.decodeBorder2( function(c,ca){
				if     (ca == "1"){ bd.setArrow(c, 1);}
				else if(ca == "2"){ bd.setArrow(c, 2);}
			});
			this.decodeBorder2( function(c,ca){
				if     (ca == "1" ){ bd.sLiB(c, 1);}
				else if(ca == "-1"){ bd.sQsB(c, 2);}
			});
		};
		fio.encodeData = function(){
			this.datastr += (bd.arrowin+"/"+bd.arrowout+"/");
			this.encodeCell( function(c){
				return ""+(bd.QuC(c)==6?"1":"0")+" "; 
			});
			this.encodeBorder2( function(c){
				if     (bd.getArrow(c)==1){ return "1 ";}
				else if(bd.getArrow(c)==2){ return "2 ";}
				else                      { return "0 ";}
			});
			this.encodeBorder2( function(c){
				if     (bd.LiB(c)==1){ return "1 ";}
				else if(bd.QsB(c)==2){ return "-1 ";}
				else                 { return "0 ";}
			});
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkLcntCell(3) ){
				this.setAlert('���򂵂Ă����������܂��B','There is a branch line.'); return false;
			}

			if( !this.checkAllCell(function(c){ return (line.lcntCell(c)==4 && bd.QuC(c)!=6 && bd.QuC(c)!=101);}) ){
				this.setAlert('�X�̕����ȊO�Ő����������Ă��܂��B', 'A Line is crossed outside of ice.'); return false;
			}
			if( !this.checkAllCell(ee.binder(this, function(c){ return (line.lcntCell(c)==2 && bd.QuC(c)==6 && !this.isLineStraight(c));})) ){
				this.setAlert('�X�̕����Ő����Ȃ����Ă��܂��B', 'A Line curve on ice.'); return false;
			}

			var flag = this.searchLine();
			if( flag==-1 ){
				this.setAlert('�X�^�[�g�ʒu�����ł��܂���ł����B', 'The system can\'t detect start position.'); return false;
			}
			if( flag==1 ){
				this.setAlert('IN�ɐ����ʂ��Ă��܂���B', 'The line doesn\'t go through the \'IN\' arrow.'); return false;
			}
			if( flag==2 ){
				this.setAlert('�r���œr�؂�Ă����������܂��B', 'There is a dead-end line.'); return false;
			}
			if( flag==3 ){
				this.setAlert('�Ֆʂ̊O�ɏo�Ă��܂�����������܂��B', 'A line is not reached out the \'OUT\' arrow.'); return false;
			}
			if( flag==4 ){
				this.setAlert('�����t�ɒʂ��Ă��܂��B', 'A line goes through an arrow reverse.'); return false;
			}

			if( !this.checkOneLoop() ){
				this.setAlert('�����ЂƂȂ���ł͂���܂���B', 'Lines are not countinuous.'); return false;
			}

			if( !this.checkIcebarns() ){
				this.setAlert('���ׂẴA�C�X�o�[����ʂ��Ă��܂���B', 'A icebarn is not gone through.'); return false;
			}

			if( !this.checkAllArrow() ){
				this.setAlert('�����ʂ��Ă��Ȃ���󂪂���܂��B', 'A line doesn\'t go through some arrows.'); return false;
			}

			if( !this.checkLcntCell(1) ){
				this.setAlert('�r���œr�؂�Ă����������܂��B', 'There is a dead-end line.'); return false;
			}

			return true;
		};

		ans.checkIcebarns = function(){
			var iarea = new AreaInfo();
			for(var cc=0;cc<bd.cellmax;cc++){ iarea.id[cc]=(bd.QuC(cc)==6?0:-1); }
			for(var cc=0;cc<bd.cellmax;cc++){
				if(iarea.id[cc]!=0){ continue;}
				iarea.max++;
				iarea[iarea.max] = {clist:[]};
				area.sc0(cc,iarea);

				iarea.room[iarea.max] = {idlist:iarea[iarea.max].clist};
			}

			return this.checkLinesInArea(iarea, function(w,h,a,n){ return (a!=0);});
		};

		ans.checkAllArrow = function(){
			var result = true;
			for(var id=0;id<bd.bdmax;id++){
				if(bd.isArrow(id) && !bd.isLine(id)){
					if(this.inAutoCheck){ return false;}
					bd.sErB([id],3);
					result = false;
				}
			}
			return result;
		};

		ans.searchLine = function(){
			var bx=bd.border[bd.arrowin].bx, by=bd.border[bd.arrowin].by;
			var dir=0;
			if     (by===bd.minby){ dir=2;}else if(by===bd.maxby){ dir=1;}
			else if(bx===bd.minbx){ dir=4;}else if(bx===bd.maxbx){ dir=3;}
			if(dir==0){ return -1;}
			if(!bd.isLine(bd.arrowin)){ bd.sErB([bd.arrowin],3); return 1;}

			bd.sErBAll(2);
			bd.sErB([bd.arrowin],1);

			while(1){
				switch(dir){ case 1: by--; break; case 2: by++; break; case 3: bx--; break; case 4: bx++; break;}
				if(!((bx+by)&1)){
					var cc = bd.cnum(bx,by);
					if(bd.QuC(cc)!=6){
						if     (line.lcntCell(cc)!=2){ dir=dir;}
						else if(dir!=1 && bd.isLine(bd.bnum(bx,by+1))){ dir=2;}
						else if(dir!=2 && bd.isLine(bd.bnum(bx,by-1))){ dir=1;}
						else if(dir!=3 && bd.isLine(bd.bnum(bx+1,by))){ dir=4;}
						else if(dir!=4 && bd.isLine(bd.bnum(bx-1,by))){ dir=3;}
					}
				}
				else{
					var id = bd.bnum(bx,by);
					bd.sErB([id],1);
					if(!bd.isLine(id)){ return 2;}
					if(bd.arrowout==id){ break;}
					else if(id==-1 || id>=bd.bdinside){ return 3;}

					if(((dir==1||dir==3) && bd.getArrow(id)==2) || ((dir==2||dir==4) && bd.getArrow(id)==1)){ return 4;}
				}
			}

			bd.sErBAll(0);

			return 0;
		};
	}
};
