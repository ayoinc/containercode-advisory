var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
var init_utils = __esm({
  "../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/_internal/utils.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(createNotImplementedError, "createNotImplementedError");
    __name(notImplemented, "notImplemented");
    __name(notImplementedClass, "notImplementedClass");
  }
});

// ../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin, _performanceNow, nodeTiming, PerformanceEntry, PerformanceMark, PerformanceMeasure, PerformanceResourceTiming, PerformanceObserverEntryList, Performance, PerformanceObserver, performance;
var init_performance = __esm({
  "../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
    _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
    nodeTiming = {
      name: "node",
      entryType: "node",
      startTime: 0,
      duration: 0,
      nodeStart: 0,
      v8Start: 0,
      bootstrapComplete: 0,
      environment: 0,
      loopStart: 0,
      loopExit: 0,
      idleTime: 0,
      uvMetricsInfo: {
        loopCount: 0,
        events: 0,
        eventsWaiting: 0
      },
      detail: void 0,
      toJSON() {
        return this;
      }
    };
    PerformanceEntry = class {
      static {
        __name(this, "PerformanceEntry");
      }
      __unenv__ = true;
      detail;
      entryType = "event";
      name;
      startTime;
      constructor(name, options) {
        this.name = name;
        this.startTime = options?.startTime || _performanceNow();
        this.detail = options?.detail;
      }
      get duration() {
        return _performanceNow() - this.startTime;
      }
      toJSON() {
        return {
          name: this.name,
          entryType: this.entryType,
          startTime: this.startTime,
          duration: this.duration,
          detail: this.detail
        };
      }
    };
    PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
      static {
        __name(this, "PerformanceMark");
      }
      entryType = "mark";
      constructor() {
        super(...arguments);
      }
      get duration() {
        return 0;
      }
    };
    PerformanceMeasure = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceMeasure");
      }
      entryType = "measure";
    };
    PerformanceResourceTiming = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceResourceTiming");
      }
      entryType = "resource";
      serverTiming = [];
      connectEnd = 0;
      connectStart = 0;
      decodedBodySize = 0;
      domainLookupEnd = 0;
      domainLookupStart = 0;
      encodedBodySize = 0;
      fetchStart = 0;
      initiatorType = "";
      name = "";
      nextHopProtocol = "";
      redirectEnd = 0;
      redirectStart = 0;
      requestStart = 0;
      responseEnd = 0;
      responseStart = 0;
      secureConnectionStart = 0;
      startTime = 0;
      transferSize = 0;
      workerStart = 0;
      responseStatus = 0;
    };
    PerformanceObserverEntryList = class {
      static {
        __name(this, "PerformanceObserverEntryList");
      }
      __unenv__ = true;
      getEntries() {
        return [];
      }
      getEntriesByName(_name, _type) {
        return [];
      }
      getEntriesByType(type) {
        return [];
      }
    };
    Performance = class {
      static {
        __name(this, "Performance");
      }
      __unenv__ = true;
      timeOrigin = _timeOrigin;
      eventCounts = /* @__PURE__ */ new Map();
      _entries = [];
      _resourceTimingBufferSize = 0;
      navigation = void 0;
      timing = void 0;
      timerify(_fn, _options) {
        throw createNotImplementedError("Performance.timerify");
      }
      get nodeTiming() {
        return nodeTiming;
      }
      eventLoopUtilization() {
        return {};
      }
      markResourceTiming() {
        return new PerformanceResourceTiming("");
      }
      onresourcetimingbufferfull = null;
      now() {
        if (this.timeOrigin === _timeOrigin) {
          return _performanceNow();
        }
        return Date.now() - this.timeOrigin;
      }
      clearMarks(markName) {
        this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
      }
      clearMeasures(measureName) {
        this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
      }
      clearResourceTimings() {
        this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
      }
      getEntries() {
        return this._entries;
      }
      getEntriesByName(name, type) {
        return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
      }
      getEntriesByType(type) {
        return this._entries.filter((e) => e.entryType === type);
      }
      mark(name, options) {
        const entry = new PerformanceMark(name, options);
        this._entries.push(entry);
        return entry;
      }
      measure(measureName, startOrMeasureOptions, endMark) {
        let start;
        let end;
        if (typeof startOrMeasureOptions === "string") {
          start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
          end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
        } else {
          start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
          end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
        }
        const entry = new PerformanceMeasure(measureName, {
          startTime: start,
          detail: {
            start,
            end
          }
        });
        this._entries.push(entry);
        return entry;
      }
      setResourceTimingBufferSize(maxSize) {
        this._resourceTimingBufferSize = maxSize;
      }
      addEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.addEventListener");
      }
      removeEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.removeEventListener");
      }
      dispatchEvent(event) {
        throw createNotImplementedError("Performance.dispatchEvent");
      }
      toJSON() {
        return this;
      }
    };
    PerformanceObserver = class {
      static {
        __name(this, "PerformanceObserver");
      }
      __unenv__ = true;
      static supportedEntryTypes = [];
      _callback = null;
      constructor(callback) {
        this._callback = callback;
      }
      takeRecords() {
        return [];
      }
      disconnect() {
        throw createNotImplementedError("PerformanceObserver.disconnect");
      }
      observe(options) {
        throw createNotImplementedError("PerformanceObserver.observe");
      }
      bind(fn) {
        return fn;
      }
      runInAsyncScope(fn, thisArg, ...args) {
        return fn.call(thisArg, ...args);
      }
      asyncId() {
        return 0;
      }
      triggerAsyncId() {
        return 0;
      }
      emitDestroy() {
        return this;
      }
    };
    performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();
  }
});

// ../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/perf_hooks.mjs
var init_perf_hooks = __esm({
  "../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/perf_hooks.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_performance();
  }
});

// ../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
var init_performance2 = __esm({
  "../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs"() {
    init_perf_hooks();
    globalThis.performance = performance;
    globalThis.Performance = Performance;
    globalThis.PerformanceEntry = PerformanceEntry;
    globalThis.PerformanceMark = PerformanceMark;
    globalThis.PerformanceMeasure = PerformanceMeasure;
    globalThis.PerformanceObserver = PerformanceObserver;
    globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
    globalThis.PerformanceResourceTiming = PerformanceResourceTiming;
  }
});

// ../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default;
var init_noop = __esm({
  "../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/mock/noop.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    noop_default = Object.assign(() => {
    }, { __unenv__: true });
  }
});

// ../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";
var _console, _ignoreErrors, _stderr, _stdout, log, info, trace, debug, table, error, warn, createTask, clear, count, countReset, dir, dirxml, group, groupEnd, groupCollapsed, profile, profileEnd, time, timeEnd, timeLog, timeStamp, Console, _times, _stdoutErrorHandler, _stderrErrorHandler;
var init_console = __esm({
  "../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/console.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_noop();
    init_utils();
    _console = globalThis.console;
    _ignoreErrors = true;
    _stderr = new Writable();
    _stdout = new Writable();
    log = _console?.log ?? noop_default;
    info = _console?.info ?? log;
    trace = _console?.trace ?? info;
    debug = _console?.debug ?? log;
    table = _console?.table ?? log;
    error = _console?.error ?? log;
    warn = _console?.warn ?? error;
    createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
    clear = _console?.clear ?? noop_default;
    count = _console?.count ?? noop_default;
    countReset = _console?.countReset ?? noop_default;
    dir = _console?.dir ?? noop_default;
    dirxml = _console?.dirxml ?? noop_default;
    group = _console?.group ?? noop_default;
    groupEnd = _console?.groupEnd ?? noop_default;
    groupCollapsed = _console?.groupCollapsed ?? noop_default;
    profile = _console?.profile ?? noop_default;
    profileEnd = _console?.profileEnd ?? noop_default;
    time = _console?.time ?? noop_default;
    timeEnd = _console?.timeEnd ?? noop_default;
    timeLog = _console?.timeLog ?? noop_default;
    timeStamp = _console?.timeStamp ?? noop_default;
    Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
    _times = /* @__PURE__ */ new Map();
    _stdoutErrorHandler = noop_default;
    _stderrErrorHandler = noop_default;
  }
});

// ../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole, assert, clear2, context, count2, countReset2, createTask2, debug2, dir2, dirxml2, error2, group2, groupCollapsed2, groupEnd2, info2, log2, profile2, profileEnd2, table2, time2, timeEnd2, timeLog2, timeStamp2, trace2, warn2, console_default;
var init_console2 = __esm({
  "../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_console();
    workerdConsole = globalThis["console"];
    ({
      assert,
      clear: clear2,
      context: (
        // @ts-expect-error undocumented public API
        context
      ),
      count: count2,
      countReset: countReset2,
      createTask: (
        // @ts-expect-error undocumented public API
        createTask2
      ),
      debug: debug2,
      dir: dir2,
      dirxml: dirxml2,
      error: error2,
      group: group2,
      groupCollapsed: groupCollapsed2,
      groupEnd: groupEnd2,
      info: info2,
      log: log2,
      profile: profile2,
      profileEnd: profileEnd2,
      table: table2,
      time: time2,
      timeEnd: timeEnd2,
      timeLog: timeLog2,
      timeStamp: timeStamp2,
      trace: trace2,
      warn: warn2
    } = workerdConsole);
    Object.assign(workerdConsole, {
      Console,
      _ignoreErrors,
      _stderr,
      _stderrErrorHandler,
      _stdout,
      _stdoutErrorHandler,
      _times
    });
    console_default = workerdConsole;
  }
});

// ../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console = __esm({
  "../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console"() {
    init_console2();
    globalThis.console = console_default;
  }
});

// ../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime;
var init_hrtime = __esm({
  "../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
      const now = Date.now();
      const seconds = Math.trunc(now / 1e3);
      const nanos = now % 1e3 * 1e6;
      if (startTime) {
        let diffSeconds = seconds - startTime[0];
        let diffNanos = nanos - startTime[0];
        if (diffNanos < 0) {
          diffSeconds = diffSeconds - 1;
          diffNanos = 1e9 + diffNanos;
        }
        return [diffSeconds, diffNanos];
      }
      return [seconds, nanos];
    }, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
      return BigInt(Date.now() * 1e6);
    }, "bigint") });
  }
});

// ../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream;
var init_write_stream = __esm({
  "../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    WriteStream = class {
      static {
        __name(this, "WriteStream");
      }
      fd;
      columns = 80;
      rows = 24;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      clearLine(dir3, callback) {
        callback && callback();
        return false;
      }
      clearScreenDown(callback) {
        callback && callback();
        return false;
      }
      cursorTo(x, y, callback) {
        callback && typeof callback === "function" && callback();
        return false;
      }
      moveCursor(dx, dy, callback) {
        callback && callback();
        return false;
      }
      getColorDepth(env2) {
        return 1;
      }
      hasColors(count3, env2) {
        return false;
      }
      getWindowSize() {
        return [this.columns, this.rows];
      }
      write(str, encoding, cb) {
        if (str instanceof Uint8Array) {
          str = new TextDecoder().decode(str);
        }
        try {
          console.log(str);
        } catch {
        }
        cb && typeof cb === "function" && cb();
        return false;
      }
    };
  }
});

// ../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream;
var init_read_stream = __esm({
  "../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ReadStream = class {
      static {
        __name(this, "ReadStream");
      }
      fd;
      isRaw = false;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      setRawMode(mode) {
        this.isRaw = mode;
        return this;
      }
    };
  }
});

// ../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/tty.mjs
var init_tty = __esm({
  "../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/tty.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_read_stream();
    init_write_stream();
  }
});

// ../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION;
var init_node_version = __esm({
  "../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    NODE_VERSION = "22.14.0";
  }
});

// ../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";
var Process;
var init_process = __esm({
  "../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/process.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_tty();
    init_utils();
    init_node_version();
    Process = class _Process extends EventEmitter {
      static {
        __name(this, "Process");
      }
      env;
      hrtime;
      nextTick;
      constructor(impl) {
        super();
        this.env = impl.env;
        this.hrtime = impl.hrtime;
        this.nextTick = impl.nextTick;
        for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
          const value = this[prop];
          if (typeof value === "function") {
            this[prop] = value.bind(this);
          }
        }
      }
      emitWarning(warning, type, code) {
        console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
      }
      emit(...args) {
        return super.emit(...args);
      }
      listeners(eventName) {
        return super.listeners(eventName);
      }
      #stdin;
      #stdout;
      #stderr;
      get stdin() {
        return this.#stdin ??= new ReadStream(0);
      }
      get stdout() {
        return this.#stdout ??= new WriteStream(1);
      }
      get stderr() {
        return this.#stderr ??= new WriteStream(2);
      }
      #cwd = "/";
      chdir(cwd2) {
        this.#cwd = cwd2;
      }
      cwd() {
        return this.#cwd;
      }
      arch = "";
      platform = "";
      argv = [];
      argv0 = "";
      execArgv = [];
      execPath = "";
      title = "";
      pid = 200;
      ppid = 100;
      get version() {
        return `v${NODE_VERSION}`;
      }
      get versions() {
        return { node: NODE_VERSION };
      }
      get allowedNodeEnvironmentFlags() {
        return /* @__PURE__ */ new Set();
      }
      get sourceMapsEnabled() {
        return false;
      }
      get debugPort() {
        return 0;
      }
      get throwDeprecation() {
        return false;
      }
      get traceDeprecation() {
        return false;
      }
      get features() {
        return {};
      }
      get release() {
        return {};
      }
      get connected() {
        return false;
      }
      get config() {
        return {};
      }
      get moduleLoadList() {
        return [];
      }
      constrainedMemory() {
        return 0;
      }
      availableMemory() {
        return 0;
      }
      uptime() {
        return 0;
      }
      resourceUsage() {
        return {};
      }
      ref() {
      }
      unref() {
      }
      umask() {
        throw createNotImplementedError("process.umask");
      }
      getBuiltinModule() {
        return void 0;
      }
      getActiveResourcesInfo() {
        throw createNotImplementedError("process.getActiveResourcesInfo");
      }
      exit() {
        throw createNotImplementedError("process.exit");
      }
      reallyExit() {
        throw createNotImplementedError("process.reallyExit");
      }
      kill() {
        throw createNotImplementedError("process.kill");
      }
      abort() {
        throw createNotImplementedError("process.abort");
      }
      dlopen() {
        throw createNotImplementedError("process.dlopen");
      }
      setSourceMapsEnabled() {
        throw createNotImplementedError("process.setSourceMapsEnabled");
      }
      loadEnvFile() {
        throw createNotImplementedError("process.loadEnvFile");
      }
      disconnect() {
        throw createNotImplementedError("process.disconnect");
      }
      cpuUsage() {
        throw createNotImplementedError("process.cpuUsage");
      }
      setUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
      }
      hasUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
      }
      initgroups() {
        throw createNotImplementedError("process.initgroups");
      }
      openStdin() {
        throw createNotImplementedError("process.openStdin");
      }
      assert() {
        throw createNotImplementedError("process.assert");
      }
      binding() {
        throw createNotImplementedError("process.binding");
      }
      permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
      report = {
        directory: "",
        filename: "",
        signal: "SIGUSR2",
        compact: false,
        reportOnFatalError: false,
        reportOnSignal: false,
        reportOnUncaughtException: false,
        getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
        writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
      };
      finalization = {
        register: /* @__PURE__ */ notImplemented("process.finalization.register"),
        unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
        registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
      };
      memoryUsage = Object.assign(() => ({
        arrayBuffers: 0,
        rss: 0,
        external: 0,
        heapTotal: 0,
        heapUsed: 0
      }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
      mainModule = void 0;
      domain = void 0;
      send = void 0;
      exitCode = void 0;
      channel = void 0;
      getegid = void 0;
      geteuid = void 0;
      getgid = void 0;
      getgroups = void 0;
      getuid = void 0;
      setegid = void 0;
      seteuid = void 0;
      setgid = void 0;
      setgroups = void 0;
      setuid = void 0;
      _events = void 0;
      _eventsCount = void 0;
      _exiting = void 0;
      _maxListeners = void 0;
      _debugEnd = void 0;
      _debugProcess = void 0;
      _fatalException = void 0;
      _getActiveHandles = void 0;
      _getActiveRequests = void 0;
      _kill = void 0;
      _preload_modules = void 0;
      _rawDebug = void 0;
      _startProfilerIdleNotifier = void 0;
      _stopProfilerIdleNotifier = void 0;
      _tickCallback = void 0;
      _disconnect = void 0;
      _handleQueue = void 0;
      _pendingMessage = void 0;
      _channel = void 0;
      _send = void 0;
      _linkedBinding = void 0;
    };
  }
});

// ../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess, getBuiltinModule, exit, platform, nextTick, unenvProcess, abort, addListener, allowedNodeEnvironmentFlags, hasUncaughtExceptionCaptureCallback, setUncaughtExceptionCaptureCallback, loadEnvFile, sourceMapsEnabled, arch, argv, argv0, chdir, config, connected, constrainedMemory, availableMemory, cpuUsage, cwd, debugPort, dlopen, disconnect, emit, emitWarning, env, eventNames, execArgv, execPath, finalization, features, getActiveResourcesInfo, getMaxListeners, hrtime3, kill, listeners, listenerCount, memoryUsage, on, off, once, pid, ppid, prependListener, prependOnceListener, rawListeners, release, removeAllListeners, removeListener, report, resourceUsage, setMaxListeners, setSourceMapsEnabled, stderr, stdin, stdout, title, throwDeprecation, traceDeprecation, umask, uptime, version, versions, domain, initgroups, moduleLoadList, reallyExit, openStdin, assert2, binding, send, exitCode, channel, getegid, geteuid, getgid, getgroups, getuid, setegid, seteuid, setgid, setgroups, setuid, permission, mainModule, _events, _eventsCount, _exiting, _maxListeners, _debugEnd, _debugProcess, _fatalException, _getActiveHandles, _getActiveRequests, _kill, _preload_modules, _rawDebug, _startProfilerIdleNotifier, _stopProfilerIdleNotifier, _tickCallback, _disconnect, _handleQueue, _pendingMessage, _channel, _send, _linkedBinding, _process, process_default;
var init_process2 = __esm({
  "../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_hrtime();
    init_process();
    globalProcess = globalThis["process"];
    getBuiltinModule = globalProcess.getBuiltinModule;
    ({ exit, platform, nextTick } = getBuiltinModule(
      "node:process"
    ));
    unenvProcess = new Process({
      env: globalProcess.env,
      hrtime,
      nextTick
    });
    ({
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      finalization,
      features,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      on,
      off,
      once,
      pid,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    } = unenvProcess);
    _process = {
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exit,
      finalization,
      features,
      getBuiltinModule,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      nextTick,
      on,
      off,
      once,
      pid,
      platform,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      // @ts-expect-error old API
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    };
    process_default = _process;
  }
});

