<template>
  <a-modal
    :width='1200'
    :dialogStyle="{'top': '30px'}"
    v-model="visibleNewAddModal"
    title="新增数据"
    :maskClosable='false'
    okText="确定"
    @ok="handleOk"
  >
    <div class="height">
      <div class="divStyle flex-ed">
        增加/删除步长：<a-input class="inputStyle btnStyle" placeholder="有效范围增加[1, 10]、删除[1,总数]" v-model.number="addNum"></a-input>
        <a-button class="btnStyle" type="primary" @click="addItem">批量增加</a-button>
        <a-button type="primary" @click="batchDeleteItem">批量删除</a-button>
      </div>
      <a-table
        bordered
        :data-source="tableData"
        rowKey="id"
        size="middle"
        :scroll="{ x: 307.778, y: tableData.length < 50 ? 0 : 1300}"
        :pagination="false"
      >
        <a-table-column title="操作" align='center' data-index="operation">
          <template slot-scope="text, record">
            <a-button type="primary" shape="circle" class="widthBtn" icon='plus' @click="addItem('one')"></a-button>
            <a-button type="primary" shape="circle" class="widthBtn" icon='delete' @click="deleteItem(record.id)"></a-button>
          </template>
        </a-table-column>
        <a-table-column title="数据类型" align='center' data-index="type">
          <template slot-scope="text, record">
            <a-input v-model="record.type"></a-input>
          </template>
        </a-table-column>
        <a-table-column title="键值" align='center' data-index="keyName">
          <span slot-scope="text, record">
            <a-input v-model="record.keyName"></a-input>
          </span>
        </a-table-column>
        <a-table-column title="字段值" align='center' data-index="dicText">
          <span slot-scope="text, record">
            <a-input v-model="record.dicText"></a-input>
          </span>
        </a-table-column>
        <a-table-column title="字段编码" align='center' data-index="dicCode">
          <span slot-scope="text, record">
            <a-input v-model="record.dicCode"></a-input>
          </span>
        </a-table-column>
        <a-table-column title="备注" align='center' data-index="remark">
          <span slot-scope="text, record">
            <a-input v-model="record.remark"></a-input>
          </span>
        </a-table-column>
        <template tips='合计' slot="footer" slot-scope="currentPageData">
          <div class="flex-ed">
            <span class="greyfont">当前条数：</span>&lt;<span class="redfont">{{ currentPageData.length }}</span>&gt;
          </div>
        </template>
      </a-table>
    </div>
  </a-modal>
</template>
<script>
import { add } from "@/services/baseDataMa/dataSource.js";
export default {
  name:"modalNewAdd",
  data() {
    return {
      visibleNewAddModal: false,
      addNum: 1,
      tableData: [],
    }
  },
  methods: {
    openModal() {
      this.tableData = []
      this.visibleNewAddModal = true;
    },
    addItem(flag) {
      if (this.tableData.length >= 100) {
        this.$message.error('最大限度为一百条')
        return
      }
      if (this.addNum <= 0) this.addNum = 1
      let ids = []
      this.tableData.forEach(item => ids.push(item.id))
      let dicText = this.tableData[this.tableData.length - 1]?.dicText || undefined
      let type = this.tableData[this.tableData.length - 1]?.type || undefined
      if (flag == "one") {
        let id = ids.sort(function(a,b){return a-b})[ids.length - 1]
        if (ids.includes(id)) id = ++id
        this.tableData.push({id, type, dicText})
        return
      }
      this.typeis(this.addNum) == 'number' ? this.addNum > 10 ? this.addNum = 10 : undefined : this.addNum = undefined
      if (this.addNum) {
        for(let i = 0; i < this.addNum; i++) {
          if (this.tableData.length == 100) break
          this.tableData.forEach(item => ids.push(item.id))
          let id = ids.sort((a,b) => a-b)[ids.length - 1] || 0
          if (ids.includes(id)) id = ++id
          this.tableData.push({id, type, dicText})
        }
      }
    },
    deleteItem(id) {
      this.tableData.some((item, i) => {
        if (item.id == id) {
          this.tableData.splice(i, 1)
          return item.id == id
        }
      })
    },
    batchDeleteItem() {
      if (this.addNum >= this.tableData.length) {
        this.tableData = []
        this.addNum = undefined
      } else if (this.addNum > 0 && this.addNum < this.tableData.length) {
        this.tableData.splice(this.tableData.length - this.addNum)
      } else {
        this.$message.error("请填写有效范围数字")
      }
    },
    handleOk() {
      add({list: this.tableData}).then(res => {
        if (res.data.code == 200) {
          this.visibleNewAddModal = false
          this.tableData = []
          this.$message.success("新增成功")
          this.$parent.pagination.page = 1
          this.$parent.submitPagination()
        }
      })
    }
  },
}
</script>
<style lang="less" scoped>
  /deep/.ant-modal-body{
    padding: 16px 24px 0 24px;
  }
  /deep/.ant-btn-link{
    margin: 0;padding: 0 16px 0;
  }
  /deep/.ant-btn > .anticon + span {
    margin-left: 2px;
  }
  .height {
    min-height: 400px;
    max-height: 800px;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    &::-webkit-scrollbar-track{
      background-color: #ffffff;
      border-radius:8px;
    }
    &::-webkit-scrollbar-thumb{
      background-color: #4DA125;
      border-radius: 8px;
    }
    .divStyle {
      margin-bottom: 15px;
      color: black;
      .marginLeft {
        margin-left: 15px;
      }
      .inputStyle {
        width: 260px;
      }
      .btnStyle {
        margin-right: 10px;
      }
    }
    .widthBtn {
      margin: 0 10px;
    }
  }
</style>