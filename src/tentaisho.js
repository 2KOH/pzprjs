//
//s �p�Y���ŗL�X�N���v�g�� �V�̃V���[�� tentaisho.js v3.1.9p3
//

function setting(){
	// �O���[�o���ϐ��̏����ݒ�
	if(!k.qcols){ k.qcols = 10;}	// �Ֆʂ̉���
	if(!k.qrows){ k.qrows = 10;}	// �Ֆʂ̏c��
	k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

	k.iscross      = 1;		// 1:Cross������\�ȃp�Y��
	k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
	k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

	k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
	k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
	k.isborderCross   = 0;	// 1:������������p�Y��
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

	k.fstruct = ["others","borderans","cellqsub"];

	//k.def_csize = 36;
	//k.def_psize = 24;
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
			base.setExpression("�@�����N���b�N����ƐF���ʂ�܂��B",
							   " Click star to paint.");
		}
		else{
			base.setExpression("�@���쐬���[�h���ɁA�}�E�X�̉E�{�^���ŉ��G��`�����Ƃ��o���܂��B���̔w�i�F�́u�����N���b�N�v��u�F������v�{�^���ŏ㏑������܂��B",
							   " In edit mode, it is able to paint a design by Right Click. This background color is superscripted by clicking star or pressing 'Color up' button.");
		}
		base.setTitle("�V�̃V���[","Tentaisho");
		base.setFloatbgcolor("rgb(0, 224, 0)");
	},
	menufix : function(){
		if(k.callmode=='pmake'){
			pp.addCheckToFlags('discolor','setting',false);
			pp.setMenuStr('discolor', '�F����������', 'Disable color');
			pp.setLabel  ('discolor', '���N���b�N�ɂ��F�����𖳌�������', 'Disable Coloring up by clicking star');
		}

		$("#btnarea").append("<input type=\"button\" id=\"btncolor\" value=\"�F������\" onClick=\"javascript:puz.encolorall();\">");
		menu.addButtons($("#btncolor").unselectable(),"�F������","Color up");
	},
	postfix : function(){ },

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(k.mode==1){
				if(this.btn.Left) this.inputstar(x,y);
				else if(this.btn.Right) this.inputBGcolor1(x,y);
			}
			else if(k.mode==3){
				if(this.btn.Left) this.inputborder_tentaisho(x,y);
				else if(this.btn.Right) this.inputQsubLine(x,y);
			}
		};
		mv.mouseup = function(x,y){
			if(k.mode==3 && this.notInputted()) this.inputBGcolor3(x,y);
		};
		mv.mousemove = function(x,y){
			if(k.mode==1){
				if(this.btn.Right) this.inputBGcolor1(x,y);
			}
			else if(k.mode==3){
				if(this.btn.Left) this.inputborder_tentaisho(x,y);
				else if(this.btn.Right) this.inputQsubLine(x,y);
			}
		};

		mv.inputBGcolor1 = function(x,y){
			var cc = this.cellid(new Pos(x,y));
			if(cc==-1 || cc==this.mouseCell){ return;}
			if(this.inputData==-1){
				if     (bd.getQsubCell(cc)==0){ this.inputData=3;}
				else                          { this.inputData=0;}
			}
			bd.setQsubCell(cc, this.inputData);
			this.mouseCell = cc; 
			pc.paint(bd.cell[cc].cx, bd.cell[cc].cy, bd.cell[cc].cx, bd.cell[cc].cy);
		};
		mv.inputBGcolor3 = function(x,y){
			if(k.callmode=='pmake'){ if(menu.getVal('discolor')){ return;} }

			var pos = this.crosspos(new Pos(x,y), 0.34);
			var id = puz.getsnum(pos.x, pos.y);
			if(id==-1 || puz.getStar(id)==0){ return;}

			var cc;
			var sx=id%(2*k.qcols-1)+1;
			var sy=int(id/(2*k.qcols-1))+1;
			if     (sx%2==1 && sy%2==1){ cc = bd.getcnum(int(sx/2),int(sy/2));}
			else if(sx%2==0 && sy%2==0){
				var xc = bd.getxnum(int(sx/2),int(sy/2));
				if(ans.lcnts.cell[xc]==0){ cc = bd.getcnum(int(sx/2)-1,int(sy/2)-1);}
				else{ return;}
			}
			else{
				if(bd.getQansBorder(bd.getbnum(sx,sy))==0){ cc = bd.getcnum(int((sx-sy%2)/2), int((sy-sx%2)/2));}
				else{ return;}
			}

			var area = puz.getClist(cc);
			if(puz.encolor(area,1)){
				var d = ans.getSizeOfArea(area,1,f_true);
				pc.paint(d.x1, d.y1, d.x2, d.y2);
			}
		};
		mv.inputborder_tentaisho = function(x,y){
			var pos = this.crosspos(new Pos(x,y), 0.34);
			if(pos.x==this.mouseCell.x && pos.y==this.mouseCell.y){ return;}

			var id = bd.getbnum(pos.x, pos.y);
			if(id==-1 && this.mouseCell.x){ id = bd.getbnum(this.mouseCell.x, this.mouseCell.y);}

			if(this.mouseCell!=-1 && id!=-1){
				if((pos.x%2==0 && this.mouseCell.x==pos.x && Math.abs(this.mouseCell.y-pos.y)==1) ||
				   (pos.y%2==0 && this.mouseCell.y==pos.y && Math.abs(this.mouseCell.x-pos.x)==1) )
				{
					this.mouseCell=-1

					if(this.inputData==-1){ this.inputData=(bd.getQansBorder(id)==0?1:0);}
					if(this.inputData!=-1){
						bd.setQansBorder(id, this.inputData);
						pc.paintBorder(id);
					}
				}
			}
			this.mouseCell = pos;
		};
		mv.inputstar = function(x,y){
			var pos = this.crosspos(new Pos(x,y), 0.25);
			if(pos.x==this.mouseCell.x && pos.y==this.mouseCell.y){ return;}

			var id = puz.getsnum(pos.x, pos.y);
			if(id==-1 && this.mouseCell.x){ id = puz.getsnum(this.mouseCell.x, this.mouseCell.y);}

			if(id!=-1){
				if(this.btn.Left)      { puz.setStar(id, {0:1,1:2,2:0}[puz.getStar(id)]);}
				else if(this.btn.Right){ puz.setStar(id, {0:2,1:0,2:1}[puz.getStar(id)]);}
			}
			this.mouseCell = pos;
			pc.paint(int((pos.x-1)/2),int((pos.y-1)/2),int((pos.x+1)/2),int((pos.y+1)/2));
		};

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){ };

		// �ꕔqsub�ŏ��������Ȃ����̂����邽�ߏ㏑��
		base.ASconfirm = function(){
			if(confirm("�⏕�L�����������܂����H")){
				um.chainflag=0;
				for(i=0;i<k.qcols*k.qrows;i++){
					if(bd.getQsubCell(i)==1){ um.addOpe('cell','qsub',i,bd.getQsubCell(i),0);}
				}
				if(k.isborder){
					for(i=0;i<bd.border.length;i++){
						if(bd.getQsubBorder(i)!=0){ um.addOpe('border','qsub',i,bd.getQsubBorder(i),0);}
					}
				}
				if(!g.vml){ pc.flushCanvasAll();}

				$.each(bd.cell,   function(i,cell)  { cell.error=0; if(cell.qsub==1){ cell.qsub=0;} });
				$.each(bd.border, function(i,border){ border.error=0; border.qsub=0;});

				pc.paint(0,0,k.qcols-1,k.qrows-1);
			}
		};
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(127, 127, 127)";

		pc.BorderQanscolor = "rgb(72, 72, 72)";

		pc.qsubcolor1 = "rgb(176,255,176)";
		pc.qsubcolor2 = "rgb(108,108,108)";
		pc.qsubcolor3 = "rgb(192,192,192)";

		pc.errbcolor1 = "rgb(255,127,127)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawQSubCells(x1,y1,x2,y2);

			this.drawBDline2(x1,y1,x2,y2);

			this.drawBorderAnswers(x1,y1,x2,y2);
			this.drawBorderQsubs(x1,y1,x2,y2);

			this.drawStars(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);
		};

		pc.drawBorderAnswers = function(x1,y1,x2,y2){
			var lw = this.lw, lm = this.lm;

			var idlist = this.borderinside(x1*2-2,y1*2-2,x2*2+2,y2*2+2,f_true);
			for(var i=0;i<idlist.length;i++){
				var id = idlist[i];
				if(bd.getQansBorder(id)==1){
					if     (bd.getErrorBorder(id)==1){ g.fillStyle = this.errcolor1;}
					else if(bd.getErrorBorder(id)==2){ g.fillStyle = this.errBorderQanscolor2;}
					else{ g.fillStyle = this.BorderQanscolor;}

					if     (bd.border[id].cy%2==1){ if(this.vnop("b"+id+"_bd_",1)){ g.fillRect(bd.border[id].px()-lm,                 bd.border[id].py()-int(k.cheight/2)-lm, lw         , k.cheight+lw);} }
					else if(bd.border[id].cx%2==1){ if(this.vnop("b"+id+"_bd_",1)){ g.fillRect(bd.border[id].px()-int(k.cwidth/2)-lm, bd.border[id].py()-lm                 , k.cwidth+lw, lw          );} }
				}
				else{ this.vhide("b"+id+"_bd_");}
			}
			this.vinc();
		};
		pc.drawStars = function(x1,y1,x2,y2){
			var rsize  = k.cwidth*0.18;
			var rsize2 = k.cwidth*0.14;

			for(var y=2*y1-2;y<=2*y2+2;y++){
				if(y<=0 || 2*k.qrows<=y){ continue;}
				for(var x=2*x1-2;x<=2*x2+2;x++){
					if(x<=0 || 2*k.qcols<=x){ continue;}
					var id = puz.getsnum(x,y);
					if(puz.getStar(id)==1 || puz.getStar(id)==2){
						if(puz.getStarError(id)){ g.fillStyle=this.errcolor1;}
						else{ g.fillStyle = "black";}
						g.beginPath();
						g.arc(k.p0.x+x*k.cwidth/2, k.p0.y+y*k.cheight/2, rsize , 0, Math.PI*2, false);
						if(this.vnop("s"+id+"_star41a_",1)){ g.fill(); }
					}
					else{ this.vhide("s"+id+"_star41a_");}
					if(puz.getStar(id)==1){
						g.fillStyle = "white";
						g.beginPath();
						g.arc(k.p0.x+x*k.cwidth/2, k.p0.y+y*k.cheight/2, rsize2, 0, Math.PI*2, false);
						if(this.vnop("s"+id+"_star41b_",1)){ g.fill(); }
					}
					else{ this.vhide("s"+id+"_star41b_");}
				}
			}
			this.vinc();
		};
	},

	encolorall : function(){
		var area = ans.searchRLarea(function(id){ return (id!=-1 && bd.getQansBorder(id)==0); }, false);
		for(var id=1;id<=area.max;id++){ this.encolor(area,id);}
		pc.paintAll();
	},
	encolor : function(area,id){
		var ret = this.getStar(this.getInsideStar(area,id));

		var flag = false;
		for(var i=0;i<area.room[id].length;i++){
			var c = area.room[id][i];
			if(k.callmode=="pmake" && bd.getQsubCell(c)==3 && ret!=2){ continue;}
			else if(bd.getQsubCell(c)!=(ret>0?ret:0)){
				bd.setQsubCell(c,(ret>0?ret:0));
				flag = true;
			}
		}
		return flag;
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	pzlinput : function(type, bstr){
		if(type==0 || type==1){ bstr = this.decodeStar(bstr);}
		else if(type==2){ bstr = this.decodeKanpen(bstr);}
	},
	decodeStar : function(bstr){
		var s=0;
		for(var i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i);
			if(enc.include(ca,"0","f")){
				var val = parseInt(ca,16);
				this.setStar(s,val%2+1);
				s+=(int(val/2)+1);
			}
			else if(enc.include(ca,"g","z")){ s+=(parseInt(ca,36)-15);}

			if(s>=(2*k.qcols-1)*(2*k.qrows-1)){ break;}
		}
		return bstr.substring(i+1,bstr.length);
	},
	decodeKanpen : function(bstr){
		var array = bstr.split("/");
		var c=0;
		for(var i=0;i<array.length;i++){
			for(var s=0;s<array[i].length;s++){
				if     (array[i].charAt(s) == "1"){ puz.setStar(c, 1);}
				else if(array[i].charAt(s) == "2"){ puz.setStar(c, 2);}
				c++;
			}
		}
		return "";
	},

	pzloutput : function(type){
		if(type==0)     { document.urloutput.ta.value = enc.getURLbase()+"?"+k.puzzleid+this.pzldata();}
		else if(type==1){ document.urloutput.ta.value = enc.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
		else if(type==2){ document.urloutput.ta.value = enc.kanpenbase()+"tentaisho.html?problem="+this.pzldataKanpen();}
		else if(type==3){ document.urloutput.ta.value = enc.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
	},
	pzldata : function(){
		return "/"+k.qcols+"/"+k.qrows+"/"+this.encodeStar();
	},
	encodeStar : function(){
		var count = 0;
		var cm = "";

		for(var s=0;s<(2*k.qcols-1)*(2*k.qrows-1);s++){
			var pstr = "";
			if(this.getStar(s)>0){
				for(var i=0;i<=6;i++){
					if(this.getStar(s+i+1)>0){ pstr=""+(2*i+(this.getStar(s)-1)).toString(16); s+=i; break;}
				}
				if(pstr==""){ pstr=(13+this.getStar(s)).toString(16); s+=7;}
			}
			else{ pstr=" "; count++;}

			if(count==0)      { cm += pstr;}
			else if(pstr!=" "){ cm += ((count+15).toString(36)+pstr); count=0;}
			else if(count==20){ cm += "z"; count=0;}
		}
		if(count>0){ cm += ((count+15).toString(36));}

		return cm;
	},
	pzldataKanpen : function(){
		var bstr = "";
		for(var i=0;i<(2*k.qcols-1)*(2*k.qrows-1);i++){
			if(i%(2*k.qcols-1)==0){ bstr += "/";}
			if     (puz.getStar(i)==1){ bstr += "1";}
			else if(puz.getStar(i)==2){ bstr += "2";}
			else                      { bstr += ".";}
		}
		return ""+k.qrows+"/"+k.qcols+bstr;
	},

	//---------------------------------------------------------
	decodeOthers : function(array){
		if(array.length<2*k.qrows-1){ return false;}
		var c=0;
		for(var i=0;i<array.length;i++){
			for(var s=0;s<array[i].length;s++){
				if     (array[i].charAt(s) == "1"){ puz.setStar(c, 1);}
				else if(array[i].charAt(s) == "2"){ puz.setStar(c, 2);}
				c++;
			}
		}
		return true;
	},
	encodeOthers : function(){
		var bstr = this.pzldataKanpen();
		var barray = bstr.split("/");
		barray.shift(); barray.shift();
		return (""+barray.join("/")+"/");
	},

	//---------------------------------------------------------
	kanpenOpen : function(array){
		var barray = array.slice(0,2*k.qrows-1);
		this.decodeKanpen(""+barray.join("/"));

		barray = array.slice(2*k.qrows,3*k.qrows);
		var carray = new Array();
		for(var a=0;a<barray.length;a++){
			var arr = barray[a].split(" ");
			for(var i=0;i<arr.length;i++){ if(arr[i]!=''){ carray.push(arr[i]);} }
		}
		this.decodeBorder(carray);
	},
	decodeBorder : function(array){
		var id;
		for(id=0;id<bd.border.length;id++){
			var cc1 = bd.getcnum(int((bd.border[id].cx-(bd.border[id].cy%2))/2), int((bd.border[id].cy-(bd.border[id].cx%2))/2) );
			var cc2 = bd.getcnum(int((bd.border[id].cx+(bd.border[id].cy%2))/2), int((bd.border[id].cy+(bd.border[id].cx%2))/2) );

			if(cc1!=-1 && cc2!=-1 && array[cc1]!=array[cc2]){ bd.setQansBorder(id,1);}
			else{ bd.setQansBorder(id,0);}
		}
	},
	kanpenSave : function(){
		var barray = this.pzldataKanpen().split("/");
		barray.shift(); barray.shift();

		var rarea = ans.searchRLarea(function(id){ return (id!=-1 && bd.getQansBorder(id)==0); }, false);
		var bstr =  barray.join("/")+"/"+rarea.max+"/";
		for(var c=0;c<bd.cell.length;c++){
			bstr += (""+(rarea.check[c]-1)+" ");
			if((c+1)%k.qcols==0){ bstr += "/";}
		}
		return bstr;
	},
	//---------------------------------------------------------
	// ���𔻒菈�����s��
	check : function(){

		if( !this.checkLineOnStar() ){
			ans.setAlert('��������ʉ߂��Ă��܂��B', 'A line goes over the star.'); return false;
		}

		var rarea = ans.searchRLarea(function(id){ return (id!=-1 && bd.getQansBorder(id)==0); }, false);
		this.checkAreaStar(rarea);
		if( !this.checkErrorFlag(rarea, -1) ){
			ans.setAlert('�����܂܂�Ă��Ȃ��̈悪����܂��B','A block has no stars.'); return false;
		}

		if( !this.checkFractal(rarea) ){
			ans.setAlert('�̈悪���𒆐S�ɓ_�Ώ̂ɂȂ��Ă��܂���B', 'A area is not point symmetric about the star.'); return false;
		}

		if( !this.checkErrorFlag(rarea, -2) ){
			ans.setAlert('���������܂܂��̈悪����܂��B','A block has two or more stars.'); return false;
		}

		return true;
	},

	checkLineOnStar : function(){
		for(var s=0;s<(2*k.qcols-1)*(2*k.qrows-1);s++){
			if(this.getStar(s)<=0){ continue;}
			var sx=s%(2*k.qcols-1)+1, sy=int(s/(2*k.qcols-1))+1;
			if(sx%2==0 && sy%2==0){
				if(ans.lcnts.cell[bd.getxnum(int(sx/2),int(sy/2))]!=0){
					ans.setCrossBorderError(int(sx/2),int(sy/2));
					return false;
				}
			}
			else if((sx+sy)%2==1){
				if(bd.getQansBorder(bd.getbnum(sx,sy))!=0){
					bd.setErrorBorder(bd.getbnum(sx,sy),1);
					return false;
				}
			}
		}
		return true;
	},

	checkFractal : function(area){
		for(var id=1;id<=area.max;id++){
			var sc = area.starid[id];
			if(sc<0){ continue;}
			var sx=sc%(2*k.qcols-1)+1, sy=int(sc/(2*k.qcols-1))+1;
			var movex=0, movey=0;
			for(var i=0;i<area.room[id].length;i++){
				var c=area.room[id][i];
				var ccopy = bd.getcnum(sx-bd.cell[c].cx-1, sy-bd.cell[c].cy-1);
				if(ccopy==-1||area.check[c]!=area.check[ccopy]){
					bd.setErrorCell(area.room[id],1); return false;
				}
			}
		}
		return true;
	},

	checkAreaStar : function(area){
		area.starid = new Array();
		for(var id=1;id<=area.max;id++){
			area.starid[id] = this.getInsideStar(area,id);
		}
	},
	checkErrorFlag : function(area, val){
		for(var id=1;id<=area.max;id++){
			if(area.starid[id]==val){ bd.setErrorCell(area.room[id],1); return false;}
		}
		return true;
	},

	getsnum : function(sx,sy){
		if(sx<=0 || 2*k.qcols<=sx || sy<=0 || 2*k.qrows<=sy){ return -1;}
		return ((sx-1)+(sy-1)*(2*k.qcols-1));
	},
	getStar : function(id){
		if(id<0||(2*k.qcols-1)*(2*k.qrows-1)<id){ return -1;}
		var sx=id%(2*k.qcols-1)+1;
		var sy=int(id/(2*k.qcols-1))+1;

		if     (sx%2==1 && sy%2==1){ return bd.getQuesCell(bd.getcnum(int(sx/2),int(sy/2)));}
		else if(sx%2==0 && sy%2==0){ return bd.getQuesCross(bd.getxnum(int(sx/2),int(sy/2)));}
		else                       { return bd.getQuesBorder(bd.getbnum(sx,sy));}
	},
	getStarError : function(id){
		if(id<0||(2*k.qcols-1)*(2*k.qrows-1)<id){ return -1;}
		var sx=id%(2*k.qcols-1)+1;
		var sy=int(id/(2*k.qcols-1))+1;

		if     (sx%2==1 && sy%2==1){ return bd.getErrorCell(bd.getcnum(int(sx/2),int(sy/2)));}
		else if(sx%2==0 && sy%2==0){ return bd.getErrorCross(bd.getxnum(int(sx/2),int(sy/2)));}
		else                       { return bd.getErrorBorder(bd.getbnum(sx,sy));}
	},
	setStar : function(id,val){
		if(id<0||(2*k.qcols-1)*(2*k.qrows-1)<id){ return;}
		var sx=id%(2*k.qcols-1)+1;
		var sy=int(id/(2*k.qcols-1))+1;

		if     (sx%2==1 && sy%2==1){ return bd.setQuesCell(bd.getcnum(int(sx/2),int(sy/2)),val);}
		else if(sx%2==0 && sy%2==0){ return bd.setQuesCross(bd.getxnum(int(sx/2),int(sy/2)),val);}
		else                       { return bd.setQuesBorder(bd.getbnum(sx,sy),val);}
	},

	getInsideStar : function(area,id){
		var cnt=0, ret=-1;
		for(var i=0;i<area.room[id].length;i++){
			var c=area.room[id][i];
			var cx = bd.cell[c].cx, cy = bd.cell[c].cy;
			if(this.getStar(this.getsnum(cx*2+1,cy*2+1))>0){
				cnt++; ret=this.getsnum(cx*2+1,cy*2+1);
			}
			if(bd.cell[c].db()!=-1 && bd.getQansBorder(bd.cell[c].db())==0 && this.getStar(this.getsnum(cx*2+1,cy*2+2))>0){
				cnt++; ret=this.getsnum(cx*2+1,cy*2+2);
			}
			if(bd.cell[c].rb()!=-1 && bd.getQansBorder(bd.cell[c].rb())==0 && this.getStar(this.getsnum(cx*2+2,cy*2+1))>0){
				cnt++; ret=this.getsnum(cx*2+2,cy*2+1);
			}
			if(bd.getxnum(cx+1,cy+1)!=-1 && ans.lcnts.cell[bd.getxnum(cx+1,cy+1)]==0 && this.getStar(this.getsnum(cx*2+2,cy*2+2))>0){
				cnt++; ret=this.getsnum(cx*2+2,cy*2+2);
			}

			if(cnt>1){ return -2;}
		}
		return ret;
	},
	getClist : function(cc){
		var area = new AreaInfo();
		var func = function(id){ return (id!=-1 && bd.getQansBorder(id)!=1); }
		for(var c=0;c<bd.cell.length;c++){ area.check[c]=-1;}
		area.max=1;
		area.room[1]=new Array();
		this.gc0(func, area, cc);
		return area;
	},
	gc0 : function(func, area, i){
		if(i==-1 || area.check[i]!=-1){ return;}
		area.check[i] = 1;
		area.room[1].push(i);
		if( func(bd.cell[i].ub()) ){ arguments.callee(func, area, bd.cell[i].up());}
		if( func(bd.cell[i].db()) ){ arguments.callee(func, area, bd.cell[i].dn());}
		if( func(bd.cell[i].lb()) ){ arguments.callee(func, area, bd.cell[i].lt());}
		if( func(bd.cell[i].rb()) ){ arguments.callee(func, area, bd.cell[i].rt());}
		return;
	}
};
