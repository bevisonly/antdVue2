<template>
  <!-- <a-modal
    :width="1200"
    class="modalTop"
    :dialogStyle="{ top: '30px' }"
    v-model="visibleForm"
    title="采购单"
    :maskClosable="false"
    :footer="null"
    @cancel="cancelModalForm"
  > -->
  <div>
    <div class="back-btn">
      <a-button type="primary" @click="backToMainPage" icon="left"
        >返回</a-button
      >
    </div>
    <div class="topBox" style="margin-top: 10px">
      <p class="topP">基本信息</p>
      <a-row class="rowTop">
        <a-col :span="10">
          <span class="spanStyle">供应商名称: </span>
          <a-select
            style="width: 307.778px"
            show-search
            v-model.trim="valueOption"
            placeholder="请输入商品名称"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            @search="handleSearch"
            @focus="handleSearch"
            @change="handleChangeOption"
          >
            <a-select-option v-for="item in supplierNameList" :key="item.id">
              {{ item.partnerName }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :span="6"><span class="spanStyle" style="line-height: 32.5px">供应商账户: </span>{{ dataBaseInfo.buyerAccount }}</a-col>
        <a-col :span="8"><span class="spanStyle" style="line-height: 32.5px"><span class="redfont">*</span>入库仓库: </span>
          <a-select v-model="dataBaseInfo.whId" @select="selectWarehouse" style="width: 78%;max-width: 280px;" show-search :filter-option="filterOption">
            <a-select-option v-for="(item, j) in select.warehouse" :value="item.baseId" :key="j">{{item.name}}</a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row class="rowBottom">
        <a-col :span="10"
          ><span class="spanStyle" style="float: left; margin-right: 4px"
            >需求订单编号: </span
          ><span style="background-color: #fafafa">{{
            dataBaseInfo.sno
          }}</span></a-col
        >
        <a-col :span="12"
          ><span class="spanStyle" style="float: left">销售订单编号：</span
          ><span style="background-color: #fafafa">{{
            dataBaseInfo.soSno
          }}</span></a-col
        >
      </a-row>
      <a-row
        class="rowBottomOfSubInfo"
        v-for="(item, i) in supplierPayAmount"
        :key="i"
      >
        <a-col :span="10"
          ><span class="spanStyle">供应商名称: </span>
          <p style="margin-top: 7px; padding-left: 11px">
            <span style="background-color: #f7f7f7">{{
              item.supplierName
            }}</span>
          </p>
        </a-col>
        <a-col :span="6"
          ><span class="spanStyle">预付款：</span>
          <a-input-number v-model="item.payAmount"></a-input-number>
        </a-col>
      </a-row>
    </div>
    <div class="bottomBox">
      <p class="topP flex-sb">
        <span>
          <span style="margin-right: 12px">商品信息</span>
          <a-button-group>
            <a-button
              size="small"
              icon="user"
              :type="
                whichTable == 'columnsPurchaseCustomer' ? 'primary' : 'default'
              "
              @click="changeTable('columnsPurchaseCustomer')"
              >按客户采购</a-button
            >
            <a-button
              size="small"
              icon="shopping"
              :type="
                whichTable == 'columnsPurchaseCustomer' ? 'default' : 'primary'
              "
              @click="changeTable('columnsPurchaseCommodity')"
              >按商品采购</a-button
            >
          </a-button-group>
        </span>
        <a-button
          size="small"
          icon="check-circle"
          type="primary"
          @click="purchaseOk"
          :loading="loading"
          >确认采购</a-button
        >
      </p>
      <a-table
        class="tableStyle"
        bordered
        ref="tableRef"
        :columns="
          whichTable == 'columnsPurchaseCustomer'
            ? columnsPurchaseCustomer
            : columnsPurchaseCommodity
        "
        :data-source="dataTable"
        :pagination="false"
        rowKey="id"
        :scroll="{ x: 307.778 }"
        size="small"
      >
        <template tips="商品名称" slot="itemName" slot-scope="text, record">
          <div :key="record.itemName" v-if="typeof record.deletIdFlag == 'number' ? true : false" >
          <a-select
            class="selectOption"
            show-search
            v-model.trim="record.itemName"
            placeholder="请输入商品名称"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            @search="getItemNameOption($event)"
            @change="() => handleChange(record.itemName, record.key, 'itemName', record.id,record)"
            @popupScroll='handlePopupScroll'
          >
            <div slot="dropdownRender" slot-scope="menu">
              <v-nodes :vnodes="menu" />
              <div style="padding: 0 8px 4px; cursor: pointer" @mousedown="(e) => e.preventDefault()">
                <div style="text-align: center;padding-top: 4px;">
                  <a-spin v-show="spinning && itemNameNameList[0]" />
                </div>
              </div>
            </div>
            <a-select-option v-for="item in itemNameNameList" :key="item.id" :value="item.itemName + '+' + item.id + '+@@'">{{item.itemName}}</a-select-option>
          </a-select>
          </div>
          <span :key="record.itemName" v-else>{{record.itemName}}</span>
        </template>
        <span class="required" slot="supplierNameIcon">供应商</span>
        <template
          tips="供应商名称"
          slot="supplierName"
          slot-scope="text, record"
        >
          <div :key="record.supplierName">
            <a-select
              class="selectOption"
              placeholder="必填"
              v-model="record.supplierName"
              show-search
              @search="handleSearch"
              @change="() => handleChange(record.supplierName,record.key,'supplierName',record.id,record)"
            >
              <a-select-option
                v-for="item in supplierNameList"
                :key="item.id"
                :value="item.partnerName + '+' + item.id + '+##'"
              >
                {{ item.partnerName }}
              </a-select-option>
            </a-select>
          </div>
        </template>
        <span slot="contractIdIcon">关联合同</span>
        <!-- <span class="required" slot="contractIdIcon">关联合同</span> -->
        <!-- //! glht -->
        <template tips="关联合同" slot="contractId" slot-scope="text, record, index" >
          <div :key="index">
            <a-select
              style="width: 100%;"
              show-search
              v-model="record.contractId"
              placeholder="请先选择供应商"
              :default-active-first-option="false"
              :filter-option="false"
              :not-found-content="null"
              :disabled="!record.supplierId || isUndef(record.supplierId)"
              @search="contract"
              @select="contractSelect(record.contractId,record)"
              @focus="contract(undefined,record)"
            >
              <a-select-option v-for="item in (record.contractOption || [])" :key="item.id">{{item.contractTitle}}&{{item.contractNumber}}</a-select-option>
            </a-select>
          </div>
        </template>
        <template tips="门店名称" slot="storeName" slot-scope="text, record">
          <div
            :key="record.storeName"
            v-if="typeof record.deletIdFlag == 'number' && whichTable == 'columnsPurchaseCustomer' ? true : false"
          >
            <a-select
              class="selectOption"
              placeholder="必填"
              v-model="record.storeName"
              @change="() => handleChange(record.storeName,record.key,'storeName',record.id)"
              show-search
              :filter-option="filterOption"
            >
              <a-select-option
                v-for="item in record.storeNameList"
                :key="item.id"
                :value="item.partnerName + '+' + item.id + '+???'"
              >
                {{ item.partnerName }}
              </a-select-option>
            </a-select>
          </div>
          <span v-else>{{ record.storeName }}</span>
        </template>
        <template tips="客户名称" slot="customerName" slot-scope="text, record">
          <div
            :key="record.customerName"
            v-if="typeof record.deletIdFlag == 'number' && whichTable == 'columnsPurchaseCustomer' ? true : false "
          >
            <a-select
              class="selectOption"
              placeholder="必填"
              v-model="record.customerName"
              @change="
                () =>
                  handleChange(
                    record.customerName,
                    record.key,
                    'customerName',
                    record.id
                  )
              "
            >
              <a-select-option
                v-for="item in customerNameList"
                :key="item.id"
                :value="
                  item.partnerName +
                  '+' +
                  item.id +
                  '+^^^' +
                  JSON.stringify(item.partners)
                "
              >
                {{ item.partnerName }}
              </a-select-option>
            </a-select>
          </div>
          <span v-else>{{ record.customerName }}</span>
        </template>
        <template tips="规格" slot="itemSpec" slot-scope="text, record">
          <div
            :key="record.itemSpec"
            v-if="typeof record.deletIdFlag == 'number' &&whichTable == 'columnsPurchaseCustomer'? true: false"
          >
            <a-select
              style="width: 100%"
              v-model="record.itemSpec"
              @change="() =>handleChange(record.itemSpec,record.key,'itemSpec',record.id)"
            >
              <a-select-option v-for="specName in itemSpecOption" :key="specName">{{specName}}</a-select-option>
            </a-select>
          </div>
          <span v-else>{{ record.itemSpec }}</span>
        </template>
        <template tips="销售订单数" slot="soQty" slot-scope="text, record">
          <div
            :key="record.soQty"
            v-if="
              typeof record.deletIdFlag == 'number' &&
              whichTable == 'columnsPurchaseCustomer'
                ? true
                : false
            "
          >
            <a-input-number
              v-model="record.soQty"
              @change="
                () => handleChange(record.soQty, record.key, 'soQty', record.id)
              "
            />
          </div>
          <span v-else>{{ record.soQty }}</span>
        </template>
        <template tips="销售价格" slot="salePrice" slot-scope="text, record">
          <a-input-number
            v-model="record.salePrice"
            @change="
              () =>
                handleChange(
                  record.salePrice,
                  record.key,
                  'salePrice',
                  record.id
                )
            "
          />
        </template>
        <span slot="poQtyIcon"><span class="redfont">*</span> 采购数量</span>
        <template tips="采购数量" slot="poQty" slot-scope="text, record">
          <a-input-number
            v-model="record.poQty"
            placeholder="必填"
            @change="
              () => handleChange(record.poQty, record.key, 'poQty', record.id)
            "
          />
          <!-- :precision='0' -->
        </template>
        <span slot="poPriceIcon"><span class="redfont">*</span> 采购价格</span>
        <template tips="采购价格" slot="poPrice" slot-scope="text, record">
          <a-input-number
            v-model="record.poPrice"
            placeholder="必填"
            @change="
              () =>
                handleChange(record.poPrice, record.key, 'poPrice', record.id)
            "
          />
        </template>
        <template tips="辅助单位" slot="unit" slot-scope="text, record">
          <div
            :key="record.unit"
            v-if="
              typeof record.deletIdFlag == 'number' &&
              whichTable == 'columnsPurchaseCustomer'
                ? true
                : false
            "
          >
            <a-input
              v-model="record.unit"
              @change="
                () => handleChange(record.unit, record.key, 'unit', record.id)
              "
            />
          </div>
          <span v-else>{{ record.unit }}</span>
        </template>
        <template tips="采购在途库存" slot="sumQty" slot-scope="text, record">
          <div
            :key="record.sumQty"
            v-if="
              typeof record.deletIdFlag == 'number' &&
              whichTable == 'columnsPurchaseCustomer'
                ? true
                : false
            "
          >
            <a-input-number
              v-model="record.sumQty"
              @change="
                () =>
                  handleChange(record.sumQty, record.key, 'sumQty', record.id)
              "
            />
          </div>
          <span v-else>{{ record.sumQty }}</span>
        </template>
        <template tips="仓库库存量" slot="stock" slot-scope="text, record">
          <div
            :key="record.stock"
            v-if="
              typeof record.deletIdFlag == 'number' &&
              whichTable == 'columnsPurchaseCustomer'
                ? true
                : false
            "
          >
            <a-input
              v-model="record.stock"
              @change="
                () => handleChange(record.stock, record.key, 'stock', record.id)
              "
            />
          </div>
          <span v-else>{{ record.stock }}</span>
        </template>
        <span class="required" slot="priceUnitIcon">计价单位</span
        >
        <template tips="计价单位" slot="priceUnit" slot-scope="text, record">
          <div :key="record.priceUnit">
            <a-select
              v-model="record.priceUnit"
              placeholder="必填"
              style="width: 100%"
              @change="
                () =>
                  handleChange(
                    record.priceUnit,
                    record.key,
                    'priceUnit',
                    record.id
                  )
              "
            >
              <a-select-option
                v-for="(item, i) in priceUnit"
                :key="i"
                :value="item.dicText"
              >
                {{ item.dicText }}
              </a-select-option>
            </a-select>
          </div>
        </template>
        <template tips="包装" slot="packingName" slot-scope="text, record">
          <span
            class="greenfont paintfonthover cursorPin"
            style="margin-right: 5px"
            @click="() => btnPackageSelectModal(record.id, record.pkgDetails)"
            >包装选择</span
          >
        </template>
        <template tips="包装费" slot="packingCost" slot-scope="text, record">
          <span style="margin-right: 5px">{{
            (record.pkgDetails
              .reduce((total, currentValue) => {
                return (
                  total + currentValue.packQty * currentValue.packUnitPrice
                );
              }, 0)
              .toFixed(8) *
              100000000) /
            100000000
          }}</span>
        </template>
        <span class="required" slot="invoiceBusinessTypeTit">发票类型</span>
          <span slot="invoiceBusinessType" slot-scope="text, record">
            <a-select
              v-model="record.invoiceBusinessType"
              @click.stop.native
              placeholder=""
              style="width: 40%">
              <a-select-option :value='0'>应税业务</a-select-option>
              <a-select-option :value='1'>免税业务</a-select-option>
            </a-select>
            <a-select
              v-model="record.invoiceType"
              @click.stop.native
              placeholder=""
              style="width: 60%">
              <a-select-option v-for="(item,index) in invoiceOption" :key="index" :value='item.value' :title='item.text'>
                {{item.text}}
              </a-select-option>
            </a-select>
        </span>
        <span class="required" slot="inputTaxRateIcon">税率/抵扣率(%)</span>
        <template tips="进项税" slot="inputTaxRate" slot-scope="text, record">
          <span style="width: 40%">
              <span v-if="record.invoiceType==3">抵扣率</span>
              <span v-if='record.invoiceType==1||record.invoiceType==2'>税率</span>
          </span>
          <a-select
            style="width: 50%;margin-left:2px"
            allowClear
            v-model="record.inputTaxRate"
            @change="
              () =>
                handleChange(
                  record.priceUnit,
                  record.key,
                  'priceUnit',
                  record.id
                )
            "
          >
            <a-select-option value="0">{{ "0" }}</a-select-option>
            <a-select-option value="1">{{ "1" }}</a-select-option>
            <a-select-option value="3">{{ "3" }}</a-select-option>
            <a-select-option value="6">{{ "6" }}</a-select-option>
            <a-select-option value="9">{{ "9" }}</a-select-option>
            <a-select-option value="11">{{ "11" }}</a-select-option>
            <a-select-option value="13">{{ "13" }}</a-select-option>
          </a-select>
        </template>
        <template tips="采购总金额" slot="soAmount" slot-scope="text, record">
          <span style="margin-right: 5px">{{formatPrice(record.poQty * record.poPrice)}}</span>
        </template>
        <template tips="新增" slot="newlyAdded" slot-scope="text, record">
          <a-button-group
            v-if="
              record.btnDeleteFlag !== 1 &&
              whichTable == 'columnsPurchaseCustomer'
                ? true
                : false
            "
          >
            <a-button
              size="small"
              icon="plus"
              title="新增"
              v-if="typeof record.deletIdFlag == 'number' ? false : true"
              type="primary"
              @click="addAData(record.id, record, '1')"
            ></a-button>
            <a-button
              size="small"
              icon="minus"
              title="删除"
              type="primary"
              @click="deleteAData(record.id, record.deletIdFlag, '0')"
            ></a-button>
          </a-button-group>
        </template>
        <template tips="操作" slot="operation" slot-scope="text, record">
          <span
            class="greenfont paintfonthover cursorPin"
            style="margin-right: 5px"
            @click="
              btnSplitOrder(
                record.ultimateParentId,
                record.poQty,
                record,
                record.id
              )
            "
            >拆单</span
          >
          <a-popconfirm
            v-if="record.btnDeleteFlag == 1 ? true : false"
            title="确定要删除吗?"
            @confirm="
              () =>
                onDelete(
                  record.id,
                  record.supplierName,
                  record.ultimateParentId,
                  record.poQty
                )
            "
          >
            <span class="redfont paintfonthover cursorPin">删除&nbsp;</span>
          </a-popconfirm>
        </template>
        <template tips="合计" slot="footer" slot-scope="currentPageData">
          合计：<span class="greyfont">采购数量</span>(<span class="redfont">
            {{
              currentPageData.reduce((total, currentValue) => {
                return typeof (total + Number(currentValue.poQty))
                  ? total + Number(currentValue.poQty)
                  : "-";
              }, 0)
            }}</span
          >)<a-divider type="vertical" />
          <!-- 此处return typeof()判断一下，是防止数据首条数据为0时，导致数据误判为字符串拼接而非数字之间累加，虽然依旧是number类型 -->
          <span class="greyfont">采购商品总金额</span>(<span class="redfont">
            {{
              isNaN(
                Math.abs(
                  (Number(
                    currentPageData.reduce((total, currentValue) => {
                      return typeof (
                        total +
                        Number(currentValue.poQty) *
                          Number(currentValue.poPrice)
                      )
                        ? total +
                            Number(currentValue.poQty) *
                              Number(currentValue.poPrice)
                        : "-";
                    }, 0)
                  ).toFixed(8) *
                    100000000) /
                    100000000
                )
              )
                ? "-"
                : Math.abs(
                    (Number(
                      currentPageData.reduce((total, currentValue) => {
                        return typeof (
                          total +
                          Number(currentValue.poQty) *
                            Number(currentValue.poPrice)
                        )
                          ? total +
                              Number(currentValue.poQty) *
                                Number(currentValue.poPrice)
                          : "-";
                      }, 0)
                    ).toFixed(8) *
                      100000000) /
                      100000000
                  )
            }}</span
          >)
        </template>
      </a-table>
    </div>
    <a-modal
      title="保存成功"
      :visible="visiblePurchaseOk"
      :width="700"
      @ok="handlePurchaseOk"
      @cancel="handleCancelPurchase"
    >
      <a-row v-for="(item, i) in resYes" :key="i">
        <a-col :span="12"
          ><span style="float: left">采购订单号：</span
          ><span style="background-color: #e6e6e6; margin-right: 10px">{{
            item.poCode
          }}</span></a-col
        >
        <a-col :span="12"
          ><span style="float: left">采购账户：</span
          ><span style="background-color: #e6e6e6">{{
            item.supplierName
          }}</span></a-col
        >
      </a-row>
    </a-modal>
    <modalPackageSelect ref="modalPackageSelectRef"></modalPackageSelect>
    <modalSplitOrder ref="modalSplitOrderRef"></modalSplitOrder>
  </div>
  <!-- </a-modal> -->
</template>
<script>
import {
  requireOrderDoTransferPurchase,
  dictionaryLList,
  requireOrderNewtransferPurchase,
  commodityName,
  taxrateGetTaxRateByPartner,
  requireOrderGetSalePrice,
  partnerPartnerCascadeList,
  getWarehouse,
  contract
} from "@/services/purchaseNeed.js";
import { itemSpecListPage } from "@/services/commoditySpecs.js";
import { partnerType } from "@/services/userMa.js"
import modalPackageSelect from "./modalPackageSelect";
import modalSplitOrder from "./modalSplitOrder";
import { throttle } from "../../utils/tool";
import { isFalse, debounce } from "../../utils/util";
//! 按商品采购
const columnsPurchaseCommodity = [
  {
    title: "商品名称",
    align: "center",
    dataIndex: "itemName",
    key: "itemName",
    width: 240,
    scopedSlots: { customRender: "itemName" },
  },

  {
    title: "规格",
    align: "center",
    dataIndex: "itemSpec",
    key: "itemSpec",
    width: 140,
    scopedSlots: { customRender: "itemSpec" },
  },
  {
    title: "销售订单数",
    align: "center",
    dataIndex: "soQty",
    key: "soQty",
    width: 110,
    scopedSlots: { customRender: "soQty" },
  },
  {
    slots: { title: "poQtyIcon" },
    align: "center",
    dataIndex: "poQty",
    key: "poQty",
    width: 110,
    scopedSlots: { customRender: "poQty" },
  },
  {
    slots: { title: "poPriceIcon" },
    align: "center",
    dataIndex: "poPrice",
    key: "poPrice",
    width: 120,
    scopedSlots: { customRender: "poPrice" },
  },
  {
    title: "包装",
    align: "center",
    dataIndex: "packingName",
    key: "packingName",
    width: 120,
    scopedSlots: { customRender: "packingName" },
  },
  {
    slots: { title: "priceUnitIcon" },
    align: "center",
    dataIndex: "priceUnit",
    key: "priceUnit",
    width: 110,
    scopedSlots: { customRender: "priceUnit" },
  },
  {
    title: "采购订单总金额",
    align: "center",
    dataIndex: "soAmount",
    key: "soAmount",
    width: 120,
    scopedSlots: { customRender: "soAmount" },
  },
  {
    slots: { title: "supplierNameIcon" },
    align: "center",
    dataIndex: "supplierName",
    key: "supplierName",
    width: 260,
    scopedSlots: { customRender: "supplierName" },
  },
  {
    slots: { title: "contractIdIcon" },
    align: "center",
    dataIndex: "contractId",
    key: "contractId",
    width: 300,
    scopedSlots: { customRender: "contractId" },
  },
  {
    slots: { title: "invoiceBusinessTypeTit" },
    align: "center",
    dataIndex: "invoiceBusinessType",
    key: "invoiceBusinessType",
    width: 280,
    scopedSlots: { customRender: "invoiceBusinessType" },
  },
  {
    slots: { title: "inputTaxRateIcon" },
    align: "center",
    dataIndex: "inputTaxRate",
    key: "inputTaxRate",
    width: 150,
    scopedSlots: { customRender: "inputTaxRate" },
  },
  {
    title: "辅助单位",
    align: "center",
    dataIndex: "unit",
    key: "unit",
    width: 90,
    scopedSlots: { customRender: "unit" },
  },
  {
    title: "采购在途库存",
    align: "center",
    dataIndex: "sumQty",
    key: "sumQty",
    width: 120,
    scopedSlots: { customRender: "sumQty" },
  },
  {
    title: "仓库库存量",
    align: "center",
    dataIndex: "stock",
    key: "stock",
    width: 120,
    scopedSlots: { customRender: "stock" },
  },
  {
    title: "包装费",
    align: "center",
    dataIndex: "packingCost",
    key: "packingCost",
    width: 120,
    scopedSlots: { customRender: "packingCost" },
  },
  {
    title: "操作",
    align: "center",
    fixed: "right",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    width: 140,
  },
];
//! 按客户采购
const columnsPurchaseCustomer = [
  {
    title: "新增",
    align: "center",
    dataIndex: "newlyAdded",
    scopedSlots: { customRender: "newlyAdded" },
    width: 80,
  },
  {
    title: "商品名称",
    align: "center",
    dataIndex: "itemName",
    key: "itemName",
    width: 240,
    scopedSlots: { customRender: "itemName" },
  },

  {
    title: "规格",
    align: "center",
    dataIndex: "itemSpec",
    key: "itemSpec",
    width: 240,
    scopedSlots: { customRender: "itemSpec" },
  },
  {
    title: "销售订单数",
    align: "center",
    dataIndex: "soQty",
    key: "soQty",
    width: 110,
    scopedSlots: { customRender: "soQty" },
  },
  {
    title: "销售价格",
    align: "center",
    dataIndex: "salePrice",
    key: "salePrice",
    width: 110,
    scopedSlots: { customRender: "salePrice" },
  },
  {
    slots: { title: "poQtyIcon" },
    align: "center",
    dataIndex: "poQty",
    key: "poQty",
    width: 110,
    scopedSlots: { customRender: "poQty" },
  },
  {
    slots: { title: "poPriceIcon" },
    align: "center",
    dataIndex: "poPrice",
    key: "poPrice",
    width: 120,
    scopedSlots: { customRender: "poPrice" },
  },

  {
    slots: { title: "priceUnitIcon" },
    align: "center",
    dataIndex: "priceUnit",
    key: "priceUnit",
    width: 110,
    scopedSlots: { customRender: "priceUnit" },
  },
  {
    title: "采购订单总金额",
    align: "center",
    dataIndex: "soAmount",
    key: "soAmount",
    width: 120,
    scopedSlots: { customRender: "soAmount" },
  },
  {
    slots: { title: "supplierNameIcon" },
    align: "center",
    dataIndex: "supplierName",
    key: "supplierName",
    width: 260,
    scopedSlots: { customRender: "supplierName" },
  },
  {
    slots: { title: "contractIdIcon" },
    align: "center",
    dataIndex: "contractId",
    key: "contractId",
    width: 300,
    scopedSlots: { customRender: "contractId" },
  },
  {
    slots: { title: "invoiceBusinessTypeTit" },
    align: "center",
    dataIndex: "invoiceBusinessType",
    key: "invoiceBusinessType",
    width: 280,
    scopedSlots: { customRender: "invoiceBusinessType" },
  },
    {
    slots: { title: "inputTaxRateIcon" },
    align: "center",
    dataIndex: "inputTaxRate",
    key: "inputTaxRate",
    width: 150,
    scopedSlots: { customRender: "inputTaxRate" },
  },
  {
    title: "客户名称",
    align: "center",
    dataIndex: "customerName",
    key: "customerName",
    width: 280,
    scopedSlots: { customRender: "customerName" },
  },
  {
    title: "门店名称",
    align: "center",
    dataIndex: "storeName",
    key: "storeName",
    width: 240,
    scopedSlots: { customRender: "storeName" },
  },

  {
    title: "辅助单位",
    align: "center",
    dataIndex: "unit",
    key: "unit",
    width: 90,
    scopedSlots: { customRender: "unit" },
  },
  {
    title: "采购在途库存",
    align: "center",
    dataIndex: "sumQty",
    key: "sumQty",
    width: 120,
    scopedSlots: { customRender: "sumQty" },
  },
  {
    title: "仓库库存量",
    align: "center",
    dataIndex: "stock",
    key: "stock",
    width: 120,
    scopedSlots: { customRender: "stock" },
  },
  {
    title: "包装",
    align: "center",
    dataIndex: "packingName",
    key: "packingName",
    width: 120,
    scopedSlots: { customRender: "packingName" },
  },
  {
    title: "包装费",
    align: "center",
    dataIndex: "packingCost",
    key: "packingCost",
    width: 120,
    scopedSlots: { customRender: "packingCost" },
  },
  {
    title: "操作",
    align: "center",
    fixed: "right",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    width: 100,
  },
];
export default {
  components: {
    modalPackageSelect,
    modalSplitOrder,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
  name: "modalForm",
  data() {
    return {
      spinning: false,
      //免税二期
      invoiceOption:[
        {value:1,text:'增值税普通发票'},
        {value:2,text:'增值税专用发票'},
        {value:3,text:'增值税普通发票(免税)'}
      ],
      visibleForm: false,
      visiblePackageSelectModal: false,
      visibleSplitOrder: false,
      visiblePurchaseOk: false,
      supplierBox: {
        supplier: "",
      },
      supplierPayAmount: [],
      resYes: [],
      supplierPayAmountTempCopy: [],
      supplierNameList: [],
      itemNameNameList: [],
      storeNameList: [],
      customerNameList: [],
      valueOption: undefined,
      supplierMaterial: {},
      itemSpecOption: [],
      itemNameData: [],
      whichTable: "columnsPurchaseCustomer",
      columnsPurchaseCommodity,
      columnsPurchaseCustomer,
      dataBaseInfo: {},
      loading: false,
      dataTable: [],
      dataTableRequireOrderOrg: [],
      priceUnit: [],
      databaseDate: [],
      opObject: {},
      commonId: "",
      splitId: "",
      forMergeId: "",
      select: {},
      rowData: {},
      productSearchName: undefined,
      paginationSelect: {
        page: 1,
        rows: 100,
        total: 0,
      },
    };
  },
  methods: {
    handlePopupScroll(e) {
      if (e.target.scrollTop + e.target.offsetHeight > e.target.scrollHeight - 4) {
        if (this.paginationSelect.page >= this.paginationSelect.total) {
          return false;
        }
        this.spinning = true
        this.getItemNameOption(this.productSearchName || "", "srcoll");
      }
    },
    clearContract(record) {
      record.contractId = undefined
      record.contractTitle = undefined
      this.contract(undefined, record)
    },
    contract(contractTitle, record) {
      this.typeis(record, 'object') && (this.rowData = record)
      if (this.isUndef(this.rowData.supplierId)) return
      contract({partnerId: this.rowData.supplierId ?? '', contractTitle}).then(res => {
        if (res.data.code == 200) {
          this.rowData.contractOption = res.data.data
          if(this.rowData.contractId && this.rowData.contractOption.every(vip => vip.id != this.contractRowData.contractId)) {
            this.rowData.contractOption.unshift({id: this.rowData.contractId, contractTitle: this.rowData.contractTitle})
          }
        } else {
          this.rowData.contractOption.splice(0)
        }
        this.$forceUpdate()
      }).catch(() => {
        this.rowData.contractOption.splice(0)
        this.$forceUpdate()
      })
    },
    contractSelect(id, record) {
      let contractMsg = record.contractOption.find(item => item.id === id)
      record.contractTitle = contractMsg.contractTitle
      this.$forceUpdate()
    },
    dutyFreeStateChange(){
      this.$forceUpdate()
    },
    backToMainPage() {
      this.$closePage(
        "/enterSaleStore/purchase/requireOrderConfirm",
        "/enterSaleStore/purchase/requireOrder"
      );
    },
    selectWarehouse(v) {
      let warehouseResult = {}
      warehouseResult = this.select.warehouse.find(h => h.baseId == v) ?? {}
      this.dataBaseInfo.whId = warehouseResult.baseId
      this.dataBaseInfo.whCode = warehouseResult.code
      this.dataBaseInfo.whName = warehouseResult.name
    },
    getWarehouse() {
      getWarehouse({}).then(res => {
        if (res.data.code == "200") {
          res.data.data.find(x => {
            x.baseId = +x.baseId
            return !1
          })
          this.select.warehouse = res.data.data
        }
      });
    },
    async getRate(supplierId, itemId) {
      let inputTaxRate;
      const params = {
        partnerId: supplierId,
        itemDtos: [{ id: itemId }],
      };
      await taxrateGetTaxRateByPartner(params).then((res) => {
        if (res.data.code == 200) {
          inputTaxRate =
            res.data.data[0].inputTaxRate == undefined
              ? ""
              : res.data.data[0].inputTaxRate;
        }
      });
      return inputTaxRate;
    },
    async getPrice(itemId, supplierId) {
      let price;
      const params = {
        proId: itemId,
        customerId: supplierId,
      };
      await requireOrderGetSalePrice(params).then((res) => {
        if (res.data.code == 200) {
          price = res.data.data == undefined ? "" : res.data.data.salePrice;
        }
      });
      return price;
    },
    async getDataTable(id) {
      const params = {
        roIds: id instanceof Array ? id.join(",") : id,
        model: this.whichTable == "columnsPurchaseCustomer" ? 1 : 2,
      };
      await requireOrderNewtransferPurchase(params).then((res) => {
        if (this.typeis(res.data.data.requireOrder.purchaseList) !== "array")
          return;
        for (
          let i = 0;
          i < res.data.data.requireOrder.purchaseList.length;
          i++
        ) {
          for (
            let j = i + 1;
            j < res.data.data.requireOrder.purchaseList.length;
            j++
          ) {
            if (
              res.data.data.requireOrder.purchaseList[i].id ==
              res.data.data.requireOrder.purchaseList[j].id
            ) {
              res.data.data.requireOrder.purchaseList[j].id =
                res.data.data.requireOrder.purchaseList[j].id + j;
              res.data.data.requireOrder.purchaseList[j].speciousDeletFalgeId =
                res.data.data.requireOrder.purchaseList[j].id;
            }
          }
        }
        this.dataBaseInfo = res.data.data.requireOrder;
        res.data.data.requireOrder.purchaseList.forEach((item) => {
          item.invoiceBusinessType = undefined
          item.invoiceType = undefined
          if (typeof item.poQty !== "number") {
            item.poQty = "0";
          }
          if (item.poPrice == 0) {
            delete item.poPrice;
          }
          if (typeof item.poPrice == "number") {
            item.poPriceFlag = "1";
          }
          item.salePrice =
            typeof item.salePrice == "number" ? item.salePrice : "";
          item.pkgDetails =
            item.pkgDetails instanceof Array ? item.pkgDetails : [];
          if (!item.pkgDetails) {
            item.pkgDetails = [];
          }
          item.flag = 3;
          item.ultimateParentId = item.id;
        });
        this.opObject.opCode = res.data.data.requireOrder.opCode || "";
        this.opObject.opId = res.data.data.requireOrder.opId || "";
        this.opObject.opName = res.data.data.requireOrder.opName || "";
        this.opObject.marketId = res.data.data.requireOrder.marketId || "";
        this.opObject.buyerAccountId = res.data.data.requireOrder.buyerId || "";
        this.opObject.buyerAccountCode =
          res.data.data.requireOrder.buyerCode || "";
        this.opObject.buyerAccountName =
          res.data.data.requireOrder.buyerAccount || "";
        this.opObject.roCode = res.data.data.requireOrder.roCode || "";
        res.data.data.requireOrder.purchaseList.map((val) => {
          this.supplierNameList.find((item) => {
            if (val.supplierId == item.id) val.supplierName = item.partnerName;
            return val.supplierId == item.supplierId;
          });
        });
        this.dataTable = res.data.data.requireOrder.purchaseList;
        this.dataTableRequireOrderOrg = res.data.data.requireOrderOrg;
        this.getSupplierPayAmount();
      });
      for (let i = 0; i < this.dataTable.length; i++) {
        if (this.dataTable[i].supplierId && this.dataTable[i].itemId) {
          await this.getRate(
            this.dataTable[i].supplierId,
            this.dataTable[i].itemId
          ).then((res) => {
            this.dataTable[i].inputTaxRate = res;
          });
        }
        if (
          this.dataTable[i].supplierId &&
          this.dataTable[i].itemId &&
          this.dataTable[i].poPriceFlag !== "1"
        ) {
          await this.getPrice(
            this.dataTable[i].itemId,
            this.dataTable[i].supplierId
          ).then((res) => {
            this.dataTable[i].poPrice = res;
          });
        }
      }
      this.dataTable = [...this.dataTable];
      //免税相关20220727
      // this.dataTable.forEach(item=>{
      //   item.invoiceBusinessType=''
      //   item.invoiceType=''
      // })
      //------------
    },
    // openModal(id) {
    //   this.commonId = id;
    //   this.getDataTable(id);
    //   this.loading = false;
    //   // this.visibleForm = true;
    // },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toUpperCase()
          .indexOf(input.toUpperCase()) >= 0
      );
    },
    getSupplierPayAmount() {
      let name = [];
      let id = [];
      this.dataTable.forEach((item) => {
        if (item.supplierName) {
          name.push(item.supplierName)
          id.push(item.supplierId)
          this.supplierPayAmountTempCopy.push({
            supplierId: item.supplierId,
            supplierName: item.supplierName,
            payAmount: "",
          })
        }
      })
      this.supplierPayAmount.splice(0)
      this.supplierPayAmountTempCopy.forEach((vip) => {
        let nameIf = this.supplierPayAmount.some((test) => test.supplierName === vip.supplierName)
        if (name.includes(vip.supplierName) && id.includes(vip.supplierId) && !nameIf) {
          this.supplierPayAmount.push(vip)
        } else {
          this.supplierPayAmount.find((svip, j) => {
            if (!name.includes(svip.supplierName)) {
              delete this.supplierPayAmount(j,1)
            }
          })
        }
      })
    },
    changeTable(flag) {
      this.whichTable = flag;
      this.getDataTable(this.commonId);
    },
    getCustomerNameValue() {
      partnerPartnerCascadeList({ type: 20 }).then((res) => {
        if (res.data.code == 200) {
          this.customerNameList =
            this.typeis(res.data.data) == "array" ? res.data.data : [];
        }
      });
    },
    getItemSpecsValue() {
      itemSpecListPage({}).then((res) => {
        this.itemSpecOption = []
        res.data.rows.forEach(item => {
          !this.itemSpecOption.includes(item.specName) && this.itemSpecOption.push(item.specName)
        })
      });
    },
   getItemNameOption: debounce(function(value, state) {
      this.productSearchName = value
      this.paginationSelect.page = state ? this.paginationSelect.page + 1 : 1
      const params = {
        likeItemName: value,
        page: this.paginationSelect.page,
        rows: this.paginationSelect.rows,
      }
      commodityName(params).then(res => {
        if (res.data.code == '200') {
          this.spinning = false
          this.itemNameNameList = state ? this.itemNameNameList?.concat(res.data.data) : res.data.data
          this.itemNameData = state ? this.itemNameData?.concat(res.data.data) : res.data.data
          this.paginationSelect.total = res.data.totalPage || 0
        }
      }).catch(() => {
        this.spinning = false
      })
    }, 1000),
    getPriceUnit() {
      dictionaryLList({type: 10}).then((res) => {
        if (res.data.code == "200") {
          for (let i = 0; i < res.data.data.length; i++) {
            for (let j = i + 1; j < res.data.data.length; j++) {
              if (res.data.data[i].dicText === res.data.data[j].dicText) {
                res.data.data.splice(j, 1);
                j--;
              }
            }
          }
          this.priceUnit = res.data.data;
        }
      });
    },
    mergePackageInfoFun(getMergePackageInfo) {
      this.dataTable.forEach((item) => {
        if (item.id == this.forMergeId) {
          item.pkgDetails = getMergePackageInfo;
          this.$forceUpdate();
        }
      });
    },
    btnPackageSelectModal(id, packageInfo) {
      this.forMergeId = id;
      this.$refs.modalPackageSelectRef.openModal(
        id,
        packageInfo,
        this.mergePackageInfoFun
      );
    },
    async getNewDataTable(subId, newDataTable, remainder) {
      for (let i = 0; i < newDataTable.length; i++) {
        if (newDataTable[i].supplierId && newDataTable[i].itemId) {
          await this.getRate(
            newDataTable[i].supplierId,
            newDataTable[i].itemId
          ).then((res) => {
            newDataTable[i].inputTaxRate = res;
          });
          await this.getPrice(
            newDataTable[i].itemId,
            newDataTable[i].supplierId
          ).then((res) => {
            newDataTable[i].poPrice = res;
          });
        }
      }
      this.dataTable.find((item, i) => {
        if (item.id == subId) {
          item.poQty = remainder;
          this.dataTable.splice(i + 1, 0, ...newDataTable);
        }
        if (remainder == 0 && item.id == subId) {
          this.dataTable.splice(i, 1);
        }
      });
      this.getSupplierPayAmount();
    },
    btnSplitOrder(ultimateParentId, parentQty, allInfo, id) {
      this.splitId = id;
      this.$refs.modalSplitOrderRef.openDailog(
        ultimateParentId,
        parentQty,
        this.getNewDataTable,
        allInfo,
        id
      );
    },
    async handleChange(value, key, column, id = 0, record) {
      let keyId = id;
      this.dataTable.find((item, i) => {
        if (item.id == id) {
          keyId = i;
        }
      });
      const newData = [...this.dataTable];
      const target = newData.filter((item) => key === item.key)[keyId];
      if (target) {
        if (this.typeis(value) == "undefined") {
          return;
        }
        value = value+''
        target[column] = value?.includes("+") ? value.split("+")[0] : value;
        if (value.includes("@@")) {
          target.itemId = Number(value.split("+")[1]);
        }
        if (value.includes("##")) {
          target.supplierId = value.split("+")[1] * 1;
        }
        if (value.includes("???")) {
          target.storeId = value.split("+")[1] * 1;
        }
        if (value.includes("^^^")) {
          target.storeName = undefined;
          target.storeId = undefined;
          target.customerId = value.split("+")[1] * 1;
          target.storeNameList =
            this.typeis(JSON.parse(value.split("^^^")[1])) == "array"
              ? JSON.parse(value.split("^^^")[1])
              : [];
        }
        if (value.includes("@@") || value.includes("##")) {
          await this.getRate(target.supplierId, target.itemId).then((res) => {
            target.inputTaxRate = res;
          });
        }
        if (
          value.includes("@@") ||
          (value.includes("##") && target.poPriceFlag !== "1")
        ) {
          await this.getPrice(target.itemId, target.supplierId).then((res) => {
            target.poPrice = target.poPrice || res;
          });
        }
        this.dataTable = newData;
      }
      this.getSupplierPayAmount();
      this.typeis(record, 'object') && this.clearContract(record)
    },
    handleSearch(value) {
      const params = {
        partnerType: 30,
        partnerName: value,
        isEnable: 1
      };
      partnerType(params).then((res) => {
        this.supplierNameList = res.data.data;
      });
    },
    async handleChangeOption(value) {
      this.valueOption = value;
      this.supplierMaterial = this.supplierNameList.find((item) => {
        return item.id == value;
      });
      this.dataTable.map((res) => {
        res.supplierName = this.supplierMaterial.partnerName;
        res.supplierId = this.supplierMaterial.id;
      });
      for (let i = 0; i < this.dataTable.length; i++) {
        await this.getRate(
          this.dataTable[i].supplierId,
          this.dataTable[i].itemId
        ).then((res) => {
          this.dataTable[i].inputTaxRate = res;
        });
        if (
          this.dataTable[i].supplierId &&
          this.dataTable[i].itemId &&
          this.dataTable[i].poPriceFlag !== "1"
        ) {
          await this.getPrice(
            this.dataTable[i].itemId,
            this.dataTable[i].supplierId
          ).then((res) => {
            this.dataTable[i].poPrice = res;
          });
        }
      }
      this.getSupplierPayAmount();
    },
    onDelete(id, supplierName, ultimateParentId, subPoQty) {
      this.dataTable.find((item) => {
        if (item === undefined) return
        if (item.id == ultimateParentId) {
          item.poQty = item.poQty + subPoQty;
        }
      });
      this.dataTable.find((item, i) => {
        if (item === undefined) return
        if (item.id == id) {
          this.dataTable.splice(i, 1);
        }
      });
      this.supplierPayAmount.find((item, i) => {
        if (item === undefined) return
        if (supplierName == item.supplierName) {
          this.supplierPayAmount.splice(i, 1);
        }
      });
    },
    deepClone(obj) {
      let objStorageBox = null;
      if (typeof obj == "object" && obj !== null) {
        objStorageBox = obj instanceof Array ? [] : {};
        for (let i in obj) {
          objStorageBox[i] = this.deepClone(obj[i]);
        }
      } else {
        objStorageBox = obj;
      }
      return objStorageBox;
    },
    addAData(id, copyAllData) {
      this.dataTable.find((item, i) => {
        if (item.id == id) {
          let newCopyDate = this.deepClone(copyAllData);
          newCopyDate.id = item.id + i + 100000;
          this.dataTable.find((val, j) => {
            if (val.id == newCopyDate.id) {
              newCopyDate.id = val.id + j;
            }
          });
          newCopyDate.deletIdFlag = i;
          newCopyDate.flag = 1;
          newCopyDate.supplierId = undefined;
          newCopyDate.supplierName = undefined;
          newCopyDate.supplierpayAmount = undefined;
          this.dataTable.splice(i + 1, 0, newCopyDate);
        }
      });
      this.getSupplierPayAmount();
    },
    deleteAData(id) {
      this.dataTable.find((item, i) => {
        if (item === undefined) return
        if (item.id == id && item.deletIdFlag) {
          this.dataTable.splice(i, 1);
        } else if (item.id == id) {
          this.dataTable.splice(i, 1);
          this.databaseDate.push({ id: item.id, flag: 0 });
        }
      });
      this.getSupplierPayAmount();
    },
    purchaseOkThrottle: throttle(function () {
      if (this.typeis(this.dataBaseInfo.whId) == 'undefined') {
        this.$message.error("入库仓库为必填项")
        return
      }
      // if (this.dataTable.some(ct => this.isUndef(ct.contractId))) {
      //   this.$message.error('关联合同为必选项，请选择关联合同', 3.5)
      //   return
      // }
      //! glht
      this.loading = true;
      let notDo = false;
      let returnPriceUnit = false;
      let returnPoPrice = false;
      const params = {
        id: this.dataBaseInfo.id,
        roId: this.dataBaseInfo.roId,
        purchaseList: this.dataTable,
        sno: this.dataBaseInfo.sno,
        whId: this.dataBaseInfo.whId,
        whCode: this.dataBaseInfo.whCode,
        whName: this.dataBaseInfo.whName,
        supplierPayAmount: this.supplierPayAmount,
        opCode: this.opObject.opCode,
        opId: this.opObject.opId,
        opName: this.opObject.opName,
        marketId: this.opObject.marketId,
        buyerId: this.opObject.buyerAccountId,
        buyerCode: this.opObject.buyerAccountCode,
        buyerAccount: this.opObject.buyerAccountName,
        roCode: this.opObject.roCode,
        model: 2,
      };
      params.dataTableRequireOrderOrg = this.dataTableRequireOrderOrg
      if (params.purchaseList.length == 0) {
        this.$message.error("没有商品可保存...");
        this.loading = false;
        return;
      }
      notDo = params.purchaseList.some((item) => {
        if (item.supplierName == "" || typeof item.supplierName !== "string") {
          this.$message.error("每条商品都需要选择供应商...");
          return (notDo = true);
        }
      });
      if (notDo) {
        this.loading = false;
        return;
      }
      returnPoPrice = params.purchaseList.some((item) => {
        if (item.poPrice === "") {
          this.$message.error("请填写采购价格...");
          return (returnPoPrice = true);
        }
      });
      if (returnPoPrice) {
        this.loading = false;
        return;
      }
      returnPriceUnit = params.purchaseList.some((item) => {
        // ||isFalse([item.invoiceBusinessType,item.invoiceType])
        if (item.priceUnit === "" || typeof item.priceUnit !== "string" || item.inputTaxRate === ""||isFalse([item.invoiceBusinessType,item.invoiceType])) {
          this.$message.error("存在项计价单位/税率/发票类型为空");
          return (returnPriceUnit = true);
        }
      });
      if (returnPriceUnit) {
        this.loading = false;
        return;
      }
      params.purchaseList.map((item) => {
        if (item.ultimateParentId) {
          delete item.ultimateParentId;
        }
      });
      params.purchaseList.forEach((res) => {
        res.unitPrice = Number(res.unitPrice);
        res.packUnitPrice = Number(res.packUnitPrice);
        res.pkgDetails = res.pkgDetails instanceof Array ? res.pkgDetails : [];
        res.poPrice = res.poPrice ? res.poPrice : "";
        res.salePrice = res.salePrice ? res.salePrice : "";
        if (res.speciousDeletFalgeId) {
          res.id = res.speciousDeletFalgeId;
          delete res.speciousDeletFalgeId;
        }
        if (res.poPriceFlag == "1") {
          delete res.poPriceFlag;
        }
        res.version = 0;
        res.soAmount = res.poQty * res.poPrice;
        res.packingCost = res.pkgDetails.reduce((total, currentValue) => {
          return total + currentValue.packQty * currentValue.packUnitPrice;
        }, 0);
        if (res.flag == 2) {
          delete res.id;
        }
        delete res.idFlage;
        delete res.deletIdFlag;
        delete res.storeNameList;
      });
      params.purchaseList.forEach((item) => {
        this.itemNameData.some((val) => {
          return item.itemId == val.id ? (item.itemCode = val.itemCode) : "";
        });
      });
      params.purchaseList.find((item) => {
        if (
          typeof item.deletIdFlag == "number" ||
          this.whichTable == "columnsPurchaseCustomer"
        ) {
          params.model = 1;
          delete item.id;
        } else if (
          typeof item.deletIdFlag !== "number" ||
          this.whichTable !== "columnsPurchaseCustomer"
        ) {
          delete params.model;
        }
      });
      if (params.model == 2) {
        delete params.model;
      }
      if (this.databaseDate.length > 0) {
        params.purchaseList.push(...this.databaseDate);
      }
      let copyParams = this.deepClone(params)
      copyParams.purchaseList.forEach(dl => delete dl.contractOption)
      requireOrderDoTransferPurchase(copyParams).then((res) => {
        if (res.data.code == 200) {
          this.resYes = res.data.data;
          this.loading = false;
          // this.visibleForm = false;
          this.visiblePurchaseOk = true;
          this.whichTable = "columnsPurchaseCustomer";
          this.databaseDate = [];
          this.supplierPayAmount = [];
          this.dataTable = [];
          this.dataBaseInfo = {};
          this.supplierPayAmountTempCopy = [];
          this.splitId = [];
          this.forMergeId = [];
          this.supplierBox.supplier = "";
          this.backToMainPage();
          // this.$parent.reloadTable();
        } else {
          this.$message.warn("采购失败");
          this.loading = false;
          this.changeTable();
        }
      });
    }, 3500),
    purchaseOk() {
      this.purchaseOkThrottle();
    },
    handlePurchaseOk() {
      this.visiblePurchaseOk = false;
    },
    handleCancelPurchase() {
      this.visiblePurchaseOk = false;
    },
    cancelModalForm() {
      this.whichTable = "columnsPurchaseCustomer";
      this.databaseDate = [];
      this.supplierPayAmount = [];
      this.dataTable = [];
      this.dataBaseInfo = {};
      this.supplierPayAmountTempCopy = [];
      this.splitId = [];
      this.forMergeId = [];
      this.supplierBox.supplier = "";
    },
  },
  activated() {
    let id;
    if (Object.keys(this.$route.query).length) {
      id = this.$route.query.id;
    }
    this.dataTableRequireOrderOrg = []
    this.commonId = id;
    this.getDataTable(id);
    this.getWarehouse()
    this.loading = false;
    this.getCustomerNameValue();
    this.getItemNameOption();
    this.getItemSpecsValue();
    this.getPriceUnit();
    this.handleSearch();
  },
};
</script>
<style lang="less" scoped>
@import "../../assets/css/commonless";
.back-btn {
  text-align: right;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
/deep/.modalTop .ant-modal {
  width: 86% !important;
  min-width: 1200px !important;
}
.topBox {
  border: 1px solid #cccccc;
  .topP {
    height: 30px;
    padding-left: 12px;
    line-height: 30px;
    color: black;
    background-color: #f0f3f6;
    border-bottom: 1px solid #d9d9d9;
  }
  .rowTop {
    margin: 0 18px;
    .spanStyle {
      color: #525252;
    }
  }
  .rowBottom {
    margin: 8px 18px;
    .spanStyle {
      color: #525252;
    }
  }
  .rowBottomOfSubInfo {
    margin: 8px 18px;
    .spanStyle {
      color: #525252;
    }
  }
}
.bottomBox {
  overflow-x: hidden;
  margin-top: 15px;
  border: 1px solid #cccccc;
  .scrollBar();
  .topP {
    margin: 0;
    height: 34px;
    padding: 0 16px 0 12px;
    line-height: 34px;
    color: black;
    background-color: #f0f3f6;
  }
  .tableStyle {
    margin: 0;
    overflow: auto;
    .selectOption {
      width: 100%;
    }
    /deep/.ant-input-handler-wrap {
      width: 0;
      height: 0;
    }
    /deep/.ant-table-footer {
      background-color: white;
      .ant-divider {
        background-color: green;
      }
    }
  }
}
</style>