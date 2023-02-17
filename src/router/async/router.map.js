// 视图组件
const view = {
  tabs: () => import('@/layouts/tabs'),
  blank: () => import('@/layouts/BlankView'),
  page: () => import('@/layouts/PageView')
}

// 路由组件注册
const routerMap = {
  busLogin: {
    path: '/busLogin',
    name: '登录',
    component: () => import('@/pages/busLogin')
  },
  demo: {
    name: '演示页',
    renderMenu: false,
    component: () => import('@/pages/demo')
  },
  exp403: {
    authority: '*',
    name: 'exp403',
    path: '403',
    component: () => import('@/pages/exception/403')
  },
  exp404: {
    name: 'exp404',
    path: '404',
    component: () => import('@/pages/exception/404')
  },
  exp500: {
    name: 'exp500',
    path: '500',
    component: () => import('@/pages/exception/500')
  },

  root: {
    path: '/',
    name: '首页',
    redirect: 'busLogin',
    component: view.tabs,

  },
  dashboard: {
    path: '',
    name: '首页',
    // redirect: 'busLogin',
    component: view.blank,

  },
  //dashboard
  quick: {
    path: "",
    name: '快捷菜单',
    component: () => import('@/pages/frontPage'),
    // icon: 'thunderbolt'
  },
  // productMa: {
  //   path: "",
  //   name: '商品管理列表测试',
  //   component: () => import('@/pages/productMa')
  // },
  specMa: {
    path: "",
    name: '商品规格管理测试',
    component: () => import('@/pages/productSpec')
  },
  // test: {
  //   path: "",
  //   name: '待开发',
  //   component: view.blank
  // },
  //平台管理
  stage: {
    path: "",
    name: '平台管理',
    component: view.blank
  },
  stageCenter: {
    path: "",
    name: '平台管理中心',
    component: view.blank,
    icon: 'home'
  },
  userManagement: {
    path: "",
    name: '用户管理',
    component: () => import('@/pages/userMa')
  },
  // userMa: {
  //   path: "",
  //   name: '用户管理',
  //   component: () => import('@/pages/userMa')
  // },
  // roleManagement: {
  //   path: "",
  //   name: '角色管理',
  //   component: () => import('@/pages/roleMa'),
  // },
  roleManagement: {
    path: "",
    name: '角色管理改',
    component: () => import('@/pages/role'),
  },
  businessEntity: {
    path: "",
    name: '经营主体',
    component: () => import('@/pages/businessEntity'),
  },
  // funAuthManagement: {
  //   path: "",
  //   name: '功能权限管理',
  //   component: () => import('@/pages/funauth'),
  // },
  funAuthManagement: {
    path: "",
    name: '功能权限管理',
    component: () => import('@/pages/functionalAuthority'),
  },
  // tenantManagement: {
  //   path: "",
  //   name: '租户管理',
  //   component: () => import('@/pages/tenant'),
  // },
  tenantManagement: {
    path: "",
    name: '租户管理',
    component: () => import('@/pages/tenantManagement'),
  },
  tenantOrganization: {
    path: "",
    name: '租户组织架构',
    component: () => import('@/pages/tenantOrganization'),
  },

  //----------------------------------------
  //基础数据管理模块----------------------------
  basicDataManagement: {
    path: "",
    name: '基础数据管理',
    component: view.blank
  },
  dataDictionary: {
    path: "",
    name: "数据字典",
    component: view.blank,
    icon: 'table'
  },
  dataSource: {
    path: "",
    name: "数据源",
    component: () => import('@/pages/dataSource'),
  },
  riskMa: {
    path: "",
    name: "风控中心",
    component: view.blank
  },
  scoreCard: {
    path: "",
    name: "评分卡",
    component: view.blank,
    icon: 'tags'
  },
  scoreModel: {
    path: "",
    name: "评分模型",
    component: () => import('@/pages/scoreModel'),
  },
  scoreResult: {
    path: "",
    name: "评分结果",
    component: () => import('@/pages/scoreResult'),
  },
  item: {
    path: "",
    name: "商品",
    component: view.blank,
    icon: 'shopping'
  },
  itemManagement: {
    path: "",
    name: "商品管理列表",
    component: () => import('@/pages/productMa'),
  },
  itemAdd: {
    path: "",
    name: "商品",
    component: () => import('@/pages/productMa/addItem.vue'),
    renderMenu: false,
    meta: {
      invisible: true
    }
  },
  itemSpec: {
    path: "",
    name: "商品规格管理",
    component: () => import('@/pages/ProductSpecifications'),
  },
  partnerMenu: {
    path: "",
    name: "客户",
    component: view.blank,
    icon: 'smile'
  },
  partnerSpec: {
    path: '',
    name: "客户管理列表",
    component: () => import('@/pages/customerManageList'),
  },
  storeMenu: {
    path: "",
    name: "客户门店",
    component: view.blank,
    icon: 'team'
  },
  // storeSpec: {
  //   path: '',
  //   name: "客户门店管理列表",
  //   component: () => import('@/pages/iframeBox'),
  // },
  storeSpec: {
    path: '',
    name: "新客户门店管理列表",
    component: () => import('@/pages/customerStoreManageList/customerStoreManageList')
  },
  rate: {
    path: "",
    name: "税率",
    component: view.blank,
    icon: 'file-text'
  },
  outputRate: {
    path: '',
    name: "销项税率",
    component: () => import('@/pages/outputRate'),
  },
  addOutputRate: {
    path: '',
    renderMenu: false,
    name: "新增销项税率",
    component: () => import('@/pages/addOutputRate'),
    meta: {
      invisible: true,
    },
  },
  customerRate: {
    path: '',
    name: "客户适配税率",
    component: () => import('@/pages/customerRate'),
  },
  chooseRate: {
    path: '',
    name: "配置规则",
    component: () => import('@/pages/chooseRate'),
    meta: {
      invisible: true,
    },
  },
  inputRate: {
    path: '',
    name: "进项税率",
    component: () => import('@/pages/inputRate'),
  },
  supplierRate: {
    path: '',
    name: "供应商税率",
    component: () => import('@/pages/supplierRate'),
  },
  supplierMenu: {
    path: "",
    name: "供应商",
    component: view.blank,
    icon: 'robot'
  },
  supplierSpec: {
    path: '',
    name: "供应商管理列表",
    component: () => import('@/pages/supplierManagerList'),
  },
  serviceProvider: {
    path: "",
    name: "服务商",
    component: view.blank,
    icon: 'global'
  },
  agency: {
    path: '',
    name: "代理公司管理",
    component: () => import('@/pages/supplierManagerList'),
  },
  enterSaleStore: {
    path: "",
    name: "进销存管理",
    component: view.blank
  },
  //销售模块路由
  sale: {
    path: "",
    name: "销售",
    component: view.blank,
    icon: 'shopping-cart'
  },
  saleOrderAdd: {
    path: "",
    name: "销售订单录入",
    component: () => import('@/pages/stSalesOrder'),
  },
  overallOrderAdd: {
    path: "",
    name: "采销一体单录入",
    component: () => import('@/pages/iframeBox'),
  },
  orderList: {
    path: "",
    name: "销售订单列表",
    component: () => import('@/pages/salesOrder'),
  },
  orderDetail: {
    path: "",
    name: "销售订单明细",
    component: () => import('@/pages/saleOrderDetails'),
  },
  //采购
  purchase: {
    path: "",
    name: "采购",
    component: view.blank,
    icon: 'plus-circle'
  },
  requireOrder: {
    path: "",
    name: "采购需求",
    component: () => import('@/pages/purchaseNeed'),
  },
  requireOrderConfirm: {
    path: "",
    name: "采购需求单确认",
    component: () => import('@/pages/purchaseNeed/modalForm'),
    renderMenu: false,
    meta: {
      invisible: true
    }
  },
  purchaseOrderHead: {
    path: "",
    name: "采购订单列表",
    component: () => import('@/pages/purchaseOrder'),
  },
  purchaseOrderHeadAddEdit: {
    path: "",
    name: "采购订单页",
    component: () => import('@/pages/purchaseOrder/addAndEdit'),
    renderMenu: false,
    meta: {
      invisible: true
    }
  },
  purchaseOrderDetail: {
    path: "",
    name: "采购订单明细",
    component: () => import('@/pages/purchaseOrderDetails'),
  },
  //库存
  store: {
    path: "",
    name: "库存",
    component: view.blank,
    icon: 'check-circle'
  },
  itemInvlot: {
    path: "",
    name: "商品库存查询",
    // component: () => import('@/pages/iframeBox'),
    component: () => import('@/pages/productStock'),
  },
  itemStore: {
    path: "",
    name: "商品入库查询",
    // component: () => import('@/pages/iframeBox'),
    component: () => import('@/pages/productInStock'),
  },
  itemDeliver: {
    path: "",
    name: "商品出库查询",
    // component: () => import('@/pages/iframeBox'),
    component: () => import('@/pages/productOutStock'),
  },
  inventoryDaily: {
    path: "",
    name: "商品期货库存",
    // component: () => import('@/pages/iframeBox'),
    component: () => import('@/pages/productFuturesStock'),
  },
  //----------------------------------------
  //运输管理模块------------------
  transport: {
    path: "",
    name: "运输管理",
    component: view.blank
  },
  pickUp: {
    path: "",
    name: "收货",
    component: view.blank,
    icon: 'user-add'
  },
  bankFlowNeedget: {
    name: "银行流水列表",
    path: "",
    component: () => import('@/pages/bankFlow'),
  },
  bankflowNeedpay: {
    name: "银行流水列表",
    path: "",
    component: () => import('@/pages/bankFlow'),
  },
  pickUpOrderList: {
    path: "",
    name: "待收货单列表",
    component: () => import('@/pages/pickUpOrderList'),
  },

  pickUpOrderPickUpRouter: {
    path: "",
    name: "收货录入",
    component: () => import('@/pages/pickUpOrderList/inputReceipt'),
    renderMenu: false,
    meta: {
      invisible: true
    }
  },
  pickUpOrderEnd: {
    path: "",
    name: "已收货单列表",
    component: () => import('@/pages/receivedList'),
  },
  receivedDetails: {
    path: "",
    name: "已收货明细",
    component: () => import('@/pages/receivedDetails'),
  },
  pickUpOrderApproval: {
    path: "",
    name: "审核列表",
    component: () => import('@/pages/iframeBox'),
  },
  signed: {
    path: "",
    name: "签收",
    component: view.blank,
    icon: "diff"
  },
  waitForSigned: {
    path: "",
    name: "待签收列表",
    component: () => import('@/pages/waitForSigned'),
  },
  waitForSignedNew: {
    path: "",
    name: "待签收订单",
    component: () => import('@/pages/waitForSigned/signed'),
    renderMenu: false,
    meta: {
      invisible: true
    }
  },
  signedList: {
    path: "",
    name: "已签收列表",
    component: () => import('@/pages/waitForSigned/signedList'),
  },
  signedDetails: {
    path: "",
    name: "已签收明细",
    component: () => import('@/pages/waitForSigned/signedDetails'),
  },
  obsoleteList: {
    path: "",
    name: "呆滞品列表",
    component: () => import('@/pages/iframeBox'),
  },
  returnedList: {
    path: "",
    name: "退货列表",
    component: () => import('@/pages/iframeBox'),
  },
  returnCommdityWaitInStock: {
    path: "",
    name: "退货待入库列表",
    component: () => import('@/pages/returnCommdityWaitInStock'),
  },
  returnSupplierCommdity: {
    path: "",
    name: "退供应商商品列表",
    component: () => import('@/pages/returnSupplierCommdity'),
  },
  //-------------------
  //结算管理路由
  balance: {
    name: "结算管理",
    path: "",
    component: view.blank
  },
  finance: {
    name: "财务",
    path: "",
    component: view.blank,
    icon: 'money-collect'
  },
  fundsApprove: {
    name: "资金审批",
    path: "",
    component: () => import('@/pages/iframeBox'),
  },
  receiveable: {
    name: "应收",
    path: "",
    component: view.blank,
    icon: 'plus-square'
  },
  receivableNoReconciliation: {
    name: "待对账列表",
    path: "",
    component: () => import('@/pages/ReToCheckFor'),
  },
  // toCheckFor: {
  //   name: "待对账列表",
  //   path: "",
  //   component: () => import('@/pages/ReToCheckFor'),
  // },
  receivableReconciliated: {
    name: "已对账列表",
    path: "",
    component: () => import('@/pages/reconciledNeedReceive'),
  },
  arInvoiceWaitSettlement: {
    name: "待结算账款列表",
    path: "",
    component: () => import('@/pages/clearingAccountsNeedget/index.vue'),
  },
  receivableWaitCertificated: {
    name: "待生成凭证列表",
    path: "",
    component: () => import('@/pages/ReCertificateToBeGenerated'),
  },
  receivableCertificated: {
    name: "已生成凭证列表",
    path: "",
    component: () => import('@/pages/ReCertificateGenerated'),
  },
  arInvoiceCollected: {
    name: "已收账款列表",
    path: "",
    component: () => import('@/pages/ArInvoiceCollected'),
  },
  arInvoiceCollectedDetails: {
    name: "已收账款详情",
    path: "",
    component: () => import('@/pages/ArInvoiceCollected/details'),
    renderMenu: false,
    meta: {
      invisible: true
    }
  },
  arInvoiceInfo: {
    name: "应收-开票信息",
    path: "",
    component: () => import('@/pages/ArInvoiceCollected/invoiceInfo'),
    renderMenu: false,
    meta: {
      invisible: true
    }
  },
  arInvoiceDetails: {
    name: "应收-发票详情",
    path: "",
    component: () => import('@/pages/ReceiveInvoice/invoiceDetails'),
    renderMenu: false,
    meta: {
      invisible: true
    }
  },
  receivableBalance: {
    name: "客户余额管理",
    path: "",
    component: () => import('@/pages/iframeBox'),
  },
  ArInvoiceReceipt: {
    name: "发票管理",
    path: "",
    component: () => import('@/pages/ReceiveInvoice'),
  },
  receivableWaitVerification: {
    name: "应收待核销列表",
    path: "",
    component: () => import('@/pages/ReVerification'),
  },
  receivableVerification: {
    name: "应收已核销列表",
    path: "",
    component: () => import('@/pages/ReVerification'),
  },
  receiveableVerificationDetails: {
    path: "",
    name: "核销详情",
    component: () => import('@/pages/ReVerification/verificationDetails'),
    renderMenu: false,
    meta: {
      invisible: true
    }
  },

  payable: {
    name: "应付",
    path: "",
    component: view.blank,
    icon: "minus-square"
  },
  payableNoReconciliation: {
    name: "待对账列表",
    path: "",
    component: () => import('@/pages/PayableToCheckFor'),
  },
  // payableToCheckFor: {
  //   name: "待对账列表",
  //   path: "",
  //   component: () => import('@/pages/PayableToCheckFor'),
  // },
  payableReconciliated: {
    name: "已对账列表",
    path: "",
    component: () => import('@/pages/reconciledNeedpay'),
  },
  payableWaitCertificated: {
    name: "待生成凭证列表",
    path: "",
    component: () => import('@/pages/PayableCertificateToBeGenerated'),
  },
  payableCertificated: {
    name: "已生成凭证列表",
    path: "",
    component: () => import('@/pages/PayableCertificateGenerated'),
  },

  waitSettleApInvoice: {
    name: "待结算账款列表",
    path: "",
    component: () => import('@/pages/clearingAccountsNeedpay/index.vue'),
  },
  apInvoiceListSettlement: {
    name: "已结算账款列表",
    path: "",
    component: () => import('@/pages/iframeBox'),
  },
  payableWaitVerification: {
    name: "应付待核销列表",
    path: "",
    component: () => import('@/pages/PayableVerification'),
  },
  payableVerification: {
    name: "应付已核销列表",
    path: "",
    component: () => import('@/pages/PayableVerification'),
  },
  payableVerificationDetails: {
    path: "",
    name: "应付核销详情",
    component: () => import('@/pages/PayableVerification/verificationDetails'),
    renderMenu: false,
    meta: {
      invisible: true
    }
  },
  apInvoiceListInvoice: {
    name: "发票管理",
    path: "",
    // component: () => import('@/pages/iframeBox'),
    component: () => import('@/pages/PayableInvoice'),
  },
  payableInvoiceDetails: {
    path: "",
    name: "应付发票编辑",
    component: () => import('@/pages/PayableInvoice/invoiceDetails'),
    renderMenu: false,
    meta: {
      invisible: true
    }
  },
  account: {
    name: "计费",
    path: "",
    component: view.blank,
    icon: 'account-book'
  },
  billingSalePrice: {
    name: "商品销售价格",
    path: "",
    component: () => import('@/pages/iframeBox'),
  },
  billingPurchasePrice: {
    name: "商品采购价格",
    path: "",
    component: () => import('@/pages/iframeBox'),
  },
  billingFees: {
    name: "商品费用项设置",
    path: "",
    component: () => import('@/pages/iframeBox'),
  },
  priceAudit: {
    name: "报价审批",
    path: "",
    component: () => import('@/pages/iframeBox'),
  },
  //--------------------
  //报表管理的路由
  report: {
    name: "报表管理",
    path: "",
    component: view.blank,
  },
  dataReportMa: {
    path: "",
    name: "经营数据采集报表",
    component: view.blank,
    icon: 'bar-chart'
  },
  reportFinance: {
    path: "",
    name: "财务报表",
    component: view.blank,
    icon: 'stock'
  },
  reportSale: {
    path: "",
    name: "产品销售明细表",
    component: () => import('@/pages/reportSale'),
  },
  reportPurchase: {
    path: "",
    name: "产品采购明细表",
    component: () => import('@/pages/reportPurchase'),
  },
  reportSummary: {
    path: "",
    name: "经营汇总数据表",
    component: () => import('@/pages/reportSummary'),
  },
  reportStock: {
    path: "",
    name: "存货数据汇总表",
    component: () => import('@/pages/reportStock'),
  },
  reportInventorySummary: {
    path: "",
    name: "出入库成本表（加权平均）",
    component: () => import('@/pages/reportInventorySummary'),
  },
  reportBatchAccounting: {
    path: "",
    name: "出入库成本表（批次核算）",
    component: () => import('@/pages/reportBatchAccounting'),
  },
  reportInventoryRecord: {
    path: "",
    name: "出入库红冲记录",
    component: () => import('@/pages/reportInventoryRecord'),
  },
  reportReceivableLedger: {
    path: "",
    name: "应收账款明细",
    component: () => import('@/pages/reportAccountsReceivableLedger'),
  },
  reportAgingAnalysis: {
    path: "",
    name: "应收账款账龄分析",
    component: () => import('@/pages/reportAccountsAgingAnalysis'),
  },
  reportOverdueAnalysis: {
    path: "",
    name: "逾期账龄",
    component: () => import('@/pages/reportAccountsOverdueAnalysis'),
  },
  reportDifference: {
    name: "损益报表",
    path: "",
    component: () => import('@/pages/iframeBox'),
    // icon: 'area-chart' reportSettlement
  },
  reportSettlement: {
    name: "结算报表",
    path: "",
    component: () => import('@/pages/iframeBox'),
  },
  newReportSettlement: {
    name: "新结算报表",
    path: "",
    component: () => import('@/pages/reportSettlement'),
  },
  reportCostProfit: {
    name: "成本利润报表",
    path: "",
    component: () => import('@/pages/iframeBox'),
    // icon: 'line-chart'
  },
  reportInternational: {
    name: "国际业务报表",
    path: "",
    component: () => import('@/pages/internationalBusinessStatement'),
  },
  reportSuppliersQuota: {
    name: "供应商占用额度",
    path: "",
    component: () => import('@/pages/reportSuppliersQuota'),
  },
  reportCustomersQuota: {
    name: "客户占用额度",
    path: "",
    component: () => import('@/pages/reportCustomersQuota'),
  },
  ////----------------------------
  //仓库管理
  warehouse: {
    name: "仓库管理",
    path: "",
    component: view.blank,
  },
  warehouseWarehousing: {
    name: "入库",
    path: "",
    component: view.blank,
    icon: 'check-circle'
  },
  warehouseCheckout: {
    name: "出库",
    path: "",
    component: view.blank,
    icon: 'container'
  },
  forOutboundList: {
    name: "待出库列表",
    path: "",
    component: () => import('@/pages/ForOutboundList'),
  },
  outboundList: {
    name: "已出库列表",
    path: "",
    component: () => import('@/pages/outboundList'),
  },
  toBeWarehousedOrder: {
    name: "待入库订单",
    path: "",
    component: () => import('@/pages/ToBeWarehousedOrder'),
  },
  toBeWarehousedOrderAdd: {
    name: "待入库订单新增",
    path: "",
    component: () => import('@/pages/ToBeWarehousedOrder/addWhOrder'),
    renderMenu: false,
    meta: {
      invisible: true,
    }
  },
  putInWarehouseList: {
    name: "入库订单列表",
    path: "",
    component: () => import('@/pages/PutInWarehouseList'),
  },
  warehouses: {
    name: "仓库",
    path: "",
    component: view.blank,
    icon: 'database'
  },
  warehouseList: {
    name: "仓库列表",
    path: "",
    component: () => import('@/pages/warehouse'),
  },
  warehouseLoseoverflower: {
    name: "损溢",
    path: "",
    component: view.blank,
    icon: 'property-safety'
  },
  warehouseShowloseoverflower: {
    name: "报损报溢",
    path: "",
    component: () => import('@/pages/showLoseAndOverflower'),
  },
  warehouseCheckinventory: {
    name: "盘点",
    path: "",
    component: view.blank,
    icon: 'calculator'
  },
  warehouseInventorycheck: {
    name: "库存盘点",
    path: "",
    component: () => import('@/pages/inventoryCheck'),
  },
  //客户管理----------------------------
  partner: {
    name: "客户管理",
    path: "",
    component: view.blank,
  },
  partnerAdd: {
    name: "添加客户信息",
    path: "",
    component: () => import('@/pages/iframeBox'),
  },
  partnerUpdate: {
    name: "编辑客户信息",
    path: "",
    component: () => import('@/pages/iframeBox'),
  },
  //----------------------------------------
  //系统管理------------------------------
  systemManager: {
    path: '',
    name: "系统管理",
    component: view.blank
  },
  setting: {
    path: '',
    name: "设置",
    component: view.page
  },
  permission: {
    path: '',
    name: "权限",
    component: view.page
  },
  //分拣加工
  sortingProcessing: {
    name: "分拣加工",
    path: "",
    component: view.blank,
  },
  toBeProcessedOrder: {
    name: "待加工订单",
    path: "",
    component: () => import('@/pages/ToBeProcessedOrder'),
  },
  sortingProcessingOrder: {
    name: "分拣加工单",
    path: "",
    component: () => import('@/pages/SortingProcessingOrder'),
  },
  sortingProcessingOrderAdd: {
    name: "新增分拣单",
    path: "",
    component: () => import('@/pages/SortingProcessingOrder/SortingProcessingOrderAdd'),
    renderMenu: false,
    meta: {
      invisible: true
    }
  },
  rejectedMaterialOrder: {
    name: "退料单",
    path: "",
    component: () => import('@/pages/RejectedMaterialOrder'),
  },
  baseInformation: {
    name: "基础资料",
    path: "",
    component: view.blank,
    icon: 'hdd'
  },
  workerManager: {
    name: "工人管理",
    path: "",
    component: () => import('@/pages/workerManager'),
  },
  bomList: {
    name: "BOM表",
    path: "",
    component: () => import('@/pages/bomList'),
  },
  processingSorting: {
    name: "分拣加工",
    path: "",
    component: view.blank,
    icon: 'cluster'
  },
  materialRequisition: {
    name: "领料单",
    path: "",
    component: () => import('@/pages/materialRequisition'),
  },
  lossReport: {
    name: "报损单",
    path: "",
    component: () => import('@/pages/showLoseAndOverflower'),
  },
  completeInStock: {
    name: "完工入库单",
    path: "",
    component: () => import('@/pages/completeInStock'),
  },
  dataReport: {
    name: "数据报表",
    path: "",
    component: view.blank,
    icon: 'bar-chart'
  },
  workerKPI: {
    name: "工人绩效",
    path: "",
    component: () => import('@/pages/workerKPI'),
  },
  outputRatio: {
    name: "产出比率",
    path: "",
    component: () => import('@/pages/OutputRatio'),
  },
  //---资源中心
  resourceCenter: {
    name: "资源中心",
    path: "",
    component: view.blank,
  },
  contractMa: {
    path: "",
    name: "合同管理",
    component: view.blank,
    icon: 'solution'
  },
  signableEnterprise: {
    path: "",
    name: "可签企业",
    component: () => import('@/pages/signableEnterprise'),
  },
  organizationCenter: {
    path: "",
    name: "组织中心",
    component: view.blank,
    icon: 'cluster'
  },
  organizationSystem: {
    path: "",
    name: "组织结构",
    component: () => import('@/pages/organizationSystem'),
  },
  partnersManagement: {
    name: "合作商管理",
    path: "",
    component: view.blank,
    icon: 'usergroup-add'
  },
  highseasEnterprise: {
    name: "公海企业",
    path: "",
    component: () => import('@/pages/highseasEnterprise')
  },
  customers: {
    name: "客户",
    path: "",
    component: () => import('@/pages/resourceCenterCustomer')
  },
  suppliers: {
    name: "供应商",
    path: "",
    component: () => import('@/pages/resourceCenterCustomer')
  },

  // parent1: {
  //   name: '父级路由1',
  //   icon: 'dashboard',
  //   component: view.blank
  // },
  // parent2: {
  //   name: '父级路由2',
  //   icon: 'form',
  //   component: view.page
  // },
  // exception: {
  //   name: '异常页',
  //   icon: 'warning',
  //   component: view.blank
  // }
}
export default routerMap