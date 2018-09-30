var LiveTracker = (function() {
  var svg,
    svgns = "http://www.w3.org/2000/svg",
    stopsOn,
    stopsOff,
    radialOff,
    radialOn,
    itemWidth = 191,
    itemHeight = 129,
    itemOffset = 48,
    steps = [],
    masks = [];

  function LiveTracker(options) {
    svg = generateSvg(options);
    stopsOn = [stop(0, "#b70500"), stop(1, "#ce0000")];
    stopsOff = [stop(0, "#252525"), stop(1, "#555555")];
    radialOff = radialGradient("rOffId");
    radialOn = radialGradient("rOnId");

    radialOn.appendChild(stopsOn[0]);
    radialOn.appendChild(stopsOn[1]);
    radialOff.appendChild(stopsOff[0]);
    radialOff.appendChild(stopsOff[1]);

    var defs = gdef();
    defs.appendChild(radialOn);
    defs.appendChild(radialOff);
    masks = generateMasks(defs, options.steps);
    steps = generateSteps(svg, options.steps);
    svg.innerHTML = "";
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
    paths[1].style.fill = "#f00";
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
    for (var i = 0; i <= steps.length - 1; i++) {
      var maskOn = mask("mOnId" + i);
      var maskOff = mask("mOffId" + i);
      maskOn.appendChild(rect(0, 0, "#fff", 0, itemHeight));
      maskOff.appendChild(rect(0, 0, "#fff", itemWidth, itemHeight));
      defs.appendChild(maskOn);
      defs.appendChild(maskOff);
      list.push([maskOn, maskOff]);
    }
    return list;
  }

  function generateSteps(svg, steps) {
    var list = [];
    for (var i = 0; i <= steps.length - 1; i++) {
      var step = g(steps[i].title);
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
          "url(#rOnId)",
          "mask: url(#mOnId" + i + ")",
          dg(),
          5,
          "#ce0000"
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
    return pos === 0 ? 50 : itemWidth * pos - itemOffset * pos + 50;
  }

  function generateSvg(options) {
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

  function stop(offset, color) {
    var stop = document.createElementNS(svgns, "stop");
    stop.setAttributeNS(null, "offset", offset);
    stop.setAttributeNS(null, "stop-color", color);
    return stop;
  }

  function mask(id) {
    var mask = document.createElementNS(svgns, "mask");
    mask.setAttributeNS(null, "id", id);
    return mask;
  }

  function g(title) {
    var g = document.createElementNS(svgns, "g");
    g.setAttributeNS(null, "id", title);
    var t = document.createElementNS(svgns, "title");
    t.innerHTML = title;
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
