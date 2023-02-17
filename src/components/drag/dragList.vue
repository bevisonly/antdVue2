<template>
  <a-button style="width: 50px" type="primary" :icon="icon" title="拖拽排序" @click="visiableChange">
    <a-popover v-model="visiblePopover" :placement="placement">
      <template #title>拖拽排序</template>
      <template #content>
        <div class="contentStyle">
          <div style="margin: 0;padding: 0;" :style="`width: ${width}px`"><slot /></div>
          <draggable v-model="column" animation="300" chosenClass="dragSelect" @change="$emit('columnData', column)">
            <transition-group>
              <div class="topDragStyle flex-sb cursorMove" :style="`width: ${width}px`" v-for="item in column" :key="item.title || item.titleTips || item.dataIndex">
                <span
                  :class="item.width ? 'cursorPin' : ''"
                  :title="item.width ? '点击可减少列宽' : ''"
                  @click="item.width = item.width ? item.width > (item.minWidth || 80) ? item.width - 10 : (item.minWidth || 80) : {}.a"
                >{{item.title || item.titleTips || item.dataIndex}}</span>
                <div
                  v-show="item.width"
                  class="bottomDragStyle cursorPin"
                  title="点击左边文字可减少列宽"
                  @click="item.width = item.width < (item.maxWidth || 600) ? item.width + 10 : (item.maxWidth || 600)"
                >+</div>
              </div>
            </transition-group>
          </draggable>
          <div style="margin: 0;padding: 0;" :style="`width: ${width}px`"><slot name="footer" /></div>
        </div>
      </template>
    </a-popover>
  </a-button>
</template>

<script>
import draggable from 'vuedraggable'
import deepClone from 'lodash.clonedeep'
export default {
  name: "dragList",
  components: {draggable},
  props: {
    columns: {type: Array},
    width: {default: 200},
    placement: {default: "leftTop"},
    visible: {default: !1},
    icon: {default: 'drag'}
  },
  data() {
    return {
      visiblePopover: !1,
      column: []
    }
  },
  methods: {
    visiableChange() {
      this.visiblePopover = !this.visiblePopover
      this.columns.copyRowData = deepClone(this.columns.copyRowData || this.columns)
      this.column = this.columns.copyRowData
    },
  },
};
</script>

<style lang="less" scoped>
.contentStyle {
  max-height: 300px; overflow: auto;
}
.contentStyle::-webkit-scrollbar {
  width: 4px;
}
.contentStyle::-webkit-scrollbar-track {
  background-color: #eeeeee;
  border-radius:4px;
}
.contentStyle::-webkit-scrollbar-thumb {
  background-color: #999999;
  border-radius:2px;
}
</style>