// ../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process = __esm({
  "../../../../.nvm/versions/node/v22.11.0/lib/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process"() {
    init_process2();
    globalThis.process = process_default;
  }
});

// node_modules/fast-xml-parser/src/util.js
var require_util = __commonJS({
  "node_modules/fast-xml-parser/src/util.js"(exports) {
    "use strict";
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var nameStartChar = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
    var nameChar = nameStartChar + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
    var nameRegexp = "[" + nameStartChar + "][" + nameChar + "]*";
    var regexName = new RegExp("^" + nameRegexp + "$");
    var getAllMatches = /* @__PURE__ */ __name(function(string, regex) {
      const matches = [];
      let match = regex.exec(string);
      while (match) {
        const allmatches = [];
        allmatches.startIndex = regex.lastIndex - match[0].length;
        const len = match.length;
        for (let index = 0; index < len; index++) {
          allmatches.push(match[index]);
        }
        matches.push(allmatches);
        match = regex.exec(string);
      }
      return matches;
    }, "getAllMatches");
    var isName = /* @__PURE__ */ __name(function(string) {
      const match = regexName.exec(string);
      return !(match === null || typeof match === "undefined");
    }, "isName");
    exports.isExist = function(v) {
      return typeof v !== "undefined";
    };
    exports.isEmptyObject = function(obj) {
      return Object.keys(obj).length === 0;
    };
    exports.merge = function(target, a, arrayMode) {
      if (a) {
        const keys = Object.keys(a);
        const len = keys.length;
        for (let i = 0; i < len; i++) {
          if (arrayMode === "strict") {
            target[keys[i]] = [a[keys[i]]];
          } else {
            target[keys[i]] = a[keys[i]];
          }
        }
      }
    };
    exports.getValue = function(v) {
      if (exports.isExist(v)) {
        return v;
      } else {
        return "";
      }
    };
    exports.isName = isName;
    exports.getAllMatches = getAllMatches;
    exports.nameRegexp = nameRegexp;
  }
});

// node_modules/fast-xml-parser/src/validator.js
var require_validator = __commonJS({
  "node_modules/fast-xml-parser/src/validator.js"(exports) {
    "use strict";
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var util = require_util();
    var defaultOptions = {
      allowBooleanAttributes: false,
      //A tag can have attributes without any value
      unpairedTags: []
    };
    exports.validate = function(xmlData, options) {
      options = Object.assign({}, defaultOptions, options);
      const tags = [];
      let tagFound = false;
      let reachedRoot = false;
      if (xmlData[0] === "\uFEFF") {
        xmlData = xmlData.substr(1);
      }
      for (let i = 0; i < xmlData.length; i++) {
        if (xmlData[i] === "<" && xmlData[i + 1] === "?") {
          i += 2;
          i = readPI(xmlData, i);
          if (i.err) return i;
        } else if (xmlData[i] === "<") {
          let tagStartPos = i;
          i++;
          if (xmlData[i] === "!") {
            i = readCommentAndCDATA(xmlData, i);
            continue;
          } else {
            let closingTag = false;
            if (xmlData[i] === "/") {
              closingTag = true;
              i++;
            }
            let tagName = "";
            for (; i < xmlData.length && xmlData[i] !== ">" && xmlData[i] !== " " && xmlData[i] !== "	" && xmlData[i] !== "\n" && xmlData[i] !== "\r"; i++) {
              tagName += xmlData[i];
            }
            tagName = tagName.trim();
            if (tagName[tagName.length - 1] === "/") {
              tagName = tagName.substring(0, tagName.length - 1);
              i--;
            }
            if (!validateTagName(tagName)) {
              let msg;
              if (tagName.trim().length === 0) {
                msg = "Invalid space after '<'.";
              } else {
                msg = "Tag '" + tagName + "' is an invalid name.";
              }
              return getErrorObject("InvalidTag", msg, getLineNumberForPosition(xmlData, i));
            }
            const result = readAttributeStr(xmlData, i);
            if (result === false) {
              return getErrorObject("InvalidAttr", "Attributes for '" + tagName + "' have open quote.", getLineNumberForPosition(xmlData, i));
            }
            let attrStr = result.value;
            i = result.index;
            if (attrStr[attrStr.length - 1] === "/") {
              const attrStrStart = i - attrStr.length;
              attrStr = attrStr.substring(0, attrStr.length - 1);
              const isValid = validateAttributeString(attrStr, options);
              if (isValid === true) {
                tagFound = true;
              } else {
                return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, attrStrStart + isValid.err.line));
              }
            } else if (closingTag) {
              if (!result.tagClosed) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' doesn't have proper closing.", getLineNumberForPosition(xmlData, i));
              } else if (attrStr.trim().length > 0) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, tagStartPos));
              } else if (tags.length === 0) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' has not been opened.", getLineNumberForPosition(xmlData, tagStartPos));
              } else {
                const otg = tags.pop();
                if (tagName !== otg.tagName) {
                  let openPos = getLineNumberForPosition(xmlData, otg.tagStartPos);
                  return getErrorObject(
                    "InvalidTag",
                    "Expected closing tag '" + otg.tagName + "' (opened in line " + openPos.line + ", col " + openPos.col + ") instead of closing tag '" + tagName + "'.",
                    getLineNumberForPosition(xmlData, tagStartPos)
                  );
                }
                if (tags.length == 0) {
                  reachedRoot = true;
                }
              }
            } else {
              const isValid = validateAttributeString(attrStr, options);
              if (isValid !== true) {
                return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i - attrStr.length + isValid.err.line));
              }
              if (reachedRoot === true) {
                return getErrorObject("InvalidXml", "Multiple possible root nodes found.", getLineNumberForPosition(xmlData, i));
              } else if (options.unpairedTags.indexOf(tagName) !== -1) {
              } else {
                tags.push({ tagName, tagStartPos });
              }
              tagFound = true;
            }
            for (i++; i < xmlData.length; i++) {
              if (xmlData[i] === "<") {
                if (xmlData[i + 1] === "!") {
                  i++;
                  i = readCommentAndCDATA(xmlData, i);
                  continue;
                } else if (xmlData[i + 1] === "?") {
                  i = readPI(xmlData, ++i);
                  if (i.err) return i;
                } else {
                  break;
                }
              } else if (xmlData[i] === "&") {
                const afterAmp = validateAmpersand(xmlData, i);
                if (afterAmp == -1)
                  return getErrorObject("InvalidChar", "char '&' is not expected.", getLineNumberForPosition(xmlData, i));
                i = afterAmp;
              } else {
                if (reachedRoot === true && !isWhiteSpace(xmlData[i])) {
                  return getErrorObject("InvalidXml", "Extra text at the end", getLineNumberForPosition(xmlData, i));
                }
              }
            }
            if (xmlData[i] === "<") {
              i--;
            }
          }
        } else {
          if (isWhiteSpace(xmlData[i])) {
            continue;
          }
          return getErrorObject("InvalidChar", "char '" + xmlData[i] + "' is not expected.", getLineNumberForPosition(xmlData, i));
        }
      }
      if (!tagFound) {
        return getErrorObject("InvalidXml", "Start tag expected.", 1);
      } else if (tags.length == 1) {
        return getErrorObject("InvalidTag", "Unclosed tag '" + tags[0].tagName + "'.", getLineNumberForPosition(xmlData, tags[0].tagStartPos));
      } else if (tags.length > 0) {
        return getErrorObject("InvalidXml", "Invalid '" + JSON.stringify(tags.map((t) => t.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", { line: 1, col: 1 });
      }
      return true;
    };
    function isWhiteSpace(char) {
      return char === " " || char === "	" || char === "\n" || char === "\r";
    }
    __name(isWhiteSpace, "isWhiteSpace");
    function readPI(xmlData, i) {
      const start = i;
      for (; i < xmlData.length; i++) {
        if (xmlData[i] == "?" || xmlData[i] == " ") {
          const tagname = xmlData.substr(start, i - start);
          if (i > 5 && tagname === "xml") {
            return getErrorObject("InvalidXml", "XML declaration allowed only at the start of the document.", getLineNumberForPosition(xmlData, i));
          } else if (xmlData[i] == "?" && xmlData[i + 1] == ">") {
            i++;
            break;
          } else {
            continue;
          }
        }
      }
      return i;
    }
    __name(readPI, "readPI");
    function readCommentAndCDATA(xmlData, i) {
      if (xmlData.length > i + 5 && xmlData[i + 1] === "-" && xmlData[i + 2] === "-") {
        for (i += 3; i < xmlData.length; i++) {
          if (xmlData[i] === "-" && xmlData[i + 1] === "-" && xmlData[i + 2] === ">") {
            i += 2;
            break;
          }
        }
      } else if (xmlData.length > i + 8 && xmlData[i + 1] === "D" && xmlData[i + 2] === "O" && xmlData[i + 3] === "C" && xmlData[i + 4] === "T" && xmlData[i + 5] === "Y" && xmlData[i + 6] === "P" && xmlData[i + 7] === "E") {
        let angleBracketsCount = 1;
        for (i += 8; i < xmlData.length; i++) {
          if (xmlData[i] === "<") {
            angleBracketsCount++;
          } else if (xmlData[i] === ">") {
            angleBracketsCount--;
            if (angleBracketsCount === 0) {
              break;
            }
          }
        }
      } else if (xmlData.length > i + 9 && xmlData[i + 1] === "[" && xmlData[i + 2] === "C" && xmlData[i + 3] === "D" && xmlData[i + 4] === "A" && xmlData[i + 5] === "T" && xmlData[i + 6] === "A" && xmlData[i + 7] === "[") {
        for (i += 8; i < xmlData.length; i++) {
          if (xmlData[i] === "]" && xmlData[i + 1] === "]" && xmlData[i + 2] === ">") {
            i += 2;
            break;
          }
        }
      }
      return i;
    }
    __name(readCommentAndCDATA, "readCommentAndCDATA");
    var doubleQuote = '"';
    var singleQuote = "'";
    function readAttributeStr(xmlData, i) {
      let attrStr = "";
      let startChar = "";
      let tagClosed = false;
      for (; i < xmlData.length; i++) {
        if (xmlData[i] === doubleQuote || xmlData[i] === singleQuote) {
          if (startChar === "") {
            startChar = xmlData[i];
          } else if (startChar !== xmlData[i]) {
          } else {
            startChar = "";
          }
        } else if (xmlData[i] === ">") {
          if (startChar === "") {
            tagClosed = true;
            break;
          }
        }
        attrStr += xmlData[i];
      }
      if (startChar !== "") {
        return false;
      }
      return {
        value: attrStr,
        index: i,
        tagClosed
      };
    }
    __name(readAttributeStr, "readAttributeStr");
    var validAttrStrRegxp = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");
    function validateAttributeString(attrStr, options) {
      const matches = util.getAllMatches(attrStr, validAttrStrRegxp);
      const attrNames = {};
      for (let i = 0; i < matches.length; i++) {
        if (matches[i][1].length === 0) {
          return getErrorObject("InvalidAttr", "Attribute '" + matches[i][2] + "' has no space in starting.", getPositionFromMatch(matches[i]));
        } else if (matches[i][3] !== void 0 && matches[i][4] === void 0) {
          return getErrorObject("InvalidAttr", "Attribute '" + matches[i][2] + "' is without value.", getPositionFromMatch(matches[i]));
        } else if (matches[i][3] === void 0 && !options.allowBooleanAttributes) {
          return getErrorObject("InvalidAttr", "boolean attribute '" + matches[i][2] + "' is not allowed.", getPositionFromMatch(matches[i]));
        }
        const attrName = matches[i][2];
        if (!validateAttrName(attrName)) {
          return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is an invalid name.", getPositionFromMatch(matches[i]));
        }
        if (!attrNames.hasOwnProperty(attrName)) {
          attrNames[attrName] = 1;
        } else {
          return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is repeated.", getPositionFromMatch(matches[i]));
        }
      }
      return true;
    }
    __name(validateAttributeString, "validateAttributeString");
    function validateNumberAmpersand(xmlData, i) {
      let re = /\d/;
      if (xmlData[i] === "x") {
        i++;
        re = /[\da-fA-F]/;
      }
      for (; i < xmlData.length; i++) {
        if (xmlData[i] === ";")
          return i;
        if (!xmlData[i].match(re))
          break;
      }
      return -1;
    }
    __name(validateNumberAmpersand, "validateNumberAmpersand");
    function validateAmpersand(xmlData, i) {
      i++;
      if (xmlData[i] === ";")
        return -1;
      if (xmlData[i] === "#") {
        i++;
        return validateNumberAmpersand(xmlData, i);
      }
      let count3 = 0;
      for (; i < xmlData.length; i++, count3++) {
        if (xmlData[i].match(/\w/) && count3 < 20)
          continue;
        if (xmlData[i] === ";")
          break;
        return -1;
      }
      return i;
    }
    __name(validateAmpersand, "validateAmpersand");
    function getErrorObject(code, message, lineNumber) {
      return {
        err: {
          code,
          msg: message,
          line: lineNumber.line || lineNumber,
          col: lineNumber.col
        }
      };
    }
    __name(getErrorObject, "getErrorObject");
    function validateAttrName(attrName) {
      return util.isName(attrName);
    }
    __name(validateAttrName, "validateAttrName");
    function validateTagName(tagname) {
      return util.isName(tagname);
    }
    __name(validateTagName, "validateTagName");
    function getLineNumberForPosition(xmlData, index) {
      const lines = xmlData.substring(0, index).split(/\r?\n/);
      return {
        line: lines.length,
        // column number is last line's length + 1, because column numbering starts at 1:
        col: lines[lines.length - 1].length + 1
      };
    }
    __name(getLineNumberForPosition, "getLineNumberForPosition");
    function getPositionFromMatch(match) {
      return match.startIndex + match[1].length;
    }
    __name(getPositionFromMatch, "getPositionFromMatch");
  }
});

// node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js
var require_OptionsBuilder = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js"(exports) {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var defaultOptions = {
      preserveOrder: false,
      attributeNamePrefix: "@_",
      attributesGroupName: false,
      textNodeName: "#text",
      ignoreAttributes: true,
      removeNSPrefix: false,
      // remove NS from tag name or attribute name if true
      allowBooleanAttributes: false,
      //a tag can have attributes without any value
      //ignoreRootElement : false,
      parseTagValue: true,
      parseAttributeValue: false,
      trimValues: true,
      //Trim string values of tag and attributes
      cdataPropName: false,
      numberParseOptions: {
        hex: true,
        leadingZeros: true,
        eNotation: true
      },
      tagValueProcessor: /* @__PURE__ */ __name(function(tagName, val) {
        return val;
      }, "tagValueProcessor"),
      attributeValueProcessor: /* @__PURE__ */ __name(function(attrName, val) {
        return val;
      }, "attributeValueProcessor"),
      stopNodes: [],
      //nested tags will not be parsed even for errors
      alwaysCreateTextNode: false,
      isArray: /* @__PURE__ */ __name(() => false, "isArray"),
      commentPropName: false,
      unpairedTags: [],
      processEntities: true,
      htmlEntities: false,
      ignoreDeclaration: false,
      ignorePiTags: false,
      transformTagName: false,
      transformAttributeName: false,
      updateTag: /* @__PURE__ */ __name(function(tagName, jPath, attrs) {
        return tagName;
      }, "updateTag")
      // skipEmptyListItem: false
    };
    var buildOptions = /* @__PURE__ */ __name(function(options) {
      return Object.assign({}, defaultOptions, options);
    }, "buildOptions");
    exports.buildOptions = buildOptions;
    exports.defaultOptions = defaultOptions;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/xmlNode.js
var require_xmlNode = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/xmlNode.js"(exports, module) {
    "use strict";
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var XmlNode = class {
      static {
        __name(this, "XmlNode");
      }
      constructor(tagname) {
        this.tagname = tagname;
        this.child = [];
        this[":@"] = {};
      }
      add(key, val) {
        if (key === "__proto__") key = "#__proto__";
        this.child.push({ [key]: val });
      }
      addChild(node) {
        if (node.tagname === "__proto__") node.tagname = "#__proto__";
        if (node[":@"] && Object.keys(node[":@"]).length > 0) {
          this.child.push({ [node.tagname]: node.child, [":@"]: node[":@"] });
        } else {
          this.child.push({ [node.tagname]: node.child });
        }
      }
    };
    module.exports = XmlNode;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js
