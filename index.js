/**
     * [datePicker plugin]
     * IOS风格日期选择器,仿滴滴打车预约用车时间选择器
     * @Author  jawil
     * @date    2017-02-17
     * @param   {[string]}   timeStr [返回的时间字符串存在sessionStorage里面]
     * @param   {[long]}     timeStamp [返回的时间戳存在sessionStorage里面]
     * @get  {[type]}        var timeStr= sessionStorage.getItem('timeStr');
     * @get  {[type]}        var timeStamp= sessionStorage.getItem('timeStamp');
     */
    'use strict'; //默认配置

    function _instanceof(left, right) {
        if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
            return right[Symbol.hasInstance](left);
        } else {
            return left instanceof right;
        }
    }

    function _classCallCheck(instance, Constructor) {
        if (!_instanceof(instance, Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        return Constructor;
    }

    var DEFAULT_OPTIONS = {
        appointDays: 1,
        //默认可以预约未来7天
        preTime: 30,
        //默认只能预约10分钟之后,如果两个小时就填120
        disMinute: 30 //分钟的间隔，默认一分钟

    };

    function datePicker() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        //最终的配置
        var CHOICE_OPTIONS = Object.assign({}, options, DEFAULT_OPTIONS),
            app = CHOICE_OPTIONS.appointDays,
            pre_min = CHOICE_OPTIONS.preTime % 60,
            dism = CHOICE_OPTIONS.disMinute,
            pre_hour = Math.floor(DEFAULT_OPTIONS.preTime / 60);
        var daysArr = [],
            hoursArr = [],
            minutesArr = [],
            //用户最终选择日期
            selectedYear = '',
            selectedDay = '',
            selectedHour = '',
            selectedMinute = '',
            //初始化的时间
            initHour,
            initMinute,
            initHourArr = [],
            initMinuteArr = [],
            isToday = true,
            //初始化日期,获得当前日期
            date = new Date(),
            currentYear = date.getFullYear(),
            currentMonth = date.getMonth() + 1,
            currentDay = date.getDate(),
            currentHours = date.getHours() + pre_hour,
            currentMinutes = date.getMinutes(); //筛选符合条件的日期

        var filterDate = function (f) {
            //获取当前月有多少天
            var DayNumOfMonth = new Date(currentYear, currentMonth, 0).getDate(),
                //获取daysArr
                remainDay = DayNumOfMonth - currentDay,
                timeStamp = Date.now();

            for (var i = 0; i < app; i++) {
                var preStamp = timeStamp + 24 * 60 * 60 * 1000 * i,
                    _date = new Date(preStamp),
                    preYear = _date.getFullYear(),
                    preMonth = _date.getMonth() + 1,
                    preDay = _date.getDate();

                switch (i) {
                    case 0:
                        daysArr.push("\u4ECA\u5929(".concat(preMonth, "\u6708").concat(preDay, "\u65E5)"));
                        break;

                    case 1:
                        daysArr.push("\u660E\u5929(".concat(preMonth, "\u6708").concat(preDay, "\u65E5)"));
                        break;

                    case 2:
                        daysArr.push("\u540E\u5929(".concat(preMonth, "\u6708").concat(preDay, "\u65E5)"));
                        break;

                    default:
                        daysArr.push("".concat(preMonth, "\u6708").concat(preDay, "\u65E5"));
                        break;
                }
            } //如果是今天的23:30以后预约车,那么今天的就不能预约


            if (currentHours == 23 && currentMinutes >= 60 - pre_min) {
                daysArr.shift();
            }

            for (var _i = currentHours; _i < 24; _i++) {
                hoursArr.push(_i);
                initHourArr.push(_i);
            } //如果当前的分钟超过pre_min(假设pre_min=30),则小时只能从下一个小时选择,当前时间3:40=>4:10


            if (currentMinutes + pre_min > 60 - dism) {
                hoursArr.shift();
                initHourArr.shift();
            } //如果hoursArr没有数据,说明今天已经不能预约,明天任何小时都可以预约


            if (!hoursArr.length) {
                for (var h = 0; h < 24; h++) {
                    hoursArr.push(h);
                    initHourArr.push(h);
                }
            }

            for (var j = Math.ceil(currentMinutes / dism) * dism + pre_min; j < 60; j += dism) {
                minutesArr.push(j);
                initMinuteArr.push(j);
            } //如果分钟没有满足条件的,说明现在已经30分以后,小时会自动加1


            if (!minutesArr.length) {
                for (var k = Math.ceil((currentMinutes + pre_min - 60) / dism) * dism; k < 60; k += dism) {
                    minutesArr.push(k);
                    initMinuteArr.push(k);
                }
            }
        }(); //初始化数据


        var initData = function (f) {
            selectedDay = daysArr[0];
            selectedHour = initHour = initHourArr[0];
            selectedMinute = initMinute = initMinuteArr[0];
        }();

        var wheel = document.querySelectorAll('.wheel-scroll'),
            wheelDay = wheel[0],
            wheelHour = wheel[1],
            wheelMinute = wheel[2]; //初始化html结构

        var initHtml = function (f) {
            var wheelDayHtml = '',
                wheelHourHtml = '',
                wheelMinuteHtml = '';
            daysArr.forEach(function (ele) {
                wheelDayHtml += "<li class=\"wheel-item\">".concat(ele, "</li>");
            });
            hoursArr.forEach(function (ele) {
                wheelHourHtml += "<li class=\"wheel-item\">".concat(ele, "\u70B9</li>");
            });
            minutesArr.forEach(function (ele) {
                wheelMinuteHtml += "<li class=\"wheel-item\">".concat(ele, "\u5206</li>");
            });
            wheelDay.innerHTML = wheelDayHtml;
            wheelHour.innerHTML = wheelHourHtml;
            wheelMinute.innerHTML = wheelMinuteHtml;
        }(); //仿IOS日期风格选择器


        var datePicker =
            /*#__PURE__*/
            function () {
                function datePicker(obj) {
                    var initIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                    var callback = arguments.length > 2 ? arguments[2] : undefined;

                    _classCallCheck(this, datePicker);

                    this.obj = obj;
                    this.index = -initIndex;
                    this.callback = callback;
                    this.deg = 25; //初始化偏转的角度

                    this.length = this.obj.children.length;
                    this.distance = this.obj.children[0].offsetHeight;
                    this.ready();
                }

                _createClass(datePicker, [{
                    key: "ready",
                    value: function ready() {
                        //初始化运动距离
                        datePicker.setTranslate3d(this.obj, this.index * this.distance); //初始化3D偏转角度

                        datePicker.setRotateX(this.obj.children, this.index);
                        this.bind(this.obj);
                    }
                }, {
                    key: "bind",
                    value: function bind(selector) {
                        var _this = this;

                        var iStartPageY = 0,
                            step = 1,
                            //弹性系数
                            prevPoint = 0,
                            speed = 0,
                            //手指离开时候的瞬时速度,速度越大,最后停留的越远
                            timer = null,
                            length = this.length - 1;

                        var touchstart = function touchstart(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            clearInterval(timer);
                            iStartPageY = e.changedTouches[0].clientY;
                            prevPoint = iStartPageY;
                        };

                        var touchmove = function touchmove(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            var iDisY = e.changedTouches[0].pageY - iStartPageY;
                            speed = e.changedTouches[0].pageY - prevPoint;
                            prevPoint = e.changedTouches[0]
                            .pageY; //已滑动在头部或尾部,但是用户还想往上或下滑,这是给一种越往上或下滑越难拖动的体验

                            if (_this.index == 0 && iDisY > 0 || _this.index == -length && iDisY <
                                0) {
                                step = 1 - Math.abs(iDisY) / selector
                                .clientWidth; //根据超出长度计算系数大小，超出的越到 系数越小

                                step = Math.max(step, 0); //系数最小值为0

                                iDisY = parseInt(iDisY * step);
                            }

                            datePicker.setTranslate3d(selector, _this.index * _this.distance +
                                iDisY);
                            datePicker.setRotateX(_this.obj.children, _this.index + iDisY / _this
                                .distance);
                        };

                        var touchend = function touchend(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            var iDisX = e.changedTouches[0].pageY - iStartPageY; //初速度很小的逻辑处理

                            var flag = false;

                            if (Math.abs(speed) <= 1) {
                                flag = true;
                            }

                            timer = setInterval(function (f) {
                                if (Math.abs(speed) <= 1) {
                                    clearInterval(timer);

                                    if (flag) {
                                        _this.index += Math.round(iDisX / _this.distance);
                                    }

                                    _this.index = _this.index > 0 ? Math.min(_this.index,
                                        0) : Math.max(_this.index, -length);
                                    _this.index = _this.index > 0 ? 0 : _this.index < -
                                        length ? -length : _this.index;
                                    selector.style.transitionDuration = '400ms';
                                    selector.addEventListener("webkitTransitionEnd",
                                        function (f) {
                                            //touchend事件触发后会有一个动画，触发完成后立即清除transition
                                            selector.style.transitionDuration = '0ms';
                                        });
                                    Array.from(selector.children).forEach(function (ele) {
                                        ele.style.transitionDuration = '200ms';
                                        ele.addEventListener("webkitTransitionEnd",
                                            function (f) {
                                                ele.style.transitionDuration =
                                                    '0ms';
                                            });
                                    });
                                    datePicker.setTranslate3d(selector, _this.index * _this
                                        .distance);
                                    datePicker.setRotateX(_this.obj.children, _this.index);
                                    _this.callback && _this.callback(Math.abs(_this.index));
                                } else {
                                    speed *= 0.2;
                                    iDisX += speed;
                                    _this.index += Math.round(iDisX / _this.distance);
                                }
                            }, 13);
                        };

                        selector.addEventListener("touchstart", touchstart, false);
                        selector.addEventListener("touchmove", touchmove, false);
                        selector.addEventListener("touchend", touchend, false);
                    }
                }], [{
                    key: "setTranslate3d",
                    value: function setTranslate3d(obj, dis) {
                        obj.style.transform = "translate3d(0,".concat(dis, "px,0)");
                    }
                }, {
                    key: "setRotateX",
                    value: function setRotateX(obj, index) {
                        var deg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] :
                        25;
                        //设置每个Li的偏转角度
                        Array.from(obj).forEach(function (ele, i) {
                            obj[i].style.transform = "rotateX(".concat((i + index) * deg,
                                "deg)");
                        });
                    }
                }]);

                return datePicker;
            }();

        new datePicker(wheelDay, 0, function (indexDay) {
            var wheelHourHtml = '',
                wheelMinuteHtml = ''; //没有逗号，这个selectedDay是全局变量。。。

            selectedDay = daysArr[indexDay]; //今天

            if (indexDay == 0) {
                isToday = true; //用户选择今天,但是此时的小时已不满足要求,小于当前时间,需要重置初始化小时选项

                hoursArr = initHourArr;
                hoursArr.forEach(function (ele) {
                    wheelHourHtml += "<li class=\"wheel-item\">".concat(ele, "\u70B9</li>");
                });
                wheelHour.innerHTML = wheelHourHtml;
                var hindex = selectedHour < initHour ? 0 : hoursArr.indexOf(
                selectedHour); //重置当前选择的时间,从明天滑回选择今天需要重置selectedHour

                selectedHour = hoursArr[hindex];
                new datePicker(wheelHour, hindex, function (indexHour) {
                    selectedHour = hoursArr[indexHour];
                }); //用户选择今天,但是此时的分钟已不满足要求,小于当前时间,需要重置初始化分钟选项

                if (hindex === 0) {
                    minutesArr = initMinuteArr;
                    minutesArr.forEach(function (ele) {
                        wheelMinuteHtml += "<li class=\"wheel-item\">".concat(ele, "\u5206</li>");
                    });
                    wheelMinute.innerHTML = wheelMinuteHtml;
                    var mindex = selectedMinute < initMinute ? 0 : minutesArr.indexOf(
                    selectedMinute); //重置当前选择的时间,从明天滑回选择今天需要重置selectedMinute

                    selectedMinute = minutesArr[mindex];
                    new datePicker(wheelMinute, mindex, function (indexMinute) {
                        selectedMinute = minutesArr[indexMinute];
                    });
                } //明天或者后天

            } else {
                //天数选择影响小时
                isToday = false;
                hoursArr = [];

                for (var h = 0; h < 24; h++) {
                    hoursArr.push(h);
                }

                var _hindex = hoursArr.indexOf(selectedHour);

                hoursArr.forEach(function (ele) {
                    wheelHourHtml += "<li class=\"wheel-item\">".concat(ele, "\u70B9</li>");
                });
                wheelHour.innerHTML = wheelHourHtml;
                new datePicker(wheelHour, _hindex, function (indexHour) {
                    selectedHour = hoursArr[indexHour];
                }); //天数选择影响分钟

                minutesArr = [];

                for (var m = 0; m < 60; m += dism) {
                    minutesArr.push(m);
                }

                var _mindex = minutesArr.indexOf(selectedMinute);

                wheelMinuteHtml = '';
                minutesArr.forEach(function (ele) {
                    wheelMinuteHtml += "<li class=\"wheel-item\">".concat(ele, "\u5206</li>");
                });
                wheelMinute.innerHTML = wheelMinuteHtml;
                new datePicker(wheelMinute, _mindex, function (indexMinute) {
                    selectedMinute = minutesArr[indexMinute];
                });
            }
        });
        new datePicker(wheelHour, 0, function (indexHour) {
            var wheelMinuteHtml = '';
            selectedHour = hoursArr[indexHour]; //滑到头部,这是要处理分钟是否小于当前时间

            if (indexHour == 0 && isToday) {
                minutesArr = initMinuteArr;
                minutesArr.forEach(function (ele) {
                    wheelMinuteHtml += "<li class=\"wheel-item\">".concat(ele, "\u5206</li>");
                });
                wheelMinute.innerHTML = wheelMinuteHtml;
                var mindex = selectedMinute < initMinute ? 0 : minutesArr.indexOf(
                selectedMinute); //重置当前选择的时间,从明天滑回选择今天需要重置selectedMinute

                selectedMinute = minutesArr[mindex];
                new datePicker(wheelMinute, mindex, function (indexMinute) {
                    selectedMinute = minutesArr[indexMinute];
                });
            } else {
                minutesArr = [];

                for (var m = 0; m < 60; m += dism) {
                    minutesArr.push(m);
                }

                var _mindex2 = minutesArr.indexOf(selectedMinute);

                minutesArr.forEach(function (ele) {
                    wheelMinuteHtml += "<li class=\"wheel-item\">".concat(ele, "\u5206</li>");
                });
                wheelMinute.innerHTML = wheelMinuteHtml;
                new datePicker(wheelMinute, _mindex2, function (indexMinute) {
                    selectedMinute = minutesArr[indexMinute];
                });
            }
        });
        new datePicker(wheelMinute, 0, function (indexMinute) {
            selectedMinute = minutesArr[indexMinute];
        }); //获得最后选择的日期

        var confirmTime = function confirmTime(e) {
            e.preventDefault();
            e.stopPropagation();
            var minute = selectedMinute,
                hour = selectedHour,
                day = parseInt(selectedDay.split('月')[1]),
                month = parseInt(selectedDay.split('月')[0].slice(-1)),
                year = month == 1 && day < app ? currentYear + 1 :
                currentYear; //IOS版本浏览器不兼容new Date('2017-04-11')这种格式化，故用new Date('2017/04/11')

            var timeStamp = new Date("".concat(year, "/").concat(month, "/").concat(day, " ").concat(hour, ":")
                    .concat(minute)).getTime(),
                timeStr = "".concat(selectedDay, " ").concat(hour, "\u70B9").concat(minute, "\u5206");
            sessionStorage.setItem('timeStamp', timeStamp);
            sessionStorage.setItem('timeStr', timeStr);
            console.log(year, month, day, hour, minute, timeStamp, timeStr);
            document.querySelector('.mf-picker').style.display = 'none';
        }; //显示隐藏


        var toggle = function toggle(e) {
            e.preventDefault();
            e.stopPropagation();
            document.querySelector('.mf-picker').style.display = 'none';
        };

        document.querySelector('.confirm').addEventListener('touchend', confirmTime, false);
        document.querySelector('.cancel').addEventListener('touchend', toggle, false);
        document.querySelector('.mf-picker').addEventListener('touchend', toggle, false);
    }

    datePicker({
        appointDays: 1,
        //默认可以预约未来7天
        preTime: 30,
        //默认只能预约10分钟之后,如果两个小时就填120
        disMinute: 30 //分钟的间隔，默认一分钟

    });