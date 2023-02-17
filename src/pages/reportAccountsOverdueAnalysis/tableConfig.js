export function createColumns(year) {
  return [
    { title: '逾期账龄', dataIndex: 'rowIndex', width: 200, align: 'center' },
    {
      title: '平均余额',
      dataIndex: 'averageBalance',
      width: 200,
      align: 'center'
    },
    {
      title: '迁徙率',
      dataIndex: 'migrationRate',
      width: 200,
      align: 'center',
      scopedSlots: { customRender: 'migrationRate' }
    },
    {
      title: '历史损失率',
      dataIndex: 'lossRate',
      width: 200,
      align: 'center',
      scopedSlots: { customRender: 'lossRate' }
    },
    {
      title: `${year}年12月31日应收账款账面余额`,
      dataIndex: 'bookBalance',
      width: 200,
      align: 'center'
    },
    {
      title: '预期信用损失率',
      dataIndex: 'creditLossRatio',
      width: 200,
      align: 'center',
      scopedSlots: { customRender: 'creditLossRatio' }
    },
    {
      title: '预期信用损失准备',
      dataIndex: 'creditLoss',
      width: 200,
      align: 'center'
    },
    {
      title: `${year}年12月31日应收账款账面价值`,
      dataIndex: 'bookValue',
      width: 200,
      align: 'center'
    },
    {
      title: '1月',
      dataIndex: 'Jan',
      width: 200,
      align: 'center'
    },
    {
      title: '2月',
      dataIndex: 'Feb',
      width: 200,
      align: 'center'
    },
    {
      title: '3月',
      dataIndex: 'Mar',
      width: 200,
      align: 'center'
    },
    {
      title: '4月',
      dataIndex: 'Apr',
      width: 200,
      align: 'center'
    },
    {
      title: '5月',
      dataIndex: 'May',
      width: 200,
      align: 'center'
    },
    {
      title: '6月',
      dataIndex: 'Jun',
      width: 200,
      align: 'center'
    },
    {
      title: '7月',
      dataIndex: 'Jul',
      width: 200,
      align: 'center'
    },
    {
      title: '8月',
      dataIndex: 'Aug',
      width: 200,
      align: 'center'
    },
    {
      title: '9月',
      dataIndex: 'Sep',
      width: 200,
      align: 'center'
    },
    {
      title: '10月',
      dataIndex: 'Oct',
      width: 200,
      align: 'center'
    },
    {
      title: '11月',
      dataIndex: 'Nov',
      width: 200,
      align: 'center'
    },
    {
      title: '12月',
      dataIndex: 'Dec',
      width: 200,
      align: 'center'
    }
  ]
}
/**
 * 将对象转化为特殊表格需求数据
 * @param {*} data
 * @returns
 */
export function generateTableData(data) {
  if (!data) {
    return []
  }
  const columnKey = [
    'avg',
    'migrationRate',
    'historicalLossRate',
    'bookBalanceOfAccountsReceivable',
    'expectedCreditLossRatio',
    'expectedCreditLossAmount',
    'accountsReceivable',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12'
  ]
  const handler = key => {
    return item => {
      if (item) {
        return item + key
      } else {
        return item
      }
    }
  }
  const rowsData = [
    {
      rowIndex: '未逾期',
      rowKeys: columnKey.map(handler('.noOverdue'))
    },
    {
      rowIndex: '逾期1月以内',
      rowKeys: columnKey.map(handler('.overdueWithOneMonth'))
    },
    {
      rowIndex: '逾期1~2个月',
      rowKeys: columnKey.map(handler('.overdueWithOneToTwoMonth'))
    },
    {
      rowIndex: '逾期2~3个月',
      rowKeys: columnKey.map(handler('.overdueWithTwoToThreeMonth'))
    },
    {
      rowIndex: '逾期3~4个月',
      rowKeys: columnKey.map(handler('.overdueWithThreeToFourMonth'))
    },
    {
      rowIndex: '逾期4~5个月',
      rowKeys: columnKey.map(handler('.overdueWithFourToFiveMonth'))
    },
    {
      rowIndex: '逾期5~6个月',
      rowKeys: columnKey.map(handler('.overdueWithFiveToSixMonth'))
    },
    {
      rowIndex: '逾期6~7个月',
      rowKeys: columnKey.map(handler('.overdueWithSixToSevenMonth'))
    },
    {
      rowIndex: '逾期7~8个月',
      rowKeys: columnKey.map(handler('.overdueWithSevenToEightMonth'))
    },
    {
      rowIndex: '逾期8~9个月',
      rowKeys: columnKey.map(handler('.overdueWithEightToNineMonth'))
    },
    {
      rowIndex: '逾期9~10个月',
      rowKeys: columnKey.map(handler('.overdueWithNineToTenMonth'))
    },
    {
      rowIndex: '逾期10~11个月',
      rowKeys: columnKey.map(handler('.overdueWithTenToElevenMonth'))
    },
    {
      rowIndex: '逾期11~12个月',
      rowKeys: columnKey.map(handler('.overdueWithElevenToTwelveMonth'))
    },
    {
      rowIndex: '逾期>12个月',
      rowKeys: columnKey.map(handler('.overdueOverTwelveMonth'))
    }
  ]
  return rowsData.map(item => {
    return {
      rowIndex: item.rowIndex,
      averageBalance: getObjectPropertyValue(data, item.rowKeys[0]),
      migrationRate: getObjectPropertyValue(data, item.rowKeys[1]),
      lossRate: getObjectPropertyValue(data, item.rowKeys[2]),
      bookBalance: getObjectPropertyValue(data, item.rowKeys[3]),
      creditLossRatio: getObjectPropertyValue(data, item.rowKeys[4]),
      creditLoss: getObjectPropertyValue(data, item.rowKeys[5]),
      bookValue: getObjectPropertyValue(data, item.rowKeys[6]),
      Jan: getObjectPropertyValue(data, item.rowKeys[7]),
      Feb: getObjectPropertyValue(data, item.rowKeys[8]),
      Mar: getObjectPropertyValue(data, item.rowKeys[9]),
      Apr: getObjectPropertyValue(data, item.rowKeys[10]),
      May: getObjectPropertyValue(data, item.rowKeys[11]),
      Jun: getObjectPropertyValue(data, item.rowKeys[12]),
      Jul: getObjectPropertyValue(data, item.rowKeys[13]),
      Aug: getObjectPropertyValue(data, item.rowKeys[14]),
      Sep: getObjectPropertyValue(data, item.rowKeys[15]),
      Oct: getObjectPropertyValue(data, item.rowKeys[16]),
      Nov: getObjectPropertyValue(data, item.rowKeys[17]),
      Dec: getObjectPropertyValue(data, item.rowKeys[18])
    }
  })
}

/**
 * 取出嵌套对象属性值
 * @param {*} target
 * @param {*} propString
 */
export function getObjectPropertyValue(target, propString) {
  if (!target) {
    return
  }
  let dep = propString.split('.')
  if (dep.length === 1) {
    return target[propString]
  } else {
    let prop = dep.shift()
    return getObjectPropertyValue(target[prop], dep.join('.'))
  }
}
