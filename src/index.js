var LiveTracker = (function() {
  var svg,
    options,
    svgns = "http://www.w3.org/2000/svg",
    itemWidth = 191,
    itemHeight = 129,
    itemOffset = 48,
    steps = [],
    masks = [];

  function LiveTracker(opts) {
    options = opts || {};
    console.log(options);
    svg = generateSvg();

    var defs = gdef();
    masks = generateMasks(defs, options.steps);
    steps = generateSteps(svg, options.steps);
    options.render.innerHTML = "";
    svg.appendChild(defs);
    options.render.appendChild(svg);
  }

  //define

  LiveTracker.prototype.setActive = function(pos) {
    var active = steps[pos];
    var paths = active.getElementsByTagName("path");
    var t = paths[0].getAttribute("transform").match(/.\((.*),(.*)\).*/);
    paths[0].setAttribute(
      "transform",
      "translate(" + (t[1] - 25) + ", 0) scale(1.2)"
    );
    paths[1].setAttribute(
      "transform",
      "translate(" + (t[1] - 25) + ", 0) scale(1.2)"
    );
    var aColor = active.getAttribute("data-active-color");
    paths[1].style.fill = aColor ? aColor : "#ff0000";
    active.remove();
    svg.appendChild(active);
  };

  LiveTracker.prototype.setProgress = function(pos, percentage) {
    percentage = parseInt(percentage, 10);
    var active = masks[pos];
    var rOn = active[0].getElementsByTagName("rect")[0];
    var rOff = active[1].getElementsByTagName("rect")[0];
    var p = (itemWidth * percentage) / 100;
    rOn.setAttribute("width", p);
  };

  function generateMasks(defs, steps) {
    var list = [];
    var stopsOff = [stop(0, "#252525"), stop(1, "#555555")];
    radialOff = radialGradient("rOffId");
    radialOff.appendChild(stopsOff[0]);
    radialOff.appendChild(stopsOff[1]);
    for (var i = 0; i <= steps.length - 1; i++) {
      var maskOn = mask("mOnId" + i);
      var maskOff = mask("mOffId" + i);
      maskOn.appendChild(rect(0, 0, "#fff", 0, itemHeight));
      maskOff.appendChild(rect(0, 0, "#fff", itemWidth, itemHeight));
      var border = steps[i].borderColor;
      var stopsOn = [
        stop(0, border ? border[0] : "#b70500"),
        stop(1, border ? border[1] : "#ce0000", true)
      ];
      radialOn = radialGradient("rOnId" + i);
      radialOn.appendChild(stopsOn[0]);
      radialOn.appendChild(stopsOn[1]);
      defs.appendChild(radialOn);
      defs.appendChild(radialOff);
      defs.appendChild(maskOn);
      defs.appendChild(maskOff);
      list.push([maskOn, maskOff]);
    }
    return list;
  }

  function generateSteps(svg, steps) {
    var list = [];
    for (var i = 0; i <= steps.length - 1; i++) {
      var step = g(steps[i]);
      step.appendChild(
        path(
          i + "s1",
          "translate(" + translateItem(i) + ", 10)",
          "url(#rOffId)",
          "mask: url(#mOffId" + i + ")",
          dg(),
          5,
          "#222"
        )
      );
      step.appendChild(
        path(
          i + "s2",
          "translate(" + translateItem(i) + ", 10)",
          "url(#rOnId" + i + ")",
          "mask: url(#mOnId" + i + ")",
          dg(),
          5,
          steps[i].color ? steps[i].color : "#ce0000"
        )
      );
      if (steps[i].iconSvg) {
        var fill = steps[i].iconFill ? steps[i].iconFill : "#fff";
        step.appendChild(
          ico(
            i + "sic1",
            "translate(" +
              (translateItem(i) + (itemWidth / 2 - itemOffset / 2)) +
              ", 40)",
            steps[i].iconSvg,
            fill
          )
        );
      }
      svg.appendChild(step);
      list.push(step);
    }
    return list;
  }

  function translateItem(pos) {
    return pos === 0 ? 39 : (itemWidth - itemOffset - 1) * pos + 39;
  }

  function generateSvg() {
    var svg = document.createElementNS(svgns, "svg");
    svg.setAttributeNS(null, "width", options.steps.length * itemWidth);
    svg.setAttributeNS(null, "height", itemHeight);
    return svg;
  }

  function dg() {
    return "m6.00001,6.00002l135.74993,0l45.25006,48.49989l-45.25006,48.5001l-135.74993,0l45.25004,-48.5001l-45.25004,-48.49989z";
  }

  function gdef() {
    return document.createElementNS(svgns, "defs");
  }

  function radialGradient(id) {
    var gradient = document.createElementNS(svgns, "radialGradient");
    gradient.setAttributeNS(null, "cx", 0.5);
    gradient.setAttributeNS(null, "cy", 0.5);
    gradient.setAttributeNS(
      null,
      "gradientTransform",
      "rotate(32,0.5,0.5) translate(0,0.25) scale(1,0.5)"
    );
    gradient.setAttributeNS(null, "r", 1.36047);
    gradient.setAttributeNS(null, "spreadMethod", "pad");
    gradient.setAttributeNS(null, "id", id);

    return gradient;
  }

  function stop(offset, color, opacity) {
    var stop = document.createElementNS(svgns, "stop");
    stop.setAttributeNS(null, "offset", offset);
    stop.setAttributeNS(null, "stop-color", color);
    stop.setAttributeNS(null, "stop-opacity", !opacity ? 1 : 1);
    return stop;
  }

  function mask(id) {
    var mask = document.createElementNS(svgns, "mask");
    mask.setAttributeNS(null, "id", id);
    return mask;
  }

  function g(step) {
    var g = document.createElementNS(svgns, "g");
    g.setAttributeNS(null, "id", step.title);
    g.setAttributeNS(null, "data-active-color", step.activeColor);
    var t = document.createElementNS(svgns, "title");
    t.innerHTML = step.title;
    g.appendChild(t);
    return g;
  }

  function path(id, transform, stroke, style, d, strokeWidth, fill) {
    var path = document.createElementNS(svgns, "path");
    path.setAttributeNS(null, "transform", transform);
    path.setAttributeNS(null, "stroke", stroke);
    path.setAttributeNS(null, "style", style);
    path.setAttributeNS(null, "d", d);
    path.setAttributeNS(null, "stroke-width", strokeWidth);
    path.setAttributeNS(null, "fill", fill);
    path.setAttributeNS(null, "id", id);
    return path;
  }

  function ico(id, transform, d, fill) {
    var path = document.createElementNS(svgns, "path");
    path.setAttributeNS(null, "transform", transform);
    path.setAttributeNS(null, "stroke-width", 0);
    path.setAttributeNS(null, "d", d);
    path.setAttributeNS(null, "fill", fill);
    path.setAttributeNS(null, "id", id);
    return path;
  }

  function rect(x, y, fill, width, height) {
    var rect = document.createElementNS(svgns, "rect");
    rect.setAttributeNS(null, "x", x);
    rect.setAttributeNS(null, "y", y);
    rect.setAttributeNS(null, "fill", fill);
    rect.setAttributeNS(null, "width", width);
    rect.setAttributeNS(null, "height", height);
    return rect;
  }

  return LiveTracker;
})();

