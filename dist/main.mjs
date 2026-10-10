var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// ../../node_modules/chalk/source/utilities.js
function stringReplaceAll(string, substring, postfix) {
  let index = string.indexOf(substring);
  if (index === -1) {
    return string;
  }
  const substringLength = substring.length;
  let endIndex = 0;
  let returnValue = "";
  do {
    returnValue += string.slice(endIndex, index) + substring + postfix;
    endIndex = index + substringLength;
    index = string.indexOf(substring, endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}
function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
  let endIndex = 0;
  let returnValue = "";
  do {
    const isGotCR = string[index - 1] === "\r";
    returnValue += string.slice(endIndex, isGotCR ? index - 1 : index) + prefix + (isGotCR ? "\r\n" : "\n") + postfix;
    endIndex = index + 1;
    index = string.indexOf("\n", endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}
var init_utilities = __esm({
  "../../node_modules/chalk/source/utilities.js"() {
    "use strict";
  }
});

// ../../node_modules/chalk/source/vendor/ansi-styles/index.js
function assembleStyles() {
  const codes = /* @__PURE__ */ new Map();
  for (const [groupName, group] of Object.entries(styles)) {
    for (const [styleName, style] of Object.entries(group)) {
      styles[styleName] = {
        open: `\x1B[${style[0]}m`,
        close: `\x1B[${style[1]}m`
      };
      group[styleName] = styles[styleName];
      codes.set(Number.parseInt(style[0], 10), style[1]);
    }
    Object.defineProperty(styles, groupName, {
      value: group,
      enumerable: false
    });
  }
  Object.defineProperty(styles, "codes", {
    value: codes,
    enumerable: false
  });
  styles.color.close = "\x1B[39m";
  styles.bgColor.close = "\x1B[49m";
  styles.underlineColor.close = "\x1B[59m";
  styles.color.ansi = wrapAnsi16();
  styles.color.ansi256 = wrapAnsi256();
  styles.color.ansi16m = wrapAnsi16m();
  styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
  styles.underlineColor.ansi = wrapUnderlineAnsi;
  styles.underlineColor.ansi256 = wrapAnsi256(ANSI_UNDERLINE_OFFSET);
  styles.underlineColor.ansi16m = wrapAnsi16m(ANSI_UNDERLINE_OFFSET);
  Object.defineProperties(styles, {
    rgbToAnsi256: {
      value(red, green, blue) {
        if (red === green && green === blue) {
          if (red < 8) {
            return 16;
          }
          if (red > 248) {
            return 231;
          }
          return Math.round((red - 8) / 247 * 24) + 232;
        }
        return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
      },
      enumerable: false
    },
    hexToRgb: {
      value(hex) {
        const matches = /[\da-f]{6}|[\da-f]{3}/i.exec(hex.toString(16));
        if (!matches) {
          return [0, 0, 0];
        }
        let [colorString] = matches;
        if (colorString.length === 3) {
          colorString = [...colorString].map((character) => character + character).join("");
        }
        const integer = Number.parseInt(colorString, 16);
        return [
          /* eslint-disable no-bitwise -- We need the speed */
          integer >> 16 & 255,
          integer >> 8 & 255,
          integer & 255
          /* eslint-enable no-bitwise */
        ];
      },
      enumerable: false
    },
    hexToAnsi256: {
      value: (hex) => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
      enumerable: false
    },
    ansi256ToAnsi: {
      value(code) {
        if (code < 8) {
          return 30 + code;
        }
        if (code < 16) {
          return 90 + (code - 8);
        }
        let red;
        let green;
        let blue;
        if (code >= 232) {
          red = ((code - 232) * 10 + 8) / 255;
          green = red;
          blue = red;
        } else {
          code -= 16;
          const remainder = code % 36;
          red = Math.floor(code / 36) / 5;
          green = Math.floor(remainder / 6) / 5;
          blue = remainder % 6 / 5;
        }
        const value = Math.max(red, green, blue) * 2;
        if (value === 0) {
          return 30;
        }
        let result = 30 + (Math.round(blue) << 2 | Math.round(green) << 1 | Math.round(red));
        if (value === 2) {
          result += 60;
        }
        return result;
      },
      enumerable: false
    },
    rgbToAnsi: {
      value: (red, green, blue) => styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
      enumerable: false
    },
    hexToAnsi: {
      value: (hex) => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
      enumerable: false
    }
  });
  return styles;
}
var ANSI_BACKGROUND_OFFSET, ANSI_UNDERLINE_OFFSET, wrapAnsi16, wrapAnsi256, wrapAnsi16m, wrapUnderlineAnsi, styles, modifierNames, foregroundColorNames, backgroundColorNames, underlineColorNames, colorNames, ansiStyles, ansi_styles_default;
var init_ansi_styles = __esm({
  "../../node_modules/chalk/source/vendor/ansi-styles/index.js"() {
    "use strict";
    ANSI_BACKGROUND_OFFSET = 10;
    ANSI_UNDERLINE_OFFSET = 20;
    wrapAnsi16 = (offset = 0) => (code) => `\x1B[${code + offset}m`;
    wrapAnsi256 = (offset = 0) => (code) => `\x1B[${38 + offset};5;${code}m`;
    wrapAnsi16m = (offset = 0) => (red, green, blue) => `\x1B[${38 + offset};2;${red};${green};${blue}m`;
    wrapUnderlineAnsi = (code) => `\x1B[58;5;${code < 90 ? code - 30 : code - 90 + 8}m`;
    styles = {
      modifier: {
        reset: [0, 0],
        // 21 isn't widely supported and 22 does the same thing
        bold: [1, 22],
        dim: [2, 22],
        italic: [3, 23],
        underline: [4, 24],
        // Extended underline styles (`SGR 4:x` sub-parameters). Not in upstream `ansi-styles`.
        underlineDouble: ["4:2", 24],
        underlineCurly: ["4:3", 24],
        underlineDotted: ["4:4", 24],
        underlineDashed: ["4:5", 24],
        overline: [53, 55],
        inverse: [7, 27],
        hidden: [8, 28],
        strikethrough: [9, 29]
      },
      color: {
        black: [30, 39],
        red: [31, 39],
        green: [32, 39],
        yellow: [33, 39],
        blue: [34, 39],
        magenta: [35, 39],
        cyan: [36, 39],
        white: [37, 39],
        // Bright color
        blackBright: [90, 39],
        gray: [90, 39],
        // Alias of `blackBright`
        grey: [90, 39],
        // Alias of `blackBright`
        redBright: [91, 39],
        greenBright: [92, 39],
        yellowBright: [93, 39],
        blueBright: [94, 39],
        magentaBright: [95, 39],
        cyanBright: [96, 39],
        whiteBright: [97, 39]
      },
      bgColor: {
        bgBlack: [40, 49],
        bgRed: [41, 49],
        bgGreen: [42, 49],
        bgYellow: [43, 49],
        bgBlue: [44, 49],
        bgMagenta: [45, 49],
        bgCyan: [46, 49],
        bgWhite: [47, 49],
        // Bright color
        bgBlackBright: [100, 49],
        bgGray: [100, 49],
        // Alias of `bgBlackBright`
        bgGrey: [100, 49],
        // Alias of `bgBlackBright`
        bgRedBright: [101, 49],
        bgGreenBright: [102, 49],
        bgYellowBright: [103, 49],
        bgBlueBright: [104, 49],
        bgMagentaBright: [105, 49],
        bgCyanBright: [106, 49],
        bgWhiteBright: [107, 49]
      },
      // Underline color (`SGR 58`/`59`). Not in upstream `ansi-styles`.
      underlineColor: {
        underlineBlack: ["58;5;0", 59],
        underlineRed: ["58;5;1", 59],
        underlineGreen: ["58;5;2", 59],
        underlineYellow: ["58;5;3", 59],
        underlineBlue: ["58;5;4", 59],
        underlineMagenta: ["58;5;5", 59],
        underlineCyan: ["58;5;6", 59],
        underlineWhite: ["58;5;7", 59],
        // Bright color
        underlineBlackBright: ["58;5;8", 59],
        underlineGray: ["58;5;8", 59],
        // Alias of `underlineBlackBright`
        underlineGrey: ["58;5;8", 59],
        // Alias of `underlineBlackBright`
        underlineRedBright: ["58;5;9", 59],
        underlineGreenBright: ["58;5;10", 59],
        underlineYellowBright: ["58;5;11", 59],
        underlineBlueBright: ["58;5;12", 59],
        underlineMagentaBright: ["58;5;13", 59],
        underlineCyanBright: ["58;5;14", 59],
        underlineWhiteBright: ["58;5;15", 59]
      }
    };
    modifierNames = Object.keys(styles.modifier);
    foregroundColorNames = Object.keys(styles.color);
    backgroundColorNames = Object.keys(styles.bgColor);
    underlineColorNames = Object.keys(styles.underlineColor);
    colorNames = [...foregroundColorNames, ...backgroundColorNames];
    ansiStyles = assembleStyles();
    ansi_styles_default = ansiStyles;
  }
});

// ../../node_modules/chalk/source/vendor/supports-color/index.js
import process2 from "process";
import os from "os";
import tty from "tty";
function hasFlag(flag, argv = globalThis.Deno ? globalThis.Deno.args : process2.argv) {
  const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
  const position = argv.indexOf(prefix + flag);
  const terminatorPosition = argv.indexOf("--");
  return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}
function hasNumericForceColor() {
  return /^\d+$/.test(env.FORCE_COLOR);
}
function envForceColor() {
  if (!("FORCE_COLOR" in env)) {
    return;
  }
  if (env.FORCE_COLOR === "false") {
    return 0;
  }
  if (env.FORCE_COLOR === "true" || env.FORCE_COLOR.length === 0) {
    return 1;
  }
  if (!hasNumericForceColor()) {
    return;
  }
  return Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
}
function translateLevel(level) {
  if (level === 0) {
    return false;
  }
  return {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3
  };
}
function _supportsColor(haveStream, { streamIsTTY, sniffFlags = true } = {}) {
  const noFlagForceColor = envForceColor();
  if (noFlagForceColor !== void 0) {
    flagForceColor = noFlagForceColor;
  }
  const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
  if (forceColor === 0) {
    return 0;
  }
  if (sniffFlags) {
    if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
      return 3;
    }
    if (hasFlag("color=256")) {
      return 2;
    }
  }
  if (forceColor !== void 0 && hasNumericForceColor()) {
    return forceColor;
  }
  if ("TF_BUILD" in env && "AGENT_NAME" in env) {
    return 1;
  }
  if (haveStream && !streamIsTTY && forceColor === void 0) {
    return 0;
  }
  const min = forceColor || 0;
  if (env.TERM === "dumb") {
    return min;
  }
  if (process2.platform === "win32") {
    const osRelease = os.release().split(".");
    if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }
    return 1;
  }
  if ("CI" in env) {
    if (["GITHUB_ACTIONS", "GITEA_ACTIONS", "CIRCLECI"].some((key) => key in env)) {
      return 3;
    }
    if (["TRAVIS", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRONE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
      return 1;
    }
    return min;
  }
  if ("TEAMCITY_VERSION" in env) {
    return /^(?:9\.0*[1-9]\d*\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
  }
  if (env.COLORTERM === "truecolor") {
    return 3;
  }
  if (env.TERM === "xterm-kitty") {
    return 3;
  }
  if (env.TERM === "xterm-ghostty") {
    return 3;
  }
  if (env.TERM === "wezterm") {
    return 3;
  }
  if ("TERM_PROGRAM" in env) {
    const version = Number.parseInt((env.TERM_PROGRAM_VERSION || "").split(".", 1)[0], 10);
    switch (env.TERM_PROGRAM) {
      case "iTerm.app": {
        return version >= 3 ? 3 : 2;
      }
      case "Apple_Terminal": {
        return 2;
      }
    }
  }
  if (/-256(?:color)?$/i.test(env.TERM)) {
    return 2;
  }
  if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
    return 1;
  }
  if ("COLORTERM" in env) {
    return 1;
  }
  return min;
}
function createSupportsColor(stream, options = {}) {
  const level = _supportsColor(stream, {
    streamIsTTY: stream && stream.isTTY,
    ...options
  });
  return translateLevel(level);
}
var env, flagForceColor, supportsColor, supports_color_default;
var init_supports_color = __esm({
  "../../node_modules/chalk/source/vendor/supports-color/index.js"() {
    "use strict";
    ({ env } = process2);
    if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
      flagForceColor = 0;
    } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
      flagForceColor = 1;
    }
    supportsColor = {
      stdout: createSupportsColor({ isTTY: tty.isatty(1) }),
      stderr: createSupportsColor({ isTTY: tty.isatty(2) })
    };
    supports_color_default = supportsColor;
  }
});

