import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
// import PageView from '@/layouts/PageView'

// 路由配置
const options = {
  mode: "history",
  routes: [
    {
      path: '/busLogin',
      name: '登录',
      component: () => import('@/pages/busLogin')
    },
    // {
    //   path: '/login',
    //   name: '登录页',
    //   component: () => import('@/pages/login')
    // },

    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/busLogin',
      children: [
        {
          path: 'stage',
          name: '平台管理',
          meta: {

          },
          component: BlankView,
          children: [
            {
              path: 'stagecenter',
              name: '平台管理中心',
              component: BlankView,
              meta: {
                icon: 'home'
              },
              children: [
                {
                  path: 'companyma',
                  name: '公司组织架构管理',
                  component: () => import('@/pages/demo'),

                },
                {
                  path: 'tenant',
                  name: '租户管理',
                  component: () => import('@/pages/demo'),
                },
                {
                  path: 'comsettle',
                  name: '公司结算主体',
                  component: () => import('@/pages/demo'),
                },
                {
                  path: 'warehouse',
                  name: '仓库管理',
                  component: () => import('@/pages/demo'),
                },
                {
                  path: 'userma',
                  name: '用户管理',
                  component: () => import('@/pages/demo'),

                },
                {
                  path: 'rolema',
                  name: '角色管理',
                  component: () => import('@/pages/roleMa'),

                },
                {
                  path: 'funauthma',
                  name: '功能权限管理',
                  component: () => import('@/pages/funauth'),

                },
                {
                  path: 'dataauthma',
                  name: '数据权限管理',
                  component: () => import('@/pages/demo'),
                },
              ]
            },

          ]
        },
        {
          path: 'basicdata',
          name: '基础数据管理',
          meta: {

          },
          component: BlankView,
          children: [
            {
              path: 'supplier',
              name: '供应商',
              component: () => import('@/pages/iframeBox'),
              meta: {
                icon: 'user'
              },
              children: [
                {
                  path: 'supplierlist',
                  name: '供应商列表',
                  component: () => import('@/pages/iframeBox'),
                },
                {
                  path: 'supplierprice',
                  name: '商品报价管理',
                  component: () => import('@/pages/iframeBox'),
                },
                {
                  path: 'suppliercate',
                  name: '商品分类管理',
                  component: () => import('@/pages/iframeBox'),
                },
              ]
            },
            {
              path: 'client',
              name: '客户',
              component: () => import('@/pages/iframeBox'),
              meta: {
                icon: 'tag'
              },
              children: [
                {
                  path: 'clientma',
                  name: '客户管理',
                  component: () => import('@/pages/iframeBox'),
                },
                {
                  path: 'clientstorema',
                  name: '客户门店管理',
                  component: () => import('@/pages/iframeBox'),
                },
                {
                  path: 'clientprice',
                  name: '客户价格管理',
                  component: () => import('@/pages/iframeBox'),
                },
              ]
            },
            {
              path: 'product',
              name: '商品',
              component: () => import('@/pages/iframeBox'),
              meta: {
                icon: 'shopping'
              },
              children: [
                {
                  path: 'productmalist',
                  name: '商品管理列表',
                  component: () => import('@/pages/iframeBox'),
                  meta:{
                    href:"http://saas.diligrp.com:8089/item/list.html"
                  }
                },
                {
                  path: 'productcatema',
                  name: '商品分类管理',
                  component: () => import('@/pages/iframeBox'),
                  meta:{
                    href:"http://saas.diligrp.com:8089/itemSpec/list.html"
                  }
                },
              ]
            },
            {
              path: 'topic',
              name: '内容',
              component: () => import('@/pages/iframeBox'),
              meta: {
                icon: 'tablet'
              },
              children: [
                {
                  path: 'topiclist',
                  name: '专题列表',
                  component: () => import('@/pages/iframeBox'),
                },
                {
                  path: 'releasetopic',
                  name: '发布专题',
                  component: () => import('@/pages/iframeBox'),
                },
                {
                  path: 'topiccate',
                  name: '分类管理',
                  component: () => import('@/pages/iframeBox'),
                },
              ]
            },
          ]
        },
        {
          path: 'inout',
          name: '进销存管理',
          meta: {

          },
          component: BlankView,
          children: [
            {
              path: 'salesma',
              name: '销售',
              component: () => import('@/pages/iframeBox'),
              meta: {
                icon: 'shopping-cart'
              },
              children: [
                {
                  path: 'tosaleorder',
                  name: '销售订单录入',
                  component: () => import('@/pages/iframeBox'),
                },
                {
                  path: 'saleorderlist',
                  name: '销售订单列表',
                  component: () => import('@/pages/iframeBox'),
                },
                {
                  path: 'saledetails',
                  name: '销售明细列表',
                  component: () => import('@/pages/iframeBox'),
                },
              ]
            },
            {
              path: 'purchasema',
              name: '采购',
              component: () => import('@/pages/iframeBox'),
              meta: {
                icon: 'plus-circle'
              },
              children: [
                {
                  path: 'purchaseneed',
                  name: '采购需求',
                  component: () => import('@/pages/iframeBox'),
                },
                {
                  path: 'purchaselist',
                  name: '采购订单列表',
                  component: () => import('@/pages/iframeBox'),
                },
                {
                  path: 'purchasedetails',
                  name: '采购订单明细',
                  component: () => import('@/pages/iframeBox'),
                },
              ]
            },
            {
              path: 'prostocks',
              name: '库存',
              component: () => import('@/pages/iframeBox'),
              meta: {
                icon: 'check-circle'
              },
              children: [
                {
                  path: 'prostocksin',
                  name: '商品入库明细列表',
                  component: () => import('@/pages/iframeBox'),
                },
                {
                  path: 'prostocksout',
                  name: '商品出库明细列表',
                  component: () => import('@/pages/iframeBox'),
                },
                {
                  path: 'prostockson',
                  name: '商品可用库存列表',
                  component: () => import('@/pages/iframeBox'),
                },
                {
                  path: 'prostocksfutures',
                  name: '商品期货库存列表',
                  component: () => import('@/pages/iframeBox'),
                },
                {
                  path: 'prostocksdetails',
                  name: '商品库存期货明细',
                  component: () => import('@/pages/iframeBox'),
                },
              ]
            },
          ]
        },
        {
          path: 'warehouse',
          name: '仓库管理',
          meta: {

          },
          component: BlankView,
          children: [
            {
              path: 'warehousing',
              name: '入库',
              component: () => import('@/pages/iframeBox'),
              meta: {
                icon: 'plus-square'
              },
              children: [
                {
                  path: 'tostored',
                  name: '待入库订单',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'hasstored',
                  name: '已入库列表',
                  component: () => import('@/pages/iframeBox'),

                },
              ]

            },
            {
              path: 'outstock',
              name: '出库',
              component: () => import('@/pages/iframeBox'),
              meta: {
                icon: 'minus-square'
              },
              children: [
                {
                  path: 'tobeout',
                  name: '待出库列表',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'outstocklist',
                  name: '已出库列表',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'outstockorder',
                  name: '出库订单明细',
                  component: () => import('@/pages/iframeBox'),

                },
              ]

            },

            {
              path: 'instock',
              name: '库存',
              component: () => import('@/pages/iframeBox'),
              meta: {
                icon: "check-square"
              },
              children: [
                {
                  path: 'existStocks',
                  name: '现有库存',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'inventory',
                  name: '库存盘点',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'lossOverflow',
                  name: '报损报溢',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'beginInventory',
                  name: '期初库存',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'shelfMa',
                  name: '货架管理',
                  component: () => import('@/pages/iframeBox'),

                },
              ]
            },
            {
              path: 'sorting',
              name: '分拣',
              component: () => import('@/pages/iframeBox'),
              meta: {
                icon: "deployment-unit"
              }
            },
            {
              path: 'loseoverflower',
              name: '损溢',
              component: () => import('@/pages/iframeBox'),
              meta: {
                icon: "user"
              },
              children: [
                {
                  path: 'showloseoverflower',
                  name: '报损报溢',
                  component: () => import('@/pages/iframeBox'),
                }
              ]
            },
            {
              path: 'checkinventory',
              name: '盘点',
              component: () => import('@/pages/iframeBox'),
              meta: {
                icon: "tablet"
              },
              children: [
                {
                  path: 'inventorycheck',
                  name: '库存盘点',
                  component: () => import('@/pages/iframeBox'),
                }
              ]
            },
          ]
        },
        {
          path: 'sortingProcessing',
          name: '分拣加工',
          meta: {

          },
          component: BlankView,
          children: [
            {
              path: 'baseInformation',
              name: '基础资料',
              component: () => import('@/pages/iframeBox'),
              meta: {},
              children: [
                {
                  path: '工人管理',
                  name: 'workerManager',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'BOM表',
                  name: 'bomList',
                  component: () => import('@/pages/iframeBox'),

                }
              ]
            },
            {
              path: 'processingSorting',
              name: '分拣加工',
              component: () => import('@/pages/iframeBox'),
              meta: {},
              children: [
                {
                  path: 'materialRrequisition',
                  name: '领料单',
                  component: () => import('@/pages/iframeBox'),
                },
                {
                  path: 'lossReport',
                  name: '报损单',
                  component: () => import('@/pages/iframeBox'),
                }
              ]
            },
            {
              path: 'dataReport',
              name: '数据报表',
              component: () => import('@/pages/iframeBox'),
              meta: {},
              children: [
                {
                  path: 'workerKPI',
                  name: '工人绩效',
                  component: () => import('@/pages/iframeBox'),
                }
              ]
            }
          ]
        },
        {
          path: 'transportma',
          name: '运输管理',
          meta: {
            // icon: 'warning',
          },
          component: BlankView,
          children: [
            {
              path: 'receipt',
              name: '收货',
              component: () => import('@/pages/iframeBox'),
              meta: {
                icon: 'user-add'
              },
              children: [
                {
                  path: 'toreceipt',
                  name: '待收货列表',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'receipted',
                  name: '已收货单列表',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'receiptAudit',
                  name: '审核列表',
                  component: () => import('@/pages/iframeBox'),

                },
              ]

            },
            {
              path: 'delivery',
              name: '配送',
              component: () => import('@/pages/iframeBox'),
              meta: {
                icon: 'pull-request'
              },
              children: [
                {
                  path: 'todeliverTask',
                  name: '待配送任务列表',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'deliveryDriver',
                  name: '配送司机',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'deliveryLine',
                  name: '配送线路',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'mapMode',
                  name: '地图模式',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'lineMa',
                  name: '线路管理',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'appDl',
                  name: 'APP下载',
                  component: () => import('@/pages/iframeBox'),

                },
              ]

            },

            {
              path: 'signforMa',
              name: '签收',
              component: () => import('@/pages/iframeBox'),
              meta: {
                icon: "diff"
              },
              children: [
                {
                  path: 'toSignfor',
                  name: '待签收列表',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'signedList',
                  name: '已签收列表',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'sluggishGoods',
                  name: '呆滞品列表',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'returnList',
                  name: '退货列表',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'pendingList',
                  name: '待审核列表',
                  component: () => import('@/pages/iframeBox'),

                },
              ]
            },

          ]
        },
        {
          path: 'settlement',
          name: '结算管理',
          meta: {
            // icon: 'warning',
          },
          component: BlankView,
          children: [
            {
              path: 'billing',
              name: '计费',
              component: () => import('@/pages/iframeBox'),
              meta: {
                icon: 'account-book'
              },
              children: [
                {
                  path: 'salesPrice',
                  name: '商品销售价格',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'purchasePrice',
                  name: '商品采购价格',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'quoApproval',
                  name: '报价审批',
                  component: () => import('@/pages/iframeBox'),

                },
              ]

            },
            {
              path: 'receivable',
              name: '应收',
              component: () => import('@/pages/iframeBox'),
              meta: {
                icon: 'plus'
              },
              children: [
                {
                  path: 'reconciliation',
                  name: '待对账列表',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'reconciled',
                  name: '已对账列表',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'invoiceMa',
                  name: '发票管理',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'beSettledList',
                  name: '待结算账款列表',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'paymentsPaid',
                  name: '已付账款列表',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'companyBalance',
                  name: '公司余额',
                  component: () => import('@/pages/iframeBox'),

                },
              ]

            },

            {
              path: 'handle',
              name: '应付',
              component: () => import('@/pages/iframeBox'),
              meta: {
                icon: "minus"
              },
              children: [
                {
                  path: 'reconciliation',
                  name: '待对账列表',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'reconciled',
                  name: '已对账列表',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'invoiceMa',
                  name: '发票管理',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'beSettledList',
                  name: '待结算账款列表',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'receivedList',
                  name: '已收账款列表',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'customerBalance',
                  name: '客户余额管理',
                  component: () => import('@/pages/iframeBox'),

                },
              ]
            },
            {
              path: 'approve',
              name: '审批',
              component: () => import('@/pages/iframeBox'),
              meta: {
                icon: "file-exclamation"
              },
              children: [
                {
                  path: 'pendingFunds',
                  name: '待审批资金',
                  component: () => import('@/pages/iframeBox'),

                },
                {
                  path: 'approvedFunds',
                  name: '已审批资金',
                  component: () => import('@/pages/iframeBox'),

                },

              ]
            },

          ]
        },
        {
          path: 'reportMa',
          name: '报表管理',
          meta: {

          },
          component: BlankView,
          children: [
            {
              path: 'report',
              name: '报表',
              component: () => import('@/pages/iframeBox'),
              meta: {
                icon: 'book'
              },
              children: [
                {
                  path: 'profitLoss',
                  name: '损益报表',
                  component: () => import('@/pages/iframeBox'),
                },
                {
                  path: 'inventoryTable',
                  name: '库存表表',
                  component: () => import('@/pages/iframeBox'),
                },
                {
                  path: 'settlementReport',
                  name: '结算报表',
                  component: () => import('@/pages/iframeBox'),
                },
              ]
            },

          ]
        },
        {
          path: 'systemMa',
          name: '系统管理',
          meta: {

          },
          component: BlankView,
          children: [
            {
              path: 'setting',
              name: '设置',
              component: () => import('@/pages/iframeBox'),
              meta: {
                icon: 'setting'
              },
              children: [

              ]
            },
            {
              path: 'authority',
              name: '权限',
              component: () => import('@/pages/demo'),
              meta: {
                icon: 'lock'
              },
              children: [

              ]
            },

          ]
        },
        // {
        //   path: 'iframe',
        //   name: '内链盒子',
        //   meta: {

        //   },
        //   component: BlankView,
        //   children: [
        //     {
        //       path: 'iframeBox',
        //       name: '内链',
        //       component: () => import('@/pages/iframeBox'),
        //       meta: {
        //         icon: 'setting',
        //         href: "http://saas.diligrp.com:8089/item/list.html"
        //         // href: "http://saas.diligrp.com:8089/item/list.html?code=externalLink"

        //       },

        //     },


        //   ]
        // },
        // {
        //   name: '验权页面',
        //   path: 'auth/demo',
        //   meta: {
        //     icon: 'file-ppt',
        //     authority: {
        //       permission: 'form',
        //       role: 'manager'
        //     },
        //     component: () => import('@/pages/demo')
        //   }
        // }
      ]
    }
  ]
}

export default options
