(function () {

    var Navigator = {

        DIRECTION : {
            // push
            leftToRight: 'from-left-to-right',
            // pop
            rightToLeft: 'from-right-to-left'
        },

        EVENTS : {
            viewWillAppear : 'viewWillAppear',
            viewDidAppear : 'viewDidAppear',
            viewWillDisappear : 'viewWillDisappear',
            viewDidDisappear : 'viewDidDisappear'
        },

        _ViewStack : [],

        _firstCurrentPage : '',

        init : function (param) {
            this._firstCurrentPage = param.firstPage || '';

            if (this._firstCurrentPage !== ''){
                this._pushViewToStack(this._firstCurrentPage);
                $('#' + this._firstCurrentPage).addClass('page-current');
            }
        },

        _getCurrentView : function () {
            return this._ViewStack[this._ViewStack.length - 1];
        },

        _getLastView : function () {
            return this._ViewStack[this._ViewStack.length - 2];
        },

        _pushViewToStack : function (viewID) {

            if (viewID === null || typeof viewID === 'undefined'){
                return;
            }

            this._ViewStack.push(viewID);
        },

        _popViewWithStack : function () {
            if (this._ViewStack.length <= 1){
                return;
            }
            this._ViewStack.pop();
        },

        pushControllerWithID : function (domID) {

            var currentView = $('#' + this._getCurrentView());
            var pushView = $('#'+ domID);

            currentView.removeClass('page-current');
            pushView.addClass('page-current');

            this._pushViewToStack(domID);

            this._animateElement(currentView,pushView);
        },

        popToLastController : function () {

            if (this._ViewStack.length <= 1){
                return;
            }

            var currentView = $('#' + this._getCurrentView());
            var lastView = $('#'+ this._getLastView());

            currentView.removeClass('page-current');
            lastView.addClass('page-current');

            this._popViewWithStack();

            this._animateElement(currentView,lastView, this.DIRECTION.leftToRight);
        },

        _animateElement : function ($from, $to, direction) {

            setTimeout(function () {
                $from.trigger(this.EVENTS.viewWillDisappear, [$from.attr('id'), $to.attr('id')]);
                $to.trigger(this.EVENTS.viewWillAppear,[$from.attr('id'), $to.attr('id')]);
            }.bind(this));

            // 考虑读取点击的链接上指定的方向
            if (typeof direction === 'undefined') {
                direction = this.DIRECTION.rightToLeft;
            }

            var animPageClasses = [
                'page-from-center-to-left',
                'page-from-center-to-right',
                'page-from-right-to-center',
                'page-from-left-to-center'].join(' ');

            var classForFrom, classForTo;
            switch(direction) {
                case this.DIRECTION.rightToLeft:
                    classForFrom = 'page-from-center-to-left';
                    classForTo = 'page-from-right-to-center';
                    break;
                case this.DIRECTION.leftToRight:
                    classForFrom = 'page-from-center-to-right';
                    classForTo = 'page-from-left-to-center';
                    break;
                default:
                    classForFrom = 'page-from-center-to-left';
                    classForTo = 'page-from-right-to-center';
                    break;
            }

            $from.removeClass(animPageClasses).addClass(classForFrom);
            $to.removeClass(animPageClasses).addClass(classForTo);

            $from.on('animationend', function () {
                $from.removeClass(animPageClasses);
            });

            var that = this;
            $to.on('animationend', function () {
                $to.removeClass(animPageClasses);
                setTimeout(function () {
                    $from.trigger(that.EVENTS.viewDidDisappear, [$from.attr('id'), $to.attr('id')]);
                    $to.trigger(that.EVENTS.viewDidAppear,[$from.attr('id'), $to.attr('id')]);
                });
            })
        }

    };

    window.Navigator = Navigator;
})();

/*===========================
PullToLoad AMD Export
===========================*/
if (typeof(module) !== 'undefined')
{
    module.exports = window.Navigator;
}
else if (typeof define === 'function' && define.amd) {
    define([], function () {
        'use strict';
        return window.Navigator;
    });
}