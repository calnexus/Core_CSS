$.widget( "corecss.donut" , {

    version: "1.0.0",

    options: {
        size: 100,
        radius: 50,
        value: 0,
        background: "#ffffff",
        stroke: "#d1d8e7",
        fill: "#49649f",
        fontSize: 24,
        hole: .8,
        total: 100,
        cap: "%",
        animate: 0,
        showTitle: true
    },

    animation_change_interval: undefined,

    _create: function () {
        var that = this, element = this.element, o = this.options;

        this._setOptionsFromDOM();

        this._createDonut();

        element.data('donut', this);
    },

    _createDonut: function(){
        var that = this, element = this.element, o = this.options;
        var html = "";
        var r = o.radius  * (1 - (1 - o.hole) / 2);
        var width = o.radius * (1 - o.hole);
        var circumference = 2 * Math.PI * r;
        var strokeDasharray = ((o.value * circumference) / o.total) + ' ' + circumference;
        var transform = 'rotate(-90 ' + o.radius + ',' + o.radius + ')';
        var fontSize = r * o.hole * 0.6;

        if (!element.hasClass("donut")) element.addClass("donut");

        element.css({
            width: o.size,
            height: o.size,
            background: o.background
        });

        html += "<svg>";
        html += "   <circle class='donut-back' r='"+(r)+"px' cx='"+(o.radius)+"px' cy='"+(o.radius)+"px' transform='"+(transform)+"' fill='none' stroke='"+(o.stroke)+"' stroke-width='"+(width)+"'/>";
        html += "   <circle class='donut-fill' r='"+(r)+"px' cx='"+(o.radius)+"px' cy='"+(o.radius)+"px' transform='"+(transform)+"' fill='none' stroke='"+(o.fill)+"' stroke-width='"+(width)+"'/>";
        if (o.showTitle === true) {
            html += "   <text   class='donut-title' x='" + (o.radius) + "px' y='" + (o.radius) + "px' dy='" + (fontSize / 3) + "px' text-anchor='middle' fill='" + (o.fill) + "' font-size='" + (fontSize) + "px'>0" + (o.cap) + "</text>";
        }
        html += "</svg>";

        element.html(html);

        this.val(o.value);
    },

    _setValue: function(v){
        var that = this, element = this.element, o = this.options;

        var fill = element.find(".donut-fill");
        var title = element.find(".donut-title");
        var r = o.radius  * (1 - (1 - o.hole) / 2);
        var circumference = 2 * Math.PI * r;
        var title_value = ((v * 1000 / o.total) / 10)+(o.cap);
        var fill_value = ((v * circumference) / o.total) + ' ' + circumference;

        fill.attr("stroke-dasharray", fill_value);
        title.html(title_value);
    },

    val: function(v){
        var that = this, o = this.options;

        if (v === undefined) {
            return o.value
        }

        if (o.animate > 0 && !document.hidden) {
            var i = 0;

            console.log(v, o.value);
            if (v > o.value) {
                console.log("inc");
            } else {
                console.log("dec");
            }

            this.animation_change_interval = setInterval(function(){
                that._setValue(++i);
                if (i >= v) {
                    clearInterval(that.animation_change_interval);
                }
            }, o.animate);
        } else {
            clearInterval(that.animation_change_interval);
            this._setValue(v);
        }

        o.value = v;
    },

    _setOptionsFromDOM: function(){
        var element = this.element, o = this.options;

        $.each(element.data(), function(key, value){
            if (key in o) {
                try {
                    o[key] = $.parseJSON(value);
                } catch (e) {
                    o[key] = value;
                }
            }
        });
    },

    _destroy: function () {
    },

    _setOption: function ( key, value ) {
        this._super('_setOption', key, value);
    }
});
