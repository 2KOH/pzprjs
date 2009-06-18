//
// �p�Y���ŗL�X�N���v�g�� �}�C�i���Y���� minarism.js v3.1.9
//

function setting(){
	// �O���[�o���ϐ��̏����ݒ�
	if(!k.qcols){ k.qcols = 7;}	// �Ֆʂ̉���
	if(!k.qrows){ k.qrows = 7;}	// �Ֆʂ̏c��
	k.irowake = 0;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

	k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
	k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
	k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

	k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
	k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
	k.isborderCross   = 0;	// 1:������������p�Y��
	k.isCenterLine    = 0;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
	k.isborderAsLine  = 0;	// 1:���E����line�Ƃ��Ĉ���

	k.dispzero      = 0;	// 1:0��\�����邩�ǂ���
	k.isDispHatena  = 0;	// 1:qnum��-2�̂Ƃ��ɁH��\������
	k.isAnsNumber   = 1;	// 1:�񓚂ɐ�������͂���p�Y��
	k.isArrowNumber = 0;	// 1:������������͂���p�Y��
	k.isOneNumber   = 0;	// 1:�����̖��̐�����1��������p�Y��
	k.isDispNumUL   = 0;	// 1:�������}�X�ڂ̍���ɕ\������p�Y��(0�̓}�X�̒���)
	k.NumberWithMB  = 0;	// 1:�񓚂̐����Ɓ��~������p�Y��

	k.BlackCell     = 0;	// 1:���}�X����͂���p�Y��
	k.NumberIsWhite = 0;	// 1:�����̂���}�X�����}�X�ɂȂ�Ȃ��p�Y��
	k.RBBlackCell   = 0;	// 1:�A�����f�ւ̃p�Y��

	k.ispzprv3ONLY  = 0;	// 1:�ς��Ղ�v3�ɂ����Ȃ��p�Y��
	k.isKanpenExist = 0;	// 1:pencilbox/�J���y���ɂ���p�Y��

	k.fstruct = ["others", "cellqanssub"];

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
			base.setExpression("�@�L�[�{�[�h��}�E�X�Ő��������͂ł��܂��B",
							   " It is available to input number by keybord or mouse");
		}
		else{
			base.setExpression("�@�L�[�{�[�h�Ő�������сAQW�L�[�ŕs���������͂ł��܂��B�s�����̓}�E�X�̃h���b�O�ŁA�����̓N���b�N�ł����͂ł��܂��B",
							   " It is able to input number of question by keyboard, and 'QW' key to input inequality mark. It is also available to Left Button Drag to input inequality mark, to Click to input number.");
		}
		base.setTitle("�}�C�i���Y��","Minarism");
		base.setFloatbgcolor("rgb(96, 96, 96)");
	},
	menufix : function(){ },
	postfix : function(){
		menu.ex.adjustSpecial = this.adjustSpecial;

		tc.setAlign = function(){
			this.cursolx -= ((this.cursolx+1)%2);
			this.cursoly -= ((this.cursoly+1)%2);
		};
	},

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(k.mode==1 && this.btn.Left) this.inputmark1(x,y);
			else if(k.mode==3) this.inputqnum(x,y,Math.max(k.qcols,k.qrows));
		};
		mv.mouseup = function(x,y){
			if(k.mode==1 && this.notInputted()) this.inputmark(x,y);
		};
		mv.mousemove = function(x,y){
			if(k.mode==1 && this.btn.Left) this.inputmark1(x,y);
		};

		mv.inputmark1 = function(x,y){
			var pos = this.cellpos(new Pos(x,y));
			if(bd.getcnum(pos.x,pos.y)==-1){ return;}

			var id=-1;
			if     (pos.y-this.mouseCell.y==-1){ id=bd.getbnum(this.mouseCell.x*2+1,this.mouseCell.y*2  ); this.inputData=1; }
			else if(pos.y-this.mouseCell.y== 1){ id=bd.getbnum(this.mouseCell.x*2+1,this.mouseCell.y*2+2); this.inputData=2; }
			else if(pos.x-this.mouseCell.x==-1){ id=bd.getbnum(this.mouseCell.x*2  ,this.mouseCell.y*2+1); this.inputData=1; }
			else if(pos.x-this.mouseCell.x== 1){ id=bd.getbnum(this.mouseCell.x*2+2,this.mouseCell.y*2+1); this.inputData=2; }

			this.mouseCell = pos;
			if(id==-1){ return;}

			bd.setQuesBorder(id,(this.inputData!=bd.getQuesBorder(id)?this.inputData:0));
			pc.paintBorder(id);
		};
		mv.inputmark = function(x,y){
			var pos = this.crosspos(new Pos(x,y),0.33);
			if(pos.x<tc.minx || tc.maxx<pos.x || pos.y<tc.miny || tc.maxy<pos.y){ return;}
			var id = bd.getbnum(pos.x, pos.y);

			if(tc.cursolx!=pos.x || tc.cursoly!=pos.y){
				var tcx = tc.cursolx, tcy = tc.cursoly, flag = false;
				tc.setTCP(pos);
				pc.paint(int(tcx/2)-1, int(tcy/2)-1, int(tcx/2)+1, int(tcy/2)+1);
				pc.paint(int(pos.x/2)-1, int(pos.y/2)-1, int(pos.x/2), int(pos.y/2));
			}
			else if(id!=-1){
				this.inputbqnum(id);
				pc.paintBorder(id);
			}
		};
		mv.inputbqnum = function(id){
			var qnum = bd.getQnumBorder(id), qs = bd.getQuesBorder(id);
			if(this.btn.Left){
				if     (qnum==-1 && qs==0){ bd.setQnumBorder(id,-1); bd.setQuesBorder(id,1);}
				else if(qnum==-1 && qs==1){ bd.setQnumBorder(id,-1); bd.setQuesBorder(id,2);}
				else if(qnum==-1 && qs==2){ bd.setQnumBorder(id, 1); bd.setQuesBorder(id,0);}
				else if(qnum==Math.max(k.qcols,k.qrows)-1){ bd.setQnumBorder(id,-2); bd.setQuesBorder(id,0);}
				else if(qnum==-2)         { bd.setQnumBorder(id,-1); bd.setQuesBorder(id,0);}
				else{ bd.setQnumBorder(id,qnum+1);}
			}
			else if(this.btn.Right){
				if     (qnum==-1 && qs==0){ bd.setQnumBorder(id,-2); bd.setQuesBorder(id,0);}
				else if(qnum==-2)         { bd.setQnumBorder(id,Math.max(k.qcols,k.qrows)-1); bd.setQuesBorder(id,0);}
				else if(qnum== 1 && qs==0){ bd.setQnumBorder(id,-1); bd.setQuesBorder(id,2);}
				else if(qnum==-1 && qs==2){ bd.setQnumBorder(id,-1); bd.setQuesBorder(id,1);}
				else if(qnum==-1 && qs==1){ bd.setQnumBorder(id,-1); bd.setQuesBorder(id,0);}
				else{ bd.setQnumBorder(id,qnum-1);}
			}
			pc.paintBorder(id);
		},

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if     (k.mode==1 && this.moveTBorder(ca)){ return;}
			else if(k.mode==3 && this.moveTCell(ca)){ return;}

			if     (k.mode==1){ this.key_inputmark(ca);}
			else if(k.mode==3){ this.key_inputqnum(ca, Math.max(k.qcols,k.qrows));}
		};
		kc.key_inputmark = function(ca){
			var id = tc.getTBC();
			if(id==-1){ return false;}

			if     (ca=='q'){ bd.setQuesBorder(id,(bd.getQuesBorder(id)!=1?1:0)); bd.setQnumBorder(id,-1); }
			else if(ca=='w'){ bd.setQuesBorder(id,(bd.getQuesBorder(id)!=2?2:0)); bd.setQnumBorder(id,-1); }
			else if(ca=='e' || ca==' ' || ca=='-'){ bd.setQuesBorder(id,0); bd.setQnumBorder(id,-1); }
			else if('0'<=ca && ca<='9'){
				var num = parseInt(ca);
				var max = Math.max(k.qcols,k.qrows)-1;

				bd.setQuesBorder(id,0);
				if(bd.getQnumBorder(id)<=0 || this.prev!=id){ if(num<=max){ bd.setQnumBorder(id,num);}}
				else{
					if(bd.getQnumBorder(id)*10+num<=max){ bd.setQnumBorder(id,bd.getQnumBorder(id)*10+num);}
					else if(num<=max){ id.setQnumBorder(id,num);}
				}
			}
			else{ return false;}

			pc.paintBorder(id);
			return true;
		};
	},

	adjustSpecial : function(type,key){
		um.disableRecord();
		if(type>=1 && type<=4){ // ���]�E��]�S��
			for(var c=0;c<bd.border.length;c++){ if(bd.getQuesCell(c)!=0){ bd.setQuesCell(c,{1:2,2:1}[bd.getQuesCell(c)]); } }
		}
		um.enableRecord();
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(127, 127, 127)";
		pc.errbcolor1 = "rgb(255, 192, 192)";

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);

			this.drawBDMbase(x1,y1,x2,y2);

			this.drawErrorCells(x1,y1,x2,y2);
			this.drawBDline2(x1-1,y1-1,x2,y2);

			this.drawBDMarks(x1,y1,x2,y2);
			this.drawNumbers(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			if(k.mode==1){ this.drawTBorder(x1-1,y1-1,x2+1,y2+1);}else{ this.hideTBorder();}
			if(k.mode==3){ this.drawTCell(x1-1,y1-1,x2+1,y2+1);}else{ this.hideTCell();}
		};

		pc.drawBDMbase = function(x1,y1,x2,y2){
			if(g.vml){ return;}
			var csize = k.cwidth*0.29;
			var idlist = this.borderinside(x1*2-2,y1*2-2,x2*2+2,y2*2+2,f_true);
			for(var i=0;i<idlist.length;i++){
				var id = idlist[i];

				if(bd.getQuesBorder(id)!=0 || bd.getQnumBorder(id)!=-1){
					g.fillStyle = "white";
					g.fillRect(bd.border[id].px()-csize, bd.border[id].py()-csize, 2*csize+1, 2*csize+1);
				}
			}
		};
		pc.drawBDMarks = function(x1,y1,x2,y2){
			var csize = k.cwidth*0.27;
			var ssize = k.cwidth*0.22;
			var idlist = this.borderinside(x1*2-2,y1*2-2,x2*2+2,y2*2+2,f_true);
			for(var i=0;i<idlist.length;i++){
				var id = idlist[i];
				if(bd.getQnumBorder(id)!=-1){
					if(bd.getErrorCross(id)==1){ g.fillStyle = this.errcolor1;}
					else{ g.fillStyle = "white";}
					if(this.vnop("b"+id+"_cp1_",1)){
						g.beginPath();
						g.arc(bd.border[id].px(), bd.border[id].py(), csize, 0, Math.PI*2, false);
						g.fill();
					}

					g.lineWidth = 1;
					g.strokeStyle = "black";
					if(this.vnop("b"+id+"_cp2_",0)){
						if(k.br.IE){
							g.beginPath();
							g.arc(bd.border[id].px(), bd.border[id].py(), csize, 0, Math.PI*2, false);
						}
						g.stroke();
					}
				}
				else{ this.vhide(["b"+id+"_cp1_","b"+id+"_cp2_"]);}
				this.dispnumBorder(id);

				if(bd.getQuesBorder(id)!=0){
					var px=bd.border[id].px(); var py=bd.border[id].py();

					g.fillStyle = this.Cellcolor;
					if(bd.border[id].cx%2==1){
						if     (bd.getQuesBorder(id)==1){ if(this.vnop("b"+id+"_dt1_",1)){ this.inputPath([px,py ,-ssize, ssize ,0,-ssize ,ssize, ssize], false); g.stroke();} }
						else if(bd.getQuesBorder(id)==2){ if(this.vnop("b"+id+"_dt2_",1)){ this.inputPath([px,py ,-ssize,-ssize ,0,+ssize ,ssize,-ssize], false); g.stroke();} }
					}
					else if(bd.border[id].cy%2==1){
						if     (bd.getQuesBorder(id)==1){ if(this.vnop("b"+id+"_dt1_",1)){ this.inputPath([px,py , ssize,-ssize ,-ssize,0 , ssize,ssize], false); g.stroke();} }
						else if(bd.getQuesBorder(id)==2){ if(this.vnop("b"+id+"_dt2_",1)){ this.inputPath([px,py ,-ssize,-ssize , ssize,0 ,-ssize,ssize], false); g.stroke();} }
					}
				}
				else{ this.vhide(["b"+id+"_dt1_","b"+id+"_dt2_"]);}
			}
			this.vinc();
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	pzlinput : function(type, bstr){
		if(type==0 || type==1){ bstr = this.decodeMinarism(bstr, type);}
	},

	pzloutput : function(type){
		if(type==0)     { document.urloutput.ta.value = enc.getURLbase()+"?"+k.puzzleid+this.pzldata(0);}
		else if(type==1){ document.urloutput.ta.value = enc.getDocbase()+k.puzzleid+"/sa/m.html?"+this.pzldata(1);}
		else if(type==3){ document.urloutput.ta.value = enc.getURLbase()+"?m+"+k.puzzleid+this.pzldata(0);}
	},
	pzldata : function(type){
		if(type==null){ return "/"+k.qcols+"/"+k.qrows+"/"+this.encodeMinarism(0);}
		return "/"+k.qcols+"/"+k.qrows+"/"+this.encodeMinarism(type);
	},

	//---------------------------------------------------------
	decodeMinarism : function(bstr,type){
		// �ՖʊO�����̃f�R�[�h
		var id=0, a=0, mgn=0;
		for(var i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i);

			if(type==1){
				if     (id<k.qcols*k.qrows)  { mgn=int(id/k.qcols);}
				else if(id<2*k.qcols*k.qrows){ mgn=k.qrows;}
			}

			if     (enc.include(ca,'0','9')||enc.include(ca,'a','f')){ bd.setQnumBorder(id-mgn, parseInt(ca,16)); id++;}
			else if(ca=="-"){ bd.setQnumBorder(id-mgn, parseInt(bstr.substring(i+1,i+3),16)); id++; i+=2;}
			else if(ca=="g"){ bd.setQuesBorder(id-mgn, ((type==0 || id<k.qcols*k.qrows)?1:2)); id++;}
			else if(ca=="h"){ bd.setQuesBorder(id-mgn, ((type==0 || id<k.qcols*k.qrows)?2:1)); id++;}
			else if(enc.include(ca,'i','z')){ id+=(parseInt(ca,36)-17);}
			else if(ca=="."){ bd.setQnumBorder(id-mgn,-2); id++;}
			else if(type==1 && ca=="/"){ id=k.qcols*k.qrows;}
			else{ id++;}

			if(id >= 2*k.qcols*k.qrows){ a=i+1; break;}
		}
		return bstr.substring(a,bstr.length);
	},
	encodeMinarism : function(type){
		var cm="", count=0, mgn=0;
		for(var id=0;id<bd.border.length+(type==0?0:k.qcols);id++){
			if(type==1){
				if(id>0 && id<=(k.qcols-1)*k.qrows && id%(k.qcols-1)==0){ count++;}
				if(id==(k.qcols-1)*k.qrows){ if(count>0){ cm+=(17+count).toString(36); count=0;} cm += "/";}
			}

			if(id<bd.border.length){
				var pstr = "";
				var val  = bd.getQuesBorder(id);
				var qnum = bd.getQnumBorder(id);

				if     (val == 1){ pstr = ((type==0 || id<k.qcols*k.qrows)?"g":"h");}
				else if(val == 2){ pstr = ((type==0 || id<k.qcols*k.qrows)?"h":"g");}
				else if(qnum==-2){ pstr = ".";}
				else if(qnum>= 0 && qnum< 16){ pstr = ""+ qnum.toString(16);}
				else if(qnum>=16 && qnum<256){ pstr = "-"+qnum.toString(16);}
				else{ count++;}
			}
			else{ count++;}

			if(count==0){ cm += pstr;}
			else if(pstr||count==18){ cm+=((17+count).toString(36)+pstr); count=0;}
		}
		if(count>0){ cm+=(17+count).toString(36);}
		return cm;
	},

	//---------------------------------------------------------
	decodeOthers : function(array){
		if(array.length<2*k.qrows-1){ return false;}
		fio.decodeBorder( function(c,ca){
			if     (ca=="a"){ bd.setQuesBorder(c, 1);}
			else if(ca=="b"){ bd.setQuesBorder(c, 2);}
			else if(ca=="."){ bd.setQnumBorder(c, -2);}
			else if(ca!="0"){ bd.setQnumBorder(c, parseInt(ca));}
		},array.slice(0,2*k.qrows-1));
		return true;
	},
	encodeOthers : function(){
		return fio.encodeBorder( function(c){
			if     (bd.getQuesBorder(c)== 1){ return "a ";}
			else if(bd.getQuesBorder(c)== 2){ return "b ";}
			else if(bd.getQnumBorder(c)==-2){ return ". ";}
			else if(bd.getQnumBorder(c)!=-1){ return ""+bd.getQnumBorder(c).toString()+" ";}
			else                            { return "0 ";}
		});
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	check : function(){

		if( !this.checkRowsCols() ){
			ans.setAlert('������ɓ��������������Ă��܂��B','There are same numbers in a row.'); return false;
		}

		if( !this.checkBDnumber() ){
			ans.setAlert('�ەt�������Ƃ��̗����̐����̍�����v���Ă��܂���B', 'The Difference between two Adjacent cells is not equal to the number on circle.'); return false;
		}

		if( !this.checkBDmark() ){
			ans.setAlert('�s�����Ɛ������������Ă��܂��B', 'A inequality sign is not correct.'); return false;
		}

		if( !ans.checkAllCell(function(c){ return (bd.getQansCell(c)==-1);}) ){
			ans.setAlert('�����̓����Ă��Ȃ��}�X������܂��B','There is a empty cell.'); return false;
		}

		return true;
	},
	check1st : function(){ return ans.checkAllCell(function(c){ return (bd.getQansCell(c)==-1);});},

	checkRowsCols : function(){
		var cx, cy;

		for(var cy=0;cy<k.qrows;cy++){
			var clist = new Array();
			for(var cx=0;cx<k.qcols;cx++){ clist.push(bd.getcnum(cx,cy));}
			if(!this.checkDifferentNumberInClist(clist)){ return false;}
		}
		for(var cx=1;cx<k.qcols;cx++){
			var clist = new Array();
			for(var cy=0;cy<k.qrows;cy++){ clist.push(bd.getcnum(cx,cy));}
			if(!this.checkDifferentNumberInClist(clist)){ return false;}
		}
		return true;
	},
	checkDifferentNumberInClist : function(clist){
		var d = new Array();
		for(var i=1;i<=Math.max(k.qcols,k.qrows);i++){ d[i]=-1;}
		for(var i=0;i<clist.length;i++){
			var val=bd.getQansCell(clist[i]);
			if     (val==-1){ continue;}
			else if(d[val]==-1){ d[val] = bd.getQansCell(clist[i]); continue;}

			for(var j=0;j<clist.length;j++){ if(bd.getQansCell(clist[j])==val){ bd.setErrorCell([clist[j]],1);} }
			return false;
		}
		return true;
	},

	checkBDnumber : function(){
		return this.checkBDSideCell(function(id,c1,c2){
			return (bd.getQnumBorder(id)>0 && bd.getQnumBorder(id)!=Math.abs(bd.getQansCell(c1)-bd.getQansCell(c2)));
		});
	},
	checkBDmark : function(){
		return this.checkBDSideCell(function(id,c1,c2){
			var mark = bd.getQuesBorder(id);
			var a1 = bd.getQansCell(c1), a2 = bd.getQansCell(c2);
			return !(mark==0 || (mark==1 && a1<a2) || (mark==2 && a1>a2));
		});
	},
	checkBDSideCell : function(func){
		for(var id=0;id<bd.border.length;id++){
			var cc1 = bd.getcnum(int((bd.border[id].cx-(bd.border[id].cy%2))/2), int((bd.border[id].cy-(bd.border[id].cx%2))/2) );
			var cc2 = bd.getcnum(int((bd.border[id].cx+(bd.border[id].cy%2))/2), int((bd.border[id].cy+(bd.border[id].cx%2))/2) );
			if(bd.getQansCell(cc1)>0 && bd.getQansCell(cc2)>0 && func(id,cc1,cc2)){ bd.setErrorCell([cc1,cc2],1); return false;}
		}
		return true;
	}
};
