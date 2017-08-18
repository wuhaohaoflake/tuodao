$(function(){
	$(".til").on("click",function(){
		$(".personNum").toggle();
	});
	$(".phoneNum input").on("blur",function(){
		var phone = $(".phoneNum input").val();
		if(phone == "" || !(/^1[34578]\d{9}$/.test(phone))){
			return false;
		}else{
			$("#slider2").slider({
				width: 340,
				height: 40,
				sliderBg: "#BCBCBC",
				color: "#ffffff",
				fontSize: 14,
				bgColor: "#FFCC99",
				textMsg: "请按住滑块，拖到最右边 >>",
				successMsg: "验证通过",
				successColor: "#FF6600",
				time: 400,
				callback: function(result) {
					// $("#result").html(result);
					if(result==true){
						$(".btn").addClass("kd");
					}
				}
			});
		}
	});
});