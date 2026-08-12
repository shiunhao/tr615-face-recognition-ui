(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
var react = { exports: {} };
var react_production_min = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l$1 = Symbol.for("react.element"), n$1 = Symbol.for("react.portal"), p$2 = Symbol.for("react.fragment"), q$1 = Symbol.for("react.strict_mode"), r = Symbol.for("react.profiler"), t = Symbol.for("react.provider"), u = Symbol.for("react.context"), v$1 = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), z$1 = Symbol.iterator;
function A$1(a) {
  if (null === a || "object" !== typeof a) return null;
  a = z$1 && a[z$1] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var B$1 = { isMounted: function() {
  return false;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, C$1 = Object.assign, D$1 = {};
function E$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
E$1.prototype.isReactComponent = {};
E$1.prototype.setState = function(a, b) {
  if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, a, b, "setState");
};
E$1.prototype.forceUpdate = function(a) {
  this.updater.enqueueForceUpdate(this, a, "forceUpdate");
};
function F() {
}
F.prototype = E$1.prototype;
function G$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
var H$1 = G$1.prototype = new F();
H$1.constructor = G$1;
C$1(H$1, E$1.prototype);
H$1.isPureReactComponent = true;
var I$1 = Array.isArray, J = Object.prototype.hasOwnProperty, K$1 = { current: null }, L$1 = { key: true, ref: true, __self: true, __source: true };
function M$1(a, b, e) {
  var d, c = {}, k2 = null, h = null;
  if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k2 = "" + b.key), b) J.call(b, d) && !L$1.hasOwnProperty(d) && (c[d] = b[d]);
  var g = arguments.length - 2;
  if (1 === g) c.children = e;
  else if (1 < g) {
    for (var f2 = Array(g), m2 = 0; m2 < g; m2++) f2[m2] = arguments[m2 + 2];
    c.children = f2;
  }
  if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
  return { $$typeof: l$1, type: a, key: k2, ref: h, props: c, _owner: K$1.current };
}
function N$1(a, b) {
  return { $$typeof: l$1, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
}
function O$1(a) {
  return "object" === typeof a && null !== a && a.$$typeof === l$1;
}
function escape(a) {
  var b = { "=": "=0", ":": "=2" };
  return "$" + a.replace(/[=:]/g, function(a2) {
    return b[a2];
  });
}
var P$1 = /\/+/g;
function Q$1(a, b) {
  return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
}
function R$1(a, b, e, d, c) {
  var k2 = typeof a;
  if ("undefined" === k2 || "boolean" === k2) a = null;
  var h = false;
  if (null === a) h = true;
  else switch (k2) {
    case "string":
    case "number":
      h = true;
      break;
    case "object":
      switch (a.$$typeof) {
        case l$1:
        case n$1:
          h = true;
      }
  }
  if (h) return h = a, c = c(h), a = "" === d ? "." + Q$1(h, 0) : d, I$1(c) ? (e = "", null != a && (e = a.replace(P$1, "$&/") + "/"), R$1(c, b, e, "", function(a2) {
    return a2;
  })) : null != c && (O$1(c) && (c = N$1(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P$1, "$&/") + "/") + a)), b.push(c)), 1;
  h = 0;
  d = "" === d ? "." : d + ":";
  if (I$1(a)) for (var g = 0; g < a.length; g++) {
    k2 = a[g];
    var f2 = d + Q$1(k2, g);
    h += R$1(k2, b, e, f2, c);
  }
  else if (f2 = A$1(a), "function" === typeof f2) for (a = f2.call(a), g = 0; !(k2 = a.next()).done; ) k2 = k2.value, f2 = d + Q$1(k2, g++), h += R$1(k2, b, e, f2, c);
  else if ("object" === k2) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
  return h;
}
function S$1(a, b, e) {
  if (null == a) return a;
  var d = [], c = 0;
  R$1(a, d, "", "", function(a2) {
    return b.call(e, a2, c++);
  });
  return d;
}
function T$2(a) {
  if (-1 === a._status) {
    var b = a._result;
    b = b();
    b.then(function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
    }, function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
    });
    -1 === a._status && (a._status = 0, a._result = b);
  }
  if (1 === a._status) return a._result.default;
  throw a._result;
}
var U$1 = { current: null }, V$1 = { transition: null }, W$1 = { ReactCurrentDispatcher: U$1, ReactCurrentBatchConfig: V$1, ReactCurrentOwner: K$1 };
function X$1() {
  throw Error("act(...) is not supported in production builds of React.");
}
react_production_min.Children = { map: S$1, forEach: function(a, b, e) {
  S$1(a, function() {
    b.apply(this, arguments);
  }, e);
}, count: function(a) {
  var b = 0;
  S$1(a, function() {
    b++;
  });
  return b;
}, toArray: function(a) {
  return S$1(a, function(a2) {
    return a2;
  }) || [];
}, only: function(a) {
  if (!O$1(a)) throw Error("React.Children.only expected to receive a single React element child.");
  return a;
} };
react_production_min.Component = E$1;
react_production_min.Fragment = p$2;
react_production_min.Profiler = r;
react_production_min.PureComponent = G$1;
react_production_min.StrictMode = q$1;
react_production_min.Suspense = w;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$1;
react_production_min.act = X$1;
react_production_min.cloneElement = function(a, b, e) {
  if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
  var d = C$1({}, a.props), c = a.key, k2 = a.ref, h = a._owner;
  if (null != b) {
    void 0 !== b.ref && (k2 = b.ref, h = K$1.current);
    void 0 !== b.key && (c = "" + b.key);
    if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
    for (f2 in b) J.call(b, f2) && !L$1.hasOwnProperty(f2) && (d[f2] = void 0 === b[f2] && void 0 !== g ? g[f2] : b[f2]);
  }
  var f2 = arguments.length - 2;
  if (1 === f2) d.children = e;
  else if (1 < f2) {
    g = Array(f2);
    for (var m2 = 0; m2 < f2; m2++) g[m2] = arguments[m2 + 2];
    d.children = g;
  }
  return { $$typeof: l$1, type: a.type, key: c, ref: k2, props: d, _owner: h };
};
react_production_min.createContext = function(a) {
  a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
  a.Provider = { $$typeof: t, _context: a };
  return a.Consumer = a;
};
react_production_min.createElement = M$1;
react_production_min.createFactory = function(a) {
  var b = M$1.bind(null, a);
  b.type = a;
  return b;
};
react_production_min.createRef = function() {
  return { current: null };
};
react_production_min.forwardRef = function(a) {
  return { $$typeof: v$1, render: a };
};
react_production_min.isValidElement = O$1;
react_production_min.lazy = function(a) {
  return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T$2 };
};
react_production_min.memo = function(a, b) {
  return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
};
react_production_min.startTransition = function(a) {
  var b = V$1.transition;
  V$1.transition = {};
  try {
    a();
  } finally {
    V$1.transition = b;
  }
};
react_production_min.unstable_act = X$1;
react_production_min.useCallback = function(a, b) {
  return U$1.current.useCallback(a, b);
};
react_production_min.useContext = function(a) {
  return U$1.current.useContext(a);
};
react_production_min.useDebugValue = function() {
};
react_production_min.useDeferredValue = function(a) {
  return U$1.current.useDeferredValue(a);
};
react_production_min.useEffect = function(a, b) {
  return U$1.current.useEffect(a, b);
};
react_production_min.useId = function() {
  return U$1.current.useId();
};
react_production_min.useImperativeHandle = function(a, b, e) {
  return U$1.current.useImperativeHandle(a, b, e);
};
react_production_min.useInsertionEffect = function(a, b) {
  return U$1.current.useInsertionEffect(a, b);
};
react_production_min.useLayoutEffect = function(a, b) {
  return U$1.current.useLayoutEffect(a, b);
};
react_production_min.useMemo = function(a, b) {
  return U$1.current.useMemo(a, b);
};
react_production_min.useReducer = function(a, b, e) {
  return U$1.current.useReducer(a, b, e);
};
react_production_min.useRef = function(a) {
  return U$1.current.useRef(a);
};
react_production_min.useState = function(a) {
  return U$1.current.useState(a);
};
react_production_min.useSyncExternalStore = function(a, b, e) {
  return U$1.current.useSyncExternalStore(a, b, e);
};
react_production_min.useTransition = function() {
  return U$1.current.useTransition();
};
react_production_min.version = "18.3.1";
{
  react.exports = react_production_min;
}
var reactExports = react.exports;
const React = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f = reactExports, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$1 = { key: true, ref: true, __self: true, __source: true };
function q(c, a, g) {
  var b, d = {}, e = null, h = null;
  void 0 !== g && (e = "" + g);
  void 0 !== a.key && (e = "" + a.key);
  void 0 !== a.ref && (h = a.ref);
  for (b in a) m$1.call(a, b) && !p$1.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
  return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
}
reactJsxRuntime_production_min.Fragment = l;
reactJsxRuntime_production_min.jsx = q;
reactJsxRuntime_production_min.jsxs = q;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
var jsxRuntimeExports = jsxRuntime.exports;
var client = {};
var reactDom = { exports: {} };
var reactDom_production_min = {};
var scheduler = { exports: {} };
var scheduler_production_min = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(exports) {
  function f2(a, b) {
    var c = a.length;
    a.push(b);
    a: for (; 0 < c; ) {
      var d = c - 1 >>> 1, e = a[d];
      if (0 < g(e, b)) a[d] = b, a[c] = e, c = d;
      else break a;
    }
  }
  function h(a) {
    return 0 === a.length ? null : a[0];
  }
  function k2(a) {
    if (0 === a.length) return null;
    var b = a[0], c = a.pop();
    if (c !== b) {
      a[0] = c;
      a: for (var d = 0, e = a.length, w2 = e >>> 1; d < w2; ) {
        var m2 = 2 * (d + 1) - 1, C2 = a[m2], n2 = m2 + 1, x2 = a[n2];
        if (0 > g(C2, c)) n2 < e && 0 > g(x2, C2) ? (a[d] = x2, a[n2] = c, d = n2) : (a[d] = C2, a[m2] = c, d = m2);
        else if (n2 < e && 0 > g(x2, c)) a[d] = x2, a[n2] = c, d = n2;
        else break a;
      }
    }
    return b;
  }
  function g(a, b) {
    var c = a.sortIndex - b.sortIndex;
    return 0 !== c ? c : a.id - b.id;
  }
  if ("object" === typeof performance && "function" === typeof performance.now) {
    var l2 = performance;
    exports.unstable_now = function() {
      return l2.now();
    };
  } else {
    var p2 = Date, q2 = p2.now();
    exports.unstable_now = function() {
      return p2.now() - q2;
    };
  }
  var r2 = [], t2 = [], u2 = 1, v2 = null, y2 = 3, z2 = false, A2 = false, B2 = false, D2 = "function" === typeof setTimeout ? setTimeout : null, E2 = "function" === typeof clearTimeout ? clearTimeout : null, F2 = "undefined" !== typeof setImmediate ? setImmediate : null;
  "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function G2(a) {
    for (var b = h(t2); null !== b; ) {
      if (null === b.callback) k2(t2);
      else if (b.startTime <= a) k2(t2), b.sortIndex = b.expirationTime, f2(r2, b);
      else break;
      b = h(t2);
    }
  }
  function H2(a) {
    B2 = false;
    G2(a);
    if (!A2) if (null !== h(r2)) A2 = true, I2(J2);
    else {
      var b = h(t2);
      null !== b && K2(H2, b.startTime - a);
    }
  }
  function J2(a, b) {
    A2 = false;
    B2 && (B2 = false, E2(L2), L2 = -1);
    z2 = true;
    var c = y2;
    try {
      G2(b);
      for (v2 = h(r2); null !== v2 && (!(v2.expirationTime > b) || a && !M2()); ) {
        var d = v2.callback;
        if ("function" === typeof d) {
          v2.callback = null;
          y2 = v2.priorityLevel;
          var e = d(v2.expirationTime <= b);
          b = exports.unstable_now();
          "function" === typeof e ? v2.callback = e : v2 === h(r2) && k2(r2);
          G2(b);
        } else k2(r2);
        v2 = h(r2);
      }
      if (null !== v2) var w2 = true;
      else {
        var m2 = h(t2);
        null !== m2 && K2(H2, m2.startTime - b);
        w2 = false;
      }
      return w2;
    } finally {
      v2 = null, y2 = c, z2 = false;
    }
  }
  var N2 = false, O2 = null, L2 = -1, P2 = 5, Q2 = -1;
  function M2() {
    return exports.unstable_now() - Q2 < P2 ? false : true;
  }
  function R2() {
    if (null !== O2) {
      var a = exports.unstable_now();
      Q2 = a;
      var b = true;
      try {
        b = O2(true, a);
      } finally {
        b ? S2() : (N2 = false, O2 = null);
      }
    } else N2 = false;
  }
  var S2;
  if ("function" === typeof F2) S2 = function() {
    F2(R2);
  };
  else if ("undefined" !== typeof MessageChannel) {
    var T2 = new MessageChannel(), U2 = T2.port2;
    T2.port1.onmessage = R2;
    S2 = function() {
      U2.postMessage(null);
    };
  } else S2 = function() {
    D2(R2, 0);
  };
  function I2(a) {
    O2 = a;
    N2 || (N2 = true, S2());
  }
  function K2(a, b) {
    L2 = D2(function() {
      a(exports.unstable_now());
    }, b);
  }
  exports.unstable_IdlePriority = 5;
  exports.unstable_ImmediatePriority = 1;
  exports.unstable_LowPriority = 4;
  exports.unstable_NormalPriority = 3;
  exports.unstable_Profiling = null;
  exports.unstable_UserBlockingPriority = 2;
  exports.unstable_cancelCallback = function(a) {
    a.callback = null;
  };
  exports.unstable_continueExecution = function() {
    A2 || z2 || (A2 = true, I2(J2));
  };
  exports.unstable_forceFrameRate = function(a) {
    0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P2 = 0 < a ? Math.floor(1e3 / a) : 5;
  };
  exports.unstable_getCurrentPriorityLevel = function() {
    return y2;
  };
  exports.unstable_getFirstCallbackNode = function() {
    return h(r2);
  };
  exports.unstable_next = function(a) {
    switch (y2) {
      case 1:
      case 2:
      case 3:
        var b = 3;
        break;
      default:
        b = y2;
    }
    var c = y2;
    y2 = b;
    try {
      return a();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_pauseExecution = function() {
  };
  exports.unstable_requestPaint = function() {
  };
  exports.unstable_runWithPriority = function(a, b) {
    switch (a) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        a = 3;
    }
    var c = y2;
    y2 = a;
    try {
      return b();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_scheduleCallback = function(a, b, c) {
    var d = exports.unstable_now();
    "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
    switch (a) {
      case 1:
        var e = -1;
        break;
      case 2:
        e = 250;
        break;
      case 5:
        e = 1073741823;
        break;
      case 4:
        e = 1e4;
        break;
      default:
        e = 5e3;
    }
    e = c + e;
    a = { id: u2++, callback: b, priorityLevel: a, startTime: c, expirationTime: e, sortIndex: -1 };
    c > d ? (a.sortIndex = c, f2(t2, a), null === h(r2) && a === h(t2) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K2(H2, c - d))) : (a.sortIndex = e, f2(r2, a), A2 || z2 || (A2 = true, I2(J2)));
    return a;
  };
  exports.unstable_shouldYield = M2;
  exports.unstable_wrapCallback = function(a) {
    var b = y2;
    return function() {
      var c = y2;
      y2 = b;
      try {
        return a.apply(this, arguments);
      } finally {
        y2 = c;
      }
    };
  };
})(scheduler_production_min);
{
  scheduler.exports = scheduler_production_min;
}
var schedulerExports = scheduler.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aa = reactExports, ca = schedulerExports;
function p(a) {
  for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);
  return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var da = /* @__PURE__ */ new Set(), ea = {};
function fa(a, b) {
  ha(a, b);
  ha(a + "Capture", b);
}
function ha(a, b) {
  ea[a] = b;
  for (a = 0; a < b.length; a++) da.add(b[a]);
}
var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
function oa(a) {
  if (ja.call(ma, a)) return true;
  if (ja.call(la, a)) return false;
  if (ka.test(a)) return ma[a] = true;
  la[a] = true;
  return false;
}
function pa(a, b, c, d) {
  if (null !== c && 0 === c.type) return false;
  switch (typeof b) {
    case "function":
    case "symbol":
      return true;
    case "boolean":
      if (d) return false;
      if (null !== c) return !c.acceptsBooleans;
      a = a.toLowerCase().slice(0, 5);
      return "data-" !== a && "aria-" !== a;
    default:
      return false;
  }
}
function qa(a, b, c, d) {
  if (null === b || "undefined" === typeof b || pa(a, b, c, d)) return true;
  if (d) return false;
  if (null !== c) switch (c.type) {
    case 3:
      return !b;
    case 4:
      return false === b;
    case 5:
      return isNaN(b);
    case 6:
      return isNaN(b) || 1 > b;
  }
  return false;
}
function v(a, b, c, d, e, f2, g) {
  this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
  this.attributeName = d;
  this.attributeNamespace = e;
  this.mustUseProperty = c;
  this.propertyName = a;
  this.type = b;
  this.sanitizeURL = f2;
  this.removeEmptyString = g;
}
var z = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
  z[a] = new v(a, 0, false, a, null, false, false);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
  var b = a[0];
  z[b] = new v(b, 1, false, a[1], null, false, false);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
  z[a] = new v(a, 2, false, a.toLowerCase(), null, false, false);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
  z[a] = new v(a, 2, false, a, null, false, false);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
  z[a] = new v(a, 3, false, a.toLowerCase(), null, false, false);
});
["checked", "multiple", "muted", "selected"].forEach(function(a) {
  z[a] = new v(a, 3, true, a, null, false, false);
});
["capture", "download"].forEach(function(a) {
  z[a] = new v(a, 4, false, a, null, false, false);
});
["cols", "rows", "size", "span"].forEach(function(a) {
  z[a] = new v(a, 6, false, a, null, false, false);
});
["rowSpan", "start"].forEach(function(a) {
  z[a] = new v(a, 5, false, a.toLowerCase(), null, false, false);
});
var ra = /[\-:]([a-z])/g;
function sa(a) {
  return a[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
  var b = a.replace(
    ra,
    sa
  );
  z[b] = new v(b, 1, false, a, null, false, false);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
});
["tabIndex", "crossOrigin"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, false, false);
});
z.xlinkHref = new v("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
["src", "href", "action", "formAction"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, true, true);
});
function ta(a, b, c, d) {
  var e = z.hasOwnProperty(b) ? z[b] : null;
  if (null !== e ? 0 !== e.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1]) qa(b, c, e, d) && (c = null), d || null === e ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e.mustUseProperty ? a[e.propertyName] = null === c ? 3 === e.type ? false : "" : c : (b = e.attributeName, d = e.attributeNamespace, null === c ? a.removeAttribute(b) : (e = e.type, c = 3 === e || 4 === e && true === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
}
var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
var Ia = Symbol.for("react.offscreen");
var Ja = Symbol.iterator;
function Ka(a) {
  if (null === a || "object" !== typeof a) return null;
  a = Ja && a[Ja] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var A = Object.assign, La;
function Ma(a) {
  if (void 0 === La) try {
    throw Error();
  } catch (c) {
    var b = c.stack.trim().match(/\n( *(at )?)/);
    La = b && b[1] || "";
  }
  return "\n" + La + a;
}
var Na = false;
function Oa(a, b) {
  if (!a || Na) return "";
  Na = true;
  var c = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (b) if (b = function() {
      throw Error();
    }, Object.defineProperty(b.prototype, "props", { set: function() {
      throw Error();
    } }), "object" === typeof Reflect && Reflect.construct) {
      try {
        Reflect.construct(b, []);
      } catch (l2) {
        var d = l2;
      }
      Reflect.construct(a, [], b);
    } else {
      try {
        b.call();
      } catch (l2) {
        d = l2;
      }
      a.call(b.prototype);
    }
    else {
      try {
        throw Error();
      } catch (l2) {
        d = l2;
      }
      a();
    }
  } catch (l2) {
    if (l2 && d && "string" === typeof l2.stack) {
      for (var e = l2.stack.split("\n"), f2 = d.stack.split("\n"), g = e.length - 1, h = f2.length - 1; 1 <= g && 0 <= h && e[g] !== f2[h]; ) h--;
      for (; 1 <= g && 0 <= h; g--, h--) if (e[g] !== f2[h]) {
        if (1 !== g || 1 !== h) {
          do
            if (g--, h--, 0 > h || e[g] !== f2[h]) {
              var k2 = "\n" + e[g].replace(" at new ", " at ");
              a.displayName && k2.includes("<anonymous>") && (k2 = k2.replace("<anonymous>", a.displayName));
              return k2;
            }
          while (1 <= g && 0 <= h);
        }
        break;
      }
    }
  } finally {
    Na = false, Error.prepareStackTrace = c;
  }
  return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
}
function Pa(a) {
  switch (a.tag) {
    case 5:
      return Ma(a.type);
    case 16:
      return Ma("Lazy");
    case 13:
      return Ma("Suspense");
    case 19:
      return Ma("SuspenseList");
    case 0:
    case 2:
    case 15:
      return a = Oa(a.type, false), a;
    case 11:
      return a = Oa(a.type.render, false), a;
    case 1:
      return a = Oa(a.type, true), a;
    default:
      return "";
  }
}
function Qa(a) {
  if (null == a) return null;
  if ("function" === typeof a) return a.displayName || a.name || null;
  if ("string" === typeof a) return a;
  switch (a) {
    case ya:
      return "Fragment";
    case wa:
      return "Portal";
    case Aa:
      return "Profiler";
    case za:
      return "StrictMode";
    case Ea:
      return "Suspense";
    case Fa:
      return "SuspenseList";
  }
  if ("object" === typeof a) switch (a.$$typeof) {
    case Ca:
      return (a.displayName || "Context") + ".Consumer";
    case Ba:
      return (a._context.displayName || "Context") + ".Provider";
    case Da:
      var b = a.render;
      a = a.displayName;
      a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
      return a;
    case Ga:
      return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
    case Ha:
      b = a._payload;
      a = a._init;
      try {
        return Qa(a(b));
      } catch (c) {
      }
  }
  return null;
}
function Ra(a) {
  var b = a.type;
  switch (a.tag) {
    case 24:
      return "Cache";
    case 9:
      return (b.displayName || "Context") + ".Consumer";
    case 10:
      return (b._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return b;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Qa(b);
    case 8:
      return b === za ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if ("function" === typeof b) return b.displayName || b.name || null;
      if ("string" === typeof b) return b;
  }
  return null;
}
function Sa(a) {
  switch (typeof a) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return a;
    case "object":
      return a;
    default:
      return "";
  }
}
function Ta(a) {
  var b = a.type;
  return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
}
function Ua(a) {
  var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
  if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
    var e = c.get, f2 = c.set;
    Object.defineProperty(a, b, { configurable: true, get: function() {
      return e.call(this);
    }, set: function(a2) {
      d = "" + a2;
      f2.call(this, a2);
    } });
    Object.defineProperty(a, b, { enumerable: c.enumerable });
    return { getValue: function() {
      return d;
    }, setValue: function(a2) {
      d = "" + a2;
    }, stopTracking: function() {
      a._valueTracker = null;
      delete a[b];
    } };
  }
}
function Va(a) {
  a._valueTracker || (a._valueTracker = Ua(a));
}
function Wa(a) {
  if (!a) return false;
  var b = a._valueTracker;
  if (!b) return true;
  var c = b.getValue();
  var d = "";
  a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
  a = d;
  return a !== c ? (b.setValue(a), true) : false;
}
function Xa(a) {
  a = a || ("undefined" !== typeof document ? document : void 0);
  if ("undefined" === typeof a) return null;
  try {
    return a.activeElement || a.body;
  } catch (b) {
    return a.body;
  }
}
function Ya(a, b) {
  var c = b.checked;
  return A({}, b, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c ? c : a._wrapperState.initialChecked });
}
function Za(a, b) {
  var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
  c = Sa(null != b.value ? b.value : c);
  a._wrapperState = { initialChecked: d, initialValue: c, controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value };
}
function ab(a, b) {
  b = b.checked;
  null != b && ta(a, "checked", b, false);
}
function bb(a, b) {
  ab(a, b);
  var c = Sa(b.value), d = b.type;
  if (null != c) if ("number" === d) {
    if (0 === c && "" === a.value || a.value != c) a.value = "" + c;
  } else a.value !== "" + c && (a.value = "" + c);
  else if ("submit" === d || "reset" === d) {
    a.removeAttribute("value");
    return;
  }
  b.hasOwnProperty("value") ? cb(a, b.type, c) : b.hasOwnProperty("defaultValue") && cb(a, b.type, Sa(b.defaultValue));
  null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
}
function db(a, b, c) {
  if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
    var d = b.type;
    if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value)) return;
    b = "" + a._wrapperState.initialValue;
    c || b === a.value || (a.value = b);
    a.defaultValue = b;
  }
  c = a.name;
  "" !== c && (a.name = "");
  a.defaultChecked = !!a._wrapperState.initialChecked;
  "" !== c && (a.name = c);
}
function cb(a, b, c) {
  if ("number" !== b || Xa(a.ownerDocument) !== a) null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
}
var eb = Array.isArray;
function fb(a, b, c, d) {
  a = a.options;
  if (b) {
    b = {};
    for (var e = 0; e < c.length; e++) b["$" + c[e]] = true;
    for (c = 0; c < a.length; c++) e = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e && (a[c].selected = e), e && d && (a[c].defaultSelected = true);
  } else {
    c = "" + Sa(c);
    b = null;
    for (e = 0; e < a.length; e++) {
      if (a[e].value === c) {
        a[e].selected = true;
        d && (a[e].defaultSelected = true);
        return;
      }
      null !== b || a[e].disabled || (b = a[e]);
    }
    null !== b && (b.selected = true);
  }
}
function gb(a, b) {
  if (null != b.dangerouslySetInnerHTML) throw Error(p(91));
  return A({}, b, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
}
function hb(a, b) {
  var c = b.value;
  if (null == c) {
    c = b.children;
    b = b.defaultValue;
    if (null != c) {
      if (null != b) throw Error(p(92));
      if (eb(c)) {
        if (1 < c.length) throw Error(p(93));
        c = c[0];
      }
      b = c;
    }
    null == b && (b = "");
    c = b;
  }
  a._wrapperState = { initialValue: Sa(c) };
}
function ib(a, b) {
  var c = Sa(b.value), d = Sa(b.defaultValue);
  null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
  null != d && (a.defaultValue = "" + d);
}
function jb(a) {
  var b = a.textContent;
  b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
}
function kb(a) {
  switch (a) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function lb(a, b) {
  return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
}
var mb, nb = function(a) {
  return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e) {
    MSApp.execUnsafeLocalFunction(function() {
      return a(b, c, d, e);
    });
  } : a;
}(function(a, b) {
  if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a) a.innerHTML = b;
  else {
    mb = mb || document.createElement("div");
    mb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
    for (b = mb.firstChild; a.firstChild; ) a.removeChild(a.firstChild);
    for (; b.firstChild; ) a.appendChild(b.firstChild);
  }
});
function ob(a, b) {
  if (b) {
    var c = a.firstChild;
    if (c && c === a.lastChild && 3 === c.nodeType) {
      c.nodeValue = b;
      return;
    }
  }
  a.textContent = b;
}
var pb = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
}, qb = ["Webkit", "ms", "Moz", "O"];
Object.keys(pb).forEach(function(a) {
  qb.forEach(function(b) {
    b = b + a.charAt(0).toUpperCase() + a.substring(1);
    pb[b] = pb[a];
  });
});
function rb(a, b, c) {
  return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || pb.hasOwnProperty(a) && pb[a] ? ("" + b).trim() : b + "px";
}
function sb(a, b) {
  a = a.style;
  for (var c in b) if (b.hasOwnProperty(c)) {
    var d = 0 === c.indexOf("--"), e = rb(c, b[c], d);
    "float" === c && (c = "cssFloat");
    d ? a.setProperty(c, e) : a[c] = e;
  }
}
var tb = A({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
function ub(a, b) {
  if (b) {
    if (tb[a] && (null != b.children || null != b.dangerouslySetInnerHTML)) throw Error(p(137, a));
    if (null != b.dangerouslySetInnerHTML) {
      if (null != b.children) throw Error(p(60));
      if ("object" !== typeof b.dangerouslySetInnerHTML || !("__html" in b.dangerouslySetInnerHTML)) throw Error(p(61));
    }
    if (null != b.style && "object" !== typeof b.style) throw Error(p(62));
  }
}
function vb(a, b) {
  if (-1 === a.indexOf("-")) return "string" === typeof b.is;
  switch (a) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return false;
    default:
      return true;
  }
}
var wb = null;
function xb(a) {
  a = a.target || a.srcElement || window;
  a.correspondingUseElement && (a = a.correspondingUseElement);
  return 3 === a.nodeType ? a.parentNode : a;
}
var yb = null, zb = null, Ab = null;
function Bb(a) {
  if (a = Cb(a)) {
    if ("function" !== typeof yb) throw Error(p(280));
    var b = a.stateNode;
    b && (b = Db(b), yb(a.stateNode, a.type, b));
  }
}
function Eb(a) {
  zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
}
function Fb() {
  if (zb) {
    var a = zb, b = Ab;
    Ab = zb = null;
    Bb(a);
    if (b) for (a = 0; a < b.length; a++) Bb(b[a]);
  }
}
function Gb(a, b) {
  return a(b);
}
function Hb() {
}
var Ib = false;
function Jb(a, b, c) {
  if (Ib) return a(b, c);
  Ib = true;
  try {
    return Gb(a, b, c);
  } finally {
    if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
  }
}
function Kb(a, b) {
  var c = a.stateNode;
  if (null === c) return null;
  var d = Db(c);
  if (null === d) return null;
  c = d[b];
  a: switch (b) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
      a = !d;
      break a;
    default:
      a = false;
  }
  if (a) return null;
  if (c && "function" !== typeof c) throw Error(p(231, b, typeof c));
  return c;
}
var Lb = false;
if (ia) try {
  var Mb = {};
  Object.defineProperty(Mb, "passive", { get: function() {
    Lb = true;
  } });
  window.addEventListener("test", Mb, Mb);
  window.removeEventListener("test", Mb, Mb);
} catch (a) {
  Lb = false;
}
function Nb(a, b, c, d, e, f2, g, h, k2) {
  var l2 = Array.prototype.slice.call(arguments, 3);
  try {
    b.apply(c, l2);
  } catch (m2) {
    this.onError(m2);
  }
}
var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a) {
  Ob = true;
  Pb = a;
} };
function Tb(a, b, c, d, e, f2, g, h, k2) {
  Ob = false;
  Pb = null;
  Nb.apply(Sb, arguments);
}
function Ub(a, b, c, d, e, f2, g, h, k2) {
  Tb.apply(this, arguments);
  if (Ob) {
    if (Ob) {
      var l2 = Pb;
      Ob = false;
      Pb = null;
    } else throw Error(p(198));
    Qb || (Qb = true, Rb = l2);
  }
}
function Vb(a) {
  var b = a, c = a;
  if (a.alternate) for (; b.return; ) b = b.return;
  else {
    a = b;
    do
      b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
    while (a);
  }
  return 3 === b.tag ? c : null;
}
function Wb(a) {
  if (13 === a.tag) {
    var b = a.memoizedState;
    null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
    if (null !== b) return b.dehydrated;
  }
  return null;
}
function Xb(a) {
  if (Vb(a) !== a) throw Error(p(188));
}
function Yb(a) {
  var b = a.alternate;
  if (!b) {
    b = Vb(a);
    if (null === b) throw Error(p(188));
    return b !== a ? null : a;
  }
  for (var c = a, d = b; ; ) {
    var e = c.return;
    if (null === e) break;
    var f2 = e.alternate;
    if (null === f2) {
      d = e.return;
      if (null !== d) {
        c = d;
        continue;
      }
      break;
    }
    if (e.child === f2.child) {
      for (f2 = e.child; f2; ) {
        if (f2 === c) return Xb(e), a;
        if (f2 === d) return Xb(e), b;
        f2 = f2.sibling;
      }
      throw Error(p(188));
    }
    if (c.return !== d.return) c = e, d = f2;
    else {
      for (var g = false, h = e.child; h; ) {
        if (h === c) {
          g = true;
          c = e;
          d = f2;
          break;
        }
        if (h === d) {
          g = true;
          d = e;
          c = f2;
          break;
        }
        h = h.sibling;
      }
      if (!g) {
        for (h = f2.child; h; ) {
          if (h === c) {
            g = true;
            c = f2;
            d = e;
            break;
          }
          if (h === d) {
            g = true;
            d = f2;
            c = e;
            break;
          }
          h = h.sibling;
        }
        if (!g) throw Error(p(189));
      }
    }
    if (c.alternate !== d) throw Error(p(190));
  }
  if (3 !== c.tag) throw Error(p(188));
  return c.stateNode.current === c ? a : b;
}
function Zb(a) {
  a = Yb(a);
  return null !== a ? $b(a) : null;
}
function $b(a) {
  if (5 === a.tag || 6 === a.tag) return a;
  for (a = a.child; null !== a; ) {
    var b = $b(a);
    if (null !== b) return b;
    a = a.sibling;
  }
  return null;
}
var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
function mc(a) {
  if (lc && "function" === typeof lc.onCommitFiberRoot) try {
    lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
  } catch (b) {
  }
}
var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
function nc(a) {
  a >>>= 0;
  return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
}
var rc = 64, sc = 4194304;
function tc(a) {
  switch (a & -a) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return a & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return a & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return a;
  }
}
function uc(a, b) {
  var c = a.pendingLanes;
  if (0 === c) return 0;
  var d = 0, e = a.suspendedLanes, f2 = a.pingedLanes, g = c & 268435455;
  if (0 !== g) {
    var h = g & ~e;
    0 !== h ? d = tc(h) : (f2 &= g, 0 !== f2 && (d = tc(f2)));
  } else g = c & ~e, 0 !== g ? d = tc(g) : 0 !== f2 && (d = tc(f2));
  if (0 === d) return 0;
  if (0 !== b && b !== d && 0 === (b & e) && (e = d & -d, f2 = b & -b, e >= f2 || 16 === e && 0 !== (f2 & 4194240))) return b;
  0 !== (d & 4) && (d |= c & 16);
  b = a.entangledLanes;
  if (0 !== b) for (a = a.entanglements, b &= d; 0 < b; ) c = 31 - oc(b), e = 1 << c, d |= a[c], b &= ~e;
  return d;
}
function vc(a, b) {
  switch (a) {
    case 1:
    case 2:
    case 4:
      return b + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return b + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function wc(a, b) {
  for (var c = a.suspendedLanes, d = a.pingedLanes, e = a.expirationTimes, f2 = a.pendingLanes; 0 < f2; ) {
    var g = 31 - oc(f2), h = 1 << g, k2 = e[g];
    if (-1 === k2) {
      if (0 === (h & c) || 0 !== (h & d)) e[g] = vc(h, b);
    } else k2 <= b && (a.expiredLanes |= h);
    f2 &= ~h;
  }
}
function xc(a) {
  a = a.pendingLanes & -1073741825;
  return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
}
function yc() {
  var a = rc;
  rc <<= 1;
  0 === (rc & 4194240) && (rc = 64);
  return a;
}
function zc(a) {
  for (var b = [], c = 0; 31 > c; c++) b.push(a);
  return b;
}
function Ac(a, b, c) {
  a.pendingLanes |= b;
  536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
  a = a.eventTimes;
  b = 31 - oc(b);
  a[b] = c;
}
function Bc(a, b) {
  var c = a.pendingLanes & ~b;
  a.pendingLanes = b;
  a.suspendedLanes = 0;
  a.pingedLanes = 0;
  a.expiredLanes &= b;
  a.mutableReadLanes &= b;
  a.entangledLanes &= b;
  b = a.entanglements;
  var d = a.eventTimes;
  for (a = a.expirationTimes; 0 < c; ) {
    var e = 31 - oc(c), f2 = 1 << e;
    b[e] = 0;
    d[e] = -1;
    a[e] = -1;
    c &= ~f2;
  }
}
function Cc(a, b) {
  var c = a.entangledLanes |= b;
  for (a = a.entanglements; c; ) {
    var d = 31 - oc(c), e = 1 << d;
    e & b | a[d] & b && (a[d] |= b);
    c &= ~e;
  }
}
var C = 0;
function Dc(a) {
  a &= -a;
  return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
}
var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc(a, b) {
  switch (a) {
    case "focusin":
    case "focusout":
      Lc = null;
      break;
    case "dragenter":
    case "dragleave":
      Mc = null;
      break;
    case "mouseover":
    case "mouseout":
      Nc = null;
      break;
    case "pointerover":
    case "pointerout":
      Oc.delete(b.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Pc.delete(b.pointerId);
  }
}
function Tc(a, b, c, d, e, f2) {
  if (null === a || a.nativeEvent !== f2) return a = { blockedOn: b, domEventName: c, eventSystemFlags: d, nativeEvent: f2, targetContainers: [e] }, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
  a.eventSystemFlags |= d;
  b = a.targetContainers;
  null !== e && -1 === b.indexOf(e) && b.push(e);
  return a;
}
function Uc(a, b, c, d, e) {
  switch (b) {
    case "focusin":
      return Lc = Tc(Lc, a, b, c, d, e), true;
    case "dragenter":
      return Mc = Tc(Mc, a, b, c, d, e), true;
    case "mouseover":
      return Nc = Tc(Nc, a, b, c, d, e), true;
    case "pointerover":
      var f2 = e.pointerId;
      Oc.set(f2, Tc(Oc.get(f2) || null, a, b, c, d, e));
      return true;
    case "gotpointercapture":
      return f2 = e.pointerId, Pc.set(f2, Tc(Pc.get(f2) || null, a, b, c, d, e)), true;
  }
  return false;
}
function Vc(a) {
  var b = Wc(a.target);
  if (null !== b) {
    var c = Vb(b);
    if (null !== c) {
      if (b = c.tag, 13 === b) {
        if (b = Wb(c), null !== b) {
          a.blockedOn = b;
          Ic(a.priority, function() {
            Gc(c);
          });
          return;
        }
      } else if (3 === b && c.stateNode.current.memoizedState.isDehydrated) {
        a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
        return;
      }
    }
  }
  a.blockedOn = null;
}
function Xc(a) {
  if (null !== a.blockedOn) return false;
  for (var b = a.targetContainers; 0 < b.length; ) {
    var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
    if (null === c) {
      c = a.nativeEvent;
      var d = new c.constructor(c.type, c);
      wb = d;
      c.target.dispatchEvent(d);
      wb = null;
    } else return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, false;
    b.shift();
  }
  return true;
}
function Zc(a, b, c) {
  Xc(a) && c.delete(b);
}
function $c() {
  Jc = false;
  null !== Lc && Xc(Lc) && (Lc = null);
  null !== Mc && Xc(Mc) && (Mc = null);
  null !== Nc && Xc(Nc) && (Nc = null);
  Oc.forEach(Zc);
  Pc.forEach(Zc);
}
function ad(a, b) {
  a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
}
function bd(a) {
  function b(b2) {
    return ad(b2, a);
  }
  if (0 < Kc.length) {
    ad(Kc[0], a);
    for (var c = 1; c < Kc.length; c++) {
      var d = Kc[c];
      d.blockedOn === a && (d.blockedOn = null);
    }
  }
  null !== Lc && ad(Lc, a);
  null !== Mc && ad(Mc, a);
  null !== Nc && ad(Nc, a);
  Oc.forEach(b);
  Pc.forEach(b);
  for (c = 0; c < Qc.length; c++) d = Qc[c], d.blockedOn === a && (d.blockedOn = null);
  for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn); ) Vc(c), null === c.blockedOn && Qc.shift();
}
var cd = ua.ReactCurrentBatchConfig, dd = true;
function ed(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 1, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function gd(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 4, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function fd(a, b, c, d) {
  if (dd) {
    var e = Yc(a, b, c, d);
    if (null === e) hd(a, b, d, id, c), Sc(a, d);
    else if (Uc(e, a, b, c, d)) d.stopPropagation();
    else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
      for (; null !== e; ) {
        var f2 = Cb(e);
        null !== f2 && Ec(f2);
        f2 = Yc(a, b, c, d);
        null === f2 && hd(a, b, d, id, c);
        if (f2 === e) break;
        e = f2;
      }
      null !== e && d.stopPropagation();
    } else hd(a, b, d, null, c);
  }
}
var id = null;
function Yc(a, b, c, d) {
  id = null;
  a = xb(d);
  a = Wc(a);
  if (null !== a) if (b = Vb(a), null === b) a = null;
  else if (c = b.tag, 13 === c) {
    a = Wb(b);
    if (null !== a) return a;
    a = null;
  } else if (3 === c) {
    if (b.stateNode.current.memoizedState.isDehydrated) return 3 === b.tag ? b.stateNode.containerInfo : null;
    a = null;
  } else b !== a && (a = null);
  id = a;
  return null;
}
function jd(a) {
  switch (a) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (ec()) {
        case fc:
          return 1;
        case gc:
          return 4;
        case hc:
        case ic:
          return 16;
        case jc:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var kd = null, ld = null, md = null;
function nd() {
  if (md) return md;
  var a, b = ld, c = b.length, d, e = "value" in kd ? kd.value : kd.textContent, f2 = e.length;
  for (a = 0; a < c && b[a] === e[a]; a++) ;
  var g = c - a;
  for (d = 1; d <= g && b[c - d] === e[f2 - d]; d++) ;
  return md = e.slice(a, 1 < d ? 1 - d : void 0);
}
function od(a) {
  var b = a.keyCode;
  "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
  10 === a && (a = 13);
  return 32 <= a || 13 === a ? a : 0;
}
function pd() {
  return true;
}
function qd() {
  return false;
}
function rd(a) {
  function b(b2, d, e, f2, g) {
    this._reactName = b2;
    this._targetInst = e;
    this.type = d;
    this.nativeEvent = f2;
    this.target = g;
    this.currentTarget = null;
    for (var c in a) a.hasOwnProperty(c) && (b2 = a[c], this[c] = b2 ? b2(f2) : f2[c]);
    this.isDefaultPrevented = (null != f2.defaultPrevented ? f2.defaultPrevented : false === f2.returnValue) ? pd : qd;
    this.isPropagationStopped = qd;
    return this;
  }
  A(b.prototype, { preventDefault: function() {
    this.defaultPrevented = true;
    var a2 = this.nativeEvent;
    a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
  }, stopPropagation: function() {
    var a2 = this.nativeEvent;
    a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
  }, persist: function() {
  }, isPersistent: pd });
  return b;
}
var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
  return a.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
  return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
}, movementX: function(a) {
  if ("movementX" in a) return a.movementX;
  a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
  return wd;
}, movementY: function(a) {
  return "movementY" in a ? a.movementY : xd;
} }), Bd = rd(Ad), Cd = A({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A({}, sd, { clipboardData: function(a) {
  return "clipboardData" in a ? a.clipboardData : window.clipboardData;
} }), Jd = rd(Id), Kd = A({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, Nd = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function Pd(a) {
  var b = this.nativeEvent;
  return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : false;
}
function zd() {
  return Pd;
}
var Qd = A({}, ud, { key: function(a) {
  if (a.key) {
    var b = Md[a.key] || a.key;
    if ("Unidentified" !== b) return b;
  }
  return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
  return "keypress" === a.type ? od(a) : 0;
}, keyCode: function(a) {
  return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
}, which: function(a) {
  return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
} }), Rd = rd(Qd), Sd = A({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A({}, Ad, {
  deltaX: function(a) {
    return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
  },
  deltaY: function(a) {
    return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Zd = rd(Yd), $d = [9, 13, 27, 32], ae = ia && "CompositionEvent" in window, be = null;
ia && "documentMode" in document && (be = document.documentMode);
var ce = ia && "TextEvent" in window && !be, de = ia && (!ae || be && 8 < be && 11 >= be), ee = String.fromCharCode(32), fe = false;
function ge(a, b) {
  switch (a) {
    case "keyup":
      return -1 !== $d.indexOf(b.keyCode);
    case "keydown":
      return 229 !== b.keyCode;
    case "keypress":
    case "mousedown":
    case "focusout":
      return true;
    default:
      return false;
  }
}
function he(a) {
  a = a.detail;
  return "object" === typeof a && "data" in a ? a.data : null;
}
var ie = false;
function je(a, b) {
  switch (a) {
    case "compositionend":
      return he(b);
    case "keypress":
      if (32 !== b.which) return null;
      fe = true;
      return ee;
    case "textInput":
      return a = b.data, a === ee && fe ? null : a;
    default:
      return null;
  }
}
function ke(a, b) {
  if (ie) return "compositionend" === a || !ae && ge(a, b) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
  switch (a) {
    case "paste":
      return null;
    case "keypress":
      if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
        if (b.char && 1 < b.char.length) return b.char;
        if (b.which) return String.fromCharCode(b.which);
      }
      return null;
    case "compositionend":
      return de && "ko" !== b.locale ? null : b.data;
    default:
      return null;
  }
}
var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
function me(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return "input" === b ? !!le[a.type] : "textarea" === b ? true : false;
}
function ne(a, b, c, d) {
  Eb(d);
  b = oe(b, "onChange");
  0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({ event: c, listeners: b }));
}
var pe = null, qe = null;
function re(a) {
  se(a, 0);
}
function te(a) {
  var b = ue(a);
  if (Wa(b)) return a;
}
function ve(a, b) {
  if ("change" === a) return b;
}
var we = false;
if (ia) {
  var xe;
  if (ia) {
    var ye = "oninput" in document;
    if (!ye) {
      var ze = document.createElement("div");
      ze.setAttribute("oninput", "return;");
      ye = "function" === typeof ze.oninput;
    }
    xe = ye;
  } else xe = false;
  we = xe && (!document.documentMode || 9 < document.documentMode);
}
function Ae() {
  pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
}
function Be(a) {
  if ("value" === a.propertyName && te(qe)) {
    var b = [];
    ne(b, qe, a, xb(a));
    Jb(re, b);
  }
}
function Ce(a, b, c) {
  "focusin" === a ? (Ae(), pe = b, qe = c, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
}
function De(a) {
  if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te(qe);
}
function Ee(a, b) {
  if ("click" === a) return te(b);
}
function Fe(a, b) {
  if ("input" === a || "change" === a) return te(b);
}
function Ge(a, b) {
  return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
}
var He = "function" === typeof Object.is ? Object.is : Ge;
function Ie(a, b) {
  if (He(a, b)) return true;
  if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return false;
  var c = Object.keys(a), d = Object.keys(b);
  if (c.length !== d.length) return false;
  for (d = 0; d < c.length; d++) {
    var e = c[d];
    if (!ja.call(b, e) || !He(a[e], b[e])) return false;
  }
  return true;
}
function Je(a) {
  for (; a && a.firstChild; ) a = a.firstChild;
  return a;
}
function Ke(a, b) {
  var c = Je(a);
  a = 0;
  for (var d; c; ) {
    if (3 === c.nodeType) {
      d = a + c.textContent.length;
      if (a <= b && d >= b) return { node: c, offset: b - a };
      a = d;
    }
    a: {
      for (; c; ) {
        if (c.nextSibling) {
          c = c.nextSibling;
          break a;
        }
        c = c.parentNode;
      }
      c = void 0;
    }
    c = Je(c);
  }
}
function Le(a, b) {
  return a && b ? a === b ? true : a && 3 === a.nodeType ? false : b && 3 === b.nodeType ? Le(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : false : false;
}
function Me() {
  for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement; ) {
    try {
      var c = "string" === typeof b.contentWindow.location.href;
    } catch (d) {
      c = false;
    }
    if (c) a = b.contentWindow;
    else break;
    b = Xa(a.document);
  }
  return b;
}
function Ne(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
}
function Oe(a) {
  var b = Me(), c = a.focusedElem, d = a.selectionRange;
  if (b !== c && c && c.ownerDocument && Le(c.ownerDocument.documentElement, c)) {
    if (null !== d && Ne(c)) {
      if (b = d.start, a = d.end, void 0 === a && (a = b), "selectionStart" in c) c.selectionStart = b, c.selectionEnd = Math.min(a, c.value.length);
      else if (a = (b = c.ownerDocument || document) && b.defaultView || window, a.getSelection) {
        a = a.getSelection();
        var e = c.textContent.length, f2 = Math.min(d.start, e);
        d = void 0 === d.end ? f2 : Math.min(d.end, e);
        !a.extend && f2 > d && (e = d, d = f2, f2 = e);
        e = Ke(c, f2);
        var g = Ke(
          c,
          d
        );
        e && g && (1 !== a.rangeCount || a.anchorNode !== e.node || a.anchorOffset !== e.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (b = b.createRange(), b.setStart(e.node, e.offset), a.removeAllRanges(), f2 > d ? (a.addRange(b), a.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), a.addRange(b)));
      }
    }
    b = [];
    for (a = c; a = a.parentNode; ) 1 === a.nodeType && b.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
    "function" === typeof c.focus && c.focus();
    for (c = 0; c < b.length; c++) a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
  }
}
var Pe = ia && "documentMode" in document && 11 >= document.documentMode, Qe = null, Re = null, Se = null, Te = false;
function Ue(a, b, c) {
  var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
  Te || null == Qe || Qe !== Xa(d) || (d = Qe, "selectionStart" in d && Ne(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Se && Ie(Se, d) || (Se = d, d = oe(Re, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({ event: b, listeners: d }), b.target = Qe)));
}
function Ve(a, b) {
  var c = {};
  c[a.toLowerCase()] = b.toLowerCase();
  c["Webkit" + a] = "webkit" + b;
  c["Moz" + a] = "moz" + b;
  return c;
}
var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") }, Xe = {}, Ye = {};
ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
function Ze(a) {
  if (Xe[a]) return Xe[a];
  if (!We[a]) return a;
  var b = We[a], c;
  for (c in b) if (b.hasOwnProperty(c) && c in Ye) return Xe[a] = b[c];
  return a;
}
var $e = Ze("animationend"), af = Ze("animationiteration"), bf = Ze("animationstart"), cf = Ze("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a, b) {
  df.set(a, b);
  fa(b, [a]);
}
for (var gf = 0; gf < ef.length; gf++) {
  var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
  ff(jf, "on" + kf);
}
ff($e, "onAnimationEnd");
ff(af, "onAnimationIteration");
ff(bf, "onAnimationStart");
ff("dblclick", "onDoubleClick");
ff("focusin", "onFocus");
ff("focusout", "onBlur");
ff(cf, "onTransitionEnd");
ha("onMouseEnter", ["mouseout", "mouseover"]);
ha("onMouseLeave", ["mouseout", "mouseover"]);
ha("onPointerEnter", ["pointerout", "pointerover"]);
ha("onPointerLeave", ["pointerout", "pointerover"]);
fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(a, b, c) {
  var d = a.type || "unknown-event";
  a.currentTarget = c;
  Ub(d, b, void 0, a);
  a.currentTarget = null;
}
function se(a, b) {
  b = 0 !== (b & 4);
  for (var c = 0; c < a.length; c++) {
    var d = a[c], e = d.event;
    d = d.listeners;
    a: {
      var f2 = void 0;
      if (b) for (var g = d.length - 1; 0 <= g; g--) {
        var h = d[g], k2 = h.instance, l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
      else for (g = 0; g < d.length; g++) {
        h = d[g];
        k2 = h.instance;
        l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
    }
  }
  if (Qb) throw a = Rb, Qb = false, Rb = null, a;
}
function D(a, b) {
  var c = b[of];
  void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
  var d = a + "__bubble";
  c.has(d) || (pf(b, a, 2, false), c.add(d));
}
function qf(a, b, c) {
  var d = 0;
  b && (d |= 4);
  pf(c, a, d, b);
}
var rf = "_reactListening" + Math.random().toString(36).slice(2);
function sf(a) {
  if (!a[rf]) {
    a[rf] = true;
    da.forEach(function(b2) {
      "selectionchange" !== b2 && (mf.has(b2) || qf(b2, false, a), qf(b2, true, a));
    });
    var b = 9 === a.nodeType ? a : a.ownerDocument;
    null === b || b[rf] || (b[rf] = true, qf("selectionchange", false, b));
  }
}
function pf(a, b, c, d) {
  switch (jd(b)) {
    case 1:
      var e = ed;
      break;
    case 4:
      e = gd;
      break;
    default:
      e = fd;
  }
  c = e.bind(null, b, c, a);
  e = void 0;
  !Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e = true);
  d ? void 0 !== e ? a.addEventListener(b, c, { capture: true, passive: e }) : a.addEventListener(b, c, true) : void 0 !== e ? a.addEventListener(b, c, { passive: e }) : a.addEventListener(b, c, false);
}
function hd(a, b, c, d, e) {
  var f2 = d;
  if (0 === (b & 1) && 0 === (b & 2) && null !== d) a: for (; ; ) {
    if (null === d) return;
    var g = d.tag;
    if (3 === g || 4 === g) {
      var h = d.stateNode.containerInfo;
      if (h === e || 8 === h.nodeType && h.parentNode === e) break;
      if (4 === g) for (g = d.return; null !== g; ) {
        var k2 = g.tag;
        if (3 === k2 || 4 === k2) {
          if (k2 = g.stateNode.containerInfo, k2 === e || 8 === k2.nodeType && k2.parentNode === e) return;
        }
        g = g.return;
      }
      for (; null !== h; ) {
        g = Wc(h);
        if (null === g) return;
        k2 = g.tag;
        if (5 === k2 || 6 === k2) {
          d = f2 = g;
          continue a;
        }
        h = h.parentNode;
      }
    }
    d = d.return;
  }
  Jb(function() {
    var d2 = f2, e2 = xb(c), g2 = [];
    a: {
      var h2 = df.get(a);
      if (void 0 !== h2) {
        var k3 = td, n2 = a;
        switch (a) {
          case "keypress":
            if (0 === od(c)) break a;
          case "keydown":
          case "keyup":
            k3 = Rd;
            break;
          case "focusin":
            n2 = "focus";
            k3 = Fd;
            break;
          case "focusout":
            n2 = "blur";
            k3 = Fd;
            break;
          case "beforeblur":
          case "afterblur":
            k3 = Fd;
            break;
          case "click":
            if (2 === c.button) break a;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            k3 = Bd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            k3 = Dd;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            k3 = Vd;
            break;
          case $e:
          case af:
          case bf:
            k3 = Hd;
            break;
          case cf:
            k3 = Xd;
            break;
          case "scroll":
            k3 = vd;
            break;
          case "wheel":
            k3 = Zd;
            break;
          case "copy":
          case "cut":
          case "paste":
            k3 = Jd;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            k3 = Td;
        }
        var t2 = 0 !== (b & 4), J2 = !t2 && "scroll" === a, x2 = t2 ? null !== h2 ? h2 + "Capture" : null : h2;
        t2 = [];
        for (var w2 = d2, u2; null !== w2; ) {
          u2 = w2;
          var F2 = u2.stateNode;
          5 === u2.tag && null !== F2 && (u2 = F2, null !== x2 && (F2 = Kb(w2, x2), null != F2 && t2.push(tf(w2, F2, u2))));
          if (J2) break;
          w2 = w2.return;
        }
        0 < t2.length && (h2 = new k3(h2, n2, null, c, e2), g2.push({ event: h2, listeners: t2 }));
      }
    }
    if (0 === (b & 7)) {
      a: {
        h2 = "mouseover" === a || "pointerover" === a;
        k3 = "mouseout" === a || "pointerout" === a;
        if (h2 && c !== wb && (n2 = c.relatedTarget || c.fromElement) && (Wc(n2) || n2[uf])) break a;
        if (k3 || h2) {
          h2 = e2.window === e2 ? e2 : (h2 = e2.ownerDocument) ? h2.defaultView || h2.parentWindow : window;
          if (k3) {
            if (n2 = c.relatedTarget || c.toElement, k3 = d2, n2 = n2 ? Wc(n2) : null, null !== n2 && (J2 = Vb(n2), n2 !== J2 || 5 !== n2.tag && 6 !== n2.tag)) n2 = null;
          } else k3 = null, n2 = d2;
          if (k3 !== n2) {
            t2 = Bd;
            F2 = "onMouseLeave";
            x2 = "onMouseEnter";
            w2 = "mouse";
            if ("pointerout" === a || "pointerover" === a) t2 = Td, F2 = "onPointerLeave", x2 = "onPointerEnter", w2 = "pointer";
            J2 = null == k3 ? h2 : ue(k3);
            u2 = null == n2 ? h2 : ue(n2);
            h2 = new t2(F2, w2 + "leave", k3, c, e2);
            h2.target = J2;
            h2.relatedTarget = u2;
            F2 = null;
            Wc(e2) === d2 && (t2 = new t2(x2, w2 + "enter", n2, c, e2), t2.target = u2, t2.relatedTarget = J2, F2 = t2);
            J2 = F2;
            if (k3 && n2) b: {
              t2 = k3;
              x2 = n2;
              w2 = 0;
              for (u2 = t2; u2; u2 = vf(u2)) w2++;
              u2 = 0;
              for (F2 = x2; F2; F2 = vf(F2)) u2++;
              for (; 0 < w2 - u2; ) t2 = vf(t2), w2--;
              for (; 0 < u2 - w2; ) x2 = vf(x2), u2--;
              for (; w2--; ) {
                if (t2 === x2 || null !== x2 && t2 === x2.alternate) break b;
                t2 = vf(t2);
                x2 = vf(x2);
              }
              t2 = null;
            }
            else t2 = null;
            null !== k3 && wf(g2, h2, k3, t2, false);
            null !== n2 && null !== J2 && wf(g2, J2, n2, t2, true);
          }
        }
      }
      a: {
        h2 = d2 ? ue(d2) : window;
        k3 = h2.nodeName && h2.nodeName.toLowerCase();
        if ("select" === k3 || "input" === k3 && "file" === h2.type) var na = ve;
        else if (me(h2)) if (we) na = Fe;
        else {
          na = De;
          var xa = Ce;
        }
        else (k3 = h2.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h2.type || "radio" === h2.type) && (na = Ee);
        if (na && (na = na(a, d2))) {
          ne(g2, na, c, e2);
          break a;
        }
        xa && xa(a, h2, d2);
        "focusout" === a && (xa = h2._wrapperState) && xa.controlled && "number" === h2.type && cb(h2, "number", h2.value);
      }
      xa = d2 ? ue(d2) : window;
      switch (a) {
        case "focusin":
          if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d2, Se = null;
          break;
        case "focusout":
          Se = Re = Qe = null;
          break;
        case "mousedown":
          Te = true;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Te = false;
          Ue(g2, c, e2);
          break;
        case "selectionchange":
          if (Pe) break;
        case "keydown":
        case "keyup":
          Ue(g2, c, e2);
      }
      var $a;
      if (ae) b: {
        switch (a) {
          case "compositionstart":
            var ba = "onCompositionStart";
            break b;
          case "compositionend":
            ba = "onCompositionEnd";
            break b;
          case "compositionupdate":
            ba = "onCompositionUpdate";
            break b;
        }
        ba = void 0;
      }
      else ie ? ge(a, c) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (ba = "onCompositionStart");
      ba && (de && "ko" !== c.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e2, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d2, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e2), g2.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c), null !== $a && (ba.data = $a))));
      if ($a = ce ? je(a, c) : ke(a, c)) d2 = oe(d2, "onBeforeInput"), 0 < d2.length && (e2 = new Ld("onBeforeInput", "beforeinput", null, c, e2), g2.push({ event: e2, listeners: d2 }), e2.data = $a);
    }
    se(g2, b);
  });
}
function tf(a, b, c) {
  return { instance: a, listener: b, currentTarget: c };
}
function oe(a, b) {
  for (var c = b + "Capture", d = []; null !== a; ) {
    var e = a, f2 = e.stateNode;
    5 === e.tag && null !== f2 && (e = f2, f2 = Kb(a, c), null != f2 && d.unshift(tf(a, f2, e)), f2 = Kb(a, b), null != f2 && d.push(tf(a, f2, e)));
    a = a.return;
  }
  return d;
}
function vf(a) {
  if (null === a) return null;
  do
    a = a.return;
  while (a && 5 !== a.tag);
  return a ? a : null;
}
function wf(a, b, c, d, e) {
  for (var f2 = b._reactName, g = []; null !== c && c !== d; ) {
    var h = c, k2 = h.alternate, l2 = h.stateNode;
    if (null !== k2 && k2 === d) break;
    5 === h.tag && null !== l2 && (h = l2, e ? (k2 = Kb(c, f2), null != k2 && g.unshift(tf(c, k2, h))) : e || (k2 = Kb(c, f2), null != k2 && g.push(tf(c, k2, h))));
    c = c.return;
  }
  0 !== g.length && a.push({ event: b, listeners: g });
}
var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
function zf(a) {
  return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
}
function Af(a, b, c) {
  b = zf(b);
  if (zf(a) !== b && c) throw Error(p(425));
}
function Bf() {
}
var Cf = null, Df = null;
function Ef(a, b) {
  return "textarea" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
}
var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
  return Hf.resolve(null).then(a).catch(If);
} : Ff;
function If(a) {
  setTimeout(function() {
    throw a;
  });
}
function Kf(a, b) {
  var c = b, d = 0;
  do {
    var e = c.nextSibling;
    a.removeChild(c);
    if (e && 8 === e.nodeType) if (c = e.data, "/$" === c) {
      if (0 === d) {
        a.removeChild(e);
        bd(b);
        return;
      }
      d--;
    } else "$" !== c && "$?" !== c && "$!" !== c || d++;
    c = e;
  } while (c);
  bd(b);
}
function Lf(a) {
  for (; null != a; a = a.nextSibling) {
    var b = a.nodeType;
    if (1 === b || 3 === b) break;
    if (8 === b) {
      b = a.data;
      if ("$" === b || "$!" === b || "$?" === b) break;
      if ("/$" === b) return null;
    }
  }
  return a;
}
function Mf(a) {
  a = a.previousSibling;
  for (var b = 0; a; ) {
    if (8 === a.nodeType) {
      var c = a.data;
      if ("$" === c || "$!" === c || "$?" === c) {
        if (0 === b) return a;
        b--;
      } else "/$" === c && b++;
    }
    a = a.previousSibling;
  }
  return null;
}
var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
function Wc(a) {
  var b = a[Of];
  if (b) return b;
  for (var c = a.parentNode; c; ) {
    if (b = c[uf] || c[Of]) {
      c = b.alternate;
      if (null !== b.child || null !== c && null !== c.child) for (a = Mf(a); null !== a; ) {
        if (c = a[Of]) return c;
        a = Mf(a);
      }
      return b;
    }
    a = c;
    c = a.parentNode;
  }
  return null;
}
function Cb(a) {
  a = a[Of] || a[uf];
  return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
}
function ue(a) {
  if (5 === a.tag || 6 === a.tag) return a.stateNode;
  throw Error(p(33));
}
function Db(a) {
  return a[Pf] || null;
}
var Sf = [], Tf = -1;
function Uf(a) {
  return { current: a };
}
function E(a) {
  0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
}
function G(a, b) {
  Tf++;
  Sf[Tf] = a.current;
  a.current = b;
}
var Vf = {}, H = Uf(Vf), Wf = Uf(false), Xf = Vf;
function Yf(a, b) {
  var c = a.type.contextTypes;
  if (!c) return Vf;
  var d = a.stateNode;
  if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
  var e = {}, f2;
  for (f2 in c) e[f2] = b[f2];
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e);
  return e;
}
function Zf(a) {
  a = a.childContextTypes;
  return null !== a && void 0 !== a;
}
function $f() {
  E(Wf);
  E(H);
}
function ag(a, b, c) {
  if (H.current !== Vf) throw Error(p(168));
  G(H, b);
  G(Wf, c);
}
function bg(a, b, c) {
  var d = a.stateNode;
  b = b.childContextTypes;
  if ("function" !== typeof d.getChildContext) return c;
  d = d.getChildContext();
  for (var e in d) if (!(e in b)) throw Error(p(108, Ra(a) || "Unknown", e));
  return A({}, c, d);
}
function cg(a) {
  a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
  Xf = H.current;
  G(H, a);
  G(Wf, Wf.current);
  return true;
}
function dg(a, b, c) {
  var d = a.stateNode;
  if (!d) throw Error(p(169));
  c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
  G(Wf, c);
}
var eg = null, fg = false, gg = false;
function hg(a) {
  null === eg ? eg = [a] : eg.push(a);
}
function ig(a) {
  fg = true;
  hg(a);
}
function jg() {
  if (!gg && null !== eg) {
    gg = true;
    var a = 0, b = C;
    try {
      var c = eg;
      for (C = 1; a < c.length; a++) {
        var d = c[a];
        do
          d = d(true);
        while (null !== d);
      }
      eg = null;
      fg = false;
    } catch (e) {
      throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e;
    } finally {
      C = b, gg = false;
    }
  }
  return null;
}
var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
function tg(a, b) {
  kg[lg++] = ng;
  kg[lg++] = mg;
  mg = a;
  ng = b;
}
function ug(a, b, c) {
  og[pg++] = rg;
  og[pg++] = sg;
  og[pg++] = qg;
  qg = a;
  var d = rg;
  a = sg;
  var e = 32 - oc(d) - 1;
  d &= ~(1 << e);
  c += 1;
  var f2 = 32 - oc(b) + e;
  if (30 < f2) {
    var g = e - e % 5;
    f2 = (d & (1 << g) - 1).toString(32);
    d >>= g;
    e -= g;
    rg = 1 << 32 - oc(b) + e | c << e | d;
    sg = f2 + a;
  } else rg = 1 << f2 | c << e | d, sg = a;
}
function vg(a) {
  null !== a.return && (tg(a, 1), ug(a, 1, 0));
}
function wg(a) {
  for (; a === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
  for (; a === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
}
var xg = null, yg = null, I = false, zg = null;
function Ag(a, b) {
  var c = Bg(5, null, null, 0);
  c.elementType = "DELETED";
  c.stateNode = b;
  c.return = a;
  b = a.deletions;
  null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
}
function Cg(a, b) {
  switch (a.tag) {
    case 5:
      var c = a.type;
      b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
      return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), true) : false;
    case 6:
      return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, true) : false;
    case 13:
      return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 }, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, true) : false;
    default:
      return false;
  }
}
function Dg(a) {
  return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
}
function Eg(a) {
  if (I) {
    var b = yg;
    if (b) {
      var c = b;
      if (!Cg(a, b)) {
        if (Dg(a)) throw Error(p(418));
        b = Lf(c.nextSibling);
        var d = xg;
        b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I = false, xg = a);
      }
    } else {
      if (Dg(a)) throw Error(p(418));
      a.flags = a.flags & -4097 | 2;
      I = false;
      xg = a;
    }
  }
}
function Fg(a) {
  for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
  xg = a;
}
function Gg(a) {
  if (a !== xg) return false;
  if (!I) return Fg(a), I = true, false;
  var b;
  (b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
  if (b && (b = yg)) {
    if (Dg(a)) throw Hg(), Error(p(418));
    for (; b; ) Ag(a, b), b = Lf(b.nextSibling);
  }
  Fg(a);
  if (13 === a.tag) {
    a = a.memoizedState;
    a = null !== a ? a.dehydrated : null;
    if (!a) throw Error(p(317));
    a: {
      a = a.nextSibling;
      for (b = 0; a; ) {
        if (8 === a.nodeType) {
          var c = a.data;
          if ("/$" === c) {
            if (0 === b) {
              yg = Lf(a.nextSibling);
              break a;
            }
            b--;
          } else "$" !== c && "$!" !== c && "$?" !== c || b++;
        }
        a = a.nextSibling;
      }
      yg = null;
    }
  } else yg = xg ? Lf(a.stateNode.nextSibling) : null;
  return true;
}
function Hg() {
  for (var a = yg; a; ) a = Lf(a.nextSibling);
}
function Ig() {
  yg = xg = null;
  I = false;
}
function Jg(a) {
  null === zg ? zg = [a] : zg.push(a);
}
var Kg = ua.ReactCurrentBatchConfig;
function Lg(a, b, c) {
  a = c.ref;
  if (null !== a && "function" !== typeof a && "object" !== typeof a) {
    if (c._owner) {
      c = c._owner;
      if (c) {
        if (1 !== c.tag) throw Error(p(309));
        var d = c.stateNode;
      }
      if (!d) throw Error(p(147, a));
      var e = d, f2 = "" + a;
      if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f2) return b.ref;
      b = function(a2) {
        var b2 = e.refs;
        null === a2 ? delete b2[f2] : b2[f2] = a2;
      };
      b._stringRef = f2;
      return b;
    }
    if ("string" !== typeof a) throw Error(p(284));
    if (!c._owner) throw Error(p(290, a));
  }
  return a;
}
function Mg(a, b) {
  a = Object.prototype.toString.call(b);
  throw Error(p(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
}
function Ng(a) {
  var b = a._init;
  return b(a._payload);
}
function Og(a) {
  function b(b2, c2) {
    if (a) {
      var d2 = b2.deletions;
      null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
    }
  }
  function c(c2, d2) {
    if (!a) return null;
    for (; null !== d2; ) b(c2, d2), d2 = d2.sibling;
    return null;
  }
  function d(a2, b2) {
    for (a2 = /* @__PURE__ */ new Map(); null !== b2; ) null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
    return a2;
  }
  function e(a2, b2) {
    a2 = Pg(a2, b2);
    a2.index = 0;
    a2.sibling = null;
    return a2;
  }
  function f2(b2, c2, d2) {
    b2.index = d2;
    if (!a) return b2.flags |= 1048576, c2;
    d2 = b2.alternate;
    if (null !== d2) return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
    b2.flags |= 2;
    return c2;
  }
  function g(b2) {
    a && null === b2.alternate && (b2.flags |= 2);
    return b2;
  }
  function h(a2, b2, c2, d2) {
    if (null === b2 || 6 !== b2.tag) return b2 = Qg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function k2(a2, b2, c2, d2) {
    var f3 = c2.type;
    if (f3 === ya) return m2(a2, b2, c2.props.children, d2, c2.key);
    if (null !== b2 && (b2.elementType === f3 || "object" === typeof f3 && null !== f3 && f3.$$typeof === Ha && Ng(f3) === b2.type)) return d2 = e(b2, c2.props), d2.ref = Lg(a2, b2, c2), d2.return = a2, d2;
    d2 = Rg(c2.type, c2.key, c2.props, null, a2.mode, d2);
    d2.ref = Lg(a2, b2, c2);
    d2.return = a2;
    return d2;
  }
  function l2(a2, b2, c2, d2) {
    if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation) return b2 = Sg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2.children || []);
    b2.return = a2;
    return b2;
  }
  function m2(a2, b2, c2, d2, f3) {
    if (null === b2 || 7 !== b2.tag) return b2 = Tg(c2, a2.mode, d2, f3), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function q2(a2, b2, c2) {
    if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2) return b2 = Qg("" + b2, a2.mode, c2), b2.return = a2, b2;
    if ("object" === typeof b2 && null !== b2) {
      switch (b2.$$typeof) {
        case va:
          return c2 = Rg(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = Lg(a2, null, b2), c2.return = a2, c2;
        case wa:
          return b2 = Sg(b2, a2.mode, c2), b2.return = a2, b2;
        case Ha:
          var d2 = b2._init;
          return q2(a2, d2(b2._payload), c2);
      }
      if (eb(b2) || Ka(b2)) return b2 = Tg(b2, a2.mode, c2, null), b2.return = a2, b2;
      Mg(a2, b2);
    }
    return null;
  }
  function r2(a2, b2, c2, d2) {
    var e2 = null !== b2 ? b2.key : null;
    if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2) return null !== e2 ? null : h(a2, b2, "" + c2, d2);
    if ("object" === typeof c2 && null !== c2) {
      switch (c2.$$typeof) {
        case va:
          return c2.key === e2 ? k2(a2, b2, c2, d2) : null;
        case wa:
          return c2.key === e2 ? l2(a2, b2, c2, d2) : null;
        case Ha:
          return e2 = c2._init, r2(
            a2,
            b2,
            e2(c2._payload),
            d2
          );
      }
      if (eb(c2) || Ka(c2)) return null !== e2 ? null : m2(a2, b2, c2, d2, null);
      Mg(a2, c2);
    }
    return null;
  }
  function y2(a2, b2, c2, d2, e2) {
    if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2) return a2 = a2.get(c2) || null, h(b2, a2, "" + d2, e2);
    if ("object" === typeof d2 && null !== d2) {
      switch (d2.$$typeof) {
        case va:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k2(b2, a2, d2, e2);
        case wa:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l2(b2, a2, d2, e2);
        case Ha:
          var f3 = d2._init;
          return y2(a2, b2, c2, f3(d2._payload), e2);
      }
      if (eb(d2) || Ka(d2)) return a2 = a2.get(c2) || null, m2(b2, a2, d2, e2, null);
      Mg(b2, d2);
    }
    return null;
  }
  function n2(e2, g2, h2, k3) {
    for (var l3 = null, m3 = null, u2 = g2, w2 = g2 = 0, x2 = null; null !== u2 && w2 < h2.length; w2++) {
      u2.index > w2 ? (x2 = u2, u2 = null) : x2 = u2.sibling;
      var n3 = r2(e2, u2, h2[w2], k3);
      if (null === n3) {
        null === u2 && (u2 = x2);
        break;
      }
      a && u2 && null === n3.alternate && b(e2, u2);
      g2 = f2(n3, g2, w2);
      null === m3 ? l3 = n3 : m3.sibling = n3;
      m3 = n3;
      u2 = x2;
    }
    if (w2 === h2.length) return c(e2, u2), I && tg(e2, w2), l3;
    if (null === u2) {
      for (; w2 < h2.length; w2++) u2 = q2(e2, h2[w2], k3), null !== u2 && (g2 = f2(u2, g2, w2), null === m3 ? l3 = u2 : m3.sibling = u2, m3 = u2);
      I && tg(e2, w2);
      return l3;
    }
    for (u2 = d(e2, u2); w2 < h2.length; w2++) x2 = y2(u2, e2, w2, h2[w2], k3), null !== x2 && (a && null !== x2.alternate && u2.delete(null === x2.key ? w2 : x2.key), g2 = f2(x2, g2, w2), null === m3 ? l3 = x2 : m3.sibling = x2, m3 = x2);
    a && u2.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function t2(e2, g2, h2, k3) {
    var l3 = Ka(h2);
    if ("function" !== typeof l3) throw Error(p(150));
    h2 = l3.call(h2);
    if (null == h2) throw Error(p(151));
    for (var u2 = l3 = null, m3 = g2, w2 = g2 = 0, x2 = null, n3 = h2.next(); null !== m3 && !n3.done; w2++, n3 = h2.next()) {
      m3.index > w2 ? (x2 = m3, m3 = null) : x2 = m3.sibling;
      var t3 = r2(e2, m3, n3.value, k3);
      if (null === t3) {
        null === m3 && (m3 = x2);
        break;
      }
      a && m3 && null === t3.alternate && b(e2, m3);
      g2 = f2(t3, g2, w2);
      null === u2 ? l3 = t3 : u2.sibling = t3;
      u2 = t3;
      m3 = x2;
    }
    if (n3.done) return c(
      e2,
      m3
    ), I && tg(e2, w2), l3;
    if (null === m3) {
      for (; !n3.done; w2++, n3 = h2.next()) n3 = q2(e2, n3.value, k3), null !== n3 && (g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
      I && tg(e2, w2);
      return l3;
    }
    for (m3 = d(e2, m3); !n3.done; w2++, n3 = h2.next()) n3 = y2(m3, e2, w2, n3.value, k3), null !== n3 && (a && null !== n3.alternate && m3.delete(null === n3.key ? w2 : n3.key), g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
    a && m3.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function J2(a2, d2, f3, h2) {
    "object" === typeof f3 && null !== f3 && f3.type === ya && null === f3.key && (f3 = f3.props.children);
    if ("object" === typeof f3 && null !== f3) {
      switch (f3.$$typeof) {
        case va:
          a: {
            for (var k3 = f3.key, l3 = d2; null !== l3; ) {
              if (l3.key === k3) {
                k3 = f3.type;
                if (k3 === ya) {
                  if (7 === l3.tag) {
                    c(a2, l3.sibling);
                    d2 = e(l3, f3.props.children);
                    d2.return = a2;
                    a2 = d2;
                    break a;
                  }
                } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && Ng(k3) === l3.type) {
                  c(a2, l3.sibling);
                  d2 = e(l3, f3.props);
                  d2.ref = Lg(a2, l3, f3);
                  d2.return = a2;
                  a2 = d2;
                  break a;
                }
                c(a2, l3);
                break;
              } else b(a2, l3);
              l3 = l3.sibling;
            }
            f3.type === ya ? (d2 = Tg(f3.props.children, a2.mode, h2, f3.key), d2.return = a2, a2 = d2) : (h2 = Rg(f3.type, f3.key, f3.props, null, a2.mode, h2), h2.ref = Lg(a2, d2, f3), h2.return = a2, a2 = h2);
          }
          return g(a2);
        case wa:
          a: {
            for (l3 = f3.key; null !== d2; ) {
              if (d2.key === l3) if (4 === d2.tag && d2.stateNode.containerInfo === f3.containerInfo && d2.stateNode.implementation === f3.implementation) {
                c(a2, d2.sibling);
                d2 = e(d2, f3.children || []);
                d2.return = a2;
                a2 = d2;
                break a;
              } else {
                c(a2, d2);
                break;
              }
              else b(a2, d2);
              d2 = d2.sibling;
            }
            d2 = Sg(f3, a2.mode, h2);
            d2.return = a2;
            a2 = d2;
          }
          return g(a2);
        case Ha:
          return l3 = f3._init, J2(a2, d2, l3(f3._payload), h2);
      }
      if (eb(f3)) return n2(a2, d2, f3, h2);
      if (Ka(f3)) return t2(a2, d2, f3, h2);
      Mg(a2, f3);
    }
    return "string" === typeof f3 && "" !== f3 || "number" === typeof f3 ? (f3 = "" + f3, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e(d2, f3), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = Qg(f3, a2.mode, h2), d2.return = a2, a2 = d2), g(a2)) : c(a2, d2);
  }
  return J2;
}
var Ug = Og(true), Vg = Og(false), Wg = Uf(null), Xg = null, Yg = null, Zg = null;
function $g() {
  Zg = Yg = Xg = null;
}
function ah(a) {
  var b = Wg.current;
  E(Wg);
  a._currentValue = b;
}
function bh(a, b, c) {
  for (; null !== a; ) {
    var d = a.alternate;
    (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
    if (a === c) break;
    a = a.return;
  }
}
function ch(a, b) {
  Xg = a;
  Zg = Yg = null;
  a = a.dependencies;
  null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (dh = true), a.firstContext = null);
}
function eh(a) {
  var b = a._currentValue;
  if (Zg !== a) if (a = { context: a, memoizedValue: b, next: null }, null === Yg) {
    if (null === Xg) throw Error(p(308));
    Yg = a;
    Xg.dependencies = { lanes: 0, firstContext: a };
  } else Yg = Yg.next = a;
  return b;
}
var fh = null;
function gh(a) {
  null === fh ? fh = [a] : fh.push(a);
}
function hh(a, b, c, d) {
  var e = b.interleaved;
  null === e ? (c.next = c, gh(b)) : (c.next = e.next, e.next = c);
  b.interleaved = c;
  return ih(a, d);
}
function ih(a, b) {
  a.lanes |= b;
  var c = a.alternate;
  null !== c && (c.lanes |= b);
  c = a;
  for (a = a.return; null !== a; ) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
  return 3 === c.tag ? c.stateNode : null;
}
var jh = false;
function kh(a) {
  a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function lh(a, b) {
  a = a.updateQueue;
  b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
}
function mh(a, b) {
  return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
}
function nh(a, b, c) {
  var d = a.updateQueue;
  if (null === d) return null;
  d = d.shared;
  if (0 !== (K & 2)) {
    var e = d.pending;
    null === e ? b.next = b : (b.next = e.next, e.next = b);
    d.pending = b;
    return ih(a, c);
  }
  e = d.interleaved;
  null === e ? (b.next = b, gh(d)) : (b.next = e.next, e.next = b);
  d.interleaved = b;
  return ih(a, c);
}
function oh(a, b, c) {
  b = b.updateQueue;
  if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
function ph(a, b) {
  var c = a.updateQueue, d = a.alternate;
  if (null !== d && (d = d.updateQueue, c === d)) {
    var e = null, f2 = null;
    c = c.firstBaseUpdate;
    if (null !== c) {
      do {
        var g = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
        null === f2 ? e = f2 = g : f2 = f2.next = g;
        c = c.next;
      } while (null !== c);
      null === f2 ? e = f2 = b : f2 = f2.next = b;
    } else e = f2 = b;
    c = { baseState: d.baseState, firstBaseUpdate: e, lastBaseUpdate: f2, shared: d.shared, effects: d.effects };
    a.updateQueue = c;
    return;
  }
  a = c.lastBaseUpdate;
  null === a ? c.firstBaseUpdate = b : a.next = b;
  c.lastBaseUpdate = b;
}
function qh(a, b, c, d) {
  var e = a.updateQueue;
  jh = false;
  var f2 = e.firstBaseUpdate, g = e.lastBaseUpdate, h = e.shared.pending;
  if (null !== h) {
    e.shared.pending = null;
    var k2 = h, l2 = k2.next;
    k2.next = null;
    null === g ? f2 = l2 : g.next = l2;
    g = k2;
    var m2 = a.alternate;
    null !== m2 && (m2 = m2.updateQueue, h = m2.lastBaseUpdate, h !== g && (null === h ? m2.firstBaseUpdate = l2 : h.next = l2, m2.lastBaseUpdate = k2));
  }
  if (null !== f2) {
    var q2 = e.baseState;
    g = 0;
    m2 = l2 = k2 = null;
    h = f2;
    do {
      var r2 = h.lane, y2 = h.eventTime;
      if ((d & r2) === r2) {
        null !== m2 && (m2 = m2.next = {
          eventTime: y2,
          lane: 0,
          tag: h.tag,
          payload: h.payload,
          callback: h.callback,
          next: null
        });
        a: {
          var n2 = a, t2 = h;
          r2 = b;
          y2 = c;
          switch (t2.tag) {
            case 1:
              n2 = t2.payload;
              if ("function" === typeof n2) {
                q2 = n2.call(y2, q2, r2);
                break a;
              }
              q2 = n2;
              break a;
            case 3:
              n2.flags = n2.flags & -65537 | 128;
            case 0:
              n2 = t2.payload;
              r2 = "function" === typeof n2 ? n2.call(y2, q2, r2) : n2;
              if (null === r2 || void 0 === r2) break a;
              q2 = A({}, q2, r2);
              break a;
            case 2:
              jh = true;
          }
        }
        null !== h.callback && 0 !== h.lane && (a.flags |= 64, r2 = e.effects, null === r2 ? e.effects = [h] : r2.push(h));
      } else y2 = { eventTime: y2, lane: r2, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m2 ? (l2 = m2 = y2, k2 = q2) : m2 = m2.next = y2, g |= r2;
      h = h.next;
      if (null === h) if (h = e.shared.pending, null === h) break;
      else r2 = h, h = r2.next, r2.next = null, e.lastBaseUpdate = r2, e.shared.pending = null;
    } while (1);
    null === m2 && (k2 = q2);
    e.baseState = k2;
    e.firstBaseUpdate = l2;
    e.lastBaseUpdate = m2;
    b = e.shared.interleaved;
    if (null !== b) {
      e = b;
      do
        g |= e.lane, e = e.next;
      while (e !== b);
    } else null === f2 && (e.shared.lanes = 0);
    rh |= g;
    a.lanes = g;
    a.memoizedState = q2;
  }
}
function sh(a, b, c) {
  a = b.effects;
  b.effects = null;
  if (null !== a) for (b = 0; b < a.length; b++) {
    var d = a[b], e = d.callback;
    if (null !== e) {
      d.callback = null;
      d = c;
      if ("function" !== typeof e) throw Error(p(191, e));
      e.call(d);
    }
  }
}
var th = {}, uh = Uf(th), vh = Uf(th), wh = Uf(th);
function xh(a) {
  if (a === th) throw Error(p(174));
  return a;
}
function yh(a, b) {
  G(wh, b);
  G(vh, a);
  G(uh, th);
  a = b.nodeType;
  switch (a) {
    case 9:
    case 11:
      b = (b = b.documentElement) ? b.namespaceURI : lb(null, "");
      break;
    default:
      a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
  }
  E(uh);
  G(uh, b);
}
function zh() {
  E(uh);
  E(vh);
  E(wh);
}
function Ah(a) {
  xh(wh.current);
  var b = xh(uh.current);
  var c = lb(b, a.type);
  b !== c && (G(vh, a), G(uh, c));
}
function Bh(a) {
  vh.current === a && (E(uh), E(vh));
}
var L = Uf(0);
function Ch(a) {
  for (var b = a; null !== b; ) {
    if (13 === b.tag) {
      var c = b.memoizedState;
      if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data)) return b;
    } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
      if (0 !== (b.flags & 128)) return b;
    } else if (null !== b.child) {
      b.child.return = b;
      b = b.child;
      continue;
    }
    if (b === a) break;
    for (; null === b.sibling; ) {
      if (null === b.return || b.return === a) return null;
      b = b.return;
    }
    b.sibling.return = b.return;
    b = b.sibling;
  }
  return null;
}
var Dh = [];
function Eh() {
  for (var a = 0; a < Dh.length; a++) Dh[a]._workInProgressVersionPrimary = null;
  Dh.length = 0;
}
var Fh = ua.ReactCurrentDispatcher, Gh = ua.ReactCurrentBatchConfig, Hh = 0, M = null, N = null, O = null, Ih = false, Jh = false, Kh = 0, Lh = 0;
function P() {
  throw Error(p(321));
}
function Mh(a, b) {
  if (null === b) return false;
  for (var c = 0; c < b.length && c < a.length; c++) if (!He(a[c], b[c])) return false;
  return true;
}
function Nh(a, b, c, d, e, f2) {
  Hh = f2;
  M = b;
  b.memoizedState = null;
  b.updateQueue = null;
  b.lanes = 0;
  Fh.current = null === a || null === a.memoizedState ? Oh : Ph;
  a = c(d, e);
  if (Jh) {
    f2 = 0;
    do {
      Jh = false;
      Kh = 0;
      if (25 <= f2) throw Error(p(301));
      f2 += 1;
      O = N = null;
      b.updateQueue = null;
      Fh.current = Qh;
      a = c(d, e);
    } while (Jh);
  }
  Fh.current = Rh;
  b = null !== N && null !== N.next;
  Hh = 0;
  O = N = M = null;
  Ih = false;
  if (b) throw Error(p(300));
  return a;
}
function Sh() {
  var a = 0 !== Kh;
  Kh = 0;
  return a;
}
function Th() {
  var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  null === O ? M.memoizedState = O = a : O = O.next = a;
  return O;
}
function Uh() {
  if (null === N) {
    var a = M.alternate;
    a = null !== a ? a.memoizedState : null;
  } else a = N.next;
  var b = null === O ? M.memoizedState : O.next;
  if (null !== b) O = b, N = a;
  else {
    if (null === a) throw Error(p(310));
    N = a;
    a = { memoizedState: N.memoizedState, baseState: N.baseState, baseQueue: N.baseQueue, queue: N.queue, next: null };
    null === O ? M.memoizedState = O = a : O = O.next = a;
  }
  return O;
}
function Vh(a, b) {
  return "function" === typeof b ? b(a) : b;
}
function Wh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = N, e = d.baseQueue, f2 = c.pending;
  if (null !== f2) {
    if (null !== e) {
      var g = e.next;
      e.next = f2.next;
      f2.next = g;
    }
    d.baseQueue = e = f2;
    c.pending = null;
  }
  if (null !== e) {
    f2 = e.next;
    d = d.baseState;
    var h = g = null, k2 = null, l2 = f2;
    do {
      var m2 = l2.lane;
      if ((Hh & m2) === m2) null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d = l2.hasEagerState ? l2.eagerState : a(d, l2.action);
      else {
        var q2 = {
          lane: m2,
          action: l2.action,
          hasEagerState: l2.hasEagerState,
          eagerState: l2.eagerState,
          next: null
        };
        null === k2 ? (h = k2 = q2, g = d) : k2 = k2.next = q2;
        M.lanes |= m2;
        rh |= m2;
      }
      l2 = l2.next;
    } while (null !== l2 && l2 !== f2);
    null === k2 ? g = d : k2.next = h;
    He(d, b.memoizedState) || (dh = true);
    b.memoizedState = d;
    b.baseState = g;
    b.baseQueue = k2;
    c.lastRenderedState = d;
  }
  a = c.interleaved;
  if (null !== a) {
    e = a;
    do
      f2 = e.lane, M.lanes |= f2, rh |= f2, e = e.next;
    while (e !== a);
  } else null === e && (c.lanes = 0);
  return [b.memoizedState, c.dispatch];
}
function Xh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = c.dispatch, e = c.pending, f2 = b.memoizedState;
  if (null !== e) {
    c.pending = null;
    var g = e = e.next;
    do
      f2 = a(f2, g.action), g = g.next;
    while (g !== e);
    He(f2, b.memoizedState) || (dh = true);
    b.memoizedState = f2;
    null === b.baseQueue && (b.baseState = f2);
    c.lastRenderedState = f2;
  }
  return [f2, d];
}
function Yh() {
}
function Zh(a, b) {
  var c = M, d = Uh(), e = b(), f2 = !He(d.memoizedState, e);
  f2 && (d.memoizedState = e, dh = true);
  d = d.queue;
  $h(ai.bind(null, c, d, a), [a]);
  if (d.getSnapshot !== b || f2 || null !== O && O.memoizedState.tag & 1) {
    c.flags |= 2048;
    bi(9, ci.bind(null, c, d, e, b), void 0, null);
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(c, b, e);
  }
  return e;
}
function di(a, b, c) {
  a.flags |= 16384;
  a = { getSnapshot: b, value: c };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
}
function ci(a, b, c, d) {
  b.value = c;
  b.getSnapshot = d;
  ei(b) && fi(a);
}
function ai(a, b, c) {
  return c(function() {
    ei(b) && fi(a);
  });
}
function ei(a) {
  var b = a.getSnapshot;
  a = a.value;
  try {
    var c = b();
    return !He(a, c);
  } catch (d) {
    return true;
  }
}
function fi(a) {
  var b = ih(a, 1);
  null !== b && gi(b, a, 1, -1);
}
function hi(a) {
  var b = Th();
  "function" === typeof a && (a = a());
  b.memoizedState = b.baseState = a;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a };
  b.queue = a;
  a = a.dispatch = ii.bind(null, M, a);
  return [b.memoizedState, a];
}
function bi(a, b, c, d) {
  a = { tag: a, create: b, destroy: c, deps: d, next: null };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
  return a;
}
function ji() {
  return Uh().memoizedState;
}
function ki(a, b, c, d) {
  var e = Th();
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, void 0, void 0 === d ? null : d);
}
function li(a, b, c, d) {
  var e = Uh();
  d = void 0 === d ? null : d;
  var f2 = void 0;
  if (null !== N) {
    var g = N.memoizedState;
    f2 = g.destroy;
    if (null !== d && Mh(d, g.deps)) {
      e.memoizedState = bi(b, c, f2, d);
      return;
    }
  }
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, f2, d);
}
function mi(a, b) {
  return ki(8390656, 8, a, b);
}
function $h(a, b) {
  return li(2048, 8, a, b);
}
function ni(a, b) {
  return li(4, 2, a, b);
}
function oi(a, b) {
  return li(4, 4, a, b);
}
function pi(a, b) {
  if ("function" === typeof b) return a = a(), b(a), function() {
    b(null);
  };
  if (null !== b && void 0 !== b) return a = a(), b.current = a, function() {
    b.current = null;
  };
}
function qi(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return li(4, 4, pi.bind(null, b, a), c);
}
function ri() {
}
function si(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  c.memoizedState = [a, b];
  return a;
}
function ti(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  a = a();
  c.memoizedState = [a, b];
  return a;
}
function ui(a, b, c) {
  if (0 === (Hh & 21)) return a.baseState && (a.baseState = false, dh = true), a.memoizedState = c;
  He(c, b) || (c = yc(), M.lanes |= c, rh |= c, a.baseState = true);
  return b;
}
function vi(a, b) {
  var c = C;
  C = 0 !== c && 4 > c ? c : 4;
  a(true);
  var d = Gh.transition;
  Gh.transition = {};
  try {
    a(false), b();
  } finally {
    C = c, Gh.transition = d;
  }
}
function wi() {
  return Uh().memoizedState;
}
function xi(a, b, c) {
  var d = yi(a);
  c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, c);
  else if (c = hh(a, b, c, d), null !== c) {
    var e = R();
    gi(c, a, d, e);
    Bi(c, b, d);
  }
}
function ii(a, b, c) {
  var d = yi(a), e = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, e);
  else {
    var f2 = a.alternate;
    if (0 === a.lanes && (null === f2 || 0 === f2.lanes) && (f2 = b.lastRenderedReducer, null !== f2)) try {
      var g = b.lastRenderedState, h = f2(g, c);
      e.hasEagerState = true;
      e.eagerState = h;
      if (He(h, g)) {
        var k2 = b.interleaved;
        null === k2 ? (e.next = e, gh(b)) : (e.next = k2.next, k2.next = e);
        b.interleaved = e;
        return;
      }
    } catch (l2) {
    } finally {
    }
    c = hh(a, b, e, d);
    null !== c && (e = R(), gi(c, a, d, e), Bi(c, b, d));
  }
}
function zi(a) {
  var b = a.alternate;
  return a === M || null !== b && b === M;
}
function Ai(a, b) {
  Jh = Ih = true;
  var c = a.pending;
  null === c ? b.next = b : (b.next = c.next, c.next = b);
  a.pending = b;
}
function Bi(a, b, c) {
  if (0 !== (c & 4194240)) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
var Rh = { readContext: eh, useCallback: P, useContext: P, useEffect: P, useImperativeHandle: P, useInsertionEffect: P, useLayoutEffect: P, useMemo: P, useReducer: P, useRef: P, useState: P, useDebugValue: P, useDeferredValue: P, useTransition: P, useMutableSource: P, useSyncExternalStore: P, useId: P, unstable_isNewReconciler: false }, Oh = { readContext: eh, useCallback: function(a, b) {
  Th().memoizedState = [a, void 0 === b ? null : b];
  return a;
}, useContext: eh, useEffect: mi, useImperativeHandle: function(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return ki(
    4194308,
    4,
    pi.bind(null, b, a),
    c
  );
}, useLayoutEffect: function(a, b) {
  return ki(4194308, 4, a, b);
}, useInsertionEffect: function(a, b) {
  return ki(4, 2, a, b);
}, useMemo: function(a, b) {
  var c = Th();
  b = void 0 === b ? null : b;
  a = a();
  c.memoizedState = [a, b];
  return a;
}, useReducer: function(a, b, c) {
  var d = Th();
  b = void 0 !== c ? c(b) : b;
  d.memoizedState = d.baseState = b;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
  d.queue = a;
  a = a.dispatch = xi.bind(null, M, a);
  return [d.memoizedState, a];
}, useRef: function(a) {
  var b = Th();
  a = { current: a };
  return b.memoizedState = a;
}, useState: hi, useDebugValue: ri, useDeferredValue: function(a) {
  return Th().memoizedState = a;
}, useTransition: function() {
  var a = hi(false), b = a[0];
  a = vi.bind(null, a[1]);
  Th().memoizedState = a;
  return [b, a];
}, useMutableSource: function() {
}, useSyncExternalStore: function(a, b, c) {
  var d = M, e = Th();
  if (I) {
    if (void 0 === c) throw Error(p(407));
    c = c();
  } else {
    c = b();
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(d, b, c);
  }
  e.memoizedState = c;
  var f2 = { value: c, getSnapshot: b };
  e.queue = f2;
  mi(ai.bind(
    null,
    d,
    f2,
    a
  ), [a]);
  d.flags |= 2048;
  bi(9, ci.bind(null, d, f2, c, b), void 0, null);
  return c;
}, useId: function() {
  var a = Th(), b = Q.identifierPrefix;
  if (I) {
    var c = sg;
    var d = rg;
    c = (d & ~(1 << 32 - oc(d) - 1)).toString(32) + c;
    b = ":" + b + "R" + c;
    c = Kh++;
    0 < c && (b += "H" + c.toString(32));
    b += ":";
  } else c = Lh++, b = ":" + b + "r" + c.toString(32) + ":";
  return a.memoizedState = b;
}, unstable_isNewReconciler: false }, Ph = {
  readContext: eh,
  useCallback: si,
  useContext: eh,
  useEffect: $h,
  useImperativeHandle: qi,
  useInsertionEffect: ni,
  useLayoutEffect: oi,
  useMemo: ti,
  useReducer: Wh,
  useRef: ji,
  useState: function() {
    return Wh(Vh);
  },
  useDebugValue: ri,
  useDeferredValue: function(a) {
    var b = Uh();
    return ui(b, N.memoizedState, a);
  },
  useTransition: function() {
    var a = Wh(Vh)[0], b = Uh().memoizedState;
    return [a, b];
  },
  useMutableSource: Yh,
  useSyncExternalStore: Zh,
  useId: wi,
  unstable_isNewReconciler: false
}, Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
  return Xh(Vh);
}, useDebugValue: ri, useDeferredValue: function(a) {
  var b = Uh();
  return null === N ? b.memoizedState = a : ui(b, N.memoizedState, a);
}, useTransition: function() {
  var a = Xh(Vh)[0], b = Uh().memoizedState;
  return [a, b];
}, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
function Ci(a, b) {
  if (a && a.defaultProps) {
    b = A({}, b);
    a = a.defaultProps;
    for (var c in a) void 0 === b[c] && (b[c] = a[c]);
    return b;
  }
  return b;
}
function Di(a, b, c, d) {
  b = a.memoizedState;
  c = c(d, b);
  c = null === c || void 0 === c ? b : A({}, b, c);
  a.memoizedState = c;
  0 === a.lanes && (a.updateQueue.baseState = c);
}
var Ei = { isMounted: function(a) {
  return (a = a._reactInternals) ? Vb(a) === a : false;
}, enqueueSetState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueReplaceState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.tag = 1;
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueForceUpdate: function(a, b) {
  a = a._reactInternals;
  var c = R(), d = yi(a), e = mh(c, d);
  e.tag = 2;
  void 0 !== b && null !== b && (e.callback = b);
  b = nh(a, e, d);
  null !== b && (gi(b, a, d, c), oh(b, a, d));
} };
function Fi(a, b, c, d, e, f2, g) {
  a = a.stateNode;
  return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f2, g) : b.prototype && b.prototype.isPureReactComponent ? !Ie(c, d) || !Ie(e, f2) : true;
}
function Gi(a, b, c) {
  var d = false, e = Vf;
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? f2 = eh(f2) : (e = Zf(b) ? Xf : H.current, d = b.contextTypes, f2 = (d = null !== d && void 0 !== d) ? Yf(a, e) : Vf);
  b = new b(c, f2);
  a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
  b.updater = Ei;
  a.stateNode = b;
  b._reactInternals = a;
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f2);
  return b;
}
function Hi(a, b, c, d) {
  a = b.state;
  "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
  "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
  b.state !== a && Ei.enqueueReplaceState(b, b.state, null);
}
function Ii(a, b, c, d) {
  var e = a.stateNode;
  e.props = c;
  e.state = a.memoizedState;
  e.refs = {};
  kh(a);
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? e.context = eh(f2) : (f2 = Zf(b) ? Xf : H.current, e.context = Yf(a, f2));
  e.state = a.memoizedState;
  f2 = b.getDerivedStateFromProps;
  "function" === typeof f2 && (Di(a, b, f2, c), e.state = a.memoizedState);
  "function" === typeof b.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b !== e.state && Ei.enqueueReplaceState(e, e.state, null), qh(a, c, e, d), e.state = a.memoizedState);
  "function" === typeof e.componentDidMount && (a.flags |= 4194308);
}
function Ji(a, b) {
  try {
    var c = "", d = b;
    do
      c += Pa(d), d = d.return;
    while (d);
    var e = c;
  } catch (f2) {
    e = "\nError generating stack: " + f2.message + "\n" + f2.stack;
  }
  return { value: a, source: b, stack: e, digest: null };
}
function Ki(a, b, c) {
  return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
}
function Li(a, b) {
  try {
    console.error(b.value);
  } catch (c) {
    setTimeout(function() {
      throw c;
    });
  }
}
var Mi = "function" === typeof WeakMap ? WeakMap : Map;
function Ni(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  c.payload = { element: null };
  var d = b.value;
  c.callback = function() {
    Oi || (Oi = true, Pi = d);
    Li(a, b);
  };
  return c;
}
function Qi(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  var d = a.type.getDerivedStateFromError;
  if ("function" === typeof d) {
    var e = b.value;
    c.payload = function() {
      return d(e);
    };
    c.callback = function() {
      Li(a, b);
    };
  }
  var f2 = a.stateNode;
  null !== f2 && "function" === typeof f2.componentDidCatch && (c.callback = function() {
    Li(a, b);
    "function" !== typeof d && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
    var c2 = b.stack;
    this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
  });
  return c;
}
function Si(a, b, c) {
  var d = a.pingCache;
  if (null === d) {
    d = a.pingCache = new Mi();
    var e = /* @__PURE__ */ new Set();
    d.set(b, e);
  } else e = d.get(b), void 0 === e && (e = /* @__PURE__ */ new Set(), d.set(b, e));
  e.has(c) || (e.add(c), a = Ti.bind(null, a, b, c), b.then(a, a));
}
function Ui(a) {
  do {
    var b;
    if (b = 13 === a.tag) b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
    if (b) return a;
    a = a.return;
  } while (null !== a);
  return null;
}
function Vi(a, b, c, d, e) {
  if (0 === (a.mode & 1)) return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = mh(-1, 1), b.tag = 2, nh(c, b, 1))), c.lanes |= 1), a;
  a.flags |= 65536;
  a.lanes = e;
  return a;
}
var Wi = ua.ReactCurrentOwner, dh = false;
function Xi(a, b, c, d) {
  b.child = null === a ? Vg(b, null, c, d) : Ug(b, a.child, c, d);
}
function Yi(a, b, c, d, e) {
  c = c.render;
  var f2 = b.ref;
  ch(b, e);
  d = Nh(a, b, c, d, f2, e);
  c = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && c && vg(b);
  b.flags |= 1;
  Xi(a, b, d, e);
  return b.child;
}
function $i(a, b, c, d, e) {
  if (null === a) {
    var f2 = c.type;
    if ("function" === typeof f2 && !aj(f2) && void 0 === f2.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = f2, bj(a, b, f2, d, e);
    a = Rg(c.type, null, d, b, b.mode, e);
    a.ref = b.ref;
    a.return = b;
    return b.child = a;
  }
  f2 = a.child;
  if (0 === (a.lanes & e)) {
    var g = f2.memoizedProps;
    c = c.compare;
    c = null !== c ? c : Ie;
    if (c(g, d) && a.ref === b.ref) return Zi(a, b, e);
  }
  b.flags |= 1;
  a = Pg(f2, d);
  a.ref = b.ref;
  a.return = b;
  return b.child = a;
}
function bj(a, b, c, d, e) {
  if (null !== a) {
    var f2 = a.memoizedProps;
    if (Ie(f2, d) && a.ref === b.ref) if (dh = false, b.pendingProps = d = f2, 0 !== (a.lanes & e)) 0 !== (a.flags & 131072) && (dh = true);
    else return b.lanes = a.lanes, Zi(a, b, e);
  }
  return cj(a, b, c, d, e);
}
function dj(a, b, c) {
  var d = b.pendingProps, e = d.children, f2 = null !== a ? a.memoizedState : null;
  if ("hidden" === d.mode) if (0 === (b.mode & 1)) b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c;
  else {
    if (0 === (c & 1073741824)) return a = null !== f2 ? f2.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, G(ej, fj), fj |= a, null;
    b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
    d = null !== f2 ? f2.baseLanes : c;
    G(ej, fj);
    fj |= d;
  }
  else null !== f2 ? (d = f2.baseLanes | c, b.memoizedState = null) : d = c, G(ej, fj), fj |= d;
  Xi(a, b, e, c);
  return b.child;
}
function gj(a, b) {
  var c = b.ref;
  if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 512, b.flags |= 2097152;
}
function cj(a, b, c, d, e) {
  var f2 = Zf(c) ? Xf : H.current;
  f2 = Yf(b, f2);
  ch(b, e);
  c = Nh(a, b, c, d, f2, e);
  d = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && d && vg(b);
  b.flags |= 1;
  Xi(a, b, c, e);
  return b.child;
}
function hj(a, b, c, d, e) {
  if (Zf(c)) {
    var f2 = true;
    cg(b);
  } else f2 = false;
  ch(b, e);
  if (null === b.stateNode) ij(a, b), Gi(b, c, d), Ii(b, c, d, e), d = true;
  else if (null === a) {
    var g = b.stateNode, h = b.memoizedProps;
    g.props = h;
    var k2 = g.context, l2 = c.contextType;
    "object" === typeof l2 && null !== l2 ? l2 = eh(l2) : (l2 = Zf(c) ? Xf : H.current, l2 = Yf(b, l2));
    var m2 = c.getDerivedStateFromProps, q2 = "function" === typeof m2 || "function" === typeof g.getSnapshotBeforeUpdate;
    q2 || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k2 !== l2) && Hi(b, g, d, l2);
    jh = false;
    var r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    k2 = b.memoizedState;
    h !== d || r2 !== k2 || Wf.current || jh ? ("function" === typeof m2 && (Di(b, c, m2, d), k2 = b.memoizedState), (h = jh || Fi(b, c, h, d, r2, k2, l2)) ? (q2 || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k2), g.props = d, g.state = k2, g.context = l2, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = false);
  } else {
    g = b.stateNode;
    lh(a, b);
    h = b.memoizedProps;
    l2 = b.type === b.elementType ? h : Ci(b.type, h);
    g.props = l2;
    q2 = b.pendingProps;
    r2 = g.context;
    k2 = c.contextType;
    "object" === typeof k2 && null !== k2 ? k2 = eh(k2) : (k2 = Zf(c) ? Xf : H.current, k2 = Yf(b, k2));
    var y2 = c.getDerivedStateFromProps;
    (m2 = "function" === typeof y2 || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== q2 || r2 !== k2) && Hi(b, g, d, k2);
    jh = false;
    r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    var n2 = b.memoizedState;
    h !== q2 || r2 !== n2 || Wf.current || jh ? ("function" === typeof y2 && (Di(b, c, y2, d), n2 = b.memoizedState), (l2 = jh || Fi(b, c, l2, d, r2, n2, k2) || false) ? (m2 || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, n2, k2), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, n2, k2)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n2), g.props = d, g.state = n2, g.context = k2, d = l2) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), d = false);
  }
  return jj(a, b, c, d, f2, e);
}
function jj(a, b, c, d, e, f2) {
  gj(a, b);
  var g = 0 !== (b.flags & 128);
  if (!d && !g) return e && dg(b, c, false), Zi(a, b, f2);
  d = b.stateNode;
  Wi.current = b;
  var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
  b.flags |= 1;
  null !== a && g ? (b.child = Ug(b, a.child, null, f2), b.child = Ug(b, null, h, f2)) : Xi(a, b, h, f2);
  b.memoizedState = d.state;
  e && dg(b, c, true);
  return b.child;
}
function kj(a) {
  var b = a.stateNode;
  b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, false);
  yh(a, b.containerInfo);
}
function lj(a, b, c, d, e) {
  Ig();
  Jg(e);
  b.flags |= 256;
  Xi(a, b, c, d);
  return b.child;
}
var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
function nj(a) {
  return { baseLanes: a, cachePool: null, transitions: null };
}
function oj(a, b, c) {
  var d = b.pendingProps, e = L.current, f2 = false, g = 0 !== (b.flags & 128), h;
  (h = g) || (h = null !== a && null === a.memoizedState ? false : 0 !== (e & 2));
  if (h) f2 = true, b.flags &= -129;
  else if (null === a || null !== a.memoizedState) e |= 1;
  G(L, e & 1);
  if (null === a) {
    Eg(b);
    a = b.memoizedState;
    if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
    g = d.children;
    a = d.fallback;
    return f2 ? (d = b.mode, f2 = b.child, g = { mode: "hidden", children: g }, 0 === (d & 1) && null !== f2 ? (f2.childLanes = 0, f2.pendingProps = g) : f2 = pj(g, d, 0, null), a = Tg(a, d, c, null), f2.return = b, a.return = b, f2.sibling = a, b.child = f2, b.child.memoizedState = nj(c), b.memoizedState = mj, a) : qj(b, g);
  }
  e = a.memoizedState;
  if (null !== e && (h = e.dehydrated, null !== h)) return rj(a, b, g, d, h, e, c);
  if (f2) {
    f2 = d.fallback;
    g = b.mode;
    e = a.child;
    h = e.sibling;
    var k2 = { mode: "hidden", children: d.children };
    0 === (g & 1) && b.child !== e ? (d = b.child, d.childLanes = 0, d.pendingProps = k2, b.deletions = null) : (d = Pg(e, k2), d.subtreeFlags = e.subtreeFlags & 14680064);
    null !== h ? f2 = Pg(h, f2) : (f2 = Tg(f2, g, c, null), f2.flags |= 2);
    f2.return = b;
    d.return = b;
    d.sibling = f2;
    b.child = d;
    d = f2;
    f2 = b.child;
    g = a.child.memoizedState;
    g = null === g ? nj(c) : { baseLanes: g.baseLanes | c, cachePool: null, transitions: g.transitions };
    f2.memoizedState = g;
    f2.childLanes = a.childLanes & ~c;
    b.memoizedState = mj;
    return d;
  }
  f2 = a.child;
  a = f2.sibling;
  d = Pg(f2, { mode: "visible", children: d.children });
  0 === (b.mode & 1) && (d.lanes = c);
  d.return = b;
  d.sibling = null;
  null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
  b.child = d;
  b.memoizedState = null;
  return d;
}
function qj(a, b) {
  b = pj({ mode: "visible", children: b }, a.mode, 0, null);
  b.return = a;
  return a.child = b;
}
function sj(a, b, c, d) {
  null !== d && Jg(d);
  Ug(b, a.child, null, c);
  a = qj(b, b.pendingProps.children);
  a.flags |= 2;
  b.memoizedState = null;
  return a;
}
function rj(a, b, c, d, e, f2, g) {
  if (c) {
    if (b.flags & 256) return b.flags &= -257, d = Ki(Error(p(422))), sj(a, b, g, d);
    if (null !== b.memoizedState) return b.child = a.child, b.flags |= 128, null;
    f2 = d.fallback;
    e = b.mode;
    d = pj({ mode: "visible", children: d.children }, e, 0, null);
    f2 = Tg(f2, e, g, null);
    f2.flags |= 2;
    d.return = b;
    f2.return = b;
    d.sibling = f2;
    b.child = d;
    0 !== (b.mode & 1) && Ug(b, a.child, null, g);
    b.child.memoizedState = nj(g);
    b.memoizedState = mj;
    return f2;
  }
  if (0 === (b.mode & 1)) return sj(a, b, g, null);
  if ("$!" === e.data) {
    d = e.nextSibling && e.nextSibling.dataset;
    if (d) var h = d.dgst;
    d = h;
    f2 = Error(p(419));
    d = Ki(f2, d, void 0);
    return sj(a, b, g, d);
  }
  h = 0 !== (g & a.childLanes);
  if (dh || h) {
    d = Q;
    if (null !== d) {
      switch (g & -g) {
        case 4:
          e = 2;
          break;
        case 16:
          e = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          e = 32;
          break;
        case 536870912:
          e = 268435456;
          break;
        default:
          e = 0;
      }
      e = 0 !== (e & (d.suspendedLanes | g)) ? 0 : e;
      0 !== e && e !== f2.retryLane && (f2.retryLane = e, ih(a, e), gi(d, a, e, -1));
    }
    tj();
    d = Ki(Error(p(421)));
    return sj(a, b, g, d);
  }
  if ("$?" === e.data) return b.flags |= 128, b.child = a.child, b = uj.bind(null, a), e._reactRetry = b, null;
  a = f2.treeContext;
  yg = Lf(e.nextSibling);
  xg = b;
  I = true;
  zg = null;
  null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b);
  b = qj(b, d.children);
  b.flags |= 4096;
  return b;
}
function vj(a, b, c) {
  a.lanes |= b;
  var d = a.alternate;
  null !== d && (d.lanes |= b);
  bh(a.return, b, c);
}
function wj(a, b, c, d, e) {
  var f2 = a.memoizedState;
  null === f2 ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e } : (f2.isBackwards = b, f2.rendering = null, f2.renderingStartTime = 0, f2.last = d, f2.tail = c, f2.tailMode = e);
}
function xj(a, b, c) {
  var d = b.pendingProps, e = d.revealOrder, f2 = d.tail;
  Xi(a, b, d.children, c);
  d = L.current;
  if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 128;
  else {
    if (null !== a && 0 !== (a.flags & 128)) a: for (a = b.child; null !== a; ) {
      if (13 === a.tag) null !== a.memoizedState && vj(a, c, b);
      else if (19 === a.tag) vj(a, c, b);
      else if (null !== a.child) {
        a.child.return = a;
        a = a.child;
        continue;
      }
      if (a === b) break a;
      for (; null === a.sibling; ) {
        if (null === a.return || a.return === b) break a;
        a = a.return;
      }
      a.sibling.return = a.return;
      a = a.sibling;
    }
    d &= 1;
  }
  G(L, d);
  if (0 === (b.mode & 1)) b.memoizedState = null;
  else switch (e) {
    case "forwards":
      c = b.child;
      for (e = null; null !== c; ) a = c.alternate, null !== a && null === Ch(a) && (e = c), c = c.sibling;
      c = e;
      null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
      wj(b, false, e, c, f2);
      break;
    case "backwards":
      c = null;
      e = b.child;
      for (b.child = null; null !== e; ) {
        a = e.alternate;
        if (null !== a && null === Ch(a)) {
          b.child = e;
          break;
        }
        a = e.sibling;
        e.sibling = c;
        c = e;
        e = a;
      }
      wj(b, true, c, null, f2);
      break;
    case "together":
      wj(b, false, null, null, void 0);
      break;
    default:
      b.memoizedState = null;
  }
  return b.child;
}
function ij(a, b) {
  0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
}
function Zi(a, b, c) {
  null !== a && (b.dependencies = a.dependencies);
  rh |= b.lanes;
  if (0 === (c & b.childLanes)) return null;
  if (null !== a && b.child !== a.child) throw Error(p(153));
  if (null !== b.child) {
    a = b.child;
    c = Pg(a, a.pendingProps);
    b.child = c;
    for (c.return = b; null !== a.sibling; ) a = a.sibling, c = c.sibling = Pg(a, a.pendingProps), c.return = b;
    c.sibling = null;
  }
  return b.child;
}
function yj(a, b, c) {
  switch (b.tag) {
    case 3:
      kj(b);
      Ig();
      break;
    case 5:
      Ah(b);
      break;
    case 1:
      Zf(b.type) && cg(b);
      break;
    case 4:
      yh(b, b.stateNode.containerInfo);
      break;
    case 10:
      var d = b.type._context, e = b.memoizedProps.value;
      G(Wg, d._currentValue);
      d._currentValue = e;
      break;
    case 13:
      d = b.memoizedState;
      if (null !== d) {
        if (null !== d.dehydrated) return G(L, L.current & 1), b.flags |= 128, null;
        if (0 !== (c & b.child.childLanes)) return oj(a, b, c);
        G(L, L.current & 1);
        a = Zi(a, b, c);
        return null !== a ? a.sibling : null;
      }
      G(L, L.current & 1);
      break;
    case 19:
      d = 0 !== (c & b.childLanes);
      if (0 !== (a.flags & 128)) {
        if (d) return xj(a, b, c);
        b.flags |= 128;
      }
      e = b.memoizedState;
      null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
      G(L, L.current);
      if (d) break;
      else return null;
    case 22:
    case 23:
      return b.lanes = 0, dj(a, b, c);
  }
  return Zi(a, b, c);
}
var zj, Aj, Bj, Cj;
zj = function(a, b) {
  for (var c = b.child; null !== c; ) {
    if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode);
    else if (4 !== c.tag && null !== c.child) {
      c.child.return = c;
      c = c.child;
      continue;
    }
    if (c === b) break;
    for (; null === c.sibling; ) {
      if (null === c.return || c.return === b) return;
      c = c.return;
    }
    c.sibling.return = c.return;
    c = c.sibling;
  }
};
Aj = function() {
};
Bj = function(a, b, c, d) {
  var e = a.memoizedProps;
  if (e !== d) {
    a = b.stateNode;
    xh(uh.current);
    var f2 = null;
    switch (c) {
      case "input":
        e = Ya(a, e);
        d = Ya(a, d);
        f2 = [];
        break;
      case "select":
        e = A({}, e, { value: void 0 });
        d = A({}, d, { value: void 0 });
        f2 = [];
        break;
      case "textarea":
        e = gb(a, e);
        d = gb(a, d);
        f2 = [];
        break;
      default:
        "function" !== typeof e.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
    }
    ub(c, d);
    var g;
    c = null;
    for (l2 in e) if (!d.hasOwnProperty(l2) && e.hasOwnProperty(l2) && null != e[l2]) if ("style" === l2) {
      var h = e[l2];
      for (g in h) h.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
    } else "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f2 || (f2 = []) : (f2 = f2 || []).push(l2, null));
    for (l2 in d) {
      var k2 = d[l2];
      h = null != e ? e[l2] : void 0;
      if (d.hasOwnProperty(l2) && k2 !== h && (null != k2 || null != h)) if ("style" === l2) if (h) {
        for (g in h) !h.hasOwnProperty(g) || k2 && k2.hasOwnProperty(g) || (c || (c = {}), c[g] = "");
        for (g in k2) k2.hasOwnProperty(g) && h[g] !== k2[g] && (c || (c = {}), c[g] = k2[g]);
      } else c || (f2 || (f2 = []), f2.push(
        l2,
        c
      )), c = k2;
      else "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h = h ? h.__html : void 0, null != k2 && h !== k2 && (f2 = f2 || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f2 = f2 || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D("scroll", a), f2 || h === k2 || (f2 = [])) : (f2 = f2 || []).push(l2, k2));
    }
    c && (f2 = f2 || []).push("style", c);
    var l2 = f2;
    if (b.updateQueue = l2) b.flags |= 4;
  }
};
Cj = function(a, b, c, d) {
  c !== d && (b.flags |= 4);
};
function Dj(a, b) {
  if (!I) switch (a.tailMode) {
    case "hidden":
      b = a.tail;
      for (var c = null; null !== b; ) null !== b.alternate && (c = b), b = b.sibling;
      null === c ? a.tail = null : c.sibling = null;
      break;
    case "collapsed":
      c = a.tail;
      for (var d = null; null !== c; ) null !== c.alternate && (d = c), c = c.sibling;
      null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
  }
}
function S(a) {
  var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
  if (b) for (var e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags & 14680064, d |= e.flags & 14680064, e.return = a, e = e.sibling;
  else for (e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags, d |= e.flags, e.return = a, e = e.sibling;
  a.subtreeFlags |= d;
  a.childLanes = c;
  return b;
}
function Ej(a, b, c) {
  var d = b.pendingProps;
  wg(b);
  switch (b.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return S(b), null;
    case 1:
      return Zf(b.type) && $f(), S(b), null;
    case 3:
      d = b.stateNode;
      zh();
      E(Wf);
      E(H);
      Eh();
      d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
      if (null === a || null === a.child) Gg(b) ? b.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== zg && (Fj(zg), zg = null));
      Aj(a, b);
      S(b);
      return null;
    case 5:
      Bh(b);
      var e = xh(wh.current);
      c = b.type;
      if (null !== a && null != b.stateNode) Bj(a, b, c, d, e), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      else {
        if (!d) {
          if (null === b.stateNode) throw Error(p(166));
          S(b);
          return null;
        }
        a = xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.type;
          var f2 = b.memoizedProps;
          d[Of] = b;
          d[Pf] = f2;
          a = 0 !== (b.mode & 1);
          switch (c) {
            case "dialog":
              D("cancel", d);
              D("close", d);
              break;
            case "iframe":
            case "object":
            case "embed":
              D("load", d);
              break;
            case "video":
            case "audio":
              for (e = 0; e < lf.length; e++) D(lf[e], d);
              break;
            case "source":
              D("error", d);
              break;
            case "img":
            case "image":
            case "link":
              D(
                "error",
                d
              );
              D("load", d);
              break;
            case "details":
              D("toggle", d);
              break;
            case "input":
              Za(d, f2);
              D("invalid", d);
              break;
            case "select":
              d._wrapperState = { wasMultiple: !!f2.multiple };
              D("invalid", d);
              break;
            case "textarea":
              hb(d, f2), D("invalid", d);
          }
          ub(c, f2);
          e = null;
          for (var g in f2) if (f2.hasOwnProperty(g)) {
            var h = f2[g];
            "children" === g ? "string" === typeof h ? d.textContent !== h && (true !== f2.suppressHydrationWarning && Af(d.textContent, h, a), e = ["children", h]) : "number" === typeof h && d.textContent !== "" + h && (true !== f2.suppressHydrationWarning && Af(
              d.textContent,
              h,
              a
            ), e = ["children", "" + h]) : ea.hasOwnProperty(g) && null != h && "onScroll" === g && D("scroll", d);
          }
          switch (c) {
            case "input":
              Va(d);
              db(d, f2, true);
              break;
            case "textarea":
              Va(d);
              jb(d);
              break;
            case "select":
            case "option":
              break;
            default:
              "function" === typeof f2.onClick && (d.onclick = Bf);
          }
          d = e;
          b.updateQueue = d;
          null !== d && (b.flags |= 4);
        } else {
          g = 9 === e.nodeType ? e : e.ownerDocument;
          "http://www.w3.org/1999/xhtml" === a && (a = kb(c));
          "http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, { is: d.is }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = true : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
          a[Of] = b;
          a[Pf] = d;
          zj(a, b, false, false);
          b.stateNode = a;
          a: {
            g = vb(c, d);
            switch (c) {
              case "dialog":
                D("cancel", a);
                D("close", a);
                e = d;
                break;
              case "iframe":
              case "object":
              case "embed":
                D("load", a);
                e = d;
                break;
              case "video":
              case "audio":
                for (e = 0; e < lf.length; e++) D(lf[e], a);
                e = d;
                break;
              case "source":
                D("error", a);
                e = d;
                break;
              case "img":
              case "image":
              case "link":
                D(
                  "error",
                  a
                );
                D("load", a);
                e = d;
                break;
              case "details":
                D("toggle", a);
                e = d;
                break;
              case "input":
                Za(a, d);
                e = Ya(a, d);
                D("invalid", a);
                break;
              case "option":
                e = d;
                break;
              case "select":
                a._wrapperState = { wasMultiple: !!d.multiple };
                e = A({}, d, { value: void 0 });
                D("invalid", a);
                break;
              case "textarea":
                hb(a, d);
                e = gb(a, d);
                D("invalid", a);
                break;
              default:
                e = d;
            }
            ub(c, e);
            h = e;
            for (f2 in h) if (h.hasOwnProperty(f2)) {
              var k2 = h[f2];
              "style" === f2 ? sb(a, k2) : "dangerouslySetInnerHTML" === f2 ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a, k2)) : "children" === f2 ? "string" === typeof k2 ? ("textarea" !== c || "" !== k2) && ob(a, k2) : "number" === typeof k2 && ob(a, "" + k2) : "suppressContentEditableWarning" !== f2 && "suppressHydrationWarning" !== f2 && "autoFocus" !== f2 && (ea.hasOwnProperty(f2) ? null != k2 && "onScroll" === f2 && D("scroll", a) : null != k2 && ta(a, f2, k2, g));
            }
            switch (c) {
              case "input":
                Va(a);
                db(a, d, false);
                break;
              case "textarea":
                Va(a);
                jb(a);
                break;
              case "option":
                null != d.value && a.setAttribute("value", "" + Sa(d.value));
                break;
              case "select":
                a.multiple = !!d.multiple;
                f2 = d.value;
                null != f2 ? fb(a, !!d.multiple, f2, false) : null != d.defaultValue && fb(
                  a,
                  !!d.multiple,
                  d.defaultValue,
                  true
                );
                break;
              default:
                "function" === typeof e.onClick && (a.onclick = Bf);
            }
            switch (c) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                d = !!d.autoFocus;
                break a;
              case "img":
                d = true;
                break a;
              default:
                d = false;
            }
          }
          d && (b.flags |= 4);
        }
        null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      }
      S(b);
      return null;
    case 6:
      if (a && null != b.stateNode) Cj(a, b, a.memoizedProps, d);
      else {
        if ("string" !== typeof d && null === b.stateNode) throw Error(p(166));
        c = xh(wh.current);
        xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.memoizedProps;
          d[Of] = b;
          if (f2 = d.nodeValue !== c) {
            if (a = xg, null !== a) switch (a.tag) {
              case 3:
                Af(d.nodeValue, c, 0 !== (a.mode & 1));
                break;
              case 5:
                true !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
            }
          }
          f2 && (b.flags |= 4);
        } else d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
      }
      S(b);
      return null;
    case 13:
      E(L);
      d = b.memoizedState;
      if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
        if (I && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128)) Hg(), Ig(), b.flags |= 98560, f2 = false;
        else if (f2 = Gg(b), null !== d && null !== d.dehydrated) {
          if (null === a) {
            if (!f2) throw Error(p(318));
            f2 = b.memoizedState;
            f2 = null !== f2 ? f2.dehydrated : null;
            if (!f2) throw Error(p(317));
            f2[Of] = b;
          } else Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
          S(b);
          f2 = false;
        } else null !== zg && (Fj(zg), zg = null), f2 = true;
        if (!f2) return b.flags & 65536 ? b : null;
      }
      if (0 !== (b.flags & 128)) return b.lanes = c, b;
      d = null !== d;
      d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (L.current & 1) ? 0 === T$1 && (T$1 = 3) : tj()));
      null !== b.updateQueue && (b.flags |= 4);
      S(b);
      return null;
    case 4:
      return zh(), Aj(a, b), null === a && sf(b.stateNode.containerInfo), S(b), null;
    case 10:
      return ah(b.type._context), S(b), null;
    case 17:
      return Zf(b.type) && $f(), S(b), null;
    case 19:
      E(L);
      f2 = b.memoizedState;
      if (null === f2) return S(b), null;
      d = 0 !== (b.flags & 128);
      g = f2.rendering;
      if (null === g) if (d) Dj(f2, false);
      else {
        if (0 !== T$1 || null !== a && 0 !== (a.flags & 128)) for (a = b.child; null !== a; ) {
          g = Ch(a);
          if (null !== g) {
            b.flags |= 128;
            Dj(f2, false);
            d = g.updateQueue;
            null !== d && (b.updateQueue = d, b.flags |= 4);
            b.subtreeFlags = 0;
            d = c;
            for (c = b.child; null !== c; ) f2 = c, a = d, f2.flags &= 14680066, g = f2.alternate, null === g ? (f2.childLanes = 0, f2.lanes = a, f2.child = null, f2.subtreeFlags = 0, f2.memoizedProps = null, f2.memoizedState = null, f2.updateQueue = null, f2.dependencies = null, f2.stateNode = null) : (f2.childLanes = g.childLanes, f2.lanes = g.lanes, f2.child = g.child, f2.subtreeFlags = 0, f2.deletions = null, f2.memoizedProps = g.memoizedProps, f2.memoizedState = g.memoizedState, f2.updateQueue = g.updateQueue, f2.type = g.type, a = g.dependencies, f2.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c = c.sibling;
            G(L, L.current & 1 | 2);
            return b.child;
          }
          a = a.sibling;
        }
        null !== f2.tail && B() > Gj && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
      }
      else {
        if (!d) if (a = Ch(g), null !== a) {
          if (b.flags |= 128, d = true, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Dj(f2, true), null === f2.tail && "hidden" === f2.tailMode && !g.alternate && !I) return S(b), null;
        } else 2 * B() - f2.renderingStartTime > Gj && 1073741824 !== c && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
        f2.isBackwards ? (g.sibling = b.child, b.child = g) : (c = f2.last, null !== c ? c.sibling = g : b.child = g, f2.last = g);
      }
      if (null !== f2.tail) return b = f2.tail, f2.rendering = b, f2.tail = b.sibling, f2.renderingStartTime = B(), b.sibling = null, c = L.current, G(L, d ? c & 1 | 2 : c & 1), b;
      S(b);
      return null;
    case 22:
    case 23:
      return Hj(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (fj & 1073741824) && (S(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S(b), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(p(156, b.tag));
}
function Ij(a, b) {
  wg(b);
  switch (b.tag) {
    case 1:
      return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 3:
      return zh(), E(Wf), E(H), Eh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
    case 5:
      return Bh(b), null;
    case 13:
      E(L);
      a = b.memoizedState;
      if (null !== a && null !== a.dehydrated) {
        if (null === b.alternate) throw Error(p(340));
        Ig();
      }
      a = b.flags;
      return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 19:
      return E(L), null;
    case 4:
      return zh(), null;
    case 10:
      return ah(b.type._context), null;
    case 22:
    case 23:
      return Hj(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Jj = false, U = false, Kj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
function Lj(a, b) {
  var c = a.ref;
  if (null !== c) if ("function" === typeof c) try {
    c(null);
  } catch (d) {
    W(a, b, d);
  }
  else c.current = null;
}
function Mj(a, b, c) {
  try {
    c();
  } catch (d) {
    W(a, b, d);
  }
}
var Nj = false;
function Oj(a, b) {
  Cf = dd;
  a = Me();
  if (Ne(a)) {
    if ("selectionStart" in a) var c = { start: a.selectionStart, end: a.selectionEnd };
    else a: {
      c = (c = a.ownerDocument) && c.defaultView || window;
      var d = c.getSelection && c.getSelection();
      if (d && 0 !== d.rangeCount) {
        c = d.anchorNode;
        var e = d.anchorOffset, f2 = d.focusNode;
        d = d.focusOffset;
        try {
          c.nodeType, f2.nodeType;
        } catch (F2) {
          c = null;
          break a;
        }
        var g = 0, h = -1, k2 = -1, l2 = 0, m2 = 0, q2 = a, r2 = null;
        b: for (; ; ) {
          for (var y2; ; ) {
            q2 !== c || 0 !== e && 3 !== q2.nodeType || (h = g + e);
            q2 !== f2 || 0 !== d && 3 !== q2.nodeType || (k2 = g + d);
            3 === q2.nodeType && (g += q2.nodeValue.length);
            if (null === (y2 = q2.firstChild)) break;
            r2 = q2;
            q2 = y2;
          }
          for (; ; ) {
            if (q2 === a) break b;
            r2 === c && ++l2 === e && (h = g);
            r2 === f2 && ++m2 === d && (k2 = g);
            if (null !== (y2 = q2.nextSibling)) break;
            q2 = r2;
            r2 = q2.parentNode;
          }
          q2 = y2;
        }
        c = -1 === h || -1 === k2 ? null : { start: h, end: k2 };
      } else c = null;
    }
    c = c || { start: 0, end: 0 };
  } else c = null;
  Df = { focusedElem: a, selectionRange: c };
  dd = false;
  for (V = b; null !== V; ) if (b = V, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a) a.return = b, V = a;
  else for (; null !== V; ) {
    b = V;
    try {
      var n2 = b.alternate;
      if (0 !== (b.flags & 1024)) switch (b.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (null !== n2) {
            var t2 = n2.memoizedProps, J2 = n2.memoizedState, x2 = b.stateNode, w2 = x2.getSnapshotBeforeUpdate(b.elementType === b.type ? t2 : Ci(b.type, t2), J2);
            x2.__reactInternalSnapshotBeforeUpdate = w2;
          }
          break;
        case 3:
          var u2 = b.stateNode.containerInfo;
          1 === u2.nodeType ? u2.textContent = "" : 9 === u2.nodeType && u2.documentElement && u2.removeChild(u2.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(p(163));
      }
    } catch (F2) {
      W(b, b.return, F2);
    }
    a = b.sibling;
    if (null !== a) {
      a.return = b.return;
      V = a;
      break;
    }
    V = b.return;
  }
  n2 = Nj;
  Nj = false;
  return n2;
}
function Pj(a, b, c) {
  var d = b.updateQueue;
  d = null !== d ? d.lastEffect : null;
  if (null !== d) {
    var e = d = d.next;
    do {
      if ((e.tag & a) === a) {
        var f2 = e.destroy;
        e.destroy = void 0;
        void 0 !== f2 && Mj(b, c, f2);
      }
      e = e.next;
    } while (e !== d);
  }
}
function Qj(a, b) {
  b = b.updateQueue;
  b = null !== b ? b.lastEffect : null;
  if (null !== b) {
    var c = b = b.next;
    do {
      if ((c.tag & a) === a) {
        var d = c.create;
        c.destroy = d();
      }
      c = c.next;
    } while (c !== b);
  }
}
function Rj(a) {
  var b = a.ref;
  if (null !== b) {
    var c = a.stateNode;
    switch (a.tag) {
      case 5:
        a = c;
        break;
      default:
        a = c;
    }
    "function" === typeof b ? b(a) : b.current = a;
  }
}
function Sj(a) {
  var b = a.alternate;
  null !== b && (a.alternate = null, Sj(b));
  a.child = null;
  a.deletions = null;
  a.sibling = null;
  5 === a.tag && (b = a.stateNode, null !== b && (delete b[Of], delete b[Pf], delete b[of], delete b[Qf], delete b[Rf]));
  a.stateNode = null;
  a.return = null;
  a.dependencies = null;
  a.memoizedProps = null;
  a.memoizedState = null;
  a.pendingProps = null;
  a.stateNode = null;
  a.updateQueue = null;
}
function Tj(a) {
  return 5 === a.tag || 3 === a.tag || 4 === a.tag;
}
function Uj(a) {
  a: for (; ; ) {
    for (; null === a.sibling; ) {
      if (null === a.return || Tj(a.return)) return null;
      a = a.return;
    }
    a.sibling.return = a.return;
    for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
      if (a.flags & 2) continue a;
      if (null === a.child || 4 === a.tag) continue a;
      else a.child.return = a, a = a.child;
    }
    if (!(a.flags & 2)) return a.stateNode;
  }
}
function Vj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = Bf));
  else if (4 !== d && (a = a.child, null !== a)) for (Vj(a, b, c), a = a.sibling; null !== a; ) Vj(a, b, c), a = a.sibling;
}
function Wj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
  else if (4 !== d && (a = a.child, null !== a)) for (Wj(a, b, c), a = a.sibling; null !== a; ) Wj(a, b, c), a = a.sibling;
}
var X = null, Xj = false;
function Yj(a, b, c) {
  for (c = c.child; null !== c; ) Zj(a, b, c), c = c.sibling;
}
function Zj(a, b, c) {
  if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
    lc.onCommitFiberUnmount(kc, c);
  } catch (h) {
  }
  switch (c.tag) {
    case 5:
      U || Lj(c, b);
    case 6:
      var d = X, e = Xj;
      X = null;
      Yj(a, b, c);
      X = d;
      Xj = e;
      null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c) : a.removeChild(c)) : X.removeChild(c.stateNode));
      break;
    case 18:
      null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c) : 1 === a.nodeType && Kf(a, c), bd(a)) : Kf(X, c.stateNode));
      break;
    case 4:
      d = X;
      e = Xj;
      X = c.stateNode.containerInfo;
      Xj = true;
      Yj(a, b, c);
      X = d;
      Xj = e;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!U && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
        e = d = d.next;
        do {
          var f2 = e, g = f2.destroy;
          f2 = f2.tag;
          void 0 !== g && (0 !== (f2 & 2) ? Mj(c, b, g) : 0 !== (f2 & 4) && Mj(c, b, g));
          e = e.next;
        } while (e !== d);
      }
      Yj(a, b, c);
      break;
    case 1:
      if (!U && (Lj(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount)) try {
        d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
      } catch (h) {
        W(c, b, h);
      }
      Yj(a, b, c);
      break;
    case 21:
      Yj(a, b, c);
      break;
    case 22:
      c.mode & 1 ? (U = (d = U) || null !== c.memoizedState, Yj(a, b, c), U = d) : Yj(a, b, c);
      break;
    default:
      Yj(a, b, c);
  }
}
function ak(a) {
  var b = a.updateQueue;
  if (null !== b) {
    a.updateQueue = null;
    var c = a.stateNode;
    null === c && (c = a.stateNode = new Kj());
    b.forEach(function(b2) {
      var d = bk.bind(null, a, b2);
      c.has(b2) || (c.add(b2), b2.then(d, d));
    });
  }
}
function ck(a, b) {
  var c = b.deletions;
  if (null !== c) for (var d = 0; d < c.length; d++) {
    var e = c[d];
    try {
      var f2 = a, g = b, h = g;
      a: for (; null !== h; ) {
        switch (h.tag) {
          case 5:
            X = h.stateNode;
            Xj = false;
            break a;
          case 3:
            X = h.stateNode.containerInfo;
            Xj = true;
            break a;
          case 4:
            X = h.stateNode.containerInfo;
            Xj = true;
            break a;
        }
        h = h.return;
      }
      if (null === X) throw Error(p(160));
      Zj(f2, g, e);
      X = null;
      Xj = false;
      var k2 = e.alternate;
      null !== k2 && (k2.return = null);
      e.return = null;
    } catch (l2) {
      W(e, b, l2);
    }
  }
  if (b.subtreeFlags & 12854) for (b = b.child; null !== b; ) dk(b, a), b = b.sibling;
}
function dk(a, b) {
  var c = a.alternate, d = a.flags;
  switch (a.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      ck(b, a);
      ek(a);
      if (d & 4) {
        try {
          Pj(3, a, a.return), Qj(3, a);
        } catch (t2) {
          W(a, a.return, t2);
        }
        try {
          Pj(5, a, a.return);
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 1:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      break;
    case 5:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      if (a.flags & 32) {
        var e = a.stateNode;
        try {
          ob(e, "");
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      if (d & 4 && (e = a.stateNode, null != e)) {
        var f2 = a.memoizedProps, g = null !== c ? c.memoizedProps : f2, h = a.type, k2 = a.updateQueue;
        a.updateQueue = null;
        if (null !== k2) try {
          "input" === h && "radio" === f2.type && null != f2.name && ab(e, f2);
          vb(h, g);
          var l2 = vb(h, f2);
          for (g = 0; g < k2.length; g += 2) {
            var m2 = k2[g], q2 = k2[g + 1];
            "style" === m2 ? sb(e, q2) : "dangerouslySetInnerHTML" === m2 ? nb(e, q2) : "children" === m2 ? ob(e, q2) : ta(e, m2, q2, l2);
          }
          switch (h) {
            case "input":
              bb(e, f2);
              break;
            case "textarea":
              ib(e, f2);
              break;
            case "select":
              var r2 = e._wrapperState.wasMultiple;
              e._wrapperState.wasMultiple = !!f2.multiple;
              var y2 = f2.value;
              null != y2 ? fb(e, !!f2.multiple, y2, false) : r2 !== !!f2.multiple && (null != f2.defaultValue ? fb(
                e,
                !!f2.multiple,
                f2.defaultValue,
                true
              ) : fb(e, !!f2.multiple, f2.multiple ? [] : "", false));
          }
          e[Pf] = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 6:
      ck(b, a);
      ek(a);
      if (d & 4) {
        if (null === a.stateNode) throw Error(p(162));
        e = a.stateNode;
        f2 = a.memoizedProps;
        try {
          e.nodeValue = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 3:
      ck(b, a);
      ek(a);
      if (d & 4 && null !== c && c.memoizedState.isDehydrated) try {
        bd(b.containerInfo);
      } catch (t2) {
        W(a, a.return, t2);
      }
      break;
    case 4:
      ck(b, a);
      ek(a);
      break;
    case 13:
      ck(b, a);
      ek(a);
      e = a.child;
      e.flags & 8192 && (f2 = null !== e.memoizedState, e.stateNode.isHidden = f2, !f2 || null !== e.alternate && null !== e.alternate.memoizedState || (fk = B()));
      d & 4 && ak(a);
      break;
    case 22:
      m2 = null !== c && null !== c.memoizedState;
      a.mode & 1 ? (U = (l2 = U) || m2, ck(b, a), U = l2) : ck(b, a);
      ek(a);
      if (d & 8192) {
        l2 = null !== a.memoizedState;
        if ((a.stateNode.isHidden = l2) && !m2 && 0 !== (a.mode & 1)) for (V = a, m2 = a.child; null !== m2; ) {
          for (q2 = V = m2; null !== V; ) {
            r2 = V;
            y2 = r2.child;
            switch (r2.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                Pj(4, r2, r2.return);
                break;
              case 1:
                Lj(r2, r2.return);
                var n2 = r2.stateNode;
                if ("function" === typeof n2.componentWillUnmount) {
                  d = r2;
                  c = r2.return;
                  try {
                    b = d, n2.props = b.memoizedProps, n2.state = b.memoizedState, n2.componentWillUnmount();
                  } catch (t2) {
                    W(d, c, t2);
                  }
                }
                break;
              case 5:
                Lj(r2, r2.return);
                break;
              case 22:
                if (null !== r2.memoizedState) {
                  gk(q2);
                  continue;
                }
            }
            null !== y2 ? (y2.return = r2, V = y2) : gk(q2);
          }
          m2 = m2.sibling;
        }
        a: for (m2 = null, q2 = a; ; ) {
          if (5 === q2.tag) {
            if (null === m2) {
              m2 = q2;
              try {
                e = q2.stateNode, l2 ? (f2 = e.style, "function" === typeof f2.setProperty ? f2.setProperty("display", "none", "important") : f2.display = "none") : (h = q2.stateNode, k2 = q2.memoizedProps.style, g = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h.style.display = rb("display", g));
              } catch (t2) {
                W(a, a.return, t2);
              }
            }
          } else if (6 === q2.tag) {
            if (null === m2) try {
              q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
            } catch (t2) {
              W(a, a.return, t2);
            }
          } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a) && null !== q2.child) {
            q2.child.return = q2;
            q2 = q2.child;
            continue;
          }
          if (q2 === a) break a;
          for (; null === q2.sibling; ) {
            if (null === q2.return || q2.return === a) break a;
            m2 === q2 && (m2 = null);
            q2 = q2.return;
          }
          m2 === q2 && (m2 = null);
          q2.sibling.return = q2.return;
          q2 = q2.sibling;
        }
      }
      break;
    case 19:
      ck(b, a);
      ek(a);
      d & 4 && ak(a);
      break;
    case 21:
      break;
    default:
      ck(
        b,
        a
      ), ek(a);
  }
}
function ek(a) {
  var b = a.flags;
  if (b & 2) {
    try {
      a: {
        for (var c = a.return; null !== c; ) {
          if (Tj(c)) {
            var d = c;
            break a;
          }
          c = c.return;
        }
        throw Error(p(160));
      }
      switch (d.tag) {
        case 5:
          var e = d.stateNode;
          d.flags & 32 && (ob(e, ""), d.flags &= -33);
          var f2 = Uj(a);
          Wj(a, f2, e);
          break;
        case 3:
        case 4:
          var g = d.stateNode.containerInfo, h = Uj(a);
          Vj(a, h, g);
          break;
        default:
          throw Error(p(161));
      }
    } catch (k2) {
      W(a, a.return, k2);
    }
    a.flags &= -3;
  }
  b & 4096 && (a.flags &= -4097);
}
function hk(a, b, c) {
  V = a;
  ik(a);
}
function ik(a, b, c) {
  for (var d = 0 !== (a.mode & 1); null !== V; ) {
    var e = V, f2 = e.child;
    if (22 === e.tag && d) {
      var g = null !== e.memoizedState || Jj;
      if (!g) {
        var h = e.alternate, k2 = null !== h && null !== h.memoizedState || U;
        h = Jj;
        var l2 = U;
        Jj = g;
        if ((U = k2) && !l2) for (V = e; null !== V; ) g = V, k2 = g.child, 22 === g.tag && null !== g.memoizedState ? jk(e) : null !== k2 ? (k2.return = g, V = k2) : jk(e);
        for (; null !== f2; ) V = f2, ik(f2), f2 = f2.sibling;
        V = e;
        Jj = h;
        U = l2;
      }
      kk(a);
    } else 0 !== (e.subtreeFlags & 8772) && null !== f2 ? (f2.return = e, V = f2) : kk(a);
  }
}
function kk(a) {
  for (; null !== V; ) {
    var b = V;
    if (0 !== (b.flags & 8772)) {
      var c = b.alternate;
      try {
        if (0 !== (b.flags & 8772)) switch (b.tag) {
          case 0:
          case 11:
          case 15:
            U || Qj(5, b);
            break;
          case 1:
            var d = b.stateNode;
            if (b.flags & 4 && !U) if (null === c) d.componentDidMount();
            else {
              var e = b.elementType === b.type ? c.memoizedProps : Ci(b.type, c.memoizedProps);
              d.componentDidUpdate(e, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
            }
            var f2 = b.updateQueue;
            null !== f2 && sh(b, f2, d);
            break;
          case 3:
            var g = b.updateQueue;
            if (null !== g) {
              c = null;
              if (null !== b.child) switch (b.child.tag) {
                case 5:
                  c = b.child.stateNode;
                  break;
                case 1:
                  c = b.child.stateNode;
              }
              sh(b, g, c);
            }
            break;
          case 5:
            var h = b.stateNode;
            if (null === c && b.flags & 4) {
              c = h;
              var k2 = b.memoizedProps;
              switch (b.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  k2.autoFocus && c.focus();
                  break;
                case "img":
                  k2.src && (c.src = k2.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (null === b.memoizedState) {
              var l2 = b.alternate;
              if (null !== l2) {
                var m2 = l2.memoizedState;
                if (null !== m2) {
                  var q2 = m2.dehydrated;
                  null !== q2 && bd(q2);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(p(163));
        }
        U || b.flags & 512 && Rj(b);
      } catch (r2) {
        W(b, b.return, r2);
      }
    }
    if (b === a) {
      V = null;
      break;
    }
    c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function gk(a) {
  for (; null !== V; ) {
    var b = V;
    if (b === a) {
      V = null;
      break;
    }
    var c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function jk(a) {
  for (; null !== V; ) {
    var b = V;
    try {
      switch (b.tag) {
        case 0:
        case 11:
        case 15:
          var c = b.return;
          try {
            Qj(4, b);
          } catch (k2) {
            W(b, c, k2);
          }
          break;
        case 1:
          var d = b.stateNode;
          if ("function" === typeof d.componentDidMount) {
            var e = b.return;
            try {
              d.componentDidMount();
            } catch (k2) {
              W(b, e, k2);
            }
          }
          var f2 = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, f2, k2);
          }
          break;
        case 5:
          var g = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, g, k2);
          }
      }
    } catch (k2) {
      W(b, b.return, k2);
    }
    if (b === a) {
      V = null;
      break;
    }
    var h = b.sibling;
    if (null !== h) {
      h.return = b.return;
      V = h;
      break;
    }
    V = b.return;
  }
}
var lk = Math.ceil, mk = ua.ReactCurrentDispatcher, nk = ua.ReactCurrentOwner, ok = ua.ReactCurrentBatchConfig, K = 0, Q = null, Y = null, Z = 0, fj = 0, ej = Uf(0), T$1 = 0, pk = null, rh = 0, qk = 0, rk = 0, sk = null, tk = null, fk = 0, Gj = Infinity, uk = null, Oi = false, Pi = null, Ri = null, vk = false, wk = null, xk = 0, yk = 0, zk = null, Ak = -1, Bk = 0;
function R() {
  return 0 !== (K & 6) ? B() : -1 !== Ak ? Ak : Ak = B();
}
function yi(a) {
  if (0 === (a.mode & 1)) return 1;
  if (0 !== (K & 2) && 0 !== Z) return Z & -Z;
  if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
  a = C;
  if (0 !== a) return a;
  a = window.event;
  a = void 0 === a ? 16 : jd(a.type);
  return a;
}
function gi(a, b, c, d) {
  if (50 < yk) throw yk = 0, zk = null, Error(p(185));
  Ac(a, c, d);
  if (0 === (K & 2) || a !== Q) a === Q && (0 === (K & 2) && (qk |= c), 4 === T$1 && Ck(a, Z)), Dk(a, d), 1 === c && 0 === K && 0 === (b.mode & 1) && (Gj = B() + 500, fg && jg());
}
function Dk(a, b) {
  var c = a.callbackNode;
  wc(a, b);
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) null !== c && bc(c), a.callbackNode = null, a.callbackPriority = 0;
  else if (b = d & -d, a.callbackPriority !== b) {
    null != c && bc(c);
    if (1 === b) 0 === a.tag ? ig(Ek.bind(null, a)) : hg(Ek.bind(null, a)), Jf(function() {
      0 === (K & 6) && jg();
    }), c = null;
    else {
      switch (Dc(d)) {
        case 1:
          c = fc;
          break;
        case 4:
          c = gc;
          break;
        case 16:
          c = hc;
          break;
        case 536870912:
          c = jc;
          break;
        default:
          c = hc;
      }
      c = Fk(c, Gk.bind(null, a));
    }
    a.callbackPriority = b;
    a.callbackNode = c;
  }
}
function Gk(a, b) {
  Ak = -1;
  Bk = 0;
  if (0 !== (K & 6)) throw Error(p(327));
  var c = a.callbackNode;
  if (Hk() && a.callbackNode !== c) return null;
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) return null;
  if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b) b = Ik(a, d);
  else {
    b = d;
    var e = K;
    K |= 2;
    var f2 = Jk();
    if (Q !== a || Z !== b) uk = null, Gj = B() + 500, Kk(a, b);
    do
      try {
        Lk();
        break;
      } catch (h) {
        Mk(a, h);
      }
    while (1);
    $g();
    mk.current = f2;
    K = e;
    null !== Y ? b = 0 : (Q = null, Z = 0, b = T$1);
  }
  if (0 !== b) {
    2 === b && (e = xc(a), 0 !== e && (d = e, b = Nk(a, e)));
    if (1 === b) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
    if (6 === b) Ck(a, d);
    else {
      e = a.current.alternate;
      if (0 === (d & 30) && !Ok(e) && (b = Ik(a, d), 2 === b && (f2 = xc(a), 0 !== f2 && (d = f2, b = Nk(a, f2))), 1 === b)) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
      a.finishedWork = e;
      a.finishedLanes = d;
      switch (b) {
        case 0:
        case 1:
          throw Error(p(345));
        case 2:
          Pk(a, tk, uk);
          break;
        case 3:
          Ck(a, d);
          if ((d & 130023424) === d && (b = fk + 500 - B(), 10 < b)) {
            if (0 !== uc(a, 0)) break;
            e = a.suspendedLanes;
            if ((e & d) !== d) {
              R();
              a.pingedLanes |= a.suspendedLanes & e;
              break;
            }
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), b);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 4:
          Ck(a, d);
          if ((d & 4194240) === d) break;
          b = a.eventTimes;
          for (e = -1; 0 < d; ) {
            var g = 31 - oc(d);
            f2 = 1 << g;
            g = b[g];
            g > e && (e = g);
            d &= ~f2;
          }
          d = e;
          d = B() - d;
          d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * lk(d / 1960)) - d;
          if (10 < d) {
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), d);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 5:
          Pk(a, tk, uk);
          break;
        default:
          throw Error(p(329));
      }
    }
  }
  Dk(a, B());
  return a.callbackNode === c ? Gk.bind(null, a) : null;
}
function Nk(a, b) {
  var c = sk;
  a.current.memoizedState.isDehydrated && (Kk(a, b).flags |= 256);
  a = Ik(a, b);
  2 !== a && (b = tk, tk = c, null !== b && Fj(b));
  return a;
}
function Fj(a) {
  null === tk ? tk = a : tk.push.apply(tk, a);
}
function Ok(a) {
  for (var b = a; ; ) {
    if (b.flags & 16384) {
      var c = b.updateQueue;
      if (null !== c && (c = c.stores, null !== c)) for (var d = 0; d < c.length; d++) {
        var e = c[d], f2 = e.getSnapshot;
        e = e.value;
        try {
          if (!He(f2(), e)) return false;
        } catch (g) {
          return false;
        }
      }
    }
    c = b.child;
    if (b.subtreeFlags & 16384 && null !== c) c.return = b, b = c;
    else {
      if (b === a) break;
      for (; null === b.sibling; ) {
        if (null === b.return || b.return === a) return true;
        b = b.return;
      }
      b.sibling.return = b.return;
      b = b.sibling;
    }
  }
  return true;
}
function Ck(a, b) {
  b &= ~rk;
  b &= ~qk;
  a.suspendedLanes |= b;
  a.pingedLanes &= ~b;
  for (a = a.expirationTimes; 0 < b; ) {
    var c = 31 - oc(b), d = 1 << c;
    a[c] = -1;
    b &= ~d;
  }
}
function Ek(a) {
  if (0 !== (K & 6)) throw Error(p(327));
  Hk();
  var b = uc(a, 0);
  if (0 === (b & 1)) return Dk(a, B()), null;
  var c = Ik(a, b);
  if (0 !== a.tag && 2 === c) {
    var d = xc(a);
    0 !== d && (b = d, c = Nk(a, d));
  }
  if (1 === c) throw c = pk, Kk(a, 0), Ck(a, b), Dk(a, B()), c;
  if (6 === c) throw Error(p(345));
  a.finishedWork = a.current.alternate;
  a.finishedLanes = b;
  Pk(a, tk, uk);
  Dk(a, B());
  return null;
}
function Qk(a, b) {
  var c = K;
  K |= 1;
  try {
    return a(b);
  } finally {
    K = c, 0 === K && (Gj = B() + 500, fg && jg());
  }
}
function Rk(a) {
  null !== wk && 0 === wk.tag && 0 === (K & 6) && Hk();
  var b = K;
  K |= 1;
  var c = ok.transition, d = C;
  try {
    if (ok.transition = null, C = 1, a) return a();
  } finally {
    C = d, ok.transition = c, K = b, 0 === (K & 6) && jg();
  }
}
function Hj() {
  fj = ej.current;
  E(ej);
}
function Kk(a, b) {
  a.finishedWork = null;
  a.finishedLanes = 0;
  var c = a.timeoutHandle;
  -1 !== c && (a.timeoutHandle = -1, Gf(c));
  if (null !== Y) for (c = Y.return; null !== c; ) {
    var d = c;
    wg(d);
    switch (d.tag) {
      case 1:
        d = d.type.childContextTypes;
        null !== d && void 0 !== d && $f();
        break;
      case 3:
        zh();
        E(Wf);
        E(H);
        Eh();
        break;
      case 5:
        Bh(d);
        break;
      case 4:
        zh();
        break;
      case 13:
        E(L);
        break;
      case 19:
        E(L);
        break;
      case 10:
        ah(d.type._context);
        break;
      case 22:
      case 23:
        Hj();
    }
    c = c.return;
  }
  Q = a;
  Y = a = Pg(a.current, null);
  Z = fj = b;
  T$1 = 0;
  pk = null;
  rk = qk = rh = 0;
  tk = sk = null;
  if (null !== fh) {
    for (b = 0; b < fh.length; b++) if (c = fh[b], d = c.interleaved, null !== d) {
      c.interleaved = null;
      var e = d.next, f2 = c.pending;
      if (null !== f2) {
        var g = f2.next;
        f2.next = e;
        d.next = g;
      }
      c.pending = d;
    }
    fh = null;
  }
  return a;
}
function Mk(a, b) {
  do {
    var c = Y;
    try {
      $g();
      Fh.current = Rh;
      if (Ih) {
        for (var d = M.memoizedState; null !== d; ) {
          var e = d.queue;
          null !== e && (e.pending = null);
          d = d.next;
        }
        Ih = false;
      }
      Hh = 0;
      O = N = M = null;
      Jh = false;
      Kh = 0;
      nk.current = null;
      if (null === c || null === c.return) {
        T$1 = 1;
        pk = b;
        Y = null;
        break;
      }
      a: {
        var f2 = a, g = c.return, h = c, k2 = b;
        b = Z;
        h.flags |= 32768;
        if (null !== k2 && "object" === typeof k2 && "function" === typeof k2.then) {
          var l2 = k2, m2 = h, q2 = m2.tag;
          if (0 === (m2.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
            var r2 = m2.alternate;
            r2 ? (m2.updateQueue = r2.updateQueue, m2.memoizedState = r2.memoizedState, m2.lanes = r2.lanes) : (m2.updateQueue = null, m2.memoizedState = null);
          }
          var y2 = Ui(g);
          if (null !== y2) {
            y2.flags &= -257;
            Vi(y2, g, h, f2, b);
            y2.mode & 1 && Si(f2, l2, b);
            b = y2;
            k2 = l2;
            var n2 = b.updateQueue;
            if (null === n2) {
              var t2 = /* @__PURE__ */ new Set();
              t2.add(k2);
              b.updateQueue = t2;
            } else n2.add(k2);
            break a;
          } else {
            if (0 === (b & 1)) {
              Si(f2, l2, b);
              tj();
              break a;
            }
            k2 = Error(p(426));
          }
        } else if (I && h.mode & 1) {
          var J2 = Ui(g);
          if (null !== J2) {
            0 === (J2.flags & 65536) && (J2.flags |= 256);
            Vi(J2, g, h, f2, b);
            Jg(Ji(k2, h));
            break a;
          }
        }
        f2 = k2 = Ji(k2, h);
        4 !== T$1 && (T$1 = 2);
        null === sk ? sk = [f2] : sk.push(f2);
        f2 = g;
        do {
          switch (f2.tag) {
            case 3:
              f2.flags |= 65536;
              b &= -b;
              f2.lanes |= b;
              var x2 = Ni(f2, k2, b);
              ph(f2, x2);
              break a;
            case 1:
              h = k2;
              var w2 = f2.type, u2 = f2.stateNode;
              if (0 === (f2.flags & 128) && ("function" === typeof w2.getDerivedStateFromError || null !== u2 && "function" === typeof u2.componentDidCatch && (null === Ri || !Ri.has(u2)))) {
                f2.flags |= 65536;
                b &= -b;
                f2.lanes |= b;
                var F2 = Qi(f2, h, b);
                ph(f2, F2);
                break a;
              }
          }
          f2 = f2.return;
        } while (null !== f2);
      }
      Sk(c);
    } catch (na) {
      b = na;
      Y === c && null !== c && (Y = c = c.return);
      continue;
    }
    break;
  } while (1);
}
function Jk() {
  var a = mk.current;
  mk.current = Rh;
  return null === a ? Rh : a;
}
function tj() {
  if (0 === T$1 || 3 === T$1 || 2 === T$1) T$1 = 4;
  null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z);
}
function Ik(a, b) {
  var c = K;
  K |= 2;
  var d = Jk();
  if (Q !== a || Z !== b) uk = null, Kk(a, b);
  do
    try {
      Tk();
      break;
    } catch (e) {
      Mk(a, e);
    }
  while (1);
  $g();
  K = c;
  mk.current = d;
  if (null !== Y) throw Error(p(261));
  Q = null;
  Z = 0;
  return T$1;
}
function Tk() {
  for (; null !== Y; ) Uk(Y);
}
function Lk() {
  for (; null !== Y && !cc(); ) Uk(Y);
}
function Uk(a) {
  var b = Vk(a.alternate, a, fj);
  a.memoizedProps = a.pendingProps;
  null === b ? Sk(a) : Y = b;
  nk.current = null;
}
function Sk(a) {
  var b = a;
  do {
    var c = b.alternate;
    a = b.return;
    if (0 === (b.flags & 32768)) {
      if (c = Ej(c, b, fj), null !== c) {
        Y = c;
        return;
      }
    } else {
      c = Ij(c, b);
      if (null !== c) {
        c.flags &= 32767;
        Y = c;
        return;
      }
      if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
      else {
        T$1 = 6;
        Y = null;
        return;
      }
    }
    b = b.sibling;
    if (null !== b) {
      Y = b;
      return;
    }
    Y = b = a;
  } while (null !== b);
  0 === T$1 && (T$1 = 5);
}
function Pk(a, b, c) {
  var d = C, e = ok.transition;
  try {
    ok.transition = null, C = 1, Wk(a, b, c, d);
  } finally {
    ok.transition = e, C = d;
  }
  return null;
}
function Wk(a, b, c, d) {
  do
    Hk();
  while (null !== wk);
  if (0 !== (K & 6)) throw Error(p(327));
  c = a.finishedWork;
  var e = a.finishedLanes;
  if (null === c) return null;
  a.finishedWork = null;
  a.finishedLanes = 0;
  if (c === a.current) throw Error(p(177));
  a.callbackNode = null;
  a.callbackPriority = 0;
  var f2 = c.lanes | c.childLanes;
  Bc(a, f2);
  a === Q && (Y = Q = null, Z = 0);
  0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || vk || (vk = true, Fk(hc, function() {
    Hk();
    return null;
  }));
  f2 = 0 !== (c.flags & 15990);
  if (0 !== (c.subtreeFlags & 15990) || f2) {
    f2 = ok.transition;
    ok.transition = null;
    var g = C;
    C = 1;
    var h = K;
    K |= 4;
    nk.current = null;
    Oj(a, c);
    dk(c, a);
    Oe(Df);
    dd = !!Cf;
    Df = Cf = null;
    a.current = c;
    hk(c);
    dc();
    K = h;
    C = g;
    ok.transition = f2;
  } else a.current = c;
  vk && (vk = false, wk = a, xk = e);
  f2 = a.pendingLanes;
  0 === f2 && (Ri = null);
  mc(c.stateNode);
  Dk(a, B());
  if (null !== b) for (d = a.onRecoverableError, c = 0; c < b.length; c++) e = b[c], d(e.value, { componentStack: e.stack, digest: e.digest });
  if (Oi) throw Oi = false, a = Pi, Pi = null, a;
  0 !== (xk & 1) && 0 !== a.tag && Hk();
  f2 = a.pendingLanes;
  0 !== (f2 & 1) ? a === zk ? yk++ : (yk = 0, zk = a) : yk = 0;
  jg();
  return null;
}
function Hk() {
  if (null !== wk) {
    var a = Dc(xk), b = ok.transition, c = C;
    try {
      ok.transition = null;
      C = 16 > a ? 16 : a;
      if (null === wk) var d = false;
      else {
        a = wk;
        wk = null;
        xk = 0;
        if (0 !== (K & 6)) throw Error(p(331));
        var e = K;
        K |= 4;
        for (V = a.current; null !== V; ) {
          var f2 = V, g = f2.child;
          if (0 !== (V.flags & 16)) {
            var h = f2.deletions;
            if (null !== h) {
              for (var k2 = 0; k2 < h.length; k2++) {
                var l2 = h[k2];
                for (V = l2; null !== V; ) {
                  var m2 = V;
                  switch (m2.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Pj(8, m2, f2);
                  }
                  var q2 = m2.child;
                  if (null !== q2) q2.return = m2, V = q2;
                  else for (; null !== V; ) {
                    m2 = V;
                    var r2 = m2.sibling, y2 = m2.return;
                    Sj(m2);
                    if (m2 === l2) {
                      V = null;
                      break;
                    }
                    if (null !== r2) {
                      r2.return = y2;
                      V = r2;
                      break;
                    }
                    V = y2;
                  }
                }
              }
              var n2 = f2.alternate;
              if (null !== n2) {
                var t2 = n2.child;
                if (null !== t2) {
                  n2.child = null;
                  do {
                    var J2 = t2.sibling;
                    t2.sibling = null;
                    t2 = J2;
                  } while (null !== t2);
                }
              }
              V = f2;
            }
          }
          if (0 !== (f2.subtreeFlags & 2064) && null !== g) g.return = f2, V = g;
          else b: for (; null !== V; ) {
            f2 = V;
            if (0 !== (f2.flags & 2048)) switch (f2.tag) {
              case 0:
              case 11:
              case 15:
                Pj(9, f2, f2.return);
            }
            var x2 = f2.sibling;
            if (null !== x2) {
              x2.return = f2.return;
              V = x2;
              break b;
            }
            V = f2.return;
          }
        }
        var w2 = a.current;
        for (V = w2; null !== V; ) {
          g = V;
          var u2 = g.child;
          if (0 !== (g.subtreeFlags & 2064) && null !== u2) u2.return = g, V = u2;
          else b: for (g = w2; null !== V; ) {
            h = V;
            if (0 !== (h.flags & 2048)) try {
              switch (h.tag) {
                case 0:
                case 11:
                case 15:
                  Qj(9, h);
              }
            } catch (na) {
              W(h, h.return, na);
            }
            if (h === g) {
              V = null;
              break b;
            }
            var F2 = h.sibling;
            if (null !== F2) {
              F2.return = h.return;
              V = F2;
              break b;
            }
            V = h.return;
          }
        }
        K = e;
        jg();
        if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
          lc.onPostCommitFiberRoot(kc, a);
        } catch (na) {
        }
        d = true;
      }
      return d;
    } finally {
      C = c, ok.transition = b;
    }
  }
  return false;
}
function Xk(a, b, c) {
  b = Ji(c, b);
  b = Ni(a, b, 1);
  a = nh(a, b, 1);
  b = R();
  null !== a && (Ac(a, 1, b), Dk(a, b));
}
function W(a, b, c) {
  if (3 === a.tag) Xk(a, a, c);
  else for (; null !== b; ) {
    if (3 === b.tag) {
      Xk(b, a, c);
      break;
    } else if (1 === b.tag) {
      var d = b.stateNode;
      if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Ri || !Ri.has(d))) {
        a = Ji(c, a);
        a = Qi(b, a, 1);
        b = nh(b, a, 1);
        a = R();
        null !== b && (Ac(b, 1, a), Dk(b, a));
        break;
      }
    }
    b = b.return;
  }
}
function Ti(a, b, c) {
  var d = a.pingCache;
  null !== d && d.delete(b);
  b = R();
  a.pingedLanes |= a.suspendedLanes & c;
  Q === a && (Z & c) === c && (4 === T$1 || 3 === T$1 && (Z & 130023424) === Z && 500 > B() - fk ? Kk(a, 0) : rk |= c);
  Dk(a, b);
}
function Yk(a, b) {
  0 === b && (0 === (a.mode & 1) ? b = 1 : (b = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
  var c = R();
  a = ih(a, b);
  null !== a && (Ac(a, b, c), Dk(a, c));
}
function uj(a) {
  var b = a.memoizedState, c = 0;
  null !== b && (c = b.retryLane);
  Yk(a, c);
}
function bk(a, b) {
  var c = 0;
  switch (a.tag) {
    case 13:
      var d = a.stateNode;
      var e = a.memoizedState;
      null !== e && (c = e.retryLane);
      break;
    case 19:
      d = a.stateNode;
      break;
    default:
      throw Error(p(314));
  }
  null !== d && d.delete(b);
  Yk(a, c);
}
var Vk;
Vk = function(a, b, c) {
  if (null !== a) if (a.memoizedProps !== b.pendingProps || Wf.current) dh = true;
  else {
    if (0 === (a.lanes & c) && 0 === (b.flags & 128)) return dh = false, yj(a, b, c);
    dh = 0 !== (a.flags & 131072) ? true : false;
  }
  else dh = false, I && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
  b.lanes = 0;
  switch (b.tag) {
    case 2:
      var d = b.type;
      ij(a, b);
      a = b.pendingProps;
      var e = Yf(b, H.current);
      ch(b, c);
      e = Nh(null, b, d, a, e, c);
      var f2 = Sh();
      b.flags |= 1;
      "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f2 = true, cg(b)) : f2 = false, b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, kh(b), e.updater = Ei, b.stateNode = e, e._reactInternals = b, Ii(b, d, a, c), b = jj(null, b, d, true, f2, c)) : (b.tag = 0, I && f2 && vg(b), Xi(null, b, e, c), b = b.child);
      return b;
    case 16:
      d = b.elementType;
      a: {
        ij(a, b);
        a = b.pendingProps;
        e = d._init;
        d = e(d._payload);
        b.type = d;
        e = b.tag = Zk(d);
        a = Ci(d, a);
        switch (e) {
          case 0:
            b = cj(null, b, d, a, c);
            break a;
          case 1:
            b = hj(null, b, d, a, c);
            break a;
          case 11:
            b = Yi(null, b, d, a, c);
            break a;
          case 14:
            b = $i(null, b, d, Ci(d.type, a), c);
            break a;
        }
        throw Error(p(
          306,
          d,
          ""
        ));
      }
      return b;
    case 0:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), cj(a, b, d, e, c);
    case 1:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), hj(a, b, d, e, c);
    case 3:
      a: {
        kj(b);
        if (null === a) throw Error(p(387));
        d = b.pendingProps;
        f2 = b.memoizedState;
        e = f2.element;
        lh(a, b);
        qh(b, d, null, c);
        var g = b.memoizedState;
        d = g.element;
        if (f2.isDehydrated) if (f2 = { element: d, isDehydrated: false, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, b.updateQueue.baseState = f2, b.memoizedState = f2, b.flags & 256) {
          e = Ji(Error(p(423)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else if (d !== e) {
          e = Ji(Error(p(424)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I = true, zg = null, c = Vg(b, null, d, c), b.child = c; c; ) c.flags = c.flags & -3 | 4096, c = c.sibling;
        else {
          Ig();
          if (d === e) {
            b = Zi(a, b, c);
            break a;
          }
          Xi(a, b, d, c);
        }
        b = b.child;
      }
      return b;
    case 5:
      return Ah(b), null === a && Eg(b), d = b.type, e = b.pendingProps, f2 = null !== a ? a.memoizedProps : null, g = e.children, Ef(d, e) ? g = null : null !== f2 && Ef(d, f2) && (b.flags |= 32), gj(a, b), Xi(a, b, g, c), b.child;
    case 6:
      return null === a && Eg(b), null;
    case 13:
      return oj(a, b, c);
    case 4:
      return yh(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Ug(b, null, d, c) : Xi(a, b, d, c), b.child;
    case 11:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), Yi(a, b, d, e, c);
    case 7:
      return Xi(a, b, b.pendingProps, c), b.child;
    case 8:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 12:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 10:
      a: {
        d = b.type._context;
        e = b.pendingProps;
        f2 = b.memoizedProps;
        g = e.value;
        G(Wg, d._currentValue);
        d._currentValue = g;
        if (null !== f2) if (He(f2.value, g)) {
          if (f2.children === e.children && !Wf.current) {
            b = Zi(a, b, c);
            break a;
          }
        } else for (f2 = b.child, null !== f2 && (f2.return = b); null !== f2; ) {
          var h = f2.dependencies;
          if (null !== h) {
            g = f2.child;
            for (var k2 = h.firstContext; null !== k2; ) {
              if (k2.context === d) {
                if (1 === f2.tag) {
                  k2 = mh(-1, c & -c);
                  k2.tag = 2;
                  var l2 = f2.updateQueue;
                  if (null !== l2) {
                    l2 = l2.shared;
                    var m2 = l2.pending;
                    null === m2 ? k2.next = k2 : (k2.next = m2.next, m2.next = k2);
                    l2.pending = k2;
                  }
                }
                f2.lanes |= c;
                k2 = f2.alternate;
                null !== k2 && (k2.lanes |= c);
                bh(
                  f2.return,
                  c,
                  b
                );
                h.lanes |= c;
                break;
              }
              k2 = k2.next;
            }
          } else if (10 === f2.tag) g = f2.type === b.type ? null : f2.child;
          else if (18 === f2.tag) {
            g = f2.return;
            if (null === g) throw Error(p(341));
            g.lanes |= c;
            h = g.alternate;
            null !== h && (h.lanes |= c);
            bh(g, c, b);
            g = f2.sibling;
          } else g = f2.child;
          if (null !== g) g.return = f2;
          else for (g = f2; null !== g; ) {
            if (g === b) {
              g = null;
              break;
            }
            f2 = g.sibling;
            if (null !== f2) {
              f2.return = g.return;
              g = f2;
              break;
            }
            g = g.return;
          }
          f2 = g;
        }
        Xi(a, b, e.children, c);
        b = b.child;
      }
      return b;
    case 9:
      return e = b.type, d = b.pendingProps.children, ch(b, c), e = eh(e), d = d(e), b.flags |= 1, Xi(a, b, d, c), b.child;
    case 14:
      return d = b.type, e = Ci(d, b.pendingProps), e = Ci(d.type, e), $i(a, b, d, e, c);
    case 15:
      return bj(a, b, b.type, b.pendingProps, c);
    case 17:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), ij(a, b), b.tag = 1, Zf(d) ? (a = true, cg(b)) : a = false, ch(b, c), Gi(b, d, e), Ii(b, d, e, c), jj(null, b, d, true, a, c);
    case 19:
      return xj(a, b, c);
    case 22:
      return dj(a, b, c);
  }
  throw Error(p(156, b.tag));
};
function Fk(a, b) {
  return ac(a, b);
}
function $k(a, b, c, d) {
  this.tag = a;
  this.key = c;
  this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = b;
  this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
  this.mode = d;
  this.subtreeFlags = this.flags = 0;
  this.deletions = null;
  this.childLanes = this.lanes = 0;
  this.alternate = null;
}
function Bg(a, b, c, d) {
  return new $k(a, b, c, d);
}
function aj(a) {
  a = a.prototype;
  return !(!a || !a.isReactComponent);
}
function Zk(a) {
  if ("function" === typeof a) return aj(a) ? 1 : 0;
  if (void 0 !== a && null !== a) {
    a = a.$$typeof;
    if (a === Da) return 11;
    if (a === Ga) return 14;
  }
  return 2;
}
function Pg(a, b) {
  var c = a.alternate;
  null === c ? (c = Bg(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
  c.flags = a.flags & 14680064;
  c.childLanes = a.childLanes;
  c.lanes = a.lanes;
  c.child = a.child;
  c.memoizedProps = a.memoizedProps;
  c.memoizedState = a.memoizedState;
  c.updateQueue = a.updateQueue;
  b = a.dependencies;
  c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
  c.sibling = a.sibling;
  c.index = a.index;
  c.ref = a.ref;
  return c;
}
function Rg(a, b, c, d, e, f2) {
  var g = 2;
  d = a;
  if ("function" === typeof a) aj(a) && (g = 1);
  else if ("string" === typeof a) g = 5;
  else a: switch (a) {
    case ya:
      return Tg(c.children, e, f2, b);
    case za:
      g = 8;
      e |= 8;
      break;
    case Aa:
      return a = Bg(12, c, b, e | 2), a.elementType = Aa, a.lanes = f2, a;
    case Ea:
      return a = Bg(13, c, b, e), a.elementType = Ea, a.lanes = f2, a;
    case Fa:
      return a = Bg(19, c, b, e), a.elementType = Fa, a.lanes = f2, a;
    case Ia:
      return pj(c, e, f2, b);
    default:
      if ("object" === typeof a && null !== a) switch (a.$$typeof) {
        case Ba:
          g = 10;
          break a;
        case Ca:
          g = 9;
          break a;
        case Da:
          g = 11;
          break a;
        case Ga:
          g = 14;
          break a;
        case Ha:
          g = 16;
          d = null;
          break a;
      }
      throw Error(p(130, null == a ? a : typeof a, ""));
  }
  b = Bg(g, c, b, e);
  b.elementType = a;
  b.type = d;
  b.lanes = f2;
  return b;
}
function Tg(a, b, c, d) {
  a = Bg(7, a, d, b);
  a.lanes = c;
  return a;
}
function pj(a, b, c, d) {
  a = Bg(22, a, d, b);
  a.elementType = Ia;
  a.lanes = c;
  a.stateNode = { isHidden: false };
  return a;
}
function Qg(a, b, c) {
  a = Bg(6, a, null, b);
  a.lanes = c;
  return a;
}
function Sg(a, b, c) {
  b = Bg(4, null !== a.children ? a.children : [], a.key, b);
  b.lanes = c;
  b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
  return b;
}
function al(a, b, c, d, e) {
  this.tag = b;
  this.containerInfo = a;
  this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
  this.timeoutHandle = -1;
  this.callbackNode = this.pendingContext = this.context = null;
  this.callbackPriority = 0;
  this.eventTimes = zc(0);
  this.expirationTimes = zc(-1);
  this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
  this.entanglements = zc(0);
  this.identifierPrefix = d;
  this.onRecoverableError = e;
  this.mutableSourceEagerHydrationData = null;
}
function bl(a, b, c, d, e, f2, g, h, k2) {
  a = new al(a, b, c, h, k2);
  1 === b ? (b = 1, true === f2 && (b |= 8)) : b = 0;
  f2 = Bg(3, null, null, b);
  a.current = f2;
  f2.stateNode = a;
  f2.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
  kh(f2);
  return a;
}
function cl(a, b, c) {
  var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
  return { $$typeof: wa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
}
function dl(a) {
  if (!a) return Vf;
  a = a._reactInternals;
  a: {
    if (Vb(a) !== a || 1 !== a.tag) throw Error(p(170));
    var b = a;
    do {
      switch (b.tag) {
        case 3:
          b = b.stateNode.context;
          break a;
        case 1:
          if (Zf(b.type)) {
            b = b.stateNode.__reactInternalMemoizedMergedChildContext;
            break a;
          }
      }
      b = b.return;
    } while (null !== b);
    throw Error(p(171));
  }
  if (1 === a.tag) {
    var c = a.type;
    if (Zf(c)) return bg(a, c, b);
  }
  return b;
}
function el(a, b, c, d, e, f2, g, h, k2) {
  a = bl(c, d, true, a, e, f2, g, h, k2);
  a.context = dl(null);
  c = a.current;
  d = R();
  e = yi(c);
  f2 = mh(d, e);
  f2.callback = void 0 !== b && null !== b ? b : null;
  nh(c, f2, e);
  a.current.lanes = e;
  Ac(a, e, d);
  Dk(a, d);
  return a;
}
function fl(a, b, c, d) {
  var e = b.current, f2 = R(), g = yi(e);
  c = dl(c);
  null === b.context ? b.context = c : b.pendingContext = c;
  b = mh(f2, g);
  b.payload = { element: a };
  d = void 0 === d ? null : d;
  null !== d && (b.callback = d);
  a = nh(e, b, g);
  null !== a && (gi(a, e, g, f2), oh(a, e, g));
  return g;
}
function gl(a) {
  a = a.current;
  if (!a.child) return null;
  switch (a.child.tag) {
    case 5:
      return a.child.stateNode;
    default:
      return a.child.stateNode;
  }
}
function hl(a, b) {
  a = a.memoizedState;
  if (null !== a && null !== a.dehydrated) {
    var c = a.retryLane;
    a.retryLane = 0 !== c && c < b ? c : b;
  }
}
function il(a, b) {
  hl(a, b);
  (a = a.alternate) && hl(a, b);
}
function jl() {
  return null;
}
var kl = "function" === typeof reportError ? reportError : function(a) {
  console.error(a);
};
function ll(a) {
  this._internalRoot = a;
}
ml.prototype.render = ll.prototype.render = function(a) {
  var b = this._internalRoot;
  if (null === b) throw Error(p(409));
  fl(a, b, null, null);
};
ml.prototype.unmount = ll.prototype.unmount = function() {
  var a = this._internalRoot;
  if (null !== a) {
    this._internalRoot = null;
    var b = a.containerInfo;
    Rk(function() {
      fl(null, a, null, null);
    });
    b[uf] = null;
  }
};
function ml(a) {
  this._internalRoot = a;
}
ml.prototype.unstable_scheduleHydration = function(a) {
  if (a) {
    var b = Hc();
    a = { blockedOn: null, target: a, priority: b };
    for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++) ;
    Qc.splice(c, 0, a);
    0 === c && Vc(a);
  }
};
function nl(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
}
function ol(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
}
function pl() {
}
function ql(a, b, c, d, e) {
  if (e) {
    if ("function" === typeof d) {
      var f2 = d;
      d = function() {
        var a2 = gl(g);
        f2.call(a2);
      };
    }
    var g = el(b, d, a, 0, null, false, false, "", pl);
    a._reactRootContainer = g;
    a[uf] = g.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    Rk();
    return g;
  }
  for (; e = a.lastChild; ) a.removeChild(e);
  if ("function" === typeof d) {
    var h = d;
    d = function() {
      var a2 = gl(k2);
      h.call(a2);
    };
  }
  var k2 = bl(a, 0, false, null, null, false, false, "", pl);
  a._reactRootContainer = k2;
  a[uf] = k2.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  Rk(function() {
    fl(b, k2, c, d);
  });
  return k2;
}
function rl(a, b, c, d, e) {
  var f2 = c._reactRootContainer;
  if (f2) {
    var g = f2;
    if ("function" === typeof e) {
      var h = e;
      e = function() {
        var a2 = gl(g);
        h.call(a2);
      };
    }
    fl(b, g, a, e);
  } else g = ql(c, b, a, e, d);
  return gl(g);
}
Ec = function(a) {
  switch (a.tag) {
    case 3:
      var b = a.stateNode;
      if (b.current.memoizedState.isDehydrated) {
        var c = tc(b.pendingLanes);
        0 !== c && (Cc(b, c | 1), Dk(b, B()), 0 === (K & 6) && (Gj = B() + 500, jg()));
      }
      break;
    case 13:
      Rk(function() {
        var b2 = ih(a, 1);
        if (null !== b2) {
          var c2 = R();
          gi(b2, a, 1, c2);
        }
      }), il(a, 1);
  }
};
Fc = function(a) {
  if (13 === a.tag) {
    var b = ih(a, 134217728);
    if (null !== b) {
      var c = R();
      gi(b, a, 134217728, c);
    }
    il(a, 134217728);
  }
};
Gc = function(a) {
  if (13 === a.tag) {
    var b = yi(a), c = ih(a, b);
    if (null !== c) {
      var d = R();
      gi(c, a, b, d);
    }
    il(a, b);
  }
};
Hc = function() {
  return C;
};
Ic = function(a, b) {
  var c = C;
  try {
    return C = a, b();
  } finally {
    C = c;
  }
};
yb = function(a, b, c) {
  switch (b) {
    case "input":
      bb(a, c);
      b = c.name;
      if ("radio" === c.type && null != b) {
        for (c = a; c.parentNode; ) c = c.parentNode;
        c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');
        for (b = 0; b < c.length; b++) {
          var d = c[b];
          if (d !== a && d.form === a.form) {
            var e = Db(d);
            if (!e) throw Error(p(90));
            Wa(d);
            bb(d, e);
          }
        }
      }
      break;
    case "textarea":
      ib(a, c);
      break;
    case "select":
      b = c.value, null != b && fb(a, !!c.multiple, b, false);
  }
};
Gb = Qk;
Hb = Rk;
var sl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Qk] }, tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
  a = Zb(a);
  return null === a ? null : a.stateNode;
}, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
  var vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!vl.isDisabled && vl.supportsFiber) try {
    kc = vl.inject(ul), lc = vl;
  } catch (a) {
  }
}
reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
reactDom_production_min.createPortal = function(a, b) {
  var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
  if (!nl(b)) throw Error(p(200));
  return cl(a, b, null, c);
};
reactDom_production_min.createRoot = function(a, b) {
  if (!nl(a)) throw Error(p(299));
  var c = false, d = "", e = kl;
  null !== b && void 0 !== b && (true === b.unstable_strictMode && (c = true), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e = b.onRecoverableError));
  b = bl(a, 1, false, null, null, c, false, d, e);
  a[uf] = b.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  return new ll(b);
};
reactDom_production_min.findDOMNode = function(a) {
  if (null == a) return null;
  if (1 === a.nodeType) return a;
  var b = a._reactInternals;
  if (void 0 === b) {
    if ("function" === typeof a.render) throw Error(p(188));
    a = Object.keys(a).join(",");
    throw Error(p(268, a));
  }
  a = Zb(b);
  a = null === a ? null : a.stateNode;
  return a;
};
reactDom_production_min.flushSync = function(a) {
  return Rk(a);
};
reactDom_production_min.hydrate = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, true, c);
};
reactDom_production_min.hydrateRoot = function(a, b, c) {
  if (!nl(a)) throw Error(p(405));
  var d = null != c && c.hydratedSources || null, e = false, f2 = "", g = kl;
  null !== c && void 0 !== c && (true === c.unstable_strictMode && (e = true), void 0 !== c.identifierPrefix && (f2 = c.identifierPrefix), void 0 !== c.onRecoverableError && (g = c.onRecoverableError));
  b = el(b, null, a, 1, null != c ? c : null, e, false, f2, g);
  a[uf] = b.current;
  sf(a);
  if (d) for (a = 0; a < d.length; a++) c = d[a], e = c._getVersion, e = e(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e] : b.mutableSourceEagerHydrationData.push(
    c,
    e
  );
  return new ml(b);
};
reactDom_production_min.render = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, false, c);
};
reactDom_production_min.unmountComponentAtNode = function(a) {
  if (!ol(a)) throw Error(p(40));
  return a._reactRootContainer ? (Rk(function() {
    rl(null, null, a, false, function() {
      a._reactRootContainer = null;
      a[uf] = null;
    });
  }), true) : false;
};
reactDom_production_min.unstable_batchedUpdates = Qk;
reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
  if (!ol(c)) throw Error(p(200));
  if (null == a || void 0 === a._reactInternals) throw Error(p(38));
  return rl(a, b, c, false, d);
};
reactDom_production_min.version = "18.3.1-next-f1338f8080-20240426";
function checkDCE() {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
    return;
  }
  try {
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    console.error(err);
  }
}
{
  checkDCE();
  reactDom.exports = reactDom_production_min;
}
var reactDomExports = reactDom.exports;
var m = reactDomExports;
{
  client.createRoot = m.createRoot;
  client.hydrateRoot = m.hydrateRoot;
}
const c255 = (v2) => v2 < 0 ? 0 : v2 > 255 ? 255 : v2;
function hsv2rgb(h, s, v2) {
  h = (h % 360 + 360) % 360;
  const c = v2 * s, x2 = c * (1 - Math.abs(h / 60 % 2 - 1)), m2 = v2 - c;
  let r2 = 0, g = 0, b = 0;
  if (h < 60) {
    r2 = c;
    g = x2;
  } else if (h < 120) {
    r2 = x2;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x2;
  } else if (h < 240) {
    g = x2;
    b = c;
  } else if (h < 300) {
    r2 = x2;
    b = c;
  } else {
    r2 = c;
    b = x2;
  }
  return [r2 + m2, g + m2, b + m2];
}
const AXIS16 = ["R", "YL", "G", "CY", "B", "MG"];
const AXIS_NAME = { R: "Red", YL: "Yellow", G: "Green", CY: "Cyan", B: "Blue", MG: "Magenta" };
const AXIS_HUE = (() => {
  const o = {};
  const idxR = AXIS16.indexOf("R");
  AXIS16.forEach((a, i) => {
    o[a] = ((i - idxR) * 60 + 360) % 360;
  });
  return o;
})();
function applyDetail(data, W2, H2, level) {
  if (level === 0) return data;
  const out = new Uint8ClampedArray(data);
  const amt = level / 7 * 0.6;
  for (let y2 = 1; y2 < H2 - 1; y2++) {
    for (let x2 = 1; x2 < W2 - 1; x2++) {
      const i = (y2 * W2 + x2) * 4;
      for (let c = 0; c < 3; c++) {
        const lap = 4 * data[i + c] - data[i - 4 + c] - data[i + 4 + c] - data[i - W2 * 4 + c] - data[i + W2 * 4 + c];
        out[i + c] = c255(data[i + c] + lap * amt);
      }
    }
  }
  return out;
}
const SW = 1280, SH = 720;
function drawFallbackScene(ctx) {
  let g = ctx.createLinearGradient(0, 0, SW, SH);
  g.addColorStop(0, "rgb(155, 162, 170)");
  g.addColorStop(1, "rgb(98, 105, 114)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SW, SH);
  const rg2 = ctx.createRadialGradient(SW * 0.2, SH * 0.2, 20, SW * 0.2, SH * 0.2, SW * 0.45);
  rg2.addColorStop(0, "rgba(255, 252, 245, 0.9)");
  rg2.addColorStop(1, "rgba(255, 252, 245, 0)");
  ctx.fillStyle = rg2;
  ctx.fillRect(0, 0, SW, SH);
  ctx.fillStyle = "rgb(42, 45, 48)";
  ctx.beginPath();
  ctx.moveTo(SW * 0.15, SH * 0.8);
  ctx.lineTo(SW * 0.85, SH * 0.8);
  ctx.lineTo(SW * 0.9, SH);
  ctx.lineTo(SW * 0.1, SH);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgb(30, 32, 35)";
  ctx.beginPath();
  ctx.moveTo(SW * 0.25, SH * 0.8);
  ctx.lineTo(SW * 0.35, SH * 0.8);
  ctx.lineTo(SW * 0.38, SH * 0.55);
  ctx.lineTo(SW * 0.22, SH * 0.55);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgb(30, 32, 35)";
  ctx.beginPath();
  ctx.moveTo(SW * 0.65, SH * 0.8);
  ctx.lineTo(SW * 0.75, SH * 0.8);
  ctx.lineTo(SW * 0.78, SH * 0.55);
  ctx.lineTo(SW * 0.62, SH * 0.55);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgb(20, 20, 20)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(SW * 0.5, SH * 0.8);
  ctx.lineTo(SW * 0.48, SH * 0.7);
  ctx.lineTo(SW * 0.52, SH * 0.62);
  ctx.stroke();
  ctx.fillStyle = "rgb(50, 50, 50)";
  ctx.beginPath();
  ctx.arc(SW * 0.52, SH * 0.6, 10, 0, Math.PI * 2);
  ctx.fill();
  const colors = ["rgb(200, 50, 50)", "rgb(230, 160, 40)", "rgb(60, 150, 80)", "rgb(50, 110, 200)"];
  colors.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(SW - 130 + i * 28, SH - 36, 22, 22);
  });
}
const T = {
  page: "#0d0e10",
  side: "#16181b",
  sideActive: "#1e6fd9",
  panel: "#1a1d21",
  panel2: "#212529",
  line: "#2c3138",
  line2: "#3a4048",
  text: "#e8eaec",
  dim: "#8e959c",
  faint: "#5e656d",
  blue: "#1e9bf0",
  blueDark: "#1670b8",
  green: "#37d67a",
  amber: "#f5a623"
};
const fUI = "'Segoe UI','Noto Sans TC',system-ui,sans-serif";
const fMono = "'Consolas','Courier New',monospace";
const GRIDSYS = { columns: 24, gutter: 16, margin: 24, containerMax: 1350 };
const SP = { 2: 8, 3: 16 };
const colW = (span, containerWidth = GRIDSYS.containerMax) => {
  const inner = containerWidth - GRIDSYS.margin * 2;
  const c = (inner - GRIDSYS.gutter * (GRIDSYS.columns - 1)) / GRIDSYS.columns;
  return Math.round(c * span + GRIDSYS.gutter * (span - 1));
};
const BLOCKS = [
  ["matrix", "Matrix", "Matrix Color Matrix"],
  // 2026-06-16 修改註記：將 Multi-Matrix 描述由 16 Axes改為 6 Axes
  ["multi", "Multi-Matrix", "6-Axis Color Correction"],
  // 2026-06 [PM 定案] 移除 Detail 分頁(render 分支與 applyDetail 效果保留為無作用 dead code,st.detail 維持預設 0)
  ["knee", "Knee", "Highlight Compression"],
  ["black", "Black Level", "Black Level"]
];
const MATRIX_KEYS = [
  ["level", "Level", ""],
  ["phase", "Phase", ""],
  ["rg", "R-G", ""],
  ["rb", "R-B", ""],
  ["gr", "G-R", ""],
  ["gb", "G-B", ""],
  ["br", "B-R", ""],
  ["bg", "B-G", ""]
];
const DEF_AXES = () => {
  const o = {};
  AXIS16.forEach((a) => o[a] = { hue: 0, sat: 0 });
  return o;
};
const DEF = {
  matrixOn: false,
  level: 0,
  phase: 0,
  rg: 0,
  rb: 0,
  gr: 0,
  gb: 0,
  br: 0,
  bg: 0,
  multiOn: false,
  axes: DEF_AXES(),
  detailOn: false,
  detail: 0,
  kneeOn: false,
  autoKnee: false,
  kneeSens: "Mid",
  kneePoint: 95,
  kneeSlope: 0,
  masterBlack: 0,
  rBlack: 0,
  bBlack: 0
};
function Slider({ k: k2, label, hint, min, max, val, onChange, neutral = 0, onStartDrag, onEndDrag, disabled = false, dense = false, accent }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: dense ? 4 : 14, opacity: disabled ? 0.4 : 1 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: dense ? 2 : 5 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 14, color: T.text }, children: [
        label,
        hint ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: T.faint, fontSize: 14 }, children: [
          " · ",
          hint
        ] }) : null
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: fMono, fontSize: 14, color: val === neutral ? T.faint : T.blue }, children: val > 0 && min < 0 ? "+" + val : val })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: fMono, fontSize: 14, color: T.faint, width: 24, textAlign: "right" }, children: min }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "range",
          min,
          max,
          value: val,
          disabled,
          onChange: (e) => onChange(parseInt(e.target.value)),
          onMouseDown: onStartDrag,
          onTouchStart: onStartDrag,
          onMouseUp: onEndDrag,
          onTouchEnd: onEndDrag,
          className: "tr-sl",
          style: {
            "--p": (val - min) / (max - min) * 100 + "%",
            cursor: disabled ? "not-allowed" : "pointer",
            background: accent ? `linear-gradient(90deg, ${accent} var(--p), #33393f var(--p))` : void 0
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: fMono, fontSize: 14, color: T.faint, width: 24 }, children: max })
    ] })
  ] });
}
function MatrixRing({ level, phase, rg: rg2, rb: rb2, gr, gb: gb2, br, bg: bg2 }) {
  const C2 = 50;
  const Rn = 41;
  const sat = Math.max(0.25, 1 + level / 99 * 0.85);
  const rot = phase / 99 * 45;
  const prim = [
    { label: "R", base: 0, hue: 0 + rg2 / 99 * 44 - rb2 / 99 * 44 },
    { label: "G", base: 120, hue: 120 - gr / 99 * 44 + gb2 / 99 * 44 },
    { label: "B", base: 240, hue: 240 + br / 99 * 44 - bg2 / 99 * 44 }
  ];
  const place = (hueDeg, r2) => {
    const rad = (hueDeg + rot) * Math.PI / 180;
    return [C2 + r2 * Math.sin(rad), C2 - r2 * Math.cos(rad)];
  };
  const anyMoved = prim.some((p2) => Math.abs(p2.hue - p2.base) > 0.5);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "100%", height: "100%", aspectRatio: "1", position: "relative", flexShrink: 0 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      position: "absolute",
      inset: 0,
      borderRadius: "50%",
      background: "conic-gradient(from 0deg, hsl(0,90%,55%), hsl(60,90%,55%), hsl(120,90%,55%), hsl(180,90%,55%), hsl(240,90%,55%), hsl(300,90%,55%), hsl(360,90%,55%))",
      filter: `hue-rotate(${rot}deg) saturate(${sat})`,
      WebkitMask: "radial-gradient(circle, transparent 42%, #000 44%)",
      mask: "radial-gradient(circle, transparent 42%, #000 44%)",
      boxShadow: "0 0 10px rgba(255,255,255,0.10)",
      transition: "filter .3s cubic-bezier(.16,1,.3,1)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: "13%", borderRadius: "50%", border: "1.2px dashed rgba(255,255,255,0.16)", animation: "mmspin 35s linear infinite", pointerEvents: "none" } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 100 100", style: { position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: "mtxNodeShadow", x: "-60%", y: "-60%", width: "220%", height: "220%", children: /* @__PURE__ */ jsxRuntimeExports.jsx("feDropShadow", { dx: "0", dy: "0.6", stdDeviation: "1.1", floodColor: "#000", floodOpacity: "0.5" }) }) }),
      prim.map((p2) => {
        const [bx, by] = place(p2.base, Rn);
        const [hx, hy] = place(p2.hue, Rn);
        const nodeHue = (p2.hue + rot + 360) % 360;
        const col = `hsl(${nodeHue} 85% 55%)`;
        const [r2, g, b] = hsv2rgb(nodeHue, 0.85, 0.95);
        const moved = Math.abs(hx - bx) > 0.25 || Math.abs(hy - by) > 0.25;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { style: { transition: "all .3s cubic-bezier(.16,1,.3,1)" }, children: [
          moved && /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: bx, y1: by, x2: hx, y2: hy, stroke: col, strokeWidth: "1.4", strokeLinecap: "round", opacity: "0.5" }),
          moved && /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: bx, cy: by, r: "1.6", fill: "none", stroke: "rgba(255,255,255,0.35)", strokeWidth: "0.7" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: hx, cy: hy, r: "7", fill: `rgb(${r2 * 255},${g * 255},${b * 255})`, stroke: "#fff", strokeWidth: "1.4", filter: "url(#mtxNodeShadow)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: hx, y: hy, textAnchor: "middle", dominantBaseline: "central", fontSize: "6.2", fontWeight: "800", fill: "#fff", style: { fontFamily: "monospace" }, children: p2.label })
        ] }, p2.label);
      })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", inset: "22%", borderRadius: "50%", background: "radial-gradient(circle at 38% 30%, #181c21, #0e1114)", border: `1px solid ${anyMoved ? "rgba(30,155,240,0.4)" : "rgba(255,255,255,0.12)"}`, boxShadow: "inset 0 0 18px rgba(0,0,0,0.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, transition: "border-color .4s ease" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13, letterSpacing: 1.5, color: "rgba(255,255,255,0.42)", fontFamily: "monospace" }, children: "Matrix" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 23, fontWeight: 700, color: "rgba(255,255,255,0.88)", lineHeight: 1.1, marginTop: 1 }, children: "RGB" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color: anyMoved ? "#f5a623" : "rgba(255,255,255,0.32)", fontFamily: "monospace", marginTop: 2 }, children: anyMoved ? "● Adjusted" : "3 Primary Crosstalk" })
    ] })
  ] });
}
const SHUTTER_LIST = ["1/1", "1/2", "1/4", "1/8", "1/15", "1/30", "1/60", "1/100", "1/125", "1/250", "1/500", "1/1000", "1/2000", "1/4000", "1/10000"];
const IRIS_LIST = ["Close", "F14", "F11", "F9.6", "F8", "F6.8", "F5.6", "F4.8", "F4", "F3.4", "F2.8", "F2.4", "F2", "F1.8", "F1.6"];
const EXP_MODES = [
  ["auto", "Full Auto"],
  ["iris", "Iris Priority"],
  ["shutter", "Shutter Priority"],
  ["manual", "Manual"],
  ["bright", "Bright"]
];
const EXP_ENABLED = {
  auto: { ev: 1, shutter: 0, iris: 0, gain: 0, gainLimit: 1, blc: 1, slow: 1, wdr: 1, bright: 0 },
  iris: { ev: 1, shutter: 0, iris: 1, gain: 0, gainLimit: 1, blc: 1, slow: 1, wdr: 1, bright: 0 },
  shutter: { ev: 1, shutter: 1, iris: 0, gain: 0, gainLimit: 1, blc: 1, slow: 0, wdr: 1, bright: 0 },
  manual: { ev: 0, shutter: 1, iris: 1, gain: 1, gainLimit: 0, blc: 1, slow: 0, wdr: 1, bright: 0 },
  bright: { ev: 0, shutter: 0, iris: 0, gain: 0, gainLimit: 0, blc: 1, slow: 1, wdr: 1, bright: 1 }
};
const CAM_DEFAULTS = {
  tab: "exp",
  expMode: "auto",
  ev: 0,
  shutterIdx: 6,
  irisIdx: 9,
  gain: 24,
  gainLimit: 24,
  blc: 0,
  ndFilter: "clear",
  slowShutter: false,
  wdr: "off",
  brightVal: 25,
  saturation: 5,
  sharpness: 2,
  contrast: 2,
  wbMode: "auto",
  rGain: 59,
  bGain: 102,
  noiseFilter: "off",
  mirror: false,
  flip: false,
  ldc: false
};
function ExpSlider({ label, leftLabel, rightLabel, valueText, min, max, val, onChange, disabled, accent, id: id2 }) {
  const ac2 = accent || T.blue;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    width: "100%",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.10)",
    borderRadius: 8,
    padding: "10px 12px",
    boxSizing: "border-box",
    opacity: disabled ? 0.4 : 1
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12.5, color: T.text, fontWeight: 600 }, children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: fMono, fontSize: 12.5, color: disabled ? T.faint : ac2 }, children: valueText })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: fMono, fontSize: 11, color: T.faint, minWidth: 26, textAlign: "right" }, children: leftLabel }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          id: id2,
          type: "range",
          min,
          max,
          value: val,
          disabled,
          onChange: (e) => onChange(parseInt(e.target.value)),
          className: "tr-sl",
          style: { "--p": (val - min) / (max - min) * 100 + "%", cursor: disabled ? "not-allowed" : "pointer", flex: 1 }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: fMono, fontSize: 11, color: T.faint, minWidth: 38 }, children: rightLabel })
    ] })
  ] });
}
function CamCheck({ label, checked, onChange, disabled, id: id2 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      id: id2,
      onClick: () => {
        if (!disabled) onChange(!checked);
      },
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 12px",
        borderRadius: 8,
        border: "1px solid rgba(255, 255, 255, 0.10)",
        background: "rgba(255, 255, 255, 0.03)",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.4 : 1,
        userSelect: "none",
        boxSizing: "border-box",
        flex: 1
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${checked ? T.blue : T.line2}`, background: checked ? T.blue : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }, children: checked && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fff", fontSize: 10, fontWeight: 700, lineHeight: 1 }, children: "✓" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12.5, color: T.text }, children: label })
      ]
    }
  );
}
function CamRadio({ label, checked, onChange, id: id2 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { id: id2, onClick: onChange, style: { display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, color: checked ? T.text : T.dim, userSelect: "none" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 13, height: 13, borderRadius: "50%", border: `1.5px solid ${checked ? T.blue : T.line2}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }, children: checked && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 6, height: 6, borderRadius: "50%", background: T.blue } }) }),
    label
  ] });
}
function gaugePolar(cx, cy, r2, deg) {
  const rad = deg * Math.PI / 180;
  return [cx + r2 * Math.sin(rad), cy - r2 * Math.cos(rad)];
}
function gaugeArc(cx, cy, r2, startDeg, endDeg) {
  const [sx, sy] = gaugePolar(cx, cy, r2, startDeg);
  const [ex, ey] = gaugePolar(cx, cy, r2, endDeg);
  const large = (endDeg - startDeg) % 360 > 180 ? 1 : 0;
  return `M ${sx} ${sy} A ${r2} ${r2} 0 ${large} 1 ${ex} ${ey}`;
}
function ColorGauge({ label, gain, hue, col, disabled, onGain, onHue, startDrag, endDrag }) {
  const ref = reactExports.useRef(null);
  const dragRef = reactExports.useRef(false);
  const [dragging, setDragging] = reactExports.useState(false);
  const [mounted, setMounted] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const t2 = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t2);
  }, []);
  const START = 225, SWEEP = 270, C2 = 60, R2 = 46;
  const f2 = mounted ? (gain + 99) / 198 : 0;
  const endDeg = START + f2 * SWEEP;
  const [tx, ty] = gaugePolar(C2, C2, R2, endDeg);
  const gid = "gg-" + label;
  const apply = (e) => {
    const el2 = ref.current;
    if (!el2) return;
    const rect = el2.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    let ang = Math.atan2(dx, -dy) * 180 / Math.PI;
    ang = (ang + 360) % 360;
    let sweep = (ang - START + 360) % 360;
    if (sweep > SWEEP) sweep = sweep > SWEEP + (360 - SWEEP) / 2 ? 0 : SWEEP;
    onGain(Math.round(sweep / SWEEP * 198 - 99));
  };
  const tr = dragging ? "none" : "all 0.55s cubic-bezier(0.16,1,0.3,1)";
  const ticks = [];
  for (let i = 0; i <= 12; i++) {
    const [x1, y1] = gaugePolar(C2, C2, R2 + 8, START + i / 12 * SWEEP);
    const [x2, y2] = gaugePolar(C2, C2, R2 + 11, START + i / 12 * SWEEP);
    ticks.push(/* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1, y1, x2, y2, stroke: "rgba(255,255,255,0.18)", strokeWidth: "1.4", strokeLinecap: "round" }, i));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        ref,
        viewBox: "0 0 120 120",
        onPointerDown: disabled ? void 0 : (e) => {
          dragRef.current = true;
          setDragging(true);
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch (x2) {
          }
          startDrag && startDrag();
          apply(e);
        },
        onPointerMove: disabled ? void 0 : (e) => {
          if (dragRef.current) apply(e);
        },
        onPointerUp: disabled ? void 0 : (e) => {
          dragRef.current = false;
          setDragging(false);
          try {
            e.currentTarget.releasePointerCapture(e.pointerId);
          } catch (x2) {
          }
          endDrag && endDrag();
        },
        style: { touchAction: "none", cursor: disabled ? "default" : "pointer", display: "block", overflow: "visible", width: "100%", maxWidth: 128, height: "auto", aspectRatio: "1 / 1" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: gid, x1: "0", y1: "1", x2: "1", y2: "0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "rgba(255,255,255,0.22)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: col })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: gid + "-glow", x: "-60%", y: "-60%", width: "220%", height: "220%", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: "3", result: "b" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "b" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: gid + "-glowS", x: "-80%", y: "-80%", width: "260%", height: "260%", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: dragging ? 5 : 3.5, result: "b" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "b" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
              ] })
            ] })
          ] }),
          ticks,
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: gaugeArc(C2, C2, R2, START, START + SWEEP), fill: "none", stroke: "#23272d", strokeWidth: "9", strokeLinecap: "round" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: gaugeArc(C2, C2, R2, START, endDeg), fill: "none", stroke: `url(#${gid})`, strokeWidth: "9", strokeLinecap: "round", filter: `url(#${gid}-glow)`, style: { transition: tr } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: C2, cy: C2, r: "24", fill: col, filter: `url(#${gid}-glow)`, style: { transition: "fill 0.3s ease" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: C2, cy: C2, r: "24", fill: "none", stroke: "rgba(255,255,255,0.3)", strokeWidth: "1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: C2, y: C2 + Math.min(6, 80 / label.length * 0.34), textAnchor: "middle", fontSize: Math.min(17, 84 / label.length), fontWeight: "800", fill: "#fff", children: label }),
          dragging && /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: tx, cy: ty, fill: "none", stroke: "#fff", strokeWidth: "1.5", className: "aver-gauge-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: tx, cy: ty, r: dragging ? 9 : 7, fill: "#fff", filter: `url(#${gid}-glowS)`, style: { transition: tr + ", r 0.18s ease" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: tx, cy: ty, r: "3.2", fill: col, style: { transition: tr } })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "baseline", gap: 5, marginTop: -6 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: T.faint, letterSpacing: 0.5 }, children: "GAIN" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 16, fontWeight: 700, fontFamily: fMono, color: gain !== 0 ? T.blue : T.dim, transition: "color .25s" }, children: gain > 0 ? "+" + gain : gain })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "84%" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 10.5, marginBottom: 1 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: T.faint }, children: "HUE" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: hue !== 0 ? T.amber : T.faint, fontFamily: fMono, fontWeight: 600, transition: "color .25s" }, children: hue > 0 ? "+" + hue : hue })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "range",
          min: -99,
          max: 99,
          value: hue,
          disabled,
          onChange: (e) => onHue(parseInt(e.target.value)),
          onMouseDown: startDrag,
          onTouchStart: startDrag,
          onMouseUp: endDrag,
          onTouchEnd: endDrag,
          className: "tr-sl",
          style: { "--p": (hue + 99) / 198 * 100 + "%", height: 3, width: "100%", cursor: disabled ? "not-allowed" : "pointer", background: `linear-gradient(90deg, ${T.amber} ${(hue + 99) / 198 * 100}%, #33393f ${(hue + 99) / 198 * 100}%)` }
        }
      )
    ] })
  ] });
}
function Toggle({ on, onChange, label }) {
  const isOnOff = label === "ON" || label === "OFF";
  const labelStyle = isOnOff ? { fontSize: 14, color: on ? T.text : T.dim, width: 32, display: "inline-block", textAlign: "left" } : { fontSize: 14, color: on ? T.text : T.dim };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      role: "button",
      tabIndex: 0,
      onClick: () => onChange(!on),
      onKeyDown: (e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onChange(!on);
        }
      },
      style: { display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0, userSelect: "none" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 34, height: 18, borderRadius: 9, background: on ? T.blue : T.line2, position: "relative", transition: "background .3s ease" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { position: "absolute", top: 2, left: on ? 18 : 2, width: 14, height: 14, borderRadius: 7, background: "#fff", transition: "left .3s cubic-bezier(.34,1.56,.64,1)" } }) }),
        label && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: labelStyle, children: label })
      ]
    }
  );
}
function BlockHeader({ title, sub, right }) {
  return (
    // 2026-06-16 修改註記：配合 Chrome 100% 下防裁切，將 marginBottom 由 14 縮小為 6
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, gap: 10 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 17, fontWeight: 600, color: T.text }, children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 14, color: T.faint, marginTop: 2 }, children: sub })
      ] }),
      right
    ] })
  );
}
function MiniBtn({ children, onClick, primary, disabled }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick,
      disabled,
      style: {
        flex: 1,
        width: "100%",
        boxSizing: "border-box",
        margin: 0,
        padding: "4px 0",
        fontSize: 14,
        cursor: disabled ? "default" : "pointer",
        borderRadius: 5,
        border: `1px solid ${primary ? T.blueDark : T.line2}`,
        background: primary ? "rgba(30,155,240,0.12)" : "transparent",
        color: disabled ? T.faint : primary ? T.blue : T.dim,
        opacity: disabled ? 0.45 : 1,
        fontFamily: fUI
      },
      children
    }
  );
}
function Note({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 14, color: T.faint, lineHeight: 1.6, marginTop: 6, paddingTop: 8, borderTop: `1px solid ${T.line}` }, children });
}
function ConfigCard({ title, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    background: T.panel,
    border: `1px solid ${T.line}`,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
    width: "100%",
    boxSizing: "border-box"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      background: "rgba(0, 0, 0, 0.22)",
      padding: "10px 16px",
      fontSize: 14,
      fontWeight: 600,
      color: "#fff",
      borderBottom: `1px solid ${T.line}`,
      fontFamily: fUI
    }, children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      padding: "16px 20px",
      fontFamily: fUI
    }, children })
  ] });
}
function VerticalRadio({ label, checked, onChange, disabled }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    cursor: disabled ? "not-allowed" : "pointer",
    userSelect: "none",
    minWidth: 70,
    opacity: disabled ? 0.45 : 1
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "radio",
        checked,
        onChange: disabled ? void 0 : onChange,
        style: { display: "none" }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
      width: 14,
      height: 14,
      borderRadius: "50%",
      border: checked ? `2px solid #fff` : `2px solid ${T.faint}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "transparent",
      transition: "all 0.15s"
    }, children: checked && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 6, height: 6, borderRadius: "50%", background: "#fff" } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
      fontSize: 14,
      color: checked ? "#fff" : T.dim,
      fontWeight: checked ? 600 : 400,
      fontFamily: fUI
    }, children: label })
  ] });
}
function Select({ val, options, onChange, disabled, style }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "select",
    {
      value: val,
      onChange: (e) => onChange(e.target.value),
      disabled,
      style: {
        background: "#101216",
        border: `1px solid ${T.line2}`,
        borderRadius: 6,
        color: disabled ? T.faint : T.text,
        fontSize: 14,
        padding: "8px 12px",
        outline: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        width: "100%",
        maxWidth: 320,
        fontFamily: fUI,
        opacity: disabled ? 0.6 : 1,
        transition: "border-color 0.15s",
        boxSizing: "border-box",
        ...style
      },
      children: options.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt, style: { background: "#1a1d21", color: T.text }, children: opt }, opt))
    }
  );
}
function FormField({ label, children, rightLabel, style }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    border: `1.5px solid ${T.line}`,
    borderRadius: 4,
    background: "#08090a",
    // 完全黑色背景，與 AVer 設計稿保持一致
    display: "flex",
    flexDirection: "column",
    minHeight: 84,
    // 統一控制高度以利網格對齊
    boxSizing: "border-box",
    width: "100%",
    ...style
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      background: "#22252a",
      // 灰色小 Header 背景
      padding: "4px 12px",
      fontSize: 14,
      fontWeight: 600,
      color: T.dim,
      borderBottom: `1.5px solid ${T.line}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontFamily: fUI
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
      rightLabel !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: T.blue, fontFamily: fMono }, children: rightLabel })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      padding: "8px 12px",
      flex: 1,
      display: "flex",
      alignItems: "center",
      background: "#08090a",
      fontFamily: fUI,
      boxSizing: "border-box"
    }, children })
  ] });
}
function BodySlider({ val, min, max, onChange }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "0 6px", boxSizing: "border-box" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13, color: T.faint, width: 14, textAlign: "right", fontFamily: fMono }, children: min }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "range",
        min,
        max,
        value: val,
        onChange: (e) => onChange(parseInt(e.target.value)),
        className: "tr-sl",
        style: {
          "--p": (val - min) / (max - min) * 100 + "%",
          flex: 1,
          height: 4,
          borderRadius: 2
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13, color: T.faint, width: 14, fontFamily: fMono }, children: max })
  ] });
}
const STD_FIXED_THUMB = "aver_default_meeting_room.png";
function SceneTile({ thumb, name, remark, active, dirty, factory, onLoad, onEdit, onDelete }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aver-pop", style: {
    padding: "0px",
    boxSizing: "border-box",
    width: "100%"
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    position: "relative",
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
    background: T.panel2,
    border: `1.5px solid ${T.line}`,
    boxSizing: "border-box",
    transition: "all 0.15s ease"
  }, children: [
    active && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      position: "absolute",
      inset: 0,
      border: `3px solid ${T.blue}`,
      borderRadius: 8,
      pointerEvents: "none",
      // 點擊穿透，不影響使用者操作卡片內的按鈕
      zIndex: 9999,
      // 圖層最上層
      boxSizing: "border-box"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: onLoad, title: remark || name, style: { cursor: "pointer" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", height: 50, background: "#0a0c0e" }, children: [
        thumb ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: thumb,
            alt: "",
            style: {
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block"
            }
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: T.faint,
          fontSize: 14
        }, children: "No Thumbnail" }),
        active && dirty && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
          position: "absolute",
          right: 8,
          top: 8,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: T.amber,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
          border: "1px solid #fff",
          fontSize: 12,
          fontWeight: "bold",
          color: "#fff",
          zIndex: 1e4
          // 高於 5px 選擇框，確保正常疊放
        }, children: "!" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 4, padding: "6px 8px 7px", background: "transparent" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
          flex: 1,
          fontSize: 14,
          fontWeight: active ? 700 : 500,
          color: active ? "#fff" : T.text,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }, children: name }),
        !factory && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 4, alignItems: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: (e) => {
                e.stopPropagation();
                onEdit();
              },
              title: "Edit Name and Note",
              style: {
                background: "none",
                border: "none",
                cursor: "pointer",
                color: T.dim,
                fontSize: 14,
                padding: "2px",
                lineHeight: 1,
                opacity: 0.7,
                transition: "opacity 0.2s"
              },
              children: "✎"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: (e) => {
                e.stopPropagation();
                onDelete();
              },
              title: "Delete",
              style: {
                background: "none",
                border: "none",
                cursor: "pointer",
                color: T.dim,
                fontSize: 14,
                padding: "2px",
                lineHeight: 1,
                opacity: 0.7,
                transition: "opacity 0.2s"
              },
              children: "✕"
            }
          )
        ] })
      ] })
    ] })
  ] }) });
}
const FACE_ENROLLMENT_DEMO_IMAGE = "face-enrollment-demo-tech-office-v6.png";
const FACE_ENROLLMENT_DEMO_SIZE = { width: 1672, height: 941 };
const FACE_ENROLLMENT_CANDIDATES = [
  { id: "front-left", status: "eligible", label: "Enrolled", crop: { x: 276, y: 397, size: 154 } },
  { id: "front-center", status: "eligible", label: "Enrolled", crop: { x: 585, y: 108, size: 138 } },
  { id: "front-right", status: "eligible", label: "Enrolled", crop: { x: 1007, y: 399, size: 170 } },
  { id: "side-profile", status: "side-angle", label: "Side angle", crop: { x: 1404, y: 330, size: 186 } },
  { id: "blurred-distance", status: "low-quality", label: "Low quality", crop: { x: 1174, y: 157, size: 158 } }
];
function FaceEnrollmentCrop({ candidateId, label, recaptured = false }) {
  const candidate = FACE_ENROLLMENT_CANDIDATES.find((item) => item.id === candidateId) || FACE_ENROLLMENT_CANDIDATES[0];
  const { x: x2, y: y2, size } = candidate.crop;
  const recaptureInset = recaptured ? size * 0.08 : 0;
  const cropSize = size - recaptureInset * 2;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { role: "img", "aria-label": label, viewBox: `${x2 + recaptureInset} ${y2 + recaptureInset} ${cropSize} ${cropSize}`, preserveAspectRatio: "xMidYMid slice", style: { width: "100%", height: "100%", display: "block" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("image", { href: FACE_ENROLLMENT_DEMO_IMAGE, x: "0", y: "0", width: FACE_ENROLLMENT_DEMO_SIZE.width, height: FACE_ENROLLMENT_DEMO_SIZE.height, preserveAspectRatio: "none" }) });
}
function App$1() {
  var _a;
  const [st, setSt] = reactExports.useState(JSON.parse(JSON.stringify(DEF)));
  const [block, setBlock] = reactExports.useState("matrix");
  const [selAxis, setSelAxis] = reactExports.useState(null);
  const [wheelFlash, setWheelFlash] = reactExports.useState(null);
  const triggerWheelFlash = (axis) => setWheelFlash((b) => ({ axis, key: ((b == null ? void 0 : b.key) || 0) + 1 }));
  const [scenes, setScenes] = reactExports.useState([]);
  const [activeScene, setActiveScene] = reactExports.useState("std");
  const getActiveSceneData = () => {
    if (activeScene === "std") return DEF;
    const curSc = scenes.find((x2) => x2.id === activeScene);
    return curSc ? curSc.data : DEF;
  };
  const isDirty = JSON.stringify(st) !== JSON.stringify(getActiveSceneData());
  const [saveOpen, setSaveOpen] = reactExports.useState(false);
  const [libOpen, setLibOpen] = reactExports.useState(false);
  const [scName, setScName] = reactExports.useState("");
  const [scRemark, setScRemark] = reactExports.useState("");
  const [editingScene, setEditingScene] = reactExports.useState(null);
  const [edName, setEdName] = reactExports.useState("");
  const [edRemark, setEdRemark] = reactExports.useState("");
  const [stdThumb, setStdThumb] = reactExports.useState(null);
  const [scope, setScope] = reactExports.useState("vector");
  const [showScope, setShowScope] = reactExports.useState(false);
  const [bypass, setBypass] = reactExports.useState(false);
  const [colorBars, setColorBars] = reactExports.useState(false);
  const [net, setNet] = reactExports.useState({
    dhcp: "on",
    hostname: "TR315-11c96d",
    ntp: "off",
    ip: "192.168.1.168",
    netmask: "255.255.255.0",
    gateway: "192.168.1.254",
    dns: "8.8.8.8",
    ntpServer: "pool.ntp.org",
    rtmpUrl: "",
    rtmpKey: "",
    rtspSec: "off",
    rtspAudio: "off",
    hlsUrl: "",
    srtIp: "",
    srtPort: "8889",
    srtEnc: "None",
    srtLatency: "1000",
    srtPass: "",
    https: "off",
    sshd: "off",
    viscaMode: "Default",
    viscaPort: "52381"
  });
  const updNet = (k2, v2) => setNet((p2) => ({ ...p2, [k2]: v2 }));
  const [trk, setTrk] = reactExports.useState({
    tab: "face",
    sensitivity: 2,
    returnTime: 3,
    presetPoint: "1",
    peopleSize: "Upper Body",
    placement: "Center",
    height: "Height1",
    effectiveArea: false,
    autoZoom: true,
    autoTilt: true,
    autoZoomPreset: "Preset 1",
    multiPresenterTracking: false,
    multiPresenter: "off",
    shieldZone: false,
    zoneId: "Zone 1",
    zoneResponse: "Auto",
    zoneTransition: 5,
    zoneEnabled: true,
    zoneTrackingPoint: "Preset 6",
    hybridPriority: "Presenter",
    hybridFallback: "Zone 1",
    hybridHoldTime: 5,
    framingMode: "Auto Framing",
    framingSize: "Medium",
    framingSpeed: 5,
    groupFraming: true,
    gestureEnabled: false,
    gestureTimeout: 5,
    gestureFeedback: true,
    faceEnrollment: false,
    faceSelection: "Auto",
    faceAction: "Track selected face",
    faceCaptureState: "idle",
    faceBatchResult: null,
    enrolledFaces: []
  });
  const updTrk = (k2, v2) => setTrk((p2) => ({ ...p2, [k2]: v2 }));
  const [draggedFaceId, setDraggedFaceId] = reactExports.useState(null);
  const [faceDragOverlay, setFaceDragOverlay] = reactExports.useState(null);
  const [faceDeleteTarget, setFaceDeleteTarget] = reactExports.useState(null);
  const [editingFaceId, setEditingFaceId] = reactExports.useState(null);
  const [editingFaceName, setEditingFaceName] = reactExports.useState("");
  const [faceEnrollmentTourOpen, setFaceEnrollmentTourOpen] = reactExports.useState(false);
  const [faceSelectFlow, setFaceSelectFlow] = reactExports.useState({ stage: "ready", candidateId: null });
  const [faceSelectCoachmarkVisible, setFaceSelectCoachmarkVisible] = reactExports.useState(false);
  const [faceSelectCoachmarkDismissed, setFaceSelectCoachmarkDismissed] = reactExports.useState(false);
  const [hoveredFaceCandidateId, setHoveredFaceCandidateId] = reactExports.useState(null);
  const faceEnrollTimerRef = reactExports.useRef(null);
  const faceSelectTimersRef = reactExports.useRef([]);
  const faceDraggingIdRef = reactExports.useRef(null);
  const faceDragOverRef = reactExports.useRef(null);
  const facePointerDragRef = reactExports.useRef(null);
  const faceCardPositionsRef = reactExports.useRef(/* @__PURE__ */ new Map());
  const captureFaceCardPositions = () => {
    const positions = /* @__PURE__ */ new Map();
    document.querySelectorAll("[data-face-id]").forEach((card) => {
      positions.set(card.getAttribute("data-face-id"), card.getBoundingClientRect());
    });
    faceCardPositionsRef.current = positions;
  };
  const resequenceFaces = (faces) => faces.map((face, index) => ({ ...face, priority: index + 1 }));
  const reorderEnrolledFaces = (sourceId, targetId) => {
    captureFaceCardPositions();
    setTrk((p2) => {
      const fromIndex = p2.enrolledFaces.findIndex((face) => face.id === sourceId);
      const targetIndex = p2.enrolledFaces.findIndex((face) => face.id === targetId);
      if (fromIndex < 0 || targetIndex < 0 || fromIndex === targetIndex) return p2;
      const nextFaces = [...p2.enrolledFaces];
      const [movingFace] = nextFaces.splice(fromIndex, 1);
      nextFaces.splice(targetIndex, 0, movingFace);
      return { ...p2, enrolledFaces: resequenceFaces(nextFaces) };
    });
  };
  const setEnrolledFacePriority = (faceId, priority) => {
    captureFaceCardPositions();
    setTrk((current) => {
      const fromIndex = current.enrolledFaces.findIndex((face) => face.id === faceId);
      const targetIndex = Math.max(0, Math.min(current.enrolledFaces.length - 1, priority - 1));
      if (fromIndex < 0 || fromIndex === targetIndex) return current;
      const nextFaces = [...current.enrolledFaces];
      const [movingFace] = nextFaces.splice(fromIndex, 1);
      nextFaces.splice(targetIndex, 0, movingFace);
      return { ...current, enrolledFaces: resequenceFaces(nextFaces) };
    });
  };
  const finishFaceDrag = () => {
    faceDraggingIdRef.current = null;
    setDraggedFaceId(null);
    faceDragOverRef.current = null;
  };
  const startFacePointerDrag = (event, faceId) => {
    var _a2, _b;
    if (event.button !== 0 || event.target.closest("button, input")) return;
    const cardRect = event.currentTarget.getBoundingClientRect();
    facePointerDragRef.current = {
      faceId,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: event.clientX - cardRect.left,
      offsetY: event.clientY - cardRect.top,
      active: false
    };
    (_b = (_a2 = event.currentTarget).setPointerCapture) == null ? void 0 : _b.call(_a2, event.pointerId);
  };
  const moveFacePointerDrag = (event) => {
    var _a2;
    const pointerDrag = facePointerDragRef.current;
    if (!pointerDrag) return;
    const distance = Math.hypot(event.clientX - pointerDrag.startX, event.clientY - pointerDrag.startY);
    if (!pointerDrag.active && distance < 6) return;
    if (!pointerDrag.active) {
      pointerDrag.active = true;
      faceDraggingIdRef.current = pointerDrag.faceId;
      setDraggedFaceId(pointerDrag.faceId);
    }
    event.preventDefault();
    setFaceDragOverlay({
      faceId: pointerDrag.faceId,
      x: event.clientX - pointerDrag.offsetX,
      y: event.clientY - pointerDrag.offsetY
    });
    const targetCard = (_a2 = document.elementFromPoint(event.clientX, event.clientY)) == null ? void 0 : _a2.closest("[data-face-id]");
    const targetId = targetCard ? Number(targetCard.getAttribute("data-face-id")) : null;
    if (targetId == null || targetId === pointerDrag.faceId || faceDragOverRef.current === targetId) return;
    faceDragOverRef.current = targetId;
    reorderEnrolledFaces(pointerDrag.faceId, targetId);
  };
  const finishFacePointerDrag = (event) => {
    var _a2;
    if ((_a2 = facePointerDragRef.current) == null ? void 0 : _a2.active) event.preventDefault();
    facePointerDragRef.current = null;
    setFaceDragOverlay(null);
    finishFaceDrag();
  };
  const startInlineFaceNameEdit = (face) => {
    setEditingFaceId(face.id);
    setEditingFaceName(face.name || "");
  };
  const finishInlineFaceNameEdit = (save = true) => {
    if (editingFaceId == null) return;
    if (save) {
      setTrk((p2) => ({
        ...p2,
        enrolledFaces: p2.enrolledFaces.map((face) => face.id === editingFaceId ? { ...face, name: editingFaceName.trim() } : face)
      }));
    }
    setEditingFaceId(null);
    setEditingFaceName("");
  };
  const confirmFaceDelete = () => {
    if (!faceDeleteTarget) return;
    captureFaceCardPositions();
    setTrk((p2) => ({ ...p2, enrolledFaces: resequenceFaces(p2.enrolledFaces.filter((face) => face.id !== faceDeleteTarget.id)) }));
    if (editingFaceId === faceDeleteTarget.id) {
      setEditingFaceId(null);
      setEditingFaceName("");
    }
    setFaceDeleteTarget(null);
  };
  reactExports.useLayoutEffect(() => {
    const nextPositions = /* @__PURE__ */ new Map();
    document.querySelectorAll("[data-face-id]").forEach((card) => {
      var _a2;
      const faceId = card.getAttribute("data-face-id");
      const nextRect = card.getBoundingClientRect();
      nextPositions.set(faceId, nextRect);
      const previousRect = faceCardPositionsRef.current.get(faceId);
      if (!previousRect || String(draggedFaceId) === faceId) return;
      const deltaX = previousRect.left - nextRect.left;
      const deltaY = previousRect.top - nextRect.top;
      if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;
      (_a2 = card.animate) == null ? void 0 : _a2.call(
        card,
        [
          { transform: `translate(${deltaX}px, ${deltaY}px)` },
          { transform: "translate(0, 0)" }
        ],
        { duration: 240, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
      );
    });
    faceCardPositionsRef.current = nextPositions;
  }, [trk.enrolledFaces, draggedFaceId]);
  const startFaceBatchEnrollment = () => {
    if (trk.faceCaptureState === "loading" || faceSelectFlow.stage !== "ready") return;
    setFaceSelectCoachmarkVisible(false);
    clearFaceSelectTimers();
    setFaceSelectFlow({ stage: "ready", candidateId: null });
    if (faceEnrollTimerRef.current) clearTimeout(faceEnrollTimerRef.current);
    setTrk((p2) => ({ ...p2, faceCaptureState: "loading", faceBatchResult: null }));
    faceEnrollTimerRef.current = setTimeout(() => {
      setFaceSelectCoachmarkDismissed(false);
      const eligibleFaces = FACE_ENROLLMENT_CANDIDATES.filter((candidate) => candidate.status === "eligible");
      setTrk((p2) => {
        return {
          ...p2,
          faceCaptureState: "complete",
          faceBatchResult: {
            detected: FACE_ENROLLMENT_CANDIDATES.length,
            enrolled: 0,
            rejected: FACE_ENROLLMENT_CANDIDATES.length - eligibleFaces.length,
            capacitySkipped: 0,
            addedCandidateIds: []
          }
        };
      });
      flash(`偵測完成：${eligibleFaces.length} 張可加入`);
      faceEnrollTimerRef.current = null;
    }, 1e3);
  };
  const addAllEligibleFaces = () => {
    var _a2;
    if (trk.faceCaptureState !== "complete" || faceSelectFlow.stage !== "ready" || trk.enrolledFaces.length >= 20) return;
    const alreadyAddedIds = new Set(((_a2 = trk.faceBatchResult) == null ? void 0 : _a2.addedCandidateIds) ?? []);
    const eligibleFaces = FACE_ENROLLMENT_CANDIDATES.filter((candidate) => candidate.status === "eligible" && !alreadyAddedIds.has(candidate.id));
    const availableSlots = Math.max(0, 20 - trk.enrolledFaces.length);
    const addedCount = Math.min(eligibleFaces.length, availableSlots);
    if (addedCount === 0) return;
    setFaceSelectCoachmarkVisible(false);
    setFaceSelectCoachmarkDismissed(true);
    setTrk((p2) => {
      var _a3, _b;
      const existingAddedIds = new Set(((_a3 = p2.faceBatchResult) == null ? void 0 : _a3.addedCandidateIds) ?? []);
      const remainingCandidates = FACE_ENROLLMENT_CANDIDATES.filter((candidate) => candidate.status === "eligible" && !existingAddedIds.has(candidate.id));
      const slots = Math.max(0, 20 - p2.enrolledFaces.length);
      const addedCandidates = remainingCandidates.slice(0, slots);
      const batchId = Date.now();
      const newFaces = addedCandidates.map((candidate, index) => ({
        id: batchId + index,
        name: "",
        priority: p2.enrolledFaces.length + index + 1,
        candidateId: candidate.id
      }));
      return {
        ...p2,
        enrolledFaces: [...p2.enrolledFaces, ...newFaces],
        faceBatchResult: {
          ...p2.faceBatchResult ?? {},
          enrolled: (((_b = p2.faceBatchResult) == null ? void 0 : _b.enrolled) ?? 0) + newFaces.length,
          capacitySkipped: Math.max(0, remainingCandidates.length - newFaces.length),
          addedCandidateIds: [...existingAddedIds, ...addedCandidates.map((candidate) => candidate.id)]
        }
      };
    });
    flash(`已新增 ${addedCount} 張人臉`);
  };
  const resumeFaceEnrollmentLiveView = () => {
    if (faceSelectFlow.stage !== "ready") return;
    setFaceSelectCoachmarkVisible(false);
    setFaceSelectCoachmarkDismissed(false);
    setHoveredFaceCandidateId(null);
    setTrk((p2) => ({ ...p2, faceCaptureState: "idle", faceBatchResult: null }));
  };
  const clearFaceSelectTimers = () => {
    faceSelectTimersRef.current.forEach((timer) => clearTimeout(timer));
    faceSelectTimersRef.current = [];
  };
  reactExports.useEffect(() => {
    const shouldShow = trk.faceCaptureState === "complete" && faceSelectFlow.stage === "ready" && !faceSelectCoachmarkDismissed && trk.enrolledFaces.length < 20;
    if (!shouldShow) {
      setFaceSelectCoachmarkVisible(false);
      return void 0;
    }
    setFaceSelectCoachmarkVisible(true);
    const coachmarkTimer = setTimeout(() => setFaceSelectCoachmarkVisible(false), 5200);
    return () => clearTimeout(coachmarkTimer);
  }, [trk.faceCaptureState, faceSelectFlow.stage, faceSelectCoachmarkDismissed, trk.enrolledFaces.length]);
  reactExports.useEffect(() => () => {
    if (faceEnrollTimerRef.current) clearTimeout(faceEnrollTimerRef.current);
    clearFaceSelectTimers();
  }, []);
  const [ndi, setNdi] = reactExports.useState({
    mode: "builtin",
    bandwidth: "ndihx3",
    streamOut: "1920x1080",
    framerate: "60",
    encoding: "h264",
    deviceName: "AVer",
    deviceChannel: "TR315-11c96d",
    receiveGroup: "Public",
    reliableUdp: false,
    discoveryServer: false,
    discoveryAddr: "192.168.1.10",
    multicastServer: false,
    multicastMask: "255.255.255.0",
    multicastAddr: "239.255.0.0",
    multicastTtl: "10",
    ndiBridge: false,
    bridgeIp: "192.168.1.11",
    bridgeName: "NdiBridge",
    bridgePort: "5990",
    bridgeKey: ""
  });
  const updNdi = (k2, v2) => setNdi((p2) => ({ ...p2, [k2]: v2 }));
  const [sys, setSys] = reactExports.useState({
    loginName: "1",
    loginPwd: "password",
    language: "English",
    syslog: "off",
    syslogIp: "",
    syslogPort: "",
    statusOsd: "off",
    statusLiveView: "off",
    powerUpPreset: false,
    powerUpVal: "0",
    powerOffPreset: false,
    powerOffVal: "0",
    powerOffComplete: "off",
    sleepPreset: "Preset 20",
    sleepTimer: "10sec",
    sleepAutoTrack: true,
    helpImprove: "Disable",
    ledBrightness: 10,
    cameraSelector: "1"
  });
  const updSys = (k2, v2) => setSys((p2) => ({ ...p2, [k2]: v2 }));
  const [toast, setToast] = reactExports.useState("");
  const [imgLoaded, setImgLoaded] = reactExports.useState(false);
  const [deletingScene, setDeletingScene] = reactExports.useState(null);
  const [activeMenu, setActiveMenu] = reactExports.useState("tracking");
  const [versionMenuOpen, setVersionMenuOpen] = reactExports.useState(false);
  const [gridDebug, setGridDebug] = reactExports.useState("off");
  const [paintLayout, setPaintLayout] = reactExports.useState("classic");
  const [cam, setCam] = reactExports.useState(CAM_DEFAULTS);
  const updCam = (k2, v2) => setCam((c) => ({ ...c, [k2]: v2 }));
  const [live, setLive] = reactExports.useState({
    tab: "control",
    focusMode: "af",
    panSpeed: 7,
    tiltSpeed: 7,
    zoomSpeed: "high",
    focusNear: "1.5m",
    afMode: "Continuous AF",
    digitalZoom: false,
    digitalZoomLimit: 12,
    relativeZoom: false,
    presetAffects: false,
    presetSaveNumber: "0",
    presetVideoFreeze: false,
    presetAccuracy: true,
    presetSpeed: 50,
    selectedQuickCall: null,
    appliedPresetId: 0,
    presetNames: Array.from({ length: 20 }, (_, index) => `Preset${index}`),
    savedPresetIds: [0, 1],
    activePreviewImage: "meeting_room.png",
    presetSnapshots: {
      0: { image: "meeting_room.png", pan: 0, tilt: 0, zoom: 1 },
      1: { image: FACE_ENROLLMENT_DEMO_IMAGE, pan: 0, tilt: 0, zoom: 1 }
    }
  });
  const updLive = (k2, v2) => setLive((c) => ({ ...c, [k2]: v2 }));
  const [editingLivePresetId, setEditingLivePresetId] = reactExports.useState(null);
  const [livePresetNameDraft, setLivePresetNameDraft] = reactExports.useState("");
  const [resetLivePresetTarget, setResetLivePresetTarget] = reactExports.useState(null);
  const livePresetCardRefs = reactExports.useRef([]);
  const beginLivePresetRename = (presetId) => {
    setEditingLivePresetId(presetId);
    setLivePresetNameDraft(live.presetNames[presetId]);
  };
  const commitLivePresetRename = () => {
    if (editingLivePresetId == null) return;
    const nextName = livePresetNameDraft.trim() || `Preset${editingLivePresetId}`;
    setLive((current) => ({
      ...current,
      presetNames: current.presetNames.map((name, index) => index === editingLivePresetId ? nextName : name)
    }));
    setEditingLivePresetId(null);
    setLivePresetNameDraft("");
  };
  const saveLivePreset = () => {
    const presetId = Number.parseInt(live.presetSaveNumber, 10);
    if (!Number.isInteger(presetId) || presetId < 0 || presetId > 19) {
      flash("Use preset 0–19");
      return;
    }
    const isOverwrite = Boolean(live.presetSnapshots[presetId]);
    setLive((current) => ({
      ...current,
      savedPresetIds: current.savedPresetIds.includes(presetId) ? current.savedPresetIds : [...current.savedPresetIds, presetId].sort((a, b) => a - b),
      presetSnapshots: {
        ...current.presetSnapshots,
        [presetId]: {
          image: current.activePreviewImage,
          pan: ptz.pan,
          tilt: ptz.tilt,
          zoom: ptz.zoom
        }
      },
      selectedQuickCall: presetId,
      appliedPresetId: presetId
    }));
    window.requestAnimationFrame(() => {
      var _a2;
      (_a2 = livePresetCardRefs.current[presetId]) == null ? void 0 : _a2.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest"
      });
    });
    flash(`Preset ${presetId} ${isOverwrite ? "updated" : "saved"}`);
  };
  const [ptz, setPtz] = reactExports.useState({ pan: 0, tilt: 0, zoom: 1 });
  const handlePtz = (action) => {
    setPtz((p2) => {
      let nextZoom = p2.zoom || 1;
      if (action === "zoom_in") nextZoom = Math.min(nextZoom + 0.2, 3);
      if (action === "zoom_out") nextZoom = Math.max(nextZoom - 0.2, 1);
      if (action === "home") nextZoom = 1;
      const S2 = nextZoom;
      const maxPanPercent = (S2 - 1) / 2 * 100;
      const maxTiltPercent = (S2 - 1) / 2 * 100;
      let nextPan = p2.pan || 0;
      let nextTilt = p2.tilt || 0;
      const panSpeed = live && live.panSpeed !== void 0 ? live.panSpeed : 7;
      const tiltSpeed = live && live.tiltSpeed !== void 0 ? live.tiltSpeed : 7;
      const panStep = panSpeed / 7 * (4.5 / nextZoom);
      const tiltStep = tiltSpeed / 7 * (4.5 / nextZoom);
      if (nextZoom > 1) {
        if (action === "up") nextTilt = nextTilt + tiltStep;
        if (action === "down") nextTilt = nextTilt - tiltStep;
        if (action === "left") nextPan = nextPan + panStep;
        if (action === "right") nextPan = nextPan - panStep;
      }
      if (action === "home") {
        nextPan = 0;
        nextTilt = 0;
      }
      nextPan = Math.max(Math.min(nextPan, maxPanPercent), -maxPanPercent);
      nextTilt = Math.max(Math.min(nextTilt, maxTiltPercent), -maxTiltPercent);
      if (isNaN(nextPan)) nextPan = 0;
      if (isNaN(nextTilt)) nextTilt = 0;
      if (isNaN(nextZoom)) nextZoom = 1;
      return { pan: nextPan, tilt: nextTilt, zoom: nextZoom };
    });
  };
  const loadLivePreset = (presetId) => {
    const snapshot = live.presetSnapshots[presetId];
    if (!snapshot) return;
    setLive((current) => ({
      ...current,
      selectedQuickCall: presetId,
      appliedPresetId: presetId,
      presetSaveNumber: String(presetId),
      activePreviewImage: snapshot.image
    }));
    setPtz({ pan: snapshot.pan, tilt: snapshot.tilt, zoom: snapshot.zoom });
    flash(`${live.presetNames[presetId]} applied`);
  };
  const openResetLivePresetDialog = () => {
    const presetId = live.selectedQuickCall;
    if (presetId == null || !live.presetSnapshots[presetId]) return;
    setResetLivePresetTarget({ id: presetId, name: live.presetNames[presetId] });
  };
  const confirmResetLivePreset = () => {
    if (!resetLivePresetTarget) return;
    const presetId = resetLivePresetTarget.id;
    const presetName = resetLivePresetTarget.name;
    setLive((current) => {
      const nextSnapshots = { ...current.presetSnapshots };
      delete nextSnapshots[presetId];
      return {
        ...current,
        selectedQuickCall: null,
        appliedPresetId: current.appliedPresetId === presetId ? null : current.appliedPresetId,
        savedPresetIds: current.savedPresetIds.filter((id2) => id2 !== presetId),
        presetNames: current.presetNames.map((name, index) => index === presetId ? `Preset${presetId}` : name),
        presetSnapshots: nextSnapshots
      };
    });
    setEditingLivePresetId(null);
    setLivePresetNameDraft("");
    setResetLivePresetTarget(null);
    flash(`${presetName} reset`);
  };
  const [trackOn, setTrackOn] = reactExports.useState(true);
  const [trackMode, setTrackMode] = reactExports.useState("hybrid");
  const [trkFace, setTrkFace] = reactExports.useState(false);
  const [isFocused, setIsFocused] = reactExports.useState(false);
  const [multiStyle, setMultiStyle] = reactExports.useState("wheel2");
  const [matrixViz, setMatrixViz] = reactExports.useState("ring");
  const [showOnboarding, setShowOnboarding] = reactExports.useState(false);
  const [onbStep, setOnbStep] = reactExports.useState(0);
  const [onbClosing, setOnbClosing] = reactExports.useState(false);
  reactExports.useRef(false);
  reactExports.useEffect(() => {
  }, [activeMenu]);
  reactExports.useEffect(() => {
    setSelAxis(null);
    setIsFocused(false);
  }, [block]);
  const [draftHue, setDraftHue] = reactExports.useState(0);
  const [draftSat, setDraftSat] = reactExports.useState(0);
  const [focusClosing, setFocusClosing] = reactExports.useState(false);
  const enterFocus = (a) => {
    setSelAxis(a);
    setDraftHue(st.axes[a].hue);
    setDraftSat(st.axes[a].sat);
    setFocusClosing(false);
    setIsFocused(true);
  };
  const closeFocus = () => {
    setFocusClosing(true);
    setTimeout(() => {
      setIsFocused(false);
      setFocusClosing(false);
    }, 380);
  };
  const confirmFocus = () => {
    updAxis(selAxis, "hue", draftHue);
    updAxis(selAxis, "sat", draftSat);
    closeFocus();
  };
  const ringRef = reactExports.useRef(null);
  const ringDragRef = reactExports.useRef(false);
  const ringPointerMove = (e) => {
    if (!ringDragRef.current || !ringRef.current) return;
    const rect = ringRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx, dy = e.clientY - cy;
    const fHue = (Math.atan2(dy, dx) * 180 / Math.PI + 90 + 360) % 360;
    const base = ((AXIS16.indexOf(selAxis) - AXIS16.indexOf("R")) * 60 + 360) % 360;
    let off = (fHue - base + 540) % 360 - 180;
    off = Math.max(-30, Math.min(30, off));
    setDraftHue(Math.round(off / 30 * 99));
    const radius = Math.hypot(dx, dy) * (290 / rect.width);
    setDraftSat(Math.max(-99, Math.min(99, Math.round((radius - 119.75) / 25.25 * 99))));
  };
  const [videoSettings, setVideoSettings] = reactExports.useState({
    powerFreq: "59.94Hz",
    videoOutRes: "1080μP/59",
    themeMode: "Standard",
    streamRes: "1920x1080",
    streamBitrate: "Auto",
    streamEncode: "H.264",
    streamFps: "60",
    streamI_Vop: 10,
    streamGop: 30,
    streamCompat: "Off",
    streamRateCtrl: "VBR",
    audioInputType: "Line In",
    audioVolume: 5,
    usbAudioEnable: "Enable",
    audioEncode: "AAC",
    audioSampleRate: "48K"
  });
  const updVideo = reactExports.useCallback((k2, v2) => {
    setVideoSettings((s) => ({ ...s, [k2]: v2 }));
  }, []);
  const preRef = reactExports.useRef(null);
  const scRef = reactExports.useRef(null);
  const baseRef = reactExports.useRef(null);
  const baseDragRef = reactExports.useRef(null);
  const baseCanvasRef = reactExports.useRef(null);
  const barsRef = reactExports.useRef(null);
  const barsDragRef = reactExports.useRef(null);
  const liveThumbRef = reactExports.useRef(null);
  const baseCanvasDragRef = reactExports.useRef(null);
  const averWheelRingCanvasRef = reactExports.useRef(null);
  const [wheelScale, setWheelScale] = reactExports.useState(0.83);
  reactExports.useEffect(() => {
    const shell = document.getElementById("aver-wheel-layout-shell");
    if (!shell) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { height } = entry.contentRect;
        const calculatedScale = height / 298;
        setWheelScale(Math.max(0.86, Math.min(1, calculatedScale)));
      }
    });
    observer.observe(shell);
    return () => observer.disconnect();
  }, [block, multiStyle]);
  reactExports.useEffect(() => {
    if (multiStyle !== "wheel" && multiStyle !== "wheel2") return;
    const canvas = averWheelRingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 290, 290);
    const center = 145;
    const rIn = 77;
    const rOut = 145;
    const ANG_UI = { R: 0, YL: 60, G: 120, CY: 180, B: 240, MG: 300 };
    for (let angle = 0; angle < 360; angle++) {
      const angleRad = (angle - 90) * Math.PI / 180;
      let hue = angle;
      let sIn = 12;
      let lIn = 12;
      let sOut = 100;
      let lOut = 58;
      if (isFocused && selAxis) {
        const baseAng = ANG_UI[selAxis];
        let diff = (angle - baseAng + 180) % 360 - 180;
        if (diff < -180) diff += 360;
        const absDiff = Math.abs(diff);
        if (absDiff <= 30) {
          const offsetHue = draftHue / 99 * 30;
          hue = (angle + offsetHue + 360) % 360;
          const currentSat = Math.max(8, Math.min(100, 100 + draftSat / 99 * 50));
          sOut = currentSat;
          sIn = Math.min(12, currentSat * 0.12);
          lOut = 58;
          lIn = 12;
        } else {
          const fHueSrc = draftHue;
          const fHueVal = (ANG_UI[selAxis] + fHueSrc / 99 * 30 + 360) % 360;
          hue = fHueVal;
          sOut = 15;
          sIn = 6;
          lOut = 28;
          lIn = 12;
        }
      }
      const angleNextRad = (angle + 1.2 - 90) * Math.PI / 180;
      const x1 = center + Math.cos(angleRad) * rIn;
      const y1 = center + Math.sin(angleRad) * rIn;
      const x2 = center + Math.cos(angleRad) * rOut;
      const y2 = center + Math.sin(angleRad) * rOut;
      const x3 = center + Math.cos(angleNextRad) * rOut;
      const y3 = center + Math.sin(angleNextRad) * rOut;
      const x4 = center + Math.cos(angleNextRad) * rIn;
      const y4 = center + Math.sin(angleNextRad) * rIn;
      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, `hsl(${hue}, ${sIn}%, ${lIn}%)`);
      grad.addColorStop(1, `hsl(${hue}, ${sOut}%, ${lOut}%)`);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.lineTo(x4, y4);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }, [multiStyle, isFocused, selAxis, draftHue, draftSat, st, block, activeMenu, paintLayout]);
  const tempDragCanvasRef = reactExports.useRef(null);
  const [isDragging, setIsDragging] = reactExports.useState(false);
  const startDrag = reactExports.useCallback(() => setIsDragging(true), []);
  const endDrag = reactExports.useCallback(() => setIsDragging(false), []);
  const upd = reactExports.useCallback((k2, v2) => {
    setSt((s) => ({ ...s, [k2]: v2 }));
  }, []);
  const updAxis = (axis, key, v2) => {
    setSt((s) => ({ ...s, axes: { ...s.axes, [axis]: { ...s.axes[axis], [key]: v2 } } }));
  };
  const flash = (m2) => {
    setToast(m2);
    setTimeout(() => setToast(""), 2800);
  };
  reactExports.useEffect(() => {
    const img = new Image();
    img.onerror = () => {
      console.warn("外部背景圖未尋獲，改用預設的高畫質訪談直播間 Canvas 模擬畫面。");
      const cv = document.createElement("canvas");
      cv.width = SW;
      cv.height = SH;
      const ctx = cv.getContext("2d");
      drawFallbackScene(ctx);
      baseRef.current = ctx.getImageData(0, 0, SW, SH);
      baseCanvasRef.current = cv;
      const cvDrag = document.createElement("canvas");
      cvDrag.width = 320;
      cvDrag.height = 180;
      const ctxDrag = cvDrag.getContext("2d");
      ctxDrag.drawImage(cv, 0, 0, SW, SH, 0, 0, 320, 180);
      baseDragRef.current = ctxDrag.getImageData(0, 0, 320, 180);
      baseCanvasDragRef.current = cvDrag;
      setStdThumb(cv.toDataURL("image/jpeg", 0.55));
      setImgLoaded(true);
    };
    img.onload = () => {
      const cv = document.createElement("canvas");
      cv.width = SW;
      cv.height = SH;
      const ctx = cv.getContext("2d");
      const imgRatio = img.width / img.height;
      const cvRatio = SW / SH;
      let sx = 0, sy = 0, sw = img.width, sh2 = img.height;
      if (imgRatio > cvRatio) {
        sw = img.height * cvRatio;
        sx = (img.width - sw) / 2;
      } else {
        sh2 = img.width / cvRatio;
        sy = (img.height - sh2) / 2;
      }
      ctx.drawImage(img, sx, sy, sw, sh2, 0, 0, SW, SH);
      baseRef.current = ctx.getImageData(0, 0, SW, SH);
      baseCanvasRef.current = cv;
      const cvDrag = document.createElement("canvas");
      cvDrag.width = 320;
      cvDrag.height = 180;
      const ctxDrag = cvDrag.getContext("2d");
      ctxDrag.drawImage(cv, 0, 0, SW, SH, 0, 0, 320, 180);
      baseDragRef.current = ctxDrag.getImageData(0, 0, 320, 180);
      baseCanvasDragRef.current = cvDrag;
      setStdThumb(cv.toDataURL("image/jpeg", 0.55));
      setImgLoaded(true);
    };
    img.src = "meeting_room.png?t=" + Date.now();
  }, []);
  reactExports.useEffect(() => {
    const make = (w2, h) => {
      const c = document.createElement("canvas");
      c.width = w2;
      c.height = h;
      const x2 = c.getContext("2d");
      const cols = [[191, 191, 191], [191, 191, 0], [0, 191, 191], [0, 191, 0], [191, 0, 191], [191, 0, 0], [0, 0, 191]];
      const bw = w2 / cols.length;
      cols.forEach((col, i) => {
        x2.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`;
        x2.fillRect(Math.floor(i * bw), 0, Math.ceil(bw) + 1, h);
      });
      return x2.getImageData(0, 0, w2, h);
    };
    barsRef.current = make(SW, SH);
    barsDragRef.current = make(320, 180);
  }, []);
  reactExports.useEffect(() => {
    const cvs = preRef.current;
    if (!cvs) return;
    const useDrag = isDragging && (colorBars ? barsDragRef.current : baseDragRef.current);
    const currentW = useDrag ? 320 : SW;
    const currentH = useDrag ? 180 : SH;
    const base = colorBars ? useDrag ? barsDragRef.current : barsRef.current : useDrag ? baseDragRef.current : baseRef.current;
    if (!base) return;
    const activeSt = bypass ? getActiveSceneData() : st;
    const ctx = cvs.getContext("2d");
    const sd2 = base.data;
    let work = new Uint8ClampedArray(sd2.length);
    const master = (activeSt.masterBlack ?? 0) / 50 * 0.12;
    const rOffset = (activeSt.rBlack ?? 0) / 50 * 0.12;
    const bOffset = (activeSt.bBlack ?? 0) / 50 * 0.12;
    const bl_r = master + rOffset;
    const bl_g = master;
    const bl_b = master + bOffset;
    let kp, slope;
    if (activeSt.autoKnee) {
      kp = 85 / 109;
      slope = 0.35;
    } else {
      kp = activeSt.kneePoint / 109;
      slope = 0.5 + (activeSt.kneeSlope + 5) / 20;
    }
    const levelOn = activeSt.level !== 0;
    const sat = 1 + activeSt.level / 120;
    const phaseOn = activeSt.phase !== 0;
    let m00 = 0, m01 = 0, m02 = 0;
    let m10 = 0, m11 = 0, m12 = 0;
    let m20 = 0, m21 = 0, m22 = 0;
    if (phaseOn) {
      const deg = activeSt.phase / 99 * 30;
      const a = deg * Math.PI / 180;
      const cosVal = Math.cos(a);
      const sinVal = Math.sin(a);
      m00 = 0.213 + cosVal * 0.787 - sinVal * 0.213;
      m01 = 0.715 - cosVal * 0.715 - sinVal * 0.715;
      m02 = 0.072 - cosVal * 0.072 + sinVal * 0.928;
      m10 = 0.213 - cosVal * 0.213 + sinVal * 0.143;
      m11 = 0.715 + cosVal * 0.285 + sinVal * 0.14;
      m12 = 0.072 - cosVal * 0.072 - sinVal * 0.283;
      m20 = 0.213 - cosVal * 0.213 - sinVal * 0.787;
      m21 = 0.715 - cosVal * 0.715 + sinVal * 0.715;
      m22 = 0.072 + cosVal * 0.928 + sinVal * 0.072;
    }
    const kMix = 0.75;
    const m_rg = activeSt.rg / 100 * kMix;
    const m_rb = activeSt.rb / 100 * kMix;
    const m_gr = activeSt.gr / 100 * kMix;
    const m_gb = activeSt.gb / 100 * kMix;
    const m_br = activeSt.br / 100 * kMix;
    const m_bg = activeSt.bg / 100 * kMix;
    const activeAxes = [];
    AXIS16.forEach((a) => {
      const isCurrentAxis = !bypass && isFocused && selAxis === a;
      const hueVal = isCurrentAxis ? draftHue : activeSt.axes[a] ? activeSt.axes[a].hue : 0;
      const satVal = isCurrentAxis ? draftSat : activeSt.axes[a] ? activeSt.axes[a].sat : 0;
      if (hueVal !== 0 || satVal !== 0) {
        activeAxes.push({
          name: a,
          hueAngle: AXIS_HUE[a],
          hueAdj: hueVal / 99 * 22,
          satAdj: satVal / 99 * 0.85
        });
      }
    });
    for (let i = 0; i < sd2.length; i += 4) {
      let R2 = sd2[i] / 255;
      let G2 = sd2[i + 1] / 255;
      let B2 = sd2[i + 2] / 255;
      R2 = R2 + bl_r * (1 - R2);
      G2 = G2 + bl_g * (1 - G2);
      B2 = B2 + bl_b * (1 - B2);
      {
        if (R2 > kp) R2 = kp + (R2 - kp) * slope;
        if (G2 > kp) G2 = kp + (G2 - kp) * slope;
        if (B2 > kp) B2 = kp + (B2 - kp) * slope;
      }
      {
        if (phaseOn) {
          const rotR = R2 * m00 + G2 * m01 + B2 * m02;
          const rotG = R2 * m10 + G2 * m11 + B2 * m12;
          const rotB = R2 * m20 + G2 * m21 + B2 * m22;
          R2 = rotR;
          G2 = rotG;
          B2 = rotB;
        }
        const nR = R2 + m_rg * (R2 - G2) + m_rb * (R2 - B2);
        const nG = G2 + m_gr * (G2 - R2) + m_gb * (G2 - B2);
        const nB = B2 + m_br * (B2 - R2) + m_bg * (B2 - G2);
        R2 = nR;
        G2 = nG;
        B2 = nB;
        if (levelOn) {
          const Y2 = 0.2126 * R2 + 0.7152 * G2 + 0.0722 * B2;
          R2 = Y2 + (R2 - Y2) * sat;
          G2 = Y2 + (G2 - Y2) * sat;
          B2 = Y2 + (B2 - Y2) * sat;
        }
      }
      if (activeAxes.length > 0) {
        const mx = Math.max(R2, G2, B2), mn = Math.min(R2, G2, B2), d = mx - mn;
        let h = 0;
        if (d > 0) {
          if (mx === R2) h = (G2 - B2) / d % 6;
          else if (mx === G2) h = (B2 - R2) / d + 2;
          else h = (R2 - G2) / d + 4;
          h *= 60;
          if (h < 0) h += 360;
        }
        const sVal = mx === 0 ? 0 : d / mx;
        const vVal = mx;
        if (sVal >= 0.05) {
          let bestAx = null;
          let bd2 = 999;
          for (let j = 0; j < activeAxes.length; j++) {
            const axObj = activeAxes[j];
            const dist = Math.abs((axObj.hueAngle - h + 540) % 360 - 180);
            if (dist < bd2) {
              bd2 = dist;
              bestAx = axObj;
            }
          }
          if (bestAx && bd2 < 30) {
            const w2 = 1 - bd2 / 30;
            let newH = h + bestAx.hueAdj * w2;
            let newS = sVal * (1 + bestAx.satAdj * w2);
            if (newS > 1) newS = 1;
            newH = (newH % 360 + 360) % 360;
            const c_val = vVal * newS;
            const x_val = c_val * (1 - Math.abs(newH / 60 % 2 - 1));
            const m_val = vVal - c_val;
            let r_val = 0, g_val = 0, b_val = 0;
            if (newH < 60) {
              r_val = c_val;
              g_val = x_val;
            } else if (newH < 120) {
              r_val = x_val;
              g_val = c_val;
            } else if (newH < 180) {
              g_val = c_val;
              b_val = x_val;
            } else if (newH < 240) {
              g_val = x_val;
              b_val = c_val;
            } else if (newH < 300) {
              r_val = x_val;
              b_val = c_val;
            } else {
              r_val = c_val;
              b_val = x_val;
            }
            R2 = r_val + m_val;
            G2 = g_val + m_val;
            B2 = b_val + m_val;
          }
        }
      }
      work[i] = c255(R2 * 255);
      work[i + 1] = c255(G2 * 255);
      work[i + 2] = c255(B2 * 255);
      work[i + 3] = 255;
    }
    if (activeSt.detail !== 0) {
      work = applyDetail(work, currentW, currentH, activeSt.detail);
    }
    const out = new ImageData(work, currentW, currentH);
    if (useDrag) {
      if (!tempDragCanvasRef.current) {
        const c = document.createElement("canvas");
        c.width = 320;
        c.height = 180;
        tempDragCanvasRef.current = c;
      }
      const tempCtx = tempDragCanvasRef.current.getContext("2d");
      tempCtx.putImageData(out, 0, 0);
      ctx.clearRect(0, 0, SW, SH);
      ctx.drawImage(tempDragCanvasRef.current, 0, 0, 320, 180, 0, 0, SW, SH);
    } else {
      ctx.putImageData(out, 0, 0);
    }
    if (!colorBars && !bypass && !useDrag) {
      try {
        liveThumbRef.current = cvs.toDataURL("image/jpeg", 0.55);
      } catch (e) {
      }
    }
    if (showScope && scRef.current) {
      const g = scRef.current.getContext("2d"), W2 = scRef.current.width, H2 = scRef.current.height;
      g.fillStyle = "rgba(8, 12, 10, 0.92)";
      g.fillRect(0, 0, W2, H2);
      const dd2 = work;
      if (scope === "vector") {
        const cx = W2 / 2, cy = H2 / 2, Rr = Math.min(W2, H2) / 2 - 10, cs = Rr / 0.5;
        g.strokeStyle = "rgba(70, 224, 138, 0.25)";
        g.lineWidth = 1;
        g.beginPath();
        g.arc(cx, cy, Rr, 0, 7);
        g.stroke();
        g.beginPath();
        g.moveTo(cx - Rr, cy);
        g.lineTo(cx + Rr, cy);
        g.moveTo(cx, cy - Rr);
        g.lineTo(cx, cy + Rr);
        g.stroke();
        g.strokeStyle = "rgba(255, 174, 110, 0.5)";
        g.setLineDash([3, 3]);
        g.beginPath();
        g.moveTo(cx, cy);
        g.lineTo(cx + Math.cos(-123 * Math.PI / 180) * Rr, cy - Math.sin(-123 * Math.PI / 180) * Rr);
        g.stroke();
        g.setLineDash([]);
        [["R", 191, 0, 0], ["YL", 191, 191, 0], ["G", 0, 191, 0], ["CY", 0, 191, 191], ["B", 0, 0, 191], ["MG", 191, 0, 191]].forEach(([l2, r0, g0, b0]) => {
          const Y2 = (0.2126 * r0 + 0.7152 * g0 + 0.0722 * b0) / 255;
          const x2 = cx + (b0 / 255 - Y2) / 1.8556 * cs;
          const y2 = cy - (r0 / 255 - Y2) / 1.5748 * cs;
          g.strokeStyle = "rgba(220, 230, 225, 0.5)";
          g.strokeRect(x2 - 3.5, y2 - 3.5, 7, 7);
          g.fillStyle = "rgba(160, 180, 175, 0.9)";
          g.font = "14px monospace";
          g.fillText(l2, x2 + 6, y2 - 6);
        });
        g.fillStyle = "rgba(70, 224, 138, 0.75)";
        const step = useDrag ? 8 : 24;
        for (let i = 0; i < dd2.length; i += step) {
          const r2 = dd2[i] / 255, gg2 = dd2[i + 1] / 255, b = dd2[i + 2] / 255;
          const Y2 = 0.2126 * r2 + 0.7152 * gg2 + 0.0722 * b;
          g.fillRect(cx + (b - Y2) / 1.8556 * cs, cy - (r2 - Y2) / 1.5748 * cs, 1.3, 1.3);
        }
      } else if (scope === "wave") {
        g.lineWidth = 1;
        g.font = "14px monospace";
        [0, 0.5, 1].forEach((p2) => {
          const y2 = H2 - 8 - p2 * (H2 - 16);
          g.strokeStyle = "rgba(120, 140, 150, 0.25)";
          g.beginPath();
          g.moveTo(24, y2);
          g.lineTo(W2 - 4, y2);
          g.stroke();
          g.fillStyle = "rgba(150, 165, 175, 0.8)";
          g.fillText(Math.round(p2 * 100), 1, y2 + 4);
        });
        g.fillStyle = "rgba(70, 224, 138, 0.55)";
        const step = useDrag ? 4 : 16;
        for (let i = 0; i < dd2.length; i += step) {
          const px = i / 4 % currentW;
          const Y2 = (0.2126 * dd2[i] + 0.7152 * dd2[i + 1] + 0.0722 * dd2[i + 2]) / 255;
          g.fillRect(24 + px / currentW * (W2 - 28), H2 - 8 - Y2 * (H2 - 16), 1.2, 1.2);
        }
      } else {
        const bins = 96;
        const Rh2 = new Float32Array(bins), Gh2 = new Float32Array(bins), Bh2 = new Float32Array(bins);
        const step = useDrag ? 2 : 8;
        for (let i = 0; i < dd2.length; i += step) {
          Rh2[Math.min(bins - 1, dd2[i] / 256 * bins | 0)]++;
          Gh2[Math.min(bins - 1, dd2[i + 1] / 256 * bins | 0)]++;
          Bh2[Math.min(bins - 1, dd2[i + 2] / 256 * bins | 0)]++;
        }
        let mx = 1;
        for (let i = 0; i < bins; i++) mx = Math.max(mx, Rh2[i], Gh2[i], Bh2[i]);
        const drawHist = (arr, col) => {
          g.fillStyle = col;
          g.beginPath();
          g.moveTo(4, H2 - 4);
          for (let i = 0; i < bins; i++) g.lineTo(4 + i / (bins - 1) * (W2 - 8), H2 - 4 - arr[i] / mx * (H2 - 14));
          g.lineTo(W2 - 4, H2 - 4);
          g.closePath();
          g.fill();
        };
        drawHist(Rh2, "rgba(255,90,80,0.45)");
        drawHist(Gh2, "rgba(70,224,138,0.45)");
        drawHist(Bh2, "rgba(90,168,255,0.45)");
        g.font = "14px monospace";
        g.fillStyle = "rgba(150,165,175,0.7)";
        g.fillText("Dark", 5, 14);
        g.fillText("Bright", W2 - 20, 14);
      }
    }
  }, [st, bypass, colorBars, scope, showScope, imgLoaded, isDragging, paintLayout, activeMenu, isFocused, selAxis, draftHue, draftSat, scenes, activeScene]);
  reactExports.useEffect(() => {
    if (block === "knee" || block === "black") setScope("wave");
    if (block === "matrix" || block === "multi") setScope("vector");
  }, [block]);
  const blockActive = (id2) => {
    if (id2 === "matrix") return !!(st.level || st.phase || st.rg || st.rb || st.gr || st.gb || st.br || st.bg);
    if (id2 === "multi") return AXIS16.some((a) => st.axes[a].hue || st.axes[a].sat);
    if (id2 === "detail") return st.detail !== 0;
    if (id2 === "knee") return st.autoKnee || st.kneePoint !== 95 || st.kneeSlope !== 0;
    if (id2 === "black") return (st.masterBlack ?? 0) !== 0 || (st.rBlack ?? 0) !== 0 || (st.bBlack ?? 0) !== 0;
    return false;
  };
  const snapState = () => JSON.parse(JSON.stringify({ ...st }));
  const grabThumb = () => {
    try {
      if (!colorBars && preRef.current) return preRef.current.toDataURL("image/jpeg", 0.55);
      return liveThumbRef.current;
    } catch {
      return liveThumbRef.current || null;
    }
  };
  const loadStandard = () => {
    setSt(JSON.parse(JSON.stringify(DEF)));
    setActiveScene("std");
    flash("Loaded Default");
  };
  const saveNewScene = () => {
    if (scenes.length >= 16) return;
    const name = scName.trim() || `Scene ${scenes.length + 1}`;
    const id2 = Date.now();
    setScenes((sc2) => [...sc2, {
      id: id2,
      name,
      remark: scRemark.trim(),
      savedAt: (/* @__PURE__ */ new Date()).toLocaleString("zh-TW", { hour12: false }),
      thumb: grabThumb(),
      data: snapState()
    }]);
    setActiveScene(id2);
    setSaveOpen(false);
    setScName("");
    setScRemark("");
    flash(`Saved "${name}"`);
  };
  const loadScene = (s) => {
    setSt(JSON.parse(JSON.stringify(s.data)));
    setActiveScene(s.id);
    flash(`Loaded "${s.name}"`);
  };
  const updateScene = (s) => {
    setScenes((sc2) => sc2.map((x2) => x2.id === s.id ? {
      ...x2,
      data: snapState(),
      thumb: grabThumb(),
      savedAt: (/* @__PURE__ */ new Date()).toLocaleString("zh-TW", { hour12: false })
    } : x2));
    setActiveScene(s.id);
    flash(`Updated "${s.name}"`);
  };
  const deleteScene = (s) => {
    setScenes((sc2) => sc2.filter((x2) => x2.id !== s.id));
    if (activeScene === s.id) {
      loadStandard();
    }
    flash(`Deleted "${s.name}"`);
  };
  const saveSceneMeta = () => {
    setScenes((sc2) => sc2.map((x2) => x2.id === editingScene ? { ...x2, name: edName.trim() || x2.name, remark: edRemark.trim() } : x2));
    setEditingScene(null);
    flash("Updated Scene Info");
  };
  const renderBlock = () => {
    if (block === "matrix") {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-control-params-matrix", style: { display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          BlockHeader,
          {
            title: "Matrix",
            sub: "Adjust the mutual relationship of RGB colors, hue, and saturation, affecting the entire image."
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 24, alignItems: "stretch", flex: 1, minHeight: 0, padding: "8px 0 10px", boxSizing: "border-box" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flexShrink: 0, height: "100%", aspectRatio: "1", maxHeight: 320, display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(MatrixRing, { level: st.level, phase: st.phase, rg: st.rg, rb: st.rb, gr: st.gr, gb: st.gb, br: st.br, bg: st.bg }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 240, height: "100%", display: "flex", flexDirection: "column", minHeight: 0 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, width: "100%", boxSizing: "border-box" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 14, color: T.text, fontWeight: 600 }, children: "Color Control Items" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 80, display: "flex" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBtn, { onClick: () => MATRIX_KEYS.forEach(([k2]) => upd(k2, 0)), children: "Default" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
              flex: 1,
              minHeight: 0,
              width: "100%",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.10)",
              borderRadius: 8,
              padding: "16px 18px",
              boxSizing: "border-box",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              columnGap: 24,
              rowGap: 4,
              alignContent: "space-between"
            }, children: MATRIX_KEYS.map(([k2, lb2, hint]) => /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { k: k2, label: lb2, hint, min: -99, max: 99, val: st[k2], onChange: (v2) => upd(k2, v2), onStartDrag: startDrag, onEndDrag: endDrag, dense: true }, k2)) })
          ] })
        ] })
      ] });
    }
    if (block === "multi") {
      const FULL_NAME = { R: "Red", YL: "Yellow", G: "Green", CY: "Cyan", B: "Blue", MG: "Magenta" };
      const ax = selAxis ? st.axes[selAxis] : null;
      const anyTouched = AXIS16.some((a) => st.axes[a].hue !== 0 || st.axes[a].sat !== 0);
      const touchedCount = AXIS16.filter((a) => st.axes[a].hue !== 0 || st.axes[a].sat !== 0).length;
      const angUI = {};
      AXIS16.forEach((a, i) => {
        const idxR = AXIS16.indexOf("R");
        angUI[a] = ((i - idxR) * 60 + 360) % 360;
      });
      const fHueSrc = isFocused ? draftHue : ax ? ax.hue : 0;
      isFocused ? draftSat : ax ? ax.sat : 0;
      const fHue = selAxis ? (angUI[selAxis] + fHueSrc / 99 * 30 + 360) % 360 : 0;
      const mOff = false;
      const isWheel = multiStyle === "wheel" || multiStyle === "wheel2";
      const isCinema = paintLayout === "cinema";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-control-params-multi", style: { display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: isWheel ? "visible" : "hidden" }, children: [
        isCinema ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          BlockHeader,
          {
            title: "Multi-Matrix"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          BlockHeader,
          {
            title: "Multi-Matrix",
            sub: "Click node to select color, adjust hue and saturation individually without affecting other colors."
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: 10, width: "100%", boxSizing: "border-box", flex: 1, minHeight: 0, overflow: isWheel ? "visible" : "auto", padding: isWheel ? "8px 0 16px" : "10px 0" }, children: isWheel ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: () => {
              {
                setSelAxis(null);
                if (isFocused) closeFocus();
              }
            },
            style: { display: "flex", gap: 24, alignItems: "stretch", justifyContent: "center", width: "100%", height: "100%", minHeight: 0 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-wheel-layout-shell", style: { display: "flex", justifyContent: "center", alignItems: "center", flex: "0 0 290px", overflow: "visible", height: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  id: "aver-wheel-main-container",
                  ref: ringRef,
                  onClick: (e) => {
                    e.stopPropagation();
                    if (!isFocused) setSelAxis(null);
                  },
                  style: {
                    position: "relative",
                    width: 290,
                    height: 290,
                    flexShrink: 0,
                    overflow: "visible",
                    transform: `scale(${wheelScale})`,
                    transformOrigin: "center center"
                  },
                  children: [
                    isFocused && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-wheel-focus-burst", style: { position: "absolute", left: "50%", top: "50%", width: 150, height: 150, borderRadius: "50%", border: `2px solid hsl(${fHue} 85% 62%)`, background: `radial-gradient(circle, transparent 56%, hsl(${fHue} 85% 60% / .45) 70%, transparent 82%)`, transform: "translate(-50%,-50%)", animation: focusClosing ? "averBurstOut .24s ease-in both" : "averBurst .88s cubic-bezier(0.16, 1, 0.3, 1) both", pointerEvents: "none", zIndex: 7 } }, "burst-" + selAxis),
                    wheelFlash && (() => {
                      const wfHue = angUI[wheelFlash.axis];
                      return /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          onAnimationEnd: () => setWheelFlash(null),
                          style: {
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            width: 150,
                            height: 150,
                            borderRadius: "50%",
                            border: `1px solid hsl(${wfHue} 96% 74%)`,
                            background: `radial-gradient(circle, transparent 78%, hsl(${wfHue} 92% 66% / .48) 87%, hsl(${wfHue} 92% 60% / .12) 93%, transparent 97%)`,
                            boxShadow: `0 0 16px 2px hsl(${wfHue} 90% 60% / .5), 0 0 34px 6px hsl(${wfHue} 90% 55% / .25), inset 0 0 7px hsl(${wfHue} 96% 74% / .4)`,
                            filter: "brightness(1.18) saturate(1.1)",
                            transform: "translate(-50%,-50%)",
                            animation: "averWheelFlash 0.78s cubic-bezier(0.22, 0.61, 0.36, 1) both",
                            pointerEvents: "none",
                            zIndex: 7
                          }
                        },
                        "wflash-" + wheelFlash.key
                      );
                    })(),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "canvas",
                      {
                        id: "aver-wheel-ring-canvas",
                        ref: averWheelRingCanvasRef,
                        width: "290",
                        height: "290",
                        style: {
                          position: "absolute",
                          inset: 0,
                          width: 290,
                          height: 290,
                          borderRadius: "50%",
                          pointerEvents: "none",
                          zIndex: 3,
                          filter: isFocused ? `drop-shadow(0 0 14px hsl(${fHue} 85% 60% / 0.22))` : "drop-shadow(0 0 10px rgba(255, 255, 255, 0.12))",
                          transition: "filter 0.58s cubic-bezier(0.16, 1, 0.3, 1)"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: 34, borderRadius: "50%", border: "1.2px dashed rgba(255, 255, 255, 0.16)", pointerEvents: "none", animation: "mmspin 35s linear infinite", zIndex: 4 } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { id: "aver-wheel-radar-lines-svg", style: { position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 5 }, children: [
                      AXIS16.map((a) => {
                        const isSel = selAxis === a;
                        const isDragNode = isFocused && isSel;
                        const nodeHueVal = isDragNode ? draftHue : st.axes[a].hue;
                        const nodeAngDeg = angUI[a] + nodeHueVal / 99 * 30;
                        const dispAng = (nodeAngDeg - 90) * Math.PI / 180;
                        const nodeSatVal = isDragNode ? draftSat : st.axes[a].sat;
                        const rNode = 119.75 + nodeSatVal / 99 * 25.25;
                        const rx = 145 + Math.cos(dispAng) * rNode;
                        const ry = 145 + Math.sin(dispAng) * rNode;
                        const lineHide = isFocused && !isSel;
                        const nodeHue = (nodeAngDeg + 360) % 360;
                        return /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "line",
                          {
                            x1: 145,
                            y1: 145,
                            x2: rx,
                            y2: ry,
                            stroke: isSel ? `hsl(${nodeHue} 95% 70% / 0.5)` : "rgba(255, 255, 255, 0.08)",
                            strokeWidth: isSel ? "1.2" : "1",
                            strokeDasharray: "2, 4",
                            style: {
                              opacity: lineHide ? 0 : 1,
                              transition: isDragNode ? "none" : "opacity 0.58s cubic-bezier(0.16, 1, 0.3, 1)"
                            }
                          },
                          a
                        );
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "polygon",
                        {
                          points: AXIS16.map((a) => {
                            const isSel = selAxis === a;
                            const isDragNode = isFocused && isSel;
                            const nodeHueVal = isDragNode ? draftHue : st.axes[a].hue;
                            const nodeAngDeg = angUI[a] + nodeHueVal / 99 * 30;
                            const dispAng = (nodeAngDeg - 90) * Math.PI / 180;
                            const nodeSatVal = isDragNode ? draftSat : st.axes[a].sat;
                            const rNode = 119.75 + nodeSatVal / 99 * 25.25;
                            const px = 145 + Math.cos(dispAng) * rNode;
                            const py = 145 + Math.sin(dispAng) * rNode;
                            return `${px},${py}`;
                          }).join(" "),
                          fill: "rgba(30, 155, 240, 0.04)",
                          stroke: "rgba(30, 155, 240, 0.3)",
                          strokeWidth: "1",
                          style: {
                            opacity: isFocused ? 0 : 1,
                            transition: "opacity 0.58s cubic-bezier(0.16, 1, 0.3, 1)"
                          }
                        }
                      )
                    ] }),
                    isFocused && (() => {
                      const base = angUI[selAxis];
                      const px = (deg, r2) => 145 + Math.cos((deg - 90) * Math.PI / 180) * r2;
                      const py = (deg, r2) => 145 + Math.sin((deg - 90) * Math.PI / 180) * r2;
                      const a0 = base - 30, a1 = base + 30;
                      const rIn = 77, rOut = 145;
                      const segPath = (s0, s1) => `M ${px(s0, rOut)} ${py(s0, rOut)} A ${rOut} ${rOut} 0 0 1 ${px(s1, rOut)} ${py(s1, rOut)} L ${px(s1, rIn)} ${py(s1, rIn)} A ${rIn} ${rIn} 0 0 0 ${px(s0, rIn)} ${py(s0, rIn)} Z`;
                      const fullSector = `M ${px(a0, rOut)} ${py(a0, rOut)} A ${rOut} ${rOut} 0 0 1 ${px(a1, rOut)} ${py(a1, rOut)} L ${px(a1, rIn)} ${py(a1, rIn)} A ${rIn} ${rIn} 0 0 0 ${px(a0, rIn)} ${py(a0, rIn)} Z`;
                      const N2 = 24;
                      Array.from({ length: N2 }, (_, i) => {
                        const s0 = a0 + i / N2 * 60, s1 = a0 + (i + 1.4) / N2 * 60;
                        const hue = (base - 30 + (i + 0.5) / N2 * 60 + 360) % 360;
                        return { d: segPath(s0, Math.min(a1, s1)), fill: `hsl(${hue} 85% 58%)` };
                      });
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { id: "aver-wheel-focus-sector-svg", width: "290", height: "290", style: { position: "absolute", inset: 0, pointerEvents: "none", zIndex: 6, overflow: "visible" }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: "sectorLift", x: "-50%", y: "-50%", width: "200%", height: "200%", children: /* @__PURE__ */ jsxRuntimeExports.jsx("feDropShadow", { dx: "0", dy: "3", stdDeviation: "6", floodColor: "#000", floodOpacity: "0.5" }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: "sectorSheen", cx: "50%", cy: "32%", r: "72%", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "rgba(255,255,255,0.28)" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "55%", stopColor: "rgba(255,255,255,0.06)" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "rgba(255,255,255,0)" })
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { className: focusClosing ? "aver-sector-out" : "aver-sector-in", filter: "url(#sectorLift)", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: fullSector, fill: "url(#sectorSheen)" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: fullSector, fill: "none", stroke: "rgba(255,255,255,0.55)", strokeWidth: "1" })
                        ] })
                      ] });
                    })(),
                    AXIS16.map((a) => {
                      const isSel = selAxis === a;
                      const hide = isFocused && !isSel;
                      const isDragNode = isFocused && isSel;
                      const nodeHueVal = isDragNode ? draftHue : st.axes[a].hue;
                      const nodeAngDeg = angUI[a] + nodeHueVal / 99 * 30;
                      const dispAng = (nodeAngDeg - 90) * Math.PI / 180;
                      const nodeSatVal = isDragNode ? draftSat : st.axes[a].sat;
                      const rNode = 119.75 + nodeSatVal / 99 * 25.25;
                      const x2 = 145 + Math.cos(dispAng) * rNode, y2 = 145 + Math.sin(dispAng) * rNode;
                      const nodeHue = (nodeAngDeg + 360) % 360;
                      const satNorm = nodeSatVal / 99;
                      const nodeSat = Math.min(1, Math.max(0.12, 0.85 + satNorm * (satNorm >= 0 ? 0.15 : 0.7)));
                      const nodeVal = Math.min(1, Math.max(0.5, 0.95 + (satNorm < 0 ? satNorm * 0.12 : 0)));
                      const [r2, g, b] = hsv2rgb(nodeHue, nodeSat, nodeVal);
                      const touched = st.axes[a].hue !== 0 || st.axes[a].sat !== 0;
                      const dim = !isFocused && anyTouched && !touched && !isSel;
                      const sz = isSel ? 48 : touched ? 42 : dim ? 30 : 38;
                      return /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "aver-wheel-node-btn-wrapper",
                          id: `aver-wheel-node-btn-wrapper-${a}`,
                          style: {
                            position: "absolute",
                            left: x2,
                            top: y2,
                            transform: "translate(-50%,-50%)",
                            width: sz,
                            height: sz,
                            opacity: hide ? 0 : dim ? 0.4 : 1,
                            pointerEvents: hide ? "none" : "auto",
                            zIndex: isDragNode ? 35 : isSel ? 32 : touched ? 30 : 28,
                            transition: isDragNode ? "none" : "all 0.58s cubic-bezier(0.16, 1, 0.3, 1)",
                            animation: isDragNode ? focusClosing ? "averNodeRetreat .24s ease-in both" : "averNodeShoot .62s cubic-bezier(0.34, 1.56, 0.64, 1) both" : void 0,
                            overflow: "visible"
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              className: "aver-wheel-node-btn",
                              id: `aver-wheel-node-btn-${a}`,
                              onClick: isDragNode ? void 0 : (e) => {
                                e.stopPropagation();
                                if (multiStyle === "wheel2") {
                                  setSelAxis(a === selAxis ? null : a);
                                } else {
                                  enterFocus(a);
                                }
                              },
                              onPointerDown: isDragNode ? (e) => {
                                e.preventDefault();
                                ringDragRef.current = true;
                                startDrag();
                                try {
                                  e.currentTarget.setPointerCapture(e.pointerId);
                                } catch {
                                }
                                ringPointerMove(e);
                              } : void 0,
                              onPointerMove: isDragNode ? ringPointerMove : void 0,
                              onPointerUp: isDragNode ? (e) => {
                                ringDragRef.current = false;
                                endDrag();
                                try {
                                  e.currentTarget.releasePointerCapture(e.pointerId);
                                } catch {
                                }
                              } : void 0,
                              style: {
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                cursor: isDragNode ? "grab" : hide ? "default" : "pointer",
                                touchAction: isDragNode ? "none" : "auto",
                                background: `rgb(${r2 * 255},${g * 255},${b * 255})`,
                                border: isSel ? "2.5px solid #fff" : "2px solid rgba(255,255,255,0.85)",
                                boxShadow: isSel ? `0 0 22px hsl(${nodeHue} 90% 60% / 0.95), 0 2px 6px rgba(0,0,0,0.5)` : `0 2px 6px rgba(0,0,0,0.45)`,
                                fontSize: isSel ? 15 : dim ? 12 : 15,
                                fontFamily: fMono,
                                fontWeight: 800,
                                color: "#fff",
                                textShadow: "0 1px 2px rgba(0,0,0,0.55)",
                                padding: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              },
                              children: a
                            }
                          )
                        },
                        a
                      );
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-wheel-center-controller", style: { position: "absolute", inset: 68, borderRadius: "50%", background: "radial-gradient(circle at 38% 30%, #181c21, #0e1114)", border: `1px solid ${isFocused || multiStyle === "wheel2" && selAxis ? `hsl(${fHue} 60% 45%)` : T.line2}`, boxShadow: "inset 0 0 24px rgba(0,0,0,0.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, padding: "0 12px", boxSizing: "border-box", transition: "border-color 0.48s cubic-bezier(0.16, 1, 0.3, 1)", zIndex: 20 }, children: isFocused || multiStyle === "wheel2" && selAxis ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12.5, letterSpacing: 0.8, color: T.faint, fontFamily: fMono, whiteSpace: "nowrap", width: "100%", textAlign: "center", textOverflow: "ellipsis", overflow: "hidden", display: "block" }, children: multiStyle === "wheel2" ? "Selected" : "Adjusting" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                        fontSize: selAxis === "MG" ? 17 : selAxis === "YL" ? 19 : selAxis === "G" ? 20 : 21,
                        fontWeight: 700,
                        color: T.text,
                        lineHeight: 1.15,
                        marginTop: 2,
                        whiteSpace: "nowrap",
                        width: "100%",
                        textAlign: "center",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        display: "block"
                      }, children: FULL_NAME[selAxis] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10, marginTop: 4, fontFamily: fMono, fontSize: 13.5, whiteSpace: "nowrap", justifyContent: "center", width: "100%" }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: (multiStyle === "wheel2" ? st.axes[selAxis].hue : draftHue) ? T.blue : T.faint }, children: [
                          "H ",
                          (multiStyle === "wheel2" ? st.axes[selAxis].hue : draftHue) > 0 ? "+" + (multiStyle === "wheel2" ? st.axes[selAxis].hue : draftHue) : multiStyle === "wheel2" ? st.axes[selAxis].hue : draftHue
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: (multiStyle === "wheel2" ? st.axes[selAxis].sat : draftSat) ? T.amber : T.faint }, children: [
                          "S ",
                          (multiStyle === "wheel2" ? st.axes[selAxis].sat : draftSat) > 0 ? "+" + (multiStyle === "wheel2" ? st.axes[selAxis].sat : draftSat) : multiStyle === "wheel2" ? st.axes[selAxis].sat : draftSat
                        ] })
                      ] })
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12.5, letterSpacing: 1, color: T.faint, fontFamily: fMono, whiteSpace: "nowrap", width: "100%", textAlign: "center", textOverflow: "ellipsis", overflow: "hidden", display: "block" }, children: "Select Hue Axis" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 20, fontWeight: 600, color: T.dim, lineHeight: 1.2, marginTop: 2, whiteSpace: "nowrap", width: "100%", textAlign: "center", textOverflow: "ellipsis", overflow: "hidden", display: "block" }, children: "6 Axes" }),
                      anyTouched ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11.5, color: T.amber, marginTop: 3, fontFamily: fMono, whiteSpace: "nowrap", width: "100%", textAlign: "center", textOverflow: "ellipsis", overflow: "hidden", display: "block" }, children: [
                        "● ",
                        touchedCount,
                        " Axes Adjusted"
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: T.faint, marginTop: 3, whiteSpace: "nowrap", width: "100%", textAlign: "center", textOverflow: "ellipsis", overflow: "hidden", display: "block" }, children: "Click any node to adjust" })
                    ] }) })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, minWidth: 240, height: "100%", display: "flex", flexDirection: "column", minHeight: 0 }, onClick: (e) => e.stopPropagation(), children: multiStyle === "wheel2" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 0, height: "100%", width: "100%" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, width: "100%", boxSizing: "border-box" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 14, color: T.text, fontWeight: 600 }, children: "Color Control Items" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 80, display: "flex" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBtn, { onClick: () => {
                    upd("axes", DEF_AXES());
                  }, disabled: mOff, children: "Default" }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, minHeight: 0, overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1fr", gridAutoRows: "1fr", columnGap: 10, rowGap: 4 }, children: AXIS16.map((axis) => {
                  const ax2 = st.axes[axis];
                  const dotCol = `hsl(${angUI[axis]} 90% 55%)`;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      onClick: () => {
                        setSelAxis(axis);
                      },
                      style: {
                        padding: "4px 8px",
                        borderRadius: 6,
                        border: "1px solid rgba(255, 255, 255, 0.10)",
                        background: "rgba(255, 255, 255, 0.03)",
                        opacity: 1,
                        transition: "all 0.2s ease",
                        cursor: "default",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: 2,
                        minWidth: 0
                      },
                      onMouseEnter: (e) => {
                        {
                          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.20)";
                          e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                        }
                      },
                      onMouseLeave: (e) => {
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.10)";
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center" }, children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 8, height: 8, borderRadius: "50%", background: dotCol, boxShadow: `0 0 6px ${dotCol}`, marginRight: 6 } }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12.5, fontWeight: 700, color: "#fff", fontFamily: fUI }, children: FULL_NAME[axis] })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", alignItems: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, fontFamily: fMono, color: ax2.hue || ax2.sat ? T.amber : T.faint }, children: [
                            "H",
                            ax2.hue >= 0 ? "+" : "",
                            ax2.hue,
                            " | S",
                            ax2.sat >= 0 ? "+" : "",
                            ax2.sat
                          ] }) })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, width: "100%", minWidth: 0 }, children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }, children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 10, color: T.faint }, children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Hue" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: ax2.hue > 0 ? "+" + ax2.hue : ax2.hue })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "input",
                              {
                                type: "range",
                                min: -99,
                                max: 99,
                                value: ax2.hue,
                                disabled: mOff,
                                onPointerDown: () => {
                                  {
                                    setSelAxis(axis);
                                    triggerWheelFlash(axis);
                                  }
                                },
                                onChange: (e) => updAxis(axis, "hue", parseInt(e.target.value)),
                                className: "tr-sl",
                                style: {
                                  width: "100%",
                                  cursor: "pointer",
                                  "--p": (ax2.hue - -99) / 198 * 100 + "%"
                                }
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }, children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 10, color: T.faint }, children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Saturation" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: ax2.sat > 0 ? "+" + ax2.sat : ax2.sat })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "input",
                              {
                                type: "range",
                                min: -99,
                                max: 99,
                                value: ax2.sat,
                                disabled: mOff,
                                onPointerDown: () => {
                                  {
                                    setSelAxis(axis);
                                    triggerWheelFlash(axis);
                                  }
                                },
                                onChange: (e) => updAxis(axis, "sat", parseInt(e.target.value)),
                                className: "tr-sl",
                                style: {
                                  width: "100%",
                                  cursor: "pointer",
                                  "--p": (ax2.sat - -99) / 198 * 100 + "%"
                                }
                              }
                            )
                          ] })
                        ] })
                      ]
                    },
                    axis
                  );
                }) })
              ] }) : isFocused ? (
                /* [聚焦態] 控制面板在環右側(並排) */
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: focusClosing ? "aver-fade-out" : "aver-pop", style: { background: "rgba(0,0,0,0.18)", border: `1px solid ${T.line}`, borderRadius: 10, padding: "14px 16px", boxSizing: "border-box" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 12 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 15, color: T.text, fontWeight: 600 }, children: [
                      "Adjust ",
                      FULL_NAME[selAxis]
                    ] }),
                    (draftHue !== ax.hue || draftSat !== ax.sat) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: T.amber, fontFamily: fMono }, children: "● Not Applied Yet" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { k: "hue", label: "Hue", hint: "Hue rotation in this zone", min: -99, max: 99, val: draftHue, onChange: (v2) => setDraftHue(v2), onStartDrag: startDrag, onEndDrag: endDrag, disabled: mOff }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { k: "sat", label: "Saturation", hint: "Saturation in this zone", min: -99, max: 99, val: draftSat, onChange: (v2) => setDraftSat(v2), onStartDrag: startDrag, onEndDrag: endDrag, disabled: mOff }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, marginTop: 8 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: confirmFocus,
                        disabled: mOff,
                        style: { flex: 1, padding: "9px 0", fontSize: 13.5, fontWeight: 600, cursor: "pointer", borderRadius: 6, border: "none", background: T.blue, color: "#fff", fontFamily: fUI },
                        children: "OK"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: closeFocus,
                        style: { flex: 1, padding: "9px 0", fontSize: 13, cursor: "pointer", borderRadius: 6, border: `1px solid ${T.line2}`, background: "transparent", color: T.dim, fontFamily: fUI },
                        children: "Cancel"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Note, { children: [
                    "The image and color wheel instantly preview the adjusted effect. ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: T.amber }, children: 'Click "OK" to apply changes' }),
                    '; "Cancel" to discard.'
                  ] })
                ] })
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", flex: 1, height: "100%", minHeight: 0 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, width: "100%", boxSizing: "border-box" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 14, color: T.text, fontWeight: 600 }, children: "Select Hue Axis to Adjust" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 80, display: "flex" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBtn, { onClick: () => upd("axes", DEF_AXES()), disabled: mOff, children: "Default" }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12.5, color: T.dim, lineHeight: 1.6, marginBottom: 14 }, children: "Please click on a node on the left color wheel (e.g. Red, Yellow) or an adjusted color tag below to enter detailed tuning for that axis." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflowY: "auto", marginBottom: 14, minHeight: 0 }, children: AXIS16.some((a) => st.axes[a].hue || st.axes[a].sat) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13.5, color: "rgba(255, 255, 255, 0.7)", fontWeight: 600, width: "100%", marginBottom: 4 }, children: "Adjusted Axes:" }),
                  AXIS16.filter((a) => st.axes[a].hue || st.axes[a].sat).map((a) => {
                    const FULL_NAME2 = { R: "Red", YL: "Yellow", G: "Green", CY: "Cyan", B: "Blue", MG: "Magenta" };
                    const dotCol = `hsl(${angUI[a]} 90% 55%)`;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        onClick: () => enterFocus(a),
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: "9px",
                          padding: "6px 14px",
                          background: "#181d24",
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                          borderRadius: "18px",
                          cursor: "pointer",
                          userSelect: "none",
                          transition: "all 0.22s ease-out",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.25)"
                        },
                        onMouseEnter: (e) => {
                          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.35)";
                          e.currentTarget.style.background = "#202730";
                          e.currentTarget.style.boxShadow = `0 0 10px ${dotCol}25, 0 2px 5px rgba(0,0,0,0.25)`;
                        },
                        onMouseLeave: (e) => {
                          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
                          e.currentTarget.style.background = "#181d24";
                          e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.25)";
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 9, height: 9, borderRadius: "50%", background: dotCol, boxShadow: `0 0 7px ${dotCol}` } }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: fUI }, children: FULL_NAME2[a] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 12, color: "rgba(255,255,255,0.48)", fontFamily: fMono }, children: [
                            "H",
                            st.axes[a].hue >= 0 ? "+" : "",
                            st.axes[a].hue,
                            " S",
                            st.axes[a].sat >= 0 ? "+" : "",
                            st.axes[a].sat
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              onClick: (e) => {
                                e.stopPropagation();
                                updAxis(a, "hue", 0);
                                updAxis(a, "sat", 0);
                              },
                              title: "Reset this axis to zero",
                              style: {
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 17,
                                height: 17,
                                borderRadius: "50%",
                                border: "none",
                                background: "rgba(255, 255, 255, 0.15)",
                                color: "rgba(255, 255, 255, 0.7)",
                                fontSize: 10,
                                fontWeight: 900,
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                                padding: 0,
                                marginLeft: 4
                              },
                              onMouseEnter: (e) => {
                                e.stopPropagation();
                                e.currentTarget.style.background = "rgba(255, 59, 48, 0.25)";
                                e.currentTarget.style.color = "#ff3b30";
                              },
                              onMouseLeave: (e) => {
                                e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                                e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                              },
                              children: "✕"
                            }
                          )
                        ]
                      },
                      a
                    );
                  })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: T.faint }, children: "No axes adjusted yet." }) })
              ] }) })
            ]
          }
        ) : (
          /* === Color Dial盤 (Colour Gauges):弧形量錶 + 中央發光色盤,自適應對齊網格 === */
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: "100%", boxSizing: "border-box", padding: "6px 8px 8px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13, color: T.dim }, children: "Drag the outer ring of the dial to adjust Gain, and the slider below to adjust Hue; the central swatch reflects the adjusted color in real-time." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    upd("axes", DEF_AXES());
                  },
                  disabled: mOff,
                  style: { flexShrink: 0, padding: "7px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", borderRadius: 7, border: `1px solid ${T.line2}`, background: T.panel2, color: T.text, fontFamily: fUI, opacity: 1 },
                  children: "Reset All to Default"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 230px))", justifyContent: "center", gap: 12, alignItems: "stretch", width: "100%", boxSizing: "border-box" }, children: AXIS16.map((a, i) => {
              const axObj = st.axes[a];
              axObj.hue !== 0 || axObj.sat !== 0;
              const ang = angUI[a];
              const nodeHue = (ang + axObj.hue / 99 * 30 + 360) % 360;
              const nodeSat = Math.max(0.1, Math.min(1, 0.85 + axObj.sat / 99 * 0.3));
              const nodeVal = Math.max(0.4, Math.min(1, 0.9 + axObj.sat / 99 * 0.45));
              const [r2, g, b] = hsv2rgb(nodeHue, nodeSat, nodeVal);
              const col = `rgb(${Math.round(r2 * 255)},${Math.round(g * 255)},${Math.round(b * 255)})`;
              return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aver-gauge-card", style: {
                position: "relative",
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 6px 10px",
                background: "rgba(255,255,255,0.02)",
                border: `1.5px solid ${T.line2}`,
                borderRadius: 14,
                animationDelay: `${i * 65}ms`
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ColorGauge,
                {
                  label: AXIS_NAME[a],
                  gain: axObj.sat,
                  hue: axObj.hue,
                  col,
                  disabled: mOff,
                  onGain: (v2) => updAxis(a, "sat", v2),
                  onHue: (v2) => updAxis(a, "hue", v2),
                  startDrag,
                  endDrag
                }
              ) }, a);
            }) })
          ] })
        ) })
      ] });
    }
    if (block === "detail") {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-control-params-detail", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          BlockHeader,
          {
            title: "Detail"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { maxWidth: 380 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { k: "detail", label: "Level", hint: "", min: -7, max: 7, val: st.detail, onChange: (v2) => upd("detail", v2), onStartDrag: startDrag, onEndDrag: endDrag }) })
      ] });
    }
    if (block === "knee") {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-control-params-knee", style: { display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          BlockHeader,
          {
            title: "Knee",
            right: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 80, display: "flex" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBtn, { onClick: () => setSt((s) => ({ ...s, autoKnee: false, kneePoint: 95, kneeSlope: 0 })), children: "Default" }) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 24, alignItems: "flex-start", flex: 1, minHeight: 0, padding: "8px 0 16px", boxSizing: "border-box" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          width: "100%",
          maxWidth: 480,
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.10)",
          borderRadius: 8,
          padding: "16px 20px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 12
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 20, marginBottom: 6 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13, color: T.text, fontWeight: 500, fontFamily: fUI }, children: "Auto Knee" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 14 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CamRadio, { id: "aver-knee-radio-auto-on", label: "On", checked: st.autoKnee, onChange: () => upd("autoKnee", true) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CamRadio, { id: "aver-knee-radio-auto-off", label: "Off", checked: !st.autoKnee, onChange: () => upd("autoKnee", false) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { k: "kneePoint", label: "Point", hint: "", min: 75, max: 105, val: st.kneePoint, onChange: (v2) => upd("kneePoint", v2), neutral: 95, onStartDrag: startDrag, onEndDrag: endDrag, disabled: st.autoKnee }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { k: "kneeSlope", label: "Slope", hint: "", min: -5, max: 5, val: st.kneeSlope, onChange: (v2) => upd("kneeSlope", v2), onStartDrag: startDrag, onEndDrag: endDrag, disabled: st.autoKnee })
        ] }) })
      ] });
    }
    if (block === "black") {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-control-params-black", style: { display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          BlockHeader,
          {
            title: "Black Level",
            right: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 80, display: "flex" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(MiniBtn, { onClick: () => setSt((s) => ({ ...s, masterBlack: 0, rBlack: 0, bBlack: 0 })), children: "Default" }) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 24, alignItems: "flex-start", flex: 1, minHeight: 0, padding: "8px 0 16px", boxSizing: "border-box" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          width: "100%",
          maxWidth: 480,
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.10)",
          borderRadius: 8,
          padding: "16px 20px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 12
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { k: "masterBlack", label: "Master Black", hint: "", min: -50, max: 50, val: st.masterBlack, onChange: (v2) => upd("masterBlack", v2), onStartDrag: startDrag, onEndDrag: endDrag }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { k: "rBlack", label: "R Black", hint: "", min: -50, max: 50, val: st.rBlack, onChange: (v2) => upd("rBlack", v2), onStartDrag: startDrag, onEndDrag: endDrag }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { k: "bBlack", label: "B Black", hint: "", min: -50, max: 50, val: st.bBlack, onChange: (v2) => upd("bBlack", v2), onStartDrag: startDrag, onEndDrag: endDrag })
        ] }) })
      ] });
    }
  };
  const paintMonitor = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", borderRadius: 10, overflow: "hidden", border: `1px solid ${T.line}`, background: "#000", flex: 1, minHeight: 0, width: "100%", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: preRef, width: SW, height: SH, style: { width: "100%", height: "100%", display: "block", objectFit: "contain" } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", left: 12, bottom: 12, height: 38, boxSizing: "border-box", background: "rgba(22, 24, 27, 0.75)", border: `1px solid ${T.line}`, borderRadius: 8, padding: "0 12px", display: "flex", alignItems: "center", gap: 12, backdropFilter: "blur(4px)", zIndex: 20 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 14, color: "rgba(255,255,255,0.9)", fontWeight: 600 }, children: "Monitor" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { on: showScope, onChange: setShowScope }),
      showScope && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", background: "#101216", border: `1px solid ${T.line}`, borderRadius: 6, padding: 3, gap: 4, alignItems: "center" }, children: [["vector", "Vector"], ["wave", "Waveform"], ["hist", "Histogram"]].map(([id2, lb2]) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setScope(id2), style: { padding: "4px 10px", fontSize: 14, cursor: "pointer", borderRadius: 4, border: "none", background: scope === id2 ? T.blue : "transparent", color: scope === id2 ? "#fff" : T.dim, fontFamily: fUI }, children: lb2 }, id2)) })
    ] }),
    showScope && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", right: 12, bottom: 12, zIndex: 20, borderRadius: 6, overflow: "hidden", border: `1px solid ${T.line}`, boxShadow: "0 4px 12px rgba(0,0,0,0.5)", background: "rgba(8,12,10,0.95)", display: "flex", flexDirection: "column", alignItems: "center", padding: "4px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: scRef, width: scope === "vector" ? 140 : 190, height: 140, style: { display: "block", borderRadius: 4 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 14, color: T.dim, marginTop: 3, fontFamily: fUI, textAlign: "center" }, children: scope === "vector" ? "Vectorscope (Skin Line)" : scope === "wave" ? "Waveform (0-100%)" : "RGB Histogram (Dark to Bright)" })
    ] })
  ] });
  const paintSceneTiles = () => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SceneTile, { thumb: STD_FIXED_THUMB, name: "Default", factory: true, active: activeScene === "std", dirty: isDirty, onLoad: loadStandard }),
    scenes.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SceneTile, { thumb: s.thumb, name: s.name, remark: s.remark, active: activeScene === s.id, dirty: isDirty, onLoad: () => loadScene(s), onEdit: () => {
      setEditingScene(s.id);
      setEdName(s.name);
      setEdRemark(s.remark || "");
      setSaveOpen(false);
    }, onDelete: () => setDeletingScene(s) }, s.id))
  ] });
  const paintBlockNav = (horizontal) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "row", gap: 8, flexWrap: "wrap" }, children: BLOCKS.map(([id2, lb2]) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setBlock(id2), style: { textAlign: "left", padding: "10px 14px", cursor: "pointer", borderRadius: 7, border: `1.5px solid ${block === id2 ? T.blue : T.line2}`, background: block === id2 ? "rgba(30,155,240,0.12)" : T.panel2, transition: "all 0.28s cubic-bezier(0.16, 1, 0.3, 1)", boxSizing: "border-box", flex: "0 0 auto", width: "auto", boxShadow: block === id2 ? `0 0 14px rgba(30,155,240,0.25)` : "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 14.5, color: block === id2 ? T.blue : T.text, fontWeight: block === id2 ? 600 : 500 }, children: lb2 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 7, height: 7, borderRadius: 4, background: blockActive(id2) ? T.green : T.line2 } })
  ] }) }, id2)) });
  const paintSaveActions = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
    isDirty && activeScene !== "std" && activeScene != null && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
      const s = scenes.find((x2) => x2.id === activeScene);
      if (s) updateScene(s);
    }, style: { padding: "6px 14px", fontSize: 14, fontWeight: 600, cursor: "pointer", borderRadius: 6, border: `1px solid ${T.blueDark}`, background: "rgba(30,155,240,0.12)", color: T.blue, fontFamily: fUI, whiteSpace: "nowrap" }, children: "Save Changes" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
      setSaveOpen((v2) => !v2);
      setEditingScene(null);
      setScName("");
      setScRemark("");
    }, disabled: !isDirty || scenes.length >= 16, style: { padding: "6px 14px", fontSize: 14, fontWeight: 600, cursor: !isDirty || scenes.length >= 16 ? "not-allowed" : "pointer", borderRadius: 6, border: "none", background: !isDirty || scenes.length >= 16 ? "rgba(255, 255, 255, 0.08)" : T.blue, color: !isDirty || scenes.length >= 16 ? T.faint : "#fff", fontFamily: fUI, opacity: !isDirty || scenes.length >= 16 ? 0.45 : 1, whiteSpace: "nowrap" }, children: "Save as New Scene" })
  ] });
  const paintSceneState = () => {
    var _a2;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 14, fontWeight: 600, color: T.dim }, children: "Current Scene: " }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 14, fontWeight: 700, color: activeScene === "std" ? T.blue : T.text, background: activeScene === "std" ? "rgba(30,155,240,0.1)" : "rgba(255,255,255,0.06)", padding: "4px 10px", borderRadius: 6, border: `1px solid ${activeScene === "std" ? "rgba(30,155,240,0.2)" : T.line}` }, children: activeScene === "std" ? "Default" : ((_a2 = scenes.find((x2) => x2.id === activeScene)) == null ? void 0 : _a2.name) || "Custom Scene" }),
      isDirty && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 14, fontWeight: 600, color: T.amber, background: "rgba(245,166,35,0.1)", padding: "3px 8px", borderRadius: 4, border: `1px solid rgba(245,166,35,0.2)` }, children: "● Modified, Unsaved" })
    ] });
  };
  const ONB_STEPS = [
    {
      tag: "Scene Files",
      title: "Scene File System",
      desc: "Apply the factory 'AVer default' as a starting point, or save your fine-tuned settings as a 'New Scene'. Each scene is stored independently and can be overwritten, reverted, or switched at any time.",
      accent: "#3b82f6",
      visualNote: "Scene card switching: Factory default card + several user scene cards, representing the concept of 'Save / Overwrite / Switch'."
    },
    {
      tag: "Color Adjustment",
      title: "Left Color Block Adjustment",
      desc: "Fine-tune image color and layers item-by-item: Matrix, Multi-Matrix, Knee, and Black Level. Each block is accompanied by visual aids (color swatches, hue ring, radar color wheel, color dial), making abstract parameters easy to understand.",
      accent: "#22c55e",
      visualNote: "Left block list + slider color adjustment, with visual aids like color swatches / hue ring / dial."
    },
    {
      tag: "Monitoring & Tuning",
      title: "Monitoring Scopes & Visual Aids",
      desc: "The scopes on the right (Vectorscope, Waveform, Histogram) monitor color and exposure distribution in real-time. Each color block also provides visual aids (swatches, hue ring, radar wheel, color dial), making color tuning intuitive and verifiable.",
      accent: "#f59e0b",
      visualNote: "Scopes (Vectorscope / Waveform / Histogram) + color block visual aids (swatches / hue ring / dial)."
    }
  ];
  const onboardingModal = () => {
    if (!showOnboarding) return null;
    const s = ONB_STEPS[onbStep];
    const last = onbStep === ONB_STEPS.length - 1;
    const close = () => {
      setOnbClosing(true);
      setTimeout(() => {
        setShowOnboarding(false);
        setOnbClosing(false);
      }, 240);
    };
    const goStep = (i) => {
      if (i >= 0 && i < ONB_STEPS.length) setOnbStep(i);
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onClick: close, style: { position: "absolute", inset: 0, zIndex: 1e5, background: "rgba(4,6,9,0.72)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", animation: onbClosing ? "averFadeOut .24s ease forwards" : "averFadeIn .25s ease" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => e.stopPropagation(), style: { width: 480, maxWidth: "90%", background: "linear-gradient(180deg,#171b21,#10141a)", border: `1px solid ${T.line2}`, borderRadius: 16, boxShadow: "0 24px 70px rgba(0,0,0,0.6)", overflow: "hidden", animation: onbClosing ? "averOnbOut .24s cubic-bezier(.4,0,1,1) forwards" : "averOnbPop .35s cubic-bezier(.16,1,.3,1)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { height: 230, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, background: `radial-gradient(circle at 50% 38%, ${s.accent}1a, transparent 72%)`, borderBottom: `1px solid ${T.line}`, position: "relative", padding: "34px 26px 22px", boxSizing: "border-box", transition: "background .35s ease" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { position: "absolute", top: 14, left: 18, fontSize: 12, fontWeight: 700, letterSpacing: 1, color: s.accent, textTransform: "uppercase", transition: "color .35s" }, children: s.tag }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { position: "absolute", top: 12, right: 14, fontSize: 12, color: T.faint, fontFamily: fMono }, children: [
          onbStep + 1,
          " / ",
          ONB_STEPS.length
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", border: `1px dashed ${T.line2}`, borderRadius: 10, background: "rgba(255,255,255,0.015)", padding: "14px 18px", boxSizing: "border-box", animation: "averOnbStep .4s cubic-bezier(.16,1,.3,1)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13, lineHeight: 1.6, color: T.faint, textAlign: "center" }, children: s.visualNote }) }, onbStep)
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "22px 26px 8px", animation: "averOnbStep .4s cubic-bezier(.16,1,.3,1)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: "0 0 10px", fontSize: 19, fontWeight: 700, color: T.text, fontFamily: fUI }, children: s.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: 0, fontSize: 14, lineHeight: 1.7, color: T.dim, fontFamily: fUI }, children: s.desc })
      ] }, "t" + onbStep),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "center", gap: 8, padding: "16px 0 6px" }, children: ONB_STEPS.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => goStep(i), style: { width: i === onbStep ? 22 : 8, height: 8, borderRadius: 4, border: "none", cursor: "pointer", background: i === onbStep ? s.accent : T.line2, transition: "all .3s cubic-bezier(.16,1,.3,1)" } }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 22px 20px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: close, style: { background: "none", border: "none", color: T.faint, fontSize: 13, cursor: "pointer", fontFamily: fUI }, children: "Skip" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10 }, children: [
          onbStep > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => goStep(onbStep - 1), style: { padding: "9px 18px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", borderRadius: 8, border: `1px solid ${T.line2}`, background: "transparent", color: T.text, fontFamily: fUI }, children: "Previous" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            if (last) close();
            else goStep(onbStep + 1);
          }, style: { padding: "9px 22px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", borderRadius: 8, border: "none", background: s.accent, color: "#fff", fontFamily: fUI, boxShadow: `0 4px 14px ${s.accent}55`, transition: "background .35s, box-shadow .35s" }, children: last ? "Get Started" : "Next" })
        ] })
      ] })
    ] }) });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-paint-look-root", style: { position: "relative", background: T.page, width: "100%", height: "100vh", fontFamily: fUI, color: T.text, display: "flex", overflow: "hidden" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        /* 縮放 125% 與低高度螢幕適配滾動 */
        @media (max-height: 860px) {
          #aver-main-stage {
            overflow-y: auto !important;
            padding-right: 8px !important;
          }
          #aver-content-wrapper {
            height: auto !important;
            min-height: 100% !important;
          }
          .aver-classic-layout-entrance {
            height: auto !important;
            min-height: 100% !important;
            gap: 14px !important;
          }
          #aver-preview-preset-panel {
            flex: none !important;
            height: 380px !important;
          }
          #aver-adjustments-panel {
            flex: none !important;
            height: 350px !important;
            min-height: 350px !important;
          }
          .aver-cinema-layout-entrance {
            height: auto !important;
            min-height: 100% !important;
          }
          .aver-cinema-layout-entrance > div:first-child {
            flex: none !important;
            height: 480px !important;
          }
        }

        /* Keep Live View usable on narrower laptop screens without changing the
           desktop 1 : 1.2 : 2 preset layout. */
        @media (max-width: 1120px) {
          #aver-live-control-panel {
            flex-basis: 340px !important;
            height: 340px !important;
          }
          #aver-live-preset-subpanel {
            overflow-x: hidden !important;
            overflow-y: auto !important;
          }
          #aver-live-preset-layout-row {
            flex-wrap: wrap !important;
            align-content: flex-start !important;
            height: auto !important;
          }
          #aver-live-preset-layout-row #aver-live-preset-ptz-control {
            flex: 1 1 260px !important;
            align-self: auto !important;
          }
          #aver-live-preset-layout-row #aver-live-preset-save-options {
            flex: 1.2 1 218px !important;
          }
          #aver-live-preset-layout-row #aver-live-preset-load-options {
            flex: 1 1 100% !important;
            width: 100% !important;
          }
        }

        /* Compact mobile layout: preserve the desktop UI language while
           converting the primary workspace into a touch-friendly single column. */
        @media (max-width: 768px) {
          #aver-paint-look-root {
            flex-direction: column !important;
            overflow: hidden !important;
          }
          #aver-sidebar-container {
            width: 100% !important;
            height: 54px !important;
            min-height: 54px !important;
            padding-top: 0 !important;
            flex-direction: row !important;
            align-items: stretch !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
            scrollbar-width: thin;
          }
          #aver-sidebar-container > div:first-child {
            position: sticky !important;
            left: 0 !important;
            z-index: 3 !important;
            flex: 0 0 auto !important;
            padding: 15px 17px !important;
            border-right: 1px solid rgba(255,255,255,0.08) !important;
            background: ${T.side} !important;
            font-size: 18px !important;
          }
          #aver-sidebar-container > [id^="aver-side-menu-"] {
            flex: 0 0 auto !important;
            padding: 17px 14px 14px !important;
            border-left: none !important;
            border-bottom: 3px solid transparent;
            white-space: nowrap !important;
            font-size: 12.5px !important;
          }
          #aver-sidebar-container > .aver-fade {
            display: none !important;
          }
          #aver-version-switcher {
            top: 8px !important;
            right: 8px !important;
            width: 46px !important;
          }
          #aver-version-switcher-button {
            padding: 0 8px !important;
            justify-content: space-between !important;
          }
          #aver-version-switcher-button > span:nth-child(2) {
            display: none !important;
          }
          #aver-version-switcher-menu {
            left: auto !important;
            right: 0 !important;
            width: 232px !important;
          }
          #aver-main-stage {
            width: 100% !important;
            height: calc(100dvh - 54px) !important;
            padding: 8px !important;
            overflow: auto !important;
          }
          #aver-main-stage > .aver-page-transition {
            height: auto !important;
            min-height: 100% !important;
          }
          #aver-content-wrapper,
          #aver-live-view-wrapper,
          #aver-camera-settings-wrapper,
          #aver-network-wrapper,
          #aver-system-wrapper,
          #aver-ndi-wrapper,
          #aver-tracking-wrapper,
          #aver-video-audio-wrapper {
            width: 100% !important;
            height: auto !important;
            min-height: 100% !important;
            margin-left: 0 !important;
            padding-right: 0 !important;
            overflow: visible !important;
          }

          /* Live View and Preset */
          #aver-live-preview-panel {
            flex: 0 0 auto !important;
            width: 100% !important;
            min-height: 0 !important;
            aspect-ratio: 16 / 9;
          }
          #aver-live-control-panel {
            flex: 0 0 auto !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
          }
          #aver-live-preset-subpanel {
            overflow: visible !important;
          }
          #aver-live-preset-layout-row {
            height: auto !important;
            flex-direction: column !important;
            flex-wrap: nowrap !important;
          }
          #aver-live-preset-ptz-control,
          #aver-live-preset-save-options,
          #aver-live-preset-load-options {
            width: 100% !important;
            min-width: 0 !important;
            flex: 0 0 auto !important;
          }
          #aver-live-preset-save-panel > div {
            flex-wrap: wrap !important;
          }
          #aver-live-preset-card-scroll {
            max-height: 390px !important;
          }

          /* Tracking Settings and Face Enrollment */
          #aver-trk-preview-row {
            flex: 0 0 auto !important;
            flex-direction: column !important;
          }
          #aver-trk-preview-panel {
            flex: 0 0 auto !important;
            width: 100% !important;
            min-height: 0 !important;
            aspect-ratio: 16 / 9;
          }
          #aver-trk-ptz-control-panel {
            width: 100% !important;
            align-self: stretch !important;
            align-items: center !important;
            padding: 10px !important;
          }
          #aver-trk-ptz-control-panel > button {
            width: min(100%, 250px) !important;
          }
          #aver-trk-control-panel {
            flex: 0 0 auto !important;
            width: 100% !important;
            height: auto !important;
            min-height: 500px !important;
            overflow: visible !important;
          }
          #aver-trk-tab-bar {
            flex: 0 0 auto !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
          }
          #aver-trk-tab-bar > button {
            flex: 0 0 112px !important;
          }
          #aver-trk-tab-content {
            flex: 0 0 auto !important;
            min-height: 0 !important;
            overflow: visible !important;
          }
          #aver-trk-tab-content > div {
            grid-template-columns: 1fr !important;
          }
          #aver-tracking-zone-panel {
            grid-template-columns: 1fr !important;
          }
          #aver-face-enrollment {
            height: auto !important;
            flex-direction: column !important;
          }
          #aver-face-enrollment-action-panel {
            flex: 0 0 auto !important;
            width: 100% !important;
            padding: 8px !important;
            border-right: none !important;
            border-bottom: 1px solid ${T.line} !important;
          }
          #aver-enrolled-face-panel {
            width: 100% !important;
            min-height: 360px !important;
            padding: 10px 0 0 !important;
          }
          #aver-face-enrollment-header {
            align-items: flex-start !important;
            flex-wrap: wrap !important;
            gap: 4px 10px !important;
          }
          #aver-enrolled-face-list {
            min-height: 330px !important;
            max-height: 520px !important;
            grid-template-columns: repeat(auto-fill, 104px) !important;
            justify-content: center !important;
          }
          #aver-face-select-coachmark {
            width: calc(100% - 20px) !important;
            max-width: none !important;
            white-space: normal !important;
          }

          /* Face Enrollment information dialog */
          #aver-face-enrollment-tour-modal {
            padding: 8px !important;
          }
          #aver-face-enrollment-tour-dialog {
            width: calc(100vw - 16px) !important;
            max-height: calc(100dvh - 16px) !important;
          }
          #aver-face-enrollment-tour-content {
            grid-template-columns: 1fr !important;
            overflow-y: auto !important;
          }
          #aver-face-enrollment-tour-recapture,
          #aver-face-enrollment-tour-priority-order {
            grid-column: 1 !important;
            grid-template-columns: 1fr !important;
            row-gap: 10px !important;
          }
          #aver-face-enrollment-tour-recapture-example,
          #aver-face-enrollment-tour-priority-example {
            width: 100% !important;
          }

          /* Paint / Look: stack the high-level preview area and allow the
             existing detailed controls to scroll rather than being clipped. */
          #aver-preview-preset-panel,
          #aver-adjustments-panel {
            flex: 0 0 auto !important;
            width: 100% !important;
            height: auto !important;
            min-height: 420px !important;
          }
          #aver-preview-preset-flex {
            flex-direction: column !important;
          }
          #aver-preview-monitor-block {
            width: 100% !important;
            min-width: 0 !important;
            min-height: 260px !important;
          }
        }

        /* 區塊切換（Matrix / Multi-Matrix / Knee / Black Level）過渡動畫 */
        @keyframes averBlockEntrance {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .aver-block-entrance {
          animation: averBlockEntrance 0.28s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        /* 全域自訂滾動條樣式，使其融入暗色主題 */
        * {
          scrollbar-width: thin;
          scrollbar-color: ${T.line2} rgba(0, 0, 0, 0.1);
        }
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb {
          background: ${T.line2};
          border-radius: 3px;
          transition: background 0.15s;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${T.blue};
        }

        .tr-sl { -webkit-appearance:none; appearance:none; flex:1; height:4px; border-radius:2px; background:linear-gradient(90deg, ${T.blue} var(--p), #33393f var(--p)); outline:none; cursor:pointer; }
        .tr-sl::-webkit-slider-thumb { -webkit-appearance:none; width:14px; height:14px; border-radius:50%; background:#fff; cursor:pointer; box-shadow:0 1px 3px rgba(0,0,0,.6); }
        .tr-sl::-moz-range-thumb { width:13px; height:13px; border-radius:50%; background:#fff; border:none; cursor:pointer; }
        @keyframes mmspin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .tr-vfader { -webkit-appearance: none; appearance: none; writing-mode: vertical-lr; direction: rtl; width: 100%; height: 100%; margin: 0; background: transparent; cursor: ns-resize; }
        .tr-vfader::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 8px; border-radius: 3px; background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,.7); cursor: ns-resize; }
        .tr-vfader::-moz-range-thumb { width: 22px; height: 8px; border-radius: 3px; background: #fff; border: none; cursor: ns-resize; }
        .tr-vfader:disabled { cursor: not-allowed; }

        /* Modal 彈出與縮放動效 */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .aver-focus-back-btn:hover {
          background: ${T.blue} !important;
          box-shadow: 0 0 10px rgba(30, 155, 240, 0.5);
        }

        /* ===== 全域互動動效 ===== */
        /* 出現:彈出/淡入(縮放+上浮) */
        @keyframes averPop {
          from { opacity: 0; transform: translateY(6px) scale(.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes averFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes averFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes averFadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes averOnbPop {
          from { opacity: 0; transform: translateY(18px) scale(.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes averOnbOut {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to   { opacity: 0; transform: translateY(10px) scale(.97); }
        }
        @keyframes averOnbStep {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes averPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(245,166,35,.5); }
          50%     { box-shadow: 0 0 0 5px rgba(245,166,35,0); }
        }
        @keyframes averSpin { to { transform: rotate(360deg); } }
        @keyframes averFaceDragLift {
          from { opacity: .45; transform: rotate(0deg) scale(.94); }
          to { opacity: 1; transform: rotate(-2deg) scale(1.04); }
        }
        @keyframes averFaceSelectPulse {
          0%   { opacity: 0; stroke-width: 3px; }
          18%  { opacity: .8; stroke-width: 5px; }
          55%  { opacity: .35; stroke-width: 11px; }
          100% { opacity: 0; stroke-width: 15px; }
        }
        .aver-face-select-pulse {
          animation: averFaceSelectPulse 1.25s cubic-bezier(.2,.7,.25,1) 2;
          pointer-events: none;
        }
        .aver-pop  { animation: averPop .22s cubic-bezier(.2,.8,.3,1) both; }
        .aver-fade { animation: averFade .2s ease both; }
        .aver-page-transition { animation: averFade .2s ease both; }
        .aver-spinner { animation: averSpin .8s linear infinite; }
        .aver-pulse { animation: averPulse 1.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .aver-page-transition { animation: none; }
        }
        @keyframes averToast {
          from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .aver-toast { animation: averToast .25s cubic-bezier(.2,.8,.3,1) both; }

        /* 切換/點擊/懸停:所有 button 與可點元素統一過渡 */
        button, [role="button"], .aver-tap {
          transition: transform .14s cubic-bezier(.2,.8,.3,1), box-shadow .2s ease,
                      background-color .28s ease, border-color .28s ease, color .28s ease, opacity .25s ease;
        }
        /* 懸停:輕微上浮 + 提亮 */
        button:not(:disabled):hover, .aver-tap:not(.is-disabled):hover {
          transform: translateY(-1px);
          filter: brightness(1.08);
        }
        /* 點擊:回壓,給實體回饋 */
        button:not(:disabled):active, .aver-tap:not(.is-disabled):active {
          transform: translateY(0) scale(.96);
          filter: brightness(.95);
        }
        button:disabled { transition: opacity .18s ease; }

        /* 滑桿把手:懸停放大、按下回壓 */
        .tr-sl::-webkit-slider-thumb { transition: transform .12s ease, box-shadow .15s ease; }
        .tr-sl:not(:disabled):hover::-webkit-slider-thumb { transform: scale(1.18); box-shadow: 0 0 8px rgba(30,155,240,.6); }
        .tr-sl:active::-webkit-slider-thumb { transform: scale(1.05); }
        .tr-vfader::-webkit-slider-thumb { transition: transform .12s ease, box-shadow .15s ease; }
        .tr-vfader:not(:disabled):hover::-webkit-slider-thumb { transform: scaleX(1.15); box-shadow: 0 0 8px rgba(255,255,255,.5); }

        /* 尊重使用者「減少動態」偏好,關閉非必要動畫 */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important; }
        }

        /* 側邊選單項:懸停背景、平滑切換 */
        .aver-menu-item:hover { background: rgba(255,255,255,0.05) !important; }

        /* ===== 聚焦態進場動畫:選中色相「射向環」 ===== */
        /* 從中心向外擴張的光環(radiate) */
        @keyframes averBurst {
          0%   { transform: translate(-50%,-50%) scale(.3); opacity: .7; }
          70%  { opacity: .35; }
          100% { transform: translate(-50%,-50%) scale(1.8); opacity: 0; }
        }
        /* [2026-06] 拖曳色彩控制項時,色相環中央的光圈:快進緩出 + 擴張到最外圈才消逝 —
           0~13% 快速彈出並亮到最強(快進);13~82% 緩慢擴張並「持續保持明亮」;82~100% 抵達最外圈才淡出。 */
        @keyframes averWheelFlash {
          0%   { transform: translate(-50%,-50%) scale(.22); opacity: 0; }
          13%  { transform: translate(-50%,-50%) scale(.55); opacity: .62; }
          82%  { transform: translate(-50%,-50%) scale(1.8);  opacity: .55; }
          100% { transform: translate(-50%,-50%) scale(1.98); opacity: 0; }
        }
        /* 選中節點:從大縮入定位,像衝進環裡 */
        @keyframes averNodeShoot {
          0%   { transform: translate(-50%,-50%) scale(1.85); opacity: 0; filter: brightness(1.5); }
          55%  { opacity: 1; }
          100% { transform: translate(-50%,-50%) scale(1); opacity: 1; filter: brightness(1); }
        }
        /* 浮起扇區:輕微縮放淡入 */
        @keyframes averSectorIn {
          from { opacity: 0; transform: scale(.9); }
          to   { opacity: 1; transform: scale(1); }
        }
        .aver-sector-in { animation: averSectorIn .4s cubic-bezier(.2,.8,.3,1) both; transform-origin: 145px 145px; }
        /* 退出聚焦態:扇區/節點退場 */
        @keyframes averSectorOut {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(.9); }
        }
        @keyframes averNodeRetreat {
          from { transform: translate(-50%,-50%) scale(1); opacity: 1; }
          to   { transform: translate(-50%,-50%) scale(1.9); opacity: 0; }
        }
        @keyframes averBurstOut {
          from { transform: translate(-50%,-50%) scale(1.4); opacity: .4; }
          to   { transform: translate(-50%,-50%) scale(.6); opacity: 0; }
        }
        .aver-sector-out { animation: averSectorOut .24s ease-in both; transform-origin: 145px 145px; }
        @keyframes averFadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(4px); } }
        .aver-fade-out { animation: averFadeOut .22s ease-in both; }
        /* 聚焦環底:快速會聚的脈衝光暈 */
        @keyframes averRingPulse {
          0%   { box-shadow: 0 0 0 0 rgba(255,255,255,.35); }
          100% { box-shadow: 0 0 40px 6px rgba(255,255,255,0); }
        }
        /* === Color Dial:進場 / hover / 拖曳動效 === */
        @keyframes averGaugeIn {
          from { opacity: 0; transform: translateY(14px) scale(.94); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .aver-gauge-card { animation: averGaugeIn .5s cubic-bezier(.16,1,.3,1) both; transition: transform .28s cubic-bezier(.16,1,.3,1), border-color .25s, box-shadow .3s; }
        .aver-gauge-card:hover { transform: translateY(-5px); }
        @keyframes averGaugePulse {
          0%   { r: 11; opacity: .55; }
          70%  { r: 17; opacity: 0; }
          100% { r: 17; opacity: 0; }
        }
        .aver-gauge-pulse { animation: averGaugePulse 1.1s ease-out infinite; }
      ` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        id: "aver-version-switcher",
        title: "Switch prototype version",
        onBlur: (event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setVersionMenuOpen(false);
        },
        style: { position: "fixed", right: 14, top: 12, zIndex: 90, width: 264, color: T.dim, fontFamily: fUI },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              id: "aver-version-switcher-button",
              type: "button",
              "aria-label": "Switch prototype version",
              "aria-haspopup": "listbox",
              "aria-expanded": versionMenuOpen,
              onClick: () => setVersionMenuOpen((open) => !open),
              style: { width: "100%", height: 34, padding: "0 10px", display: "flex", alignItems: "center", gap: 8, borderRadius: 6, border: `1px solid ${versionMenuOpen ? T.blue : T.line2}`, outline: "none", background: "rgba(16,18,22,0.96)", boxShadow: versionMenuOpen ? "0 0 0 2px rgba(30,155,240,0.15), 0 4px 14px rgba(0,0,0,0.34)" : "0 4px 14px rgba(0,0,0,0.34)", color: "#fff", fontFamily: fUI, fontSize: 11.5, fontWeight: 600, cursor: "pointer", textAlign: "left" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", style: { width: 7, height: 7, flexShrink: 0, borderRadius: "50%", background: T.blue, boxShadow: `0 0 7px ${T.blue}` } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: "V2 — Face Enrollment Development" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", style: { color: T.dim, fontSize: 11, transform: versionMenuOpen ? "rotate(180deg)" : "none", transition: "transform 0.16s ease" }, children: "▼" })
              ]
            }
          ),
          versionMenuOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-version-switcher-menu", role: "listbox", "aria-label": "Prototype versions", style: { position: "absolute", top: 38, left: 0, width: "100%", boxSizing: "border-box", padding: 4, borderRadius: 6, border: `1px solid ${T.line2}`, background: T.panel2, boxShadow: "0 10px 28px rgba(0,0,0,0.46)", overflow: "hidden" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-version-option-v1", type: "button", role: "option", "aria-selected": "false", onClick: () => window.location.assign("../v1/index.html"), onMouseEnter: (event) => {
              event.currentTarget.style.background = "rgba(255,255,255,0.06)";
            }, onMouseLeave: (event) => {
              event.currentTarget.style.background = "transparent";
            }, style: { width: "100%", minHeight: 32, padding: "6px 9px", border: "none", borderRadius: 4, background: "transparent", color: T.dim, fontFamily: fUI, fontSize: 11.5, textAlign: "left", cursor: "pointer" }, children: "V1 — Preset UX Baseline" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-version-option-v2", type: "button", role: "option", "aria-selected": "true", onClick: () => setVersionMenuOpen(false), style: { width: "100%", minHeight: 32, padding: "6px 9px", border: "none", borderRadius: 4, background: "rgba(30,155,240,0.16)", color: "#fff", fontFamily: fUI, fontSize: 11.5, fontWeight: 600, textAlign: "left", cursor: "pointer", boxShadow: `inset 2px 0 0 ${T.blue}` }, children: "V2 — Face Enrollment Development" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-version-option-v3", type: "button", role: "option", "aria-selected": "false", onClick: () => window.location.assign("../index.html"), onMouseEnter: (event) => {
              event.currentTarget.style.background = "rgba(255,255,255,0.06)";
            }, onMouseLeave: (event) => {
              event.currentTarget.style.background = "transparent";
            }, style: { width: "100%", minHeight: 32, padding: "6px 9px", border: "none", borderRadius: 4, background: "transparent", color: T.dim, fontFamily: fUI, fontSize: 11.5, textAlign: "left", cursor: "pointer" }, children: "V3 — Face Enrollment Batch Review" })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-sidebar-container", style: { width: 220, background: T.side, flexShrink: 0, paddingTop: 20, display: "flex", flexDirection: "column", height: "100vh", boxSizing: "border-box", overflowY: "auto" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "4px 24px 20px", fontWeight: 700, fontSize: 22, fontStyle: "italic", letterSpacing: 0.5, color: "#fff" }, children: "AVer" }),
      [
        ["Live View", "live", true],
        ["Camera Settings", "camera", true],
        ["Paint / Look", "paint", true],
        ["Video & Audio", "video", true],
        ["Network", "network", true],
        ["Tracking Settings", "tracking", true],
        ["NDI", "ndi", true],
        ["System", "system", true],
        ["Audio Integrated", "audio_int", false]
      ].map(([lb2, id2, implement]) => {
        const active = activeMenu === id2;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            id: `aver-side-menu-${id2}`,
            className: "aver-menu-item",
            onClick: () => {
              if (implement) setActiveMenu(id2);
            },
            style: {
              padding: "14px 24px",
              fontSize: 14,
              cursor: implement ? "pointer" : "default",
              background: active ? T.sideActive : "transparent",
              color: active ? "#fff" : T.dim,
              fontWeight: active ? 600 : 400,
              borderLeft: active ? "4px solid #fff" : "4px solid transparent",
              transition: "background .25s ease, color .25s ease, border-color .25s ease, font-weight .25s ease"
            },
            children: lb2
          },
          lb2
        );
      }),
      (activeMenu === "camera" || activeMenu === "live" || activeMenu === "network" || activeMenu === "tracking" || activeMenu === "ndi" || activeMenu === "system") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aver-fade", style: { margin: "8px 0 0", padding: "12px 18px 16px", borderTop: `1px solid ${T.line}`, display: "flex", flexDirection: "column", gap: 12 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, letterSpacing: 1, color: T.faint, fontWeight: 600, textTransform: "uppercase" }, children: "Tracking Control" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 0 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13, color: T.dim, width: 60, flexShrink: 0 }, children: "Tracking" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 24 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 44 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CamRadio, { label: "On", checked: trackOn, onChange: () => setTrackOn(true) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CamRadio, { label: "Off", checked: !trackOn, onChange: () => setTrackOn(false) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "flex-start", gap: 0 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13, color: T.dim, width: 60, flexShrink: 0, paddingTop: 1 }, children: "Mode" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [["presenter", "Presenter"], ["zone", "Zone"], ["hybrid", "Hybrid"], ["framing", "Framing"]].map(([id2, lb2]) => /* @__PURE__ */ jsxRuntimeExports.jsx(CamRadio, { label: lb2, checked: trackMode === id2, onChange: () => setTrackMode(id2) }, id2)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 0 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13, color: T.dim, width: 60, flexShrink: 0 }, children: "TrkFace" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 24 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 44 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CamRadio, { label: "On", checked: trkFace, onChange: () => setTrkFace(true) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CamRadio, { label: "Off", checked: !trkFace, onChange: () => setTrkFace(false) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "9px 0", fontSize: 13, cursor: "pointer", borderRadius: 6, border: `1px solid ${T.line2}`, background: T.panel2, color: T.text, fontFamily: fUI, marginTop: 2 }, children: "⊕ Click Track" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-main-stage", style: { position: "relative", flex: 1, padding: "16px 24px", minWidth: 0, background: T.page, overflow: "hidden", height: "100vh", display: "flex", flexDirection: "column", boxSizing: "border-box" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aver-page-transition", style: { width: "100%", height: "100%", minHeight: 0 }, children: [
        activeMenu === "paint" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-content-wrapper", style: { display: "flex", flexDirection: "column", gap: SP[2], width: "min(calc(75vw - 40px), 100%)", marginLeft: "max(0px, calc(16.6667vw - 225.33px))", height: "100%", minHeight: 0 }, children: paintLayout === "classic" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aver-classic-layout-entrance", style: { display: "flex", flexDirection: "column", gap: 10, width: "100%", height: "100%", minHeight: 0 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-preview-preset-panel", style: { background: T.panel, border: `1px solid ${T.line}`, borderRadius: 10, padding: "14px 20px", display: "flex", flexDirection: "column", gap: 12, width: "100%", boxSizing: "border-box", flex: "1.2 1 0", minHeight: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-preview-preset-flex", style: { display: "flex", gap: 10, width: "100%", flex: 1, minHeight: 0 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-preview-monitor-block", style: { flex: 1, minWidth: 320, display: "flex", flexDirection: "column", minHeight: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-canvas-preview-container", style: { position: "relative", borderRadius: 8, overflow: "hidden", border: `1px solid ${T.line}`, background: "#000", flex: 1, minHeight: 0, width: "100%", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: preRef, width: SW, height: SH, style: { width: "100%", height: "100%", display: "block", objectFit: "contain" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-scope-control-bar", style: {
                position: "absolute",
                left: 12,
                bottom: 12,
                height: 38,
                boxSizing: "border-box",
                background: "rgba(22, 24, 27, 0.75)",
                border: `1px solid ${T.line}`,
                borderRadius: 8,
                padding: "0 12px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                backdropFilter: "blur(4px)",
                zIndex: 20
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 14, color: "rgba(255,255,255,0.9)", fontWeight: 600 }, children: "Monitor" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { on: showScope, onChange: setShowScope }),
                showScope && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", background: "#101216", border: `1px solid ${T.line}`, borderRadius: 6, padding: 3, gap: 4, alignItems: "center" }, children: [["vector", "Vector"], ["wave", "Waveform"], ["hist", "Histogram"]].map(([id2, lb2]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setScope(id2),
                    style: {
                      padding: "4px 10px",
                      fontSize: 14,
                      cursor: "pointer",
                      borderRadius: 4,
                      border: "none",
                      background: scope === id2 ? T.blue : "transparent",
                      color: scope === id2 ? "#fff" : T.dim,
                      fontFamily: fUI
                    },
                    children: lb2
                  },
                  id2
                )) })
              ] }),
              showScope && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-scope-canvas-container", style: {
                position: "absolute",
                right: 12,
                bottom: 12,
                zIndex: 20,
                borderRadius: 6,
                overflow: "hidden",
                border: `1px solid ${T.line}`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                background: "rgba(8,12,10,0.95)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "4px"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: scRef, width: scope === "vector" ? 140 : 190, height: 140, style: { display: "block", borderRadius: 4 } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 14, color: T.dim, marginTop: 3, fontFamily: fUI, textAlign: "center" }, children: scope === "vector" ? "Vectorscope (Skin Line)" : scope === "wave" ? "Waveform (0-100%)" : "RGB Histogram (Dark to Bright)" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-preset-save-block", style: { width: 320, flexShrink: 0, display: "flex", flexDirection: "column", minHeight: 0, alignSelf: "stretch", background: "rgba(0,0,0,0.18)", border: `1px solid ${T.line}`, borderRadius: 8, padding: "14px 10px", boxSizing: "border-box" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 10, flexShrink: 0 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 15, fontWeight: 600, color: T.text }, children: "Scenes" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 14, color: scenes.length >= 16 ? T.amber : T.faint, fontFamily: fMono }, children: [
                    scenes.length,
                    "/16"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "nowrap" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13, fontWeight: 600, color: T.dim, flexShrink: 0 }, children: "Current Scene: " }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                    fontSize: 13,
                    fontWeight: 700,
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    color: activeScene === "std" ? T.blue : T.text,
                    background: activeScene === "std" ? "rgba(30,155,240,0.1)" : "rgba(255,255,255,0.06)",
                    padding: "3px 9px",
                    borderRadius: 6,
                    border: `1px solid ${activeScene === "std" ? "rgba(30,155,240,0.2)" : T.line}`
                  }, children: activeScene === "std" ? "Default" : ((_a = scenes.find((x2) => x2.id === activeScene)) == null ? void 0 : _a.name) || "Custom Scene" }),
                  isDirty && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "aver-fade", title: "Modified, Unsaved", style: {
                    flexShrink: 0,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: T.amber,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 900,
                    lineHeight: 1,
                    border: "1px solid rgba(255,255,255,0.85)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.4)"
                  }, children: "!" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-preset-grid", style: {
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "8px",
                padding: "10px 0px 10px 0px",
                alignItems: "start",
                alignContent: "start"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SceneTile, { thumb: STD_FIXED_THUMB, name: "Default", factory: true, active: activeScene === "std", dirty: isDirty, onLoad: loadStandard }),
                scenes.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SceneTile,
                  {
                    thumb: s.thumb,
                    name: s.name,
                    remark: s.remark,
                    active: activeScene === s.id,
                    dirty: isDirty,
                    onLoad: () => loadScene(s),
                    onEdit: () => {
                      setEditingScene(s.id);
                      setEdName(s.name);
                      setEdRemark(s.remark || "");
                      setSaveOpen(false);
                    },
                    onDelete: () => setDeletingScene(s)
                  },
                  s.id
                )),
                scenes.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { gridColumn: "1 / -1", border: `1.5px dashed ${T.line2}`, borderRadius: 8, padding: "14px 10px", textAlign: "center", color: T.faint, fontSize: 14, lineHeight: 1.6 }, children: [
                  "No custom scenes yet.",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                  "Adjust parameters in the console below, and save at the bottom of this panel."
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, alignItems: "center", marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.line}`, flexShrink: 0 }, children: [
                isDirty && activeScene !== "std" && activeScene != null && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => {
                      const s = scenes.find((x2) => x2.id === activeScene);
                      if (s) updateScene(s);
                    },
                    style: { flex: 1, padding: "8px 14px", fontSize: 14, fontWeight: 600, cursor: "pointer", borderRadius: 6, border: `1px solid ${T.blueDark}`, background: "rgba(30,155,240,0.12)", color: T.blue, fontFamily: fUI, transition: "all .15s", whiteSpace: "nowrap" },
                    children: "Save Changes"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => {
                      setSaveOpen((v2) => !v2);
                      setEditingScene(null);
                      setScName("");
                      setScRemark("");
                    },
                    disabled: !isDirty || scenes.length >= 16,
                    style: { flex: 1, padding: "8px 14px", fontSize: 14, fontWeight: 600, cursor: !isDirty || scenes.length >= 16 ? "not-allowed" : "pointer", borderRadius: 6, border: "none", background: !isDirty || scenes.length >= 16 ? "rgba(255, 255, 255, 0.08)" : T.blue, color: !isDirty || scenes.length >= 16 ? T.faint : "#fff", fontFamily: fUI, opacity: !isDirty || scenes.length >= 16 ? 0.45 : 1, transition: "all 0.28s cubic-bezier(0.16, 1, 0.3, 1)", whiteSpace: "nowrap" },
                    children: "Save as New Scene"
                  }
                )
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-adjustments-panel", style: {
            display: "flex",
            flexDirection: "column",
            gap: 0,
            width: "100%",
            // 2026-06-16 修改註記：配合各分頁面板高度一致，將控制區 flex 設為 1 1 0 提升高度，不使用 auto 彈性高度
            flex: "0.95 1 0",
            minHeight: 0,
            background: T.panel,
            border: `1px solid ${T.line}`,
            borderRadius: 10,
            boxSizing: "border-box"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-adjustments-workspace", style: { display: "flex", gap: 0, flex: 1, minHeight: 0, width: "100%" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-adjustments-nav", style: {
              width: 170,
              flexShrink: 0,
              padding: "8px 8px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              alignSelf: "stretch"
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflowY: "auto", minHeight: 0, display: "flex", flexDirection: "column", gap: 8, paddingRight: 2, scrollbarGutter: "stable" }, children: BLOCKS.map(([id2, lb2]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setBlock(id2),
                style: {
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 12px",
                  cursor: "pointer",
                  borderRadius: 7,
                  border: `1.5px solid ${block === id2 ? T.blue : T.line2}`,
                  background: block === id2 ? "rgba(30,155,240,0.12)" : T.panel2,
                  transition: "all 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxSizing: "border-box"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 14.5, color: block === id2 ? T.blue : T.text, fontWeight: block === id2 ? 600 : 500 }, children: lb2 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 7, height: 7, borderRadius: 4, background: blockActive(id2) ? T.green : T.line2 } })
                ] })
              },
              id2
            )) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-adjustments-controls", style: {
              flex: 1,
              borderLeft: `1px solid ${T.line}`,
              padding: "8px 12px",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              alignSelf: "stretch"
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aver-block-entrance", style: { flex: 1, overflow: block === "multi" && (multiStyle === "wheel" || multiStyle === "wheel2") ? "visible" : block === "matrix" ? "hidden" : "auto", minHeight: 0, paddingRight: 4, scrollbarGutter: "stable", display: "flex", flexDirection: "column" }, children: renderBlock() }, block) })
          ] }) })
        ] }) : (
          /* ===== Cinema Layout (Cinema):左 Hero 預覽 + 右控制塢 + 底部場景條 ===== */
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aver-cinema-layout-entrance", style: { display: "flex", flexDirection: "column", gap: 10, width: "100%", height: "100%", minHeight: 0 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10, flex: 1, minHeight: 0, width: "100%" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-cinema-preview-panel", style: { flex: "1.6 1 0", minWidth: 0, display: "flex", flexDirection: "column", background: T.panel, border: `1px solid ${T.line}`, borderRadius: 10, padding: 12, minHeight: 0, boxSizing: "border-box" }, children: paintMonitor() }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: "1 1 0", minWidth: 360, maxWidth: 480, display: "flex", flexDirection: "column", background: T.panel, border: `1px solid ${T.line}`, borderRadius: 10, minHeight: 0, overflow: "hidden", boxSizing: "border-box" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "10px 14px", borderBottom: `1px solid ${T.line}`, background: "rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", gap: 9, flexShrink: 0 }, children: [
                  paintSceneState(),
                  paintSaveActions()
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "12px 14px 10px", borderBottom: `1px solid ${T.line}`, flexShrink: 0, display: "flex", flexDirection: "column", gap: 8 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, letterSpacing: 1, color: T.faint, fontWeight: 600, textTransform: "uppercase" }, children: "Tuning Sections" }),
                  paintBlockNav()
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aver-block-entrance", style: { flex: 1, overflowY: "auto", minHeight: 0, padding: "14px", scrollbarGutter: "stable" }, children: renderBlock() }, block)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-cinema-scenes-panel", style: { flexShrink: 0, background: T.panel, border: `1px solid ${T.line}`, borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "stretch", gap: 14, boxSizing: "border-box" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", justifyContent: "center", gap: 2, flexShrink: 0, paddingRight: 14, borderRight: `1px solid ${T.line}` }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 14, fontWeight: 600, color: T.text }, children: "Scenes" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 13, color: scenes.length >= 16 ? T.amber : T.faint, fontFamily: fMono }, children: [
                  scenes.length,
                  "/16"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridAutoFlow: "column", gridAutoColumns: "150px", gap: 8, overflowX: "auto", overflowY: "hidden", flex: 1, paddingBottom: 4, alignItems: "start" }, children: paintSceneTiles() })
            ] })
          ] })
        ) }) : activeMenu === "live" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-live-view-wrapper", style: { display: "flex", flexDirection: "column", gap: SP[2], width: "min(calc(75vw - 40px), 100%)", marginLeft: "max(0px, calc(16.6667vw - 225.33px))", height: "100%", minHeight: 0 }, children: (() => {
          const sqStyle = (active) => ({ width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: 8, border: `1px solid ${active ? T.blue : T.line2}`, background: active ? T.blue : T.panel2, color: active ? "#fff" : T.text, fontSize: 17, fontFamily: fUI });
          const presetPtzSqStyle = { ...sqStyle(false), width: 52, height: 52, fontSize: 20 };
          const sec = { border: `1px solid ${T.line}`, borderRadius: 8, padding: "10px 12px", background: "rgba(0,0,0,0.12)", boxSizing: "border-box" };
          const secTitle = { fontSize: 12, color: T.faint, fontWeight: 600, marginBottom: 8 };
          const presetSection = { background: "rgba(255,255,255,0.035)", border: `1px solid ${T.line}`, borderRadius: 6, overflow: "hidden", boxSizing: "border-box" };
          const presetHeader = { height: 25, padding: "0 8px", display: "flex", alignItems: "center", background: "rgba(255,255,255,0.07)", borderBottom: `1px solid ${T.line}`, color: T.text, fontSize: 12, fontWeight: 600, boxSizing: "border-box" };
          const presetInput = { height: 30, minWidth: 0, boxSizing: "border-box", padding: "0 8px", borderRadius: 4, border: `1px solid ${T.line2}`, background: "#101216", color: T.text, fontFamily: fMono, fontSize: 13 };
          const presetButton = { height: 30, padding: "0 14px", boxSizing: "border-box", cursor: "pointer", borderRadius: 4, border: `1px solid ${T.line2}`, background: "#101216", color: T.text, fontFamily: fUI, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" };
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                id: "aver-live-preview-panel",
                style: { position: "relative", borderRadius: 10, overflow: "hidden", border: `1px solid ${T.line}`, width: "100%", flex: 1, minHeight: 0, background: "#000", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "relative", height: "100%", width: "auto", aspectRatio: "16 / 9", overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-live-preset-active-preview", "data-preset-id": live.appliedPresetId ?? "", style: { position: "absolute", inset: 0, backgroundImage: `url(${live.activePreviewImage})`, backgroundSize: "cover", backgroundPosition: "center", transform: `translate(${ptz.pan}%, ${ptz.tilt}%) scale(${ptz.zoom * 1.65})`, transition: "transform 0.1s ease-out, opacity 0.18s ease" } }) })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-live-control-panel", style: { background: T.panel, border: `1px solid ${T.line}`, borderRadius: 10, flex: "0 0 300px", height: 300, display: "flex", flexDirection: "column", overflow: "hidden" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", borderBottom: `1px solid ${T.line}` }, children: [["control", "Camera Control"], ["preset", "Preset"]].map(([id2, lb2]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  id: `aver-live-tab-${id2}`,
                  onClick: () => updLive("tab", id2),
                  style: { flex: `0 0 ${colW(4)}px`, padding: "7px 0", fontSize: 13.5, fontWeight: 600, cursor: "pointer", border: "none", background: live.tab === id2 ? T.blue : "transparent", color: live.tab === id2 ? "#fff" : T.dim, fontFamily: fUI },
                  children: lb2
                },
                id2
              )) }),
              live.tab === "control" ? (
                /* ===== Camera Control ===== */
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-live-camera-control-subpanel", style: { display: "flex", flexWrap: "wrap", gap: SP[3], padding: `${SP[2]}px ${SP[3]}px`, alignItems: "stretch", flex: 1, minHeight: 0, overflow: "hidden", boxSizing: "border-box", alignContent: "stretch" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...sec, display: "flex", gap: 14, alignItems: "center" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 42px)", gridTemplateRows: "repeat(3, 42px)", gap: 5 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-live-btn-pan-up", onClick: () => handlePtz("up"), style: sqStyle(false), children: "▲" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-live-btn-pan-left", onClick: () => handlePtz("left"), style: sqStyle(false), children: "◀" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-live-btn-pan-home", onClick: () => handlePtz("home"), style: { ...sqStyle(false), borderRadius: "50%", fontSize: 15 }, children: "⌂" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-live-btn-pan-right", onClick: () => handlePtz("right"), style: sqStyle(false), children: "▶" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-live-btn-pan-down", onClick: () => handlePtz("down"), style: sqStyle(false), children: "▼" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color: T.faint }, children: "Zoom" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-live-btn-zoom-in", onClick: () => handlePtz("zoom_in"), style: sqStyle(false), children: "＋" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-live-btn-zoom-out", onClick: () => handlePtz("zoom_out"), style: sqStyle(false), children: "－" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...sec, display: "flex", gap: 14 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 5 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-live-btn-focus-af", onClick: () => updLive("focusMode", "af"), style: sqStyle(live.focusMode === "af"), children: "AF" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-live-btn-focus-mf", onClick: () => updLive("focusMode", "mf"), style: sqStyle(live.focusMode === "mf"), children: "MF" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-live-btn-focus-onepush", title: "One-Push AF", style: sqStyle(false), children: "◎" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color: T.faint }, children: "Focus" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-live-btn-focus-in", disabled: live.focusMode !== "mf", style: { ...sqStyle(false), opacity: live.focusMode !== "mf" ? 0.4 : 1, cursor: live.focusMode !== "mf" ? "not-allowed" : "pointer" }, children: "＋" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-live-btn-focus-out", disabled: live.focusMode !== "mf", style: { ...sqStyle(false), opacity: live.focusMode !== "mf" ? 0.4 : 1, cursor: live.focusMode !== "mf" ? "not-allowed" : "pointer" }, children: "－" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 12, justifyContent: "flex-start", minWidth: 130 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: secTitle, children: "Focus Near Limit" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { id: "aver-live-select-focus-near", value: live.focusNear, onChange: (e) => updLive("focusNear", e.target.value), style: { width: "100%", padding: "7px 9px", fontSize: 13, borderRadius: 6, border: `1px solid ${T.line2}`, background: T.panel2, color: T.text, fontFamily: fUI, cursor: "pointer" }, children: ["1cm", "11cm", "30cm", "50cm", "80cm", "1m", "1.5m", "2m", "3m", "5m", "∞"].map((v2) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: v2, children: v2 }, v2)) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: secTitle, children: "AF Mode" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { id: "aver-live-select-af-mode", value: live.afMode, onChange: (e) => updLive("afMode", e.target.value), style: { width: "100%", padding: "7px 9px", fontSize: 13, borderRadius: 6, border: `1px solid ${T.line2}`, background: T.panel2, color: T.text, fontFamily: fUI, cursor: "pointer" }, children: ["Continuous AF", "One-Push AF", "Manual"].map((v2) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: v2, children: v2 }, v2)) })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...sec, minWidth: colW(5), flex: `1 1 ${colW(5)}px`, display: "flex", flexDirection: "column", gap: 12 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExpSlider, { id: "aver-live-slider-pan-speed", label: "Pan Speed", leftLabel: "1", rightLabel: "24", valueText: "" + live.panSpeed, min: 1, max: 24, val: live.panSpeed, onChange: (v2) => updLive("panSpeed", v2) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExpSlider, { id: "aver-live-slider-tilt-speed", label: "Tilt Speed", leftLabel: "1", rightLabel: "24", valueText: "" + live.tiltSpeed, min: 1, max: 24, val: live.tiltSpeed, onChange: (v2) => updLive("tiltSpeed", v2) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: secTitle, children: "Zoom Speed" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 28 }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CamRadio, { id: "aver-live-radio-zoom-speed-high", label: "High", checked: live.zoomSpeed === "high", onChange: () => updLive("zoomSpeed", "high") }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CamRadio, { id: "aver-live-radio-zoom-speed-low", label: "Low", checked: live.zoomSpeed === "low", onChange: () => updLive("zoomSpeed", "low") })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...sec, minWidth: colW(5), flex: `1 1 ${colW(5)}px`, display: "flex", flexDirection: "column", gap: 12 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: secTitle, children: "Digital Zoom" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 28 }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CamRadio, { id: "aver-live-radio-digital-zoom-on", label: "On", checked: live.digitalZoom, onChange: () => updLive("digitalZoom", true) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CamRadio, { id: "aver-live-radio-digital-zoom-off", label: "Off", checked: !live.digitalZoom, onChange: () => updLive("digitalZoom", false) })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExpSlider, { id: "aver-live-slider-digital-zoom-limit", label: "Digital Zoom Limit", leftLabel: "x2", rightLabel: "x12", valueText: "x" + live.digitalZoomLimit, min: 2, max: 12, val: live.digitalZoomLimit, onChange: (v2) => updLive("digitalZoomLimit", v2), disabled: !live.digitalZoom }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CamCheck, { id: "aver-live-check-relative-zoom", label: "Relative Zoom Ratio", checked: live.relativeZoom, onChange: (v2) => updLive("relativeZoom", v2) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CamCheck, { id: "aver-live-check-preset-affects", label: "Preset Affects PTZ & Focus Values Only", checked: live.presetAffects, onChange: (v2) => updLive("presetAffects", v2) })
                  ] })
                ] })
              ) : (
                /* ===== Preset(預設位置)===== */
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-live-preset-subpanel", style: { padding: "10px 12px", flex: 1, minHeight: 0, overflow: "auto", boxSizing: "border-box" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-live-preset-layout-row", style: { display: "flex", gap: 10, minWidth: 0, height: "100%", minHeight: 0 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-live-preset-ptz-control", style: { ...sec, flex: "1 1 0", minWidth: 260, minHeight: 190, padding: "14px 12px", display: "flex", alignItems: "center", justifyContent: "space-evenly", gap: 12, alignSelf: "stretch" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 52px)", gridTemplateRows: "repeat(3, 52px)", gap: 7 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-live-preset-ptz-up-button", type: "button", "aria-label": "Preset panel tilt up", onClick: () => handlePtz("up"), style: presetPtzSqStyle, children: "▲" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-live-preset-ptz-left-button", type: "button", "aria-label": "Preset panel pan left", onClick: () => handlePtz("left"), style: presetPtzSqStyle, children: "◀" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-live-preset-ptz-home-button", type: "button", "aria-label": "Preset panel reset PTZ view", onClick: () => handlePtz("home"), style: { ...presetPtzSqStyle, borderRadius: "50%", fontSize: 17 }, children: "⌂" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-live-preset-ptz-right-button", type: "button", "aria-label": "Preset panel pan right", onClick: () => handlePtz("right"), style: presetPtzSqStyle, children: "▶" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-live-preset-ptz-down-button", type: "button", "aria-label": "Preset panel tilt down", onClick: () => handlePtz("down"), style: presetPtzSqStyle, children: "▼" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-live-preset-ptz-zoom-in-button", type: "button", "aria-label": "Preset panel zoom in", onClick: () => handlePtz("zoom_in"), style: presetPtzSqStyle, children: "＋" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color: T.faint }, children: "Zoom" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-live-preset-ptz-zoom-out-button", type: "button", "aria-label": "Preset panel zoom out", onClick: () => handlePtz("zoom_out"), style: presetPtzSqStyle, children: "－" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-live-preset-save-options", style: { flex: "1.2 1 0", minWidth: 218, display: "flex", flexDirection: "column", gap: 6 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { id: "aver-live-preset-video-freeze-option", style: { ...presetSection, minHeight: 34, padding: "0 9px", display: "flex", alignItems: "center", gap: 7, cursor: "pointer", color: T.text, fontSize: 12 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: live.presetVideoFreeze, onChange: (e) => updLive("presetVideoFreeze", e.target.checked) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Video Freeze while Preset" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { id: "aver-live-preset-accuracy-option", style: { ...presetSection, minHeight: 34, padding: "0 9px", display: "flex", alignItems: "center", gap: 7, cursor: "pointer", color: T.text, fontSize: 12 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: live.presetAccuracy, onChange: (e) => updLive("presetAccuracy", e.target.checked) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Preset Accuracy" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-live-preset-speed-option", style: presetSection, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...presetHeader, justifyContent: "space-between" }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Preset Speed" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: T.text, fontFamily: fMono }, children: live.presetSpeed })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "7px 10px 8px" }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "aver-live-preset-speed-slider", "aria-label": "Preset speed", type: "range", min: "5", max: "200", value: live.presetSpeed, onChange: (e) => updLive("presetSpeed", Number(e.target.value)), style: { width: "100%", accentColor: T.blue } }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", color: T.faint, fontSize: 11, marginTop: 2 }, children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "5" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "200" })
                        ] })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-live-preset-load-options", style: { ...presetSection, flex: "2 1 0", minWidth: 360, display: "flex", flexDirection: "column" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: presetHeader, children: "Preset Library" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-live-preset-library-body", style: { flex: 1, minHeight: 0, display: "flex", flexDirection: "column", alignItems: "stretch", gap: 6, padding: 7 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-live-preset-save-panel", style: { ...presetSection, flex: "0 0 auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 7, padding: 7, alignItems: "center" }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-live-preset-save-reset-group", style: { display: "flex", alignItems: "center", gap: 7, minWidth: 0 }, children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: T.faint, fontSize: 11.5, fontWeight: 600, whiteSpace: "nowrap" }, children: "Save Preset" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "aver-live-preset-save-number", "aria-label": "Save preset number", type: "number", min: "0", max: "19", value: live.presetSaveNumber, onChange: (event) => updLive("presetSaveNumber", event.target.value), style: { ...presetInput, width: 58, height: 27, flex: "0 0 58px" } }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-live-preset-save-button", type: "button", onClick: saveLivePreset, style: { ...presetButton, height: 27, padding: "0 12px" }, children: "Save" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              id: "aver-live-preset-reset-button",
                              type: "button",
                              disabled: live.selectedQuickCall == null || !live.presetSnapshots[live.selectedQuickCall],
                              onClick: openResetLivePresetDialog,
                              style: { ...presetButton, height: 27, padding: "0 10px", color: live.selectedQuickCall != null && live.presetSnapshots[live.selectedQuickCall] ? T.text : T.faint, cursor: live.selectedQuickCall != null && live.presetSnapshots[live.selectedQuickCall] ? "pointer" : "not-allowed", opacity: live.selectedQuickCall != null && live.presetSnapshots[live.selectedQuickCall] ? 1 : 0.48 },
                              children: "Reset"
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "aria-hidden": "true", style: { alignSelf: "stretch", width: 1, background: T.line2, margin: "0 3px" } }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-live-preset-edit-scenes-button", type: "button", onClick: () => flash("Edit Scenes ready"), style: { ...presetButton, height: 27, padding: "0 10px", marginLeft: "auto" }, children: "Edit Scenes" })
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-live-preset-library-cards-column", style: { flex: "1 1 0", minWidth: 0, minHeight: 0, display: "flex", flexDirection: "column" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-live-preset-card-scroll", style: { flex: 1, minHeight: 0, overflowY: "auto", paddingRight: 3, scrollbarColor: `${T.line2} transparent` }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-live-preset-quick-call-grid", style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(108px, 1fr))", gap: 7 }, children: Array.from({ length: 20 }, (_, n2) => {
                        const snapshot = live.presetSnapshots[n2];
                        const saved = live.savedPresetIds.includes(n2) && Boolean(snapshot);
                        const selected = live.selectedQuickCall === n2;
                        const applied = live.appliedPresetId === n2;
                        const presetName = live.presetNames[n2];
                        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "div",
                          {
                            id: `aver-live-preset-card-${n2}`,
                            ref: (node) => {
                              livePresetCardRefs.current[n2] = node;
                            },
                            role: "button",
                            tabIndex: 0,
                            "aria-label": `${presetName}${saved ? "" : " (empty)"}`,
                            "aria-pressed": selected,
                            "data-selected": selected ? "true" : "false",
                            "data-applied": applied ? "true" : "false",
                            onClick: () => setLive((current) => ({ ...current, selectedQuickCall: n2, presetSaveNumber: String(n2) })),
                            onDoubleClick: () => {
                              if (saved) loadLivePreset(n2);
                            },
                            onKeyDown: (event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                setLive((current) => ({ ...current, selectedQuickCall: n2, presetSaveNumber: String(n2) }));
                              }
                            },
                            style: { minWidth: 0, overflow: "hidden", boxSizing: "border-box", outline: "none", borderRadius: 5, border: `${applied ? 3 : selected ? 2 : 1}px solid ${applied ? T.blue : selected ? "#59616b" : T.line}`, background: applied ? "rgba(23,145,236,0.12)" : selected ? "rgba(255,255,255,0.028)" : "#101216", boxShadow: applied ? "0 0 0 1px rgba(23,145,236,0.35)" : "none", userSelect: "none", cursor: "pointer", transition: "background 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease" },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "div",
                                {
                                  id: `aver-live-preset-thumbnail-${n2}`,
                                  "aria-hidden": "true",
                                  style: { position: "relative", width: "100%", aspectRatio: "16 / 9", display: "block", overflow: "hidden", padding: 0, border: "none", borderBottom: `1px solid ${T.line}`, background: saved ? "#000" : "linear-gradient(145deg, #181c22, #0d1014)" },
                                  children: [
                                    saved && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", style: { position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(0,0,0,0.04), rgba(0,0,0,0.16)), url(${snapshot.image})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", transform: `translate(${snapshot.pan}%, ${snapshot.tilt}%) scale(${snapshot.zoom * 1.65})`, transformOrigin: "center" } }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { position: "absolute", zIndex: 1, left: 5, top: 4, minWidth: 20, height: 18, padding: "0 4px", boxSizing: "border-box", display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 3, background: "rgba(0,0,0,0.72)", color: "#fff", fontFamily: fMono, fontSize: 10, fontWeight: 700 }, children: String(n2).padStart(2, "0") }),
                                    !saved && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: T.faint, fontFamily: fUI, fontSize: 10, fontWeight: 600 }, children: "None" })
                                  ]
                                }
                              ),
                              !saved ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: `aver-live-preset-empty-name-${n2}`, style: { width: "100%", height: 27, boxSizing: "border-box", padding: "0 6px", display: "flex", alignItems: "center", color: T.faint, fontFamily: fUI, fontSize: 11.5 }, children: presetName }) : editingLivePresetId === n2 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "input",
                                {
                                  id: `aver-live-preset-name-input-${n2}`,
                                  "aria-label": `Rename preset ${n2}`,
                                  autoFocus: true,
                                  value: livePresetNameDraft,
                                  maxLength: 24,
                                  onClick: (event) => event.stopPropagation(),
                                  onDoubleClick: (event) => event.stopPropagation(),
                                  onChange: (event) => setLivePresetNameDraft(event.target.value),
                                  onBlur: commitLivePresetRename,
                                  onKeyDown: (event) => {
                                    if (event.key === "Enter") commitLivePresetRename();
                                    if (event.key === "Escape") {
                                      setEditingLivePresetId(null);
                                      setLivePresetNameDraft("");
                                    }
                                  },
                                  style: { width: "100%", height: 27, boxSizing: "border-box", padding: "0 6px", border: `1px solid ${T.blue}`, background: "#090b0f", color: T.text, fontFamily: fUI, fontSize: 11.5, outline: "none" }
                                }
                              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: `aver-live-preset-name-${n2}`, type: "button", title: "Click name to edit", onClick: (event) => {
                                event.stopPropagation();
                                beginLivePresetRename(n2);
                              }, onDoubleClick: (event) => event.stopPropagation(), style: { width: "100%", height: 27, minWidth: 0, padding: "0 6px", display: "flex", alignItems: "center", cursor: "text", border: "none", background: "transparent", color: applied || selected ? "#fff" : T.text, fontFamily: fUI, fontSize: 11.5, textAlign: "left" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: presetName }) })
                            ]
                          },
                          n2
                        );
                      }) }) }) })
                    ] })
                  ] })
                ] }) })
              )
            ] })
          ] });
        })() }) : activeMenu === "camera" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-camera-settings-wrapper", style: { display: "flex", flexDirection: "column", gap: SP[2], width: "min(calc(75vw - 40px), 100%)", marginLeft: "max(0px, calc(16.6667vw - 225.33px))", height: "100%", minHeight: 0 }, children: (() => {
          const en = EXP_ENABLED[cam.expMode];
          const ndMul = { clear: 1, nd4: 0.72, nd16: 0.5, nd128: 0.32 }[cam.ndFilter] ?? 1;
          const evB = (cam.expMode === "bright" ? cam.brightVal / 31 * 1.1 + 0.45 : cam.expMode === "manual" ? cam.gain / 42 * 1 + 0.55 : 1 + cam.ev * 0.13) * ndMul;
          const previewFilter = `brightness(${evB.toFixed(2)}) contrast(${(0.7 + cam.contrast / 4 * 0.6).toFixed(2)}) saturate(${(cam.saturation / 5).toFixed(2)})`;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-cam-preview-panel", style: { position: "relative", borderRadius: 10, overflow: "hidden", border: `1px solid ${T.line}`, width: "100%", flex: 1, minHeight: 0, background: "#000", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", height: "100%", width: "auto", aspectRatio: "16 / 9", overflow: "hidden" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    position: "absolute",
                    inset: 0,
                    backgroundImage: "url(meeting_room.png)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: previewFilter,
                    transform: `${cam.mirror ? "scaleX(-1)" : ""} ${cam.flip ? "scaleY(-1)" : ""}`,
                    transition: "filter .2s ease"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { position: "absolute", right: 12, top: 10, fontFamily: fMono, fontSize: 12, color: "rgba(255,255,255,.65)", textShadow: "0 1px 2px #000", zIndex: 10 }, children: EXP_MODES.find(([id2]) => id2 === cam.expMode)[1] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-cam-control-panel", style: { background: T.panel, border: `1px solid ${T.line}`, borderRadius: 10, flex: "0 0 300px", height: 300, display: "flex", flexDirection: "column", overflow: "hidden" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", borderBottom: `1px solid ${T.line}` }, children: [["exp", "Exposure"], ["img", "Image Process"]].map(([id2, lb2]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  id: `aver-cam-tab-${id2}`,
                  onClick: () => updCam("tab", id2),
                  style: { flex: `0 0 ${colW(4)}px`, padding: "7px 0", fontSize: 13.5, fontWeight: 600, cursor: "pointer", border: "none", background: cam.tab === id2 ? T.blue : "transparent", color: cam.tab === id2 ? "#fff" : T.dim, fontFamily: fUI },
                  children: lb2
                },
                id2
              )) }),
              cam.tab === "exp" ? (
                /* ===== Exposure 分頁 ===== */
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-cam-exposure-subpanel", style: { display: "flex", gap: 0, padding: "10px 16px", alignItems: "flex-start", flex: 1, minHeight: 0, overflow: "hidden", boxSizing: "border-box" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: `0 0 ${colW(3)}px`, display: "flex", flexDirection: "column", gap: 4, padding: "0 14px 0 0", borderRight: `1px solid ${T.line}`, alignSelf: "stretch" }, children: EXP_MODES.map(([id2, lb2]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      id: `aver-cam-btn-expmode-${id2}`,
                      onClick: () => updCam("expMode", id2),
                      style: {
                        padding: "8px 10px",
                        fontSize: 13,
                        textAlign: "left",
                        cursor: "pointer",
                        borderRadius: 6,
                        border: cam.expMode === id2 ? `1px solid ${T.blue}` : "1px solid rgba(255, 255, 255, 0.10)",
                        background: cam.expMode === id2 ? T.blue : "rgba(255, 255, 255, 0.03)",
                        color: cam.expMode === id2 ? "#fff" : T.dim,
                        fontWeight: cam.expMode === id2 ? 600 : 400,
                        fontFamily: fUI,
                        boxSizing: "border-box",
                        height: "fit-content"
                      },
                      children: lb2
                    },
                    id2
                  )) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0, padding: "0 10px", display: "flex", flexDirection: "column", gap: 8 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExpSlider, { id: "aver-cam-slider-ev", label: "Exposure Value", leftLabel: "-4", rightLabel: "4", valueText: cam.ev > 0 ? "+" + cam.ev : "" + cam.ev, min: -4, max: 4, val: cam.ev, onChange: (v2) => updCam("ev", v2), disabled: !en.ev }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExpSlider, { id: "aver-cam-slider-shutter", label: "Shutter Speed", leftLabel: "1/4", rightLabel: "1/10K", valueText: SHUTTER_LIST[cam.shutterIdx], min: 2, max: SHUTTER_LIST.length - 1, val: cam.shutterIdx, onChange: (v2) => updCam("shutterIdx", v2), disabled: !en.shutter }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExpSlider, { id: "aver-cam-slider-iris", label: "Iris Level", leftLabel: "0", rightLabel: "F2.8", valueText: IRIS_LIST[cam.irisIdx], min: 0, max: 10, val: cam.irisIdx, onChange: (v2) => updCam("irisIdx", v2), disabled: !en.iris })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0, padding: "0 10px", display: "flex", flexDirection: "column", gap: 8 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExpSlider, { id: "aver-cam-slider-gain", label: "Gain Level", leftLabel: "0", rightLabel: "42", valueText: cam.gain + "dB", min: 0, max: 42, val: cam.gain, onChange: (v2) => updCam("gain", v2), disabled: !en.gain }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExpSlider, { id: "aver-cam-slider-gain-limit", label: "Gain Limit Level", leftLabel: "24", rightLabel: "42", valueText: cam.gainLimit + "dB", min: 24, max: 42, val: cam.gainLimit, onChange: (v2) => updCam("gainLimit", v2), disabled: !en.gainLimit }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExpSlider, { id: "aver-cam-slider-bright-val", label: "Bright Value", leftLabel: "0", rightLabel: "31", valueText: "" + cam.brightVal, min: 0, max: 31, val: cam.brightVal, onChange: (v2) => updCam("brightVal", v2), disabled: !en.bright })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0, padding: "0 10px", display: "flex", flexDirection: "column", gap: 8, height: "100%" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 8, width: "100%" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, width: "100%" }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CamCheck, { id: "aver-cam-check-slow-shutter", label: "Slow Shutter", checked: cam.slowShutter, onChange: (v2) => updCam("slowShutter", v2), disabled: !en.slow }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CamCheck, { id: "aver-cam-check-blc", label: "BLC", checked: !!cam.blc, onChange: (v2) => updCam("blc", v2 ? 1 : 0), disabled: !en.blc })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-cam-wdr-radio-panel", style: {
                        width: "100%",
                        borderRadius: 8,
                        border: "1px solid rgba(255, 255, 255, 0.10)",
                        background: "rgba(255, 255, 255, 0.03)",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        opacity: en.wdr ? 1 : 0.4,
                        pointerEvents: en.wdr ? "auto" : "none",
                        boxSizing: "border-box"
                      }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                          padding: "5px 12px",
                          background: "rgba(255, 255, 255, 0.05)",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                          fontSize: 12.5,
                          color: T.text,
                          fontWeight: 500,
                          fontFamily: fUI
                        }, children: "WDR" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                          display: "flex",
                          justifyContent: "space-around",
                          alignItems: "center",
                          padding: "8px 10px",
                          gap: 6
                        }, children: ["off", "on", "auto"].map((mode) => {
                          const active = cam.wdr === mode;
                          const labelText = mode === "off" ? "Off" : mode === "on" ? "On" : "Auto";
                          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "div",
                            {
                              onClick: () => updCam("wdr", mode),
                              style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: "pointer", userSelect: "none", flex: 1 },
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                                  width: 13,
                                  height: 13,
                                  borderRadius: "50%",
                                  border: `1.5px solid ${active ? T.blue : "rgba(255, 255, 255, 0.4)"}`,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  background: "transparent",
                                  boxSizing: "border-box"
                                }, children: active && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 6, height: 6, borderRadius: "50%", background: T.blue } }) }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11.5, color: active ? T.text : T.dim, fontFamily: fUI }, children: labelText })
                              ]
                            },
                            mode
                          );
                        }) })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                      width: "100%",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.10)",
                      borderRadius: 8,
                      padding: "8px 12px",
                      boxSizing: "border-box",
                      marginTop: 4
                    }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: T.text, marginBottom: 5, fontWeight: 600 }, children: "ND Filter" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "select",
                        {
                          id: "aver-cam-select-nd-filter",
                          value: cam.ndFilter,
                          onChange: (e) => updCam("ndFilter", e.target.value),
                          style: { width: "100%", padding: "5px 8px", fontSize: 12.5, borderRadius: 6, border: "1px solid rgba(255, 255, 255, 0.15)", background: "rgba(255, 255, 255, 0.05)", color: T.text, fontFamily: fUI, cursor: "pointer", outline: "none" },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "nd128", style: { background: "#1a1d21", color: "#fff" }, children: "ND 1/128" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "nd16", style: { background: "#1a1d21", color: "#fff" }, children: "ND 1/16" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "nd4", style: { background: "#1a1d21", color: "#fff" }, children: "ND 1/4" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "clear", style: { background: "#1a1d21", color: "#fff" }, children: "ND Clear" })
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "flex-end", marginTop: "auto", paddingBottom: 4 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        id: "aver-cam-btn-exp-default",
                        onClick: () => setCam({ ...CAM_DEFAULTS, tab: "exp" }),
                        style: {
                          padding: "6px 16px",
                          fontSize: 12,
                          cursor: "pointer",
                          borderRadius: 6,
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          background: "rgba(255, 255, 255, 0.05)",
                          color: T.text,
                          fontFamily: fUI,
                          boxSizing: "border-box",
                          height: "fit-content"
                        },
                        children: "Default"
                      }
                    ) })
                  ] })
                ] })
              ) : (
                /* ===== Image Process 分頁(對照實機) ===== */
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-cam-image-process-subpanel", style: { display: "flex", gap: 0, padding: "10px 16px", alignItems: "flex-start", flex: 1, minHeight: 0, overflow: "hidden", boxSizing: "border-box" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0, padding: "0 14px 0 10px", borderRight: `1px solid ${T.line}`, display: "flex", flexDirection: "column", gap: 8 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                      width: "100%",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.10)",
                      borderRadius: 8,
                      padding: "10px 12px",
                      boxSizing: "border-box"
                    }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12.5, color: T.text, marginBottom: 6, fontWeight: 600 }, children: "White Balance" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "select",
                        {
                          id: "aver-cam-select-wb-mode",
                          value: cam.wbMode,
                          onChange: (e) => updCam("wbMode", e.target.value),
                          style: { width: "100%", padding: "6px 10px", fontSize: 13, borderRadius: 6, border: "1px solid rgba(255, 255, 255, 0.15)", background: "rgba(255, 255, 255, 0.05)", color: T.text, fontFamily: fUI, cursor: "pointer", outline: "none" },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "auto", style: { background: "#1a1d21", color: "#fff" }, children: "AWB" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "indoor", style: { background: "#1a1d21", color: "#fff" }, children: "Indoor" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "outdoor", style: { background: "#1a1d21", color: "#fff" }, children: "Outdoor" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "onepush", style: { background: "#1a1d21", color: "#fff" }, children: "One Push" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "manual", style: { background: "#1a1d21", color: "#fff" }, children: "Manual" })
                          ]
                        }
                      )
                    ] }),
                    cam.wbMode !== "auto" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, width: "100%" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExpSlider, { id: "aver-cam-slider-r-gain", label: "R Gain", leftLabel: "0", rightLabel: "255", valueText: "" + cam.rGain, min: 0, max: 255, val: cam.rGain, onChange: (v2) => updCam("rGain", v2), accent: "#ff6b6b" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExpSlider, { id: "aver-cam-slider-b-gain", label: "B Gain", leftLabel: "0", rightLabel: "255", valueText: "" + cam.bGain, min: 0, max: 255, val: cam.bGain, onChange: (v2) => updCam("bGain", v2) }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                      width: "100%",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.10)",
                      borderRadius: 8,
                      padding: "10px 12px",
                      boxSizing: "border-box",
                      display: "flex",
                      gap: 10,
                      alignItems: "center"
                    }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          id: "aver-cam-btn-onepush-set",
                          disabled: cam.wbMode !== "onepush",
                          style: {
                            padding: "6px 14px",
                            fontSize: 12,
                            cursor: cam.wbMode === "onepush" ? "pointer" : "not-allowed",
                            borderRadius: 6,
                            border: cam.wbMode === "onepush" ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid rgba(255, 255, 255, 0.05)",
                            background: cam.wbMode === "onepush" ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.01)",
                            color: cam.wbMode === "onepush" ? T.text : T.faint,
                            fontFamily: fUI,
                            flexShrink: 0,
                            boxSizing: "border-box",
                            height: "fit-content"
                          },
                          children: "Set"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: T.faint, lineHeight: 1.3 }, children: "AWB 'One push' set helper" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0, padding: "0 14px", borderRight: `1px solid ${T.line}`, display: "flex", flexDirection: "column", gap: 8 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExpSlider, { id: "aver-cam-slider-saturation", label: "Saturation", leftLabel: "0", rightLabel: "10", valueText: "" + cam.saturation, min: 0, max: 10, val: cam.saturation, onChange: (v2) => updCam("saturation", v2) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExpSlider, { id: "aver-cam-slider-contrast", label: "Contrast", leftLabel: "0", rightLabel: "4", valueText: "" + cam.contrast, min: 0, max: 4, val: cam.contrast, onChange: (v2) => updCam("contrast", v2) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExpSlider, { id: "aver-cam-slider-sharpness", label: "Sharpness", leftLabel: "0", rightLabel: "3", valueText: "" + cam.sharpness, min: 0, max: 3, val: cam.sharpness, onChange: (v2) => updCam("sharpness", v2) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0, padding: "0 10px 0 14px", display: "flex", flexDirection: "column", gap: 8 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                      width: "100%",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.10)",
                      borderRadius: 8,
                      padding: "10px 12px",
                      boxSizing: "border-box"
                    }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12.5, color: T.text, marginBottom: 6, fontWeight: 600 }, children: "Noise Filter" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "space-between", gap: 6, width: "100%" }, children: [["off", "Off"], ["low", "Low"], ["medium", "Med"], ["high", "High"]].map(([id2, lb2]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          id: `aver-cam-radio-noise-${id2}`,
                          onClick: () => updCam("noiseFilter", id2),
                          style: {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                            cursor: "pointer",
                            flex: 1,
                            padding: "6px 4px",
                            borderRadius: 6,
                            border: cam.noiseFilter === id2 ? `1px solid ${T.blue}` : "1px solid rgba(255, 255, 255, 0.10)",
                            background: cam.noiseFilter === id2 ? T.blue : "rgba(255, 255, 255, 0.03)",
                            boxSizing: "border-box",
                            height: "fit-content",
                            transition: "all 0.15s ease"
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 10, height: 10, borderRadius: "50%", border: `1.5px solid ${cam.noiseFilter === id2 ? "#fff" : T.line2}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }, children: cam.noiseFilter === id2 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 4, height: 4, borderRadius: "50%", background: "#fff" } }) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11.5, color: cam.noiseFilter === id2 ? "#fff" : T.dim, fontWeight: cam.noiseFilter === id2 ? 600 : 400 }, children: lb2 })
                          ]
                        },
                        id2
                      )) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, width: "100%" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CamCheck, { id: "aver-cam-check-mirror", label: "Mirror", checked: cam.mirror, onChange: (v2) => updCam("mirror", v2) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CamCheck, { id: "aver-cam-check-flip", label: "Flip", checked: cam.flip, onChange: (v2) => updCam("flip", v2) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CamCheck, { id: "aver-cam-check-ldc", label: "LDC", checked: cam.ldc, onChange: (v2) => updCam("ldc", v2) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "flex-end", marginTop: 4 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        id: "aver-cam-btn-img-default",
                        onClick: () => setCam({ ...CAM_DEFAULTS, tab: "img" }),
                        style: {
                          padding: "6px 16px",
                          fontSize: 12,
                          cursor: "pointer",
                          borderRadius: 6,
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          background: "rgba(255, 255, 255, 0.05)",
                          color: T.text,
                          fontFamily: fUI,
                          boxSizing: "border-box",
                          height: "fit-content"
                        },
                        children: "Default"
                      }
                    ) })
                  ] })
                ] })
              )
            ] })
          ] });
        })() }) : activeMenu === "network" ? (() => {
          const card = { border: `1.5px solid ${T.line}`, borderRadius: 4, background: "#08090a", display: "flex", flexDirection: "column", boxSizing: "border-box" };
          const head = { background: "#22252a", padding: "4px 12px", fontSize: 14, fontWeight: 600, color: T.dim, borderBottom: `1.5px solid ${T.line}` };
          const body = { padding: "14px 14px 16px", display: "flex", flexDirection: "column", gap: 12 };
          const lab = { fontSize: 12.5, color: T.dim, marginBottom: 5, fontWeight: 600 };
          const inp = (val, on, dis) => ({ width: "100%", boxSizing: "border-box", background: dis ? "#0a0b0c" : "#101216", border: `1px solid ${T.line2}`, borderRadius: 4, color: dis ? T.faint : T.text, fontSize: 13.5, padding: "8px 10px", fontFamily: fUI, outline: "none" });
          const Inp = ({ k: k2, disabled }) => /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: net[k2], disabled, onChange: (e) => updNet(k2, e.target.value), style: inp(net[k2], null, disabled) });
          const Radio2 = ({ k: k2, opts = ["on", "off"], labels = ["On", "Off"] }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 28, padding: "4px 0" }, children: opts.map((o, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => updNet(k2, o), style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 16, height: 16, borderRadius: "50%", border: `1.5px solid ${net[k2] === o ? T.blue : T.line2}`, display: "flex", alignItems: "center", justifyContent: "center" }, children: net[k2] === o && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 8, height: 8, borderRadius: "50%", background: T.blue } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12.5, color: net[k2] === o ? T.text : T.dim }, children: labels[i] })
          ] }, o)) });
          const Btn = ({ children, primary, disabled }) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled, style: { padding: "8px 18px", fontSize: 13.5, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", borderRadius: 4, border: `1px solid ${T.line2}`, background: disabled ? "#0d0f11" : "#1a1d21", color: disabled ? T.faint : T.text, fontFamily: fUI }, children });
          const sel = { width: "100%", boxSizing: "border-box", background: "#101216", border: `1px solid ${T.line2}`, borderRadius: 4, color: T.text, fontSize: 13.5, padding: "8px 10px", fontFamily: fUI };
          const dhcpOn = net.dhcp === "on";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-network-wrapper", style: { width: "min(calc(75vw - 40px), 100%)", marginLeft: "max(0px, calc(16.6667vw - 225.33px))", height: "100%", overflowY: "auto", paddingRight: 8, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: SP[3] }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: SP[3] }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "DHCP" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: body, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Radio2, { k: "dhcp" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: lab, children: "IP Address" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { k: "ip", disabled: dhcpOn })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: lab, children: "Gateway" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { k: "gateway", disabled: dhcpOn })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "Hostname" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: body, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { k: "hostname" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: lab, children: "Netmask" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { k: "netmask", disabled: dhcpOn })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: lab, children: "DNS" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { k: "dns", disabled: dhcpOn })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "NTP" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: body, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Radio2, { k: "ntp" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: lab, children: "NTP Server" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { k: "ntpServer" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 4 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { children: "Confirm" }) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: SP[3] }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "RTMP Settings" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: body, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: lab, children: "Server URL" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { k: "rtmpUrl" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: lab, children: "Stream Key" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { k: "rtmpKey" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { children: "Start Stream" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { disabled: true, children: "STOP" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "RTSP Security" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: body, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Radio2, { k: "rtspSec" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: lab, children: "RTSP Audio Enable" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Radio2, { k: "rtspAudio" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "HLS Settings" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: body, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: lab, children: "Stream URL" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { k: "hlsUrl" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10, marginTop: 4 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { children: "Start Stream" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { disabled: true, children: "STOP" })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "SRT Settings" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...body, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: SP[3] }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: lab, children: "Destination IP" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { k: "srtIp" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: lab, children: "Port" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { k: "srtPort" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: lab, children: "Encryption" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: net.srtEnc, onChange: (e) => updNet("srtEnc", e.target.value), style: sel, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "None" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "AES-128" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "AES-192" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "AES-256" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: lab, children: "Latency (ms)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { k: "srtLatency" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: lab, children: "Passphrase" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { k: "srtPass" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", justifyContent: "flex-end" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 12.5, color: T.dim, marginBottom: 8 }, children: [
                    "Connect Status: ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: T.faint }, children: "Disconnected" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { children: "Start Stream" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { disabled: true, children: "STOP" })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: SP[3] }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "HTTPS" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: body, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Radio2, { k: "https", opts: ["only", "on", "off"], labels: ["Only", "On", "Off"] }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: head, children: [
                  "Upload Certificate　",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 400, color: T.faint }, children: "Cert Status: None" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...body, flexDirection: "row", alignItems: "center", gap: 12 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { children: "選擇檔案" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12.5, color: T.faint }, children: "未選擇任何檔案" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { disabled: true, children: "Upload" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "SSHD" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: body, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Radio2, { k: "sshd" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: SP[3] }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "Visca Port Mode" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: body, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: net.viscaMode, onChange: (e) => updNet("viscaMode", e.target.value), style: sel, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Default" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "TCP" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "UDP" })
                ] }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "Visca Port Number" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...body, flexDirection: "row", alignItems: "center", gap: 12 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12.5, color: T.dim }, children: "Port" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: net.viscaPort, disabled: true, style: { ...inp(net.viscaPort, null, true), width: 120 } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { disabled: true, children: "Save" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {})
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...card, minHeight: 80 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "802.1X Enable" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...body, color: T.faint, fontSize: 12.5 }, children: "（內容待補）" })
            ] })
          ] });
        })() : activeMenu === "system" ? (() => {
          const card = { border: `1.5px solid ${T.line}`, borderRadius: 4, background: "#08090a", display: "inline-flex", flexDirection: "column", boxSizing: "border-box", alignSelf: "flex-start" };
          const head = { background: "#22252a", padding: "4px 12px", fontSize: 14, fontWeight: 600, color: T.dim, borderBottom: `1.5px solid ${T.line}`, whiteSpace: "nowrap" };
          const body = { padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 };
          const inpStyle = { boxSizing: "border-box", background: "#101216", border: `1px solid ${T.line2}`, borderRadius: 4, color: T.text, fontSize: 13.5, padding: "8px 10px", fontFamily: fUI, outline: "none", minWidth: colW(5) };
          const Inp = ({ k: k2, type, w: w2 = colW(5) }) => /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: type || "text", value: sys[k2], onChange: (e) => updSys(k2, e.target.value), style: { ...inpStyle, minWidth: w2 } });
          const lab = { fontSize: 12.5, color: T.dim, marginBottom: 5, fontWeight: 600 };
          const Btn = ({ children }) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: { padding: "8px 18px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", borderRadius: 4, border: `1px solid ${T.line2}`, background: "#1a1d21", color: T.text, fontFamily: fUI, whiteSpace: "nowrap" }, children });
          const sel = { ...inpStyle, minWidth: colW(4) };
          const Radio2 = ({ k: k2 }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 28, padding: "2px 0" }, children: [["on", "On"], ["off", "Off"]].map(([o, l2]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => updSys(k2, o), style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 16, height: 16, borderRadius: "50%", border: `1.5px solid ${sys[k2] === o ? T.blue : T.line2}`, display: "flex", alignItems: "center", justifyContent: "center" }, children: sys[k2] === o && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 8, height: 8, borderRadius: "50%", background: T.blue } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12.5, color: sys[k2] === o ? T.text : T.dim }, children: l2 })
          ] }, o)) });
          const Check = ({ k: k2, label, extra }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "inline-flex", alignItems: "center", gap: 10, alignSelf: "flex-start", background: "#08090a", border: `1.5px solid ${T.line}`, borderRadius: 4, padding: "10px 14px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => updSys(k2, !sys[k2]), style: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 16, height: 16, borderRadius: 3, border: `1.5px solid ${sys[k2] ? T.blue : T.line2}`, background: sys[k2] ? T.blue : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff" }, children: sys[k2] && "✓" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13.5, color: T.text, whiteSpace: "nowrap" }, children: label })
            ] }),
            extra
          ] });
          const bigRow = { width: "100%", boxSizing: "border-box", display: "flex", flexWrap: "wrap", gap: SP[3], alignItems: "flex-start", padding: `${SP[3]}px 0`, borderBottom: `1px solid ${T.line}` };
          const INFO = [["Model Name", "TR315"], ["IP Address", "10.100.10.90"], ["Serial Number", "5313892200034"], ["MAC Address", "00:18:1A:11:C9:6D"], ["Firmware Version", "0.1.0001.18"], ["Lens Firmware Version", "A027"], ["MCU Firmware Version", "BB354DE9"]];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-system-wrapper", style: { width: "min(calc(75vw - 40px), 100%)", marginLeft: "max(0px, calc(16.6667vw - 225.33px))", height: "100%", overflowY: "auto", paddingRight: 8, boxSizing: "border-box", display: "flex", flexDirection: "column" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: bigRow, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: SP[3] }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "Upgrade Firmware" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...body, flexDirection: "row", alignItems: "center", gap: 12 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { children: "選擇檔案" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12.5, color: T.faint }, children: "未選擇任何檔案" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { children: "Upgrade" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "Factory Default" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...body }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { children: "Reset to Factory Default" }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...card, padding: "14px 18px", display: "flex" }, children: INFO.map(([k2, v2]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 16, fontSize: 13, padding: "3px 0" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: T.dim, width: 170 }, children: k2 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: T.text, fontFamily: fMono }, children: v2 })
              ] }, k2)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: bigRow, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "Login" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: body, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: lab, children: "Login Name" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { k: "loginName" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: lab, children: "Login Password" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { k: "loginPwd", type: "password" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10, marginTop: 2 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { children: "Change" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { children: "Cancel" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "Language" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: body, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: sys.language, onChange: (e) => updSys("language", e.target.value), style: sel, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "English" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "繁體中文" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "简体中文" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "日本語" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 2 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { children: "Reboot" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { children: "Set Date/Time" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { children: "Power Schedule" }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "Syslog" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: body, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: lab, children: "IP Address" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { k: "syslogIp" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: lab, children: "Port" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { k: "syslogPort" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Radio2, { k: "syslog" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: bigRow, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "Status OSD" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: body, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Radio2, { k: "statusOsd" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "Setting" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...body, flexDirection: "row", gap: 10 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { children: "Import Setting" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { children: "Export Setting" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "Status Live View" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: body, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Radio2, { k: "statusLiveView" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { alignSelf: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { children: "Export Log" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: bigRow, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { k: "powerUpPreset", label: "Power Up to Preset" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...body, flexDirection: "row", gap: 10, alignItems: "center" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { k: "powerUpVal", w: colW(4) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { children: "Save" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { k: "powerOffPreset", label: "Power Off to Preset" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...body, flexDirection: "row", gap: 10, alignItems: "center" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { k: "powerOffVal", w: colW(4) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { children: "Save" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "Power Off Completely" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: body, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Radio2, { k: "powerOffComplete" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: bigRow, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { children: "VISCA Customized Function" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: bigRow, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "Sleep to Preset" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...body, maxWidth: 300 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: sys.sleepPreset, onChange: (e) => updSys("sleepPreset", e.target.value), style: sel, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Preset 20" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Preset 1" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Preset 2" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11.5, color: T.faint, lineHeight: 1.55 }, children: "Sleep presets can be enabled in the Zoom/Teams video theme, and presets can be set for sleep positions." })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "Sleep Timer" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...body, maxWidth: 300 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 22 }, children: [["10sec", "10 sec"], ["5min", "5 min"], ["10min", "10 min"]].map(([o, l2]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => updSys("sleepTimer", o), style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 16, height: 16, borderRadius: "50%", border: `1.5px solid ${sys.sleepTimer === o ? T.blue : T.line2}`, display: "flex", alignItems: "center", justifyContent: "center" }, children: sys.sleepTimer === o && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 8, height: 8, borderRadius: "50%", background: T.blue } }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12.5, color: sys.sleepTimer === o ? T.text : T.dim }, children: l2 })
                  ] }, o)) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => updSys("sleepAutoTrack", !sys.sleepAutoTrack), style: { display: "flex", gap: 8, cursor: "pointer", alignItems: "flex-start" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 16, height: 16, flexShrink: 0, borderRadius: 3, border: `1.5px solid ${sys.sleepAutoTrack ? T.blue : T.line2}`, background: sys.sleepAutoTrack ? T.blue : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", marginTop: 1 }, children: sys.sleepAutoTrack && "✓" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11.5, color: T.dim, lineHeight: 1.5 }, children: "Turn on Auto Tracking or SmartFrame (depending on model) when exiting Sleep Mode." })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...bigRow, borderBottom: "none" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "Help Improving AVer Camera" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...body, maxWidth: 300 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: sys.helpImprove, onChange: (e) => updSys("helpImprove", e.target.value), style: sel, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Disable" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Enable" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11.5, color: T.faint, lineHeight: 1.55 }, children: "Allow providing of anonymous usage data." })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "LED Indicator Brightness" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...body, minWidth: colW(5) }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "flex-end", fontFamily: fMono, fontSize: 13, color: T.blue }, children: sys.ledBrightness }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: T.faint }, children: "0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: 0, max: 10, value: sys.ledBrightness, onChange: (e) => updSys("ledBrightness", parseInt(e.target.value)), className: "tr-sl", style: { "--p": sys.ledBrightness / 10 * 100 + "%", flex: 1 } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 11, color: T.faint }, children: "10" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "Camera Selector" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: body, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: sys.cameraSelector, onChange: (e) => updSys("cameraSelector", e.target.value), style: sel, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "1" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "2" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "3" })
                ] }) })
              ] })
            ] })
          ] });
        })() : activeMenu === "ndi" ? (() => {
          const card = { border: `1.5px solid ${T.line}`, borderRadius: 4, background: "#08090a", display: "inline-flex", flexDirection: "column", boxSizing: "border-box", alignSelf: "flex-start" };
          const head = { background: "#22252a", padding: "4px 12px", fontSize: 14, fontWeight: 600, color: T.dim, borderBottom: `1.5px solid ${T.line}`, whiteSpace: "nowrap" };
          const body = { padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 };
          const inpStyle = { boxSizing: "border-box", background: "#101216", border: `1px solid ${T.line2}`, borderRadius: 4, color: T.text, fontSize: 13.5, padding: "8px 10px", fontFamily: fUI, outline: "none", minWidth: colW(5) };
          const sel = { ...inpStyle, minWidth: colW(5) };
          const Inp = ({ k: k2, w: w2 = colW(5) }) => /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: ndi[k2], onChange: (e) => updNdi(k2, e.target.value), style: { ...inpStyle, minWidth: w2 } });
          const Radio = ({ k: k2, val, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => updNdi(k2, val), style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 16, height: 16, borderRadius: "50%", border: `1.5px solid ${ndi[k2] === val ? T.blue : T.line2}`, display: "flex", alignItems: "center", justifyContent: "center" }, children: ndi[k2] === val && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 8, height: 8, borderRadius: "50%", background: T.blue } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12.5, color: ndi[k2] === val ? T.text : T.dim }, children: label })
          ] });
          const Check = ({ k: k2, label, extra }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "inline-flex", alignItems: "center", gap: 12, alignSelf: "flex-start", background: "#08090a", border: `1.5px solid ${T.line}`, borderRadius: 4, padding: "10px 14px", boxSizing: "border-box" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => updNdi(k2, !ndi[k2]), style: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 16, height: 16, borderRadius: 3, border: `1.5px solid ${ndi[k2] ? T.blue : T.line2}`, background: ndi[k2] ? T.blue : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff" }, children: ndi[k2] && "✓" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13.5, color: T.text, whiteSpace: "nowrap" }, children: label })
            ] }),
            extra
          ] });
          const Btn = ({ children }) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: { padding: "8px 22px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", borderRadius: 4, border: `1px solid ${T.line2}`, background: "#1a1d21", color: T.text, fontFamily: fUI }, children });
          const bigRow = { width: "100%", boxSizing: "border-box", display: "flex", flexWrap: "wrap", gap: SP[3], alignItems: "flex-start", padding: `${SP[3]}px 0`, borderBottom: `1px solid ${T.line}` };
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-ndi-wrapper", style: { width: "min(calc(75vw - 40px), 100%)", marginLeft: "max(0px, calc(16.6667vw - 225.33px))", height: "100%", overflowY: "auto", paddingRight: 8, boxSizing: "border-box", display: "flex", flexDirection: "column" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...bigRow }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: { padding: "10px 28px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", borderRadius: 4, border: `1px solid ${T.line2}`, background: ndi.mode === "builtin" ? "#1a1d21" : "transparent", color: T.text, fontFamily: fUI }, children: "Built-in NDI" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: bigRow, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "Video Bandwidth" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...body, flexDirection: "row", gap: 24, padding: "12px 16px" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { k: "bandwidth", val: "low", label: "Low" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { k: "bandwidth", val: "medium", label: "Medium" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { k: "bandwidth", val: "high", label: "High" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { k: "bandwidth", val: "ndihx3", label: "NDI HX3" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "Stream Video Output" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: body, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: ndi.streamOut, onChange: (e) => updNdi("streamOut", e.target.value), style: sel, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "1920x1080" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "1280x720" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "3840x2160" })
                ] }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "Framerate" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: body, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: ndi.framerate, onChange: (e) => updNdi("framerate", e.target.value), style: { ...sel, minWidth: colW(4) }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "60" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "50" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "30" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "25" })
                ] }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "Encoding Type" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...body, flexDirection: "row", gap: 32, padding: "12px 20px" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { k: "encoding", val: "h264", label: "H.264" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { k: "encoding", val: "h265", label: "H.265" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: bigRow, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "Local Device Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: body, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { k: "deviceName" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "Device Channel (Camera ID)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: body, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { k: "deviceChannel" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: bigRow, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "Receive Group" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: body, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { k: "receiveGroup" }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: bigRow, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { k: "reliableUdp", label: "Reliable UDP" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: bigRow, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { k: "discoveryServer", label: "Discovery Server" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "Discovery Server Address" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: body, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { k: "discoveryAddr" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: bigRow, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { k: "multicastServer", label: "Multicast Server" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "Multicast Server Mask" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: body, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { k: "multicastMask" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: bigRow, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "Multicast Server Address" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: body, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { k: "multicastAddr" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "Multicast TTL" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: body, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { k: "multicastTtl", w: colW(3) }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 12, alignSelf: "flex-end", paddingBottom: 2 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { children: "Confirm" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Btn, { children: "Cancel" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...bigRow, borderBottom: "none" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { k: "ndiBridge", label: "NDI Bridge", extra: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 12, height: 12, borderRadius: "50%", background: "#e0322f", display: "inline-block" } }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexWrap: "wrap", gap: SP[3], flex: 1, minWidth: 0 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "NDI Bridge IP Address" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: body, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { k: "bridgeIp" }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "NDI Bridge Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: body, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { k: "bridgeName" }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "NDI Bridge Port" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: body, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { k: "bridgePort", w: colW(4) }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: card, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: head, children: "NDI Bridge Encryption Key" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: body, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Inp, { k: "bridgeKey" }) })
                ] })
              ] })
            ] })
          ] });
        })() : activeMenu === "tracking" ? (() => {
          var _a2;
          const TRK_TABS = [["presenter", "Presenter"], ["zone", "Zone"], ["hybrid", "Hybrid"], ["framing", "Framing"], ["gesture", "Gesture"], ["face", "Face Enrollment"]];
          const sec = { border: `1px solid ${T.line}`, borderRadius: 6, padding: "8px 10px", background: "rgba(0,0,0,0.12)", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 6 };
          const secTitle = { fontSize: 12.5, color: T.dim, fontWeight: 600, marginBottom: 2 };
          const sel = { boxSizing: "border-box", background: "#101216", border: `1px solid ${T.line2}`, borderRadius: 4, color: T.text, fontSize: 13, padding: "5px 8px", fontFamily: fUI, width: "100%" };
          const desc = { fontSize: 11.5, color: T.faint, lineHeight: 1.55 };
          const arrowBtn = { width: 44, height: 44, borderRadius: 8, border: `1px solid ${T.line2}`, background: "#101216", color: T.text, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };
          const secondaryBtn = { padding: "7px 16px", fontSize: 13, cursor: "pointer", borderRadius: 5, border: `1px solid ${T.line2}`, background: "#101216", color: T.text, fontFamily: fUI, whiteSpace: "nowrap" };
          const primaryBtn = { ...secondaryBtn, border: "none", background: T.blue, color: "#fff", fontWeight: 600 };
          const faceFocusCandidate = FACE_ENROLLMENT_CANDIDATES.find((candidate) => candidate.id === faceSelectFlow.candidateId);
          const faceSelectIsFocused = Boolean(faceFocusCandidate && !["ready", "restoring"].includes(faceSelectFlow.stage));
          const faceSelectZoom = faceFocusCandidate ? Math.max(1.4, Math.min(2.25, 290 / faceFocusCandidate.crop.size)) : 1;
          const faceSelectCenterX = faceFocusCandidate ? (faceFocusCandidate.crop.x + faceFocusCandidate.crop.size / 2) / FACE_ENROLLMENT_DEMO_SIZE.width * 100 : 50;
          const faceSelectCenterY = faceFocusCandidate ? (faceFocusCandidate.crop.y + faceFocusCandidate.crop.size / 2) / FACE_ENROLLMENT_DEMO_SIZE.height * 100 : 50;
          const faceSelectOrigin = faceFocusCandidate ? `${faceSelectCenterX}% ${faceSelectCenterY}%` : "50% 50%";
          const clampFaceSelectOffset = (desired, center) => {
            const zoomOverflow = faceSelectZoom - 1;
            const minimum = -(100 - center) * zoomOverflow;
            const maximum = center * zoomOverflow;
            return Math.max(minimum, Math.min(maximum, desired));
          };
          const faceSelectPan = faceFocusCandidate ? clampFaceSelectOffset(50 - faceSelectCenterX, faceSelectCenterX) : 0;
          const faceSelectTilt = faceFocusCandidate ? clampFaceSelectOffset(50 - faceSelectCenterY, faceSelectCenterY) : 0;
          const faceSelectFocusedTransform = `translate(${faceSelectPan}%, ${faceSelectTilt}%) scale(${faceSelectZoom})`;
          const faceSelectStageLabel = {
            initializing: "正在偵測人臉...",
            zooming: "正在置中臉部...",
            capturing: "正在擷取人臉...",
            saving: "正在新增人臉...",
            restoring: "已新增人臉"
          }[faceSelectFlow.stage];
          ({
            zooming: "置中",
            capturing: "Capturing",
            saving: "Updating",
            restoring: "Restoring"
          })[faceSelectFlow.stage];
          const addedFaceCandidateIds = new Set(((_a2 = trk.faceBatchResult) == null ? void 0 : _a2.addedCandidateIds) ?? []);
          const remainingEligibleFaces = FACE_ENROLLMENT_CANDIDATES.filter((candidate) => candidate.status === "eligible" && !addedFaceCandidateIds.has(candidate.id));
          const ptzIsWide = ptz.zoom <= 1.001;
          const ptzMoveButtonStyle = { ...arrowBtn, opacity: ptzIsWide ? 0.38 : 1, cursor: ptzIsWide ? "not-allowed" : "pointer" };
          const ptzHomeDisabled = ptzIsWide && Math.abs(ptz.pan) < 0.01 && Math.abs(ptz.tilt) < 0.01;
          const ptzHomeButtonStyle = { ...arrowBtn, fontSize: 15, opacity: ptzHomeDisabled ? 0.38 : 1, cursor: ptzHomeDisabled ? "not-allowed" : "pointer" };
          const TrkCheck = ({ stateKey, label, disabled = false, badge }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              disabled,
              onClick: () => updTrk(stateKey, !trk[stateKey]),
              style: { display: "flex", alignItems: "center", gap: 8, padding: 0, border: "none", background: "transparent", color: disabled ? T.faint : T.text, fontFamily: fUI, fontSize: 13, cursor: disabled ? "not-allowed" : "pointer", textAlign: "left", opacity: disabled ? 0.5 : 1 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 16, height: 16, flexShrink: 0, borderRadius: 3, border: `1.5px solid ${trk[stateKey] ? T.blue : T.line2}`, background: trk[stateKey] ? T.blue : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff" }, children: trk[stateKey] && "✓" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
                badge && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 9.5, fontWeight: 700, color: "#fff", background: T.amber, borderRadius: 3, padding: "1px 5px" }, children: badge })
              ]
            }
          );
          const TrkSlider = ({ label, stateKey, min, max }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: sec, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: secTitle, children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: fMono, color: T.blue, fontSize: 13 }, children: trk[stateKey] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min, max, value: trk[stateKey], onChange: (e) => updTrk(stateKey, parseInt(e.target.value)), className: "tr-sl", style: { "--p": (trk[stateKey] - min) / (max - min) * 100 + "%", width: "100%" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 11, color: T.faint }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: min }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: max })
            ] })
          ] });
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-tracking-wrapper", style: { width: "min(1200px, 100%)", marginInline: "auto", height: "100%", minHeight: 0, overflow: "hidden", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 10 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-trk-preview-row", style: { flex: "1 1 0", minHeight: 0, display: "flex", gap: 10, alignItems: "stretch" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-trk-preview-panel", style: { flex: "1 1 0", minWidth: 0, position: "relative", borderRadius: 10, overflow: "hidden", border: `1px solid ${T.line}`, background: "#000", minHeight: 0 }, children: [
                trk.tab === "face" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { id: "aver-face-enrollment-live-view", viewBox: `0 0 ${FACE_ENROLLMENT_DEMO_SIZE.width} ${FACE_ENROLLMENT_DEMO_SIZE.height}`, preserveAspectRatio: "xMidYMid meet", style: { width: "100%", height: "100%", display: "block", transform: faceSelectIsFocused ? faceSelectFocusedTransform : `translate(${ptz.pan}%, ${ptz.tilt}%) scale(${ptz.zoom})`, transformOrigin: faceSelectIsFocused ? faceSelectOrigin : "50% 50%", transition: "transform 1.2s cubic-bezier(0.45, 0, 0.55, 1), transform-origin 1.2s cubic-bezier(0.45, 0, 0.55, 1)" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("image", { href: FACE_ENROLLMENT_DEMO_IMAGE, x: "0", y: "0", width: FACE_ENROLLMENT_DEMO_SIZE.width, height: FACE_ENROLLMENT_DEMO_SIZE.height, preserveAspectRatio: "none" }),
                  trk.faceCaptureState === "complete" && FACE_ENROLLMENT_CANDIDATES.map((candidate) => {
                    var _a3, _b;
                    const isSelected = faceSelectFlow.candidateId === candidate.id;
                    const hideDuringFocus = faceSelectIsFocused && !isSelected;
                    if (hideDuringFocus) return null;
                    const isAdded = (_b = (_a3 = trk.faceBatchResult) == null ? void 0 : _a3.addedCandidateIds) == null ? void 0 : _b.includes(candidate.id);
                    const isValidSelectFace = candidate.status === "eligible";
                    const libraryFull = trk.enrolledFaces.length >= 20;
                    const blockedByLibraryFull = libraryFull && isValidSelectFace;
                    const isSelectable = false;
                    const shouldPulse = isSelectable;
                    const color = blockedByLibraryFull ? T.faint : isValidSelectFace ? T.blue : "#e24b4b";
                    const label = blockedByLibraryFull ? "Library full" : isValidSelectFace ? isAdded ? "Enrolled" : "Eligible" : candidate.label;
                    const { x: x2, y: y2, size } = candidate.crop;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "g",
                      {
                        id: `aver-face-box-${candidate.id}`,
                        role: void 0,
                        tabIndex: void 0,
                        "aria-label": isValidSelectFace ? `${label}: ${candidate.id}` : `${candidate.label}; face cannot be enrolled`,
                        onClick: () => isSelectable,
                        onKeyDown: (event) => {
                        },
                        onMouseEnter: () => isSelectable,
                        onMouseLeave: () => setHoveredFaceCandidateId((current) => current === candidate.id ? null : current),
                        style: { cursor: "default", pointerEvents: "all", opacity: faceSelectFlow.stage === "restoring" && isSelected ? 0.7 : 1, filter: "none", transition: "filter 160ms ease" },
                        children: [
                          shouldPulse,
                          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: x2, y: y2, width: size, height: size, fill: "rgba(23,145,236,0.001)", stroke: color, strokeWidth: "5", vectorEffect: "non-scaling-stroke" }),
                          (isValidSelectFace || blockedByLibraryFull) && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: x2, y: Math.max(0, y2 - 30), width: size, height: "30", fill: color, opacity: "0.94" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: x2 + 9, y: Math.max(21, y2 - 9), fill: "#fff", fontSize: "18", fontWeight: "700", fontFamily: fUI, children: label })
                          ] }),
                          false
                        ]
                      },
                      candidate.id
                    );
                  })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", inset: 0, backgroundImage: "url(meeting_room.png)", backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center", transform: `translate(${ptz.pan}%, ${ptz.tilt}%) scale(${ptz.zoom * 1.65})`, transition: "transform 0.1s ease-out" } }),
                trk.tab === "face" && (trk.faceCaptureState === "complete" && faceSelectFlow.stage === "ready" || faceSelectFlow.stage === "capturing" || faceSelectFlow.stage === "saving") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    id: "aver-face-frozen-frame-state",
                    role: "status",
                    "aria-live": "polite",
                    style: { position: "absolute", top: 12, left: 12, zIndex: 4, minHeight: 26, padding: "0 8px", display: "flex", alignItems: "center", gap: 6, borderRadius: 5, border: `1px solid ${T.line2}`, background: "rgba(8,11,15,0.88)", boxShadow: "0 4px 14px rgba(0,0,0,0.32)", color: "#fff", fontSize: 10.5, fontWeight: 700, letterSpacing: 0.2, pointerEvents: "none" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", style: { width: 6, height: 6, borderRadius: "50%", background: T.faint } }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "FROZEN FRAME" })
                    ]
                  }
                ),
                false,
                trk.tab === "face" && trk.faceCaptureState === "loading" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-face-enrollment-loading", role: "status", "aria-live": "polite", style: { position: "absolute", inset: 0, background: "rgba(5,7,9,0.68)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, color: "#fff", zIndex: 2 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "aver-spinner", "aria-hidden": "true", style: { width: 34, height: 34, boxSizing: "border-box", borderRadius: "50%", border: "3px solid rgba(255,255,255,0.26)", borderTopColor: T.blue } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 14, fontWeight: 600 }, children: "Detecting faces..." })
                ] }),
                trk.tab === "face" && faceSelectStageLabel && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-face-recapture-progress", role: "status", "aria-live": "polite", style: { position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 6, background: "rgba(8,10,13,0.88)", border: `1px solid ${T.line2}`, color: "#fff", fontSize: 12.5, fontWeight: 600, zIndex: 3, pointerEvents: "none" }, children: [
                  faceSelectFlow.stage !== "restoring" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "aver-spinner", "aria-hidden": "true", style: { width: 15, height: 15, boxSizing: "border-box", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.25)", borderTopColor: T.blue } }),
                  faceSelectStageLabel
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-trk-ptz-control-panel", style: { flexShrink: 0, alignSelf: "flex-start", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 10, background: T.panel, border: `1px solid ${T.line}`, borderRadius: 10, padding: 16 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 14 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "44px 44px 44px", gridTemplateRows: "44px 44px 44px", gap: 6, justifyContent: "center" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-ptz-up-button", type: "button", "aria-label": "Tilt up", disabled: ptzIsWide, onClick: () => handlePtz("up"), style: ptzMoveButtonStyle, children: "▲" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-ptz-left-button", type: "button", "aria-label": "Pan left", disabled: ptzIsWide, onClick: () => handlePtz("left"), style: ptzMoveButtonStyle, children: "◀" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-ptz-home-button", type: "button", "aria-label": "Reset PTZ view", disabled: ptzHomeDisabled, onClick: () => handlePtz("home"), style: ptzHomeButtonStyle, children: "⌂" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-ptz-right-button", type: "button", "aria-label": "Pan right", disabled: ptzIsWide, onClick: () => handlePtz("right"), style: ptzMoveButtonStyle, children: "▶" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-ptz-down-button", type: "button", "aria-label": "Tilt down", disabled: ptzIsWide, onClick: () => handlePtz("down"), style: ptzMoveButtonStyle, children: "▼" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {})
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, justifyContent: "center" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color: T.dim }, children: "Zoom" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-ptz-zoom-in-button", type: "button", "aria-label": "Zoom in", disabled: ptz.zoom >= 3, onClick: () => handlePtz("zoom_in"), style: { ...arrowBtn, opacity: ptz.zoom >= 3 ? 0.38 : 1, cursor: ptz.zoom >= 3 ? "not-allowed" : "pointer" }, children: "＋" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-ptz-zoom-out-button", type: "button", "aria-label": "Zoom out", disabled: ptzIsWide, onClick: () => handlePtz("zoom_out"), style: ptzMoveButtonStyle, children: "－" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-save-preset-button", style: { padding: "10px 0", fontSize: 13.5, fontWeight: 600, cursor: "pointer", borderRadius: 6, border: `1px solid ${T.line2}`, background: "#101216", color: T.text, fontFamily: fUI }, children: "Save to Preset 1" }),
                trk.tab === "face" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-ptz-face-enrollment-section", style: { display: "flex", flexDirection: "column", gap: 8, paddingTop: 10, borderTop: `1px solid ${T.line}` }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-ptz-face-enrollment-header", style: { display: "flex", alignItems: "center", gap: 6 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-ptz-face-enrollment-title", style: { fontSize: 12, fontWeight: 600, color: T.dim }, children: "Face Enrollment" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        id: "aver-face-enrollment-information-button",
                        type: "button",
                        "aria-label": "Open face enrollment guide",
                        title: "Face enrollment guide",
                        onClick: () => setFaceEnrollmentTourOpen(true),
                        style: { width: 18, height: 18, padding: 0, borderRadius: "50%", border: `1px solid ${T.faint}`, background: "transparent", color: T.dim, fontFamily: fUI, fontSize: 11, fontWeight: 700, lineHeight: 1, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" },
                        children: "i"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      id: trk.faceCaptureState === "complete" ? "aver-face-resume-live-button" : "aver-face-detect-button",
                      onClick: trk.faceCaptureState === "complete" ? resumeFaceEnrollmentLiveView : startFaceBatchEnrollment,
                      disabled: trk.faceCaptureState === "loading" || faceSelectFlow.stage !== "ready",
                      style: { ...primaryBtn, width: "100%", padding: "8px 8px", opacity: trk.faceCaptureState === "loading" || faceSelectFlow.stage !== "ready" ? 0.48 : 1, cursor: trk.faceCaptureState === "loading" || faceSelectFlow.stage !== "ready" ? "not-allowed" : "pointer" },
                      children: trk.faceCaptureState === "complete" ? "Resume Live" : "Detect Faces"
                    }
                  ),
                  trk.faceCaptureState === "complete" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      id: "aver-face-add-all-eligible-button",
                      type: "button",
                      onClick: addAllEligibleFaces,
                      disabled: faceSelectFlow.stage !== "ready" || trk.enrolledFaces.length >= 20 || remainingEligibleFaces.length === 0,
                      style: { ...secondaryBtn, width: "100%", padding: "8px 8px", opacity: faceSelectFlow.stage !== "ready" || trk.enrolledFaces.length >= 20 || remainingEligibleFaces.length === 0 ? 0.48 : 1, cursor: faceSelectFlow.stage !== "ready" || trk.enrolledFaces.length >= 20 || remainingEligibleFaces.length === 0 ? "not-allowed" : "pointer" },
                      children: "Add All Eligible Faces"
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-trk-control-panel", style: { width: "min(1200px, 100%)", flex: "0 0 350px", height: 350, minHeight: 0, background: T.panel, border: `1px solid ${T.line}`, borderRadius: 10, display: "flex", flexDirection: "column", overflow: "hidden" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-trk-tab-bar", style: { display: "flex", borderBottom: `1px solid ${T.line}` }, children: TRK_TABS.map(([id2, lb2]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  id: `aver-trk-tab-${id2}`,
                  onClick: () => updTrk("tab", id2),
                  style: { flex: "1 1 0", minWidth: 0, padding: "9px 6px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", border: "none", background: trk.tab === id2 ? T.blue : "transparent", color: trk.tab === id2 ? "#fff" : T.dim, fontFamily: fUI, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, whiteSpace: "nowrap" },
                  children: [
                    lb2,
                    id2 === "gesture" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, fontWeight: 700, color: "#fff", background: T.amber, borderRadius: 3, padding: "1px 5px" }, children: "Beta" })
                  ]
                },
                id2
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-trk-tab-content", style: { flex: 1, minHeight: 0, overflowY: "auto", padding: 8 }, children: trk.tab === "presenter" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, alignItems: "start" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: sec, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: secTitle, children: "Tracking Sensitivity" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: fMono, color: T.blue, fontSize: 13 }, children: trk.sensitivity })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: 1, max: 3, value: trk.sensitivity, onChange: (e) => updTrk("sensitivity", parseInt(e.target.value)), className: "tr-sl", style: { "--p": (trk.sensitivity - 1) / 2 * 100 + "%", width: "100%" } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 11, color: T.faint }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "1" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "3" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: sec, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: secTitle, children: "Time of Return to Tracking Point" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: fMono, color: T.blue, fontSize: 13 }, children: trk.returnTime })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: 3, max: 10, value: trk.returnTime, onChange: (e) => updTrk("returnTime", parseInt(e.target.value)), className: "tr-sl", style: { "--p": (trk.returnTime - 3) / 7 * 100 + "%", width: "100%" } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 11, color: T.faint }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "3" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "10" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: sec, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrkCheck, { stateKey: "multiPresenterTracking", label: "Multi-Presenter Tracking", badge: "Beta" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: sec, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => updTrk("effectiveArea", !trk.effectiveArea), style: { display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 16, height: 16, borderRadius: 3, border: `1.5px solid ${trk.effectiveArea ? T.blue : T.line2}`, background: trk.effectiveArea ? T.blue : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff" }, children: trk.effectiveArea && "✓" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13, color: T.text }, children: "Effective Tracking Area" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: { padding: "5px 14px", fontSize: 12.5, cursor: "pointer", borderRadius: 4, border: `1px solid ${T.line2}`, background: "#101216", color: T.text, fontFamily: fUI }, children: "Set" })
                  ] }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: sec, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: secTitle, children: "Tracking Point" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10, alignItems: "center" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: trk.presetPoint, onChange: (e) => updTrk("presetPoint", e.target.value), style: { ...sel, flex: 1 } }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { style: { padding: "7px 16px", fontSize: 13, cursor: "pointer", borderRadius: 4, border: `1px solid ${T.line2}`, background: "#101216", color: T.text, fontFamily: fUI }, children: "Save" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 4 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...secTitle, marginBottom: 4 }, children: "People Size" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: trk.peopleSize, onChange: (e) => updTrk("peopleSize", e.target.value), style: sel, children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Upper Body" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Full Body" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Close Up" })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...secTitle, marginBottom: 4 }, children: "Placement" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: trk.placement, onChange: (e) => updTrk("placement", e.target.value), style: sel, children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Center" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Left" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Right" })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...secTitle, marginBottom: 4 }, children: "Height" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: trk.height, onChange: (e) => updTrk("height", e.target.value), style: sel, children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Height1" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Height2" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Height3" })
                        ] })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: sec, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 24 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TrkCheck, { stateKey: "autoZoom", label: "Auto Zoom" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TrkCheck, { stateKey: "autoTilt", label: "Auto Tilt" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: desc, children: "When Auto Zoom is off, camera stops zooming in/out automatically and shoots the presenter according to the shot size of the preset you choose." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: trk.autoZoomPreset, onChange: (e) => updTrk("autoZoomPreset", e.target.value), style: sel, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Preset 1" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Preset 2" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Preset 3" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: sec, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { display: "flex", alignItems: "center", gap: 6, ...secTitle }, children: [
                      "Multi-Presenter Detection ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: T.faint, fontSize: 11 }, children: "ⓘ" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: desc, children: "When two or more people appear, the camera moves to the “Multi-Person Preset Point” to include everyone. Select a preset point wide enough to cover the scene." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: trk.multiPresenter, onChange: (e) => updTrk("multiPresenter", e.target.value), style: sel, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "off", children: "Off" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "preset1", children: "Preset 1" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "preset2", children: "Preset 2" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: sec, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: secTitle, children: "Set Shield Zone" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => updTrk("shieldZone", true), style: { ...primaryBtn, flex: 1 }, children: "Set" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => updTrk("shieldZone", false), style: { ...secondaryBtn, flex: 1 }, children: "Clear" })
                    ] })
                  ] })
                ] })
              ] }) : trk.tab === "zone" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-tracking-zone-panel", style: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: SP[3], alignItems: "start" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-tracking-zone-sliders-column", style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TrkSlider, { label: "Tracking Sensitivity", stateKey: "sensitivity", min: 1, max: 3 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TrkSlider, { label: "Time of Return to Tracking Point", stateKey: "returnTime", min: 3, max: 10 })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-tracking-zone-point", style: sec, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: secTitle, children: "Tracking Point" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("select", { id: "aver-tracking-zone-point-select", value: trk.zoneTrackingPoint, onChange: (e) => updTrk("zoneTrackingPoint", e.target.value), style: sel, children: Array.from({ length: 10 }, (_, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: `Preset ${index}` }, index)) })
                ] })
              ] }) : trk.tab === "hybrid" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: SP[3], alignItems: "start" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: sec, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: secTitle, children: "Tracking Priority" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: trk.hybridPriority, onChange: (e) => updTrk("hybridPriority", e.target.value), style: sel, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Presenter" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Zone" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Last Active Target" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: desc, children: "Choose which signal takes priority when presenter and zone tracking are both available." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: sec, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: secTitle, children: "Fallback Position" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: trk.hybridFallback, onChange: (e) => updTrk("hybridFallback", e.target.value), style: sel, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Zone 1" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Zone 2" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Preset 1" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Tracking Point" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: desc, children: "The camera returns here after the active presenter leaves the frame." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrkSlider, { label: "Target Hold Time", stateKey: "hybridHoldTime", min: 1, max: 10 })
              ] }) : trk.tab === "framing" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: SP[3], alignItems: "start" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: sec, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: secTitle, children: "Framing Mode" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: trk.framingMode, onChange: (e) => updTrk("framingMode", e.target.value), style: sel, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Auto Framing" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Single Person" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Group" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TrkCheck, { stateKey: "groupFraming", label: "Include everyone in frame" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: sec, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: secTitle, children: "Target Size" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: trk.framingSize, onChange: (e) => updTrk("framingSize", e.target.value), style: sel, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Close" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Medium" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Wide" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: desc, children: "Controls the amount of headroom and surrounding context kept around detected people." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrkSlider, { label: "Framing Speed", stateKey: "framingSpeed", min: 1, max: 10 })
              ] }) : trk.tab === "gesture" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: SP[3], alignItems: "start" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: sec, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: secTitle, children: "Gesture Control" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, fontWeight: 700, color: "#fff", background: T.amber, borderRadius: 3, padding: "2px 6px" }, children: "Beta" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TrkCheck, { stateKey: "gestureEnabled", label: "Enable gesture commands" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: desc, children: "Allow supported hand gestures to start or stop tracking without using the web interface." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrkSlider, { label: "Gesture Confirmation Time", stateKey: "gestureTimeout", min: 2, max: 10 }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: sec, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TrkCheck, { stateKey: "gestureFeedback", label: "Show recognition feedback", disabled: !trk.gestureEnabled }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: desc, children: "A temporary status indicator appears in Live View when a gesture is recognized." })
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-face-enrollment", style: { height: "100%", minHeight: 0, display: "flex" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-face-enrollment-action-panel", "aria-hidden": "true", style: { display: "none" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-face-enrollment-action-header", style: { display: "flex", alignItems: "center", gap: 6 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13.5, fontWeight: 600, color: T.text }, children: "Face Enrollment" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          id: "aver-face-enrollment-information-button-legacy",
                          type: "button",
                          "aria-label": "Open face enrollment guide",
                          title: "Face enrollment guide",
                          onClick: () => setFaceEnrollmentTourOpen(true),
                          style: { width: 18, height: 18, padding: 0, borderRadius: "50%", border: `1px solid ${T.faint}`, background: "transparent", color: T.dim, fontFamily: fUI, fontSize: 11, fontWeight: 700, lineHeight: 1, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" },
                          children: "i"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-face-add-face-hint", style: { display: "flex", alignItems: "flex-start", gap: 7, padding: "8px 9px", borderRadius: 5, border: `1px solid ${T.line}`, background: "#111419", color: T.dim, fontSize: 11.5, lineHeight: 1.4 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", style: { color: T.blue, fontWeight: 700 }, children: "◎" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: trk.faceCaptureState === "complete" ? "Use Add Face on a blue frame for a closer capture." : trk.faceCaptureState === "loading" ? "Capturing a frozen frame and detecting eligible faces…" : "Click Detect Faces to find eligible faces." })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-enrolled-face-panel", style: { flex: "1 1 0", minWidth: 0, minHeight: 0, padding: 4, display: "flex", flexDirection: "column", gap: 8 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-face-enrollment-header", style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "baseline", gap: 10, minWidth: 0 }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { id: "aver-enrolled-face-count", style: { fontSize: 16, fontWeight: 500, color: T.text, whiteSpace: "nowrap" }, children: [
                          "Enrolled Face (",
                          trk.enrolledFaces.length,
                          "/20)"
                        ] }),
                        trk.enrolledFaces.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { id: "aver-enrolled-face-management-hint", style: { fontSize: 11.5, color: T.faint }, children: "Drag cards to reorder" })
                      ] }),
                      trk.enrolledFaces.length >= 20 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { id: "aver-enrolled-face-library-full-status", role: "status", style: { padding: "4px 8px", borderRadius: 4, border: "1px solid rgba(245,166,35,0.42)", background: "rgba(245,166,35,0.10)", color: "#f5b74f", fontSize: 11.5, fontWeight: 600, whiteSpace: "nowrap" }, children: "Face library is full" })
                    ] }),
                    trk.enrolledFaces.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-face-enrollment-empty-state", style: { flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 9 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-face-enrollment-empty-icon", "aria-label": "No enrolled faces", style: { width: 78, height: 78, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.06)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", style: { color: T.faint, fontSize: 9, fontWeight: 600, letterSpacing: "0.06em" }, children: "ICON" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 12, color: T.faint }, children: "No faces enrolled yet" })
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        id: "aver-enrolled-face-list",
                        "aria-label": "Enrolled face list",
                        style: {
                          flex: 1,
                          minHeight: 0,
                          overflowY: "auto",
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fill, 104px)",
                          gridAutoRows: "126px",
                          alignContent: "start",
                          justifyContent: "start",
                          gap: 0,
                          paddingTop: 2
                        },
                        children: Array.from({ length: 20 }, (_, index) => {
                          const face = trk.enrolledFaces[index];
                          const order = String(index + 1).padStart(2, "0");
                          const slotStyle = {
                            width: 104,
                            height: 126,
                            position: "relative",
                            boxSizing: "border-box",
                            padding: "6px 6px 4px",
                            borderRight: "1px dashed rgba(93,108,124,0.20)",
                            borderBottom: "1px dashed rgba(93,108,124,0.20)"
                          };
                          const slotPlaceholder = /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              "aria-hidden": "true",
                              style: { position: "absolute", inset: "5px 7px 8px 5px", borderRadius: 6, border: "1px solid rgba(93,108,124,0.22)", background: "rgba(6,8,11,0.13)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.012)", pointerEvents: "none" }
                            }
                          );
                          if (!face) {
                            return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: `aver-enrolled-face-slot-${order}`, style: slotStyle, children: slotPlaceholder }, `empty-face-slot-${order}`);
                          }
                          const isDragging2 = draggedFaceId === face.id;
                          const isEditing = editingFaceId === face.id;
                          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: `aver-enrolled-face-slot-${order}`, style: slotStyle, children: [
                            slotPlaceholder,
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "div",
                              {
                                id: `aver-enrolled-face-card-${order}`,
                                "data-face-id": face.id,
                                draggable: false,
                                onPointerDown: (event) => !isEditing && startFacePointerDrag(event, face.id),
                                onPointerMove: moveFacePointerDrag,
                                onPointerUp: finishFacePointerDrag,
                                onPointerCancel: finishFacePointerDrag,
                                style: { position: "relative", zIndex: 1, width: 92, minWidth: 92, display: "flex", flexDirection: "column", gap: 3, padding: 2, margin: -2, boxSizing: "content-box", borderRadius: 4, background: isEditing ? "rgba(30,155,240,0.10)" : isDragging2 ? "rgba(30,155,240,0.05)" : "transparent", outline: isEditing ? `1px solid ${T.blue}` : isDragging2 ? "1px dashed rgba(30,155,240,0.65)" : "1px solid transparent", opacity: isDragging2 ? 0.18 : 1, cursor: isDragging2 ? "grabbing" : isEditing ? "text" : "grab", touchAction: isEditing ? "auto" : "none", userSelect: "none", transition: "opacity 0.16s ease, background 0.16s ease, outline-color 0.16s ease" },
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: `aver-enrolled-face-photo-${order}`, "aria-label": `Enrolled face ${index + 1}`, style: { width: 92, height: 92, boxSizing: "border-box", position: "relative", overflow: "hidden", border: `1px solid ${isEditing ? T.blue : T.line2}`, backgroundColor: "rgba(23,145,236,0.12)" }, children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(FaceEnrollmentCrop, { candidateId: face.candidateId, label: `Face ${index + 1} photo${face.liveCapturedAt ? ", live capture" : ""}`, recaptured: Boolean(face.liveCapturedAt) }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      "select",
                                      {
                                        id: `aver-enrolled-face-priority-${order}`,
                                        title: "Change priority",
                                        "aria-label": `Change priority, currently P${order}`,
                                        value: index + 1,
                                        draggable: false,
                                        onDragStart: (event) => event.preventDefault(),
                                        onPointerDown: (event) => event.stopPropagation(),
                                        onClick: (event) => event.stopPropagation(),
                                        onChange: (event) => setEnrolledFacePriority(face.id, Number(event.target.value)),
                                        style: { position: "absolute", top: 3, left: 3, width: 42, height: 18, padding: "0 2px 0 4px", outline: "none", borderRadius: 3, border: "1px solid rgba(255,255,255,0.22)", background: "rgba(8,10,13,0.78)", color: "#fff", fontFamily: fUI, fontSize: 9.5, fontWeight: 700, lineHeight: 1, cursor: "pointer", textShadow: "0 1px 3px #000" },
                                        children: trk.enrolledFaces.map((_2, priorityIndex) => {
                                          const priority = priorityIndex + 1;
                                          return /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: priority, children: [
                                            "P",
                                            String(priority).padStart(2, "0")
                                          ] }, priority);
                                        })
                                      }
                                    ),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      "button",
                                      {
                                        id: `aver-enrolled-face-delete-${order}`,
                                        type: "button",
                                        draggable: false,
                                        "aria-label": `Delete face ${index + 1}`,
                                        onDragStart: (event) => event.preventDefault(),
                                        onClick: (event) => {
                                          event.stopPropagation();
                                          setFaceDeleteTarget({ id: face.id, name: face.name, order: index + 1 });
                                        },
                                        style: { position: "absolute", top: 3, right: 3, width: 18, height: 18, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 3, border: "1px solid rgba(255,255,255,0.26)", background: "rgba(8,10,13,0.82)", color: "#ff6b6b", fontFamily: fUI, fontSize: 14, lineHeight: 1, cursor: "pointer" },
                                        children: "×"
                                      }
                                    )
                                  ] }),
                                  isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: `aver-enrolled-face-name-edit-state-${order}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    "input",
                                    {
                                      id: `aver-enrolled-face-name-input-${order}`,
                                      "aria-label": `Edit name for face ${index + 1}`,
                                      autoFocus: true,
                                      value: editingFaceName,
                                      placeholder: "Unnamed",
                                      onChange: (event) => setEditingFaceName(event.target.value),
                                      onBlur: () => finishInlineFaceNameEdit(true),
                                      onKeyDown: (event) => {
                                        if (event.key === "Enter") finishInlineFaceNameEdit(true);
                                        if (event.key === "Escape") finishInlineFaceNameEdit(false);
                                      },
                                      style: { width: "100%", height: 23, boxSizing: "border-box", padding: "3px 5px", borderRadius: 3, border: `1px solid ${T.blue}`, outline: "none", background: "#0f1216", color: T.text, fontFamily: fUI, fontSize: 11.5 }
                                    }
                                  ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    "button",
                                    {
                                      id: `aver-enrolled-face-name-${order}`,
                                      type: "button",
                                      title: "Click to rename",
                                      onClick: () => startInlineFaceNameEdit(face),
                                      style: { width: "100%", minWidth: 0, padding: "2px 1px", border: "none", borderRadius: 3, background: "transparent", color: face.name ? T.text : T.faint, fontFamily: fUI, fontSize: 12, lineHeight: 1.25, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "text" },
                                      children: face.name || "Unnamed"
                                    }
                                  )
                                ]
                              }
                            )
                          ] }, face.id);
                        })
                      }
                    )
                  ] })
                ] }),
                faceEnrollmentTourOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-face-enrollment-tour-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "aver-face-enrollment-tour-title", style: { position: "fixed", inset: 0, zIndex: 75, padding: 16, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-face-enrollment-tour-dialog", style: { width: "min(680px, calc(100vw - 32px))", maxHeight: "calc(100vh - 32px)", overflow: "hidden", borderRadius: 10, border: `1px solid ${T.line2}`, background: "#101216", boxShadow: "0 22px 64px rgba(0,0,0,0.58)", display: "flex", flexDirection: "column" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-face-enrollment-tour-header", style: { minHeight: 48, padding: "0 14px 0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${T.line2}` }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-face-enrollment-tour-title", style: { color: T.text, fontSize: 16, fontWeight: 600 }, children: "Face Enrollment Guide" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 2, color: T.faint, fontSize: 11.5 }, children: "Understand face eligibility, batch enrollment, and priority." })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-face-enrollment-tour-close-button", type: "button", "aria-label": "Close face enrollment guide", onClick: () => setFaceEnrollmentTourOpen(false), style: { width: 30, height: 30, padding: 0, borderRadius: 5, border: "none", background: "transparent", color: T.dim, fontFamily: fUI, fontSize: 20, cursor: "pointer" }, children: "×" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-face-enrollment-tour-content", style: { minHeight: 0, overflow: "hidden", padding: 14, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-face-enrollment-tour-blue-frame", style: { minWidth: 0, padding: 10, borderRadius: 8, border: "1px solid rgba(30,155,240,0.32)", background: "rgba(30,155,240,0.06)" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 110, padding: 8, boxSizing: "border-box", borderRadius: 6, background: "#090b0f", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: 90, height: 90, position: "relative", overflow: "hidden" }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(FaceEnrollmentCrop, { candidateId: "front-center", label: "Eligible front-facing person" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", style: { position: "absolute", inset: 5, border: `3px solid ${T.blue}`, boxSizing: "border-box" } })
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 8, color: T.blue, fontSize: 12.5, fontWeight: 700 }, children: "Blue frame · Eligible face" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 4, color: T.dim, fontSize: 11.5, lineHeight: 1.4 }, children: "The face is front-facing, clear, and large enough. Select Add All Eligible Faces to add every blue-framed face." })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-face-enrollment-tour-red-frame", style: { minWidth: 0, padding: 10, borderRadius: 8, border: "1px solid rgba(239,83,80,0.30)", background: "rgba(239,83,80,0.05)" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 110, padding: 8, boxSizing: "border-box", borderRadius: 6, background: "#090b0f", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: 90, height: 90, position: "relative", overflow: "hidden" }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(FaceEnrollmentCrop, { candidateId: "side-profile", label: "Ineligible side-facing person" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", style: { position: "absolute", inset: 5, border: "3px solid #ef5350", boxSizing: "border-box" } })
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 8, color: "#ef6c68", fontSize: 12.5, fontWeight: 700 }, children: "Red frame · Cannot enroll" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 4, color: T.dim, fontSize: 11.5, lineHeight: 1.4 }, children: "Red-framed faces are not eligible and are excluded from enrollment. Live View does not display a specific error reason." })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-face-enrollment-tour-recapture", "aria-hidden": "true", style: { display: "none" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-face-enrollment-tour-recapture-example", "aria-label": "Select Add Face on the batch face to create another face record", style: { width: "100%", minWidth: 0, height: 88, padding: 7, boxSizing: "border-box", borderRadius: 6, border: `1px solid ${T.line}`, background: "#090b0f", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: 74, height: 74, position: "relative", overflow: "hidden", border: `2px solid ${T.blue}`, boxSizing: "border-box" }, children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(FaceEnrollmentCrop, { candidateId: "front-center", label: "Original batch capture" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { position: "absolute", left: 3, top: 3, padding: "2px 4px", borderRadius: 3, background: "rgba(8,10,13,0.78)", color: T.dim, fontSize: 8.5, fontWeight: 700 }, children: "BATCH" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", style: { color: T.blue, fontSize: 20, fontWeight: 700 }, children: "→" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: 74, height: 74, position: "relative", overflow: "hidden", border: `2px solid ${T.blue}`, boxSizing: "border-box" }, children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(FaceEnrollmentCrop, { candidateId: "front-center", label: "Closer PTZ live capture", recaptured: true }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { position: "absolute", left: 3, top: 3, padding: "2px 4px", borderRadius: 3, background: "rgba(8,10,13,0.78)", color: "#fff", fontSize: 8.5, fontWeight: 700 }, children: "PTZ" })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { minWidth: 0 }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: T.blue, fontSize: 13, fontWeight: 700 }, children: "Add Face" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 4, color: T.dim, fontSize: 11.5, lineHeight: 1.4 }, children: "Select Add Face on a blue frame. The camera returns to Live View, centers and zooms to the person, then adds a new face record. The original batch record remains unchanged." })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-face-enrollment-tour-priority-order", style: { gridColumn: "1 / -1", minWidth: 0, padding: 10, borderRadius: 8, border: `1px solid ${T.line2}`, background: "rgba(255,255,255,0.025)", display: "grid", gridTemplateColumns: "270px minmax(0, 1fr)", alignItems: "center", columnGap: 14 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-face-enrollment-tour-priority-example", "aria-label": "Example of enrolled face cards ordered by priority", style: { width: "100%", minWidth: 0, boxSizing: "border-box", padding: 7, borderRadius: 6, border: `1px solid ${T.line}`, background: "#171a1f" }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: 5, color: T.text, fontSize: 11.5, fontWeight: 600 }, children: "Enrolled Face (3/20)" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", alignItems: "flex-start", gap: 7 }, children: [
                          { priority: "P01", candidateId: "front-left", name: "Emma" },
                          { priority: "P02", candidateId: "front-center", name: "James" },
                          { priority: "P03", candidateId: "front-right", name: "Sophia" }
                        ].map((card) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: 76, minWidth: 0 }, children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: 76, height: 70, position: "relative", overflow: "hidden", border: `1px solid ${T.line2}`, boxSizing: "border-box", background: "rgba(23,145,236,0.12)" }, children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(FaceEnrollmentCrop, { candidateId: card.candidateId, label: `${card.name}, ${card.priority}` }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { position: "absolute", top: 3, left: 3, padding: "2px 4px", borderRadius: 3, border: "1px solid rgba(255,255,255,0.22)", background: "rgba(8,10,13,0.78)", color: "#fff", fontSize: 9, fontWeight: 700, lineHeight: 1 }, children: [
                              card.priority,
                              " ▾"
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", style: { position: "absolute", top: 3, right: 3, width: 14, height: 14, borderRadius: 2, border: "1px solid rgba(255,255,255,0.25)", background: "rgba(8,10,13,0.82)", color: "#ff6b6b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, lineHeight: 1 }, children: "×" })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { paddingTop: 3, color: T.dim, fontSize: 10.5, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: card.name })
                        ] }, card.priority)) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { minWidth: 0 }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: T.text, fontSize: 13, fontWeight: 700 }, children: "Priority order" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 4, color: T.dim, fontSize: 11.5, lineHeight: 1.4 }, children: "P01 is the highest priority. Drag a face card to another position to change its priority; the remaining cards will reorder automatically." })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-face-enrollment-tour-footer", style: { padding: "10px 14px", display: "flex", justifyContent: "flex-end", borderTop: `1px solid ${T.line2}`, background: "rgba(255,255,255,0.018)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-face-enrollment-tour-confirm-button", type: "button", onClick: () => setFaceEnrollmentTourOpen(false), style: { ...primaryBtn, minWidth: 92 }, children: "Got it" }) })
                ] }) }),
                faceDragOverlay && (() => {
                  const overlayFace = trk.enrolledFaces.find((face) => face.id === faceDragOverlay.faceId);
                  if (!overlayFace) return null;
                  const overlayIndex = trk.enrolledFaces.findIndex((face) => face.id === overlayFace.id);
                  const overlayOrder = String(overlayIndex + 1).padStart(2, "0");
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      id: "aver-face-drag-overlay",
                      "aria-hidden": "true",
                      style: { position: "fixed", left: faceDragOverlay.x, top: faceDragOverlay.y, width: 96, zIndex: 80, pointerEvents: "none", padding: 4, boxSizing: "border-box", borderRadius: 6, background: "rgba(16,18,22,0.96)", border: `1px solid ${T.blue}`, boxShadow: "0 14px 34px rgba(0,0,0,0.55), 0 0 0 2px rgba(30,155,240,0.16)", transform: "rotate(-2deg) scale(1.04)", transformOrigin: "center", animation: "averFaceDragLift 140ms cubic-bezier(0.2, 0.8, 0.2, 1)" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { width: 86, height: 86, position: "relative", overflow: "hidden", border: `1px solid ${T.line2}`, boxSizing: "border-box" }, children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(FaceEnrollmentCrop, { candidateId: overlayFace.candidateId, label: "Dragging face" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { position: "absolute", top: 3, left: 3, color: "#fff", fontSize: 10, fontWeight: 700, lineHeight: 1, textShadow: "0 1px 3px #000" }, children: overlayOrder })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", paddingTop: 4, color: overlayFace.name ? T.text : T.faint, fontSize: 11.5, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: overlayFace.name || "Unnamed" })
                      ]
                    }
                  );
                })(),
                false,
                faceDeleteTarget && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-face-delete-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "aver-face-delete-title", style: { position: "fixed", inset: 0, zIndex: 60, padding: 24, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-face-delete-dialog", style: { width: "min(390px, calc(100vw - 48px))", overflow: "hidden", background: "#101216", border: `1px solid ${T.line2}`, borderRadius: 10, boxShadow: "0 20px 60px rgba(0,0,0,0.55)" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-face-delete-title", style: { padding: "17px 18px 12px", color: T.text, fontSize: 16, fontWeight: 600 }, children: "Delete enrolled face?" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "0 18px 18px", color: T.dim, fontSize: 13, lineHeight: 1.55 }, children: [
                    faceDeleteTarget.name ? `“${faceDeleteTarget.name}”` : `Face ${String(faceDeleteTarget.order).padStart(2, "0")}`,
                    " will be removed."
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "flex-end", gap: 9, padding: "12px 16px", borderTop: `1px solid ${T.line2}`, background: "rgba(255,255,255,0.02)" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-face-delete-cancel-button", type: "button", onClick: () => setFaceDeleteTarget(null), style: secondaryBtn, children: "Cancel" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-face-delete-confirm-button", type: "button", onClick: confirmFaceDelete, style: secondaryBtn, children: "Delete" })
                  ] })
                ] }) })
              ] }) })
            ] })
          ] });
        })() : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-video-audio-wrapper", style: { display: "flex", flexDirection: "column", gap: SP[3], width: "min(calc(75vw - 40px), 100%)", marginLeft: "max(0px, calc(16.6667vw - 225.33px))", height: "100%", overflowY: "auto", paddingRight: 8, boxSizing: "border-box" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 14, width: "100%" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 10, width: "100%" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Power Frequency", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 24, padding: "4px 0" }, children: ["50Hz", "59.94Hz", "60Hz"].map((f2) => /* @__PURE__ */ jsxRuntimeExports.jsx(VerticalRadio, { label: f2, checked: videoSettings.powerFreq === f2, onChange: () => updVideo("powerFreq", f2) }, f2)) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Video Output Resolution", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Select,
              {
                val: videoSettings.videoOutRes,
                options: ["1080μP/59", "1080p/60", "1080p/50", "1080p/30", "720p/60", "720p/59.94"],
                onChange: (v2) => updVideo("videoOutRes", v2),
                style: { width: "100%", background: "#202328", border: `1.5px solid ${T.line2}`, borderRadius: 4, padding: "6px 12px" }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Theme Mode", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Select,
              {
                val: videoSettings.themeMode,
                options: ["Standard", "Dark", "Light"],
                onChange: (v2) => updVideo("themeMode", v2),
                style: { width: "100%", background: "#202328", border: `1.5px solid ${T.line2}`, borderRadius: 4, padding: "6px 12px" }
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ConfigCard, { title: "Stream Video Output", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Stream Video Output", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Select,
              {
                val: videoSettings.streamRes,
                options: ["1920x1080", "1280x720", "640x360"],
                onChange: (v2) => updVideo("streamRes", v2),
                style: { width: "100%", background: "#202328", border: `1.5px solid ${T.line2}`, borderRadius: 4, padding: "6px 12px" }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Bitrate", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Select,
              {
                val: videoSettings.streamBitrate,
                options: ["Auto", "2M", "4M", "8M", "16M"],
                onChange: (v2) => updVideo("streamBitrate", v2),
                style: { width: "100%", background: "#202328", border: `1.5px solid ${T.line2}`, borderRadius: 4, padding: "6px 12px" }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Encoding Type", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 24, padding: "4px 0" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(VerticalRadio, { label: "H.264", checked: videoSettings.streamEncode === "H.264", onChange: () => updVideo("streamEncode", "H.264") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(VerticalRadio, { label: "H.265", checked: videoSettings.streamEncode === "H.265", onChange: () => updVideo("streamEncode", "H.265") })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Framerate", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Select,
              {
                val: videoSettings.streamFps,
                options: ["60", "50", "30", "25"],
                onChange: (v2) => updVideo("streamFps", v2),
                style: { width: "100%", background: "#202328", border: `1.5px solid ${T.line2}`, borderRadius: 4, padding: "6px 12px" }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "I-VOP Interval (S)", rightLabel: `${videoSettings.streamI_Vop}s`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(BodySlider, { val: videoSettings.streamI_Vop, min: 1, max: 10, onChange: (v2) => updVideo("streamI_Vop", v2) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "GOP Value", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                disabled: true,
                value: videoSettings.streamGop,
                style: {
                  background: "transparent",
                  border: "none",
                  color: T.faint,
                  fontSize: 14,
                  padding: "4px 0",
                  width: "100%",
                  boxSizing: "border-box",
                  cursor: "not-allowed",
                  outline: "none"
                }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Compatibility Encoding Mode", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 24, padding: "4px 0" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(VerticalRadio, { label: "Off", checked: videoSettings.streamCompat === "Off", onChange: () => updVideo("streamCompat", "Off") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(VerticalRadio, { label: "On", checked: videoSettings.streamCompat === "On", onChange: () => updVideo("streamCompat", "On") })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Rate Control", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 24, padding: "4px 0" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(VerticalRadio, { label: "VBR", checked: videoSettings.streamRateCtrl === "VBR", onChange: () => updVideo("streamRateCtrl", "VBR") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(VerticalRadio, { label: "CBR", checked: videoSettings.streamRateCtrl === "CBR", onChange: () => updVideo("streamRateCtrl", "CBR") })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { minHeight: 84 } })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ConfigCard, { title: "Audio", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Audio Input Type", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 24, padding: "4px 0" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(VerticalRadio, { label: "Line In", checked: videoSettings.audioInputType === "Line In", onChange: () => updVideo("audioInputType", "Line In") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(VerticalRadio, { label: "MIC In", checked: videoSettings.audioInputType === "MIC In", onChange: () => updVideo("audioInputType", "MIC In") })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Audio Volume", rightLabel: videoSettings.audioVolume, children: /* @__PURE__ */ jsxRuntimeExports.jsx(BodySlider, { val: videoSettings.audioVolume, min: 0, max: 10, onChange: (v2) => updVideo("audioVolume", v2) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "USB Audio Enable", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Select,
              {
                val: videoSettings.usbAudioEnable,
                options: ["Enable", "Disable"],
                onChange: (v2) => updVideo("usbAudioEnable", v2),
                style: { width: "100%", background: "#202328", border: `1.5px solid ${T.line2}`, borderRadius: 4, padding: "6px 12px" }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Encoding Type", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 24, padding: "4px 0" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(VerticalRadio, { label: "AAC", checked: videoSettings.audioEncode === "AAC", onChange: () => {
            } }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Sampling Rate", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Select,
              {
                val: videoSettings.audioSampleRate,
                options: ["48K", "44.1K"],
                disabled: true,
                onChange: () => {
                },
                style: { width: "100%", background: "#202328", border: `1.5px solid ${T.line2}`, borderRadius: 4, padding: "6px 12px" }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { minHeight: 84 } })
          ] }) })
        ] }) }),
        saveOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.65)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1e3,
              animation: "fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
            },
            onClick: () => setSaveOpen(false),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  background: T.panel,
                  border: `1px solid ${T.line}`,
                  borderRadius: 12,
                  width: 420,
                  padding: 24,
                  boxShadow: "0 12px 36px rgba(0, 0, 0, 0.55)",
                  animation: "scaleIn 0.36s cubic-bezier(0.34, 1.56, 0.64, 1)"
                },
                onClick: (e) => e.stopPropagation(),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 18, fontWeight: 600, color: T.text }, children: "Save as New Scene" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => setSaveOpen(false),
                        style: { background: "none", border: "none", cursor: "pointer", color: T.dim, fontSize: 16, padding: 0 },
                        children: "✕"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 14, color: T.dim, marginBottom: 6 }, children: "Scene Name" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          autoFocus: true,
                          value: scName,
                          onChange: (e) => setScName(e.target.value),
                          placeholder: "e.g. Main Stage / Studio",
                          maxLength: 24,
                          style: {
                            width: "100%",
                            boxSizing: "border-box",
                            background: "#101216",
                            border: `1px solid ${T.line2}`,
                            borderRadius: 6,
                            color: T.text,
                            fontSize: 14,
                            padding: "8px 12px",
                            outline: "none",
                            fontFamily: fUI
                          }
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 14, color: T.dim, marginBottom: 6 }, children: "Note" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          value: scRemark,
                          onChange: (e) => setScRemark(e.target.value),
                          placeholder: "Describe this scene (Optional)",
                          maxLength: 48,
                          style: {
                            width: "100%",
                            boxSizing: "border-box",
                            background: "#101216",
                            border: `1px solid ${T.line2}`,
                            borderRadius: 6,
                            color: T.text,
                            fontSize: 14,
                            padding: "8px 12px",
                            outline: "none",
                            fontFamily: fUI
                          }
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6, background: "rgba(30,155,240,0.05)", padding: "8px 12px", borderRadius: 6, border: `1px solid rgba(30,155,240,0.15)` }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: T.blue, fontSize: 14 }, children: "ℹ" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 14, color: T.dim }, children: "Saving will automatically capture the current Live View image as a preview thumbnail." })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => setSaveOpen(false),
                        style: {
                          padding: "8px 16px",
                          fontSize: 14,
                          cursor: "pointer",
                          borderRadius: 6,
                          border: `1px solid ${T.line2}`,
                          background: "transparent",
                          color: T.dim,
                          fontFamily: fUI
                        },
                        children: "Cancel"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: saveNewScene,
                        style: {
                          padding: "8px 20px",
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: "pointer",
                          borderRadius: 6,
                          border: "none",
                          background: T.blue,
                          color: "#fff",
                          fontFamily: fUI
                        },
                        children: "Save"
                      }
                    )
                  ] })
                ]
              }
            )
          }
        ),
        editingScene != null && (() => {
          const es = scenes.find((x2) => x2.id === editingScene);
          if (!es) return null;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                position: "fixed",
                inset: 0,
                background: "rgba(0, 0, 0, 0.65)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1e3,
                animation: "fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
              },
              onClick: () => setEditingScene(null),
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    background: T.panel,
                    border: `1px solid ${T.line}`,
                    borderRadius: 12,
                    width: 420,
                    padding: 24,
                    boxShadow: "0 12px 36px rgba(0, 0, 0, 0.55)",
                    animation: "scaleIn 0.36s cubic-bezier(0.34, 1.56, 0.64, 1)"
                  },
                  onClick: (e) => e.stopPropagation(),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 18, fontWeight: 600, color: T.text }, children: "Edit Scene Info" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          onClick: () => setEditingScene(null),
                          style: { background: "none", border: "none", cursor: "pointer", color: T.dim, fontSize: 16, padding: 0 },
                          children: "✕"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 14, color: T.dim, marginBottom: 6 }, children: "Scene Name" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            autoFocus: true,
                            value: edName,
                            onChange: (e) => setEdName(e.target.value),
                            placeholder: "Scene Name",
                            maxLength: 24,
                            style: {
                              width: "100%",
                              boxSizing: "border-box",
                              background: "#101216",
                              border: `1px solid ${T.line2}`,
                              borderRadius: 6,
                              color: T.text,
                              fontSize: 14,
                              padding: "8px 12px",
                              outline: "none",
                              fontFamily: fUI
                            }
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 14, color: T.dim, marginBottom: 6 }, children: "Note" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            value: edRemark,
                            onChange: (e) => setEdRemark(e.target.value),
                            placeholder: "Scene Description",
                            maxLength: 48,
                            style: {
                              width: "100%",
                              boxSizing: "border-box",
                              background: "#101216",
                              border: `1px solid ${T.line2}`,
                              borderRadius: 6,
                              color: T.text,
                              fontSize: 14,
                              padding: "8px 12px",
                              outline: "none",
                              fontFamily: fUI
                            }
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          onClick: () => setEditingScene(null),
                          style: {
                            padding: "8px 16px",
                            fontSize: 14,
                            cursor: "pointer",
                            borderRadius: 6,
                            border: `1px solid ${T.line2}`,
                            background: "transparent",
                            color: T.dim,
                            fontFamily: fUI
                          },
                          children: "Cancel"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          onClick: saveSceneMeta,
                          style: {
                            padding: "8px 20px",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: "pointer",
                            borderRadius: 6,
                            border: "none",
                            background: T.blue,
                            color: "#fff",
                            fontFamily: fUI
                          },
                          children: "Save"
                        }
                      )
                    ] })
                  ]
                }
              )
            }
          );
        })(),
        deletingScene != null && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.65)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1e3,
              animation: "fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
            },
            onClick: () => setDeletingScene(null),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  background: T.panel,
                  border: `1px solid ${T.line}`,
                  borderRadius: 12,
                  width: 400,
                  padding: 24,
                  boxShadow: "0 12px 36px rgba(0, 0, 0, 0.55)",
                  animation: "scaleIn 0.36s cubic-bezier(0.34, 1.56, 0.64, 1)"
                },
                onClick: (e) => e.stopPropagation(),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 18, fontWeight: 600, color: T.text }, children: "Delete Scene" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => setDeletingScene(null),
                        style: { background: "none", border: "none", cursor: "pointer", color: T.dim, fontSize: 16, padding: 0 },
                        children: "✕"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 14, color: T.dim, marginBottom: 24, lineHeight: 1.6 }, children: [
                    "Are you sure you want to delete the custom scene「",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fff", fontWeight: 600 }, children: deletingScene.name }),
                    '」"?',
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "This action will permanently remove the saved scene and cannot be undone."
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => setDeletingScene(null),
                        style: {
                          padding: "8px 16px",
                          fontSize: 14,
                          cursor: "pointer",
                          borderRadius: 6,
                          border: `1px solid ${T.line2}`,
                          background: "transparent",
                          color: T.dim,
                          fontFamily: fUI
                        },
                        children: "Cancel"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => {
                          deleteScene(deletingScene);
                          setDeletingScene(null);
                        },
                        style: {
                          padding: "8px 20px",
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: "pointer",
                          borderRadius: 6,
                          border: "none",
                          background: "#e05c5c",
                          color: "#fff",
                          fontFamily: fUI
                        },
                        children: "Delete"
                      }
                    )
                  ] })
                ]
              }
            )
          }
        )
      ] }, activeMenu),
      activeMenu === "paint" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        position: "absolute",
        right: 24,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        alignItems: "flex-end",
        pointerEvents: "none"
      } })
    ] }),
    activeMenu === "paint" && onboardingModal(),
    gridDebug === "viewport-24" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-grid-viewport-24", "aria-hidden": true, style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      zIndex: 999999,
      display: "grid",
      gridTemplateColumns: `repeat(${GRIDSYS.columns}, minmax(0,1fr))`,
      columnGap: GRIDSYS.gutter,
      padding: `0 ${GRIDSYS.margin}px`,
      boxSizing: "border-box"
    }, children: Array.from({ length: GRIDSYS.columns }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      position: "relative",
      background: i >= 4 && i <= 21 ? "rgba(255, 64, 96, 0.09)" : "rgba(255, 64, 96, 0.045)",
      borderLeft: "1px solid rgba(255, 64, 96, 0.25)",
      borderRight: "1px solid rgba(255, 64, 96, 0.25)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { position: "absolute", top: 2, left: 3, fontSize: 9, fontFamily: fMono, color: "rgba(255,96,128,0.8)", fontWeight: "bold" }, children: [
      "C",
      i + 1
    ] }) }, i)) }),
    gridDebug === "container-24" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-grid-container-24", "aria-hidden": true, style: {
      position: "fixed",
      top: 0,
      bottom: 0,
      left: 220,
      right: 0,
      pointerEvents: "none",
      zIndex: 999999,
      display: "flex",
      justifyContent: "center"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      width: "100%",
      maxWidth: "1350px",
      height: "100%",
      padding: "0 24px",
      boxSizing: "border-box",
      display: "grid",
      gridTemplateColumns: "repeat(24, 1fr)",
      columnGap: "16px",
      position: "relative"
    }, children: Array.from({ length: 24 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      background: "rgba(0, 180, 255, 0.03)",
      borderLeft: "1px dashed rgba(0, 180, 255, 0.18)",
      borderRight: "1px dashed rgba(0, 180, 255, 0.18)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "8px 0",
      boxSizing: "border-box"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 9, fontFamily: fMono, color: "#00b4ff", background: "rgba(10, 20, 30, 0.88)", padding: "1px 4px", borderRadius: 3, fontWeight: "bold" }, children: [
        "C",
        i + 1
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 9, fontFamily: fMono, color: "#00b4ff", background: "rgba(10, 20, 30, 0.88)", padding: "1px 4px", borderRadius: 3, fontWeight: "bold" }, children: [
        "C",
        i + 1
      ] })
    ] }, i)) }) }),
    resetLivePresetTarget && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        id: "aver-live-preset-reset-modal",
        role: "presentation",
        onMouseDown: (event) => {
          if (event.target === event.currentTarget) setResetLivePresetTarget(null);
        },
        style: { position: "fixed", inset: 0, zIndex: 100, padding: 24, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: "aver-live-preset-reset-dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": "aver-live-preset-reset-title", style: { width: "min(400px, calc(100vw - 48px))", overflow: "hidden", background: "#101216", border: `1px solid ${T.line2}`, borderRadius: 10, boxShadow: "0 20px 60px rgba(0,0,0,0.58)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-live-preset-reset-title", style: { padding: "17px 18px 10px", color: T.text, fontSize: 16, fontWeight: 600 }, children: "Reset preset?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "0 18px 18px", color: T.dim, fontSize: 13, lineHeight: 1.55 }, children: [
            "Reset ",
            resetLivePresetTarget.name,
            "? The saved image and PTZ settings will be cleared."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "flex-end", gap: 9, padding: "12px 16px", borderTop: `1px solid ${T.line2}`, background: "rgba(255,255,255,0.02)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-live-preset-reset-cancel-button", type: "button", onClick: () => setResetLivePresetTarget(null), style: { height: 31, padding: "0 16px", borderRadius: 5, border: `1px solid ${T.line2}`, background: "#101216", color: T.text, fontFamily: fUI, fontSize: 13, cursor: "pointer" }, children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { id: "aver-live-preset-reset-confirm-button", type: "button", onClick: confirmResetLivePreset, style: { height: 31, padding: "0 18px", borderRadius: 5, border: "none", background: T.blue, color: "#fff", fontFamily: fUI, fontSize: 13, fontWeight: 600, cursor: "pointer" }, children: "Reset" })
          ] })
        ] })
      }
    ),
    toast && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-toast", className: "aver-toast", role: "status", "aria-live": "polite", style: { position: "fixed", top: 18, left: "50%", zIndex: 1e3, minWidth: 0, maxWidth: "min(360px, calc(100vw - 32px))", padding: "8px 13px", borderRadius: 6, border: `1px solid ${T.line2}`, background: "rgba(16,18,22,0.96)", color: T.text, boxShadow: "0 10px 30px rgba(0,0,0,0.45)", fontFamily: fUI, fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap" }, children: toast }),
    gridDebug === "pixel-8" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "aver-grid-pixel-8", "aria-hidden": true, style: {
      position: "fixed",
      inset: 0,
      pointerEvents: "none",
      zIndex: 999998,
      backgroundImage: "radial-gradient(rgba(224, 64, 255, 0.18) 1px, transparent 1px)",
      backgroundSize: "8px 8px"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setGridDebug((prev) => {
          if (prev === "off") return "viewport-24";
          if (prev === "viewport-24") return "container-24";
          if (prev === "container-24") return "pixel-8";
          return "off";
        }),
        title: "格線檢查模式 (V24:全畫面 | C24:內容區對齊 | P8:8px微格)",
        style: {
          position: "absolute",
          left: 10,
          bottom: 10,
          zIndex: 1e6,
          width: 34,
          height: 26,
          borderRadius: 6,
          border: `1px solid ${gridDebug === "viewport-24" ? "#ff4060" : gridDebug === "container-24" ? "#00b4ff" : gridDebug === "pixel-8" ? "#e040ff" : T.line2}`,
          background: gridDebug === "viewport-24" ? "rgba(255,64,96,0.2)" : gridDebug === "container-24" ? "rgba(0,180,255,0.15)" : gridDebug === "pixel-8" ? "rgba(224,64,255,0.15)" : "rgba(22,24,27,0.85)",
          color: gridDebug === "viewport-24" ? "#ff8098" : gridDebug === "container-24" ? "#00b4ff" : gridDebug === "pixel-8" ? "#e040ff" : T.faint,
          fontSize: 10,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: fMono,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease"
        },
        children: gridDebug === "viewport-24" ? "V24" : gridDebug === "container-24" ? "C24" : gridDebug === "pixel-8" ? "P8" : "#"
      }
    )
  ] });
}
function App() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100vw", height: "100vh", margin: 0, padding: 0, overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(App$1, {}) });
}
client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
);
