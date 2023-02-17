export const mixin = {
    data() {
        return {
            tableYHeight: 300,
        };
    },
    methods: {
        getTableHeight() {
            const table = this.$refs.dataTable;
            if (table) {
                this.tableYHeight = table.offsetHeight - 54;
            }
        },
    },
    mounted() {
        //添加监听窗口尺寸变化事件，实时更新窗口高度。为了防止修改代码热更新不进activated。可以暂时先在mounted执行一次activated的代码(这是个bug，先这样做)
        this.getTableHeight();
        window.addEventListener("resize", this.getTableHeight, false);
    },
    activated() {
        this.getTableHeight();
        window.addEventListener("resize", this.getTableHeight, false);
    },
    deactivated() {
        window.removeEventListener("resize", this.getTableHeight);
    },
};