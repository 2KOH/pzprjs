//
// �p�Y���ŗL�X�N���v�g�� ����������� hashikake.js v3.1.9p3
//

function setting(){
	// �O���[�o���ϐ��̏����ݒ�
	if(!k.qcols){ k.qcols = 9;}	// �Ֆʂ̉���
	if(!k.qrows){ k.qrows = 9;}	// �Ֆʂ̏c��
	k.irowake = 1;			// 0:�F�����ݒ薳�� 1:�F�������Ȃ� 2:�F��������

	k.iscross      = 0;		// 1:Cross������\�ȃp�Y��
	k.isborder     = 1;		// 1:Border/Line������\�ȃp�Y��
	k.isextendcell = 0;		// 1:��E�����ɃZ����p�ӂ���p�Y�� 2:�l���ɃZ����p�ӂ���p�Y��

	k.isoutsidecross  = 0;	// 1:�O�g���Cross�̔z�u������p�Y��
	k.isoutsideborder = 0;	// 1:�Ֆʂ̊O�g���border��ID��p�ӂ���
	k.isborderCross   = 0;	// 1:������������p�Y��
	k.isCenterLine    = 1;	// 1:�}�X�̐^�񒆂�ʂ�����񓚂Ƃ��ē��͂���p�Y��
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

	k.fstruct = ["cellqnum","borderline"];

	//k.def_csize = 36;
	k.def_psize = 16;
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

		base.setTitle("����������","Bridges");
		base.setExpression("�@���{�^���Ő����A�E�{�^���Ł~�����͂ł��܂��B",
						   " Left Button Drag to inpur lines, Right to input a cross.");
		base.setFloatbgcolor("rgb(127, 191, 0)");
	},
	menufix : function(){ },
	postfix : function(){ },

	//---------------------------------------------------------
	//���͌n�֐��I�[�o�[���C�h
	input_init : function(){
		// �}�E�X���͌n
		mv.mousedown = function(x,y){
			if(k.mode==1){
				if(!kp.enabled()){ this.inputqnum(x,y,8);}
				else{ kp.display(x,y);}
			}
			else if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};
		mv.mouseup = function(x,y){ };
		mv.mousemove = function(x,y){
			if(k.mode==3){
				if(this.btn.Left) this.inputLine(x,y);
				else if(this.btn.Right) this.inputpeke(x,y);
			}
		};

		mv.inputLine = function(x,y){
			var pos = this.cellpos(new Pos(x,y));
			if(pos.x==this.mouseCell.x && pos.y==this.mouseCell.y){ return;}

			var id = -1;
			if     (pos.y-this.mouseCell.y==-1){ id=bd.getbnum(this.mouseCell.x*2+1,this.mouseCell.y*2  );}
			else if(pos.y-this.mouseCell.y== 1){ id=bd.getbnum(this.mouseCell.x*2+1,this.mouseCell.y*2+2);}
			else if(pos.x-this.mouseCell.x==-1){ id=bd.getbnum(this.mouseCell.x*2  ,this.mouseCell.y*2+1);}
			else if(pos.x-this.mouseCell.x== 1){ id=bd.getbnum(this.mouseCell.x*2+2,this.mouseCell.y*2+1);}

			var include = function(array,val){ for(var i=0;i<array.length;i++){ if(array[i]==val) return true;} return false;};
			if(this.mouseCell!=-1 && id!=-1){
				var idlist = this.getidlist(id);
				if(this.firstPos.x==-1 || !include(this.firstPos,id)){ this.inputData=-1;}
				if(this.inputData==-1){
					if     (bd.getLineBorder(id)==0){ this.inputData=1;}
					else if(bd.getLineBorder(id)==1){ this.inputData=2;}
					else                            { this.inputData=0;}
				}
				if(this.inputData> 0 && ((pos.x-this.mouseCell.x==-1)||(pos.y-this.mouseCell.y==-1))){ idlist=idlist.reverse();} // �F�����̓s����̏���
				for(var i=0;i<idlist.length;i++){
					if(this.inputData!=-1){ bd.setLineBorder(idlist[i], this.inputData); bd.setQsubBorder(idlist[i], 0);}
					pc.paintLine(idlist[i]);
				}
				this.firstPos=idlist;
			}
			this.mouseCell = pos;
		};
		mv.getidlist = function(id){
			var idlist=[], bx1, bx2, by1, by2;
			var cc1=bd.getcc1(id), cx=bd.cell[cc1].cx, cy=bd.cell[cc1].cy;
			if(bd.border[id].cx%2==1){
				while(cy>=0         && bd.getQnumCell(bd.getcnum(cx,cy  ))==-1){ cy--;} by1=2*cy+2;
				while(cy<=k.qrows-1 && bd.getQnumCell(bd.getcnum(cx,cy+1))==-1){ cy++;} by2=2*cy+2;
				bx1 = bx2 = bd.border[id].cx;
			}
			else if(bd.border[id].cy%2==1){
				while(cx>=0         && bd.getQnumCell(bd.getcnum(cx  ,cy))==-1){ cx--;} bx1=2*cx+2;
				while(cx<=k.qcols-1 && bd.getQnumCell(bd.getcnum(cx+1,cy))==-1){ cx++;} bx2=2*cx+2;
				by1 = by2 = bd.border[id].cy;
			}
			if(bx1<1||bx2>2*k.qcols-1||by1<1||by2>2*k.qrows-1){ return [];}
			for(var i=bx1;i<=bx2;i+=2){ for(var j=by1;j<=by2;j+=2){ idlist.push(bd.getbnum(i,j)); } }
			return idlist;
		};

		mv.inputpeke = function(x,y){
			var pos = this.crosspos(new Pos(x,y), 0.22);
			var id = bd.getbnum(pos.x, pos.y);
			if(id==-1 || (pos.x==this.mouseCell.x && pos.y==this.mouseCell.y)){ return;}

			if(this.inputData==-1){ this.inputData=(bd.getQsubBorder(id)!=2?2:0);}
			bd.setQsubBorder(id, this.inputData);

			var idlist = this.getidlist(id);
			for(var i=0;i<idlist.length;i++){
				bd.setLineBorder(idlist[i], 0);
				pc.paintBorder(idlist[i]);
			}
			if(idlist.length==0){ pc.paintBorder(id);}
			this.mouseCell = pos;
		},

		// �L�[�{�[�h���͌n
		kc.keyinput = function(ca){
			if(k.mode==3){ return;}
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca,8);
		};

		if(k.callmode == "pmake"){
			kp.generate(99, true, false, this.kpgenerate);
			kp.kpinput = function(ca){
				kc.key_inputqnum(ca,8);
			};
		}
	},

	kpgenerate : function(mode){
		kp.inputcol('num','knum1','1','1');
		kp.inputcol('num','knum2','2','2');
		kp.inputcol('num','knum3','3','3');
		kp.inputcol('num','knum4','4','4');
		kp.insertrow();
		kp.inputcol('num','knum5','5','5');
		kp.inputcol('num','knum6','6','6');
		kp.inputcol('num','knum7','7','7');
		kp.inputcol('num','knum8','8','8');
		kp.insertrow();
		kp.inputcol('num','knum_',' ',' ');
		kp.inputcol('num','knum.','-','��');
		kp.insertrow();
	},

	//---------------------------------------------------------
	//�摜�\���n�֐��I�[�o�[���C�h
	graphic_init : function(){
		pc.BDlinecolor = "rgb(224, 224, 224)";
		pc.bcolor = "rgb(160, 255, 160)";

		pc.fontsizeratio = 0.85;

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			if(k.mode==1){
				this.drawChassis_bridges(x1,y1,x2,y2);
				this.drawBDline(x1,y1,x2,y2);
			}
			else{ this.hideBorder();}

			this.drawPekes(x1,y1,x2,y2,0);
			this.drawLines(x1,y1,x2,y2);

			this.drawNumCells_bridges(x1,y1,x2,y2);

			if(k.mode==1){ this.drawTCell(x1,y1,x2+1,y2+1);}else{ this.hideTCell();}
		};

		// �I�[�o�[���C�h
		pc.drawLines = function(x1,y1,x2,y2){
			var idlist = this.borderinside(x1*2-2,y1*2-2,x2*2+2,y2*2+2,f_true);
			for(var i=0;i<idlist.length;i++){
				var id = idlist[i];
				if(bd.getLineBorder(id)!=0){ this.drawLine1(id, true);}
				else{ this.vhide(["b"+id+"_ls_","b"+id+"_ld1_","b"+id+"_ld2_"]);}
			}
			this.vinc();
		};
		pc.drawLine1 = function(id, flag){
			var lw = (int(k.cwidth/8)>=3?int(k.cwidth/8):3); //LineWidth

			if     (bd.getErrorBorder(id)==1){ g.fillStyle = this.errlinecolor1; lw++;}
			else if(bd.getErrorBorder(id)==2){ g.fillStyle = this.errlinecolor2;}
			else if(k.irowake==0 || !menu.getVal('irowake') || !bd.border[id].color){ g.fillStyle = this.linecolor;}
			else{ g.fillStyle = bd.border[id].color;}

			var lm = int((lw-1)/2); //LineMargin
			var ls = int(lw*1.5);

			this.vhide(["b"+id+"_ls_","b"+id+"_ld1_","b"+id+"_ld2_"]);
			if     (bd.border[id].cx%2==1){
				if(bd.getLineBorder(id)==1){
					if(this.vnop("b"+id+"_ls_",1)){ g.fillRect(bd.border[id].px()-lm, bd.border[id].py()-int(k.cheight/2)-1, lw, k.cheight+lw);}
				}
				else if(bd.getLineBorder(id)==2){
					if(this.vnop("b"+id+"_ld1_",1)){ g.fillRect(bd.border[id].px()-lm-ls, bd.border[id].py()-int(k.cheight/2)-lm, lw, k.cheight+lw);}
					if(this.vnop("b"+id+"_ld2_",1)){ g.fillRect(bd.border[id].px()-lm+ls, bd.border[id].py()-int(k.cheight/2)-lm, lw, k.cheight+lw);}
				}
			}
			else if(bd.border[id].cy%2==1){
				if(bd.getLineBorder(id)==1){
					if(this.vnop("b"+id+"_ls_",1)){ g.fillRect(bd.border[id].px()-int(k.cwidth/2)-lm, bd.border[id].py()-1, k.cwidth+lw, lw);}
				}
				else if(bd.getLineBorder(id)==2){
					if(this.vnop("b"+id+"_ld1_",1)){ g.fillRect(bd.border[id].px()-int(k.cwidth/2)-lm, bd.border[id].py()-lm-ls, k.cwidth+lw, lw);}
					if(this.vnop("b"+id+"_ld2_",1)){ g.fillRect(bd.border[id].px()-int(k.cwidth/2)-lm, bd.border[id].py()-lm+ls, k.cwidth+lw, lw);}
				}
			}
			this.vinc();
		};

		pc.drawNumCells_bridges = function(x1,y1,x2,y2){
			var rsize  = k.cwidth*0.45;
			var rsize2 = k.cwidth*0.40;

			var clist = this.cellinside(x1-2,y1-2,x2+1,y2+1,f_true);
			for(var i=0;i<clist.length;i++){
				var c = clist[i];
				if(bd.getQnumCell(c)!=-1){
					var px=bd.cell[c].px()+int(k.cwidth/2), py=bd.cell[c].py()+int(k.cheight/2);

					g.fillStyle = this.Cellcolor;
					g.beginPath();
					g.arc(px, py, rsize , 0, Math.PI*2, false);
					if(this.vnop("c"+c+"_cira_",1)){ g.fill(); }

					if     (bd.getErrorCell(c)==1){ g.fillStyle = this.errbcolor1;}
					else if(bd.getQsubCell(c) ==1){ g.fillStyle = this.qsubbcolor1;}
					else{ g.fillStyle = "white";}
					g.beginPath();
					g.arc(px, py, rsize2, 0, Math.PI*2, false);
					if(this.vnop("c"+c+"_cirb_",1)){ g.fill(); }
				}
				else{ this.vhide(["c"+c+"_cira_", "c"+c+"_cirb_"]);}

				this.dispnumCell_General(c);
			}
			this.vinc();
		};
		pc.drawChassis_bridges = function(x1,y1,x2,y2){
			x1--; y1--; x2++; y2++;
			if(x1<0){ x1=0;} if(x2>k.qcols-1){ x2=k.qcols-1;}
			if(y1<0){ y1=0;} if(y2>k.qrows-1){ y2=k.qrows-1;}

			g.fillStyle = "rgb(224,224,224)";
			if(x1<1)         { if(this.vnop("chs1_",1)){ g.fillRect(k.p0.x+x1*k.cwidth    , k.p0.y+y1*k.cheight    , 1, (y2-y1+1)*k.cheight+1);} }
			if(y1<1)         { if(this.vnop("chs2_",1)){ g.fillRect(k.p0.x+x1*k.cwidth    , k.p0.y+y1*k.cheight    , (x2-x1+1)*k.cwidth+1, 1); } }
			if(y2>=k.qrows-1){ if(this.vnop("chs3_",1)){ g.fillRect(k.p0.x+x1*k.cwidth    , k.p0.y+(y2+1)*k.cheight, (x2-x1+1)*k.cwidth+1, 1); } }
			if(x2>=k.qcols-1){ if(this.vnop("chs4_",1)){ g.fillRect(k.p0.x+(x2+1)*k.cwidth, k.p0.y+y1*k.cheight    , 1, (y2-y1+1)*k.cheight+1);} }
			this.vinc();
		};
		pc.hideBorder = function(){
			if(!g.vml){ return;}
			this.vhide(["chs1_","chs2_","chs3_","chs4_"]);
			for(var i=0;i<=k.qcols;i++){ this.vhide("bdy"+i+"_");}
			for(var i=0;i<=k.qrows;i++){ this.vhide("bdx"+i+"_");}
		};

		col.repaintParts = function(id){
			var bx=bd.border[id].cx, by=bd.border[id].cy;
			if(bd.border[id].cx%2==1){ pc.drawNumCells_bridges(int((bx-1)/2)-1, int(by/2)-1, int((bx-1)/2)+1, int(by/2));}
			else                     { pc.drawNumCells_bridges(int(bx/2)-1, int((by-1)/2)-1, int(bx/2), int((by-1)/2)+1);}
		};
		col.branch = function(bx,by,lcnt){
			return (lcnt==3||lcnt==4) && (bd.getQnumCell(bd.getcnum(int(bx/2),int(by/2)))!=-1);
		};
		col.point = function(id,cc){
			return this.lcntCell(cc)==1 || (this.lcntCell(cc)==3 && this.tshapeid(cc)==id);
		};
	},

	//---------------------------------------------------------
	// URL�G���R�[�h/�f�R�[�h����
	pzlinput : function(type, bstr){
		if(type==0 || type==1){ bstr = enc.decodeNumber16(bstr);}
		else if(type==2)      { bstr = this.decodeKanpen(bstr); }
	},
	pzloutput : function(type){
		if(type==0)     { document.urloutput.ta.value = enc.getURLbase()+"?"+k.puzzleid+this.pzldata();}
		else if(type==1){ document.urloutput.ta.value = enc.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
		else if(type==2){ document.urloutput.ta.value = enc.kanpenbase()+"hashi.html?problem="+this.pzldataKanpen();}
		else if(type==3){ document.urloutput.ta.value = enc.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
	},
	pzldata : function(){
		return "/"+k.qcols+"/"+k.qrows+"/"+enc.encodeNumber16();
	},

	//---------------------------------------------------------
	decodeKanpen : function(bstr){
		bstr = (bstr.split("_")).join(" ");
		fio.decodeCell( function(c,ca){
			if(ca != "."){ bd.setQnumCell(c, parseInt(ca));}
		},bstr.split("/"));
		return "";
	},
	pzldataKanpen : function(){
		return ""+k.qrows+"/"+k.qcols+"/"+fio.encodeCell( function(c){
			if     (bd.getQnumCell(c)>=0) { return (bd.getQnumCell(c).toString() + "_");}
			else                          { return "._";}
		});
	},

	//---------------------------------------------------------
	kanpenOpen : function(array){
		fio.decodeCell( function(c,ca){
			if(ca>="1" && ca<="8"){ bd.setQnumCell(c, parseInt(ca));}
			else if(ca=="9")      { bd.setQsubCell(c, -2);}
		},array.slice(0,k.qrows));
		fio.decodeCell( function(c,ca){
			if(ca!="0"){
				var datah = (parseInt(ca)&3);
				if(datah>0){
					bd.setLineBorder(bd.cell[c].ub(),datah);
					bd.setLineBorder(bd.cell[c].db(),datah);
				}
				var dataw = ((parseInt(ca)&12)>>2);
				if(dataw>0){
					bd.setLineBorder(bd.cell[c].lb(),dataw);
					bd.setLineBorder(bd.cell[c].rb(),dataw);
				}
			}
		},array.slice(k.qrows,2*k.qrows));
	},
	kanpenSave : function(){
		return ""+fio.encodeCell( function(c){
			if     (bd.getQnumCell(c) > 0){ return (bd.getQnumCell(c).toString() + " ");}
			else if(bd.getQnumCell(c)==-2){ return "9 ";}
			else                          { return ". ";}
		})+fio.encodeCell( function(c){
			if(bd.getQnumCell(c)!=-1){ return "0 ";}
			var datah = bd.getLineBorder(bd.cell[c].ub());
			var dataw = bd.getLineBorder(bd.cell[c].lb());
			return ""+((datah>0?datah:0)+(dataw>0?(dataw<<2):0))+" ";
		});
	},

	//---------------------------------------------------------
	// ���𔻒菈�����s��
	check : function(){

		if( !this.checkCellNumber(1) ){
			ans.setAlert('�����ɂȂ��鋴�̐����Ⴂ�܂��B','The number of connecting bridges to a number is not correct.'); return false;
		}

		ans.performAsLine = true;
		if( !ans.linkBWarea( ans.searchLarea() ) ){
			ans.setAlert('�����S�̂ň�Ȃ���ɂȂ��Ă��܂���B', 'All lines and numbers are not connected each other.'); return false;
		}

		if( !this.checkCellNumber(2) ){
			ans.setAlert('�����ɂȂ��鋴�̐����Ⴂ�܂��B','The number of connecting bridges to a number is not correct.'); return false;
		}
		return true;
	},
	check1st : function(){ return true;},

	checkCellNumber : function(flag){
		for(var cc=0;cc<bd.cell.length;cc++){
			if(bd.getQnumCell(cc)<0){ continue;}

			var cnt = 0;
			if(bd.cell[cc].ub()!=-1 && bd.getLineBorder(bd.cell[cc].ub())>0){ cnt+=bd.getLineBorder(bd.cell[cc].ub());}
			if(bd.cell[cc].db()!=-1 && bd.getLineBorder(bd.cell[cc].db())>0){ cnt+=bd.getLineBorder(bd.cell[cc].db());}
			if(bd.cell[cc].lb()!=-1 && bd.getLineBorder(bd.cell[cc].lb())>0){ cnt+=bd.getLineBorder(bd.cell[cc].lb());}
			if(bd.cell[cc].rb()!=-1 && bd.getLineBorder(bd.cell[cc].rb())>0){ cnt+=bd.getLineBorder(bd.cell[cc].rb());}

			if((flag==1 && bd.getQnumCell(cc)<cnt)||(flag==2 && bd.getQnumCell(cc)>cnt)){
				bd.setErrorCell(cc,1);
				return false;
			}
		}
		return true;
	}
};
