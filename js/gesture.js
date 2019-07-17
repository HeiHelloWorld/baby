(function (w) {
    /**
     * 模拟多指事件
     * @param ele  元素对象
     * @param callback  对象 {start: fn, change:fn, end:fn}
     */
    w.gesture = function(ele, callback) {

        var isStart = false;    // 标记是否出发了start事件
        var startDis = 0;        // 两个触点的初始距离
        var startDeg = 0;        // 两个触点的初始角度

        // 模拟gestruestart 事件  手指点击屏幕的时候，屏幕有两个以及两个以上的手指
        ele.addEventListener('touchstart', function (event) {
            // 如果手指数量超过两根 就触发
            if (event.touches.length >= 2) {
                // 调用回调函数
                if (callback && typeof callback['start'] === 'function') {
                    callback['start']();
                }
                isStart = true;  // 表示start触发了

                // 计算两个个触点的初始距离
                startDis = getDistance(event.touches[0], event.touches[1]);

                // 计算两个触点的初始角度
                startDeg = getDeg(event.touches[0], event.touches[1]);



            }
        });

        // 模拟gesturechange 手指移动的时候，屏幕有两个以及两个以上的手指
        ele.addEventListener('touchmove', function (event) {
            // 如果手指数量大于等于两个 触发
            if (event.touches.length >= 2) {

                // 计算此时两个触点之间的距离
                var currDis = getDistance(event.touches[0], event.touches[1]);
                // 计算此时触点距离 和 初始距离 的比值
                event.scale = currDis / startDis;

                // 计算两个触点之间的角度差（旋转了多少度）
                var currDeg = getDeg(event.touches[0], event.touches[1]);  // 当前触点的角度
                event.rotation = currDeg - startDeg;  // 计算两个触点之间的角度差

                // 调用回调
                if (callback && typeof callback['change'] === 'function') {
                    callback['change'](event);
                }
            }
        });


        // 模拟gestureend 手指抬起时候，屏幕上手指数量小于2个， 并且之前触发过start
        ele.addEventListener('touchend', function (event) {

            // 判断手指数量 < 2 并且触发过start
            if (isStart && event.touches.length < 2) {
                // 调用回调函数
                if (callback && typeof callback['end'] === 'function') {
                    callback['end']();
                }
                isStart = false;   // 恢复初始状态
            }
        });


        /**
         * 计算两个触点之间的距离
         */
        function getDistance(touch1, touch2) {
            // 计算两个直角边长度
            var a = touch2.clientX - touch1.clientX;
            var b = touch2.clientY - touch1.clientY;

            // 勾股定理 计算斜边（两个触点的距离）
            var c = Math.sqrt(a * a + b * b);

            // 返回结果
            return c;
        }


        /**
         * 计算两个触点之间的角度
         */
        function getDeg(touch1, touch2) {
            // 计算两个直角边长度
            var x = touch2.clientX - touch1.clientX;
            var y = touch2.clientY - touch1.clientY;

            // 根据已知的tan值，计算对应的弧度
            var angle = Math.atan2(y, x);  // 弧度值

            // 弧度转角度
            var deg = angle / Math.PI * 180;

            // 返回
            return deg;
        }
    }
})(window);