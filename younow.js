/**
 * younow - v1.67.1 - 2015-07-30
 * http://www.younow.com
 *
 * Copyright (c) 2015 YouNow
 * Licensed MIT <https://raw.github.com/younow/website/master/LICENSE>
 */

window.YouNow.track = {},
String.prototype.capitalize = function() {
    return this.toLowerCase().replace(/(?:^|\s)\S/g, function(a) {
        return a.toUpperCase()
    }
    )
}
,
angular.module("younow", ["templates", "younow.directives", "younow.home", "younow.about", "younow.info", "younow.policy", "younow.lockout", "younow.partner", "younow.main", "younow.missing", "younow.mention", "younow.post", "younow.reply", "younow.fan-button", "younow.subscribe-button", "younow.infinite-scroll", "younow.only-scroll", "younow.yn-enter", "younow.window-class", "younow.seach-bar", "younow.modal-draggable", "younow.modals.alert", "younow.modals.confirm", "younow.modals.iframe", "younow.modals.login", "younow.modals.gate", "younow.modals.media-player-modal", "younow.modals.partner", "younow.modals.partner-agreement", "younow.modals.profile-summary", "younow.modals.subscribe-modal", "younow.modals.trap", "younow.modals.youtube-subscribe", "younow.modals.share-broadcast-modal", "younow.modals.buybars", "younow.modals.ep", "younow.modals.mobile-download", "younow.services.channel", "younow.services.config", "younow.services.dashboard", "younow.services.search", "younow.services.session", "younow.services.pusher", "younow.services.swf", "younow.services.utils", "younow.services.tracking-pixel", "younow.services.shareService", "younow.services.eventbus", "younow.services.debugger", "ui.router", "ui.bootstrap", "pascalprecht.translate", "lr.upload", "angular-embedly", "duScroll", "mentio", "zeroclipboard"]).value("duScrollGreedy", !0).config(["$httpProvider", "$compileProvider", "$locationProvider", "$urlRouterProvider", "$sceDelegateProvider", "$translateProvider", "embedlyServiceProvider", "uiZeroclipConfigProvider", "$tooltipProvider", function($httpProvider, $compileProvider, $locationProvider, $urlRouterProvider, $sceDelegateProvider, $translateProvider, embedlyServiceProvider, uiZeroclipConfigProvider, $tooltipProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(["self", "**"]),
    $urlRouterProvider.otherwise("/"),
    $locationProvider.html5Mode(!0),
    $translateProvider.useStaticFilesLoader({
        prefix: window.globalVars.CDN_BASE_URL + "/angularjsapp/src/assets/i18n/",
        suffix: ".json?v=" + window.globalVars.JS_VERSION
    }),
    $translateProvider.preferredLanguage("en").fallbackLanguage("en"),
    embedlyServiceProvider.setKey("d4272e7f48454b81849810f8d9258198"),
    $httpProvider.defaults.useXDomain = !0,
    delete $httpProvider.defaults.headers.common["X-Requested-With"],
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|data|javascript):/),
    uiZeroclipConfigProvider.setZcConf({
        swfPath: window.globalVars.CDN_BASE_URL + "/angularjsapp/vendor/bower/zeroclipboard/dist/ZeroClipboard.swf",
        cacheBust: !1
    }),
    $tooltipProvider.setTriggers({
        show: "hide",
        mouseenter: "mouseleave click"
    }),
    window.isPrerender = -1 !== window.navigator.userAgent.indexOf("Prerender") ? !0 : !1
}
]).config(["$provide", function($provide) {
    $provide.decorator("$exceptionHandler", ["$delegate", "$window", function($delegate, $window) {
        return function(exception, cause) {
            $window.bugsnagAdditionalParams && $window.Bugsnag && ($window.Bugsnag.metaData = {
                lastApiStack: $window.bugsnagAdditionalParams.lastApiStackObject,
                lastClickStack: $window.bugsnagAdditionalParams.lastClickStackObject
            }),
            $window.Bugsnag && $window.Bugsnag.notifyException(exception),
            $delegate(exception, cause)
        }
    }
    ]),
    window.ga = window.ga || function() {
        (ga.q = ga.q || []).push(arguments)
    }
    ,
    ga.l = +new Date;
    var gaKey = "www.younow.com" === window.location.host ? "UA-24148895-1" : "UA-24148895-2";
    window.ga("create", gaKey, "auto"),
    window.ga("require", "displayfeatures")
}
]).run(["config", function(config) {
    config.init = config.update()
}
]).controller("AppCtrl", ["$window", "$document", "$location", "$rootScope", "$scope", "$state", "$stateParams", "$urlRouter", "$translate", "$modal", "$timeout", "$q", "config", "Api", "broadcasterService", "session", "pusher", "twitter", "searchService", "swf", "trackingPixel", "debug", function($window, $document, $location, $rootScope, $scope, $state, $stateParams, $urlRouter, $translate, $modal, $timeout, $q, config, Api, broadcasterService, session, pusher, twitter, searchService, swf, trackingPixel, debug) {
    function setDimensions(tr) {
        window.ga("set", "contentGroup3", tr.linkType),
        window.ga("set", "dimension4", tr.linkType),
        debug.console(["GA", "DIMENSION"], {
            linkType: tr.linkType,
            contentGroup: "contentGroup3",
            dimensionGroup: "dimension4"
        }),
        window.ga("set", "contentGroup1", tr.pageType),
        window.ga("set", "dimension1", tr.pageType),
        debug.console(["GA", "DIMENSION"], {
            pageType: tr.pageType,
            contentGroup: "contentGroup1",
            dimensionGroup: "dimension1"
        }),
        window.ga("set", "contentGroup4", tr.linkType + " >> " + tr.pageType),
        window.ga("set", "dimension5", tr.linkType + " >> " + tr.pageType),
        debug.console(["GA", "DIMENSION"], {
            pageType: tr.linkType + " >> " + tr.pageType,
            contentGroup: "contentGroup4",
            dimensionGroup: "dimension5"
        }),
        window.contentSet = !0
    }
    $window.bugsnagAdditionalParams = {
        lastApiStack: [],
        lastClickStack: [],
        lastApiStackObject: {},
        lastClickStackObject: {}
    },
    void 0 !== window.cxApi ? $rootScope.ab = window.cxApi.chooseVariation() : $rootScope.ab = 0,
    $rootScope.$watch(function() {
        return $rootScope.title
    }
    , function(title) {
        title && ($scope.pageTitle = title)
    }
    ),
    $scope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
        if (!config.linkType) {
            var path = window.location.pathname
              , ancillary = ["about", "info", "policy"];
            -1 !== ancillary.indexOf(path.split("/")[1]) ? config.linkType = "ancillary" : "/" === path ? config.linkType = "home" : -1 !== path.indexOf("/explore") && void 0 !== path[9] ? config.linkType = "tag" : -1 !== path.indexOf("/explore") ? config.linkType = "explore" : path.match(/\//g).length > 2 ? config.linkType = "brdcst" : config.linkType = "profile",
            ("brdcst" === config.linkType || "profile" === config.linkType || "home" === config.linkType) && (window.waitForPageType = !0)
        }
        if ($scope.cdn && $scope.cdn.base || (event.preventDefault(),
        config.init.then(function() {
            $urlRouter.sync()
        }
        )),
        session.isBroadcasting && (toParams.profileUrlString !== session.user.profile || toParams.entityId) && (session.preventBroadcastInterrupt(),
        event.preventDefault()),
        !Api.store("younowOldEnough")) {
            var lockout = Api.store("younowAgeLockout");
            lockout && "0" !== lockout && "lockout" != toState.name && Number(lockout) > (new Date).getTime() / 1e3 && (event.preventDefault(),
            $state.go("lockout"))
        }
        session.isBroadcasting || ("about" === toParams.profileUrlString && ($state.go("about"),
        config.linkType = "ancillary",
        event.preventDefault()),
        "profile" === toParams.profileUrlString && ($modal.profileSummary(toParams.entityId),
        event.preventDefault()),
        "channel" === toParams.profileUrlString && (config.init.then(function() {
            broadcasterService.channelSwitch = "PROFILE",
            broadcasterService.switchBroadcaster(toParams.entityId)
        }
        ),
        event.preventDefault()),
        ("featured" === toParams.profileUrlString || "tag" === toParams.profileUrlString) && ($rootScope.gaPage({
            path: "/featured/" + toParams.entityId
        }),
        config.init.then(function() {
            broadcasterService.featuredBroadcaster(toParams.entityId)
        }
        ),
        event.preventDefault())),
        $rootScope.hideFooter = !1
    }
    ),
    $scope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
        session.referralData || (session.inviteString = $stateParams.inviteString || "",
        session.srcId = $stateParams.srcId || "",
        session.profileUrlString = toParams.profileUrlString,
        session.referralData = !0),
        window.YouNow.track.pageFirst || $rootScope.gaPage(),
        $document.scrollTop(0),
        $rootScope.title = $rootScope.newTitle || "YouNow | Live Stream Video Chat | Free Apps on Web, iOS and Android",
        $window.Bugsnag && $window.Bugsnag.refresh()
    }
    ),
    config.init.then(function() {
        session.updateLocale(),
        config.settings.UseBroadcastThumbs ? config.broadcasterThumb = config.settings.ServerCDNBaseUrl + "/php/api/getBroadcastThumb/broadcastId=" : config.broadcasterThumb = config.settings.ServerCDNBaseUrl + "/php/api/channel/getImage/channelId=",
        session.getSession().success(function(data) {
            $modal.ageGate().then(function() {
                if (0 === data.userId) {
                    var silent = session.silentAuth();
                    silent ? silent["catch"](function(response) {
                        session.forceLogin("REOPEN")
                    }
                    ) : session.profileUrlString ? session.forceLogin("LINK") : session.forceLogin("REOPEN")
                }
            }
            ),
            pusher.init()
        }
        )
    }
    ),
    $scope.cdn = {},
    $scope.local = {},
    config.init.then(function() {
        $scope.local.base = config.settings.ServerLocalBaseUrl,
        $scope.cdn.base = config.settings.ServerCDNBaseUrl,
        $scope.cdn.image = config.settings.ServerCDNBaseUrl + "/images",
        $scope.cdn.thumb = config.settings.ServerCDNBaseUrl + "/php/api/channel/getImage/channelId=",
        $scope.cdn.nothumb = config.settings.ServerCDNBaseUrl + "/images/nothumb.jpg",
        $scope.cdn.broadcast = config.settings.ServerCDNBaseUrl + "/php/api/getBroadcastThumb/broadcastId=",
        $scope.cdn.snapshot = config.settings.ServerCDNBaseUrl + "/php/api/getSnapshot/id=",
        $scope.cdn.media = config.settings.ServerCDNBaseUrl + "/php/api/post/getMedia/channelId=",
        $scope.cdn.background = function(id, type, refresher) {
            type = type || "Image";
            var extra = "Image" == type ? ", url(" + $scope.cdn.nothumb + ")" : "";
            refresher = refresher || "";
            var base = session.user && session.user.userId == id ? config.settings.ServerLocalBaseUrl : config.settings.ServerCDNBaseUrl;
            return "background:url(" + base + "/php/api/channel/get" + type + "/channelId=" + id + refresher + ")" + extra + " no-repeat center center; background-size: cover;"
        }
    }
    ),
    $modal.loginModal = function(hard, source) {
        if (window.isPrerender)
            return !1;
        var modal = $modal.open({
            templateUrl: "angularjsapp/src/app/components/login-modal/login-modal.tpl.html",
            controller: "LoginModalCtrl",
            windowClass: "social-login-modal",
            backdrop: hard ? "static" : !0,
            keyboard: hard ? !1 : !0,
            resolve: {
                soft: function() {
                    return !hard
                },
                source: function() {
                    return source
                }
            }
        });
        return modal.result["catch"](function() {
            "LINK" === source && (source = $state.is("main.channel.detail") ? broadcasterService.async ? "LINK_PROFILE" : "LINK_LIVE" : "LINK_OTHER"),
            $rootScope.gaEvent("LOGIN", "DISMISS", source)
        }
        ),
        modal
    }
    ,
    $modal.profileSummary = function(channelId, params, state) {
        params = params || {},
        params.channelId = channelId,
        params.userId = session.loggedIn ? session.user.userId : 0,
        params.state = state || !1,
        broadcasterService.broadcaster && broadcasterService.broadcaster.broadcastId && (params.broadcastId = broadcasterService.broadcaster.broadcastId,
        broadcasterService.broadcaster.userId === channelId && (params.broadcastRelated = 1));
        var modal = $modal.open({
            templateUrl: "angularjsapp/src/app/components/profile-summary/profile-summary.tpl.html",
            controller: "ProfileSummaryCtrl",
            windowClass: "profile-summary-wrapper",
            resolve: {
                params: function() {
                    return params
                }
            }
        });
        return modal
    }
    ,
    $modal.youtube = function(username) {
        return $modal.open({
            templateUrl: "angularjsapp/src/app/components/youtube-subscribe/youtube-subscribe.tpl.html",
            controller: "YoutubeSubscribeCtrl",
            windowClass: "youtube-modal",
            resolve: {
                username: function() {
                    return username
                }
            }
        })
    }
    ,
    $modal.subscribeModal = function(channelId, params, state) {
        if (channelId = channelId || broadcasterService.broadcaster.profile,
        params = params || {},
        params.channelId = channelId,
        params.userId = session.loggedIn ? session.user.userId : 0,
        broadcasterService.broadcaster && broadcasterService.broadcaster.broadcastId && (params.broadcastId = broadcasterService.broadcaster.broadcastId,
        broadcasterService.broadcaster.userId === channelId && (params.broadcastRelated = 1)),
        session.user.spendingDisabled)
            return Api.showTopNotification("Spending disabled. Please contact YouNow Support."),
            !1;
        var modal = $modal.open({
            templateUrl: "angularjsapp/src/app/components/subscribe-modal/subscribe.tpl.html",
            controller: "SubscribeModalCtrl",
            windowClass: "subscribe-modal-wrapper",
            resolve: {
                params: function() {
                    return params
                }
            }
        });
        return modal
    }
    ,
    $modal.mediaPlayerModal = function(id, params) {
        var modal = $modal.open({
            templateUrl: "angularjsapp/src/app/components/media-player-modal/media-player-modal.tpl.html",
            controller: "MediaPlayerModalCtrl",
            windowClass: "media-player-modal",
            resolve: {
                broadcastId: function() {
                    return id
                },
                params: function() {
                    return params || {}
                }
            }
        });
        return modal.result["catch"](function(data) {}
        ),
        modal
    }
    ,
    $modal.iframe = function(src, extraClass) {
        var windowClass = extraClass ? "iframe-modal " + extraClass : "iframe-modal";
        return $modal.open({
            templateUrl: "angularjsapp/src/app/components/iframe-modal/iframe-modal.tpl.html",
            controller: "IframeModalCtrl",
            windowClass: windowClass,
            resolve: {
                src: function() {
                    return src
                }
            }
        })
    }
    ,
    $modal.alert = function(message) {
        return $modal.open({
            templateUrl: "angularjsapp/src/app/components/alert-modal/alert-modal.tpl.html",
            controller: "AlertModalCtrl",
            windowClass: "alert-modal",
            resolve: {
                message: function() {
                    return message
                }
            }
        })
    }
    ,
    $modal.gate = function(data) {
        return $modal.open({
            templateUrl: "angularjsapp/src/app/components/gate-modal/gate-modal.tpl.html",
            controller: "GateModalCtrl",
            windowClass: "gate-modal",
            backdrop: "static",
            keyboard: !1,
            resolve: {
                data: function() {
                    return data
                }
            }
        })
    }
    ,
    $modal.ageGate = function() {
        var deferred = $q.defer();
        return Api.store("younowOldEnough") || $rootScope.skipAgeGate || !config.localeMatch(config.settings.AgeGateLocales.split(",")) ? deferred.resolve() : ($rootScope.skipAgeGate = !1,
        $modal.gate({
            title: "agegate_modal_title",
            message: "agegate_modal_message",
            decline: "agegate_modal_under",
            confirm: "agegate_modal_over"
        }).result.then(function(response) {
            if (response)
                Api.store("younowOldEnough", !0),
                deferred.resolve();
            else {
                $state.go("lockout");
                var lockoutDate = Math.floor((new Date).getTime() / 1e3) + 86400;
                Api.store("younowAgeLockout", lockoutDate)
            }
        }
        )),
        deferred.promise
    }
    ,
    $modal.trap = function(type, user, source) {
        return $modal.open({
            templateUrl: "angularjsapp/src/app/components/trap-modal/trap-modal.tpl.html",
            controller: "TrapModalCtrl",
            windowClass: "trap-modal",
            resolve: {
                data: function() {
                    return {
                        user: user,
                        type: type
                    }
                },
                source: function() {
                    return source
                }
            }
        })
    }
    ,
    $modal.partner = function() {
        return $modal.open({
            templateUrl: "angularjsapp/src/app/components/partner-modal/partner-modal.tpl.html",
            controller: "PartnerModalCtrl",
            windowClass: "partner-modal"
        })
    }
    ,
    $modal.partnerAgreement = function() {
        return $modal.open({
            templateUrl: "angularjsapp/src/app/components/partner-agreement-modal/partner-agreement-modal.tpl.html",
            controller: "PartnerAgreementModalCtrl",
            windowClass: "partner-agreement-modal",
            backdrop: "static",
            keyboard: !1
        })
    }
    ,
    $modal.shareBroadcast = function(message) {
        return $modal.open({
            templateUrl: "angularjsapp/src/app/components/share-broadcast-modal/share-broadcast-modal.tpl.html",
            controller: "shareBroadcastModalCtrl",
            windowClass: "share-broadcast-ctrl",
            resolve: {
                data: function() {
                    return {
                        message: message
                    }
                }
            }
        })
    }
    ,
    $modal.buyBars = function(spendingDisabled) {
        if (spendingDisabled || void 0 === spendingDisabled) {
            var deferred = $q.defer();
            deferred.reject("suspending disabled"),
            Api.showTopNotification("Account purchasing disabled. Please email support@younow.com to review this matter.");
            var result = {
                result: deferred.promise
            };
            return result
        }
        $rootScope.gaEvent("PURCHASE", "PROMPT", config.buybarsiframe ? "IFRAME" : "INLINE");
        var modal = $modal.open({
            templateUrl: "angularjsapp/src/app/components/buybars-modal/buybars.tpl.html",
            controller: "buybarsModalCtrl",
            windowClass: "buybars-modal"
        });
        return modal.result["catch"](function(response) {
            "backdrop click" === response && $rootScope.gaEvent("PURCHASE", "DIMISS", config.buybarsiframe ? "IFRAME" : "INLINE")
        }
        ),
        modal.result.then(function(response) {
            "cc verified" === response && $modal.ccVerified("verified"),
            "cc verified failed" === response && $timeout(function() {
                $modal.ccVerified("verified-failed")
            }
            , 200)
        }
        ),
        modal
    }
    ,
    $modal.ccVerified = function(type) {
        var modal = $modal.open({
            templateUrl: "angularjsapp/src/app/components/buybars-modal/cc-verified.tpl.html",
            controller: "ccVerifiedModalCtrl",
            windowClass: "buybars-modal " + type
        });
        return modal
    }
    ,
    $modal.epModal = function(state) {
        var template = "angularjsapp/src/app/components/editors-pick-modals/ep-congrats.tpl.html";
        "expired" === state && (template = "angularjsapp/src/app/components/editors-pick-modals/ep-expired.tpl.html");
        var modal = $modal.open({
            templateUrl: template,
            controller: "epModalCtrl",
            windowClass: "ep-modal",
            resolve: {
                data: function() {
                    return {
                        state: state
                    }
                }
            }
        });
        return modal
    }
    ,
    $modal.mobileDownload = function(source) {
        var modal = $modal.open({
            templateUrl: "angularjsapp/src/app/components/mobile-download/mobile-download-modal.tpl.html",
            controller: "mobileDownloadCtrl",
            controllerAs: "vm",
            windowClass: "mobile-download-modal"
        });
        return source && $rootScope.gaEvent("Conversion", "Click Get App", source),
        modal
    }
    ;
    var initialVol = 80;
    window.sessionStorage && void 0 !== window.sessionStorage.getItem("younowVol") && window.sessionStorage && null  !== window.sessionStorage.getItem("younowVol") && !isNaN(Number(window.sessionStorage.getItem("younowVol"))) && (initialVol = Number(window.sessionStorage.getItem("younowVol"))),
    window.sessionStorage.setItem("younowVol", initialVol),
    swf.setVolume(0),
    trackingPixel.startPinging(),
    $document.on("click", function(e) {
        return e.target.outerHTML ? void Api.addToStack(e.target.outerHTML.substring(0, 100), "lastClickStack") : !1
    }
    ),
    $rootScope.gaPage = function(tr) {
        var nonAncillary = ["home", "explore", "tag", "profile", "live broadcast", "archived broadcast"]
          , ancillaryOnly = ["about", "info", "policy"];
        if (tr = "object" == typeof tr ? tr : {},
        tr.path = tr.path || window.location.pathname,
        tr.path !== $rootScope.previousPath && ($rootScope.previousPath = tr.path,
        window.ga("set", "page", tr.path)),
        tr.pageType || (tr.pageType = (trackingPixel.getUserLocation() || "ANCILLARY").toLowerCase()),
        "brdcst" === tr.pageType && (tr.pageType = "live broadcast"),
        tr.linkType = config.linkType,
        !window.YouNow.track.pageFirst && !window.waitForPageType) {
            if (tr.pageType && -1 === nonAncillary.indexOf(tr.pageType)) {
                if (-1 === ancillaryOnly.indexOf(tr.pageType))
                    return window.YouNow.track.pageFirst = "other",
                    !1;
                tr.pageType = "ancillary"
            }
            setDimensions(tr),
            $rootScope.gaEvent("LANDING", tr.pageType),
            window.YouNow.track.pageFirst = tr.pageType,
            debug.console(["GA", "PAGE"], tr),
            window.ga("send", "pageview")
        }
    }
    ,
    $rootScope.gaEvent = function(category, action, label, value, extraFields) {
        var fields = {
            hitType: "event",
            eventCategory: category,
            eventAction: action
        };
        label && (fields.eventLabel = label),
        value && (fields.eventValue = value),
        extraFields && (fields = angular.extend(fields, extraFields)),
        debug.console(["GA", "EVENT", category.toUpperCase()], {
            category: category,
            action: action,
            label: label,
            value: value,
            extraFields: extraFields
        }),
        window.ga("send", fields)
    }
}
]),
angular.module("younow.activity-panel", ["ui.router"]).directive("activityPanel", ["$http", "$window", "broadcasterService", "Api", "swf", "session", "config", function($http, $window, broadcasterService, Api, swf, session, config) {
    return {
        restrict: "A",
        templateUrl: "angularjsapp/src/app/components/activity-panel/activity-panel.tpl.html",
        scope: {
            onlineFriends: "=",
            source: "@"
        },
        link: function(scope) {
            scope.panel = {},
            scope.panel.cdn = {
                thumb: config.settings.ServerCDNBaseUrl + "/php/api/channel/getImage/channelId=",
                nothumb: config.settings.ServerCDNBaseUrl + "/images/nothumb.jpg",
                base: config.settings.ServerCDNBaseUrl
            },
            scope.panel.panelCollapsed = !1,
            scope.panel.changeBroadcaster = function(channel, source) {
                return swf.settingUpBroadcast && (session.isBroadcasting = !0),
                session.isBroadcasting ? (session.preventBroadcastInterrupt(),
                !1) : swf.broadcast && broadcasterService && !broadcasterService.async && channel == broadcasterService.broadcaster.userId ? !1 : (broadcasterService.channelSwitch = source,
                void broadcasterService.switchBroadcaster(channel))
            }
        }
    }
}
]),
angular.module("younow.modals.alert", []).controller("AlertModalCtrl", ["$scope", "message", "Api", function($scope, message, Api) {
    $scope.message = Api.trustedHTML(Api.linkify(message))
}
]),
angular.module("younow.channel.audience-panel", []).controller("AudiencePanelCtrl", ["$scope", "$modal", "$element", "$interval", "$timeout", "session", "swf", "config", "Api", function($scope, $modal, $element, $interval, $timeout, session, swf, config, Api) {
    var vm = this
      , audiencelistEl = angular.element(document.getElementById("audiencelist"))
      , previousScroll = 0
      , scrollDirection = 1;
    vm.swf = swf,
    vm.session = session,
    vm.baseImageUrlv3 = config.settings.ServerCDNBaseUrl + "/angularjsapp/src/assets/images/icons_v3",
    vm.thumb = config.settings.ServerCDNBaseUrl + "/php/api/channel/getImage/channelId=",
    vm.noThumb = config.settings.ServerCDNBaseUrl + "/images/nothumb.jpg",
    vm.messageNumberInView = 0,
    vm.globalVars = window.globalVars,
    vm.config = config,
    swf.audienceLists.currentPage = 0,
    vm.openProfileSummary = function(id, source) {
        $modal.profileSummary(id, {
            source: source
        })
    }
    ,
    vm.scrollLoadAudience = function(isRefresh, pageNum) {
        swf.audienceLists.hasNext && (swf.audienceLists.loading || isRefresh || vm.swf.getAudience(pageNum, 20, !1))
    }
    ,
    vm.clickToRefresh = function() {
        vm.swf.getAudience(swf.audienceLists.currentPage, 20, !0)
    }
    ,
    audiencelistEl.on("scroll", function() {
        var pages = audiencelistEl.children();
        audiencelistEl[0].scrollTop;
        previousScroll < audiencelistEl[0].scrollTop && (scrollDirection = 1),
        previousScroll > audiencelistEl[0].scrollTop && (scrollDirection = 0),
        previousScroll = audiencelistEl[0].scrollTop,
        audiencelistEl[0].scrollHeight - Math.round(audiencelistEl.scrollTop()) <= audiencelistEl[0].offsetHeight && vm.scrollLoadAudience(!1, pages.length, !1),
        0 === audiencelistEl[0].scrollTop && (swf.audienceLists.currentPage = 0);
        for (var i = 0; i < pages.length; i++) {
            var page = angular.element(pages[i])
              , top = page.prop("offsetTop");
            audiencelistEl.scrollTop() > top && audiencelistEl.scrollTop() < 950 * (i + 1) && (swf.audienceLists.currentPage = i,
            0 === scrollDirection && swf.audienceLists.prevLoadedPage > swf.audienceLists.currentPage && swf.getAudience(swf.audienceLists.currentPage, 20, !0),
            1 === scrollDirection && swf.audienceLists.prevLoadedPage < swf.audienceLists.currentPage && swf.getAudience(swf.audienceLists.currentPage, 20, !0))
        }
    }
    )
}
]).directive("audiencePanel", ["broadcasterService", function(broadcasterService) {
    return {
        restrict: "A",
        templateUrl: "angularjsapp/src/app/components/audience-panel/audience-panel.tpl.html",
        controller: "AudiencePanelCtrl",
        controllerAs: "vm",
        scope: {},
        link: function(scope, element, attrs, controller) {
            var vm = controller;
            angular.element(element).on("$destroy", function() {
                "Chat" !== vm.swf.activeChatTab && broadcasterService.async === !0 && (vm.swf.activeChatTab = "Chat")
            }
            )
        }
    }
}
]).directive("audienceMessage", ["$interval", "swf", "session", function($interval, swf, session) {
    return {
        restrict: "A",
        scope: {
            viewer: "="
        },
        link: function(scope, element, attrs, controller) {
            function startAudienceMessageInterval() {
                scope.viewer.messageNumberInView = 0,
                rotateMessages(scope.viewer.messages[scope.viewer.messageNumberInView]),
                messageAnimation = $interval(function() {
                    scope.viewer.messageNumberInView === scope.viewer.messages.length - 1 ? scope.viewer.messageNumberInView = 0 : scope.viewer.messageNumberInView++,
                    rotateMessages(scope.viewer.messages[scope.viewer.messageNumberInView])
                }
                , 3500)
            }
            function rotateMessages(message) {
                for (var i = 0; i < scope.viewer.messages.length; i++)
                    scope.viewer.messages[i] === message ? angular.element(element).addClass(scope.viewer.messages[i] + "-active") : angular.element(element).removeClass(scope.viewer.messages[i] + "-active")
            }
            var messageAnimation, isBroadcaster = swf.broadcast.userId === session.user.userId;
            scope.viewer.messages = [],
            scope.viewer.subscriptionType && scope.viewer.messages.length < 3 && scope.viewer.messages.push("subscriber"),
            -1 !== scope.viewer.fanRank && scope.viewer.messages.length < 3 && scope.viewer.messages.push("fanRank"),
            -1 === scope.viewer.fanRank && isBroadcaster && scope.viewer.messages.length < 3 && scope.viewer.messages.push("isFan"),
            scope.viewer.birthdayCopy && isBroadcaster && scope.viewer.messages.length < 3 && scope.viewer.messages.push("birthday"),
            scope.viewer.gifts > 0 && scope.viewer.messages.length < 3 && scope.viewer.messages.push("gifts"),
            scope.viewer.viewersRs > 0 && scope.viewer.messages.length < 3 && scope.viewer.messages.push("viewersRs"),
            (scope.viewer.location.city.length > 0 || scope.viewer.location.state.length > 0 || scope.viewer.location.country.length > 0) && scope.viewer.messages.length < 3 && scope.viewer.messages.push("location"),
            scope.viewer.fans && scope.viewer.messages.length < 3 && scope.viewer.messages.push("fans"),
            startAudienceMessageInterval(),
            scope.$on("$destroy", function() {
                $interval.cancel(messageAnimation)
            }
            )
        }
    }
}
]),
angular.module("younow.window-class", []).directive("windowClass", ["$timeout", function($timeout) {
    return {
        restrict: "A",
        compile: function(scope, elem, attr, ctrl) {
            return {
                post: function() {
                    $timeout(function() {
                        angular.element(elem.$$element[0]).removeClass(elem.windowClass),
                        angular.element(elem.$$element[0]).children().addClass(elem.windowClass)
                    }
                    , 0)
                }
            }
        }
    }
}
]).directive("preventDefault", function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            (attrs.ngClick || "" === attrs.href || "#" === attrs.href) && elem.on("click", function(e) {
                e.preventDefault()
            }
            )
        }
    }
}
),
angular.module("younow.modal-draggable", []).directive("ynModalDraggable", ["$timeout", "$document", "$window", function($timeout, $document, $window) {
    return {
        restrict: "A",
        compile: function(scope, elem, attr, ctrl) {
            return {
                post: function() {
                    $timeout(function() {
                        function mousemove(event) {
                            angular.element(document.getElementById("modalWindow"))[0].style.setProperty("top", "0", "important"),
                            y = event.clientY - element[0].clientHeight,
                            x = event.clientX - element[0].clientWidth / 2,
                            element.css({
                                top: y + "px",
                                left: x + "px"
                            })
                        }
                        function mouseup() {
                            element.css({
                                cursor: "default"
                            }),
                            $document.unbind("mousemove", mousemove),
                            $document.unbind("mouseup", mouseup)
                        }
                        if ("profile-summary-wrapper" !== elem.$$element.parent().attr("window-class"))
                            return !1;
                        var x, y, element = elem.$$element;
                        element.css({
                            position: "fixed",
                            left: "40%"
                        }),
                        element.on("mousedown", function(event) {
                            var noDragging = !1;
                            if (-1 === event.originalEvent.target.className.indexOf("yn-modal-draggable") && (noDragging = !0),
                            ("TEXTAREA" === event.originalEvent.target.tagName || "INPUT" === event.target.tagName || "BUTTON" === event.target.tagName) && (noDragging = !0),
                            !noDragging) {
                                if (element.css({
                                    cursor: "move"
                                }),
                                3 === event.originalEvent.which)
                                    return !1;
                                event.preventDefault(),
                                $document.on("mousemove", mousemove),
                                $document.on("mouseup", mouseup)
                            }
                        }
                        )
                    }
                    , 0)
                }
            }
        }
    }
}
]),
angular.module("younow.modals.buybars", []).controller("buybarsModalCtrl", ["$scope", "$modalInstance", "session", "Api", "$interval", "$translate", "config", "$filter", "$rootScope", "$timeout", function($scope, $modalInstance, session, Api, $interval, $translate, config, $filter, $rootScope, $timeout) {
    function formatVerificationDetails(originalAmount, date, bars, last4, paymentType) {
        $scope.verification.sale = {
            originalAmount: originalAmount,
            last4: last4,
            low: Number(originalAmount) - 1.99,
            high: Number(originalAmount) - .01,
            date: 1e3 * date,
            barsAmount: bars,
            paymentType: paymentType
        },
        $scope.verification.active = !0
    }
    $scope.Api = Api,
    $scope.session = session,
    $scope.activeItem = !1,
    $scope.config = config,
    $scope.iframeLoaded = !1,
    $scope.disableBuy = !0,
    $scope.verification = {
        processing: !1,
        failed: !1,
        invalid: !1,
        active: !1,
        verifyNowState: function() {
            $scope.verification.verifyNow = !0,
            $timeout(function() {
                $scope.verification.animate = !0
            }
            )
        }
    };
    var clearInvalid;
    if (window.addEventListener("message", function(event) {
        if (event.data) {
            if ("getData" === event.data) {
                var BTenvs = angular.copy(window.BraintreeData.environments);
                for (var env in BTenvs)
                    delete BTenvs[env].getId,
                    delete BTenvs[env].withId;
                var data = {
                    id: session.user.userId,
                    base: config.settings.ServerSecureLocalBaseUrl,
                    session: session.user.session,
                    requestBy: session.user.requestBy,
                    merchantId: config.settings.BTMerchantId,
                    BTKountId: config.settings.BTKountId,
                    env: config.settings.BTEnv,
                    environments: BTenvs,
                    CDN: config.settings.ServerCDNBaseUrl,
                    privacy: $filter("translate")("footer_privacy_link"),
                    terms: $filter("translate")("footer_terms_link")
                };
                $scope.iframeLoaded = !0,
                event.source.postMessage(data, "*")
            }
            "BTdone" === event.data.name && (config.buybarsiframeActive || $modalInstance.close(),
            config.buybarsiframeActive && (0 === event.data.errorCode && event.data.bars ? ($modalInstance.close($scope.activeItem),
            session.user.vault.webBars = Number(event.data.bars),
            Api.showTopNotification("Purchase successful. You now have " + session.user.vault.webBars + " bars!", "success"),
            $rootScope.gaEvent("PURCHASE", "SUCCESS", "IFRAME", Math.round(event.data.price))) : 0 !== event.data.errorCode || event.data.bars ? (Api.showTopNotification(event.data.errorMsg),
            $modalInstance.dismiss(event.data.errorCode),
            $rootScope.gaEvent("PURCHASE", "ERROR_" + event.data.errorCode, "IFRAME", Math.round(event.data.price))) : ($modalInstance.dismiss(event.data.errorCode),
            Api.showTopNotification("Oops! Something went wrong. Please email support@younow.com to review this matter."),
            $rootScope.gaEvent("PURCHASE", "ERROR_" + event.data.errorCode, "IFRAME", Math.round(event.data.price))),
            config.buybarsiframeActive = !1)),
            "cancelPayment" === event.data.name && (console.log(event.data.price),
            config.buybarsiframeActive && (event.data && event.data.price ? $rootScope.gaEvent("PURCHASE", "CANCEL", "IFRAME", Math.round(event.data.price)) : $rootScope.gaEvent("PURCHASE", "CANCEL", "IFRAME")),
            $scope.cancelPayment())
        }
    }
    ),
    Api.get("store/products", {
        store: "web"
    }, !0).then(function(response) {
        $scope.products = response.data.products
    }
    ),
    !config.buybarsiframe) {
        var params = {
            userId: session.user.userId
        };
        "http:" === window.location.protocol && (params.s = session.user.session),
        Api.post("store/purchaseToken", params, !0).then(function(response) {
            if (6020 === response.data.errorCode && response.data.ccVerificationSaleDetails) {
                var parsedResult = JSON.parse(response.data.ccVerificationSaleDetails);
                formatVerificationDetails(parsedResult.originalAmount, parsedResult.date, parsedResult.barsAmount, parsedResult.last4, parsedResult.paymentType),
                $scope.verification.verifyNowState()
            }
            if (6021 === response.data.errorCode && $modalInstance.close("cc verified failed"),
            0 === response.data.errorCode && document.getElementById("braintree-dropin") && ($scope.disableBuy = !1,
            window.braintree.setup(response.data.token, "dropin", {
                container: "braintree-dropin",
                paymentMethodNonceReceived: function(event, nonce) {
                    var params = {
                        data: $scope.activeItem.price,
                        signature: nonce,
                        sku: $scope.activeItem.SKU,
                        userId: session.user.userId,
                        device_data: document.getElementById("device_data").value
                    };
                    "http:" === window.location.protocol && (params.s = session.user.session),
                    $scope.disableBuy = !0,
                    Api.post("store/buy", params, !0).then(function(response) {
                        if (0 === response.data.errorCode && response.data.bars)
                            if (session.user.vault.webBars = Number(response.data.bars),
                            $rootScope.gaEvent("PURCHASE", "SUCCESS", "INLINE", Math.round($scope.activeItem.price)),
                            response.data.isVerificationSale && response.data.ccVerificationSaleDetails) {
                                var saleDetails = response.data.ccVerificationSaleDetails;
                                formatVerificationDetails(saleDetails.originalAmount, saleDetails.date, saleDetails.barsAmount, saleDetails.last4, saleDetails.paymentType)
                            } else
                                $modalInstance.close($scope.activeItem),
                                Api.showTopNotification("Purchase successful. You now have " + session.user.vault.webBars + " bars!", "success");
                        else
                            0 !== response.data.errorCode || response.data.bars ? ($modalInstance.dismiss(response.data.errorCode),
                            $rootScope.gaEvent("PURCHASE", "ERROR_" + response.data.errorCode, "INLINE", Math.round($scope.activeItem.price))) : ($modalInstance.dismiss(response.data.errorCode),
                            Api.showTopNotification("Oops! Something went wrong. Please email support@younow.com to review this matter."),
                            $rootScope.gaEvent("PURCHASE", "ERROR_" + response.data.errorCode, "INLINE", Math.round($scope.activeItem.price)))
                    }
                    )
                }
            }),
            window.BraintreeData)) {
                var env = window.BraintreeData.environments[config.settings.BTEnv].withId(config.settings.BTKountId);
                window.BraintreeData.setup(config.settings.BTMerchantId, "braintree-form", env)
            }
        }
        )
    }
    $scope.cancel = function() {
        config.buybarsiframe ? $scope.activeItem && $scope.activeItem.price && config.buybarsiframeActive ? $rootScope.gaEvent("PURCHASE", "CANCEL", "IFRAME", Math.round($scope.activeItem.price)) : $rootScope.gaEvent("PURCHASE", "CLOSE", "IFRAME") : $scope.activeItem && $scope.activeItem.price && $scope.activeItem.buying ? $rootScope.gaEvent("PURCHASE", "CANCEL", "INLINE", Math.round($scope.activeItem.price)) : $rootScope.gaEvent("PURCHASE", "CLOSE", "INLINE"),
        $modalInstance.dismiss("Modal (buy bars) closed")
    }
    ,
    $scope.cancelPayment = function() {
        config.buybarsiframeActive = !1
    }
    ,
    $scope.toggleActiveItem = function(item) {
        if (item ? $rootScope.gaEvent("PURCHASE", "SELECT", config.buybarsiframe ? "IFRAME" : "INLINE", Math.round(item.price)) : $rootScope.gaEvent("PURCHASE", "CANCEL", config.buybarsiframe ? "IFRAME" : "INLINE", Math.round($scope.activeItem.price)),
        config.buybarsiframe && (document.getElementById("braintree-iframe").contentWindow.postMessage({
            item: item
        }, "*"),
        config.buybarsiframeActive = !0),
        $scope.activeItem.buying && !config.buybarsiframe)
            $scope.activeItem.buying = !1,
            $scope.modalLarge = !1;
        else {
            $scope.activeItem = item,
            $scope.activeItem.buying = !0;
            var followHeight;
            config.buybarsiframe || (followHeight = $interval(function() {
                angular.element(document.getElementById("braintree-form"))[0] ? angular.element(document.getElementById("braintree-form"))[0].offsetHeight >= 250 && ($scope.modalLarge = !0) : ($interval.cancel(followHeight),
                $scope.modalLarge = !1)
            }
            , 500))
        }
    }
    ,
    $scope.verifyAmount = function() {
        $scope.verification.invalid = void 0,
        clearInvalid && $timeout.cancel(clearInvalid),
        $scope.verificationForm.$invalid ? $scope.verification.invalid = "Oops. needs to include decimals, i.e. $1.99. Try again" : ($scope.verification.amount < $scope.verification.sale.low || $scope.verification.amount > $scope.verification.sale.high) && ($scope.verification.invalid = "That is an incorrect amount. Try again."),
        $scope.verification.invalid ? (Api.triggerTooltip("verification-tooltip", 2500),
        clearInvalid = $timeout(function() {
            $scope.verification.invalid = void 0
        }
        , 2600)) : ($scope.verification.processing = !0,
        Api.post("store/verifyCreditCard", {
            amount: $scope.verification.amount,
            userId: session.user.userId,
            s: session.user.session
        }, !0).then(function(response) {
            $scope.verification.processing = !1,
            response.data && 0 === response.data.errorCode && $modalInstance.close("cc verified"),
            response.data && 6023 === response.data.errorCode && (response.data.remainingAttempts > 0 ? ($scope.verification.failed = !0,
            $scope.verification.amountAttempted = angular.copy($scope.verification.amount)) : $modalInstance.close("cc verified failed"))
        }
        ))
    }
}
]).controller("ccVerifiedModalCtrl", ["$scope", "$modalInstance", "session", function($scope, $modalInstance, session) {
    $scope.cancel = function() {
        $modalInstance.dismiss()
    }
    ,
    $scope.contactSupport = function() {
        window.open("https://younow.zendesk.com/anonymous_requests/new?ticket[subject]=Credit+Card+Verification&ticket[ticket_form_id]=67755&ticket[fields][23984596]=" + session.user.fullName, "_blank")
    }
}
]),
angular.module("younow.channel.chat", []).controller("ChatCtrl", ["$rootScope", "$scope", "$element", "$interval", "$timeout", "$modal", "broadcasterService", "session", "swf", "config", "Api", "shareService", "eventbus", "$document", "trackingPixel", function($rootScope, $scope, $element, $interval, $timeout, $modal, broadcasterService, session, swf, config, Api, shareService, eventbus, $document, trackingPixel) {
    function anchorChat() {
        scrollChatToBottom && $timeout.cancel(scrollChatToBottom),
        scrollChatToBottom = $timeout(function() {
            vm.chatWindow.scrollTop(vm.chatWindow[0].scrollHeight, 500)
        }
        , 2e3)
    }
    function isSpam(message) {
        if (message.length > 0) {
            for (var i = 0, a = 0; i < vm.spamCounter.length; i++)
                vm.spamCounter[i] === message && a++;
            return vm.spamCounter.unshift(message),
            vm.spamCounter && 3 === vm.spamCounter.length && vm.spamCounter.pop(),
            2 === a ? !0 : !1
        }
    }
    function startSpamTimer() {
        vm.spamTimer && $interval.cancel(vm.spamTimer),
        vm.spamTimer || (vm.spamTimeLeft = 60),
        vm.spamTimer = $interval(function() {
            vm.spamTimeLeft--,
            0 === vm.spamTimeLeft && ($interval.cancel(vm.spamTimer),
            vm.spamTimer = !1)
        }
        , 1e3)
    }
    function checkChatCooldown() {
        return swf.broadcast && swf.broadcast.currentChatInCooldown === !0 ? swf.broadcast.currentChatCooldown : 0
    }
    function startCoolDownTimer() {
        cooldownTimer && $interval.cancel(cooldownTimer),
        cooldownTimer = $interval(function() {
            vm.cooldownTime--,
            vm.cooldownTime < 0 && (vm.cooldownTime = 0,
            vm.closeGiftTray(),
            $interval.cancel(cooldownTimer))
        }
        , 1e3)
    }
    function resetChat(event, data) {
        vm.newComment = void 0,
        document.getElementById("topfan-slider") && angular.element(document.getElementById("topfan-slider")).scrollLeft(0),
        vm.premiumGiftSelected && vm.premiumGiftSelected.opened && (vm.premiumGiftSelected.opened = !1,
        $timeout(function() {
            vm.premiumGiftSelected = void 0
        }
        , 700)),
        vm.collapsedGiftTray || (vm.collapsedGiftTray = !0),
        vm.fanMailMessage = void 0,
        vm.fanmailInvalid = void 0,
        vm.topFanPosition = "start",
        vm.cooldownTime = checkChatCooldown(),
        0 !== vm.cooldownTime && startCoolDownTimer()
    }
    var postedComment, scrollChatToBottom, timeUntilPost, chatcoolDownGift, cooldownTimer, vm = this, storeGifts = ["TIP", "FANMAIL", "50_LIKES_BROADCASTER", "CHATCOOLDOWN"];
    vm.chatWindow = angular.element(document.getElementById("chatcomments")),
    vm.topfanSlider = document.getElementById("topfan-slider"),
    vm.nextFanBtn = angular.element(document.getElementById("nextfan")),
    vm.prevFanBtn = angular.element(document.getElementById("prevfan")),
    vm.topfanSliderEl = angular.element(vm.topfanSlider),
    vm.thumb = config.settings.ServerCDNBaseUrl + "/php/api/channel/getImage/channelId=",
    vm.noThumb = config.settings.ServerCDNBaseUrl + "/images/nothumb.jpg",
    vm.baseImageUrlv3 = config.settings.ServerCDNBaseUrl + "/angularjsapp/src/assets/images/icons_v3",
    vm.baseImageUrl = config.settings.ServerCDNBaseUrl + "/images/public/gifts/v2",
    vm.swf = swf,
    vm.Api = Api,
    vm.session = session,
    vm.broadcast = broadcasterService,
    vm.activeTab = "Chat",
    vm.alert = "",
    vm.chatCooldown = swf.chatCoolDown,
    vm.fanMailAnimation = config.settings.ServerCDNBaseUrl + "/angularjsapp/src/assets/animations/FAN_MAIL.gif",
    vm.fanMailStatic = vm.baseImageUrlv3 + "/_gifts/FAN_MAIL.png",
    vm.fanmailAnimState = vm.fanMailStatic,
    vm.spamCounter = [],
    vm.Api = Api,
    vm.collapsedGiftTray = !0,
    vm.bcGifts = [],
    vm.globalVars = window.globalVars,
    vm.config = config,
    swf.activeChatTab = vm.activeTab;
    var a = document.createElement("a");
    "undefined" != typeof a.download ? vm.downloadable = !0 : vm.downloadable = !1,
    vm.chatInputText = function() {
        return vm.swf.broadcast ? 1 == vm.swf.broadcast.chatMode ? vm.session.subStatus[vm.swf.broadcast.userId] ? "Chat with " + (vm.swf.broadcast.subscribersCount || 0) + " subscriber" + (1 != vm.swf.broadcast.subscribersCount ? "s" : "") : "Subscriber-Only mode: Chat here..." : "Chat with " + (vm.swf.broadcast.viewers || 0) + " viewer" + (1 != vm.swf.broadcast.viewers ? "s" : "") : !1
    }
    ,
    vm.togglePlayerFullscreen = function() {
        swf.fullscreenActive ? vm.hidePlayerFullscreen() : vm.showPlayerFullscreen()
    }
    ,
    vm.showPlayerFullscreen = function() {
        vm.fullscreenStart = Math.floor(Date.now() / 1e3),
        $rootScope.gaEvent("FULLSCREEN", "ENTER_FULLSCREEN", config.preferredLocale),
        $document.on("keyup", function(ev) {
            27 == ev.which && vm.hidePlayerFullscreen()
        }
        ),
        swf.fullscreenActive || (swf.fullscreenIn = !0,
        $timeout(function() {
            document.documentElement.classList.add("overflow-hidden"),
            swf.fullscreenActive = !0
        }
        , 500),
        $timeout(function() {
            swf.fullscreenIn = !1
        }
        , 600)),
        "Chat" != swf.activeChatTab && vm.reloadChatTab()
    }
    ,
    vm.hidePlayerFullscreen = function() {
        vm.fullscreenEnd = Math.floor(Date.now() / 1e3),
        vm.fullscreenStart && (vm.fullscreenDuration = vm.fullscreenEnd - vm.fullscreenStart),
        $rootScope.gaEvent("FULLSCREEN", "LEAVE_FULLSCREEN", config.preferredLocale, vm.fullscreenDuration),
        $document.off("keyup"),
        swf.fullscreenActive && (swf.fullscreenOut = !0,
        $timeout(function() {
            document.documentElement.classList.remove("overflow-hidden"),
            swf.fullscreenActive = !1
        }
        , 400),
        $timeout(function() {
            swf.fullscreenOut = !1
        }
        , 500)),
        window.scrollTo(0, 0)
    }
    ,
    vm.openGiftTray = function() {
        vm.collapsedGiftTray = !1
    }
    ,
    vm.closeGiftTray = function() {
        vm.premiumGiftSelected && vm.premiumGiftSelected.opened && (vm.premiumGiftSelected.opened = !1),
        vm.premiumGiftSelected && vm.premiumGiftSelected.buying && (vm.premiumGiftSelected.buying = !1),
        vm.collapsedGiftTray = !0,
        vm.fanMailMessage = void 0,
        $timeout(function() {
            anchorChat()
        }
        , 800)
    }
    ,
    vm.toggleGiftTray = function(open) {
        open || vm.collapsedGiftTray ? vm.openGiftTray() : vm.closeGiftTray(),
        $timeout(function() {
            anchorChat()
        }
        , 800)
    }
    ,
    Api.get("store/goodies/v2", {}, !0).then(function(response) {
        vm.giftItems = [],
        vm.bcGiftItems = [],
        swf.giftSkus = {},
        swf.giftObjects = {};
        var gift, currentGift;
        for (gift in response.data.goodies)
            currentGift = response.data.goodies[gift],
            swf.giftSkus[currentGift.id] = currentGift.SKU,
            currentGift.displayMode && "1" !== currentGift.displayMode && (swf.giftObjects[currentGift.SKU] = {
                id: currentGift.id,
                minVis: 1e3 * currentGift.minVisDuration,
                maxVis: 1e3 * currentGift.maxVisDuration
            }),
            currentGift.hidden !== !0 && vm.giftItems.push(currentGift),
            currentGift.broadcasterType && currentGift.broadcasterType && currentGift.hidden && -1 !== currentGift.SKU.indexOf("BROADCASTER") && vm.bcGifts.push(currentGift),
            "CHATCOOLDOWN" == currentGift.SKU && (chatcoolDownGift = currentGift)
    }
    ),
    vm.chatWindow.on("mouseenter", function() {
        scrollChatToBottom && $timeout.cancel(scrollChatToBottom)
    }
    ),
    vm.nextFanBtn.on("mouseleave", anchorChat),
    vm.prevFanBtn.on("mouseleave", anchorChat),
    vm.topfanSliderEl.on("mouseleave", anchorChat),
    vm.changeTopFan = function(direction) {
        vm.isScrolling = !0;
        var width = 210
          , lastWidth = 400
          , delay = 200
          , position = Math.ceil(Math.round(vm.topfanSlider.scrollLeft) / width) * width + width * direction;
        vm.topfanSliderEl.scrollLeft(position, delay).then(function() {
            vm.topFanPosition = 0 === vm.topfanSlider.scrollLeft ? "start" : vm.topfanSlider.scrollLeft === vm.topfanSlider.scrollWidth - lastWidth ? "end" : ""
        }
        )["finally"](function() {
            vm.isScrolling = !1
        }
        )
    }
    ,
    vm.postComment = function() {
        if (!session.user || !session.user.userId)
            return session.showLoginModal("", "CHAT"),
            !1;
        if (session.user.userId != vm.swf.broadcast.userId && 1 == vm.swf.broadcast.chatMode && !session.subStatus[vm.swf.broadcast.userId])
            return $modal.subscribeModal(vm.swf.broadcast.userId),
            !1;
        if ($rootScope.gaEvent("Conversion", "Chat (Attempt)", trackingPixel.getUserLocation() || "ANCILLARY"),
        vm.commentForm.commentInput.$valid) {
            if (vm.cooldownTime > 0)
                return vm.postGift(chatcoolDownGift),
                !1;
            if (postedComment = vm.newComment,
            vm.newComment = void 0,
            0 === vm.cooldownTime && (isSpam(postedComment) || vm.spamTimer) && 0 === session.user.role && 1 !== session.user.partner)
                return "" !== vm.alert ? !1 : (vm.alert = "Dude stop spamming!",
                $timeout(function() {
                    vm.alert = ""
                }
                , 2500),
                vm.spamTimer || startSpamTimer(),
                !1);
            if (0 === postedComment.length)
                return !1;
            vm.swf.postChatComment(postedComment, session.user.userId, broadcasterService.broadcaster.userId).then(function(response) {
                if (0 === response.data.errorCode) {
                    if (response.data.thresholdDelay && (vm.cooldownTime = response.data.thresholdDelay,
                    startCoolDownTimer()),
                    postedComment.match(/^!!(a |b )/g))
                        return postedComment = void 0,
                        !1;
                    if (postedComment = Api.stripHTML(postedComment),
                    !postedComment)
                        return !1;
                    var userComment = new vm.swf.Comment(postedComment,Api.fullName(session.user),session.user.userId,session.user.realLevel,response.data.chatRole,!1,!1,response.data.subscriptionType);
                    userComment.hashedComment = Api.replaceHash(Api.convertEmoji(Api.linkify(Api.stripHTML(userComment.comment)))),
                    vm.swf.broadcast.comments.push(userComment)
                }
            }
            )
        }
    }
    ,
    vm.postGift = function(gift, Filedata, targetNetwork, $event) {
        if (session.user.userId != vm.swf.broadcast.userId && "BARS" != gift.costType && 1 == vm.swf.broadcast.chatMode && !session.subStatus[swf.broadcast.userId])
            return $modal.subscribeModal(swf.broadcast.userId),
            !1;
        if ($rootScope.gaEvent("Conversion", "Gift (Attempt)", trackingPixel.getUserLocation() || "ANCILLARY"),
        gift.minLevel > session.user.realLevel)
            return !1;
        if (swf.stickersMultiplier && 2 == gift.dynamicCost ? gift.purchasePrice = Math.floor(Number(gift.cost * swf.stickersMultiplier)) : swf.dynamicPricedGoodies && 1 == gift.dynamicCost ? gift.purchasePrice = swf.dynamicPricedGoodies[gift.SKU] : gift.purchasePrice = gift.cost,
        "BARS" === gift.costType)
            return "PROPOSAL_RING" === gift.SKU && (gift.name = "Proposal"),
            "50_LIKES_BROADCASTER" === gift.SKU && (gift.name = "Buy 50 Likes"),
            "CHATCOOLDOWN" === gift.SKU && (gift.name = "Whoa the chat is busy!"),
            vm.premiumGiftSelected = gift,
            vm.premiumGiftSelected.opened = !0,
            vm.collapsedGiftTray = !1,
            !1;
        if (!gift.giftQuantity) {
            if (!session.user.userId)
                return !1;
            if (0 !== session.user.banId)
                return !1;
            if (session.user.realLevel < gift.minLevel)
                return !1;
            gift.giftQuantity = 0,
            gift.totalCost = 0
        }
        session.user.userCoins - gift.cost >= 0 && (session.user.userCoins = session.user.userCoins - gift.purchasePrice,
        gift.totalCost += gift.purchasePrice,
        gift.giftQuantity++,
        timeUntilPost = 1e3,
        $event && (angular.element($event.target).css("transform", "scale(1.1)"),
        $timeout(function() {
            angular.element($event.target).css("transform", "scale(1)")
        }
        , 200)),
        1 === gift.giftQuantity && $timeout(function() {
            vm.swf.postGift(session.user.userId, broadcasterService.broadcaster.userId, gift.id, gift.giftQuantity, Filedata, targetNetwork).then(function(response) {
                0 !== response.data.errorCode ? session.user.userCoins = session.user.userCoins + gift.totalCost : vm.swf.broadcast.comments.push(new vm.swf.Comment("",Api.fullName(session.user),session.user.userId,session.user.realLevel,response.data.chatRole,gift.id,gift.giftQuantity,response.data.subscriptionType)),
                gift.giftQuantity = 0
            }
            )
        }
        , timeUntilPost))
    }
    ,
    vm.buyGift = function(tip) {
        if (0 === vm.premiumGiftSelected.VIP || "1" === broadcasterService.broadcaster.partner && 2 === vm.premiumGiftSelected.VIP) {
            if ("FANMAIL" === vm.premiumGiftSelected.SKU && !vm.fanMailMessage)
                return vm.fanmailInvalid = !0,
                $timeout(function() {
                    vm.fanmailInvalid && (vm.fanmailInvalid = !1)
                }
                , 5e3),
                !1;
            vm.premiumGiftSelected.buying = !0;
            var data = {
                userId: session.user.userId,
                channelId: broadcasterService.broadcaster.userId,
                sku: vm.premiumGiftSelected.SKU
            };
            if ("FANMAIL" === vm.premiumGiftSelected.SKU && (data.fanMailText = vm.fanMailMessage),
            "TIP" === vm.premiumGiftSelected.SKU && tip ? (data.qty = tip,
            data.currentCost = tip) : "0" === vm.premiumGiftSelected.dynamicCost ? data.currentCost = vm.premiumGiftSelected.purchasePrice : data.currentCost = swf.dynamicPricedGoodies[vm.premiumGiftSelected.SKU],
            session.user.vault.webBars - data.currentCost < 0)
                return $modal.buyBars(session.user.spendingDisabled).result.then(function(response) {
                    response && vm.buyGift(tip)
                }
                , function(response) {
                    vm.premiumGiftSelected.buying = !1
                }
                ),
                !1;
            -1 === storeGifts.indexOf(vm.premiumGiftSelected.SKU) ? swf.postGift(data.userId, data.channelId, vm.premiumGiftSelected.id).then(function(response) {
                session.user.vault.webBars = response.data.bars,
                vm.closeGiftTray()
            }
            ) : Api.post("store/goodie", data).then(function(response) {
                0 === response.data.errorCode ? (session.user.vault.webBars = response.data.bars,
                vm.closeGiftTray(),
                "FANMAIL" === vm.premiumGiftSelected.SKU && (swf.broadcast && swf.broadcast.username.length > 9 ? vm.alert = "Fan Mail sent. Waiting for " + swf.broadcast.username.substring(0, 9) + "... to accept." : vm.alert = "Fan Mail sent. Waiting for " + swf.broadcast.username + " to accept.",
                vm.fanMailMessage = void 0,
                $timeout(function() {
                    vm.alert = ""
                }
                , 3e3)),
                "CHATCOOLDOWN" === vm.premiumGiftSelected.SKU && (swf.broadcast.currentChatInCooldown = !1,
                vm.cooldownTime = 0)) : vm.premiumGiftSelected.buying = !1
            }
            )
        }
    }
    ,
    vm.getMultiplierCost = function(gift) {
        if (!session.user || 0 === session.user.userId)
            return !1;
        if (0 !== session.user.banId)
            return !1;
        if (gift.minLevel > session.user.realLevel)
            return "Level " + Number(gift.minLevel) + " needed.";
        if ("TIP" === gift.SKU)
            return "Tip";
        if (gift.cost > session.user.userCoins && "COINS" === gift.costType)
            return "Not enough coins!";
        if (swf.stickersMultiplier && "0" == gift.dynamicCost) {
            var icon = "BARS" !== gift.costType ? config.settings.ServerCDNBaseUrl + "/images/younow_header/icon_coin_sm.png'> " : vm.baseImageUrlv3 + "/icon_bar_sm.png'> ";
            return "<img class='coin-sm' src='" + icon + gift.cost
        }
        return swf.dynamicPricedGoodies && 1 == gift.dynamicCost ? "<img class='coin-sm' src='" + vm.baseImageUrlv3 + "/icon_bar_sm.png'> " + swf.dynamicPricedGoodies[gift.SKU] : swf.stickersMultiplier && 2 == gift.dynamicCost ? "<img class='coin-sm' src='" + config.settings.ServerCDNBaseUrl + "/images/younow_header/icon_coin_sm.png'> " + Math.ceil(Number(gift.cost * swf.stickersMultiplier)) : void 0
    }
    ,
    vm.openProfile = function(id, comment, source) {
        comment ? $modal.profileSummary(id, {
            comment: encodeURIComponent(comment.comment),
            source: source
        }) : $modal.profileSummary(id, {
            source: source
        })
    }
    ,
    vm.respondToFanMail = function(mail, state) {
        vm.swf.fanMailRequestQueue[0].isShowing = !1,
        $timeout(function() {
            swf.fanMailRequestQueue.splice(0, 1),
            Api.post("store/setState", {
                transactionId: mail.goodieTransactionId,
                state: state,
                userId: session.user.userId
            })
        }
        , 700)
    }
    ,
    vm.dismissFanMail = function() {
        swf.fanMailQueue[0] && (swf.fanMailQueue[0].isShowing = !1),
        $timeout(function() {
            swf.fanMailQueue.splice(0, 1),
            $timeout.cancel(swf.fanMailTimer),
            1 === swf.fanMailQueue.length ? swf.fanMailDisplay(swf.giftObjects.FANMAIL.maxVis) : swf.fanMailDisplay(swf.giftObjects.FANMAIL.minVis)
        }
        , 1e3)
    }
    ,
    vm.disabledGiftTray = function() {
        $rootScope.gaEvent("Conversion", "Gift (Attempt)", trackingPixel.getUserLocation() || "ANCILLARY"),
        0 === session.user.userId && session.showLoginModal("", "GIFT"),
        session.isBroadcasting && session.preventBroadcastInterrupt()
    }
    ,
    vm.newSnapshot = function() {
        swf.getSnapshot(),
        shareService.trackFunnel("snapshot")
    }
    ,
    vm.attemptShare = function(target) {
        vm.share(target),
        shareService.trackFunnel(target + "_attempt"),
        !swf.snapshot.messageAdded && swf.broadcast.share_message && (shareService.trackFunnel("message"),
        swf.snapshot.messageAdded = !0)
    }
    ,
    vm.share = function(target) {
        if (swf.snapshot || swf.getSnapshot(),
        "object" != typeof vm.swf.snapshot.shared && (swf.snapshot.shared = {}),
        "object" != typeof vm.swf.snapshot.sharing && (swf.snapshot.sharing = {}),
        !vm.swf.broadcast || !session.user)
            return !1;
        if (!session.loggedIn)
            return session.showLoginModal("", "SHARE").result.then(function(response) {
                vm.share(target)
            }
            ),
            !1;
        if (swf.snapshot.sharing[target] = !0,
        "facebook" == target && shareService.shareFacebook(),
        "twitter" == target && shareService.shareTwitter().then(function(response) {}
        )["catch"](function(response) {
            "error" === response && (swf.snapshot.shared.twitter_login_attempted || (swf.snapshot.shared.twitter_login_attempted = !0,
            vm.share(target)))
        }
        ),
        "invite" == target) {
            if (swf.broadcast.shared.younow)
                return Api.showTopNotification("You can only invite your fans to a broadcast once."),
                shareService.trackFunnel(target + "_duplicate"),
                !1;
            if (!swf.broadcast || swf.broadcast.share_message && 0 !== swf.broadcast.share_message.length)
                shareService.sendShare("younow", 1);
            else {
                var modalInstance = $modal.shareBroadcast(swf.broadcast.share_message);
                modalInstance.result.then(function(response) {
                    response && response.length > 0 && (swf.broadcast.share_message = response,
                    shareService.sendShare("younow", 1))
                }
                )
            }
            swf.snapshot.sharing[target] = !1
        }
    }
    ,
    vm.buyBars = function() {
        $modal.buyBars(session.user.spendingDisabled)
    }
    ,
    eventbus.subscribe("swf:reset", resetChat, "chat", $scope),
    eventbus.subscribe("chatMode:one", vm.closeGiftTray, "chat", $scope),
    $scope.$on("$destroy", function() {
        cooldownTimer && $interval.cancel(cooldownTimer),
        vm.spamTimer && $interval.cancel(vm.spamTimer),
        $document.off("keyup")
    }
    )
}
]).directive("channelChat", ["$interval", "broadcasterService", "swf", "$state", "$timeout", "$q", function($interval, broadcasterService, swf, $state, $timeout, $q) {
    return {
        restrict: "A",
        templateUrl: "angularjsapp/src/app/components/chat/chat.tpl.html",
        controller: "ChatCtrl",
        controllerAs: "vm",
        scope: {},
        compile: function(scope, elem, attr, ctrl) {
            return {
                post: function(controller, scope) {
                    function reloadChatUI() {
                        vm.chatWindow = angular.element(document.getElementById("chatcomments")),
                        vm.topfanSlider = document.getElementById("topfan-slider"),
                        vm.nextFanBtn = angular.element(document.getElementById("nextfan")),
                        vm.prevFanBtn = angular.element(document.getElementById("prevfan")),
                        vm.topfanSliderEl = angular.element(vm.topfanSlider),
                        vm.isScrolling = !1,
                        vm.lastHeight = 1,
                        vm.chatWindow.off("scroll"),
                        vm.chatWindow.on("scroll", function() {
                            lastScrollTime = (new Date).getTime()
                        }
                        ),
                        vm.chatWindow.off("mouseover"),
                        vm.chatWindow.on("mouseover", function() {
                            lastMousemoveTime = (new Date).getTime()
                        }
                        )
                    }
                    function scrollChat(params) {
                        if (params = params || {},
                        ("main.channel.detail" !== $state.current.name || broadcasterService.async === !0) && $interval.cancel(scrollChatInterval),
                        void 0 === vm.chatWindow[0])
                            return reloadChatUI(),
                            !1;
                        if (vm.pauseChat)
                            return !1;
                        var currentTime = (new Date).getTime();
                        if (vm.isScrolling)
                            return !1;
                        if (!params.instant && (2e3 > currentTime - lastMousemoveTime || 2e3 > currentTime - lastScrollTime))
                            return !1;
                        swf.broadcast && swf.broadcast.comments.length > 1e3 && trimChat(swf.broadcast.comments);
                        var scrollDuration = 1e3;
                        params.instant && (scrollDuration = 0);
                        var divHeight = vm.chatWindow[0].clientHeight
                          , contentHeight = vm.chatWindow[0].scrollHeight
                          , oldScrollBottom = vm.chatWindow.scrollTop() + divHeight
                          , newScrollTop = contentHeight - divHeight;
                        if (contentHeight > oldScrollBottom) {
                            if (380 > contentHeight - oldScrollBottom) {
                                var multiplier = (contentHeight - oldScrollBottom) / 380;
                                scrollDuration *= multiplier
                            }
                            vm.chatWindow.scrollTop(newScrollTop, scrollDuration)
                        }
                    }
                    function scrollInit(params) {
                        params = params || {},
                        reloadChatUI(),
                        $interval.cancel(scrollChatInterval),
                        vm.chatWindow[0] && scrollChat({
                            instant: !0
                        }),
                        scrollChatInterval = $interval(scrollChat, 1e3)
                    }
                    var scrollChatInterval, vm = controller.vm, lastScrollTime = 0, lastMousemoveTime = 0, trimChat = function(chatArray) {
                        for (; chatArray.length > 500; )
                            chatArray.shift();
                        return chatArray
                    }
                    ;
                    scrollInit(),
                    angular.element(window).on("focus", function() {
                        scrollInit({
                            instant: !0
                        })
                    }
                    ),
                    angular.element(window).on("blur", function() {
                        $interval.cancel(scrollChatInterval)
                    }
                    ),
                    scope.on("$destroy", function() {
                        angular.element(window).off("focus"),
                        scrollChatInterval && $interval.cancel(scrollChatInterval)
                    }
                    ),
                    vm.reloadChatTab = function() {
                        vm.swf.activeChatTab = "Chat",
                        vm.fanmailAnimState = vm.fanMailStatic,
                        $timeout(function() {
                            scrollInit({
                                instant: !0
                            })
                        }
                        )
                    }
                }
            }
        }
    }
}
]),
angular.module("younow.modals.confirm", []).directive("confirm", ["$modal", function($modal) {
    return {
        restrict: "A",
        scope: {
            confirm: "=",
            confirmData: "="
        },
        link: function(scope, element, attrs) {
            element.bind("click", function() {
                var ConfirmCtrl = ["$scope", "message", function($scope, message) {
                    $scope.message = message
                }
                ]
                  , modalInstance = $modal.open({
                    templateUrl: "angularjsapp/src/app/components/confirm-modal/confirm.tpl.html",
                    controller: ConfirmCtrl,
                    windowClass: "confirmation-modal",
                    resolve: {
                        message: function() {
                            return attrs.confirmMessage || "Are you sure?"
                        }
                    }
                });
                modalInstance.result.then(function() {
                    scope.confirm(scope.confirmData)
                }
                , function() {}
                )
            }
            )
        }
    }
}
]),
angular.module("younow.modals.ep", []).controller("epModalCtrl", ["$scope", "config", "session", "$modalInstance", "Api", "data", function($scope, config, session, $modalInstance, Api, data) {
    $scope.modal = {
        state: data.state ? data.state : "intro"
    };
    var states = {
        intro: 2,
        description: 2,
        expired: 4
    };
    $scope.modal.thumb = config.settings.ServerCDNBaseUrl + "/php/api/channel/getImage/channelId=" + session.user.userId,
    $scope.modal.noThumb = config.settings.ServerCDNBaseUrl + "/images/nothumb.jpg",
    $scope.modal.session = session,
    $scope.modal.name = Api.friendlyName(session.user),
    $scope.modal["continue"] = function() {
        "intro" === $scope.modal.state ? $scope.modal.state = "description" : $modalInstance.close()
    }
    ,
    $scope.$on("$destroy", function() {
        Api.post("channel/updateEditorsPick", {
            userId: session.user.userId,
            channelId: session.user.userId,
            locale: config.preferredLocale,
            state: states[$scope.modal.state]
        })
    }
    )
}
]),
angular.module("younow.fan-button", []).directive("fanButton", ["session", "Api", "broadcasterService", "config", "trackingPixel", "$rootScope", function(session, Api, broadcasterService, config, trackingPixel, $rootScope) {
    return {
        restrict: "A",
        templateUrl: "angularjsapp/src/app/components/fan-button/fan-button.tpl.html",
        scope: {
            channel: "=",
            size: "@"
        },
        link: function(scope, element, attributes) {
            "small" === scope.size && element.addClass("btn-small"),
            scope.base = config.settings.ServerCDNBaseUrl,
            scope.hidden = !0,
            scope.subStatus = session.subStatus,
            scope.fanStatus = session.fanStatus,
            scope.checkFan = function(channel) {
                channel && channel.userId && (session.user && channel.userId == session.user.userId ? scope.hidden = !0 : (session.getFan(channel.userId),
                scope.hidden = !1),
                scope.channel = channel)
            }
            ,
            scope.$watch("channel", scope.checkFan, !0),
            scope.toggleFan = function() {
                if ($rootScope.gaEvent("Conversion", "Fan (Attempt)", trackingPixel.getUserLocation() || "ANCILLARY"),
                !session.loggedIn)
                    return session.showLoginModal("", "FAN"),
                    !1;
                var apiMethod, fanCountChange;
                session.fanStatus[scope.channel.userId] ? (apiMethod = "channel/unFan",
                fanCountChange = -1) : (apiMethod = "channel/fan",
                fanCountChange = 1);
                var apiPost = {
                    userId: session.user.userId,
                    channelId: scope.channel.userId
                };
                broadcasterService.broadcaster && broadcasterService.broadcaster.broadcastId && (apiPost.broadcastId = broadcasterService.broadcaster.broadcastId),
                element[0].parentElement.attributes["track-source"] && (apiPost.fan_type = element[0].parentElement.attributes["track-source"].value),
                Api.post(apiMethod, apiPost).then(function(response) {
                    response.data && !response.data.errorCode && (session.fanStatus[scope.channel.userId] = fanCountChange > 0 ? !0 : !1,
                    scope.channel.totalFans = 1 * scope.channel.totalFans + fanCountChange,
                    scope.callback && scope.callback())
                }
                )
            }
        }
    }
}
]),
angular.module("younow.footer", ["ui.router"]).directive("footer", function() {
    return {
        restrict: "A",
        replace: !0,
        templateUrl: "angularjsapp/src/app/components/footer/footer.tpl.html",
        controller: "FooterCtrl"
    }
}
).controller("FooterCtrl", ["$scope", "$rootScope", "$http", "$window", "$state", "$modal", "config", "$translate", "session", "Api", function($scope, $rootScope, $http, $window, $state, $modal, config, $translate, session, Api) {
    config.init.then(function() {
        $scope.CDN_BASE_URL = config.settings.ServerCDNBaseUrl
    }
    ),
    $scope.state = $state,
    $scope.config = config,
    $scope.openModal = function(src) {
        return $state.is("about") && $window.navigator.userAgent.search("Chrome/39") > 0 ? ($window.open(src, "_blank"),
        !1) : void $modal.iframe(src)
    }
    ,
    $scope.openAsModal = function(e) {
        return $state.is("about") && $window.navigator.userAgent.search("Chrome/39") > 0 ? !0 : ($modal.iframe(e.target.href),
        void e.preventDefault())
    }
    ,
    $scope.openDoc = function(e, label) {
        $scope.doAboutClick("Footer link", label),
        $state.is("policy") || ($window.open(e.target.href, "_blank"),
        e.preventDefault())
    }
    ,
    $scope.showAbout = function() {
        $state.go("about")
    }
    ,
    $scope.downloadApp = function(platform) {
        Api.goMobile(platform, session.user.level, "_FOOTER")
    }
    ,
    $scope.doAboutClick = function(action, label) {
        $state.is("about") && $rootScope.gaEvent("About Page Button Click", action, label)
    }
}
]),
angular.module("younow.modals.gate", []).controller("GateModalCtrl", ["$scope", "$translate", "$modalInstance", "data", function($scope, $translate, $modalInstance, data) {
    $scope.data = data,
    $scope.respond = function(reponse) {
        $modalInstance.close(reponse)
    }
}
]),
angular.module("younow.header", ["ui.router"]).directive("header", function() {
    return {
        restrict: "A",
        replace: !0,
        templateUrl: "angularjsapp/src/app/components/header/header.tpl.html",
        controller: "HeaderCtrl"
    }
}
).controller("HeaderCtrl", ["$location", "$scope", "$state", "$timeout", "config", "session", "swf", "broadcasterService", "Api", "$translate", "$modal", "$rootScope", "eventbus", "trackingPixel", function($location, $scope, $state, $timeout, config, session, swf, broadcasterService, Api, $translate, $modal, $rootScope, eventbus, trackingPixel) {
    $scope.session = session,
    $scope.config = config,
    $scope.swf = swf,
    $scope.broadcasterService = broadcasterService,
    $scope.searchBox = "",
    $scope.userMenuOpened = !1,
    $scope.Api = Api,
    $scope.locales = [],
    config.init.then(function() {
        for (var locale in config.settings.Locales)
            $scope.locales.push({
                locale: locale,
                name: config.settings.Locales[locale].name
            })
    }
    );
    var privateScope = {};
    $scope.getBars = function() {
        return session.user && 0 !== session.user.banId ? (session.checkBan(),
        !1) : void $modal.buyBars(session.user.spendingDisabled)
    }
    ,
    $scope["goto"] = function(path) {
        return path ? ("http" == path.substr(0, 4) && (path = path.slice(path.indexOf(path.split("/")[3]))),
        void $location.path(path)) : !1
    }
    ,
    $scope.selfProfile = function() {
        session.isBroadcasting || swf.settingUpBroadcast ? session.preventBroadcastInterrupt() : $scope["goto"](session.user.profile)
    }
    ,
    $scope.onMainPage = function() {
        return broadcasterService.broadcaster && broadcasterService.broadcaster.broadcastId && $state.is("main.channel.detail") ? !0 : !1
    }
    ,
    $scope.showTutorial = function() {
        broadcasterService.switchToBroadcast(),
        swf.showTutorial()
    }
    ,
    $scope.checkNotifications = function(e) {
        var isOpen = angular.element(document.getElementById("notifications-dropdown")).hasClass("open");
        isOpen || (session.notificationCount = 0,
        session.getNotifications(0))
    }
    ,
    $scope.openNotification = function(notification) {
        notification.linkTo ? $scope["goto"](notification.linkTo) : (broadcasterService.channelSwitch = "NOTIFICATION",
        broadcasterService.switchBroadcaster(notification.eventUserId))
    }
    ,
    $scope.openSettings = function(section) {
        return session.user && 0 !== session.user.banId ? (session.checkBan(),
        !1) : swf.settingUpBroadcast ? (session.preventBroadcastInterrupt(),
        !1) : (section = section ? "#" + section : "",
        void $location.url("settings" + section))
    }
    ,
    $scope.openWindow = function(url, anchor) {
        return swf.settingUpBroadcast ? (session.preventBroadcastInterrupt(),
        !1) : (anchor = anchor ? "#" + anchor : "",
        void window.open(url + anchor, "_blank"))
    }
    ,
    $scope.openModForm = function(url, anchor) {
        var params = {}
          , fullTime = new Date
          , minutes = fullTime.getMinutes();
        0 !== session.user.userId && (params.field1 = session.user.firstName,
        params.field2 = session.user.lastName,
        params.field17 = session.user.email),
        broadcasterService.broadcaster && broadcasterService.broadcaster.username && (params.field19 = window.location.protocol + "://www.younow.com/" + broadcasterService.broadcaster.profile,
        params.field5 = broadcasterService.broadcaster.username),
        params.field7 = fullTime.getHours() > 12 ? fullTime.getHours() - 12 : fullTime.getHours(),
        params["field7-1"] = 10 > minutes ? "0" + minutes : minutes,
        params["Field7-3"] = fullTime.getHours() < 12 ? "AM" : "PM",
        url = Api.buildWufooUrl(url + "/", params),
        anchor = anchor ? "#" + anchor : "",
        window.open(url + anchor, "_blank")
    }
    ,
    $scope.isPartner = function(type) {
        if (session.user) {
            var partner = session.user.partner;
            if ("active" === type && 1 === partner)
                return !0;
            if ("pending" === type && (2 === partner || 6 === partner || 7 === partner))
                return !0
        }
        return !1
    }
    ,
    $scope.loadChannel = function(id) {
        broadcasterService.channelSwitch = "QUEUE",
        broadcasterService.switchBroadcaster(id)
    }
    ,
    $scope.setLocale = function(locale) {
        var params = {
            userId: session.user.userId,
            channelId: session.user.userId,
            locale: locale
        };
        $rootScope.gaEvent("FEATURE", "headerlocale", config.preferredLocale + "-" + locale),
        Api.post("channel/updateSettings", params).then(function(response) {
            0 === response.data.errorCode && (session.updateLocale(locale),
            broadcasterService.featuredBroadcaster(!1, !0))
        }
        )
    }
    ,
    $scope.dismissUserMenu = function(close) {
        privateScope && privateScope.dismissUserMenu && $timeout.cancel(privateScope.dismissUserMenu),
        privateScope && close && (privateScope.dismissUserMenu = $timeout(function() {
            $scope.userMenuOpened = !1
        }
        , 500))
    }
    ,
    $scope.goLive = function() {
        return session.checkBan() ? !1 : session.isBroadcasting || swf.settingUpBroadcast ? (session.preventBroadcastInterrupt(),
        !1) : (broadcasterService.goLive(),
        void swf.goLive())
    }
    ,
    $scope.goToExplore = function() {
        $rootScope.gaEvent("Conversion", "Go To Explore", trackingPixel.getUserLocation() || "ANCILLARY")
    }
    ,
    $scope.getTheApp = function() {
        $modal.mobileDownload(trackingPixel.getUserLocation() || "ANCILLARY")
    }
    ,
    $scope.loginClick = function(event) {
        $rootScope.gaEvent("Conversion", event, trackingPixel.getUserLocation() || "ANCILLARY")
    }
    ,
    $scope.clickLogo = function() {
        session.user && 0 === session.user.userId ? (config.showHomepage = !0,
        $state.go("home")) : broadcasterService.featuredBroadcaster()
    }
    ,
    eventbus.subscribe("user:onNotificationCountChange", function() {
        angular.element(document.getElementById("notifications-dropdown")).hasClass("open") && (session.notificationCount = 0,
        session.getNotifications(0))
    }
    , "header", $scope)
}
]),
angular.module("younow.modals.iframe", []).controller("IframeModalCtrl", ["$scope", "Api", "src", function($scope, Api, src) {
    $scope.src = Api.trustedSrc(src)
}
]),
angular.module("younow.infinite-scroll", []).directive("infiniteScroll", ["$window", "$document", function($window, $document) {
    return {
        scope: {
            infiniteScroll: "&",
            canLoad: "&"
        },
        link: function(scope, element, attrs) {
            var offset = parseInt(attrs.threshold) || 0
              , e = element[0]
              , atBottom = function() {
                return e.scrollTop + e.offsetHeight >= e.scrollHeight - offset
            }
            ;
            attrs.pagescroll && (element = $document,
            atBottom = function() {
                return $document.scrollTop() + $window.innerHeight >= $document[0].body.offsetHeight - offset
            }
            ),
            element.bind("scroll", function() {
                if (!scope.loading && scope.canLoad() && atBottom()) {
                    scope.loading = !0;
                    var request = scope.infiniteScroll();
                    request && request.then ? request.then(function() {
                        scope.loading = !1
                    }
                    ) : scope.loading = !1
                }
            }
            )
        }
    }
}
]),
angular.module("younow.leftsidebar", []).directive("leftsidebar", function() {
    return {
        restrict: "A",
        templateUrl: "angularjsapp/src/app/components/left-sidebar/left-sidebar.tpl.html",
        controller: "LeftSidebarCtrl",
        controllerAs: "leftSidebar"
    }
}
).controller("LeftSidebarCtrl", ["$scope", "$rootScope", "broadcasterService", "dashboard", "session", "swf", "config", "Api", "$state", "trackingPixel", function($scope, $rootScope, broadcasterService, dashboard, session, swf, config, Api, $state, trackingPixel) {
    var leftSidebar = this;
    $scope.leftSidebar.baseImages = config.settings.ServerCDNBaseUrl + "/angularjsapp/src/assets/images",
    leftSidebar.dashboard = dashboard,
    leftSidebar.broadcasterService = broadcasterService,
    leftSidebar.usersTrendingCollapsed = !1,
    leftSidebar.usersFeaturedCollapsed = !1,
    leftSidebar.tagsTrendingCollapsed = !1,
    leftSidebar.friendsCollapsed = !1,
    leftSidebar.mobileCollapsed = !1,
    leftSidebar.session = session,
    leftSidebar.getTagFeatured = function(tag) {
        return swf.settingUpBroadcast && (session.isBroadcasting = !0),
        session.isBroadcasting ? (session.preventBroadcastInterrupt(),
        !1) : ($rootScope.gaEvent("Conversion", "Click Tag", trackingPixel.getUserLocation() || "ANCILLARY"),
        trackingPixel.trackBroadcastViewtime("channel"),
        session.isBroadcasting = 0,
        broadcasterService.channelSwitch = "TAG",
        void (swf.settingUpBroadcast = !1))
    }
    ,
    leftSidebar.changeBroadcaster = function(id, channelSwitch) {
        return swf.settingUpBroadcast && (session.isBroadcasting = !0),
        session.isBroadcasting && !broadcasterService.async ? (session.preventBroadcastInterrupt(),
        !1) : swf.broadcast && broadcasterService && !broadcasterService.async && id == broadcasterService.broadcaster.userId && "main.channel.detail" === $state.current.name ? !1 : (broadcasterService.channelSwitch = channelSwitch,
        broadcasterService.switchBroadcaster(id),
        void (swf.settingUpBroadcast = !1))
    }
    ,
    leftSidebar.trackMobile = function(platform) {
        var activity;
        broadcasterService.async && "main.settings" !== $state.current.name && "about" !== $state.current.name && "policy" !== $state.current.name && "main.explore" !== $state.current.name && "lockout" !== $state.current.name && (activity = "PROFILE"),
        broadcasterService.async || (activity = "BROADCAST"),
        "main.explore" === $state.current.name && (activity = "EXPLORE"),
        void 0 === activity && (activity = "OTHER"),
        Api.goMobile(platform, session.user.level, "_SIDEBAR", activity)
    }
}
]),
angular.module("younow.modals.login", []).controller("LoginModalCtrl", ["$scope", "$rootScope", "$timeout", "$interval", "$modalInstance", "session", "Api", "config", "$state", "broadcasterService", "soft", "source", function($scope, $rootScope, $timeout, $interval, $modalInstance, session, Api, config, $state, broadcasterService, soft, source) {
    function checkPopup(type) {
        var secondsOpened = 0
          , twitterWindow = $interval(function() {
            secondsOpened++,
            60 === secondsOpened && window[type + "Popup"] && window[type + "Popup"].close && window[type + "Popup"].close(),
            20 === secondsOpened && "google" === type && ($scope.loggingIn[type] = !1,
            $interval.cancel(twitterWindow)),
            window[type + "Popup"] && window[type + "Popup"].closed && ($scope.loggingIn[type] = !1,
            $interval.cancel(twitterWindow))
        }
        , 1e3)
    }
    $scope.base = config.settings.ServerCDNBaseUrl,
    $scope.soft = soft,
    $scope.loggingIn = {},
    source || (source = $state.$current.name),
    $timeout(function() {
        "LINK" === source && (source = $state.is("main.channel.detail") ? broadcasterService.async ? "LINK_PROFILE" : "LINK_LIVE" : "LINK_OTHER"),
        $rootScope.gaEvent("LOGIN", "PROMPT", source)
    }
    , 500),
    $scope.ab = $rootScope.ab,
    $scope.showMoreOptions = function() {
        $scope.moreOptions = !0
    }
    ,
    $scope.cancel = function() {
        $modalInstance.dismiss("Modal closed without authenticating")
    }
    ,
    $scope.login = function(type) {
        $scope.attemptedLogin || ($scope.attemptedLogin = !0),
        $scope.loggingIn[type] = !0,
        checkPopup(type),
        $rootScope.gaEvent("LOGIN", "ATTEMPT_" + type.toUpperCase(), source),
        session.authenticate[type] ? $timeout(function() {
            session.auth(type).then(function(response) {
                response && response.data && response.data.id ? (response.data.newUser ? $rootScope.gaEvent("LOGIN", "LOGIN_NEW_" + type.toUpperCase(), source) : $rootScope.gaEvent("LOGIN", "LOGIN_RETURNING_" + type.toUpperCase(), source),
                $timeout(function() {
                    $modalInstance.close(response)
                }
                , 300),
                response.data.coinFeedbackCopy && response.data.coinFeedbackAmount && Api.showTopNotification(response.data.coinFeedbackCopy + ' <img class="coin-sm" src="' + config.settings.ServerCDNBaseUrl + '/angularjsapp/src/assets/images/icons_v3/menu_user_coins1.png">' + response.data.coinFeedbackAmount, "now", !1, void 0, 5e3)) : rejectLogin("Unsuccessful"),
                $scope.loggingIn[type] = !1
            }
            )["catch"](function() {
                $scope.loggingIn[type] = !1,
                rejectLogin("Failed to login")
            }
            )
        }
        , 0) : rejectLogin("Invalid auth method")
    }
    ;
    var rejectLogin = function(reason) {
        soft && $modalInstance.dismiss(reason)
    }
}
]),
angular.module("younow.modals.media-player-modal", []).directive("selectOnClick", function() {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            element.on("click", function() {
                this.select()
            }
            )
        }
    }
}
).controller("MediaPlayerModalCtrl", ["$rootScope", "$scope", "$modalInstance", "config", "Api", "session", "broadcastId", "trackingPixel", "$interval", "$timeout", "$state", "params", function($rootScope, $scope, $modalInstance, config, Api, session, broadcastId, trackingPixel, $interval, $timeout, $state, params) {
    var player, ptInterval, vm = this, ptSeconds = 0;
    params && void 0 !== params.start && ($state.params.copy = params.start,
    delete params.start),
    vm.channel = {},
    vm.broadcast = {},
    trackingPixel.archiveActive = !0,
    window.YouNow.track.pageFirst || (window.waitForPageType = !1,
    $rootScope.gaPage({
        pageType: "archived broadcast"
    })),
    Api.get("broadcast/videoPath", {
        broadcastId: broadcastId
    }, !0).then(function(response) {
        if (response.data.errorCode)
            console.warn(response.data.errorCode, response.data.errorMsg);
        else {
            vm.broadcast = response.data,
            vm.broadcast.id = broadcastId,
            jwplayer.key = config.settings.JW_PLAYER_KEY;
            var file = vm.broadcast.server + vm.broadcast.stream + "?sessionId=" + session.user.session
              , files = [{
                file: file
            }]
              , playerOptions = {
                file: file,
                levels: files,
                image: config.settings.ServerCDNBaseUrl + "/php/api/getBroadcastThumb/broadcastId=" + broadcastId,
                width: "592",
                height: "444",
                autostart: !0,
                controlbar: {
                    position: "bottom"
                },
                logo: {
                    file: config.settings.ServerCDNBaseUrl + "/images/jwlogo4.png",
                    position: "bottom-left",
                    margin: "0"
                },
                events: {
                    onError: function(data) {
                        $scope.gaEvent("Broadcast Player", "playbackError", "Profile Broadcasts")
                    },
                    onReady: function(data) {},
                    onPlay: function(data) {
                        vm.seekInterval || (player = jwplayer("media-player-modal-player"),
                        vm.seekInit()),
                        ptInterval || (ptInterval = $interval(function() {
                            window.showvt && console.log(ptSeconds + " +1"),
                            ptSeconds++
                        }
                        , 1e3))
                    },
                    onPause: function(data) {
                        $interval.cancel(ptInterval),
                        ptInterval = !1,
                        ptSeconds++
                    }
                }
            };
            jwplayer("media-player-modal-player").setup(playerOptions),
            Api.get("channel/getInfo", {
                channelId: vm.broadcast.userId
            }, !0).then(function(response) {
                response.data.errorCode ? console.warn(response.data.errorCode, response.data.errorMsg) : (vm.channel = response.data,
                vm.broadcast.sharePath = config.settings.ServerHomeBaseUrl + vm.channel.profile + "/" + broadcastId + "/" + vm.channel.channelId + "/1043/b/",
                vm.broadcast.shareTitle = vm.broadcast.broadcastTitle.replace(/\s/g, "-") + "",
                vm.broadcast.href = vm.broadcast.sharePath + vm.broadcast.shareTitle)
            }
            )
        }
    }
    );
    var seekSecsToString = function(secs) {
        var hrs = (Math.floor(secs / 3600) || "") + ""
          , hrs_ = "";
        hrs && (hrs_ = ":");
        var min = Math.floor(secs % 3600 / 60) || "0"
          , _min = "";
        (10 > min || "0" == min) && (_min = "0");
        var min_ = ":"
          , _sec = ""
          , sec = secs % 60 || "0";
        (10 > sec || "0" == sec) && (_sec = "0");
        var string = hrs + hrs_ + _min + min + min_ + _sec + sec;
        return string
    }
      , seekStringToSecs = function(str) {
        var num = 0
          , arr = str.split(":")
          , re = 0;
        if (arr[0]) {
            arr = arr.reverse();
            for (var i = 0; 3 > i; ) {
                var nu = re + (parseInt(arr[i]) || 0);
                re = 0,
                nu > 59 && (re = Math.floor(nu / 60),
                nu %= 60),
                num += nu * Math.pow(60, i),
                i++
            }
        }
        return num
    }
      , seekStringToString = function(str) {
        if (!str || str.indexOf(",-") > -1)
            return "00:00";
        str = str.replace(/[^\d:]/g, "");
        var sec = seekStringToSecs(str);
        return sec ? str = seekSecsToString(sec) : "00:00"
    }
    ;
    vm.seekOn = !1,
    vm.seekString = vm.seekValue = vm.broadcast.seekString = seekStringToString($state.params.copy),
    vm.seekInitial = vm.seekSec = seekStringToSecs(vm.seekString),
    $state.params.copy && $rootScope.gaEvent("FEATURE", "archived_seek", $state.params.copy),
    vm.seekInit = function() {
        vm.seekOn = !1,
        vm.seekString = vm.seekValue = vm.broadcast.seekString = seekStringToString($state.params.copy),
        vm.seekInitial = vm.seekSec = seekStringToSecs(vm.seekString),
        vm.seekSec && player.seek(vm.seekSec),
        vm.seekWatch(),
        player.getDuration() > 2 && player.onComplete(vm.seekReset),
        $state.params.copy = ""
    }
    ,
    vm.seekReset = function() {
        $interval.cancel(vm.seekInterval),
        player.seek(0),
        $timeout(function() {
            vm.seekInit()
        }
        , 500),
        $timeout(function() {
            player.getDuration() >= 0 && player.pause()
        }
        , 1e3)
    }
    ,
    vm.seekWatch = function() {
        vm.seekInterval = $interval(function() {
            vm.seekOn ? vm.broadcast.href = vm.broadcast.sharePath + vm.seekValue : (vm.seekSec = Math.floor(player.getPosition()),
            vm.seekString = seekSecsToString(vm.seekSec),
            vm.seekValue = vm.seekString,
            vm.broadcast.href = vm.broadcast.sharePath + vm.broadcast.shareTitle)
        }
        , 1e3)
    }
    ,
    vm.seekCheck = function() {
        vm.seekOn ? (vm.broadcast.seekString = vm.seekString,
        vm.broadcast.href = vm.broadcast.sharePath + vm.broadcast.seekString) : (vm.broadcast.seekString = null ,
        vm.broadcast.href = vm.broadcast.sharePath + vm.broadcast.shareTitle)
    }
    ,
    vm.seekFocus = function() {
        vm.seekOn = !0,
        vm.seekValueBefore = vm.seekValue
    }
    ,
    vm.seekChange = function() {
        vm.seekOn = !0,
        $timeout.cancel(vm.seekValueTimeout),
        vm.seekValueTimeout = $timeout(vm.seekBlur, 2e3)
    }
    ,
    vm.seekBlur = function() {
        if (vm.seekValueBefore != vm.seekValue) {
            var str = vm.seekValue = seekStringToString(vm.seekValue)
              , sec = seekStringToSecs(str);
            player.seek(sec)
        }
    }
    ,
    vm.shareFacebook = function() {
        var href = vm.broadcast.href.replace(/1043/g, 1042);
        FB.ui({
            method: "share",
            href: href
        })
    }
    ,
    vm.shareTwitter = function() {
        var href = vm.broadcast.href.replace(/1043/g, 1041)
          , go = "https://twitter.com/intent/tweet?text=I just watched an awesome %23YouNow broadcast. " + href;
        Api.openPopup("Tweet", go)
    }
    ,
    $scope.vm = vm;
    var trackClose = function() {
        return trackingPixel.archiveActive = !1,
        trackingPixel.capture({
            event: "ARCHIVE_VIEW",
            points: ptSeconds,
            broadcastid: vm.broadcast.id,
            extradata: vm.seekInitial > 0 || !params.source ? "DEEP" : params.source,
            sourceid: vm.seekInitial || 0
        })
    }
    ;
    $scope.$on("$destroy", function() {
        $interval.cancel(ptInterval),
        $interval.cancel(vm.seekInterval),
        trackClose("channel", {}),
        window.onbeforeunload = null 
    }
    ),
    window.onbeforeunload = function(e) {
        trackClose("channel", {})
    }
}
]),
angular.module("younow.mention", []).directive("contenteditable", ["$sce", "$timeout", function($sce, $timeout) {
    return {
        restrict: "A",
        require: "?ngModel",
        link: function(scope, element, attrs, ngModel) {
            function read() {
                var html = element.html();
                attrs.stripBr && "<br>" === html && (html = ""),
                ngModel.$setViewValue(html)
            }
            ngModel && (ngModel.$render = function() {
                ngModel.$viewValue !== element.html() && element.html($sce.getTrustedHtml(ngModel.$viewValue || ""))
            }
            ,
            element.on("blur keyup change", function() {
                $timeout(read)
            }
            ),
            read())
        }
    }
}
]),
angular.module("younow.modals.mobile-download", []).controller("mobileDownloadCtrl", ["config", function(config) {
    var vm = this;
    vm.baseCDN = config.settings.ServerCDNBaseUrl,
    vm.telInputId = "telInputModal"
}
]),
angular.module("younow.channel.mod-form", []).directive("modForm", ["session", "Api", "broadcasterService", function(session, Api, broadcasterService) {
    return {
        restrict: "A",
        templateUrl: "angularjsapp/src/app/components/mod-form/mod-form.tpl.html",
        controllerAs: "modForm",
        compile: function(scope, elem, attr, ctrl) {
            return {
                pre: function(scope, elem, attr, ctrl) {
                    var iFrameUrl, iFrame, params = {}, fullTime = new Date;
                    0 !== session.user.userId && (params.field1 = session.user.firstName,
                    params.field2 = session.user.lastName),
                    params.field5 = broadcasterService.broadcaster.username,
                    params.field7 = fullTime.getHours() > 12 ? fullTime.getHours() - 12 : fullTime.getHours(),
                    params["field7-1"] = fullTime.getMinutes(),
                    params["Field7-3"] = fullTime.getHours() < 12 ? "AM" : "PM",
                    iFrameUrl = Api.buildWufooUrl("https://younow.wufoo.com/embed/qwcfa4u188ulus/", params),
                    iFrame = angular.element('<iframe id="modformiframe" height="544" allowTransparency="true" frameborder="0" scrolling="auto"  src="' + iFrameUrl + '" <a href="https://younow.wufoo.com/forms/qwcfa4u188ulus/">Fill out my Wufoo form!</a></iframe>'),
                    angular.element(document.getElementById("modformcontainer")).append(iFrame)
                }
            }
        }
    }
}
]),
angular.module("younow.only-scroll", []).directive("onlyScroll", function() {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            var horizontalScroll = element[0].attributes["horizontal-scroll"];
            element.on("mousewheel", function(event) {
                event.preventDefault(),
                void 0 === horizontalScroll ? element.scrollTop(element.scrollTop() - event.originalEvent.wheelDelta) : element.scrollLeft(element.scrollLeft() - event.originalEvent.wheelDelta)
            }
            )
        }
    }
}
),
angular.module("younow.modals.partner-agreement", []).controller("PartnerAgreementModalCtrl", ["$scope", "$modalInstance", "session", "$location", "$state", function($scope, $modalInstance, session, $location, $state) {
    $scope.title = "Updated Partner Agreement",
    $scope.message = "Please be sure to review and accept before you proceed.",
    $scope.cancelState = !1,
    $scope.checkAgreement = function(hasAgreed) {
        hasAgreed === !1 && ($scope.title = "Sure you want to skip?",
        $scope.message = "Skipping will remove your Partner status until you accept the updated terms.",
        $scope.cancelState = !0),
        hasAgreed === !0 && ($modalInstance.close(),
        $state.go("/partners")),
        void 0 === hasAgreed && ($scope.cancelState = !1,
        $scope.title = "Updated Partner Agreement",
        $scope.message = "Please be sure to review and accept before you proceed.")
    }
    ,
    $scope.finalDismiss = function() {
        $modalInstance.close()
    }
}
]),
angular.module("younow.modals.partner", []).controller("PartnerModalCtrl", ["$scope", "$timeout", "$modalInstance", "session", "Api", "config", function($scope, $timeout, $modalInstance, session, Api, config) {
    $scope["continue"] = function() {
        window.open("/partners", "_blank"),
        $modalInstance.close()
    }
}
]),
angular.module("younow.post", []).directive("younowPost", function() {
    return {
        restrict: "A",
        replace: !0,
        templateUrl: "angularjsapp/src/app/components/post/post.tpl.html",
        controller: "YounowPostCtrl"
    }
}
).controller("YounowPostCtrl", ["$scope", "$http", "config", "Api", "session", "pusher", "broadcasterService", "$filter", function($scope, $http, config, Api, session, pusher, broadcasterService, $filter) {
    $scope.session = session;
    var init = function() {
        $scope.post.media && $scope.post.media.embedly && !$scope.post.media.embedly.provider_url.match(Api.regexStore.embedlyWhiteList) ? $scope.$destroy() : $scope.post = $scope.preparePost($scope.post)
    }
    ;
    $scope.preparePost = function(post) {
        return post && (post = Api.replaceMentions(post),
        post.post = Api.convertEmoji(Api.linkify(post.post)),
        post = setLikeStatus(post),
        post = prepareMedia(post),
        post.changeLikes = function(change) {
            post.likesCount = post.likesCount ? post.likesCount + change : change,
            post.like.type = 2,
            post = setLikeStatus(post)
        }
        ,
        post.post = Api.trustedHTML(post.post)),
        post
    }
    ;
    var prepareMedia = function(post) {
        return post.media && (post.media.broadcast && (post.downloadUrl = config.settings.ServerHomeBaseUrl + "php/api/broadcast/download/",
        post.downloadUrl += "channelId=" + broadcasterService.channel.userId,
        post.downloadUrl += "&broadcastId=" + post.media.broadcast.broadcastId.toString(),
        session && session.user && session.user.userId && (post.downloadUrl += "&userId=" + session.user.userId)),
        "4" == post.media.type ? post.embed = "video" : "5" == post.media.type ? (post.embed = "archive",
        post.media.broadcast.broadcastLength && (post.media.broadcast.broadcastLengthNice = $filter("date")(1e3 * post.media.broadcast.broadcastLength, "mm:ss"),
        post.media.broadcast.broadcastLength >= 3600 && (post.media.broadcast.broadcastLengthNice = Math.floor(post.media.broadcast.broadcastLength / 3600) + ":" + post.media.broadcast.broadcastLengthNice))) : "6" == post.media.type ? post.embed = "snapshot" : ("1" == post.media.type || "2" == post.media.type) && (post.embed = "uploadimage")),
        post
    }
      , setLikeStatus = function(post) {
        switch (post.like || (post.like = {
            type: 0
        },
        post.likesCount = 0),
        post.like.type) {
        case 1:
            post.likeText = Api.fullName(post.like.user) + " likes this",
            post.liked = !1;
            break;
        case 2:
            post.likeText = post.likesCount + " others like this",
            post.liked = !1;
            break;
        case 3:
            post.likeText = "You like this",
            post.liked = !0;
            break;
        case 4:
            2 === post.likesCount ? post.likeText = "1 other likes this" : post.likeText = post.likesCount - 1 + " others like this",
            post.liked = !0;
            break;
        default:
            post.likeText = "",
            post.liked = !1
        }
        return post
    }
      , setLikeType = function(post) {
        return post.likesCount ? post.liked ? post.like.type = 1 === post.likesCount ? 3 : 4 : post.like.type = 1 === post.likesCount ? 1 : 2 : post.like.type = 0,
        post
    }
    ;
    $scope.trustedSrc = function(src) {
        return Api.trustedSrc(src)
    }
    ,
    $scope.toggleLike = function(post) {
        if (!session.loggedIn)
            return session.showLoginModal("", "POST_LIKE"),
            !0;
        var apiMethod;
        post.liked ? (post.liked = !1,
        post.likesCount--,
        apiMethod = "post/unlike") : (post.liked = !0,
        post.likesCount++,
        apiMethod = "post/like"),
        Api.post(apiMethod, {
            userId: session.user.userId,
            channelId: broadcasterService.channel.userId,
            id: post.id,
            isComment: post.parentId ? 1 : 0,
            socket_id: pusher.SDK.connection.socket_id
        }),
        post = setLikeType(post),
        post = setLikeStatus(post)
    }
    ,
    $scope.togglePin = function(post) {
        var apiMethod;
        post.isPinned ? (post.isPinned = !1,
        apiMethod = "post/unpin") : (broadcasterService.channel && broadcasterService.channel.posts && broadcasterService.channel.posts[0] && (broadcasterService.channel.posts[0].isPinned = !1),
        post.isPinned = !0,
        apiMethod = "post/pin"),
        Api.post(apiMethod, {
            userId: session.user.userId,
            channelId: broadcasterService.channel.userId,
            id: post.id
        })
    }
    ,
    $scope["delete"] = function(post) {
        Api.post("post/delete", {
            userId: session.user.userId,
            channelId: broadcasterService.channel.userId,
            id: post.id,
            isComment: post.parentId ? 1 : 0
        })
    }
    ,
    $scope.moreComments = function(post) {
        var params = {
            postId: post.id,
            channelId: broadcasterService.channel.userId,
            numberOfRecords: 5,
            doEnrich: 1,
            startFrom: post.replies.length
        };
        session.loggedIn && (params.userId = session.user.userId),
        Api.get("post/getComments", params).success(function(data) {
            if (data) {
                for (var i = data.replies.length - 1; i >= 0; i--)
                    post.replies.unshift(data.replies[i]);
                post.hasMore = data.hasMore
            } else
                Api.trackError("Empty post/getComments")
        }
        )
    }
    ,
    init()
}
]),
angular.module("younow.reply", []).directive("younowReply", function() {
    return {
        restrict: "A",
        replace: !0,
        templateUrl: "angularjsapp/src/app/components/post/reply/reply.tpl.html",
        controller: "YounowReplyCtrl"
    }
}
).controller("YounowReplyCtrl", ["$scope", function($scope) {
    $scope.reply && ($scope.post = $scope.preparePost($scope.reply))
}
]),
angular.module("younow.modals.profile-summary", []).controller("ProfileSummaryCtrl", ["$rootScope", "$scope", "$modalInstance", "$timeout", "$location", "config", "Api", "session", "broadcasterService", "params", "$modal", "$state", function($rootScope, $scope, $modalInstance, $timeout, $location, config, Api, session, broadcasterService, params, $modal, $state) {
    function checkIfFollowing(network, options) {
        $scope.canFollow(network) && session.user[authed[network]] ? Api.get("channel/isFollow", {
            userId: session.user.userId,
            channelId: params.channelId,
            sn: follow_codes[network],
            followType: openedFrom
        }).then(function(data) {
            data && (data.data.follow && $rootScope.gaEvent("FOLLOW", network.toUpperCase() + "_FOLLOWING", openedFrom),
            $scope.modal.following.followed = data.data.follow,
            $scope.modal.state = "following")
        }
        ) : $scope.modal.state = "following"
    }
    function getUserActions() {
        $scope.flags = [];
        var postData = {
            userId: params.userId,
            onUserId: params.channelId,
            broadcastId: params.channelId,
            userOnly: params.userOnly || !1,
            broadcastRelated: params.broadcastRelated || !1
        };
        Api.get("getUserActions", postData).success(function(data) {
            $scope.actions = data.actions,
            (session.isAdmin() || 9 == session.user.role) && ($scope.actions.push({
                actionId: "1099511627776",
                actionName: "User Chat Log",
                actionPath: "chatLogs.php?userId=" + params.channelId
            }),
            9 != session.user.role && $scope.actions.push({
                actionId: "1099511627776",
                actionName: "Show User History",
                actionPath: "moderatorLog.php?userIds=" + params.channelId
            }),
            broadcasterService.broadcaster && broadcasterService.broadcaster.userId === params.channelId && $scope.actions.push({
                actionId: "1099511627776",
                actionName: "Broadcast Chat Log",
                actionPath: "chatLogs.php?broadcastId=" + params.broadcastId
            })),
            angular.forEach(config.settings.FlaggingOptions, function(flag) {
                var type = params.broadcastRelated ? "broadcaster" : "user";
                flag[type] && $scope.flags.push(flag)
            }
            )
        }
        )
    }
    $scope.modal = {
        reason: params.comment ? decodeURIComponent(params.comment) : void 0
    },
    $scope.base = config.settings.ServerCDNBaseUrl,
    $scope.thumb = config.settings.ServerCDNBaseUrl + "/php/api/channel/getImage/channelId=" + params.channelId,
    $scope.cover = config.settings.ServerCDNBaseUrl + "/php/api/channel/getCover/channelId=" + params.channelId,
    $scope.nothumb = config.settings.ServerCDNBaseUrl + "/images/nothumb.jpg",
    $scope.session = session,
    $scope.modal.state = params.state || "",
    $scope.globalVars = window.globalVars,
    $scope.config = config;
    var openedFrom;
    params.isFlagging && $timeout(function() {
        $scope.toggleDropdown()
    }
    , 0);
    var follow_icons = {
        twitter: "ynicon-social-tw",
        facebook: "ynicon-social-fb",
        youtube: "ynicon-icon-social-yt",
        instagram: "ynicon-social-insta",
        google: "ynicon-social-gp"
    }
      , follow_codes = {
        twitter: 2,
        facebook: 4,
        instagram: 8,
        youtube: 16,
        google: 32
    }
      , authed = {
        twitter: "twitterAuth",
        facebook: "facebookAuth",
        instagram: "instagramAuth",
        youtube: "youTubeAuth",
        google: "googleAuth"
    };
    $scope.sn_titles = {
        twitter: "Twitter",
        facebook: "Facebook",
        instagram: "Instagram",
        youtube: "YouTube",
        google: "Google+"
    },
    $scope.sn_verb = {
        twitter: "Follow",
        facebook: "Follow",
        instagram: "Follow",
        youtube: "Subscribe to",
        google: "Follow"
    },
    $scope.sn_verbed = {
        twitter: "Following",
        facebook: "Following",
        instagram: "Following",
        youtube: "Subscribed to",
        google: "Following"
    },
    $scope.canFollow = function(network) {
        return "twitter" == network || "youtube" == network ? !0 : !1
    }
    ,
    $scope.setupFollowing = function(network, options) {
        network || (network = params.network),
        !params.network && options && $rootScope.gaEvent("FOLLOW", network.toUpperCase() + "_OPEN", openedFrom),
        $scope.modal.following = {
            network: network,
            icon: follow_icons[network],
            back_to_summary: !1
        },
        session.loggedIn ? checkIfFollowing(network, options) : $modal.loginModal("", "FOLLOWING").result.then(function(response) {
            return $scope.user.userId == session.user.userId ? !1 : void checkIfFollowing(network, options)
        }
        )
    }
    ,
    $scope.startFollowing = function(network) {
        $scope.setupFollowing(network),
        session.user && session.user[authed[network]] ? follow(network) : ($rootScope.gaEvent("CONNECT", "ATTEMPT_" + network.toUpperCase(), "FOLLOW"),
        session.authenticate[network]().then(function(data) {
            session.login(data, !0).then(function(data) {
                0 === data.data.errorCode ? ($rootScope.gaEvent("CONNECT", "CONNECT_" + network.toUpperCase(), "FOLLOW"),
                follow(network)) : $rootScope.gaEvent("CONNECT", "ERROR_" + network.toUpperCase() + "_" + data.data.errorCode, "FOLLOW")
            }
            )
        }
        ))
    }
    ;
    var follow = function(network) {
        $rootScope.gaEvent("FOLLOW", network.toUpperCase() + "_FOLLOW_ATTEMPT", openedFrom);
        var post = {
            userId: session.user.userId,
            channelId: params.channelId,
            sn: follow_codes[network],
            followType: openedFrom
        };
        broadcasterService.broadcaster && broadcasterService.broadcaster.broadcastId && (post.broadcastId = broadcasterService.broadcaster.broadcastId),
        Api.post("channel/follow", post).success(function(data) {
            data.follow && ($scope.modal.following.followed = !0,
            $rootScope.gaEvent("FOLLOW", network.toUpperCase() + "_FOLLOW_SUCCESS", openedFrom))
        }
        )
    }
    ;
    "following" == params.state && $scope.setupFollowing(),
    $scope.openUrl = function(url, source) {
        "following" === $scope.modal.state && ("link" === source && $rootScope.gaEvent("FOLLOW", $scope.modal.following.network.toUpperCase() + "_PROFILE_LINK", openedFrom),
        "button" === source && $rootScope.gaEvent("FOLLOW", $scope.modal.following.network.toUpperCase() + "_PROFILE_BUTTON", openedFrom)),
        window.open(url, "_blank")
    }
    ,
    params.userId && getUserActions(),
    Api.get("channel/getInfo", {
        channelId: params.channelId
    }, "usecdn").success(function(data) {
        if (!data.userId)
            return Api.showTopNotification("This user is no longer available"),
            $modalInstance.close(),
            !1;
        if (data = Api.channelFormat(data),
        data.latestSubscriptions && Object.keys(data.latestSubscriptions).length > 3) {
            var latestSubscriptions = data.latestSubscriptions
              , latestSubscriptionsAdd = 0;
            data.latestSubscriptions = {};
            var i = 0;
            for (var k in latestSubscriptions)
                3 > i ? data.latestSubscriptions[k] = latestSubscriptions[k] : latestSubscriptionsAdd++,
                i++;
            data.latestSubscriptionsPlus = (data.latestSubscriptionsPlus || 0) + latestSubscriptionsAdd
        }
        $rootScope.gaPage({
            page: "Summary",
            path: "/" + data.profile + "/summary"
        }),
        data.description = Api.convertEmoji(Api.prepareDescription(data.description)),
        data.location = Api.cleanLocation(data, !0),
        data.fullName = 1 === data.useprofile ? data.profile : data.firstName + " " + data.lastName,
        data.friendlyName = data.useprofile ? data.profile : data.firstName,
        angular.forEach(data.permissions, function(permission) {
            "6" === permission.id && (data.channelmanager = !0),
            "8" === permission.id && (data.ambassador = !0)
        }
        ),
        data.facebookLink = "1" == data.facebookOption && data.websiteUrl.length ? data.websiteUrl : "http://www.facebook.com/" + data.facebookId,
        "http" != data.facebookLink.substr(0, 4) && (data.facebookLink = "http://" + data.facebookLink),
        $scope.user = data,
        broadcasterService.async && "main.explore" !== $state.current.name && (openedFrom = broadcasterService.channel.userId === data.userId ? "PROFILE_OWNER" : "PROFILE_OTHER"),
        !broadcasterService.async && broadcasterService.broadcaster && (openedFrom = broadcasterService.broadcaster.userId === data.userId ? "BROADCASTER" : params.source),
        "main.explore" === $state.current.name && (openedFrom = "EXPLORE"),
        "following" === params.state && $rootScope.gaEvent("FOLLOW", params.network.toUpperCase() + "_OPEN", openedFrom),
        data.twitterHandle && data.twitterHandle.length > 0 && $rootScope.gaEvent("FOLLOW", "TWITTER_DISPLAY", openedFrom),
        data.youTubeChannelId && data.youTubeChannelId.length > 0 && $rootScope.gaEvent("FOLLOW", "YOUTUBE_DISPLAY", openedFrom)
    }
    ),
    $scope.composeMessage = function() {
        params.userId ? $scope.modal.state = "messaging" : session.showLoginModal("", "POST")
    }
    ,
    $scope.sendMessage = function() {
        Api.post("sendMessage", {
            message: $scope.modal.message,
            toUserId: params.channelId,
            userId: params.userId
        }),
        $scope.modal.message = "",
        $scope.showNotification("success", "Message sent to " + $scope.user.friendlyName)
    }
    ,
    $scope.showNotification = function(type, message) {
        $scope.modal.notifying = !0,
        $scope.modal.notificationType = type,
        $scope.modal.notificationMessage = message
    }
    ,
    $scope.doAction = function(action) {
        if ($scope.modal.action = action,
        action.needsFlag)
            $scope.modal.state = "flagging";
        else if (action.needsReason)
            $scope.modal.state = "suspending",
            $scope.modal.actionOptions = config.settings[action.actionOptions];
        else if ("1099511627776" === action.actionId) {
            var path = action.actionPath || "users.php?userId=" + params.channelId
              , url = config.settings.ServerSecureLocalBaseUrl + "/administrator/" + path;
            window.open(url, "_blank")
        } else
            $scope.submitAction()
    }
    ,
    $scope.submitAction = function() {
        if ($scope.modal.reasonForm && !$scope.modal.reasonForm.$valid)
            return Api.triggerTooltip("reason-form-tooltip", 2e3),
            !1;
        if ("flagging" === $scope.modal.state && void 0 === $scope.modal.flag)
            return Api.triggerTooltip("flagging-tooltip", 2e3),
            !1;
        var data = {
            actionId: $scope.modal.action.actionId,
            userId: params.userId,
            onUserId: $scope.user.userId
        };
        if ($scope.modal.reasonOption && (data.banReasonId = $scope.modal.reasonOption),
        $scope.modal.action.needsFlag) {
            if (void 0 === $scope.modal.flag)
                return !1;
            data.flagId = $scope.modal.flag
        }
        if ($scope.modal.action.needsReason) {
            if (!$scope.modal.reason)
                return !1;
            data.reason = $scope.modal.reason
        }
        ($scope.modal.action.needsFlag || $scope.modal.action.needsReason) && (params.broadcastId && (data.broadcastId = params.broadcastId),
        params.comment && (data.comment = params.comment),
        data.broadcaster = params.broadcastRelated ? 1 : 0),
        Api.post("doAdminAction", data).success(function(response) {
            response.errorCode ? $scope.showNotification("error", response.errorMsg) : ($scope.showNotification("success", "Success"),
            ("Block" === $scope.modal.action.actionName || "Unblock" === $scope.modal.action.actionName) && getUserActions())
        }
        )
    }
    ,
    $scope.goToProfile = function(profileName, event) {
        return event && 2 === event.which ? (event.preventDefault(),
        !1) : ($modalInstance.close(),
        void $location.path(profileName + "/channel"))
    }
    ,
    $scope.showProfileSummary = function(id) {
        return id ? ($modalInstance.close(),
        void $timeout(function() {
            $modal.profileSummary(id)
        }
        , 500)) : !1
    }
    ,
    $scope.followUser = function() {
        $scope.modal.state = "follow-notify"
    }
    ,
    $scope.modal.resetProfileSummary = function() {
        $scope.modal.notifying = void 0,
        $scope.modal.state = "",
        $scope.modal.reasonOption = void 0,
        $scope.modal.reason = void 0
    }
    ,
    $scope.toggleDropdown = function($event) {
        $event && ($event.preventDefault(),
        $event.stopPropagation()),
        $scope.modal.notifying && ($scope.modal.notifying = void 0),
        $scope.modal.flagging = !$scope.modal.flagging
    }
}
]),
angular.module("younow.seach-bar", []).directive("ynSearchBar", ["$state", "$location", "Api", "broadcasterService", "session", "config", "trackingPixel", "$rootScope", function($state, $location, Api, broadcasterService, session, config, trackingPixel, $rootScope) {
    return {
        restrict: "E",
        templateUrl: "angularjsapp/src/app/components/search-bar/search-bar.tpl.html",
        scope: {
            type: "@"
        },
        link: function(scope, element, attrs) {
            scope.search = {},
            scope.search.cdn = config.settings.ServerCDNBaseUrl,
            scope.search.searching = !1,
            scope.search.query = function(query) {
                $rootScope.gaEvent("Conversion", "Search - View Results", trackingPixel.getUserLocation() || "ANCILLARY"),
                scope.search.searching = !0;
                var restrict = "#" === query.substr(0, 1) ? "tag" : !1;
                return restrict && (query = query.substr(1)),
                Api.algolia(query, restrict).then(function(response) {
                    scope.search.searching = !1;
                    var results = response.data.hits || [];
                    return angular.forEach(results, function(user, i) {
                        user.fullName = Api.fullName(user),
                        user.hashedDescription = Api.convertEmoji(user.description)
                    }
                    ),
                    Api.get("younow/tags", {
                        s: query
                    }, !0).then(function(response) {
                        return response.data.tags && response.data.tags.length > 0 ? restrict ? (results = response.data.tags.slice(0, 4).concat(results),
                        results.push({
                            more: !0,
                            profile: "#" + query,
                            tag: query
                        })) : (results = results.concat(response.data.tags.slice(0, 4)),
                        results.push({
                            more: !0,
                            profile: query,
                            query: query
                        })) : results.push({
                            more: !0,
                            profile: query,
                            query: query
                        }),
                        results
                    }
                    )
                }
                )
            }
            ,
            scope.search.selectResult = function($item, $model, $label) {
                $rootScope.gaEvent("Conversion", "Search - Click Result", trackingPixel.getUserLocation() || "ANCILLARY"),
                broadcasterService.channelSwitch = "SEARCH",
                $item.objectID ? $location.path($item.profile) : $item.tag && "main.explore" !== $state.current.name ? $state.go("main.explore", {
                    tag: $item.tag
                }) : $item.tag && "main.explore" === $state.current.name ? $state.go("main.explore", {
                    tag: $item.tag,
                    q: void 0
                }, {
                    reload: !0
                }) : $state.go("main.explore", {
                    q: $item.profile,
                    tag: void 0
                }),
                scope.search.searchBox = ""
            }
            ,
            scope.search.background = function(id, type, refresher) {
                type = type || "Image";
                var extra = "Image" == type ? ", url(" + config.settings.ServerCDNBaseUrl + "/images/nothumb.jpg)" : "";
                refresher = refresher || "";
                var base = session.user && session.user.userId == id ? config.settings.ServerLocalBaseUrl : config.settings.ServerCDNBaseUrl;
                return "background:url(" + base + "/php/api/channel/get" + type + "/channelId=" + id + refresher + ")" + extra + " no-repeat center center; background-size: cover;"
            }
            ,
            scope.goToExplore = function(isTracked) {
                isTracked && $rootScope.gaEvent("Conversion", "Search - Click Go", trackingPixel.getUserLocation() || "ANCILLARY"),
                $state.go("main.explore", {
                    q: scope.search.searchBox
                })
            }
        }
    }
}
]),
angular.module("younow.channel.settingupPanel", []).directive("settingupPanel", ["Api", "config", "swf", "session", "$rootScope", "broadcasterService", "eventbus", "$timeout", function(Api, config, swf, session, $rootScope, broadcasterService, eventbus, $timeout) {
    return {
        restrict: "A",
        templateUrl: "angularjsapp/src/app/components/settingup-panel/settingup-panel.tpl.html",
        link: function(scope, element, attrs) {
            function initBroadcast() {
                return Api.post("broadcast/init", {
                    userId: session.user.userId,
                    channelId: session.user.userId,
                    ver: config.settings.JS_VERSION,
                    mirror: Api.store("mirrorCamera") ? 1 : 0
                })
            }
            function shareBroadcast(network, broadcastId) {
                swf.getShareData(network, broadcastId, !1, !0).then(function(data) {
                    data.callback = function(post_id) {
                        post_id && (console.log(post_id),
                        scope.panel.networks.facebookShare = !0)
                    }
                    ,
                    Api.openSharePopup(data)
                }
                )
            }
            function uploadBroadcastThumb() {
                scope.panel.snapshot ? window.YouNow.App.sendSnapshot(scope.panel.snapshot, !0) : swf.invokeSwfMethod("getSnapshot", !0)
            }
            function switchToLive(response) {
                config.params.mcu ? pc.setRemoteDescription(new SessionDescription({
                    sdp: response.data.sdpAnswer,
                    type: "answer"
                }), setRemoteDescriptionSuccess, setRemoteDescriptionFail) : swf.invokeSwfMethod("startBroadcast", response.data),
                session.isBroadcasting = !0,
                uploadBroadcastThumb(),
                broadcasterService.switchBroadcaster(session.user.userId, void 0, void 0, response.data)
            }
            function getSelectedTag() {
                var tag, tagSelected = scope.panel.tagSelected ? scope.panel.tagSelected : !1;
                return tagSelected && 0 !== tagSelected.length ? (tag = scope.panel.tagSelected,
                Api.store("lastBroadcastedTag", tag)) : (Api.store("lastBroadcastedTag") || (tag = session.user.fullName.replace(" ", ""),
                Api.store("lastBroadcastedTag", tag)),
                Api.store("lastBroadcastedTag") && (tag = Api.store("lastBroadcastedTag"))),
                tag
            }
            function setupWebrtcStream() {
                pc.addStream(webrtcStream),
                pc.createOffer(offerCreated, createOfferError)
            }
            function onIceCandidate(event) {
                event.candidate ? console.log("Sending Ice Candidate:\n" + JSON.stringify({
                    id: "broadcaster",
                    candidate: event.candidate
                })) : (setStatus("End of candidates, sending sdp to server."),
                streamReady = !0,
                swf.isGuest ? Api.post("broadcast/guest", {
                    sdpOffer: pc.localDescription.sdp,
                    channelId: broadcasterService.broadcaster.userId,
                    userId: session.user.userId,
                    action: "add"
                }).then(function(response) {
                    console.log(response),
                    pc.setRemoteDescription(new SessionDescription({
                        sdp: response.data.sdpAnswer,
                        type: "answer"
                    }), setRemoteDescriptionSuccess, setRemoteDescriptionFail)
                }
                ) : scope.panel.startBroadcast())
            }
            function onRemoteStreamAdded(event) {
                setStatus("Received remote stream");
                var remoteVideo = document.getElementById("remoteVideo");
                remoteVideo.src = window.URL.createObjectURL(event.stream),
                remoteVideo.play()
            }
            function onRemoteStreamRemoved(event) {
                setStatus("Remove remote stream");
                var remoteVideo = document.getElementById("remoteVideo");
                remoteVideo.src = ""
            }
            function offerCreated(description) {
                console.log("Offer Created"),
                console.log(description),
                pc.setLocalDescription(description, localDescriptionSet, localDescriptionNotSet)
            }
            function localDescriptionSet() {
                console.log("localDescriptionSet"),
                console.log(pc.localDescription.sdp)
            }
            function localDescriptionNotSet() {
                setStatus("Local description not set!")
            }
            function onIceConnectionStateChange() {
                console.log("Ice Connection State Change: " + pc.iceConnectionState)
            }
            function createOfferError(error) {
                console.log("Create offer error " + error)
            }
            function setRemoteDescriptionSuccess() {
                console.log("setRemoteDescriptionSuccess")
            }
            function setRemoteDescriptionFail() {
                console.log("setRemoteDescriptionFail")
            }
            function setStatus(msg) {
                console.log(msg)
            }
            scope.panel = {
                typeaheadClosed: !0,
                popularTags: void 0,
                networks: {
                    twitter: session.user.twitterAuthPublish ? !0 : !1,
                    facebook: session.user.facebookAuthPublish ? !0 : !1,
                    facebookShare: !1
                },
                startingBroadcast: !1
            };
            var typeaheadInput = document.getElementById("typeaheadInput")
              , shareInput = document.getElementById("share-input");
            document.getElementById("start-broadcast-btn");
            if (scope.panel.getTags = function() {
                Api.get("younow/popularTags", {
                    locale: config.preferredLocale
                }).then(function(response) {
                    if (response.data && 0 === response.data.errorCode) {
                        for (var tag in response.data.popular_tags)
                            response.data.popular_tags[tag].tag = "#" + response.data.popular_tags[tag].tag;
                        response.data.popular_tags.unshift({
                            tag: !1
                        }),
                        scope.panel.matches = response.data.popular_tags,
                        scope.panel.popularTags = response.data.popular_tags
                    }
                }
                )
            }
            ,
            scope.panel.loadTags = function(value) {
                return scope.panel.typeaheadClosed = !1,
                -1 !== value.indexOf("#") && (value = value.replace("#", "")),
                Api.get("younow/tags", {
                    locale: config.preferredLocale,
                    s: value
                }).then(function(response) {
                    if (response && response.data && response.data.tags) {
                        for (var tag in response.data.tags)
                            session.user.editorsPick && response.data.tags[tag].tag === session.user.editorsPick.tag && (response.data.tags[tag].isEp = !0),
                            response.data.tags[tag].tag === value ? response.data.tags.splice(tag, 1) : -1 === response.data.tags[tag].tag.indexOf("#") && (response.data.tags[tag].tag = "#" + response.data.tags[tag].tag);
                        response.data.tags = [{
                            tag: "#" + value
                        }].concat(response.data.tags),
                        scope.panel.matches = response.data.tags.concat(angular.copy(scope.panel.popularTags))
                    } else
                        scope.panel.matches = [{
                            tag: "#" + value
                        }].concat(angular.copy(scope.panel.popularTags));
                    return scope.panel.matches
                }
                )
            }
            ,
            scope.panel.validateTag = function(tag) {
                tag || (tag = ""),
                0 === tag.length && (scope.panel.tagSelected = "",
                scope.panel.typeaheadClosed = !0),
                "false" === scope.panel.tagSelected && (scope.panel.tagSelected = ""),
                (tag.match(/#/g) && tag.match(/#/g).length > 1 || -1 !== scope.panel.tagSelected.indexOf("#")) && (tag = tag.replace(/#/g, "")),
                tag.slice(1, tag.length).match(/^((?!\-$|_$)[a-zA-Z1-9\-_()])+$/g) && tag.length > 1 ? scope.panel.tagValid = !0 : scope.panel.tagValid = !1,
                scope.panel.tagSelected = tag
            }
            ,
            scope.panel.selectTag = function(tag, model, label) {
                tag && !tag.tag && (tag.tag = ""),
                scope.panel.typeaheadClosed = !0,
                scope.panel.tagSelected = tag.tag.replace("#", ""),
                shareInput.focus()
            }
            ,
            scope.panel.takeSnapshot = function() {
                swf.invokeSwfMethod("getSnapshot", !1)
            }
            ,
            scope.panel.toggleShare = function(network) {
                "twitter" == network && !session.user.twitterHandle || "facebook" == network && !session.user.facebookId ? ($rootScope.gaEvent("CONNECT", "ATTEMPT_" + network.toUpperCase(), "GOLIVE"),
                session.authenticate[network]().then(function(data) {
                    session.login(data, !0).then(function(data) {
                        if (data.data.errorCode > 0 || data.config.data.indexOf("lastName=&") > -1)
                            $rootScope.gaEvent("CONNECT", "ERROR_" + network.toUpperCase(), "GOLIVE");
                        else {
                            if ("facebook" == network && 0 === session.user.facebookPageId.length)
                                return shareBroadcast(network, scope.panel.initResponse.id),
                                !1;
                            scope.panel.networks[network] = scope.panel.networks[network] ? !1 : !0,
                            $rootScope.gaEvent("CONNECT", "CONNECT_" + network.toUpperCase(), "GOLIVE")
                        }
                    }
                    )
                }
                )) : "facebook" == network && session.user.facebookId && 0 === session.user.facebookPageId.length ? shareBroadcast(network, scope.panel.initResponse.id) : scope.panel.networks[network] = !scope.panel.networks[network]
            }
            ,
            scope.panel.startBroadcast = function() {
                if (scope.panel.startingBroadcast = !0,
                config.params.mcu && !streamReady)
                    return setupWebrtcStream(),
                    !1;
                var tag = getSelectedTag();
                broadcasterService.addBroadcast(scope.panel.initResponse.id, tag, scope.panel.networks.facebook, scope.panel.networks.twitter, scope.panel.shareCopy, pc).then(function(response) {
                    0 === response.data.errorCode && switchToLive(response),
                    response.data.errorCode > 0 && (249 === response.data.errorCode ? initBroadcast().then(function(response) {
                        broadcasterService.addBroadcast(response.data.id, tag, scope.panel.networks.facebook, scope.panel.networks.twitter, scope.panel.shareCopy, pc).then(function(response) {
                            0 === response.data.errorCode && switchToLive(response)
                        }
                        )
                    }
                    ) : scope.panel.startingBroadcast = !1)
                }
                )
            }
            ,
            window.YouNow.App.cameraReady = function() {
                scope.panel.initResponse || (swf.invokeSwfMethod("mirror", Api.store("mirrorCamera")),
                initBroadcast().then(function(response) {
                    response && 0 === response.data.errorCode && (scope.panel.initResponse = response.data),
                    response && 603 === response.data.errorCode && switchToLive(response)
                }
                ))
            }
            ,
            angular.element(typeaheadInput).on("keyup", function(event) {
                9 == event.which && shareInput.focus()
            }
            ),
            scope.panel.getTags(),
            typeaheadInput.focus(),
            $timeout(function() {
                swf.invokeSwfMethod("goLive", {
                    skipChannelSelection: !1
                })
            }
            ),
            eventbus.subscribe("pusher:ban", function(event, message) {
                message.message && (swf.settingUpBroadcast = !1)
            }
            , "settingupPanel", scope),
            eventbus.subscribe("swf:snapshot", function(event, image) {
                image && (scope.panel.snapshot = image)
            }
            , "settingupPanel", scope),
            config.params.mcu) {
                var webrtcStream, PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection, SessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription, PeerConnectionConfig = (window.mozRTCIceCandidate || window.webkitRTCIceCandidate || window.RTCIceCandidate,
                {
                    iceServers: [{
                        url: "stun:stun.l.google.com:19302"
                    }]
                }), streamReady = (window.location,
                !1), videoWidth = 640, videoHeight = 480, pc = new PeerConnection(PeerConnectionConfig);
                pc.onicecandidate = onIceCandidate,
                pc.oniceconnectionstatechange = onIceConnectionStateChange,
                pc.onaddstream = onRemoteStreamAdded,
                pc.onremovestream = onRemoteStreamRemoved,
                $rootScope.$evalAsync(function() {
                    console.log("about to try and run video");
                    var localVideo = document.getElementById("localVideo");
                    return null  == localVideo && setStatus("Local video element not found! (Maybe caused by flash-block plugin?)"),
                    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia,
                    navigator.getUserMedia ? void navigator.getUserMedia({
                        audio: !0,
                        video: {
                            mandatory: {
                                maxWidth: videoWidth,
                                maxHeight: videoHeight,
                                maxFrameRate: "15"
                            },
                            optional: []
                        }
                    }, function(stream) {
                        webrtcStream = stream;
                        var url = window.URL || window.webkitURL;
                        localVideo.src = url ? url.createObjectURL(stream) : stream,
                        localVideo.play(),
                        localVideo.muted = "true",
                        window.YouNow.App.cameraReady()
                    }
                    , function(error) {
                        setStatus("Something went wrong with getting user data. error: " + error)
                    }
                    ) : void setStatus("Sorry, the browser you are using doesn't support getUserMedia")
                }
                )
            }
        }
    }
}
]),
angular.module("younow.modals.share-broadcast-modal", []).controller("shareBroadcastModalCtrl", ["$scope", "$modalInstance", "session", "data", function($scope, $modalInstance, session, data) {
    $scope.modal = {},
    $scope.modal.session = session,
    $scope.modal.recommendMessage = data.message,
    $scope.modal.invite = function() {
        $scope.modal.form.$valid && $modalInstance.close($scope.modal.recommendMessage)
    }
    ,
    $scope.modal.closeModal = function() {
        $modalInstance.close()
    }
}
]),
angular.module("younow.subscribe-button", []).directive("subscribeButton", ["session", "Api", "broadcasterService", "config", "$modal", "$timeout", "eventbus", "$timeout", function(session, Api, broadcasterService, config, $modal, $timeout, eventbus, $timeout) {
    return {
        restrict: "A",
        templateUrl: "angularjsapp/src/app/components/subscribe-button/subscribe-button.tpl.html",
        scope: {
            channel: "=",
            source: "@",
            size: "@"
        },
        link: function(scope, element, attributes) {
            scope.base = config.settings.ServerCDNBaseUrl,
            scope.subStatus = session.subStatus,
            scope.fanStatus = session.fanStatus,
            scope.hidden = !0,
            eventbus.subscribe("session:loggedIn", function() {
                scope.checkSub()
            }
            , "subscribe-button", scope),
            scope.checkSub = function() {
                scope.channel && scope.channel.userId && session.user && (!session.user || session.user.banId || session.user.suspendId ? scope.hidden = !0 : scope.channel.isSubscribable && "0" != scope.channel.isSubscribable ? (session.getSub(scope.channel.userId),
                scope.hidden = !1) : scope.hidden = !0)
            }
            ,
            scope.$watch("channel", function(channel) {
                scope.channel = channel,
                session.user && scope.channel && scope.checkSub()
            }
            , !0),
            scope.subscribe = function() {
                return session.loggedIn ? session.checkBan() ? !1 : void (session.subStatus[scope.channel.userId] ? config && config.settings && config.settings.TrackingHost && config.settings.TrackingHost.indexOf("-vd.") > 0 && Api.get("channel/unSubscribe/userId=" + session.user.userId + "/channelId=" + broadcasterService.broadcaster.userId).then(function() {
                    window.location.reload()
                }
                ) : $modal.subscribeModal(scope.channel.userId, {
                    source: scope.source
                })) : (session.showLoginModal("", "SUBSCRIBE"),
                !1)
            }
        }
    }
}
]),
angular.module("younow.modals.subscribe-modal", []).controller("SubscribeModalCtrl", ["$rootScope", "$scope", "$modalInstance", "$timeout", "$location", "config", "Api", "session", "broadcasterService", "params", "eventbus", "trackingPixel", function($rootScope, $scope, $modalInstance, $timeout, $location, config, Api, session, broadcasterService, params, eventbus, trackingPixel) {
    var vm = {};
    vm.template = {},
    vm.template.cdn = config.settings.ServerCDNBaseUrl,
    vm.session = session;
    var ga = {};
    ga.userLocation = params.source || trackingPixel.getUserLocation(),
    broadcasterService.broadcaster.chatMode ? (ga.category = "SUBSCRIBE_CHATMODE",
    ga.action_x = "") : "MINI_PROFILE" == params.source ? (ga.category = "SUBSCRIBE_MINIPROFILE",
    broadcasterService.broadcaster.broadcastId ? ga.action_x = "_LIVE" : ga.action_x = "_OFFLINE") : "PROFILE" == ga.userLocation ? (ga.category = "SUBSCRIBE_PROFILE",
    broadcasterService.broadcaster.broadcastId ? ga.action_x = "_LIVE" : ga.action_x = "_OFFLINE") : broadcasterService.broadcaster.broadcastId ? (ga.category = "SUBSCRIBE_BROADCAST",
    ga.action_x = "") : (ga.category = "SUBSCRIBE_" + ga.userLocation.toUpperCase(),
    ga.action_x = ""),
    $rootScope.gaEvent(ga.category, "PROMPT" + ga.action_x, "LEVEL1"),
    vm.channel = broadcasterService.channel || broadcasterService.broadcaster;
    var vm_channel = function(vmchannel) {
        vm.channel = vmchannel,
        vm.template.channelThumb = config.settings.ServerCDNBaseUrl + "/php/api/channel/getImage/channelId=" + vmchannel.userId
    }
    ;
    vm_channel(broadcasterService.channel || broadcasterService.broadcaster),
    params.channelId != vm.channel.userId && Api.get("channel/getInfo", {
        channelId: params.channelId
    }, !0).then(function(response) {
        vm_channel(response.data)
    }
    ),
    vm.template.userThumb = config.settings.ServerCDNBaseUrl + "/php/api/channel/getImage/channelId=" + session.user.userId,
    vm.template.noThumb = config.settings.ServerCDNBaseUrl + "/images/nothumb.jpg",
    vm.spanel = "initial",
    vm.globalVars = window.globalVars,
    vm.config = config,
    vm.submitting = !1,
    vm.braintreeLoading = !0;
    var autofan = function() {
        if (!session.fanStatus[post.channelId]) {
            $rootScope.gaEvent("Conversion", "Fan (Attempt)", "AUTOFAN-SUBCRIBING");
            var apiPost = {
                userId: session.user.userId,
                channelId: vm.channel.userId
            };
            broadcasterService.broadcaster && broadcasterService.broadcaster.broadcastId && (apiPost.broadcastId = broadcasterService.broadcaster.broadcastId),
            Api.post("channel/fan", apiPost).then(function(response) {
                response.data && !response.data.errorCode && (session.fanStatus[vm.channel.userId] = !0,
                vm.channel.totalFans = 1 * vm.channel.totalFans + 1)
            }
            )
        }
    }
      , post = {
        userId: session.user.userId
    };
    "http:" === window.location.protocol && (post.s = session.user.session),
    vm.submitting = !0,
    Api.post("store/purchaseToken", post, !0).then(function(response) {
        if (vm.submitting = !1,
        0 === response.data.errorCode && document.getElementById("braintree-dropin") && (window.braintree.setup(response.data.token, "dropin", {
            container: "braintree-dropin",
            onReady: function() {
                vm.braintreeLoading = !1
            },
            paymentMethodNonceReceived: function(event, nonce) {
                vm.braintreeLoading = !1;
                var post = {
                    data: $scope.vm.sub.price,
                    signature: nonce,
                    sku: $scope.vm.sub.SKU,
                    userId: session.user.userId,
                    device_data: document.getElementById("device_data").value,
                    channelId: vm.channel.userId,
                    extradata: trackingPixel.getUserLocation()
                };
                "http:" === window.location.protocol && (post.s = session.user.session),
                autofan(),
                vm.submitting = !0,
                Api.post("store/buy", post, !0).then(function(response) {
                    vm.submitting = !1,
                    response.data.errorCode ? (console.info("store/buy failed:", response.data),
                    Api.showTopNotification(JSON.stringify(response.data))) : (Api.showTopNotification("You have subscribed to " + vm.channel.profile + "!", "success"),
                    broadcasterService.channel ? (vm.spanel = "thankyou",
                    $rootScope.gaEvent(ga.category, "SUBSCRIBE" + ga.action_x, "LEVEL1")) : ($modalInstance.close(),
                    $rootScope.gaEvent(ga.category, "SUBSCRIBE" + ga.action_x, "LEVEL1")),
                    session.subStatus[post.channelId] = "sub")
                }
                )
            }
        }),
        window.BraintreeData)) {
            var env = window.BraintreeData.environments[config.settings.BTEnv].withId(config.settings.BTKountId);
            window.BraintreeData.setup(config.settings.BTMerchantId, "braintree-form", env)
        }
    }
    ),
    vm.submitInitial = function() {
        vm.sub = {};
        var post = {
            store: "web",
            channelId: vm.channel.userId
        };
        vm.submitting = !0,
        Api.get("store/subscriptionProducts", post, !0).then(function(response) {
            vm.submitting = !1,
            vm.sub = {},
            vm.sub.id = response.data.products[0].id,
            vm.sub.SKU = response.data.products[0].SKU,
            vm.sub.name = response.data.products[0].name,
            vm.sub.price = response.data.products[0].price,
            session.user.email && session.user.isEmailConfirmed ? (vm.spanel = "payment",
            $rootScope.gaEvent(ga.category, "PAYVIEW" + ga.action_x, "LEVEL1")) : response.errorCode || (vm.spanel = "email")
        }
        )
    }
    ,
    vm.submitEmail = function(form) {
        if (vm.submitting = !0,
        form.$invalid)
            return eventbus.notifySubscribers("subscribeForm:invalid"),
            !1;
        var post = {
            userId: session.user.userId,
            channelId: session.user.userId,
            emailAddress: vm.session.user.email
        };
        Api.post("channel/updateSettings", post).then(function(response) {
            response.errorCode || (vm.spanel = "payment",
            $rootScope.gaEvent(ga.category, "PAYVIEW" + ga.action_x, "LEVEL1")),
            vm.submitting = !1
        }
        )
    }
    ,
    $scope.vm = vm
}
]).directive("subscribeValidate", ["Api", "$compile", "eventbus", function(Api, $compile, eventbus) {
    return {
        restrict: "A",
        scope: {
            message: "@",
            isValid: "="
        },
        link: function(scope, elem, attrs) {
            function errorFeedback() {
                -1 !== elem[0].className.indexOf("ng-invalid") && Api.triggerTooltip(elem, 2500)
            }
            var tag = elem[0].tagName;
            ("TEXTAREA" == tag || "INPUT" == tag) && elem.on("blur", errorFeedback),
            eventbus.subscribe("subscribeForm:invalid", errorFeedback, attrs.name, scope)
        }
    }
}
]),
angular.module("younow.modals.trap", []).controller("TrapModalCtrl", ["$scope", "$modal", "$modalInstance", "config", "session", "data", "source", function($scope, $modal, $modalInstance, config, session, data, source) {
    $scope.user = data.user,
    console.log("$scope.user", $scope.user),
    $scope.source = source,
    config.init.then(function() {
        $scope.background = function(id, type, refresher) {
            return type = type || "Image",
            "background:url(" + config.settings.ServerCDNBaseUrl + "/php/api/channel/get" + type + "/channelId=" + id + ") no-repeat center center; background-size: cover;"
        }
    }
    ),
    "fan" === data.type && ($scope.fanTrap = !0,
    $scope.heading = "To participate, become a fan of " + ($scope.user.profile || $scope.user.profileUrlString),
    $scope.subheading = "You will get updates when people comment or like your posts"),
    "archives" === data.type && ($scope.loginTrap = !0,
    $scope.heading = "To watch my archived broadcasts, you have to login to YouNow!"),
    $scope.showLoginModal = function() {
        $modalInstance.close()
    }
    ,
    $scope.fanTrap && $scope.$watch(function() {
        return session.fanStatus[data.user.userId]
    }
    , function(status) {
        "fan" === status && $scope.$evalAsync(function() {
            $modalInstance.close()
        }
        )
    }
    , !0)
}
]),
angular.module("younow.channel.player-footer", []).controller("PlayerFooterCtrl", ["$scope", "$element", "swf", "session", "Api", "$timeout", "config", "$window", "shareService", "eventbus", "broadcasterService", "$rootScope", "trackingPixel", function($scope, $element, swf, session, Api, $timeout, config, $window, shareService, eventbus, broadcasterService, $rootScope, trackingPixel) {
    var vm = this;
    vm.swf = swf,
    vm.session = session,
    vm.shareService = shareService,
    vm.mcu = config.params.mcu,
    vm.broadcastSettings = {
        setCamera: function(index) {
            swf.invokeSwfMethod("setCamera", index)
        },
        setMicrophone: function(index) {
            swf.invokeSwfMethod("setMicrophone", index)
        },
        cameraSetup: function() {
            var cameraSettings = swf.invokeSwfMethod("cameraSetup")
              , i = 0;
            for (vm.cameraOptions = [],
            i; i < cameraSettings.cameras.length; i++)
                vm.cameraOptions.push({
                    name: cameraSettings.cameras[i],
                    current: cameraSettings.currentCamera === cameraSettings.cameras[i] ? !0 : !1
                })
        },
        microphoneSetup: function() {
            var microphoneSettings = swf.invokeSwfMethod("microphoneSetup")
              , i = 0;
            for (vm.microphoneOptions = [],
            i; i < microphoneSettings.microphones.length; i++)
                vm.microphoneOptions.push({
                    name: microphoneSettings.microphones[i],
                    current: microphoneSettings.currentMicrophone === microphoneSettings.microphones[i] ? !0 : !1
                })
        }
    },
    vm.likeStyle = function() {
        if (!vm.swf.broadcast)
            return {};
        var color, rotation, background = "#f6faf1", fill = "#d1e6ba";
        return vm.swf.broadcast.likePercent <= 50 ? (color = background,
        rotation = 3.6 * vm.swf.broadcast.likePercent - 90) : (color = fill,
        rotation = 3.6 * vm.swf.broadcast.likePercent - 270),
        {
            background: "linear-gradient(" + rotation + "deg, " + color + " 50%, transparent 50%) 0 0, linear-gradient(90deg, " + background + " 50%, " + fill + " 50%) 0 0"
        }
    }
    ,
    vm.doLike = function(e) {
        return vm.cooldown ? !1 : session.loggedIn ? swf.settingUpBroadcast ? (session.preventBroadcastInterrupt(),
        !1) : session.checkBan() ? !1 : (vm.cooldown = !0,
        $timeout(function() {
            vm.cooldown = !1
        }
        , 6e3),
        swf.broadcast.likes = Api.squashedNumber(Number(swf.broadcast.likes.replace(/\,/g, "")) + 1),
        session.user.userCoins = session.user.userCoins - swf.broadcast.nextLikeCost,
        Api.post("broadcast/like", {
            channelId: swf.broadcast.userId,
            userId: session.user.userId
        }).success(function(data) {
            swf.broadcast.nextLikeCost = data.nextLikeCost
        }
        ),
        void 0) : (session.showLoginModal("", "LIKE"),
        !1)
    }
    ,
    vm.clipboardMessage = "Copy Link",
    vm.clipboardCopied = function() {
        vm.clipboardMessage = "Copied!!",
        $timeout(function() {
            vm.clipboardMessage = "Copy Link"
        }
        , 3e3)
    }
    ,
    vm.shareLink = function() {
        if (!swf.broadcast)
            return !1;
        var url = "http://" + config.host + "/" + swf.broadcast.profile + "/" + swf.broadcast.broadcastId + "/" + swf.broadcast.userId + "/1033/b";
        return url
    }
    ,
    vm.likeTooltip = function() {
        return swf.broadcast ? "<img class='coin' style='width:20px' src='" + config.settings.ServerCDNBaseUrl + "/images/younow_header/icon_coin_sm.png'> " + swf.broadcast.nextLikeCost : ""
    }
    ,
    vm.setVolume = function(e) {
        session.isBroadcasting || swf.settingUpBroadcast ? swf.setGain(swf.shadowGain) : swf.setVolume(swf.shadowVolume, !0)
    }
    ,
    vm.getVolume = function() {
        return session.isBroadcasting || swf.shadowVolume || swf.settingUpBroadcast || (swf.shadowVolume = swf.volume),
        session.isBroadcasting && !swf.shadowGain && swf.settingUpBroadcast && (swf.shadowGain = swf.gain),
        session.isBroadcasting || swf.settingUpBroadcast ? swf.shadowGain / 2 : swf.shadowVolume / 2
    }
    ,
    vm.muteIcon = function() {
        return session.isBroadcasting || swf.settingUpBroadcast ? 0 === swf.gain ? "ynicon-icon-mic-off" : "ynicon-icon-mic" : 0 === swf.volume ? "ynicon-mute-sel" : "ynicon-mute"
    }
    ,
    vm.setMute = function() {
        session.isBroadcasting ? (swf && 0 !== swf.gain && (swf.oldGain = swf.gain || 50),
        swf.setGain(0 === swf.gain ? swf.oldGain || 50 : 0),
        swf.shadowGain = swf.gain) : (swf && 0 !== swf.volume && (swf.oldVolume = swf.volume || 100),
        swf.setVolume(0 === swf.volume ? swf.oldVolume || 100 : 0, !0),
        swf.shadowVolume = swf.volume)
    }
    ,
    vm.slideVolume = function(e) {
        var isHeldDown = e.which;
        if (isHeldDown = void 0 !== e.buttons ? e.buttons : e.which,
        1 === isHeldDown && (e.offsetX > 0 || e.layerX > 0)) {
            var newVolume = 2 * Number(e.offsetX || e.layerX);
            if (0 > newVolume || 2 === newVolume)
                return !1;
            newVolume > 90 && (newVolume = 100),
            10 > newVolume && (newVolume = 0),
            session.isBroadcasting || swf.settingUpBroadcast ? swf.shadowGain = newVolume : swf.shadowVolume = newVolume,
            (swf.shadowGain % 5 === 0 || swf.shadowVolume % 5 === 0) && vm.setVolume()
        }
    }
    ,
    vm.openSnapshot = function() {
        return $rootScope.gaEvent("Conversion", "Share (Attempt)", trackingPixel.getUserLocation() || "ANCILLARY"),
        session.loggedIn ? session.isBroadcasting || swf.settingUpBroadcast ? (session.preventBroadcastInterrupt(),
        !1) : session.checkBan() ? !1 : (shareService.trackFunnel("open"),
        swf.fullscreenActive && eventbus.notifySubscribers("share:snapshot"),
        swf.getSnapshot(),
        vm.swf.broadcast.share_message = "",
        void (swf.share_facebook_permitted || FB.api("/me/permissions", function(response) {
            if (response && !response.error)
                for (var each in response)
                    for (var permission in response[each])
                        "publish_actions" == response[each][permission].permission && "granted" == response[each][permission].status && (swf.share_facebook_permitted = !0)
        }
        ))) : (session.showLoginModal("", "SHARE").result.then(function(response) {
            vm.openSnapshot()
        }
        ),
        !1)
    }
    ,
    vm.addGuest = function() {
        swf.isGuest = !0,
        swf.settingUpBroadcast = !0
    }
}
]).directive("playerFooter", ["eventbus", "$interval", "swf", "$filter", "Api", function(eventbus, $interval, swf, $filter, Api) {
    return {
        restrict: "A",
        templateUrl: "angularjsapp/src/app/components/video-player/player-footer.tpl.html",
        controller: "PlayerFooterCtrl",
        controllerAs: "vm",
        link: function(scope, element, attr) {
            function niceLength() {
                0 === swf.broadcast.length && (swf.broadcast.length = 1),
                swf.broadcast && void 0 !== swf.broadcast.length && null  !== swf.broadcast.length && (scope.playerFooter.niceLength = $filter("date")(1e3 * swf.broadcast.length, "mm:ss"),
                swf.broadcast.length >= 3600 && (scope.playerFooter.niceLength = Math.floor(swf.broadcast.length / 3600) + ":" + scope.playerFooter.niceLength))
            }
            scope.playerFooter = {};
            var broadcastTimer = $interval(function() {
                swf.broadcast && swf.broadcast.length && !swf.eob && (swf.broadcast.length++,
                niceLength(),
                navigator.onLine === !1 && (swf.userOffline = !0),
                navigator.onLine && swf.userOffline && swf.broadcast && swf.broadcast.userId && (Api.get("broadcast/info", {
                    channelId: swf.broadcast.userId,
                    curId: swf.broadcast.userId
                }).then(function(response) {
                    response.data.errorCode ? window.YouNow.App.loadChannel() : swf.newBroadcaster(swf.broadcast)
                }
                ),
                swf.userOffline = !1))
            }
            , 1e3);
            eventbus.subscribe("swf:reset", niceLength, "playerfooter", scope),
            scope.$on("$destroy", function() {
                $interval.cancel(broadcastTimer)
            }
            )
        }
    }
}
]),
angular.module("younow.channel.player-header", []).controller("PlayerHeaderCtrl", ["$scope", "$element", "$modal", "$window", "swf", "Api", "broadcasterService", "session", "config", "$timeout", "eventbus", function($scope, $element, $modal, $window, swf, Api, broadcasterService, session, config, $timeout, eventbus) {
    var vm = this;
    vm.Api = Api,
    vm.swf = swf,
    vm.session = session,
    vm.broadcast = broadcasterService,
    vm.Math = $window.Math,
    vm.thumb = config.settings.ServerCDNBaseUrl + "/php/api/channel/getImage/channelId=",
    vm.noThumb = config.settings.ServerCDNBaseUrl + "/images/nothumb.jpg",
    vm.globalVars = window.globalVars,
    vm.config = config,
    vm.openBroadcasterProfile = function(id) {
        $modal.profileSummary(id)
    }
    ;
    var rank_, rank = 0, showRank = function(eventName, args) {
        rank = args.rank,
        rank_ != rank && (vm.newRank = rank,
        $timeout(function() {
            vm.newRank = 0
        }
        , 1e4)),
        rank_ = rank
    }
    ;
    eventbus.subscribe("BROADCASTER_RANK", showRank, "player-header", $scope),
    vm.chatModeToggle = function() {
        var setChatMode = vm.broadcast.chatMode ? 0 : 1
          , post = {
            userId: vm.session.user.userId,
            channelId: vm.broadcast.broadcaster.userId,
            chatMode: setChatMode
        };
        Api.post("broadcast/setChatMode", post).success(function(data) {
            data.errorCode || (vm.broadcast.chatMode = setChatMode)
        }
        )
    }
    ,
    $scope.vm = vm
}
]).directive("playerHeader", function() {
    return {
        restrict: "A",
        templateUrl: "angularjsapp/src/app/components/video-player/player-header.tpl.html",
        controller: "PlayerHeaderCtrl",
        controllerAs: "vm",
        scope: {}
    }
}
),
angular.module("younow.channel.player-overlay", []).controller("PlayerOverlayCtrl", ["$scope", "$element", "swf", "$interval", "$window", "config", "$timeout", "$sce", "Api", "broadcasterService", "session", "eventbus", function($scope, $element, swf, $interval, $window, config, $timeout, $sce, Api, broadcasterService, session, eventbus) {
    function queueSystemMessage(time) {
        $timeout(function() {
            vm.systemMessage.dismissed = !1,
            vm.systemMessage.hasMessage = !1,
            swf.systemMessagesQueue.splice(0, 1)
        }
        , 1e3 * time)
    }
    function clearOverlay(event, data) {
        vm.systemMessage.hasMessage = !1,
        vm.gift = !1,
        vm.dropBroadcastActive = !1
    }
    var vm = this;
    vm.Math = $window.Math,
    vm.swf = swf,
    vm.session = session,
    vm.broadcast = broadcasterService,
    vm.giftOverlayUrl = config.settings.ServerCDNBaseUrl + "/angularjsapp/src/assets/images/icons_v3/_gifts/_overlay",
    vm.thumb = config.settings.ServerCDNBaseUrl + "/php/api/channel/getImage/channelId=",
    vm.noThumb = config.settings.ServerCDNBaseUrl + "/images/nothumb.jpg",
    vm.pulseAnimation = config.settings.ServerCDNBaseUrl + "/angularjsapp/src/assets/animations/pulse-animation.gif",
    vm.gift = !1,
    vm.systemMessage = {},
    vm.systemMessage.hasMessage = !1,
    vm.dropBroadcastActive = !1,
    vm.online = navigator.onLine,
    vm.mirroredCamera = Api.store("mirrorCamera"),
    vm.globalVars = window.globalVars,
    vm.config = config;
    var ovThisTimeout, ovNextInterval, ovThis = function() {
        if (vm.gift = !1,
        !swf.giftSkus)
            return !1;
        if (swf.giftOverlayQueue && swf.giftOverlayQueue[0]) {
            var gift = swf.giftOverlayQueue[0];
            gift.comment = gift.comment.replace(/just /gi, ""),
            console.log("gift", gift);
            var giftInfo = swf.giftObjects[swf.giftSkus[gift.giftId]];
            console.log("giftInfo", giftInfo),
            swf.giftOverlayQueue.splice(0, 1),
            $timeout(function() {
                vm.gift = gift,
                vm.userId = gift.userId,
                63 == vm.gift.giftId && $timeout(function() {
                    vm.gift.animateSubs = !0
                }
                , 500)
            }
            , 500),
            $interval.cancel(ovNextInterval),
            ovNextInterval = $interval(ovNext, giftInfo.minVis + 500),
            $timeout.cancel(ovThisTimeout),
            ovThisTimeout = $timeout(ovThis, giftInfo.maxVis + 500)
        }
    }
    , ovNext = function() {
        swf.systemMessagesQueue && swf.systemMessagesQueue.length > 0 && !vm.systemMessage.hasMessage && (vm.systemMessage.message = swf.systemMessagesQueue[0],
        vm.systemMessage.message.trustedMessage = $sce.trustAsHtml(Api.linkify(vm.systemMessage.message.web)),
        vm.systemMessage.hasMessage = !0,
        queueSystemMessage(vm.systemMessage.message.webTime)),
        swf.giftOverlayQueue && swf.giftOverlayQueue[0] && ovThis()
    }
    ;
    ovNextInterval = $interval(ovNext, 3e3),
    vm.isProposalGift = function(giftId) {
        return giftId && "PROPOSAL_RING" === swf.giftSkus[giftId] ? !0 : !1
    }
    ,
    vm.dropBroadcast = function(confirmation) {
        return swf.snapshot = void 0,
        void 0 !== confirmation ? (vm.dropBroadcastActive = confirmation,
        !1) : void (session.user && session.user.userId && !swf.eob && (swf.isGuest ? Api.post("broadcast/guest", {
            channelId: broadcasterService.broadcaster.userId,
            userId: session.user.userId,
            action: "remove"
        }) : (broadcasterService.dropBroadcast(session.user.userId),
        delete broadcasterService.bcMedia),
        session.isBroadcasting = !1))
    }
    ,
    vm.clearEOB = function(rebroadcast) {
        session.user && swf.eob && (session.isBroadcasting && (session.isBroadcasting = !1),
        vm.dropBroadcastActive = !1,
        swf.eob && delete swf.eob,
        rebroadcast || swf.loadNextChannel(broadcasterService.broadcaster))
    }
    ,
    vm.cancelBroadcast = function() {
        swf.snapshot = void 0,
        swf.invokeSwfMethod("cancelBroadcast"),
        swf.isGuest ? Api.post("broadcast/guest", {
            channelId: broadcasterService.broadcaster.userId,
            userId: session.user.userId,
            action: "remove"
        }) : broadcasterService.dropBroadcast(session.user.userId),
        swf.settingUpBroadcast = !1,
        window.YouNow.App.loadChannel({
            channelId: swf.broadcast.userId,
            isBroadcasting: !1
        })
    }
    ,
    vm.mirrorCamera = function() {
        var mirrorCamera = Api.store("mirrorCamera");
        mirrorCamera ? Api.store("mirrorCamera", !1) : Api.store("mirrorCamera", !0),
        vm.mirroredCamera = Api.store("mirrorCamera"),
        swf.invokeSwfMethod("mirror", vm.mirroredCamera)
    }
    ,
    vm.broadcastAgain = function() {
        broadcasterService.goLive(),
        swf.goLive(),
        swf.eob && delete swf.eob
    }
    ,
    eventbus.subscribe("swf:reset", clearOverlay, "overlay", $scope),
    eventbus.subscribe("pusher:ban", function(event, message) {
        session.user && !swf.settingUpBroadcast && broadcasterService.broadcaster && broadcasterService.broadcaster.userId == session.user.userId && vm.dropBroadcast()
    }
    , "overlay", $scope),
    $scope.$on("$destroy", function() {
        $timeout.cancel(ovNext),
        $timeout.cancel(ovThis)
    }
    )
}
]).directive("playerOverlay", function() {
    return {
        restrict: "A",
        templateUrl: "angularjsapp/src/app/components/video-player/player-overlay.tpl.html",
        controller: "PlayerOverlayCtrl",
        controllerAs: "vm",
        scope: {}
    }
}
).directive("introVideo", function(config, swf, $timeout, Api) {
    return {
        restrict: "E",
        template: '<video id="introvideo" autoplay width="592" height="444"> <source ng-src="{{::video.src +\'intro-video.mp4\'}}" type="video/mp4"> <source ng-src="{{::vm.introVideo +\'intro-video.webm\'}}" type="video/webm"> </video>',
        link: function(scope, element, attributes) {
            function destroyIntroVideo(beforeVol) {
                swf.bootingFlash = !1,
                swf.setVolume(beforeVol)
            }
            function setupVolume() {
                var swfBeforeVol = Number(window.sessionStorage.getItem("younowVol"));
                return 0 === swfBeforeVol && document.getElementById("volume-icon") && (Api.triggerTooltip("volume-icon", 4e3),
                document.getElementById("introvideo").muted = !0),
                swfBeforeVol
            }
            element = angular.element(element.children()[0]);
            var beforeVol;
            scope.video = {},
            scope.video.src = config.settings.ServerCDNBaseUrl + "/angularjsapp/src/assets/animations/",
            $timeout(function() {
                element && (beforeVol = setupVolume(),
                element.on("ended", function(e) {
                    e || (e = window.event),
                    destroyIntroVideo(beforeVol)
                }
                , !1))
            }
            , 0),
            $timeout(function() {
                element && (beforeVol = setupVolume(),
                destroyIntroVideo(beforeVol))
            }
            , 7e3)
        }
    }
}
),
angular.module("younow.yn-enter", []).directive("ynEnter", function() {
    return {
        restrict: "A",
        link: function(scope, elements, attrs) {
            elements.bind("keydown keypress", function(event) {
                13 === event.which && (scope.$apply(function() {
                    scope.$eval(attrs.ynEnter)
                }
                ),
                event.preventDefault())
            }
            )
        }
    }
}
),
angular.module("younow.modals.youtube-subscribe", []).controller("YoutubeSubscribeCtrl", ["$scope", "$window", "$timeout", "username", "config", function($scope, $window, $timeout, username, config) {
    $scope.base = config.settings.ServerCDNBaseUrl;
    var pieces = username.split("/");
    "user" === pieces[0] ? $scope.channel = pieces[1] : "channel" === pieces[0] ? $scope.channelid = pieces[1] : $scope.channel = username,
    $timeout(function() {
        gapi.ytsubscribe.go()
    }
    , 10),
    $timeout(function() {
        gapi.ytsubscribe.go()
    }
    , 300)
}
]),
angular.module("younow.directives", []).directive("preventDefault", function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            (attrs.ngClick || "" === attrs.href || "#" === attrs.href) && elem.on("click dblclick", function(e) {
                e.preventDefault()
            }
            )
        }
    }
}
).directive("dynamicAlert", ["$compile", function($compile) {
    return {
        restrict: "A",
        replace: !0,
        link: function(scope, ele, attrs) {
            scope.$watch(attrs.dynamicAlert, function(html) {
                ele.html(html),
                $compile(ele.contents())(scope)
            }
            )
        }
    }
}
]).directive("intlTelInput", ["config", "$timeout", "Api", "$rootScope", "trackingPixel", function(config, $timeout, Api, $rootScope, trackingPixel) {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            function postToTwilio(number) {
                number = number.replace("+", ""),
                Api.post("younow/sendToPhone", {
                    number: number
                }).then(function(response) {
                    response.data.result && "Success" === response.data.result && (scope.twilioSuccess = !0)
                }
                )
            }
            function validateInput() {
                if ($rootScope.gaEvent("Conversion", "Send App Attempt", trackingPixel.getUserLocation() || "ANCILLARY"),
                input)
                    if (input.intlTelInput("isValidNumber"))
                        postToTwilio(input.intlTelInput("getNumber"));
                    else {
                        var error, errorCode = input.intlTelInput("getValidationError");
                        for (error in window.intlTelInputUtils.validationError)
                            if (window.intlTelInputUtils.validationError[error] === errorCode && "IS_POSSIBLE" !== error) {
                                scope.errorMsg = error.toLowerCase().replace(/_/g, " ").capitalize(),
                                scope.$apply();
                                break
                            }
                        Api.triggerTooltip(elem)
                    }
            }
            var input, id, button;
            $timeout(function() {
                id = "#" + attrs.id,
                input = window.$(id),
                button = elem.siblings(".btn"),
                button.on("click", validateInput),
                elem.on("keydown", function(e) {
                    e && 13 === e.keyCode && validateInput()
                }
                ),
                input.intlTelInput({
                    utilsScript: config.settings.ServerCDNBaseUrl + "/angularjsapp/vendor/static/libphonenumber.js"
                }),
                scope.$on("$destroy", function() {
                    input.intlTelInput("destroy")
                }
                )
            }
            )
        }
    }
}
]);
angular.module("younow.services.channel", []).factory("broadcasterService", ["$rootScope", "$http", "$q", "$location", "$document", "$window", "$timeout", "$state", "$stateParams", "$sce", "$modal", "config", "session", "Api", "swf", "pusher", "eventbus", "$interval", function($rootScope, $http, $q, $location, $document, $window, $timeout, $state, $stateParams, $sce, $modal, config, session, Api, swf, pusher, eventbus, $interval) {
    var service = {};
    service.viewtimeInterval = $interval(function() {
        service.viewtimeSeconds++,
        window.showvt && console.log(service.viewtimeSeconds + " +1")
    }
    , 1e3),
    service.getCurId = function() {
        var curId;
        return curId = service.broadcaster && service.broadcaster.userId && !service.channel ? service.broadcaster.userId : service.exploreBroadcaster && service.exploreBroadcaster.userId ? service.exploreBroadcaster.userId : service.channel && service.channel.channelId ? service.channel.channelId : 0,
        session.curId = curId,
        curId
    }
    ,
    service.getBroadcaster = function(id, username, async, bcMedia) {
        if (service.trackBroadcaster(),
        $window.quickHash) {
            var tag = $window.quickHash.substr(1);
            return $window.quickHash = "",
            service.featuredBroadcaster(tag)
        }
        if (!id)
            return service.featuredBroadcaster();
        var data = {};
        return username ? data.user = id : data.channelId = id,
        data.curId = void 0 !== service.curId ? service.curId : 0,
        Api.get("broadcast/info", data).success(function(data) {
            if (Api.customPlayData(data),
            !data.userId) {
                if (username)
                    return service.featuredBroadcaster(id);
                data.userId = id
            }
            service.updateBroadcaster(data, async, bcMedia)
        }
        )
    }
    ,
    service.trackBroadcaster = function() {
        service.broadcaster && service.viewtimeSeconds && !service.broadcaster.async && eventbus.notifySubscribers("broadcast:end", service.broadcaster)
    }
    ,
    service.switchBroadcaster = function(id, username, async) {
        service.curId = service.getCurId(),
        window.isPrerender && (async = !0),
        service.getBroadcaster(id, username, async).then(function() {
            service.broadcaster && service.broadcaster.userId && service.showBroadcaster()
        }
        )
    }
    ,
    service.featuredBroadcaster = function(tag, noFans, goingLive) {
        var data = {
            locale: config.preferredLocale
        };
        return tag && (data.tag = tag),
        noFans && (data.noFans = 1),
        data.curId = service.getCurId(),
        Api.get("younow/featured", data).success(function(data) {
            Api.customPlayData(data),
            data.userId ? (service.updateBroadcaster(data, !1),
            service.showBroadcaster(goingLive)) : tag ? (missingUser(),
            console.warn("user does not exist")) : ($state.go("main.channel.detail"),
            service.broadcaster = {
                broadcastId: 1
            })
        }
        )
    }
    ,
    service.updateBroadcaster = function(data, async, bcMedia) {
        service.broadcaster = Api.channelFormat(data),
        $stateParams.entityId && service.broadcaster.broadcastId && "channel" != $stateParams.entityId && (async = !1),
        async || !service.broadcaster.broadcastId ? service.async = !0 : service.async = !1,
        window.waitForPageType && (service.async && (window.YouNow.track.pageFirst || $stateParams.entityId || $stateParams.entityType) || (window.waitForPageType = !1,
        $rootScope.gaPage({
            pageType: service.async ? "profile" : "brdcst"
        }))),
        Api.store("hideYounowLanding") || service.async || (Api.showTopBanner("Watch " + data.profile + " live streaming on YouNow!", "Watch and chat live with " + data.profile + ", or discover more amazing broadcasters live streaming on YouNow!", "Explore More Broadcasters", "/explore/", "success", !0, "banner"),
        Api.store("hideYounowLanding", !0)),
        session.channelId = service.broadcaster.userId,
        service.broadcaster.user && (service.broadcaster.user.description && 0 !== service.broadcaster.user.description.length ? service.broadcaster.user.description = Api.convertEmoji(Api.linkify(service.broadcaster.user.description.replace(/\s{2,}/g, " ").replace(/(<br \/>)+/g, "<span class='line-break'> &#8226; </span> "))) : service.broadcaster.user.description = Api.prepareDescription(""),
        service.broadcaster.user.location = Api.cleanLocation(service.broadcaster.location, !0),
        service.broadcaster.user.location && (service.broadcaster.user.description = Api.trustedHTML(service.broadcaster.user.location + " <span class='line-break'> &#8226; </span> " + service.broadcaster.user.description.$$unwrapTrustedValue())),
        void 0 !== bcMedia && (service.bcMedia = bcMedia)),
        service.async === !1 && (service.channel = void 0),
        service.ready = !0;
        var deferred = $q.defer();
        return deferred.resolve(service.broadcaster),
        deferred.promise
    }
    ,
    service.showBroadcaster = function(goingLive) {
        return service.async ? (service.setChannel(),
        !1) : (service.viewtimeSeconds = 0,
        swf.currentSession && !swf.settingUpBroadcast && swf.currentSession.isBroadcasting ? (session.isBroadcasting = !0,
        swf.settingUpBroadcast = !1) : swf.settingUpBroadcast ? (swf.currentSession.isBroadcasting = !0,
        swf.newBroadcaster(service.broadcaster, goingLive)) : swf.newBroadcaster(service.broadcaster),
        !service.broadcaster.profile || service.broadcaster.profile === $stateParams.profileUrlString && "channel" !== $stateParams.entityId || service.internalLocationChange(service.broadcaster.profile),
        $timeout(function() {
            service.broadcaster && service.broadcaster.user && ($rootScope.title = "YouNow | " + service.broadcaster.user.profileUrlString + " | Live Stream Video Chat | Free Apps on Web, iOS and Android",
            "/" != window.location.pathname && $rootScope.gaPage({
                page: "Broadcast"
            }))
        }
        , 1e3),
        window.YouNow.track.pageFirst || $rootScope.gaPage(),
        pusher.ready().then(function() {
            pusher.subscribeToChannel(service.broadcaster.userId, service.channelSwitch)
        }
        ),
        Api.polls.getPlayData && ($interval.cancel(Api.polls.getPlayData),
        delete Api.polls.getPlayData),
        void getPlayData())
    }
    ;
    var getPlayData = function() {
        var method;
        if (!service.broadcaster || !service.broadcaster.broadcastId)
            return !1;
        if (("main.channel.detail" !== $state.current.name || service.async) && Api.polls.getPlayData)
            return !1;
        method = Api.customPlayData(!1, service.broadcaster.userId),
        "https:" === window.location.protocol && -1 === method.indexOf("https") && (method = method.replace("http", "https"));
        var data = config.settings.PlayDataOnS3Enabled ? {} : {
            channelId: service.broadcaster.userId
        }
          , heartbeat = {
            response: void 0,
            type: void 0
        };
        session.user && swf.broadcast && session.user.userId === swf.broadcast.userId ? (heartbeat.response = swf.invokeSwfMethod("onBroadcast"),
        heartbeat.type = "broadcaster") : (heartbeat.response = swf.invokeSwfMethod("onPlayback"),
        heartbeat.type = "viewer"),
        void 0 !== heartbeat.response && isNaN(heartbeat.response.nsTime) ? ("viewer" === heartbeat.type && window.YouNow.App.loadChannel({
            channelId: swf.broadcast.userId
        }),
        "broadcaster" === heartbeat.type && swf.invokeSwfMethod("startBroadcast", service.bcMedia),
        window.YouNow.App.stateChange("RECONNECT")) : "RECONNECT" === swf.playState && window.YouNow.App.stateChange("PLAYING"),
        Api.get(method, data, "usecdn").success(function(data) {
            return data.onBroadcastPlay && data.onBroadcastPlay.channelId != service.broadcaster.userId ? !1 : (data.onBroadcastPlay && swf.onPusherEvent("onBroadcastPlay", {
                message: data.onBroadcastPlay,
                channelId: data.onBroadcastPlay.channelId
            }),
            data.onBroadcastPlay && data.onBroadcastPlay.queues && (angular.forEach(data.onBroadcastPlay.queues[0].items, function(person, key) {
                person.tooltip = '<div class="user-row"><span class="ynicon ynicon-level"></span><span class="level">' + person.userlevel + '</span> <span class="name">' + person.username + '</span></div><div class="viewer-row"><span class="ynicon ynicon-viewers"></span> <span class="viewers">' + person.viewers + "</span></div>",
                session.user && person.userId == session.user.userId && (service.broadcaster.tagRank = "#" + (key + 1)),
                person.id = config.settings.UseBroadcastThumbs ? person.broadcastId : person.userId
            }
            ),
            service.queue = data.onBroadcastPlay.queues[0].items),
            void (service.async || Api.poll(getPlayData, "getPlayData", data.nextRefresh)))
        }
        )
    }
    ;
    service.setChannel = function() {
        eventbus.notifySubscribers("broadcast:end", service.broadcaster),
        service.broadcaster.async = !0;
        var postData = {
            channelId: service.broadcaster.userId
        }
          , useCDN = "usecdn";
        session.user && session.user.userId == service.broadcaster.userId && (useCDN = "",
        postData.random = Math.random()),
        Api.get("channel/getInfo", postData, useCDN).success(function(data) {
            if (Api.store("hideYounowLanding") || service.async && (Api.showTopBanner("Become a fan of " + data.profile + " on YouNow!", "Fan " + data.profile + " and never miss a broadcast, or discover more amazing broadcasters live streaming on YouNow!", "Explore More Broadcasters", "/explore/", "success", !0, "banner"),
            Api.store("hideYounowLanding", !0)),
            !data.userId)
                return missingUser(),
                !0;
            data.displayDescription = Api.convertEmoji(Api.prepareDescription(data.description)),
            data.fullName = 1 == data.useprofile ? data.profile : data.firstName + " " + data.lastName,
            data.location = Api.cleanLocation(data),
            data.facebookLink = "1" == data.facebookOption && data.websiteUrl.length ? data.websiteUrl : "http://www.facebook.com/" + data.facebookId,
            "http" != data.facebookLink.substr(0, 4) && (data.facebookLink = "http://" + data.facebookLink),
            data.youtubePath = ["user", "channel"].indexOf(data.youTubeUserName.split("/")[0]) > -1 ? data.youTubeUserName : "user/" + data.youTubeUserName,
            service.channel = Api.channelFormat(data),
            service.channel.finished = {},
            service.channel.index = {},
            service.subscribeToAsyncPusher(),
            service.channel.profile !== $stateParams.profileUrlString && service.internalLocationChange(service.channel.profile),
            $timeout(function() {
                return service.channel ? void ($rootScope.title = "YouNow | " + service.channel.profile + " | Live Stream Video Chat | Free Apps on Web, iOS and Android") : !1
            }
            , 1e3),
            angular.element(document.getElementById("textarea_")).empty();
            var params = {};
            $stateParams.entityId && $stateParams.entityType ? (params.entityId = $stateParams.entityId,
            params.deepLink = $stateParams.entityType) : params.getPinned = 1,
            service.getItems("posts", params).then(function() {
                params.entityId ? service.showDeepLink() : getRightColumn()
            }
            );
            var total = 4
              , connected = 0;
            service.channel.twitterId && service.channel.twitterId.length && connected++,
            service.channel.facebookId && service.channel.facebookId.length && connected++,
            service.channel.youTubeUserName && service.channel.youTubeChannelId.length && connected++,
            service.channel.instagramHandle && service.channel.instagramHandle.length && connected++,
            service.channel.googleId && service.channel.googleId.length && (connected++,
            total++),
            service.channel.socialRatio = connected + "/" + total,
            service.channel.socialRatioCap = connected === total ? !0 : !1
        }
        )
    }
    ,
    service.showDeepLink = function() {
        $stateParams.entityId && $stateParams.entityType && $timeout(function() {
            service.deeplinkId = "c" === $stateParams.entityType ? $stateParams.entityId : service.channel.posts[0].id;
            var scrollToElement = angular.element(document.getElementById("post_" + service.deeplinkId));
            $document.scrollTo(scrollToElement, 0, 1e3).then(function() {
                $timeout(function() {
                    service.deeplinkId = 0
                }
                , 1500),
                ("b" === $stateParams.entityType || "f" === $stateParams.entityType) && $modal.mediaPlayerModal($stateParams.entityId),
                $timeout(function() {
                    getRightColumn()
                }
                , 1500)
            }
            )
        }
        , 500)
    }
    ;
    var methods = {
        posts: "post/get",
        broadcasts: "post/getBroadcasts",
        fans: "channel/getFans",
        fansof: "channel/getFansOf"
    }
      , items = {
        posts: "posts",
        broadcasts: "posts",
        fans: "fans",
        fansof: "fans"
    };
    service.getItems = function(type, params) {
        return type || (type = service.tab),
        params || (params = {}),
        !service.channel || service.channel.finished[type] ? $q.reject() : (params.channelId = service.broadcaster.userId,
        service.channel[type] && (params.startFrom = service.channel[type].length),
        "posts" === items[type] && session.user && session.user.userId && (params.userId = session.user.userId),
        Api.get(methods[type], params).success(function(data) {
            return service.channel ? (angular.forEach(data[items[type]], function(item) {
                addItem(item, type)
            }
            ),
            service.channel.finished[type] = "posts" === items[type] ? !data.hasMore : !data.hasNext,
            1 === params.numberOfRecords && (service.channel.finished[type] = !1),
            void (service.channel.finished[type] && ($rootScope.hideFooter = !1))) : $q.reject()
        }
        ))
    }
    ;
    var addItem = function(item, type) {
        service.channel[type] || (service.channel[type] = []),
        service.channel.index[type] || (service.channel.index[type] = {});
        var id = item.id || item.userId;
        service.channel.index[type][id] || (service.channel[type].push(item),
        service.channel.index[type][id] = !0)
    }
      , getRightColumn = function() {
        service.getItems("broadcasts", {
            numberOfRecords: 1
        }).then(function() {
            service.channel && (service.broadcaster.broadcastId || (service.channel.preview = service.channel.broadcasts ? "recent" : "prompt"),
            getBiggestFans(),
            getOnlineFans())
        }
        ),
        showMiniPlayer()
    }
      , getOnlineFans = function() {
        if (!service.channel || !service.async)
            return !1;
        var params = {
            numberOfRecords: 12,
            channelId: service.broadcaster.userId
        };
        return Api.get("channel/getLocationOnlineFans", params, !0).success(function(data) {
            return service.channel && service.channel.userId == params.channelId ? (data.totalFans && service.channel && (service.channel.onlineFans = Api.sortUsers(data.users),
            service.channel.totalOnlineFans = data.totalFans),
            void Api.poll(getOnlineFans, "getOnlineFans", data.nextRefresh)) : !1
        }
        )
    }
      , getBiggestFans = function() {
        if (!service.channel || !service.async)
            return !1;
        var params = {
            numberOfRecords: 12,
            channelId: service.broadcaster.userId
        };
        return Api.get("channel/getTopPaidFans", params, !0).success(function(data) {
            return service.channel && service.channel.userId == params.channelId ? void (service.channel && (service.channel.biggestFans = Api.sortUsers(data.fans))) : !1
        }
        )
    }
      , liveBroadcastNotification = function() {
        var curId = void 0 !== service.curId ? service.curId : 0;
        Api.get("broadcast/info", {
            channelId: service.broadcaster.userId,
            curId: curId
        }).then(function(data) {
            Api.customPlayData(data),
            data && (data = data.data,
            data.media ? service.updateBroadcaster(data, !0).then(function(response) {
                if (service.channel) {
                    service.channel.preview = !1;
                    var href = "window.location.href='/" + data.profile + "?from=notification';";
                    Api.showTopNotification('<a href="javascript:' + href + ';" >' + data.profile + " just went live! Click here to watch them.</a>", "success", !1, !1, 1e4),
                    showMiniPlayer()
                }
            }
            ) : $timeout(function() {
                liveBroadcastNotification()
            }
            , 2e3))
        }
        )
    }
      , showMiniPlayer = function() {
        $timeout(function() {
            service.broadcaster.broadcastId && service.async && jwplayer("playeroniBsrErLcZk") && config.init.then(function() {
                jwplayer.key = config.settings.JW_PLAYER_KEY;
                var data = service.broadcaster;
                if (!data.media)
                    return $timeout(function() {
                        showMiniPlayer()
                    }
                    , 300),
                    !1;
                var stream_url = "rtmp://" + data.media.host + data.media.app + "/" + data.media.stream;
                jwplayer("playeroniBsrErLcZk").setup({
                    file: stream_url,
                    width: "315",
                    height: "225",
                    autostart: !0,
                    controls: !1,
                    aspectratio: "4:3",
                    primary: "flash"
                }),
                jwplayer("playeroniBsrErLcZk").setVolume(swf.volume),
                jwplayer("playeroniBsrErLcZk").onDisplayClick(function() {
                    $rootScope.$evalAsync(function() {
                        service.switchAsync(!1)
                    }
                    )
                }
                )
            }
            )
        }
        , 300)
    }
    ;
    service.goLive = function() {
        if (session.isBroadcasting)
            session.preventBroadcastInterrupt();
        else {
            if (session.checkBan())
                return !1;
            session.user.userId ? (swf.settingUpBroadcast = !0,
            service.switchToBroadcast(!0)) : session.showLoginModal("", "GOLIVE")
        }
    }
    ,
    service.switchToBroadcast = function(goingLive) {
        swf.available() || (service.broadcaster && service.broadcaster.broadcastId ? service.switchAsync(!1) : (service.async = !1,
        service.broadcaster = void 0,
        service.featuredBroadcaster(!1, !1, goingLive)))
    }
    ,
    service.internalLocationChange = function(profile) {
        service.internalUpdate = !0,
        $location.path("/" + profile),
        $location.hash("")
    }
    ,
    service.addBroadcast = function(id, tag, fbPublish, twPublish, shareMsg, pc) {
        var params = {
            userId: session.user.userId,
            channelId: session.user.userId,
            broadcastId: id,
            ver: config.settings.JS_VERSION,
            tags: tag,
            fbPublish: fbPublish ? 1 : 0,
            twPublish: twPublish ? 1 : 0,
            mirror: Api.store("mirrorCamera") ? 1 : 0,
            shareMsg: shareMsg
        };
        return config.params.mcu && pc && (params.mcu = config.params.mcu,
        params.sdpOffer = pc.localDescription.sdp),
        Api.post("broadcast/add", params)
    }
    ,
    service.dropBroadcast = function(id) {
        return id ? Api.post("broadcast/drop", {
            userId: id,
            channelId: id
        }) : void 0
    }
    ;
    var missingUser = function() {
        -1 !== window.location.pathname.indexOf("/channel") && window.waitForPageType && $rootScope.gaPage({
            pageType: "explore"
        }),
        window.waitForPageType = !1,
        $state.go("main.explore"),
        Api.showTopNotification("User could not be found")
    }
    ;
    $rootScope.$watch(function() {
        return swf.loadChannel
    }
    , function(data) {
        data && (void 0 !== data.broadcaster && (data.isBroadcasting = 1 == data.broadcaster ? !0 : !1),
        void 0 !== data.isBroadcasting && (swf.currentSession.isBroadcasting = data.isBroadcasting,
        session.isBroadcasting = data.isBroadcasting),
        Api.googleAdLoaded = !session.isBroadcasting,
        data.channelId ? (service.channelSwitch = "END",
        service.switchBroadcaster(data.channelId)) : 0 !== data.channelId || data.isBroadcasting || service.featuredBroadcaster(),
        void 0 !== data.channelId && (swf.settingUpBroadcast = !1))
    }
    ),
    service.switchAsync = function(async) {
        service.async = async,
        async ? service.channel ? (service.subscribeToAsyncPusher(),
        showMiniPlayer()) : service.setChannel() : service.showBroadcaster()
    }
    ,
    service.subscribeToAsyncPusher = function() {
        pusher.ready().then(function() {
            pusher.subscribeToAsync(service.broadcaster.userId, function(eventName, eventData) {
                return "onBroadcast" === eventName && liveBroadcastNotification(),
                "ontrackBroadcastViewtime" === eventName && (service.broadcaster.broadcastId = !1,
                getRightColumn()),
                "posts" !== service.tab && "broadcasts" !== service.tab ? !0 : (service.channel[service.tab] || (service.channel[service.tab] = []),
                service.channel.index[service.tab] || (service.channel.index[service.tab] = {}),
                realtime.posts = service.channel[service.tab],
                realtime.index = service.channel.index[service.tab],
                void (realtime[eventName] && realtime[eventName](eventData.message)))
            }
            )
        }
        )
    }
    ,
    service.realtime = {};
    var realtime = service.realtime
      , findPosition = function(id, posts) {
        for (var i = 0; i < posts.length; i++)
            if (posts[i].id == id)
                return i
    }
    ;
    realtime.new_comment = function(comment) {
        if (comment.parentId) {
            var parent = realtime.posts[findPosition(comment.parentId, realtime.posts)];
            parent && (parent.replies || (parent.replies = []),
            parent.replies.push(comment))
        } else
            service.channel.posts.unshift(comment),
            service.channel.index[comment.id] = !0
    }
    ,
    realtime.new_like = function(like) {
        changeLikes(like, 1)
    }
    ,
    realtime.unlike_comment = function(like) {
        changeLikes(like, -1)
    }
    ;
    var changeLikes = function(like, change) {
        var item;
        if (like.parentId) {
            var parent = realtime.posts[findPosition(like.parentId, realtime.posts)];
            parent && (item = parent.replies[findPosition(like.id, parent.replies)])
        } else
            item = realtime.posts[findPosition(like.id, realtime.posts)];
        item && item.changeLikes(change)
    }
    ;
    return realtime.pin_comment = function(comment) {
        for (var i = 0; i < realtime.posts.length; i++) {
            var post = realtime.posts[i];
            post.isPinned = !1,
            realtime.posts[i].id == comment.id && (post.isPinned = !0,
            realtime.posts.splice(0, 0, realtime.posts.splice(i, 1)[0]))
        }
    }
    ,
    realtime.delete_comment = function(comment) {
        if (comment.parentId) {
            var parent = realtime.posts[findPosition(comment.parentId, realtime.posts)];
            parent && parent.replies.splice(findPosition(comment.id, parent.replies), 1)
        } else
            realtime.posts.splice(findPosition(comment.id, realtime.posts), 1)
    }
    ,
    service
}
]),
angular.module("younow.services.config", []).factory("config", ["$http", "$window", "$location", function($http, $window, $location) {
    var config = {};
    config.params = $location.search(),
    config.host = config.params.host || $window.location.host,
    config.buybarsiframe = !1,
    config.bootstrap = {
        adminRoles: [1, 2, 3, 4, 5],
        cdnDev: "cdnv2-vd.younow.com",
        cdnProduction: "cdn2.younow.com",
        facebookAppId: 0x9bdd06215862,
        flashVersion: "47.35",
        googleClientId: "619368150599-2ef6s6o5dqgv6oqoq5tevtqo1k7gni12.apps.googleusercontent.com",
        googleAnalyticsId: "UA-24148895-1",
        jwplayerKey: "gyoz1D2yoy+GG57wtwrgni10vNZ0+43mBkBYhw==",
        TM_DOMAIN: "images1.younow.com",
        TM_ID: "7jnw4jh4"
    },
    config.update = function() {
        var cdn = config.host;
        "www.younow.com" === config.host && (cdn = config.bootstrap.cdnProduction),
        "www2-vd.younow.com" === config.host && (cdn = config.bootstrap.cdnDev);
        var host = config.params.host ? config.params.host : cdn
          , url = window.location.protocol + "//" + host + "/php/api/younow/config";
        "www.younow.com" !== config.host && (url += "/devByPass=1");
        var callback = function(data) {
            data.redirect ? $window.location.href = data.redirect : ("https:" === window.location.protocol && -1 === data.ServerCDNBaseUrl.indexOf("https") && (data.ServerCDNBaseUrl = data.ServerCDNBaseUrl.replace("http", "https")),
            "https:" === window.location.protocol && -1 === data.ServerLocalBaseUrl.indexOf("https") && (data.ServerLocalBaseUrl = data.ServerLocalBaseUrl.replace("http", "https")),
            "https:" === window.location.protocol && -1 === data.ServerRecommendationsBaseUrl.indexOf("https") && (data.ServerRecommendationsBaseUrl = data.ServerRecommendationsBaseUrl.replace("http", "https")),
            "https:" === window.location.protocol && -1 === data.TrackingHost.indexOf("https") && (data.TrackingHost = data.TrackingHost.replace("http", "https")),
            "https:" === window.location.protocol && -1 === data.PlayDataBaseUrl.indexOf("https") && (data.PlayDataBaseUrl = data.PlayDataBaseUrl.replace("http", "https")),
            "https:" === window.location.protocol && -1 === data.ServerHomeBaseUrl.indexOf("https") && (data.ServerHomeBaseUrl = data.ServerHomeBaseUrl.replace("http", "https")),
            "https:" === window.location.protocol && -1 === data.BadgeBaseUrl.indexOf("https") && (data.BadgeBaseUrl = data.BadgeBaseUrl.replace("http", "https")),
            "https:" === window.location.protocol && -1 === window.globalVars.CDN_BASE_URL.indexOf("https") && (window.globalVars.CDN_BASE_URL = window.globalVars.CDN_BASE_URL.replace("http", "https")),
            config.settings = data,
            config.detectedLocale = config.detectedLocale || detectLocale(),
            config.preferredLocale = config.preferredLocale || preferredLocale())
        }
        ;
        return config.params.host ? $http.jsonp(url + "/callback=JSON_CALLBACK").success(callback) : $http.get(url).success(callback)
    }
    ;
    var detectLocale = function() {
        var res = (navigator.userLanguage || navigator.language || navigator.browserLanguage || navigator.systemLanguage).substr(0, 2)
          , detected = null ;
        return angular.forEach(config.settings.Locales, function(locale, key) {
            (res === key || locale.loc.indexOf(res) > -1) && (detected = key)
        }
        ),
        detected ? detected : config.settings.DefaultLocale || "en"
    }
      , preferredLocale = function() {
        return $window.localStorage && $window.localStorage.younowLocale && $window.localStorage.younowLocale.length > 0 ? $window.localStorage.younowLocale : config.detectedLocale
    }
    ;
    return config.localeMatch = function(locales) {
        return locales.indexOf(config.preferredLocale) > -1 ? "preferred" : locales.indexOf(config.detectedLocale) > -1 ? "detected" : !1
    }
    ,
    config.shareCopy = function(type) {
        return type && config.settings[type] ? config.settings[type][Math.floor(Math.random() * config.settings[type].length)] : "YouNow is a fun and interactive live video experience. Watch live broadcasts, chat & meet new friends, or broadcast live to grow your social circle!"
    }
    ,
    config.isAdmin = function(user) {
        for (var i = 0; i < config.bootstrap.adminRoles.length; i++)
            if (user && user.role === config.bootstrap.adminRoles[i])
                return !0;
        return !1
    }
    ,
    config
}
]),
angular.module("younow.services.dashboard", []).factory("dashboard", ["$http", "$timeout", "Api", "config", "$filter", "$rootScope", "$q", "$state", function($http, $timeout, Api, config, $filter, $rootScope, $q, $state) {
    function formatTrendingLists(listNode, dashboardNode, data) {
        var i;
        for (i = data[listNode].length - 1; i >= 0; i--)
            null  !== data[listNode][i] && data[listNode][i].username && null  !== data[listNode][i].viewers && data[listNode][i].userId ? data[listNode][i].viewers = Api.squashedNumber(data[listNode][i].viewers, 3) : data[listNode].splice(i, 1);
        data.trending_users.length && (dashboard[dashboardNode] = data[listNode])
    }
    var dashboard = {}
      , getTrending = function() {
        var data = {};
        dashboard.tags && dashboard.users && "main.channel.detail" !== $state.current.name && "main.explore" !== $state.current.name && "main.settings" !== $state.current.name || Api.get("younow/dashboard", {
            locale: config.preferredLocale,
            trending: 50
        }, "usecdn").success(function(data) {
            data = data;
            var i;
            if (data.trending_users && formatTrendingLists("trending_users", "users", data),
            data.featured_users && formatTrendingLists("featured_users", "featuredUsers", data),
            data.trending_tags) {
                for (i = data.trending_tags.length - 1; i >= 0; i--)
                    null  === data.trending_tags[i] && data.trending_tags.splice(i, 1);
                data.trending_tags.length && (dashboard.tags = data.trending_tags)
            }
        }
        ),
        Api.poll(getTrending, "getTrending", data.nextRefresh, 10)
    }
    ;
    return config.init.then(function() {
        getTrending()
    }
    ),
    dashboard.syncCurrentViewers = function(data) {
        return data.channelId && data.viewers ? void angular.forEach(dashboard.users, function(user) {
            user.userId == data.channelId && $rootScope.$evalAsync(function() {
                user.viewers = Api.squashedNumber(data.viewers, 3)
            }
            )
        }
        ) : !1
    }
    ,
    dashboard.filterTrending = function(userId) {
        for (var i = 0; i < dashboard.users.length; i++)
            userId == dashboard.users[i].userId && dashboard.users.splice(i, 1)
    }
    ,
    dashboard.fetchTrendingBroadcasts = function() {
        var defer = $q.defer()
          , i = 0
          , trendingUsers = [];
        return Api.get("younow/dashboard/mobile", {
            topicsEnabled: 1,
            trending: 30,
            featured: 30,
            locale: config.preferredLocale
        }, !0).then(function(response) {
            if (response.data && 0 === response.data.errorCode && response.data.trending_tags.length > 0) {
                for (i; i < response.data.trending_tags.length; i++) {
                    var broadcast = response.data.trending_tags[i].items[0];
                    trendingUsers.push(broadcast)
                }
                defer.resolve(trendingUsers)
            } else
                defer.reject();
            return defer.promise
        }
        )
    }
    ,
    dashboard
}
]),
angular.module("younow.services.eventbus", []).service("eventbus", ["$rootScope", function($rootScope) {
    var eventbus = {};
    return eventbus.subscribers = {},
    eventbus.notifySubscribers = function(eventChannel, data) {
        $rootScope.$emit(eventChannel, data)
    }
    ,
    eventbus.subscribe = function(eventChannel, callback, subscriber, scope) {
        var channel = subscriber + ":" + eventChannel;
        eventbus.subscribers[channel] && eventbus.subscribers[channel](),
        scope && scope.$on("$destroy", function() {
            eventbus.unsubscribe(subscriber, eventChannel)
        }
        ),
        eventbus.subscribers[channel] = $rootScope.$on(eventChannel, function(event, args) {
            callback(event.name, args),
            event.preventDefault()
        }
        )
    }
    ,
    eventbus.unsubscribe = function(subscriber, eventChannel) {
        subscriber = subscriber + ":" + eventChannel;
        for (var key in eventbus.subscribers)
            key == subscriber && (eventbus.subscribers[key](),
            delete eventbus.subscribers[key])
    }
    ,
    eventbus
}
]),
angular.module("younow.services.pusher", []).factory("pusher", ["$http", "config", "Api", "$window", "$q", "swf", "$rootScope", "debug", "eventbus", function($http, config, Api, $window, $q, swf, $rootScope, debug, eventbus) {
    var pusher = {}
      , pusherReady = $q.defer();
    return pusher.ready = function() {
        return pusherReady.promise
    }
    ,
    pusher.init = function() {
        var options = {
            authEndpoint: config.settings.ServerLocalBaseUrl + "/api/pusherAuthDedicated.php",
            cluster: "younow"
        };
        pusher.SDK = new $window.Pusher(config.settings.PusherDedicatedAppKey,options),
        pusherReady.resolve()
    }
    ,
    pusher.subscribeToPrivate = function(userId) {
        pusher.subscribe("privateChannel", "private-channel_" + userId),
        pusher.privateChannel.channel.bind_all(function(eventName, eventData) {
            var blockedEvents = ["pusher:subscription_succeeded", "pusher:member_removed", "pusher:member_added", "pusher:subscription_error", "channel_is_live", "delete_comment", "new_comment", "new_like", "pin_comment", "unlike_comment"];
            debug.console(["PRIVATE", "PUSHER"], {
                eventName: eventName,
                eventData: eventData
            }),
            -1 === blockedEvents.indexOf(eventName) && (eventData.channelId = pusher.channelId,
            eventData.type = "private",
            swf.onPusherEvent(eventName, eventData)),
            "onNotificationCountChange" == eventName && eventbus.notifySubscribers("user:onNotificationCountChange", 1),
            ("onSuspend" == eventName || "onBan" == eventName) && (eventbus.notifySubscribers("pusher:ban", eventData),
            pusher.onBan = eventData),
            ("onUnSuspend" == eventName || "onUnBan" == eventName) && (pusher.onBan = 0,
            eventbus.notifySubscribers("pusher:ban", 0)),
            "onAccountUpdate" == eventName && $rootScope.$broadcast("onAccountUpdate", eventData),
            "onCoins" == eventName && $rootScope.$evalAsync(function() {
                pusher.onCoins = eventData.message
            }
            ),
            "onLocaleChange" == eventName && $rootScope.$evalAsync(function() {
                pusher.onLocale = eventData.message.locale
            }
            )
        }
        )
    }
    ,
    pusher.subscribeToChannel = function(channelId, channelSwitch) {
        pusher.channelId = channelId,
        pusher.unsubscribe("asyncChannel"),
        debug.console(["CHANNELSWITCH"], {
            "public-on-channel": pusher.channelId,
            shard: pusher.shard,
            "channel-to": channelSwitch
        }),
        config.settings.NoPusherOnChannelWeb || pusher.subscribe("presenceChannel", "public-on-channel_" + pusher.channelId + "_" + pusher.shard + "_" + channelSwitch),
        pusher.subscribe("publicChannel", "public-channel_" + pusher.channelId),
        pusher.publicChannel.channel.bind_all(function(eventName, eventData) {
            var blockedEvents = ["pusher:subscription_succeeded", "pusher:member_removed", "pusher:member_added", "pusher:subscription_error", "channel_is_live", "delete_comment", "new_comment", "new_like", "pin_comment", "unlike_comment", "onBroadcastPlay", "onCoins"];
            -1 === blockedEvents.indexOf(eventName) && (eventData.channelId = pusher.channelId,
            eventData.type = "public",
            swf.onPusherEvent(eventName, eventData));
            var loggedEvents = ["pusher:subscription_error"];
            loggedEvents.indexOf(eventName) > -1
        }
        )
    }
    ,
    pusher.subscribeToAsync = function(channelId, callback) {
        pusher.channelId = channelId,
        pusher.unsubscribe("publicChannel"),
        pusher.unsubscribe("presenceChannel"),
        pusher.subscribe("asyncChannel", "public-async-channel_" + pusher.channelId),
        pusher.asyncChannel.channel.bind_all(callback)
    }
    ,
    pusher.subscribe = function(name, id) {
        pusher.unsubscribe(name),
        pusher[name] = {
            id: id
        },
        pusher[name].channel = pusher.SDK.subscribe(id),
        debug.console(["PUSHER", "SUBSCRIBE"], {
            name: name,
            id: id
        })
    }
    ,
    pusher.unsubscribe = function(name) {
        pusher[name] && (debug.console(["PUSHER", "UNSUBSCRIBE"], {
            name: name,
            id: pusher[name].id
        }),
        pusher.SDK.unsubscribe(pusher[name].id),
        delete pusher[name])
    }
    ,
    pusher.reset = function(name) {
        pusher[name] && pusher.subscribe(name, pusher[name].id)
    }
    ,
    pusher
}
]),
angular.module("younow.services.search", []).factory("searchService", ["Api", function(Api) {
    var service = {};
    return service.getItems = function(query, numberOfRecords) {
        query = query || "",
        service.results && query === service.query || (service.results = []),
        service.query = query;
        var method, params = {
            numberOfRecords: numberOfRecords || 20,
            startFrom: service.results.length || 0
        };
        return query ? (method = "younow/search",
        params.s = query) : method = "younow/trendingUsers",
        Api.get(method, params).success(function(data) {
            query ? service.results = service.results.concat(data.users) : (angular.forEach(data.trending_users, function(user, i) {
                user.tags = user.tags[0],
                user.profileUrlString = user.profile,
                user.statusId = 2,
                user.level = Math.round(user.userlevel)
            }
            ),
            service.results = service.results.concat(data.trending_users),
            data.totalUsers = data.total),
            service.results.length >= data.totalUsers && (service.finished = !0)
        }
        )
    }
    ,
    service
}
]),
angular.module("younow.services.session.facebook", []).factory("Facebook", ["$q", "$window", "$timeout", "config", "Api", function($q, $window, $timeout, config, Api) {
    var Facebook = {};
    return $window.fbready = $q.defer(),
    Facebook.ready = function() {
        return $window.fbready.promise
    }
    ,
    $window.fbAsyncInit = function() {
        Facebook.loaded || (config.init.then(function() {
            Facebook.options = {
                init: {
                    appId: config.settings.fbAppId,
                    version: "v2.1",
                    cookie: !0,
                    status: !0,
                    xfbml: !0
                },
                scope: "public_profile,email,user_friends"
            },
            $window.FB.init(Facebook.options.init),
            $window.fbready.resolve()
        }
        ),
        Facebook.loaded = !0)
    }
    ,
    $window.FB && $window.fbAsyncInit(),
    Facebook.SDK = function(method, vars) {
        return Facebook.ready().then(function() {
            var deferred = $q.defer();
            return vars ? $window.FB[method](vars, function(response) {
                deferred.resolve(response)
            }
            ) : $window.FB[method](function(response) {
                deferred.resolve(response)
            }
            ),
            deferred.promise
        }
        )
    }
    ,
    Facebook.authenticate = function(silent) {
        return Facebook.ready().then(function() {
            return Facebook.deferred = $q.defer(),
            FB.getLoginStatus(function(response) {
                "connected" === response.status ? Facebook.expandUser(response.authResponse) : silent ? Api.returnDeferred(Facebook.deferred, "reject", "facebook silent auth unsuccessful") : Facebook.showAuthDialog()
            }
            ),
            Facebook.deferred.promise
        }
        )
    }
    ,
    Facebook.showAuthDialog = function() {
        var scope = Facebook.options.scope;
        $window.tempFBscope && (scope = $window.tempFBscope,
        $window.tempFBscope = !1),
        FB.login(function(response) {
            "connected" === response.status ? Facebook.expandUser(response.authResponse) : Facebook.deferred.reject(response.status)
        }
        , {
            scope: scope
        })
    }
    ,
    Facebook.expandUser = function(authResponse, retry) {
        return null  === authResponse ? void Facebook.deferred.reject("error") : void FB.api("/me", function(userData) {
            userData || (retry ? Facebook.deferred.reject(authResponse) : $timeout(function() {
                Facebook.expandUser(authResponse, !0)
            }
            , 300));
            var fb = angular.extend(authResponse, userData)
              , loginData = {
                facebookToken: fb.accessToken,
                facebookWebsite: fb.link,
                facebookEmail: fb.email,
                facebookId: fb.id,
                facebookBirthday: fb.birthday,
                facebookVerified: fb.verified,
                facebookFirstName: fb.first_name,
                facebookLastName: fb.last_name,
                facebookName: fb.name,
                facebookThumbUrl: "http://graph.facebook.com/" + fb.id + "/picture?type=large"
            };
            return FB.api("/me/friends/?limit=0", function(friends) {
                friends && friends.summary && friends.summary.total_count && (loginData.connections = friends.summary.total_count),
                Api.returnDeferred(Facebook.deferred, "resolve", loginData)
            }
            ),
            fb
        }
        )
    }
    ,
    Facebook.getPagesList = function() {
        var deferred = $q.defer();
        return FB.login(function(authResponse) {
            FB.api("/me/accounts", function(response) {
                deferred.resolve(angular.extend(response, authResponse))
            }
            )
        }
        , {
            scope: "publish_pages,manage_pages",
            auth_type: "rerequest"
        }),
        deferred.promise
    }
    ,
    Facebook
}
]),
angular.module("younow.services.session.google", []).factory("google", ["$q", "$timeout", "Api", "config", function($q, $timeout, Api, config) {
    var google = {};
    return window.googleReady = $q.defer(),
    google.ready = function() {
        return window.googleReady.promise
    }
    ,
    window.gapi ? window.googleReady.resolve() : window.googleAsyncInit = function() {
        window.googleReady.resolve()
    }
    ,
    google.authenticate = function(silent) {
        return google.ready().then(function() {
            window.gapi.auth.signIn({
                clientid: config.settings.GOOGLE_PLUS_CLIENT_ID,
                immediate: !0,
                cookiepolicy: "single_host_origin",
                scope: "https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read",
                callback: "googleLogin"
            })
        }
        ),
        google.deferred = $q.defer(),
        google.deferred.promise
    }
    ,
    window.googleLogin = function(authResponse) {
        authResponse.status.signed_in && google.expandUser(authResponse)
    }
    ,
    google.expandUser = function(authResponse) {
        window.gapi.client.load("plus", "v1", function() {
            window.gapi.client.plus.people.get({
                userId: "me"
            }).execute(function(resp) {
                var userInfo = angular.extend(authResponse, resp);
                angular.forEach(resp.emails, function(email) {
                    userInfo.email || "account" !== email.type || (userInfo.email = email.value)
                }
                ),
                window.gapi.client.plus.people.list({
                    userId: "me",
                    collection: "visible"
                }).execute(function(resp) {
                    userInfo.totalItems = Number(resp.totalItems) || 0,
                    google.relevantFields(userInfo)
                }
                )
            }
            )
        }
        )
    }
    ,
    google.relevantFields = function(userInfo) {
        var relevant = {};
        relevant.email = userInfo.email,
        relevant.gender = userInfo.gender,
        relevant.url = userInfo.url,
        relevant.googleId = userInfo.id,
        relevant.accessToken = userInfo.access_token,
        relevant.code = userInfo.code,
        relevant.firstName = userInfo.name.givenName,
        relevant.lastName = userInfo.name.familyName,
        relevant.nickname = userInfo.displayName || "",
        relevant.thumb = (userInfo.image ? userInfo.image.url : "").replace("sz=50", "sz=100"),
        relevant.description = userInfo.aboutMe || "",
        relevant.connections = userInfo.totalItems || 0,
        Api.returnDeferred(google.deferred, "resolve", relevant)
    }
    ,
    google
}
]),
angular.module("younow.services.session.instagram", []).factory("instagram", ["$q", "$window", "config", "Api", function($q, $window, config, Api) {
    var instagram = {};
    return instagram.authenticate = function(silent) {
        var url = config.settings.ServerHomeBaseUrl + "instagramAuth.php"
          , loginWindow = window.open(url, "Instagram Login", "location=0, status=0, width=650, height=350, scrollbars=1");
        return window.instagramPopup = loginWindow,
        instagram.deferred = $q.defer(),
        instagram.deferred.promise
    }
    ,
    $window.instagramCallback = function(userInfo) {
        window.instagramPopup.close(),
        userInfo && userInfo.id && userInfo.access_token || Api.returnDeferred(instagram.deferred, "reject", userInfo);
        var relevant = {}
          , nameTokens = userInfo.full_name ? userInfo.full_name.split(" ") : [];
        relevant.instagramId = userInfo.id,
        relevant.firstName = nameTokens[0] || "",
        relevant.lastName = nameTokens[1] || "",
        relevant.nickname = userInfo.username || "",
        relevant.thumb = userInfo.profile_picture || "",
        relevant.description = userInfo.bio || "",
        relevant.url = userInfo.username ? "https://instagram.com/" + userInfo.username : "",
        relevant.connections = userInfo.followed_by,
        relevant.oauthToken = userInfo.access_token,
        Api.returnDeferred(instagram.deferred, "resolve", relevant)
    }
    ,
    instagram
}
]),
angular.module("younow.services.session", ["younow.modals.login", "younow.services.session.facebook", "younow.services.session.google", "younow.services.session.twitter", "younow.services.session.instagram", "younow.services.session.youtube"]).factory("session", ["$rootScope", "$location", "$http", "$q", "$timeout", "$modal", "$window", "$state", "$translate", "$interval", "config", "swf", "pusher", "Api", "Facebook", "twitter", "google", "instagram", "youtube", "eventbus", function($rootScope, $location, $http, $q, $timeout, $modal, $window, $state, $translate, $interval, config, swf, pusher, Api, Facebook, twitter, google, instagram, youtube, eventbus) {
    function rerouteNonPartners(user) {
        (0 === user.userId || user.userId > 0 && 0 === user.partner && "/partners/earnings" === $state.current.name) && $state.go("/partners"),
        0 === user.userId || 4 != user.partner && 5 != user.partner && 8 != user.partner && 9 != user.partner && 10 != user.partner || $state.go("main.channel.detail")
    }
    var session = {};
    session.fanStatus = {},
    session.subStatus = {},
    session.isFanQueue = [],
    session.isSubQueue = [],
    session.authenticate = {
        facebook: Facebook.authenticate,
        twitter: twitter.authenticate,
        google: google.authenticate,
        instagram: instagram.authenticate,
        youtube: youtube.authenticate
    },
    session.showLoginModal = function(hard, source) {
        return $modal.loginModal(hard, source)
    }
    ,
    session.auth = function(type, silent) {
        return session.authenticate[type](silent).then(function(data) {
            return window.localStorage.lastNetwork = type,
            session.login(data)
        }
        )["catch"](function(response) {
            "error" === response && Api.showTopNotification("Could not login. Please try again!"),
            window.localStorage.removeItem("lastNetwork")
        }
        )
    }
    ,
    session.getSession = function() {
        return Api.post("younow/user", {
            curId: session.curId || 0,
            app_version: config.settings.JS_VERSION
        }).success(function(data) {
            "0" == data.userId ? eventbus.unsubscribe("session", "error:loggedout") : eventbus.subscribe("error:loggedout", session.logout, "session"),
            session.updateUser(data),
            0 === data.userId && $q.reject()
        }
        )
    }
    ,
    session.updateUser = function(data) {
        session.user = data,
        session.updatePusherShard(),
        session.loggedIn = 0 !== session.user.userId,
        session.user.fullName = Api.fullName(data),
        session.administrator = session.isAdmin(),
        session.checkLocale(),
        swf.sendKeepSession(data),
        swf.sessionData = data,
        fetchFans(),
        fetchSubs(),
        session.checkBan(),
        7 === session.user.partner && "/partners" != $location.$$path && "/partners" != $location.$$path && $modal.partnerAgreement(),
        session.loggedIn ? (session.getNotificationCount(),
        swf.loggedIn || (swf.notifyLogin(data),
        swf.loggedIn = !0),
        pusher.ready().then(function() {
            pusher.subscribeToPrivate(session.user.userId)
        }
        ),
        6 == session.user.partner && "/partners" != $location.$$path && "/partner" != $location.$$path && $modal.partner(),
        session.user.editorsPick && (1 === session.user.editorsPick.state && $modal.epModal(),
        3 === session.user.editorsPick.state && $modal.epModal("expired")),
        session.user.progress = Math.floor(100 * (session.user.realLevel - Math.floor(session.user.realLevel))),
        session.showRightSidebar(),
        session.trackUser()) : session.rightsidebar = !1,
        "/partners/earnings" === $state.current.name && rerouteNonPartners(data),
        session.loggedIn || (config.showHomepage = !0),
        eventbus.notifySubscribers("session:loggedIn", session.loggedIn)
    }
    ,
    session.trackUser = function() {
        session.loggedIn && ($window.ga && ($window.ga("set", "&uid", session.user.userId),
        $window.ga("set", "dimension3", "registered")),
        $window.Bugsnag && ($window.Bugsnag.user = {
            id: session.user.userId,
            name: session.user.profile
        }))
    }
    ,
    session.checkLocale = function() {
        session.user.locale && config.preferredLocale !== session.user.locale && session.updateLocale(session.user.locale)
    }
    ,
    session.updateLocale = function(newLocale) {
        newLocale && (config.preferredLocale = newLocale),
        $translate.use(config.preferredLocale),
        $window.localStorage.younowLocale = config.preferredLocale
    }
    ,
    $rootScope.$watch(function() {
        return pusher.onLocale
    }
    , function(locale) {
        locale && session.updateLocale(locale)
    }
    ),
    session.checkBan = function() {
        return session.user && 0 !== session.user.userId && 0 !== session.user.banId ? (Api.showTopNotification("<div>" + session.user.banningMsg.msgString + '</div><a class="btn btn-confirm" target="_blank" href="' + session.user.banningMsg.supportBtn.btnAct_web + '">' + session.user.banningMsg.supportBtn.btnTxt_web + "</a>", "now", !0, void 0),
        config.banningMsg = session.user.banningMsg,
        !0) : !1
    }
    ,
    session.silentAuth = function() {
        return window.localStorage.lastNetwork ? session.auth(window.localStorage.lastNetwork, !0) : !1
    }
    ,
    session.forceLogin = function(loginType) {
        config.init.then(function() {
            if (session.loggedIn)
                return !0;
            if (("hard" == config.settings.loginGate || "soft" == config.settings.loginGate) && $state.includes("main") && !session.forcedLogin) {
                "hard" == config.settings.loginGate ? !0 : !1;
                session.forcedLogin = !0
            }
        }
        )
    }
    ,
    session.login = function(loginData, connect) {
        loginData.locale = config.preferredLocale,
        loginData.channelId = session.channelId || loginData.channelId,
        loginData.inviteString = session.inviteString || session.channelId,
        loginData.srcId = session.srcId || 0,
        loginData.tmsid = $window.YouNow.Bootstrap.tmId || "";
        var endpoint = connect ? "younow/connect" : "younow/login";
        return connect && (loginData.userId = session.user.userId),
        Api.post(endpoint, loginData).then(function(response) {
            return session.getSession(),
            response
        }
        )
    }
    ,
    session.logout = function() {
        return session.isBroadcasting || swf.settingUpBroadcast ? (session.preventBroadcastInterrupt(),
        !1) : void Api.post("younow/logout", {
            userId: session.user.userId
        }).then(function(response) {
            window.localStorage.lastNetwork && $rootScope.gaEvent("FEATURE", "LOGOUT", window.localStorage.lastNetwork.toUpperCase()),
            session.getSession(),
            window.localStorage.removeItem("lastNetwork"),
            angular.forEach(session.fanStatus, function(status, id) {
                session.fanStatus[id] = void 0,
                session.isFanQueue.push(id)
            }
            ),
            angular.forEach(session.subStatus, function(status, id) {
                session.subStatus[id] = void 0,
                session.isSubQueue.push(id)
            }
            ),
            swf.notifyLogout()
        }
        )
    }
    ,
    session.updatePusherShard = function() {
        var newShard = session.user.userId || session.user.session;
        newShard != pusher.shard && (pusher.shard = newShard,
        pusher.presenceChannel && !config.settings.NoPusherOnChannelWeb && pusher.subscribe("presenceChannel", "public-on-channel_" + pusher.channelId + "_" + pusher.shard))
    }
    ,
    session.showInviteUsers = function(options) {
        if (!$window.FB)
            throw new Error("Facebook api not found");
        options = options || {};
        var params = {
            method: "apprequests",
            message: options.msg || "Hey, you should join YouNow! It's a new way to discover awesome people, become a broadcasting legend and get more followers/subscribers.",
            data: {
                src: options.srcId || session.srcId || 0,
                invite: options.inviteStr || session.inviteString || 0
            }
        };
        $rootScope.gaEvent("FEATURE", "invitefriends", config.preferredLocale),
        $window.FB.ui(params, options.callback)
    }
    ,
    $rootScope.$watch(function() {
        return pusher.onCoins
    }
    , function(message) {
        message && (session.user.userCoins = Number(message.coins) || 0,
        session.user.level = Number(message.level) || 0)
    }
    ),
    $rootScope.$watch(function() {
        return swf.partnerState
    }
    , function(message) {
        message && (session.user.partner = message)
    }
    ),
    $rootScope.$watch(function() {
        return swf.barsRefund
    }
    , function(message) {
        message && 0 !== session.user.userId && (session.user.vault.webBars = message)
    }
    ),
    session.getNotificationCount = function() {
        Api.get("younow/notificationCount", {
            userId: session.user.userId
        }).success(function(data) {
            session.resetNotifications(),
            session.notificationCount = data.inAppCount || 0
        }
        )
    }
    ,
    $rootScope.$on("onAccountUpdate", function(event, data) {
        $rootScope.$evalAsync(function() {
            event.preventDefault(),
            session.user.userId && (session.user.spendingDisabled = data.message.spendingDisabled)
        }
        )
    }
    ),
    session.getActivityFeed = function() {
        if (!session.rightsidebar)
            return !0;
        var params = {
            userId: session.user.userId,
            items: 10,
            web: 1
        };
        Api.get("getFeed", params).success(function(data) {
            data.feed && data.feed.length && (session.activityFeed = data.feed),
            session.noActivity = !session.activityFeed || 0 === session.activityFeed.length
        }
        )
    }
    ,
    session.getOnlineFriends = function() {
        if (!session.rightsidebar)
            return !0;
        var params = {
            numberOfRecords: 50,
            channelId: session.user.userId
        };
        Api.get("channel/getLocationOnlineFansOf", params).success(function(data) {
            data.users && (session.onlineFriends = Api.sortUsers(data.users)),
            session.noFriendsActivity = !session.onlineFriends || 0 === session.onlineFriends.length,
            session.loggedIn && Api.poll(session.getOnlineFriends, "getOnlineFriends", data.nextRefresh)
        }
        )
    }
    ,
    session.resetNotifications = function() {
        session.notifications = [],
        session.notificationCount = 0,
        session.moreNotifications = !0
    }
    ,
    session.getNotifications = function(start) {
        if (void 0 === start && (start = session.notifications.length),
        session.noMoreNotifications && 0 !== start)
            return !1;
        var params = {
            startFrom: start,
            userId: session.user.userId,
            web: 1
        };
        return Api.get("channel/getNotifications", params).success(function(data) {
            if (session.noMoreNotifications = data.hasNext ? !1 : !0,
            !data.notifications)
                return !1;
            session.notifications = 0 === params.startFrom ? data.notifications : session.notifications.concat(data.notifications);
            for (var i = 0; i < session.notifications.length; i++)
                session.notifications[i].template = session.notifications[i].template.replace(session.notifications[i].userName, "")
        }
        )
    }
    ,
    session.getFan = function(id) {
        session.fanStatus[id] || -1 != session.isFanQueue.indexOf(id) || (session.isFanQueue.push(id),
        fetchFans())
    }
    ;
    var fetchFans = function() {
        session.user && session.user.userId && session.isFanQueue.length && !session.isFanTimer && (session.isFanTimer = $timeout(function() {
            Api.get("channel/isFanOf", {
                userId: session.user.userId,
                channelIds: session.isFanQueue.join(",")
            }).success(function(data) {
                angular.forEach(data.fanOf, function(status, id) {
                    -1 != status.indexOf("fan") ? session.fanStatus[id] = !0 : session.fanStatus[id] = !1
                }
                ),
                session.isFanQueue = [],
                session.isFanTimer = void 0
            }
            )
        }
        ))
    }
    ;
    session.getSub = function(id) {
        session.subStatus[id] || -1 != session.isSubQueue.indexOf(id) || (session.isSubQueue.push(id),
        fetchSubs())
    }
    ;
    var fetchSubs = function() {
        session.user && session.user.userId && session.isSubQueue.length && !session.isSubTimer && (session.isSubTimer = $timeout(function() {
            Api.get("channel/isSubscriberOf", {
                userId: session.user.userId,
                channelIds: session.isSubQueue.join(",")
            }).success(function(data) {
                angular.forEach(data.subscriberOf, function(status, id) {
                    -1 != status.indexOf("sub") ? session.subStatus[id] = !0 : session.subStatus[id] = !1
                }
                ),
                session.isSubQueue = [],
                session.isSubTimer = void 0
            }
            )
        }
        ))
    }
    ;
    return session.isAdmin = function() {
        return config.isAdmin(session.user)
    }
    ,
    session.preventBroadcastInterrupt = function() {
        $modal.alert("Sorry, you can't do that while you're broadcasting")
    }
    ,
    session.showRightSidebar = function() {
        $rootScope.$evalAsync(function() {
            session.rightsidebar = !0,
            session.getOnlineFriends()
        }
        )
    }
    ,
    eventbus.subscribe("pusher:ban", function(event, message) {
        session.user && (message.message && (session.user.banningMsg || (session.user.banningMsg = {}),
        session.user.banId = message.message.banId,
        session.user.banningMsg.msgString = message.message.messageText,
        session.user.banningMsg.supportBtn = {
            btnTxt_web: message.message.btnTxt_web,
            btnAct_web: message.message.btnAct_web
        },
        config.banningMsg = session.user.banningMsg,
        Api.showTopNotification("<div>" + session.user.banningMsg.msgString + '</div><a class="btn btn-confirm" target="_blank" href="' + session.user.banningMsg.supportBtn.btnAct_web + '">' + session.user.banningMsg.supportBtn.btnTxt_web + "</a>", "now", !0)),
        0 === message && (session.user.banId = 0,
        session.user.banningMsg = {},
        delete config.banningMsg,
        Api.closeTopNotification("sticky")),
        swf.available() || session.checkBan())
    }
    , "session"),
    eventbus.subscribe("user:update", function(event, data) {
        for (var key in data)
            void 0 !== session.user[key] && (session.user[key] = data[key])
    }
    , "session"),
    eventbus.subscribe("user:onNotificationCountChange", function(event, data) {
        $rootScope.$evalAsync(function() {
            session.notificationCount++,
            !session.isBroadcasting && document.getElementById("notificationSound") && document.getElementById("notificationSound").play()
        }
        )
    }
    , "session"),
    session
}
]),
angular.module("younow.services.session.twitter", []).factory("twitter", ["$q", "$window", "config", "Api", function($q, $window, config, Api) {
    var twitter = {};
    return twitter.authenticate = function(silent) {
        var url = config.settings.ServerHomeBaseUrl + "twitterLogin.php"
          , loginWindow = window.open(url, "Twitter Login", "location=0, status=0, width=800, height=400, scrollbars=1");
        return window.twitterPopup = loginWindow,
        twitter.deferred = $q.defer(),
        twitter.deferred.promise
    }
    ,
    $window.twitterSuccessCallback = function(userInfo) {
        var relevant = {}
          , nameTokens = userInfo.name ? userInfo.name.split(" ") : [];
        relevant.twitterId = userInfo.id,
        relevant.firstName = nameTokens[0] || "",
        relevant.lastName = nameTokens[1] || "",
        relevant.nickname = userInfo.screen_name || "",
        relevant.thumb = userInfo.profile_image_url || "",
        relevant.description = userInfo.description || "",
        relevant.url = userInfo.screen_name ? "http://www.twitter.com/" + userInfo.screen_name : "",
        relevant.connections = userInfo.followers_count,
        relevant.oauthToken = userInfo.oauth_token,
        relevant.oauthTokenSecret = userInfo.oauth_token_secret,
        relevant.location = userInfo.location,
        Api.returnDeferred(twitter.deferred, "resolve", relevant)
    }
    ,
    twitter
}
]),
angular.module("younow.services.session.youtube", []).factory("youtube", ["$q", "$window", "$timeout", "$http", "Api", "config", "google", "$modal", function($q, $window, $timeout, $http, Api, config, google, $modal) {
    var youtube = {};
    return youtube.authenticate = function(silent) {
        return google.ready().then(function() {
            $window.gapi.auth.signIn({
                clientid: config.settings.GOOGLE_PLUS_CLIENT_ID,
                immediate: !0,
                cookiepolicy: "single_host_origin",
                accesstype: "offline",
                approvalprompt: "force",
                includegrantedscopes: "false",
                scope: "https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.upload",
                callback: "youtubeLogin"
            })
        }
        ),
        youtube.deferred = $q.defer(),
        youtube.deferred.promise
    }
    ,
    $window.youtubeLogin = function(authResponse) {
        authResponse.status.signed_in && youtube.expandUser(authResponse)
    }
    ,
    youtube.expandUser = function(authResponse) {
        window.gapi.client.load("youtube", "v3", function() {
            window.gapi.client.youtube.channels.list({
                part: "snippet,statistics",
                mine: !0,
                maxResults: 10
            }).execute(function(resp) {
                var userInfo = {};
                userInfo.authCode = authResponse.code,
                userInfo.youtubeChannelId = resp.items[0].id,
                userInfo.youtubeChannelUrl = "www.youtube.com/channel/" + resp.items[0].id,
                userInfo.youtubeChannelName = resp.items[0].snippet.title,
                userInfo.connections = resp.items[0].statistics.subscriberCount,
                userInfo.viewCount = resp.items[0].statistics.viewCount,
                Api.returnDeferred(youtube.deferred, "resolve", userInfo)
            }
            )
        }
        )
    }
    ,
    youtube
}
]),
angular.module("younow.services.shareService", []).factory("shareService", ["$q", "$rootScope", "session", "swf", "Api", "config", "$timeout", "$window", "$interval", function($q, $rootScope, session, swf, Api, config, $timeout, $window, $interval) {
    var service = {};
    return service.shareTwitter = function() {
        var target = "twitter"
          , deferred = $q.defer();
        return swf.snapshot.shared[target] ? (swf.snapshot.sharing[target] = !1,
        swf.snapshot.retake = !0,
        Api.triggerTooltip("snapshot-retake", 5e3),
        service.trackFunnel(target + "_duplicate"),
        deferred.reject("cooldown"),
        deferred.promise) : session.user && session.user.twitterId ? (service.sendShare(target, 2),
        deferred.resolve("success"),
        deferred.promise) : ($timeout(function() {
            $rootScope.gaEvent("CONNECT", "ATTEMPT_TWITTER", "SHARE"),
            session.authenticate[target]().then(function(data) {
                return session.login(data, !0).then(function(data) {
                    0 === data.data.errorCode ? ($rootScope.gaEvent("CONNECT", "CONNECT_TWITTER", "SHARE"),
                    swf.snapshot.sharing[target] = !0,
                    service.sendShare(target, 2),
                    deferred.resolve("success"),
                    twitterWindow && $interval.cancel(twitterWindow)) : ($rootScope.gaEvent("CONNECT", "ERROR_TWITTER_" + data.data.errorCode, "SHARE"),
                    swf.snapshot.sharing[target] = !1)
                }
                )
            }
            );
            var secondsOpened = 0
              , twitterWindow = $interval(function() {
                secondsOpened++,
                60 === secondsOpened && $window.twitterPopup.close(),
                $window.twitterPopup && $window.twitterPopup.closed && (swf.snapshot.sharing[target] = !1,
                $interval.cancel(twitterWindow))
            }
            , 1e3)
        }
        , 0),
        deferred.promise)
    }
    ,
    service.shareFacebook = function() {
        var target = "facebook";
        return swf.snapshot.shared[target] ? (swf.snapshot.sharing[target] = !1,
        swf.snapshot.retake = !0,
        Api.triggerTooltip("snapshot-retake", 5e3),
        service.trackFunnel(target + "_duplicate"),
        !1) : void (session.user && (session.user.facebookId || service.facebookConnected) && swf.share_facebook_permitted ? swf.postGift(session.user.userId, swf.broadcast.userId, 15, 1, swf.snapshot.snapshot, 1).then(function(response) {
            swf.snapshot.id = response.data.snapshotId,
            swf.snapshot.share_image = config.settings.ServerCDNBaseUrl + "/php/api/getSnapshot/id=" + swf.snapshot.id;
            try {
                swf.snapshot.share_link = swf.getShareData(target).$$state.value.url
            } catch (err) {
                swf.snapshot.share_link = ""
            }
            var post = {
                link: swf.snapshot.share_link,
                picture: swf.snapshot.share_image,
                message: swf.broadcast.share_message
            };
            service.shareFacebookSend(post)
        }
        ) : session.user && session.user.facebookId ? service.shareFacebookLogin() : session.user && $timeout(function() {
            $window.tempFBscope = "public_profile,email,user_friends,publish_actions",
            session.authenticate[target]().then(function(data) {
                $rootScope.gaEvent("CONNECT", "ATTEMPT_FACEBOOK", "SHARE"),
                session.login(data, !0).then(function(data) {
                    0 === data.data.errorCode ? ($rootScope.gaEvent("CONNECT", "CONNECT_FACEBOOK", "SHARE"),
                    service.facebookConnected = !0,
                    service.shareFacebookAuth()) : ($rootScope.gaEvent("CONNECT", "ERROR_FACEBOOK_" + data.data.errorCode, "SHARE"),
                    swf.snapshot.sharing[target] = !1)
                }
                , function(reason) {
                    swf.snapshot.sharing[target] = !1
                }
                )
            }
            , function(reason) {
                swf.snapshot.sharing[target] = !1
            }
            )
        }
        , 0))
    }
    ,
    service.shareFacebookAuth = function() {
        var target = "facebook";
        FB.api("/me/permissions", function(response) {
            if (response && !response.error)
                for (var each in response)
                    for (var permission in response[each])
                        if ("publish_actions" == response[each][permission].permission && "granted" == response[each][permission].status)
                            return swf.share_facebook_permitted = !0,
                            service.shareFacebook(),
                            !0;
            return swf.snapshot.sharing[target] = !1,
            swf.snapshot.shared[target] = !1,
            Api.showTopNotification('Please click "share" again and allow posting to facebook.'),
            !1
        }
        )
    }
    ,
    service.shareFacebookLogin = function() {
        var target = "facebook";
        swf.snapshot.shared.facebook_login_attempted ? swf.snapshot.sharing[target] = !1 : (swf.snapshot.shared.facebook_login_attempted = !0,
        $timeout(function() {
            swf.snapshot.shared.facebook_login_attempted = !1
        }
        , 500),
        $timeout(function() {
            FB.login(function(response) {
                service.shareFacebookAuth()
            }
            , {
                scope: "publish_actions",
                auth_type: "rerequest"
            })
        }
        , 0))
    }
    ,
    service.shareFacebookSend = function(postData) {
        var target = "facebook";
        swf.snapshot.shared[target] = !0,
        swf.snapshot.sharing[target] = !1,
        swf.broadcast.shared[target] || service.incrementShareCount(target),
        FB.api("/me/feed", "POST", postData, function(response) {
            response.id ? (swf.snapshot.shared.facebook_postId = response.id,
            service.sendShare("facebook", 4)) : service.trackFunnel(target + "_error_fb")
        }
        )
    }
    ,
    service.incrementShareCount = function(target) {
        var user_shares_before = swf.broadcast.user_shares = swf.broadcast.user_shares || 0
          , user_shares_current = 0;
        for (var s in swf.broadcast.shared)
            swf.broadcast.shared[s] === !0 && user_shares_current++;
        0 === user_shares_current && (user_shares_current = 1),
        swf.broadcast.user_shares = user_shares_current;
        var user_shares_incremented = user_shares_current - user_shares_before > 0 ? !0 : !1;
        user_shares_incremented && swf.broadcast.shares++,
        Api.triggerTooltip("broadcast-shares", 2e3)
    }
    ,
    service.sendShare = function(target, sn) {
        var userId = session.user.userId
          , channelId = swf.broadcast.userId
          , comment = swf.broadcast.share_message
          , post = {
            userId: userId,
            channelId: channelId,
            comment: comment,
            sn: sn,
            sendTweet: "twitter" === target ? 1 : 0
        };
        "twitter" === target && (post.snapshot = swf.snapshot.snapshot);
        var trackingTarget = "younow" == target ? "invite" : target;
        Api.post("broadcast/share", post).success(function(data, status, headers, config) {
            swf.snapshot.sharing[target] = !1,
            0 === data.errorCode ? (swf.snapshot.shared[target] = !0,
            swf.broadcast.shared[target] || (swf.broadcast.shared[target] = !0,
            service.incrementShareCount(target)),
            service.trackFunnel(trackingTarget + "_success")) : service.trackFunnel(trackingTarget + "_error_" + data.errorCode)
        }
        ).error(function(data, status, headers, config) {
            swf.snapshot.sharing[target] = !1,
            service.trackFunnel(trackingTarget + "_error_yn")
        }
        )
    }
    ,
    service.trackFunnel = function(action) {
        swf.broadcast.shareCount[action] = swf.broadcast.shareCount[action] ? swf.broadcast.shareCount[action] + 1 : 1,
        $rootScope.gaEvent("SHARE", action, swf.broadcast.shareCount[action])
    }
    ,
    service
}
]),
angular.module("younow.services.swf", []).directive("swfstudio", ["$window", "$timeout", "$modal", "config", "swf", "session", "$rootScope", function($window, $timeout, $modal, config, swf, session, $rootScope) {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            config.init.then(function() {
                var url = config.settings.ServerCDNBaseUrl + "/swf/Player.swf?ver=" + config.settings.FLASH_VER_APPEND
                  , id = "flashObj1"
                  , width = "592"
                  , height = "444"
                  , version = "11.0.0"
                  , flashvars = {
                    splashScreen: "1",
                    etpl: "VS",
                    configUrl: config.settings.ServerCDNBaseUrl + "/php/api/younow/config",
                    defaultSpeakerVolume: "0.8"
                }
                  , params = {
                    allowscriptaccess: "always",
                    allownetworking: "all",
                    quality: "high",
                    bgcolor: "#FFFFFF",
                    allowfullscreen: "true",
                    wmode: "transparent"
                }
                  , attributes = {};
                $timeout(function() {
                    function callbackFn(e) {
                        angular.element(e.ref).on("mousedown", function(event) {
                            event.offsetY > 40 && !swf.settingUpBroadcast && swf.broadcast.userId !== session.user.userId && 3 !== event.which && ($rootScope.gaEvent("FEATURE", "clickvideo", config.preferredLocale),
                            $modal.profileSummary(swf.broadcast.userId))
                        }
                        )
                    }
                    swf.isBroadcasting || swf.settingUpBroadcast || (swf.bootingFlash = !0),
                    $window.swfobject.embedSWF(url, id, width, height, version, !1, flashvars, params, attributes, callbackFn)
                }
                , 0)
            }
            )
        }
    }
}
]).factory("swf", ["$http", "$window", "$location", "$rootScope", "$modal", "config", "Api", "dashboard", "$timeout", "$interval", "$filter", "$q", "eventbus", "debug", function($http, $window, $location, $rootScope, $modal, config, Api, dashboard, $timeout, $interval, $filter, $q, eventbus, debug) {
    var swf = {};
    $window.YouNow || ($window.YouNow = {}),
    $window.YouNow.App = {};
    var app = $window.YouNow.App
      , bcSetupTime = {}
      , unhandledCalls = ["aggressiveLogin", "channelChange", "getSessionMuted", "getShareUrl", "goToMainSite", "inviteGuestResult", "launchPartnerProgram", "onBroadcastUpdate", "onNewBroadcast", "openFacebookFriend", "openTweetWin", "openYoutubeSubscribe", "promptEndBroadcast", "promptBroadcastNotReady", "setupForwarding", "shareSocialNetwork", "showingSetupForm", "showInviteUsers", "showProfile", "stateChange", "trackKeepSession", "trackNewUsers", "tutorialModal", "updateBroadcaster", "updateChannelsData", "updateCoins", "updateCuePointData", "updateGuestStatus", "updateSessionState", "wakeUpPusher"]
      , ignoredCalls = ["showingSetupForm", "updateBroadcaster", "updateCoins", "wakeUpPusher"];
    angular.forEach(unhandledCalls, function(method) {
        app[method] = function(data) {
            -1 === ignoredCalls.indexOf(method) && console.warn("SWF Unhandled:", method, data)
        }
        ,
        window[method] = function(data) {
            -1 === ignoredCalls.indexOf(method) && console.warn("SWF Unhandled:", method, data)
        }
    }
    ),
    app.init = function() {
        $rootScope.$evalAsync(function() {
            !swf.broadcast || queue.init.changeChannel || swf.settingUpBroadcast || swf.invokeSwfMethod("changeChannel", swf.broadcast),
            swf.volume && !swf.bootingFlash && swf.invokeSwfMethod("setVolume", swf.volume),
            swf.sessionData && swf.sessionData.userId && swf.notifyLogin(swf.sessionData),
            swf.init = !0,
            swf.object = document.getElementById("flashObj1"),
            resolveQueue("init")
        }
        )
    }
    ,
    app.ready = function() {
        $rootScope.$evalAsync(function() {
            swf.ready = !0,
            resolveQueue("ready")
        }
        )
    }
    ,
    app.config = function() {
        return config.settings
    }
    ,
    app.getLocale = function() {
        return {
            locale: config.preferredLocale,
            detectedLocale: config.detectedLocale,
            filterChatFlag: config.settings.LocaleFilterChat,
            localeList: config.settings.Locales
        }
    }
    ,
    app.info = function() {
        swf.invokeSwfMethod("onInfo", JSON.stringify(swf.broadcast))
    }
    ,
    app.login = function() {
        $modal.loginModal("", "swf-service-login")
    }
    ,
    app.muted = function(muteState) {
        var newVolume = muteState ? 0 : 100;
        swf.setVolume(newVolume, !0)
    }
    ,
    app.openProfileSummary = function(id, userId, data) {
        $modal.profileSummary(id, data)
    }
    ,
    app.loadChannel = function(options) {
        swf.loadChannel = options
    }
    ,
    app.getShareUrl = function(options) {
        options = JSON.parse(options),
        options.inviteStr = swf.broadcast.userId;
        var url = Api.buildShareUrl(options);
        return JSON.stringify({
            shareUrl: url
        })
    }
    ,
    app.shareSocialNetwork = function(options) {
        if (options = JSON.parse(options),
        options.inviteStr = swf.broadcast.userId,
        options.url = Api.buildShareUrl(options),
        "facebook" === options.network && window.FB.ui({
            method: "feed",
            link: options.url,
            name: Api.buildFacebookCopy(options)
        }),
        "twitter" === options.network) {
            var copy = Api.buildTwitterCopy(options)
              , url = "https://twitter.com/intent/tweet?text=" + window.encodeURIComponent(copy);
            Api.openPopup("Twitter", url)
        }
    }
    ,
    app.partnerState = function(state) {
        $rootScope.$evalAsync(function() {
            swf.partnerState = state
        }
        )
    }
    ,
    app.showSettings = function(id) {
        $location.url("settings#accounts")
    }
    ,
    app.searchUsers = function(query) {
        Api.algolia(query).then(function(response) {
            var results = response.data.hits || []
              , data = {
                query: query,
                results: results
            };
            swf.invokeSwfMethod("searchResults", data)
        }
        )
    }
    ,
    app.stateChange = function(state) {
        swf.broadcast && swf.broadcast.broadcastId ? debug.console(["SWF", "STATE"], state + " " + swf.broadcast.broadcastId) : debug.console(["SWF", "STATE"], state),
        "BUFFERING" === state && $rootScope.$evalAsync(function() {
            swf.playState = state
        }
        ),
        "BUFFERING" !== swf.playState && "RECONNECT" !== swf.playState || "PLAYING" !== state || $timeout(function() {
            $rootScope.$evalAsync(function() {
                "1" == swf.broadcast.mirror && swf.invokeSwfMethod("mirror", !0),
                swf.playState = state
            }
            )
        }
        , 1500),
        "BUFFERING" === state && swf.broadcast && swf.broadcast.userId != swf.currentSession.userId && $rootScope.$evalAsync(function() {
            swf.loadingBroadcasterState = "NEXT",
            !swf.settingUpBroadcast && swf.oldTfl && (swf.broadcast.tfl = swf.oldTfl),
            swf.settingUpBroadcast || (swf.currentSession.isBroadcasting = !1)
        }
        ),
        ("PLAYING" == state || swf.broadcast && swf.broadcast.userId == swf.currentSession.userId) && $timeout(function() {
            swf.loadingBroadcasterState = !1,
            swf.sharePanelOpen = !1
        }
        , 1500),
        "RECONNECT" === state && $rootScope.$evalAsync(function() {
            swf.loadingBroadcasterState = "RECONNECT",
            swf.playState = state
        }
        )
    }
    ,
    app.shareBroadcast = function(type, broadcastId) {
        swf.getShareData(type, broadcastId, !1, !0).then(function(data) {
            Api.openSharePopup(data)
        }
        )
    }
    ,
    app.exceptionHandler = function(stackTrace) {
        $window.Bugsnag.metaData = {
            lastApiStack: $window.bugsnagAdditionalParams.lastApiStackObject,
            lastClickStack: $window.bugsnagAdditionalParams.lastClickStackObject
        },
        stackTrace.split && (stackTrace = stackTrace.split("at ").join("\n at ")),
        Api.trackError("FlashError: " + stackTrace)
    }
    ,
    app.loadNextChannel = function() {
        swf.loadNextChannel(swf.broadcast)
    }
    ,
    app.sendSnapshot = function(image, delayed) {
        return image.snapshot && (image = image.snapshot),
        delayed && image ? Api.post("broadcast/uploadThumb", {
            userId: swf.currentSession.userId,
            channelId: swf.currentSession.userId,
            image: image
        }) : (eventbus.notifySubscribers("swf:snapshot", image),
        void (swf.snapshot = {
            snapshot: image
        }))
    }
    ,
    $window.openTweetWin = function(twitterHandle) {
        var url = "http://twitter.com/intent/user?d=0&screen_name=" + twitterHandle;
        Api.openPopup("Twitter", url)
    }
    ,
    $window.openFacebookFriend = function(fbId) {
        if (swf.broadcast && swf.broadcast.user && 1 == swf.broadcast.user.facebookOption) {
            var url = swf.broadcast.user.facebookUrl;
            "http" != url.substr(0, 4) && (url = "http://" + url),
            $window.open(url, "_blank")
        } else
            window.FB.ui({
                method: "friends",
                display: "iframe",
                id: fbId
            })
    }
    ,
    $window.openYoutubeSubscribe = function(username) {
        $modal.youtube(username)
    }
    ;
    var randomQueuePercentage, readyStateEvents = ["onPusherEvent", "goLive", "setMute"], queue = {
        init: {},
        ready: {}
    }, nextQueuePosition = !1, resolveQueue = function(type) {
        angular.forEach(queue[type], function(params, method) {
            swf.invokeSwfMethod(method, params)
        }
        ),
        queue[type] = {}
    }
    , loadFeaturedBroadcast = function() {
        Api.get("younow/featured", {
            locale: config.preferredLocale
        }).then(function(response) {
            if ("onBroadcastPlay" === response.data.state)
                Api.customPlayData(response.data),
                app.loadChannel({
                    channelId: response.data.userId
                });
            else {
                if (void 0 === response.data.state)
                    return !1;
                swf.loadNextChannel(response.data)
            }
        }
        )
    }
    ;
    swf.available = function() {
        return swf.object = document.getElementById("flashObj1"),
        swf.object ? !0 : (swf.init = !1,
        swf.ready = !1,
        !1)
    }
    ,
    swf.invokeSwfMethod = function(method, params) {
        debug.console(["SWF", "INVOKE"], {
            method: method,
            params: params
        }),
        "cancelBroadcast" === method && $rootScope.gaEvent("Go Live", "Broadcast cancelled", config.preferredLocale, (new Date).getTime() - bcSetupTime.goLive);
        var readyType = -1 === readyStateEvents.indexOf(method) ? "init" : "ready";
        if (swf[readyType] && swf.available()) {
            params = "string" != typeof params ? JSON.stringify(params) : params;
            try {
                if (swf.object[method])
                    return params || params === !1 ? swf.object[method](params) : swf.object[method]()
            } catch (err) {
                console.warn(method, params, err)
            }
        } else
            queue[readyType][method] = params
    }
    ,
    swf.onPusherEvent = function(pusherEvent, pusherData) {
        debug.console(["SWF", "PUSHER"], {
            pusherEvent: pusherEvent,
            pusherData: pusherData
        });
        var data = ({
            pusherEvent: pusherEvent,
            channelId: pusherData.channelId,
            pusherData: JSON.stringify(pusherData)
        },
        pusherData && pusherData.message ? pusherData.message : null );
        if (swf.settingUpBroadcast)
            return !1;
        if ("onViewers" === pusherEvent && data && (dashboard.syncCurrentViewers(data),
        swf.broadcast.viewers = Api.squashedNumber(data.viewers, 4)),
        ("onLikes" === pusherEvent || "onViewers" === pusherEvent && data) && (swf.broadcast.likes = Api.squashedNumber(data.likes, 5),
        swf.broadcast.likePercent = data.likePercent),
        "onBroadcastPlay" === pusherEvent && data && (swf.broadcast.subscribersCount = data.subscribersCount,
        1 == data.chatMode && data.chatMode != swf.broadcast.chatMode && Api.showTopNotification("Subscriber-only chat mode activated", "success"),
        swf.broadcast.chatMode = data.chatMode,
        $timeout.cancel(swf.broadcast.quality_timeout),
        swf.broadcast.quality = data.quality,
        swf.broadcast.quality_timeout = $timeout(function() {
            swf.broadcast.quality = {
                percentage: 0,
                desc: "low"
            }
        }
        , 15e3),
        swf.eob && data.channelId != swf.currentSession.userId && delete swf.eob,
        data.length && swf.broadcast && swf.broadcast.length !== data.length && (swf.broadcast.length = data.length),
        swf.broadcast && !swf.broadcast.media && data.media && (swf.broadcast.media = data.media,
        swf.invokeSwfMethod("changeChannel", swf.broadcast),
        swf.loadingBroadcasterState = !1,
        swf.playState = "PLAYING"),
        data.shares && data.shares >= swf.broadcast.shares && (swf.broadcast.shares = data.shares),
        data.queues && (swf.queue = data.queues[0].items),
        swf.stickersMultiplier = data.stickersMultiplier,
        swf.dynamicPricedGoodies = data.dynamicPricedGoodies,
        data.length && 0 === swf.broadcast.length && (swf.broadcast.length = data.length),
        Math.abs(data.length - swf.broadcast.length) > 10 && (swf.broadcast.length = data.length)),
        "onBroadcastDisconnect" === pusherEvent && swf.broadcast.userId == swf.currentSession.userId && data && swf.invokeSwfMethod("startBroadcast", data.media),
        "onBroadcastEnd" === pusherEvent || "onBroadcastCancel" === pusherEvent && data) {
            if (dashboard.users && dashboard.filterTrending(swf.broadcast.userId),
            swf.broadcast.userId == swf.currentSession.userId)
                return swf.currentSession.isBroadcasting = !1,
                swf.resetBroadcast(!1, !1, !0),
                swf.currentSession.isBroadcasting = !1,
                data.eob ? swf.eob || swf.settingUpBroadcast || (swf.eob = data.eob,
                swf.eob.duration = $filter("date")(1e3 * swf.broadcast.length, "mm:ss"),
                swf.broadcast.length >= 3600 && (swf.eob.duration = Math.floor(swf.broadcast.length / 3600) + ":" + swf.eob.duration),
                swf.eob.gifts.length > 0 && (swf.eob.giftsTotal = JSON.parse(swf.eob.gifts).length),
                swf.eob.endLevel > 0 ? swf.eob.progress = angular.copy((Math.floor(100 * swf.eob.endLevel) / 100).toFixed(2)) : swf.eob.progress = angular.copy((Math.floor(100 * swf.eob.startLevel) / 100).toFixed(2)),
                swf.eob.progress = (swf.eob.progress + "").split(".")[1],
                swf.eob.nextLevel = swf.eob.endLevel ? Math.floor(angular.copy(swf.eob.endLevel)) + 1 : Math.floor(angular.copy(swf.eob.startLevel)) + 1,
                swf.eob.startLevel = Number(swf.eob.startLevel.toFixed(2)),
                swf.eob.endLevel = Number(swf.eob.endLevel.toFixed(2)) - swf.eob.startLevel,
                $timeout(function() {
                    swf.eob && (swf.eob.visible = !0)
                }
                , 500),
                eventbus.notifySubscribers("user:update", {
                    progress: Number(swf.eob.progress),
                    level: swf.eob.nextLevel - 1
                })) : swf.loadNextChannel(data),
                swf.invokeSwfMethod("endBroadcast"),
                !1;
            "PREV" !== swf.loadingBroadcasterState && swf.broadcast.userId != swf.currentSession.userId && swf.loadNextChannel(data)
        }
        if ("onChat" === pusherEvent && data && null  !== data.comments) {
            var comments = [];
            swf.broadcast.comments || (swf.broadcast.comments = []);
            for (var i = 0; i < data.comments.length; i++) {
                if (data.comments[i].loc && config.preferredLocale !== data.comments[i].loc && "ww" !== config.preferredLocale)
                    return !1;
                swf.currentSession && data.comments[i].userId !== Number(swf.currentSession.userId) && (data.comments[i].hashedComment = Api.replaceHash(Api.convertEmoji(Api.linkify(Api.stripHTML(data.comments[i].comment)))),
                data.comments[i].userLevelFloor = Math.floor(data.comments[i].userLevel),
                data.comments[i].giftId = !1,
                data.comments[i].isBroadcaster = swf.broadcast.userId == data.comments[i].userId ? !0 : !1,
                comments.push(data.comments[i]))
            }
            swf.broadcast.comments = swf.broadcast.comments.concat(comments)
        }
        if ("onFanMailRequest" === pusherEvent && data && (data.isShowing = !0,
        swf.fanMailRequestQueue || (swf.fanMailRequestQueue = []),
        swf.fanMailRequestQueue.push(data)),
        "onGift" === pusherEvent && data) {
            for (var gifts = [], a = 0; a < data.gifts.length; a++)
                if (data.gifts[a] && (data.gifts[a].userId !== Number(swf.currentSession.userId) || 2 == data.gifts[a].mode))
                    if (data.gifts[a].userLevelFloor = Math.floor(data.gifts[a].userLevel),
                    2 == data.gifts[a].mode)
                        swf.giftOverlayQueue.push(data.gifts[a]);
                    else if (3 == data.gifts[a].mode && swf.currentSession.userId != swf.broadcast.userId)
                        swf.addToFanMailQueue(data.gifts[a]);
                    else {
                        if (3 == data.gifts[a].mode)
                            return !1;
                        gifts.push(data.gifts[a])
                    }
            swf.broadcast.comments = swf.broadcast.comments.concat(gifts)
        }
        "onSystemMessage" !== pusherEvent && "onFanMailReject" !== pusherEvent || "onBan" === pusherEvent || "onSuspend" === pusherEvent || !data || ("onFanMailReject" === pusherEvent && (data.web = data.copy,
        data.webTime = 10,
        data.vault && data.vault.webBars && (swf.barsRefund = data.vault.webBars)),
        swf.systemMessagesQueue.push(data)),
        "onTopFanChange" === pusherEvent && data && (checkIfTopFan(data.tfl),
        swf.broadcast.tfl = prepareTopFans(data.tfl))
    }
    ;
    var checkIfTopFan = function(fans) {
        if (swf.isTopFan = !1,
        swf.currentSession && swf.currentSession.userId)
            for (var i = 0; i < fans.length; i++)
                fans[i].uId == swf.currentSession.userId && (swf.isTopFan = !0)
    }
      , prepareTopFans = function(fans) {
        for (var i = 0; i < fans.length; i++)
            fans[i].b = Api.squashedNumber(fans[i].b, 9);
        return fans
    }
    ;
    swf.newBroadcaster = function(broadcaster, goingLive) {
        debug.console(["SWF", "BROADCAST"], "New Broadcaster " + broadcaster.broadcastId),
        swf.broadcast = broadcaster,
        "onBroadcastWait" === broadcaster.state || swf.settingUpBroadcast || swf.invokeSwfMethod("changeChannel", broadcaster),
        "onBroadcastWait" === broadcaster.state && (swf.playState = "BUFFERING",
        swf.loadingBroadcasterState = "WAITING",
        swf.broadcast.state = "onBroadcastPlay"),
        swf.activeChatTab = "Chat",
        swf.broadcast.viewers = Api.squashedNumber(swf.broadcast.viewers, 4),
        swf.broadcast.likes = Api.squashedNumber(swf.broadcast.likes, 5),
        swf.broadcast.tfl = prepareTopFans(swf.broadcast.tfl),
        checkIfTopFan(swf.broadcast.tfl),
        swf.audienceLists = {},
        swf.giftOverlayQueue = [],
        swf.systemMessagesQueue = [],
        swf.fanMailQueue = [],
        swf.audienceLists.prevLoadedPage = 0,
        swf.settingUpBroadcast = !1,
        swf.broadcast.shareCount = {};
        for (var i = 0; i < swf.broadcast.comments.length; i++)
            swf.broadcast.comments[i].hashedComment = Api.replaceHash(Api.convertEmoji(Api.linkify(Api.stripHTML(swf.broadcast.comments[i].comment)))),
            swf.broadcast.comments[i].userLevelFloor = Math.floor(swf.broadcast.comments[i].userLevel),
            swf.broadcast.comments[i].giftId = !1;
        swf.currentSession && broadcaster.user.userId === swf.currentSession.userId && $rootScope.gaEvent("Go Live", "Broadcast Start", config.preferredLocale, (new Date).getTime() - bcSetupTime.goLive),
        goingLive ? (swf.goLive(),
        swf.invokeSwfMethod("goLive")) : eventbus.notifySubscribers("swf:reset")
    }
    ,
    swf.systemMessagesQueue = [],
    swf.showTutorial = function() {
        swf.invokeSwfMethod("showTutorial")
    }
    ,
    swf.notifyLogin = function(sessionData) {
        swf.broadcast && swf.broadcast.tfl && checkIfTopFan(swf.broadcast.tfl)
    }
    ,
    swf.notifyLogout = function() {
        swf.loggedIn = !1,
        swf.currentSession = void 0,
        swf.invokeSwfMethod("notifyLogout"),
        eventbus.notifySubscribers("swf:reset")
    }
    ,
    swf.sendKeepSession = function(sessionData) {
        swf.currentSession = sessionData
    }
    ,
    swf.goLive = function() {
        bcSetupTime.goLive = (new Date).getTime(),
        $rootScope.gaEvent("Go Live", "Broadcast Init", config.preferredLocale),
        swf.resetBroadcast(!0),
        eventbus.notifySubscribers("swf:reset"),
        swf.bootingFlash = !1,
        -1 != navigator.userAgent.indexOf("Safari") && -1 == navigator.userAgent.indexOf("Chrome") && $modal.alert('Please Note: Safari is not currently fully compatible with YouNow broadcasting. </br> We highly recommend you broadcast from <a href="https://www.google.com/chrome/browser/" target="_blank">Chrome</a> or <a href="https://www.mozilla.org/en-US/firefox/new/" target="_blank">Firefox</a>.')
    }
    ,
    swf.getSnapshot = function() {
        swf.invokeSwfMethod("getSnapshot", !1),
        swf.activeChatTab = "Snapshot";
        var bitwiseMap = Api.convertBitwise(swf.broadcast.broadcastShared, 6);
        "object" != typeof swf.broadcast.shared && (swf.broadcast.shared = {}),
        swf.broadcast.shared = {
            younow: swf.broadcast.shared.younow ? swf.broadcast.shared.younow : bitwiseMap[0],
            twitter: swf.broadcast.shared.twitter ? swf.broadcast.shared.twitter : bitwiseMap[1],
            facebook: swf.broadcast.shared.facebook ? swf.broadcast.shared.facebook : bitwiseMap[2],
            instagram: swf.broadcast.shared.instagram ? swf.broadcast.shared.instagram : bitwiseMap[3],
            tumbler: swf.broadcast.shared.tumbler ? swf.broadcast.shared.tumblr : bitwiseMap[4],
            other: swf.broadcast.shared.other ? swf.broadcast.shared.other : bitwiseMap[5]
        }
    }
    ,
    swf.setVolume = function(volume, save) {
        swf.volume = volume,
        swf.invokeSwfMethod("setVolume", swf.volume),
        window.sessionStorage && save && window.sessionStorage.setItem("younowVol", swf.volume)
    }
    ,
    swf.toggleMute = function() {
        swf.setVolume(0 === swf.volume ? 100 : 0, !0),
        setMiniPlayerVolume()
    }
    ;
    var setMiniPlayerVolume = function() {
        jwplayer("playeroniBsrErLcZk").setVolume(swf.volume)
    }
    ;
    return swf.setGain = function(gain) {
        swf.gain = gain,
        swf.invokeSwfMethod("setGain", swf.gain)
    }
    ,
    swf.Comment = function(comment, name, userId, userLevel, role, giftId, quantity, subscriptionType) {
        this.comment = comment,
        this.name = name,
        this.role = role,
        this.userLevelFloor = Math.floor(userLevel),
        this.userLevel = userLevel,
        this.userId = userId,
        this.giftId = giftId,
        this.subscriptionType = subscriptionType,
        this.quantity = quantity,
        this.isBroadcaster = swf.broadcast.userId == userId ? !0 : !1
    }
    ,
    swf.postChatComment = function(newComment, userId, channelId) {
        return Api.post("broadcast/chat", {
            userId: userId,
            channelId: channelId,
            comment: newComment
        })
    }
    ,
    swf.postGift = function(userId, channelId, giftId, quantity, Filedata, targetNetwork) {
        var giftParams = {
            userId: userId,
            channelId: channelId,
            giftId: giftId,
            quantity: quantity
        };
        return void 0 !== Filedata && void 0 !== targetNetwork && (giftParams.Filedata = Filedata,
        giftParams.targetNetwork = targetNetwork),
        Api.post("broadcast/gift", giftParams)
    }
    ,
    swf.getAudience = function(startPage, numOfRecords, isRefresh) {
        var params, userId = void 0 === swf.currentSession ? 0 : swf.currentSession.userId, useCDN = !0;
        swf.broadcast.userId === userId ? (params = {
            broadcaster: 1,
            channelId: swf.broadcast.userId,
            numOfRecords: numOfRecords,
            start: startPage,
            userId: userId
        },
        useCDN = !1) : params = {
            channelId: swf.broadcast.userId,
            numOfRecords: numOfRecords,
            start: startPage
        },
        swf.audienceLists.prevLoadedPage = startPage,
        Api.get("broadcast/audience", params, useCDN).then(function(response) {
            if (0 === response.data.errorCode) {
                swf.audienceLists.pages || (swf.audienceLists.pages = [],
                swf.audienceLists.currentDate = new Date,
                swf.audienceLists.currentPage = 0);
                for (var x = 0; x < response.data.audience.length; x++)
                    response.data.audience[x].subscriptionDate = response.data.audience[x].subscriptionDate.split("-"),
                    response.data.audience[x].subscriptionDate.length > 1 && (response.data.audience[x].subscriptionDateUNIX = new Date(response.data.audience[x].subscriptionDate[0],response.data.audience[x].subscriptionDate[1] - 1,response.data.audience[x].subscriptionDate[2]).getTime());
                if (swf.broadcast.userId === userId)
                    for (var i = 0; i < response.data.audience.length; i++) {
                        response.data.audience[i].fanDate = response.data.audience[i].fanDate.split("-"),
                        response.data.audience[i].fanDateUNIX = new Date(response.data.audience[i].fanDate[0],response.data.audience[i].fanDate[1] - 1,response.data.audience[i].fanDate[2]).getTime();
                        var currentBirthday = response.data.audience[i].birthday.split("-");
                        response.data.audience[i].birthdayJSO = new Date(swf.audienceLists.currentDate.getFullYear(),currentBirthday[1] - 1,currentBirthday[2]),
                        response.data.audience[i].daysUntilBirthday = Math.ceil(Math.abs(swf.audienceLists.currentDate.getTime() - response.data.audience[i].birthdayJSO.getTime()) / 864e5),
                        response.data.audience[i].birthdayJSO.getMonth() === swf.audienceLists.currentDate.getMonth() ? (1 === response.data.audience[i].daysUntilBirthday && (response.data.audience[i].birthdayCopy = "Birthday today!"),
                        response.data.audience[i].daysUntilBirthday > 1 && response.data.audience[i].daysUntilBirthday < 8 && (response.data.audience[i].birthdayCopy = "Birthday this week!"),
                        response.data.audience[i].daysUntilBirthday >= 8 && response.data.audience[i].daysUntilBirthday < 31 && (response.data.audience[i].birthdayCopy = "Birthday this month!")) : response.data.audience[i].daysUntilBirthday = 0
                    }
                0 === swf.audienceLists.pages.length && void 0 === swf.audienceLists.timer ? (swf.audienceLists.pages.push(response.data),
                swf.startAudienceRefresh(swf.audienceLists.nextRefresh),
                swf.audienceLists.currentPage = 0) : isRefresh === !0 ? (swf.audienceLists.pages[startPage] = response.data,
                swf.audienceLists.timer = 0) : (response.data.scrollRefreshCooldown = 0,
                swf.audienceLists.pages.push(response.data)),
                swf.audienceLists.hasNext = response.data.hasNext,
                swf.audienceLists.nextRefresh = response.data.nextRefresh || 30
            }
        }
        )
    }
    ,
    swf.startAudienceRefresh = function(time) {
        swf.refresh && ($interval.cancel(swf.refresh),
        swf.refresh = void 0),
        swf.refresh || (swf.refresh = $interval(function() {
            "Audience" === swf.activeChatTab && (swf.audienceLists.timer || (swf.audienceLists.timer = 0),
            0 === swf.audienceLists.currentPage && swf.audienceLists.timer++,
            swf.audienceLists.timer === swf.audienceLists.nextRefresh && (swf.getAudience(swf.audienceLists.currentPage, 20, !0),
            swf.audienceLists.timer = 0))
        }
        , 1e3))
    }
    ,
    swf.addToFanMailQueue = function(gift) {
        gift.isShowing = !0,
        swf.fanMailQueue.push(gift)
    }
    ,
    $interval(function() {
        !swf.fanMailTimer && swf.fanMailQueue && (1 === swf.fanMailQueue.length ? swf.fanMailDisplay(swf.giftObjects.FANMAIL.maxVis) : swf.fanMailQueue.length > 1 && swf.fanMailDisplay(swf.giftObjects.FANMAIL.minVis))
    }
    , 1e3),
    swf.fanMailDisplay = function(time) {
        swf.fanMailTimer = $timeout(function() {
            swf.fanMailQueue.length > 0 && (swf.fanMailQueue[0].isShowing = !1)
        }
        , time - 1e3).then(function(response) {
            $timeout(function() {
                swf.fanMailTimer = !1,
                swf.fanMailQueue.splice(0, 1)
            }
            , 1e3)
        }
        )
    }
    ,
    swf.resetBroadcast = function(settingUp, cancelled, EOB) {
        return swf.fanMailRequestQueue = [],
        swf.systemMessagesQueue = [],
        swf.giftOverlayQueue = [],
        swf.fanMailQueue = [],
        swf.activeChatTab = "Chat",
        swf.settingUpBroadcast = settingUp,
        swf.loadingBroadcasterState = !1,
        swf.activeChatTab = "Chat",
        swf.snapshot = void 0,
        EOB || void 0 === swf.eob || (swf.eob.visible = !1),
        swf.broadcast && cancelled ? (swf.oldTfl = swf.broadcast.tfl,
        swf.oldTfl = [],
        !1) : void (swf.broadcast && (swf.broadcast.tfl = [],
        swf.broadcast.comments = [],
        swf.broadcast.shares = 0,
        swf.broadcast.likes = 0,
        swf.broadcast.viewers = 0))
    }
    ,
    swf.loadNextChannel = function(data) {
        swf.loadingBroadcasterState = "PREV",
        debug.console(["SWF", "BROADCAST"], "load next broadcast");
        var queueDist = config.settings.BroadcastEndQueueDistribution;
        if ("number" == typeof queueDist && (queueDist = [queueDist]),
        swf.queue && swf.queue.length > 0)
            for (var b = 0; b < swf.queue.length; b++)
                swf.queue[b].broadcastId == data.broadcastId && swf.queue.splice(b, 1);
        if (swf.broadcast.contestTag)
            return app.loadChannel({
                channelId: swf.queue[0].userId
            }),
            !1;
        if (!swf.queue || swf.queue && 0 === swf.queue.length)
            return loadFeaturedBroadcast(),
            !1;
        if (randomQueuePercentage = Math.floor(99 * Math.random() + 1),
        queueDist.length > 0)
            for (var c = 0; c < queueDist.length; c++)
                randomQueuePercentage >= Number(queueDist[c]) && nextQueuePosition === !1 && (nextQueuePosition = c),
                c === queueDist.length && nextQueuePosition === !1 && (nextQueuePosition = c);
        else
            nextQueuePosition = 0;
        void 0 === swf.queue[nextQueuePosition] && (nextQueuePosition = 0),
        swf.queue[nextQueuePosition] && swf.queue[nextQueuePosition].userId ? Api.get("broadcast/info", {
            channelId: swf.queue[nextQueuePosition].userId,
            curId: 0 | swf.broadcast.userId
        }).then(function(response) {
            response.data = Api.channelFormat(response.data),
            "onBroadcastPlay" === response.data.state ? (Api.customPlayData(response.data),
            app.loadChannel({
                channelId: swf.queue[nextQueuePosition].userId
            }),
            nextQueuePosition = !1) : (swf.loadNextChannel(response.data),
            nextQueuePosition = !1)
        }
        ) : loadFeaturedBroadcast()
    }
    ,
    swf.getShareData = function(source, entityId, isSnapshot, goingLive) {
        var defer = $q.defer()
          , broadcaster = entityId && !isSnapshot ? swf.currentSession : swf.broadcast.user
          , data = {
            entityType: isSnapshot ? "s" : "b",
            entityId: entityId ? entityId : swf.broadcast.broadcastId,
            entityUserId: broadcaster.userId,
            userId: swf.currentSession ? swf.currentSession.userId : 0,
            feature: isSnapshot ? "SNAPSHOT" : "PROMOTE",
            source: source.toUpperCase()
        };
        data.profileUrlString = entityId ? swf.currentSession.profile : swf.broadcast.profile,
        data.inviteStr = swf.broadcast.userId;
        var sourcePrefix = goingLive ? 102 : isSnapshot ? 105 : 103;
        return data.srcId = "FACEBOOK" == data.source ? sourcePrefix + "2" : sourcePrefix + "1",
        data.url = Api.buildShareUrl(data),
        swf.currentSession && swf.currentSession.userId === data.entityUserId && (data.broadcaster = 1),
        ("FACEBOOK" == data.source || "TWITTER" == data.source) && (data.name = "TWITTER" == data.source && broadcaster.twitterHandle ? "@" + broadcaster.twitterHandle : swf.broadcast.user.firstName,
        data.copy = Api.buildShareCopy(data)),
        defer.resolve(data),
        defer.promise
    }
    ,
    swf
}
]),
angular.module("younow.services.tracking-pixel", []).factory("trackingPixel", ["$interval", "$state", "$http", "$timeout", "$exceptionHandler", "config", "Api", "broadcasterService", "session", "swf", "debug", function($interval, $state, $http, $timeout, $exceptionHandler, config, Api, broadcasterService, session, swf, debug) {
    function isNotOnMainRoute() {
        return "main.settings" !== $state.current.name && "home" !== $state.current.name && "about" !== $state.current.name && "policy" !== $state.current.name && "main.explore" !== $state.current.name && "lockout" !== $state.current.name && "/jobs" !== $state.current.name && "info" !== $state.current.name && "/partners" !== $state.current.name && "/partners/earnings" !== $state.current.name
    }
    function generateTrackingId() {
        for (var text = "", possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", i = 0; 10 > i; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text
    }
    function checkTrpxSession() {
        var lastTrpxSessionTime = Api.store("trpxTime")
          , currentTime = (new Date).getTime();
        lastTrpxSessionTime && null  !== Api.store("trpxId") || Api.store("trpxId", generateTrackingId()),
        lastTrpxSessionTime && currentTime - lastTrpxSessionTime > 18e5 && Api.store("trpxId", generateTrackingId())
    }
    function formatParams(params) {
        var result = {};
        for (var param in params)
            result[paramsMap[param]] = params[param];
        return result
    }
    function initPing() {
        Api.isPageHidden() && !trackingPixel.pageWasHidden && (trackingPixel.pageWasHidden = !0),
        Api.isPageHidden() && trackingPixel.capture({
            event: "INACTIVE_PING",
            extradata: trackingPixel.getUserLocation()
        }),
        Api.isPageHidden() || (trackingPixel.pageWasHidden && (trackingPixel.pageWasHidden = !1),
        Api.store("trpxTime", (new Date).getTime()),
        trackingPixel.capture({
            event: "PING",
            extradata: trackingPixel.getUserLocation()
        }))
    }
    var trackingPixel = {}
      , paramsMap = {
        host: 0,
        event: 1,
        dateday: 2,
        userid: 3,
        session: 4,
        broadcastid: 5,
        doorid: 6,
        userlevel: 7,
        broadcastscount: 8,
        unspentcoins: 9,
        usertype: 10,
        extradata: 11,
        coins: 12,
        points: 13,
        platform: 14,
        sourceid: 15,
        domain: 16,
        pixel: 17
    };
    return Api.store("trpx_device_id") || Api.store("trpx_device_id", generateTrackingId()),
    trackingPixel.startPinging = function() {
        config.init.then(function() {
            $timeout(function() {
                checkTrpxSession(),
                initPing()
            }
            , 1e3),
            Api.poll(initPing, "pingPoll", config.settings.PingInterval)
        }
        )
    }
    ,
    trackingPixel.getUserLocation = function() {
        var location;
        return "main.settings" === $state.current.name && (location = "SETTINGS"),
        "home" === $state.current.name && (location = "HOME"),
        "about" === $state.current.name && (location = "ABOUT"),
        "policy" === $state.current.name && (location = "POLICY"),
        "main.explore" === $state.current.name && (location = $state.params.tag && $state.params.tag.length > 0 ? "TAG" : $state.params.q ? "SEARCH" : "EXPLORE"),
        "lockout" === $state.current.name && (location = "LOCKOUT"),
        "/jobs" === $state.current.name && (location = "JOBS"),
        "info" === $state.current.name && (location = "INFO"),
        ("/partners" === $state.current.name || "/partners/earnings" === $state.current.name) && (location = "PARTNERS"),
        swf.settingUpBroadcast && isNotOnMainRoute() && (location = "BRDCST_SETUP"),
        session.user && session.user.isBroadcasting && !swf.settingUpBroadcast && isNotOnMainRoute() && (location = "LIVE"),
        swf.broadcast && (!session.user || session.user && !session.user.isBroadcasting) && !swf.settingUpBroadcast && isNotOnMainRoute() && (location = "BRDCST"),
        broadcasterService.async && isNotOnMainRoute() && (location = trackingPixel.archiveActive ? "ARCHIVE" : "PROFILE"),
        location
    }
    ,
    trackingPixel.capture = function(params) {
        var location = trackingPixel.getUserLocation()
          , viewers = ""
          , defaultParams = {
            host: config.settings.TrackingHost,
            session: Api.store("trpxId"),
            platform: 3,
            domain: Api.store("trpx_device_id"),
            pixel: config.settings.TrackingPxl
        };
        return "Explore" === location && broadcasterService.exploreBroadcaster && (defaultParams.broadcastid = broadcasterService.exploreBroadcaster.broadcastId,
        defaultParams.doorid = broadcasterService.exploreBroadcaster.user.userId,
        viewers = broadcasterService.exploreBroadcaster.viewers || ""),
        broadcasterService.broadcaster && broadcasterService.broadcaster.user && broadcasterService.broadcaster.broadcastId && isNotOnMainRoute() && !swf.settingUpBroadcast && (defaultParams.broadcastid = broadcasterService.broadcaster.broadcastId,
        defaultParams.doorid = broadcasterService.broadcaster.user.userId,
        viewers = broadcasterService.broadcaster.viewers || ""),
        viewers && (viewers.replace ? defaultParams.coins = viewers.replace(",", "") : defaultParams.coins = viewers.toString()),
        broadcasterService.channel && broadcasterService.channel.channelId && "PROFILE" === location && !params[6] && (defaultParams.doorid = broadcasterService.channel.channelId),
        session.user && session.user.userId > 0 ? (defaultParams.userid = session.user.userId,
        defaultParams.userlevel = session.user.level,
        defaultParams.broadcastscount = session.user.broadcastsCount,
        isNaN(Number(session.user.userCoins)) ? $exceptionHandler("session.user.userCoins is not defined") : defaultParams.unspentcoins = Math.round(Number(session.user.userCoins)),
        broadcasterService.broadcaster && broadcasterService.broadcaster.userId && (defaultParams.usertype = broadcasterService.broadcaster.userId === session.user.userId ? 2 : 1)) : defaultParams.userid = 0,
        debug.console(["TRPX", params.event], angular.extend(defaultParams, params)),
        params = angular.extend(formatParams(defaultParams), formatParams(params)),
        $http.get(Api.buildPixelTracking(params))
    }
    ,
    trackingPixel.trackBroadcastViewtime = function(eventChannel) {
        if (broadcasterService.viewtimeSeconds > 0) {
            var howUserArrived = broadcasterService.channelSwitch || "OTHER"
              , seconds = broadcasterService.viewtimeSeconds;
            return broadcasterService.viewtimeSeconds = 0,
            trackingPixel.capture({
                event: "VIEWTIME",
                points: seconds,
                extradata: howUserArrived
            })
        }
    }
    ,
    window.onfocus = function() {
        checkTrpxSession()
    }
    ,
    trackingPixel
}
]),
angular.module("younow.services.debugger", []).factory("debug", ["config", function(config) {
    function noDuplicates(a) {
        return a.sort().filter(function(item, pos, ary) {
            return !pos || item != ary[pos - 1]
        }
        )
    }
    function isTypeFound(types, type) {
        var i = 0;
        for (i; i < types.length; i++)
            if (-1 === type.indexOf(types[i]))
                return !1;
        return !0
    }
    var debug = {}
      , types = []
      , devTypes = [];
    return config.params.debug && (types = types.concat(config.params.debug.split(" "))),
    debug.enabled = !1,
    debug.console = function(type, content) {
        debug.enabled && (isTypeFound(types, type) || -1 !== types.indexOf("all")) && (console.trace(),
        console.log(type, content))
    }
    ,
    debug.enableFor = function(type) {
        debug.enabled || (debug.enabled = !0),
        types.concat(type)
    }
    ,
    -1 !== config.host.indexOf("-") && (types = types.concat(devTypes)),
    config.params.debug && (types = noDuplicates(types),
    debug.enabled = !0,
    debug.console(types, "Init Debugger")),
    "false" == config.params.debug && (debug.enabled = !1),
    debug
}
]),
angular.module("younow.services.utils", []).factory("Api", ["$window", "$http", "$document", "$q", "$sce", "$timeout", "$interval", "$rootScope", "config", "$location", "$filter", "eventbus", function($window, $http, $document, $q, $sce, $timeout, $interval, $rootScope, config, $location, $filter, eventbus) {
    function isHiddenSupported() {
        return "undefined" != typeof (document.hidden || document.msHidden || document.webkitHidden || document.mozHidden)
    }
    function createCookie(key, value, exp) {
        var date = new Date;
        date.setTime(date.getTime() + 24 * exp * 60 * 60 * 1e3);
        var expires = "; expires=" + date.toGMTString();
        document.cookie = key + "=" + value + expires + "; path=/"
    }
    function readCookie(key) {
        for (var nameEQ = key + "=", ca = document.cookie.split(";"), i = 0, max = ca.length; max > i; i++) {
            for (var c = ca[i]; " " === c.charAt(0); )
                c = c.substring(1, c.length);
            if (0 === c.indexOf(nameEQ))
                return c.substring(nameEQ.length, c.length)
        }
        return null 
    }
    function Notification(type, message, id, sticky, time) {
        this.type = type || "danger",
        this.message = Api.trustedHTML(message),
        this.fixed = sticky || !1,
        this.id = id,
        this.group = sticky ? "sticky" : "normal",
        this.time = time || 2700,
        this.active = !0
    }
    var Api = {}
      , silentErrors = [6020, 6023, 6021, 603, 249, 206];
    Api.get = function(method, data, usecdn, secured) {
        var url, base = !usecdn || $window.nonCDN ? config.settings.ServerLocalBaseUrl : config.settings.ServerCDNBaseUrl;
        return url = "http" === method.substr(0, 4) ? method : secured ? config.settings.ServerSecureLocalBaseUrl + "/php/api/" + method : base + "/php/api/" + method,
        data = data ? data : {},
        "www.younow.com" === config.params.host && (data.callback = "JSON_CALLBACK"),
        usecdn && data && (data = Api.sortObject(data)),
        angular.forEach(data, function(value, key) {
            url += "/" + key + "=" + value
        }
        ),
        Api.addToStack(method, "lastApiStack"),
        data.callback ? $http.jsonp(url) : $http.get(url)
    }
    ,
    Api.post = function(method, data, secured) {
        var url, headers;
        if (config.banningMsg && "younow/logout" !== method) {
            Api.showTopNotification("<div>" + config.banningMsg.msgString + '</div><a class="btn btn-confirm" target="_blank" href="' + config.banningMsg.supportBtn.btnAct_web + '">' + config.banningMsg.supportBtn.btnTxt_web + "</a>", "now", !0, void 0);
            var deferred = $q.defer();
            return deferred.reject(),
            deferred.promise
        }
        return "younow/logout" === method && (config.banningMsg = void 0),
        data || (data = {}),
        data.tsi = Api.store("trpxId"),
        data.tdi = Api.store("trpx_device_id"),
        url = "http" === method.substr(0, 4) ? method : secured ? config.settings.ServerSecureLocalBaseUrl + "/php/api/" + method : config.settings.ServerLocalBaseUrl + "/php/api/" + method,
        headers = $window.getSession().user && $window.getSession().user.requestBy ? {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-By": $window.getSession().user.requestBy
        } : {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        Api.addToStack(method, "lastApiStack"),
        $http({
            method: "POST",
            headers: headers,
            data: serialize(data),
            url: url
        }).success(function(data) {
            Api.showError(data)
        }
        )
    }
    ,
    Api.algolia = function(query, restrict, limit, page) {
        limit || (limit = 5),
        page || (page = 0);
        var url = "https://" + config.settings.PeopleSearchAppId + ".algolia.io/1/indexes/" + config.settings.PeopleSearchIndex + "/query"
          , data = {
            params: "query=" + encodeURIComponent(query) + "&hitsPerPage=" + limit + "&page=" + page + "&attributesToHighlight=none"
        };
        return restrict && (data.params += "&restrictSearchableAttributes=" + restrict),
        $http({
            method: "POST",
            headers: {
                "X-Algolia-Application-Id": config.settings.PeopleSearchAppId,
                "X-Algolia-API-Key": config.settings.PeopleSearchApiKey,
                "X-Algolia-TagFilters": config.settings.PeopleSearchSecurityTags
            },
            data: data,
            url: url
        })
    }
    ,
    Api.poll = function(callback, id, delay, defaultDelay) {
        Api.polls || (Api.polls = {}),
        Api.polls[id] && $interval.cancel(Api.polls[id]),
        defaultDelay || (defaultDelay = 30),
        delay || (delay = defaultDelay),
        Api.polls[id] = $interval(function() {
            callback()
        }
        , 1e3 * delay)
    }
    ,
    Api.inject = function(script, id) {
        var scriptLoad = $q.defer()
          , tag = $document[0].createElement("script");
        return tag.type = "text/javascript",
        tag.async = !0,
        tag.id = id,
        tag.src = script,
        angular.element($document[0].getElementsByTagName("head")[0]).append(tag),
        tag.onreadystatechange = tag.onload = function() {
            var state = tag.readyState;
            (!state || /loaded|complete/.test(state)) && scriptLoad.resolve()
        }
        ,
        scriptLoad.promise
    }
    ,
    Api.trustedSrc = function(src) {
        return $sce.trustAsResourceUrl(src)
    }
    ,
    Api.trustedHTML = function(text) {
        return text.$$unwrapTrustedValue ? text : $sce.trustAsHtml(text)
    }
    ;
    var serialize = function(obj) {
        var name, value, fullSubName, subName, subValue, innerObj, i, query = "";
        for (name in obj)
            if (value = obj[name],
            value instanceof Array)
                for (i = 0; i < value.length; ++i)
                    subValue = value[i],
                    fullSubName = name + "[" + i + "]",
                    innerObj = {},
                    innerObj[fullSubName] = subValue,
                    query += serialize(innerObj) + "&";
            else if (value instanceof Object)
                for (subName in value)
                    subValue = value[subName],
                    fullSubName = name + "[" + subName + "]",
                    innerObj = {},
                    innerObj[fullSubName] = subValue,
                    query += serialize(innerObj) + "&";
            else
                void 0 !== value && null  !== value && (query += encodeURIComponent(name) + "=" + encodeURIComponent(value) + "&");
        return query.length ? query.substr(0, query.length - 1) : query
    }
    ;
    Api.buildShareUrl = function(options) {
        var url = "http://" + config.host + "/";
        return options.profileUrlString ? (url += options.profileUrlString + "/",
        options.entityId ? (url += options.entityId + "/",
        options.inviteStr ? (url += options.inviteStr + "/",
        options.srcId ? (url += options.srcId + "/",
        options.entityType ? url += options.entityType + "/" : url) : url) : url) : url) : url
    }
    ,
    Api.buildShareCopy = function(options) {
        var type, placeholders;
        return "TWITTER" == options.source && (type = options.broadcaster ? "PromoteOwnTWTemplates" : "PromoteOtherTWTemplates",
        placeholders = {
            "{broadcastLink}": "",
            "{twitterHandle}": options.name,
            "{broadcaster_facebookFirstName} ": ""
        }),
        "FACEBOOK" == options.source && (type = options.broadcaster ? "PromoteOwnFBTemplates" : "PromoteOtherFBTemplates",
        placeholders = {
            "{broadcaster_facebookFirstName}": options.name
        }),
        randomizedShareCopy(type, placeholders, options.url)
    }
    ;
    var randomizedShareCopy = function(type, placeholders, url) {
        var copy, template = config.settings[type][Math.floor(Math.random() * config.settings[type].length)];
        return copy = "" === template ? url : Api.replacePlaceholders(template, placeholders)
    }
    ;
    Api.openPopup = function(name, url) {
        var opts = "status=1,width=550,height=420,top=" + ($window.innerHeight - 420) / 2 + ",left=" + ($window.innerWidth - 550) / 2;
        url = config.settings.ServerHomeBaseUrl + "redirect.php?url=" + encodeURIComponent(url),
        $window.open(url, name, opts)
    }
    ,
    Api.openSharePopup = function(data) {
        if ("FACEBOOK" === data.source && window.FB.ui({
            method: "feed",
            link: data.url,
            name: data.copy
        }, data.callback),
        "TWITTER" === data.source) {
            var url = "https://twitter.com/intent/tweet?text=" + window.encodeURIComponent(data.copy.replace(/^\s+|\s+$/gm, "")) + "&url=" + window.encodeURIComponent(data.url);
            Api.openPopup("_blank", url)
        }
    }
    ;
    var replaceAllInstances = function(find, replace, str) {
        return str.replace ? str.replace(new RegExp(find,"g"), replace) : ""
    }
    ;
    return Api.replacePlaceholders = function(text, placeholders) {
        return angular.forEach(placeholders, function(replacement, placeholder) {
            text = replaceAllInstances(placeholder, replacement, text)
        }
        ),
        text
    }
    ,
    Api.fullName = function(user) {
        if (!user)
            return "";
        var profile = user.profile || user.profileUrlString
          , useprofile = user.useprofile || user.useProfile;
        return 1 == useprofile ? profile : !user.firstName && user.username ? user.username : (user.firstName || "") + (user.lastName ? " " + user.lastName : "")
    }
    ,
    Api.friendlyName = function(user) {
        return "0" !== user.useprofile ? user.profile : user.firstName
    }
    ,
    Api.cleanLocation = function(data, twopart) {
        return twopart && data.state && !data.city && (data.city = data.state),
        (data.city ? data.city + ", " : "") + (data.state && !twopart ? data.state + " " : "") + data.country
    }
    ,
    Api.replaceMentions = function(post) {
        if (post.mentioned) {
            var mentions = post.mentioned.split(",")
              , placeholders = {};
            angular.forEach(mentions, function(mention) {
                var pieces = mention.split(":");
                placeholders["@" + pieces[0]] = '<a href="profile/' + pieces[1] + '" class="mention">' + pieces[0] + "</a>"
            }
            ),
            post.post = Api.replacePlaceholders(post.post, placeholders)
        }
        return post
    }
    ,
    Api.linksniffer = /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi,
    Api.findLinks = function(text) {
        if (!text)
            return [];
        text = text.replace(/:\/\/www./g, "://"),
        text = text.replace(/www./g, " http://"),
        text = text.replace(/&nbsp;/g, " ");
        var links = [];
        return text.split(/\s+/).map(function(t) {
            t.match(Api.linksniffer) && links.push(t)
        }
        ),
        links
    }
    ,
    Api.linkify = function(text) {
        if (!text)
            return text;
        text.$$unwrapTrustedValue && (text = text.$$unwrapTrustedValue(text));
        var htmlStart = text.indexOf("<")
          , plainText = htmlStart > -1 ? text.substr(0, htmlStart) : text
          , html = htmlStart > -1 ? text.substr(htmlStart) : ""
          , tokens = plainText.split(" ").map(function(t) {
            return t.replace(Api.linksniffer, function(url) {
                var href = "http" !== url.substr(0, 4) ? "http://" + url : url;
                return '<a href="' + href.replace(/("|').*$/g, "") + '" target="_blank" rel="nofollow">' + url.replace(/("|').*$/g, "") + "</a>"
            }
            )
        }
        );
        return tokens.join(" ") + html
    }
    ,
    Api.loadGoogleAds = function(tag) {
        var tags = ["all"];
        tag && tags.unshift(tag),
        Api.googleAdLoaded !== !0 && (Api.googleAdLoaded = !0,
        $timeout(function() {
            $window.googletag ? $window.googletag.cmd.push(function() {
                $window.googletag.defineSlot("/117590336/Feed_panel_ad_unit", [155, 125], "div-gpt-ad-1392148686409-0").addService(googletag.pubads()).setTargeting("younow_tag", tags.join(",")),
                $window.googletag.enableServices(),
                $window.googletag.display("div-gpt-ad-1392148686409-0")
            }
            ) : Api.trackError("Google Ads failed to load")
        }
        , 100))
    }
    ,
    $window.countWatchers = function() {
        for (var elts = document.getElementsByClassName("ng-scope"), watches = [], visited_ids = {}, i = 0; i < elts.length; i++) {
            var scope = angular.element(elts[i]).scope();
            scope.$id in visited_ids || (visited_ids[scope.$id] = !0,
            watches.push.apply(watches, scope.$$watchers))
        }
        return watches.length
    }
    ,
    $window.currentScope = function() {
        return angular.element($window.$0).scope()
    }
    ,
    $window.getService = function(name) {
        return angular.element(document.querySelector(".ng-scope")).injector().get(name)
    }
    ,
    $window.getConfig = function() {
        return $window.getService("config")
    }
    ,
    $window.getSession = function() {
        return $window.getService("session")
    }
    ,
    $window.getUtils = function() {
        return $window.getService("Api")
    }
    ,
    Api.stripHTML = function(text) {
        return text.replace(/<[^>]+>/gm, "")
    }
    ,
    Api.prepareDescription = function(text) {
        return text = Api.linkify(text) || "This profile does not have a description",
        $sce.trustAsHtml(text)
    }
    ,
    Api.showTopNotification = function(message, type, sticky, id, time) {
        $rootScope.notifications || ($rootScope.notifications = {});
        var notification = new Notification(type,message,id,sticky,time);
        $rootScope.notifications[notification.group] = notification,
        sticky || $timeout(function() {
            $rootScope.notifications[notification.group].active = !1
        }
        , notification.time)
    }
    ,
    Api.showTopBanner = function(title, message, cta, ctaLink, type, sticky, id, time) {
        $rootScope.banners || ($rootScope.banners = {});
        var banner = new Notification(type,message,id,sticky,time);
        cta && ctaLink ? banner.message = '<div class="alert-container"><div class="banner-icon"><i class="ynicon ynicon-bc-golive"></i></div><div class="banner-content bordered"><b>' + title + "</b><br/><span>" + message + '</span></div><a class="btn btn-confirm" ng-click="onboardingCTA()" href="' + ctaLink + '">' + cta + "</a></div>" : banner.message = '<div class="alert-container"><div class="banner-icon"><i class="ynicon ynicon-bc-golive"></i></div><div class="banner-content"><b>' + title + "</b><br/><span>" + message + "</span></div></div>",
        $rootScope.banners[banner.group] = banner,
        sticky || $timeout(function() {
            $rootScope.banners[banner.group].active = !1
        }
        , banner.time)
    }
    ,
    Api.closeTopBanner = function(group) {
        $rootScope.banners[group].active = !1
    }
    ,
    Api.closeTopNotification = function(group) {
        $rootScope.notifications[group].active = !1
    }
    ,
    Api.showError = function(data) {
        return data.errorCode && -1 !== silentErrors.indexOf(data.errorCode) ? !1 : (101 === data.errorCode && (eventbus.notifySubscribers("error:loggedout"),
        data.errorMsg = "You have been logged out. Please log in again."),
        void (data.errorCode && data.errorMsg && Api.showTopNotification(data.errorMsg)))
    }
    ,
    Api.trackError = function(message) {
        $window.Bugsnag && $window.Bugsnag.notify(message)
    }
    ,
    Api.returnDeferred = function(deferred, action, response) {
        $timeout(function() {
            "resolve" === action && deferred.resolve(response),
            "reject" === action && deferred.reject(response)
        }
        )
    }
    ,
    Api.convertEmoji = function(string) {
        return string.$$unwrapTrustedValue && (string = string.$$unwrapTrustedValue(string)),
        "string" == typeof string && window.twemoji ? $sce.trustAsHtml(window.twemoji.parse(string)) : $sce.trustAsHtml(string)
    }
    ,
    Api["goto"] = function(path) {
        return path ? ("http" == path.substr(0, 4) && (path = path.slice(path.indexOf(path.split("/")[3]))),
        void $location.path(path)) : !1
    }
    ,
    Api.squashedNumber = function(num, size) {
        if (void 0 === num || null  === num)
            return "";
        var digits = num.toString().length
          , decimals = size == digits - 1 ? 1 : 0;
        return num = digits > size && digits >= 7 ? $filter("number")(num / 1e6, decimals) + "M" : digits > size && digits >= 4 ? $filter("number")(num / 1e3, decimals) + "k" : $filter("number")(num)
    }
    ,
    Api.replaceHash = function(string) {
        return string ? (string.$$unwrapTrustedValue && (string = string.$$unwrapTrustedValue(string)),
        string = string.replace(/(^#[^\W_][\w-]*)|(\s#[^\W_][\w-]*)/g, '<span class="yn-hash">$1 $2</span>'),
        $sce.trustAsHtml(string)) : void 0
    }
    ,
    Api.buildWufooUrl = function(baseUrl, params) {
        if (baseUrl && params) {
            var paramsUrl = [];
            for (var param in params)
                paramsUrl.push(param + "=" + params[param]);
            return paramsUrl = baseUrl + "def/" + paramsUrl.join("&")
        }
        return baseUrl
    }
    ,
    Api.sortObject = function(obj) {
        var keys = []
          , sorted_obj = {};
        for (var key in obj)
            obj.hasOwnProperty(key) && keys.push(key);
        return keys.sort(),
        angular.forEach(keys, function(i, key) {
            sorted_obj[keys[key]] = obj[keys[key]]
        }
        ),
        sorted_obj
    }
    ,
    Api.store = function(key, value) {
        var data, lsSupport = $window.localStorage ? !0 : !1;
        if ("undefined" != typeof value && null  !== value && ("object" == typeof value && (value = JSON.stringify(value)),
        lsSupport ? $window.localStorage.setItem(key, value) : createCookie(key, value, 3650)),
        "undefined" == typeof value) {
            data = lsSupport ? $window.localStorage.getItem(key) : readCookie(key);
            try {
                data = JSON.parse(data)
            } catch (e) {
                data = data
            }
            return data
        }
        null  === value && (lsSupport ? $window.localStorage.removeItem(key) : createCookie(key, "", -1))
    }
    ,
    Api.buildPixelTracking = function(params) {
        for (var url = config.settings.TrackingHost, i = 1; 17 > i; i++)
            url += void 0 !== params[i] ? params[i] + "/" : "/";
        return url + params[17]
    }
    ,
    Api.addToStack = function(data, stackName) {
        $window.bugsnagAdditionalParams && $window.bugsnagAdditionalParams[stackName] && (5 === $window.bugsnagAdditionalParams[stackName].length && $window.bugsnagAdditionalParams[stackName].pop(),
        $window.bugsnagAdditionalParams[stackName].unshift(data),
        $window.bugsnagAdditionalParams[stackName + "Object"] = Api.ArrayToObject($window.bugsnagAdditionalParams[stackName]))
    }
    ,
    Api.ArrayToObject = function(array) {
        var i, newObject = {};
        for (i = 0; i < array.length; ++i)
            newObject[i] = array[i];
        return newObject
    }
    ,
    Api.sortUsers = function(users) {
        return users.sort(function(a, b) {
            return a.status == b.status ? a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1 : a.status < b.status ? 1 : -1
        }
        )
    }
    ,
    Api.isPageHidden = function() {
        return isHiddenSupported ? document.hidden || document.msHidden || document.webkitHidden || document.mozHidden : !0
    }
    ,
    Api.convertBitwise = function(num, maxPositions) {
        for (var binary = num.toString(2).split("").reverse(), booleanArray = [], i = 0; maxPositions > i; i++)
            booleanArray.push(1 == binary[i] ? !0 : !1);
        return booleanArray
    }
    ,
    Api.triggerTooltip = function(el, time) {
        if (time || (time = 2e3),
        el[0] && el[0].outerHTML || "string" == typeof el && (el = angular.element(document.getElementById(el))),
        !el[0] || !el[0].outerHTML)
            throw new Error("Api.triggerTooltip failed! First attribute must be DOM element or ID string.");
        var tooltip = el;
        tooltip && tooltip.triggerHandler && ($timeout(function() {
            tooltip.triggerHandler("show")
        }
        , 0),
        $timeout(function() {
            tooltip.triggerHandler("hide")
        }
        , time))
    }
    ,
    Api.goMobile = function(platform, level, source, activity) {
        var userLevelGrouping;
        0 !== level ? (level >= 1 && 5 >= level && (userLevelGrouping = "low"),
        level >= 6 && 10 >= level && (userLevelGrouping = "med"),
        level >= 11 && (userLevelGrouping = "high")) : userLevelGrouping = "anon",
        activity ? $rootScope.gaEvent("GOMOBILE", platform + source, userLevelGrouping, activity) : $rootScope.gaEvent("GOMOBILE", platform + source, userLevelGrouping)
    }
    ,
    Api.customPlayData = function(data, user) {
        var method;
        return data && data.PlayDataBaseUrl && (config.PlayDataBaseUrlCustom = data.PlayDataBaseUrl),
        method = config.settings.PlayDataOnS3Enabled && !config.PlayDataBaseUrlCustom ? config.settings.PlayDataBaseUrl : config.settings.PlayDataOnS3Enabled && config.PlayDataBaseUrlCustom ? config.PlayDataBaseUrlCustom : "broadcast/playData",
        user ? method + user + ".json" : method
    }
    ,
    Api.regexStore = {
        embedlyWhiteList: new RegExp(/(instagram.com|youtube.com|soundcloud.com|twitter.com)/g)
    },
    Api.channelFormat = function(data) {
        if (data.errorCode)
            return data;
        if (data.user && (data = angular.extend(data, data.user)),
        data.profile = data.profileUrlString = data.profile || data.profileUrlString,
        data.latestSubscriptions && data.totalSubscriptions && (data.latestSubscriptionsPlus = data.totalSubscriptions - data.latestSubscriptions.length || 0),
        data.disabledGoodies) {
            var disabledGoodies = angular.extend(data.disabledGoodies);
            data.disabledGoodies = {};
            for (var goo in disabledGoodies)
                data.disabledGoodies[disabledGoodies[goo]] = !0
        }
        if (data.subscribersCount && (data.subscribersCount = parseInt(data.subscribersCount),
        data.subscribersCount > 0 ? data.subscribersString = data.subscribersCount + " Subscriber" + (1 != data.subscribersCount ? "s" : "") : data.subscribersString = "0 Subscribers"),
        data.latestSubscriptions && Object.keys(data.latestSubscriptions).length > 3) {
            var latestSubscriptions = data.latestSubscriptions
              , latestSubscriptionsAdd = 0;
            data.latestSubscriptions = {};
            var i = 0;
            for (var k in latestSubscriptions)
                5 > i ? data.latestSubscriptions[k] = latestSubscriptions[k] : latestSubscriptionsAdd++,
                i++;
            data.latestSubscriptionsPlus = (data.latestSubscriptionsPlus || 0) + latestSubscriptionsAdd
        }
        return data
    }
    ,
    Api
}
]),
angular.module("younow.about", ["ui.router"]).config(["$stateProvider", function($stateProvider) {
    $stateProvider.state("about", {
        url: "/about",
        templateUrl: "angularjsapp/src/app/states/about/about.tpl.html",
        controller: "AboutCtrl"
    })
}
]).controller("AboutCtrl", ["$scope", "$rootScope", "$window", "$timeout", "$modal", "config", "broadcasterService", "Api", "$state", "session", function($scope, $rootScope, $window, $timeout, $modal, config, broadcasterService, Api, $state, session) {
    broadcasterService.channelSwitch = "ABOUT",
    config.init.then(function() {
        $rootScope.skipAgeGate = !0,
        $scope.base = config.settings.ServerCDNBaseUrl,
        $scope.visible = !0,
        $scope.closed = "none" === config.settings.loginGate || session.loggedIn ? !1 : !0,
        $scope.open = "hard" !== config.settings.loginGate || session.loggedIn ? !0 : !1,
        $scope.closed && $rootScope.gaEvent("Home Page", "Page load", "about"),
        $timeout(function() {
            $scope.loaded = !0
        }
        , 300),
        $window.localStorage.hideYounowLanding = "true",
        $rootScope.$watch(function() {
            return session.loggedIn
        }
        , function(locale) {
            $scope.justLoggedIn || ($scope.closed = "none" === config.settings.loginGate || session.loggedIn ? !1 : !0,
            $scope.open = "hard" !== config.settings.loginGate || session.loggedIn ? !0 : !1)
        }
        ),
        $timeout(function() {
            var myVideo = document.getElementById("video");
            myVideo && ("boolean" == typeof myVideo.loop ? myVideo.loop = !0 : myVideo.addEventListener("timeupdate", function() {
                myVideo.currentTime > 16.5 && myVideo.load()
            }
            , !0))
        }
        )
    }
    ),
    $scope.trustedSrc = function(src) {
        return Api.trustedSrc(src)
    }
    ,
    $scope.login = function(type, position) {
        session.authenticate[type] && ($scope.attemptedLogin || ($scope.attemptedLogin = !0,
        $rootScope.gaEvent("Home Page", "Attempted Login")),
        $rootScope.gaEvent("Home Page", "Clicks " + type, position),
        session.auth(type).then(function(response) {
            if (response && response.data && response.data.id) {
                $scope.justLoggedIn = !0;
                var loginType = response.data.newUser ? "New" : "Returning";
                $rootScope.gaEvent("Home Page", "Logged In (" + loginType + ")"),
                broadcasterService.featuredBroadcaster()
            }
        }
        ))
    }
    ,
    $scope.action = function(action) {
        $scope.closed && $rootScope.gaEvent("Home Page", action)
    }
    ,
    $scope.showPromo = function() {
        return $state.is("about") && $window.navigator.userAgent.search("Chrome/39") > 0 ? ($window.open("https://www.youtube.com/watch?v=BiXDFkraMtY", "_blank"),
        !1) : void $modal.iframe("http://www.youtube.com/embed/BiXDFkraMtY?autoplay=1", "iframe-modal-dark")
    }
    ,
    $scope.watchLiveNow = function(event, label) {
        $scope.aboutClick("To site", label),
        event.preventDefault(),
        $timeout(function() {
            $scope.open && broadcasterService.featuredBroadcaster()
        }
        , 0)
    }
    ,
    $scope.trackMobile = function(platform) {
        Api.goMobile(platform, session.user.level, "_LANDING")
    }
    ,
    $scope.aboutClick = function(action, label) {
        $rootScope.gaEvent("About Page Button Click", action, label)
    }
}
]),
angular.module("younow.home", ["ui.router"]).config(["$stateProvider", function($stateProvider) {
    $stateProvider.state("home", {
        url: "/",
        templateUrl: "angularjsapp/src/app/states/home/home.tpl.html",
        controller: "HomeCtrl",
        controllerAs: "vm"
    }),
    $stateProvider.state("index", {
        url: "/index.php",
        templateUrl: "angularjsapp/src/app/states/home/home.tpl.html",
        controller: "HomeCtrl",
        controllerAs: "vm"
    })
}
]).controller("HomeCtrl", ["$state", "$scope", "$timeout", "$modal", "eventbus", "config", "Api", "dashboard", "session", "$rootScope", function($state, $scope, $timeout, $modal, eventbus, config, Api, dashboard, session, $rootScope) {
    function populateTrendingBroadcasts() {
        dashboard.fetchTrendingBroadcasts().then(function(response) {
            if (response) {
                response = response.splice(0, 8);
                for (var i = 0; i < response.length; i++)
                    response[i].fans && (response[i].totalFans = Api.squashedNumber(response[i].totalFans, 3)),
                    response[i].viewers && (response[i].viewers = Api.squashedNumber(response[i].viewers, 3));
                vm.trendingBroadcasts = response
            }
        }
        )
    }
    function populatePopularTags() {
        Api.get("younow/popularTags", {
            locale: config.preferredLocale
        }, !0).then(function(response) {
            response.data && response.data.popular_tags && (vm.liveTopics = response.data.popular_tags)
        }
        )
    }
    function renderPage() {
        vm.renderPage = !0,
        vm.baseCDN = config.settings.ServerCDNBaseUrl,
        populateTrendingBroadcasts(),
        populatePopularTags(),
        window.waitForPageType = !1,
        $rootScope.gaPage({
            pageType: "home"
        }),
        $rootScope.title = "YouNow | Live Stream Video Chat | Free Apps on Web, iOS and Android"
    }
    var vm = this;
    vm.config = config,
    vm.telInputId = "telInput",
    vm.trustedSrc = function(src) {
        return Api.trustedSrc(src)
    }
    ,
    vm.stateChange = function(state, params, isTrackingExplore) {
        params || (params = {}),
        isTrackingExplore && $rootScope.gaEvent("Conversion", "Go To Explore", "HOME"),
        "main.explore" === state && params.tag && $rootScope.gaEvent("Conversion", "Click Tag", "HOME"),
        state && $state.go(state, params)
    }
    ,
    vm.openLoginModal = function(cta) {
        $modal.loginModal(!1, "HOME-" + cta).result.then(function(response) {
            0 === response.data.errorCode && "main.channel.detail" !== $state.current.name && $state.go("main.channel.detail")
        }
        ),
        "SIGNUP" === cta ? $rootScope.gaEvent("Conversion", "Click Signup", "HOME") : $rootScope.gaEvent("Conversion", "Click Login", "HOME")
    }
    ,
    vm.getTheApp = function() {
        $modal.mobileDownload("HOME")
    }
    ,
    window.isPrerender && renderPage(),
    config.showHomepage && (session.user && 0 === session.user.userId ? renderPage() : $state.go("main.channel.detail")),
    config.showHomepage || eventbus.subscribe("session:loggedIn", function(event, loggedIn) {
        loggedIn || window.localStorage.lastNetwork ? $timeout(function() {
            $state.go("main.channel.detail")
        }
        , 0) : (config.settings ? renderPage() : config.init.then(function() {
            renderPage()
        }
        ),
        config.showHomepage = !0,
        Api.store("hideYounowLanding", !0)),
        eventbus.unsubscribe("home", "session:loggedin")
    }
    , "home", $scope)
}
]),
angular.module("younow.info", ["ui.router"]).config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $stateProvider.state("info", {
        url: "/info/:locale/:doc",
        resolve: {
            doc: function() {}
        },
        templateUrl: "angularjsapp/src/app/states/info/info.tpl.html",
        controller: "infoCtrl"
    }).state("/jobs", {
        url: "/jobs",
        resolve: {
            doc: function() {
                return "jobs"
            }
        },
        templateUrl: "angularjsapp/src/app/states/info/info.tpl.html",
        controller: "infoCtrl"
    })
}
]).controller("infoCtrl", ["doc", "$scope", "$http", "$sce", "$stateParams", "$timeout", "$document", function(doc, $scope, $http, $sce, $stateParams, $timeout, $document) {
    $scope.sections = [],
    $stateParams.locale = $stateParams.locale || "en",
    $stateParams.doc = $stateParams.doc || doc,
    $http.get("https://api.github.com/repos/younow/younow.github.io/contents/info/" + $stateParams.locale + "/" + $stateParams.doc + ".md", {
        headers: {
            Accept: "application/vnd.github.v3.html"
        }
    }).success(function(data) {
        $scope.docContent = $sce.trustAsHtml(data),
        $timeout(function() {
            var doc = angular.element(document.getElementById("infoPage"))
              , meta = doc.find("td");
            meta.length && ($scope.docTitle = angular.element(meta[0]).text(),
            "ME" == angular.element(meta[2]).text() && ($scope.rtl = !0)),
            $scope.ready = !0
        }
        )
    }
    ),
    $scope.scrollTo = function(y) {
        $document.scrollTop(y, 1e3)
    }
}
]),
angular.module("younow.lockout", ["ui.router"]).config(["$stateProvider", function($stateProvider) {
    $stateProvider.state("lockout", {
        url: "/lockout/",
        templateUrl: "angularjsapp/src/app/states/lockout/lockout.tpl.html",
        controller: "LockoutCtrl"
    })
}
]).controller("LockoutCtrl", ["$scope", "$rootScope", "Api", "$state", function($scope, $rootScope, Api, $state) {
    var lockout = Api.store("younowAgeLockout");
    Number(lockout) < (new Date).getTime() / 1e3 ? $state.go("home") : $rootScope.skipAgeGate = !0
}
]),
angular.module("younow.channel", ["younow.channel.chat", "younow.channel.settingupPanel", "younow.channel.audience-panel", "younow.channel.player-header", "younow.channel.player-footer", "younow.channel.player-overlay", "younow.channel.mod-form"]).config(["$stateProvider", function($stateProvider) {
    $stateProvider.state("main.channel", {
        "abstract": !0,
        controller: "ChannelCtrl",
        templateUrl: "angularjsapp/src/app/states/main/channel/channel.tpl.html"
    }).state("main.channel.detail", {
        url: "/:profileUrlString/:entityId/:inviteString/:srcId/:entityType/:copy",
        params: {
            profileUrlString: {},
            entityId: {
                value: null 
            },
            inviteString: {
                value: null 
            },
            srcId: {
                value: null 
            },
            entityType: {
                value: null 
            },
            copy: {
                value: null 
            }
        },
        controller: "ChannelDetailCtrl",
        template: "<div data-ui-view></div>"
    })
}
]).controller("ChannelCtrl", ["$scope", "$rootScope", "$stateParams", "$window", "$sce", "$modal", "$timeout", "broadcasterService", "$location", "$http", "swf", "config", "Api", "session", "pusher", "upload", "embedlyService", "$interpolate", "trackingPixel", "eventbus", function($scope, $rootScope, $stateParams, $window, $sce, $modal, $timeout, broadcasterService, $location, $http, swf, config, Api, session, pusher, upload, embedlyService, $interpolate, trackingPixel, eventbus) {
    $scope.broadcasterService = broadcasterService,
    $scope.swf = swf,
    $scope.session = session,
    $scope.config = config,
    $scope.host = $window.location.host,
    $scope.Api = Api,
    $scope.globalVars = window.globalVars,
    $scope.mcu = config.params.mcu,
    $scope.comment = {},
    $scope.newPosts = {},
    $scope.asyncTabs = [!0, !1, !1, !1],
    $scope.panel = {},
    $scope.panel.cdn = {
        thumb: config.settings.ServerCDNBaseUrl + "/php/api/channel/getImage/channelId=",
        nothumb: config.settings.ServerCDNBaseUrl + "/images/nothumb.jpg"
    },
    $scope.show_noflash_message = !1,
    $timeout(function() {
        $scope.show_noflash_message = !0
    }
    , 3300),
    $scope.timestamp = Date.now();
    var contextBeforeCreate, trackBroadcastViewtime = function() {
        trackingPixel.trackBroadcastViewtime("channel")
    }
    ;
    eventbus.subscribe("broadcast:end", trackBroadcastViewtime, "channel", $scope),
    $scope.$on("$destroy", function() {
        trackBroadcastViewtime(),
        window.onbeforeunload = null 
    }
    ),
    window.onbeforeunload = trackBroadcastViewtime;
    var fullScreenResize = function() {
        window.innerHeight / window.innerWidth < .75 ? $scope.fullscreenAspect = "wide" : $scope.fullscreenAspect = "tall"
    }
    ;
    fullScreenResize(),
    angular.element($window).on("resize", function() {
        fullScreenResize()
    }
    ),
    $scope.$on("$destroy", function() {
        angular.element($window).off("resize")
    }
    ),
    $scope.showProfileSummary = function(id, state, network, params) {
        if (id = id || broadcasterService.broadcaster.userId,
        params = "object" == typeof params ? params : {},
        "following" == state) {
            if (!network)
                return !1;
            params.network = network
        }
        "following" != state && !params.isFlagging || session.loggedIn ? $modal.profileSummary(id, params, state) : $modal.loginModal("", "REPORT").result.then(function(response) {
            $modal.profileSummary(id, params, state)
        }
        )
    }
    ,
    $scope.tabClick = function(tab) {
        $rootScope.gaPage({
            page: $location.path() + "#" + tab
        })
    }
    ,
    $scope.showTab = function(tab) {
        broadcasterService.tab = tab,
        (!broadcasterService.channel || broadcasterService.channel.finished && !broadcasterService.channel.finished[tab]) && ($rootScope.hideFooter = !0),
        broadcasterService.channel && broadcasterService.channel.finished && !broadcasterService.channel.finished[tab] && (!broadcasterService.channel[tab] || broadcasterService.channel[tab].length < 2) && ($scope.settingUp = !0,
        broadcasterService.getItems(tab).then(function() {
            $scope.settingUp = !1
        }
        ))
    }
    ,
    $scope.fullName = function(user) {
        return Api.fullName(user)
    }
    ,
    $scope.showMedia = function(id, params) {
        $modal.mediaPlayerModal(id, params)
    }
    ,
    $scope.openUrl = function(url) {
        $window.open(url, "_blank")
    }
    ,
    $scope.socialMediaHandler = function(url, isConnected) {
        isConnected || void 0 === isConnected ? $scope.openUrl(url) : $location.url("settings#accounts")
    }
    ,
    $scope.doUpload = function(file, endpoint, name) {
        var el = angular.element(file);
        if (window.URL) {
            var url = window.URL.createObjectURL(el[0].files[0])
              , img = new window.Image;
            img.onload = function() {
                return img.width < 80 || img.height < 80 ? (Api.triggerTooltip(el, 4e4),
                !1) : void continueUpload(el, endpoint, name)
            }
            ,
            img.src = url
        } else
            continueUpload(el, endpoint, name);
        var continueUpload = function(el, endpoint, name) {
            if (el[0].files[0].size / 1e6 > 6)
                return Api.triggerTooltip(el),
                !1;
            var data = {
                userId: session.user.userId,
                channelId: broadcasterService.channel.userId
            };
            data[name] = el;
            var apiData = {
                url: window.location.protocol + "//" + config.host + "/php/api/channel/" + endpoint,
                method: "POST",
                data: data
            };
            session && session.user && (apiData.headers = {
                "X-Requested-By": session.user.requestBy
            }),
            upload(apiData).then(function(response) {
                $scope["refresh" + name] = "?refresh=" + Math.random()
            }
            )
        }
    }
    ,
    $scope.saveDescription = function() {
        broadcasterService.channel.description = Api.stripHTML(broadcasterService.channel.description),
        broadcasterService.channel.displayDescription = Api.convertEmoji(Api.prepareDescription(broadcasterService.channel.description)),
        $scope.editing = !1,
        Api.post("channel/editBio", {
            userId: session.user.userId,
            channelId: broadcasterService.channel.userId,
            bio: broadcasterService.channel.description
        })
    }
    ,
    $scope.showUploadPreview = function(file, container) {
        container.upload = angular.element(file)[0].files[0],
        $scope.readFile(container.upload, container)
    }
    ,
    $scope.readFile = function(file, container) {
        var reader = new FileReader;
        reader.onload = function(e) {
            $scope.$evalAsync(function() {
                container.preview = e.target.result
            }
            )
        }
        ,
        reader.readAsDataURL(file)
    }
    ,
    $scope.postComment = function(context) {
        if ($scope.posting)
            return !1;
        if (!context || !context.html && !context.upload)
            return !1;
        if (!session.loggedIn)
            return context.id ? $modal.loginModal("", "POST_COMMENT").result.then(function() {
                $scope.postComment(context)
            }
            ) : $modal.loginModal("", "POST").result.then(function() {
                $scope.postComment(context)
            }
            ),
            !1;
        if (!session.fanStatus[broadcasterService.channel.userId] && broadcasterService.channel.userId !== session.user.userId)
            return $modal.trap("fan", broadcasterService.channel, "PROFILE").result.then(function() {
                $scope.postComment(context)
            }
            ),
            !1;
        if ($scope.posting = !0,
        !context.html)
            return uploadComment(context),
            !0;
        context = extractMentions(context);
        var html = angular.element(document.getElementById("textarea_" + (context.id || "")))
          , text = angular.element("<p>" + html.text() + "</p>").text();
        if (context.comment = text,
        html.empty(),
        context.html = "",
        context.upload)
            return uploadComment(context),
            !0;
        var links = Api.findLinks(context.comment);
        if (!links || !links[0])
            return uploadComment(context),
            !0;
        if (!links[0].match(Api.regexStore.embedlyWhiteList))
            return uploadComment(context),
            !1;
        var embedlykey = "d4272e7f48454b81849810f8d9258198"
          , escapedUrl = encodeURIComponent(links[0].replace(/("|').*$/g, ""))
          , embedlyRequest = window.location.protocol + "//api.embed.ly/1/oembed?key=" + embedlykey + "&chars=250&maxwidth=433&frame=true&url=" + escapedUrl;
        contextBeforeCreate = context,
        $http.get(embedlyRequest).success(function(response) {
            if ("photo" === response.type) {
                var photoTemplate = '<div><img src="{{url}}"></div>';
                response.html = $interpolate(photoTemplate)(response)
            }
            if ("link" === response.type) {
                var linkTemplate = '<div><a href="{{url}}" rel="nofollow" target="_blank"><div class="embedly-link-container"><div class="left pull-left"><img src="{{thumbnail_url}}" /></div><div class="right pull-left"><div class="title"><span>{{title}}</span></div><div class="description"><span>{{description}}</span></div></div><div class="clear"></div></div></a></div>';
                response.html = $interpolate(linkTemplate)(response)
            }
            response.html && (context.comment += response.html,
            delete response.html),
            context.embedly = response,
            uploadComment(context)
        }
        ).error(function(response) {
            uploadComment(context)
        }
        )
    }
    ;
    var uploadComment = function(context) {
        var data = {
            post: context.comment || "",
            parentId: context.id || 0,
            channelId: broadcasterService.channel.userId,
            userId: session.user.userId,
            doEnrich: 1,
            tsi: Api.store("trpxId"),
            tdi: Api.store("trpx_device_id")
        };
        if (context.embedly) {
            if (context.embedly.provider_url != contextBeforeCreate.embedly.provider_url && !context.embedly.provider_url.match(Api.regexStore.embedlyWhiteList))
                return $scope.posting = !1,
                Api.showError({
                    errorCode: "x",
                    errorMsg: "The was a problem posting your comment."
                }),
                context.comment = "",
                $scope.removeUpload(context),
                !1;
            data.embedly = JSON.stringify(context.embedly)
        }
        context.upload && (data.media = context.upload),
        context.mentions && (data.mentioned = context.mentions.join(","));
        var apiData = {
            url: window.location.protocol + "//" + config.host + "/php/api/post/create",
            method: "POST",
            data: data
        };
        session && session.user && (apiData.headers = {
            "X-Requested-By": session.user.requestBy
        }),
        upload(apiData).then(function(response) {
            response.data.errorMsg ? Api.showError(response.data) : response.data.id ? $scope.newPosts[response.data.id] = response.data : Api.showError({
                errorCode: "x",
                errorMsg: "The was a problem posting your comment."
            }),
            $scope.posting = !1
        }
        ),
        context.comment = "",
        $scope.removeUpload(context)
    }
    ;
    $scope.submitOnEnter = function(event, comment) {
        13 != event.keyCode || $scope.people || ($scope.postComment(comment),
        event.preventDefault())
    }
    ,
    $scope.removeUpload = function(context) {
        var id = "file_" + (context.id || "")
          , file = angular.element(document.getElementById(id));
        file.replaceWith(file.val("").clone(!0)),
        delete context.preview,
        delete context.upload
    }
    ,
    $scope.canEdit = function(post, action) {
        return session.user && session.user.userId ? session.isAdmin() || broadcasterService.channel.userId === session.user.userId ? !0 : post.user.userId == session.user.userId || $scope.newPosts[post.id] ? !0 : !1 : !1
    }
    ,
    $scope.canPin = function(post) {
        return session.user && session.user.userId ? !session.isAdmin() && broadcasterService.channel.userId !== session.user.userId || post.parentId ? !1 : !0 : !1
    }
    ,
    $scope.searchPeople = function(term) {
        Api.algolia(term).success(function(data) {
            angular.forEach(data.hits, function(user, i) {
                user.displayName = Api.fullName(user),
                user.thumb = $scope.cdn.thumb + user.objectID
            }
            ),
            $scope.people = data.hits
        }
        )
    }
    ,
    $scope.insertMention = function(item) {
        return $scope.people = void 0,
        '<span class="mention-highlight" contenteditable="false" person="' + item.objectID + '">' + item.displayName + "</span>"
    }
    ;
    var extractMentions = function(context) {
        var textarea = document.getElementById("textarea_" + (context.id || ""))
          , spans = textarea.getElementsByClassName("mention-highlight");
        return spans.length && (context.mentions = [],
        angular.forEach(spans, function(span) {
            var mention = angular.element(span);
            context.mentions.push(mention.text() + ":" + mention.attr("person")),
            mention.text("@" + mention.text())
        }
        )),
        context
    }
    ;
    $scope.swf = swf,
    $scope.enterLiveChat = function() {
        broadcasterService.channelSwitch = "PROFILE",
        broadcasterService.switchAsync(!1)
    }
    ,
    $scope.goIfNotBroadcasting = function(callback, params) {
        if (session.isBroadcasting)
            session.preventBroadcastInterrupt();
        else {
            if (broadcasterService.broadcaster && params === broadcasterService.broadcaster.userId)
                return !1;
            callback(params)
        }
    }
    ,
    $rootScope.$on("$locationChangeSuccess", function() {
        broadcasterService.async && $scope.asyncTabs && !$scope.asyncTabs[0] && ($scope.asyncTabs[0] = !0)
    }
    ),
    $scope.adclick = function(campaign) {
        $rootScope.gaEvent("FEATURE", "urnext", config.preferredLocale)
    }
}
]).controller("ChannelDetailCtrl", ["Api", "$rootScope", "$scope", "$http", "$state", "$location", "$stateParams", "$timeout", "config", "broadcasterService", "swf", function(Api, $rootScope, $scope, $http, $state, $location, $stateParams, $timeout, config, broadcasterService, swf) {
    if ($rootScope.banners && $rootScope.banners.sticky && $rootScope.banners.sticky.active && Api.closeTopBanner($rootScope.banners.sticky.group),
    broadcasterService.internalUpdate)
        broadcasterService.channelSwitch || (broadcasterService.channelSwitch = "START"),
        broadcasterService.internalUpdate = !1;
    else {
        var async = $stateParams.entityId ? !0 : !1
          , uri = $location.search();
        if (uri.from && (broadcasterService.channelSwitch = uri.from.toUpperCase()),
        async && $rootScope.gaPage({
            page: "Profile"
        }),
        !$stateParams.profileUrlString)
            return broadcasterService.channelSwitch || (broadcasterService.channelSwitch = "START"),
            broadcasterService.featuredBroadcaster(),
            !1;
        broadcasterService.channelSwitch || (broadcasterService.channelSwitch = "LINK"),
        broadcasterService.broadcaster && broadcasterService.broadcaster.profile === $stateParams.profileUrlString ? broadcasterService.switchAsync(async) : config.init.then(function() {
            broadcasterService.switchBroadcaster($stateParams.profileUrlString, !0, async)
        }
        )
    }
}
]),
angular.module("younow.explore", []).config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when("/explore", ["$state", function($state) {
        $state.go("main.explore")
    }
    ]),
    $stateProvider.state("main.explore", {
        url: "/explore/:tag?q",
        params: {
            tag: {},
            q: {}
        },
        templateUrl: "angularjsapp/src/app/states/main/explore/explore.tpl.html",
        controller: "ExploreCtrl"
    })
}
]).controller("ExploreCtrl", ["$window", "$rootScope", "$scope", "$stateParams", "$location", "$timeout", "$modal", "config", "Api", "broadcasterService", "swf", "$state", "trackingPixel", function($window, $rootScope, $scope, $stateParams, $location, $timeout, $modal, config, Api, broadcasterService, swf, $state, trackingPixel) {
    if ($rootScope.hideFooter = !0,
    $scope.showMiniplayer = !1,
    $scope.results = [],
    $scope.broadcasterService = broadcasterService,
    $scope.swf = swf,
    Api.store("hideYounowLanding") || $stateParams.q || ($stateParams.tag.length > 0 ? Api.showTopBanner("#" + $stateParams.tag + " Live Stream Video and Chat", "Explore live stream videos and chat with people about #" + $stateParams.tag, void 0, void 0, "success", !0, "banner") : Api.showTopBanner("Live Stream Video Chat", "Explore YouNow and find people to chat live with about the topics you’re most interested in!", "I'm feeling lucky!", "/featured", "success", !0, "banner"),
    Api.store("hideYounowLanding", !0)),
    "/explore" === window.location.pathname)
        return !1;
    config.init.then(function() {
        jwplayer.key = config.settings.JW_PLAYER_KEY,
        $scope.query = $stateParams.tag ? "#" + $stateParams.tag : $stateParams.q,
        $rootScope.title = $stateParams.tag ? "YouNow | " + $stateParams.tag + " | Live Stream Video Chat | Free Apps on Web, iOS & Android" : "YouNow | Live Stream Video Chat | Free Apps on Web, iOS and Android",
        $scope.getItems($scope.query).then(function(response) {
            $scope.selectUser($scope.results[0], !0),
            $scope.query || getVips()
        }
        )["catch"](function(e) {
            console.warn(e)
        }
        ),
        $scope.title = $stateParams.q || $stateParams.tag ? 'Results for "' + $scope.query + '"' : "Broadcasting Now";
        var path = $scope.query ? "/explore/" + $scope.query : "/explore/";
        $rootScope.gaPage({
            page: "Explore",
            path: path
        })
    }
    ),
    $scope.getItems = function(query, numberOfRecords) {
        query || "" === query || (query = $scope.query),
        $scope.results && query === $scope.query || ($scope.results = []),
        $scope.query = query;
        var params = {
            numberOfRecords: numberOfRecords || 20,
            startFrom: $scope.results.length || 0,
            locale: config.preferredLocale
        };
        if (query) {
            var restrict = "#" === query.substr(0, 1) ? "tag" : !1;
            restrict && (query = query.substr(1));
            var limit = params.numberOfRecords
              , page = params.numberOfRecords ? Math.round(params.startFrom / params.numberOfRecords) : 0;
            return Api.algolia(query, restrict, limit, page).success(function(data) {
                if (handleResults(data),
                config.settings.featuredTags[config.preferredLocale] && $stateParams.tag) {
                    var tags = config.settings.featuredTags[config.preferredLocale]
                      , i = 0;
                    for (i; i < tags.length; i++)
                        if (query === tags[i].tag)
                            return getEps(query),
                            !1
                }
            }
            )
        }
        return Api.get("younow/trendingUsers", params).success(function(data) {
            handleResults(data)
        }
        )
    }
    ;
    var getBroadcastThumb = function(user) {
        var thumb;
        return thumb = user.broadcastId && config.settings.UseBroadcastThumbs ? config.settings.ServerCDNBaseUrl + "/php/api/getBroadcastThumb/broadcastId=" + user.broadcastId : user.tag && user.tag.length > 0 && user.userId && config.settings.UseBroadcastThumbs ? config.settings.ServerCDNBaseUrl + "/php/api/getBroadcastThumb/userId=" + user.userId : config.settings.ServerCDNBaseUrl + "/php/api/channel/getImage/channelId=" + user.userId
    }
      , handleResults = function(data) {
        data.trending_users && config.settings.UseBroadcastThumbs && ($scope.useBroadcastThumbs = !0),
        data.trending_users && (angular.forEach(data.trending_users, function(user, i) {
            user.tags && (user.tag = user.tags[0]),
            user.level = Math.round(user.userlevel),
            user.fullName = Api.fullName(user),
            user.thumb = getBroadcastThumb(user)
        }
        ),
        data.totalUsers = data.totfal,
        $scope.results = $scope.results.concat(data.trending_users)),
        data.hits && (angular.forEach(data.hits, function(user, i) {
            user.userId = user.objectID,
            user.fullName = Api.fullName(user),
            user.thumb = getBroadcastThumb(user)
        }
        ),
        $scope.results = $scope.results.concat(data.hits)),
        $scope.noresults = 0 === $scope.results.length,
        $scope.results.length >= data.nbHits && ($scope.finished = !0,
        $rootScope.hideFooter = !1)
    }
    ;
    $scope.selectUser = function(user, initial, instant) {
        if ($window.jwplayer || $timeout(function() {
            $scope.selectUser(user, initial)
        }
        , 1e3),
        user && user.tag) {
            var curId = broadcasterService.exploreBroadcaster && broadcasterService.exploreBroadcaster.userId ? broadcasterService.exploreBroadcaster.userId : 0;
            Api.get("broadcast/info", {
                channelId: user.userId,
                curId: curId
            }).success(function(data) {
                if (Api.customPlayData(data, user),
                void 0 === data.user || null  === data.user)
                    return initial || $scope.showProfileSummary(user.userId),
                    !1;
                if (data.user.displayName = Api.fullName(data.user),
                $scope.broadcast = data,
                instant)
                    return $scope.showBroadcast(),
                    !1;
                $scope.showMiniplayer = !0;
                var stream_url = "rtmp://" + data.media.host + data.media.app + "/" + data.media.stream;
                $timeout(function() {
                    jwplayer("playeroniBsrErLcZk").setup({
                        file: stream_url,
                        image: config.settings.ServerCDNBaseUrl + "/images/back_webvideo_loading.jpg",
                        width: "315",
                        height: "225",
                        autostart: !0,
                        controls: !1,
                        aspectratio: "4:3",
                        primary: "flash"
                    }),
                    setVolume(),
                    jwplayer("playeroniBsrErLcZk").onDisplayClick(function() {
                        $scope.showBroadcast()
                    }
                    )
                }
                ),
                broadcasterService.exploreBroadcaster = $scope.broadcast
            }
            )
        } else
            !initial && user && $scope.showProfileSummary(user.userId)
    }
    ,
    $scope.showProfileSummary = function(id) {
        $modal.profileSummary(id)
    }
    ;
    var setVolume = function() {
        jwplayer("playeroniBsrErLcZk").setVolume(swf.volume)
    }
      , getVips = function() {
        Api.get("younow/vips", {
            locale: config.preferredLocale
        }, !0).then(function(response) {
            if (response.data.users && response.data.users.length > 0) {
                for (var user in response.data.users)
                    "https:" === window.location.protocol && -1 === response.data.users[user].thumbnail.indexOf("https") && (response.data.users[user].thumbnail = response.data.users[user].thumbnail.replace("http", "https"));
                $scope.vips = {
                    list: response.data.users
                }
            }
        }
        )
    }
      , getEps = function(tag) {
        Api.get("younow/featuredOnTopicUsers", {
            locale: config.preferredLocale,
            tag: tag
        }, !0).then(function(response) {
            $scope.eps = {
                list: response.data.featuredUsers
            }
        }
        )
    }
    ;
    $scope.showTag = function(event, tag) {
        event.stopPropagation(),
        $state.go($state.current, {
            tag: tag,
            q: void 0
        }, {
            reload: !0
        }),
        $rootScope.gaEvent("Conversion", "Click Tag", trackingPixel.getUserLocation() || "ANCILLARY")
    }
    ,
    $scope.showBroadcast = function() {
        broadcasterService.channelSwitch = "EXPLORE",
        broadcasterService.updateBroadcaster($scope.broadcast),
        broadcasterService.showBroadcaster()
    }
    ,
    $scope.$on("$destroy", function() {
        $rootScope.banners && $rootScope.banners.sticky && $rootScope.banners.sticky.active && Api.closeTopBanner($rootScope.banners.sticky.group)
    }
    )
}
]),
angular.module("younow.main", ["ui.router", "younow.header", "younow.footer", "younow.leftsidebar", "younow.activity-panel", "younow.explore", "younow.settings", "younow.channel"]).config(["$stateProvider", function($stateProvider) {
    $stateProvider.state("main", {
        url: "",
        "abstract": !0,
        templateUrl: "angularjsapp/src/app/states/main/main.tpl.html",
        controller: "MainCtrl"
    })
}
]).controller("MainCtrl", ["$scope", "$rootScope", "$modal", "config", "session", "Api", "broadcasterService", "trackingPixel", function($scope, $rootScope, $modal, config, session, Api, broadcasterService, trackingPixel) {
    (/Android/i.test(navigator.userAgent) || /BlackBerry/i.test(navigator.userAgent) || /iPhone|iPad|iPod/i.test(navigator.userAgent) || /IEMobile/i.test(navigator.userAgent)) && (window.location.href = "/"),
    $scope.session = session,
    $scope.closeNotification = function(group) {
        Api.closeTopNotification(group)
    }
    ,
    $scope.closeBanner = function(group) {
        Api.closeTopBanner(group)
    }
    ,
    $scope.onboardingCTA = function() {
        $rootScope.gaEvent("Conversion", "Click Welcome Banner CTA", trackingPixel.getUserLocation() || "ANCILLARY"),
        Api.closeTopBanner("sticky")
    }
    ,
    $rootScope.skipAgeGate && ($rootScope.skipAgeGate = !1,
    $modal.ageGate())
}
]),
angular.module("younow.missing", []).config(["$stateProvider", function($stateProvider) {
    $stateProvider.state("main.missing", {
        url: "",
        templateUrl: "angularjsapp/src/app/states/main/missing/missing.tpl.html",
        controller: "MissingCtrl"
    })
}
]).controller("MissingCtrl", ["$scope", "$location", function($scope, $location) {
    $scope.username = $location.path().split("/")[1]
}
]),
angular.module("younow.settings", []).config(["$stateProvider", function($stateProvider) {
    $stateProvider.state("main.settings", {
        url: "/settings",
        templateUrl: "angularjsapp/src/app/states/main/settings/settings.tpl.html",
        controller: "SettingsCtrl"
    })
}
]).controller("SettingsCtrl", ["$scope", "$window", "$timeout", "$state", "Api", "session", "config", "Facebook", "eventbus", "trackingPixel", function($scope, $window, $timeout, $state, Api, session, config, Facebook, eventbus, trackingPixel) {
    $scope.editing = !0,
    $scope.session = session;
    var pagesAuth;
    $scope.fbPages = {},
    $scope.config = config,
    $scope.emailRegex = /^((\"[^\"\f\n\r\t\v\b]+\")|([\w\!\#\$\%\&\'\*\+\-\~\/\^\`\|\{\}]+(\.[\w\!\#\$\%\&\'\*\+\-\~\/\^\`\|\{\}]+)*))@((\[(((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9]))\.((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9]))\.((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9]))\.((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9])))\])|(((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9]))\.((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9]))\.((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9]))\.((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9])))|((([A-Za-z0-9\-])+\.)+[A-Za-z\-]+))$/,
    $scope.checkWebsiteUrl = function() {
        var regex = /((http[s]?:\/{2})?www.facebook.com\/.+)/;
        regex.test($scope.settings.user.websiteUrl) ? ($scope.toEdit("websiteUrl", $scope.settings.user.websiteUrl),
        $scope.websiteUrlError = !1) : ($scope.edits && $scope.edits.websiteUrl && delete $scope.edits.websiteUrl,
        $scope.websiteUrlError = !0)
    }
    ;
    var getSubscriptions = function() {
        Api.get("channel/subscriptions/userId=" + session.user.userId).success(function(data) {
            if ($scope.subscriptions || ($scope.subscriptions = {}),
            data.errorCode)
                console.log("subscriptions error", data),
                Api.showError(data);
            else
                for (var k in data.subscriptions)
                    getSubscription(k, data.subscriptions[k])
        }
        )
    }
      , getSubscription = function(k, subscription) {
        var channelId = subscription.id.substr(0, subscription.id.indexOf("_"));
        Api.get("channel/getInfo/channelId=" + channelId).success(function(data) {
            $scope.subscriptions[k] = subscription,
            $scope.subscriptions[k].channel = data,
            $scope.subscriptions[k].channel.badge = config.settings.BadgeBaseUrl + "/" + $scope.subscriptions[k].channel.userId + "/1/badge@2x.png",
            $scope.subscriptions[k].channel.thumb = config.settings.ServerCDNBaseUrl + "/php/api/channel/getImage/channelId=" + $scope.subscriptions[k].channel.userId,
            $scope.subscriptions[k].channel.noThumb = config.settings.ServerCDNBaseUrl + "/images/nothumb.jpg",
            console.log("sub", $scope.subscriptions[k])
        }
        )
    }
    ;
    $window.location.hash && -1 !== ["#accounts", "#privacy", "#notifications", "#subscriptions"].indexOf($window.location.hash) ? ("subscriptions" == $window.location.hash.substr(1) && eventbus.subscribe("session:loggedIn", function() {
        getSubscriptions()
    }
    , "settings-subscriptions", $scope),
    $scope.page = $window.location.hash.substr(1)) : $scope.page = "info",
    "?err=" == $window.location.search.substr(0, 5) && Api.showTopNotification("Uh oh! You don't have an active YouTube account!");
    var fetchSettings = function() {
        session.loggedIn && Api.get("channel/settings", {
            userId: session.user.userId
        }).success(function(data) {
            data.user && (angular.forEach(data.options, function(option) {
                8 == option.optionValue && (data.pubTwitter = option),
                64 == option.optionValue && (data.pubFacebook = option),
                512 == option.optionValue && (data.hideCity = option),
                8192 == option.optionValue && (data.getUpdates = option)
            }
            ),
            data.user.useprofile = Number(data.user.useprofile),
            $scope.settings = data),
            data.user || $timeout(function() {
                Api.showError(data),
                $state.go("main.channel.detail")
            }
            , 0)
        }
        )
    }
    ;
    session.loggedIn && fetchSettings(),
    eventbus.subscribe("session:loggedIn", function(event, loggedIn) {
        loggedIn ? fetchSettings() : $timeout(function() {
            $state.go("main.channel.detail")
        }
        , 0)
    }
    , "settings", $scope),
    $scope.switchTab = function(tab) {
        "subscriptions" == tab && getSubscriptions(),
        $scope.page = tab,
        $window.location.hash = "#" + $scope.page
    }
    ,
    $scope.startEdit = function() {
        $scope.editing = !0
    }
    ,
    $scope.cancelEdit = function() {
        $scope.editing = !1,
        fetchSettings()
    }
    ,
    $scope.toEdit = function(key, value) {
        return $scope.editing = !0,
        "placeholder" == value ? ($scope.edits && $scope.edits[key] && delete $scope.edits[key],
        !1) : ($scope.edits || ($scope.edits = {}),
        void ($scope.edits[key] = value))
    }
    ,
    $scope.toEditGoodies = function(key, value) {
        $scope.editing = !0,
        $scope.edits || ($scope.edits = {}),
        $scope.edits.disabledGoodies || ($scope.edits.disabledGoodies = {}),
        $scope.edits.disabledGoodies[key] = value
    }
    ,
    $scope.saveChanges = function() {
        if ($scope.infoForm.$invalid)
            return "info" !== $scope.page && ($scope.page = "info"),
            eventbus.notifySubscribers("settings:invalid"),
            !1;
        if ($scope.edits) {
            $scope.edits.userId = session.user.userId,
            $scope.edits.channelId = session.user.userId;
            for (var goo in $scope.edits.disabledGoodies) {
                var track = {
                    event: "GOODIE_ON",
                    extradata: goo
                };
                $scope.edits.disabledGoodies[goo] && (track.event = "GOODIE_OFF"),
                trackingPixel.capture(track)
            }
            $scope.edits.disabledGoodies = JSON.stringify($scope.edits.disabledGoodies),
            Api.post("channel/updateSettings", $scope.edits).success(function(data) {
                data.errorCode ? Api.showError(data) : Api.showTopNotification("Settings Saved", "success"),
                fetchSettings(),
                session.getSession()
            }
            ),
            $scope.edits.facebookPageId && ($scope.settings.websiteUrl = "https://www.facebook.com/pages/" + $scope.edits.facebookPageTitle + "/" + $scope.edits.facebookPageId,
            $scope.settings.user.facebookPageId = $scope.edits.facebookPageId,
            $scope.settings.user.facebookPageToken = $scope.edits.facebookPageToken,
            $scope.settings.user.facebookPageTitle = $scope.edits.facebookPageTitle,
            $scope.gaEvent("CONNECT", "SUCCESS_FBPAGES", "SETTINGS")),
            delete $scope.edits
        }
        $scope.fbPages.editing = !1,
        $scope.editing = !1
    }
    ,
    $scope.connect = function(type, source) {
        $scope.gaEvent("CONNECT", "ATTEMPT_" + type.toUpperCase(), source),
        session.authenticate[type]().then(function(data) {
            session.login(data, !0).then(function(data) {
                fetchSettings(),
                console.log(data.config.data),
                data.data.errorCode > 0 ? $scope.gaEvent("CONNECT", "ERROR_" + type.toUpperCase() + "_" + data.data.errorCode, source) : $scope.gaEvent("CONNECT", "CONNECT_" + type.toUpperCase(), source)
            }
            )
        }
        )
    }
    ,
    $scope.disconnect = function(type) {
        var params = {
            userId: session.user.userId,
            channelId: session.user.userId
        };
        "deactivation" === type ? params.deactivation = 1 : params[type + "Connected"] = 0,
        "facebook" === type && (params.facebookPageConnected = 0,
        params.facebookOption = 0,
        params.option_64 = 0),
        Api.store("lastNetwork") && "deactivation" === type && session.authenticate[Api.store("lastNetwork")](!0).then(function(response) {
            if (response) {
                response.locale = config.preferredLocale,
                response.channelId = session.channelId || response.channelId,
                response.inviteString = session.inviteString || session.channelId,
                response.srcId = session.srcId || 0,
                response.tmsid = window.YouNow.Bootstrap.tmId || "",
                response.userId = session.user.userId;
                var concatedParams = angular.extend({}, params, response);
                Api.post("channel/updateSettings", concatedParams).success(function(data) {
                    data.errorCode ? Api.showError(data) : ($scope.terminating = !1,
                    $scope.terminated = !0,
                    Api.showTopNotification("Logging you out...", "success"),
                    session.logout()),
                    fetchSettings()
                }
                )
            }
        }
        ),
        "deactivation" !== type && Api.post("channel/updateSettings", params).success(function(data) {
            data.errorCode ? Api.showError(data) : (Api.showTopNotification("Account Disconnected", "success"),
            session.getSession()),
            fetchSettings()
        }
        )
    }
    ,
    $scope.loadFbPages = function() {
        $scope.fbPages.editing = !0,
        $scope.fbPages.hasPages = !0,
        $scope.fbPages.pages && 0 !== $scope.fbPages.pages.length ? ($scope.fbPages.fbPageSelected = $scope.fbPages.pages[0],
        $scope.updateFbPage()) : ($scope.gaEvent("CONNECT", "ATTEMPT_FBPAGES", "SETTINGS"),
        Facebook.getPagesList().then(function(response) {
            response.data.length > 0 ? (pagesAuth = response.authResponse,
            $scope.fbPages.pages = response.data,
            $scope.fbPages.fbPageSelected = response.data[0],
            $scope.updateFbPage(),
            $scope.fbPages.hasPages = !0) : ($scope.fbPages.hasPages = !1,
            $scope.gaEvent("CONNECT", "ERROR_FBPAGES", "SETTINGS"))
        }
        ))
    }
    ,
    $scope.changeFbState = function(state) {
        "cancel" === state && ($scope.fbPages.editing = !1,
        $scope.fbPages.fbPageSelected = void 0,
        $scope.edits && $scope.edits.facebookPageTitle && (delete $scope.edits.facebookPageToken,
        delete $scope.edits.facebookPageTitle,
        delete $scope.edits.facebookPageId)),
        "disconnect" === state && ($scope.updateFbPage(!0),
        $scope.toEdit("option_64", 0),
        $scope.saveChanges())
    }
    ,
    $scope.updateFbPage = function(reset) {
        reset ? ($scope.toEdit("facebookPageConnected", 0),
        $scope.toEdit("facebookOption", 0),
        delete $scope.edits.facebookPageToken,
        delete $scope.edits.facebookPageTitle,
        delete $scope.edits.facebookPageId) : ($scope.toEdit("facebookOption", 1),
        $scope.toEdit("facebookPageTitle", angular.copy($scope.fbPages.fbPageSelected.name)),
        $scope.toEdit("facebookPageId", angular.copy($scope.fbPages.fbPageSelected.id)),
        $scope.edits.facebookPageToken && pagesAuth.accessToken === $scope.edits.facebookPageToken || $scope.toEdit("facebookPageToken", pagesAuth.accessToken))
    }
    ,
    $scope.locale = [],
    angular.forEach(config.settings.Locales, function(locale, code) {
        $scope.locale.push({
            code: code,
            name: locale.name
        })
    }
    ),
    $scope.locale.sort(function(a, b) {
        return a.name === b.name ? 0 : a.name > b.name ? 1 : -1
    }
    ),
    $scope.locale.unshift({
        code: "placeholder",
        name: "Please Select"
    }),
    $scope.state = [{
        code: "placeholder",
        name: "Please Select"
    }, {
        code: "",
        name: ""
    }, {
        code: "AL",
        name: "Alabama"
    }, {
        code: "AK",
        name: "Alaska"
    }, {
        code: "AZ",
        name: "Arizona"
    }, {
        code: "AR",
        name: "Arkansas"
    }, {
        code: "CA",
        name: "California"
    }, {
        code: "CO",
        name: "Colorado"
    }, {
        code: "CT",
        name: "Connecticut"
    }, {
        code: "DE",
        name: "Delaware"
    }, {
        code: "DC",
        name: "District of Columbia"
    }, {
        code: "FL",
        name: "Florida"
    }, {
        code: "GA",
        name: "Georgia"
    }, {
        code: "HI",
        name: "Hawaii"
    }, {
        code: "ID",
        name: "Idaho"
    }, {
        code: "IL",
        name: "Illinois"
    }, {
        code: "IN",
        name: "Indiana"
    }, {
        code: "IA",
        name: "Iowa"
    }, {
        code: "KS",
        name: "Kansas"
    }, {
        code: "KY",
        name: "Kentucky"
    }, {
        code: "LA",
        name: "Louisiana"
    }, {
        code: "ME",
        name: "Maine"
    }, {
        code: "MD",
        name: "Maryland"
    }, {
        code: "MA",
        name: "Massachusetts"
    }, {
        code: "MI",
        name: "Michigan"
    }, {
        code: "MN",
        name: "Minnesota"
    }, {
        code: "MS",
        name: "Mississippi"
    }, {
        code: "MO",
        name: "Missouri"
    }, {
        code: "MT",
        name: "Montana"
    }, {
        code: "NE",
        name: "Nebraska"
    }, {
        code: "NV",
        name: "Nevada"
    }, {
        code: "NH",
        name: "New Hampshire"
    }, {
        code: "NJ",
        name: "New Jersey"
    }, {
        code: "NM",
        name: "New Mexico"
    }, {
        code: "NY",
        name: "New York"
    }, {
        code: "NC",
        name: "North Carolina"
    }, {
        code: "ND",
        name: "North Dakota"
    }, {
        code: "OH",
        name: "Ohio"
    }, {
        code: "OK",
        name: "Oklahoma"
    }, {
        code: "OR",
        name: "Oregon"
    }, {
        code: "PA",
        name: "Pennsylvania"
    }, {
        code: "RI",
        name: "Rhode Island"
    }, {
        code: "SC",
        name: "South Carolina"
    }, {
        code: "SD",
        name: "South Dakota"
    }, {
        code: "TN",
        name: "Tennessee"
    }, {
        code: "TX",
        name: "Texas"
    }, {
        code: "UT",
        name: "Utah"
    }, {
        code: "VT",
        name: "Vermont"
    }, {
        code: "VA",
        name: "Virginia"
    }, {
        code: "WA",
        name: "Washington"
    }, {
        code: "WV",
        name: "West Virginia"
    }, {
        code: "WI",
        name: "Wisconsin"
    }, {
        code: "WY",
        name: "Wyoming"
    }],
    $scope.country = [{
        code: "placeholder",
        name: "Please Select"
    }, {
        code: "AF",
        name: "Afghanistan"
    }, {
        code: "AX",
        name: "Aland Islands"
    }, {
        code: "AL",
        name: "Albania"
    }, {
        code: "DZ",
        name: "Algeria"
    }, {
        code: "AS",
        name: "American Samoa"
    }, {
        code: "AD",
        name: "Andorra"
    }, {
        code: "AO",
        name: "Angola"
    }, {
        code: "AI",
        name: "Anguilla"
    }, {
        code: "AQ",
        name: "Antarctica"
    }, {
        code: "AG",
        name: "Antigua and Barbuda"
    }, {
        code: "AR",
        name: "Argentina"
    }, {
        code: "AM",
        name: "Armenia"
    }, {
        code: "AW",
        name: "Aruba"
    }, {
        code: "AU",
        name: "Australia"
    }, {
        code: "AT",
        name: "Austria"
    }, {
        code: "AZ",
        name: "Azerbaijan"
    }, {
        code: "BS",
        name: "Bahamas"
    }, {
        code: "BH",
        name: "Bahrain"
    }, {
        code: "BD",
        name: "Bangladesh"
    }, {
        code: "BB",
        name: "Barbados"
    }, {
        code: "BY",
        name: "Belarus"
    }, {
        code: "BE",
        name: "Belgium"
    }, {
        code: "BZ",
        name: "Belize"
    }, {
        code: "BJ",
        name: "Benin"
    }, {
        code: "BM",
        name: "Bermuda"
    }, {
        code: "BT",
        name: "Bhutan"
    }, {
        code: "BO",
        name: "Bolivia"
    }, {
        code: "BA",
        name: "Bosnia and Herzegovina"
    }, {
        code: "BW",
        name: "Botswana"
    }, {
        code: "BV",
        name: "Bouvet Island"
    }, {
        code: "BR",
        name: "Brazil"
    }, {
        code: "IO",
        name: "British Indian Ocean Territory"
    }, {
        code: "BN",
        name: "Brunei Darussalam"
    }, {
        code: "BG",
        name: "Bulgaria"
    }, {
        code: "BF",
        name: "Burkina Faso"
    }, {
        code: "BI",
        name: "Burundi"
    }, {
        code: "KH",
        name: "Cambodia"
    }, {
        code: "CM",
        name: "Cameroon"
    }, {
        code: "CA",
        name: "Canada"
    }, {
        code: "CV",
        name: "Cape Verde"
    }, {
        code: "KY",
        name: "Cayman Islands"
    }, {
        code: "CF",
        name: "Central African Republic"
    }, {
        code: "TD",
        name: "Chad"
    }, {
        code: "CL",
        name: "Chile"
    }, {
        code: "CN",
        name: "China"
    }, {
        code: "CX",
        name: "Christmas Island"
    }, {
        code: "CC",
        name: "Cocos (Keeling) Islands"
    }, {
        code: "CO",
        name: "Colombia"
    }, {
        code: "KM",
        name: "Comoros"
    }, {
        code: "CG",
        name: "Congo"
    }, {
        code: "CD",
        name: "Congo, The Democratic Republic of the"
    }, {
        code: "CK",
        name: "Cook Islands"
    }, {
        code: "CR",
        name: "Costa Rica"
    }, {
        code: "HR",
        name: "Croatia"
    }, {
        code: "CU",
        name: "Cuba"
    }, {
        code: "CY",
        name: "Cyprus"
    }, {
        code: "CZ",
        name: "Czech Republic"
    }, {
        code: "DK",
        name: "Denmark"
    }, {
        code: "DJ",
        name: "Djibouti"
    }, {
        code: "DM",
        name: "Dominica"
    }, {
        code: "DO",
        name: "Dominican Republic"
    }, {
        code: "EC",
        name: "Ecuador"
    }, {
        code: "EG",
        name: "Egypt"
    }, {
        code: "SV",
        name: "El Salvador"
    }, {
        code: "GQ",
        name: "Equatorial Guinea"
    }, {
        code: "ER",
        name: "Eritrea"
    }, {
        code: "EE",
        name: "Estonia"
    }, {
        code: "ET",
        name: "Ethiopia"
    }, {
        code: "FK",
        name: "Falkland Islands (Malvinas)"
    }, {
        code: "FO",
        name: "Faroe Islands"
    }, {
        code: "FJ",
        name: "Fiji"
    }, {
        code: "FI",
        name: "Finland"
    }, {
        code: "FR",
        name: "France"
    }, {
        code: "GF",
        name: "French Guiana"
    }, {
        code: "PF",
        name: "French Polynesia"
    }, {
        code: "TF",
        name: "French Southern Territories"
    }, {
        code: "GA",
        name: "Gabon"
    }, {
        code: "GM",
        name: "Gambia"
    }, {
        code: "GE",
        name: "Georgia"
    }, {
        code: "DE",
        name: "Germany"
    }, {
        code: "GH",
        name: "Ghana"
    }, {
        code: "GI",
        name: "Gibraltar"
    }, {
        code: "GR",
        name: "Greece"
    }, {
        code: "GL",
        name: "Greenland"
    }, {
        code: "GD",
        name: "Grenada"
    }, {
        code: "GP",
        name: "Guadeloupe"
    }, {
        code: "GU",
        name: "Guam"
    }, {
        code: "GT",
        name: "Guatemala"
    }, {
        code: "GG",
        name: "Guernsey"
    }, {
        code: "GN",
        name: "Guinea"
    }, {
        code: "GW",
        name: "Guinea-Bissau"
    }, {
        code: "GY",
        name: "Guyana"
    }, {
        code: "HT",
        name: "Haiti"
    }, {
        code: "HM",
        name: "Heard Island and McDonald Islands"
    }, {
        code: "VA",
        name: "Holy See (Vatican City State)"
    }, {
        code: "HN",
        name: "Honduras"
    }, {
        code: "HK",
        name: "Hong Kong"
    }, {
        code: "HU",
        name: "Hungary"
    }, {
        code: "IS",
        name: "Iceland"
    }, {
        code: "IN",
        name: "India"
    }, {
        code: "ID",
        name: "Indonesia"
    }, {
        code: "IR",
        name: "Iran, Islamic Republic of"
    }, {
        code: "IQ",
        name: "Iraq"
    }, {
        code: "IE",
        name: "Ireland"
    }, {
        code: "IM",
        name: "Isle of Man"
    }, {
        code: "IL",
        name: "Israel"
    }, {
        code: "IT",
        name: "Italy"
    }, {
        code: "CI",
        name: "Ivory Coast"
    }, {
        code: "JM",
        name: "Jamaica"
    }, {
        code: "JP",
        name: "Japan"
    }, {
        code: "JE",
        name: "Jersey"
    }, {
        code: "JO",
        name: "Jordan"
    }, {
        code: "KZ",
        name: "Kazakhstan"
    }, {
        code: "KE",
        name: "Kenya"
    }, {
        code: "KI",
        name: "Kiribati"
    }, {
        code: "KP",
        name: "Korea, Democratic People's Republic of"
    }, {
        code: "KR",
        name: "Korea, Republic of"
    }, {
        code: "KW",
        name: "Kuwait"
    }, {
        code: "KG",
        name: "Kyrgyzstan"
    }, {
        code: "LA",
        name: "Lao People's Democratic Republic"
    }, {
        code: "LV",
        name: "Latvia"
    }, {
        code: "LB",
        name: "Lebanon"
    }, {
        code: "LS",
        name: "Lesotho"
    }, {
        code: "LR",
        name: "Liberia"
    }, {
        code: "LY",
        name: "Libyan Arab Jamahiriya"
    }, {
        code: "LI",
        name: "Liechtenstein"
    }, {
        code: "LT",
        name: "Lithuania"
    }, {
        code: "LU",
        name: "Luxembourg"
    }, {
        code: "MO",
        name: "Macao"
    }, {
        code: "MK",
        name: "Macedonia, The Former Yugoslav Republic of"
    }, {
        code: "MG",
        name: "Madagascar"
    }, {
        code: "MW",
        name: "Malawi"
    }, {
        code: "MY",
        name: "Malaysia"
    }, {
        code: "MV",
        name: "Maldives"
    }, {
        code: "ML",
        name: "Mali"
    }, {
        code: "MT",
        name: "Malta"
    }, {
        code: "MH",
        name: "Marshall Islands"
    }, {
        code: "MQ",
        name: "Martinique"
    }, {
        code: "MR",
        name: "Mauritania"
    }, {
        code: "MU",
        name: "Mauritius"
    }, {
        code: "YT",
        name: "Mayotte"
    }, {
        code: "MX",
        name: "Mexico"
    }, {
        code: "FM",
        name: "Micronesia, Federated States of"
    }, {
        code: "MD",
        name: "Moldova, Republic of"
    }, {
        code: "MC",
        name: "Monaco"
    }, {
        code: "MN",
        name: "Mongolia"
    }, {
        code: "ME",
        name: "Montenegro"
    }, {
        code: "MS",
        name: "Montserrat"
    }, {
        code: "MA",
        name: "Morocco"
    }, {
        code: "MZ",
        name: "Mozambique"
    }, {
        code: "MM",
        name: "Myanmar"
    }, {
        code: "NA",
        name: "Namibia"
    }, {
        code: "NR",
        name: "Nauru"
    }, {
        code: "NP",
        name: "Nepal"
    }, {
        code: "NL",
        name: "Netherlands"
    }, {
        code: "AN",
        name: "Netherlands Antilles"
    }, {
        code: "NC",
        name: "New Caledonia"
    }, {
        code: "NZ",
        name: "New Zealand"
    }, {
        code: "NI",
        name: "Nicaragua"
    }, {
        code: "NE",
        name: "Niger"
    }, {
        code: "NG",
        name: "Nigeria"
    }, {
        code: "NU",
        name: "Niue"
    }, {
        code: "NF",
        name: "Norfolk Island"
    }, {
        code: "MP",
        name: "Northern Mariana Islands"
    }, {
        code: "NO",
        name: "Norway"
    }, {
        code: "OM",
        name: "Oman"
    }, {
        code: "PK",
        name: "Pakistan"
    }, {
        code: "PW",
        name: "Palau"
    }, {
        code: "PS",
        name: "Palestinian Territory, Occupied"
    }, {
        code: "PA",
        name: "Panama"
    }, {
        code: "PG",
        name: "Papua New Guinea"
    }, {
        code: "PY",
        name: "Paraguay"
    }, {
        code: "PE",
        name: "Peru"
    }, {
        code: "PH",
        name: "Philippines"
    }, {
        code: "PN",
        name: "Pitcairn"
    }, {
        code: "PL",
        name: "Poland"
    }, {
        code: "PT",
        name: "Portugal"
    }, {
        code: "PR",
        name: "Puerto Rico"
    }, {
        code: "QA",
        name: "Qatar"
    }, {
        code: "RE",
        name: "Reunion"
    }, {
        code: "RO",
        name: "Romania"
    }, {
        code: "RU",
        name: "Russian Federation"
    }, {
        code: "RW",
        name: "Rwanda"
    }, {
        code: "BL",
        name: "Saint Barth"
    }, {
        code: "SH",
        name: "Saint Helena"
    }, {
        code: "KN",
        name: "Saint Kitts and Nevis"
    }, {
        code: "LC",
        name: "Saint Lucia"
    }, {
        code: "MF",
        name: "Saint Martin"
    }, {
        code: "PM",
        name: "Saint Pierre and Miquelon"
    }, {
        code: "VC",
        name: "Saint Vincent and the Grenadines"
    }, {
        code: "WS",
        name: "Samoa"
    }, {
        code: "SM",
        name: "San Marino"
    }, {
        code: "ST",
        name: "Sao Tome and Principe"
    }, {
        code: "SA",
        name: "Saudi Arabia"
    }, {
        code: "SN",
        name: "Senegal"
    }, {
        code: "RS",
        name: "Serbia"
    }, {
        code: "SC",
        name: "Seychelles"
    }, {
        code: "SL",
        name: "Sierra Leone"
    }, {
        code: "SG",
        name: "Singapore"
    }, {
        code: "SK",
        name: "Slovakia"
    }, {
        code: "SI",
        name: "Slovenia"
    }, {
        code: "SB",
        name: "Solomon Islands"
    }, {
        code: "SO",
        name: "Somalia"
    }, {
        code: "ZA",
        name: "South Africa"
    }, {
        code: "GS",
        name: "South Georgia and the South Sandwich Islands"
    }, {
        code: "ES",
        name: "Spain"
    }, {
        code: "LK",
        name: "Sri Lanka"
    }, {
        code: "SD",
        name: "Sudan"
    }, {
        code: "SR",
        name: "Suriname"
    }, {
        code: "SJ",
        name: "Svalbard and Jan Mayen"
    }, {
        code: "SZ",
        name: "Swaziland"
    }, {
        code: "SE",
        name: "Sweden"
    }, {
        code: "CH",
        name: "Switzerland"
    }, {
        code: "SY",
        name: "Syrian Arab Republic"
    }, {
        code: "TW",
        name: "Taiwan"
    }, {
        code: "TJ",
        name: "Tajikistan"
    }, {
        code: "TZ",
        name: "Tanzania, United Republic of"
    }, {
        code: "TH",
        name: "Thailand"
    }, {
        code: "TL",
        name: "Timor-Leste"
    }, {
        code: "TG",
        name: "Togo"
    }, {
        code: "TK",
        name: "Tokelau"
    }, {
        code: "TO",
        name: "Tonga"
    }, {
        code: "TT",
        name: "Trinidad and Tobago"
    }, {
        code: "TN",
        name: "Tunisia"
    }, {
        code: "TR",
        name: "Turkey"
    }, {
        code: "TM",
        name: "Turkmenistan"
    }, {
        code: "TC",
        name: "Turks and Caicos Islands"
    }, {
        code: "TV",
        name: "Tuvalu"
    }, {
        code: "UG",
        name: "Uganda"
    }, {
        code: "UA",
        name: "Ukraine"
    }, {
        code: "AE",
        name: "United Arab Emirates"
    }, {
        code: "GB",
        name: "United Kingdom"
    }, {
        code: "US",
        name: "United States"
    }, {
        code: "UM",
        name: "United States Minor Outlying Islands"
    }, {
        code: "UY",
        name: "Uruguay"
    }, {
        code: "UZ",
        name: "Uzbekistan"
    }, {
        code: "VU",
        name: "Vanuatu"
    }, {
        code: "VE",
        name: "Venezuela"
    }, {
        code: "VN",
        name: "Viet Nam"
    }, {
        code: "VG",
        name: "Virgin Islands, British"
    }, {
        code: "VI",
        name: "Virgin Islands, U.S."
    }, {
        code: "WF",
        name: "Wallis And Futuna"
    }, {
        code: "EH",
        name: "Western Sahara"
    }, {
        code: "YE",
        name: "Yemen"
    }, {
        code: "ZM",
        name: "Zambia"
    }, {
        code: "ZW",
        name: "Zimbabwe"
    }],
    $scope.tshirt = [{
        code: "placeholder",
        name: "Select a size..."
    }, {
        code: "s",
        name: "Small"
    }, {
        code: "m",
        name: "Medium"
    }, {
        code: "l",
        name: "Large"
    }, {
        code: "xl",
        name: "X-Large"
    }],
    $scope.gender = [{
        code: "placeholder",
        name: "Select a gender..."
    }, {
        code: "male",
        name: "Male"
    }, {
        code: "female",
        name: "Female"
    }];
    var selects = ["locale", "state", "country", "gender", "tshirt"];
    $scope.select = {},
    angular.forEach(selects, function(select) {
        $scope.select[select] = {},
        angular.forEach($scope[select], function(option) {
            $scope.select[select][option.code] = option.name
        }
        )
    }
    )
}
]).directive("ynValid", ["Api", "$compile", "eventbus", function(Api, $compile, eventbus) {
    return {
        restrict: "A",
        scope: {
            message: "@",
            isValid: "="
        },
        link: function(scope, elem, attrs) {
            function errorFeedback() {
                -1 !== elem[0].className.indexOf("ng-invalid") && Api.triggerTooltip(elem, 2500)
            }
            var tag = elem[0].tagName;
            ("TEXTAREA" == tag || "INPUT" == tag) && elem.on("blur", errorFeedback),
            eventbus.subscribe("settings:invalid", errorFeedback, attrs.name, scope)
        }
    }
}
]),
angular.module("younow.partner", ["ui.router"]).config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    function reRouteHandler(from, to) {
        $urlRouterProvider.when(from, ["$match", "$stateParams", "$injector", "$state", function($match, $stateParams, $injector, $state) {
            $injector.get("config").init.then(function() {
                $state.go(to)
            }
            )
        }
        ])
    }
    reRouteHandler("/partner/earnings", "/partners/earnings"),
    reRouteHandler("/partner", "/partners"),
    reRouteHandler("/partners/", "/partners"),
    reRouteHandler("/partner.php", "/partners"),
    $stateProvider.state("/partners/earnings", {
        url: "/partners/earnings",
        templateUrl: "angularjsapp/src/app/states/partner/earnings.tpl.html",
        controller: "partnerCtrl"
    }).state("/partners", {
        url: "/partners",
        templateUrl: "angularjsapp/src/app/states/partner/partner.tpl.html",
        controller: "partnerCtrl"
    })
}
]).controller("partnerCtrl", ["$scope", "$rootScope", "Api", "$state", "session", "$location", "$http", "config", function($scope, $rootScope, Api, $state, session, $location, $http, config) {
    var vm = this;
    vm.session = session,
    vm.config = config,
    vm.submitAgreeForm = function() {
        return vm.agreeFormInvalid = !1,
        vm.agreeFormChecked ? (vm.agreeFormProcessing = !0,
        void Api.post("channel/partnerForm", {
            userId: session.user.userId,
            channelId: session.user.userId,
            agree: 1
        }).success(function(data, status, headers, config) {
            vm.agreeFormProcessing = !1,
            vm.agreeFormSuccess = !0,
            7 === session.user.partner ? $state.go("/partners/earnings") : session.user.partner = 1
        }
        ).error(function(data, status, headers, config) {
            vm.agreeFormProcessing = !1,
            vm.agreeFormError = !0
        }
        )) : (vm.agreeFormInvalid = !0,
        !1)
    }
    ,
    vm.enablePendingForm = function() {
        vm.pendingForm = {}
    }
    ,
    vm.submitPendingForm = function() {
        return vm.pendingFormSubmitted = !0,
        vm.pendingForm.name ? (vm.pendingFormProcessing = !0,
        void Api.post("channel/partnerForm", {
            userId: session.user.userId,
            channelId: session.user.userId,
            fullName: vm.pendingForm.name,
            email: vm.pendingForm.email,
            phone: vm.pendingForm.phone,
            socialLinks: vm.pendingForm.social,
            description: vm.pendingForm.about
        }).success(function(data, status, headers, config) {
            vm.pendingFormProcessing = !1,
            data.errorCode || (vm.pendingFormSuccess = !0,
            session.user.partner = 3,
            $state.go($state.current, {}, {
                reload: !0
            }))
        }
        ).error(function(data, status, headers, config) {
            vm.pendingFormProcessing = !1,
            vm.pendingFormError = !0
        }
        )) : !1
    }
    ,
    vm.getUsername = function() {
        return session.user.profile
    }
    ,
    vm.validatePhonePattern = function() {
        var regexp = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
        return {
            test: function(value) {
                return regexp.test(value)
            }
        }
    }
    (),
    vm.validateEmailPattern = function() {
        var regexp = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
        return {
            test: function(value) {
                return regexp.test(value)
            }
        }
    }
    (),
    $scope.vm = vm
}
]),
angular.module("younow.policy", ["ui.router"]).config(["$stateProvider", function($stateProvider) {
    $stateProvider.state("policy", {
        url: "/policy/:locale/:doc",
        templateUrl: "angularjsapp/src/app/states/policy/policy.tpl.html",
        controller: "PolicyCtrl"
    })
}
]).controller("PolicyCtrl", ["$scope", "$http", "$sce", "$stateParams", "$timeout", "$document", function($scope, $http, $sce, $stateParams, $timeout, $document) {
    $scope.sections = [],
    $http.get("https://api.github.com/repos/younow/younow.github.io/contents/policy/" + $stateParams.locale + "/" + $stateParams.doc + ".md", {
        headers: {
            Accept: "application/vnd.github.v3.html"
        }
    }).success(function(data) {
        $scope.docContent = $sce.trustAsHtml(data),
        $timeout(function() {
            var doc = angular.element(document.getElementById("docs"))
              , meta = doc.find("td");
            $scope.docTitle = angular.element(meta[0]).text(),
            "ME" == angular.element(meta[2]).text() && ($scope.rtl = !0),
            angular.forEach(doc.find("h2"), function(h2) {
                var elem = angular.element(h2);
                $scope.sections.push({
                    innerText: elem.text(),
                    offsetTop: elem[0].offsetTop
                })
            }
            ),
            $scope.ready = !0
        }
        )
    }
    ),
    $scope.scrollTo = function(y) {
        $document.scrollTop(y, 1e3)
    }
}
]),
angular.module("templates", ["angularjsapp/src/app/components/activity-panel/activity-panel.tpl.html", "angularjsapp/src/app/components/alert-modal/alert-modal.tpl.html", "angularjsapp/src/app/components/audience-panel/audience-panel.tpl.html", "angularjsapp/src/app/components/buybars-modal/buybars.tpl.html", "angularjsapp/src/app/components/buybars-modal/cc-verified.tpl.html", "angularjsapp/src/app/components/chat/chat.tpl.html", "angularjsapp/src/app/components/confirm-modal/confirm.tpl.html", "angularjsapp/src/app/components/editors-pick-modals/ep-congrats.tpl.html", "angularjsapp/src/app/components/editors-pick-modals/ep-expired.tpl.html", "angularjsapp/src/app/components/fan-button/fan-button.tpl.html", "angularjsapp/src/app/components/footer/footer.tpl.html", "angularjsapp/src/app/components/gate-modal/gate-modal.tpl.html", "angularjsapp/src/app/components/header/header.tpl.html", "angularjsapp/src/app/components/header/searchresult.tpl.html", "angularjsapp/src/app/components/iframe-modal/iframe-modal.tpl.html", "angularjsapp/src/app/components/left-sidebar/left-sidebar.tpl.html", "angularjsapp/src/app/components/login-modal/login-modal.tpl.html", "angularjsapp/src/app/components/media-player-modal/media-player-modal.tpl.html", "angularjsapp/src/app/components/mention/mention.tpl.html", "angularjsapp/src/app/components/mobile-download/mobile-download-modal.tpl.html", "angularjsapp/src/app/components/mobile-download/mobile-download.tpl.html", "angularjsapp/src/app/components/mod-form/mod-form.tpl.html", "angularjsapp/src/app/components/partner-agreement-modal/partner-agreement-modal.tpl.html", "angularjsapp/src/app/components/partner-modal/partner-modal.tpl.html", "angularjsapp/src/app/components/post/embed/archive.tpl.html", "angularjsapp/src/app/components/post/embed/embedlyimage.tpl.html", "angularjsapp/src/app/components/post/embed/iframe.tpl.html", "angularjsapp/src/app/components/post/embed/link.tpl.html", "angularjsapp/src/app/components/post/embed/snapshot.tpl.html", "angularjsapp/src/app/components/post/embed/uploadimage.tpl.html", "angularjsapp/src/app/components/post/embed/video.tpl.html", "angularjsapp/src/app/components/post/post.tpl.html", "angularjsapp/src/app/components/post/reply/reply.tpl.html", "angularjsapp/src/app/components/profile-summary/profile-summary.tpl.html", "angularjsapp/src/app/components/search-bar/search-bar.tpl.html", "angularjsapp/src/app/components/search-bar/search-results.tpl.html", "angularjsapp/src/app/components/settingup-panel/settingup-panel.tpl.html", "angularjsapp/src/app/components/settingup-panel/tag-selection.tpl.html", "angularjsapp/src/app/components/share-broadcast-modal/share-broadcast-modal.tpl.html", "angularjsapp/src/app/components/subscribe-button/subscribe-button.tpl.html", "angularjsapp/src/app/components/subscribe-modal/subscribe.tpl.html", "angularjsapp/src/app/components/trap-modal/trap-modal.tpl.html", "angularjsapp/src/app/components/video-player/player-footer.tpl.html", "angularjsapp/src/app/components/video-player/player-header.tpl.html", "angularjsapp/src/app/components/video-player/player-overlay.tpl.html", "angularjsapp/src/app/components/youtube-subscribe/youtube-subscribe.tpl.html", "angularjsapp/src/app/states/about/about.tpl.html", "angularjsapp/src/app/states/home/home.tpl.html", "angularjsapp/src/app/states/info/info.tpl.html", "angularjsapp/src/app/states/lockout/lockout.tpl.html", "angularjsapp/src/app/states/main/channel/async/async.tpl.html", "angularjsapp/src/app/states/main/channel/channel.tpl.html", "angularjsapp/src/app/states/main/channel/live/live.tpl.html", "angularjsapp/src/app/states/main/explore/explore.tpl.html", "angularjsapp/src/app/states/main/main.tpl.html", "angularjsapp/src/app/states/main/missing/missing.tpl.html", "angularjsapp/src/app/states/main/settings/settings.tpl.html", "angularjsapp/src/app/states/partner/earnings.tpl.html", "angularjsapp/src/app/states/partner/partials/active.tpl.html", "angularjsapp/src/app/states/partner/partials/active_confirm.tpl.html", "angularjsapp/src/app/states/partner/partials/application_pending.tpl.html", "angularjsapp/src/app/states/partner/partials/not.tpl.html", "angularjsapp/src/app/states/partner/partials/pending.tpl.html", "angularjsapp/src/app/states/partner/partials/pending_approved_confirm.tpl.html", "angularjsapp/src/app/states/partner/partner.tpl.html", "angularjsapp/src/app/states/policy/policy.tpl.html", "template/accordion/accordion-group.html", "template/accordion/accordion.html", "template/alert/alert.html", "template/carousel/carousel.html", "template/carousel/slide.html", "template/datepicker/datepicker.html", "template/datepicker/day.html", "template/datepicker/month.html", "template/datepicker/popup.html", "template/datepicker/year.html", "template/modal/backdrop.html", "template/modal/window.html", "template/pagination/pager.html", "template/pagination/pagination.html", "template/popover/popover.html", "template/progressbar/bar.html", "template/progressbar/progress.html", "template/progressbar/progressbar.html", "template/rating/rating.html", "template/tabs/tab.html", "template/tabs/tabset.html", "template/timepicker/timepicker.html", "template/tooltip/tooltip-html-unsafe-popup.html", "template/tooltip/tooltip-popup.html", "template/typeahead/typeahead-match.html", "template/typeahead/typeahead-popup.html"]),
angular.module("angularjsapp/src/app/components/activity-panel/activity-panel.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/activity-panel/activity-panel.tpl.html", '<div class="panel-body">\n	<div class="friends-list mini-scroll" only-scroll ng-if="onlineFriends.length > 0">\n		<a class="activity" ng-repeat="friend in onlineFriends | filter:friendfilter" ng-href="/{{friend.profile}}" prevent-default ng-click="panel.changeBroadcaster( friend.channelId, source )">\n			<div class="profile-img thumb" ng-style="::{\'background-image\': \'url(\'+panel.cdn.thumb+friend.userId+\'), url(\'+panel.cdn.nothumb+\')\'}">\n				<span class="live" ng-if="friend.status===2"><i class="ynicon ynicon-broadcast"></i></span>\n			</div>\n			<div class="status">\n				<span class="name short-text">{{friend.name}}</span>\n\n				<span ng-if="friend.status!==2" class="short-text current-activity">\n					<i class="ynicon ynicon-viewers" ng-if="friend.channelName"></i> {{friend.channelName}}\n				</span>\n				<span ng-if="friend.status===2" class="short-text current-activity"><i ng-if="friend.tags[0]">#</i>{{friend.tags[0]}}</span>\n\n				<div ng-if="friend.bars" class="bars-text">\n					<img class="bar" ng-src="{{::cdn.base}}/angularjsapp/src/assets/images/icons_v3/icon_bar_sm.png"> {{friend.bars | number}}\n				</div>\n\n			</div>\n		</a>\n	</div>\n	<span class="no-friends-msg" ng-if="onlineFriends.length === 0 || !onlineFriends" translate="activity_no_friends_online"></span>\n</div>\n<div id="div-gpt-ad-1392148686409-0"></div>\n')
}
]),
angular.module("angularjsapp/src/app/components/alert-modal/alert-modal.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/alert-modal/alert-modal.tpl.html", '<div class="modal-body">\n	<span ng-bind-html="::message"></span>\n</div>\n<div class="modal-footer">\n	<button class="confirm btn btn-primary" type="button" ng-click="$dismiss()">OK</button>\n</div>')
}
]),
angular.module("angularjsapp/src/app/components/audience-panel/audience-panel.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/audience-panel/audience-panel.tpl.html", '<div class="audience-summary" ng-if="vm.swf.audienceLists.nextRefresh - vm.swf.audienceLists.timer > 3 || vm.swf.audienceLists.currentPage !== 0"> \n	<span class="summary-number">{{vm.swf.broadcast.viewers}}</span> {{\'audience_viewers_in_audience\' | translate }}</span>\n	<button class="btn-reset pull-right" ng-click="vm.clickToRefresh()"><i class="ynicon ynicon-refresh"></i></button>\n</div>\n<div class="audience-summary refresh" ng-if="vm.swf.audienceLists.nextRefresh - vm.swf.audienceLists.timer <= 3 && vm.swf.audienceLists.currentPage === 0">\n	{{\'audience_refreshing\' | translate }} <span class="summary-number">{{vm.swf.broadcast.viewers}}</span> {{\'audience_viewers_in\' | translate }} {{vm.swf.audienceLists.nextRefresh - vm.swf.audienceLists.timer}}</span>\n	<button class="btn-reset pull-right"><i class="ynicon ynicon-refresh"></i></button>\n</div>\n<div class="audience" id="audiencelist" only-scroll>\n	<div class="audience-page" ng-repeat="page in vm.swf.audienceLists.pages track by $index">\n		<div class="viewer" ng-repeat="viewer in page.audience">\n			\n			<div class="thumb circle-thumb pull-left" ng-click="vm.openProfileSummary(viewer.userId, \'AUDIENCE\')" style="background: url({{vm.thumb}}{{::viewer.userId}}), url({{vm.noThumb}}) no-repeat; background-size: cover;">\n				<i ng-class="::{\'ynicon ynicon-bc-call-nolines\': viewer.isGuest}"></i>\n			</div>\n			\n			<div class="viewer-information">\n\n				<div class="titles" ng-click="vm.openProfileSummary(viewer.userId, \'AUDIENCE\')">\n					<span class="ynbadge" ng-if="viewer.subscriptionType">\n						<img ng-src="{{::vm.config.settings.BadgeBaseUrl}}/{{::vm.swf.broadcast.userId}}/{{::viewer.subscriptionType}}/badge@2x.png" />\n					</span>\n					<span class="viewer-name">\n						<i class="ynicon ynicon-level" ng-if="!viewer.subscriptionType"></i>{{::viewer.level}} {{::viewer.name}}\n					</span>\n				</div>\n\n				<div class="infos" audience-message viewer="viewer">\n					<div class="info viewer-message subscriber" ng-if="::viewer.subscriptionDateUNIX">\n						Subscriber since {{::viewer.subscriptionDateUNIX | date : \'MM/dd/yyyy\'}}\n					</div>\n					<div class="info special-message fanRank" ng-if="::(viewer.fanRank !== -1)">\n						#{{::viewer.fanRank}} {{::\'_fan\' | translate }}\n						<span ng-if="::viewer.bars">\n							<img class="bar" ng-src="{{::vm.baseImageUrlv3}}/icon_bar_sm.png"> {{::viewer.bars}}\n						</span>\n					</div>\n					<div class="info special-message isFan" ng-if="::(viewer.fanRank === -1 && vm.swf.broadcast.userId === vm.session.user.userId)">\n						your fan since {{::viewer.fanDateUNIX | date : \'MMMM d, y\'}}!\n					</div>\n					<div class="info special-message birthday" ng-if="::(viewer.birthdayCopy)">\n						{{::viewer.birthdayCopy}}\n					</div>\n					<div class="info special-message gifts" ng-if="::(viewer.gifts > 0)">\n						specialmessage-gifts:::{{::\'_gave\' | translate }} {{::viewer.gifts}} {{::\'_gifts\' | translate | lowercase }} {{::\'_this_broadcast\' | translate }}!\n					</div>\n					<div class="info special-message viewersRs" ng-if="::(viewer.viewersRs > 0)">\n						{{::\'_brought\' | translate }} {{::viewer.viewersRs}} {{::\'_viewers\' | translate | lowercase }} {{::\'_this_broadcast\' | translate }}!\n					</div>\n					<div class="info viewer-location location" ng-if="::((viewer.location.city.length > 0 || viewer.location.state.length > 0 || viewer.location.country.length > 0))">\n						<span ng-if="::viewer.location.city">{{::viewer.location.city + \',\'}}</span> \n						<span ng-if="::viewer.location.state">{{::viewer.location.state + \',\'}}</span> \n						<span ng-if="::viewer.location.country">{{::viewer.location.country}}</span>\n					</div>\n					<div class="info viewer-message fans" ng-if="::(viewer.fans)">\n						{{::viewer.fans}} {{::\'_fans\' | translate }}\n					</div>\n				</div>\n			</div>\n		</div>\n	</div>\n	<!-- <div class="viewer" ng-repeat="viewer in vm.swf.audience">\n		<div class="thumb circle-thumb pull-left" style="background: url(https://placekitten.com/g/200/300) no-repeat; background-size: cover;">\n			<i ng-if="false" class="ynicon ynicon-bc-call-nolines"></i>\n		</div>\n		<div class="viewer-information">\n			<div class="viewer-name"><i class="ynicon ynicon-level"></i>11 Jose Aquilar</div>\n			<div class="special-message">Birthday Today!</div>\n		</div>\n	</div>\n	<div class="viewer">\n		<div class="thumb circle-thumb pull-left" style="background: url(https://placekitten.com/g/200/300) no-repeat; background-size: cover;">\n			<i ng-if="false" class="ynicon ynicon-bc-call-nolines"></i>\n		</div>\n		<div class="viewer-information">\n			<div class="viewer-name"><i class="ynicon ynicon-level"></i>11 Jose Aquilar</div>\n			<div class="viewer-location">Los Angeles, CA</div>\n		</div>\n	</div> -->\n</div>')
}
]),
angular.module("angularjsapp/src/app/components/buybars-modal/buybars.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/buybars-modal/buybars.tpl.html", '<div class="modal-body" ng-class="{large: modalLarge && activeItem.buying, wide: verification.active}">\n    <div class="overlay" ng-if="!iframeLoaded && config.buybarsiframe">\n        <div class="loader"></div>\n    </div>\n    <div class="panel-one">\n        <button aria-hidden="true" class="close" ng-click="cancel()" type="button">\n            <i class="ynicon ynicon-close"></i>\n        </button>\n        <div class="heading">\n        	<div class="title">Get YouNow Bars</div>\n        	<div class="subtitle">Bars allow you to buy premium gifts for the broadcaster.</div>\n        	<div class="status">\n        		<span>Your Bars: </span>\n    			<img ng-src="{{::config.settings.ServerCDNBaseUrl}}/angularjsapp/src/assets/images/icons_v3/icon_bar_sm.png" />\n    			<span>{{ Api.squashedNumber(session.user.vault.webBars, 5) }}</span>\n    		</div>\n        </div>\n        <div class="content">\n        	<div class="item" ng-click="toggleActiveItem(item)" ng-class="::{popular: item.popular === \'1\'}" ng-repeat="item in products track by $index">\n        		<span class="icon"><img ng-src="{{::config.settings.ServerCDNBaseUrl}}/angularjsapp/src/assets/images/bars/icons/{{::item.SKU}}.png" /></span>\n        		<span class="name"><b>{{::item.name}}</b> ({{::item.amount |number }} Bars)</span>\n        		<span class="popular-copy" ng-if="::(item.popular === \'1\')">- Most Popular</span>\n        		<button class="btn btn-small">${{::item.price}}</button>\n        	</div>\n        </div>\n    </div>\n    <!-- inline -->\n    <div class="panel-two" ng-if="!config.buybarsiframe" ng-class="{\'active\': activeItem.buying}">\n        <button ng-click="toggleActiveItem()" class="btn btn-transparent"><i class="ynicon ynicon-btn-back"></i></button>\n        <div class="heading">\n            <div class="title">Select Payment Method</div>\n            <div class="subtitle">Enter your credit card information below.</div>\n            <div class="item">\n                <span class="icon"><img ng-src="{{::config.settings.ServerCDNBaseUrl}}/angularjsapp/src/assets/images/bars/icons/{{activeItem.SKU}}.png" /></span>\n                <span class="name"> <b>{{activeItem.name}} ({{activeItem.amount | number}} Bars)<span class="sub"> - ${{activeItem.price}}</span></b> </span>\n            </div>\n        </div>\n        <div class="content">\n            <iframe id="braintree-iframe" \n                ng-if="config.buybarsiframe" \n                ng-src="{{::Api.trustedSrc(config.settings.ServerSecureLocalBaseUrl + \'/checkout.php\' )}}">\n            </iframe>\n            <form id="braintree-form" ng-if="!config.buybarsiframe">\n                <div id="braintree-dropin"></div>\n                <input type="submit" ng-disabled="disableBuy" class="btn btn-confirm" value="Submit">\n            </form>\n        </div>\n        <div class="bottom">\n            <div class="copy">By clicking submit you accept or redeem your acceptance of the YouNow <a href="{{\'footer_terms_link\' | translate}}" target="_blank">Terms of service</a> and <a href="{{\'footer_privacy_link\' | translate}}" target="_blank">Privacy Policy</a>.</div>\n        </div>\n    </div>\n    <!-- double iframe -->\n    <div class="panel-three" ng-class="{active: config.buybarsiframeActive}">\n        <div class="content">\n            <iframe id="braintree-iframe" \n                ng-if="config.buybarsiframe" \n                ng-src="{{::Api.trustedSrc(config.settings.ServerSecureLocalBaseUrl + \'/checkout.php?v=\' + config.settings.JS_VERSION )}}">\n            </iframe>\n        </div>\n    </div>\n    <!-- verification -->\n    <div class="panel-four" ng-class="{active: verification.active}">\n        <div class="heading">\n            <div class="title" ng-if="verification.verifyNow">Get Verified!</div>\n            <div class="title" ng-if="!verification.verifyNow">Purchase Successful!</div>\n            <div class="subtitle">\n                <span ng-show="verification.verifyNow">\n                    For your security we want to verify your card to purchase more bars.\n                </span>\n                <b>Your Bars:</b>\n                <span class="icon"><img ng-src="{{::config.settings.ServerCDNBaseUrl}}/angularjsapp/src/assets/images/icons_v3/icon_bar_sm.png"/></span>\n                <b>{{session.user.vault.webBars}}</b>\n            </div>\n        </div>\n        <div class="content" ng-show="verification.verifyNow" ng-class="{\'animate-in\': verification.animate}">\n            <div class="pull-left verification-image">\n                <span class="verification-image-number">{{::verification.sale.high | currency}}</span>\n                <img ng-src="{{::config.settings.ServerCDNBaseUrl}}/angularjsapp/src/assets/images/bars/icons/verify_848_blank.png">\n            </div>\n            <div class="desc">\n                You were charged a little bit less than the normal {{::verification.sale.originalAmount | currency}} price — somewhere between {{::verification.sale.low | currency}} and {{::verification.sale.high | currency}}. We need you to confirm how much (it wont end in $.99).\n                Open up your credit card’s online statement and look for a charge from YOUNOW (or BRAINTREE.COM) in your recent activity. \n                In most cases charges show up instantly, but if you don’t see it, wait a bit (in some cases, up to a day), and come back to verify your bars before you purchase any more.\n            </div>\n            <div class="verification-info">\n                <div class="pull-left">\n                    <i class="ynicon ynicon-icon-verify"></i> \n                </div>\n                <div class="verification-info-copy pull-left">One discounted charge was made on {{::verification.sale.date | date : \'M/d/yy\'}} to your {{::verification.sale.paymentType}} ending in x{{::verification.sale.last4}}</div>\n            </div>\n            <div ng-class="{failed: verification.failed}">\n                <div class="verification-failed">\n                    <div>The amount you entered before, {{::verification.amountAttempted | currency}}, does not match. Try again.</div>\n                    <div><b>Be careful! This is your last try to submit an amount for verification.</b></div>\n                    <div class="text-muted">(Double check your credit card, you can always come back later)</div>\n                </div>\n                <div class="verification-form pull-left">\n                    <form name="verificationForm" novalidate>\n                        <label>Amount of Charge</label>\n                        <span><b>$</b></span>\n                        <input\n                            type="number"\n                            name="verificationAmount" \n                            ng-model="verification.amount"\n                            ng-pattern="\'^[0-9]+(\\.[0-9]{1,2})?$\'"\n                            ng-required="true"\n                            tooltip="{{verification.invalid}}"\n                            tooltip-trigger="show"\n                            tooltip-append-to-body="true"\n                            tooltip-placement="bottom error"\n                            yn-enter="verifyAmount()"\n                            id="verification-tooltip">\n                    </form>\n                </div>\n            </div>\n            <button class="btn btn-confirm verify-now-btn pull-left" ng-disabled="verification.processing" ng-click="verifyAmount()">\n                <span ng-if="!verification.processing">Verify Amount</span>\n                <div class="loader-light" ng-if="verification.processing"></div>\n            </button>\n        </div>\n        <div class="content" ng-if="!verification.verifyNow">\n            <div class="pull-left verification-image">\n                <span class="verification-image-number">{{::verification.sale.high | currency}}</span>\n                <img ng-src="{{::config.settings.ServerCDNBaseUrl}}/angularjsapp/src/assets/images/bars/icons/verify_848_blank.png">\n            </div>\n            <div class="desc verification-sale">\n                <div>For your protection, we need you to verify your credit card before you can purchase any more bars.</div>\n                <div>Its simple, but you will need access to your online credit card statement so you can verify the last charge we made to your card.</div>\n            </div>\n            <button class="btn btn-cancel pull-left" ng-click="cancel()">\n                <span>Verify Later</span>\n            </button>\n            <button class="btn btn-confirm pull-left" ng-click="verification.verifyNowState()">\n                <span>Verify Now</span>\n            </button>\n        </div>\n        <div class="bottom">\n            <div class="contact-support">\n                <span class="text-muted">Need help?</span>\n                <a ng-href="https://younow.zendesk.com/anonymous_requests/new?ticket[subject]=Credit+Card+Verification&ticket[ticket_form_id]=67755&ticket[fields][24381885]={{::verification.sale.last4}}&ticket[fields][23984596]={{::session.user.fullName}}" target="_blank">Contact support</a>\n            </div>\n        </div>\n    </div>\n</div>')
}
]),
angular.module("angularjsapp/src/app/components/buybars-modal/cc-verified.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/buybars-modal/cc-verified.tpl.html", '<div class="modal-body verification-result">\n	<button aria-hidden="true" class="close" ng-click="cancel()" type="button">\n	    <i class="ynicon ynicon-close"></i>\n	</button>\n    <div class="heading">\n        <div class="title">\n        	<span class="is-verified">You\'re Verified!</span>\n        	<div class="is-not-verified">\n                We could not match the amounts to verify your credit card. \n            </div>\n            <span class="is-not-verified text-muted">\n                Please contact support and we will verify you another way quickly.\n            </span>\n        </div>\n    </div>\n    <div class="verified-result-icon is-verified"><i class="ynicon ynicon-icon-verify"></i></div>\n    <div class="verified-result-icon is-not-verified"><i class="ynicon ynicon-icon-verify-reject"></i></div>\n	<button class="btn btn-confirm is-verified" ng-click="cancel()">\n		<span>Ok, Great!</span>\n	</button>\n    <button class="btn btn-confirm is-not-verified" ng-click="contactSupport()">\n        <span>Contact Support</span>\n    </button>\n</div>')
}
]),
angular.module("angularjsapp/src/app/components/chat/chat.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/chat/chat.tpl.html", '<div ng-click="vm.togglePlayerFullscreen();" class="fullscreen-close">\n	<i class="ynicon ynicon-close"></i>\n</div>\n<div class="fullscreen-gradient-top"></div>\n<div class="fullscreen-gradient-left"></div>\n\n<div class="player-chat" ng-class="{\'collapsed\': vm.chatCollapsed}">\n	<div id="sidebar-container" class="pull-left" ng-class="{\'loading-bc\': vm.swf.eob !== undefined && !vm.swf.settingUpBroadcast}">\n		<div class="sidebar-header">\n			<div ng-click="vm.reloadChatTab()" class="tab-icon">\n				<span ng-if="vm.swf.fanMailRequestQueue && vm.swf.fanMailRequestQueue.length > 0"><img ng-class="{\'active-notification\': vm.fanmailAnimState === vm.fanMailAnimation}" class="fanmail-notification" ng-src="{{vm.fanmailAnimState}}"></span>\n				<i ng-class="{active: (vm.swf.activeChatTab === \'Chat\' || vm.swf.activeChatTab === \'SnapShot\') && !vm.swf.settingUpBroadcast}" class="ynicon ynicon-chat"></i>\n			</div>\n			<div ng-click="vm.swf.activeChatTab = \'Audience\'; vm.fanmailAnimState = vm.fanMailAnimation; vm.swf.getAudience(0, 20, true);" class="tab-icon">\n				<i ng-class="{active: vm.swf.activeChatTab === \'Audience\' && !vm.swf.settingUpBroadcast}" class="ynicon ynicon-audience"></i>\n			</div>\n			<div\n				ng-click="vm.togglePlayerFullscreen();"\n				class="pull-right top-icon ynicon-icon-openexternal-container"\n					tooltip="Fullscreen mode"\n					tooltip-trigger="mouseenter"\n					tooltip-placement="top"\n					tooltip-append-to-body="true">\n				<i class="ynicon ynicon-icon-openexternal"></i>\n			</div>\n			<div 	ng-click="vm.pauseChat = !vm.pauseChat"\n					ng-if="vm.session.administrator"\n					ng-class="{active: vm.pauseChat}"\n					class="pull-right top-icon scroll-toggle ynicon-icon-mod-container"\n					tooltip="Pause the chat."\n					tooltip-trigger="mouseenter"\n					tooltip-placement="left"\n					tooltip-append-to-body="true">\n				<i class="ynicon ynicon-icon-mod"></i>\n			</div>\n			<!-- <div ng-click="vm.swf.share();" class="tab-icon">\n				<i ng-class="{active: vm.swf.activeChatTab === \'Snapshot\' && !vm.swf.settingUpBroadcast}" class="ynicon ynicon-camera"></i>\n			</div> -->\n			<!-- <div ng-click="vm.swf.activeChatTab = \'ModForm\'; vm.fanmailAnimState = vm.fanMailAnimation;" ng-class="{active: vm.swf.activeChatTab === \'ModForm\'}" class="tab-icon pull-right mod-form">\n				<i ng-class="{active: vm.swf.activeChatTab === \'ModForm\' && !vm.swf.settingUpBroadcast}" class="ynicon ynicon-flag"></i>\n				{{ \'dashboard_mod_title\' | translate }}\n			</div> -->\n		</div>\n		<div\n		class="sidebar-tab chatcomments-mediumlarge"\n		ng-if="vm.swf.activeChatTab === \'Chat\' && !vm.swf.settingUpBroadcast"\n		ng-class="{\'chatcomments-small\': vm.swf.broadcast && !vm.collapsedGiftTray && vm.swf.broadcast.tfl.length !== 0 && vm.session.user.userId !== 0, \'chatcomments-large\': !vm.swf.broadcast &&  vm.collapsedGiftTray || vm.swf.broadcast.tfl.length === 0 || !vm.swf.broadcast.tfl && vm.collapsedGiftTray, \'chatcomments-medium\': (!vm.swf.broadcast && !vm.collapsedGiftTray || vm.swf.broadcast.tfl.length === 0 && !vm.collapsedGiftTray) && vm.session.user.userId !== 0}"\n		>\n			<button class="prev-fan" id="prevfan" ng-click="vm.changeTopFan(-1)" ng-if="vm.swf.broadcast.tfl.length && vm.topFanPosition!==\'start\'">\n				<img ng-src="{{::vm.baseImageUrlv3}}/chat_topfan_arrow_prev.png">\n			</button>\n			<div id="topfan-slider" ng-class="{\'no-top-fans\': vm.swf.broadcast.tfl.length < 1 || !vm.swf.broadcast.tfl}">\n\n				<div class="top-fan" ng-repeat="fan in vm.swf.broadcast.tfl track by $index">\n					<a\n					class="thumb circle-thumb clickable"\n					ng-style="{background: \'url({{::vm.thumb}}\' + fan.uId + \') no-repeat, url({{::vm.noThumb}}) no-repeat\', \'background-size\': \'cover\'}"\n					ng-href="/{{fan.n}}" prevent-default\n					ng-click="vm.openProfile(fan.uId, undefined, \'TOP_FAN\')">\n					</a>\n					<div class="fan-details">\n						<div>\n							#{{$index + 1}} Fan <img class="bar" ng-src="{{::vm.baseImageUrlv3}}/icon_bar_sm.png"> {{fan.b}}\n						</div>\n						<a\n						class="clickable fan-name"\n						ng-href="/{{fan.n}}" prevent-default\n						ng-click="vm.openProfile(fan.uId, undefined, \'TOP_FAN\')">\n							<i class="ynicon ynicon-level"></i> {{fan.l}} {{fan.n}}\n						</a>\n					</div>\n				</div>\n\n				<div class="top-fan" ng-if="(vm.session.user && vm.session.user.userId) && !vm.swf.isTopFan && (vm.swf.broadcast.userId !== vm.session.user.userId)">\n					<a\n					class="thumb circle-thumb clickable"\n					ng-style="{ background: \'url(\' + vm.thumb + vm.session.user.userId + \'), url({{::vm.noThumb}}) no-repeat\', \'background-size\': \'cover\' }"\n					ng-href="/{{vm.session.user.profile}}" prevent-default\n					ng-click="vm.openProfile(vm.session.user.userId)">\n					</a>\n					<div class="see-text">\n						<span translate="chat_buy_premium_gift_for"></span>\n						<span class="short-text">{{vm.swf.broadcast.username}}</span>\n						<span translate="chat_to_become_top_fan">!</span>\n					</div>\n					<button class="btn btn-small btn-confirm" ng-click="vm.openGiftTray();" translate="chat_see_gifts"></button>\n				</div>\n\n			</div>\n			<div class="topfan-slider-divider" ng-if="vm.swf.broadcast.tfl.length > 0"></div>\n			<!-- fanmail view -->\n			<div class="fan-mail-widget" ng-class="{\'fan-mail-available\': vm.swf.fanMailQueue[0].isShowing}">\n				<a\n				class="thumb circle-thumb pull-left"\n				ng-style="{background: \'url({{::vm.thumb}}\' + vm.swf.fanMailQueue[0].userId +\'), url({{::vm.noThumb}}) no-repeat\', \'background-size\': \'cover\'}"\n				ng-href="/{{vm.swf.fanMailRequestQueue[0].profile}}" prevent-default\n				ng-click="vm.openProfile(vm.swf.fanMailQueue[0].userId)">\n					<img class="fan-mail-icon" ng-src="{{::vm.config.settings.ServerCDNBaseUrl}}/angularjsapp/src/assets/animations/yn_anim_fanmail_132x132bc.gif">\n				</a>\n				<div class="actions">\n					<button ng-click="vm.dismissFanMail()" class="close btn-reset"><i class="ynicon ynicon-close"></i></button>\n				</div>\n				<div class="fan-mail-sender">\n					<a\n					ng-href="/{{vm.swf.fanMailQueue[0].profile}}" prevent-default\n					ng-click="vm.openProfile(vm.swf.fanMailQueue[0].userId)"\n					class="short-text">\n						<span class="ynbadge" ng-if="vm.swf.fanMailQueue[0].subscriptionType">\n							<img \n							ng-src="{{::vm.config.settings.BadgeBaseUrl}}/{{::vm.broadcast.broadcaster.userId}}/{{::vm.swf.fanMailQueue[0].subscriptionType}}/badge@2x.png"\n							/>\n						</span>\n						<i class="ynicon ynicon-level" ng-if="!vm.swf.fanMailQueue[0].subscriptionType"></i> \n						{{vm.swf.fanMailQueue[0].userLevel}} {{vm.swf.fanMailQueue[0].name}}\n					</a>\n					<span class="bar-cont"><img class="bar" ng-src="{{::vm.baseImageUrlv3}}/icon_bar_sm.png"></span>\n					<span class="fan-mail-amount">{{vm.swf.fanMailQueue[0].value}}</span>\n				</div>\n				<div class="fan-mail-message msg-long">\n					{{vm.swf.fanMailQueue[0].comment}}\n				</div>\n			</div>\n			<!-- fanmail req -->\n			<div class="fan-mail-widget" ng-class="{\'fan-mail-available\': vm.swf.fanMailRequestQueue[0].isShowing}">\n				<a\n				class="thumb circle-thumb pull-left"\n				ng-style="{ background: \'url({{::vm.thumb}}\' + vm.swf.fanMailRequestQueue[0].userId + \'), url({{::vm.noThumb}}) no-repeat\', \'background-size\': \'cover\' }"ng-href="/{{vm.swf.fanMailRequestQueue[0].profile}}" prevent-default\n				ng-click="vm.openProfile(vm.swf.fanMailRequestQueue[0].userId)">\n					<img class="fan-mail-icon" ng-src="{{::vm.config.settings.ServerCDNBaseUrl}}/angularjsapp/src/assets/animations/yn_anim_fanmail_132x132bc.gif">\n				</a>\n				<div class="actions">\n					<button ng-click="vm.respondToFanMail(vm.swf.fanMailRequestQueue[0], \'DELIVERED\')" class="accept btn-primary" translate="_accept"></button>\n					<button ng-click="vm.respondToFanMail(vm.swf.fanMailRequestQueue[0], \'CANCELLED\')" class="decline btn-cancel" translate="_decline"></button>\n				</div>\n				<div class="fan-mail-sender">\n					<a\n					ng-href="/{{vm.swf.fanMailRequestQueue[0].profile}}" prevent-default\n					ng-click="vm.openProfile(vm.swf.fanMailRequestQueue[0].userId)"\n					class="short-text">\n						<span class="ynbadge" ng-if="vm.swf.fanMailRequestQueue[0].subscriptionType">\n							<img \n							ng-src="{{::vm.config.settings.BadgeBaseUrl}}/{{::vm.broadcast.broadcaster.userId}}/{{::vm.swf.fanMailRequestQueue[0].subscriptionType}}/badge@2x.png"\n							/>\n						</span>\n						<i class="ynicon ynicon-level" ng-if="!vm.swf.fanMailRequestQueue[0].subscriptionType"></i> \n						{{vm.swf.fanMailRequestQueue[0].level}} {{vm.swf.fanMailRequestQueue[0].name}}\n					</a>\n					<span class="bar-cont"><img class="bar" ng-src="{{::vm.baseImageUrlv3}}/icon_bar_sm.png"></span>\n					<span class="fan-mail-amount">{{vm.swf.fanMailRequestQueue[0].value}}</span>\n				</div>\n				<div class="fan-mail-message">\n					{{vm.swf.fanMailRequestQueue[0].copy}}\n				</div>\n			</div>\n			<button class="next-fan" id="nextfan" ng-click="vm.changeTopFan(1)" ng-if="vm.swf.broadcast.tfl.length && vm.topFanPosition!==\'end\'">\n				<img ng-src="{{::vm.baseImageUrlv3}}/chat_topfan_arrow_next.png">\n			</button>\n			<div id="chatcomments" \n				class="chatcomments {{\'chatMode\'+vm.swf.broadcast.chatMode+\' \'}}"\n				only-scroll \n				>\n				<div class="chatcomment {{ comment.subscriptionType?\'subscriber\':\'not-subscriber\' }}" ng-repeat="comment in vm.swf.broadcast.comments">\n					<span class="ynbadge" ng-if="comment.subscriptionType">\n						<img ng-src="{{::vm.config.settings.BadgeBaseUrl}}/{{::vm.broadcast.broadcaster.userId}}/{{::comment.subscriptionType}}/badge@2x.png" />\n					</span>\n					<span ng-if="::( !comment.subscriptionType && comment.userLevelFloor && comment.role !== 1 && (comment.role !== 4 && comment.role !== 5 && comment.role !== 6) )"><i class="ynicon" ng-class="::{\'ynicon-level\': comment.role !== 1 && comment.role !== 2, \'ynicon-ambass\': comment.role === 2}"></i></span>\n					<span ng-if="::( (comment.role === 4 || comment.role === 5 || comment.role === 6) && comment.userLevelFloor)">\n						<span ng-if="::comment.role === 4">\n							<i class="ynicon ynicon-icon-whale"></i>\n							<i class="ynicon ynicon-icon-whale"></i>\n							<i class="ynicon ynicon-icon-whale"></i>\n						</span>\n						<span ng-if="::comment.role === 5">\n							<i class="ynicon ynicon-icon-whale"></i>\n							<i class="ynicon ynicon-icon-whale"></i>\n						</span>\n						<span ng-if="::comment.role === 6"><i class="ynicon ynicon-icon-whale"></i></span>\n					</span>\n					<span ng-if="::(comment.role !== 1 && comment.userLevelFloor > 1)" class="chat-name level">{{::comment.userLevelFloor}}</span> \n					<a \n					ng-click="vm.openProfile(comment.userId, comment, \'CHAT\')" \n					class="chat-name" \n					ng-if="::comment.role !== 1" \n					ng-href="/{{comment.profileUrlString}}" prevent-default >\n						{{::comment.name}} \n					</a> \n					<span class="chat-name moderator" ng-if="::comment.role === 1">MODERATOR </span> 				\n					<span ng-if="::(!comment.giftId)" ng-class="::{\'special-chat\': comment.role === 2 || comment.isBroadcaster, moderator:  comment.role === 1}" ng-bind-html="::comment.hashedComment"></span>\n					<img class="chat-gift" ng-if="::(comment.giftId !== false)" ng-src="{{::vm.baseImageUrlv3}}/_gifts/{{::vm.swf.giftSkus[comment.giftId]}}.png">\n					<span class="gift-quantity" ng-if="::(comment.giftId !== false && comment.quantity > 1)">{{::comment.quantity}}x</span>\n				</div>\n			</div> \n			<div id="chatinput">\n				<div class="chat-alert-toolbar" ng-class="{\'chat-alert-open\': vm.alert.length > 0}">\n					{{vm.alert}}\n					<progressbar ng-if="vm.spamTimer" value="vm.spamTimeLeft" animate="true" max="60"></progressbar>\n				</div>\n				<form name="vm.commentForm" novalidate>\n					<input \n						placeholder="{{vm.chatInputText()}}"\n						name="commentInput" \n						yn-enter="vm.postComment()" \n						ng-model="vm.newComment"\n						ng-maxlength="150"\n						ng-trim="false"\n						required>\n					<div ng-if="vm.newComment.length < 150" class="characterCount">{{150 - vm.newComment.length}}</div>\n					<div ng-if="!vm.newComment && vm.commentForm.commentInput.$viewValue.length > 150" class="characterCount invalid" >0</div>\n					<button class="btn pull-right" ng-class="{\'dim\': !vm.collapsedGiftTray, \'btn-confirm\': vm.collapsedGiftTray }" ng-click="vm.postComment()" translate="_chat"></button>\n				</form>\n			</div>\n			<div id="gifttray" ng-class="{\'gift-tray-open\': !vm.collapsedGiftTray && vm.session.user.userId !== 0}">\n				<div ng-click="vm.disabledGiftTray()" class="overlay" ng-if="!vm.session.user.userId ||  vm.session.user.banId !== 0 || vm.session.user.moderator === 1"></div>\n				<div class="gifttray-basic" ng-class="{\'disabled-gift\': vm.swf.settingUpBroadcast}" ng-if="vm.collapsedGiftTray">\n					<div class="toggle-tray-btn" ng-click="vm.toggleGiftTray();">\n					    	<i class="ynicon ynicon-carrot-up"></i>\n					    	<i class="ynicon ynicon-gift"></i>\n					</div>\n				</div>\n				<div class="gifttray-basic menu-mode" ng-class="{\'disabled-gift\': vm.swf.settingUpBroadcast}" ng-if="!vm.collapsedGiftTray">\n					<div class="toggle-tray-btn" ng-click="vm.toggleGiftTray();">\n					    	<i class="ynicon ynicon-carrot-dwn"></i>\n					    	<i class="ynicon ynicon-gift"></i>\n					</div>\n				</div>\n				<div class="gifttray-wallet">\n					<span class="current-broadcaster short-text">{{\'_gift\' | translate }} {{vm.swf.broadcast.username}}!</span>\n					<div class="pull-right">\n						<span>\n							<span\n								tooltip="{{vm.session.user.userCoins | number}}"\n								tooltip-trigger="mouseenter"\n								tooltip-enable="vm.session.user.userCoins > 10000"\n								tooltip-append-to-body="true">\n								<img ng-src="{{::vm.baseImageUrlv3}}/menu_user_coins1.png">{{vm.Api.squashedNumber(vm.session.user.userCoins, 4)}}\n							</span>\n							<span\n								tooltip="{{vm.session.user.vault.webBars | number}}"\n								tooltip-trigger="mouseenter"\n								tooltip-enable="vm.session.user.vault.webBars > 10000"\n								tooltip-append-to-body="true">\n								<img ng-src="{{::vm.baseImageUrlv3}}/icon_bar_sm.png"> {{vm.Api.squashedNumber(vm.session.user.vault.webBars, 4)}}\n							</span>\n						</span>\n						<button class="btn btn-confirm btn-small" ng-if="!vm.session.user.spendingDisabled" ng-click="vm.buyBars()" translate="_getbars"></button>\n					</div>\n				</div>\n				<div class="gifttray-extension" only-scroll>\n					<!-- bc gifts -->\n					<img class="gift"\n						ng-repeat="gift in vm.bcGifts track by $index"\n						ng-if="!vm.swf.broadcast.disabledGoodies[gift.SKU] && ( gift.locales.indexOf(vm.swf.broadcast.locale) !== -1 || gift.locales.indexOf(\'ww\') !== -1 ) && vm.session.user.userId === vm.swf.broadcast.userId"\n						ng-src="{{::vm.baseImageUrlv3}}/_gifts/{{::gift.SKU}}.png"\n						tooltip-html-unsafe="{{vm.getMultiplierCost(gift)}}"\n						tooltip-trigger="mouseenter"\n						tooltip-append-to-body="true"\n						ng-click="vm.postGift(gift, undefined, undefined, $event)">\n					<!-- general gifts -->\n		 			<img class="gift"\n		 				ng-repeat="gift in vm.giftItems track by $index"\n			 			ng-if="!vm.swf.broadcast.disabledGoodies[gift.SKU] && ( gift.VIP === 0 || (vm.broadcast.broadcaster.partner === \'1\' && gift.VIP === 2) ) && ( gift.locales.indexOf(vm.swf.broadcast.locale) !== -1 || gift.locales.indexOf(\'ww\') !== -1 )"\n						ng-src="{{::vm.baseImageUrlv3}}/_gifts/{{::gift.SKU}}.png"\n						tooltip-html-unsafe="{{ ( vm.swf.broadcast.chatMode==1 && gift.costType==\'COINS\' && !vm.session.subStatus[vm.swf.broadcast.userId] ) ? \'subscribers only\' : vm.getMultiplierCost(gift) }}"\n						tooltip-trigger="mouseenter"\n						tooltip-append-to-body="true"\n						ng-disabled="vm.session.user.userId === vm.swf.broadcast.userId && gift.SKU !== \'50_LIKES_BROADCASTER\'"\n						ng-class="{\'disabled-gift no-cursor\': gift.minLevel > vm.session.user.realLevel || gift.cost > vm.session.user.userCoins || vm.swf.settingUpBroadcast || ( (vm.session.user.userId === vm.swf.broadcast.userId)) || ( vm.swf.broadcast.chatMode==1 && gift.costType==\'COINS\' && !vm.session.subStatus[vm.swf.broadcast.userId] ) }"\n						ng-click="vm.postGift(gift, undefined, undefined, $event)">\n			 	</div>\n			 	<div class="gifttray-premium" ng-class="{\'premium-selected\': vm.premiumGiftSelected.opened && vm.session.user.userId !== 0}">\n			 		<i class="ynicon ynicon-close" ng-click="vm.closeGiftTray()"></i>\n			 		<!-- normal premium gift -->\n			 		<img class="premium-gift" ng-if="vm.premiumGiftSelected.SKU !== \'TIP\' && vm.premiumGiftSelected.SKU !== \'PROPOSAL_RING\' && vm.premiumGiftSelected.SKU !== \'FANMAIL\'" ng-src="{{::vm.baseImageUrlv3}}/_gifts/{{vm.premiumGiftSelected.SKU}}_2x.png">\n			 		<!-- tip -->\n			 		<img class="premium-gift" ng-if="vm.premiumGiftSelected.SKU === \'TIP\'" ng-src="{{::vm.baseImageUrlv3}}/_gifts/_overlay/gift_overlay_{{vm.premiumGiftSelected.SKU.toLowerCase()}}_2x.png">\n			 		<!-- proposal -->\n			 		<div class="premium-gift" ng-if="vm.premiumGiftSelected.SKU === \'PROPOSAL_RING\'">\n				 		<img class="premium-gift" ng-src="{{::vm.baseImageUrlv3}}/_gifts/_overlay/gift_overlay_{{vm.premiumGiftSelected.SKU.toLowerCase()}}_2x.png">\n	 					<div class="thumb proposal" ng-style="{background: \'url({{::vm.thumb}}\' + vm.session.user.userId +\'), url({{::vm.noThumb}}) no-repeat\', \'background-size\': \'cover\'}"></div>\n			 		</div>\n			 		<!-- fanmail -->\n			 		<div class="premium-gift" ng-if="vm.premiumGiftSelected.SKU === \'FANMAIL\'">\n				 		<img class="fanmail" ng-src="{{::vm.config.settings.ServerCDNBaseUrl}}/angularjsapp/src/assets/animations/yn_anim_fanmail_132x132bc.gif">\n	 					<div class="thumb circle-thumb" ng-style="{background: \'url({{::vm.thumb}}\' + vm.session.user.userId +\'), url({{::vm.noThumb}}) no-repeat\', \'background-size\': \'cover\'}"></div>\n				 	</div>\n			 		<div class="premium-gift-name" ng-class="{\'fanmail-name\': vm.premiumGiftSelected.SKU === \'FANMAIL\'}">\n			 			<span>{{vm.premiumGiftSelected.name}}</span>\n			 			<span class="short-text" ng-if="vm.premiumGiftSelected.SKU === \'TIP\'">{{vm.swf.broadcast.username}}!</span>\n			 		</div>\n			 		<div class="premium-gift-desc" ng-if="vm.premiumGiftSelected.SKU === \'50_LIKES\'">\n			 			<span translate="_give"></span>\n			 			<span class="short-text"> {{vm.swf.broadcast.username}}</span>\n			 			<span translate="chat_fifty_likes_to_help_trend"></span>\n			 		</div>\n			 		<div class="premium-gift-desc" ng-if="vm.premiumGiftSelected.SKU === \'50_LIKES_BROADCASTER\'">\n			 			<span translate="chat_fifty_likes_to_help_trend_broadcaster"></span>\n			 		</div>\n			 		<div class="premium-gift-desc" ng-if="vm.premiumGiftSelected.SKU === \'CHATCOOLDOWN\'">\n			 			<div class="cooldown-timer">\n			 				<span translate="chat_wait_time"></span>\n			 				<span>{{vm.cooldownTime * 1000 | date: \'mm:ss\'}}</span>\n			 			</div>\n			 		</div>\n			 		<div class="premium-gift-desc fanmail-desc" ng-if="vm.premiumGiftSelected.SKU === \'FANMAIL\'">\n			 			<span>Send</span>\n			 			<span class="short-text"> {{vm.swf.broadcast.username}}</span>\n			 			<span translate="chat_special_message_to_get_featured"></span>\n			 			<input\n			 			 	class="fanmail-input"\n			 			 	ng-class="{\'input-invalid\': vm.fanmailInvalid && (vm.fanMailMessage.length === 0 || !vm.fanMailMessage)}"\n			 			 	placeholder="Enter your message"\n			 			 	ng-model="vm.fanMailMessage"\n			 			 	ng-maxlength="38"\n			 			 	ng-required\n			 			 	yn-enter="vm.buyGift()"\n			 			 	maxlength="38">\n			 			<span class="fanmail-count">{{38 - vm.fanMailMessage.length}}</span>\n			 		</div>\n			 		<div class="premium-gift-desc" ng-if="vm.premiumGiftSelected.SKU === \'PROPOSAL_RING\'">\n			 			<span translate="_ask"></span>\n			 			<span class="short-text"> {{vm.swf.broadcast.username}}</span>\n			 			<span translate="chat_to_marry_you"></span>\n			 		</div>\n			 		<div class="premium-gift-desc" ng-if="vm.premiumGiftSelected.SKU === \'TIP\'">\n			 			<div class="tip-cost" ng-repeat="tip in vm.premiumGiftSelected.extraData.denominations" ng-click="vm.buyGift(tip)" ng-disabled="vm.premiumGiftSelected.buying || !vm.premiumGiftSelected.opened">\n							<div class="tip-bar" ng-style="::{background: \'url({{::vm.baseImageUrlv3}}/_gifts/BAR.png) no-repeat\', \'background-size\': \'100% 100%\'}"></div>\n			 				<span>{{::tip | number}}</span>\n			 			</div>\n			 		</div>\n			 		<button class="btn btn-confirm" id="buy-gift-button" ng-click="vm.buyGift()" ng-if="!vm.premiumGiftSelected.buying && vm.premiumGiftSelected.SKU !== \'TIP\'">\n			 			<span ng-if="vm.premiumGiftSelected.dynamicCost !== \'0\' && vm.premiumGiftSelected.SKU !== \'CHATCOOLDOWN\'"><span translate="_buy"></span> <img class="bar-sm" ng-src="{{::vm.baseImageUrlv3}}/icon_bar_sm.png"> {{vm.swf.dynamicPricedGoodies[vm.premiumGiftSelected.SKU]}}</span>\n			 			<span ng-if="vm.premiumGiftSelected.dynamicCost !== \'0\' && vm.premiumGiftSelected.SKU === \'CHATCOOLDOWN\'"><span translate="_chat_now"></span> <img class="bar-sm" ng-src="{{::vm.baseImageUrlv3}}/icon_bar_sm.png"> {{vm.swf.dynamicPricedGoodies[vm.premiumGiftSelected.SKU]}}</span>\n			 			<span ng-if="vm.premiumGiftSelected.dynamicCost === \'0\'"><span translate="_buy"></span> <img class="bar-sm" ng-src="{{::vm.baseImageUrlv3}}/icon_bar_sm.png"> {{vm.premiumGiftSelected.purchasePrice}}</span>\n			 		</button>\n			 		<button class="btn btn-confirm" ng-if="vm.premiumGiftSelected.buying">\n			 			<div class="loader"></div>\n			 		</button>\n			 	</div>\n			</div>\n		</div>\n		<div ng-if="vm.swf.activeChatTab === \'Snapshot\' " class="sidebar-tab" id="snapshotpanel">\n			<div class="close-header">\n				<button ng-click="vm.reloadChatTab()" class="close btn-reset"><i class="ynicon ynicon-close"></i></button>\n			</div>\n\n			<div class="snapshot-image" ng-class="{retake: vm.swf.snapshot.retake}">\n				<img class="snapshot-image-img" ng-src="data:image/jpeg;base64,{{vm.swf.snapshot.snapshot}}" />\n				<i\n					id="snapshot-retake"\n					class="snapshot-btn snapshot-retake ynicon ynicon-camera"\n					ng-click="vm.newSnapshot()"\n					tooltip="{{\'chat_already_shared_snapsho_take_another\' | translate }}"\n					tooltip-append-to-body="true"\n					tooltip-trigger="show">\n				</i>\n			</div>\n\n			<div class="share-title short-text">{{ \'_promote\' | translate }} {{vm.swf.broadcast.username}}!</div>\n			<div class="share-message">\n				<form name="vm.shareForm" novalidate>\n					<input\n						placeholder="{{\'chat_add_a_message\' | translate }}"\n						name="share_message"\n						ng-model="vm.swf.broadcast.share_message"\n						ng-maxlength="60"\n						ng-trim="false"\n						maxlength="60">\n					</input>\n				</form>\n				<div ng-if="vm.swf.broadcast.share_message && vm.swf.broadcast.share_message.length < 60" class="character-count">{{60 - vm.swf.broadcast.share_message.length}}</div>\n				<div ng-if="vm.swf.broadcast.share_message && vm.shareForm.share_message.$viewValue.length >= 60" class="character-count invalid" >0</div>\n			</div>\n			<div class="share-actions">\n\n				<button class="btn-reset btn-facebook" ng-disabled="vm.swf.snapshot.sharing.facebook" tooltip="{{\'chat_share_to\' | translate }} Facebook" tooltip-trigger="mouseenter" ng-click="vm.attemptShare(\'facebook\')" ng-class="{active: vm.swf.snapshot.shared.facebook}">\n					<div ng-if="vm.swf.snapshot.sharing.facebook" class="loader"></div>\n					<span ng-if="!vm.swf.snapshot.sharing.facebook">\n						<i class="ynicon ynicon-icon-share-fb" ng-if="!vm.swf.broadcast.shared.facebook"></i>\n						<i class="ynicon ynicon-icon-share-fb-on" ng-if="vm.swf.broadcast.shared.facebook"></i>\n					</span>\n					<div>\n						<span ng-if="!vm.swf.snapshot.sharing.facebook && !vm.swf.snapshot.shared.facebook" translate="_share"></span>\n						<span ng-if="vm.swf.snapshot.shared.facebook" translate="_shared"></span>\n						<span ng-if="vm.swf.snapshot.sharing.facebook" translate="_sharing"></span>\n					</div>\n				</button>\n\n				<button class="btn-reset btn-twitter" ng-disabled="vm.swf.snapshot.sharing.twitter" tooltip="{{\'chat_share_to\' | translate }} Twitter" tooltip-trigger="mouseenter" ng-click="vm.attemptShare(\'twitter\')" ng-class="{active: vm.swf.snapshot.shared.twitter}">\n					<div ng-if="vm.swf.snapshot.sharing.twitter" class="loader"></div>\n					<span ng-if="!vm.swf.snapshot.sharing.twitter">\n						<i class="ynicon ynicon-icon-share-tw" ng-if="!vm.swf.broadcast.shared.twitter"></i>\n						<i class="ynicon ynicon-icon-share-tw-on" ng-if="vm.swf.broadcast.shared.twitter"></i>\n					</span>\n					<div>\n						<span ng-if="!vm.swf.snapshot.sharing.twitter && !vm.swf.snapshot.shared.twitter" translate="_tweet"></span>\n						<span ng-if="vm.swf.snapshot.shared.twitter" translate="_tweeted"></span>\n						<span ng-if="vm.swf.snapshot.sharing.twitter" translate="_tweeting"></span>\n					</div>\n				</button>\n\n				<button class="btn-reset btn-invite" ng-disabled="vm.swf.snapshot.sharing.younow" tooltip="{{\'chat_invite_your_friends\' | translate }}" tooltip-trigger="mouseenter" ng-click="vm.attemptShare(\'invite\')" ng-class="{active: vm.swf.broadcast.shared.younow}">\n					<div ng-if="vm.swf.snapshot.sharing.younow" class="loader"></div>\n					<span ng-if="!vm.swf.snapshot.sharing.younow">\n						<i class="ynicon ynicon-icon-share-restream" ng-if="!vm.swf.broadcast.shared.younow"></i>\n						<i class="ynicon ynicon-icon-share-restream-on" ng-if="vm.swf.broadcast.shared.younow"></i>\n					</span>\n					<div>\n						<span ng-if="!vm.swf.snapshot.sharing.younow && !vm.swf.snapshot.shared.younow" translate="_invite"></span>\n						<span ng-if="vm.swf.snapshot.shared.younow" translate="_invited"></span>\n						<span ng-if="vm.swf.snapshot.sharing.younow" translate="_inviting"></span>\n					</div>\n				</button>\n\n			</div>\n		</div>\n		<div ng-if="vm.swf.activeChatTab === \'Audience\'">\n			<span audience-panel class="sidebar-tab" id="audiencepanel"></span>\n		</div>\n		<!-- <div ng-if="vm.swf.activeChatTab === \'ModForm\'">\n			<div mod-form class="sidebar-tab" id="modform"></div>\n		</div> -->\n		<div ng-if="vm.swf.settingUpBroadcast" class="sidebar-tab" id="settinguppanel">\n			<div settingup-panel class="sidebar-tab" id="settinguppanel"></div>\n		</div>\n	</div>\n</div>\n');
}
]),
angular.module("angularjsapp/src/app/components/confirm-modal/confirm.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/confirm-modal/confirm.tpl.html", '<div class="modal-body">{{message}}</div>\n<div class="modal-footer">\n	<button class="btn btn-confirm" type="button" ng-click="$close()">{{ \'_yes\' | translate }}</button>\n	<button class="btn btn-cancel" type="button" ng-click="$dismiss()">{{ \'_cancel\' | translate }}</button>\n</div>')
}
]),
angular.module("angularjsapp/src/app/components/editors-pick-modals/ep-congrats.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/editors-pick-modals/ep-congrats.tpl.html", '<div class="modal-body">\n    <button aria-hidden="true" class="pull-right close" ng-click="$dismiss()" type="button">\n        <i class="ynicon ynicon-close"></i>\n    </button>\n    <div class="panel-one">\n        <div class="ep-thumb">\n            <div class="circle-thumb" ng-style="::{\'background\': \'url(\'+modal.thumb+\') no-repeat, url(\'+modal.nothumb+\') no-repeat\', \'background-size\': \'cover\'}"></div>\n            <div class="ep-badge pull-left">\n                <i class="ynicon ynicon-level"></i> Editor\'s Choice\n            </div>\n        </div>\n        <h4 class="ep-tag">#{{::modal.session.user.editorsPick.tag}}</h4>\n        <h3 class="title">Congratulations!</h3>\n        <p class="ep-desc">\n            Because of your talent and broadcast quality, you have been selected as Editor\'s Choice for <b>#{{::modal.session.user.editorsPick.tag}}</b>!\n        </p>\n        <div class="bottom">\n            <button class="btn btn-confirm btn-wide" ng-click="modal.continue()">Continue</button>\n        </div>\n    </div>\n    <div class="panel-two" ng-class="{\'active\': modal.state === \'description\'}">\n        <h3 class="title">What does Editor\'s Choice Mean?</h3>\n        <div class="sub-title">As Editor\'s choice for <b>#{{::modal.session.user.editorsPick.tag}}</b>, this means:</div>\n        <ul class="ep-list">\n            <li>\n                Your profile will display the "Editor\'s Choice" badge, letting others know you have been handpicked by YouNow staff\n                <div class="ep-badge">\n                    <i class="ynicon ynicon-level"></i> Editor\'s Choice\n                </div>\n            </li>\n            <li>\n                When you broadcast on <b>#{{::modal.session.user.editorsPick.tag}}</b>, you will receive a boost to give your broadcast more visibility\n            </li>\n            <li>\n                You will gain more fans, who are specifically interested in <b>#{{::modal.session.user.editorsPick.tag}}</b> content\n            </li>\n        </ul>\n        <div class="bottom">\n            <button class="btn btn-confirm btn-wide" ng-click="modal.continue()">Sounds Good!</button>\n        </div>\n    </div>\n</div>\n')
}
]),
angular.module("angularjsapp/src/app/components/editors-pick-modals/ep-expired.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/editors-pick-modals/ep-expired.tpl.html", '<div class="modal-body ep-expired">\n    <button aria-hidden="true" class="pull-right close" ng-click="$dismiss()" type="button">\n        <i class="ynicon ynicon-close"></i>\n    </button>\n    <div class="ep-thumb">\n        <div class="circle-thumb" ng-style="::{\'background\': \'url(\'+modal.thumb+\') no-repeat, url(\'+modal.nothumb+\') no-repeat\', \'background-size\': \'cover\'}"></div>\n        <div class="ep-badge pull-left">\n            <i class="ynicon ynicon-level"></i> Editor\'s Choice\n        </div>\n    </div>\n    <h4 class="ep-tag">#{{::modal.session.user.editorsPick.tag}}</h4>\n    <h3 class="title">Your Editor\'s Choice Status is up.</h3>\n    <p class="ep-desc">\n        Hi {{::modal.name}}, we\'re excited we were able to help you grow your audience. We hope you\'ve enjoyed your time as Editor\'s Choice <b>#dance</b>. To be considered for Editor\'s Choice in the future, keep creating great broadcast content!\n    </p>\n    <div class="bottom">\n        <button class="btn btn-confirm btn-wide" ng-click="modal.continue()">Continue</button>\n    </div>\n</div>\n')
}
]),
angular.module("angularjsapp/src/app/components/fan-button/fan-button.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/fan-button/fan-button.tpl.html", '<button class="btn btn-small btn-fan {{fanStatus[channel.userId]?\'btn-fanned\':\'btn-to-fan\'}} {{subStatus[channel.userId]?\'is-subscribed\':\'not-subscribed\'}}" ng-if="!hidden" ng-click="toggleFan()" >\n	<span class="tofan" ng-if="!fanStatus[channel.userId]">\n		<i class="ynicon ynicon-user-add"></i> {{\'_fan\' | translate}}\n	</span>\n	<span class="fanned" ng-if="fanStatus[channel.userId]">\n		<i class="ynicon ynicon-user-check"></i> {{\'_fanned\' | translate}}\n	</span>\n</button>\n')
}
]),
angular.module("angularjsapp/src/app/components/footer/footer.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/footer/footer.tpl.html", '<div class="newFooter" style="padding: 22px 0;background: #f7f7f7">\n\n	<!-- Start Container -->\n	<div class="container">\n		<!-- Links -->\n		<div class="section footerlinks" style="font-size:13px;display:inline;margin-left:10px;margin-right:10px;">\n			<p style="line-height:18px;margin-top:7px;">\n				<a href="javascript:void(0)" ng-click="showAbout()" ng-if="state.current.name!=\'about\'" translate="footer_about_title"></a>\n				<span class="footerdivider" ng-if="state.current.name!=\'about\'">|</span>\n				<a href="/featured" ng-click="doAboutClick(\'Footer link\', \'Live Now\')" ng-if="state.current.name===\'about\' && open" translate="footer_live_title" mobile-hide></a>\n				<span class="footerdivider" ng-if="state.current.name===\'about\' && open" mobile-hide>|</span>\n				<a href="/jobs" ng-click="doAboutClick(\'Footer link\', \'Jobs\')" target="_blank" translate="footer_jobs_title"></a>\n				<span class="footerdivider">|</span>\n				<a href="http://blog.younow.com/" ng-click="doAboutClick(\'Footer link\', \'Blog\')" target="_blank" translate="footer_blog_title"></a>\n				<span class="footerdivider">|</span>\n				<a ng-href="{{\'footer_terms_link\' | translate}}" ng-click="openDoc($event,\'Terms\')" translate-cloak translate="footer_terms_title"></a>\n				<span class="footerdivider">|</span>\n				<a ng-href="{{\'footer_rules_link\' | translate}}" ng-click="openDoc($event,\'Rules\')" translate-cloak translate="footer_rules_title"></a>\n				<span class="footerdivider">|</span>\n				<a ng-href="{{\'footer_privacy_link\' | translate}}" ng-click="openDoc($event,\'Privacy\')" translate-cloak translate="footer_privacy_title"></a>\n				<span class="footerdivider">|</span>\n				<a ng-href="{{\'footer_trust_link\' | translate}}" ng-click="openDoc($event,\'Trust\')" translate-cloak translate="footer_trust_title"></a>\n				<span class="footerdivider">|</span>\n				<a href="https://younow.zendesk.com/home" ng-click="doAboutClick(\'Footer link\', \'FAQ\')" target="_blank" translate="footer_faq_title"></a>\n				<span class="footerdivider">|</span>\n				<a href="https://itunes.apple.com/app/apple-store/id471347413?mt=8&pt=669563&ct=d-web-footer-1" ng-click="doAboutClick(\'Footer link\', \'iOS\')" target="_blank" translate="footer_ios_title"></a>\n				<span class="footerdivider">|</span>\n				<a href="https://play.google.com/store/apps/details?id=younow.live&referrer=utm_source%3Dyounow.com%26utm_campaign%3Dapp-promo-android%26utm_medium%3Dreferral%26utm_content%3Dd-web-footer-1" ng-click="doAboutClick(\'Footer link\', \'Android\')" target="_blank" translate="footer_android_title"></a>\n				<span class="footerdivider">|</span>\n				<a href="/partners/" ng-click="doAboutClick(\'Footer link\', \'Partners\')" target="_blank" translate="footer_partners_title"></a>\n				<span class="footerdivider">|</span>\n				<a href="/policy/de/impressum" target="_blank" ng-if="config.preferredLocale === \'de\'">Impressum</a>\n				<br>\n				<a href="/recentlyjoined.php" ng-click="doAboutClick(\'Footer link\', \'Joined\')" class="light" target="_blank" translate="footer_joined_title"></a>\n				<span class="footerdivider">|</span>\n				<a href="/recentlybroadcasted.php" ng-click="doAboutClick(\'Footer link\', \'Broadcasted\')" class="light" target="_blank" translate="footer_broadcasted_title"></a>\n				<span class="footerdivider">|</span>\n				<a href="/recentlyloggedin.php" ng-click="doAboutClick(\'Footer link\', \'Loggedin\')" class="light" target="_blank" translate="footer_onyounow_title"></a>\n			</p>\n		</div>\n		<!-- End Links-->\n			<!-- Social -->\n\n			<div class="section footericons">\n				<a href="https://www.facebook.com/younow" ng-click="doAboutClick(\'Footer link\', \'Facebook\')" target="_blank">\n					<img ng-src="{{::cdn.image}}/partners/icon_foot_fb.png" name="fbbutton" height="33" width="33"></a>\n				<a href="https://www.twitter.com/younow" ng-click="doAboutClick(\'Footer link\', \'Twitter\')" target="_blank">\n					<img ng-src="{{::cdn.image}}/partners/icon_foot_tw.png" name="twbutton" height="33" width="33"></a>\n				<a href="http://www.instagram.com/younow" ng-click="doAboutClick(\'Footer link\', \'Instagram\')" target="_blank">\n					<img ng-src="{{::cdn.image}}/partners/icon_foot_insta.png" name="instabutton" height="33" width="33"></a>\n				<a href="http://blog.younow.com/" ng-click="doAboutClick(\'Footer link\', \'Tumblr\')" target="_blank">\n					<img ng-src="{{::cdn.image}}/partners/icon_foot_tm.png" name="tmbutton" height="33" width="33"></a>\n				<a href="https://www.youtube.com/user/YouNowlive" ng-click="doAboutClick(\'Footer link\', \'Youtube\')" target="_blank">\n					<img ng-src="{{::cdn.image}}/partners/icon_foot_yt.png" name="ytbutton" height="33" width="33"></a>\n			</div>\n			<!-- End Social -->\n			<div class="clear"></div>\n	</div>\n	<font color="#d8d8d8">\n		<!-- End Container -->\n	</font>\n</div>\n')
}
]),
angular.module("angularjsapp/src/app/components/gate-modal/gate-modal.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/gate-modal/gate-modal.tpl.html", '<div class="modal-body row">\n	<div class="gate-title">{{data.title|translate}}</div>\n	<div class="gate-message">{{data.message|translate}}</div>\n	<button class="btn flat-login btn-confirm" ng-click="respond(false)">{{data.decline|translate}}</button>\n	<button class="btn flat-login btn-confirm" ng-click="respond(true)">{{data.confirm|translate}}</button>\n</div>')
}
]),
angular.module("angularjsapp/src/app/components/header/header.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/header/header.tpl.html", '<div class="navbar">\n	<div class="navbar-content">\n		<a class="nav-logo pull-left" href="" ng-click="clickLogo()">\n			<i class="ynicon ynicon-social-yn"></i>\n		</a>\n<!-- 		<a class="nav-logo" ng-href="/about" mobile-show>\n			<img ng-src="{{::cdn.image}}/younow_header/younow-hd.png">\n		</a> -->\n		<yn-search-bar></yn-search-bar>\n		<div class="explore-text pull-left">\n			<a ng-href="/explore/" translate="header_explore" ng-click="goToExplore()"></a>\n		</div>\n		<div class="user-actions pull-right">\n			<!-- logged in header options -->\n			<div ng-if="session.loggedIn">\n				<button class="pull-left btn btn-primary" ng-click="goLive()" translate="header_golive"></button>\n				<button class="btn btn-confirm" ng-href="{{\'dashboard_mod_link\'|translate}}" prevent-default ng-click="openModForm((\'dashboard_mod_link\'|translate))" type="button">\n					<span translate="dashboard_mod_title"></span>\n				</button>\n				<div class="pull-right">\n					<div class="languages pull-left" dropdown>\n						<button class="btn btn-transparent dropdown-toggle" dropdown-toggle>\n							<i class="ynicon ynicon-icon-languages"><span>{{config.preferredLocale.toUpperCase()}}</span></i>\n						</button>\n					   	<ul class="dropdown-menu" role="menu">\n							<i class="ynicon ynicon-carrot-up"></i>\n					        <li ng-repeat="locale in ::locales | orderBy:\'name\'">\n					          <a href ng-click="setLocale(locale.locale)"><i ng-if="config.preferredLocale == locale.locale" class="ynicon ynicon-icon-check"></i> {{::locale.name}}</a>\n					        </li>\n					    </ul>\n					</div>\n					<div class="notifications pull-left">\n						<div class="btn-group" id="notifications-dropdown" dropdown>\n							<button class="btn btn-transparent" dropdown-toggle ng-click="checkNotifications($event)">\n								<i class="ynicon ynicon-notifications"></i>\n							</button>\n							<div class="dropdown-menu">\n								<i class="ynicon ynicon-carrot-up"></i>\n								<div class="feed mini-scroll" only-scroll infinite-scroll="session.getNotifications()" can-load="!session.noMoreNotifications" threshold="300">\n									<ul class="list">\n										<li ng-repeat="notification in session.notifications" \n												ng-class="{new: notification.new}"\n												ng-click="openNotification(notification)">\n											<div class="notification-item">\n												<div class="circle-thumb pull-left" ng-style="{background: \'url(\' + cdn.thumb+notification.eventUserId + \')  no-repeat, url(\' + config.settings.ServerCDNBaseUrl  + \'/images/nothumb.jpg) no-repeat\', \'background-size\': \'cover\'}"></div>\n												<div class="description line-clamp pull-left">\n													<div class="name">\n														<span>{{notification.userName}}</span> {{notification.template}}\n													</div>\n													<div class="time-ago">{{notification.timeAgo}}</div>\n												</div>\n											</div>\n										</li>\n									</ul>\n								</div>\n								<div ng-show="(!session.notifications || session.notifications.length === 0) && session.noMoreNotifications" class="empty">\n									<span translate="header_this_is_where_your_notifications_appear"></span>\n								</div>\n								<div class="settings-link clickable" ng-click="openSettings(\'notifications\')" translate="header_settings"></div>\n							</div>\n						</div>\n						<div class="chiclet" ng-show="session.notificationCount">\n							<span class="count">{{session.notificationCount}}</span>\n							<audio id="notificationSound">\n								<source ng-src="{{::cdn.base + \'/audio/notification_feed/younow_notifications.wav\'}}" type="audio/x-wav">\n							</audio>\n						</div>\n					</div>\n					<div class="user-menu pull-left" dropdown is-open="userMenuOpened">\n						<div ng-click="selfProfile()" ng-mouseleave="dismissUserMenu(true)" ng-mouseenter="userMenuOpened = true; dismissUserMenu(false)">\n							<div class="circle-thumb clickable pull-left" ng-style="{background: \'url(\'+cdn.base+\'/php/api/channel/getImage/channelId=\'+session.user.userId+\') no-repeat\', \'background-size\': \'cover\'}"></div>\n							<div class="main-menu clickable pull-left">\n								<i class="ynicon" ng-class="{\'ynicon-carrot-up\': userMenuOpened, \'ynicon-carrot-dwn\': !userMenuOpened }"></i>\n							</div>\n							<div class="clear"></div>\n						</div>		\n						<ul class="dropdown-menu" ng-mouseleave="userMenuOpened = false" ng-mouseenter="userMenuOpened = true; dismissUserMenu(false)">\n							<i class="ynicon ynicon-carrot-up"></i>\n							<li class="user">\n								<div class="user-title">{{session.user.profile}}</div>\n								\n								<div class="user-progress">\n									<div class="user-progress-text">{{\'header_progress\' | translate }}: {{session.user.progress}}% {{\'header_tolevel\' | translate }} {{session.user.level+1}}</div>\n									<div class="user-progress-bar"><div class="user-progress-value" style="width:{{session.user.progress}}%;"></div></div>\n								</div>\n									\n								<div class="user-credits">\n									<span>\n										<span\n											tooltip="{{session.user.userCoins | number}}"\n											tooltip-trigger="mouseenter" \n											tooltip-enable="session.user.userCoins > 10000">\n											<img ng-src="{{::config.settings.ServerCDNBaseUrl}}/angularjsapp/src/assets/images/icons_v3/menu_user_coins1.png" style="margin: 0 -1px 0 -4px;" />\n											<span>{{Api.squashedNumber(session.user.userCoins, 4)}}</span>\n										</span>\n									</span>\n									<span>\n										<span\n											tooltip="{{session.user.vault.webBars | number}}" \n											tooltip-trigger="mouseenter" \n											tooltip-enable="session.user.vault.webBars > 10000">\n											<img ng-src="{{::config.settings.ServerCDNBaseUrl}}/angularjsapp/src/assets/images/icons_v3/icon_bar_sm.png" style="margin: 0 2px 0 7px;" />\n											<span>{{Api.squashedNumber(session.user.vault.webBars, 4)}}</span>\n										</span>\n									</span>\n									<span ng-if="!session.user.spendingDisabled">\n										<span>\n											<button class="btn btn-small btn-confirm" ng-click="getBars()" translate="header_getbars"></button>\n										</span>\n									</span>\n								</div>\n								\n							</li>\n							<li>\n								<a ng-if="isPartner(\'pending\')" ng-href="/partners/earnings" target="_blank">\n									<img class="ynicon" ng-src="{{::cdn.image}}/topnav/menu_user_partner.png">\n									<span translate="header_partner_program"></span>\n								</a>\n							</li>\n							<li>\n								<a ng-if="isPartner(\'active\')" ng-href="/partners/earnings" target="_blank">\n									<img class="ynicon" ng-src="{{::cdn.image}}/topnav/menu_user_partner.png">\n									<span translate="header_earnings"></span>\n								</a>\n							</li>\n							<li>\n								<a ng-click="selfProfile()" ng-href="/{{session.user.profile}}/channel" prevent-default>\n									<i class="ynicon ynicon-user"></i>\n									<span translate="header_profile"></span>\n								</a>\n							</li>\n							<li>\n								<a ng-click="openSettings()" ng-href="/settings" prevent-default>\n									<i class="ynicon ynicon-settings"></i>\n									<span translate="header_settings"></span>\n								</a>\n							</li>\n							<li>\n								<a ng-click="session.showInviteUsers()" href>\n									<i class="ynicon ynicon-audience"></i>\n									<span translate="header_invite_friends"></span>\n								</a>\n							</li>\n							<li>\n								<a ng-click="session.logout()" href>\n									<i class="ynicon ynicon-logout"></i>\n									<span translate="header_logout"></span>\n								</a>\n							</li>\n						</ul>\n					</div>\n				</div>\n			</div>\n			<!-- logged out header options -->\n			<div class="pull-right" ng-if="!session.loggedIn">\n				<span class="login-text">\n					<a href="" ng-click="session.showLoginModal(\'\',\'BUTTON\'); loginClick(\'Click Signup\');" translate="header_signup"></a>\n				</span>\n				<span class="login-text">\n					<a href="" ng-click="session.showLoginModal(\'\',\'BUTTON\'); loginClick(\'Click Login\');" translate="header_login"></a>\n				</span>\n				<button class="btn btn-primary" ng-click="getTheApp()" translate="header_get_the_app"></button>\n			</div>\n		</div>\n	</div>\n</div>')
}
]),
angular.module("angularjsapp/src/app/components/header/searchresult.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/header/searchresult.tpl.html", '<div ng-if="match.model.objectID" class="searchResult">\n	<div class="circle-thumb pull-left" ng-attr-style="{{$parent.$parent.$parent.$parent.cdn.background(match.model.objectID)}}">\n		<div class="live" ng-show="match.model.tag"><i class="ynicon ynicon-broadcast"></i></div>\n	</div>\n	<div class="pull-left userInfo">\n		<div class="name pull-left">\n			<i class="ynicon ynicon-level"></i><span>{{match.model.level}}</span>\n			<span class="short-text">{{match.model.fullName}}</span>\n		</div>\n		<div ng-show="match.model.viewers" class="viewers pull-right">\n			<img ng-src="{{$parent.$parent.$parent.cdn.base}}/images/younow_header/icon_viewers_search.png">{{match.model.viewers}}</div>\n		<div class="description line-clamp pull-left" ng-bind-html="match.model.hashedDescription"></div>\n	</div>\n</div>\n<div ng-if="match.model.dbg">\n	<a class="tagResult" ng-href="/explore/{{match.model.tag}}">\n		<div class="short-text">{{match.model.tag}}</div>\n		<span class="pull-right"> \n			<i class="ynicon ynicon-broadcast"></i>\n			<span>{{match.model.live}}</span>\n		</span>\n		<span class="pull-right">\n			<i class="ynicon ynicon-viewers"></i>\n			<span>{{match.model.viewers}}</span>\n		</span>\n	</a>\n</div>\n<div ng-if="match.model.more" class="searchResult-more">\n	<span translate="search_see_all_for"></span>\n	<span class="searchTerm short-text">{{match.model.query}}</span>\n</div>\n')
}
]),
angular.module("angularjsapp/src/app/components/iframe-modal/iframe-modal.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/iframe-modal/iframe-modal.tpl.html", '<iframe ng-src="{{src}}"></iframe>\n<a id="fancybox-close" ng-click="$dismiss()"></a>')
}
]),
angular.module("angularjsapp/src/app/components/left-sidebar/left-sidebar.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/left-sidebar/left-sidebar.tpl.html", '<div id="leftsidebar">\n	<div class="channel-menu-content">\n\n		<div class="left-panel">\n			<div class="panel-title" ng-click="leftSidebar.usersTrendingCollapsed = !leftSidebar.usersTrendingCollapsed"> \n				<span translate="app_trending_people"></span>\n				<i class="ynicon" ng-class="{\'ynicon-carrot-dwn\': !leftSidebar.usersTrendingCollapsed, \'ynicon-carrot-rgt\': leftSidebar.usersTrendingCollapsed}"></i>\n			</div>\n			<div class="panel-body" collapse="leftSidebar.usersTrendingCollapsed">\n				<div class="trending-users mini-scroll" only-scroll>\n					<a ng-repeat="person in leftSidebar.dashboard.users" ng-href="/{{person.profile}}" prevent-default ng-click="leftSidebar.changeBroadcaster(person.userId,\'TRENDING\')">\n						<span class="trending-user">{{::person.username}}</span>\n						<span class="viewerCount">{{person.viewers}}</span>\n					</a>\n					<a ui-sref="main.explore" class="trending-people-more">More</a>\n				</div>\n			</div>\n		</div>\n\n		<div class="left-panel">\n			<div class="panel-title" ng-click="leftSidebar.usersFeaturedCollapsed = !leftSidebar.usersFeaturedCollapsed" ng-if="leftSidebar.dashboard.featuredUsers.length > 0">\n				<span translate="app_featured_people"></span>\n				<i class="ynicon" ng-class="{\'ynicon-carrot-dwn\': !leftSidebar.usersFeaturedCollapsed, \'ynicon-carrot-rgt\': leftSidebar.usersFeaturedCollapsed}"></i>\n			</div>\n			<div class="panel-body" collapse="leftSidebar.usersFeaturedCollapsed" ng-if="leftSidebar.dashboard.featuredUsers.length > 0">\n				<div class="trending-users mini-scroll" only-scroll>\n					<a ng-repeat="person in leftSidebar.dashboard.featuredUsers" ng-href="/{{person.profile}}" prevent-default ng-click="leftSidebar.changeBroadcaster(person.userId,\'FEATURED\')">\n						<span class="trending-user">{{::person.username}}</span>\n						<span class="viewerCount">{{person.viewers}}</span>\n					</a>\n				</div>\n			</div>\n		</div>\n\n		<div class="left-panel">\n			<div class="panel-title" ng-if="leftSidebar.session.user.userId !== 0" ng-click="leftSidebar.friendsCollapsed  = !leftSidebar.friendsCollapsed">\n				<span translate="app_friends"></span>\n				<i class="ynicon" ng-class="{\'ynicon-carrot-dwn\': !leftSidebar.friendsCollapsed , \'ynicon-carrot-rgt\': leftSidebar.friendsCollapsed }"></i>\n			</div>\n			<div 	activity-panel \n					class="activity-panel"\n				 	ng-if="leftSidebar.session.user.userId !== 0 && leftSidebar.session.onlineFriends" \n					online-friends="leftSidebar.session.onlineFriends"\n					collapse="leftSidebar.friendsCollapsed"\n					source="FRIENDS">\n			</div>\n		</div>\n\n		<div class="left-panel">\n			<div class="panel-title" ng-click="leftSidebar.tagsTrendingCollapsed = !leftSidebar.tagsTrendingCollapsed"> \n				<span translate="app_trending_tags"></span>\n				<i class="ynicon" ng-class="{\'ynicon-carrot-dwn\': !leftSidebar.tagsTrendingCollapsed, \'ynicon-carrot-rgt\': leftSidebar.tagsTrendingCollapsed}"></i>\n			</div>\n			<div class="trending-tags-list mini-scroll" only-scroll collapse="leftSidebar.tagsTrendingCollapsed">\n				<div>\n					<a ng-repeat="tag in leftSidebar.dashboard.tags" ng-href="/explore/{{tag.tag}}" ng-click="leftSidebar.getTagFeatured(tag.tag)">\n						<span class="trending-tag" data-tagname="musicians">#{{::tag.tag}}</span>\n					</a>\n				</div>\n			</div>\n		</div>\n\n		<div class="left-panel">\n			<div class="panel-title"> \n				<span class="mobile-title" >Get the App</span>\n			</div>\n			<div id="get-app-subtext">\n				Watch live stream video and chat on your phone with the YouNow iOS and Android Apps!\n			</div>\n			<div class="panel-body">\n				<a class="mobile-link" ng-click="leftSidebar.trackMobile(\'IOS\')" href="https://itunes.apple.com/app/apple-store/id471347413?mt=8&pt=669563&ct=d-web-sidebar-1" target="_blank">\n					<img ng-src="{{::leftSidebar.baseImages}}/mobile/yn_app_ios.png">\n				</a>\n				<a class="mobile-link" ng-click="leftSidebar.trackMobile(\'ANDROID\')" href="https://play.google.com/store/apps/details?id=younow.live&referrer=utm_source%3Dyounow.com%26utm_campaign%3Dapp-promo-android%26utm_medium%3Dreferral%26utm_content%3Dd-web-sidebar-1" target="_blank">\n					<img ng-src="{{::leftSidebar.baseImages}}/mobile/yn_app_android.png">\n				</a>\n			</div>	\n		</div>\n	</div>\n</div>')
}
]),
angular.module("angularjsapp/src/app/components/login-modal/login-modal.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/login-modal/login-modal.tpl.html", '<div class="modal-body">\n    <button ng-if="soft" aria-hidden="true" class="close" ng-click="cancel()" type="button">\n        <i class="ynicon ynicon-close"></i>\n    </button>\n    <div class="instructions row">\n        <div class="row">\n            <span class="heading">{{ ab==1 ? \'Sign in and chat live!\' : \'Sign in and get started!\' }}</span>\n        </div>\n    </div>\n    <div class="networks row btn-group">\n        <div class="network row">\n            <button class="btn btn-facebook full-width" ng-disabled="loggingIn.facebook" ng-click="login(\'facebook\')">\n                <i class="ynicon ynicon-social-fb"></i>\n                <span ng-if="!loggingIn.facebook">Sign in with Facebook</span>\n                <div ng-if="loggingIn.facebook" class="loader-light"></div>\n            </button>\n        </div>\n        <div class="network row">\n            <button class="btn btn-twitter full-width" ng-disabled="loggingIn.twitter" ng-click="login(\'twitter\')">\n                <i class="ynicon ynicon-social-tw"></i>\n                <span ng-if="!loggingIn.twitter">Sign in with Twitter</span>\n                <div ng-if="loggingIn.twitter" class="loader-light"></div>\n            </button>\n        </div>\n        <div class="network row">\n            <button class="btn btn-google full-width" ng-disabled="loggingIn.google" ng-click="login(\'google\')">\n                <i class="ynicon ynicon-social-gp"></i>\n                <span ng-if="!loggingIn.google">Sign in with Google</span>\n                <div ng-if="loggingIn.google" class="loader-light"></div>\n            </button>\n        </div>\n\n        <div class="network row">\n\n	        <div ng-if="moreOptions">\n	            <button class="btn btn-instagram full-width" ng-disabled="loggingIn.instagram" ng-click="login(\'instagram\')">\n	                <i class="ynicon ynicon-social-insta"></i>\n	                <span ng-if="!loggingIn.instagram">Sign in with Instagram</span>\n	                <div ng-if="loggingIn.instagram" class="loader-light"></div>\n	            </button>\n	      </div>\n	      <div ng-if="!moreOptions" ng-click="showMoreOptions()" class="show-more-options">\n	            More Options\n	      </div>\n\n        </div>\n\n    </div>\n    <span class="terms-copy">\n        By clicking Sign In you are <br>\n        agreeing to our <a href="/terms.php" target="_blank" style="color:#999999;">terms of use</a>.\n    </span>\n</div>')
}
]),
angular.module("angularjsapp/src/app/components/media-player-modal/media-player-modal.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/media-player-modal/media-player-modal.tpl.html", '<div class="modal-body">\n	\n	<button class="close" ng-click="$dismiss()" type="button">\n		<i class="ynicon ynicon-close"></i>\n	</button>\n\n	<div class="modal-heading">\n		<span class="profile">{{::vm.channel.profile}} : </span><span class="title">{{::vm.broadcast.broadcastTitle}}</span>\n	</div>\n	\n	<div id="media-player-modal-player">\n		Loading video player...\n	</div>\n\n	<div class="modal-share">\n		<input type="checkbox" ng-model="vm.seekOn" ng-change="vm.seekCheck()" /> \n		<div class="share-at" n-class="{selected:vm.seekOn}">\n			Share at: \n			<input \n			type="text" \n			class="share-input" 			\n			ng-model="vm.seekValue" \n			ng-focus="vm.seekFocus()" \n			ng-blur="vm.seekBlur()" \n			ng-change="vm.seekChange()" \n			/> \n		</div>\n		<input type="text" value="{{vm.broadcast.href}}" select-on-click class="share-output" />\n		<div class="share-buttons">\n			<img src="/images/profile/new/fb_share_100.png" ng-click="vm.shareFacebook();" /> \n			<img src="/images/profile/new/icon_pro_tw.png" ng-click="vm.shareTwitter();" />\n		</div>\n	</div>\n\n</div>\n			<!-- ng-value="  vm.shareValue ? vm.shareValue : ( vm.broadcast.shareTo ? vm.broadcast.shareTo : vm.shareTo )   "  -->\n')
}
]),
angular.module("angularjsapp/src/app/components/mention/mention.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/mention/mention.tpl.html", '<ul class="list-group user-search">\n    <li mentio-menu-item="person" ng-repeat="person in items" class="list-group-item">\n        <img ng-src="{{person.thumb}}" class="user-photo">\n        <span class="text-primary" ng-bind-html="person.displayName | mentioHighlight:typedTerm:\'menu-highlighted\' | unsafe"></span>\n        <em class="text-muted" ng-bind="person.description"></em>\n    </li>\n</ul>')
}
]),
angular.module("angularjsapp/src/app/components/mobile-download/mobile-download-modal.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/mobile-download/mobile-download-modal.tpl.html", '<div class="modal-body">\n	<div ng-include="\'angularjsapp/src/app/components/mobile-download/mobile-download.tpl.html\'"></div>\n	<button aria-hidden="true" class="pull-right close" ng-click="$dismiss()" type="button">\n        <i class="ynicon ynicon-close"></i>\n    </button>\n</div>\n')
}
]),
angular.module("angularjsapp/src/app/components/mobile-download/mobile-download.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/mobile-download/mobile-download.tpl.html", '<section class="mobile-download-container">\n	<div class="inner-container">\n		<img class="mobile-phone pull-left" ng-src="{{::vm.baseCDN}}/angularjsapp/src/assets/images/home/home_phone_2x.png">\n		<div class="download-description pull-right">\n			<h2>Get the YouNow App!</h2>\n			<p>Download YouNow\'s free Apps for iOS and Android to watch live stream video and chat on your phone!</p>\n				<div class="tel-input-wrapper" ng-class="{\'active\': !twilioSuccess}">\n					<input type="tel" id="{{::vm.telInputId}}"\n						intl-tel-input \n						class="form-control" \n						autocomplete="off" \n						placeholder="(201) 555-5555"\n						tooltip="{{errorMsg}}"\n						tooltip-trigger="show"\n						tooltip-append-to-body="true"\n						tooltip-placement="top error">\n			     	<button class="btn btn-primary">Send To Phone</button>\n		     	</div>\n		     	<div class="success-message" ng-class="{\'active\': twilioSuccess}">\n		     		Check your phone and follow the link to download YouNow!\n		     	</div>\n			<span>Text or data rates may apply.</span>\n		</div>\n		<div class="clear"></div>\n	</div>\n</section>');
}
]),
angular.module("angularjsapp/src/app/components/mod-form/mod-form.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/mod-form/mod-form.tpl.html", '<div class="mod-form" id="modformcontainer">\n</div>')
}
]),
angular.module("angularjsapp/src/app/components/partner-agreement-modal/partner-agreement-modal.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/partner-agreement-modal/partner-agreement-modal.tpl.html", '<div class="modal-body">\n	<h5 class="agreement-title">{{title}}</h5>\n	<div class="agreement-message">{{message}}</div>\n	<div class="actions" ng-show="!cancelState">\n		<button class="btn btn-primary" ng-click="checkAgreement(true)" translate="_continue"></button>\n	</div>\n	<div class="actions" ng-show="cancelState">\n		<button class="btn btn-cancel" ng-click="checkAgreement()" translate="_cancel"></button>\n		<button class="btn btn-cancel" ng-click="finalDismiss()" translate="_skip"></button>\n	</div>\n    <button ng-if="!cancelState" aria-hidden="true" class="close btn-reset" ng-click="checkAgreement(false)" type="button">\n		<i class="ynicon ynicon-close"></i>\n	</button>\n	 <button ng-if="cancelState" aria-hidden="true" class="close btn-reset" ng-click="finalDismiss()" type="button">\n		<i class="ynicon ynicon-close"></i>\n	</button>\n</div>')
}
]),
angular.module("angularjsapp/src/app/components/partner-modal/partner-modal.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/partner-modal/partner-modal.tpl.html", '<div class="modal-body">\n    <div class="partner-modal-wrapper">\n      <button aria-hidden="true" class="pull-right close" ng-click="$dismiss()"  id="accept-modal-close" type="button">\n        <i class="ynicon ynicon-close"></i>\n      </button>\n      <div class="partner-title" translate="partner_congratulations"></div>\n      <div class="partner-message" translate="partner_you_have_been_accepted"></div>\n      <div class="btn-container">\n        <button class="btn btn-confirm" ng-click="continue()" translate="_continue"></button>\n      </div>\n  </div>\n</div>')
}
]),
angular.module("angularjsapp/src/app/components/post/embed/archive.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/post/embed/archive.tpl.html", '<ul ng-if="::post.media.type==\'5\'" class="archived-broadcasts" ng-attr-id="post_{{::post.media.broadcast.broadcastId}}">\n	<li class="broadcast">\n		<div class="pull-left">\n			<div ng-class="{\'no-cursor\': post.media.broadcast.videoAvailable === 0}" \n				 ng-disabled="disabled = post.media.broadcast.videoAvailable === 0" \n				 ng-click="disabled || showMedia(post.media.broadcast.broadcastId, {source:\'FEED\',start:0})" \n				 class="broadcast-thumb"\n				 ng-style="::{background: \'url(\'+cdn.broadcast+post.media.broadcast.broadcastId+\') no-repeat\', \'background-size\': \'cover\'}">\n				<img class="play-button" ng-if="post.media.broadcast.videoAvailable === 1" ng-src="{{::cdn.base}}/images/profile/new/icon_play.png">\n			</div>\n		</div>\n		<div class="pull-left broadcast-summary">\n			<span class="title">{{::post.media.broadcast.ddateAired}}</span>\n			<div class="text-muted"> {{::post.media.broadcast.totalViewers | number}} views <span ng-if="::post.media.broadcast.tags" class="broadcast-tag text-muted">#{{::post.media.broadcast.tags}}</span> <span class="text-muted broadcast-length">{{::post.media.broadcast.broadcastLengthNice}}</span></div>\n			<ul class="gifts">\n				<div ng-repeat="gift in post.media.broadcast.gifts" class="gift pull-left">\n					<img alt="gift.giftSKU" \n						class="gift-thumb pull-left" \n						ng-src="{{::cdn.base}}/images/profile/new/gifts/{{::gift.giftSKU}}_pro.png"\n						tooltip-trigger="mouseenter" \n						tooltip="{{::gift.total}}">\n				</div>\n			</ul>\n		</div>\n		<div class="clear"></div>\n	</li>\n</ul>')
}
]),
angular.module("angularjsapp/src/app/components/post/embed/embedlyimage.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/post/embed/embedlyimage.tpl.html", '<img class="embedly-image" ng-src="{{::post.media.embedly.url}}">')
}
]),
angular.module("angularjsapp/src/app/components/post/embed/iframe.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/post/embed/iframe.tpl.html", '<span class="embedlyiframe" ng-bind-html="::post.media.embedly.html"></span>')
}
]),
angular.module("angularjsapp/src/app/components/post/embed/link.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/post/embed/link.tpl.html", '<a ng-href="{{::post.media.embedly.url}}" rel="nofollow" target="_blank">\n	<div class="embedly-link-container">\n		<div class="left pull-left">\n			<img ng-src="{{::post.media.embedly.thumbnail_url}}" />\n		</div>\n		<div class="right pull-left">\n			<div class="title">\n				<span>{{::post.media.embedly.title}}</span>\n			</div>\n			<div class="description">\n				<span>{{::post.media.embedly.description}}</span>\n			</div>\n		</div>\n		<div class="clear"></div>\n	</div>\n</a>')
}
]),
angular.module("angularjsapp/src/app/components/post/embed/snapshot.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/post/embed/snapshot.tpl.html", '<img ng-if="::post.media.type==\'6\'" class="snapshot-media" ng-src="{{::cdn.snapshot+post.media.snapshot.snapshotId}}" ng-attr-id="post_{{::post.media.snapshot.snapshotId}}">')
}
]),
angular.module("angularjsapp/src/app/components/post/embed/uploadimage.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/post/embed/uploadimage.tpl.html", "<img class=\"image-media\" ng-if=\"::(post.media.type=='1'||post.media.type=='2')\" ng-src=\"{{::cdn.media+broadcasterService.broadcaster.userId+'/id='+post.id+'/ext='+post.media.ext}}\">")
}
]),
angular.module("angularjsapp/src/app/components/post/embed/video.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/post/embed/video.tpl.html", '<!-- <iframe class="hidden" ng-if="::post.media.type==\'4\'" frameborder="0" height="325" seamless="" ng-src="{{::trustedSrc(cdn.base+\'/player.php?channelId=\'+broadcasterService.broadcaster.userId+\'&amp;id=\'+post.id)}}" width="433"></iframe> -->')
}
]),
angular.module("angularjsapp/src/app/components/post/post.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/post/post.tpl.html", '<div class="comment-container " ng-if="post.id" ng-attr-id="post_{{::post.id}}">\n	<a\n	class="circle-thumb pull-left"\n	ng-click="showProfileSummary(post.user.userId)"\n	ng-href="/{{post.user.profileUrlString}}" prevent-default\n	ng-style="::{ \'background\': \'url(\'+cdn.thumb+post.user.userId+\') no-repeat, url(\'+cdn.nothumb+\') no-repeat\', \'background-size\': \'cover\'}">\n	</a>\n	<div class="admin-controls pull-right" ng-show="canEdit(post)" dropdown>\n		<button class="btn btn-transparent" dropdown-toggle href="javascript:void(0)">\n			<img ng-src="{{::cdn.base}}/images/groups/icon_pro_arrow.png">\n		</button>\n		<ul class="dropdown-menu">\n			<i class="ynicon ynicon-carrot-up"></i>\n			<li ng-if="::post.downloadUrl !== undefined">\n				<a class="download" target="_self" ng-href="{{::post.downloadUrl}}" translate="_download"></a>\n			</li>\n			<li ng-if="canPin(post)" ng-click="togglePin(post)">\n				<a href="javascript:void(0)">\n					{{post.isPinned ? \'Unpin\' : \'Pin\'}}\n				</a>\n			</li>\n			<li>\n				<a class="delete-comment" data-confirm-message="{{\'post_are_you_sure_you_want_to_delete\' | translate }}" confirm="delete" confirm-data="post" href="javascript:void(0)">{{ \'_delete\' | translate }}</a>\n			</li>\n		</ul>\n	</div>\n	<div class="description">\n		<img ng-if="post.isPinned" class="pin pull-left" ng-src="{{::cdn.base}}/images/groups/icon_post_pin.png">\n		<a\n		class="name"\n		ng-href="/{{post.user.profileUrlString}}" prevent-default\n		ng-click="showProfileSummary(post.user.userId)">\n			{{::post.user.firstName}} {{::post.user.lastName}}\n		</a>\n		<div class="minutes-ago text-muted" ng-if="::post.timeAgo !== \'0 second ago\'">{{::post.timeAgo}}</div>\n		<div class="minutes-ago text-muted" ng-if="::post.timeAgo == \'0 second ago\'" translate="post_just_now"></div>\n	</div>\n	<div class="body clear">\n		<div class="post-comment">\n			<div ng-bind-html="::post.post"></div>\n			<div class="clear"></div>\n		</div>\n		<div class="comment-media " ng-if="post.hasOwnProperty(\'embed\')">\n			<div ng-include src="\'angularjsapp/src/app/components/post/embed/\'+post.embed+\'.tpl.html\'"></div>\n		</div>\n	</div>\n	<div class="actions">\n		<div class="like" ng-click="toggleLike(post)">\n			<i class="ynicon ynicon-thumb" ng-class="{\'not-liked\': !post.liked, liked: post.liked}"></i>\n			<span ng-class="{liked: post.liked}">{{post.liked ? \'Liked\' : \'Like\'}}</span>\n			<span ng-show="post.likesCount">&#8211; {{post.likeText}}</span>\n		</div>\n	</div>\n	<div ng-if="post.hasMore" class="see-more "><a href="javascript:void(0)" ng-click="moreComments(post)" translate="post_see_previous_comments"></a></div>\n	<ul ng-if="::!post.parentId" class="replies ">\n		<li ng-repeat="reply in post.replies" class="comment " ng-class="{\'new-reply\':broadcasterService.deeplinkId==reply.id}">\n			<div data-younow-reply></div>\n		</li>\n	</ul>\n	<div ng-if="::!post.parentId" class="reply-box row">\n		<div class="comment-area"  tooltip-trigger="mouseenter" tooltip-html-unsafe="{{\'post_tip_mention_your_friends\' | translate}}">\n			<div contenteditable mentio\n		      mentio-typed-term="typedTerm"\n		      mentio-require-leading-space="true"\n		      class="editor form-control"\n		      style="min-height:25px; padding: 2px 25px 3px 31px;"\n		      id="textarea_{{post.id}}"\n		      ng-model="post.html"\n		      ng-keydown="submitOnEnter($event, post)"\n		      placeholder="{{\'post_comment_on\' | translate }}"\n		    	></div>\n		    <mentio-menu\n		      mentio-for="\'textarea_\'+post.id"\n		      mentio-trigger-char="\'@\'"\n		      mentio-items="people"\n		      mentio-template-url="angularjsapp/src/app/components/mention/mention.tpl.html"\n		      mentio-search="searchPeople(term)"\n		      mentio-select="insertMention(item)"\n		      ></mentio-menu>\n			<div ng-show="!session.loggedIn" class="circle-thumb" ng-style="::{background: \'url(\'+cdn.nothumb+\') no-repeat\', backgroundSize: \'cover\'}"></div>\n			<div ng-show="session.loggedIn" class="circle-thumb" ng-style="::{background: \'url(\'+cdn.thumb+session.user.userId+\') no-repeat\', backgroundSize: \'cover\'}"></div>\n			<div class="upload-photo">\n				<input accept="image/jpeg, image/png" data-url="http://www.younow.com/php/api/post/create" name="media" type="file" onchange="angular.element(this).scope().showUploadPreview(this, angular.element(this).scope().post)" ng-attr-id="file_{{::post.id}}">\n				<i class="ynicon ynicon-camera pull-right"></i>\n			</div>\n			<div ng-show="post.preview" class="upload-preview">\n				<button ng-click="removeUpload(post)" aria-hidden="true" class="close" type="button">×</button>\n				<img ng-src="{{post.preview}}" height="100">\n			</div>\n		</div>\n	</div>\n	<div class="options pull-right hidden"></div>\n	<div class="options-screen pull-left hidden"></div>\n	<div class="clear"></div>\n</div>\n')
}
]),
angular.module("angularjsapp/src/app/components/post/reply/reply.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/post/reply/reply.tpl.html", '<div class="comment-container" ng-if="post.id" ng-attr-id="post_{{::post.id}}">\n		<div class="line-spacing row"></div>\n		<a\n		class="circle-thumb pull-left"\n		ng-href="/{{post.user.profileUrlString}}" prevent-default\n		ng-click="showProfileSummary(post.user.userId)"\n		ng-style="::{ \'background\': \'url(\'+cdn.thumb+post.user.userId+\') no-repeat, url(\'+cdn.nothumb+\') no-repeat\', \'background-size\': \'cover\'}">\n		</a>\n		<div class="admin-controls pull-right" ng-show="canEdit(post)" dropdown>\n			<button class="btn btn-transparent" dropdown-toggle href="javascript:void(0)">\n				<img ng-src="{{::cdn.base}}/images/groups/icon_pro_arrow.png">\n			</button>\n			<ul class="dropdown-menu">\n				<i class="ynicon ynicon-carrot-up"></i>\n				<li ng-if="::post.downloadUrl !== undefined">\n					<a class="download" target="_self" ng-href="{{::post.downloadUrl}}" translate="_download"></a>\n				</li>\n				<li ng-if="canPin(post)" ng-click="togglePin(post)">\n					<a href="javascript:void(0)">\n						{{post.isPinned ? \'Unpin\' : \'Pin\'}}\n					</a>\n				</li>\n				<li>\n					<a class="delete-comment" data-confirm-message="Are you sure you want to delete this post?" confirm="delete" confirm-data="post" href="javascript:void(0)">{{ \'_delete\' | translate }}</a>\n				</li>\n			</ul>\n		</div>\n		<div class="description">\n			<img ng-if="post.isPinned" class="pin pull-left"  ng-src="{{::cdn.base}}/images/groups/icon_post_pin.png">\n			<a\n			class="name"\n			ng-href="/{{post.user.profileUrlString}}" prevent-default\n			ng-click="showProfileSummary(post.user.userId)">\n				{{::post.user.firstName}} {{::post.user.lastName}}\n			</a>\n			<div class="minutes-ago text-muted" ng-if="::post.timeAgo !== \'0 second ago\'">{{::post.timeAgo}}</div>\n			<div class="minutes-ago text-muted" ng-if="::post.timeAgo == \'0 second ago\'" translate="post_just_now"></div>\n		</div>\n		<div class="body clear">\n			<div class="comment-text">\n				<div ng-bind-html="::post.post"></div>\n			</div>\n			<div class="comment-media-reply" ng-if="::post.hasOwnProperty(\'embed\')">\n				<div ng-include src="\'angularjsapp/src/app/components/post/embed/\'+post.embed+\'.tpl.html\'"></div>\n			</div>\n			<div class="comment-media-reply" ng-if="::(post.media!==undefined && post.media.type!==undefined && !post.hasOwnProperty(\'embed\'))">\n\n				<img ng-if="::(post.media.type==\'1\'||post.media.type==\'2\')" ng-src="{{::cdn.media}}{{::broadcasterService.broadcaster.userId}}/id={{::post.id}}/ext={{::post.media.ext}}">\n\n				<iframe ng-if="::post.media.type==\'4\'" frameborder="0" height="325" seamless="" ng-src="{{::trustedSrc(cdn.base+\'/player.php?channelId=\'+broadcasterService.broadcaster.userId+\'&amp;id=\'+post.id)}}" width="433"></iframe>\n\n				<ul ng-if="::post.media.type==\'5\'" class="broadcasts" ng-attr-id="post_{{::post.media.broadcast.broadcastId}}">\n					<li class="broadcast">\n						<div class="left-col pull-left">\n							<a\n							ng-href="/{{post.media.broadcast.profile || post.media.broadcast.profileUrlString}}" prevent-default\n							ng-click="showMedia(post.media.broadcast.broadcastId)"\n							class="thumb"\n							style="background:url( {{::cdn.broadcast+post.media.broadcast.broadcastId}} );background-size:cover;">\n								<img class="play-button" ng-src="{{::cdn.base}}/images/profile/new/icon_play.png">\n								<span class="length">{{::post.media.broadcast.broadcastLengthMin}}</span>\n							</a>\n						</div>\n						<div class="right-col pull-left">\n							<span class="title not-too-long">{{::post.media.broadcast.ddateAired}}</span>\n							<div class="row">\n								<span></span>\n							</div>\n							<div class="rating-viewers">\n								<span class="viewers">{{::post.media.broadcast.totalViewers}} views / #{{::post.media.broadcast.tags}}</span>\n							</div>\n							<ul class="gifts">\n								<div ng-repeat="gift in post.media.broadcast.gifts" class="gift pull-left">\n									<img alt="gift.giftSKU" class="gift-thumb pull-left" ng-src="{{::cdn.base}}/images/profile/new/gifts/{{::gift.giftSKU}}_pro.png">\n									<span class="count">{{::gift.total}}</span>\n								</div>\n							</ul>\n						</div>\n					</li>\n				</ul>\n\n				<img ng-if="::post.media.type==\'6\'" ng-src="{{::cdn.snapshot}}{{::post.media.snapshot.snapshotId}}" ng-attr-id="post_{{::post.media.snapshot.snapshotId}}">\n\n			</div>\n		</div>\n		<div class="actions">\n			<div class="like" ng-click="toggleLike(post)">\n				<i class="ynicon ynicon-thumb" ng-class="{\'not-liked\': !post.liked, liked: post.liked}"></i>\n				<span ng-class="{liked: post.liked}">{{post.liked ? \'Liked\' : \'Like\'}}</span>\n				<span ng-show="post.likesCount">&#8211; {{post.likeText}}</span>\n			</div>\n		</div>\n		<div class="options pull-right hidden"></div>\n		<div class="options-screen pull-left hidden"></div>\n</div>\n')
}
]),
angular.module("angularjsapp/src/app/components/profile-summary/profile-summary.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/profile-summary/profile-summary.tpl.html", '<div ng-class="modal.state" class="profile-summary fade in" tabindex="-1" aria-hidden="false">\n	<button aria-hidden="true" class="pull-right close" ng-click="$dismiss()" type="button">\n		<i class="ynicon ynicon-close"></i>\n	</button>\n	<div class="modal-header"> <div class="cover-image yn-modal-draggable" ng-style="::{\'background\': \'url(\'+cover+\') no-repeat\', \'background-size\': \'cover\'}"></div></div>\n	<div class="modal-body" ng-class="{banned: session.user.banId !== 0}">\n		<div class="profile-description">\n			<div class="circle-thumb pull-left clickable" ng-click="goToProfile(user.profile)" ng-style="::{\'background\': \'url(\'+thumb+\') no-repeat, url(\'+nothumb+\') no-repeat\', \'background-size\': \'cover\'}"></div>\n			<!-- normal state -->\n			<div class="user-info pull-left" ng-if="modal.state===\'\'">\n				<div class="name short-text" ng-class="::{\'special-role pull-left\': session.administrator && user.isPartner}">\n					\n					<b ng-click="goToProfile(user.profile)">\n						<i class="ynicon ynicon-level"></i>{{::user.level}} {{::user.fullName}}\n					</b>\n\n					<span class="ynbadges" ng-if="user.latestSubscriptions">\n						<span class="ynbadge" ng-repeat="(key,sub) in user.latestSubscriptions">\n							<img \n								ng-src="{{::config.settings.BadgeBaseUrl}}/{{::key}}/{{::sub.subscriptionType}}/badge@2x.png"\n								ng-click="showProfileSummary(key)"\n								tooltip="{{::sub.name}}"\n								tooltip-trigger="mouseenter"\n								tooltip-placement="top"\n								tooltip-append-to-body="true" />\n						</span>\n						<span class="ynbadge">\n							<span ng-if="user.latestSubscriptionsPlus">\n								+{{::user.latestSubscriptionsPlus}}\n							</span>\n						</span>\n					</span>\n\n				</div>\n\n				<div class="special-role-display" ng-if="::session.administrator && user.isPartner">\n					<span class="bullet">&#8226;</span> \n					<span> Partner</span>\n				</div>\n				<div class="more-info">\n					{{::user.totalFans | number}} {{\'_fans\' | translate }} <span class="bullet">&#8226;</span> \n					<span class="join-date"> {{\'profile_younower_since\' | translate }} {{::user.dateCreated.substr(0,10) | date:\'MM/dd/yyyy\'}}</span>\n				</div>\n			</div>\n			<!-- to follow -->\n			<div class="user-info social-action pull-left" ng-if="modal.state==\'following\' && !modal.following.followed">\n				<span ng-if="canFollow(modal.following.network)">{{sn_verb[ modal.following.network ]}} </span>\n				<a class="name short-text" href ng-click="openUrl(\'https://twitter.com/\'+user.twitterHandle, \'link\')" ng-if="modal.following.network==\'twitter\'">@{{::user.twitterHandle}}</a> \n				<a class="name short-text" href ng-click="openUrl(user.facebookLink, \'link\')" ng-if="modal.following.network==\'facebook\'">{{::user.firstName}} {{::user.lastName}}</a> \n				<a class="name short-text" href ng-click="openUrl(\'https://youtube.com/channel/\'+user.youTubeChannelId, \'link\')" ng-if="modal.following.network==\'youtube\'">{{::user.friendlyName}}</a>\n				<a class="name short-text" href ng-click="openUrl(\'https://plus.google.com/\'+user.googleId, \'link\')" ng-if="modal.following.network==\'google\'">{{::user.firstName}} {{::user.lastName}}</a> \n				<a class="name short-text" href ng-click="openUrl(\'https://instagram.com/\'+user.instagramHandle, \'link\')" ng-if="modal.following.network==\'instagram\'">{{::user.instagramHandle}}</a> \n				<span> on {{sn_titles[ modal.following.network ]}} </span>\n			</div>\n			<!-- already followed -->\n			<div class="user-info social-action pull-left" ng-if="modal.state==\'following\' && modal.following.followed">\n				<span><i class="ynicon ynicon-icon-check"></i>{{sn_verbed[ modal.following.network ]}} </span>\n				<a class="name short-text" href ng-click="openUrl(\'https://twitter.com/\'+channel.twitterHandle, \'link\')" ng-if="modal.following.network==\'twitter\'">@{{::user.twitterHandle}}</a> \n				<a class="name short-text" href ng-click="openUrl(user.facebookLink, \'link\')" ng-if="modal.following.network==\'facebook\'">{{::user.firstName}} {{::user.lastName}}</a> \n				<a class="name short-text" href ng-click="openUrl(\'https://youtube.com/channel/\'+user.youTubeChannelId, \'link\')" ng-if="modal.following.network==\'youtube\'">{{::user.friendlyName}}</a>\n				<a class="name short-text" href ng-click="openUrl(\'https://plus.google.com/\'+user.googleId, \'link\')" ng-if="modal.following.network==\'google\'">{{::user.firstName}} {{::user.lastName}}</a> \n				<a class="name short-text" href ng-click="openUrl(\'https://instagram.com/\'+user.instagramHandle, \'link\')" ng-if="modal.following.network==\'instagram\'">{{::user.instagramHandle}}</a> \n			</div>\n\n			<!-- default -->\n			<div class="user-bio pull-left line-clamp" ng-if="modal.state==\'\'">\n				<span class="location" ng-if="user.location.length > 0">{{::user.location}} <span class="bullet">&#8226;</span></span>\n				<span class="summary" ng-bind-html="user.description"></span>\n			</div>\n			 \n			<div class="social-actions pull-left" ng-if="modal.state==\'\' && session.user.userId !== user.userId">\n		   		<button class="btn btn-transparent social-google" ng-if="::user.googleId" ng-click="setupFollowing(\'google\',{backToSummary:true})">\n					<i class="ynicon ynicon-social-gp"></i>\n				</button>\n		   		<button class="btn btn-transparent" ng-if="::user.facebookId" ng-click="setupFollowing(\'facebook\',{backToSummary:true})">\n					<i class="ynicon ynicon-social-fb"></i>\n				</button>\n				<button class="btn btn-transparent" ng-if="::user.youTubeChannelId" ng-click="setupFollowing(\'youtube\',{backToSummary:true})">\n					<i class="ynicon ynicon-icon-social-yt"></i>\n				</button> \n 				<button class="btn btn-transparent" ng-if="::user.instagramHandle" ng-click="setupFollowing(\'instagram\',{backToSummary:true})">\n					<i class="ynicon ynicon-social-insta"></i>\n				</button>\n				<button class="btn btn-transparent" ng-if="::user.twitterHandle" ng-click="setupFollowing(\'twitter\',{backToSummary:true})">\n					<i class="ynicon ynicon-social-tw"></i>\n				</button>\n			</div>\n			<!-- user-info flagging/suspending -->\n			<div class="user-info pull-left" ng-if="modal.state==\'flagging\'">\n				<div class="name" translate="profile_reason_for_flagging"></div>\n				<div class="more-info text-muted" translate="profile_false_flagging_result"></div>\n			</div>\n			<div class="user-info pull-left" ng-if="modal.state==\'suspending\'">\n				<div class="action-message ban-state" ng-if="modal.action.actionName.replace(\'Suspend\', \'\')==\'Ban\'">\n					{{\'_ban\' | translate }} <span ng-click="goToProfile(user.profile)" class="name short-text">{{::user.profile}}</span> \n				</div>\n				<div class="action-message" ng-if="modal.action.actionName.replace(\'Suspend\', \'\') !== \'Ban\'"> \n					{{\'_suspend\' | translate }} <span ng-click="goToProfile(user.profile)" class="name short-text">{{::user.profile}}</span> {{\'_for\' | translate }} {{modal.action.actionName.replace(\'Suspend\', \'\')}} \n				</div>\n			</div>\n			<!-- reason for flagging/suspending -->\n			<div class="pull-left flagging-reasons" ng-if="modal.state==\'flagging\' && !modal.notifying">\n				<div ng-repeat="flag in flags">\n					<div ng-click="modal.flag = flag.id">\n						<input ng-model="modal.flag" ng-value="flag.id" type="radio">\n						<span>{{flag.desc}}</span>\n					</div>\n				</div>\n			</div>\n			<div ng-if="modal.state==\'suspending\' && !modal.notifying">\n				<form name="modal.reasonForm" novalidate>\n					<select class="form-control suspending-options" ng-model="modal.reasonOption" required ng-required>\n						<option value="" default selected translate="profile_please_choose"></option>\n						<option value="{{option.id}}" ng-repeat="option in modal.actionOptions">\n							{{option.desc}}\n						</option>\n					</select>\n					<textarea class="suspending-reasons" ng-model="modal.reason" placeholder="Please provide a reason..." ng-maxlength="245" required></textarea>\n				</form>\n			</div>\n			<div ng-if="modal.notifying" class="action-notifications pull-left">\n				<span ng-class="modal.notificationType"><i class="ynicon ynicon-icon-mod pull-left"></i> {{modal.notificationMessage}}</span>\n			</div>\n			<div class="clear"></div>\n		</div>\n	</div>\n\n	<!-- normal -->\n	<div class="actions" ng-if="modal.state==\'\'" track-source="MINI_PROFILE">\n		<div class="pull-left btn-small" fan-button channel="user"></div>\n		<div class="pull-left btn-small" subscribe-button channel="user" source="MINI_PROFILE"></div>\n		\n		<div class="pull-right flagging-menu" ng-if="session.user && session.user.userId!==user.userId && session.user.banId === 0" dropdown is-open="modal.flagging">\n			<i ng-click="toggleDropdown($event)" class="ynicon ynicon-flag"></i>\n			<div class="dropdown-menu" role="menu">\n				<i class="ynicon ynicon-carrot-up"></i>\n				<ul class="mini-scroll" only-scroll>\n					<li ng-repeat="action in actions">\n						<a href ng-click="doAction(action)">{{action.actionName}}</a>\n					</li>\n				</ul>\n			</div>\n		</div>\n		<a ng-href="{{user.profile}}/channel" class="full-profile pull-right" ng-click="goToProfile(user.profile, $event)" translate="profile_full_profile"></a>\n	</div>\n\n	<!-- flagging -->\n	<div class="actions center" ng-if="modal.state==\'flagging\'">\n		<button class="btn btn-important" \n			ng-class="{error: modal.notifying || modal.flag === undefined}"\n			ng-click="submitAction()"\n			id="flagging-tooltip"\n			tooltip="Provide a Reason"\n			tooltip-trigger="show"\n			tooltip-append-to-body="true"\n			tooltip-placement="top error"\n			translate="profile_report_user"></button>\n		<button class="btn btn-cancel" ng-click="modal.resetProfileSummary()" translate="_cancel"></button>\n	</div>\n\n	<!-- suspending -->\n	<div class="actions center" ng-if="modal.state === \'suspending\'">\n		<span 	\n			id="reason-form-tooltip"\n			tooltip="Provide a Reason"\n			tooltip-trigger="show"\n			tooltip-placement="top error"\n			tooltip-append-to-body="true">\n			<button class="btn btn-important" ng-class="{error: modal.notifying || !modal.reasonOption}" ng-if="!modal.notifying && modal.action.actionName.replace(\'Suspend\', \'\') !== \'Ban\'" ng-click="submitAction()" translate="_suspend"></button>\n			<button class="btn btn-important" ng-class="{error: modal.notifying || !modal.reasonOption}" ng-if="!modal.notifying && modal.action.actionName.replace(\'Suspend\', \'\') === \'Ban\'" ng-click="submitAction()" translate="_ban"></button>\n		</span>\n		<button class="btn btn-cancel" ng-if="!modal.notifying" ng-click="modal.resetProfileSummary()" translate="_cancel"></button>\n		<button class="btn btn-cancel" ng-if="modal.notifying" ng-click="modal.resetProfileSummary()" translate="_ok"></button>\n	</div>\n\n	<!-- following -->\n	<div class="actions center" ng-if="modal.state==\'following\'">\n		\n		<button class="btn btn-{{modal.following.network}}" ng-click="startFollowing(modal.following.network)" ng-if="canFollow(modal.following.network) && !modal.following.followed">\n			<i class="ynicon {{modal.following.icon}}"></i>\n			<span ng-if="modal.following.network === \'twitter\'">Follow</span>\n			<span ng-if="modal.following.network === \'youtube\'">Subscribe</span>\n		</button>\n\n		<button class="btn btn-twitter" ng-click="openUrl(\'https://twitter.com/\'+user.twitterHandle, \'button\')" ng-if="modal.following.network==\'twitter\' && modal.following.followed"><i class="ynicon ynicon-social-tw"></i> View Profile </button>\n		<button class="btn btn-youtube" ng-click="openUrl(\'https://youtube.com/channel/\'+user.youTubeChannelId, \'button\')" ng-if="modal.following.network==\'youtube\' && modal.following.followed"><i class="ynicon ynicon-icon-social-yt"></i> View Profile </button>\n		<button class="btn btn-google" ng-click="openUrl(\'https://plus.google.com/\'+user.googleId, \'button\')" ng-if="modal.following.network==\'google\'"><i class="ynicon ynicon-social-gp"></i> View Profile </button>\n		<button class="btn btn-facebook" ng-click="openUrl(user.facebookLink, \'button\')" ng-if="modal.following.network==\'facebook\'"><i class="ynicon ynicon-social-fb"></i> View Profile </button>\n		<button class="btn btn-instagram" ng-click="openUrl(\'https://instagram.com/\'+user.instagramHandle, \'button\')" ng-if="modal.following.network==\'instagram\'"><i class="ynicon ynicon-icon-share-insta"></i> View Profile </button>\n\n\n		<button class="btn btn-cancel" ng-click="modal.resetProfileSummary()"> Back </button>\n	</div>\n\n</div>')
}
]),
angular.module("angularjsapp/src/app/components/search-bar/search-bar.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/search-bar/search-bar.tpl.html", '<div class="search-box pull-left">\n	<input 	typeahead="person.profile for person in search.query($viewValue)"\n			typeahead-loading="searching"\n			typeahead-on-select="search.selectResult($item, $model, $label)"\n			typeahead-template-url="angularjsapp/src/app/components/search-bar/search-results.tpl.html"\n			typeahead-wait-ms="100"\n			ng-model="search.searchBox"\n			class="search-field form-control" placeholder="{{::(type === \'home\' ? \'Search for a broadcaster\' : \'Search YouNow\')}}" type="text">\n	<i  ng-click="goToExplore()" class="ynicon ynicon-search"></i>\n	<button class="btn btn-primary" ng-if="::(type === \'home\')" ng-click="goToExplore(true)">Go</button>\n</div>\n')
}
]),
angular.module("angularjsapp/src/app/components/search-bar/search-results.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/search-bar/search-results.tpl.html", '<div ng-if="match.model.objectID" class="searchResult">\n	<div class="circle-thumb pull-left" ng-attr-style="{{$parent.$parent.$parent.$parent.search.background(match.model.objectID)}}">\n		<div class="live" ng-show="match.model.tag"><i class="ynicon ynicon-broadcast"></i></div>\n	</div>\n	<div class="pull-left userInfo">\n		<div class="name pull-left">\n			<i class="ynicon ynicon-level"></i><span>{{match.model.level}}</span>\n			<span class="short-text">{{match.model.fullName}}</span>\n		</div>\n		<div ng-show="match.model.viewers" class="viewers pull-right">\n			<img ng-src="{{::$parent.$parent.$parent.$parent.search.base}}/images/younow_header/icon_viewers_search.png">{{match.model.viewers}}</div>\n		<div class="description line-clamp pull-left" ng-bind-html="match.model.hashedDescription"></div>\n	</div>\n</div>\n<div ng-if="match.model.dbg">\n	<a class="tagResult" ng-href="/explore/{{match.model.tag}}">\n		<div class="short-text">{{match.model.tag}}</div>\n		<span class="pull-right"> \n			<i class="ynicon ynicon-broadcast"></i>\n			<span>{{match.model.live}}</span>\n		</span>\n		<span class="pull-right">\n			<i class="ynicon ynicon-viewers"></i>\n			<span>{{match.model.viewers}}</span>\n		</span>\n	</a>\n</div>\n<div ng-if="match.model.more" class="searchResult-more">\n	<span translate="search_see_all_for"></span>\n	<span class="searchTerm short-text">{{match.model.query}}</span>\n</div>\n');
}
]),
angular.module("angularjsapp/src/app/components/settingup-panel/settingup-panel.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/settingup-panel/settingup-panel.tpl.html", '<h4 class="heading">1. Tag your broadcast</h4>\n<div class="text-muted sub-title">Adding a tag helps people discover you.</div>\n<div class="typeahead-container" ng-class="{open: !panel.typeaheadClosed}">\n	<form name="panel.tagForm" novalidate>\n		<label class="hash-label" ng-class="{active: panel.tagSelected.length > 0}">\n			#\n		</label>\n		<input type="text"\n			id="typeaheadInput"\n			class="tag-input form-control"\n			placeholder="Search for a tag"\n			ng-model="panel.tagSelected"\n			tabindex="1"\n		 	maxlength="20"\n		 	ng-required\n			ng-maxlength="20"\n			typeahead="tag for tag in panel.loadTags($viewValue)"\n			ng-change="panel.validateTag(panel.tagSelected)"\n			ng-blur="panel.typeaheadClosed = true"\n			typeahead-on-select="panel.selectTag($item, $model, $label)"\n			typeahead-template-url="angularjsapp/src/app/components/settingup-panel/tag-selection.tpl.html">\n	</form>\n	<i class="ynicon ynicon-icon-check" ng-class="{active: panel.tagValid}"></i>\n	<div class="typeahead-defaults pull-left" ng-class="{active: panel.typeaheadClosed}" only-scroll>\n		<div class="pull-left tag" ng-repeat="tag in ::panel.popularTags track by $index" ng-click="panel.selectTag(tag)" ng-if="tag.tag !== false" ng-class="::{\'ep-tag\': tag.isEp, \'tag\': !tag.isEp}">\n			<i ng-if="::tag.isEp"class="ynicon ynicon-level"></i>\n			{{::tag.tag}}\n		</div>\n	</div>\n</div>\n<h4 class="heading">2. Share</h4>\n<div class="text-muted sub-title">Tell your friends to come watch and support.</div>\n<div class="snapshot pull-left">\n	<img ng-if="panel.snapshot" ng-src="data:image/jpeg;base64,{{panel.snapshot}}">\n	<button class="btn btn-transparent" ng-disabled="!panel.initResponse" ng-click="panel.takeSnapshot()">\n		<i class="ynicon ynicon-camera"></i>\n	</button>\n</div>\n<div class="snapshot-description pull-left">\n	<input  class="form-control"\n			yn-enter="panel.startBroadcast()"\n			id="share-input"\n			tabindex="2"\n			placeholder="What\'s happening?"\n			ng-model="panel.shareCopy"\n			ng-maxlength="60"\n			maxlength="60">\n	<button class="btn btn-transparent" ng-disabled="!panel.initResponse" ng-click="panel.toggleShare(\'twitter\')">\n		<i class="ynicon" ng-class="{\'ynicon-icon-share-tw\': !panel.networks.twitter, \'ynicon-icon-share-tw-on\': panel.networks.twitter}"></i>\n	</button>\n	<button class="btn btn-transparent" ng-disabled="!panel.initResponse" ng-click="panel.toggleShare(\'facebook\')">\n		<i class="ynicon" ng-class="{\'ynicon-icon-share-fb\': !panel.networks.facebook && !panel.networks.facebookShare, \'ynicon-icon-share-fb-on\': panel.networks.facebook || panel.networks.facebookShare}"></i>\n	</button>\n</div>\n<button class="btn btn-primary"\n		id="start-broadcast-btn"\n		ng-disabled="panel.startingBroadcast || !panel.initResponse"\n		ng-click="panel.startBroadcast()">\n	<span ng-if="!panel.startingBroadcast">Go Live</span>\n    <div ng-if="panel.startingBroadcast" class="loader-light"></div>\n</button>\n')
}
]),
angular.module("angularjsapp/src/app/components/settingup-panel/tag-selection.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/settingup-panel/tag-selection.tpl.html", '<div class="divider" ng-if="!match.model.tag"></div>\n<div class="pull-left" ng-if="match.model.tag" ng-class="{\'ep-tag\': match.model.isEp, \'tag\': !match.model.isEp}">\n	<i ng-if="match.model.isEp"class="ynicon ynicon-level"></i>{{match.model.tag}}\n</div>\n')
}
]),
angular.module("angularjsapp/src/app/components/share-broadcast-modal/share-broadcast-modal.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/share-broadcast-modal/share-broadcast-modal.tpl.html", '<div class="modal-body">\n	<h5 class="title" translate="recommend_this_broadcast"></h5>\n	<div class="share-message" translate="share_invite_your_fans" translate-values="{ value: \'{{modal.session.user.totalFans}}\' }"></div>\n	<form name="modal.form" novalidate>\n		<input class="form-control" ng-model="modal.recommendMessage" ng-maxlength="60" maxlength="60" ng-required="true">\n	</form>\n	<div class="actions">\n		<button class="btn btn-cancel" ng-click="modal.closeModal()" translate="_cancel"></button>\n		<button class="btn btn-confirm" ng-click="modal.invite()" ng-disabled="modal.form.$invalid" translate="_invite"></button>\n	</div>\n 	<button aria-hidden="true" class="close btn-reset" ng-click="modal.closeModal()" type="button">\n		<i class="ynicon ynicon-close"></i>\n	</button>\n</div>')
}
]),
angular.module("angularjsapp/src/app/components/subscribe-button/subscribe-button.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/subscribe-button/subscribe-button.tpl.html", '<button class="btn btn-small btn-subscribe {{subStatus[channel.userId]?\'btn-subscribed\':\'btn-to-subscribe\'}} {{fanStatus[channel.userId]?\'is-fanned\':\'not-fanned\'}}" ng-if="( !hidden && ( fanStatus[channel.userId] || subStatus[channel.userId] ) )" ng-click="subscribe()">\n	<span class="tosubscribe" ng-if="!subStatus[channel.userId]">\n		<i class="ynicon ynicon-icon-subscribe"></i> {{\'_subscribe\' | translate}}\n	</span>\n	<span class="subscribed" ng-if="subStatus[channel.userId]">\n		<i class="ynicon ynicon-icon-check"></i> {{\'_subscribed\' | translate}}\n	</span>\n</button>\n')
}
]),
angular.module("angularjsapp/src/app/components/subscribe-modal/subscribe.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/subscribe-modal/subscribe.tpl.html", '<div class="modal-body show-{{vm.spanel}}">\n	\n	<button aria-hidden="true" class="pull-right close" ng-click="$dismiss()" type="button">\n		<i class="ynicon ynicon-close"></i>\n	</button>\n\n	<!-- 1 -->\n	<div class="spanel spanel-initial">\n\n		<div class="modal-top">\n			<div class="portrait thumb" ng-style="{\'background-image\': \'url(\'+vm.template.channelThumb+\'), url(\'+vm.template.noThumb+\')\'}">\n			</div>\n			<h2 class="heading">\n				Subscribe to {{(vm.channel.profile || vm.channel.profileUrlString)}} \n			</h2>\n		</div>\n		<div class="modal-middle">\n			<div class="title">\n				Support {{(vm.channel.profile || vm.channel.profileUrlString)}} and enjoy:\n			</div>\n			<div class="text list">\n				<p>Special badge for your profile and chat <span class="ynbadge"><img ng-src="{{::vm.config.settings.BadgeBaseUrl}}/{{vm.channel.userId}}/1/badge@2x.png" /></span></p>\n				<p>Bold, priority text in chat</p>\n				<p>Participation in Subscriber-Only chat</p>\n				<p>Directly supporting {{(vm.channel.profile || vm.channel.profileUrlString)}}</p>\n			</div>\n		</div>\n		<div class="modal-bottom">\n			<button class="btn btn-confirm" type="button" ng-click="vm.submitInitial()"><i class="ynicon ynicon-icon-subscribe"></i> {{ \'_subscribe\' | translate }}</button>\n		</div>\n		<div class="modal-below">\n			<div class="price">$4.99/month</div>\n		</div>\n\n	</div>\n\n	<!-- 2 -->\n	<div class="spanel spanel-email">\n	<form name="subscriptionsEmail" ng-submit="vm.submitEmail(subscriptionsEmail)" novalidate>\n\n		<div class="modal-top">\n			<div class="portrait thumb" ng-style="::{\'background-image\': \'url(\'+vm.template.channelThumb+\'), url(\'+vm.template.noThumb+\')\'}">\n				<span class="ynbadge">\n					<img ng-src="{{::vm.config.settings.BadgeBaseUrl}}/{{::vm.channel.userId}}/1/badge@2x.png" />\n				</span>\n			</div>\n			<h2 class="heading">\n				Purchase a Subscription\n			</h2>\n		</div>\n		<div class="modal-middle">\n			<div class="text">\n				Hey, we need your real email address! {{ vm.session.user.email ? \'\' : \'\' }} \n			</div>\n			<div class="form">\n				<input placeholder="Email address"\n					name="email"\n					class="form-control"\n					type="email" \n					ng-validate\n					required\n					ng-model="vm.session.user.email" \n					ng-pattern="emailRegex"\n					tooltip="Please enter valid email"\n					tooltip-trigger="show"\n					tooltip-append-to-body="true"\n					tooltip-placement="bottom error"\n					subscribe-validate />\n			</div>\n		</div>\n		<div class="modal-bottom">\n			<button class="btn btn-confirm" type="submit" {{ (subscriptionsEmail.$touched && subscriptionsEmail.$valid) ? \'\' : \'disabled\' }}>{{ \'_continue\' | translate }}</button>\n		</div> \n\n	</form>\n	</div>\n\n	<!-- 3 -->\n	<div class="spanel spanel-payment"> \n\n		<div class="modal-top">\n			<h2 class="heading">\n				Subscribe $4.99/month \n			</h2>\n		</div>\n		<div class="modal-middle">\n			<div class="title">\n				<span class="ynbadge"><img ng-src="{{::vm.config.settings.BadgeBaseUrl}}/{{::vm.channel.userId}}/1/badge@2x.png" /></span>\n				Support\n				{{(vm.channel.profile || vm.channel.profileUrlString)}}\n			</div>\n			<div class="text">\n				Enter your credit card information or pay with PayPal\n			</div>\n			<iframe id="braintree-iframe" \n				ng-if="config.buybarsiframe" \n				ng-src="{{::Api.trustedSrc(config.settings.ServerSecureLocalBaseUrl + \'/checkout.php\' )}}">\n			</iframe>\n			<form id="braintree-form" ng-if="!config.buybarsiframe">\n				<div id="braintree-dropin"></div>\n				<button type="submit" ng-disabled="vm.submitting || vm.braintreeLoading" class="btn btn-confirm">Submit{{vm.submitting?\'ing\':\'\'}}</button>\n			</form>\n			\n		</div>\n	</div>\n\n	<!-- 4 -->\n	<div class="spanel spanel-thankyou">\n		<div class="modal-top">\n			<div class="portrait thumb" ng-style="::{\'background-image\': \'url(\'+vm.template.channelThumb+\'), url(\'+vm.template.noThumb+\')\'}">\n				<span class="ynbadge">\n					<img ng-src="{{::vm.config.settings.BadgeBaseUrl}}/{{::vm.channel.userId}}/1/badge@2x.png" />\n				</span>\n			</div>\n			<div class="portrait thumb" ng-style="::{\'background-image\': \'url(\'+vm.template.userThumb+\'), url(\'+vm.template.noThumb+\')\'}">\n			</div>\n			<h2 class="heading">\n				Congratulations!\n			</h2>\n		</div>\n		<div class="modal-middle">\n			<div class="text">\n				<p>Begin enjoying your benefits immediately -- check out the {{(vm.channel.profile || vm.channel.profileUrlString)}} badge on your profile!</p>\n				<!--<p>You can manage your Subscriptions online using your Settings</p>-->\n			</div>\n		</div>\n		<div class="modal-bottom">\n			<button class="btn btn-confirm" type="button" ng-click="$dismiss()">{{ \'_awesome\' | translate }}!</button>\n		</div>\n	</div>\n\n</div>')
}
]),
angular.module("angularjsapp/src/app/components/trap-modal/trap-modal.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/trap-modal/trap-modal.tpl.html", '<div class="modal-body">\n	<button aria-hidden="true" class="pull-right close" ng-click="$dismiss()" type="button">\n		<i class="ynicon ynicon-close"></i>\n	</button>\n	<div class="cover-photo " ng-attr-style="{{::background(user.userId,\'Cover\')}}">\n		<div class="little-fade"></div>\n	</div>\n	<div class="bottom-cont ">\n		<div class="top-half">\n			<div class="left pull-left">\n				<a href="javascript:void(0)" style="display: inline-block; cursor: default;">\n					<div class="thumb" ng-attr-style="{{::background(user.userId)}}"></div>\n				</a>\n			</div>\n			<div class="right pull-left">\n				<div class="top pull-left">\n					<div class="level pull-left">\n						<div class="star pull-left" ng-style="::{ background: \'url(/images/groups/icon_pro_levelsm.png) no-repeat\'}"></div>\n						<div class="level-num pull-left">\n							<span>{{user.level}}</span>\n						</div>\n					</div>\n					<div class="channel-name-cont pull-left">\n						<span class="channel-name short-text">{{(user.profile || user.profileUrlString)}}</span>\n					</div>\n				</div>\n				<div class="bottom pull-left">\n					<div>\n						<span class="heading">{{heading}}</span>\n					</div>\n					<div ng-show="subheading">\n						<span class="subheading">{{subheading}}</span>\n					</div>\n				</div>\n			</div>\n		</div>\n		<div class="bottom-half">\n			<div class="call-to-action">\n				<div ng-if="fanTrap" class="fan-button-placeholder" track-source="{{(source?source:\'trap-modal\')}}">\n					<div fan-button channel="user" callback="$close"></div>\n				</div>\n				<button ng-if="loginTrap" ng-click="showLoginModal(\'\',(source?source:\'trap-modal\'))" class="btn btn-confirm" translate="signin_to_younow"></button>\n				<div class="no-thanks pull-right" ng-click="$dismiss()">\n					<span translate="no_thanks"></span>\n				</div>\n			</div>\n		</div>\n	</div>\n</div>\n')
}
]),
angular.module("angularjsapp/src/app/components/video-player/player-footer.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/video-player/player-footer.tpl.html", '<div id="playerfooter">\n	<div class="player-toolbar" ng-if="!vm.swf.settingUpBroadcast">\n		<div class="player-toolbar-left" ng-disabled="vm.swf.bootingFlash">\n			<div id="toolbar-like-button"\n					 class="toolbar-button"\n					 ng-class="{\'like-busy\':vm.cooldown}"\n					 ng-click="vm.doLike($event)"\n					 tooltip-html-unsafe="{{vm.likeTooltip()}}"\n					 tooltip-trigger="mouseenter"\n					 tooltip-append-to-body="true">\n				<img ng-src="/angularjsapp/src/assets/images/player-footer/like-{{vm.swf.fullscreenActive ? \'fullscreen\' : \'normal\'}}.{{vm.cooldown ? \'gif\' : \'png\'}}">\n			</div>\n			<span class="toolbar-like-count">{{vm.swf.broadcast.likes}}</span>\n			<div id="broadcast-shares"\n				class="toolbar-button"\n				tooltip-trigger="show"\n				tooltip-append-to-body="true"\n				tooltip="+{{vm.swf.broadcast.user_shares}}"\n				ng-click="vm.openSnapshot();">\n				<i class="ynicon ynicon-btn-bc-share2"></i>\n			</div>\n			<span class="share-like-count">{{vm.swf.broadcast.shares}}</span>\n			<div class="toolbar-button"\n				ng-if="vm.mcu && vm.swf.broadcast.mcu"\n				ng-click="vm.addGuest();">\n				<i class="ynicon ynicon-bc-call"></i>\n			</div>\n		</div>\n		<div class="player-toolbar-right" ng-disabled="vm.swf.bootingFlash">\n			<span class="ynicon ynicon-time"></span>\n			<span ng-if="!vm.swf.settingUpBroadcast">{{playerFooter.niceLength}}</span>\n			<span ng-if="vm.swf.settingUpBroadcast">00:00</span>\n			<span class="ynicon ynicon-viewers"></span>\n			<span>{{vm.swf.broadcast.viewers}}</span>\n			<span class="mute-container pull-right">\n				<div class="volume-bar clickable" ng-mousemove="vm.slideVolume($event)" ng-mouseup="vm.setVolume($event)">\n					<span class="volume-background">\n						<span class="volume-foreground" ng-style="{\'width\': vm.getVolume()+\'px\'}"></span>\n						<span class="volume-slider"></span>\n					</span>\n				</div>\n				<span\n					id="volume-icon"\n					class="volume-icon ynicon clickable"\n					ng-class="vm.muteIcon()"\n					ng-click="vm.setMute()"\n					tooltip-trigger="show"\n					tooltip-append-to-body="true"\n					tooltip="{{\'player_youre_muted\' | translate }}">\n				</span>\n			</span>\n		</div><!-- / toolbar left -->\n	</div><!-- / toolbar -->\n	<div id="settingup-toolbar" ng-if="vm.swf.settingUpBroadcast">\n		<div class="toolbar-center">\n			<div class="toolbar-button dropup" dropdown>\n				<button\n					class="btn btn-transparent dropdown-toggle"\n					ng-click="vm.broadcastSettings.cameraSetup()"\n					tooltip="Change Camera"\n					tooltip-trigger="mouseenter"\n					tooltip-append-to-body="true"\n					dropdown-toggle>\n						<i class="ynicon ynicon-broadcast"></i> Camera\n				</button>\n			   	<ul class="dropdown-menu" role="menu">\n					<i class="ynicon ynicon-carrot-dwn"></i>\n					<li ng-repeat="camera in vm.cameraOptions track by $index">\n						<a href ng-click="vm.broadcastSettings.setCamera($index)">{{camera.name}} <i ng-if="camera.current" class="ynicon ynicon-icon-check"></i></a>\n					</li>\n			    </ul>\n			</div>\n			<div class="mute-container toolbar-button dropup" dropdown>\n				<button\n					class="btn btn-transparent dropdown-toggle"\n					ng-click="vm.broadcastSettings.microphoneSetup()"\n					tooltip="Change Microphone"\n					tooltip-trigger="mouseenter"\n					tooltip-append-to-body="true"\n					dropdown-toggle>\n					<i class="ynicon" ng-class="vm.muteIcon()"></i>\n					Mic\n				</button>\n			  <ul class="dropdown-menu" role="menu">\n					<i class="ynicon ynicon-carrot-dwn"></i>\n					<li ng-repeat="microphone in vm.microphoneOptions track by $index">\n						<a href ng-click="vm.broadcastSettings.setMicrophone($index)">{{microphone.name}} <i ng-if="microphone.current" class="ynicon ynicon-icon-check"></i></a>\n					</li>\n			  </ul>\n			</div>\n			<div class="volume-bar clickable toolbar-button" ng-mousemove="vm.slideVolume($event)" ng-mouseup="vm.setVolume($event)">\n				<span class="volume-background">\n					<span class="volume-foreground" ng-style="{\'width\': vm.getVolume()+\'px\'}"></span>\n					<span class="volume-slider"></span>\n				</span>\n			</div>\n	</div>\n</div>\n')
}
]),
angular.module("angularjsapp/src/app/components/video-player/player-header.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/video-player/player-header.tpl.html", '<div id="playerheader">\n	<a\n	class="thumb circle-thumb pull-left"\n	ng-if="!vm.swf.settingUpBroadcast && !vm.swf.currentSession.isBroadcasting"\n	ng-style="{ background: \'url(\' + vm.thumb + vm.broadcast.broadcaster.userId + \'), url({{::vm.noThumb}}) no-repeat\', \'background-size\': \'cover\' }"\n	ng-href="/{{vm.broadcast.broadcaster.profile}}" prevent-default\n	ng-click="vm.openBroadcasterProfile(vm.broadcast.broadcaster.userId)">\n		<span class="ynbadge" ng-if="vm.broadcast.broadcaster.isSubscribable && !vm.swf.settingUpBroadcast">  \n			<img ng-src="{{::vm.config.settings.BadgeBaseUrl}}/{{vm.broadcast.broadcaster.userId}}/1/badge@2x.png" />\n		</span>\n	</a>\n	<a\n	class="thumb circle-thumb pull-left"\n	ng-if="vm.swf.settingUpBroadcast || vm.swf.currentSession.isBroadcasting"\n	ng-style="{ background: \'url(\' + vm.thumb + vm.session.user.userId + \'), url({{::vm.noThumb}}) no-repeat\', \'background-size\': \'cover\' }"\n	ng-href="/{{vm.session.user.profile}}" prevent-default\n	ng-click="vm.openBroadcasterProfile(vm.session.user.userId)">\n		<span class="ynbadge" ng-if="vm.broadcast.broadcaster.isSubscribable && !vm.swf.settingUpBroadcast">\n			<img ng-src="{{::vm.config.settings.BadgeBaseUrl}}/{{vm.broadcast.broadcaster.userId}}/1/badge@2x.png" />\n		</span>\n	</a>\n	<!-- viewer view -->\n	<div class="broadcast-info" ng-if="!vm.swf.settingUpBroadcast && !vm.swf.currentSession.isBroadcasting && vm.broadcast.broadcaster.userId != vm.session.user.userId">\n		<a\n		ng-href="/{{vm.broadcast.broadcaster.profile}}" prevent-default\n		ng-click="vm.openBroadcasterProfile(vm.broadcast.broadcaster.userId)"\n		class="broadcaster-name short-text">\n			<i class="ynicon ynicon-level"></i> {{vm.Math.floor(vm.broadcast.broadcaster.userlevel)}} {{vm.broadcast.broadcaster.username}}\n		</a>\n		<span class="broadcaster-tag short-text"> on </span>\n		<a\n		class="broadcaster-tag short-text"\n		ng-repeat="tag in vm.broadcast.broadcaster.tags"\n		ng-href="/explore/{{tag}}" prevent-default\n		ng-click="vm.Api.goto(\'explore/\' + tag)">\n			#{{tag}}\n		</a>\n		<div class="fan-button-placeholder" track-source="BROADCAST">\n			<div fan-button size="small" channel="vm.broadcast.broadcaster.user"></div>\n		</div>\n		<div class="fan-button-placeholder subscribe-button-placeholder" track-source="BROADCAST">\n			<div subscribe-button size="small" channel="vm.broadcast.broadcaster.user"></div>\n		</div>\n		<div class="broadcaster-description line-clamp" ng-bind-html="vm.broadcast.broadcaster.user.description"></div>\n	</div>\n	<!-- broadcaster view -->\n	<div class="broadcast-info" ng-if="(vm.broadcast.broadcaster.userId==vm.session.user.userId) && !vm.swf.settingUpBroadcast">\n		<!-- mode -->\n		<div class="broadcast-info submode" ng-if="vm.broadcast.broadcaster.isSubscribable && !vm.newRank">\n			<div class="top">\n				<span class="stitle">Subscriber-only chat mode:</span>\n				<span class="switch s{{ vm.broadcast.chatMode ? \'on\' : \'off\' }}" ng-click="vm.chatModeToggle()">\n					<span class="sknob"></span>\n				</span>\n				<span class="sinfo">{{ vm.broadcast.chatMode ? \'On\' : \'Off\' }}</span>\n			</div>\n			<div class="bot">\n				({{ vm.swf.broadcast.subscribersCount }} Subscriber{{vm.swf.broadcast.subscribersCount!=1 ? \'s\' : \'\'}})\n			</div>\n		</div>\n		<!-- rank -->\n		<div class="broadcaster-setup-description" ng-if="!vm.broadcast.broadcaster.isSubscribable || vm.newRank">\n			<div class="short-text">{{vm.session.user.fullName}}</div>\n			<span class="short-text">,</span>\n			<span class="short-text user-rank">{{\'you are\' | translate }} {{vm.broadcast.broadcaster.tagRank}} </span>\n			<span class="broadcaster-tags short-text"> {{\'on\' | translate }} </span>\n			<a\n			class="broadcaster-tags short-text"\n			ng-repeat="tag in vm.broadcast.broadcaster.tags"\n			ng-href="/explore/{{tag}}" prevent-default\n			ng-click="vm.Api.goto(\'explore/\' + tag)">\n				#{{tag}}\n			</a>\n		</div>\n	</div>\n	<!-- broadcaster setup -->\n	<div class="broadcast-info" ng-if="vm.swf.settingUpBroadcast">\n		<div class="broadcaster-setup-description">\n			<div class="short-text">{{vm.session.user.fullName}}</div>\n			<span class="setup-copy short-text">, {{\'player_get_ready_for_your_broadcast\' | translate }}</span>\n		</div>\n	</div>\n</div>\n')
}
]),
angular.module("angularjsapp/src/app/components/video-player/player-overlay.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/video-player/player-overlay.tpl.html", '<div class="intro-video-overlay" ng-if="vm.swf.bootingFlash && vm.broadcast.async === false">\n	<intro-video></intro-video>\n</div>\n<div class="transition-overlay" ng-if="vm.swf.loadingBroadcasterState">\n	<!-- dissapate dead broadcast -->\n	<div ng-if="vm.swf.loadingBroadcasterState === \'PREV\' && !vm.swf.settingUpBroadcast " class="thumbnail-pulse circle-thumb">\n		<div class="thumb circle-thumb" ng-style="{ background: \'url({{::vm.thumb}}\' + vm.broadcast.broadcaster.userId + \') no-repeat, url({{::vm.noThumb}}) no-repeat\', \'background-size\': \'cover\' }"></div>\n	</div>\n	<!-- buffering new broadcast -->\n	<div ng-if="(vm.swf.playState === \'BUFFERING\' || vm.swf.loadingBroadcasterState === \'NEXT\') && !vm.swf.settingUpBroadcast" class="thumbnail-pulse circle-thumb" style="background: url({{::vm.pulseAnimation}}) no-repeat; background-position: center;">\n		<div class="thumb circle-thumb" ng-style="{ background: \'url({{::vm.thumb}}\' + vm.broadcast.broadcaster.userId + \') no-repeat, url({{::vm.noThumb}}) no-repeat\', \'background-size\': \'cover\' }"></div>\n	</div>\n	<!-- reconnect screen -->\n	<div ng-if="vm.swf.playState === \'RECONNECT\' && !vm.swf.settingUpBroadcast" class="thumbnail-pulse circle-thumb" style="background: url({{::vm.pulseAnimation}}) no-repeat; background-position: center;">\n		<div class="thumb circle-thumb" ng-style="{ background: \'url({{::vm.thumb}}\' + vm.broadcast.broadcaster.userId + \') no-repeat, url({{::vm.noThumb}}) no-repeat\', \'background-size\': \'cover\' }"></div>\n	</div>\n	<!-- buffering your own broadcast -->\n	<div ng-if="vm.swf.settingUpBroadcast" class="thumbnail-pulse circle-thumb" style="background: url({{::vm.pulseAnimation}}) no-repeat; background-position: center;">\n		<div class="thumb circle-thumb" ng-style="{ background: \'url({{::vm.thumb}}\' + vm.session.user.userId + \') no-repeat, url({{::vm.noThumb}}) no-repeat\', \'background-size\': \'cover\' }"></div>\n	</div>\n	<div class="user-info" ng-if="vm.swf.settingUpBroadcast"><i class="ynicon ynicon-level"></i>{{::vm.session.user.level}} {{::vm.session.user.profile}}</div>\n	<div class="user-info" ng-if="!vm.swf.settingUpBroadcast"><i class="ynicon ynicon-level"></i>{{vm.Math.floor(vm.broadcast.broadcaster.userlevel)}} {{vm.broadcast.broadcaster.profile}}</div>\n	<div class="transition-text" ng-if="vm.swf.loadingBroadcasterState === \'NEXT\' || vm.swf.loadingBroadcasterState === \'WAITING\'" translate="player_going_live"></div>\n	<div class="transition-text" ng-if="vm.swf.loadingBroadcasterState === \'RECONNECT\'">Reconnecting...</div>\n</div>\n<div class="message-overlay" ng-if="vm.swf.settingUpBroadcast">\n	<!-- canceling the setup -->\n	<button class="drop-broadcast btn btn-transparent active" ng-click="vm.cancelBroadcast()">\n		<i class="ynicon ynicon-close"></i>\n	</button>\n	<!-- mirroring the setup -->\n	<button class="mirror-camera btn btn-transparent"\n					ng-class="{mirrored: vm.mirroredCamera}"\n					ng-click="vm.mirrorCamera()"\n					tooltip="Mirror Camera"\n					tooltip-trigger="mouseenter">\n		<i class="ynicon ynicon-camera-rotate"></i>\n	</button>\n</div>\n<!-- dropping broadcast state -->\n<div ng-if="vm.swf.broadcast.userId === vm.session.user.userId && !vm.swf.settingUpBroadcast && !vm.swf.eob">\n	<div class="live-text active">You are Live</div>\n	<button class="drop-broadcast btn btn-transparent active" ng-click="vm.dropBroadcast(true)">\n		<i class="ynicon ynicon-close"></i>\n	</button>\n	<div class="drop-broadcast-confirmation" ng-class="{active: vm.dropBroadcastActive}">\n		<div>Are you sure?</div>\n		<button class="btn btn-transparent" ng-click="vm.dropBroadcast()">Yes</button>\n		<button class="btn btn-transparent" ng-click="vm.dropBroadcast(false)">No</button>\n	</div>\n</div>\n<button class="drop-broadcast btn btn-transparent active" ng-if="vm.swf.eob !== undefined" ng-click="vm.clearEOB()">\n	<i class="ynicon ynicon-close"></i>\n</button>\n</div>\n\n<!-- top -->\n<div class="system-message" collapse="!vm.systemMessage.hasMessage || vm.systemMessage.dismissed" ng-if="!vm.swf.settingUpBroadcast">\n	<span class="sys-message" ng-bind-html="vm.systemMessage.message.trustedMessage"></span>\n	<a ng-if="vm.systemMessage.message.webButton.action" ng-href="{{vm.systemMessage.message.webButton.action}}" target="_blank" class="cta-button">{{vm.systemMessage.message.webButton.caption}}</a>\n	<div class="close-button" ng-click="vm.systemMessage.dismissed = true"><i class="ynicon ynicon-close"></i></div>\n</div>\n\n<!-- eob -->\n<div class="eob-overlay" ng-class="{active: vm.swf.eob.visible}" ng-if="vm.swf.eob !== undefined">\n	\n\n	<!-- NON PARTNER -->\n	<table ng-if="vm.swf.eob.partner!=1 && vm.swf.eob.partner!=2 && vm.swf.eob.partner!=6 && vm.swf.eob.partner!=7" class="eob-valign"><tr><td>\n		<h2>{{::vm.swf.eob.scoreText}}</h2>\n		<ul class="eob-list">\n			<li>\n				<div>Viewers</div>\n				<div>{{::vm.swf.eob.viewers ||0}}</div>\n			</li>\n			<li>\n				<div>Duration</div>\n				<div>{{::vm.swf.eob.duration ||0}}</div>\n			</li>\n			<li ng-if="vm.swf.eob.fansAdded!=0">\n				<div>New Fans</div>\n				<div>{{::vm.swf.eob.fansAdded ||0}}</div>\n			</li>\n			<li>\n				<div>Premium Gift Givers</div>\n				<div>{{::vm.swf.eob.spendersCount ||0}}</div>\n			</li>\n			<li>\n				<div>Shares</div>\n				<div>{{::vm.swf.eob.shares ||0}}</div>\n			</li>\n			<li ng-if="vm.swf.eob.fansAdded==0">\n				<div>Likes</div>\n				<div>{{::vm.swf.eob.likes ||0}}</div>\n			</li>\n		</ul>\n		<div>\n			<div class="level-copy">Progress: {{::vm.swf.eob.progress}}% to Level {{::vm.swf.eob.nextLevel}}</div>\n			<div class="level-bar">\n				<div class="total-progress pull-left" ng-style="{\'width\': vm.swf.eob.startLevel+\'%\'}"></div>\n				<div class="last-progress pull-left" ng-style="{\'width\': vm.swf.eob.endLevel+\'%\'}"></div>\n			</div>\n			<button class="btn btn-primary" ng-click="vm.broadcastAgain()">\n				Broadcast Again\n			</button>\n		</div>\n	</td></tr></table>\n\n\n	<!-- CANDIDATE PARTNER -->\n	<table ng-if="vm.swf.eob.partner==2 || vm.swf.eob.partner==6 || vm.swf.eob.partner==7" class="eob-valign"><tr><td>\n		<h2>You Can Earn Revenue!</h2>\n		<ul class="eob-list">\n			<li>\n				<div>Viewers</div>\n				<div>{{::vm.swf.eob.viewers ||0}}</div>\n			</li>\n			<li>\n				<div>Duration</div>\n				<div>{{::vm.swf.eob.duration ||0}}</div>\n			</li>\n			<li ng-if="vm.swf.eob.fansAdded!=0">\n				<div>New Fans</div>\n				<div>{{::vm.swf.eob.fansAdded ||0}}</div>\n			</li>\n			<li>\n				<div>Premium Gift Givers</div>\n				<div>{{::vm.swf.eob.spendersCount ||0}}</div>\n			</li>\n			<li>\n				<div>Shares</div>\n				<div>{{::vm.swf.eob.shares ||0}}</div>\n			</li>\n			<li ng-if="vm.swf.eob.fansAdded==0">\n				<div>Likes</div>\n				<div>{{::vm.swf.eob.likes ||0}}</div>\n			</li>\n		</ul>\n		<ul class="eob-emphasized">\n			<li>\n				<div>Est. Premium Gift Earnings</div>\n				<div>${{::vm.swf.eob.estimatedGiftsEarnings||\'0.00\'}}</div>\n			</li>\n		</ul>\n		<div>\n			<div>\n				<div class="partner-copy-important">You need to accept our Partner Agreement.</div>\n				<a class="btn btn-confirm" href="/partners" target="_blank">Continue</a>\n			</div>\n		</div>\n	</td></tr></table>\n\n\n	<!-- PARTNER - NOT SUBSCRIBABLE -->\n	<table ng-if="vm.swf.eob.partner==1 && !vm.swf.broadcast.isSubscribable" class="eob-valign"><tr><td>\n		<h2>{{::vm.swf.eob.scoreText}}</h2>\n		<ul class="eob-list">\n			<li>\n				<div>Viewers</div>\n				<div>{{::vm.swf.eob.viewers ||0}}</div>\n			</li>\n			<li>\n				<div>Duration</div>\n				<div>{{::vm.swf.eob.duration ||0}}</div>\n			</li>\n			<li ng-if="vm.swf.eob.fansAdded!=0">\n				<div>New Fans</div>\n				<div>{{::vm.swf.eob.fansAdded ||0}}</div>\n			</li>\n			<li>\n				<div>Premium Gift Givers</div>\n				<div>{{::vm.swf.eob.spendersCount ||0}}</div>\n			</li>\n			<li>\n				<div>Shares</div>\n				<div>{{::vm.swf.eob.shares ||0}}</div>\n			</li>\n			<li ng-if="vm.swf.eob.fansAdded==0">\n				<div>Likes</div>\n				<div>{{::vm.swf.eob.likes ||0}}</div>\n			</li>\n		</ul>\n		<ul class="eob-emphasized">\n			<li>\n				<div>Est. Premium Gift Earnings</div>\n				<div>${{::vm.swf.eob.estimatedGiftsEarnings||\'0.00\'}}</div>\n			</li>\n		</ul>\n		<div>\n			<div>\n				<a class="btn btn-primary" href="/partners/earnings">View Monthly Earnings</a>\n			</div>\n		</div>\n	</td></tr></table>\n\n\n	<!-- PARTNER - SUBSCRIBABLE -->\n	<table ng-if="vm.swf.eob.partner==1 && vm.swf.broadcast.isSubscribable" class="eob-valign"><tr><td>\n		<h2>{{::vm.swf.eob.scoreText}}</h2>\n		<ul class="eob-list">\n			<li>\n				<div>Viewers</div>\n				<div>{{::vm.swf.eob.viewers ||0}}</div>\n			</li>\n			<li>\n				<div>Duration</div>\n				<div>{{::vm.swf.eob.duration ||0}}</div>\n			</li>\n			<li ng-if="vm.swf.eob.fansAdded!=0">\n				<div>New Fans</div>\n				<div>{{::vm.swf.eob.fansAdded ||0}}</div>\n			</li>\n			<li>\n				<div>Premium Gift Givers</div>\n				<div>{{::vm.swf.eob.spendersCount ||0}}</div>\n			</li>\n			<li>\n				<div>Shares</div>\n				<div>{{::vm.swf.eob.shares ||0}}</div>\n			</li>\n		</ul>\n		<ul class="eob-emphasized">\n			<li>\n				<div>Est. Premium Gift Earnings</div>\n				<div>${{::vm.swf.eob.estimatedGiftsEarnings||\'0.00\'}}</div>\n			</li>\n		</ul>\n		<ul class="eob-list">\n			<li>\n				<div>New Paid Subscribers</div>\n				<div>{{::vm.swf.eob.subscribersAdded ||0}}</div>\n			</li>\n		</ul>\n		<ul class="eob-emphasized">\n			<li class="partner-earnings">\n				<div>Est. New Subscription Earnings</div>\n				<div>${{::vm.swf.eob.subscriptionEarnings ||0}}/mo</div>\n			</li>\n		</ul>\n		<div>\n			<div>\n				<a class="btn btn-primary" href="/partners/earnings">View Monthly Earnings</a>\n			</div>\n		</div>\n	</td></tr></table>\n\n</div>\n\n<!-- gifts -->\n<div class="premium-overlay" ng-class="{\'overlay-fade\': vm.gift == false || vm.swf.settingUpBroadcast, \'overlay-fade-in\': vm.gift !== false && !vm.swf.settingUpBroadcast, \'premium-small\': vm.swf.sharePanelOpen}">\n	<div class="gift-overlay" ng-class="{ \'subscription-gift-overlay\' : vm.gift.giftId==63 }">\n		<!-- subscription -->\n		<div class="subscription-gift" ng-if="vm.gift.giftId==63">\n			<span \n			class="gbroadcaster thumb" \n			ng-style="{ background: \'url({{::vm.thumb}}\' + vm.swf.broadcast.userId + \'), url({{::vm.noThumb}}) no-repeat\', \'background-size\': \'cover\' }" \n			>\n				<span class="ynbadge">\n					<img ng-src="{{::vm.config.settings.BadgeBaseUrl}}/{{::vm.swf.broadcast.userId}}/1/badge@2x.png" />\n				</span>\n			</span>\n			<span class="gspace thumb" ng-class="{ \'animateSubs \' : vm.gift.animateSubs }"></span>\n			<span \n			class="guser thumb" \n			ng-style="{ background: \'url({{::vm.thumb}}\' + vm.gift.userId + \'), url({{::vm.noThumb}}) no-repeat\', \'background-size\': \'cover\' }" \n			ng-href="/{{vm.gift.name}}/channel" prevent-default \n			ng-click="vm.openProfile(vm.gift.userId)">\n			</span>\n		</div>\n		<!-- gift -->\n		<div class="premium-gift" ng-if="vm.gift.giftId!=63">\n			<img ng-src="{{::vm.giftOverlayUrl}}/gift_overlay_{{vm.swf.giftSkus[vm.gift.giftId] | lowercase}}.png">\n			<div\n			class="thumb"\n			ng-class="{ \'visibilityhidden\' : !vm.isProposalGift(vm.gift.giftId) }"\n			ng-style="{ background: \'url({{::vm.thumb}}\' + vm.userId + \'), url({{::vm.noThumb}}) no-repeat\', \'background-size\': \'cover\' }"\n			ng-href="/{{vm.session.user.profile}}" prevent-default\n			ng-click="vm.openProfile(vm.userId)">\n			</div>\n		</div>\n		<span class="gift-message">{{vm.gift.comment}}</span>\n	</div>\n</div>\n\n<!-- quality -->\n<div class="quality-overlay" ng-if="vm.swf.currentSession.isBroadcasting && vm.broadcast.broadcaster.userId == vm.session.user.userId">\n	<div class="quality-ui quality-bars-{{ vm.Math.ceil( ( ( ( vm.swf.broadcast.quality ? vm.swf.broadcast.quality.percent : 50 )*100) / 2) / 10 ) }}">\n		<div class="percent">\n			{{ (vm.swf.broadcast.quality.percent * 100) | number:0 }}%\n		</div>\n		<div class="bars"><div class="bar bar1"><div class="bar-inner"></div></div><div class="bar bar2"><div class="bar-inner"></div></div><div class="bar bar3"><div class="bar-inner"></div></div><div class="bar bar4"><div class="bar-inner"></div></div><div class="bar bar5"><div class="bar-inner"></div></div></div>\n	</div>\n</div>\n');
}
]),
angular.module("angularjsapp/src/app/components/youtube-subscribe/youtube-subscribe.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/components/youtube-subscribe/youtube-subscribe.tpl.html", '<div ng-attr-style="width:425px;background:url(\'{{base}}/images/back_pop_youtube.jpg\') no-repeat;height:210px;text-align:center;border:0px;">\n\n    <!-- header //-->\n    <div style="height:30px;"></div>\n    <!-- end header //-->\n\n    <div style="height:55px;">\n    </div>\n\n    <div ng-if="channel" class="g-ytsubscribe" data-channel="{{channel}}" data-layout="full" data-count="default" data-onytevent="onYtEvent"></div>\n    <div ng-if="channelid" class="g-ytsubscribe" data-channelid="{{channelid}}" data-layout="full" data-count="default" data-onytevent="onYtEvent"></div>\n\n    <div style="height:30px;">\n    </div>\n\n</div>\n<a id="fancybox-close" ng-click="$dismiss()"></a>')
}
]),
angular.module("angularjsapp/src/app/states/about/about.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/states/about/about.tpl.html", '<div ng-if="visible" id="page_home">\n	<link rel="stylesheet" ng-href="{{::cdn.base}}/css/landing/flexslider.css">\n	<!-- header -->\n	<header>\n		<div class="content">\n			<a class="logo nav-logo pull-left" ng-href="/" ng-click="aboutClick(\'To site\', \'YouNow Logo\')" mobile-hide>\n				<img ng-src="{{::cdn.image}}/younow_header/younow-hd-noshadow.png">\n			</a>\n			<a class="logo" ng-href="/" ng-click="aboutClick(\'To site\', \'YouNow Logo\')" mobile-show>\n				<img ng-src="{{::cdn.image}}/younow_header/younow-hd-noshadow.png">\n			</a>\n		</div>\n	</header><!-- / header -->\n\n\n	<!-- intro -->\n	<section class="intro">\n\n		<!-- splashvideo -->\n		<video class="intro_video" autoplay loop ng-attr-poster="{{::cdn.base}}/images/about/novideo.jpg" id="video">\n			<source ng-src="{{::trustedSrc(cdn.base+\'/landing/video/younow_shade2.webmhd.webm\')}}" type="video/webm">\n			<source ng-src="{{::trustedSrc(cdn.base+\'/landing/video/younow_shade2.mp4\')}}" type="video/mp4">\n		</video>\n		<div class="intro_photo" ng-style="::{background: \'url({{::cdn.base}}/images/about/novideo2.jpg) center no-repeat\'}"></div>\n\n\n		<!-- splashtext -->\n		<div class="intro_content">\n			<div class="content">\n\n\n				<h1 class="intro_text1">Express Yourself</h1>\n				<div class="intro_text2">Broadcast to a live audience. Explore and engage with talented content creators. <br>Connect with our vibrant real-time community.</div>\n\n\n				<div class="lbuttons">\n					<div class="lbuttons_buttons ">\n						<div class="x_apps">\n							<a class="lbuttons_button" ng-click="aboutClick(\'To App store\', \'Android top\')" href="https://play.google.com/store/apps/details?id=younow.live&referrer=utm_source%3Dyounow.com%26utm_campaign%3Dapp-promo-android%26utm_medium%3Dreferral%26utm_content%3Dweb-about-1-btn1" target="_blank">\n								<img ng-src="{{::cdn.base}}/images/about/btn_googleplay.png" width="204" height="55" name="googlebutton" border="0" />\n							</a>\n							<a class="lbuttons_button" ng-click="aboutClick(\'To App store\', \'iOS top\')" href="https://itunes.apple.com/app/apple-store/id471347413?mt=8&pt=669563&ct=web-about-1-btn1" target="_blank">\n								<img ng-src="{{::cdn.base}}/images/about/btn_ios.png" width="204" height="55" name="iosbutton" border="0" />\n							</a>\n						</div>\n						<div class="x_apps x_large">\n							<a class="lbuttons_button watchnow" href ng-click="watchLiveNow($event,\'Watch live top\')">\n								Watch Live Now\n							</a>\n						</div>\n					</div>\n					<div class="lbuttons_subtext">\n					</div>\n				</div>\n			</div>\n		</div><!-- / splashtext -->\n\n\n	</section><!-- / intro -->\n\n\n	<!-- withyounow -->\n	<section class="wy">\n\n		<div class="content">\n\n			<h2 class="wy_heading">\n				With YouNow You Can:\n			</h2>\n\n			<div class="wy_columns">\n\n				<div class="wy_column">\n					<div class="image"><img ng-src="{{::cdn.base}}/images/about/with_broadcast.jpg" width="222" height="222"></div>\n					<div class="title">Broadcast<br>Yourself</div>\n					<div class="text">\n					Tap ‘Go Live’ and you’re on! Broadcast to a live audience, expand your social media following, and grow your very own, loyal fanbase.\n					</div>\n				</div>\n\n				<div class="wy_column">\n					<div class="image"><img ng-src="{{::cdn.base}}/images/about/with_discover.jpg" width="222" height="222"></div>\n					<div class="title">Discover Great <br>People</div>\n					<div class="text">\n					From live DJs & musicians to YouTubers & Viners, discover talented content creators and promote your favorites to the top!\n					</div>\n				</div>\n\n				<div class="wy_column">\n					<div class="image"><img ng-src="{{::cdn.base}}/images/about/with_power.jpg" width="222" height="222"></div>\n					<div class="title">Uncover the <br>Power of You</div>\n					<div class="text">\n					Whether you are in front of the camera or behind it, join a friendly community of people who love spending time together, and make your mark!\n					</div>\n				</div>\n\n			</div>\n\n		</div>\n\n	</section><!-- / withyounow -->\n\n\n	<!-- promovideo -->\n	<section class="pv" ng-style="::{background: \'url({{::cdn.base}}/landing/novideo_promo_retina.jpg) no-repeat\'}">\n		<video class="pv_video" id="pv_video" ng-cloak ng-attr-poster="{{::cdn.base + \'/landing/novideo_promo_retina.jpg\'}}" ng-click="aboutClick(\'Watch video\', \'Pause\')"\n		onclick="\n			document.getElementById(\'pv_video\').pause();\n			document.getElementById(\'pv_play\').style.display=\'block\';\n		">\n			<source ng-src="{{::cdn.base + \'/landing/video/younow_promo.mp4\' }}" type="video/mp4">\n			Sorry, your browser does not support HTML5 video.\n		</video>\n		<div class="pv_play"\n				id="pv_play"\n				ng-style="::{background: \'url({{::cdn.base}}/landing/btn_play_about.png) no-repeat\'}"\n				ng-click="aboutClick(\'Watch video\', \'Play\')"\n				onclick=" document.getElementById(\'pv_video\').play(); document.getElementById(\'pv_play\').style.display=\'none\';">\n			</div>\n	</section><!-- / promovideo -->\n\n	<!-- community reviews -->\n	<section class="cr" ng-style="::{background: \'#f4f8ef url({{::cdn.base}}/images/about/back_quote.png) center no-repeat\'}">\n\n		<div class="content">\n\n			<h2 class="cr_heading">What our community is saying...</h2>\n\n			<div class="cr_reviews">\n\n				<div class="cr_review">\n					Once you start using it, you can\'t stop. You meet so many cool people from all over the world. So many diverse talents: singers, rappers, artists and performers of every type.\n				</div>\n				<div class="cr_signature">\n					<img ng-src="{{::cdn.base}}/images/about/thumb_rev1.png" width="40" height="40">\n					<span>Gavin, London, UK</span>\n				</div>\n\n				<div class="cr_review">\n					I absolutely love this app! The people on here are so friendly. If you\'re in a bad mood, just get on YouNow - it always makes me smile.\n				</div>\n				<div class="cr_signature">\n					<img ng-src="{{::cdn.base}}/images/about/thumb_rev2.png" width="40" height="40">\n					<span>Cierra, Little Rock, AR</span>\n				</div>\n\n			</div>\n\n		</div>\n\n	</section><!-- / reviews -->\n\n\n	<!-- getapp -->\n	<section class="getapp" >\n\n		<div class="content" >\n\n			<h2 class="getapp_heading">Get the App!</h2>\n\n			<img class="getapp_image" ng-src="{{::cdn.base}}/images/about/gettheapp.jpg" width="880" height="426">\n\n			<!-- buttons - copied from above -->\n			<div class="lbuttons">\n			<div class="lbuttons_buttons" style="padding:25px 0 0 0;">\n			<div class="x_apps x_dark">\n			<a class="lbuttons_button" ng-click="aboutClick(\'To App store\', \'Android bottom\')" href="https://play.google.com/store/apps/details?id=younow.live&referrer=utm_source%3Dyounow.com%26utm_campaign%3Dapp-promo-android%26utm_medium%3Dreferral%26utm_content%3Dweb-about-1-btn2" target="_blank">\n			<img ng-src="{{::cdn.base}}/images/about/btn_googleplay.png" width="204" height="55" name="googlebutton" border="0" />\n			</a>\n			<a class="lbuttons_button" ng-click="aboutClick(\'To App store\', \'iOS bottom\')" href="https://itunes.apple.com/app/apple-store/id471347413?mt=8&pt=669563&ct=web-about-1-btn2" target="_blank">\n			<img ng-src="{{::cdn.base}}/images/about/btn_ios.png" width="204" height="55" name="iosbutton" border="0" />\n			</a>\n			</div>\n			</div>\n			</div>\n\n\n		</div>\n\n	</section><!-- / getapp -->\n\n\n	<!-- watchnow -->\n	<section class="watchnow">\n\n		<div class="content" >\n\n			<h2 class="watchnow_heading">Want to see what’s live now?</h2>\n\n			<!-- buttons - copied from above -->\n\n			<!-- logged IN -->\n			<div class="lbuttons">\n			<div class="lbuttons_buttons" style="padding:20px 0 0 0;">\n			<div class="x_apps">\n			<a class="lbuttons_button watchnow" href="" ng-click="watchLiveNow($event,\'Enter site bottom\')">\n			Enter Site\n			</a>\n			</div>\n			</div>\n			</div>\n		</div>\n\n	</section><!-- / watchnow -->\n\n\n	<!-- about -->\n	<section class="about" >\n\n		<div class="content" >\n\n			<a name="about"></a>\n			<h2 class="about_heading">About YouNow</h2>\n\n			<div class="maincontent">\n				<p>We believe in the unlimited potential of human creativity. In fact, it’s why we come to work every day - to create a powerful platform where anyone can broadcast and express themselves in front of a vast live audience.</p>\n				<p>In a moment when social media and TV are converging, we’re proud to provide a product that fuses the experience of broadcasting, gaming, performing and social networking, giving direct power to the people and enabling them to discover and create new kinds of interactive content in real-time.</p>\n				<p>Long at the forefront of user-generated video, we’re a small and experienced team working from a sunny loft in Midtown Manhattan. And we’re backed by\n				<a href="http://techcrunch.com/2014/02/22/meet-oren-zeev-silicon-valleys-builder-investor/" ng-click="aboutClick(\'About link\', \'Oren\')" target="_blank">Oren’s Capital</a>, and VCs like\n				<a href="http://www.usv.com" ng-click="aboutClick(\'About link\', \'USV\')" target="_blank">Union Square Ventures</a> and\n				<a href="http://www.venrock.com" ng-click="aboutClick(\'About link\', \'Venrock\')" target="_blank">Venrock</a> - the same firms that first helped Twitter, Apple, Tumblr and others become tech heavy-hitters.</p>\n				<p>Want to learn more? Check out what\n				<a href="http://www.usatoday.com/story/tech/2015/05/14/teens-flock-to-younow/27321135/" ng-click="aboutClick(\'About link\', \'USA Today\')" target="_blank">USA Today</a>,\n				<a href="http://www.businessinsider.com/younow-profile-2015-4" ng-click="aboutClick(\'About link\', \'Business Insider\')" target="_blank">Business Insider</a>,\n				<a href="http://www.theverge.com/2015/3/20/8257141/younow-app-live-streaming-meerkat-amateur-video" ng-click="aboutClick(\'About link\', \'The Verge\')" target="_blank">The Verge</a>,\n				<a href="http://www.variety.com/2015/digital/news/never-mind-periscope-or-meerkat-younow-has-already-paid-top-live-streamers-1-million-1201483789" ng-click="aboutClick(\'About link\', \'Variety\')" target="_blank">Variety</a>,\n				<a href="http://www.recode.net/2014/10/29/younow-is-the-live-video-amateur-hour-that-nearly-died-now-its-booming-heres-how" ng-click="aboutClick(\'About link\', \'Recode\')" target="_blank">Re/Code</a>,\n				<a href="http://www.buzzfeed.com/katienotopoulos/im-addicted-to-watching-teens-sleep#.hyl0xWLN4" ng-click="aboutClick(\'About link\', \'Buzzfeed\')" target="_blank">Buzzfeed</a> and\n				<a href="http://www.kens5.com/story/news/2015/04/29/younow-live-broadcasting-app-popular-users-say-unnecessarily-scrutinized/26619163" ng-click="aboutClick(\'About link\', \'KENS5\')" target="_blank">KENS5 Eyewitness News</a> are saying about us.</p>\n			</div>\n\n		</div>\n\n\n	</section><!-- / about -->\n\n\n	<div data-footer></div>\n</div>\n')
}
]),
angular.module("angularjsapp/src/app/states/home/home.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/states/home/home.tpl.html", '<div ng-if="vm.renderPage" class="home-container">\n	<section class="search-container">\n		<div class="search-top">\n			<a href ui-sref="main.channel.detail"><i class="ynicon ynicon-social-yn pull-left"></i></a>\n			<div class="search-cta pull-right">\n				<a href="#" prevent-default ng-click="vm.openLoginModal(\'LOGIN\')">Login</a>\n				<button class="btn btn-outline" ng-click="vm.openLoginModal(\'SIGNUP\')">Sign Up</button>\n				<button class="btn btn-primary" ng-click="vm.getTheApp()">Get the App</button>\n			</div>\n		</div>\n		<!-- younow-home-app-promo -->\n		<div class="home-video-container">\n			<video class="home-video" autoplay="" loop="" ng-attr-poster="{{::vm.baseCDN +\'/images/about/novideo.jpg\'}}" id="homeVideo">\n				<source ng-src="{{::vm.baseCDN + \'/landing/video/younow_shade2.webmhd.webm\'}}" type="video/webm">\n				<source ng-src="{{::vm.baseCDN + \'/landing/video/younow_shade2.mp4\'}}" type="video/mp4">\n			</video>\n		</div>\n		<h1>Live Stream Video Chat</h1>\n		<h4>YouNow is the best way to watch and broadcast interactive live stream videos. Discover talented broadcasters & chat live with people from around the world for free.</h4>\n		<yn-search-bar type="home"></yn-search-bar>\n	</section>\n	<section class="explore-container">\n		<h2>Explore Live Streaming Video Topics</h2>\n		<div class="inner-container">\n			<span ng-repeat="tag in ::vm.liveTopics">\n			<a class="tag"\n				ng-href="/explore/{{::tag.tag}}"\n				ng-click="vm.stateChange(\'main.explore\', { \'tag\': tag.tag })"\n				prevent-default>#{{::tag.tag}}</a>\n			</span>\n		</div>\n		<div class="cta-btn-container">\n			<a class="btn btn-primary cta-btn" href="/explore/" ng-click="vm.stateChange(\'main.explore\', undefined, true)" prevent-default>\n				Explore More Topics\n			</a>\n		</div>\n	</section>\n	<section class="trending-bc-container">\n		<h2>Watch Live Broadcasts Trending Now</h2>\n		<div class="trending-bcers">\n			<div class="trending-bcer" ng-repeat="bcer in ::vm.trendingBroadcasts" >\n				<a class="thumb"\n					ng-href="/{{::bcer.profile}}"\n					ng-style="::{background: \'url({{::vm.config.broadcasterThumb}}\' + bcer.broadcastId + \') no-repeat\'}"\n					ng-click="vm.stateChange(\'main.channel.detail\', { \'profileUrlString\': bcer.profile })"\n					prevent-default>\n					<span><i class="ynicon ynicon-viewers"></i> {{::bcer.viewers}}</span>\n					<div class="tag-fade"></div>\n				</a>\n				<a class="trending-tag short-text"\n					ng-href="/explore/{{::bcer.tags[0]}}"\n					ng-click="vm.stateChange(\'main.explore\', { \'tag\': bcer.tags[0] })"\n					prevent-default>#{{::bcer.tags[0]}}</a>\n				<a class="trending-desc" ng-href="/{{::bcer.profile}}" ng-click="vm.stateChange(\'main.channel.detail\', { \'profileUrlString\': bcer.profile })" prevent-default>\n					<span class="short-text">{{::bcer.profile}}</span>\n					<span>&#8226; <i class="ynicon ynicon-user"></i> {{::bcer.totalFans}}</span>\n				</a>\n			</div>\n		</div>\n		<div class="cta-btn-container">\n			<a class="btn btn-primary cta-btn" href="/explore/" ng-click="vm.stateChange(\'main.explore\')" prevent-default>Explore More Broadcasters</a>\n		</div>\n	</section>\n	<section class="mobile-container">\n		<div ng-include="\'angularjsapp/src/app/components/mobile-download/mobile-download.tpl.html\'"></div>\n	</section>\n	<div data-footer></div>\n</div>\n')
}
]),
angular.module("angularjsapp/src/app/states/info/info.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/states/info/info.tpl.html", '<div data-header></div>\n<div id="infoPage" ng-class="{\'ready\': ready, \'rtl\': rtl}">\n	<div class="container">\n		<div class="content" ng-bind-html="docContent">\n		</div>\n	</div>\n</div>\n<div data-footer ng-hide="$root.hideFooter"></div>')
}
]),
angular.module("angularjsapp/src/app/states/lockout/lockout.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/states/lockout/lockout.tpl.html", '<div class="lockout">\n	<img src="/angularjsapp/src/assets/images/lockout/younow_agegate_2x.png">\n	<div class="lockout-title" translate="agegate_lockout_title"></div>\n	<div class="lockout-message" translate="agegate_lockout_message"></div>\n</div>')
}
]),
angular.module("angularjsapp/src/app/states/main/channel/async/async.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/states/main/channel/async/async.tpl.html", '<div class="content-container">\n	<div class="left-content pull-left">\n		<div class="user-summary " ng-class="session.user.userId===broadcasterService.channel.userId ? \'owner\' : \'non-owner\'">\n			<div class="user-cover" ng-attr-style="{{cdn.background(broadcasterService.broadcaster.userId,\'Cover\',refreshcover)}}">\n				<div ng-show="editing" class="upload-photo editing">\n					<div class="upload-overlay"></div>\n					<input accept="image/jpeg" type="file" onchange="angular.element(this).scope().doUpload(this,\'updateCover\',\'cover\')" tooltip-trigger="show" tooltip="This image should be at least 270x580px and smaller than 6MB" tooltip-placement="bottom error">\n					<i class="ynicon ynicon-camera"></i>\n				</div>\n			</div>\n			<div class="user-description">\n				<div\n				class="pull-left circle-thumb clickable"\n				ng-href="/{{broadcasterService.broadcaster.profileUrlString}}" prevent-default\n				ng-click="showProfileSummary(broadcasterService.broadcaster.userId)"\n				ng-attr-style="{{cdn.background(broadcasterService.broadcaster.userId,\'Image\',refreshimage)}}">\n				</div>\n				<div ng-show="editing" class="upload-photo editing">\n					<div class="upload-overlay"></div>\n					<input accept="image/jpeg" name="image" type="file" onchange="angular.element(this).scope().doUpload(this,\'updateThumb\',\'image\')" tooltip-trigger="show" tooltip="This image must be at least 80x80px and smaller than 6MB" tooltip-placement="top error">\n					<i class="ynicon ynicon-camera"></i>\n				</div>\n				<div class="name">\n					<span class="pull-left short-text">\n\n						<span>\n							<i class="ynicon ynicon-level"></i>{{broadcasterService.channel.level}} {{broadcasterService.channel.fullName}}\n						</span>\n\n						<span class="ynbadges" ng-if="broadcasterService.channel.latestSubscriptions">\n							<span class="ynbadge" ng-repeat="(key,sub) in broadcasterService.channel.latestSubscriptions">\n								<img\n								ng-src="{{::config.settings.BadgeBaseUrl}}/{{::key}}/{{::sub.subscriptionType}}/badge@2x.png"\n								ng-click="showProfileSummary(key)"\n								tooltip="{{::sub.name}}"\n								tooltip-trigger="mouseenter"\n								tooltip-placement="top"\n								tooltip-append-to-body="true" />\n							</span>\n							<span class="ynbadge">\n								<span ng-if="broadcasterService.channel.latestSubscriptionsPlus">\n									+{{::broadcasterService.channel.latestSubscriptionsPlus}}\n								</span>\n							</span>\n						</span>\n\n					</span>\n				</div>\n				<div class="profile-actions" track-source="PROFILE">\n					<div class="pull-left btn-small" ng-show="session.user.userId!==broadcasterService.channel.userId" fan-button channel="broadcasterService.channel"></div>\n					<div class="pull-left btn-small" ng-show="session.user.userId!==broadcasterService.channel.userId" subscribe-button channel="broadcasterService.channel"></div>\n\n					<div ng-show="session.user.userId===broadcasterService.channel.userId" class="pull-left editing-options">\n						<button ng-show="!editing" ng-click="editing=true" class="btn btn-cancel edit-profile">Edit Profile</button>\n						<button ng-show="editing" ng-click="saveDescription(); editing=false" class="btn btn-confirm">Save</button>\n						<button ng-show="editing" ng-click="editing=false" class="btn btn-cancel">Cancel</button>\n					</div>\n					<div class="pull-right social-actions non-owner" ng-if="broadcasterService.channel">\n						<button class="btn btn-transparent" ng-if="broadcasterService.channel.twitterId.length !== 0"\n								ng-click="showProfileSummary(undefined, \'following\', \'twitter\')">\n							<i class="ynicon ynicon-social-tw"></i>\n						</button>\n						<button class="btn btn-transparent" ng-if="broadcasterService.channel.facebookId.length !== 0"\n								ng-click="showProfileSummary(undefined, \'following\', \'facebook\')">\n							<i class="ynicon ynicon-social-fb"></i>\n						</button>\n						<button class="btn btn-transparent" ng-if="broadcasterService.channel.youTubeChannelId.length !== 0"\n								ng-click="showProfileSummary(undefined, \'following\', \'youtube\')">\n							<i class="ynicon ynicon-icon-social-yt"></i>\n						</button>\n						<button class="btn btn-transparent" ng-if="broadcasterService.channel.instagramId.length !== 0"\n								ng-click="showProfileSummary(undefined, \'following\', \'instagram\')">\n							<i class="ynicon ynicon-social-insta"></i>\n						</button>\n						<button class="btn btn-transparent" ng-if="broadcasterService.channel.googleId.length !== 0"\n								ng-click="showProfileSummary(undefined, \'following\', \'google\')">\n							<i class="ynicon ynicon-social-gp"></i>\n						</button>\n						<button class="btn btn-transparent flagging" ng-click="showProfileSummary(undefined, \'\', undefined, { isFlagging: true })">\n							<i class="ynicon ynicon-flag"></i>\n						</button>\n					</div>\n					<div class="pull-right social-actions owner" ng-if="broadcasterService.channel">\n						<button class="btn btn-transparent" ng-class="{\'not-connected\': broadcasterService.channel.twitterId.length === 0}"\n								ng-click="socialMediaHandler(\'http://twitter.com/\'+broadcasterService.channel.twitterHandle, broadcasterService.channel.twitterId.length !== 0)">\n							<i class="ynicon ynicon-social-tw"></i>\n						</button>\n						<button class="btn btn-transparent" ng-class="{\'not-connected\': broadcasterService.channel.facebookId.length === 0}"\n								ng-click="socialMediaHandler(broadcasterService.channel.facebookLink, broadcasterService.channel.facebookId.length !== 0)">\n							<i class="ynicon ynicon-social-fb"></i>\n						</button>\n						<button class="btn btn-transparent" ng-class="{\'not-connected\': broadcasterService.channel.youTubeChannelId.length === 0}"\n								ng-click="socialMediaHandler(\'https://www.youtube.com/channel/\'+broadcasterService.channel.youTubeChannelId, broadcasterService.channel.youTubeChannelId.length !== 0)">\n							<i class="ynicon ynicon-icon-social-yt"></i>\n						</button>\n						<button class="btn btn-transparent" ng-class="{\'not-connected\': broadcasterService.channel.instagramId.length === 0}"\n								ng-click="socialMediaHandler(\'https://instagram.com/\'+broadcasterService.channel.instagramHandle, broadcasterService.channel.instagramId.length !== 0)">\n							<i class="ynicon ynicon-social-insta"></i>\n						</button>\n						<button class="btn btn-transparent" ng-if="broadcasterService.channel.googleId.length !== 0"\n								ng-click="socialMediaHandler(\'https://plus.google.com/\'+broadcasterService.channel.googleId, broadcasterService.channel.googleId.length !== 0)">\n							<i class="ynicon ynicon-social-gp"></i>\n						</button>\n					</div>\n					<div class="clear"></div>\n					<div class="owner social-alert" ng-if="!broadcasterService.channel.socialRatioCap">\n						<i class="ynicon ynicon-carrot-up"></i>\n						<alert type="success">\n							<span class="alert-text" translate="profile_connect_your_social_accounts"></span>\n							<span class="alert-right">{{ broadcasterService.channel.socialRatio }}</span>\n						</alert>\n					</div>\n				</div>\n				<div class="user-bio" ng-class="{\'text-muted\': broadcasterService.channel.description.length === 0 || !broadcasterService.channel.description}" ng-show="!editing" ng-bind-html="broadcasterService.channel.displayDescription"></div>\n				<textarea ng-model="broadcasterService.channel.description" ng-show="editing" class="user-bio editing" maxlength="140" placeholder="Describe yourself a bit"></textarea>\n\n				<div class="ep-badge" ng-if="broadcasterService.channel.isEp">\n					<span class="tag short-text">\n						<i class="ynicon ynicon-level"></i> Editor\'s Choice<span ng-if="broadcasterService.channel.epTag.length > 0">: #{{broadcasterService.channel.epTag}}</span>\n					</span>\n				</div>\n 			</div>\n		</div>\n		<div infinite-scroll="broadcasterService.getItems()" can-load="!broadcasterService.channel.finished[broadcasterService.tab] && !settingUp" threshold="300" pagescroll="true">\n			<tabset class="navigation" type="pills">\n				<!-- discussion comments -->\n				<tab heading="Discussion" id="post-tab" ng-click="tabClick(\'posts\')" active="asyncTabs[0]" select="showTab(\'posts\')">\n					<div class="conversation-tab ">\n						<div class="conversation-container">\n							<div class="comment-box">\n								<div class="comment-area form-control" tooltip-trigger="mouseenter" tooltip-html-unsafe="{{\'profile_tip_mention_your_friends\' | translate }}">\n									<div contenteditable mentio\n					                    mentio-typed-term="typedTerm"\n					                    mentio-require-leading-space="true"\n					                    class="editor"\n					                    id="textarea_"\n					                    ng-model="comment.html"\n					                    ng-keydown="submitOnEnter($event, comment)"\n					                    placeholder="Write something...">\n					                </div>\n					                  <mentio-menu\n					                    mentio-for="\'textarea_\'"\n					                    mentio-trigger-char="\'@\'"\n					                    mentio-items="people"\n					                    mentio-template-url="angularjsapp/src/app/components/mention/mention.tpl.html"\n					                    mentio-search="searchPeople(term)"\n					                    mentio-select="insertMention(item)"\n					                    ></mentio-menu>\n									<div class="upload-photo">\n										<input class="pull-right" accept="image/jpeg, image/png" data-url="http://www.younow.com/php/api/post/create" name="media" type="file" onchange="angular.element(this).scope().showUploadPreview(this, angular.element(this).scope().comment)" id="file_" tooltip-trigger="show" tooltip="this image must be at least 100x100px and not larger than 10MB">\n										<i class="ynicon ynicon-camera pull-right"></i>\n									</div>\n									<div ng-show="comment.preview" class="upload-preview">\n										<button ng-click="removeUpload(comment)" aria-hidden="true" class="close" type="button">×</button>\n										<img ng-src="{{comment.preview}}" height="100">\n									</div>\n								</div>\n								<div class="comment-actions">\n									<button ng-disabled="posting" ng-click="postComment(comment)" class="btn btn-cancel">Post</button>\n								</div>\n							</div>\n							<ul class="comments">\n								<li ng-repeat="post in broadcasterService.channel.posts" class="comment" ng-class="{\'new\':broadcasterService.deeplinkId==post.id}">\n									<div data-younow-post></div>\n								</li>\n							</ul>\n						</div>\n					</div>\n				</tab>\n				<!-- broadcasts -->\n				<tab heading="Broadcasts" ng-if="broadcasterService.channel" ng-click="tabClick(\'broadcasts\')" active="asyncTabs[1]" select="showTab(\'broadcasts\')">\n					<div class="broadcasts-tab">\n						<div class="broadcasts pull-left">\n							<div class="broadcasts-container">\n								<ul class="broadcasts">\n									<li ng-repeat="post in broadcasterService.channel.broadcasts" class="comment">\n										<div data-younow-post></div>\n									</li>\n								</ul>\n								<div class="no-broadcasts" ng-if="!broadcasterService.channel.broadcasts || broadcasterService.channel.broadcasts.length === 0">\n									<i class="ynicon ynicon-bc-golive"></i>\n									<div ng-if="broadcasterService.channel.broadcastsCount == 0" translate="profile_no_broadcasters_yet"></div>\n									<div ng-if="broadcasterService.channel.broadcastsCount > 0" translate="profile_user_no_public_broadcasts"></div>\n								</div>\n							</div>\n						</div>\n					</div>\n				</tab>\n				<!-- total fans -->\n				<tab ng-if="broadcasterService.channel.totalFans!=false && broadcasterService.channel.totalFans!=\'0\'" heading="{{broadcasterService.channel.totalFans | number}} Fans"   ng-click="tabClick(\'fans\')" active="asyncTabs[2]" select="showTab(\'fans\')">\n					<div class="fans-tab">\n						<ul>\n							<li ng-repeat="fan in broadcasterService.channel.fans" class="fans-tab-fan">\n								<a\n									ng-href="/{{fan.profileUrlString}}" prevent-default\n									ng-click="showProfileSummary(fan.userId)"\n									class="circle-thumb clickable pull-left"\n									ng-style="::{\'background\':\'url(\'+cdn.thumb+fan.userId+\'), url(\'+cdn.nothumb+\') no-repeat\', \'background-size\': \'cover\'}">\n								</a>\n								<div class="pull-left">\n									<a\n									class="name clickable short-text"\n									ng-href="/{{fan.profileUrlString}}" prevent-default\n									ng-click="showProfileSummary(fan.userId)">\n										{{fullName(fan)}}\n									</a>\n									<div class="description short-text">\n										{{fan.description}}\n									</div>\n								</div>\n								<div class="fan-button-placeholder pull-right" track-source="PROFILE">\n									<div fan-button channel="fan"></div>\n								</div>\n							</li>\n						</ul>\n					</div>\n				</tab>\n				<!-- fan of  -->\n				<tab ng-if="broadcasterService.channel.totalFansOf!=false && broadcasterService.channel.totalFansOf!=\'0\'"  heading="Fan Of {{broadcasterService.channel.totalFansOf | number}}" ng-click="tabClick(\'fansof\')" active="asyncTabs[3]" select="showTab(\'fansof\')">\n					<div class="fans-of-tab ">\n						<ul>\n							<li ng-repeat="fan in broadcasterService.channel.fansof" class="fans-tab-fan">\n								<a\n									ng-href="/{{fan.profileUrlString}}" prevent-default\n									ng-click="showProfileSummary(fan.userId)"\n									class="circle-thumb clickable pull-left"\n									ng-style="::{\'background\':\'url(\'+cdn.thumb+fan.userId+\'), url(\'+cdn.nothumb+\') no-repeat\', \'background-size\': \'cover\'}">\n								</a>\n								<div class="pull-left">\n									<a\n									class="name clickable short-text"\n									ng-href="/{{fan.profileUrlString}}" prevent-default\n									ng-click="showProfileSummary(fan.userId)"\n									>\n										{{fullName(fan)}}\n									</a>\n									<div class="description short-text">\n										{{fan.description}}\n									</div>\n								</div>\n								<div class="fan-button-placeholder pull-right" track-source="PROFILE">\n									<div fan-button channel="fan"></div>\n								</div>\n							</li>\n						</ul>\n					</div>\n				</tab>\n			</tabset>\n		</div>\n	</div>\n	<div class="right-content pull-left">\n		<div class="mini-player" ng-if="broadcasterService.broadcaster.broadcastId">\n		    <div class="broadcast-info">\n		    	<span class="name short-text">\n		      		<i class="ynicon ynicon-level"></i>{{broadcasterService.channel.level}} {{broadcasterService.broadcaster.profile}}\n		      	</span>\n		      	in #{{broadcasterService.broadcaster.tags[0]}}\n		    </div>\n			<div class="player-container">\n			    <div id="mini-player">\n			    	<div class="profile-player" id="playeroniBsrErLcZk"></div>\n			    </div>\n			</div>\n			<div class="controls">\n			  	<span class="count pull-left">\n			  		<i class="ynicon ynicon-broadcast"></i>\n			  		<i class="ynicon ynicon-viewers"></i>\n			  		{{broadcasterService.broadcaster.viewers}}\n			  	</span>\n			  	<span ng-click="swf.toggleMute()" class="pull-right">\n					<i class="ynicon" ng-class="swf.volume==0 ? \'ynicon-mute-sel\' : \'ynicon-mute\'"></i>\n				</span>\n			</div>\n		    <div class="call-to-action">\n		      <button class="btn btn-primary" translate="profile_enter_live_chat" ng-click="enterLiveChat()">Enter Live Chat</button>\n		    </div>\n		</div>\n		<div class="urge-owner-widget" ng-if="broadcasterService.channel.preview==\'prompt\' && broadcasterService.broadcaster.userId == session.user.userId">\n			<div class="urge-owner" ng-class="broadcasterService.broadcaster.userId==session.user.userId ? \'owner\' : \'non-owner\'">\n				<div class="title" class="owner">\n					<span translate="profile_latest_broadcast"></span>\n				</div>\n				<div class="pull-left urge-copy">\n					<!-- <span class="non-owner">{{broadcasterService.channel.fullName}} has not broadcasted yet. Ask them to go live.</span> -->\n					<span class="owner" translate="profile_connect_with_audience_broadcast"></span>\n				</div>\n				<div class="actions">\n					<!-- <button class="btn standard-blue non-owner" ng-click="showProfileSummary(broadcasterService.broadcaster.userId)">Say hi</button> -->\n					<button class="btn btn-primary owner" ng-click="broadcasterService.goLive()" translate="_golive"></button>\n				</div>\n			</div>\n		</div>\n		<div class="last-broadcast" ng-if="broadcasterService.channel.preview==\'recent\'">\n			<div class="title">\n				<span translate="profile_latest_broadcast"></span>\n				<div class="viewers pull-right">\n					<span>\n						{{broadcasterService.channel.broadcasts[0].media.broadcast.totalViewers}}\n					</span>\n					<span translate="_viewers"></span>\n				</div>\n			</div>\n			<div\n			ng-click="showMedia(broadcasterService.channel.broadcasts[0].media.broadcast.broadcastId, {source:\'LATEST\',start:0})"\n			class="thumb"\n			ng-style="{\'background\':\'url(\'+cdn.broadcast+broadcasterService.channel.broadcasts[0].media.broadcast.broadcastId+\')\', \'background-size\': \'cover\'}">\n				<img class="play-button" ng-src="{{::cdn.image}}/profile/new/icon_play.png">\n			</div>\n		</div>\n\n		<div class="activity-panel" ng-if="broadcasterService.channel.biggestFans.length">\n			<div class="online-fans-title">\n				<span translate><i class="ynicon ynicon-icon-whale"></i> profile_biggest_fans</span>\n			</div>\n			<div class="activity-panel">\n				<div class="panel-body">\n					<div class="friends-list mini-scroll" only-scroll ng-if="broadcasterService.channel.biggestFans.length > 0">\n						<a\n						class="activity"\n						ng-repeat="friend in broadcasterService.channel.biggestFans | filter:friendfilter | orderBy:\'-bars\'"\n						ng-href="/{{friend.profile}}" prevent-default\n						ng-click="showProfileSummary(friend.userId)">\n							<div class="profile-img thumb" ng-style="::{\'background-image\': \'url(\'+panel.cdn.thumb+friend.userId+\'), url(\'+panel.cdn.nothumb+\')\'}">\n							</div>\n							<div class="status">\n								<span class="name short-text">{{friend.name}}</span>\n\n								<div ng-if="friend.bars" class="bars-text">\n									<img class="bar"  ng-src="{{config.settings.ServerCDNBaseUrl}}/angularjsapp/src/assets/images/icons_v3/icon_bar_sm.png"> {{friend.bars | number}}\n								</div>\n\n							</div>\n						</a>\n					</div>\n				</div>\n			</div>\n		</div>\n\n		<div class="activity-panel">\n			<div class="online-fans-title">\n				<span translate="profile_online_friends"></span> <span class="text-muted">{{broadcasterService.channel.totalOnlineFans}}</span>\n			</div>\n			<div class="activity-panel-module" activity-panel online-friends="broadcasterService.channel.onlineFans" source="ONLINEFANS"></div>\n		</div>\n\n	</div>\n</div>\n');
}
]),
angular.module("angularjsapp/src/app/states/main/channel/channel.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/states/main/channel/channel.tpl.html", '<div data-ui-view></div>\n<div ng-show="broadcasterService.broadcaster.broadcastId || session.isBroadcasting" ng-if="!broadcasterService.async" ng-include src="\'angularjsapp/src/app/states/main/channel/live/live.tpl.html\'"></div>\n<div ng-if="broadcasterService.async" ng-include src="\'angularjsapp/src/app/states/main/channel/async/async.tpl.html\'"></div>')
}
]),
angular.module("angularjsapp/src/app/states/main/channel/live/live.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/states/main/channel/live/live.tpl.html", '<div class="fullscreen-{{fullscreenAspect}}" ng-class="{ \'fullscreen\': swf.fullscreenActive,\'fullscreen-in\': swf.fullscreenIn,\'fullscreen-out\': swf.fullscreenOut }">\n	<div class="fullscreen-overlay"></div>\n\n	<div class="pull-left player">\n		<div class="player-header" player-header></div>\n		<div class="player-overlay" player-overlay class="player-overlay-container"></div>\n		<div class="player-main">\n			<div class="player-error" ng-if="show_noflash_message && !swf.ready && !mcu">\n				<img class="error-image" ng-src="{{::config.settings.ServerCDNBaseUrl}}/angularjsapp/src/assets/images/player/flash_player_icon_999.png" />\n				<div class="error-title">Adobe Flash Player</div>\n				<div class="error-subtitle" translate="flashplayer_is_not_installed"></div>\n				<a class="error-link" target="_blank" href="https://get2.adobe.com/flashplayer/"><span translate="flashplayer_click_to_install_from"></span> <br /><b>get2.adobe.com/flashplayer/</b></a>\n			</div>\n			<div ng-if="!mcu || !(mcu && (swf.settingUpBroadcast || swf.currentSession.isBroadcasting))">\n				<div id="flashObj1" style="width:592px;height:444px;" swfstudio></div>\n			</div>\n			<div ng-if="mcu && (swf.settingUpBroadcast || swf.currentSession.isBroadcasting)" class="webrtcVideo">\n				<video id=\'localVideo\' class="localVideo"></video>\n				<video id=\'remoteVideo\' class="remoteVideo"></video>\n			</div>\n		</div>\n		<div class="player-footer" player-footer></div>\n	</div>\n	<div channel-chat></div>\n	<div class="tag-container pull-left">\n		<div id="tag-queue" ng-if="broadcasterService.queue.length && !swf.settingUpBroadcast">\n			<div class="title">\n				{{broadcasterService.queue.length}}\n				{{(broadcasterService.queue.length===1 ? \'_broadcaster\' : \'_broadcasters\') | translate}}\n				on \n				<a \n					class="clickable"\n					ng-href="/tag/{{broadcasterService.broadcaster.tags[0]}}" prevent-default\n					ng-click="goIfNotBroadcasting(goto, \'explore/\'+broadcasterService.broadcaster.tags[0])">\n					#{{broadcasterService.broadcaster.tags[0]}}\n				</a>\n			</div>\n			<a class="queue-item thumb clickable"\n				ng-repeat="person in broadcasterService.queue" \n				ng-href="/{{person.profile}}" prevent-default\n				ng-click="goIfNotBroadcasting(loadChannel, person.userId)"\n				ng-style="::{\'background-image\': \'url(\'+config.broadcasterThumb+person.id+\'), url(\'+cdn.nothumb+\')\'}"\n				tooltip-trigger="mouseenter" tooltip-html-unsafe="{{person.tooltip}}">\n					<div ng-if="::(broadcasterService.broadcaster.userId==person.userId||broadcasterService.broadcaster.userId==session.user.userId)" class="thumb-label">\n						<span ng-if="::(broadcasterService.broadcaster.userId==person.userId && person.userId!=session.user.userId)" translate="_watching"></span>\n						<span ng-if="::(person.userId==session.user.userId && swf.currentSession.isBroadcasting)" translate="_you"></span>\n					</div>\n			</a>\n		</div>\n		<!-- limited time Ad - use http://www.epochconverter.com/ to get timestamp in milliseconds -->\n		<div class="under-chat pull-right" ng-if="session.user.locale==\'de\' && timestamp<1434211199999">\n			<a href="http://blog.younow.com/post/121208088539/auf-dem-roten-teppich-bleiben-verfolgt-die-top" ng-click="adclick(\'wvp15\')" target="_blank" rel="nofollow">\n				<img ng-src="{{::config.settings.ServerCDNBaseUrl}}/angularjsapp/src/assets/images/promo/wvp15.png">\n			</a>\n		</div>\n\n	</div>\n	\n</div>')
}
]),
angular.module("angularjsapp/src/app/states/main/explore/explore.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/states/main/explore/explore.tpl.html", '<div class="content-container pull-left">\n	<div class="explore-container" ng-class="::{\'live-thumbs\': useBroadcastThumbs}">\n		<div class="explore-content pull-left"\n			ng-class="{\'large\': !showMiniplayer && !eps.list && query !== undefined}"\n			infinite-scroll="getItems()"\n			can-load="!finished"\n			threshold="300"\n			pagescroll="true">\n			<h3 class="explore_header">{{::title}}</h3>\n			<h3 ng-show="noresults" translate="explore_no_user_found"></h3>\n			<div ng-repeat="person in results" class="user_search_box pull-left">\n				<div\n					class="thumb box-thumb"\n					ng-style="::{\'background\': \'url(\'+person.thumb+\') no-repeat, url(\'+cdn.nothumb+\') no-repeat\', \'background-size\': \'cover\'}">\n					<a\n						class="user-profile"\n						ng-href="/{{::person.profile}}"\n						ng-click="selectUser(person, false, true)"\n						prevent-default>\n					</a>\n					<a\n						ng-click="showTag($event, person.tag)"\n						ng-href="/explore/{{::person.tag}}"\n						ng-if="::person.tag"\n					 	class="user-tag short-text"\n					 	prevent-default>\n						#{{::person.tag}}\n					</a>\n					<div class="tag-fade"></div>\n				</div>\n				<div class="clearfix"></div>\n				<a\n				ng-href="/{{::person.profile}}" prevent-default\n				ng-click="showProfileSummary(person.userId)"\n				class="name short-text">\n					<i class="ynicon ynicon-level"></i>{{::person.level}} {{::person.fullName}}\n				</a>\n				<i ng-if="::person.tag" class="ynicon ynicon-broadcast pull-left"></i>\n				<span ng-if="::person.tag" class="user-status pull-left"> Live &#8226;</span>\n				<div ng-if="::person.viewers!=undefined" class="user-viewers">\n					<i class="ynicon ynicon-viewers"></i> {{::person.viewers}}\n				</div>\n				<div ng-if="::person.viewers==undefined" class="user-fans">{{::person.totalFans || person.fans}} fans</div>\n			</div>\n		</div>\n		<div class="side-column pull-right" ng-if="showMiniplayer || (eps.list && eps.list.length > 0) || query === undefined">\n			<div ng-show="showMiniplayer" class="mini-player">\n				<div class="broadcast-info">\n			    	<a\n			    	class="name short-text"\n			    	ng-href="/{{broadcast.user.profileUrlString}}" prevent-default\n			    	ng-click="showBroadcast()">\n		      		<i class="ynicon ynicon-level"></i>{{broadcast.user.userLevel}} {{broadcast.user.displayName}}\n		      	</a>\n		      	{{ \'_in\' | translate }} #{{broadcast.tags[0]}}\n			    </div>\n				<div class="player-container">\n					<div id="playeroniBsrErLcZk"></div>\n				</div>\n				<div class="controls">\n				  	<span class="count pull-left">\n				  		<i class="ynicon ynicon-broadcast"></i>\n				  		<i class="ynicon ynicon-viewers"></i>\n				  		{{broadcast.viewers}}\n				  	</span>\n					<span ng-click="swf.toggleMute()" class="pull-right">\n						<i class="ynicon" ng-class="swf.volume===0 ? \'ynicon-mute-sel\' : \'ynicon-mute\'"></i>\n					</span>\n				</div>\n				<div class="call-to-action">\n				    <button class="btn btn-primary" ng-click="showBroadcast()" translate="explore_enter_live_chat"></button>\n			    </div>\n			</div>\n			<!-- vip list -->\n			<div class="column-list" ng-if="query === undefined">\n				<div class="title">Top Broadcasters</div>\n				<div class="column-scroll mini-scroll">\n					<div ng-repeat="vip in ::vips.list" class="list-item">\n						<a class="circle-thumb pull-left"\n							ng-style="::{\'background\': \'url(\'+vip.thumbnail+\') no-repeat, url(\'+cdn.nothumb+\') no-repeat\', \'background-size\': \'cover\'}"\n							ng-click="showProfileSummary(vip.userId)"\n							ng-href="/{{::vip.profile}}"\n							prevent-default>\n						</a>\n						<div class="description short-text">{{::vip.profile}}</div>\n						<div class="fan-button-placeholder" track-source="EXPLORE_VIP">\n							<div fan-button size="small" channel="vip"></div>\n						</div>\n					</div>\n				</div>\n			</div>\n			<!-- ep list -->\n			<div class="column-list" ng-if="eps.list && eps.list.length > 0">\n				<div class="title">Editor\'s Picks</div>\n				<div class="column-scroll mini-scroll">\n					<div ng-repeat="ep in ::eps.list" class="list-item">\n						<a class="circle-thumb pull-left"\n							ng-style="::{\'background\': \'url(\'+cdn.thumb+ep.userId+\') no-repeat, url(\'+cdn.nothumb+\') no-repeat\', \'background-size\': \'cover\'}"\n							ng-click="showProfileSummary(ep.userId)"\n							ng-href="/{{::ep.name}}"\n							prevent-default>\n						</a>\n						<div class="description short-text">{{::ep.name}}</div>\n						<div class="fan-button-placeholder" track-source="EXPLORE_EP">\n							<div fan-button size="small" channel="ep"></div>\n						</div>\n					</div>\n				</div>\n			</div>\n		</div>\n	</div>\n</div>\n')
}
]),
angular.module("angularjsapp/src/app/states/main/main.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/states/main/main.tpl.html", '<div data-header></div>\n\n<div class="notification" ng-class="{active: $root.notifications.normal.active, fixed: $root.notifications.normal.fixed}">\n	<alert type="{{$root.notifications.normal.type}}" ng-bind-html="$root.notifications.normal.message"></alert>\n	<button class="close" ng-click="closeNotification( $root.notifications.normal.group )" type="button">\n		<i class="ynicon ynicon-close"></i>\n	</button>\n</div>\n<div class="notification" ng-class="{active: $root.notifications.sticky.active, fixed: $root.notifications.sticky.fixed}">\n	<alert type="{{$root.notifications.sticky.type}}" ng-bind-html="$root.notifications.sticky.message"></alert>\n	<button class="close" ng-click="closeNotification( $root.notifications.sticky.group )" type="button">\n		<i class="ynicon ynicon-close"></i>\n	</button>\n</div>\n\n<!-- banners -->\n<div class="notification banner" ng-class="{active: $root.banners.sticky.active, fixed: $root.banners.sticky.fixed}">\n	<alert type="{{$root.banners.sticky.type}}">\n		<span ng-if="$root.banners.sticky.active" dynamic-alert="$parent.$root.banners.sticky.message"></span>\n	</alert>\n	<button class="close" ng-click="closeBanner( $root.banners.sticky.group )" type="button">\n		<i class="ynicon ynicon-close"></i>\n	</button>\n</div>\n\n<div class="container group" id="main" ng-class="{banned: session.user.banId !== 0, \'sticky-active\': $root.notifications.sticky.active, \'banner-active\':  $root.banners.sticky.active}">\n	<div class="pull-left" data-leftsidebar></div>\n	<div class="main-content pull-left" data-ui-view></div>\n	<div class="clear"></div>\n</div>\n<div data-footer ng-hide="$root.hideFooter"></div>\n')
}
]),
angular.module("angularjsapp/src/app/states/main/missing/missing.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/states/main/missing/missing.tpl.html", '<div style="width:800px;height:150px;margin-left:auto;margin-right:auto;text-align:center;font-family:Arial, Helvetica, sans-serif;font-size:26px;margin-top:20px;color:#555;text-align:center;margin-left:auto;margin-right:auto;background:#dcdcdc;text-align:center;vertical-align:middle;-moz-border-radius:15px;border-radius:15px;">\n	<div style="position:relative;text-align:center;top:25px;" translate="missing_user_doesnot_exist" translate-values="{ value: \'{{username}}\' }"></div>\n	<div style="position:relative;text-align:center;top:40px;">\n		<a href="/">\n			<img ng-src="{{::cdn.base}}/images/btn_watchlivebroadcasts.png" name="watchbutton" border="0"></a>\n	</div>\n</div>')
}
]),
angular.module("angularjsapp/src/app/states/main/settings/settings.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/states/main/settings/settings.tpl.html", '<div class="settings-page">\n	<div class="navigation">\n		<div class="tab-header" ng-class="{\'active\': page==\'info\'}" ng-click="switchTab(\'info\')">Information</div>\n		<div class="tab-header" ng-class="{\'active\': page==\'notifications\'}" ng-click="switchTab(\'notifications\')">Notifications</div>\n		<div class="tab-header" ng-class="{\'active\': page==\'accounts\'}" ng-click="switchTab(\'accounts\')">Connected Accounts</div>\n		<div class="tab-header" ng-class="{\'active\': page==\'privacy\'}" ng-click="switchTab(\'privacy\')">Privacy</div>\n		<!--<div class="tab-header" ng-class="{\'active\': page==\'subscriptions\'}" ng-click="switchTab(\'subscriptions\')">Subscriptions</div>-->\n	</div>\n	<div class="pages" ng-show="settings">\n		<div class="info-page" ng-show="page==\'info\'" ng-class="{\'edit-mode\':editing}">\n			<form novalidate name="infoForm">\n				<div class="form-horizontal">\n					<a class="pull-right" ng-click="startEdit()" href="javascript:void(0)">Edit</a>\n					<div class="control-group control-nickname">\n						<label class="control-label pull-left">Nickname</label>\n						<div class="controls pull-left">\n							<div class="username editable">\n								<span class="edit-hide profileUrlString">{{settings.user.profile}}</span>\n								<div class="edit-field">\n									<input placeholder="Nickname"\n										type="text"\n										maxlength="25"\n										class="form-control"\n										ng-model="settings.user.profile"\n										ng-change="toEdit(\'profileUrlString\', settings.user.profile)">\n								</div>\n							</div>\n							<div class="url">\n								<a ng-href="{{::config.settings.ServerLocalBaseUrl}}/{{settings.user.profile}}">{{::config.settings.ServerLocalBaseUrl}}/{{settings.user.profile}}</a>\n							</div>\n							<div class="checkbox">\n								<input type="checkbox"\n									ng-model="settings.user.useprofile"\n									ng-change="toEdit(\'useprofile\', settings.user.useprofile)"\n									ng-true-value="1"\n									ng-false-value="0"\n									ng-checked="settings.user.useprofile===1"\n								>If checked, your nickname will replace your real name</div>\n						</div>\n						<div class="clear"></div>\n					</div>\n					<div class="control-group">\n						<label class="control-label pull-left">Email</label>\n						<div class="controls pull-left">\n							<div class="username editable">\n								<span class="edit-hide emailAddress">{{settings.user.email}}</span>\n								<div class="edit-field">\n									<input placeholder="Email"\n										name="info.email"\n										class="form-control"\n										type="text"\n										ng-model="settings.user.email"\n										ng-change="toEdit(\'emailAddress\', settings.user.email)"\n										ng-pattern="emailRegex"\n										tooltip="Invalid email"\n										tooltip-trigger="show"\n										tooltip-append-to-body="true"\n										tooltip-placement="top error"\n										yn-valid>\n								</div>\n							</div>\n						</div>\n						<i class="ynicon ynicon-icon-check isEmailConfirmed" ng-if="session.user.isEmailConfirmed==1"></i>\n						<div class="clear"></div>\n					</div>\n					<div class="control-group">\n						<label class="control-label pull-left">Mailing Address</label>\n						<div class="controls pull-left">\n							<div class="address editable">\n								<span class="edit-hide address1">{{settings.user.mailAddress1}}</span>\n								<br class="edit-hide">\n								<span class="edit-hide address2">{{settings.user.mailAddress2}}</span>\n								<div class="edit-field">\n									<input placeholder="Address1"\n										name="info.adress1"\n										class="form-control"\n										type="text"\n										ng-model="settings.user.mailAddress1"\n										ng-change="toEdit(\'mailAddress1\', settings.user.mailAddress1)"\n										ng-maxlength="50"\n										tooltip="Invalid address"\n										tooltip-trigger="show"\n										tooltip-append-to-body="true"\n										tooltip-position="top error"\n										yn-valid><br>\n									<input placeholder="Address2"\n										name="info.address2"\n										class="form-control"\n										type="text"\n										ng-model="settings.user.mailAddress2"\n										ng-change="toEdit(\'mailAddress2\', settings.user.mailAddress2)"\n										ng-maxlength="50"\n										tooltip="Invalid address"\n										tooltip-trigger="show"\n										tooltip-append-to-body="true"\n										tooltip-position="top error"\n										yn-valid></div>\n							</div>\n						</div>\n						<div class="clear"></div>\n					</div>\n					<div class="control-group">\n						<label class="control-label pull-left">City</label>\n						<div class="controls pull-left">\n							<div class="city editable">\n								<span class="edit-hide city">{{settings.user.mailCity}}</span>\n								<div class="edit-field">\n									<input placeholder="City"\n										name="info.city"\n										type="text"\n										class="form-control"\n										ng-model="settings.user.mailCity"\n										ng-change="toEdit(\'mailCity\', settings.user.mailCity)"\n										ng-pattern="\'^[^!-&(-,.-@\\[-`{-~]*$\'"\n										ng-maxlength="25"\n										tooltip="Invalid city"\n										tooltip-trigger="show"\n										tooltip-append-to-body="true"\n										tooltip-position="top error"\n										yn-valid>\n								</div>\n							</div>\n						</div>\n						<div class="clear"></div>\n					</div>\n					<div class="control-group">\n						<label class="control-label pull-left">State</label>\n						<div class="controls pull-left">\n							<div class="state editable">\n								<span class="edit-hide stateCode">{{select.state[settings.user.mailState]}}</span>\n								<div class="edit-field">\n									<select id="stateCode"\n										class="form-control"\n										ng-model="settings.user.mailState"\n										ng-change="toEdit(\'mailState\', settings.user.mailState)"\n										ng-options="option.code as option.name for option in state">\n									</select>\n								</div>\n							</div>\n						</div>\n						<div class="clear"></div>\n					</div>\n					<div class="control-group">\n						<label class="control-label pull-left">Country</label>\n						<div class="controls pull-left">\n							<div class="country editable">\n								<span class="edit-hide countryCode">{{select.country[settings.user.mailCountry]}}</span>\n								<div class="edit-field">\n									<select id="countryCode"\n										class="form-control"\n										ng-model="settings.user.mailCountry"\n										ng-change="toEdit(\'mailCountry\', settings.user.mailCountry)"\n										ng-options="option.code as option.name for option in country">\n									</select>\n								</div>\n							</div>\n						</div>\n						<div class="clear"></div>\n					</div>\n					<div class="control-group">\n						<label class="control-label pull-left">Localization Content</label>\n						<div class="controls pull-left">\n							<div class="locales editable">\n								<span class="edit-hide localName">{{select.locale[settings.user.locale]}}</span>\n								<div class="edit-field">\n									<select id="locale"\n										class="form-control"\n										ng-model="settings.user.locale"\n										ng-change="toEdit(\'locale\', settings.user.locale)"\n										ng-options="option.code as option.name for option in locale">\n									</select>\n								</div>\n							</div>\n						</div>\n						<div class="clear"></div>\n					</div>\n					<div class="control-group" ng-if="(settings.user.disabledGoodies!=undefined)">\n						<label class="control-label pull-left">Gift Management</label>\n						<div class="controls">\n							<div class="checkbox">\n								<input type="checkbox"\n									ng-model="settings.user.disabledGoodies.TIP"\n									ng-change="toEditGoodies(\'TIP\', settings.user.disabledGoodies.TIP)"\n									ng-true-value="false"\n									ng-false-value="true"\n									ng-checked="!settings.user.disabledGoodies.TIP"\n								>Enable Tips</div>\n							<div class="text-muted">\n								Disabling Tips will remove the Tip Jar gift from your Broadcast\n							</div>\n						</div>\n					</div>\n					<div class="control-group">\n						<label class="control-label pull-left">T-shirt Size</label>\n						<div class="controls pull-left">\n							<t-shirt-size class="editable">\n								<span class="edit-hide tshirt">{{select.tshirt[settings.user.tshirt]}}</span>\n								<div class="edit-field">\n									<select id="tshirt"\n										class="form-control"\n										ng-model="settings.user.tshirt"\n										ng-change="toEdit(\'tshirt\', settings.user.tshirt)"\n										ng-options="option.code as option.name for option in tshirt">\n									</select>\n								</div>\n							</t-shirt-size>\n							<div class="text-muted">\n								Note: We need this to send you prizes you may win on YouNow\n							</div>\n						</div>\n						<div class="clear"></div>\n					</div>\n					<div class="control-group">\n						<label class="control-label pull-left">Gender</label>\n						<div class="controls pull-left">\n							<div class="editable">\n								<span class="edit-hide gender">{{select.gender[settings.user.gender]}}</span>\n								<div class="edit-field">\n									<select id="gender"\n										class="form-control"\n										ng-model="settings.user.gender"\n										ng-change="toEdit(\'gender\', settings.user.gender)"\n										ng-options="option.code as option.name for option in gender">\n									</select>\n								</div>\n							</div>\n							<div class="text-muted">\n								Note: We need this for your tshirt style\n							</div>\n						</div>\n						<div class="clear"></div>\n					</div>\n					<div class="edit-actions">\n						<button class="btn btn-primary" type="button" ng-click="saveChanges()">Save</button>\n						<button class="btn btn-cancel" type="button" ng-click="cancelEdit()">Cancel</button>\n					</div>\n				</div>\n			</form>\n		</div>\n		<div class="notifications-page" ng-show="page==\'notifications\'" ng-class="{\'edit-mode\':editing}">\n			<div class="form-horizontal">\n				<fieldset class="parent-fieldset">\n					<div>\n						<legend>Notify me when:</legend>\n						<div class="icons">\n							<img class="push pull-right" ng-src="{{config.settings.ServerCDNBaseUrl}}/images/settings/icon_set_notify_mobile.png">\n							<img class="inapp pull-right" ng-src="{{config.settings.ServerCDNBaseUrl}}/images/settings/icon_set_notify_yn.png">\n							<img class="email pull-right" ng-src="{{config.settings.ServerCDNBaseUrl}}/images/settings/icon_set_notify_email.png">\n						</div>\n						<div class="icons-legend">\n							<span class="push pull-right">Mobile</span>\n							<span class="inapp pull-right">On YouNow</span>\n							<span class="email pull-right">E-mail</span>\n						</div>\n					</div>\n					<fieldset class="form-group" ng-repeat="notification in settings.notifications">\n						<span class="control-label">{{notification.description}}</span>\n						<div class="controls">\n							<input ng-repeat="type in [\'push\',\'inapp\',\'email\']"\n								type="checkbox"\n								ng-class="type"\n								ng-model="notification[type]"\n								ng-change="toEdit(\'option_\'+notification[type+\'_value\'], notification[type])"\n								ng-true-value="1"\n								ng-false-value="0"\n								ng-checked="notification[type]===1"\n								ng-disabled="notification[type]===-1">\n					</fieldset>\n					<fieldset class="form-group">\n						<span class="control-label">{{settings.getUpdates.optionName}}</span>\n						<div class="controls">\n							<input type="checkbox" class="email"\n								ng-model="settings.getUpdates.state"\n								ng-change="toEdit(\'option_\'+settings.getUpdates.optionValue, settings.getUpdates.state)"\n								ng-true-value="1"\n								ng-false-value="0"\n								ng-checked="settings.getUpdates.state===1"></div>\n					</fieldset>\n				</fieldset>\n				<div class="edit-actions">\n					<button class="btn btn-primary" type="button" ng-click="saveChanges()">Save</button>\n					<button class="btn btn-cancel" type="button" ng-click="cancelEdit()">Cancel</button>\n				</div>\n			</div>\n		</div>\n		<div class="connected-accounts-page" ng-show="page==\'accounts\'" ng-class="{\'edit-mode\':editing}">\n			<div class="form-horizontal">\n				<fieldset class="control-group">\n					<div class="facebook-not-connected" ng-hide="settings.user.facebookId">\n						<div class="top">\n							<div class="fb-logo logo not-connected pull-left"><i class="ynicon ynicon-social-fb"></i></div>\n							<legend class="pull-left">Facebook</legend>\n						</div>\n						<div class="instructions">\n							Connect your Facebook account to gain new follower and notify them when you go live.\n						</div>\n						<div class="connect">\n							<button class="btn btn-cancel" ng-click="connect(\'facebook\',\'SETTINGS\')">\n								<i class="ynicon ynicon-refresh"></i>Connect\n							</button>\n						</div>\n					</div>\n					<div class="facebook-connected" ng-show="settings.user.facebookId">\n						<div class="top">\n							<div class="fb-logo logo connected pull-left"><i class="ynicon ynicon-social-fb"></i></div>\n							<legend class="pull-left">\n								Facebook\n								<div class="pull-right">\n									<span class="identity pull-left" ng-bind="settings.user.firstName+\' \'+settings.user.lastName"></span>\n									<span class="facebook-disconnect disconnect pull-left">\n										(\n										<a href="javascript:void(0)" ng-click="disconnect(\'facebook\')">disconnect</a>\n										)\n									</span>\n								</div>\n							</legend>\n						</div>\n						<fieldset class="extra-fb pull-left">\n							<div class="control-group fb-pages">\n								<div class="control-label pull-left">Facebook Page:</div>\n								<div class="controls pull-left">\n									<a href class="fb-pages-cta pull-left" ng-click="loadFbPages()" ng-if="settings.user.facebookPageTitle.length === 0 && !fbPages.editing">Add a Fan Page</a>\n									<a class="pull-left" ng-href="{{settings.user.websiteUrl}}" ng-if="settings.user.facebookPageTitle.length > 0 && !fbPages.editing" target="_blank">{{settings.user.facebookPageTitle}}</a>\n									<select class="form-control pull-left"\n											ng-model="fbPages.fbPageSelected"\n											ng-change="updateFbPage()"\n											ng-options="page.name for page in fbPages.pages"\n											ng-if="fbPages.editing && fbPages.hasPages">\n									</select>\n									<span ng-if="!fbPages.hasPages && fbPages.editing" class="pull-left text-muted">You have no facebook pages.</span>\n									<span class="disconnect pull-left" ng-if="settings.user.facebookPageTitle.length > 0 || fbPages.editing">\n										( <a href="javascript:void(0)" ng-if="fbPages.editing" ng-click="changeFbState(\'cancel\')"> cancel </a>\n										  <a href="javascript:void(0)" ng-if="settings.user.facebookPageTitle.length > 0 && !fbPages.editing" ng-click="loadFbPages()" >change</a>\n										  <span class="text-muted" ng-if="settings.user.facebookPageTitle.length > 0 && !fbPages.editing"> | </span>\n										  <a href="javascript:void(0)" ng-if="settings.user.facebookPageTitle.length > 0 && !fbPages.editing" ng-click="changeFbState(\'disconnect\')">disconnect </a> )\n									</span>\n								</div>\n							</div>\n							<div class="fb-connected" ng-if="settings.user.facebookPageTitle.length > 0">\n								<div class="checkbox">\n									<input type="checkbox"\n										ng-model="settings.pubFacebook.state"\n										ng-change="toEdit(\'option_\'+settings.pubFacebook.optionValue, settings.pubFacebook.state)"\n										ng-true-value="1"\n										ng-false-value="0"\n										ng-checked="settings.pubFacebook.state===1">\n									Share on my fan page when I go live.\n								</div>\n							</div>\n						</fieldset>\n					</div>\n				</fieldset>\n				<fieldset class="control-group twitter">\n					<div class="twitter-not-connected" ng-hide="settings.user.twitterId">\n						<div class="top">\n							<div class="twitter-logo logo not-connected pull-left"><i class="ynicon ynicon-social-tw"></i></div>\n							<legend class="pull-left">Twitter</legend>\n						</div>\n						<div class="instructions">\n							Connect your Twitter account to gain new followers and notify them when you go live.\n						</div>\n						<div class="connect">\n							<button class="btn btn-cancel" ng-click="connect(\'twitter\',\'SETTINGS\')">\n								<i class="ynicon ynicon-refresh"></i>\n								Connect\n							</button>\n						</div>\n					</div>\n					<div class="twitter-connected" ng-show="settings.user.twitterId">\n						<div class="top ">\n							<div class="twitter-logo logo connected pull-left"><i class="ynicon ynicon-social-tw"></i></div>\n							<legend class="pull-left">\n								Twitter\n								<div class="pull-right">\n									<span class="identity pull-left" ng-bind="settings.user.twitterHandle"></span>\n									<span class="twitter-disconnect disconnect pull-left">\n										(\n										<a href="javascript:void(0)" ng-click="disconnect(\'twitter\')">disconnect</a>\n										)\n									</span>\n								</div>\n							</legend>\n						</div>\n						<div class="checkbox">\n							<input type="checkbox"\n								ng-model="settings.pubTwitter.state"\n								ng-change="toEdit(\'option_\'+settings.pubTwitter.optionValue, settings.pubTwitter.state)"\n								ng-true-value="1"\n								ng-false-value="0"\n								ng-checked="settings.pubTwitter.state===1">\n							Automatically notify my followers when I go live\n						</div>\n					</div>\n				</fieldset>\n				<fieldset class="control-group">\n					<div class="instagram-not-connected" ng-hide="settings.user.instagramId">\n						<div class="top ">\n							<div class="instagram-logo logo not-connected pull-left"><i class="ynicon ynicon-social-insta"></i></div>\n							<legend class="pull-left">Instagram</legend>\n						</div>\n						<div class="instructions ">\n							Connect your Instagram account to gain new followers and level up!\n						</div>\n						<div class="connect">\n							<button class="btn btn-cancel" ng-click="connect(\'instagram\',\'SETTINGS\')">\n								<i class="ynicon ynicon-refresh"></i>\n								Connect\n							</button>\n						</div>\n					</div>\n					<div class="instagram-connected" ng-show="settings.user.instagramId">\n						<div class="top ">\n							<div class="instagram-logo logo connected pull-left"><i class="ynicon ynicon-social-insta"></i></div>\n							<legend class="pull-left">\n								Instagram\n								<div class="pull-right">\n									<span class="identity pull-left" ng-bind="settings.user.instagramHandle"></span>\n									<span class="instagram-disconnect disconnect pull-left">\n										(\n										<a href="javascript:void(0)" ng-click="disconnect(\'instagram\')">disconnect</a>\n										)\n									</span>\n								</div>\n							</legend>\n						</div>\n					</div>\n				</fieldset>\n				<fieldset class="control-group">\n					<div class="google-not-connected" ng-hide="settings.user.googleId">\n						<div class="top ">\n							<div class="google-logo logo not-connected pull-left"><i class="ynicon ynicon-social-gp"></i></div>\n							<legend class="pull-left">Google+</legend>\n						</div>\n						<div class="instructions ">\n							Connect your Google+ account to gain new followers and level up!\n						</div>\n						<div class="connect">\n							<button class="btn btn-cancel" ng-click="connect(\'google\',\'SETTINGS\')">\n								<i class="ynicon ynicon-refresh"></i>\n								Connect\n							</button>\n						</div>\n					</div>\n					<div class="google-connected" ng-show="settings.user.googleId">\n						<div class="top ">\n							<div class="google-logo logo connected pull-left"><i class="ynicon ynicon-social-gp"></i></div>\n							<legend class="pull-left">\n								Google+\n								<div class="pull-right">\n									<span class="identity pull-left" ng-bind="settings.user.googleHandle"></span>\n									<span class="google-disconnect disconnect pull-left">\n										(\n										<a href="javascript:void(0)" ng-click="disconnect(\'google\')">disconnect</a>\n										)\n									</span>\n								</div>\n							</legend>\n						</div>\n					</div>\n				</fieldset>\n				<fieldset class="control-group">\n					<div class="youtube-not-connected" ng-hide="settings.user.youTubeUserName">\n						<div class="top">\n							<div class="youtube-logo logo not-connected pull-left">\n								<img ng-src="{{config.settings.ServerCDNBaseUrl}}/images/settings/icon_set_yt.png"></div>\n							<legend class="pull-left">YouTube Channel</legend>\n						</div>\n						<div class="instructions">\n							Connect your YouTube account to gain new followers and level up!\n						</div>\n						<div class="connect">\n							<button class="btn btn-cancel" ng-click="connect(\'youtube\',\'SETTINGS\')">\n								<i class="ynicon ynicon-refresh"></i>\n								Connect\n							</button>\n						</div>\n					</div>\n					<div class="youtube-connected" ng-show="settings.user.youTubeUserName">\n						<div class="top ">\n							<div class="youtube-logo logo connected pull-left">\n								<img ng-src="{{config.settings.ServerCDNBaseUrl}}/images/settings/icon_set_yt.png"></div>\n							<legend class="pull-left">\n								YouTube\n								<div class="pull-right">\n									<span class="identity pull-left" ng-bind="settings.user.youTubeTitle"></span>\n									<span class="youtube-disconnect disconnect pull-left">\n										(\n										<a href="javascript:void(0)" ng-click="disconnect(\'youtube\')">disconnect</a>\n										)\n									</span>\n								</div>\n							</legend>\n						</div>\n					</div>\n				</fieldset>\n				<fieldset class="control-group">\n					<div class="tumblr-not-connected hidden">\n						<div class="top ">\n							<div class="tumblr-logo not-connected pull-left"><i class="ynicon ynicon-social-tm"></i></div>\n							<legend class="pull-left">Tumblr</legend>\n						</div>\n						<div class="instructions">\n							Connected users will be able to gain followers while on the site.\n						</div>\n						<div class="connect">\n							<button class="btn btn-cancel">\n								<i class="ynicon ynicon-refresh"></i>\n								Connect\n							</button>\n						</div>\n					</div>\n				</fieldset>\n				<div class="notice">\n					To terminate your YouNow account forever,visit the\n					<a href="javascript:void(0)" ng-click="page=\'privacy\'">Privacy Settings</a>\n				</div>\n				<div class="edit-actions">\n					<button class="btn btn-primary" type="button" ng-click="saveChanges()">Save</button>\n					<button class="btn btn-cancel" type="button" ng-click="cancelEdit()">Cancel</button>\n				</div>\n			</div>\n		</div>\n		<div class="privacy-page" ng-show="page==\'privacy\'" ng-class="{\'edit-mode\':editing}">\n			<div class="form-horizontal">\n				<fieldset>\n					<legend>Control How Others See You</legend>\n					<div class="hide-my-city  control-group">\n						<div class="control-label pull-left">\n							<input type="checkbox"\n										ng-model="settings.hideCity.state"\n										ng-change="toEdit(\'option_\'+settings.hideCity.optionValue, settings.hideCity.state)"\n										ng-true-value="1"\n										ng-false-value="0"\n										ng-checked="settings.hideCity.state===1"></div>\n						<div class="controls pull-left">\n							<div>Hide My City</div>\n							<div class="text-muted">\n								When selected your city will <b>not</b> be displayed\n							</div>\n						</div>\n						<div class="clear"></div>\n					</div>\n					<div class="all-broadcasts-private  control-group hidden">\n						<div class="control-label">\n							<input name="option_broadcastsPrivate" type="checkbox"></div>\n						<div class="controls">\n							<span>Mark all of my broadcasts as private</span>\n							<span class="note ">This means that your broadcasts will only be viewable by you</span>\n						</div>\n					</div>\n					<div class="status-offline  control-group hidden">\n						<div class="control-label">\n							<input name="option_statusOffline" type="checkbox"></div>\n						<div class="controls">\n							<span class="">Display my status as "Offline"</span>\n							<span class="note ">\n								When "Offline" is selected, your friends won\'t know when you\'re on YouNow\n							</span>\n						</div>\n					</div>\n					<div class="controls">\n						<div class="deactivate">\n							<button class="btn btn-important" ng-click="terminating = true; editing = false;" ng-hide="terminating">\n								Terminate My Account\n							</button>\n							<div ng-show="terminating">\n								<span class="instructions  pull-left">\n									Are you sure you want to terminate your YouNow account forever?\n								</span>\n								<snap class="note  pull-left">\n									This will delete your account, terminate all your fan connections forever, remove any of your broadcasts from public view.\n								</snap>\n								<div class="pull-left">\n									<btn-group>\n										<button class="btn btn-important" ng-click="disconnect(\'deactivation\')">Yes, Terminate</button>\n										<button class="btn btn-cancel" ng-click="terminating=false">Cancel</button>\n									</btn-group>\n								</div>\n								<input name="deactivation" type="hidden" value=""></div>\n						</div>\n						<div class="edit-actions">\n							<button class="btn btn-primary" type="button" ng-click="saveChanges()">Save</button>\n							<button class="btn btn-cancel" type="button" ng-click="cancelEdit()">Cancel</button>\n						</div>\n					</div>\n				</fieldset>\n				<div class="reactivate" ng-show="terminated">\n					<div class="instructions ">\n						<span>Your account has been Closed! Logging you out ...</span>\n						<!-- <span class="welcome-back">Welcome back, YouNower!</span> -->\n					</div>\n				</div>\n			</div>\n		</div>\n		<!--\n		<div class="subscriptions-page" ng-show="page==\'subscriptions\'" ng-class="{\'edit-mode\':editing}">\n			<div class="form-horizontal">\n\n				<div class="nos" ng-if="!subscriptions">\n					<div class="sthumbs">\n						<div class="thumb circle-thumb" ng-style="background-image:url(\'https://www2-vd.younow.com/php/api/channel/getImage/channelId=755266\');">\n							<img class="ynbadge" ng-src="https://younow-subscription-badges.s3.amazonaws.com/dev/755266/1/badge@2x.png" />\n						</div>\n					</div>\n					<div class="stitles">\n						Support your favorite broadcaster by becoming a Subscriber today!\n					</div>\n					<div class="stext">\n						<b>Look for the "Subscribe" button and you can enjoy:</b>\n						<ul>\n							<li>An awesome badge</li>\n							<li>Bold, VIP text in chat</li>\n							<li>Priority when the chat is busy</li>\n							<li>Chat with your favorite Partner in Subscriber-Only mode</li>\n							<li>The satisfaction of directly supporting a broadcaster!</li>\n						</ul>\n					</div>\n				</div>\n\n				<div class="subscriptions" ng-if="subscriptions">\n					<div class="sub" ng-repeat="sub in subscriptions" style="white-space:pre;">\n\n						<div class="thumb circle-thumb" style="background-image:url(\'{{ sub.channel.thumb }}\'),url(\'{{ sub.channel.noThumb }}\');">\n							<img class="ynbadge" src="{{ sub.channel.badge }}" />\n						</div>\n\n						<div class="info">\n							{{ sub.channel.profile }}\n						</div>\n\n					</div>\n				</div>\n\n			</div>\n		</div>\n		-->\n	</div>\n</div>\n');
}
]),
angular.module("angularjsapp/src/app/states/partner/earnings.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/states/partner/earnings.tpl.html", '<div data-header></div>\n<div class="notification" ng-class="{active: $root.notificationActive, fixed: $root.notificationFixed}">\n	<alert type="{{$root.notificationType}}" ng-bind-html="$root.notificationMessage"></alert>\n	<button class="close" ng-click="closeNotification()" type="button">\n		<i class="ynicon ynicon-close"></i>\n	</button>\n</div>\n\n<div class="headerspacer"></div>\n\n\n<div id="partnerEarnings">\n<div class="container">\n\n	<div class="userearnings">\n		<div class="userearningsowenothumb">\n			<div class="userearningstitle">Your Estimated Earnings</div>\n			<div class="userearningsowenumnothumb">${{vm.session.user.vault.dollars}}</div>\n		</div>\n	</div>\n\n	<div class="earningsrows">\n		<div class="earningsrow">\n			<div class="earningsstattitle">Last Payment Made{{( vm.session.user.lastPaymentDate ? \': \'+vm.session.user.lastPaymentDate : \'\' )}}</div>\n			<div class="earningsstat">{{( vm.session.user.lastPaymentAmount ? \'$\'+vm.session.user.lastPaymentAmount : \'N/A\' )}}</div>\n		</div>\n		<div class="earningsrow" ng-if="vm.session.user.vault.subscribers!=undefined">\n			<div class="earningsstattitle">Paying Subscribers</div>\n			<div class="earningsstat">{{vm.session.user.vault.subscribers||0}}</div>\n		</div>\n		<div class="earningsrow" ng-if="vm.session.user.vault.subscriptionCycleEarnings!=undefined">\n			<div class="earningsstattitle">Monthly Subscription Earnings</div>\n			<div class="earningsstat">${{vm.session.user.vault.subscriptionCycleEarnings||0}}</div>\n		</div>\n		<div class="earningsrow">\n			<div class="earningsstattitle">Top Broadcast Earnings</div>\n			<div class="earningsstat">${{vm.session.user.vault.maxEarnings}}</div>\n		</div>\n		<div class="earningsrow">\n			<div class="earningsstattitle">Lifetime Earnings</div>\n			<div class="earningsstat">${{vm.session.user.vault.lifeTimeEarnings}}</div>\n		</div>\n	</div>\n\n	<div class="bottom">\n		<p ng-if="vm.session.user.vault.subscriptionCycleEarnings!=undefined">Monthly Subscription Earnings is an estimate of your monthly recurring Subscriptions earnings, based on your current number of active Subscribers.</p>\n		<p>Your total earnings/payment details will be emailed to you monthly. Money transfer fees apply. Questions? <a href="mailto:partnerpayments@younow.com">partnerpayments@younow.com</a></p>\n	</div>\n\n</div>\n</div>\n\n\n<div data-footer ng-hide="$root.hideFooter"></div>')
}
]),
angular.module("angularjsapp/src/app/states/partner/partials/active.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/states/partner/partials/active.tpl.html", '<div class="container">\n\n	<div class="userearningswelcome">\n		<div class="userearningsowenothumb">\n			<div class="userearningstitlecongrats">Congrats {{vm.getUsername()}}</div>\n			<div class="userearningsowenumnothumb">You\'re In!</div>\n		</div>\n	</div>\n\n	<hr />\n\n	<div class="body">\n		<p>As a Partner you can now earn revenue by broadcasting.<br />Check your estimated earnings at anytime from the header!</p>\n	</div>\n\n	<div class="image">\n		<img ng-src="{{::vm.config.settings.ServerCDNBaseUrl}}/images/partners/image_welcome_menu.jpg" width="438" height="162">\n	</div>\n\n\n	<div class="apply">\n		<p><a href="/partners/earnings" class="btn">View your earnings</a></p>\n	</div>\n\n</div>\n')
}
]),
angular.module("angularjsapp/src/app/states/partner/partials/active_confirm.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/states/partner/partials/active_confirm.tpl.html", '<div class="container">\n\n	<h9 class="title">Updated Partner Agreement</h9>\n	<p>We update our terms of service to our partners from time to time. Please be sure to review and accept the updated Partner Agreement (shown bellow) before you proceed.</p>\n	<p>Our standard for signing up partners is high, so it is a testament to your talent that you are one of the very few in our selective program.</p>\n	<p>As a Partner you must agree to the following: </p>\n\n	<ul>\n		<li>Treat all YouNow viewers/users with respect.</li>\n		<li>To receive payment, you are legally required to sign a W9 tax form or its international equivalent.</li>\n		<li>You will receive payment at the beginning of the month following your broadcasts, provided you have earned at least $100 that month. If you\'ve earned less, money will be rolled over into the following month - assuming there is a minimum of $100.</li>\n		<li>We reserve the right to review your broadcasts and revoke earnings if they violate our <a href="/partner/agreement.php" target="_blank">Partner Agreement</a> or <a href="/partner/guidelines.html" target="_blank">Partner Guidelines</a>.</li>\n	</ul>\n\n	<span class="message error" ng-if="vm.agreeFormInvalid">Please check the box below to confirm the Partner Agreement.</span>\n	<p>\n	<form id="aggreeForm">\n		<input type="checkbox" name="agree" value="agree" style="margin-right:10px;" ng-model="vm.agreeFormChecked">\n		I agree to the UPDATED <a href="/policy/en/dmca" target="_blank">Partner Agreement</a> and <a href="/terms.php" target="_blank">Terms and Conditions</a>.\n	</form>\n	</p>\n	<span class="message error" ng-if="vm.agreeFormError">Sorry. Something went wrong. Please refresh the page.</span>\n\n</div>\n\n<div class="apply">\n	<p>\n		<button href="#" class="btn btn-partner" ng-click="vm.submitAgreeForm()" ng-disabled="vm.agreeFormProcessing">\n' + "			{{ vm.agreeFormProcessing ? 'Sending...' : 'Yes, I agree' }}\n		</button>\n	</p>\n</div>")
}
]),
angular.module("angularjsapp/src/app/states/partner/partials/application_pending.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/states/partner/partials/application_pending.tpl.html", '<div ng-if="!vm.pendingForm">\n\n	<section class="intro">\n		<div class="container">\n			\n			<div class="info">\n				<h1>Earning Revenue is Simple</h1>\n				<p class="text">Our Partner Program rewards top talent on YouNow. Earn revenue based on audience participation – not someone else\'s ads.</p>\n				<p><a href="#" class="btn btn-apply" ng-click="vm.enablePendingForm()">Apply</a></p>\n			</div>\n\n		</div>\n	</section>\n\n	<section class="body">\n		<div class="container">\n\n			<div class="title">\n				<h9>What you need to know</h9>\n			</div>\n			<div class="columns">\n\n				<div class="column column2">\n					<h7>Audience Engagement, Not Ads</h7>\n					<p>\n						The more viewers, audience interaction and premium gifts, the more revenue you make! It\'s all about engagement, not ads.\n					</p>\n				</div>\n				<div class="column column2">\n					<h7>Earn After Every Broadcast</h7>\n					<p>\n						At the end of each broadcast you see your estimated earnings, or check your earnings at anytime from your profile!\n					</p>\n				</div>\n				<div class="column column2">\n					<h7>Payment is Easy</h7>\n					<p>\n						As a Partner, you earn revenue at the end of each broadcast, and get paid out once a month – no hassle!\n					</p>\n				</div>\n				<div class="column column2">\n					<h7>What We Expect from Partners</h7>\n					<p>\n						We expect Partners to maintain average concurrent viewership of 500+, broadcast regularly (3x / week), and have content that conforms to our <a href="/partner/agreement.php" target="_blank">Terms of Service</a> and <a href="/partner/dmca.html" target="_blank">DMCA Guidelines</a>.\n					</p>\n				</div>\n\n			</div>\n\n			<div class="apply">\n				<a href="#" class="btn" ng-click="vm.enablePendingForm();">Apply</a>\n			</div>\n\n		</div>\n	</section>\n\n</div>\n\n<div class="partner" id="partnerApply" ng-if="vm.pendingForm">\n	<div class="container">\n\n		<h9>Become a Partner</h9>\n		<hr />\n		<p>Apply today and start monetizing your broadcasts.</p>\n		<form name="pendingForm" novalidate ng-submit="vm.submitPendingForm();" ng-class="{\'submitted\':vm.pendingFormSubmitted}">\n			<div class="input-row">\n				Full Name*<br>\n				<input name="name" type="text" ng-model="vm.pendingForm.name" required>\n			</div>\n			<div class="input-row">\n				Email*<br>\n				<input name="email" height="25" type="text" ng-model="vm.pendingForm.email" required ng-pattern="/^[_a-z0-9]+(\\.[_a-z0-9]+)*@[a-z0-9-]+(\\.[a-z0-9-]+)*(\\.[a-z]{2,4})$/">\n			</div>\n			<div class="input-row">\n				Phone Number*<br>\n				<input name="phone" height="25" type="text" ng-model="vm.pendingForm.phone" required ng-pattern="/^\\(?(\\d{3})\\)?[ .-]?(\\d{3})[ .-]?(\\d{4})$/">\n			</div>\n			<div class="input-row">\n				Social Links*<br>\n				<textarea rows="4" placeholder="Ex. www.twitter.com/yourhandle, www,youtube.com/username, etc." ng-model="vm.pendingForm.social" required></textarea>\n			</div>\n			<div class="input-row">\n				Tell us more about you and your desire to become a YouNow Partner*\n				<textarea rows="4" ng-model="vm.pendingForm.about" required></textarea>\n			</div>\n			\n			<p class="message error" ng-if="vm.pendingFormError">Sorry. Something went wrong. Please refresh the page.</p>\n			\n			<div class="apply">\n				<button type="submit" class="btn">Submit</button>\n			</div>\n		</form>\n\n	</div>\n\n</div>')
}
]),
angular.module("angularjsapp/src/app/states/partner/partials/not.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/states/partner/partials/not.tpl.html", '<div class="intro">\n	<div class="container">\n\n		<div class="info">\n			<h1 class="orange">YouNow Partner Program</h1>\n			<p>Are you an exceptionally talented broadcaster, personality or influencer?\n				<br /> Interested in leveraging the YouNow platform to earn actual income?\n				<br /> With our Partner Program now you can!</p>\n			<p>\n				<br />Learn more below to see if you qualify.</p>\n		</div>\n\n	</div>\n</div>\n\n\n<div class="features">\n	<div class="container">\n\n		<div class="preamble twelve columns offset-by-two">\n			<h9>MAKING MONEY ON YOUNOW IS SIMPLE:\n				<br>\n			</h9>\n		</div>\n\n		<div class="columns">\n			<div class="column3 column">\n				<img src="images/partners/simple1.png">\n				<h5>CREATE ENGAGING CONTENT</h5>\n				<p>Make an impact with your live broadcasts! Be inspiring and interactive. Keep your audience wanting more.</p>\n			</div>\n\n			<div class="column3 column">\n				<img src="images/partners/simple2.png">\n				<h5>BUILD YOUR FAN BASE</h5>\n				<p>Connect with your fans, grow a loyal audience, and get exposed to more and more new fans every day.</p>\n			</div>\n\n			<div class="column3 column">\n				<img src="images/partners/simple3.png">\n				<h5>MAKE $$$</h5>\n				<p>Earn instantly during each broadcast! <br />Finally, it pays to be a top-of-the-line YouNower.</p>\n			</div>\n		</div>\n\n	</div>\n</div>\n\n\n<div class="tour tour-easy">\n	<div class="container">\n		<div class="info">\n			<h9>HOW DOES IT WORK? IT\'S EASY!</h9>\n			<ul class="list-features">\n				<li>Broadcast awesome live content on YouNow</li>\n				<li>Fans love you and engage with your broadcast</li>\n				<li>The more viewers, audience interaction and gifts you get, <br />the more revenue you earn!</li>\n			</ul>\n		</div>\n	</div>\n</div>\n\n\n<div class="tour tour-anyone">\n	<div class="container">\n		<div class="info">\n			<h9>CAN ANYONE BE A YOUNOW PARTNER?</h9>\n			<p>The YouNow Partner Program is geared exclusively to qualified content creators. To qualify as a YouNow Partner, we look for:</p>\n			<ul class="list-features">\n				<li>Average concurrent viewership of 500+ (not just a one-time peak)</li>\n				<li>Regular broadcasts of at least 2 times a week</li>\n				<li>Content that conforms to our <a href="/policy/en/terms" target="_blank">Terms of Service</a> and <a href="/policy/en/dmca" target="_blank">DMCA Guidelines</a></li>\n			</ul>\n			<p>\n				Once you\'re a Partner, we ask that you follow our <a href="/policy/en/partners" target="_blank">Partner guidelines</a>.\n			</p>\n			<p>\n				If you create content elsewhere (for example, on YouTube, Vine, Twitter or Instagram) you should still apply! Multi-platform audiences will only serve to increase your earning potential. We look for:\n			</p>\n			<ul class="list-features">\n				<li>Average views per video: 30,000+</li>\n				<li>Subscribers / Followers: 50,000+</li>\n			</ul>\n			<p>THE ABOVE REQUIREMENTS SERVE AS GENERAL GUIDELINES. WE MAY DENY ANY APPLICATION THAT CONFORMS TO THESE GUIDELINES, OR MAKE EXCEPTIONS FOR OUTSTANDING TALENT, AT OUR DISCRETION.\n			</p>\n		</div>\n	</div>\n</div>\n\n\n<div class="apply">\n	<a class="btn" href="https://younow.wufoo.com/forms/younow-partner-program-application/">Apply Now</a>\n</div>\n')
}
]),
angular.module("angularjsapp/src/app/states/partner/partials/pending.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/states/partner/partials/pending.tpl.html", '<section class="thankyou">\n	<div class="container">\n		<h9 class="title">Thank You</h9>\n		<p>Awesome. We are excited you\'re interested in working with us. We will be in contact with you in the coming days.</p>\n	</div>\n</section>')
}
]),
angular.module("angularjsapp/src/app/states/partner/partials/pending_approved_confirm.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/states/partner/partials/pending_approved_confirm.tpl.html", '<div class="container">\n\n	<h9 class="title">Congrats {{vm.getUsername()}}!</h9>\n	<p>Our standard for signing up partners is high, so it is a testament to your talent that you are one of the very few in our selective program.</p>\n	<p>As a Partner you must agree to the following:</p>\n\n	<ul>\n		<li>Treat all YouNow viewers/users with respect.</li>\n		<li>To receive payment, you are legally required to sign a W9 tax form or its international equivalent.</li>\n		<li>You will receive payment at the beginning of the month following your broadcasts, provided you have earned at least $100 that month. If you\'ve earned less, money will be rolled over into the following month - assuming there is a minimum of $100.</li>\n		<li>We reserve the right to review your broadcasts and revoke earnings if they violate our <a href="/partner/agreement.php" target="_blank">Partner Agreement</a> or <a href="/partner/guidelines.html" target="_blank">Partner Guidelines</a>.</li>\n	</ul>\n\n	<span class="message error" ng-if="vm.agreeFormInvalid">Please check the box below to confirm the Partner Agreement.</span>\n	<p>\n	<form id="aggreeForm">\n		<input type="checkbox" name="agree" value="agree" style="margin-right:10px;" ng-model="vm.agreeFormChecked">\n		I agree to the <a href="/policy/en/dmca" target="_blank">Partner Agreement</a> and <a href="/terms.php" target="_blank">Terms and Conditions</a>.\n	</form>\n	</p>\n	<span class="message error" ng-if="vm.agreeFormError">Sorry. Something went wrong. Please refresh the page.</span>\n\n</div>\n\n<div class="apply">\n	<p>\n		<button href="#" class="btn btn-partner" ng-click="vm.submitAgreeForm()" ng-disabled="vm.agreeFormProcessing">\n' + "			{{ vm.agreeFormProcessing ? 'Sending...' : 'Yes, I agree' }}\n		</button>\n	</p>\n</div>")
}
]),
angular.module("angularjsapp/src/app/states/partner/partner.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/states/partner/partner.tpl.html", '<div data-header></div>\n<div class="notification" ng-class="{active: $root.notificationActive, fixed: $root.notificationFixed}">\n	<alert type="{{$root.notificationType}}" ng-bind-html="$root.notificationMessage"></alert>\n	<button class="close" ng-click="closeNotification()" type="button">\n		<i class="ynicon ynicon-close"></i>\n	</button>\n</div>\n\n<div class="headerspacer"></div>\n\n<div class="notpartner" id="partner0" ng-if="vm.session.user.userId===0 || vm.session.user.partner===0">\n	<div ng-include src="\'angularjsapp/src/app/states/partner/partials/not.tpl.html\'"></div>\n</div>\n\n<div class="partner" id="partner1" ng-if="vm.session.user.partner===1">\n	<div ng-include src="\'angularjsapp/src/app/states/partner/partials/active.tpl.html\'"></div>\n</div>\n\n<div class="partner" id="partner2" ng-if="vm.session.user.partner==2">\n	<div ng-include src="\'angularjsapp/src/app/states/partner/partials/application_pending.tpl.html\'"></div>\n</div>\n\n<div class="partner" id="partner3" ng-if="vm.session.user.partner==3">\n	<div ng-include src="\'angularjsapp/src/app/states/partner/partials/pending.tpl.html\'"></div>\n</div>\n\n<div class="partner" id="partner6" ng-if="vm.session.user.partner==6">\n	<div ng-include src="\'angularjsapp/src/app/states/partner/partials/pending_approved_confirm.tpl.html\'"></div>\n</div>\n\n<div class="partner" id="partner7" ng-if="vm.session.user.partner==7">\n	<div ng-include src="\'angularjsapp/src/app/states/partner/partials/active_confirm.tpl.html\'"></div>\n</div>\n\n<div data-footer ng-hide="$root.hideFooter"></div>\n')
}
]),
angular.module("angularjsapp/src/app/states/policy/policy.tpl.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angularjsapp/src/app/states/policy/policy.tpl.html", '<div data-header></div>\n<div id="docs" ng-class="{\'ready\': ready, \'rtl\': rtl}">\n    <div id="doc-header">{{docTitle}}</div>\n    <div id="doc-sidebar">\n    <div ng-repeat="section in sections" class="doc-section" ng-click="scrollTo(section.offsetTop)">{{section.innerText}}</div>\n    </div>\n    <div id="doc-content" ng-bind-html="docContent"></div>\n</div>\n<div data-footer ng-hide="$root.hideFooter"></div>')
}
]),
angular.module("template/accordion/accordion-group.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/accordion/accordion-group.html", '<div class="panel panel-default">\n  <div class="panel-heading">\n    <h4 class="panel-title">\n      <a href class="accordion-toggle" ng-click="toggleOpen()" accordion-transclude="heading"><span ng-class="{\'text-muted\': isDisabled}">{{heading}}</span></a>\n    </h4>\n  </div>\n  <div class="panel-collapse" collapse="!isOpen">\n	  <div class="panel-body" ng-transclude></div>\n  </div>\n</div>\n')
}
]),
angular.module("template/accordion/accordion.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/accordion/accordion.html", '<div class="panel-group" ng-transclude></div>')
}
]),
angular.module("template/alert/alert.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/alert/alert.html", '<div class="alert" ng-class="[\'alert-\' + (type || \'warning\'), closeable ? \'alert-dismissable\' : null]" role="alert">\n    <button ng-show="closeable" type="button" class="close" ng-click="close()">\n        <span aria-hidden="true">&times;</span>\n        <span class="sr-only">Close</span>\n    </button>\n    <div ng-transclude></div>\n</div>\n')
}
]),
angular.module("template/carousel/carousel.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/carousel/carousel.html", '<div ng-mouseenter="pause()" ng-mouseleave="play()" class="carousel" ng-swipe-right="prev()" ng-swipe-left="next()">\n    <ol class="carousel-indicators" ng-show="slides.length > 1">\n        <li ng-repeat="slide in slides track by $index" ng-class="{active: isActive(slide)}" ng-click="select(slide)"></li>\n    </ol>\n    <div class="carousel-inner" ng-transclude></div>\n    <a class="left carousel-control" ng-click="prev()" ng-show="slides.length > 1"><span class="glyphicon glyphicon-chevron-left"></span></a>\n    <a class="right carousel-control" ng-click="next()" ng-show="slides.length > 1"><span class="glyphicon glyphicon-chevron-right"></span></a>\n</div>\n')
}
]),
angular.module("template/carousel/slide.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/carousel/slide.html", "<div ng-class=\"{\n    'active': leaving || (active && !entering),\n    'prev': (next || active) && direction=='prev',\n    'next': (next || active) && direction=='next',\n    'right': direction=='prev',\n    'left': direction=='next'\n  }\" class=\"item text-center\" ng-transclude></div>\n")
}
]),
angular.module("template/datepicker/datepicker.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/datepicker/datepicker.html", '<div ng-switch="datepickerMode" role="application" ng-keydown="keydown($event)">\n  <daypicker ng-switch-when="day" tabindex="0"></daypicker>\n  <monthpicker ng-switch-when="month" tabindex="0"></monthpicker>\n  <yearpicker ng-switch-when="year" tabindex="0"></yearpicker>\n</div>')
}
]),
angular.module("template/datepicker/day.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/datepicker/day.html", '<table role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th colspan="{{5 + showWeeks}}"><button id="{{uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n    <tr>\n      <th ng-show="showWeeks" class="text-center"></th>\n      <th ng-repeat="label in labels track by $index" class="text-center"><small aria-label="{{label.full}}">{{label.abbr}}</small></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-show="showWeeks" class="text-center h6"><em>{{ weekNumbers[$index] }}</em></td>\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{dt.uid}}" aria-disabled="{{!!dt.disabled}}">\n        <button type="button" style="width:100%;" class="btn btn-default btn-sm" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="{\'text-muted\': dt.secondary, \'text-info\': dt.current}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')
}
]),
angular.module("template/datepicker/month.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/datepicker/month.html", '<table role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th><button id="{{uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{dt.uid}}" aria-disabled="{{!!dt.disabled}}">\n        <button type="button" style="width:100%;" class="btn btn-default" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="{\'text-info\': dt.current}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')
}
]),
angular.module("template/datepicker/popup.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/datepicker/popup.html", '<ul class="dropdown-menu" ng-style="{display: (isOpen && \'block\') || \'none\', top: position.top+\'px\', left: position.left+\'px\'}" ng-keydown="keydown($event)">\n	<li ng-transclude></li>\n	<li ng-if="showButtonBar" style="padding:10px 9px 2px">\n		<span class="btn-group pull-left">\n			<button type="button" class="btn btn-sm btn-info" ng-click="select(\'today\')">{{ getText(\'current\') }}</button>\n			<button type="button" class="btn btn-sm btn-danger" ng-click="select(null)">{{ getText(\'clear\') }}</button>\n		</span>\n		<button type="button" class="btn btn-sm btn-success pull-right" ng-click="close()">{{ getText(\'close\') }}</button>\n	</li>\n</ul>\n')
}
]),
angular.module("template/datepicker/year.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/datepicker/year.html", '<table role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th colspan="3"><button id="{{uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{dt.uid}}" aria-disabled="{{!!dt.disabled}}">\n        <button type="button" style="width:100%;" class="btn btn-default" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="{\'text-info\': dt.current}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')
}
]),
angular.module("template/modal/backdrop.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/modal/backdrop.html", '<div class="modal-backdrop fade {{ backdropClass }}"\n     ng-class="{in: animate}"\n     ng-style="{\'z-index\': 1040 + (index && 1 || 0) + index*10}"\n></div>\n')
}
]),
angular.module("template/modal/window.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/modal/window.html", '<div tabindex="-1" id="modalWindow" role="dialog" class="modal fade" ng-class="{in: animate}" ng-style="{\'z-index\': 1050 + index*10, display: \'block\'}" ng-click="close($event)">\n    <div class="modal-dialog" yn-modal-draggable ng-class="{\'modal-sm\': size == \'sm\', \'modal-lg\': size == \'lg\'}"><div class="modal-content" modal-transclude></div></div>\n</div>')
}
]),
angular.module("template/pagination/pager.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/pagination/pager.html", '<ul class="pager">\n  <li ng-class="{disabled: noPrevious(), previous: align}"><a href ng-click="selectPage(page - 1)">{{getText(\'previous\')}}</a></li>\n  <li ng-class="{disabled: noNext(), next: align}"><a href ng-click="selectPage(page + 1)">{{getText(\'next\')}}</a></li>\n</ul>')
}
]),
angular.module("template/pagination/pagination.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/pagination/pagination.html", '<ul class="pagination">\n  <li ng-if="boundaryLinks" ng-class="{disabled: noPrevious()}"><a href ng-click="selectPage(1)">{{getText(\'first\')}}</a></li>\n  <li ng-if="directionLinks" ng-class="{disabled: noPrevious()}"><a href ng-click="selectPage(page - 1)">{{getText(\'previous\')}}</a></li>\n  <li ng-repeat="page in pages track by $index" ng-class="{active: page.active}"><a href ng-click="selectPage(page.number)">{{page.text}}</a></li>\n  <li ng-if="directionLinks" ng-class="{disabled: noNext()}"><a href ng-click="selectPage(page + 1)">{{getText(\'next\')}}</a></li>\n  <li ng-if="boundaryLinks" ng-class="{disabled: noNext()}"><a href ng-click="selectPage(totalPages)">{{getText(\'last\')}}</a></li>\n</ul>')
}
]),
angular.module("template/popover/popover.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/popover/popover.html", '<div class="popover {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="arrow"></div>\n\n  <div class="popover-inner">\n      <h3 class="popover-title" ng-bind="title" ng-show="title"></h3>\n      <div class="popover-content" ng-bind="content"></div>\n  </div>\n</div>\n')
}
]),
angular.module("template/progressbar/bar.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/progressbar/bar.html", '<div class="progress-bar" ng-class="type && \'progress-bar-\' + type" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="{{max}}" ng-style="{width: percent + \'%\'}" aria-valuetext="{{percent | number:0}}%" ng-transclude></div>')
}
]),
angular.module("template/progressbar/progress.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/progressbar/progress.html", '<div class="progress" ng-transclude></div>')
}
]),
angular.module("template/progressbar/progressbar.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/progressbar/progressbar.html", '<div class="progress">\n  <div class="progress-bar" ng-class="type && \'progress-bar-\' + type" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="{{max}}" ng-style="{width: percent + \'%\'}" aria-valuetext="{{percent | number:0}}%" ng-transclude></div>\n</div>')
}
]),
angular.module("template/rating/rating.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/rating/rating.html", '<span ng-mouseleave="reset()" ng-keydown="onKeydown($event)" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="{{range.length}}" aria-valuenow="{{value}}">\n    <i ng-repeat="r in range track by $index" ng-mouseenter="enter($index + 1)" ng-click="rate($index + 1)" class="glyphicon" ng-class="$index < value && (r.stateOn || \'glyphicon-star\') || (r.stateOff || \'glyphicon-star-empty\')">\n        <span class="sr-only">({{ $index < value ? \'*\' : \' \' }})</span>\n    </i>\n</span>')
}
]),
angular.module("template/tabs/tab.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/tabs/tab.html", '<li ng-class="{active: active, disabled: disabled}">\n  <a href ng-click="select()" tab-heading-transclude>{{heading}}</a>\n</li>\n')
}
]),
angular.module("template/tabs/tabset.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/tabs/tabset.html", '<div>\n  <ul class="nav nav-{{type || \'tabs\'}}" ng-class="{\'nav-stacked\': vertical, \'nav-justified\': justified}" ng-transclude></ul>\n  <div class="tab-content">\n    <div class="tab-pane" \n         ng-repeat="tab in tabs" \n         ng-class="{active: tab.active}"\n         tab-content-transclude="tab">\n    </div>\n  </div>\n</div>\n')
}
]),
angular.module("template/timepicker/timepicker.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/timepicker/timepicker.html", '<table>\n	<tbody>\n		<tr class="text-center">\n			<td><a ng-click="incrementHours()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n			<td>&nbsp;</td>\n			<td><a ng-click="incrementMinutes()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n			<td ng-show="showMeridian"></td>\n		</tr>\n		<tr>\n			<td style="width:50px;" class="form-group" ng-class="{\'has-error\': invalidHours}">\n				<input type="text" ng-model="hours" ng-change="updateHours()" class="form-control text-center" ng-mousewheel="incrementHours()" ng-readonly="readonlyInput" maxlength="2">\n			</td>\n			<td>:</td>\n			<td style="width:50px;" class="form-group" ng-class="{\'has-error\': invalidMinutes}">\n				<input type="text" ng-model="minutes" ng-change="updateMinutes()" class="form-control text-center" ng-readonly="readonlyInput" maxlength="2">\n			</td>\n			<td ng-show="showMeridian"><button type="button" class="btn btn-default text-center" ng-click="toggleMeridian()">{{meridian}}</button></td>\n		</tr>\n		<tr class="text-center">\n			<td><a ng-click="decrementHours()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n			<td>&nbsp;</td>\n			<td><a ng-click="decrementMinutes()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n			<td ng-show="showMeridian"></td>\n		</tr>\n	</tbody>\n</table>\n');
}
]),
angular.module("template/tooltip/tooltip-html-unsafe-popup.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/tooltip/tooltip-html-unsafe-popup.html", '<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" bind-html-unsafe="content"></div>\n</div>\n')
}
]),
angular.module("template/tooltip/tooltip-popup.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/tooltip/tooltip-popup.html", '<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" ng-bind="content"></div>\n</div>\n')
}
]),
angular.module("template/typeahead/typeahead-match.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/typeahead/typeahead-match.html", '<a tabindex="-1" bind-html-unsafe="match.label | typeaheadHighlight:query"></a>')
}
]),
angular.module("template/typeahead/typeahead-popup.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/typeahead/typeahead-popup.html", '<ul class="dropdown-menu" ng-show="isOpen()" ng-style="::{ \'margin-top\': \'31px\', width: \'270px\', left: 0}" style="display: block;" role="listbox" aria-hidden="{{!isOpen()}}">\n    <li ng-repeat="match in matches track by $index" ng-class="{active: isActive($index) }" ng-mouseenter="selectActive($index)" ng-click="selectMatch($index)" role="option" id="{{match.id}}">\n        <div typeahead-match index="$index" match="match" query="query" template-url="templateUrl"></div>\n    </li>\n</ul>\n')
}
]);
//# sourceMappingURL=younow.js.map
