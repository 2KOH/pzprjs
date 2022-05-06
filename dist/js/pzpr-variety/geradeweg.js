/*! @license pzpr.js vf48a2f47 (c) 2009-2022 sabo2, MIT license
 *   https://github.com/sabo2/pzprv3 */

!function(a,b){"object"==typeof module&&module.exports?module.exports=[a,b]:pzpr.classmgr.makeCustom(a,b)}(["geradeweg"],{MouseEvent:{inputModes:{edit:["number","clear","info-line"],play:["line","peke","clear","info-line"]},mouseinput_auto:function(){if(this.puzzle.playmode){if(this.mousestart||this.mousemove)"left"===this.btn?this.inputLine():"right"===this.btn&&this.inputpeke();else if(this.mouseend&&this.notInputted()&&this.inputpeke_ifborder())return}else this.puzzle.editmode&&this.mousestart&&this.inputqnum()}},KeyEvent:{enablemake:!0},Cell:{maxnum:function(){var a=this.board;return Math.max(a.cols-1,a.rows-1)},getSegment:function(a){var b,c=new this.klass.PieceList;if(a){for(b=this;b.adjborder.right.isLine();b=b.adjacent.right)c.add(b.adjborder.right);for(b=this;b.adjborder.left.isLine();b=b.adjacent.left)c.add(b.adjborder.left)}else{for(b=this;b.adjborder.top.isLine();b=b.adjacent.top)c.add(b.adjborder.top);for(b=this;b.adjborder.bottom.isLine();b=b.adjacent.bottom)c.add(b.adjborder.bottom)}return c}},Board:{hasborder:1},LineGraph:{enabled:!0},Graphic:{irowake:!0,numbercolor_func:"qnum",gridcolor_type:"SLIGHT",circleratio:[.4,.35],getCircleFillColor:function(a){return-1!==a.qnum?"rgba(255,255,255,0.5)":null},minYdeg:.36,maxYdeg:.74,paint:function(){this.drawBGCells(),this.drawGrid(),this.drawLines(),this.drawCircledNumbers(),this.drawPekes(),this.drawChassis(),this.drawTarget()}},Encode:{decodePzpr:function(a){this.decodeNumber16()},encodePzpr:function(a){this.encodeNumber16()}},FileIO:{decodeData:function(){this.decodeCellQnum(),this.decodeBorderLine()},encodeData:function(){this.encodeCellQnum(),this.encodeBorderLine()}},AnsCheck:{checklist:["checkBranchLine","checkCrossLine","checkShortSegment","checkLongSegment","checkDiffSegment","checkNoLineNumber","checkDeadendLine+","checkOneLoop"],checkShortSegment:function(){for(var a=!0,b=this.board,c=0;c<b.cell.length;c++){var d=b.cell[c];if(d.isNum()&&!(d.qnum<1)){var e=d.getSegment(!0),f=d.getSegment(!1);if(e.length>0&&e.length<d.qnum){if(a=!1,this.checkOnly)break;d.seterr(1),e.seterr(1)}if(f.length>0&&f.length<d.qnum){if(a=!1,this.checkOnly)break;d.seterr(1),f.seterr(1)}}}a||(this.failcode.add("segShort"),b.border.setnoerr())},checkLongSegment:function(){for(var a=!0,b=this.board,c=0;c<b.cell.length;c++){var d=b.cell[c];if(d.isNum()&&!(d.qnum<1)){var e=d.getSegment(!0),f=d.getSegment(!1);if(e.length>d.qnum){if(a=!1,this.checkOnly)break;d.seterr(1),e.seterr(1)}if(f.length>d.qnum){if(a=!1,this.checkOnly)break;d.seterr(1),f.seterr(1)}}}a||(this.failcode.add("segLong"),b.border.setnoerr())},checkDiffSegment:function(){for(var a=!0,b=this.board,c=0;c<b.cell.length;c++){var d=b.cell[c];if(d.isNum()&&!(d.qnum>=1)){var e=d.getSegment(!0),f=d.getSegment(!1);if(e.length>0&&f.length>0&&e.length!==f.length){if(a=!1,this.checkOnly)break;d.seterr(1),e.seterr(1),f.seterr(1)}}}a||(this.failcode.add("segDiff"),b.border.setnoerr())},checkNoLineNumber:function(){this.checkAllCell(function(a){return a.isNum()&&0===a.lcnt},"numNoLine")}},FailCode:{segShort:["線の長さが数字より短いです。","A segment is shorter than a number."],segLong:["線の長さが数字より長いです。","A segment is longer than a number."],segDiff:["(please translate) Segments have different length.","Segments have different length."],numNoLine:["線の通っていない数字があります。","A number has no line."]}});
//# sourceMappingURL=geradeweg.js.map