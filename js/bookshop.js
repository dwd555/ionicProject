//封装清除按钮的方法,1、input对象，2、对应的删除按钮
function closeBtn(elem, closeBtn) {
    elem.onfocus = function () {
        if (elem.value !== '' && elem.value !== null) {
            closeBtn.style.display = 'block';
        }
    };
    elem.onkeyup = function () {
        if (elem.value !== '' && elem.value !== null) {
            closeBtn.style.display = 'block';
        } else {
            closeBtn.style.display = 'none';
        }
    };
    elem.onblur = function () {
        closeBtn.style.display = 'none';
    };
}
var app = angular.module('myApp', ['ionic']);
app.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $stateProvider
        .state('start', {
            url: '/myStart',
            templateUrl: 'tpl/start.html',
            controller: 'startCtrl'
        })
        .state('main', {
            url: '/myMain',
            templateUrl: 'tpl/main.html',
            controller: 'mainCtrl'
        })
        .state('detail', {
            url: '/myDetail/:id',
            templateUrl: 'tpl/detail.html',
            controller: 'detailCtrl'
        })
        .state('order', {
            url: '/order/:id',
            templateUrl: 'tpl/order.html',
            cache:false,
            controller: 'orderCtrl'
        })
        .state('myOrder', {
            url: '/myOrder',
            templateUrl: 'tpl/myorder.html',
            cache: false,
            controller: 'myorderCtrl'
        })
        .state('login', {
            url: '/myLogin',
            templateUrl: 'tpl/login.html',
            controller: 'loginCtrl'
        })
        .state('register', {
            url: '/myRegister',
            templateUrl: 'tpl/register.html',
            controller: 'regCtrl'
        })
        .state('newscenter', {
            url: '/myNewsCenter',
            templateUrl: 'tpl/newscenter.html',
            controller: 'newsCtrl'
        })
        .state('password', {
            url: '/myPassword/:phone',
            templateUrl: 'tpl/password.html',
            controller: 'pwdCtrl'
        })
        .state('personCenter', {
            url: '/myPersonCenter',
            templateUrl: 'tpl/personCenter.html',
            cache: false,
            controller: 'personCenterCtrl'
        })
        .state('personDetail', {
            url: '/myPersonDetail',
            templateUrl: 'tpl/personDetail.html',
            cache: false,
            controller: 'personDetailCtrl'
        })
        .state('setting', {
            url: '/mySetting',
            templateUrl: 'tpl/setting.html'
        })
        .state('search',{
            url:'/mySearch',
            templateUrl:'tpl/search.html',
            cache:false,
            controller:'searchCtrl'
        });
    $urlRouterProvider.otherwise('myStart');
    $ionicConfigProvider.tabs.position('bottom');
});

