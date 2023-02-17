<template>
    <a-modal :width='800' :dialogStyle="{'top': '60px'}" v-model="visiblePackageSelectModal" title="选择包装" :maskClosable='false' :closable="false" okText="确定" @cancel="onCancel" @ok="handleOk">
      <div class="pageContanier">
        <div class="topBox flex-sb">
          <span class="topLeft">包装列表</span>
          <a-button class="topRight" size="small" type="primary" @click="openSonModal">添加</a-button>
        </div>
        <div class="bottomBox">
          <a-table
            class="tableStyle"
            bordered
            ref="tableRef"
            :columns="columnsPackageSelect"
            :data-source="dataTable"
            :pagination="false"
            rowKey="packCode"
          >
            <template slot="packQty" slot-scope="text, record">
                <a-input-number v-model="record.packQty" :max="99999999" :min="1" :precision='0'/>
            </template>
            <template tips='操作' slot="operation" slot-scope="text, record">
              <a-popconfirm title="确定要删除吗?" @confirm="() => onDelete(record.id)">
                <span class="redfont paintfonthover cursorPin">删除</span>
              </a-popconfirm>
            </template>
          </a-table>
        </div>
      </div>
      <a-modal :width='700' :dialogStyle="{'top': '96px'}" v-model="visibleSonModal" title="添加包装" okText="添加" @ok="handleYes">
        <a-form-model ref="searchForm" :model="searchForm" layout="vertical">
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="包装编码" style="float: left;margin-right: 15px;">
                <a-input class="inputStyleItem" v-model="searchForm.packCode" placeholder="请输入包装编码"></a-input>
              </a-form-model-item>
              <a-form-model-item label="包装名称" style="float: left;">
                <a-input class="inputStyle" v-model="searchForm.packName" placeholder="请输入包装名称"></a-input>
                <a-button class="ant-button" icon="sync" @click="reset">清空</a-button>
                <a-button icon="search" @click="queryBySearchForm">查询</a-button>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
        <div class="bottomContainer">
          <p class="pStyle">包装列表</p>
          <a-table
            class="bottomTableStyle"
            bordered
            ref="bottomTableRef"
            :columns="detailsColumnsPackageSelect"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :data-source="detailsDataTable"
            rowKey="id"
            :pagination="{showTotal: ()=>`共 ${paginationTotal} 条`,showSizeChanger: true,showQuickJumper: paginationTotal/271 > 1}"
          >
          </a-table>
        </div>
      </a-modal>
    </a-modal>
