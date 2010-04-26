//
// �p�Y���ŗL�X�N���v�g�� �{�b�N�X�� box.js v3.3.0
//
Puzzles.box = function(){ };
Puzzles.box.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 9;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 9;}	// �Ֆʂ̏c��
		k.irowake  = 0;		// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross  = 0;		// 1:�Ֆʓ�����Cross������p�Y�� 2:�O�g����܂߂�Cross������p�Y��
		k.isborder = 0;		// 1:Border/Line������\�ȃp�Y�� 2:�O�g�������\�ȃp�Y��
		k.isexcell = 2;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isLineCross     = false;	// ������������p�Y��
		k.isCenterLine    = false;	// �}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = false;	// ���E����line�Ƃ��Ĉ���
		k.hasroom         = false;	// �������̗̈�ɕ�����Ă���/������p�Y��
		k.roomNumber      = false;	// �����̖��̐�����1��������p�Y��

		k.dispzero        = true;	// 0��\�����邩�ǂ���
		k.isDispHatena    = false;	// qnum��-2�̂Ƃ��ɁH��\������
		k.isAnsNumber     = false;	// �񓚂ɐ�������͂���p�Y��
		k.NumberWithMB    = false;	// �񓚂̐����Ɓ��~������p�Y��
		k.linkNumber      = false;	// �������ЂƂȂ���ɂȂ�p�Y��

		k.BlackCell       = true;	// ���}�X����͂���p�Y��
		k.NumberIsWhite   = false;	// �����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
		k.RBBlackCell     = false;	// �A�����f�ւ̃p�Y��
		k.checkBlackCell  = false;	// ��������ō��}�X�̏����`�F�b�N����p�Y��
		k.checkWhiteCell  = false;	// ��������Ŕ��}�X�̏����`�F�b�N����p�Y��

		k.ispzprv3ONLY    = true;	// �ς��Ղ�A�v���b�g�ɂ͑��݂��Ȃ��p�Y��
		k.isKanpenExist   = false;	// pencilbox/�J���y���ɂ���p�Y��

		k.bdmargin       = 0.15;	// �g�O�̈�ӂ�margin(�Z�������Z)
		k.bdmargin_image = 0.10;	// �摜�o�͎���bdmargin�l

		base.setExpression("�@���N���b�N�ō��}�X���A�E�N���b�N�Ŕ��}�X�m��}�X�����͂ł��܂��B",
						   " Left Click to input black cells, Right Click to input determined white cells.");
		base.setTitle("�{�b�N�X","Kin-Kon-Kan");
		base.setFloatbgcolor("rgb(96, 96, 96)");
	},
	menufix : function(){
		menu.addUseToFlags();
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if(k.editmode){ this.clickexcell();}
			else if(k.playmode){ this.inputcell();}
		};
		mv.mouseup = function(){ };
		mv.mousemove = function(){
			if(k.playmode){ this.inputcell();}
		};

		mv.clickexcell = function(){
			var pos = this.borderpos(0);
			var ec = bd.exnum(pos.x, pos.y);
			if(ec<0 || bd.excellmax<=ec || pos.x===bd.maxbx-1 || pos.y===bd.maxby-1){ return false;}
			var ec0 = tc.getTEC();

			if(ec!==-1 && ec!==ec0){
				tc.setTEC(ec);
				pc.paintEXcell(ec0);
			}
			else if(ec!==-1 && ec===ec0){
				var qn = bd.QnE(ec), max=bd.nummaxfunc(ec);
				if(this.btn.Left){ bd.sQnE(ec,(qn!==max ? qn+1 : 0));}
				else if(this.btn.Right){ bd.sQnE(ec,(qn!==0 ? qn-1 : max));}
			}
			pc.paintEXcell(ec);

			this.mousereset();
			return true;
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.playmode){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputexcell(ca);
		};
		kc.key_inputexcell = function(ca){
			var ec = tc.getTEC();
			var max = bd.nummaxfunc(ec);

			if('0'<=ca && ca<='9'){
				var num = parseInt(ca);

				if(bd.QnE(ec)<=0 || this.prev!=ec){
					if(num<=max){ bd.sQnE(ec,num);}
				}
				else{
					if(bd.QnE(ec)*10+num<=max){ bd.sQnE(ec,bd.QnE(ec)*10+num);}
					else if(num<=max){ bd.sQnE(ec,num);}
				}
			}
			else if(ca==' ' || ca=='-'){ bd.sQnE(ec,0);}
			else{ return;}

			this.prev = ec;
			pc.paintEXcell(tc.getTEC());
		};
		kc.moveTCell = function(ca){
			var cc0 = tc.getTEC(), tcp = tc.getTCP();
			var flag = true;

			if     (ca===k.KEYUP){
				if(tcp.x===tc.minx && tc.miny<tcp.y){ tc.decTCY(2);}else{ flag=false;}
			}
			else if(ca===k.KEYDN){
				if(tcp.x===tc.minx && tc.maxy>tcp.y){ tc.incTCY(2);}else{ flag=false;}
			}
			else if(ca===k.KEYLT){
				if(tcp.y===tc.miny && tc.minx<tcp.x){ tc.decTCX(2);}else{ flag=false;}
			}
			else if(ca===k.KEYRT){
				if(tcp.y===tc.miny && tc.maxx>tcp.x){ tc.incTCX(2);}else{ flag=false;}
			}
			else{ flag=false;}

			if(flag){
				pc.paintEXcell(cc0);
				pc.paintEXcell(tc.getTEC());
				this.tcMoved = true;
			}

			return flag;
		};
		tc.adjust = function(){
			this.minx = -1;
			this.miny = -1;
			this.maxx = bd.maxbx-3;
			this.maxy = bd.maxby-3;
		};
		tc.adjust();

		menu.ex.adjustSpecial = function(type,key){
			um.disableRecord();
			if(type>=1 && type<=4){ // ���]�E��]�S��
				for(var c=0;c<bd.cellmax;c++){ if(bd.QaC(c)!=-1){ bd.sQaC(c,{1:2,2:1}[bd.QaC(c)]); } }
			}
			um.enableRecord();
		};

		tc.setTEC(0);
		bd.nummaxfunc = function(ec){
			var bx=bd.excell[ec].bx, by=bd.excell[ec].by, cnt;
			if(bx===-1 && by===-1){ return;}
			var func = function(val){ return (val===1 ? 1 : val+func(val-1));};
			return func(bx===-1 ? k.qrows : k.qcols);
		};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.bcolor = pc.bcolor_GREEN;
		pc.setBGCellColorFunc('qsub1');

		pc.paint = function(x1,y1,x2,y2){
			this.drawBGCells(x1,y1,x2,y2);
			this.drawBlackCells(x1,y1,x2,y2);
			this.drawGrid(x1,y1,x2,y2);

			this.drawErrorEXCells(x1,y1,x2,y2);
			this.drawCirclesAtNumber_box(x1,y1,x2,y2);
			this.drawNumbers_box(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawTarget(x1-1,y1-1,x2,y2);
		};

		pc.drawErrorEXCells = function(x1,y1,x2,y2){
			this.vinc('excell_full', 'crispEdges');

			var header = "ex_full_";
			var exlist = bd.excellinside(x1-1,y1-1,x2,y2);
			for(var i=0;i<exlist.length;i++){
				var c = exlist[i], obj = bd.excell[c];

				if(obj.error===1){
					g.fillStyle   = this.errbcolor1;
					if(this.vnop(header+c,this.FILL)){
						g.fillRect(obj.px, obj.py, this.cw, this.ch);
					}
				}
				else{ this.vhide(header+c)}
			}
		};
		pc.drawCirclesAtNumber_box = function(x1,y1,x2,y2){
			this.vinc('excell_circle', 'auto');

			var header = "ex_cir_";
			var rsize  = this.cw*0.36;
			var exlist = bd.excellinside(x1-1,y1-1,x2,y2);
			for(var i=0;i<exlist.length;i++){
				var c = exlist[i], obj = bd.excell[c];
				if(c>=2*(k.qcols+k.qrows) || obj.bx===-1 || obj.by===-1){ continue;}

				g.fillStyle   = this.circledcolor;
				g.strokeStyle = this.Cellcolor;
				if(this.vnop(header+c,this.NONE)){
					g.shapeCircle(obj.px+this.bw, obj.py+this.bh, rsize);
				}
			}
		};
		pc.drawNumbers_box = function(x1,y1,x2,y2){
			this.vinc('excell_number', 'auto');

			var header = "ex_full_";
			var exlist = bd.excellinside(x1-1,y1-1,x2,y2);
			for(var i=0;i<exlist.length;i++){
				var c = exlist[i], obj = bd.excell[c], key = 'excell_'+c;
				if(c>=2*(k.qcols+k.qrows)){ continue;}

				if(obj.bx===-1 || obj.by===-1){
					var color = (obj.error!==1 ? this.fontcolor : this.fontErrcolor);
					var fontratio = (obj.qnum<10?0.8:0.7);
					this.dispnum(key, 1, ""+obj.qnum, fontratio, color, obj.px+this.bw, obj.py+this.bh);
				}
				else{
					var num = ((obj.bx!==bd.maxbx-1 ? obj.bx : obj.by)+1)>>1;
					var fontratio = (num<10?0.7:0.6);
					this.dispnum(key, 1, ""+num, fontratio, this.fontcolor, obj.px+this.bw, obj.py+this.bh);
				}
			}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type){
			this.decodeBox();
		};
		enc.pzlexport = function(type){
			this.encodeBox();
		};

		enc.decodeBox = function(){
			var exlist=[];
			for(var bx=1;bx<2*k.qcols;bx+=2){ exlist.push(bd.exnum(bx,-1));}
			for(var by=1;by<2*k.qrows;by+=2){ exlist.push(bd.exnum(-1,by));}

			var cm="", i=0, bstr = this.outbstr;
			for(var a=0;a<bstr.length;a++){
				var ec = exlist[i], ca=bstr.charAt(a);
				if(ca==='-'){ bd.sQnE(ec, parseInt(bstr.substr(a+1,2),32)); a+=2;}
				else        { bd.sQnE(ec, parseInt(ca,32));}
				i++;
				if(i >= exlist.length){ a++; break;}
			}

			this.outbstr = bstr.substr(a);
		};
		enc.encodeBox = function(){
			var exlist=[];
			for(var bx=1;bx<2*k.qcols;bx+=2){ exlist.push(bd.exnum(bx,-1));}
			for(var by=1;by<2*k.qrows;by+=2){ exlist.push(bd.exnum(-1,by));}

			var cm="";
			for(var i=0;i<exlist.length;i++){
				var ec = exlist[i], qnum=bd.QnE(ec);
				if(qnum<32){ cm+=("" +qnum.toString(32));}
				else       { cm+=("-"+qnum.toString(32));}
			}

			this.outbstr += cm;
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			var item = this.getItemList(k.qrows+1);
			for(var i=0;i<item.length;i++) {
				var ca = item[i];
				if(ca=="."){ continue;}

				var ec = bd.exnum(i%(k.qcols+1)*2-1,mf(i/(k.qcols+1))*2-1);
				if(ec!==-1){
					bd.sQnE(ec, parseInt(ca));
				}

				var c = bd.cnum(i%(k.qcols+1)*2-1,mf(i/(k.qcols+1))*2-1);
				if(c!==-1){
					if     (ca==="#"){ bd.sQaC(c, 1);}
					else if(ca==="+"){ bd.sQsC(c, 1);}
				}
			}
		};
		fio.encodeData = function(){
			for(var by=-1;by<bd.maxby-2;by+=2){
				for(var bx=-1;bx<bd.maxbx-2;bx+=2){
					var ec = bd.exnum(bx,by);
					if(ec!==-1){
						this.datastr += (bd.QnE(ec).toString()+" ");
						continue;
					}

					var c = bd.cnum(bx,by);
					if(c!==-1){
						if     (bd.QaC(c)===1){ this.datastr += "# ";}
						else if(bd.QsC(c)===1){ this.datastr += "+ ";}
						else                  { this.datastr += ". ";}
						continue;
					}

					this.datastr += ". ";
				}
				this.datastr += "/";
			}
		};
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkBlackCells() ){
				this.setAlert('�����ƍ��}�X�ɂȂ��������̍��v������������܂���B', 'A number is not equal to the sum of the number of black cells.'); return false;
			}

			return true;
		};

		ans.checkBlackCells = function(type){
			var result = true;
			for(var ec=0;ec<bd.excellmax;ec++){
				var qn=bd.QnE(ec), bx=bd.excell[ec].bx, by=bd.excell[ec].by, val=0, clist=[];
				if(by===-1 && bx>0 && bx<2*k.qcols){
					for(var y=1;y<2*k.qrows;y+=2){
						var c = bd.cnum(bx,y);
						if(bd.cell[c].qans===1){ val+=((y+1)>>1);}
						clist.push(c);
					}
				}
				else if(bx===-1 && by>0 && by<2*k.qrows){
					for(var x=1;x<2*k.qcols;x+=2){
						var c = bd.cnum(x,by);
						if(bd.cell[c].qans===1){ val+=((x+1)>>1);}
						clist.push(c);
					}
				}
				else{ continue;}

				if(qn!==val){
					if(this.inAutoCheck){ return false;}
					bd.sErE([ec],1);
					bd.sErC(clist,1);
					result = false;
				}
			}
			return result;
		};
	}
};
