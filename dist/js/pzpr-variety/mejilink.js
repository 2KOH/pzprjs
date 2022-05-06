/*! @license pzpr.js vf48a2f47 (c) 2009-2022 sabo2, MIT license
 *   https://github.com/sabo2/pzprv3 */

!function(a,b){"object"==typeof module&&module.exports?module.exports=[a,b]:pzpr.classmgr.makeCustom(a,b)}(["mejilink"],{MouseEvent:{inputModes:{edit:["info-line"],play:["line","peke","info-line"]},mouseinput_auto:function(){this.puzzle.playmode?"left"===this.btn?this.mousestart||this.mousemove?this.inputLine():this.mouseend&&this.notInputted()&&(this.prevPos.reset(),this.inputpeke()):"right"===this.btn&&(this.mousestart||this.mousemove)&&this.inputpeke():this.puzzle.editmode&&(this.mousestart||this.mousemove)&&this.inputborder()}},Border:{ques:1,enableLineNG:!0,isGround:function(){return this.ques>0},isLineNG:function(){return 1===this.ques}},BorderList:{allclear:function(a){for(var b=["ques","line","qsub"],c=0;c<this.length;c++)for(var d=this[c],e=0;e<b.length;e++){var f=b[e],g=d.constructor.prototype[f];"ques"===f&&(g=d.inside?1:0),d[f]!==g&&(a&&d.addOpe(f,d[f],g),d[f]=g)}}},Board:{cols:8,rows:8,hasborder:2,borderAsLine:!0,addExtraInfo:function(){this.tilegraph=this.addInfoList(this.klass.AreaTileGraph)},initBoardSize:function(a,b){this.common.initBoardSize.call(this,a,b),this.border.allclear(!1)}},LineGraph:{enabled:!0},"AreaTileGraph:AreaGraphBase":{enabled:!0,relation:{"border.ques":"separator"},setComponentRefs:function(a,b){a.tile=b},getObjNodeList:function(a){return a.tilenodes},resetObjNodeList:function(a){a.tilenodes=[]},isnodevalid:function(a){return!0},isedgevalidbylinkobj:function(a){return a.isGround()}},Graphic:{gridcolor_type:"LIGHT",margin:.5,paint:function(){this.drawBGCells(),this.drawDashedGrid(!1),this.drawBorders(),this.drawLines(),this.drawBaseMarks(),this.drawPekes()},getBorderColor:function(a){if(1===a.ques){var b=a.sidecell[1];return b.isnull||0===b.error?"white":this.errbcolor1}return null},repaintParts:function(a){this.range.crosses=a.crossinside(),this.drawBaseMarks()}},Encode:{decodePzpr:function(a){this.decodeMejilink()},encodePzpr:function(a){this.encodeMejilink()},decodeMejilink:function(){for(var a=this.outbstr,b=this.board,c=[16,8,4,2,1],d=a?Math.min((b.border.length+4)/5|0,a.length):0,e=0,f=0;f<d;f++)for(var g=parseInt(a.charAt(f),32),h=0;h<5;h++)b.border[e]&&(b.border[e].ques=g&c[h]?1:0,e++);this.outbstr=a.substr(d)},encodeMejilink:function(){for(var a=0,b=this.board,c=2*b.cols*b.rows-b.cols-b.rows,d=c;d<b.border.length;d++)b.border[d].isGround()&&a++;for(var e=0,f=0,g="",h=[16,8,4,2,1],d=0,i=0===a?c:b.border.length;d<i;d++)b.border[d].isGround()&&(f+=h[e]),5===++e&&(g+=f.toString(32),e=0,f=0);e>0&&(g+=f.toString(32)),this.outbstr+=g}},FileIO:{decodeData:function(){this.decodeBorder(function(a,b){"2"===b?(a.ques=0,a.line=1):"-1"===b?(a.ques=0,a.qsub=2):a.ques="1"===b?0:1})},encodeData:function(){this.encodeBorder(function(a){return 1===a.line?"2 ":2===a.qsub?"-1 ":0===a.ques?"1 ":"0 "})}},AnsCheck:{checklist:["checkBranchLine","checkCrossLine","checkDotLength","checkDeadendLine","checkOneLoop"],checkDotLength:function(){for(var a=this.board,b=a.tilegraph.components,c=0;c<b.length;c++)b[c].count=0;for(var d=0;d<a.border.length;d++){var e=a.border[d],f=e.sidecell[0],g=e.sidecell[1];e.isGround()&&!e.inside?(f.isnull||(f.tile.count-=999999),g.isnull||(g.tile.count-=999999)):e.isGround()||e.isLine()||(f.isnull||f.tile.count++,g.isnull||g.tile.count++)}for(var c=0;c<b.length;c++){var h=b[c].clist,i=b[c].count;if(!(i<0||i===h.length)){if(this.failcode.add("bkNoLineNe"),this.checkOnly)break;h.seterr(1)}}}},FailCode:{bkNoLineNe:["タイルと周囲の線が引かれない点線の長さが異なります。","The size of the tile is not equal to the total of length of lines that is remained dotted around the tile."]}});
//# sourceMappingURL=mejilink.js.map