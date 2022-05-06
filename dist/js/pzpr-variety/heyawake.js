/*! @license pzpr.js vf48a2f47 (c) 2009-2022 sabo2, MIT license
 *   https://github.com/sabo2/pzprv3 */

!function(a,b){"object"==typeof module&&module.exports?module.exports=[a,b]:pzpr.classmgr.makeCustom(a,b)}(["heyawake","ayeheya"],{MouseEvent:{RBShadeCell:!0,use:!0,inputModes:{edit:["border","number","clear","info-blk"],play:["shade","unshade","info-blk"]},mouseinput_auto:function(){this.puzzle.playmode?(this.mousestart||this.mousemove)&&this.inputcell():this.puzzle.editmode&&(this.mousestart||this.mousemove?this.inputborder():this.mouseend&&this.notInputted()&&this.inputqnum())}},KeyEvent:{enablemake:!0},Cell:{maxnum:function(){var a=this.room.clist.getRectSize(),b=a.cols,c=a.rows;if(b>c){var d=b;b=c,c=d}return 1===b?c+1>>1:2===b?c:3===b?c%4==0?c/4*5:c%4==1?(c-1)/4*5+2:c%4==2?(c-2)/4*5+3:(c+1)/4*5:Math.log(b+1)/Math.log(2)%1==0&&b===c?(b*c+b+c)/3:1&b&&1&c?(b*c+b+c-1)/3|0:(b*c+b+c-2)/3|0},minnum:0},Board:{hasborder:1},AreaUnshadeGraph:{enabled:!0},AreaRoomGraph:{enabled:!0,hastop:!0},Graphic:{gridcolor_type:"LIGHT",enablebcolor:!0,bgcellcolor_func:"qsub1",paint:function(){this.drawBGCells(),this.drawGrid(),this.drawShadedCells(),this.drawQuesNumbers(),this.drawBorders(),this.drawChassis(),this.drawBoxBorders(!1),this.drawTarget()}},Encode:{decodePzpr:function(a){this.decodeBorder(),this.decodeRoomNumber16()},encodePzpr:function(a){this.encodeBorder(),this.encodeRoomNumber16()},decodeKanpen:function(){this.fio.decodeSquareRoom()},encodeKanpen:function(){this.fio.encodeSquareRoom()},decodeHeyaApp:function(){for(var a=0,b=[],c=this.board,a=0;a<c.cell.length;a++)b[a]=null;for(var d=new this.puzzle.klass.FileIO,e=0,f=this.outbstr.split("/"),a=0;a<c.cell.length;a++)if(null===b[a]){var g=c.cell[a];if(f[e].match(/((\d+)in)?(\d+)x(\d+)$/)){RegExp.$2.length>0&&(g.qnum=+RegExp.$2);for(var h=g.bx,i=h+2*+RegExp.$3-2,j=g.by,k=j+2*+RegExp.$4-2,l=h;l<=i;l+=2)for(var m=j;m<=k;m+=2)b[c.getc(l,m).id]=e}e++}d.rdata2Border(!0,b)},encodeHeyaApp:function(){for(var a=[],b=this.board,c=b.roommgr.components,d=0;d<c.length;d++){var e=c[d].clist.getRectSize(),f=b.getc(e.x1,e.y1).qnum;a.push((f>=0?f+"in":"")+e.cols+"x"+e.rows)}this.outbstr=a.join("/")}},FileIO:{decodeData:function(){this.decodeAreaRoom(),this.decodeCellQnum(),this.decodeCellAns()},encodeData:function(){this.encodeAreaRoom(),this.encodeCellQnum(),this.encodeCellAns()},kanpenOpen:function(){this.decodeSquareRoom(),this.decodeCellAns()},kanpenSave:function(){this.encodeSquareRoom(),this.encodeCellAns()},decodeSquareRoom:function(){for(var a,b=this.board,c=[],d=0,e=+this.readLine();d<e&&(a=this.readLine());d++){for(var f=a.split(" "),g=0;g<4;g++)isNaN(f[g])||(f[g]=2*+f[g]+1);""!==f[4]&&(b.getc(f[1],f[0]).qnum=+f[4]),b.cellinside(f[1],f[0],f[3],f[2]).each(function(a){c[a.id]=d})}this.rdata2Border(!0,c),b.roommgr.rebuild()},encodeSquareRoom:function(){var a=this.board;a.roommgr.rebuild();var b=a.roommgr.components;this.writeLine(b.length);for(var c=0;c<b.length;c++){var d=b[c].clist.getRectSize(),e=b[c].top.qnum;this.writeLine([d.y1>>1,d.x1>>1,d.y2>>1,d.x2>>1,e>=0?""+e:""].join(" "))}},kanpenOpenXML:function(){this.decodeSquareRoom_XMLBoard(),this.decodeCellAns_XMLAnswer()},kanpenSaveXML:function(){this.encodeSquareRoom_XMLBoard(),this.encodeCellAns_XMLAnswer()},decodeSquareRoom_XMLBoard:function(){for(var a=this.xmldoc.querySelectorAll("board area"),b=this.board,c=[],d=0;d<a.length;d++){var e=a[d],f=2*+e.getAttribute("c0")-1,g=2*+e.getAttribute("r0")-1,h=2*+e.getAttribute("c1")-1,i=2*+e.getAttribute("r1")-1,j=+e.getAttribute("n");j>=0&&(b.getc(f,g).qnum=j);for(var k=f;k<=h;k+=2)for(var l=g;l<=i;l+=2)c[b.getc(k,l).id]=d}this.rdata2Border(!0,c),b.roommgr.rebuild()},encodeSquareRoom_XMLBoard:function(){var a=this.xmldoc.querySelector("board"),b=this.board;b.roommgr.rebuild();for(var c=b.roommgr.components,d=0;d<c.length;d++){var e=c[d].clist.getRectSize(),f=c[d].top.qnum;a.appendChild(this.createXMLNode("area",{r0:1+(e.y1>>1),c0:1+(e.x1>>1),r1:1+(e.y2>>1),c1:1+(e.x2>>1),n:f}))}}},AnsCheck:{checklist:["checkShadeCellExist","checkAdjacentShadeCell","checkConnectUnshadeRB","checkFractal@ayeheya","checkShadeCellCount","checkCountinuousUnshadeCell","checkRoomSymm@ayeheya","doneShadingDecided"],checkFractal:function(){var a=this.board.roommgr.components;a:for(var b=0;b<a.length;b++)for(var c=a[b].clist,d=c.getRectSize(),e=d.x1+d.x2,f=d.y1+d.y2,g=0;g<c.length;g++){var h=c[g],i=this.board.getc(e-h.bx,f-h.by);if(h.isShade()!==i.isShade()){if(this.failcode.add("bkNotSymShade"),this.checkOnly)break a;c.seterr(1)}}},checkRoomSymm:function(){var a=this.board.roommgr.components;a:for(var b=0;b<a.length;b++)for(var c=a[b].clist,d=c.getRectSize(),e=d.x1+d.x2,f=d.y1+d.y2,g=0;g<c.length;g++){var h=c[g],i=this.board.getc(e-h.bx,f-h.by);if(i.room!==a[b]){if(this.failcode.add("bkNotSymRoom"),this.checkOnly)break a;c.seterr(1)}}},checkCountinuousUnshadeCell:function(){var a=this.checkOnly;this.checkOnly=!0,this.checkRowsColsPartly(this.isBorderCount,function(a){return a.isShade()},"bkUnshadeConsecGt3"),this.checkOnly=a},isBorderCount:function(a){var b,c,d=a.getRectSize(),e=0,f=this.board;if(d.x1===d.x2)for(b=d.x1,c=d.y1+1;c<=d.y2-1;c+=2)f.getb(b,c).isBorder()&&e++;else if(d.y1===d.y2)for(c=d.y1,b=d.x1+1;b<=d.x2-1;b+=2)f.getb(b,c).isBorder()&&e++;var g=e<=1;return g||a.seterr(1),g}},FailCode:{bkUnshadeConsecGt3:["白マスが3部屋連続で続いています。","Unshaded cells are continued for three consecutive room."],bkNotSymShade:["部屋の中の黒マスが点対称に配置されていません。","Position of shaded cells in the room is not point symmetric."],bkNotSymRoom:["部屋の形が点対称ではありません。","The room is not point symmetric."]}});
//# sourceMappingURL=heyawake.js.map