app.controller('parentCtrl', ['$scope', '$state', '$ionicTabsDelegate', '$ionicHistory', function ($scope, $state, $ionicTabsDelegate, $ionicHistory) {
    $scope.jump = function (state, arg) {
        if (arg) {
            $state.go(state, arg);
        } else {
            $state.go(state);
        }
    };
    $scope.back = function () {
        //history.go(-1);
        $ionicHistory.goBack();
    };
    $scope.selectTabWithIndex = function (index) {
        $ionicTabsDelegate.select(index);
        if (index == 1) {
            if (!localStorage.getItem("phone")) {
                sessionStorage.setItem('state', 2);
                $state.go('login');
            }
        }
    };
    $scope.clearValue = function (id) {
        document.getElementById(id).value = '';

    }
}]);
app.controller('detailCtrl', ['$scope', '$ionicActionSheet', '$stateParams', '$http', '$state', '$ionicSlideBoxDelegate', '$timeout', function ($scope, $ionicActionSheet, $stateParams, $http, $state, $ionicSlideBoxDelegate, $timeout) {
    $scope.id = $stateParams.id;
    $scope.list = [];
    $scope.imgBig = [];
    $http.get('data/bookdetail.php?id=' + $scope.id).success(function (result) {
        result.img_lg = result.img_lg.split(";");
        $scope.list = result;
        //500毫秒后重新update一次，解决动态生成slideimg时的bug
        $timeout(function () {
            $ionicSlideBoxDelegate.$getByHandle('slideimgs').update();
            $ionicSlideBoxDelegate.$getByHandle('slideimgs').loop(true);
        }, 100);

    });
    $scope.show = function () {
        $ionicActionSheet.show({
            titleText: '分享至:',
            buttons: [
                {text: '新浪微博'},
                {text: '微信'},
                {text: '腾讯QQ'}
            ],
            cancelText: '取消',
            buttonClicked: function (index) {
                return true;
            }
        });
    };
    $scope.isLogin = function () {
        if (localStorage.getItem("phone")) {
            $state.go('order', {"id": $scope.id});
        } else {
            $state.go('login');
        }
    }
}]);
app.controller('orderCtrl', ['$scope', '$http', '$stateParams', '$httpParamSerializerJQLike', '$ionicLoading', '$timeout', '$state', function ($scope, $http, $stateParams, $httpParamSerializerJQLike, $ionicLoading, $timeout, $state) {
    var id = $stateParams.id;//书的bid
    var price = '';
    var phone = localStorage.getItem("phone");
    var submit = document.getElementById("submit");
    var numCount=document.getElementById("numCount");
    $scope.address = '';
    $scope.isbuy = false;//提示信息默认隐藏
    $scope.count = 1;
    $http.get('data/bookorder.php?id=' + id + "&phone=" + phone).success(function (result) {
        $scope.list = result;
        //显示当前用户手机号
        var arr = phone.split("");
        //将中间四位变成*
        arr.splice(3, 4, "*", "*", "*", "*");
        $scope.securePhone = String(arr.join(""));
        price = result.price;
        $scope.total = ($scope.count * price).toFixed(2);
        if (result.address !== 'NULL') {
            submit.disabled = false;
        }
        $scope.address = result.address == 'NULL' ? '' : result.address;
    });
    $scope.operation = function (arg) {
        if (arg == 1) {
            numCount.value++;
            $scope.total = (numCount.value * price).toFixed(2);
        } else {
            if (numCount.value<= 1) {
                return;
            }
            numCount.value--;
            $scope.total = (numCount.value * price).toFixed(2);
        }
    };
    $scope.change=function(){
        //console.log(numCount.value);
        if(numCount.value<=0){
            numCount.value=1;
        }
        $scope.total = (numCount.value * price).toFixed(2);
    };
    // $scope.$watch('count', function () {   //监听count变化
    //     console.log($scope.count);
    //
    // });
    //提交
    var addressInput = document.getElementById("addressInput");

    addressInput.onkeyup = function () {
        //console.log(addressInput.value);
        if (addressInput.value == "" || addressInput.value.trim() == "") {
            submit.disabled = true;
        } else {
            submit.disabled = false;
        }
    };
    $scope.submit = function () {
        if(numCount.value<=0){
            numCount.value=1;
        }
        $scope.order = {
            "bid": id,
            "count": numCount.value,
            "address": addressInput.value,
            "phone": localStorage.getItem("phone"),
            "price": price
        };
        var data = $httpParamSerializerJQLike($scope.order);
        $http.post("data/order.php", data, {headers: {'content-Type': 'application/x-www-form-urlencoded'}}).success(function (result) {
            //console.log(result);
            if (result.msg == 'succ') {
                $ionicLoading.show();
                $timeout(function () {
                    $ionicLoading.hide();
                    $scope.isbuy = true;
                    $state.go('myOrder');
                }, 2000);
            }
            $scope.isbuy = false;
        });

    }
}]);
app.controller('startCtrl', ['$scope', '$timeout', '$state', '$interval', function ($scope, $timeout, $state, $interval) {
    $scope.countDown = 4;
    var timer = $interval(function () {
        $scope.countDown--;
        if ($scope.countDown == 0) {
            $interval.cancel(timer);
            $state.go('main');
        }
    }, 1000);
    $scope.clearTime = function () {
        $interval.cancel(timer);
    }
}]);
app.controller('regCtrl', ['$scope', '$timeout', '$http', '$state', function ($scope, $timeout, $http, $state) {
    //生成验证码
    var code = document.getElementById('code');
    var ctx = code.getContext('2d');
    code.height = 110;
    var str = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    ctx.textBaseline = 'top';
    ctx.font = "5em sans-serif";
    var w = parseInt(code.width);
    var h = parseInt(code.height);
    var txtCode = '';
    $scope.refresh = function () {
        var num = 40;
        ctx.fillStyle = "rgb(" + ran(128, 255) + "," + ran(128, 255) + "," + ran(128, 255) + ")";
        ctx.fillRect(0, 0, w, h);
        for (var i = 0; i < 5; i++) {
            if (txtCode.length == 5) {
                txtCode = '';
            }
            ctx.save();
            ctx.translate(num, 30);
            num += 50;
            ctx.fillStyle = "rgb(" + ran(0, 128) + "," + ran(0, 128) + "," + ran(0, 128) + ")";
            ctx.rotate(ran(0, 45) * Math.PI / 180);
            var txt = str[ran(0, str.length - 1)];
            txtCode += txt;
            ctx.fillText(txt, 0, 0);
            ctx.restore();
        }
        for (var i = 0; i < 80; i++) {
            ctx.beginPath();
            ctx.fillStyle = "rgb(" + ran(128, 255) + "," + ran(128, 255) + "," + ran(128, 255) + ")";
            ctx.arc(ran(0, w), ran(0, h), 3, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        }
        for (var i = 0; i <= 5; i++) {
            ctx.beginPath();
            ctx.fillStyle = "rgb(" + ran(0, 255) + "," + ran(0, 255) + "," + ran(0, 255) + ")";
            ctx.moveTo(ran(0, w), ran(0, h));
            ctx.lineTo(ran(0, w), ran(0, h));
            ctx.stroke();
            ctx.closePath();
        }
        function ran(min, max) {
            return parseInt(Math.floor(Math.random() * (max - min + 1) + min));
        }

        //console.log(txtCode);
    };
    $scope.refresh();

    //判断手机号
    $scope.phone = {"num": ''};//解决ionic中的bug
    var regPhone = document.getElementById('regPhone');
    var regInputPhone = document.getElementById("regInputPhone");
    var nextStep = document.getElementById("nextStep");
    var regPhoneClear = document.getElementById('regPhoneClear');
    new closeBtn(regInputPhone, regPhoneClear);
    var codeInput = document.getElementById('codeInput');
    var phoneTest = false;
    $scope.$watch('phone.num', function () {
        var reg = /^1[3578]\d{9}$/g;
        if (reg.test($scope.phone.num)) {
            regPhone.style.borderColor = "green";
            phoneTest = true;
        } else if ($scope.phone.num !== null && $scope.phone.num !== '') {
            regPhone.style.borderColor = "red";
            phoneTest = false;
        } else {
            regPhone.style.borderColor = "#ddd";
            phoneTest = false;
        }
    });
    document.onkeyup = function () {
        if (phoneTest && codeInput.value) {
            nextStep.disabled = false;
        } else {
            nextStep.disabled = true;
        }
    };
    nextStep.onclick = function () {
        var userPhone = regInputPhone.value;
        var code = codeInput.value;
        var regCode = document.getElementById('regCode');
        var noticePhone = document.getElementById('noticePhone');
        if (code.toUpperCase() !== txtCode) {
            regCode.style.display = 'block';
            $timeout(function () {
                regCode.style.display = 'none';
            }, 2000)
        } else {
            $http.get('data/register.php?phone=' + userPhone).success(function (result) {
                if (result.msg == 'err') {
                    $scope.refresh();
                    noticePhone.style.display = "block";
                    $timeout(function () {
                        noticePhone.style.display = 'none';
                    }, 2000)
                } else if (result.msg == 'succ') {
                    $state.go('password', {"phone": userPhone});
                }
            });
        }
    }
}]);
app.controller('mainCtrl', ['$scope', '$http', '$state', '$ionicSlideBoxDelegate', '$timeout', '$ionicScrollDelegate', function ($scope, $http, $state, $ionicSlideBoxDelegate, $timeout, $ionicScrollDelegate) {
    $timeout(function () {
        $ionicSlideBoxDelegate.$getByHandle('slideimgs').update();
        $ionicSlideBoxDelegate.$getByHandle('slideimgs').loop(true);
    }, 500);
    var headerBar = document.getElementById('header-bar');
    var chatBtn = document.querySelector("#header-bar button");
    var logo = document.getElementById('logo');
    var headClass=headerBar.className;
    $scope.goTop=false;//gotop按钮
    // var pageNum = 1;
    $scope.list = [];
    $scope.moreDataCanBeLoaded = true;
    $scope.searchList=[];
    $scope.carouselList=[];
    $scope.iconLis=[];
    $http.get('data/booklist1.php').success(function (data) {
        $scope.list = data;
    });
    $http.get('data/main_content.php').success(function (data) {
        $scope.carouselList = data.carousel;
        $scope.iconList=data.icons;
    });
    $scope.loadMore = function () {
        $http.get('data/booklist1.php?start=' + $scope.list.length).success(function (data) {
            if (data.length < 5) {
                $scope.moreDataCanBeLoaded = false;
            }
            if (data.length > 0) {
                $scope.list = $scope.list.concat(data);
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');

        })
    };
    // $scope.$watch('inputObj.kw', function () {
    //     if ($scope.inputObj.kw) {
    //         $http.get('data/book_getbykw.php?kw=' + $scope.inputObj.kw).success(function (result) {
    //             //$scope.list = result;
    //             $scope.searchList=result
    //         });
    //     } else if($scope.inputObj.kw==null || $scope.inputObj.kw=='') {
    //         $scope.searchList = [];
    //     }
    // });
    //var mainSearch=document.getElementById('main-search');
    var mainSearch=document.querySelector('.main-search');
    var it=document.getElementById('it');
    mainSearch.onclick=function(){
        $state.go("search");
    };
    //var mainContent=document.getElementById('mainContent');
   // var searchContent=document.getElementById('search-content');
    //var closeBtn=document.getElementById("closeBtn");
    //var mainClassName=mainContent.className;
    //搜索界面
    /*mainSearch.onclick=function(){
        mainContent.style.display='none';
        //mainContent.className=mainClassName+' searchTime';
        searchContent.style.display='block';
        searchContent.className='has-header';
        it.focus();
        logo.style.display='none';
        closeBtn.style.display='block';
    };
    closeBtn.onclick=function(){
        mainContent.style.display='block';
        searchContent.style.display='none';
        searchContent.className='';
        logo.style.display='block';
        closeBtn.style.display='none';
    };*/
    //判断用户登录没
    $scope.login = function () {
        if (localStorage.getItem('phone')) {
            $state.go('newscenter');
        } else {
            sessionStorage.setItem('state', '1');
            $state.go('login');
        }
    };
    //下拉刷新
    $scope.doRefresh = function () {
        $timeout(function () {
            $scope.$broadcast('scroll.refreshComplete');
            location.reload();
        }, 1000);
    };
    var it=document.getElementById('it');
    var inputClass=it.className;
    var searchIcon=document.getElementById("searchIcon");
    var searchClass=searchIcon.className;
    $scope.getNowPosition = function () {
        if ($ionicScrollDelegate.getScrollPosition().top > 110) {
            headerBar.className=headClass+' red';
            it.className=inputClass+" scroll";
            searchIcon.className=searchClass+" white";
        } else {
            headerBar.className=headClass;
            it.className=inputClass;
            searchIcon.className=searchClass;
        }
        if($ionicScrollDelegate.getScrollPosition().top > 400){
            $scope.goTop=true;
        }else{
            $scope.goTop=false;
        }
    };
    $scope.goToTop=function(){
        $ionicScrollDelegate.scrollTop(true);
    }
}]);
app.controller('loginCtrl', ['$scope', '$http', '$httpParamSerializerJQLike', '$timeout', '$state', function ($scope, $http, $httpParamSerializerJQLike, $timeout, $state) {
    var phone = document.getElementById("phone");
    var upwd = document.getElementById("upwd");
    var login = document.getElementById("login");
    var pcBtn = document.getElementById('pcBtn');
    var ucBtn = document.getElementById('ucBtn');
    $scope.btnPhone = {"btnPhone": '', "pwd": ''};
    $scope.clearBtnPhone = false;
    upwd.addEventListener('focus',function(){
       this.type='password';
    });
    document.onkeyup = function () {
        if (phone.value && upwd.value) {
            login.disabled = false;
        } else {
            login.disabled = true;
        }
    };

    new closeBtn(phone, pcBtn);
    new closeBtn(upwd, ucBtn);

    login.onclick = function () {
        var data = $httpParamSerializerJQLike({phone: phone.value, upwd: upwd.value});
        $scope.showLogin = false;
        $scope.showErr = false;
        //发起post请求并修改头部
        $http.post('data/login.php', data, {headers: {'content-Type': 'application/x-www-form-urlencoded'}}).success(function (result) {
            if (result.msg == 'succ') {
                upwd.type="text";
                upwd.value='';
                document.getElementById('login-succ').className = 'my-modal show';
                localStorage.setItem('phone', phone.value);
                //$rootScope.uid=result.uid;//使用$rootScope存储用户id
                sessionStorage.setItem("uid", result.uid);
                //弹出提示信息1秒，并跳转到消息中心
                $timeout(function () {
                    document.getElementById('login-succ').className = 'my-modal';
                    var state = sessionStorage.getItem('state');
                    if (state == 1) {
                        $state.go('newscenter');
                    } else if (state == 2) {
                        $state.go('myOrder');
                    } else if (state == 3) {
                        $state.go('personCenter');
                    }
                }, 1000);
            } else if (result.msg == 'err') {
                document.getElementById('login-err').className = 'my-modal show';
                $timeout(function () {
                    document.getElementById('login-err').className = 'my-modal';
                }, 2000);
            }
        });
    }
}]);
app.controller('myorderCtrl', ['$scope', '$http', '$ionicPopup', '$state', function ($scope, $http, $ionicPopup, $state) {
    $scope.list = [];
    var phone = localStorage.getItem("phone");
    $http.get('data/myorder.php?phone=' + phone).success(function (result) {
        if (result.msg == 'err') {
            showAlert();
        } else {
            $scope.list = result;
            //console.log($scope.list);

        }
    });
    function showAlert() {
        var alertPopup = $ionicPopup.show({
            title: '提示',
            template: '订单为空',
            buttons: [{
                text: '返回主页',
                type: 'button-assertive',
                onTap: function () {
                    $state.go('main');
                }
            }]
        });
    }
}]);
app.controller('pwdCtrl', ['$scope', '$state', '$stateParams', '$http', '$ionicLoading', '$timeout', '$httpParamSerializerJQLike', function ($scope, $state, $stateParams, $http, $ionicLoading, $timeout, $httpParamSerializerJQLike) {
    var phone = $stateParams.phone;
    var firstPwd = document.getElementById('firstPwd');
    var secondPwd = document.getElementById('secondPwd');
    var regBtn = document.getElementById('regBtn');
    var regSucc = document.getElementById('regSucc');
    var notEqual = document.getElementById('notEqual');
    var firstPwdBtn = document.getElementById('firstPwdBtn');
    var secondPwdBtn = document.getElementById('secondPwdBtn');
    new closeBtn(firstPwd, firstPwdBtn);
    new closeBtn(secondPwd, secondPwdBtn);
    var reg = /^(\w){6,12}$/;
    firstPwd.addEventListener('keyup', function () {
        if (reg.test(firstPwd.value)) {
            firstPwd.parentNode.style.borderColor = "green";
            secondPwd.disabled = false;
        } else if (firstPwd.value !== '' && firstPwd.value !== null) {
            firstPwd.parentNode.style.borderColor = "red";
        } else {
            firstPwd.parentNode.style.borderColor = "#ddd";
        }
    });
    //firstPwd.onkeyup=function(){
    //    if(reg.test(firstPwd.value)){
    //        firstPwd.parentNode.style.borderColor="green";
    //        secondPwd.disabled=false;
    //    }else if(firstPwd.value!==''&&firstPwd.value!==null){
    //        firstPwd.parentNode.style.borderColor="red";
    //    }else{
    //        firstPwd.parentNode.style.borderColor="#ddd";
    //    }
    //};
    secondPwd.addEventListener('keyup', function () {
        if (secondPwd.value == firstPwd.value) {
            secondPwd.parentNode.style.borderColor = "green";
            regBtn.disabled = false;
        } else if (secondPwd.value !== '' && secondPwd.value !== null) {
            secondPwd.parentNode.style.borderColor = "red";
        } else {
            secondPwd.parentNode.style.borderColor = "#ddd";
        }
    });
    //secondPwd.onkeyup=function(){
    //   if(secondPwd.value==firstPwd.value){
    //       secondPwd.parentNode.style.borderColor="green";
    //        regBtn.disabled=false;
    //   }else if(secondPwd.value!==''&&secondPwd.value!==null){
    //       secondPwd.parentNode.style.borderColor="red";
    //   }else{
    //       secondPwd.parentNode.style.borderColor="#ddd";
    //   }
    //};
    document.onkeyup = function () {
        if (secondPwd.value && firstPwd.value) {
            regBtn.disabled = false;
        }
    };
    regBtn.onclick = function () {
        if (secondPwd.value == firstPwd.value && reg.test(firstPwd.value) && reg.test(secondPwd.value)) {
            var data = {'phone': phone, 'pwd': secondPwd.value};
            var sendData = $httpParamSerializerJQLike(data);
            $http.post('data/user.php', sendData, {headers: {'content-Type': 'application/x-www-form-urlencoded'}}).success(function (result) {
                $ionicLoading.show();
                if (result.msg == 'succ') {
                    localStorage.setItem('phone', phone);
                    $timeout(function () {
                        regSucc.style.display = "block";
                    }, 1000);
                    $timeout(function () {
                        $ionicLoading.hide();
                        regSucc.style.display = "none";
                        $state.go('main');
                    }, 2000);
                } else {

                }
            })
        } else {
            notEqual.style.display = 'block';
            $timeout(function () {
                notEqual.style.display = 'none';
            }, 1000);
            secondPwd.focus();
        }
    };
}]);
app.controller('newsCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    //下拉刷新
    $scope.doRefresh = function () {
        $timeout(function () {
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000);
    }
}]);
app.controller('personCenterCtrl', ['$scope', '$http', '$state', function ($scope, $http, $state) {
    var nickname = document.getElementById('nickname');
    $scope.img_tx = 'img/boy_big.png';
    if (localStorage.getItem('phone')) {
        $http.get('data/person_detail.php?phone=' + localStorage.getItem('phone')).success(function (result) {
            //console.log(result);
            if (result.nickname == 'NULL') {
                nickname.innerHTML = result.phone;
            } else {
                nickname.innerHTML = result.nickname;
            }
            if (result.img_tx == 'NULL') {
                $scope.img_tx = 'img/boy_big.png';
            } else {
                $scope.img_tx = result.img_tx;
            }
        })
    }
    $scope.perJump = function () {
        if (localStorage.getItem('phone')) {
            $state.go('personDetail');
        } else {
            $state.go('login');
            sessionStorage.setItem('state', 3);
        }
    }
}]);
app.controller('personDetailCtrl', ['$scope', '$http', '$state', '$ionicPopup', '$httpParamSerializerJQLike', function ($scope, $http, $state, $ionicPopup, $httpParamSerializerJQLike) {
    var nickname = document.getElementById('nickname');
    $scope.nickName = '';
    $scope.img_tx = 'img/boy_big.png';
    $scope.address = '';
    $scope.email = '';
    $scope.minAddress = '修改收货地址';
    $scope.minEmail = '修改电子邮件';
    if (localStorage.getItem('phone')) {
        $http.get('data/person_detail.php?phone=' + localStorage.getItem('phone')).success(function (result) {
            $scope.phone = result.phone == 'NULL' ? '' : result.phone;
            $scope.nickName = result.nickname == 'NULL' ? '' : result.nickname;
            $scope.img_tx = result.img_tx == 'NULL' ? $scope.img_tx : result.img_tx;
            $scope.address = result.address == 'NULL' ? $scope.address : result.address;
            if ($scope.address.length > 15) {
                $scope.minAddress = $scope.address.substr(0, 15) + ' ...';
            } else {
                $scope.minAddress = $scope.address;
            }
            $scope.email = result.email == 'NULL' ? $scope.email : result.email;
            if ($scope.email.length > 15) {
                $scope.minEmail = $scope.email.substr(0, 15) + ' ...';
            } else {
                $scope.minEmail = $scope.email;
            }
        });
    }
    $scope.logout = function () {
        $ionicPopup.confirm({
            template: '确定退出登录吗？',
            okText: '确认',
            cancelText: '取消'
        }).then(function (result) {
            if (result) {
                localStorage.clear();
                $state.go('main');
            }
        });
    };
    //修改昵称
    $scope.updateNickname = function () {
        var phone = localStorage.getItem('phone');
        $ionicPopup.prompt({
            title: '修改昵称',
            template: '请输入新昵称,长度最大20位',
            okText: '确定',
            cancelText: '取消'
        }).then(function (result) {
            if (result) {
                //console.log(result);
                var perNickName = result.substr(0, 20);
                //console.log(perNickName);
                var data = $httpParamSerializerJQLike({'phone': phone, 'nickname': perNickName});
                $http.post('data/update_nickname.php', data, {headers: {'content-Type': 'application/x-www-form-urlencoded'}}).success(function (result) {
                    if (result.msg == 'succ') {
                        $scope.nickName = perNickName;
                    } else {
                        //console.log('insert err');
                    }
                })
            }
        })
    };
    //修改收货地址
    $scope.updateAddress = function () {
        var phone = localStorage.getItem('phone');
        $ionicPopup.prompt({
            title: '修改收货地址',
            template: '请输入新的收货地址',
            okText: '确定',
            cancelText: '取消'
        }).then(function (result) {
            if (result) {
                var newAddress = result;
                var data = $httpParamSerializerJQLike({'phone': phone, 'address': newAddress});
                $http.post('data/update_address.php', data, {headers: {'content-Type': 'application/x-www-form-urlencoded'}}).success(function (result) {
                    if (result.msg == 'succ') {
                        $scope.minAddress = newAddress.substr(0, 14);
                    } else {
                        //console.log('insert err');
                    }
                })
            }
        })
    };
    //修改邮箱
    $scope.updateEmail = function () {
        var phone = localStorage.getItem('phone');
        $ionicPopup.prompt({
            title: '修改邮箱地址',
            template: '请输入新的邮箱地址',
            okText: '确定',
            cancelText: '取消'
        }).then(function (result) {
            if (result) {
                var newEmail = result;
                var data = $httpParamSerializerJQLike({'phone': phone, 'email': newEmail});
                $http.post('data/update_email.php', data, {headers: {'content-Type': 'application/x-www-form-urlencoded'}}).success(function (result) {
                    if (result.msg == 'succ') {
                        $scope.minEmail = newEmail.substr(0, 14);
                    } else {
                        //console.log('insert err');
                    }
                })
            }
        })
    };
}]);
app.controller('searchCtrl',['$scope','$http','$state','$ionicScrollDelegate','$timeout',function($scope,$http,$state,$ionicScrollDelegate,$timeout){
    $scope.hotSearch=true;
    var sit=document.getElementById('sit');
     $timeout(function(){
        sit.focus();
     },500);
    $scope.hotlist=[];
     $http.get("data/hot_search.php").success(function(result){
         for(var i=0;i<result.length;i++){
            if(result[i].name.indexOf("（")!==-1){
                result[i].name=(result[i].name.split("（"))[0];
            }
         }
         $scope.hotlist=result;
     });
    $scope.inputObj = {kw: ''};    //搜索框对象
    $scope.searchList=[];
    $scope.$watch('inputObj.kw',
        function () {
        if ($scope.inputObj.kw) {
            $http.get('data/book_getbykw.php?kw=' + $scope.inputObj.kw).success(function (result) {
                //$scope.list = result;
                $scope.hotSearch=false;
                $scope.searchList=result;

            });
        } else if($scope.inputObj.kw==null || $scope.inputObj.kw=='') {
            $scope.searchList = [];
            $scope.hotSearch=true;
        }
    });
}]);