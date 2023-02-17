
const localRouterData=[
    {
        parentCode: "processing_sorting",
        routeChildrens: [
          {
            children: [],
            code: "sorting_processing_order_add",
            description: "",
            id: "",
            meta: { href: "" },
            metadata: {},
            name: "分拣加工单明细",
            parentId: "",
            router: "sortingProcessingOrderAdd",
            type: 2,
            url: "",
          },
         
        ],
      },
    {
        parentCode: "pick_up",
        routeChildrens: [
          {
            children: [],
            code: "pickUpOrder_pickUp_router",
            description: "",
            id: "",
            meta: { href: "" },
            metadata: {},
            name: "收货录入单",
            parentId: "",
            router: "pickUpOrderPickUpRouter",
            type: 2,
            url: "",
          },
         
        ],
      },
    {
        parentCode: "purchase",
        routeChildrens: [
          {
            children: [],
            code: "require_order_confirm",
            description: "",
            id: "",
            meta: { href: "" },
            metadata: {},
            name: "采购单确认",
            parentId: "",
            router: "requireOrderConfirm",
            type: 2,
            url: "",
          },
          {
            children: [],
            code: "purchase_order_head_add_edit",
            description: "",
            id: "",
            meta: { href: "" },
            metadata: {},
            name: "采购订单",
            parentId: "",
            router: "purchaseOrderHeadAddEdit",
            type: 2,
            url: "",
          },
         
        ],
      },
    {
        parentCode: "signed",
        routeChildrens: [
          {
            children: [],
            code: "wait_for_signed_new",
            description: "",
            id: "",
            meta: { href: "" },
            metadata: {},
            name: "签收单",
            parentId: "",
            router: "waitForSignedNew",
            type: 2,
            url: "",
          },
         
        ],
      },
    {
        parentCode: "item",
        routeChildrens: [
          {
            children: [],
            code: "item_add",
            description: "",
            id: "",
            meta: { href: "" },
            metadata: {},
            name: "商品",
            parentId: "",
            router: "itemAdd",
            type: 2,
            url: "",
          },
         
        ],
      },
    {
        parentCode: "receiveable",
        routeChildrens: [
          {
            children: [],
            code: "receiveable_verification_details",
            description: "",
            id: "",
            meta: { href: "" },
            metadata: {},
            name: "应收核销详情",
            parentId: "",
            router: "receiveableVerificationDetails",
            type: 2,
            url: "",
          },
          {
            children: [],
            code: "arInvoiceCollected_details",
            description: "",
            id: "",
            meta: { href: "" },
            metadata: {},
            name: "应收-已收账款详情",
            parentId: "",
            router: "arInvoiceCollectedDetails",
            type: 2,
            url: "",
          },
          {
            children: [],
            code: "arInvoice_info",
            description: "",
            id: "",
            meta: { href: "" },
            metadata: {},
            name: "应收-开票信息",
            parentId: "",
            router: "arInvoiceInfo",
            type: 2,
            url: "",
          },
          {
            children: [],
            code: "arInvoice_details",
            description: "",
            id: "",
            meta: { href: "" },
            metadata: {},
            name: "应收-发票详情",
            parentId: "",
            router: "arInvoiceDetails",
            type: 2,
            url: "",
          },
         
        ],
      },
    {
        parentCode: "payable",
        routeChildrens: [
          {
            children: [],
            code: "payable_verification_details",
            description: "",
            id: "",
            meta: { href: "" },
            metadata: {},
            name: "应付核销详情",
            parentId: "",
            router: "payableVerificationDetails",
            type: 2,
            url: "",
          },
          //发票
          {
            children: [],
            code: "payable_invoice_details",
            description: "",
            id: "",
            meta: { href: "" },
            metadata: {},
            name: "应付发票详情",
            parentId: "",
            router: "payableInvoiceDetails",
            type: 2,
            url: "",
          },
         
        ],
      },
]
export  {localRouterData}