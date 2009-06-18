// testonly.js v3.1.9

	function testonly_func(){
		$("#float_other").append("<font color=white>&nbsp;���\����</font><br>\n")
						 .append("<div class=\"smenu_tmp\" id=\"perfeval\">&nbsp;�������莞��</div>\n")
						 .append("<div class=\"smenu_tmp\" id=\"painteval\">&nbsp;paintAll()����</div>\n")
						 .append("<div class=\"smenu_tmp\" id=\"resizeeval\">&nbsp;resize�`�掞��</div>\n");
		$("#perfeval").click(perfeval);
		$("#painteval").click(painteval);
		$("#resizeeval").click(resizeeval);

		$("div.smenu_tmp").each(function(){
			$(this).hover(menu.submenuhover.ebind(menu), menu.submenuout.ebind(menu));
			this.className = "smenu";
			$(this).css("font-size",'10pt');
		});
	}

	function perfeval(){
		timeeval(puz.check.bind(puz));
	}
	function painteval(){
		timeeval(pc.paintAll.bind(pc));
	}
	function resizeeval(){
		timeeval(base.resize_canvas.bind(base));
	}

	function timeeval(func){
		var count=0;
		var old = (new Date()).getTime();
		while((new Date()).getTime() - old < 3000){
			count++;

			func();
		}
		var time = (new Date()).getTime() - old;

		alert("���莞�� "+time+"ms\n"+"����� "+count+"��\n"+"���ώ��� "+(time/count)+"ms")
	}
