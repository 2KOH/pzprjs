/*! @license pzpr.js vf48a2f47 (c) 2009-2022 sabo2, MIT license
 *   https://github.com/sabo2/pzprv3 */

!function(a,b){"object"==typeof module&&module.exports?module.exports=[a,b]:pzpr.classmgr.makeCustom(a,b)}(["tentaisho"],{MouseEvent:{inputModes:{edit:["circle-unshade","circle-shade","bgpaint","empty"],play:["border","subline"]},mouseinput_other:function(){"bgpaint"===this.inputMode&&this.inputBGcolor1(),"empty"===this.inputMode&&this.inputEmpty()},mouseinput_auto:function(){this.puzzle.playmode?this.mousestart||this.mousemove?"left"===this.btn&&this.isBorderMode()?this.inputborder_tentaisho():this.inputQsubLine():this.mouseend&&this.notInputted()&&this.inputBGcolor3():this.puzzle.editmode&&(this.mousestart&&"left"===this.btn?this.inputdot():(this.mousestart||this.mousemove)&&"right"===this.btn&&this.inputBGcolor1())},inputBGcolor1:function(){var a=this.getcell();a.isnull||a===this.mouseCell||(null===this.inputData&&(this.inputData=0===a.qsub?3:0),a.setQsub(this.inputData),this.mouseCell=a,a.draw())},inputBGcolor3:function(){if(this.puzzle.playeronly||!this.puzzle.getConfig("discolor")){var a=this.getpos(.34),b=a.getDot();if(null!==b&&0!==b.getDot()){var c=b.validcell();if(null!==c){var d=c.room.clist;d.encolor()&&d.draw()}}}},inputborder_tentaisho:function(){var a=this.getpos(.34);if(!this.prevPos.equals(a)){var b=this.prevPos.getborderobj(a);b.isnull||(null===this.inputData&&(this.inputData=0===b.qans?1:0),b.setQans(this.inputData),b.draw()),this.prevPos=a}},inputFixedNumber:function(){this.inputdot()},inputdot:function(){var a=this.getpos(.25);if(!this.prevPos.equals(a)){var b=a.getDot();if(null!==b){if("circle-unshade"===this.inputMode)b.setDot(1!==b.getDot()?1:0);else if("circle-shade"===this.inputMode)b.setDot(2!==b.getDot()?2:0);else if("left"===this.btn)b.setDot({0:1,1:2,2:0}[b.getDot()]);else{if("right"!==this.btn)return void(this.prevPos=a);b.setDot({0:2,1:0,2:1}[b.getDot()])}b.draw()}this.prevPos=a}},inputEmpty:function(){var a=this.getcell();a.isnull||a===this.mouseCell||(null===this.inputData&&(this.inputData=a.isEmpty()?0:7),a.setValid(this.inputData),this.mouseCell=a)}},KeyEvent:{enablemake:!0,moveTarget:function(a){return this.moveTBorder(a)},keyinput:function(a){this.key_inputdot(a)},key_inputdot:function(a){var b=this.cursor.getDot();if(null!==b){if("1"===a)b.setDot(1);else if("2"===a)b.setDot(2);else{if(" "!==a&&"-"!==a&&"0"!==a&&"3"!==a)return;b.setDot(0)}b.draw()}}},Cell:{qnum:0,minnum:0,disInputHatena:!0,isEmpty:function(){return 7===this.ques},setValid:function(a){this.setQues(a),this.qnum=0;for(var b=[this.adjborder.top,this.adjborder.bottom,this.adjborder.right,this.adjborder.left],c=0;c<b.length;c++){var d=b[c];d.inside&&(d.qnum=0,d.sidecross[0].qnum=0,d.sidecross[1].qnum=0,d.qans=0)}this.drawaround(),this.board.roommgr.rebuild()}},Cross:{qnum:0,minnum:0},Border:{qnum:0,minnum:0,isGrid:function(){return this.sidecell[0].isValid()&&this.sidecell[1].isValid()},isBorder:function(){return this.qans>0||this.isQuesBorder()},isQuesBorder:function(){return!!(this.sidecell[0].isEmpty()^this.sidecell[1].isEmpty())},isBlack:function(){return this.sidecell[0].isEmpty()||this.sidecell[1].isEmpty()},prehook:{qans:function(){return!this.isGrid()},qsub:function(){return!this.isGrid()}}},Dot:{setDot:function(a){this.puzzle.opemgr.disCombine=!0,this.piece.setQnum(a),this.puzzle.opemgr.disCombine=!1,this.puzzle.board.roommgr.setExtraData(this.validcell().room)},validcell:function(){var a=this.piece,b=null;return"cell"===a.group?b=a:"cross"===a.group&&0===a.lcnt?b=a.relcell(-1,-1):"border"===a.group&&0===a.qans&&(b=a.sidecell[0]),b}},CellList:{encolor:function(){for(var a=this.getAreaDotInfo().dot,b=!1,c=null!==a?a.getDot():0,d=0;d<this.length;d++){var e=this[d];(this.puzzle.playeronly||3!==e.qsub||2===c)&&(e.qsub!==(c>0?c:0)&&(e.setQsub(c>0?c:0),b=!0))}return b},getAreaDotInfo:function(){for(var a={dot:null,err:-1},b=0;b<this.length;b++)for(var c=this[b],d=this.board.dotinside(c.bx,c.by,c.bx+1,c.by+1),e=0;e<d.length;e++){var f=d[e];if(f.getDot()>0&&null!==f.validcell()){if(0===a.err)return{dot:null,err:-2};a={dot:f,err:0}}}return a},subclear:function(){var a=[],b={};this.length>0&&(a=this[0].getproplist(["sub","info"]),b=this[0].propnorec);for(var c=0;c<this.length;c++)for(var d=this[c],e=0;e<a.length;e++){var f=a[e],g=d.constructor.prototype[f];d[f]===g||"qsub"===f&&3===d.qsub||(b[f]||d.addOpe(f,d[f],g),d[f]=g)}}},Board:{hascross:1,hasborder:1,hasdots:1,encolorall:function(){for(var a=this.board.roommgr.components,b=0;b<a.length;b++)a[b].clist.encolor();this.puzzle.redraw()}},AreaRoomGraph:{enabled:!0,setExtraData:function(a){a.clist=new this.klass.CellList(a.getnodeobjs());var b=a.clist.getAreaDotInfo();a.dot=b.dot,a.error=b.err}},Graphic:{gridcolor_type:"LIGHT",qsubcolor1:"rgb(176,255,176)",qsubcolor2:"rgb(108,108,108)",qanscolor:"rgb(72, 72, 72)",getQuesBorderColor:function(a){return a.isBlack()?this.quescolor:null},getBGCellColor:function(a){return 7===a.ques?"black":this.getBGCellColor_qsub3(a)},paint:function(){this.drawBGCells(),this.drawDashedGrid(),this.drawQansBorders(),this.drawQuesBorders(),this.drawBorderQsubs(),this.drawDots(),this.drawChassis(),this.drawTarget_tentaisho()},getDotRadius:function(a){return 1===a.getDot()?.16:.18},drawTarget_tentaisho:function(){this.drawCursor(!1,this.puzzle.editmode)}},Encode:{decodePzpr:function(a){this.decodeDot(),this.decodeEmpty()},encodePzpr:function(a){this.encodeDot(),this.encodeEmpty()},decodeKanpen:function(){this.fio.decodeStarFile()}},FileIO:{decodeData:function(){this.decodeDotFile(),this.decodeBorderAns(),this.decodeCellQsub()},encodeData:function(){this.encodeDotFile(),this.encodeBorderAns(),this.encodeCellQsub()},kanpenOpen:function(){this.decodeDotFile(),this.decodeAnsAreaRoom()},decodeAnsAreaRoom:function(){this.decodeAreaRoom_com(!1)},encodeAnsAreaRoom:function(){this.encodeAreaRoom_com(!1)},kanpenOpenXML:function(){this.decodeStar_XMLBoard(),this.decodeAnsAreaRoom_XMLAnswer()},decodeStar_XMLBoard:function(){for(var a=this.xmldoc.querySelectorAll("board number"),b=0;b<a.length;b++){var c=a[b],d=this.board.getDot(+c.getAttribute("c"),+c.getAttribute("r"));null!==d&&d.setDot(+c.getAttribute("n"))}},decodeAnsAreaRoom_XMLAnswer:function(){var a=[];this.decodeCellXMLArow(function(b,c){"u"===c?a.push(-1):a.push(+c.substr(1))}),this.rdata2Border(!1,a),this.board.roommgr.rebuild()}},AnsCheck:{checklist:["checkStarOnLine","checkAvoidStar","checkFractal","checkStarRegion"],checkStarOnLine:function(){for(var a=this.board,b=0;b<a.dotsmax;b++){var c=a.dots[b];if(!(c.getDot()<=0||null!==c.validcell())){if(this.failcode.add("bdPassStar"),this.checkOnly)break;switch(c.piece.group){case"cross":c.piece.setCrossBorderError();break;case"border":c.piece.seterr(1)}}}},checkFractal:function(){var a=this.board.roommgr.components;a:for(var b=0;b<a.length;b++){var c=a[b].clist,d=a[b].dot;if(null!==d)for(var e=0;e<c.length;e++){var f=c[e],g=this.board.getc(2*d.bx-f.bx,2*d.by-f.by);if(g.isnull||f.room!==g.room){if(this.failcode.add("bkNotSymSt"),this.checkOnly)break a;c.seterr(1)}}}},checkAvoidStar:function(){this.checkErrorFlag(-1,"bkNoStar")},checkStarRegion:function(){this.checkErrorFlag(-2,"bkPlStar")},checkErrorFlag:function(a,b){for(var c=this.board.roommgr.components,d=0;d<c.length;d++)if(c[d].error===a){if(this.failcode.add(b),this.checkOnly)break;c[d].clist.seterr(1)}}},FailCode:{bkNoStar:["星が含まれていない領域があります。","An area has no stars."],bdPassStar:["星を線が通過しています。","A line goes over a star."],bkNotSymSt:["領域が星を中心に点対称になっていません。","An area is not point symmetric about the star."],bkPlStar:["星が複数含まれる領域があります。","A block has two or more stars."]}});
//# sourceMappingURL=tentaisho.js.map