var require_DocTypeReader = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js"(exports, module) {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var util = require_util();
    function readDocType(xmlData, i) {
      const entities = {};
      if (xmlData[i + 3] === "O" && xmlData[i + 4] === "C" && xmlData[i + 5] === "T" && xmlData[i + 6] === "Y" && xmlData[i + 7] === "P" && xmlData[i + 8] === "E") {
        i = i + 9;
        let angleBracketsCount = 1;
        let hasBody = false, comment = false;
        let exp = "";
        for (; i < xmlData.length; i++) {
          if (xmlData[i] === "<" && !comment) {
            if (hasBody && isEntity(xmlData, i)) {
              i += 7;
              let entityName, val;
              [entityName, val, i] = readEntityExp(xmlData, i + 1);
              if (val.indexOf("&") === -1)
                entities[validateEntityName(entityName)] = {
                  regx: RegExp(`&${entityName};`, "g"),
                  val
                };
            } else if (hasBody && isElement(xmlData, i)) i += 8;
            else if (hasBody && isAttlist(xmlData, i)) i += 8;
            else if (hasBody && isNotation(xmlData, i)) i += 9;
            else if (isComment) comment = true;
            else throw new Error("Invalid DOCTYPE");
            angleBracketsCount++;
            exp = "";
          } else if (xmlData[i] === ">") {
            if (comment) {
              if (xmlData[i - 1] === "-" && xmlData[i - 2] === "-") {
                comment = false;
                angleBracketsCount--;
              }
            } else {
              angleBracketsCount--;
            }
            if (angleBracketsCount === 0) {
              break;
            }
          } else if (xmlData[i] === "[") {
            hasBody = true;
          } else {
            exp += xmlData[i];
          }
        }
        if (angleBracketsCount !== 0) {
          throw new Error(`Unclosed DOCTYPE`);
        }
      } else {
        throw new Error(`Invalid Tag instead of DOCTYPE`);
      }
      return { entities, i };
    }
    __name(readDocType, "readDocType");
    function readEntityExp(xmlData, i) {
      let entityName = "";
      for (; i < xmlData.length && (xmlData[i] !== "'" && xmlData[i] !== '"'); i++) {
        entityName += xmlData[i];
      }
      entityName = entityName.trim();
      if (entityName.indexOf(" ") !== -1) throw new Error("External entites are not supported");
      const startChar = xmlData[i++];
      let val = "";
      for (; i < xmlData.length && xmlData[i] !== startChar; i++) {
        val += xmlData[i];
      }
      return [entityName, val, i];
    }
    __name(readEntityExp, "readEntityExp");
    function isComment(xmlData, i) {
      if (xmlData[i + 1] === "!" && xmlData[i + 2] === "-" && xmlData[i + 3] === "-") return true;
      return false;
    }
    __name(isComment, "isComment");
    function isEntity(xmlData, i) {
      if (xmlData[i + 1] === "!" && xmlData[i + 2] === "E" && xmlData[i + 3] === "N" && xmlData[i + 4] === "T" && xmlData[i + 5] === "I" && xmlData[i + 6] === "T" && xmlData[i + 7] === "Y") return true;
      return false;
    }
    __name(isEntity, "isEntity");
    function isElement(xmlData, i) {
      if (xmlData[i + 1] === "!" && xmlData[i + 2] === "E" && xmlData[i + 3] === "L" && xmlData[i + 4] === "E" && xmlData[i + 5] === "M" && xmlData[i + 6] === "E" && xmlData[i + 7] === "N" && xmlData[i + 8] === "T") return true;
      return false;
    }
    __name(isElement, "isElement");
    function isAttlist(xmlData, i) {
      if (xmlData[i + 1] === "!" && xmlData[i + 2] === "A" && xmlData[i + 3] === "T" && xmlData[i + 4] === "T" && xmlData[i + 5] === "L" && xmlData[i + 6] === "I" && xmlData[i + 7] === "S" && xmlData[i + 8] === "T") return true;
      return false;
    }
    __name(isAttlist, "isAttlist");
    function isNotation(xmlData, i) {
      if (xmlData[i + 1] === "!" && xmlData[i + 2] === "N" && xmlData[i + 3] === "O" && xmlData[i + 4] === "T" && xmlData[i + 5] === "A" && xmlData[i + 6] === "T" && xmlData[i + 7] === "I" && xmlData[i + 8] === "O" && xmlData[i + 9] === "N") return true;
      return false;
    }
    __name(isNotation, "isNotation");
    function validateEntityName(name) {
      if (util.isName(name))
        return name;
      else
        throw new Error(`Invalid entity name ${name}`);
    }
    __name(validateEntityName, "validateEntityName");
    module.exports = readDocType;
  }
});

// node_modules/strnum/strnum.js
var require_strnum = __commonJS({
  "node_modules/strnum/strnum.js"(exports, module) {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var hexRegex = /^[-+]?0x[a-fA-F0-9]+$/;
    var numRegex = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/;
    var consider = {
      hex: true,
      // oct: false,
      leadingZeros: true,
      decimalPoint: ".",
      eNotation: true
      //skipLike: /regex/
    };
    function toNumber(str, options = {}) {
      options = Object.assign({}, consider, options);
      if (!str || typeof str !== "string") return str;
      let trimmedStr = str.trim();
      if (options.skipLike !== void 0 && options.skipLike.test(trimmedStr)) return str;
      else if (str === "0") return 0;
      else if (options.hex && hexRegex.test(trimmedStr)) {
        return parse_int(trimmedStr, 16);
      } else if (trimmedStr.search(/[eE]/) !== -1) {
        const notation = trimmedStr.match(/^([-\+])?(0*)([0-9]*(\.[0-9]*)?[eE][-\+]?[0-9]+)$/);
        if (notation) {
          if (options.leadingZeros) {
            trimmedStr = (notation[1] || "") + notation[3];
          } else {
            if (notation[2] === "0" && notation[3][0] === ".") {
            } else {
              return str;
            }
          }
          return options.eNotation ? Number(trimmedStr) : str;
        } else {
          return str;
        }
      } else {
        const match = numRegex.exec(trimmedStr);
        if (match) {
          const sign = match[1];
          const leadingZeros = match[2];
          let numTrimmedByZeros = trimZeros(match[3]);
          if (!options.leadingZeros && leadingZeros.length > 0 && sign && trimmedStr[2] !== ".") return str;
          else if (!options.leadingZeros && leadingZeros.length > 0 && !sign && trimmedStr[1] !== ".") return str;
          else if (options.leadingZeros && leadingZeros === str) return 0;
          else {
            const num = Number(trimmedStr);
            const numStr = "" + num;
            if (numStr.search(/[eE]/) !== -1) {
              if (options.eNotation) return num;
              else return str;
            } else if (trimmedStr.indexOf(".") !== -1) {
              if (numStr === "0" && numTrimmedByZeros === "") return num;
              else if (numStr === numTrimmedByZeros) return num;
              else if (sign && numStr === "-" + numTrimmedByZeros) return num;
              else return str;
            }
            if (leadingZeros) {
              return numTrimmedByZeros === numStr || sign + numTrimmedByZeros === numStr ? num : str;
            } else {
              return trimmedStr === numStr || trimmedStr === sign + numStr ? num : str;
            }
          }
        } else {
          return str;
        }
      }
    }
    __name(toNumber, "toNumber");
    function trimZeros(numStr) {
      if (numStr && numStr.indexOf(".") !== -1) {
        numStr = numStr.replace(/0+$/, "");
        if (numStr === ".") numStr = "0";
        else if (numStr[0] === ".") numStr = "0" + numStr;
        else if (numStr[numStr.length - 1] === ".") numStr = numStr.substr(0, numStr.length - 1);
        return numStr;
      }
      return numStr;
    }
    __name(trimZeros, "trimZeros");
    function parse_int(numStr, base) {
      if (parseInt) return parseInt(numStr, base);
      else if (Number.parseInt) return Number.parseInt(numStr, base);
      else if (window && window.parseInt) return window.parseInt(numStr, base);
      else throw new Error("parseInt, Number.parseInt, window.parseInt are not supported");
    }
    __name(parse_int, "parse_int");
    module.exports = toNumber;
  }
});

