// Filesys.js v3.3.0

//---------------------------------------------------------------------------
// ��FileIO�N���X �t�@�C���̃f�[�^�`���G���R�[�h/�f�R�[�h������
//---------------------------------------------------------------------------
FileIO = function(){
	this.filever = 0;
	this.lineseek = 0;
	this.dataarray = [];
	this.datastr = "";
	this.urlstr = "";

	// �萔(�t�@�C���`��)
	this.PZPR = 1;
	this.PBOX = 2;

	this.dbm = new DataBaseManager();
};
FileIO.prototype = {
	//---------------------------------------------------------------------------
	// fio.filedecode() �t�@�C�����J�����A�t�@�C���f�[�^����̃f�R�[�h���s�֐�
	//                  [menu.ex.fileopen] -> [fileio.xcg@iframe] -> [����]
	//---------------------------------------------------------------------------
	filedecode : function(datastr){
		this.filever = 0;
		this.lineseek = 0;
		this.dataarray = datastr.split("/");
		var type = this.PZPR;

		// �w�b�_�̏���
		if(this.readLine().match(/pzprv3\.?(\d+)?/)){
			if(RegExp.$1){ this.filever = parseInt(RegExp.$1);}
			if(this.readLine()!=k.puzzleid){ alert(base.getPuzzleName()+'�̃t�@�C���ł͂���܂���B'); return;}
			type = this.PZPR;
		}
		else{
			this.lineseek = 0;
			type = this.PBOX;
		}

		// �T�C�Y��\��������
		var row, col;
		if(k.puzzleid!=="sudoku"){
			row = parseInt(this.readLine(), 10);
			col = parseInt(this.readLine(), 10);
			if(type===2 && k.puzzleid==="kakuro"){ row--; col--;}
		}
		else{
			row = col = parseInt(this.readLine(), 10);
		}
		if(row<=0 || col<=0){ return;}
		bd.initBoardSize(col, row); // �Ֆʂ��w�肳�ꂽ�T�C�Y�ŏ�����

		// ���C������
		um.disableRecord(); um.disableInfo();
		if     (type===1){ this.decodeData();}
		else if(type===2){ this.kanpenOpen();}
		um.enableRecord(); um.enableInfo();

		this.dataarray = null; // �d���Ȃ肻���Ȃ̂ŏ�����

		base.resetInfo(true);
		base.resize_canvas();
	},
	//---------------------------------------------------------------------------
	// fio.fileencode() �t�@�C��������ւ̃G���R�[�h�A�t�@�C���ۑ����s�֐�
	//                  [[menu.ex.filesave] -> [����]] -> [fileio.xcg@iframe]
	//---------------------------------------------------------------------------
	fileencode : function(type){
		this.filever = 0;
		this.sizestr = "";
		this.datastr = "";
		this.urlstr = "";

		// ���C������
		if     (type===this.PZPR){ this.encodeData();}
		else if(type===this.PBOX){ this.kanpenSave();}

		// �T�C�Y��\��������
		if(!this.sizestr){ this.sizestr = [k.qrows, k.qcols].join("/");}
		this.datastr = [this.sizestr, this.datastr].join("/");

		// �w�b�_�̏���
		if(type===1){
			var header = (this.filever===0 ? "pzprv3" : ("pzprv3."+this.filever));
			this.datastr = [header, k.puzzleid, this.datastr].join("/");
		}
		var bstr = this.datastr;

		// ������URL�ǉ�����
		if(type===1){
			this.urlstr = enc.pzloutput((!k.isKanpenExist || k.puzzleid==="lits") ? enc.PZPRV3 : enc.KANPEN);
		}

		return bstr;
	},

	//---------------------------------------------------------------------------
	// fio.readLine()    �t�@�C���ɏ�����Ă���1�s�̕������Ԃ�
	// fio.readLines()   �t�@�C���ɏ�����Ă��镡���s�̕������Ԃ�
	// fio.getItemList() �t�@�C���ɏ�����Ă�����s�{�X�y�[�X��؂��
	//                   �����s�̕������z��ɂ��ĕԂ�
	//---------------------------------------------------------------------------
	readLine : function(){
		this.lineseek++;
		return this.dataarray[this.lineseek-1];
	},
	readLines : function(rows){
		this.lineseek += rows;
		return this.dataarray.slice(this.lineseek-rows, this.lineseek);
	},

	getItemList : function(rows){
		var item = [];
		var array = this.readLines(rows);
		for(var i=0;i<array.length;i++){
			var array1 = array[i].split(" ");
			var array2 = [];
			for(var c=0;c<array1.length;c++){
				if(array1[c]!=""){ array2.push(array1[c]);}
			}
			item = item.concat(array2);
		}
		return item;
	},

	//---------------------------------------------------------------------------
	// fio.decodeObj()     �z��ŁA�ʕ����񂩂�ʃZ���Ȃǂ̐ݒ���s��
	// fio.decodeCell()    �z��ŁA�ʕ����񂩂�ʃZ���̐ݒ���s��
	// fio.decodeCross()   �z��ŁA�ʕ����񂩂��Cross�̐ݒ���s��
	// fio.decodeBorder()  �z��ŁA�ʕ����񂩂��Border(�O�g��Ȃ�)�̐ݒ���s��
	// fio.decodeBorder2() �z��ŁA�ʕ����񂩂��Border(�O�g�゠��)�̐ݒ���s��
	//---------------------------------------------------------------------------
	decodeObj : function(func, width, height, getid){
		var item = this.getItemList(height);
		for(var i=0;i<item.length;i++){ func(getid(i%width,mf(i/width)), item[i]);}
	},
	decodeCell   : function(func){
		this.decodeObj(func, k.qcols  , k.qrows  , function(cx,cy){return bd.cnum(cx,cy);});
	},
	decodeCross  : function(func){
		this.decodeObj(func, k.qcols+1, k.qrows+1, function(cx,cy){return bd.xnum(cx,cy);});
	},
	decodeBorder : function(func){
		this.decodeObj(func, k.qcols-1, k.qrows  , function(cx,cy){return bd.bnum(2*cx+2,2*cy+1);});
		this.decodeObj(func, k.qcols  , k.qrows-1, function(cx,cy){return bd.bnum(2*cx+1,2*cy+2);});
	},
	decodeBorder2: function(func){
		this.decodeObj(func, k.qcols+1, k.qrows  , function(cx,cy){return bd.bnum(2*cx  ,2*cy+1);});
		this.decodeObj(func, k.qcols  , k.qrows+1, function(cx,cy){return bd.bnum(2*cx+1,2*cy  );});
	},

	//---------------------------------------------------------------------------
	// fio.encodeObj()     �ʃZ���f�[�^������ʕ�����̐ݒ���s��
	// fio.encodeCell()    �ʃZ���f�[�^����ʕ�����̐ݒ���s��
	// fio.encodeCross()   ��Cross�f�[�^����ʕ�����̐ݒ���s��
	// fio.encodeBorder()  ��Border�f�[�^(�O�g��Ȃ�)����ʕ�����̐ݒ���s��
	// fio.encodeBorder2() ��Border�f�[�^(�O�g�゠��)����ʕ�����̐ݒ���s��
	//---------------------------------------------------------------------------
	encodeObj : function(func, width, height, getid){
		for(var cy=0;cy<height;cy++){
			for(var cx=0;cx<width;cx++){
				this.datastr += func(getid(cx,cy));
			}
			this.datastr += "/";
		}
	},
	encodeCell   : function(func){
		this.encodeObj(func, k.qcols  , k.qrows  , function(cx,cy){return bd.cnum(cx,cy);});
	},
	encodeCross  : function(func){
		this.encodeObj(func, k.qcols+1, k.qrows+1, function(cx,cy){return bd.xnum(cx,cy);});
	},
	encodeBorder : function(func){
		this.encodeObj(func, k.qcols-1, k.qrows  , function(cx,cy){return bd.bnum(2*cx+2,2*cy+1);})
		this.encodeObj(func, k.qcols  , k.qrows-1, function(cx,cy){return bd.bnum(2*cx+1,2*cy+2);});
	},
	encodeBorder2: function(func){
		this.encodeObj(func, k.qcols+1, k.qrows  , function(cx,cy){return bd.bnum(2*cx  ,2*cy+1);})
		this.encodeObj(func, k.qcols  , k.qrows+1, function(cx,cy){return bd.bnum(2*cx+1,2*cy  );});
	},

	//---------------------------------------------------------------------------
	// fio.decodeCellQues41_42() ���ۂƔ��ۂ̃f�R�[�h���s��
	// fio.encodeCellQues41_42() ���ۂƔ��ۂ̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQues41_42 : function(){
		this.decodeCell( function(c,ca){
			if     (ca === "-"){ bd.sQnC(c, -2);}
			else if(ca === "1"){ bd.sQuC(c, 41);}
			else if(ca === "2"){ bd.sQuC(c, 42);}
		});
	},
	encodeCellQues41_42 : function(){
		this.encodeCell( function(c){
			if     (bd.QuC(c)===41){ return "1 ";}
			else if(bd.QuC(c)===42){ return "2 ";}
			else if(bd.QnC(c)===-2){ return "- ";}
			else                   { return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellQnum() ��萔���̃f�R�[�h���s��
	// fio.encodeCellQnum() ��萔���̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQnum : function(){
		this.decodeCell( function(c,ca){
			if     (ca === "-"){ bd.sQnC(c, -2);}
			else if(ca !== "."){ bd.sQnC(c, parseInt(ca));}
		});
	},
	encodeCellQnum : function(){
		this.encodeCell( function(c){
			if     (bd.QnC(c)>=0)  { return (bd.QnC(c).toString() + " ");}
			else if(bd.QnC(c)===-2){ return "- ";}
			else                   { return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellQnumb() ���{��萔���̃f�R�[�h���s��
	// fio.encodeCellQnumb() ���{��萔���̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQnumb : function(){
		this.decodeCell( function(c,ca){
			if     (ca === "5"){ bd.sQnC(c, -2);}
			else if(ca !== "."){ bd.sQnC(c, parseInt(ca));}
		});
	},
	encodeCellQnumb : function(){
		this.encodeCell( function(c){
			if     (bd.QnC(c)>=0)  { return (bd.QnC(c).toString() + " ");}
			else if(bd.QnC(c)===-2){ return "5 ";}
			else                   { return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellQnumAns() ��萔���{���}�X���}�X�̃f�R�[�h���s��
	// fio.encodeCellQnumAns() ��萔���{���}�X���}�X�̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQnumAns : function(){
		this.decodeCell( function(c,ca){
			if     (ca === "#"){ bd.setBlack(c);}
			else if(ca === "+"){ bd.sQsC(c, 1);}
			else if(ca === "-"){ bd.sQnC(c, -2);}
			else if(ca !== "."){ bd.sQnC(c, parseInt(ca));}
		});
	},
	encodeCellQnumAns : function(){
		this.encodeCell( function(c){
			if     (bd.QnC(c)>=0) { return (bd.QnC(c).toString() + " ");}
			else if(bd.QnC(c)===-2){return "- ";}
			else if(bd.isBlack(c)){ return "# ";}
			else if(bd.QsC(c)===1){ return "+ ";}
			else                  { return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellDirecQnum() �����{��萔���̃f�R�[�h���s��
	// fio.encodeCellDirecQnum() �����{��萔���̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellDirecQnum : function(){
		this.decodeCell( function(c,ca){
			if(ca !== "."){
				var inp = ca.split(",");
				bd.sDiC(c, (inp[0]!=="0"?parseInt(inp[0]): 0));
				bd.sQnC(c, (inp[1]!=="-"?parseInt(inp[1]):-2));
			}
		});
	},
	encodeCellDirecQnum : function(){
		this.encodeCell( function(c){
			if(bd.QnC(c)!==-1){
				var ca1 = (bd.DiC(c)!== 0?(bd.DiC(c)).toString():"0");
				var ca2 = (bd.QnC(c)!==-2?(bd.QnC(c)).toString():"-");
				return ""+ca1+","+ca2+" ";
			}
			else{ return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellAns() ���}�X���}�X�̃f�R�[�h���s��
	// fio.encodeCellAns() ���}�X���}�X�̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellAns : function(){
		this.decodeCell( function(c,ca){
			if     (ca === "#"){ bd.setBlack(c);}
			else if(ca === "+"){ bd.sQsC(c, 1); }
		});
	},
	encodeCellAns : function(){
		this.encodeCell( function(c){
			if     (bd.isBlack(c)){ return "# ";}
			else if(bd.QsC(c)===1){ return "+ ";}
			else                  { return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellQanssub() �񓚐����Ɣw�i�F�̃f�R�[�h���s��
	// fio.encodeCellQanssub() �񓚐����Ɣw�i�F�̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQanssub : function(){
		this.decodeCell( function(c,ca){
			if     (ca === "+"){ bd.sQsC(c, 1);}
			else if(ca === "-"){ bd.sQsC(c, 2);}
			else if(ca === "="){ bd.sQsC(c, 3);}
			else if(ca === "%"){ bd.sQsC(c, 4);}
			else if(ca !== "."){ bd.sQaC(c, parseInt(ca));}
		});
	},
	encodeCellQanssub : function(){
		this.encodeCell( function(c){
			//if(bd.QuC(c)!=0 || bd.QnC(c)!=-1){ return ". ";}
			if     (bd.QaC(c)!==-1){ return (bd.QaC(c).toString() + " ");}
			else if(bd.QsC(c)===1 ){ return "+ ";}
			else if(bd.QsC(c)===2 ){ return "- ";}
			else if(bd.QsC(c)===3 ){ return "= ";}
			else if(bd.QsC(c)===4 ){ return "% ";}
			else                   { return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellQsub() �w�i�F�̃f�R�[�h���s��
	// fio.encodeCellQsub() �w�i�F�̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQsub : function(){
		this.decodeCell( function(c,ca){
			if(ca != "0"){ bd.sQsC(c, parseInt(ca));}
		});
	},
	encodeCellQsub : function(){
		this.encodeCell( function(c){
			if     (bd.QsC(c)>0){ return (bd.QsC(c).toString() + " ");}
			else                { return "0 ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCrossNum() ��_�̐����̃f�R�[�h���s��
	// fio.encodeCrossNum() ��_�̐����̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCrossNum : function(){
		this.decodeCross( function(c,ca){
			if     (ca === "-"){ bd.sQnX(c, -2);}
			else if(ca !== "."){ bd.sQnX(c, parseInt(ca));}
		});
	},
	encodeCrossNum : function(){
		this.encodeCross( function(c){
			if     (bd.QnX(c)>=0)  { return (bd.QnX(c).toString() + " ");}
			else if(bd.QnX(c)===-2){ return "- ";}
			else                   { return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeBorderQues() ���̋��E���̃f�R�[�h���s��
	// fio.encodeBorderQues() ���̋��E���̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeBorderQues : function(){
		this.decodeBorder( function(c,ca){
			if(ca === "1"){ bd.sQuB(c, 1);}
		});
	},
	encodeBorderQues : function(){
		this.encodeBorder( function(c){
			if     (bd.QuB(c)===1){ return "1 ";}
			else                  { return "0 ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeBorderLine() Line�̃f�R�[�h���s��
	// fio.encodeBorderLine() Line�̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeBorderLine : function(){
		var svfunc = bd.isLineNG;
		bd.isLineNG = function(id){ return false;};

		this.decodeBorder( function(c,ca){
			if     (ca === "-1"){ bd.sQsB(c, 2);}
			else if(ca !== "0" ){ bd.sLiB(c, parseInt(ca));}
		});

		bd.isLineNG = svfunc;
	},
	encodeBorderLine : function(){
		this.encodeBorder( function(c){
			if     (bd.LiB(c)>  0){ return ""+bd.LiB(c)+" ";}
			else if(bd.QsB(c)===2){ return "-1 ";}
			else                  { return "0 ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeBorderAns() ���E�񓚂̋��E���̃f�R�[�h���s��
	// fio.encodeBorderAns() ���E�񓚂̋��E���̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeBorderAns : function(){
		this.decodeBorder( function(c,ca){
			if     (ca === "1" ){ bd.sQaB(c, 1);}
			else if(ca === "2" ){ bd.sQaB(c, 1); bd.sQsB(c, 1);}
			else if(ca === "-1"){ bd.sQsB(c, 1);}
		});
	},
	encodeBorderAns : function(){
		this.encodeBorder( function(c){
			if     (bd.QaB(c)===1 && bd.QsB(c)===1){ return "2 ";}
			else if(bd.QaB(c)===1){ return "1 ";}
			else if(bd.QsB(c)===1){ return "-1 ";}
			else                  { return "0 ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeBorderAns2() ���E�񓚂̋��E���̃f�R�[�h(�O�g����)���s��
	// fio.encodeBorderAns2() ���E�񓚂̋��E���̃G���R�[�h(�O�g����)���s��
	//---------------------------------------------------------------------------
	decodeBorderAns2 : function(){
		this.decodeBorder2( function(c,ca){
			if     (ca === "1" ){ bd.sQaB(c, 1);}
			else if(ca === "2" ){ bd.sQsB(c, 1);}
			else if(ca === "3" ){ bd.sQaB(c, 1); bd.sQsB(c, 1);}
			else if(ca === "-1"){ bd.sQsB(c, 2);}
		});
	},
	encodeBorderAns2 : function(){
		this.encodeBorder2( function(c){
			if     (bd.QaB(c)===1 && bd.QsB(c)===1){ return "3 ";}
			else if(bd.QsB(c)===1){ return "2 ";}
			else if(bd.QaB(c)===1){ return "1 ";}
			else if(bd.QsB(c)===2){ return "-1 ";}
			else                  { return "0 ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeAreaRoom() �����̃f�R�[�h���s��
	// fio.encodeAreaRoom() �����̃G���R�[�h���s��
	// fio.decodeAnsAreaRoom() (�񓚗p)�����̃f�R�[�h���s��
	// fio.encodeAnsAreaRoom() (�񓚗p)�����̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeAreaRoom : function(){ this.decodeAreaRoom_com(true);},
	encodeAreaRoom : function(){ this.encodeAreaRoom_com(true);},
	decodeAnsAreaRoom : function(){ this.decodeAreaRoom_com(false);},
	encodeAnsAreaRoom : function(){ this.encodeAreaRoom_com(false);},

	decodeAreaRoom_com : function(isques){
		this.readLine();
		this.rdata2Border(isques, this.getItemList(k.qrows));

		area.resetRarea();
	},
	encodeAreaRoom_com : function(isques){
		var rinfo = area.getRoomInfo();

		this.datastr += (rinfo.max+"/");
		for(var c=0;c<bd.cellmax;c++){
			this.datastr += (""+(rinfo.id[c]-1)+" ");
			if((c+1)%k.qcols==0){ this.datastr += "/";}
		}
	},
	//---------------------------------------------------------------------------
	// fio.rdata2Border() ���͂��ꂽ�z�񂩂狫�E������͂���
	//---------------------------------------------------------------------------
	rdata2Border : function(isques, rdata){
		var func = (isques ? bd.sQuB : bd.sQaB);
		for(var id=0;id<bd.bdmax;id++){
			var cc1 = bd.border[id].cellcc[0], cc2 = bd.border[id].cellcc[1];
			func.apply(bd, [id, (cc1!=-1 && cc2!=-1 && rdata[cc1]!=rdata[cc2]?1:0)]);
		}
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellQnum51() [�_]�̃f�R�[�h���s��
	// fio.encodeCellQnum51() [�_]�̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQnum51 : function(){
		var item = this.getItemList(k.qrows+1);
		for(var i=0;i<item.length;i++) {
			var cx=i%(k.qcols+1)-1, cy=mf(i/(k.qcols+1))-1;
			if(item[i]!="."){
				if     (cy===-1){ bd.sDiE(bd.exnum(cx,cy), parseInt(item[i]));}
				else if(cx===-1){ bd.sQnE(bd.exnum(cx,cy), parseInt(item[i]));}
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
				if     (cx===-1 && cy==-1){ str += "0 ";}
				else if(cy===-1){ str += (""+bd.DiE(bd.exnum(cx,cy)).toString()+" ");}
				else if(cx===-1){ str += (""+bd.QnE(bd.exnum(cx,cy)).toString()+" ");}
				else{
					var c = bd.cnum(cx,cy);
					if(bd.QuC(c)===51){ str += (""+bd.QnC(c).toString()+","+bd.DiC(c).toString()+" ");}
					else{ str += ". ";}
				}
			}
			str += "/";
		}
		this.datastr += str;
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellQnum_kanpen() �J���y���p��萔���̃f�R�[�h���s��
	// fio.encodeCellQnum_kanpen() �J���y���p��萔���̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQnum_kanpen : function(){
		this.decodeCell( function(c,ca){
			if(ca != "."){ bd.sQnC(c, parseInt(ca));}
		});
	},
	encodeCellQnum_kanpen : function(){
		this.encodeCell( function(c){
			return (bd.QnC(c)>=0)?(bd.QnC(c).toString() + " "):". ";
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellQans_kanpen() �J���y���p�񓚐����̃f�R�[�h���s��
	// fio.encodeCellQans_kanpen() �J���y���p�񓚐����̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQans_kanpen : function(){
		this.decodeCell( function(c,ca){
			if(ca!="."&&ca!="0"){ bd.sQaC(c, parseInt(ca));}
		});
	},
	encodeCellQans_kanpen : function(){
		this.encodeCell( function(c){
			if     (bd.QnC(c)!=-1){ return ". ";}
			else if(bd.QaC(c)==-1){ return "0 ";}
			else                  { return ""+bd.QaC(c).toString()+" ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeCellQnumAns_kanpen() �J���y���p��萔���{���}�X���}�X�̃f�R�[�h���s��
	// fio.encodeCellQnumAns_kanpen() �J���y���p��萔���{���}�X���}�X�̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeCellQnumAns_kanpen : function(){
		this.decodeCell( function(c,ca){
			if     (ca == "#"){ bd.setBlack(c);}
			else if(ca == "+"){ bd.sQsC(c, 1);}
			else if(ca != "."){ bd.sQnC(c, parseInt(ca));}
		});
	},
	encodeCellQnumAns_kanpen : function(){
		this.encodeCell( function(c){
			if     (bd.QnC(c)>=0 ){ return (bd.QnC(c).toString() + " ");}
			else if(bd.isBlack(c)){ return "# ";}
			else if(bd.QsC(c)==1 ){ return "+ ";}
			else                  { return ". ";}
		});
	},
	//---------------------------------------------------------------------------
	// fio.decodeSquareRoom() �J���y���p�l�p�`�̕����̃f�R�[�h���s��
	// fio.encodeSquareRoom() �J���y���p�l�p�`�̕����̃G���R�[�h���s��
	// fio.decodeAnsSquareRoom() (�񓚗p)�J���y���p�l�p�`�̕����̃f�R�[�h���s��
	// fio.encodeAnsSquareRoom() (�񓚗p)�J���y���p�l�p�`�̕����̃G���R�[�h���s��
	//---------------------------------------------------------------------------
	decodeSquareRoom : function(){ this.decodeSquareRoom_com(true);},
	encodeSquareRoom : function(){ this.encodeSquareRoom_com(true);},
	decodeAnsSquareRoom : function(){ this.decodeSquareRoom_com(false);},
	encodeAnsSquareRoom : function(){ this.encodeSquareRoom_com(false);},

	decodeSquareRoom_com : function(isques){
		var rmax = parseInt(this.readLine());
		var barray = this.readLines(rmax);
		var rdata = [];
		for(var i=0;i<barray.length;i++){
			if(barray[i]==""){ break;}
			var pce = barray[i].split(" ");
			for(var n=0;n<4;n++){ if(!isNaN(pce[n])){ pce[n]=parseInt(pce[n]);} }

			var sp = {y1:pce[0], x1:pce[1], y2:pce[2], x2:pce[3]};
			if(isques && pce[4]!=""){ bd.sQnC(bd.cnum(sp.x1,sp.y1), parseInt(pce[4],10));}
			this.setRdataRect(rdata, i, sp);
		}
		this.rdata2Border(isques, rdata);

		area.resetRarea();
	},
	setRdataRect : function(rdata, i, sp){
		for(var cx=sp.x1;cx<=sp.x2;cx++){
			for(var cy=sp.y1;cy<=sp.y2;cy++){
				rdata[bd.cnum(cx,cy)] = i;
			}
		}
	},
	encodeSquareRoom_com : function(isques){
		var rinfo = area.getRoomInfo();

		this.datastr += (rinfo.max+"/");
		for(var id=1;id<=rinfo.max;id++){
			var d = ans.getSizeOfClist(rinfo.room[id].idlist,f_true);
			var num = (isques ? bd.QnC(area.getTopOfRoom(id)) : -1);
			this.datastr += (""+d.y1+" "+d.x1+" "+d.y2+" "+d.x2+" "+(num>=0 ? ""+num : "")+"/");
		}
	}
};

//---------------------------------------------------------------------------
// ��DataBaseManager�N���X Web SQL DataBase�p �f�[�^�x�[�X�̐ݒ�E�Ǘ����s��
//---------------------------------------------------------------------------
DataBaseManager = function(){
	this.dbh    = null;	// �f�[�^�x�[�X�n���h��

	//this.DBtype = 0;
	this.DBaccept = 0;	// �f�[�^�x�[�X�̃^�C�v 1:Gears 2:WebDB 4:IdxDB 8:localStorage

	this.DBsid  = -1;	// ���ݑI������Ă��郊�X�g����ID
	this.DBlist = [];	// ���݈ꗗ�ɂ�����̃��X�g
	this.keys = ['id', 'col', 'row', 'hard', 'pdata', 'time', 'comment']; // �L�[�̕���

	this.selectDBtype();
};
DataBaseManager.prototype = {
	//---------------------------------------------------------------------------
	// fio.dbm.selectDBtype() Web DataBase���g���邩�ǂ������肷��(�N����)
	// fio.dbm.requestGears() gears_init.js��ǂݏo�������肷��
	//---------------------------------------------------------------------------
	selectDBtype : function(){
		// HTML5 - Web localStorage����p
		if(!!window.localStorage){
			// Firefox�̓��[�J������localStorage���g���Ȃ�
			if(!k.br.Gecko || !!location.hostname){ this.DBaccept |= 0x08;}
		}

		// HTML5 - Web DataBase����p
		if(!!window.openDatabase){
			try{	// Opera10.50�΍�
				var dbtmp = openDatabase('pzprv3_manage', '1.0');	// Chrome3�΍�
				if(!!dbtmp){ this.DBaccept |= 0x02;}
			}
			catch(e){}
		}

		// �ȉ���Gears�p(gears_init.js�̔��胋�[�`��)
		// Google Chorme�p(����Gears�����݂��邩����)
		try{
			if((window.google && google.gears) || 
			   (k.br.Gecko && (typeof GearsFactory != 'undefined')) || 
			   (k.br.IE && !!window.ActiveXObject && (!!(new ActiveXObject('Gears.Factory')))) || 
			   (k.br.WebKit && navigator.mimeTypes["application/x-googlegears"]))
			{ this.DBaccept |= 0x01;}
		}
		catch(e){}
	},
	requireGears : function(){
		return !!(this.DBaccept & 0x01);
	},

	//---------------------------------------------------------------------------
	// fio.dbm.openDialog()    �f�[�^�x�[�X�_�C�A���O���J�������̏���
	// fio.dbm.openHandler()   �f�[�^�x�[�X�n���h�����J��
	//---------------------------------------------------------------------------
	openDialog : function(){
		this.openHandler();
		this.update();
	},
	openHandler : function(){
		// �f�[�^�x�[�X���J��
		var type = 0;
		if     (this.DBaccept & 0x08){ type = 4;}
		else if(this.DBaccept & 0x04){ type = 3;}
		else if(this.DBaccept & 0x02){ type = 2;}
		else if(this.DBaccept & 0x01){ type = 1;}

		switch(type){
			case 1: case 2: this.dbh = new DataBaseHandler_SQL((type===2)); break;
			case 4:         this.dbh = new DataBaseHandler_LS(); break;
			default: return;
		}
		this.dbh.importDBlist(this);

		var sortlist = { idlist:"ID��", newsave:"�ۑ����V������", oldsave:"�ۑ����Â���", size:"�T�C�Y/��Փx��"};
		var str="";
		for(s in sortlist){ str += ("<option value=\""+s+"\">"+sortlist[s]+"</option>");}
		document.database.sorts.innerHTML = str;
	},

	//---------------------------------------------------------------------------
	// fio.dbm.closeDialog()   �f�[�^�x�[�X�_�C�A���O���������̏���
	// fio.dbm.clickHandler()  �t�H�[����̃{�^���������ꂽ���A�e�֐��ɃW�����v����
	//---------------------------------------------------------------------------
	closeDialog : function(){
		this.DBlist = [];
	},
	clickHandler : function(e){
		switch(ee.getSrcElement(e).name){
			case 'sorts'   : this.displayDataTableList();	// break���Ȃ��̂͂킴�Ƃł�
			case 'datalist': this.selectDataTable();   break;
			case 'tableup' : this.upDataTable_M();     break;
			case 'tabledn' : this.downDataTable_M();   break;
			case 'open'    : this.openDataTable_M();   break;
			case 'save'    : this.saveDataTable_M();   break;
			case 'comedit' : this.editComment_M();     break;
			case 'difedit' : this.editDifficult_M();   break;
			case 'del'     : this.deleteDataTable_M(); break;
		}
	},

	//---------------------------------------------------------------------------
	// fio.dbm.getDataID()  �I�𒆃f�[�^��(this.DBlist��key�ƂȂ�)ID���擾����
	// fio.dbm.update()     �Ǘ��e�[�u������_�C�A���O�̕\�����X�V����
	//---------------------------------------------------------------------------
	getDataID : function(){
		if(document.database.datalist.value!="new" && document.database.datalist.value!=""){
			for(var i=0;i<this.DBlist.length;i++){
				if(this.DBlist[i].id==document.database.datalist.value){ return i;}
			}
		}
		return -1;
	},
	update : function(){
		this.dbh.updateManageData(this);
			this.displayDataTableList();
			this.selectDataTable();
	},

	//---------------------------------------------------------------------------
	// fio.dbm.displayDataTableList() �ۑ����Ă���f�[�^�̈ꗗ��\������
	// fio.dbm.getRowString()         1�f�[�^���當����𐶐�����
	// fio.dbm.dateString()           �����̕�����𐶐�����
	//---------------------------------------------------------------------------
	displayDataTableList : function(){
			switch(document.database.sorts.value){
				case 'idlist':  this.DBlist = this.DBlist.sort(function(a,b){ return (a.id-b.id);}); break;
				case 'newsave': this.DBlist = this.DBlist.sort(function(a,b){ return (b.time-a.time || a.id-b.id);}); break;
				case 'oldsave': this.DBlist = this.DBlist.sort(function(a,b){ return (a.time-b.time || a.id-b.id);}); break;
				case 'size':    this.DBlist = this.DBlist.sort(function(a,b){ return (a.col-b.col || a.row-b.row || a.hard-b.hard || a.id-b.id);}); break;
			}

			var html = "";
			for(var i=0;i<this.DBlist.length;i++){
				var row = this.DBlist[i];
			if(!row){ continue;}//alert(i);}

			var valstr = " value=\""+row.id+"\"";
			var selstr = (this.DBsid==row.id?" selected":"");
			html += ("<option" + valstr + selstr + ">" + this.getRowString(row)+"</option>\n");
			}
			html += ("<option value=\"new\""+(this.DBsid==-1?" selected":"")+">&nbsp;&lt;�V�����ۑ�����&gt;</option>\n");
			document.database.datalist.innerHTML = html;
	},
	getRowString : function(row){
		var hardstr = [
			{ja:'�|'      , en:'-'     },
			{ja:'�炭�炭', en:'Easy'  },
			{ja:'���Ă���', en:'Normal'},
			{ja:'�����ւ�', en:'Hard'  },
			{ja:'�A�[��'  , en:'Expert'}
		];

		var str = "";
		str += ((row.id<10?"&nbsp;":"")+row.id+" :&nbsp;");
		str += (this.dateString(row.time*1000)+" &nbsp;");
		str += (""+row.col+"�~"+row.row+" &nbsp;");
		if(!!row.hard || row.hard=='0'){
			str += (hardstr[row.hard][menu.language]);
		}
		return str;
	},
	dateString : function(time){
		var ni   = function(num){ return (num<10?"0":"")+num;};
		var str  = " ";
		var date = new Date();
		date.setTime(time);

		str += (ni(date.getFullYear()%100) + "/" + ni(date.getMonth()+1) + "/" + ni(date.getDate())+" ");
		str += (ni(date.getHours()) + ":" + ni(date.getMinutes()));
		return str;
	},

	//---------------------------------------------------------------------------
	// fio.dbm.selectDataTable() �f�[�^��I�����āA�R�����g�Ȃǂ�\������
	//---------------------------------------------------------------------------
	selectDataTable : function(){
		var selected = this.getDataID();
		if(selected>=0){
			document.database.comtext.value = ""+this.DBlist[selected].comment;
			this.DBsid = parseInt(this.DBlist[selected].id);
		}
		else{
			document.database.comtext.value = "";
			this.DBsid = -1;
		}

		document.database.tableup.disabled = (document.database.sorts.value!=='idlist' || this.DBsid===-1 || this.DBsid===1);
		document.database.tabledn.disabled = (document.database.sorts.value!=='idlist' || this.DBsid===-1 || this.DBsid===this.DBlist.length);
		document.database.comedit.disabled = (this.DBsid===-1);
		document.database.difedit.disabled = (this.DBsid===-1);
		document.database.open.disabled    = (this.DBsid===-1);
		document.database.del.disabled     = (this.DBsid===-1);
	},

	//---------------------------------------------------------------------------
	// fio.dbm.upDataTable_M()      �f�[�^�̈ꗗ�ł̈ʒu���ЂƂ�ɂ���
	// fio.dbm.downDataTable_M()    �f�[�^�̈ꗗ�ł̈ʒu���ЂƂ��ɂ���
	// fio.dbm.convertDataTable_M() �f�[�^�̈ꗗ�ł̈ʒu�����ւ���
	//---------------------------------------------------------------------------
	upDataTable_M : function(){
		var selected = this.getDataID();
		if(selected===-1 || selected===0){ return;}
		this.convertDataTable_M(selected, selected-1);
	},
	downDataTable_M : function(){
		var selected = this.getDataID();
		if(selected===-1 || selected===this.DBlist.length-1){ return;}
		this.convertDataTable_M(selected, selected+1);
	},
	convertDataTable_M : function(sid, tid){
		this.DBsid = this.DBlist[tid].id;
		var row = {};
		for(var c=1;c<7;c++){ row[this.keys[c]]              = this.DBlist[sid][this.keys[c]];}
		for(var c=1;c<7;c++){ this.DBlist[sid][this.keys[c]] = this.DBlist[tid][this.keys[c]];}
		for(var c=1;c<7;c++){ this.DBlist[tid][this.keys[c]] = row[this.keys[c]];}

		this.dbh.convertDataTableID(this, sid, tid);
		this.update();
	},

	//---------------------------------------------------------------------------
	// fio.dbm.openDataTable_M()  �f�[�^�̔Ֆʂɓǂݍ���
	// fio.dbm.saveDataTable_M()  �f�[�^�̔Ֆʂ�ۑ�����
	//---------------------------------------------------------------------------
	openDataTable_M : function(){
		var id = this.getDataID(); if(id===-1){ return;}
		if(!confirm("���̃f�[�^��ǂݍ��݂܂����H (���݂̔Ֆʂ͔j������܂�)")){ return;}

		this.dbh.openDataTable(this, id);
	},
	saveDataTable_M : function(){
		var id = this.getDataID(), refresh = false;
			if(id===-1){
			id = this.DBlist.length;
			refresh = true;

			this.DBlist[id] = {};
			var str = prompt("�R�����g������ꍇ�͓��͂��Ă��������B","");
			this.DBlist[id].comment = (!!str ? str : '');
			this.DBlist[id].hard = 0;
			this.DBlist[id].id = id+1;
			this.DBsid = this.DBlist[id].id;
			}
			else{
			if(!confirm("���̃f�[�^�ɏ㏑�����܂����H")){ return;}
		}
		this.DBlist[id].col   = k.qcols;
		this.DBlist[id].row   = k.qrows;
		this.DBlist[id].time  = mf((new Date()).getTime()/1000);

		this.dbh.saveDataTable(this, id);
		this.update();
	},

	//---------------------------------------------------------------------------
	// fio.dbm.editComment_M()   �f�[�^�̃R�����g���X�V����
	// fio.dbm.editDifficult_M() �f�[�^�̓�Փx���X�V����
	//---------------------------------------------------------------------------
	editComment_M : function(){
		var id = this.getDataID(); if(id===-1){ return;}

		var str = prompt("���̖��ɑ΂���R�����g����͂��Ă��������B",this.DBlist[id].comment);
		if(str==null){ return;}

		this.DBlist[id].comment = str;
		this.dbh.updateComment(this, id);
		this.update();
	},
	editDifficult_M : function(){
		var id = this.getDataID(); if(id===-1){ return;}

		var hard = prompt("���̖��̓�Փx��ݒ肵�Ă��������B\n[0:�Ȃ� 1:�炭�炭 2:���Ă��� 3:�����ւ� 4:�A�[��]",this.DBlist[id].hard);
		if(hard==null){ return;}

		this.DBlist[id].hard = ((hard=='1'||hard=='2'||hard=='3'||hard=='4')?hard:0);
		this.dbh.updateDifficult(this, id);
		this.update();
	},

	//---------------------------------------------------------------------------
	// fio.dbm.deleteDataTable_M() �I�����Ă���Ֆʃf�[�^���폜����
	//---------------------------------------------------------------------------
	deleteDataTable_M : function(){
		var id = this.getDataID(); if(id===-1){ return;}
		if(!confirm("���̃f�[�^�����S�ɍ폜���܂����H")){ return;}

		var sID = this.DBlist[id].id, max = this.DBlist.length;
		for(var i=sID-1;i<max-1;i++){
			for(var c=1;c<7;c++){ this.DBlist[i][this.keys[c]] = this.DBlist[i+1][this.keys[c]];}
		}
		this.DBlist.pop();

		this.dbh.deleteDataTable(this, sID, max);
		this.update();
	}

	//---------------------------------------------------------------------------
	// fio.dbm.convertDataBase() ���������K�v�ɂȂ�����...
	//---------------------------------------------------------------------------
/*	convertDataBase : function(){
		// �����܂ŋ��f�[�^�x�[�X
		this.dbh.importDBlist(this);
		this.dbh.dropDataBase();

		// ��������V�f�[�^�x�[�X
		this.dbh.createDataBase();
		this.dbh.setupDBlist(this);
	}
*/
};

//---------------------------------------------------------------------------
// ��DataBaseHandler_LS�N���X Web localStorage�p �f�[�^�x�[�X�n���h��
//---------------------------------------------------------------------------
DataBaseHandler_LS = function(){
	this.pheader = 'pzprv3_' + k.puzzleid + ':puzdata';
	this.keys = fio.dbm.keys;

	this.initialize();
};
DataBaseHandler_LS.prototype = {
	//---------------------------------------------------------------------------
	// fio.dbm.dbh.initialize()    ���������Ƀf�[�^�x�[�X���J��
	// fio.dbm.dbh.importDBlist()  DataBase����DBlist���쐬����
	//---------------------------------------------------------------------------
	initialize : function(){
		this.createManageDataTable();
		this.createDataBase();
	},
	importDBlist : function(parent){
		parent.DBlist = [];
		var r=0;
		while(1){
			r++; var row = {};
			for(var c=0;c<7;c++){ row[this.keys[c]] = localStorage[this.pheader+'!'+r+'!'+this.keys[c]];}
			if(row.id==null){ break;}
			row.pdata = "";
			parent.DBlist.push(row);
		}
	},

	//---------------------------------------------------------------------------
	// fio.dbm.dbh.createManageDataTable() �Ǘ����e�[�u�����쐬����(�����͂Ȃ�)
	// fio.dbm.dbh.updateManageData()      �Ǘ���񃌃R�[�h���X�V����
	//---------------------------------------------------------------------------
	createManageDataTable : function(){
		localStorage['pzprv3_manage']        = 'DataBase';
		localStorage['pzprv3_manage:manage'] = 'Table';
	},
	updateManageData : function(parent){
		var mheader = 'pzprv3_manage:manage!'+k.puzzleid;
		localStorage[mheader+'!count'] = parent.DBlist.length;
		localStorage[mheader+'!time']  = mf((new Date()).getTime()/1000);
	},

	//---------------------------------------------------------------------------
	// fio.dbm.dbh.createDataBase()     �e�[�u�����쐬����
	//---------------------------------------------------------------------------
	createDataBase : function(){
		localStorage['pzprv3_'+k.puzzleid]            = 'DataBase';
		localStorage['pzprv3_'+k.puzzleid+':puzdata'] = 'Table';
	},

	//---------------------------------------------------------------------------
	// fio.dbm.dbh.convertDataTableID() �f�[�^��ID��t������
	//---------------------------------------------------------------------------
	convertDataTableID : function(parent, sid, tid){
		var sID = parent.DBlist[sid].id, tID = parent.DBlist[tid].id;
		var sheader=this.pheader+'!'+sID, theader=this.pheader+'!'+tID, row = {};
		for(var c=1;c<7;c++){ localStorage[sheader+'!'+this.keys[c]] = parent.DBlist[sid][this.keys[c]];}
		for(var c=1;c<7;c++){ localStorage[theader+'!'+this.keys[c]] = parent.DBlist[tid][this.keys[c]];}
	},

	//---------------------------------------------------------------------------
	// fio.dbm.dbh.openDataTable()   �f�[�^�̔Ֆʂɓǂݍ���
	// fio.dbm.dbh.saveDataTable()   �f�[�^�̔Ֆʂ�ۑ�����
	//---------------------------------------------------------------------------
	openDataTable : function(parent, id){
		var pdata = localStorage[this.pheader+'!'+parent.DBlist[id].id+'!pdata'];
		fio.filedecode(pdata);
	},
	saveDataTable : function(parent, id){
		var row = parent.DBlist[id];
		for(var c=0;c<7;c++){ localStorage[this.pheader+'!'+row.id+'!'+this.keys[c]] = (c!==4 ? row[this.keys[c]] : fio.fileencode(1));}
	},

	//---------------------------------------------------------------------------
	// fio.dbm.dbh.updateComment()   �f�[�^�̃R�����g���X�V����
	// fio.dbm.dbh.updateDifficult() �f�[�^�̓�Փx���X�V����
	//---------------------------------------------------------------------------
	updateComment : function(parent, id){
		var row = parent.DBlist[id];
		localStorage[this.pheader+'!'+row.id+'!comment'] = row.comment;
	},
	updateDifficult : function(parent, id){
		var row = parent.DBlist[id];
		localStorage[this.pheader+'!'+row.id+'!hard'] = row.hard;
	},
	//---------------------------------------------------------------------------
	// fio.dbm.dbh.deleteDataTable() �I�����Ă���Ֆʃf�[�^���폜����
	//---------------------------------------------------------------------------
	deleteDataTable : function(parent, sID, max){
		for(var i=parseInt(sID);i<max;i++){
			var headers = [this.pheader+'!'+(i+1), this.pheader+'!'+i];
			for(var c=1;c<7;c++){ localStorage[headers[1]+'!'+this.keys[c]] = localStorage[headers[0]+'!'+this.keys[c]];}
		}
		var dheader = this.pheader+'!'+max;
		for(var c=0;c<7;c++){ localStorage.removeItem(dheader+'!'+this.keys[c]);}
	}
};

//---------------------------------------------------------------------------
// ��DataBaseHandler_SQL�N���X Web SQL DataBase�p �f�[�^�x�[�X�n���h��
//---------------------------------------------------------------------------
DataBaseHandler_SQL = function(isSQLDB){
	this.db    = null;	// �p�Y���ʂ̃f�[�^�x�[�X
	this.dbmgr = null;	// pzprv3_manager�f�[�^�x�[�X
	this.isSQLDB = isSQLDB;

	this.initialize();
};
DataBaseHandler_SQL.prototype = {
	//---------------------------------------------------------------------------
	// fio.dbm.dbh.initialize()    ���������Ƀf�[�^�x�[�X���J��
	// fio.dbm.dbh.importDBlist()  DataBase����DBlist���쐬����
	// fio.dbm.dbh.setupDBlist()   DBlist�̃f�[�^��DataBase�ɑ������
	//---------------------------------------------------------------------------
	initialize : function(){
		var wrapper1 = new DataBaseObject_SQL(this.isSQLDB);
		var wrapper2 = new DataBaseObject_SQL(this.isSQLDB);

		this.dbmgr = wrapper1.openDatabase('pzprv3_manage', '1.0');
		this.db    = wrapper2.openDatabase('pzprv3_'+k.puzzleid, '1.0');

		this.createManageDataTable();
		this.createDataBase();
	},
	importDBlist : function(parent){
		parent.DBlist = [];
		this.db.transaction(
			function(tx){
				tx.executeSql('SELECT * FROM pzldata',[],function(tx,rs){
					var i=0, keys=parent.keys;
					for(var r=0;r<rs.rows.length;r++){
						parent.DBlist[i] = {};
						for(var c=0;c<7;c++){ parent.DBlist[i][keys[c]] = rs.rows.item(r)[keys[c]];}
						parent.DBlist[i].pdata = "";
						i++;
					}
				});
			},
			function(){ },
			function(){ fio.dbm.update();}
		);
	},
/*	setupDBlist : function(parent){
		for(var r=0;r<parent.DBlist.length;r++){
			this.saveDataTable(parent, r);
		}
	},
*/
	//---------------------------------------------------------------------------
	// fio.dbm.dbh.createManageDataTable() �Ǘ����e�[�u�����쐬����(�����͂Ȃ�)
	// fio.dbm.dbh.updateManageData()      �Ǘ���񃌃R�[�h���쐬�E�X�V����
	// fio.dbm.dbh.deleteManageData()      �Ǘ���񃌃R�[�h���폜����
	//---------------------------------------------------------------------------
	createManageDataTable : function(){
		this.dbmgr.transaction( function(tx){
			tx.executeSql('CREATE TABLE IF NOT EXISTS manage (puzzleid primary key,version,count,lastupdate)',[]);
		});
	},
	updateManageData : function(parent){
		var count = parent.DBlist.length;
		var time = mf((new Date()).getTime()/1000);
		this.dbmgr.transaction( function(tx){
			tx.executeSql('INSERT OR REPLACE INTO manage VALUES(?,?,?,?)', [k.puzzleid, '1.0', count, time]);
		});
	},
/*	deleteManageData : function(){
		this.dbmgr.transaction( function(tx){
			tx.executeSql('DELETE FROM manage WHERE puzzleid=?',[k.puzzleid]);
		});
	},
*/
	//---------------------------------------------------------------------------
	// fio.dbm.dbh.createDataBase()      �e�[�u�����쐬����
	// fio.dbm.dbh.dropDataBase()        �e�[�u�����폜����
	// fio.dbm.dbh.forcedeleteDataBase() �e�[�u�����폜����
	//---------------------------------------------------------------------------
	createDataBase : function(){
		this.db.transaction( function(tx){
			tx.executeSql('CREATE TABLE IF NOT EXISTS pzldata (id int primary key,col,row,hard,pdata,time,comment)',[]);
		});
	},
/*	dropDataBase : function(){
		this.db.transaction( function(tx){
			tx.executeSql('DROP TABLE IF EXISTS pzldata',[]);
		});
	},
	forceDeleteDataBase : function(parent){
		this.deleteManageData();
		this.dropDataBase();
	},*/

	//---------------------------------------------------------------------------
	// fio.dbm.dbh.convertDataTableID() �f�[�^��ID��t������
	//---------------------------------------------------------------------------
	convertDataTableID : function(parent, sid, tid){
		var sID = parent.DBlist[sid].id, tID = parent.DBlist[tid].id;
		this.db.transaction( function(tx){
			tx.executeSql('UPDATE pzldata SET id=? WHERE ID==?',[0  ,sID]);
			tx.executeSql('UPDATE pzldata SET id=? WHERE ID==?',[sID,tID]);
			tx.executeSql('UPDATE pzldata SET id=? WHERE ID==?',[tID,  0]);
		});
	},

	//---------------------------------------------------------------------------
	// fio.dbm.dbh.openDataTable()   �f�[�^�̔Ֆʂɓǂݍ���
	// fio.dbm.dbh.saveDataTable()   �f�[�^�̔Ֆʂ�ۑ�����
	//---------------------------------------------------------------------------
	openDataTable : function(parent, id){
		this.db.transaction( function(tx){
			tx.executeSql('SELECT * FROM pzldata WHERE ID==?',[parent.DBlist[id].id],
				function(tx,rs){ fio.filedecode(rs.rows.item(0)['pdata']);}
			);
		});
	},
	saveDataTable : function(parent, id){
		var row = parent.DBlist[id];
		this.db.transaction( function(tx){
			tx.executeSql('INSERT INTO pzldata VALUES(?,?,?,?,?,?,?)',[row.id,row.col,row.row,row.hard,fio.fileencode(1),row.time,row.comment]);
		});
	},

	//---------------------------------------------------------------------------
	// fio.dbm.dbh.updateComment()   �f�[�^�̃R�����g���X�V����
	// fio.dbm.dbh.updateDifficult() �f�[�^�̓�Փx���X�V����
	//---------------------------------------------------------------------------
	updateComment : function(parent, id){
		var row = parent.DBlist[id];
		this.db.transaction( function(tx){
			tx.executeSql('UPDATE pzldata SET comment=? WHERE ID==?',[row.comment, row.id]);
		});
	},
	updateDifficult : function(parent, id){
		var row = parent.DBlist[id];
		this.db.transaction( function(tx){
			tx.executeSql('UPDATE pzldata SET hard=? WHERE ID==?',[row.hard, row.id]);
		});
	},

	//---------------------------------------------------------------------------
	// fio.dbm.dbh.deleteDataTable() �I�����Ă���Ֆʃf�[�^���폜����
	//---------------------------------------------------------------------------
	deleteDataTable : function(parent, sID, max){
		this.db.transaction( function(tx){
			tx.executeSql('DELETE FROM pzldata WHERE ID==?',[sID]);
			for(var i=parseInt(sID);i<max;i++){
				tx.executeSql('UPDATE pzldata SET id=? WHERE ID==?',[i,i+1]);
			}
		});
	}
};

//---------------------------------------------------------------------------
// ��DataBaseObject_SQL�N���X  Web SQL DataBase�p �f�[�^�x�[�X�̃��b�p�[�N���X
//---------------------------------------------------------------------------
DataBaseObject_SQL = function(isSQLDB){
	this.name    = '';
	this.version = 0;
	this.isSQLDB = isSQLDB;

	this.object = null;
};
DataBaseObject_SQL.prototype = {
	openDatabase : function(name, ver){
		this.name    = name;
		this.version = ver;
		if(this.isSQLDB){
			this.object = openDatabase(this.name, this.version);
		}
		else{
			this.object = google.gears.factory.create('beta.database', this.version);
		}
		return this;
	},

	// Gears�p���b�p�[�݂����Ȃ���
	transaction : function(execfunc, errorfunc, compfunc){
		if(typeof errorfunc == 'undefined'){ errorfunc = f_true;}
		if(typeof compfunc  == 'undefined'){ compfunc  = f_true;}

		if(this.isSQLDB){
			// execfunc�̑�����tx��SQLTransaction�I�u�W�F�N�g(tx.executeSql�͉��̊֐����w���Ȃ�)
			this.object.transaction(execfunc, errorfunc, compfunc);
		}
		else{
			this.object.open(this.name);
			// execfunc�̑�����tx��this�ɂ��Ă���(tx.executeSql�͉��̊֐����w��)
			execfunc(this);
			this.object.close();

			compfunc();
		}
	},
	// Gears�p���b�p�[
	executeSql : function(statement, args, callback){
		var resultSet = this.object.execute(statement, args);
		// �ȉ���callback�p
		if(typeof callback != 'undefined'){
			var r=0, rows = {};
			rows.rowarray = [];
			while(resultSet.isValidRow()){
				var row = {};
				for(var i=0,len=resultSet.fieldCount();i<len;i++){
					row[i] = row[resultSet.fieldName(i)] = resultSet.field(i);
				}
				rows.rowarray[r] = row;
				resultSet.next();
				r++;
			}
			resultSet.close();

			rows.length = r;
			rows.item = function(r){ return this.rowarray[r];};

			var rs = {rows:rows};
			callback(this, rs);
		}
	}
};
