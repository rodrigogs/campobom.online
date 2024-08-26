import { Alert, Stack } from '@mui/material'
import { type ReactNode, forwardRef, useImperativeHandle, useState } from 'react'

export type AlertType = 'success' | 'error' | 'info' | 'warning'

export type AlertProps = {
  type: AlertType
  text: string
  icon?: ReactNode
  closeable?: boolean
  timeout?: number
}

export interface AppAlertHandle {
  showAlert: (type: AlertProps['type'], text: string, icon?: ReactNode, closeable?: boolean, timeout?: number) => void;
  dismissAlert: () => void;
}

export const AppAlert = forwardRef<AppAlertHandle>((_props, ref) => {
  AppAlert.displayName = 'AppAlert'
  const [alert, setAlert] = useState<AlertProps | null>(null)

  useImperativeHandle(ref, () => ({
    showAlert: (type, text, icon, closeable, timeout) => {
      setAlert({ type, text, icon, closeable, timeout })

      if (timeout) {
        setTimeout(() => {
          setAlert(null)
        }, timeout)
      }
    },
    dismissAlert: () => {
      setAlert(null)
    },
  }))

  return (
    <div>
      {alert && (
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert
            severity={alert.type}
            sx={{ width: '100%', marginBottom: 2 }}
            onClose={alert.closeable ? () => setAlert(null) : undefined}
            icon={alert.icon ? alert.icon : undefined}
          >
            {alert.text}
          </Alert>
        </Stack>
      )}
    </div>
  )
})

// Usage Example
// import React, { useRef } from 'react';
// import { AppAlert, AppAlertHandle } from './AppAlert';
// import { Button } from '@mui/material';

// const MyComponent = () => {
//   const alertRef = useRef<AppAlertHandle>(null);

//   const handleShowAlert = () => {
//     alertRef.current?.showAlert('success', 'This is a success alert — check it out!', null, true);
//   };

//   return (
//     <div>
//       <Button onClick={handleShowAlert}>Show Alert</Button>
//       <AppAlert ref={alertRef} />
//     </div>
//   );
// };

// export default MyComponent;
