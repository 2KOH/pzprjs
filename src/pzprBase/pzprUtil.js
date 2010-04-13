// pzprUtil.js v3.3.0

//---------------------------------------------------------------------------
// ��AreaInfo�N���X ��ɐF�����̏����Ǘ�����
//   id : -1     �ǂ̕����ɂ������Ȃ��Z��(���}�X���Ŕ��}�X�̃Z���A��)
//         0     �ǂ̕����ɑ������邩�̏�����
//         1�ȏ� ���̔ԍ��̕����ɑ�����
//---------------------------------------------------------------------------
AreaInfo = function(){
	this.max  = 0;	// �ő�̕����ԍ�(1�`max�܂ő��݂���悤�\�����Ă�������)
	this.id   = [];	// �e�Z��/���Ȃǂ������镔���ԍ���ێ�����
	this.room = [];	// �e������idlist���̏���ێ�����(info.room[id].idlist�Ŏ擾)
};

//---------------------------------------------------------------------------
// ��LineManager�N���X ��ɐF�����̏����Ǘ�����
//---------------------------------------------------------------------------
// LineManager�N���X�̒�`
LineManager = function(){
	this.lcnt    = [];
	this.ltotal  = [];

	this.disableLine = (!k.isCenterLine && !k.isborderAsLine);
	this.data    = {};	// ��id���

	this.typeA = 'A';
	this.typeB = 'B';
	this.typeC = 'C';

	this.init();
};
LineManager.prototype = {

	//---------------------------------------------------------------------------
	// line.init()        �ϐ��̋N�����̏��������s��
	// line.resetLcnts()  lcnts���̕ϐ��̏��������s��
	// line.newIrowake()  ���̏�񂪍č\�z���ꂽ�ہA���ɐF������
	// line.lcntCell()    �Z���ɑ��݂�����̖{����Ԃ�
	//---------------------------------------------------------------------------
	init : function(){
		if(this.disableLine){ return;}

		// lcnt, ltotal�ϐ�(�z��)������
		if(k.isCenterLine){
			for(var c=0;c<bd.cellmax;c++){ this.lcnt[c]=0;}
			this.ltotal=[(k.qcols*k.qrows), 0, 0, 0, 0];
		}
		else{
			for(var c=0,len=(k.qcols+1)*(k.qrows+1);c<len;c++){ this.lcnt[c]=0;}
			this.ltotal=[((k.qcols+1)*(k.qrows+1)), 0, 0, 0, 0];
		}

		// ���̑��̕ϐ�������
		this.data = {max:0,id:[]};
		for(var id=0;id<bd.bdmax;id++){ this.data.id[id] = -1;}
	},

	resetLcnts : function(){
		if(this.disableLine){ return;}

		this.init();
		var bid = [];
		for(var id=0;id<bd.bdmax;id++){
			if(bd.isLine(id)){
				this.data.id[id] = 0;
				bid.push(id);

				var cc1, cc2;
				if(k.isCenterLine){ cc1 = bd.border[id].cellcc[0];  cc2 = bd.border[id].cellcc[1]; }
				else              { cc1 = bd.border[id].crosscc[0]; cc2 = bd.border[id].crosscc[1];}

				if(cc1!=-1){ this.ltotal[this.lcnt[cc1]]--; this.lcnt[cc1]++; this.ltotal[this.lcnt[cc1]]++;}
				if(cc2!=-1){ this.ltotal[this.lcnt[cc2]]--; this.lcnt[cc2]++; this.ltotal[this.lcnt[cc2]]++;}
			}
			else{
				this.data.id[id] = -1;
			}
		}
		this.lc0main(bid);
		if(k.irowake!==0){ this.newIrowake();}
	},
	newIrowake : function(){
		for(var i=1;i<=this.data.max;i++){
			var idlist = this.data[i].idlist;
			if(idlist.length>0){
				var newColor = pc.getNewLineColor();
				for(n=0;n<idlist.length;n++){
					bd.border[idlist[n]].color = newColor;
				}
			}
		}
	},
	lcntCell  : function(cc){ return (cc!=-1?this.lcnt[cc]:0);},

	//---------------------------------------------------------------------------
	// line.gettype()    ���������ꂽ/�����ꂽ���ɁAtypeA/typeB/typeC�̂����ꂩ���肷��
	// line.isTpos()     piece���A�w�肳�ꂽcc����id�̔��Α��ɂ��邩���肷��
	// line.iscrossing() �w�肳�ꂽ�Z��/��_�Ő�����������ꍇ��true��Ԃ�
	//---------------------------------------------------------------------------
	gettype : function(cc,id,val){
		var erase = (val>0?0:1);
		if(cc===-1){
			return this.typeA;
		}
		else if(!this.iscrossing(cc)){
			return ((this.lcnt[cc]===(1-erase))?this.typeA:this.typeB);
		}
		else{
			if     (this.lcnt[cc]===(1-erase) || (this.lcnt[cc]===(3-erase) && this.isTpos(cc,id))){ return this.typeA;}
			else if(this.lcnt[cc]===(2-erase) ||  this.lcnt[cc]===(4-erase)){ return this.typeB;}
			return this.typeC;
		}
	},
	isTpos : function(cc,id){
		//   �� ��id                    
		// ������                       
		//   �E �����̏ꏊ�ɐ������邩�H
		if(k.isCenterLine){
			return !bd.isLine(bd.bnum( 2*bd.cell[cc].bx-bd.border[id].bx, 2*bd.cell[cc].by-bd.border[id].by ));
		}
		else{
			return !bd.isLine(bd.bnum( 4*(cc%(k.qcols+1))-bd.border[id].bx, 4*mf(cc/(k.qcols+1))-bd.border[id].by ));
		}
	},
	iscrossing : function(cc){ return !!k.isLineCross;},

	//---------------------------------------------------------------------------
	// line.setLine()         ���������ꂽ������ꂽ���ɁAlcnt�ϐ�����̏��𐶐����Ȃ���
	// line.setLineInfo()     ���������ꂽ���ɁA���̏��𐶐����Ȃ���
	// line.removeLineInfo()  ���������ꂽ���ɁA���̏��𐶐����Ȃ���
	// line.combineLineInfo() ���������ꂽ���ɁA����̐����S�Ă�������1�̐���
	//                        �ł���ꍇ�̐�id�̍Đݒ���s��
	// line.remakeLineInfo()  ���������ꂽ������ꂽ���A�V����2�ȏ�̐����ł���
	//                        �\��������ꍇ�̐�id�̍Đݒ���s��
	//---------------------------------------------------------------------------
	setLine : function(id, val){
		if(this.disableLine){ return;}
		val = (val>0?1:0);

		var cc1, cc2;
		if(k.isCenterLine){ cc1 = bd.border[id].cellcc[0];  cc2 = bd.border[id].cellcc[1]; }
		else              { cc1 = bd.border[id].crosscc[0]; cc2 = bd.border[id].crosscc[1];}

		if(val>0){
			if(cc1!=-1){ this.ltotal[this.lcnt[cc1]]--; this.lcnt[cc1]++; this.ltotal[this.lcnt[cc1]]++;}
			if(cc2!=-1){ this.ltotal[this.lcnt[cc2]]--; this.lcnt[cc2]++; this.ltotal[this.lcnt[cc2]]++;}
		}
		else{
			if(cc1!=-1){ this.ltotal[this.lcnt[cc1]]--; this.lcnt[cc1]--; this.ltotal[this.lcnt[cc1]]++;}
			if(cc2!=-1){ this.ltotal[this.lcnt[cc2]]--; this.lcnt[cc2]--; this.ltotal[this.lcnt[cc2]]++;}
		}

		//---------------------------------------------------------------------------
		// (A)�������Ȃ�                        (B)�P��������
		//     �E      ��    - ���������lcnt=1     ��      ��    - �����Ȃ���lcnt=2�`4
		//   �E ��   �E����  - �����Ȃ���lcnt=1   �E����  ������  - ���������lcnt=2or4
		//     �E      ��    - ���������lcnt=3     �E      ��                         
		// 
		// (C)���G������
		//    ��        ��   - ���������lcnt=3(���̃p�^�[��)
		//  �����E => ������   �����̐���񂪕ʁX�ɂȂ��Ă��܂�
		//    �E        �E   
		//---------------------------------------------------------------------------
		var type1 = this.gettype(cc1,id,val), type2 = this.gettype(cc2,id,val);
		if(val>0){
			// (A)+(A)�̏ꍇ -> �V������id�����蓖�Ă�
			if(type1===this.typeA && type2===this.typeA){
				this.data.max++;
				this.data[this.data.max] = {idlist:[id]};
				this.data.id[id] = this.data.max;
				bd.border[id].color = pc.getNewLineColor();
			}
			// (A)+(B)�̏ꍇ -> �����̐��ɂ�������
			else if((type1===this.typeA && type2===this.typeB) || (type1===this.typeB && type2===this.typeA)){
				var bid = (this.getbid(id,1))[0];
				this.data[this.data.id[bid]].idlist.push(id);
				this.data.id[id] = this.data.id[bid];
				bd.border[id].color = bd.border[bid].color;
			}
			// (B)+(B)�̏ꍇ -> �����������ŁA�傫�����̐�id�ɓ��ꂷ��
			else if(type1===this.typeB && type2===this.typeB){
				this.combineLineInfo(id);
			}
			// ���̑��̏ꍇ
			else{
				this.remakeLineInfo(id,1);
			}
		}
		else{
			// (A)+(A)�̏ꍇ -> ��id���̂����ł�����
			if(type1===this.typeA && type2===this.typeA){
				this.data[this.data.id[id]] = {idlist:[]};
				this.data.id[id] = -1;
				bd.border[id].color = "";
			}
			// (A)+(B)�̏ꍇ -> �����̐������菜��
			else if((type1===this.typeA && type2===this.typeB) || (type1===this.typeB && type2===this.typeA)){
				var ownid = this.data.id[id], idlist = this.data[ownid].idlist;
				for(var i=0;i<idlist.length;i++){ if(idlist[i]===id){ idlist.splice(i,1); break;} }
				this.data.id[id] = -1;
				bd.border[id].color = "";
			}
			// (B)+(B)�̏ꍇ�A���̑��̏ꍇ -> �����ꂽ���ɂ��ꂼ��V������id���ӂ�
			else{
				this.remakeLineInfo(id,0);
				bd.border[id].color = "";
			}
		}
	},

	combineLineInfo : function(id){
		var dataid = this.data.id;

		// ���̊֐��̓˓��������Abid.length�͕K��2�ɂȂ�
		// ���Ȃ�Ȃ�����... ����������ID���͕K��2�ȉ��ɂȂ�
		var bid = this.getbid(id,1);
		var did = [dataid[bid[0]], -1];
		for(var i=0;i<bid.length;i++){
			if(did[0]!=dataid[bid[i]]){
				did[1]=dataid[bid[i]];
				break;
			}
		}

		var newColor = bd.border[bid[0]].color;
		// ����������ID����2��ނ̏ꍇ
		if(did[1] != -1){
			// �ǂ����������́H
			var longid = did[0], shortid = did[1];
			if(this.data[did[0]].idlist.length < this.data[did[1]].idlist.length){
				longid=did[1]; shortid=did[0];
				newColor = bd.border[bid[1]].color;
			}

			// �Ȃ��������͑S�ē���ID�ɂ���
			var longidlist  = this.data[longid].idlist;
			var shortidlist = this.data[shortid].idlist;
			for(var n=0,len=shortidlist.length;n<len;n++){
				longidlist.push(shortidlist[n]);
				dataid[shortidlist[n]] = longid;
			}
			this.data[shortid].idlist = [];

			longidlist.push(id);
			dataid[id] = longid;

			// �F�𓯂��ɂ���
			for(var i=0,len=longidlist.length;i<len;i++){
				bd.border[longidlist[i]].color = newColor;
			}
			this.repaintLine(longidlist, id);
		}
		// ����������ID����1��ނ̏ꍇ => �����̐��ɂ�������
		else{
			this.data[did[0]].idlist.push(id);
			dataid[id] = did[0];
			bd.border[id].color = newColor;
		}
	},
	remakeLineInfo : function(id,val){
		var dataid = this.data.id;
		var oldmax = this.data.max;	// ���܂܂ł�this.data.max�l

		// �Ȃ�������ID����U0�ɂ��āAmax+1, max+2, ...������U�肵�Ȃ����֐�

		// �Ȃ��������̐�������U0�ɂ���
		var bid = this.getbid(id,val);
		var oldlongid = dataid[bid[0]], longColor = bd.border[bid[0]].color;
		for(var i=0,len=bid.length;i<len;i++){
			var current = dataid[bid[i]];
			if(current<=0){ continue;}
			var idlist = this.data[current].idlist;
			if(this.data[oldlongid].idlist.length < idlist.length){
				oldlongid = current;
				longColor = bd.border[bid[i]].color;
			}
			for(var n=0,len2=idlist.length;n<len2;n++){ dataid[idlist[n]] = 0;}
			this.data[current] = {idlist:[]};
		}

		// ������ID�̏���ύX����
		if(val>0){ dataid[id] =  0; bid.unshift(id);}
		else     { dataid[id] = -1;}

		// �V����id��ݒ肷��
		this.lc0main(bid);

		// �ł������ł����Ƃ��������ɁA�]���ł������������̐F���p������
		// ����ȊO�̐��ɂ͐V�����F��t������

		// �ł������̒��ł����Ƃ��������̂��擾����
		var newlongid = oldmax+1;
		for(var current=oldmax+1;current<=this.data.max;current++){
			var idlist = this.data[current].idlist;
			if(this.data[newlongid].idlist.length<idlist.length){ newlongid = current;}
		}

		// �V�����F�̐ݒ�
		for(var current=oldmax+1;current<=this.data.max;current++){
			var newColor = (current===newlongid ? longColor : pc.getNewLineColor());
			var idlist = this.data[current].idlist;
			for(var n=0,len=idlist.length;n<len;n++){ bd.border[idlist[n]].color = newColor;}
			this.repaintLine(idlist, id);
		}
	},

	//---------------------------------------------------------------------------
	// line.repaintLine()  �ЂƂȂ���̐����ĕ`�悷��
	// line.repaintParts() repaintLine()�֐��ŁA����ɏォ��`�悵�Ȃ�����������������
	//                     canvas�`�掞�̂݌Ă΂�܂�(���͕`�悵�Ȃ����K�v�Ȃ�)
	// line.getClistFromIdlist() idlist�̐����d�Ȃ�Z���̃��X�g���擾����
	// line.getXlistFromIdlist() idlist�̐����d�Ȃ��_�̃��X�g���擾����
	//---------------------------------------------------------------------------
	repaintLine : function(idlist, id){
		if(!pp.getVal('irowake')){ return;}
		var draw1 = (k.isCenterLine ? pc.drawLine1 : pc.drawBorder1);
		for(var i=0,len=idlist.length;i<len;i++){
			if(id===idlist[i]){ continue;}
			draw1.call(pc, idlist[i]);
		}
		if(g.use.canvas){ this.repaintParts(idlist);}
	},
	repaintParts : function(idlist){ }, // �I�[�o�[���C�h�p

	getClistFromIdlist : function(idlist){
		var cdata=[], clist=[];
		for(var c=0;c<bd.cellmax;c++){ cdata[c]=false;}
		for(var i=0;i<idlist.length;i++){
			cdata[bd.border[idlist[i]].cellcc[0]] = true;
			cdata[bd.border[idlist[i]].cellcc[1]] = true;
		}
		for(var c=0;c<bd.cellmax;c++){ if(cdata[c]){ clist.push(c);} }
		return clist;
	},
	getXlistFromIdlist : function(idlist){
		var cdata=[], xlist=[], crossmax=(k.qcols+1)*(k.qrows+1);
		for(var c=0;c<crossmax;c++){ cdata[c]=false;}
		for(var i=0;i<idlist.length;i++){
			cdata[bd.border[idlist[i]].crosscc[0]] = true;
			cdata[bd.border[idlist[i]].crosscc[1]] = true;
		}
		for(var c=0;c<crossmax;c++){ if(cdata[c]){ xlist.push(c);} }
		return xlist;
	},

	//---------------------------------------------------------------------------
	// line.getbid()  �w�肵��piece�Ɍq����A�ő�6�ӏ��Ɉ�����Ă������S�Ď擾����
	// line.lc0main() �w�肳�ꂽpiece�̃��X�g�ɑ΂��āAlc0�֐����Ăяo��
	// line.lc0()     �ЂƂȂ���̐���lineid��ݒ肷��(�ċA�Ăяo���p�֐�)
	//---------------------------------------------------------------------------
	getbid : function(id,val){
		var erase=(val>0?0:1), bx=bd.border[id].bx, by=bd.border[id].by;
		var dx=((k.isCenterLine^(bx%2===0))?2:0), dy=(2-dx);	// (dx,dy) = (2,0) or (0,2)

		var cc1 = bd.border[id].cellcc[0], cc2 = bd.border[id].cellcc[1];
		if(!k.isCenterLine){ cc1 = bd.border[id].crosscc[0]; cc2 = bd.border[id].crosscc[1];}
		// ���������k.isborderAsLine==1(->k.isCenterLine==0)�̃p�Y���͍���ĂȂ��͂�
		// ���܂ł̃I���p�ŊY������̂��X���U�[�{�b�N�X���炢�������悤�ȁA�A

		var lines=[];
		if(cc1!==-1){
			var iscrossing=this.iscrossing(cc1), lcnt=this.lcnt[cc1];
			if(iscrossing && lcnt>=(4-erase)){
				lines.push(bd.bnum(bx-dy,   by-dx  )); // cc1�����straight
			}
			else if(lcnt>=(2-erase) && !(iscrossing && lcnt===(3-erase) && this.isTpos(cc1,id))){
				lines.push(bd.bnum(bx-dy,   by-dx  )); // cc1�����straight
				lines.push(bd.bnum(bx-1,    by-1   )); // cc1�����curve1
				lines.push(bd.bnum(bx+dx-1, by+dy-1)); // cc1�����curve2
			}
		}
		if(cc2!==-1){
			var iscrossing=this.iscrossing(cc2), lcnt=this.lcnt[cc2];
			if(iscrossing && lcnt>=(4-erase)){
				lines.push(bd.bnum(bx+dy,   by+dx  )); // cc2�����straight
			}
			else if(lcnt>=(2-erase) && !(iscrossing && lcnt===(3-erase) && this.isTpos(cc2,id))){
				lines.push(bd.bnum(bx+dy,   by+dx  )); // cc2�����straight
				lines.push(bd.bnum(bx+1,    by+1   )); // cc2�����curve1
				lines.push(bd.bnum(bx-dx+1, by-dy+1)); // cc2�����curve2
			}
		}

		var bid = [];
		for(var i=0;i<lines.length;i++){ if(bd.isLine(lines[i])){ bid.push(lines[i]);}}
		return bid;
	},

	lc0main : function(bid){
		for(var i=0,len=bid.length;i<len;i++){
			if(this.data.id[bid[i]]!=0){ continue;}	// ����id�����Ă�����X���[
			var bx=bd.border[bid[i]].bx, by=bd.border[bid[i]].by;
			this.data.max++;
			this.data[this.data.max] = {idlist:[]};
			if(!k.isCenterLine^(bx&1)){ this.lc0(bx,by+1,1,this.data.max); this.lc0(bx,by,2,this.data.max);}
			else                      { this.lc0(bx+1,by,3,this.data.max); this.lc0(bx,by,4,this.data.max);}
		}
	},
	lc0 : function(bx,by,dir,newid){
		while(1){
			switch(dir){ case 1: by--; break; case 2: by++; break; case 3: bx--; break; case 4: bx++; break;}
			if((bx+by)%2===0){
				var cc = (k.isCenterLine?bd.cnum:bd.xnum).call(bd,bx,by);
				if(cc===-1){ break;}
				else if(this.lcnt[cc]>=3){
					if(!this.iscrossing(cc)){
						if(bd.isLine(bd.bnum(bx,by-1))){ this.lc0(bx,by,1,newid);}
						if(bd.isLine(bd.bnum(bx,by+1))){ this.lc0(bx,by,2,newid);}
						if(bd.isLine(bd.bnum(bx-1,by))){ this.lc0(bx,by,3,newid);}
						if(bd.isLine(bd.bnum(bx+1,by))){ this.lc0(bx,by,4,newid);}
						break;
					}
					/* lcnt>=3��iscrossing==true�̎��͒��i���������Ȃ� */
				}
				else{
					if     (dir!=1 && bd.isLine(bd.bnum(bx,by+1))){ dir=2;}
					else if(dir!=2 && bd.isLine(bd.bnum(bx,by-1))){ dir=1;}
					else if(dir!=3 && bd.isLine(bd.bnum(bx+1,by))){ dir=4;}
					else if(dir!=4 && bd.isLine(bd.bnum(bx-1,by))){ dir=3;}
				}
			}
			else{
				var id = bd.bnum(bx,by);
				if(this.data.id[id]!=0){ break;}
				this.data.id[id] = newid;
				this.data[newid].idlist.push(id);
			}
		}
	},

	//--------------------------------------------------------------------------------
	// line.getLineInfo()    ������AreaInfo�^�̃I�u�W�F�N�g�ŕԂ�
	// line.getLareaInfo()   ���������܂�����Z���̏���AreaInfo�^�̃I�u�W�F�N�g�ŕԂ�
	//                       (���ꂾ���͋��^�̐������@�ł���Ă܂�)
	//--------------------------------------------------------------------------------
	getLineInfo : function(){
		var info = new AreaInfo();
		for(var id=0;id<bd.bdmax;id++){ info.id[id]=(bd.isLine(id)?0:-1);}
		for(var id=0;id<bd.bdmax;id++){
			if(info.id[id]!=0){ continue;}
			info.max++;
			info.room[info.max] = {idlist:this.data[this.data.id[id]].idlist}; /* �Q�Ƃ����Ȃ̂�concat()����Ȃ��Ă悢 */
			for(var i=0;i<info.room[info.max].idlist.length;i++){
				info.id[info.room[info.max].idlist[i]] = info.max;
			}
		}
		return info;
	},
	getLareaInfo : function(){
		var linfo = new AreaInfo();
		for(var c=0;c<bd.cellmax;c++){ linfo.id[c]=(this.lcnt[c]>0?0:-1);}
		for(var c=0;c<bd.cellmax;c++){
			if(linfo.id[c]!=0){ continue;}
			linfo.max++;
			linfo.room[linfo.max] = {idlist:[]};
			this.sr0(linfo, c, linfo.max);
		}
		return linfo;
	},
	sr0 : function(linfo, i, areaid){
		linfo.id[i] = areaid;
		linfo.room[areaid].idlist.push(i);
		if( bd.isLine(bd.ub(i)) && linfo.id[bd.up(i)]===0 ){ this.sr0(linfo, bd.up(i), areaid);}
		if( bd.isLine(bd.db(i)) && linfo.id[bd.dn(i)]===0 ){ this.sr0(linfo, bd.dn(i), areaid);}
		if( bd.isLine(bd.lb(i)) && linfo.id[bd.lt(i)]===0 ){ this.sr0(linfo, bd.lt(i), areaid);}
		if( bd.isLine(bd.rb(i)) && linfo.id[bd.rt(i)]===0 ){ this.sr0(linfo, bd.rt(i), areaid);}
	}
};

