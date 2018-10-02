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

  LiveTracker.prototype.setActive = function(pos, fold) {
    fold = fold || false;
    var active = steps[pos];
    var paths = active.getElementsByTagName("path");
    var t = paths[0].getAttribute("transform").match(/.\((.*),(.*)\).*/);
    var effect = "translate(" + (t[1] - 25) + ", 0) scale(1.2)";
    var resetEffect = "translate(" + translateItem(pos) + ", 10)";
    paths[0].setAttribute("transform", fold ? resetEffect : effect);
    paths[1].setAttribute("transform", fold ? resetEffect : effect);
    var color =
      active.getAttribute("data-a-color") != "undefined"
        ? active.getAttribute("data-a-color")
        : "#ff0000";
    paths[1].style.fill = fold ? active.getAttribute("data-color") : color;
    if (!fold) {
      active.remove();
      svg.appendChild(active);
    }
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
    g.setAttributeNS(null, "data-a-color", step.activeColor);
    g.setAttributeNS(null, "data-color", step.color ? step.color : "#ce0000");
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
