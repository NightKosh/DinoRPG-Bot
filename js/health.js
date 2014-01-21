
$(document).ready(function () {
    $("#profilBox1 > .dinList li").each(function () {
        var flashvars = $(".swf embed", this).attr("flashvars");
        var name = $("div.name", this);
        if (name.find("a").length != 0) {
        	name = name.find("a");
        }
        
        if (/damages=1/.test(flashvars)) {
            name.text(name.text() + " (подбит)");
        } else if (/damages=2/.test(flashvars)) {
            name.text(name.text() + " (избит)");
        }
    });
});
