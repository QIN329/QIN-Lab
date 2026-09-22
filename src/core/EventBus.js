class EventBus {
    constructor() {
        this.events = {};
    }

    /**
     * 监听事件
     */
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }

        this.events[event].push(callback);

        return () => {
            this.off(event, callback);
        };
    }

    /**
     * 取消监听
     */
    off(event, callback) {
        if (!this.events[event]) {
            return;
        }

        this.events[event] = this.events[event].filter(
            listener => listener !== callback
        );
    }

    /**
     * 触发事件
     */
    emit(event, data) {
        if (!this.events[event]) {
            return;
        }

        this.events[event].forEach(callback => {
            callback(data);
        });
    }

    /**
     * 清除某个事件的全部监听
     */
    clear(event) {
        if (event) {
            delete this.events[event];
        } else {
            this.events = {};
        }
    }
}

export default EventBus;