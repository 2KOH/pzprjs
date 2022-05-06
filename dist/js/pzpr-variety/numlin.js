/*! @license pzpr.js vf48a2f47 (c) 2009-2022 sabo2, MIT license
 *   https://github.com/sabo2/pzprv3 */

!function(a,b){"object"==typeof module&&module.exports?module.exports=[a,b]:pzpr.classmgr.makeCustom(a,b)}(["numlin","arukone"],{MouseEvent:{inputModes:{edit:["number","clear","info-line"],play:["line","peke","info-line"]},mouseinput_auto:function(){this.puzzle.playmode?"left"===this.btn?this.mousestart||this.mousemove?this.inputLine():this.mouseend&&this.notInputted()&&this.inputpeke():"right"===this.btn&&(this.mousestart||this.mousemove)&&this.inputpeke():this.puzzle.editmode&&this.mousestart&&this.inputqnum()}},KeyEvent:{enablemake:!0},"Cell@arukone":{numberAsLetter:!0,maxnum:52},Board:{hasborder:1},LineGraph:{enabled:!0,makeClist:!0},Graphic:{gridcolor_type:"LIGHT",numbercolor_func:"qnum",irowake:!0,paint:function(){this.drawBGCells(),"numlin"===this.pid&&this.drawGrid(),this.drawPekes(),this.drawLines(),this.drawCellSquare(),this.drawQuesNumbers(),"arukone"===this.pid&&this.drawCrossSquares(),this.drawChassis(),this.drawTarget()},drawCellSquare:function(){for(var a=this.vinc("cell_number_base","crispEdges",!0),b=this.bw*("arukone"!==this.pid?.7:.5)-1,c=this.bh*("arukone"!==this.pid?.7:.5)-1,d=this.range.cells,e=0;e<d.length;e++){var f=d[e];a.vid="c_sq_"+f.id,-1!==f.qnum?(a.fillStyle=1===f.error?this.errbcolor1:this.bgcolor,a.fillRectCenter(f.bx*this.bw,f.by*this.bh,b,c)):a.vhide()}}},"Graphic@arukone":{fontsizeratio:.5,textoption:{style:"900"},drawCrossSquares:function(){var a=this.vinc("cross_mark","auto",!0),b=this.board;a.fillStyle=this.quescolor;for(var c=.5*this.cw,d=this.range.crosses,e=0;e<d.length;e++){var f=d[e],g=f.bx,h=f.by;g!==b.maxbx&&h!==b.maxby&&g!==b.minbx&&h!==b.minby&&(a.vid="x_cm_"+f.id,a.fillRect(g*this.bw-c/2,h*this.bh-c/2,c,c))}},margin:0,drawTarget:function(){this.drawCursor(!1,this.puzzle.editmode)},drawChassis:function(){var a=this.vinc("chassis","crispEdges",!0),b=this.board,c=this.range.x1,d=this.range.y1,e=this.range.x2,f=this.range.y2;c<0&&(c=0),e>2*b.cols&&(e=2*b.cols),d<0&&(d=0),f>2*b.rows&&(f=2*b.rows);var g=this.lw,h=.45*this.bw,i=.45*this.bh,j=b.cols*this.cw-2*h,k=b.rows*this.ch-2*i;a.fillStyle="black",a.vid="chs1_",a.fillRect(h-(g-.5),i-(g-.5),g,k+2*g-2),a.vid="chs2_",a.fillRect(h+j-.5,i-(g-.5),g,k+2*g-2),a.vid="chs3_",a.fillRect(h-(g-.5),i-(g-.5),j+2*g-2,g),a.vid="chs4_",a.fillRect(h-(g-.5),i+k-.5,j+2*g-2,g)},drawBGCells:function(){for(var a=this.vinc("cell_back","crispEdges",!0),b=this.board,c=this.range.cells,d=0;d<c.length;d++){var e=c[d],f=this.getBGCellColor(e);if(a.vid="c_full_"+e.id,f){a.fillStyle=f;var g=(e.bx-(e.bx>b.minbx+1?1.5:.6))*this.bw-.5,h=(e.by-(e.by>b.minby+1?1.5:.6))*this.bw-.5,i=(e.bx+(e.bx<b.maxbx-1?1.5:.6))*this.bw+.5,j=(e.by+(e.by<b.maxby-1?1.5:.6))*this.bw+.5;a.fillRect(g,h,i-g,j-h)}else a.vhide()}}},"Encode@numlin":{decodePzpr:function(a){this.decodeNumber16()},encodePzpr:function(a){this.encodeNumber16()},decodeKanpen:function(){this.fio.decodeCellQnum_kanpen()},encodeKanpen:function(){this.fio.encodeCellQnum_kanpen()}},"Encode@arukone":{decodePzpr:function(a){this.decodeNumber16(),this.puzzle.setConfig("dontpassallcell",this.checkpflag("e"))},encodePzpr:function(a){this.encodeNumber16(),this.outpflag=this.puzzle.getConfig("dontpassallcell")?"e":null}},"FileIO@numlin":{decodeData:function(){this.decodeCellQnum(),this.decodeBorderLine()},encodeData:function(){this.encodeCellQnum(),this.encodeBorderLine()},kanpenOpen:function(){this.decodeCellQnum_kanpen(),this.decodeBorderLine()},kanpenSave:function(){this.encodeCellQnum_kanpen(),this.encodeBorderLine()},kanpenOpenXML:function(){this.decodeCellQnum_XMLBoard(),this.decodeBorderLine_XMLAnswer()},kanpenSaveXML:function(){this.encodeCellQnum_XMLBoard(),this.encodeBorderLine_XMLAnswer()},UNDECIDED_NUM_XML:-1},"FileIO@arukone":{decodeData:function(){this.decodeConfig(),this.decodeCellQnum_letter(),this.decodeBorderLine()},encodeData:function(){this.encodeConfig(),this.encodeCellQnum_letter(),this.encodeBorderLine()},decodeConfig:function(){var a=this.readLine();this.puzzle.setConfig("dontpassallcell","passallcell"!==a)},encodeConfig:function(){var a=this.puzzle.getConfig("dontpassallcell")?"dontpassallcell":"passallcell";this.writeLine(a)},decodeCellQnum_letter:function(){this.decodeCell(function(a,b){"-"===b?a.qnum=-2:b>="A"&&b<="Z"?a.qnum=parseInt(b,36)-9:b>="a"&&b<="z"&&(a.qnum=parseInt(b,36)-9+26)})},encodeCellQnum_letter:function(){this.encodeCell(function(a){var b=a.qnum;return b>0?b>0&&b<=26?(b+9).toString(36).toUpperCase()+" ":b>26&&b<=52?(b-17).toString(36).toLowerCase()+" ":void 0:-2===b?"- ":". "})}},AnsCheck:{checklist:["checkLineExist+","checkBranchLine","checkCrossLine","checkTripleObject","checkLinkSameNumber","checkLineOverLetter","checkDeadendConnectLine+","checkDisconnectLine","checkNoLineObject+","checkNoLine_arukone+@arukone"],checkLinkSameNumber:function(){this.checkSameObjectInRoom(this.board.linegraph,function(a){return a.qnum},"nmConnDiff")},checkNoLine_arukone:function(){this.puzzle.getConfig("dontpassallcell")||this.checkNoLine()}},FailCode:{nmConnDiff:["異なる数字がつながっています。","Different numbers are connected."]},"FailCode@arukone":{lcTripleNum:["3つ以上のアルファベットがつながっています。","Three or more alphabets are connected."],lcIsolate:["アルファベットにつながっていない線があります。","A line doesn't connect any alphabet."],lcOnNum:["アルファベットの上を線が通過しています。","A line goes through an alphabet."],nmConnDiff:["異なるアルファベットがつながっています。","Different alphabets are connected."],ceNoLine:["線が引かれていない交差点があります。","A crossing is left blank."]}});
//# sourceMappingURL=numlin.js.map