'use strict';

/**
 * 全屏缩放/发大
 */


uiFullscreenDirective.$inject = ['uiLoad', '$document', '$timeout', 'gridstackService'];

function uiFullscreenDirective(uiLoad, $document, $timeout, gridstackService) {
    return {
        restrict: 'AC',
        template: '<i class="fa fa-expand fa-fw text"></i><i class="fa fa-compress fa-fw text-active"></i>',
        link: function (scope, el, attr) {
            el.addClass('hide');
            uiLoad.load('/assets/libs/screenfull.min.js').then(function () {
                // disable on ie11
                if (screenfull.enabled && !navigator.userAgent.match(/Trident.*rv:11\./)) {
                    el.removeClass('hide');
                }
                el.on('click', function () {
                    var target;
                    attr.target && ( target = $(attr.target)[0] );
                    screenfull.toggle(target);
                });
                $document.on(screenfull.raw.fullscreenchange, function () {
                    if (screenfull.isFullscreen) {
                        el.addClass('active');
                        if (angular.isUndefined(scope.sharePanelFlag)) {
                            //非分享页面

                            scope.pt.settings.fullScreen = true;
                            scope.pt.settings.headFolded = true;
                            scope.pt.settings.asideFolded = true;
                            scope.pt.settings.asideFoldAll = true;

                            //编辑模式下,将widget放大
                            var colWidth = Math.max(parseInt((window.screen.width - 17 - 40) / scope.rootChart.columns), 28);
                            scope.$apply(function () {
                                if (screenfull.enabled) {
                                    document.addEventListener(screenfull.raw.fullscreenchange, function () {
                                        $timeout(
                                            function () {
                                                $(window).resize();
                                            },
                                            800
                                        )
                                    });
                                }
                                scope.rootChart.colWidth = colWidth;
                                scope.rootChart.rowHeight = colWidth;
                                scope.rootPage.contentWidth = parseInt(scope.rootChart.columns * colWidth);

                                $timeout(
                                    function () {
                                        $(window).resize();
                                    },
                                    1500
                                )
                            })
                        } else {
                            //分享页面
                            scope.$apply(function () {
                                scope.rootPage.shareFullScreen = true;
                            });
                        }
                    } else {
                        el.removeClass('active');
                        if (angular.isUndefined(scope.sharePanelFlag)) {
                            if (scope.rootPage.dashboardMode == 'READ') {
                                scope.pt.settings.fullScreen = false;
                                scope.pt.settings.headFolded = false;
                                scope.pt.settings.asideFolded = false;
                                scope.pt.settings.asideFoldAll = false;

                                //查看模式下,将widget缩小
                                var colWidth = Math.max(parseInt(30 * (window.screen.width / 1366)), 28);

                                scope.$apply(function () {
                                    if (screenfull.enabled) {
                                        document.addEventListener(screenfull.raw.fullscreenchange, function () {
                                            $timeout(
                                                function () {
                                                    $(window).resize();
                                                },
                                                800
                                            )
                                        });
                                    }
                                    scope.rootChart.colWidth = colWidth;
                                    scope.rootChart.rowHeight = colWidth;
                                    scope.rootPage.contentWidth = parseInt(scope.gridstackOptions.width * colWidth);
                                })
                            }
                            scope.pt.settings.fullScreen = false;
                        } else {
                            //分享页面
                            scope.$apply(function () {
                                scope.rootPage.shareFullScreen = false;
                            });
                        }
                    }

                    //widget 大小自适应
                    gridstackService.setWidgetHeight(scope.rootChart.rowHeight);
                });
            });
        }
    };
}

export default uiFullscreenDirective;