</template>
<script>
import { componentPackage } from "@/services/purchaseNeed.js";
import { throttle } from '../../utils/tool';
const columnsPackageSelect = [
  { title: '包装名称', align: 'center', dataIndex: 'packName', key: 'packName', width: 140 },
  { title: '包装编号', align: 'center', dataIndex: 'packCode', key: 'packCode', width: 110 },
  { title: '包装数量', align: 'center', dataIndex: 'packQty', key: 'packQty', width: 110, scopedSlots: { customRender: 'packQty' } },
  { title: '包装价格(元)', align: 'center', dataIndex: 'packUnitPrice', key: 'packUnitPrice', width: 110 },
  { title: '操作', align: 'center', dataIndex: 'operation', width: 60, scopedSlots: { customRender: 'operation' }},
]
const detailsColumnsPackageSelect = [
  { title: '包装名称', align: 'center', dataIndex: 'packName', key: 'packName', width: 160 },
  { title: '包装编号', align: 'center', dataIndex: 'packCode', key: 'packCode', width: 120 },
  { title: '包装单价', align: 'center', dataIndex: 'unitPrice', key: 'unitPrice', width: 120 },
  { title: '包装单重', align: 'center', dataIndex: 'unitWeight', key: 'unitWeight', width: 120 },
]
export default {
  name: 'modalPackageSelect',
  data() {
    return {
      visiblePackageSelectModal: false,
      parentId: '',
      visibleSonModal: false,
      columnsPackageSelect,
      detailsColumnsPackageSelect,
      selectedRowKeys: [],
      searchForm: {
        packCode: '',
        packName: '',
      },
      dataTable: [],
      savaDataTableInfo: '',
      detailsDataTable: [],
      selectedPackData: [],
      paginationTotal: 0,
    }
  },
  methods: {
    openModal(id,packageInfo,getPageDataFun) {
      if (packageInfo) {
        this.parentId = id
        packageInfo.forEach(
          item => {
            this.dataTable.push(item)
          }
        )
      }
      if (typeof(getPageDataFun) == "function") {
        this.savaDataTableInfo = getPageDataFun
      }
      this.visiblePackageSelectModal = true
    },
    openSonModal() {
      this.visibleSonModal = true
    },
    reset() {
      let resetForm = {packCode: '',packName: ''}
      this.searchForm = resetForm
    },
    queryBySearchForm() {
      const params = {
        packCode: this.searchForm.packCode,
        packName: this.searchForm.packName,
      }
      componentPackage(params).then(
        res => {
          res.data.rows.forEach(
            res => {
              typeof(res.unitPrice) == "number" ? undefined : '';
              typeof(res.unitWeight) == "number" ? undefined : '';
              res.packQty = ''
            }
          )
          this.paginationTotal = res.data.total
          this.detailsDataTable = res.data.rows
        }
      )
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedPackData = []
      this.detailsDataTable.filter(
        res => { if ( selectedRowKeys.includes(res.id) ) { this.selectedPackData.push(res) } }
      )
    },
    onCancel() {
      this.dataTable = []
    },
    handleOkThrottle: throttle(function() {
      let retrunFlag = false
      this.dataTable.forEach(
        res => {
          if (res.packQty == null) {
            retrunFlag = true
          } else if (res.packQty.length == 0) {
            retrunFlag = true
          }
        }
      )
      if (retrunFlag) {
        this.$message.warn('存在包装数量为空的包装......')
        return
      } else if (this.dataTable.length !== 0 && typeof(this.savaDataTableInfo) == 'function') {
        this.$message.success('已添加')
        this.visiblePackageSelectModal = false;
        this.savaDataTableInfo(this.dataTable);
      } else if (this.dataTable.length == 0) {
        this.$message.warn('没有添加任何包装')
        this.visiblePackageSelectModal = false;
        this.savaDataTableInfo(this.dataTable);
      }
      this.dataTable = []
    },1500),
    handleOk() {
      this.handleOkThrottle()
    },
    handleYesThrottle: throttle(function() {
      this.selectedRowKeys = []
      this.selectedPackData.forEach(
        item => {
          item.packId = item.id
          item.packUnitPrice = item.unitPrice
          item.packUnitWeight = item.unitWeight
          this.dataTable.push(item)
        }
      )
      for (let i = 0; i < this.dataTable.length; i++) {
        for (let j = i+1; j < this.dataTable.length; j++) {
          if (this.dataTable[i].packCode === this.dataTable[j].packCode) {
            this.dataTable.splice(j,1)
            j--
          }
        }
      }
      this.visibleSonModal = false;
    },1500),
    handleYes() {
      this.handleYesThrottle()
    },
    onDelete(id) {
      this.dataTable.find(
        (item,i) => {
          if (item.id == id) {
            this.dataTable.splice(i,1)
          }
        }
      )
    },
    handleChange(value, key, column, id=0) {
      let keyId = id
      this.dataTable.find((item,i) => {
        if (item.id == id) {
          keyId = i
        }
      })
      const newData = [...this.dataTable];
      const target = newData.filter(item => key === item.key)[keyId];
      if (target) {
        target[column] = parseInt(value);
        this.dataTable = newData
      }
    },
  },
  //当被嵌套的页面purchaseNeed.vue第一次被激活，则嵌套页面modalForm.vue下的这个页面也将被创建，但不会激活，对应的钩子相应加载
  created() {
    this.queryBySearchForm();
  },
  activated() {
    this.queryBySearchForm();
  },
  deactivated() {
    this.dataTable = []
  },
}
</script>
<style lang="less" scoped>
@import '../../assets/css/commonless';
.pageContanier{
  border: 1px solid #ebebeb;
  .topBox{
    height: 40px;
    line-height: 40px;
    padding: 0 12px;
    color: black;
    background-color: #F0F3F6;
    .topRight{
      width: 60px;
    }
  }
  /deep/.ant-input-number-handler-wrap{
    width: 0;
    height: 0;
  }
}
.inputStyleItem{
  width: 220px;
}
.inputStyle{
  width: 220px;
  margin-right: 17px;
}
.ant-button{
  margin-right: 15px;
}
/deep/.ant-modal-body{
  padding-top: 16px;
}
/deep/.ant-form-item{
  margin-bottom: 0;
}
.bottomContainer{
  max-height: 318px;
  overflow-x: hidden;
  border:1px solid #e4e4e4;
  .scrollBar();
  .pStyle{
    height: 30px;
    line-height: 30px;
    padding-left: 15px;
    margin-bottom: 0;
    border-bottom: 0;
    background-color: #F0F3F6;
    color: black;
  }
}
.pagination-style{
  margin: 4px 0;
  padding: 8px 0;
  border-top:1px solid #ebebeb;
  border-bottom:1px solid #ebebeb;
}
</style>