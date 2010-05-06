// Encode.js v3.3.0p2

//---------------------------------------------------------------------------
// ��Encode�N���X URL�̃G���R�[�h/�f�R�[�h������
//    p.html?(pid)/(qdata)
//                  qdata -> [(pflag)/](cols)/(rows)/(bstr)
//---------------------------------------------------------------------------
// URL�G���R�[�h/�f�R�[�h
// Encode�N���X
Encode = function(){
	this.uri = {};

	this.uri.type;		// ���͂��ꂽURL�̃T�C�g�w�蕔��
	this.uri.qdata;		// ���͂��ꂽURL�̖�蕔��

	this.uri.pflag;		// ���͂��ꂽURL�̃t���O����
	this.uri.cols;		// ���͂��ꂽURL�̉�������
	this.uri.rows;		// ���͂��ꂽURL�̏c������
	this.uri.bstr;		// ���͂��ꂽURL�̔Ֆʕ���

	this.pidKanpen = '';
	this.pidforURL = '';

	this.outpflag  = '';
	this.outsize   = '';
	this.outbstr   = '';

	// �萔(URL�`��)
	this.PZPRV3  = 0;
	this.PZPRV3E = 3;
	this.PAPRAPP = 1;
	this.KANPEN  = 2;
	this.KANPENP = 5;
	this.HEYAAPP = 4;
};
Encode.prototype = {
	//---------------------------------------------------------------------------
	// enc.init()           Encode�I�u�W�F�N�g�Ŏ��l������������
	// enc.first_parseURI() �N������URL����͂��āApuzzleid�̒��o��G�f�B�^/player������s��
	// enc.parseURI()       ���͂��ꂽURL���ǂ̃T�C�g�p�����肵��this.uri�ɒl��ۑ�����
	// enc.parseURI_xxx()   pzlURI����pflag,bstr���̕����ɕ�������
	//---------------------------------------------------------------------------
	init : function(){
		this.uri.type = this.PZPRV3;
		this.uri.qdata = "";

		this.uri.pflag = "";
		this.uri.cols = 0;
		this.uri.rows = 0;
		this.uri.bstr = "";

		this.outpflag  = '';
		this.outsize   = '';
		this.outbstr   = '';
	},

	first_parseURI : function(search){
		if(search.length<=0){ return "";}

		this.init();

		var startmode = 'PLAYER';

		if     (search=="?test")       { startmode = 'TEST';   search = 'country';}
		else if(search.match(/^\?m\+/)){ startmode = 'EDITOR'; search = search.substr(3);}
		else if(search.match(/_test/)) { startmode = 'TEST';   search = search.substr(1).replace(/_test/, '');}
		else if(search.match(/_edit/)) { startmode = 'EDITOR'; search = search.substr(1).replace(/_edit/, '');}
		else if(!search.match(/\//))   { startmode = 'EDITER'; search = search.substr(1);}
		else                           { startmode = 'PLAYER'; search = search.substr(1);}
		switch(startmode){
			case 'PLAYER': k.EDITOR = false; k.editmode = false; break;
			case 'EDITOR': k.EDITOR = true;  k.editmode = true;  break;
			case 'TEST'  : k.EDITOR = true;  k.editmode = false; k.scriptcheck = true; break;
		}
		k.PLAYER    = !k.EDITOR;
		k.playmode  = !k.editmode;

		var qs = search.indexOf("/");
		if(qs>=0){
			this.parseURI_pzpr(search.substr(qs+1));
			if(!!this.uri.cols){ k.qcols = this.uri.cols;}
			if(!!this.uri.rows){ k.qrows = this.uri.rows;}

			search = search.substr(0,qs);
		}

		// alias�@�\
		var pid = search;
		switch(pid){
			case 'yajilin'    : this.pidforURL = 'yajilin'; pid = 'yajirin'; break;
			case 'akari'      : this.pidforURL = 'akari';   pid = 'lightup'; break;
			case 'bijutsukan' : this.pidforURL = 'akari';   pid = 'lightup'; break;
			case 'slitherlink': this.pidforURL = pid = 'slither'; break;
			case 'numberlink' : this.pidforURL = pid = 'numlin';  break;
			case 'hakyukoka'  : this.pidforURL = pid = 'ripple';  break;
			case 'masyu'      : this.pidforURL = pid = 'mashu';   break;
			default           : this.pidforURL = pid;
		}
		k.puzzleid = pid;
	},
	parseURI : function(url){
		this.init();

		// textarea��̉��s�����ۂ̉��s�����ɂȂ�UA�ɑΉ�(Opera�Ƃ�)
		url = url.replace(/(\r|\n)/g,"");

		// �J���y���̏ꍇ
		if(url.match(/www\.kanpen\.net/) || url.match(/www\.geocities(\.co)?\.jp\/pencil_applet/) ){
			// �J���y�������ǃf�[�^�`���͂ւ�킯�A�v���b�g
			if(url.indexOf("?heyawake=")>=0){
				this.parseURI_heyaapp(url.substr(url.indexOf("?heyawake=")+10));
			}
			// �J���y�������ǃf�[�^�`���͂ς��Ղ�
			else if(url.indexOf("?pzpr=")>=0){
				this.parseURI_pzpr(url.substr(url.indexOf("?pzpr=")+6));
			}
			else{
				this.parseURI_kanpen(url.substr(url.indexOf("?problem=")+9));
			}
		}
		// �ւ�킯�A�v���b�g�̏ꍇ
		else if(url.match(/www\.geocities(\.co)?\.jp\/heyawake/)){
			this.parseURI_heyaapp(url.substr(url.indexOf("?problem=")+9));
		}
		// �ς��Ղ�̏ꍇ
		else{ // if(url.match(/indi\.s58\.xrea\.com/)){
			// �ς��Ղ�A�v���b�g��URL
			if(url.match(/\/(sa|sc)\/pzpr\/v3/)){
				this.parseURI_pzpr(url.substr(url.indexOf("?")));
				this.uri.type = this.PZPRAPP; // �ς��Ղ�A�v���b�g/URL�W�F�l���[�^
			}
			// �ς��Ղ�v3��URL
			else{
				this.parseURI_pzpr(url.substr(url.indexOf("/", url.indexOf("?"))+1));
			}
		}
	},
	parseURI_pzpr : function(qstr){
		this.uri.type = this.PZPRV3; // �ς��Ղ�v3
		this.uri.qdata = qstr;
		var inp = qstr.split("/");
		if(!isNaN(parseInt(inp[0]))){ inp.unshift("");}

		this.uri.pflag = inp.shift();
		this.uri.cols = parseInt(inp.shift());
		this.uri.rows = parseInt(inp.shift());
		this.uri.bstr = inp.join("/");
	},
	parseURI_kanpen : function(qstr){
		this.uri.type = this.KANPEN; // �J���y��
		this.uri.qdata = qstr;
		var inp = qstr.split("/");

		if(k.puzzleid=="sudoku"){
			this.uri.rows = this.uri.cols = parseInt(inp.shift());
		}
		else{
			this.uri.rows = parseInt(inp.shift());
			this.uri.cols = parseInt(inp.shift());
			if(k.puzzleid=="kakuro"){ this.uri.rows--; this.uri.cols--;}
		}
		this.uri.bstr = inp.join("/");
	},
	parseURI_heyaapp : function(qstr){
		this.uri.type = this.HEYAAPP; // �ւ�킯�A�v���b�g
		this.uri.qdata = qstr;
		var inp = qstr.split("/");

		var size = inp.shift().split("x");
		this.uri.cols = parseInt(size[0]);
		this.uri.rows = parseInt(size[1]);
		this.uri.bstr = inp.join("/");
	},

	//---------------------------------------------------------------------------
	// enc.checkpflag()   pflag�Ɏw�肵�������񂪊܂܂�Ă��邩���ׂ�
	//---------------------------------------------------------------------------
	checkpflag : function(ca){ return (this.uri.pflag.indexOf(ca)>=0);},

	//---------------------------------------------------------------------------
	// enc.pzlinput()   parseURI()���s������ɌĂяo���A�e�p�Y����pzlimport�֐����Ăяo��
	// enc.getURLBase() URL�̌��ƂȂ镔�����擾����
	// 
	// enc.pzlimport()    �e�p�Y����URL���͗p(�I�[�o�[���C�h�p)
	// enc.pzlexport()    �e�p�Y����URL�o�͗p(�I�[�o�[���C�h�p)
	//---------------------------------------------------------------------------
	pzlinput : function(){
		if(this.uri.cols && this.uri.rows){
			bd.initBoardSize(this.uri.cols, this.uri.rows);
		}
		if(this.uri.bstr){
			base.disableInfo();
			switch(this.uri.type){
			case this.PZPRV3: case this.PZPRAPP: case this.PZPRV3E:
				this.outbstr = this.uri.bstr;
				this.pzlimport(this.uri.type);
				break;
			case this.KANPEN:
				fio.lineseek = 0;
				fio.dataarray = this.uri.bstr.replace(/_/g, " ").split("/");
				this.decodeKanpen();
				break;
			case this.HEYAAPP:
				this.decodeHeyaApp();
				break;
			}
			base.enableInfo();

			bd.ansclear();
			base.resetInfo(true);

			if(!base.initProcess){
				base.resize_canvas();
			}
		}
	},
	pzloutput : function(type){
		if(type===this.KANPEN && k.puzzleid=='lits'){ type = this.KANPENP;}
		var pdata = '', size = '', ispflag = false;

		this.outpflag = '';
		this.outsize = '';
		this.outbstr = '';

		switch(type){
		case this.PZPRV3: case this.PZPRV3E:
			this.pzlexport(this.PZPRV3);

			size = (!this.outsize ? [k.qcols,k.qrows].join('/') : this.outsize);
			ispflag = (!!this.outpflag);
			break;

		case this.PZPRAPP: case this.KANPENP:
			this.pzlexport(this.PZPRAPP);

			size = (!this.outsize ? [k.qcols,k.qrows].join('/') : this.outsize);
			ispflag = true;
			break;

		case this.KANPEN:
			fio.datastr = "";
			this.encodeKanpen()
			this.outbstr = fio.datastr.replace(/ /g, "_");

			size = (!this.outsize ? [k.qrows,k.qcols].join('/') : this.outsize);
			break;

		case this.HEYAAPP:
			this.encodeHeyaApp();

			size = [k.qcols,k.qrows].join('x');
			break;

		default:
			return '';
		}

		if(ispflag){ pdata = [this.outpflag, size, this.outbstr].join("/");}
		else{ pdata = [size, this.outbstr].join("/");}

		return this.getURLBase(type) + pdata;
	},
	getURLBase : function(type){
		var urls = {};
		urls[this.PZPRV3]  = "http://indi.s58.xrea.com/pzpr/v3/p.html?%PID%/";
		urls[this.PZPRV3E] = "http://indi.s58.xrea.com/pzpr/v3/p.html?%PID%_edit/";
		urls[this.PZPRAPP] = "http://indi.s58.xrea.com/%PID%/sa/q.html?";
		urls[this.KANPEN]  = "http://www.kanpen.net/%KID%.html?problem=";
		urls[this.KANPENP] = "http://www.kanpen.net/%KID%.html?pzpr=";
		urls[this.HEYAAPP] = "http://www.geocities.co.jp/heyawake/?problem=";

		return urls[type].replace("%PID%",this.pidforURL).replace("%KID%",this.pidKanpen);
	},

	// �I�[�o�[���C�h�p
	pzlimport : function(type,bstr){ },
	pzlexport : function(type){ },
	decodeKanpen : function(){ },
	encodeKanpen : function(){ },
	decodeHeyaApp : function(bstr){ },
	encodeHeyaApp : function(){ },

	//---------------------------------------------------------------------------
	// enc.decode4Cell()  ques��0�`4�܂ł̏ꍇ�A�f�R�[�h����
	// enc.encode4Cell()  ques��0�`4�܂ł̏ꍇ�A��蕔���G���R�[�h����
	//---------------------------------------------------------------------------
	decode4Cell : function(){
		var c=0, i=0, bstr = this.outbstr;
		for(i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i);
			if     (this.include(ca,"0","4")){ bd.sQnC(c, parseInt(ca,16));    c++; }
			else if(this.include(ca,"5","9")){ bd.sQnC(c, parseInt(ca,16)-5);  c+=2;}
			else if(this.include(ca,"a","e")){ bd.sQnC(c, parseInt(ca,16)-10); c+=3;}
			else if(this.include(ca,"g","z")){ c+=(parseInt(ca,36)-15);}
			else if(ca=="."){ bd.sQnC(c, -2); c++;}

			if(c>=bd.cellmax){ break;}
		}
		this.outbstr = bstr.substr(i+1);
	},
	encode4Cell : function(){
		var count=0, cm = "";
		for(var i=0;i<bd.cellmax;i++){
			var pstr = "";

			if(bd.QnC(i)>=0){
				if     (i<bd.cellmax-1&&(bd.QnC(i+1)>=0||bd.QnC(i+1)==-2)){ pstr=""+bd.QnC(i).toString(16);}
				else if(i<bd.cellmax-2&&(bd.QnC(i+2)>=0||bd.QnC(i+2)==-2)){ pstr=""+(5+bd.QnC(i)).toString(16); i++;}
				else{ pstr=""+(10+bd.QnC(i)).toString(16); i+=2;}
			}
			else if(bd.QnC(i)==-2){ pstr=".";}
			else{ pstr=" "; count++;}

			if(count==0)      { cm += pstr;}
			else if(pstr!=" "){ cm += ((count+15).toString(36)+pstr); count=0;}
			else if(count==20){ cm += "z"; count=0;}
		}
		if(count>0){ cm += ((count+15).toString(36));}

		this.outbstr += cm;
	},

	//---------------------------------------------------------------------------
	// enc.decode4Cross()  ques��0�`4�܂ł̏ꍇ�A�f�R�[�h����
	// enc.encode4Cross()  ques��0�`4�܂ł̏ꍇ�A��蕔���G���R�[�h����
	//---------------------------------------------------------------------------
	decode4Cross : function(){
		var c=0, i=0, bstr = this.outbstr;
		for(i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i);
			if     (this.include(ca,"0","4")){ bd.sQnX(c, parseInt(ca,16));    c++; }
			else if(this.include(ca,"5","9")){ bd.sQnX(c, parseInt(ca,16)-5);  c+=2;}
			else if(this.include(ca,"a","e")){ bd.sQnX(c, parseInt(ca,16)-10); c+=3;}
			else if(this.include(ca,"g","z")){ c+=(parseInt(ca,36)-15);}
			else if(ca=="."){ bd.sQnX(c, -2); c++;}

			if(c>=bd.crossmax){ break;}
		}
		this.outbstr = bstr.substr(i+1);
	},
	encode4Cross : function(){
		var count = 0, cm = "";
		for(var i=0;i<bd.crossmax;i++){
			var pstr = "";

			if(bd.QnX(i)>=0){
				if     (i<bd.crossmax-1&&(bd.QnX(i+1)>=0||bd.QnX(i+1)==-2)){ pstr=""+bd.QnX(i).toString(16);}
				else if(i<bd.crossmax-2&&(bd.QnX(i+2)>=0||bd.QnX(i+2)==-2)){ pstr=""+(5+bd.QnX(i)).toString(16); i++;}
				else{ pstr=""+(10+bd.QnX(i)).toString(16); i+=2;}
			}
			else if(bd.QnX(i)==-2){ pstr=".";}
			else{ pstr=" "; count++;}

			if(count==0)      { cm += pstr;}
			else if(pstr!=" "){ cm += ((count+15).toString(36)+pstr); count=0;}
			else if(count==20){ cm += "z"; count=0;}
		}
		if(count>0){ cm += ((count+15).toString(36));}

		this.outbstr += cm;
	},

	//---------------------------------------------------------------------------
	// enc.decodeNumber10()  ques��0�`9�܂ł̏ꍇ�A�f�R�[�h����
	// enc.encodeNumber10()  ques��0�`9�܂ł̏ꍇ�A��蕔���G���R�[�h����
	//---------------------------------------------------------------------------
	decodeNumber10 : function(){
		var c=0, i=0, bstr = this.outbstr;
		for(i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i);

			if     (this.include(ca,"0","9")){ bd.sQnC(c, parseInt(bstr.substr(i,1),10)); c++;}
			else if(this.include(ca,"a","z")){ c += (parseInt(ca,36)-9);}
			else if(ca == '.'){ bd.sQnC(c, -2); c++;}
			else{ c++;}

			if(c > bd.cellmax){ break;}
		}
		this.outbstr = bstr.substr(i);
	},
	encodeNumber10 : function(){
		var cm="", count=0;
		for(var i=0;i<bd.cellmax;i++){
			pstr = "";
			var val = bd.QnC(i);

			if     (val==  -2            ){ pstr = ".";}
			else if(val>=   0 && val<  10){ pstr =       val.toString(10);}
			else{ count++;}

			if(count==0){ cm += pstr;}
			else if(pstr || count==26){ cm+=((9+count).toString(36)+pstr); count=0;}
		}
		if(count>0){ cm+=(9+count).toString(36);}

		this.outbstr += cm;
	},

	//---------------------------------------------------------------------------
	// enc.decodeNumber16()  ques��0�`8192?�܂ł̏ꍇ�A�f�R�[�h����
	// enc.encodeNumber16()  ques��0�`8192?�܂ł̏ꍇ�A��蕔���G���R�[�h����
	//---------------------------------------------------------------------------
	decodeNumber16 : function(){
		var c=0, i=0, bstr = this.outbstr;
		for(i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i);

			if(this.include(ca,"0","9")||this.include(ca,"a","f"))
							  { bd.sQnC(c, parseInt(bstr.substr(i,  1),16));      c++;}
			else if(ca == '.'){ bd.sQnC(c, -2);                                   c++;      }
			else if(ca == '-'){ bd.sQnC(c, parseInt(bstr.substr(i+1,2),16));      c++; i+=2;}
			else if(ca == '+'){ bd.sQnC(c, parseInt(bstr.substr(i+1,3),16));      c++; i+=3;}
			else if(ca == '='){ bd.sQnC(c, parseInt(bstr.substr(i+1,3),16)+4096); c++; i+=3;}
			else if(ca == '%'){ bd.sQnC(c, parseInt(bstr.substr(i+1,3),16)+8192); c++; i+=3;}
			else if(ca >= 'g' && ca <= 'z'){ c += (parseInt(ca,36)-15);}
			else{ c++;}

			if(c > bd.cellmax){ break;}
		}
		this.outbstr = bstr.substr(i);
	},
	encodeNumber16 : function(){
		var count=0, cm="";
		for(var i=0;i<bd.cellmax;i++){
			pstr = "";
			var val = bd.QnC(i);

			if     (val==  -2            ){ pstr = ".";}
			else if(val>=   0 && val<  16){ pstr =       val.toString(16);}
			else if(val>=  16 && val< 256){ pstr = "-" + val.toString(16);}
			else if(val>= 256 && val<4096){ pstr = "+" + val.toString(16);}
			else if(val>=4096 && val<8192){ pstr = "=" + (val-4096).toString(16);}
			else if(val>=8192            ){ pstr = "%" + (val-8192).toString(16);}
			else{ count++;}

			if(count==0){ cm += pstr;}
			else if(pstr || count==20){ cm+=((15+count).toString(36)+pstr); count=0;}
		}
		if(count>0){ cm+=(15+count).toString(36);}

		this.outbstr += cm;
	},

	//---------------------------------------------------------------------------
	// enc.decodeRoomNumber16()  �����{�����̈��ques��0�`8192?�܂ł̏ꍇ�A�f�R�[�h����
	// enc.encodeRoomNumber16()  �����{�����̈��ques��0�`8192?�܂ł̏ꍇ�A��蕔���G���R�[�h����
	//---------------------------------------------------------------------------
	decodeRoomNumber16 : function(){
		area.resetRarea();
		var r=1, i=0, bstr = this.outbstr;
		for(i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i);

			if(this.include(ca,"0","9")||this.include(ca,"a","f"))
							  { bd.sQnC(area.getTopOfRoom(r), parseInt(bstr.substr(i,  1),16));      r++;}
			else if(ca == '-'){ bd.sQnC(area.getTopOfRoom(r), parseInt(bstr.substr(i+1,2),16));      r++; i+=2;}
			else if(ca == '+'){ bd.sQnC(area.getTopOfRoom(r), parseInt(bstr.substr(i+1,3),16));      r++; i+=3;}
			else if(ca == '='){ bd.sQnC(area.getTopOfRoom(r), parseInt(bstr.substr(i+1,3),16)+4096); r++; i+=3;}
			else if(ca == '%'){ bd.sQnC(area.getTopOfRoom(r), parseInt(bstr.substr(i+1,3),16)+8192); r++; i+=3;}
			else if(ca == '*'){ bd.sQnC(area.getTopOfRoom(r), parseInt(bstr.substr(i+1,3),16)+12240); r++; i+=4;}
			else if(ca == '$'){ bd.sQnC(area.getTopOfRoom(r), parseInt(bstr.substr(i+1,3),16)+77776); r++; i+=5;}
			else if(ca >= 'g' && ca <= 'z'){ r += (parseInt(ca,36)-15);}
			else{ r++;}

			if(r > area.room.max){ break;}
		}
		this.outbstr = bstr.substr(i);
	},
	encodeRoomNumber16 : function(){
		area.resetRarea();
		var count=0, cm="";
		for(var i=1;i<=area.room.max;i++){
			var pstr = "";
			var val = bd.QnC(area.getTopOfRoom(i));

			if     (val>=     0 && val<    16){ pstr =       val.toString(16);}
			else if(val>=    16 && val<   256){ pstr = "-" + val.toString(16);}
			else if(val>=   256 && val<  4096){ pstr = "+" + val.toString(16);}
			else if(val>=  4096 && val<  8192){ pstr = "=" + (val-4096).toString(16);}
			else if(val>=  8192 && val< 12240){ pstr = "%" + (val-8192).toString(16);}
			else if(val>= 12240 && val< 77776){ pstr = "*" + (val-12240).toString(16);}
			else if(val>= 77776              ){ pstr = "$" + (val-77776).toString(16);} // �ő�1126352
			else{ count++;}

			if(count==0){ cm += pstr;}
			else if(pstr || count==20){ cm+=((15+count).toString(36)+pstr); count=0;}
		}
		if(count>0){ cm+=(15+count).toString(36);}

		this.outbstr += cm;
	},

	//---------------------------------------------------------------------------
	// enc.decodeArrowNumber16()  ���t��ques��0�`8192?�܂ł̏ꍇ�A�f�R�[�h����
	// enc.encodeArrowNumber16()  ���t��ques��0�`8192?�܂ł̏ꍇ�A��蕔���G���R�[�h����
	//---------------------------------------------------------------------------
	decodeArrowNumber16 : function(){
		var c=0, i=0, bstr = this.outbstr;
		for(i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i);

			if(ca=='0'){
				if(bstr.charAt(i+1)=="."){ bd.sQnC(c,-2); c++; i++;}
				else{ bd.sQnC(c, parseInt(bstr.substr(i+1,1),16)); c++; i++;}
			}
			else if(ca=='5'){ bd.sQnC(c, parseInt(bstr.substr(i+1,2),16)); c++; i+=2;}
			else if(this.include(ca,"1","4")){
				bd.sDiC(c, parseInt(ca,16));
				if(bstr.charAt(i+1)!="."){ bd.sQnC(c, parseInt(bstr.substr(i+1,1),16));}
				else{ bd.sQnC(c,-2);}
				c++; i++;
			}
			else if(this.include(ca,"6","9")){
				bd.sDiC(c, parseInt(ca,16)-5);
				bd.sQnC(c, parseInt(bstr.substr(i+1,2),16));
				c++; i+=2;
			}
			else if(ca>='a' && ca<='z'){ c+=(parseInt(ca,36)-9);}
			else{ c++;}

			if(c > bd.cellmax){ break;}
		}
		this.outbstr = bstr.substr(i);
	},
	encodeArrowNumber16 : function(){
		var cm = "", count = 0;
		for(var c=0;c<bd.cellmax;c++){
			var pstr="";
			if(bd.QnC(c)!=-1){
				if     (bd.QnC(c)==-2){ pstr=((bd.DiC(c)==0?0:bd.DiC(c)  )+".");}
				else if(bd.QnC(c)< 16){ pstr=((bd.DiC(c)==0?0:bd.DiC(c)  )+bd.QnC(c).toString(16));}
				else if(bd.QnC(c)<256){ pstr=((bd.DiC(c)==0?5:bd.DiC(c)+5)+bd.QnC(c).toString(16));}
			}
			else{ pstr=" "; count++;}

			if(count==0)      { cm += pstr;}
			else if(pstr!=" "){ cm += ((count+9).toString(36)+pstr); count=0;}
			else if(count==26){ cm += "z"; count=0;}
		}
		if(count>0){ cm += (count+9).toString(36);}

		this.outbstr += cm;
	},

	//---------------------------------------------------------------------------
	// enc.decodeBorder() ���̋��E�����f�R�[�h����
	// enc.encodeBorder() ���̋��E�����G���R�[�h����
	//---------------------------------------------------------------------------
	decodeBorder : function(){
		var pos1, pos2, bstr = this.outbstr;

		if(bstr){
			pos1 = Math.min(mf(((k.qcols-1)*k.qrows+4)/5)     , bstr.length);
			pos2 = Math.min(mf((k.qcols*(k.qrows-1)+4)/5)+pos1, bstr.length);
		}
		else{ pos1 = 0; pos2 = 0;}

		for(var i=0;i<pos1;i++){
			var ca = parseInt(bstr.charAt(i),32);
			for(var w=0;w<5;w++){
				if(i*5+w<(k.qcols-1)*k.qrows){ bd.sQuB(i*5+w,(ca&Math.pow(2,4-w)?1:0));}
			}
		}

		var oft = (k.qcols-1)*k.qrows;
		for(var i=0;i<pos2-pos1;i++){
			var ca = parseInt(bstr.charAt(i+pos1),32);
			for(var w=0;w<5;w++){
				if(i*5+w<k.qcols*(k.qrows-1)){ bd.sQuB(i*5+w+oft,(ca&Math.pow(2,4-w)?1:0));}
			}
		}

		area.resetRarea();
		this.outbstr = bstr.substr(pos2);
	},
	encodeBorder : function(){
		var num, pass;
		var cm = "";

		num = 0; pass = 0;
		for(var i=0;i<(k.qcols-1)*k.qrows;i++){
			if(bd.QuB(i)==1){ pass+=Math.pow(2,4-num);}
			num++; if(num==5){ cm += pass.toString(32); num=0; pass=0;}
		}
		if(num>0){ cm += pass.toString(32);}

		num = 0; pass = 0;
		for(var i=(k.qcols-1)*k.qrows;i<bd.bdinside;i++){
			if(bd.QuB(i)==1){ pass+=Math.pow(2,4-num);}
			num++; if(num==5){ cm += pass.toString(32); num=0; pass=0;}
		}
		if(num>0){ cm += pass.toString(32);}

		this.outbstr += cm;
	},

	//---------------------------------------------------------------------------
	// enc.decodeCrossMark() ���_���f�R�[�h����
	// enc.encodeCrossMark() ���_���G���R�[�h����
	//---------------------------------------------------------------------------
	decodeCrossMark : function(){
		var cc=-1, i=0, bstr = this.outbstr
		for(i=0;i<bstr.length;i++){
			var ca = bstr.charAt(i);

			if(this.include(ca,"0","9")||this.include(ca,"a","z")){
				cc += (parseInt(ca,36)+1);
				var bx = (k.iscross===2?   cc%(k.qcols+1) :   cc%(k.qcols-1) +1)*2;
				var by = (k.iscross===2?mf(cc/(k.qcols+1)):mf(cc/(k.qcols-1))+1)*2;

				if(by>=bd.maxby+(k.iscross===2?2:0)){ i++; break;}
				bd.sQnX(bd.xnum(bx,by), 1);
			}
			else if(ca == '.'){ cc += 36;}
			else{ cc++;}

			if(cc >= (k.iscross==2?(k.qcols+1)*(k.qrows+1):(k.qcols-1)*(k.qrows-1))-1){ i++; break;}
		}
		this.outbstr = bstr.substr(i);
	},
	encodeCrossMark : function(){
		var cm = "", count = 0;
		for(var i=0;i<(k.iscross===2?(k.qcols+1)*(k.qrows+1):(k.qcols-1)*(k.qrows-1));i++){
			var pstr = "";
			var bx = (k.iscross===2?   i%(k.qcols+1) :   i%(k.qcols-1) +1)*2;
			var by = (k.iscross===2?mf(i/(k.qcols+1)):mf(i/(k.qcols-1))+1)*2;

			if(bd.QnX(bd.xnum(bx,by))==1){ pstr = ".";}
			else{ pstr=" "; count++;}

			if(pstr!=" "){ cm += count.toString(36); count=0;}
			else if(count==36){ cm += "."; count=0;}
		}
		if(count>0){ cm += count.toString(36);}

		this.outbstr += cm;
	},

	//---------------------------------------------------------------------------
	// enc.decodeCircle41_42() ���ہE���ۂ��f�R�[�h����
	// enc.encodeCircle41_42() ���ہE���ۂ��G���R�[�h����
	//---------------------------------------------------------------------------
	decodeCircle41_42 : function(){
		var bstr = this.outbstr;
		var pos = bstr?Math.min(mf((k.qcols*k.qrows+2)/3), bstr.length):0;
		for(var i=0;i<pos;i++){
			var ca = parseInt(bstr.charAt(i),27);
			for(var w=0;w<3;w++){
				if(i*3+w<k.qcols*k.qrows){
					if     (mf(ca/Math.pow(3,2-w))%3==1){ bd.sQuC(i*3+w,41);}
					else if(mf(ca/Math.pow(3,2-w))%3==2){ bd.sQuC(i*3+w,42);}
				}
			}
		}
		this.outbstr = bstr.substr(pos);
	},
	encodeCircle41_42 : function(){
		var cm="", num=0, pass=0;
		for(var i=0;i<bd.cellmax;i++){
			if     (bd.QuC(i)==41){ pass+=(  Math.pow(3,2-num));}
			else if(bd.QuC(i)==42){ pass+=(2*Math.pow(3,2-num));}
			num++; if(num==3){ cm += pass.toString(27); num=0; pass=0;}
		}
		if(num>0){ cm += pass.toString(27);}

		this.outbstr += cm;
	},

	//---------------------------------------------------------------------------
	// enc.decodecross_old() Cross�̖�蕔���f�R�[�h����(���`��)
	//---------------------------------------------------------------------------
	decodecross_old : function(){
		var bstr = this.outbstr;
		for(var i=0;i<Math.min(bstr.length, bd.crossmax);i++){
			if     (bstr.charAt(i)=="0"){ bd.sQnX(i,0);}
			else if(bstr.charAt(i)=="1"){ bd.sQnX(i,1);}
			else if(bstr.charAt(i)=="2"){ bd.sQnX(i,2);}
			else if(bstr.charAt(i)=="3"){ bd.sQnX(i,3);}
			else if(bstr.charAt(i)=="4"){ bd.sQnX(i,4);}
			else{ bd.sQnX(i,-1);}
		}
		for(var j=bstr.length;j<bd.crossmax;j++){ bd.sQnX(j,-1);}

		this.outbstr = bstr.substr(i);
	},

	//---------------------------------------------------------------------------
	// enc.include()    ������ca��bottom��up�̊Ԃɂ��邩
	//---------------------------------------------------------------------------
	include : function(ca, bottom, up){
		if(bottom <= ca && ca <= up) return true;
		return false;
	}
};
