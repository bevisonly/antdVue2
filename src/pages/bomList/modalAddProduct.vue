<template>
  <a-modal class="modalTop" :width='1200' :title="infoBox.flag == 'add' ? '新增BOM' : '编辑BOM'" :dialogStyle="{'top': '30px'}" v-model="visibleLModal" :footer="null">
    <div class="modalContainer">
      <div class="topBox">
        <div class="topTittle">加工商品信息</div>
        <a-row class="marginLeftRow">
          <a-col class="colStyle" :span="8">
            <span class="floatLeft">加工商品</span>
            <a-select
              style="width: 76%;"
              show-search
              :value="form.valueProductId"
              placeholder="请输入选择商品名称"
              :default-active-first-option="false"
              :show-arrow="false"
              :filter-option="false"
              :not-found-content="null"
              @search="handleProductSearch"
              @change="handleProductOption"
            >
              <a-select-option v-for="item in productOption" :key="item.id">
                {{ item.itemName }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col class="colStyle" :span="6">
            <span class="floatLeft">商品编码</span> <a-input style="width: 76%" placeholder="商品编码" disabled v-model="form.processItemCode"></a-input>
          </a-col>
          <a-col class="colStyle" :span="6">
            <span class="floatLeft">规格</span>
            <a-select
              style="width: 76%;"
              show-search
              :value="form.processItemSpec"
              :placeholder="specListOption.length == 0 ? '此加工商品没有规格可选择' : '请选择规格'"
              :disabled="specListOption.length == 0"
              :default-active-first-option="false"
              :show-arrow="false"
              :filter-option="false"
              :not-found-content="null"
              @change="handleSpecNameOption"
            >
              <a-select-option v-for="item in specListOption" :key="item.id" :value="item.specName">
                {{ item.specName }}
              </a-select-option>
            </a-select>
          </a-col>
        </a-row>
      </div>
      <div class="topBox">
        <div class="topTittle">组成商品</div>
        <a-row class="marginLeftRow">
          <a-col class="colStyle" :span="8">
            <span class="floatLeft">组成商品</span>
            <a-select
              style="width: 76%;"
              show-search
              :value="subForm.productValue"
              placeholder="请输入选择商品名称"
              :default-active-first-option="false"
              :show-arrow="false"
              :filter-option="false"
              :not-found-content="null"
              @search="handleSubProductSearch"
              @change="handleSubProductOption"
            >
              <a-select-option v-for="item in subProductOption" :key="item.id">
                {{ item.itemName }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col class="colStyle" :span="6">
            <span class="floatLeft">数量</span> <a-input style="width: 80%" placeholder="请输入商品数量" v-LimitInputNumber="subForm.num" v-model="subForm.num"></a-input>
          </a-col>
          <a-col class="colBtn" :span="6">
            <a-button type="primary" @click="addCommodity">添加</a-button>
          </a-col>
        </a-row>
        <a-table
          bordered
          ref="tableRef"
          :data-source="itemTable"
          rowKey="id"
          :pagination='false'
          :scroll="{ x: 307.778 }"
        >
          <a-table-column key="itemName" title="商品名称" data-index="itemName" :width="350" >
            <template slot-scope="text, record">
              <div v-if="flagEdit">
                <a-select
                  v-model="record.itemName"
                  placeholder="必填"
                  style="width: 100%"
                  @change="() => handleChange(record.itemName, record.key, 'itemName', record.id)">
                  <a-select-option v-for="(item,i) in subProductOption" :key="i" :value="item.itemName + '+'+ item.id + '+' + item.itemCode">
                    {{ item.itemName }}
                  </a-select-option>
                </a-select>
              </div>
              <span v-else>{{ record.itemName }}</span>
            </template>
          </a-table-column>
          <a-table-column key="itemCode" title="商品编码" data-index="itemCode" :width="180"/>
          <a-table-column key="compositionNumber" :title="compositionNumberIcon" data-index="compositionNumber" :width="150">
            <template slot-scope="text, record">
              <a-input
                v-model="record.compositionNumber"
                placeholder=""
                @change="() => handleChange(record.compositionNumber, record.key, 'compositionNumber', record.id)"/>
                <p class="redfont fontCenter" v-show="record.compositionNumber > 0 ? false : true">数字应大于0</p>
            </template>
          </a-table-column>
          <a-table-column key="itemUnit" :title="itemUnitIcon" data-index="itemUnit" :width="130">
            <template slot-scope="text, record">
              <div :key="record.itemUnit">
                <a-select
                  v-model="record.itemUnit"
                  placeholder="必填"
                  style="width: 100%"
                  @change="() => handleChange(record.itemUnit, record.key, 'itemUnit', record.id)">
                  <a-select-option v-for="(item,i) in unitOption" :key="i" :value="item.dicText">
                    {{ item.dicText }}
                  </a-select-option>
                </a-select>
              </div>
            </template>
          </a-table-column>
          <a-table-column key="type" :title="typeIcon" data-index="type" :width="209">
            <template slot-scope="text, record">
              <div :key="record.type">
                <a-select
                  v-model="record.type"
                  placeholder="必填"
                  style="width: 100%"
                  @change="() => handleChange(record.type, record.key, 'type', record.id)">
                  <a-select-option :value="0"> 主料 </a-select-option>
                  <a-select-option :value="1"> 辅料 </a-select-option>
                  <a-select-option :value="2"> 包材 </a-select-option>
                </a-select>
              </div>
            </template>
          </a-table-column>
          <a-table-column key="remark" title="备注" data-index="remark" :width="400">
            <template slot-scope="text, record">
              <a-input
                v-model="record.remark"
                placeholder=""
                @change="() => handleChange(record.remark, record.key, 'remark', record.id)"/>
            </template>
          </a-table-column>
          <a-table-column key="operation" title="操作" fixed='right' data-index="operation" :width="140" align='center' >
            <template slot-scope="text, record">
              <a-button v-if="infoBox.flag == 'edit' ? true : false" class="greenfont bluefonthover" type="link" icon='edit' @click="editBtn">编辑</a-button>
              <a-popconfirm placement="bottom" title="确定删除吗？" ok-text="确定" cancel-text="取消" @confirm="deleteItem(record.id, record.flag)">
                <a-icon slot="icon" type="question-circle" style="color: red" />
                <a-button class="greenfont redfonthover" type="link" icon='minus-circle'>删除</a-button>
              </a-popconfirm>
            </template>
          </a-table-column>
        </a-table>
        <div class="heightDiv flex-ed">
          <a-button type="primary" @click="cancleBtn">取消</a-button>
          <a-button class="marginLeft" type="primary" @click="okBtn">{{infoBox.flag == 'add' ? "确认" : "保存"}}</a-button>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import {
  commodityName,
  bomUpdate,
  bomInsert,
  UnitList
} from '@/services/bomList.js'
import { throttle } from "../../utils/tool";
export default {
  name: "modalAddProduct",
  data() {
    return {
      compositionNumberIcon: () => {return <span class='redfont'>* <span class="greyfont">组成数量</span></span>},
      itemUnitIcon: () => {return <span class='redfont'>* <span class="greyfont">单位</span></span>},
      typeIcon: () => {return <span class='redfont'>* <span class="greyfont">主辅料</span></span>},
      visibleLModal: false,
      productOption: [],
      subProductOption: [],
      unitOption: [],
      specListOption: [],
      productMaterial: undefined,
      subProductMaterial: undefined,
      form: {
        valueProductId: undefined,
        processItemId: undefined,
        processItemName: undefined,
        processItemCode: undefined,
        processItemSpec: undefined,
      },
      subForm: {
        productValue: undefined,
        num: undefined
      },
      infoBox: {
        flag: undefined,
        id: undefined,
        allMsg: undefined
      },
      itemTable: [],
      deleteDate: [],
      flagEdit: false
    }
  },
  methods: {
    openModal(flag, id, allMsg) {
      this.flagEdit =  false
      this.infoBox.flag = flag
      this.deleteDate = []
      this.infoBox.id = id
      this.subForm.num = undefined
      this.subForm.productValue = undefined
      if (flag == 'edit') {
        this.form.valueProductId = allMsg.processItemName
        this.form.processItemId = allMsg.processItemId
        this.form.processItemName = allMsg.processItemName
        this.form.processItemCode = allMsg.processItemCode
        this.form.processItemSpec = allMsg.processItemSpec
        this.infoBox.allMsg = allMsg
        allMsg.bomDetails.map(item => item.flag = '2')
        this.itemTable = this.$parent.deepClone(allMsg.bomDetails)
        this.itemTable.map(item => {
          item.id = item.id.split('_')[1]
          item.type = item.typeCopy
          delete item.reId
          delete item.typeCopy
          delete item.processItemName
          delete item.processItemCode
        })
      } else {
        this.itemTable = []
        this.form.valueProductId = undefined
        this.form.processItemId = undefined
        this.form.processItemName = undefined
        this.form.processItemCode = undefined
        this.form.processItemSpec = undefined
      }
      this.visibleLModal = true
    },
    productInfo2() {
      commodityName({likeItemName: '', itemFlag: '2'}).then(res => res.data.code == '200' && (this.productOption = res.data.data))
    },
    productInfo1() {
      commodityName({likeItemName: '', itemFlag: '4'}).then(res => res.data.code == '200' && (this.subProductOption = res.data.data))
    },
    getUnit() {
      UnitList({type: 10}).then(res => res.data.code == '200' && (this.unitOption = res.data.data))
    },
    handleProductSearch(value) {
      commodityName({likeItemName: value, itemFlag: '2'}).then(res => res.data.code == '200' && (this.productOption = res.data.data))
    },
    handleProductOption(value) {
      this.form.valueProductId = value
      this.productMaterial = this.productOption.find( item => { return item.id == value } )
      this.form.processItemId = this.productMaterial.id
      this.form.processItemName = this.productMaterial.itemName
      this.form.processItemCode = this.productMaterial.itemCode
      this.form.processItemSpec = this.productMaterial.spec === "" ? undefined : this.productMaterial.spec
      this.specListOption = this.productMaterial?.specList || []
    },
    handleSubProductSearch(value) {
      commodityName({itemName: value, itemFlag: '4'}).then(res => res.data.code == '200' && (this.subProductOption = res.data.data))
    },
    handleSubProductOption(value) {
      this.subForm.productValue = value
      this.subProductMaterial = this.subProductOption.find(item => item.id == value )
    },
    handleSpecNameOption(value) { this.form.processItemSpec = value },
    addCommodity() {
      let commodity = {
        id: this.subProductMaterial?.id,
        flag: '1',
        itemId: this.subProductMaterial?.id,
        itemName: this.subProductMaterial?.itemName,
        itemCode: this.subProductMaterial?.itemCode,
        compositionNumber: this.subForm.num,
        type: undefined,
        itemUnit: this.subProductMaterial?.defUom,
        remark: ''
      }
      if (commodity.itemName === undefined) {
        this.$message.warn('请先选择商品')
        return
      }
      for (let i = 0; i < this.itemTable.length; i++) {
        if (this.itemTable[i].itemName == commodity.itemName) {
          this.$message.warn('该商品已存在...')
          return
        }
      }
      this.itemTable.push(commodity)
      this.subForm.productValue = undefined
      this.subProductMaterial = undefined
      this.subForm.num = undefined
    },
    editBtn() {
      this.flagEdit = !this.flagEdit
    },
    deleteItem(id, flag) {
      this.itemTable.some(
        (item,i) => {
          if (flag == '1' && item.id == id) {
            return this.itemTable.splice(i,1)
          } else if (item.id == id) {
            item.flag = '3'
            this.deleteDate.push(item)
            return this.itemTable.splice(i,1)
          }
        }
      )
    },
    handleChange(value, key, column, id=0) {
      if (column == 'compositionNumber') {
        value = value.replace(/[^\d\\.]/g,'')
        if (value.indexOf('.') != value.lastIndexOf('.')) {
          value = value.slice(0,value.lastIndexOf('.'))
        }
        //保留两位小数
        // if (value.indexOf('.')) {
        //   value = value.slice(0,value.indexOf('.')+3)
        // }
      }
      let keyId = id
      this.itemTable.find((item,i) => {
        if (item.id == id) {
          keyId = i
        }
      })
      const newData = [...this.itemTable]
      const target = newData.filter(item => key === item.key)[keyId]
      if (target) {
        target[column] = String(value).includes('+') ? value.split('+')[0] : value
        if (String(value).includes('+')) {
          target.itemId = value.split('+')[1]
          target.itemCode = value.split('+')[2]
        }
        this.itemTable = newData
      }
    },
    cancelModalBtn() {
      this.visibleLModal = false;
    },
    submitThrottle: throttle(function() {
      if ( this.itemTable.some(item => {return item.itemUnit == undefined || item.type == undefined}) ) {
        this.$message.warn('单位,主辅料为必填项...')
        return
      }
      if ( this.itemTable.some(item => {return item.compositionNumber == undefined || item.compositionNumber < 0 || item.compositionNumber == ''})) {
        this.$message.warn('请检查数量')
        return
      }
      if (this.infoBox.flag == 'add') {
        if (this.form.processItemName == undefined) {
          this.$message.warn('加工商品必填项...')
          return
        }
        const params = {
          processItemId: this.form.processItemId,
          processItemName: this.form.processItemName,
          processItemCode: this.form.processItemCode,
          processItemSpec: this.form.processItemSpec,
          bomDetails: this.itemTable
        }
        bomInsert(params).then(
          res => {
            if (res.data.code == 200) {
              this.$parent.pagination.page = 1
              this.$parent.pagination.size = 10
              this.$parent.submitPagination()
              this.$message.success(res.data.message)
              this.visibleLModal = false
            } else {
              this.$message.warn(res.data.message)
            }
          }
        )
      } else {
        const params = {
          id : this.infoBox.id,
          processItemId: this.form.processItemId,
          processItemName: this.form.processItemName,
          processItemCode: this.form.processItemCode,
          processItemSpec: this.form.processItemSpec,
          bomDetails: this.itemTable.concat(this.deleteDate)
        }
        bomUpdate(params).then(
          res => {
            if (res.data.code == 200) {
              this.$parent.submitPagination()
              this.$message.success(res.data.message)
              this.visibleLModal = false
            } else {
              this.$message.warn(res.data.message)
            }
          }
        )
      }
    },3500),
    okBtn() {
      this.submitThrottle()
    },
    cancleBtn() {
      this.visibleLModal = false
    }
  },
  activated() {
    this.getUnit()
    this.productInfo1()
    this.productInfo2()
  },
}
</script>

<style lang="less" scoped>
@import '../../assets/css/commonless';
.modalTop{
  /deep/ .ant-modal-body{
    padding-top: 0;
  }
  /deep/ .ant-modal-header{
    border: 0;
  }
  /deep/ .ant-modal-body {
    padding-bottom: 15px;
  }
  .modalContainer {
    margin-bottom: 10px;
    .ant-btn-link{
      margin: 0;padding: 0px 4px;
    }
    /deep/.ant-btn > .anticon + span {
      margin-left: 0;
    }
    .topBox {
      margin-bottom: 10px;
      border: @border-color;
      .topTittle {
        margin: 0;
        padding-left: 15px;
        height: 40px;
        line-height: 40px;
        border-bottom: @border-color;
        background-color: @common-bgc;
        letter-spacing: 1px;
        font-size: 14px;
        font-weight: 800;
      }
      .marginLeftRow {
        .colStyle {
          padding-left: 15px;
          height: 46px;
          line-height: 46px;
          .floatLeft {
            float: left;
            margin-right: 8px;
          }
        }
        .colBtn {
          height: 46px;
          line-height: 46px;
        }
      }
      .fontCenter {
        text-align: center;
        height: 4px;
        margin-bottom: 0;
      }
    }
    .heightDiv {
      height: 46px;
      line-height: 46px;
      .marginLeft {
        margin: 0 15px;
      }
    }
  }
}
</style>