<template>
  <a-button style="width: 50px" type="primary" :icon="icon" title="操作列表" @click="visiableChange">
    <a-popover title="筛选/拖拽/排版" v-model="visiblePopover" :placement="placement">
      <template #content>
        <!--//! 使用v-if 刷新组件，防止defaultValue不刷新问题及tooltip挂载错误问题 -->
        <a-checkbox-group id="refPopover" v-if="visiblePopover" :style="`width: ${width}px`" :default-value="defaultValue" @change="onChangeChecked">
          <a-row :gutter="10">
            <draggable v-model="rowCheckBox" animation="300" chosenClass="dragSelect" @change="onChangeMove">
              <a-col :span="colSpan[''+col] || 8" v-for="item in rowCheckBox" :key="item.dataIndex">
                <a-tooltip overlayClassName="refTooltip" :destroyTooltipOnHide="true" :mouseEnterDelay="1.5" :getPopupContainer="dom">
                  <a-checkbox class="antdgreenfonthover" :value="item.dataIndex" :disabled="item.dataIndex == disabled">
                    {{item.title || item.titleTips || item.dataIndex}}
                  </a-checkbox>
                  <template #title>
                    <div>
                      <div style="text-align: center;border-bottom: 1px solid #cccccc;">
                        {{item.title || item.titleTips || item.dataIndex}}
                      </div>
                      <div style="width: 180px;padding: 6px 0;border-bottom: 1px solid #cccccc;">
                        <a-radio-group class="refRadio" v-model="item.fixed" @change="onChangeRadio">
                          <a-radio value="left">左固</a-radio>
                          <a-radio value="right">右固</a-radio>
                          <a-radio :value="undefined">取消</a-radio>
                        </a-radio-group>
                      </div>
                      <div class="flex-sb" style="width: 180px;padding: 6px 18px 6px 0;border-bottom: 1px solid #cccccc;">
                        <span class="cursorPin fontStyle clickColor" @click="rise(item.width, item)"><a-icon type="rise" />加宽</span>
                        <span class="cursorPin fontStyle clickColor" @click="fall(item.width, item)"><a-icon type="fall" />减宽</span>
                        <span class="cursorPin fontStyle clickColor" @click="auto(item.width, item)"><a-icon type="pic-center" />自动</span>
                      </div>
                      <div class="flex-sb" style="width: 180px;padding: 6px 18px 6px 0;border-bottom: 1px solid #cccccc;">
                        <span class="cursorPin fontStyle" :class="{'fontgreen': item.align == 'left' || !item.align}" @click="center(item, 'left')"><a-icon type="align-left" />居左</span>
                        <span class="cursorPin fontStyle" :class="{'fontgreen': item.align == 'center'}" @click="center(item, 'center')"><a-icon type="align-center" />居中</span>
                        <span class="cursorPin fontStyle" :class="{'fontgreen': item.align == 'right'}" @click="center(item, 'right')"><a-icon type="align-right" />居右</span>
                      </div>
                    </div>
                  </template>
                </a-tooltip>
              </a-col>
            </draggable>
          </a-row>
        </a-checkbox-group>
      </template>
    </a-popover>
  </a-button>
</template>

<script>
import deepClone from 'lodash.clonedeep'
import draggable from 'vuedraggable'
export default {
  name: "checkboxList",
  components: {draggable},
  props: {
    value: {type: Array},
    width: {default: 360},
    col: {default: "2"},
    placement: {default: "bottomLeft"},
    visible: {default: !1},
    icon: {default: "bars"}
  },
  data() {
    return {
      visiblePopover: this.visible,
      rowCheckBox: [],
      colSpan: {"1": 24, "2": 12, "3": 8, "4": 6, "5": 6, "6": 4},
      checkedValues: [],
      disabled: undefined,
      defaultValue: [],
    }
  },
  methods: {
    visiableChange() {
      if (this.value.copyRowData) {
        let byOrderGetColunm = []
        let orderCheckBox = deepClone(this.value.order)
        this.rowCheckBox = deepClone(this.value.copyRowData)
        orderCheckBox?.forEach(orderIndex => {
          byOrderGetColunm.push(this.rowCheckBox.find(item => (orderIndex[0] == item.dataIndex || orderIndex[0] == item.scopedSlots?.customRender) && orderIndex[1] == (item.title || item.slots?.title)))
        })
        this.rowCheckBox = byOrderGetColunm.length ? byOrderGetColunm : this.rowCheckBox
        this.rowCheckBox.copyRowData = this.value.copyRowData
      } else {
        this.value.copyRowData = deepClone(this.value)
        this.rowCheckBox = deepClone(this.value)
      }
      this.defaultValue = []
      this.rowCheckBox.forEach(itemCol => this.defaultValue.push(itemCol.dataIndex))
      if (this.checkedValues.length && this.value.order?.length) this.defaultValue = this.checkedValues
      this.visiblePopover = !this.visiblePopover
    },
    onChangeChecked(checkedValues) {
      this.checkedValues = checkedValues
      this.disabled = checkedValues.length == 1 ? checkedValues[0] : undefined
      let orderItem = []
      let newColData = this.rowCheckBox.filter(val => checkedValues.includes(val.dataIndex));
      newColData.copyRowData = [...this.value.copyRowData]
      newColData.copyRowData.forEach(col => {
        if (this.rowCheckBox.some(or => or.dataIndex == col.dataIndex && or.title == col.title && or.slots?.title == col.slots?.title)) {
          let objCol = this.rowCheckBox.find(tf => tf.dataIndex == col.dataIndex && tf.title == col.title && tf.slots?.title == col.slots?.title)
          col.align = objCol.align
          col.fixed = objCol.fixed
        }
      })
      this.rowCheckBox.forEach(orderCol => orderItem.push([orderCol.dataIndex || orderCol.scopedSlots?.customRender, orderCol.title || orderCol.slots?.title]))
      newColData.order = orderItem
      this.$emit("input", newColData)
    },
    onChangeMove() {
      this.onChangeChecked(this.defaultValue)
    },
    onChangeRadio() {
      this.onChangeChecked(this.defaultValue)
    },
    rise(width, col) {
      if (!width) col.width = 200
      if (width >= 600) return
      if (width) col.width = 10 + width
      this.onChangeChecked(this.defaultValue)
    },
    fall(width, col) {
      if (!width) col.width = 200
      if (width <= 80) return
      if (width) col.width = -10 + width
      this.onChangeChecked(this.defaultValue)
    },
    auto(width, col) {
      if (!width) col.width = 200
      if (width) col.width = undefined
      this.onChangeChecked(this.defaultValue)
    },
    center(col, value) {
      this.$set(col, 'align', value)
      this.onChangeChecked(this.defaultValue)
    },
    dom: () => document.querySelector('#refPopover')
  },
};
</script>
<style lang="less" scoped>
  /deep/.ant-checkbox + span {
    padding-left: 0;
  }
  /deep/.refRadio .ant-radio-wrapper span {
    padding-left: 0;
    color: #636363;
  }
  .fontgreen {
    color: #4da125 !important;
  }
  .fontStyle {
    user-select: none;
    color: #636363;
  }
  .clickColor:active {
    color: #4da125;
  }
</style>
<style lang="less">
  .refTooltip > .ant-tooltip-content > .ant-tooltip-arrow::before {
    background-color: white;
  }
  .refTooltip > .ant-tooltip-content .ant-tooltip-inner {
    color: black;
    background-color: white;
  }
</style>