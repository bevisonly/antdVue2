<template>
  <div class="finalTop">
    <div class="topContainer">
      <div class="borderStyle" v-show="fullscreenSwitch">
        <p class="topQuery">
          筛选查询 <a-icon type="search" />
        </p>
        <div class="formContainer">
          <a-form-model ref="searchForm" :model="searchForm" layout="vertical">
            <a-row>
              <a-col :span="24">
                <a-form-model-item class="floatLeft" label="日期">
                  <a-date-picker
                    v-model="searchForm.businessOccurrenceDateStart"
                    show-time
                    type="date"
                    allowClear
                    placeholder="开始日期"
                  />
                  至
                  <a-date-picker
                    class="datePicker"
                    v-model="searchForm.businessOccurrenceDateEnd"
                    show-time
                    type="date"
                    allowClear
                    placeholder="截至日期"
                  />
                </a-form-model-item>
                <a-form-model-item class="floatLeft" label="供应商名称">
                  <a-select
                    style="width: 300px"
                    show-search
                    :value="valueSupplierOption"
                    placeholder="请搜索选择供应商"
                    :default-active-first-option="false"
                    :show-arrow="false"
                    :filter-option="false"
                    :not-found-content="null"
                    allowClear
                    @search="handleSupplierSearch"
                    @change="handleChangeSupplierOption"
                  >
                    <a-select-option v-for="item in supplierOption" :key="item.id">
                      {{ item.partnerName }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item class="floatLeft forBorder" label="客户查询">
                  <a-select
                    style="width: 300px"
                    show-search
                    :value="valueCustomerOption"
                    placeholder="请搜索选择供应商"
                    :default-active-first-option="false"
                    :show-arrow="false"
                    :filter-option="false"
                    :not-found-content="null"
                    allowClear
                    @search="handleCustomerSearch"
                    @change="handleChangeCustomerOption"
                  >
                    <a-select-option v-for="item in customerOption" :key="item.id">
                      {{ item.partnerName }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item class="floatLeft"  label="核实状态">
                  <a-select style="width: 130px" placeholder="核实状态选择" v-model="searchForm.ifTrans">
                  <a-select-option value='-1'>{{'全部'}}</a-select-option>
                  <a-select-option value='0'>{{'待核实'}}</a-select-option>
                  <a-select-option value='1'>{{'已核实'}}</a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item class="floatLeft onlyForBorderRadius" label="门店查询">
                  <a-select
                    v-if="modeInput"
                    style="width: 307.778px;"
                    show-search
                    :value="valueStoreOption"
                    placeholder="请搜索选择门店"
                    :default-active-first-option="false"
                    :show-arrow="false"
                    :filter-option="false"
                    :not-found-content="null"
                    allowClear
                    @search="handleStoreSearch"
                    @change="handleChangeStoreOption"
                  >
                    <a-select-option v-for="item in storeOption" :key="item.id">
                      {{ item.partnerName }}
                    </a-select-option>
                  </a-select>
                  <a-input
                    v-else
                    v-model="customerName"
                    placeholder="自定义输入客户"
                    style="width: 307.778px; margin-left: 15px;"
                  >
                  </a-input>
                  <a-button
                    class="buttonStyle cursorPin"
                    type="primary"
                    icon="swap"
                    title="自定义或下拉选择"
                    @click="modeChange"
                  >
                    {{ modeInput ? "选择模式": "自定义模式" }}
                  </a-button>
                  <a-button class="ant-button" type="primary" @click="resetSearch">
                    清空
                  </a-button>
                  <a-button
                    class="ant-button"
                    type="primary"
                    @click="onSubmit(1)"
                  >
                    查询
                  </a-button>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
      </div>
      <div class="tableContainer" :class="fullscreenSwitch ? '' : 'borderNone'">
        <div class="topButton flex-sb">
          <a-button-group>
            <a-button type="primary" title="下载Excel模板文件" :loading="templateExportLoading" @click="templateDownload">
              下载模板
            </a-button>
            <a-upload
              :show-upload-list="false"
              accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              :beforeUpload="beforeUpload"
            >
              <a-button type="primary">上传文件</a-button>
            </a-upload>
            <a-button
              type="primary"
              title="导出查询的excel表"
              :loading="conditionExportLoading"
              @click="conditionDownload"
            >
              导出
            </a-button>
            <a-button type="primary" title="批量核实待核实" :loading="checkLoading" @click="batchCheck">
              批量核实
            </a-button>
          </a-button-group>
          <a-button-group class="a-button-group">
            <a-button
              class="a-button"
              type="primary"
              icon="sync"
              title="刷新数据"
              @click="reloadTable"
            ></a-button>
            <a-button
              class="a-button"
              type="primary"
              icon="fullscreen"
              title="全屏"
              @click="switchFullscreen"
            ></a-button>
            <a-button
              class="a-button"
              type="primary"
              icon="bars"
              title="展示列"
              @click="openSelectColumnPopover"
            >
              <a-popover
                v-model="visibleSelectColumnPopover"
                placement="bottomRight"
              >
                <template slot="title">
                  <span class="bluefont">隐藏/显示</span>
                </template>
                <template slot="content">
                  <a-checkbox-group @change="onChangeChecked">
                    <a-row style="min-width: 530px">
                      <a-col :span="5">
                        <a-checkbox
                          class="paintfonthover"
                          value="supplier"
                          :disabled="disabledFlage == 'supplier'"
                          >供应商</a-checkbox
                        >
                      </a-col>
                      <a-col :span="5">
                        <a-checkbox
                          class="paintfonthover"
                          value="companyName"
                          :disabled="disabledFlage == 'companyName'"
                          >我司名称</a-checkbox
                        >
                      </a-col>
                      <a-col :span="5">
                        <a-checkbox
                          class="paintfonthover"
                          value="customerName"
                          :disabled="disabledFlage == 'customerName'"
                          >客户名称</a-checkbox
                        >
                      </a-col>
                      <a-col :span="9">
                        <a-checkbox
                          class="paintfonthover"
                          value="businessOccurrenceDate"
                          :disabled="disabledFlage == 'businessOccurrenceDate'"
                          >业务发生日期</a-checkbox
                        >
                      </a-col>
                    </a-row>
                    <a-row>
                      <a-col :span="5">
                        <a-checkbox
                          class="paintfonthover"
                          value="supplierGoodsName"
                          :disabled="disabledFlage == 'supplierGoodsName'"
                          >商品名称</a-checkbox
                        >
                      </a-col>
                      <a-col :span="5">
                        <a-checkbox
                          class="paintfonthover"
                          value="specifications"
                          :disabled="disabledFlage == 'specifications'"
                          >规格</a-checkbox
                        >
                      </a-col>
                      <a-col :span="5">
                        <a-checkbox
                          class="paintfonthover"
                          value="valuationUnit"
                          :disabled="disabledFlage == 'valuationUnit'"
                          >单位</a-checkbox
                        >
                      </a-col>
                      <a-col :span="9">
                        <a-checkbox
                          class="paintfonthover"
                          value="quantity"
                          :disabled="disabledFlage == 'quantity'"
                          >数量</a-checkbox
                        >
                      </a-col>
                    </a-row>
                    <a-row>
                      <a-col :span="5">
                        <a-checkbox
                          class="paintfonthover"
                          value="purchaseUnitPrice"
                          :disabled="disabledFlage == 'purchaseUnitPrice'"
                          >采购单价</a-checkbox
                        >
                      </a-col>
                      <a-col :span="5">
                        <a-checkbox
                          class="paintfonthover"
                          value="purchaseAmount"
                          :disabled="disabledFlage == 'purchaseAmount'"
                          >采购金额</a-checkbox
                        >
                      </a-col>
                      <a-col :span="5">
                        <a-checkbox
                          class="paintfonthover"
                          value="reconciliationDate"
                          :disabled="disabledFlage == 'reconciliationDate'"
                          >对账日期</a-checkbox
                        >
                      </a-col>
                      <a-col :span="9">
                        <a-checkbox
                          class="paintfonthover"
                          value="billingDate"
                          :disabled="disabledFlage == 'billingDate'"
                          >开票日期</a-checkbox
                        >
                      </a-col>
                    </a-row>
                    <a-row>
                      <a-col :span="5">
                        <a-checkbox
                          class="paintfonthover"
                          value="voucherNo"
                          :disabled="disabledFlage == 'voucherNo'"
                          >发票号</a-checkbox
                        >
                      </a-col>
                      <a-col :span="5">
                        <a-checkbox
                          class="paintfonthover"
                          value="invoiceAmount"
                          :disabled="disabledFlage == 'invoiceAmount'"
                          >发票金额</a-checkbox
                        >
                      </a-col>
                      <a-col :span="5">
                        <a-checkbox
                          class="paintfonthover"
                          value="costAmount"
                          :disabled="disabledFlage == 'costAmount'"
                          >成本金额</a-checkbox
                        >
                      </a-col>
                      <a-col :span="9">
                        <a-checkbox
                          class="paintfonthover"
                          value="carryForwardCostVoucher"
                          :disabled="disabledFlage == 'carryForwardCostVoucher'"
                          >结转成本凭证</a-checkbox
                        >
                      </a-col>
                    </a-row>
                    <a-row>
                      <a-col :span="5">
                        <a-checkbox
                          class="paintfonthover"
                          value="settlementDate"
                          :disabled="disabledFlage == 'settlementDate'"
                          >结算日期</a-checkbox
                        >
                      </a-col>
                      <a-col :span="5">
                        <a-checkbox
                          class="paintfonthover"
                          value="settlementAmount"
                          :disabled="disabledFlage == 'settlementAmount'"
                          >结算金额</a-checkbox
                        >
                      </a-col>
                      <a-col :span="5">
                        <a-checkbox
                          class="paintfonthover"
                          value="salesAmount"
                          :disabled="disabledFlage == 'salesAmount'"
                          >销售金额</a-checkbox
                        >
                      </a-col>
                      <a-col :span="9">
                        <a-checkbox
                          class="paintfonthover"
                          value="salesAmountAfterDeductingLosses"
                          :disabled="disabledFlage == 'salesAmountAfterDeductingLosses'"
                          >扣除损耗后销售金额(6.5%)</a-checkbox
                        >
                      </a-col>
                    </a-row>
                    <a-row>
                      <a-col :span="5">
                        <a-checkbox
                          class="paintfonthover"
                          value="income"
                          :disabled="disabledFlage == 'income'"
                          >收入</a-checkbox
                        >
                      </a-col>
                      <a-col :span="5">
                        <a-checkbox
                          class="paintfonthover"
                          value="cusReconciliationDate"
                          :disabled="disabledFlage == 'cusReconciliationDate'"
                          >对账日期*客</a-checkbox
                        >
                      </a-col>
                      <a-col :span="5">
                        <a-checkbox
                          class="paintfonthover"
                          value="cusBillingDate"
                          :disabled="disabledFlage == 'cusBillingDate'"
                          >开票日期*客</a-checkbox
                        >
                      </a-col>
                      <a-col :span="9">
                        <a-checkbox
                          class="paintfonthover"
                          value="collectionDate"
                          :disabled="disabledFlage == 'collectionDate'"
                          >回款日期</a-checkbox
                        >
                      </a-col>
                    </a-row>
                    <a-row>
                      <a-col :span="5">
                        <a-checkbox
                          class="paintfonthover"
                          value="collectionAmount"
                          :disabled="disabledFlage == 'collectionAmount'"
                          >回款金额</a-checkbox
                        >
                      </a-col>
                      <a-col :span="5">
                        <a-checkbox
                          class="paintfonthover"
                          value="storeName"
                          :disabled="disabledFlage == 'storeName'"
                          >门店名称</a-checkbox
                        >
                      </a-col>
                      <a-col :span="5">
                        <a-checkbox
                          class="paintfonthover"
                          value="salesUnitPrice"
                          :disabled="disabledFlage == 'salesUnitPrice'"
                          >销售单价</a-checkbox
                        >
                      </a-col>
                      <a-col :span="9">
                        <a-checkbox
                          class="paintfonthover"
                          value="ifTrans"
                          :disabled="disabledFlage == 'ifTrans'"
                          >核实</a-checkbox
                        >
                      </a-col>
                    </a-row>
                  </a-checkbox-group>
                </template>
              </a-popover>
            </a-button>
          </a-button-group>
        </div>
        <a-table
          style="margin: 10px 0 0 0"
          bordered
          ref="tableRef"
          :data-source="data"
          :loading='loading'
          :pagination="false"
          rowKey="id"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :scroll="{ x: 307.778 }"
        >
          <a-table-column v-if="vIf.supplier" key="supplier" title="供应商" data-index="supplier" :width="260" :sorter="(a, b) => a.supplier.length - b.supplier.length"/>
          <a-table-column v-if="vIf.companyName" key="companyName" title="我司名称" data-index="companyName" :width="260" :sorter="(a, b) => a.companyName.length - b.companyName.length"/>
          <a-table-column v-if="vIf.customerName" key="customerName" title="客户名称" data-index="customerName" :width="260" :sorter="(a, b) => a.customerName.length - b.customerName.length"/>
          <a-table-column v-if="vIf.storeName" key="storeName" title="门店名称" data-index="storeName" :width="260" :sorter="(a, b) => a.storeName.length - b.storeName.length"/>
          <a-table-column v-if="vIf.businessOccurrenceDate" key="businessOccurrenceDate" title="业务发生日期" data-index="businessOccurrenceDate" :width="140" :customRender="businessOccurrenceDate => {return moment(businessOccurrenceDate).format('YYYY-MM-DD')}" :sorter="(a, b) => new Date(a.businessOccurrenceDate).getTime() - new Date(b.businessOccurrenceDate).getTime()"/>
          <a-table-column v-if="vIf.supplierGoodsName" key="supplierGoodsName" title="商品名称" data-index="supplierGoodsName" :width="180" :sorter="(a, b) => a.supplierGoodsName.length - b.supplierGoodsName.length"/>
          <a-table-column v-if="vIf.specifications" key="specifications" title="规格" data-index="specifications" :width="90" :sorter="(a, b) => a.specifications.length - b.specifications.length"/>
          <a-table-column v-if="vIf.valuationUnit" key="valuationUnit" title="单位" data-index="valuationUnit" :width="100" :sorter="(a, b) => a.valuationUnit.length - b.valuationUnit.length"/>
          <a-table-column v-if="vIf.quantity" key="quantity" title="数量" data-index="quantity" :width="110" :sorter="(a, b) => a.quantity - b.quantity" />
          <a-table-column v-if="vIf.ifTrans" key="ifTrans" title="核实" data-index="ifTrans" :width="110" :sorter="(a, b) => a.ifTrans - b.ifTrans">
            <template slot-scope="text, record">
              <span v-if="record.ifTrans == 1" :class="record.ifTrans == 1 ? 'greenfont' : ''">已核实</span>
              <span v-else class="cursorPin redfonthover" @click="checkBtn(record.id,record.ifTrans)">待核实</span>
            </template>
          </a-table-column>
          <a-table-column-group  v-if="supplierCheckVIf">
            <span slot="title">供应商</span>
            <a-table-column v-if="vIf.purchaseUnitPrice" key="purchaseUnitPrice" title="采购单价" data-index="purchaseUnitPrice" :width="110" :customRender="purchaseUnitPrice => {return Number(purchaseUnitPrice).toFixed(8)*100000000/100000000}" :sorter="(a, b) => a.purchaseUnitPrice - b.purchaseUnitPrice"/>
            <a-table-column v-if="vIf.purchaseAmount" key="purchaseAmount" title="采购金额" data-index="purchaseAmount" :width="110" :customRender="purchaseAmount => {return Number(purchaseAmount).toFixed(8)*100000000/100000000 == 0.00 ? '': Number(purchaseAmount).toFixed(8)*100000000/100000000 }" :sorter="(a, b) => a.purchaseUnitPrice - b.purchaseUnitPrice"/>
            <a-table-column v-if="vIf.reconciliationDate" key="reconciliationDate" title="对账日期" data-index="reconciliationDate" :width="110" :customRender="reconciliationDate => {return moment(reconciliationDate).format('YYYY-MM-DD')}" :sorter="(a, b) => new Date(a.reconciliationDate).getTime() - new Date(b.reconciliationDate).getTime()"/>
            <a-table-column v-if="vIf.billingDate" key="billingDate" title="开票日期" data-index="billingDate" :width="110" :customRender="billingDate => {return moment(billingDate).format('YYYY-MM-DD')}" :sorter="(a, b) => new Date(a.billingDate).getTime() - new Date(b.billingDate).getTime()"/>
            <a-table-column v-if="vIf.voucherNo" key="voucherNo" title="发票号" data-index="voucherNo" :width="120" :sorter="(a, b) => a.voucherNo.length - b.voucherNo.length"/>
            <a-table-column v-if="vIf.invoiceAmount" key="invoiceAmount" title="发票金额" data-index="invoiceAmount" :width="110" :customRender="invoiceAmount => {return Number(invoiceAmount).toFixed(8)*100000000/100000000 == 0.00 ? '': Number(invoiceAmount).toFixed(8)*100000000/100000000 }" :sorter="(a, b) => a.invoiceAmount - b.invoiceAmount"/>
            <a-table-column v-if="vIf.costAmount" key="costAmount" title="成本金额" data-index="costAmount" :width="110" :customRender="costAmount => {return Number(costAmount).toFixed(8)*100000000/100000000 == 0.00 ? '': Number(costAmount).toFixed(8)*100000000/100000000 }" :sorter="(a, b) => a.costAmount - b.costAmount"/>
            <a-table-column v-if="vIf.carryForwardCostVoucher" key="carryForwardCostVoucher" title="结转成本凭证" data-index="carryForwardCostVoucher" :width="160" :sorter="(a, b) => a.carryForwardCostVoucher.length - b.carryForwardCostVoucher.length"/>
            <a-table-column v-if="vIf.settlementDate" key="settlementDate" title="结算日期" data-index="settlementDate" :width="110" :customRender="settlementDate => {return moment(settlementDate).format('YYYY-MM-DD')}" :sorter="(a, b) => new Date(a.settlementDate).getTime() - new Date(b.settlementDate).getTime()"/>
            <a-table-column v-if="vIf.settlementAmount" key="settlementAmount" title="结算金额" data-index="settlementAmount" :width="110" :customRender="settlementAmount => {return Number(settlementAmount).toFixed(8)*100000000/100000000 == 0.00 ? '': Number(settlementAmount).toFixed(8)*100000000/100000000 }" :sorter="(a, b) => a.settlementAmount - b.settlementAmount"/>
          </a-table-column-group>
          <a-table-column-group v-if="customerCheckVIf">
            <span slot="title">客户</span>
            <a-table-column v-if="vIf.salesUnitPrice" key="salesUnitPrice" title="销售单价" data-index="salesUnitPrice" :width="110" :customRender="salesUnitPrice => {return Number(salesUnitPrice).toFixed(8)*100000000/100000000}" :sorter="(a, b) => a.salesUnitPrice - b.salesUnitPrice"/>
            <a-table-column v-if="vIf.salesAmount" key="salesAmount" title="销售金额" data-index="salesAmount" :width="110"  :customRender="salesAmount => {return Number(salesAmount).toFixed(8)*100000000/100000000 == 0.00 ? '': Number(salesAmount).toFixed(8)*100000000/100000000 }" :sorter="(a, b) => a.salesAmount - b.salesAmount"/>
            <a-table-column v-if="vIf.salesAmountAfterDeductingLosses" key="salesAmountAfterDeductingLosses" title="扣除6.5%损耗后销售金额（发票金额）" data-index="salesAmountAfterDeductingLosses" :width="179" :customRender="salesAmountAfterDeductingLosses => {return Number(salesAmountAfterDeductingLosses).toFixed(8)*100000000/100000000 == 0.00 ? '': Number(salesAmountAfterDeductingLosses).toFixed(8)*100000000/100000000 }" :sorter="(a, b) => a.salesAmountAfterDeductingLosses - b.salesAmountAfterDeductingLosses"/>
            <a-table-column v-if="vIf.income" key="income" title="收入" data-index="income"  :width="110" :customRender="income => {return Number(income).toFixed(8)*100000000/100000000}" :sorter="(a, b) => a.income - b.income"/>
            <a-table-column v-if="vIf.cusReconciliationDate" key="cusReconciliationDate" title="对账日期" data-index="cusReconciliationDate" :width="110" :customRender="cusReconciliationDate => {return moment(cusReconciliationDate).format('YYYY-MM-DD')}" :sorter="(a, b) => new Date(a.cusReconciliationDate).getTime() - new Date(b.cusReconciliationDate).getTime()"/>
            <a-table-column v-if="vIf.cusBillingDate" key="cusBillingDate" title="开票日期" :customRender="cusBillingDate => {return moment(cusBillingDate).format('YYYY-MM-DD')}" data-index="cusBillingDate" :width="110" :sorter="(a, b) => new Date(a.cusBillingDate).getTime() - new Date(b.cusBillingDate).getTime()"/>
            <a-table-column v-if="vIf.collectionDate" key="collectionDate" title="回款日期" :customRender="collectionDate => {return moment(collectionDate).format('YYYY-MM-DD')}" data-index="collectionDate" :width="110" :sorter="(a, b) => new Date(a.collectionDate).getTime() - new Date(b.collectionDate).getTime()"/>
            <a-table-column v-if="vIf.collectionAmount" key="collectionAmount" title="回款金额" data-index="collectionAmount" :width="110" :customRender="collectionAmount => {return Number(collectionAmount).toFixed(8)*100000000/100000000 == 0.00 ? '': Number(collectionAmount).toFixed(8)*100000000/100000000 }" :sorter="(a, b) => a.collectionAmount - b.collectionAmount"/>
          </a-table-column-group>
          <a-table-column key="operation" title="操作" data-index="operation" :width="200" align='center' fixed='right'>
            <template slot-scope="text, record">
              <a-button type="link" @click="checkBtn(record.id,record.ifTrans)">核实</a-button>
              <a-popconfirm
                v-if="data.length"
                :title="record.soVoucher == 1 || record.poVoucher == 1 ? '已生成凭证！请与财务核实，是否将其删除?' : '确定删除吗'"
                @confirm="() => onDelete(record.id,record.ifTrans,record.soId,record.poId)"
              >
                <a-button type="link">删除</a-button>
              </a-popconfirm>
            </template>
          </a-table-column>
        </a-table>
        <div class="pagination-style flex-ed">
          <a-pagination
            show-size-changer
            :total="paginationTotal"
            :show-total="total => `共 ${total} 条`"
            v-model="currentPage"
            :pageSizeOptions="pageSizeOptions"
            @showSizeChange="onShowSizeChange"
            @change="onChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  reportFindList,
  reportDeleteById,
  reportImportExcel,
  reportTranToReceive,
  reportExportTemplate,
  reportExport
  } from "@/services/reportSettlementMa.js";
import { partnerType } from "@/services/userMa.js"
import moment from "moment";
import { throttle } from "../../utils/tool";
export default {
  name: "reportSettlement",
  data() {
    return {
      fullscreenSwitch: true,
      searchForm: {
        businessOccurrenceDateStart: "",
        businessOccurrenceDateEnd: "",
        ifTrans: "-1"
      },
      customerName: undefined,
      storeNameOption: [],
      customerNameOption: [],
      modeInput: true,
      defaultFileList: [],
      visibleSelectColumnPopover: false,
      disabledFlage: 0,
      data: [],
      vIf: {
        supplier: true,
        companyName: true,
        customerName: true,
        storeName: true,
        businessOccurrenceDate: true,
        supplierGoodsName: true,
        specifications: true,
        valuationUnit: true,
        quantity: true,
        purchaseUnitPrice: true,
        purchaseAmount: true,
        reconciliationDate: true,
        billingDate: true,
        voucherNo: true,
        invoiceAmount: true,
        costAmount: true,
        carryForwardCostVoucher: true,
        settlementDate: true,
        settlementAmount: true,
        salesUnitPrice: true,
        salesAmount: true,
        salesAmountAfterDeductingLosses: true,
        income: true,
        cusReconciliationDate: true,
        cusBillingDate: true,
        collectionDate: true,
        collectionAmount: true,
        ifTrans: true
      },
      supplierCheck: ['purchaseUnitPrice','purchaseAmount','reconciliationDate',
      'billingDate','voucherNo','invoiceAmount','costAmount',
      'carryForwardCostVoucher','settlementDate','settlementAmount'],
      customerCheck: ['salesUnitPrice','salesAmount',
      'salesAmountAfterDeductingLosses','income','cusReconciliationDate',
      'cusBillingDate','collectionDate','collectionAmount'],
      supplierCheckVIf: true,
      customerCheckVIf: true,
      current: 1,
      pageSize: 10,
      paginationTotal: 0,
      pageSizeOptions: ["10", "20", "50", "100", "200", "500"],
      pagination: {},
      currentPage: 1,
      conditionExportLoading: false,
      templateExportLoading: false,
      checkLoading: false,
      loading: false,
      supplierOption: undefined,
      valueSupplierOption: undefined,
      supplierMaterial: undefined,
      customerOption: undefined,
      valueCustomerOption: undefined,
      customerMaterial: undefined,
      storeOption: undefined,
      valueStoreOption: undefined,
      storeMaterial: undefined,
      selectedRowKeys: [],
    };
  },
  methods: {
    moment,
    modeChange() {
      this.modeInput = !this.modeInput;
    },
    // !20：客户, 21：客户实体, 22：客户门店, 30：供应商
    getSelectValue(numberType) {
      const params = {
        partnerType: numberType,
      };
      partnerType(params).then((res) => {
        if (res.data.code == 200) {
          switch (params.partnerType) {
            case "20":
                this.customerOption = res.data.data;
              break;
            case "22":
                this.storeOption = res.data.data;
              break;
            case "30":
                this.supplierOption = res.data.data;
              break;
            default:
              break;
          }
        }
      });
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toUpperCase()
          .indexOf(input.toUpperCase()) >= 0
      );
    },
    resetSearch() {
      let restData = {
        businessOccurrenceDateStart: '',
        businessOccurrenceDateEnd: '',
        ifTrans: undefined,
      };
      this.supplierOption= undefined;
      this.valueSupplierOption= undefined;
      this.supplierMaterial= undefined;
      this.customerOption= undefined;
      this.valueCustomerOption= undefined;
      this.customerMaterial= undefined;
      this.storeOption= undefined;
      this.valueStoreOption= undefined;
      this.storeMaterial= undefined;
      this.customerName = undefined
      this.searchForm = restData;
    },
    onSubmit(current) {
      this.loading = true;
      const params = {
        direction: "DESC",
        queryParam: {
          supplier: this.supplierMaterial?.partnerName.trim() || '',
          customerName: this.customerMaterial?.partnerName.trim() || '',
          ifTrans: this.searchForm.ifTrans || '',
          storeName: this.modeInput ? this.storeMaterial?.partnerName.trim() || '' : this.customerName?.trim() || '',
          businessOccurrenceDateStart: moment(this.searchForm.businessOccurrenceDateStart).format("YYYY-MM-DD HH:mm:ss") === "Invalid date" ? '' : moment(this.searchForm.businessOccurrenceDateStart).format("YYYY-MM-DD HH:mm:ss"),
          businessOccurrenceDateEnd: moment(this.searchForm.businessOccurrenceDateEnd).format("YYYY-MM-DD HH:mm:ss") === "Invalid date" ? '' : moment(this.searchForm.businessOccurrenceDateEnd).format("YYYY-MM-DD HH:mm:ss")
        },
        pageSize: this.pageSize,
        currentPage: current,
      };
      reportFindList(params).then((res) => {
        this.data = res.data.data;
        this.paginationTotal = res.data.totalNum;
        this.loading = false;
      }).catch(() => this.loading = false);
    },
    defaultData() {
      this.loading = true;
      const params = {
        direction: "DESC",
        queryParam: {
          supplier: "",
          customerName: "",
          storeName: "",
          businessOccurrenceDateStart: "",
          businessOccurrenceDateEnd: "",
        },
        sortName: "sortName",
        pageSize: this.pageSize,
        currentPage: this.current,
      };
      reportFindList(params).then((res) => {
        this.data = res.data.data;
        this.paginationTotal = res.data.totalNum;
      });
      this.loading = false;
    },
    getErrExcel(res,name) {
      const link = document.createElement('a')
      const blob = new Blob([res], {type: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
      link.href = URL.createObjectURL(blob)
      link.download = name
      link.click()
      window.URL.revokeObjectURL(link.href)
    },
    beforeUpload(file) {
      let formData = new FormData()
      formData.append("excel", file)
      reportImportExcel(formData).then(
        res => {
          if (res.data == 'suc' || res.data.size == 3) {
            this.onSubmit(1)
            this.$message.success('上传成功')
          } else {
            this.$message.warn('上传失败,详情请看下载的文件......')
            this.getErrExcel(res.data,file.name.substr(0,file.name.indexOf('.'))+'_error_file')
          }
      });
      return false;
    },
    conditionDownload() {
      const params = {
        supplier: this.supplierMaterial?.partnerName.trim() || '',
        customerName: this.customerMaterial?.partnerName.trim() || '',
        storeName: this.modeInput ? this.storeMaterial?.partnerName.trim() : this.customerName?.trim() || '',
        ifTrans: this.searchForm.ifTrans,
        businessOccurrenceDateStart: moment(this.searchForm.businessOccurrenceDateStart).format("YYYY-MM-DD HH:mm:ss") === "Invalid date" ? '' : moment(this.searchForm.businessOccurrenceDateStart).format("YYYY-MM-DD HH:mm:ss"),
        businessOccurrenceDateEnd: moment(this.searchForm.businessOccurrenceDateEnd).format("YYYY-MM-DD HH:mm:ss") === "Invalid date" ? '' : moment(this.searchForm.businessOccurrenceDateEnd).format("YYYY-MM-DD HH:mm:ss")
      }
      if (params.businessOccurrenceDateStart == "" && params.businessOccurrenceDateEnd == !"" || params.businessOccurrenceDateStart !== "" && params.businessOccurrenceDateEnd == "") {
        this.$message.warn('日期不完整')
        return
      } else if (params.businessOccurrenceDateStart == "" && params.businessOccurrenceDateEnd == "") {
        delete params.businessOccurrenceDateStart == ""
        delete params.businessOccurrenceDateEnd == !""
      }
      this.conditionExportLoading = true
      reportExport(params).then(
        res => {
          this.conditionExportLoading = false
          if (res.data.type === "text/html") {
            this.$message.warn('导出失败')
          } else {
            this.getErrExcel(res.data, '结算报表')
          }
        }
      ).catch( () => this.conditionExportLoading = false)
    },
    templateDownload() {
      this.templateExportLoading = true
      reportExportTemplate().then(
        res => {
          this.templateExportLoading = false
          if (res.data.type === "application/vnd.ms-excel" || res.data.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            this.getErrExcel(res.data, 'Excel结算报表模板')
          } else {
            this.$message.warn('下载失败')
          }
        }
      ).catch( () => this.templateExportLoading = false)
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    arraySlice(arr, n = 10) {
      n > arr.length ? n = arr.length - 1 : ''
      let sliceNumber = Math.ceil(arr.length / n)
      let arrItem = []
      for (let i = 0; i < sliceNumber; i++) {
        if (i == sliceNumber - 1) {
          arrItem.push( arr.slice(i*n, arr.length) )
        } else {
          arrItem.push( arr.slice(i*n, (i+1)*n) )
        }
      }
      return arrItem
    },
    batchCheckThrottle:throttle(function(){
      if (this.selectedRowKeys.length < 1) {
        this.$message.warn('没有选择任何数据')
        return
      }
      this.checkLoading = true
      this.arraySlice(this.selectedRowKeys).map(
        (item,i) => {
          reportTranToReceive(item).then(
            res => {
              if (res.data.code == 200 && i == this.arraySlice.length - 1) {
                this.checkLoading = false
                this.selectedRowKeys = []
                this.reloadTable()
                this.$message.success(res.data.result)
              } else if(i == this.arraySlice.length - 1){
                this.checkLoading = false
                this.$message.warn(res.data.result)
              }
            }
          ).catch( ()=> {i== this.arraySlice.length - 1 ? this.checkLoading = false : ''})
        }
      )
    },3500),
    batchCheck() {
      this.batchCheckThrottle()
    },
    handleSupplierSearch(value) {
      const params = { partnerType: 30, partnerName: value }
      partnerType(params).then(
        res => {
          if (res.data.code == '200') {
            this.supplierOption = res.data.data
          }
        }
      )
    },
    handleChangeSupplierOption(value) {
      this.valueSupplierOption = value;
      this.supplierMaterial = this.supplierOption.find( item => { return item.id == value} )
    },
    handleCustomerSearch(value) {
      const params = { partnerType: 20, partnerName: value }
      partnerType(params).then(
        res => {
          if (res.data.code == '200') {
            this.supplierOption = res.data.data
          }
        }
      )
    },
    handleChangeCustomerOption(value) {
      this.valueCustomerOption = value;
      this.customerMaterial = this.customerOption.find( item => { return item.id == value} )
    },
    handleStoreSearch(value) {
      const params = { partnerType: 22, partnerName: value }
      partnerType(params).then(
        res => {
          if (res.data.code == '200') {
            this.storeOption = res.data.data
          }
        }
      )
    },
    handleChangeStoreOption(value) {
      this.valueStoreOption = value;
      this.storeMaterial = this.storeOption.find( item => { return item.id == value} )
    },
    reloadTable() {
      this.templateExportLoading = false
      this.checkLoading = false
      this.onSubmit(1);
    },
    switchFullscreen() {
      this.fullscreenSwitch = !this.fullscreenSwitch;
    },
    openSelectColumnPopover() {
      this.visibleSelectColumnPopover = true;
    },
    checkBtn(id,state) {
      if (state == '1') {
        this.$message.warn('已核实')
        return
      }
      const params = [id]
      reportTranToReceive(params).then(
        res => {
          if (res.data.code == 200) {
            this.reloadTable()
            this.$message.success(res.data.result)
          } else {
            this.$message.error(res.data.message)
          }
        }
      ).catch( () => this.$message.error('未知错误') )
    },
    onDelete(id,ifTrans,soId,poId) {
      const params = {
        id: id,
        ifTrans: ifTrans,
        soId: soId ? soId : '',
        poId: poId ? poId : ''
      };
      reportDeleteById(params).then(
        res => {
          if (res.data.code == 200) {
            this.reloadTable()
            this.$message.success(res.data.result)
          } else {
            this.$message.warn(res.data.result)
          }
        }
      )
    },
    onChangeChecked(checkedValues) {
      if (checkedValues.length == 28) {
        this.disabledFlage = checkedValues[27];
        this.$message.warn('请至少保留一个...')
        return
      } else {
        this.disabledFlage = 0;
      }
      Object.keys(this.vIf).map(
        key => checkedValues.includes(key)? this.vIf[key] = false : this.vIf[key] = true
      )
      this.supplierCheckVIf = !this.supplierCheck.every(
        res => { return checkedValues.includes(res)}
      )
      this.customerCheckVIf = !this.customerCheck.every(
        res => { return checkedValues.includes(res)}
      )
    },
    onShowSizeChange(current, pageSize) {
      this.pageSize = pageSize;
      this.currentPage = current;
      this.onSubmit(current);
    },
    onChange(current) {
      this.currentPage = current;
      this.onSubmit(current);
    },
  },
  activated() {
    this.defaultData();
    ["20", "22", "30"].forEach(
      item => this.getSelectValue(item)
    );
  },
};
</script>

<style lang="less" scoped>
@import "index";
</style>
