/*! @license pzpr.js vf48a2f47 (c) 2009-2022 sabo2, MIT license
 *   https://github.com/sabo2/pzprv3 */

!function(a,b){"object"==typeof module&&module.exports?module.exports=[a,b]:pzpr.classmgr.makeCustom(a,b)}(["pencils"],{MouseEvent:{inputModes:{edit:["arrow","number","undef","clear"],play:["border","line","arrow","peke","bgcolor","bgcolor1","bgcolor2"]},mouseinput_number:function(){this.mousestart&&this.inputqnum()},mouseinput:function(){"undef"===this.inputMode?this.mousestart&&this.inputqnum():this.common.mouseinput.call(this)},mouseinput_auto:function(){this.mousestart&&this.isBorderMode(),this.puzzle.playmode?this.mousestart||this.mousemove?"left"===this.btn?this.isBorderMode()?this.inputborder():this.inputLineOrArrow():this.inputpeke():this.mouseend&&this.notInputted()&&(this.isBorderMode()?this.inputArrow():this.inputBGcolor()):this.puzzle.editmode&&this.mouseend&&(this.isBorderMode()?this.inputArrow():this.inputqnum_pencils())},inputArrow:function(){var a=this.getpos(.22),b=a.getb();if(b.inside){var c=b.sidecell[0],d=b.sidecell[1],e=-1!==c.qnum&&this.puzzle.playmode,f=b.getArrow(),g=0,h=0;if(b.isvert)switch(f){case 0:if(!e){g=c.LT,h=0;break}case c.LT:g=0,h=c.RT;break;default:g=0,h=0}else switch(f){case 0:if(!e){g=c.UP,h=0;break}case c.UP:g=0,h=c.DN;break;default:g=0,h=0}c.setArrow(g,this.puzzle.editmode),d.setArrow(h,this.puzzle.editmode),c.draw(),d.draw(),b.draw()}},inputLineOrArrow:function(){var a,b;if(a=this.getpos(0),!this.prevPos.equals(a)){b=this.prevPos.getnb(a);var c=b.sidecell[0],d=b.sidecell[1];if(!b.isnull){if(null===this.inputData&&(!b.isvert||c.anum!==b.LT&&d.anum!==b.RT||(c.anum===b.LT&&c.setAnum(-1),d.anum===b.RT&&d.setAnum(-1),this.inputData=0),b.isvert||c.anum!==b.UP&&d.anum!==b.DN||(c.anum===b.UP&&c.setAnum(-1),d.anum===b.DN&&d.setAnum(-1),this.inputData=0)),null===this.inputData&&(this.inputData=b.isLine()?0:1),1!==this.inputData||b.ques)0===this.inputData&&b.removeLine();else if(1===b.qans){var e=this.getDrawArrowDirection(b);e>0?d.setArrow(b.isvert?b.RT:b.DN,!1):c.setArrow(b.isvert?b.LT:b.UP,!1)}else b.setLine();b.draw()}this.prevPos=a}},getDrawArrowDirection:function(a){if(a.sidecell[0].isnull)return 1;if(a.sidecell[1].isnull)return-1;if(a.sidecell[0].qnum>0)return 1;if(a.sidecell[1].qnum>0)return-1;if(a.sidecell[1].lcnt>0&&0===a.sidecell[0].lcnt)return 1;if(a.sidecell[0].lcnt>0&&0===a.sidecell[1].lcnt)return-1;if(a.sidecell[0].room.pencil)return 1;if(a.sidecell[1].room.pencil)return-1;var b=this.getpos(0),c=this.prevPos.getdir(b,2);return c===a.RT||c===a.DN?1:-1},mouseinput_clear:function(){var a=this.getcell();a.getPencilDir()?a.setArrow(0,!0):this.inputclean_cell()},inputarrow_cell_main:function(a,b){a.setArrow(b,this.puzzle.editmode)},inputqnum_pencils:function(){var a=this.getcell();a.isnull||(a!==this.cursor.getc()&&"auto"===this.inputMode?this.setcursor(a):this.inputqnum(a))}},KeyEvent:{enablemake:!0,moveTarget:function(a){return!a.match(/shift/)&&this.moveTCell(a)},keyinput:function(a){var b=this.cursor.getc();if(!b.isnull){var c=0;switch(a){case"shift+up":c=b.UP;break;case"shift+down":c=b.DN;break;case"shift+left":c=b.LT;break;case"shift+right":c=b.RT}0!==c?(b.setArrow(c,!0),this.cursor.draw()):this.key_inputqnum_pencils(a)}},key_inputqnum_pencils:function(a){var b=this.cursor.getc();"q"===a||"-"===a?-2!==b.qnum?(b.setArrow(0,!0),b.setQnum(-2)):(b.setArrow(0,!0),b.setQnum(-1)):" "===a||"BS"===a?(b.setArrow(0,!0),b.setQnum(-1)):(this.key_inputqnum_main(b,a),b.isNum()&&b.setArrow(0,!0)),this.prev=b,b.draw()}},Cell:{maxnum:function(){var a=this.board;return Math.max(a.cols,a.rows)-1},minnum:1,setArrow:function(a,b){if(a>=0&&a<=4){var c={};c[this.UP]={inv:this.DN,border:this.adjborder.bottom,cell:this.adjacent.bottom},c[this.DN]={inv:this.UP,border:this.adjborder.top,cell:this.adjacent.top},c[this.LT]={inv:this.RT,border:this.adjborder.right,cell:this.adjacent.right},c[this.RT]={inv:this.LT,border:this.adjborder.left,cell:this.adjacent.left};var d=this.anum,e=this.qdir;this.setAnum(-1),d>0&&c[d].cell.anum!==c[d].inv&&c[d].border.setQans(0),b?(e>=1&&e<=4&&c[e].cell.qdir!==c[e].inv&&c[e].border.setQues(0),e===a&&(a=0),a&&this.setQnum(-1),a>0&&!c[a].border.isnull&&c[a].border.setQues(1),this.setQdir(a)):e>=1&&e<=4||-1!==this.qnum||(d!==a&&0!==a||(a=-1),a>0&&!c[a].border.isnull&&c[a].border.setQans(1),this.setAnum(a))}},getPencilDir:function(){var a=this.qdir;if(a>=1&&a<=4)return a;var b=this.anum;return b>=1&&b<=4?b:0},isStart:function(a){var b=this.room.clist.getRectSize();if(b.cols>1&&b.rows>1)return!1;switch(a){case this.LT:return 1===b.rows&&this.bx===b.x1&&this.by===b.y1;case this.RT:return 1===b.rows&&this.bx===b.x2&&this.by===b.y1;case this.UP:return 1===b.cols&&this.bx===b.x1&&this.by===b.y1;case this.DN:return 1===b.cols&&this.bx===b.x1&&this.by===b.y2}return!1},getPencilStart:function(){var a=this.getPencilDir();return a===this.UP?this.adjacent.bottom:a===this.DN?this.adjacent.top:a===this.LT?this.adjacent.right:a===this.RT?this.adjacent.left:this.board.emptycell},isTip:function(){return this.getPencilDir()>0},isTipOfPencil:function(){var a=this.getPencilDir(),b=this.getPencilStart();return!b.isnull&&b.isStart(a)},getPencilSize:function(){return this.isTipOfPencil()?this.getPencilStart().room.clist.length:0},insidePencil:function(){return this.room.isPencil()}},GraphComponent:{getPotentialTips:function(){var a=this.clist.getRectSize();if(a.cols>1&&a.rows>1)return[];var b=[];if(1===a.rows){var c=this.board.getc(a.x1,a.y1);b.push({dir:c.LT,start:c,tip:c.adjacent.left});var d=this.board.getc(a.x2,a.y1);b.push({dir:d.RT,start:d,tip:d.adjacent.right})}if(1===a.cols){var e=this.board.getc(a.x1,a.y1);b.push({dir:e.UP,start:e,tip:e.adjacent.top});var f=this.board.getc(a.x1,a.y2);b.push({dir:f.DN,start:f,tip:f.adjacent.bottom})}return b},getTips:function(){for(var a=this.getPotentialTips(),b=[],c=0;c<a.length;c++){var d=a[c];d.tip.getPencilDir()===d.dir&&b.push(d.tip)}return b},isPencil:function(){return this.getTips().length>0},seterr:function(a){this.clist.each(function(b){a>b.error&&(b.error=a)})}},Board:{cols:8,rows:8,hasborder:1},Border:{getArrow:function(){var a=this.sidecell[0],b=this.sidecell[1];if(this.isvert){if(a.getPencilDir()===a.LT)return a.LT;if(b.getPencilDir()===b.RT)return b.RT}else{if(a.getPencilDir()===a.UP)return a.UP;if(b.getPencilDir()===b.DN)return b.DN}return 0},prehook:{qans:function(a){return 0!==this.ques||!a&&0!==this.getArrow()}}},BoardExec:{adjustBoardData:function(a,b){for(var c=this.getTranslateDir(a),d=this.board.cellinside(b.x1,b.y1,b.x2,b.y2),e=0;e<d.length;e++){var f=d[e],g=c[f.qdir];g&&f.setQdir(g);var g=c[f.anum];g&&f.setAnum(g)}}},AreaRoomGraph:{enabled:!0},LineGraph:{enabled:!0,makeClist:!0},Graphic:{gridcolor_type:"DLIGHT",linecolor:"rgb(80, 80, 80)",paint:function(){this.drawBGCells(),this.drawDashedGrid(),this.drawBorders(),this.drawLines(),this.drawCellArrows(),this.drawQuesNumbers(),this.drawPekes(),this.drawChassis(),this.drawTarget()},getQuesNumberColor:function(a){return 2===a.error?this.errcolor1:1===a.error?this.quescolor:this.getQuesNumberColor_qnum(a)},getBGCellColor:function(a){return 2===a.error?this.errbcolor1:this.getBGCellColor_qsub2(a)},getBorderColor:function(a){return 1===a.ques?this.quescolor:1===a.qans?a.error?"red":a.trial?this.trialcolor:this.qanscolor:null},drawCellArrows:function(){for(var a=this.vinc("cell_arrow","crispEdges"),b=.5*this.cw,c=.25*this.cw,d=this.range.cells,e=0;e<d.length;e++){var f=d[e],g=f.getPencilDir(),h=this.getCellArrowColor(f);if(a.lineWidth=(this.lw+this.addlw)/2,h){a.fillStyle=h,a.strokeStyle=h;var i=f.bx*this.bw,j=f.by*this.bh,k=[0,0,0,0];switch(g){case f.UP:k=[1,1,-1,1];break;case f.DN:k=[1,-1,-1,-1];break;case f.LT:k=[1,-1,1,1];break;case f.RT:k=[-1,-1,-1,1]}a.vid="c_arrow_"+f.id,a.setOffsetLinePath(i,j,0,0,k[0]*c,k[1]*c,k[2]*c,k[3]*c,!0),a.fill(),a.vid="c_arrow_outer_"+f.id,a.setOffsetLinePath(i,j,0,0,k[0]*b,k[1]*b,k[2]*b,k[3]*b,!0),a.stroke()}else a.vid="c_arrow_"+f.id,a.vhide(),a.vid="c_arrow_outer_"+f.id,a.vhide()}},getCellArrowColor:function(a){return a.getPencilDir()?a.qdir?this.quescolor:a.trial?this.trialcolor:this.qanscolor:null}},Encode:{decodePzpr:function(a){var b=0,c=0,d=this.outbstr,e=this.board;for(c=0;c<d.length;c++){var f=d.charAt(c),g=e.cell[b];if(this.include(f,"0","9")||this.include(f,"a","f")?g.qnum=parseInt(f,16):"-"===f?(g.qnum=parseInt(d.substr(c+1,2),16),c+=2):"."===f?g.qnum=-2:f>="g"&&f<="j"?g.setArrow(parseInt(f,20)-15,!0):f>="k"&&f<="z"&&(b+=parseInt(f,36)-20),b++,!e.cell[b])break}this.outbstr=d.substr(c+1)},encodePzpr:function(a){for(var b="",c=0,d=this.board,e=0;e<d.cell.length;e++){var f="",g=d.cell[e].qdir,h=d.cell[e].qnum;-1!==h?f=h>=0&&h<16?h.toString(16):h>=16&&h<256?"-"+h.toString(16):".":0!==g?f=(g+15).toString(20):c++,0===c?b+=f:(f||16===c)&&(b+=(c+19).toString(36)+f,c=0)}c>0&&(b+=(c+19).toString(36)),this.outbstr+=b}},FileIO:{decodeData:function(){this.decodeCell(function(a,b){"o"===b.charAt(0)?(a.qdir=5,b.length>1&&(a.qnum=+b.substr(1))):"."!==b&&a.setArrow(+b,!0)}),this.decodeBorderAns(),this.decodeBorderLine(),this.decodeCell(function(a,b){"+"===b.charAt(0)?(a.qsub=1,b=b.substr(1)):"-"===b.charAt(0)&&(a.qsub=2,b=b.substr(1)),"."!==b&&+b<=4&&(a.anum=+b)})},encodeData:function(){this.encodeCell(function(a){return-1!==a.qnum?"o"+(-1!==a.qnum?a.qnum:"")+" ":0!==a.qdir?a.qdir+" ":". "}),this.encodeBorderAns(),this.encodeBorderLine(),this.encodeCell(function(a){var b="";return 1===a.qsub?b+="+":2===a.qsub&&(b+="-"),-1!==a.anum&&(b+=a.anum.toString()),""===b&&(b="."),b+" "})}},AnsCheck:{checklist:["checkBranchLine","checkCrossLine","checkOneTip","checkLineSingleTip","checkLineTooLong","checkNumberTooHigh","checkTipNotInsidePencil","checkLineOutsidePencil","checkNumberInPencil","checkTipHasLine","checkLineHasTip","checkNumberTooLow","checkLineTooShort","checkTipHasPencil","checkCellsUsed"],checkTipHasPencil:function(){this.checkAllCell(function(a){return a.isTip()&&!a.isTipOfPencil()},"ptNoPencil")},checkTipNotInsidePencil:function(){this.checkAllCell(function(a){return a.isTip()&&a.insidePencil()},"ptInPencil")},checkOneTip:function(){for(var a=this.board.roommgr.components,b=0;b<a.length;b++){var c=a[b].getTips();if(c.length>1){if(this.failcode.add("pcMultipleTips"),this.checkOnly)return;c.forEach(function(a){a.seterr(1)}),a[b].clist.seterr(1)}}},checkNumberTooLow:function(){this.pencils_checkPencilSize(-1,"nmSizeLt")},checkNumberTooHigh:function(){this.pencils_checkPencilSize(1,"nmSizeGt")},pencils_checkPencilSize:function(a,b){for(var c=this.board.roommgr.components,d=0;d<c.length;d++){var e=c[d];if(e.isPencil())for(var f=e.clist.length,g=0;g<e.clist.length;g++){var h=e.clist[g],i=h.qnum;if(i>0&&(a<0&&i<f||a>0&&i>f)){if(this.failcode.add(b),this.checkOnly)return;h.seterr(2),e.seterr(1)}}}},checkNumberInPencil:function(){this.checkAllCell(function(a){return(-2===a.qnum||a.qnum>0)&&!a.insidePencil()},"nmOutsidePencil")},checkLineOutsidePencil:function(){this.checkAllCell(function(a){return a.lcnt>0&&a.insidePencil()},"lnCrossPencil")},checkTipHasLine:function(){this.checkAllCell(function(a){return a.isTip()&&1!==a.lcnt},"ptNoLine")},pencils_checkLines:function(a,b){for(var c=this.board.linegraph.components,d=0;d<c.length;d++){var e=c[d],f=e.clist.filter(function(a){return a.isTip()&&1===a.lcnt});if(a(f)){if(this.failcode.add(b),this.checkOnly)return;f.each(function(a){a.seterr(1)}),e.setedgeerr(1)}}},checkLineHasTip:function(){this.pencils_checkLines(function(a){return a.length<1},"lnNoTip")},checkLineSingleTip:function(){this.pencils_checkLines(function(a){return a.length>1},"lnMultipleTips")},checkLineTooShort:function(){this.pencils_checkLineLength(-1,"lnLengthLt")},checkLineTooLong:function(){this.pencils_checkLineLength(1,"lnLengthGt")},pencils_checkLineLength:function(a,b){for(var c=this.board.cell,d=0;d<c.length;d++){var e=c[d];if(e.isTip()&&1===e.lcnt){var f=e.path.nodes.length-1,g=e.getPencilSize();if(g>0&&(a<0&&f<g||a>0&&f>g)){if(this.failcode.add(b),this.checkOnly)return;e.getPencilStart().room.seterr(1),e.path.setedgeerr(1)}}}},checkCellsUsed:function(){this.checkAllCell(function(a){return 0===a.lcnt&&!a.insidePencil()},"unusedCell")}},FailCode:{ptNoPencil:["幅が1の長方形の軸の先端に位置していない芯があります。","A tip is not at the short end of a 1xN rectangle."],ptInPencil:["芯が他の鉛筆の軸に入り込んでいます。","A tip is inside a pencil."],pcMultipleTips:["2つ以上の芯を持つ鉛筆があります。","A pencil has more than one tip."],nmSizeLt:["中の数字よりも長い軸があります。","A number is smaller than the length of the pencil."],nmSizeGt:["中の数字よりも短い軸があります。","A number is larger than the length of the pencil."],nmOutsidePencil:["軸の中に入っていない数字があります。","A number is not inside a pencil."],lnCrossPencil:["線が鉛筆の軸と交差しています。","A line crosses a pencil."],ptNoLine:["線が繋がっていない芯があります。","A pencil tip is not connected to a line."],lnNoTip:["芯に繋がっていない線があります。","A line is not connected to a pencil tip."],lnMultipleTips:["2つ以上の芯に繋がっている線があります。","A line connects to more than one pencil tip."],lnLengthLt:["鉛筆から引かれた線が軸よりも短くなっているところがあります。","A line is shorter than the connected pencil."],lnLengthGt:["鉛筆から引かれた線が軸よりも長くなっているところがあります。","A line is longer than the connected pencil."],unusedCell:["何も書かれていないマスがあります。","A cell is unused."]}});
//# sourceMappingURL=pencils.js.map