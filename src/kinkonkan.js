//
// �p�Y���ŗL�X�N���v�g�� �L���R���J���� tilepaint.js v3.1.9p1
//

function setting(){
	// �O���[�o���ϐ��̏����ݒ�
	if(!k.qcols){ k.qcols = 8;}	// �Ֆʂ̉���
	if(!k.qrows){ k.qrows = 8;}	// �Ֆʂ̏c��
	k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

	k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
	k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
	k.isextendcell = 2;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

	k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
	k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
	k.isborderCross   = 0;	// 1:������������p�Y��
	k.isCenterLine    = 0;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
	k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

	k.dispzero      = 1;	// 1:0��\�����邩�ǂ���
	k.isDispHatena  = 1;	// 1:qnum��-2�̂Ƃ��ɁH��\������
	k.isAnsNumber   = 0;	// 1:�񓚂ɐ�������͂���p�Y��
	k.isArrowNumber = 0;	// 1:������������͂���p�Y��
	k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
	k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
	k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

	k.BlackCell     = 0;	// 1:���}�X����͂���p�Y��
	k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
	k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

	k.ispzprv3ONLY  = 0;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
	k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

	k.fstruct = ["arearoom", "others", "cellqanssub"];

	//k.def_csize = 36;
	k.def_psize = 48;
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
			base.setExpression("�@�}�E�X�̃N���b�N�Ŏΐ��Ȃǂ����͂ł��܂��B�O�����N���b�N����ƌ������˂���܂��B",
							   " Click to input mirrors or auxiliary marks. Click Outside of the board to give off the light.");
		}
		else{
			base.setExpression("�@�}�E�X�̍��{�^���ŋ��E�������͂ł��܂��B�O���̃A���t�@�x�b�g�́A�����L�[�����񂩉����đ啶���������^�F�Ⴂ�̌v4��ނ���͂ł��܂��B",
							   " Left Click to input border lines. It is able to change outside alphabets to four type that is either capital or lower, is either black or blue type by pressing the same key.");
		}
		base.setTitle("�L���R���J��","Kin-Kon-Kan");
		base.setFloatbgcolor("rgb(96, 96, 96)");
	},
	menufix : function(){ },
	postfix : function(){
		menu.ex.adjustSpecial = this.adjustSpecial;

		tc.getTCC = function(){ return bd.getexnum(int((this.cursolx-1)/2), int((this.cursoly-1)/2));}.bind(tc);
		tc.setTCC = function(id){
			if(id<0 || 2*k.qcols+2*k.qrows+4<=id){ return;}
			if     (id<  k.qcols)            { this.cursolx=2*id+1;           this.cursoly=this.miny;                 }
			else if(id<2*k.qcols)            { this.cursolx=2*(id-k.qcols)+1; this.cursoly=this.maxy;                 }
			else if(id<2*k.qcols+  k.qrows)  { this.cursolx=this.minx;        this.cursoly=2*(id-2*k.qcols)+1;        }
			else if(id<2*k.qcols+2*k.qrows)  { this.cursolx=this.maxx;        this.cursoly=2*(id-2*k.qcols-k.qrows)+1;}
			else if(id<2*k.qcols+2*k.qrows+1){ this.cursolx=this.minx; this.cursoly=this.miny;}
			else if(id<2*k.qcols+2*k.qrows+2){ this.cursolx=this.maxx; this.cursoly=this.miny;}
			else if(id<2*k.qcols+2*k.qrows+3){ this.cursolx=this.minx; this.cursoly=this.maxy;}
			else if(id<2*k.qcols+2*k.qrows+4){ this.cursolx=this.maxx; this.cursoly=this.maxy;}
		}.bind(tc);
		tc.setTCC(0);
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(k.mode==1){
				if(!this.clickexcell(x,y)){ this.inputborder(x,y);}
			}
			else if(k.mode==3){
				this.inputslash(x,y);
			}
		};
		mv.mouseup = function(x,y){
			if(this.inputData==12){ ans.errDisp=true; bd.errclear();}
		};
		mv.mousemove = function(x,y){
			if(k.mode==1 && this.btn.Left) this.inputborder(x,y);
			else if(k.mode==3 && this.inputData!=-1) this.inputslash(x,y);
		};
		mv.inputslash = function(x,y){
			var cc = this.cellid(new Pos(x,y));
			if(cc==-1){ this.inputflash(x,y); return;}

			if     (this.inputData== 3){ bd.setQansCell(cc,-1); bd.setQsubCell(cc,1);}
			else if(this.inputData== 4){ bd.setQansCell(cc,-1); bd.setQsubCell(cc,0);}
			else if(this.inputData!=-1){ return;}
			else if(this.btn.Left){
				if     (bd.getQansCell(cc)==1){ bd.setQansCell(cc, 2); bd.setQsubCell(cc,0); this.inputData=2;}
				else if(bd.getQansCell(cc)==2){ bd.setQansCell(cc,-1); bd.setQsubCell(cc,1); this.inputData=3;}
				else if(bd.getQsubCell(cc)==1){ bd.setQansCell(cc,-1); bd.setQsubCell(cc,0); this.inputData=4;}
				else                          { bd.setQansCell(cc, 1); bd.setQsubCell(cc,0); this.inputData=1;}
			}
			else if(this.btn.Right){
				if     (bd.getQansCell(cc)==1){ bd.setQansCell(cc,-1); bd.setQsubCell(cc,0); this.inputData=4;}
				else if(bd.getQansCell(cc)==2){ bd.setQansCell(cc, 1); bd.setQsubCell(cc,0); this.inputData=1;}
				else if(bd.getQsubCell(cc)==1){ bd.setQansCell(cc, 2); bd.setQsubCell(cc,0); this.inputData=2;}
				else                          { bd.setQansCell(cc,-1); bd.setQsubCell(cc,1); this.inputData=3;}
			}

			pc.paint(bd.cell[cc].cx-1, bd.cell[cc].cy-1, bd.cell[cc].cx+1, bd.cell[cc].cy+1);
		};
		mv.inputflash = function(x,y){
			var pos = this.cellpos(new Pos(x,y));
			var ec = bd.getexnum(pos.x,pos.y)
			if(ec==-1 || this.mouseCell==ec || (this.inputData!=11 && this.inputData!=-1)){ return;}

			if(this.inputData==-1 && bd.getErrorEXcell(ec)==6){ this.inputData=12;}
			else{
				ans.errDisp=true;
				bd.errclear();
				puz.flashlight(ec);
				this.inputData=11;
			}
			this.mouseCell=ec;
			return;
		};
		mv.clickexcell = function(x,y){
			var pos = this.cellpos(new Pos(x,y));
			var ec = bd.getexnum(pos.x, pos.y);
			if(ec<0 || 2*k.qcols+2*k.qrows+4<=ec){ return;}

			if(ec!=-1 && ec!=tc.getTCC()){
				tc.setTCC(ec);
				pc.paintEXcell(ec);
				pc.paintEXcell(tc.getTCC());
			}
			else if(ec!=-1 && ec==tc.getTCC()){
				var flag = (bd.getErrorEXcell(ec)!=6);
				ans.errDisp=true;
				bd.errclear();
				if(flag){ puz.flashlight(ec);}
			}

			this.btn.Left = false;
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.mode==3){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputexcell(ca);
		};
		kc.key_inputexcell = function(ca){
			var ec = tc.getTCC();
			var max = 104;

			if('0'<=ca && ca<='9'){
				var num = parseInt(ca);

				if(bd.getQnumEXcell(ec)<=0 || this.prev!=ec){
					if(num<=max){ bd.setQnumEXcell(ec,num);}
				}
				else{
					if(bd.getQnumEXcell(ec)*10+num<=max){ bd.setQnumEXcell(ec,bd.getQnumEXcell(ec)*10+num);}
					else if(num<=max){ bd.setQnumEXcell(ec,num);}
				}
			}
			else if('a'<=ca && ca<='z'){
				var num = parseInt(ca,36)-10;
				var canum = bd.getDirecEXcell(ec);
				if     ((canum-1)%26==num && canum>0 && canum<79){ bd.setDirecEXcell(ec,canum+26);}
				else if((canum-1)%26==num){ bd.setDirecEXcell(ec,0);}
				else{ bd.setDirecEXcell(ec,num+1);}
			}
			else if(ca=='-'){
				if(bd.getQnumEXcell(ec)!=-1){ bd.setQnumEXcell(ec,-1);}
				else                        { bd.setQnumEXcell(ec,-1); bd.setDirecEXcell(ec,0);}
			}
			else if(ca=='F4'){
				var flag = (bd.getErrorEXcell(ec)!=6);
				ans.errDisp=true;
				bd.errclear();
				if(flag){ puz.flashlight(ec);}
			}
			else if(ca==' '){ bd.setQnumEXcell(ec,-1); bd.setDirecEXcell(ec,0);}
			else{ return;}

			this.prev = ec;
			pc.paintEXcell(tc.getTCC());
		};
		kc.moveTCell = function(ca){
			var cc0 = tc.getTCC(), tcp = tc.getTCP();
			var flag = true;

			if     (ca == 'up'){
				if(tcp.y==tc.maxy && tc.minx<tcp.x && tcp.x<tc.maxx){ tc.cursoly=tc.miny;}
				else if(tcp.y>tc.miny){ tc.decTCY(2);}else{ flag=false;}
			}
			else if(ca == 'down'){
				if(tcp.y==tc.miny && tc.minx<tcp.x && tcp.x<tc.maxx){ tc.cursoly=tc.maxy;}
				else if(tcp.y<tc.maxy){ tc.incTCY(2);}else{ flag=false;}
			}
			else if(ca == 'left'){
				if(tcp.x==tc.maxx && tc.miny<tcp.y && tcp.y<tc.maxy){ tc.cursolx=tc.minx;}
				else if(tcp.x>tc.minx){ tc.decTCX(2);}else{ flag=false;}
			}
			else if(ca == 'right'){
				if(tcp.x==tc.minx && tc.miny<tcp.y && tcp.y<tc.maxy){ tc.cursolx=tc.maxx;}
				else if(tcp.x<tc.maxx){ tc.incTCX(2);}else{ flag=false;}
			}
			else{ flag=false;}

			if(flag){
				pc.paintEXcell(cc0);
				pc.paintEXcell(tc.getTCC());
				this.tcMoved = true;
			}

			return flag;
		};
	},

	flashlight : function(ec){
		area = new AreaInfo();
		for(var c=0;c<bd.cell.length;c++){ area.check[c]=0;}
		var ret = this.checkMirror1(ec, area);
		bd.setErrorEXcell([ec,ret.dest],6);
		for(var c=0;c<bd.cell.length;c++){ bd.setErrorCell([c],area.check[c]);}
		pc.paintAll();
	},

	adjustSpecial : function(type,key){
		um.disableRecord();
		if(type>=1 && type<=4){ // ���]�E��]�S��
			for(var c=0;c<bd.cell.length;c++){ if(bd.getQansCell(c)!=0){ bd.setQansCell(c,{1:2,2:1}[bd.getQansCell(c)]); } }
		}
		um.enableRecord();
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(127, 127, 127)";

		pc.errcolor1 = "rgb(192, 0, 0)";
		pc.errbcolor1 = "rgb(255, 160, 160)";
		pc.errbcolor2 = "rgb(255, 255, 127)";
		pc.dotcolor = "rgb(255, 96, 191)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);

			this.drawErrorCells_kinkonkan(x1,y1,x2,y2);
			this.drawTriangle(x1,y1,x2,y2);
			this.drawWhiteCells_kinkonkan(x1,y1,x2,y2);

			this.drawBDline(x1,y1,x2,y2);
			this.drawBorders(x1,y1,x2,y2);

			this.drawSlashes(x1,y1,x2,y2);

			this.drawEXcells(x1,y1,x2,y2);
			this.drawChassis(x1,y1,x2,y2);

			if(k.mode==1){ this.drawTCell(x1-1,y1-1,x2+1,y2+1);}else{ this.hideTCell();}
		};

		pc.drawErrorCells_kinkonkan = function(x1,y1,x2,y2){
			var clist = this.cellinside(x1,y1,x2,y2,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.getErrorCell(c)==1 || bd.getErrorCell(c)==6){
					if     (bd.getErrorCell(c)==1){ g.fillStyle = this.errbcolor1;}
					else if(bd.getErrorCell(c)==6){ g.fillStyle = this.errbcolor2;}
					if(this.vnop("c"+c+"_full_",1)){ g.fillRect(bd.cell[c].px(), bd.cell[c].py(), k.cwidth, k.cheight);}
				}
				else{ this.vhide("c"+c+"_full_");}
			}
			this.vinc();
		};
		pc.drawWhiteCells_kinkonkan = function(x1,y1,x2,y2){
			var dsize = k.cwidth*0.06;
			var clist = this.cellinside(x1,y1,x2,y2,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.getQsubCell(c)==1){
					g.fillStyle = this.dotcolor;
					g.beginPath();
					g.arc(bd.cell[c].px()+k.cwidth/2, bd.cell[c].py()+k.cheight/2, dsize, 0, Math.PI*2, false);
					if(this.vnop("c"+c+"_dot_",1)){ g.fill();}
				}
				else{ this.vhide("c"+c+"_dot_");}
			}
			this.vinc();
		}
		pc.drawSlashes = function(x1,y1,x2,y2){
			var clist = this.cellinside(x1,y1,x2,y2,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];

				this.vhide(["c"+c+"_sl1_","c"+c+"_sl2_"]);
				if(bd.getQansCell(c)!=-1){
					g.strokeStyle = this.Cellcolor;
					g.lineWidth = (int(k.cwidth/8)>=2?int(k.cwidth/8):2);

					if     (bd.getQansCell(c)==1 && this.vnop("c"+c+"_sl1_",0)){
						this.inputPath([bd.cell[c].px(),bd.cell[c].py(), 0,0, k.cwidth,k.cheight], true); g.stroke();
					}
					else if(bd.getQansCell(c)==2 && this.vnop("c"+c+"_sl2_",0)){
						this.inputPath([bd.cell[c].px(),bd.cell[c].py(), k.cwidth,0, 0,k.cheight], true); g.stroke();
					}
				}
			}
			this.vinc();
		};

		pc.drawEXcells = function(x1,y1,x2,y2){
			for(var cx=x1;cx<=x2;cx++){
				for(var cy=y1;cy<=y2;cy++){
					var c = bd.getexnum(cx,cy);
					if(c<0 || 2*k.qcols+2*k.qrows<=c){ continue;}

					if(bd.getErrorEXcell(c)==6){
						g.fillStyle = this.errbcolor2;
						if(this.vnop("ex"+c+"_full_",1)){ g.fillRect(bd.excell[c].px()+1, bd.excell[c].py()+1, k.cwidth-1, k.cheight-1);}
					}
					else{ this.vhide("ex"+c+"_full_");}

					if(bd.getDirecEXcell(c)==0 && bd.getQnumEXcell(c)==-1){
						if(bd.excell[c].numobj){ bd.excell[c].numobj.hide();}
					}
					else{
						if(!bd.excell[c].numobj){ bd.excell[c].numobj = this.CreateDOMAndSetNop();}
						var num=bd.getQnumEXcell(c), canum=bd.getDirecEXcell(c);

						var color = this.fontErrcolor;
						if(bd.getErrorEXcell(c)!=1){ color=(canum<=52?this.fontcolor:this.fontAnscolor);}

						var fontratio = 0.66;
						if(canum>0&&num>=10){ fontratio = 0.55;}

						var text="";
						if     (canum> 0&&canum<= 26){ text+=(canum+ 9).toString(36).toUpperCase();}
						else if(canum>26&&canum<= 52){ text+=(canum-17).toString(36).toLowerCase();}
						else if(canum>52&&canum<= 78){ text+=(canum-43).toString(36).toUpperCase();}
						else if(canum>78&&canum<=104){ text+=(canum-69).toString(36).toLowerCase();}
						if(num>=0){ text+=num.toString(10);}

						this.dispnumEXcell1(c, bd.excell[c].numobj, 1, text, fontratio, color);
					}
					//bd.getDirecEXcell(c)
				}
			}
			this.vinc();
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	pzlinput : function(type, bstr){
		if(type==0 || type==1){
			bstr = enc.decodeBorder(bstr);
			bstr = this.decodeKinkonkan(bstr);
		}
	},

	pzloutput : function(type){
		if(type==0)     { document.urloutput.ta.value = enc.getURLbase()+"?"+k.puzzleid+this.pzldata();}
		else if(type==1){ document.urloutput.ta.value = enc.getDocbase()+k.puzzleid+"/sa/m.html?"+this.pzldata();}
		else if(type==3){ document.urloutput.ta.value = enc.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
	},
	pzldata : function(){
		return "/"+k.qcols+"/"+k.qrows+"/"+enc.encodeBorder()+this.encodeKinkonkan();
	},

	//---------------------------------------------------------
	decodeKinkonkan : function(bstr){
		// �ՖʊO�����̃f�R�[�h
		var subint = new Array();
		var ec=0, a=0;
		for(var i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i);

			if     (enc.include(ca,'A','Z')){ bd.setDirecEXcell(ec, parseInt(ca,36)-9); subint.push(ec); ec++;}
			else if(enc.include(ca,'0','9')){ bd.setDirecEXcell(ec, (parseInt(bstr.charAt(i+1))+1)*26+parseInt(ca,36)-9); subint.push(ec); ec++; i++;}
			else if(enc.include(ca,'a','z')){ ec+=(parseInt(ca,36)-9);}
			else{ ec++;}

			if(ec >= bd.excell.length-4){ a=i+1; break;}
		}
		ec=0;
		for(var i=a;i<bstr.length;i++){
			var ca = bstr.charAt(i);
			if     (ca == '.'){ bd.setQnumEXcell(subint[ec], -2);                                   ec++;      }
			else if(ca == '-'){ bd.setQnumEXcell(subint[ec], parseInt(bstr.substring(i+1,i+3),16)); ec++; i+=2;}
			else              { bd.setQnumEXcell(subint[ec], parseInt(bstr.substring(i  ,i+1),16)); ec++;      }
			if(ec >= subint.length){ a=i+1; break;}
		}

		return bstr.substring(a,bstr.length);
	},
	encodeKinkonkan : function(type){
		var cm="", cm2="";

		// �ՖʊO�����̃G���R�[�h
		var count=0;
		for(var ec=0;ec<2*k.qcols+2*k.qrows;ec++){
			pstr = "";
			var val  = bd.getDirecEXcell(ec);
			var qnum = bd.getQnumEXcell(ec);

			if(val> 0 && val<=104){
				if(val<=26){ pstr = (val+9).toString(36).toUpperCase();}
				else       { pstr = int((val-1)/26-1).toString() + ((val-1)%26+10).toString(16).toUpperCase();}

				if     (qnum==-2){ cm2+=".";}
				else if(qnum <16){ cm2+=("" +qnum.toString(16));}
				else             { cm2+=("-"+qnum.toString(16));}
			}
			else{ count++;}

			if(count==0){ cm += pstr;}
			else if(pstr || count==26){ cm+=((9+count).toString(36)+pstr); count=0;}
		}
		if(count>0){ cm+=(9+count).toString(36);}

		return cm+cm2;
	},

	//---------------------------------------------------------
	decodeOthers : function(array){
		if(array.length<k.qrows+2){ return false;}
		var item = new Array();
		for(var i=0;i<array.length;i++){ item = item.concat( fio.retarray( array[i] ) );    }
		for(var i=0;i<item.length;i++) {
			if(item[i]=="."){ continue;}
			var ec = bd.getexnum(i%(k.qcols+2)-1,int(i/(k.qcols+2))-1);
			if(ec==-1){ continue;}

			var inp = item[i].split(",");
			if(inp[0]!=""){ bd.setDirecEXcell(ec, parseInt(inp[0]));}
			if(inp[1]!=""){ bd.setQnumEXcell (ec, parseInt(inp[1]));}
		}
		return true;
	},
	encodeOthers : function(){
		var str = "";
		for(var cy=-1;cy<=k.qrows;cy++){
			for(var cx=-1;cx<=k.qcols;cx++){
				var ec = bd.getexnum(cx,cy);
				if(ec==-1){ str+=". "; continue;}

				var str1 = (bd.getDirecEXcell(ec)==0?"":bd.getDirecEXcell(ec).toString());
				var str2 = (bd.getQnumEXcell(ec)==-1?"":bd.getQnumEXcell(ec).toString());
				if(str1=="" && str2==""){ str+= ". ";}
				else{ str += (""+str1+","+str2+" ");}
			}
			str += "/";
		}
		return str;
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	check : function(){

		var rarea = ans.searchRarea();
		if( !ans.checkOneNumber(rarea, function(top,lcnt){ return (lcnt>1);}, function(cc){ return bd.getQansCell(cc)>0;}) ){
			ans.setAlert('�ΐ������������ꂽ����������܂��B', 'A room has plural mirrors.'); return false;
		}

		if( !this.checkMirrors(1) ){
			ans.setAlert('�������������̏ꏊ�֓��B���܂���B', 'Beam from a light doesn\'t reach one\'s pair.'); return false;
		}

		if( !this.checkMirrors(2) ){
			ans.setAlert('���̔��ˉ񐔂�����������܂���B', 'The count of refrection is wrong.'); return false;
		}

		if( !ans.checkOneNumber(rarea, function(top,lcnt){ return (lcnt==0);}, function(cc){ return bd.getQansCell(cc)>0;}) ){
			ans.setAlert('�ΐ��̈�����Ă��Ȃ�����������܂��B', 'A room has no mirrors.'); return false;
		}

		return true;
	},

	checkMirrors : function(type){
		var d = new Array();
		for(var ec=0;ec<2*k.qcols+2*k.qrows;ec++){
			if(!isNaN(d[ec]) || bd.getQnumEXcell(ec)==-1 || bd.getDirecEXcell(ec)==0){ continue;}
			area = new AreaInfo();
			for(var c=0;c<bd.cell.length;c++){ area.check[c]=0;}

			var ret = this.checkMirror1(ec, area);
			if( (type==1&& (bd.getDirecEXcell(ec)!=bd.getDirecEXcell(ret.dest)) )||
				(type==2&&((bd.getQnumEXcell(ec)!=bd.getQnumEXcell(ret.dest)) || bd.getQnumEXcell(ec)!=ret.cnt))
			){
				for(var c=0;c<bd.excell.length;c++){ bd.setErrorEXcell([c],0);}
				bd.setErrorEXcell([ec,ret.dest],6);
				for(var c=0;c<bd.cell.length;c++){ bd.setErrorCell([c],area.check[c]);}
				return false;
			}
			d[ec]=1; d[ret.dest]=1;
		}
		return true;
	},
	checkMirror1 : function(startec, area){
		var ccnt=0;

		var cx=bd.excell[startec].cx, cy=bd.excell[startec].cy;
		var dir=0;
		if     (startec<  k.qcols)          { dir=2;}
		else if(startec<2*k.qcols)          { dir=1;}
		else if(startec<2*k.qcols+  k.qrows){ dir=4;}
		else if(startec<2*k.qcols+2*k.qrows){ dir=3;}

		while(dir!=0){
			switch(dir){ case 1: cy--; break; case 2: cy++; break; case 3: cx--; break; case 4: cx++; break;}
			var cc = bd.getcnum(cx,cy);
			if     (bd.getexnum(cx,cy)!=-1){ break;}
			else if(bd.getQansCell(cc)==1){
				ccnt++;
				if     (dir==1){ area.check[cc]=(!isNaN({4:1,6:1}[area.check[cc]])?6:2); dir=3;}
				else if(dir==2){ area.check[cc]=(!isNaN({2:1,6:1}[area.check[cc]])?6:4); dir=4;}
				else if(dir==3){ area.check[cc]=(!isNaN({2:1,6:1}[area.check[cc]])?6:4); dir=1;}
				else if(dir==4){ area.check[cc]=(!isNaN({4:1,6:1}[area.check[cc]])?6:2); dir=2;}
			}
			else if(bd.getQansCell(cc)==2){
				ccnt++;
				if     (dir==1){ area.check[cc]=(!isNaN({5:1,6:1}[area.check[cc]])?6:3); dir=4;}
				else if(dir==2){ area.check[cc]=(!isNaN({3:1,6:1}[area.check[cc]])?6:5); dir=3;}
				else if(dir==3){ area.check[cc]=(!isNaN({5:1,6:1}[area.check[cc]])?6:3); dir=2;}
				else if(dir==4){ area.check[cc]=(!isNaN({3:1,6:1}[area.check[cc]])?6:5); dir=1;}
			}
			else{ area.check[cc]=6;}

			if(ccnt>bd.cell.length){ break;} // �O�̂��߃K�[�h����(��������������Ȃ�)
		}

		return {cnt:ccnt, dest:bd.getexnum(cx,cy)};
	}
};
