<template>
  <div>
    <a-page-header style="border: 1px solid rgb(235, 237, 240)" :title="subTitle" @back="handleBack" />
    <div class="basic-data" id="printPickUpOrder">
      <a-card title="基本信息" class="card-info" :head-style="{ backgroundColor: '#f0f3f6' }" size="small">
        <div class="data">
          <a-form :form="basicInfo">
            <a-row :gutter="10">
              <a-col :span="4">
                <a-form-item label="采购订单编号">
                  <a-input v-model="basicInfo.poCode" disabled />
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item label="需求单号">
                  <a-input v-model="basicInfo.roCode" disabled />
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item label="采购订单提交时间">
                  <a-input v-model="basicInfo.poSubtime" disabled />
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item label="采购员">
                  <a-select v-model="basicInfo.buyerId" @change="getBuyerName" :disabled="
                    formDisabled
                  " allowClear>
                    <a-select-option v-for="(item, j) in select.buyer" :value="item.id" :key="j">
                      {{ item.realName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="4" v-if="poType == 2">
                <a-form-item label="订单日期">
                  <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" valueFormat="YYYY-MM-DD HH:mm:ss"
                    v-model="basicInfo.orderDate" style="width: 100%" :disabled="
                      formDisabled
                    " />
                </a-form-item>
              </a-col>
              <a-col :span="4" v-if="poType == 2">
                <a-form-item label="订单号">
                  <a-input v-model="basicInfo.orderCode" :disabled="
                    formDisabled
                  " />
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item label="供应商名称">
                  <a-select v-model="basicInfo.supplierId" placeholder="请选择供应商" :disabled="
                    formDisabled
                  " @select="changeSupplier" allowClear show-search :filter-option="filterOption">
                    <a-select-option v-for="item in supplierList" :key="item.id">{{ item.partnerName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item label="代理公司名称">
                  <a-select v-model="basicInfo.agencyId" placeholder="请选择代理公司" :disabled="
                    formDisabled
                  " allowClear show-search :filter-option="filterOption">
                    <a-select-option v-for="item in agentList" :key="item.id">{{
                        item.partnerName
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item label="供应商联系手机">
                  <a-input v-model="basicInfo.supplierPhone" :disabled="
                    formDisabled
                  " />
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item label="供应商地址">
                  <a-input v-model="basicInfo.supplierAddress" :disabled="
                    formDisabled
                  " />
                </a-form-item>
              </a-col>
              <a-col v-if="poType == 1" :span="4">
                <a-form-item label="计划交货时间">
                  <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" valueFormat="YYYY-MM-DD HH:mm:ss"
                    v-model="basicInfo.planDeliveryTime" style="width: 100%" :disabled="
                      formDisabled
                    " />
                </a-form-item>
              </a-col>
              <a-col :span="4" v-if="poType == 2">
                <a-form-item label="业务类型">
                  <a-select v-model="basicInfo.businessType" placeholder="请选择业务类型" :disabled="
                    formDisabled
                  " allowClear>
                    <a-select-option value="进口"> 进口 </a-select-option>
                    <a-select-option value="出口"> 出口 </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="4" v-if="poType == 2">
                <a-form-item label="交易方式">
                  <a-input v-model="basicInfo.transactionType" :disabled="
                    formDisabled
                  " />
                </a-form-item>
              </a-col>
              <a-col :span="4" v-if="poType == 2">
                <a-form-item label="柜号">
                  <a-input v-model="basicInfo.containerCode" :disabled="
                    formDisabled
                  " />
                </a-form-item>
              </a-col>
              <a-col :span="4" v-if="poType == 1">
                <a-form-item :class="{ required: showModalState != 0 }" label="入库仓库">
                  <a-select v-model="basicInfo.whId" :disabled="
                    formDisabled
                  " @select="selectWarehouse">
                    <a-select-option v-for="item in warehouseList" :key="item.baseId">{{ item.name }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12" v-if="poType == 1">
                <a-form-item :class="{required: showModalState!=0 && mustCheck}" label="关联合同">
                  <a-select class="marginLeft widthMarginTop" style="width: 90%;" show-search
                    v-model="basicInfo.contractId" placeholder="请先选择供应商" :default-active-first-option="false"
                    :filter-option="false" :not-found-content="null" :disabled="
                      !basicInfo.supplierId ||
                      formDisabled
                    " @search="contract" @select="contractSelect" @focus="contract">
                    <a-select-option v-for="item in contractOption" :key="item.id">{{ item.contractTitle }}&{{ item.contractNumber }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            <!-- </a-row>
            <a-row :gutter="12" v-if="poType == 2"> -->
              <a-col :span="4" v-if="poType == 2">
                <a-form-item label="开船日期">
                  <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" valueFormat="YYYY-MM-DD HH:mm:ss"
                    v-model="basicInfo.sailDate" style="width: 100%" :disabled="
                      formDisabled
                    " />
                </a-form-item>
              </a-col>
              <a-col :span="4" v-if="poType == 2">
                <a-form-item label="发货港">
                  <a-input v-model="basicInfo.shipmentPort" :disabled="
                    formDisabled
                  " />
                </a-form-item>
              </a-col>
              <a-col :span="4" v-if="poType == 2">
                <a-form-item label="目的港">
                  <a-input v-model="basicInfo.purposeHarbor" :disabled="
                    formDisabled
                  " />
                </a-form-item>
              </a-col>
              <a-col :span="4" v-if="poType == 2">
                <a-form-item label="预计到港日期">
                  <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" valueFormat="YYYY-MM-DD HH:mm:ss"
                    v-model="basicInfo.expectArrivalDate" style="width: 100%" :disabled="
                      formDisabled
                    " />
                </a-form-item>
              </a-col>
              <a-col :span="4" v-if="poType == 2">
                <a-form-item label="船名">
                  <a-input v-model="basicInfo.shipName" :disabled="
                    formDisabled
                  " />
                </a-form-item>
              </a-col>
              <a-col :span="4" v-if="poType == 2">
                <a-form-item label="流向">
                  <a-input v-model="basicInfo.flowDirection" :disabled="
                    formDisabled
                  " />
                </a-form-item>
              </a-col>
              <a-col :span="4" v-if="poType == 2">
                <a-form-item label="提单">
                  <a-input v-model="basicInfo.pickCode" :disabled="
                    formDisabled
                  " />
                </a-form-item>
              </a-col>
              <a-col :span="4" v-if="poType == 2">
                <a-form-item label="条款">
                  <a-input v-model="basicInfo.terms" :disabled="
                    formDisabled
                  " />
                </a-form-item>
              </a-col>
              <a-col :span="4" v-if="poType == 2">
                <a-form-item class="required" label="入库仓库">
                  <a-select v-model="basicInfo.whId" :disabled="
                    formDisabled
                  " @select="selectWarehouse">
                    <a-select-option v-for="item in warehouseList" :key="item.baseId">{{ item.name }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="4" v-if="poType == 2">
                <a-form-item label="币种">
                  <a-select v-model="basicInfo.currency" placeholder="请选择币种" :disabled="
                    formDisabled
                  " allowClear>
                    <a-select-option v-for="item in select.money" :key="item.dicText">{{ item.dicText }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="4" v-if="poType == 2">
                <a-form-item label="汇率">
                  <a-input-number style="width: 100%;" v-model="basicInfo.exchangeRate" :disabled="formDisabled" />
                </a-form-item>
              </a-col>
              <a-col :span="4" v-if="poType == 2">
                <a-form-item label="定价方式">
                  <a-input v-model="basicInfo.pricingState" :disabled="
                    formDisabled
                  " />
                </a-form-item>
              </a-col>
              <a-col :span="12" v-if="poType == 2">
                <a-form-item :class="{required: showModalState!=0 && mustCheck}" label="关联合同">
                  <a-select class="marginLeft widthMarginTop" style="width: 90%;" show-search
                    v-model="basicInfo.contractId" placeholder="请先选择供应商" :default-active-first-option="false"
                    :filter-option="false" :not-found-content="null" :disabled="
                      !basicInfo.supplierId ||
                      formDisabled
                    " @search="contract" @select="contractSelect" @focus="contract">
                    <a-select-option v-for="item in contractOption" :key="item.id">{{ item.contractTitle }}&{{ item.contractNumber }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-card>
      <a-card title="收货单商品列表" class="card-table" :head-style="{ backgroundColor: '#f0f3f6' }" size="small"
        style="margin-top: 10px">
        <div v-if="poType == 1">
          <a-radio-group v-model="enterDetailType" button-style="solid" @change="typeChange">
            <a-radio-button :value="1"> 按客户录入 </a-radio-button>
            <a-radio-button :value="2"> 按商品录入 </a-radio-button>
          </a-radio-group>
        </div>
        <a-table :columns="poType == 2 ? columnsGJ : columns" :data-source="tableDetail" rowKey="id" :pagination="false"
          :loading="tableLoading" size="small" :scroll="{ y: 300, x: 1300 }" class="detail-table"
          style="margin-top: 10px">
          <span slot="reTitle" class="table-formva"> 实收数量</span>
          <span slot="inputTaxRate" class="table-formva"> 税率/抵扣率(%)</span>
          <span slot="puTitle" class="table-formva">{{
              poType == 2 ? '国际单价' : '采购价格'
          }}</span>
          <span slot="itemName" slot-scope="text, record">{{ record.itemName
          }}{{ record.itemCode ? '-' + record.itemCode : '' }}</span>
          <template slot="puPrice" slot-scope="text, record, index">
            <div>
              <a-input-number v-model="record.puPrice" :disabled="
                formDisabled
              " @change="deliveryQtyChange(record, index)" />
            </div>
          </template>
          <span slot="puPriceRMB" slot-scope="text, record" v-if="poType == 2">{{ formatPrice(record.puPrice * GJprice)
          }}</span>
          <template slot="priceUnit" slot-scope="text, record">
            <div>
              <a-select style="width: 100%" v-model="record.priceUnit" placeholder="计价单位" :disabled="
                formDisabled
              ">
                <a-select-option v-for="item in dictionaryData" :key="item.id" :value="item.dicText">{{ item.dicText }}
                </a-select-option>
              </a-select>
            </div>
          </template>
          <template slot="poPrice" slot-scope="text, record">
            <div>
              <a-input-number v-model="record.poPrice" :disabled="
                formDisabled
              " />
            </div>
          </template>
          <!-- 免税 -->
          <span slot="invoiceBusinessTypeTit" class="table-formva">发票类型</span>
          <span slot="invoiceBusinessType" slot-scope="text, record">
            <a-select v-model="record.invoiceBusinessType" @click.stop.native placeholder="" style="width: 40%"
              :disabled="
                formDisabled
              " @change="forEachCaculate('no')">
              <a-select-option :value="0">应税业务</a-select-option>
              <a-select-option :value="1">免税业务</a-select-option>
            </a-select>
            <a-select v-model="record.invoiceType" @click.stop.native placeholder="" style="width: 60%" :disabled="
              formDisabled
            " @change="forEachCaculate('no')">
              <a-select-option v-for="(item, index) in invoiceOption" :key="index" :value="item.value"
                :title="item.text">
                {{ item.text }}
              </a-select-option>
            </a-select>
          </span>
          <template slot="inputTaxRate" slot-scope="text, record">
            <span style="width: 40%">
              <span v-if="record.invoiceType == 3">抵扣率</span>
              <span v-if="record.invoiceType == 1 || record.invoiceType == 2">税率</span>
            </span>
            <a-select :disabled="
              formDisabled
            " v-model="record.inputTaxRate" placeholder="必填" style="width: 50%; margin-left: 2px"
              @change="forEachCaculate('no')">
              <a-select-option v-for="item in rateOption" :key="item">{{
                  item
              }}</a-select-option>
            </a-select>
          </template>
          <template slot="deliveryNetweight" slot-scope="text, record">
            <div>
              <a-input-number :disabled="
                formDisabled
              " v-model="record.deliveryNetweight" />
            </div>
          </template>
          <template slot="itemPrice" slot-scope="text, record, index">
            <div>
              <a-input-number :disabled="
                formDisabled
              " v-model="record.itemPrice" @change="totalSumItem(record, index)" />
            </div>
          </template>
          <template slot="puTotalAmount" slot-scope="text, record, index">
            <div>
              <a-input-number :disabled="
                formDisabled
              " v-model="record.puTotalAmount" @change="totalSum(record, index)" />
            </div>
          </template>
          <template slot="totalCostOfWarehousing" slot-scope="text, record, index">
            <div>
              <a-input-number disabled v-model="record.totalCostOfWarehousing"
                @change="totalCostOfWarehousingChange(record, index)" />
            </div>
          </template>
          <template slot="deliveryQty" slot-scope="text, record, index">
            <div>
              <a-input-number @change="deliveryQtyChange(record, index)" v-model="record.deliveryQty" :disabled="
                formDisabled
              " />
            </div>
          </template>
          <template slot="packageChoose" slot-scope="text, record">
            <a-button type="link" @click="openPackage(record)" :disabled="
              formDisabled
            ">包装选择</a-button>
          </template>
          <template slot="footer">
            <div class="total">
              <span>合计 : </span>
              <span style="margin-left: 20px">商品总金额 :{{
                  (itemPriceTo.toFixed(8) * 100000000) / 100000000 || '-'
              }}</span>
              <span style="margin-left: 20px">入库成本总金额 : {{ getTotalTotalCostOfWarehousing }}</span>
            </div>
          </template>
        </a-table>
      </a-card>
      <a-card title="收货信息" class="card-info" :head-style="{ backgroundColor: '#f0f3f6' }" size="small"
        style="margin-top: 10px">
        <div class="receiving-info">
          <a-form :form="receivingInfo">
            <a-row :gutter="10">
              <a-col :span="5">
                <a-form-item label="收货人">
                  <a-input :disabled="
                    formDisabled
                  " v-model="receivingInfo.deliveryUser" />
                </a-form-item>
              </a-col>
              <a-col :span="5">
                <a-form-item label="收货人联系号码">
                  <a-input v-model="receivingInfo.deliveryPhone" placeholder="" :disabled="
                    formDisabled
                  " />
                </a-form-item>
              </a-col>
              <a-col :span="5">
                <a-form-item label="收货地址">
                  <a-input :disabled="
                    formDisabled
                  " v-model="receivingInfo.deliveryAdress" />
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item label="收货备注">
                  <a-input :disabled="
                    formDisabled
                  " v-model="receivingInfo.remark" />
                </a-form-item>
              </a-col>
              <a-col :span="5">
                <a-form-item label="收货时间">
                  <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" valueFormat="YYYY-MM-DD HH:mm:ss"
                    v-model="receivingInfo.deliveryTime" :disabled="
                      formDisabled
                    " style="width: 100%" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <div class="upload-img">
                <a-form-item label="上传单据">
                  <div class="flex-fs uploadbox">
                    <div v-if="uploadUrls.length > 0" class="flex-fs imgWrap">
                      <div class="uploadImgs" v-for="(item, index) in uploadUrls" :key="index">
                        <span class="imgDelete" @click="deleteUploads(item, index)">
                          <a-icon type="close" />
                        </span>
                        <img v-if="item.type.includes('image')" :src="item.url" :alt="item.name"
                          @click="preView(item.url)" />
                        <div v-else class="cursorPin iconBox textwrap" title="点击下载预览" @click="downloadFile(item.url)">
                          <p class="iconP">
                            <a-icon type="file" />
                          </p>
                          {{ item.name }}
                        </div>
                      </div>
                    </div>
                    <a-upload :before-upload="beforeUpload" :showUploadList="false" :disabled="showModalState == 0">
                      <div class="uploadImgIcon flex-ct" v-if="uploadUrls.length < 21">
                        <a-icon type="plus" />
                      </div>
                    </a-upload>
                    <ImageEdit :imgList="previewImageList" :filePreviewShow="previewVisible"
                      @close="handleCancelPreviewImage" />
                  </div>
                </a-form-item>
              </div>
            </a-row>
          </a-form>
        </div>
      </a-card>
      <a-card title="费用信息" class="card-info" :head-style="{ backgroundColor: '#f0f3f6' }" size="small" style="margin-top: 10px">
        <div class="cost-info">
          <a-form :form="costInfo">
            <a-row :gutter="10" v-if="poType == 1">
              <a-col :span="3">
                <a-form-item label="预付款">
                  <a-input-number :disabled="
                    costInfo.payReconciliaState==620 ||
                    formDisabled
                  " v-model="costInfo.payAmount" @change="payAmountChange" />
                </a-form-item>
              </a-col>
              <a-col :span="3">
                <a-form-item label="预付款比率(%)">
                  <a-input-number :disabled="
                    costInfo.payReconciliaState==620 ||
                    formDisabled
                  " v-model="costInfo.payAmountRatio" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="扣供应商款">
                  <a-input-number v-model="costInfo.deductions" :disabled="
                    formDisabled
                  " @change="deductionsChange" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="尾款">
                  <a-input-number v-model="costInfo.noPayAmount" :disabled="
                    formDisabled
                  " />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="收款主体">
                  <a-select v-model="costInfo.receivingSubjectId" placeholder="请选择收款主体" :disabled="
                    formDisabled
                  " style="width: 100%">
                    <a-select-option v-for="item in partnerList" :key="item.id">{{ item.partnerName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="预付款时间">
                  <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" valueFormat="YYYY-MM-DD HH:mm:ss"
                    v-model="costInfo.advanceTime" :disabled="
                      costInfo.payReconciliaState==620 ||
                      formDisabled
                    " style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="尾款时间">
                  <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" valueFormat="YYYY-MM-DD HH:mm:ss"
                    v-model="costInfo.noPayDate" :disabled="
                      formDisabled
                    " style="width: 100%" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="10" v-if="poType == 2">
              <a-col :span="3">
                <a-form-item label="预付款">
                  <a-input-number :disabled="
                    costInfo.payReconciliaState==620 ||
                    formDisabled
                  " v-model="costInfo.payAmount" @change="payAmountChange" />
                </a-form-item>
              </a-col>
              <a-col :span="3">
                <a-form-item label="预付款比率(%)">
                  <a-input-number :disabled="
                    costInfo.payReconciliaState==620 ||
                    formDisabled
                  " v-model="costInfo.payAmountRatio" />
                </a-form-item>
              </a-col>
              <a-col :span="3">
                <a-form-item label="预付款比例条款">
                  <a-input :disabled="
                    costInfo.payReconciliaState==620 ||
                    formDisabled
                  " v-model="costInfo.payAmountRatioTerm" />
                </a-form-item>
              </a-col>
              <a-col :span="3">
                <a-form-item label="汇率">
                  <a-input-number :disabled="
                    costInfo.payReconciliaState==620 ||
                    formDisabled
                  " v-model="costInfo.payAmountExchangeRate" @change="rateChange" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="预付款币种">
                  <a-select :disabled="
                    costInfo.payReconciliaState==620 ||
                    formDisabled
                  " v-model="costInfo.payAmountCurrency" placeholder="请选择币种" @change="currencyChange(1)">
                    <a-select-option v-for="item in currencyList" :key="item.id" :value="item.dicText">{{ item.dicText
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="人民币金额">
                  <a-input-number @change="RMBchange(1)" :disabled="
                    costInfo.payReconciliaState==620 ||
                    formDisabled
                  " v-model="costInfo.payAmountRMB" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="扣供应商款">
                  <a-input-number v-model="costInfo.deductions" :disabled="
                    formDisabled
                  " @change="deductionsChange" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="扣供应商款币种">
                  <a-select v-model="costInfo.deductionsCurrency" placeholder="请选择币种" :disabled="
                    formDisabled
                  " @change="currencyChange(2)">
                    <a-select-option v-for="item in currencyList" :key="item.id" :value="item.dicText">{{ item.dicText
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="人民币金额">
                  <a-input-number @change="RMBchange(2)" v-model="costInfo.deductionsRMB" :disabled="
                    formDisabled
                  " />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="汇率">
                  <a-input-number @change="rateChange" v-model="costInfo.deductionsExchangeRate" :disabled="
                    formDisabled
                  " />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="尾款">
                  <a-input-number v-model="costInfo.noPayAmount" :disabled="
                    formDisabled
                  " @change="noPayAmountChange" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="尾款币种">
                  <a-select v-model="costInfo.noPayAmountCurrency" placeholder="请选择币种" :disabled="
                    formDisabled
                  " @change="currencyChange(3)">
                    <a-select-option v-for="item in currencyList" :key="item.id" :value="item.dicText">{{ item.dicText
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="人民币金额">
                  <a-input-number @change="RMBchange(3)" v-model="costInfo.noPayAmountRMB" :disabled="
                    formDisabled
                  " />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="汇率">
                  <a-input-number @change="rateChange" v-model="costInfo.noPayAmountExchangeRate" :disabled="
                    formDisabled
                  " />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="收款主体">
                  <a-select v-model="costInfo.receivingSubjectId" placeholder="请选择收款主体" :disabled="
                    formDisabled
                  " style="width: 100%">
                    <a-select-option v-for="item in partnerList" :key="item.id">{{ item.partnerName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="预付款时间">
                  <a-date-picker style="width: 100%" showTime format="YYYY-MM-DD HH:mm:ss"
                    valueFormat="YYYY-MM-DD HH:mm:ss" v-model="costInfo.advanceTime" :disabled="
                      costInfo.payReconciliaState==620 ||
                      formDisabled
                    " />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="尾款时间">
                  <a-date-picker style="width: 100%" showTime format="YYYY-MM-DD HH:mm:ss"
                    valueFormat="YYYY-MM-DD HH:mm:ss" v-model="costInfo.noPayDate" :disabled="
                      formDisabled
                    " />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-card>
      <a-card title="费用项列表" class="card-info" :head-style="{ backgroundColor: '#f0f3f6' }" size="small" style="margin-top: 10px">
        <div class="table">
          <p class="table-title">
            <a-row :gutter="10">
              <a-col :span="8">
                <span>
                  <a-select :disabled="
                    showModalState == 0 ||
                    (btnState &&
                      (basicInfo.reconciliaState == 520 ||
                        basicInfo.reconciliaState == 620))
                  " ref="addFeeSelect" mode="multiple" v-model="valueSelectFee" show-search
                    placeholder="请选择费用进行添加" option-filter-prop="children" style="width: 100%"
                    :filter-option="filterOption" @change="chooseSelectFee"
                    :dropdown-menu-style="{ height: '200px' }">
                    <div slot="dropdownRender" slot-scope="menu">
                      <v-nodes :vnodes="menu" />
                      <a-divider style="margin: 4px 0" />
                      <div style="padding: 4px 8px; cursor: pointer" @mousedown="e => e.preventDefault()">
                        <a-button type="primary" size="small" @click="addFee">确认</a-button>
                      </div>
                    </div>
                    <a-icon slot="suffixIcon" type="smile" />
                    <a-select-option v-for="item in feeCateData" :key="item.id">
                      {{
                          item.type == 1 ? item.name : item.name + '(国际)'
                      }}
                    </a-select-option>
                  </a-select>
                </span>
              </a-col>
            </a-row>
          </p>
          <div class="table-data" v-if="feeData.length > 0">
            <a-table rowKey="fakeId" :pagination="false" :columns="feeColumns" :data-source="feeData"
              :scroll="{ y: 200, x: 1300 }" size="small">
              <span slot="RSTitle" class="table-formva"> 收款主体</span>
              <span slot="FATitle" class="table-formva"> 费用金额</span>
              <span slot="rateTitle" class="table-formva">
                税率/抵扣率(%)</span>
              <span slot="del" slot-scope="text, record, index">
                <a-popconfirm title="确定要删除这条数据吗?" ok-text="确定" cancel-text="取消" @confirm="delFeeOne(record, index)"
                  @cancel="cancel" :disabled="showModalState == 0">
                  <a-button type="link" :disabled="showModalState == 0">
                    删除
                  </a-button>
                </a-popconfirm>
              </span>
              <span slot="feeType" slot-scope="text">{{
                  text == 1 ? '国内' : '国际'
              }}</span>
              <span slot="receivingSubjectId" slot-scope="text, record">
                <a-select style="width: 100%" v-model="record.receivingSubjectId" placeholder="必选"
                  @change="supplierIdChange" :disabled="
                    showModalState == 0 ||
                    record.reconciliaState == 520 ||
                    record.reconciliaState == 620
                  ">
                  <a-select-option v-for="item in partnerList" :key="item.id">{{ item.partnerName }}
                  </a-select-option>
                </a-select>
              </span>
              <span slot="invoiceBusinessTypeTit" class="table-formva">发票类型</span>
              <span slot="invoiceBusinessType" slot-scope="text, record">
                <a-select v-model="record.invoiceBusinessType" @click.stop.native placeholder="" style="width: 40%"
                  @change="forEachCaculate('no')" :disabled="
                    showModalState == 0 ||
                    record.reconciliaState == 520 ||
                    record.reconciliaState == 620
                  ">
                  <a-select-option :value="0">应税业务</a-select-option>
                  <a-select-option :value="1">免税业务</a-select-option>
                </a-select>
                <a-select v-model="record.invoiceType" @click.stop.native placeholder="" style="width: 60%"
                  @change="forEachCaculate('no')" :disabled="
                    showModalState == 0 ||
                    record.reconciliaState == 520 ||
                    record.reconciliaState == 620
                  ">
                  <a-select-option v-for="(item, index) in getInvoiceOption(record)" :key="index"
                    :value="item.value" :title="item.text">
                    {{ item.text }}
                  </a-select-option>
                </a-select>
              </span>
              <span slot="rate" slot-scope="text, record">
                <span style="width: 40%">
                  <span v-if="record.invoiceType == 3">抵扣率</span>
                  <span v-if="[1,2,4,5].includes(record.invoiceType)">税率</span>
                </span>
                <a-select style="width: 50%; margin-left: 2px" v-model="record.rate" placeholder="必填项" :disabled="
                  showModalState == 0 ||
                  record.reconciliaState == 520 ||
                  record.reconciliaState == 620 ||
                  filterInvoiceOptions.includes(record.feeName)
                " @change="forEachCaculate('no')">
                  <a-select-option v-for="item in rateOption" :key="item">{{
                      item
                  }}</a-select-option>
                </a-select>
              </span>
              <span slot="priceExcludingTax" slot-scope="text, record">
                <span :calculateNum="
                  priceExcludingTaxx(
                    record,
                    record.feeAmount,
                    record.rate
                  )
                ">
                  {{
                      record.feeAmount && record.rate
                        ? formatPrice(
                          +record.feeAmount -
                          ((+record.rate / 100) * +record.feeAmount) /
                          (record.dutyFreeState == 1
                            ? (100 + +record.rate) / 100
                            : 1),
                          2
                        )
                        : text || ''
                  }}
                </span>
              </span>
              <span slot="currency" slot-scope="text, record">
                <a-select style="width: 100%" v-model="record.currency" :disabled="
                  showModalState == 0 ||
                  record.reconciliaState == 520 ||
                  record.reconciliaState == 620
                ">
                  <a-select-option v-for="item in currencyOption" :key="item">{{ item }}</a-select-option>
                </a-select>
              </span>
              <span slot="exchangeRate" slot-scope="text, record">
                <a-input-number v-numtrim v-model="record.exchangeRate" :disabled="
                  showModalState == 0 ||
                  record.reconciliaState == 520 ||
                  record.reconciliaState == 620
                "></a-input-number>
              </span>
              <span slot="foreignCurrencyAmount" slot-scope="text, record">
                <a-input-number v-numtrim v-model="record.foreignCurrencyAmount" :disabled="
                  showModalState == 0 ||
                  record.reconciliaState == 520 ||
                  record.reconciliaState == 620
                "></a-input-number>
              </span>
              <span slot="currencyAmount" slot-scope="text, record">
                <span :calculateNum="
                  currencyAmountx(
                    record,
                    record.foreignCurrencyAmount,
                    record.exchangeRate
                  )
                ">
                  {{
                      (+record.foreignCurrencyAmount || 0) &&
                        (+record.exchangeRate || 0)
                        ? formatPrice(
                          (+record.foreignCurrencyAmount).toFixed(2) *
                          (+record.exchangeRate).toFixed(2),
                          2
                        )
                        : ''
                  }}
                </span>
              </span>
              <span slot="customsClearanceFeeNumber" slot-scope="text, record">
                <a-input v-model="record.customsClearanceFeeNumber" :disabled="
                  showModalState == 0 ||
                  record.reconciliaState == 520 ||
                  record.reconciliaState == 620
                " />
              </span>
              <span slot="feeAmount" slot-scope="text, record">
                <a-input-number v-model="record.feeAmount" placeholder="必填" @change="singleFeeChange()" :disabled="
                  showModalState == 0 ||
                  record.reconciliaState == 520 ||
                  record.reconciliaState == 620
                " />
              </span>
              <span slot="remark" slot-scope="text, record">
                <a-input v-model="record.remark" :disabled="
                  showModalState == 0 ||
                  record.reconciliaState == 520 ||
                  record.reconciliaState == 620
                " />
              </span>
              <template slot="footer">
                <div>费用项合计 : {{ totalFee }}</div>
              </template>
            </a-table>
          </div>
        </div>
      </a-card>
    </div>
    <div class="footer-btn" style="
        text-align: right;
        height: 60px;
        line-height: 60px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      ">
      <a-space>
        <a-button @click="handleBack"> 返回 </a-button>
        <a-button :loading="btnLoading" v-if="showModalState == 1" type="primary" @click="handleOk">保存</a-button>
      </a-space>
    </div>
    <a-modal title="包装选择" :visible="packageVisible" :width="700" @cancel="handleCancelPackage"
      :dialogStyle="{ top: '160px' }" destroyOnClose>
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
                  <div style="padding: 4px 8px; cursor: pointer" @mousedown="e => e.preventDefault()">
                    <a-button type="primary" size="small" @click="addPackage">确认</a-button>
                  </div>
                </div>
                <a-select-option v-for="item in packageListData" :key="item.id">
                  {{ item.packName }}
                </a-select-option>
              </a-select>
            </span>
          </p>
          <div class="table-data">
            <a-table rowKey="packCode" :pagination="false" :columns="packageColumns" :data-source="packageData"
              :scroll="{ y: 200 }">
              <span slot="PQTitle" class="table-formva"> 包装数量</span>
              <span slot="del" slot-scope="text, record, index">
                <a-popconfirm title="确定要删除这条数据吗?" ok-text="确定" cancel-text="取消" @confirm="delPackageOne(record, index)"
                  @cancel="cancel">
                  <a-button type="link">删除</a-button>
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
  </div>
</template>
<script>
import axios from 'axios'
import {
  getPoDetailsForGroup,
  dictionary,
  getFeeList,
  getOrderDetail,
  pickUpOrder,
  getOrderDetailNormal,
  GetWarehouseData,
  GetCurrencyList,
  received,
  contract
} from '../../services/pickUpOrder/pickUpOrderList'
import { mustContract } from "../../services/commonSaasApi";
import { partnerType } from '../../services/userMa'
import {
  packList,
  dictionaryList,
  getBuyer
} from '../../services/purchaseSaleInventory'
import {
  addImg,
  uploadFiles,
  delUploadFiles
} from '../../services/product/productList'
import { mixin } from '../../utils/mixins'
import ImageEdit from '../../components/imageEdit/imageEdit.vue'
import { isFalse } from '../../utils/util'
import { PARTNER_STRATEGY } from '@/services/dataFilterStrategy'
import deepClone from 'lodash.clonedeep'
const columns = [
  {
    align: 'center',
    title: '商品名称/编号',
    dataIndex: 'itemName',
    key: 2,
    width: 150,
    scopedSlots: { customRender: 'itemName' }
  },
  { align: 'center', title: '规格', dataIndex: 'itemSpec', key: 5, width: 100 },
  {
    align: 'center',
    title: '采购数量',
    dataIndex: 'poQty',
    width: 100,
    key: 8
  },
  {
    align: 'center',
    slots: { title: 'reTitle' },
    dataIndex: 'deliveryQty',
    key: 12,
    width: 100,
    scopedSlots: { customRender: 'deliveryQty' }
  },
  {
    align: 'center',
    slots: { title: 'puTitle' },
    dataIndex: 'puPrice',
    scopedSlots: { customRender: 'puPrice' },
    width: 120,
    key: 6
  },
  {
    align: 'center',
    title: '采购计价单位',
    dataIndex: 'priceUnit',
    key: 10,
    width: 100,
    scopedSlots: { customRender: 'priceUnit' }
  },
  {
    align: 'center',
    slots: { title: 'invoiceBusinessTypeTit' },
    dataIndex: 'invoiceBusinessType',
    scopedSlots: { customRender: 'invoiceBusinessType' },
    key: 199,
    width: 280
  },
  {
    align: 'center',
    slots: { title: 'inputTaxRate' },
    dataIndex: 'inputTaxRate',
    scopedSlots: { customRender: 'inputTaxRate' },
    key: 144,
    width: 200
  },
  {
    align: 'center',
    title: '商品金额',
    dataIndex: 'itemPrice',
    scopedSlots: { customRender: 'itemPrice' },
    key: 14,
    width: 100
  },
  {
    align: 'center',
    title: '辅助单位',
    dataIndex: 'deliveryNetweight',
    key: 11,
    width: 100,
    scopedSlots: { customRender: 'deliveryNetweight' }
  },
  {
    align: 'center',
    title: '客户名称',
    dataIndex: 'customerName',
    key: 3,
    width: 250
  },
  {
    align: 'center',
    title: '门店名称',
    dataIndex: 'storeName',
    key: 4,
    width: 150
  },
  {
    align: 'center',
    title: '包装',
    dataIndex: 'packageChoose',
    key: 13,
    width: 100,
    scopedSlots: { customRender: 'packageChoose' }
  },
  {
    align: 'center',
    title: '包装费用',
    dataIndex: 'packingCost',
    key: 17,
    width: 100
  },
  {
    align: 'center',
    title: '成本分摊单价',
    dataIndex: 'costAllocationUnitPrice',
    width: 150
  },
  {
    align: 'center',
    title: '入库总成本金额',
    dataIndex: 'totalCostOfWarehousing',
    width: 150
  },
  { align: 'center', title: '备注', dataIndex: 'remark', key: 16, width: 100 }
]
const columnsGJ = [
  {
    align: 'center',
    title: '商品名称/编号',
    dataIndex: 'itemName',
    key: 2,
    width: 200,
    scopedSlots: { customRender: 'itemName' }
  },
  { align: 'center', title: '规格', dataIndex: 'itemSpec', key: 5, width: 100 },
  {
    align: 'center',
    title: '采购数量',
    dataIndex: 'poQty',
    width: 100,
    key: 8
  },
  {
    align: 'center',
    slots: { title: 'reTitle' },
    dataIndex: 'deliveryQty',
    key: 12,
    width: 100,
    scopedSlots: { customRender: 'deliveryQty' }
  },
  {
    align: 'center',
    slots: { title: 'puTitle' },
    dataIndex: 'puPrice',
    scopedSlots: { customRender: 'puPrice' },
    width: 120,
    key: 6
  },
  {
    align: 'center',
    title: '人民币单价',
    dataIndex: 'puPriceRMB',
    scopedSlots: { customRender: 'puPriceRMB' },
    width: 120
  },
  {
    align: 'center',
    title: '采购计价单位',
    dataIndex: 'priceUnit',
    key: 10,
    width: 100,
    scopedSlots: { customRender: 'priceUnit' }
  },
  {
    align: 'center',
    title: '商品金额',
    dataIndex: 'itemPrice',
    scopedSlots: { customRender: 'itemPrice' },
    key: 14,
    width: 100
  },
  {
    align: 'center',
    slots: { title: 'invoiceBusinessTypeTit' },
    dataIndex: 'invoiceBusinessType',
    scopedSlots: { customRender: 'invoiceBusinessType' },
    key: 199,
    width: 280
  },
  {
    align: 'center',
    slots: { title: 'inputTaxRate' },
    dataIndex: 'inputTaxRate',
    scopedSlots: { customRender: 'inputTaxRate' },
    key: 144,
    width: 200
  },
  {
    align: 'center',
    title: '辅助单位',
    dataIndex: 'deliveryNetweight',
    key: 11,
    width: 100,
    scopedSlots: { customRender: 'deliveryNetweight' }
  },
  {
    align: 'center',
    title: '客户名称',
    dataIndex: 'customerName',
    key: 3,
    width: 250
  },
  {
    align: 'center',
    title: '门店名称',
    dataIndex: 'storeName',
    key: 4,
    width: 150
  },
  {
    align: 'center',
    title: '包装',
    dataIndex: 'packageChoose',
    key: 13,
    width: 100,
    scopedSlots: { customRender: 'packageChoose' }
  },
  {
    align: 'center',
    title: '包装费用',
    dataIndex: 'packingCost',
    key: 17,
    width: 100
  },
  {
    align: 'center',
    title: '成本分摊单价',
    dataIndex: 'costAllocationUnitPrice',
    width: 150
  },
  {
    align: 'center',
    title: '入库总成本金额',
    dataIndex: 'totalCostOfWarehousing',
    width: 150
  },
  { align: 'center', title: '备注', dataIndex: 'remark', key: 16, width: 100 }
]
const packageColumns = [
  {
    dataIndex: 'del',
    title: '操作',
    width: 100,
    align: 'center',
    scopedSlots: { customRender: 'del' }
  },
  { title: '包装名称', dataIndex: 'packName', width: 100, align: 'center' },
  { title: '包装编号', dataIndex: 'packCode', width: 150, align: 'center' },
  {
    dataIndex: 'packQty',
    slots: { title: 'PQTitle' },
    width: 100,
    align: 'center',
    scopedSlots: { customRender: 'packQty' }
  },
  {
    title: '包装价格(元)',
    dataIndex: 'packUnitPrice',
    width: 110,
    align: 'center',
    scopedSlots: { customRender: 'packUnitPrice' }
  }
]
const feeColumns = [
  {
    dataIndex: 'del',
    title: '操作',
    width: 100,
    align: 'center',
    scopedSlots: { customRender: 'del' }
  },
  {
    title: '费用类型',
    dataIndex: 'feeType',
    width: 100,
    align: 'center',
    scopedSlots: { customRender: 'feeType' }
  },
  { title: '费用项', dataIndex: 'feeName', width: 110, align: 'center' },
  {
    dataIndex: 'receivingSubjectId',
    width: 200,
    align: 'center',
    slots: { title: 'RSTitle' },
    scopedSlots: { customRender: 'receivingSubjectId' }
  },
  {
    dataIndex: 'customsClearanceFeeNumber',
    width: 200,
    align: 'center',
    title: '清关单号',
    scopedSlots: { customRender: 'customsClearanceFeeNumber' }
  },
  {
    dataIndex: 'feeAmount',
    width: 120,
    align: 'center',
    slots: { title: 'FATitle' },
    scopedSlots: { customRender: 'feeAmount' }
  },
  {
    dataIndex: 'invoiceBusinessType',
    width: 280,
    align: 'center',
    slots: { title: 'invoiceBusinessTypeTit' },
    scopedSlots: { customRender: 'invoiceBusinessType' }
  },
  {
    dataIndex: 'rate',
    width: 200,
    align: 'center',
    slots: { title: 'rateTitle' },
    scopedSlots: { customRender: 'rate' }
  },
  {
    title: '不含税金额',
    dataIndex: 'priceExcludingTax',
    width: 120,
    align: 'center',
    scopedSlots: { customRender: 'priceExcludingTax' }
  },
  {
    title: '币种',
    dataIndex: 'currency',
    width: 120,
    align: 'center',
    scopedSlots: { customRender: 'currency' }
  },
  {
    title: '汇率',
    dataIndex: 'exchangeRate',
    width: 120,
    align: 'center',
    scopedSlots: { customRender: 'exchangeRate' }
  },
  {
    title: '外币金额',
    dataIndex: 'foreignCurrencyAmount',
    width: 120,
    align: 'center',
    scopedSlots: { customRender: 'foreignCurrencyAmount' }
  },
  {
    title: '人民币金额',
    dataIndex: 'currencyAmount',
    width: 120,
    align: 'center',
    scopedSlots: { customRender: 'currencyAmount' }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 100,
    align: 'center',
    scopedSlots: { customRender: 'remark' }
  }
]

export default {
  mixins: [mixin],
  components: {
    ImageEdit,
    VNodes: { functional: true, render: (h, ctx) => ctx.props.vnodes }
  },
  data() {
    return {
      mustSelectContract: [],
      mustCheck: false,
      contractOption: [],
      //免税二期
      invoiceOption: [
        { value: 1, text: '增值税普通发票' },
        { value: 2, text: '增值税专用发票' },
        { value: 3, text: '增值税普通发票(免税)' }
      ],
      rateOption: ['0', '1', '3', '6', '9', '11', '13'],
      currencyOption: ['人民币', '美元', '欧元', '英镑', '澳元'],
      columnsGJ,
      exchangeRate: 1,
      puTotalPriceTo: 0,
      btnLoading: false,
      showModalState: '',
      totalOtherPay: '',
      valueSelectFee: [],
      feeCateData: [],
      feeCateValueData: [],
      feeVisible: false,
      feeData: [],
      feeColumns,
      fileList: [],
      poType: '',
      packageVisible: false,
      packageListData: [],
      valueSelectPackage: [],
      packageData: [],
      packageColumns,
      dictionaryData: [],
      poId: '',
      //录入的类型,默认客户录入
      enterDetailType: 1,
      detailsData: [],
      visible: false,
      tableDetail: [],
      tableLoading: false,
      columns,
      basicInfo: {
        opId: '',
        opCode: '',
        opName: '',
        orgId: '',
        poCode: '',
        roCode: '',
        supplierName: '',
        agencyName: '',
        supplierPhone: '',
        poSubtime: '',
        supplierAddress: ''
      },
      receivingInfo: {
        deliveryUser: '',
        deliveryPhone: '',
        deliveryAdress: '',
        deliveryTime: '',
        remark: ''
      },
      costInfo: {
        payAmount: '',
        noPayAmount: '',
        advanceTime: '',
        noPayDate: '',
        receivingSubjectId: ''
      },
      partnerList: [],
      poWeightTo: 0,
      poQtyTo: 0,
      deliverWeTo: 0,
      deliverQtyTo: 0,
      packingCostTo: 0,
      itemPriceTo: 0,
      poTotalAmountTo: 0,
      fileUrlList: [],
      totalCostOfWarehousingSum: '',
      deptId: '',
      //仓库
      warehouseList: [],
      //币种
      currencyList: [],
      previewImage: undefined,
      previewImageList: [],
      previewVisible: false,
      uploadUrls: [],
      subTitle: '',
      receivedFlag: undefined,
      purchaseGlobalOrderDetail: undefined,
      select: {
        buyer: []
      },
      buyerMsg: {},
      record: {},
      filterInvoiceOptions: [
        //新增发票类型
        '进口增值税',
        '进口关税'
      ],
      disableRecord: {},
    }
  },
  directives: {
    numtrim: {
      inserted: function (el) {
        el.oninput = () =>
          (el.value = el.value?.replace(/[^.0-9]|(?<=\.{1}[0-9]{2}).*/, ''))
        el.onpaste = () =>
          (el.value = el.value?.replace(/[^.0-9]|(?<=\.{1}[0-9]{2}).*/, ''))
      }
    }
  },
  computed: {
    productDisable() {
      return (
        this.showModalState == 0 ||
        this.basicInfo.reconciliaState == 520 ||
        this.basicInfo.reconciliaState == 620
      )
    },
    priceExcludingTaxx() {
      return function (record, feeAmount, rate) {
        record.priceExcludingTax =
          feeAmount && rate
            ? this.formatPrice(
              +record.feeAmount -
              ((+record.rate / 100) * +record.feeAmount) /
              ((100 + +record.rate) / 100),
              2
            )
            : record.priceExcludingTax || ''
        return +record.feeAmount - +record.rate * +record.feeAmount
      }
    },
    currencyAmountx() {
      return function (record, foreignCurrencyAmount, exchangeRate) {
        record.currencyAmount =
          (+foreignCurrencyAmount || 0) && (+exchangeRate || 0)
            ? this.formatPrice(
              (+record.foreignCurrencyAmount).toFixed(2) *
              (+record.exchangeRate).toFixed(2),
              2
            )
            : undefined
        return +record.foreignCurrencyAmount * +record.exchangeRate
      }
    },
    getTotalTotalCostOfWarehousing() {
      // let price=0
      // this.feeData.forEach(item=>{
      //   if (item.receivingSubjectId==this.basicInfo.supplierId) {
      //     price+=(+item.feeAmount)||0
      //   }
      // })
      return (
        this.tableDetail.reduce((t, c) => {
          return this.formatPrice(t + (+c.totalCostOfWarehousing || 0))
        }, 0) || '-'
      )
    },
    GJprice() {
      let num
      this.tableDetail.forEach(item => {
        num = item.puPrice && this.exchangeRate ? this.exchangeRate : ''
      })
      return num
    },
    totalFee() {
      return (
        this.feeData.reduce((t, c) => {
          return this.formatPrice(t + (+c.feeAmount || 0), 2)
        }, 0) || '-'
      )
    },
    puTotalAmountT() {
      this.noPayAmountRMBF()
      return (
        this.tableDetail.reduce((t, c) => {
          return this.formatPrice(t + (+c.itemPrice || 0))
        }, 0) || 0
      )
    },
    btnState() {
      let state = false
      if (this.feeData && this.feeData.length > 0) {
        if (
          this.feeData.findIndex(
            item => item.reconciliaState == 510 || item.reconciliaState == 610
          ) == -1
        ) {
          state = true
        }
      }
      return state
    },
    supplierList() {
      return this.partnerList.filter(PARTNER_STRATEGY.SUPPLIER)
    },
    agentList() {
      return this.partnerList.filter(PARTNER_STRATEGY.AGENCY)
    },
    formDisabled(){
      let state=false
      if (this.showModalState == 0 ||this.basicInfo.reconciliaState == 520 ||this.basicInfo.reconciliaState == 620) {
        state=true
      }
      return state
    }
  },
  watch: {
    feeData: {
      handler() {
        this.feeData.forEach(item => {
          if (this.filterInvoiceOptions.includes(item.feeName)) {
            // 新增发票类型，进口增值税税率默认为0
            item.rate = '0'
          }
        })
      },
      deep: true
    },
    'basicInfo.agencyId': {
      handler(value) {
        if (value) {
          this.basicInfo.agencyId = value
          let agencyMsg = this.partnerList?.find(item => item.id == value)
          this.basicInfo.agencyName = agencyMsg?.partnerName
        } else {
          this.basicInfo.agencyName = undefined
        }
      }
    }
  },
  async activated() {
    await this.mustContract()
    this.mustCheck = false
    let record, data, state
    await this.dictionaryList()
    await this.getBuyer()
    await this.getWarehouse()
    await this.getSuppliers()
    this.receivedFlag = undefined
    if (Object.keys(this.$route.query)?.length) {
      //! 该if条件解决不同页签之间切换页面，因this.$route.query对象返回toString后的值，引起数据转化，造成后续程序执行异常问题
      if (this.typeis(this.$route.query.record, 'string') && Object.keys(this.disableRecord)?.length) {
        record = this.disableRecord.record
        this.record = this.disableRecord.record || {}
        data = this.disableRecord.data
        state = this.disableRecord.state
        this.receivedFlag = this.disableRecord.flag
      } else {
        record = this.$route.query.record
        this.record = this.$route.query.record || {}
        data = this.$route.query.data
        state = this.$route.query.state
        this.receivedFlag = this.$route.query.flag
        this.disableRecord = deepClone(this.$route.query)
      }
    }
    this.getCurrency()
    this.uploadUrls = []
    axios({
      method: 'post',
      url: '/uploadFile/getUploadList.action',
      data: { tableId: record.id, tableName: 'pickUpOrder' },
      transformRequest: [
        function (data) {
          let ret = ''
          for (let it in data) {
            ret +=
              encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          ret = ret.substring(0, ret.lastIndexOf('&'))
          return ret
        }
      ],
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(res => {
      if (res.data.code == 200 && res.data.data.length > 0) {
        this.previewImageList = []
        this.uploadUrls = []
        let filetemp = []
        res.data.data.forEach(item => {
          filetemp.push({ ...JSON.parse(item.filePath), id: item.id })
        })
        this.uploadUrls = filetemp
        this.previewImageList = filetemp
      }
    })
    this.showModalState = state
    if (state === 0) {
      this.subTitle = '待收货单详情'
    } else if (state === 1) {
      this.subTitle = '待收货单录入'
      if (this.$route.query.flag === 'receivedList')
        this.subTitle = '已收货国际单编辑'
    }
    this.enterDetailType = 1
    this.deptId = record.deptId || ''
    this.getFeeList(record.poType)
    this.feeData = []
    this.poId = record.id
    let temp = JSON.parse(JSON.stringify(data))
    temp?.forEach(item => {
      if (item.id == record.id) {
        this.poType = item.poType ? item.poType : 1
      }
    })
    if (this.poType == 2) {
      await this.getDetails(record.id)
    }
    if (this.poType == 1) {
      await this.getNormalDetails(record.id)
    }
    if (this.typeis(this.partnerList) == 'array' && !this.partnerList.some(x => x.id == record.supplierId) && !this.typeis(record.supplierId, 'undefined')) {
      this.partnerList.unshift({id: record.supplierId, partnerName: record.supplierName, partnerType: 30})
    }
    if (this.typeis(this.warehouseList) == 'array' && !this.warehouseList.some(x => x.baseId == record.whId) && !this.typeis(record.whId, 'undefined')) {
      this.warehouseList.unshift({baseId: record.whId,name: record.whName,code: record.whCode})
    }
    if (!this.select.buyer.some(x => x.id == record.buyerId) && !this.typeis(record.buyerId, 'undefined')) {
      this.select.buyer.unshift({id: record.buyerId,realName: record.buyerName})
    }
    this.getDictionaryData()
  },
  deactivated() {
    console.log("触发了");
    // this.$closePage('/transport/pickUp/pickUpOrderPickUpRouter')
  },
  methods: {
    async mustContract() {
      await mustContract().then(res => {
        if (res.data.code == 200) {
          this.mustSelectContract = res.data.data
        }
      })
    },
    clearContract() {
      this.basicInfo.contractId = undefined
      this.basicInfo.contractTitle = undefined
      this.contract()
    },
    contract(contractTitle, id, contractMsg) {
      contract({ partnerId: this.basicInfo.supplierId ?? '', contractTitle })
        .then(res => {
          if (res.data.code == 200) {
            this.contractOption = res.data.data
            if (id && this.contractOption.every(vip => vip.id != id)) {
              this.contractOption.unshift(contractMsg)
            }
          } else {
            this.contractOption.splice(0)
          }
        })
        .catch(() => this.contractOption.splice(0))
    },
    contractSelect(id) {
      let contractMsg = this.contractOption.find(item => item.id == id)
      this.basicInfo.contractTitle = contractMsg.contractTitle
    },
    //免税
    dutyFreeStateChange() {
      this.$forceUpdate()
    },
    selectWarehouse(v) {
      let warehouseResult = {}
      warehouseResult = this.warehouseList.find(h => h.baseId == v) ?? {}
      this.basicInfo.whName = warehouseResult.name
      this.basicInfo.whCode = warehouseResult.code
    },
    async dictionaryList() {
      await dictionaryList({ type: 14 }).then(
        res => (this.select.money = res.data.data)
      )
    },
    async getBuyer() {
      await getBuyer().then(res => {
        if (res.data.code == 200) {
          this.select.buyer = res.data.data
        }
        if (
          !this.select.buyer.some(x => x.id == this.record.buyerId) &&
          this.typeis(this.record.buyerId) != 'undefined'
        ) {
          this.select.buyer.unshift({
            id: this.record.buyerId,
            realName: this.record.buyerName
          })
        }
      })
    },
    mustCheckValue(v) {
      this.mustCheck = this.mustSelectContract.includes(v || this.basicInfo.orgId)
    },
    changeSupplier(value) {
      if (!value) {
        this.basicInfo.supplierName = undefined
        return
      }
      this.basicInfo.supplierId = value
      let suplierMsg = this.partnerList?.find(item => item.id == value)
      this.basicInfo.supplierName = suplierMsg.partnerName
      this.mustCheckValue(suplierMsg.orgId)
      this.clearContract()
    },
    getBuyerName(value) {
      if (!value) {
        this.basicInfo.buyerName = undefined
        return
      }
      this.basicInfo.buyerId = value
      this.buyerMsg = this.select.buyer?.find(item => item.id == value)
      this.basicInfo.buyerName = this.buyerMsg.realName
    },
    weikuan() {
      this.noPayAmountRMBF()
    },
    noPayAmountRMBF() {
      this.costInfo.noPayAmountRMB =
        (this.tableDetail.reduce((t, c) => {
          return this.formatPrice(t + (+c.itemPrice || 0))
        }, 0) || 0) * (+this.costInfo.noPayAmountExchangeRate || 1)
    },
    caculateTableValue(value, key, column, id = 0, flag) {
      //endItem
      let exchangeRate =
        this.basicInfo.exchangeRate === undefined &&
          this.basicInfo.exchangeRate === ''
          ? 1
          : +this.basicInfo.exchangeRate
      let keyId = id
      // let tableLength = this.tableDetail.length - 1;
      this.tableDetail.find((item, i) => item.id == id && (keyId = i))
      const newData = [...this.tableDetail]
      const target = newData.filter(item => key === item.key)[keyId]
      if (target) {
        target[column] = value
        target.puTotalAmount =
          flag == 'no'
            ? +target.puTotalAmount
            : this.formatPrice(
              (+target.puPrice || 0) * (+target.deliveryQty || 0)
            )
        target.packingCost = this.formatPrice(
          target.pkgDetails?.reduce((t, c) => {
            return +t + +c.packQty * +c.packUnitPrice || 0
          }, 0)
        )
        target.rowTotal =
          this.poType == 2
            ? (+target.itemPrice || 0) * exchangeRate +
            (+target.packingCost || 0)
            : (+target.itemPrice || 0) + (+target.packingCost || 0)
        target.priceExcludingTax =
          target.invoiceType == 1 || target.invoiceType == 2
            ? +target.rowTotal -
            (target.rowTotal * (+target.inputTaxRate / 100)) /
            (1 + +target.inputTaxRate / 100)
            : target.invoiceType == 3
              ? +target.rowTotal - target.rowTotal * (+target.inputTaxRate / 100)
              : target.priceExcludingTax || 0
        target.priceExcludingTax = +target.priceExcludingTax.toFixed(2)
        target.afterTaxItemAmount =
          target.invoiceBusinessType == 0 &&
            (target.invoiceType == 2 || target.invoiceType == 3)
            ? +target.priceExcludingTax
            : target.rowTotal || ''
        target.tableTotal = this.formatPrice(
          newData.reduce((t, c) => {
            return (
              +t +
              (c.invoiceBusinessType == 0 &&
                (c.invoiceType == 2 || c.invoiceType == 3)
                ? +c.priceExcludingTax
                : +c.rowTotal) || 0
            )
          }, 0)
        )
        target.feeDataTotal = 0
        if (this.feeData && this.feeData.length > 0) {
          this.feeData.forEach(item => {
            if (item.invoiceBusinessType == 0 && item.invoiceType == 2) {
              target.feeDataTotal += +item.priceExcludingTax || 0
            } else if (item.invoiceType == 4) {
              // 进口增值税成本项统计为0
              target.feeDataTotal += 0
            } else {
              target.feeDataTotal += +item.feeAmount || 0
            }
          })
        }
        // target.feeDataTotal = this.formatPrice(this.feeData.reduce((t, c) => { return (+t + +c.feeAmount) || 0 }, 0))
        target.pageTotal = target.tableTotal + target.feeDataTotal
        target.totalCostOfWarehousing = this.formatPrice(
          (target.invoiceBusinessType == 0 &&
            (target.invoiceType == 2 || target.invoiceType == 3)
            ? +target.priceExcludingTax
            : target.rowTotal) +
          target.feeDataTotal *
          ((target.invoiceBusinessType == 0 &&
            (target.invoiceType == 2 || target.invoiceType == 3)
            ? +target.priceExcludingTax
            : target.rowTotal) /
            target.tableTotal)
        )
        target.otherFeeAmount = this.formatPrice(
          (target.feeDataTotal *
            (target.invoiceBusinessType == 0 &&
              (target.invoiceType == 2 || target.invoiceType == 3)
              ? +target.priceExcludingTax
              : target.rowTotal)) /
          target.tableTotal
        )
        target.costAllocationUnitPrice = this.formatPrice(
          target.totalCostOfWarehousing / target.deliveryQty
        )
        // if (endItem) {
        //   target.totalCostOfWarehousing =
        //     target.pageTotal -
        //     this.tableDetail.reduce(
        //       (t, c, j) =>
        //         this.formatPrice(
        //           t + (j == tableLength ? 0 : +c.totalCostOfWarehousing || 0)
        //         ),
        //       0
        //     );
        //   target.totalCostOfWarehousing = this.formatPrice(
        //     target.totalCostOfWarehousing
        //   );
        // }
        this.tableDetail = newData
      }
    },
    forEachCaculate(flag) {
      let exchangeRate =
        this.basicInfo.exchangeRate === undefined &&
          this.basicInfo.exchangeRate === ''
          ? 1
          : +this.basicInfo.exchangeRate
      let ids = []
      let tableLength = this.tableDetail.length - 1
      this.tableDetail.forEach(item => ids.push(item.id))
      this.tableDetail.forEach((item, i) => {
        item.puTotalAmount =
          flag == 'no'
            ? +item.puTotalAmount
            : this.formatPrice((+item.puPrice || 0) * (+item.deliveryQty || 0))
        item.packingCost = this.formatPrice(
          item.pkgDetails?.reduce((t, c) => {
            return +t + +c.packQty * +c.packUnitPrice || 0
          }, 0)
        )
        item.rowTotal =
          this.poType == 2
            ? (+item.itemPrice || 0) * exchangeRate + (+item.packingCost || 0)
            : (+item.itemPrice || 0) + (+item.packingCost || 0)
        item.priceExcludingTax =
          item.invoiceType == 1 || item.invoiceType == 2
            ? +item.rowTotal -
            (item.rowTotal * (+item.inputTaxRate / 100)) /
            (1 + +item.inputTaxRate / 100)
            : item.invoiceType == 3
              ? +item.rowTotal - item.rowTotal * (+item.inputTaxRate / 100)
              : item.priceExcludingTax || 0
        item.priceExcludingTax = +item.priceExcludingTax.toFixed(2)
        item.tableTotal = this.formatPrice(
          this.tableDetail.reduce((t, c) => {
            return (
              +t +
              +(c.invoiceBusinessType == 1 && c.invoiceType == 2
                ? +c.priceExcludingTax
                : c.rowTotal) || 0
            )
          }, 0)
        )
        item.feeDataTotal = 0
        if (this.feeData && this.feeData.length > 0) {
          this.feeData.forEach(o => {
            if (o.invoiceBusinessType == 0 && o.invoiceType == 2) {
              item.feeDataTotal += +o.priceExcludingTax || 0
            } else if (o.invoiceType == 4) {
              // 进口增值税的成本计价为0
              item.feeDataTotal += 0
            } else {
              item.feeDataTotal += +o.feeAmount || 0
            }
          })
        }
        // item.feeDataTotal = this.formatPrice(this.feeData.reduce((t, c) => { return (+t + +c.feeAmount) || 0 }, 0))
        item.pageTotal = item.tableTotal + item.feeDataTotal
        item.totalCostOfWarehousing = this.formatPrice(
          (item.invoiceBusinessType == 0 &&
            (item.invoiceType == 2 || item.invoiceType == 3)
            ? +item.priceExcludingTax
            : item.rowTotal) +
          item.feeDataTotal *
          ((item.invoiceBusinessType == 0 &&
            (item.invoiceType == 2 || item.invoiceType == 3)
            ? +item.priceExcludingTax
            : item.rowTotal) /
            item.tableTotal)
        )
        item.costAllocationUnitPrice = this.formatPrice(
          item.totalCostOfWarehousing / item.deliveryQty
        )
        if (i > 0 && i == tableLength) {
          item.totalCostOfWarehousing =
            item.pageTotal -
            this.tableDetail.reduce(
              (t, c, j) =>
                this.formatPrice(
                  t + (j == tableLength ? 0 : +c.totalCostOfWarehousing || 0)
                ),
              0
            )
          item.totalCostOfWarehousing = this.formatPrice(
            item.totalCostOfWarehousing
          )
        }
      })
      ids.forEach((id, k) =>
        this.caculateTableValue(
          undefined,
          undefined,
          undefined,
          id,
          flag,
          ids.length == k + 1
        )
      )
    },
    noPayAmountChange() {
      this.RMBchange(1)
      this.RMBchange(2)
      //! this.RMBchange(3);
      this.weikuan()
      this.rateChange()
    },
    RMBchange(val) {
      switch (val) {
        case 1:
          this.costInfo.payAmountExchangeRate =
            this.costInfo.payAmount && this.costInfo.payAmountRMB
              ? this.formatPrice(
                this.costInfo.payAmountRMB / this.costInfo.payAmount
              )
              : ''
          break
        case 2:
          this.costInfo.deductionsExchangeRate =
            this.costInfo.deductions && this.costInfo.deductionsRMB
              ? this.formatPrice(
                this.costInfo.deductionsRMB / this.costInfo.deductions
              )
              : ''
          break
        case 3:
          this.costInfo.noPayAmountExchangeRate =
            this.costInfo.noPayAmount && this.costInfo.noPayAmountRMB
              ? this.formatPrice(
                this.costInfo.noPayAmountRMB / this.costInfo.noPayAmount
              )
              : ''
          break

        default:
          break
      }

      this.$forceUpdate()
    },
    rateChange() {
      this.costInfo.noPayAmountRMB =
        this.costInfo.noPayAmount && this.costInfo.noPayAmountExchangeRate
          ? this.formatPrice(
            this.costInfo.noPayAmount * this.costInfo.noPayAmountExchangeRate
          )
          : ''
      this.costInfo.deductionsRMB =
        this.costInfo.deductions && this.costInfo.deductionsExchangeRate
          ? this.formatPrice(
            this.costInfo.deductions * this.costInfo.deductionsExchangeRate
          )
          : ''
      this.costInfo.payAmountRMB =
        this.costInfo.payAmount && this.costInfo.payAmountExchangeRate
          ? this.formatPrice(
            this.costInfo.payAmount * this.costInfo.payAmountExchangeRate
          )
          : ''
    },
    payAmountChange() {
      this.costInfo.noPayAmount = this.formatPrice(
        this.puTotalAmountT -
        // add(this.poTotalAmountTo, supplierFee || 0) -
        Number(this.costInfo.payAmount) -
        Number(this.costInfo.deductions)
      )
      this.costInfo.noPayAmountRMB =
        this.costInfo.noPayAmount && this.costInfo.noPayAmountExchangeRate
          ? this.formatPrice(
            this.costInfo.noPayAmount * this.costInfo.noPayAmountExchangeRate
          )
          : ''
      this.costInfo.deductionsRMB =
        this.costInfo.deductions && this.costInfo.deductionsExchangeRate
          ? this.formatPrice(
            this.costInfo.deductions * this.costInfo.deductionsExchangeRate
          )
          : ''
      this.costInfo.payAmountRMB =
        this.costInfo.payAmount && this.costInfo.payAmountExchangeRate
          ? this.formatPrice(
            this.costInfo.payAmount * this.costInfo.payAmountExchangeRate
          )
          : ''
      this.RMBchange(1)
      this.RMBchange(2)
      this.RMBchange(3)
      this.rateChange()
    },
    deleteUploads(item, index) {
      if (item.id) {
        let params = new FormData()
        params.append('id', item.id)
        delUploadFiles(params).then(res => {
          if (res.data.code == 200) {
            this.$message.success('删除单据文件成功')
            this.uploadUrls.splice(index, 1)
          } else {
            this.$message.error(res.data.message)
          }
        })
      } else {
        this.uploadUrls.splice(index, 1)
      }
    },
    downloadFile(url) {
      let labelA = document.createElement('a')
      labelA.href = url
      labelA.click()
    },
    preView(url) {
      this.previewImageList = []
      this.previewImage = url
      if (this.uploadUrls.length > 0) {
        this.uploadUrls.forEach(item => {
          this.previewImageList.push(item.url)
        })
      } else {
        this.previewImageList.push(url)
      }
      this.previewVisible = true
    },
    handleCancelPreviewImage() {
      this.previewImage = undefined
      this.previewImageList = []
      this.previewVisible = false
    },
    beforeUpload(file) {
      let params = new FormData()
      params.append('file', file)
      params.append('mode', 'batch')
      params.append('type', 'item')
      params.append('tableName', 'pickUpOrder')
      uploadFiles(params).then(res => {
        if (res.data.code === '200') {
          let uploadFiles = {
            type: res.data.data[0].fileType,
            name: res.data.data[0].fileName,
            url: res.data.data[0].filePath,
            state: res.data.data[0].fileState
          }
          addImg({
            fileUrlList: uploadFiles,
            tableId: this.poId,
            tableName: 'pickUpOrder'
          }).then(imgres => {
            if (imgres.data.code == 200) {
              this.$message.success('上传单据文件成功')
              this.uploadUrls.push(uploadFiles)
            } else {
              this.$message.error(imgres.data.message)
            }
          })
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    deductionsChange() {
      this.costInfo.noPayAmount = this.formatPrice(
        this.puTotalAmountT -
        Number(this.costInfo.payAmount) -
        Number(this.costInfo.deductions)
      )
      this.costInfo.noPayAmountRMB =
        this.costInfo.noPayAmount && this.costInfo.noPayAmountExchangeRate
          ? this.formatPrice(
            this.costInfo.noPayAmount * this.costInfo.noPayAmountExchangeRate
          )
          : ''
      this.costInfo.deductionsRMB =
        this.costInfo.deductions && this.costInfo.deductionsExchangeRate
          ? this.formatPrice(
            this.costInfo.deductions * this.costInfo.deductionsExchangeRate
          )
          : ''
      this.costInfo.payAmountRMB =
        this.costInfo.payAmount && this.costInfo.payAmountExchangeRate
          ? this.formatPrice(
            this.costInfo.payAmount * this.costInfo.payAmountExchangeRate
          )
          : ''
      this.RMBchange(1)
      this.RMBchange(2)
      this.RMBchange(3)
      this.rateChange()
    },
    currencyChange(text) {
      switch (text) {
        case 1:
          this.costInfo.payAmountExchangeRate =
            this.costInfo.payAmountCurrency == '人民币' ? 1 : ''
          break
        case 2:
          this.costInfo.deductionsExchangeRate =
            this.costInfo.deductionsCurrency == '人民币' ? 1 : ''
          break
        case 3:
          this.costInfo.noPayAmountExchangeRate =
            this.costInfo.noPayAmountCurrency == '人民币' ? 1 : ''
          break

        default:
          break
      }
      this.$forceUpdate()
    },
    //币种
    getCurrency() {
      GetCurrencyList({ type: 14 }).then(res => {
        if (res.data.code == 200) {
          this.currencyList = res.data.data
        } else {
          this.$message.error(
            res.data.message ? res.data.message : '获取币种数据出错'
          )
        }
      })
    },
    //仓库
    async getWarehouse(state) {
      await GetWarehouseData().then(res => {
        if (res.data.code == 200) {
          const data = res.data.data
          data.find(x => {
            x.baseId = +x.baseId
            return !1
          })
          this.warehouseList = data
          if (state === 'none') {
            this.basicInfo.whId =
              this.warehouseList.length > 0 ? this.warehouseList[0].id : ''
          }
          if (
            !this.warehouseList.some(x => x.baseId == this.record.whId) &&
            this.typeis(this.record.whId) != 'undefined'
          ) {
            this.warehouseList.unshift({
              baseId: this.record.whId,
              name: this.record.whName,
              code: this.record.whCode
            })
          }
        } else {
          this.$message.error(
            res.data.message ? res.data.message : '获取仓库数据失败'
          )
        }
      })
    },
    supplierIdChange() {
      let feeTotal = 0
      this.feeData.forEach(item => {
        let rowRecordFee = 0
        // 进口增值税可退税，成本项统计为0
        if (item.feeName !== '进口增值税') {
          rowRecordFee = Number(item.feeAmount) || 0
        }
        feeTotal += rowRecordFee
      })
      this.totalOtherPay = feeTotal
      this.poTotalAmountTo = 0
      this.itemPriceTo = 0
      this.totalCostOfWarehousingSum = 0
      this.tableDetail.forEach(item => {
        this.poTotalAmountTo += Number(item.puTotalAmount)
        this.itemPriceTo += Number(item.itemPrice)
      })
      this.tableDetail.forEach(item => {
        item.totalCostOfWarehousing = this.formatPrice(
          (this.poTotalAmountTo + this.totalOtherPay) *
          (Number(item.puTotalAmount) / this.poTotalAmountTo)
        )
        item.costAllocationUnitPrice = this.formatPrice(
          item.totalCostOfWarehousing / item.poQty
        )
        this.totalCostOfWarehousingSum = this.formatPrice(
          Number(this.totalCostOfWarehousingSum) +
          Number(item.totalCostOfWarehousing)
        )
      })
      this.costInfo.noPayAmount = this.formatPrice(
        this.puTotalAmountT -
        Number(this.costInfo.payAmount) -
        Number(this.costInfo.deductions)
      )
      this.forEachCaculate('no')
    },
    singleFeeChange() {
      let feeTotal = 0
      this.feeData.forEach(item => {
        let rowRecordFee = 0
        // 进口增值税可退税，成本项统计为0
        if (item.feeName !== '进口增值税') {
          rowRecordFee = Number(item.feeAmount) || 0
        }
        feeTotal += rowRecordFee
      })
      this.totalOtherPay = feeTotal
      this.poTotalAmountTo = 0
      this.itemPriceTo = 0
      this.totalCostOfWarehousingSum = 0
      this.tableDetail.forEach(item => {
        this.poTotalAmountTo += Number(item.puTotalAmount)
        this.itemPriceTo += Number(item.itemPrice)
      })
      this.tableDetail.forEach(item => {
        item.totalCostOfWarehousing = this.formatPrice(
          (this.poTotalAmountTo + this.totalOtherPay) *
          (Number(item.puTotalAmount) / this.poTotalAmountTo)
        )
        item.costAllocationUnitPrice = this.formatPrice(
          item.totalCostOfWarehousing / item.poQty
        )
        this.totalCostOfWarehousingSum = this.formatPrice(
          Number(this.totalCostOfWarehousingSum) +
          Number(item.totalCostOfWarehousing)
        )
      })
      this.costInfo.noPayAmount = this.formatPrice(
        this.puTotalAmountT -
        Number(this.costInfo.payAmount) -
        Number(this.costInfo.deductions)
      )
      this.forEachCaculate('no')
    },
    removeImg(file) {
      if (typeof file.uid == 'number') {
        axios({
          method: 'post',
          url: '/uploadFile/doDeleteFile.action',
          data: { id: file.uid },
          transformRequest: [
            function (data) {
              let ret = ''
              for (let it in data) {
                ret +=
                  encodeURIComponent(it) +
                  '=' +
                  encodeURIComponent(data[it]) +
                  '&'
              }
              ret = ret.substring(0, ret.lastIndexOf('&'))
              return ret
            }
          ],
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
      }
    },
    feeType3change(value) {
      this.partnerList.forEach(item => {
        if (item.id == value.receivingSubjectId) {
          value.receivingSubjectName = item.partnerName
          value.receivingSubjectCode = item.partnerCode
        }
      })
    },
    async getDetails(id) {
      this.tableLoading = true
      await getOrderDetail({ id }).then(res => {
        this.tableLoading = false
        if (res.data.code == 200) {
          let item = res.data.data
          this.purchaseGlobalOrderDetail = item.purchaseGlobalOrderDetail
          item?.purchaseGlobalOrderDetail?.fee?.forEach(
            (fakeId, f) => (fakeId.fakeId = ++f)
          )
          this.feeData =
            JSON.parse(JSON.stringify(item.purchaseGlobalOrderDetail.fee)) || []
          this.feeData.forEach(item => {
            item.dutyFreeState = item.dutyFreeState ? item.dutyFreeState : 1
          })
            ; (this.enterDetailType = item.enterDetailType || 1),
              (this.basicInfo = {
                buyerName: item.buyerName || '',
                buyerId: item.buyerId || '',
                poTotalAmount: item.poTotalAmount || '',
                id: item.id || '',
                marketId: item.marketId || '',
                deliveryWeight: item.deliveryWeight || '',
                purchaseWeight: item.purchaseWeight || '',
                purchaseQty: item.purchaseQty || '',
                supplierId: item.supplierId || '',
                supplierCode: item.supplierCode || '',
                ids: item.ids || [],
                roIds: item.roIds || [],
                roId: item.roId || '',
                whAdress: item.whAdress || '',
                whId: item.whId || '',
                whCode: item.whCode || '',
                whName: item.whName || '',
                poState: item.poState || '',
                reconciliaState: item.reconciliaState || '',
                settleState: item.settleState || '',
                opId: item.opId || '',
                opCode: item.opCode || '',
                opName: item.opName || '',
                orgId: item.orgId || '',
                poCode: item.poCode || '',
                roCode: item.roCode || '',
                soCode: item.soCode || '',
                supplierName: item.supplierName || '',
                supplierPhone: item.supplierPhone || '',
                poSubtime: item.poSubtime || '',
                supplierAddress: item.supplierAddress || '',
                agencyId: item.purchaseGlobalOrderDetail.agencyId || '',
                agencyName: item.purchaseGlobalOrderDetail.agencyName || '',
                buyer: item.purchaseGlobalOrderDetail.buyer || '',
                businessType: item.purchaseGlobalOrderDetail.businessType || '',
                flowDirection: item.purchaseGlobalOrderDetail.flowDirection || '',
                orderCode: item.purchaseGlobalOrderDetail.orderCode || '',
                orderDate: item.purchaseGlobalOrderDetail.orderDate || '',
                pickCode: item.purchaseGlobalOrderDetail.pickCode || '',
                purposeHarbor: item.purchaseGlobalOrderDetail.purposeHarbor || '',
                shipName: item.purchaseGlobalOrderDetail.shipName || '',
                sailDate: item.purchaseGlobalOrderDetail.sailDate || '',
                expectArrivalDate:
                  item.purchaseGlobalOrderDetail.expectArrivalDate || '',
                transactionType:
                  item.purchaseGlobalOrderDetail.transactionType || '',
                containerCode: item.purchaseGlobalOrderDetail.containerCode || '',
                currency: item.purchaseGlobalOrderDetail.currency || '',
                exchangeRate: item.purchaseGlobalOrderDetail.exchangeRate || '',
                shipmentPort: item.purchaseGlobalOrderDetail.shipmentPort || '',
                terms: item.purchaseGlobalOrderDetail.terms || '',
                pricingState: item.purchaseGlobalOrderDetail.pricingState || '',
                contractId: item.contractId,
                contractTitle: item.contractTitle
              })
          this.receivingInfo.deliveryTime = item.deliveryTime
          //币种
          this.exchangeRate = item.purchaseGlobalOrderDetail.exchangeRate || 1
          this.costInfo.deductions = item.deductions || ''
          this.costInfo.deductionsExchangeRate =
            item.deductionsExchangeRate ||
            item.purchaseGlobalOrderDetail.exchangeRate ||
            ''
          this.costInfo.deductionsCurrency =
            item.purchaseGlobalOrderDetail.currency || '美元'
          this.costInfo.payAmountCurrency =
            item.purchaseGlobalOrderDetail.currency || '美元'
          this.costInfo.noPayAmountCurrency =
            item.purchaseGlobalOrderDetail.currency || '美元'
          this.costInfo.payAmountExchangeRate =
            item.payAmountExchangeRate ||
            item.purchaseGlobalOrderDetail.exchangeRate ||
            ''
          this.costInfo.noPayAmountExchangeRate =
            item.noPayAmountExchangeRate ||
            item.purchaseGlobalOrderDetail.exchangeRate ||
            ''
          this.costInfo.payAmount = item.payAmount || ''
          this.costInfo.advanceTime = item.advanceTime || ''
          this.costInfo.payAmountRatio = item.payAmountRatio || ''
          this.costInfo.payReconciliaState= item.payReconciliaState
          this.costInfo.payAmountRatioTerm = item.payAmountRatioTerm || ''
          this.costInfo.noPayDate = item.noPayDate || ''
          this.costInfo.receivingSubjectId =
            item.receivingSubjectId || item.supplierId
          this.tableDetail = item.details
          this.poTotalAmountTo = 0
          this.itemPriceTo = 0
          this.totalCostOfWarehousingSum = 0
          this.mustCheckValue(this.basicInfo.orgId)
          this.contract(undefined, item.contractId, {
            id: item.contractId,
            contractTitle: item.contractTitle
          })
          this.tableDetail.forEach(item => {
            item.puPrice = item.puPrice || item.poPrice
            item.poNetweight = item.poNetweight / 1000 || ''
            item.deliveryNetweight =
              item.poNetweight == 0 ? '' : item.poNetweight
            item.packingCost = item.packingCost || ''
            if (this.receivedFlag == 'receivedList') {
              item.itemPrice = item.puTotalAmount || item.poTotalAmount || ''
            } else {
              item.itemPrice = item.poTotalAmount || ''
            }
            if (item.itemPrice || item.packingCost) {
              item.puTotalAmount =
                (+item.packingCost || 0) + (+item.itemPrice || 0)
              item.puTotalAmount =
                item.puTotalAmount == 0 ? '' : item.puTotalAmount
            } else {
              item.puTotalAmount = ''
            }
            if (this.receivedFlag == 'receivedList') {
              item.deliveryQty = item.deliveryQty || item.poQty
            } else {
              item.deliveryQty = item.poQty
            }
            this.poWeightTo = this.poWeightTo + item.poNetweight
            this.poQtyTo = this.poQtyTo + item.poQty
            this.poTotalAmountTo =
              (+item.puTotalAmount || 0) + (+this.poTotalAmountTo || 0)
            this.itemPriceTo += +item.itemPrice
          })
          this.tableDetail.forEach(item => {
            item.totalCostOfWarehousing =
              item.totalCostOfWarehousing ||
              (item.puPrice == ''
                ? (item.totalCostOfWarehousing = '')
                : this.formatPrice(
                  (this.poTotalAmountTo + this.totalOtherPay) *
                  ((+item.puTotalAmount || 0) / this.poTotalAmountTo)
                ))
            item.costAllocationUnitPrice =
              item.costAllocationUnitPrice ||
              (item.puPrice == ''
                ? (item.costAllocationUnitPrice = '')
                : this.formatPrice(item.totalCostOfWarehousing / item.poQty))
            this.totalCostOfWarehousingSum = this.formatPrice(
              (+this.totalCostOfWarehousingSum || 0) +
              (+item.totalCostOfWarehousing || 0)
            )
          })
          this.costInfo.noPayAmount =
            item.noPayAmount ||
            this.formatPrice(
              this.puTotalAmountT -
              this.costInfo.payAmount -
              (+this.costInfo.deductions || 0)
            )

          //人民币金额
          this.costInfo.noPayAmountRMB = item.noPayAmountRMB
            ? item.noPayAmountRMB
            : this.costInfo.noPayAmount && this.costInfo.noPayAmountExchangeRate
              ? this.formatPrice(
                this.costInfo.noPayAmount *
                this.costInfo.noPayAmountExchangeRate
              )
              : ''
          this.costInfo.deductionsRMB = item.deductionsRMB
            ? item.deductionsRMB
            : this.costInfo.deductions && this.costInfo.deductionsExchangeRate
              ? this.formatPrice(
                this.costInfo.deductions * this.costInfo.deductionsExchangeRate
              )
              : ''
          this.costInfo.payAmountRMB = item.payAmountRMB
            ? item.payAmountRMB
            : this.costInfo.payAmount && this.costInfo.payAmountExchangeRate
              ? this.formatPrice(
                this.costInfo.payAmount * this.costInfo.payAmountExchangeRate
              )
              : ''
          this.costInfo.noPayAmountExchangeRate =
            item.noPayAmountExchangeRate ||
            (item.purchaseGlobalOrderDetail.exchangeRate
              ? item.purchaseGlobalOrderDetail.exchangeRate
              : this.costInfo.noPayAmount && this.costInfo.noPayAmountRMB
                ? this.formatPrice(
                  this.costInfo.noPayAmountRMB / this.costInfo.noPayAmount
                )
                : '')
          this.costInfo.deductionsExchangeRate =
            item.deductionsExchangeRate ||
            (item.purchaseGlobalOrderDetail.exchangeRate
              ? item.purchaseGlobalOrderDetail.exchangeRate
              : this.costInfo.deductions && this.costInfo.deductionsRMB
                ? this.formatPrice(
                  this.costInfo.deductionsRMB / this.costInfo.deductions
                )
                : '')
          this.costInfo.payAmountExchangeRate =
            item.payAmountExchangeRate ||
            (item.purchaseGlobalOrderDetail.exchangeRate
              ? item.purchaseGlobalOrderDetail.exchangeRate
              : this.costInfo.payAmount && this.costInfo.payAmountRMB
                ? this.formatPrice(
                  this.costInfo.payAmountRMB / this.costInfo.payAmount
                )
                : '')
          if (!this.basicInfo.whId) {
            this.getWarehouse('none')
          }
          this.forEachCaculate('no')
          this.$forceUpdate()
        }
      })
    },
    async getNormalDetails(id) {
      this.tableLoading = true
      await getOrderDetailNormal({ id: id }).then(res => {
        this.tableLoading = false
        if (res.data.code == 200) {
          let item = res.data.data
          item?.purchaseFeeList?.forEach((fakeId, f) => (fakeId.fakeId = ++f))
          this.feeData = item.purchaseFeeList || []
          this.feeData.forEach(item => {
            item.dutyFreeState = item.dutyFreeState ? item.dutyFreeState : 1
          })
            ; (this.enterDetailType = item.enterDetailType || 1),
              (this.basicInfo = {
                buyerName: item.buyerName || '',
                buyerId: item.buyerId || '',
                poTotalAmount: item.poTotalAmount || '',
                id: item.id || '',
                marketId: item.marketId || '',
                deliveryWeight: item.deliveryWeight || '',
                purchaseWeight: item.purchaseWeight || '',
                purchaseQty: item.purchaseQty || '',
                supplierId: item.supplierId || '',
                supplierCode: item.supplierCode || '',
                ids: item.ids || [],
                roIds: item.roIds || [],
                roId: item.roId || '',
                whAdress: item.whAdress || '',
                whId: item.whId || '',
                whCode: item.whCode || '',
                whName: item.whName || '',
                poState: item.poState || '',
                reconciliaState: item.reconciliaState || '',
                settleState: item.settleState || '',
                opId: item.opId || '',
                opCode: item.opCode || '',
                opName: item.opName || '',
                orgId: item.orgId || '',
                poCode: item.poCode || '',
                roCode: item.roCode || '',
                soCode: item.soCode || '',
                supplierName: item.supplierName || '',
                supplierPhone: item.supplierPhone || '',
                poSubtime: item.poSubtime || '',
                supplierAddress: item.supplierAddress || '',
                poSubuserName: item.poSubuserName || '',
                planDeliveryTime: item.planDeliveryTime || '',
                contractId: item.contractId,
                contractTitle: item.contractTitle
              })
          this.receivingInfo.deliveryTime = item.deliveryTime
          //币种
          this.costInfo.deductions = item.deductions || ''
          this.costInfo.payAmount = item.payAmount || ''
          this.costInfo.payReconciliaState = item.payReconciliaState
          this.costInfo.payAmountRatio = item.payAmountRatio || ''
          this.costInfo.advanceTime = item.advanceTime || ''
          this.costInfo.noPayDate = item.noPayDate || ''
          this.costInfo.receivingSubjectId =
            item.receivingSubjectId || item.supplierId
          this.tableDetail = item.details
          this.poTotalAmountTo = 0
          this.itemPriceTo = 0
          this.totalCostOfWarehousingSum = 0
          this.contract(undefined, item.contractId, {
            id: item.contractId,
            contractTitle: item.contractTitle
          })
          this.mustCheckValue(this.basicInfo.orgId)
          this.tableDetail.forEach(item => {
            item.puPrice = item.puPrice || item.poPrice
            item.poNetweight = item.poNetweight / 1000 || ''
            item.deliveryNetweight =
              item.poNetweight == 0 ? '' : item.poNetweight
            item.packingCost = item.packingCost || ''
            if (this.receivedFlag == 'receivedList') {
              item.itemPrice = item.puTotalAmount || item.poTotalAmount || ''
            } else {
              item.itemPrice = item.poTotalAmount || ''
            }
            if (item.itemPrice || item.packingCost) {
              item.puTotalAmount =
                Number(item.packingCost) + Number(item.itemPrice)
              item.puTotalAmount =
                item.puTotalAmount == 0 ? '' : item.puTotalAmount
            } else {
              item.puTotalAmount = ''
            }
            this.poTotalAmountTo =
              Number(item.puTotalAmount) + Number(this.poTotalAmountTo)
            this.itemPriceTo += Number(item.itemPrice)

            if (this.receivedFlag == 'receivedList') {
              item.deliveryQty = item.poQty
            } else {
              item.deliveryQty = item.deliveryQty || item.poQty
            }
          })
          this.tableDetail.forEach(item => {
            item.totalCostOfWarehousing =
              item.puPrice == ''
                ? (item.totalCostOfWarehousing = '')
                : this.formatPrice(
                  (this.poTotalAmountTo + this.totalOtherPay) *
                  (Number(item.puTotalAmount) / this.poTotalAmountTo)
                )
            item.costAllocationUnitPrice =
              item.puPrice == ''
                ? (item.costAllocationUnitPrice = '')
                : this.formatPrice(item.totalCostOfWarehousing / item.poQty)
            this.totalCostOfWarehousingSum = this.formatPrice(
              Number(this.totalCostOfWarehousingSum) +
              Number(item.totalCostOfWarehousing)
            )
          })
          this.costInfo.noPayAmount =
            item.noPayAmount ||
            this.formatPrice(
              this.puTotalAmountT -
              this.costInfo.payAmount -
              Number(this.costInfo.deductions)
            )
          if (!this.basicInfo.whId) {
            this.getWarehouse('none')
          }
          this.$forceUpdate()
        }
        this.forEachCaculate('no')
      })
    },
    //费用选择
    //费用列表弹框
    feeModal() {
      if (this.showModalState == 0) {
        return
      }
      this.getFeeList()
      this.feeVisible = true
    },

    //费用删除行
    delFeeOne(row, index) {
      this.feeData.splice(index, 1)
      this.forEachCaculate('no')
    },
    addFee() {
      if (!this.feeCateValueData.length) {
        this.$message.error(`请选择一条数据进行添加！`)
        return
      }
      this.feeData = this.feeData.concat(this.feeCateValueData)
      this.feeData.forEach((fakeId, f) => {
        fakeId.fakeId = ++f
      })
      this.feeData.forEach(item => {
        item.dutyFreeState = item.dutyFreeState ? item.dutyFreeState : 1
      })
      this.feeCateValueData = []
      this.valueSelectFee = []
      this.$refs.addFeeSelect.blur()
    },
    //费用规格选择
    chooseSelectFee() {
      let feeCateValueDataArr = []
      this.feeCateData.forEach(item => {
        if (this.valueSelectFee.indexOf(item.id) > -1) {
          feeCateValueDataArr.push(item)
        }
      })
      feeCateValueDataArr.forEach(v => {
        v.feeType = v.type
        v.feeName = v.name
        v.receivingSubjectId = this.costInfo.receivingSubjectId || ''
      })
      this.feeCateValueData = JSON.parse(JSON.stringify(feeCateValueDataArr))
      this.feeCateValueData.forEach(item => {
        item.id = ''
      })
    },
    handleCancelFee() {
      this.feeVisible = false
    },
    handleSubmitFee() {
      let feePrice = 0
      let feeDataArr = JSON.parse(JSON.stringify(this.feeData))
      feeDataArr.forEach(item => {
        let rowRecordFee = 0
        // 进口增值税可退税，成本项统计为0
        if (item.feeName !== '进口增值税') {
          rowRecordFee = Number(item.feeAmount) || 0
        }
        feePrice += rowRecordFee
      })
      this.totalOtherPay = feePrice
      feeDataArr.forEach(val => {
        if (!val.feeAmount || !val.receivingSubjectId || !val.rate) {
          this.$message.error('请核对必填项')
          return
        }
      })
      this.feeVisible = false
    },
    //费用的分类数据
    getFeeList(orderType) {
      // orderType: 1-销售单,3-国际采购单
      getFeeList({ orderType: orderType === 1 ? 1 : 3 }).then(res => {
        if (res.data.code == 200) {
          this.feeCateData = res.data.data
        }
      })
    },

    //获取供应商/代理公司列表，收款主体
    async getSuppliers() {
      await partnerType({ partnerTypes: [30, 40], isEnable: 1 }).then(res => {
        if (res.data.code == 200) {
          this.partnerList = res.data.data
          if (
            !this.partnerList.some(x => x.id == this.record.supplierId) &&
            this.typeis(this.record.supplierId) != 'undefined'
          ) {
            this.partnerList.unshift({
              id: this.record.supplierId,
              partnerName: this.record.supplierName
            })
          }
        }
      })
    },
    // 商品金额变动
    totalSumItem(record, index) {
      this.itemPriceTo = 0
      this.poTotalAmountTo = 0
      this.totalCostOfWarehousingSum = 0
      if (record.itemPrice) {
        this.tableDetail[index].puPrice = this.formatPrice(
          Number(record.itemPrice) / record.poQty
        )
        this.tableDetail[index].puTotalAmount =
          Number(record.itemPrice) + Number(record.packingCost)
      } else {
        this.tableDetail[index].puPrice = this.formatPrice(0 / record.poQty)
        this.tableDetail[index].puTotalAmount = 0 + Number(record.packingCost)
      }
      this.tableDetail.forEach(item => {
        this.itemPriceTo += Number(item.itemPrice)
        this.poTotalAmountTo += Number(item.puTotalAmount)
      })
      this.tableDetail.forEach(item => {
        record.totalCostOfWarehousing = this.formatPrice(
          (this.poTotalAmountTo + this.totalOtherPay) *
          (Number(record.puTotalAmount) / this.poTotalAmountTo)
        )
        record.costAllocationUnitPrice = this.formatPrice(
          record.totalCostOfWarehousing / record.deliveryQty
        )
        this.totalCostOfWarehousingSum = this.formatPrice(
          Number(this.totalCostOfWarehousingSum) +
          Number(item.totalCostOfWarehousing)
        )
      })
      this.costInfo.noPayAmount = this.formatPrice(
        this.puTotalAmountT -
        Number(this.costInfo.payAmount) -
        Number(this.costInfo.deductions)
      )
      this.forEachCaculate('no')
      this.$forceUpdate()
      this.tableDetail = [...this.tableDetail]
    },
    totalSum(record, index) {
      this.poTotalAmountTo = 0
      record.puTotalAmount
        ? (this.tableDetail[index].puTotalAmount = record.puTotalAmount)
        : 0
      this.tableDetail.forEach(item => {
        this.poTotalAmountTo += Number(item.puTotalAmount)
      })
    },

    //收货重量改变
    deliveryQtyChange(record, index) {
      this.itemPriceTo = 0
      this.poTotalAmountTo = 0
      this.totalCostOfWarehousingSum = 0
      if (record.deliveryQty || record.puPrice) {
        this.tableDetail[index].itemPrice = this.formatPrice(
          Number(record.deliveryQty) * Number(record.puPrice)
        )
        this.tableDetail[index].puTotalAmount =
          Number(this.tableDetail[index].itemPrice) +
          Number(record.packingCost ? record.packingCost : '')
      } else {
        this.tableDetail[index].itemPrice = this.formatPrice(
          Number(record.poQty) * Number(record.puPrice)
        )
        this.tableDetail[index].puTotalAmount =
          Number(this.tableDetail[index].itemPrice) +
          Number(record.packingCost ? record.packingCost : '')
      }
      this.tableDetail.forEach(item => {
        this.itemPriceTo += Number(item.itemPrice)
        this.poTotalAmountTo += Number(item.puTotalAmount)
      })
      this.tableDetail.forEach(item => {
        record.totalCostOfWarehousing = this.formatPrice(
          (this.poTotalAmountTo + this.totalOtherPay) *
          (Number(record.puTotalAmount) / this.poTotalAmountTo)
        )
        record.costAllocationUnitPrice = this.formatPrice(
          record.totalCostOfWarehousing / record.deliveryQty
        )
        this.totalCostOfWarehousingSum = this.formatPrice(
          Number(this.totalCostOfWarehousingSum) +
          Number(item.totalCostOfWarehousing)
        )
      })
      this.costInfo.noPayAmount = this.formatPrice(
        this.puTotalAmountT -
        Number(this.costInfo.payAmount) -
        Number(this.costInfo.deductions)
      )
      this.forEachCaculate()
      this.$forceUpdate()
    },
    cancel() {
      this.$message.error('取消')
    },
    //包装选择
    openPackage(row) {
      this.getPackageList()
      this.ItemsObj = row
      this.packageData = JSON.parse(JSON.stringify(row.pkgDetails))
      this.packageVisible = true
    },
    //包装删除行
    delPackageOne(row, index) {
      this.packageData.splice(index, 1)
    },
    addPackage() {
      if (this.packageListValueData.length === 0) {
        this.$message.error(`请选择一条数据进行添加！`)
        return
      }
      let quniPackages = []
      this.packageData.forEach(item => {
        this.packageListValueData.forEach(val => {
          if (item.id === val.id) {
            quniPackages.push(item.packName)
          }
        })
      })
      if (quniPackages.length > 0) {
        let itemsStr = quniPackages.join(',')
        this.$message.error(`包装${itemsStr}已经存在！`)
        return
      }
      this.packageData = this.packageData.concat(this.packageListValueData)
      this.packageListValueData = []
      this.valueSelectPackage = []
      this.$refs.addPackageSelect.blur()
    },
    //包装规格选择
    chooseSelectPackage() {
      let packageListValueDataArr = []
      this.packageListData.forEach(item => {
        if (this.valueSelectPackage.indexOf(item.id) > -1) {
          packageListValueDataArr.push(item)
        }
      })
      this.packageListValueData = JSON.parse(
        JSON.stringify(packageListValueDataArr)
      )
    },
    handleCancelPackage() {
      this.packageVisible = false
    },
    handleSubmitPackage() {
      let packagePrice = 0
      let packageDataArr = JSON.parse(JSON.stringify(this.packageData))
      packageDataArr.forEach(item => {
        let uPrice = item.packQty * item.packUnitPrice
        packagePrice = packagePrice + uPrice
      })
      let uniqArr = []

      for (let i = 0; i < this.tableDetail.length; i++) {
        let item = this.tableDetail[i]
        if (item.id === this.ItemsObj.id) {
          packageDataArr.forEach(val => {
            if (!val.packQty) {
              uniqArr.push(val.packName)
            }
          })
          if (uniqArr.length > 0) {
            let str = uniqArr.join(',')
            this.$message.error(`请填写${str}包装数量！`)
            return
          }
          item.pkgDetails = packageDataArr
          item.packingCost = packagePrice
          item.poTotalAmount = Number(item.packingCost) + Number(item.itemPrice)
          item.puTotalAmount = Number(item.packingCost) + Number(item.itemPrice)
        }
      }
      this.poTotalAmountTo = 0
      this.itemPriceTo = 0
      this.totalCostOfWarehousingSum = 0
      this.tableDetail.forEach(item => {
        this.poTotalAmountTo += Number(item.puTotalAmount)
        this.itemPriceTo += Number(item.itemPrice)
        item.totalCostOfWarehousing = this.formatPrice(
          (this.poTotalAmountTo + this.totalOtherPay) *
          (Number(item.puTotalAmount) / this.poTotalAmountTo)
        )
        item.costAllocationUnitPrice = this.formatPrice(
          item.totalCostOfWarehousing / item.poQty
        )
        this.totalCostOfWarehousingSum = this.formatPrice(
          Number(this.totalCostOfWarehousingSum) +
          Number(item.totalCostOfWarehousing)
        )
      })
      this.costInfo.noPayAmount = this.formatPrice(
        this.puTotalAmountT -
        Number(this.costInfo.payAmount) -
        Number(this.costInfo.deductions)
      )
      this.forEachCaculate('no')
      this.packageVisible = false
    },
    getPackageList() {
      const params = {}
      packList(params).then(res => {
        const data = res.data
        if (data.code == 200) {
          this.packageListData = data.data
          this.packageListData.forEach(item => {
            item.packId = item.id
            item.packUnitPrice = item.unitPrice
            item.packUnitWeight = item.unitWeight
          })
        } else {
          this.$message.error(data.message)
        }
      })
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    //计价单位
    getDictionaryData() {
      dictionary({ type: '10' }).then(res => {
        if (res.data.code == 200) {
          this.dictionaryData = res.data.data
        }
      })
    },
    getTableDetails() {
      const params = {
        id: this.poId,
        enterDetailType: this.enterDetailType
      }
      this.tableLoading = true
      getPoDetailsForGroup(params).then(res => {
        this.tableLoading = false
        this.poTotalAmountTo = 0
        this.itemPriceTo = 0
        this.totalCostOfWarehousingSum = 0
        if (res.data.code == 200) {
          this.tableDetail = res.data.data
          this.tableDetail.forEach(item => {
            item.puPrice = item.puPrice || item.poPrice
            item.poNetweight = item.poNetweight / 1000 || ''
            item.deliveryNetweight =
              item.poNetweight == 0 ? '' : item.poNetweight
            if (this.receivedFlag == 'receivedList') {
              item.itemPrice = item.puTotalAmount || item.poTotalAmount || ''
            } else {
              item.itemPrice = item.poTotalAmount || ''
            }

            if (!item.packingCost) {
              item.packingCost = ''
            }
            if (item.itemPrice || item.packingCost) {
              item.puTotalAmount =
                Number(item.packingCost) + Number(item.itemPrice)
              item.puTotalAmount =
                item.puTotalAmount == 0 ? '' : item.puTotalAmount
            } else {
              item.puTotalAmount = ''
            }
            this.poTotalAmountTo += Number(item.puTotalAmount)
            this.itemPriceTo += Number(item.itemPrice)
            item.packingCost = item.packingCost == 0 ? '' : item.packingCost
            if (this.receivedFlag == 'receivedList') {
              item.deliveryQty = item.deliveryQty || item.poQty
            } else {
              item.deliveryQty = item.poQty
            }
          })
          this.tableDetail.forEach(item => {
            item.totalCostOfWarehousing =
              item.puPrice == ''
                ? (item.totalCostOfWarehousing = '')
                : this.formatPrice(
                  (this.poTotalAmountTo + this.totalOtherPay) *
                  (Number(item.puTotalAmount) / this.poTotalAmountTo)
                )
            item.costAllocationUnitPrice =
              item.puPrice == ''
                ? (item.costAllocationUnitPrice = '')
                : this.formatPrice(item.totalCostOfWarehousing / item.poQty)
            this.totalCostOfWarehousingSum += Number(
              item.totalCostOfWarehousing
            )
          })
        } else {
          this.$message.error(res.data.message)
          this.tableDetail = []
        }
      })
    },
    //客户/商品录入切换
    typeChange() {
      this.getTableDetails()
    },
    handleBack() {
      if (this.receivedFlag == 'receivedList') {
        this.$closePage(
          '/transport/pickUp/pickUpOrderPickUpRouter',
          '/transport/pickUp/pickUpOrderEnd'
        )
      } else {
        this.$closePage(
          '/transport/pickUp/pickUpOrderPickUpRouter',
          '/transport/pickUp/pickUpOrderList'
        )
      }
    },
    handleOk() {
      if (this.mustCheck && this.isUndef(this.basicInfo.contractId)) {
        this.$message.error("请选择关联合同", 3)
        return
      }
      if (
        this.typeis(this.basicInfo.whId, 'undefined') &&
        !this.productDisable
      ) {
        this.$message.error('入库仓库必填', 3)
        return
      }
      if (
        this.tableDetail.some(v =>
          isFalse([
            v.invoiceBusinessType,
            v.invoiceType,
            v.puPrice,
            v.deliveryQty
          ])
        ) &&
        !this.productDisable
      ) {
        this.$message.error('商品列表带*为必填项')
        return
      }
      let check = this.feeData.some(
        x => x.reconciliaState == 520 || x.reconciliaState == 620
      )
      if (
        !check &&
          !this.productDisable &&
          this.feeData &&
          this.feeData.length > 0
          ? this.feeData.some(
            item =>
              isFalse([
                item.receivingSubjectId,
                item.rate,
                item.feeAmount,
                item.invoiceBusinessType,
                item.invoiceType
              ]) && !this.filterInvoiceOptions.includes(item.feeName)
          )
          : false
      ) {
        this.$message.error('请核对费用必填项 !')
        return
      }
      let costInfo = JSON.parse(JSON.stringify(this.costInfo))
      let tempDetail = []
      let details = JSON.parse(JSON.stringify(this.tableDetail))
      details.forEach(item => {
        if (item.itemCode != '合计') {
          tempDetail.push(item)
        }
      })
      tempDetail.forEach(item => {
        item.puPrice = item.puPrice || item.poPrice
        item.poNetweight = item.poNetweight * 1000 || 0
        item.deliveryNetweight = item.deliveryNetweight
          ? Number(item.deliveryNetweight) * 1000
          : 0
        item.puTotalAmount = item.puTotalAmount
          ? Number(item.puTotalAmount)
          : ''
        item.itemPrice = item.itemPrice ? Number(item.itemPrice) : ''
        item.packingCost = item.packingCost ? Number(item.packingCost) : ''
        item.totalCostOfWarehousing = item.totalCostOfWarehousing
          ? Number(item.totalCostOfWarehousing)
          : ''
        item.costAllocationUnitPrice = item.costAllocationUnitPrice
          ? Number(item.costAllocationUnitPrice)
          : ''
      })
      costInfo.payAmount = costInfo.payAmount ? Number(costInfo.payAmount) : ''
      costInfo.noPayAmount = costInfo.noPayAmount
        ? Number(costInfo.noPayAmount)
        : ''
      let feeTemp = JSON.parse(JSON.stringify(this.feeData))
      const params = {
        poType: this.poType,
        details: tempDetail,
        deptId: this.deptId,
        enterDetailType: this.enterDetailType,
        ...this.basicInfo,
        ...this.receivingInfo,
        purchaseFeeList: feeTemp || [],
        ...costInfo
      }
      params.purchaseGlobalOrderDetail = {
        ...this.purchaseGlobalOrderDetail,
        ...this.basicInfo
      }
      params.puTotalAmount = this.tableDetail.puTotalAmount
      params.packingCost = this.tableDetail.packingCost
      params.payReconciliaState = this.costInfo.payReconciliaState
      params.totalCostOfWarehousing = this.tableDetail.totalCostOfWarehousing
      params.costAllocationUnitPrice = this.tableDetail.costAllocationUnitPrice
      this.btnLoading = true
      if (this.receivedFlag == 'receivedList') {
        received(params).then(res => {
          this.btnLoading = false
          if (res.data.code == 200) {
            this.$message.success(
              res.data.message == 'OK' ? '编辑成功' : res.data.message
            )
            this.$closePage(
              '/transport/pickUp/pickUpOrderPickUpRouter',
              '/transport/pickUp/pickUpOrderList'
            )
          } else {
            this.$message.error(
              res.data.message ? res.data.message : '编辑失败'
            )
          }
        })
        return
      }
      pickUpOrder(params).then(res => {
        this.btnLoading = false
        if (res.data.code == 200) {
          this.$message.success(
            res.data.message == 'OK' ? '收货录入成功' : res.data.message
          )
          this.$closePage(
            '/transport/pickUp/pickUpOrderPickUpRouter',
            '/transport/pickUp/pickUpOrderList'
          )
        } else {
          this.$message.error(
            res.data.message ? res.data.message : '收货录入失败'
          )
        }
      })
    },
    // 过滤对应发票类型
    getInvoiceOption(record) {
      // 发票类型
      const options = [
        { value: 1, text: '增值税普通发票' },
        { value: 2, text: '增值税专用发票' },
        { value: 3, text: '增值税普通发票(免税)' },
        { value: 4, text: '进口增值税缴款书' },
        { value: 5, text: '进口关税缴款书' }
      ]
      // 费用类型
      const filterInvoiceOptions = this.filterInvoiceOptions
      return options.filter(item => {
        if (!filterInvoiceOptions.includes(record.feeName)) {
          return item.value < 4
        } else if (record.feeName === '进口增值税') {
          return item.value === 4
        } else if (record.feeName === '进口关税') {
          return item.value === 5
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.ant-form-item-label {
  height: 30px;
}

/deep/.ant-divider-horizontal {
  margin: 16px 0 0 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.card-info {
  /deep/.ant-form-item {
    margin-bottom: 0;
  }
}

.detail-table {
  /deep/.ant-input {
    text-align: center;
  }
}

.table-formva::before {
  display: inline-block;
  color: #f5222d;
  font-size: 14px;
  line-height: 1;
  content: '*';
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