// ../../node_modules/chalk/source/index.js
function createChalk(options) {
  return chalkFactory(options);
}
var stdoutColor, stderrColor, GENERATOR, STYLER, IS_EMPTY, LEVEL, styles2, assertValidLevel, levelDescriptor, applyOptions, chalkFactory, createModelConverters, usedModels, proto, createStyler, createBuilder, applyStyle, chalk, chalkStderr, source_default;
var init_source = __esm({
  "../../node_modules/chalk/source/index.js"() {
    "use strict";
    init_utilities();
    init_ansi_styles();
    init_supports_color();
    ({ stdout: stdoutColor, stderr: stderrColor } = supports_color_default);
    GENERATOR = /* @__PURE__ */ Symbol("GENERATOR");
    STYLER = /* @__PURE__ */ Symbol("STYLER");
    IS_EMPTY = /* @__PURE__ */ Symbol("IS_EMPTY");
    LEVEL = /* @__PURE__ */ Symbol("LEVEL");
    styles2 = /* @__PURE__ */ Object.create(null);
    assertValidLevel = (level) => {
      if (!Number.isSafeInteger(level) || level < 0 || level > 3) {
        throw new Error("The `level` should be an integer from 0 to 3");
      }
    };
    levelDescriptor = {
      enumerable: true,
      get() {
        return this[LEVEL];
      },
      set(level) {
        assertValidLevel(level);
        this[LEVEL] = level;
      }
    };
    applyOptions = (object, options = {}) => {
      if (options.level !== void 0) {
        assertValidLevel(options.level);
      }
      const colorLevel = stdoutColor ? stdoutColor.level : 0;
      object[LEVEL] = options.level === void 0 ? colorLevel : options.level;
    };
    chalkFactory = (options) => {
      const chalk2 = (...strings) => strings.join(" ");
      applyOptions(chalk2, options);
      Object.setPrototypeOf(chalk2, createChalk.prototype);
      return chalk2;
    };
    Object.setPrototypeOf(createChalk.prototype, Function.prototype);
    for (const [styleName, style] of Object.entries(ansi_styles_default)) {
      styles2[styleName] = {
        get() {
          const builder = createBuilder(this, createStyler(style.open, style.close, this[STYLER]), this[IS_EMPTY]);
          Object.defineProperty(this, styleName, { value: builder });
          return builder;
        }
      };
    }
    styles2.visible = {
      get() {
        const builder = createBuilder(this, this[STYLER], true);
        Object.defineProperty(this, "visible", { value: builder });
        return builder;
      }
    };
    createModelConverters = (model, type) => {
      const style = ansi_styles_default[type];
      if (model === "rgb") {
        const ansi2 = (red, green, blue) => style.ansi(ansi_styles_default.rgbToAnsi(red, green, blue));
        const ansi256 = (red, green, blue) => style.ansi256(ansi_styles_default.rgbToAnsi256(red, green, blue));
        return [ansi2, ansi2, ansi256, style.ansi16m];
      }
      if (model === "hex") {
        const ansi2 = (hex) => style.ansi(ansi_styles_default.hexToAnsi(hex));
        const ansi256 = (hex) => style.ansi256(ansi_styles_default.hexToAnsi256(hex));
        return [ansi2, ansi2, ansi256, (hex) => style.ansi16m(...ansi_styles_default.hexToRgb(hex))];
      }
      const ansi = (code) => style.ansi(ansi_styles_default.ansi256ToAnsi(code));
      return [ansi, ansi, style.ansi256, style.ansi256];
    };
    usedModels = ["rgb", "hex", "ansi256"];
    for (const model of usedModels) {
      const capitalizedModel = model[0].toUpperCase() + model.slice(1);
      for (const [styleName, type] of [
        [model, "color"],
        ["bg" + capitalizedModel, "bgColor"],
        ["underline" + capitalizedModel, "underlineColor"]
      ]) {
        const { close } = ansi_styles_default[type];
        const converters = createModelConverters(model, type);
        styles2[styleName] = {
          get() {
            const styleFunction = function(first, second, third) {
              const open = converters[this.level](first, second, third);
              return createBuilder(this, createStyler(open, close, this[STYLER]), this[IS_EMPTY]);
            };
            Object.defineProperty(this, styleName, { value: styleFunction });
            return styleFunction;
          }
        };
      }
    }
    proto = Object.defineProperties(
      () => {
      },
      {
        ...styles2,
        level: {
          enumerable: true,
          get() {
            return this[GENERATOR].level;
          },
          set(level) {
            this[GENERATOR].level = level;
          }
        }
      }
    );
    createStyler = (open, close, parent) => {
      let openAll;
      let closeAll;
      if (parent === void 0) {
        openAll = open;
        closeAll = close;
      } else {
        openAll = parent.openAll + open;
        closeAll = close + parent.closeAll;
      }
      return {
        open,
        close,
        openAll,
        closeAll,
        parent
      };
    };
    createBuilder = (self, _styler, _isEmpty) => {
      const builder = (...arguments_) => {
        if (arguments_.length === 1) {
          return applyStyle(builder, "" + arguments_[0]);
        }
        if (arguments_.length === 2) {
          return applyStyle(builder, `${arguments_[0] ?? ""} ${arguments_[1] ?? ""}`);
        }
        return applyStyle(builder, arguments_.join(" "));
      };
      Object.setPrototypeOf(builder, proto);
      builder[GENERATOR] = self[GENERATOR] ?? self;
      builder[STYLER] = _styler;
      builder[IS_EMPTY] = _isEmpty;
      return builder;
    };
    applyStyle = (self, string) => {
      if (self[GENERATOR][LEVEL] <= 0 || !string) {
        return self[IS_EMPTY] ? "" : string;
      }
      let styler = self[STYLER];
      if (styler === void 0) {
        return string;
      }
      const { openAll, closeAll } = styler;
      if (string.includes("\x1B")) {
        while (styler !== void 0) {
          string = stringReplaceAll(string, styler.close, styler.open);
          styler = styler.parent;
        }
      }
      const lfIndex = string.indexOf("\n");
      if (lfIndex !== -1) {
        string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
      }
      return openAll + string + closeAll;
    };
    Object.defineProperties(createChalk.prototype, { ...styles2, level: levelDescriptor });
    chalk = createChalk();
    chalkStderr = createChalk({ level: stderrColor ? stderrColor.level : 0 });
    source_default = chalk;
  }
});

