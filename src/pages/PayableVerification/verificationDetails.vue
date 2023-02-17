<template>
  <div id="scrollTop">
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      :title="subTitle"
      @back="handleBack"
    />
    <a-spin :tip="spinText" :spinning="spinning">
      <!-- 账单信息 -->
      <div style="margin-top: 16px">
        <a-card
          class="card-table"
          size="small"
          :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
          :body-style="{ padding: '12px,2px' }"
        >
          <template #title>
            <span>
              账单信息&nbsp;<a-button @click="exportDetails">导出明细</a-button>
            </span>
          </template>
          <a-form :model="form">
            <a-row :gutter="24">
              <a-col :span="6"
                ><a-form-item label="单据编号"
                  ><span>{{
                    form.apInvoiceCode || form.poCode
                  }}</span></a-form-item
                ></a-col
              >
              <a-col :span="6"
                ><a-form-item label="供应商名称"
                  ><span>{{ form.supplierName }}</span></a-form-item
                ></a-col
              >
              <a-col :span="6" v-if="pageType == 2 || pageType == 4"
                ><a-form-item label="采购员"
                  ><span>{{ form.buyerName }}</span></a-form-item
                ></a-col
              >
              <a-col :span="6" v-if="pageType == 1 || pageType == 3">
                <a-form-item label="结算状态">
                  <span v-if="form.state === 1">未收款</span>
                  <span v-if="form.state === 2">部分收款</span>
                  <span v-if="form.state === 3 || form.state === 4"
                    >已收款</span
                  >
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="核销状态">
                  <a-tag v-if="form.state === 3">未核销</a-tag>
                  <a-tag color="green" v-if="form.state === 4">已核销</a-tag>
                </a-form-item>
              </a-col>
              <!-- //! 待核销尾款《1》，待核销预付款《2》，已核销尾款《3》，已核销预付款《4》 -->
              <a-col :span="6" v-if="pageType == 2 || pageType == 4"
                ><a-form-item label="采购总价"
                  ><span>{{
                    form.puTotalAmount || form.poTotalAmount
                  }}</span></a-form-item
                ></a-col
              >
              <a-col :span="6" v-if="pageType == 1 || pageType == 3"
                ><a-form-item label="结算金额"
                  ><span>{{ form.settlementAmount }}</span></a-form-item
                ></a-col
              >
              <a-col :span="6"
                ><a-form-item label="预付金额"
                  ><span>{{ form.payAmount }}</span></a-form-item
                ></a-col
              >
              <a-col :span="6" v-if="pageType == 2 || pageType == 4"
                ><a-form-item label="尾款"
                  ><span>{{ form.noPayAmount }}</span></a-form-item
                ></a-col
              >
              <a-col :span="6" v-if="pageType == 2 || pageType == 4"
                ><a-form-item label="订单类型"
                  ><span>采购订单</span></a-form-item
                ></a-col
              >
              <a-col :span="6" v-if="pageType == 2 || pageType == 4"
                ><a-form-item label="预付款比例"
                  ><span>{{ form.payAmountRatio }}</span></a-form-item
                ></a-col
              >
              <a-col :span="6" v-if="pageType == 2 || pageType == 4"
                ><a-form-item label="预付款币种"
                  ><span>{{ form.payAmountCurrency }}</span></a-form-item
                ></a-col
              >
              <a-col :span="6" v-if="pageType == 2 || pageType == 4"
                ><a-form-item label="汇率"
                  ><span>{{ form.payAmountExchangeRate }}</span></a-form-item
                ></a-col
              >
              <a-col :span="6" v-if="pageType == 2 || pageType == 4"
                ><a-form-item label="预付款比例条款"
                  ><span>{{ form.payAmountRatioTerm }}</span></a-form-item
                ></a-col
              >
              <a-col :span="6" v-if="pageType == 2 || pageType == 4"
                ><a-form-item label="预付款人民币金额"
                  ><span>{{ form.payAmount }}</span></a-form-item
                ></a-col
              >
              <a-col :span="6" v-if="pageType == 2 || pageType == 4"
                ><a-form-item label="预付款日期"
                  ><span>{{ form.advanceTime }}</span></a-form-item
                ></a-col
              >
              <a-col :span="6" v-if="pageType == 2 || pageType == 4"
                ><a-form-item label="计划交付日期"
                  ><span>{{ form.planDeliveryTime }}</span></a-form-item
                ></a-col
              >
              <a-col :span="6" v-if="pageType == 1 || pageType == 3"
                ><a-form-item label="支付方式"
                  ><span>{{ form.payTypeStr }}</span></a-form-item
                ></a-col
              >
              <a-col :span="6" v-if="pageType == 1 || pageType == 3"
                ><a-form-item label="结算货币"
                  ><span>{{ form.currencyStr }}</span></a-form-item
                ></a-col
              >
              <a-col :span="6" v-if="pageType == 1 || pageType == 3"
                ><a-form-item label="折扣金额"
                  ><span>{{ form.discountAmount }}</span></a-form-item
                ></a-col
              >
              <a-col :span="6"
                ><a-form-item label="所属运营主体"
                  ><span>{{ form.opName }}</span></a-form-item
                ></a-col
              >
              <a-col :span="6" v-if="pageType == 1 || pageType == 3"
                ><a-form-item label="账单日期"
                  ><span>{{ form.billDate }}</span></a-form-item
                ></a-col
              >
              <a-col :span="6" v-if="pageType == 1 || pageType == 3"
                ><a-form-item label="账单生成日期"
                  ><span>{{ form.createDate }}</span></a-form-item
                ></a-col
              >
              <a-col :span="6" v-if="pageType == 1 || pageType == 3">
                <a-form-item label="结算周期">
                  <span v-if="form.settleCycle === 1">自然月底</span>
                  <span v-if="form.settleCycle === 2">每月15日</span>
                  <span v-if="form.settleCycle === 3">自定义</span>
                </a-form-item>
              </a-col>
              <a-col :span="6" v-if="pageType == 1 || pageType == 3"
                ><a-form-item label="包装金额"
                  ><span>{{ form.packingCost }}</span></a-form-item
                ></a-col
              >
              <a-col :span="6"
                ><a-form-item label="银行流水号"
                  ><span>{{ form.bankFlowNo }}</span></a-form-item
                ></a-col
              >
              <a-col :span="6" v-if="pageType == 3 || pageType == 4"
                ><a-form-item label="核销人"
                  ><span>{{ form.writeOffUser }}</span></a-form-item
                ></a-col
              >
              <a-col :span="6" v-if="pageType == 3 || pageType == 4"
                ><a-form-item label="核销时间"
                  ><span>{{ form.writeOffDate }}</span></a-form-item
                ></a-col
              >
              <a-col :span="6"
                ><a-form-item label="备注"
                  ><span>{{ form.remark }}</span></a-form-item
                ></a-col
              >
              <!-- <a-col :span="6"
                ><a-form-item label="关联合同"
                  ><span>{{ form.contractTitle }}</span></a-form-item
                ></a-col
              > -->
              <!-- //! glht -->
            </a-row>
            <a-row :gutter='24' v-if="form.poType==2">
              <a-col :span='6'>
                <a-form-item label='代理公司名称'>
                  <span>{{form.agencyName}}</span>
                </a-form-item>
              </a-col>
              <a-col :span='6'>
                <a-form-item label='预估人民币金额'>
                  <span>{{form.predictAmount}}</span>
                </a-form-item>
              </a-col>
              <a-col :span='6'>
                <a-form-item label='实际人民币金额'>
                  <span>{{form.actualAmount}}</span>
                </a-form-item>
              </a-col>
              <a-col :span='6'>
                <a-form-item label='手续费'>
                  <span>{{form.handlingFee}}</span>
                </a-form-item>
              </a-col>
              <a-col :span='6'>
                <a-form-item label='电报费'>
                  <span>{{form.cableFee}}</span>
                </a-form-item>
              </a-col>
              <a-col :span='6'>
                <a-form-item label='实际汇率'>
                  <span>{{form.actualExchangeRate}}</span>
                </a-form-item>
              </a-col>
              <a-col :span='6'>
                <a-form-item label='差额'>
                  <span>{{form.balanceAmount}}</span>
                </a-form-item>
              </a-col>
            </a-row>
            <a-divider />
            <div class="fee-tit">费用项列表</div>
            <div class="feelist">
              <a-table
                :columns="costColumns"
                :data-source="feeList"
                size="middle"
                :scroll="{ x: 307.778, y: 800 }"
                :pagination="false"
                rowKey="id"
              >
                <div slot="feeType" slot-scope="text">
                  <a-tag v-if="text === 1">国内</a-tag>
                  <a-tag v-if="text === 2">国际</a-tag>
                  <a-tag v-if="text === 3">其他</a-tag>
                </div>
                <span slot="rate" slot-scope="text, record">
                  {{
                    record.invoiceBusinessType == 0
                      ? "应税 -"
                      : record.invoiceBusinessType == 1
                      ? "免税 -"
                      : ""
                  }}
                  {{
                    record.invoiceType == 1
                      ? "普票 -"
                      : record.invoiceType == 2
                      ? "专票 -"
                      : record.invoiceType == 3
                      ? "普票(免税) -"
                      : record.invoiceType == 4
                      ? "进口增值税 -"
                      : record.invoiceType == 5
                      ? "进口关税 -"
                      : ""
                  }}{{
                    record.invoiceType == 3
                      ? "抵扣率"
                      : [1,2,4,5].includes(record.invoiceType)
                      ? "税率"
                      : ""
                  }}
                  {{ record.rate + "%" }}
                </span>
              </a-table>
            </div>
            <div class="fee-tit" style="margin: 20px 0">银行流水凭证</div>
            <div class="feelist">
              <a-table
                ref="tableRef"
                :columns="columnsx"
                :data-source="dataTablex"
                rowKey="id"
                :scroll="{ x: 307.778 }"
                :pagination="
                  dataTablex.length > 10
                    ? {
                        showTotal: () => `共 ${dataTablex.length} 条`,
                        showSizeChanger: true,
                        showQuickJumper: dataTablex.length > 1000,
                      }
                    : false
                "
              >
                <span slot="status" slot-scope="text, record">
                  <a-tag color="#999999" v-show="record.status == 0">
                    <div style="width: 48px; text-align: center">
                      {{ optionx.status[text] }}
                    </div>
                  </a-tag>
                  <a-tag color="#F59A23" v-show="record.status == 1">
                    {{ optionx.status[text] }}
                  </a-tag>
                  <a-tag color="#5F9900" v-show="record.status == 2">
                    <div style="width: 48px; text-align: center">
                      {{ optionx.status[text] }}
                    </div>
                  </a-tag>
                </span>
                <span slot="accountNumber" tips="本方账户账号" slot-scope="text"
                  ><div>{{ strExchange(text) }}</div></span
                >
                <span slot="oppAccNo" tips="对方账户账号" slot-scope="text"
                  ><div>{{ strExchange(text) }}</div></span
                >
                <span slot="fileName" tips="文件名" slot-scope="text, record">
                  <a-button
                    type="link"
                    style="text-decoration: underline"
                    @click="exportSingle(record)"
                    >{{ text }}</a-button
                  >
                </span>
                <span slot="operation" slot-scope="text, record">
                  <a-popconfirm
                    placement="left"
                    title="确定删除吗？"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="deleteItem(record.id)"
                  >
                    <a-icon
                      slot="icon"
                      type="question-circle"
                      style="color: red"
                    />
                    <a-button
                      class="btncircle"
                      type="primary"
                      icon="delete"
                    ></a-button>
                  </a-popconfirm>
                </span>
                <!-- <template tips='合计' slot="footer" slot-scope="currentPageData" v-if="dataTablex[0]">
                  本页合计：
                  <span class="greyfont">合计支出</span>
                  &lt;<span class="redfont">{{ currentPageData.reduce((t, c) => formatPrice(t + +(c.outcome || 0)), 0) }}</span>&gt;
                </template> -->
              </a-table>
            </div>
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-item label="单据图片">
                  <div class="uploadbox flex-fs">
                    <div
                      class="uploadImgs flex-fs"
                      v-for="(item, index) in previewImageList"
                      :key="index"
                    >
                      <img :src="item" alt="" @click="bigImg(index)" />
                    </div>
                  </div>
                </a-form-item>
              </a-col>
            </a-row>
            <a-divider />
            <!-- 发票 -->
            <div v-if="invoiceList&&invoiceList.length>0">
              <div class="invoice" style="margin-bottom: 10px">
                <span>发票信息 : </span>
                <span style="margin-left: 30px" v-if="pageState=='payableWaitVerification'">
                  <a-space>
                    <a-button
                      type="primary"
                      @click="invoiceChange('', '通过', 'batch')"
                      :disabled="passState"
                      >全部通过</a-button
                    >
                    <a-button
                      @click="invoiceChange('', '退回', 'batch')"
                      :disabled="passState"
                      >全部退回</a-button
                    >
                  </a-space>
                </span>
              </div>
            <InvoiceList :invoiceList="invoiceList" @change="invoiceChange" :pageState='pageState' />
            <InvoiceAdvice ref="invoiceAdvice" />
            </div>
            <div class="operation">
              <a-button type="primary" @click="toAudit" v-if="form.state === 3"
                >核销</a-button
              >
            </div>
          </a-form>
        </a-card>
      </div>
      <!-- 数据列表 -->
      <div class="list-table" style="margin-top: 16px">
        <a-card
          title="数据列表"
          class="card-table"
          size="small"
          :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
          :body-style="{ padding: '12px,2px' }"
        >
          <div class="search-item">
            <a-form :model="searchForm">
              <a-row :gutter="24">
                <a-col :span="6">
                  <a-form-item label="商品名称/商品编号">
                    <a-input
                      v-model.trim="searchForm.itemName"
                      placeholder="请输入商品名称或编码"
                      @change="getList"
                      allowClear
                    ></a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item label="采购单号">
                    <a-input
                      v-model.trim="searchForm.poCode"
                      placeholder="请输入采购订单编号"
                      @change="getList"
                      allowClear
                    ></a-input>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
          <div class="export" style="margin-top: 10px">
            <a-button type="primary" @click="exportDetails"> 导出</a-button>
          </div>
          <a-table
            style="margin-top: 10px"
            :columns="dataType == 1 ? columns : columns2"
            :data-source="tableList"
            :scroll="{ x: 1300, y: 500 }"
            rowKey="id"
            :pagination="false"
          >
            <span tips="采购单价" slot="price" slot-scope="text, record">
              <a-space>
                <span>
                  {{ record.price }}
                </span>
                <span>{{ form.currency }}</span>
              </a-space>
            </span>
            <span tips="进项税" slot="inputTaxRate" slot-scope="text, record">
              {{
                record.invoiceBusinessType == 0
                  ? "应税 -"
                  : record.invoiceBusinessType == 1
                  ? "免税 -"
                  : ""
              }}
              {{
                record.invoiceType == 1
                  ? "普票 -"
                  : record.invoiceType == 2
                  ? "专票 -"
                  : record.invoiceType == 3
                  ? "普票(免税) -"
                  : ""
              }}{{
                record.invoiceType == 3
                  ? "抵扣率"
                  : record.invoiceType == 1 || record.invoiceType == 2
                  ? "税率"
                  : ""
              }}
              {{ record.inputTaxRate + "%" }}
            </span>
            <span slot="Packaging" slot-scope="record">
              <a-button type="link" @click="openPacking(record)">
                包装选择
              </a-button>
            </span>
            <div
              slot="footer"
              class="table-footer"
              v-if="pageType == 1 || pageType == 3"
            >
              本页合计 :
              <span
                >商品金额<span>{{ itemAmountTo }}</span></span
              >|<span
                >总金额<span>{{ settlementAmountTo }}</span></span
              >
            </div>
            <template
              tips="合计"
              slot="footer"
              slot-scope="currentPageData"
              v-if="tableList[0]"
            >
              本页合计：
              <span class="greyfont">商品</span>
              &lt;<span class="redfont">{{
                currentPageData.reduce(
                  (t, c) => formatPrice(t + +(c.itemAmount || 0)),
                  0
                )
              }}</span
              >&gt;
              <a-divider class="dividerStyle" type="vertical" />
              <span class="greyfont">采购件数</span>
              &lt;<span class="redfont">{{
                currentPageData.reduce(
                  (t, c) => formatPrice(t + +(c.qty || 0)),
                  0
                )
              }}</span
              >&gt;
              <span class="greyfont">采购订单费用（含包装费）</span>
              &lt;<span class="redfont">{{
                currentPageData.reduce(
                  (t, c) =>
                    formatPrice(
                      t + (+c.otherAmount || 0) + (+c.itemAmount || 0)
                    ),
                  0
                )
              }}</span
              >&gt;
            </template>
          </a-table>
          <!-- 分页 -->
          <!-- <div class="pagination">
          <a-pagination
            :page-size-options="['10', '20', '30', '40', '50']"
            :total="pagination.total"
            show-size-changer
            :page-size="pagination.rows"
            show-quick-jumper
            :current="pagination.page"
            :show-total="(total) => `共 ${total} 条记录`"
            @change="pageChange"
            @showSizeChange="pageSizeChange"
          >
          </a-pagination>
        </div> -->
        </a-card>
      </div>
    </a-spin>
    <!-- 尾部 -->
    <div
      class="footer-btn"
      style="
        text-align: right;
        height: 60px;
        line-height: 60px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      "
    >
      <a-space>
        <a-button @click="handleBack"> 返回列表 </a-button>
      </a-space>
    </div>
    <ImageEdit
      :imgList="previewImageList"
      :filePreviewShow="previewVisible"
      @close="handleCancelPreviewImage"
      :currentIndex="+imageIndex"
    />
    <a-modal
      title="包装选择"
      :visible="packageVisible"
      :width="600"
      @cancel="handleCancelPackage"
      :dialogStyle="{ top: '100px' }"
      destroyOnClose
    >
      <div class="details">
        <div class="table">
          <p class="table-title">商品信息</p>
          <div class="table-data">
            <a-table
              rowKey="packCode"
              :pagination="!0"
              :columns="packingColumn"
              :data-source="packageData"
              :scroll="{ y: 400 }"
            />
          </div>
        </div>
      </div>
      <template slot="footer">
        <a-button type="primary" @click="handleCancelPackage">关闭 </a-button>
      </template>
    </a-modal>
    <div style="position: fixed; bottom: 70px; right: 42px; z-index: 999999">
      <a-button type="primary" shape="circle" icon="up" @click="scrollTop" />
    </div>
  </div>