// node_modules/fast-xml-parser/src/ignoreAttributes.js
var require_ignoreAttributes = __commonJS({
  "node_modules/fast-xml-parser/src/ignoreAttributes.js"(exports, module) {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    function getIgnoreAttributesFn(ignoreAttributes) {
      if (typeof ignoreAttributes === "function") {
        return ignoreAttributes;
      }
      if (Array.isArray(ignoreAttributes)) {
        return (attrName) => {
          for (const pattern of ignoreAttributes) {
            if (typeof pattern === "string" && attrName === pattern) {
              return true;
            }
            if (pattern instanceof RegExp && pattern.test(attrName)) {
              return true;
            }
          }
        };
      }
      return () => false;
    }
    __name(getIgnoreAttributesFn, "getIgnoreAttributesFn");
    module.exports = getIgnoreAttributesFn;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js
var require_OrderedObjParser = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js"(exports, module) {
    "use strict";
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var util = require_util();
    var xmlNode = require_xmlNode();
    var readDocType = require_DocTypeReader();
    var toNumber = require_strnum();
    var getIgnoreAttributesFn = require_ignoreAttributes();
    var OrderedObjParser = class {
      static {
        __name(this, "OrderedObjParser");
      }
      constructor(options) {
        this.options = options;
        this.currentNode = null;
        this.tagsNodeStack = [];
        this.docTypeEntities = {};
        this.lastEntities = {
          "apos": { regex: /&(apos|#39|#x27);/g, val: "'" },
          "gt": { regex: /&(gt|#62|#x3E);/g, val: ">" },
          "lt": { regex: /&(lt|#60|#x3C);/g, val: "<" },
          "quot": { regex: /&(quot|#34|#x22);/g, val: '"' }
        };
        this.ampEntity = { regex: /&(amp|#38|#x26);/g, val: "&" };
        this.htmlEntities = {
          "space": { regex: /&(nbsp|#160);/g, val: " " },
          // "lt" : { regex: /&(lt|#60);/g, val: "<" },
          // "gt" : { regex: /&(gt|#62);/g, val: ">" },
          // "amp" : { regex: /&(amp|#38);/g, val: "&" },
          // "quot" : { regex: /&(quot|#34);/g, val: "\"" },
          // "apos" : { regex: /&(apos|#39);/g, val: "'" },
          "cent": { regex: /&(cent|#162);/g, val: "\xA2" },
          "pound": { regex: /&(pound|#163);/g, val: "\xA3" },
          "yen": { regex: /&(yen|#165);/g, val: "\xA5" },
          "euro": { regex: /&(euro|#8364);/g, val: "\u20AC" },
          "copyright": { regex: /&(copy|#169);/g, val: "\xA9" },
          "reg": { regex: /&(reg|#174);/g, val: "\xAE" },
          "inr": { regex: /&(inr|#8377);/g, val: "\u20B9" },
          "num_dec": { regex: /&#([0-9]{1,7});/g, val: /* @__PURE__ */ __name((_, str) => String.fromCharCode(Number.parseInt(str, 10)), "val") },
          "num_hex": { regex: /&#x([0-9a-fA-F]{1,6});/g, val: /* @__PURE__ */ __name((_, str) => String.fromCharCode(Number.parseInt(str, 16)), "val") }
        };
        this.addExternalEntities = addExternalEntities;
        this.parseXml = parseXml;
        this.parseTextData = parseTextData;
        this.resolveNameSpace = resolveNameSpace;
        this.buildAttributesMap = buildAttributesMap;
        this.isItStopNode = isItStopNode;
        this.replaceEntitiesValue = replaceEntitiesValue;
        this.readStopNodeData = readStopNodeData;
        this.saveTextToParentTag = saveTextToParentTag;
        this.addChild = addChild;
        this.ignoreAttributesFn = getIgnoreAttributesFn(this.options.ignoreAttributes);
      }
    };
    function addExternalEntities(externalEntities) {
      const entKeys = Object.keys(externalEntities);
      for (let i = 0; i < entKeys.length; i++) {
        const ent = entKeys[i];
        this.lastEntities[ent] = {
          regex: new RegExp("&" + ent + ";", "g"),
          val: externalEntities[ent]
        };
      }
    }
    __name(addExternalEntities, "addExternalEntities");
    function parseTextData(val, tagName, jPath, dontTrim, hasAttributes, isLeafNode, escapeEntities) {
      if (val !== void 0) {
        if (this.options.trimValues && !dontTrim) {
          val = val.trim();
        }
        if (val.length > 0) {
          if (!escapeEntities) val = this.replaceEntitiesValue(val);
          const newval = this.options.tagValueProcessor(tagName, val, jPath, hasAttributes, isLeafNode);
          if (newval === null || newval === void 0) {
            return val;
          } else if (typeof newval !== typeof val || newval !== val) {
            return newval;
          } else if (this.options.trimValues) {
            return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
          } else {
            const trimmedVal = val.trim();
            if (trimmedVal === val) {
              return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
            } else {
              return val;
            }
          }
        }
      }
    }
    __name(parseTextData, "parseTextData");
    function resolveNameSpace(tagname) {
      if (this.options.removeNSPrefix) {
        const tags = tagname.split(":");
        const prefix = tagname.charAt(0) === "/" ? "/" : "";
        if (tags[0] === "xmlns") {
          return "";
        }
        if (tags.length === 2) {
          tagname = prefix + tags[1];
        }
      }
      return tagname;
    }
    __name(resolveNameSpace, "resolveNameSpace");
    var attrsRegx = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");
    function buildAttributesMap(attrStr, jPath, tagName) {
      if (this.options.ignoreAttributes !== true && typeof attrStr === "string") {
        const matches = util.getAllMatches(attrStr, attrsRegx);
        const len = matches.length;
        const attrs = {};
        for (let i = 0; i < len; i++) {
          const attrName = this.resolveNameSpace(matches[i][1]);
          if (this.ignoreAttributesFn(attrName, jPath)) {
            continue;
          }
          let oldVal = matches[i][4];
          let aName = this.options.attributeNamePrefix + attrName;
          if (attrName.length) {
            if (this.options.transformAttributeName) {
              aName = this.options.transformAttributeName(aName);
            }
            if (aName === "__proto__") aName = "#__proto__";
            if (oldVal !== void 0) {
              if (this.options.trimValues) {
                oldVal = oldVal.trim();
              }
              oldVal = this.replaceEntitiesValue(oldVal);
              const newVal = this.options.attributeValueProcessor(attrName, oldVal, jPath);
              if (newVal === null || newVal === void 0) {
                attrs[aName] = oldVal;
              } else if (typeof newVal !== typeof oldVal || newVal !== oldVal) {
                attrs[aName] = newVal;
              } else {
                attrs[aName] = parseValue(
                  oldVal,
                  this.options.parseAttributeValue,
                  this.options.numberParseOptions
                );
              }
            } else if (this.options.allowBooleanAttributes) {
              attrs[aName] = true;
            }
          }
        }
        if (!Object.keys(attrs).length) {
          return;
        }
        if (this.options.attributesGroupName) {
          const attrCollection = {};
          attrCollection[this.options.attributesGroupName] = attrs;
          return attrCollection;
        }
        return attrs;
      }
    }
    __name(buildAttributesMap, "buildAttributesMap");
    var parseXml = /* @__PURE__ */ __name(function(xmlData) {
      xmlData = xmlData.replace(/\r\n?/g, "\n");
      const xmlObj = new xmlNode("!xml");
      let currentNode = xmlObj;
      let textData = "";
      let jPath = "";
      for (let i = 0; i < xmlData.length; i++) {
        const ch = xmlData[i];
        if (ch === "<") {
          if (xmlData[i + 1] === "/") {
            const closeIndex = findClosingIndex(xmlData, ">", i, "Closing Tag is not closed.");
            let tagName = xmlData.substring(i + 2, closeIndex).trim();
            if (this.options.removeNSPrefix) {
              const colonIndex = tagName.indexOf(":");
              if (colonIndex !== -1) {
                tagName = tagName.substr(colonIndex + 1);
              }
            }
            if (this.options.transformTagName) {
              tagName = this.options.transformTagName(tagName);
            }
            if (currentNode) {
              textData = this.saveTextToParentTag(textData, currentNode, jPath);
            }
            const lastTagName = jPath.substring(jPath.lastIndexOf(".") + 1);
            if (tagName && this.options.unpairedTags.indexOf(tagName) !== -1) {
              throw new Error(`Unpaired tag can not be used as closing tag: </${tagName}>`);
            }
            let propIndex = 0;
            if (lastTagName && this.options.unpairedTags.indexOf(lastTagName) !== -1) {
              propIndex = jPath.lastIndexOf(".", jPath.lastIndexOf(".") - 1);
              this.tagsNodeStack.pop();
            } else {
              propIndex = jPath.lastIndexOf(".");
            }
            jPath = jPath.substring(0, propIndex);
            currentNode = this.tagsNodeStack.pop();
            textData = "";
            i = closeIndex;
          } else if (xmlData[i + 1] === "?") {
            let tagData = readTagExp(xmlData, i, false, "?>");
            if (!tagData) throw new Error("Pi Tag is not closed.");
            textData = this.saveTextToParentTag(textData, currentNode, jPath);
            if (this.options.ignoreDeclaration && tagData.tagName === "?xml" || this.options.ignorePiTags) {
            } else {
              const childNode = new xmlNode(tagData.tagName);
              childNode.add(this.options.textNodeName, "");
              if (tagData.tagName !== tagData.tagExp && tagData.attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagData.tagExp, jPath, tagData.tagName);
              }
              this.addChild(currentNode, childNode, jPath);
            }
            i = tagData.closeIndex + 1;
          } else if (xmlData.substr(i + 1, 3) === "!--") {
            const endIndex = findClosingIndex(xmlData, "-->", i + 4, "Comment is not closed.");
            if (this.options.commentPropName) {
              const comment = xmlData.substring(i + 4, endIndex - 2);
              textData = this.saveTextToParentTag(textData, currentNode, jPath);
              currentNode.add(this.options.commentPropName, [{ [this.options.textNodeName]: comment }]);
            }
            i = endIndex;
          } else if (xmlData.substr(i + 1, 2) === "!D") {
            const result = readDocType(xmlData, i);
            this.docTypeEntities = result.entities;
            i = result.i;
          } else if (xmlData.substr(i + 1, 2) === "![") {
            const closeIndex = findClosingIndex(xmlData, "]]>", i, "CDATA is not closed.") - 2;
            const tagExp = xmlData.substring(i + 9, closeIndex);
            textData = this.saveTextToParentTag(textData, currentNode, jPath);
            let val = this.parseTextData(tagExp, currentNode.tagname, jPath, true, false, true, true);
            if (val == void 0) val = "";
            if (this.options.cdataPropName) {
              currentNode.add(this.options.cdataPropName, [{ [this.options.textNodeName]: tagExp }]);
            } else {
              currentNode.add(this.options.textNodeName, val);
            }
            i = closeIndex + 2;
          } else {
            let result = readTagExp(xmlData, i, this.options.removeNSPrefix);
            let tagName = result.tagName;
            const rawTagName = result.rawTagName;
            let tagExp = result.tagExp;
            let attrExpPresent = result.attrExpPresent;
            let closeIndex = result.closeIndex;
            if (this.options.transformTagName) {
              tagName = this.options.transformTagName(tagName);
            }
            if (currentNode && textData) {
              if (currentNode.tagname !== "!xml") {
                textData = this.saveTextToParentTag(textData, currentNode, jPath, false);
              }
            }
            const lastTag = currentNode;
            if (lastTag && this.options.unpairedTags.indexOf(lastTag.tagname) !== -1) {
              currentNode = this.tagsNodeStack.pop();
              jPath = jPath.substring(0, jPath.lastIndexOf("."));
            }
            if (tagName !== xmlObj.tagname) {
              jPath += jPath ? "." + tagName : tagName;
            }
            if (this.isItStopNode(this.options.stopNodes, jPath, tagName)) {
              let tagContent = "";
              if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
                if (tagName[tagName.length - 1] === "/") {
                  tagName = tagName.substr(0, tagName.length - 1);
                  jPath = jPath.substr(0, jPath.length - 1);
                  tagExp = tagName;
                } else {
                  tagExp = tagExp.substr(0, tagExp.length - 1);
                }
                i = result.closeIndex;
              } else if (this.options.unpairedTags.indexOf(tagName) !== -1) {
                i = result.closeIndex;
              } else {
                const result2 = this.readStopNodeData(xmlData, rawTagName, closeIndex + 1);
                if (!result2) throw new Error(`Unexpected end of ${rawTagName}`);
                i = result2.i;
                tagContent = result2.tagContent;
              }
              const childNode = new xmlNode(tagName);
              if (tagName !== tagExp && attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
              }
              if (tagContent) {
                tagContent = this.parseTextData(tagContent, tagName, jPath, true, attrExpPresent, true, true);
              }
              jPath = jPath.substr(0, jPath.lastIndexOf("."));
              childNode.add(this.options.textNodeName, tagContent);
              this.addChild(currentNode, childNode, jPath);
            } else {
              if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
                if (tagName[tagName.length - 1] === "/") {
                  tagName = tagName.substr(0, tagName.length - 1);
                  jPath = jPath.substr(0, jPath.length - 1);
                  tagExp = tagName;
                } else {
                  tagExp = tagExp.substr(0, tagExp.length - 1);
                }
                if (this.options.transformTagName) {
                  tagName = this.options.transformTagName(tagName);
                }
                const childNode = new xmlNode(tagName);
                if (tagName !== tagExp && attrExpPresent) {
                  childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
                }
                this.addChild(currentNode, childNode, jPath);
                jPath = jPath.substr(0, jPath.lastIndexOf("."));
              } else {
                const childNode = new xmlNode(tagName);
                this.tagsNodeStack.push(currentNode);
                if (tagName !== tagExp && attrExpPresent) {
                  childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
                }
                this.addChild(currentNode, childNode, jPath);
                currentNode = childNode;
              }
              textData = "";
              i = closeIndex;
            }
          }
        } else {
          textData += xmlData[i];
        }
      }
      return xmlObj.child;
    }, "parseXml");
    function addChild(currentNode, childNode, jPath) {
      const result = this.options.updateTag(childNode.tagname, jPath, childNode[":@"]);
      if (result === false) {
      } else if (typeof result === "string") {
        childNode.tagname = result;
        currentNode.addChild(childNode);
      } else {
        currentNode.addChild(childNode);
      }
    }
    __name(addChild, "addChild");
    var replaceEntitiesValue = /* @__PURE__ */ __name(function(val) {
      if (this.options.processEntities) {
        for (let entityName in this.docTypeEntities) {
          const entity = this.docTypeEntities[entityName];
          val = val.replace(entity.regx, entity.val);
        }
        for (let entityName in this.lastEntities) {
          const entity = this.lastEntities[entityName];
          val = val.replace(entity.regex, entity.val);
        }
        if (this.options.htmlEntities) {
          for (let entityName in this.htmlEntities) {
            const entity = this.htmlEntities[entityName];
            val = val.replace(entity.regex, entity.val);
          }
        }
        val = val.replace(this.ampEntity.regex, this.ampEntity.val);
      }
      return val;
    }, "replaceEntitiesValue");
    function saveTextToParentTag(textData, currentNode, jPath, isLeafNode) {
      if (textData) {
        if (isLeafNode === void 0) isLeafNode = currentNode.child.length === 0;
        textData = this.parseTextData(
          textData,
          currentNode.tagname,
          jPath,
          false,
          currentNode[":@"] ? Object.keys(currentNode[":@"]).length !== 0 : false,
          isLeafNode
        );
        if (textData !== void 0 && textData !== "")
          currentNode.add(this.options.textNodeName, textData);
        textData = "";
      }
      return textData;
    }
    __name(saveTextToParentTag, "saveTextToParentTag");
    function isItStopNode(stopNodes, jPath, currentTagName) {
      const allNodesExp = "*." + currentTagName;
      for (const stopNodePath in stopNodes) {
        const stopNodeExp = stopNodes[stopNodePath];
        if (allNodesExp === stopNodeExp || jPath === stopNodeExp) return true;
      }
      return false;
    }
    __name(isItStopNode, "isItStopNode");
    function tagExpWithClosingIndex(xmlData, i, closingChar = ">") {
      let attrBoundary;
      let tagExp = "";
      for (let index = i; index < xmlData.length; index++) {
        let ch = xmlData[index];
        if (attrBoundary) {
          if (ch === attrBoundary) attrBoundary = "";
        } else if (ch === '"' || ch === "'") {
          attrBoundary = ch;
        } else if (ch === closingChar[0]) {
          if (closingChar[1]) {
            if (xmlData[index + 1] === closingChar[1]) {
              return {
                data: tagExp,
                index
              };
            }
          } else {
            return {
              data: tagExp,
              index
            };
          }
        } else if (ch === "	") {
          ch = " ";
        }
        tagExp += ch;
      }
    }
    __name(tagExpWithClosingIndex, "tagExpWithClosingIndex");
    function findClosingIndex(xmlData, str, i, errMsg) {
      const closingIndex = xmlData.indexOf(str, i);
      if (closingIndex === -1) {
        throw new Error(errMsg);
      } else {
        return closingIndex + str.length - 1;
      }
    }
    __name(findClosingIndex, "findClosingIndex");
    function readTagExp(xmlData, i, removeNSPrefix, closingChar = ">") {
      const result = tagExpWithClosingIndex(xmlData, i + 1, closingChar);
      if (!result) return;
      let tagExp = result.data;
      const closeIndex = result.index;
      const separatorIndex = tagExp.search(/\s/);
      let tagName = tagExp;
      let attrExpPresent = true;
      if (separatorIndex !== -1) {
        tagName = tagExp.substring(0, separatorIndex);
        tagExp = tagExp.substring(separatorIndex + 1).trimStart();
      }
      const rawTagName = tagName;
      if (removeNSPrefix) {
        const colonIndex = tagName.indexOf(":");
        if (colonIndex !== -1) {
          tagName = tagName.substr(colonIndex + 1);
          attrExpPresent = tagName !== result.data.substr(colonIndex + 1);
        }
      }
      return {
        tagName,
        tagExp,
        closeIndex,
        attrExpPresent,
        rawTagName
      };
    }
    __name(readTagExp, "readTagExp");
    function readStopNodeData(xmlData, tagName, i) {
      const startIndex = i;
      let openTagCount = 1;
      for (; i < xmlData.length; i++) {
        if (xmlData[i] === "<") {
          if (xmlData[i + 1] === "/") {
            const closeIndex = findClosingIndex(xmlData, ">", i, `${tagName} is not closed`);
            let closeTagName = xmlData.substring(i + 2, closeIndex).trim();
            if (closeTagName === tagName) {
              openTagCount--;
              if (openTagCount === 0) {
                return {
                  tagContent: xmlData.substring(startIndex, i),
                  i: closeIndex
                };
              }
            }
            i = closeIndex;
          } else if (xmlData[i + 1] === "?") {
            const closeIndex = findClosingIndex(xmlData, "?>", i + 1, "StopNode is not closed.");
            i = closeIndex;
          } else if (xmlData.substr(i + 1, 3) === "!--") {
            const closeIndex = findClosingIndex(xmlData, "-->", i + 3, "StopNode is not closed.");
            i = closeIndex;
          } else if (xmlData.substr(i + 1, 2) === "![") {
            const closeIndex = findClosingIndex(xmlData, "]]>", i, "StopNode is not closed.") - 2;
            i = closeIndex;
          } else {
            const tagData = readTagExp(xmlData, i, ">");
            if (tagData) {
              const openTagName = tagData && tagData.tagName;
              if (openTagName === tagName && tagData.tagExp[tagData.tagExp.length - 1] !== "/") {
                openTagCount++;
              }
              i = tagData.closeIndex;
            }
          }
        }
      }
    }
    __name(readStopNodeData, "readStopNodeData");
    function parseValue(val, shouldParse, options) {
      if (shouldParse && typeof val === "string") {
        const newval = val.trim();
        if (newval === "true") return true;
        else if (newval === "false") return false;
        else return toNumber(val, options);
      } else {
        if (util.isExist(val)) {
          return val;
        } else {
          return "";
        }
      }
    }
    __name(parseValue, "parseValue");
    module.exports = OrderedObjParser;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/node2json.js
var require_node2json = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/node2json.js"(exports) {
    "use strict";
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    function prettify(node, options) {
      return compress(node, options);
    }
    __name(prettify, "prettify");
    function compress(arr, options, jPath) {
      let text;
      const compressedObj = {};
      for (let i = 0; i < arr.length; i++) {
        const tagObj = arr[i];
        const property = propName(tagObj);
        let newJpath = "";
        if (jPath === void 0) newJpath = property;
        else newJpath = jPath + "." + property;
        if (property === options.textNodeName) {
          if (text === void 0) text = tagObj[property];
          else text += "" + tagObj[property];
        } else if (property === void 0) {
          continue;
        } else if (tagObj[property]) {
          let val = compress(tagObj[property], options, newJpath);
          const isLeaf = isLeafTag(val, options);
          if (tagObj[":@"]) {
            assignAttributes(val, tagObj[":@"], newJpath, options);
          } else if (Object.keys(val).length === 1 && val[options.textNodeName] !== void 0 && !options.alwaysCreateTextNode) {
            val = val[options.textNodeName];
          } else if (Object.keys(val).length === 0) {
            if (options.alwaysCreateTextNode) val[options.textNodeName] = "";
            else val = "";
          }
          if (compressedObj[property] !== void 0 && compressedObj.hasOwnProperty(property)) {
            if (!Array.isArray(compressedObj[property])) {
              compressedObj[property] = [compressedObj[property]];
            }
            compressedObj[property].push(val);
          } else {
            if (options.isArray(property, newJpath, isLeaf)) {
              compressedObj[property] = [val];
            } else {
              compressedObj[property] = val;
            }
          }
        }
      }
      if (typeof text === "string") {
        if (text.length > 0) compressedObj[options.textNodeName] = text;
      } else if (text !== void 0) compressedObj[options.textNodeName] = text;
      return compressedObj;
    }
    __name(compress, "compress");
    function propName(obj) {
      const keys = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key !== ":@") return key;
      }
    }
    __name(propName, "propName");
    function assignAttributes(obj, attrMap, jpath, options) {
      if (attrMap) {
        const keys = Object.keys(attrMap);
        const len = keys.length;
        for (let i = 0; i < len; i++) {
          const atrrName = keys[i];
          if (options.isArray(atrrName, jpath + "." + atrrName, true, true)) {
            obj[atrrName] = [attrMap[atrrName]];
          } else {
            obj[atrrName] = attrMap[atrrName];
          }
        }
      }
    }
    __name(assignAttributes, "assignAttributes");
    function isLeafTag(obj, options) {
      const { textNodeName } = options;
      const propCount = Object.keys(obj).length;
      if (propCount === 0) {
        return true;
      }
      if (propCount === 1 && (obj[textNodeName] || typeof obj[textNodeName] === "boolean" || obj[textNodeName] === 0)) {
        return true;
      }
      return false;
    }
    __name(isLeafTag, "isLeafTag");
    exports.prettify = prettify;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/XMLParser.js
var require_XMLParser = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/XMLParser.js"(exports, module) {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var { buildOptions } = require_OptionsBuilder();
    var OrderedObjParser = require_OrderedObjParser();
    var { prettify } = require_node2json();
    var validator = require_validator();
    var XMLParser2 = class {
      static {
        __name(this, "XMLParser");
      }
      constructor(options) {
        this.externalEntities = {};
        this.options = buildOptions(options);
      }
      /**
       * Parse XML dats to JS object 
       * @param {string|Buffer} xmlData 
       * @param {boolean|Object} validationOption 
       */
      parse(xmlData, validationOption) {
        if (typeof xmlData === "string") {
        } else if (xmlData.toString) {
          xmlData = xmlData.toString();
        } else {
          throw new Error("XML data is accepted in String or Bytes[] form.");
        }
        if (validationOption) {
          if (validationOption === true) validationOption = {};
          const result = validator.validate(xmlData, validationOption);
          if (result !== true) {
            throw Error(`${result.err.msg}:${result.err.line}:${result.err.col}`);
          }
        }
        const orderedObjParser = new OrderedObjParser(this.options);
        orderedObjParser.addExternalEntities(this.externalEntities);
        const orderedResult = orderedObjParser.parseXml(xmlData);
        if (this.options.preserveOrder || orderedResult === void 0) return orderedResult;
        else return prettify(orderedResult, this.options);
      }
      /**
       * Add Entity which is not by default supported by this library
       * @param {string} key 
       * @param {string} value 
       */
      addEntity(key, value) {
        if (value.indexOf("&") !== -1) {
          throw new Error("Entity value can't have '&'");
        } else if (key.indexOf("&") !== -1 || key.indexOf(";") !== -1) {
          throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
        } else if (value === "&") {
          throw new Error("An entity with value '&' is not permitted");
        } else {
          this.externalEntities[key] = value;
        }
      }
    };
    module.exports = XMLParser2;
  }
});

// node_modules/fast-xml-parser/src/xmlbuilder/orderedJs2Xml.js
var require_orderedJs2Xml = __commonJS({
  "node_modules/fast-xml-parser/src/xmlbuilder/orderedJs2Xml.js"(exports, module) {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var EOL = "\n";
    function toXml(jArray, options) {
      let indentation = "";
      if (options.format && options.indentBy.length > 0) {
        indentation = EOL;
      }
      return arrToStr(jArray, options, "", indentation);
    }
    __name(toXml, "toXml");
    function arrToStr(arr, options, jPath, indentation) {
      let xmlStr = "";
      let isPreviousElementTag = false;
      for (let i = 0; i < arr.length; i++) {
        const tagObj = arr[i];
        const tagName = propName(tagObj);
        if (tagName === void 0) continue;
        let newJPath = "";
        if (jPath.length === 0) newJPath = tagName;
        else newJPath = `${jPath}.${tagName}`;
        if (tagName === options.textNodeName) {
          let tagText = tagObj[tagName];
          if (!isStopNode(newJPath, options)) {
            tagText = options.tagValueProcessor(tagName, tagText);
            tagText = replaceEntitiesValue(tagText, options);
          }
          if (isPreviousElementTag) {
            xmlStr += indentation;
          }
          xmlStr += tagText;
          isPreviousElementTag = false;
          continue;
        } else if (tagName === options.cdataPropName) {
          if (isPreviousElementTag) {
            xmlStr += indentation;
          }
          xmlStr += `<![CDATA[${tagObj[tagName][0][options.textNodeName]}]]>`;
          isPreviousElementTag = false;
          continue;
        } else if (tagName === options.commentPropName) {
          xmlStr += indentation + `<!--${tagObj[tagName][0][options.textNodeName]}-->`;
          isPreviousElementTag = true;
          continue;
        } else if (tagName[0] === "?") {
          const attStr2 = attr_to_str(tagObj[":@"], options);
          const tempInd = tagName === "?xml" ? "" : indentation;
          let piTextNodeName = tagObj[tagName][0][options.textNodeName];
          piTextNodeName = piTextNodeName.length !== 0 ? " " + piTextNodeName : "";
          xmlStr += tempInd + `<${tagName}${piTextNodeName}${attStr2}?>`;
          isPreviousElementTag = true;
          continue;
        }
        let newIdentation = indentation;
        if (newIdentation !== "") {
          newIdentation += options.indentBy;
        }
        const attStr = attr_to_str(tagObj[":@"], options);
        const tagStart = indentation + `<${tagName}${attStr}`;
        const tagValue = arrToStr(tagObj[tagName], options, newJPath, newIdentation);
        if (options.unpairedTags.indexOf(tagName) !== -1) {
          if (options.suppressUnpairedNode) xmlStr += tagStart + ">";
          else xmlStr += tagStart + "/>";
        } else if ((!tagValue || tagValue.length === 0) && options.suppressEmptyNode) {
          xmlStr += tagStart + "/>";
        } else if (tagValue && tagValue.endsWith(">")) {
          xmlStr += tagStart + `>${tagValue}${indentation}</${tagName}>`;
        } else {
          xmlStr += tagStart + ">";
          if (tagValue && indentation !== "" && (tagValue.includes("/>") || tagValue.includes("</"))) {
            xmlStr += indentation + options.indentBy + tagValue + indentation;
          } else {
            xmlStr += tagValue;
          }
          xmlStr += `</${tagName}>`;
        }
        isPreviousElementTag = true;
      }
      return xmlStr;
    }
    __name(arrToStr, "arrToStr");
    function propName(obj) {
      const keys = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (!obj.hasOwnProperty(key)) continue;
        if (key !== ":@") return key;
      }
    }
    __name(propName, "propName");
    function attr_to_str(attrMap, options) {
      let attrStr = "";
      if (attrMap && !options.ignoreAttributes) {
        for (let attr in attrMap) {
          if (!attrMap.hasOwnProperty(attr)) continue;
          let attrVal = options.attributeValueProcessor(attr, attrMap[attr]);
          attrVal = replaceEntitiesValue(attrVal, options);
          if (attrVal === true && options.suppressBooleanAttributes) {
            attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}`;
          } else {
            attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}="${attrVal}"`;
          }
        }
      }
      return attrStr;
    }
    __name(attr_to_str, "attr_to_str");
    function isStopNode(jPath, options) {
      jPath = jPath.substr(0, jPath.length - options.textNodeName.length - 1);
      let tagName = jPath.substr(jPath.lastIndexOf(".") + 1);
      for (let index in options.stopNodes) {
        if (options.stopNodes[index] === jPath || options.stopNodes[index] === "*." + tagName) return true;
      }
      return false;
    }
    __name(isStopNode, "isStopNode");
    function replaceEntitiesValue(textValue, options) {
      if (textValue && textValue.length > 0 && options.processEntities) {
        for (let i = 0; i < options.entities.length; i++) {
          const entity = options.entities[i];
          textValue = textValue.replace(entity.regex, entity.val);
        }
      }
      return textValue;
    }
    __name(replaceEntitiesValue, "replaceEntitiesValue");
    module.exports = toXml;
  }
});

// node_modules/fast-xml-parser/src/xmlbuilder/json2xml.js
var require_json2xml = __commonJS({
  "node_modules/fast-xml-parser/src/xmlbuilder/json2xml.js"(exports, module) {
    "use strict";
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var buildFromOrderedJs = require_orderedJs2Xml();
    var getIgnoreAttributesFn = require_ignoreAttributes();
    var defaultOptions = {
      attributeNamePrefix: "@_",
      attributesGroupName: false,
      textNodeName: "#text",
      ignoreAttributes: true,
      cdataPropName: false,
      format: false,
      indentBy: "  ",
      suppressEmptyNode: false,
      suppressUnpairedNode: true,
      suppressBooleanAttributes: true,
      tagValueProcessor: /* @__PURE__ */ __name(function(key, a) {
        return a;
      }, "tagValueProcessor"),
      attributeValueProcessor: /* @__PURE__ */ __name(function(attrName, a) {
        return a;
      }, "attributeValueProcessor"),
      preserveOrder: false,
      commentPropName: false,
      unpairedTags: [],
      entities: [
        { regex: new RegExp("&", "g"), val: "&amp;" },
        //it must be on top
        { regex: new RegExp(">", "g"), val: "&gt;" },
        { regex: new RegExp("<", "g"), val: "&lt;" },
        { regex: new RegExp("'", "g"), val: "&apos;" },
        { regex: new RegExp('"', "g"), val: "&quot;" }
      ],
      processEntities: true,
      stopNodes: [],
      // transformTagName: false,
      // transformAttributeName: false,
      oneListGroup: false
    };
    function Builder(options) {
      this.options = Object.assign({}, defaultOptions, options);
      if (this.options.ignoreAttributes === true || this.options.attributesGroupName) {
        this.isAttribute = function() {
          return false;
        };
      } else {
        this.ignoreAttributesFn = getIgnoreAttributesFn(this.options.ignoreAttributes);
        this.attrPrefixLen = this.options.attributeNamePrefix.length;
        this.isAttribute = isAttribute;
      }
      this.processTextOrObjNode = processTextOrObjNode;
      if (this.options.format) {
        this.indentate = indentate;
        this.tagEndChar = ">\n";
        this.newLine = "\n";
      } else {
        this.indentate = function() {
          return "";
        };
        this.tagEndChar = ">";
        this.newLine = "";
      }
    }
    __name(Builder, "Builder");
    Builder.prototype.build = function(jObj) {
      if (this.options.preserveOrder) {
        return buildFromOrderedJs(jObj, this.options);
      } else {
        if (Array.isArray(jObj) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1) {
          jObj = {
            [this.options.arrayNodeName]: jObj
          };
        }
        return this.j2x(jObj, 0, []).val;
      }
    };
    Builder.prototype.j2x = function(jObj, level, ajPath) {
      let attrStr = "";
      let val = "";
      const jPath = ajPath.join(".");
      for (let key in jObj) {
        if (!Object.prototype.hasOwnProperty.call(jObj, key)) continue;
        if (typeof jObj[key] === "undefined") {
          if (this.isAttribute(key)) {
            val += "";
          }
        } else if (jObj[key] === null) {
          if (this.isAttribute(key)) {
            val += "";
          } else if (key === this.options.cdataPropName) {
            val += "";
          } else if (key[0] === "?") {
            val += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
          } else {
            val += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
          }
        } else if (jObj[key] instanceof Date) {
          val += this.buildTextValNode(jObj[key], key, "", level);
        } else if (typeof jObj[key] !== "object") {
          const attr = this.isAttribute(key);
          if (attr && !this.ignoreAttributesFn(attr, jPath)) {
            attrStr += this.buildAttrPairStr(attr, "" + jObj[key]);
          } else if (!attr) {
            if (key === this.options.textNodeName) {
              let newval = this.options.tagValueProcessor(key, "" + jObj[key]);
              val += this.replaceEntitiesValue(newval);
            } else {
              val += this.buildTextValNode(jObj[key], key, "", level);
            }
          }
        } else if (Array.isArray(jObj[key])) {
          const arrLen = jObj[key].length;
          let listTagVal = "";
          let listTagAttr = "";
          for (let j = 0; j < arrLen; j++) {
            const item = jObj[key][j];
            if (typeof item === "undefined") {
            } else if (item === null) {
              if (key[0] === "?") val += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
              else val += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
            } else if (typeof item === "object") {
              if (this.options.oneListGroup) {
                const result = this.j2x(item, level + 1, ajPath.concat(key));
                listTagVal += result.val;
                if (this.options.attributesGroupName && item.hasOwnProperty(this.options.attributesGroupName)) {
                  listTagAttr += result.attrStr;
                }
              } else {
                listTagVal += this.processTextOrObjNode(item, key, level, ajPath);
              }
            } else {
              if (this.options.oneListGroup) {
                let textValue = this.options.tagValueProcessor(key, item);
                textValue = this.replaceEntitiesValue(textValue);
                listTagVal += textValue;
              } else {
                listTagVal += this.buildTextValNode(item, key, "", level);
              }
            }
          }
          if (this.options.oneListGroup) {
            listTagVal = this.buildObjectNode(listTagVal, key, listTagAttr, level);
          }
          val += listTagVal;
        } else {
          if (this.options.attributesGroupName && key === this.options.attributesGroupName) {
            const Ks = Object.keys(jObj[key]);
            const L = Ks.length;
            for (let j = 0; j < L; j++) {
              attrStr += this.buildAttrPairStr(Ks[j], "" + jObj[key][Ks[j]]);
            }
          } else {
            val += this.processTextOrObjNode(jObj[key], key, level, ajPath);
          }
        }
      }
      return { attrStr, val };
    };
    Builder.prototype.buildAttrPairStr = function(attrName, val) {
      val = this.options.attributeValueProcessor(attrName, "" + val);
      val = this.replaceEntitiesValue(val);
      if (this.options.suppressBooleanAttributes && val === "true") {
        return " " + attrName;
      } else return " " + attrName + '="' + val + '"';
    };
    function processTextOrObjNode(object, key, level, ajPath) {
      const result = this.j2x(object, level + 1, ajPath.concat(key));
      if (object[this.options.textNodeName] !== void 0 && Object.keys(object).length === 1) {
        return this.buildTextValNode(object[this.options.textNodeName], key, result.attrStr, level);
      } else {
        return this.buildObjectNode(result.val, key, result.attrStr, level);
      }
    }
    __name(processTextOrObjNode, "processTextOrObjNode");
    Builder.prototype.buildObjectNode = function(val, key, attrStr, level) {
      if (val === "") {
        if (key[0] === "?") return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
        else {
          return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
        }
      } else {
        let tagEndExp = "</" + key + this.tagEndChar;
        let piClosingChar = "";
        if (key[0] === "?") {
          piClosingChar = "?";
          tagEndExp = "";
        }
        if ((attrStr || attrStr === "") && val.indexOf("<") === -1) {
          return this.indentate(level) + "<" + key + attrStr + piClosingChar + ">" + val + tagEndExp;
        } else if (this.options.commentPropName !== false && key === this.options.commentPropName && piClosingChar.length === 0) {
          return this.indentate(level) + `<!--${val}-->` + this.newLine;
        } else {
          return this.indentate(level) + "<" + key + attrStr + piClosingChar + this.tagEndChar + val + this.indentate(level) + tagEndExp;
        }
      }
    };
    Builder.prototype.closeTag = function(key) {
      let closeTag = "";
      if (this.options.unpairedTags.indexOf(key) !== -1) {
        if (!this.options.suppressUnpairedNode) closeTag = "/";
      } else if (this.options.suppressEmptyNode) {
        closeTag = "/";
      } else {
        closeTag = `></${key}`;
      }
      return closeTag;
    };
    Builder.prototype.buildTextValNode = function(val, key, attrStr, level) {
      if (this.options.cdataPropName !== false && key === this.options.cdataPropName) {
        return this.indentate(level) + `<![CDATA[${val}]]>` + this.newLine;
      } else if (this.options.commentPropName !== false && key === this.options.commentPropName) {
        return this.indentate(level) + `<!--${val}-->` + this.newLine;
      } else if (key[0] === "?") {
        return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
      } else {
        let textValue = this.options.tagValueProcessor(key, val);
        textValue = this.replaceEntitiesValue(textValue);
        if (textValue === "") {
          return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
        } else {
          return this.indentate(level) + "<" + key + attrStr + ">" + textValue + "</" + key + this.tagEndChar;
        }
      }
    };
    Builder.prototype.replaceEntitiesValue = function(textValue) {
      if (textValue && textValue.length > 0 && this.options.processEntities) {
        for (let i = 0; i < this.options.entities.length; i++) {
          const entity = this.options.entities[i];
          textValue = textValue.replace(entity.regex, entity.val);
        }
      }
      return textValue;
    };
    function indentate(level) {
      return this.options.indentBy.repeat(level);
    }
    __name(indentate, "indentate");
    function isAttribute(name) {
      if (name.startsWith(this.options.attributeNamePrefix) && name !== this.options.textNodeName) {
        return name.substr(this.attrPrefixLen);
      } else {
        return false;
      }
    }
    __name(isAttribute, "isAttribute");
    module.exports = Builder;
  }
});

// node_modules/fast-xml-parser/src/fxp.js
var require_fxp = __commonJS({
  "node_modules/fast-xml-parser/src/fxp.js"(exports, module) {
    "use strict";
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var validator = require_validator();
    var XMLParser2 = require_XMLParser();
    var XMLBuilder = require_json2xml();
    module.exports = {
      XMLParser: XMLParser2,
      XMLValidator: validator,
      XMLBuilder
    };
  }
});

// utils/rss-parser.js
var rss_parser_exports = {};
__export(rss_parser_exports, {
  RSSParser: () => RSSParser,
  default: () => rss_parser_default,
  parseRSSFeeds: () => parseRSSFeeds
});
async function parseRSSFeeds(env2) {
  const parser = new RSSParser();
  const allArticles = [];
  try {
    const feeds = await env2.DB.prepare(
      "SELECT * FROM rss_feeds WHERE active = 1"
    ).all();
    for (const feed of feeds.results) {
      console.log(`Parsing RSS feed: ${feed.name} (${feed.url})`);
      const articles = await parser.parseFeed(feed.url, feed.category);
      await env2.DB.prepare(
        "UPDATE rss_feeds SET last_fetched = ? WHERE id = ?"
      ).bind((/* @__PURE__ */ new Date()).toISOString(), feed.id).run();
      allArticles.push(...articles);
    }
    const filteredArticles = parser.filterRelevantArticles(allArticles);
    const uniqueArticles = parser.removeDuplicates(filteredArticles);
    const scoredArticles = parser.scoreArticles(uniqueArticles);
    return scoredArticles.slice(0, 20);
  } catch (error3) {
    console.error("Error parsing RSS feeds:", error3);
    return [];
  }
}
var import_fast_xml_parser, RSSParser, rss_parser_default;
var init_rss_parser = __esm({
  "utils/rss-parser.js"() {
    "use strict";
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    import_fast_xml_parser = __toESM(require_fxp(), 1);
    RSSParser = class {
      static {
        __name(this, "RSSParser");
      }
      constructor() {
        this.parser = new import_fast_xml_parser.XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "@_",
          parseAttributeValue: true,
          trimValues: true,
          parseTrueNumberOnly: false,
          parseNodeValue: true,
          parseTagValue: true,
          ignoreNameSpace: false,
          removeNSPrefix: false,
          allowBooleanAttributes: true,
          cdataPropName: "__cdata",
          textNodeName: "#text",
          ignoreDeclaration: true,
          ignorePiTags: true
        });
      }
      /**
       * Parse RSS feed and extract articles
       * @param {string} feedUrl - RSS feed URL
       * @param {string} category - Article category
       * @returns {Promise<Array>} Array of parsed articles
       */
      async parseFeed(feedUrl, category) {
        try {
          const response = await fetch(feedUrl, {
            headers: {
              "User-Agent": "ContainerCode Advisory RSS Parser/1.0",
              "Accept": "application/rss+xml, application/xml, text/xml"
            }
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const xmlData = await response.text();
          const parsed = this.parser.parse(xmlData);
          let items = [];
          if (parsed.rss && parsed.rss.channel && parsed.rss.channel.item) {
            items = Array.isArray(parsed.rss.channel.item) ? parsed.rss.channel.item : [parsed.rss.channel.item];
          } else if (parsed.feed && parsed.feed.entry) {
            items = Array.isArray(parsed.feed.entry) ? parsed.feed.entry : [parsed.feed.entry];
          }
          return items.map((item) => this.normalizeArticle(item, category, feedUrl));
        } catch (error3) {
          console.error(`Error parsing RSS feed ${feedUrl}:`, error3);
          return [];
        }
      }
      /**
       * Normalize article data from different RSS formats
       * @param {Object} item - RSS item
       * @param {string} category - Article category
       * @param {string} feedUrl - Source feed URL
       * @returns {Object} Normalized article object
       */
      normalizeArticle(item, category, feedUrl) {
        if (item.title && item.link) {
          return {
            title: this.cleanText(item.title),
            link: item.link,
            description: this.cleanText(item.description || ""),
            content: this.cleanText(item["content:encoded"] || item.description || ""),
            publishedDate: this.parseDate(item.pubDate),
            author: item.author || item["dc:creator"] || "Unknown",
            category,
            tags: this.extractTags(item),
            source: feedUrl,
            guid: item.guid || item.link
          };
        }
        if (item.title && item.link) {
          return {
            title: this.cleanText(item.title["#text"] || item.title),
            link: item.link["@_href"] || item.link,
            description: this.cleanText(item.summary || ""),
            content: this.cleanText(item.content || item.summary || ""),
            publishedDate: this.parseDate(item.published || item.updated),
            author: item.author?.name || "Unknown",
            category,
            tags: this.extractTags(item),
            source: feedUrl,
            guid: item.id || item.link
          };
        }
        return null;
      }
      /**
       * Clean and sanitize text content
       * @param {string} text - Raw text
       * @returns {string} Cleaned text
       */
      cleanText(text) {
        if (!text) return "";
        return text.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, "").trim().substring(0, 5e3);
      }
      /**
       * Parse date from various formats
       * @param {string} dateString - Date string
       * @returns {Date} Parsed date
       */
      parseDate(dateString) {
        if (!dateString) return /* @__PURE__ */ new Date();
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? /* @__PURE__ */ new Date() : date;
      }
      /**
       * Extract tags from RSS item
       * @param {Object} item - RSS item
       * @returns {Array} Array of tags
       */
      extractTags(item) {
        const tags = [];
        if (item.category) {
          if (Array.isArray(item.category)) {
            tags.push(...item.category.map((cat) => cat["#text"] || cat));
          } else {
            tags.push(item.category["#text"] || item.category);
          }
        }
        if (item["dc:subject"]) {
          tags.push(item["dc:subject"]);
        }
        return tags.filter((tag) => tag && tag.length > 0);
      }
      /**
       * Filter articles by relevance to tech consulting
       * @param {Array} articles - Array of articles
       * @returns {Array} Filtered articles
       */
      filterRelevantArticles(articles) {
        const relevantKeywords = [
          "cloud",
          "devops",
          "kubernetes",
          "docker",
          "aws",
          "azure",
          "gcp",
          "cybersecurity",
          "security",
          "artificial intelligence",
          "ai",
          "machine learning",
          "software engineering",
          "architecture",
          "microservices",
          "api",
          "digital transformation",
          "automation",
          "ci/cd",
          "infrastructure",
          "consulting",
          "enterprise",
          "scalability",
          "performance",
          "monitoring",
          "database",
          "analytics",
          "data science",
          "blockchain",
          "fintech",
          "healthcare tech",
          "startup",
          "innovation",
          "technology trends"
        ];
        return articles.filter((article) => {
          const searchText = `${article.title} ${article.description} ${article.content}`.toLowerCase();
          return relevantKeywords.some(
            (keyword) => searchText.includes(keyword.toLowerCase())
          );
        });
      }
      /**
       * Remove duplicate articles based on title similarity
       * @param {Array} articles - Array of articles
       * @returns {Array} Deduplicated articles
       */
      removeDuplicates(articles) {
        const seen = /* @__PURE__ */ new Set();
        const uniqueArticles = [];
        for (const article of articles) {
          const normalizedTitle = article.title.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
          if (!seen.has(normalizedTitle)) {
            seen.add(normalizedTitle);
            uniqueArticles.push(article);
          }
        }
        return uniqueArticles;
      }
      /**
       * Score articles by relevance and recency
       * @param {Array} articles - Array of articles
       * @returns {Array} Scored and sorted articles
       */
      scoreArticles(articles) {
        const now = /* @__PURE__ */ new Date();
        const dayMs = 24 * 60 * 60 * 1e3;
        return articles.map((article) => {
          let score = 0;
          const age = (now - article.publishedDate) / dayMs;
          score += Math.max(0, 10 - age);
          const contentLength = article.content.length;
          if (contentLength > 500) score += 5;
          if (contentLength > 1e3) score += 3;
          if (contentLength > 2e3) score += 2;
          const title2 = article.title.toLowerCase();
          const highValueKeywords = [
            "kubernetes",
            "docker",
            "aws",
            "azure",
            "cloud native",
            "cybersecurity",
            "zero trust",
            "devsecops",
            "ai",
            "machine learning",
            "digital transformation",
            "enterprise",
            "scalability"
          ];
          highValueKeywords.forEach((keyword) => {
            if (title2.includes(keyword)) score += 3;
          });
          return { ...article, score };
        }).sort((a, b) => b.score - a.score);
      }
    };
    __name(parseRSSFeeds, "parseRSSFeeds");
    rss_parser_default = RSSParser;
  }
});

// utils/image-generator.js
var image_generator_exports = {};
__export(image_generator_exports, {
  ImageGenerator: () => ImageGenerator,
  default: () => image_generator_default,
  generateArticleImage: () => generateArticleImage,
  generateNewsletterImage: () => generateNewsletterImage
});
async function generateArticleImage(article, ai, r2Bucket) {
  const generator = new ImageGenerator(ai, r2Bucket);
  return await generator.generateArticleImage(article);
}
async function generateNewsletterImage(newsletter, ai, r2Bucket) {
  const generator = new ImageGenerator(ai, r2Bucket);
  return await generator.generateNewsletterImage(newsletter);
}
var ImageGenerator, image_generator_default;
var init_image_generator = __esm({
  "utils/image-generator.js"() {
    "use strict";
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ImageGenerator = class {
      static {
        __name(this, "ImageGenerator");
      }
      constructor(ai, r2Bucket) {
        this.ai = ai;
        this.r2Bucket = r2Bucket;
        this.defaultStyle = "professional, clean, modern, technology consulting, blue and white color scheme, minimal, corporate";
      }
      /**
       * Generate header image for article
       * @param {Object} article - Article data
       * @returns {Promise<string>} Generated image URL
       */
      async generateArticleImage(article) {
        try {
          const imagePrompt = this.createImagePrompt(article);
          const imageBlob = await this.generateImage(imagePrompt);
          const imageUrl = await this.storeImage(imageBlob, article);
          return imageUrl;
        } catch (error3) {
          console.error("Error generating article image:", error3);
          return this.getFallbackImage(article.category);
        }
      }
      /**
       * Create image generation prompt
       * @param {Object} article - Article data
       * @returns {string} Image generation prompt
       */
      createImagePrompt(article) {
        const categoryPrompts = {
          "ai": "artificial intelligence, neural networks, machine learning, futuristic technology, brain circuits, data visualization",
          "devops": "software development, continuous integration, deployment pipeline, code collaboration, automation, servers",
          "cybersecurity": "digital security, shield, lock, network protection, cyber defense, secure systems",
          "cloud": "cloud computing, servers, data centers, network infrastructure, scalable architecture, distributed systems",
          "software_engineering": "code development, programming, software architecture, clean code, system design, development team",
          "technology": "modern technology, digital transformation, innovation, enterprise solutions, business technology"
        };
        const categoryStyle = categoryPrompts[article.category] || "technology, consulting, professional";
        const prompt = `
Professional header image for a technology consulting blog article.
Title: "${article.title}"
Category: ${article.category}
Style: ${categoryStyle}, ${this.defaultStyle}
Requirements: 
- Clean, professional appearance suitable for enterprise audience
- Technology-focused visual elements
- Modern design with blue and white color scheme
- No text or words in the image
- Landscape orientation (16:9 ratio)
- High quality, suitable for web use
- Minimalist design with clear focal point
`.trim();
        return prompt;
      }
      /**
       * Generate image using Stable Diffusion
       * @param {string} prompt - Image generation prompt
       * @returns {Promise<Blob>} Generated image blob
       */
      async generateImage(prompt) {
        try {
          console.log("Generating image with prompt:", prompt);
          const response = await this.ai.run("@cf/stabilityai/stable-diffusion-xl-base-1.0", {
            prompt,
            num_steps: 20,
            strength: 1,
            guidance: 7.5,
            width: 1024,
            height: 576
            // 16:9 aspect ratio
          });
          if (!response) {
            throw new Error("No response from AI model");
          }
          return response;
        } catch (error3) {
          console.error("Error generating image with Stable Diffusion:", error3);
          try {
            const response = await this.ai.run("@cf/black-forest-labs/flux-1-schnell", {
              prompt,
              num_steps: 4,
              width: 1024,
              height: 576
            });
            return response;
          } catch (fallbackError) {
            console.error("Error with fallback model:", fallbackError);
            throw new Error("Failed to generate image with both models");
          }
        }
      }
      /**
       * Store generated image in R2 bucket
       * @param {Blob} imageBlob - Generated image blob
       * @param {Object} article - Article data
       * @returns {Promise<string>} Image URL
       */
      async storeImage(imageBlob, article) {
        try {
          const filename = this.generateImageFilename(article);
          const key = `blog-images/${filename}`;
          await this.r2Bucket.put(key, imageBlob, {
            httpMetadata: {
              contentType: "image/png",
              cacheControl: "public, max-age=31536000"
              // 1 year
            },
            customMetadata: {
              articleId: article.id?.toString() || "unknown",
              category: article.category || "general",
              title: article.title || "untitled",
              generatedAt: (/* @__PURE__ */ new Date()).toISOString()
            }
          });
          return `https://pub-your-bucket-id.r2.dev/${key}`;
        } catch (error3) {
          console.error("Error storing image:", error3);
          throw error3;
        }
      }
      /**
       * Generate unique filename for image
       * @param {Object} article - Article data
       * @returns {string} Image filename
       */
      generateImageFilename(article) {
        const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
        const slug = article.slug || this.generateSlug(article.title);
        return `${slug}-${timestamp}.png`;
      }
      /**
       * Generate URL-friendly slug
       * @param {string} title - Article title
       * @returns {string} URL slug
       */
      generateSlug(title2) {
        return (title2 || "untitled").toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").substring(0, 50);
      }
      /**
       * Get fallback image URL for category
       * @param {string} category - Article category
       * @returns {string} Fallback image URL
       */
      getFallbackImage(category) {
        const fallbackImages = {
          "ai": "/images/hero-innovation.svg",
          "devops": "/images/hero-devops.svg",
          "cybersecurity": "/images/hero-cybersecurity.svg",
          "cloud": "/images/hero-cloud-computing.svg",
          "software_engineering": "/images/development-code.svg",
          "technology": "/images/hero-main.svg"
        };
        return fallbackImages[category] || "/images/hero-main.svg";
      }
      /**
       * Generate multiple image variations
       * @param {Object} article - Article data
       * @param {number} count - Number of variations to generate
       * @returns {Promise<Array>} Array of image URLs
       */
      async generateImageVariations(article, count3 = 3) {
        const variations = [];
        const basePrompt = this.createImagePrompt(article);
        const styleVariations = [
          "minimalist, clean lines, geometric shapes",
          "gradient background, modern icons, abstract elements",
          "isometric illustration, 3D elements, depth"
        ];
        for (let i = 0; i < Math.min(count3, styleVariations.length); i++) {
          try {
            const variantPrompt = `${basePrompt}, ${styleVariations[i]}`;
            const imageBlob = await this.generateImage(variantPrompt);
            const imageUrl = await this.storeImage(imageBlob, {
              ...article,
              slug: `${article.slug}-variant-${i + 1}`
            });
            variations.push(imageUrl);
          } catch (error3) {
            console.error(`Error generating image variation ${i + 1}:`, error3);
          }
        }
        return variations;
      }
      /**
       * Generate newsletter header image
       * @param {Object} newsletter - Newsletter data
       * @returns {Promise<string>} Newsletter header image URL
       */
      async generateNewsletterImage(newsletter) {
        try {
          const prompt = `
Professional newsletter header image for ContainerCode Advisory.
Subject: "${newsletter.subject}"
Style: ${this.defaultStyle}
Requirements:
- Corporate newsletter design
- ContainerCode Advisory branding feel
- Professional technology consulting theme
- Email header format (wide aspect ratio)
- Clean, modern design
- Blue and white color scheme
- No text or words in the image
`.trim();
          const imageBlob = await this.generateImage(prompt);
          const imageUrl = await this.storeImage(imageBlob, {
            slug: `newsletter-${newsletter.issue_number}`,
            category: "newsletter",
            title: newsletter.subject
          });
          return imageUrl;
        } catch (error3) {
          console.error("Error generating newsletter image:", error3);
          return "/images/containercode-logo-horizontal.svg";
        }
      }
      /**
       * Cleanup old images from R2 bucket
       * @param {number} daysOld - Delete images older than this many days
       * @returns {Promise<number>} Number of images deleted
       */
      async cleanupOldImages(daysOld = 30) {
        try {
          const cutoffDate = /* @__PURE__ */ new Date();
          cutoffDate.setDate(cutoffDate.getDate() - daysOld);
          const objects = await this.r2Bucket.list({ prefix: "blog-images/" });
          let deletedCount = 0;
          for (const object of objects.objects) {
            if (object.uploaded < cutoffDate) {
              await this.r2Bucket.delete(object.key);
              deletedCount++;
            }
          }
          console.log(`Cleaned up ${deletedCount} old images`);
          return deletedCount;
        } catch (error3) {
          console.error("Error cleaning up old images:", error3);
          return 0;
        }
      }
    };
    __name(generateArticleImage, "generateArticleImage");
    __name(generateNewsletterImage, "generateNewsletterImage");
    image_generator_default = ImageGenerator;
  }
});

// article-generator.js
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
init_rss_parser();

// utils/content-generator.js
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var ContentGenerator = class {
  static {
    __name(this, "ContentGenerator");
  }
  constructor(ai) {
    this.ai = ai;
  }
  /**
   * Generate a comprehensive article from RSS feed item
   * @param {Object} rssItem - RSS feed item
   * @param {string} category - Article category
   * @returns {Promise<Object>} Generated article
   */
  async generateArticle(rssItem, category) {
    try {
      const articleContent = await this.generateArticleContent(rssItem, category);
      const seoContent = await this.generateSEOContent(articleContent.title, articleContent.content);
      const summary = await this.generateSummary(articleContent.content);
      const excerpt = await this.generateExcerpt(articleContent.content);
      const slug = this.generateSlug(articleContent.title);
      const readingTime = this.calculateReadingTime(articleContent.content);
      const wordCount = this.countWords(articleContent.content);
      return {
        title: articleContent.title,
        content: articleContent.content,
        summary,
        excerpt,
        slug,
        seo_title: seoContent.title,
        seo_description: seoContent.description,
        category,
        tags: this.extractTags(articleContent.content, category),
        reading_time: readingTime,
        word_count: wordCount,
        source_url: rssItem.link,
        source_feed: rssItem.source,
        author: "ContainerCode Advisory Team",
        status: "draft",
        validation_status: "pending"
      };
    } catch (error3) {
      console.error("Error generating article:", error3);
      throw error3;
    }
  }
  /**
   * Generate comprehensive article content using AI
   * @param {Object} rssItem - RSS feed item
   * @param {string} category - Article category
   * @returns {Promise<Object>} Generated content
   */
  async generateArticleContent(rssItem, category) {
    const prompt = `
You are a senior technology consultant writing for ContainerCode Advisory, a UK-based technology consulting firm specializing in cloud technologies, cybersecurity, DevOps, and digital transformation.

Based on the following RSS feed item, create a comprehensive, professional article that provides valuable insights to enterprise technology decision-makers:

RSS Item:
- Title: ${rssItem.title}
- Description: ${rssItem.description}
- Content: ${rssItem.content.substring(0, 2e3)}
- Category: ${category}
- Source: ${rssItem.source}

Requirements:
1. Write in British English (use "colour", "realise", "centre", etc.)
2. Target audience: CTOs, IT Directors, and senior technology managers
3. Focus on practical business implications and strategic considerations
4. Include actionable insights and recommendations
5. Maintain a professional, authoritative tone
6. Length: 1500-2500 words
7. Structure with clear headings and subheadings
8. Include relevant technical depth without being overly complex
9. Reference current industry trends and best practices
10. Conclude with specific next steps or recommendations

Please provide:
- A compelling, professional title (different from the RSS title)
- Comprehensive article content with proper structure
- Business-focused perspective on the technology topic

Format the response as JSON with 'title' and 'content' fields.
`;
    try {
      const response = await this.ai.run("@cf/meta/llama-3.1-8b-instruct", {
        prompt,
        max_tokens: 4e3,
        temperature: 0.7,
        top_p: 0.9
      });
      let result;
      try {
        result = JSON.parse(response.response);
      } catch (parseError) {
        const lines = response.response.split("\n");
        const titleMatch = lines.find((line) => line.includes("Title:") || line.includes("title:"));
        const title2 = titleMatch ? titleMatch.replace(/.*title:\s*/i, "").trim() : rssItem.title;
        const contentStart = lines.findIndex((line) => line.includes("Content:") || line.includes("content:"));
        const content = contentStart > -1 ? lines.slice(contentStart + 1).join("\n").trim() : response.response;
        result = { title: title2, content };
      }
      return {
        title: result.title || rssItem.title,
        content: result.content || response.response
      };
    } catch (error3) {
      console.error("Error generating article content:", error3);
      return {
        title: `${rssItem.title} - A ContainerCode Advisory Analysis`,
        content: this.generateFallbackContent(rssItem, category)
      };
    }
  }
  /**
   * Generate SEO-optimized title and description
   * @param {string} title - Article title
   * @param {string} content - Article content
   * @returns {Promise<Object>} SEO content
   */
  async generateSEOContent(title2, content) {
    const prompt = `
Generate SEO-optimized title and meta description for a technology consulting article.

Article Title: ${title2}
Article Content: ${content.substring(0, 1e3)}...

Requirements:
1. SEO Title: 50-60 characters, include main keyword
2. Meta Description: 150-160 characters, compelling and informative
3. Focus on UK technology consulting keywords
4. Include relevant technical terms
5. Make it appealing to enterprise decision-makers

Format as JSON with 'title' and 'description' fields.
`;
    try {
      const response = await this.ai.run("@cf/meta/llama-3.1-8b-instruct", {
        prompt,
        max_tokens: 300,
        temperature: 0.5
      });
      const result = JSON.parse(response.response);
      return {
        title: result.title || title2,
        description: result.description || content.substring(0, 160) + "..."
      };
    } catch (error3) {
      console.error("Error generating SEO content:", error3);
      return {
        title: title2.substring(0, 60),
        description: content.substring(0, 160) + "..."
      };
    }
  }
  /**
   * Generate article summary
   * @param {string} content - Article content
   * @returns {Promise<string>} Summary
   */
  async generateSummary(content) {
    const prompt = `
Create a concise, professional summary of this technology article in 2-3 sentences.
Focus on the key insights and business implications.

Article Content: ${content.substring(0, 2e3)}...

Requirements:
1. Use British English
2. Professional tone
3. Highlight main benefits and implications
4. 2-3 sentences maximum
`;
    try {
      const response = await this.ai.run("@cf/meta/llama-3.1-8b-instruct", {
        prompt,
        max_tokens: 200,
        temperature: 0.5
      });
      return response.response.trim();
    } catch (error3) {
      console.error("Error generating summary:", error3);
      return content.substring(0, 200) + "...";
    }
  }
  /**
   * Generate article excerpt
   * @param {string} content - Article content
   * @returns {Promise<string>} Excerpt
   */
  async generateExcerpt(content) {
    const prompt = `
Create a compelling 1-sentence excerpt from this technology article.
Make it engaging and informative for enterprise technology leaders.

Article Content: ${content.substring(0, 1e3)}...

Requirements:
1. One sentence only
2. Engaging and professional
3. Use British English
4. Include main benefit or insight
`;
    try {
      const response = await this.ai.run("@cf/meta/llama-3.1-8b-instruct", {
        prompt,
        max_tokens: 100,
        temperature: 0.6
      });
      return response.response.trim();
    } catch (error3) {
      console.error("Error generating excerpt:", error3);
      return content.substring(0, 100) + "...";
    }
  }
  /**
   * Generate fallback content when AI fails
   * @param {Object} rssItem - RSS feed item
   * @param {string} category - Article category
   * @returns {string} Fallback content
   */
  generateFallbackContent(rssItem, category) {
    return `
# ${rssItem.title}

## Introduction

This article explores the latest developments in ${category} and their implications for enterprise technology strategy.

## Key Insights

${rssItem.description}

## Business Implications

${rssItem.content}

## ContainerCode Advisory Perspective

As technology consultants specialising in ${category}, we believe these developments present both opportunities and challenges for enterprise organisations.

## Next Steps

For organisations looking to leverage these technologies:

1. Assess current infrastructure and capabilities
2. Develop a strategic implementation roadmap
3. Consider partnering with experienced consultants
4. Focus on security and compliance requirements
5. Plan for ongoing maintenance and support

## Conclusion

The evolving landscape of ${category} continues to present new opportunities for digital transformation and operational excellence.

---

*This analysis is provided by ContainerCode Advisory, your trusted partner for enterprise technology consulting.*
`;
  }
  /**
   * Extract relevant tags from content
   * @param {string} content - Article content
   * @param {string} category - Article category
   * @returns {Array} Array of tags
   */
  extractTags(content, category) {
    const contentLower = content.toLowerCase();
    const tagMap = {
      "ai": ["artificial intelligence", "machine learning", "automation", "ai strategy", "ml ops"],
      "devops": ["kubernetes", "docker", "ci/cd", "infrastructure", "automation", "monitoring"],
      "cybersecurity": ["security", "compliance", "threat detection", "zero trust", "data protection"],
      "cloud": ["aws", "azure", "gcp", "cloud migration", "multi-cloud", "hybrid cloud"],
      "software_engineering": ["architecture", "microservices", "api", "scalability", "performance"],
      "technology": ["digital transformation", "innovation", "enterprise", "strategy"]
    };
    const tags = [category];
    const relevantTags = tagMap[category] || [];
    relevantTags.forEach((tag) => {
      if (contentLower.includes(tag)) {
        tags.push(tag);
      }
    });
    return [...new Set(tags)];
  }
  /**
   * Generate URL-friendly slug
   * @param {string} title - Article title
   * @returns {string} URL slug
   */
  generateSlug(title2) {
    return title2.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").substring(0, 50);
  }
  /**
   * Calculate reading time in minutes
   * @param {string} content - Article content
   * @returns {number} Reading time in minutes
   */
  calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const wordCount = this.countWords(content);
    return Math.ceil(wordCount / wordsPerMinute);
  }
  /**
   * Count words in content
   * @param {string} content - Article content
   * @returns {number} Word count
   */
  countWords(content) {
    return content.trim().split(/\s+/).length;
  }
};
async function generateArticle(rssItem, category, ai) {
  const generator = new ContentGenerator(ai);
  return await generator.generateArticle(rssItem, category);
}
__name(generateArticle, "generateArticle");

// utils/content-validator.js
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var ContentValidator = class {
  static {
    __name(this, "ContentValidator");
  }
  constructor() {
    this.britishSpellings = {
      "color": "colour",
      "colors": "colours",
      "colorful": "colourful",
      "coloring": "colouring",
      "colored": "coloured",
      "favor": "favour",
      "favors": "favours",
      "favorable": "favourable",
      "favorite": "favourite",
      "favorites": "favourites",
      "honor": "honour",
      "honors": "honours",
      "honorable": "honourable",
      "labor": "labour",
      "labors": "labours",
      "neighbor": "neighbour",
      "neighbors": "neighbours",
      "rumor": "rumour",
      "rumors": "rumours",
      "humor": "humour",
      "humors": "humours",
      "tumor": "tumour",
      "tumors": "tumours",
      "realize": "realise",
      "realizes": "realises",
      "realized": "realised",
      "realizing": "realising",
      "recognize": "recognise",
      "recognizes": "recognises",
      "recognized": "recognised",
      "recognizing": "recognising",
      "organize": "organise",
      "organizes": "organises",
      "organized": "organised",
      "organizing": "organising",
      "organization": "organisation",
      "organizations": "organisations",
      "analyze": "analyse",
      "analyzes": "analyses",
      "analyzed": "analysed",
      "analyzing": "analysing",
      "analysis": "analysis",
      "utilize": "utilise",
      "utilizes": "utilises",
      "utilized": "utilised",
      "utilizing": "utilising",
      "capitalize": "capitalise",
      "capitalizes": "capitalises",
      "capitalized": "capitalised",
      "capitalizing": "capitalising",
      "center": "centre",
      "centers": "centres",
      "centered": "centred",
      "centering": "centring",
      "theater": "theatre",
      "theaters": "theatres",
      "meter": "metre",
      "meters": "metres",
      "liter": "litre",
      "liters": "litres",
      "fiber": "fibre",
      "fibers": "fibres",
      "defense": "defence",
      "defenses": "defences",
      "offense": "offence",
      "offenses": "offences",
      "license": "licence",
      "licenses": "licences",
      "practice": "practise",
      "practices": "practises",
      "advice": "advice",
      "advise": "advise",
      "device": "device",
      "devise": "devise",
      "gray": "grey",
      "grays": "greys",
      "grayish": "greyish",
      "aging": "ageing",
      "catalog": "catalogue",
      "catalogs": "catalogues",
      "dialog": "dialogue",
      "dialogs": "dialogues",
      "program": "programme",
      "programs": "programmes",
      "check": "check",
      "checks": "checks",
      "tire": "tyre",
      "tires": "tyres",
      "aluminum": "aluminium",
      "draft": "draught",
      "drafts": "draughts"
    };
    this.britishTerms = [
      "whilst",
      "amongst",
      "towards",
      "backwards",
      "forwards",
      "afterwards",
      "learnt",
      "burnt",
      "dreamt",
      "spelt",
      "smelt",
      "leapt",
      "behaviour",
      "flavour",
      "honour",
      "labour",
      "neighbour",
      "colour",
      "organisation",
      "realise",
      "recognise",
      "analyse",
      "centre",
      "theatre",
      "metre",
      "litre",
      "defence",
      "offence",
      "licence",
      "practise",
      "grey",
      "ageing",
      "catalogue",
      "dialogue",
      "programme",
      "tyre",
      "aluminium"
    ];
    this.requiredElements = [
      "title",
      "content",
      "summary",
      "category"
    ];
    this.minLengths = {
      title: 10,
      content: 500,
      summary: 50,
      excerpt: 30
    };
    this.maxLengths = {
      title: 100,
      seo_title: 60,
      seo_description: 160,
      summary: 300,
      excerpt: 150
    };
  }
  /**
   * Validate article content comprehensively
   * @param {Object} article - Article object to validate
   * @returns {Object} Validation result
   */
  async validateArticle(article) {
    const errors = [];
    const warnings = [];
    this.validateRequiredFields(article, errors);
    this.validateContentLength(article, errors, warnings);
    this.validateBritishEnglish(article, errors, warnings);
    this.validateContentStructure(article, errors, warnings);
    this.validateSEO(article, errors, warnings);
    this.validateProfessionalTone(article, warnings);
    this.validateBusinessRelevance(article, warnings);
    const isValid = errors.length === 0;
    return {
      isValid,
      errors,
      warnings,
      score: this.calculateQualityScore(article, errors, warnings),
      recommendations: this.generateRecommendations(errors, warnings)
    };
  }
  /**
   * Validate required fields are present
   * @param {Object} article - Article object
   * @param {Array} errors - Array to push errors to
   */
  validateRequiredFields(article, errors) {
    this.requiredElements.forEach((field) => {
      if (!article[field] || article[field].trim().length === 0) {
        errors.push(`Missing required field: ${field}`);
      }
    });
  }
  /**
   * Validate content length requirements
   * @param {Object} article - Article object
   * @param {Array} errors - Array to push errors to
   * @param {Array} warnings - Array to push warnings to
   */
  validateContentLength(article, errors, warnings) {
    Object.entries(this.minLengths).forEach(([field, minLength]) => {
      if (article[field] && article[field].length < minLength) {
        errors.push(`${field} must be at least ${minLength} characters (current: ${article[field].length})`);
      }
    });
    Object.entries(this.maxLengths).forEach(([field, maxLength]) => {
      if (article[field] && article[field].length > maxLength) {
        errors.push(`${field} must be no more than ${maxLength} characters (current: ${article[field].length})`);
      }
    });
    if (article.content && article.content.length < 1e3) {
      warnings.push("Content length is below recommended minimum of 1000 characters for comprehensive articles");
    }
    if (article.content && article.content.length > 1e4) {
      warnings.push("Content length is above recommended maximum of 10000 characters - consider breaking into multiple articles");
    }
  }
  /**
   * Validate British English usage
   * @param {Object} article - Article object
   * @param {Array} errors - Array to push errors to
   * @param {Array} warnings - Array to push warnings to
   */
  validateBritishEnglish(article, errors, warnings) {
    const textToCheck = `${article.title || ""} ${article.content || ""} ${article.summary || ""}`.toLowerCase();
    const americanSpellings = [];
    Object.entries(this.britishSpellings).forEach(([american, british]) => {
      const americanRegex = new RegExp(`\\b${american}\\b`, "gi");
      if (americanRegex.test(textToCheck)) {
        americanSpellings.push({ american, british });
      }
    });
    if (americanSpellings.length > 0) {
      errors.push(`American spellings detected. Please use British English: ${americanSpellings.map((s) => `"${s.american}" \u2192 "${s.british}"`).join(", ")}`);
    }
    const britishTermsFound = this.britishTerms.filter(
      (term) => textToCheck.includes(term.toLowerCase())
    );
    if (britishTermsFound.length === 0) {
      warnings.push("Consider using more British English terms to maintain consistency with UK audience");
    }
    const izeWords = textToCheck.match(/\b\w+ize\b/gi);
    if (izeWords && izeWords.length > 0) {
      warnings.push(`Consider using -ise endings instead of -ize for British English: ${izeWords.join(", ")}`);
    }
  }
  /**
   * Validate content structure and formatting
   * @param {Object} article - Article object
   * @param {Array} errors - Array to push errors to
   * @param {Array} warnings - Array to push warnings to
   */
  validateContentStructure(article, errors, warnings) {
    if (!article.content) return;
    const content = article.content;
    const headings = content.match(/^#{1,6}\s.+$/gm);
    if (!headings || headings.length < 2) {
      warnings.push("Content should include multiple headings for better structure");
    }
    const paragraphs = content.split("\n\n").filter((p) => p.trim().length > 0);
    if (paragraphs.length < 3) {
      warnings.push("Content should be broken into multiple paragraphs for better readability");
    }
    const firstParagraph = paragraphs[0];
    if (firstParagraph && firstParagraph.length < 100) {
      warnings.push("Introduction paragraph should be more substantial (at least 100 characters)");
    }
    const lastParagraph = paragraphs[paragraphs.length - 1];
    const conclusionKeywords = ["conclusion", "summary", "in summary", "to conclude", "finally", "next steps"];
    const hasConclusion = conclusionKeywords.some(
      (keyword) => lastParagraph.toLowerCase().includes(keyword)
    );
    if (!hasConclusion) {
      warnings.push("Consider adding a clear conclusion or next steps section");
    }
    const hasLists = content.includes("- ") || content.includes("* ") || /\d+\.\s/.test(content);
    if (!hasLists) {
      warnings.push("Consider adding lists or bullet points to improve readability");
    }
    if (content.includes("!!!") || content.includes("???")) {
      errors.push("Avoid excessive punctuation - maintain professional tone");
    }
    if (content.includes("  ")) {
      warnings.push("Remove extra spaces for cleaner formatting");
    }
  }
  /**
   * Validate SEO elements
   * @param {Object} article - Article object
   * @param {Array} errors - Array to push errors to
   * @param {Array} warnings - Array to push warnings to
   */
  validateSEO(article, errors, warnings) {
    if (article.seo_title) {
      if (article.seo_title.length < 30) {
        warnings.push("SEO title is too short - aim for 50-60 characters");
      }
      if (article.seo_title.length > 60) {
        errors.push("SEO title is too long - must be under 60 characters");
      }
    }
    if (article.seo_description) {
      if (article.seo_description.length < 120) {
        warnings.push("SEO description is too short - aim for 150-160 characters");
      }
      if (article.seo_description.length > 160) {
        errors.push("SEO description is too long - must be under 160 characters");
      }
    }
    const title2 = article.title.toLowerCase();
    const content = article.content.toLowerCase();
    const category = article.category.toLowerCase();
    if (!content.includes(category)) {
      warnings.push(`Content should include the category keyword "${category}" for better SEO`);
    }
    const techKeywords = ["technology", "digital", "enterprise", "solution", "strategy", "consulting"];
    const keywordCount = techKeywords.filter((keyword) => content.includes(keyword)).length;
    if (keywordCount < 2) {
      warnings.push("Consider including more relevant technology consulting keywords");
    }
  }
  /**
   * Validate professional tone
   * @param {Object} article - Article object
   * @param {Array} warnings - Array to push warnings to
   */
  validateProfessionalTone(article, warnings) {
    const content = article.content.toLowerCase();
    const informalWords = ["gonna", "wanna", "kinda", "sorta", "yeah", "ok", "awesome", "cool", "stuff"];
    const informalFound = informalWords.filter((word) => content.includes(word));
    if (informalFound.length > 0) {
      warnings.push(`Avoid informal language for professional tone: ${informalFound.join(", ")}`);
    }
    const firstPersonWords = ["i ", "me ", "my ", "mine ", "myself"];
    const firstPersonFound = firstPersonWords.filter((word) => content.includes(word));
    if (firstPersonFound.length > 2) {
      warnings.push("Consider reducing first-person language for more authoritative tone");
    }
    const contractions = ["won't", "can't", "don't", "isn't", "aren't", "wasn't", "weren't", "haven't", "hasn't", "hadn't"];
    const contractionsFound = contractions.filter((contraction) => content.includes(contraction));
    if (contractionsFound.length > 0) {
      warnings.push(`Consider avoiding contractions for formal tone: ${contractionsFound.join(", ")}`);
    }
  }
  /**
   * Validate business relevance
   * @param {Object} article - Article object
   * @param {Array} warnings - Array to push warnings to
   */
  validateBusinessRelevance(article, warnings) {
    const content = article.content.toLowerCase();
    const businessKeywords = [
      "business",
      "enterprise",
      "organization",
      "company",
      "roi",
      "cost",
      "efficiency",
      "productivity",
      "strategy",
      "competitive",
      "market",
      "revenue",
      "profit",
      "investment",
      "budget",
      "resources",
      "scalability"
    ];
    const businessKeywordCount = businessKeywords.filter((keyword) => content.includes(keyword)).length;
    if (businessKeywordCount < 3) {
      warnings.push("Consider adding more business-focused context and implications");
    }
    const actionableWords = ["implement", "strategy", "recommend", "consider", "should", "plan", "next steps"];
    const actionableCount = actionableWords.filter((word) => content.includes(word)).length;
    if (actionableCount < 2) {
      warnings.push("Consider adding more actionable insights and recommendations");
    }
  }
  /**
   * Calculate quality score
   * @param {Object} article - Article object
   * @param {Array} errors - Array of errors
   * @param {Array} warnings - Array of warnings
   * @returns {number} Quality score (0-100)
   */
  calculateQualityScore(article, errors, warnings) {
    let score = 100;
    score -= errors.length * 10;
    score -= warnings.length * 5;
    if (article.content && article.content.includes("##")) score += 5;
    if (article.content && article.content.includes("- ")) score += 5;
    if (article.reading_time && article.reading_time >= 5) score += 5;
    if (article.word_count && article.word_count >= 1e3) score += 5;
    return Math.max(0, Math.min(100, score));
  }
  /**
   * Generate recommendations for improvement
   * @param {Array} errors - Array of errors
   * @param {Array} warnings - Array of warnings
   * @returns {Array} Array of recommendations
   */
  generateRecommendations(errors, warnings) {
    const recommendations = [];
    if (errors.length > 0) {
      recommendations.push("Fix all errors before publishing");
    }
    if (warnings.length > 3) {
      recommendations.push("Address warnings to improve article quality");
    }
    recommendations.push("Review content for British English consistency");
    recommendations.push("Ensure content provides actionable business insights");
    recommendations.push("Verify proper heading structure and formatting");
    recommendations.push("Check SEO elements are optimized");
    return recommendations;
  }
  /**
   * Auto-fix common issues
   * @param {Object} article - Article object
   * @returns {Object} Fixed article object
   */
  autoFixArticle(article) {
    let fixedArticle = { ...article };
    Object.entries(this.britishSpellings).forEach(([american, british]) => {
      const americanRegex = new RegExp(`\\b${american}\\b`, "gi");
      if (fixedArticle.content) {
        fixedArticle.content = fixedArticle.content.replace(americanRegex, british);
      }
      if (fixedArticle.title) {
        fixedArticle.title = fixedArticle.title.replace(americanRegex, british);
      }
      if (fixedArticle.summary) {
        fixedArticle.summary = fixedArticle.summary.replace(americanRegex, british);
      }
    });
    if (fixedArticle.content) {
      fixedArticle.content = fixedArticle.content.replace(/\s+/g, " ");
    }
    if (!fixedArticle.slug && fixedArticle.title) {
      fixedArticle.slug = this.generateSlug(fixedArticle.title);
    }
    return fixedArticle;
  }
  /**
   * Generate URL-friendly slug
   * @param {string} title - Article title
   * @returns {string} URL slug
   */
  generateSlug(title2) {
    return title2.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").substring(0, 50);
  }
};
async function validateArticle(article) {
  const validator = new ContentValidator();
  return await validator.validateArticle(article);
}
__name(validateArticle, "validateArticle");
function autoFixArticle(article) {
  const validator = new ContentValidator();
  return validator.autoFixArticle(article);
}
__name(autoFixArticle, "autoFixArticle");

// utils/notion-client.js
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var NotionClient = class {
  static {
    __name(this, "NotionClient");
  }
  constructor(token) {
    this.token = token;
    this.baseUrl = "https://api.notion.com/v1";
    this.headers = {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28"
    };
  }
  /**
   * Create a new article page in Notion
   * @param {Object} article - Article data
   * @param {string} databaseId - Notion database ID
   * @param {string} imageUrl - Generated image URL
   * @returns {Promise<Object>} Created Notion page
   */
  async createArticlePage(article, databaseId, imageUrl) {
    try {
      const pageData = {
        parent: {
          database_id: databaseId
        },
        properties: this.buildPageProperties(article),
        children: this.buildPageContent(article, imageUrl)
      };
      const response = await fetch(`${this.baseUrl}/pages`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(pageData)
      });
      if (!response.ok) {
        const error3 = await response.json();
        throw new Error(`Notion API error: ${error3.message}`);
      }
      return await response.json();
    } catch (error3) {
      console.error("Error creating Notion page:", error3);
      throw error3;
    }
  }
  /**
   * Build page properties for Notion database
   * @param {Object} article - Article data
   * @returns {Object} Notion page properties
   */
  buildPageProperties(article) {
    return {
      "Name": {
        title: [
          {
            text: {
              content: article.title || "Untitled Article"
            }
          }
        ]
      },
      "Status": {
        select: {
          name: article.status === "published" ? "Published" : "Draft"
        }
      },
      "Category": {
        select: {
          name: this.capitalizeCategory(article.category)
        }
      },
      "Tags": {
        multi_select: (article.tags || []).map((tag) => ({
          name: tag
        }))
      },
      "Author": {
        rich_text: [
          {
            text: {
              content: article.author || "ContainerCode Advisory Team"
            }
          }
        ]
      },
      "Published Date": {
        date: {
          start: article.published_at || (/* @__PURE__ */ new Date()).toISOString()
        }
      },
      "Word Count": {
        number: article.word_count || 0
      },
      "Reading Time": {
        number: article.reading_time || 0
      },
      "SEO Title": {
        rich_text: [
          {
            text: {
              content: article.seo_title || article.title || ""
            }
          }
        ]
      },
      "SEO Description": {
        rich_text: [
          {
            text: {
              content: article.seo_description || article.summary || ""
            }
          }
        ]
      },
      "Source URL": {
        url: article.source_url || null
      },
      "Featured": {
        checkbox: article.featured || false
      },
      "Validation Status": {
        select: {
          name: article.validation_status || "Pending"
        }
      }
    };
  }
  /**
   * Build page content blocks
   * @param {Object} article - Article data
   * @param {string} imageUrl - Header image URL
   * @returns {Array} Array of Notion blocks
   */
  buildPageContent(article, imageUrl) {
    const blocks = [];
    if (imageUrl) {
      blocks.push({
        object: "block",
        type: "image",
        image: {
          type: "external",
          external: {
            url: imageUrl
          },
          caption: [
            {
              type: "text",
              text: {
                content: article.title || "Article Header Image"
              }
            }
          ]
        }
      });
    }
    if (article.summary) {
      blocks.push({
        object: "block",
        type: "callout",
        callout: {
          rich_text: [
            {
              type: "text",
              text: {
                content: article.summary
              }
            }
          ],
          icon: {
            emoji: "\u{1F4A1}"
          },
          color: "blue_background"
        }
      });
    }
    blocks.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: {
              content: `\u{1F4C5} Published: ${new Date(article.published_at || Date.now()).toLocaleDateString("en-GB")} | \u23F1\uFE0F ${article.reading_time || 5} min read | \u{1F4DD} ${article.word_count || 0} words`
            },
            annotations: {
              color: "gray"
            }
          }
        ]
      }
    });
    blocks.push({
      object: "block",
      type: "divider",
      divider: {}
    });
    const contentBlocks = this.convertMarkdownToNotionBlocks(article.content || "");
    blocks.push(...contentBlocks);
    if (article.source_url) {
      blocks.push({
        object: "block",
        type: "divider",
        divider: {}
      });
      blocks.push({
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content: "Source: "
              },
              annotations: {
                bold: true
              }
            },
            {
              type: "text",
              text: {
                content: article.source_url,
                link: {
                  url: article.source_url
                }
              }
            }
          ]
        }
      });
    }
    blocks.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: {
              content: "---\n\n"
            }
          },
          {
            type: "text",
            text: {
              content: "This analysis is provided by ContainerCode Advisory, your trusted partner for enterprise technology consulting."
            },
            annotations: {
              italic: true,
              color: "gray"
            }
          }
        ]
      }
    });
    return blocks;
  }
  /**
   * Convert Markdown content to Notion blocks
   * @param {string} markdown - Markdown content
   * @returns {Array} Array of Notion blocks
   */
  convertMarkdownToNotionBlocks(markdown) {
    const blocks = [];
    const lines = markdown.split("\n");
    let currentParagraph = [];
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("#")) {
        if (currentParagraph.length > 0) {
          blocks.push(this.createParagraphBlock(currentParagraph.join("\n")));
          currentParagraph = [];
        }
        const headingLevel = (trimmedLine.match(/^#+/) || [""])[0].length;
        const headingText = trimmedLine.replace(/^#+\s*/, "");
        blocks.push(this.createHeadingBlock(headingText, headingLevel));
      } else if (trimmedLine.startsWith("-") || trimmedLine.startsWith("*")) {
        if (currentParagraph.length > 0) {
          blocks.push(this.createParagraphBlock(currentParagraph.join("\n")));
          currentParagraph = [];
        }
        const bulletText = trimmedLine.replace(/^[-*]\s*/, "");
        blocks.push(this.createBulletBlock(bulletText));
      } else if (/^\d+\.\s/.test(trimmedLine)) {
        if (currentParagraph.length > 0) {
          blocks.push(this.createParagraphBlock(currentParagraph.join("\n")));
          currentParagraph = [];
        }
        const numberText = trimmedLine.replace(/^\d+\.\s*/, "");
        blocks.push(this.createNumberedBlock(numberText));
      } else if (trimmedLine === "") {
        if (currentParagraph.length > 0) {
          blocks.push(this.createParagraphBlock(currentParagraph.join("\n")));
          currentParagraph = [];
        }
      } else {
        currentParagraph.push(line);
      }
    }
    if (currentParagraph.length > 0) {
      blocks.push(this.createParagraphBlock(currentParagraph.join("\n")));
    }
    return blocks;
  }
  /**
   * Create paragraph block
   * @param {string} text - Paragraph text
   * @returns {Object} Notion paragraph block
   */
  createParagraphBlock(text) {
    return {
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: this.parseRichText(text)
      }
    };
  }
  /**
   * Create heading block
   * @param {string} text - Heading text
   * @param {number} level - Heading level (1-6)
   * @returns {Object} Notion heading block
   */
  createHeadingBlock(text, level) {
    const headingType = level === 1 ? "heading_1" : level === 2 ? "heading_2" : "heading_3";
    return {
      object: "block",
      type: headingType,
      [headingType]: {
        rich_text: this.parseRichText(text)
      }
    };
  }
  /**
   * Create bullet list block
   * @param {string} text - Bullet text
   * @returns {Object} Notion bullet block
   */
  createBulletBlock(text) {
    return {
      object: "block",
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: this.parseRichText(text)
      }
    };
  }
  /**
   * Create numbered list block
   * @param {string} text - Numbered text
   * @returns {Object} Notion numbered block
   */
  createNumberedBlock(text) {
    return {
      object: "block",
      type: "numbered_list_item",
      numbered_list_item: {
        rich_text: this.parseRichText(text)
      }
    };
  }
  /**
   * Parse text for rich formatting
   * @param {string} text - Text to parse
   * @returns {Array} Array of rich text objects
   */
  parseRichText(text) {
    if (!text) return [];
    return [
      {
        type: "text",
        text: {
          content: text
        }
      }
    ];
  }
  /**
   * Capitalize category name
   * @param {string} category - Category name
   * @returns {string} Capitalized category
   */
  capitalizeCategory(category) {
    const categoryMap = {
      "ai": "Artificial Intelligence",
      "devops": "DevOps",
      "cybersecurity": "Cybersecurity",
      "cloud": "Cloud Computing",
      "software_engineering": "Software Engineering",
      "technology": "Technology"
    };
    return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
  }
  /**
   * Update article page in Notion
   * @param {string} pageId - Notion page ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<Object>} Updated page
   */
  async updateArticlePage(pageId, updates) {
    try {
      const response = await fetch(`${this.baseUrl}/pages/${pageId}`, {
        method: "PATCH",
        headers: this.headers,
        body: JSON.stringify({
          properties: updates
        })
      });
      if (!response.ok) {
        const error3 = await response.json();
        throw new Error(`Notion API error: ${error3.message}`);
      }
      return await response.json();
    } catch (error3) {
      console.error("Error updating Notion page:", error3);
      throw error3;
    }
  }
  /**
   * Get article page from Notion
   * @param {string} pageId - Notion page ID
   * @returns {Promise<Object>} Page data
   */
  async getArticlePage(pageId) {
    try {
      const response = await fetch(`${this.baseUrl}/pages/${pageId}`, {
        headers: this.headers
      });
      if (!response.ok) {
        const error3 = await response.json();
        throw new Error(`Notion API error: ${error3.message}`);
      }
      return await response.json();
    } catch (error3) {
      console.error("Error fetching Notion page:", error3);
      throw error3;
    }
  }
};
async function createNotionArticle(article, databaseId, imageUrl, token) {
  const client = new NotionClient(token);
  return await client.createArticlePage(article, databaseId, imageUrl);
}
__name(createNotionArticle, "createNotionArticle");

// article-generator.js
init_image_generator();
var article_generator_default = {
  /**
   * Scheduled event handler for daily article generation
   * @param {ScheduledEvent} event - Scheduled event
   * @param {Object} env - Environment variables and bindings
   * @param {Object} ctx - Execution context
   */
  async scheduled(event, env2, ctx) {
    console.log("\u{1F680} Starting scheduled article generation job");
    const jobId = await this.logJobStart(env2, "article-generation");
    let processedCount = 0;
    let errorCount = 0;
    try {
      console.log("\u{1F4E1} Parsing RSS feeds...");
      const rssArticles = await parseRSSFeeds(env2);
      console.log(`Found ${rssArticles.length} relevant articles from RSS feeds`);
      if (rssArticles.length === 0) {
        console.log("No new articles found, skipping generation");
        await this.logJobEnd(env2, jobId, "completed", "No new articles found", 0);
        return;
      }
      for (const rssArticle of rssArticles.slice(0, 5)) {
        try {
          console.log(`
\u{1F4DD} Processing article: "${rssArticle.title}"`);
          const existingArticle = await this.checkExistingArticle(env2, rssArticle);
          if (existingArticle) {
            console.log("Article already exists, skipping...");
            continue;
          }
          console.log("\u{1F916} Generating article content with AI...");
          const generatedArticle = await generateArticle(rssArticle, rssArticle.category, env2.AI);
          console.log("\u2705 Validating article content...");
          const validation = await validateArticle(generatedArticle);
          let finalArticle = generatedArticle;
          if (!validation.isValid) {
            console.log("\u{1F527} Auto-fixing article issues...");
            finalArticle = autoFixArticle(generatedArticle);
            const revalidation = await validateArticle(finalArticle);
            if (!revalidation.isValid) {
              console.log("\u274C Article validation failed, skipping:", revalidation.errors);
              errorCount++;
              continue;
            }
          }
          console.log("\u{1F3A8} Generating header image...");
          const imageUrl = await generateArticleImage(finalArticle, env2.AI, env2.IMAGES);
          console.log("\u{1F4BE} Storing article in database...");
          const dbResult = await env2.DB.prepare(`
            INSERT INTO articles (
              title, content, summary, excerpt, slug, image_url, 
              category, tags, author, word_count, reading_time,
              source_url, source_feed, seo_title, seo_description,
              status, validation_status, created_at, published_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            finalArticle.title,
            finalArticle.content,
            finalArticle.summary,
            finalArticle.excerpt,
            finalArticle.slug,
            imageUrl,
            finalArticle.category,
            JSON.stringify(finalArticle.tags || []),
            finalArticle.author,
            finalArticle.word_count,
            finalArticle.reading_time,
            finalArticle.source_url,
            finalArticle.source_feed,
            finalArticle.seo_title,
            finalArticle.seo_description,
            "published",
            "valid",
            (/* @__PURE__ */ new Date()).toISOString(),
            (/* @__PURE__ */ new Date()).toISOString()
          ).run();
          const articleId = dbResult.meta.last_row_id;
          console.log("\u{1F4CB} Creating Notion page...");
          const notionPage = await createNotionArticle(
            { ...finalArticle, id: articleId },
            env2.NOTION_DATABASE_GENERATED_ARTICLES,
            imageUrl,
            env2.NOTION_TOKEN
          );
          await env2.DB.prepare(`
            UPDATE articles SET notion_page_id = ? WHERE id = ?
          `).bind(notionPage.id, articleId).run();
          await env2.DB.prepare(`
            INSERT INTO content_validations (
              article_id, validation_type, is_valid, errors, warnings, validated_at
            ) VALUES (?, ?, ?, ?, ?, ?)
          `).bind(
            articleId,
            "comprehensive",
            validation.isValid,
            JSON.stringify(validation.errors || []),
            JSON.stringify(validation.warnings || []),
            (/* @__PURE__ */ new Date()).toISOString()
          ).run();
          processedCount++;
          console.log(`\u2705 Successfully processed article: "${finalArticle.title}"`);
        } catch (error3) {
          console.error(`\u274C Error processing article "${rssArticle.title}":`, error3);
          errorCount++;
        }
      }
      console.log(`
\u{1F389} Article generation completed. Processed: ${processedCount}, Errors: ${errorCount}`);
      await this.logJobEnd(env2, jobId, "completed", `Processed ${processedCount} articles`, processedCount);
      if (processedCount > 0) {
        console.log("\u{1F9F9} Cleaning up old images...");
        try {
          const imageGenerator = new (await Promise.resolve().then(() => (init_image_generator(), image_generator_exports))).ImageGenerator(env2.AI, env2.IMAGES);
          await imageGenerator.cleanupOldImages(30);
        } catch (cleanupError) {
          console.error("Error during cleanup:", cleanupError);
        }
      }
    } catch (error3) {
      console.error("\u274C Fatal error in article generation job:", error3);
      await this.logJobEnd(env2, jobId, "failed", error3.message, processedCount);
    }
  },
  /**
   * HTTP request handler for manual article generation
   * @param {Request} request - HTTP request
   * @param {Object} env - Environment variables and bindings
   * @param {Object} ctx - Execution context
   */
  async fetch(request, env2, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/generate" && request.method === "POST") {
      try {
        const body = await request.json();
        if (!body.rss_url || !body.category) {
          return new Response(JSON.stringify({
            error: "Missing required fields: rss_url, category"
          }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
        const rssParser = new (await Promise.resolve().then(() => (init_rss_parser(), rss_parser_exports))).RSSParser();
        const articles = await rssParser.parseFeed(body.rss_url, body.category);
        if (articles.length === 0) {
          return new Response(JSON.stringify({
            error: "No articles found in RSS feed"
          }), {
            status: 404,
            headers: { "Content-Type": "application/json" }
          });
        }
        const rssArticle = articles[0];
        const generatedArticle = await generateArticle(rssArticle, body.category, env2.AI);
        const validation = await validateArticle(generatedArticle);
        let articleId = null;
        let notionPage = null;
        if (body.save_to_db || body.publish_to_notion) {
          console.log("\u{1F4BE} Saving article to database...");
          const finalArticle = validation.isValid ? generatedArticle : await autoFixArticle(generatedArticle, validation);
          let imageUrl = null;
          if (body.generate_image) {
            console.log("\u{1F3A8} Generating article image...");
            try {
              const imageGenerator = new (await Promise.resolve().then(() => (init_image_generator(), image_generator_exports))).ImageGenerator(env2.AI, env2.IMAGES);
              imageUrl = await imageGenerator.generateArticleImage(finalArticle);
            } catch (imageError) {
              console.error("Error generating image:", imageError);
            }
          }
          const dbResult = await env2.DB.prepare(`
            INSERT INTO articles (
              title, content, summary, excerpt, slug, image_url, category, tags, author,
              word_count, reading_time, source_url, source_feed, seo_title, seo_description,
              status, validation_status, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            finalArticle.title,
            finalArticle.content,
            finalArticle.summary,
            finalArticle.excerpt,
            finalArticle.slug,
            imageUrl,
            finalArticle.category,
            JSON.stringify(finalArticle.tags || []),
            finalArticle.author,
            finalArticle.word_count,
            finalArticle.reading_time,
            finalArticle.source_url,
            finalArticle.source_feed,
            finalArticle.seo_title,
            finalArticle.seo_description,
            body.test ? "draft" : "published",
            validation.isValid ? "valid" : "pending",
            (/* @__PURE__ */ new Date()).toISOString(),
            (/* @__PURE__ */ new Date()).toISOString()
          ).run();
          articleId = dbResult.meta.last_row_id;
          console.log(`\u{1F4DD} Article saved to database with ID: ${articleId}`);
          if (body.publish_to_notion) {
            console.log("\u{1F4CB} Creating Notion page...");
            try {
              notionPage = await createNotionArticle(
                { ...finalArticle, id: articleId },
                env2.NOTION_DATABASE_GENERATED_ARTICLES,
                imageUrl,
                env2.NOTION_TOKEN
              );
              await env2.DB.prepare(`
                UPDATE articles SET notion_page_id = ? WHERE id = ?
              `).bind(notionPage.id, articleId).run();
              console.log(`\u{1F4CB} Notion page created: ${notionPage.url}`);
            } catch (notionError) {
              console.error("Error creating Notion page:", notionError);
            }
          }
        }
        return new Response(JSON.stringify({
          article: generatedArticle,
          validation,
          saved: !!articleId,
          articleId,
          notionPage
        }), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (error3) {
        return new Response(JSON.stringify({
          error: error3.message
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    if (url.pathname === "/status") {
      const stats = await this.getJobStats(env2);
      return new Response(JSON.stringify(stats), {
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response("Article Generator Worker\n\nEndpoints:\n- POST /generate\n- GET /status", {
      headers: { "Content-Type": "text/plain" }
    });
  },
  /**
   * Check if article already exists in database
   * @param {Object} env - Environment bindings
   * @param {Object} rssArticle - RSS article data
   * @returns {Promise<boolean>} True if article exists
   */
  async checkExistingArticle(env2, rssArticle) {
    const existing = await env2.DB.prepare(`
      SELECT id FROM articles 
      WHERE source_url = ? OR title = ?
      LIMIT 1
    `).bind(rssArticle.link, rssArticle.title).first();
    return !!existing;
  },
  /**
   * Log job start
   * @param {Object} env - Environment bindings
   * @param {string} jobName - Job name
   * @returns {Promise<number>} Job ID
   */
  async logJobStart(env2, jobName) {
    const result = await env2.DB.prepare(`
      INSERT INTO cron_logs (job_name, status, start_time) 
      VALUES (?, ?, ?)
    `).bind(jobName, "started", (/* @__PURE__ */ new Date()).toISOString()).run();
    return result.meta.last_row_id;
  },
  /**
   * Log job completion
   * @param {Object} env - Environment bindings
   * @param {number} jobId - Job ID
   * @param {string} status - Job status
   * @param {string} result - Job result
   * @param {number} recordsProcessed - Records processed
   */
  async logJobEnd(env2, jobId, status, result, recordsProcessed) {
    const endTime = (/* @__PURE__ */ new Date()).toISOString();
    await env2.DB.prepare(`
      UPDATE cron_logs 
      SET status = ?, end_time = ?, result = ?, records_processed = ?
      WHERE id = ?
    `).bind(status, endTime, result, recordsProcessed, jobId).run();
  },
  /**
   * Get job statistics
   * @param {Object} env - Environment bindings
   * @returns {Promise<Object>} Job statistics
   */
  async getJobStats(env2) {
    const recentJobs = await env2.DB.prepare(`
      SELECT * FROM cron_logs 
      WHERE job_name = 'article-generation' 
      ORDER BY start_time DESC 
      LIMIT 10
    `).all();
    const articleCount = await env2.DB.prepare(`
      SELECT COUNT(*) as count FROM articles
    `).first();
    const todaysArticles = await env2.DB.prepare(`
      SELECT COUNT(*) as count FROM articles 
      WHERE DATE(created_at) = DATE('now')
    `).first();
    return {
      total_articles: articleCount.count,
      todays_articles: todaysArticles.count,
      recent_jobs: recentJobs.results
    };
  }
};
export {
  article_generator_default as default
};
//# sourceMappingURL=article-generator.js.map
