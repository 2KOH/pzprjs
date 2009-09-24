// Filesys.js v3.2.1

//---------------------------------------------------------------------------
// ��FileIO�N���X �t�@�C���̃f�[�^�`���G���R�[�h/�f�R�[�h������
//   ��fstruct�̓��e�ɂ���
//     "cellques41_42" Cell��́��Ɓ��̃G���R�[�h/�f�R�[�h
//     "cellqnum"      Cell��̖�萔���݂̂̃G���R�[�h/�f�R�[�h
//     "cellqnum51"    Cell,EXCell���[�^]�̃G���R�[�h/�f�R�[�h
//     "cellqnumb"     Cell��̍��}�X�{��萔��(0�`4)�̃G���R�[�h/�f�R�[�h
//     "cellqnumans"   Cell��̖�萔���Ɓ��ƁE�̃G���R�[�h/�f�R�[�h
//     "celldirecnum"  Cell��̖�����萔���̃G���R�[�h/�f�R�[�h
//     "cellans"       Cell�́��ƁE�̃G���R�[�h/�f�R�[�h
//     "cellqanssub"   Cell��̉񓚐����ƕ⏕�L��(qsub==1�`4)�̃G���R�[�h/�f�R�[�h
//     "cellqsub"      Cell��̕⏕�L���݂̂̃G���R�[�h/�f�R�[�h
//     "crossnum"      Cross/qnum��0�`�A-2���G���R�[�h/�f�R�[�h
//     "borderques"    ���E��(���)�̃G���R�[�h/�f�R�[�h
//     "borderline"    �񓚂̐��Ɓ~�̃G���R�[�h/�f�R�[�h
//     "borderans"     ���E��(��)�ƕ⏕�L���̃G���R�[�h/�f�R�[�h
//     "borderans2"    �O�g����܂߂����E��(��)�ƕ⏕�L���̃G���R�[�h/�f�R�[�h
//     "arearoom"      ����(�C�ӂ̌`)�̃G���R�[�h/�f�R�[�h
//     "others"        �p�Y����puz�I�u�W�F�N�g�̊֐����Ăяo��
//---------------------------------------------------------------------------
FileIO = function(){
	this.filever = 0;

	this.db = null;
	this.dbmgr = null;
	this.DBtype = 0;
	this.DBsid  = -1;
	this.DBlist = new Array();
};
FileIO.prototype = {
	//---------------------------------------------------------------------------
	// fio.fileopen()  �t�@�C�����J���A�t�@�C������̃f�R�[�h���s���C���֐�
	//---------------------------------------------------------------------------
	fileopen : function(arrays, type){
		var pgstr = '';
		this.filever = 0;

		if(type==1){
			pgstr = arrays.shift();
			if(!pgstr.match(/pzprv3\.?(\d+)?/)){ alert('�ς��Ղ�v3�`���̃t�@�C���ł͂���܂���B');}
			if(RegExp.$1){ fio.filever = parseInt(RegExp.$1);}

			if(arrays.shift()!=k.puzzleid){ alert(base.getPuzzleName()+'�̃t�@�C���ł͂���܂���B');}
		}

		var row = parseInt(arrays.shift(), 10), col;
		if(k.puzzleid!="sudoku"){ col=parseInt(arrays.shift(), 10);}else{ col=row;}

		if     (row>0 && col>0 && (type==1 || k.puzzleid!="kakuro")){ menu.ex.newboard2(col, row);}
		else if(row>0 && col>0){ menu.ex.newboard2(col-1, row-1);}
		else{ return;}

		um.disableRecord();

		if(type==1){
			var line = 0;
			var item = 0;
			var stacks = new Array();
			while(1){
				if(arrays.length<=0){ break;}
				stacks.push( arrays.shift() ); line++;
				if     (k.fstruct[item] == "cellques41_42"&& line>=k.qrows    ){ this.decodeCellQues41_42(stacks); }
				else if(k.fstruct[item] == "cellqnum"     && line>=k.qrows    ){ this.decodeCellQnum(stacks);      }
				else if(k.fstruct[item] == "cellqnum51"   && line>=k.qrows+1  ){ this.decodeCellQnum51(stacks);    }
				else if(k.fstruct[item] == "cellqnumb"    && line>=k.qrows    ){ this.decodeCellQnumb(stacks);     }
				else if(k.fstruct[item] == "cellqnumans"  && line>=k.qrows    ){ this.decodeCellQnumAns(stacks);   }
				else if(k.fstruct[item] == "celldirecnum" && line>=k.qrows    ){ this.decodeCellDirecQnum(stacks); }
				else if(k.fstruct[item] == "cellans"      && line>=k.qrows    ){ this.decodeCellAns(stacks);       }
				else if(k.fstruct[item] == "cellqanssub"  && line>=k.qrows    ){ this.decodeCellQanssub(stacks);   }
				else if(k.fstruct[item] == "cellqsub"     && line>=k.qrows    ){ this.decodeCellQsub(stacks);      }
				else if(k.fstruct[item] == "crossnum"     && line>=k.qrows+1  ){ this.decodeCrossNum(stacks);      }
				else if(k.fstruct[item] == "borderques"   && line>=2*k.qrows-1){ this.decodeBorderQues(stacks);    }
				else if(k.fstruct[item] == "borderline"   && line>=2*k.qrows-1){ this.decodeBorderLine(stacks);    }
				else if(k.fstruct[item] == "borderans"    && line>=2*k.qrows-1){ this.decodeBorderAns(stacks);     }
				else if(k.fstruct[item] == "borderans2"   && line>=2*k.qrows+1){ this.decodeBorderAns2(stacks);    }
				else if(k.fstruct[item] == "arearoom"     && line>=k.qrows+1  ){ this.decodeAreaRoom(stacks);      }
				else if(k.fstruct[item] == "others" && this.decodeOthers(stacks) ){ }
				else{ continue;}

				// decode�������Ƃ̏���
				line=0;
				item++;
				stacks = new Array();
			}
		}
		else if(type==2){
			this.kanpenOpen(arrays);
		}

		um.enableRecord();
		base.resize_canvas();
	},
	//---------------------------------------------------------------------------
	// fio.filesave()    �t�@�C���ۑ��A�t�@�C���ւ̃G���R�[�h���s�֐�
	// fio.filesavestr() �t�@�C���ۑ��A�t�@�C���ւ̃G���R�[�h���s���C���֐�
	//---------------------------------------------------------------------------
	filesave : function(type){
		var fname = prompt("�ۑ�����t�@�C��������͂��ĉ������B", k.puzzleid+".txt");
		if(!fname){ return;}
		var prohibit = ['\\', '/', ':', '*', '?', '"', '<', '>', '|'];
		for(var i=0;i<prohibit.length;i++){ if(fname.indexOf(prohibit[i])!=-1){ alert('�t�@�C�����Ƃ��Ďg�p�ł��Ȃ��������܂܂�Ă��܂��B'); return;} }

		document.fileform2.filename.value = fname;

		if     (navigator.platform.indexOf("Win")!=-1){ document.fileform2.platform.value = "Win";}
		else if(navigator.platform.indexOf("Mac")!=-1){ document.fileform2.platform.value = "Mac";}
		else                                          { document.fileform2.platform.value = "Others";}

		this.filever = 0;
		document.fileform2.ques.value = this.filesavestr(type);

		if(type==1){
			if(!k.isKanpenExist || k.puzzleid=="lits"){ document.fileform2.urlstr.value = enc.getURLbase() + "?" + k.puzzleid + enc.pzldata();}
			else{ enc.pzlexport(2); document.fileform2.urlstr.value = document.urloutput.ta.value;}
		}
		else if(type==2){
			document.fileform2.urlstr.value = "";
		}

		document.fileform2.submit();
	},
	filesavestr : function(type){
		var str = "";
		var bstr = "";

		if(type==1){
			for(var i=0;i<k.fstruct.length;i++){
				if     (k.fstruct[i] == "cellques41_42" ){ bstr += this.encodeCellQues41_42(); }
				else if(k.fstruct[i] == "cellqnum"      ){ bstr += this.encodeCellQnum();      }
				else if(k.fstruct[i] == "cellqnum51"    ){ bstr += this.encodeCellQnum51();    }
				else if(k.fstruct[i] == "cellqnumb"     ){ bstr += this.encodeCellQnumb();     }
				else if(k.fstruct[i] == "cellqnumans"   ){ bstr += this.encodeCellQnumAns();   }
				else if(k.fstruct[i] == "celldirecnum"  ){ bstr += this.encodeCellDirecQnum(); }
				else if(k.fstruct[i] == "cellans"       ){ bstr += this.encodeCellAns();       }
				else if(k.fstruct[i] == "cellqanssub"   ){ bstr += this.encodeCellQanssub();   }
				else if(k.fstruct[i] == "cellqsub"      ){ bstr += this.encodeCellQsub();      }
				else if(k.fstruct[i] == "crossnum"      ){ bstr += this.encodeCrossNum();      }
				else if(k.fstruct[i] == "borderques"    ){ bstr += this.encodeBorderQues();    }
				else if(k.fstruct[i] == "borderline"    ){ bstr += this.encodeBorderLine();    }
				else if(k.fstruct[i] == "borderans"     ){ bstr += this.encodeBorderAns();     }
				else if(k.fstruct[i] == "borderans2"    ){ bstr += this.encodeBorderAns2();    }
				else if(k.fstruct[i] == "arearoom"      ){ bstr += this.encodeAreaRoom();      }
				else if(k.fstruct[i] == "others"        ){ bstr += this.encodeOthers();         }
			}

			str = "pzprv3/"+k.puzzleid+"/"+k.qrows+"/"+k.qcols+"/";
			if(k.puzzleid=="sudoku"){ str = "pzprv3/"+k.puzzleid+"/"+k.qcols+"/";}
			if(this.filever!=0){ str = "pzprv3."+this.filever+"/"+k.puzzleid+"/"+k.qrows+"/"+k.qcols+"/";}

			str += bstr;
		}
		else if(type==2){
			if     (k.puzzleid=="kakuro"){ str = ""+(k.qrows+1)+"/"+(k.qcols+1)+"/";}
			else if(k.puzzleid=="sudoku"){ str = ""+k.qrows+"/";}
			else                         { str = ""+k.qrows+"/"+k.qcols+"/";}
			str += this.kanpenSave();
		}

		return str;
	},

	//---------------------------------------------------------------------------
	// fio.retarray() ���s�{�X�y�[�X��؂�̕������z��ɂ���
	//---------------------------------------------------------------------------
	retarray : function(str){
		var array1 = str.split(" ");
		var array2 = new Array();
		for(var i=0;i<array1.length;i++){ if(array1[i]!=""){ array2.push(array1[i]);} }
		return array2;
	},

	//---------------------------------------------------------------------------
	// fio.decodeObj()     �z��ŁA�ʕ����񂩂�ʃZ���Ȃǂ̐ݒ���s��
	// fio.decodeCell()    �z��ŁA�ʕ����񂩂�ʃZ���̐ݒ���s��
	// fio.decodeCross()   �z��ŁA�ʕ����񂩂��Cross�̐ݒ���s��
	// fio.decodeBorder()  �z��ŁA�ʕ����񂩂��Border(�O�g��Ȃ�)�̐ݒ���s��
	// fio.decodeBorder2() �z��ŁA�ʕ����񂩂��Border(�O�g�゠��)�̐ݒ���s��
	//---------------------------------------------------------------------------
	decodeObj : function(func, stack, width, getid){
		var item = new Array();
		for(var i=0;i<stack.length;i++){ item = item.concat( this.retarray( stack[i] ) );    }
		for(var i=0;i<item.length;i++) { func(getid(i%width,mf(i/width)), item[i]);}
	},
	decodeCell   : function(func, stack){ this.decodeObj(func, stack, k.qcols  , function(cx,cy){return bd.cnum(cx,cy);});},
	decodeCross  : function(func, stack){ this.decodeObj(func, stack, k.qcols+1, function(cx,cy){return bd.xnum(cx,cy);});},
	decodeBorder : function(func, stack){
		this.decodeObj(func, stack.slice(0      ,k.qrows    ), k.qcols-1, function(cx,cy){return bd.bnum(2*cx+2,2*cy+1);});
		this.decodeObj(func, stack.slice(k.qrows,2*k.qrows-1), k.qcols  , function(cx,cy){return bd.bnum(2*cx+1,2*cy+2);});
	},
	decodeBorder2: function(func, stack){
		this.decodeObj(func, stack.slice(0      ,k.qrows    ), k.qcols+1, function(cx,cy){return bd.bnum(2*cx  ,2*cy+1);});
		this.decodeObj(func, stack.slice(k.qrows,2*k.qrows+1), k.qcols  , function(cx,cy){return bd.bnum(2*cx+1,2*cy  );});
	},

	//---------------------------------------------------------------------------
	// fio.encodeObj()     �ʃZ���f�[�^������ʕ�����̐ݒ���s��
	// fio.encodeCell()    �ʃZ���f�[�^����ʕ�����̐ݒ���s��
	// fio.encodeCross()   ��Cross�f�[�^����ʕ�����̐ݒ���s��
	// fio.encodeBorder()  ��Border�f�[�^(�O�g��Ȃ�)����ʕ�����̐ݒ���s��
	// fio.encodeBorder2() ��Border�f�[�^(�O�g�゠��)����ʕ�����̐ݒ���s��
	//---------------------------------------------------------------------------
	encodeObj : function(func, width, height, getid){
		var str = "";
		for(var cy=0;cy<height;cy++){
			for(var cx=0;cx<width;cx++){ str += func(getid(cx,cy)); }
			str += "/";
		}
		return str;
	},
	encodeCell   : function(func){ return this.encodeObj(func, k.qcols  , k.qrows  , function(cx,cy){return bd.cnum(cx,cy);});},
	encodeCross  : function(func){ return this.encodeObj(func, k.qcols+1, k.qrows+1, function(cx,cy){return bd.xnum(cx,cy);});},
	encodeBorder : function(func){
		return this.encodeObj(func, k.qcols-1, k.qrows  , function(cx,cy){return bd.bnum(2*cx+2,2*cy+1);})
			 + this.encodeObj(func, k.qcols  , k.qrows-1, function(cx,cy){return bd.bnum(2*cx+1,2*cy+2);});
	},
	encodeBorder2: function(func){
		return this.encodeObj(func, k.qcols+1, k.qrows  , function(cx,cy){return bd.bnum(2*cx  ,2*cy+1);})
			 + this.encodeObj(func, k.qcols  , k.qrows+1, function(cx,cy){return bd.bnum(2*cx+1,2*cy  );});
	},

	//---------------------------------------------------------------------------
	// fio.decodeCellQues41_42() ���ۂƔ��ۂ̃f�R�[�h���s��
	// fio.encodeCellQues41_42() ���ۂƔ��ۂ̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQues41_42 : function(stack){
		this.decodeCell( function(c,ca){
			if     (ca == "-"){ bd.sQnC(c, -2);}
			else if(ca == "1"){ bd.sQuC(c, 41);}
			else if(ca == "2"){ bd.sQuC(c, 42);}
		},stack);
	},
	encodeCellQues41_42 : function(){
		return this.encodeCell( function(c){
			if     (bd.QuC(c)==41){ return "1 ";}
			else if(bd.QuC(c)==42){ return "2 ";}
			else if(bd.QnC(c)==-2){ return "- ";}
			else                  { return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellQnum() ��萔���̃f�R�[�h���s��
	// fio.encodeCellQnum() ��萔���̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQnum : function(stack){
		this.decodeCell( function(c,ca){
			if     (ca == "-"){ bd.sQnC(c, -2);}
			else if(ca != "."){ bd.sQnC(c, parseInt(ca));}
		},stack);
	},
	encodeCellQnum : function(){
		return this.encodeCell( function(c){
			if     (bd.QnC(c)>=0) { return (bd.QnC(c).toString() + " ");}
			else if(bd.QnC(c)==-2){ return "- ";}
			else                  { return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellQnumb() ���{��萔���̃f�R�[�h���s��
	// fio.encodeCellQnumb() ���{��萔���̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQnumb : function(stack){
		this.decodeCell( function(c,ca){
			if     (ca == "5"){ bd.sQnC(c, -2);}
			else if(ca != "."){ bd.sQnC(c, parseInt(ca));}
		},stack);
	},
	encodeCellQnumb : function(){
		return this.encodeCell( function(c){
			if     (bd.QnC(c)>=0) { return (bd.QnC(c).toString() + " ");}
			else if(bd.QnC(c)==-2){ return "5 ";}
			else                  { return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellQnumAns() ��萔���{���}�X���}�X�̃f�R�[�h���s��
	// fio.encodeCellQnumAns() ��萔���{���}�X���}�X�̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQnumAns : function(stack){
		this.decodeCell( function(c,ca){
			if     (ca == "#"){ bd.sQaC(c, 1);}
			else if(ca == "+"){ bd.sQsC(c, 1);}
			else if(ca == "-"){ bd.sQnC(c, -2);}
			else if(ca != "."){ bd.sQnC(c, parseInt(ca));}
		},stack);
	},
	encodeCellQnumAns : function(){
		return this.encodeCell( function(c){
			if     (bd.QnC(c)>=0) { return (bd.QnC(c).toString() + " ");}
			else if(bd.QnC(c)==-2){ return "- ";}
			else if(bd.QaC(c)==1) { return "# ";}
			else if(bd.QsC(c)==1) { return "+ ";}
			else                  { return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellDirecQnum() �����{��萔���̃f�R�[�h���s��
	// fio.encodeCellDirecQnum() �����{��萔���̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellDirecQnum : function(stack){
		this.decodeCell( function(c,ca){
			if(ca != "."){
				var inp = ca.split(",");
				bd.sDiC(c, (inp[0]!="0"?parseInt(inp[0]): 0));
				bd.sQnC(c, (inp[1]!="-"?parseInt(inp[1]):-2));
			}
		},stack);
	},
	encodeCellDirecQnum : function(){
		return this.encodeCell( function(c){
			if(bd.QnC(c)!=-1){
				var ca1 = (bd.DiC(c)!= 0?(bd.DiC(c)).toString():"0");
				var ca2 = (bd.QnC(c)!=-2?(bd.QnC(c)).toString():"-");
				return ""+ca1+","+ca2+" ";
			}
			else{ return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellAns() ���}�X���}�X�̃f�R�[�h���s��
	// fio.encodeCellAns() ���}�X���}�X�̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellAns : function(stack){
		this.decodeCell( function(c,ca){
			if     (ca == "#"){ bd.sQaC(c, 1);}
			else if(ca == "+"){ bd.sQsC(c, 1);}
		},stack);
	},
	encodeCellAns : function(){
		return this.encodeCell( function(c){
			if     (bd.QaC(c)==1){ return "# ";}
			else if(bd.QsC(c)==1){ return "+ ";}
			else                 { return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellQanssub() �񓚐����Ɣw�i�F�̃f�R�[�h���s��
	// fio.encodeCellQanssub() �񓚐����Ɣw�i�F�̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQanssub : function(stack){
		this.decodeCell( function(c,ca){
			if     (ca == "+"){ bd.sQsC(c, 1);}
			else if(ca == "-"){ bd.sQsC(c, 2);}
			else if(ca == "="){ bd.sQsC(c, 3);}
			else if(ca == "%"){ bd.sQsC(c, 4);}
			else if(ca != "."){ bd.sQaC(c, parseInt(ca));}
		},stack);
	},
	encodeCellQanssub : function(){
		return this.encodeCell( function(c){
			//if(bd.QuC(c)!=0 || bd.QnC(c)!=-1){ return ". ";}
			if     (bd.QaC(c)!=-1){ return (bd.QaC(c).toString() + " ");}
			else if(bd.QsC(c)==1 ){ return "+ ";}
			else if(bd.QsC(c)==2 ){ return "- ";}
			else if(bd.QsC(c)==3 ){ return "= ";}
			else if(bd.QsC(c)==4 ){ return "% ";}
			else                  { return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellQsub() �w�i�F�̃f�R�[�h���s��
	// fio.encodeCellQsub() �w�i�F�̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQsub : function(stack){
		this.decodeCell( function(c,ca){
			if(ca != "0"){ bd.sQsC(c, parseInt(ca));}
		},stack);
	},
	encodeCellQsub : function(){
		return this.encodeCell( function(c){
			if     (bd.QsC(c)>0){ return (bd.QsC(c).toString() + " ");}
			else                { return "0 ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCrossNum() ��_�̐����̃f�R�[�h���s��
	// fio.encodeCrossNum() ��_�̐����̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCrossNum : function(stack){
		this.decodeCross( function(c,ca){
			if     (ca == "-"){ bd.sQnX(c, -2);}
			else if(ca != "."){ bd.sQnX(c, parseInt(ca));}
		},stack);
	},
	encodeCrossNum : function(){
		return this.encodeCross( function(c){
			if     (bd.QnX(c)>=0) { return (bd.QnX(c).toString() + " ");}
			else if(bd.QnX(c)==-2){ return "- ";}
			else                  { return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeBorderQues() ���̋��E���̃f�R�[�h���s��
	// fio.encodeBorderQues() ���̋��E���̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeBorderQues : function(stack){
		this.decodeBorder( function(c,ca){
			if(ca == "1"){ bd.sQuB(c, 1);}
		},stack);
	},
	encodeBorderQues : function(){
		return this.encodeBorder( function(c){
			if     (bd.QuB(c)==1){ return "1 ";}
			else                 { return "0 ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeBorderLine() Line�̃f�R�[�h���s��
	// fio.encodeBorderLine() Line�̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeBorderLine : function(stack){
		this.decodeBorder( function(c,ca){
			if     (ca == "-1"){ bd.sQsB(c, 2);}
			else if(ca != "0" ){ bd.sLiB(c, parseInt(ca)); if(bd.LiB(c)==0){ bd.border[c].line=parseInt(ca); ans.setLcnts(c,1);}}	// fix
		},stack);
	},
	encodeBorderLine : function(){
		return this.encodeBorder( function(c){
			if     (bd.LiB(c)> 0){ return ""+bd.LiB(c)+" ";}
			else if(bd.QsB(c)==2){ return "-1 ";}
			else                 { return "0 ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeBorderAns() ���E�񓚂̋��E���̃f�R�[�h���s��
	// fio.encodeBorderAns() ���E�񓚂̋��E���̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeBorderAns : function(stack){
		this.decodeBorder( function(c,ca){
			if     (ca == "1" ){ bd.sQaB(c, 1);}
			else if(ca == "2" ){ bd.sQaB(c, 1); bd.sQsB(c, 1);}
			else if(ca == "-1"){ bd.sQsB(c, 1);}
		},stack);
	},
	encodeBorderAns : function(){
		return this.encodeBorder( function(c){
			if     (bd.QaB(c)==1 && bd.QsB(c)==1){ return "2 ";}
			else if(bd.QaB(c)==1){ return "1 ";}
			else if(bd.QsB(c)==1){ return "-1 ";}
			else                 { return "0 ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeBorderAns2() ���E�񓚂̋��E���̃f�R�[�h(�O�g����)���s��
	// fio.encodeBorderAns2() ���E�񓚂̋��E���̃G���R�[�h(�O�g����)���s��
	//---------------------------------------------------------------------------
	decodeBorderAns2 : function(stack){
		this.decodeBorder2( function(c,ca){
			if     (ca == "1" ){ bd.sQaB(c, 1);}
			else if(ca == "2" ){ bd.sQsB(c, 1);}
			else if(ca == "3" ){ bd.sQaB(c, 1); bd.sQsB(c, 1);}
			else if(ca == "-1"){ bd.sQsB(c, 2);}
		},stack);
	},
	encodeBorderAns2 : function(){
		return this.encodeBorder2( function(c){
			if     (bd.QaB(c)==1 && bd.QsB(c)==1){ return "3 ";}
			else if(bd.QsB(c)==1){ return "2 ";}
			else if(bd.QaB(c)==1){ return "1 ";}
			else if(bd.QsB(c)==2){ return "-1 ";}
			else                 { return "0 ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeAreaRoom() �����̃f�R�[�h���s��
	// fio.encodeAreaRoom() �����̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeAreaRoom : function(stack){
		stack.shift();
		this.decodeCell( function(c,ca){
			room.cell[c] = parseInt(ca)+1;
		},stack);

		var saved = room.isenable;
		room.isenable = false;
		for(var c=0;c<k.qcols*k.qrows;c++){
			if(bd.dn(c)!=-1 && room.getRoomID(c) != room.getRoomID(bd.dn(c))){ bd.sQuB(bd.db(c),1); }
			if(bd.rt(c)!=-1 && room.getRoomID(c) != room.getRoomID(bd.rt(c))){ bd.sQuB(bd.rb(c),1); }
		}
		room.isenable = saved;

		room.resetRarea();
	},
	encodeAreaRoom : function(){
		var saved = room.isenable;
		room.isenable = true;
		room.resetRarea();
		room.isenable = saved;

		var str = ""+room.rareamax+"/";
		return str + this.encodeCell( function(c){
			return ((room.getRoomID(c)-1) + " ");
		});
	},

	//---------------------------------------------------------------------------
	// fio.decodeCellQnum51() [�_]�̃f�R�[�h���s��
	// fio.encodeCellQnum51() [�_]�̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQnum51 : function(stack){
		var item = new Array();
		for(var i=0;i<stack.length;i++){ item = item.concat( fio.retarray( stack[i] ) );}
		for(var i=0;i<item.length;i++) {
			var cx=i%(k.qcols+1)-1, cy=mf(i/(k.qcols+1))-1;
			if(item[i]!="."){
				if     (cy==-1){ bd.sDiE(bd.exnum(cx,cy), parseInt(item[i]));}
				else if(cx==-1){ bd.sQnE(bd.exnum(cx,cy), parseInt(item[i]));}
				else{
					var inp = item[i].split(",");
					var c = bd.cnum(cx,cy);
					mv.set51cell(c, true);
					bd.sQnC(c, inp[0]);
					bd.sDiC(c, inp[1]);
				}
			}
		}
	},
	encodeCellQnum51 : function(){
		var str = "";
		for(var cy=-1;cy<k.qrows;cy++){
			for(var cx=-1;cx<k.qcols;cx++){
				if     (cx==-1 && cy==-1){ str += "0 ";}
				else if(cy==-1){ str += (""+bd.DiE(bd.exnum(cx,cy)).toString()+" ");}
				else if(cx==-1){ str += (""+bd.QnE(bd.exnum(cx,cy)).toString()+" ");}
				else{
					var c = bd.cnum(cx,cy);
					if(bd.QuC(c)==51){ str += (""+bd.QnC(c).toString()+","+bd.DiC(c).toString()+" ");}
					else{ str += ". ";}
				}
			}
			str += "/";
		}
		return str;
	},

//---------------------------------------------------------------------------
// ��Local Storage�p�f�[�^�x�[�X�̐ݒ�E�Ǘ����s��
//---------------------------------------------------------------------------
	//---------------------------------------------------------------------------
	// fio.choiceDataBase() LocalStorage���g���邩�ǂ������肷��
	//---------------------------------------------------------------------------
	choiceDataBase : function(){
		if(window.google && google.gears){ this.DBtype=1; return 1;}
		var factory = 0;

		// FireFox
		if (typeof GearsFactory != 'undefined') { factory=11;}
		else{
			try {
				// IE
				var axobj = new ActiveXObject('Gears.Factory');
				factory=21;
			} catch (e) {
				// Safari
				if((typeof navigator.mimeTypes != 'undefined') && navigator.mimeTypes["application/x-googlegears"]){
					factory=31;
				}
			}
		}
		this.DBtype=(factory>0?1:0);
		return factory;
	},

	//---------------------------------------------------------------------------
	// fio.initDataBase() �f�[�^�x�[�X��V�K�쐬����
	// fio.dropDataBase() �f�[�^�x�[�X���폜����
	// fio.remakeDataBase() �f�[�^�x�[�X���č\�z����
	// fio.updateManager() �X�V���Ԃ��X�V����
	//---------------------------------------------------------------------------
	initDataBase : function(){
		if(this.DBtype==0){ return false;}
		else if(this.DBtype==1){
			this.dbmgr = google.gears.factory.create('beta.database', '1.0');
			this.dbmgr.open('pzprv3_manage');
			this.dbmgr.execute('CREATE TABLE IF NOT EXISTS manage (puzzleid primary key,version,count,lastupdate)');
			this.dbmgr.close();

//			this.remakeDataBase2();

			this.db    = google.gears.factory.create('beta.database', '1.0');
			this.db.open('pzprv3_'+k.puzzleid);
			this.db.execute('CREATE TABLE IF NOT EXISTS pzldata (id int primary key,col,row,hard,pdata,time,comment)');
			this.db.close();
		}
		else if(this.DBtype==2){
			this.dbmgr = openDataBase('pzprv3_manage', '1.0');
			this.dbmgr.transaction(function(tx){
				tx.executeSql('CREATE TABLE IF NOT EXISTS manage (puzzleid primary key,version,count,lastupdate)');
			});

			this.db = openDataBase('pzprv3_'+k.puzzleid, '1.0');
			this.db.transaction(function(tx){
				tx.executeSql('CREATE TABLE IF NOT EXISTS pzldata (id int primary key,col,row,hard,pdata,time,comment)');
			});
		}

		this.updateManager(false);

		var sortlist = { idlist:"ID��", newsave:"�ۑ����V������", oldsave:"�ۑ����Â���", size:"�T�C�Y/��Փx��"};
		var str="";
		for(s in sortlist){ str += ("<option value=\""+s+"\">"+sortlist[s]+"</option>");}
		document.database.sorts.innerHTML = str;

		return true;
	},
	dropDataBase : function(){
		if(this.DBtype==1){
			this.dbmgr.open('pzprv3_manage');
			this.dbmgr.execute('DELETE FROM manage WHERE puzzleid=?',[k.puzzleid]);
			this.dbmgr.close();

			this.db.open('pzprv3_'+k.puzzleid);
			this.db.execute('DROP TABLE IF EXISTS pzldata');
			this.db.close();
		}
		else if(this.DBtype==2){
			this.dbmgr.transaction(function(tx){
				tx.executeSql('DELETE FROM manage WHERE puzzleid=?',[k.puzzleid]);
			});

			this.db.transaction(function(tx){
				tx.executeSql('DROP TABLE IF EXISTS pzldata');
			});
		}
	},

	remakeDataBase : function(){
		this.DBlist = new Array();

		this.db.open('pzprv3_'+k.puzzleid);
		var rs = this.db.execute('SELECT * FROM pzldata');
		while(rs.isValidRow()){
			var src = {};
			for(var i=0;i<rs.fieldCount();i++){ src[rs.fieldName(i)] = rs.field(i);}
			this.DBlist.push(src);
			rs.next();
		}
		rs.close();

		this.db.execute('DROP TABLE IF EXISTS pzldata');
		this.db.execute('CREATE TABLE IF NOT EXISTS pzldata (id int primary key,col,row,hard,pdata,time,comment)');

		for(var r=0;r<this.DBlist.length;r++){
			var row=this.DBlist[r];
			this.db.execute('INSERT INTO pzldata VALUES(?,?,?,?,?,?,?)',[row.id,row.col,row.row,row.hard,row.pdata,row.time,row.comment]);
		}

		this.db.close();
	},

	updateManager : function(flag){
		var count = -1;
		if(this.DBtype==1){
			if(!flag){
				this.db.open('pzprv3_'+k.puzzleid);
				var rs = this.db.execute('SELECT COUNT(*) FROM pzldata');
				count = (rs.isValidRow()?rs.field(0):0);
				this.db.close();
			}
			else{ count=this.DBlist.length;}

			this.dbmgr.open('pzprv3_manage');
			this.dbmgr.execute('INSERT OR REPLACE INTO manage VALUES(?,?,?,?)',[k.puzzleid,'1.0',count,mf((new Date()).getTime()/1000)]);
			this.dbmgr.close();
		}
		else if(this.DBtype==2){
			if(!flag){
				this.db.transaction(function(tx){
					tx.executeSql('SELECT COUNT(*) FROM pzldata',function(){},function(tx,rs){ count = rs.rows[0];});
				});
			}
			else{ count=this.DBlist.length;}

			this.dbmgr.transaction(function(tx){
				tx.executeSql('INSERT OR REPLACE INTO manage VALUES(?,?,?,?)',[k.puzzleid,'1.0',count,mf((new Date()).getTime()/1000)]);
			});
		}
	},

	//---------------------------------------------------------------------------
	// fio.displayDataTableList() �ۑ����Ă���f�[�^�̈ꗗ��\������
	// fio.ni()                   �������1���Ȃ�0������
	// fio.getDataTableList()     �ۑ����Ă���f�[�^�̈ꗗ���擾����
	//---------------------------------------------------------------------------
	displayDataTableList : function(){
		if(this.DBtype>0){
			switch(document.database.sorts.value){
				case 'idlist':  this.DBlist = this.DBlist.sort(function(a,b){ return (a.id-b.id);}); break;
				case 'newsave': this.DBlist = this.DBlist.sort(function(a,b){ return (b.time-a.time || a.id-b.id);}); break;
				case 'oldsave': this.DBlist = this.DBlist.sort(function(a,b){ return (a.time-b.time || a.id-b.id);}); break;
				case 'size':    this.DBlist = this.DBlist.sort(function(a,b){ return (a.col-b.col || a.row-b.row || a.hard-b.hard || a.id-b.id);}); break;
			}

			var html = "";
			for(var i=0;i<this.DBlist.length;i++){
				var row = this.DBlist[i];
				if(!row){ alert(i);}
				var src = ((row.id<10?"&nbsp;":"")+row.id+" :&nbsp;");
				var dt = new Date(); dt.setTime(row.time*1000);
				src += (" "+this.ni(dt.getFullYear()%100)+"/"+this.ni(dt.getMonth()+1)+"/"+this.ni(dt.getDate())+" "+this.ni(dt.getHours())+":"+this.ni(dt.getMinutes()) + "&nbsp;&nbsp;");
				src += (""+row.col+"�~"+row.row+"&nbsp;&nbsp;");
				if     (lang.isJP()){ src += ({0:'�|',1:'�炭�炭',2:'���Ă���',3:'�����ւ�',4:'�A�[��'}[row.hard]);}
				else if(lang.isEN()){ src += ({0:'-',1:'Easy',2:'Normal',3:'Hard',4:'Expert'}[row.hard]);}
				html += ("<option value=\""+row.id+"\""+(this.DBsid==row.id?" selected":"")+">"+src+"</option>\n");
			}
			html += ("<option value=\"new\""+(this.DBsid==-1?" selected":"")+">&nbsp;&lt;�V�����ۑ�����&gt;</option>\n");
			document.database.datalist.innerHTML = html;

			this.selectDataTable();
		}
	},
	ni : function(num){ return (num<10?"0"+num:""+num);},
	getDataTableList : function(){
		this.DBlist = new Array();
		if(this.DBtype==1){
			this.db.open('pzprv3_'+k.puzzleid);
			var rs = this.db.execute('SELECT * FROM pzldata');
			while(rs.isValidRow()){
				var src = {};
				for(var i=0;i<rs.fieldCount();i++){ src[rs.fieldName(i)] = rs.field(i);}
				this.DBlist.push(src);
				rs.next();
			}
			rs.close();
			this.db.close();
			this.displayDataTableList();
		}
		else if(this.DBtype==2){
			var self = this;
			this.db.transaction(function(tx){
				tx.executeSql('SELECT * FROM pzldata',[],function(tx,rs){
				for(var r=0;r<rs.rows.length;r++){ self.DBlist.push(rs.rows[r]);}
				self.DBlist = rs;
				self.displayDataTableList();
			}); });
		}
	},

	//---------------------------------------------------------------------------
	// fio.upDataTable()        �f�[�^�̈ꗗ�ł̈ʒu���ЂƂ�ɂ���
	// fio.downDataTable()      �f�[�^�̈ꗗ�ł̈ʒu���ЂƂ��ɂ���
	// fio.convertDataTableID() �f�[�^��ID��t������
	//---------------------------------------------------------------------------
	upDataTable : function(){
		var selected = this.getDataID();
		if(this.DBtype==0 || selected==-1 || selected==0){ return;}

		this.convertDataTableID(selected, selected-1);
	},
	downDataTable : function(){
		var selected = this.getDataID();
		if(this.DBtype==0 || selected==-1 || selected==this.DBlist.length-1){ return;}

		this.convertDataTableID(selected, selected+1);
	},
	convertDataTableID : function(selected,target){
		var sid = this.DBsid;
		var tid = this.DBlist[target].id;
		this.DBsid = tid;

		this.DBlist[selected].id = tid;
		this.DBlist[target].id   = sid;

		if(this.DBtype==1){
			this.db.open('pzprv3_'+k.puzzleid);
			this.db.execute('UPDATE pzldata SET id=? WHERE ID==?',[0  ,sid]);
			this.db.execute('UPDATE pzldata SET id=? WHERE ID==?',[sid,tid]);
			this.db.execute('UPDATE pzldata SET id=? WHERE ID==?',[tid,  0]);
			this.db.close();

			this.displayDataTableList();
		}
		else if(this.DBtype==2){
			var self = this;
			this.db.transaction(function(tx){
				tx.executeSql('UPDATE pzldata SET id=? WHERE ID==?',[0  ,sid]);
				tx.executeSql('UPDATE pzldata SET id=? WHERE ID==?',[sid,tid]);
				tx.executeSql('UPDATE pzldata SET id=? WHERE ID==?',[tid,  0]);
			},f_true,self.displayDataTableList);
		}

		this.updateManager(true);
	},

	//---------------------------------------------------------------------------
	// fio.getDataID()       �f�[�^��ID���擾����
	// fio.selectDataTable() �f�[�^��I�����āA�R�����g�Ȃǂ�\������
	//---------------------------------------------------------------------------
	getDataID : function(){
		if(document.database.datalist.value!="new" && document.database.datalist.value!=""){
			for(var i=0;i<this.DBlist.length;i++){
				if(this.DBlist[i].id==document.database.datalist.value){ return i;}
			}
		}
		return -1;
	},
	selectDataTable : function(){
		var selected = this.getDataID();
		if(selected>=0){
			document.database.comtext.value = ""+this.DBlist[selected].comment;
			this.DBsid = this.DBlist[selected].id;
		}
		else{
			document.database.comtext.value = "";
			this.DBsid = -1;
		}

		document.database.tableup.disabled = (document.database.sorts.value!='idlist' || this.DBsid==-1 || this.DBsid==1);
		document.database.tabledn.disabled = (document.database.sorts.value!='idlist' || this.DBsid==-1 || this.DBsid==this.DBlist.length);
		document.database.comedit.disabled = (this.DBsid==-1);
		document.database.difedit.disabled = (this.DBsid==-1);
		document.database.open.disabled    = (this.DBsid==-1);
		document.database.del.disabled     = (this.DBsid==-1);
	},

	//---------------------------------------------------------------------------
	// fio.openDataTable()   �f�[�^�̔Ֆʂɓǂݍ���
	// fio.saveDataTable()   �f�[�^�̔Ֆʂ�ۑ�����
	//---------------------------------------------------------------------------
	openDataTable : function(){
		var id = this.getDataID();
		if(id==-1 || !confirm("���̃f�[�^��ǂݍ��݂܂����H (���݂̔Ֆʂ͔j������܂�)")){ return;}

		if(this.DBtype==1){
			this.db.open('pzprv3_'+k.puzzleid);

			var id = this.getDataID();
			var rs = this.db.execute('SELECT * FROM pzldata WHERE ID==?',[this.DBlist[id].id]);
			this.fileopen(rs.field(4).split("/"),1);

			rs.close();
			this.db.close();
		}
		else if(this.DBtype==2){
			var self = this;
			this.db.transaction(function(tx){
				tx.executeSql('SELECT * FROM pzldata WHERE ID==?',[self.DBlist[id].id],
					function(tx,rs){ self.fileopen(rs.rows[0].pdata.split("/"),1); }
				);
			});
		}
	},
	saveDataTable : function(){
		var id = this.getDataID();
		if(this.DBtype==0 || (id!=-1 && !confirm("���̃f�[�^�ɏ㏑�����܂����H"))){ return;}

		var time = mf((new Date()).getTime()/1000);
		var pdata = this.filesavestr(1);
		var str = "";
		if(id==-1){ str = prompt("�R�����g������ꍇ�͓��͂��Ă��������B",""); if(str==null){ str="";} }
		else      { str = this.DBlist[this.getDataID()].comment;}

		if(this.DBtype==1){
			this.db.open('pzprv3_'+k.puzzleid);
			if(id==-1){
				id = this.DBlist.length+1;
				this.db.execute('INSERT INTO pzldata VALUES(?,?,?,?,?,?,?)',[id,k.qcols,k.qrows,0,pdata,time,str]);
			}
			else{
				id = document.database.datalist.value;
				this.db.execute('INSERT OR REPLACE INTO pzldata VALUES(?,?,?,?,?,?,?)',[id,k.qcols,k.qrows,0,pdata,time,str]);
			}
			this.db.close();
			this.getDataTableList();
		}
		else if(this.DBtype==2){
			var self = this;
			if(id==-1){
				id = this.DBlist.length+1;
				this.db.transaction(function(tx){
					tx.executeSql('INSERT INTO pzldata VALUES(?,?,?,?,?,?,?)',[id,k.qcols,k.qrows,0,pdata,time,str]);
				},f_true,self.getDataTableList);
			}
			else{
				id = document.database.datalist.value;
				this.db.transaction(function(tx){
					tx.executeSql('INSERT OR REPLACE INTO pzldata VALUES(?,?,?,?,?,?,?)',[id,k.qcols,k.qrows,0,pdata,time,str]);
				},f_true,self.getDataTableList);
			}
		}

		this.updateManager(true);
	},

	//---------------------------------------------------------------------------
	// fio.editComment()   �f�[�^�̃R�����g���X�V����
	// fio.editDifficult() �f�[�^�̓�Փx���X�V����
	//---------------------------------------------------------------------------
	editComment : function(){
		var id = this.getDataID();
		if(this.DBtype==0 || id==-1){ return;}

		var str = prompt("���̖��ɑ΂���R�����g����͂��Ă��������B",this.DBlist[id].comment);
		if(str==null){ return;}

		this.DBlist[id].comment = str;

		if(this.DBtype==1){
			this.db.open('pzprv3_'+k.puzzleid);

			this.db.execute('UPDATE pzldata SET comment=? WHERE ID==?',[str,this.DBlist[id].id]);
			this.db.close();

			this.displayDataTableList();
		}
		else if(this.DBtype==2){
			var self = this;
			this.db.transaction(function(tx){
				tx.executeSql('UPDATE pzldata SET comment=? WHERE ID==?',[str,self.DBlist[id].id]);
			},f_true,self.displayDataTableList);
		}

		this.updateManager(true);
	},
	editDifficult : function(){
		var id = this.getDataID();
		if(this.DBtype==0 || id==-1){ return;}

		var hard = prompt("���̖��̓�Փx��ݒ肵�Ă��������B\n[0:�Ȃ� 1:�炭�炭 2:���Ă��� 3:�����ւ� 4:�A�[��]",this.DBlist[id].hard);
		if(hard==null){ return;}

		this.DBlist[id].hard = ((hard=='1'||hard=='2'||hard=='3'||hard=='4')?hard:0);

		if(this.DBtype==1){
			this.db.open('pzprv3_'+k.puzzleid);

			this.db.execute('UPDATE pzldata SET hard=? WHERE ID==?',[hard,this.DBlist[id].id]);
			this.db.close();

			this.displayDataTableList();
		}
		else if(this.DBtype==2){
			var self = this;
			this.db.transaction(function(tx){
				tx.executeSql('UPDATE pzldata SET hard=? WHERE ID==?',[hard,self.DBlist[id].id]);
			},f_true,self.displayDataTableList);
		}

		this.updateManager(true);
	},

	//---------------------------------------------------------------------------
	// fio.deleteDataTable() �I�����Ă���Ֆʃf�[�^���폜����
	//---------------------------------------------------------------------------
	deleteDataTable : function(){
		var id = this.getDataID();
		if(this.DBtype==0 || id==-1 || !confirm("���̃f�[�^�����S�ɍ폜���܂����H")){ return;}

		if(this.DBtype==1){
			this.db.open('pzprv3_'+k.puzzleid);

			this.db.execute('DELETE FROM pzldata WHERE ID==?',[this.DBlist[id].id]);

			this.DBlist = this.DBlist.sort(function(a,b){ return (a.id-b.id);});
			for(var i=id+1;i<this.DBlist.length;i++){
				this.db.execute('UPDATE pzldata SET id=? WHERE ID==?',[this.DBlist[i].id-1,this.DBlist[i].id]);
				this.DBlist[i].id--;
				this.DBlist[i-1] = this.DBlist[i];
			}
			this.DBlist.splice(this.DBlist.length-1,1);

			this.db.close();
			this.displayDataTableList();
		}
		else if(this.DBtype==2){
			var self = this;
			this.db.transaction(function(tx){
				tx.executeSql('DELETE FROM pzldata WHERE ID==?',[self.DBlist[id].id]);
				self.DBlist = self.DBlist.sort(function(a,b){ return (a.id-b.id);});
				for(var i=id+1;i<self.DBlist.length;i++){
					tx.executeSql('UPDATE pzldata SET id=? WHERE ID==?',[self.DBlist[i].id-1,self.DBlist[i].id]);
					self.DBlist[i].id--;
					self.DBlist[i-1] = self.DBlist[i];
				}
				self.DBlist.splice(this.DBlist.length-1,1);
			},f_true,self.displayDataTableList);
		}

		this.updateManager(true);
	}
};
