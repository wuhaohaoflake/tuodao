require('./draw_present.scss');
require('page/common/top/index.js');
require('page/common/nav/index.js');
require('util/layer/index.js');

var _paging = require('util/paging/index.js');
var _td = require('util/td.js');
var _apiDraw = require('api/operationCenter-api.js');
// 抽奖动画效果
var lottery = {
    place : 0,     // 请求后指定停留在某个位置
    click : false, // 默认值为false可抽奖，防止重复点击
    index : -1,    // 当前转动到哪个位置，起点位置
    count : 0,     // 总共有多少个位置
    timer : 0,     // setTimeout的ID，用clearTimeout清除
    speed : 20,    // 初始转动速度
    times : 0,     // 转动次数
    cycle : 50,    // 转动基本次数：即至少需要转动多少次再进入抽奖环节
    prize : -1,    // 中奖位置
    jgtime: 500,   // 中奖后几秒后开始弹窗
    headerData : {
		accessId : _td.getAccess('accessId'),
		accessKey : _td.getAccess('accessKey')
	},
    init : function(id){
        if ($("#"+id).find(".lottery-unit").length>0) {
            $lottery = $("#"+id);
            $units = $lottery.find(".lottery-unit");
            console.log($units.length);
            this.obj = $lottery;
            this.count = $units.length;
            $lottery.find(".lottery-unit-"+this.index).addClass("active");
        };
    },
    roll : function(){
        var index = this.index,
            count = this.count,
            lottery = this.obj;
        $(lottery).find(".lottery-unit-"+index).removeClass("active");
        index += 1;
        if (index>count-1) {
            index = 0;
        };
        $(lottery).find(".lottery-unit-"+index).addClass("active");
        this.index=index;
        return false;
    },
    // 抽奖页面弹窗公共样式
	layerPublic : function(obj){
		var skins='';
		if(obj=='draw_points'){
			skins='draw_points_alert';
		}else if(obj=='draw_presents'){
			skins='draw_presents_alert';
		}else{
			skins='draw_hongbao_alert';
		}
		layer.open({
			type: 1,
			title: ['抽奖结果','font-size:14px;','color:#707070;'],
			skin: skins,
			area: ['560px', '410px'],
			content: $('#'+obj),
			cancel : function(){lottery.no_draw()}
		});
	},
    stop1 : function(){
        lottery.times += 1;
        lottery.roll();// 转动过程调用的是lottery的roll方法，这里是第一次调用初始化
        if (lottery.times > lottery.cycle+10 && lottery.prize==lottery.index) {
            clearTimeout(lottery.timer);
            // 转盘结束时，中奖项效果显示，积分扣除10
            $('#draw').html(parseInt($('#draw').html())-10);
        	$('#draw_point').find(".lottery-unit-"+lottery.place).addClass('back_yes');
			$('#draw_point').find(".lottery-unit-"+lottery.place).find('.points_content').height(155);
            // 可以在这个位置写上中奖弹框，这个是转盘停止时触发事件
            switch (lottery.place){
				case 0:
					$('#draw_points .color333 span').html('&nbsp;688&nbsp;积分');
					$('#draw_points .color9e span').html('不错不错，再接再厉！');
					setTimeout(function(){
						lottery.layerPublic('draw_points');
					},lottery.jgtime);
				break;
				case 1:
					$('#draw_points .color333 span').html('&nbsp;366&nbsp;积分');
					$('#draw_points .color9e span').html('不错不错，再接再厉！');
					setTimeout(function(){
						lottery.layerPublic('draw_points');
					},lottery.jgtime);
				break;
				case 2:
					$('#draw_points .color333 span').html('&nbsp;166&nbsp;积分');
					$('#draw_points .color9e span').html('不错不错，再接再厉！');
					setTimeout(function(){
						lottery.layerPublic('draw_points');
					},lottery.jgtime);
				break;
				case 3:
					$('#draw_points .color333 span').html('&nbsp;66&nbsp;积分');
					$('#draw_points .color9e span').html('不要泄气，小奖怡情');
					setTimeout(function(){
						lottery.layerPublic('draw_points');
					},lottery.jgtime);
				break;
				case 4:
					$('#draw_points .color333 span').html('&nbsp;36&nbsp;积分');
					$('#draw_points .color9e span').html('不错不错，再接再厉！');
					setTimeout(function(){
						lottery.layerPublic('draw_points');
					},lottery.jgtime);
				break;
				case 5:
					$('#draw_points .color333 span').html('&nbsp;16&nbsp;积分');
					$('#draw_points .color9e span').html('不要泄气，小奖怡情');
					setTimeout(function(){
						lottery.layerPublic('draw_points');
					},lottery.jgtime);
				break;
				case 6:
					$('#draw_points .color333 span').html('&nbsp;6&nbsp;积分');
					$('#draw_points .color9e span').html('不错不错，再接再厉！');
					setTimeout(function(){
						lottery.layerPublic('draw_points');
					},lottery.jgtime);
				break;
				case 7:
					$('#draw_points .color333 span').html('&nbsp;1&nbsp;积分');
					$('#draw_points .color9e span').html('不错不错，再接再厉！');
					setTimeout(function(){
						lottery.layerPublic('draw_points');
					},lottery.jgtime);
				break;
			}
			lottery.prize=-1;
            lottery.times=0;
            lottery.click=false;
            console.log('您抽中了第'+lottery.place+'个奖品');
        }else{
            if (lottery.times<lottery.cycle) {
                lottery.speed -= 10;
            }else if(lottery.times==lottery.cycle) {
                lottery.place = Math.random()*(lottery.count)|0;// 案例中奖物品通过一个随机数生成
                // lottery.getDrawResult(1,10); // 这个可以通过ajax请求回来的数据赋值给lottery.place
                lottery.prize = lottery.place;
            }else{
                if (lottery.times > lottery.cycle+10 && ((lottery.prize==0 && lottery.index==7) || lottery.prize==lottery.index+1)) {
                    lottery.speed += 110;
                }else{
                    lottery.speed += 20;
                }
            }
            if (lottery.speed<40) {
                lottery.speed=40;
            };
            lottery.timer = setTimeout(lottery.stop1,lottery.speed);//循环调用
        }
        return false;
    },
    stop2 : function(){
        lottery.times += 1;
        lottery.roll();// 转动过程调用的是lottery的roll方法，这里是第一次调用初始化
        if (lottery.times > lottery.cycle+10 && lottery.prize==lottery.index) {
            clearTimeout(lottery.timer);
            // 转盘结束时，中奖项效果显示,积分扣除100
            $('#draw').html(parseInt($('#draw').html())-100);
			$('#draw_present').find(".lottery-unit-"+lottery.place).addClass('back_yes');
			$('#draw_present').find(".lottery-unit-"+lottery.place).find('.presents_content').height(145);
            // 可以在这个位置写上中奖弹框，这个是转盘停止时触发事件
            switch(lottery.place){
				case 0:
					// $('.present_img img').attr('src',"require('../image/welfare/iphone8_alert.png')");
					// $('.present_img img')[0].src="<%= require('../../../image/iphone8_alert.png') %>";
					setTimeout(function(){
						lottery.layerPublic('draw_presents');
					},lottery.jgtime);
				break;
				case 1:
					// $('.present_img img').attr('src',"require('../image/welfare/xmTV_alert.png')");
					// $('.present_img img')[0].src="../../../image/welfare/xmTV_alert.png";
					// $('.present_img img')[0].src="<%= require('../../../image/xmTV_alert.png') %>";
					$('.present_img span').html('小米电视');
					setTimeout(function(){
						lottery.layerPublic('draw_presents');
					},lottery.jgtime);
				break;
				case 2:
					// $('.present_img img').attr('src',"../../../image/welfare/flp_alert.png");
					$('.present_img span').html('飞利浦电动牙刷');
					setTimeout(function(){
						lottery.layerPublic('draw_presents');
					},lottery.jgtime);
				break;
				case 3:
					// $('.hb_img img').attr('src',"<%= require('../image/welfare/jxq_alert.png') %>");
					$('.hongbao_content .color333 span').html('&nbsp;268元&nbsp;红包');
					setTimeout(function(){
						lottery.layerPublic('draw_hongbao');
					},lottery.jgtime);
				break;
				case 4:
					// $('.hb_img img').attr('src',"<%= require('../image/welfare/hongbao_alert.png') %>");
					$('.hongbao_content .color333 span').html('&nbsp;10元&nbsp;红包');
					setTimeout(function(){
						lottery.layerPublic('draw_hongbao');
					},lottery.jgtime);
				break;
				case 5:
					// $('.hb_img img').attr('src',"<%= require('../image/welfare/hongbao_alert.png') %>");
					$('.hongbao_content .color333 span').html('&nbsp;388元&nbsp;红包');
					setTimeout(function(){
						lottery.layerPublic('draw_hongbao');
					},lottery.jgtime);
				break;
				case 6:
					// $('.hb_img img').attr('src',"<%= require('../image/welfare/hongbao_alert.png') %>");
					$('.hongbao_content .color333 span').html('&nbsp;68元&nbsp;红包');
					setTimeout(function(){
						lottery.layerPublic('draw_hongbao');
					},lottery.jgtime);
				break;
				case 7:
					// $('.hb_img img').attr('src',"<%= require('../image/welfare/hongbao_alert.png') %>");
					$('.hongbao_content .color333 span').html('&nbsp;3%&nbsp;加息券');
					setTimeout(function(){
						lottery.layerPublic('draw_hongbao');
					},lottery.jgtime);
				break;
            }
            lottery.prize=-1;
            lottery.times=0;
            lottery.click=false;
            console.log('您抽中了第'+lottery.place+'个奖品');
        }else{
            if (lottery.times<lottery.cycle) {
                lottery.speed -= 10;
            }else if(lottery.times==lottery.cycle) {
                lottery.place = Math.random()*(lottery.count)|0;// 案例中奖物品通过一个随机数生成
                // lottery.getDrawResult(2,100); // 这个可以通过ajax请求回来的数据赋值给lottery.place
                lottery.prize = lottery.place;
            }else{
                if (lottery.times > lottery.cycle+10 && ((lottery.prize==0 && lottery.index==7) || lottery.prize==lottery.index+1)) {
                    lottery.speed += 110;
                }else{
                    lottery.speed += 20;
                }
            }
            if (lottery.speed<40) {
                lottery.speed=40;
            };
            lottery.timer = setTimeout(lottery.stop2,lottery.speed);//循环调用
        }
        return false;
    },
    // 抽奖结果
    getDrawResult : function(type,needScore){
    	_apiDraw.getDraw_result(lottery.headerData,type,needScore,function(res){
    		if(res.content.drawType==1){
				switch (res.content.prizeName) {// 请求返回的抽中奖品字段
                    case '688积分':
                        lottery.place = 0;// 当前奖品所在九宫格位置
                        break;
                    case '366积分': //10元投资红包
                        lottery.place = 1;// 当前奖品所在九宫格位置
                        break;
                    case '166积分':
                        lottery.place = 2;// 当前奖品所在九宫格位置
                        break;
                    case '66积分':
                        lottery.place = 3;//当前奖品所在九宫格位置
                        break;
                    case '36积分':
                        lottery.place = 4;// 当前奖品所在九宫格位置
                        break;
                    case '16积分':
                        lottery.place = 5;// 当前奖品所在九宫格位置
                        break;
                    case '6积分':
                        lottery.place = 6;// 当前奖品所在九宫格位置
                        break;
                    case '积分1':
                        lottery.place = 7;// 当前奖品所在九宫格位置
                        break;
                }
			}else{
				switch (res.content.prizeName) {// 请求返回的抽中奖品字段
                    case 'iPhone8':
                        lottery.place = 0;// 当前奖品所在九宫格位置
                        break;
                    case '小米电视':
                        lottery.place = 1;// 当前奖品所在九宫格位置
                        break;
                    case '飞利浦牙刷':
                        lottery.place = 2;// 当前奖品所在九宫格位置
                        break;
                    case '268元红包':
                        lottery.place = 3;// 当前奖品所在九宫格位置
                        break;
                    case '10元红包':
                        lottery.place = 4;// 当前奖品所在九宫格位置
                        break;
                    case '388元红包':
                        lottery.place = 5;// 当前奖品所在九宫格位置
                        break;
                    case '68元红包':
                        lottery.place = 6;// 当前奖品所在九宫格位置
                        break;
                    case '3%加息券':
                        lottery.place = 7;// 当前奖品所在九宫格位置
                        break;
            	}
			}
    	},function(){
    		console.log("请求失败");
    	})
    },
	// 抽奖
	// 抽奖记录
	getDrawRecord : function(){
		_apiDraw.getDrawRecord(1,5,function(res){
			if(res.content.list.length==0){
				$('.record_none').show()
				$('.record_yes').hide();
				return false;
			}else{
				var bannerHtml = _td.renderHtml(record,{
					list:res.content.list,
				});
				$('._Draw_record_table').html(bannerHtml);
				lottery.changeColor('.Draw_table');
				_paging.paging('pageList',res.content.pages,res.content.pageNum,res.content.pageSize,function(e){
					_apiInvite.getDrawRecord(e.current,5,function(res){
						var bannerHtml = _td.renderHtml(record,{
							list:res.content.list,
						});
						$('._invite_record_table').html(bannerHtml);
						lottery.changeColor('.invite_table');
					},function(){
						console.log("分页点击请求失败");
					});
				});
			}
		},function(){
			console.log('请求失败');
		})
	},
    // 可用积分不够抽奖是的样式
    checkPoints : function(obj){
		$(obj).css({
			'-webkit-boxShadow'	:'inset 0 0 75px #9e9e9e',
			'-moz-boxShadow'	:'inset 0 0 75px #9e9e9e',
			boxShadow 			:'inset 0 0 75px #9e9e9e',
			background 			: '#E6E6E6',
			cursor 				:'auto'
		})
		$(obj).find('.go_word').html('积分不足');
		$(obj).find('.go_word').css({color:'#707070',paddingTop:'60px',fontSize:'40px'});
		$(obj).find('.none_points a').show();
    },
    draw_Btn : function(obj,obj_class){
    	$(obj).on('click',function(){
    		var points=parseInt($('#draw').html());
    		if(points<10){
    			lottery.checkPoints(obj);
    			return false;
    		}
    		$(this).addClass('back_go_yes');
			lottery.init(obj_class);
	        if (lottery.click) {// click控制一次抽奖过程中不能重复点击抽奖按钮，后面的点击不响应
	            return false;
	        }else{
	            lottery.speed=100;
	            if(obj=="#go_draw_10"){
	            	lottery.stop1();// 转圈过程不响应click事件，会将click置为false
	            }else{
	            	lottery.stop2();// 转圈过程不响应click事件，会将click置为false
	            }
	            lottery.click=true; //一次抽奖完成后，设置click为true，可继续抽奖
	            return false;
	        }
    	})
    },
    // 可用积分
    getPoints : function(){
		_apiDraw.getPoints(function(res){
			$('#draw').html(res.content.scoreCurrent);
			$('.record_top .points_yes').html(res.content.scoreCurrent);
		},function(){
			console.log('请求失败');
		});
	},
	// 抽奖页面恢复初始样式
	no_draw : function (){
		$('.draw_step li').removeClass('back_yes active');
		$('#go_draw_100').removeClass('back_go_yes');
		$('#go_draw_10').removeClass('back_go_yes');
		$('#draw_present li').find('.present_content').height(160);
		$('#draw_point li').find('.points_content').height(160);
	},
	changeColor : function (obj){
		$.each($(obj+' tr'),function(i){
			if(i%2!=0){
				$(obj+' tr').eq(i).css('background','#FBFBFB');
			}
		})
	},
	// 一些点击事件
	clickEvnet : function(){
		$('.draw_menu a').on('click',function(){
			$(this).addClass('on').siblings().removeClass('on');
			var index=$(this).index();
			$('.draw_step').children().eq(index).show().siblings().hide();
		})
		// 抽奖记录弹窗
		$('.draw_record a').on('click',function(){
			layer.open({
				type: 1,
				title: ['我的抽奖记录','font-size:14px;','color:#333;'],
				skin: 'draw_record_alert',
				area: ['635px', 'auto'],
				content: $('#draw_record')
			});
			lottery.changeColor('.record_yes .record_table');
		})
		// 点击弹窗我知道了，关闭弹窗并恢复抽奖页面初始样式
		$('.draw_alert .draw_btn button').on('click',function(){
			layer.closeAll();
			lottery.no_draw();
		})
	}
};
$(function(){
	lottery.getPoints();
	lottery.draw_Btn('#go_draw_10','draw_point');
	lottery.draw_Btn('#go_draw_100','draw_present');
	lottery.clickEvnet();
})

