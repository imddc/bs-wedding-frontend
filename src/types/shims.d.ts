import type { useDialog, useLoadingBar, useMessage, useModal, useNotification } from 'naive-ui'

export {}

declare global {
  interface Window {
    $message: ReturnType<typeof useMessage>
    $dialog: ReturnType<typeof useDialog>
    $loadingBar: ReturnType<typeof useLoadingBar>
    $modal: ReturnType<typeof useModal>
    $notification: ReturnType<typeof useNotification>
  }
}
