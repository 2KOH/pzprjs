// AreaManager.js

pzpr.classmgr.makeCommon({
//--------------------------------------------------------------------------------
// ★AreaGraphBaseクラス セルの部屋情報などを保持するクラス
//   ※このクラスで管理しているroomsは左上からの順番に並ばないので
//     回答チェックやURL出力前には一旦resetRoomNumber()等が必要です。
//--------------------------------------------------------------------------------
"AreaGraphBase:GraphBase":{
	relation : {'cell.qans':'node'},
	pointgroup : 'cell',

	isedgevalidbynodeobj : function(cell1, cell2){
		return this.isedgevalidbylinkobj(this.board.getb(((cell1.bx+cell2.bx)>>1), ((cell1.by+cell2.by)>>1)));
	},

	//--------------------------------------------------------------------------------
	// areagraph.setExtraData()   指定された領域の拡張データを設定する
	//--------------------------------------------------------------------------------
	setExtraData : function(component){
		component.clist = new this.klass.CellList(component.getnodeobjs());
	},

	//---------------------------------------------------------------------------
	// areagraph.getSideAreaInfo()  接しているが異なる領域部屋の情報を取得する
	//---------------------------------------------------------------------------
	getSideAreaInfo : function(cellinfo){
		var sides=[], len=this.components.length, adjs={}, bd=this.board;
		for(var r=0;r<this.components.length;r++){ this.components[r].id = r;}
		for(var id=0;id<bd.border.length;id++){
			var cell1 = bd.border[id].sidecell[0], cell2 = bd.border[id].sidecell[1];
			if(cell1.isnull || cell2.isnull){ continue;}
			var room1=cell1[cellinfo], room2=cell2[cellinfo];
			if(room1===room2 || room1===null || room2===null){ continue;}

			var key = (room1.id<room2.id ? room1.id*len+room2.id : room2.id*len+room1.id);
			if(!!adjs[key]){ continue;}
			adjs[key] = true;

			sides.push([room1,room2]);
		}
		return sides;
	}
},

//--------------------------------------------------------------------------------
// ☆AreaShadeGraphクラス  黒マス情報オブジェクトのクラス
// ☆AreaUnshadeGraphクラス  白マス情報オブジェクトのクラス
// ☆AreaNumberGraphクラス 数字情報オブジェクトのクラス
//--------------------------------------------------------------------------------
'AreaShadeGraph:AreaGraphBase':{
	setComponentRefs : function(obj, component){ obj.sblk = component;},
	getObjNodeList   : function(nodeobj){ return nodeobj.sblknodes;},
	resetObjNodeList : function(nodeobj){ nodeobj.sblknodes = [];},
	
	isnodevalid : function(cell){ return cell.isShade();},

	//--------------------------------------------------------------------------------
	// sblkmgr.setExtraData()   指定された領域の拡張データを設定する
	//--------------------------------------------------------------------------------
	setExtraData : function(component){
		component.clist = new this.klass.CellList(component.getnodeobjs());
		if(this.puzzle.painter.irowakeblk && !component.color){
			component.color = this.puzzle.painter.getNewLineColor();
		}
	},

	//--------------------------------------------------------------------------------
	// sblkmgr.repaintNodes() ブロックを再描画する
	//--------------------------------------------------------------------------------
	repaintNodes : function(components){
		var clist_all = new this.klass.CellList();
		for(var i=0;i<components.length;i++){
			clist_all.extend(components[i].getnodeobjs());
		}
		this.puzzle.painter.repaintBlocks(clist_all);
	}
},

'AreaUnshadeGraph:AreaGraphBase':{
	setComponentRefs : function(obj, component){ obj.ublk = component;},
	getObjNodeList   : function(nodeobj){ return nodeobj.ublknodes;},
	resetObjNodeList : function(nodeobj){ nodeobj.ublknodes = [];},
	
	isnodevalid : function(cell){ return cell.isUnshade();}
},

'AreaNumberGraph:AreaGraphBase':{
	relation : {'cell.qnum':'node', 'cell.anum':'node', 'cell.qsub':'node'},
	setComponentRefs : function(obj, component){ obj.nblk = component;},
	getObjNodeList   : function(nodeobj){ return nodeobj.nblknodes;},
	resetObjNodeList : function(nodeobj){ nodeobj.nblknodes = [];},
	
	isnodevalid : function(cell){ return cell.isNumberObj();}
},

//--------------------------------------------------------------------------------
// ☆AreaRoomGraphクラス 部屋情報オブジェクトのクラス
//--------------------------------------------------------------------------------
'AreaRoomGraph:AreaGraphBase':{
	relation : {'cell.ques':'node', 'border.ques':'separator', 'border.qans':'separator'},

	hastop : false,

	setComponentRefs : function(obj, component){ obj.room = component;},
	getObjNodeList   : function(nodeobj){ return nodeobj.roomnodes;},
	resetObjNodeList : function(nodeobj){ nodeobj.roomnodes = [];},
	
	isnodevalid : function(cell){ return (cell.ques!==7);},
	isedgevalidbylinkobj : function(border){ return !border.isBorder();},

	//--------------------------------------------------------------------------------
	// roomgraph.rebuild2() 部屋情報の再設定を行う
	//--------------------------------------------------------------------------------
	rebuild2 : function(){
		this.klass.AreaGraphBase.prototype.rebuild2.call(this);
		this.resetBorderCount();
	},

	//---------------------------------------------------------------------------
	// roomgraph.resetBorderCount()  初期化時に、lcnt情報を初期化する
	// roomgraph.incdecBorderCount() 線が引かれたり消された時に、lcnt変数を生成し直す
	//---------------------------------------------------------------------------
	resetBorderCount : function(){
		var bd = this.board, borders = bd.border;
		/* 外枠のカウントをあらかじめ足しておく */
		for(var c=0;c<bd.cross.length;c++){
			var cross = bd.cross[c], bx = cross.bx, by = cross.by;
			var ischassis = (bd.hasborder===1 ? (bx===bd.minbx||bx===bd.maxbx||by===bd.minby||by===bd.maxby) : false);
			cross.lcnt = (ischassis?2:0);
		}
		for(var id=0;id<borders.length;id++){
			if(!this.isedgevalidbylinkobj(borders[id])){
				this.incdecBorderCount(borders[id], true);
			}
		}
	},
	incdecBorderCount : function(border, isset){
		for(var i=0;i<2;i++){
			var cross = border.sidecross[i];
			if(!cross.isnull){
				if(isset){ cross.lcnt++;}else{ cross.lcnt--;}
			}
		}
	},

	//---------------------------------------------------------------------------
	// roommgr.addEdge() 境界線を消した時の処理
	//---------------------------------------------------------------------------
	addEdge : function(node1, node2){
		this.klass.GraphBase.prototype.addEdge.call(this,node1,node2);
		if(this.hastop && !this.rebuildmode){ this.setTopOfRoom_combine(node1.obj,node2.obj);}
	},

	//--------------------------------------------------------------------------------
	// roommgr.setTopOfRoom_combine()  部屋が繋がったとき、部屋のTOPを設定する
	//--------------------------------------------------------------------------------
	setTopOfRoom_combine : function(cell1,cell2){
		if(!cell1.room || !cell2.room || cell1.room===cell2.room){ return;}
		var merged, keep;
		var tcell1 = cell1.room.top;
		var tcell2 = cell2.room.top;
		if(tcell1.bx>tcell2.bx || (tcell1.bx===tcell2.bx && tcell1.by>tcell2.by)){ merged = tcell1; keep = tcell2;}
		else                                                                     { merged = tcell2; keep = tcell1;}

		// 消える部屋のほうの数字を消す
		if(merged.isNum()){
			// 数字が消える部屋にしかない場合 -> 残るほうに移動させる
			if(keep.noNum()){
				keep.setQnum(merged.qnum);
				keep.draw();
			}
			merged.setQnum(-1);
			merged.draw();
		}
	},

	//--------------------------------------------------------------------------------
	// roommgr.setExtraData()   指定された領域の拡張データを設定する
	//--------------------------------------------------------------------------------
	setExtraData : function(component){
		var clist = component.clist = new this.klass.CellList(component.getnodeobjs());
		if(this.hastop){
			component.top = clist.getTopCell();
			
			if(this.rebuildmode){
				var val = -1, clist = clist, top = component.top;
				for(var i=0,len=clist.length;i<len;i++){
					var cell = clist[i];
					if(cell.room===component && cell.qnum!==-1){
						if(val===-1){ val = cell.qnum;}
						if(top!==cell){ cell.qnum = -1;}
					}
				}
				if(val!==-1 && top.qnum===-1){
					top.qnum = val;
				}
			}
		}
		if(this.puzzle.painter.autocmp==='room'){
			component.checkAutoCmp();
		}
	}
}
});
