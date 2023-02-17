<template>
  <a-modal class="modalTop" title="名称及适用对象" :dialogStyle="{'top': '30px'}" :maskClosable="false" v-model="visibleLModal" :footer="null">
    <div class="modalContainer">
      <a-row class="rowMargin">
        <a-col :span=8 class="paddingleft">
          <span class="redfont">*</span>模型名称
          <a-input class="widthInput" v-model="form.modelName"></a-input>
        </a-col>
        <a-col :span=8 class="paddingleft">
          <span class="redfont">*</span>请选择评分对象
          <a-select class="selectWidth" v-model="form.scoreObject" @change="detailedSortChange">
            <a-select-option value="30">资源中心-客户</a-select-option>
            <a-select-option value="20">资源中心-供应商</a-select-option>
          </a-select>
        </a-col>
        <a-col :span=8 class="paddingleft">
          <span class="redfont">*</span>
          请选择对象详细分类
          <a-select class="selectWidth" v-model="form.detailedSort" mode="multiple" allowClear @change="detailedSortChange">
            <a-select-option v-for="item in option.detailsListOption" :key="item">{{ item }}</a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <h3 class="borderBottom">评分周期</h3>
      <a-row class="rowMargin">
        <a-col :span=8 class="paddingleft">
          <span class="redfont">*</span>请设定评分周期
          <a-select class="selectWidth" v-model="form.scoreCycle" @change="scoreCycleChange">
            <a-select-option value="每周">每周</a-select-option>
            <a-select-option value="每月">每月</a-select-option>
            <a-select-option value="自定义天数">自定义天数</a-select-option>
          </a-select>
        </a-col>
        <a-col :span=8 class="paddingleft">
          <span class="redfont">*</span>日期
          <a-select v-if="form.scoreCycle == '每周'" class="selectWidth" v-model="form.dateOrDay" @change="dateOrDayChange">
            <a-select-option v-for="item in option.weekOption" :key="item.name">{{ item.name }}</a-select-option>
          </a-select>
          <a-select v-else-if="form.scoreCycle == '每月'" class="selectWidth" v-model="form.dateOrDay" @change="dateOrDayChange">
            <a-select-option v-for="item in option.dateOption" :key="item.name">{{ item.name }}</a-select-option>
          </a-select>
          <a-input
            v-else
            class="selectWidth"
            :readOnly="form.scoreCycle != '自定义天数'"
            @change="dateOrDay(form.dateOrDay)"
            v-model="form.dateOrDay"
          >
          </a-input>
        </a-col>
      </a-row>
      <h3 class="borderBottom">评分规则</h3>
      <div class="flex-sb rowMargin">
        <span>
          <span class="paddingleft">权重合计：<span class="redfont">{{formatPrice(weight100)}}</span>%</span><span class="redfont" v-if="weight100 != 100">&nbsp;(权重之和应为100%)</span>
        </span>
        <a-button icon="plus" type="primary" @click="selectRule">添加新维度</a-button>
      </div>
      <a-table
        class="tableStyle"
        bordered
        :columns="ruleColumns"
        :data-source="dataTable"
        rowKey="id"
        :scroll="{ x: 307.778 }"
        :pagination='false'
      >
        <span slot="fieldName" slot-scope="text, record">
          <div class="flex-ed marginBottom">
            <a-popover trigger="click" placement="top">
              <template slot="content">
                <div class="flex-ct">
                  <a-button-group>
                    <a-button type="primary" @click="typeChange('field')"> 字段 </a-button>
                    <a-button type="primary" @click="typeChange('calculate')"> 计算符 </a-button>
                    <a-button type="primary" @click="typeChange('number')"> 数字 </a-button>
                  </a-button-group>
                </div>
                <hr style="width: 354px;">
                <div v-if="typeFlag == 'field'">
                  <a-select
                    style="width: 100%;"
                    show-search
                    v-model="fieldFieldName"
                    placeholder="请选择字段名称"
                    :default-active-first-option="false"
                    :filter-option="false"
                    :not-found-content="null"
                    @search="list"
                    @change="handleOptionSelect(record)"
                    @focus="list"
                  >
                    <a-select-option v-for="item in option.dropDownOption" :key="item.id">{{item.fieldName}}</a-select-option>
                  </a-select>
                </div>
                <div v-else-if="typeFlag == 'calculate'">
                  <a-button-group>
                    <a-button style="width: 60px" v-for="item in option.calculateOption" :key="item" @click="handleNotation(record,item)"> {{item}} </a-button>
                  </a-button-group>
                </div>
                <div v-else-if="!typeFlag || typeFlag == 'number'">
                  <a-input :disabled="!typeFlag" :placeholder="!typeFlag ? '' : '请输入数字'" v-model="fieldName" @blur="handleNumber(record)"/>
                </div>
              </template>
              <a-button icon="plus" shape="circle" type="primary"></a-button>
            </a-popover>
          </div>
          <div v-if="record.fieldType != 'numericalValue'">
            <div v-for="(item,i) in record.fieldName" :key="i">
              <a-input  :auto-size="maxRows" readOnly :value="item" @blur="textareaClearAll($event,record)"></a-input>
            </div>
          </div>
          <a-select v-else class="widthStyle" v-model="record.fieldName" mode="multiple" @change="detailedSortChange" :not-found-content="null"/>
          <div v-if="!record.fieldName && !record.tipsFlag" class="flex-ct redfont">字段名称不能空</div>
        </span>
        <span slot="weights" slot-scope="text, record">
          <a-input class="inputWidth" placeholder="必填" v-numtrim v-model="record.weights"></a-input>%
        </span>
        <span slot="scoreRules" slot-scope="text, record">
          <div v-if="record.fieldType == 'appendix'">
            <div v-for="(item,i) in record.scoreRules" :key="i">
              <h3>
                <span>{{item.rule + "："}}</span>
                <a-input class="inputstyle" placeholder="必填项，0~100" v-numtrim v-model="item.score"></a-input>&nbsp;分
              </h3>
            </div>
          </div>
          <div v-else-if="record.fieldType == 'dropDown'">
            <div v-for="(item,i) in record.scoreRules" :key="i">
              <h3>
                <a-row>
                  <a-col :span=10>
                    <span>{{item.rule + "："}}</span>
                  </a-col>
                  <a-col :span=14>
                    <a-input class="inputstyle" placeholder="必填项，0~100" v-numtrim v-model="item.score"></a-input>&nbsp;分
                  </a-col>
                </a-row>
              </h3>
            </div>
          </div>
          <div v-else-if="record.fieldType == 'numericalValue'" class="autoHeight">
            <div class="switchStyle">
              <div class="switchLeft switchBtn cursorPin" :class="record.ruleType == 0 ? 'switchBtnActive' : ''" @click="changeRuleType(record,record.ruleType)">值即分</div>
              <div class="switchLeft switchBtn cursorPin" :class="record.ruleType == 1 ? 'switchBtnActive' : ''" @click="changeRuleType(record,record.ruleType)">按区间</div>
              <br clear="all">
            </div>
            <div v-if="record.ruleType == 0">
              <div v-for="(item,i) in record.scoreRules" :key="i">
                <h3 v-if="i == 0">
                  <a-row>
                    <a-col :span=7><div class="textPosition">值&nbsp;≤</div></a-col>
                    <a-col :span=7><a-input class="inputstyleHalf" placeholder="必填" v-numtrim v-model="item.variable"></a-input></a-col>
                    <a-col :span=8><a-input class="inputstyleHalf" placeholder="必填" v-numtrim v-model="item.score"></a-input>&nbsp;分</a-col>
                    <a-col :span=2><a-button type="primary" icon="plus" shape="circle" @click="addSubItem(record.scoreRules, i)"></a-button></a-col>
                  </a-row>
                </h3>
                <h3 v-else-if="++i != record.scoreRules.length">
                  <a-row>
                    <a-col :span=7><div class="textPosition">{{record.scoreRules[i-2].variable}}&lt;值&nbsp;≤</div></a-col>
                    <a-col :span=7><a-input class="inputstyleHalf" placeholder="必填" v-numtrim v-model="item.variable"></a-input></a-col>
                    <a-col :span=8><a-input class="inputstyleHalf" placeholder="必填" v-numtrim v-model="item.score"></a-input>&nbsp;分</a-col>
                    <a-col :span=2><a-button type="primary" icon="minus" shape="circle" @click="deleteSubItem(record.scoreRules, i)"></a-button></a-col>
                  </a-row>
                </h3>
                <h3 v-else>
                  <a-row>
                    <a-col :span=7><div class="textPosition">{{record.scoreRules[i-2].variable}}&lt;值<span class="whiteFont">空</span></div></a-col>
                    <a-col :span=7></a-col>
                    <a-col :span=8><a-input class="inputstyleHalf" placeholder="必填" v-numtrim v-model="item.score"></a-input>&nbsp;分</a-col>
                    <a-col :span=2></a-col>
                  </a-row>
                </h3>
              </div>
            </div>
          </div>
        </span>
        <span slot="operation" slot-scope="text, record, index">
          <a-button type="primary" icon="delete" shape="circle" @click="deleteItem(record.id, index)"></a-button>
        </span>
      </a-table>
      <div class="flex-ed heightTop">
        <a-button type="primary" @click="closeModalBtn">关闭</a-button>
        <a-popconfirm v-if="pageFlag != 'add'" placement="bottom" title="确定编辑吗？" ok-text="确定" cancel-text="取消" :disabled="!hasPermission('scoreModel_edit')" @confirm="save">
          <a-icon slot="icon" type="delete" style="color: red" />
          <a-button type="primary" class="marginLeft">保存</a-button>
        </a-popconfirm>
        <a-button v-else type="primary" class="marginLeft" v-refresh="save">保存</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { list, insert, update, dropDownList } from '@/services/scoreCard/scoreModel'
