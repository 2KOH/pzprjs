//
// �p�Y���ŗL�X�N���v�g�� �L���R���J���� kinkonkan.js v3.3.0
//
Puzzles.kinkonkan = function(){ };
Puzzles.kinkonkan.prototype = {
	setting : function(){
		// �O���[�o���ϐ��̏����ݒ�
		if(!k.qcols){ k.qcols = 8;}	// �Ֆʂ̉���
		if(!k.qrows){ k.qrows = 8;}	// �Ֆʂ̏c��
		k.irowake  = 0;		// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

		k.iscross  = 0;		// 1:�Ֆʓ�����Cross������p�Y�� 2:�O�g����܂߂�Cross������p�Y��
		k.isborder = 1;		// 1:Border/Line������\�ȃp�Y�� 2:�O�g�������\�ȃp�Y��
		k.isexcell = 2;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

		k.isLineCross     = false;	// ������������p�Y��
		k.isCenterLine    = false;	// �}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
		k.isborderAsLine  = false;	// ���E����line�Ƃ��Ĉ���
		k.hasroom         = true;	// �������̗̈�ɕ�����Ă���/������p�Y��
		k.roomNumber      = false;	// �����̖��̐�����1��������p�Y��

		k.dispzero        = true;	// 0��\�����邩�ǂ���
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

		k.bdmargin       = 0.15;	// �g�O�̈�ӂ�margin(�Z�������Z)
		k.bdmargin_image = 0.10;	// �摜�o�͎���bdmargin�l

		if(k.EDITOR){
			base.setExpression("�@�}�E�X�̍��{�^���ŋ��E�������͂ł��܂��B�O���̃A���t�@�x�b�g�́A�����L�[�����񂩉����đ啶���������^�F�Ⴂ�̌v4��ނ���͂ł��܂��B",
							   " Left Click to input border lines. It is able to change outside alphabets to four type that is either capital or lower, is either black or blue type by pressing the same key.");
		}
		else{
			base.setExpression("�@�}�E�X�̃N���b�N�Ŏΐ��Ȃǂ����͂ł��܂��B�O�����N���b�N����ƌ������˂���܂��B",
							   " Click to input mirrors or auxiliary marks. Click Outside of the board to give off the light.");
		}
		base.setTitle("�L���R���J��","Kin-Kon-Kan");
		base.setFloatbgcolor("rgb(96, 96, 96)");
	},
	menufix : function(){ },

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(){
			if(k.editmode){
				if(!this.clickexcell()){ this.inputborder();}
			}
			else if(k.playmode){
				this.inputslash();
			}
		};
		mv.mouseup = function(){
			if(this.inputData==12){ ans.errDisp=true; bd.errclear();}
		};
		mv.mousemove = function(){
			if     (k.editmode && this.btn.Left) this.inputborder();
			else if(k.playmode && this.inputData!=-1) this.inputslash();
		};
		mv.inputslash = function(){
			var cc = this.cellid();
			if(cc==-1){ this.inputflash(); return;}

			if     (this.inputData== 3){ bd.sQaC(cc,-1); bd.sQsC(cc,1);}
			else if(this.inputData== 4){ bd.sQaC(cc,-1); bd.sQsC(cc,0);}
			else if(this.inputData!=-1){ return;}
			else if(this.btn.Left){
				if     (bd.QaC(cc)==1) { bd.sQaC(cc, 2); bd.sQsC(cc,0); this.inputData=2;}
				else if(bd.QaC(cc)==2) { bd.sQaC(cc,-1); bd.sQsC(cc,1); this.inputData=3;}
				else if(bd.QsC(cc)==1) { bd.sQaC(cc,-1); bd.sQsC(cc,0); this.inputData=4;}
				else                   { bd.sQaC(cc, 1); bd.sQsC(cc,0); this.inputData=1;}
			}
			else if(this.btn.Right){
				if     (bd.QaC(cc)==1) { bd.sQaC(cc,-1); bd.sQsC(cc,0); this.inputData=4;}
				else if(bd.QaC(cc)==2) { bd.sQaC(cc, 1); bd.sQsC(cc,0); this.inputData=1;}
				else if(bd.QsC(cc)==1) { bd.sQaC(cc, 2); bd.sQsC(cc,0); this.inputData=2;}
				else                   { bd.sQaC(cc,-1); bd.sQsC(cc,1); this.inputData=3;}
			}

			pc.paintCellAround(cc);
		};
		mv.inputflash = function(){
			var pos = this.borderpos(0);
			var ec = bd.exnum(pos.x,pos.y)
			if(ec==-1 || this.mouseCell==ec || (this.inputData!=11 && this.inputData!=-1)){ return;}

			if(this.inputData==-1 && bd.ErE(ec)==6){ this.inputData=12;}
			else{
				ans.errDisp=true;
				bd.errclear();
				mv.flashlight(ec);
				this.inputData=11;
			}
			this.mouseCell=ec;
			return;
		};
		mv.clickexcell = function(){
			var pos = this.borderpos(0);
			var ec = bd.exnum(pos.x, pos.y);
			if(ec<0 || bd.excellmax<=ec){ return false;}
			var ec0 = tc.getTEC();

			if(ec!=-1 && ec!=ec0){
				tc.setTEC(ec);
				pc.paintEXcell(ec);
				pc.paintEXcell(ec0);
			}
			else if(ec!=-1 && ec==ec0){
				var flag = (bd.ErE(ec)!=6);
				ans.errDisp=true;
				bd.errclear();
				if(flag){ mv.flashlight(ec);}
			}

			this.btn.Left = false;
			return true;
		};
		mv.flashlight = function(ec){
			var ldata = [];
			for(var c=0;c<bd.cellmax;c++){ ldata[c]=0;}
			var ret = ans.checkMirror1(ec, ldata);
			bd.sErE([ec,ret.dest],6);
			for(var c=0;c<bd.cellmax;c++){ bd.sErC([c],ldata[c]);}
			pc.paintAll();
		},

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.playmode){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputexcell(ca);
		};
		kc.key_inputexcell = function(ca){
			var ec = tc.getTEC();
			var max = 104;

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
			else if('a'<=ca && ca<='z'){
				var num = parseInt(ca,36)-10;
				var canum = bd.DiE(ec);
				if     ((canum-1)%26==num && canum>0 && canum<79){ bd.sDiE(ec,canum+26);}
				else if((canum-1)%26==num){ bd.sDiE(ec,0);}
				else{ bd.sDiE(ec,num+1);}
			}
			else if(ca=='-'){
				if(bd.QnE(ec)!=-1){ bd.sQnE(ec,-1);}
				else              { bd.sQnE(ec,-1); bd.sDiE(ec,0);}
			}
			else if(ca=='F4'){
				var flag = (bd.ErE(ec)!=6);
				ans.errDisp=true;
				bd.errclear();
				if(flag){ mv.flashlight(ec);}
			}
			else if(ca==' '){ bd.sQnE(ec,-1); bd.sDiE(ec,0);}
			else{ return;}

			this.prev = ec;
			pc.paintEXcell(tc.getTEC());
		};
		kc.moveTCell = function(ca){
			var cc0 = tc.getTEC(), tcp = tc.getTCP();
			var flag = true;

			if     (ca == k.KEYUP){
				if(tcp.y==tc.maxy && tc.minx<tcp.x && tcp.x<tc.maxx){ tc.cursoly=tc.miny;}
				else if(tcp.y>tc.miny){ tc.decTCY(2);}else{ flag=false;}
			}
			else if(ca == k.KEYDN){
				if(tcp.y==tc.miny && tc.minx<tcp.x && tcp.x<tc.maxx){ tc.cursoly=tc.maxy;}
				else if(tcp.y<tc.maxy){ tc.incTCY(2);}else{ flag=false;}
			}
			else if(ca == k.KEYLT){
				if(tcp.x==tc.maxx && tc.miny<tcp.y && tcp.y<tc.maxy){ tc.cursolx=tc.minx;}
				else if(tcp.x>tc.minx){ tc.decTCX(2);}else{ flag=false;}
			}
			else if(ca == k.KEYRT){
				if(tcp.x==tc.minx && tc.miny<tcp.y && tcp.y<tc.maxy){ tc.cursolx=tc.maxx;}
				else if(tcp.x<tc.maxx){ tc.incTCX(2);}else{ flag=false;}
			}
			else{ flag=false;}

			if(flag){
				pc.paintEXcell(cc0);
				pc.paintEXcell(tc.getTEC());
				this.tcMoved = true;
			}

			return flag;
		};

		menu.ex.adjustSpecial = function(type,key){
			um.disableRecord();
			if(type>=1 && type<=4){ // ���]�E��]�S��
				for(var c=0;c<bd.cellmax;c++){ if(bd.QaC(c)!=-1){ bd.sQaC(c,{1:2,2:1}[bd.QaC(c)]); } }
			}
			um.enableRecord();
		};

		tc.setTEC(0);
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_LIGHT;

		pc.errbcolor2 = "rgb(255, 255, 127)";
		pc.dotcolor = "rgb(255, 96, 191)";

		pc.paint = function(x1,y1,x2,y2){
			this.drawErrorCells_kinkonkan(x1,y1,x2,y2);
			this.drawDotCells(x1,y1,x2,y2);

			this.drawGrid(x1,y1,x2,y2);
			this.drawBorders(x1,y1,x2,y2);

			this.drawSlashes(x1,y1,x2,y2);

			this.drawEXcells_kinkonkan(x1,y1,x2,y2);
			this.drawChassis(x1,y1,x2,y2);

			this.drawTarget(x1-1,y1-1,x2,y2);
		};

		pc.drawErrorCells_kinkonkan = function(x1,y1,x2,y2){
			this.vinc('cell_back', 'crispEdges');

			var headers = ["c_full_", "c_tri2_", "c_tri3_", "c_tri4_", "c_tri5_", "c_full_"];
			var clist = this.cellinside(x1,y1,x2,y2);
			for(var i=0;i<clist.length;i++){
				var c = clist[i], err = bd.cell[c].error;
				if(err!==0){
					if     (err==1){ g.fillStyle = this.errbcolor1;}
					else if(err>=2){ g.fillStyle = this.errbcolor2;}
					if(err===1 || err===6){
						if(this.vnop(headers[err-1]+c,this.FILL)){
							g.fillRect(bd.cell[c].px, bd.cell[c].py, this.cw, this.ch);
						}
					}
					else{ this.drawTriangle1(bd.cell[c].px, bd.cell[c].py, err, headers[err-1]+c);}
				}
				else{ this.vhide([headers[0]+c, headers[1]+c, headers[2]+c, headers[3]+c, headers[4]+c, headers[5]+c]);}
			}
		};
		pc.drawSlashes = function(x1,y1,x2,y2){
			this.vinc('cell_slash', 'auto');

			var headers = ["c_sl1_", "c_sl2_"];
			g.lineWidth = Math.max(this.cw/8, 2);

			var clist = this.cellinside(x1,y1,x2,y2);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];

				if(bd.cell[c].qans!=-1){
					g.strokeStyle = this.Cellcolor;
					if(bd.cell[c].qans==1){
						if(this.vnop(headers[0]+c,this.NONE)){
							g.setOffsetLinePath(bd.cell[c].px,bd.cell[c].py, 0,0, this.cw,this.ch, true);
							g.stroke();
						}
					}
					else{ this.vhide(headers[0]+c);}
					if(bd.cell[c].qans==2){
						if(this.vnop(headers[1]+c,this.NONE)){
							g.setOffsetLinePath(bd.cell[c].px,bd.cell[c].py, this.cw,0, 0,this.ch, true);
							g.stroke();
						}
					}
					else{ this.vhide(headers[1]+c);}
				}
				else{ this.vhide([headers[0]+c, headers[1]+c]);}
			}
		};

		pc.drawEXcells_kinkonkan = function(x1,y1,x2,y2){
			this.vinc('excell_number', 'auto');

			var header = "ex_full_";
			var exlist = this.excellinside(x1-1,y1-1,x2,y2);
			for(var i=0;i<exlist.length;i++){
				var c = exlist[i], obj = bd.excell[c], key = 'excell_'+c;

				if(obj.error===6){
					g.fillStyle = this.errbcolor2;
					if(this.vnop(header+c,this.NONE)){
						g.fillRect(obj.px+1, obj.py+1, this.cw-1, this.ch-1);
					}
				}
				else{ this.vhide(header+c);}

				if(obj.direc!==0 || obj.qnum!==-1){
					var num=obj.qnum, canum=obj.direc;

					var color = this.fontErrcolor;
					if(obj.error!==1){ color=(canum<=52?this.fontcolor:this.fontAnscolor);}

					var fontratio = 0.66;
					if(canum>0&&num>=10){ fontratio = 0.55;}

					var text="";
					if     (canum> 0&&canum<= 26){ text+=(canum+ 9).toString(36).toUpperCase();}
					else if(canum>26&&canum<= 52){ text+=(canum-17).toString(36).toLowerCase();}
					else if(canum>52&&canum<= 78){ text+=(canum-43).toString(36).toUpperCase();}
					else if(canum>78&&canum<=104){ text+=(canum-69).toString(36).toLowerCase();}
					if(num>=0){ text+=num.toString(10);}

					this.dispnum(key, 1, text, fontratio, color, obj.px+this.bw, obj.py+this.bh);
				}
				else{ this.hideEL(key);}
			}
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	encode_init : function(){
		enc.pzlimport = function(type){
			this.decodeBorder();
			this.decodeKinkonkan();
		};
		enc.pzlexport = function(type){
			this.encodeBorder();
			this.encodeKinkonkan();
		};

		enc.decodeKinkonkan = function(){
			// �ՖʊO�����̃f�R�[�h
			var subint = [];
			var ec=0, a=0, bstr = this.outbstr;
			for(var i=0;i<bstr.length;i++){
				var ca = bstr.charAt(i);

				if     (this.include(ca,'A','Z')){ bd.sDiE(ec, parseInt(ca,36)-9); subint.push(ec); ec++;}
				else if(this.include(ca,'0','9')){ bd.sDiE(ec, (parseInt(bstr.charAt(i+1))+1)*26+parseInt(ca,36)-9); subint.push(ec); ec++; i++;}
				else if(this.include(ca,'a','z')){ ec+=(parseInt(ca,36)-9);}
				else{ ec++;}

				if(ec >= bd.excellmax-4){ a=i+1; break;}
			}
			ec=0;
			for(var i=a;i<bstr.length;i++){
				var ca = bstr.charAt(i);
				if     (ca == '.'){ bd.sQnE(subint[ec], -2);                              ec++;      }
				else if(ca == '-'){ bd.sQnE(subint[ec], parseInt(bstr.substr(i+1,2),16)); ec++; i+=2;}
				else              { bd.sQnE(subint[ec], parseInt(bstr.substr(i  ,1),16)); ec++;      }
				if(ec >= subint.length){ a=i+1; break;}
			}

			this.outbstr = bstr.substr(a);
		};
		enc.encodeKinkonkan = function(){
			var cm="", cm2="";

			// �ՖʊO�����̃G���R�[�h
			var count=0;
			for(var ec=0;ec<bd.excellmax-4;ec++){
				pstr = "";
				var val  = bd.DiE(ec);
				var qnum = bd.QnE(ec);

				if(val> 0 && val<=104){
					if(val<=26){ pstr = (val+9).toString(36).toUpperCase();}
					else       { pstr = mf((val-1)/26-1).toString() + ((val-1)%26+10).toString(16).toUpperCase();}

					if     (qnum==-2){ cm2+=".";}
					else if(qnum <16){ cm2+=("" +qnum.toString(16));}
					else             { cm2+=("-"+qnum.toString(16));}
				}
				else{ count++;}

				if(count==0){ cm += pstr;}
				else if(pstr || count==26){ cm+=((9+count).toString(36)+pstr); count=0;}
			}
			if(count>0){ cm+=(9+count).toString(36);}

			this.outbstr += (cm+cm2);
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			this.decodeAreaRoom();

			var item = this.getItemList(k.qrows+2);
			for(var i=0;i<item.length;i++) {
				var ca = item[i];
				if(ca=="."){ continue;}

				var ec = bd.exnum(i%(k.qcols+2)*2-1,mf(i/(k.qcols+2))*2-1);
				if(ec!==-1){
					var inp = ca.split(",");
					if(inp[0]!=""){ bd.sDiE(ec, parseInt(inp[0]));}
					if(inp[1]!=""){ bd.sQnE(ec, parseInt(inp[1]));}
				}

				if(this.filever==1){
					var c = bd.cnum(i%(k.qcols+2)*2-1,mf(i/(k.qcols+2))*2-1);
					if(c!==-1){
						if     (ca==="+"){ bd.sQsC(c, 1);}
						else if(ca!=="."){ bd.sQaC(c, parseInt(ca));}
					}
				}
			}

			if(this.filever==0){
				this.decodeCellQanssub();
			}
		};
		fio.encodeData = function(){
			this.filever = 1;
			this.encodeAreaRoom();

			for(var by=-1;by<bd.maxby;by+=2){
				for(var bx=-1;bx<bd.maxbx;bx+=2){
					var ec = bd.exnum(bx,by);
					if(ec!==-1){
						var str1 = (bd.DiE(ec)== 0?"":bd.DiE(ec).toString());
						var str2 = (bd.QnE(ec)==-1?"":bd.QnE(ec).toString());
						this.datastr += ((str1=="" && str2=="")?(". "):(""+str1+","+str2+" "));
						continue;
					}

					var c = bd.cnum(bx,by);
					if(c!==-1){
						if     (bd.QaC(c)!==-1){ this.datastr += (bd.QaC(c).toString() + " ");}
						else if(bd.QsC(c)=== 1){ this.datastr += "+ ";}
						else                   { this.datastr += ". ";}
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

			var rinfo = area.getRoomInfo();
			if( !this.checkAllArea(rinfo, function(cc){ return bd.QaC(cc)>0;}, function(w,h,a,n){ return (a<=1);}) ){
				this.setAlert('�ΐ������������ꂽ����������܂��B', 'A room has plural mirrors.'); return false;
			}

			if( !this.checkMirrors(1) ){
				this.setAlert('�������������̏ꏊ�֓��B���܂���B', 'Beam from a light doesn\'t reach one\'s pair.'); return false;
			}

			if( !this.checkMirrors(2) ){
				this.setAlert('���̔��ˉ񐔂�����������܂���B', 'The count of refrection is wrong.'); return false;
			}

			if( !this.checkAllArea(rinfo, function(cc){ return bd.QaC(cc)>0;}, function(w,h,a,n){ return (a!=0);}) ){
				this.setAlert('�ΐ��̈�����Ă��Ȃ�����������܂��B', 'A room has no mirrors.'); return false;
			}

			return true;
		};

		ans.checkMirrors = function(type){
			var d = [];
			for(var ec=0;ec<bd.excellmax-4;ec++){
				if(!isNaN(d[ec]) || bd.QnE(ec)==-1 || bd.DiE(ec)==0){ continue;}
				var ldata = [];
				for(var c=0;c<bd.cellmax;c++){ ldata[c]=0;}

				var ret = this.checkMirror1(ec, ldata);
				if( (type==1&& (bd.DiE(ec)!=bd.DiE(ret.dest)) )||
					(type==2&&((bd.QnE(ec)!=bd.QnE(ret.dest)) || bd.QnE(ec)!=ret.cnt))
				){
					for(var c=0;c<bd.excellmax;c++){ bd.sErE([c],0);}
					bd.sErE([ec,ret.dest],6);
					for(var c=0;c<bd.cellmax;c++){ bd.sErC([c],ldata[c]);}
					return false;
				}
				d[ec]=1; d[ret.dest]=1;
			}
			return true;
		};
		ans.checkMirror1 = function(startec, ldata){
			var ccnt=0;

			var bx=bd.excell[startec].bx, by=bd.excell[startec].by;
			var dir=0;
			if     (by===bd.minby+1){ dir=2;}
			else if(by===bd.maxby-1){ dir=1;}
			else if(bx===bd.minbx+1){ dir=4;}
			else if(bx===bd.maxbx-1){ dir=3;}

			while(dir!=0){
				switch(dir){ case 1: by-=2; break; case 2: by+=2; break; case 3: bx-=2; break; case 4: bx+=2; break;}

				var cc = bd.cnum(bx,by), qa = bd.QaC(cc);
				if(qa===1){
					if     (dir===1){ ldata[cc]=(!isNaN({4:1,6:1}[ldata[cc]])?6:2); dir=3;}
					else if(dir===2){ ldata[cc]=(!isNaN({2:1,6:1}[ldata[cc]])?6:4); dir=4;}
					else if(dir===3){ ldata[cc]=(!isNaN({2:1,6:1}[ldata[cc]])?6:4); dir=1;}
					else if(dir===4){ ldata[cc]=(!isNaN({4:1,6:1}[ldata[cc]])?6:2); dir=2;}
				}
				else if(qa===2){
					if     (dir===1){ ldata[cc]=(!isNaN({5:1,6:1}[ldata[cc]])?6:3); dir=4;}
					else if(dir===2){ ldata[cc]=(!isNaN({3:1,6:1}[ldata[cc]])?6:5); dir=3;}
					else if(dir===3){ ldata[cc]=(!isNaN({5:1,6:1}[ldata[cc]])?6:3); dir=2;}
					else if(dir===4){ ldata[cc]=(!isNaN({3:1,6:1}[ldata[cc]])?6:5); dir=1;}
				}
				else if(cc!==-1){ ldata[cc]=6; continue;}
				else{ break;}

				ccnt++;
				if(ccnt>bd.cellmax){ break;} // �O�̂��߃K�[�h����(��������������Ȃ�)
			}

			return {cnt:ccnt, dest:bd.exnum(bx,by)};
		};
	}
};
