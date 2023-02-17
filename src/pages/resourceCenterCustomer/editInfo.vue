<template>
  <div>
    <a-modal
      :width="1200"
      destroyOnClose
      v-model="visible"
      :maskClosable="false"
      :footer="false"
    >
      <a-form-model :model="form" ref="form">
        <!-- 20 供应商 30 客户 -->
        <!-- 基本信息 -->
        <div v-if="auditStatus === 2 || editState == 'details' || editState == 'details'">
          <h3 style="font-weight: bold">基本信息</h3>
          <a-divider></a-divider>
          <a-row :gutter="[20, 10]">
            <a-col :span="12">
              <a-form-model-item label="企业名称" class="form-required">
                <a-input v-model="form.companyName" readOnly></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="英文名称">
                <a-input v-model="form.englishName" readOnly></a-input>
              </a-form-model-item>
            </a-col>
          <!-- </a-row>
          <a-row :gutter="[20, 10]"> -->
            <a-col :span="12">
              <a-form-model-item label="法人代表" class="form-required">
                <a-input v-model="form.legalRepresentative" readOnly></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="统一信用代码" class="form-required">
                <a-input v-model="form.uniformCreditCode" readOnly></a-input>
              </a-form-model-item>
            </a-col>
          <!-- </a-row>
          <a-row :gutter="16"> -->
            <a-col :span="12">
              <a-form-model-item label="联系人" class="form-required">
                <a-input v-model="form.contactOne" readOnly></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="联系电话" class="form-required">
                <a-input v-model="form.contactOnePhone" readOnly></a-input>
              </a-form-model-item>
            </a-col>
          <!-- </a-row>
          <a-row :gutter="16"> -->
            <a-col :span="12">
              <a-form-model-item label="办公注册地" class="form-required">
                <a-input v-model="form.officeOrRegistration" readOnly></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="详细地址" class="form-required">
                <a-input v-model="form.address" readOnly></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <!-- 合作方 -->
        <div v-if="auditStatus !== 2 && editState != 'details'">
          <h3 style="font-weight: bold">合作方</h3>
          <a-divider></a-divider>
          <a-row :gutter="20">
            <a-col :span="12">
              <a-form-model-item label="选择公海合作商" class="form-required">
                <a-select
                  placeholder=""
                  v-model="form.companyId"
                  allowClear
                  @search="getSBGH"
                  :filter-option="filterOption"
                  show-search
                >
                  <a-select-option
                    v-for="(item, index) in companyList"
                    :key="index"
                    :value="item.id"
                    >{{ item.companyName }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="地利维系人" class="form-required">
                <a-select
                  placeholder=""
                  v-model="form.diliMaintainerId"
                  allowClear
                  @change="dilierChange"
                  @search="getDilier"
                  :filter-option="filterOption"
                  show-search
                >
                  <a-select-option
                    v-for="(item, index) in dilier"
                    :key="index"
                    :value="item.id"
                    :label="item.realName"
                    >{{ item.realName }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <!-- 合作方式 -->
        <div>
          <div style="margin-top: 20px; font-weight: 600; font-size: 16px;">合作方式</div>
          <hr style="border-width: 0 0 1px; border-color: #d9d9d9;" />
          <a-row :gutter="[20, 10]">
            <a-col :span="12">
              <a-form-model-item label="合作商类型" class="form-required">
                <a-select
                  placeholder=""
                  v-model="form.partnerType"
                  :disabled="auditStatus === 2 || editState == 'details'"
                >
                  <a-select-option
                    v-for="(item, index) in diaoData.partnerType"
                    :key="index"
                    :value="item"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="合作产品类别" class="form-required">
                <a-select
                  placeholder=""
                  mode="multiple"
                  v-model="form.rawMaterials"
                  :disabled="auditStatus === 2 || editState == 'details'"
                >
                  <a-select-option
                    v-for="(item, index) in diaoData.rawMaterials"
                    :key="index"
                    :value="item"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="合作规模预估" class="form-required">
                <a-select
                  placeholder=""
                  v-model="form.monthlyCooperationScale"
                  :disabled="auditStatus === 2 || editState == 'details'"
                >
                  <a-select-option
                    v-for="(item, index) in diaoData.monthlyCooperationScale"
                    :key="index"
                    :value="item"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="结算方式" class="form-required">
                <a-select
                  placeholder=""
                  v-model="form.invcType"
                  :disabled="auditStatus === 2 || editState == 'details'"
                >
                  <a-select-option
                    v-for="(item, index) in diaoData.invcType"
                    :key="index"
                    :value="item"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="form.invcType == '有账期'">
              <a-form-model-item label="账期" class="form-required">
                <a-select
                  placeholder=""
                  v-model="form.billingPeriod"
                  style="width: 30%"
                  @change="billingPeriodChange"
                  :disabled="auditStatus === 2 || editState == 'details'"
                >
                  <a-select-option value="自然月底">自然月底</a-select-option>
                  <a-select-option value="固定日期">固定日期</a-select-option>
                  <a-select-option value="固定天数">固定天数</a-select-option>
                </a-select>
                <a-select
                  placeholder="选择固定日期时为必填"
                  v-model="form.invcCycle"
                  style="width: 70%"
                  v-if="form.billingPeriod == '固定日期'"
                  :disabled="auditStatus === 2 || editState == 'details'"
                >
                  <a-select-option v-for="item in dayList" :key="item">{{ item }}</a-select-option>
                </a-select>
                <a-input
                  placeholder="每月月底"
                  v-if="form.billingPeriod == '自然月底'"
                  v-model="form.invcCycle"
                  :readOnly="form.billingPeriod == '自然月底'"
                  style="width: 70%"
                  :disabled="auditStatus === 2 || editState == 'details'"
                ></a-input>
                <a-input
                  placeholder="请填写天数(正整数)"
                  v-if="form.billingPeriod == '固定天数'"
                  v-model="form.invcCycle"
                  @input="form.invcCycle = form.invcCycle.replace(/[^0-9]/,'')"
                  style="width: 70%"
                  :disabled="auditStatus === 2 || editState == 'details'"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col
              :span="12"
              v-else-if="form.invcType == '预付款'"
            >
              <a-form-model-item label="预付款比例(%)" class="form-required">
                <a-input-number
                  :min="0"
                  :max="100"
                  :disabled="editState == 'details'"
                  v-model="form.advancePaymentRatio" >
                </a-input-number>
              </a-form-model-item>
            </a-col>
            <a-col
              :span="12"
              v-if="auditStatus === 2 || editState == 'details'"
            >
              <a-form-model-item label="地利维系人" class="form-required">
                <a-select
                  placeholder=""
                  v-model="form.diliMaintainerId"
                  allowClear
                  @change="dilierChange"
                  @search="getDilier"
                  :filter-option="filterOption"
                  show-search
                  :disabled="auditStatus === 2 || editState == 'details'"
                >
                  <a-select-option
                    v-for="(item, index) in dilier"
                    :key="index"
                    :value="item.id"
                    :label="item.realName"
                    >{{ item.realName }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <!-- 企业评估 -->
        <div>
          <div style="margin-top: 20px; font-weight: 600; font-size: 16px;">企业评估</div>
          <hr style="border-width: 0 0 1px; border-color: #d9d9d9;" />
          <a-row :gutter="[20, 10]">
            <a-col :span="12">
              <a-form-model-item label="企业成立年限" class="form-required">
                <a-select
                  placeholder=""
                  v-model="form.establishedYears"
                  :disabled="auditStatus === 2 || editState == 'details'"
                >
                  <a-select-option
                    v-for="(item, index) in diaoData.establishedYears"
                    :key="index"
                    :value="item"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="企业性质" class="form-required">
                <a-select
                  placeholder=""
                  v-model="form.enterpriseNature"
                  :disabled="auditStatus === 2 || editState == 'details'"
                >
                  <a-select-option
                    v-for="(item, index) in diaoData.enterpriseNature"
                    :key="index"
                    :value="item"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="companyType === 20">
              <a-form-model-item label="产品供应能力" class="form-required">
                <a-select
                  placeholder=""
                  v-model="form.productSupplyAbility"
                  :disabled="editState == 'details'"
                >
                  <a-select-option v-for="item in diaoData.productSupplyAbility" :key="item" >{{ item }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="companyType === 20">
              <a-form-model-item label="产品质量/合格率" class="form-required">
                <a-select
                  placeholder=""
                  v-model="form.qualificationRate"
                  :disabled="editState == 'details'"
                >
                  <a-select-option v-for="item in diaoData.qualificationRate" :key="item" >{{ item }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="companyType === 20">
              <a-form-model-item label="办公经营场所评分(满分100)" class="form-required">
                <a-input-number
                  :min="0"
                  :max="100"
                  :disabled="editState == 'details'"
                  v-model="form.officeBusinessRating">
                </a-input-number>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="交易流水与单据匹配度(%)" :class="companyType === 30 ? 'form-required' : ''">
                <a-input-number
                  :min="0"
                  :max="100"
                  v-model="form.suitability"
                  @change="suitabilityC(form.suitability)"
                  :disabled="editState == 'details'"
                ></a-input-number>
                  <!--//! :disabled="auditStatus === 2 || editState == 'details'" -->
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="companyType === 30">
              <a-form-model-item label="实控人是否愿意签连带责任" class="form-required">
                <a-select v-model="form.whetherSignRelatedResponsibility" :disabled="auditStatus === 2 || editState == 'details'">
                  <a-select-option v-for="item in diaoData.whetherSignRelatedResponsibility" :key="item" >{{ item }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="companyType === 30">
              <a-form-model-item label="回款情况" class="form-required">
                <a-select
                  placeholder=""
                  v-model="form.repaymentSituation"
                  :disabled="auditStatus === 2 || editState == 'details'"
                >
                  <a-select-option
                    v-for="(item, index) in diaoData.repaymentSituation"
                    :key="index"
                    :value="item"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="companyType === 30">
              <a-form-model-item label="业界口碑" class="form-required">
                <a-select
                  placeholder=""
                  v-model="form.industryReputation"
                  :disabled="auditStatus === 2 || editState == 'details'"
                >
                  <a-select-option
                    v-for="(item, index) in diaoData.industryReputation"
                    :key="index"
                    :value="item"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="companyType === 30">
              <a-form-model-item label="诉讼情况">
                <a-select
                  placeholder=""
                  v-model="form.litigation"
                  :disabled="auditStatus === 2 || editState == 'details'"
                >
                  <a-select-option
                    v-for="(item, index) in diaoData.litigation"
                    :key="index"
                    :value="item"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="companyType === 30">
              <a-form-model-item label="行业经验" class="form-required">
                <a-select
                  placeholder=""
                  v-model="form.industryExperience"
                  :disabled="auditStatus === 2 || editState == 'details'"
                >
                  <a-select-option
                    v-for="(item, index) in diaoData.industryExperience"
                    :key="index"
                    :value="item"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="注册资本" class="form-required">
                <a-select
                  placeholder=""
                  v-model="form.registeredCapital"
                  :disabled="(companyType == 30 && auditStatus === 2) || editState == 'details'"
                >
                  <a-select-option
                    v-for="(item, index) in diaoData.registeredCapital"
                    :key="index"
                    :value="item"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="付款方式" class="form-required">
                <a-select
                  placeholder=""
                  v-model="form.paymentWay"
                  :disabled="auditStatus === 2 || editState == 'details'"
                >
                  <a-select-option
                    v-for="(item, index) in diaoData.paymentWay"
                    :key="index"
                    :value="item"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="companyType === 30">
              <a-form-model-item label="经营规模" class="form-required">
                <a-select
                  placeholder=""
                  v-model="form.businessScale"
                  :disabled="auditStatus === 2 || editState == 'details'"
                >
                  <a-select-option
                    v-for="(item, index) in diaoData.businessScale"
                    :key="index"
                    :value="item"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="companyType === 30">
              <a-form-model-item label="销售渠道" class="form-required">
                <a-select
                  placeholder=""
                  v-model="form.salesChannels"
                  :disabled="auditStatus === 2 || editState == 'details'"
                >
                  <a-select-option
                    v-for="(item, index) in diaoData.salesChannels"
                    :key="index"
                    :value="item"
                    >{{ item }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="companyType === 30">
              <a-form-model-item label="客户出货销售能力(满分100)" class="form-required">
                <a-input-number
                  :min="0"
                  :max="100"
                  :disabled="editState == 'details'"
                  v-model="form.customerShipmentSalesCapability">
                </a-input-number>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="companyType === 30">
              <a-form-model-item label="客户盈利能力(满分100)" class="form-required">
                <a-input-number
                  :min="0"
                  :max="100"
                  :disabled="editState == 'details'"
                  v-model="form.customerProfitability">
                </a-input-number>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="companyType === 30">
              <a-form-model-item label="资金周转情况" class="form-required">
                <a-select v-model="form.capitalTurnover" :disabled="editState == 'details'">
                  <a-select-option v-for="item in diaoData.capitalTurnover" :key="item" >{{ item }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="companyType === 30">
              <a-form-model-item label="资产负债率（%）" class="form-required">
                <a-input-number
                  :min="0"
                  :max="100"
                  :disabled="editState == 'details'"
                  v-model="form.assetLoadRatio">
                </a-input-number>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="companyType === 30">
              <a-form-model-item label="运营资金评估(满分100)" class="form-required">
                <a-input-number
                  :min="0"
                  :max="100"
                  :disabled="editState == 'details'"
                  v-model="form.workingCapitalAssessment">
                </a-input-number>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="companyType === 30">
              <a-form-model-item label="客户有形资产评估(满分100)" class="form-required">
                <a-input-number
                  :min="0"
                  :max="100"
                  :disabled="editState == 'details'"
                  v-model="form.assetMarketValue">
                </a-input-number>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="companyType === 30">
              <a-form-model-item label="可抵押资产价值" class="form-required">
                <a-select
                  v-model.trim="form.mortgageAssetValue"
                  :disabled="auditStatus === 2 && editState == 'details'"
                >
                  <a-select-option v-for="item in diaoData.mortgageAssetValue" :key="item">{{ item }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="companyType === 30">
              <a-form-model-item :label="companyType === 30 ? '纳税申报表（满分100）' : '近一年纳税申报表（满分100）'" class="form-required">
                <a-input-number
                  :min="0"
                  :max="100"
                  :disabled="editState == 'details'"
                  @change="forceUpdate"
                  v-model="form.taxReturn">
                </a-input-number>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="companyType === 20">
              <a-form-model-item :label="companyType === 30 ? '纳税申报表（满分100）' : '近一年纳税申报表（满分100）'" class="form-required">
                <a-input-number
                  :min="0"
                  :max="100"
                  :disabled="editState == 'details'"
                  @change="forceUpdate"
                  v-model="form.taxReturn">
                </a-input-number>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="提供上下游合同（满分100）" class="form-required">
                <a-input-number
                  :min="0"
                  :max="100"
                  :disabled="editState == 'details'"
                  @change="forceUpdate"
                  v-model="form.upAndDownContracts">
                </a-input-number>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item :label="companyType === 30 ? '客户财务报表状况（满分100）' : '近两年财务报表状况评分（满分100）'" class="form-required">
                <a-input-number
                  :min="0"
                  :max="100"
                  :disabled="editState == 'details'"
                  @change="forceUpdate"
                  v-model="form.financialStatementStatus">
                </a-input-number>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item :label="companyType === 30 ? '经营流水（满分100）' : '近半年经营流水评分（满分100）'" class="form-required">
                <a-input-number
                  :min="0"
                  :max="100"
                  :disabled="editState == 'details'"
                  @change="forceUpdate"
                  v-model="form.businessFlow">
                </a-input-number>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item :label="companyType === 30 ? '经营对账单（满分100）' : '经营对账单评分（满分100）'" class="form-required">
                <a-input-number
                  :min="0"
                  :max="100"
                  :disabled="editState == 'details'"
                  @change="forceUpdate"
                  v-model="form.operatingStatement">
                </a-input-number>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item :label="companyType === 30 ? '其他（如科目明细表，海关关单、出入库记录、外部数据等）评分（满分100分）' : '其他（如科目明细表，海关关单、出库记录、外部数据等）（满分100）'" class="form-required">
                <a-input-number
                  :min="0"
                  :max="100"
                  :disabled="editState == 'details'"
                  @change="forceUpdate"
                  v-model="form.otherRatings">
                </a-input-number>
              </a-form-model-item>
            </a-col>
            <a-col :span="12" v-if="companyType === 30">
              <a-form-model-item label="经济不景气时的现金流、债务比例、资产转移能力（满分100分）" class="form-required">
                <a-input-number
                  :min="0"
                  :max="100"
                  :disabled="editState == 'details'"
                  @change="forceUpdate"
                  v-model="form.assetTransferCapability">
                </a-input-number>
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- <a-row :gutter="16">
            <a-col :span="12">
              <a-form-model-item label="交易流水与单据匹配度(%)">
                <a-input
                  v-model.trim="form.suitability"
                  @input="
                    form.suitability = form.suitability.replace(/[^0-9\.]*/g, '')
                  "
                  @change="suitabilityC(form.suitability)"
                  :disabled="auditStatus === 2 || editState == 'details'"
                ></a-input>
              </a-form-model-item>
            </a-col>
          </a-row> -->
        </div>
        <!-- 资料附件 -->
        <div>
          <div style="margin-top: 20px; font-weight: 600; font-size: 16px;;">资料附件</div>
          <hr style="border-width: 0 0 1px; border-color: #d9d9d9;" />
          <!-- 供应商 -->
          <div class="supplier-attachment" v-if="companyType === 20">
            <div
              v-for="(item, index) in tableNameSupplier"
              :key="index"
            >
              <h4 style="font-weight: bold; margin-top: 10px">
                {{ item.name }}
              </h4>
              <a-table
                style="margin-top: 8px"
                bordered
                :columns="columnsQ"
                :data-source="attachmentData[item.code]"
                size="middle"
                :pagination="false"
              >
                <div slot="haveOrNot" slot-scope="text, record">
                  <a-select
                    v-model="record.haveOrNot"
                    placeholder="选择"
                    :disabled="auditStatus === 2 || editState == 'details'"
                  >
                    <a-select-option value="有">有</a-select-option>
                    <a-select-option value="无">无</a-select-option>
                  </a-select>
                </div>
                <div slot="attachment" slot-scope="text, record">
                  <div
                    style="
                      width: 100%;
                      height: 100%;
                      text-align: left;
                      display: flex;
                      flex-wrap: wrap;
                    "
                  >
                    <span v-for="(i, k) in record.fileList" :key="k"
                      ><a-button type="link" @click="openPreview(i.filePath)">{{
                        i.fileName
                      }}</a-button>
                      <div style="display: flex; justify-content: space-around">
                        <a @click="openPreview(i.filePath)">下载</a>
                        <a
                          @click="deleteItem(record, k)"
                          v-if="auditStatus !== 2"
                          >删除</a
                        >
                      </div>
                    </span>
                  </div>
                </div>
                <div slot="opreation" slot-scope="text, record">
                    <!-- v-if="record.haveOrNot == '有'" -->
                  <a-upload-dragger
                    :showUploadList="false"
                    :multiple="true"
                    :disabled="auditStatus === 2 || editState == 'details'"
                    :before-upload="
                      (file) => {
                        return beforeUploadMy(file, record, item.name);
                      }
                    "
                  >
                      <!-- v-if="record.haveOrNot == '有'" -->
                    <a-icon
                      style="font-size: 24px"
                      type="cloud-upload"
                    />
                  </a-upload-dragger>
                </div>
              </a-table>
            </div>
          </div>
          <!-- 客户 -->
          <div class="customer-attachment" v-if="companyType === 30">
            <div
              v-for="(item, index) in tableNameCustomer"
              :key="index"
            >
              <h4 style="font-weight: bold; margin-top: 10px">
                {{ item.name }}
              </h4>
              <a-table
                style="margin-top: 8px"
                bordered
                :columns="columnsQ"
                :data-source="attachmentDataC[item.code]"
                size="middle"
                :pagination="false"
              >
                <div slot="haveOrNot" slot-scope="text, record">
                  <a-select
                    v-model="record.haveOrNot"
                    placeholder="选择"
                    :disabled="auditStatus === 2 || editState == 'details'"
                  >
                    <a-select-option value="有">有</a-select-option>
                    <a-select-option value="无">无</a-select-option>
                  </a-select>
                </div>
                <div slot="attachment" slot-scope="text, record">
                  <div
                    style="
                      width: 100%;
                      height: 100%;
                      text-align: left;
                      display: flex;
                      flex-wrap: wrap;
                    "
                  >
                    <span v-for="(i, k) in record.fileList" :key="k"
                      ><a-button type="link" @click="openPreview(i.filePath)">{{
                        i.fileName
                      }}</a-button>
                      <div style="display: flex; justify-content: space-around">
                        <a @click="openPreview(i.filePath)">下载</a>
                        <a
                          @click="deleteItem(record, k)"
                          v-if="auditStatus !== 2 && editState != 'details'"
                          >删除</a
                        >
                      </div>
                    </span>
                  </div>
                </div>
                <div slot="opreation" slot-scope="text, record">
                    <!-- v-if="record.haveOrNot == '有'" -->
                  <a-upload-dragger
                    :showUploadList="false"
                    :disabled="auditStatus === 2 || editState == 'details'"
                    :multiple="true"
                    :before-upload="
                      (file) => {
                        return beforeUploadMy(file, record, item.name);
                      }
                    "
                  >
                      <!-- v-if="record.haveOrNot == '有'" -->
                    <a-icon
                      style="font-size: 24px"
                      type="cloud-upload"
                    />
                  </a-upload-dragger>
                </div>
              </a-table>
            </div>
          </div>
        </div>
        <a-row style="text-align: center; margin-top: 6px">
          <a-space>
            <a-button
              v-if="auditStatus === 1"
              type="primary"
              @click="saveEdit(1)"
              >保存</a-button
            >
            <a-button
              v-if="auditStatus === 1"
              type="primary"
              @click="saveEdit(2)"
              >提交</a-button
            >
            <a-button
              v-if="auditStatus === 3 && editState !== 'details'"
              type="primary"
              @click="saveEdit(5)"
              >保存</a-button
            >
            <a-button
              v-if="auditStatus === 2"
              type="primary"
              @click="checkItem(3)"
              >通过</a-button
            >
            <a-button
              v-if="auditStatus === 2&&form.auditStatus!=5"
              type="primary"
              @click="checkItem(4)"
              >驳回</a-button
            >
            <a-button @click="handleClose">取消</a-button>
          </a-space>
        </a-row>
      </a-form-model>
    </a-modal>
    <RejectAndTimeline ref="rejectAndTimeline" />
  </div>
</template>

<script>
import {
  GetPartnerCenterDic,
  GetGHList,
  SearchDilier,
  InsertPartnerCenter,
  UpdatePartnerCenter,
  AuditPartnerCenter,
  DoUploadPartnerCenter,
  BatchAddUploadUrl,
  GetUploadTreeList,
} from "../../services/resourceCenter/resourceCenter";
import RejectAndTimeline from "./rejectAndTimeline.vue";
export default {
  components: { RejectAndTimeline },
  data() {
    return {
      form: {},
      dayList: [
        "固定每月 1 日",
        "固定每月 2 日",
        "固定每月 3 日",
        "固定每月 4 日",
        "固定每月 5 日",
        "固定每月 6 日",
        "固定每月 7 日",
        "固定每月 8 日",
        "固定每月 9 日",
        "固定每月 10 日",
        "固定每月 11 日",
        "固定每月 12 日",
        "固定每月 13 日",
        "固定每月 14 日",
        "固定每月 15 日",
        "固定每月 16 日",
        "固定每月 17 日",
        "固定每月 18 日",
        "固定每月 19 日",
        "固定每月 20 日",
        "固定每月 21 日",
        "固定每月 22 日",
        "固定每月 23 日",
        "固定每月 24 日",
        "固定每月 25 日",
        "固定每月 26 日",
        "固定每月 27 日",
        "固定每月 28 日",
      ],
      columnsQ: [
        {
          align: "center",
          title: "附件名称",
          dataIndex: "attachmentName",
        },
        // {
        //   align: "center",
        //   title: "有无",
        //   dataIndex: "haveOrNot",
        //   scopedSlots: { customRender: "haveOrNot" },
        //   width: 80,
        // },
        {
          align: "center",
          title: "附件",
          dataIndex: "attachment",
          scopedSlots: { customRender: "attachment" },
          width: 400,
        },

        {
          align: "center",
          title: "上传",
          dataIndex: "opreation",
          width: 80,
          scopedSlots: { customRender: "opreation" },
        },
      ],
      attachmentData: {
        // qyzz: [
        //   { attachmentName: "营业执照", fileList: [], haveOrNot: "" },
        //   { attachmentName: "进出口资质证书", fileList: [], haveOrNot: "" },
        //   { attachmentName: "食品生产许可证", fileList: [], haveOrNot: "" },
        //   { attachmentName: "食品经营许可证", fileList: [], haveOrNot: "" },
        //   { attachmentName: "畜/禽定点屠宰证", fileList: [], haveOrNot: "" },
        //   { attachmentName: "动物防疫条件合格证", fileList: [], haveOrNot: "" },
        // ],
        // cwjyzk: [
        //   {
        //     attachmentName: "财务报表状况(近两年)",
        //     fileList: [],
        //     haveOrNot: "",
        //   },
        //   { attachmentName: "经营流水(半年)", fileList: [], haveOrNot: "" },
        //   { attachmentName: "经营对账单", fileList: [], haveOrNot: "" },
        //   { attachmentName: "纳税申报表(近一年)", fileList: [], haveOrNot: "" },
        //   {
        //     attachmentName:
        //       "其他（如科目明细表，海关关单、出库记录、外部数据等)",
        //     fileList: [],
        //     haveOrNot: "",
        //   },
        //   { attachmentName: "提供上下游合同", fileList: [], haveOrNot: "" },
        // ],
        // cpzl: [
        //   {
        //     attachmentName: "入境货物检验检疫证明",
        //     fileList: [],
        //     haveOrNot: "",
        //   },
        //   { attachmentName: "肉品品质检验合格证", fileList: [], haveOrNot: "" },
        //   {
        //     attachmentName: "动物检疫合格证明（产品）",
        //     fileList: [],
        //     haveOrNot: "",
        //   },
        //   { attachmentName: "产品检测报告", fileList: [], haveOrNot: "" },
        //   {
        //     attachmentName: "地理标志/有机认证/中国名牌/驰名商标等认证证书",
        //     fileList: [],
        //     haveOrNot: "",
        //   },
        //   { attachmentName: "生产合格证", fileList: [], haveOrNot: "" },
        //   { attachmentName: "商标注册证", fileList: [], haveOrNot: "" },
        // ],
        // others: [
        //   {
        //     attachmentName: "Supplier information collection form",
        //     fileList: [],
        //     haveOrNot: "",
        //   },
        //   { attachmentName: "报关单", fileList: [], haveOrNot: "" },
        //   { attachmentName: "业务代理授权书", fileList: [], haveOrNot: "" },
        //   {
        //     attachmentName: "办公/经营匹配度评估",
        //     fileList: [],
        //     haveOrNot: "",
        //   },
        // ],
      },
      attachmentDataC: {
        // qyzz: [
        //   { attachmentName: "营业执照", fileList: [], haveOrNot: "" },
        //   { attachmentName: "客户公司性质", fileList: [], haveOrNot: "" },
        //   { attachmentName: "企业成立年限", fileList: [], haveOrNot: "" },
        //   { attachmentName: "进出口资质证书", fileList: [], haveOrNot: "" },
        //   { attachmentName: "食品生产许可证", fileList: [], haveOrNot: "" },
        //   { attachmentName: "食品经营许可证", fileList: [], haveOrNot: "" },
        //   { attachmentName: "银行征信报告", fileList: [], haveOrNot: "" },
        // ],
        // ability: [
        //   { attachmentName: "出货销售能力", fileList: [], haveOrNot: "" },
        //   { attachmentName: "盈利能力", fileList: [], haveOrNot: "" },
        //   {
        //     attachmentName: "财务报表状况(近两年)",
        //     fileList: [],
        //     haveOrNot: "",
        //   },
        //   { attachmentName: "经营流水(半年内)", fileList: [], haveOrNot: "" },
        //   {
        //     attachmentName: "经营对账单(半年内)",
        //     fileList: [],
        //     haveOrNot: "",
        //   },
        //   { attachmentName: "纳税申报表(近一年)", fileList: [], haveOrNot: "" },
        //   {
        //     attachmentName:
        //       "其他（如科目明细表，海关关单、出库记录、外部数据等）",
        //     fileList: [],
        //     haveOrNot: "",
        //   },
        // ],
      },
      visible: false,
      diaoData: {},
      companyType: "",
      companyList: [],
      dilier: [],
      editState: "",
      auditStatus: "",
      tableNameSupplier: [
        { name: "企业资质", code: "qyzz" },
        { name: "财务经营状况", code: "cwjyzk" },
        { name: "产品质量", code: "cpzl" },
        { name: "其他", code: "others" },
      ],
      tableNameCustomer: [
        { name: "企业资质", code: "qyzz" },
        { name: "能力", code: "ability" },
        { name: "资本", code: "ziben" },
        { name: "抵押", code: "diya" },
        { name: "条件", code: "tiaojian" },
      ],
    };
  },
  methods: {
    forceUpdate() {
      this.$forceUpdate()
    },
    suitabilityC(value) {
      if (value > 100) {
        this.form.suitability = (+value || 0) > 100 ? 100 : (value || 0);
      }
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    dilierChange(value, option) {
      this.form.diliMaintainer = option.componentOptions.propsData.label || "";
      // this.form.diliMaintainerId = value;
    },
    //删除附件
    deleteItem(record, k) {
      record.fileList.splice(k, 1);
    },
    async getDocs(id) {
      let params = new FormData();
      params.append("tableId", id);
      const res = await GetUploadTreeList(params);
      if (res.data.code === "200") {
        const fjdata = JSON.parse(JSON.stringify(res.data.data));
        if (fjdata) {
          for (let i in fjdata) {
            switch (this.companyType) {
              case 20:
                this.tableNameSupplier.forEach((item) => {
                  if (item.name == i) {
                    this.attachmentData[item.code].forEach((x) => {
                      for (let j in fjdata[i]) {
                        if (x.attachmentName == j) {
                          x.fileList = fjdata[i][j];
                          x.haveOrNot = "有";
                        }
                      }
                    });
                  }
                });

                break;
              case 30:
                this.tableNameCustomer.forEach((item) => {
                  if (item.name == i) {
                    this.attachmentDataC[item.code].forEach((x) => {
                      for (let j in fjdata[i]) {
                        if (x.attachmentName == j) {
                          x.fileList = fjdata[i][j];
                          x.haveOrNot = "有";
                        }
                      }
                    });
                  }
                });

                break;

              default:
                break;
            }
          }
        }
      }
    },
    //openPreview
    openPreview(url) {
      window.open(url, "_blank");
    },
    //上传
    async beforeUploadMy(file, record, type) {
      let params = new FormData();
      params.append("file", file);
      params.append("mode", "batch");
      params.append("tableType", type);
      params.append("tableName", record.attachmentName);
      const res = await DoUploadPartnerCenter(params);
      if (res.data.code === "200") {
        this.$message.success(res.data.message);
        record.fileList.push(res.data.data[0]);
        this.$forceUpdate();
      } else {
        this.$message.error(res.data.message);
      }
    },
    //审核驳回
    async checkItem(value) {
      if (value === 3) {
        const paramsCopy = {
          ...this.form,
          auditStatus: value,
        };
        const params = this.deepClone(paramsCopy)
        delete params.rawMaterials
        params.suitability = params.suitability === '' || params.suitability === undefined ? undefined : this.formatPrice(+params.suitability / 100) + ""
        params.advancePaymentRatio = params.advancePaymentRatio === '' || params.advancePaymentRatio === undefined ? undefined : this.formatPrice(+params.advancePaymentRatio / 100) + ""
        params.assetLoadRatio = params.assetLoadRatio === '' || params.assetLoadRatio === undefined ? undefined : this.formatPrice(+params.assetLoadRatio / 100) + ""
        const res = await AuditPartnerCenter(params);
        if (res.data.code === "200") {
          this.$message.success(res.data.message);
          this.visible = false;
          this.$parent.getList();
        } else {
          this.$message.error(res.data.message);
        }
      }
      if (value === 4) {
        this.$refs.rejectAndTimeline.rejectReason(this.form, "驳回原因", true);
      }
    },
    //固定日期选择
    billingPeriodChange(value) {
      if (value != "固定日期") {
        this.form.invcCycle = "";
      }
    },
    //地利维系人
    async getDilier(value) {
      const res = await SearchDilier({ userType: 2, realName: value || "" });
      if (res.data.code === "200") {
        this.dilier = res.data.data;
        this.$forceUpdate();
      } else {
        this.$message.error(res.data.message);
      }
    },
    //公海企业
    async getSBGH(value) {
      const res = await GetGHList({ keyword: value || "" });
      if (res.data.code === "200") {
        this.companyList = res.data.data;
        this.$forceUpdate();
      } else {
        this.$message.error(res.data.message);
      }
    },
    async getDictionary() {
      const res = await GetPartnerCenterDic();
      if (res.data.code === "200") {
        this.diaoData = res.data.data || [];
      } else {
        this.$message.error(res.data.message);
      }
    },
    //------------保存&提交
    async saveEdit(state) {
      let errorState = false;
      let validate;
      if (this.form.invcType == "预付款" && (this.form.advancePaymentRatio === undefined || this.form.advancePaymentRatio === "")) {
        errorState = true
      }
      switch (this.companyType) {
        case 20:
          validate = [
            "companyId",
            "diliMaintainer",
            "diliMaintainerId",
            "partnerType",
            "rawMaterials",
            "monthlyCooperationScale",
            "establishedYears",
            "enterpriseNature",
            "otherRatings",
            "businessFlow",
            "operatingStatement",
            "financialStatementStatus",
            "upAndDownContracts",
            "taxReturn",
            "invcType",
            "productSupplyAbility",
            "registeredCapital",
            "qualificationRate",
            "officeBusinessRating"
          ];
          if (this.form.invcType === "有账期") {
            validate.push("billingPeriod");
            if (this.form.billingPeriod === "固定日期") {
              validate.push("invcCycle");
            }
          }
          validate.forEach((item) => {
            if (this.isUndef(this.form[item])) {
              errorState = true;
            }
          });
          break;
        case 30:
          validate = [
            "companyId",
            "diliMaintainer",
            "diliMaintainerId",
            "partnerType",
            "rawMaterials",
            "monthlyCooperationScale",
            "establishedYears",
            "enterpriseNature",
            "invcType",
            "repaymentSituation",
            "industryReputation",
            "industryExperience",
            "assetTransferCapability",
            "registeredCapital",
            "businessScale",
            "salesChannels",
            "paymentWay",
            "financialStatementStatus",
            "businessFlow",
            "operatingStatement",
            "taxReturn",
            "otherRatings",
            "upAndDownContracts",
            "whetherSignRelatedResponsibility",
            "customerShipmentSalesCapability",
            "customerProfitability",
            "capitalTurnover",
            "assetLoadRatio",
            "workingCapitalAssessment",
            "assetMarketValue",
            "mortgageAssetValue",
            "suitability",
          ];
          if (this.form.invcType === "有账期") {
            validate.push("billingPeriod");
            if (this.form.billingPeriod === "固定日期") {
              validate.push("invcCycle");
            }
          }
          validate.forEach((item) => {
            if (this.form[item] === undefined || this.form[item] === '') {
              errorState = true;
            }
          });
          break;

        default:
          break;
      }
      if (errorState) {
        this.$warning({
          title: "存在必填项为空请核对",
          centered: true,
          okText: "关闭",
        });
        return;
      }
      let paramsCopy = {
        ...this.form,
        auditStatus: state == 1 && this.editState == 'edit'? undefined : state,
        companyType: this.companyType,
      };
      const params = this.deepClone(paramsCopy)
      params.rawMaterials = params.rawMaterials.join(',')
      params.suitability = params.suitability === '' || params.suitability === undefined ? undefined : this.formatPrice(+params.suitability / 100) + "" || 0
      params.advancePaymentRatio = params.advancePaymentRatio === '' || params.advancePaymentRatio === undefined ? undefined : this.formatPrice(+params.advancePaymentRatio / 100) + ""
      params.assetLoadRatio = params.assetLoadRatio === '' || params.assetLoadRatio === undefined ? undefined : this.formatPrice(+params.assetLoadRatio / 100) + ""
      //新增
      if (this.editState === "add") {
        const res = await InsertPartnerCenter(params);
        if (res.data.code === "200") {
          this.$message.success(res.data.message);
          this.fujianSave(res.data.data.id || "");
        } else {
          this.$message.error(res.data.message);
          return;
        }
      }
      //编辑
      if (this.editState === "edit") {
        let _this = this;
        if (state == 1 || state == 5) {
          this.$confirm({
            title: "编辑提示",
            content: "确定要修改信息吗？",
            okText: "确定",
            cancelText: "取消",
            async onOk() {
              const res = await UpdatePartnerCenter(params);
              if (res.data.code === "200") {
                _this.$message.success(res.data.message);
                _this.fujianSave(_this.form.id || "");
              } else {
                _this.$message.error(res.data.message);
                return;
              }
            },
          });
        } else {
          this.$confirm({
            title: "编辑提示",
            content: "确定要提交审核吗？",
            okText: "确定",
            cancelText: "取消",
            async onOk() {
              const res = await UpdatePartnerCenter(params);
              if (res.data.code === "200") {
                _this.$message.success(res.data.message);
                _this.fujianSave(_this.form.id || "");
              } else {
                _this.$message.error(res.data.message);
                return;
              }
            },
          });
        }
      }

      // if (this.editState === "add") {
      //   this.visible = false;
      //   this.$parent.getList();
      // }
    },
    //图片
    async fujianSave(id) {
      const urlParams = [];
      switch (this.companyType) {
        case 20:
          for (let i in this.attachmentData) {
            this.attachmentData[i].forEach((item) => {
              if (
                // item.haveOrNot == "有" &&
                item.fileList &&
                item.fileList.length > 0
              ) {
                let goodDemand = {};
                item.fileList.forEach((key) => {
                  goodDemand = {
                    fileUrlList: [key.filePath],
                    tableId: id,
                    tableName: key.tableName,
                    tableType: key.tableType,
                    fileType: key.fileType,
                    fileName: key.fileName,
                  };
                  urlParams.push(goodDemand);
                });
              }
            });
          }
          break;
        case 30:
          for (let i in this.attachmentDataC) {
            this.attachmentDataC[i].forEach((item) => {
              if (
                // item.haveOrNot == "有" &&
                item.fileList &&
                item.fileList.length > 0
              ) {
                let goodDemand = {};
                item.fileList.forEach((key) => {
                  goodDemand = {
                    fileUrlList: [key.filePath],
                    tableId: id,
                    tableName: key.tableName,
                    tableType: key.tableType,
                    fileType: key.fileType,
                    fileName: key.fileName,
                  };
                  urlParams.push(goodDemand);
                });
              }
            });
          }

          break;

        default:
          break;
      }
      const urlres = await BatchAddUploadUrl(urlParams);
      if (urlres.data.code !== "200") {
        this.$message.error(urlres.data.message || "附件保存失败");
      }
      this.visible = false;
      this.$parent.getList();
    },
    handleClose() {
      this.visible = false;
      // this.$parent.getList()
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
    showModal(record, companyType, editState, auditStatus) {
      this.companyType = companyType;
      this.editState = editState;
      this.auditStatus = auditStatus;
      this.getSBGH();
      this.getDilier();
      this.getDictionary();
      switch (this.companyType) {
        case 20:
          this.attachmentData = {
            qyzz: [
              { attachmentName: "营业执照", fileList: [], haveOrNot: "" },
              { attachmentName: "进出口资质证书", fileList: [], haveOrNot: "" },
              { attachmentName: "食品生产许可证", fileList: [], haveOrNot: "" },
              { attachmentName: "食品经营许可证", fileList: [], haveOrNot: "" },
              {
                attachmentName: "畜/禽定点屠宰证",
                fileList: [],
                haveOrNot: "",
              },
              {
                attachmentName: "动物防疫条件合格证",
                fileList: [],
                haveOrNot: "",
              },
            ],
            cwjyzk: [
              {
                attachmentName: "财务报表状况（近两年）",
                fileList: [],
                haveOrNot: "",
              },
              { attachmentName: "经营流水（半年）", fileList: [], haveOrNot: "" },
              { attachmentName: "经营对账单", fileList: [], haveOrNot: "" },
              {
                attachmentName: "纳税申报表（近一年）",
                fileList: [],
                haveOrNot: "",
              },
              {
                attachmentName:
                  "其他（如科目明细表，海关关单、出库记录、外部数据等）",
                fileList: [],
                haveOrNot: "",
              },
              { attachmentName: "提供上下游合同", fileList: [], haveOrNot: "" },
              { attachmentName: "交易流水与单据匹配度", fileList: [], haveOrNot: "" },
            ],
            cpzl: [
              {
                attachmentName: "入境货物检验检疫证明",
                fileList: [],
                haveOrNot: "",
              },
              {
                attachmentName: "肉品品质检验合格证",
                fileList: [],
                haveOrNot: "",
              },
              {
                attachmentName: "动物检疫合格证明（产品）",
                fileList: [],
                haveOrNot: "",
              },
              { attachmentName: "产品检测报告", fileList: [], haveOrNot: "" },
              {
                attachmentName: "地理标志/有机认证/中国名牌/驰名商标等认证证书",
                fileList: [],
                haveOrNot: "",
              },
              { attachmentName: "生产合格证", fileList: [], haveOrNot: "" },
              { attachmentName: "商标注册证", fileList: [], haveOrNot: "" },
            ],
            others: [
              {
                attachmentName: "Supplier information collection form",
                fileList: [],
                haveOrNot: "",
              },
              { attachmentName: "报关单", fileList: [], haveOrNot: "" },
              { attachmentName: "业务代理授权书", fileList: [], haveOrNot: "" },
              {
                attachmentName: "办公/经营匹配度评估",
                fileList: [],
                haveOrNot: "",
              },
            ],
          };
          break;

        case 30:
          this.attachmentDataC = {
            qyzz: [
              { attachmentName: "营业执照", fileList: [], haveOrNot: "" },
              { attachmentName: "客户公司性质", fileList: [], haveOrNot: "" },
              { attachmentName: "进出口资质证书", fileList: [], haveOrNot: "" },
              { attachmentName: "食品生产许可证", fileList: [], haveOrNot: "" },
              { attachmentName: "食品经营许可证", fileList: [], haveOrNot: "" },
              { attachmentName: "银行征信报告", fileList: [], haveOrNot: "" },
              { attachmentName: "提供上下游合同", fileList: [], haveOrNot: "" },
            ],
            ability: [
              { attachmentName: "出货销售能力", fileList: [], haveOrNot: "" },
              { attachmentName: "盈利能力", fileList: [], haveOrNot: "" },
              {
                attachmentName: "财务报表状况（近两年）",
                fileList: [],
                haveOrNot: "",
              },
              {
                attachmentName: "经营流水（半年内）",
                fileList: [],
                haveOrNot: "",
              },
              {
                attachmentName: "经营对账单（半年内）",
                fileList: [],
                haveOrNot: "",
              },
              {
                attachmentName: "纳税申报表（近一年）",
                fileList: [],
                haveOrNot: "",
              },
              {
                attachmentName:
                  "其他（如科目明细表，海关关单、出库记录、外部数据等）",
                fileList: [],
                haveOrNot: "",
              },
              {
                attachmentName:"交易流水与单据匹配度", fileList: [],haveOrNot: "",
              },
              // {
              //   attachmentName:"客户出货销售能力", fileList: [],haveOrNot: "",
              // },
              // {
              //   attachmentName:"客户盈利能力", fileList: [],haveOrNot: "",
              // },
            ],
            ziben: [
              {attachmentName: "资金周转情况", fileList: [], haveOrNot: ""},
              {attachmentName: "资产负债率", fileList: [], haveOrNot: ""},
              {attachmentName: "运营资金评估", fileList: [], haveOrNot: ""},
              {attachmentName: "客户有形资产评估", fileList: [], haveOrNot: ""},
            ],
            diya: [
              {attachmentName: "可抵押资产证明", fileList: [], haveOrNot: ""},
              {attachmentName: "实控人连带责任书", fileList: [], haveOrNot: ""},
            ],
            tiaojian: [
              {attachmentName: "经济不景气时的现金流、债务比例、资产转移能力", fileList: [], haveOrNot: ""},
            ],
          };
          break;

        default:
          break;
      }
      //编辑
      if (record) {
        let value = this.deepClone(record)
        value.rawMaterials = value.rawMaterials?.split(',')
        this.form = value;
        this.form.suitability = this.formatPrice(this.form.suitability * 100) || 0
        this.form.advancePaymentRatio = this.formatPrice(this.form.advancePaymentRatio * 100) || 0
        this.form.assetLoadRatio = this.formatPrice(this.form.assetLoadRatio * 100) || 0
        this.form.financialStatementStatus = this.form.financialStatementStatus || 0
        this.form.businessFlow = this.form.businessFlow || 0
        this.form.operatingStatement = this.form.operatingStatement || 0
        this.form.taxReturn = this.form.taxReturn || 0
        this.form.otherRatings = this.form.otherRatings || 0
        this.form.upAndDownContracts = this.form.upAndDownContracts || 0
        this.getDocs(this.form.id);
      } else {
        switch (this.companyType) {
          case 20:
            this.form = {
              diliMaintainerId: undefined,
              companyId: undefined,
              diliMaintainer: undefined,
              rawMaterials: undefined,
              monthlyCooperationScale: undefined,
              establishedYears: undefined,
              enterpriseNature: undefined,
              invcType: undefined,
              billingPeriod: undefined,
              invcCycle: undefined,
              // repaymentSituation: undefined,
              // industryReputation: undefined,
              // litigation: undefined,
              // industryExperience: undefined,
              // registeredCapital: undefined,
              // businessScale: undefined,
              // salesChannels: undefined,
              // paymentWay: undefined,
              // suitability: undefined,
            };
            break;
          case 30:
            this.form = {
              diliMaintainerId: undefined,
              companyId: undefined,
              diliMaintainer: "",
              rawMaterials: undefined,
              monthlyCooperationScale: undefined,
              establishedYears: undefined,
              enterpriseNature: undefined,
              invcType: undefined,
              billingPeriod: undefined,
              invcCycle: undefined,
              repaymentSituation: undefined,
              industryReputation: undefined,
              litigation: undefined,
              industryExperience: undefined,
              registeredCapital: undefined,
              businessScale: undefined,
              salesChannels: undefined,
              paymentWay: undefined,
              suitability: undefined,
            };
            break;

          default:
            break;
        }
      }
      this.visible = true;
    },
  },
};
</script>

<style scoped lang="less">
/deep/.ant-form-item-label {
  line-height: 1;
}
/deep/.ant-form-item {
  margin-bottom: 0;
}
</style>