//--------------------------------------------------------------------------------
// ��AreaManager�N���X ������TOP-Cell�̈ʒu���̏�������
//   �����̃N���X�ŊǗ����Ă���areaid�́A�������ȗ������邽�߂�
//     �̈�ɑ�����ID���Ȃ��Ȃ��Ă����Ƃ��Ă͏����Ă��܂���B
//     ���̂��߁A1�`max�܂őS�Ē��g�����݂��Ă���Ƃ͌���܂���B
//     �񓚃`�F�b�N��t�@�C���o�͑O�ɂ͈�UresetRarea()�����K�v�ł��B
//--------------------------------------------------------------------------------
// ������TOP�ɐ�������͂��鎞�́A�n���h�����O��
AreaManager = function(){
	this.lcnt  = [];	// ��_id -> ��_����o����̖{��

	this.room  = {};	// ��������ێ�����
	this.bcell = {};	// ���}�X����ێ�����
	this.wcell = {};	// ���}�X����ێ�����

	this.disroom = (!k.isborder || !!k.area.disroom);	// �������𐶐����Ȃ�
	this.bblock = (!!k.area.bcell || !!k.area.number);	// ���}�X(or �q���鐔���E�L��)�̏��𐶐�����
	this.wblock = !!k.area.wcell;						// ���}�X�̏��𐶐�����
	this.numberColony = !!k.area.number;				// �����E�L�������}�X���Ƃ݂Ȃ��ď��𐶐�����

	this.init();
};
AreaManager.prototype = {
	//--------------------------------------------------------------------------------
	// area.init()       �N�����ɕϐ�������������
	// area.resetArea()  �����A���}�X�A���}�X�̏���reset����
	//--------------------------------------------------------------------------------
	init : function(){
		this.initRarea();
		this.initBarea();
		this.initWarea();
	},
	resetArea : function(){
		if(k.isborder && !k.isborderAsLine){ this.resetRarea();}
		if(this.bblock){ this.resetBarea();}
		if(this.wblock){ this.resetWarea();}
	},

	//--------------------------------------------------------------------------------
	// area.initRarea()  �����֘A�̕ϐ�������������
	// area.resetRarea() �����̏���reset���āA1���犄�蓖�Ă��Ȃ���
	// 
	// area.lcntCross()  �w�肳�ꂽ�ʒu��Cross�̏㉺���E�̂������E����������Ă���(ques==1 or qans==1��)�������߂�
	// area.getRoomID()          ���̃I�u�W�F�N�g�ŊǗ����Ă���Z���̕���ID���擾����
	// area.setRoomID()          ���̃I�u�W�F�N�g�ŊǗ����Ă���Z���̕���ID��ݒ肷��
	// area.getTopOfRoomByCell() �w�肵���Z�����܂܂��̈��TOP�̕������擾����
	// area.getTopOfRoom()       �w�肵���̈��TOP�̕������擾����
	// area.getCntOfRoomByCell() �w�肵���Z�����܂܂��̈�̑傫���𒊏o����
	// area.getCntOfRoom()       �w�肵���̈�̑傫���𒊏o����
	//--------------------------------------------------------------------------------
	initRarea : function(){
		// ������񏉊���
		this.room = {max:1,id:[],1:{top:0,clist:[]}};
		for(var c=0;c<bd.cellmax;c++){ this.room.id[c] = 1; this.room[1].clist[c] = c;}

		// lcnt�ϐ�������
		this.lcnt = [];
		for(var c=0;c<(k.qcols+1)*(k.qrows+1);c++){ this.lcnt[c]=0;}

		if(k.isoutsideborder===0){
			for(var by=bd.minby;by<=bd.maxby;by+=2){
				for(var bx=bd.minbx;bx<=bd.maxbx;bx+=2){
					if(bx===bd.minbx || bx===bd.maxbx || by===bd.minby || by===bd.maxby){
						var c = (bx>>1)+(by>>1)*(k.qcols+1);
						this.lcnt[c]=2;
					}
				}
			}
		}

		if(this.disroom){ return;}
		for(var id=0;id<bd.bdmax;id++){
			if(bd.isBorder(id)){
				var cc1 = bd.border[id].crosscc[0], cc2 = bd.border[id].crosscc[1];
				if(cc1!==-1){ this.lcnt[cc1]++;}
				if(cc2!==-1){ this.lcnt[cc2]++;}
			}
		}
	},
	resetRarea : function(){
		if(this.disroom){ return;}

		this.initRarea();
		this.room.max = 0;
		for(var cc=0;cc<bd.cellmax;cc++){ this.room.id[cc]=0;}
		for(var cc=0;cc<bd.cellmax;cc++){
			if(this.room.id[cc]!=0){ continue;}
			this.room.max++;
			this.room[this.room.max] = {top:-1,clist:[]};
			this.sr0(cc,this.room,bd.isBorder);
		}

		// �������ƂɁATOP�̏ꏊ�ɐ��������邩�ǂ������f���Ĉړ�����
		if(k.isOneNumber){
			for(var r=1;r<=this.room.max;r++){
				this.setTopOfRoom(r);

				var val = -1, clist = this.room[r].clist;
				for(var i=0,len=clist.length;i<len;i++){
					var c = clist[i];
					if(this.room.id[c]===r && bd.cell[c].qnum!==-1){
						if(val===-1){ val = bd.cell[c].qnum;}
						if(this.getTopOfRoom(r)!==c){ bd.sQnC(c, -1);}
					}
				}
				if(val!==-1 && bd.QnC(this.getTopOfRoom(r))===-1){ bd.sQnC(this.getTopOfRoom(r), val);}
			}
		}
	},

	lcntCross : function(id){ return this.lcnt[id];},

	getRoomID : function(cc){ return this.room.id[cc];},
//	setRoomID : function(cc,val){ this.room.id[cc] = val;},

	getTopOfRoomByCell : function(cc){ return this.room[this.room.id[cc]].top;},
	getTopOfRoom       : function(id){ return this.room[id].top;},

	getCntOfRoomByCell : function(cc){ return this.room[this.room.id[cc]].clist.length;},
//	getCntOfRoom       : function(id){ return this.room[id].clist.length;},

	//--------------------------------------------------------------------------------
	// area.setBorder()    ���E���������ꂽ�������Ă��肵�����ɁA�ϐ�lcnt�̓��e��ύX����
	// area.setTopOfRoom() �Z���̃��X�g���畔����TOP��ݒ肷��
	// area.sr0()          setBorder()����Ă΂�āA����id���܂ވ�̕����̗̈���A�w�肳�ꂽareaid�ɂ���
	//---------------------------------------------------------------------------
	setBorder : function(id,val){
		if(this.disroom){ return;}
		val = (val>0?1:0);

		var cc1, cc2, xc1 = bd.border[id].crosscc[0], xc2 = bd.border[id].crosscc[1];
		var room = this.room, roomid = room.id;
		if(val>0){
			this.lcnt[xc1]++; this.lcnt[xc2]++;

			if(this.lcnt[xc1]===1 || this.lcnt[xc2]===1){ return;}
			cc1 = bd.border[id].cellcc[0]; cc2 = bd.border[id].cellcc[1];
			if(cc1===-1 || cc2===-1 || roomid[cc1]!==roomid[cc2]){ return;}

			var baseid = roomid[cc1];

			// �܂���or�E���̃Z������q����Z����roomid��ύX����
			room.max++;
			room[room.max] = {top:-1,clist:[]}
			this.sr0(cc2,room,bd.isBorder);

			// ��������������Ă��Ȃ�������A���ɖ߂��ďI��
			if(roomid[cc1] === room.max){
				for(var i=0,len=room[room.max].clist.length;i<len;i++){
					roomid[room[room.max].clist[i]] = baseid;
				}
				room.max--;
				return;
			}

			// room�̏����X�V����
			var clist = room[baseid].clist.concat();
			room[baseid].clist = [];
			room[room.max].clist = [];
			for(var i=0,len=clist.length;i<len;i++){
				room[roomid[clist[i]]].clist.push(clist[i]);
			}

			// TOP�̏���ݒ肷��
			if(k.isOneNumber){
				if(roomid[room[baseid].top]===baseid){
					this.setTopOfRoom(room.max);
				}
				else{
					room[room.max].top = room[baseid].top;
					this.setTopOfRoom(baseid);
				}
			}
		}
		else{
			this.lcnt[xc1]--; this.lcnt[xc2]--;

			if(this.lcnt[xc1]===0 || this.lcnt[xc2]===0){ return;}
			cc1 = bd.border[id].cellcc[0]; cc2 = bd.border[id].cellcc[1];
			if(cc1===-1 || cc2===-1 || roomid[cc1]===roomid[cc2]){ return;}

			// k.isOneNumber�̎� �ǂ����̐������c�����́ATOP���m�̈ʒu�Ŕ�r����
			if(k.isOneNumber){
				var merged, keep;

				var tc1 = room[roomid[cc1]].top, tc2 = room[roomid[cc2]].top;
				var tbx1 = bd.cell[tc1].bx, tbx2 = bd.cell[tc2].bx;
				if(tbx1>tbx2 || (tbx1===tbx2 && tc1>tc2)){ merged = tc1; keep = tc2;}
				else                                     { merged = tc2; keep = tc1;}

				// �����镔���̂ق��̐���������
				if(bd.QnC(merged)!==-1){
					// �����������镔���ɂ����Ȃ��ꍇ -> �c��ق��Ɉړ�������
					if(bd.QnC(keep)===-1){ bd.sQnC(keep, bd.QnC(merged)); pc.paintCell(keep);}
					bd.sQnC(merged,-1); pc.paintCell(merged);
				}
			}

			// room, roomid���X�V
			var r1 = roomid[cc1], r2 = roomid[cc2], clist = room[r2].clist;
			for(var i=0;i<clist.length;i++){
				roomid[clist[i]] = r1;
				room[r1].clist.push(clist[i]);
			}
			room[r2] = {top:-1,clist:[]};
		}
	},
	setTopOfRoom : function(roomid){
		var cc=-1, bx=bd.maxbx, by=bd.maxby;
		var clist = this.room[roomid].clist;
		for(var i=0;i<clist.length;i++){
			var tc = bd.cell[clist[i]];
			if(tc.bx>bx || (tc.bx===bx && tc.by>=by)){ continue;}
			cc=clist[i];
			bx=tc.bx;
			by=tc.by;
		}
		this.room[roomid].top = cc;
	},
	sr0 : function(c,data,func){
		data.id[c] = data.max;
		data[data.max].clist.push(c);
		var tc;
		tc=bd.up(c); if( tc!==-1 && data.id[tc]!==data.max && !func(bd.ub(c)) ){ this.sr0(tc,data,func);}
		tc=bd.dn(c); if( tc!==-1 && data.id[tc]!==data.max && !func(bd.db(c)) ){ this.sr0(tc,data,func);}
		tc=bd.lt(c); if( tc!==-1 && data.id[tc]!==data.max && !func(bd.lb(c)) ){ this.sr0(tc,data,func);}
		tc=bd.rt(c); if( tc!==-1 && data.id[tc]!==data.max && !func(bd.rb(c)) ){ this.sr0(tc,data,func);}
	},

	//--------------------------------------------------------------------------------
	// area.initBarea()  ���}�X�֘A�̕ϐ�������������
	// area.resetBarea() ���}�X�̏���reset���āA1���犄�蓖�Ă��Ȃ���
	// area.initWarea()  ���}�X�֘A�̕ϐ�������������
	// area.resetWarea() ���}�X�̏���reset���āA1���犄�蓖�Ă��Ȃ���
	//--------------------------------------------------------------------------------
	initBarea : function(){
		this.bcell = {max:0,id:[]};
		for(var c=0;c<bd.cellmax;c++){
			this.bcell.id[c] = -1;
		}
	},
	resetBarea : function(){
		this.initBarea();
		if(!this.numberColony){ for(var cc=0;cc<bd.cellmax;cc++){ this.bcell.id[cc]=(bd.isBlack(cc)?0:-1);} }
		else                  { for(var cc=0;cc<bd.cellmax;cc++){ this.bcell.id[cc]=(bd.isNum(cc)  ?0:-1);} }
		for(var cc=0;cc<bd.cellmax;cc++){
			if(this.bcell.id[cc]!=0){ continue;}
			this.bcell.max++;
			this.bcell[this.bcell.max] = {clist:[]};
			this.sc0(cc,this.bcell);
		}
	},

	initWarea : function(){
		this.wcell = {max:1,id:[],1:{clist:[]}};
		for(var c=0;c<bd.cellmax;c++){
			this.wcell.id[c] = 1;
			this.wcell[1].clist[c]=c;
		}
	},
	resetWarea : function(){
		this.initWarea();
		this.wcell.max = 0;
		for(var cc=0;cc<bd.cellmax;cc++){ this.wcell.id[cc]=(bd.isWhite(cc)?0:-1); }
		for(var cc=0;cc<bd.cellmax;cc++){
			if(this.wcell.id[cc]!=0){ continue;}
			this.wcell.max++;
			this.wcell[this.wcell.max] = {clist:[]};
			this.sc0(cc,this.wcell);
		}
	},

	//--------------------------------------------------------------------------------
	// area.setCell()    ���}�X�E���}�X�����͂��ꂽ������ꂽ���ɁA���}�X/���}�XID�̏���ύX����
	// area.setBWCell()  setCell����Ă΂��֐�
	// area.sc0()        ����id���܂ވ�̗̈����areaid���w�肳�ꂽ���̂ɂ���
	//--------------------------------------------------------------------------------
	setCell : function(cc,val){
		if(val>0){
			if(this.bblock){ this.setBWCell(cc,1,this.bcell);}
			if(this.wblock){ this.setBWCell(cc,0,this.wcell);}
		}
		else{
			if(this.bblock){ this.setBWCell(cc,0,this.bcell);}
			if(this.wblock){ this.setBWCell(cc,1,this.wcell);}
		}
	},
	setBWCell : function(cc,val,data){
		var cid = [], dataid = data.id, tc;
		tc=bd.up(cc); if(tc!==-1 && dataid[tc]!==-1){ cid.push(tc);}
		tc=bd.dn(cc); if(tc!==-1 && dataid[tc]!==-1){ cid.push(tc);}
		tc=bd.lt(cc); if(tc!==-1 && dataid[tc]!==-1){ cid.push(tc);}
		tc=bd.rt(cc); if(tc!==-1 && dataid[tc]!==-1){ cid.push(tc);}

		// �V���ɍ��}�X(���}�X)�ɂȂ�����
		if(val>0){
			// �܂��ɍ��}�X(���}�X)���Ȃ����͐V����ID�œo�^�ł�
			if(cid.length===0){
				data.max++;
				data[data.max] = {clist:[cc]};
				dataid[cc] = data.max;
			}
			// 1�����ɂ���Ƃ��́A�����ɂ������΂悢
			else if(cid.length===1){
				data[dataid[cid[0]]].clist.push(cc);
				dataid[cc] = dataid[cid[0]];
			}
			// 2�����ȏ�̎�
			else{
				// ����ň�ԑ傫�ȍ��}�X�́H
				var largeid = dataid[cid[0]];
				for(var i=1;i<cid.length;i++){
					if(data[largeid].clist.length < data[dataid[cid[i]]].clist.length){ largeid=dataid[cid[i]];}
				}
				// �Ȃ��������}�X(���}�X)�͑S�ē���ID�ɂ���
				for(var i=0;i<cid.length;i++){
					if(dataid[cid[i]]===largeid){ continue;}
					var clist = data[dataid[cid[i]]].clist;
					for(var n=0,len=clist.length;n<len;n++){
						dataid[clist[n]] = largeid;
						data[largeid].clist.push(clist[n]);
					}
					clist = [];
				}
				// ��������������
				dataid[cc] = largeid;
				data[largeid].clist.push(cc);
			}
		}
		// ���}�X(���}�X)�ł͂Ȃ��Ȃ�����
		else{
			// �܂��ɍ��}�X(���}�X)���Ȃ����͏����������邾��
			if(cid.length===0){
				data[dataid[cc]].clist = [];
				dataid[cc] = -1;
			}
			// �܂��1�����̎����������������邾���ł悢
			else if(cid.length===1){
				var ownid = dataid[cc], clist = data[ownid].clist;
				for(var i=0;i<clist.length;i++){ if(clist[i]===cc){ clist.splice(i,1); break;} }
				dataid[cc] = -1;
			}
			// 2�����ȏ�̎��͍l�����K�v
			else{
				// ��x�����̗̈�̍��}�X(���}�X)���𖳌��ɂ���
				var ownid = dataid[cc], clist = data[ownid].clist;
				for(var i=0;i<clist.length;i++){ dataid[clist[i]] = 0;}
				data[ownid].clist = [];

				// ���������}�X(���}�X)��񂩂����
				dataid[cc] = -1;

				// �܂���ID��0�ȃZ���ɍ��}�X(���}�X)ID���Z�b�g���Ă���
				for(var i=0;i<cid.length;i++){
					if(dataid[cid[i]]!==0){ continue;}
					data.max++;
					data[data.max] = {clist:[]};
					this.sc0(cid[i],data);
				}
			}
		}
	},
	sc0 : function(c,data){
		data.id[c] = data.max;
		data[data.max].clist.push(c);
		var tc;
		tc=bd.up(c); if( tc!==-1 && data.id[tc]===0 ){ this.sc0(tc,data);}
		tc=bd.dn(c); if( tc!==-1 && data.id[tc]===0 ){ this.sc0(tc,data);}
		tc=bd.lt(c); if( tc!==-1 && data.id[tc]===0 ){ this.sc0(tc,data);}
		tc=bd.rt(c); if( tc!==-1 && data.id[tc]===0 ){ this.sc0(tc,data);}
	},

	//--------------------------------------------------------------------------------
	// area.getRoomInfo()  ��������AreaInfo�^�̃I�u�W�F�N�g�ŕԂ�
	// area.getBCellInfo() ���}�X����AreaInfo�^�̃I�u�W�F�N�g�ŕԂ�
	// area.getWCellInfo() ���}�X����AreaInfo�^�̃I�u�W�F�N�g�ŕԂ�
	// area.getNumberInfo() �������(=���}�X���)��AreaInfo�^�̃I�u�W�F�N�g�ŕԂ�
	// area.getAreaInfo()  ��L�֐��̋��ʏ���
	//--------------------------------------------------------------------------------
	getRoomInfo  : function(){ return this.getAreaInfo(this.room);},
	getBCellInfo : function(){ return this.getAreaInfo(this.bcell);},
	getWCellInfo : function(){ return this.getAreaInfo(this.wcell);},
	getNumberInfo : function(){ return this.getAreaInfo(this.bcell);},
	getAreaInfo : function(block){
		var info = new AreaInfo();
		for(var c=0;c<bd.cellmax;c++){ info.id[c]=(block.id[c]>0?0:-1);}
		for(var c=0;c<bd.cellmax;c++){
			if(info.id[c]!=0){ continue;}
			info.max++;
			var clist = block[block.id[c]].clist;
			info.room[info.max] = {idlist:clist}; /* �Q�Ƃ����Ȃ̂�concat()����Ȃ��Ă悢 */
			for(var i=0,len=clist.length;i<len;i++){ info.id[clist[i]] = info.max;}
		}
		return info;
	}
};
