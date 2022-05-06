/*! @license pzpr.js vf48a2f47 (c) 2009-2022 sabo2, MIT license
 *   https://github.com/sabo2/pzprv3 */

!function(a,b){"object"==typeof module&&module.exports?module.exports=[a,b]:pzpr.classmgr.makeCustom(a,b)}(["ichimaga","ichimagam","ichimagax"],{MouseEvent:{inputModes:{edit:["number","clear"],play:["line","peke"]},mouseinput_auto:function(){this.puzzle.playmode?"left"===this.btn?this.mousestart||this.mousemove?this.inputLine():this.mouseend&&this.notInputted()&&this.inputpeke():"right"===this.btn&&(this.mousestart||this.mousemove)&&this.inputpeke():this.puzzle.editmode&&this.mousestart&&this.inputqnum()}},KeyEvent:{enablemake:!0},Cell:{maxnum:4},Board:{hasborder:1},LineGraph:{enabled:!0,isLineCross:!0,makeClist:!0,iscrossing:function(a){return a.noNum()}},Graphic:{hideHatena:!0,irowake:!0,gridcolor_type:"LIGHT",numbercolor_func:"fixed",paint:function(){this.drawBGCells(),this.drawDashedCenterLines(),this.drawLines(),this.drawPekes(),this.drawCircledNumbers(),this.drawTarget()},repaintParts:function(a){this.range.cells=a.cellinside(),this.drawCircledNumbers()}},Encode:{decodePzpr:function(a){this.decode4Cell()},encodePzpr:function(a){this.encode4Cell()}},FileIO:{decodeData:function(){this.readLine(),this.decodeCellQnum(),this.decodeBorderLine()},encodeData:function(){var a="def";"ichimagam"===this.pid?a="mag":"ichimagax"===this.pid&&(a="cross"),this.writeLine(a),this.encodeCellQnum(),this.encodeBorderLine()}},AnsCheck:{checklist:["checkLineExist+","checkBranchConnectLine","checkCrossConnectLine@!ichimagax","checkConnectSameNum@ichimagam","checkCurveCount","checkConnectAllNumber","checkLineShapeDeadend","checkOutgoingLine","checkNoLineObject"],checkOutgoingLine:function(){this.checkAllCell(function(a){return a.isValidNum()&&a.qnum!==a.lcnt},"nmLineNe")},checkConnectSameNum:function(){this.checkLineShape(function(a){return-2!==a.cells[0].qnum&&a.cells[0].qnum===a.cells[1].qnum},"lcSameNum")},checkCurveCount:function(){this.checkLineShape(function(a){return!a.cells[1].isnull&&a.ccnt>1},"lcCurveGt1")}},FailCode:{nmNoLine:["○から線が出ていません。","A circle doesn't start any line."],nmLineNe:["○から出る線の本数が正しくありません。","The number is not equal to the number of lines out of the circle."],lcSameNum:["同じ数字同士が線で繋がっています。","Same numbers are connected each other."],lcCurveGt1:["線が2回以上曲がっています。","The number of curves is twice or more."]}});
//# sourceMappingURL=ichimaga.js.map