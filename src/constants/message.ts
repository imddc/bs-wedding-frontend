export const MESSAGE_TABLE_COLUMNS = [
  {
    title: 'ID',
    key: 'id',
    width: 80,
  },
  {
    title: '发送者ID',
    key: 'senderId',
    width: 100,
  },
  {
    title: '接收者ID',
    key: 'receiverId',
    width: 100,
  },
  {
    title: '消息内容',
    key: 'content',
    width: 300,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '已读状态',
    key: 'isRead',
    width: 100,
  },
  {
    title: '发送时间',
    key: 'createTime',
    width: 180,
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
  },
]

export const INITIAL_QUERY_PARAMS = {
  current: 1,
  size: 10,
}

export const PAGINATION_CONFIG = {
  pageSizes: [10, 20, 50, 100],
  showSizePicker: true,
  showQuickJumper: true,
  pageSlot: 7,
}

export const READ_STATUS_OPTIONS = [
  { label: '全部', value: null },
  { label: '已读', value: true },
  { label: '未读', value: false }
]
