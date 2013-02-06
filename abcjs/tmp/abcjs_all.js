/*!
 * Raphael 1.4.3 - JavaScript Vector Library
 *
 * Copyright (c) 2010 Dmitry Baranovskiy (http://raphaeljs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
 
Raphael = (function () {
    function R() {
        if (R.is(arguments[0], array)) {
            var a = arguments[0],
                cnv = create[apply](R, a.splice(0, 3 + R.is(a[0], nu))),
                res = cnv.set();
            for (var i = 0, ii = a[length]; i < ii; i++) {
                var j = a[i] || {};
                elements.test(j.type) && res[push](cnv[j.type]().attr(j));
            }
            return res;
        }
        return create[apply](R, arguments);
    }
    R.version = "1.4.3";
    var separator = /[, ]+/,
        elements = /^(circle|rect|path|ellipse|text|image)$/,
        proto = "prototype",
        has = "hasOwnProperty",
        doc = document,
        win = window,
        oldRaphael = {
            was: Object[proto][has].call(win, "Raphael"),
            is: win.Raphael
        },
        Paper = function () {},
        appendChild = "appendChild",
        apply = "apply",
        concat = "concat",
        supportsTouch = "createTouch" in doc,
        E = "",
        S = " ",
        split = "split",
        events = "click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend orientationchange touchcancel gesturestart gesturechange gestureend"[split](S),
        touchMap = {
            mousedown: "touchstart",
            mousemove: "touchmove",
            mouseup: "touchend"
        },
        join = "join",
        length = "length",
        lowerCase = String[proto].toLowerCase,
        math = Math,
        mmax = math.max,
        mmin = math.min,
        nu = "number",
        string = "string",
        array = "array",
        toString = "toString",
        fillString = "fill",
        objectToString = Object[proto][toString],
        paper = {},
        pow = math.pow,
        push = "push",
        rg = /^(?=[\da-f]$)/,
        ISURL = /^url\(['"]?([^\)]+?)['"]?\)$/i,
        colourRegExp = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+\s*,\s*[\d\.]+\s*,\s*[\d\.]+(?:\s*,\s*[\d\.]+)?)\s*\)|rgba?\(\s*([\d\.]+%\s*,\s*[\d\.]+%\s*,\s*[\d\.]+%(?:\s*,\s*[\d\.]+%))\s*\)|hs[bl]\(\s*([\d\.]+\s*,\s*[\d\.]+\s*,\s*[\d\.]+)\s*\)|hs[bl]\(\s*([\d\.]+%\s*,\s*[\d\.]+%\s*,\s*[\d\.]+%)\s*\))\s*$/i,
        round = math.round,
        setAttribute = "setAttribute",
        toFloat = parseFloat,
        toInt = parseInt,
        ms = " progid:DXImageTransform.Microsoft",
        upperCase = String[proto].toUpperCase,
        availableAttrs = {blur: 0, "clip-rect": "0 0 1e9 1e9", cursor: "default", cx: 0, cy: 0, fill: "#fff", "fill-opacity": 1, font: '10px "Arial"', "font-family": '"Arial"', "font-size": "10", "font-style": "normal", "font-weight": 400, gradient: 0, height: 0, href: "http://raphaeljs.com/", opacity: 1, path: "M0,0", r: 0, rotation: 0, rx: 0, ry: 0, scale: "1 1", src: "", stroke: "#000", "stroke-dasharray": "", "stroke-linecap": "butt", "stroke-linejoin": "butt", "stroke-miterlimit": 0, "stroke-opacity": 1, "stroke-width": 1, target: "_blank", "text-anchor": "middle", title: "Raphael", translation: "0 0", width: 0, x: 0, y: 0},
        availableAnimAttrs = {along: "along", blur: nu, "clip-rect": "csv", cx: nu, cy: nu, fill: "colour", "fill-opacity": nu, "font-size": nu, height: nu, opacity: nu, path: "path", r: nu, rotation: "csv", rx: nu, ry: nu, scale: "csv", stroke: "colour", "stroke-opacity": nu, "stroke-width": nu, translation: "csv", width: nu, x: nu, y: nu},
        rp = "replace";
    R.type = (win.SVGAngle || doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML");
    if (R.type == "VML") {
        var d = doc.createElement("div");
        d.innerHTML = '<!--[if vml]><br><br><![endif]-->';
        if (d.childNodes[length] != 2) {
            return R.type = null;
        }
        d = null;
    }
    R.svg = !(R.vml = R.type == "VML");
    Paper[proto] = R[proto];
    R._id = 0;
    R._oid = 0;
    R.fn = {};
    R.is = function (o, type) {
        type = lowerCase.call(type);
        return  (type == "object" && o === Object(o)) ||
                (type == "undefined" && typeof o == type) ||
                (type == "null" && o == null) ||
                lowerCase.call(objectToString.call(o).slice(8, -1)) == type;
    };

    R.setWindow = function (newwin) {
        win = newwin;
        doc = win.document;
    };
    // colour utilities
    var toHex = function (color) {
        if (R.vml) {
            // http://dean.edwards.name/weblog/2009/10/convert-any-colour-value-to-hex-in-msie/
            var trim = /^\s+|\s+$/g;
            toHex = cacher(function (color) {
                var bod;
                color = (color + E)[rp](trim, E);
                try {
                    var docum = new win.ActiveXObject("htmlfile");
                    docum.write("<body>");
                    docum.close();
                    bod = docum.body;
                } catch(e) {
                    bod = win.createPopup().document.body;
                }
                var range = bod.createTextRange();
                try {
                    bod.style.color = color;
                    var value = range.queryCommandValue("ForeColor");
                    value = ((value & 255) << 16) | (value & 65280) | ((value & 16711680) >>> 16);
                    return "#" + ("000000" + value[toString](16)).slice(-6);
                } catch(e) {
                    return "none";
                }
            });
        } else {
            var i = doc.createElement("i");
            i.title = "Rapha\xebl Colour Picker";
            i.style.display = "none";
            doc.body[appendChild](i);
            toHex = cacher(function (color) {
                i.style.color = color;
                return doc.defaultView.getComputedStyle(i, E).getPropertyValue("color");
            });
        }
        return toHex(color);
    };
    var hsbtoString = function () {
        return "hsb(" + [this.h, this.s, this.b] + ")";
    },
    rgbtoString = function () {
        return this.hex;
    };
    R.hsb2rgb = cacher(function (hue, saturation, brightness) {
        if (R.is(hue, "object") && "h" in hue && "s" in hue && "b" in hue) {
            brightness = hue.b;
            saturation = hue.s;
            hue = hue.h;
        }
        var red,
            green,
            blue;
        if (brightness == 0) {
            return {r: 0, g: 0, b: 0, hex: "#000"};
        }
        if (hue > 1 || saturation > 1 || brightness > 1) {
            hue /= 255;
            saturation /= 255;
            brightness /= 255;
        }
        var i = ~~(hue * 6),
            f = (hue * 6) - i,
            p = brightness * (1 - saturation),
            q = brightness * (1 - (saturation * f)),
            t = brightness * (1 - (saturation * (1 - f)));
        red = [brightness, q, p, p, t, brightness, brightness][i];
        green = [t, brightness, brightness, q, p, p, t][i];
        blue = [p, p, t, brightness, brightness, q, p][i];
        red *= 255;
        green *= 255;
        blue *= 255;
        var rgb = {r: red, g: green, b: blue, toString: rgbtoString},
            r = (~~red)[toString](16),
            g = (~~green)[toString](16),
            b = (~~blue)[toString](16);
        r = r[rp](rg, "0");
        g = g[rp](rg, "0");
        b = b[rp](rg, "0");
        rgb.hex = "#" + r + g + b;
        return rgb;
    }, R);
    R.rgb2hsb = cacher(function (red, green, blue) {
        if (R.is(red, "object") && "r" in red && "g" in red && "b" in red) {
            blue = red.b;
            green = red.g;
            red = red.r;
        }
        if (R.is(red, string)) {
            var clr = R.getRGB(red);
            red = clr.r;
            green = clr.g;
            blue = clr.b;
        }
        if (red > 1 || green > 1 || blue > 1) {
            red /= 255;
            green /= 255;
            blue /= 255;
        }
        var max = mmax(red, green, blue),
            min = mmin(red, green, blue),
            hue,
            saturation,
            brightness = max;
        if (min == max) {
            return {h: 0, s: 0, b: max};
        } else {
            var delta = (max - min);
            saturation = delta / max;
            if (red == max) {
                hue = (green - blue) / delta;
            } else if (green == max) {
                hue = 2 + ((blue - red) / delta);
            } else {
                hue = 4 + ((red - green) / delta);
            }
            hue /= 6;
            hue < 0 && hue++;
            hue > 1 && hue--;
        }
        return {h: hue, s: saturation, b: brightness, toString: hsbtoString};
    }, R);
    var p2s = /,?([achlmqrstvxz]),?/gi,
        commaSpaces = /\s*,\s*/,
        hsrg = {hs: 1, rg: 1};
    R._path2string = function () {
        return this.join(",")[rp](p2s, "$1");
    };
    function cacher(f, scope, postprocessor) {
        function newf() {
            var arg = Array[proto].slice.call(arguments, 0),
                args = arg[join]("\u25ba"),
                cache = newf.cache = newf.cache || {},
                count = newf.count = newf.count || [];
            if (cache[has](args)) {
                return postprocessor ? postprocessor(cache[args]) : cache[args];
            }
            count[length] >= 1e3 && delete cache[count.shift()];
            count[push](args);
            cache[args] = f[apply](scope, arg);
            return postprocessor ? postprocessor(cache[args]) : cache[args];
        }
        return newf;
    }
 
    R.getRGB = cacher(function (colour) {
        if (!colour || !!((colour = colour + E).indexOf("-") + 1)) {
            return {r: -1, g: -1, b: -1, hex: "none", error: 1};
        }
        if (colour == "none") {
            return {r: -1, g: -1, b: -1, hex: "none"};
        }
        !(hsrg[has](colour.substring(0, 2)) || colour.charAt() == "#") && (colour = toHex(colour));
        var res,
            red,
            green,
            blue,
            opacity,
            t,
            rgb = colour.match(colourRegExp);
        if (rgb) {
            if (rgb[2]) {
                blue = toInt(rgb[2].substring(5), 16);
                green = toInt(rgb[2].substring(3, 5), 16);
                red = toInt(rgb[2].substring(1, 3), 16);
            }
            if (rgb[3]) {
                blue = toInt((t = rgb[3].charAt(3)) + t, 16);
                green = toInt((t = rgb[3].charAt(2)) + t, 16);
                red = toInt((t = rgb[3].charAt(1)) + t, 16);
            }
            if (rgb[4]) {
                rgb = rgb[4][split](commaSpaces);
                red = toFloat(rgb[0]);
                green = toFloat(rgb[1]);
                blue = toFloat(rgb[2]);
                opacity = toFloat(rgb[3]);
            }
            if (rgb[5]) {
                rgb = rgb[5][split](commaSpaces);
                red = toFloat(rgb[0]) * 2.55;
                green = toFloat(rgb[1]) * 2.55;
                blue = toFloat(rgb[2]) * 2.55;
                opacity = toFloat(rgb[3]);
            }
            if (rgb[6]) {
                rgb = rgb[6][split](commaSpaces);
                red = toFloat(rgb[0]);
                green = toFloat(rgb[1]);
                blue = toFloat(rgb[2]);
                return R.hsb2rgb(red, green, blue);
            }
            if (rgb[7]) {
                rgb = rgb[7][split](commaSpaces);
                red = toFloat(rgb[0]) * 2.55;
                green = toFloat(rgb[1]) * 2.55;
                blue = toFloat(rgb[2]) * 2.55;
                return R.hsb2rgb(red, green, blue);
            }
            rgb = {r: red, g: green, b: blue};
            var r = (~~red)[toString](16),
                g = (~~green)[toString](16),
                b = (~~blue)[toString](16);
            r = r[rp](rg, "0");
            g = g[rp](rg, "0");
            b = b[rp](rg, "0");
            rgb.hex = "#" + r + g + b;
            isFinite(toFloat(opacity)) && (rgb.o = opacity);
            return rgb;
        }
        return {r: -1, g: -1, b: -1, hex: "none", error: 1};
    }, R);
    R.getColor = function (value) {
        var start = this.getColor.start = this.getColor.start || {h: 0, s: 1, b: value || .75},
            rgb = this.hsb2rgb(start.h, start.s, start.b);
        start.h += .075;
        if (start.h > 1) {
            start.h = 0;
            start.s -= .2;
            start.s <= 0 && (this.getColor.start = {h: 0, s: 1, b: start.b});
        }
        return rgb.hex;
    };
    R.getColor.reset = function () {
        delete this.start;
    };
    // path utilities
    var pathCommand = /([achlmqstvz])[\s,]*((-?\d*\.?\d*(?:e[-+]?\d+)?\s*,?\s*)+)/ig,
        pathValues = /(-?\d*\.?\d*(?:e[-+]?\d+)?)\s*,?\s*/ig;
    R.parsePathString = cacher(function (pathString) {
        if (!pathString) {
            return null;
        }
        var paramCounts = {a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0},
            data = [];
        if (R.is(pathString, array) && R.is(pathString[0], array)) { // rough assumption
            data = pathClone(pathString);
        }
        if (!data[length]) {
            (pathString + E)[rp](pathCommand, function (a, b, c) {
                var params = [],
                    name = lowerCase.call(b);
                c[rp](pathValues, function (a, b) {
                    b && params[push](+b);
                });
                if (name == "m" && params[length] > 2) {
                    data[push]([b][concat](params.splice(0, 2)));
                    name = "l";
                    b = b == "m" ? "l" : "L";
                }
                while (params[length] >= paramCounts[name]) {
                    data[push]([b][concat](params.splice(0, paramCounts[name])));
                    if (!paramCounts[name]) {
                        break;
                    }
                }
            });
        }
        data[toString] = R._path2string;
        return data;
    });
    R.findDotsAtSegment = function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
        var t1 = 1 - t,
            x = pow(t1, 3) * p1x + pow(t1, 2) * 3 * t * c1x + t1 * 3 * t * t * c2x + pow(t, 3) * p2x,
            y = pow(t1, 3) * p1y + pow(t1, 2) * 3 * t * c1y + t1 * 3 * t * t * c2y + pow(t, 3) * p2y,
            mx = p1x + 2 * t * (c1x - p1x) + t * t * (c2x - 2 * c1x + p1x),
            my = p1y + 2 * t * (c1y - p1y) + t * t * (c2y - 2 * c1y + p1y),
            nx = c1x + 2 * t * (c2x - c1x) + t * t * (p2x - 2 * c2x + c1x),
            ny = c1y + 2 * t * (c2y - c1y) + t * t * (p2y - 2 * c2y + c1y),
            ax = (1 - t) * p1x + t * c1x,
            ay = (1 - t) * p1y + t * c1y,
            cx = (1 - t) * c2x + t * p2x,
            cy = (1 - t) * c2y + t * p2y,
            alpha = (90 - math.atan((mx - nx) / (my - ny)) * 180 / math.PI);
        (mx > nx || my < ny) && (alpha += 180);
        return {x: x, y: y, m: {x: mx, y: my}, n: {x: nx, y: ny}, start: {x: ax, y: ay}, end: {x: cx, y: cy}, alpha: alpha};
    };
    var pathDimensions = cacher(function (path) {
        if (!path) {
            return {x: 0, y: 0, width: 0, height: 0};
        }
        path = path2curve(path);
        var x = 0, 
            y = 0,
            X = [],
            Y = [],
            p;
        for (var i = 0, ii = path[length]; i < ii; i++) {
            p = path[i];
            if (p[0] == "M") {
                x = p[1];
                y = p[2];
                X[push](x);
                Y[push](y);
            } else {
                var dim = curveDim(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
                X = X[concat](dim.min.x, dim.max.x);
                Y = Y[concat](dim.min.y, dim.max.y);
                x = p[5];
                y = p[6];
            }
        }
        var xmin = mmin[apply](0, X),
            ymin = mmin[apply](0, Y);
        return {
            x: xmin,
            y: ymin,
            width: mmax[apply](0, X) - xmin,
            height: mmax[apply](0, Y) - ymin
        };
    }),
        pathClone = function (pathArray) {
            var res = [];
            if (!R.is(pathArray, array) || !R.is(pathArray && pathArray[0], array)) { // rough assumption
                pathArray = R.parsePathString(pathArray);
            }
            for (var i = 0, ii = pathArray[length]; i < ii; i++) {
                res[i] = [];
                for (var j = 0, jj = pathArray[i][length]; j < jj; j++) {
                    res[i][j] = pathArray[i][j];
                }
            }
            res[toString] = R._path2string;
            return res;
        },
        pathToRelative = cacher(function (pathArray) {
            if (!R.is(pathArray, array) || !R.is(pathArray && pathArray[0], array)) { // rough assumption
                pathArray = R.parsePathString(pathArray);
            }
            var res = [],
                x = 0,
                y = 0,
                mx = 0,
                my = 0,
                start = 0;
            if (pathArray[0][0] == "M") {
                x = pathArray[0][1];
                y = pathArray[0][2];
                mx = x;
                my = y;
                start++;
                res[push](["M", x, y]);
            }
            for (var i = start, ii = pathArray[length]; i < ii; i++) {
                var r = res[i] = [],
                    pa = pathArray[i];
                if (pa[0] != lowerCase.call(pa[0])) {
                    r[0] = lowerCase.call(pa[0]);
                    switch (r[0]) {
                        case "a":
                            r[1] = pa[1];
                            r[2] = pa[2];
                            r[3] = pa[3];
                            r[4] = pa[4];
                            r[5] = pa[5];
                            r[6] = +(pa[6] - x).toFixed(3);
                            r[7] = +(pa[7] - y).toFixed(3);
                            break;
                        case "v":
                            r[1] = +(pa[1] - y).toFixed(3);
                            break;
                        case "m":
                            mx = pa[1];
                            my = pa[2];
                        default:
                            for (var j = 1, jj = pa[length]; j < jj; j++) {
                                r[j] = +(pa[j] - ((j % 2) ? x : y)).toFixed(3);
                            }
                    }
                } else {
                    r = res[i] = [];
                    if (pa[0] == "m") {
                        mx = pa[1] + x;
                        my = pa[2] + y;
                    }
                    for (var k = 0, kk = pa[length]; k < kk; k++) {
                        res[i][k] = pa[k];
                    }
                }
                var len = res[i][length];
                switch (res[i][0]) {
                    case "z":
                        x = mx;
                        y = my;
                        break;
                    case "h":
                        x += +res[i][len - 1];
                        break;
                    case "v":
                        y += +res[i][len - 1];
                        break;
                    default:
                        x += +res[i][len - 2];
                        y += +res[i][len - 1];
                }
            }
            res[toString] = R._path2string;
            return res;
        }, 0, pathClone),
        pathToAbsolute = cacher(function (pathArray) {
            if (!R.is(pathArray, array) || !R.is(pathArray && pathArray[0], array)) { // rough assumption
                pathArray = R.parsePathString(pathArray);
            }
            var res = [],
                x = 0,
                y = 0,
                mx = 0,
                my = 0,
                start = 0;
            if (pathArray[0][0] == "M") {
                x = +pathArray[0][1];
                y = +pathArray[0][2];
                mx = x;
                my = y;
                start++;
                res[0] = ["M", x, y];
            }
            for (var i = start, ii = pathArray[length]; i < ii; i++) {
                var r = res[i] = [],
                    pa = pathArray[i];
                if (pa[0] != upperCase.call(pa[0])) {
                    r[0] = upperCase.call(pa[0]);
                    switch (r[0]) {
                        case "A":
                            r[1] = pa[1];
                            r[2] = pa[2];
                            r[3] = pa[3];
                            r[4] = pa[4];
                            r[5] = pa[5];
                            r[6] = +(pa[6] + x);
                            r[7] = +(pa[7] + y);
                            break;
                        case "V":
                            r[1] = +pa[1] + y;
                            break;
                        case "H":
                            r[1] = +pa[1] + x;
                            break;
                        case "M":
                            mx = +pa[1] + x;
                            my = +pa[2] + y;
                        default:
                            for (var j = 1, jj = pa[length]; j < jj; j++) {
                                r[j] = +pa[j] + ((j % 2) ? x : y);
                            }
                    }
                } else {
                    for (var k = 0, kk = pa[length]; k < kk; k++) {
                        res[i][k] = pa[k];
                    }
                }
                switch (r[0]) {
                    case "Z":
                        x = mx;
                        y = my;
                        break;
                    case "H":
                        x = r[1];
                        break;
                    case "V":
                        y = r[1];
                        break;
                    default:
                        x = res[i][res[i][length] - 2];
                        y = res[i][res[i][length] - 1];
                }
            }
            res[toString] = R._path2string;
            return res;
        }, null, pathClone),
        l2c = function (x1, y1, x2, y2) {
            return [x1, y1, x2, y2, x2, y2];
        },
        q2c = function (x1, y1, ax, ay, x2, y2) {
            var _13 = 1 / 3,
                _23 = 2 / 3;
            return [
                    _13 * x1 + _23 * ax,
                    _13 * y1 + _23 * ay,
                    _13 * x2 + _23 * ax,
                    _13 * y2 + _23 * ay,
                    x2,
                    y2
                ];
        },
        a2c = function (x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
            // for more information of where this math came from visit:
            // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
            var PI = math.PI,
                _120 = PI * 120 / 180,
                rad = PI / 180 * (+angle || 0),
                res = [],
                xy,
                rotate = cacher(function (x, y, rad) {
                    var X = x * math.cos(rad) - y * math.sin(rad),
                        Y = x * math.sin(rad) + y * math.cos(rad);
                    return {x: X, y: Y};
                });
            if (!recursive) {
                xy = rotate(x1, y1, -rad);
                x1 = xy.x;
                y1 = xy.y;
                xy = rotate(x2, y2, -rad);
                x2 = xy.x;
                y2 = xy.y;
                var cos = math.cos(PI / 180 * angle),
                    sin = math.sin(PI / 180 * angle),
                    x = (x1 - x2) / 2,
                    y = (y1 - y2) / 2;
                var h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
                if (h > 1) {
                    h = math.sqrt(h);
                    rx = h * rx;
                    ry = h * ry;
                }
                var rx2 = rx * rx,
                    ry2 = ry * ry,
                    k = (large_arc_flag == sweep_flag ? -1 : 1) *
                        math.sqrt(math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))),
                    cx = k * rx * y / ry + (x1 + x2) / 2,
                    cy = k * -ry * x / rx + (y1 + y2) / 2,
                    f1 = math.asin(((y1 - cy) / ry).toFixed(7)),
                    f2 = math.asin(((y2 - cy) / ry).toFixed(7));

                f1 = x1 < cx ? PI - f1 : f1;
                f2 = x2 < cx ? PI - f2 : f2;
                f1 < 0 && (f1 = PI * 2 + f1);
                f2 < 0 && (f2 = PI * 2 + f2);
                if (sweep_flag && f1 > f2) {
                    f1 = f1 - PI * 2;
                }
                if (!sweep_flag && f2 > f1) {
                    f2 = f2 - PI * 2;
                }
            } else {
                f1 = recursive[0];
                f2 = recursive[1];
                cx = recursive[2];
                cy = recursive[3];
            }
            var df = f2 - f1;
            if (math.abs(df) > _120) {
                var f2old = f2,
                    x2old = x2,
                    y2old = y2;
                f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
                x2 = cx + rx * math.cos(f2);
                y2 = cy + ry * math.sin(f2);
                res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
            }
            df = f2 - f1;
            var c1 = math.cos(f1),
                s1 = math.sin(f1),
                c2 = math.cos(f2),
                s2 = math.sin(f2),
                t = math.tan(df / 4),
                hx = 4 / 3 * rx * t,
                hy = 4 / 3 * ry * t,
                m1 = [x1, y1],
                m2 = [x1 + hx * s1, y1 - hy * c1],
                m3 = [x2 + hx * s2, y2 - hy * c2],
                m4 = [x2, y2];
            m2[0] = 2 * m1[0] - m2[0];
            m2[1] = 2 * m1[1] - m2[1];
            if (recursive) {
                return [m2, m3, m4][concat](res);
            } else {
                res = [m2, m3, m4][concat](res)[join]()[split](",");
                var newres = [];
                for (var i = 0, ii = res[length]; i < ii; i++) {
                    newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x;
                }
                return newres;
            }
        },
        findDotAtSegment = function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
            var t1 = 1 - t;
            return {
                x: pow(t1, 3) * p1x + pow(t1, 2) * 3 * t * c1x + t1 * 3 * t * t * c2x + pow(t, 3) * p2x,
                y: pow(t1, 3) * p1y + pow(t1, 2) * 3 * t * c1y + t1 * 3 * t * t * c2y + pow(t, 3) * p2y
            };
        },
        curveDim = cacher(function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
            var a = (c2x - 2 * c1x + p1x) - (p2x - 2 * c2x + c1x),
                b = 2 * (c1x - p1x) - 2 * (c2x - c1x),
                c = p1x - c1x,
                t1 = (-b + math.sqrt(b * b - 4 * a * c)) / 2 / a,
                t2 = (-b - math.sqrt(b * b - 4 * a * c)) / 2 / a,
                y = [p1y, p2y],
                x = [p1x, p2x],
                dot;
            math.abs(t1) > 1e12 && (t1 = .5);
            math.abs(t2) > 1e12 && (t2 = .5);
            if (t1 > 0 && t1 < 1) {
                dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t1);
                x[push](dot.x);
                y[push](dot.y);
            }
            if (t2 > 0 && t2 < 1) {
                dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t2);
                x[push](dot.x);
                y[push](dot.y);
            }
            a = (c2y - 2 * c1y + p1y) - (p2y - 2 * c2y + c1y);
            b = 2 * (c1y - p1y) - 2 * (c2y - c1y);
            c = p1y - c1y;
            t1 = (-b + math.sqrt(b * b - 4 * a * c)) / 2 / a;
            t2 = (-b - math.sqrt(b * b - 4 * a * c)) / 2 / a;
            math.abs(t1) > 1e12 && (t1 = .5);
            math.abs(t2) > 1e12 && (t2 = .5);
            if (t1 > 0 && t1 < 1) {
                dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t1);
                x[push](dot.x);
                y[push](dot.y);
            }
            if (t2 > 0 && t2 < 1) {
                dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t2);
                x[push](dot.x);
                y[push](dot.y);
            }
            return {
                min: {x: mmin[apply](0, x), y: mmin[apply](0, y)},
                max: {x: mmax[apply](0, x), y: mmax[apply](0, y)}
            };
        }),
        path2curve = cacher(function (path, path2) {
            var p = pathToAbsolute(path),
                p2 = path2 && pathToAbsolute(path2),
                attrs = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
                attrs2 = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
                processPath = function (path, d) {
                    var nx, ny;
                    if (!path) {
                        return ["C", d.x, d.y, d.x, d.y, d.x, d.y];
                    }
                    !(path[0] in {T:1, Q:1}) && (d.qx = d.qy = null);
                    switch (path[0]) {
                        case "M":
                            d.X = path[1];
                            d.Y = path[2];
                            break;
                        case "A":
                            path = ["C"][concat](a2c[apply](0, [d.x, d.y][concat](path.slice(1))));
                            break;
                        case "S":
                            nx = d.x + (d.x - (d.bx || d.x));
                            ny = d.y + (d.y - (d.by || d.y));
                            path = ["C", nx, ny][concat](path.slice(1));
                            break;
                        case "T":
                            d.qx = d.x + (d.x - (d.qx || d.x));
                            d.qy = d.y + (d.y - (d.qy || d.y));
                            path = ["C"][concat](q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
                            break;
                        case "Q":
                            d.qx = path[1];
                            d.qy = path[2];
                            path = ["C"][concat](q2c(d.x, d.y, path[1], path[2], path[3], path[4]));
                            break;
                        case "L":
                            path = ["C"][concat](l2c(d.x, d.y, path[1], path[2]));
                            break;
                        case "H":
                            path = ["C"][concat](l2c(d.x, d.y, path[1], d.y));
                            break;
                        case "V":
                            path = ["C"][concat](l2c(d.x, d.y, d.x, path[1]));
                            break;
                        case "Z":
                            path = ["C"][concat](l2c(d.x, d.y, d.X, d.Y));
                            break;
                    }
                    return path;
                },
                fixArc = function (pp, i) {
                    if (pp[i][length] > 7) {
                        pp[i].shift();
                        var pi = pp[i];
                        while (pi[length]) {
                            pp.splice(i++, 0, ["C"][concat](pi.splice(0, 6)));
                        }
                        pp.splice(i, 1);
                        ii = mmax(p[length], p2 && p2[length] || 0);
                    }
                },
                fixM = function (path1, path2, a1, a2, i) {
                    if (path1 && path2 && path1[i][0] == "M" && path2[i][0] != "M") {
                        path2.splice(i, 0, ["M", a2.x, a2.y]);
                        a1.bx = 0;
                        a1.by = 0;
                        a1.x = path1[i][1];
                        a1.y = path1[i][2];
                        ii = mmax(p[length], p2 && p2[length] || 0);
                    }
                };
            for (var i = 0, ii = mmax(p[length], p2 && p2[length] || 0); i < ii; i++) {
                p[i] = processPath(p[i], attrs);
                fixArc(p, i);
                p2 && (p2[i] = processPath(p2[i], attrs2));
                p2 && fixArc(p2, i);
                fixM(p, p2, attrs, attrs2, i);
                fixM(p2, p, attrs2, attrs, i);
                var seg = p[i],
                    seg2 = p2 && p2[i],
                    seglen = seg[length],
                    seg2len = p2 && seg2[length];
                attrs.x = seg[seglen - 2];
                attrs.y = seg[seglen - 1];
                attrs.bx = toFloat(seg[seglen - 4]) || attrs.x;
                attrs.by = toFloat(seg[seglen - 3]) || attrs.y;
                attrs2.bx = p2 && (toFloat(seg2[seg2len - 4]) || attrs2.x);
                attrs2.by = p2 && (toFloat(seg2[seg2len - 3]) || attrs2.y);
                attrs2.x = p2 && seg2[seg2len - 2];
                attrs2.y = p2 && seg2[seg2len - 1];
            }
            return p2 ? [p, p2] : p;
        }, null, pathClone),
        parseDots = cacher(function (gradient) {
            var dots = [];
            for (var i = 0, ii = gradient[length]; i < ii; i++) {
                var dot = {},
                    par = gradient[i].match(/^([^:]*):?([\d\.]*)/);
                dot.color = R.getRGB(par[1]);
                if (dot.color.error) {
                    return null;
                }
                dot.color = dot.color.hex;
                par[2] && (dot.offset = par[2] + "%");
                dots[push](dot);
            }
            for (i = 1, ii = dots[length] - 1; i < ii; i++) {
                if (!dots[i].offset) {
                    var start = toFloat(dots[i - 1].offset || 0),
                        end = 0;
                    for (var j = i + 1; j < ii; j++) {
                        if (dots[j].offset) {
                            end = dots[j].offset;
                            break;
                        }
                    }
                    if (!end) {
                        end = 100;
                        j = ii;
                    }
                    end = toFloat(end);
                    var d = (end - start) / (j - i + 1);
                    for (; i < j; i++) {
                        start += d;
                        dots[i].offset = start + "%";
                    }
                }
            }
            return dots;
        }),
        getContainer = function (x, y, w, h) {
            var container;
            if (R.is(x, string) || R.is(x, "object")) {
                container = R.is(x, string) ? doc.getElementById(x) : x;
                if (container.tagName) {
                    if (y == null) {
                        return {
                            container: container,
                            width: container.style.pixelWidth || container.offsetWidth,
                            height: container.style.pixelHeight || container.offsetHeight
                        };
                    } else {
                        return {container: container, width: y, height: w};
                    }
                }
            } else {
                return {container: 1, x: x, y: y, width: w, height: h};
            }
        },
        plugins = function (con, add) {
            var that = this;
            for (var prop in add) {
                if (add[has](prop) && !(prop in con)) {
                    switch (typeof add[prop]) {
                        case "function":
                            (function (f) {
                                con[prop] = con === that ? f : function () { return f[apply](that, arguments); };
                            })(add[prop]);
                        break;
                        case "object":
                            con[prop] = con[prop] || {};
                            plugins.call(this, con[prop], add[prop]);
                        break;
                        default:
                            con[prop] = add[prop];
                        break;
                    }
                }
            }
        },
        tear = function (el, paper) {
            el == paper.top && (paper.top = el.prev);
            el == paper.bottom && (paper.bottom = el.next);
            el.next && (el.next.prev = el.prev);
            el.prev && (el.prev.next = el.next);
        },
        tofront = function (el, paper) {
            if (paper.top === el) {
                return;
            }
            tear(el, paper);
            el.next = null;
            el.prev = paper.top;
            paper.top.next = el;
            paper.top = el;
        },
        toback = function (el, paper) {
            if (paper.bottom === el) {
                return;
            }
            tear(el, paper);
            el.next = paper.bottom;
            el.prev = null;
            paper.bottom.prev = el;
            paper.bottom = el;
        },
        insertafter = function (el, el2, paper) {
            tear(el, paper);
            el2 == paper.top && (paper.top = el);
            el2.next && (el2.next.prev = el);
            el.next = el2.next;
            el.prev = el2;
            el2.next = el;
        },
        insertbefore = function (el, el2, paper) {
            tear(el, paper);
            el2 == paper.bottom && (paper.bottom = el);
            el2.prev && (el2.prev.next = el);
            el.prev = el2.prev;
            el2.prev = el;
            el.next = el2;
        },
        removed = function (methodname) {
            return function () {
                throw new Error("Rapha\xebl: you are calling to method \u201c" + methodname + "\u201d of removed object");
            };
        },
        radial_gradient = /^r(?:\(([^,]+?)\s*,\s*([^\)]+?)\))?/;
 
    // SVG
    if (R.svg) {
        Paper[proto].svgns = "http://www.w3.org/2000/svg";
        Paper[proto].xlink = "http://www.w3.org/1999/xlink";
        round = function (num) {
            return +num + (~~num === num) * .5;
        };
        var $ = function (el, attr) {
            if (attr) {
                for (var key in attr) {
                    if (attr[has](key)) {
                        el[setAttribute](key, attr[key] + E);
                    }
                }
            } else {
                el = doc.createElementNS(Paper[proto].svgns, el);
                el.style.webkitTapHighlightColor = "rgba(0,0,0,0)";
                return el;
            }
        };
        R[toString] = function () {
            return  "Your browser supports SVG.\nYou are running Rapha\xebl " + this.version;
        };
        var thePath = function (pathString, SVG) {
            var el = $("path");
            SVG.canvas && SVG.canvas[appendChild](el);
            var p = new Element(el, SVG);
            p.type = "path";
            setFillAndStroke(p, {fill: "none", stroke: "#000", path: pathString});
            return p;
        };
        var addGradientFill = function (o, gradient, SVG) {
            var type = "linear",
                fx = .5, fy = .5,
                s = o.style;
            gradient = (gradient + E)[rp](radial_gradient, function (all, _fx, _fy) {
                type = "radial";
                if (_fx && _fy) {
                    fx = toFloat(_fx);
                    fy = toFloat(_fy);
                    var dir = ((fy > .5) * 2 - 1);
                    pow(fx - .5, 2) + pow(fy - .5, 2) > .25 &&
                        (fy = math.sqrt(.25 - pow(fx - .5, 2)) * dir + .5) &&
                        fy != .5 &&
                        (fy = fy.toFixed(5) - 1e-5 * dir);
                }
                return E;
            });
            gradient = gradient[split](/\s*\-\s*/);
            if (type == "linear") {
                var angle = gradient.shift();
                angle = -toFloat(angle);
                if (isNaN(angle)) {
                    return null;
                }
                var vector = [0, 0, math.cos(angle * math.PI / 180), math.sin(angle * math.PI / 180)],
                    max = 1 / (mmax(math.abs(vector[2]), math.abs(vector[3])) || 1);
                vector[2] *= max;
                vector[3] *= max;
                if (vector[2] < 0) {
                    vector[0] = -vector[2];
                    vector[2] = 0;
                }
                if (vector[3] < 0) {
                    vector[1] = -vector[3];
                    vector[3] = 0;
                }
            }
            var dots = parseDots(gradient);
            if (!dots) {
                return null;
            }
            var id = o.getAttribute(fillString);
            id = id.match(/^url\(#(.*)\)$/);
            id && SVG.defs.removeChild(doc.getElementById(id[1]));
            
            var el = $(type + "Gradient");
            el.id = "r" + (R._id++)[toString](36);
            $(el, type == "radial" ? {fx: fx, fy: fy} : {x1: vector[0], y1: vector[1], x2: vector[2], y2: vector[3]});
            SVG.defs[appendChild](el);
            for (var i = 0, ii = dots[length]; i < ii; i++) {
                var stop = $("stop");
                $(stop, {
                    offset: dots[i].offset ? dots[i].offset : !i ? "0%" : "100%",
                    "stop-color": dots[i].color || "#fff"
                });
                el[appendChild](stop);
            }
            $(o, {
                fill: "url(#" + el.id + ")",
                opacity: 1,
                "fill-opacity": 1
            });
            s.fill = E;
            s.opacity = 1;
            s.fillOpacity = 1;
            return 1;
        };
        var updatePosition = function (o) {
            var bbox = o.getBBox();
            $(o.pattern, {patternTransform: R.format("translate({0},{1})", bbox.x, bbox.y)});
        };
        var setFillAndStroke = function (o, params) {
            var dasharray = {
                    "": [0],
                    "none": [0],
                    "-": [3, 1],
                    ".": [1, 1],
                    "-.": [3, 1, 1, 1],
                    "-..": [3, 1, 1, 1, 1, 1],
                    ". ": [1, 3],
                    "- ": [4, 3],
                    "--": [8, 3],
                    "- .": [4, 3, 1, 3],
                    "--.": [8, 3, 1, 3],
                    "--..": [8, 3, 1, 3, 1, 3]
                },
                node = o.node,
                attrs = o.attrs,
                rot = o.rotate(),
                addDashes = function (o, value) {
                    value = dasharray[lowerCase.call(value)];
                    if (value) {
                        var width = o.attrs["stroke-width"] || "1",
                            butt = {round: width, square: width, butt: 0}[o.attrs["stroke-linecap"] || params["stroke-linecap"]] || 0,
                            dashes = [];
                        var i = value[length];
                        while (i--) {
                            dashes[i] = value[i] * width + ((i % 2) ? 1 : -1) * butt;
                        }
                        $(node, {"stroke-dasharray": dashes[join](",")});
                    }
                };
            params[has]("rotation") && (rot = params.rotation);
            var rotxy = (rot + E)[split](separator);
            if (!(rotxy.length - 1)) {
                rotxy = null;
            } else {
                rotxy[1] = +rotxy[1];
                rotxy[2] = +rotxy[2];
            }
            toFloat(rot) && o.rotate(0, true);
            for (var att in params) {
                if (params[has](att)) {
                    if (!availableAttrs[has](att)) {
                        continue;
                    }
                    var value = params[att];
                    attrs[att] = value;
                    switch (att) {
                        case "blur":
                            o.blur(value);
                            break;
                        case "rotation":
                            o.rotate(value, true);
                            break;
                        case "href":
                        case "title":
                        case "target":
                            var pn = node.parentNode;
                            if (lowerCase.call(pn.tagName) != "a") {
                                var hl = $("a");
                                pn.insertBefore(hl, node);
                                hl[appendChild](node);
                                pn = hl;
                            }
                            pn.setAttributeNS(o.paper.xlink, att, value);
                            break;
                        case "cursor":
                            node.style.cursor = value;
                            break;
                        case "clip-rect":
                            var rect = (value + E)[split](separator);
                            if (rect[length] == 4) {
                                o.clip && o.clip.parentNode.parentNode.removeChild(o.clip.parentNode);
                                var el = $("clipPath"),
                                    rc = $("rect");
                                el.id = "r" + (R._id++)[toString](36);
                                $(rc, {
                                    x: rect[0],
                                    y: rect[1],
                                    width: rect[2],
                                    height: rect[3]
                                });
                                el[appendChild](rc);
                                o.paper.defs[appendChild](el);
                                $(node, {"clip-path": "url(#" + el.id + ")"});
                                o.clip = rc;
                            }
                            if (!value) {
                                var clip = doc.getElementById(node.getAttribute("clip-path")[rp](/(^url\(#|\)$)/g, E));
                                clip && clip.parentNode.removeChild(clip);
                                $(node, {"clip-path": E});
                                delete o.clip;
                            }
                        break;
                        case "path":
                            if (o.type == "path") {
                                $(node, {d: value ? attrs.path = pathToAbsolute(value) : "M0,0"});
                            }
                            break;
                        case "width":
                            node[setAttribute](att, value);
                            if (attrs.fx) {
                                att = "x";
                                value = attrs.x;
                            } else {
                                break;
                            }
                        case "x":
                            if (attrs.fx) {
                                value = -attrs.x - (attrs.width || 0);
                            }
                        case "rx":
                            if (att == "rx" && o.type == "rect") {
                                break;
                            }
                        case "cx":
                            rotxy && (att == "x" || att == "cx") && (rotxy[1] += value - attrs[att]);
                            node[setAttribute](att, round(value));
                            o.pattern && updatePosition(o);
                            break;
                        case "height":
                            node[setAttribute](att, value);
                            if (attrs.fy) {
                                att = "y";
                                value = attrs.y;
                            } else {
                                break;
                            }
                        case "y":
                            if (attrs.fy) {
                                value = -attrs.y - (attrs.height || 0);
                            }
                        case "ry":
                            if (att == "ry" && o.type == "rect") {
                                break;
                            }
                        case "cy":
                            rotxy && (att == "y" || att == "cy") && (rotxy[2] += value - attrs[att]);
                            node[setAttribute](att, round(value));
                            o.pattern && updatePosition(o);
                            break;
                        case "r":
                            if (o.type == "rect") {
                                $(node, {rx: value, ry: value});
                            } else {
                                node[setAttribute](att, value);
                            }
                            break;
                        case "src":
                            if (o.type == "image") {
                                node.setAttributeNS(o.paper.xlink, "href", value);
                            }
                            break;
                        case "stroke-width":
                            node.style.strokeWidth = value;
                            // Need following line for Firefox
                            node[setAttribute](att, value);
                            if (attrs["stroke-dasharray"]) {
                                addDashes(o, attrs["stroke-dasharray"]);
                            }
                            break;
                        case "stroke-dasharray":
                            addDashes(o, value);
                            break;
                        case "translation":
                            var xy = (value + E)[split](separator);
                            xy[0] = +xy[0] || 0;
                            xy[1] = +xy[1] || 0;
                            if (rotxy) {
                                rotxy[1] += xy[0];
                                rotxy[2] += xy[1];
                            }
                            translate.call(o, xy[0], xy[1]);
                            break;
                        case "scale":
                            xy = (value + E)[split](separator);
                            o.scale(+xy[0] || 1, +xy[1] || +xy[0] || 1, isNaN(toFloat(xy[2])) ? null : +xy[2], isNaN(toFloat(xy[3])) ? null : +xy[3]);
                            break;
                        case fillString:
                            var isURL = (value + E).match(ISURL);
                            if (isURL) {
                                el = $("pattern");
                                var ig = $("image");
                                el.id = "r" + (R._id++)[toString](36);
                                $(el, {x: 0, y: 0, patternUnits: "userSpaceOnUse", height: 1, width: 1});
                                $(ig, {x: 0, y: 0});
                                ig.setAttributeNS(o.paper.xlink, "href", isURL[1]);
                                el[appendChild](ig);
 
                                var img = doc.createElement("img");
                                img.style.cssText = "position:absolute;left:-9999em;top-9999em";
                                img.onload = function () {
                                    $(el, {width: this.offsetWidth, height: this.offsetHeight});
                                    $(ig, {width: this.offsetWidth, height: this.offsetHeight});
                                    doc.body.removeChild(this);
                                    o.paper.safari();
                                };
                                doc.body[appendChild](img);
                                img.src = isURL[1];
                                o.paper.defs[appendChild](el);
                                node.style.fill = "url(#" + el.id + ")";
                                $(node, {fill: "url(#" + el.id + ")"});
                                o.pattern = el;
                                o.pattern && updatePosition(o);
                                break;
                            }
                            var clr = R.getRGB(value);
                            if (!clr.error) {
                                delete params.gradient;
                                delete attrs.gradient;
                                !R.is(attrs.opacity, "undefined") &&
                                    R.is(params.opacity, "undefined") &&
                                    $(node, {opacity: attrs.opacity});
                                !R.is(attrs["fill-opacity"], "undefined") &&
                                    R.is(params["fill-opacity"], "undefined") &&
                                    $(node, {"fill-opacity": attrs["fill-opacity"]});
                            } else if ((({circle: 1, ellipse: 1})[has](o.type) || (value + E).charAt() != "r") && addGradientFill(node, value, o.paper)) {
                                attrs.gradient = value;
                                attrs.fill = "none";
                                break;
                            }
                            clr[has]("o") && $(node, {"fill-opacity": clr.o / 100});
                        case "stroke":
                            clr = R.getRGB(value);
                            node[setAttribute](att, clr.hex);
                            att == "stroke" && clr[has]("o") && $(node, {"stroke-opacity": clr.o / 100});
                            break;
                        case "gradient":
                            (({circle: 1, ellipse: 1})[has](o.type) || (value + E).charAt() != "r") && addGradientFill(node, value, o.paper);
                            break;
                        case "opacity":
                        case "fill-opacity":
                            if (attrs.gradient) {
                                var gradient = doc.getElementById(node.getAttribute(fillString)[rp](/^url\(#|\)$/g, E));
                                if (gradient) {
                                    var stops = gradient.getElementsByTagName("stop");
                                    stops[stops[length] - 1][setAttribute]("stop-opacity", value);
                                }
                                break;
                            }
                        default:
                            att == "font-size" && (value = toInt(value, 10) + "px");
                            var cssrule = att[rp](/(\-.)/g, function (w) {
                                return upperCase.call(w.substring(1));
                            });
                            node.style[cssrule] = value;
                            // Need following line for Firefox
                            node[setAttribute](att, value);
                            break;
                    }
                }
            }
            
            tuneText(o, params);
            if (rotxy) {
                o.rotate(rotxy.join(S));
            } else {
                toFloat(rot) && o.rotate(rot, true);
            }
        };
        var leading = 1.2,
        tuneText = function (el, params) {
            if (el.type != "text" || !(params[has]("text") || params[has]("font") || params[has]("font-size") || params[has]("x") || params[has]("y"))) {
                return;
            }
            var a = el.attrs,
                node = el.node,
                fontSize = node.firstChild ? toInt(doc.defaultView.getComputedStyle(node.firstChild, E).getPropertyValue("font-size"), 10) : 10;
 
            if (params[has]("text")) {
                a.text = params.text;
                while (node.firstChild) {
                    node.removeChild(node.firstChild);
                }
                var texts = (params.text + E)[split]("\n");
                for (var i = 0, ii = texts[length]; i < ii; i++) if (texts[i]) {
                    var tspan = $("tspan");
                    i && $(tspan, {dy: fontSize * leading, x: a.x});
                    tspan[appendChild](doc.createTextNode(texts[i]));
                    node[appendChild](tspan);
                }
            } else {
                texts = node.getElementsByTagName("tspan");
                for (i = 0, ii = texts[length]; i < ii; i++) {
                    i && $(texts[i], {dy: fontSize * leading, x: a.x});
                }
            }
            $(node, {y: a.y});
            var bb = el.getBBox(),
                dif = a.y - (bb.y + bb.height / 2);
            dif && isFinite(dif) && $(node, {y: a.y + dif});
        },
        Element = function (node, svg) {
            var X = 0,
                Y = 0;
            this[0] = node;
            this.id = R._oid++;
            this.node = node;
            node.raphael = this;
            this.paper = svg;
            this.attrs = this.attrs || {};
            this.transformations = []; // rotate, translate, scale
            this._ = {
                tx: 0,
                ty: 0,
                rt: {deg: 0, cx: 0, cy: 0},
                sx: 1,
                sy: 1
            };
            !svg.bottom && (svg.bottom = this);
            this.prev = svg.top;
            svg.top && (svg.top.next = this);
            svg.top = this;
            this.next = null;
        };
        Element[proto].rotate = function (deg, cx, cy) {
            if (this.removed) {
                return this;
            }
            if (deg == null) {
                if (this._.rt.cx) {
                    return [this._.rt.deg, this._.rt.cx, this._.rt.cy][join](S);
                }
                return this._.rt.deg;
            }
            var bbox = this.getBBox();
            deg = (deg + E)[split](separator);
            if (deg[length] - 1) {
                cx = toFloat(deg[1]);
                cy = toFloat(deg[2]);
            }
            deg = toFloat(deg[0]);
            if (cx != null) {
                this._.rt.deg = deg;
            } else {
                this._.rt.deg += deg;
            }
            (cy == null) && (cx = null);
            this._.rt.cx = cx;
            this._.rt.cy = cy;
            cx = cx == null ? bbox.x + bbox.width / 2 : cx;
            cy = cy == null ? bbox.y + bbox.height / 2 : cy;
            if (this._.rt.deg) {
                this.transformations[0] = R.format("rotate({0} {1} {2})", this._.rt.deg, cx, cy);
                this.clip && $(this.clip, {transform: R.format("rotate({0} {1} {2})", -this._.rt.deg, cx, cy)});
            } else {
                this.transformations[0] = E;
                this.clip && $(this.clip, {transform: E});
            }
            $(this.node, {transform: this.transformations[join](S)});
            return this;
        };
        Element[proto].hide = function () {
            !this.removed && (this.node.style.display = "none");
            return this;
        };
        Element[proto].show = function () {
            !this.removed && (this.node.style.display = "");
            return this;
        };
        Element[proto].remove = function () {
            if (this.removed) {
                return;
            }
            tear(this, this.paper);
            this.node.parentNode.removeChild(this.node);
            for (var i in this) {
                delete this[i];
            }
            this.removed = true;
        };
        Element[proto].getBBox = function () {
            if (this.removed) {
                return this;
            }
            if (this.type == "path") {
                return pathDimensions(this.attrs.path);
            }
            if (this.node.style.display == "none") {
                this.show();
                var hide = true;
            }
            var bbox = {};
            try {
                bbox = this.node.getBBox();
            } catch(e) {
                // Firefox 3.0.x plays badly here
            } finally {
                bbox = bbox || {};
            }
            if (this.type == "text") {
                bbox = {x: bbox.x, y: Infinity, width: 0, height: 0};
                for (var i = 0, ii = this.node.getNumberOfChars(); i < ii; i++) {
                    var bb = this.node.getExtentOfChar(i);
                    (bb.y < bbox.y) && (bbox.y = bb.y);
                    (bb.y + bb.height - bbox.y > bbox.height) && (bbox.height = bb.y + bb.height - bbox.y);
                    (bb.x + bb.width - bbox.x > bbox.width) && (bbox.width = bb.x + bb.width - bbox.x);
                }
            }
            hide && this.hide();
            return bbox;
        };
        Element[proto].attr = function (name, value) {
            if (this.removed) {
                return this;
            }
            if (name == null) {
                var res = {};
                for (var i in this.attrs) if (this.attrs[has](i)) {
                    res[i] = this.attrs[i];
                }
                this._.rt.deg && (res.rotation = this.rotate());
                (this._.sx != 1 || this._.sy != 1) && (res.scale = this.scale());
                res.gradient && res.fill == "none" && (res.fill = res.gradient) && delete res.gradient;
                return res;
            }
            if (value == null && R.is(name, string)) {
                if (name == "translation") {
                    return translate.call(this);
                }
                if (name == "rotation") {
                    return this.rotate();
                }
                if (name == "scale") {
                    return this.scale();
                }
                if (name == fillString && this.attrs.fill == "none" && this.attrs.gradient) {
                    return this.attrs.gradient;
                }
                return this.attrs[name];
            }
            if (value == null && R.is(name, array)) {
                var values = {};
                for (var j = 0, jj = name.length; j < jj; j++) {
                    values[name[j]] = this.attr(name[j]);
                }
                return values;
            }
            if (value != null) {
                var params = {};
                params[name] = value;
                setFillAndStroke(this, params);
            } else if (name != null && R.is(name, "object")) {
                setFillAndStroke(this, name);
            }
            return this;
        };
        Element[proto].toFront = function () {
            if (this.removed) {
                return this;
            }
            this.node.parentNode[appendChild](this.node);
            var svg = this.paper;
            svg.top != this && tofront(this, svg);
            return this;
        };
        Element[proto].toBack = function () {
            if (this.removed) {
                return this;
            }
            if (this.node.parentNode.firstChild != this.node) {
                this.node.parentNode.insertBefore(this.node, this.node.parentNode.firstChild);
                toback(this, this.paper);
                var svg = this.paper;
            }
            return this;
        };
        Element[proto].insertAfter = function (element) {
            if (this.removed) {
                return this;
            }
            var node = element.node;
            if (node.nextSibling) {
                node.parentNode.insertBefore(this.node, node.nextSibling);
            } else {
                node.parentNode[appendChild](this.node);
            }
            insertafter(this, element, this.paper);
            return this;
        };
        Element[proto].insertBefore = function (element) {
            if (this.removed) {
                return this;
            }
            var node = element.node;
            node.parentNode.insertBefore(this.node, node);
            insertbefore(this, element, this.paper);
            return this;
        };
        Element[proto].blur = function (size) {
            // Experimental. No Safari support. Use it on your own risk.
            var t = this;
            if (+size !== 0) {
                var fltr = $("filter"),
                    blur = $("feGaussianBlur");
                t.attrs.blur = size;
                fltr.id = "r" + (R._id++)[toString](36);
                $(blur, {stdDeviation: +size || 1.5});
                fltr.appendChild(blur);
                t.paper.defs.appendChild(fltr);
                t._blur = fltr;
                $(t.node, {filter: "url(#" + fltr.id + ")"});
            } else {
                if (t._blur) {
                    t._blur.parentNode.removeChild(t._blur);
                    delete t._blur;
                    delete t.attrs.blur;
                }
                t.node.removeAttribute("filter");
            }
        };
        var theCircle = function (svg, x, y, r) {
            x = round(x);
            y = round(y);
            var el = $("circle");
            svg.canvas && svg.canvas[appendChild](el);
            var res = new Element(el, svg);
            res.attrs = {cx: x, cy: y, r: r, fill: "none", stroke: "#000"};
            res.type = "circle";
            $(el, res.attrs);
            return res;
        };
        var theRect = function (svg, x, y, w, h, r) {
            x = round(x);
            y = round(y);
            var el = $("rect");
            svg.canvas && svg.canvas[appendChild](el);
            var res = new Element(el, svg);
            res.attrs = {x: x, y: y, width: w, height: h, r: r || 0, rx: r || 0, ry: r || 0, fill: "none", stroke: "#000"};
            res.type = "rect";
            $(el, res.attrs);
            return res;
        };
        var theEllipse = function (svg, x, y, rx, ry) {
            x = round(x);
            y = round(y);
            var el = $("ellipse");
            svg.canvas && svg.canvas[appendChild](el);
            var res = new Element(el, svg);
            res.attrs = {cx: x, cy: y, rx: rx, ry: ry, fill: "none", stroke: "#000"};
            res.type = "ellipse";
            $(el, res.attrs);
            return res;
        };
        var theImage = function (svg, src, x, y, w, h) {
            var el = $("image");
            $(el, {x: x, y: y, width: w, height: h, preserveAspectRatio: "none"});
            el.setAttributeNS(svg.xlink, "href", src);
            svg.canvas && svg.canvas[appendChild](el);
            var res = new Element(el, svg);
            res.attrs = {x: x, y: y, width: w, height: h, src: src};
            res.type = "image";
            return res;
        };
        var theText = function (svg, x, y, text) {
            var el = $("text");
            $(el, {x: x, y: y, "text-anchor": "middle"});
            svg.canvas && svg.canvas[appendChild](el);
            var res = new Element(el, svg);
            res.attrs = {x: x, y: y, "text-anchor": "middle", text: text, font: availableAttrs.font, stroke: "none", fill: "#000"};
            res.type = "text";
            setFillAndStroke(res, res.attrs);
            return res;
        };
        var setSize = function (width, height) {
            this.width = width || this.width;
            this.height = height || this.height;
            this.canvas[setAttribute]("width", this.width);
            this.canvas[setAttribute]("height", this.height);
            return this;
        };
        var create = function () {
            var con = getContainer[apply](0, arguments),
                container = con && con.container,
                x = con.x,
                y = con.y,
                width = con.width,
                height = con.height;
            if (!container) {
                throw new Error("SVG container not found.");
            }
            var cnvs = $("svg");
            x = x || 0;
            y = y || 0;
            width = width || 512;
            height = height || 342;
            $(cnvs, {
                xmlns: "http://www.w3.org/2000/svg",
                version: 1.1,
                width: width,
                height: height
            });
            if (container == 1) {
                cnvs.style.cssText = "position:absolute;left:" + x + "px;top:" + y + "px";
                doc.body[appendChild](cnvs);
            } else {
                if (container.firstChild) {
                    container.insertBefore(cnvs, container.firstChild);
                } else {
                    container[appendChild](cnvs);
                }
            }
            container = new Paper;
            container.width = width;
            container.height = height;
            container.canvas = cnvs;
            plugins.call(container, container, R.fn);
            container.clear();
            return container;
        };
        Paper[proto].clear = function () {
            var c = this.canvas;
            while (c.firstChild) {
                c.removeChild(c.firstChild);
            }
            this.bottom = this.top = null;
            (this.desc = $("desc"))[appendChild](doc.createTextNode("Created with Rapha\xebl"));
            c[appendChild](this.desc);
            c[appendChild](this.defs = $("defs"));
        };
        Paper[proto].remove = function () {
            this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas);
            for (var i in this) {
                this[i] = removed(i);
            }
        };
    }

    // VML
    if (R.vml) {
        var map = {M: "m", L: "l", C: "c", Z: "x", m: "t", l: "r", c: "v", z: "x"},
            bites = /([clmz]),?([^clmz]*)/gi,
            val = /-?[^,\s-]+/g,
            coordsize = 1e3 + S + 1e3,
            zoom = 10,
            pathlike = {path: 1, rect: 1},
            path2vml = function (path) {
                var total =  /[ahqstv]/ig,
                    command = pathToAbsolute;
                (path + E).match(total) && (command = path2curve);
                total = /[clmz]/g;
                if (command == pathToAbsolute && !(path + E).match(total)) {
                    var res = (path + E)[rp](bites, function (all, command, args) {
                        var vals = [],
                            isMove = lowerCase.call(command) == "m",
                            res = map[command];
                        args[rp](val, function (value) {
                            if (isMove && vals[length] == 2) {
                                res += vals + map[command == "m" ? "l" : "L"];
                                vals = [];
                            }
                            vals[push](round(value * zoom));
                        });
                        return res + vals;
                    });
                    return res;
                }
                var pa = command(path), p, r;
                res = [];
                for (var i = 0, ii = pa[length]; i < ii; i++) {
                    p = pa[i];
                    r = lowerCase.call(pa[i][0]);
                    r == "z" && (r = "x");
                    for (var j = 1, jj = p[length]; j < jj; j++) {
                        r += round(p[j] * zoom) + (j != jj - 1 ? "," : E);
                    }
                    res[push](r);
                }
                return res[join](S);
            };
        
        R[toString] = function () {
            return  "Your browser doesn\u2019t support SVG. Falling down to VML.\nYou are running Rapha\xebl " + this.version;
        };
        thePath = function (pathString, vml) {
            var g = createNode("group");
            g.style.cssText = "position:absolute;left:0;top:0;width:" + vml.width + "px;height:" + vml.height + "px";
            g.coordsize = vml.coordsize;
            g.coordorigin = vml.coordorigin;
            var el = createNode("shape"), ol = el.style;
            ol.width = vml.width + "px";
            ol.height = vml.height + "px";
            el.coordsize = coordsize;
            el.coordorigin = vml.coordorigin;
            g[appendChild](el);
            var p = new Element(el, g, vml),
                attr = {fill: "none", stroke: "#000"};
            pathString && (attr.path = pathString);
            p.isAbsolute = true;
            p.type = "path";
            p.path = [];
            p.Path = E;
            setFillAndStroke(p, attr);
            vml.canvas[appendChild](g);
            return p;
        };
        setFillAndStroke = function (o, params) {
            o.attrs = o.attrs || {};
            var node = o.node,
                a = o.attrs,
                s = node.style,
                xy,
                newpath = (params.x != a.x || params.y != a.y || params.width != a.width || params.height != a.height || params.r != a.r) && o.type == "rect",
                res = o;
            
            for (var par in params) if (params[has](par)) {
                a[par] = params[par];
            }
            if (newpath) {
                a.path = rectPath(a.x, a.y, a.width, a.height, a.r);
                o.X = a.x;
                o.Y = a.y;
                o.W = a.width;
                o.H = a.height;
            }
            params.href && (node.href = params.href);
            params.title && (node.title = params.title);
            params.target && (node.target = params.target);
            params.cursor && (s.cursor = params.cursor);
            "blur" in params && o.blur(params.blur);
            if (params.path && o.type == "path" || newpath) {
                    node.path = path2vml(a.path);
            }
            if (params.rotation != null) {
                o.rotate(params.rotation, true);
            }
            if (params.translation) {
                xy = (params.translation + E)[split](separator);
                translate.call(o, xy[0], xy[1]);
                if (o._.rt.cx != null) {
                    o._.rt.cx +=+ xy[0];
                    o._.rt.cy +=+ xy[1];
                    o.setBox(o.attrs, xy[0], xy[1]);
                }
            }
            if (params.scale) {
                xy = (params.scale + E)[split](separator);
                o.scale(+xy[0] || 1, +xy[1] || +xy[0] || 1, +xy[2] || null, +xy[3] || null);
            }
            if ("clip-rect" in params) {
                var rect = (params["clip-rect"] + E)[split](separator);
                if (rect[length] == 4) {
                    rect[2] = +rect[2] + (+rect[0]);
                    rect[3] = +rect[3] + (+rect[1]);
                    var div = node.clipRect || doc.createElement("div"),
                        dstyle = div.style,
                        group = node.parentNode;
                    dstyle.clip = R.format("rect({1}px {2}px {3}px {0}px)", rect);
                    if (!node.clipRect) {
                        dstyle.position = "absolute";
                        dstyle.top = 0;
                        dstyle.left = 0;
                        dstyle.width = o.paper.width + "px";
                        dstyle.height = o.paper.height + "px";
                        group.parentNode.insertBefore(div, group);
                        div[appendChild](group);
                        node.clipRect = div;
                    }
                }
                if (!params["clip-rect"]) {
                    node.clipRect && (node.clipRect.style.clip = E);
                }
            }
            if (o.type == "image" && params.src) {
                node.src = params.src;
            }
            if (o.type == "image" && params.opacity) {
                node.filterOpacity = ms + ".Alpha(opacity=" + (params.opacity * 100) + ")";
                s.filter = (node.filterMatrix || E) + (node.filterOpacity || E);
            }
            params.font && (s.font = params.font);
            params["font-family"] && (s.fontFamily = '"' + params["font-family"][split](",")[0][rp](/^['"]+|['"]+$/g, E) + '"'); //'; //for readability 
            params["font-size"] && (s.fontSize = params["font-size"]);
            params["font-weight"] && (s.fontWeight = params["font-weight"]);
            params["font-style"] && (s.fontStyle = params["font-style"]);
            if (params.opacity != null || 
                params["stroke-width"] != null ||
                params.fill != null ||
                params.stroke != null ||
                params["stroke-width"] != null ||
                params["stroke-opacity"] != null ||
                params["fill-opacity"] != null ||
                params["stroke-dasharray"] != null ||
                params["stroke-miterlimit"] != null ||
                params["stroke-linejoin"] != null ||
                params["stroke-linecap"] != null) {
                node = o.shape || node;
                var fill = (node.getElementsByTagName(fillString) && node.getElementsByTagName(fillString)[0]),
                    newfill = false;
                !fill && (newfill = fill = createNode(fillString));
                if ("fill-opacity" in params || "opacity" in params) {
                    var opacity = ((+a["fill-opacity"] + 1 || 2) - 1) * ((+a.opacity + 1 || 2) - 1) * ((+R.getRGB(params.fill).o + 1 || 2) - 1);
                    opacity < 0 && (opacity = 0);
                    opacity > 1 && (opacity = 1);
                    fill.opacity = opacity;
                }
                params.fill && (fill.on = true);
                if (fill.on == null || params.fill == "none") {
                    fill.on = false;
                }
                if (fill.on && params.fill) {
                    var isURL = params.fill.match(ISURL);
                    if (isURL) {
                        fill.src = isURL[1];
                        fill.type = "tile";
                    } else {
                        fill.color = R.getRGB(params.fill).hex;
                        fill.src = E;
                        fill.type = "solid";
                        if (R.getRGB(params.fill).error && (res.type in {circle: 1, ellipse: 1} || (params.fill + E).charAt() != "r") && addGradientFill(res, params.fill)) {
                            a.fill = "none";
                            a.gradient = params.fill;
                        }
                    }
                }
                newfill && node[appendChild](fill);
                var stroke = (node.getElementsByTagName("stroke") && node.getElementsByTagName("stroke")[0]),
                newstroke = false;
                !stroke && (newstroke = stroke = createNode("stroke"));
                if ((params.stroke && params.stroke != "none") ||
                    params["stroke-width"] ||
                    params["stroke-opacity"] != null ||
                    params["stroke-dasharray"] ||
                    params["stroke-miterlimit"] ||
                    params["stroke-linejoin"] ||
                    params["stroke-linecap"]) {
                    stroke.on = true;
                }
                (params.stroke == "none" || stroke.on == null || params.stroke == 0 || params["stroke-width"] == 0) && (stroke.on = false);
                var strokeColor = R.getRGB(params.stroke);
                stroke.on && params.stroke && (stroke.color = strokeColor.hex);
                opacity = ((+a["stroke-opacity"] + 1 || 2) - 1) * ((+a.opacity + 1 || 2) - 1) * ((+strokeColor.o + 1 || 2) - 1);
                var width = (toFloat(params["stroke-width"]) || 1) * .75;
                opacity < 0 && (opacity = 0);
                opacity > 1 && (opacity = 1);
                params["stroke-width"] == null && (width = a["stroke-width"]);
                params["stroke-width"] && (stroke.weight = width);
                width && width < 1 && (opacity *= width) && (stroke.weight = 1);
                stroke.opacity = opacity;
                
                params["stroke-linejoin"] && (stroke.joinstyle = params["stroke-linejoin"] || "miter");
                stroke.miterlimit = params["stroke-miterlimit"] || 8;
                params["stroke-linecap"] && (stroke.endcap = params["stroke-linecap"] == "butt" ? "flat" : params["stroke-linecap"] == "square" ? "square" : "round");
                if (params["stroke-dasharray"]) {
                    var dasharray = {
                        "-": "shortdash",
                        ".": "shortdot",
                        "-.": "shortdashdot",
                        "-..": "shortdashdotdot",
                        ". ": "dot",
                        "- ": "dash",
                        "--": "longdash",
                        "- .": "dashdot",
                        "--.": "longdashdot",
                        "--..": "longdashdotdot"
                    };
                    stroke.dashstyle = dasharray[has](params["stroke-dasharray"]) ? dasharray[params["stroke-dasharray"]] : E;
                }
                newstroke && node[appendChild](stroke);
            }
            if (res.type == "text") {
                s = res.paper.span.style;
                a.font && (s.font = a.font);
                a["font-family"] && (s.fontFamily = a["font-family"]);
                a["font-size"] && (s.fontSize = a["font-size"]);
                a["font-weight"] && (s.fontWeight = a["font-weight"]);
                a["font-style"] && (s.fontStyle = a["font-style"]);
                res.node.string && (res.paper.span.innerHTML = (res.node.string + E)[rp](/</g, "&#60;")[rp](/&/g, "&#38;")[rp](/\n/g, "<br>"));
                res.W = a.w = res.paper.span.offsetWidth;
                res.H = a.h = res.paper.span.offsetHeight;
                res.X = a.x;
                res.Y = a.y + round(res.H / 2);
 
                // text-anchor emulationm
                switch (a["text-anchor"]) {
                    case "start":
                        res.node.style["v-text-align"] = "left";
                        res.bbx = round(res.W / 2);
                    break;
                    case "end":
                        res.node.style["v-text-align"] = "right";
                        res.bbx = -round(res.W / 2);
                    break;
                    default:
                        res.node.style["v-text-align"] = "center";
                    break;
                }
            }
        };
        addGradientFill = function (o, gradient) {
            o.attrs = o.attrs || {};
            var attrs = o.attrs,
                fill,
                type = "linear",
                fxfy = ".5 .5";
            o.attrs.gradient = gradient;
            gradient = (gradient + E)[rp](radial_gradient, function (all, fx, fy) {
                type = "radial";
                if (fx && fy) {
                    fx = toFloat(fx);
                    fy = toFloat(fy);
                    pow(fx - .5, 2) + pow(fy - .5, 2) > .25 && (fy = math.sqrt(.25 - pow(fx - .5, 2)) * ((fy > .5) * 2 - 1) + .5);
                    fxfy = fx + S + fy;
                }
                return E;
            });
            gradient = gradient[split](/\s*\-\s*/);
            if (type == "linear") {
                var angle = gradient.shift();
                angle = -toFloat(angle);
                if (isNaN(angle)) {
                    return null;
                }
            }
            var dots = parseDots(gradient);
            if (!dots) {
                return null;
            }
            o = o.shape || o.node;
            fill = o.getElementsByTagName(fillString)[0] || createNode(fillString);
            !fill.parentNode && o.appendChild(fill);
            if (dots[length]) {
                fill.on = true;
                fill.method = "none";
                fill.color = dots[0].color;
                fill.color2 = dots[dots[length] - 1].color;
                var clrs = [];
                for (var i = 0, ii = dots[length]; i < ii; i++) {
                    dots[i].offset && clrs[push](dots[i].offset + S + dots[i].color);
                }
                fill.colors && (fill.colors.value = clrs[length] ? clrs[join]() : "0% " + fill.color);
                if (type == "radial") {
                    fill.type = "gradientradial";
                    fill.focus = "100%";
                    fill.focussize = fxfy;
                    fill.focusposition = fxfy;
                } else {
                    fill.type = "gradient";
                    fill.angle = (270 - angle) % 360;
                }
            }
            return 1;
        };
        Element = function (node, group, vml) {
            var Rotation = 0,
                RotX = 0,
                RotY = 0,
                Scale = 1;
            this[0] = node;
            this.id = R._oid++;
            this.node = node;
            node.raphael = this;
            this.X = 0;
            this.Y = 0;
            this.attrs = {};
            this.Group = group;
            this.paper = vml;
            this._ = {
                tx: 0,
                ty: 0,
                rt: {deg:0},
                sx: 1,
                sy: 1
            };
            !vml.bottom && (vml.bottom = this);
            this.prev = vml.top;
            vml.top && (vml.top.next = this);
            vml.top = this;
            this.next = null;
        };
        Element[proto].rotate = function (deg, cx, cy) {
            if (this.removed) {
                return this;
            }
            if (deg == null) {
                if (this._.rt.cx) {
                    return [this._.rt.deg, this._.rt.cx, this._.rt.cy][join](S);
                }
                return this._.rt.deg;
            }
            deg = (deg + E)[split](separator);
            if (deg[length] - 1) {
                cx = toFloat(deg[1]);
                cy = toFloat(deg[2]);
            }
            deg = toFloat(deg[0]);
            if (cx != null) {
                this._.rt.deg = deg;
            } else {
                this._.rt.deg += deg;
            }
            cy == null && (cx = null);
            this._.rt.cx = cx;
            this._.rt.cy = cy;
            this.setBox(this.attrs, cx, cy);
            this.Group.style.rotation = this._.rt.deg;
            // gradient fix for rotation. TODO
            // var fill = (this.shape || this.node).getElementsByTagName(fillString);
            // fill = fill[0] || {};
            // var b = ((360 - this._.rt.deg) - 270) % 360;
            // !R.is(fill.angle, "undefined") && (fill.angle = b);
            return this;
        };
        Element[proto].setBox = function (params, cx, cy) {
            if (this.removed) {
                return this;
            }
            var gs = this.Group.style,
                os = (this.shape && this.shape.style) || this.node.style;
            params = params || {};
            for (var i in params) if (params[has](i)) {
                this.attrs[i] = params[i];
            }
            cx = cx || this._.rt.cx;
            cy = cy || this._.rt.cy;
            var attr = this.attrs,
                x,
                y,
                w,
                h;
            switch (this.type) {
                case "circle":
                    x = attr.cx - attr.r;
                    y = attr.cy - attr.r;
                    w = h = attr.r * 2;
                    break;
                case "ellipse":
                    x = attr.cx - attr.rx;
                    y = attr.cy - attr.ry;
                    w = attr.rx * 2;
                    h = attr.ry * 2;
                    break;
                case "image":
                    x = +attr.x;
                    y = +attr.y;
                    w = attr.width || 0;
                    h = attr.height || 0;
                    break;
                case "text":
                    this.textpath.v = ["m", round(attr.x), ", ", round(attr.y - 2), "l", round(attr.x) + 1, ", ", round(attr.y - 2)][join](E);
                    x = attr.x - round(this.W / 2);
                    y = attr.y - this.H / 2;
                    w = this.W;
                    h = this.H;
                    break;
                case "rect":
                case "path":
                    if (!this.attrs.path) {
                        x = 0;
                        y = 0;
                        w = this.paper.width;
                        h = this.paper.height;
                    } else {
                        var dim = pathDimensions(this.attrs.path);
                        x = dim.x;
                        y = dim.y;
                        w = dim.width;
                        h = dim.height;
                    }
                    break;
                default:
                    x = 0;
                    y = 0;
                    w = this.paper.width;
                    h = this.paper.height;
                    break;
            }
            cx = (cx == null) ? x + w / 2 : cx;
            cy = (cy == null) ? y + h / 2 : cy;
            var left = cx - this.paper.width / 2,
                top = cy - this.paper.height / 2, t;
            gs.left != (t = left + "px") && (gs.left = t);
            gs.top != (t = top + "px") && (gs.top = t);
            this.X = pathlike[has](this.type) ? -left : x;
            this.Y = pathlike[has](this.type) ? -top : y;
            this.W = w;
            this.H = h;
            if (pathlike[has](this.type)) {
                os.left != (t = -left * zoom + "px") && (os.left = t);
                os.top != (t = -top * zoom + "px") && (os.top = t);
            } else if (this.type == "text") {
                os.left != (t = -left + "px") && (os.left = t);
                os.top != (t = -top + "px") && (os.top = t);
            } else {
                gs.width != (t = this.paper.width + "px") && (gs.width = t);
                gs.height != (t = this.paper.height + "px") && (gs.height = t);
                os.left != (t = x - left + "px") && (os.left = t);
                os.top != (t = y - top + "px") && (os.top = t);
                os.width != (t = w + "px") && (os.width = t);
                os.height != (t = h + "px") && (os.height = t);
            }
        };
        Element[proto].hide = function () {
            !this.removed && (this.Group.style.display = "none");
            return this;
        };
        Element[proto].show = function () {
            !this.removed && (this.Group.style.display = "block");
            return this;
        };
        Element[proto].getBBox = function () {
            if (this.removed) {
                return this;
            }
            if (pathlike[has](this.type)) {
                return pathDimensions(this.attrs.path);
            }
            return {
                x: this.X + (this.bbx || 0),
                y: this.Y,
                width: this.W,
                height: this.H
            };
        };
        Element[proto].remove = function () {
            if (this.removed) {
                return;
            }
            tear(this, this.paper);
            this.node.parentNode.removeChild(this.node);
            this.Group.parentNode.removeChild(this.Group);
            this.shape && this.shape.parentNode.removeChild(this.shape);
            for (var i in this) {
                delete this[i];
            }
            this.removed = true;
        };
        Element[proto].attr = function (name, value) {
            if (this.removed) {
                return this;
            }
            if (name == null) {
                var res = {};
                for (var i in this.attrs) if (this.attrs[has](i)) {
                    res[i] = this.attrs[i];
                }
                this._.rt.deg && (res.rotation = this.rotate());
                (this._.sx != 1 || this._.sy != 1) && (res.scale = this.scale());
                res.gradient && res.fill == "none" && (res.fill = res.gradient) && delete res.gradient;
                return res;
            }
            if (value == null && R.is(name, string)) {
                if (name == "translation") {
                    return translate.call(this);
                }
                if (name == "rotation") {
                    return this.rotate();
                }
                if (name == "scale") {
                    return this.scale();
                }
                if (name == fillString && this.attrs.fill == "none" && this.attrs.gradient) {
                    return this.attrs.gradient;
                }
                return this.attrs[name];
            }
            if (this.attrs && value == null && R.is(name, array)) {
                var ii, values = {};
                for (i = 0, ii = name[length]; i < ii; i++) {
                    values[name[i]] = this.attr(name[i]);
                }
                return values;
            }
            var params;
            if (value != null) {
                params = {};
                params[name] = value;
            }
            value == null && R.is(name, "object") && (params = name);
            if (params) {
                if (params.text && this.type == "text") {
                    this.node.string = params.text;
                }
                setFillAndStroke(this, params);
                if (params.gradient && (({circle: 1, ellipse: 1})[has](this.type) || (params.gradient + E).charAt() != "r")) {
                    addGradientFill(this, params.gradient);
                }
                (!pathlike[has](this.type) || this._.rt.deg) && this.setBox(this.attrs);
            }
            return this;
        };
        Element[proto].toFront = function () {
            !this.removed && this.Group.parentNode[appendChild](this.Group);
            this.paper.top != this && tofront(this, this.paper);
            return this;
        };
        Element[proto].toBack = function () {
            if (this.removed) {
                return this;
            }
            if (this.Group.parentNode.firstChild != this.Group) {
                this.Group.parentNode.insertBefore(this.Group, this.Group.parentNode.firstChild);
                toback(this, this.paper);
            }
            return this;
        };
        Element[proto].insertAfter = function (element) {
            if (this.removed) {
                return this;
            }
            if (element.Group.nextSibling) {
                element.Group.parentNode.insertBefore(this.Group, element.Group.nextSibling);
            } else {
                element.Group.parentNode[appendChild](this.Group);
            }
            insertafter(this, element, this.paper);
            return this;
        };
        Element[proto].insertBefore = function (element) {
            if (this.removed) {
                return this;
            }
            element.Group.parentNode.insertBefore(this.Group, element.Group);
            insertbefore(this, element, this.paper);
            return this;
        };
        var blurregexp = / progid:\S+Blur\([^\)]+\)/g;
        Element[proto].blur = function (size) {
            var s = this.node.style,
                f = s.filter;
            f = f.replace(blurregexp, "");
            if (+size !== 0) {
                this.attrs.blur = size;
                s.filter = f + ms + ".Blur(pixelradius=" + (+size || 1.5) + ")";
                s.margin = Raphael.format("-{0}px 0 0 -{0}px", Math.round(+size || 1.5));
            } else {
                s.filter = f;
                s.margin = 0;
                delete this.attrs.blur;
            }
        };
 
        theCircle = function (vml, x, y, r) {
            var g = createNode("group"),
                o = createNode("oval"),
                ol = o.style;
            g.style.cssText = "position:absolute;left:0;top:0;width:" + vml.width + "px;height:" + vml.height + "px";
            g.coordsize = coordsize;
            g.coordorigin = vml.coordorigin;
            g[appendChild](o);
            var res = new Element(o, g, vml);
            res.type = "circle";
            setFillAndStroke(res, {stroke: "#000", fill: "none"});
            res.attrs.cx = x;
            res.attrs.cy = y;
            res.attrs.r = r;
            res.setBox({x: x - r, y: y - r, width: r * 2, height: r * 2});
            vml.canvas[appendChild](g);
            return res;
        };
        function rectPath(x, y, w, h, r) {
            if (r) {
                return R.format("M{0},{1}l{2},0a{3},{3},0,0,1,{3},{3}l0,{5}a{3},{3},0,0,1,{4},{3}l{6},0a{3},{3},0,0,1,{4},{4}l0,{7}a{3},{3},0,0,1,{3},{4}z", x + r, y, w - r * 2, r, -r, h - r * 2, r * 2 - w, r * 2 - h);
            } else {
                return R.format("M{0},{1}l{2},0,0,{3},{4},0z", x, y, w, h, -w);
            }
        }
        theRect = function (vml, x, y, w, h, r) {
            var path = rectPath(x, y, w, h, r),
                res = vml.path(path),
                a = res.attrs;
            res.X = a.x = x;
            res.Y = a.y = y;
            res.W = a.width = w;
            res.H = a.height = h;
            a.r = r;
            a.path = path;
            res.type = "rect";
            return res;
        };
        theEllipse = function (vml, x, y, rx, ry) {
            var g = createNode("group"),
                o = createNode("oval"),
                ol = o.style;
            g.style.cssText = "position:absolute;left:0;top:0;width:" + vml.width + "px;height:" + vml.height + "px";
            g.coordsize = coordsize;
            g.coordorigin = vml.coordorigin;
            g[appendChild](o);
            var res = new Element(o, g, vml);
            res.type = "ellipse";
            setFillAndStroke(res, {stroke: "#000"});
            res.attrs.cx = x;
            res.attrs.cy = y;
            res.attrs.rx = rx;
            res.attrs.ry = ry;
            res.setBox({x: x - rx, y: y - ry, width: rx * 2, height: ry * 2});
            vml.canvas[appendChild](g);
            return res;
        };
        theImage = function (vml, src, x, y, w, h) {
            var g = createNode("group"),
                o = createNode("image"),
                ol = o.style;
            g.style.cssText = "position:absolute;left:0;top:0;width:" + vml.width + "px;height:" + vml.height + "px";
            g.coordsize = coordsize;
            g.coordorigin = vml.coordorigin;
            o.src = src;
            g[appendChild](o);
            var res = new Element(o, g, vml);
            res.type = "image";
            res.attrs.src = src;
            res.attrs.x = x;
            res.attrs.y = y;
            res.attrs.w = w;
            res.attrs.h = h;
            res.setBox({x: x, y: y, width: w, height: h});
            vml.canvas[appendChild](g);
            return res;
        };
        theText = function (vml, x, y, text) {
            var g = createNode("group"),
                el = createNode("shape"),
                ol = el.style,
                path = createNode("path"),
                ps = path.style,
                o = createNode("textpath");
            g.style.cssText = "position:absolute;left:0;top:0;width:" + vml.width + "px;height:" + vml.height + "px";
            g.coordsize = coordsize;
            g.coordorigin = vml.coordorigin;
            path.v = R.format("m{0},{1}l{2},{1}", round(x * 10), round(y * 10), round(x * 10) + 1);
            path.textpathok = true;
            ol.width = vml.width;
            ol.height = vml.height;
            o.string = text + E;
            o.on = true;
            el[appendChild](o);
            el[appendChild](path);
            g[appendChild](el);
            var res = new Element(o, g, vml);
            res.shape = el;
            res.textpath = path;
            res.type = "text";
            res.attrs.text = text;
            res.attrs.x = x;
            res.attrs.y = y;
            res.attrs.w = 1;
            res.attrs.h = 1;
            setFillAndStroke(res, {font: availableAttrs.font, stroke: "none", fill: "#000"});
            res.setBox();
            vml.canvas[appendChild](g);
            return res;
        };
        setSize = function (width, height) {
            var cs = this.canvas.style;
            width == +width && (width += "px");
            height == +height && (height += "px");
            cs.width = width;
            cs.height = height;
            cs.clip = "rect(0 " + width + " " + height + " 0)";
            return this;
        };
        var createNode;
        doc.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
        try {
            !doc.namespaces.rvml && doc.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
            createNode = function (tagName) {
                return doc.createElement('<rvml:' + tagName + ' class="rvml">');
            };
        } catch (e) {
            createNode = function (tagName) {
                return doc.createElement('<' + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');
            };
        }
        create = function () {
            var con = getContainer[apply](0, arguments),
                container = con.container,
                height = con.height,
                s,
                width = con.width,
                x = con.x,
                y = con.y;
            if (!container) {
                throw new Error("VML container not found.");
            }
            var res = new Paper,
                c = res.canvas = doc.createElement("div"),
                cs = c.style;
            x = x || 0;
            y = y || 0;
            width = width || 512;
            height = height || 342;
            width == +width && (width += "px");
            height == +height && (height += "px");
            res.width = 1e3;
            res.height = 1e3;
            res.coordsize = zoom * 1e3 + S + zoom * 1e3;
            res.coordorigin = "0 0";
            res.span = doc.createElement("span");
            res.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;";
            c[appendChild](res.span);
            cs.cssText = R.format("width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden", width, height);
            if (container == 1) {
                doc.body[appendChild](c);
                cs.left = x + "px";
                cs.top = y + "px";
                cs.position = "absolute";
            } else {
                if (container.firstChild) {
                    container.insertBefore(c, container.firstChild);
                } else {
                    container[appendChild](c);
                }
            }
            plugins.call(res, res, R.fn);
            return res;
        };
        Paper[proto].clear = function () {
            this.canvas.innerHTML = E;
            this.span = doc.createElement("span");
            this.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;";
            this.canvas[appendChild](this.span);
            this.bottom = this.top = null;
        };
        Paper[proto].remove = function () {
            this.canvas.parentNode.removeChild(this.canvas);
            for (var i in this) {
                this[i] = removed(i);
            }
            return true;
        };
    }
 
    // rest
    // Safari or Chrome (WebKit) rendering bug workaround method
    if ((/^Apple|^Google/).test(win.navigator.vendor) && (!(win.navigator.userAgent.indexOf("Version/4.0") + 1) || win.navigator.platform.slice(0, 2) == "iP")) {
        Paper[proto].safari = function () {
            var rect = this.rect(-99, -99, this.width + 99, this.height + 99);
            win.setTimeout(function () {rect.remove();});
        };
    } else {
        Paper[proto].safari = function () {};
    }
 
    // Events
    var preventDefault = function () {
        this.returnValue = false;
    },
    preventTouch = function () {
        return this.originalEvent.preventDefault();
    },
    stopPropagation = function () {
        this.cancelBubble = true;
    },
    stopTouch = function () {
        return this.originalEvent.stopPropagation();
    },
    addEvent = (function () {
        if (doc.addEventListener) {
            return function (obj, type, fn, element) {
                var realName = supportsTouch && touchMap[type] ? touchMap[type] : type;
                var f = function (e) {
                    if (supportsTouch && touchMap[has](type)) {
                        for (var i = 0, ii = e.targetTouches && e.targetTouches.length; i < ii; i++) {
                            if (e.targetTouches[i].target == obj) {
                                var olde = e;
                                e = e.targetTouches[i];
                                e.originalEvent = olde;
                                e.preventDefault = preventTouch;
                                e.stopPropagation = stopTouch;
                                break;
                            }
                        }
                    }
                    return fn.call(element, e);
                };
                obj.addEventListener(realName, f, false);
                return function () {
                    obj.removeEventListener(realName, f, false);
                    return true;
                };
            };
        } else if (doc.attachEvent) {
            return function (obj, type, fn, element) {
                var f = function (e) {
                    e = e || win.event;
                    e.preventDefault = e.preventDefault || preventDefault;
                    e.stopPropagation = e.stopPropagation || stopPropagation;
                    return fn.call(element, e);
                };
                obj.attachEvent("on" + type, f);
                var detacher = function () {
                    obj.detachEvent("on" + type, f);
                    return true;
                };
                return detacher;
            };
        }
    })();
    for (var i = events[length]; i--;) {
        (function (eventName) {
            R[eventName] = Element[proto][eventName] = function (fn) {
                if (R.is(fn, "function")) {
                    this.events = this.events || [];
                    this.events.push({name: eventName, f: fn, unbind: addEvent(this.shape || this.node || doc, eventName, fn, this)});
                }
                return this;
            };
            R["un" + eventName] = Element[proto]["un" + eventName] = function (fn) {
                var events = this.events,
                    l = events[length];
                while (l--) if (events[l].name == eventName && events[l].f == fn) {
                    events[l].unbind();
                    events.splice(l, 1);
                    !events.length && delete this.events;
                    return this;
                }
                return this;
            };
        })(events[i]);
    }
    Element[proto].hover = function (f_in, f_out) {
        return this.mouseover(f_in).mouseout(f_out);
    };
    Element[proto].unhover = function (f_in, f_out) {
        return this.unmouseover(f_in).unmouseout(f_out);
    };
    Element[proto].drag = function (onmove, onstart, onend) {
        this._drag = {};
        var el = this.mousedown(function (e) {
            (e.originalEvent ? e.originalEvent : e).preventDefault();
            this._drag.x = e.clientX;
            this._drag.y = e.clientY;
            this._drag.id = e.identifier;
            onstart && onstart.call(this, e.clientX, e.clientY);
            Raphael.mousemove(move).mouseup(up);
        }),
            move = function (e) {
                var x = e.clientX,
                    y = e.clientY;
                if (supportsTouch) {
                    var i = e.touches.length,
                        touch;
                    while (i--) {
                        touch = e.touches[i];
                        if (touch.identifier == el._drag.id) {
                            x = touch.clientX;
                            y = touch.clientY;
                            (e.originalEvent ? e.originalEvent : e).preventDefault();
                            break;
                        }
                    }
                } else {
                    e.preventDefault();
                }
                onmove && onmove.call(el, x - el._drag.x, y - el._drag.y, x, y);
            },
            up = function () {
                el._drag = {};
                Raphael.unmousemove(move).unmouseup(up);
                onend && onend.call(el);
            };
        return this;
    };
    Paper[proto].circle = function (x, y, r) {
        return theCircle(this, x || 0, y || 0, r || 0);
    };
    Paper[proto].rect = function (x, y, w, h, r) {
        return theRect(this, x || 0, y || 0, w || 0, h || 0, r || 0);
    };
    Paper[proto].ellipse = function (x, y, rx, ry) {
        return theEllipse(this, x || 0, y || 0, rx || 0, ry || 0);
    };
    Paper[proto].path = function (pathString) {
        pathString && !R.is(pathString, string) && !R.is(pathString[0], array) && (pathString += E);
        return thePath(R.format[apply](R, arguments), this);
    };
    Paper[proto].image = function (src, x, y, w, h) {
        return theImage(this, src || "about:blank", x || 0, y || 0, w || 0, h || 0);
    };
    Paper[proto].text = function (x, y, text) {
        return theText(this, x || 0, y || 0, text || E);
    };
    Paper[proto].set = function (itemsArray) {
        arguments[length] > 1 && (itemsArray = Array[proto].splice.call(arguments, 0, arguments[length]));
        return new Set(itemsArray);
    };
    Paper[proto].setSize = setSize;
    Paper[proto].top = Paper[proto].bottom = null;
    Paper[proto].raphael = R;
    function x_y() {
        return this.x + S + this.y;
    }
    Element[proto].resetScale = function () {
        if (this.removed) {
            return this;
        }
        this._.sx = 1;
        this._.sy = 1;
        this.attrs.scale = "1 1";
    };
    Element[proto].scale = function (x, y, cx, cy) {
        if (this.removed) {
            return this;
        }
        if (x == null && y == null) {
            return {
                x: this._.sx,
                y: this._.sy,
                toString: x_y
            };
        }
        y = y || x;
        !+y && (y = x);
        var dx,
            dy,
            dcx,
            dcy,
            a = this.attrs;
        if (x != 0) {
            var bb = this.getBBox(),
                rcx = bb.x + bb.width / 2,
                rcy = bb.y + bb.height / 2,
                kx = x / this._.sx,
                ky = y / this._.sy;
            cx = (+cx || cx == 0) ? cx : rcx;
            cy = (+cy || cy == 0) ? cy : rcy;
            var dirx = ~~(x / math.abs(x)),
                diry = ~~(y / math.abs(y)),
                s = this.node.style,
                ncx = cx + (rcx - cx) * kx,
                ncy = cy + (rcy - cy) * ky;
            switch (this.type) {
                case "rect":
                case "image":
                    var neww = a.width * dirx * kx,
                        newh = a.height * diry * ky;
                    this.attr({
                        height: newh,
                        r: a.r * mmin(dirx * kx, diry * ky),
                        width: neww,
                        x: ncx - neww / 2,
                        y: ncy - newh / 2
                    });
                    break;
                case "circle":
                case "ellipse":
                    this.attr({
                        rx: a.rx * dirx * kx,
                        ry: a.ry * diry * ky,
                        r: a.r * mmin(dirx * kx, diry * ky),
                        cx: ncx,
                        cy: ncy
                    });
                    break;
                case "text":
                    this.attr({
                        x: ncx,
                        y: ncy
                    });
                    break;
                case "path":
                    var path = pathToRelative(a.path),
                        skip = true;
                    for (var i = 0, ii = path[length]; i < ii; i++) {
                        var p = path[i],
                            P0 = upperCase.call(p[0]);
                        if (P0 == "M" && skip) {
                            continue;
                        } else {
                            skip = false;
                        }
                        if (P0 == "A") {
                            p[path[i][length] - 2] *= kx;
                            p[path[i][length] - 1] *= ky;
                            p[1] *= dirx * kx;
                            p[2] *= diry * ky;
                            p[5] = +!(dirx + diry ? !+p[5] : +p[5]);
                        } else if (P0 == "H") {
                            for (var j = 1, jj = p[length]; j < jj; j++) {
                                p[j] *= kx;
                            }
                        } else if (P0 == "V") {
                            for (j = 1, jj = p[length]; j < jj; j++) {
                                p[j] *= ky;
                            }
                         } else {
                            for (j = 1, jj = p[length]; j < jj; j++) {
                                p[j] *= (j % 2) ? kx : ky;
                            }
                        }
                    }
                    var dim2 = pathDimensions(path);
                    dx = ncx - dim2.x - dim2.width / 2;
                    dy = ncy - dim2.y - dim2.height / 2;
                    path[0][1] += dx;
                    path[0][2] += dy;
                    this.attr({path: path});
                break;
            }
            if (this.type in {text: 1, image:1} && (dirx != 1 || diry != 1)) {
                if (this.transformations) {
                    this.transformations[2] = "scale("[concat](dirx, ",", diry, ")");
                    this.node[setAttribute]("transform", this.transformations[join](S));
                    dx = (dirx == -1) ? -a.x - (neww || 0) : a.x;
                    dy = (diry == -1) ? -a.y - (newh || 0) : a.y;
                    this.attr({x: dx, y: dy});
                    a.fx = dirx - 1;
                    a.fy = diry - 1;
                } else {
                    this.node.filterMatrix = ms + ".Matrix(M11="[concat](dirx,
                        ", M12=0, M21=0, M22=", diry,
                        ", Dx=0, Dy=0, sizingmethod='auto expand', filtertype='bilinear')");
                    s.filter = (this.node.filterMatrix || E) + (this.node.filterOpacity || E);
                }
            } else {
                if (this.transformations) {
                    this.transformations[2] = E;
                    this.node[setAttribute]("transform", this.transformations[join](S));
                    a.fx = 0;
                    a.fy = 0;
                } else {
                    this.node.filterMatrix = E;
                    s.filter = (this.node.filterMatrix || E) + (this.node.filterOpacity || E);
                }
            }
            a.scale = [x, y, cx, cy][join](S);
            this._.sx = x;
            this._.sy = y;
        }
        return this;
    };
    Element[proto].clone = function () {
        if (this.removed) {
            return null;
        }
        var attr = this.attr();
        delete attr.scale;
        delete attr.translation;
        return this.paper[this.type]().attr(attr);
    };
    var getPointAtSegmentLength = cacher(function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length) {
        var len = 0,
            old;
        for (var i = 0; i < 1.001; i+=.001) {
            var dot = R.findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, i);
            i && (len += pow(pow(old.x - dot.x, 2) + pow(old.y - dot.y, 2), .5));
            if (len >= length) {
                return dot;
            }
            old = dot;
        }
    }),
    getLengthFactory = function (istotal, subpath) {
        return function (path, length, onlystart) {
            path = path2curve(path);
            var x, y, p, l, sp = "", subpaths = {}, point,
                len = 0;
            for (var i = 0, ii = path.length; i < ii; i++) {
                p = path[i];
                if (p[0] == "M") {
                    x = +p[1];
                    y = +p[2];
                } else {
                    l = segmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
                    if (len + l > length) {
                        if (subpath && !subpaths.start) {
                            point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
                            sp += ["C", point.start.x, point.start.y, point.m.x, point.m.y, point.x, point.y];
                            if (onlystart) {return sp;}
                            subpaths.start = sp;
                            sp = ["M", point.x, point.y + "C", point.n.x, point.n.y, point.end.x, point.end.y, p[5], p[6]][join]();
                            len += l;
                            x = +p[5];
                            y = +p[6];
                            continue;
                        }
                        if (!istotal && !subpath) {
                            point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
                            return {x: point.x, y: point.y, alpha: point.alpha};
                        }
                    }
                    len += l;
                    x = +p[5];
                    y = +p[6];
                }
                sp += p;
            }
            subpaths.end = sp;
            point = istotal ? len : subpath ? subpaths : R.findDotsAtSegment(x, y, p[1], p[2], p[3], p[4], p[5], p[6], 1);
            point.alpha && (point = {x: point.x, y: point.y, alpha: point.alpha});
            return point;
        };
    },
    segmentLength = cacher(function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
        var old = {x: 0, y: 0},
            len = 0;
        for (var i = 0; i < 1.01; i+=.01) {
            var dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, i);
            i && (len += pow(pow(old.x - dot.x, 2) + pow(old.y - dot.y, 2), .5));
            old = dot;
        }
        return len;
    });
    var getTotalLength = getLengthFactory(1),
        getPointAtLength = getLengthFactory(),
        getSubpathsAtLength = getLengthFactory(0, 1);
    Element[proto].getTotalLength = function () {
        if (this.type != "path") {return;}
        if (this.node.getTotalLength) {
            return this.node.getTotalLength();
        }
        return getTotalLength(this.attrs.path);
    };
    Element[proto].getPointAtLength = function (length) {
        if (this.type != "path") {return;}
        return getPointAtLength(this.attrs.path, length);
    };
    Element[proto].getSubpath = function (from, to) {
        if (this.type != "path") {return;}
        if (math.abs(this.getTotalLength() - to) < 1e-6) {
            return getSubpathsAtLength(this.attrs.path, from).end;
        }
        var a = getSubpathsAtLength(this.attrs.path, to, 1);
        return from ? getSubpathsAtLength(a, from).end : a;
    };

    // animation easing formulas
    R.easing_formulas = {
        linear: function (n) {
            return n;
        },
        "<": function (n) {
            return pow(n, 3);
        },
        ">": function (n) {
            return pow(n - 1, 3) + 1;
        },
        "<>": function (n) {
            n = n * 2;
            if (n < 1) {
                return pow(n, 3) / 2;
            }
            n -= 2;
            return (pow(n, 3) + 2) / 2;
        },
        backIn: function (n) {
            var s = 1.70158;
            return n * n * ((s + 1) * n - s);
        },
        backOut: function (n) {
            n = n - 1;
            var s = 1.70158;
            return n * n * ((s + 1) * n + s) + 1;
        },
        elastic: function (n) {
            if (n == 0 || n == 1) {
                return n;
            }
            var p = .3,
                s = p / 4;
            return pow(2, -10 * n) * math.sin((n - s) * (2 * math.PI) / p) + 1;
        },
        bounce: function (n) {
            var s = 7.5625,
                p = 2.75,
                l;
            if (n < (1 / p)) {
                l = s * n * n;
            } else {
                if (n < (2 / p)) {
                    n -= (1.5 / p);
                    l = s * n * n + .75;
                } else {
                    if (n < (2.5 / p)) {
                        n -= (2.25 / p);
                        l = s * n * n + .9375;
                    } else {
                        n -= (2.625 / p);
                        l = s * n * n + .984375;
                    }
                }
            }
            return l;
        }
    };

    var animationElements = {length : 0},
        animation = function () {
            var Now = +new Date;
            for (var l in animationElements) if (l != "length" && animationElements[has](l)) {
                var e = animationElements[l];
                if (e.stop || e.el.removed) {
                    delete animationElements[l];
                    animationElements[length]--;
                    continue;
                }
                var time = Now - e.start,
                    ms = e.ms,
                    easing = e.easing,
                    from = e.from,
                    diff = e.diff,
                    to = e.to,
                    t = e.t,
                    prev = e.prev || 0,
                    that = e.el,
                    callback = e.callback,
                    set = {},
                    now;
                if (time < ms) {
                    var pos = R.easing_formulas[easing] ? R.easing_formulas[easing](time / ms) : time / ms;
                    for (var attr in from) if (from[has](attr)) {
                        switch (availableAnimAttrs[attr]) {
                            case "along":
                                now = pos * ms * diff[attr];
                                to.back && (now = to.len - now);
                                var point = getPointAtLength(to[attr], now);
                                that.translate(diff.sx - diff.x || 0, diff.sy - diff.y || 0);
                                diff.x = point.x;
                                diff.y = point.y;
                                that.translate(point.x - diff.sx, point.y - diff.sy);
                                to.rot && that.rotate(diff.r + point.alpha, point.x, point.y);
                                break;
                            case nu:
                                now = +from[attr] + pos * ms * diff[attr];
                                break;
                            case "colour":
                                now = "rgb(" + [
                                    upto255(round(from[attr].r + pos * ms * diff[attr].r)),
                                    upto255(round(from[attr].g + pos * ms * diff[attr].g)),
                                    upto255(round(from[attr].b + pos * ms * diff[attr].b))
                                ][join](",") + ")";
                                break;
                            case "path":
                                now = [];
                                for (var i = 0, ii = from[attr][length]; i < ii; i++) {
                                    now[i] = [from[attr][i][0]];
                                    for (var j = 1, jj = from[attr][i][length]; j < jj; j++) {
                                        now[i][j] = +from[attr][i][j] + pos * ms * diff[attr][i][j];
                                    }
                                    now[i] = now[i][join](S);
                                }
                                now = now[join](S);
                                break;
                            case "csv":
                                switch (attr) {
                                    case "translation":
                                        var x = diff[attr][0] * (time - prev),
                                            y = diff[attr][1] * (time - prev);
                                        t.x += x;
                                        t.y += y;
                                        now = x + S + y;
                                    break;
                                    case "rotation":
                                        now = +from[attr][0] + pos * ms * diff[attr][0];
                                        from[attr][1] && (now += "," + from[attr][1] + "," + from[attr][2]);
                                    break;
                                    case "scale":
                                        now = [+from[attr][0] + pos * ms * diff[attr][0], +from[attr][1] + pos * ms * diff[attr][1], (2 in to[attr] ? to[attr][2] : E), (3 in to[attr] ? to[attr][3] : E)][join](S);
                                    break;
                                    case "clip-rect":
                                        now = [];
                                        i = 4;
                                        while (i--) {
                                            now[i] = +from[attr][i] + pos * ms * diff[attr][i];
                                        }
                                    break;
                                }
                                break;
                        }
                        set[attr] = now;
                    }
                    that.attr(set);
                    that._run && that._run.call(that);
                } else {
                    if (to.along) {
                        point = getPointAtLength(to.along, to.len * !to.back);
                        that.translate(diff.sx - (diff.x || 0) + point.x - diff.sx, diff.sy - (diff.y || 0) + point.y - diff.sy);
                        to.rot && that.rotate(diff.r + point.alpha, point.x, point.y);
                    }
                    (t.x || t.y) && that.translate(-t.x, -t.y);
                    to.scale && (to.scale += E);
                    that.attr(to);
                    delete animationElements[l];
                    animationElements[length]--;
                    that.in_animation = null;
                    R.is(callback, "function") && callback.call(that);
                }
                e.prev = time;
            }
            R.svg && that && that.paper && that.paper.safari();
            animationElements[length] && win.setTimeout(animation);
        },
        upto255 = function (color) {
            return mmax(mmin(color, 255), 0);
        },
        translate = function (x, y) {
            if (x == null) {
                return {x: this._.tx, y: this._.ty, toString: x_y};
            }
            this._.tx += +x;
            this._.ty += +y;
            switch (this.type) {
                case "circle":
                case "ellipse":
                    this.attr({cx: +x + this.attrs.cx, cy: +y + this.attrs.cy});
                    break;
                case "rect":
                case "image":
                case "text":
                    this.attr({x: +x + this.attrs.x, y: +y + this.attrs.y});
                    break;
                case "path":
                    var path = pathToRelative(this.attrs.path);
                    path[0][1] += +x;
                    path[0][2] += +y;
                    this.attr({path: path});
                break;
            }
            return this;
        };
    Element[proto].animateWith = function (element, params, ms, easing, callback) {
        animationElements[element.id] && (params.start = animationElements[element.id].start);
        return this.animate(params, ms, easing, callback);
    };
    Element[proto].animateAlong = along();
    Element[proto].animateAlongBack = along(1);
    function along(isBack) {
        return function (path, ms, rotate, callback) {
            var params = {back: isBack};
            R.is(rotate, "function") ? (callback = rotate) : (params.rot = rotate);
            path && path.constructor == Element && (path = path.attrs.path);
            path && (params.along = path);
            return this.animate(params, ms, callback);
        };
    }
    Element[proto].onAnimation = function (f) {
        this._run = f || 0;
        return this;
    };
    Element[proto].animate = function (params, ms, easing, callback) {
        if (R.is(easing, "function") || !easing) {
            callback = easing || null;
        }
        var from = {},
            to = {},
            diff = {};
        for (var attr in params) if (params[has](attr)) {
            if (availableAnimAttrs[has](attr)) {
                from[attr] = this.attr(attr);
                (from[attr] == null) && (from[attr] = availableAttrs[attr]);
                to[attr] = params[attr];
                switch (availableAnimAttrs[attr]) {
                    case "along":
                        var len = getTotalLength(params[attr]),
                            point = getPointAtLength(params[attr], len * !!params.back),
                            bb = this.getBBox();
                        diff[attr] = len / ms;
                        diff.tx = bb.x;
                        diff.ty = bb.y;
                        diff.sx = point.x;
                        diff.sy = point.y;
                        to.rot = params.rot;
                        to.back = params.back;
                        to.len = len;
                        params.rot && (diff.r = toFloat(this.rotate()) || 0);
                        break;
                    case nu:
                        diff[attr] = (to[attr] - from[attr]) / ms;
                        break;
                    case "colour":
                        from[attr] = R.getRGB(from[attr]);
                        var toColour = R.getRGB(to[attr]);
                        diff[attr] = {
                            r: (toColour.r - from[attr].r) / ms,
                            g: (toColour.g - from[attr].g) / ms,
                            b: (toColour.b - from[attr].b) / ms
                        };
                        break;
                    case "path":
                        var pathes = path2curve(from[attr], to[attr]);
                        from[attr] = pathes[0];
                        var toPath = pathes[1];
                        diff[attr] = [];
                        for (var i = 0, ii = from[attr][length]; i < ii; i++) {
                            diff[attr][i] = [0];
                            for (var j = 1, jj = from[attr][i][length]; j < jj; j++) {
                                diff[attr][i][j] = (toPath[i][j] - from[attr][i][j]) / ms;
                            }
                        }
                        break;
                    case "csv":
                        var values = (params[attr] + E)[split](separator),
                            from2 = (from[attr] + E)[split](separator);
                        switch (attr) {
                            case "translation":
                                from[attr] = [0, 0];
                                diff[attr] = [values[0] / ms, values[1] / ms];
                            break;
                            case "rotation":
                                from[attr] = (from2[1] == values[1] && from2[2] == values[2]) ? from2 : [0, values[1], values[2]];
                                diff[attr] = [(values[0] - from[attr][0]) / ms, 0, 0];
                            break;
                            case "scale":
                                params[attr] = values;
                                from[attr] = (from[attr] + E)[split](separator);
                                diff[attr] = [(values[0] - from[attr][0]) / ms, (values[1] - from[attr][1]) / ms, 0, 0];
                            break;
                            case "clip-rect":
                                from[attr] = (from[attr] + E)[split](separator);
                                diff[attr] = [];
                                i = 4;
                                while (i--) {
                                    diff[attr][i] = (values[i] - from[attr][i]) / ms;
                                }
                            break;
                        }
                        to[attr] = values;
                }
            }
        }
        this.stop();
        this.in_animation = 1;
        animationElements[this.id] = {
            start: params.start || +new Date,
            ms: ms,
            easing: easing,
            from: from,
            diff: diff,
            to: to,
            el: this,
            callback: callback,
            t: {x: 0, y: 0}
        };
        ++animationElements[length] == 1 && animation();
        return this;
    };
    Element[proto].stop = function () {
        animationElements[this.id] && animationElements[length]--;
        delete animationElements[this.id];
        return this;
    };
    Element[proto].translate = function (x, y) {
        return this.attr({translation: x + " " + y});
    };
    Element[proto][toString] = function () {
        return "Rapha\xebl\u2019s object";
    };
    R.ae = animationElements;
 
    // Set
    var Set = function (items) {
        this.items = [];
        this[length] = 0;
        this.type = "set";
        if (items) {
            for (var i = 0, ii = items[length]; i < ii; i++) {
                if (items[i] && (items[i].constructor == Element || items[i].constructor == Set)) {
                    this[this.items[length]] = this.items[this.items[length]] = items[i];
                    this[length]++;
                }
            }
        }
    };
    Set[proto][push] = function () {
        var item,
            len;
        for (var i = 0, ii = arguments[length]; i < ii; i++) {
            item = arguments[i];
            if (item && (item.constructor == Element || item.constructor == Set)) {
                len = this.items[length];
                this[len] = this.items[len] = item;
                this[length]++;
            }
        }
        return this;
    };
    Set[proto].pop = function () {
        delete this[this[length]--];
        return this.items.pop();
    };
    for (var method in Element[proto]) if (Element[proto][has](method)) {
        Set[proto][method] = (function (methodname) {
            return function () {
                for (var i = 0, ii = this.items[length]; i < ii; i++) {
                    this.items[i][methodname][apply](this.items[i], arguments);
                }
                return this;
            };
        })(method);
    }
    Set[proto].attr = function (name, value) {
        if (name && R.is(name, array) && R.is(name[0], "object")) {
            for (var j = 0, jj = name[length]; j < jj; j++) {
                this.items[j].attr(name[j]);
            }
        } else {
            for (var i = 0, ii = this.items[length]; i < ii; i++) {
                this.items[i].attr(name, value);
            }
        }
        return this;
    };
    Set[proto].animate = function (params, ms, easing, callback) {
        (R.is(easing, "function") || !easing) && (callback = easing || null);
        var len = this.items[length],
            i = len,
            item,
            set = this,
            collector;
        callback && (collector = function () {
            !--len && callback.call(set);
        });
        easing = R.is(easing, string) ? easing : collector;
        item = this.items[--i].animate(params, ms, easing, collector);
        while (i--) {
            this.items[i].animateWith(item, params, ms, easing, collector);
        }
        return this;
    };
    Set[proto].insertAfter = function (el) {
        var i = this.items[length];
        while (i--) {
            this.items[i].insertAfter(el);
        }
        return this;
    };
    Set[proto].getBBox = function () {
        var x = [],
            y = [],
            w = [],
            h = [];
        for (var i = this.items[length]; i--;) {
            var box = this.items[i].getBBox();
            x[push](box.x);
            y[push](box.y);
            w[push](box.x + box.width);
            h[push](box.y + box.height);
        }
        x = mmin[apply](0, x);
        y = mmin[apply](0, y);
        return {
            x: x,
            y: y,
            width: mmax[apply](0, w) - x,
            height: mmax[apply](0, h) - y
        };
    };
    Set[proto].clone = function (s) {
        s = new Set;
        for (var i = 0, ii = this.items[length]; i < ii; i++) {
            s[push](this.items[i].clone());
        }
        return s;
    };

    R.registerFont = function (font) {
        if (!font.face) {
            return font;
        }
        this.fonts = this.fonts || {};
        var fontcopy = {
                w: font.w,
                face: {},
                glyphs: {}
            },
            family = font.face["font-family"];
        for (var prop in font.face) if (font.face[has](prop)) {
            fontcopy.face[prop] = font.face[prop];
        }
        if (this.fonts[family]) {
            this.fonts[family][push](fontcopy);
        } else {
            this.fonts[family] = [fontcopy];
        }
        if (!font.svg) {
            fontcopy.face["units-per-em"] = toInt(font.face["units-per-em"], 10);
            for (var glyph in font.glyphs) if (font.glyphs[has](glyph)) {
                var path = font.glyphs[glyph];
                fontcopy.glyphs[glyph] = {
                    w: path.w,
                    k: {},
                    d: path.d && "M" + path.d[rp](/[mlcxtrv]/g, function (command) {
                            return {l: "L", c: "C", x: "z", t: "m", r: "l", v: "c"}[command] || "M";
                        }) + "z"
                };
                if (path.k) {
                    for (var k in path.k) if (path[has](k)) {
                        fontcopy.glyphs[glyph].k[k] = path.k[k];
                    }
                }
            }
        }
        return font;
    };
    Paper[proto].getFont = function (family, weight, style, stretch) {
        stretch = stretch || "normal";
        style = style || "normal";
        weight = +weight || {normal: 400, bold: 700, lighter: 300, bolder: 800}[weight] || 400;
        if (!R.fonts) {
            return;
        }
        var font = R.fonts[family];
        if (!font) {
            var name = new RegExp("(^|\\s)" + family[rp](/[^\w\d\s+!~.:_-]/g, E) + "(\\s|$)", "i");
            for (var fontName in R.fonts) if (R.fonts[has](fontName)) {
                if (name.test(fontName)) {
                    font = R.fonts[fontName];
                    break;
                }
            }
        }
        var thefont;
        if (font) {
            for (var i = 0, ii = font[length]; i < ii; i++) {
                thefont = font[i];
                if (thefont.face["font-weight"] == weight && (thefont.face["font-style"] == style || !thefont.face["font-style"]) && thefont.face["font-stretch"] == stretch) {
                    break;
                }
            }
        }
        return thefont;
    };
    Paper[proto].print = function (x, y, string, font, size, origin) {
        origin = origin || "middle"; // baseline|middle
        var out = this.set(),
            letters = (string + E)[split](E),
            shift = 0,
            path = E,
            scale;
        R.is(font, string) && (font = this.getFont(font));
        if (font) {
            scale = (size || 16) / font.face["units-per-em"];
            var bb = font.face.bbox.split(separator),
                top = +bb[0],
                height = +bb[1] + (origin == "baseline" ? bb[3] - bb[1] + (+font.face.descent) : (bb[3] - bb[1]) / 2);
            for (var i = 0, ii = letters[length]; i < ii; i++) {
                var prev = i && font.glyphs[letters[i - 1]] || {},
                    curr = font.glyphs[letters[i]];
                shift += i ? (prev.w || font.w) + (prev.k && prev.k[letters[i]] || 0) : 0;
                curr && curr.d && out[push](this.path(curr.d).attr({fill: "#000", stroke: "none", translation: [shift, 0]}));
            }
            out.scale(scale, scale, top, height).translate(x - top, y - height);
        }
        return out;
    };

    var formatrg = /\{(\d+)\}/g;
    R.format = function (token, params) {
        var args = R.is(params, array) ? [0][concat](params) : arguments;
        token && R.is(token, string) && args[length] - 1 && (token = token[rp](formatrg, function (str, i) {
            return args[++i] == null ? E : args[i];
        }));
        return token || E;
    };
    R.ninja = function () {
        oldRaphael.was ? (Raphael = oldRaphael.is) : delete Raphael;
        return R;
    };
    R.el = Element[proto];
    return R;
})();
//    abc_tunebook.js: splits a string representing ABC Music Notation into individual tunes.
//    Copyright (C) 2010 Paul Rosen (paul at paulrosen dot net)
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.

/*global document, Raphael */
/*global window */

if (!window.ABCJS)
	window.ABCJS = {};

(function() {
ABCJS.numberOfTunes = function(abc) {
	var tunes = abc.split("\nX:");
	var num = tunes.length;
	if (num === 0) num = 1;
	return num;
};

ABCJS.TuneBook = function(book) {
	var This = this;
	var directives = "";
	book = window.ABCJS.parse.strip(book);
	var tunes = book.split("\nX:");
	for (var i = 1; i < tunes.length; i++)	// Put back the X: that we lost when splitting the tunes.
		tunes[i] = "X:" + tunes[i];
	// Keep track of the character position each tune starts with.
	var pos = 0;
	This.tunes = [];
	window.ABCJS.parse.each(tunes, function(tune) {
		This.tunes.push({ abc: tune, startPos: pos});
		pos += tune.length;
	});
	if (This.tunes.length > 1 && !window.ABCJS.parse.startsWith(This.tunes[0].abc, 'X:')) {	// If there is only one tune, the X: might be missing, otherwise assume the top of the file is "intertune"
		// There could be file-wide directives in this, if so, we need to insert it into each tune. We can probably get away with
		// just looking for file-wide directives here (before the first tune) and inserting them at the bottom of each tune, since
		// the tune is parsed all at once. The directives will be seen before the printer begins processing.
		var dir = This.tunes.shift();
		var arrDir = dir.abc.split('\n');
		window.ABCJS.parse.each(arrDir, function(line) {
			if (window.ABCJS.parse.startsWith(line, '%%'))
				directives += line + '\n';
		});
	}
	This.header = directives;

	// Now, the tune ends at a blank line, so truncate it if needed. There may be "intertune" stuff.
	window.ABCJS.parse.each(This.tunes, function(tune) {
		var end = tune.abc.indexOf('\n\n');
		if (end > 0)
			tune.abc = tune.abc.substring(0, end);
		tune.pure = tune.abc;
		tune.abc = directives + tune.abc;

		// for the user's convenience, parse and store the title separately. The title is between the first T: and the next \n
		var title = tune.pure.split("T:");
		if (title.length > 1) {
			title = title[1].split("\n");
			tune.title = title[0].replace(/^\s+|\s+$/g, '');;
		} else
			tune.title = "";

		// for the user's convenience, parse and store the id separately. The id is between the first X: and the next \n
		var id = tune.pure.substring(2,tune.pure.indexOf("\n"));
		tune.id = id.replace(/^\s+|\s+$/g, '');
	});
};

ABCJS.TuneBook.prototype.getTuneById = function (id) {
	for (var i = 0; i < this.tunes.length; i++) {
		if (this.tunes[i].id === id)
			return this.tunes[i];
	}
	return null;
};

ABCJS.TuneBook.prototype.getTuneByTitle = function (title) {
	for (var i = 0; i < this.tunes.length; i++) {
		if (this.tunes[i].title === title)
			return this.tunes[i];
	}
	return null;
};

function renderEngine(callback, output, abc, parserParams, renderParams) {
	var isArray = function(testObject) {
		return testObject && !(testObject.propertyIsEnumerable('length')) && typeof testObject === 'object' && typeof testObject.length === 'number';
	};

	// check and normalize input parameters
	if (output === undefined || abc === undefined)
		return;
	if (!isArray(output))
		output = [ output ];
	if (parserParams === undefined)
		parserParams = {};
	if (renderParams === undefined)
		renderParams = {};
	var currentTune = renderParams.startingTune ? renderParams.startingTune : 0;

	// parse the abc string
	var book = new ABCJS.TuneBook(abc);
	var abcParser = new window.ABCJS.parse.Parse();

	// output each tune, if it exists. Otherwise clear the div.
	for (var i = 0; i < output.length; i++) {
		var div = output[i];
		if (typeof(div) === "string")
			div = document.getElementById(div);
		if (div) {
			div.innerHTML = "";
			if (currentTune < book.tunes.length) {
				abcParser.parse(book.tunes[currentTune].abc, parserParams);
				var tune = abcParser.getTune();
				callback(div, tune);
			}
		}
		currentTune++;
	}
}

// A quick way to render a tune from javascript when interactivity is not required.
// This is used when a javascript routine has some abc text that it wants to render
// in a div or collection of divs. One tune or many can be rendered.
//
// parameters:
//		output: an array of divs that the individual tunes are rendered to.
//			If the number of tunes exceeds the number of divs in the array, then
//			only the first tunes are rendered. If the number of divs exceeds the number
//			of tunes, then the unused divs are cleared. The divs can be passed as either
//			elements or strings of ids. If ids are passed, then the div MUST exist already.
//			(if a single element is passed, then it is an implied array of length one.)
//			(if a null is passed for an element, or the element doesn't exist, then that tune is skipped.)
//		abc: text representing a tune or an entire tune book in ABC notation.
//		renderParams: hash of:
//			startingTune: an index, starting at zero, representing which tune to start rendering at.
//				(If this element is not present, then rendering starts at zero.)
//			width: 800 by default. The width in pixels of the output paper
ABCJS.renderAbc = function(output, abc, parserParams, printerParams, renderParams) {
	function callback(div, tune) {
		var width = renderParams ? renderParams.width ? renderParams.width : 600 : 600;
		var paper = Raphael(div, width, 400);
		if (printerParams === undefined)
			printerParams = {};
		var printer = new ABCJS.write.Printer(paper, printerParams);
		printer.printABC(tune);
	}

	renderEngine(callback, output, abc, parserParams, renderParams);
};

// A quick way to render a tune from javascript when interactivity is not required.
// This is used when a javascript routine has some abc text that it wants to render
// in a div or collection of divs. One tune or many can be rendered.
//
// parameters:
//		output: an array of divs that the individual tunes are rendered to.
//			If the number of tunes exceeds the number of divs in the array, then
//			only the first tunes are rendered. If the number of divs exceeds the number
//			of tunes, then the unused divs are cleared. The divs can be passed as either
//			elements or strings of ids. If ids are passed, then the div MUST exist already.
//			(if a single element is passed, then it is an implied array of length one.)
//			(if a null is passed for an element, or the element doesn't exist, then that tune is skipped.)
//		abc: text representing a tune or an entire tune book in ABC notation.
//		renderParams: hash of:
//			startingTune: an index, starting at zero, representing which tune to start rendering at.
//				(If this element is not present, then rendering starts at zero.)
ABCJS.renderMidi = function(output, abc, parserParams, midiParams, renderParams) {
	function callback(div, tune) {
		if (midiParams === undefined)
			midiParams = {};
		var midiwriter = new ABCJS.midi.MidiWriter(div, midiParams);
		midiwriter.writeABC(tune);
		midiParams.miditrack=midiwriter.getTrack();
		
	}

	renderEngine(callback, output, abc, parserParams, renderParams);
};
})();
//    abc_tune.js: a computer usable internal structure representing one tune.
//    Copyright (C) 2010 Paul Rosen (paul at paulrosen dot net)
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.

/*global window */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.data)
	window.ABCJS.data = {};

// This is the data for a single ABC tune. It is created and populated by the window.ABCJS.parse.Parse class.
window.ABCJS.data.Tune = function() {
	// The structure consists of a hash with the following two items:
	// metaText: a hash of {key, value}, where key is one of: title, author, rhythm, source, transcription, unalignedWords, etc...
	// tempo: { noteLength: number (e.g. .125), bpm: number }
	// lines: an array of elements, or one of the following:
	//
	// STAFF: array of elements
	// SUBTITLE: string
	//
	// TODO: actually, the start and end char should modify each part of the note type
	// The elements all have a type field and a start and end char
	// field. The rest of the fields depend on the type and are listed below:
	// REST: duration=1,2,4,8; chord: string
	// NOTE: accidental=none,dbl_flat,flat,natural,sharp,dbl_sharp
	//		pitch: "C" is 0. The numbers refer to the pitch letter.
	//		duration: .5 (sixteenth), .75 (dotted sixteenth), 1 (eighth), 1.5 (dotted eighth)
	//			2 (quarter), 3 (dotted quarter), 4 (half), 6 (dotted half) 8 (whole)
	//		chord: { name:chord, position: one of 'default', 'above', 'below' }
	//		end_beam = true or undefined if this is the last note in a beam.
	//		lyric: array of { syllable: xxx, divider: one of " -_" }
	//		startTie = true|undefined
	//		endTie = true|undefined
	//		startTriplet = num <- that is the number to print
	//		endTriplet = true|undefined (the last note of the triplet)
	// TODO: actually, decoration should be an array.
	//		decoration: upbow, downbow, accent
	// BAR: type=bar_thin, bar_thin_thick, bar_thin_thin, bar_thick_thin, bar_right_repeat, bar_left_repeat, bar_double_repeat
	//	number: 1 or 2: if it is the start of a first or second ending
	// CLEF: type=treble,bass
	// KEY-SIG:
	//		accidentals[]: { acc:sharp|dblsharp|natural|flat|dblflat,  note:a|b|c|d|e|f|g }
	// METER: type: common_time,cut_time,specified
	//		if specified, { num: 99, den: 99 }
	this.reset = function () {
		this.version = "1.0.1";
		this.media = "screen";
		this.metaText = {};
		this.formatting = {};
		this.lines = [];
		this.staffNum = 0;
		this.voiceNum = 0;
		this.lineNum = 0;
	};

	this.cleanUp = function(defWidth, defLength, barsperstaff, staffnonote) {
		this.closeLine();	// Close the last line.

		// Remove any blank lines
		var anyDeleted = false;
		var i, s, v;
		for (i = 0; i < this.lines.length; i++) {
			if (this.lines[i].staff !== undefined) {
				var hasAny = false;
				for (s = 0; s < this.lines[i].staff.length; s++) {
					if (this.lines[i].staff[s] === undefined) {
						anyDeleted = true;
						this.lines[i].staff[s] = null;
						//this.lines[i].staff[s] = { voices: []};	// TODO-PER: There was a part missing in the abc music. How should we recover?
					} else {
						for (v = 0; v < this.lines[i].staff[s].voices.length; v++) {
							if (this.lines[i].staff[s].voices[v] === undefined)
								this.lines[i].staff[s].voices[v] = [];	// TODO-PER: There was a part missing in the abc music. How should we recover?
							else
								if (this.containsNotes(this.lines[i].staff[s].voices[v])) hasAny = true;
						}
					}
				}
				if (!hasAny) {
					this.lines[i] = null;
					anyDeleted = true;
				}
			}
		}
		if (anyDeleted) {
			this.lines = window.ABCJS.parse.compact(this.lines);
			window.ABCJS.parse.each(this.lines, function(line) {
				if (line.staff)
					line.staff = window.ABCJS.parse.compact(line.staff);
			});
		}

		// if we exceeded the number of bars allowed on a line, then force a new line
		if (barsperstaff) {
			for (i = 0; i < this.lines.length; i++) {
				if (this.lines[i].staff !== undefined) {
					for (s = 0; s < this.lines[i].staff.length; s++) {
						for (v = 0; v < this.lines[i].staff[s].voices.length; v++) {
							var barNumThisLine = 0;
							for (var n = 0; n < this.lines[i].staff[s].voices[v].length; n++) {
								if (this.lines[i].staff[s].voices[v][n].el_type === 'bar') {
									barNumThisLine++;
									if (barNumThisLine >= barsperstaff) {
										// push everything else to the next line, if there is anything else,
										// and there is a next line. If there isn't a next line, create one.
										if (n < this.lines[i].staff[s].voices[v].length - 1) {
											if (i === this.lines.length - 1) {
												var cp = JSON.parse(JSON.stringify(this.lines[i]));
												this.lines.push(window.ABCJS.parse.clone(cp));
												for (var ss = 0; ss < this.lines[i+1].staff.length; ss++) {
													for (var vv = 0; vv < this.lines[i+1].staff[ss].voices.length; vv++)
														this.lines[i+1].staff[ss].voices[vv] = [];
												}
											}
											var startElement = n + 1;
											var section = this.lines[i].staff[s].voices[v].slice(startElement);
											this.lines[i].staff[s].voices[v] = this.lines[i].staff[s].voices[v].slice(0, startElement);
											this.lines[i+1].staff[s].voices[v] = section.concat(this.lines[i+1].staff[s].voices[v]);
										}
									}
								}
							}

						}
					}
				}
			}
		}

		// If we were passed staffnonote, then we want to get rid of all staffs that contain only rests.
		if (barsperstaff) {
			anyDeleted = false;
			for (i = 0; i < this.lines.length; i++) {
				if (this.lines[i].staff !== undefined) {
					for (s = 0; s < this.lines[i].staff.length; s++) {
						var keepThis = false;
						for (v = 0; v < this.lines[i].staff[s].voices.length; v++) {
							if (this.containsNotesStrict(this.lines[i].staff[s].voices[v])) {
								keepThis = true;
							}
						}
						if (!keepThis) {
							anyDeleted = true;
							this.lines[i].staff[s] = null;
						}
					}
				}
			}
			if (anyDeleted) {
				window.ABCJS.parse.each(this.lines, function(line) {
					if (line.staff)
						line.staff = window.ABCJS.parse.compact(line.staff);
				});
			}
		}

		// Remove the temporary working variables
		for (i = 0; i < this.lines.length; i++) {
			if (this.lines[i].staff) {
				for (s = 0; s < this.lines[i].staff.length; s++)
						delete this.lines[i].staff[s].workingClef;
			}
		}

		function cleanUpSlursInLine(line) {
			var currSlur = [];
			var x;
//			var lyr = null;	// TODO-PER: debugging.

			var addEndSlur = function(obj, num, chordPos) {
				if (currSlur[chordPos] === undefined) {
					// There isn't an exact match for note position, but we'll take any other open slur.
					for (x = 0; x < currSlur.length; x++) {
						if (currSlur[x] !== undefined) {
							chordPos = x;
							break;
						}
					}
					if (currSlur[chordPos] === undefined) {
						var offNum = chordPos*100;
						window.ABCJS.parse.each(obj.endSlur, function(x) { if (offNum === x) --offNum; });
						currSlur[chordPos] = [offNum];
					}
				}
				var slurNum;
				for (var i = 0; i < num; i++) {
					slurNum = currSlur[chordPos].pop();
					obj.endSlur.push(slurNum);
//					lyr.syllable += '<' + slurNum;	// TODO-PER: debugging
				}
				if (currSlur[chordPos].length === 0)
					delete currSlur[chordPos];
				return slurNum;
			};

			var addStartSlur = function(obj, num, chordPos, usedNums) {
				obj.startSlur = [];
				if (currSlur[chordPos] === undefined) {
					currSlur[chordPos] = [];
				}
				var nextNum = chordPos*100+1;
				for (var i = 0; i < num; i++) {
					if (usedNums) {
						window.ABCJS.parse.each(usedNums, function(x) { if (nextNum === x) ++nextNum; });
						window.ABCJS.parse.each(usedNums, function(x) { if (nextNum === x) ++nextNum; });
						window.ABCJS.parse.each(usedNums, function(x) { if (nextNum === x) ++nextNum; });
					}
					window.ABCJS.parse.each(currSlur[chordPos], function(x) { if (nextNum === x) ++nextNum; });
					window.ABCJS.parse.each(currSlur[chordPos], function(x) { if (nextNum === x) ++nextNum; });

					currSlur[chordPos].push(nextNum);
					obj.startSlur.push({ label: nextNum });
//					lyr.syllable += ' ' + nextNum + '>';	// TODO-PER:debugging
					nextNum++;
				}
			};

			for (var i = 0; i < line.length; i++) {
				var el = line[i];
//				if (el.lyric === undefined)	// TODO-PER: debugging
//					el.lyric = [{ divider: '-' }];	// TODO-PER: debugging
//				lyr = el.lyric[0];	// TODO-PER: debugging
//				lyr.syllable = '';	// TODO-PER: debugging
				if (el.el_type === 'note') {
					if (el.gracenotes) {
						for (var g = 0; g < el.gracenotes.length; g++) {
							if (el.gracenotes[g].endSlur) {
								var gg = el.gracenotes[g].endSlur;
								el.gracenotes[g].endSlur = [];
								for (var ggg = 0; ggg < gg; ggg++)
									addEndSlur(el.gracenotes[g], 1, 20);
							}
							if (el.gracenotes[g].startSlur) {
								x = el.gracenotes[g].startSlur;
								addStartSlur(el.gracenotes[g], x, 20);
							}
						}
					}
					if (el.endSlur) {
						x = el.endSlur;
						el.endSlur = [];
						addEndSlur(el, x, 0);
					}
					if (el.startSlur) {
						x = el.startSlur;
						addStartSlur(el, x, 0);
					}
					if (el.pitches) {
						var usedNums = [];
						for (var p = 0; p < el.pitches.length; p++) {
							if (el.pitches[p].endSlur) {
								var k = el.pitches[p].endSlur;
								el.pitches[p].endSlur = [];
								for (var j = 0; j < k; j++) {
									var slurNum = addEndSlur(el.pitches[p], 1, p+1);
									usedNums.push(slurNum);
								}
							}
						}
						for (p = 0; p < el.pitches.length; p++) {
							if (el.pitches[p].startSlur) {
								x = el.pitches[p].startSlur;
								addStartSlur(el.pitches[p], x, p+1, usedNums);
							}
						}
						// Correct for the weird gracenote case where ({g}a) should match.
						// The end slur was already assigned to the note, and needs to be moved to the first note of the graces.
						if (el.gracenotes && el.pitches[0].endSlur && el.pitches[0].endSlur[0] === 100 && el.pitches[0].startSlur) {
							if (el.gracenotes[0].endSlur)
								el.gracenotes[0].endSlur.push(el.pitches[0].startSlur[0].label);
							else
								el.gracenotes[0].endSlur = [el.pitches[0].startSlur[0].label];
							if (el.pitches[0].endSlur.length === 1)
								delete el.pitches[0].endSlur;
							else if (el.pitches[0].endSlur[0] === 100)
								el.pitches[0].endSlur.shift();
							else if (el.pitches[0].endSlur[el.pitches[0].endSlur.length-1] === 100)
								el.pitches[0].endSlur.pop();
							if (currSlur[1].length === 1)
								delete currSlur[1];
							else
								currSlur[1].pop();
						}
					}
				}
			}
		}

		// TODO-PER: This could be done faster as we go instead of as the last step.
		function fixClefPlacement(el) {
			window.ABCJS.parse.parseKeyVoice.fixClef(el);
			//if (el.el_type === 'clef') {
//				var min = -2;
//				var max = 5;
//				switch(el.type) {
//					case 'treble+8':
//					case 'treble-8':
//						break;
//					case 'bass':
//					case 'bass+8':
//					case 'bass-8':
//						el.verticalPos = 20 + el.verticalPos; min += 6; max += 6;
//						break;
//					case 'tenor':
//					case 'tenor+8':
//					case 'tenor-8':
//						el.verticalPos = - el.verticalPos; min = -40; max = 40;
////						el.verticalPos+=2; min += 6; max += 6;
//						break;
//					case 'alto':
//					case 'alto+8':
//					case 'alto-8':
//						el.verticalPos = - el.verticalPos; min = -40; max = 40;
////						el.verticalPos-=2; min += 4; max += 4;
//						break;
//				}
//				if (el.verticalPos < min) {
//					while (el.verticalPos < min)
//						el.verticalPos += 7;
//				} else if (el.verticalPos > max) {
//					while (el.verticalPos > max)
//						el.verticalPos -= 7;
//				}
			//}
		}

		for (this.lineNum = 0; this.lineNum < this.lines.length; this.lineNum++) {
			if (this.lines[this.lineNum].staff) for (this.staffNum = 0; this.staffNum < this.lines[this.lineNum].staff.length; this.staffNum++) {
				if (this.lines[this.lineNum].staff[this.staffNum].clef)
					fixClefPlacement(this.lines[this.lineNum].staff[this.staffNum].clef);
				for (this.voiceNum = 0; this.voiceNum < this.lines[this.lineNum].staff[this.staffNum].voices.length; this.voiceNum++) {
//					var el = this.getLastNote();
//					if (el) el.end_beam = true;
					cleanUpSlursInLine(this.lines[this.lineNum].staff[this.staffNum].voices[this.voiceNum]);
					for (var j = 0; j < this.lines[this.lineNum].staff[this.staffNum].voices[this.voiceNum].length; j++)
						if (this.lines[this.lineNum].staff[this.staffNum].voices[this.voiceNum][j].el_type === 'clef')
							fixClefPlacement(this.lines[this.lineNum].staff[this.staffNum].voices[this.voiceNum][j]);
				}
			}
		}

		if (!this.formatting.pagewidth)
			this.formatting.pagewidth = defWidth;
		if (!this.formatting.pageheight)
			this.formatting.pageheight = defLength;

		// Remove temporary variables that the outside doesn't need to know about
		delete this.staffNum;
		delete this.voiceNum;
		delete this.lineNum;
		delete this.potentialStartBeam;
		delete this.potentialEndBeam;
		delete this.vskipPending;
	};

	this.reset();

	this.getLastNote = function() {
		if (this.lines[this.lineNum] && this.lines[this.lineNum].staff && this.lines[this.lineNum].staff[this.staffNum] &&
			this.lines[this.lineNum].staff[this.staffNum].voices[this.voiceNum]) {
			for (var i = this.lines[this.lineNum].staff[this.staffNum].voices[this.voiceNum].length-1; i >= 0; i--) {
				var el = this.lines[this.lineNum].staff[this.staffNum].voices[this.voiceNum][i];
				if (el.el_type === 'note') {
					return el;
				}
			}
		}
		return null;
	};

	this.addTieToLastNote = function() {
		// TODO-PER: if this is a chord, which note?
		var el = this.getLastNote();
		if (el && el.pitches && el.pitches.length > 0) {
			el.pitches[0].startTie = {};
			return true;
		}
		return false;
	};

	this.getDuration = function(el) {
		if (el.duration) return el.duration;
		//if (el.pitches && el.pitches.length > 0) return el.pitches[0].duration;
		return 0;
	};

	this.closeLine = function() {
		if (this.potentialStartBeam && this.potentialEndBeam) {
			this.potentialStartBeam.startBeam = true;
			this.potentialEndBeam.endBeam = true;
		}
		delete this.potentialStartBeam;
		delete this.potentialEndBeam;
	};

	this.appendElement = function(type, startChar, endChar, hashParams)
	{
		var This = this;
		var pushNote = function(hp) {
			if (hp.pitches !== undefined) {
				var mid = This.lines[This.lineNum].staff[This.staffNum].workingClef.verticalPos;
				window.ABCJS.parse.each(hp.pitches, function(p) { p.verticalPos = p.pitch - mid; });
			}
			if (hp.gracenotes !== undefined) {
				var mid2 = This.lines[This.lineNum].staff[This.staffNum].workingClef.verticalPos;
				window.ABCJS.parse.each(hp.gracenotes, function(p) { p.verticalPos = p.pitch - mid2; });
			}
			This.lines[This.lineNum].staff[This.staffNum].voices[This.voiceNum].push(hp);
		};
		hashParams.el_type = type;
		if (startChar !== null)
			hashParams.startChar = startChar;
		if (endChar !== null)
			hashParams.endChar = endChar;
		var endBeamHere = function() {
			This.potentialStartBeam.startBeam = true;
			hashParams.endBeam = true;
			delete This.potentialStartBeam;
			delete This.potentialEndBeam;
		};
		var endBeamLast = function() {
			if (This.potentialStartBeam !== undefined && This.potentialEndBeam !== undefined) {	// Do we have a set of notes to beam?
				This.potentialStartBeam.startBeam = true;
				This.potentialEndBeam.endBeam = true;
			}
			delete This.potentialStartBeam;
			delete This.potentialEndBeam;
		};
		if (type === 'note') { // && (hashParams.rest !== undefined || hashParams.end_beam === undefined)) {
			// Now, add the startBeam and endBeam where it is needed.
			// end_beam is already set on the places where there is a forced end_beam. We'll remove that here after using that info.
			// this.potentialStartBeam either points to null or the start beam.
			// this.potentialEndBeam either points to null or the start beam.
			// If we have a beam break (note is longer than a quarter, or an end_beam is on this element), then set the beam if we have one.
			// reset the variables for the next notes.
			var dur = This.getDuration(hashParams);
			if (dur >= 0.25) {	// The beam ends on the note before this.
				endBeamLast();
			} else if (hashParams.force_end_beam_last && This.potentialStartBeam !== undefined) {
				endBeamLast();
			} else if (hashParams.end_beam && This.potentialStartBeam !== undefined) {	// the beam is forced to end on this note, probably because of a space in the ABC
				if (hashParams.rest === undefined)
					endBeamHere();
				else
					endBeamLast();
			} else if (hashParams.rest === undefined) {	// this a short note and we aren't about to end the beam
				if (This.potentialStartBeam === undefined) {	// We aren't collecting notes for a beam, so start here.
					if (!hashParams.end_beam) {
						This.potentialStartBeam = hashParams;
						delete This.potentialEndBeam;
					}
				} else {
					This.potentialEndBeam = hashParams;	// Continue the beaming, look for the end next note.
				}
			}

			//  end_beam goes on rests and notes which precede rests _except_ when a rest (or set of adjacent rests) has normal notes on both sides (no spaces)
//			if (hashParams.rest !== undefined)
//			{
//				hashParams.end_beam = true;
//				var el2 = this.getLastNote();
//				if (el2) el2.end_beam = true;
//				// TODO-PER: implement exception mentioned in the comment.
//			}
		} else {	// It's not a note, so there definitely isn't beaming after it.
			endBeamLast();
		}
		delete hashParams.end_beam;	// We don't want this temporary variable hanging around.
		delete hashParams.force_end_beam_last;	// We don't want this temporary variable hanging around.
		pushNote(hashParams);
	};

	this.appendStartingElement = function(type, startChar, endChar, hashParams2)
	{
		// If we're in the middle of beaming, then end the beam.
		this.closeLine();

		// We only ever want implied naturals the first time.
		var impliedNaturals;
		if (type === 'key') {
			impliedNaturals = hashParams2.impliedNaturals;
			delete hashParams2.impliedNaturals;
		}

		// Clone the object because it will be sticking around for the next line and we don't want the extra fields in it.
		var hashParams = window.ABCJS.parse.clone(hashParams2);

		// If this is a clef type, then we replace the working clef on the line. This is kept separate from
		// the clef in case there is an inline clef field. We need to know what the current position for
		// the note is.
		if (type === 'clef')
			this.lines[this.lineNum].staff[this.staffNum].workingClef = hashParams;

		// If this is the first item in this staff, then we might have to initialize the staff, first.
		if (this.lines[this.lineNum].staff.length <= this.staffNum) {
			this.lines[this.lineNum].staff[this.staffNum] = {};
			this.lines[this.lineNum].staff[this.staffNum].clef = window.ABCJS.parse.clone(this.lines[this.lineNum].staff[0].clef);
			this.lines[this.lineNum].staff[this.staffNum].key = window.ABCJS.parse.clone(this.lines[this.lineNum].staff[0].key);
			this.lines[this.lineNum].staff[this.staffNum].meter = window.ABCJS.parse.clone(this.lines[this.lineNum].staff[0].meter);
			this.lines[this.lineNum].staff[this.staffNum].workingClef = window.ABCJS.parse.clone(this.lines[this.lineNum].staff[0].workingClef);
			this.lines[this.lineNum].staff[this.staffNum].voices = [[]];
		}

		// These elements should not be added twice, so if the element exists on this line without a note or bar before it, just replace the staff version.
		var voice = this.lines[this.lineNum].staff[this.staffNum].voices[this.voiceNum];
		for (var i = 0; i < voice.length; i++) {
			if (voice[i].el_type === 'note' || voice[i].el_type === 'bar') {
				hashParams.el_type = type;
				hashParams.startChar = startChar;
				hashParams.endChar = endChar;
				if (impliedNaturals)
					hashParams.accidentals = impliedNaturals.concat(hashParams.accidentals);
				voice.push(hashParams);
				return;
			}
			if (voice[i].el_type === type) {
				hashParams.el_type = type;
				hashParams.startChar = startChar;
				hashParams.endChar = endChar;
				if (impliedNaturals)
					hashParams.accidentals = impliedNaturals.concat(hashParams.accidentals);
				voice[i] = hashParams;
				return;
			}
		}
		// We didn't see either that type or a note, so replace the element to the staff.
		this.lines[this.lineNum].staff[this.staffNum][type] = hashParams2;
	};

	this.getNumLines = function() {
		return this.lines.length;
	};

	this.pushLine = function(hash) {
		if (this.vskipPending) {
			hash.vskip = this.vskipPending;
			delete this.vskipPending;
		}
		this.lines.push(hash);
	};

	this.addSubtitle = function(str) {
		this.pushLine({subtitle: str});
	};

	this.addSpacing = function(num) {
		this.vskipPending = num;
	};

	this.addNewPage = function(num) {
		this.pushLine({newpage: num});
	};

	this.addSeparator = function(spaceAbove, spaceBelow, lineLength) {
		this.pushLine({separator: {spaceAbove: spaceAbove, spaceBelow: spaceBelow, lineLength: lineLength}});
	};

	this.addText = function(str) {
		this.pushLine({text: str});
	};

	this.addCentered = function(str) {
		this.pushLine({text: [{text: str, center: true }]});
	};

	this.containsNotes = function(voice) {
		for (var i = 0; i < voice.length; i++) {
			if (voice[i].el_type === 'note' || voice[i].el_type === 'bar')
				return true;
		}
		return false;
	};

	this.containsNotesStrict = function(voice) {
		for (var i = 0; i < voice.length; i++) {
			if (voice[i].el_type === 'note' && voice[i].rest === undefined)
				return true;
		}
		return false;
	};

//	anyVoiceContainsNotes: function(line) {
//		for (var i = 0; i < line.staff.voices.length; i++) {
//			if (this.containsNotes(line.staff.voices[i]))
//				return true;
//		}
//		return false;
//	},

	this.startNewLine = function(params) {
		// If the pointed to line doesn't exist, just create that. If the line does exist, but doesn't have any music on it, just use it.
		// If it does exist and has music, then increment the line number. If the new element doesn't exist, create it.
		var This = this;
		this.closeLine();	// Close the previous line.
		var createVoice = function(params) {
			This.lines[This.lineNum].staff[This.staffNum].voices[This.voiceNum] = [];
			if (This.isFirstLine(This.lineNum)) {
				if (params.name) {if (!This.lines[This.lineNum].staff[This.staffNum].title) This.lines[This.lineNum].staff[This.staffNum].title = [];This.lines[This.lineNum].staff[This.staffNum].title[This.voiceNum] = params.name;}
			} else {
				if (params.subname) {if (!This.lines[This.lineNum].staff[This.staffNum].title) This.lines[This.lineNum].staff[This.staffNum].title = [];This.lines[This.lineNum].staff[This.staffNum].title[This.voiceNum] = params.subname;}
			}
			if (params.style)
				This.appendElement('style', null, null, {head: params.style});
			if (params.stem)
				This.appendElement('stem', null, null, {direction: params.stem});
			else if (This.voiceNum > 0) {
				if (This.lines[This.lineNum].staff[This.staffNum].voices[0]!== undefined) {
					var found = false;
					for (var i = 0; i < This.lines[This.lineNum].staff[This.staffNum].voices[0].length; i++) {
						if (This.lines[This.lineNum].staff[This.staffNum].voices[0].el_type === 'stem')
							found = true;
					}
					if (!found) {
						var stem = { el_type: 'stem', direction: 'up' };
						This.lines[This.lineNum].staff[This.staffNum].voices[0].splice(0,0,stem);
					}
				}
				This.appendElement('stem', null, null, {direction: 'down'});
			}
			if (params.scale)
				This.appendElement('scale', null, null, { size: params.scale} );
		};
		var createStaff = function(params) {
			This.lines[This.lineNum].staff[This.staffNum] = {voices: [ ], clef: params.clef, key: params.key, workingClef: params.clef };
			if (params.vocalfont) This.lines[This.lineNum].staff[This.staffNum].vocalfont = params.vocalfont;
			if (params.bracket) This.lines[This.lineNum].staff[This.staffNum].bracket = params.bracket;
			if (params.brace) This.lines[This.lineNum].staff[This.staffNum].brace = params.brace;
			if (params.connectBarLines) This.lines[This.lineNum].staff[This.staffNum].connectBarLines = params.connectBarLines;
			createVoice(params);
			// Some stuff just happens for the first voice
			if (params.part)
				This.appendElement('part', params.startChar, params.endChar, {title: params.part});
			if (params.meter !== undefined) This.lines[This.lineNum].staff[This.staffNum].meter = params.meter;
		};
		var createLine = function(params) {
			This.lines[This.lineNum] = {staff: []};
			createStaff(params);
		};
		if (this.lines[this.lineNum] === undefined) createLine(params);
		else if (this.lines[this.lineNum].staff === undefined) {
			this.lineNum++;
			this.startNewLine(params);
		} else if (this.lines[this.lineNum].staff[this.staffNum] === undefined) createStaff(params);
		else if (this.lines[this.lineNum].staff[this.staffNum].voices[this.voiceNum] === undefined) createVoice(params);
		else if (!this.containsNotes(this.lines[this.lineNum].staff[this.staffNum].voices[this.voiceNum])) return;
		else {
			this.lineNum++;
			this.startNewLine(params);
		}
	};

	this.hasBeginMusic = function() {
		return this.lines.length > 0;
	};

	this.isFirstLine = function(index) {
		for (var i = index-1; i >= 0; i--) {
			if (this.lines[i].staff !== undefined) return false;
		}
		return true;
	};

	this.getCurrentVoice = function() {
		if (this.lines[this.lineNum] !== undefined && this.lines[this.lineNum].staff[this.staffNum] !== undefined && this.lines[this.lineNum].staff[this.staffNum].voices[this.voiceNum] !== undefined)
			return this.lines[this.lineNum].staff[this.staffNum].voices[this.voiceNum];
		else return null;
	};

	this.setCurrentVoice = function(staffNum, voiceNum) {
		this.staffNum = staffNum;
		this.voiceNum = voiceNum;
		for (var i = 0; i < this.lines.length; i++) {
			if (this.lines[i].staff) {
				if (this.lines[i].staff[staffNum] === undefined || this.lines[i].staff[staffNum].voices[voiceNum] === undefined ||
					!this.containsNotes(this.lines[i].staff[staffNum].voices[voiceNum] )) {
					this.lineNum =  i;
					return;
				}
			}
		}
		this.lineNum =  i;
	};

	this.addMetaText = function(key, value) {
		if (this.metaText[key] === undefined)
			this.metaText[key] = value;
		else
			this.metaText[key] += "\n" + value;
	};

	this.addMetaTextArray = function(key, value) {
		if (this.metaText[key] === undefined)
			this.metaText[key] = [value];
		else
			this.metaText[key].push(value);
	};
	this.addMetaTextObj = function(key, value) {
		this.metaText[key] = value;
	};
};
/*global window, document, setTimeout */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.midi)
	window.ABCJS.midi = {};

(function() {
function setAttributes(elm, attrs){
  for(var attr in attrs)
    if (attrs.hasOwnProperty(attr))
      elm.setAttribute(attr, attrs[attr]);
  return elm;
}

//TODO-PER: put this back in when the MIDIPlugin works again.
//window.oldunload = window.onbeforeunload;
//window.onbeforeunload = function() {
//    if (window.oldunload)
//        window.oldunload();
//  if (typeof(MIDIPlugin) !== "undefined" && MIDIPlugin) { // PER: take care of crash in IE 8
//    MIDIPlugin.closePlugin();
//  }
//};


function Midi() {
  this.trackstrings="";
  this.trackcount = 0;
  this.noteOnAndChannel = "%90";
  this.miditimedivision=480*7;
}

Midi.prototype.setTempo = function (qpm) {
  if (this.trackcount===0) {
    this.startTrack();
    this.track+="%00%FF%51%03"+toHex(Math.round(60000000/qpm),6);    
    this.endTrack();
  }
};

Midi.prototype.startTrack = function () {
  this.track = "";
  this.silencelength = 0;
  this.trackcount++;
  this.first=true;
  if (this.instrument) {
    this.setInstrument(this.instrument);
  }
};

Midi.prototype.endTrack = function () {
  var tracklength = toHex(this.track.length/3+4,8);
  this.track = "MTrk"+tracklength+ // track header
  this.track +  
  '%00%FF%2F%00'; // track end
  this.trackstrings += this.track;
};

Midi.prototype.setInstrument = function (number) {
	if (this.track)
	  this.track = "%00%C0"+toHex(number,2)+this.track;
	else
		this.track = "%00%C0"+toHex(number,2);
  this.instrument=number;
};

Midi.prototype.setChannel = function (number) {
	this.channel=number - 1;
	//this.channel=10;
	this.noteOnAndChannel = "%9" + this.channel.toString(16);
};

Midi.prototype.startNote = function (pitch, loudness) {
  this.track+=toDurationHex(this.silencelength); // only need to shift by amount of silence (if there is any)
  this.silencelength = 0;
  if (this.first) {
    this.first = false;
    this.track+=this.noteOnAndChannel;
  }
  this.track += "%"+pitch.toString(16)+"%"+loudness; //note
};

Midi.prototype.endNote = function (pitch, length) {
  this.track += toDurationHex(length); //duration
  this.track += "%"+pitch.toString(16)+"%00";//end note
};

Midi.prototype.addRest = function (length) {
  this.silencelength += length;
};

Midi.prototype.embed = function(parent, noplayer) {
  
  //"MThd%00%00%00%06%00%01"+toHex(this.trackcount,4)+"%01%e0"+ // header
  //"MThd%00%00%00%06%00%01"+toHex(this.trackcount,4)+toHex(this.miditimedivision,0)+ // header
  // HERE WE HAVE TO CHANGE THE HEADER TO MAKE THE TIME DIVISION MATCH.
  var data="data:audio/midi,"+ "MThd%00%00%00%06%00%01"+toHex(this.trackcount,4)+toHex(this.miditimedivision,4)+ // header
  this.trackstrings;
  
//  $('#dwnmidifile').attr({href:data});
  
  var link = setAttributes(document.createElement('a'), {
    href: data
    });  
  link.innerHTML = "Click right button and select 'save link as' to download the midi file";
  parent.insertBefore(link,parent.firstChild);


  if (noplayer) return;

  var embed = setAttributes(document.createElement('embed'), {
    src : data,
	type : 'video/quicktime',
	controller : 'true',
	autoplay : 'false', 
	loop : 'false',
	enablejavascript: 'true',
	style:'display:block; height: 20px;'
	});
 
 /* quitando el lector*/
 //parent.insertBefore(embed,parent.firstChild);
};

// s is assumed to be of even length
function encodeHex(s) {
  var ret = "";
  for (var i=0; i<s.length; i+=2) {
    ret += "%";
    ret += s.substr(i,2);
  }
  return ret;
}

function toHex(n, padding) {
  var s = n.toString(16);
  while (s.length<padding) {
    s="0"+s;
  }
  return encodeHex(s);
}

function toDurationHex(n) {
  var res = 0;
  var a = [];

  // cut up into 7 bit chunks;
  while (n!==0) {
    a.push(n & 0x7F);
    n = n>>7;
  }

  // join the 7 bit chunks together, all but last chunk get leading 1
  for (var i=a.length-1;i>=0;i--) {
    res = res << 8;
    var bits = a[i];
    if (i!==0) {
      bits = bits | 0x80;
    }
    res = res | bits;
  }

  var padding = res.toString(16).length;
  padding += padding%2;

  return toHex(res, padding);
}

ABCJS.midi.MidiWriter = function(parent, options) {
  options = options || {};
  this.parent = parent;
  this.scale = [0,2,4,5,7,9,11];
  this.restart = {line:0, staff:0, voice:0, pos:0};
  this.visited = {};
  this.multiplier =1;
  this.next = null;
  this.qpm = options.qpm || 100;
  this.program = options.program || 2;
  this.noteOnAndChannel = "%90";
  this.javamidi = options.type ==="java" || false;
  this.listeners = [];
  this.transpose = 0;	// PER
  this.miditrack = {};
  
  
};

ABCJS.midi.MidiWriter.prototype.addListener = function(listener) {
  this.listeners.push(listener);
};

ABCJS.midi.MidiWriter.prototype.notifySelect = function (abcelem) {
  for (var i=0; i<this.listeners.length;i++) {
    this.listeners[i].notifySelect(abcelem.abselem);
  }
};

ABCJS.midi.MidiWriter.prototype.getMark = function() {
  return {line:this.line, staff:this.staff, 
	  voice:this.voice, pos:this.pos};
};

ABCJS.midi.MidiWriter.prototype.getMarkString = function(mark) {
  mark = mark || this;
  return "line"+mark.line+"staff"+mark.staff+ 
	  "voice"+mark.voice+"pos"+mark.pos;
};

ABCJS.midi.MidiWriter.prototype.goToMark = function(mark) {
  this.line=mark.line;
  this.staff=mark.staff;
  this.voice=mark.voice;
  this.pos=mark.pos;
};

ABCJS.midi.MidiWriter.prototype.markVisited = function() {
  this.lastmark = this.getMarkString();
  this.visited[this.lastmark] = true;
};

ABCJS.midi.MidiWriter.prototype.isVisited = function() {
  if (this.visited[this.getMarkString()]) return true;
  return false;
};

ABCJS.midi.MidiWriter.prototype.setJumpMark = function(mark) {
  this.visited[this.lastmark] = mark;
};

ABCJS.midi.MidiWriter.prototype.getJumpMark = function() {
  return this.visited[this.getMarkString()];
};

ABCJS.midi.MidiWriter.prototype.getLine = function() {
  return this.abctune.lines[this.line];
};

ABCJS.midi.MidiWriter.prototype.getStaff = function() {
  try {
  return this.getLine().staff[this.staff];
  } catch (e) {

  }
};

ABCJS.midi.MidiWriter.prototype.getVoice = function() {
  return this.getStaff().voices[this.voice];
};

ABCJS.midi.MidiWriter.prototype.getElem = function() {
  return this.getVoice()[this.pos];
};

ABCJS.midi.MidiWriter.prototype.getTrack = function() {
  return this.miditrack;
};

ABCJS.midi.MidiWriter.prototype.writeABC = function(abctune) {
  try {
    this.midi = (this.javamidi) ? new MidiProxy(new JavaMidi(this), new Midi()) : new Midi();
    this.baraccidentals = [];
    this.abctune = abctune;
    // CREO QUE AQUI ESTA EL PROBLEMA DE LA SINCRO!!
    this.baseduration = this.midi.miditimedivision*4; // nice and divisible, equals 1 whole note  

	//alert(abctune.formatting.midi.program);

	  // PER: add global transposition.
	  if (abctune.formatting.midi && abctune.formatting.midi.transpose)
		  this.transpose = abctune.formatting.midi.transpose;

	  // PER: changed format of the global midi commands from the parser. Using the new definition here.
    if (abctune.formatting.midi && abctune.formatting.midi.program && abctune.formatting.midi.program.program) {
      this.midi.setInstrument(abctune.formatting.midi.program.program);
      alert(abctune.formatting.midi.program.program);
    } else {
      this.midi.setInstrument(this.program);
      //alert(this.program);
      //this.midi.setInstrument(115);
    }
    if (abctune.formatting.midi && abctune.formatting.midi.channel) {
      this.midi.setChannel(abctune.formatting.midi.channel);
      
    }
	else{
		// Set Channel for percussion !
		this.midi.setChannel(10);
	}

	
    if (abctune.metaText.tempo) {
      var duration = 1/4;
      if (abctune.metaText.tempo.duration) {
		duration = abctune.metaText.tempo.duration[0];
      }
      var bpm = 60;
      if (abctune.metaText.tempo.bpm) {
		bpm = abctune.metaText.tempo.bpm;
      }
      this.qpm = bpm*duration*4;
      
    } 
    this.midi.setTempo(this.qpm);
    
    // visit each voice completely in turn
    // "problematic" because it means visiting only one staff+voice for each line each time
    this.staffcount=1; // we'll know the actual number once we enter the code
    for(this.staff=0;this.staff<this.staffcount;this.staff++) {
      this.voicecount=1;
      for(this.voice=0;this.voice<this.voicecount;this.voice++) {
	this.midi.startTrack();
	this.restart = {line:0, staff:this.staff, voice:this.voice, pos:0};
	this.next= null;
	for(this.line=0; this.line<abctune.lines.length; this.line++) {
	  var abcline = abctune.lines[this.line];
	  if (this.getLine().staff) {
	    this.writeABCLine();
	  }
	}
	this.midi.endTrack();
      }
    }
    
    
    this.midi.embed(this.parent);
    data="MThd%00%00%00%06%00%01"+toHex(this.midi.trackcount,4)+toHex(this.midi.miditimedivision,4)+ this.midi.trackstrings;
    this.miditrack=data.replace(/%/g, '');
    
  } catch (e) {
    this.parent.innerHTML="Couldn't write midi: "+e;
  }
};

ABCJS.midi.MidiWriter.prototype.writeABCLine = function() {
  this.staffcount = this.getLine().staff.length;
  this.voicecount = this.getStaff().voices.length;
  this.setKeySignature(this.getStaff().key);
  this.writeABCVoiceLine();
};

ABCJS.midi.MidiWriter.prototype.writeABCVoiceLine = function () {
  this.pos=0;
  while (this.pos<this.getVoice().length) {
    this.writeABCElement(this.getElem());
    if (this.next) {
      this.goToMark(this.next);
      this.next = null;
      if (!this.getLine().staff) return;
    } else {
      this.pos++;
    }
  }
};

ABCJS.midi.MidiWriter.prototype.writeABCElement = function(elem) {
  var foo;
  switch (elem.el_type) {
  case "note":
    this.writeNote(elem);
    break;
    
  case "key":
    this.setKeySignature(elem);
    break;
  case "bar":
    this.handleBar(elem);
	  break;
  case "meter":
  case "clef":
    break;
  default:
    
  }
  
};

ABCJS.midi.MidiWriter.prototype.writeNote = function(elem) {

  if (elem.startTriplet){
	
	  if(elem.mid_nbr)  var numerator=elem.mid_nbr; 
	  else 				var numerator=4;
	 
	  if (elem.startTriplet === 2){
		  this.multiplier = 3/2;
		  //this.multiplier = numerator/3;
	  }
	  else if(elem.startTriplet === 3 && numerator===4){		  
		  this.multiplier = 2/3;		  
	  }
	  else{
	    this.multiplier= numerator/elem.startTriplet;	    
	    
	}
  }

// DOESN'T SYNCHRONIZE VERY WELL WHEN THERE ARE ODD SUBDIVISIONS
  var mididuration = elem.duration*this.baseduration*this.multiplier;
  
  
  if (elem.pitches) {
    var midipitches = [];
    for (var i=0; i<elem.pitches.length; i++) {
      var note = elem.pitches[i];
      var pitch= note.pitch;
      if (note.accidental) {
	switch(note.accidental) { // change that pitch (not other octaves) for the rest of the bar
	case "sharp": 
	  this.baraccidentals[pitch]=1; break;
	case "flat": 
	  this.baraccidentals[pitch]=-1; break;
	case "natural":
	  this.baraccidentals[pitch]=0; break;
		case "dblsharp":
			this.baraccidentals[pitch]=2; break;
		case "dblflat":
			this.baraccidentals[pitch]=-2; break;
	}
      }
      
      midipitches[i] = 60 + 12*this.extractOctave(pitch)+this.scale[this.extractNote(pitch)];
      
      if (this.baraccidentals[pitch]!==undefined) {
	midipitches[i] += this.baraccidentals[pitch];
      } else { // use normal accidentals
	midipitches[i] += this.accidentals[this.extractNote(pitch)];
      }
    midipitches[i] += this.transpose;	// PER
      
      this.midi.startNote(midipitches[i], 64, elem);

      if (note.startTie) {
		this.tieduration=mididuration;
      } 
    }

    for (i=0; i<elem.pitches.length; i++) {
      var note = elem.pitches[i];
      var pitch= note.pitch+this.transpose;	// PER
      if (note.startTie) continue; // don't terminate it
      if (note.endTie) {
		this.midi.endNote(midipitches[i],mididuration+this.tieduration);
      } else {
		this.midi.endNote(midipitches[i],mididuration);
      }
      mididuration = 0; // put these to zero as we've moved forward in the midi
      this.tieduration=0;
    }
  } else if (elem.rest && elem.rest.type !== 'spacer') {
    this.midi.addRest(mididuration);
  }

  if (elem.endTriplet) {
    this.multiplier=1;
  }

};

ABCJS.midi.MidiWriter.prototype.handleBar = function (elem) {
  this.baraccidentals = [];
  
  
  var repeat = (elem.type==="bar_right_repeat" || elem.type==="bar_dbl_repeat");
  var skip = (elem.startEnding)?true:false;
  var setvisited = (repeat || skip);
  var setrestart = (elem.type==="bar_left_repeat" || elem.type==="bar_dbl_repeat" || elem.type==="bar_thick_thin" || elem.type==="bar_thin_thick" || elem.type==="bar_thin_thin" || elem.type==="bar_right_repeat");

  var next = null;

  if (this.isVisited()) {
    next = this.getJumpMark();
  } else {

    if (skip || repeat) {
      if (this.visited[this.lastmark] === true) {
	this.setJumpMark(this.getMark());
      }  
    }

    if (setvisited) {
      this.markVisited();
    }

    if (repeat) {
      next = this.restart;
      this.setJumpMark(this.getMark());
    }
  }

  if (setrestart) {
    this.restart = this.getMark();
  }

  if (next && this.getMarkString(next)!==this.getMarkString()) {
    this.next = next;
  }

};

ABCJS.midi.MidiWriter.prototype.setKeySignature = function(elem) {
  this.accidentals = [0,0,0,0,0,0,0];
  if (this.abctune.formatting.bagpipes) {
    elem.accidentals=[{acc: 'natural', note: 'g'}, {acc: 'sharp', note: 'f'}, {acc: 'sharp', note: 'c'}];
  }
  if (!elem.accidentals) return;
	window.ABCJS.parse.each(elem.accidentals, function(acc) {
		var d = (acc.acc === "sharp") ? 1 : (acc.acc === "natural") ?0 : -1;

		var lowercase = acc.note.toLowerCase();
		var note = this.extractNote(lowercase.charCodeAt(0)-'c'.charCodeAt(0));
		this.accidentals[note]+=d;
	  }, this);

};

ABCJS.midi.MidiWriter.prototype.extractNote = function(pitch) {
  pitch = pitch%7;
  if (pitch<0) pitch+=7;
  return pitch;
};

ABCJS.midi.MidiWriter.prototype.extractOctave = function(pitch) {
  return Math.floor(pitch/7);
};
})();
//    abc_parse.js: parses a string representing ABC Music Notation into a usable internal structure.
//    Copyright (C) 2010 Paul Rosen (paul at paulrosen dot net)
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.

/*global window */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.parse)
	window.ABCJS.parse = {};

window.ABCJS.parse.clone = function(source) {
	var destination = {};
	for (var property in source)
		if (source.hasOwnProperty(property))
			destination[property] = source[property];
	return destination;
};

window.ABCJS.parse.gsub = function(source, pattern, replacement) {
	return source.split(pattern).join(replacement);
};

window.ABCJS.parse.strip = function(str) {
	return str.replace(/^\s+/, '').replace(/\s+$/, '');
};

window.ABCJS.parse.startsWith = function(str, pattern) {
	return str.indexOf(pattern) === 0;
};

window.ABCJS.parse.endsWith = function(str, pattern) {
	var d = str.length - pattern.length;
	return d >= 0 && str.lastIndexOf(pattern) === d;
};

window.ABCJS.parse.each = function(arr, iterator, context) {
	for (var i = 0, length = arr.length; i < length; i++)
	  iterator.apply(context, [arr[i],i]);
};

window.ABCJS.parse.last = function(arr) {
	if (arr.length === 0)
		return null;
	return arr[arr.length-1];
};

window.ABCJS.parse.compact = function(arr) {
	var output = [];
	for (var i = 0; i < arr.length; i++) {
		if (arr[i])
			output.push(arr[i]);
	}
	return output;
};

window.ABCJS.parse.detect = function(arr, iterator) {
	for (var i = 0; i < arr.length; i++) {
		if (iterator(arr[i]))
			return true;
	}
	return false;
};
//    abc_parse.js: parses a string representing ABC Music Notation into a usable internal structure.
//    Copyright (C) 2010 Paul Rosen (paul at paulrosen dot net)
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.

/*global window */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.parse)
	window.ABCJS.parse = {};

window.ABCJS.parse.Parse = function() {
	var tune = new window.ABCJS.data.Tune();
	var tokenizer = new window.ABCJS.parse.tokenizer();

	this.getTune = function() {
		return tune;
	};

	var multilineVars = {
		reset: function() {
			for (var property in this) {
				if (this.hasOwnProperty(property) && typeof this[property] !== "function") {
					delete this[property];
				}
			}
			this.iChar = 0;
			this.key = {accidentals: [], root: 'none', acc: '', mode: '' };
			this.meter = {type: 'specified', value: [{num: '4', den: '4'}]};	// if no meter is specified, there is an implied one.
			this.origMeter = {type: 'specified', value: [{num: '4', den: '4'}]};	// this is for new voices that are created after we set the meter.
			this.hasMainTitle = false;
			this.default_length = 0.125;
			this.clef = { type: 'treble', verticalPos: 0 };
			this.next_note_duration = 0;
			this.start_new_line = true;
			this.is_in_header = true;
			this.is_in_history = false;
			this.partForNextLine = "";
			this.havent_set_length = true;
			this.voices = {};
			this.staves = [];
			this.macros = {};
			this.currBarNumber = 1;
			this.inTextBlock = false;
			this.inPsBlock = false;
			this.ignoredDecorations = [];
			this.textBlock = "";
			this.score_is_present = false;	// Can't have original V: lines when there is the score directive
			this.inEnding = false;
			this.inTie = false;
			this.inTieChord = {};
		}
	};

	var addWarning = function(str) {
		if (!multilineVars.warnings)
			multilineVars.warnings = [];
		multilineVars.warnings.push(str);
	};

	var encode = function(str) {
		var ret = window.ABCJS.parse.gsub(str, '\x12', ' ');
		ret = window.ABCJS.parse.gsub(ret, '&', '&amp;');
		ret = window.ABCJS.parse.gsub(ret, '<', '&lt;');
		return window.ABCJS.parse.gsub(ret, '>', '&gt;');
	};

	var warn = function(str, line, col_num) {
	  var bad_char = line.charAt(col_num);
		if (bad_char === ' ')
			bad_char = "SPACE";
		var clean_line = encode(line.substring(0, col_num)) +
			'<span style="text-decoration:underline;font-size:1.3em;font-weight:bold;">' + bad_char + '</span>' +
			encode(line.substring(col_num+1));
		addWarning("Music Line:" + tune.getNumLines() + ":" + (col_num+1) + ': ' + str + ":  " + clean_line);
	};
	var header = new window.ABCJS.parse.ParseHeader(tokenizer, warn, multilineVars, tune);

	this.getWarnings = function() {
		return multilineVars.warnings;
	};

	var letter_to_chord = function(line, i)
	{
		if (line.charAt(i) === '"')
		{
			var chord = tokenizer.getBrackettedSubstring(line, i, 5);
			if (!chord[2])
				warn("Missing the closing quote while parsing the chord symbol", line , i);
			// If it starts with ^, then the chord appears above.
			// If it starts with _ then the chord appears below.
			// (note that the 2.0 draft standard defines them as not chords, but annotations and also defines @.)
			if (chord[0] > 0 && chord[1].length > 0 && chord[1].charAt(0) === '^') {
				chord[1] = chord[1].substring(1);
				chord[2] = 'above';
			} else if (chord[0] > 0 && chord[1].length > 0 && chord[1].charAt(0) === '_') {
				chord[1] = chord[1].substring(1);
				chord[2] = 'below';
			} else if (chord[0] > 0 && chord[1].length > 0 && chord[1].charAt(0) === '<') {
				chord[1] = chord[1].substring(1);
				chord[2] = 'left';
			} else if (chord[0] > 0 && chord[1].length > 0 && chord[1].charAt(0) === '>') {
				chord[1] = chord[1].substring(1);
				chord[2] = 'right';
			} else if (chord[0] > 0 && chord[1].length > 0 && chord[1].charAt(0) === '@') {
				// @-15,5.7
				chord[1] = chord[1].substring(1);
				var x = tokenizer.getFloat(chord[1]);
				if (x.digits === 0)
					warn("Missing first position in absolutely positioned annotation.", line , i);
				chord[1] = chord[1].substring(x.digits);
				if (chord[1][0] !== ',')
					warn("Missing comma absolutely positioned annotation.", line , i);
				chord[1] = chord[1].substring(1);
				var y = tokenizer.getFloat(chord[1]);
				if (y.digits === 0)
					warn("Missing second position in absolutely positioned annotation.", line , i);
				chord[1] = chord[1].substring(y.digits);
				var ws = tokenizer.skipWhiteSpace(chord[1]);
				chord[1] = chord[1].substring(ws);
				chord[2] = null;
				chord[3] = { x: x.value, y: y.value };
			} else {
				chord[1] = chord[1].replace(/([ABCDEFG])b/g, "$1♭");
				chord[1] = chord[1].replace(/([ABCDEFG])#/g, "$1♯");
				chord[2] = 'default';
			}
			return chord;
		}
		return [0, ""];
	};

	var legalAccents = [ "trill", "lowermordent", "uppermordent", "mordent", "pralltriller", "accent",
		"fermata", "invertedfermata", "tenuto", "0", "1", "2", "3", "4", "5", "+", "wedge",
		"open", "thumb", "snap", "turn", "roll", "breath", "shortphrase", "mediumphrase", "longphrase",
		"segno", "coda", "D.S.", "D.C.", "fine", "crescendo(", "crescendo)", "diminuendo(", "diminuendo)",
		"p", "pp", "f", "ff", "mf", "mp", "ppp", "pppp",  "fff", "ffff", "sfz", "repeatbar", "repeatbar2", "slide",
		"upbow", "downbow", "/", "//", "///", "////", "trem1", "trem2", "trem3", "trem4",
		"turnx", "invertedturn", "invertedturnx", "trill(", "trill)", "arpeggio", "xstem", "mark",
		"style=normal", "style=harmonic", "style=rhythm", "style=x"
	];
	var accentPsuedonyms = [ ["<", "accent"], [">", "accent"], ["tr", "trill"], ["<(", "crescendo("], ["<)", "crescendo)"],
		[">(", "diminuendo("], [">)", "diminuendo)"], ["plus", "+"], [ "emphasis", "accent"] ];
	var letter_to_accent = function(line, i)
	{
		var macro = multilineVars.macros[line.charAt(i)];

		if (macro !== undefined) {
			if (macro.charAt(0) === '!' || macro.charAt(0) === '+')
				macro = macro.substring(1);
			if (macro.charAt(macro.length-1) === '!' || macro.charAt(macro.length-1) === '+')
				macro = macro.substring(0, macro.length-1);
			if (window.ABCJS.parse.detect(legalAccents, function(acc) {
					return (macro === acc);
				}))
				return [ 1, macro ];
			else {
				if (!window.ABCJS.parse.detect(multilineVars.ignoredDecorations, function(dec) {
					return (macro === dec);
				}))
					warn("Unknown macro: " + macro, line, i);
				return [1, '' ];
			}
		}
		switch (line.charAt(i))
		{
			case '.':return [1, 'staccato'];
			case 'u':return [1, 'upbow'];
			case 'v':return [1, 'downbow'];
			case '~':return [1, 'irishroll'];
			case '!':
			case '+':
				var ret = tokenizer.getBrackettedSubstring(line, i, 5);
				// Be sure that the accent is recognizable.
			if (ret[1].length > 0 && (ret[1].charAt(0) === '^' || ret[1].charAt(0) ==='_'))
					ret[1] = ret[1].substring(1);	// TODO-PER: The test files have indicators forcing the ornament to the top or bottom, but that isn't in the standard. We'll just ignore them.
				if (window.ABCJS.parse.detect(legalAccents, function(acc) {
					return (ret[1] === acc);
				}))
					return ret;

				if (window.ABCJS.parse.detect(accentPsuedonyms, function(acc) {
					if (ret[1] === acc[0]) {
						ret[1] = acc[1];
						return true;
					} else
						return false;
				}))
					return ret;

				// We didn't find the accent in the list, so consume the space, but don't return an accent.
				// Although it is possible that ! was used as a line break, so accept that.
			if (line.charAt(i) === '!' && (ret[0] === 1 || line.charAt(i+ret[0]-1) !== '!'))
					return [1, null ];
				warn("Unknown decoration: " + ret[1], line, i);
				ret[1] = "";
				return ret;
			case 'H':return [1, 'fermata'];
			case 'J':return [1, 'slide'];
			case 'L':return [1, 'accent'];
			case 'M':return [1, 'mordent'];
			case 'O':return[1, 'coda'];
			case 'P':return[1, 'pralltriller'];
			case 'R':return [1, 'roll'];
			case 'S':return [1, 'segno'];
			case 'T':return [1, 'trill'];
		}
		return [0, 0];
	};

	var letter_to_spacer = function(line, i)
	{
		var start = i;
		while (tokenizer.isWhiteSpace(line.charAt(i)))
			i++;
		return [ i-start ];
	};

	// returns the class of the bar line
	// the number of the repeat
	// and the number of characters used up
	// if 0 is returned, then the next element was not a bar line
	var letter_to_bar = function(line, curr_pos)
	{
		var ret = tokenizer.getBarLine(line, curr_pos);
		if (ret.len === 0)
			return [0,""];
		if (ret.warn) {
			warn(ret.warn, line, curr_pos);
			return [ret.len,""];
		}

		// Now see if this is a repeated ending
		// A repeated ending is all of the characters 1,2,3,4,5,6,7,8,9,0,-, and comma
		// It can also optionally start with '[', which is ignored.
		// Also, it can have white space before the '['.
		for (var ws = 0; ws < line.length; ws++)
		  if (line.charAt(curr_pos+ret.len+ws) !== ' ')
				break;
		var orig_bar_len = ret.len;
		if (line.charAt(curr_pos+ret.len+ws) === '[') {
			ret.len += ws + 1;
		}

		// It can also be a quoted string. It is unclear whether that construct requires '[', but it seems like it would. otherwise it would be confused with a regular chord.
		if (line.charAt(curr_pos+ret.len) === '"' && line.charAt(curr_pos+ret.len-1) === '[') {
			var ending = tokenizer.getBrackettedSubstring(line, curr_pos+ret.len, 5);
			return [ret.len+ending[0], ret.token, ending[1]];
		}
		var retRep = tokenizer.getTokenOf(line.substring(curr_pos+ret.len), "1234567890-,");
		if (retRep.len === 0 || retRep.token[0] === '-')
			return [orig_bar_len, ret.token];

		return [ret.len+retRep.len, ret.token, retRep.token];
	};

	var letter_to_open_slurs_and_triplets =  function(line, i) {
		// consume spaces, and look for all the open parens. If there is a number after the open paren,
		// that is a triplet. Otherwise that is a slur. Collect all the slurs and the first triplet.
		var ret = {};
		var start = i;
		while (line.charAt(i) === '(' || tokenizer.isWhiteSpace(line.charAt(i))) {
			if (line.charAt(i) === '(') {
				if (i+1 < line.length && (line.charAt(i+1) >= '2' && line.charAt(i+1) <= '9')) {
					if (ret.triplet !== undefined)
						warn("Can't nest triplets", line, i);
					else {
						ret.triplet = line.charAt(i+1) - '0';
						if (i+2 < line.length && line.charAt(i+2) === ':') {
							// We are expecting "(p:q:r" or "(p:q" or "(p::r" we are only interested in the first number (p) and the number of notes (r)
							// if r is missing, then it is equal to p.
							if (i+3 < line.length && line.charAt(i+3) === ':') {
								if (i+4 < line.length && (line.charAt(i+4) >= '1' && line.charAt(i+4) <= '9')) {
									ret.num_notes = line.charAt(i+4) - '0';
									i += 3;
								} else
									warn("expected number after the two colons after the triplet to mark the duration", line, i);
							} else if (i+3 < line.length && (line.charAt(i+3) >= '1' && line.charAt(i+3) <= '9')) {
								// Do not ignore this middle number: useful for complex notation
								ret.mid_nbr = line.charAt(i+3) - '0';
								if (i+4 < line.length && line.charAt(i+4) === ':') {
									if (i+5 < line.length && (line.charAt(i+5) >= '1' && line.charAt(i+5) <= '9')) {
										ret.num_notes = line.charAt(i+5) - '0';
										i += 4;
									}
								} else {
									ret.num_notes = ret.triplet;
									i += 3;
								}
							} else
								warn("expected number after the triplet to mark the duration", line, i);
						}
					}
					i++;
				}
				else {
					if (ret.startSlur === undefined)
						ret.startSlur = 1;
					else
						ret.startSlur++;
				}
			}
			i++;
		}
		ret.consumed = i-start;
		return ret;
	};

	var addWords = function(line, words) {
		if (!line) { warn("Can't add words before the first line of mulsic", line, 0); return; }
		words = window.ABCJS.parse.strip(words);
		if (words.charAt(words.length-1) !== '-')
			words = words + ' ';	// Just makes it easier to parse below, since every word has a divider after it.
		var word_list = [];
		// first make a list of words from the string we are passed. A word is divided on either a space or dash.
		var last_divider = 0;
		var replace = false;
		var addWord = function(i) {
			var word = window.ABCJS.parse.strip(words.substring(last_divider, i));
			last_divider = i+1;
			if (word.length > 0) {
				if (replace)
					word = window.ABCJS.parse.gsub(word,'~', ' ');
				var div = words.charAt(i);
				if (div !== '_' && div !== '-')
					div = ' ';
				word_list.push({syllable: tokenizer.translateString(word), divider: div});
				replace = false;
				return true;
			}
			return false;
		};
		for (var i = 0; i < words.length; i++) {
			switch (words.charAt(i)) {
				case ' ':
				case '\x12':
					addWord(i);
					break;
				case '-':
					if (!addWord(i) && word_list.length > 0) {
						window.ABCJS.parse.last(word_list).divider = '-';
						word_list.push({skip: true, to: 'next'});
					}
					break;
				case '_':
					addWord(i);
					word_list.push({skip: true, to: 'slur'});
					break;
				case '*':
					addWord(i);
					word_list.push({skip: true, to: 'next'});
					break;
				case '|':
					addWord(i);
					word_list.push({skip: true, to: 'bar'});
					break;
				case '~':
					replace = true;
					break;
			}
		}

		var inSlur = false;
		window.ABCJS.parse.each(line, function(el) {
			if (word_list.length !== 0) {
				if (word_list[0].skip) {
					switch (word_list[0].to) {
						case 'next': if (el.el_type === 'note' && el.pitches !== null && !inSlur) word_list.shift(); break;
						case 'slur': if (el.el_type === 'note' && el.pitches !== null) word_list.shift(); break;
						case 'bar': if (el.el_type === 'bar') word_list.shift(); break;
					}
				} else {
					if (el.el_type === 'note' && el.rest === undefined && !inSlur) {
						var lyric = word_list.shift();
						if (el.lyric === undefined)
							el.lyric = [ lyric ];
						else
							el.lyric.push(lyric);
					}
				}
			}
		});
	};

	var addSymbols = function(line, words) {
		// TODO-PER: Currently copied from w: line. This needs to be read as symbols instead.
		if (!line) { warn("Can't add symbols before the first line of mulsic", line, 0); return; }
		words = window.ABCJS.parse.strip(words);
		if (words.charAt(words.length-1) !== '-')
			words = words + ' ';	// Just makes it easier to parse below, since every word has a divider after it.
		var word_list = [];
		// first make a list of words from the string we are passed. A word is divided on either a space or dash.
		var last_divider = 0;
		var replace = false;
		var addWord = function(i) {
			var word = window.ABCJS.parse.strip(words.substring(last_divider, i));
			last_divider = i+1;
			if (word.length > 0) {
				if (replace)
					word = window.ABCJS.parse.gsub(word, '~', ' ');
				var div = words.charAt(i);
				if (div !== '_' && div !== '-')
					div = ' ';
				word_list.push({syllable: tokenizer.translateString(word), divider: div});
				replace = false;
				return true;
			}
			return false;
		};
		for (var i = 0; i < words.length; i++) {
			switch (words.charAt(i)) {
				case ' ':
				case '\x12':
					addWord(i);
					break;
				case '-':
					if (!addWord(i) && word_list.length > 0) {
						window.ABCJS.parse.last(word_list).divider = '-';
						word_list.push({skip: true, to: 'next'});
					}
					break;
				case '_':
					addWord(i);
					word_list.push({skip: true, to: 'slur'});
					break;
				case '*':
					addWord(i);
					word_list.push({skip: true, to: 'next'});
					break;
				case '|':
					addWord(i);
					word_list.push({skip: true, to: 'bar'});
					break;
				case '~':
					replace = true;
					break;
			}
		}

		var inSlur = false;
		window.ABCJS.parse.each(line, function(el) {
			if (word_list.length !== 0) {
				if (word_list[0].skip) {
					switch (word_list[0].to) {
						case 'next': if (el.el_type === 'note' && el.pitches !== null && !inSlur) word_list.shift(); break;
						case 'slur': if (el.el_type === 'note' && el.pitches !== null) word_list.shift(); break;
						case 'bar': if (el.el_type === 'bar') word_list.shift(); break;
					}
				} else {
					if (el.el_type === 'note' && el.rest === undefined && !inSlur) {
						var lyric = word_list.shift();
						if (el.lyric === undefined)
							el.lyric = [ lyric ];
						else
							el.lyric.push(lyric);
					}
				}
			}
		});
	};

	var getBrokenRhythm = function(line, index) {
		switch (line.charAt(index)) {
			case '>':
			if (index < line.length - 1 && line.charAt(index+1) === '>')	// double >>
					return [2, 1.75, 0.25];
				else
					return [1, 1.5, 0.5];
				break;
			case '<':
			if (index < line.length - 1 && line.charAt(index+1) === '<')	// double <<
					return [2, 0.25, 1.75];
				else
					return [1, 0.5, 1.5];
				break;
		}
		return null;
	};

	// TODO-PER: make this a method in el.
	var addEndBeam = function(el) {
		if (el.duration !== undefined && el.duration < 0.25)
			el.end_beam = true;
		return el;
	};

	var pitches = {A: 5, B: 6, C: 0, D: 1, E: 2, F: 3, G: 4, a: 12, b: 13, c: 7, d: 8, e: 9, f: 10, g: 11};
	var rests = {x: 'invisible', y: 'spacer', z: 'rest', Z: 'multimeasure' };
	var getCoreNote = function(line, index, el, canHaveBrokenRhythm) {
		//var el = { startChar: index };
		var isComplete = function(state) {
			return (state === 'octave' || state === 'duration' || state === 'Zduration' || state === 'broken_rhythm' || state === 'end_slur');
		};
		var state = 'startSlur';
		var durationSetByPreviousNote = false;
		while (1) {
			switch(line.charAt(index)) {
				case '(':
					if (state === 'startSlur') {
						if (el.startSlur === undefined) el.startSlur = 1; else el.startSlur++;
					} else if (isComplete(state)) {el.endChar = index;return el;}
					else return null;
					break;
				case ')':
					if (isComplete(state)) {
						if (el.endSlur === undefined) el.endSlur = 1; else el.endSlur++;
					} else return null;
					break;
				case '^':
					if (state === 'startSlur') {el.accidental = 'sharp';state = 'sharp2';}
					else if (state === 'sharp2') {el.accidental = 'dblsharp';state = 'pitch';}
					else if (isComplete(state)) {el.endChar = index;return el;}
					else return null;
					break;
				case '_':
					if (state === 'startSlur') {el.accidental = 'flat';state = 'flat2';}
					else if (state === 'flat2') {el.accidental = 'dblflat';state = 'pitch';}
					else if (isComplete(state)) {el.endChar = index;return el;}
					else return null;
					break;
				case '=':
					if (state === 'startSlur') {el.accidental = 'natural';state = 'pitch';}
					else if (isComplete(state)) {el.endChar = index;return el;}
					else return null;
					break;
				case 'A':
				case 'B':
				case 'C':
				case 'D':
				case 'E':
				case 'F':
				case 'G':
				case 'a':
				case 'b':
				case 'c':
				case 'd':
				case 'e':
				case 'f':
				case 'g':
					if (state === 'startSlur' || state === 'sharp2' || state === 'flat2' || state === 'pitch') {
						el.pitch = pitches[line.charAt(index)];
						state = 'octave';
						// At this point we have a valid note. The rest is optional. Set the duration in case we don't get one below
						if (canHaveBrokenRhythm && multilineVars.next_note_duration !== 0) {
							el.duration = multilineVars.next_note_duration;
							multilineVars.next_note_duration = 0;
							durationSetByPreviousNote = true;
						} else
							el.duration = multilineVars.default_length;
					} else if (isComplete(state)) {el.endChar = index;return el;}
					else return null;
					break;
				case ',':
					if (state === 'octave') {el.pitch -= 7;}
					else if (isComplete(state)) {el.endChar = index;return el;}
					else return null;
					break;
				case '\'':
					if (state === 'octave') {el.pitch += 7;}
					else if (isComplete(state)) {el.endChar = index;return el;}
					else return null;
					break;
				case 'x':
				case 'y':
				case 'z':
				case 'Z':
					if (state === 'startSlur') {
						el.rest = { type: rests[line.charAt(index)] };
						// There shouldn't be some of the properties that notes have. If some sneak in due to bad syntax in the abc file,
						// just nix them here.
						delete el.accidental;
						delete el.startSlur;
						delete el.startTie;
						delete el.endSlur;
						delete el.endTie;
						delete el.end_beam;
						delete el.grace_notes;
						// At this point we have a valid note. The rest is optional. Set the duration in case we don't get one below
						if (el.rest.type === 'multimeasure') {
							el.duration = 1;
							state = 'Zduration';
						} else {
							if (canHaveBrokenRhythm && multilineVars.next_note_duration !== 0) {
								el.duration = multilineVars.next_note_duration;
								multilineVars.next_note_duration = 0;
								durationSetByPreviousNote = true;
							} else
								el.duration = multilineVars.default_length;
							state = 'duration';
						}
					} else if (isComplete(state)) {el.endChar = index;return el;}
					else return null;
					break;
				case '1':
				case '2':
				case '3':
				case '4':
				case '5':
				case '6':
				case '7':
				case '8':
				case '9':
				case '0':
				case '/':
					if (state === 'octave' || state === 'duration') {
						var fraction = tokenizer.getFraction(line, index);
						if (!durationSetByPreviousNote)
							el.duration = el.duration * fraction.value;
						// TODO-PER: We can test the returned duration here and give a warning if it isn't the one expected.
						el.endChar = fraction.index;
						while (fraction.index < line.length && (tokenizer.isWhiteSpace(line.charAt(fraction.index)) || line.charAt(fraction.index) === '-')) {
						  if (line.charAt(fraction.index) === '-')
								el.startTie = {};
							else
								el = addEndBeam(el);
							fraction.index++;
						}
						index = fraction.index-1;
						state = 'broken_rhythm';
					} else if (state === 'sharp2') {
						el.accidental = 'quartersharp';state = 'pitch';
					} else if (state === 'flat2') {
						el.accidental = 'quarterflat';state = 'pitch';
					} else if (state === 'Zduration') {
						var num = tokenizer.getNumber(line, index);
						el.duration = num.num;
						el.endChar = num.index;
						return el;
					} else return null;
					break;
				case '-':
					if (state === 'startSlur') {
						// This is the first character, so it must have been meant for the previous note. Correct that here.
						tune.addTieToLastNote();
						el.endTie = true;
					} else if (state === 'octave' || state === 'duration' || state === 'end_slur') {
						el.startTie = {};
						if (!durationSetByPreviousNote && canHaveBrokenRhythm)
							state = 'broken_rhythm';
						else {
							// Peek ahead to the next character. If it is a space, then we have an end beam.
						  if (tokenizer.isWhiteSpace(line.charAt(index+1)))
								addEndBeam(el);
							el.endChar = index+1;
							return el;
						}
					} else if (state === 'broken_rhythm') {el.endChar = index;return el;}
					else return null;
					break;
				case ' ':
				case '\t':
					if (isComplete(state)) {
						el.end_beam = true;
						// look ahead to see if there is a tie
						do {
						  if (line.charAt(index) === '-')
								el.startTie = {};
							index++;
						} while (index < line.length && (tokenizer.isWhiteSpace(line.charAt(index)) || line.charAt(index) === '-'));
						el.endChar = index;
						if (!durationSetByPreviousNote && canHaveBrokenRhythm && (line.charAt(index) === '<' || line.charAt(index) === '>')) {	// TODO-PER: Don't need the test for < and >, but that makes the endChar work out for the regression test.
							index--;
							state = 'broken_rhythm';
						} else
							return el;
					}
					else return null;
					break;
				case '>':
				case '<':
					if (isComplete(state)) {
						if (canHaveBrokenRhythm) {
							var br2 = getBrokenRhythm(line, index);
							index += br2[0] - 1;	// index gets incremented below, so we'll let that happen
							multilineVars.next_note_duration = br2[2]*el.duration;
							el.duration = br2[1]*el.duration;
							state = 'end_slur';
						} else {
							el.endChar = index;
							return el;
						}
					} else
						return null;
					break;
				default:
					if (isComplete(state)) {
						el.endChar = index;
						return el;
					}
					return null;
			}
			index++;
			if (index === line.length) {
				if (isComplete(state)) {el.endChar = index;return el;}
				else return null;
			}
		}
		return null;
	};

	function startNewLine() {
		var params = { startChar: -1, endChar: -1};
		if (multilineVars.partForNextLine.length)
			params.part = multilineVars.partForNextLine;
		params.clef = multilineVars.currentVoice && multilineVars.staves[multilineVars.currentVoice.staffNum].clef !== undefined ? window.ABCJS.parse.clone(multilineVars.staves[multilineVars.currentVoice.staffNum].clef) : window.ABCJS.parse.clone(multilineVars.clef) ;
		params.key = window.ABCJS.parse.parseKeyVoice.deepCopyKey(multilineVars.key);
		window.ABCJS.parse.parseKeyVoice.addPosToKey(params.clef, params.key);
		if (multilineVars.meter !== null) {
			if (multilineVars.currentVoice) {
				window.ABCJS.parse.each(multilineVars.staves, function(st) {
					st.meter = multilineVars.meter;
				});
				params.meter = multilineVars.staves[multilineVars.currentVoice.staffNum].meter;
				multilineVars.staves[multilineVars.currentVoice.staffNum].meter = null;
			} else
				params.meter = multilineVars.meter;
			multilineVars.meter = null;
		} else if (multilineVars.currentVoice && multilineVars.staves[multilineVars.currentVoice.staffNum].meter) {
			// Make sure that each voice gets the meter marking.
			params.meter = multilineVars.staves[multilineVars.currentVoice.staffNum].meter;
			multilineVars.staves[multilineVars.currentVoice.staffNum].meter = null;
		}
		if (multilineVars.currentVoice && multilineVars.currentVoice.name)
			params.name = multilineVars.currentVoice.name;
		if (multilineVars.vocalfont)
			params.vocalfont = multilineVars.vocalfont;
		if (multilineVars.style)
			params.style = multilineVars.style;
		if (multilineVars.currentVoice) {
			var staff = multilineVars.staves[multilineVars.currentVoice.staffNum];
			if (staff.brace) params.brace = staff.brace;
			if (staff.bracket) params.bracket = staff.bracket;
			if (staff.connectBarLines) params.connectBarLines = staff.connectBarLines;
			if (staff.name) params.name = staff.name[multilineVars.currentVoice.index];
			if (staff.subname) params.subname = staff.subname[multilineVars.currentVoice.index];
			if (multilineVars.currentVoice.stem)
				params.stem = multilineVars.currentVoice.stem;
			if (multilineVars.currentVoice.scale)
				params.scale = multilineVars.currentVoice.scale;
			if (multilineVars.currentVoice.style)
				params.style = multilineVars.currentVoice.style;
		}
		tune.startNewLine(params);

		multilineVars.partForNextLine = "";
		if (multilineVars.currentVoice === undefined || (multilineVars.currentVoice.staffNum === multilineVars.staves.length-1 && multilineVars.staves[multilineVars.currentVoice.staffNum].numVoices-1 === multilineVars.currentVoice.index)) {
			//multilineVars.meter = null;
			if (multilineVars.barNumbers === 0)
				multilineVars.barNumOnNextNote = multilineVars.currBarNumber;
		}
	}

	var letter_to_grace =  function(line, i) {
		// Grace notes are an array of: startslur, note, endslur, space; where note is accidental, pitch, duration
		if (line.charAt(i) === '{') {
			// fetch the gracenotes string and consume that into the array
			var gra = tokenizer.getBrackettedSubstring(line, i, 1, '}');
			if (!gra[2])
				warn("Missing the closing '}' while parsing grace note", line, i);
			// If there is a slur after the grace construction, then move it to the last note inside the grace construction
			if (line[i+gra[0]] === ')') {
				gra[0]++;
				gra[1] += ')';
			}

			var gracenotes = [];
			var ii = 0;
			var inTie = false;
			while (ii < gra[1].length) {
				var acciaccatura = false;
				if (gra[1].charAt(ii) === '/') {
					acciaccatura = true;
					ii++;
				}
				var note = getCoreNote(gra[1], ii, {}, false);
				if (note !== null) {
					if (acciaccatura)
						note.acciaccatura = true;
					gracenotes.push(note);

					if (inTie) {
						note.endTie = true;
						inTie = false;
					}
					if (note.startTie)
						inTie = true;

					ii  = note.endChar;
					delete note.endChar;
				}
				else {
					// We shouldn't get anything but notes or a space here, so report an error
					if (gra[1].charAt(ii) === ' ') {
						if (gracenotes.length > 0)
							gracenotes[gracenotes.length-1].end_beam = true;
					} else
						warn("Unknown character '" + gra[1].charAt(ii) + "' while parsing grace note", line, i);
					ii++;
				}
			}
			if (gracenotes.length)
				return [gra[0], gracenotes];
//				for (var ret = letter_to_pitch(gra[1], ii); ret[0]>0 && ii<gra[1].length;
//					ret = letter_to_pitch(gra[1], ii)) {
//					//todo get other stuff that could be in a grace note
//					ii += ret[0];
//					gracenotes.push({el_type:"gracenote",pitch:ret[1]});
//				}
//				return [ gra[0], gracenotes ];
		}
		return [ 0 ];
	};

	//
	// Parse line of music
	//
	// This is a stream of <(bar-marking|header|note-group)...> in any order, with optional spaces between each element
	// core-note is <open-slur, accidental, pitch:required, octave, duration, close-slur&|tie> with no spaces within that
	// chord is <open-bracket:required, core-note:required... close-bracket:required duration> with no spaces within that
	// grace-notes is <open-brace:required, (open-slur|core-note:required|close-slur)..., close-brace:required> spaces are allowed
	// note-group is <grace-notes, chord symbols&|decorations..., grace-notes, slur&|triplet, chord|core-note, end-slur|tie> spaces are allowed between items
	// bar-marking is <ampersand> or <chord symbols&|decorations..., bar:required> spaces allowed
	// header is <open-bracket:required, K|M|L|V:required, colon:required, field:required, close-bracket:required> spaces can occur between the colon, in the field, and before the close bracket
	// header can also be the only thing on a line. This is true even if it is a continuation line. In this case the brackets are not required.
	// a space is a back-tick, a space, or a tab. If it is a back-tick, then there is no end-beam.

	// Line preprocessing: anything after a % is ignored (the double %% should have been taken care of before this)
	// Then, all leading and trailing spaces are ignored.
	// If there was a line continuation, the \n was replaced by a \r and the \ was replaced by a space. This allows the construct
	// of having a header mid-line conceptually, but actually be at the start of the line. This is equivolent to putting the header in [ ].

	// TODO-PER: How to handle ! for line break?
	// TODO-PER: dots before bar, dots before slur
	// TODO-PER: U: redefinable symbols.

	// Ambiguous symbols:
	// "[" can be the start of a chord, the start of a header element or part of a bar line.
	// --- if it is immediately followed by "|", it is a bar line
	// --- if it is immediately followed by K: L: M: V: it is a header (note: there are other headers mentioned in the standard, but I'm not sure how they would be used.)
	// --- otherwise it is the beginning of a chord
	// "(" can be the start of a slur or a triplet
	// --- if it is followed by a number from 2-9, then it is a triplet
	// --- otherwise it is a slur
	// "]"
	// --- if there is a chord open, then this is the close
	// --- if it is after a [|, then it is an invisible bar line
	// --- otherwise, it is par of a bar
	// "." can be a bar modifier or a slur modifier, or a decoration
	// --- if it comes immediately before a bar, it is a bar modifier
	// --- if it comes immediately before a slur, it is a slur modifier
	// --- otherwise it is a decoration for the next note.
	// number:
	// --- if it is after a bar, with no space, it is an ending marker
	// --- if it is after a ( with no space, it is a triplet count
	// --- if it is after a pitch or octave or slash, then it is a duration

	// Unambiguous symbols (except inside quoted strings):
	// vertical-bar, colon: part of a bar
	// ABCDEFGabcdefg: pitch
	// xyzZ: rest
	// comma, prime: octave
	// close-paren: end-slur
	// hyphen: tie
	// tilde, v, u, bang, plus, THLMPSO: decoration
	// carat, underscore, equal: accidental
	// ampersand: time reset
	// open-curly, close-curly: grace notes
	// double-quote: chord symbol
	// less-than, greater-than, slash: duration
	// back-tick, space, tab: space
	var nonDecorations = "ABCDEFGabcdefgxyzZ[]|^_{";	// use this to prescreen so we don't have to look for a decoration at every note.

	var parseRegularMusicLine = function(line) {
		header.resolveTempo();
		//multilineVars.havent_set_length = false;	// To late to set this now.
		multilineVars.is_in_header = false;	// We should have gotten a key header by now, but just in case, this is definitely out of the header.
		var i = 0;
		var startOfLine = multilineVars.iChar;
		// see if there is nothing but a comment on this line. If so, just ignore it. A full line comment is optional white space followed by %
		while (tokenizer.isWhiteSpace(line.charAt(i)) && i < line.length)
			i++;
		if (i === line.length || line.charAt(i) === '%')
			return;

		// Start with the standard staff, clef and key symbols on each line
		var delayStartNewLine = multilineVars.start_new_line;
//			if (multilineVars.start_new_line) {
//				startNewLine();
//			}
		if (multilineVars.continueall === undefined)
			multilineVars.start_new_line = true;
		else
			multilineVars.start_new_line = false;
		var tripletNotesLeft = 0;
		//var tripletMultiplier = 0;
//		var inTie = false;
//		var inTieChord = {};

		// See if the line starts with a header field
		var retHeader = header.letter_to_body_header(line, i);
		if (retHeader[0] > 0) {
			i += retHeader[0];
			// TODO-PER: Handle inline headers
		}
		var el = { };

		while (i < line.length)
		{
			var startI = i;
			if (line.charAt(i) === '%')
				break;

			var retInlineHeader = header.letter_to_inline_header(line, i);
			if (retInlineHeader[0] > 0) {
					i += retInlineHeader[0];
					// TODO-PER: Handle inline headers
					//multilineVars.start_new_line = false;
			} else {
				// Wait until here to actually start the line because we know we're past the inline statements.
				if (delayStartNewLine) {
					startNewLine();
					delayStartNewLine = false;
				}
//					var el = { };

				// We need to decide if the following characters are a bar-marking or a note-group.
				// Unfortunately, that is ambiguous. Both can contain chord symbols and decorations.
				// If there is a grace note either before or after the chord symbols and decorations, then it is definitely a note-group.
				// If there is a bar marker, it is definitely a bar-marking.
				// If there is either a core-note or chord, it is definitely a note-group.
				// So, loop while we find grace-notes, chords-symbols, or decorations. [It is an error to have more than one grace-note group in a row; the others can be multiple]
				// Then, if there is a grace-note, we know where to go.
				// Else see if we have a chord, core-note, slur, triplet, or bar.

				var ret;
				while (1) {
					ret = tokenizer.eatWhiteSpace(line, i);
					if (ret > 0) {
						i += ret;
					}
					if (i > 0 && line.charAt(i-1) === '\x12') {
						// there is one case where a line continuation isn't the same as being on the same line, and that is if the next character after it is a header.
						ret = header.letter_to_body_header(line, i);
						if (ret[0] > 0) {
							// TODO: insert header here
							i = ret[0];
							multilineVars.start_new_line = false;
						}
					}
					// gather all the grace notes, chord symbols and decorations
					ret = letter_to_spacer(line, i);
					if (ret[0] > 0) {
						i += ret[0];
					}

					ret = letter_to_chord(line, i);
					if (ret[0] > 0) {
						// There could be more than one chord here if they have different positions.
						// If two chords have the same position, then connect them with newline.
						if (!el.chord)
							el.chord = [];
						var chordName = tokenizer.translateString(ret[1]);
						chordName = chordName.replace(/;/g, "\n");
						var addedChord = false;
						for (var ci = 0; ci < el.chord.length; ci++) {
							if (el.chord[ci].position === ret[2]) {
								addedChord = true;
								el.chord[ci].name += "\n" + chordName;
							}
						}
						if (addedChord === false) {
							if (ret[2] === null && ret[3])
								el.chord.push({name: chordName, rel_position: ret[3]});
							else
								el.chord.push({name: chordName, position: ret[2]});
						}

						i += ret[0];
						var ii = tokenizer.skipWhiteSpace(line.substring(i));
						if (ii > 0)
							el.force_end_beam_last = true;
						i += ii;
					} else {
						if (nonDecorations.indexOf(line.charAt(i)) === -1)
							ret = letter_to_accent(line, i);
						else ret = [ 0 ];
						if (ret[0] > 0) {
							if (ret[1] === null) {
								 if (i+1 < line.length)
									startNewLine();	// There was a ! in the middle of the line. Start a new line if there is anything after it.
							} else if (ret[1].length > 0) {
								if (el.decoration === undefined)
									el.decoration = [];
								el.decoration.push(ret[1]);
							}
							i += ret[0];
						} else {
							ret = letter_to_grace(line, i);
							// TODO-PER: Be sure there aren't already grace notes defined. That is an error.
							if (ret[0] > 0) {
								el.gracenotes = ret[1];
								i += ret[0];
							} else
								break;
						}
					}
				}

				ret = letter_to_bar(line, i);
				if (ret[0] > 0) {
					// This is definitely a bar
					if (el.gracenotes !== undefined) {
						// Attach the grace note to an invisible note
						el.rest = { type: 'spacer' };
						el.duration = 0.125; // TODO-PER: I don't think the duration of this matters much, but figure out if it does.
						tune.appendElement('note', startOfLine+i, startOfLine+i+ret[0], el);
						multilineVars.measureNotEmpty = true;
						el = {};
					}
					var bar = {type: ret[1]};
					if (bar.type.length === 0)
						warn("Unknown bar type", line, i);
					else {
						if (multilineVars.inEnding && bar.type !== 'bar_thin') {
							bar.endEnding = true;
							multilineVars.inEnding = false;
						}
						if (ret[2]) {
							bar.startEnding = ret[2];
							if (multilineVars.inEnding)
								bar.endEnding = true;
							multilineVars.inEnding = true;
						}
						if (el.decoration !== undefined)
							bar.decoration = el.decoration;
						if (el.chord !== undefined)
							bar.chord = el.chord;
						if (bar.startEnding && multilineVars.barFirstEndingNum === undefined)
							multilineVars.barFirstEndingNum = multilineVars.currBarNumber;
						else if (bar.startEnding && bar.endEnding && multilineVars.barFirstEndingNum)
							multilineVars.currBarNumber = multilineVars.barFirstEndingNum;
						else if (bar.endEnding)
							multilineVars.barFirstEndingNum = undefined;
						if (bar.type !== 'bar_invisible' && multilineVars.measureNotEmpty) {
							multilineVars.currBarNumber++;
							if (multilineVars.barNumbers && multilineVars.currBarNumber % multilineVars.barNumbers === 0)
								multilineVars.barNumOnNextNote = multilineVars.currBarNumber;
						}
						tune.appendElement('bar', startOfLine+i, startOfLine+i+ret[0], bar);
						multilineVars.measureNotEmpty = false;
						el = {};
					}
					i += ret[0];
				} else if (line[i] === '&') {	// backtrack to beginning of measure
					warn("Overlay not yet supported", line, i);
					i++;

				} else {
					// This is definitely a note group
					//
					// Look for as many open slurs and triplets as there are. (Note: only the first triplet is valid.)
					ret = letter_to_open_slurs_and_triplets(line, i);
					if (ret.consumed > 0) {
						if (ret.startSlur !== undefined)
							el.startSlur = ret.startSlur;
						if (ret.triplet !== undefined) {
							if (tripletNotesLeft > 0)
								warn("Can't nest triplets", line, i);
							else {
								el.startTriplet = ret.triplet;
								tripletNotesLeft = ret.num_notes === undefined ? ret.triplet : ret.num_notes;
								el.mid_nbr=ret.mid_nbr;
							}
						}
						i += ret.consumed;
					}

					// handle chords.
					if (line.charAt(i) === '[') {
						i++;
						var chordDuration = null;

						var done = false;
						while (!done) {
							var chordNote = getCoreNote(line, i, {}, false);
							if (chordNote !== null) {
								if (chordNote.end_beam) {
									el.end_beam = true;
									delete chordNote.end_beam;
								}
								if (el.pitches === undefined) {
									el.duration = chordNote.duration;
									el.pitches = [ chordNote ];
								} else	// Just ignore the note lengths of all but the first note. The standard isn't clear here, but this seems less confusing.
									el.pitches.push(chordNote);
								delete chordNote.duration;

								if (multilineVars.inTieChord[el.pitches.length]) {
									chordNote.endTie = true;
									multilineVars.inTieChord[el.pitches.length] = undefined;
								}
								if (chordNote.startTie)
									multilineVars.inTieChord[el.pitches.length] = true;

								i  = chordNote.endChar;
								delete chordNote.endChar;
							} else if (line.charAt(i) === ' ') {
								// Spaces are not allowed in chords, but we can recover from it by ignoring it.
								warn("Spaces are not allowed in chords", line, i);
								i++;
							} else {
								if (i < line.length && line.charAt(i) === ']') {
									// consume the close bracket
									i++;

									if (multilineVars.next_note_duration !== 0) {
										el.duration = el.duration * multilineVars.next_note_duration;
//											window.ABCJS.parse.each(el.pitches, function(p) {
//												p.duration = p.duration * multilineVars.next_note_duration;
//											});
										multilineVars.next_note_duration = 0;
									}

									if (multilineVars.inTie) {
										window.ABCJS.parse.each(el.pitches, function(pitch) { pitch.endTie = true; });
										multilineVars.inTie = false;
									}

									if (tripletNotesLeft > 0) {
										tripletNotesLeft--;
										if (tripletNotesLeft === 0) {
											el.endTriplet = true;
										}
									}

//									if (el.startSlur !== undefined) {
//										window.ABCJS.parse.each(el.pitches, function(pitch) { if (pitch.startSlur === undefined) pitch.startSlur = el.startSlur; else pitch.startSlur += el.startSlur; });
//										delete el.startSlur;
//									}

									var postChordDone = false;
									while (i < line.length && !postChordDone) {
										switch (line.charAt(i)) {
											case ' ':
											case '\t':
												addEndBeam(el);
												break;
											case ')':
												if (el.endSlur === undefined) el.endSlur = 1; else el.endSlur++;
												//window.ABCJS.parse.each(el.pitches, function(pitch) { if (pitch.endSlur === undefined) pitch.endSlur = 1; else pitch.endSlur++; });
												break;
											case '-':
												window.ABCJS.parse.each(el.pitches, function(pitch) { pitch.startTie = {}; });
												multilineVars.inTie = true;
												break;
											case '>':
											case '<':
												var br2 = getBrokenRhythm(line, i);
												i += br2[0] - 1;	// index gets incremented below, so we'll let that happen
												multilineVars.next_note_duration = br2[2];
												chordDuration = br2[1];
												break;
											case '1':
											case '2':
											case '3':
											case '4':
											case '5':
											case '6':
											case '7':
											case '8':
											case '9':
											case '/':
												var fraction = tokenizer.getFraction(line, i);
												chordDuration = fraction.value;
												i = fraction.index;
												postChordDone = true;
												break;
											default:
												postChordDone = true;
												break;
										}
										if (!postChordDone) {
											i++;
										}
									}
								} else
									warn("Expected ']' to end the chords", line, i);

								if (el.pitches !== undefined) {
									if (chordDuration !== null) {
										el.duration = el.duration * chordDuration;
//											window.ABCJS.parse.each(el.pitches, function(p) {
//												p.duration = p.duration * chordDuration;
//											});
									}
									if (multilineVars.barNumOnNextNote) {
										el.barNumber = multilineVars.barNumOnNextNote;
										multilineVars.barNumOnNextNote = null;
									}
									tune.appendElement('note', startOfLine+i, startOfLine+i, el);
									multilineVars.measureNotEmpty = true;
									el = {};
								}
								done = true;
							}
						}

					} else {
						// Single pitch
						var el2 = {};
						var core = getCoreNote(line, i, el2, true);
						if (el2.endTie !== undefined) multilineVars.inTie = true;
						if (core !== null) {
							if (core.pitch !== undefined) {
								el.pitches = [ { } ];
								// TODO-PER: straighten this out so there is not so much copying: getCoreNote shouldn't change e'
								if (core.accidental !== undefined) el.pitches[0].accidental = core.accidental;
								el.pitches[0].pitch = core.pitch;
								if (core.endSlur !== undefined) el.pitches[0].endSlur = core.endSlur;
								if (core.endTie !== undefined) el.pitches[0].endTie = core.endTie;
								if (core.startSlur !== undefined) el.pitches[0].startSlur = core.startSlur;
								if (el.startSlur !== undefined) el.pitches[0].startSlur = el.startSlur;
								if (core.startTie !== undefined) el.pitches[0].startTie = core.startTie;
								if (el.startTie !== undefined) el.pitches[0].startTie = el.startTie;
							} else {
								el.rest = core.rest;
								if (core.endSlur !== undefined) el.endSlur = core.endSlur;
								if (core.endTie !== undefined) el.rest.endTie = core.endTie;
								if (core.startSlur !== undefined) el.startSlur = core.startSlur;
								//if (el.startSlur !== undefined) el.startSlur = el.startSlur;
								if (core.startTie !== undefined) el.rest.startTie = core.startTie;
								if (el.startTie !== undefined) el.rest.startTie = el.startTie;
							}

							if (core.chord !== undefined) el.chord = core.chord;
							if (core.duration !== undefined) el.duration = core.duration;
							if (core.decoration !== undefined) el.decoration = core.decoration;
							if (core.graceNotes !== undefined) el.graceNotes = core.graceNotes;
							delete el.startSlur;
							if (multilineVars.inTie) {
								if (el.pitches !== undefined)
									el.pitches[0].endTie = true;
								else
									el.rest.endTie = true;
								multilineVars.inTie = false;
							}
							if (core.startTie || el.startTie)
								multilineVars.inTie = true;
							i  = core.endChar;

							if (tripletNotesLeft > 0) {
								tripletNotesLeft--;
								if (tripletNotesLeft === 0) {
									el.endTriplet = true;
								}
							}

							if (core.end_beam)
								addEndBeam(el);

							if (multilineVars.barNumOnNextNote) {
								el.barNumber = multilineVars.barNumOnNextNote;
								multilineVars.barNumOnNextNote = null;
							}
							tune.appendElement('note', startOfLine+startI, startOfLine+i, el);
							multilineVars.measureNotEmpty = true;
							el = {};
						}
					}

					if (i === startI) {	// don't know what this is, so ignore it.
						if (line.charAt(i) !== ' ' && line.charAt(i) !== '`')
							warn("Unknown character ignored", line, i);
//							warn("Unknown character ignored (" + line.charCodeAt(i) + ")", line, i);
						i++;
					}
				}
			}
		}
	};

	var parseLine = function(line) {
		var ret = header.parseHeader(line);
		if (ret.regular)
			parseRegularMusicLine(ret.str);
		if (ret.newline && multilineVars.continueall === undefined)
			startNewLine();
		if (ret.words)
			addWords(tune.getCurrentVoice(), line.substring(2));
		if (ret.symbols)
			addSymbols(tune.getCurrentVoice(), line.substring(2));
		if (ret.recurse)
			parseLine(ret.str);
	};

	this.parse = function(strTune, switches) {
		// the switches are optional and cause a difference in the way the tune is parsed.
		// switches.header_only : stop parsing when the header is finished
		// switches.stop_on_warning : stop at the first warning encountered.
		// switches.print: format for the page instead of the browser.
		tune.reset();
		if (switches && switches.print)
			tune.media = 'print';
		multilineVars.reset();
		header.reset(tokenizer, warn, multilineVars, tune);

		// Take care of whatever line endings come our way
		strTune = window.ABCJS.parse.gsub(strTune, '\r\n', '\n');
		strTune = window.ABCJS.parse.gsub(strTune, '\r', '\n');
		strTune += '\n';	// Tacked on temporarily to make the last line continuation work
		strTune = strTune.replace(/\n\\.*\n/g, "\n");	// get rid of latex commands.
		var continuationReplacement = function(all, backslash, comment){
			var spaces = "                                                                                                                                                                                                     ";
			var padding = comment ? spaces.substring(0, comment.length) : "";
			return backslash + " \x12" + padding;
		};
		strTune = strTune.replace(/\\([ \t]*)(%.*)*\n/g, continuationReplacement);	// take care of line continuations right away, but keep the same number of characters
		var lines = strTune.split('\n');
		if (window.ABCJS.parse.last(lines).length === 0)	// remove the blank line we added above.
			lines.pop();
		try {
			window.ABCJS.parse.each(lines,  function(line) {
				if (switches) {
					if (switches.header_only && multilineVars.is_in_header === false)
						throw "normal_abort";
					if (switches.stop_on_warning && multilineVars.warnings)
						throw "normal_abort";
				}
				if (multilineVars.is_in_history) {
					if (line.charAt(1) === ':') {
						multilineVars.is_in_history = false;
						parseLine(line);
					} else
						tune.addMetaText("history", tokenizer.translateString(tokenizer.stripComment(line)));
				} else if (multilineVars.inTextBlock) {
					if (window.ABCJS.parse.startsWith(line, "%%endtext")) {
						//tune.addMetaText("textBlock", multilineVars.textBlock);
						tune.addText(multilineVars.textBlock);
						multilineVars.inTextBlock = false;
					}
					else {
						if (window.ABCJS.parse.startsWith(line, "%%"))
							multilineVars.textBlock += ' ' + line.substring(2);
						else
							multilineVars.textBlock += ' ' + line;
					}
				} else if (multilineVars.inPsBlock) {
					if (window.ABCJS.parse.startsWith(line, "%%endps")) {
						// Just ignore postscript
						multilineVars.inPsBlock = false;
					}
					else
						multilineVars.textBlock += ' ' + line;
				} else
					parseLine(line);
				multilineVars.iChar += line.length + 1;
			});
			var ph = 11*72;
			var pl = 8.5*72;
			switch (multilineVars.papersize) {
				//case "letter": ph = 11*72; pl = 8.5*72; break;
				case "legal": ph = 14*72; pl = 8.5*72; break;
				case "A4": ph = 11.7*72; pl = 8.3*72; break;
			}
			if (multilineVars.landscape) {
				var x = ph;
				ph = pl;
				pl = x;
			}
			tune.cleanUp(pl, ph, multilineVars.barsperstaff, multilineVars.staffnonote);
		} catch (err) {
			if (err !== "normal_abort")
				throw err;
		}
	};
};
/*global window */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.parse)
	window.ABCJS.parse = {};

window.ABCJS.parse.parseDirective = {};

(function() {
	var tokenizer;
	var warn;
	var multilineVars;
	var tune;
	window.ABCJS.parse.parseDirective.initialize = function(tokenizer_, warn_, multilineVars_, tune_) {
		tokenizer = tokenizer_;
		warn = warn_;
		multilineVars = multilineVars_;
		tune = tune_;
	};

	window.ABCJS.parse.parseDirective.parseFontChangeLine = function(textstr) {
		var textParts = textstr.split('$');
		if (textParts.length > 1 && multilineVars.setfont) {
			var textarr = [ { text: textParts[0] }];
			for (var i = 1; i < textParts.length; i++) {
				if (textParts[i].charAt(0) === '0')
					textarr.push({ text: textParts[i].substring(1) });
				else if (textParts[i].charAt(0) === '1' && multilineVars.setfont[1])
					textarr.push({font: multilineVars.setfont[1], text: textParts[i].substring(1) });
				else if (textParts[i].charAt(0) === '2' && multilineVars.setfont[2])
					textarr.push({font: multilineVars.setfont[2], text: textParts[i].substring(1) });
				else if (textParts[i].charAt(0) === '3' && multilineVars.setfont[3])
					textarr.push({font: multilineVars.setfont[3], text: textParts[i].substring(1) });
				else if (textParts[i].charAt(0) === '4' && multilineVars.setfont[4])
					textarr.push({font: multilineVars.setfont[4], text: textParts[i].substring(1) });
				else
					textarr[textarr.length-1].text += '$' + textParts[i];
			}
			if (textarr.length > 1)
				return textarr;
		}
		return textstr;
	};

	window.ABCJS.parse.parseDirective.addDirective = function(str) {
		var getRequiredMeasurement = function(cmd, tokens) {
			var points = tokenizer.getMeasurement(tokens);
			if (points.used === 0 || tokens.length !== 0)
				return { error: "Directive \"" + cmd + "\" requires a measurement as a parameter."};
			return points.value;
		};
		var oneParameterMeasurement = function(cmd, tokens) {
			var points = tokenizer.getMeasurement(tokens);
			if (points.used === 0 || tokens.length !== 0)
				return "Directive \"" + cmd + "\" requires a measurement as a parameter.";
			tune.formatting[cmd] = points.value;
			return null;
		};
		var getFontParameter = function(tokens) {
			var font = {};
			var token = window.ABCJS.parse.last(tokens);
			if (token.type === 'number') {
				font.size = parseInt(token.token);
				tokens.pop();
			}
			if (tokens.length > 0) {
				var scratch = "";
				window.ABCJS.parse.each(tokens, function(tok) {
					if (tok.token !== '-') {
						if (scratch.length > 0) scratch += ' ';
						scratch += tok.token;
					}
				});
				font.font = scratch;
			}
			return font;
		};
		var getChangingFont = function(cmd, tokens) {
			if (tokens.length === 0)
				return "Directive \"" + cmd + "\" requires a font as a parameter.";
			multilineVars[cmd] = getFontParameter(tokens);
			return null;
		};
		var getGlobalFont = function(cmd, tokens) {
			if (tokens.length === 0)
				return "Directive \"" + cmd + "\" requires a font as a parameter.";
			tune.formatting[cmd] = getFontParameter(tokens);
			return null;
		};

		var addMultilineVar = function(key, cmd, tokens, min, max) {
			if (tokens.length !== 1 || tokens[0].type !== 'number')
				return "Directive \"" + cmd + "\" requires a number as a parameter.";
			var i = tokens[0].intt;
			if (min !== undefined && i < min)
				return "Directive \"" + cmd + "\" requires a number greater than or equal to " + min + " as a parameter.";
			if (max !== undefined && i > max)
				return "Directive \"" + cmd + "\" requires a number less than or equal to " + max + " as a parameter.";
			multilineVars[key] = i;
			return null;
		};

		var addMultilineVarBool = function(key, cmd, tokens) {
			var str = addMultilineVar(key, cmd, tokens, 0, 1);
			if (str !== null) return str;
			multilineVars[key] = (multilineVars[key] === 1);
			return null;
		};

		var tokens = tokenizer.tokenize(str, 0, str.length);	// 3 or more % in a row, or just spaces after %% is just a comment
		if (tokens.length === 0 || tokens[0].type !== 'alpha') return null;
		var restOfString = str.substring(str.indexOf(tokens[0].token)+tokens[0].token.length);
		restOfString = tokenizer.stripComment(restOfString);
		var cmd = tokens.shift().token.toLowerCase();
		var num;
		var scratch = "";
		switch (cmd)
		{
			// The following directives were added to abc_parser_lint, but haven't been implemented here.
			// Most of them are direct translations from the directives that will be parsed in. See abcm2ps's format.txt for info on each of these.
			//					alignbars: { type: "number", optional: true },
			//					aligncomposer: { type: "string", Enum: [ 'left', 'center','right' ], optional: true },
			//					annotationfont: fontType,
			//					bstemdown: { type: "boolean", optional: true },
			//					continueall: { type: "boolean", optional: true },
			//					dynalign: { type: "boolean", optional: true },
			//					exprabove: { type: "boolean", optional: true },
			//					exprbelow: { type: "boolean", optional: true },
			//					flatbeams: { type: "boolean", optional: true },
			//					footer: { type: "string", optional: true },
			//					footerfont: fontType,
			//					gchordbox: { type: "boolean", optional: true },
			//					graceslurs: { type: "boolean", optional: true },
			//					gracespacebefore: { type: "number", optional: true },
			//					gracespaceinside: { type: "number", optional: true },
			//					gracespaceafter: { type: "number", optional: true },
			//					header: { type: "string", optional: true },
			//					headerfont: fontType,
			//					historyfont: fontType,
			//					infofont: fontType,
			//					infospace: { type: "number", optional: true },
			//					lineskipfac: { type: "number", optional: true },
			//					maxshrink: { type: "number", optional: true },
			//					maxstaffsep: { type: "number", optional: true },
			//					maxsysstaffsep: { type: "number", optional: true },
			//					measurebox: { type: "boolean", optional: true },
			//					measurefont: fontType,
			//					notespacingfactor: { type: "number", optional: true },
			//					parskipfac: { type: "number", optional: true },
			//					partsbox: { type: "boolean", optional: true },
			//					repeatfont: fontType,
			//					rightmargin: { type: "number", optional: true },
			//					slurheight: { type: "number", optional: true },
			//					splittune: { type: "boolean", optional: true },
			//					squarebreve: { type: "boolean", optional: true },
			//					stemheight: { type: "number", optional: true },
			//					straightflags: { type: "boolean", optional: true },
			//					stretchstaff: { type: "boolean", optional: true },
			//					textfont: fontType,
			//					titleformat: { type: "string", optional: true },
			//					vocalabove: { type: "boolean", optional: true },
			//					vocalfont: fontType,
			//					wordsfont: fontType,
			case "bagpipes":tune.formatting.bagpipes = true;break;
			case "landscape":multilineVars.landscape = true;break;
			case "papersize":multilineVars.papersize = restOfString;break;
			case "slurgraces":tune.formatting.slurgraces = true;break;
			case "stretchlast":tune.formatting.stretchlast = true;break;
			case "titlecaps":multilineVars.titlecaps = true;break;
			case "titleleft":tune.formatting.titleleft = true;break;
			case "measurebox":tune.formatting.measurebox = true;break;

			case "botmargin":
			case "botspace":
			case "composerspace":
			case "indent":
			case "leftmargin":
			case "linesep":
			case "musicspace":
			case "partsspace":
			case "pageheight":
			case "pagewidth":
			case "rightmargin":
			case "staffsep":
			case "staffwidth":
			case "subtitlespace":
			case "sysstaffsep":
			case "systemsep":
			case "textspace":
			case "titlespace":
			case "topmargin":
			case "topspace":
			case "vocalspace":
			case "wordsspace":
				return oneParameterMeasurement(cmd, tokens);
			case "vskip":
				var vskip = getRequiredMeasurement(cmd, tokens);
				if (vskip.error)
					return vskip.error;
				tune.addSpacing(vskip);
				return null;
			case "scale":
				scratch = "";
				window.ABCJS.parse.each(tokens, function(tok) {
					scratch += tok.token;
				});
				num = parseFloat(scratch);
				if (isNaN(num) || num === 0)
					return "Directive \"" + cmd + "\" requires a number as a parameter.";
				tune.formatting.scale = num;
				break;
			case "sep":
				if (tokens.length === 0)
					tune.addSeparator();
				else {
					var points = tokenizer.getMeasurement(tokens);
					if (points.used === 0)
						return "Directive \"" + cmd + "\" requires 3 numbers: space above, space below, length of line";
					var spaceAbove = points.value;

					points = tokenizer.getMeasurement(tokens);
					if (points.used === 0)
						return "Directive \"" + cmd + "\" requires 3 numbers: space above, space below, length of line";
					var spaceBelow = points.value;

					points = tokenizer.getMeasurement(tokens);
					if (points.used === 0 || tokens.length !== 0)
						return "Directive \"" + cmd + "\" requires 3 numbers: space above, space below, length of line";
					var lenLine = points.value;
					tune.addSeparator(spaceAbove, spaceBelow, lenLine);
				}
				break;
			case "barsperstaff":
				scratch = addMultilineVar('barsperstaff', cmd, tokens);
				if (scratch !== null) return scratch;
				break;
			case "staffnonote":
				scratch = addMultilineVarBool('staffnonote', cmd, tokens);
				if (scratch !== null) return scratch;
				break;
			case "printtempo":
				scratch = addMultilineVarBool('printTempo', cmd, tokens);
				if (scratch !== null) return scratch;
				break;
			case "measurenb":
			case "barnumbers":
				scratch = addMultilineVar('barNumbers', cmd, tokens);
				if (scratch !== null) return scratch;
				break;
			case "begintext":
				multilineVars.inTextBlock = true;
				break;
			case "continueall":
				multilineVars.continueall = true;
				break;
			case "beginps":
				multilineVars.inPsBlock = true;
				warn("Postscript ignored", str, 0);
				break;
			case "deco":
				if (restOfString.length > 0)
					multilineVars.ignoredDecorations.push(restOfString.substring(0, restOfString.indexOf(' ')));
				warn("Decoration redefinition ignored", str, 0);
				break;
			case "text":
				var textstr = tokenizer.translateString(restOfString);
				tune.addText(window.ABCJS.parse.parseDirective.parseFontChangeLine(textstr));
				break;
			case "center":
				var centerstr = tokenizer.translateString(restOfString);
				tune.addCentered(window.ABCJS.parse.parseDirective.parseFontChangeLine(centerstr));
				break;
			case "font":
				// don't need to do anything for this; it is a useless directive
				break;
			case "setfont":
				var sfTokens = tokenizer.tokenize(restOfString, 0, restOfString.length);
				var sfDone = false;
				if (sfTokens.length >= 4) {
					if (sfTokens[0].token === '-' && sfTokens[1].type === 'number') {
						var sfNum = parseInt(sfTokens[1].token);
						if (sfNum >= 1 && sfNum <= 4) {
							if (!multilineVars.setfont)
								multilineVars.setfont = [];
							var sfSize = sfTokens.pop();
							if (sfSize.type === 'number') {
								sfSize = parseInt(sfSize.token);
								var sfFontName = '';
								for (var sfi = 2; sfi < sfTokens.length; sfi++)
									sfFontName += sfTokens[sfi].token;
								multilineVars.setfont[sfNum] = { font: sfFontName, size: sfSize };
								sfDone = true;
							}
						}
					}
				}
				if (!sfDone)
					return "Bad parameters: " + cmd;
				break;
			case "gchordfont":
			case "partsfont":
			case "vocalfont":
			case "textfont":
				return getChangingFont(cmd, tokens);
			case "barlabelfont":
			case "barnumberfont":
			case "composerfont":
			case "subtitlefont":
			case "tempofont":
			case "titlefont":
			case "voicefont":
				return getGlobalFont(cmd, tokens);
			case "barnumfont":
				return getGlobalFont("barnumberfont", tokens);
			case "staves":
			case "score":
				multilineVars.score_is_present = true;
				var addVoice = function(id, newStaff, bracket, brace, continueBar) {
					if (newStaff || multilineVars.staves.length === 0) {
						multilineVars.staves.push({index: multilineVars.staves.length, numVoices: 0});
					}
					var staff = window.ABCJS.parse.last(multilineVars.staves);
					if (bracket !== undefined) staff.bracket = bracket;
					if (brace !== undefined) staff.brace = brace;
					if (continueBar) staff.connectBarLines = 'end';
					if (multilineVars.voices[id] === undefined) {
						multilineVars.voices[id] = {staffNum: staff.index, index: staff.numVoices};
						staff.numVoices++;
					}
				};

				var openParen = false;
				var openBracket = false;
				var openBrace = false;
				var justOpenParen = false;
				var justOpenBracket = false;
				var justOpenBrace = false;
				var continueBar = false;
				var lastVoice;
				var addContinueBar = function() {
					continueBar = true;
					if (lastVoice) {
						var ty = 'start';
						if (lastVoice.staffNum > 0) {
							if (multilineVars.staves[lastVoice.staffNum-1].connectBarLines === 'start' ||
								multilineVars.staves[lastVoice.staffNum-1].connectBarLines === 'continue')
								ty = 'continue';
						}
						multilineVars.staves[lastVoice.staffNum].connectBarLines = ty;
					}
				};
				while (tokens.length) {
					var t = tokens.shift();
					switch (t.token) {
						case '(':
							if (openParen) warn("Can't nest parenthesis in %%score", str, t.start);
							else {openParen = true;justOpenParen = true;}
							break;
						case ')':
							if (!openParen || justOpenParen) warn("Unexpected close parenthesis in %%score", str, t.start);
							else openParen = false;
							break;
						case '[':
							if (openBracket) warn("Can't nest brackets in %%score", str, t.start);
							else {openBracket = true;justOpenBracket = true;}
							break;
						case ']':
							if (!openBracket || justOpenBracket) warn("Unexpected close bracket in %%score", str, t.start);
							else {openBracket = false;multilineVars.staves[lastVoice.staffNum].bracket = 'end';}
							break;
						case '{':
							if (openBrace ) warn("Can't nest braces in %%score", str, t.start);
							else {openBrace = true;justOpenBrace = true;}
							break;
						case '}':
							if (!openBrace || justOpenBrace) warn("Unexpected close brace in %%score", str, t.start);
							else {openBrace = false;multilineVars.staves[lastVoice.staffNum].brace = 'end';}
							break;
						case '|':
							addContinueBar();
							break;
						default:
							var vc = "";
							while (t.type === 'alpha' || t.type === 'number') {
								vc += t.token;
								if (t.continueId)
									t = tokens.shift();
								else
									break;
							}
							var newStaff = !openParen || justOpenParen;
							var bracket = justOpenBracket ? 'start' : openBracket ? 'continue' : undefined;
							var brace = justOpenBrace ? 'start' : openBrace ? 'continue' : undefined;
							addVoice(vc, newStaff, bracket, brace, continueBar);
							justOpenParen = false;
							justOpenBracket = false;
							justOpenBrace = false;
							continueBar = false;
							lastVoice = multilineVars.voices[vc];
							if (cmd === 'staves')
								addContinueBar();
							break;
					}
				}
				break;

			case "newpage":
				var pgNum = tokenizer.getInt(restOfString);
				tune.addNewPage(pgNum.digits === 0 ? -1 : pgNum.value);
				break;

			case "abc-copyright":
			case "abc-creator":
			case "abc-version":
			case "abc-charset":
			case "abc-edited-by":
				tune.addMetaText(cmd, restOfString);
				break;
			case "header":
			case "footer":
				var footerStr = tokenizer.getMeat(restOfString, 0, restOfString.length);
				footerStr = restOfString.substring(footerStr.start, footerStr.end);
				if (footerStr.charAt(0) === '"' && footerStr.charAt(footerStr.length-1) === '"' )
					footerStr = footerStr.substring(1, footerStr.length-2);
				var footerArr = footerStr.split('\t');
				var footer = {};
				if (footerArr.length === 1)
					footer = { left: "", center: footerArr[0], right: "" };
				else if (footerArr.length === 2)
					footer = { left: footerArr[0], center: footerArr[1], right: "" };
				else
					footer = { left: footerArr[0], center: footerArr[1], right: footerArr[2] };
				 if (footerArr.length > 3)
					 warn("Too many tabs in "+cmd+": "+footerArr.length+" found.", restOfString, 0);

				tune.addMetaTextObj(cmd, footer);
				break;

			case "midi":
				var midi = tokenizer.tokenize(restOfString, 0, restOfString.length);
				if (midi.length > 0 && midi[0].token === '=')
					midi.shift();
				if (midi.length === 0)
					warn("Expected midi command", restOfString, 0);
				else {
	//				var midiCmd = restOfString.split(' ')[0];
	//				var midiParam = restOfString.substring(midiCmd.length+1);
					var getNextMidiParam =  function(midiToks) {
						if (midiToks.length > 0) {
							var t = midiToks.shift();
							var p = t.token;
							if (t.type === "number")
								p = t.intt;
							return p;
						}
						else
							return null;
					};
					// TODO-PER: make sure the command is legal
					if (tune.formatting[cmd] === undefined)
						tune.formatting[cmd] = {};
					var midi_cmd = midi.shift().token;
					var midi_param = true;
					if (midi_cmd === 'program') {
						var p1 = getNextMidiParam(midi);
						if (p1) {
							var p2 = getNextMidiParam(midi);
							// NOTE: The program number has an off by one error in ABC, so we add one here.
							if (p2)
								midi_param = { channel: p1, program: p2};
							else
								midi_param = { program: p1};
						}
					} else {
						// TODO-PER: handle the params for all MIDI commands
						var p = getNextMidiParam(midi);
						if (p !== null)
							midi_param = p;
					}
					tune.formatting[cmd][midi_cmd] = midi_param;
					// TODO-PER: save all the parameters, not just the first.
				}
	//%%MIDI barlines: deactivates %%nobarlines.
	//%%MIDI bassprog n
	//%%MIDI bassvol n
	//%%MIDI beat ⟨int1⟩ ⟨int2⟩ ⟨int3⟩ ⟨int4⟩: controls the volumes of the notes in a measure. The first note in a bar has volume ⟨int1⟩; other ‘strong’ notes have volume ⟨int2⟩ and all the rest have volume ⟨int3⟩. These values must be in the range 0–127. The parameter ⟨int4⟩ determines which notes are ‘strong’. If the time signature is x/y, then each note is given a position number k = 0, 1, 2. . . x-1 within each bar. If k is a multiple of ⟨int4⟩, then the note is ‘strong’.
	//%%MIDI beataccents: reverts to normally emphasised notes. See also %%MIDI nobeat-
	//%%MIDI beatmod ⟨int⟩: increments the velocities as defined by %%MIDI beat
	//%%MIDI beatstring ⟨string⟩: similar to %%MIDI beat, but indicated with an fmp string.
	//%%MIDI c ⟨int⟩: specifies the MIDI pitch which corresponds to	. The default is 60.
	//%%MIDI channel ⟨int⟩: selects the melody channel ⟨int⟩ (1–16).
	//%%MIDI chordattack ⟨int⟩: delays the start of chord notes by ⟨int⟩ MIDI units.
	//%%MIDI chordname ⟨string int1 int2 int3 int4 int5 int6⟩: defines new chords or re-defines existing ones as was seen in Section 12.8.
	//%%MIDI chordprog 20 % Church organ
	//%%MIDI chordvol ⟨int⟩: sets the volume (velocity) of the chord notes to ⟨int⟩ (0–127).
	//%%MIDI control ⟨bass/chord⟩ ⟨int1 int2⟩: generates a MIDI control event. If %%control is followed by ⟨bass⟩ or ⟨chord⟩, the event apply to the bass or chord channel, otherwise it will be applied to the melody channel. ⟨int1⟩ is the MIDI control number (0–127) and ⟨int2⟩ the value (0–127).
	//%%MIDI deltaloudness⟨int⟩: bydefault,!crescendo!and!dimuendo!modifythebe- at variables ⟨vol1⟩ ⟨vol2⟩ ⟨vol3⟩ 15 volume units. This command allows the user to change this default.
	//%%MIDI drone ⟨int1 int2 int3 int4 int5⟩: specifies a two-note drone accompaniment. ⟨int1⟩ is the drone MIDI instrument, ⟨int2⟩ the MIDI pitch 1, ⟨int3⟩ the MIDI pitch 2, ⟨int4⟩ the MIDI volume 1, ⟨int5⟩ the MIDI volume 2. Default values are 70 45 33 80 80.
	//%%MIDI droneoff: turns the drone accompaniment off.
	//%%MIDI droneon: turns the drone accompaniment on.
	//%%MIDI drum string [drum programs] [drum velocities]
	//%%MIDI drumbars ⟨int⟩: specifies the number of bars over which a drum pattern string is spread. Default is 1.
	//%%MIDI drummap ⟨str⟩ ⟨int⟩: associates the note ⟨str⟩ (in ABC notation) to the a percussion instrument, as listed in Section H.2.
	//%%MIDI drumoff turns drum accompaniment off.
	//%%MIDI drumon turns drum accompaniment on.
	//%%MIDI fermatafixed: expands a !fermata! by one unit length; that is, GC3 becomes
	//%%MIDI fermataproportional: doubles the length of a note preceded by !fermata!;
	//%%MIDI gchord string
	//%%MIDI gchord str
	//%%MIDI gchordon
	//%%MIDI gchordoff
	//%%MIDI grace ⟨float⟩: sets the fraction of the next note that grace notes will take up. ⟨float⟩ must be a fraction such as 1/6.
	//%%MIDI gracedivider ⟨int⟩: sets the grace note length as 1/⟨int⟩th of the following note.
	//%%MIDI makechordchannels⟨int⟩: thisisaverycomplexcommandusedinchordscon-
	//%%MIDI nobarlines
	//%%MIDI nobeataccents: forces the ⟨int2⟩ volume (see %%MIDI beat) for each note in a bar, regardless of their position.
	//%%MIDI noportamento: turns off the portamento controller on the current channel.
	//%%MIDI pitchbend [bass/chord] <high byte> <low byte>
	//%%MIDI program 2 75
	//%%MIDI portamento ⟨int⟩: turns on the portamento controller on the current channel and set it to ⟨int⟩. Experts only.
	//%%MIDI randomchordattack: delays the start of chord notes by a random number of MIDI units.
	//%%MIDI ratio n m
	//%%MIDI rtranspose ⟨int1⟩: transposes relatively to a prior %%transpose command by ⟨int1⟩ semitones; the total transposition will be ⟨int1 + int2⟩ semitones.
	//%%MIDI temperament ⟨int1⟩ ⟨int2⟩: TO BE WRITTEN
	//%%MIDI temperamentlinear ⟨float1 float2⟩: changes the temperament of the scale. ⟨fl- oat1⟩ specifies the size of an octave in cents of a semitone, or 1/1200 of an octave. ⟨float2⟩ specifies in the size of a fifth (normally 700 cents).
	//%%MIDI temperamentnormal: restores normal temperament.
	//%%MIDI transpose n
	//%%MIDI voice [<ID>] [instrument=<integer> [bank=<integer>]] [mute]
				break;

			case "playtempo":
			case "auquality":
			case "continuous":
			case "nobarcheck":
				// TODO-PER: Actually handle the parameters of these
				tune.formatting[cmd] = restOfString;
				break;
			default:
				return "Unknown directive: " + cmd;
		}
		return null;
	};

})();
//    abc_parse_header.js: parses a the header fields from a string representing ABC Music Notation into a usable internal structure.
//    Copyright (C) 2010 Paul Rosen (paul at paulrosen dot net)
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.

/*global window */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.parse)
	window.ABCJS.parse = {};

window.ABCJS.parse.ParseHeader = function(tokenizer, warn, multilineVars, tune) {
	this.reset = function(tokenizer, warn, multilineVars, tune) {
		window.ABCJS.parse.parseKeyVoice.initialize(tokenizer, warn, multilineVars, tune);
		window.ABCJS.parse.parseDirective.initialize(tokenizer, warn, multilineVars, tune);
	};
	this.reset(tokenizer, warn, multilineVars, tune);

	this.setTitle = function(title) {
		if (multilineVars.hasMainTitle)
			tune.addSubtitle(tokenizer.translateString(tokenizer.stripComment(title)));	// display secondary title
		else
		{
			tune.addMetaText("title", tokenizer.translateString(tokenizer.theReverser(tokenizer.stripComment(title))));
			multilineVars.hasMainTitle = true;
		}
	};

	this.setMeter = function(line) {
		line = tokenizer.stripComment(line);
		if (line === 'C') {
			if (multilineVars.havent_set_length === true)
				multilineVars.default_length = 0.125;
			return {type: 'common_time'};
		} else if (line === 'C|') {
			if (multilineVars.havent_set_length === true)
				multilineVars.default_length = 0.125;
			return {type: 'cut_time'};
		} else if (line === 'o') {
			if (multilineVars.havent_set_length === true)
				multilineVars.default_length = 0.125;
			return {type: 'tempus_perfectum'};
		} else if (line === 'c') {
			if (multilineVars.havent_set_length === true)
				multilineVars.default_length = 0.125;
			return {type: 'tempus_imperfectum'};
		} else if (line === 'o.') {
			if (multilineVars.havent_set_length === true)
				multilineVars.default_length = 0.125;
			return {type: 'tempus_perfectum_prolatio'};
		} else if (line === 'c.') {
			if (multilineVars.havent_set_length === true)
				multilineVars.default_length = 0.125;
			return {type: 'tempus_imperfectum_prolatio'};
		} else if (line.length === 0 || line.toLowerCase() === 'none') {
			if (multilineVars.havent_set_length === true)
				multilineVars.default_length = 0.125;
			return null;
		}
		else
		{
			var tokens = tokenizer.tokenize(line, 0, line.length);
			// the form is [open_paren] decimal [ plus|dot decimal ]... [close_paren] slash decimal [plus same_as_before]
			try {
				var parseNum = function() {
					// handles this much: [open_paren] decimal [ plus|dot decimal ]... [close_paren]
					var ret = {value: 0, num: ""};

					var tok = tokens.shift();
					if (tok.token === '(')
						tok = tokens.shift();
					while (1) {
						if (tok.type !== 'number') throw "Expected top number of meter";
						ret.value += parseInt(tok.token);
						ret.num += tok.token;
						if (tokens.length === 0 || tokens[0].token === '/') return ret;
						tok = tokens.shift();
						if (tok.token === ')') {
							if (tokens.length === 0 || tokens[0].token === '/') return ret;
							throw "Unexpected paren in meter";
						}
						if (tok.token !== '.' && tok.token !== '+') throw "Expected top number of meter";
						ret.num += tok.token;
						if (tokens.length === 0) throw "Expected top number of meter";
						tok = tokens.shift();
					}
					return ret;	// just to suppress warning
				};

				var parseFraction = function() {
					// handles this much: parseNum slash decimal
					var ret = parseNum();
					if (tokens.length === 0) return ret;
					var tok = tokens.shift();
					if (tok.token !== '/') throw "Expected slash in meter";
					tok = tokens.shift();
					if (tok.type !== 'number') throw "Expected bottom number of meter";
					ret.den = tok.token;
					ret.value = ret.value / parseInt(ret.den);
					return ret;
				};

				if (tokens.length === 0) throw "Expected meter definition in M: line";
				var meter = {type: 'specified', value: [ ]};
				var totalLength = 0;
				while (1) {
					var ret = parseFraction();
					totalLength += ret.value;
					var mv = { num: ret.num };
					if (ret.den !== undefined)
						mv.den = ret.den;
					meter.value.push(mv);
					if (tokens.length === 0) break;
					//var tok = tokens.shift();
					//if (tok.token !== '+') throw "Extra characters in M: line";
				}

				if (multilineVars.havent_set_length === true) {
					multilineVars.default_length = totalLength < 0.75 ? 0.0625 : 0.125;
				}
				return meter;
			} catch (e) {
				warn(e, line, 0);
			}
		}
		return null;
	};

	this.calcTempo = function(relTempo) {
		var dur = 1/4;
		if (multilineVars.meter && multilineVars.meter.type === 'specified') {
			dur = 1 / parseInt(multilineVars.meter.value[0].den);
		} else if (multilineVars.origMeter && multilineVars.origMeter.type === 'specified') {
			dur = 1 / parseInt(multilineVars.origMeter.value[0].den);
		}
		//var dur = multilineVars.default_length ? multilineVars.default_length : 1;
		for (var i = 0; i < relTempo.duration; i++)
			relTempo.duration[i] = dur * relTempo.duration[i];
		return relTempo;
	};

	this.resolveTempo = function() {
		if (multilineVars.tempo) {	// If there's a tempo waiting to be resolved
			this.calcTempo(multilineVars.tempo);
			tune.metaText.tempo = multilineVars.tempo;
			delete multilineVars.tempo;
		}
	};

	this.addUserDefinition = function(line, start, end) {
		var equals = line.indexOf('=', start);
		if (equals === -1) {
			warn("Need an = in a macro definition", line, start);
			return;
		}

		var before = window.ABCJS.parse.strip(line.substring(start, equals));
		var after = window.ABCJS.parse.strip(line.substring(equals+1));

		if (before.length !== 1) {
			warn("Macro definitions can only be one character", line, start);
			return;
		}
		var legalChars = "HIJKLMNOPQRSTUVWXYhijklmnopqrstuvw~";
		if (legalChars.indexOf(before) === -1) {
			warn("Macro definitions must be H-Y, h-w, or tilde", line, start);
			return;
		}
		if (after.length === 0) {
			warn("Missing macro definition", line, start);
			return;
		}
		if (multilineVars.macros === undefined)
			multilineVars.macros = {};
		multilineVars.macros[before] = after;
	};

	this.setDefaultLength = function(line, start, end) {
		var len = window.ABCJS.parse.gsub(line.substring(start, end), " ", "");
		var len_arr = len.split('/');
		if (len_arr.length === 2) {
			var n = parseInt(len_arr[0]);
			var d = parseInt(len_arr[1]);
			if (d > 0) {
				multilineVars.default_length = n / d;	// a whole note is 1
				multilineVars.havent_set_length = false;
			}
		}
	};

	this.setTempo = function(line, start, end) {
		//Q - tempo; can be used to specify the notes per minute, e.g. If
		//the meter denominator is a 4 note then Q:120 or Q:C=120
		//is 120 quarter notes per minute. Similarly  Q:C3=40 would be 40
		//dotted half notes per minute. An absolute tempo may also be
		//set, e.g. Q:1/8=120 is 120 eighth notes per minute,
		//irrespective of the meter's denominator.
		//
		// This is either a number, "C=number", "Cnumber=number", or fraction [fraction...]=number
		// It depends on the M: field, which may either not be present, or may appear after this.
		// If M: is not present, an eighth note is used.
		// That means that this field can't be calculated until the end, if it is the first three types, since we don't know if we'll see an M: field.
		// So, if it is the fourth type, set it here, otherwise, save the info in the multilineVars.
		// The temporary variables we keep are the duration and the bpm. In the first two forms, the duration is 1.
		// In addition, a quoted string may both precede and follow. If a quoted string is present, then the duration part is optional.
		try {
			var tokens = tokenizer.tokenize(line, start, end);

			if (tokens.length === 0) throw "Missing parameter in Q: field";

			var tempo = {};
			var delaySet = true;
			var token = tokens.shift();
			if (token.type === 'quote') {
				tempo.preString = token.token;
				token = tokens.shift();
				if (tokens.length === 0) {	// It's ok to just get a string for the tempo
					return {type: 'immediate', tempo: tempo};
				}
			}
			if (token.type === 'alpha' && token.token === 'C')	 { // either type 2 or type 3
				if (tokens.length === 0) throw "Missing tempo after C in Q: field";
				token = tokens.shift();
				if (token.type === 'punct' && token.token === '=') {
					// This is a type 2 format. The duration is an implied 1
					if (tokens.length === 0) throw "Missing tempo after = in Q: field";
					token = tokens.shift();
					if (token.type !== 'number') throw "Expected number after = in Q: field";
					tempo.duration = [1];
					tempo.bpm = parseInt(token.token);
				} else if (token.type === 'number') {
					// This is a type 3 format.
					tempo.duration = [parseInt(token.token)];
					if (tokens.length === 0) throw "Missing = after duration in Q: field";
					token = tokens.shift();
					if (token.type !== 'punct' || token.token !== '=') throw "Expected = after duration in Q: field";
					if (tokens.length === 0) throw "Missing tempo after = in Q: field";
					token = tokens.shift();
					if (token.type !== 'number') throw "Expected number after = in Q: field";
					tempo.bpm = parseInt(token.token);
				} else throw "Expected number or equal after C in Q: field";

			} else if (token.type === 'number') {	// either type 1 or type 4
				var num = parseInt(token.token);
				if (tokens.length === 0 || tokens[0].type === 'quote') {
					// This is type 1
					tempo.duration = [1];
					tempo.bpm = num;
				} else {	// This is type 4
					delaySet = false;
					token = tokens.shift();
					if (token.type !== 'punct' && token.token !== '/') throw "Expected fraction in Q: field";
					token = tokens.shift();
					if (token.type !== 'number') throw "Expected fraction in Q: field";
					var den = parseInt(token.token);
					tempo.duration = [num/den];
					// We got the first fraction, keep getting more as long as we find them.
					while (tokens.length > 0  && tokens[0].token !== '=' && tokens[0].type !== 'quote') {
						token = tokens.shift();
						if (token.type !== 'number') throw "Expected fraction in Q: field";
						num = parseInt(token.token);
						token = tokens.shift();
						if (token.type !== 'punct' && token.token !== '/') throw "Expected fraction in Q: field";
						token = tokens.shift();
						if (token.type !== 'number') throw "Expected fraction in Q: field";
						den = parseInt(token.token);
						tempo.duration.push(num/den);
					}
					token = tokens.shift();
					if (token.type !== 'punct' && token.token !== '=') throw "Expected = in Q: field";
					token = tokens.shift();
					if (token.type !== 'number') throw "Expected tempo in Q: field";
					tempo.bpm = parseInt(token.token);
				}
			} else throw "Unknown value in Q: field";
			if (tokens.length !== 0) {
				token = tokens.shift();
				if (token.type === 'quote') {
					tempo.postString = token.token;
					token = tokens.shift();
				}
				if (tokens.length !== 0) throw "Unexpected string at end of Q: field";
			}
			if (multilineVars.printTempo === false)
				tempo.suppress = true;
			return {type: delaySet?'delaySet':'immediate', tempo: tempo};
		} catch (msg) {
			warn(msg, line, start);
			return {type: 'none'};
		}
	};

	this.letter_to_inline_header = function(line, i)
	{
		var ws = tokenizer.eatWhiteSpace(line, i);
		i +=ws;
		if (line.length >= i+5 && line.charAt(i) === '[' && line.charAt(i+2) === ':') {
			var e = line.indexOf(']', i);
			switch(line.substring(i, i+3))
			{
				case "[I:":
					var err = window.ABCJS.parse.parseDirective.addDirective(line.substring(i+3, e));
					if (err) warn(err, line, i);
					return [ e-i+1+ws ];
				case "[M:":
					var meter = this.setMeter(line.substring(i+3, e));
					if (tune.hasBeginMusic() && meter)
						tune.appendStartingElement('meter', -1, -1, meter);
					else
						multilineVars.meter = meter;
					return [ e-i+1+ws ];
				case "[K:":
					var result = window.ABCJS.parse.parseKeyVoice.parseKey(line.substring(i+3, e));
					if (result.foundClef && tune.hasBeginMusic())
						tune.appendStartingElement('clef', -1, -1, multilineVars.clef);
					if (result.foundKey && tune.hasBeginMusic())
						tune.appendStartingElement('key', -1, -1, window.ABCJS.parse.parseKeyVoice.fixKey(multilineVars.clef, multilineVars.key));
					return [ e-i+1+ws ];
				case "[P:":
					tune.appendElement('part', -1, -1, {title: line.substring(i+3, e)});
					return [ e-i+1+ws ];
				case "[L:":
					this.setDefaultLength(line, i+3, e);
					return [ e-i+1+ws ];
				case "[Q:":
					if (e > 0) {
						var tempo = this.setTempo(line, i+3, e);
						if (tempo.type === 'delaySet') tune.appendElement('tempo', -1, -1, this.calcTempo(tempo.tempo));
						else if (tempo.type === 'immediate') tune.appendElement('tempo', -1, -1, tempo.tempo);
						return [ e-i+1+ws, line.charAt(i+1), line.substring(i+3, e)];
					}
					break;
				case "[V:":
					if (e > 0) {
						window.ABCJS.parse.parseKeyVoice.parseVoice(line, i+3, e);
						//startNewLine();
						return [ e-i+1+ws, line.charAt(i+1), line.substring(i+3, e)];
					}
					break;

				default:
					// TODO: complain about unhandled header
			}
		}
		return [ 0 ];
	};

	this.letter_to_body_header = function(line, i)
	{
		if (line.length >= i+3) {
			switch(line.substring(i, i+2))
			{
				case "I:":
					var err = window.ABCJS.parse.parseDirective.addDirective(line.substring(i+2));
					if (err) warn(err, line, i);
					return [ line.length ];
				case "M:":
					var meter = this.setMeter(line.substring(i+2));
					if (tune.hasBeginMusic() && meter)
						tune.appendStartingElement('meter', -1, -1, meter);
					return [ line.length ];
				case "K:":
					var result = window.ABCJS.parse.parseKeyVoice.parseKey(line.substring(i+2));
					if (result.foundClef && tune.hasBeginMusic())
						tune.appendStartingElement('clef', -1, -1, multilineVars.clef);
					if (result.foundKey && tune.hasBeginMusic())
						tune.appendStartingElement('key', -1, -1, window.ABCJS.parse.parseKeyVoice.fixKey(multilineVars.clef, multilineVars.key));
					return [ line.length ];
				case "P:":
					if (tune.hasBeginMusic())
						tune.appendElement('part', -1, -1, {title: line.substring(i+2)});
					return [ line.length ];
				case "L:":
					this.setDefaultLength(line, i+2, line.length);
					return [ line.length ];
				case "Q:":
					var e = line.indexOf('\x12', i+2);
					if (e === -1) e = line.length;
					var tempo = this.setTempo(line, i+2, e);
					if (tempo.type === 'delaySet') tune.appendElement('tempo', -1, -1, this.calcTempo(tempo.tempo));
					else if (tempo.type === 'immediate') tune.appendElement('tempo', -1, -1, tempo.tempo);
				return [ e, line.charAt(i), window.ABCJS.parse.strip(line.substring(i+2))];
				case "V:":
					window.ABCJS.parse.parseKeyVoice.parseVoice(line, 2, line.length);
//						startNewLine();
					return [ line.length, line.charAt(i), window.ABCJS.parse(line.substring(i+2))];
				default:
					// TODO: complain about unhandled header
			}
		}
		return [ 0 ];
	};

	var metaTextHeaders = {
		A: 'author',
		B: 'book',
		C: 'composer',
		D: 'discography',
		F: 'url',
		G: 'group',
		I: 'instruction',
		N: 'notes',
		O: 'origin',
		R: 'rhythm',
		S: 'source',
		W: 'unalignedWords',
		Z: 'transcription'
	};

	this.parseHeader = function(line) {
		if (window.ABCJS.parse.startsWith(line, '%%')) {
			var err = window.ABCJS.parse.parseDirective.addDirective(line.substring(2));
			if (err) warn(err, line, 2);
			return {};
		}
		line = tokenizer.stripComment(line);
		if (line.length === 0)
			return {};

		if (line.length >= 2) {
			if (line.charAt(1) === ':') {
				var nextLine = "";
				if (line.indexOf('\x12') >= 0 && line.charAt(0) !== 'w') {	// w: is the only header field that can have a continuation.
					nextLine = line.substring(line.indexOf('\x12')+1);
					line = line.substring(0, line.indexOf('\x12'));	//This handles a continuation mark on a header field
				}
				var field = metaTextHeaders[line.charAt(0)];
				if (field !== undefined) {
					if (field === 'unalignedWords')
						tune.addMetaTextArray(field, window.ABCJS.parse.parseDirective.parseFontChangeLine(tokenizer.translateString(tokenizer.stripComment(line.substring(2)))));
					else
						tune.addMetaText(field, tokenizer.translateString(tokenizer.stripComment(line.substring(2))));
					return {};
				} else {
					switch(line.charAt(0))
					{
						case  'H':
							tune.addMetaText("history", tokenizer.translateString(tokenizer.stripComment(line.substring(2))));
							multilineVars.is_in_history = true;
							break;
						case  'K':
							// since the key is the last thing that can happen in the header, we can resolve the tempo now
							this.resolveTempo();
							var result = window.ABCJS.parse.parseKeyVoice.parseKey(line.substring(2));
							if (!multilineVars.is_in_header && tune.hasBeginMusic()) {
								if (result.foundClef)
									tune.appendStartingElement('clef', -1, -1, multilineVars.clef);
								if (result.foundKey)
									tune.appendStartingElement('key', -1, -1, window.ABCJS.parse.parseKeyVoice.fixKey(multilineVars.clef, multilineVars.key));
							}
							multilineVars.is_in_header = false;	// The first key signifies the end of the header.
							break;
						case  'L':
							this.setDefaultLength(line, 2, line.length);
							break;
						case  'M':
							multilineVars.origMeter = multilineVars.meter = this.setMeter(line.substring(2));
							break;
						case  'P':
							// TODO-PER: There is more to do with parts, but the writer doesn't care.
							if (multilineVars.is_in_header)
								tune.addMetaText("partOrder", tokenizer.translateString(tokenizer.stripComment(line.substring(2))));
							else
								multilineVars.partForNextLine = tokenizer.translateString(tokenizer.stripComment(line.substring(2)));
							break;
						case  'Q':
							var tempo = this.setTempo(line, 2, line.length);
							if (tempo.type === 'delaySet') multilineVars.tempo = tempo.tempo;
							else if (tempo.type === 'immediate') tune.metaText.tempo = tempo.tempo;
							break;
						case  'T':
							this.setTitle(line.substring(2));
							break;
						case 'U':
							this.addUserDefinition(line, 2, line.length);
							break;
						case  'V':
							window.ABCJS.parse.parseKeyVoice.parseVoice(line, 2, line.length);
							if (!multilineVars.is_in_header)
								return {newline: true};
							break;
						case  's':
							return {symbols: true};
						case  'w':
							return {words: true};
						case 'X':
							break;
						case 'E':
						case 'm':
							warn("Ignored header", line, 0);
							break;
						default:
							// It wasn't a recognized header value, so parse it as music.
							if (nextLine.length)
								nextLine = "\x12" + nextLine;
							//parseRegularMusicLine(line+nextLine);
							//nextLine = "";
							return {regular: true, str: line+nextLine};
					}
				}
				if (nextLine.length > 0)
					return {recurse: true, str: nextLine};
				return {};
			}
		}

		// If we got this far, we have a regular line of mulsic
		return {regular: true, str: line};
	};
};
/*global window */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.parse)
	window.ABCJS.parse = {};

window.ABCJS.parse.parseKeyVoice = {};

(function() {
	var tokenizer;
	var warn;
	var multilineVars;
	var tune;
	window.ABCJS.parse.parseKeyVoice.initialize = function(tokenizer_, warn_, multilineVars_, tune_) {
		tokenizer = tokenizer_;
		warn = warn_;
		multilineVars = multilineVars_;
		tune = tune_;
	};

	window.ABCJS.parse.parseKeyVoice.standardKey = function(keyName) {
		var key1sharp = {acc: 'sharp', note: 'f'};
		var key2sharp = {acc: 'sharp', note: 'c'};
		var key3sharp = {acc: 'sharp', note: 'g'};
		var key4sharp = {acc: 'sharp', note: 'd'};
		var key5sharp = {acc: 'sharp', note: 'A'};
		var key6sharp = {acc: 'sharp', note: 'e'};
		var key7sharp = {acc: 'sharp', note: 'B'};
		var key1flat = {acc: 'flat', note: 'B'};
		var key2flat = {acc: 'flat', note: 'e'};
		var key3flat = {acc: 'flat', note: 'A'};
		var key4flat = {acc: 'flat', note: 'd'};
		var key5flat = {acc: 'flat', note: 'G'};
		var key6flat = {acc: 'flat', note: 'c'};
		var key7flat = {acc: 'flat', note: 'F'};

		var keys = {
			'C#': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp, key7sharp ],
			'A#m': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp, key7sharp ],
			'G#Mix': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp, key7sharp ],
			'D#Dor': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp, key7sharp ],
			'E#Phr': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp, key7sharp ],
			'F#Lyd': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp, key7sharp ],
			'B#Loc': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp, key7sharp ],

			'F#': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp ],
			'D#m': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp ],
			'C#Mix': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp ],
			'G#Dor': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp ],
			'A#Phr': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp ],
			'BLyd': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp ],
			'E#Loc': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp ],

			'B': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp ],
			'G#m': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp ],
			'F#Mix': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp ],
			'C#Dor': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp ],
			'D#Phr': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp ],
			'ELyd': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp ],
			'A#Loc': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp ],

			'E': [ key1sharp, key2sharp, key3sharp, key4sharp ],
			'C#m': [ key1sharp, key2sharp, key3sharp, key4sharp ],
			'BMix': [ key1sharp, key2sharp, key3sharp, key4sharp ],
			'F#Dor': [ key1sharp, key2sharp, key3sharp, key4sharp ],
			'G#Phr': [ key1sharp, key2sharp, key3sharp, key4sharp ],
			'ALyd': [ key1sharp, key2sharp, key3sharp, key4sharp ],
			'D#Loc': [ key1sharp, key2sharp, key3sharp, key4sharp ],

			'A': [ key1sharp, key2sharp, key3sharp ],
			'F#m': [ key1sharp, key2sharp, key3sharp ],
			'EMix': [ key1sharp, key2sharp, key3sharp ],
			'BDor': [ key1sharp, key2sharp, key3sharp ],
			'C#Phr': [ key1sharp, key2sharp, key3sharp ],
			'DLyd': [ key1sharp, key2sharp, key3sharp ],
			'G#Loc': [ key1sharp, key2sharp, key3sharp ],

			'D': [ key1sharp, key2sharp ],
			'Bm': [ key1sharp, key2sharp ],
			'AMix': [ key1sharp, key2sharp ],
			'EDor': [ key1sharp, key2sharp ],
			'F#Phr': [ key1sharp, key2sharp ],
			'GLyd': [ key1sharp, key2sharp ],
			'C#Loc': [ key1sharp, key2sharp ],

			'G': [ key1sharp ],
			'Em': [ key1sharp ],
			'DMix': [ key1sharp ],
			'ADor': [ key1sharp ],
			'BPhr': [ key1sharp ],
			'CLyd': [ key1sharp ],
			'F#Loc': [ key1sharp ],

			'C': [],
			'Am': [],
			'GMix': [],
			'DDor': [],
			'EPhr': [],
			'FLyd': [],
			'BLoc': [],

			'F': [ key1flat ],
			'Dm': [ key1flat ],
			'CMix': [ key1flat ],
			'GDor': [ key1flat ],
			'APhr': [ key1flat ],
			'BbLyd': [ key1flat ],
			'ELoc': [ key1flat ],

			'Bb': [ key1flat, key2flat ],
			'Gm': [ key1flat, key2flat ],
			'FMix': [ key1flat, key2flat ],
			'CDor': [ key1flat, key2flat ],
			'DPhr': [ key1flat, key2flat ],
			'EbLyd': [ key1flat, key2flat ],
			'ALoc': [ key1flat, key2flat ],

			'Eb': [ key1flat, key2flat, key3flat ],
			'Cm': [ key1flat, key2flat, key3flat ],
			'BbMix': [ key1flat, key2flat, key3flat ],
			'FDor': [ key1flat, key2flat, key3flat ],
			'GPhr': [ key1flat, key2flat, key3flat ],
			'AbLyd': [ key1flat, key2flat, key3flat ],
			'DLoc': [ key1flat, key2flat, key3flat ],

			'Ab': [ key1flat, key2flat, key3flat, key4flat ],
			'Fm': [ key1flat, key2flat, key3flat, key4flat ],
			'EbMix': [ key1flat, key2flat, key3flat, key4flat ],
			'BbDor': [ key1flat, key2flat, key3flat, key4flat ],
			'CPhr': [ key1flat, key2flat, key3flat, key4flat ],
			'DbLyd': [ key1flat, key2flat, key3flat, key4flat ],
			'GLoc': [ key1flat, key2flat, key3flat, key4flat ],

			'Db': [ key1flat, key2flat, key3flat, key4flat, key5flat ],
			'Bbm': [ key1flat, key2flat, key3flat, key4flat, key5flat ],
			'AbMix': [ key1flat, key2flat, key3flat, key4flat, key5flat ],
			'EbDor': [ key1flat, key2flat, key3flat, key4flat, key5flat ],
			'FPhr': [ key1flat, key2flat, key3flat, key4flat, key5flat ],
			'GbLyd': [ key1flat, key2flat, key3flat, key4flat, key5flat ],
			'CLoc': [ key1flat, key2flat, key3flat, key4flat, key5flat ],

			'Gb': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat ],
			'Ebm': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat ],
			'DbMix': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat ],
			'AbDor': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat ],
			'BbPhr': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat ],
			'CbLyd': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat ],
			'FLoc': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat ],

			'Cb': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat, key7flat ],
			'Abm': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat, key7flat ],
			'GbMix': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat, key7flat ],
			'DbDor': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat, key7flat ],
			'EbPhr': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat, key7flat ],
			'FbLyd': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat, key7flat ],
			'BbLoc': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat, key7flat ],

			// The following are not in the 2.0 spec, but seem normal enough.
			// TODO-PER: These SOUND the same as what's written, but they aren't right
			'A#': [ key1flat, key2flat ],
			'B#': [],
			'D#': [ key1flat, key2flat, key3flat ],
			'E#': [ key1flat ],
			'G#': [ key1flat, key2flat, key3flat, key4flat ],
			'Gbm': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp, key7sharp ]
		};

		return keys[keyName];
	};

	var clefLines = {
		'treble': { clef: 'treble', pitch: 4, mid: 0 },
		'treble+8': { clef: 'treble+8', pitch: 4, mid: 0 },
		'treble-8': { clef: 'treble-8', pitch: 4, mid: 0 },
		'treble1': { clef: 'treble', pitch: 2, mid: 2 },
		'treble2': { clef: 'treble', pitch: 4, mid: 0 },
		'treble3': { clef: 'treble', pitch: 6, mid: -2 },
		'treble4': { clef: 'treble', pitch: 8, mid: -4 },
		'treble5': { clef: 'treble', pitch: 10, mid: -6 },
		'perc': { clef: 'perc', pitch: 6, mid: 0 },
		'none': { clef: 'none', mid: 0 },
		'bass': { clef: 'bass', pitch: 8, mid: -12 },
		'bass+8': { clef: 'bass+8', pitch: 8, mid: -12 },
		'bass-8': { clef: 'bass-8', pitch: 8, mid: -12 },
		'bass+16': { clef: 'bass', pitch: 8, mid: -12 },
		'bass-16': { clef: 'bass', pitch: 8, mid: -12 },
		'bass1': { clef: 'bass', pitch: 2, mid: -6 },
		'bass2': { clef: 'bass', pitch: 4, mid: -8 },
		'bass3': { clef: 'bass', pitch: 6, mid: -10 },
		'bass4': { clef: 'bass', pitch: 8, mid: -12 },
		'bass5': { clef: 'bass', pitch: 10, mid: -14 },
		'tenor': { clef: 'alto', pitch: 8, mid: -8 },
		'tenor1': { clef: 'alto', pitch: 2, mid: -2 },
		'tenor2': { clef: 'alto', pitch: 4, mid: -4 },
		'tenor3': { clef: 'alto', pitch: 6, mid: -6 },
		'tenor4': { clef: 'alto', pitch: 8, mid: -8 },
		'tenor5': { clef: 'alto', pitch: 10, mid: -10 },
		'alto': { clef: 'alto', pitch: 6, mid: -6 },
		'alto1': { clef: 'alto', pitch: 2, mid: -2 },
		'alto2': { clef: 'alto', pitch: 4, mid: -4 },
		'alto3': { clef: 'alto', pitch: 6, mid: -6 },
		'alto4': { clef: 'alto', pitch: 8, mid: -8 },
		'alto5': { clef: 'alto', pitch: 10, mid: -10 },
		'alto+8': { clef: 'alto+8', pitch: 6, mid: -6 },
		'alto-8': { clef: 'alto-8', pitch: 6, mid: -6 }
	};

	var calcMiddle = function(clef, oct) {
		var value = clefLines[clef];
		var mid = value ? value.mid : 0;
		return mid+oct;
	};

	window.ABCJS.parse.parseKeyVoice.fixClef = function(clef) {
		var value = clefLines[clef.type];
		if (value) {
			clef.clefPos = value.pitch;
			clef.type = value.clef;
		}
	};

	window.ABCJS.parse.parseKeyVoice.deepCopyKey = function(key) {
		var ret = { accidentals: [], root: key.root, acc: key.acc, mode: key.mode };
		window.ABCJS.parse.each(key.accidentals, function(k) {
		ret.accidentals.push(window.ABCJS.parse.clone(k));
		});
		return ret;
	};

	var pitches = {A: 5, B: 6, C: 0, D: 1, E: 2, F: 3, G: 4, a: 12, b: 13, c: 7, d: 8, e: 9, f: 10, g: 11};

	window.ABCJS.parse.parseKeyVoice.addPosToKey = function(clef, key) {
		// Shift the key signature from the treble positions to whatever position is needed for the clef.
		// This may put the key signature unnaturally high or low, so if it does, then shift it.
		var mid = clef.verticalPos;
		window.ABCJS.parse.each(key.accidentals, function(acc) {
			var pitch = pitches[acc.note];
			pitch = pitch - mid;
			acc.verticalPos = pitch;
		});
		if (key.impliedNaturals)
			window.ABCJS.parse.each(key.impliedNaturals, function(acc) {
				var pitch = pitches[acc.note];
				pitch = pitch - mid;
				acc.verticalPos = pitch;
			});

		if (mid < -10) {
			window.ABCJS.parse.each(key.accidentals, function(acc) {
				acc.verticalPos -= 7;
				if (acc.verticalPos >= 11 || (acc.verticalPos === 10 && acc.acc === 'flat'))
					acc.verticalPos -= 7;
				if (acc.note === 'A' && acc.acc === 'sharp' )
					acc.verticalPos -=7;
				if ((acc.note === 'G' || acc.note === 'F') && acc.acc === 'flat' )
					acc.verticalPos -=7;
			});
			if (key.impliedNaturals)
				window.ABCJS.parse.each(key.impliedNaturals, function(acc) {
					acc.verticalPos -= 7;
					if (acc.verticalPos >= 11 || (acc.verticalPos === 10 && acc.acc === 'flat'))
						acc.verticalPos -= 7;
					if (acc.note === 'A' && acc.acc === 'sharp' )
						acc.verticalPos -=7;
					if ((acc.note === 'G' || acc.note === 'F') && acc.acc === 'flat' )
						acc.verticalPos -=7;
				});
		} else if (mid < -4) {
			window.ABCJS.parse.each(key.accidentals, function(acc) {
				acc.verticalPos -= 7;
				if (mid === -8 && (acc.note === 'f' || acc.note === 'g') && acc.acc === 'sharp' )
					acc.verticalPos -=7;
			});
			if (key.impliedNaturals)
				window.ABCJS.parse.each(key.impliedNaturals, function(acc) {
					acc.verticalPos -= 7;
					if (mid === -8 && (acc.note === 'f' || acc.note === 'g') && acc.acc === 'sharp' )
						acc.verticalPos -=7;
				});
		} else if (mid >= 7) {
			window.ABCJS.parse.each(key.accidentals, function(acc) {
				acc.verticalPos += 7;
			});
			if (key.impliedNaturals)
				window.ABCJS.parse.each(key.impliedNaturals, function(acc) {
					acc.verticalPos += 7;
				});
		}
	};

	window.ABCJS.parse.parseKeyVoice.fixKey = function(clef, key) {
		var fixedKey = window.ABCJS.parse.clone(key);
		window.ABCJS.parse.parseKeyVoice.addPosToKey(clef, fixedKey);
		return fixedKey;
	};

	var parseMiddle = function(str) {
	  var mid = pitches[str.charAt(0)];
		for (var i = 1; i < str.length; i++) {
			if (str.charAt(i) === ',') mid -= 7;
			else if (str.charAt(i) === ',') mid += 7;
			else break;
		}
		return { mid: mid - 6, str: str.substring(i) };	// We get the note in the middle of the staff. We want the note that appears as the first ledger line below the staff.
	};

	var normalizeAccidentals = function(accs) {
		for (var i = 0; i < accs.length; i++) {
			if (accs[i].note === 'b')
				accs[i].note = 'B';
			else if (accs[i].note === 'a')
				accs[i].note = 'A';
			else if (accs[i].note === 'F')
				accs[i].note = 'f';
			else if (accs[i].note === 'E')
				accs[i].note = 'e';
			else if (accs[i].note === 'D')
				accs[i].note = 'd';
			else if (accs[i].note === 'C')
				accs[i].note = 'c';
			else if (accs[i].note === 'G' && accs[i].acc === 'sharp')
				accs[i].note = 'g';
			else if (accs[i].note === 'g' && accs[i].acc === 'flat')
				accs[i].note = 'G';
		}
	};

	window.ABCJS.parse.parseKeyVoice.parseKey = function(str)	// (and clef)
	{
		// returns:
		//		{ foundClef: true, foundKey: true }
		// Side effects:
		//		calls warn() when there is a syntax error
		//		sets these members of multilineVars:
		//			clef
		//			key
		//			style
		//
		// The format is:
		// K: [⟨key⟩] [⟨modifiers⟩*]
		// modifiers are any of the following in any order:
		//  [⟨clef⟩] [middle=⟨pitch⟩] [transpose=[-]⟨number⟩] [stafflines=⟨number⟩] [staffscale=⟨number⟩][style=⟨style⟩]
		// key is none|HP|Hp|⟨specified_key⟩
		// clef is [clef=] [⟨clef type⟩] [⟨line number⟩] [+8|-8]
		// specified_key is ⟨pitch⟩[#|b][mode(first three chars are significant)][accidentals*]
		if (str.length === 0) {
			// an empty K: field is the same as K:none
			str = 'none';
		}
		var tokens = tokenizer.tokenize(str, 0, str.length);
		var ret = {};

		// first the key
		switch (tokens[0].token) {
			case 'HP':
				window.ABCJS.parse.parseDirective.addDirective("bagpipes");
				multilineVars.key = { root: "HP", accidentals: [], acc: "", mode: "" };
				ret.foundKey = true;
				tokens.shift();
				break;
			case 'Hp':
				window.ABCJS.parse.parseDirective.addDirective("bagpipes");
				multilineVars.key = { root: "Hp", accidentals: [{acc: 'natural', note: 'g'}, {acc: 'sharp', note: 'f'}, {acc: 'sharp', note: 'c'}], acc: "", mode: "" };
				ret.foundKey = true;
				tokens.shift();
				break;
			case 'none':
				// we got the none key - that's the same as C to us
				multilineVars.key = { root: "none", accidentals: [], acc: "", mode: "" };
				ret.foundKey = true;
				tokens.shift();
				break;
			default:
				var retPitch = tokenizer.getKeyPitch(tokens[0].token);
				if (retPitch.len > 0) {
					ret.foundKey = true;
					var acc = "";
					var mode = "";
					// The accidental and mode might be attached to the pitch, so we might want to just remove the first character.
					if (tokens[0].token.length > 1)
						tokens[0].token = tokens[0].token.substring(1);
					else
						tokens.shift();
					var key = retPitch.token;
					// We got a pitch to start with, so we might also have an accidental and a mode
					if (tokens.length > 0) {
						var retAcc = tokenizer.getSharpFlat(tokens[0].token);
						if (retAcc.len > 0) {
							if (tokens[0].token.length > 1)
								tokens[0].token = tokens[0].token.substring(1);
							else
								tokens.shift();
							key += retAcc.token;
							acc = retAcc.token;
						}
						if (tokens.length > 0) {
							var retMode = tokenizer.getMode(tokens[0].token);
							if (retMode.len > 0) {
								tokens.shift();
								key += retMode.token;
								mode = retMode.token;
							}
						}
					}
					// We need to do a deep copy because we are going to modify it
					var oldKey = window.ABCJS.parse.parseKeyVoice.deepCopyKey(multilineVars.key);
					multilineVars.key = window.ABCJS.parse.parseKeyVoice.deepCopyKey({accidentals: window.ABCJS.parse.parseKeyVoice.standardKey(key)});
					multilineVars.key.root = retPitch.token;
					multilineVars.key.acc = acc;
					multilineVars.key.mode = mode;
					if (oldKey) {
						// Add natural in all places that the old key had an accidental.
						var kk;
						for (var k = 0; k < multilineVars.key.accidentals.length; k++) {
							for (kk = 0; kk < oldKey.accidentals.length; kk++) {
								if (oldKey.accidentals[kk].note && multilineVars.key.accidentals[k].note.toLowerCase() === oldKey.accidentals[kk].note.toLowerCase())
									oldKey.accidentals[kk].note = null;
							}
						}
						for (kk = 0; kk < oldKey.accidentals.length; kk++) {
							if (oldKey.accidentals[kk].note) {
								if (!multilineVars.key.impliedNaturals)
									multilineVars.key.impliedNaturals = [];
								multilineVars.key.impliedNaturals.push({ acc: 'natural', note: oldKey.accidentals[kk].note });
							}
						}
					}
				}
				break;
		}

		// There are two special cases of deprecated syntax. Ignore them if they occur
		if (tokens.length === 0) return ret;
		if (tokens[0].token === 'exp') tokens.shift();
		if (tokens.length === 0) return ret;
		if (tokens[0].token === 'oct') tokens.shift();

		// now see if there are extra accidentals
		if (tokens.length === 0) return ret;
		var accs = tokenizer.getKeyAccidentals2(tokens);
		if (accs.warn)
			warn(accs.warn, str, 0);
		// If we have extra accidentals, first replace ones that are of the same pitch before adding them to the end.
		if (accs.accs) {
			if (!ret.foundKey) {		// if there are only extra accidentals, make sure this is set.
				ret.foundKey = true;
				multilineVars.key = { root: "none", acc: "", mode: "", accidentals: [] };
			}
			normalizeAccidentals(accs.accs);
			for (var i = 0; i < accs.accs.length; i++) {
				var found = false;
				for (var j = 0; j < multilineVars.key.accidentals.length && !found; j++) {
					if (multilineVars.key.accidentals[j].note === accs.accs[i].note) {
						found = true;
						multilineVars.key.accidentals[j].acc = accs.accs[i].acc;
					}
				}
				if (!found) {
					multilineVars.key.accidentals.push(accs.accs[i]);
					if (multilineVars.key.impliedNaturals) {
						for (var kkk = 0; kkk < multilineVars.key.impliedNaturals.length; kkk++) {
							if (multilineVars.key.impliedNaturals[kkk].note === accs.accs[i].note)
								multilineVars.key.impliedNaturals.splice(kkk, 1);
						}
					}
				}
			}
		}

		// Now see if any optional parameters are present. They have the form "key=value", except that "clef=" is optional
		var token;
		while (tokens.length > 0) {
			switch (tokens[0].token) {
				case "m":
				case "middle":
					tokens.shift();
					if (tokens.length === 0) { warn("Expected = after middle", str, 0); return ret; }
					token = tokens.shift();
					if (token.token !== "=") { warn("Expected = after middle", str, token.start); break; }
					if (tokens.length === 0) { warn("Expected parameter after middle=", str, 0); return ret; }
					var pitch = tokenizer.getPitchFromTokens(tokens);
					if (pitch.warn)
						warn(pitch.warn, str, 0);
					if (pitch.position)
						multilineVars.clef.verticalPos = pitch.position - 6;	// we get the position from the middle line, but want to offset it to the first ledger line.
					break;
				case "transpose":
					tokens.shift();
					if (tokens.length === 0) { warn("Expected = after transpose", str, 0); return ret; }
					token = tokens.shift();
					if (token.token !== "=") { warn("Expected = after transpose", str, token.start); break; }
					if (tokens.length === 0) { warn("Expected parameter after transpose=", str, 0); return ret; }
					if (tokens[0].type !== 'number') { warn("Expected number after transpose", str, tokens[0].start); break; }
					multilineVars.clef.transpose = tokens[0].intt;
					tokens.shift();
					break;
				case "stafflines":
					tokens.shift();
					if (tokens.length === 0) { warn("Expected = after stafflines", str, 0); return ret; }
					token = tokens.shift();
					if (token.token !== "=") { warn("Expected = after stafflines", str, token.start); break; }
					if (tokens.length === 0) { warn("Expected parameter after stafflines=", str, 0); return ret; }
					if (tokens[0].type !== 'number') { warn("Expected number after stafflines", str, tokens[0].start); break; }
					multilineVars.clef.stafflines = tokens[0].intt;
					tokens.shift();
					break;
				case "staffscale":
					tokens.shift();
					if (tokens.length === 0) { warn("Expected = after staffscale", str, 0); return ret; }
					token = tokens.shift();
					if (token.token !== "=") { warn("Expected = after staffscale", str, token.start); break; }
					if (tokens.length === 0) { warn("Expected parameter after staffscale=", str, 0); return ret; }
					if (tokens[0].type !== 'number') { warn("Expected number after staffscale", str, tokens[0].start); break; }
					multilineVars.clef.staffscale = tokens[0].floatt;
					tokens.shift();
					break;
				case "style":
					tokens.shift();
					if (tokens.length === 0) { warn("Expected = after style", str, 0); return ret; }
					token = tokens.shift();
					if (token.token !== "=") { warn("Expected = after style", str, token.start); break; }
					if (tokens.length === 0) { warn("Expected parameter after style=", str, 0); return ret; }
					switch (tokens[0].token) {
						case "normal":
						case "harmonic":
						case "rhythm":
						case "x":
							multilineVars.style = tokens[0].token;
							tokens.shift();
							break;
						default:
							warn("error parsing style element: " + tokens[0].token, str, tokens[0].start);
							break;
					}
					break;
				case "clef":
					tokens.shift();
					if (tokens.length === 0) { warn("Expected = after clef", str, 0); return ret; }
					token = tokens.shift();
					if (token.token !== "=") { warn("Expected = after clef", str, token.start); break; }
					if (tokens.length === 0) { warn("Expected parameter after clef=", str, 0); return ret; }
					//break; yes, we want to fall through. That allows "clef=" to be optional.
				case "treble":
				case "bass":
				case "alto":
				case "tenor":
				case "perc":
					// clef is [clef=] [⟨clef type⟩] [⟨line number⟩] [+8|-8]
					var clef = tokens.shift();
					switch (clef.token) {
						case 'treble':
						case 'tenor':
						case 'alto':
						case 'bass':
						case 'perc':
						case 'none':
							break;
						case 'C': clef.token = 'alto'; break;
						case 'F': clef.token = 'bass'; break;
						case 'G': clef.token = 'treble'; break;
						case 'c': clef.token = 'alto'; break;
						case 'f': clef.token = 'bass'; break;
						case 'g': clef.token = 'treble'; break;
						default:
							warn("Expected clef name. Found " + clef.token, str, clef.start);
							break;
					}
					if (tokens.length > 0 && tokens[0].type === 'number') {
						clef.token += tokens[0].token;
						tokens.shift();
					}
					if (tokens.length > 1 && (tokens[0].token === '-' || tokens[0].token === '+') && tokens[1].token === '8') {
						clef.token += tokens[0].token + tokens[1].token;
						tokens.shift();
						tokens.shift();
					}
					multilineVars.clef = {type: clef.token, verticalPos: calcMiddle(clef.token, 0)};
					ret.foundClef = true;
					break;
				default:
					warn("Unknown parameter: " + tokens[0].token, str, tokens[0].start);
					tokens.shift();
			}
		}
		return ret;
	};

	var setCurrentVoice = function(id) {
		multilineVars.currentVoice = multilineVars.voices[id];
		tune.setCurrentVoice(multilineVars.currentVoice.staffNum, multilineVars.currentVoice.index);
	};

	window.ABCJS.parse.parseKeyVoice.parseVoice = function(line, i, e) {
		//First truncate the string to the first non-space character after V: through either the
		//end of the line or a % character. Then remove trailing spaces, too.
		var ret = tokenizer.getMeat(line, i, e);
		var start = ret.start;
		var end = ret.end;
		//The first thing on the line is the ID. It can be any non-space string and terminates at the
		//first space.
		var id = tokenizer.getToken(line, start, end);
		if (id.length === 0) {
			warn("Expected a voice id", line, start);
			return;
		}
		var isNew = false;
		if (multilineVars.voices[id] === undefined) {
			multilineVars.voices[id] = {};
			isNew = true;
			if (multilineVars.score_is_present)
				warn("Can't have an unknown V: id when the %score directive is present", line, start);
		}
		start += id.length;
		start += tokenizer.eatWhiteSpace(line, start);

		var staffInfo = {startStaff: isNew};
		var addNextTokenToStaffInfo = function(name) {
			var attr = tokenizer.getVoiceToken(line, start, end);
			if (attr.warn !== undefined)
				warn("Expected value for " + name + " in voice: " + attr.warn, line, start);
			else if (attr.token.length === 0 && line.charAt(start) !== '"')
				warn("Expected value for " + name + " in voice", line, start);
			else
				staffInfo[name] = attr.token;
			start += attr.len;
		};
		var addNextTokenToVoiceInfo = function(id, name, type) {
			var attr = tokenizer.getVoiceToken(line, start, end);
			if (attr.warn !== undefined)
				warn("Expected value for " + name + " in voice: " + attr.warn, line, start);
			else if (attr.token.length === 0 && line.charAt(start) !== '"')
				warn("Expected value for " + name + " in voice", line, start);
			else {
				if (type === 'number')
					attr.token = parseFloat(attr.token);
				multilineVars.voices[id][name] = attr.token;
			}
			start += attr.len;
		};

		//Then the following items can occur in any order:
		while (start < end) {
			var token = tokenizer.getVoiceToken(line, start, end);
			start += token.len;

			if (token.warn) {
				warn("Error parsing voice: " + token.warn, line, start);
			} else {
				var attr = null;
				switch (token.token) {
					case 'clef':
					case 'cl':
						addNextTokenToStaffInfo('clef');
						// TODO-PER: check for a legal clef; do octavizing
						var oct = 0;
	//							for (var ii = 0; ii < staffInfo.clef.length; ii++) {
	//								if (staffInfo.clef[ii] === ',') oct -= 7;
	//								else if (staffInfo.clef[ii] === "'") oct += 7;
	//							}
						if (staffInfo.clef !== undefined) {
						  staffInfo.clef = staffInfo.clef.replace(/[',]/g, ""); //'//comment for emacs formatting of regexp
							if (staffInfo.clef.indexOf('+16') !== -1) {
								oct += 14;
								staffInfo.clef = staffInfo.clef.replace('+16', '');
							}
							staffInfo.verticalPos = calcMiddle(staffInfo.clef, oct);
						}
						break;
					case 'treble':
					case 'bass':
					case 'tenor':
					case 'alto':
					case 'none':
					case 'treble\'':
					case 'bass\'':
					case 'tenor\'':
					case 'alto\'':
					case 'none\'':
					case 'treble\'\'':
					case 'bass\'\'':
					case 'tenor\'\'':
					case 'alto\'\'':
					case 'none\'\'':
					case 'treble,':
					case 'bass,':
					case 'tenor,':
					case 'alto,':
					case 'none,':
					case 'treble,,':
					case 'bass,,':
					case 'tenor,,':
					case 'alto,,':
					case 'none,,':
						// TODO-PER: handle the octave indicators on the clef by changing the middle property
						var oct2 = 0;
	//							for (var iii = 0; iii < token.token.length; iii++) {
	//								if (token.token[iii] === ',') oct2 -= 7;
	//								else if (token.token[iii] === "'") oct2 += 7;
	//							}
											  staffInfo.clef = token.token.replace(/[',]/g, ""); //'//comment for emacs formatting of regexp
						staffInfo.verticalPos = calcMiddle(staffInfo.clef, oct2);
						break;
					case 'staves':
					case 'stave':
					case 'stv':
						addNextTokenToStaffInfo('staves');
						break;
					case 'brace':
					case 'brc':
						addNextTokenToStaffInfo('brace');
						break;
					case 'bracket':
					case 'brk':
						addNextTokenToStaffInfo('bracket');
						break;
					case 'name':
					case 'nm':
						addNextTokenToStaffInfo('name');
						break;
					case 'subname':
					case 'sname':
					case 'snm':
						addNextTokenToStaffInfo('subname');
						break;
					case 'merge':
						staffInfo.startStaff = false;
						break;
					case 'stems':
						attr = tokenizer.getVoiceToken(line, start, end);
						if (attr.warn !== undefined)
							warn("Expected value for stems in voice: " + attr.warn, line, start);
						else if (attr.token === 'up' || attr.token === 'down')
							multilineVars.voices[id].stem = attr.token;
						else
							warn("Expected up or down for voice stem", line, start);
						start += attr.len;
						break;
					case 'up':
					case 'down':
						multilineVars.voices[id].stem = token.token;
						break;
					case 'middle':
					case 'm':
						addNextTokenToStaffInfo('verticalPos');
						staffInfo.verticalPos = parseMiddle(staffInfo.verticalPos).mid;
						break;
					case 'gchords':
					case 'gch':
						multilineVars.voices[id].suppressChords = true;
						break;
					case 'space':
					case 'spc':
						addNextTokenToStaffInfo('spacing');
						break;
					case 'scale':
						addNextTokenToVoiceInfo(id, 'scale', 'number');
						break;
					case 'transpose':
						addNextTokenToVoiceInfo(id, 'transpose', 'number');
						break;
				}
			}
			start += tokenizer.eatWhiteSpace(line, start);
		}

		// now we've filled up staffInfo, figure out what to do with this voice
		// TODO-PER: It is unclear from the standard and the examples what to do with brace, bracket, and staves, so they are ignored for now.
		if (staffInfo.startStaff || multilineVars.staves.length === 0) {
			multilineVars.staves.push({index: multilineVars.staves.length, meter: multilineVars.origMeter});
			if (!multilineVars.score_is_present)
				multilineVars.staves[multilineVars.staves.length-1].numVoices = 0;
		}
		if (multilineVars.voices[id].staffNum === undefined) {
			// store where to write this for quick access later.
			multilineVars.voices[id].staffNum = multilineVars.staves.length-1;
			var vi = 0;
			for(var v in multilineVars.voices) {
				if(multilineVars.voices.hasOwnProperty(v)) {
					if (multilineVars.voices[v].staffNum === multilineVars.voices[id].staffNum)
						vi++;
				}
			}
			multilineVars.voices[id].index = vi-1;
		}
		var s = multilineVars.staves[multilineVars.voices[id].staffNum];
		if (!multilineVars.score_is_present)
			s.numVoices++;
		if (staffInfo.clef) s.clef = {type: staffInfo.clef, verticalPos: staffInfo.verticalPos};
		if (staffInfo.spacing) s.spacing_below_offset = staffInfo.spacing;
		if (staffInfo.verticalPos) s.verticalPos = staffInfo.verticalPos;

		if (staffInfo.name) {if (s.name) s.name.push(staffInfo.name); else s.name = [ staffInfo.name ];}
		if (staffInfo.subname) {if (s.subname) s.subname.push(staffInfo.subname); else s.subname = [ staffInfo.subname ];}

		setCurrentVoice(id);
	};

})();

//    abc_tokenizer.js: tokenizes an ABC Music Notation string to support abc_parse.
//    Copyright (C) 2010 Paul Rosen (paul at paulrosen dot net)
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.

/*global window */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.parse)
	window.ABCJS.parse = {};

// this is a series of functions that get a particular element out of the passed stream.
// the return is the number of characters consumed, so 0 means that the element wasn't found.
// also returned is the element found. This may be a different length because spaces may be consumed that aren't part of the string.
// The return structure for most calls is { len: num_chars_consumed, token: str }
window.ABCJS.parse.tokenizer = function() {
	this.skipWhiteSpace = function(str) {
		for (var i = 0; i < str.length; i++) {
		  if (!this.isWhiteSpace(str.charAt(i)))
				return i;
		}
		return str.length;	// It must have been all white space
	};
	var finished = function(str, i) {
		return i >= str.length;
	};
	this.eatWhiteSpace = function(line, index) {
		for (var i = index; i < line.length; i++) {
		  if (!this.isWhiteSpace(line.charAt(i)))
				return i-index;
		}
		return i-index;
	};

	// This just gets the basic pitch letter, ignoring leading spaces, and normalizing it to a capital
	this.getKeyPitch = function(str) {
		var i = this.skipWhiteSpace(str);
		if (finished(str, i))
			return {len: 0};
		switch (str.charAt(i)) {
			case 'A':return {len: i+1, token: 'A'};
			case 'B':return {len: i+1, token: 'B'};
			case 'C':return {len: i+1, token: 'C'};
			case 'D':return {len: i+1, token: 'D'};
			case 'E':return {len: i+1, token: 'E'};
			case 'F':return {len: i+1, token: 'F'};
			case 'G':return {len: i+1, token: 'G'};
//			case 'a':return {len: i+1, token: 'A'};
//			case 'b':return {len: i+1, token: 'B'};
//			case 'c':return {len: i+1, token: 'C'};
//			case 'd':return {len: i+1, token: 'D'};
//			case 'e':return {len: i+1, token: 'E'};
//			case 'f':return {len: i+1, token: 'F'};
//			case 'g':return {len: i+1, token: 'G'};
		}
		return {len: 0};
	};

	// This just gets the basic accidental, ignoring leading spaces, and only the ones that appear in a key
	this.getSharpFlat = function(str) {
		if (str === 'bass')
			return {len: 0};
		switch (str.charAt(0)) {
			case '#':return {len: 1, token: '#'};
			case 'b':return {len: 1, token: 'b'};
		}
		return {len: 0};
	};

	this.getMode = function(str) {
		var skipAlpha = function(str, start) {
			// This returns the index of the next non-alphabetic char, or the entire length of the string if not found.
		  while (start < str.length && ((str.charAt(start) >= 'a' && str.charAt(start) <= 'z') || (str.charAt(start) >= 'A' && str.charAt(start) <= 'Z')))
				start++;
			return start;
		};

		var i = this.skipWhiteSpace(str);
		if (finished(str, i))
			return {len: 0};
		var firstThree = str.substring(i,i+3).toLowerCase();
		if (firstThree.length > 1 && firstThree.charAt(1) === ' ' || firstThree.charAt(1) === '^' || firstThree.charAt(1) === '_' || firstThree.charAt(1) === '=') firstThree = firstThree.charAt(0);	// This will handle the case of 'm'
		switch (firstThree) {
			case 'mix':return {len: skipAlpha(str, i), token: 'Mix'};
			case 'dor':return {len: skipAlpha(str, i), token: 'Dor'};
			case 'phr':return {len: skipAlpha(str, i), token: 'Phr'};
			case 'lyd':return {len: skipAlpha(str, i), token: 'Lyd'};
			case 'loc':return {len: skipAlpha(str, i), token: 'Loc'};
			case 'aeo':return {len: skipAlpha(str, i), token: 'm'};
			case 'maj':return {len: skipAlpha(str, i), token: ''};
			case 'ion':return {len: skipAlpha(str, i), token: ''};
			case 'min':return {len: skipAlpha(str, i), token: 'm'};
			case 'm':return {len: skipAlpha(str, i), token: 'm'};
		}
		return {len: 0};
	};

	this.getClef = function(str, bExplicitOnly) {
		var strOrig = str;
		var i = this.skipWhiteSpace(str);
		if (finished(str, i))
			return {len: 0};
		// The word 'clef' is optional, but if it appears, a clef MUST appear
		var needsClef = false;
		var strClef = str.substring(i);
		if (window.ABCJS.parse.startsWith(strClef, 'clef=')) {
			needsClef = true;
			strClef = strClef.substring(5);
			i += 5;
		}
		if (strClef.length === 0 && needsClef)
			return {len: i+5, warn: "No clef specified: " + strOrig};

		var j = this.skipWhiteSpace(strClef);
		if (finished(strClef, j))
			return {len: 0};
		if (j > 0) {
			i += j;
			strClef = strClef.substring(j);
		}
		var name = null;
		if (window.ABCJS.parse.startsWith(strClef, 'treble'))
			name = 'treble';
		else if (window.ABCJS.parse.startsWith(strClef, 'bass3'))
			name = 'bass3';
		else if (window.ABCJS.parse.startsWith(strClef, 'bass'))
			name = 'bass';
		else if (window.ABCJS.parse.startsWith(strClef, 'tenor'))
			name = 'tenor';
		else if (window.ABCJS.parse.startsWith(strClef, 'alto2'))
			name = 'alto2';
		else if (window.ABCJS.parse.startsWith(strClef, 'alto1'))
			name = 'alto1';
		else if (window.ABCJS.parse.startsWith(strClef, 'alto'))
			name = 'alto';
		else if (!bExplicitOnly && (needsClef && window.ABCJS.parse.startsWith(strClef, 'none')))
			name = 'none';
		else if (window.ABCJS.parse.startsWith(strClef, 'perc'))
			name = 'perc';
		else if (!bExplicitOnly && (needsClef && window.ABCJS.parse.startsWith(strClef, 'C')))
			name = 'tenor';
		else if (!bExplicitOnly && (needsClef && window.ABCJS.parse.startsWith(strClef, 'F')))
			name = 'bass';
		else if (!bExplicitOnly && (needsClef && window.ABCJS.parse.startsWith(strClef, 'G')))
			name = 'treble';
		else
			return {len: i+5, warn: "Unknown clef specified: " + strOrig};

		strClef = strClef.substring(name.length);
		j = this.isMatch(strClef, '+8');
		if (j > 0)
			name += "+8";
		else {
			j = this.isMatch(strClef, '-8');
			if (j > 0)
				name += "-8";
		}
		return {len: i+name.length, token: name, explicit: needsClef};
	};

	// This returns one of the legal bar lines
	// This is called alot and there is no obvious tokenable items, so this is broken apart.
	this.getBarLine = function(line, i) {
		switch (line.charAt(i)) {
			case ']':
				++i;
				switch (line.charAt(i)) {
					case '|': return {len: 2, token: "bar_thick_thin"};
					case '[':
						++i;
						if ((line.charAt(i) >= '1' && line.charAt(i) <= '9') || line.charAt(i) === '"')
							return {len: 2, token: "bar_invisible"};
						return {len: 1, warn: "Unknown bar symbol"};
					default:
						return {len: 1, token: "bar_invisible"};
				}
				break;
			case ':':
				++i;
				switch (line.charAt(i)) {
					case ':': return {len: 2, token: "bar_dbl_repeat"};
					case '|':	// :|
						++i;
						switch (line.charAt(i)) {
							case ']':	// :|]
								++i;
								switch (line.charAt(i)) {
									case '|':	// :|]|
										++i;
										if (line.charAt(i) === ':')  return {len: 5, token: "bar_dbl_repeat"};
										return {len: 3, token: "bar_right_repeat"};
									default:
										return {len: 3, token: "bar_right_repeat"};
								}
								break;
							case '|':	// :||
								++i;
								if (line.charAt(i) === ':')  return {len: 4, token: "bar_dbl_repeat"};
								return {len: 3, token: "bar_right_repeat"};
							default:
								return {len: 2, token: "bar_right_repeat"};
						}
						break;
					default:
						return {len: 1, warn: "Unknown bar symbol"};
				}
				break;
			case '[':	// [
				++i;
				if (line.charAt(i) === '|') {	// [|
					++i;
					switch (line.charAt(i)) {
						case ':': return {len: 3, token: "bar_left_repeat"};
						case ']': return {len: 3, token: "bar_invisible"};
						default: return {len: 2, token: "bar_thick_thin"};
					}
				} else {
					if ((line.charAt(i) >= '1' && line.charAt(i) <= '9') || line.charAt(i) === '"')
						return {len: 1, token: "bar_invisible"};
					return {len: 0};
				}
				break;
			case '|':	// |
				++i;
				switch (line.charAt(i)) {
					case ']': return {len: 2, token: "bar_thin_thick"};
					case '|': // ||
						++i;
						if (line.charAt(i) === ':') return {len: 3, token: "bar_left_repeat"};
						return {len: 2, token: "bar_thin_thin"};
					case ':':	// |:
						var colons = 0;
						while (line.charAt(i+colons) === ':') colons++;
						return { len: 1+colons, token: "bar_left_repeat"};
					default: return {len: 1, token: "bar_thin"};
				}
				break;
		}
		return {len: 0};
	};

	// this returns all the characters in the string that match one of the characters in the legalChars string
	this.getTokenOf = function(str, legalChars) {
		for (var i = 0; i < str.length; i++) {
			if (legalChars.indexOf(str.charAt(i)) < 0)
				return {len: i, token: str.substring(0, i)};
		}
		return {len: i, token: str};
	};

	this.getToken = function(str, start, end) {
		// This returns the next set of chars that doesn't contain spaces
		var i = start;
		while (i < end && !this.isWhiteSpace(str.charAt(i)))
			i++;
		return str.substring(start, i);
	};

	// This just sees if the next token is the word passed in, with possible leading spaces
	this.isMatch = function(str, match) {
		var i = this.skipWhiteSpace(str);
		if (finished(str, i))
			return 0;
		if (window.ABCJS.parse.startsWith(str.substring(i), match))
			return i+match.length;
		return 0;
	};

	this.getPitchFromTokens = function(tokens) {
		var ret = { };
		var pitches = {A: 5, B: 6, C: 0, D: 1, E: 2, F: 3, G: 4, a: 12, b: 13, c: 7, d: 8, e: 9, f: 10, g: 11};
		ret.position = pitches[tokens[0].token];
		if (ret.position === undefined)
			return { warn: "Pitch expected. Found: " + tokens[0].token };
		tokens.shift();
		while (tokens.length) {
			switch (tokens[0].token) {
				case ',': ret.position -= 7; tokens.shift(); break;
				case '\'': ret.position += 7; tokens.shift(); break;
				default: return ret;
			}
		}
		return ret;
	};

	this.getKeyAccidentals2 = function(tokens) {
		var accs;
		// find and strip off all accidentals in the token list
		while (tokens.length > 0) {
			var acc;
			if (tokens[0].token === '^') {
				acc = 'sharp';
				tokens.shift();
				if (tokens.length === 0) return {accs: accs, warn: 'Expected note name after ' + acc};
				switch (tokens[0].token) {
					case '^': acc = 'dblsharp'; tokens.shift(); break;
					case '/': acc = 'quartersharp'; tokens.shift(); break;
				}
			} else if (tokens[0].token === '=') {
				acc = 'natural';
				tokens.shift();
			} else if (tokens[0].token === '_') {
				acc = 'flat';
				tokens.shift();
				if (tokens.length === 0) return {accs: accs, warn: 'Expected note name after ' + acc};
				switch (tokens[0].token) {
					case '_': acc = 'dblflat'; tokens.shift(); break;
					case '/': acc = 'quarterflat'; tokens.shift(); break;
				}
			} else {
				// Not an accidental, we'll assume that a later parse will recognize it.
				return { accs: accs };
			}
			if (tokens.length === 0) return {accs: accs, warn: 'Expected note name after ' + acc};
			switch (tokens[0].token.charAt(0))
			{
				case 'a':
				case 'b':
				case 'c':
				case 'd':
				case 'e':
				case 'f':
				case 'g':
				case 'A':
				case 'B':
				case 'C':
				case 'D':
				case 'E':
				case 'F':
				case 'G':
					if (accs === undefined)
						accs = [];
					accs.push({ acc: acc, note: tokens[0].token.charAt(0) });
					if (tokens[0].token.length === 1)
						tokens.shift();
					else
						tokens[0].token = tokens[0].token.substring(1);
					break;
				default:
					return {accs: accs, warn: 'Expected note name after ' + acc + ' Found: ' + tokens[0].token };
			}
		}
		return { accs: accs };
	};

	// This gets an accidental marking for the key signature. It has the accidental then the pitch letter.
	this.getKeyAccidental = function(str) {
		var accTranslation = {
			'^': 'sharp',
			'^^': 'dblsharp',
			'=': 'natural',
			'_': 'flat',
			'__': 'dblflat',
			'_/': 'quarterflat',
			'^/': 'quartersharp'
		};
		var i = this.skipWhiteSpace(str);
		if (finished(str, i))
			return {len: 0};
		var acc = null;
		switch (str.charAt(i))
		{
			case '^':
			case '_':
			case '=':
				acc = str.charAt(i);
				break;
			default:return {len: 0};
		}
		i++;
		if (finished(str, i))
			return {len: 1, warn: 'Expected note name after accidental'};
		switch (str.charAt(i))
		{
			case 'a':
			case 'b':
			case 'c':
			case 'd':
			case 'e':
			case 'f':
			case 'g':
			case 'A':
			case 'B':
			case 'C':
			case 'D':
			case 'E':
			case 'F':
			case 'G':
				return {len: i+1, token: {acc: accTranslation[acc], note: str.charAt(i)}};
			case '^':
			case '_':
			case '/':
				acc += str.charAt(i);
				i++;
				if (finished(str, i))
					return {len: 2, warn: 'Expected note name after accidental'};
				switch (str.charAt(i))
				{
					case 'a':
					case 'b':
					case 'c':
					case 'd':
					case 'e':
					case 'f':
					case 'g':
					case 'A':
					case 'B':
					case 'C':
					case 'D':
					case 'E':
					case 'F':
					case 'G':
						return {len: i+1, token: {acc: accTranslation[acc], note: str.charAt(i)}};
					default:
						return {len: 2, warn: 'Expected note name after accidental'};
				}
				break;
			default:
				return {len: 1, warn: 'Expected note name after accidental'};
		}
	};

	this.isWhiteSpace = function(ch) {
		return ch === ' ' || ch === '\t' || ch === '\x12';
	};

	this.getMeat = function(line, start, end) {
		// This removes any comments starting with '%' and trims the ends of the string so that there are no leading or trailing spaces.
		// it returns just the start and end characters that contain the meat.
		var comment = line.indexOf('%', start);
		if (comment >= 0 && comment < end)
			end = comment;
		while (start < end && (line.charAt(start) === ' ' || line.charAt(start) === '\t' || line.charAt(start) === '\x12'))
			start++;
		while (start < end && (line.charAt(end-1) === ' ' || line.charAt(end-1) === '\t' || line.charAt(end-1) === '\x12'))
			end--;
		return {start: start, end: end};
	};

	var isLetter = function(ch) {
		return (ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z');
	};

	var isNumber = function(ch) {
		return (ch >= '0' && ch <= '9');
	};

	this.tokenize = function(line, start, end) {
		// this returns all the tokens inside the passed string. A token is a punctuation mark, a string of digits, a string of letters.
		//  Quoted strings are one token.
		//  If there is a minus sign next to a number, then it is included in the number.
		// If there is a period immediately after a number, with a number immediately following, then a float is returned.
		// The type of token is returned: quote, alpha, number, punct
		var ret = this.getMeat(line, start, end);
		start = ret.start;
		end = ret.end;
		var tokens = [];
		var i;
		while (start < end) {
			if (line.charAt(start) === '"') {
				i = start+1;
				while (i < end && line.charAt(i) !== '"') i++;
				tokens.push({ type: 'quote', token: line.substring(start+1, i), start: start+1, end: i});
				i++;
			} else if (isLetter(line.charAt(start))) {
				i = start+1;
				while (i < end && isLetter(line.charAt(i))) i++;
				tokens.push({ type: 'alpha', token: line.substring(start, i), continueId: isNumber(line.charAt(i)), start: start, end: i});
				start = i + 1;
			} else if (line.charAt(start) === '.' && isNumber(line.charAt(i+1))) {
				i = start+1;
				var int2 = null;
				var float2 = null;
				while (i < end && isNumber(line.charAt(i))) i++;

				float2 = parseFloat(line.substring(start, i));
				tokens.push({ type: 'number', token: line.substring(start, i), intt: int2, floatt: float2, continueId: isLetter(line.charAt(i)), start: start, end: i});
				start = i + 1;
			} else if (isNumber(line.charAt(start)) || (line.charAt(start) === '-' && isNumber(line.charAt(i+1)))) {
				i = start+1;
				var intt = null;
				var floatt = null;
				while (i < end && isNumber(line.charAt(i))) i++;
				if (line.charAt(i) === '.' && isNumber(line.charAt(i+1))) {
					i++;
					while (i < end && isNumber(line.charAt(i))) i++;
				} else
					intt = parseInt(line.substring(start, i));

				floatt = parseFloat(line.substring(start, i));
				tokens.push({ type: 'number', token: line.substring(start, i), intt: intt, floatt: floatt, continueId: isLetter(line.charAt(i)), start: start, end: i});
				start = i + 1;
			} else if (line.charAt(start) === ' ' || line.charAt(start) === '\t') {
				i = start+1;
			} else {
				tokens.push({ type: 'punct', token: line.charAt(start), start: start, end: start+1});
				i = start+1;
			}
			start = i;
		}
		return tokens;
	};

	this.getVoiceToken = function(line, start, end) {
		// This finds the next token. A token is delimited by a space or an equal sign. If it starts with a quote, then the portion between the quotes is returned.
		var i = start;
		while (i < end && this.isWhiteSpace(line.charAt(i)) || line.charAt(i) === '=')
			i++;

		if (line.charAt(i) === '"') {
			var close = line.indexOf('"', i+1);
			if (close === -1 || close >= end)
				return {len: 1, err: "Missing close quote"};
			return {len: close-start+1, token: this.translateString(line.substring(i+1, close))};
		} else {
			var ii = i;
			while (ii < end && !this.isWhiteSpace(line.charAt(ii)) && line.charAt(ii) !== '=')
				ii++;
			return {len: ii-start+1, token: line.substring(i, ii)};
		}
	};

	var charMap = {
		"`a": 'à', "'a": "á", "^a": "â", "~a": "ã", "\"a": "ä", "oa": "å", "=a": "ā", "ua": "ă", ";a": "ą",
		"`e": 'è', "'e": "é", "^e": "ê", "\"e": "ë", "=e": "ē", "ue": "ĕ", ";e": "ę", ".e": "ė",
		"`i": 'ì', "'i": "í", "^i": "î", "\"i": "ï", "=i": "ī", "ui": "ĭ", ";i": "į",
		"`o": 'ò', "'o": "ó", "^o": "ô", "~o": "õ", "\"o": "ö", "=o": "ō", "uo": "ŏ", "/o": "ø",
		"`u": 'ù', "'u": "ú", "^u": "û", "~u": "ũ", "\"u": "ü", "ou": "ů", "=u": "ū", "uu": "ŭ", ";u": "ų",
		"`A": 'À', "'A": "Á", "^A": "Â", "~A": "Ã", "\"A": "Ä", "oA": "Å", "=A": "Ā", "uA": "Ă", ";A": "Ą",
		"`E": 'È', "'E": "É", "^E": "Ê", "\"E": "Ë", "=E": "Ē", "uE": "Ĕ", ";E": "Ę", ".E": "Ė",
		"`I": 'Ì', "'I": "Í", "^I": "Î", "~I": "Ĩ", "\"I": "Ï", "=I": "Ī", "uI": "Ĭ", ";I": "Į", ".I": "İ",
		"`O": 'Ò', "'O": "Ó", "^O": "Ô", "~O": "Õ", "\"O": "Ö", "=O": "Ō", "uO": "Ŏ", "/O": "Ø",
		"`U": 'Ù', "'U": "Ú", "^U": "Û", "~U": "Ũ", "\"U": "Ü", "oU": "Ů", "=U": "Ū", "uU": "Ŭ", ";U": "Ų",
		"ae": "æ", "AE": "Æ", "oe": "œ", "OE": "Œ", "ss": "ß",
		"'c": "ć", "^c": "ĉ", "uc": "č", "cc": "ç", ".c": "ċ", "cC": "Ç", "'C": "Ć", "^C": "Ĉ", "uC": "Č", ".C": "Ċ",
		"~n": "ñ",
		"=s": "š", "vs": "š",
		"vz": 'ž'

// More chars: Ñ Ĳ ĳ Ď ď Đ đ Ĝ ĝ Ğ ğ Ġ ġ Ģ ģ Ĥ ĥ Ħ ħ Ĵ ĵ Ķ ķ ĸ Ĺ ĺ Ļ ļ Ľ ľ Ŀ ŀ Ł ł Ń ń Ņ ņ Ň ň ŉ Ŋ ŋ   Ŕ ŕ Ŗ ŗ Ř ř Ś ś Ŝ ŝ Ş ş Š Ţ ţ Ť ť Ŧ ŧ Ŵ ŵ Ŷ ŷ Ÿ ÿ Ÿ Ź ź Ż ż Ž 
	};
	var charMap1 = {
		"#": "♯",
		"b": "♭",
		"=": "♮"
	};
	var charMap2 = {
		"201": "♯",
		"202": "♭",
		"203": "♮",
		"241": "¡",
		"242": "¢", "252": "a", "262": "2", "272": "o", "302": "Â", "312": "Ê", "322": "Ò", "332": "Ú", "342": "â", "352": "ê", "362": "ò", "372": "ú",
		"243": "£", "253": "«", "263": "3", "273": "»", "303": "Ã", "313": "Ë", "323": "Ó", "333": "Û", "343": "ã", "353": "ë", "363": "ó", "373": "û",
		"244": "¤", "254": "¬", "264": "  ́", "274": "1⁄4", "304": "Ä", "314": "Ì", "324": "Ô", "334": "Ü", "344": "ä", "354": "ì", "364": "ô", "374": "ü",
		"245": "¥", "255": "-", "265": "μ", "275": "1⁄2", "305": "Å", "315": "Í", "325": "Õ", "335": "Ý",  "345": "å", "355": "í", "365": "õ", "375": "ý",
		"246": "¦", "256": "®", "266": "¶", "276": "3⁄4", "306": "Æ", "316": "Î", "326": "Ö", "336": "Þ", "346": "æ", "356": "î", "366": "ö", "376": "þ",
		"247": "§", "257": " ̄", "267": "·", "277": "¿", "307": "Ç", "317": "Ï", "327": "×", "337": "ß", "347": "ç", "357": "ï", "367": "÷", "377": "ÿ",
		"250": " ̈", "260": "°", "270": " ̧", "300": "À", "310": "È", "320": "Ð", "330": "Ø", "340": "à", "350": "è", "360": "ð", "370": "ø",
		"251": "©", "261": "±", "271": "1", "301": "Á", "311": "É", "321": "Ñ", "331": "Ù", "341": "á", "351": "é", "361": "ñ", "371": "ù" };
	this.translateString = function(str) {
		var arr = str.split('\\');
		if (arr.length === 1) return str;
		var out = null;
		window.ABCJS.parse.each(arr, function(s) {
			if (out === null)
				out = s;
			else {
				var c = charMap[s.substring(0, 2)];
				if (c !== undefined)
					out += c + s.substring(2);
				else {
					c = charMap2[s.substring(0, 3)];
					if (c !== undefined)
						out += c + s.substring(3);
					else {
						c = charMap1[s.substring(0, 1)];
						if (c !== undefined)
							out += c + s.substring(1);
						else
							out += "\\" + s;
					}
				}
			}
		});
		return out;
	};
	this.getNumber = function(line, index) {
		var num = 0;
		while (index < line.length) {
			switch (line.charAt(index)) {
				case '0':num = num*10;index++;break;
				case '1':num = num*10+1;index++;break;
				case '2':num = num*10+2;index++;break;
				case '3':num = num*10+3;index++;break;
				case '4':num = num*10+4;index++;break;
				case '5':num = num*10+5;index++;break;
				case '6':num = num*10+6;index++;break;
				case '7':num = num*10+7;index++;break;
				case '8':num = num*10+8;index++;break;
				case '9':num = num*10+9;index++;break;
				default:
					return {num: num, index: index};
			}
		}
		return {num: num, index: index};
	};

	this.getFraction = function(line, index) {
		var num = 1;
		var den = 1;
		if (line.charAt(index) !== '/') {
			var ret = this.getNumber(line, index);
			num = ret.num;
			index = ret.index;
		}
		if (line.charAt(index) === '/') {
			index++;
			if (line.charAt(index) === '/') {
				var div = 0.5;
				while (line.charAt(index++) === '/')
					div = div /2;
				return {value: num * div, index: index-1};
			} else {
				var iSave = index;
				var ret2 = this.getNumber(line, index);
				if (ret2.num === 0 && iSave === index)	// If we didn't use any characters, it is an implied 2
					ret2.num = 2;
				if (ret2.num !== 0)
					den = ret2.num;
				index = ret2.index;
			}
		}

		return {value: num/den, index: index};
	};

	this.theReverser = function(str) {
		if (window.ABCJS.parse.endsWith(str, ", The"))
			return "The " + str.substring(0, str.length-5);
		if (window.ABCJS.parse.endsWith(str, ", A"))
			return "A " + str.substring(0, str.length-3);
		return str;
	};

	this.stripComment = function(str) {
		var i = str.indexOf('%');
		if (i >= 0)
			return window.ABCJS.parse.strip(str.substring(0, i));
		return window.ABCJS.parse.strip(str);
	};

	this.getInt = function(str) {
		// This parses the beginning of the string for a number and returns { value: num, digits: num }
		// If digits is 0, then the string didn't point to a number.
		var x = parseInt(str);
		if (isNaN(x))
			return {digits: 0};
		var s = "" + x;
		var i = str.indexOf(s);	// This is to account for leading spaces
		return {value: x, digits: i+s.length};
	};

	this.getFloat = function(str) {
		// This parses the beginning of the string for a number and returns { value: num, digits: num }
		// If digits is 0, then the string didn't point to a number.
		var x = parseFloat(str);
		if (isNaN(x))
			return {digits: 0};
		var s = "" + x;
		var i = str.indexOf(s);	// This is to account for leading spaces
		return {value: x, digits: i+s.length};
	};

	this.getMeasurement = function(tokens) {
		if (tokens.length === 0) return { used: 0 };
		var used = 1;
		var num = '';
		if (tokens[0].token === '-') {
			tokens.shift();
			num = '-';
			used++;
		}
		else if (tokens[0].type !== 'number') return { used: 0 };
		num += tokens.shift().token;
		if (tokens.length === 0) return { used: 1, value: parseInt(num) };
		var x = tokens.shift();
		if (x.token === '.') {
			used++;
			if (tokens.length === 0) return { used: used, value: parseInt(num) };
			if (tokens[0].type === 'number') {
				x = tokens.shift();
				num = num + '.' + x.token;
				used++;
				if (tokens.length === 0) return { used: used, value: parseFloat(num) };
			}
			x = tokens.shift();
		}
		switch (x.token) {
			case 'pt': return { used: used+1, value: parseFloat(num) };
			case 'cm': return { used: used+1, value: parseFloat(num)/2.54*72 };
			case 'in': return { used: used+1, value: parseFloat(num)*72 };
			default: tokens.unshift(x); return { used: used, value: parseFloat(num) };
		}
		return { used: 0 };
	};
	var substInChord = function(str)
	{
		while ( str.indexOf("\\n") !== -1)
		{
			str = str.replace("\\n", "\n");
		}
		return str;
	};
	this.getBrackettedSubstring = function(line, i, maxErrorChars, _matchChar)
	{
		// This extracts the sub string by looking at the first character and searching for that
		// character later in the line (or search for the optional _matchChar).
		// For instance, if the first character is a quote it will look for
		// the end quote. If the end of the line is reached, then only up to the default number
		// of characters are returned, so that a missing end quote won't eat up the entire line.
		// It returns the substring and the number of characters consumed.
		// The number of characters consumed is normally two more than the size of the substring,
		// but in the error case it might not be.
		var matchChar = _matchChar || line.charAt(i);
		var pos = i+1;
		while ((pos < line.length) && (line.charAt(pos) !== matchChar))
			++pos;
		if (line.charAt(pos) === matchChar)
			return [pos-i+1,substInChord(line.substring(i+1, pos)), true];
		else	// we hit the end of line, so we'll just pick an arbitrary num of chars so the line doesn't disappear.
		{
			pos = i+maxErrorChars;
			if (pos > line.length-1)
				pos = line.length-1;
			return [pos-i+1, substInChord(line.substring(i+1, pos)), false];
		}
	};
};
/*global window, ABCJS */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.write)
	window.ABCJS.write = {};

ABCJS.write.Glyphs = function() {
  var glyphs = {'rests.whole':{d:[["M", 0.06, 0.03], ["l", 0.09, -0.06], ["l", 5.46, 0], ["l", 5.49, 0], ["l", 0.09, 0.06], ["l", 0.06, 0.09], ["l", 0, 2.19], ["l", 0, 2.19], ["l", -0.06, 0.09], ["l", -0.09, 0.06], ["l", -5.49, 0], ["l", -5.46, 0], ["l", -0.09, -0.06], ["l", -0.06, -0.09], ["l", 0, -2.19], ["l", 0, -2.19], ["z"]],w:11.25,h:4.68},'rests.half':{d:[["M", 0.06, -4.62], ["l", 0.09, -0.06], ["l", 5.46, 0], ["l", 5.49, 0], ["l", 0.09, 0.06], ["l", 0.06, 0.09], ["l", 0, 2.19], ["l", 0, 2.19], ["l", -0.06, 0.09], ["l", -0.09, 0.06], ["l", -5.49, 0], ["l", -5.46, 0], ["l", -0.09, -0.06], ["l", -0.06, -0.09], ["l", 0, -2.19], ["l", 0, -2.19], ["z"]],w:11.25,h:4.68},'rests.quarter':{d:[["M", 1.89, -11.82], ["c", 0.12, -0.06, 0.24, -0.06, 0.36, -0.03], ["c", 0.09, 0.06, 4.74, 5.58, 4.86, 5.82], ["c", 0.21, 0.39, 0.15, 0.78, -0.15, 1.26], ["c", -0.24, 0.33, -0.72, 0.81, -1.62, 1.56], ["c", -0.45, 0.36, -0.87, 0.75, -0.96, 0.84], ["c", -0.93, 0.99, -1.14, 2.49, -0.6, 3.63], ["c", 0.18, 0.39, 0.27, 0.48, 1.32, 1.68], ["c", 1.92, 2.25, 1.83, 2.16, 1.83, 2.34], ["c", -0, 0.18, -0.18, 0.36, -0.36, 0.39], ["c", -0.15, -0, -0.27, -0.06, -0.48, -0.27], ["c", -0.75, -0.75, -2.46, -1.29, -3.39, -1.08], ["c", -0.45, 0.09, -0.69, 0.27, -0.9, 0.69], ["c", -0.12, 0.3, -0.21, 0.66, -0.24, 1.14], ["c", -0.03, 0.66, 0.09, 1.35, 0.3, 2.01], ["c", 0.15, 0.42, 0.24, 0.66, 0.45, 0.96], ["c", 0.18, 0.24, 0.18, 0.33, 0.03, 0.42], ["c", -0.12, 0.06, -0.18, 0.03, -0.45, -0.3], ["c", -1.08, -1.38, -2.07, -3.36, -2.4, -4.83], ["c", -0.27, -1.05, -0.15, -1.77, 0.27, -2.07], ["c", 0.21, -0.12, 0.42, -0.15, 0.87, -0.15], ["c", 0.87, 0.06, 2.1, 0.39, 3.3, 0.9], ["l", 0.39, 0.18], ["l", -1.65, -1.95], ["c", -2.52, -2.97, -2.61, -3.09, -2.7, -3.27], ["c", -0.09, -0.24, -0.12, -0.48, -0.03, -0.75], ["c", 0.15, -0.48, 0.57, -0.96, 1.83, -2.01], ["c", 0.45, -0.36, 0.84, -0.72, 0.93, -0.78], ["c", 0.69, -0.75, 1.02, -1.8, 0.9, -2.79], ["c", -0.06, -0.33, -0.21, -0.84, -0.39, -1.11], ["c", -0.09, -0.15, -0.45, -0.6, -0.81, -1.05], ["c", -0.36, -0.42, -0.69, -0.81, -0.72, -0.87], ["c", -0.09, -0.18, -0, -0.42, 0.21, -0.51], ["z"]],w:7.888,h:21.435},'rests.8th':{d:[["M", 1.68, -6.12], ["c", 0.66, -0.09, 1.23, 0.09, 1.68, 0.51], ["c", 0.27, 0.3, 0.39, 0.54, 0.57, 1.26], ["c", 0.09, 0.33, 0.18, 0.66, 0.21, 0.72], ["c", 0.12, 0.27, 0.33, 0.45, 0.6, 0.48], ["c", 0.12, 0, 0.18, 0, 0.33, -0.09], ["c", 0.39, -0.18, 1.32, -1.29, 1.68, -1.98], ["c", 0.09, -0.21, 0.24, -0.3, 0.39, -0.3], ["c", 0.12, 0, 0.27, 0.09, 0.33, 0.18], ["c", 0.03, 0.06, -0.27, 1.11, -1.86, 6.42], ["c", -1.02, 3.48, -1.89, 6.39, -1.92, 6.42], ["c", 0, 0.03, -0.12, 0.12, -0.24, 0.15], ["c", -0.18, 0.09, -0.21, 0.09, -0.45, 0.09], ["c", -0.24, 0, -0.3, 0, -0.48, -0.06], ["c", -0.09, -0.06, -0.21, -0.12, -0.21, -0.15], ["c", -0.06, -0.03, 0.15, -0.57, 1.68, -4.92], ["c", 0.96, -2.67, 1.74, -4.89, 1.71, -4.89], ["l", -0.51, 0.15], ["c", -1.08, 0.36, -1.74, 0.48, -2.55, 0.48], ["c", -0.66, 0, -0.84, -0.03, -1.32, -0.27], ["c", -1.32, -0.63, -1.77, -2.16, -1.02, -3.3], ["c", 0.33, -0.45, 0.84, -0.81, 1.38, -0.9], ["z"]],w:7.534,h:13.883},'rests.16th':{d:[["M", 3.33, -6.12], ["c", 0.66, -0.09, 1.23, 0.09, 1.68, 0.51], ["c", 0.27, 0.3, 0.39, 0.54, 0.57, 1.26], ["c", 0.09, 0.33, 0.18, 0.66, 0.21, 0.72], ["c", 0.15, 0.39, 0.57, 0.57, 0.87, 0.42], ["c", 0.39, -0.18, 1.2, -1.23, 1.62, -2.07], ["c", 0.06, -0.15, 0.24, -0.24, 0.36, -0.24], ["c", 0.12, 0, 0.27, 0.09, 0.33, 0.18], ["c", 0.03, 0.06, -0.45, 1.86, -2.67, 10.17], ["c", -1.5, 5.55, -2.73, 10.14, -2.76, 10.17], ["c", -0.03, 0.03, -0.12, 0.12, -0.24, 0.15], ["c", -0.18, 0.09, -0.21, 0.09, -0.45, 0.09], ["c", -0.24, 0, -0.3, 0, -0.48, -0.06], ["c", -0.09, -0.06, -0.21, -0.12, -0.21, -0.15], ["c", -0.06, -0.03, 0.12, -0.57, 1.44, -4.92], ["c", 0.81, -2.67, 1.47, -4.86, 1.47, -4.89], ["c", -0.03, 0, -0.27, 0.06, -0.54, 0.15], ["c", -1.08, 0.36, -1.77, 0.48, -2.58, 0.48], ["c", -0.66, 0, -0.84, -0.03, -1.32, -0.27], ["c", -1.32, -0.63, -1.77, -2.16, -1.02, -3.3], ["c", 0.72, -1.05, 2.22, -1.23, 3.06, -0.42], ["c", 0.3, 0.33, 0.42, 0.6, 0.6, 1.38], ["c", 0.09, 0.45, 0.21, 0.78, 0.33, 0.9], ["c", 0.09, 0.09, 0.27, 0.18, 0.45, 0.21], ["c", 0.12, 0, 0.18, 0, 0.33, -0.09], ["c", 0.33, -0.15, 1.02, -0.93, 1.41, -1.59], ["c", 0.12, -0.21, 0.18, -0.39, 0.39, -1.08], ["c", 0.66, -2.1, 1.17, -3.84, 1.17, -3.87], ["c", 0, 0, -0.21, 0.06, -0.42, 0.15], ["c", -0.51, 0.15, -1.2, 0.33, -1.68, 0.42], ["c", -0.33, 0.06, -0.51, 0.06, -0.96, 0.06], ["c", -0.66, 0, -0.84, -0.03, -1.32, -0.27], ["c", -1.32, -0.63, -1.77, -2.16, -1.02, -3.3], ["c", 0.33, -0.45, 0.84, -0.81, 1.38, -0.9], ["z"]],w:9.724,h:21.383},'rests.32nd':{d:[["M", 4.23, -13.62], ["c", 0.66, -0.09, 1.23, 0.09, 1.68, 0.51], ["c", 0.27, 0.3, 0.39, 0.54, 0.57, 1.26], ["c", 0.09, 0.33, 0.18, 0.66, 0.21, 0.72], ["c", 0.12, 0.27, 0.33, 0.45, 0.6, 0.48], ["c", 0.12, 0, 0.18, 0, 0.27, -0.06], ["c", 0.33, -0.21, 0.99, -1.11, 1.44, -1.98], ["c", 0.09, -0.24, 0.21, -0.33, 0.39, -0.33], ["c", 0.12, 0, 0.27, 0.09, 0.33, 0.18], ["c", 0.03, 0.06, -0.57, 2.67, -3.21, 13.89], ["c", -1.8, 7.62, -3.3, 13.89, -3.3, 13.92], ["c", -0.03, 0.06, -0.12, 0.12, -0.24, 0.18], ["c", -0.21, 0.09, -0.24, 0.09, -0.48, 0.09], ["c", -0.24, -0, -0.3, -0, -0.48, -0.06], ["c", -0.09, -0.06, -0.21, -0.12, -0.21, -0.15], ["c", -0.06, -0.03, 0.09, -0.57, 1.23, -4.92], ["c", 0.69, -2.67, 1.26, -4.86, 1.29, -4.89], ["c", 0, -0.03, -0.12, -0.03, -0.48, 0.12], ["c", -1.17, 0.39, -2.22, 0.57, -3, 0.54], ["c", -0.42, -0.03, -0.75, -0.12, -1.11, -0.3], ["c", -1.32, -0.63, -1.77, -2.16, -1.02, -3.3], ["c", 0.72, -1.05, 2.22, -1.23, 3.06, -0.42], ["c", 0.3, 0.33, 0.42, 0.6, 0.6, 1.38], ["c", 0.09, 0.45, 0.21, 0.78, 0.33, 0.9], ["c", 0.12, 0.09, 0.3, 0.18, 0.48, 0.21], ["c", 0.12, -0, 0.18, -0, 0.3, -0.09], ["c", 0.42, -0.21, 1.29, -1.29, 1.56, -1.89], ["c", 0.03, -0.12, 1.23, -4.59, 1.23, -4.65], ["c", 0, -0.03, -0.18, 0.03, -0.39, 0.12], ["c", -0.63, 0.18, -1.2, 0.36, -1.74, 0.45], ["c", -0.39, 0.06, -0.54, 0.06, -1.02, 0.06], ["c", -0.66, -0, -0.84, -0.03, -1.32, -0.27], ["c", -1.32, -0.63, -1.77, -2.16, -1.02, -3.3], ["c", 0.72, -1.05, 2.22, -1.23, 3.06, -0.42], ["c", 0.3, 0.33, 0.42, 0.6, 0.6, 1.38], ["c", 0.09, 0.45, 0.21, 0.78, 0.33, 0.9], ["c", 0.18, 0.18, 0.51, 0.27, 0.72, 0.15], ["c", 0.3, -0.12, 0.69, -0.57, 1.08, -1.17], ["c", 0.42, -0.6, 0.39, -0.51, 1.05, -3.03], ["c", 0.33, -1.26, 0.6, -2.31, 0.6, -2.34], ["c", 0, -0, -0.21, 0.03, -0.45, 0.12], ["c", -0.57, 0.18, -1.14, 0.33, -1.62, 0.42], ["c", -0.33, 0.06, -0.51, 0.06, -0.96, 0.06], ["c", -0.66, -0, -0.84, -0.03, -1.32, -0.27], ["c", -1.32, -0.63, -1.77, -2.16, -1.02, -3.3], ["c", 0.33, -0.45, 0.84, -0.81, 1.38, -0.9], ["z"]],w:11.373,h:28.883},'rests.64th':{d:[["M", 5.13, -13.62], ["c", 0.66, -0.09, 1.23, 0.09, 1.68, 0.51], ["c", 0.27, 0.3, 0.39, 0.54, 0.57, 1.26], ["c", 0.15, 0.63, 0.21, 0.81, 0.33, 0.96], ["c", 0.18, 0.21, 0.54, 0.3, 0.75, 0.18], ["c", 0.24, -0.12, 0.63, -0.66, 1.08, -1.56], ["c", 0.33, -0.66, 0.39, -0.72, 0.6, -0.72], ["c", 0.12, 0, 0.27, 0.09, 0.33, 0.18], ["c", 0.03, 0.06, -0.69, 3.66, -3.54, 17.64], ["c", -1.95, 9.66, -3.57, 17.61, -3.57, 17.64], ["c", -0.03, 0.06, -0.12, 0.12, -0.24, 0.18], ["c", -0.21, 0.09, -0.24, 0.09, -0.48, 0.09], ["c", -0.24, 0, -0.3, 0, -0.48, -0.06], ["c", -0.09, -0.06, -0.21, -0.12, -0.21, -0.15], ["c", -0.06, -0.03, 0.06, -0.57, 1.05, -4.95], ["c", 0.6, -2.7, 1.08, -4.89, 1.08, -4.92], ["c", 0, 0, -0.24, 0.06, -0.51, 0.15], ["c", -0.66, 0.24, -1.2, 0.36, -1.77, 0.48], ["c", -0.42, 0.06, -0.57, 0.06, -1.05, 0.06], ["c", -0.69, 0, -0.87, -0.03, -1.35, -0.27], ["c", -1.32, -0.63, -1.77, -2.16, -1.02, -3.3], ["c", 0.72, -1.05, 2.22, -1.23, 3.06, -0.42], ["c", 0.3, 0.33, 0.42, 0.6, 0.6, 1.38], ["c", 0.09, 0.45, 0.21, 0.78, 0.33, 0.9], ["c", 0.09, 0.09, 0.27, 0.18, 0.45, 0.21], ["c", 0.21, 0.03, 0.39, -0.09, 0.72, -0.42], ["c", 0.45, -0.45, 1.02, -1.26, 1.17, -1.65], ["c", 0.03, -0.09, 0.27, -1.14, 0.54, -2.34], ["c", 0.27, -1.2, 0.48, -2.19, 0.51, -2.22], ["c", 0, -0.03, -0.09, -0.03, -0.48, 0.12], ["c", -1.17, 0.39, -2.22, 0.57, -3, 0.54], ["c", -0.42, -0.03, -0.75, -0.12, -1.11, -0.3], ["c", -1.32, -0.63, -1.77, -2.16, -1.02, -3.3], ["c", 0.36, -0.54, 0.96, -0.87, 1.65, -0.93], ["c", 0.54, -0.03, 1.02, 0.15, 1.41, 0.54], ["c", 0.27, 0.3, 0.39, 0.54, 0.57, 1.26], ["c", 0.09, 0.33, 0.18, 0.66, 0.21, 0.72], ["c", 0.15, 0.39, 0.57, 0.57, 0.9, 0.42], ["c", 0.36, -0.18, 1.2, -1.26, 1.47, -1.89], ["c", 0.03, -0.09, 0.3, -1.2, 0.57, -2.43], ["l", 0.51, -2.28], ["l", -0.54, 0.18], ["c", -1.11, 0.36, -1.8, 0.48, -2.61, 0.48], ["c", -0.66, 0, -0.84, -0.03, -1.32, -0.27], ["c", -1.32, -0.63, -1.77, -2.16, -1.02, -3.3], ["c", 0.36, -0.54, 0.96, -0.87, 1.65, -0.93], ["c", 0.54, -0.03, 1.02, 0.15, 1.41, 0.54], ["c", 0.27, 0.3, 0.39, 0.54, 0.57, 1.26], ["c", 0.15, 0.63, 0.21, 0.81, 0.33, 0.96], ["c", 0.21, 0.21, 0.54, 0.3, 0.75, 0.18], ["c", 0.36, -0.18, 0.93, -0.93, 1.29, -1.68], ["c", 0.12, -0.24, 0.18, -0.48, 0.63, -2.55], ["l", 0.51, -2.31], ["c", 0, -0.03, -0.18, 0.03, -0.39, 0.12], ["c", -1.14, 0.36, -2.1, 0.54, -2.82, 0.51], ["c", -0.42, -0.03, -0.75, -0.12, -1.11, -0.3], ["c", -1.32, -0.63, -1.77, -2.16, -1.02, -3.3], ["c", 0.33, -0.45, 0.84, -0.81, 1.38, -0.9], ["z"]],w:12.453,h:36.383},'rests.128th':{d:[["M", 6.03, -21.12], ["c", 0.66, -0.09, 1.23, 0.09, 1.68, 0.51], ["c", 0.27, 0.3, 0.39, 0.54, 0.57, 1.26], ["c", 0.09, 0.33, 0.18, 0.66, 0.21, 0.72], ["c", 0.12, 0.27, 0.33, 0.45, 0.6, 0.48], ["c", 0.21, 0, 0.33, -0.06, 0.54, -0.36], ["c", 0.15, -0.21, 0.54, -0.93, 0.78, -1.47], ["c", 0.15, -0.33, 0.18, -0.39, 0.3, -0.48], ["c", 0.18, -0.09, 0.45, 0, 0.51, 0.15], ["c", 0.03, 0.09, -7.11, 42.75, -7.17, 42.84], ["c", -0.03, 0.03, -0.15, 0.09, -0.24, 0.15], ["c", -0.18, 0.06, -0.24, 0.06, -0.45, 0.06], ["c", -0.24, -0, -0.3, -0, -0.48, -0.06], ["c", -0.09, -0.06, -0.21, -0.12, -0.21, -0.15], ["c", -0.06, -0.03, 0.03, -0.57, 0.84, -4.98], ["c", 0.51, -2.7, 0.93, -4.92, 0.9, -4.92], ["c", 0, -0, -0.15, 0.06, -0.36, 0.12], ["c", -0.78, 0.27, -1.62, 0.48, -2.31, 0.57], ["c", -0.15, 0.03, -0.54, 0.03, -0.81, 0.03], ["c", -0.66, -0, -0.84, -0.03, -1.32, -0.27], ["c", -1.32, -0.63, -1.77, -2.16, -1.02, -3.3], ["c", 0.36, -0.54, 0.96, -0.87, 1.65, -0.93], ["c", 0.54, -0.03, 1.02, 0.15, 1.41, 0.54], ["c", 0.27, 0.3, 0.39, 0.54, 0.57, 1.26], ["c", 0.09, 0.33, 0.18, 0.66, 0.21, 0.72], ["c", 0.12, 0.27, 0.33, 0.45, 0.63, 0.48], ["c", 0.12, -0, 0.18, -0, 0.3, -0.09], ["c", 0.42, -0.21, 1.14, -1.11, 1.5, -1.83], ["c", 0.12, -0.27, 0.12, -0.27, 0.54, -2.52], ["c", 0.24, -1.23, 0.42, -2.25, 0.39, -2.25], ["c", 0, -0, -0.24, 0.06, -0.51, 0.18], ["c", -1.26, 0.39, -2.25, 0.57, -3.06, 0.54], ["c", -0.42, -0.03, -0.75, -0.12, -1.11, -0.3], ["c", -1.32, -0.63, -1.77, -2.16, -1.02, -3.3], ["c", 0.36, -0.54, 0.96, -0.87, 1.65, -0.93], ["c", 0.54, -0.03, 1.02, 0.15, 1.41, 0.54], ["c", 0.27, 0.3, 0.39, 0.54, 0.57, 1.26], ["c", 0.15, 0.63, 0.21, 0.81, 0.33, 0.96], ["c", 0.18, 0.21, 0.51, 0.3, 0.75, 0.18], ["c", 0.36, -0.15, 1.05, -0.99, 1.41, -1.77], ["l", 0.15, -0.3], ["l", 0.42, -2.25], ["c", 0.21, -1.26, 0.42, -2.28, 0.39, -2.28], ["l", -0.51, 0.15], ["c", -1.11, 0.39, -1.89, 0.51, -2.7, 0.51], ["c", -0.66, -0, -0.84, -0.03, -1.32, -0.27], ["c", -1.32, -0.63, -1.77, -2.16, -1.02, -3.3], ["c", 0.36, -0.54, 0.96, -0.87, 1.65, -0.93], ["c", 0.54, -0.03, 1.02, 0.15, 1.41, 0.54], ["c", 0.27, 0.3, 0.39, 0.54, 0.57, 1.26], ["c", 0.15, 0.63, 0.21, 0.81, 0.33, 0.96], ["c", 0.18, 0.18, 0.48, 0.27, 0.72, 0.21], ["c", 0.33, -0.12, 1.14, -1.26, 1.41, -1.95], ["c", 0, -0.09, 0.21, -1.11, 0.45, -2.34], ["c", 0.21, -1.2, 0.39, -2.22, 0.39, -2.28], ["c", 0.03, -0.03, 0, -0.03, -0.45, 0.12], ["c", -0.57, 0.18, -1.2, 0.33, -1.71, 0.42], ["c", -0.3, 0.06, -0.51, 0.06, -0.93, 0.06], ["c", -0.66, -0, -0.84, -0.03, -1.32, -0.27], ["c", -1.32, -0.63, -1.77, -2.16, -1.02, -3.3], ["c", 0.36, -0.54, 0.96, -0.87, 1.65, -0.93], ["c", 0.54, -0.03, 1.02, 0.15, 1.41, 0.54], ["c", 0.27, 0.3, 0.39, 0.54, 0.57, 1.26], ["c", 0.09, 0.33, 0.18, 0.66, 0.21, 0.72], ["c", 0.12, 0.27, 0.33, 0.45, 0.6, 0.48], ["c", 0.18, -0, 0.36, -0.09, 0.57, -0.33], ["c", 0.33, -0.36, 0.78, -1.14, 0.93, -1.56], ["c", 0.03, -0.12, 0.24, -1.2, 0.45, -2.4], ["c", 0.24, -1.2, 0.42, -2.22, 0.42, -2.28], ["c", 0.03, -0.03, 0, -0.03, -0.39, 0.09], ["c", -1.05, 0.36, -1.8, 0.48, -2.58, 0.48], ["c", -0.63, -0, -0.84, -0.03, -1.29, -0.27], ["c", -1.32, -0.63, -1.77, -2.16, -1.02, -3.3], ["c", 0.33, -0.45, 0.84, -0.81, 1.38, -0.9], ["z"]],w:12.992,h:43.883},'dots.dot':{d:[["M", 1.32, -1.68], ["c", 0.09, -0.03, 0.27, -0.06, 0.39, -0.06], ["c", 0.96, 0, 1.74, 0.78, 1.74, 1.71], ["c", 0, 0.96, -0.78, 1.74, -1.71, 1.74], ["c", -0.96, 0, -1.74, -0.78, -1.74, -1.71], ["c", 0, -0.78, 0.54, -1.5, 1.32, -1.68], ["z"]],w:3.45,h:3.45},'noteheads.dbl':{d:[["M", -0.69, -4.02], ["c", 0.18, -0.09, 0.36, -0.09, 0.54, 0], ["c", 0.18, 0.09, 0.24, 0.15, 0.33, 0.3], ["c", 0.06, 0.15, 0.06, 0.18, 0.06, 1.41], ["l", -0, 1.23], ["l", 0.12, -0.18], ["c", 0.72, -1.26, 2.64, -2.31, 4.86, -2.64], ["c", 0.81, -0.15, 1.11, -0.15, 2.13, -0.15], ["c", 0.99, 0, 1.29, 0, 2.1, 0.15], ["c", 0.75, 0.12, 1.38, 0.27, 2.04, 0.54], ["c", 1.35, 0.51, 2.34, 1.26, 2.82, 2.1], ["l", 0.12, 0.18], ["l", 0, -1.23], ["c", 0, -1.2, 0, -1.26, 0.06, -1.38], ["c", 0.09, -0.18, 0.15, -0.24, 0.33, -0.33], ["c", 0.18, -0.09, 0.36, -0.09, 0.54, 0], ["c", 0.18, 0.09, 0.24, 0.15, 0.33, 0.3], ["l", 0.06, 0.15], ["l", 0, 3.54], ["l", 0, 3.54], ["l", -0.06, 0.15], ["c", -0.09, 0.18, -0.15, 0.24, -0.33, 0.33], ["c", -0.18, 0.09, -0.36, 0.09, -0.54, 0], ["c", -0.18, -0.09, -0.24, -0.15, -0.33, -0.33], ["c", -0.06, -0.12, -0.06, -0.18, -0.06, -1.38], ["l", 0, -1.23], ["l", -0.12, 0.18], ["c", -0.48, 0.84, -1.47, 1.59, -2.82, 2.1], ["c", -0.84, 0.33, -1.71, 0.54, -2.85, 0.66], ["c", -0.45, 0.06, -2.16, 0.06, -2.61, 0], ["c", -1.14, -0.12, -2.01, -0.33, -2.85, -0.66], ["c", -1.35, -0.51, -2.34, -1.26, -2.82, -2.1], ["l", -0.12, -0.18], ["l", 0, 1.23], ["c", 0, 1.23, 0, 1.26, -0.06, 1.38], ["c", -0.09, 0.18, -0.15, 0.24, -0.33, 0.33], ["c", -0.18, 0.09, -0.36, 0.09, -0.54, 0], ["c", -0.18, -0.09, -0.24, -0.15, -0.33, -0.33], ["l", -0.06, -0.15], ["l", 0, -3.54], ["c", 0, -3.48, 0, -3.54, 0.06, -3.66], ["c", 0.09, -0.18, 0.15, -0.24, 0.33, -0.33], ["z"], ["m", 7.71, 0.63], ["c", -0.36, -0.06, -0.9, -0.06, -1.14, 0], ["c", -0.3, 0.03, -0.66, 0.24, -0.87, 0.42], ["c", -0.6, 0.54, -0.9, 1.62, -0.75, 2.82], ["c", 0.12, 0.93, 0.51, 1.68, 1.11, 2.31], ["c", 0.75, 0.72, 1.83, 1.2, 2.85, 1.26], ["c", 1.05, 0.06, 1.83, -0.54, 2.1, -1.65], ["c", 0.21, -0.9, 0.12, -1.95, -0.24, -2.82], ["c", -0.36, -0.81, -1.08, -1.53, -1.95, -1.95], ["c", -0.3, -0.15, -0.78, -0.3, -1.11, -0.39], ["z"]],w:16.83,h:8.145},'noteheads.whole':{d:[["M", 6.51, -4.05], ["c", 0.51, -0.03, 2.01, 0, 2.52, 0.03], ["c", 1.41, 0.18, 2.64, 0.51, 3.72, 1.08], ["c", 1.2, 0.63, 1.95, 1.41, 2.19, 2.31], ["c", 0.09, 0.33, 0.09, 0.9, -0, 1.23], ["c", -0.24, 0.9, -0.99, 1.68, -2.19, 2.31], ["c", -1.08, 0.57, -2.28, 0.9, -3.75, 1.08], ["c", -0.66, 0.06, -2.31, 0.06, -2.97, 0], ["c", -1.47, -0.18, -2.67, -0.51, -3.75, -1.08], ["c", -1.2, -0.63, -1.95, -1.41, -2.19, -2.31], ["c", -0.09, -0.33, -0.09, -0.9, -0, -1.23], ["c", 0.24, -0.9, 0.99, -1.68, 2.19, -2.31], ["c", 1.2, -0.63, 2.61, -0.99, 4.23, -1.11], ["z"], ["m", 0.57, 0.66], ["c", -0.87, -0.15, -1.53, 0, -2.04, 0.51], ["c", -0.15, 0.15, -0.24, 0.27, -0.33, 0.48], ["c", -0.24, 0.51, -0.36, 1.08, -0.33, 1.77], ["c", 0.03, 0.69, 0.18, 1.26, 0.42, 1.77], ["c", 0.6, 1.17, 1.74, 1.98, 3.18, 2.22], ["c", 1.11, 0.21, 1.95, -0.15, 2.34, -0.99], ["c", 0.24, -0.51, 0.36, -1.08, 0.33, -1.8], ["c", -0.06, -1.11, -0.45, -2.04, -1.17, -2.76], ["c", -0.63, -0.63, -1.47, -1.05, -2.4, -1.2], ["z"]],w:14.985,h:8.097},'noteheads.half':{d:[["M", 7.44, -4.05], ["c", 0.06, -0.03, 0.27, -0.03, 0.48, -0.03], ["c", 1.05, 0, 1.71, 0.24, 2.1, 0.81], ["c", 0.42, 0.6, 0.45, 1.35, 0.18, 2.4], ["c", -0.42, 1.59, -1.14, 2.73, -2.16, 3.39], ["c", -1.41, 0.93, -3.18, 1.44, -5.4, 1.53], ["c", -1.17, 0.03, -1.89, -0.21, -2.28, -0.81], ["c", -0.42, -0.6, -0.45, -1.35, -0.18, -2.4], ["c", 0.42, -1.59, 1.14, -2.73, 2.16, -3.39], ["c", 0.63, -0.42, 1.23, -0.72, 1.98, -0.96], ["c", 0.9, -0.3, 1.65, -0.42, 3.12, -0.54], ["z"], ["m", 1.29, 0.87], ["c", -0.27, -0.09, -0.63, -0.12, -0.9, -0.03], ["c", -0.72, 0.24, -1.53, 0.69, -3.27, 1.8], ["c", -2.34, 1.5, -3.3, 2.25, -3.57, 2.79], ["c", -0.36, 0.72, -0.06, 1.5, 0.66, 1.77], ["c", 0.24, 0.12, 0.69, 0.09, 0.99, 0], ["c", 0.84, -0.3, 1.92, -0.93, 4.14, -2.37], ["c", 1.62, -1.08, 2.37, -1.71, 2.61, -2.19], ["c", 0.36, -0.72, 0.06, -1.5, -0.66, -1.77], ["z"]],w:10.37,h:8.132},'noteheads.quarter':{d:[["M", 6.09, -4.05], ["c", 0.36, -0.03, 1.2, 0, 1.53, 0.06], ["c", 1.17, 0.24, 1.89, 0.84, 2.16, 1.83], ["c", 0.06, 0.18, 0.06, 0.3, 0.06, 0.66], ["c", 0, 0.45, 0, 0.63, -0.15, 1.08], ["c", -0.66, 2.04, -3.06, 3.93, -5.52, 4.38], ["c", -0.54, 0.09, -1.44, 0.09, -1.83, 0.03], ["c", -1.23, -0.27, -1.98, -0.87, -2.25, -1.86], ["c", -0.06, -0.18, -0.06, -0.3, -0.06, -0.66], ["c", 0, -0.45, 0, -0.63, 0.15, -1.08], ["c", 0.24, -0.78, 0.75, -1.53, 1.44, -2.22], ["c", 1.2, -1.2, 2.85, -2.01, 4.47, -2.22], ["z"]],w:9.81,h:8.094},'noteheads.hihat':{d:[["M", 0.78, -4.05], ["c", 0.12, -0.03, 0.24, -0.03, 0.36, 0.03], ["c", 0.03, 0.03, 0.93, 0.72, 1.95, 1.56], ["l", 1.86, 1.5], ["l", 1.86, -1.5], ["c", 1.02, -0.84, 1.92, -1.53, 1.95, -1.56], ["c", 0.21, -0.12, 0.33, -0.09, 0.75, 0.24], ["c", 0.3, 0.27, 0.36, 0.36, 0.36, 0.54], ["c", -0, 0.03, -0.03, 0.12, -0.06, 0.18], ["c", -0.03, 0.06, -0.9, 0.75, -1.89, 1.56], ["l", -1.8, 1.47], ["c", -0, 0.03, 0.81, 0.69, 1.8, 1.5], ["c", 0.99, 0.81, 1.86, 1.5, 1.89, 1.56], ["c", 0.03, 0.06, 0.06, 0.15, 0.06, 0.18], ["c", -0, 0.18, -0.06, 0.27, -0.36, 0.54], ["c", -0.42, 0.33, -0.54, 0.36, -0.75, 0.24], ["c", -0.03, -0.03, -0.93, -0.72, -1.95, -1.56], ["l", -1.86, -1.5], ["l", -1.86, 1.5], ["c", -1.02, 0.84, -1.92, 1.53, -1.95, 1.56], ["c", -0.21, 0.12, -0.33, 0.09, -0.75, -0.24], ["c", -0.3, -0.27, -0.36, -0.36, -0.36, -0.54], ["c", -0, -0.03, 0.03, -0.12, 0.06, -0.18], ["c", 0.03, -0.06, 0.9, -0.75, 1.89, -1.56], ["l", 1.8, -1.47], ["c", -0, -0.03, -0.81, -0.69, -1.8, -1.5], ["c", -0.99, -0.81, -1.86, -1.5, -1.89, -1.56], ["c", -0.06, -0.12, -0.09, -0.21, -0.03, -0.36], ["c", 0.03, -0.09, 0.57, -0.57, 0.72, -0.63], ["z"]],w:9.843,h:8.139},'scripts.sforzato':{d:[["M", -6.45, -3.69], ["c", 0.06, -0.03, 0.15, -0.06, 0.18, -0.06], ["c", 0.06, 0, 2.85, 0.72, 6.24, 1.59], ["l", 6.33, 1.65], ["c", 0.33, 0.06, 0.45, 0.21, 0.45, 0.51], ["c", 0, 0.3, -0.12, 0.45, -0.45, 0.51], ["l", -6.33, 1.65], ["c", -3.39, 0.87, -6.18, 1.59, -6.21, 1.59], ["c", -0.21, -0, -0.48, -0.24, -0.51, -0.45], ["c", 0, -0.15, 0.06, -0.36, 0.18, -0.45], ["c", 0.09, -0.06, 0.87, -0.27, 3.84, -1.05], ["c", 2.04, -0.54, 3.84, -0.99, 4.02, -1.02], ["c", 0.15, -0.06, 1.14, -0.24, 2.22, -0.42], ["c", 1.05, -0.18, 1.92, -0.36, 1.92, -0.36], ["c", 0, -0, -0.87, -0.18, -1.92, -0.36], ["c", -1.08, -0.18, -2.07, -0.36, -2.22, -0.42], ["c", -0.18, -0.03, -1.98, -0.48, -4.02, -1.02], ["c", -2.97, -0.78, -3.75, -0.99, -3.84, -1.05], ["c", -0.12, -0.09, -0.18, -0.3, -0.18, -0.45], ["c", 0.03, -0.15, 0.15, -0.3, 0.3, -0.39], ["z"]],w:13.5,h:7.5},'scripts.coda':{d:[["M", -0.21, -10.47], ["c", 0.18, -0.12, 0.42, -0.06, 0.54, 0.12], ["c", 0.06, 0.09, 0.06, 0.18, 0.06, 1.5], ["l", 0, 1.38], ["l", 0.18, 0], ["c", 0.39, 0.06, 0.96, 0.24, 1.38, 0.48], ["c", 1.68, 0.93, 2.82, 3.24, 3.03, 6.12], ["c", 0.03, 0.24, 0.03, 0.45, 0.03, 0.45], ["c", 0, 0.03, 0.6, 0.03, 1.35, 0.03], ["c", 1.5, 0, 1.47, 0, 1.59, 0.18], ["c", 0.09, 0.12, 0.09, 0.3, -0, 0.42], ["c", -0.12, 0.18, -0.09, 0.18, -1.59, 0.18], ["c", -0.75, 0, -1.35, 0, -1.35, 0.03], ["c", -0, 0, -0, 0.21, -0.03, 0.42], ["c", -0.24, 3.15, -1.53, 5.58, -3.45, 6.36], ["c", -0.27, 0.12, -0.72, 0.24, -0.96, 0.27], ["l", -0.18, -0], ["l", -0, 1.38], ["c", -0, 1.32, -0, 1.41, -0.06, 1.5], ["c", -0.15, 0.24, -0.51, 0.24, -0.66, -0], ["c", -0.06, -0.09, -0.06, -0.18, -0.06, -1.5], ["l", -0, -1.38], ["l", -0.18, -0], ["c", -0.39, -0.06, -0.96, -0.24, -1.38, -0.48], ["c", -1.68, -0.93, -2.82, -3.24, -3.03, -6.15], ["c", -0.03, -0.21, -0.03, -0.42, -0.03, -0.42], ["c", 0, -0.03, -0.6, -0.03, -1.35, -0.03], ["c", -1.5, -0, -1.47, -0, -1.59, -0.18], ["c", -0.09, -0.12, -0.09, -0.3, 0, -0.42], ["c", 0.12, -0.18, 0.09, -0.18, 1.59, -0.18], ["c", 0.75, -0, 1.35, -0, 1.35, -0.03], ["c", 0, -0, 0, -0.21, 0.03, -0.45], ["c", 0.24, -3.12, 1.53, -5.55, 3.45, -6.33], ["c", 0.27, -0.12, 0.72, -0.24, 0.96, -0.27], ["l", 0.18, -0], ["l", 0, -1.38], ["c", 0, -1.53, 0, -1.5, 0.18, -1.62], ["z"], ["m", -0.18, 6.93], ["c", 0, -2.97, 0, -3.15, -0.06, -3.15], ["c", -0.09, 0, -0.51, 0.15, -0.66, 0.21], ["c", -0.87, 0.51, -1.38, 1.62, -1.56, 3.51], ["c", -0.06, 0.54, -0.12, 1.59, -0.12, 2.16], ["l", 0, 0.42], ["l", 1.2, 0], ["l", 1.2, 0], ["l", 0, -3.15], ["z"], ["m", 1.17, -3.06], ["c", -0.09, -0.03, -0.21, -0.06, -0.27, -0.09], ["l", -0.12, 0], ["l", 0, 3.15], ["l", 0, 3.15], ["l", 1.2, 0], ["l", 1.2, 0], ["l", 0, -0.81], ["c", -0.06, -2.4, -0.33, -3.69, -0.93, -4.59], ["c", -0.27, -0.39, -0.66, -0.69, -1.08, -0.81], ["z"], ["m", -1.17, 10.14], ["l", 0, -3.15], ["l", -1.2, -0], ["l", -1.2, -0], ["l", 0, 0.81], ["c", 0.03, 0.96, 0.06, 1.47, 0.15, 2.13], ["c", 0.24, 2.04, 0.96, 3.12, 2.13, 3.36], ["l", 0.12, -0], ["l", 0, -3.15], ["z"], ["m", 3.18, -2.34], ["l", 0, -0.81], ["l", -1.2, 0], ["l", -1.2, 0], ["l", 0, 3.15], ["l", 0, 3.15], ["l", 0.12, 0], ["c", 1.17, -0.24, 1.89, -1.32, 2.13, -3.36], ["c", 0.09, -0.66, 0.12, -1.17, 0.15, -2.13], ["z"]],w:16.035,h:21.062},'scripts.roll':{d:[["M", 1.95, -6], ["c", 0.21, -0.09, 0.36, -0.09, 0.57, 0], ["c", 0.39, 0.15, 0.63, 0.39, 1.47, 1.35], ["c", 0.66, 0.75, 0.78, 0.87, 1.08, 1.05], ["c", 0.75, 0.45, 1.65, 0.42, 2.4, -0.06], ["c", 0.12, -0.09, 0.27, -0.27, 0.54, -0.6], ["c", 0.42, -0.54, 0.51, -0.63, 0.69, -0.63], ["c", 0.09, 0, 0.3, 0.12, 0.36, 0.21], ["c", 0.09, 0.12, 0.12, 0.3, 0.03, 0.42], ["c", -0.06, 0.12, -3.15, 3.9, -3.3, 4.08], ["c", -0.06, 0.06, -0.18, 0.12, -0.27, 0.18], ["c", -0.27, 0.12, -0.6, 0.06, -0.99, -0.27], ["c", -0.27, -0.21, -0.42, -0.39, -1.08, -1.14], ["c", -0.63, -0.72, -0.81, -0.9, -1.17, -1.08], ["c", -0.36, -0.18, -0.57, -0.21, -0.99, -0.21], ["c", -0.39, 0, -0.63, 0.03, -0.93, 0.18], ["c", -0.36, 0.15, -0.51, 0.27, -0.9, 0.81], ["c", -0.24, 0.27, -0.45, 0.51, -0.48, 0.54], ["c", -0.12, 0.09, -0.27, 0.06, -0.39, 0], ["c", -0.24, -0.15, -0.33, -0.39, -0.21, -0.6], ["c", 0.09, -0.12, 3.18, -3.87, 3.33, -4.02], ["c", 0.06, -0.06, 0.18, -0.15, 0.24, -0.21], ["z"]],w:10.817,h:6.125},'flags.u8th':{d:[["M", -0.42, 3.75], ["l", 0, -3.75], ["l", 0.21, 0], ["l", 0.21, 0], ["l", 0, 0.18], ["c", 0, 0.3, 0.06, 0.84, 0.12, 1.23], ["c", 0.24, 1.53, 0.9, 3.12, 2.13, 5.16], ["l", 0.99, 1.59], ["c", 0.87, 1.44, 1.38, 2.34, 1.77, 3.09], ["c", 0.81, 1.68, 1.2, 3.06, 1.26, 4.53], ["c", 0.03, 1.53, -0.21, 3.27, -0.75, 5.01], ["c", -0.21, 0.69, -0.51, 1.5, -0.6, 1.59], ["c", -0.09, 0.12, -0.27, 0.21, -0.42, 0.21], ["c", -0.15, 0, -0.42, -0.12, -0.51, -0.21], ["c", -0.15, -0.18, -0.18, -0.42, -0.09, -0.66], ["c", 0.15, -0.33, 0.45, -1.2, 0.57, -1.62], ["c", 0.42, -1.38, 0.6, -2.58, 0.6, -3.9], ["c", 0, -0.66, 0, -0.81, -0.06, -1.11], ["c", -0.39, -2.07, -1.8, -4.26, -4.59, -7.14], ["l", -0.42, -0.45], ["l", -0.21, 0], ["l", -0.21, 0], ["l", 0, -3.75], ["z"]],w:6.692,h:22.59},'flags.u16th':{d:[["M", -0.42, 7.5], ["l", 0, -7.5], ["l", 0.21, 0], ["l", 0.21, 0], ["l", 0, 0.39], ["c", 0.06, 1.08, 0.39, 2.19, 0.99, 3.39], ["c", 0.45, 0.9, 0.87, 1.59, 1.95, 3.12], ["c", 1.29, 1.86, 1.77, 2.64, 2.22, 3.57], ["c", 0.45, 0.93, 0.72, 1.8, 0.87, 2.64], ["c", 0.06, 0.51, 0.06, 1.5, 0, 1.92], ["c", -0.12, 0.6, -0.3, 1.2, -0.54, 1.71], ["l", -0.09, 0.24], ["l", 0.18, 0.45], ["c", 0.51, 1.2, 0.72, 2.22, 0.69, 3.42], ["c", -0.06, 1.53, -0.39, 3.03, -0.99, 4.53], ["c", -0.3, 0.75, -0.36, 0.81, -0.57, 0.9], ["c", -0.15, 0.09, -0.33, 0.06, -0.48, -0], ["c", -0.18, -0.09, -0.27, -0.18, -0.33, -0.33], ["c", -0.09, -0.18, -0.06, -0.3, 0.12, -0.75], ["c", 0.66, -1.41, 1.02, -2.88, 1.08, -4.32], ["c", 0, -0.6, -0.03, -1.05, -0.18, -1.59], ["c", -0.3, -1.2, -0.99, -2.4, -2.25, -3.87], ["c", -0.42, -0.48, -1.53, -1.62, -2.19, -2.22], ["l", -0.45, -0.42], ["l", -0.03, 1.11], ["l", 0, 1.11], ["l", -0.21, -0], ["l", -0.21, -0], ["l", 0, -7.5], ["z"], ["m", 1.65, 0.09], ["c", -0.3, -0.3, -0.69, -0.72, -0.9, -0.87], ["l", -0.33, -0.33], ["l", 0, 0.15], ["c", 0, 0.3, 0.06, 0.81, 0.15, 1.26], ["c", 0.27, 1.29, 0.87, 2.61, 2.04, 4.29], ["c", 0.15, 0.24, 0.6, 0.87, 0.96, 1.38], ["l", 1.08, 1.53], ["l", 0.42, 0.63], ["c", 0.03, 0, 0.12, -0.36, 0.21, -0.72], ["c", 0.06, -0.33, 0.06, -1.2, 0, -1.62], ["c", -0.33, -1.71, -1.44, -3.48, -3.63, -5.7], ["z"]],w:6.693,h:26.337},'flags.u32nd':{d:[["M", -0.42, 11.247], ["l", 0, -11.25], ["l", 0.21, 0], ["l", 0.21, 0], ["l", 0, 0.36], ["c", 0.09, 1.68, 0.69, 3.27, 2.07, 5.46], ["l", 0.87, 1.35], ["c", 1.02, 1.62, 1.47, 2.37, 1.86, 3.18], ["c", 0.48, 1.02, 0.78, 1.92, 0.93, 2.88], ["c", 0.06, 0.48, 0.06, 1.5, 0, 1.89], ["c", -0.09, 0.42, -0.21, 0.87, -0.36, 1.26], ["l", -0.12, 0.3], ["l", 0.15, 0.39], ["c", 0.69, 1.56, 0.84, 2.88, 0.54, 4.38], ["c", -0.09, 0.45, -0.27, 1.08, -0.45, 1.47], ["l", -0.12, 0.24], ["l", 0.18, 0.36], ["c", 0.33, 0.72, 0.57, 1.56, 0.69, 2.34], ["c", 0.12, 1.02, -0.06, 2.52, -0.42, 3.84], ["c", -0.27, 0.93, -0.75, 2.13, -0.93, 2.31], ["c", -0.18, 0.15, -0.45, 0.18, -0.66, 0.09], ["c", -0.18, -0.09, -0.27, -0.18, -0.33, -0.33], ["c", -0.09, -0.18, -0.06, -0.3, 0.06, -0.6], ["c", 0.21, -0.36, 0.42, -0.9, 0.57, -1.38], ["c", 0.51, -1.41, 0.69, -3.06, 0.48, -4.08], ["c", -0.15, -0.81, -0.57, -1.68, -1.2, -2.55], ["c", -0.72, -0.99, -1.83, -2.13, -3.3, -3.33], ["l", -0.48, -0.42], ["l", -0.03, 1.53], ["l", 0, 1.56], ["l", -0.21, 0], ["l", -0.21, 0], ["l", 0, -11.25], ["z"], ["m", 1.26, -3.96], ["c", -0.27, -0.3, -0.54, -0.6, -0.66, -0.72], ["l", -0.18, -0.21], ["l", 0, 0.42], ["c", 0.06, 0.87, 0.24, 1.74, 0.66, 2.67], ["c", 0.36, 0.87, 0.96, 1.86, 1.92, 3.18], ["c", 0.21, 0.33, 0.63, 0.87, 0.87, 1.23], ["c", 0.27, 0.39, 0.6, 0.84, 0.75, 1.08], ["l", 0.27, 0.39], ["l", 0.03, -0.12], ["c", 0.12, -0.45, 0.15, -1.05, 0.09, -1.59], ["c", -0.27, -1.86, -1.38, -3.78, -3.75, -6.33], ["z"], ["m", -0.27, 6.09], ["c", -0.27, -0.21, -0.48, -0.42, -0.51, -0.45], ["c", -0.06, -0.03, -0.06, -0.03, -0.06, 0.21], ["c", 0, 0.9, 0.3, 2.04, 0.81, 3.09], ["c", 0.48, 1.02, 0.96, 1.77, 2.37, 3.63], ["c", 0.6, 0.78, 1.05, 1.44, 1.29, 1.77], ["c", 0.06, 0.12, 0.15, 0.21, 0.15, 0.18], ["c", 0.03, -0.03, 0.18, -0.57, 0.24, -0.87], ["c", 0.06, -0.45, 0.06, -1.32, -0.03, -1.74], ["c", -0.09, -0.48, -0.24, -0.9, -0.51, -1.44], ["c", -0.66, -1.35, -1.83, -2.7, -3.75, -4.38], ["z"]],w:6.697,h:32.145},'flags.u64th':{d:[["M", -0.42, 15], ["l", 0, -15], ["l", 0.21, 0], ["l", 0.21, 0], ["l", 0, 0.36], ["c", 0.06, 1.2, 0.39, 2.37, 1.02, 3.66], ["c", 0.39, 0.81, 0.84, 1.56, 1.8, 3.09], ["c", 0.81, 1.26, 1.05, 1.68, 1.35, 2.22], ["c", 0.87, 1.5, 1.35, 2.79, 1.56, 4.08], ["c", 0.06, 0.54, 0.06, 1.56, -0.03, 2.04], ["c", -0.09, 0.48, -0.21, 0.99, -0.36, 1.35], ["l", -0.12, 0.27], ["l", 0.12, 0.27], ["c", 0.09, 0.15, 0.21, 0.45, 0.27, 0.66], ["c", 0.69, 1.89, 0.63, 3.66, -0.18, 5.46], ["l", -0.18, 0.39], ["l", 0.15, 0.33], ["c", 0.3, 0.66, 0.51, 1.44, 0.63, 2.1], ["c", 0.06, 0.48, 0.06, 1.35, 0, 1.71], ["c", -0.15, 0.57, -0.42, 1.2, -0.78, 1.68], ["l", -0.21, 0.27], ["l", 0.18, 0.33], ["c", 0.57, 1.05, 0.93, 2.13, 1.02, 3.18], ["c", 0.06, 0.72, 0, 1.83, -0.21, 2.79], ["c", -0.18, 1.02, -0.63, 2.34, -1.02, 3.09], ["c", -0.15, 0.33, -0.48, 0.45, -0.78, 0.3], ["c", -0.18, -0.09, -0.27, -0.18, -0.33, -0.33], ["c", -0.09, -0.18, -0.06, -0.3, 0.03, -0.54], ["c", 0.75, -1.5, 1.23, -3.45, 1.17, -4.89], ["c", -0.06, -1.02, -0.42, -2.01, -1.17, -3.15], ["c", -0.48, -0.72, -1.02, -1.35, -1.89, -2.22], ["c", -0.57, -0.57, -1.56, -1.5, -1.92, -1.77], ["l", -0.12, -0.09], ["l", 0, 1.68], ["l", 0, 1.68], ["l", -0.21, 0], ["l", -0.21, 0], ["l", 0, -15], ["z"], ["m", 0.93, -8.07], ["c", -0.27, -0.3, -0.48, -0.54, -0.51, -0.54], ["c", -0, 0, -0, 0.69, 0.03, 1.02], ["c", 0.15, 1.47, 0.75, 2.94, 2.04, 4.83], ["l", 1.08, 1.53], ["c", 0.39, 0.57, 0.84, 1.2, 0.99, 1.44], ["c", 0.15, 0.24, 0.3, 0.45, 0.3, 0.45], ["c", -0, 0, 0.03, -0.09, 0.06, -0.21], ["c", 0.36, -1.59, -0.15, -3.33, -1.47, -5.4], ["c", -0.63, -0.93, -1.35, -1.83, -2.52, -3.12], ["z"], ["m", 0.06, 6.72], ["c", -0.24, -0.21, -0.48, -0.42, -0.51, -0.45], ["l", -0.06, -0.06], ["l", 0, 0.33], ["c", 0, 1.2, 0.3, 2.34, 0.93, 3.6], ["c", 0.45, 0.9, 0.96, 1.68, 2.25, 3.51], ["c", 0.39, 0.54, 0.84, 1.17, 1.02, 1.44], ["c", 0.21, 0.33, 0.33, 0.51, 0.33, 0.48], ["c", 0.06, -0.09, 0.21, -0.63, 0.3, -0.99], ["c", 0.06, -0.33, 0.06, -0.45, 0.06, -0.96], ["c", -0, -0.6, -0.03, -0.84, -0.18, -1.35], ["c", -0.3, -1.08, -1.02, -2.28, -2.13, -3.57], ["c", -0.39, -0.45, -1.44, -1.47, -2.01, -1.98], ["z"], ["m", 0, 6.72], ["c", -0.24, -0.21, -0.48, -0.39, -0.51, -0.42], ["l", -0.06, -0.06], ["l", 0, 0.33], ["c", 0, 1.41, 0.45, 2.82, 1.38, 4.35], ["c", 0.42, 0.72, 0.72, 1.14, 1.86, 2.73], ["c", 0.36, 0.45, 0.75, 0.99, 0.87, 1.2], ["c", 0.15, 0.21, 0.3, 0.36, 0.3, 0.36], ["c", 0.06, 0, 0.3, -0.48, 0.39, -0.75], ["c", 0.09, -0.36, 0.12, -0.63, 0.12, -1.05], ["c", -0.06, -1.05, -0.45, -2.04, -1.2, -3.18], ["c", -0.57, -0.87, -1.11, -1.53, -2.07, -2.49], ["c", -0.36, -0.33, -0.84, -0.78, -1.08, -1.02], ["z"]],w:6.682,h:39.694},'flags.d8th':{d:[["M", 5.67, -21.63], ["c", 0.24, -0.12, 0.54, -0.06, 0.69, 0.15], ["c", 0.06, 0.06, 0.21, 0.36, 0.39, 0.66], ["c", 0.84, 1.77, 1.26, 3.36, 1.32, 5.1], ["c", 0.03, 1.29, -0.21, 2.37, -0.81, 3.63], ["c", -0.6, 1.23, -1.26, 2.13, -3.21, 4.38], ["c", -1.35, 1.53, -1.86, 2.19, -2.4, 2.97], ["c", -0.63, 0.93, -1.11, 1.92, -1.38, 2.79], ["c", -0.15, 0.54, -0.27, 1.35, -0.27, 1.8], ["l", 0, 0.15], ["l", -0.21, -0], ["l", -0.21, -0], ["l", 0, -3.75], ["l", 0, -3.75], ["l", 0.21, 0], ["l", 0.21, 0], ["l", 0.48, -0.3], ["c", 1.83, -1.11, 3.12, -2.1, 4.17, -3.12], ["c", 0.78, -0.81, 1.32, -1.53, 1.71, -2.31], ["c", 0.45, -0.93, 0.6, -1.74, 0.51, -2.88], ["c", -0.12, -1.56, -0.63, -3.18, -1.47, -4.68], ["c", -0.12, -0.21, -0.15, -0.33, -0.06, -0.51], ["c", 0.06, -0.15, 0.15, -0.24, 0.33, -0.33], ["z"]],w:8.492,h:21.691},'flags.ugrace':{d:[["M", 6.03, 6.93], ["c", 0.15, -0.09, 0.33, -0.06, 0.51, 0], ["c", 0.15, 0.09, 0.21, 0.15, 0.3, 0.33], ["c", 0.09, 0.18, 0.06, 0.39, -0.03, 0.54], ["c", -0.06, 0.15, -10.89, 8.88, -11.07, 8.97], ["c", -0.15, 0.09, -0.33, 0.06, -0.48, 0], ["c", -0.18, -0.09, -0.24, -0.15, -0.33, -0.33], ["c", -0.09, -0.18, -0.06, -0.39, 0.03, -0.54], ["c", 0.06, -0.15, 10.89, -8.88, 11.07, -8.97], ["z"]],w:12.019,h:9.954},'flags.dgrace':{d:[["M", -6.06, -15.93], ["c", 0.18, -0.09, 0.33, -0.12, 0.48, -0.06], ["c", 0.18, 0.09, 14.01, 8.04, 14.1, 8.1], ["c", 0.12, 0.12, 0.18, 0.33, 0.18, 0.51], ["c", -0.03, 0.21, -0.15, 0.39, -0.36, 0.48], ["c", -0.18, 0.09, -0.33, 0.12, -0.48, 0.06], ["c", -0.18, -0.09, -14.01, -8.04, -14.1, -8.1], ["c", -0.12, -0.12, -0.18, -0.33, -0.18, -0.51], ["c", 0.03, -0.21, 0.15, -0.39, 0.36, -0.48], ["z"]],w:15.12,h:9.212},'flags.d16th':{d:[["M", 6.84, -22.53], ["c", 0.27, -0.12, 0.57, -0.06, 0.72, 0.15], ["c", 0.15, 0.15, 0.33, 0.87, 0.45, 1.56], ["c", 0.06, 0.33, 0.06, 1.35, 0, 1.65], ["c", -0.06, 0.33, -0.15, 0.78, -0.27, 1.11], ["c", -0.12, 0.33, -0.45, 0.96, -0.66, 1.32], ["l", -0.18, 0.27], ["l", 0.09, 0.18], ["c", 0.48, 1.02, 0.72, 2.25, 0.69, 3.3], ["c", -0.06, 1.23, -0.42, 2.28, -1.26, 3.45], ["c", -0.57, 0.87, -0.99, 1.32, -3, 3.39], ["c", -1.56, 1.56, -2.22, 2.4, -2.76, 3.45], ["c", -0.42, 0.84, -0.66, 1.8, -0.66, 2.55], ["l", 0, 0.15], ["l", -0.21, -0], ["l", -0.21, -0], ["l", 0, -7.5], ["l", 0, -7.5], ["l", 0.21, -0], ["l", 0.21, -0], ["l", 0, 1.14], ["l", 0, 1.11], ["l", 0.27, -0.15], ["c", 1.11, -0.57, 1.77, -0.99, 2.52, -1.47], ["c", 2.37, -1.56, 3.69, -3.15, 4.05, -4.83], ["c", 0.03, -0.18, 0.03, -0.39, 0.03, -0.78], ["c", 0, -0.6, -0.03, -0.93, -0.24, -1.5], ["c", -0.06, -0.18, -0.12, -0.39, -0.15, -0.45], ["c", -0.03, -0.24, 0.12, -0.48, 0.36, -0.6], ["z"], ["m", -0.63, 7.5], ["c", -0.06, -0.18, -0.15, -0.36, -0.15, -0.36], ["c", -0.03, 0, -0.03, 0.03, -0.06, 0.06], ["c", -0.06, 0.12, -0.96, 1.02, -1.95, 1.98], ["c", -0.63, 0.57, -1.26, 1.17, -1.44, 1.35], ["c", -1.53, 1.62, -2.28, 2.85, -2.55, 4.32], ["c", -0.03, 0.18, -0.03, 0.54, -0.06, 0.99], ["l", 0, 0.69], ["l", 0.18, -0.09], ["c", 0.93, -0.54, 2.1, -1.29, 2.82, -1.83], ["c", 0.69, -0.51, 1.02, -0.81, 1.53, -1.29], ["c", 1.86, -1.89, 2.37, -3.66, 1.68, -5.82], ["z"]],w:8.475,h:22.591},'flags.d32nd':{d:[["M", 6.794, -29.13], ["c", 0.27, -0.12, 0.57, -0.06, 0.72, 0.15], ["c", 0.12, 0.12, 0.27, 0.63, 0.36, 1.11], ["c", 0.33, 1.59, 0.06, 3.06, -0.81, 4.47], ["l", -0.18, 0.27], ["l", 0.09, 0.15], ["c", 0.12, 0.24, 0.33, 0.69, 0.45, 1.05], ["c", 0.63, 1.83, 0.45, 3.57, -0.57, 5.22], ["l", -0.18, 0.3], ["l", 0.15, 0.27], ["c", 0.42, 0.87, 0.6, 1.71, 0.57, 2.61], ["c", -0.06, 1.29, -0.48, 2.46, -1.35, 3.78], ["c", -0.54, 0.81, -0.93, 1.29, -2.46, 3], ["c", -0.51, 0.54, -1.05, 1.17, -1.26, 1.41], ["c", -1.56, 1.86, -2.25, 3.36, -2.37, 5.01], ["l", 0, 0.33], ["l", -0.21, -0], ["l", -0.21, -0], ["l", 0, -11.25], ["l", 0, -11.25], ["l", 0.21, 0], ["l", 0.21, 0], ["l", 0, 1.35], ["l", 0.03, 1.35], ["l", 0.78, -0.39], ["c", 1.38, -0.69, 2.34, -1.26, 3.24, -1.92], ["c", 1.38, -1.02, 2.28, -2.13, 2.64, -3.21], ["c", 0.15, -0.48, 0.18, -0.72, 0.18, -1.29], ["c", 0, -0.57, -0.06, -0.9, -0.24, -1.47], ["c", -0.06, -0.18, -0.12, -0.39, -0.15, -0.45], ["c", -0.03, -0.24, 0.12, -0.48, 0.36, -0.6], ["z"], ["m", -0.63, 7.2], ["c", -0.09, -0.18, -0.12, -0.21, -0.12, -0.15], ["c", -0.03, 0.09, -1.02, 1.08, -2.04, 2.04], ["c", -1.17, 1.08, -1.65, 1.56, -2.07, 2.04], ["c", -0.84, 0.96, -1.38, 1.86, -1.68, 2.76], ["c", -0.21, 0.57, -0.27, 0.99, -0.3, 1.65], ["l", 0, 0.54], ["l", 0.66, -0.33], ["c", 3.57, -1.86, 5.49, -3.69, 5.94, -5.7], ["c", 0.06, -0.39, 0.06, -1.2, -0.03, -1.65], ["c", -0.06, -0.39, -0.24, -0.9, -0.36, -1.2], ["z"], ["m", -0.06, 7.2], ["c", -0.06, -0.15, -0.12, -0.33, -0.15, -0.45], ["l", -0.06, -0.18], ["l", -0.18, 0.21], ["l", -1.83, 1.83], ["c", -0.87, 0.9, -1.77, 1.8, -1.95, 2.01], ["c", -1.08, 1.29, -1.62, 2.31, -1.89, 3.51], ["c", -0.06, 0.3, -0.06, 0.51, -0.09, 0.93], ["l", 0, 0.57], ["l", 0.09, -0.06], ["c", 0.75, -0.45, 1.89, -1.26, 2.52, -1.74], ["c", 0.81, -0.66, 1.74, -1.53, 2.22, -2.16], ["c", 1.26, -1.53, 1.68, -3.06, 1.32, -4.47], ["z"]],w:8.475,h:29.191},'flags.d64th':{d:[["M", 7.08, -32.88], ["c", 0.3, -0.12, 0.66, -0.03, 0.78, 0.24], ["c", 0.18, 0.33, 0.27, 2.1, 0.15, 2.64], ["c", -0.09, 0.39, -0.21, 0.78, -0.39, 1.08], ["l", -0.15, 0.3], ["l", 0.09, 0.27], ["c", 0.03, 0.12, 0.09, 0.45, 0.12, 0.69], ["c", 0.27, 1.44, 0.18, 2.55, -0.3, 3.6], ["l", -0.12, 0.33], ["l", 0.06, 0.42], ["c", 0.27, 1.35, 0.33, 2.82, 0.21, 3.63], ["c", -0.12, 0.6, -0.3, 1.23, -0.57, 1.8], ["l", -0.15, 0.27], ["l", 0.03, 0.42], ["c", 0.06, 1.02, 0.06, 2.7, 0.03, 3.06], ["c", -0.15, 1.47, -0.66, 2.76, -1.74, 4.41], ["c", -0.45, 0.69, -0.75, 1.11, -1.74, 2.37], ["c", -1.05, 1.38, -1.5, 1.98, -1.95, 2.73], ["c", -0.93, 1.5, -1.38, 2.82, -1.44, 4.2], ["l", 0, 0.42], ["l", -0.21, -0], ["l", -0.21, -0], ["l", 0, -15], ["l", 0, -15], ["l", 0.21, -0], ["l", 0.21, -0], ["l", 0, 1.86], ["l", 0, 1.89], ["c", 0, -0, 0.21, -0.03, 0.45, -0.09], ["c", 2.22, -0.39, 4.08, -1.11, 5.19, -2.01], ["c", 0.63, -0.54, 1.02, -1.14, 1.2, -1.8], ["c", 0.06, -0.3, 0.06, -1.14, -0.03, -1.65], ["c", -0.03, -0.18, -0.06, -0.39, -0.09, -0.48], ["c", -0.03, -0.24, 0.12, -0.48, 0.36, -0.6], ["z"], ["m", -0.45, 6.15], ["c", -0.03, -0.18, -0.06, -0.42, -0.06, -0.54], ["l", -0.03, -0.18], ["l", -0.33, 0.3], ["c", -0.42, 0.36, -0.87, 0.72, -1.68, 1.29], ["c", -1.98, 1.38, -2.25, 1.59, -2.85, 2.16], ["c", -0.75, 0.69, -1.23, 1.44, -1.47, 2.19], ["c", -0.15, 0.45, -0.18, 0.63, -0.21, 1.35], ["l", 0, 0.66], ["l", 0.39, -0.18], ["c", 1.83, -0.9, 3.45, -1.95, 4.47, -2.91], ["c", 0.93, -0.9, 1.53, -1.83, 1.74, -2.82], ["c", 0.06, -0.33, 0.06, -0.87, 0.03, -1.32], ["z"], ["m", -0.27, 4.86], ["c", -0.03, -0.21, -0.06, -0.36, -0.06, -0.36], ["c", 0, -0.03, -0.12, 0.09, -0.24, 0.24], ["c", -0.39, 0.48, -0.99, 1.08, -2.16, 2.19], ["c", -1.47, 1.38, -1.92, 1.83, -2.46, 2.49], ["c", -0.66, 0.87, -1.08, 1.74, -1.29, 2.58], ["c", -0.09, 0.42, -0.15, 0.87, -0.15, 1.44], ["l", 0, 0.54], ["l", 0.48, -0.33], ["c", 1.5, -1.02, 2.58, -1.89, 3.51, -2.82], ["c", 1.47, -1.47, 2.25, -2.85, 2.4, -4.26], ["c", 0.03, -0.39, 0.03, -1.17, -0.03, -1.71], ["z"], ["m", -0.66, 7.68], ["c", 0.03, -0.15, 0.03, -0.6, 0.03, -0.99], ["l", 0, -0.72], ["l", -0.27, 0.33], ["l", -1.74, 1.98], ["c", -1.77, 1.92, -2.43, 2.76, -2.97, 3.9], ["c", -0.51, 1.02, -0.72, 1.77, -0.75, 2.91], ["c", 0, 0.63, 0, 0.63, 0.06, 0.6], ["c", 0.03, -0.03, 0.3, -0.27, 0.63, -0.54], ["c", 0.66, -0.6, 1.86, -1.8, 2.31, -2.31], ["c", 1.65, -1.89, 2.52, -3.54, 2.7, -5.16], ["z"]],w:8.485,h:32.932},'clefs.C':{d:[["M", 0.06, -14.94], ["l", 0.09, -0.06], ["l", 1.92, 0], ["l", 1.92, 0], ["l", 0.09, 0.06], ["l", 0.06, 0.09], ["l", 0, 14.85], ["l", 0, 14.82], ["l", -0.06, 0.09], ["l", -0.09, 0.06], ["l", -1.92, 0], ["l", -1.92, 0], ["l", -0.09, -0.06], ["l", -0.06, -0.09], ["l", 0, -14.82], ["l", 0, -14.85], ["z"], ["m", 5.37, 0], ["c", 0.09, -0.06, 0.09, -0.06, 0.57, -0.06], ["c", 0.45, 0, 0.45, 0, 0.54, 0.06], ["l", 0.06, 0.09], ["l", 0, 7.14], ["l", 0, 7.11], ["l", 0.09, -0.06], ["c", 0.18, -0.18, 0.72, -0.84, 0.96, -1.2], ["c", 0.3, -0.45, 0.66, -1.17, 0.84, -1.65], ["c", 0.36, -0.9, 0.57, -1.83, 0.6, -2.79], ["c", 0.03, -0.48, 0.03, -0.54, 0.09, -0.63], ["c", 0.12, -0.18, 0.36, -0.21, 0.54, -0.12], ["c", 0.18, 0.09, 0.21, 0.15, 0.24, 0.66], ["c", 0.06, 0.87, 0.21, 1.56, 0.57, 2.22], ["c", 0.51, 1.02, 1.26, 1.68, 2.22, 1.92], ["c", 0.21, 0.06, 0.33, 0.06, 0.78, 0.06], ["c", 0.45, -0, 0.57, -0, 0.84, -0.06], ["c", 0.45, -0.12, 0.81, -0.33, 1.08, -0.6], ["c", 0.57, -0.57, 0.87, -1.41, 0.99, -2.88], ["c", 0.06, -0.54, 0.06, -3, 0, -3.57], ["c", -0.21, -2.58, -0.84, -3.87, -2.16, -4.5], ["c", -0.48, -0.21, -1.17, -0.36, -1.77, -0.36], ["c", -0.69, 0, -1.29, 0.27, -1.5, 0.72], ["c", -0.06, 0.15, -0.06, 0.21, -0.06, 0.42], ["c", 0, 0.24, 0, 0.3, 0.06, 0.45], ["c", 0.12, 0.24, 0.24, 0.39, 0.63, 0.66], ["c", 0.42, 0.3, 0.57, 0.48, 0.69, 0.72], ["c", 0.06, 0.15, 0.06, 0.21, 0.06, 0.48], ["c", 0, 0.39, -0.03, 0.63, -0.21, 0.96], ["c", -0.3, 0.6, -0.87, 1.08, -1.5, 1.26], ["c", -0.27, 0.06, -0.87, 0.06, -1.14, 0], ["c", -0.78, -0.24, -1.44, -0.87, -1.65, -1.68], ["c", -0.12, -0.42, -0.09, -1.17, 0.09, -1.71], ["c", 0.51, -1.65, 1.98, -2.82, 3.81, -3.09], ["c", 0.84, -0.09, 2.46, 0.03, 3.51, 0.27], ["c", 2.22, 0.57, 3.69, 1.8, 4.44, 3.75], ["c", 0.36, 0.93, 0.57, 2.13, 0.57, 3.36], ["c", -0, 1.44, -0.48, 2.73, -1.38, 3.81], ["c", -1.26, 1.5, -3.27, 2.43, -5.28, 2.43], ["c", -0.48, -0, -0.51, -0, -0.75, -0.09], ["c", -0.15, -0.03, -0.48, -0.21, -0.78, -0.36], ["c", -0.69, -0.36, -0.87, -0.42, -1.26, -0.42], ["c", -0.27, -0, -0.3, -0, -0.51, 0.09], ["c", -0.57, 0.3, -0.81, 0.9, -0.81, 2.1], ["c", -0, 1.23, 0.24, 1.83, 0.81, 2.13], ["c", 0.21, 0.09, 0.24, 0.09, 0.51, 0.09], ["c", 0.39, -0, 0.57, -0.06, 1.26, -0.42], ["c", 0.3, -0.15, 0.63, -0.33, 0.78, -0.36], ["c", 0.24, -0.09, 0.27, -0.09, 0.75, -0.09], ["c", 2.01, -0, 4.02, 0.93, 5.28, 2.4], ["c", 0.9, 1.11, 1.38, 2.4, 1.38, 3.84], ["c", -0, 1.5, -0.3, 2.88, -0.84, 3.96], ["c", -0.78, 1.59, -2.19, 2.64, -4.17, 3.15], ["c", -1.05, 0.24, -2.67, 0.36, -3.51, 0.27], ["c", -1.83, -0.27, -3.3, -1.44, -3.81, -3.09], ["c", -0.18, -0.54, -0.21, -1.29, -0.09, -1.74], ["c", 0.15, -0.6, 0.63, -1.2, 1.23, -1.47], ["c", 0.36, -0.18, 0.57, -0.21, 0.99, -0.21], ["c", 0.42, 0, 0.63, 0.03, 1.02, 0.21], ["c", 0.42, 0.21, 0.84, 0.63, 1.05, 1.05], ["c", 0.18, 0.36, 0.21, 0.6, 0.21, 0.96], ["c", -0, 0.3, -0, 0.36, -0.06, 0.51], ["c", -0.12, 0.24, -0.27, 0.42, -0.69, 0.72], ["c", -0.57, 0.42, -0.69, 0.63, -0.69, 1.08], ["c", -0, 0.24, -0, 0.3, 0.06, 0.45], ["c", 0.12, 0.21, 0.3, 0.39, 0.57, 0.54], ["c", 0.42, 0.18, 0.87, 0.21, 1.53, 0.15], ["c", 1.08, -0.15, 1.8, -0.57, 2.34, -1.32], ["c", 0.54, -0.75, 0.84, -1.83, 0.99, -3.51], ["c", 0.06, -0.57, 0.06, -3.03, -0, -3.57], ["c", -0.12, -1.47, -0.42, -2.31, -0.99, -2.88], ["c", -0.27, -0.27, -0.63, -0.48, -1.08, -0.6], ["c", -0.27, -0.06, -0.39, -0.06, -0.84, -0.06], ["c", -0.45, 0, -0.57, 0, -0.78, 0.06], ["c", -1.14, 0.27, -2.01, 1.17, -2.46, 2.49], ["c", -0.21, 0.57, -0.3, 0.99, -0.33, 1.65], ["c", -0.03, 0.51, -0.06, 0.57, -0.24, 0.66], ["c", -0.12, 0.06, -0.27, 0.06, -0.39, 0], ["c", -0.21, -0.09, -0.21, -0.15, -0.24, -0.75], ["c", -0.09, -1.92, -0.78, -3.72, -2.01, -5.19], ["c", -0.18, -0.21, -0.36, -0.42, -0.39, -0.45], ["l", -0.09, -0.06], ["l", -0, 7.11], ["l", -0, 7.14], ["l", -0.06, 0.09], ["c", -0.09, 0.06, -0.09, 0.06, -0.54, 0.06], ["c", -0.48, 0, -0.48, 0, -0.57, -0.06], ["l", -0.06, -0.09], ["l", -0, -14.82], ["l", -0, -14.85], ["z"]],w:20.31,h:29.97},'clefs.F':{d:[["M", 6.3, -7.8], ["c", 0.36, -0.03, 1.65, 0, 2.13, 0.03], ["c", 3.6, 0.42, 6.03, 2.1, 6.93, 4.86], ["c", 0.27, 0.84, 0.36, 1.5, 0.36, 2.58], ["c", 0, 0.9, -0.03, 1.35, -0.18, 2.16], ["c", -0.78, 3.78, -3.54, 7.08, -8.37, 9.96], ["c", -1.74, 1.05, -3.87, 2.13, -6.18, 3.12], ["c", -0.39, 0.18, -0.75, 0.33, -0.81, 0.36], ["c", -0.06, 0.03, -0.15, 0.06, -0.18, 0.06], ["c", -0.15, 0, -0.33, -0.18, -0.33, -0.33], ["c", 0, -0.15, 0.06, -0.21, 0.51, -0.48], ["c", 3, -1.77, 5.13, -3.21, 6.84, -4.74], ["c", 0.51, -0.45, 1.59, -1.5, 1.95, -1.95], ["c", 1.89, -2.19, 2.88, -4.32, 3.15, -6.78], ["c", 0.06, -0.42, 0.06, -1.77, 0, -2.19], ["c", -0.24, -2.01, -0.93, -3.63, -2.04, -4.71], ["c", -0.63, -0.63, -1.29, -1.02, -2.07, -1.2], ["c", -1.62, -0.39, -3.36, 0.15, -4.56, 1.44], ["c", -0.54, 0.6, -1.05, 1.47, -1.32, 2.22], ["l", -0.09, 0.21], ["l", 0.24, -0.12], ["c", 0.39, -0.21, 0.63, -0.24, 1.11, -0.24], ["c", 0.3, 0, 0.45, 0, 0.66, 0.06], ["c", 1.92, 0.48, 2.85, 2.55, 1.95, 4.38], ["c", -0.45, 0.99, -1.41, 1.62, -2.46, 1.71], ["c", -1.47, 0.09, -2.91, -0.87, -3.39, -2.25], ["c", -0.18, -0.57, -0.21, -1.32, -0.03, -2.28], ["c", 0.39, -2.25, 1.83, -4.2, 3.81, -5.19], ["c", 0.69, -0.36, 1.59, -0.6, 2.37, -0.69], ["z"], ["m", 11.58, 2.52], ["c", 0.84, -0.21, 1.71, 0.3, 1.89, 1.14], ["c", 0.3, 1.17, -0.72, 2.19, -1.89, 1.89], ["c", -0.99, -0.21, -1.5, -1.32, -1.02, -2.25], ["c", 0.18, -0.39, 0.6, -0.69, 1.02, -0.78], ["z"], ["m", 0, 7.5], ["c", 0.84, -0.21, 1.71, 0.3, 1.89, 1.14], ["c", 0.21, 0.87, -0.3, 1.71, -1.14, 1.89], ["c", -0.87, 0.21, -1.71, -0.3, -1.89, -1.14], ["c", -0.21, -0.84, 0.3, -1.71, 1.14, -1.89], ["z"]],w:20.153,h:23.142},'clefs.G':{d:[["M", 9.69, -37.41], ["c", 0.09, -0.09, 0.24, -0.06, 0.36, 0], ["c", 0.12, 0.09, 0.57, 0.6, 0.96, 1.11], ["c", 1.77, 2.34, 3.21, 5.85, 3.57, 8.73], ["c", 0.21, 1.56, 0.03, 3.27, -0.45, 4.86], ["c", -0.69, 2.31, -1.92, 4.47, -4.23, 7.44], ["c", -0.3, 0.39, -0.57, 0.72, -0.6, 0.75], ["c", -0.03, 0.06, 0, 0.15, 0.18, 0.78], ["c", 0.54, 1.68, 1.38, 4.44, 1.68, 5.49], ["l", 0.09, 0.42], ["l", 0.39, -0], ["c", 1.47, 0.09, 2.76, 0.51, 3.96, 1.29], ["c", 1.83, 1.23, 3.06, 3.21, 3.39, 5.52], ["c", 0.09, 0.45, 0.12, 1.29, 0.06, 1.74], ["c", -0.09, 1.02, -0.33, 1.83, -0.75, 2.73], ["c", -0.84, 1.71, -2.28, 3.06, -4.02, 3.72], ["l", -0.33, 0.12], ["l", 0.03, 1.26], ["c", 0, 1.74, -0.06, 3.63, -0.21, 4.62], ["c", -0.45, 3.06, -2.19, 5.49, -4.47, 6.21], ["c", -0.57, 0.18, -0.9, 0.21, -1.59, 0.21], ["c", -0.69, -0, -1.02, -0.03, -1.65, -0.21], ["c", -1.14, -0.27, -2.13, -0.84, -2.94, -1.65], ["c", -0.99, -0.99, -1.56, -2.16, -1.71, -3.54], ["c", -0.09, -0.81, 0.06, -1.53, 0.45, -2.13], ["c", 0.63, -0.99, 1.83, -1.56, 3, -1.53], ["c", 1.5, 0.09, 2.64, 1.32, 2.73, 2.94], ["c", 0.06, 1.47, -0.93, 2.7, -2.37, 2.97], ["c", -0.45, 0.06, -0.84, 0.03, -1.29, -0.09], ["l", -0.21, -0.09], ["l", 0.09, 0.12], ["c", 0.39, 0.54, 0.78, 0.93, 1.32, 1.26], ["c", 1.35, 0.87, 3.06, 1.02, 4.35, 0.36], ["c", 1.44, -0.72, 2.52, -2.28, 2.97, -4.35], ["c", 0.15, -0.66, 0.24, -1.5, 0.3, -3.03], ["c", 0.03, -0.84, 0.03, -2.94, -0, -3], ["c", -0.03, -0, -0.18, -0, -0.36, 0.03], ["c", -0.66, 0.12, -0.99, 0.12, -1.83, 0.12], ["c", -1.05, -0, -1.71, -0.06, -2.61, -0.3], ["c", -4.02, -0.99, -7.11, -4.35, -7.8, -8.46], ["c", -0.12, -0.66, -0.12, -0.99, -0.12, -1.83], ["c", -0, -0.84, -0, -1.14, 0.15, -1.92], ["c", 0.36, -2.28, 1.41, -4.62, 3.3, -7.29], ["l", 2.79, -3.6], ["c", 0.54, -0.66, 0.96, -1.2, 0.96, -1.23], ["c", -0, -0.03, -0.09, -0.33, -0.18, -0.69], ["c", -0.96, -3.21, -1.41, -5.28, -1.59, -7.68], ["c", -0.12, -1.38, -0.15, -3.09, -0.06, -3.96], ["c", 0.33, -2.67, 1.38, -5.07, 3.12, -7.08], ["c", 0.36, -0.42, 0.99, -1.05, 1.17, -1.14], ["z"], ["m", 2.01, 4.71], ["c", -0.15, -0.3, -0.3, -0.54, -0.3, -0.54], ["c", -0.03, 0, -0.18, 0.09, -0.3, 0.21], ["c", -2.4, 1.74, -3.87, 4.2, -4.26, 7.11], ["c", -0.06, 0.54, -0.06, 1.41, -0.03, 1.89], ["c", 0.09, 1.29, 0.48, 3.12, 1.08, 5.22], ["c", 0.15, 0.42, 0.24, 0.78, 0.24, 0.81], ["c", 0, 0.03, 0.84, -1.11, 1.23, -1.68], ["c", 1.89, -2.73, 2.88, -5.07, 3.15, -7.53], ["c", 0.09, -0.57, 0.12, -1.74, 0.06, -2.37], ["c", -0.09, -1.23, -0.27, -1.92, -0.87, -3.12], ["z"], ["m", -2.94, 20.7], ["c", -0.21, -0.72, -0.39, -1.32, -0.42, -1.32], ["c", 0, 0, -1.2, 1.47, -1.86, 2.37], ["c", -2.79, 3.63, -4.02, 6.3, -4.35, 9.3], ["c", -0.03, 0.21, -0.03, 0.69, -0.03, 1.08], ["c", 0, 0.69, 0, 0.75, 0.06, 1.11], ["c", 0.12, 0.54, 0.27, 0.99, 0.51, 1.47], ["c", 0.69, 1.38, 1.83, 2.55, 3.42, 3.42], ["c", 0.96, 0.54, 2.07, 0.9, 3.21, 1.08], ["c", 0.78, 0.12, 2.04, 0.12, 2.94, -0.03], ["c", 0.51, -0.06, 0.45, -0.03, 0.42, -0.3], ["c", -0.24, -3.33, -0.72, -6.33, -1.62, -10.08], ["c", -0.09, -0.39, -0.18, -0.75, -0.18, -0.78], ["c", -0.03, -0.03, -0.42, -0, -0.81, 0.09], ["c", -0.9, 0.18, -1.65, 0.57, -2.22, 1.14], ["c", -0.72, 0.72, -1.08, 1.65, -1.05, 2.64], ["c", 0.06, 0.96, 0.48, 1.83, 1.23, 2.58], ["c", 0.36, 0.36, 0.72, 0.63, 1.17, 0.9], ["c", 0.33, 0.18, 0.36, 0.21, 0.42, 0.33], ["c", 0.18, 0.42, -0.18, 0.9, -0.6, 0.87], ["c", -0.18, -0.03, -0.84, -0.36, -1.26, -0.63], ["c", -0.78, -0.51, -1.38, -1.11, -1.86, -1.83], ["c", -1.77, -2.7, -0.99, -6.42, 1.71, -8.19], ["c", 0.3, -0.21, 0.81, -0.48, 1.17, -0.63], ["c", 0.3, -0.09, 1.02, -0.3, 1.14, -0.3], ["c", 0.06, -0, 0.09, -0, 0.09, -0.03], ["c", 0.03, -0.03, -0.51, -1.92, -1.23, -4.26], ["z"], ["m", 3.78, 7.41], ["c", -0.18, -0.03, -0.36, -0.06, -0.39, -0.06], ["c", -0.03, 0, 0, 0.21, 0.18, 1.02], ["c", 0.75, 3.18, 1.26, 6.3, 1.5, 9.09], ["c", 0.06, 0.72, 0, 0.69, 0.51, 0.42], ["c", 0.78, -0.36, 1.44, -0.96, 1.98, -1.77], ["c", 1.08, -1.62, 1.2, -3.69, 0.3, -5.55], ["c", -0.81, -1.62, -2.31, -2.79, -4.08, -3.15], ["z"]],w:19.051,h:57.057},'clefs.perc':{d:[["M", 5.07, -7.44], ["l", 0.09, -0.06], ["l", 1.53, 0], ["l", 1.53, 0], ["l", 0.09, 0.06], ["l", 0.06, 0.09], ["l", 0, 7.35], ["l", 0, 7.32], ["l", -0.06, 0.09], ["l", -0.09, 0.06], ["l", -1.53, -0], ["l", -1.53, -0], ["l", -0.09, -0.06], ["l", -0.06, -0.09], ["l", 0, -7.32], ["l", 0, -7.35], ["z"], ["m", 6.63, 0], ["l", 0.09, -0.06], ["l", 1.53, 0], ["l", 1.53, 0], ["l", 0.09, 0.06], ["l", 0.06, 0.09], ["l", 0, 7.35], ["l", 0, 7.32], ["l", -0.06, 0.09], ["l", -0.09, 0.06], ["l", -1.53, -0], ["l", -1.53, -0], ["l", -0.09, -0.06], ["l", -0.06, -0.09], ["l", 0, -7.32], ["l", 0, -7.35], ["z"]],w:9.99,h:14.97},'timesig.common':{d:[["M", 6.66, -7.826], ["c", 0.72, -0.06, 1.41, -0.03, 1.98, 0.09], ["c", 1.2, 0.27, 2.34, 0.96, 3.09, 1.92], ["c", 0.63, 0.81, 1.08, 1.86, 1.14, 2.73], ["c", 0.06, 1.02, -0.51, 1.92, -1.44, 2.22], ["c", -0.24, 0.09, -0.3, 0.09, -0.63, 0.09], ["c", -0.33, -0, -0.42, -0, -0.63, -0.06], ["c", -0.66, -0.24, -1.14, -0.63, -1.41, -1.2], ["c", -0.15, -0.3, -0.21, -0.51, -0.24, -0.9], ["c", -0.06, -1.08, 0.57, -2.04, 1.56, -2.37], ["c", 0.18, -0.06, 0.27, -0.06, 0.63, -0.06], ["l", 0.45, 0], ["c", 0.06, 0.03, 0.09, 0.03, 0.09, 0], ["c", 0, 0, -0.09, -0.12, -0.24, -0.27], ["c", -1.02, -1.11, -2.55, -1.68, -4.08, -1.5], ["c", -1.29, 0.15, -2.04, 0.69, -2.4, 1.74], ["c", -0.36, 0.93, -0.42, 1.89, -0.42, 5.37], ["c", 0, 2.97, 0.06, 3.96, 0.24, 4.77], ["c", 0.24, 1.08, 0.63, 1.68, 1.41, 2.07], ["c", 0.81, 0.39, 2.16, 0.45, 3.18, 0.09], ["c", 1.29, -0.45, 2.37, -1.53, 3.03, -2.97], ["c", 0.15, -0.33, 0.33, -0.87, 0.39, -1.17], ["c", 0.09, -0.24, 0.15, -0.36, 0.3, -0.39], ["c", 0.21, -0.03, 0.42, 0.15, 0.39, 0.36], ["c", -0.06, 0.39, -0.42, 1.38, -0.69, 1.89], ["c", -0.96, 1.8, -2.49, 2.94, -4.23, 3.18], ["c", -0.99, 0.12, -2.58, -0.06, -3.63, -0.45], ["c", -0.96, -0.36, -1.71, -0.84, -2.4, -1.5], ["c", -1.11, -1.11, -1.8, -2.61, -2.04, -4.56], ["c", -0.06, -0.6, -0.06, -2.01, 0, -2.61], ["c", 0.24, -1.95, 0.9, -3.45, 2.01, -4.56], ["c", 0.69, -0.66, 1.44, -1.11, 2.37, -1.47], ["c", 0.63, -0.24, 1.47, -0.42, 2.22, -0.48], ["z"]],w:13.038,h:15.697},'timesig.cut':{d:[["M", 6.24, -10.44], ["c", 0.09, -0.06, 0.09, -0.06, 0.48, -0.06], ["c", 0.36, 0, 0.36, 0, 0.45, 0.06], ["l", 0.06, 0.09], ["l", 0, 1.23], ["l", 0, 1.26], ["l", 0.27, 0], ["c", 1.26, 0, 2.49, 0.45, 3.48, 1.29], ["c", 1.05, 0.87, 1.8, 2.28, 1.89, 3.48], ["c", 0.06, 1.02, -0.51, 1.92, -1.44, 2.22], ["c", -0.24, 0.09, -0.3, 0.09, -0.63, 0.09], ["c", -0.33, -0, -0.42, -0, -0.63, -0.06], ["c", -0.66, -0.24, -1.14, -0.63, -1.41, -1.2], ["c", -0.15, -0.3, -0.21, -0.51, -0.24, -0.9], ["c", -0.06, -1.08, 0.57, -2.04, 1.56, -2.37], ["c", 0.18, -0.06, 0.27, -0.06, 0.63, -0.06], ["l", 0.45, -0], ["c", 0.06, 0.03, 0.09, 0.03, 0.09, -0], ["c", 0, -0.03, -0.45, -0.51, -0.66, -0.69], ["c", -0.87, -0.69, -1.83, -1.05, -2.94, -1.11], ["l", -0.42, 0], ["l", 0, 7.17], ["l", 0, 7.14], ["l", 0.42, 0], ["c", 0.69, -0.03, 1.23, -0.18, 1.86, -0.51], ["c", 1.05, -0.51, 1.89, -1.47, 2.46, -2.7], ["c", 0.15, -0.33, 0.33, -0.87, 0.39, -1.17], ["c", 0.09, -0.24, 0.15, -0.36, 0.3, -0.39], ["c", 0.21, -0.03, 0.42, 0.15, 0.39, 0.36], ["c", -0.03, 0.24, -0.21, 0.78, -0.39, 1.2], ["c", -0.96, 2.37, -2.94, 3.9, -5.13, 3.9], ["l", -0.3, 0], ["l", 0, 1.26], ["l", 0, 1.23], ["l", -0.06, 0.09], ["c", -0.09, 0.06, -0.09, 0.06, -0.45, 0.06], ["c", -0.39, 0, -0.39, 0, -0.48, -0.06], ["l", -0.06, -0.09], ["l", 0, -1.29], ["l", 0, -1.29], ["l", -0.21, -0.03], ["c", -1.23, -0.21, -2.31, -0.63, -3.21, -1.29], ["c", -0.15, -0.09, -0.45, -0.36, -0.66, -0.57], ["c", -1.11, -1.11, -1.8, -2.61, -2.04, -4.56], ["c", -0.06, -0.6, -0.06, -2.01, 0, -2.61], ["c", 0.24, -1.95, 0.93, -3.45, 2.04, -4.59], ["c", 0.42, -0.39, 0.78, -0.66, 1.26, -0.93], ["c", 0.75, -0.45, 1.65, -0.75, 2.61, -0.9], ["l", 0.21, -0.03], ["l", 0, -1.29], ["l", 0, -1.29], ["z"], ["m", -0.06, 10.44], ["c", 0, -5.58, 0, -6.99, -0.03, -6.99], ["c", -0.15, 0, -0.63, 0.27, -0.87, 0.45], ["c", -0.45, 0.36, -0.75, 0.93, -0.93, 1.77], ["c", -0.18, 0.81, -0.24, 1.8, -0.24, 4.74], ["c", 0, 2.97, 0.06, 3.96, 0.24, 4.77], ["c", 0.24, 1.08, 0.66, 1.68, 1.41, 2.07], ["c", 0.12, 0.06, 0.3, 0.12, 0.33, 0.15], ["l", 0.09, 0], ["l", 0, -6.96], ["z"]],w:13.038,h:20.97},'0':{d:[["M", 4.83, -14.97], ["c", 0.33, -0.03, 1.11, 0, 1.47, 0.06], ["c", 1.68, 0.36, 2.97, 1.59, 3.78, 3.6], ["c", 1.2, 2.97, 0.81, 6.96, -0.9, 9.27], ["c", -0.78, 1.08, -1.71, 1.71, -2.91, 1.95], ["c", -0.45, 0.09, -1.32, 0.09, -1.77, 0], ["c", -0.81, -0.18, -1.47, -0.51, -2.07, -1.02], ["c", -2.34, -2.07, -3.15, -6.72, -1.74, -10.2], ["c", 0.87, -2.16, 2.28, -3.42, 4.14, -3.66], ["z"], ["m", 1.11, 0.87], ["c", -0.21, -0.06, -0.69, -0.09, -0.87, -0.06], ["c", -0.54, 0.12, -0.87, 0.42, -1.17, 0.99], ["c", -0.36, 0.66, -0.51, 1.56, -0.6, 3], ["c", -0.03, 0.75, -0.03, 4.59, -0, 5.31], ["c", 0.09, 1.5, 0.27, 2.4, 0.6, 3.06], ["c", 0.24, 0.48, 0.57, 0.78, 0.96, 0.9], ["c", 0.27, 0.09, 0.78, 0.09, 1.05, -0], ["c", 0.39, -0.12, 0.72, -0.42, 0.96, -0.9], ["c", 0.33, -0.66, 0.51, -1.56, 0.6, -3.06], ["c", 0.03, -0.72, 0.03, -4.56, -0, -5.31], ["c", -0.09, -1.47, -0.27, -2.37, -0.6, -3.03], ["c", -0.24, -0.48, -0.54, -0.78, -0.93, -0.9], ["z"]],w:10.78,h:14.959},'1':{d:[["M", 3.3, -15.06], ["c", 0.06, -0.06, 0.21, -0.03, 0.66, 0.15], ["c", 0.81, 0.39, 1.08, 0.39, 1.83, 0.03], ["c", 0.21, -0.09, 0.39, -0.15, 0.42, -0.15], ["c", 0.12, 0, 0.21, 0.09, 0.27, 0.21], ["c", 0.06, 0.12, 0.06, 0.33, 0.06, 5.94], ["c", 0, 3.93, 0, 5.85, 0.03, 6.03], ["c", 0.06, 0.36, 0.15, 0.69, 0.27, 0.96], ["c", 0.36, 0.75, 0.93, 1.17, 1.68, 1.26], ["c", 0.3, 0.03, 0.39, 0.09, 0.39, 0.3], ["c", 0, 0.15, -0.03, 0.18, -0.09, 0.24], ["c", -0.06, 0.06, -0.09, 0.06, -0.48, 0.06], ["c", -0.42, -0, -0.69, -0.03, -2.1, -0.24], ["c", -0.9, -0.15, -1.77, -0.15, -2.67, -0], ["c", -1.41, 0.21, -1.68, 0.24, -2.1, 0.24], ["c", -0.39, -0, -0.42, -0, -0.48, -0.06], ["c", -0.06, -0.06, -0.06, -0.09, -0.06, -0.24], ["c", 0, -0.21, 0.06, -0.27, 0.36, -0.3], ["c", 0.75, -0.09, 1.32, -0.51, 1.68, -1.26], ["c", 0.12, -0.27, 0.21, -0.6, 0.27, -0.96], ["c", 0.03, -0.18, 0.03, -1.59, 0.03, -4.29], ["c", 0, -3.87, 0, -4.05, -0.06, -4.14], ["c", -0.09, -0.15, -0.18, -0.24, -0.39, -0.24], ["c", -0.12, -0, -0.15, 0.03, -0.21, 0.06], ["c", -0.03, 0.06, -0.45, 0.99, -0.96, 2.13], ["c", -0.48, 1.14, -0.9, 2.1, -0.93, 2.16], ["c", -0.06, 0.15, -0.21, 0.24, -0.33, 0.24], ["c", -0.24, 0, -0.42, -0.18, -0.42, -0.39], ["c", 0, -0.06, 3.27, -7.62, 3.33, -7.74], ["z"]],w:8.94,h:15.058},'2':{d:[["M", 4.23, -14.97], ["c", 0.57, -0.06, 1.68, 0, 2.34, 0.18], ["c", 0.69, 0.18, 1.5, 0.54, 2.01, 0.9], ["c", 1.35, 0.96, 1.95, 2.25, 1.77, 3.81], ["c", -0.15, 1.35, -0.66, 2.34, -1.68, 3.15], ["c", -0.6, 0.48, -1.44, 0.93, -3.12, 1.65], ["c", -1.32, 0.57, -1.8, 0.81, -2.37, 1.14], ["c", -0.57, 0.33, -0.57, 0.33, -0.24, 0.27], ["c", 0.39, -0.09, 1.26, -0.09, 1.68, 0], ["c", 0.72, 0.15, 1.41, 0.45, 2.1, 0.9], ["c", 0.99, 0.63, 1.86, 0.87, 2.55, 0.75], ["c", 0.24, -0.06, 0.42, -0.15, 0.57, -0.3], ["c", 0.12, -0.09, 0.3, -0.42, 0.3, -0.51], ["c", 0, -0.09, 0.12, -0.21, 0.24, -0.24], ["c", 0.18, -0.03, 0.39, 0.12, 0.39, 0.3], ["c", 0, 0.12, -0.15, 0.57, -0.3, 0.87], ["c", -0.54, 1.02, -1.56, 1.74, -2.79, 2.01], ["c", -0.42, 0.09, -1.23, 0.09, -1.62, 0.03], ["c", -0.81, -0.18, -1.32, -0.45, -2.01, -1.11], ["c", -0.45, -0.45, -0.63, -0.57, -0.96, -0.69], ["c", -0.84, -0.27, -1.89, 0.12, -2.25, 0.9], ["c", -0.12, 0.21, -0.21, 0.54, -0.21, 0.72], ["c", 0, 0.12, -0.12, 0.21, -0.27, 0.24], ["c", -0.15, 0, -0.27, -0.03, -0.33, -0.15], ["c", -0.09, -0.21, 0.09, -1.08, 0.33, -1.71], ["c", 0.24, -0.66, 0.66, -1.26, 1.29, -1.89], ["c", 0.45, -0.45, 0.9, -0.81, 1.92, -1.56], ["c", 1.29, -0.93, 1.89, -1.44, 2.34, -1.98], ["c", 0.87, -1.05, 1.26, -2.19, 1.2, -3.63], ["c", -0.06, -1.29, -0.39, -2.31, -0.96, -2.91], ["c", -0.36, -0.33, -0.72, -0.51, -1.17, -0.54], ["c", -0.84, -0.03, -1.53, 0.42, -1.59, 1.05], ["c", -0.03, 0.33, 0.12, 0.6, 0.57, 1.14], ["c", 0.45, 0.54, 0.54, 0.87, 0.42, 1.41], ["c", -0.15, 0.63, -0.54, 1.11, -1.08, 1.38], ["c", -0.63, 0.33, -1.2, 0.33, -1.83, 0], ["c", -0.24, -0.12, -0.33, -0.18, -0.54, -0.39], ["c", -0.18, -0.18, -0.27, -0.3, -0.36, -0.51], ["c", -0.24, -0.45, -0.27, -0.84, -0.21, -1.38], ["c", 0.12, -0.75, 0.45, -1.41, 1.02, -1.98], ["c", 0.72, -0.72, 1.74, -1.17, 2.85, -1.32], ["z"]],w:10.764,h:14.993},'3':{d:[["M", 3.78, -14.97], ["c", 0.3, -0.03, 1.41, 0, 1.83, 0.06], ["c", 2.22, 0.3, 3.51, 1.32, 3.72, 2.91], ["c", 0.03, 0.33, 0.03, 1.26, -0.03, 1.65], ["c", -0.12, 0.84, -0.48, 1.47, -1.05, 1.77], ["c", -0.27, 0.15, -0.36, 0.24, -0.45, 0.39], ["c", -0.09, 0.21, -0.09, 0.36, 0, 0.57], ["c", 0.09, 0.15, 0.18, 0.24, 0.51, 0.39], ["c", 0.75, 0.42, 1.23, 1.14, 1.41, 2.13], ["c", 0.06, 0.42, 0.06, 1.35, 0, 1.71], ["c", -0.18, 0.81, -0.48, 1.38, -1.02, 1.95], ["c", -0.75, 0.72, -1.8, 1.2, -3.18, 1.38], ["c", -0.42, 0.06, -1.56, 0.06, -1.95, 0], ["c", -1.89, -0.33, -3.18, -1.29, -3.51, -2.64], ["c", -0.03, -0.12, -0.03, -0.33, -0.03, -0.6], ["c", 0, -0.36, 0, -0.42, 0.06, -0.63], ["c", 0.12, -0.3, 0.27, -0.51, 0.51, -0.75], ["c", 0.24, -0.24, 0.45, -0.39, 0.75, -0.51], ["c", 0.21, -0.06, 0.27, -0.06, 0.6, -0.06], ["c", 0.33, 0, 0.39, 0, 0.6, 0.06], ["c", 0.3, 0.12, 0.51, 0.27, 0.75, 0.51], ["c", 0.36, 0.33, 0.57, 0.75, 0.6, 1.2], ["c", 0, 0.21, 0, 0.27, -0.06, 0.42], ["c", -0.09, 0.18, -0.12, 0.24, -0.54, 0.54], ["c", -0.51, 0.36, -0.63, 0.54, -0.6, 0.87], ["c", 0.06, 0.54, 0.54, 0.9, 1.38, 0.99], ["c", 0.36, 0.06, 0.72, 0.03, 0.96, -0.06], ["c", 0.81, -0.27, 1.29, -1.23, 1.44, -2.79], ["c", 0.03, -0.45, 0.03, -1.95, -0.03, -2.37], ["c", -0.09, -0.75, -0.33, -1.23, -0.75, -1.44], ["c", -0.33, -0.18, -0.45, -0.18, -1.98, -0.18], ["c", -1.35, 0, -1.41, 0, -1.5, -0.06], ["c", -0.18, -0.12, -0.24, -0.39, -0.12, -0.6], ["c", 0.12, -0.15, 0.15, -0.15, 1.68, -0.15], ["c", 1.5, 0, 1.62, 0, 1.89, -0.15], ["c", 0.18, -0.09, 0.42, -0.36, 0.54, -0.57], ["c", 0.18, -0.42, 0.27, -0.9, 0.3, -1.95], ["c", 0.03, -1.2, -0.06, -1.8, -0.36, -2.37], ["c", -0.24, -0.48, -0.63, -0.81, -1.14, -0.96], ["c", -0.3, -0.06, -1.08, -0.06, -1.38, 0.03], ["c", -0.6, 0.15, -0.9, 0.42, -0.96, 0.84], ["c", -0.03, 0.3, 0.06, 0.45, 0.63, 0.84], ["c", 0.33, 0.24, 0.42, 0.39, 0.45, 0.63], ["c", 0.03, 0.72, -0.57, 1.5, -1.32, 1.65], ["c", -1.05, 0.27, -2.1, -0.57, -2.1, -1.65], ["c", 0, -0.45, 0.15, -0.96, 0.39, -1.38], ["c", 0.12, -0.21, 0.54, -0.63, 0.81, -0.81], ["c", 0.57, -0.42, 1.38, -0.69, 2.25, -0.81], ["z"]],w:9.735,h:14.967},'4':{d:[["M", 8.64, -14.94], ["c", 0.27, -0.09, 0.42, -0.12, 0.54, -0.03], ["c", 0.09, 0.06, 0.15, 0.21, 0.15, 0.3], ["c", -0.03, 0.06, -1.92, 2.31, -4.23, 5.04], ["c", -2.31, 2.73, -4.23, 4.98, -4.26, 5.01], ["c", -0.03, 0.06, 0.12, 0.06, 2.55, 0.06], ["l", 2.61, 0], ["l", 0, -2.37], ["c", 0, -2.19, 0.03, -2.37, 0.06, -2.46], ["c", 0.03, -0.06, 0.21, -0.18, 0.57, -0.42], ["c", 1.08, -0.72, 1.38, -1.08, 1.86, -2.16], ["c", 0.12, -0.3, 0.24, -0.54, 0.27, -0.57], ["c", 0.12, -0.12, 0.39, -0.06, 0.45, 0.12], ["c", 0.06, 0.09, 0.06, 0.57, 0.06, 3.96], ["l", 0, 3.9], ["l", 1.08, 0], ["c", 1.05, 0, 1.11, 0, 1.2, 0.06], ["c", 0.24, 0.15, 0.24, 0.54, 0, 0.69], ["c", -0.09, 0.06, -0.15, 0.06, -1.2, 0.06], ["l", -1.08, 0], ["l", 0, 0.33], ["c", 0, 0.57, 0.09, 1.11, 0.3, 1.53], ["c", 0.36, 0.75, 0.93, 1.17, 1.68, 1.26], ["c", 0.3, 0.03, 0.39, 0.09, 0.39, 0.3], ["c", 0, 0.15, -0.03, 0.18, -0.09, 0.24], ["c", -0.06, 0.06, -0.09, 0.06, -0.48, 0.06], ["c", -0.42, 0, -0.69, -0.03, -2.1, -0.24], ["c", -0.9, -0.15, -1.77, -0.15, -2.67, 0], ["c", -1.41, 0.21, -1.68, 0.24, -2.1, 0.24], ["c", -0.39, 0, -0.42, 0, -0.48, -0.06], ["c", -0.06, -0.06, -0.06, -0.09, -0.06, -0.24], ["c", 0, -0.21, 0.06, -0.27, 0.36, -0.3], ["c", 0.75, -0.09, 1.32, -0.51, 1.68, -1.26], ["c", 0.21, -0.42, 0.3, -0.96, 0.3, -1.53], ["l", 0, -0.33], ["l", -2.7, 0], ["c", -2.91, 0, -2.85, 0, -3.09, -0.15], ["c", -0.18, -0.12, -0.3, -0.39, -0.27, -0.54], ["c", 0.03, -0.06, 0.18, -0.24, 0.33, -0.45], ["c", 0.75, -0.9, 1.59, -2.07, 2.13, -3.03], ["c", 0.33, -0.54, 0.84, -1.62, 1.05, -2.16], ["c", 0.57, -1.41, 0.84, -2.64, 0.9, -4.05], ["c", 0.03, -0.63, 0.06, -0.72, 0.24, -0.81], ["l", 0.12, -0.06], ["l", 0.45, 0.12], ["c", 0.66, 0.18, 1.02, 0.24, 1.47, 0.27], ["c", 0.6, 0.03, 1.23, -0.09, 2.01, -0.33], ["z"]],w:11.795,h:14.994},'5':{d:[["M", 1.02, -14.94], ["c", 0.12, -0.09, 0.03, -0.09, 1.08, 0.06], ["c", 2.49, 0.36, 4.35, 0.36, 6.96, -0.06], ["c", 0.57, -0.09, 0.66, -0.06, 0.81, 0.06], ["c", 0.15, 0.18, 0.12, 0.24, -0.15, 0.51], ["c", -1.29, 1.26, -3.24, 2.04, -5.58, 2.31], ["c", -0.6, 0.09, -1.2, 0.12, -1.71, 0.12], ["c", -0.39, 0, -0.45, 0, -0.57, 0.06], ["c", -0.09, 0.06, -0.15, 0.12, -0.21, 0.21], ["l", -0.06, 0.12], ["l", 0, 1.65], ["l", 0, 1.65], ["l", 0.21, -0.21], ["c", 0.66, -0.57, 1.41, -0.96, 2.19, -1.14], ["c", 0.33, -0.06, 1.41, -0.06, 1.95, 0], ["c", 2.61, 0.36, 4.02, 1.74, 4.26, 4.14], ["c", 0.03, 0.45, 0.03, 1.08, -0.03, 1.44], ["c", -0.18, 1.02, -0.78, 2.01, -1.59, 2.7], ["c", -0.72, 0.57, -1.62, 1.02, -2.49, 1.2], ["c", -1.38, 0.27, -3.03, 0.06, -4.2, -0.54], ["c", -1.08, -0.54, -1.71, -1.32, -1.86, -2.28], ["c", -0.09, -0.69, 0.09, -1.29, 0.57, -1.74], ["c", 0.24, -0.24, 0.45, -0.39, 0.75, -0.51], ["c", 0.21, -0.06, 0.27, -0.06, 0.6, -0.06], ["c", 0.33, 0, 0.39, 0, 0.6, 0.06], ["c", 0.3, 0.12, 0.51, 0.27, 0.75, 0.51], ["c", 0.36, 0.33, 0.57, 0.75, 0.6, 1.2], ["c", 0, 0.21, 0, 0.27, -0.06, 0.42], ["c", -0.09, 0.18, -0.12, 0.24, -0.54, 0.54], ["c", -0.18, 0.12, -0.36, 0.3, -0.42, 0.33], ["c", -0.36, 0.42, -0.18, 0.99, 0.36, 1.26], ["c", 0.51, 0.27, 1.47, 0.36, 2.01, 0.27], ["c", 0.93, -0.21, 1.47, -1.17, 1.65, -2.91], ["c", 0.06, -0.45, 0.06, -1.89, 0, -2.31], ["c", -0.15, -1.2, -0.51, -2.1, -1.05, -2.55], ["c", -0.21, -0.18, -0.54, -0.36, -0.81, -0.39], ["c", -0.3, -0.06, -0.84, -0.03, -1.26, 0.06], ["c", -0.93, 0.18, -1.65, 0.6, -2.16, 1.2], ["c", -0.15, 0.21, -0.27, 0.3, -0.39, 0.3], ["c", -0.15, 0, -0.3, -0.09, -0.36, -0.18], ["c", -0.06, -0.09, -0.06, -0.15, -0.06, -3.66], ["c", 0, -3.39, 0, -3.57, 0.06, -3.66], ["c", 0.03, -0.06, 0.09, -0.15, 0.15, -0.18], ["z"]],w:10.212,h:14.997},'6':{d:[["M", 4.98, -14.97], ["c", 0.36, -0.03, 1.2, 0, 1.59, 0.06], ["c", 0.9, 0.15, 1.68, 0.51, 2.25, 1.05], ["c", 0.57, 0.51, 0.87, 1.23, 0.84, 1.98], ["c", -0.03, 0.51, -0.21, 0.9, -0.6, 1.26], ["c", -0.24, 0.24, -0.45, 0.39, -0.75, 0.51], ["c", -0.21, 0.06, -0.27, 0.06, -0.6, 0.06], ["c", -0.33, 0, -0.39, 0, -0.6, -0.06], ["c", -0.3, -0.12, -0.51, -0.27, -0.75, -0.51], ["c", -0.39, -0.36, -0.57, -0.78, -0.57, -1.26], ["c", 0, -0.27, 0, -0.3, 0.09, -0.42], ["c", 0.03, -0.09, 0.18, -0.21, 0.3, -0.3], ["c", 0.12, -0.09, 0.3, -0.21, 0.39, -0.27], ["c", 0.09, -0.06, 0.21, -0.18, 0.27, -0.24], ["c", 0.06, -0.12, 0.09, -0.15, 0.09, -0.33], ["c", 0, -0.18, -0.03, -0.24, -0.09, -0.36], ["c", -0.24, -0.39, -0.75, -0.6, -1.38, -0.57], ["c", -0.54, 0.03, -0.9, 0.18, -1.23, 0.48], ["c", -0.81, 0.72, -1.08, 2.16, -0.96, 5.37], ["l", 0, 0.63], ["l", 0.3, -0.12], ["c", 0.78, -0.27, 1.29, -0.33, 2.1, -0.27], ["c", 1.47, 0.12, 2.49, 0.54, 3.27, 1.29], ["c", 0.48, 0.51, 0.81, 1.11, 0.96, 1.89], ["c", 0.06, 0.27, 0.06, 0.42, 0.06, 0.93], ["c", 0, 0.54, 0, 0.69, -0.06, 0.96], ["c", -0.15, 0.78, -0.48, 1.38, -0.96, 1.89], ["c", -0.54, 0.51, -1.17, 0.87, -1.98, 1.08], ["c", -1.14, 0.3, -2.4, 0.33, -3.24, 0.03], ["c", -1.5, -0.48, -2.64, -1.89, -3.27, -4.02], ["c", -0.36, -1.23, -0.51, -2.82, -0.42, -4.08], ["c", 0.3, -3.66, 2.28, -6.3, 4.95, -6.66], ["z"], ["m", 0.66, 7.41], ["c", -0.27, -0.09, -0.81, -0.12, -1.08, -0.06], ["c", -0.72, 0.18, -1.08, 0.69, -1.23, 1.71], ["c", -0.06, 0.54, -0.06, 3, 0, 3.54], ["c", 0.18, 1.26, 0.72, 1.77, 1.8, 1.74], ["c", 0.39, -0.03, 0.63, -0.09, 0.9, -0.27], ["c", 0.66, -0.42, 0.9, -1.32, 0.9, -3.24], ["c", 0, -2.22, -0.36, -3.12, -1.29, -3.42], ["z"]],w:9.956,h:14.982},'7':{d:[["M", 0.21, -14.97], ["c", 0.21, -0.06, 0.45, 0, 0.54, 0.15], ["c", 0.06, 0.09, 0.06, 0.15, 0.06, 0.39], ["c", 0, 0.24, 0, 0.33, 0.06, 0.42], ["c", 0.06, 0.12, 0.21, 0.24, 0.27, 0.24], ["c", 0.03, 0, 0.12, -0.12, 0.24, -0.21], ["c", 0.96, -1.2, 2.58, -1.35, 3.99, -0.42], ["c", 0.15, 0.12, 0.42, 0.3, 0.54, 0.45], ["c", 0.48, 0.39, 0.81, 0.57, 1.29, 0.6], ["c", 0.69, 0.03, 1.5, -0.3, 2.13, -0.87], ["c", 0.09, -0.09, 0.27, -0.3, 0.39, -0.45], ["c", 0.12, -0.15, 0.24, -0.27, 0.3, -0.3], ["c", 0.18, -0.06, 0.39, 0.03, 0.51, 0.21], ["c", 0.06, 0.18, 0.06, 0.24, -0.27, 0.72], ["c", -0.18, 0.24, -0.54, 0.78, -0.78, 1.17], ["c", -2.37, 3.54, -3.54, 6.27, -3.87, 9], ["c", -0.03, 0.33, -0.03, 0.66, -0.03, 1.26], ["c", 0, 0.9, 0, 1.08, 0.15, 1.89], ["c", 0.06, 0.45, 0.06, 0.48, 0.03, 0.6], ["c", -0.06, 0.09, -0.21, 0.21, -0.3, 0.21], ["c", -0.03, 0, -0.27, -0.06, -0.54, -0.15], ["c", -0.84, -0.27, -1.11, -0.3, -1.65, -0.3], ["c", -0.57, 0, -0.84, 0.03, -1.56, 0.27], ["c", -0.6, 0.18, -0.69, 0.21, -0.81, 0.15], ["c", -0.12, -0.06, -0.21, -0.18, -0.21, -0.3], ["c", 0, -0.15, 0.6, -1.44, 1.2, -2.61], ["c", 1.14, -2.22, 2.73, -4.68, 5.1, -8.01], ["c", 0.21, -0.27, 0.36, -0.48, 0.33, -0.48], ["c", 0, 0, -0.12, 0.06, -0.27, 0.12], ["c", -0.54, 0.3, -0.99, 0.39, -1.56, 0.39], ["c", -0.75, 0.03, -1.2, -0.18, -1.83, -0.75], ["c", -0.99, -0.9, -1.83, -1.17, -2.31, -0.72], ["c", -0.18, 0.15, -0.36, 0.51, -0.45, 0.84], ["c", -0.06, 0.24, -0.06, 0.33, -0.09, 1.98], ["c", 0, 1.62, -0.03, 1.74, -0.06, 1.8], ["c", -0.15, 0.24, -0.54, 0.24, -0.69, 0], ["c", -0.06, -0.09, -0.06, -0.15, -0.06, -3.57], ["c", 0, -3.42, 0, -3.48, 0.06, -3.57], ["c", 0.03, -0.06, 0.09, -0.12, 0.15, -0.15], ["z"]],w:10.561,h:15.093},'8':{d:[["M", 4.98, -14.97], ["c", 0.33, -0.03, 1.02, -0.03, 1.32, 0], ["c", 1.32, 0.12, 2.49, 0.6, 3.21, 1.32], ["c", 0.39, 0.39, 0.66, 0.81, 0.78, 1.29], ["c", 0.09, 0.36, 0.09, 1.08, 0, 1.44], ["c", -0.21, 0.84, -0.66, 1.59, -1.59, 2.55], ["l", -0.3, 0.3], ["l", 0.27, 0.18], ["c", 1.47, 0.93, 2.31, 2.31, 2.25, 3.75], ["c", -0.03, 0.75, -0.24, 1.35, -0.63, 1.95], ["c", -0.45, 0.66, -1.02, 1.14, -1.83, 1.53], ["c", -1.8, 0.87, -4.2, 0.87, -6, 0.03], ["c", -1.62, -0.78, -2.52, -2.16, -2.46, -3.66], ["c", 0.06, -0.99, 0.54, -1.77, 1.8, -2.97], ["c", 0.54, -0.51, 0.54, -0.54, 0.48, -0.57], ["c", -0.39, -0.27, -0.96, -0.78, -1.2, -1.14], ["c", -0.75, -1.11, -0.87, -2.4, -0.3, -3.6], ["c", 0.69, -1.35, 2.25, -2.25, 4.2, -2.4], ["z"], ["m", 1.53, 0.69], ["c", -0.42, -0.09, -1.11, -0.12, -1.38, -0.06], ["c", -0.3, 0.06, -0.6, 0.18, -0.81, 0.3], ["c", -0.21, 0.12, -0.6, 0.51, -0.72, 0.72], ["c", -0.51, 0.87, -0.42, 1.89, 0.21, 2.52], ["c", 0.21, 0.21, 0.36, 0.3, 1.95, 1.23], ["c", 0.96, 0.54, 1.74, 0.99, 1.77, 1.02], ["c", 0.09, 0, 0.63, -0.6, 0.99, -1.11], ["c", 0.21, -0.36, 0.48, -0.87, 0.57, -1.23], ["c", 0.06, -0.24, 0.06, -0.36, 0.06, -0.72], ["c", 0, -0.45, -0.03, -0.66, -0.15, -0.99], ["c", -0.39, -0.81, -1.29, -1.44, -2.49, -1.68], ["z"], ["m", -1.44, 8.07], ["l", -1.89, -1.08], ["c", -0.03, 0, -0.18, 0.15, -0.39, 0.33], ["c", -1.2, 1.08, -1.65, 1.95, -1.59, 3], ["c", 0.09, 1.59, 1.35, 2.85, 3.21, 3.24], ["c", 0.33, 0.06, 0.45, 0.06, 0.93, 0.06], ["c", 0.63, -0, 0.81, -0.03, 1.29, -0.27], ["c", 0.9, -0.42, 1.47, -1.41, 1.41, -2.4], ["c", -0.06, -0.66, -0.39, -1.29, -0.9, -1.65], ["c", -0.12, -0.09, -1.05, -0.63, -2.07, -1.23], ["z"]],w:10.926,h:14.989},'9':{d:[["M", 4.23, -14.97], ["c", 0.42, -0.03, 1.29, 0, 1.62, 0.06], ["c", 0.51, 0.12, 0.93, 0.3, 1.38, 0.57], ["c", 1.53, 1.02, 2.52, 3.24, 2.73, 5.94], ["c", 0.18, 2.55, -0.48, 4.98, -1.83, 6.57], ["c", -1.05, 1.26, -2.4, 1.89, -3.93, 1.83], ["c", -1.23, -0.06, -2.31, -0.45, -3.03, -1.14], ["c", -0.57, -0.51, -0.87, -1.23, -0.84, -1.98], ["c", 0.03, -0.51, 0.21, -0.9, 0.6, -1.26], ["c", 0.24, -0.24, 0.45, -0.39, 0.75, -0.51], ["c", 0.21, -0.06, 0.27, -0.06, 0.6, -0.06], ["c", 0.33, -0, 0.39, -0, 0.6, 0.06], ["c", 0.3, 0.12, 0.51, 0.27, 0.75, 0.51], ["c", 0.39, 0.36, 0.57, 0.78, 0.57, 1.26], ["c", 0, 0.27, 0, 0.3, -0.09, 0.42], ["c", -0.03, 0.09, -0.18, 0.21, -0.3, 0.3], ["c", -0.12, 0.09, -0.3, 0.21, -0.39, 0.27], ["c", -0.09, 0.06, -0.21, 0.18, -0.27, 0.24], ["c", -0.06, 0.12, -0.06, 0.15, -0.06, 0.33], ["c", 0, 0.18, 0, 0.24, 0.06, 0.36], ["c", 0.24, 0.39, 0.75, 0.6, 1.38, 0.57], ["c", 0.54, -0.03, 0.9, -0.18, 1.23, -0.48], ["c", 0.81, -0.72, 1.08, -2.16, 0.96, -5.37], ["l", 0, -0.63], ["l", -0.3, 0.12], ["c", -0.78, 0.27, -1.29, 0.33, -2.1, 0.27], ["c", -1.47, -0.12, -2.49, -0.54, -3.27, -1.29], ["c", -0.48, -0.51, -0.81, -1.11, -0.96, -1.89], ["c", -0.06, -0.27, -0.06, -0.42, -0.06, -0.96], ["c", 0, -0.51, 0, -0.66, 0.06, -0.93], ["c", 0.15, -0.78, 0.48, -1.38, 0.96, -1.89], ["c", 0.15, -0.12, 0.33, -0.27, 0.42, -0.36], ["c", 0.69, -0.51, 1.62, -0.81, 2.76, -0.93], ["z"], ["m", 1.17, 0.66], ["c", -0.21, -0.06, -0.57, -0.06, -0.81, -0.03], ["c", -0.78, 0.12, -1.26, 0.69, -1.41, 1.74], ["c", -0.12, 0.63, -0.15, 1.95, -0.09, 2.79], ["c", 0.12, 1.71, 0.63, 2.4, 1.77, 2.46], ["c", 1.08, 0.03, 1.62, -0.48, 1.8, -1.74], ["c", 0.06, -0.54, 0.06, -3, 0, -3.54], ["c", -0.15, -1.05, -0.51, -1.53, -1.26, -1.68], ["z"]],w:9.959,h:14.986},'f':{d:[["M", 9.93, -14.28], ["c", 1.53, -0.18, 2.88, 0.45, 3.12, 1.5], ["c", 0.12, 0.51, 0, 1.32, -0.27, 1.86], ["c", -0.15, 0.3, -0.42, 0.57, -0.63, 0.69], ["c", -0.69, 0.36, -1.56, 0.03, -1.83, -0.69], ["c", -0.09, -0.24, -0.09, -0.69, 0, -0.87], ["c", 0.06, -0.12, 0.21, -0.24, 0.45, -0.42], ["c", 0.42, -0.24, 0.57, -0.45, 0.6, -0.72], ["c", 0.03, -0.33, -0.09, -0.39, -0.63, -0.42], ["c", -0.3, 0, -0.45, 0, -0.6, 0.03], ["c", -0.81, 0.21, -1.35, 0.93, -1.74, 2.46], ["c", -0.06, 0.27, -0.48, 2.25, -0.48, 2.31], ["c", 0, 0.03, 0.39, 0.03, 0.9, 0.03], ["c", 0.72, 0, 0.9, 0, 0.99, 0.06], ["c", 0.42, 0.15, 0.45, 0.72, 0.03, 0.9], ["c", -0.12, 0.06, -0.24, 0.06, -1.17, 0.06], ["l", -1.05, 0], ["l", -0.78, 2.55], ["c", -0.45, 1.41, -0.87, 2.79, -0.96, 3.06], ["c", -0.87, 2.37, -2.37, 4.74, -3.78, 5.91], ["c", -1.05, 0.9, -2.04, 1.23, -3.09, 1.08], ["c", -1.11, -0.18, -1.89, -0.78, -2.04, -1.59], ["c", -0.12, -0.66, 0.15, -1.71, 0.54, -2.19], ["c", 0.69, -0.75, 1.86, -0.54, 2.22, 0.39], ["c", 0.06, 0.15, 0.09, 0.27, 0.09, 0.48], ["c", -0, 0.24, -0.03, 0.27, -0.12, 0.42], ["c", -0.03, 0.09, -0.15, 0.18, -0.27, 0.27], ["c", -0.09, 0.06, -0.27, 0.21, -0.36, 0.27], ["c", -0.24, 0.18, -0.36, 0.36, -0.39, 0.6], ["c", -0.03, 0.33, 0.09, 0.39, 0.63, 0.42], ["c", 0.42, 0, 0.63, -0.03, 0.9, -0.15], ["c", 0.6, -0.3, 0.96, -0.96, 1.38, -2.64], ["c", 0.09, -0.42, 0.63, -2.55, 1.17, -4.77], ["l", 1.02, -4.08], ["c", -0, -0.03, -0.36, -0.03, -0.81, -0.03], ["c", -0.72, 0, -0.81, 0, -0.93, -0.06], ["c", -0.42, -0.18, -0.39, -0.75, 0.03, -0.9], ["c", 0.09, -0.06, 0.27, -0.06, 1.05, -0.06], ["l", 0.96, 0], ["l", 0, -0.09], ["c", 0.06, -0.18, 0.3, -0.72, 0.51, -1.17], ["c", 1.2, -2.46, 3.3, -4.23, 5.34, -4.5], ["z"]],w:16.155,h:19.445},'m':{d:[["M", 2.79, -8.91], ["c", 0.09, 0, 0.3, -0.03, 0.45, -0.03], ["c", 0.24, 0.03, 0.3, 0.03, 0.45, 0.12], ["c", 0.36, 0.15, 0.63, 0.54, 0.75, 1.02], ["l", 0.03, 0.21], ["l", 0.33, -0.3], ["c", 0.69, -0.69, 1.38, -1.02, 2.07, -1.02], ["c", 0.27, 0, 0.33, 0, 0.48, 0.06], ["c", 0.21, 0.09, 0.48, 0.36, 0.63, 0.6], ["c", 0.03, 0.09, 0.12, 0.27, 0.18, 0.42], ["c", 0.03, 0.15, 0.09, 0.27, 0.12, 0.27], ["c", 0, 0, 0.09, -0.09, 0.18, -0.21], ["c", 0.33, -0.39, 0.87, -0.81, 1.29, -0.99], ["c", 0.78, -0.33, 1.47, -0.21, 2.01, 0.33], ["c", 0.3, 0.33, 0.48, 0.69, 0.6, 1.14], ["c", 0.09, 0.42, 0.06, 0.54, -0.54, 3.06], ["c", -0.33, 1.29, -0.57, 2.4, -0.57, 2.43], ["c", 0, 0.12, 0.09, 0.21, 0.21, 0.21], ["c", 0.24, -0, 0.75, -0.3, 1.2, -0.72], ["c", 0.45, -0.39, 0.6, -0.45, 0.78, -0.27], ["c", 0.18, 0.18, 0.09, 0.36, -0.45, 0.87], ["c", -1.05, 0.96, -1.83, 1.47, -2.58, 1.71], ["c", -0.93, 0.33, -1.53, 0.21, -1.8, -0.33], ["c", -0.06, -0.15, -0.06, -0.21, -0.06, -0.45], ["c", 0, -0.24, 0.03, -0.48, 0.6, -2.82], ["c", 0.42, -1.71, 0.6, -2.64, 0.63, -2.79], ["c", 0.03, -0.57, -0.3, -0.75, -0.84, -0.48], ["c", -0.24, 0.12, -0.54, 0.39, -0.66, 0.63], ["c", -0.03, 0.09, -0.42, 1.38, -0.9, 3], ["c", -0.9, 3.15, -0.84, 3, -1.14, 3.15], ["l", -0.15, 0.09], ["l", -0.78, 0], ["c", -0.6, 0, -0.78, 0, -0.84, -0.06], ["c", -0.09, -0.03, -0.18, -0.18, -0.18, -0.27], ["c", 0, -0.03, 0.36, -1.38, 0.84, -2.97], ["c", 0.57, -2.04, 0.81, -2.97, 0.84, -3.12], ["c", 0.03, -0.54, -0.3, -0.72, -0.84, -0.45], ["c", -0.24, 0.12, -0.57, 0.42, -0.66, 0.63], ["c", -0.06, 0.09, -0.51, 1.44, -1.05, 2.97], ["c", -0.51, 1.56, -0.99, 2.85, -0.99, 2.91], ["c", -0.06, 0.12, -0.21, 0.24, -0.36, 0.3], ["c", -0.12, 0.06, -0.21, 0.06, -0.9, 0.06], ["c", -0.6, 0, -0.78, 0, -0.84, -0.06], ["c", -0.09, -0.03, -0.18, -0.18, -0.18, -0.27], ["c", 0, -0.03, 0.45, -1.38, 0.99, -2.97], ["c", 1.05, -3.18, 1.05, -3.18, 0.93, -3.45], ["c", -0.12, -0.27, -0.39, -0.3, -0.72, -0.15], ["c", -0.54, 0.27, -1.14, 1.17, -1.56, 2.4], ["c", -0.06, 0.15, -0.15, 0.3, -0.18, 0.36], ["c", -0.21, 0.21, -0.57, 0.27, -0.72, 0.09], ["c", -0.09, -0.09, -0.06, -0.21, 0.06, -0.63], ["c", 0.48, -1.26, 1.26, -2.46, 2.01, -3.21], ["c", 0.57, -0.54, 1.2, -0.87, 1.83, -1.02], ["z"]],w:14.687,h:9.126},'p':{d:[["M", 1.92, -8.7], ["c", 0.27, -0.09, 0.81, -0.06, 1.11, 0.03], ["c", 0.54, 0.18, 0.93, 0.51, 1.17, 0.99], ["c", 0.09, 0.15, 0.15, 0.33, 0.18, 0.36], ["l", -0, 0.12], ["l", 0.3, -0.27], ["c", 0.66, -0.6, 1.35, -1.02, 2.13, -1.2], ["c", 0.21, -0.06, 0.33, -0.06, 0.78, -0.06], ["c", 0.45, 0, 0.51, 0, 0.84, 0.09], ["c", 1.29, 0.33, 2.07, 1.32, 2.25, 2.79], ["c", 0.09, 0.81, -0.09, 2.01, -0.45, 2.79], ["c", -0.54, 1.26, -1.86, 2.55, -3.18, 3.03], ["c", -0.45, 0.18, -0.81, 0.24, -1.29, 0.24], ["c", -0.69, -0.03, -1.35, -0.18, -1.86, -0.45], ["c", -0.3, -0.15, -0.51, -0.18, -0.69, -0.09], ["c", -0.09, 0.03, -0.18, 0.09, -0.18, 0.12], ["c", -0.09, 0.12, -1.05, 2.94, -1.05, 3.06], ["c", 0, 0.24, 0.18, 0.48, 0.51, 0.63], ["c", 0.18, 0.06, 0.54, 0.15, 0.75, 0.15], ["c", 0.21, 0, 0.36, 0.06, 0.42, 0.18], ["c", 0.12, 0.18, 0.06, 0.42, -0.12, 0.54], ["c", -0.09, 0.03, -0.15, 0.03, -0.78, 0], ["c", -1.98, -0.15, -3.81, -0.15, -5.79, 0], ["c", -0.63, 0.03, -0.69, 0.03, -0.78, 0], ["c", -0.24, -0.15, -0.24, -0.57, 0.03, -0.66], ["c", 0.06, -0.03, 0.48, -0.09, 0.99, -0.12], ["c", 0.87, -0.06, 1.11, -0.09, 1.35, -0.21], ["c", 0.18, -0.06, 0.33, -0.18, 0.39, -0.3], ["c", 0.06, -0.12, 3.24, -9.42, 3.27, -9.6], ["c", 0.06, -0.33, 0.03, -0.57, -0.15, -0.69], ["c", -0.09, -0.06, -0.12, -0.06, -0.3, -0.06], ["c", -0.69, 0.06, -1.53, 1.02, -2.28, 2.61], ["c", -0.09, 0.21, -0.21, 0.45, -0.27, 0.51], ["c", -0.09, 0.12, -0.33, 0.24, -0.48, 0.24], ["c", -0.18, 0, -0.36, -0.15, -0.36, -0.3], ["c", 0, -0.24, 0.78, -1.83, 1.26, -2.55], ["c", 0.72, -1.11, 1.47, -1.74, 2.28, -1.92], ["z"], ["m", 5.37, 1.47], ["c", -0.27, -0.12, -0.75, -0.03, -1.14, 0.21], ["c", -0.75, 0.48, -1.47, 1.68, -1.89, 3.15], ["c", -0.45, 1.47, -0.42, 2.34, 0, 2.7], ["c", 0.45, 0.39, 1.26, 0.21, 1.83, -0.36], ["c", 0.51, -0.51, 0.99, -1.68, 1.38, -3.27], ["c", 0.3, -1.17, 0.33, -1.74, 0.15, -2.13], ["c", -0.09, -0.15, -0.15, -0.21, -0.33, -0.3], ["z"]],w:14.689,h:13.127},'r':{d:[["M", 6.33, -9.12], ["c", 0.27, -0.03, 0.93, 0, 1.2, 0.06], ["c", 0.84, 0.21, 1.23, 0.81, 1.02, 1.53], ["c", -0.24, 0.75, -0.9, 1.17, -1.56, 0.96], ["c", -0.33, -0.09, -0.51, -0.3, -0.66, -0.75], ["c", -0.03, -0.12, -0.09, -0.24, -0.12, -0.3], ["c", -0.09, -0.15, -0.3, -0.24, -0.48, -0.24], ["c", -0.57, 0, -1.38, 0.54, -1.65, 1.08], ["c", -0.06, 0.15, -0.33, 1.17, -0.9, 3.27], ["c", -0.57, 2.31, -0.81, 3.12, -0.87, 3.21], ["c", -0.03, 0.06, -0.12, 0.15, -0.18, 0.21], ["l", -0.12, 0.06], ["l", -0.81, 0.03], ["c", -0.69, 0, -0.81, 0, -0.9, -0.03], ["c", -0.09, -0.06, -0.18, -0.21, -0.18, -0.3], ["c", 0, -0.06, 0.39, -1.62, 0.9, -3.51], ["c", 0.84, -3.24, 0.87, -3.45, 0.87, -3.72], ["c", 0, -0.21, 0, -0.27, -0.03, -0.36], ["c", -0.12, -0.15, -0.21, -0.24, -0.42, -0.24], ["c", -0.24, 0, -0.45, 0.15, -0.78, 0.42], ["c", -0.33, 0.36, -0.45, 0.54, -0.72, 1.14], ["c", -0.03, 0.12, -0.21, 0.24, -0.36, 0.27], ["c", -0.12, 0, -0.15, 0, -0.24, -0.06], ["c", -0.18, -0.12, -0.18, -0.21, -0.06, -0.54], ["c", 0.21, -0.57, 0.42, -0.93, 0.78, -1.32], ["c", 0.54, -0.51, 1.2, -0.81, 1.95, -0.87], ["c", 0.81, -0.03, 1.53, 0.3, 1.92, 0.87], ["l", 0.12, 0.18], ["l", 0.09, -0.09], ["c", 0.57, -0.45, 1.41, -0.84, 2.19, -0.96], ["z"]],w:9.41,h:9.132},'s':{d:[["M", 4.47, -8.73], ["c", 0.09, 0, 0.36, -0.03, 0.57, -0.03], ["c", 0.75, 0.03, 1.29, 0.24, 1.71, 0.63], ["c", 0.51, 0.54, 0.66, 1.26, 0.36, 1.83], ["c", -0.24, 0.42, -0.63, 0.57, -1.11, 0.42], ["c", -0.33, -0.09, -0.6, -0.36, -0.6, -0.57], ["c", 0, -0.03, 0.06, -0.21, 0.15, -0.39], ["c", 0.12, -0.21, 0.15, -0.33, 0.18, -0.48], ["c", 0, -0.24, -0.06, -0.48, -0.15, -0.6], ["c", -0.15, -0.21, -0.42, -0.24, -0.75, -0.15], ["c", -0.27, 0.06, -0.48, 0.18, -0.69, 0.36], ["c", -0.39, 0.39, -0.51, 0.96, -0.33, 1.38], ["c", 0.09, 0.21, 0.42, 0.51, 0.78, 0.72], ["c", 1.11, 0.69, 1.59, 1.11, 1.89, 1.68], ["c", 0.21, 0.39, 0.24, 0.78, 0.15, 1.29], ["c", -0.18, 1.2, -1.17, 2.16, -2.52, 2.52], ["c", -1.02, 0.24, -1.95, 0.12, -2.7, -0.42], ["c", -0.72, -0.51, -0.99, -1.47, -0.6, -2.19], ["c", 0.24, -0.48, 0.72, -0.63, 1.17, -0.42], ["c", 0.33, 0.18, 0.54, 0.45, 0.57, 0.81], ["c", 0, 0.21, -0.03, 0.3, -0.33, 0.51], ["c", -0.33, 0.24, -0.39, 0.42, -0.27, 0.69], ["c", 0.06, 0.15, 0.21, 0.27, 0.45, 0.33], ["c", 0.3, 0.09, 0.87, 0.09, 1.2, -0], ["c", 0.75, -0.21, 1.23, -0.72, 1.29, -1.35], ["c", 0.03, -0.42, -0.15, -0.81, -0.54, -1.2], ["c", -0.24, -0.24, -0.48, -0.42, -1.41, -1.02], ["c", -0.69, -0.42, -1.05, -0.93, -1.05, -1.47], ["c", 0, -0.39, 0.12, -0.87, 0.3, -1.23], ["c", 0.27, -0.57, 0.78, -1.05, 1.38, -1.35], ["c", 0.24, -0.12, 0.63, -0.27, 0.9, -0.3], ["z"]],w:6.632,h:8.758},'z':{d:[["M", 2.64, -7.95], ["c", 0.36, -0.09, 0.81, -0.03, 1.71, 0.27], ["c", 0.78, 0.21, 0.96, 0.27, 1.74, 0.3], ["c", 0.87, 0.06, 1.02, 0.03, 1.38, -0.21], ["c", 0.21, -0.15, 0.33, -0.15, 0.48, -0.06], ["c", 0.15, 0.09, 0.21, 0.3, 0.15, 0.45], ["c", -0.03, 0.06, -1.26, 1.26, -2.76, 2.67], ["l", -2.73, 2.55], ["l", 0.54, 0.03], ["c", 0.54, 0.03, 0.72, 0.03, 2.01, 0.15], ["c", 0.36, 0.03, 0.9, 0.06, 1.2, 0.09], ["c", 0.66, 0, 0.81, -0.03, 1.02, -0.24], ["c", 0.3, -0.3, 0.39, -0.72, 0.27, -1.23], ["c", -0.06, -0.27, -0.06, -0.27, -0.03, -0.39], ["c", 0.15, -0.3, 0.54, -0.27, 0.69, 0.03], ["c", 0.15, 0.33, 0.27, 1.02, 0.27, 1.5], ["c", 0, 1.47, -1.11, 2.7, -2.52, 2.79], ["c", -0.57, 0.03, -1.02, -0.09, -2.01, -0.51], ["c", -1.02, -0.42, -1.23, -0.48, -2.13, -0.54], ["c", -0.81, -0.06, -0.96, -0.03, -1.26, 0.18], ["c", -0.12, 0.06, -0.24, 0.12, -0.27, 0.12], ["c", -0.27, 0, -0.45, -0.3, -0.36, -0.51], ["c", 0.03, -0.06, 1.32, -1.32, 2.91, -2.79], ["l", 2.88, -2.73], ["c", -0.03, 0, -0.21, 0.03, -0.42, 0.06], ["c", -0.21, 0.03, -0.78, 0.09, -1.23, 0.12], ["c", -1.11, 0.12, -1.23, 0.15, -1.95, 0.27], ["c", -0.72, 0.15, -1.17, 0.18, -1.29, 0.09], ["c", -0.27, -0.18, -0.21, -0.75, 0.12, -1.26], ["c", 0.39, -0.6, 0.93, -1.02, 1.59, -1.2], ["z"]],w:8.573,h:8.743},'+':{d:[["M", 3.48, -11.19], ["c", 0.18, -0.09, 0.36, -0.09, 0.54, 0], ["c", 0.18, 0.09, 0.24, 0.15, 0.33, 0.3], ["l", 0.06, 0.15], ["l", 0, 1.29], ["l", 0, 1.29], ["l", 1.29, 0], ["c", 1.23, 0, 1.29, 0, 1.41, 0.06], ["c", 0.06, 0.03, 0.15, 0.09, 0.18, 0.12], ["c", 0.12, 0.09, 0.21, 0.33, 0.21, 0.48], ["c", 0, 0.15, -0.09, 0.39, -0.21, 0.48], ["c", -0.03, 0.03, -0.12, 0.09, -0.18, 0.12], ["c", -0.12, 0.06, -0.18, 0.06, -1.41, 0.06], ["l", -1.29, 0], ["l", 0, 1.29], ["c", 0, 1.23, 0, 1.29, -0.06, 1.41], ["c", -0.09, 0.18, -0.15, 0.24, -0.3, 0.33], ["c", -0.21, 0.09, -0.39, 0.09, -0.57, 0], ["c", -0.18, -0.09, -0.24, -0.15, -0.33, -0.33], ["c", -0.06, -0.12, -0.06, -0.18, -0.06, -1.41], ["l", 0, -1.29], ["l", -1.29, 0], ["c", -1.23, 0, -1.29, 0, -1.41, -0.06], ["c", -0.18, -0.09, -0.24, -0.15, -0.33, -0.33], ["c", -0.09, -0.18, -0.09, -0.36, 0, -0.54], ["c", 0.09, -0.18, 0.15, -0.24, 0.33, -0.33], ["l", 0.15, -0.06], ["l", 1.26, 0], ["l", 1.29, 0], ["l", 0, -1.29], ["c", 0, -1.23, 0, -1.29, 0.06, -1.41], ["c", 0.09, -0.18, 0.15, -0.24, 0.33, -0.33], ["z"]],w:7.507,h:7.515},',':{d:[["M", 1.32, -3.36], ["c", 0.57, -0.15, 1.17, 0.03, 1.59, 0.45], ["c", 0.45, 0.45, 0.6, 0.96, 0.51, 1.89], ["c", -0.09, 1.23, -0.42, 2.46, -0.99, 3.93], ["c", -0.3, 0.72, -0.72, 1.62, -0.78, 1.68], ["c", -0.18, 0.21, -0.51, 0.18, -0.66, -0.06], ["c", -0.03, -0.06, -0.06, -0.15, -0.06, -0.18], ["c", 0, -0.06, 0.12, -0.33, 0.24, -0.63], ["c", 0.84, -1.8, 1.02, -2.61, 0.69, -3.24], ["c", -0.12, -0.24, -0.27, -0.36, -0.75, -0.6], ["c", -0.36, -0.15, -0.42, -0.21, -0.6, -0.39], ["c", -0.69, -0.69, -0.69, -1.71, 0, -2.4], ["c", 0.21, -0.21, 0.51, -0.39, 0.81, -0.45], ["z"]],w:3.452,h:8.143},'-':{d:[["M", 0.18, -5.34], ["c", 0.09, -0.06, 0.15, -0.06, 2.31, -0.06], ["c", 2.46, 0, 2.37, 0, 2.46, 0.21], ["c", 0.12, 0.21, 0.03, 0.42, -0.15, 0.54], ["c", -0.09, 0.06, -0.15, 0.06, -2.28, 0.06], ["c", -2.16, 0, -2.22, 0, -2.31, -0.06], ["c", -0.27, -0.15, -0.27, -0.54, -0.03, -0.69], ["z"]],w:5.001,h:0.81},'.':{d:[["M", 1.32, -3.36], ["c", 1.05, -0.27, 2.1, 0.57, 2.1, 1.65], ["c", 0, 1.08, -1.05, 1.92, -2.1, 1.65], ["c", -0.9, -0.21, -1.5, -1.14, -1.26, -2.04], ["c", 0.12, -0.63, 0.63, -1.11, 1.26, -1.26], ["z"]],w:3.413,h:3.402}};



  this.printSymbol = function (x,y,symb,paper) {
    if (!glyphs[symb]) return null;
    var pathArray = this.pathClone(glyphs[symb].d);
    pathArray[0][1] +=x;
    pathArray[0][2] +=y;
    var path = paper.path().attr({path:pathArray, stroke:"none", fill:"#000000"});
    
    return path;//.translate(x,y);
   };
  
  this.getPathForSymbol = function (x,y,symb,scalex, scaley) {
    scalex = scalex || 1;
    scaley = scaley || 1;
    if (!glyphs[symb]) return null;
    var pathArray = this.pathClone(glyphs[symb].d);
    if (scalex!==1 || scaley!==1) this.pathScale(pathArray,scalex,scaley);
    pathArray[0][1] +=x;
    pathArray[0][2] +=y;

    return pathArray;
  };
  
  this.getSymbolWidth = function (symbol) {
    if (glyphs[symbol]) return glyphs[symbol].w;
    return 0;
  };
  
  this.getSymbolHeight = function (symbol) {
    if (glyphs[symbol]) return glyphs[symbol].h;
    return 0;
  };
  
  this.getSymbolAlign = function (symbol) {
    if (symbol.substring(0,7)==="scripts" && 
	symbol!=="scripts.roll") {
      return "center";
    }
    return "left";
  };

  this.pathClone = function (pathArray) {
    var res = [];
    for (var i = 0, ii = pathArray.length; i < ii; i++) {
      res[i] = [];
      for (var j = 0, jj = pathArray[i].length; j < jj; j++) {
	res[i][j] = pathArray[i][j];
      }
    }
    return res;
  };

  this.pathScale = function (pathArray, kx, ky) {
    for (var i = 0, ii = pathArray.length; i < ii; i++) {
      var p = pathArray[i];
      var j, jj;
      for (j = 1, jj = p.length; j < jj; j++) {
	p[j] *= (j % 2) ? kx : ky;
      }
    }
  };
   
  this.getYCorr = function (symbol) {
    switch(symbol) {
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    case "+": return -3;
    case "timesig.common":
    case "timesig.cut": return -1;
    case "flags.d32nd": return -1;
    case "flags.d64th": return -2;
    case "flags.u32nd": return 1;
    case "flags.u64th": return 3;
    case "rests.whole": return 1;
    case "rests.half": return -1;
    case "rests.8th": return -1;
    case "rests.quarter": return -2;
    case "rests.16th": return -1;
    case "rests.32nd": return -1;
    case "rests.64th": return -1;
    default: return 0;
    }
  };
};
//    abc_graphelements.js: All the drawable and layoutable datastructures to be printed by ABCJS.write.Printer
//    Copyright (C) 2010 Gregory Dyke (gregdyke at gmail dot com)
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.

/*global window, ABCJS */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.write)
	window.ABCJS.write = {};

ABCJS.write.StaffGroupElement = function() {
  this.voices = [];
  this.staffs = [];
  this.stafflines = [];
};

ABCJS.write.StaffGroupElement.prototype.addVoice = function (voice, staffnumber, stafflines) {
  this.voices[this.voices.length] = voice;
  if (!this.staffs[staffnumber]) {
    this.staffs[this.staffs.length] = {top:0, highest: 7, lowest: 7};
    this.stafflines[this.stafflines.length] = stafflines;
  }
  voice.staff = this.staffs[staffnumber];
};

ABCJS.write.StaffGroupElement.prototype.finished = function() {
  for (var i=0;i<this.voices.length;i++) {
    if (!this.voices[i].layoutEnded()) return false;
  }
  return true;
};

ABCJS.write.StaffGroupElement.prototype.layout = function(spacing, printer, debug) {
  this.spacingunits = 0; // number of space units taken up (as opposed to fixed width). Layout engine then decides how many a pixels a space unit should be
  this.minspace = 1000; // a big number to start off with
  var x = printer.paddingleft;

  // find out how much space will be taken up by voice headers
  var voiceheaderw = 0;
  for (var i=0;i<this.voices.length;i++) {
    if(this.voices[i].header) {
      var t = printer.paper.text(100, -10, this.voices[i].header).attr({"font-size":12, "font-family":"serif"}); // code duplicated below  // don't scale this as we ask for the bbox
     voiceheaderw = Math.max(voiceheaderw,t.getBBox().width);
      t.remove();
    }
  }
  x=x+voiceheaderw*1.1; // 10% of 0 is 0
  this.startx=x;

  var currentduration = 0;
  if (debug) console.log("init layout");
  for (i=0;i<this.voices.length;i++) {
    this.voices[i].beginLayout(x);
  }

  while (!this.finished()) {
    // find first duration level to be laid out among candidates across voices
    currentduration= null; // candidate smallest duration level
    for (i=0;i<this.voices.length;i++) {
      if (!this.voices[i].layoutEnded() && (!currentduration || this.voices[i].getDurationIndex()<currentduration)) 
	currentduration=this.voices[i].getDurationIndex();
    }
    if (debug) console.log("currentduration: ",currentduration);


    // isolate voices at current duration level
    var currentvoices = [];
    var othervoices = [];
    for (i=0;i<this.voices.length;i++) {
      if (this.voices[i].getDurationIndex() !== currentduration) {
	othervoices.push(this.voices[i]);
	//console.log("out: voice ",i);
      } else {
	currentvoices.push(this.voices[i]);
	if (debug) console.log("in: voice ",i);
      }
    }

    // among the current duration level find the one which needs starting furthest right
    var spacingunit = 0; // number of spacingunits coming from the previously laid out element to this one
    for (i=0;i<currentvoices.length;i++) {
      if (currentvoices[i].nextx>x) {
	x=currentvoices[i].nextx;
	spacingunit=currentvoices[i].spacingunits;
      }
    }
    this.spacingunits+=spacingunit;
    this.minspace = Math.min(this.minspace,spacingunit);
    
    // remove the value of already counted spacing units in other voices (e.g. if a voice had planned to use up 5 spacing units but is not in line to be laid out at this duration level - where we've used 2 spacing units - then we must use up 3 spacing units, not 5)
    for (i=0;i<othervoices.length;i++) {
      if (othervoices[i].spacingunits-=spacingunit);
    }

    for (i=0;i<currentvoices.length;i++) {
      var voicechildx = currentvoices[i].layoutOneItem(x,spacing);
      var dx = voicechildx-x;
      if (dx>0) {
	x = voicechildx; //update x
	for (var j=0;j<i;j++) { // shift over all previously laid out elements
	  currentvoices[j].shiftRight(dx);
	}
      } 
    }
    
    // update indexes of currently laid out elems
    for (i=0;i<currentvoices.length;i++) {
      var voice = currentvoices[i]; 
      voice.updateIndices();
    }
  } // finished laying out


  // find the greatest remaining x as a base for the width
  for (i=0;i<this.voices.length;i++) {
    if (this.voices[i].nextx>x) {
      x=this.voices[i].nextx;
      spacingunit=this.voices[i].spacingunits;
    }
  }
  this.spacingunits+=spacingunit;
  this.w = x;

  for (i=0;i<this.voices.length;i++) {
    this.voices[i].w=this.w;
  }
};

ABCJS.write.StaffGroupElement.prototype.draw = function (printer, y) {

  this.y = y;
  for (var i=0;i<this.staffs.length;i++) {
    var shiftabove = this.staffs[i].highest - ((i===0)? 20 : 15);
    var shiftbelow = this.staffs[i].lowest - ((i===this.staffs.length-1)? 0 : 0);
    this.staffs[i].top = y;
    if (shiftabove > 0) y+= shiftabove*ABCJS.write.spacing.STEP;
    this.staffs[i].y = y;
    y+= ABCJS.write.spacing.STAVEHEIGHT*0.9; // position of the words
    if (shiftbelow < 0) y-= shiftbelow*ABCJS.write.spacing.STEP;
    this.staffs[i].bottom = y;
  }
  this.height = y-this.y;

  var bartop = 0;
  for (i=0;i<this.voices.length;i++) {
    this.voices[i].draw(printer, bartop);
    bartop = this.voices[i].barbottom;
  }

  if (this.staffs.length>1) {
    printer.y = this.staffs[0].y;
    var top = printer.calcY(10);
    printer.y = this.staffs[this.staffs.length-1].y;
    var bottom = printer.calcY(2);
    printer.printStem(this.startx, 0.6, top, bottom);
  }

  for (i=0;i<this.staffs.length;i++) {
    if (this.stafflines[i] === 0) continue;
    printer.y = this.staffs[i].y;
    // TODO-PER: stafflines should always have been set somewhere, so this shouldn't be necessary.
    if (this.stafflines[i] === undefined)
      this.stafflines[i] = 5;
    printer.printStave(this.startx,this.w, this.stafflines[i]);
  }
  
};

ABCJS.write.VoiceElement = function(voicenumber, voicetotal) {
  this.children = [];
  this.beams = []; 
  this.otherchildren = []; // ties, slurs, triplets
  this.w = 0;
  this.duplicate = false;
  this.voicenumber = voicenumber; //number of the voice on a given stave (not staffgroup)
  this.voicetotal = voicetotal;
};

ABCJS.write.VoiceElement.prototype.addChild = function (child) {
  this.children[this.children.length] = child;
};

ABCJS.write.VoiceElement.prototype.addOther = function (child) {
  if (child instanceof ABCJS.write.BeamElem) {
    this.beams.push(child);
  } else {
    this.otherchildren.push(child);
  }
};

ABCJS.write.VoiceElement.prototype.updateIndices = function () {
  if (!this.layoutEnded()) {
    this.durationindex += this.children[this.i].duration;
    if (this.children[this.i].duration===0) this.durationindex = Math.round(this.durationindex*64)/64; // everytime we meet a barline, do rounding to nearest 64th
    this.i++;
    this.minx = this.nextminx;
  }
}; 

ABCJS.write.VoiceElement.prototype.layoutEnded = function () {
  return (this.i>=this.children.length);
};

ABCJS.write.VoiceElement.prototype.getDurationIndex = function () {
  return this.durationindex - (this.children[this.i] && (this.children[this.i].duration>0)?0:0.0000005); // if the ith element doesn't have a duration (is not a note), its duration index is fractionally before. This enables CLEF KEYSIG TIMESIG PART, etc. to be laid out before we get to the first note of other voices
};

ABCJS.write.VoiceElement.prototype.beginLayout = function (startx) {
  this.i=0;
  this.durationindex=0;
  this.ii=this.children.length;
  this.startx=startx;
  this.minx=startx; // furthest left to where negatively positioned elements are allowed to go
  this.nextminx=startx;
  this.nextx=startx; // x position where the next element of this voice should be placed assuming no other voices
  this.spacingunits=0; // units of spacing used in current iteration due to duration
};

// Try to layout the element at index this.i
// x - position to try to layout the element at
// spacing - base spacing
ABCJS.write.VoiceElement.prototype.layoutOneItem = function (x, spacing) {
  var child = this.children[this.i];
  if (!child) return 0;
  var er = x - this.minx; // available extrawidth to the left
  if (er<child.getExtraWidth()) { // shift right by needed amound
    x+=child.getExtraWidth()-er;
  }
  child.x=x;
  x+=(spacing*Math.sqrt(child.duration*8)); // add necessary duration space
  this.nextminx = child.x+child.getMinWidth(); // add necessary layout space
  if (this.i!==this.ii-1) this.nextminx+=child.minspacing; // add minimumspacing except on last elem
  if (this.nextminx > x) {
    x = this.nextminx;
    this.spacingunits=0;
  } else {
    this.spacingunits=Math.sqrt(child.duration*8);
  }
  this.nextx = x;
  // contribute to staff y position
  this.staff.highest = Math.max(child.top,this.staff.highest);
  this.staff.lowest = Math.min(child.bottom,this.staff.lowest);
  return child.x;
};

ABCJS.write.VoiceElement.prototype.shiftRight = function (dx) {
  var child = this.children[this.i];
  if (!child) return;
  child.x+=dx;
  this.nextminx+=dx;
  this.nextx+=dx;
};

ABCJS.write.VoiceElement.prototype.draw = function (printer, bartop) {
  var width = this.w-1;
  printer.y = this.staff.y;
  printer.staffbottom = this.staff.bottom;
  this.barbottom = printer.calcY(2);

  if (this.header) { // print voice name
    var textpitch = 12 - (this.voicenumber+1)*(12/(this.voicetotal+1));
    printer.paper.text((this.startx-printer.paddingleft)/2+printer.paddingleft, printer.calcY(textpitch), this.header).attr({"font-size":12, "font-family":"serif"}); // code duplicated above //TODO scale
  }

  for (var i=0, ii=this.children.length; i<ii; i++) {
    this.children[i].draw(printer, (this.barto || i===ii-1)?bartop:0);
  }
	window.ABCJS.parse.each(this.beams, function(beam) {
      beam.draw(printer); // beams must be drawn first for proper printing of triplets, slurs and ties.
    });
	window.ABCJS.parse.each(this.otherchildren, function(child) {
      child.draw(printer,this.startx+10,width);
    });

};

// duration - actual musical duration - different from notehead duration in triplets. refer to abcelem to get the notehead duration
// minspacing - spacing which must be taken on top of the width defined by the duration
ABCJS.write.AbsoluteElement = function(abcelem, duration, minspacing) { 
  this.abcelem = abcelem;
  this.duration = duration;
  this.minspacing = minspacing || 0;
  this.x = 0;
  this.children = [];
  this.heads = [];
  this.extra = [];
  this.extraw = 0;
  this.decs = [];
  this.w = 0;
  this.right = [];
  this.invisible = false;
  this.bottom = 7;
  this.top = 7;
};

ABCJS.write.AbsoluteElement.prototype.getMinWidth = function () { // absolute space taken to the right of the note
  return this.w;
};

ABCJS.write.AbsoluteElement.prototype.getExtraWidth = function () { // space needed to the left of the note
  return -this.extraw;
};

ABCJS.write.AbsoluteElement.prototype.addExtra = function (extra) {
  if (extra.dx<this.extraw) this.extraw = extra.dx;
  this.extra[this.extra.length] = extra;
  this.addChild(extra);
};

ABCJS.write.AbsoluteElement.prototype.addHead = function (head) {
  if (head.dx<this.extraw) this.extraw = head.dx;
  this.heads[this.heads.length] = head;
  this.addRight(head);
};

ABCJS.write.AbsoluteElement.prototype.addRight = function (right) {
  if (right.dx+right.w>this.w) this.w = right.dx+right.w;
  this.right[this.right.length] = right;
  this.addChild(right);
};

ABCJS.write.AbsoluteElement.prototype.addChild = function (child) {
  child.parent = this;
  this.children[this.children.length] = child;
  this.pushTop(child.top);
  this.pushBottom(child.bottom);
};

ABCJS.write.AbsoluteElement.prototype.pushTop = function (top) {
  this.top = Math.max(top, this.top);
};

ABCJS.write.AbsoluteElement.prototype.pushBottom = function (bottom) {
  this.bottom = Math.min(bottom, this.bottom);
};

ABCJS.write.AbsoluteElement.prototype.draw = function (printer, bartop) {
  this.elemset = printer.paper.set();
  if (this.invisible) return;
  printer.beginGroup();
  for (var i=0; i<this.children.length; i++) {
    this.elemset.push(this.children[i].draw(printer,this.x, bartop));
  }
  this.elemset.push(printer.endGroup());
	if (this.klass)
		this.setClass("mark", "", "#00ff00");
  var self = this;
  this.elemset.mouseup(function (e) {
    printer.notifySelect(self);
    });
  this.abcelem.abselem = this;
  
  var spacing = ABCJS.write.spacing.STEP*printer.scale;

  var start = function () {
    // storing original relative coordinates
    this.dy = 0;
  },
  move = function (dx, dy) {
    // move will be called with dx and dy
    dy = Math.round(dy/spacing)*spacing;
    this.translate(0, -this.dy);
    this.dy = dy;
    this.translate(0,this.dy);
  },
  up = function () {
    var delta = -Math.round(this.dy/spacing);
    self.abcelem.pitches[0].pitch += delta;
    self.abcelem.pitches[0].verticalPos += delta;
    printer.notifyChange();
  };
  if (this.abcelem.el_type==="note" && printer.editable)
    this.elemset.drag(move, start, up);
};

ABCJS.write.AbsoluteElement.prototype.isIE=/*@cc_on!@*/false;//IE detector

ABCJS.write.AbsoluteElement.prototype.setClass = function (addClass, removeClass, color) {
  this.elemset.attr({fill:color});
	if (!this.isIE) {
		for (var i = 0; i < this.elemset.length; i++) {
			if (this.elemset[i][0].setAttribute) {
				var kls = this.elemset[i][0].getAttribute("class");
				if (!kls) kls = "";
				kls = kls.replace(removeClass, "");
				kls = kls.replace(addClass, "");
				if (addClass.length > 0) {
					if (kls.length > 0 && kls.charAt(kls.length-1) !== ' ') kls += " ";
					kls += addClass;
				}
				this.elemset[i][0].setAttribute("class", kls);
			}
		}
	}
};

ABCJS.write.AbsoluteElement.prototype.highlight = function () {
	this.setClass("note_selected", "", "#ff0000");
};

ABCJS.write.AbsoluteElement.prototype.unhighlight = function () {
	this.setClass("", "note_selected", "#000000");
};

ABCJS.write.RelativeElement = function(c, dx, w, pitch, opt) {
  opt = opt || {};
  this.x = 0;
  this.c = c;      // character or path or string
  this.dx = dx;    // relative x position
  this.w = w;      // minimum width taken up by this element (can include gratuitous space)
  this.pitch = pitch; // relative y position by pitch
  this.scalex = opt.scalex || 1; // should the character/path be scaled?
  this.scaley = opt.scaley || 1; // should the character/path be scaled?
  this.type = opt.type || "symbol"; // cheap types.
  this.pitch2 = opt.pitch2;
  this.linewidth = opt.linewidth;
  this.attributes = opt.attributes; // only present on textual elements
  this.top = pitch + ((opt.extreme==="above")? 7 : 0);
  this.bottom = pitch - ((opt.extreme==="below")? 7 : 0);
};

ABCJS.write.RelativeElement.prototype.draw = function (printer, x, bartop) {
  this.x = x+this.dx;
  switch(this.type) {
  case "symbol":
    if (this.c===null) return null;
    this.graphelem = printer.printSymbol(this.x, this.pitch, this.c, this.scalex, this.scaley); break;
  case "debug":
    this.graphelem = printer.debugMsg(this.x, this.c); break;
  case "debugLow":
    this.graphelem = printer.printLyrics(this.x, this.c); break;
  case "text":
    this.graphelem = printer.printText(this.x, this.pitch, this.c); 
    break;
  case "bar":
    this.graphelem = printer.printStem(this.x, this.linewidth, printer.calcY(this.pitch), (bartop)?bartop:printer.calcY(this.pitch2)); break; // bartop can't be 0
  case "stem":
    this.graphelem = printer.printStem(this.x, this.linewidth, printer.calcY(this.pitch), printer.calcY(this.pitch2)); break;
  case "ledger":
    this.graphelem = printer.printStaveLine(this.x, this.x+this.w, this.pitch); break;
  }
  if (this.scalex!==1 && this.graphelem) {
    this.graphelem.scale(this.scalex, this.scaley, this.x, printer.calcY(this.pitch));
  }
  if (this.attributes) {
    this.graphelem.attr(this.attributes);
  }
  return this.graphelem;
};

ABCJS.write.EndingElem = function(text, anchor1, anchor2) {
  this.text = text; // text to be displayed top left
  this.anchor1 = anchor1; // must have a .x property or be null (means starts at the "beginning" of the line - after keysig)
  this.anchor2 = anchor2; // must have a .x property or be null (means ends at the end of the line)
};

ABCJS.write.EndingElem.prototype.draw = function (printer, linestartx, lineendx) {
  var pathString;
  if (this.anchor1) {
    linestartx = this.anchor1.x+this.anchor1.w;
    pathString = ABCJS.write.sprintf("M %f %f L %f %f",
			     linestartx, printer.y, linestartx, printer.y+10); 
    printer.printPath({path:pathString, stroke:"#000000", fill:"#000000"}); //TODO scale
    printer.printText(linestartx+5, 18.5, this.text).attr({"font-size":"10px"});
  }

  if (this.anchor2) {
    lineendx = this.anchor2.x;
    pathString = ABCJS.write.sprintf("M %f %f L %f %f",
			 lineendx, printer.y, lineendx, printer.y+10); 
    printer.printPath({path:pathString, stroke:"#000000", fill:"#000000"}); // TODO scale
  }


  pathString = ABCJS.write.sprintf("M %f %f L %f %f",
				  linestartx, printer.y, lineendx, printer.y); 
  printer.printPath({path:pathString, stroke:"#000000", fill:"#000000"});  // TODO scale
};

ABCJS.write.TieElem = function(anchor1, anchor2, above, forceandshift) {
  this.anchor1 = anchor1; // must have a .x and a .pitch, and a .parent property or be null (means starts at the "beginning" of the line - after keysig)
  this.anchor2 = anchor2; // must have a .x and a .pitch property or be null (means ends at the end of the line)
  this.above = above; // true if the arc curves above
  this.force = forceandshift; // force the arc curve, regardless of beaming if true
                      // move by +7 "up" by -7 if "down"
};

ABCJS.write.TieElem.prototype.draw = function (printer, linestartx, lineendx) {
  var startpitch;
  var endpitch;

  if (this.startlimitelem) {
    linestartx = this.startlimitelem.x+this.startlimitelem.w;
  } 

  if (this.endlimitelem) {
    lineendx = this.endlimitelem.x;
  } 
	// PER: We might have to override the natural slur direction if the first and last notes are not in the
	// save direction. We always put the slur up in this case. The one case that works out wrong is that we always
	// want the slur to be up when the last note is stem down. We can tell the stem direction if the top is
	// equal to the pitch: if so, there is no stem above it.
	if (!this.force && this.anchor2 && this.anchor2.pitch === this.anchor2.top)
		this.above = true;

  if (this.anchor1) {
    linestartx = this.anchor1.x;
    startpitch = this.above ? this.anchor1.highestVert : this.anchor1.pitch;
    if (!this.anchor2) {
      endpitch = this.above ? this.anchor1.highestVert : this.anchor1.pitch;
    }
  }

  if (this.anchor2) {
    lineendx = this.anchor2.x;
    endpitch = this.above ? this.anchor2.highestVert : this.anchor2.pitch;
    if (!this.anchor1) {
      startpitch = this.above ? this.anchor2.highestVert : this.anchor2.pitch;
    }
  }

//  if (this.anchor1 && this.anchor2) {
//    if ((!this.force && this.anchor1.parent.beam && this.anchor2.parent.beam &&
//	 this.anchor1.parent.beam.asc===this.anchor2.parent.beam.asc) ||
//	((this.force==="up") || this.force==="down") && this.anchor1.parent.beam && this.anchor2.parent.beam && this.anchor1.parent.beam===this.anchor2.parent.beam) {
//      this.above = !this.anchor1.parent.beam.asc;
//      preservebeamdir = true;
//    }
//  }

//  var pitchshift = 0;
//  if (this.force==="up" && !preservebeamdir) pitchshift = 7;
//  if (this.force==="down" && !preservebeamdir) pitchshift = -7;

//	printer.debugMsgLow(linestartx, debugMsg);
  printer.drawArc(linestartx, lineendx, startpitch, endpitch,  this.above);

};

ABCJS.write.DynamicDecoration = function(anchor, dec) {
    this.anchor = anchor;
    this.dec = dec;
};

ABCJS.write.DynamicDecoration.prototype.draw = function(printer, linestartx, lineendx) {
    var ypos = printer.layouter.minY - 7;
    var scalex = 1; // TODO-PER: do the scaling
    var scaley = 1;
    printer.printSymbol(this.anchor.x, ypos, this.dec, scalex, scaley);
};

ABCJS.write.CrescendoElem = function(anchor1, anchor2, dir) {
    this.anchor1 = anchor1; // must have a .x and a .parent property or be null (means starts at the "beginning" of the line - after keysig)
    this.anchor2 = anchor2; // must have a .x property or be null (means ends at the end of the line)
    this.dir = dir; // either "<" or ">"
};

ABCJS.write.CrescendoElem.prototype.draw = function (printer, linestartx, lineendx) {
    if (this.dir === "<") {
        this.drawLine(printer, 0, -4);
        this.drawLine(printer, 0, 4);
    } else {
        this.drawLine(printer, -4, 0);
        this.drawLine(printer, 4, 0);
    }
};

ABCJS.write.CrescendoElem.prototype.drawLine = function (printer, y1, y2) {
    var ypos = printer.layouter.minY - 7;
    var pathString = ABCJS.write.sprintf("M %f %f L %f %f",
        this.anchor1.x, printer.calcY(ypos)+y1-4, this.anchor2.x, printer.calcY(ypos)+y2-4);
    printer.printPath({path:pathString, stroke:"#000000"});
};

ABCJS.write.TripletElem = function(number, mid_nbr, anchor1, anchor2, above) {
  this.anchor1 = anchor1; // must have a .x and a .parent property or be null (means starts at the "beginning" of the line - after keysig)
  this.anchor2 = anchor2; // must have a .x property or be null (means ends at the end of the line)
  this.above = above;
  this.number = number;
  this.mid_nbr=mid_nbr;
};

ABCJS.write.TripletElem.prototype.draw = function (printer, linestartx, lineendx) {
  // TODO end and beginning of line
  if (this.anchor1 && this.anchor2) {
    var ypos = this.above?16:-1;	// PER: Just bumped this up from 14 to make (3z2B2B2 (3B2B2z2 succeed. There's probably a better way.
    //alert('we are here');
    if (this.anchor1.parent.beam && 
	this.anchor1.parent.beam===this.anchor2.parent.beam) {
      var beam = this.anchor1.parent.beam;
      this.above = beam.asc;
      ypos = beam.pos;     
    } else {
      this.drawLine(printer,printer.calcY(ypos));
    }
    var xsum = this.anchor1.x+this.anchor2.x;
    var ydelta = 0;
    if (beam) {
      if (this.above) {
	xsum += (this.anchor2.w + this.anchor1.w);
	ydelta = 4;
      } else {
	ydelta = -4;
      }
    } else {
      xsum += this.anchor2.w;
    }
    
    if(this.mid_nbr===undefined)
		printer.printText(xsum/2, ypos+ydelta, this.number, "middle").attr({"font-size":"10px", 'font-style': 'italic' });
	else
		printer.printText(xsum/2, ypos+ydelta, this.number +":"+this.mid_nbr, "middle").attr({"font-size":"10px", 'font-style': 'italic' });

  }
};

ABCJS.write.TripletElem.prototype.drawLine = function (printer, y) {
  var pathString;
  var linestartx = this.anchor1.x;
  pathString = ABCJS.write.sprintf("M %f %f L %f %f",
		       linestartx, y, linestartx, y+5); 
  printer.printPath({path:pathString, stroke:"#000000"});
  
  var lineendx = this.anchor2.x+this.anchor2.w;
  pathString = ABCJS.write.sprintf("M %f %f L %f %f",
		       lineendx, y, lineendx, y+5); 
  printer.printPath({path:pathString, stroke:"#000000"});
  
  pathString = ABCJS.write.sprintf("M %f %f L %f %f",
		       linestartx, y, (linestartx+lineendx)/2-8, y);  // Change slighlty the width
  printer.printPath({path:pathString, stroke:"#000000"});


  pathString = ABCJS.write.sprintf("M %f %f L %f %f",
		       (linestartx+lineendx)/2+8, y, lineendx, y); 
  printer.printPath({path:pathString, stroke:"#000000"});

};

ABCJS.write.BeamElem = function(type, flat) {
  this.isflat = (flat);
  this.isgrace = (type && type==="grace");
  this.forceup = (type && type==="up");
  this.forcedown = (type && type==="down");
  this.elems = []; // all the ABCJS.write.AbsoluteElements
  this.total = 0;
  this.dy = (this.asc)?ABCJS.write.spacing.STEP*1.2:-ABCJS.write.spacing.STEP*1.2;
  if (this.isgrace) this.dy = this.dy*0.4;
  this.allrests = true;
};

ABCJS.write.BeamElem.prototype.add = function(abselem) {
  var pitch = abselem.abcelem.averagepitch;
  if (pitch===undefined) return; // don't include elements like spacers in beams
  this.allrests = this.allrests && abselem.abcelem.rest;
  abselem.beam = this;
  this.elems.push(abselem);
  //var pitch = abselem.abcelem.averagepitch;
  this.total += pitch; // TODO CHORD (get pitches from abselem.heads)
  if (!this.min || abselem.abcelem.minpitch<this.min) {
    this.min = abselem.abcelem.minpitch;
  }
  if (!this.max || abselem.abcelem.maxpitch>this.max) {
    this.max = abselem.abcelem.maxpitch;
  }
};

ABCJS.write.BeamElem.prototype.average = function() {
  try {
    return this.total/this.elems.length;
  } catch (e) {
    return 0;
  }
};

ABCJS.write.BeamElem.prototype.draw = function(printer) {
  if (this.elems.length === 0 || this.allrests) return;
  this.drawBeam(printer);
  this.drawStems(printer);
};

ABCJS.write.BeamElem.prototype.calcDir = function() {
	var average = this.average();
//	var barpos = (this.isgrace)? 5:7;
	this.asc = (this.forceup || this.isgrace || average<7) && (!this.forcedown); // hardcoded 6 is B 7 is c
	return this.asc;
};

ABCJS.write.BeamElem.prototype.drawBeam = function(printer) {
	var average = this.average();
	var barpos = (this.isgrace)? 5:7;
	this.calcDir();

  var barminpos = this.asc ? 5 : 8;	//PER: I just bumped up the minimum height for notes with descending stems to clear a rest in the middle of them.
  this.pos = Math.round(this.asc ? Math.max(average+barpos,this.max+barminpos) : Math.min(average-barpos,this.min-barminpos));
  var slant = this.elems[0].abcelem.averagepitch-this.elems[this.elems.length-1].abcelem.averagepitch;
  if (this.isflat) slant=0;
  var maxslant = this.elems.length/2;

  if (slant>maxslant) slant = maxslant;
  if (slant<-maxslant) slant = -maxslant;
  this.starty = printer.calcY(this.pos+Math.floor(slant/2));
  this.endy = printer.calcY(this.pos+Math.floor(-slant/2));

  var starthead = this.elems[0].heads[(this.asc)? 0: this.elems[0].heads.length-1];
  var endhead = this.elems[this.elems.length-1].heads[(this.asc)? 0: this.elems[this.elems.length-1].heads.length-1];
  this.startx = starthead.x;
  if(this.asc) this.startx+=starthead.w-0.6;
  this.endx = endhead.x;
  if(this.asc) this.endx+=endhead.w;

	// PER: if the notes are too high or too low, make the beam go down to the middle
	if (this.asc && this.pos < 6) {
		this.starty = printer.calcY(6);
		this.endy = printer.calcY(6);
	} else if (!this.asc && this.pos > 6) {
		this.starty = printer.calcY(6);
		this.endy = printer.calcY(6);
	}

  var pathString = "M"+this.startx+" "+this.starty+" L"+this.endx+" "+this.endy+
  "L"+this.endx+" "+(this.endy+this.dy) +" L"+this.startx+" "+(this.starty+this.dy)+"z";
  printer.printPath({path:pathString, stroke:"none", fill:"#000000"});
};

ABCJS.write.BeamElem.prototype.drawStems = function(printer) {
  var auxbeams = [];  // auxbeam will be {x, y, durlog, single} auxbeam[0] should match with durlog=-4 (16th) (j=-4-durlog)
  printer.beginGroup();
  for (var i=0,ii=this.elems.length; i<ii; i++) {
    if (this.elems[i].abcelem.rest)
      continue;
    var furthesthead = this.elems[i].heads[(this.asc)? 0: this.elems[i].heads.length-1];
    var ovaldelta = (this.isgrace)?1/3:1/5;
    var pitch = furthesthead.pitch + ((this.asc) ? ovaldelta : -ovaldelta);
    var y = printer.calcY(pitch);
    var x = furthesthead.x + ((this.asc) ? furthesthead.w: 0);
    var bary=this.getBarYAt(x);
    var dx = (this.asc) ? -0.6 : 0.6;
    printer.printStem(x,dx,y,bary);

    var sy = (this.asc) ? 1.5*ABCJS.write.spacing.STEP: -1.5*ABCJS.write.spacing.STEP;
    if (this.isgrace) sy = sy*2/3;
    for (var durlog=ABCJS.write.getDurlog(this.elems[i].abcelem.duration); durlog<-3; durlog++) { // get the duration via abcelem because of triplets
      if (auxbeams[-4-durlog]) {
	auxbeams[-4-durlog].single = false;
      } else {
	auxbeams[-4-durlog] = {x:x+((this.asc)?-0.6:0), y:bary+sy*(-4-durlog+1), 
			       durlog:durlog, single:true};
      }
    }
    
    for (var j=auxbeams.length-1;j>=0;j--) {
      if (i===ii-1 || ABCJS.write.getDurlog(this.elems[i+1].abcelem.duration)>(-j-4)) {
	
	var auxbeamendx = x;
	var auxbeamendy = bary + sy*(j+1);


	if (auxbeams[j].single) {
	  auxbeamendx = (i===0) ? x+5 : x-5;
	  auxbeamendy = this.getBarYAt(auxbeamendx) + sy*(j+1);
	}
	// TODO I think they are drawn from front to back, hence the small x difference with the main beam

	var pathString ="M"+auxbeams[j].x+" "+auxbeams[j].y+" L"+auxbeamendx+" "+auxbeamendy+
	  "L"+auxbeamendx+" "+(auxbeamendy+this.dy) +" L"+auxbeams[j].x+" "+(auxbeams[j].y+this.dy)+"z";
	printer.printPath({path:pathString, stroke:"none", fill:"#000000"});
	auxbeams = auxbeams.slice(0,j);
      }
    }
  }
  printer.endGroup();
};

ABCJS.write.BeamElem.prototype.getBarYAt = function(x) {
  return this.starty + (this.endy-this.starty)/(this.endx-this.startx)*(x-this.startx);
};
//    abc_layout.js: Creates a data structure suitable for printing a line of abc
//    Copyright (C) 2010 Gregory Dyke (gregdyke at gmail dot com)
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.

/*global window, ABCJS */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.write)
	window.ABCJS.write = {};

ABCJS.write.getDuration = function(elem) {
  var d = 0;
  if (elem.duration) {
    d = elem.duration;
  }
  return d;
};

ABCJS.write.getDurlog = function(duration) {
  return Math.floor(Math.log(duration)/Math.log(2));
};

ABCJS.write.Layout = function(glyphs, bagpipes) {
  this.glyphs = glyphs;
  this.isBagpipes = bagpipes;
  this.chartable = {rest:{0:"rests.whole", 1:"rests.half", 2:"rests.quarter", 3:"rests.8th", 4: "rests.16th",5: "rests.32nd", 6: "rests.64th", 7: "rests.128th"},
		   note:{"-1": "noteheads.dbl", 0:"noteheads.whole", 1:"noteheads.half", 2:"noteheads.quarter", 3:"noteheads.quarter", 4:"noteheads.quarter", 5:"noteheads.quarter", 6:"noteheads.quarter"},
		   uflags:{3:"flags.u8th", 4:"flags.u16th", 5:"flags.u32nd", 6:"flags.u64th"},
		   dflags:{3:"flags.d8th", 4:"flags.d16th", 5:"flags.d32nd", 6:"flags.d64th"}};
  this.slurs = {};
  this.ties = [];
  this.slursbyvoice = {};
  this.tiesbyvoice = {};
  this.endingsbyvoice = {};
  this.s = 0; // current staff number
  this.v = 0; // current voice number on current staff
  this.stafflines = 5;
  this.tripletmultiplier = 1;
};

ABCJS.write.Layout.prototype.getCurrentVoiceId = function() {
  return "s"+this.s+"v"+this.v;
};

ABCJS.write.Layout.prototype.pushCrossLineElems = function() {
  this.slursbyvoice[this.getCurrentVoiceId()] = this.slurs;
  this.tiesbyvoice[this.getCurrentVoiceId()] = this.ties;
  this.endingsbyvoice[this.getCurrentVoiceId()] = this.partstartelem;
};

ABCJS.write.Layout.prototype.popCrossLineElems = function() {
  this.slurs = this.slursbyvoice[this.getCurrentVoiceId()] || {};
  this.ties = this.tiesbyvoice[this.getCurrentVoiceId()] || [];
  this.partstartelem = this.endingsbyvoice[this.getCurrentVoiceId()];
};

ABCJS.write.Layout.prototype.getElem = function() {
  if (this.abcline.length <= this.pos)
    return null;
  return this.abcline[this.pos];
};

ABCJS.write.Layout.prototype.getNextElem = function() {
	if (this.abcline.length <= this.pos+1)
		return null;
    return this.abcline[this.pos+1];
};

ABCJS.write.Layout.prototype.printABCLine = function(staffs) {
    this.minY = 2;  // PER: This is the lowest that any note reaches. It will be used to set the dynamics row.
  this.staffgroup = new ABCJS.write.StaffGroupElement();
  for (this.s = 0; this.s < staffs.length; this.s++) {
    this.printABCStaff(staffs[this.s]);
  }
  return this.staffgroup;
};

ABCJS.write.Layout.prototype.printABCStaff = function(abcstaff) {

  var header = "";
  if (abcstaff.bracket) header += "bracket "+abcstaff.bracket+" ";
  if (abcstaff.brace) header += "brace "+abcstaff.brace+" ";

  
  for (this.v = 0; this.v < abcstaff.voices.length; this.v++) {
    this.voice = new ABCJS.write.VoiceElement(this.v,abcstaff.voices.length);
    if (this.v===0) {
      this.voice.barfrom = (abcstaff.connectBarLines==="start" || abcstaff.connectBarLines==="continue");
      this.voice.barto = (abcstaff.connectBarLines==="continue" || abcstaff.connectBarLines==="end");
    } else {
      this.voice.duplicate = true; // barlines and other duplicate info need not be printed
    }
    if (abcstaff.title && abcstaff.title[this.v]) this.voice.header=abcstaff.title[this.v];
    // TODO make invisible if voice is duplicate
    this.voice.addChild(this.printClef(abcstaff.clef));
    this.voice.addChild(this.printKeySignature(abcstaff.key));
    if (abcstaff.meter) this.voice.addChild(this.printTimeSignature(abcstaff.meter));
    this.printABCVoice(abcstaff.voices[this.v]);
    this.staffgroup.addVoice(this.voice,this.s,this.stafflines);
  }
 
};

ABCJS.write.Layout.prototype.printABCVoice = function(abcline) {
  this.popCrossLineElems();
  this.stemdir = (this.isBagpipes)?"down":null;
  this.abcline = abcline;
  if (this.partstartelem) {
    this.partstartelem = new ABCJS.write.EndingElem("", null, null);
    this.voice.addOther(this.partstartelem);
  }
  for (var slur in this.slurs) {
    if (this.slurs.hasOwnProperty(slur)) {
      this.slurs[slur]= new ABCJS.write.TieElem(null, null, this.slurs[slur].above, this.slurs[slur].force);
	this.voice.addOther(this.slurs[slur]);
    }
  }
  for (var i=0; i<this.ties.length; i++) {
    this.ties[i]=new ABCJS.write.TieElem(null, null, this.ties[i].above, this.ties[i].force);
    this.voice.addOther(this.ties[i]);
  }

  for (this.pos=0; this.pos<this.abcline.length; this.pos++) {
    var abselems = this.printABCElement();
    for (i=0; i<abselems.length; i++) {
      this.voice.addChild(abselems[i]);
    }
  }
  this.pushCrossLineElems();
};


// return an array of ABCJS.write.AbsoluteElement
ABCJS.write.Layout.prototype.printABCElement = function() {
  var elemset = [];
  var elem = this.getElem();
  switch (elem.el_type) {
  case "note":
    elemset = this.printBeam();
    break;
  case "bar":
    elemset[0] = this.printBarLine(elem);
    if (this.voice.duplicate) elemset[0].invisible = true;
    break;
  case "meter":
    elemset[0] = this.printTimeSignature(elem);
    if (this.voice.duplicate) elemset[0].invisible = true;
    break;
  case "clef":
    elemset[0] = this.printClef(elem);
    if (this.voice.duplicate) elemset[0].invisible = true;
    break;
  case "key":
    elemset[0] = this.printKeySignature(elem);
    if (this.voice.duplicate) elemset[0].invisible = true;
    break;
  case "stem":
    this.stemdir=elem.direction;
    break;
  case "part":
    var abselem = new ABCJS.write.AbsoluteElement(elem,0,0);
    abselem.addChild(new ABCJS.write.RelativeElement(elem.title, 0, 0, 18, {type:"text", attributes:{"font-weight":"bold", "font-size":"16px", "font-family":"serif"}}));
    elemset[0] = abselem;
    break;
//	  case "tempo":
//		this.printer.y = this.printer.printTempo(elem, this.printer.paper, this.printer.layouter, this.printer.y, this.printer, this.printer.x);
//		break;
  default: 
    var abselem2 = new ABCJS.write.AbsoluteElement(elem,0,0);
    abselem2.addChild(new ABCJS.write.RelativeElement("element type "+elem.el_type, 0, 0, 0, {type:"debug"}));
    elemset[0] = abselem2;
  }

  return elemset;
};

ABCJS.write.Layout.prototype.printBeam = function() {
  var abselemset = [];
  
  if (this.getElem().startBeam && !this.getElem().endBeam) {
    var beamelem = new ABCJS.write.BeamElem(this.stemdir);
	   // PER: need two passes: the first one decides if the stems are up or down.
	  // TODO-PER: This could be more efficient.
	  var oldPos = this.pos;
	  var abselem;
	  while (this.getElem()) {
		  abselem = this.printNote(this.getElem(),true,true);
		  beamelem.add(abselem);
		  if (this.getElem().endBeam)
			break;
		  this.pos++;
		}
	  var dir = beamelem.calcDir();
	  this.pos = oldPos;

	  beamelem = new ABCJS.write.BeamElem(dir ? "up" : "down");
	  //beamelem = new ABCJS.write.BeamElem("up");
	  var oldDir = this.stemdir;
	  this.stemdir = dir ? "up" : "down";
	  //this.stemdir = "up" ;
    while (this.getElem()) {
      abselem = this.printNote(this.getElem(),true);
      abselemset.push(abselem);
		beamelem.add(abselem);
      if (this.getElem().endBeam) {
		break;
      }
      this.pos++;
    }
	  this.stemdir = oldDir;
    this.voice.addOther(beamelem);
  } else {
    abselemset[0] = this.printNote(this.getElem());
  }
  return abselemset;
};

ABCJS.write.sortPitch = function(elem) {
  var sorted;
  do {
    sorted = true;
    for (var p = 0; p<elem.pitches.length-1; p++) {
      if (elem.pitches[p].pitch>elem.pitches[p+1].pitch) {
	sorted = false;
	var tmp = elem.pitches[p];
	elem.pitches[p] = elem.pitches[p+1];
	elem.pitches[p+1] = tmp;
      }     
    }
  } while (!sorted);
};

ABCJS.write.Layout.prototype.printNote = function(elem, nostem, dontDraw) { //stem presence: true for drawing stemless notehead
  var notehead = null;
  var grace= null;
  this.roomtaken = 0; // room needed to the left of the note
  this.roomtakenright = 0; // room needed to the right of the note
  var dotshiftx = 0; // room taken by chords with displaced noteheads which cause dots to shift
  var c="";
  var flag = null;
  var additionalLedgers = []; // PER: handle the case of [bc'], where the b doesn't have a ledger line

  var p, i, pp;
  var width, p1, p2, dx;

  var duration = ABCJS.write.getDuration(elem);
  if (duration === 0) { duration = 0.25; nostem = true; }	//PER: zero duration will draw a quarter note head.
  var durlog = Math.floor(Math.log(duration)/Math.log(2));  //TODO use getDurlog
  var dot=0;

  for (var tot = Math.pow(2,durlog), inc=tot/2; tot<duration; dot++,tot+=inc,inc/=2);
  
/*  if (elem.startTriplet) {
	  if (elem.startTriplet === 2)
	    this.tripletmultiplier = 3/2;
	  else if (elem.startTriplet === 5)
	    this.tripletmultiplier = 4/5;
	  else if(elem.startTriplet === 6)
		 this.tripletmultiplier  = 4/6;
	  else if(elem.startTriplet === 7)
		 this.tripletmultiplier  = 4/7;
	  else
	    this.tripletmultiplier=(elem.startTriplet-1)/elem.startTriplet;
  }*/

   if (elem.startTriplet){
	  if(elem.mid_nbr)  var numerator=elem.mid_nbr; 
	  else 				var numerator=4;
	 
	  if (elem.startTriplet === 2){
		  this.tripletmultiplier = 3/2;		  
	  }
	  if (elem.startTriplet === 3 && numerator === 4){
		  this.tripletmultiplier = 2/3;		  
	  }
	  else{
	    this.tripletmultiplier= numerator/elem.startTriplet;	    	    
	}
  }


  var abselem = new ABCJS.write.AbsoluteElement(elem, duration * this.tripletmultiplier, 1);
  

  if (elem.rest) {
    var restpitch = 7;
    if (this.stemdir==="down") restpitch = 7;
    if (this.stemdir==="up") restpitch = 7;
    switch(elem.rest.type) {
    case "rest": 
      c = this.chartable.rest[-durlog];
      elem.averagepitch=restpitch; 
      elem.minpitch=restpitch;
      elem.maxpitch=restpitch;
      break; 
    case "invisible":
    case "spacer":
      c="";
    }
	if (!dontDraw)
    notehead = this.printNoteHead(abselem, c, {verticalPos:restpitch}, null, 0, -this.roomtaken, null, dot, 0, 1);
    if (notehead) abselem.addHead(notehead);
    this.roomtaken+=this.accidentalshiftx;
    this.roomtakenright = Math.max(this.roomtakenright,this.dotshiftx);

  } else {
	  ABCJS.write.sortPitch(elem);
    
    // determine averagepitch, minpitch, maxpitch and stem direction
    var sum=0;
    for (p=0, pp=elem.pitches.length; p<pp; p++) {
      sum += elem.pitches[p].verticalPos;
    }
    elem.averagepitch = sum/elem.pitches.length;
    elem.minpitch = elem.pitches[0].verticalPos;
      this.minY = Math.min(elem.minpitch, this.minY);
    elem.maxpitch = elem.pitches[elem.pitches.length-1].verticalPos;
    var dir = (elem.averagepitch>=7) ? "down": "up";  // Aqui se decide si va arriba o abajo. 
    //var dir = "up";
    if (this.stemdir) dir=this.stemdir;
    
    // determine elements of chords which should be shifted
    for (p=(dir==="down")?elem.pitches.length-2:1; (dir==="down")?p>=0:p<elem.pitches.length; p=(dir==="down")?p-1:p+1) {
      var prev = elem.pitches[(dir==="down")?p+1:p-1];
      var curr = elem.pitches[p];
      var delta = (dir==="down")?prev.pitch-curr.pitch:curr.pitch-prev.pitch;
      if (delta<=1 && !prev.printer_shift) {
        curr.printer_shift=(delta)?"different":"same";
        if (curr.verticalPos > 11 || curr.verticalPos < 1) {	// PER: add extra ledger line
          additionalLedgers.push(curr.verticalPos - (curr.verticalPos%2));
        }
	if (dir==="down") {
	  this.roomtaken = this.glyphs.getSymbolWidth(this.chartable.note[-durlog])+2;
	} else {
	  dotshiftx = this.glyphs.getSymbolWidth(this.chartable.note[-durlog])+2;
	}
      }
    }
    
   	// The accidentalSlot will hold a list of all the accidentals on this chord. Each element is a vertical place,
   	// and contains a pitch, which is the last pitch that contains an accidental in that slot. The slots are numbered
	 // from closest to the note to farther left. We only need to know the last accidental we placed because
	  // we know that the pitches are sorted by now.
    this.accidentalSlot = [];

    for (p=0; p<elem.pitches.length; p++) {

      if (!nostem) {
	if ((dir==="down" && p!==0) || (dir==="up" && p!==pp-1)) { // not the stemmed elem of the chord
	  flag = null;
	} else {

	  flag = this.chartable[(dir==="down")?"dflags":"uflags"][-durlog];

	}
	// Hack to display hihat notes for pitches D and g
	if(elem.pitches[p].pitch == 1 || elem.pitches[p].pitch == 11){
		c = "noteheads.hihat";  //pitches = {A: 5, B: 6, C: 0, D: 1, E: 2, F: 3, G: 4, a: 12, b: 13, c: 7, d: 8, e: 9, f: 10, g: 11};
	}
	else{
	    c = this.chartable.note[-durlog];
	
	    
	}


      } else {
	if(elem.pitches[p].pitch == 1 || elem.pitches[p].pitch == 11){
		c = "noteheads.hihat";  //pitches = {A: 5, B: 6, C: 0, D: 1, E: 2, F: 3, G: 4, a: 12, b: 13, c: 7, d: 8, e: 9, f: 10, g: 11};
	}
	else{
		c="noteheads.quarter";
	}
      }

		// The highest position for the sake of placing slurs is itself if the slur is internal. It is the highest position possible if the slur is for the whole chord.
		// If the note is the only one in the chord, then any slur it has counts as if it were on the whole chord.
		elem.pitches[p].highestVert = elem.pitches[p].verticalPos;
		var isTopWhenStemIsDown = (this.stemdir==="up" || dir==="up") && p===0;
		var isBottomWhenStemIsUp = (this.stemdir==="down" || dir==="down") && p===pp-1;
      if (!dontDraw && (isTopWhenStemIsDown || isBottomWhenStemIsUp)) { // place to put slurs if not already on pitches

		  if (elem.startSlur || pp === 1) {
		  elem.pitches[p].highestVert = elem.pitches[pp-1].verticalPos;
		  if (this.stemdir==="up" || dir==="up")
					elem.pitches[p].highestVert += 6;	// If the stem is up, then compensate for the length of the stem
		  }
			  if (elem.startSlur) {
          if (!elem.pitches[p].startSlur) elem.pitches[p].startSlur = []; //TODO possibly redundant, provided array is not optional
	  for (i=0; i<elem.startSlur.length; i++) {
	    elem.pitches[p].startSlur.push(elem.startSlur[i]);
	  }
        }

        if (!dontDraw && elem.endSlur) {
			elem.pitches[p].highestVert = elem.pitches[pp-1].verticalPos;
			if (this.stemdir==="up" || dir==="up")
				elem.pitches[p].highestVert += 6;	// If the stem is up, then compensate for the length of the stem
          if (!elem.pitches[p].endSlur)  elem.pitches[p].endSlur = [];  //TODO possibly redundant, provided array is not optional
	  for (i=0; i<elem.endSlur.length; i++) {
	    elem.pitches[p].endSlur.push(elem.endSlur[i]);
	  }
        }
      }

      if (!dontDraw)
      notehead = this.printNoteHead(abselem, c, elem.pitches[p], dir, 0, -this.roomtaken, flag, dot, dotshiftx, 1);
      if (notehead) abselem.addHead(notehead);
      this.roomtaken += this.accidentalshiftx;
      this.roomtakenright = Math.max(this.roomtakenright,this.dotshiftx); 
    }
      
    // draw stem from the furthest note to a pitch above/below the stemmed note
    if (!nostem && durlog<=-1) {
      p1 = (dir==="down") ? elem.minpitch-7 : elem.minpitch+1/3;
		// PER added stemdir test to make the line meet the note.
      if (p1>6 && !this.stemdir) p1=6;
      p2 = (dir==="down") ? elem.maxpitch-1/3 : elem.maxpitch+7;
		// PER added stemdir test to make the line meet the note.
      if (p2<6 && !this.stemdir) p2=6;
      dx = (dir==="down" || abselem.heads.length === 0)?0:abselem.heads[0].w;
      width = (dir==="down")?1:-1;
      abselem.addExtra(new ABCJS.write.RelativeElement(null, dx, 0, p1, {"type": "stem", "pitch2":p2, linewidth: width}));
        this.minY = Math.min(p1, this.minY);
        this.minY = Math.min(p2, this.minY);
    }
    
  }
  
  if (elem.lyric !== undefined) {
    var lyricStr = "";
	  window.ABCJS.parse.each(elem.lyric, function(ly) {
	      lyricStr += ly.syllable + ly.divider + "\n";
      });
    abselem.addRight(new ABCJS.write.RelativeElement(lyricStr, 0, lyricStr.length*5, 0, {type:"debugLow"}));
  }
  
  if (!dontDraw && elem.gracenotes !== undefined) {
    var gracescale = 3/5;
    var gracebeam = null;
    if (elem.gracenotes.length>1) {
      gracebeam = new ABCJS.write.BeamElem("grace",this.isBagpipes);
    }

    var graceoffsets = [];
    for (i=elem.gracenotes.length-1; i>=0; i--) { // figure out where to place each gracenote
      this.roomtaken+=10;
      graceoffsets[i] = this.roomtaken;
      if (elem.gracenotes[i].accidental) {
	this.roomtaken+=7;
      }
    }

    for (i=0; i<elem.gracenotes.length; i++) {
      var gracepitch = elem.gracenotes[i].verticalPos;

      flag = (gracebeam) ? null : this.chartable.uflags[(this.isBagpipes)?5:3];
      grace = this.printNoteHead(abselem, "noteheads.quarter",  elem.gracenotes[i], "up", -graceoffsets[i], -graceoffsets[i], flag, 0, 0, gracescale);
      abselem.addExtra(grace);
		// PER: added acciaccatura slash
		if (elem.gracenotes[i].acciaccatura) {
			var pos = elem.gracenotes[i].verticalPos+7*gracescale;	// the same formula that determines the flag position.
			var dAcciaccatura = gracebeam ? 5 : 6;	// just an offset to make it line up correctly.
			abselem.addRight(new ABCJS.write.RelativeElement("flags.ugrace", -graceoffsets[i]+dAcciaccatura, 0, pos, {scalex:gracescale, scaley: gracescale}));
		}
      if (gracebeam) { // give the beam the necessary info
	var pseudoabselem = {heads:[grace], 
			     abcelem:{averagepitch: gracepitch, minpitch: gracepitch, maxpitch: gracepitch},
			     duration:(this.isBagpipes)?1/32:1/16};
	gracebeam.add(pseudoabselem);
      } else { // draw the stem
	p1 = gracepitch+1/3*gracescale;
	p2 = gracepitch+7*gracescale;
	dx = grace.dx + grace.w;
	width = -0.6;
	abselem.addExtra(new ABCJS.write.RelativeElement(null, dx, 0, p1, {"type": "stem", "pitch2":p2, linewidth: width}));
      }
      
      if (i===0 && !this.isBagpipes && !(elem.rest && (elem.rest.type==="spacer"||elem.rest.type==="invisible"))) this.voice.addOther(new ABCJS.write.TieElem(grace, notehead, false, true));
    }

    if (gracebeam) {
      this.voice.addOther(gracebeam);
    } 
  }

  if (!dontDraw && elem.decoration) {
    var addMark = this.printDecoration(elem.decoration, elem.maxpitch, (notehead)?notehead.w:0, abselem, this.roomtaken, dir, elem.minpitch);
	  if (addMark) {
		  abselem.klass = "mark";
	  }
  }
  
  if (elem.barNumber) {
    abselem.addChild(new ABCJS.write.RelativeElement(elem.barNumber, -10, 0, 0, {type:"debug"}));
  }
  
  // ledger lines
  for (i=elem.maxpitch; i>11; i--) {
    if (i%2===0 && !elem.rest) {
      abselem.addChild(new ABCJS.write.RelativeElement(null, -2, this.glyphs.getSymbolWidth(c)+4, i, {type:"ledger"}));
    }
  }
  
  for (i=elem.minpitch; i<1; i++) {
    if (i%2===0 && !elem.rest) {
      abselem.addChild(new ABCJS.write.RelativeElement(null, -2, this.glyphs.getSymbolWidth(c)+4, i, {type:"ledger"}));
    }
  }

  for (i = 0; i < additionalLedgers.length; i++) { // PER: draw additional ledgers
    var ofs = this.glyphs.getSymbolWidth(c);
    if (dir === 'down') ofs = -ofs;
    abselem.addChild(new ABCJS.write.RelativeElement(null, ofs-2, this.glyphs.getSymbolWidth(c)+4, additionalLedgers[i], {type:"ledger"}));
  }

  if (elem.chord !== undefined) { //16 -> high E.
    for (i = 0; i < elem.chord.length; i++) {
      var x = 0;
      var y = 16;
      switch (elem.chord[i].position) {
      case "left":
	this.roomtaken+=7;
	x = -this.roomtaken;	// TODO-PER: This is just a guess from trial and error
	y = elem.averagepitch;
	abselem.addExtra(new ABCJS.write.RelativeElement(elem.chord[i].name, x, this.glyphs.getSymbolWidth(elem.chord[i].name[0])+4, y, {type:"text"}));
	break;
      case "right":
	this.roomtakenright+=4;
	x = this.roomtakenright;// TODO-PER: This is just a guess from trial and error
	y = elem.averagepitch;
	abselem.addRight(new ABCJS.write.RelativeElement(elem.chord[i].name, x, this.glyphs.getSymbolWidth(elem.chord[i].name[0])+4, y, {type:"text"}));
	break;
      case "below":
	y = elem.minpitch-4;
			  //if (y > -3) y = -3;
			  //if (y > -3) y = -3;
			  var eachLine = elem.chord[i].name.split("\n");
			  for (var ii = 0; ii < eachLine.length; ii++) {
				abselem.addChild(new ABCJS.write.RelativeElement(eachLine[ii], x, 0, y, {type:"text"}));
				  y -= 3;	// TODO-PER: This should actually be based on the font height.
			  }
    break;
      default:
			  if (elem.chord[i].rel_position)
				  abselem.addChild(new ABCJS.write.RelativeElement(elem.chord[i].name, x+elem.chord[i].rel_position.x, 0, elem.minpitch+elem.chord[i].rel_position.y/ABCJS.write.spacing.STEP, {type:"text"}));
			  else
				  abselem.addChild(new ABCJS.write.RelativeElement(elem.chord[i].name, x, 0, y, {type:"text"}));
      }
    }
  }
    

  if (elem.startTriplet) {
	
    this.triplet = new ABCJS.write.TripletElem(elem.startTriplet, elem.mid_nbr, notehead, null, true); // above is opposite from case of slurs
	  if (!dontDraw)
    this.voice.addOther(this.triplet);
  }

  if (elem.endTriplet && this.triplet) {
    this.triplet.anchor2 = notehead;
    /* This will fix the problem of 3)z2B2B2 However I don't know what is the effect on other things*/
    //this.triplet = null;
    this.tripletmultiplier = 1;
  }

  return abselem;
};




ABCJS.write.Layout.prototype.printNoteHead = function(abselem, c, pitchelem, dir, headx, extrax, flag, dot, dotshiftx, scale) {

  // TODO scale the dot as well
  var pitch = pitchelem.verticalPos;
  var notehead;
  var i;
  this.accidentalshiftx = 0;
  this.dotshiftx = 0;
  if (c === undefined)
    abselem.addChild(new ABCJS.write.RelativeElement("pitch is undefined", 0, 0, 0, {type:"debug"}));
  else if (c==="") {
    notehead = new ABCJS.write.RelativeElement(null, 0, 0, pitch);
  } else {
    var shiftheadx = headx;
    if (pitchelem.printer_shift) {
      var adjust = (pitchelem.printer_shift==="same")?1:0;
      shiftheadx = (dir==="down")?-this.glyphs.getSymbolWidth(c)*scale+adjust:this.glyphs.getSymbolWidth(c)*scale-adjust;
    }
    notehead = new ABCJS.write.RelativeElement(c, shiftheadx, this.glyphs.getSymbolWidth(c)*scale, pitch, {scalex:scale, scaley: scale, extreme: ((dir==="down")?"below":"above")});
    if (flag) {
      var pos = pitch+((dir==="down")?-7:7)*scale;
      if (scale===1 && (dir==="down")?(pos>6):(pos<6)) pos=6;
      var xdelta = (dir==="down")?headx:headx+notehead.w-0.6;
      abselem.addRight(new ABCJS.write.RelativeElement(flag, xdelta, this.glyphs.getSymbolWidth(flag)*scale, pos, {scalex:scale, scaley: scale}));
    }
    this.dotshiftx = notehead.w+dotshiftx-2+5*dot;
    for (;dot>0;dot--) {
      var dotadjusty = (1-Math.abs(pitch)%2); //PER: take abs value of the pitch. And the shift still happens on ledger lines.
      abselem.addRight(new ABCJS.write.RelativeElement("dots.dot", notehead.w+dotshiftx-2+5*dot, this.glyphs.getSymbolWidth("dots.dot"), pitch+dotadjusty));
    }
  }
	if (notehead)
		notehead.highestVert = pitchelem.highestVert;
  
  if (pitchelem.accidental) {
    var symb; 
    switch (pitchelem.accidental) {
    case "quartersharp":
      symb = "accidentals.halfsharp";
	break;
    case "dblsharp":
      symb = "accidentals.dblsharp";
      break;
    case "sharp":
      symb = "accidentals.sharp";
      break;
    case "quarterflat":
      symb = "accidentals.halfflat";
      break;
    case "flat":
      symb = "accidentals.flat";
      break;
    case "dblflat":
      symb = "accidentals.dblflat";
      break;
    case "natural":
      symb = "accidentals.nat";
    }
	  // if a note is at least a sixth away, it can share a slot with another accidental
	  var accSlotFound = false;
	  var accPlace = extrax;
	  for (var j = 0; j < this.accidentalSlot.length; j++) {
		  if (pitch - this.accidentalSlot[j][0] >= 6) {
			  this.accidentalSlot[j][0] = pitch;
			  accPlace = this.accidentalSlot[j][1];
			  accSlotFound = true;
			  break;
		  }
	  }
	  if  (accSlotFound === false) {
		  accPlace -= (this.glyphs.getSymbolWidth(symb)*scale+2);
		  this.accidentalSlot.push([pitch,accPlace]);
		  this.accidentalshiftx = (this.glyphs.getSymbolWidth(symb)*scale+2);
	  }
    abselem.addExtra(new ABCJS.write.RelativeElement(symb, accPlace, this.glyphs.getSymbolWidth(symb), pitch, {scalex:scale, scaley: scale}));
  }
  
  if (pitchelem.endTie) {
    if (this.ties[0]) {
      this.ties[0].anchor2=notehead;
      this.ties = this.ties.slice(1,this.ties.length);
    }
  }
  
  if (pitchelem.startTie) {
    //PER: bug fix: var tie = new ABCJS.write.TieElem(notehead, null, (this.stemdir=="up" || dir=="down") && this.stemdir!="down",(this.stemdir=="down" || this.stemdir=="up"));
    var tie = new ABCJS.write.TieElem(notehead, null, (this.stemdir==="down" || dir==="down") && this.stemdir!=="up",(this.stemdir==="down" || this.stemdir==="up"));
    this.ties[this.ties.length]=tie;
    this.voice.addOther(tie);
  }

  if (pitchelem.endSlur) {
    for (i=0; i<pitchelem.endSlur.length; i++) {
      var slurid = pitchelem.endSlur[i];
      var slur;
      if (this.slurs[slurid]) {
	slur = this.slurs[slurid].anchor2=notehead;
	delete this.slurs[slurid];
      } else {
	slur = new ABCJS.write.TieElem(null, notehead, dir==="down",(this.stemdir==="up" || dir==="down") && this.stemdir!=="down", this.stemdir);
	this.voice.addOther(slur);
      }
      if (this.startlimitelem) {
	slur.startlimitelem = this.startlimitelem;
      }
    }
  }
  
  if (pitchelem.startSlur) {
    for (i=0; i<pitchelem.startSlur.length; i++) {
      var slurid = pitchelem.startSlur[i].label;
      //PER: bug fix: var slur = new ABCJS.write.TieElem(notehead, null, (this.stemdir=="up" || dir=="down") && this.stemdir!="down", this.stemdir);
      var slur = new ABCJS.write.TieElem(notehead, null, (this.stemdir==="down" || dir==="down") && this.stemdir!=="up", false);
      this.slurs[slurid]=slur;
      this.voice.addOther(slur);
    }
  }
  
  return notehead;

};

ABCJS.write.Layout.prototype.printDecoration = function(decoration, pitch, width, abselem, roomtaken, dir, minPitch) {
  var dec;
  var compoundDec;	// PER: for decorations with two symbols
  var diminuendo;
    var crescendo;
  var unknowndecs = [];
  //var yslot = (pitch>9) ? pitch+3 : 12;
  var yslot = (pitch>9) ? pitch+3 : 16;
  var ypos;
	//var dir = (this.stemdir==="down" || pitch>=6) && this.stemdir!=="up";
	var below = false;	// PER: whether decoration goes above or below.
	var yslotB = this.minY - 4; // (pitch<1) ? pitch-9 : -6;
  var i;
  roomtaken = roomtaken || 0;
  if (pitch===5) yslot=14; // avoid upstem of the A
	var addMark = false; // PER: to allow the user to add a class whereever

  for (i=0;i<decoration.length; i++) { // treat staccato first (may need to shift other markers) //TODO, same with tenuto?
    if (decoration[i]==="staccato") {
      ypos = (dir==="down") ? pitch+2:minPitch-2;
		// don't place on a stave line. The stave lines are 2,4,6,8,10
		switch (ypos) {
			case 2:
			case 4:
			case 6:
			case 8:
			case 10:
					if (dir === "up") ypos--;
					else ypos++;
				break;
		}
      if (pitch>9) yslot++; // take up some room of those that are above
      var deltax = width/2;
      if (this.glyphs.getSymbolAlign("scripts.staccato")!=="center") {
	deltax -= (this.glyphs.getSymbolWidth(dec)/2);
      }
      abselem.addChild(new ABCJS.write.RelativeElement("scripts.staccato", deltax, this.glyphs.getSymbolWidth("scripts.staccato"), ypos));
    }
    if (decoration[i]==="slide" && abselem.heads[0]) {
      ypos = abselem.heads[0].pitch;
      var blank1 = new ABCJS.write.RelativeElement("", -roomtaken-15, 0, ypos-1);
      var blank2 = new ABCJS.write.RelativeElement("", -roomtaken-5, 0, ypos+1);
      abselem.addChild(blank1);
      abselem.addChild(blank2);
      this.voice.addOther(new ABCJS.write.TieElem(blank1, blank2, false));
    }
  }

  for (i=0;i<decoration.length; i++) {
	  below = false;
    switch(decoration[i]) {
    case "trill":dec="scripts.trill";break;
    case "roll": dec="scripts.roll"; break; //TODO put abc2ps roll in here
    case "irishroll": dec="scripts.roll"; break;
    case "marcato": dec="scripts.umarcato"; break;
    case "marcato2": dec="scriopts.dmarcato"; break;//other marcato
    case "turn": dec="scripts.turn"; break;
    case "uppermordent": dec="scripts.prall"; break;
    case "mordent":
    case "lowermordent": dec="scripts.mordent"; break;
    case "staccato":
    case "slide": continue;
    case "downbow": dec="scripts.downbow";break;
    case "upbow": dec="scripts.upbow";break;
    case "fermata": dec="scripts.ufermata"; break;
    case "invertedfermata": below = true; dec="scripts.dfermata"; break;
    case "breath": dec=","; break;
    case "accent": dec="scripts.sforzato";  break; //  below = true;
    case "tenuto": dec="scripts.tenuto"; break;
    case "coda": dec="scripts.coda"; break;
    case "segno": dec="scripts.segno"; break;
    case "/": compoundDec=["flags.ugrace", 1]; continue;	// PER: added new decorations
    case "//": compoundDec=["flags.ugrace", 2]; continue;
    case "///": compoundDec=["flags.ugrace", 3]; continue;
    case "////": compoundDec=["flags.ugrace", 4]; continue;
    case "p":
    case "mp": 
    case "pp":
    case "ppp":
    case "pppp":
    case "f":
    case "ff": 
    case "fff": 
    case "ffff":
    case "sfz": 
    case "mf":
        var ddelem = new ABCJS.write.DynamicDecoration(abselem, decoration[i]);
        this.voice.addOther(ddelem);
        continue;
		case "mark": addMark = true;  continue;
        case "diminuendo(":
			ABCJS.write.Layout.prototype.startDiminuendoX = abselem;
            diminuendo = undefined;
            continue;
        case "diminuendo)":
            diminuendo = { start: ABCJS.write.Layout.prototype.startDiminuendoX, stop: abselem};
			ABCJS.write.Layout.prototype.startDiminuendoX = undefined;
            continue;
        case "crescendo(":
			ABCJS.write.Layout.prototype.startCrescendoX = abselem;
            crescendo = undefined;
            continue;
        case "crescendo)":
            crescendo = { start: ABCJS.write.Layout.prototype.startCrescendoX, stop: abselem};
			ABCJS.write.Layout.prototype.startCrescendoX = undefined;
            continue;
    default:
    unknowndecs[unknowndecs.length]=decoration[i];
    continue;
    }
	  if (below) {
		  ypos = yslotB;
		  yslotB -= 4;
	  } else {
		  ypos=yslot;
		  yslot+=3;
	  }
    var deltax = width/2;
    if (this.glyphs.getSymbolAlign(dec)!=="center") {
      deltax -= (this.glyphs.getSymbolWidth(dec)/2);
    }
    abselem.addChild(new ABCJS.write.RelativeElement(dec, deltax, this.glyphs.getSymbolWidth(dec), ypos));
  }
  if (compoundDec) {	// PER: added new decorations
	  ypos = (dir === 'down') ? pitch+1:pitch+9;
	  deltax = width/2;
	  deltax += (dir === 'down') ? -5 : 3;
	  for (var xx = 0; xx < compoundDec[1]; xx++) {
		  ypos -= 1;
		  abselem.addChild(new ABCJS.write.RelativeElement(compoundDec[0], deltax, this.glyphs.getSymbolWidth(compoundDec[0]), ypos));
	  }
  }
    if (diminuendo) {
        var delem = new ABCJS.write.CrescendoElem(diminuendo.start, diminuendo.stop, ">");
        this.voice.addOther(delem);
    }
    if (crescendo) {
        var celem = new ABCJS.write.CrescendoElem(crescendo.start, crescendo.stop, "<");
        this.voice.addOther(celem);
    }
  if (unknowndecs.length>0)
      abselem.addChild(new ABCJS.write.RelativeElement(unknowndecs.join(','), 0, 0, 0, {type:"debug"}));
	return addMark;
};

ABCJS.write.Layout.prototype.printBarLine = function (elem) {
// bar_thin, bar_thin_thick, bar_thin_thin, bar_thick_thin, bar_right_repeat, bar_left_repeat, bar_double_repeat

  var abselem = new ABCJS.write.AbsoluteElement(elem, 0, 10);
  var anchor = null; // place to attach part lines
  var dx = 0;



  var firstdots = (elem.type==="bar_right_repeat" || elem.type==="bar_dbl_repeat");
  var firstthin = (elem.type!=="bar_left_repeat" && elem.type!=="bar_thick_thin" && elem.type!=="bar_invisible");
  var thick = (elem.type==="bar_right_repeat" || elem.type==="bar_dbl_repeat" || elem.type==="bar_left_repeat" ||
	       elem.type==="bar_thin_thick" || elem.type==="bar_thick_thin");
  var secondthin = (elem.type==="bar_left_repeat" || elem.type==="bar_thick_thin" || elem.type==="bar_thin_thin" || elem.type==="bar_dbl_repeat");
  var seconddots = (elem.type==="bar_left_repeat" || elem.type==="bar_dbl_repeat");

  // limit positionning of slurs
  if (firstdots || seconddots) {
    for (var slur in this.slurs) {
      if (this.slurs.hasOwnProperty(slur)) {
	this.slurs[slur].endlimitelem = abselem;
      }
    }
    this.startlimitelem = abselem;
  }

  if (firstdots) {
    abselem.addRight(new ABCJS.write.RelativeElement("dots.dot", dx, 1, 7));
    abselem.addRight(new ABCJS.write.RelativeElement("dots.dot", dx, 1, 5));
    dx+=6; //2 hardcoded, twice;
  }

  if (firstthin) {
    anchor = new ABCJS.write.RelativeElement(null, dx, 1, 2, {"type": "bar", "pitch2":10, linewidth:0.6});
    abselem.addRight(anchor);
  }

  if (elem.type==="bar_invisible") {
    anchor = new ABCJS.write.RelativeElement(null, dx, 1, 2, {"type": "none", "pitch2":10, linewidth:0.6});
    abselem.addRight(anchor);
  }

  if (elem.decoration) {
    this.printDecoration(elem.decoration, 12, (thick)?3:1, abselem, 0, "down", 2);
  }

  if (thick) {
    dx+=4; //3 hardcoded;    
    anchor = new ABCJS.write.RelativeElement(null, dx, 4, 2, {"type": "bar", "pitch2":10, linewidth:4});
    abselem.addRight(anchor);
    dx+=5;
  }
  
//   if (this.partstartelem && (thick || (firstthin && secondthin))) { // means end of nth part
//     this.partstartelem.anchor2=anchor;
//     this.partstartelem = null;
//   }

  if (this.partstartelem && elem.endEnding) {
    this.partstartelem.anchor2=anchor;
    this.partstartelem = null;
  }

  if (secondthin) {
    dx+=3; //3 hardcoded;
    anchor = new ABCJS.write.RelativeElement(null, dx, 1, 2, {"type": "bar", "pitch2":10, linewidth:0.6});
    abselem.addRight(anchor); // 3 is hardcoded
  }

  if (seconddots) {
    dx+=3; //3 hardcoded;
    abselem.addRight(new ABCJS.write.RelativeElement("dots.dot", dx, 1, 7));
    abselem.addRight(new ABCJS.write.RelativeElement("dots.dot", dx, 1, 5));
  } // 2 is hardcoded

  if (elem.startEnding) {
    this.partstartelem = new ABCJS.write.EndingElem(elem.startEnding, anchor, null);
    this.voice.addOther(this.partstartelem);
  } 

  return abselem;	

};

ABCJS.write.Layout.prototype.printClef = function(elem) {
  var clef = "clefs.G";
  var octave = 0;
  var abselem = new ABCJS.write.AbsoluteElement(elem,0,10);
  switch (elem.type) {
  case "treble": break;
  case "tenor": clef="clefs.C"; break;
  case "alto": clef="clefs.C"; break;
  case "bass": clef="clefs.F"; break;
  case 'treble+8': octave = 1; break;
  case 'tenor+8':clef="clefs.C"; octave = 1; break;
  case 'bass+8': clef="clefs.F"; octave = 1; break;
  case 'alto+8': clef="clefs.C"; octave = 1; break;
  case 'treble-8': octave = -1; break;
  case 'tenor-8':clef="clefs.C"; octave = -1; break;
  case 'bass-8': clef="clefs.F"; octave = -1; break;
  case 'alto-8': clef="clefs.C"; octave = -1; break;
  case 'none': clef=""; break;
  case 'perc': clef="clefs.perc"; break;
  default: abselem.addChild(new ABCJS.write.RelativeElement("clef="+elem.type, 0, 0, 0, {type:"debug"}));
  }    
//  if (elem.verticalPos) {
//    pitch = elem.verticalPos;
//  }
  var dx =10;
  if (clef!=="") {
    abselem.addRight(new ABCJS.write.RelativeElement(clef, dx, this.glyphs.getSymbolWidth(clef), elem.clefPos));
  }
  if (octave!==0) {
    var scale= 2/3;
    var adjustspacing = (this.glyphs.getSymbolWidth(clef)-this.glyphs.getSymbolWidth("8")*scale)/2;
    abselem.addRight(new ABCJS.write.RelativeElement("8", dx+adjustspacing, this.glyphs.getSymbolWidth("8")*scale, (octave>0)?16:-2, {scalex:scale, scaley:scale}));
  }

  if (elem.stafflines===0) {
    this.stafflines = 0;
  } else {
    this.stafflines =elem.stafflines;
  }

  return abselem;
};


ABCJS.write.Layout.prototype.printKeySignature = function(elem) {
  var abselem = new ABCJS.write.AbsoluteElement(elem,0,10);
  var dx = 0;
  if (elem.accidentals) {
	  window.ABCJS.parse.each(elem.accidentals, function(acc) {
		var symbol = (acc.acc === "sharp") ? "accidentals.sharp" : (acc.acc === "natural") ? "accidentals.nat" : "accidentals.flat";
		//var notes = { 'A': 5, 'B': 6, 'C': 0, 'D': 1, 'E': 2, 'F': 3, 'G':4, 'a': 12, 'b': 13, 'c': 7, 'd': 8, 'e': 9, 'f': 10, 'g':11 };
		abselem.addRight(new ABCJS.write.RelativeElement(symbol, dx, this.glyphs.getSymbolWidth(symbol), acc.verticalPos));
		dx += this.glyphs.getSymbolWidth(symbol)+2;
	  }, this);
  }
  this.startlimitelem = abselem; // limit ties here
  return abselem;
};

ABCJS.write.Layout.prototype.printTimeSignature= function(elem) {

  var abselem = new ABCJS.write.AbsoluteElement(elem,0,20);
  if (elem.type === "specified") {
    //TODO make the alignment for time signatures centered
    for (var i = 0; i < elem.value.length; i++) {
      if (i !== 0)
        abselem.addRight(new ABCJS.write.RelativeElement('+', i*20-9, this.glyphs.getSymbolWidth("+"), 7));
      if (elem.value[i].den) {
        abselem.addRight(new ABCJS.write.RelativeElement(elem.value[i].num, i*20, this.glyphs.getSymbolWidth(elem.value[i].num.charAt(0))*elem.value[i].num.length, 9));
        abselem.addRight(new ABCJS.write.RelativeElement(elem.value[i].den, i*20, this.glyphs.getSymbolWidth(elem.value[i].den.charAt(0))*elem.value[i].den.length, 5));
      } else {
        abselem.addRight(new ABCJS.write.RelativeElement(elem.value[i].num, i*20, this.glyphs.getSymbolWidth(elem.value[i].num.charAt(0))*elem.value[i].num.length, 7));
      }
    }
  } else if (elem.type === "common_time") {
    abselem.addRight(new ABCJS.write.RelativeElement("timesig.common", 0, this.glyphs.getSymbolWidth("timesig.common"), 7));
    
  } else if (elem.type === "cut_time") {
    abselem.addRight(new ABCJS.write.RelativeElement("timesig.cut", 0, this.glyphs.getSymbolWidth("timesig.cut"), 7));
  }
  this.startlimitelem = abselem; // limit ties here
  return abselem;
};
//    abc_write.js: Prints an abc file parsed by abc_parse.js
//    Copyright (C) 2010 Gregory Dyke (gregdyke at gmail dot com)
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.


/*global window, ABCJS, Math */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.write)
	window.ABCJS.write = {};

ABCJS.write.spacing = function() {};
ABCJS.write.spacing.FONTEM = 360;
ABCJS.write.spacing.FONTSIZE = 30;
ABCJS.write.spacing.STEP = ABCJS.write.spacing.FONTSIZE*93/720;
ABCJS.write.spacing.SPACE = 10;
ABCJS.write.spacing.TOPNOTE = 20;
ABCJS.write.spacing.STAVEHEIGHT = 100;


//--------------------------------------------------------------------PRINTER

ABCJS.write.Printer = function(paper, params) {
  params = params || {};
  this.y = 0;
  this.paper = paper;
  this.space = 3*ABCJS.write.spacing.SPACE;
  this.glyphs = new ABCJS.write.Glyphs();
  this.listeners = [];
  this.selected = [];
  this.ingroup = false;
  this.scale = params.scale || 1;
  this.staffwidth = params.staffwidth || 740;
  this.paddingtop = params.paddingtop || 15;
  this.paddingbottom = params.paddingbottom || 30;
  this.paddingright = params.paddingright || 50;
  this.paddingleft = params.paddingleft || 15;
  this.editable = params.editable || false;
};

// notify all listeners that a graphical element has been selected
ABCJS.write.Printer.prototype.notifySelect = function (abselem) {
  this.clearSelection();
  this.selected = [abselem];
  abselem.highlight();
  for (var i=0; i<this.listeners.length;i++) {
    this.listeners[i].highlight(abselem.abcelem);
  }
};

ABCJS.write.Printer.prototype.notifyChange = function (abselem) {
  for (var i=0; i<this.listeners.length;i++) {
    this.listeners[i].modelChanged();
  }
};

ABCJS.write.Printer.prototype.clearSelection = function () {
  for (var i=0;i<this.selected.length;i++) {
    this.selected[i].unhighlight();
  }
  this.selected = [];
};

ABCJS.write.Printer.prototype.addSelectListener = function (listener) {
  this.listeners[this.listeners.length] = listener;
};

ABCJS.write.Printer.prototype.rangeHighlight = function(start,end)
{
    this.clearSelection();
    for (var line=0;line<this.staffgroups.length; line++) {
	var voices = this.staffgroups[line].voices;
	for (var voice=0;voice<voices.length;voice++) {
	    var elems = voices[voice].children;
	    for (var elem=0; elem<elems.length; elem++) {
		// Since the user can highlight more than an element, or part of an element, a hit is if any of the endpoints
		// is inside the other range.
		var elStart = elems[elem].abcelem.startChar;
		var elEnd = elems[elem].abcelem.endChar;
		if ((end>elStart && start<elEnd) || ((end===start) && end===elEnd)) {
		    //		if (elems[elem].abcelem.startChar>=start && elems[elem].abcelem.endChar<=end) {
		    this.selected[this.selected.length]=elems[elem];
		    elems[elem].highlight();
		}
	    }
	}
    }
};

ABCJS.write.Printer.prototype.beginGroup = function () {
  this.path = [];
  this.lastM = [0,0];
  this.ingroup = true;
};

ABCJS.write.Printer.prototype.addPath = function (path) {
  path = path || [];
  if (path.length===0) return;
  path[0][0]="m";
  path[0][1]-=this.lastM[0];
  path[0][2]-=this.lastM[1];
  this.lastM[0]+=path[0][1];
  this.lastM[1]+=path[0][2];
  this.path.push(path[0]);
  for (var i=1,ii=path.length;i<ii;i++) {
    if (path[i][0]==="m") {
      this.lastM[0]+=path[i][1];
      this.lastM[1]+=path[i][2];
    }
    this.path.push(path[i]);
  }
};

ABCJS.write.Printer.prototype.endGroup = function () {
  this.ingroup = false;
  if (this.path.length===0) return null;
  var ret = this.paper.path().attr({path:this.path, stroke:"none", fill:"#000000"});
  if (this.scale!==1) {
    ret.scale(this.scale, this.scale, 0, 0);
  }
  return ret;
};

ABCJS.write.Printer.prototype.printStaveLine = function (x1,x2, pitch) {
  var isIE=/*@cc_on!@*/false;//IE detector
  var dy = 0.35;
  var fill = "#000000";
  if (isIE) {
    dy = 1;
    fill = "#666666";
  }
  var y = this.calcY(pitch);
  var pathString = ABCJS.write.sprintf("M %f %f L %f %f L %f %f L %f %f z", x1, y-dy, x2, y-dy,
			   x2, y+dy, x1, y+dy);
  var ret = this.paper.path().attr({path:pathString, stroke:"none", fill:fill}).toBack();
  if (this.scale!==1) {
    ret.scale(this.scale, this.scale, 0, 0);
  }
  return ret;
};

ABCJS.write.Printer.prototype.printStem = function (x, dx, y1, y2) {
  if (dx<0) { // correct path "handedness" for intersection with other elements
    var tmp = y2;
    y2 = y1;
    y1 = tmp;
  }
  var isIE=/*@cc_on!@*/false;//IE detector
  var fill = "#000000";
  if (isIE && dx<1) {
    dx = 1;
    fill = "#666666";
  }
  if (~~x === x) x+=0.05; // raphael does weird rounding (for VML)
  var pathArray = [["M",x,y1],["L", x, y2],["L", x+dx, y2],["L",x+dx,y1],["z"]];
  if (!isIE && this.ingroup) {
    this.addPath(pathArray);
  } else {
    var ret = this.paper.path().attr({path:pathArray, stroke:"none", fill:fill}).toBack();
    if (this.scale!==1) {
      ret.scale(this.scale, this.scale, 0, 0);
    }
    return ret;
  }
};

ABCJS.write.Printer.prototype.printText = function (x, offset, text, anchor) {
  anchor = anchor || "start";
  var ret = this.paper.text(x, this.calcY(offset), text).attr({"text-anchor":anchor, "font-size":12});
  if (this.scale!==1) {
    ret.scale(this.scale, this.scale, 0, 0);
  }
  return ret;
};

// assumes this.y is set appropriately
// if symbol is a multichar string without a . (as in scripts.staccato) 1 symbol per char is assumed
// not scaled if not in printgroup
ABCJS.write.Printer.prototype.printSymbol = function(x, offset, symbol, scalex, scaley) {
	var el;
  if (!symbol) return null;
  if (symbol.length>0 && symbol.indexOf(".")<0) {
    var elemset = this.paper.set();
    var dx =0;
    for (var i=0; i<symbol.length; i++) {
      var ycorr = this.glyphs.getYCorr(symbol.charAt(i));
      el = this.glyphs.printSymbol(x+dx, this.calcY(offset+ycorr), symbol.charAt(i), this.paper);
      if (el) {
	elemset.push(el);
	dx+=this.glyphs.getSymbolWidth(symbol.charAt(i));
      } else {
	this.debugMsg(x,"no symbol:" +symbol);
      }
    }
    if (this.scale!==1) {
      elemset.scale(this.scale, this.scale, 0, 0);
    }
    return elemset;
  } else {
    var ycorr = this.glyphs.getYCorr(symbol);
    if (this.ingroup) {
      this.addPath(this.glyphs.getPathForSymbol(x, this.calcY(offset+ycorr), symbol, scalex, scaley));
    } else {
      el = this.glyphs.printSymbol(x, this.calcY(offset+ycorr), symbol, this.paper);
      if (el) {
	if (this.scale!==1) {
	  el.scale(this.scale, this.scale, 0, 0);
	}
	return el;
      } else
	this.debugMsg(x,"no symbol:" +symbol);
    }
    return null;    
  }
};

ABCJS.write.Printer.prototype.printPath = function (attrs) {
  var ret = this.paper.path().attr(attrs);
  if (this.scale!==1) ret.scale(this.scale, this.scale, 0, 0);
  return ret;
};

ABCJS.write.Printer.prototype.drawArc = function(x1, x2, pitch1, pitch2, above) {


  x1 = x1 + 6;
  x2 = x2 + 4;
  pitch1 = pitch1 + ((above)?1.5:-1.5);
  pitch2 = pitch2 + ((above)?1.5:-1.5);
  var y1 = this.calcY(pitch1);
  var y2 = this.calcY(pitch2);

  //unit direction vector
  var dx = x2-x1;
  var dy = y2-y1;
  var norm= Math.sqrt(dx*dx+dy*dy);
  var ux = dx/norm;
  var uy = dy/norm;

  var flatten = norm/3.5;
  var curve = ((above)?-1:1)*Math.min(25, Math.max(4, flatten));

  var controlx1 = x1+flatten*ux-curve*uy;
  var controly1 = y1+flatten*uy+curve*ux;
  var controlx2 = x2-flatten*ux-curve*uy;
  var controly2 = y2-flatten*uy+curve*ux;
  var thickness = 2;
  var pathString = ABCJS.write.sprintf("M %f %f C %f %f %f %f %f %f C %f %f %f %f %f %f z", x1, y1,
			   controlx1, controly1, controlx2, controly2, x2, y2, 
			   controlx2-thickness*uy, controly2+thickness*ux, controlx1-thickness*uy, controly1+thickness*ux, x1, y1);
  var ret = this.paper.path().attr({path:pathString, stroke:"none", fill:"#000000"});
  if (this.scale!==1) {
    ret.scale(this.scale, this.scale, 0, 0);
  }
  return ret;
};

ABCJS.write.Printer.prototype.debugMsg = function(x, msg) {
  return this.paper.text(x, this.y, msg).scale(this.scale, this.scale, 0, 0);
};

ABCJS.write.Printer.prototype.debugMsgLow = function(x, msg) {
    return this.paper.text(x, this.calcY(this.layouter.minY-7), msg).attr({"font-family":"serif", "font-size":12, "text-anchor":"begin"}).scale(this.scale, this.scale, 0, 0);
};

ABCJS.write.Printer.prototype.printLyrics = function(x, msg) {
    var el = this.paper.text(x, this.calcY(this.layouter.minY-7), msg).attr({"font-family":"Times New Roman", "font-weight":'bold', "font-size":14, "text-anchor":"begin"}).scale(this.scale, this.scale, 0, 0);
    el[0].setAttribute("class", "abc-lyric");
    return el;
};

ABCJS.write.Printer.prototype.calcY = function(ofs) {
  return this.y+((ABCJS.write.spacing.TOPNOTE-ofs)*ABCJS.write.spacing.STEP);
};

ABCJS.write.Printer.prototype.printStave = function (startx, endx, numLines) {	// PER: print out requested number of lines
	// If there is one line, it is the B line. Otherwise, the bottom line is the E line.
	if (numLines === 1) {
		this.printStaveLine(startx,endx,6);
		return;
	}
	for (var i = 0; i < numLines; i++) {
		this.printStaveLine(startx,endx,(i+1)*2);
	}
//  this.printStaveLine(startx,endx,2);
//  this.printStaveLine(startx,endx,4);
//  this.printStaveLine(startx,endx,6);
//  this.printStaveLine(startx,endx,8);
//  this.printStaveLine(startx,endx,10);
};

ABCJS.write.Printer.prototype.printABC = function(abctunes) {
  if (abctunes[0]===undefined) {
    abctunes = [abctunes];
  }
  this.y=0;

  for (var i = 0; i < abctunes.length; i++) {
    this.printTune(abctunes[i]);
  }

};

ABCJS.write.Printer.prototype.printTempo = function (tempo, paper, layouter, y, printer, x) {
	if (tempo.preString) {
		var text = paper.text(x, y + 20, tempo.preString).attr({"text-anchor":"start"});
		x += (text.getBBox().width + 10);
	}
	if (tempo.duration) {
		var temposcale = 0.75;
		var tempopitch = 14.5;
		var duration = tempo.duration[0]; // TODO when multiple durations
		var abselem = new ABCJS.write.AbsoluteElement(tempo, duration, 1);
		var durlog = Math.floor(Math.log(duration) / Math.log(2));
		var dot = 0;
		for (var tot = Math.pow(2, durlog), inc = tot / 2; tot < duration; dot++, tot += inc, inc /= 2);
		var c = layouter.chartable.note[-durlog];
		var flag = layouter.chartable.uflags[-durlog];
		var temponote = layouter.printNoteHead(abselem,
				c,
				{verticalPos:tempopitch},
				"up",
				0,
				0,
				flag,
				dot,
				0,
				temposcale
		);
		abselem.addHead(temponote);
		if (duration < 1) {
			var p1 = tempopitch + 1 / 3 * temposcale;
			var p2 = tempopitch + 7 * temposcale;
			var dx = temponote.dx + temponote.w;
			var width = -0.6;
			abselem.addExtra(new ABCJS.write.RelativeElement(null, dx, 0, p1, {"type":"stem", "pitch2":p2, linewidth:width}));
		}
		abselem.x = x;
		abselem.draw(printer, null);
		x += (abselem.w + 5);
		text = paper.text(x, y + 20, "= " + tempo.bpm).attr({"text-anchor":"start"});
		x += text.getBBox().width + 10;
	}
	if (tempo.postString) {
		paper.text(x, y + 20, tempo.postString).attr({"text-anchor":"start"});
	}
	y += 15;
	return y;
};

ABCJS.write.Printer.prototype.printTune = function (abctune) {
  this.layouter = new ABCJS.write.Layout(this.glyphs, abctune.formatting.bagpipes);
	this.layouter.printer = this;	// TODO-PER: this is a hack to get access, but it tightens the coupling.
  if (abctune.media === 'print') {
       // TODO create the page the size of
    //  tune.formatting.pageheight by tune.formatting.pagewidth
       // create margins the size of
      // TODO-PER: setting the defaults to 3/4" for now. What is the real value?
    var m = abctune.formatting.topmargin === undefined ? 54 : abctune.formatting.topmargin;
    this.y+=m;
    // TODO tune.formatting.botmargin
//    m = abctune.formatting.leftmargin === undefined ? 54 : abctune.formatting.leftmargin;
//    this.paddingleft = m;
//      m = abctune.formatting.rightmargin === undefined ? 54 : abctune.formatting.rightmargin;
//    this.paddingright = m;
  }
    else
      this.y+=this.paddingtop;
  // FIXED BELOW, NEEDS CHECKING if (abctune.formatting.stretchlast) { this.paper.text(200, this.y, "Format: stretchlast"); this.y += 20; }
  if (abctune.formatting.staffwidth) { 
    this.width=abctune.formatting.staffwidth; 
  } else {
    this.width=this.staffwidth;
  }
  this.width+=this.paddingleft;
  if (abctune.formatting.scale) { this.scale=abctune.formatting.scale; }
  this.paper.text(this.width/2, this.y, abctune.metaText.title).attr({"font-size":20, "font-family":"serif"});
  this.y+=20;
  if (abctune.lines[0] && abctune.lines[0].subtitle) {
    this.printSubtitleLine(abctune.lines[0]);
    this.y+=20;
  }
  if (abctune.metaText.rhythm) {
    this.paper.text(this.paddingleft, this.y, abctune.metaText.rhythm).attr({"text-anchor":"start","font-style":"italic","font-family":"serif", "font-size":12}); 
    !(abctune.metaText.author || abctune.metaText.origin || abctune.metaText.composer) && (this.y+=15);
  }
  if (abctune.metaText.author) {this.paper.text(this.width, this.y, abctune.metaText.author).attr({"text-anchor":"end","font-style":"italic","font-family":"serif", "font-size":12}); this.y+=15;}
  if (abctune.metaText.origin) {this.paper.text(this.width, this.y, "(" + abctune.metaText.origin + ")").attr({"text-anchor":"end","font-style":"italic","font-family":"serif", "font-size":12});this.y+=15;}
  if (abctune.metaText.composer) {this.paper.text(this.width, this.y, abctune.metaText.composer).attr({"text-anchor":"end","font-style":"italic","font-family":"serif", "font-size":12});this.y+=15;}
  if (abctune.metaText.tempo && !abctune.metaText.tempo.suppress) {
	  this.y = this.printTempo(abctune.metaText.tempo, this.paper, this.layouter, this.y, this, 50);
  }
  this.staffgroups = [];
  var maxwidth = this.width;
  for(var line=0; line<abctune.lines.length; line++) {
    var abcline = abctune.lines[line];
    if (abcline.staff) {
      var staffgroup = this.layouter.printABCLine(abcline.staff);
      var newspace = this.space;
      for (var it=0;it<3;it++) { // TODO shouldn't need this triple pass any more
	staffgroup.layout(newspace,this, false);
	if (line && line===abctune.lines.length-1 && staffgroup.w/this.width<0.66 && !abctune.formatting.stretchlast) break; // don't stretch last line too much unless it is 1st
	var relspace = staffgroup.spacingunits*newspace;
	var constspace = staffgroup.w-relspace;
	if (staffgroup.spacingunits>0) {
	  newspace = (this.width-constspace)/staffgroup.spacingunits;
	  if (newspace*staffgroup.minspace>50) {
	    newspace = 50/staffgroup.minspace;
	  }
	}
      }
      staffgroup.draw(this,this.y);
      if (staffgroup.w>maxwidth) maxwidth = staffgroup.w;
      this.staffgroups[this.staffgroups.length] = staffgroup;
      this.y = staffgroup.y+staffgroup.height;
      this.y+=ABCJS.write.spacing.STAVEHEIGHT*0.2;
    } else if (abcline.subtitle && line!==0) {
      this.printSubtitleLine(abcline);
      this.y+=20; //hardcoded
    } else if (abcline.text) {
		if (typeof abcline.text === 'string')
	      this.paper.text(100, this.y, "TEXT: " + abcline.text);
	  else {
		  var str = "";
		  for (var i = 0; i < abcline.text.length; i++) {
			  str += " FONT " + abcline.text[i].text;
		  }
	      this.paper.text(100, this.y, "TEXT: " + str);
	  }
      this.y+=20; //hardcoded
    }
  }
  var extraText = "";	// TODO-PER: This is just an easy way to display this info for now.
  if (abctune.metaText.partOrder) extraText += "Part Order: " + abctune.metaText.partOrder + "\n";
  if (abctune.metaText.notes) extraText += "Notes:\n" + abctune.metaText.notes + "\n";
  if (abctune.metaText.book) extraText += "Book: " + abctune.metaText.book + "\n";
  if (abctune.metaText.source) extraText += "Source: " + abctune.metaText.source + "\n";
  if (abctune.metaText.transcription) extraText += "Transcription: " + abctune.metaText.transcription + "\n";
  if (abctune.metaText.discography) extraText += "Discography: " + abctune.metaText.discography + "\n";
  if (abctune.metaText.history) extraText += "History: " + abctune.metaText.history + "\n";
  if (abctune.metaText.unalignedWords) {
    extraText += "Words:\n";
    for (var j = 0; j < abctune.metaText.unalignedWords.length; j++) {
      if (typeof abctune.metaText.unalignedWords[j] === 'string')
        extraText += abctune.metaText.unalignedWords[j] + "\n";
      else {
        for (var k = 0; k < abctune.metaText.unalignedWords[j].length; k++) {
          extraText += " FONT " + abctune.metaText.unalignedWords[j][k].text;
	    }
        extraText += "\n";
	  }
	}
  }
  var text2 = this.paper.text(this.paddingleft, this.y+25, extraText).attr({"text-anchor":"start", "font-family":"serif", "font-size":13});
  var height = text2.getBBox().height;
  text2.translate(0,height/2);
  this.y+=25+height;
  var sizetoset = {w: maxwidth*this.scale+this.paddingright,h: this.y*this.scale+this.paddingbottom};
  this.paper.setSize(sizetoset.w,sizetoset.h);
  // Correct for IE problem in calculating height
  var isIE=/*@cc_on!@*/false;//IE detector
  if (isIE) {
    this.paper.canvas.parentNode.style.width=sizetoset.w+"px";
    this.paper.canvas.parentNode.style.height=""+sizetoset.h+"px";
  } else
    this.paper.canvas.parentNode.setAttribute("style","width:"+sizetoset.w+"px");
};

ABCJS.write.Printer.prototype.printSubtitleLine = function(abcline) {
  this.paper.text(this.width/2, this.y, abcline.subtitle).attr({"font-size":16}).scale(this.scale, this.scale, 0,0);
};


/**
 * sprintf() for JavaScript v.0.4
 *
 * Copyright (c) 2007 Alexandru Marasteanu <http://alexei.417.ro/>
 * Thanks to David Baird (unit test and patch).
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program; if not, write to the Free Software Foundation, Inc., 59 Temple
 * Place, Suite 330, Boston, MA 02111-1307 USA
 */

//function str_repeat(i, m) { for (var o = []; m > 0; o[--m] = i); return(o.join('')); }

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.write)
	window.ABCJS.write = {};

ABCJS.write.sprintf = function() {
  var i = 0, a, f = arguments[i++], o = [], m, p, c, x;
  while (f) {
    if (m = /^[^\x25]+/.exec(f)) o.push(m[0]);
    else if (m = /^\x25{2}/.exec(f)) o.push('%');
    else if (m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f)) {
      if (((a = arguments[m[1] || i++]) == null) || (a == undefined)) throw("Too few arguments.");
      if (/[^s]/.test(m[7]) && (typeof(a) != 'number'))
        throw("Expecting number but found " + typeof(a));
      switch (m[7]) {
        case 'b': a = a.toString(2); break;
        case 'c': a = String.fromCharCode(a); break;
        case 'd': a = parseInt(a); break;
        case 'e': a = m[6] ? a.toExponential(m[6]) : a.toExponential(); break;
        case 'f': a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a); break;
        case 'o': a = a.toString(8); break;
        case 's': a = ((a = String(a)) && m[6] ? a.substring(0, m[6]) : a); break;
        case 'u': a = Math.abs(a); break;
        case 'x': a = a.toString(16); break;
        case 'X': a = a.toString(16).toUpperCase(); break;
      }
      a = (/[def]/.test(m[7]) && m[2] && a > 0 ? '+' + a : a);
      c = m[3] ? m[3] == '0' ? '0' : m[3].charAt(1) : ' ';
      x = m[5] - String(a).length;
      p = m[5] ? str_repeat(c, x) : '';
      o.push(m[4] ? a + p : p + a);
    }
    else throw ("Huh ?!");
    f = f.substring(m[0].length);
  }
  return o.join('');
};
