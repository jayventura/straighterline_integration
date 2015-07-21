/* 
README
1. Ensure JS targeting includes:
	yiel.$("#yief"+campaign.id)[0].contentWindow.postMessage("hosturl,"+window.location.protocol+"//"+window.location.hostname,"*")
2. Initialize using:
	sl_integration.initialize(overlay_source);
	where "overlay_source" is the unique OVERLAY_SOURCE hidden input value
*/
function SL_integration() {
	this.parentHost;
	this.yie_error_html = $("<div>",{
		class:"yie_error",
		style:"height: 20px; color: red; position: absolute; z-index: 100; width:408px;"
	}).css({
		left:$("input[name=\"email\"]").css("left")
	}).text("Valid Email Address Required");
	this.is_valid_email = function(email) { return /^.+@.+\..+$/.test(email); };
	this.initialize = function(overlay_source) {
		var that = this;
		$("form").append($("<input>",{
			type:"hidden",
			name:"OVERLAY_SOURCE",
			value:overlay_source
		}));
		$("form").append($("<input>",{
			type:"hidden",
			name:"campaign_id",
			value:campaign_id
		}));
		$("form").append($("<button>", {
			type:"button",
			id:"fake_button",
			style:$("#submit_button").attr("style")
		}));
		$("#submit_button").css({
			top:"0",
			left:"0",
			width:"1px",
			height:"1px"
		});
		bindEvent(window, "message", function( event ) {
			var data = event.data.split(',');
			if ( data[0] === "hosturl") {
				that.parentHost = data[1];    
			}
		});
		$(window).keydown(function(event){
			if(event.keyCode == 13) {
			event.preventDefault();
			$("#fake_button").click();
			}
		});
		$("#fake_button").click(function() {
			if (that.is_valid_email($("input[name=\"email\"]").val()) === true) {
				window.parent.postMessage("source,"+$("input[name=\"OVERLAY_SOURCE\"]").val(),that.parentHost);
				window.parent.postMessage("email,"+$("input[name=\"email\"]").val(),that.parentHost);
				window.parent.postMessage("campaign,"+$("input[name=\"campaign_id\"]").val(),that.parentHost);	
				$("#submit_button").click();
			} else if (!$(".yie_error").length) {
				$("input[name=\"email\"]").after(that.yie_error_html);
			}
		});
	}
}
var sl_integration = new SL_integration;