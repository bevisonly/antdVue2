<template>
  <div>
    <a-modal
      title="对账单明细"
      v-model="visible"
      cnetered
      destroyOnClose
      width="80%"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmBtn" tip="处理中">
        <div class="info-item">
          <a-card
            v-if="allMsg.poType == 1"
            title="基础信息"
            class="card-info"
            :head-style="{ backgroundColor: '#f0f3f6' }"
            size="small"
          >
            <div class="info">
              <a-form :form="infoForm">
                <a-row :gutter="16">
                  <a-col :span="6">
                    <a-form-item label="单据号">
                      {{ infoForm.poCode }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="供应商名称">
                      {{ infoForm.supplierName }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="采购日期">
                      {{ infoForm.poSubtime }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="单据金额">
                      {{ infoForm.puTotalAmount }}
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="16">
                  <a-col :span="6">
                    <a-form-item label="对账状态">
                      <a-tag
                        v-if="
                          infoForm.reconciliaState == 610 ||
                          infoForm.reconciliaState == 510
                        "
                        >未对账</a-tag
                      >
                      <a-tag v-else>已对账</a-tag>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="预付款">
                      {{
                        infoForm.payAmount
                          ? formatPrice(infoForm.payAmount)
                          : ""
                      }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="扣供应商款">
                      {{ infoForm.deductions }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="尾款">
                      {{
                        infoForm.noPayAmount
                          ? formatPrice(infoForm.noPayAmount)
                          : ""
                      }}
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="16">
                  <a-col>
                    <div class="upload-img">
                      <a-form-item label="单据文件">
                        <div class="flex-fs uploadbox">
                          <div
                            v-if="uploadUrls.length > 0"
                            class="flex-fs imgWrap"
                          >
                            <div
                              class="uploadImgs"
                              v-for="(item, index) in uploadUrls"
                              :key="index"
                            >
                              <img
                                v-if="item.type.includes('image')"
                                :src="item.url"
                                :alt="item.name"
                                @click="preView(item.url)"
                              />
                              <div
                                v-else
                                class="cursorPin iconBox textwrap"
                                title="点击下载预览"
                                @click="downloadFile(item.url)"
                              >
                                <p class="iconP">
                                  <a-icon type="file" />
                                </p>
                                {{ item.name }}
                              </div>
                            </div>
                          </div>
                          <ImageEdit
                            :imgList="previewImageList"
                            :filePreviewShow="previewVisible"
                            @close="handleCancelPreviewImage"
                          />
                        </div>
                      </a-form-item>
                    </div>
                  </a-col>
                </a-row>
                <a-row :gutter="16">
                  <a-col :span="6">
                    <a-form-item label="备注">
                      {{ infoForm.mark }}
                    </a-form-item>
                  </a-col>
                  <!-- <a-col :span="6">
                    <a-form-item label="关联合同">
                      {{ infoForm.contractTitle }}
                    </a-form-item>
                  </a-col> -->
                  <!-- //! glht -->
                </a-row>
              </a-form>
            </div>
          </a-card>
          <a-card
            v-else
            title="基础信息"
            class="card-info"
            :head-style="{ backgroundColor: '#f0f3f6' }"
            size="small"
          >
            <div class="info">
              <a-form>
                <a-row :gutter="16">
                  <a-col :span="6">
                    <a-form-item label="采购订单编号">
                      {{ allMsg.poCode }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="供应商名称">
                      {{ allMsg.supplierName }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="代理公司名称">
                      {{ allMsg.agencyName }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="采购订单提交时间">
                      {{ allMsg.createDate }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="单据金额">
                      {{ allMsg.puTotalAmount }}
                    </a-form-item>
                  </a-col>
                
                  <a-col :span="6">
                    <a-form-item label="供应商联系手机">
                      {{ allMsg.supplierPhone }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="柜号">
                      {{ allMsg.containerCode }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="订单日期">
                      {{ allMsg.orderDate }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="船名">
                      {{ allMsg.shipName }}
                    </a-form-item>
                  </a-col>
                
                  <a-col :span="6">
                    <a-form-item label="发货港">
                      {{ allMsg.shipmentPort }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="开船日期">
                      {{ allMsg.sailDate }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="目的港">
                      {{ allMsg.purposeHarbor }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="预计到港日期">
                      {{ allMsg.expectArrivalDate }}
                    </a-form-item>
                  </a-col>
                
                  <a-col :span="6">
                    <a-form-item label="提单">
                      {{ allMsg.pickCode }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="运输方式">
                      {{ allMsg.flowDirection }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="订单号">
                      {{ allMsg.orderCode }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="采购订单提交人">
                      {{ allMsg.createUser }}
                    </a-form-item>
                  </a-col>
                
                  <a-col :span="6">
                    <a-form-item label="定价方式">
                      {{ allMsg.pricingState }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="条款">
                      {{ allMsg.terms }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="币种">
                      {{ allMsg.currency }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="汇率">
                      {{ allMsg.exchangeRate }}
                    </a-form-item>
                  </a-col>
               
                  <a-col :span="6">
                    <a-form-item label="预付款">
                      {{ allMsg.payAmount }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="预付款比率(%)">
                      {{ allMsg.payAmountRatio }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="预付款时间">
                      {{ allMsg.advanceTime }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="扣供应商款">
                      {{ allMsg.deductions }}
                    </a-form-item>
                  </a-col>
                
                  <a-col :span="6">
                    <a-form-item label="尾款">
                      {{ allMsg.noPayAmount }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="采购员">
                      {{ allMsg.buyerName }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="交易方式">
                      {{ allMsg.transactionType }}
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="业务类型">
                      {{ allMsg.businessType }}
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </div>
          </a-card>
          <!-- <a-card
          title="其他费用信息"
          class="card-info"
          :head-style="{ backgroundColor: '#f0f3f6' }"
          size="small"
          style="margin-top: 10px"
          v-if="feeList.length > 0"
        >
          <a-row :gutter="16" v-for="item in feeList" :key="item.id">
            <a-col :span="12">
              <a-form-item :label="item.feeName">
                {{ formatPrice(item.feeAmount) }}
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="收款主体">
                {{ item.receivingSubjectId }}
              </a-form-item>
            </a-col>
          </a-row>
        </a-card> -->
        </div>
        <div class="table-item">
          <a-card
            title="对账单明细列表"
            class="card-table"
            :head-style="{ backgroundColor: '#f0f3f6' }"
            size="small"
            style="margin-top: 10px"
            v-if="tableList&&tableList.length>0"
          >
            <template>
              <div slot="extra">
                <div
                  v-if="
                    infoForm[docType==30?'payReconciliaState':'reconciliaState'] == 610 ||
                    infoForm[docType==30?'payReconciliaState':'reconciliaState'] == 510
                  "
                >
                  <a-button type="primary" @click="handleSubmit"
                    >对账确认</a-button
                  >
                </div>
                <div v-else>
                  <a-space>
                    <a-button @click="handleRecall">撤回</a-button>
                    <a-button disabled>已对账</a-button>
                  </a-space>
                </div>
              </div>
            </template>
            <a-table
              :columns="columns"
              :data-source="tableList"
              :scroll="{ x: 1300 }"
              rowKey="id"
              :pagination="false"
              :loading="tableLoading"
              size="middle"
            >
              <span slot="vatTitle" class="table-formva">税率(%)</span>
              <span slot="puPrice" slot-scope="text">
                {{ formatPrice(text) }}
              </span>
              <span slot="puTotalAmount" slot-scope="text">
                {{ formatPrice(text) }}
              </span>
              <span slot="puTotalAmount2" slot-scope="text, record">
                {{ formatPrice(record.puTotalAmount) }}
              </span>
              <!-- 免税 -->
              <span slot="invoiceBusinessTypeTit" class="table-formva"
                >发票类型</span
              >
              <span slot="invoiceBusinessType" slot-scope="text, record">
                <a-select
                  v-model="record.invoiceBusinessType"
                  @click.stop.native
                  placeholder=""
                  style="width: 40%"
                  @change="vatChange(record)"
                  :disabled="
                    infoForm.reconciliaState == 620 ||
                    infoForm.reconciliaState == 520
                  "
                >
                  <a-select-option :value="0">应税业务</a-select-option>
                  <a-select-option :value="1">免税业务</a-select-option>
                </a-select>
                <a-select
                  v-model="record.invoiceType"
                  @click.stop.native
                  placeholder=""
                  style="width: 60%"
                  @change="vatChange(record)"
                  :disabled="
                    infoForm.reconciliaState == 620 ||
                    infoForm.reconciliaState == 520
                  "
                >
                  <a-select-option
                    v-for="(item, index) in invoiceOption"
                    :key="index"
                    :value="item.value"
                    :title="item.text"
                  >
                    {{ item.text }}
                  </a-select-option>
                </a-select>
              </span>
              <div slot="inputTaxRate" slot-scope="text, record">
                <span style="width: 40%">
                  <span v-if="record.invoiceType == 3">抵扣率</span>
                  <span
                    v-if="record.invoiceType == 1 || record.invoiceType == 2"
                    >税率</span
                  >
                </span>
                <a-select
                  style="width: 50%; margin-left: 2px"
                  v-model="record.inputTaxRate"
                  @change="vatChange(record)"
                  :disabled="
                    infoForm.reconciliaState == 620 ||
                    infoForm.reconciliaState == 520
                  "
                >
                  <a-select-option value="0">0</a-select-option>
                  <a-select-option value="1">1</a-select-option>
                  <a-select-option value="3">3</a-select-option>
                  <a-select-option value="6">6</a-select-option>
                  <a-select-option value="9">9</a-select-option>
                  <a-select-option value="11">11</a-select-option>
                  <a-select-option value="13">13</a-select-option>
                </a-select>
              </div>
            </a-table>
          </a-card>
        </div>
        <div class="table-item">
          <a-card
            title="费用项列表"
            class="card-table"
            :head-style="{ backgroundColor: '#f0f3f6' }"
            size="small"
            style="margin-top: 10px"
            v-if="feeList&&feeList.length>0"
          >
            <template>
              <div slot="extra">
                <div v-if="btnState">
                  <a-button
                    type="primary"
                    @click="handleSubmitFee('', 'update')"
                    >对账确认</a-button
                  >
                </div>
                <div v-else>
                  <a-space>
                    <a-button @click="handleSubmitFee('', 'recall')"
                      >撤回</a-button
                    >
                    <a-button disabled>已对账</a-button>
                  </a-space>
                </div>
              </div>
            </template>

            <div class="detail-table">
              <a-table
                :columns="costColumns"
                :data-source="feeList"
                :pagination="false"
                style="margin-top: 10px"
                size="middle"
                :scroll="{ y: 800, x: 300 }"
                row-key="id"
              >
                <span slot="FTTitle" class="table-formva"> 费用类型</span>
                <span slot="FNTitle" class="table-formva"> 费用项</span>
                <span slot="RSTitle" class="table-formva"> 收款主体</span>
                <span slot="FATitle" class="table-formva"> 费用金额</span>
                <span slot="rateTitle" class="table-formva">
                  税率/抵扣率(%)</span
                >
                <span slot="invoiceBusinessTypeTit" class="table-formva"
                  >发票类型</span
                >
                <template
                  v-for="col in customRenderList"
                  v-slot:[col]="text, record"
                >
                  <div :key="col">
                    <a-input
                      :value="text"
                      v-if="record.editable && inputScopedSlots.includes(col)"
                      @change="
                        (e) => handleInputChange(e.target.value, record.id, col)
                      "
                    />
                    <a-input-number
                      :value="text"
                      v-else-if="
                        record.editable && inputScopedSlotsNum.includes(col)
                      "
                      @change="
                        (e) => handleInputChange(e.target.value, record.id, col)
                      "
                    />
                    <a-select
                      style="width: 100%"
                      :value="text"
                      v-else-if="
                        record.editable && selectScopedSlots.includes(col)
                      "
                      @change="onchangeSelect($event, record.id, col)"
                      :filter-option="false"
                    >
                      <a-select-option
                        v-for="(item, index) in optionReturn(
                          col,
                          record.feeType
                        )"
                        :key="index"
                        :value="valueReturn(item, col)"
                      >
                        {{
                          col == "feeName"
                            ? item.name
                            : col == "receivingSubjectId"
                            ? item.partnerName
                            : item
                        }}
                      </a-select-option>
                    </a-select>
                    <a-select
                      style="width: 100%"
                      :value="text"
                      v-else-if="record.editable && col == 'feeType'"
                      @change="onchangeSelect($event, record.id, col)"
                      :filter-option="false"
                    >
                      <a-select-option :value="1">国内</a-select-option>
                      <a-select-option :value="2">国外</a-select-option>
                    </a-select>
                    <!-- 免税 -->
                    <div
                      v-else-if="
                        record.editable && col == 'invoiceBusinessType'
                      "
                    >
                      <a-select
                        v-model="record.invoiceBusinessType"
                        @click.stop.native
                        placeholder=""
                        style="width: 40%"
                         @change="onchangeSelectInvoice($event, record.id, 'invoiceBusinessType')"
                        :filter-option="false"
                      >
                        <a-select-option :value="0">应税业务</a-select-option>
                        <a-select-option :value="1">免税业务</a-select-option>
                      </a-select>
                      <a-select
                        v-model="record.invoiceType"
                        @click.stop.native
                        placeholder=""
                        style="width: 60%"
                        @change="onchangeSelectInvoice($event, record.id, 'invoiceType')"
                        :filter-option="false"
                      >
                        <a-select-option :value="1" title="增值税普通发票"
                          >增值税普通发票</a-select-option
                        >
                        <a-select-option :value="2" title="增值税专用发票"
                          >增值税专用发票</a-select-option
                        >
                      </a-select>
                    </div>
                    <div
                      style="width: 100%; display: flex"
                      v-else-if="record.editable && col == 'rate'"
                    >
                      <span style="width: 40%">
                        <span v-if="record.invoiceType == 3">抵扣率</span>
                        <span v-if="[1,2,4,5].includes(record.invoiceType)">税率</span>
                      </span>
                      <a-select
                        style="width: 50%; margin-left: 2px"
                        :value="text"
                        @change="onchangeSelect($event, record.id, col)"
                        :filter-option="false"
                      >
                        <a-select-option
                          v-for="(item, index) in rateOption"
                          :key="index"
                          :value="item"
                          >{{ item }}</a-select-option
                        >
                      </a-select>
                    </div>
                    <span v-else-if="col == 'feeType'">
                      {{ text == 1 ? "国内" : text == 2 ? "国际" : "" }}
                    </span>
                    <span v-else-if="col == 'rate'">
                      <span>{{
                        record.invoiceType == 3 ? '抵扣率':[1,2,4,5].includes(record.invoiceType)?'税率':''
                      }}{{text}}</span>
                    </span>
                    <span v-else-if="col == 'receivingSubjectId'">
                      {{ record.receivingSubjectName || "" }}
                    </span>
                    <span v-else-if="col=='invoiceBusinessType'">
                      {{ text==0?'应税业务 -':text==1?'免税业务 -':'' }}
                      {{
                      record.invoiceType==1?'增值税普通发票':record.invoiceType==2?'增值税专用发票':
                      record.invoiceType==4?'进口增值税缴款书':record.invoiceType==5?'进口关税缴款书':''
                      }}
                    </span>
                    <span v-else>{{ text }}</span>
                  </div>
                </template>
                <template slot="operation" slot-scope="text, record">
                  <div>
                    <div v-if="record.editable">
                      <a-space>
                        <a-button type="primary" @click="saveEdit(record.id)"
                          >保存</a-button
                        >
                        <a-button type="primary" @click="cancelEdit(record.id)"
                          >取消</a-button
                        >
                      </a-space>
                    </div>
                    <div v-else>
                      <div
                        v-if="
                          record.reconciliaState == 510 ||
                          record.reconciliaState == 610
                        "
                      >
                        <a-space>
                          <a-button
                            type="primary"
                            @click="editFeeRow(record.id)"
                            >编辑</a-button
                          >
                          <a-button
                            type="primary"
                            @click="handleSubmitFee(record.id, 'update')"
                            >对账</a-button
                          >
                        </a-space>
                      </div>
                      <div v-else>
                        <a-space>
                          <a-button
                            @click="handleSubmitFee(record.id, 'recall')"
                            >撤回</a-button
                          >
                          <a-button disabled>已对账</a-button>
                        </a-space>
                      </div>
                    </div>
                  </div>
                </template>
                <template slot="footer">
                  <div>
                    <span>费用项合计 : </span>
                    <span>{{ totalFee }}</span>
                  </div>
                </template>
              </a-table>
            </div>
          </a-card>
        </div>
      </a-spin>
      <div slot="footer">
        <a-button type="primary" @click="handleCancel">关闭</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    title: "商品名称",
    dataIndex: "itemName",
    width: 150,
    align: "center",
  },
  {
    title: "商品编码",
    dataIndex: "itemCode",
    width: 150,
    align: "center",
  },
  {
    title: "规格",
    dataIndex: "itemSpec",
    width: 100,
    align: "center",
  },
  {
    title: "数量",
    dataIndex: "deliveryQty",
    width: 80,
    align: "center",
  },

  {
    title: "计价单位",
    dataIndex: "priceUnit",
    width: 100,
    align: "center",
  },
  {
    title: "单价",
    dataIndex: "puPrice",
    width: 80,
    align: "center",
    scopedSlots: { customRender: "puPrice" },
  },
  {
    title: "商品金额",
    dataIndex: "puTotalAmount",
    width: 100,
    align: "center",
    scopedSlots: { customRender: "puTotalAmount" },
  },
  // {
  //   title: "包装",
  //   dataIndex: "deductionAmount",
  //   width: 100,
  //   align: "center",
  //   scopedSlots: { customRender: "deductionAmount" },
  // },
  {
    title: "包装费",
    dataIndex: "packingCost",
    width: 150,
    align: "center",
    scopedSlots: { customRender: "packingCost" },
  },
  {
    title: "应付金额",
    dataIndex: "puTotalAmount2",
    width: 100,
    align: "center",
    scopedSlots: { customRender: "puTotalAmount2" },
  },
  {
    title: "税额",
    dataIndex: "inputTax",
    width: 100,
    align: "center",
  },
  {
    title: "不含税金额",
    dataIndex: "noCloudingAmount",
    width: 100,
    align: "center",
  },

  {
    slots: { title: "invoiceBusinessTypeTit" },
    dataIndex: "invoiceBusinessType",
    align: "center",
    width: 280,
    scopedSlots: { customRender: "invoiceBusinessType" },
    fixed: "right",
  },
  {
    // title: "增值税(%)",
    slots: { title: "vatTitle" },
    dataIndex: "inputTaxRate",
    align: "center",
    width: 150,
    scopedSlots: { customRender: "inputTaxRate" },
    fixed: "right",
  },
];
const costColumns = [
  {
    dataIndex: "feeType",
    width: 180,
    scopedSlots: { customRender: "feeType" },
    slots: { title: "FTTitle" },
  },
  {
    dataIndex: "feeName",
    width: 180,
    scopedSlots: { customRender: "feeName" },
    slots: { title: "FNTitle" },
  },
  {
    dataIndex: "receivingSubjectId",
    width: 260,
    scopedSlots: { customRender: "receivingSubjectId" },
    slots: { title: "RSTitle" },
  },
  {
    dataIndex: "feeAmount",
    width: 180,
    scopedSlots: { customRender: "feeAmount" },
    slots: { title: "FATitle" },
  },
  {
    dataIndex: "invoiceBusinessType",
    width: 280,
    scopedSlots: { customRender: "invoiceBusinessType" },
    slots: { title: "invoiceBusinessTypeTit" },
  },
  {
    dataIndex: "rate",
    width: 150,
    scopedSlots: { customRender: "rate" },
    slots: { title: "rateTitle" },
  },
  {
    title: "不含税金额",
    dataIndex: "priceExcludingTax",
    width: 240,
    scopedSlots: { customRender: "priceExcludingTax" },
  },
  {
    title: "币种",
    dataIndex: "currency",
    width: 160,
    scopedSlots: { customRender: "currency" },
  },
  {
    title: "汇率",
    dataIndex: "exchangeRate",
    width: 160,
    scopedSlots: { customRender: "exchangeRate" },
  },
  {
    title: "外币金额",
    dataIndex: "foreignCurrencyAmount",
    width: 240,
    scopedSlots: { customRender: "foreignCurrencyAmount" },
  },
  {
    title: "人民币金额",
    dataIndex: "currencyAmount",
    width: 240,
    scopedSlots: { customRender: "currencyAmount" },
  },
  {
    title: "清关单号",
    dataIndex: "customsClearanceFeeNumber",
    width: 280,
    scopedSlots: { customRender: "customsClearanceFeeNumber" },
  },
  {
    title: "备注",
    dataIndex: "remark",
    width: 280,
    scopedSlots: { customRender: "remark" },
  },
  {
    title: "操作",
    dataIndex: "operation",
    width: 200,
    fixed: "right",
    scopedSlots: { customRender: "operation" },
    align: "center",
  },
];
import {
  GetDetails,
  ReconciliateConfirm,
  ReconciliateFeeConfirm,
  ReconciliateFeeUndo,
  OrderRecall,
  PayableUpdateFee,
} from "../../services/settlement/payable/PayableToCheckFor";
import { getOrderDetail } from "../../services/pickUpOrder/pickUpOrderList";
import { getUploadFiles } from "../../services/product/productList";
import ImageEdit from "../../components/imageEdit/imageEdit.vue";
import { getFeeList } from "../../services/pickUpOrder/pickUpOrderList";
import { partnerType } from "../../services/userMa";
import { isFalse } from "../../utils/util";
export default {
  components: {
    ImageEdit,
  },
  data() {
    return {
      //免税二期
      invoiceOption: [
        { value: 1, text: "增值税普通发票" },
        { value: 2, text: "增值税专用发票" },
        { value: 3, text: "增值税普通发票(免税)" },
      ],
      columns,
      costColumns,
      visible: false,
      infoForm: {},
      allMsg: {},
      tableList: [],
      tableLoading: false,
      id: "",
      poCode: "",
      docType: "",
      version: "",
      feeList: [],
      confirmBtn: false,
      //单据相关
      previewVisible: false,
      uploadUrls: [],
      previewImageList: [],
      //费用项相关
      customRenderList: [
        "feeType",
        "feeName",
        "receivingSubjectId",
        "feeAmount",
        "invoiceBusinessType",
        "rate",
        "priceExcludingTax",
        "currency",
        "exchangeRate",
        "foreignCurrencyAmount",
        "currencyAmount",
        "customsClearanceFeeNumber",
        "remark",
      ],
      inputScopedSlots: ["customsClearanceFeeNumber", "remark"],
      inputScopedSlotsNum: [
        "feeAmount",
        "exchangeRate",
        "foreignCurrencyAmount",
      ],
      selectScopedSlots: ["feeName", "receivingSubjectId", "currency",],
      readOnlyArr: ["priceExcludingTax", "currencyAmount"],
      rateOption: ["0", "1", "3", "6", "9", "11", "13"],
      currencyOption: ["人民币", "美元", "欧元", "英镑", "澳元"],
      partnerList: [],
      feeCateData1: [],
      feeCateData2: [],
      cachData: [],
    };
  },
  computed: {
    btnState() {
      let state = true;
      if (
        this.feeList.findIndex(
          (item) => item.reconciliaState == 510 || item.reconciliaState == 610
        ) == -1
      ) {
        state = false;
      }
      return state;
    },
    totalFee() {
      return (
        this.feeList.reduce((t, c) => {
          return this.formatPrice(t + (+c.feeAmount || 0), 2);
        }, 0) || "-"
      );
    },
  },
  methods: {
    onchangeSelectInvoice($event, rowKey,colName) {
      console.log($event);
      const newData = [...this.feeList];
      const target = newData.filter((item) => rowKey === item.id)[0];
      if (target) {
        target[colName] = $event;
        this.feeList = newData;
        this.feeComputed(target);
      }
      this.$forceUpdate();
    },
    //单据撤销
    handleRecall() {
      const params = {
        id: this.id,
        poCode: this.poCode,
        docType: this.docType,
      };
      this.confirmBtn = true;
      OrderRecall(params)
        .then((res) => {
          this.confirmBtn = false;
          const data = res.data;
          if (data.code == 200) {
            this.$message.success(data.message);
            this.infoForm[this.docType==30?'payReconciliaState':'reconciliaState'] = res.data.data || "";
          } else {
            this.confirmBtn = false;
            this.$message.error(data.message);
          }
        })
        .catch(() => {
          this.confirmBtn = false;
          this.$message.error("连接超时");
        });
    },
    handleInputChange($event, rowKey, colName) {
      const newData = [...this.feeList];
      const target = newData.filter((item) => rowKey === item.id)[0];
      if (target) {
        target[colName] = $event;
        if (colName == "feeAmount") {
          this.feeComputed(target);
        }
        if (colName == "exchangeRate" || colName == "foreignCurrencyAmount") {
          target.currencyAmount =
            target.exchangeRate && target.foreignCurrencyAmount
              ? (+target.exchangeRate * +target.foreignCurrencyAmount).toFixed(
                  2
                )
              : "";
        }
        this.feeList = newData;
      }
    },
    feeComputed(record) {
      let rate = record.rate / 100 || 0;
      let tax = 0;
      if (record.invoiceType == 3) {
        tax =
          record.feeAmount && record.rate
            ? (+record.feeAmount * +rate).toFixed(2)
            : tax;
      } else {
        tax =
          record.feeAmount && record.rate
            ? ((+record.feeAmount * +rate) / (1 + +rate)).toFixed(2)
            : tax;
      }
      record.priceExcludingTax = this.formatPrice(+record.feeAmount - +tax, 2);
      this.$forceUpdate();
    },
    async handleSubmitFee(id, state) {
      let ids = [];
      if (id) {
        ids.push(id);
      } else {
        this.feeList.forEach((item) => {
          ids.push(item.id);
        });
      }
      if (ids && ids.length > 0) {
        const params = [...ids];
        this.confirmBtn = true;
        try {
          let res =
            state == "update"
              ? await ReconciliateFeeConfirm(params)
              : await ReconciliateFeeUndo(params);
          this.confirmBtn = false;
          const data = res.data;
          if (data.code == 200) {
            this.$message.success(data.message);
            this.feeList = JSON.parse(JSON.stringify(data.data));
          } else {
            this.$message.error(data.message);
          }
        } catch (error) {
          this.confirmBtn = false;
          this.$message.error("连接超时");
        }
      }
    },
    valueReturn(item, col) {
      let value;
      switch (col) {
        case "feeName":
          value = item.name || "";
          break;
        case "receivingSubjectId":
          value = item.id || "";
          break;
        case "currency":
          value = item || "";
          break;

        default:
          break;
      }
      return value;
    },
    //数据回显
    optionReturn(col, type) {
      let data = [];
      switch (col) {
        case "feeName":
          data =
            type == 1 ? this.feeCateData1 : type == 2 ? this.feeCateData2 : [];
          break;
        case "receivingSubjectId":
          data = this.partnerList || [];
          break;
        case "currency":
          data = this.currencyOption || [];
          break;

        default:
          break;
      }
      return data;
    },
    onchangeSelect($event, rowKey, colName) {
      console.log($event);
      const newData = [...this.feeList];
      const target = newData.filter((item) => rowKey === item.id)[0];
      if (target) {
        target[colName] = $event;
        if (colName == "feeType") {
          this.optionReturn("feeType", $event);
          target.feeName = "";
        }
        if (colName == "rate") {
          this.feeComputed(target);
        }
        if (colName == "receivingSubjectId") {
          this.partnerList.forEach((item) => {
            if (item.id === $event) {
              target.receivingSubjectName = item.partnerName || "";
            }
          });
        }
        this.feeList = newData;
      }
    },
    //获取供应商列表
    async getSuppliers(poType) {
      let params = {}
      if (poType === 1) {//国内订单
        params = { partnerType: 30, isEnable: 1 }
      } else {
        params = { partnerTypes: [30, 40], isEnable: 1 }
      }
      let res = await partnerType(params);
      if (res.data.code == 200) {
        this.partnerList = res.data.data || [];
      }
    },
    //费用的分类数据
    async getFeeList(orderType) {
      let res = await getFeeList({ orderType: orderType === 1 ? 1 : 3 });
      if (res.data.code == 200) {
        const data = res.data.data || [];
        if (data && data.length > 0) {
          this.feeCateData1 = data.filter((item) => item.type === 1);
          this.feeCateData2 = data.filter((item) => item.type === 2);
        } else {
          this.feeCateData1 = [];
          this.feeCateData2 = [];
        }
      }
    },
    //编辑保存
    saveEdit(rowKey) {
      const newData = [...this.feeList];
      const target = newData.filter((item) => rowKey === item.id)[0];
      if (target) {
        if (
          isFalse([target.feeType,target.feeName,target.receivingSubjectId,target.feeAmount,target.invoiceType,target.invoiceBusinessType,target.rate])
        ) {
          this.$message.warn("请核对必填项");
          return;
        }
        delete target.editable;
        const params = { ...target };
        this.confirmBtn = true;
        PayableUpdateFee(params)
          .then((res) => {
            this.confirmBtn = false;
            const data = res.data;
            if (data.code == 200) {
              this.feeList = newData;
              this.cachData = newData.map((item) => ({ ...item }));
            } else {
              this.$message.error(data.message);
            }
          })
          .catch(() => {
            this.confirmBtn = false;
            this.$message.error("连接超时");
          });
      }
    },
    //编辑
    editFeeRow(rowKey) {
      console.log(rowKey);
      const newData = [...this.feeList];
      const target = newData.filter((item) => rowKey === item.id)[0];
      if (target) {
        target.editable = true;
        this.feeList = newData;
      }
      this.$forceUpdate();
    },
    //取消编辑
    cancelEdit(rowKey) {
      const newData = [...this.feeList];
      const target = newData.filter((item) => rowKey === item.id)[0];
      if (target) {
        Object.assign(
          target,
          this.cachData.filter((item) => rowKey === item.id)[0]
        );
        delete target.editable;
        this.feeList = newData;
      }
    },
    //单据文件
    handleCancelPreviewImage() {
      this.previewImage = undefined;
      this.previewImageList = [];
      this.previewVisible = false;
    },
    preView(url) {
      this.previewImageList = [];
      this.previewImage = url;
      if (this.uploadUrls.length > 0) {
        this.uploadUrls.forEach((item) => {
          if (item.type.includes("image")) {
            this.previewImageList.push(item.url);
          }
        });
      } else {
        this.previewImageList.push(url);
      }
      this.previewVisible = true;
    },
    vatChange(record) {
      record.inputTax = 0;
      record.noCloudingAmount = record.puTotalAmount;
      let rate = +record.inputTaxRate / 100;
      if (record.invoiceType == 3) {
        record.inputTax =
          record.puTotalAmount && record.inputTaxRate
            ? (+record.puTotalAmount * +rate).toFixed(2)
            : record.inputTax;
      } else {
        record.inputTax =
          record.puTotalAmount && record.inputTaxRate
            ? ((+record.puTotalAmount * +rate) / (1 + +rate)).toFixed(2)
            : record.inputTax;
      }
      record.noCloudingAmount =
        record.puTotalAmount && record.inputTax
          ? this.formatPrice(+record.puTotalAmount - +record.inputTax)
          : record.noCloudingAmount;
          this.$forceUpdate()
    },
    handleCancel() {
      this.visible = false;
      this.$parent.getList();
    },
    handleSubmit() {
      let errorState = false;
      console.log(this.tableList);
      this.tableList.forEach((item) => {
        if (!item.inputTaxRate || item.inputTaxRate == "") {
          errorState = true;
        }
      });
      if (errorState) {
        this.$message.error("增值税必选项 ! 请核对");
        return;
      }
      const params = {
        id: this.id,
        poCode: this.poCode,
        docType: this.docType,
        // orderDetailDtoList: this.tableList,
        // version: this.version,
        purchaseOrderDetailDtos: [...this.tableList],
      };
      this.confirmBtn = true;
      ReconciliateConfirm(params)
        .then((res) => {
          if (res.data.code == 200) {
            this.confirmBtn = false;
            // this.visible = false;
            this.$message.success(
              res.data.message == "OK" ? "对账确认成功" : res.data.message
            );
            this.infoForm[this.docType==30?'payReconciliaState':'reconciliaState'] = res.data.data || "";
          } else {
            this.confirmBtn = false;
            this.$message.error(
              res.data.message ? res.data.message : "对账确认失败"
            );
          }
        })
        .catch(() => {
          this.confirmBtn = false;
          this.$message.error("连接超时");
        });
    },
    getDetails(record) {
      this.tableLoading = true;
      GetDetails({
        id: record.id,
        poCode: record.poCode,
        docType: record.docType,
      }).then((res) => {
        console.log(res);
        this.tableLoading = false;
        this.tableList = res.data.rows || [];
      });
    },
    async showModal(record) {
      this.visible = true;
      this.id = record.id;
      this.poCode = record.poCode;
      this.docType = record.docType;
      this.version = record.version;
      this.allMsg = record;
      if (record.poType == 1) {
        this.allMsg = record;
        this.infoForm = {
          poCode: record.poCode || "",
          supplierName: record.supplierName || "",
          poSubtime: record.poSubtime || "",
          mark: record.mark || "",
          reconciliaState: record.reconciliaState || "",
          payReconciliaState: record.payReconciliaState || "",
          puTotalAmount: this.formatPrice(record.puTotalAmount) || "",
          payAmount: record.payAmount || "",
          deductions: record.deductions || "",
          noPayAmount: record.noPayAmount || "",
        };
      } else {
        this.getGlobalDetail(record);
      }
      this.feeList = record.purchaseFeeList || [];
      this.feeList.forEach((item) => {
        item.editable = false;
      });
      this.cachData = JSON.parse(JSON.stringify(this.feeList));
      console.log(this.feeList);
      this.getDetails(record);
      //单据
      let params = new FormData();
      params.append("tableId", record.id);
      params.append("tableName", "pickUpOrder");
      let res = await getUploadFiles(params);
      this.uploadUrls = [];
      if (res.data.code == 200 && res.data.data.length > 0) {
        let filetemp = [];
        res.data.data.forEach((item) => {
          filetemp.push({ ...JSON.parse(item.filePath), id: item.id });
        });
        this.uploadUrls = filetemp;
      }
      //费用项
      this.getSuppliers(record.poType);
      this.getFeeList(record.poType);
    },
    getGlobalDetail(record) {
      getOrderDetail({ id: record.id }).then((res) => {
        if (res.data.code == 200) {
          let item = res.data.data;
          this.infoForm = res.data.data || {};
          this.allMsg = {
            buyerName: item.buyerName || "",
            poTotalAmount: item.poTotalAmount || "",
            puTotalAmount: item.puTotalAmount || "",
            puItemAmount: item.puItemAmount || "",
            id: item.id || "",
            supplierId: item.supplierId || "",
            supplierCode: item.supplierCode || "",
            poState: item.poState || "",
            reconciliaState: item.reconciliaState || "",
            settleState: item.settleState || "",
            poCode: item.poCode || "",
            supplierName: item.supplierName || "",
            supplierPhone: item.supplierPhone || "",
            poSubtime: item.poSubtime || "",
            agencyName: item.purchaseGlobalOrderDetail.agencyName || "",
            agencyId: item.purchaseGlobalOrderDetail.agencyId || "",
            businessType: item.purchaseGlobalOrderDetail.businessType || "",
            flowDirection: item.purchaseGlobalOrderDetail.flowDirection || "",
            orderCode: item.purchaseGlobalOrderDetail.orderCode || "",
            orderDate: item.purchaseGlobalOrderDetail.orderDate || "",
            pickCode: item.purchaseGlobalOrderDetail.pickCode || "",
            purposeHarbor: item.purchaseGlobalOrderDetail.purposeHarbor || "",
            shipName: item.purchaseGlobalOrderDetail.shipName || "",
            sailDate: item.purchaseGlobalOrderDetail.sailDate || "",
            expectArrivalDate:
              item.purchaseGlobalOrderDetail.expectArrivalDate || "",
            transactionType:
              item.purchaseGlobalOrderDetail.transactionType || "",
            currency: item.purchaseGlobalOrderDetail.currency || "",
            exchangeRate: item.purchaseGlobalOrderDetail.exchangeRate || "",
            pricingState: item.purchaseGlobalOrderDetail.pricingState || "",
            terms: item.purchaseGlobalOrderDetail.terms || "",
            payAmountRatio: item.payAmountRatio || "",
            advanceTime: item.advanceTime || "",
            shipmentPort: item.purchaseGlobalOrderDetail.shipmentPort || "",
            payAmount: item.payAmount || "",
            noPayAmount: item.noPayAmount || "",
            deductions: item.deductions || "",
            createDate: item.poSubtime || "",
            createUser: item.createUser || "",
            containerCode: record.containerCode || "",
            payReconciliaState: record.payReconciliaState || "",
          };
          this.allMsg.puTotalAmount=record.puTotalAmount||''
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.ant-form-item {
  margin-bottom: 0;
}
.table-formva::before {
  display: inline-block;
  color: #f5222d;
  font-size: 14px;
  line-height: 1;
  content: "*";
}
.uploadbox {
  flex-wrap: wrap;

  .imgWrap {
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .uploadImgs {
    position: relative;
    border-radius: 4px;
    width: 104px;
    height: 104px;
    border: 1px solid #d9d9d9;
    padding: 14px;
    margin-bottom: 4px;

    .imgDelete {
      cursor: pointer;
      position: absolute;
      right: 4px;
      top: -10px;
    }

    .iconBox {
      text-align: center;
      font-size: 16px;

      /deep/.iconP {
        margin: 0;
        padding: 0;
        line-height: 0;

        i {
          svg {
            width: 40px;
            height: 40px;
            color: #818181;
          }
        }
      }
    }

    img {
      width: 100%;
      height: 100%;
      vertical-align: middle;
      object-fit: cover;
    }

    margin-right: 4px;
  }

  .uploadImgIcon {
    width: 104px;
    height: 104px;
    border: 1px dashed #d9d9d9;
    border-radius: 4px;
    background-color: #fafafa;
    cursor: pointer;
  }
}
</style>