</template>

<script>
import { mixin } from "../../utils/mixins";
import {
  GetDetails,
  UpdateStatus,
  GetUploadFiles,
  ExportDetails,
  GetFeeList,
  getIds,
  getBankFlow,
  ListByApInvoiceId,
  // AuditPassReceipt,
  // AuditFailReceipt,
} from "../../services/settlement/payable/PayableVerification";
import ImageEdit from "../../components/imageEdit/imageEdit.vue";
import InvoiceList from "./invoiceList.vue";
import InvoiceAdvice from "./invoiceAdvice.vue";
const columns2 = [
  { title: "商品名称", dataIndex: "itemName", width: 200 },
  { title: "商品编码", dataIndex: "itemCode", width: 200 },
  { title: "原产国", dataIndex: "itemCountryOrigin", width: 200 },
  { title: "客户名称", dataIndex: "customerName", width: 200 },
  { title: "门店名称", dataIndex: "storeName", width: 200 },
  { title: "数量", dataIndex: "qty", width: 200 },
  { title: "计价单位", dataIndex: "priceUnit", width: 200 },
  { title: "辅助单位", dataIndex: "unit", width: 200 },
  {
    title: "采购单价",
    dataIndex: "price",
    width: 200,
    scopedSlots: { customRender: "price" },
  },
  { title: "采购净重", dataIndex: "weight", width: 200 },
  { title: "规格", dataIndex: "itemSpecName", width: 200 },
  { title: "品种", dataIndex: "itemType", width: 200 },
  { title: "等级", dataIndex: "itemLevel", width: 200 },
  { title: "品牌", dataIndex: "itemBrand", width: 200 },
  { title: "包装", dataIndex: "Packaging", width: 200 },
  { title: "包装费用(元)", dataIndex: "otherAmount", width: 200 },
  { title: "采购总额", dataIndex: "itemAmount", width: 200 },
  {
    title: "增值税",
    dataIndex: "inputTaxRate",
    width: 200,
    scopedSlots: { customRender: "inputTaxRate" },
  },
  { title: "备注", dataIndex: "remark", width: 200 },
];
const packingColumn = [
  { title: "包装名称", dataIndex: "packName", width: 100, align: "center" },
  { title: "包装编号", dataIndex: "packCode", width: 150, align: "center" },
  { title: "包装数量", dataIndex: "packQty", width: 100, align: "center" },
  {
    title: "包装价格(元)",
    dataIndex: "packUnitPrice",
    width: 110,
    align: "center",
  },
];
const columnsx = [
  { title: "交易时间", dataIndex: "transDatetime", width: 180 },
  {
    title: "关联状态",
    dataIndex: "status",
    width: 160,
    scopedSlots: { customRender: "status" },
  },
  { title: "关联账单", dataIndex: "relatedBill", width: 200 },
  { title: "本方组织", dataIndex: "orgName", width: 260 },
  { title: "本方账户银行", dataIndex: "bankName", width: 260 },
  { title: "本方账户户名", dataIndex: "accountName", width: 260 },
  {
    title: "本方账户账号",
    dataIndex: "accountNumber",
    width: 260,
    scopedSlots: { customRender: "accountNumber" },
  },
  { title: "币种", dataIndex: "currencyCode", width: 120 },
  { title: "支出", dataIndex: "outcome", width: 150 },
  { title: "对方账户户名", dataIndex: "oppAccName", width: 260 },
  {
    title: "对方账户账号",
    dataIndex: "oppAccNo",
    width: 320,
    scopedSlots: { customRender: "oppAccNo" },
  },
  { title: "对方开户行", dataIndex: "oppBank", width: 320 },
  { title: "银行流水号", dataIndex: "bankSerialNumber", width: 240 },
  { title: "用途", dataIndex: "purpose", width: 260 },
  { title: "摘要", dataIndex: "description", width: 160 },
  { title: "备注", dataIndex: "noteAppended", width: 260 },
  {
    title: "文件名",
    dataIndex: "fileName",
    width: 300,
    scopedSlots: { customRender: "fileName" },
  },
  { title: "上传人", dataIndex: "createUser", width: 160 },
  { title: "上传时间", dataIndex: "createDate", width: 180 },
];
const costColumns = [
  {
    title: "费用类型",
    dataIndex: "feeType",
    width: 180,
    scopedSlots: { customRender: "feeType" },
  },
  { title: "费用项", dataIndex: "feeName", width: 180 },
  { title: "收款主体", dataIndex: "receivingSubjectName", width: 260 },
  { title: "费用金额", dataIndex: "feeAmount", width: 180 },
  {
    title: "增值税",
    dataIndex: "rate",
    width: 200,
    scopedSlots: { customRender: "rate" },
  },
  { title: "不含税金额", dataIndex: "priceExcludingTax", width: 240 },
  { title: "币种", dataIndex: "currency", width: 160 },
  { title: "汇率", dataIndex: "exchangeRate", width: 160 },
  { title: "外币金额", dataIndex: "foreignCurrencyAmount", width: 240 },
  { title: "人民币金额", dataIndex: "currencyAmount", width: 240 },
  { title: "清关单号", dataIndex: "customsClearanceFeeNumber", width: 280 },
  { title: "备注", dataIndex: "remark", width: 280 },
];
export default {
  mixins: [mixin],
  components: {
    ImageEdit,
    InvoiceList,
    InvoiceAdvice,
  },
  data() {
    return {
      columnsx,
      bankFlowNo: undefined,
      dataTablex: [],
      packingColumn,
      packageData: [],
      packageVisible: !1,
      feeList: [],
      dataType: undefined,
      pageType: undefined,
      costColumns,
      columns2,
      columns: [
        {
          title: "采购单号",
          dataIndex: "poCode",
          width: 200,
          align: "left",
        },
        {
          title: "商品名称",
          dataIndex: "itemName",
          width: 150,
          align: "left",
        },
        {
          title: "商品编码",
          dataIndex: "itemCode",
          width: 150,
          align: "left",
        },
        {
          title: "规格",
          dataIndex: "itemSpecName",
          width: 200,
          align: "left",
        },
        {
          title: "数量",
          dataIndex: "qty",
          width: 150,
          align: "left",
        },
        {
          title: "重量(KG)",
          dataIndex: "weight",
          width: 150,
          align: "left",
        },
        {
          title: "单位",
          dataIndex: "unit",
          width: 100,
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
          dataIndex: "price",
          width: 100,
          align: "left",
        },
        {
          title: "商品金额",
          dataIndex: "itemAmount",
          width: 100,
          align: "left",
        },
        {
          title: "包装＋人工费",
          dataIndex: "otherAmount",
          width: 200,
          align: "left",
        },
        {
          title: "总金额",
          dataIndex: "settlementAmount",
          width: 100,
          align: "left",
        },
        {
          title: "增值税",
          dataIndex: "inputTaxRate",
          width: 200,
          align: "left",
          scopedSlots: { customRender: "inputTaxRate" },
        },
      ],

      pagination: {
        rows: 10,
        page: 1,
        sort: "id",
        order: "DESC",
      },
      optionx: {
        status: ["未关联", "部分关联", "已关联"],
      },
      pageState: "",
      subTitle: "",
      tableList: [],
      searchForm: {},
      spinText: "",
      spinning: false,
      imageIndex: "",
      previewImageList: [],
      previewVisible: false,
      form: {},
      invoiceList: [],
    };
  },
  computed: {
    itemAmountTo() {
      let num = 0;
      this.tableList.forEach((item) => {
        num += item?.itemAmount ?? 0;
      });
      return this.formatPrice(num);
    },
    settlementAmountTo() {
      let num = 0;
      this.tableList.forEach((item) => {
        num += item?.settlementAmount ?? 0;
      });
      return this.formatPrice(num);
    },
    passState() {
      let state = false;
      this.invoiceList.forEach((item) => {
        if (item.invoiceState == 5 || item.invoiceState == 3) {
          state = true;
        }
      });
      return state;
    },
  },
  methods: {
    invoiceChange(record, op, batch) {
      console.log(record);
      let amount = 0;
      let ids = [];
      if (batch) {
        this.invoiceList.forEach((item) => {
          amount += +item.invoiceAmount;
          ids.push(item.id || "");
        });
      }
      let form = {
        invoiceAmount: batch
          ? this.formatPrice(amount, 2)
          : record.invoiceAmount || "",
        auditMsg: op == "通过" ? "审核通过" : "",
        apInvoiceId: this.form.id || "",
        receiptIdList: batch ? ids.join(",") : record.id || "",
      };
      this.$refs.invoiceAdvice.showModal(form, op);
    },
    //发票信息
    async getInvoiceList() {
      let res = await ListByApInvoiceId({ id: this.form.id || "" });
      if (res.data.code == 200) {
        this.invoiceList = res.data.data || [];
        this.invoiceList.forEach((item, index) => {
          item.numberKey = index + 1;
        });
      } else {
        this.$message.error(res.data.message);
      }
    },
    scrollTop() {
      document
        .querySelector("#scrollTop")
        .scrollIntoView({ behavior: "smooth" });
    },
    getBankFlow(ids) {
      this.dataTablex = [];
      getBankFlow({ ids }).then((res) => {
        if (res.data.code == 200) {
          res.data.data?.map((item) => {
            item.transWay == "收入"
              ? (item.income = item.transAmount)
              : (item.outcome = item.transAmount);
          });
          this.dataTablex = res.data.data;
        }
      });
    },
    async getIds(docId) {
      let ids = [];
      this.bankFlowNo = [];
      await getIds({ relateType: 2, docId }).then((res) => {
        let bankFlowNo = [];
        res.data.data.forEach((item) => {
          ids.push(item.yocylId);
          bankFlowNo.push(item.yocylCode);
        });
        this.bankFlowNo = bankFlowNo.join(",");
        ids[0] && this.getBankFlow(ids);
      });
      return ids;
    },
    openPacking(v) {
      this.packageVisible = !0;
      this.packageData = v;
    },
    strExchange(str) {
      return String(str || "")?.replace(/(?<=.{4}).{1}(?=.{4})/g, "*");
    },
    handleCancelPackage() {
      this.packageVisible = false;
    },
    //费用
    getFeeList() {
      GetFeeList({ id: this.form?.id ?? "" }).then((res) => {
        const data = res.data;
        if (data.code == 200) {
          this.feeList = data.data || [];
        } else {
          this.$message.error(data.message || "费用项数据获取失败");
        }
      });
    },
    //导出
    exportDetails() {
      this.spinning = true;
      this.spinText = "数据导出中请稍后";
      const params = {
        id: this.form?.id ?? "",
      };
      ExportDetails(params)
        .then((res) => {
          console.log(res);
          const data = res.data;
          this.spinning = false;
          if (data) {
            const blob = new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
            });
            const url = URL.createObjectURL(blob);
            console.log(url);
            this.downloadTem(url);
          } else {
            this.$message.error("导出失败！");
          }
        })
        .catch((res) => {
          console.log(res);
          this.spinning = false;
          this.$message.error("接口请求出错");
        });
    },
    downloadTem(url) {
      let link = document.createElement("a");
      this.pageState === "payableWaitVerification"
        ? link.setAttribute("download", "应付-待核销详情")
        : link.setAttribute("download", "应付-已核销详情");
      link.setAttribute("href", url);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    async getFiles() {
      const params = new FormData();
      params.append("tableId", this.form?.id ?? "");
      params.append("tableName", "apInvoice");
      const res = await GetUploadFiles(params);
      const data = res.data?.data ?? [];
      if (data.length > 0) {
        data.forEach((item) => {
          this.previewImageList.push(item?.filePath ?? "");
        });
      } else {
        this.previewImageList = [];
      }
    },
    toAudit() {
      let state
      if (this.invoiceList&&this.invoiceList.length>0) {
        this.invoiceList.forEach(item=>{
          if (item.invoiceState!=5) {
            state=true
          }
        })
      }
      if (state) {
        this.$warning({
          centered: true,
          content:'该账单登记发票未全部审核通过，请确认',
          okText:'关闭'
        })
        return
      }
      const that = this;
      const params = {
        id: this.form?.id ?? "",
      };
      this.$confirm({
        title: "确认核销账单",
        centered: true,
        okText: "确认核销",
        content: (
          <div>
            <div>请确认是否核销此账单?</div>
            <div>账单结算金额:{that.form?.settlementAmount ?? ""}</div>
          </div>
        ),
        onOk() {
          that.spinText = "核销中";
          that.spinning = true;
          UpdateStatus(params)
            .then((res) => {
              that.spinning = false;
              const data = res.data;
              if (data.code === "200") {
                that.$message.success(data?.message ?? "核销成功");
                that.pageState = "payableVerification";
                that.subTitle = "应付已核销详情";
                that.form = data?.data ?? {};
              } else {
                that.$message.error(data?.message ?? "核销失败");
              }
            })
            .catch((error) => {
              console.log(error);
              that.spinning = false;
              that.$message.error("接口连接错误");
            });
        },
        class: "test",
      });
    },
    bigImg(index) {
      this.imageIndex = index;
      this.previewVisible = true;
    },
    handleCancelPreviewImage() {
      this.previewVisible = false;
    },
    getList() {
      const params = {
        apInvoiceId: this.form?.id ?? "",
        sort: "creat_date",
        ...this.searchForm,
      };
      this.spinText = "数据加载中";
      this.spinning = true;
      GetDetails(params)
        .then((res) => {
          const data = res.data;
          this.tableList = data.data?.list ?? [];
          this.spinning = false;
        })
        .catch((error) => {
          this.spinning = false;
          console.log(error);
        });
    },
    handleBack() {
      let a = "/balance/payable/verificationDetails",
        b;
      switch (this.pageState) {
        case "payableWaitVerification":
          b = "/balance/payable/payableWaitVerification";
          break;
        case "payableVerification":
          b = "/balance/payable/payableVerification";
          break;

        default:
          break;
      }
      this.$closePage(a, b);
    },
  },
  activated() {
    let record;
    record = undefined;
    if (Object.keys(this.$route.query).length) {
      record = this.$route.query.record;
      this.pageState = this.$route.query.state;
      this.dataType = this.$route.query.record.dataType ?? 1;
      this.getIds(record.id);
    }
    this.pageType = undefined;
    this.dataTablex[0] && (this.dataTablex = []);
    this.dataTablex[0] && (this.bankFlowNo = []);
    //! 待核销尾款《1》，待核销预付款《2》，已核销尾款《3》，已核销预付款《4》
    this.form = JSON.parse(JSON.stringify(record));
    if (this.form.state == 3 && this.dataType == 1) this.pageType = 1;
    if (this.form.state == 3 && this.dataType == 2) this.pageType = 2;
    if (this.form.state == 4 && this.dataType == 1) this.pageType = 3;
    if (this.form.state == 4 && this.dataType == 2) this.pageType = 4;
    if (this.pageType == 2 || this.pageType == 4) {
      let copyData = JSON.parse(
        JSON.stringify(record?.purchaseOrderHead ?? [])
      );
      let id = JSON.parse(JSON.stringify(record)).id;
      this.form = { ...this.form, ...copyData };
      this.form.id = id;
    }
    switch (this.pageState) {
      case "payableWaitVerification":
        this.subTitle = "应付待核销详情";
        break;
      case "payableVerification":
        this.subTitle = "应付已核销详情";
        break;

      default:
        break;
    }
    if (!record) return;
    this.getList();
    this.getFeeList();
    this.getFiles();
    //发票
    this.getInvoiceList();
  },
};
</script>

<style lang="less" scoped>
@import "index";
.uploadImg {
  position: relative;
  border-radius: 4px;
  width: 150px;
  height: 200px;
  border: 1px solid #d9d9d9;
  padding: 14px;
  margin-bottom: 4px;
}
.operation {
  margin-top: 10px;
}
/deep/.ant-form-item {
  margin-bottom: 0;
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
    width: 150px;
    height: 200px;
    border: 1px solid #d9d9d9;
    padding: 14px;
    margin-bottom: 4px;
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