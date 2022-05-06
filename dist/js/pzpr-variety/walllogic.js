/*! @license pzpr.js vf48a2f47 (c) 2009-2022 sabo2, MIT license
 *   https://github.com/sabo2/pzprv3 */

!function(a,b){"object"==typeof module&&module.exports?module.exports=[a,b]:pzpr.classmgr.makeCustom(a,b)}(["walllogic"],{MouseEvent:{inputModes:{edit:["number","shade","clear"]},mouseinput:function(){"shade"===this.inputMode?this.inputBlock():this.common.mouseinput.call(this)},mouseinput_auto:function(){this.puzzle.playmode?this.mousestart||this.mousemove?this.inputWall():this.mouseend&&this.notInputted()&&this.inputqcmp():this.puzzle.editmode&&this.mousestart&&this.inputcell_walllogic()},inputWall:function(){var a=this.getcell();if(!a.isnull){if(1===a.ques||-1!==a.qnum);else if(this.mouseCell!==a)this.firstPoint.set(this.inputPoint);else if(null!==this.firstPoint.bx){var b=null,c=this.inputPoint.bx-this.firstPoint.bx,d=this.inputPoint.by-this.firstPoint.by;d<=-.5?b=1:d>=.5?b=2:c<=-.5?b=3:c>=.5&&(b=4),null!==b&&null===this.inputData&&a.anum===b&&(b=-1);var e=null;null===b||(-1===b||-1===this.inputData?(e=-1,b=-1):a.anum>0||2===this.inputData?e=2:a.anum<0&&(e=1)),null===e||null!==this.inputData&&this.inputData!==e||(a.setAnum(b),this.inputData=e,this.firstPoint.reset())}this.mouseCell=a}},inputqcmp:function(){var a=this.getcell();a.isnull||(a.setQcmp(+!a.qcmp),a.draw(),this.mousereset())},inputBlock:function(){var a=this.getcell();a.isnull||a===this.mouseCell||(a.setQues(1===a.ques?0:1),a.setQnum(-1),a.setAnum(-1),a.drawaround(),this.mouseCell=a)},inputcell_walllogic:function(a){var a=this.getcell();if(!a.isnull&&a!==this.mouseCell){if(a!==this.cursor.getc())return void this.setcursor(a);var b,c=a.ques,d=a.qnum;b=-1!==d?d>=0?d:-1:c>0?-3:-2;var e=a.getmaxnum(),f=-3;this.inputMode.match(/number/)&&(f=-2),"left"===this.btn?b++:"right"===this.btn&&b--,b>e&&(b=f),b<f&&(b=e),b>=-1?(a.setQues(0),a.setQnum(b>=0?b:-2)):-2===b?(a.setQues(0),a.setQnum(-1)):(a.setQues(1),a.setQnum(-1)),a.setAnum(-1)}}},KeyEvent:{enablemake:!0,keyinput:function(a){this.key_inputqnum_tateyoko(a)||this.key_inputqnum(a)},key_inputqnum_tateyoko:function(a){var b=this.cursor.getc();return("q"===a||"q1"===a||"q2"===a)&&("q"===a&&(a=1!==b.ques?"q1":"q2"),"q1"===a?(b.setQues(1),b.setQnum(-1),b.setAnum(-1)):"q2"===a&&b.setQues(0),this.prev=b,b.drawaround(),!0)}},Cell:{basecell:null,prevbasecell:null,maxnum:function(){var a=this.board;return a.cols+a.rows-2},minnum:0,revdircell:function(a){return this.getaddr().movedir(a,-2).getc()},isTip:function(){return this.getaddr().movedir(this.anum,2).getc().anum!==this.anum},isGap:function(){if(-1===this.anum)return!1;var a=this.anum,b=this.revdircell(this.anum).anum;b<=0&&(b=0);var c=1<<a|1<<b;return 24===c||6===c},getWallClist:function(){var a,b=this.adjacent,c=new this.klass.CellList;return a=b.top,a.anum===a.UP&&c.extend(a.wall.clist),a=b.bottom,a.anum===a.DN&&c.extend(a.wall.clist),a=b.left,a.anum===a.LT&&c.extend(a.wall.clist),a=b.right,a.anum===a.RT&&c.extend(a.wall.clist),c},isCmp:function(){return 1===this.qcmp||!!this.puzzle.execConfig("autocmp")&&this.qnum===this.getWallClist().length},prehook:{anum:function(){return this.prevbasecell=this.basecell,!1}},posthook:{anum:function(){this.wall?this.basecell=this.wall.clist.getBaseCell():this.basecell=this.board.emptycell,this.drawaround(),this.puzzle.execConfig("autocmp")&&(this.prevbasecell&&this.prevbasecell.draw(),this.basecell&&this.basecell.draw())}}},CellList:{getBaseCell:function(){for(var a=0;a<this.length;++a){var b=this[a],c=b.revdircell(b.anum);if(b.wall!==c.wall)return c}return this.board.emptycell}},Board:{disable_subclear:!0,addExtraInfo:function(){this.wallgraph=this.addInfoList(this.klass.AreaWallGraph)}},BoardExec:{adjustBoardData:function(a,b){this.adjustCellAnumArrow(a,b)},adjustCellAnumArrow:function(a,b){for(var c=this.getTranslateDir(a),d=this.board.cellinside(b.x1,b.y1,b.x2,b.y2),e=0;e<d.length;e++){var f=d[e],g=c[f.anum];g&&f.setAnum(g)}}},"AreaWallGraph:AreaGraphBase":{enabled:!0,relation:{"cell.anum":"node"},setComponentRefs:function(a,b){a.wall=b},getObjNodeList:function(a){return a.wallnodes},resetObjNodeList:function(a){a.wallnodes=[]},isnodevalid:function(a){return a.anum>0},isedgevalidbynodeobj:function(a,b){if(a.anum!==b.anum)return!1;var c=a.getdir(b,2);return c===a.UP||c===a.DN?a.anum===a.UP||a.anum===a.DN:(c===a.LT||c===a.RT)&&(a.anum===a.LT||a.anum===a.RT)}},Graphic:{autocmp:"number",gridcolor_type:"LIGHT",paint:function(){this.drawBGCells(),this.drawGrid(),this.drawQuesCells(),this.drawWalls(),this.drawQuesNumbers(),this.drawChassis(),this.drawTarget()},getBGCellColor:function(a){return-1===a.qnum||1!==a.error&&1!==a.qinfo?null:this.errbcolor1},getQuesNumberColor:function(a){return 1===a.error?this.errcolor1:a.isCmp()?this.qcmpcolor:this.quescolor},drawWalls:function(){var a,b,c,d,e,f=this.vinc("cell_wall","auto");a=this.bw,b=Math.max(this.cw/6,3)/2,d=.16*this.cw,e=Math.max(this.cw/2,4)/2,b=b>=1?b:1,e=e>=5?e:5,c=Math.max(.08*this.cw,2);for(var g=this.range.cells,h=0;h<g.length;h++){var i=g[h],j=i.anum,k=null;if(j>=1&&j<=4){var l=i.error||i.qinfo;k=1===l?this.errlinecolor:-1===l?this.noerrcolor:i.trial?this.trialcolor:this.linecolor}if(f.vid="c_wall_"+i.id,k){f.fillStyle=k,f.beginPath();var m=i.bx*this.bw,n=i.by*this.bh,o=[m,n];if(i.isTip())switch(j){case i.UP:o.push(b,-d,e,-d,0,-a,-e,-d,-b,-d);break;case i.DN:o.push(b,d,e,d,0,a,-e,d,-b,d);break;case i.LT:o.push(-d,b,-d,e,-a,0,-d,-e,-d,-b);break;case i.RT:o.push(d,b,d,e,a,0,d,-e,d,-b)}else switch(j){case i.UP:o.push(b,-a,-b,-a);break;case i.DN:o.push(b,a,-b,a);break;case i.LT:o.push(-a,b,-a,-b);break;case i.RT:o.push(a,b,a,-b)}var p=a-(i.isGap()?c:0);switch(j){case i.UP:o.push(-b,p,b,p);break;case i.DN:o.push(-b,-p,b,-p);break;case i.LT:o.push(p,-b,p,b);break;case i.RT:o.push(-p,-b,-p,b)}o.push(!0),f.setOffsetLinePath.apply(f,o),f.fill()}else f.vhide()}}},Encode:{decodePzpr:function(a){this.decodeWallLogic()},encodePzpr:function(a){this.encodeWallLogic()},decodeWallLogic:function(){var a=0,b=0,c=this.outbstr,d=this.board;for(b=0;b<c.length;b++){var e=c.charAt(b),f=d.cell[a];if("+"===e?f.ques=1:this.include(e,"0","9")||this.include(e,"a","f")?f.qnum=parseInt(e,16):"-"===e?(f.qnum=parseInt(c.substr(b+1,2),16),b+=2):"."===e?f.qnum=-2:e>="g"&&e<="z"&&(a+=parseInt(e,36)-16),a++,!d.cell[a])break}this.outbstr=c.substr(b)},encodeWallLogic:function(a){for(var b="",c=0,d=this.board,e=0;e<d.cell.length;e++){var f="",g=d.cell[e].ques,h=d.cell[e].qnum;1===g?f="+":-1===h?c++:-2===h?f=".":h<16?f=""+h.toString(16):h<256?f="-"+h.toString(16):(f="",c++),0===c?b+=f:(f||20===c)&&(b+=(15+c).toString(36)+f,c=0)}c>0&&(b+=(15+c).toString(36)),this.outbstr+=b}},FileIO:{decodeData:function(){this.decodeQuesQnum(),this.decodeCellAnumcmp()},encodeData:function(){this.encodeQuesQnum(),this.encodeCellAnumcmp()},decodeQuesQnum:function(){this.decodeCell(function(a,b){"#"===b?a.ques=1:"-"===b?a.qnum=-2:"."!==b&&(a.qnum=+b)})},encodeQuesQnum:function(){this.encodeCell(function(a){return 1===a.ques?"# ":a.qnum>=0?a.qnum+" ":-2===a.qnum?"- ":". "})},decodeCellAnumcmp:function(){this.decodeCell(function(a,b){"-"===b?a.qcmp=1:"."!==b&&(a.anum=+b)})},encodeCellAnumcmp:function(){this.encodeCell(function(a){return-1!==a.anum?a.anum+" ":1===a.qcmp?"- ":". "})}},AnsCheck:{checklist:["checkWallExist+","checkLongWall","checkShortWall","checkNoWall","checkIsolateWall"],checkWallExist:function(){this.board.wallgraph.components.length>0||this.failcode.add("brNoLine")},checkLongWall:function(){this.checkWall(1,"nmConnWallGt")},checkShortWall:function(){this.checkWall(2,"nmConnWallLt")},checkNoWall:function(){this.checkWall(3,"nmConnNoWall")},checkWall:function(a,b){for(var c=this.board,d=!0,e=0;e<c.cell.length;e++){var f=c.cell[e],g=f.qnum;if(!(g<0)){var h=f.getWallClist();if(!(1===a&&h.length<=g||2===a&&(h.length>=g||0===h.length)||3===a&&h.length>0&&g>0)){if(d=!1,this.checkOnly)break;f.seterr(1),h.seterr(1)}}}d||(this.failcode.add(b),c.cell.setnoerr())},checkIsolateWall:function(){for(var a=this.board.wallgraph.components,b=!0,c=0;c<a.length;c++){var d=a[c].clist;if(-1===d.getBaseCell().qnum){if(b=!1,this.checkOnly)break;d.seterr(1)}}b||(this.failcode.add("lbIsolate"),this.board.cell.setnoerr())}},FailCode:{nmConnWallGt:["数字に繋がる線が長いです。","The lines connected to a number is long."],nmConnWallLt:["数字に繋がる線が短いです。","The lines connected to a number is short."],nmConnNoWall:["数字に線が繋がっていません。","The number isn't connected by any lines."],lbIsolate:["数字につながっていない線があります。","A line doesn't connect to any number."]}});
//# sourceMappingURL=walllogic.js.map