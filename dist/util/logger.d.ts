import * as core from "@tcpioneer/core";
/**
 * Configuration for a multi-output logger with severity filtering.
 *
 * The filter is configured so that visibility is prioritized.
 * The filter precedence works as follows:
 *
 * 1. `visibleSeverities` to be visible
 * 2. `hiddenSeverities` to be hidden
 * 3. `visibleMin` to show severities greater than or equal value
 * 4. `hiddenMax` to hide severities less than or equal value
 * 5. Visibility if no other filter matches the severity
 *
 * @property outputs - Writable streams that receive formatted log records.
 * @property visibleSeverities - Explicit severities that are always allowed even when they would otherwise be filtered.
 * @property visibleMin - Minimum severity threshold for logs to be shown unless overridden by the explicit allowlist.
 * @property hiddenMax - Maximum severity threshold for logs to be suppressed unless explicitly allowed.
 * @property hiddenSeverities - Explicit severities that are always hidden.
 */
export type MOFLConfig = {
    outputs: NodeJS.WritableStream[];
    visibleSeverities?: Set<core.logger.LogSeverity>;
    visibleMin?: core.logger.LogSeverity;
    hiddenMax?: core.logger.LogSeverity;
    hiddenSeverities?: Set<core.logger.LogSeverity>;
};
/**
 * Formats a log record into a single string.
 *
 * @param textinput - A tuple containing the log severity label, source, and message.
 * @returns The formatted log entry, including the current UTC timestamp.
 */
export declare const logText: core.messages.TextGenerator;
/**
 * Maps each log severity to its colored text representation for console output.
 */
export declare const LogSeverityTextMap: Map<core.logger.LogSeverity, string>;
/**
 * Maps each log severity to its plain-text label without ANSI styling.
 */
export declare const LogSeverityTextConfigMap: Map<string, core.logger.LogSeverity>;
/**
 * Writes log messages to one or more writable streams and optionally filters which severities are visible.
 *
 * @implements {core.logger.Logger}
 */
export declare class MultiOutputFilterLogger implements core.logger.Logger {
    config: MOFLConfig;
    constructor(config: MOFLConfig);
    private hideSeverity;
    log(severity: core.logger.LogSeverity, source: string, message: string): void;
    debug(source: string, message: string): void;
    info(source: string, message: string): void;
    notice(source: string, message: string): void;
    warn(source: string, message: string): void;
    error(source: string, message: string): void;
    critical(source: string, message: string): void;
    alert(source: string, message: string): void;
    emergency(source: string, message: string): void;
}