// src/util/logger.ts
import * as core from "@tcpioneer/core";
var logText, LogSeverityTextMap, LogSeverityTextConfigMap, MultiOutputFilterLogger;
var init_logger = __esm({
  "src/util/logger.ts"() {
    "use strict";
    init_source();
    logText = (textinput) => {
      return `[${textinput[0]}] [${textinput[1]}] (${(/* @__PURE__ */ new Date()).toUTCString()}) ${textinput[2]}
`;
    };
    LogSeverityTextMap = /* @__PURE__ */ new Map([
      [core.logger.LogSeverity.Debug, source_default.magenta("debug")],
      [core.logger.LogSeverity.Info, source_default.blue("info")],
      [core.logger.LogSeverity.Notice, source_default.bgBlue("notice")],
      [core.logger.LogSeverity.Warn, source_default.bgYellow("warn")],
      [core.logger.LogSeverity.Error, source_default.red("error")],
      [core.logger.LogSeverity.Critical, source_default.bgRed("critical")],
      [core.logger.LogSeverity.Alert, source_default.bgRed("ALERT")],
      [core.logger.LogSeverity.Emergency, source_default.bgRedBright("EMERGENCY")]
    ]);
    LogSeverityTextConfigMap = /* @__PURE__ */ new Map([
      ["debug", core.logger.LogSeverity.Debug],
      ["info", core.logger.LogSeverity.Info],
      ["notice", core.logger.LogSeverity.Notice],
      ["warn", core.logger.LogSeverity.Warn],
      ["error", core.logger.LogSeverity.Error],
      ["critical", core.logger.LogSeverity.Critical],
      ["alert", core.logger.LogSeverity.Alert],
      ["emergency", core.logger.LogSeverity.Emergency]
    ]);
    MultiOutputFilterLogger = class {
      config;
      constructor(config) {
        this.config = config;
      }
      hideSeverity(severity) {
        if (this.config.visibleSeverities && this.config.visibleSeverities.has(severity)) return false;
        if (this.config.hiddenSeverities && this.config.hiddenSeverities.has(severity)) return true;
        if (this.config.visibleMin && severity >= this.config.visibleMin) return false;
        if (this.config.hiddenMax && severity <= this.config.hiddenMax) return true;
        return false;
      }
      log(severity, source, message) {
        if (this.hideSeverity(severity)) return;
        const severityText = LogSeverityTextMap.get(severity);
        if (severityText) {
          for (const output of this.config.outputs) {
            output.write(logText([severityText, source, message]));
          }
        }
      }
      debug(source, message) {
        this.log(core.logger.LogSeverity.Debug, source, message);
      }
      info(source, message) {
        this.log(core.logger.LogSeverity.Info, source, message);
      }
      notice(source, message) {
        this.log(core.logger.LogSeverity.Notice, source, message);
      }
      warn(source, message) {
        this.log(core.logger.LogSeverity.Warn, source, message);
      }
      error(source, message) {
        this.log(core.logger.LogSeverity.Error, source, message);
      }
      critical(source, message) {
        this.log(core.logger.LogSeverity.Critical, source, message);
      }
      alert(source, message) {
        this.log(core.logger.LogSeverity.Alert, source, message);
      }
      emergency(source, message) {
        this.log(core.logger.LogSeverity.Emergency, source, message);
      }
    };
  }
});

