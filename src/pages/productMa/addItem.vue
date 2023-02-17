<template>
  <div style="padding: 10px">
    <!-- <a-modal
      centered
      v-model="visible"
      :title="setTitle"
      @ok="handleOk"
      :ok-button-props="{ props: { disabled: isShow } }"
      :cancel-button-props="{ props: { disabled: isShow } }"
      width="80%"
      destroyOnClose
      :maskClosable='false'
    > -->
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      :title="subTitle"
      @back="handleBack"
    />
    <a-form-model ref="itemForm" :model="itemForm" :rules="rules">
      <a-row :gutter="24">
        <a-col :span="4" v-if="titleText">
          <a-form-model-item label="商品编号" prop="itemCode" ref="itemCode">
            <a-input :disabled="true" v-model="itemForm.itemCode"> </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="4">
          <a-form-model-item label="商品名称" prop="itemName" ref="itemName">
            <a-input :disabled="isShow" v-model.trim="itemForm.itemName">
            </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="4">
          <a-form-model-item
            label="商品英文名称"
            prop="itemNameEnglish"
            ref="itemNameEnglish"
          >
            <a-input :disabled="isShow" v-model.trim="itemForm.itemNameEnglish">
            </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="4">
          <a-form-model-item label="运营主体" prop="partnerId" ref="partnerId">
            <a-select
              :disabled="isShow"
              v-model="itemForm.partnerId"
              @change="partnerChange"
            >
              <a-select-option v-for="item in tenantList" :key="item.id">
                {{ item.opName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="4">
          <a-form-model-item label="搜索关键词" prop="queryKey" ref="queryKey">
            <a-input :disabled="isShow" v-model="itemForm.queryKey"> </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="4">
          <a-form-model-item label="商品描述" prop="itemDesc" ref="itemDesc">
            <a-input :disabled="isShow" v-model="itemForm.itemDesc"> </a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="4">
          <a-form-model-item label="最小计量单位" prop="defUom" ref="defUom">
            <a-select
              v-model="itemForm.defUom"
              :disabled="isShow"
              @change="defUomChange"
              show-search
            >
              <a-select-option
                v-for="(item, index) in measureList"
                :key="index"
                :value="item.dicText"
              >
                {{ item.dicText }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>

        <a-col :span="4">
          <a-form-model-item
            label="商品类型"
            prop="itemTypeId"
            ref="itemTypeId"
          >
            <a-cascader
              v-model="itemForm.itemTypeId"
              :options="typeList"
              :field-names="{
                label: 'typeName',
                value: 'id',
                children: 'children',
              }"
              expand-trigger="hover"
              placeholder="请选择商品类型"
              @change="itemTypeChange"
              :disabled="isShow"
              change-on-select
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="4">
          <a-form-model-item label="商品简称" prop="shortName" ref="shortName">
            <a-input :disabled="isShow" v-model="itemForm.shortName"> </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="4">
          <a-form-model-item label="商品条码" prop="barcode" ref="barcode">
            <a-input :disabled="isShow" v-model="itemForm.barcode"> </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="4">
          <a-form-model-item label="商品等级" prop="itemLevel" ref="itemLevel">
            <a-input placeholder="如有多个等级，请用中文逗号隔开" :disabled="isShow" v-model="itemForm.itemLevel"> </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="4">
          <a-form-model-item
            label="起订量"
            prop="minimumQuantity"
            ref="minimumQuantity"
          >
            <a-input :disabled="isShow" v-model="itemForm.minimumQuantity">
            </a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="3">
          <a-form-model-item
            label="原产国"
            prop="countryOrigin"
            ref="countryOrigin"
          >
            <a-select
              mode="multiple"
              @change="countryChange"
              v-model="itemForm.countryOrigin"
              :disabled="isShow"
              allowClear
              show-search
            >
              <a-select-option
                v-for="(item, index) in countryList"
                :value="item.dicText"
                :key="index"
              >
                {{ item.dicText }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="3" v-if="countryOriginFlag">
          <a-form-model-item label="省份">
            <a-select
              :disabled="isShow"
              @change="provinceChange"
              v-model="province"
              allowClear
            >
              <a-select-option
                v-for="(item, index) in provinceData"
                :key="index"
                :value="item.id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="3" v-if="countryOriginFlag">
          <a-form-model-item label="市">
            <a-select
              :disabled="isShow"
              @change="cityChange"
              v-model="city"
              allowClear
            >
              <a-select-option
                v-for="(item, index) in cityData"
                :key="index"
                :value="item.id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="3" v-if="countryOriginFlag">
          <a-form-model-item label="区县">
            <a-select
              :disabled="isShow"
              v-model="district"
              @change="districtChange"
              allowClear
            >
              <a-select-option
                v-for="(item, index) in districtData"
                :key="index"
                :value="item.id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <!-- <a-col :span="4"> </a-col> -->

        <a-col :span="4">
          <a-form-model-item
            label="是否上架"
            prop="groundingState"
            ref="groundingState"
          >
            <a-radio-group
              v-model="itemForm.groundingState"
              name="radioGroup"
              :disabled="isShow"
            >
              <a-radio :value="1"> 已上架 </a-radio>
              <a-radio :value="2"> 已下架 </a-radio>
            </a-radio-group>
          </a-form-model-item>
        </a-col>
        <a-col :span="4">
          <a-form-model-item
            label="是否分拣"
            prop="sortingState"
            ref="sortingState"
          >
            <a-radio-group
              :disabled="isShow"
              name="radioGroup"
              v-model="itemForm.sortingState"
            >
              <a-radio :value="0"> 分拣 </a-radio>
              <a-radio :value="1"> 不分拣 </a-radio>
            </a-radio-group>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="3">
          <a-form-model-item label="商品包装">
            <a-button
              :disabled="isShow"
              type="primary"
              icon="plus"
              @click="openPackage"
              >{{ packageData.length > 0 ? "重新选择" : "请选择" }}</a-button
            >
          </a-form-model-item>
        </a-col>
        <a-col :span="3">
          <a-form-model-item label="销项税率(%)" prop="outputTaxRate">
            <a-input
              v-model="itemForm.outputTaxRate"
              v-number
              :disabled="isShow"
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="6">
          <!-- <a-form-model-item label="品牌" prop="brand" ref="brand">
            <a-input :disabled="isShow" v-model="itemForm.brand"> </a-input>
          </a-form-model-item> -->
          <a-form-model-item label="品牌">
            <a-select
              mode="multiple"
              style="width: 100%"
              placeholder=""
              @search="brandSearch"
              @change="brandChange"
              :disabled="isShow"
              v-model="itemForm.itemBrandIdList"
              :filter-option="filterOption"
            >
              <!-- :filter-option="filterOption" -->
              <div slot="notFoundContent" slot-scope="menu">
                <v-nodes :vnodes="menu" />
                <a-divider style="margin: 4px 0" />

                <div
                  style="padding: 4px 8px; cursor: pointer; display: flex"
                  @mousedown="(e) => e.preventDefault()"
                >
                  <span>暂无该品牌</span>
                  <a-button
                    type="primary"
                    size="small"
                    @click="addBrand"
                    style="margin-left: 20px"
                    >点击创建新品牌</a-button
                  >
                </div>
              </div>
              <a-select-option
                v-for="(i, index) in filteredOptionsBrand"
                :key="index"
                :value="i.id"
              >
                {{ i.brandName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="品种">
            <a-input placeholder="如有多个品种，请用中文逗号隔开" v-model="itemForm.varieties"></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-model-item label="规格">
            <a-select
              mode="multiple"
              style="width: 100%"
              placeholder="请先选择计量单位"
              @change="specChange"
              @search="specSearch"
              :disabled="isShow || !itemForm.defUom"
              v-model="specId"
              :filter-option="filterOption"
            >
              <div slot="notFoundContent" slot-scope="menu">
                <v-nodes :vnodes="menu" />
                <a-divider style="margin: 4px 0" />

                <div
                  style="padding: 4px 8px; cursor: pointer; display: flex"
                  @mousedown="(e) => e.preventDefault()"
                >
                  <span>暂无该规格</span>
                  <a-button
                    type="primary"
                    size="small"
                    @click="showSpecAdd"
                    style="margin-left: 20px"
                    >点击创建新规格</a-button
                  >
                </div>
              </div>
              <a-select-option
                v-for="(i, index) in filteredOptions"
                :key="index"
                :value="i.id"
              >
                {{ i.specName
                }}{{ i.amount && i.defUom ? `--(${i.amount}${i.defUom})` : "" }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="4" v-if="itemForm.itemFlag == 2">
          <a-form-model-item label="生产线"
            ><a-select
              style="width: 100%"
              :disabled="isShow"
              v-model="itemForm.itemProductionLine"
              allowClear
              ><a-select-option
                :value="item.dicText"
                v-for="(item, index) in lineList"
                :key="index"
                >{{ item.dicText }}</a-select-option
              ></a-select
            ></a-form-model-item
          >
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-model-item label="商品介绍内容">
            <div class="editor">
              <editor
                ref="wangeditor"
                :option="option"
                v-model="itemForm.itemIntroduce"
              ></editor>
            </div>
          </a-form-model-item>
        </a-col>
        <a-col :span="16">
          <a-form-model-item label="上传单据">
            <div class="flex-fs uploadbox">
              <div v-if="uploadUrls.length > 0" class="flex-fs imgWrap">
                <div
                  class="uploadImgs"
                  v-for="(item, index) in uploadUrls"
                  :key="index"
                >
                  <span class="imgDelete" @click="deleteUploads(item, index)">
                    <a-icon type="close" />
                  </span>
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
                      <!-- <a-icon
                          v-else-if="item.type.includes('do')"
                          type="file-word"
                        />
                        <a-icon
                          v-else-if="item.type.includes('sheet')"
                          type="file-excel"
                        />
                        <a-icon v-else type="file-excel" /> -->
                    </p>
                    {{ item.name }}
                  </div>
                </div>
              </div>
              <a-upload :before-upload="beforeUpload" :showUploadList="false">
                <div
                  class="uploadImgIcon flex-ct"
                  v-if="uploadUrls.length < 21"
                >
                  <a-icon type="plus" />
                </div>
              </a-upload>
              <ImageEdit
                :imgList="previewImageList"
                :filePreviewShow="previewVisible"
                @close="handleCancelPreviewImage"
              />
            </div>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="3">
          <a-form-model-item label="供应商">
            <a-button
              :disabled="isShow"
              type="primary"
              icon="plus"
              @click="supplierAdd"
              >添加供应商</a-button
            >
          </a-form-model-item></a-col
        >
        <a-col :span="3">
          <a-form-model-item label="进项税率(%)" prop="inputTaxRate">
            <a-input
              v-model="itemForm.inputTaxRate"
              v-number
              :disabled="isShow"
            ></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row
        :gutter="24"
        v-for="(item, index) in itemForm.supplierProp"
        :key="index"
        type="flex"
      >
        <a-form-model-item
          label="供货供应商"
          :prop="'supplierProp.' + index + '.supplierId'"
          style="margin-left: 12px"
        >
          <a-select
            :disabled="isShow"
            v-model="item.supplierId"
            style="width: 220px"
          >
            <a-select-option v-for="v in supplierList" :key="v.id">
              {{ v.partnerName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          label="供货占比(%)"
          :prop="'supplierProp.' + index + '.prop'"
          style="margin-left: 20px"
          :rules="[
            {
              pattern: '^(\\d|[1-9]\\d|100)$',
              message: '请输入0-100之间的数字',
            },
          ]"
        >
          <a-input
            v-number
            :disabled="isShow"
            v-model="item.prop"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="进项税率(%)"
          :prop="'supplierProp.' + index + '.inputTaxRate'"
          style="margin-left: 20px"
          :disabled="isShow"
          :rules="[
            {
              pattern: '^(\\d|[1-9]\\d|100)$',
              message: '请输入0-100之间的数字',
            },
          ]"
        >
          <a-input
            :disabled="isShow"
            v-model="item.inputTaxRate"
            v-number
          ></a-input>
        </a-form-model-item>
        <!-- </a-col> -->
        <a-form-model-item>
          <a-button
            type="primary"
            icon="minus"
            @click="removeSupplier(item)"
            style="margin-top: 42px; margin-left: 4px"
            :disabled="isShow"
          ></a-button>
        </a-form-model-item>
      </a-row>
      <!-- </a-row> -->
      <a-row :gutter="24">
        <a-col :span="4">
          <a-form-model-item
            label="所属部门"
            prop="subordinatDepartments"
            ref="subordinatDepartments"
          >
            <a-select
              :disabled="isShow"
              v-model="itemForm.subordinatDepartments"
            >
              <a-select-option v-for="item in tenantList" :key="item.opName">
                {{ item.opName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-model-item label="备注">
            <a-input
              :disabled="isShow"
              type="textarea"
              v-model="itemForm.remark"
              placeholder=""
            >
            </a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>

    <!-- 包装选择 -->
    <a-modal
      title="包装选择"
      :visible="packageVisible"
      :width="700"
      @cancel="handleCancelPackage"
      :dialogStyle="{
        top: '160px',
      }"
      destroyOnClose
    >
      <div class="details">
        <div class="table">
          <p class="table-title flex-sb">
            <span>包装列表</span>
            <span>
              <a-select
                ref="addPackageSelect"
                mode="multiple"
                v-model="valueSelectPackage"
                size="small"
                show-search
                placeholder="请选择包装"
                option-filter-prop="children"
                style="width: 200px; margin-right: 6px"
                :filter-option="filterOption"
                @change="chooseSelectPackage"
              >
                <div slot="dropdownRender" slot-scope="menu">
                  <v-nodes :vnodes="menu" />
                  <a-divider style="margin: 4px 0" />
                  <div
                    style="padding: 4px 8px; cursor: pointer"
                    @mousedown="(e) => e.preventDefault()"
                  >
                    <a-button type="primary" size="small" @click="addPackage"
                      >确认</a-button
                    >
                  </div>
                </div>
                <a-select-option
                  v-for="item in packageListData"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.packName }}
                </a-select-option>
              </a-select>
            </span>
          </p>
          <div class="table-data">
            <a-table
              rowKey="packCode"
              :pagination="false"
              :columns="packageColumns"
              :data-source="packageData"
              :scroll="{ y: 200 }"
            >
              <!-- <span slot="PQTitle" class="table-formva"> 包装数量</span> -->
              <span slot="del" slot-scope="text, record, index">
                <a-popconfirm
                  title="确定要删除这条数据吗?"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="delPackageOne(record, index)"
                  @cancel="cancel"
                >
                  <a-button type="link"> 删除 </a-button>
                </a-popconfirm>
              </span>
              <span slot="packUnitPrice" slot-scope="text, record">
                <span>{{ record.unitPrice }}</span>
              </span>
              <span slot="packUnitWeight" slot-scope="text, record">
                <span>{{ record.unitWeight / 1000 }}</span>
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
    <!-- 规格新增 -->
    <a-modal
      title="规格新增"
      :visible="specVisible"
      :width="600"
      destroyOnClose
      :maskClosable="false"
      @cancel="specCancel"
    >
      <a-form-model :model="specForm" :rules="specRules">
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-model-item label="规格名称" prop="specName">
              <a-input v-model.trim="specForm.specName"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="数量">
              <a-input v-model.trim="specForm.amount"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="单位">
              <a-select v-model="specForm.defUom">
                <a-select-option
                  v-for="(item, index) in measureList"
                  :key="index"
                  :value="item.dicText"
                >
                  {{ item.dicText }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="描述">
              <a-input
                type="textarea"
                v-model.trim="specForm.description"
              ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <template slot="footer">
        <div>
          <a-button type="primary" @click="addSpec">新增</a-button>
        </div>
      </template>
    </a-modal>
    <!-- <template slot="footer"> -->
    <div
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
        <a-button @click="handleBack">返回列表</a-button>
        <a-button type="primary" :loading="confirmLoading" @click="handleOk"
          >确定</a-button
        >
      </a-space>
    </div>
    <!-- </template> -->
    <!-- </a-modal> -->
  </div>
</template>
<script>
const packageColumns = [
  {
    dataIndex: "del",
    title: "操作",
    width: 100,
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
    title: "包装价格(元)",
    dataIndex: "packUnitPrice",
    width: 110,
    align: "center",
    scopedSlots: { customRender: "packUnitPrice" },
  },
  {
    dataIndex: "packUnitWeight",
    title: "包装单重",
    width: 100,
    align: "center",
    scopedSlots: { customRender: "packUnitWeight" },
  },
];
import axios from "axios";
import Editor from "../../components/editor/Editor.vue";
import { packList } from "../../services/purchaseSaleInventory";
import {
  provinceData,
  cityData,
  measure,
  listSpec,
  packageList,
  itemInsert,
  itemUpdate,
  singleItem,
  addImg,
  // getImg,
  packData,
  uploadFiles,
  delUploadFiles,
  SpecAdd,
  ProductLine,
  BrandList,
  BrandInsert,
  ListSpecByUom,
} from "../../services/product/productList";
import { tenantQuery } from "../../services/roleMa";
import { partnerType } from "../../services/userMa";
import { findPid } from "../../utils/treeData";
import ImageEdit from "../../components/imageEdit/imageEdit.vue";
export default {
  components: {
    Editor,
    ImageEdit,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
  // components: { Editor, DynamicForm },
  data() {
    return {
      specRules: {
        specName: [
          { required: true, message: "规格名称为必填", trigger: "blur" },
        ],
      },
      specForm: {
        specName: "",
        amount: "",
        defUom: "",
        description: "",
      },
      countryList: [],
      isShow: false,
      //商品类型参数
      itemTypeList: {},
      //运营主体
      // itemForm: {},
      //预览图片
      previewImage: "",
      previewImageList: [],
      packageList: [],
      //包装
      // packageData,
      packageColumns,
      editingKey: "",
      selectedRowKeys: [],
      // 规格数组
      specList: [],
      specIdList: [],
      // 供应商数据
      supplierList: [],
      //
      packageModel: false,
      //部门
      tenantList: [],
      //计量单位数组
      measureList: [],
      previewVisible: false,
      //拼接
      tempPlaceId: "",
      tempPlaceName: "",
      // 区县
      districtData: [],
      district: "",
      districtId: "",
      //市级数据
      cityData: [],
      city: "",
      cityId: "",
      //省份数据
      provinceData: [],
      province: "",
      provinceId: "",
      // 图片
      fileList: [],
      uploadUrls: [],
      imgData: {
        type: "item",
        tableName: "item",
        mode: "batch",
      },
      //editor
      option: {
        height: 300,
      },
      itemIntroduce: "",
      visible: false,
      titleText: "",
      specId: [],
      // itemForm: this.$form.createForm(this, { name: "item_form" }),
      itemForm: {
        itemCode: "",
        itemDesc: "",
        itemName: "",
        itemNameEnglish: "",
        itemTypeId: [],
        itemIntroduce: "",
        itemLevel: "",
        brand: "",
        countryOrigin: ["中国"],
        defUom: "",
        groundingState: 2,
        orgId: "",
        placeOrigin: "",
        queryKey: "",
        remark: "",
        shortName: "",
        sortingState: 1,
        spec: "",
        subordinatDepartments: "",
        partnerId: [],
        inputTaxRate: "",
        outputTaxRate: "",
        supplierProp: [],
        itemBrandIdList: [],
      },
      rules: {
        outputTaxRate: [
          { pattern: "^(\\d|[1-9]\\d|100)$", message: "请输入0-100之间的数字" },
        ],
        inputTaxRate: [
          { pattern: "^(\\d|[1-9]\\d|100)$", message: "请输入0-100之间的数字" },
        ],
        itemName: [
          { required: true, message: "请填写商品名称", trigger: "blur" },
        ],
        partnerId: [
          { required: true, message: "请选择运营主体", trigger: "blur" },
        ],
        itemTypeId: [
          { required: true, message: "请选择商品类型", trigger: "blur" },
        ],
        countryOrigin: [
          { required: true, message: "请选择原产地", trigger: "blur" },
        ],
        defUom: [
          { required: true, message: "请选择计量单位", trigger: "blur" },
        ],
      },
      cityOptions: [],
      fileUrlList: [],
      ItemsObj: [],
      packageData: [],
      packageVisible: false,
      packageListValueData: [],
      valueSelectPackage: [],
      packageListData: [],
      specVisible: false,
      specAddValue: "",
      lineList: [],
      confirmLoading: false,
      typeList: [],
      subTitle: "",
      brandList: [],
    };
  },
  watch: {
    "itemForm.itemTypeId"(newVal, oldVal) {
      this.itemForm.itemTypeId = newVal;
      console.log(oldVal);
      if (this.itemForm.itemTypeId && this.itemForm.itemTypeId.length > 0) {
        this.$refs["itemForm"].fields.forEach((field) => {
          if (field.prop == "itemTypeId") {
            field.clearValidate();
          }
        });
      }
    },
  },
  activated() {
    let val, isShow, productType, typeId;
    if (Object.keys(this.$route.query).length) {
      val = this.$route.query.val;
      isShow = this.$route.query.isShow;
      productType = this.$route.query.productType;
      typeId = this.$route.query.typeId;
      this.typeList = this.$route.query.typeList;
    }
    console.log(this.$route.query);
    console.log(typeId);
    if (productType == 2) {
      this.getDic(15);
    }
    this.uploadUrls = [];
    this.specIdList = [];
    this.specId = [];
    this.titleText = val;
    this.isShow = isShow;
    this.getSpecList();
    if (isShow == true) {
      this.$nextTick(function () {
        this.$refs.wangeditor.toDisable();
      });
    }
    //新增
    if (val == 0) {
      this.itemForm = {
        itemCode: "",
        itemDesc: "",
        itemName: "",
        itemNameEnglish: "",
        itemTypeId: [],
        itemIntroduce: "<p><br></p>",
        itemLevel: "",
        brand: "",
        countryOrigin: ["中国"],
        defUom: "",
        groundingState: 2,
        orgId: localStorage.getItem("orgId") || "",
        placeOrigin: "",
        queryKey: "",
        remark: "",
        shortName: "",
        sortingState: 1,
        spec: "",
        subordinatDepartments: "",
        partnerId: "",
        inputTaxRate: "",
        outputTaxRate: "",
        supplierProp: [],
        itemFlag: productType,
        itemProductionLine: "",
        itemBrandIdList: [],
      };

      this.province = "";
      this.city = "";
      this.district = "";
      this.packageData = [];
      if (typeId) {
        let nodes = findPid(this.typeList, typeId.id);
        this.itemForm.itemTypeId = nodes || [];
        this.itemTypeList.itemType = typeId.typeName || "";
        this.itemTypeList.itemTypeCode = typeId.typeCode || "";
        this.itemTypeList.itemTypeId = typeId.id || "";
      }
    }
    //修改
    if (val != 0) {
      singleItem({ id: val.id }).then((res) => {
        const data = res.data.data;
        if (res.data.code == 200) {
          let item = res.data.data.item;

          this.itemForm = {
            inputTaxRate: item.inputTaxRate,
            outputTaxRate: item.outputTaxRate,
            id: item.id,
            partnerId: res.data.data.partnerId,
            itemCode: item.itemCode,
            itemName: item.itemName,
            itemNameEnglish: item.itemNameEnglish,
            itemLevel: item.itemLevel,
            itemDesc: item.itemDesc,
            itemIntroduce: item.itemIntroduce,
            defUom: item.defUom,
            remark: item.remark,
            queryKey: item.queryKey,
            countryOrigin: item.countryOrigin.split(',') || ["中国"],
            varieties: item.varieties,
            minimumQuantity: item.minimumQuantity,
            groundingState: item.groundingState,
            shortName: item.shortName,
            // status: item.status,
            barcode: item.barcode,
            brand: item.brand,
            subordinatDepartments: item.subordinatDepartments,
            sortingState: item.sortingState,
            supplierProp: item.supplierProp
              ? JSON.parse(item.supplierProp)
              : [],
            itemFlag: item.itemFlag || productType,
            itemProductionLine: item.itemProductionLine || "",
            itemBrandIdList: [],
          };
          if (this.itemForm.defUom) {
            this.getDefUom(this.itemForm.defUom);
          } else {
            this.getDefUom();
          }
          this.specId = res.data.data.specIdList;
          if (item.itemTypeId) {
            let nodes = findPid(this.typeList, item.itemTypeId);
            this.itemForm.itemTypeId = nodes || [];
          }
          this.itemTypeList.itemType = item.itemType || "";
          this.itemTypeList.itemTypeCode = item.itemTypeCode || "";
          this.itemTypeList.itemTypeId = item.itemTypeId || "";
          this.itemForm.orgId = res.data.data.orgId;
          this.itemForm.partnerCode = res.data.data.partnerCode;
          this.itemForm.partnerId = res.data.data.partnerId;
          this.itemForm.partnerName = res.data.data.partnerName;
          if (item.countryOrigin) {
            this.getProvince();
          }
          if (item.placeOrigin) {
            let tempPlaceStr = item.placeOrigin.substring(
              item.placeOrigin.lastIndexOf(":") + 1
            );
            let tempIdStr = item.placeOrigin.substring(
              0,
              item.placeOrigin.lastIndexOf(":")
            );
            let tempPlace = tempPlaceStr.split("/");
            let tempPlaceId = tempIdStr.split("/");
            this.province = tempPlace[0] ? tempPlace[0] : "";
            this.city = tempPlace[1] ? tempPlace[1] : "";
            this.district = tempPlace[2] ? tempPlace[2] : "";
            if (tempPlaceId[0]) {
              this.getCity(tempPlaceId[0], true);
            }
            if (tempPlaceId[1]) {
              this.getCity(tempPlaceId[1], false);
            }
          }
          if (item.packList) {
            this.packageData = item.packList;
          }
          if (data.itemBrandRefDtoList && data.itemBrandRefDtoList.length > 0) {
            data.itemBrandRefDtoList.forEach((item) => {
              this.itemForm.itemBrandIdList.push(item.brandId);
            });
          }
          console.log(this.itemForm.itemBrandIdList);
          axios({
            method: "post",
            url: "/uploadFile/getUploadList.action",
            data: { tableId: item.id, tableName: "item" },
            transformRequest: [
              function (data) {
                let ret = "";
                for (let it in data) {
                  ret +=
                    encodeURIComponent(it) +
                    "=" +
                    encodeURIComponent(data[it]) +
                    "&";
                }
                ret = ret.substring(0, ret.lastIndexOf("&"));
                return ret;
              },
            ],
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }).then((imgres) => {
            if (imgres.data.code == 200 && imgres.data.data.length > 0) {
              this.fileList = [];
              this.uploadUrls = [];
              let filetemp = [];
              imgres.data.data.forEach((item) => {
                filetemp.push({ ...JSON.parse(item.filePath), id: item.id });
              });
              this.uploadUrls = filetemp;
            }
          });
        }
      });
      this.getPackData(val.id);
    }
    //标题
    switch (productType) {
      case 1:
        this.subTitle = isShow
          ? "基础商品详情"
          : val
          ? "基础商品编辑"
          : "基础商品新增";

        break;
      case 2:
        this.subTitle = isShow
          ? "加工品详情"
          : val
          ? "加工品编辑"
          : "加工品新增";
        break;

      default:
        break;
    }
    this.getList();
    this.getDic(12);
    this.getProvince();
    this.getMeasure();
    this.getBrandList("");
  },
  computed: {
    countryOriginFlag() {
      return this.itemForm.countryOrigin?.includes('中国')
    },
    filteredOptions() {
      return this.specList.filter((o) => !this.specId.includes(o));
    },
    filteredOptionsBrand() {
      return this.brandList.filter(
        (o) => !this.itemForm.itemBrandIdList.includes(o)
      );
    },
  },
  methods: {
    defUomChange(val) {
      if (val) {
        this.getDefUom(val);
      }
    },
    async getDefUom(val) {
      const data = await ListSpecByUom({ defUom: val });
      this.specList = data.data.data || [];
      console.log(data);
    },
    specCancel() {
      this.specVisible = false;
    },
    brandChange(val) {
      console.log(val);
      this.itemForm.itemBrandIdList;
    },
    brandSearch(value) {
      this.tempBrandName = value;
    },
    addBrand() {
      if (!this.tempBrandName) {
        this.$message.error("请填写新增品牌名称");
        return;
      }
      BrandInsert({
        brandName: this.tempBrandName,
      }).then((res) => {
        const data = res.data;
        if (data.code == 200) {
          this.$message.success(data.message);
          this.getBrandList();
        } else {
          this.$message.error(data.message);
        }
      });
    },
    getBrandList(value) {
      BrandList({ brandName: value }).then((res) => {
        const data = res.data;
        if (data.code === "200") {
          this.brandList = data.data;
        } else {
          this.$message.error(data.message);
        }
      });
    },
    specChange() {},
    handleBack() {
      this.$closePage(
        "/basicDataManagement/item/itemAdd",
        "/basicDataManagement/item/itemManagement"
      );
    },
    showSpecAdd() {
      this.specVisible = true;
      this.specForm.specName = this.specAddValue || "";
      this.specForm.defUom = this.itemForm.defUom || "";
    },
    addSpec() {
      SpecAdd({
        ...this.specForm,
      }).then((res) => {
        const data = res.data;
        if (data.code == 200) {
          this.$message.success(data.message);
          this.specVisible = false;
          this.specForm = {
            specName: "",
            amount: "",
            defUom: "",
            description: "",
          };
          this.getDefUom(this.itemForm.defUom);
        } else {
          this.$message.error(data.message);
        }
      });
    },
    handleCancelItem() {
      // this.visible = false;
    },
    getDic(type) {
      ProductLine({ type: type }).then((res) => {
        if (res.data.code == 200) {
          if (type == 15) {
            this.lineList = res.data.data || [];
          }
          if (type == 12) {
            this.countryList = res.data.data || [];
          }
        } else {
          this.$message.error(
            res.data.message ? res.data.message : "获取生产线数据失败"
          );
        }
      });
    },
    deleteUploads(item, index) {
      if (item.id) {
        let params = new FormData();
        params.append("id", item.id);
        delUploadFiles(params).then((res) => {
          if (res.data.code == 200) {
            this.$message.success("删除单据文件成功");
            this.uploadUrls.splice(index, 1);
          } else {
            this.$message.error(res.data.message);
          }
        });
      } else {
        this.uploadUrls.splice(index, 1);
      }
    },
    //!-----------------------------------------------------
    downloadFile(url) {
      let labelA = document.createElement("a");
      labelA.href = url;
      labelA.click();
    },
    preView(url) {
      this.previewImageList = [];
      this.previewImage = url;
      if (this.uploadUrls.length > 0) {
        this.uploadUrls.forEach((item) => {
          this.previewImageList.push(item.url);
        });
      } else {
        this.previewImageList.push(url);
      }
      this.previewVisible = true;
    },
    handleCancelPreviewImage() {
      this.previewImage = undefined;
      this.previewImageList = [];
      this.previewVisible = false;
    },
    beforeUpload(file) {
      let params = new FormData();
      params.append("file", file);
      params.append("mode", "batch");
      params.append("type", "item");
      params.append("tableName", "item");
      uploadFiles(params).then((res) => {
        if (res.data.code === "200") {
          let uploadFiles = {
            type: res.data.data[0].fileType,
            name: res.data.data[0].fileName,
            url: res.data.data[0].filePath,
            state: res.data.data[0].fileState,
          };

          if (this.titleText != 0) {
            addImg({
              fileUrlList: uploadFiles,
              tableId: this.itemForm.id,
              tableName: "item",
            }).then((imgres) => {
              if (imgres.data.code == 200) {
                this.$message.success("上传单据文件成功");
                this.uploadUrls.push(uploadFiles);
              } else {
                this.$message.error(imgres.data.message);
              }
            });
          } else {
            this.uploadUrls.push(uploadFiles);
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //包装选择
    cancel() {
      this.$message.error("取消");
    },
    openPackage() {
      this.getPackageList();
      // this.ItemsObj = row;
      // this.packageData = JSON.parse(JSON.stringify(row.pkgDetails));
      this.packageVisible = true;
    },
    //包装删除行
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
    //包装规格选择
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
    handleCancelPackage() {
      this.packageVisible = false;
    },
    handleSubmitPackage() {
      this.packageVisible = false;
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
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    //已保存的包装列表
    getPackData(id) {
      console.log(11);
      packData({ itemId: id }).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          this.packageData = res.data.data;
        }
      });
    },
    // //添加供应商
    supplierAdd() {
      console.log(this.itemForm.supplierProp);
      this.itemForm.supplierProp.push({
        supplierId: "",
        prop: "",
        inputTaxRate: "",
      });
    },
    //供应商删除按钮
    removeSupplier(item) {
      let index = this.itemForm.supplierProp.indexOf(item);
      if (index !== -1) {
        this.itemForm.supplierProp.splice(index, 1);
      }
    },
    //运营主体
    partnerChange(value) {
      console.log(value);
      this.tenantList.forEach((v) => {
        if (value == v.id) {
          this.itemForm.orgId = v.orgId;
          this.itemForm.partnerCode = v.opCode;
          this.itemForm.partnerId = v.id;
          this.itemForm.partnerName = v.opName;
        }
      });
      // console.log(this.itemForm);
    },

    specSearch(value) {
      this.specAddValue = value;
    },
    packageBtn() {
      this.packageModel = true;
      packageList().then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          let packagetemp = [...res.data.data];
          packagetemp.forEach((item) => {
            // item.unitPrice = item.unitPrice / 100;
            item.unitWeight = item.unitWeight / 1000;
          });
          this.packageList = packagetemp;
        }
      });
    },
    packageConfirm(e) {
      console.log(e);
      this.packageModel = false;
    },
    getList() {
      //部门/运营主体
      tenantQuery().then((res) => {
        if (res.data.code == 200) {
          console.log(res);
          this.tenantList = res.data.data;
          console.log(this.tenantList);
          this.tenantList.forEach((item) => {
            if (this.itemForm.orgId == item.orgId) {
              this.itemForm.partnerId = item.id;
              this.itemForm.partnerName = item.opName;
              this.itemForm.partnerCode = item.opCode;
            }
          });
        }
      });
      //供应商
      partnerType({ partnerType: 30, isEnable: 1 }).then((pres) => {
        if (pres.data.code == 200) {
          this.supplierList = pres.data.data;
        }
      });

      //商品包装list
    },
    //获取规格数据
    getSpecList() {
      //商品规格
      listSpec().then((Lres) => {
        this.specList = Lres.data;
      });
    },
    //计量单位数据
    getMeasure() {
      measure().then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          this.measureList = res.data.data;
        }
      });
    },
    //商品类型级联
    itemTypeChange(value, selectedOptions) {
      console.log(value);
      console.log(selectedOptions);
      this.itemForm.itemTypeId = value;
      if (selectedOptions && selectedOptions.length > 0) {
        let key = selectedOptions.length - 1;
        this.itemTypeList.itemType = selectedOptions[key].typeName;
        this.itemTypeList.itemTypeCode = selectedOptions[key].typeCode;
        this.itemTypeList.itemTypeId = selectedOptions[key].id;
        console.log(this.itemTypeList);
      }
      console.log(this.itemForm.itemTypeId);
      this.$forceUpdate();
    },
    displayRender({ labels }) {
      return labels[labels.length - 1];
    },

    districtChange(val) {
      console.log(val);
      this.districtId = val.toString();
      this.districtData.forEach((item) => {
        if (item.id == val) {
          this.district = item.name;
        }
      });
      if (this.tempPlaceId) {
        this.tempPlaceId = this.tempPlaceId + "/" + this.districtId;
        this.tempPlaceName = this.tempPlaceName + "/" + this.district;
      }
      console.log(this.tempPlaceId);
      console.log(this.tempPlaceName);
    },
    cityChange(val) {
      this.district = "";
      this.cityId = val.toString();
      this.cityData.forEach((item) => {
        if (item.id == val) {
          this.city = item.name;
        }
      });
      if (this.tempPlaceId) {
        this.tempPlaceId = this.tempPlaceId + "/" + this.cityId;
        this.tempPlaceName = this.tempPlaceName + "/" + this.city;
      }
      this.districtData = [];
      console.log(val);
      if (val) {
        this.getCity(val, false);
      }
    },
    //省份选择
    provinceChange(val) {
      console.log(val);
      this.city = "";
      this.district = "";
      this.provinceId = val.toString();
      this.provinceData.forEach((item) => {
        if (item.id == val) {
          this.province = item.name;
        }
      });
      this.tempPlaceId = this.provinceId;
      this.tempPlaceName = this.province;
      this.cityData = [];
      if (val) {
        this.getCity(val, true);
      }
    },
    //国家选择
    countryChange(value) {
      console.log(value);
      if (value.includes("中国")) {
        this.getProvince();
      } else {
        this.provinceData = [];
      }
    },
    //省份数据
    getProvince() {
      provinceData().then((res) => {
        if (res.data.code == 200) {
          this.provinceData = res.data.data.data;
          console.log(res);
        }
      });
    },
    //城市,区县数据
    getCity(val, isCity) {
      if (isCity) {
        cityData({ parentId: val }).then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            this.cityData = res.data.data.data;
          }
        });
      }
      if (!isCity) {
        cityData({ parentId: val }).then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            this.districtData = res.data.data.data;
          }
        });
      }
    },

    //表单提交
    handleOk() {
      this.$refs.itemForm.validate((valid) => {
        if (valid) {
          //供应商
          if (this.itemForm.supplierProp.length > 0) {
            let totalNum = 0;
            this.itemForm.supplierProp.forEach((v) => {
              totalNum += Number(v.prop);
            });
            if (totalNum != 100) {
              this.$message.error("供应商供货占比之和应为100%");
              return;
            }
          }
          //运营主体
          //商品类型
          let typeTemp = JSON.parse(JSON.stringify(this.itemTypeList));
          this.itemForm.itemType = typeTemp.itemType;
          this.itemForm.itemTypeCode = typeTemp.itemTypeCode;
          // this.itemForm.itemTypeId = typeTemp.itemTypeId;
          //包装数组
          if (this.packageData.length > 0) {
            this.itemForm.packList = this.packageData;
          }
          //规格
          // this.itemForm.spec = "";
          this.itemForm.specIdList = this.specId;
          //省市区
          this.itemForm.placeOrigin =
            this.tempPlaceId + ":" + this.tempPlaceName;
          //表单新增
          if (this.titleText == 0) {
            this.confirmLoading = true;
            let temp = JSON.parse(JSON.stringify(this.itemForm));
            temp.itemTypeId = this.itemTypeList.itemTypeId;
            temp.countryOrigin = temp.countryOrigin.join(',')
            itemInsert(temp).then((res) => {
              console.log(res);
              this.confirmLoading = false;
              if (res.data.code == 200) {
                this.$message.success(
                  res.data.message == "OK" ? "新增商品成功" : res.data.message
                );
                addImg({
                  fileUrlList: this.uploadUrls,
                  tableId: res.data.data.id,
                  tableName: "item",
                }).then((imgres) => {
                  console.log(imgres);
                });
                this.handleBack();
                // this.$parent.getList();
                // this.visible = false;
              } else {
                this.$message.error(
                  res.data.message ? res.data.message : "新增商品失败"
                );
                console.log(this.itemTypeList);
              }
            });
          }
          if (this.titleText != 0) {
            console.log(this.itemForm);
            this.confirmLoading = true;
            let temp = JSON.parse(JSON.stringify(this.itemForm));
            temp.itemTypeId = this.itemTypeList.itemTypeId;
            temp.countryOrigin = temp.countryOrigin.join(',')
            itemUpdate(temp).then((res) => {
              console.log(res);
              this.confirmLoading = false;
              if (res.data.code == 200) {
                this.$message.success(
                  res.data.message == "OK" ? "修改信息成功" : res.data.message
                );
                this.handleBack();
                // this.visible = false;
                // this.$parent.getList();
                console.log(this.uploadUrls);
              } else {
                this.$message.error(
                  res.data.message ? res.data.message : "修改信息失败"
                );
              }
            });
          }
        } else {
          // this.$message.warning("存在必填项为空请核对");
          this.$warning({
            title: "存在必填项为空请核对",
            // content: 'some messages...some messages...',
          });
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
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
<style >
.w-e-menu {
  z-index: 2 !important;
}
.w-e-text-container {
  z-index: 1 !important;
}
.w-e-toolbar {
  z-index: 1 !important;
}
</style>