const ruleColumns = [
  {title: "字段名称",dataIndex: "fieldName", scopedSlots: { customRender: "fieldName" }},
  {title: "权重",dataIndex: "weights", width: 200, scopedSlots: { customRender: "weights" }},
  {title: "分值规则",dataIndex: "scoreRules", scopedSlots: { customRender: "scoreRules" }},
  {title: "操作",dataIndex: "operation", align: "center", width: 100, scopedSlots: { customRender: "operation" }},
]
export default {
  name: "modalDetails",
  directives: {
    numtrim: {
      inserted: function(el) {
        el.oninput = () => el.value = el.value?.replace(/(?<=[0-9]{9})(?!\.+).*|(?<=\.{1}[0-9]{5}).*/,'')
        el.onpaste = () => el.value = el.value?.replace(/(?<=[0-9]{9})(?!\.+).*|(?<=\.{1}[0-9]{5}).*/,'')
      }
    },
  },
  data() {
    return {
      visibleLModal: false,
      white: 'green',
      allMsg: undefined,
      ruleColumns,
      form: {
        modelName: undefined,
        dateOrDay: undefined,
        scoreCycle: undefined,
        scoreObject: undefined,
        detailedSort: undefined,
      },
      maxRows: { minRows: 1, maxRows: 4 },
      fieldName: undefined,
      fieldFieldName: undefined,
      dataTable: [],
      option: {
        dateOption: [
          {name: "1号"},{name: "2号"},{name: "3号"},{name: "4号"},{name: "5号"},
          {name: "6号"},{name: "7号"},{name: "8号"},{name: "9号"},{name: "10号"},
          {name: "11号"},{name: "12号"},{name: "13号"},{name: "14号"},{name: "15号"},
          {name: "16号"},{name: "17号"},{name: "18号"},{name: "19号"},{name: "20号"},
          {name: "21号"},{name: "22号"},{name: "23号"},{name: "24号"},{name: "25号"},
          {name: "26号"},{name: "27号"},{name: "28号"}
        ],
        weekOption: [
          {name: "周一"},{name: "周二"},{name: "周三"},
          {name: "周四"},{name: "周五"},{name: "周六"},
          {name: "周日"}
        ],
        calculateOption: ["+", "-", "*", "/", "(", ")"],
        detailsListOption: [],
        appendixOption: [],
        dropDownOption: [],
        numericalValueOption: [],
        optionMsg: [],
      },
      typeFlag: undefined,
      pageFlag: undefined,
    }
  },
  computed: {
    weight100() {
      return this.dataTable?.reduce((t, c) => t + (+c.weights || 0), 0)
    },
  },
  methods: {
    dateOrDay(v) {
      if (+v > 365) {
        this.form.dateOrDay = 365
        this.$forceUpdate()
      }
    },
    list(v) {
      this.option.appendixOption = []
      this.option.dropDownOption = []
      this.option.numericalValueOption = []
      let companyType = this.form.scoreObject || undefined
      if (!companyType) {
        this.$message.error("请先选择评分对象")
        return
      }
      list({fieldName: v, companyType}).then(res => {
        this.option.optionMsg = res.data.data || []
        res.data.data.forEach(item => {
          if (item.options && item.fieldType == "appendix") {
            this.option.appendixOption.push({id: item.id, fieldName: item.fieldName, fieldCode: item.fieldCode, option:item.options})
          } else if (item.fieldType == "dropDown" || item.fieldType == "numericalValue" || item.fieldType == "appendix") {
            this.option.dropDownOption.push({id: item.id, fieldName: item.fieldName, fieldCode: item.fieldCode, option:(item.options || [])})
          } else if (item.options && item.fieldType == "numericalValue") {
            this.option.numericalValueOption.push({id: item.id, fieldName: item.fieldName, fieldCode: item.fieldCode, option:item.options})
          }
        })
      })
    },
    list2() {
      this.option.appendixOption = []
      this.option.dropDownOption = []
      this.option.detailsListOption = []
      this.option.numericalValueOption = []
      let companyType = this.form.scoreObject || undefined
      if (!companyType) {
        this.$message.error("请先选择评分对象")
        return
      }
      list({companyType}).then(res => {
        this.option.optionMsg = res.data.data || []
        res.data.data.forEach(item => {
          if (item.options && item.fieldType == "appendix") {
            this.option.appendixOption.push({id: item.id, fieldName: item.fieldName, fieldCode: item.fieldCode, option:item.options})
          } else if (item.fieldType == "dropDown" || item.fieldType == "numericalValue" || item.fieldType == "appendix") {
            this.option.dropDownOption.push({id: item.id, fieldName: item.fieldName, fieldCode: item.fieldCode, option: (item.options || [])})
          } else if (item.options && item.fieldType == "numericalValue") {
            this.option.numericalValueOption.push({id: item.id, fieldName: item.fieldName, fieldCode: item.fieldCode, option:item.options})
          }
        })
      })
    },
    dropDownList() {
      dropDownList({fieldCode: "rawMaterials"}).then(res => this.option.detailsListOption = (res.data.data?.rawMaterials || []))
    },
    detailedSortChange() {
      this.$forceUpdate()
    },
    scoreCycleChange() {
      this.form.dateOrDay = undefined
      this.$forceUpdate()
    },
    dateOrDayChange(v) {
      this.form.dateOrDay = v
      this.$forceUpdate()
    },
    changeRuleType(record, ruleType) {
      record.ruleType = +!ruleType
      if (record.scoreRules.length == 0) {
        record.scoreRules = [{rule: ''},{rule: ''}]
      }
      this.$forceUpdate()
    },
    selectRule() {
      let ids = []
      let num = this.formatPrice(100 - this.dataTable.reduce((t, c) => +t + +c.weights, 0))
      let weights = this.dataTable.length == 0 ? 100 : num >= 0 ? num : 0
      this.dataTable.forEach(item => ids.push(item.id))
      let id = ids.sort((a,b) => a-b)[ids.length - 1] || 0
      if (ids.includes(id)) id = parseInt(id) + 1
      this.dataTable.push({id: id+"cancel", weights, tipsFlag: 1, scoreRules: []})
    },
    typeChange(v) {
      this.typeFlag = v
      this.fieldName = undefined
    },
    handleNotation(record, v) {
      if (record.fieldType == "numericalValue" && this.typeFlag == 'calculate') {
        let compareValue = this.deepClone(v.fieldName)
        if (this.dataTable.some(item => item.fieldName == compareValue + (this.fieldName || ""))) {
          this.$message.error("已存在相同选项<" + compareValue + (this.fieldName || "") + '>',4)
          return
        }
        record.fieldName?.push(v)
        record.fieldCode = record.fieldCode + "" + v
        this.$forceUpdate()
      } else {
        this.$message.error("数值类选项才能加运算符")
      }
    },
    handleNumber(v) {
      if (v.fieldType == "numericalValue" && this.typeFlag == "number") {
        let compareValue = this.deepClone(v.fieldName)
        if (this.dataTable.some(item => item.fieldName == compareValue + (this.fieldName || ""))) {
          this.$message.error("已存在相同选项<" + compareValue + (this.fieldName || "") + '>',4)
          return
        }
        v.fieldName?.push(this.fieldName)
        v.fieldCode = v.fieldCode + (this.fieldName || "")
        this.fieldName = undefined
        this.$forceUpdate()
      } else {
        this.$message.error("只有数值类选项才能使用数字")
      }
    },
    handleOptionSelect(v) {
      if (this.typeFlag == "field") {
        this.option.optionMsg.find(item => {
          if (item.id == this.fieldFieldName && item.fieldType == "dropDown") {
            let obj = this.option.optionMsg.find(val => val.id == this.fieldFieldName) || {}
            if (this.dataTable.some(item => item.fieldName == obj.fieldName)) {
              this.$message.error("已存在相同选项<" + obj.fieldName + ">",4)
              return
            }
            let op = []
            v.fieldName = [obj.fieldName]
            v.fieldCode = obj.fieldCode
            v.fieldType = obj.fieldType
            obj.options.forEach(rule => op.push({rule}))
            v.scoreRules = op
            this.fieldFieldName = undefined
            delete v.tipsFlag
            this.$forceUpdate()
            return !0
          } else if (item.id == this.fieldFieldName && item.fieldType == "numericalValue") {
            let obj = this.option.optionMsg.find(val => val.id == this.fieldFieldName) || {}
            if (v.fieldType?.includes("dropDown") || v.fieldType?.includes("appendix")) {
              if (this.dataTable.some(item => item.fieldName == obj.fieldName)) {
                this.$message.error("已存在相同选项<" + obj.fieldName + ">",4)
                return
              }
              v.fieldName = [obj.fieldName]
              v.fieldCode = obj.fieldName
              v.ruleType = 1
            } else {
              let compareValue = this.deepClone(v.fieldName) || ''
              if (this.dataTable.some(item => item.fieldName == compareValue + (obj.fieldName || ""))) {
                this.$message.error("已存在相同选项<" + compareValue + (obj.fieldName || "") + ">",4)
                return
              }
              !v.fieldName && (v.fieldName = [])
              v.fieldName?.push(obj.fieldName)
              v.ruleType = 1
              v.fieldCode = (v.fieldCode || "") + obj.fieldName
            }
            v.fieldType = obj.fieldType
            v.scoreRules = [{},{}]
            this.fieldFieldName = undefined
            delete v.tipsFlag
            this.$forceUpdate()
            return !0
          } else if (item.id == this.fieldFieldName && item.fieldType == "appendix") {
            let obj = this.option.optionMsg.find(val => val.id == this.fieldFieldName) || {}
            if (this.dataTable.some(item => item.fieldName == obj.fieldName)) {
              this.$message.error("已存在相同选项<" + obj.fieldName + ">",4)
              return
            }
            v.fieldName = [obj.fieldName]
            v.fieldCode = obj.fieldCode
            v.fieldType = obj.fieldType
            v.scoreRules = []
            if (item.fieldType == 'appendix') {
              v.scoreRules = [{rule: "无附件"},{rule: "有附件"}]
            }
            this.fieldFieldName = undefined
            delete v.tipsFlag
            this.$forceUpdate()
            return !0
          }
        })
      }
    },
    textareaClearAll(v,c) {
      if (v.target.value.length == 0) {
        c.fieldType = undefined
        c.scoreRules = undefined
        this.$forceUpdate
      }
    },
    addSubItem(item, i) {
      if (item.length > 3) {
        if (item.some((val, j) => {
          if (j > 0 && (j+1) != item.length && (+val.variable || 0) <= (+item[j-1]?.variable || 0)) {
            this.$message.error("值区间输入框的输入值必须比前一项大")
            return !0
          }
        })) return
      }
      this.typeis(item) == "array" && item.splice(--i, 0, {rule: ''})
      this.$forceUpdate()
    },
    deleteSubItem(item, i) {
      this.typeis(item) == "array" && item.splice(i, 1)
      this.$forceUpdate()
    },
    deleteItem(id, index) {
      this.dataTable.splice(index,1)
    },
    openModal(record) {
      this.dropDownList()
      // this.list2()
      this.fieldName = undefined
      this.typeFlag = 'field'
      this.pageFlag = record == "add" ? record : undefined
      this.form = {}
      this.dataTable = []
      this.allMsg = {}
      if (record != 'add') {
        let scoreRuleList = []
        this.allMsg = record
        this.form.modelName = record.modelName
        this.form.dateOrDay = record.dateOrDay
        this.form.scoreObject = record.scoreObject + "" || undefined
        this.form.scoreCycle = record.scoreCycle
        this.form.detailedSort = record.detailedSort?.split(',')
        scoreRuleList = this.deepClone(record.scoreRuleList)
        scoreRuleList.forEach(item => {
          item.weights = (+item.weights || 0) * 100
          if (item.scoreRules[0]?.rule.includes("variable")) {
            item.scoreRules?.find(val => {
              if (val.rule.includes("variable")) {
                val.variable = val.rule.match(/(?<=variable<=)\d+/)?.[0]
              }
            })
          }
        })
        this.dataTable = scoreRuleList
        this.pageFlag = "update"
      }
      this.visibleLModal = true
    },
    deepClone(obj) {
      let objStorageBox = null
      if (typeof(obj) == 'object' && obj !== null)  {
        objStorageBox = obj instanceof Array ? [] : {}
        for (let i in obj) {
          objStorageBox[i] = this.deepClone(obj[i])
        }
      } else {
        objStorageBox = obj
      }
      return objStorageBox
    },
    save() {
      if (!this.form.modelName || !this.form.scoreObject || !this.form.scoreCycle || !this.form.dateOrDay || !this.form.detailedSort) {
        this.$message.error("请填写必填项")
        return
      }
      if (this.dataTable.length == 0) {
        this.$message.error("维度不能为空")
        return
      }
      if (this.dataTable.some(item => item.scoreRules?.some(val => {
        if (!val.score && val.scoreRules) return !0
      }))) {
        this.$message.error("表格存在必填项未填写")
        return
      }
      let weightRight = this.formatPrice(this.dataTable?.reduce((t, c) => t + (+c.weights || ~~c.weights), 0))
      if (weightRight != 100) {
        this.$message.error("权重之和应为100,当前为" + weightRight, 3.5)
        return
      }
      if (this.dataTable.some(item => {
        if (!item.fieldName) {
          this.$message.error("存在字段名称为空或其他无效值情况")
          return !0
        }
        if (item.scoreRules?.some(val => {
          if (!item.ruleType && (+val.score > 100 || +val.score < 0 || val.score === undefined || val.score === '')) {
            return !0
          }
        })) {
          this.$message.error('评分规则的每项评分都为0~100')
          return !0
        }
        if (this.typeis(item.scoreRules[0]?.variable) != 'undefined' && item.scoreRules?.length > 2 && item.scoreRules?.some((v, j) => {
          if(!item.ruleType && (v.variable && j > 0 && +v.variable < +item.scoreRules[j-1]?.variable)) return !0
        }) == true) {
          this.$message.error('评分规则的每一项值区间输入框的输入值必须比前一项大')
          return !0
        }
        if (item.scoreRules?.some((v,i) => {if (!item.ruleType && item.rule?.includes('variable') && i != item.scoreRules.length - 1 && (v.variable == undefined || v.variable == '')) {
          return !0
        }})) {
          this.$message.error('存在必填项未填写')
          return !0
        }
      })) return
      this.dataTable.forEach(val => {
        val.scoreRules?.some((v, p) => {
          let len = val.scoreRules?.length-1
          v.variable && p == 0 && (v.rule = "variable<="+v.variable)
          v.variable && p != 0 && p != len && (v.rule = val.scoreRules[p-1]?.variable+"<variable<="+v.variable)
          val.scoreRules[0].variable && p == len && (v.rule = val.scoreRules[p-1]?.variable+"<variable")
          if (p == len) {
            return !0
          }
        })
      })
      let scoreRuleList = this.deepClone(this.dataTable)
      scoreRuleList.forEach(item => item.weights = (+item.weights || 0) / 100)
      if (this.pageFlag == "update") {
        let findSameFieldCode = []
        let params = {
          ...this.allMsg,
          ...this.form,
          scoreRuleList
        }
        params.detailedSort = params.detailedSort?.join(',')
        scoreRuleList.forEach(item => {
          if (item.fieldType == "numericalValue") {
            item.fieldCode = item.fieldName.reduce((t, c) => t + c, '')
            findSameFieldCode.push(item.fieldCode)
          }
        })
        if ([...new Set(findSameFieldCode)].length != findSameFieldCode.length) {
          this.$message.error("计算类字段名称存在相同的")
          return
        }
        params.scoreRuleList.forEach(can => {
          if ((""+can.id)?.includes('cancel')) {
            delete can.id
          }
        })
        update(params).then(res => {
          if (res.data.code == 200) {
            this.visibleLModal = false
            this.$parent.pagination.page = 1
            this.$parent.submitPagination()
            this.$message.success(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }
        })
      } else {
        let findSameFieldCode = []
        let params = {
          ...this.allMsg,
          ...this.form,
          scoreRuleList
        }
        params.detailedSort = params.detailedSort?.join(',')
        scoreRuleList.forEach(item => {
          if (item.fieldType == "numericalValue") {
            item.fieldCode = item.fieldName.reduce((t, c) => t + c, '')
            findSameFieldCode.push(item.fieldCode)
          }
        })
        params.scoreRuleList.forEach(item => delete item.id)
        if ([...new Set(findSameFieldCode)].length != findSameFieldCode.length) {
          this.$message.error("计算类字段名称存在相同的")
          return
        }
        insert(params).then(res => {
          if (res.data.code == 200) {
            this.visibleLModal = false
            this.$parent.pagination.page = 1
            this.$parent.submitPagination()
            this.$message.success(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }
        })
      }
    },
    closeModalBtn() { this.visibleLModal = false },
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
    .rowMargin {
      margin: 20px 0;
      .paddingleft {
        padding-left: 16px;
        .selectWidth {
          width: 100%;
        }
      }
    }
    .tableStyle {
      max-height: 1600px;
      overflow: auto;
      .marginBottom {
        margin-bottom: 4px;
      }
      .widthStyle {
        width: 100%;
      }
      .inputWidth {
        width: 90%;
      }
      .inputstyle {
        width: 60%;
      }
      .textPosition {
        text-align: right;
        padding-right: 10px;
      }
      .inputstyleHalf {
        width: 130px;
      }
      .whiteFont {
        color: transparent;
      }
      .marginRight {
        margin-right: 33px;
      }
      .autoHeight {
        max-height: 600px;
        overflow: auto;
        .switchStyle {
          margin-bottom: 4px;
          width: 152px;
          border-radius: 20px;
          background: #4DA125;
          border: 1px solid #4DA125;
          color: white;
          text-align: center;
          .switchLeft {
            float: left;
          }
          .switchBtn {
            width: 74px;
            height: 32px;
            line-height: 32px;
          }
          .switchBtnActive {
            border: 1px solid #4DA125;
            border-radius: 20px;
            background: white;
            color: black;
          }
        }
      }
    }
    .borderBottom {
      margin: 0;
      padding-bottom: 16px;
      border-bottom: @border-color;
    }
    .heightTop {
      margin-top: 10px;
      .marginLeft {
        margin-left: 16px;
      }
    }
    .paginationContainer{
      margin: 0;padding: 10px 8px 10px 0;
    }
  }
}
</style>