var livet = new LiveTracker({
  render: document.getElementsByClassName("container")[0],
  steps: [
    {
      color: "#C2185B",
      borderColor: ["#E91E63", "#C2185B"],
      iconFill: "#fff",
      iconSvg:
        "m4.4025,6.18959l0,5.98551l7.38868,0l3.61153,13.49626l20.33306,0l6.66673,-20.52016l-31.6101,0l0,1.03822l-6.3899,0l0,0.00016zm16.88255,26.11445c0,2.12476 -1.34302,3.84716 -2.99965,3.84716s-2.99978,-1.72257 -2.99978,-3.84716s1.34302,-3.847 2.99978,-3.847s2.99965,1.7224 2.99965,3.847zm13.8926,0c0,2.12476 -1.34302,3.84716 -2.99965,3.84716s-2.99978,-1.72257 -2.99978,-3.84716s1.34315,-3.847 2.99978,-3.847s2.99965,1.7224 2.99965,3.847z"
    },
    {
      iconFill: "#fff",
      color: "#C2185B",
      borderColor: ["#E91E63", "#C2185B"],
      iconSvg:
        "m19.94896,12.11474c-0.56402,0 -1.0189,0.45326 -1.0189,1.01175l0,9.32934l-6.16644,2.67507c-0.51608,0.22461 -0.75066,0.82154 -0.52424,1.33349c0.16727,0.37941 0.54056,0.60604 0.93323,0.60604c0.13667,0 0.2764,-0.02732 0.40899,-0.086l6.75799,-2.93205c0.0051,-0.00202 0.00918,-0.00405 0.01326,-0.00607l0.00408,-0.00202c0.0153,-0.00607 0.02346,-0.02023 0.03774,-0.02529c0.10607,-0.05261 0.205,-0.11433 0.28456,-0.19729c0.03468,-0.0344 0.05406,-0.07892 0.08057,-0.11837c0.04896,-0.06475 0.10301,-0.12849 0.13259,-0.2064c0.02448,-0.0607 0.02652,-0.12647 0.03876,-0.19122c0.01326,-0.06475 0.03876,-0.12242 0.03876,-0.18819l0,-9.99204c0,-0.55747 -0.45692,-1.01074 -1.02094,-1.01074zm15.93727,1.72706c0,-3.87702 -3.16685,-7.01952 -7.07621,-7.01952c-1.97661,0 -3.75943,0.80535 -5.03841,2.1014c-1.22084,-0.32275 -2.49778,-0.51093 -3.82164,-0.51093c-1.36057,0 -2.67219,0.19729 -3.92363,0.53724c-1.28408,-1.31022 -3.07608,-2.12771 -5.0639,-2.12771c-3.90833,0 -7.07621,3.14249 -7.07621,7.01952c0,1.86668 0.74046,3.55832 1.93887,4.81593c-0.45182,1.40633 -0.69865,2.90372 -0.69865,4.45979c0,8.12131 6.63662,14.70477 14.82352,14.70477c8.1869,0 14.82352,-6.58345 14.82352,-14.70477c0,-1.59351 -0.26416,-3.12327 -0.73638,-4.56097c1.14639,-1.24546 1.84912,-2.89664 1.84912,-4.71475zm-15.93625,20.94422c-6.48771,0 -11.76376,-5.23479 -11.76376,-11.66851c0,-6.43473 5.27605,-11.66952 11.76376,-11.66952c6.48771,0 11.76274,5.23378 11.76274,11.66952c0,6.43574 -5.27707,11.66851 -11.76274,11.66851z"
    },
    {
      iconFill: "#fff",
      color: "#4A148C",
      borderColor: ["#6A1B9A", "#4A148C"],
      iconSvg:
        "m21.53613,11.12413c0.53452,-0.93254 1.51247,-2.14734 -0.16777,-2.4404c-0.46805,-0.23148 -0.93625,-0.64108 -1.40369,-0.18479c-1.04005,0.39582 -1.94164,0.94936 -0.84771,1.98532c0.4851,0.66902 0.92632,2.12877 1.47582,2.28954c0.32796,-0.54256 0.63519,-1.09652 0.94335,-1.64966l0,0zm-2.29763,2.57488c-0.95478,-1.64173 -1.72311,-3.40299 -2.89171,-4.91751c-1.42131,-1.46198 -4.22181,-0.81028 -4.85823,1.07548c-0.84541,1.8644 0.97871,4.09042 3.0437,3.85707c1.56701,0.02528 3.14293,0.09327 4.70625,-0.01503zm7.93395,0.05542c2.0307,-0.26225 3.1985,-2.72517 2.04229,-4.36049c-1.02459,-1.74518 -3.97229,-1.80602 -5.00135,-0.03253c-0.89106,1.43378 -1.66445,2.93202 -2.48213,4.40511c1.80772,0.09958 3.63244,0.07635 5.44118,-0.01208l0,0zm3.36305,2.09988c0.69228,-0.58685 3.37307,-1.2787 1.34277,-1.83603c-0.50295,-0.1375 -1.08932,-0.76828 -1.54134,-0.59566c-0.98155,1.17572 -2.49078,1.86546 -4.06655,1.79321c-0.30847,0.09769 -1.88184,-0.14857 -1.45673,0.13114c1.11165,0.61067 2.1953,1.27385 3.34514,1.81588c0.80537,-0.41323 1.587,-0.86843 2.37672,-1.30854l0,0zm-15.81622,0.33225c0.59201,-0.33225 1.18402,-0.6645 1.77604,-0.99675c-1.80959,-0.08663 -3.8805,0.16466 -5.24808,-1.23754c-0.38558,-0.41594 -0.75532,-0.89215 -1.28971,-0.36849c-0.64009,0.42484 -2.60893,0.86021 -1.09303,1.37883c1.32001,0.75123 2.63074,1.52078 3.98337,2.21644c0.64455,-0.2912 1.25212,-0.65514 1.87142,-0.99247l0,0zm8.67608,3.70722c0.76718,-0.59386 2.62541,-1.15964 2.68749,-1.7969c-1.73452,-0.9616 -3.41852,-2.03224 -5.23317,-2.84503c-0.62449,-0.22826 -1.13081,0.12296 -1.63347,0.42801c-1.48641,0.85179 -3.00859,1.65072 -4.44663,2.57685c1.8807,1.1204 3.784,2.20768 5.70582,3.26133c0.98023,-0.52968 1.94779,-1.08101 2.91996,-1.62426l0,0zm7.69667,1.85361c0.79591,-0.4838 1.59181,-0.96761 2.38772,-1.45141c-0.00652,-1.62042 0.02035,-3.24151 -0.02567,-4.86136c-1.60637,0.86353 -3.18989,1.77017 -4.74668,2.71424c-0.17027,1.67129 -0.08392,3.37023 -0.04691,5.04994c0.82147,-0.46626 1.62299,-0.96496 2.43153,-1.45141zm-18.66628,-1.02089c0.08084,-1.38127 0.25509,-2.95584 -1.47395,-3.36501c-1.09189,-0.49062 -2.60536,-1.74769 -3.44655,-1.73508c-0.02621,1.55638 -0.01234,3.11305 -0.01517,4.66956c1.61291,0.96971 3.1972,1.9861 4.84492,2.90021c0.15977,-0.80229 0.05533,-1.65277 0.09075,-2.46968zm11.55002,5.34811c0.95401,-0.58025 1.90801,-1.16049 2.86202,-1.74074c-0.00442,-1.67289 0.06738,-3.34818 -0.01109,-5.01928c-1.04846,0.28966 -2.24764,1.185 -3.35225,1.74113c-0.82711,0.46676 -1.65423,0.93353 -2.48135,1.40029c0.01631,1.78624 -0.04459,3.57574 0.06032,5.35933c0.98878,-0.5566 1.95129,-1.15606 2.92234,-1.74074l0,0zm-3.99913,-0.93893c0,-0.89322 0,-1.78644 0,-2.67966c-1.91515,-1.07825 -3.82417,-2.16672 -5.74679,-3.23257c-0.10632,1.70809 -0.04556,3.4226 -0.0616,5.13365c1.91472,1.15492 3.80961,2.34138 5.74855,3.45825c0.07545,-0.89006 0.0479,-1.78722 0.05983,-2.67967zm11.16298,3.59072c0.7805,-0.50071 1.561,-1.00142 2.3415,-1.50214c-0.03257,-1.58749 0.0804,-3.19647 -0.0839,-4.76644c-1.62315,0.89218 -3.18964,1.9079 -4.78386,2.86032c0.0383,1.64253 -0.07864,3.30386 0.09748,4.93236c0.82344,-0.48692 1.62179,-1.01248 2.42878,-1.5241zm-18.73111,-0.88997c-0.00635,-0.83234 -0.01271,-1.66469 -0.01907,-2.49703c-1.61249,-0.97191 -3.20466,-1.97633 -4.84137,-2.91002c-0.10243,1.59464 -0.04405,3.1955 -0.05945,4.79299c1.62669,1.03737 3.23508,2.10223 4.88359,3.10722c0.06316,-0.82858 0.03182,-1.66276 0.0363,-2.49317zm11.60849,5.46981c0.94746,-0.60621 1.89492,-1.21243 2.84238,-1.81864c-0.0022,-1.69035 0.03345,-3.38143 -0.0137,-5.0712c-1.92865,1.14567 -3.8444,2.31242 -5.74602,3.49927c-0.21491,1.6322 -0.07557,3.31505 -0.07588,4.96509c0.59021,0.34634 2.09926,-1.1886 2.99322,-1.57452l0,0zm-4.04036,-0.72361c-0.11457,-1.16555 0.49275,-2.80614 -1.0449,-3.25799c-1.55066,-0.94621 -3.09509,-1.90275 -4.66615,-2.81728c-0.22899,1.60019 0.0105,3.26721 -0.1654,4.88697c1.884,1.3121 3.81724,2.56644 5.78569,3.75768c0.15788,-0.83479 0.05968,-1.71906 0.09076,-2.56939l0,0zm-6.58891,-0.30812c-2.29309,-1.47473 -4.58618,-2.94946 -6.87927,-4.42419c0.0026,-4.55122 -0.06267,-9.10353 0.02117,-13.6539c1.14827,-0.68258 2.37021,-1.24212 3.55195,-1.86837c-0.76328,-2.10503 0.33798,-4.66309 2.55122,-5.45103c1.85532,-0.7334 4.09175,-0.07156 5.2746,1.47237c0.85916,-0.4245 1.71831,-0.84901 2.57747,-1.27351c0.86377,0.42834 1.72754,0.85669 2.59131,1.28503c1.2377,-1.41443 3.35822,-2.22161 5.19583,-1.42892c2.20576,0.74693 3.40806,3.29927 2.61703,5.401c1.19043,0.6475 2.48471,1.15348 3.5762,1.9436c0.04839,4.52426 0.00043,9.04919 -0.00396,13.57373c-4.56269,2.90902 -9.05145,5.92909 -13.68822,8.7275c-1.34829,-0.00035 -2.51207,-1.41073 -3.76319,-1.98256c-1.20957,-0.77042 -2.41609,-1.54528 -3.62216,-2.32076l0.00001,0z"
    },
    {
      iconFill: "#fff",
      color: "#4A148C",
      borderColor: ["#6A1B9A", "#4A148C"],
      activeColor: "#7C4DFF",
      iconSvg:
        "m8.63369,31.39885c-2.4104,-1.15908 -3.21125,-4.60032 -3.24071,-7.46983c-0.32663,-2.12468 1.72713,-3.68739 1.05101,-5.87208c-0.25658,-3.22967 0.54982,-6.42857 1.75482,-9.27453c0.03811,-1.82855 1.27664,-2.53826 2.62605,-2.43417c4.35994,-0.67083 8.79869,-0.68964 13.16029,-0.05585c2.60287,0.58542 4.67718,2.74813 6.87839,4.38166c1.36537,1.22836 2.95934,2.03761 4.33266,3.21824c1.48323,1.51095 2.87669,3.1963 3.90448,5.20063c0.36979,2.00368 0.86617,3.99582 1.12031,6.01275c0.5159,1.88735 -0.54021,3.07449 -1.33912,4.38568c-1.21331,1.78792 -3.50936,2.49341 -5.247,1.53339c-1.20689,-0.53392 -1.65109,-2.80246 -3.02704,-2.64563c-5.18756,-0.0938 -10.37511,-0.1876 -15.56267,-0.2814c-1.20177,1.91225 -2.86333,4.00211 -5.03595,3.70451c-0.47208,-0.04789 -0.93619,-0.19023 -1.37552,-0.40335l0,0z"
    },
    {
      iconFill: "#fff",
      iconSvg:
        "m15.98001,5.6103c-6.35107,0 -11.5,4.19406 -11.5,9.36731c0,5.1745 11.5,22.63268 11.5,22.63268s11.5,-17.45818 11.5,-22.63268c0,-5.17326 -5.1474,-9.36731 -11.5,-9.36731zm0,13.84364c-3.03447,0 -5.49547,-2.00336 -5.49547,-4.47633s2.461,-4.47633 5.49547,-4.47633s5.49547,2.00461 5.49547,4.47633s-2.461,4.47633 -5.49547,4.47633z"
    },
    {
      iconFill: "#fff",
      iconSvg:
        "m3.48439,15.83231l2.79376,-3.50417l7.65345,9.59499l12.75805,-15.99165l2.79474,3.5017l-15.55279,19.4983"
    }
  ]
});
