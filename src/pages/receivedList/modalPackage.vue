<template>
  <a-modal class="modalTopSub" :width="800" title="包装选择" :dialogStyle="{'top': '30px'}" :maskClosable="flag == 'edit' ? true : false" v-model="visibleLModal" :footer="null">
    <div class="modalContainer">
      <div class="divBorder">
        <p class="pTittle fontWeight">包装列表</p>
        <div class="flex-ed topBottom">
          <a-select
            mode="multiple"
            class="selectWidth"
            v-model="packageValue"
            :style="`width: ${selectAutoWidth}%`"
            placeholder="请选择费用进行添加"
            @change="packageChange"
          >
            <a-select-option v-for="(item, i) in packageOption" :value="item.id" :key="i"> {{ item.packName }} </a-select-option>
          </a-select>
          <a-button type="primary" style="margin: 0 10px;" @click="addPackage">添加</a-button>
        </div>
        <a-table
          bordered
          :scroll="{ x: 0, y: packageTableData.length < 11 ? 0 : 1300 }"
          :columns="packageColumns" :data-source="packageTableData" rowKey="headId"
          :pagination='false'
        >
          <span slot="packQty"><span :class="flag == 'edit' ? 'redfont' : ''">*</span>包装数量</span>
          <template tips='费用金额' slot="packQty" slot-scope="text, record">
            <a-input v-if="flag == 'edit'" placeholder="必填" v-LimitInputNumber v-model.trim="record.packQty" />
            <span v-else>{{record.packQty}}</span>
          </template>
          <template tips='操作' slot="operation" slot-scope="text, record">
            <a-button class="greenfont redfonthover" type="link" @click="removeItem(record.headId)">删除</a-button>
          </template>
        </a-table>
      </div>
      <div class="flex-ed marginTop">
        <a-button type="primary" @click="closeModalBtn">关闭</a-button>
        <a-button class="marginLeft" type="primary" @click="savePackage">保存</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { getPackage } from '@/services/pickUpOrder/receivedList'
const packageColumns = [
  {title: '包装名称', align: 'center', dataIndex: 'packName'},
  {title: '包装编号', align: 'center', dataIndex: 'packCode'},
  {slots: { title: 'packQty' }, align: 'center', dataIndex: 'packQty', scopedSlots: {customRender: "packQty"}},
  {title: '包装价格(元)', align: 'center', dataIndex: 'packUnitPrice'},
  {title: '操作', align: 'center', dataIndex: 'operation', scopedSlots: { customRender: 'operation' }},
]
export default {
  name: "modalPackage",
  data() {
    return {
      visibleLModal: false,
      flag: 'edit',
      packageColumns,
      packageTableData: [{id:1,packCode: '1212' }],
      packageOption: [],
      packageValue: [],
      packageMaterial: [],
      all: []
    }
  },
  computed: {
    selectAutoWidth: function() {
      return this.packageValue.length > 3 ? 10 * (this.packageValue.length - 1) < 87.5 ? 10 * (this.packageValue.length - 1) : 87.5 : 38
    }
  },
  methods: {
    openModal(flag, all) {
      this.flag = flag
      this.packageTableData = this.typeis(all) == 'array' ? all : []
      this.visibleLModal = true
    },
    closeModalBtn() { this.visibleLModal = false },
    packageChange(value) { this.packageValue = value },
    removeItem(headId) {
      this.packageTableData.find((item, i) => {
        if (item.headId == headId) {
          this.packageTableData.splice(i, 1)
          return item.headId == headId
        }
      })
    },
    dataIntoTable(allGet) {
      let packageId = []
      this.packageTableData.forEach(item => packageId.push(item.id))
      allGet.forEach(item => {
        if (!packageId.includes(item.id)) {
          this.packageTableData.push({
            headId: item.id,
            packName: item.packName,
            packCode: item.packCode,
            packQty: undefined,
            packUnitPrice: item.unitWeight,
            operation: undefined
          })
        }
      })
      this.packageValue = []
    },
    addPackage() {
      this.packageMaterial = []
      this.packageOption.forEach(item =>{
        this.packageValue.forEach(val => val == item.id && (this.packageMaterial.push(item)))
      })
      this.dataIntoTable(this.packageMaterial)
    },
    getPackage() { getPackage({}).then(res => this.packageOption = res.data.rows || []) },
    savePackage() {
      if (this.packageTableData.some(item => !item.packQty)) {
        this.$message.warn('存在必填未填')
        return
      }
      this.$vnode.context.forEachCaculate()
      this.$vnode.context.changeNoPayAmount()
      this.visibleLModal = false
    }
  },
  created() {
    this.getPackage()
  },
}
</script>

<style lang="less" scoped>
@import '../../assets/css/commonless';
.modalTopSub{
  /deep/ .ant-modal-body {
    padding-top: 0;
  }
  /deep/ .ant-modal-header {
    border: 0;
  }
  /deep/ .ant-modal-body {
    padding-bottom: 1px;
  }
  .modalContainer {
    margin-bottom: 10px;
    padding-top: 10px;
    border-top: @border-color;
    .pTittle {
      margin-bottom: 0;
      padding-left: 15px;
      height: 30px;
      line-height: 30px;
      background-color: @common-bgc;
    }
    .fontWeight {
      font-weight: 600;
    }
    .divBorder {
      margin-top: 10px;
      border: @border-color;
      .topBottom {
        margin: 10px 0;
        .selectWidth {
          width: 20%;
          min-width: 475px;
          max-width: 656.25px;
          transition: width 1s;
        }
      }
    }
    .marginTop {
      margin-top: 10px;
      .marginLeft {
        margin-left: 10px;
      }
    }
    .bottomMargin {
      margin-left: 10px;
    }
  }
}
</style>