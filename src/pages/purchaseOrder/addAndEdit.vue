<template>
  <div class="modal">
    <!-- <a-modal
      :title="modalTitle"
      :visible="visible"
      :width="1150"
      @cancel="handleCancel"
      destroyOnClose
    > -->
    <a-page-header style="border: 1px solid rgb(235, 237, 240)" :title="modalTitle" @back="handleBack" />
    <!-- <h1 v-if="modalTitle">{{ modalTitle }}</h1> -->
    <div class="details">
      <div class="info" v-if="modalType === 'gn' && screen">
        <p class="info-title">基本信息</p>
        <div class="info-form">
          <a-form-model :model="form" :rules="rules" ref="infoform">
            <a-row :gutter="16">
              <!-- <a-col class="gutter-row" :span="6">
                  <a-form-model-item label="运营主体" prop="opId">
                    <a-select v-model="form.opId" placeholder="请选择运营主体">
                      <a-select-option
                        @click="handleClickOpData(item)"
                        v-for="item in TenantData"
                        :key="item.id"
                        :value="item.id"
                        >{{ item.opName }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col> -->
              <a-col class="gutter-row" :span="6">
                <a-form-model-item label="供应商" prop="supplierId">
                  <a-select v-model="form.supplierId" placeholder="请选择供应商" allowClear show-search
                    :filter-option="filterOption" @change="clearContract">
                    <a-select-option v-for="item in PartnerData.filter(supplierStrategy)"
                      :key="item.id" :value="item.id">
                      {{ item.partnerName }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col class="gutter-row" :span="6">
                <a-form-model-item label="入库仓库" prop="whId">
                  <a-select v-model="form.whId" placeholder="请选择入库仓库" show-search :filter-option="filterOption">
                    <a-select-option v-for="(item, m) in WareHouseData" :key="m" :value="item.baseId">
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col class="gutter-row" :span="6">
                <a-form-model-item label="预付款">
                  <a-input-number v-model="form.payAmount"
                    :disabled="form.payReconciliaState==620 && modalState === 'edit'" />
                </a-form-model-item>
              </a-col>
              <a-col class="gutter-row" :span="6">
                <a-form-model-item label="预付款比率(%)">
                  <a-input-number :max='100' v-model="form.payAmountRatio"
                    :disabled="form.payReconciliaState==620 && modalState === 'edit'" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col class="gutter-row" :span="6">
                <a-form-model-item label="预付款日期">
                  <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" valueFormat="YYYY-MM-DD HH:mm:ss"
                    v-model="form.advanceTime" style="width: 100%"
                    :disabled="form.payReconciliaState==620 && modalState === 'edit'" />
                </a-form-model-item>
              </a-col>
              <a-col class="gutter-row" :span="6">
                <a-form-model-item label="计划交货时间">
                  <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" valueFormat="YYYY-MM-DD HH:mm:ss"
                    v-model="form.planDeliveryTime" style="width: 100%" />
                </a-form-model-item>
              </a-col>
              <a-col class="gutter-row" :span="6">
                <a-form-model-item label="采购员">
                  <a-select v-model="form.buyerId" @change="handleBuyerOption" allowClear show-search
                    :filter-option="filterOption">
                    <a-select-option v-for="(item, i) in buyerOption" :value="item.id" :key="i">
                      {{ item.realName }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col class="gutter-row" :span="12">
                <a-form-model-item label="关联合同" :prop="mustCheck ? 'contractId' : ''">
                  <a-select style="width: 100%;" show-search v-model="form.contractId" placeholder="请先选择供应商"
                    :default-active-first-option="false" :filter-option="false" :not-found-content="null"
                    :disabled="!form.supplierId" @search="contract" @select="contractSelect" @focus="contract">
                    <a-select-option v-for="item in contractOption" :key="item.id">{{ item.contractTitle }}&{{ item.contractNumber }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
      </div>
      <div class="info" v-if="modalType === 'gj' && screen">
        <p class="info-title">基本信息</p>
        <div class="info-form">
          <a-form-model :model="form" :rules="rules" ref="infoform">
            <a-row :gutter="16">
              <!-- <a-col class="gutter-row" :span="6">
                  <a-form-model-item label="运营主体" prop="opId">
                    <a-select v-model="form.opId" placeholder="请选择运营主体">
                      <a-select-option
                        @click="handleClickOpData(item)"
                        v-for="item in TenantData"
                        :key="item.id"
                        :value="item.id"
                        >{{ item.opName }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col> -->
              <a-col class="gutter-row" :span="6">
                <a-form-model-item label="订单日期" prop="orderDate">
                  <a-date-picker style="width: 100%" showTime format="YYYY-MM-DD HH:mm:ss"
                    valueFormat="YYYY-MM-DD HH:mm:ss" v-model="form.orderDate" @change="changeValue" />
                </a-form-model-item>
                <!-- <a-form-model-item label="订单日期" prop="orderDate">
                  <a-date-picker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    valueFormat="YYYY-MM-DD HH:mm:ss"
                    v-model="purchaseGlobalOrderDetail.orderDate"
                  />
                </a-form-model-item> -->
              </a-col>

              <a-col class="gutter-row" :span="6">
                <a-form-model-item label="供应商" prop="supplierId">
                  <a-select @change="handleSupplierIdChnage" v-model="form.supplierId" placeholder="请选择供应商" show-search
                    :filter-option="filterOption">
                    <a-select-option v-for="item in PartnerData.filter(supplierStrategy)"
                      :key="item.id" :value="item.id">
                      {{ item.partnerName }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col class="gutter-row" :span="6">
                <a-form-model-item label="代理公司" prop="agencyId">
                  <a-select v-model="form.agencyId" placeholder="请输入代理公司名称" allowClear show-search
                    :filter-option="filterOption" @change="addParams">
                    <a-select-option v-for="item in PartnerData.filter(agencyStrategy)"
                      :key="item.id" :value="item.id">
                      {{ item.partnerName }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col class="gutter-row" :span="6">
                <a-form-model-item label="入库仓库" prop="whId">
                  <a-select v-model="form.whId" placeholder="请选择入库仓库" show-search :filter-option="filterOption">
                    <a-select-option v-for="(item, j) in WareHouseData" :key="j" :value="item.baseId">
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col class="gutter-row" :span="6">
                <a-form-model-item label="业务类型">
                  <a-select v-model="purchaseGlobalOrderDetail.businessType" placeholder="请选择业务类型">
                    <a-select-option value="进口"> 进口 </a-select-option>
                    <a-select-option value="出口"> 出口 </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col class="gutter-row" :span="6">
                <a-form-model-item label="柜号" prop="containerCode">
                  <a-input v-model="form.containerCode" placeholder="请输入柜号" @change="GJspecChange"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col class="gutter-row" :span="6">
                <a-form-model-item label="提单">
                  <a-input v-model="purchaseGlobalOrderDetail.pickCode" placeholder="请输入提单"></a-input>
                </a-form-model-item>
              </a-col>

              <a-col class="gutter-row" :span="6">
                <a-form-model-item label="交易方式">
                  <a-input v-model="purchaseGlobalOrderDetail.transactionType" placeholder="请输入交易方式"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col class="gutter-row" :span="6">
                <a-form-model-item label="目的港">
                  <a-input v-model="purchaseGlobalOrderDetail.purposeHarbor" placeholder="请输入目的港"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col class="gutter-row" :span="6">
                <a-form-model-item label="开船日期" prop="sailDate">
                  <a-date-picker style="width: 100%" showTime format="YYYY-MM-DD HH:mm:ss"
                    valueFormat="YYYY-MM-DD HH:mm:ss" v-model="form.sailDate" />
                </a-form-model-item>
              </a-col>
              <a-col class="gutter-row" :span="6">
                <a-form-model-item label="预计到港日期" prop="expectArrivalDate">
                  <a-date-picker style="width: 100%" showTime format="YYYY-MM-DD HH:mm:ss"
                    valueFormat="YYYY-MM-DD HH:mm:ss" v-model="form.expectArrivalDate" />
                </a-form-model-item>
              </a-col>
              <a-col class="gutter-row" :span="6">
                <a-form-model-item label="船名">
                  <a-input v-model="purchaseGlobalOrderDetail.shipName" placeholder="请输入船名"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col class="gutter-row" :span="6">
                <a-form-model-item label="运输方式">
                  <!-- <a-form-model-item label="流向"> -->
                  <a-input v-model="purchaseGlobalOrderDetail.flowDirection" placeholder="请输入运输方式"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col class="gutter-row" :span="6">
                <a-form-model-item label="订单号">
                  <a-input v-model="purchaseGlobalOrderDetail.orderCode" placeholder="请输入订单号"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col class="gutter-row" :span="6">
                <a-form-model-item label="发货港">
                  <a-input v-model="purchaseGlobalOrderDetail.shipmentPort" placeholder="请输入发货港"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col class="gutter-row" :span="6">
                <a-form-model-item label="采购员">
                  <a-select v-model="purchaseGlobalOrderDetail.buyerId" @change="handleBuyerOption" allowClear>
                    <a-select-option v-for="(item, i) in buyerOption" :value="item.id" :key="i">
                      {{ item.realName }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col class="gutter-row" :span="6">
                <a-form-model-item label="定价方式">
                  <a-input v-model="purchaseGlobalOrderDetail.pricingState" placeholder="请输入定价方式"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col class="gutter-row" :span="6">
                <a-form-model-item label="条款">
                  <a-input v-model="purchaseGlobalOrderDetail.terms" placeholder="请输入条款"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col class="gutter-row" :span="6">
                <a-form-model-item label="币种" prop="currency">
                  <a-select v-model="form.currency" placeholder="请选择币种" @change="handleCurrencyChange">
                    <a-select-option v-for="item in currencyData" :key="item.id" :value="item.dicText">{{ item.dicText
                    }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col class="gutter-row" :span="6">
                <a-form-model-item label="汇率" prop="exchangeRate">
                  <a-input-number v-model="form.exchangeRate" placeholder="请输入汇率" />
                </a-form-model-item>
              </a-col>
              <a-col class="gutter-row" :span="6">
                <a-form-model-item label="预付款比例条款">
                  <a-input v-model="form.payAmountRatioTerm" placeholder="请输入预付款比例条款"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col class="gutter-row" :span="12">
                <a-form-model-item label="关联合同" :prop="mustCheck ? 'contractId' : ''">
                  <a-select style="width: 100%;" show-search v-model="form.contractId" placeholder="请先选择供应商"
                    :default-active-first-option="false" :filter-option="false" :not-found-content="null"
                    :disabled="!form.supplierId" @search="contract" @select="contractSelect" @focus="contract">
                    <a-select-option v-for="item in contractOption" :key="item.id">{{ item.contractTitle }}&{{ item.contractNumber }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
      </div>
      <div class="info" v-if="modalType === 'gj'">
        <p class="info-title">费用信息</p>
        <div class="info-form">
          <a-form-model :model="form" :rules="rules" ref="infopriceform">
            <a-row :gutter="16">
              <a-col class="gutter-row" :span="3">
                <a-form-model-item label="预付款">
                  <a-input-number v-model="form.payAmount"
                    :disabled="form.payReconciliaState==620 && modalState === 'edit'" />
                </a-form-model-item>
              </a-col>
              <a-col class="gutter-row" :span="3">
                <a-form-model-item label="预付款比率(%)" :disabled="form.payReconciliaState==620 && modalState === 'edit'">
                  <a-input-number :max='100' v-model="form.payAmountRatio" />
                </a-form-model-item>
              </a-col>
              <a-col class="gutter-row" :span="6">
                <a-form-model-item label="预付款日期">
                  <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" valueFormat="YYYY-MM-DD HH:mm:ss"
                    v-model="form.advanceTime" style="width: 100%"
                    :disabled="form.payReconciliaState==620 && modalState === 'edit'" />
                </a-form-model-item>
              </a-col>
              <a-col class="gutter-row" :span="6">
                <a-form-model-item label="收款主体">
                  <a-select disabled v-model="form.receivingSubjectId" placeholder="请选收款主体">
                    <a-select-option @click="handleSelectReceivingSubject(item)" v-for="item in PartnerData"
                      :key="item.id" :value="item.id">
                      {{ item.partnerName }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col class="gutter-row" :span="6" v-if="hasPermission('globalPurchaseOrderHead_add_three')">
                <a-form-model-item label="其他费用">
                  <a-input disabled v-model="form.priceAllStr">
                    <a-icon @click="openPrice" slot="addonAfter" type="caret-down" />
                  </a-input>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
      </div>
      <div class="table">
        <p class="table-title flex-sb">
          <span>商品信息</span>
          <a-space :size="18">
            <a-button :disabled="!form.supplierId" type="primary" size="small" @click="addItems"
              :loading="addItemsLoading">添加货品</a-button>
            <a-popconfirm title="确定要删除全部删除吗" ok-text="确定" cancel-text="取消" @confirm="clearTable">
              <a-button type="primary" size="small">一键清除商品列表</a-button>
            </a-popconfirm>
            <a-button-group class="a-button-group">
              <checkboxList v-model="columns" width="280" />
              <a-button class="btnStyle" type="primary" :icon="screen ? 'fullscreen' : 'fullscreen-exit'"
                @click="screenBtn"></a-button>
            </a-button-group>
          </a-space>
        </p>
        <div class="table-data">
          <a-table class="table-input-number" rowKey="id" :pagination="false" :columns="columns" :data-source="data"
            :scroll="{ y: 800, x: 850 }">
            <span slot="del" slot-scope="text, record, index">
              <a-popconfirm title="确定要删除这条数据吗?" ok-text="确定" cancel-text="取消" @confirm="delOne(record, index)"
                @cancel="cancel">
                <a-button type="link"> 删除 </a-button>
              </a-popconfirm>
            </span>
            <span slot="itemName" slot-scope="text, record">
              <a-input readOnly v-model="record.itemName"></a-input>
            </span>
            <span slot="itemCode" slot-scope="text, record">
              <a-input disabled v-model="record.itemCode"></a-input>
            </span>
            <span slot="itemCountryOrigin" slot-scope="text, record">
              <a-select style="width: 100%" v-model="record.itemCountryOrigin">
                <a-select-option v-for="item in record.countryOriginList" :key="item">{{ item }}
                </a-select-option>
              </a-select>
            </span>

            <span slot="PoQtyTitle" class="table-formva"> 数量 </span>
            <span slot="poQty" slot-scope="text, record">
              <a-input-number v-model="record.poQty"
                @change="handlePoPriceChange($event, record)" />
            </span>
            <span slot="sumQty" slot-scope="text, record">
              <a-input disabled v-model="record.sumQty"></a-input>
            </span>
            <span slot="sumWeight" slot-scope="text, record">
              <a-input disabled v-model="record.sumWeight"></a-input>
            </span>
            <span slot="stock" slot-scope="text, record">
              <a-input disabled v-model="record.stock"></a-input>
            </span>
            <span slot="priceUnitTitle" class="table-formva"> 计价单位 </span>
            <span slot="priceUnit" slot-scope="text, record">
              <a-select style="width: 100%" v-model="record.priceUnit" placeholder="计价单位">
                <a-select-option v-for="item in dictionaryData" :key="item.id" :value="item.dicText">{{ item.dicText }}
                </a-select-option>
              </a-select>
            </span>
            <span slot="poNetweightUnit" slot-scope="text, record">
              <a-select style="width: 100%" v-model="record.poNetweightUnit" placeholder="净重单位">
                <a-select-option v-for="item in dictionaryData" :key="item.id" :value="item.dicText">{{ item.dicText }}
                </a-select-option>
              </a-select>
            </span>
            <span slot="poNetweight" slot-scope="text, record">
              <a-input-number v-model="record.poNetweight"></a-input-number>
            </span>
            <span slot="unit" slot-scope="text, record">
              <a-input v-model.trim="record.unit"></a-input>
            </span>
            <span slot="plateNumber" slot-scope="text, record">
              <a-input-number v-model="record.plateNumber"></a-input-number>
            </span>
            <span slot="customerName" slot-scope="text, record">
              <a-input v-model="record.customerName"></a-input>
            </span>
            <span slot="storeName" slot-scope="text, record">
              <a-input v-model="record.storeName"></a-input>
            </span>
            <span slot="PriTitle" class="table-formva"> 采购单价</span>
            <span slot="poPrice" slot-scope="text, record">
              <a-space>
                <a-input-number v-model="record.poPrice"
                  @change="handlePoPriceChange($event, record)" />
                <span>{{ purchaseGlobalOrderDetail.currency }}</span>
              </a-space>
            </span>
            <span slot="itemSpec" slot-scope="text, record">
              <a-select v-show="modalType === 'gn'" style="width: 100%" v-model="record.itemSpec" show-search
                :filter-option="filterOption" allowClear>
                <a-select-option v-for="item in record.specList" :key="item.id" :value="item.specName">{{ item.specName
                }}
                </a-select-option>
              </a-select>
              <!-- @focus="handleItemsSelectsChange(3, record)" 国际规格 -->
              <a-select v-show="modalType === 'gj'" style="width: 100%" v-model="record.itemSpec" show-search
                allowClear>
                <a-select-option v-for="item in record.specList" :key="item.specName">{{ item.specName }}
                </a-select-option>
              </a-select>
            </span>
            <span slot="itemType" slot-scope="text, record">
              <a-select style="width: 100%" v-model="record.itemType">
                <a-select-option v-for="item in record.varietiesList" :key="item">{{ item }}
                </a-select-option>
              </a-select>
            </span>
            <span slot="itemLevel" slot-scope="text, record">
              <a-select style="width: 100%" v-model="record.itemLevel">
                <a-select-option v-for="item in record.itemLevelList" :key="item">{{ item }}
                </a-select-option>
              </a-select>
            </span>
            <span slot="itemBrand" slot-scope="text, record">
              <!-- <a-input v-model="record.itemBrand"></a-input> -->
              <a-select v-model="record.itemBrand" style="width: 100%" show-search :filter-option="filterOption"
                allowClear>
                <a-select-option v-for="(item, index) in record.itemBrandRefList" :key="index" :value="item.brandName">
                  {{ item.brandName }}</a-select-option>
              </a-select>
            </span>
            <span slot="packingCost" slot-scope="text, record">
              <a-input disabled v-model="record.packingCost"></a-input>
            </span>
            <span slot="poTotalAmount" slot-scope="text, record">
              <a-input-number @change="handlePoTotalChange($event, record)"
                v-model="record.poTotalAmount" />
            </span>
            <span slot="invoiceBusinessTypeTit" class="table-formva">发票类型</span>
            <span slot="invoiceBusinessType" slot-scope="text, record">
              <a-select v-model="record.invoiceBusinessType" @click.stop.native placeholder="" style="width: 40%">
                <a-select-option :value='0'>应税业务</a-select-option>
                <a-select-option :value='1'>免税业务</a-select-option>
              </a-select>
              <a-select v-model="record.invoiceType" @click.stop.native placeholder="" style="width: 60%">
                <a-select-option v-for="(item, index) in getInvoiceOption(record)" :key="index" :value='item.value'
                  :title='item.text'>
                  {{ item.text }}
                </a-select-option>
              </a-select>
            </span>
            <span slot="inputTaxRateTitle" class="table-formva">
              税率/抵扣率(%)</span>
            <span slot="inputTaxRate" slot-scope="text, record">
              <span style="width: 40%">
                <span v-if="record.invoiceType == 3">抵扣率</span>
                <span v-if='record.invoiceType == 1 || record.invoiceType == 2'>税率</span>
              </span>
              <a-select v-model="record.inputTaxRate" @click.stop.native placeholder=""
                style="width: 50%;margin-left:2px">
                <a-select-option :value="0"> 0 </a-select-option>
                <a-select-option :value="1"> 1 </a-select-option>
                <a-select-option :value="3"> 3 </a-select-option>
                <a-select-option :value="6"> 6 </a-select-option>
                <a-select-option :value="9"> 9 </a-select-option>
                <a-select-option :value="11"> 11 </a-select-option>
                <a-select-option :value="13"> 13 </a-select-option>
              </a-select>
            </span>
            <span slot="remark" slot-scope="text, record">
              <a-input v-model="record.remark"></a-input>
            </span>
            <span slot="Packaging" slot-scope="text, record">
              <a-button type="link" @click="openPackage(record)">
                包装选择
              </a-button>
            </span>
          </a-table>
        </div>
        <p class="table-total">
          采购金额总计:
          {{ formatPrice(settleStateDesc) }}
        </p>
      </div>
    </div>
    <FeeModel :feeFather='orderFeeList' :sourceType='2' :orderType="2" @updateFee='updateFee' ref="feemodel"
      v-if="this.modalType == 'gn'" />
    <div class="btn-footer" style="
        text-align: right;
        height: 60px;
        line-height: 60px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      ">
      <a-space>
        <a-button @click="handleBack"> 返回 </a-button>
        <a-button :loading="submitLoading" type="primary" @click="handleSubmit">
          确定
        </a-button>
      </a-space>
    </div>
    <!-- </a-modal> -->
    <!-- 包装选择 -->
    <a-modal title="包装选择" :visible="packageVisible" :width="700" @cancel="handleCancelPackage" :dialogStyle="{
      top: '30px',
    }" destroyOnClose>
      <div class="details">
        <div class="table">
          <p class="table-title flex-sb">
            <span>包装列表</span>
            <span>
              <a-select ref="addPackageSelect" mode="multiple" v-model="valueSelectPackage" size="small" show-search
                placeholder="请选择包装" option-filter-prop="children" style="width: 200px; margin-right: 6px"
                :filter-option="filterOption" @change="chooseSelectPackage">
                <div slot="dropdownRender" slot-scope="menu">
                  <v-nodes :vnodes="menu" />
                  <a-divider style="margin: 4px 0" />
                  <div style="padding: 4px 8px; cursor: pointer" @mousedown="(e) => e.preventDefault()">
                    <a-button type="primary" size="small" @click="addPackage">确认</a-button>
                  </div>
                </div>
                <a-select-option v-for="item in packageListData" :key="item.id" :value="item.id">
                  {{ item.packName }}
                </a-select-option>
              </a-select>
              <!-- <a-button type="primary" size="small" @click="addPackage"
                >添加</a-button
              > -->
            </span>
          </p>
          <div class="table-data">
            <a-table rowKey="packCode" :pagination="false" :columns="packageColumns" :data-source="packageData"
              :scroll="{ y: 800 }">
              <span slot="PQTitle" class="table-formva"> 包装数量</span>
              <span slot="del" slot-scope="text, record, index">
                <a-popconfirm title="确定要删除这条数据吗?" ok-text="确定" cancel-text="取消" @confirm="delPackageOne(record, index)"
                  @cancel="cancel">
                  <a-button type="link"> 删除 </a-button>
                </a-popconfirm>
              </span>
              <span slot="packQty" slot-scope="text, record">
                <a-input-number v-model="record.packQty" placeholder="必填"></a-input-number>
              </span>
              <span slot="packUnitPrice" slot-scope="text">
                <span>{{ text }}</span>
              </span>
            </a-table>
          </div>
        </div>
      </div>
      <template slot="footer">
        <a-button @click="handleCancelPackage">取消 </a-button>
        <a-button type="primary" @click="handleSubmitPackage">确定 </a-button>
      </template>
    </a-modal>
    <!-- 选择商品 -->
    <a-modal title="选择货品" :visible="itemsVisible" :width="1100" @cancel="handleCancelItems" :dialogStyle="{
      top: '30px',
    }" destroyOnClose>
      <div class="details">
        <div class="search">
          <a-form :form="itemsSearch">
            <a-row :gutter="16">
              <a-col :span="6">
                <a-form-item>
                  <a-input v-model.trim="itemsSearch.itemCode" placeholder="商品编号">
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item>
                  <a-input v-model.trim="itemsSearch.likeItemName" placeholder="名称">
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item>
                  <a-textarea v-model="itemsSearch.NameKeywords" placeholder="名称批量检索(用换行隔开)">
                  </a-textarea>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item>
                  <a-row>
                    <a-col :span="12">
                      <a-button type="primary" @click="clearSearch">清 空</a-button>
                    </a-col>
                    <a-col :span="12">
                      <a-button type="primary" @click="search">查 询</a-button>
                    </a-col>
                  </a-row>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div class="table">
          <p class="table-title">商品信息</p>
          <div class="table-data">
            <a-table :loading="tableProductLoading" rowKey="id" :pagination="false" :columns="itemsColumns"
              :data-source="ItemData" :scroll="{ y: 800 }" :row-selection="{
                columnWidth: 50,
                onChange: rowSelectionChange,
              }">
            </a-table>
          </div>
        </div>
        <div class="pagination">
          <a-pagination :page-size-options="['10', '20', '30', '40', '50']" :total="itemsPagination.total"
            show-size-changer :page-size="itemsPagination.pageSize" :current="itemsPagination.pageIndex"
            :show-total="(total) => `共 ${total} 条记录`" @change="pageIndexChange" @showSizeChange="pageSizeChange">
          </a-pagination>
        </div>
      </div>
      <template slot="footer">
        <a-button @click="handleCancelItems"> 取消 </a-button>
        <a-button type="primary" @click="handleSubmitItems"> 确定 </a-button>
      </template>
    </a-modal>
    <!-- 选择费用 -->
    <a-modal title="选择费用" :visible="priceVisible" :width="1000" @cancel="handleCancelPrice" :dialogStyle="{
      top: '30px',
    }" destroyOnClose>
      <div class="details">
        <div class="table">
          <p class="table-title flex-sb">
            <span> 费用列表</span>
            <span>
              <a-button type="primary" size="small" @click="addPrice">加一项</a-button>
            </span>
          </p>
          <div class="table-data">
            <a-table rowKey="id" :pagination="false" :columns="priceColumns" :data-source="PriceData"
              :scroll="{ y: 800, x: 300 }">
              <span slot="FTTitle" class="table-formva"> 费用类型</span>
              <span slot="FNTitle" class="table-formva"> 费用项</span>
              <span slot="RSTitle" class="table-formva"> 收款主体</span>
              <span slot="FATitle" class="table-formva"> 费用金额</span>
              <span slot="rateTitle" class="table-formva"> 税率/抵扣率(%)</span>
              <span slot="del" slot-scope="text, record, index">
                <a-popconfirm title="确定要删除这条数据吗?" ok-text="确定" cancel-text="取消" @confirm="delPriceOne(record, index)"
                  @cancel="cancel">
                  <a-button type="link"> 删除 </a-button>
                </a-popconfirm>
              </span>
              <span slot="feeType" slot-scope="text, record">
                <a-select style="width: 100%" v-model="record.feeType" placeholder="费用类型">
                  <a-select-option :value="1"> 国内费用 </a-select-option>
                  <a-select-option :value="2"> 国际费用 </a-select-option>
                </a-select>
              </span>
              <span slot="feeName" slot-scope="text, record">
                <a-select v-if="record.feeType == 1" :disabled="!record.feeType" style="width: 100%"
                  v-model="record.feeName" placeholder="费用项">
                  <a-select-option v-for="item in billingPurchaseFeesData" :key="item.id" :value="item.name">
                    {{ item.type == 1 ? item.name : item.name + "(国际)" }}
                  </a-select-option>
                </a-select>
                <a-select v-else :disabled="!record.feeType" style="width: 100%" v-model="record.feeName"
                  placeholder="费用项">
                  <a-select-option v-for="item in billingPurchaseFeesData2" :key="item.id" :value="item.name">
                    {{ item.type == 1 ? item.name : item.name + "(国际)" }}
                  </a-select-option>
                </a-select>
              </span>
              <span slot="receivingSubjectId" slot-scope="text, record">
                <a-select style="width: 100%" v-model="record.receivingSubjectId" placeholder="收款主体" show-search
                  :filter-option="filterOption">
                  <a-select-option @click="handelTableReceivingSubject(record, item)" v-for="item in PartnerData"
                    :key="item.id" :value="item.id">
                    {{ item.partnerName }}
                  </a-select-option>
                </a-select>
              </span>
              <span slot="invoiceBusinessTypeTit" class="table-formva">发票类型</span>
              <span slot="invoiceBusinessType" slot-scope="text, record">
                <a-select v-model="record.invoiceBusinessType" @click.stop.native placeholder="" style="width: 40%">
                  <a-select-option :value='0'>应税业务</a-select-option>
                  <a-select-option :value='1'>免税业务</a-select-option>
                </a-select>
                <a-select v-model="record.invoiceType" @click.stop.native placeholder="" style="width: 60%">
                  <a-select-option v-for="(item, index) in getInvoiceOption(record)" :key="index" :value='item.value'
                    :title='item.text'>
                    {{ item.text }}
                  </a-select-option>
                </a-select>
              </span>
              <span slot="rate" slot-scope="text, record">
                <span style="width: 40%">
                  <span v-if="record.invoiceType == 3">抵扣率</span>
                  <span v-if='[1,2,4,5].includes(record.invoiceType)'>税率</span>
                </span>
                <a-select style="width: 50%;margin-left:2px" v-model="record.rate"
                  :disabled="filterInvoiceOptions.includes(record.feeName)" placeholder="必填项">
                  <a-select-option v-for="item in rateOption" :key="item">{{ item }}</a-select-option>
                </a-select>
              </span>
              <span slot="priceExcludingTax" slot-scope="text, record">
                <span :calculateNum="priceExcludingTaxx(record, record.feeAmount, record.rate)">
                  {{ record.feeAmount && record.rate ? formatPrice(+record.feeAmount - +record.rate / 100 *
                      +record.feeAmount / ((100 + +record.rate) / 100), 2) : record.priceExcludingTax
                  }}
                </span>
              </span>
              <span slot="currency" slot-scope="text, record">
                <a-select style="width: 100%" v-model="record.currency">
                  <a-select-option v-for="item in currencyOption" :key="item">{{ item }}</a-select-option>
                </a-select>
              </span>
              <span slot="exchangeRate" slot-scope="text, record">
                <a-input-number v-model="record.exchangeRate"></a-input-number>
              </span>
              <span slot="foreignCurrencyAmount" slot-scope="text, record">
                <a-input-number v-model="record.foreignCurrencyAmount"></a-input-number>
              </span>
              <span slot="currencyAmount" slot-scope="text, record">
                <span :calculateNum="currencyAmountx(record, record.foreignCurrencyAmount, record.exchangeRate)">
                  {{ (+record.foreignCurrencyAmount || 0) && (+record.exchangeRate || 0) ?
                      formatPrice((+record.foreignCurrencyAmount).toFixed(2) * (+record.exchangeRate).toFixed(2), 2) : ""
                  }}
                </span>
              </span>
              <span slot="feeAmount" slot-scope="text, record">
                <a-input-number placeholder="必填" v-model="record.feeAmount"></a-input-number>
              </span>
              <span slot="customsClearanceFeeNumber" slot-scope="text, record">
                <a-input v-model="record.customsClearanceFeeNumber"></a-input>
              </span>
              <span slot="remark" slot-scope="text, record">
                <a-input v-model="record.remark"></a-input>
              </span>
            </a-table>
          </div>
        </div>
      </div>
      <template slot="footer">
        <a-button @click="handleCancelPrice"> 取消 </a-button>
        <a-button type="primary" @click="handleSubmitPrice"> 确定 </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import {
  getWarehouse2 as wareHouseList,
  componentGetItemList,
  packList,
  dictionaryList,
  purchaseOrderHeadInsertPo,
  purchaseOrderHeadGetSingle,
  purchaseOrderHeadUpdatePo,
  billingPurchaseFeesGetAllByType,
  purchaseGlobalOrderInsertPo,
  updatePurchaseOrderHead,
  itemDictionaryInfoList,
  // GetSpecList,
  getBuyer,
  contract,
} from "../../services/purchaseSaleInventory";
import { TenantSearch } from "@/services/tenant.js";
import { partnerType } from "../../services/userMa";
import { mustContract } from "../../services/commonSaasApi";
import { isFalse, getStr } from "../../utils/util";
import { mixin } from "../../utils/mixins";
import FeeModel from "../../components/feeModel/feeModel.vue";
import { PARTNER_STRATEGY } from '@/services/dataFilterStrategy';
export default {
  name: "purchaseOrderAddAndEdit",
  mixins: [mixin],
  components: {
    FeeModel,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
  data() {
    return {
      contractOption: [],
      rateOption: ["0", "1", "3", "6", "9", "11", "13"],
      currencyOption: ["人民币", "美元", "欧元", "英镑", "澳元"],
      screen: !0,
      tableProductLoading: false,
      modalState: "",
      modalType: "",
      valueSelectPackage: [],
      itemsVisible: false,
      rules: {
        // opId: [
        //   {
        //     required: true,
        //     message: "请选择运营主体",
        //     trigger: "change",
        //   },
        // ],
        orderDate: [
          {
            required: true,
            message: "请填写订单日期",
            trigger: "change",
          },
        ],
        supplierId: [
          {
            required: true,
            message: "请选择供应商",
            trigger: "change",
          },
        ],
        contractId: [
          {
            required: true,
            message: "请选择关联合同",
            trigger: "change",
          },
        ],
        whId: [
          {
            required: true,
            message: "请选择入库仓库",
            trigger: "change",
          },
        ],
        containerCode: [
          {
            required: true,
            message: "请输入柜号",
            trigger: "blur",
          },
        ],
        sailDate: [
          {
            required: true,
            message: "请选择开船日期",
            trigger: "change",
          },
        ],
        expectArrivalDate: [
          {
            required: true,
            message: "请选择预计到港日期",
            trigger: "change",
          },
        ],
        currency: [
          {
            required: true,
            message: "请选择币种",
            trigger: "change",
          },
        ],
        exchangeRate: [
          {
            required: true,
            message: "请输入汇率",
            trigger: "blur",
          },
        ],
      },
      modalTitle: "",
      packageVisible: false,
      visible: false,
      settleStateDesc: 0,
      form: {
        opId: undefined,
        opCode: "",
        opName: "",
        supplierId: undefined,
        agencyId: undefined,
        agencyName: undefined,
        whId: undefined,
        receivingSubjectId: undefined,
        payAmount: "",
        priceAllStr: "",
        advanceTime: undefined,
        planDeliveryTime: undefined,
        exchangeRate: "",
        currency: undefined,
        expectArrivalDate: null,
        sailDate: null,
        containerCode: "",
        payAmountRatioTerm: undefined,
        buyerId: undefined,
        contractId: undefined,
        contractTitle: undefined,
      },
      purchaseFeeList: [],
      purchaseGlobalOrderDetail: {
        businessType: "进口",
        containerCode: "",
        orderDate: null,
        transactionType: "",
        purposeHarbor: "",
        sailDate: null,
        expectArrivalDate: null,
        shipName: "",
        flowDirection: "",
        orderCode: "",
        pickCode: "",
        shipmentPort: "",
        buyer: "",
        pricingState: "",
        terms: "",
        currency: undefined,
        exchangeRate: "",
        buyerId: undefined,
      },
      addItemsLoading: false,
      data: [],
      columns: [],
      columnsNormal: [
        { dataIndex: "del", title: "操作", width: 100, align: "center", scopedSlots: { customRender: "del" }, },
        { title: "序号", dataIndex: "keyIndex", width: 100, align: "center", },
        { title: "商品名称", dataIndex: "itemName", width: 220, align: "center", scopedSlots: { customRender: "itemName" }, },
        { title: "商品编码", dataIndex: "itemCode", width: 150, align: "center", scopedSlots: { customRender: "itemCode" }, },
        //! {title: "原产国",dataIndex: "itemCountryOrigin",width: 150,align: "center",scopedSlots: { customRender: "itemCountryOrigin" },},
        { titleTips: "数量", dataIndex: "poQty", width: 100, align: "center", slots: { title: "PoQtyTitle" }, scopedSlots: { customRender: "poQty" }, },
        { titleTips: "采购单价", dataIndex: "poPrice", width: 200, slots: { title: "PriTitle" }, align: "center", scopedSlots: { customRender: "poPrice" }, },
        { titleTips: "计价单位", dataIndex: "priceUnit", slots: { title: "priceUnitTitle" }, width: 150, align: "center", scopedSlots: { customRender: "priceUnit" }, },
        { title: "采购总额", dataIndex: "poTotalAmount", width: 150, align: "center", scopedSlots: { customRender: "poTotalAmount" }, },
        { titleTips: "发票类型", slots: { title: "invoiceBusinessTypeTit" }, dataIndex: "invoiceBusinessType", width: 340, align: "center", scopedSlots: { customRender: "invoiceBusinessType" }, },
        { titleTips: "税率/抵扣率(%)", slots: { title: "inputTaxRateTitle" }, dataIndex: "inputTaxRate", width: 150, align: "center", scopedSlots: { customRender: "inputTaxRate" }, },
        { title: "辅助单位", dataIndex: "unit", width: 150, align: "center", scopedSlots: { customRender: "unit" }, },
        //! {title: "板数",dataIndex: "plateNumber",width: 100,align: "center",scopedSlots: { customRender: "plateNumber" },},
        { title: "在途数量", dataIndex: "sumQty", width: 100, align: "center", scopedSlots: { customRender: "sumQty" }, },
        { title: "在途重量", dataIndex: "sumWeight", width: 100, align: "center", scopedSlots: { customRender: "sumWeight" }, },
        { title: "可用数量", dataIndex: "stock", width: 100, align: "center", scopedSlots: { customRender: "stock" }, },
        { title: "规格", dataIndex: "itemSpec", width: 150, align: "center", scopedSlots: { customRender: "itemSpec" }, },
        //! {title: "品种",dataIndex: "itemType",width: 150,align: "center",scopedSlots: { customRender: "itemType" },},
        //! {title: "等级",dataIndex: "itemLevel",width: 150,align: "center",scopedSlots: { customRender: "itemLevel" },},
        { title: "品牌", dataIndex: "itemBrand", width: 150, align: "center", scopedSlots: { customRender: "itemBrand" }, },
        { title: "包装", width: 120, scopedSlots: { customRender: "Packaging" }, align: "center", },
        { title: "包装费用(元)", dataIndex: "packingCost", width: 120, align: "center", scopedSlots: { customRender: "packingCost" }, },
        { title: "备注", dataIndex: "remark", width: 300, ellipsis: true, align: "center", scopedSlots: { customRender: "remark" }, },
      ],
      columnsGj: [
        { dataIndex: "del", title: "操作", width: 100, align: "center", scopedSlots: { customRender: "del" }, },
        { title: "序号", dataIndex: "keyIndex", width: 100, align: "center", },
        { title: "商品名称", dataIndex: "itemName", width: 220, align: "center", scopedSlots: { customRender: "itemName" }, },
        { title: "商品编码", dataIndex: "itemCode", width: 150, align: "center", scopedSlots: { customRender: "itemCode" }, },
        { title: "品种", dataIndex: "itemType", width: 150, align: "center", scopedSlots: { customRender: "itemType" }, },
        { title: "规格", dataIndex: "itemSpec", width: 150, align: "center", scopedSlots: { customRender: "itemSpec" }, },
        { titleTips: "数量", dataIndex: "poQty", width: 100, align: "center", slots: { title: "PoQtyTitle" }, scopedSlots: { customRender: "poQty" }, },
        { titleTips: "采购单价", dataIndex: "poPrice", width: 200, slots: { title: "PriTitle" }, align: "center", scopedSlots: { customRender: "poPrice" }, },
        { titleTips: "计价单位", dataIndex: "priceUnit", slots: { title: "priceUnitTitle" }, width: 150, align: "center", scopedSlots: { customRender: "priceUnit" }, },
        { title: "采购总额", dataIndex: "poTotalAmount", width: 150, align: "center", scopedSlots: { customRender: "poTotalAmount" }, },
        { title: "采购净重", dataIndex: "poNetweight", width: 150, align: "center", scopedSlots: { customRender: "poNetweight" }, },
        { title: "净重单位", dataIndex: "poNetweightUnit", width: 150, align: "center", scopedSlots: { customRender: "poNetweightUnit" }, },
        { title: "等级", dataIndex: "itemLevel", width: 150, align: "center", scopedSlots: { customRender: "itemLevel" }, },
        { title: "品牌", dataIndex: "itemBrand", width: 150, align: "center", scopedSlots: { customRender: "itemBrand" }, },
        { titleTips: "发票类型", slots: { title: "invoiceBusinessTypeTit" }, dataIndex: "invoiceBusinessType", width: 340, align: "center", scopedSlots: { customRender: "invoiceBusinessType" }, },
        { titleTips: "税率/抵扣率(%)", slots: { title: "inputTaxRateTitle" }, dataIndex: "inputTaxRate", width: 150, align: "center", scopedSlots: { customRender: "inputTaxRate" }, },
        { title: "辅助单位", dataIndex: "unit", width: 150, align: "center", scopedSlots: { customRender: "unit" }, },
        { title: "板数", dataIndex: "plateNumber", width: 100, align: "center", scopedSlots: { customRender: "plateNumber" }, },
        { title: "在途数量", dataIndex: "sumQty", width: 100, align: "center", scopedSlots: { customRender: "sumQty" }, },
        { title: "在途重量", dataIndex: "sumWeight", width: 100, align: "center", scopedSlots: { customRender: "sumWeight" }, },
        { title: "可用数量", dataIndex: "stock", width: 100, align: "center", scopedSlots: { customRender: "stock" }, },
        { title: "原产国", dataIndex: "itemCountryOrigin", width: 150, align: "center", scopedSlots: { customRender: "itemCountryOrigin" }, },
        { title: "包装", width: 120, scopedSlots: { customRender: "Packaging" }, align: "center", },
        { title: "包装费用(元)", dataIndex: "packingCost", width: 120, align: "center", scopedSlots: { customRender: "packingCost" }, },
        { title: "备注", dataIndex: "remark", width: 300, ellipsis: true, align: "center", scopedSlots: { customRender: "remark" }, },
      ],
      packageData: [],
      packageColumns: [
        {
          dataIndex: "del",
          title: "操作",
          width: 80,
          align: "center",
          scopedSlots: { customRender: "del" },
        },
        {
          title: "包装名称",
          dataIndex: "packName",
          width: 100,
          align: "center",
        },
        {
          title: "包装编号",
          dataIndex: "packCode",
          width: 150,
          align: "center",
        },
        {
          dataIndex: "packQty",
          slots: { title: "PQTitle" },
          width: 100,
          align: "center",
          scopedSlots: { customRender: "packQty" },
        },
        {
          title: "包装价格(元)",
          dataIndex: "packUnitPrice",
          width: 110,
          align: "center",
          scopedSlots: { customRender: "packUnitPrice" },
        },
      ],
      //
      TenantData: [],
      PartnerData: [],
      WareHouseData: [],
      dictionaryData: [],
      ItemData: [],
      itemsColumns: [
        {
          title: "商品编码",
          dataIndex: "itemCode",
          width: 150,
          align: "center",
        },
        {
          title: "商品名称",
          dataIndex: "itemName",
          width: 220,
          align: "center",
        },
        {
          title: "规格",
          dataIndex: "itemSpec",
          width: 100,
          align: "center",
        },
        {
          title: "在途库存数量",
          dataIndex: "sumQty",
          width: 120,
          align: "center",
        },
        {
          title: "在途库存重量",
          dataIndex: "sumWeight",
          width: 120,
          align: "center",
        },
        {
          title: "可用库存数量",
          dataIndex: "stock",
          width: 120,
          align: "center",
        },
      ],
      ItemsObj: {},
      itemsSearch: {
        resource: 0,
        itemCode: "",
        likeItemName: "",
        NameKeywords: "",
        NameKeywordsData: [],
      },
      itemsPagination: {
        pageSize: 10,
        total: 0,
        pageIndex: 1,
        direction: "",
        sortName: "",
      },
      packageListData: [],
      packageListValueData: [],
      rowSelectionChangeData: [],
      priceVisible: false,
      priceColumns: [
        { dataIndex: "del", title: "操作", width: 100, align: "center", scopedSlots: { customRender: "del" } },
        { dataIndex: "feeType", slots: { title: "FTTitle" }, width: 150, align: "center", scopedSlots: { customRender: "feeType" } },
        { dataIndex: "feeName", width: 150, align: "center", slots: { title: "FNTitle" }, scopedSlots: { customRender: "feeName" } },
        { dataIndex: "receivingSubjectId", width: 280, align: "center", slots: { title: "RSTitle" }, scopedSlots: { customRender: "receivingSubjectId" } },
        { dataIndex: "feeAmount", width: 120, align: "center", slots: { title: "FATitle" }, scopedSlots: { customRender: "feeAmount" } },
        { dataIndex: "invoiceBusinessType", width: 280, align: "center", slots: { title: "invoiceBusinessTypeTit" }, scopedSlots: { customRender: "invoiceBusinessType" } },
        { dataIndex: "rate", width: 200, align: "center", slots: { title: "rateTitle" }, scopedSlots: { customRender: "rate" } },
        { title: "不含税金额", dataIndex: "priceExcludingTax", width: 180, align: "center", scopedSlots: { customRender: "priceExcludingTax" } },
        { title: "币种", dataIndex: "currency", width: 120, align: "center", scopedSlots: { customRender: "currency" } },
        { title: "汇率", dataIndex: "exchangeRate", width: 120, align: "center", scopedSlots: { customRender: "exchangeRate" } },
        { title: "外币金额", dataIndex: "foreignCurrencyAmount", width: 160, align: "center", scopedSlots: { customRender: "foreignCurrencyAmount" } },
        { title: "人民币金额", dataIndex: "currencyAmount", width: 160, align: "center", scopedSlots: { customRender: "currencyAmount" } },
        { title: "清关单号", dataIndex: "customsClearanceFeeNumber", width: 200, align: "center", scopedSlots: { customRender: "customsClearanceFeeNumber" } },
        { title: "备注", dataIndex: "remark", width: 300, align: "center", scopedSlots: { customRender: "remark" } },
      ],
      PriceData: [
        {
          id: 0, //这个id用来解决组件key
          feeType: undefined,
          feeName: undefined,
          receivingSubjectId: undefined,
          rate: undefined,
          priceExcludingTax: undefined,
          urrency: undefined,
          exchangeRate: undefined,
          foreignCurrencyAmount: undefined,
          currencyAmount: undefined,
          feeAmount: "",
          remark: "",
        },
      ],
      billingPurchaseFeesData: [],
      pzData: [],
      ycgData: [],
      ggData: [],
      currencyData: [],
      resStrData: [],
      submitLoading: false,
      GJspecData: [],
      buyerOption: [],
      buyerMaterial: {},
      funType: undefined,
      //20220803费用项
      orderFeeList: [],
      filterInvoiceOptions: [
        '进口增值税',
        '进口关税'
      ],
      mustSelectContract: [],
      mustCheck: false,
    };
  },
  computed: {
    priceExcludingTaxx() {
      return function (record, feeAmount, rate) {
        record.priceExcludingTax = feeAmount && rate ? this.formatPrice(+record.feeAmount - +record.rate / 100 * +record.feeAmount / ((100 + +record.rate) / 100), 2) : record.priceExcludingTax || ''
        return +record.feeAmount - +record.rate * +record.feeAmount
      }
    },
    currencyAmountx() {
      return function (record, foreignCurrencyAmount, exchangeRate) {
        record.currencyAmount = (+foreignCurrencyAmount || 0) && (+exchangeRate || 0) ? this.formatPrice((+record.foreignCurrencyAmount).toFixed(2) * (+record.exchangeRate).toFixed(2), 2) : undefined
        return +record.foreignCurrencyAmount * +record.exchangeRate
      }
    },
  },
  watch: {
    PriceData: {
      handler() {
        this.PriceData.forEach(item => {
          if (this.filterInvoiceOptions.includes(item.feeName)) {
            // 进口增值税与关税税率置为0
            item.rate = "0"
          }
        })
      },
      deep: true
    }
  },
  async activated() {
    await this.mustContract()
    this.screen = !0;
    this.data = []
    this.ItemData = []
    this.PriceData = []
    this.packageData = []
    this.getbillingPurchaseFeesGetAllByType({
      type: 1,
      orderType: 3
    })
    this.getbillingPurchaseFeesGetAllByType({
      type: 2,
      orderType: 3
    })
    this.form.opId = undefined,
    this.form.opCode = "",
    this.form.opName = "",
    this.form.supplierId = undefined,
    this.form.agencyId = undefined,
    this.form.agencyName = undefined,
    this.form.whId = undefined,
    this.form.receivingSubjectId = undefined,
    this.form.payAmount = "",
    this.form.priceAllStr = "",
    this.form.advanceTime = undefined,
    this.form.planDeliveryTime = undefined,
    this.form.exchangeRate = "",
    this.form.currency = undefined,
    this.form.expectArrivalDate = null,
    this.form.sailDate = null,
    this.form.containerCode = "",
    this.form.payAmountRatioTerm = undefined,
    this.form.buyerId = undefined,
    this.form.contractId = undefined
    this.form.contractTitle = undefined
    this.contractOption = []
    let row, type;
    if (Object.keys(this.$route.query).length) {
      type = this.$route.query.type;
      // state = this.$route.query.state;
      this.modalType = this.$route.query.type;
      this.modalState = this.$route.query.state;
      row = this.$route.query.row;
      this.funType = this.$route.query.row?.copy;
    }
    //处理表头
    if (type === "gn") {
      // let gnColumns = [];
      // let gnNoColumns = [
      //   "itemCountryOrigin",
      //   "itemType",
      //   "itemLevel",
      //   "itemBrand",
      //   "plateNumber",
      // ];
      // this.columnsNormal.forEach((item) => {
      //   if (gnNoColumns.indexOf(item.dataIndex) < 0) {
      //     gnColumns.push(item);
      //   }
      // });
      this.columns = this.columnsNormal;
    } else {
      this.columns = this.columnsGj;
    }
    let data = await wareHouseList({});
    data = data.data;
    if (data.code === "200") {
      this.WareHouseData = data.data || [];
      if (this.WareHouseData.length > 0) {
        this.form.whId = this.WareHouseData[0].id;
      }
    } else {
      this.$message.error(data.message);
    }
    if (this.modalState === "add") {
      if (this.modalType === "gn") {
        this.modalTitle = "新增采购订单";
      } else if (this.modalType === "gj") {
        this.modalTitle = "新增国际采购订单";
      }
      // this.visible = true;
    } else if (this.modalState === "edit") {
      this.mustCheck = false
      if (this.modalType === "gn") {
        this.modalTitle = "编辑采购订单";
        this.funType && (this.modalTitle = "新增采购订单");
      } else if (this.modalType === "gj") {
        this.modalTitle = "编辑国际采购订单";
        this.funType && (this.modalTitle = "新增国际采购订单");
      }
      const params = {
        id: row.id,
      };
      purchaseOrderHeadGetSingle(params).then((res) => {
        const data = res.data;
        if (data.code === "200") {
          this.form = {
            ...data.data,
            ...data.data.purchaseGlobalOrderDetail,
          };
          if (!this.isUndef(data.data.contractId, data.data.supplierId)) {
            this.contract()
          }
          if (!this.isUndef(data.data.supplierId)) {
            if (this.modalType == "gn") this.clearContract(data.data.supplierId, 'saveValue')
            if (this.modalType == "gj") this.handleSupplierIdChnage(data.data.supplierId, 'saveValue')
          }
          this.form.whId = "" + (this.form.whId || '')
          this.data = data.data.details;
          this.data.forEach((item, index) => {
            item.keyIndex = index + 1;
            item.sumWeight = item.sumWeight ? item.sumWeight / 1000 : "";
            item.poPrice = item.poPrice ? item.poPrice : "";
            item.poTotalAmount = item.poTotalAmount ? item.poTotalAmount : "";
            item.packingCost = item.packingCost ? item.packingCost : "";
          });
          this.purchaseGlobalOrderDetail = data.data.purchaseGlobalOrderDetail;
          this.PriceData = data.data.purchaseFeeList;
          if (this.modalType == 'gn') {
            this.orderFeeList = data.data.purchaseFeeList;
            this.$refs.feemodel.receiveData(this.orderFeeList)
          }
          let arrAtrs = [];
          this.PriceData.forEach((item) => {
            arrAtrs.push(item.feeName);
            item.feeAmount = item.feeAmount ? item.feeAmount : "";
          });
          this.form.priceAllStr = arrAtrs.join(",");
          this.settleStateDesc = this.data.reduce((a, b) => {
            return a + (+b.poTotalAmount || 0);
          }, 0);
          if (!this.WareHouseData.some(vip => vip.baseId == this.form.whId)) {
            this.WareHouseData.unshift({
              baseId: data.data.whId,
              code: data.data.whCode,
              name: data.data.whName
            })
          }
          // this.visible = true;
        } else {
          this.$message.error("获取详情失败！");
        }
      });
    }
  },
  methods: {
    supplierStrategy: PARTNER_STRATEGY.SUPPLIER,
    agencyStrategy: PARTNER_STRATEGY.AGENCY,
    async mustContract() {
      await mustContract().then(res => {
        if (res.data.code == 200) {
          this.mustSelectContract = res.data.data
        }
      })
    },
    clearContract(v, saveValue) {
      let obj = this.PartnerData.find(res => res.id === v && res.partnerType == 30)
      if (this.isUndef(obj)) {
        this.PartnerData.unshift({id: v, partnerName: this.form.supplierName, partnerType: 30, orgId: this.form.orgId})
      }
      this.mustCheck = this.mustSelectContract.includes(obj?.orgId || this.form.orgId)
      if (saveValue != 'saveValue') {
        this.form.contractId = undefined
        this.form.contractTitle = undefined
      }
      this.contract()
    },
    contract(contractTitle) {
      contract({ partnerId: this.form.supplierId ?? '', contractTitle }).then(res => {
        if (res.data.code == 200) {
          this.contractOption = res.data.data
        } else {
          this.contractOption.splice(0)
        }
      }).catch(() => this.contractOption.splice(0))
    },
    contractSelect(id) {
      let contractMsg = this.contractOption.find(item => item.id === id)
      this.form.contractTitle = contractMsg.contractTitle
    },
    addParams(value) {
      let agencyList = this.PartnerData.filter(this.agencyStrategy)
      if (value) {
        this.form.agencyName = agencyList.find(agency => agency.id === value)?.partnerName
      } else {
        this.form.agencyName = undefined
      }
    },
    //费用
    updateFee(data) {
      this.orderFeeList = data || []
    },
    screenBtn() {
      this.screen = !+this.screen
    },
    changeValue() {
      this.purchaseGlobalOrderDetail.orderDate = this.form.orderDate;
    },
    handleBuyerOption(value) {
      if (!value) {
        this.form.buyerId = undefined;
        this.buyerMaterial = {};
        this.modalState === "gj"
          ? (this.purchaseGlobalOrderDetail.buyerName = undefined)
          : (this.form.buyerName = undefined);
        return;
      }
      this.form.buyerId = value;
      this.buyerMaterial =
        this.buyerOption.find((item) => item.id == value) || {};
      this.modalState === "gj"
        ? (this.purchaseGlobalOrderDetail.buyerName =
          this.buyerMaterial.realName)
        : (this.form.buyerName = this.buyerMaterial.realName);
    },
    // GJspecList(id) {
    //   GetSpecList({ id: id }).then((res) => {
    //     const data = res.data;
    //     if (res.data.code == 200) {
    //       this.GJspecData = data.data;
    //     } else {
    //       this.$message.error(
    //         data.message ? data.message : "获取国际订单规格失败"
    //       );
    //     }
    //   });
    // },
    handleBack() {
      this.$closePage(
        "/enterSaleStore/purchase/purchaseOrderHeadAddEdit",
        "/enterSaleStore/purchase/purchaseOrderHead"
      );
    },
    GJspecDrop(record) {
      this.GJspecList(record.itemId);
    },
    GJspecChange() {
      this.$forceUpdate();
    },
    handleCurrencyChange(val) {
      if (val == "人民币") {
        this.form.exchangeRate = "1";
      }
    },
    handleSupplierIdChnage(val,  saveValue) {
      let obj = this.PartnerData.find(res => res.id === val && res.partnerType == 30)
      if (this.isUndef(obj)) {
        this.PartnerData.unshift({id: val, partnerName: this.form.supplierName, partnerType: 30, orgId: this.form.orgId})
      }
      this.mustCheck = this.mustSelectContract.includes(obj?.orgId || this.form.orgId)
      this.form.receivingSubjectId = val;
      if (saveValue != 'saveValue') {
        this.form.contractId = undefined
        this.form.contractTitle = undefined
      }
      this.contract()
    },
    handleSelectReceivingSubject(item) {
      this.form.receivingSubjectCode = item.partnerCode;
      this.form.receivingSubjectName = item.partnerName;
    },
    handelTableReceivingSubject(record, item) {
      record.receivingSubjectCode = item.partnerCode;
      record.receivingSubjectName = item.partnerName;
    },
    openPrice() {
      this.priceVisible = true;
    },
    handleCancelPrice() {
      this.priceVisible = false;
    },
    handleFeeTypeChange(val) {
      this.getbillingPurchaseFeesGetAllByType(val);
    },
    addPrice() {
      this.PriceData.push({
        id: 0, //这个id用来解决组件key
        feeType: undefined,
        feeName: undefined,
        receivingSubjectId: undefined,
        rate: undefined,
        priceExcludingTax: undefined,
        exchangeRate: undefined,
        currency: undefined,
        foreignCurrencyAmount: undefined,
        currencyAmount: undefined,
        feeAmount: "",
        remark: "",
      });
      this.PriceData.forEach((item, index) => {
        item.id = index;
      });
    },
    getbillingPurchaseFeesGetAllByType(queryInfo) {
      // type: 费用类型: 1-国内,2-国际;
      // orderType: 订单类型：1销售单, 2普通采购, 3国际采购, null所有订单
      const params = {
        ...queryInfo,
      };
      billingPurchaseFeesGetAllByType(params).then((res) => {
        const data = res.data;
        if (data.code == 200) {
          if (queryInfo.type === 1) {
            this.billingPurchaseFeesData = data.data;
          } else {
            this.billingPurchaseFeesData2 = data.data;
          }
        } else {
          this.$message.error(data.message);
        }
      });
    },
    delPriceOne(row, index) {
      this.PriceData.splice(index, 1);
      this.PriceData.forEach((item, index) => {
        item.id = index;
      });
    },
    handleSubmitPrice() {
      let nullArr = [];
      let strArr = [];
      this.PriceData.forEach((item) => {
        if (
          !item.feeType ||
          !item.feeName ||
          !item.receivingSubjectId ||
          !item.feeAmount ||
          (!item.rate && !this.filterInvoiceOptions.includes(item.feeName))
        ) {
          nullArr.push(item);
        }
        strArr.push(item.feeName);
      });
      if (nullArr.length > 0) {
        this.$message.error("请填写完整的费用信息！");
        return false;
      }
      this.form.priceAllStr = strArr.join(",");
      this.purchaseFeeList = JSON.parse(JSON.stringify(this.PriceData));
      this.priceVisible = false;
    },
    rowSelectionChange(selectedRowKeys, selectedRows) {
      this.rowSelectionChangeData = selectedRows;
    },
    pageIndexChange(index) {
      this.itemsPagination.pageIndex = index;
      this.getItemList();
    },
    pageSizeChange(index, pageSize) {
      this.itemsPagination.pageIndex = 1;
      this.itemsPagination.pageSize = pageSize;
      this.getItemList();
    },
    clearSearch() {
      this.itemsSearch = {
        resource: 0,
        itemCode: "",
        likeItemName: "",
        NameKeywords: "",
        NameKeywordsData: [],
      };
    },
    search() {
      this.itemsSearch.NameKeywordsData = [];
      if (this.itemsSearch.NameKeywords) {
        let strArr = this.itemsSearch.NameKeywords.split(/[(\r\n)\r\n]+/);
        let pattern = /[,，。!！?？~`$^&*:;；："'“”‘’]/g;
        strArr = strArr.map((item) => {
          item = item.replace(/\s*/g, "");
          //去掉特殊字符
          item = item.replace(pattern, "");
          return item;
        });
        this.resStrData = getStr(strArr);
        this.resStrData.forEach((item) => {
          this.itemsSearch.NameKeywordsData.push(item.name);
        });
      }
      this.itemsPagination.pageIndex = 1;
      this.getItemList();
    },
    handlePoPriceChange(e, row) {
      if (+row.poQty < 0) row.poQty = Math.abs(+row.poQty);
      if (+row.poPrice < 0) row.poPrice = Math.abs(+row.poPrice);
      if (row.poQty && row.poPrice)
        row.poTotalAmount = this.formatPrice(row.poQty * row.poPrice);
      this.settleStateDesc = Number(
        this.data.reduce((a, b) => {
          return a + (b.poTotalAmount ? (+b.poTotalAmount || 0) : 0);
        }, 0)
      );
    },
    handlePoTotalChange(e, row) {
      if (+row.poQty < 0) row.poQty = Math.abs(+row.poQty);
      if (row.poQty)
        row.poPrice = this.formatPrice(row.poTotalAmount / row.poQty);
      this.settleStateDesc = Number(
        this.data.reduce((a, b) => {
          return a + (b.poTotalAmount ? (+b.poTotalAmount || 0) : 0);
        }, 0)
      );
    },
    getItemList() {
      const params = {
        direction: "",
        sortName: "",
        pageSize: this.itemsPagination.pageSize,
        currentPage: this.itemsPagination.pageIndex,
        queryParam: {
          supplierId: this.form.supplierId,
          resource: 0,
          itemCode: this.itemsSearch.itemCode,
          NameKeywords: this.itemsSearch.NameKeywordsData,
          likeItemName: this.itemsSearch.likeItemName,
        },
      };
      this.tableProductLoading = true;
      componentGetItemList(params).then((res) => {
        this.tableProductLoading = false;
        const data = res.data;
        if (data.code == 200) {
          this.ItemData = data.data;
          this.itemsPagination.total = data.totalNum;
        } else {
          this.$message.error(data.message);
        }
      });
    },
    handleItemsSelectsChange(type, row) {
      const params = {
        type: type,
        dicCode: this.modalState === "add" ? row.id : row.itemId,
      };
      itemDictionaryInfoList(params).then((res) => {
        const data = res.data;
        if (data.code === "200") {
          switch (type) {
            case 47:
              row.pzData = data.data?.list ?? [];
              break;
            case 48:
              row.ycgData = data.data?.list ?? [];
              break;
            case 49:
              this.GJspecData = data.data?.list ?? [];
              break;
            // case 3:
            //   row.ggData = data.data;
            //   break;
          }
          this.$forceUpdate();
        } else {
          this.$message.error(data.message);
        }
      });
    },
    clearTable() {
      if (this.data?.length == 0) return
      this.data = []
      this.settleStateDesc = 0
    },
    addItems() {
      const params = {
        direction: "",
        sortName: "",
        pageSize: this.itemsPagination.pageSize,
        currentPage: this.itemsPagination.pageIndex,
        queryParam: {
          supplierId: this.form.supplierId,
          resource: 0,
        },
      };
      this.addItemsLoading = true;
      componentGetItemList(params).then((res) => {
        this.addItemsLoading = false;
        const data = res.data;
        if (data.code == 200) {
          this.itemsVisible = true;
          this.ItemData = data.data;
          this.itemsPagination.total = data.totalNum;
          this.ItemData.forEach((item) => {
            if (item.packDetailList && item.packDetailList.length > 0) {
              item.packDetailList.forEach((val) => {
                val.packId = val.id;
                val.packUnitPrice = val.unitPrice;
                val.packUnitWeight = val.unitWeight;
              });
            }
          });
        } else {
          this.$message.error(data.message);
        }
      });
    },
    cancel() {
      this.$message.error("取消");
    },
    delOne(row, index) {
      this.data.splice(index, 1);
      this.settleStateDesc = this.data.reduce((a, b) => {
        return a + (+b.poTotalAmount || 0);
      }, 0);
    },
    openPackage(row) {
      this.ItemsObj = row;
      row.pkgDetails.forEach((item) => {
        item.packUnitPrice = item.unitPrice;
        item.packUnitWeight = item.unitWeight;
      });
      this.packageData = JSON.parse(JSON.stringify(row.pkgDetails));
      this.packageVisible = true;
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    delPackageOne(row, index) {
      this.packageData.splice(index, 1);
    },
    addPackage() {
      if (this.packageListValueData.length === 0) {
        this.$message.error(`请选择一条数据进行添加！`);
        return;
      }
      let quniPackages = [];
      this.packageData.forEach((item) => {
        this.packageListValueData.forEach((val) => {
          if (item.id === val.id) {
            quniPackages.push(item.packName);
          }
        });
      });
      if (quniPackages.length > 0) {
        let itemsStr = quniPackages.join(",");
        this.$message.error(`包装${itemsStr}已经存在！`);
        return;
      }
      this.packageData = this.packageData.concat(this.packageListValueData);
      this.packageListValueData = [];
      this.valueSelectPackage = [];
      this.$refs.addPackageSelect.blur();
    },
    chooseSelectPackage() {
      let packageListValueDataArr = [];
      this.packageListData.forEach((item) => {
        if (this.valueSelectPackage.indexOf(item.id) > -1) {
          packageListValueDataArr.push(item);
        }
      });
      this.packageListValueData = JSON.parse(
        JSON.stringify(packageListValueDataArr)
      );
    },
    getPackageList() {
      const params = {};
      packList(params).then((res) => {
        const data = res.data;
        if (data.code == 200) {
          this.packageListData = data.data;
          this.packageListData.forEach((item) => {
            item.packId = item.id;
            item.packUnitPrice = item.unitPrice;
            item.packUnitWeight = item.unitWeight;
          });
        } else {
          this.$message.error(data.message);
        }
      });
    },
    handleCancelItems() {
      this.clearSearch();
      this.itemsVisible = false;
    },
    handleSubmitItems() {
      if (this.rowSelectionChangeData.length === 0) {
        this.$message.error("请选择一条数据进行添加！");
        return;
      }
      let quniRows = [];
      this.data.forEach((item) => {
        this.rowSelectionChangeData.forEach((val) => {
          if (item.id === val.id) {
            quniRows.push(item.itemName);
          }
        });
      });
      if (quniRows.length > 0) {
        let itemsStr = quniRows.join(",");
        this.$message.error(`商品${itemsStr}已经存在！`);
        // return;
      }
      this.rowSelectionChangeData.forEach((item) => {
        if (this.resStrData.length) {
          this.resStrData.forEach((val) => {
            if (item.itemName === val.name) {
              item.poQty = val.num;
              item.priceUnit = val.unit;
            }
          });
        }
        let obj = {
          id: "",
          itemId: "",
          itemName: "",
          itemCode: "",
          itemCountryOrigin: "",
          poQty: null,
          sumQty: "",
          sumWeight: "",
          stock: "",
          unit: "",
          priceUnit: "",
          customerName: "",
          storeName: "",
          poPrice: "",
          itemSpec: undefined,
          itemType: "",
          itemLevel: "",
          packingCost: "",
          itemBrand: "",
          itemBrandRefList: [],
          poTotalAmount: "",
          specList: [],
          remark: "",
          inputTaxRate: "",
          pkgDetails: [],
          invoiceBusinessType: '',
          invoiceType: '',
        };
        obj.id = item.id;
        obj.itemId = item.id;
        obj.itemName = item.itemName === '' ? undefined : item.itemName;
        obj.poQty = item.poQty ? item.poQty : "";
        obj.sumQty = item.sumQty;
        obj.itemCode = item.itemCode === '' ? undefined : item.itemCode;
        obj.specList = item.specList || [];
        obj.sumWeight = item.sumWeight ? item.sumWeight / 1000 : 0;
        obj.stock = item.stock === '' ? undefined : item.stock;
        obj.unit = item.unit === '' ? undefined : item.unit;
        obj.poPrice =
          item.purchaseUnitPrice && item.purchaseUnitPrice > 0
            ? item.purchaseUnitPrice
            : item.poPrice && item.poPrice > 0
              ? item.poPrice
              : "";
        // obj.itemBrand = item.brand;
        obj.itemBrandRefList = item.itemBrandRefList || [];
        obj.priceUnit = item.priceUnit;
        obj.pkgDetails = item.packDetailList || [];
        obj.inputTaxRate = item.inputTaxRate === '' ? undefined : item.inputTaxRate;
        obj.countryOriginList = item.countryOriginList || [];
        obj.varietiesList = item.varietiesList || [];
        obj.itemLevelList = item.itemLevelList || [];
        obj.itemLevel = obj.itemLevelList[0] === '' ? undefined : obj.itemLevelList[0];
        obj.itemBrand = obj.itemBrandRefList[0]?.brandName === '' ? undefined : obj.itemBrandRefList[0]?.brandName;
        obj.itemType = obj.varietiesList[0] === '' ? undefined : obj.varietiesList[0];
        obj.itemCountryOrigin = obj.countryOriginList[0] === '' ? undefined : obj.countryOriginList[0];
        this.data.push(obj);
      });
      this.data.forEach((item, index) => {
        item.keyIndex = index + 1;
      });
      this.clearSearch();
      this.itemsVisible = false;
      console.log(this.orderFeeList);
    },
    handleCancelPackage() {
      this.packageVisible = false;
    },
    handleSubmitPackage() {
      let packagePrice = 0;
      let packageDataArr = JSON.parse(JSON.stringify(this.packageData));
      packageDataArr.forEach((item) => {
        let uPrice = item.packQty * item.packUnitPrice;
        packagePrice = packagePrice + uPrice;
      });
      let uniqArr = [];
      for (let i = 0; i < this.data.length; i++) {
        let item = this.data[i];
        if (item.id === this.ItemsObj.id) {
          packageDataArr.forEach((val) => {
            if (isFalse(val.packQty)) {
              uniqArr.push(val.packName);
            }
          });
          if (uniqArr.length > 0) {
            let str = uniqArr.join(",");
            this.$message.error(`请填写${str}包装数量！`);
            return;
          }
          item.pkgDetails = packageDataArr;
          item.packingCost = packagePrice;
        }
      }
      this.packageVisible = false;
    },
    handleCancel() {
      // this.visible = false;
      this.data = [];
      this.clearForm();
    },
    handleClickOpData(item) {
      this.form.opCode = item.opCode;
      this.form.opName = item.opName;
    },
    clearForm() {
      this.form = {
        opId: undefined,
        supplierId: undefined,
        agencyId: undefined,
        whId: undefined,
        receivingSubjectId: undefined,
        payAmount: "",
        priceAllStr: "",
        opCode: "",
        opName: "",
        advanceTime: undefined,
        planDeliveryTime: undefined,
        exchangeRate: "",
        currency: undefined,
        expectArrivalDate: null,
        sailDate: null,
        containerCode: "",
        contractId: undefined,
      };
      this.purchaseGlobalOrderDetail = {
        businessType: "进口",
        containerCode: "",
        orderDate: null,
        transactionType: "",
        purposeHarbor: "",
        sailDate: null,
        expectArrivalDate: null,
        shipName: "",
        flowDirection: "",
        orderCode: "",
        pickCode: "",
        shipmentPort: "",
        buyer: "",
        pricingState: "",
        terms: "",
        currency: undefined,
        exchangeRate: "",
      };
      this.data = [];
    },
    handleSubmit() {
      if (this.mustCheck && this.isUndef(this.form.contractId)) {
        this.$message.error("请选择关联合同",3.5)
        return
      }
      this.$refs.infoform.validate((valid) => {
        if (valid) {
          let nullArr = [];
          let data = JSON.parse(JSON.stringify(this.data));
          if (data.length === 0) {
            this.$message.error(`请添加商品信息！`);
            return;
          }
          data.forEach((item) => {
            if (
              isFalse([
                item.priceUnit,
                item.poQty,
                item.poPrice,
                item.inputTaxRate,
                item.invoiceBusinessType,
                item.invoiceType,
              ])
            ) {
              nullArr.push(item.itemName);
            }
            //重量*1000
            item.sumWeight = item.sumWeight * 1000;
            //价格乘100
            // item.poPrice = item.poPrice * 100;
            // item.poTotalAmount = item.poTotalAmount * 100;
            // item.packingCost = item.packingCost * 100;
            item.poQty = parseFloat(item.poQty);
          });
          let form = JSON.parse(JSON.stringify(this.form));
          // form.payAmount = form.payAmount * 100;
          let purchaseFeeList = this.purchaseFeeList.length ? JSON.parse(
            JSON.stringify(this.purchaseFeeList)) : JSON.parse(JSON.stringify(this.PriceData));
          // purchaseFeeList.forEach((item) => {
          //   // item.feeAmount = item.feeAmount * 100;
          // });
          if (nullArr.length > 0) {
            let str = nullArr.join(",");
            this.$message.error(
              `商品${str}的计价单位、数量、采购单价、进项税为必填项！`
            );
          } else {
            if (this.modalType == 'gn') {
              this.$refs.feemodel.submit()
              if (this.orderFeeList && this.orderFeeList.length > 0 ? this.orderFeeList.some(
                (item) => isFalse([item.receivingSubjectId, item.rate, item.feeAmount, item.invoiceBusinessType, item.invoiceType])
              ) : false
              ) {
                this.$message.error("请填写费用必填项");
                return;
              }
            }
            const gnParams = {
              ...form,
              details: data,
              purchaseFeeList: this.orderFeeList,
            };
            this.purchaseGlobalOrderDetail.containerCode =
              this.form.containerCode;
            this.purchaseGlobalOrderDetail.sailDate = this.form.sailDate;
            this.purchaseGlobalOrderDetail.expectArrivalDate =
              this.form.expectArrivalDate;
            this.purchaseGlobalOrderDetail.currency = this.form.currency;
            this.purchaseGlobalOrderDetail.exchangeRate =
              this.form.exchangeRate;
            this.purchaseGlobalOrderDetail.agencyId =
              this.form.agencyId;
            this.purchaseGlobalOrderDetail.agencyName =
              this.form.agencyName;
            const gjParams = {
              ...form,
              purchaseGlobalOrderDetail: this.purchaseGlobalOrderDetail,
              purchaseFeeList: purchaseFeeList,
              details: data,
            };
            this.submitLoading = true;
            if (this.funType) {
              // delete gjParams.purchaseGlobalOrderDetail?.orderCode;
              delete gjParams.id;
              delete gjParams.createDate;
              delete gjParams.createUser;
              delete gjParams.poCode;
              delete gjParams.poId;
              delete gjParams.poState;
              delete gnParams.id;
              delete gnParams.createDate;
              delete gnParams.createUser;
              delete gnParams.poCode;
              delete gnParams.poId;
              delete gnParams.poState;
              gjParams.details.forEach((item) => {
                delete item.id;
                delete item.poId;
                delete item.poCode;
                delete item.createUser;
                delete item.createDate;
                delete item.updateUser;
                delete item.updateDate;
                delete item.version;
                delete item.supplierId;
                delete item.agencyId;
                delete item.agencyName;
                delete item.supplierName;
                delete item.supplierCode;
                delete item.containerCode;
                delete item.plateNumber;
              });
              gnParams.details.forEach((item) => {
                delete item.id;
                delete item.poId;
                delete item.poCode;
                delete item.createUser;
                delete item.createDate;
                delete item.updateUser;
                delete item.updateDate;
                delete item.version;
                delete item.supplierId;
                delete item.supplierName;
                delete item.supplierCode;
                delete item.containerCode;
                delete item.plateNumber;
              });
            }
            this.funType && (this.modalState = "add");
            if (this.modalState === "add") {
              if (this.modalType === "gn") {
                purchaseOrderHeadInsertPo(gnParams).then((res) => {
                  this.submitLoading = false;
                  const data = res.data;
                  if (data.code == 200) {
                    this.$message.success("新增成功！");
                    // this.$parent.getTableList();
                    this.handleBack();
                    this.clearForm();
                    // this.visible = false;
                  } else {
                    this.$message.error(data.message);
                  }
                }).catch(() => {
                  this.submitLoading = false;
                  this.$message.error('接口超时')
                });
              } else if (this.modalType === "gj") {
                purchaseGlobalOrderInsertPo(gjParams).then((res) => {
                  this.submitLoading = false;
                  const data = res.data;
                  if (data.code == 200) {
                    this.$message.success("新增成功！");
                    // this.$parent.getTableList();
                    this.handleBack();
                    this.clearForm();
                    // this.visible = false;
                  } else {
                    this.$message.error(data.message);
                  }
                }).catch(() => {
                  this.submitLoading = false;
                  this.$message.error('接口超时')
                });
              }
            } else if (this.modalState === "edit") {
              if (this.modalType === "gn") {
                updatePurchaseOrderHead(gnParams).then((res) => {
                  this.submitLoading = false;
                  const data = res.data;
                  if (data.code == 200) {
                    this.$message.success("编辑成功！");
                    // this.$parent.getTableList();
                    this.handleBack();
                    this.clearForm();
                    // this.visible = false;
                  } else {
                    this.$message.error(data.message);
                  }
                }).catch(() => {
                  this.submitLoading = false;
                  this.$message.error('接口超时')
                });
              } else if (this.modalType === "gj") {
                purchaseOrderHeadUpdatePo(gjParams).then((res) => {
                  this.submitLoading = false;
                  const data = res.data;
                  if (data.code == 200) {
                    this.$message.success("编辑成功！");
                    // this.$parent.getTableList();
                    this.handleBack();
                    this.clearForm();
                    // this.visible = false;
                  } else {
                    this.$message.error(data.message);
                  }
                }).catch(() => {
                  this.submitLoading = false;
                  this.$message.error('接口超时')
                });
              }
            }
          }
        } else {
          return false;
        }
      });
    },
    getTenantData() {
      const params = {};
      TenantSearch(params).then((res) => {
        const data = res.data;
        if (data.code == 200) {
          this.TenantData = data.data;
        } else {
          this.$message.error(data.message);
        }
      });
    },
    getPartnerData() {
      // 取出收款主体,启用状态中供应商、代理公司
      const params = {
        partnerTypes: [30, 40],
        isEnable: 1
      };
      partnerType(params).then((res) => {
        const data = res.data;
        if (data.code == 200) {
          this.PartnerData = data.data;
        } else {
          this.$message.error(data.message);
        }
      });
    },
    getWareHouseData() {
      const params = {};
      wareHouseList(params).then((res) => {
        const data = res.data;
        if (data.code == 200) {
          this.WareHouseData = data.data;
        } else {
          this.$message.error(data.message);
        }
      });
    },
    getDictionaryData(type) {
      const params = {
        type: type,
      };
      dictionaryList(params).then((res) => {
        const data = res.data;
        if (data.code == 200) {
          if (type === 10) {
            this.dictionaryData = data.data;
          } else if (type === 14) {
            this.currencyData = data.data;
          }
        } else {
          this.$message.error(data.message);
        }
      });
    },
    getBuyer() {
      getBuyer().then(
        (res) => res.data.code == 200 && (this.buyerOption = res.data.data)
      );
    },
    //新增国际单发票类型
    getInvoiceOption(record) {
      // 发票类型
      const options = [
        { value: 1, text: '增值税普通发票' },
        { value: 2, text: '增值税专用发票' },
        { value: 3, text: '增值税普通发票(免税)' },
        { value: 4, text: '进口增值税缴款书' },
        { value: 5, text: '进口关税缴款书' },
      ]
      // 费用类型
      const filterInvoiceOptions = this.filterInvoiceOptions
      return options.filter(
        item => {
          if (!filterInvoiceOptions.includes(record.feeName)) {
            return item.value < 4
          } else if (record.feeName === '进口增值税') {
            return item.value === 4
          } else if (record.feeName === '进口关税') {
            return item.value === 5
          }
        }
      )
    }
  },
  created() {
    this.$nextTick(() => {
      this.getTenantData();
      this.getPartnerData();
      this.getWareHouseData();
      // this.getItemList();
      this.getPackageList();
      this.getDictionaryData(10);
      this.getDictionaryData(14);
      this.getBuyer();
    });
  },
};
</script>
<style scoped lang="less">
.details {
  .info {
    margin-bottom: 10px;

    .info-title {
      height: 35px;
      line-height: 35px;
      padding: 0 20px;
      background-color: rgb(240, 243, 246);
      font-weight: 550;
      border-radius: 6px;
      margin-bottom: 0;
    }
  }

  /deep/.ant-form-item-label {
    line-height: 22px;
  }

  /deep/.ant-form-item {
    margin-bottom: 0;
  }

  .table {
    border: 1px solid #f0f0f0;
    border-radius: 6px;

    .table-title {
      height: 35px;
      line-height: 35px;
      padding: 0 20px;
      background-color: rgb(240, 243, 246);
      font-weight: 550;
      border-radius: 6px;
      margin-bottom: 0;
    }

    .table-data {
      padding: 10px;

      .table-formva::before {
        display: inline-block;
        color: #f5222d;
        font-size: 14px;
        line-height: 1;
        content: "*";
      }

      .table-input-number {
        /deep/.ant-input-number-handler-wrap {
          width: 0;
          height: 0;
        }
      }
    }

    .table-total {
      margin-bottom: 0;
      padding: 0 20px;
      line-height: 35px;
    }
  }

  .search {
    padding-bottom: 8px;
  }

  .pagination {
    padding-top: 8px;
    text-align: right;
  }
}
</style>