/*! @license pzpr.js vf48a2f47 (c) 2009-2022 sabo2, MIT license
 *   https://github.com/sabo2/pzprv3 */

!function(a,b){"object"==typeof module&&module.exports?module.exports=[a,b]:pzpr.classmgr.makeCustom(a,b)}(["kaero","armyants"],{MouseEvent:{inputModes:{edit:["border","number","clear"],play:["line","peke","bgcolor","bgcolor1","bgcolor2","clear"]},mouseinput_auto:function(){this.puzzle.playmode?this.mousestart||this.mousemove?"left"===this.btn?this.inputLine():"right"===this.btn&&this.inputpeke():this.mouseend&&this.notInputted()&&this.inputlight():this.puzzle.editmode&&(this.mousestart||this.mousemove?this.inputborder():this.mouseend&&this.notInputted()&&this.inputqnum())},inputlight:function(){var a=this.getcell();a.isnull||(0===a.qsub?a.setQsub("left"===this.btn?1:2):1===a.qsub?a.setQsub("left"===this.btn?2:0):2===a.qsub&&a.setQsub("left"===this.btn?0:1),a.draw())}},KeyEvent:{enablemake:!0},"Cell@kaero":{numberAsLetter:!0,maxnum:52},"Cell@armyants":{maxnum:function(){var a=this.board.cell.length;return a<=999?a:999},getNextStepCell:function(a){for(var b=this.antnodes[0].nodes,c=[],d=0;d<b.length;++d){var e=b[d].obj;e.base.qnum!==a+1&&-2!==e.base.qnum||c.push({dir:this.getdir(e,2),cell:e})}return c}},CellList:{getDeparture:function(){return this.map(function(a){return a.base}).notnull()}},"CellList@armyants":{isCmp:function(){if(1===this.length&&(1===this[0].base.qnum||-2===this[0].base.qnum))return!0;var a=this.filter(function(a){return 1===a.base.qnum})[0];if(a)return this.traceNumber(a);for(var b=this.filter(function(a){return-2===a.base.qnum}),c=0;c<b.length;++c)if(this.traceNumber(b[c]))return!0;return!1},traceNumber:function(a){for(var b=[{prev:null,cell:a,next:a.getNextStepCell(1)}];b.length>0&&b.length<this.length;){for(var c=b[b.length-1],d=c.cell,e=null;!e&&c.next.length>0;){var f=c.next.shift(),g=f.cell;g!==c.prev&&(e={prev:d,cell:g,next:g.getNextStepCell(b.length+1)})}e?b.push(e):b.pop()}return b.length>=this.length}},"Border@armyants":{enableLineNG:!0,isLineNG:function(){return this.isBorder()}},Board:{cols:6,rows:6,hasborder:1},"Board@armyants":{addExtraInfo:function(){this.antmgr=this.addInfoList(this.klass.AreaAntGraph)}},LineGraph:{enabled:!0,moveline:!0},"AreaRoomGraph@kaero":{enabled:!0},"AreaAntGraph:AreaGraphBase@armyants":{enabled:!0,relation:{"cell.qnum":"node","border.line":"move"},setComponentRefs:function(a,b){a.ant=b},getObjNodeList:function(a){return a.antnodes},resetObjNodeList:function(a){a.antnodes=[]},isnodevalid:function(a){return-1!==a.base.qnum},isedgevalidbynodeobj:function(a,b){var c=a.base.qnum,d=b.base.qnum;return-2===c||-2===d||-1===c==(-1===d)&&1===Math.abs(c-d)},modifyOtherInfo:function(a,b){this.setEdgeByNodeObj(a.sidecell[0]),this.setEdgeByNodeObj(a.sidecell[1])}},Graphic:{gridcolor_type:"LIGHT",bgcellcolor_func:"qsub2",numbercolor_func:"move",qsubcolor1:"rgb(224, 224, 255)",qsubcolor2:"rgb(255, 255, 144)",paint:function(){this.drawBGCells(),this.drawDashedGrid(),this.drawBorders(),this.drawTip(),this.drawPekes(),this.drawDepartures(),this.drawLines(),this.drawCellSquare(),this.drawQuesNumbers(),this.drawChassis(),this.drawTarget()},drawCellSquare:function(){for(var a=this.vinc("cell_number_base","crispEdges",!0),b=.7*this.bw-1,c=.7*this.bh-1,d=this.puzzle.execConfig("dispmove"),e=this.range.cells,f=0;f<e.length;f++){var g=e[f];a.vid="c_sq_"+g.id,!d&&g.isDeparture()||d&&g.isDestination()?(1===g.error?a.fillStyle=this.errbcolor1:1===g.qsub?a.fillStyle=this.qsubcolor1:2===g.qsub?a.fillStyle=this.qsubcolor2:a.fillStyle=this.bgcolor,a.fillRectCenter(g.bx*this.bw,g.by*this.bh,b,c)):a.vhide()}}},Encode:{decodePzpr:function(a){this.decodeBorder(),"kaero"===this.pid?this.decodeKaero():this.decodeNumber16()},encodePzpr:function(a){this.encodeBorder(),"kaero"===this.pid?this.encodeKaero():this.encodeNumber16()},decodeKaero:function(){for(var a=0,b=0,c=this.outbstr,d=this.board,e=0;e<c.length;e++){var f=c.charAt(e),g=d.cell[a];if(this.include(f,"0","9")?g.qnum=parseInt(f,36)+27:this.include(f,"A","Z")?g.qnum=parseInt(f,36)-9:"-"===f?(g.qnum=parseInt(c.charAt(e+1),36)+37,e++):"."===f?g.qnum=-2:this.include(f,"a","z")&&(a+=parseInt(f,36)-10),a++,!d.cell[a]){b=e+1;break}}this.outbstr=c.substring(b)},encodeKaero:function(){for(var a="",b=0,c=this.board,d=0;d<c.cell.length;d++){var e="",f=c.cell[d].qnum;-2===f?e=".":f>=1&&f<=26?e=""+(f+9).toString(36).toUpperCase():f>=27&&f<=36?e=""+(f-27).toString(10):f>=37&&f<=72?e="-"+(f-37).toString(36).toUpperCase():b++,0===b?a+=e:(e||26===b)&&(a+=(9+b).toString(36).toLowerCase()+e,b=0)}b>0&&(a+=(9+b).toString(36).toLowerCase()),this.outbstr+=a}},FileIO:{decodeData:function(){this.decodeCellQnum(),this.decodeCellQanssub(),this.decodeBorderQues(),this.decodeBorderLine()},encodeData:function(){this.encodeCellQnum(),this.encodeCellQanssub(),this.encodeBorderQues(),this.encodeBorderLine()}},"AnsCheck@kaero#1":{checklist:["checkBranchLine","checkCrossLine","checkConnectObject","checkLineOverLetter","checkSameObjectInRoom_kaero","checkGatheredObject","checkNoObjectBlock","checkDisconnectLine"]},"AnsCheck@armyants#1":{checklist:["checkBranchLine","checkCrossLine","checkConnectObject","checkLineOverLetter","checkLineOverBorder","checkUniqueNumberInBlock","checkNumberWithinSize","checkSideCell_ants","checkAntNumber","checkDisconnectLine","checkNumberExist"]},"AnsCheck@kaero":{checkSameObjectInRoom_kaero:function(){var a=this.board.roommgr.components;a:for(var b=0;b<a.length;b++)for(var c=a[b].clist,d=-1,e=c.getDeparture(),f=0;f<e.length;f++){var g=e[f].qnum;if(-1===d)d=g;else if(d!==g){if(this.failcode.add("bkPlNum"),this.checkOnly)break a;this.puzzle.execConfig("dispmove")||e.seterr(4),c.seterr(1)}}},checkGatheredObject:function(){for(var a=0,b=this.board,c=0;c<b.cell.length;c++){var d=b.cell[c].base.qnum;a<d&&(a=d)}a:for(var d=0;d<=a;d++)for(var e=b.cell.filter(function(a){return d===a.base.qnum}),f=null,g=0;g<e.length;g++){var h=e[g].room;if(null===f)f=h;else if(null!==h&&f!==h){this.failcode.add("bkSepNum"),this.puzzle.execConfig("dispmove")||e.getDeparture().seterr(4),e.seterr(1);break a}}},checkNoObjectBlock:function(){this.checkNoMovedObjectInRoom(this.board.roommgr)}},"AnsCheck@armyants":{checkLineOverBorder:function(){for(var a=this.board,b=!0,c=0;c<a.border.length;c++){var d=a.border[c];if(d.isBorder()&&d.isLine()){if(b=!1,this.checkOnly)break;d.seterr(1)}}b||(this.failcode.add("laOnBorder"),a.border.setnoerr())},checkUniqueNumberInBlock:function(){this.checkDifferentNumberInRoom_main(this.board.antmgr,this.isDifferentNumberInClistBase)},isDifferentNumberInClistBase:function(a){return this.isIndividualObject(a,function(a){return a.base.qnum})},checkNumberWithinSize:function(){this.checkAllCell(function(a){return a.ant&&a.base.qnum>a.ant.clist.length},"ceNumGtSize")},checkAntNumber:function(){for(var a=this.board.antmgr.components,b=0;b<a.length;b++){var c=a[b];if(!c.clist.isCmp()){if(this.failcode.add("bkWrongNum"),this.checkOnly)break;this.board.cell.setnoerr(),c.clist.seterr(1)}}},checkSideCell_ants:function(){for(var a=!0,b=this.board,c=0;c<b.cell.length;c++){var d=b.cell[c],e=null,f=d.adjacent.right,g=d.adjacent.bottom;if(d.ant&&(!f.isnull&&f.ant&&d.ant!==f.ant?e=f:!g.isnull&&g.ant&&d.ant!==g.ant&&(e=g),e)){if(a=!1,this.checkOnly)break;d.ant.clist.seterr(1),e.ant.clist.seterr(1)}}a||this.failcode.add("bsAnt")}},"FailCode@kaero":{bkNoNum:["アルファベットのないブロックがあります。","An area has no letters."],bkPlNum:["１つのブロックに異なるアルファベットが入っています。","An area has more than one kind of letter."],bkSepNum:["同じアルファベットが異なるブロックに入っています。","Letters of one kind are placed in different areas."]},"FailCode@armyants":{laOnNum:["数字の上を線が通過しています。","There is a line across a number."],laOnBorder:["線が境界線をまたいでいます。","There is a line across a border."],bsAnt:["別々のアリが接しています。","Two ants are adjacent."],bkWrongNum:["アリの数字がおかしいです。","The numbers on the ant are wrong."],ceNumGtSize:["数字がアリの大きさよりも大きいです。","A number is greater than the size of the ant."]}});
//# sourceMappingURL=kaero.js.map