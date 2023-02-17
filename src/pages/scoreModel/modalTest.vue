<template>
  <a-modal class="modalTop" title="测试" :dialogStyle="{'top': '30px'}" :maskClosable="false" v-model="visibleLModal" :footer="null" @cancel="closeModalBtn">
    <div class="modalContainer">
      <a-form-model>
        <a-row>
          <a-col :span="24">
            <a-form-model-item class="formItemStyle">
              <a-select
                style="width: 100%;"
                show-search
                v-model="form.keyword"
                placeholder="请选择输入id/名称后选择"
                :default-active-first-option="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleSearch"
                @change="handleOption"
                allowClear
              >
                <a-select-option v-for="item in option.testOption" :key="item.id">{{ item.companyName }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle">
              <a-button class="ant-button" type="primary" @click="test">测试</a-button>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <h3 class="borderBottom">评分细则</h3>
      <div class="redfont heightLine">合计：{{totalScore}}</div>
      <a-table
        class="tableStyle"
        bordered
        :columns="ruleColumns"
        :data-source="dataTable"
        rowKey="id"
        :scroll="{ x: 307.778, y: dataTable.length > 20 ? 1600 : 0 }"
        :pagination='false'
      >
      </a-table>
      <div class="flex-ed heightTop">
        <a-button @click="closeModalBtn">关闭</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
import {
  test,
  testOption
} from '@/services/scoreCard/scoreModel'
const ruleColumns = [
  {title: "字段名称",dataIndex: "fieldName"},
  {title: "权重",dataIndex: "weights"},
  {title: "字段值",dataIndex: "fieldValue"},
  {title: "得分",dataIndex: "score"},
  {title: "加权得分",dataIndex: "weightedScore"}
]
export default {
  name: "modalDetails",
  data() {
    return {
      visibleLModal: false,
      allMsg: undefined,
      ruleColumns,
      form: {},
      option: {
        testOption: [],
        testMaterial: {}
      },
      totalScore: undefined,
      dataTable: [],
      pageSizeOptions: ['10','20','50','100','200'],
      pagination: {total: 0, page: 1, size: 10},
    }
  },
  methods: {
    test() {
      if (!this.form.keyword) {
        this.$message.error("请先选择")
        return
      }
      let  params = {
        partnerId: this.form.keyword,
        id: this.allMsg.id
      }
      test(params).then(res => {
        if (res.data.code == 200) {
          this.dataTable = res.data.data?.scoreResultDetailList || []
          this.totalScore = res.data.data?.totalScore
        } else {
          this.dataTable = []
          this.$message.error(res.data.message)
        }
      })
    },
    handleSearch(v) {
      if (!v || v?.trim() == "") return
      v == "can" && (v = undefined)
      let companyType = this.allMsg.scoreObject
      testOption({keyword: v?.trim(), companyType, auditStatus: 3}).then(res => this.option.testOption = res.data.data)
    },
    handleOption(v) {
      if (!v) {
        this.option.testMaterial = {}
        return
      }
      this.form.keyword = v
      this.option.testMaterial = this.option.testOption.find(item => item.id == v) || {}
    },
    openModal(record) {
      this.allMsg = record
      this.dataTable = []
      this.totalScore = undefined
      this.option.testMaterial = {}
      this.form = {}
      this.handleSearch("can")
      this.visibleLModal = true
    },
    closeModalBtn() {
      this.$parent.pagination.page = 1
      this.$parent.submitPagination()
      this.visibleLModal = false
    },
  },
}
</script>

<style lang="less" scoped>
@import '../../assets/css/commonless';
.modalTop{
  /deep/.ant-modal{
    width: 92% !important;
    min-width: 1300px !important;
    max-width: 2000px !important;
  }
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
    .ant-col {
      height: 60px;
    }
    .formItemStyle {
      float: left;
      width: 35%;
      min-width: 260px;
      max-width: 310px;
      margin-left: 15px;
      margin-top: 10px;
    }
    .ant-button {
      width: 100px;
    }
    .borderBottom {
      margin: 0;
      border-bottom: @border-color;
      margin-bottom: 16px;
    }
    .heightLine {
      margin-bottom: 6px;
    }
    .heightTop {
      margin-top: 10px;
    }
    .paginationContainer{
      margin: 0;padding: 10px 8px 10px 0;
    }
  }
}
</style>