// src/main.ts
import * as core2 from "@tcpioneer/core";
import { readFile } from "fs/promises";
var require_main = __commonJS({
  "src/main.ts"() {
    init_logger();
    async function readConfig() {
      try {
        let data = await readFile("config.json", "utf8");
        return JSON.parse(data);
      } catch (error) {
        console.error("Error reading config:", error instanceof Error ? error.message : String(error));
      }
    }
    (async () => {
      const config = await readConfig();
      if (!config) {
        const LoggerConfig2 = {
          outputs: [process.stderr]
        };
        const errlogger = new MultiOutputFilterLogger(LoggerConfig2);
        errlogger.emergency("prehost", "The config file could not be read. Check that the file exists and can be read by TCPIOneer.");
        return;
      }
      const shownSeverities = [];
      for (const severity in config["log-options"]["shown-severities"]) {
        const severityMapped = LogSeverityTextConfigMap.get(severity);
        if (severityMapped) {
          shownSeverities.push(severityMapped);
        }
      }
      const LoggerConfig = {
        outputs: [process.stdout],
        visibleSeverities: new Set(shownSeverities)
      };
      const hostConfig = {
        logger: new MultiOutputFilterLogger(LoggerConfig),
        server: {
          host: config.server.host,
          port: config.server.port,
          token: config.security.token,
          guide: {
            location: config.guide.location
          }
        }
      };
      const Host2 = new core2.Host(hostConfig);
      Host2.start();
    })();
  }
});
export default require_main();
