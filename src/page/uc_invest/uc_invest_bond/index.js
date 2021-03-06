require('./index.scss');
require('page/common/uc-menu/index.js');
require('page/common/top/index.js');
require('page/common/nav/index.js');
require('util/laydate/index.js');
require('util/layer/index.js');
var _tips 		= 	require('util/tips/index.js');
var _td 		= 	require('util/td.js');
var _apiInvest 	= 	require('api/trade-api.js');
var _paging 	= 	require('util/paging/index.js');
var bondAble 	= 	require('./Invest_bondAble.string');
var bondTran 	= 	require('./Invest_bondTran.string');
var bondYet 	= 	require('./Invest_bondYet.string');
var bondApply 	= 	require('./Invest_bondApply.string');

var ucInvest = {
	init : function(){
		this.urlEach();
	},
	urlEach : function(){
		$('.uc_bondTab a').each(function () {
			if (location.href.indexOf($(this).attr('href')) > -1&&$(this).attr('href')!="") {
				var sta = $(this).attr("status");
				$(this).addClass('on');
				ucInvest.initDate();
				var oUl = '<ul class="tabUl"><li class="on" status="0">全部</li><li status="1">募集中</li><li status="2">回款中</li><li status="3">已回款</li></ul>';
				if(sta == "0"){
					ucInvest.addAbleHtml('0','','','10','1');
				}else if(sta == "1"){
					ucInvest.addTranHtml('1','','','10','1');
				}else if(sta == "2"){
					ucInvest.addTranHtml('2','','','10','1');
				}else if(sta == "3"){
					ucInvest.addYetHtml('0','','','10','1');
					$(".uc_invest_tabL").html(oUl);
					ucInvest.yetStatusclick();
				}
			} else {
				$(this).removeClass('on');
			};
		});
	},
	addAbleHtml : function(sta,startime,endtime,pagesize,current){
		_apiInvest.getBond(sta,startime,endtime,pagesize,current,function(res){
			listBondHtml = _td.renderHtml(bondAble,{
				list:res.content.list,
			});
			$(".bond_box").html(listBondHtml);
			$(".uc_invest_tabR").attr("status",sta);
			_paging.paging("pageList",res.content.pages,res.content.pageNum,res.content.pageSize,function(e){
				_apiInvest.getBond(sta,startime,endtime,pagesize,current,function(res){
					listBondHtml = _td.renderHtml(bondAble,{
						list:res.content.list,
					});
					$(".bond_box").html(listBondHtml);
					$(".uc_invest_tabR").attr("status",sta);
					ucInvest.trColor();
					ucInvest.tipsHover();
					ucInvest.applyClick();
					ucInvest.dateClick();
				},function(){
					console.log("分页请求失败");
				});
			});
			ucInvest.trColor();
			ucInvest.tipsHover();
			ucInvest.applyClick();
			ucInvest.dateClick();
		},function(){
			console.log("请求失败");
		});
	},
	addTranHtml : function(sta,startime,endtime,pagesize,current){
		_apiInvest.getBond(sta,startime,endtime,pagesize,current,function(res){
			listBondHtml = _td.renderHtml(bondTran,{
				list:res.content.list,
			});
			$(".bond_box").html(listBondHtml);
			$(".uc_invest_tabR").attr("status",sta);
			_paging.paging("pageList",res.content.pages,res.content.pageNum,res.content.pageSize,function(e){
				_apiInvest.getBond(sta,startime,endtime,pagesize,current,function(res){
					listBondHtml = _td.renderHtml(bondTran,{
						list:res.content.list,
					});
					$(".bond_box").html(listBondHtml);
					$(".uc_invest_tabR").attr("status",sta);
					ucInvest.trColor();
					ucInvest.tipsHover();
					ucInvest.dateClick();
				},function(){
					console.log("分页请求失败");
				});
			});
			ucInvest.trColor();
			ucInvest.tipsHover();
			ucInvest.dateClick();
		},function(){
			console.log("请求失败");
		});
	},
	addYetHtml : function(sta,startime,endtime,pagesize,current){
		_apiInvest.getBondyet(sta,startime,endtime,pagesize,current,function(res){
			listBondHtml = _td.renderHtml(bondYet,{
				list:res.content.list,
			});
			$(".bond_box").html(listBondHtml);
			$(".uc_invest_tabR").attr("status","3");
			_paging.paging("pageList",res.content.pages,res.content.pageNum,res.content.pageSize,function(e){
				_apiInvest.getBondyet(sta,startime,endtime,pagesize,current,function(res){
					listBondHtml = _td.renderHtml(bondYet,{
						list:res.content.list,
					});
					$(".bond_box").html(listBondHtml);
					$(".uc_invest_tabR").attr("status","3");
					ucInvest.trColor();
					ucInvest.tipsHover();
					ucInvest.dateClick();
				},function(){
					console.log("分页请求失败");
				});
			});
			ucInvest.trColor();
			ucInvest.tipsHover();
			ucInvest.dateClick();
		},function(){
			console.log("请求失败");
		});
	},
	yetStatusclick : function(){
		$(".uc_invest_tabL li").on("click",function(){
			var sta = $(this).attr("status");
			$(this).addClass('on').siblings('li').removeClass('on');
			$(".uc_invest_tabR").attr("yet",sta);
			ucInvest.addYetHtml(sta,'','','10','1');
		});
	},
	dateClick : function(){
		$(".start_date").off("click").on("click",function(){
			var _this = $(this);
			var sta = $(this).parent(".uc_invest_tabR").attr("status");
			var yetSta = $(this).parent(".uc_invest_tabR").attr("yet");
			var endTime = $("#end_date").attr('endDate');
			laydate({
				elem: '#start_date',
				format: 'YYYY-MM-DD',
				// 选择时间后回调
			 	choose: function(dates){
			 		$("#start_date").attr("startDate",dates);
			 		if(sta == 0){
			 			ucInvest.addAbleHtml('0',dates,endTime,'10','1');
			 			console.log("可转让");
			 		}else if(sta == 1){
						ucInvest.addTranHtml('1',dates,endTime,'10','1');
			 			console.log("转让中");
			 		}else if(sta == 2){
						ucInvest.addTranHtml('2',dates,endTime,'10','1');
			 			console.log("已转让");
			 		}else if(sta == 3){
						ucInvest.addYetHtml(yetSta,dates,endTime,'10','1');
			 			console.log("已受让");
			 		}
			  	}
			});
		});
		$(".end_date").off("click").on("click",function(){
			var _this = $(this);
			var sta = $(this).parent(".uc_invest_tabR").attr("status");
			var startTime = $("#start_date").attr('startDate');
			var yetSta = $(this).parent(".uc_invest_tabR").attr("yet");
			laydate({
				elem: '#end_date',
				format: 'YYYY-MM-DD',
				// 选择时间后回调
			 	choose: function(dates){
			 		$("#end_date").attr("endDate",dates);
			 		if(sta == 0){
			 			ucInvest.addAbleHtml('0',startTime,dates,'10','1');
			 			console.log("可转让");
			 		}else if(sta == 1){
						ucInvest.addTranHtml('1',startTime,dates,'10','1');
			 			console.log("转让中");
			 		}else if(sta == 2){
						ucInvest.addTranHtml('2',startTime,dates,'10','1');
			 			console.log("已转让");
			 		}else if(sta == 3){
						ucInvest.addYetHtml(yetSta,startTime,dates,'10','1');
			 			console.log("已受让");
			 		}
			  	}
			});
		});
	},
	applyClick : function(){
		// 申请转让
		$(".transfer_clk a").on("click",function(){
			var id = $(this).attr("tenderId");
			_apiInvest.getApply(id,function(res){
				listApply = _td.renderHtml(bondApply,{
					content:res.content,
				});
				$(".bond_show_box").html(listApply);
				$(".sub_btn").attr("tenderId",id);
				ucInvest.inputUp();
				$(".close_btn").on("click",function(){
					$(".bond_show_box").html("");
					layer.closeAll();
				});
			},function(){

			});
			layer.open({
				type: 1,
				title: '',
				closeBtn: 0,
				area: ['740px', '594px'],
				content: $('#bond_show')
			});
		});
		// 确认转让点击
		$(document).on("click",".affirm_btn",function(){
			var id = $(this).attr("tenderId");
			var pasw = $(".sub_psw").val();
			var tlt = $(".applyTlt").html();
			_apiInvest.subApply(id,pasw,function(res){
				$(".applyOkTlt").html(tlt);
				layer.closeAll();
				layer.open({
					type: 1,
					title: '',
					closeBtn: 0,
					area: ['740px', '594px'],
					content: $('#bond_showOk')
				});
			},function(){
				show_mess("密码错误，请重新输入");
			});
		});
		$(".bond_ok_close").on("click",function(){
			layer.closeAll();
			window.location.reload();
		});
		$(".bond_show_now").on("click",function(){
			layer.closeAll();
			window.location.reload();
		});
		function show_mess(str){
			var txt = "<span class='mess'><i class='iconfont'>&#xe671;</i>"+ str +"</span>";
			$(".bond_formM").addClass("cur_money");
			$(".input_pwd").addClass("psw_mes");
			if($(".mess").length > 0){
				$(".mess").remove();
			}
			$(".bond_formM").append(txt);
		};
	},
	initDate : function(){
		$("#start_date").attr("startDate","").html("选择开始时间");
		$("#end_date").attr("endDate","").html("选择结束时间");
	},
	tipsHover : function(){
		$(".td_name").mouseover(function(){
			_tips.getTipsRight($(this),16);
		});
		$(".td_name").mouseout(function(){
			$(this).find('.tips').hide();
		});
	},
	inputUp : function(){
		$(".sub_psw").keyup(function(){
			if($(this).val() != ""){
				$(".sub_btn").addClass("affirm_btn");
			}else{
				$(".sub_btn").removeClass("affirm_btn");
			}
		});
	},
	trColor : function(){
		trColor('tbody_list');
		// 各行变色
		function trColor(id){
			var trs=document.getElementById(id).getElementsByTagName("tr");
			for(var i=0;i<trs.length;i++){
				if(i%2==0){
					trs[i].className +=" trColor";
				}
			};
		}
	}
};
$(function(){
	ucInvest.init();
});