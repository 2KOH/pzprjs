/*! @license pzpr.js vf48a2f47 (c) 2009-2022 sabo2, MIT license
 *   https://github.com/sabo2/pzprv3 */

!function(a,b){"object"==typeof module&&module.exports?module.exports=[a,b]:pzpr.classmgr.makeCustom(a,b)}(["box"],{MouseEvent:{use:!0,inputModes:{edit:["number"],play:["shade","unshade"]},mouseinput_number:function(){this.mousestart&&this.inputqnum_excell()},mouseinput_auto:function(){this.puzzle.playmode?(this.mousestart||this.mousemove)&&this.inputcell():this.puzzle.editmode&&this.mousestart&&this.inputqnum_excell()},inputqnum_excell:function(){var a=this.getcell_excell();a.isnull||"excell"!==a.group||(a!==this.cursor.getex()?this.setcursor(a):this.inputqnum_main(a))}},KeyEvent:{enablemake:!0,moveTarget:function(a){var b=this.cursor,c=b.getex(),d=c.NDIR;switch(a){case"up":b.bx===b.minx&&b.miny<b.by&&(d=c.UP);break;case"down":b.bx===b.minx&&b.maxy>b.by&&(d=c.DN);break;case"left":b.by===b.miny&&b.minx<b.bx&&(d=c.LT);break;case"right":b.by===b.miny&&b.maxx>b.bx&&(d=c.RT)}return d!==c.NDIR&&(b.movedir(d,2),c.draw(),b.draw(),!0)},keyinput:function(a){this.key_inputexcell(a)},key_inputexcell:function(a){var b=this.cursor.getex(),c=b.qnum,d=b.getmaxnum();if("0"<=a&&a<="9"){var e=+a;c<=0||this.prev!==b?e<=d&&b.setQnum(e):10*c+e<=d?b.setQnum(10*c+e):e<=d&&b.setQnum(e)}else{if(" "!==a&&"-"!==a)return;b.setQnum(0)}this.prev=b,this.cursor.draw()}},TargetCursor:{initCursor:function(){this.init(-1,-1)}},ExCell:{qnum:0,disInputHatena:!0,maxnum:function(){var a=this.bx,b=this.by;if(-1===a&&-1===b)return 0;var c=-1===a?this.board.cols:this.board.rows;return c*(c+1)/2|0},minnum:0},Board:{cols:9,rows:9,hasexcell:1},BoardExec:{adjustBoardData:function(a,b){this.adjustExCellTopLeft_1(a,b)},adjustBoardData2:function(a,b){this.adjustExCellTopLeft_2(a,b)}},Graphic:{numbercolor_func:"qnum",qanscolor:"black",paint:function(){this.drawBGCells(),this.drawShadedCells(),this.drawDotCells(),this.drawGrid(),this.drawBGExCells(),this.drawNumbersExCell(),this.drawCircledNumbers_box(),this.drawChassis(),this.drawTarget()},getCanvasCols:function(){return this.getBoardCols()+2*this.margin+1},getCanvasRows:function(){return this.getBoardRows()+2*this.margin+1},getOffsetCols:function(){return.5},getOffsetRows:function(){return.5},drawCircledNumbers_box:function(){var a=[],b=this.board,c=this.range.x1,d=this.range.y1,e=this.range.x2,f=this.range.y2;if(e>=b.maxbx)for(var g=1|d,h=Math.min(b.maxby,f);g<=h;g+=2)a.push([b.maxbx+1,g]);if(f>=b.maxby)for(var i=1|c,h=Math.min(b.maxbx,e);i<=h;i+=2)a.push([i,b.maxby+1]);var j=this.vinc("excell_circle","auto",!0),k=.36*this.cw;j.fillStyle=this.circlebasecolor,j.strokeStyle=this.quescolor;for(var l=0;l<a.length;l++){var m=(a[l][0]!==b.maxbx+1?a[l][0]:a[l][1])+1>>1;j.vid=["ex2_cir_",a[l][0],a[l][1]].join("_"),m>0?j.shapeCircle(a[l][0]*this.bw,a[l][1]*this.bh,k):j.vhide()}var n={ratio:.65};j=this.vinc("excell_number2","auto"),j.fillStyle=this.quescolor;for(var l=0;l<a.length;l++){var m=(a[l][0]!==b.maxbx+1?a[l][0]:a[l][1])+1>>1;j.vid=["ex2_cirtext_",a[l][0],a[l][1]].join("_"),m>0?this.disptext(""+m,a[l][0]*this.bw,a[l][1]*this.bh,n):j.vhide()}}},Encode:{decodePzpr:function(a){this.decodeBox()},encodePzpr:function(a){this.encodeBox()},decodeBox:function(){for(var a=0,b=this.outbstr,c=this.board,d=0;d<b.length;d++){var e=b.charAt(d),f=c.excell[a];if("-"===e?(f.qnum=parseInt(b.substr(d+1,2),32),d+=2):f.qnum=parseInt(e,32),++a>=c.cols+c.rows){d++;break}}this.outbstr=b.substr(d)},encodeBox:function(){for(var a="",b=this.board,c=0,d=b.cols+b.rows;c<d;c++){var e=b.excell[c].qnum;a+=e<32?""+e.toString(32):"-"+e.toString(32)}this.outbstr+=a}},FileIO:{decodeData:function(){this.decodeCellExCell(function(a,b){"."!==b&&("excell"!==a.group||a.isnull?"cell"===a.group&&("#"===b?a.qans=1:"+"===b&&(a.qsub=1)):a.qnum=+b)})},encodeData:function(){this.encodeCellExCell(function(a){if("excell"===a.group&&!a.isnull)return a.qnum+" ";if("cell"===a.group){if(1===a.qans)return"# ";if(1===a.qsub)return"+ "}return". "})}},AnsCheck:{checklist:["checkShadeCellExist","checkShadeCells"],checkShadeCells:function(a){for(var b=this.board,c=0;c<b.excell.length;c++){var d,e=b.excell[c],f=e.qnum,g=e.getaddr(),h=0,i=new this.klass.CellList;if(-1===g.by)for(d=g.move(0,2).getc();!d.isnull;)1===d.qans&&(h+=g.by+1>>1),i.add(d),d=g.move(0,2).getc();else{if(-1!==g.bx)continue;for(d=g.move(2,0).getc();!d.isnull;)1===d.qans&&(h+=g.bx+1>>1),i.add(d),d=g.move(2,0).getc()}if(f!==h){if(this.failcode.add("nmSumRowShadeNe"),this.checkOnly)break;e.seterr(1),i.seterr(1)}}}},FailCode:{nmSumRowShadeNe:["数字と黒マスになった数字の合計が正しくありません。","A number is not equal to the sum of the number of shaded cells."]}});
//# sourceMappingURL=box.js.map