require('util/paging/page.scss');
require('util/paging/page.js');

$(function(){
	$(".detail_tab li a").on("click",function(){
		$(".detail_con>div").hide();
		var txt = $(this).html();
		if(txt == "项目详情"){
			$(".details").show();
		}else if(txt == "审核资料"){
			$(".audit").show();
		}else if(txt == "安全保障"){
			$(".safety").show();
		}else if(txt == "常见问题"){
			$(".issue").show();
		}else if(txt.indexOf("加入记录") != -1){
			$(".con_record").show();
		}
		$(this).addClass("on");
		$(this).parent().siblings().find('a').removeClass('on');
	});
	var list = $(".chage_tr tr");
	for (var i = 0; i < list.length; i++) {
		if(i%2!=1){
			list[i].className = 'li_color';
		}
	};
	// input输入状态
	$(".investting input").focus(function(){
		$(this).parent().addClass("com_sty");

	});
	$(".investting input").blur(function(){
		$(this).parent().removeClass("com_sty");
	});

	// 优惠券点击
	$(".add_ticket").on("click",function(){
		var val = $(".inp_ticket").val();
		var sel = '<b class="select_b"></b>';
		if($(".sub_money").val() == ""){
			input_mess("选择优惠券前需要填写加入金额！",null,false);
			return false;
		}else if($(".invest_money").hasClass('bor_col')){
			return false;
		}else{
			$(".ul_select li").each(function(){
				var vals = $(this).attr("data");
				if(val == vals){
					$(this).append(sel);
				}
			});
			layer.open({
				type: 1,
				title:'',
				skin: '',
				closeBtn:0,
				area:['635px','485px'],
				content: $('#discount_show')
			});
		}
	});
	// 余额全投
	$(".all_money").on("click",function(){
		// 账户余额
		var money = $(".moneys").html();
		money = parseFloat(money.replace(/,/g,''));
		// 可投金额
		var a_money = 666666;
		if(money >= a_money){
			$(".sub_money").val(a_money);
		}else{
			$(".sub_money").val(money);
		}
		var inputs = $(".sub_money");
		setinput(inputs);
		import_money(money,a_money);
	});
	// 输入金额input输入状态
	$(".sub_money").keyup(function(){
		var money = $(".moneys").html();
		money = parseFloat(money.replace(/,/g,''));
		// 可投金额
		var a_money = 666666;
		var inputs = $(this);
		setinput(inputs);
		import_money(money,a_money);
		$(".inp_ticket").val("");
		$(".p_ticket").html("请选择优惠券").css('color','#9e9e9e');
		if(inputs.val() != ""){
			$(".btn_empty").show();
		}else{
			$(".btn_empty").hide();
		}
	});
	// 输入金额input得到光标状态
	$(".sub_money").focus(function(){
		var v = $(this).val();
		if(v == '0.00'){
			$(this).val('');
		}else{
			$(this).val($(this).val().replace(/\.00/, '').replace(/(\.\d)0/,'$1'));
		};
		if(v != ""){
			$(".btn_empty").show();
		}else{
			$(".btn_empty").hide();
		}
	});
	// 清空按钮
	$(".btn_empty").on("click",function(){
		$(".sub_money").val("");
		$(".invest_money").removeClass("bor_col");
		$(".in_span").remove();
		$(".sub_money").css("color","#333");
		$(".sub_money").focus();
		setinput($(".sub_money"));
		$(".inp_ticket").val("");
		$(".p_ticket").html("请选择优惠券").css('color','#9e9e9e');
		return false;
	});
	// 输入金额input失去焦点状态
	 $(".sub_money").blur(function(){
		var inputs = $(this);
		setTimeout(function(){
			overFormat(inputs);
			$(".btn_empty").hide();
		},200);
	});
	// 判断输入金额
	function import_money(bal_money,in_money){
		var inpt = $(".sub_money");
		var money = $(".sub_money").val();
		var a = $(".invest_money");
		if(money != "" && money != 0 && money < 100   && in_money < 500){
			input_mess("不得低于起投金额100元！",inpt,true);
			return false;
		}else if(money != "" && money != 0  && money < 500 && in_money >= 500){
			input_mess("不得低于起投金额500元！",inpt,true);
			return false;
		}else if(money != "" && money != 0  && money > bal_money){
			input_mess("余额不足",inpt,true);
			return false;
		}else if(money != "" && money != 0  && money > 500000){
			input_mess("单笔限额为500,000元！",inpt,true);
			return false;
		}else if(money != "" && money != 0  && money > in_money){
			input_mess("您输入的金额大于当前剩余可投金额！",inpt,true);
			return false;
		}else{
			a.removeClass("bor_col");
			$(".in_span").remove();
			inpt.css("color","#333");
		}
	};
	// input状态错误提示
	function input_mess(str,inp,flag){
		inp = inp || null;
		if ($(".in_span").length>0) {
			$(".in_span").remove();
		}
		if(flag == true){
			// $(".btn_empty").show();
		}
		if(inp != null){
			inp.css("color","red");
		}
		var txts = "<span class='in_span'><i class='iconfont'>&#xe671;</i>"+ str +"</span>";
		$(".invest_money").addClass("bor_col");
		$(".invest_money").append(txts);
	}
	// 支付按钮点击的状态
	$(document).on("click",".sub_btn",function(){
		var mon = $(".invest_money");
		var pswd = $(".input_pwd");
		var money = $(".sub_money").val();
		var psw = $(".sub_psw").val();
		if(money == "" && psw == ""){
			show_mess("请填写加入金额! 和 请填写加入金额和支付密码!");
			$(".sub_money").focus();
			mon.addClass("bor_col");
			pswd.addClass("bor_col");
			return false;
		}else if(money == "" && $(".in_span").length <= 0){
			$(".sub_money").focus();
			mon.addClass("bor_col");
			show_mess("请填写加入金额!");
			return false;
		}else if(psw == "" && $(".in_span").length <= 0){
			$(".sub_psw").focus();
			pswd.addClass("bor_col");
			show_mess("请填写支付密码!");
			return false;
		}else if(psw != "123" && $(".in_span").length <= 0){
			$(".sub_psw").focus();
			show_mess("密码错误，请重新输入!");
			pswd.addClass("bor_col");
			return false;
		}else{
			$(".current_money").removeClass("cur_money");
			$(".mess").remove();
			if($(".in_span").length <= 0){
				mon.removeClass('bor_col');
				pswd.removeClass('bor_col');
				// 激活存管弹窗
				/* layer.open({
					type: 1,
					title:'',
					closeBtn:0,
					skin: 'succeed_show',
					area:['560px','360px'],
					content: $('#bank_show')
				}); */
				// 加入成功
				/* layer.open({
					type: 1,
					title:'',
					closeBtn:0,
					skin: 'succeed_show',
					area:['560px','360px'],
					content: $('#succeed_show')
				}); */
				// 加入失败
				layer.open({
					type: 1,
					title:'',
					closeBtn:0,
					skin: 'succeed_show',
					area:['560px','360px'],
					content: $('#failed_show')
				});
			}
		}
	});
	$(".iskonw,.rclose").on("click",function(){
		layer.closeAll();
	});
	// 优惠券弹窗选择
	$(".ul_select li").on("click",function(){
		var clas = $(this).attr("class");
		var sel = '<b class="select_b"></b>';
		if(clas != "yhq_no"){
			var datas = $(this).attr('data');
			$(".ul_select li .select_b").remove();
			$(this).append(sel);
			$(".yes").addClass("add_quan");
			$(".yes").attr("data",datas);
		}
	});
	$(document).on("click",".discount_bot .add_quan",function(){
		var dat = $(this).attr("data");
		var a = $(".sub_money");
		var d = $(".inp_ticket").val();
		$(".p_ticket").html(dat).css('color','#333');
		$(".inp_ticket").val(dat);
		$(this).removeClass("add_quan");
		layer.closeAll();
		var b = Math.floor((a.val()*0.09/12)*100)/100;
		var e = Math.floor((a.val()*0.09/12)*100)/100;
		$(".predict_money").html(b +"+"+e);
	});
	$(".discount_bot .no").on("click",function(){
		$(".ul_select li .select_b").remove();
		$(".yes").removeClass("add_quan");
		layer.closeAll();
	});
	// 已阅读
	$('#checkinp').on('click',function(){
		if($('#checkinp').is(':checked')){
			$('#sub_btn').attr('class','sub_btn');
		}else{
			$('#sub_btn').attr('class','no_btn');
		}
	});
	// 输入金额计算
	function setinput(ins){
		var $amountInput = ins;
		event = window.event || event;
		if (event.keyCode == 37 | event.keyCode == 39) {
			return;
		}
		$amountInput.val($amountInput.val().replace(/[^\d.]/g, "").replace(/^\./g, "").replace(/\.{2,}/g, ".").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'));
		var a=ins;
		// 最后根据算法优化
		var b = Math.floor((a.val()*0.09/12)*100)/100;
		// 有奖励
		var flag = false;
		var c = 6;

		if(flag == true && quan == true){
			$(".predict_money").html(b +"+"+ c +"+"+ d);
		}else if(flag == true ){
			$(".predict_money").html(b +"+"+c);
		}else{
			$(".predict_money").html(b);
		}
		var m = a.val().replace(/\d(?=(\d{3})+$)/g,'$&,');
		if(m == ""){
			$(".sub_btn").val("实付0.00元，立即投资");
			$(".predict_money").html("0.00");
		}else{
			$(".sub_btn").val("实付"+m+"元，立即投资");
		}
	};
	function overFormat(th){
		if(th.val() != ""){
			th.val(Number(th.val()).toFixed(2));
			var logNum = th.val().toString();
			integerNum = parseInt(logNum).toString().replace(/\d(?=(\d{3})+$)/g,'$&,');
			decimalNum = '.' + logNum.replace(/(.*)\.(.*)/g,'$2');
			var m = th.val();
			if(m == ""){
				$(".sub_btn").val("实付0.00元，立即投资");
				$(".predict_money").html("0.00");
			}else{
				$(".sub_btn").val("实付"+ integerNum+decimalNum +"元，立即投资");
			}
		}
	}
	// top提示错误
	function show_mess(str){
		var txt = "<span class='mess'><i class='iconfont'>&#xe671;</i>"+ str +"</span>";
		$(".current_money").addClass("cur_money");
		if($(".mess").length > 0){
			$(".mess").remove();
		}
		$(".current_money").append(txt);
	};

	$(".zxf_pagediv").createPage({
		// 页数
		pageNum: 10,
		// 当前页
		current: 1,
		// 显示条数
		shownum: 10,
		backfun: function(e) {
			console.log(e.current);
			// $("#data-container").html(thisDate(e.current));
		}
	});
	// 图片延时加载
	// $("img.lazy").lazyload({effect: "fadeIn"});

	$('.fancybox').fancybox({
		fitToView   : false,
		// centerOnScroll:true,
		helpers:  {
			title: {
				type: 'inside',
				position: 'top'
			}
		}
	});
	// countdown(".times","2017/08/28,09:18:00");
	function countdown(obj,time){
		var html = '<input type="submit" value="实付0.00元，立即投资" class="sub_btn">';
		var ss=setInterval(function(){
			var endtime=new Date(time),
				nowtime = new Date(),
				leftsecond=parseInt((endtime.getTime()-nowtime.getTime())/1000),
				d=parseInt(leftsecond/3600/24),
				h=parseInt((leftsecond/3600)%24),
				m=parseInt((leftsecond/60)%60),
				m1=parseInt((leftsecond/3600)%24*60),
				s=parseInt(leftsecond%60);
			h= (h<10) ? "0"+h : h;
			m= (m<10) ? "0"+m : m;
			s= (s<10) ? "0"+s : s;
			if(leftsecond<=0){
				h=0;
				m=0;
				s=0;
			}
			$(obj).find("span b").text(h);
			$(obj).find("span i").text(m);
			$(obj).find("span em").text(s);
			if(leftsecond<=0){
				$('.countdown').remove();
				$('.input_sub').append(html);
				clearInterval(ss);
			}else{
			}
		},100);
	};
});