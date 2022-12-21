import { Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'

export default function DialogLayout(props: {
  open: boolean
  children: any
  dialogActions?: any
  onClose?: any
  dialogTitle?: string
  noFullScreen?: boolean
}) {
  const { children, open, onClose, dialogTitle, dialogActions, noFullScreen } = props
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Dialog open={open} onClose={onClose} scroll="paper" fullScreen={isSmallScreen && !noFullScreen} keepMounted sx={{ p: '0px' }}>
      {dialogTitle && <DialogTitle>{dialogTitle}</DialogTitle>}
      <DialogContent dividers={true} sx={{ p: '12px' }}>
        {children}
      </DialogContent>
      {dialogActions && <DialogActions>{dialogActions()}</DialogActions>}
    </Dialog>
  )
}
