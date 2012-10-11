
const NULLTEXT = "Type to search ...";

$(function(){

var host_admin = chrome.extension.getBackgroundPage().host_admin;
var host_file_wrapper = chrome.extension.getBackgroundPage().host_file_wrapper;
var searchbar = $("#search input");
chrome.windows.getCurrent(function(w){
	chrome.tabs.query({ active: true , windowType: "normal", windowId:w.id }, function(t){
		if (t.length > 0){
			var hosts = host_admin.get_hosts();
			var host = t[0].url.match(/:\/\/(.[^/^:]+)/)[1];
			if(hosts[host]){
				searchbar.val(host).select();
			}
		}
		redraw();
	});
});


var host_ul = $("#list  ul");

var redraw = function(){
	var wanted = searchbar.val();
	if(wanted == NULLTEXT){
		wanted = "";
	}
	host_ul.html("");
	host_admin.refresh();
	var hosts = host_admin.get_hosts();

	var found = [];

	if(hosts[wanted]){
		found[wanted] = hosts[wanted];
	}

	for (var h in hosts){
		if(h.indexOf(wanted) >= 0 && h != wanted){
			found[h] = hosts[h];
		}
	}

	for (var h in found){
		var hli = $("<li/>").text(h)
			
		var ul = $("<ul/>");

		for(var i in hosts[h]){

			var host = hosts[h][i];
			var a = $('<a href="javascript:;">' + host.addr + '</a>');
			a.click((function(host, hostname ,host_index){
			return function(){
				host_admin.host_toggle(hostname, host_index);
				host_file_wrapper.set(host_admin.mk_host());
				redraw();
			}})(host,h,i));

			var li = $("<li/>").append(a);

			if(host.using){
				li.addClass('enable')
			}
			ul.append(li);
		}
		
		hli.append(ul);

		host_ul.append(hli);
	}
};


searchbar.keyup(redraw);

searchbar.blur(function(){
	if($(this).val() == ""){
		$(this).val(NULLTEXT);
		$(this).addClass("blur");
	}
});

searchbar.focus(function(){
	$(this).removeClass("blur");
	if($(this).val() == NULLTEXT){
		$(this).val("");
	}
})

setTimeout(function(){
searchbar.blur();
}, 50);

$(document.body).keydown(function(e){
	searchbar.focus();
});

});

