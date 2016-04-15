"use strict";
var ConditionalEventT = (function () {
    function ConditionalEventT() {
        this._defaultTruthyCondition = function () { return true; };
        this._conditionalEventHandlers = [];
    }
    ConditionalEventT.prototype.on = function (eventHandler, condition) {
        if (!condition) {
            condition = this._defaultTruthyCondition;
        }
        var conditionalEventHandler = {
            eventHandler: eventHandler,
            condition: condition
        };
        this._registerIfNotRegisteredYet(conditionalEventHandler);
    };
    ConditionalEventT.prototype.off = function (eventHandler, condition) {
        if (!condition) {
            this._conditionalEventHandlers =
                this._filterConditionalEventHandlersThatContainEventHandler(eventHandler);
        }
        else {
            this._conditionalEventHandlers =
                this._filterConditionalEventHandlersByEventHandlerAndCondition(eventHandler, condition);
        }
    };
    ConditionalEventT.prototype.raise = function (data) {
        var _this = this;
        this._conditionalEventHandlers.forEach(function (_conditionalEventHandler) {
            _this._callEventHandlerIfConditionIsSatisfied(_conditionalEventHandler, data);
        });
    };
    ConditionalEventT.prototype.raiseSafe = function (data) {
        var _this = this;
        this._conditionalEventHandlers.forEach(function (_conditionalEventHandler) {
            _this._callEventHandlerIfConditionIsSatisfiedSafe(_conditionalEventHandler, data);
        });
    };
    ConditionalEventT.prototype._registerIfNotRegisteredYet = function (conditionalEventHandler) {
        if (this._isAlreadyRegistered(conditionalEventHandler)) {
            return;
        }
        this._conditionalEventHandlers.push(conditionalEventHandler);
    };
    ConditionalEventT.prototype._isAlreadyRegistered = function (conditionalEventHandlerToCheck) {
        for (var i = 0; i < this._conditionalEventHandlers.length; i++) {
            var conditionalEventHandler = this._conditionalEventHandlers[i];
            if (this._areSameConditionalEventHandlers(conditionalEventHandler, conditionalEventHandlerToCheck)) {
                return true;
            }
        }
        return false;
    };
    ConditionalEventT.prototype._areSameConditionalEventHandlers = function (first, second) {
        return first.eventHandler === second.eventHandler &&
            first.condition === second.condition;
    };
    ConditionalEventT.prototype._callEventHandlerIfConditionIsSatisfiedSafe = function (conditionalEventHandler, data) {
        try {
            this._callEventHandlerIfConditionIsSatisfied(conditionalEventHandler, data);
        }
        catch (e) {
        }
    };
    ConditionalEventT.prototype._callEventHandlerIfConditionIsSatisfied = function (conditionalEventHandler, data) {
        if (conditionalEventHandler.condition(data)) {
            conditionalEventHandler.eventHandler(data);
        }
    };
    ConditionalEventT.prototype._filterConditionalEventHandlersThatContainEventHandler = function (eventHandler) {
        var result = [];
        for (var i = 0; i < this._conditionalEventHandlers.length; i++) {
            var conditionalEventHandler = this._conditionalEventHandlers[i];
            if (conditionalEventHandler.eventHandler !== eventHandler) {
                result.push(conditionalEventHandler);
            }
        }
        return result;
    };
    ConditionalEventT.prototype._filterConditionalEventHandlersByEventHandlerAndCondition = function (eventHandler, condition) {
        var conditionalEventHandlerToFilter = {
            eventHandler: eventHandler,
            condition: condition
        };
        var result = [];
        for (var i = 0; i < this._conditionalEventHandlers.length; i++) {
            var conditionalEventHandler = this._conditionalEventHandlers[i];
            if (!this._areSameConditionalEventHandlers(conditionalEventHandler, conditionalEventHandlerToFilter)) {
                result.push(conditionalEventHandler);
            }
        }
        return result;
    };
    return ConditionalEventT;
}());
exports.ConditionalEventT = ConditionalEventT;
